/* HYPER-OPTICS · sims/everyday-optical-systems.js — simulations of the topic "Everyday systems" (ids es-…)
 *   es-phone       a phone camera module, part by part: sensor class, pixels, binning, f-number against the Airy disc
 *   es-camera      an interchangeable-lens camera, SLR or mirrorless: mount, flange distance, mirror and pentaprism, shutter, sensor
 *   es-projector   a data projector from lamp to screen, and the room: throw ratio, lumens, ambient light, contrast
 *   es-display     an LCD between crossed polarizers (the plane turned by a voltage), OLED, pixel density against the eye
 *   es-headset     a VR magnifier, a pancake lens and an AR waveguide; the vergence–accommodation conflict
 *   es-mouse       an optical mouse (frames shifted and correlated) and an incremental encoder (quadrature)
 *   es-photoeye    a remote control's coded bursts and four photoelectric sensors
 *   es-fibre       a passive optical network: splitter, decibel budget, photons per bit
 *   es-headlamp    a dipped beam on the road: cut-off, aim, load tilt, reflector against projector
 *   es-lighthouse  a Fresnel lens in section (refracting rings and total-reflection prisms) and a rotating beam seen from above
 *   es-night       an image intensifier at low light and a thermal camera's picture
 * Numbers come from kit.optics (O.cam, O.diff, O.mtf, O.photo, O.pol, O.fibre, O.sys, O.criticalAngle, O.index …); the drawing
 * from kit.osym and the canvas. The module cut-aways are schematic and say so; the lens of es-camera is a real prescription.
 * Static pictures redraw on a change; moving ones (the shutter, a rotating beam, frames of noise) run the loop.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI, FONT = 'system-ui, sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const sig = (v, n) => { const a = Math.abs(v); if (!(a > 0)) return '0'; const d = Math.max(0, (n || 3) - 1 - Math.floor(Math.log10(a))); return v.toFixed(Math.min(d, 6)); };
  const fmtLen = mm => mm >= 1000 ? sig(mm / 1000, 3) + ' m' : mm >= 10 ? sig(mm, 3) + ' mm' : mm >= 0.1 ? sig(mm, 3) + ' mm' : sig(mm * 1000, 3) + ' µm';

  /* text helpers bound to a stage: text that is shrunk or cut to fit and kept on the stage; wrapped paragraphs; a caption card */
  function tools(st, kit) {
    function txt(c, str, x, y, o) {
      o = o || {};
      str = String(str);
      let size = o.size || 12;
      const weight = o.weight || 500;
      c.save();
      c.font = weight + ' ' + size + 'px ' + FONT;
      const maxW = o.maxW || (st.W - 8);
      let w = c.measureText(str).width;
      while (w > maxW && size > 8.5) { size -= 0.5; c.font = weight + ' ' + size + 'px ' + FONT; w = c.measureText(str).width; }
      if (w > maxW) { while (str.length > 2 && c.measureText(str + '…').width > maxW) str = str.slice(0, -1); str += '…'; w = c.measureText(str).width; }
      const al = o.align || 'left';
      const xx = al === 'left' ? clamp(x, 4, Math.max(4, st.W - 4 - w)) : al === 'right' ? clamp(x, Math.min(st.W - 4, 4 + w), st.W - 4) : clamp(x, Math.min(st.W / 2, 4 + w / 2), Math.max(st.W / 2, st.W - 4 - w / 2));
      c.textAlign = al; c.textBaseline = o.baseline || 'middle'; c.fillStyle = o.color || kit.colors().text;
      c.fillText(str, xx, y);
      c.restore();
      return w;
    }
    function lines(c, str, maxW, size, weight) {
      c.save(); c.font = (weight || 500) + ' ' + size + 'px ' + FONT;
      const words = String(str).split(' '), out = [];
      let cur = '';
      for (const w of words) { const t = cur ? cur + ' ' + w : w; if (cur && c.measureText(t).width > maxW) { out.push(cur); cur = w; } else cur = t; }
      if (cur) out.push(cur);
      c.restore();
      return out;
    }
    /* a card with a title and a wrapped text, the text shrinking until it fits */
    function caption(c, x, y, w, h, name, text) {
      const C = kit.colors();
      c.save(); c.fillStyle = C.surface; c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.rect(x, y, w, h); c.fill(); c.stroke(); c.restore();
      let size = 12.5, ls = [];
      for (; size >= 9; size -= 0.5) { ls = lines(c, text, w - 16, size, 500); if (ls.length * (size + 3.5) + size + 18 <= h) break; }
      txt(c, name, x + 8, y + 13, { size: Math.min(13.5, size + 1), weight: 700, color: C.accent, maxW: w - 16 });
      const lh = size + 3.5;
      ls.forEach((l, i) => { if (y + 28 + lh * i < y + h - 2) txt(c, l, x + 8, y + 29 + lh * i, { size, color: C.text, maxW: w - 12 }); });
    }
    /* a numbered badge */
    function badge(c, n, x, y, on) {
      const C = kit.colors();
      c.save(); c.beginPath(); c.arc(x, y, 8.5, 0, 2 * PI); c.fillStyle = on ? C.accent : C.surface; c.fill(); c.lineWidth = 1.2; c.strokeStyle = on ? C.accent : C.faint; c.stroke(); c.restore();
      txt(c, n, x, y + 0.5, { size: 10.5, weight: 700, color: on ? (C.dark ? '#10142a' : '#ffffff') : C.muted, align: 'center', maxW: 16 });
    }
    return { txt, lines, caption, badge };
  }
  const glassFill = C => C.dark ? 'rgba(130,190,255,0.28)' : 'rgba(60,130,220,0.20)';
  const bodyFill = C => C.dark ? '#262c48' : '#d5dae8';

  /* ================================================================ the phone camera */
  Hyper.sim('es-phone', {
    title: 'Inside a phone camera, part by part',
    blurb: `A phone camera module drawn from the cover glass to the processor (a schematic cut-away; the numbers are computed). Move the slider to follow the light part by part. Underneath, the Airy disc of the lens is drawn to scale over the pixel grid.

**Try this**
- Pick the **200 megapixel** sensor of the 1/1.3-inch class at f/1.8: the pixels are about 0.6 µm and the Airy disc covers about four of them across. Now choose **4 × 4 binning**: sixteen pixels act as one of 2.4 µm.
- Close the aperture to **f/3.5**: the Airy disc grows, the lens MTF at the pixel Nyquist falls, and the pixel count stops mattering.
- Choose the **periscope** camera: the focal length is longer than the phone is thick, so the light is folded by a prism.
- Switch to a **7 mm sensor** at the same megapixels: the pixels shrink, and so does the light each collects.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 440, maxH: 580 });
      const T = tools(st, kit);
      const NAMES = ['Cover glass', 'Lens stack', 'Aperture', 'Motors', 'Infrared-cut filter', 'Microlens and colour filter', 'Pixels', 'Processor'];
      const ctl = kit.controls(box.side, [
        { id: 'cam', type: 'select', label: 'Camera', options: [['Ultra-wide (13 mm equivalent)', 13], ['Main (24 mm equivalent)', 24], ['Telephoto (70 mm equivalent)', 70], ['Periscope telephoto (120 mm equivalent)', 120]], value: params.cam || 24 },
        { id: 'size', type: 'select', label: 'Sensor', options: [['About 7 mm diagonal (1/2.55-inch class)', 7], ['About 9.5 mm (1/1.7-inch class)', 9.5], ['About 12.3 mm (1/1.3-inch class)', 12.3], ['16 mm (one-inch type)', 16]], value: params.size || 12.3 },
        { id: 'mp', type: 'select', label: 'Pixels', options: [['12 megapixels', 12], ['50 megapixels', 50], ['108 megapixels', 108], ['200 megapixels', 200]], value: params.mp || 50 },
        { id: 'bin', type: 'select', label: 'Binning', options: [['none: every pixel on its own', 1], ['2 × 2: four into one', 2], ['3 × 3: nine into one', 3], ['4 × 4: sixteen into one', 4]], value: params.bin || 1 },
        { id: 'N', label: 'f-number', min: 1.4, max: 3.5, step: 0.1, value: params.N || 1.8, fmt: v => 'f/' + v.toFixed(1) },
        { id: 'step', label: 'Follow the light', min: 0, max: 8, step: 1, value: params.step || 0, fmt: v => v < 1 ? 'all parts' : v + ' · ' + NAMES[v - 1] }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length'], ['fov', 'Field of view'], ['pix', 'Pixel pitch'], ['mp', 'Pixels after binning'], ['airy', 'Airy disc (550 nm)'], ['mtf', 'MTF at the pixel\'s Nyquist'], ['fit', 'Does it fit in the phone?']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const D = V.size, sw = 0.8 * D, sh = 0.6 * D;
        const f = V.cam * D / 43.267, fv = O.cam.fov({ f, w: sw, h: sh });
        const nW = Math.sqrt(V.mp * 1e6 * 4 / 3), p = sw / nW * 1000, pb = p * V.bin;
        const airy = 2 * O.diff.airyRadius(550, V.N) * 1e6;
        const nyq = O.mtf.nyquist(pb), mL = O.mtf.diffraction(nyq, 550, V.N), mP = O.mtf.pixel(nyq, pb);
        const per = V.cam === 120, step = V.step;
        const al = k => (step === 0 || step === k) ? 1 : 0.2;
        const ay = 0.255 * H, hs = Math.min(0.12 * H, 0.075 * W);
        // ---- the cut-away (schematic)
        const xc = 0.09 * W, xl0 = 0.17 * W, sp = 0.06 * W, tl = 0.014 * W, xStop = xl0 + sp * 0.55, xF = 0.60 * W, xM = 0.715 * W, xS = 0.745 * W;
        S.axis(c, 0.03 * W, ay, 0.97 * W);
        // 1 cover glass, or the prism of a periscope
        c.save(); c.globalAlpha = al(1);
        if (per) {
          const a = hs * 1.15;
          S.poly(c, [[xc - a, ay - a], [xc + a, ay - a], [xc + a, ay + a]], { fill: glassFill(C) });
          S.ray(c, [[xc, ay - a - 0.07 * H], [xc, ay]], { nm: 550, width: 1.6 });
          T.txt(c, 'light in', xc + 6, ay - a - 0.065 * H, { size: 10.5, color: C.muted });
        } else { c.fillStyle = glassFill(C); c.strokeStyle = S.edge(); c.lineWidth = 1; c.beginPath(); c.rect(xc, ay - hs * 1.3, 0.012 * W, hs * 2.6); c.fill(); c.stroke(); }
        c.restore();
        const rays = [];
        const xin = per ? xc + hs * 1.15 : 0.03 * W, gap = hs * 0.95 * (1.4 / V.N);
        for (let i = 0; i < 5; i++) {
          const u = (i - 2) / 2;
          rays.push([[xin, ay + u * hs * 0.95], [xl0, ay + u * hs * 0.95], [xStop, ay + u * gap], [xl0 + sp * 5 + tl, ay + u * hs * 0.30], [xS - 0.004 * W, ay]]);
        }
        c.save(); c.globalAlpha = Math.max(al(2), al(3)) * 0.9; rays.forEach(r => S.ray(c, r, { nm: 550, width: 1.2, arrows: false })); c.restore();
        // 2 the six moulded elements (schematic shapes)
        c.save(); c.globalAlpha = al(2);
        const RS = [[1.7, -2.4], [-2.2, 5], [3, -2], [-1.6, 3], [2.5, -4], [-3, 1.6]];
        for (let i = 0; i < 6; i++) { const h = hs * (1.2 - i * 0.08); S.lens(c, xl0 + sp * i, ay, h, { R1: RS[i][0] * h, R2: RS[i][1] * h, t: tl, fill: glassFill(C) }); }
        c.restore();
        // 3 the aperture
        c.save(); c.globalAlpha = al(3); S.stop(c, xStop, ay, hs * 1.3, gap); c.restore();
        // 4 the focusing and stabilizing motors
        c.save(); c.globalAlpha = al(4); c.strokeStyle = C.muted; c.fillStyle = C.surface; c.lineWidth = 1;
        for (const sgn of [-1, 1]) { const y0 = sgn < 0 ? ay - hs * 1.4 - 12 : ay + hs * 1.4 + 3; c.beginPath(); c.rect(xl0 - 5, y0, sp * 5 + tl + 10, 9); c.fill(); c.stroke(); c.beginPath(); for (let x = xl0; x < xl0 + sp * 5 + tl; x += 5) { c.moveTo(x, y0 + 1); c.lineTo(x + 2, y0 + 8); } c.stroke(); }
        c.restore();
        // 5 the infrared-cut filter
        c.save(); c.globalAlpha = al(5); c.fillStyle = 'rgba(90,150,255,0.45)'; c.strokeStyle = S.edge(); c.lineWidth = 1; c.beginPath(); c.rect(xF, ay - hs * 0.75, 0.01 * W, hs * 1.5); c.fill(); c.stroke(); c.restore();
        // 6 microlenses and the colour filter mosaic; 7 the pixels

        c.save(); c.globalAlpha = al(6);
        const cf = ['#e0463c', '#34b45c', '#e0463c', '#34b45c', '#3c6ee0', '#34b45c', '#3c6ee0', '#34b45c'];
        for (let i = 0; i < 8; i++) { const y0 = ay - hs * 0.8 + i * hs * 1.6 / 8; c.fillStyle = cf[i]; c.fillRect(xM + 7, y0 + 1, 4, hs * 1.6 / 8 - 2); c.strokeStyle = S.edge(); c.beginPath(); c.arc(xM + 7, y0 + hs * 0.8 / 8, hs * 0.75 / 8, -PI / 2, PI / 2, true); c.stroke(); }
        c.restore();
        c.save(); c.globalAlpha = al(7); S.sensor(c, xS, ay, hs * 0.8, { pixels: 8 }); c.restore();
        // 8 the processor
        c.save(); c.globalAlpha = al(8); c.fillStyle = C.surface; c.strokeStyle = step === 8 ? C.accent : C.faint; c.lineWidth = 1.4; c.beginPath(); c.rect(0.83 * W, ay - hs * 0.8, 0.13 * W, hs * 1.6); c.fill(); c.stroke(); c.restore();
        T.txt(c, 'processor', 0.895 * W, ay - 4, { size: 10.5, align: 'center', color: C.muted, maxW: 0.12 * W });
        T.txt(c, 'frames → picture', 0.895 * W, ay + 9, { size: 9.5, align: 'center', color: C.faint, maxW: 0.12 * W });
        kit.arrow(c, xS + 14, ay, 0.83 * W - 2, ay, C.muted, 1.2, 6);
        // numbered badges in the order of the light, joined to their parts
        const ax = [xc + 3, xl0 + 3, xStop, xl0 + sp * 3, xF + 4, xM + 8, xS + 4, 0.895 * W], tyb = 0.035 * H + 9;
        ax.forEach((x, i) => {
          const xb = lerp(0.06, 0.94, i / 7) * W;
          c.save(); c.strokeStyle = C.faint; c.globalAlpha = 0.6; c.lineWidth = 1; c.beginPath(); c.moveTo(xb, tyb + 9); c.lineTo(x, i === 3 ? ay - hs * 1.4 - 13 : ay - hs * 1.45 - 14); c.stroke(); c.restore();
          T.badge(c, i + 1, xb, tyb, step === 0 || step === i + 1);
        });
        T.txt(c, 'schematic cut-away', W - 8, ay + hs * 1.9, { align: 'right', size: 10.5, color: C.faint, maxW: 0.4 * W });
        // ---- the Airy disc over the pixel grid, to scale
        const by = 0.57 * H, bs = Math.min(0.40 * W, 0.37 * H), bx = 0.04 * W, cx = bx + bs / 2, cy = by + bs / 2;
        const area = Math.max(4.2 * pb, airy * 1.3), sc = bs / area;
        c.fillStyle = C.surface; c.fillRect(bx, by, bs, bs);
        c.save(); c.beginPath(); c.rect(bx, by, bs, bs); c.clip();
        if (p * sc >= 3 && V.bin > 1) {
          c.strokeStyle = C.faint; c.globalAlpha = 0.6; c.lineWidth = 1; c.beginPath();
          for (let k = -8; k <= 8; k++) for (let m = 1; m < V.bin; m++) {
            const x = cx - pb * sc / 2 + k * pb * sc + m * p * sc, y = cy - pb * sc / 2 + k * pb * sc + m * p * sc;
            c.moveTo(x, by); c.lineTo(x, by + bs); c.moveTo(bx, y); c.lineTo(bx + bs, y);
          }
          c.stroke(); c.globalAlpha = 1;
        }
        c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath();
        for (let k = -8; k <= 8; k++) { const x = cx - pb * sc / 2 + k * pb * sc, y = cy - pb * sc / 2 + k * pb * sc; c.moveTo(x, by); c.lineTo(x, by + bs); c.moveTo(bx, y); c.lineTo(bx + bs, y); }
        c.stroke();
        c.fillStyle = 'rgba(224,160,48,0.22)'; c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, Math.max(1, airy * sc / 2), 0, 2 * PI); c.fill(); c.stroke(); c.setLineDash([]);
        c.restore();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx, by, bs, bs);
        T.txt(c, 'Airy disc (dashed) over the pixels, to scale', bx, by - 10, { size: 10.5, color: C.muted, maxW: bs + 0.1 * W });
        T.txt(c, 'disc ' + sig(airy, 2) + ' µm · pixel ' + sig(pb, 2) + ' µm', bx, by + bs + 11, { size: 10.5, color: C.text, maxW: bs });
        // ---- the caption of the chosen part
        const cxp = bx + bs + 0.03 * W, cw = W - cxp - 0.04 * W;
        const TEXT = [
          'A hard flat window. A smear or a scratch on it scatters the light and shows as haze and flare.',
          'Five to eight moulded plastic elements, nearly all aspheric, bend light from the whole field to a point. Drawn here: six.',
          'A fixed round hole sets the cone of light. At f/' + V.N.toFixed(1) + ' the hole is ' + sig(f / V.N, 2) + ' mm across for this focal length.',
          'A voice-coil motor moves the stack a fraction of a millimetre to focus; stabilization shifts the lens or the sensor against shake.',
          'Silicon sees to about 1100 nm. The filter removes the infrared the eye cannot see, so that colours come out right.',
          'One tiny lens funnels light into each pixel; a red, green or blue filter over it makes the mosaic that software later demosaics.',
          'A photodiode turns photons into charge. Each pixel here is ' + sig(pb, 2) + ' µm; the lens makes a disc of ' + sig(airy, 2) + ' µm.',
          'Demosaics, merges several frames, removes noise and makes the zoom beyond the lens; software supplies much of the final picture.'
        ];
        T.caption(c, cxp, by, cw, bs, step === 0 ? 'Eight parts, in the order the light meets them' : step + '. ' + NAMES[step - 1], step === 0 ? '1 cover glass · 2 lens stack · 3 aperture · 4 motors · 5 infrared filter · 6 microlens and colour mosaic · 7 pixels · 8 processor. Slide "Follow the light" to read each one.' : TEXT[step - 1]);
        // ---- read-outs
        ro.set('f', sig(f, 3) + ' mm (equivalent ' + V.cam + ' mm)');
        ro.set('fov', sig(fv.h * R2D, 3) + '° across, ' + sig(fv.d * R2D, 3) + '° diagonal');
        ro.set('pix', sig(p, 3) + ' µm' + (V.bin > 1 ? ' → ' + sig(pb, 3) + ' µm binned' : ''));
        ro.set('mp', sig(V.mp / (V.bin * V.bin), 3) + ' megapixels of ' + sig(pb, 2) + ' µm');
        ro.set('airy', sig(airy, 3) + ' µm = ' + sig(airy / pb, 2) + ' pixels across');
        ro.set('mtf', 'lens ' + (100 * mL).toFixed(0) + ' % × pixel ' + (100 * mP).toFixed(0) + ' % = ' + (100 * mL * mP).toFixed(0) + ' %');
        ro.set('fit', per ? 'folded by a prism: f = ' + sig(f, 3) + ' mm is longer than the body is thick (about 8 mm)' : f > 8 ? 'f = ' + sig(f, 3) + ' mm exceeds the thickness of about 8 mm: it needs a folded design' : 'yes: f = ' + sig(f, 3) + ' mm, shorter than the body is thick (about 8 mm)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the interchangeable-lens camera */
  Hyper.sim('es-camera', {
    title: 'An interchangeable-lens camera: SLR or mirrorless',
    blurb: `A camera body in section with a real six-element double-Gauss prescription standing in for the lens, scaled to the focal length you choose. The **flange distance** of the mount decides where the lens sits; the sensor is where the lens makes its image.

**Try this**
- Choose a **mirrorless mount** (16–20 mm) and then an **SLR mount** (44–46.5 mm): the same lens moves back, and the SLR needs the room for its mirror and the pentaprism above it.
- On an SLR tick **Mirror up**: the mirror flips away, the shutter opens and the light reaches the sensor. With the mirror down the same light goes up to the focusing screen, where the pentaprism sends it to the eye.
- Make the lens longer (**135 mm**): the whole lens barrel grows in front of the flange, while the body stays the same.
- Choose the **APS-C** sensor: the sensor shrinks, the field of view narrows and the crop factor rises to about 1.5.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 440, maxH: 580 });
      const T = tools(st, kit);
      const base = O.lens('double-gauss'), basePar = Sy.paraxial(base), fno0 = basePar.fno, si = Sy.stopIndex(base);
      const mlab = (id, kind) => kind + ' · ' + O.cam.mount(id).name + ', flange distance ' + O.cam.mount(id).ffd.toFixed(1) + ' mm';
      const SENS = ['Full frame', 'APS-C', '4/3"'];
      const NAME = { slr: ['Mount', 'Lens and iris', 'Mirror', 'Focusing screen and pentaprism', 'Shutter', 'Sensor'], less: ['Mount', 'Lens and iris', 'Shutter', 'Sensor', 'Processor', 'Electronic viewfinder'] };
      const ctl = kit.controls(box.side, [
        { id: 'mount', type: 'select', label: 'Mount', options: [[mlab('EF', 'SLR'), 'EF'], [mlab('F', 'SLR'), 'F'], [mlab('RF', 'Mirrorless'), 'RF'], [mlab('E', 'Mirrorless'), 'E'], [mlab('Z', 'Mirrorless'), 'Z']], value: params.mount || 'EF' },
        { id: 'sensor', type: 'select', label: 'Sensor', options: SENS.map(id => [O.cam.sensor(id).name + ' (' + O.cam.sensor(id).w + ' × ' + O.cam.sensor(id).h + ' mm)', id]), value: params.sensor || 'Full frame' },
        { id: 'f', label: 'Focal length of the lens', min: 70, max: 135, step: 5, value: params.f || 85, unit: 'mm' },
        { id: 'N', type: 'select', label: 'Aperture', options: [['f/3', 3], ['f/4', 4], ['f/5.6', 5.6], ['f/8', 8], ['f/11', 11]], value: params.N || 5.6 },
        { id: 'mirror', type: 'check', label: 'Mirror up: the exposure (SLR)', value: !!params.mirror },
        { id: 'step', label: 'Follow the light', min: 0, max: 6, step: 1, value: params.step || 0, fmt: v => v < 1 ? 'all parts' : 'part ' + v }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ffd', 'Flange distance'], ['rear', 'Rear of the lens'], ['sensor', 'Sensor'], ['fov', 'Field of view of the lens'], ['eq', 'Equivalent focal length'], ['part', 'Part shown']]);
      // a ray folded by the reflex mirror (the line y = z − zm), as drawn in the picture: the part after the mirror is reflected
      function fold(pts, zm, a) {
        const out = [pts[0]];
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], q = pts[i], fp = p[1] - (p[0] - zm), fq = q[1] - (q[0] - zm);
          if (fp * fq <= 0 && fp !== fq) {
            const t = fp / (fp - fq), px = p[0] + t * (q[0] - p[0]), py = p[1] + t * (q[1] - p[1]);
            if (Math.abs(py) <= a) { out.push([px, py]); for (let j = i; j < pts.length; j++) out.push([zm + pts[j][1], pts[j][0] - zm]); return out; }
          }
          out.push(q);
        }
        return out;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const mt = O.cam.mount(V.mount), ffd = mt.ffd, slr = ffd > 40, sens = O.cam.sensor(V.sensor), sh = sens.h;
        const sys = Sy.withFocal(base, V.f);
        sys.surfaces[si].sd = base.surfaces[si].sd * (V.f / basePar.efl) * (fno0 / V.N);
        const par = Sy.paraxial(sys), zs = par.zs, zLast = zs[zs.length - 1];
        const zRear = ffd - par.bfd, zFirst = zRear - zLast;
        const maxSd = Math.max.apply(null, sys.surfaces.map(s => s.sd || 0));
        const m = S.map(st, zFirst - 22, ffd + 28, 62, { left: 10, right: 10, top: 8, bottom: 92, cy: 0.57 });
        const ml = Object.assign({}, m, { X: z => m.X(z + zFirst) });
        const names = slr ? NAME.slr : NAME.less, step = V.step;
        const up = !slr || V.mirror;                       // light reaches the sensor
        const zm = 0.32 * ffd, a = Math.min(sh / 2 + 1, zm - 2), ys = ffd - zm;
        const rect = (z0, y0, z1, y1) => [m.X(z0), m.Y(y1), m.X(z1) - m.X(z0), m.Y(y0) - m.Y(y1)];
        const hl = (k, z0, y0, z1, y1) => { if (step !== k) return; const r = rect(z0, y0, z1, y1); c.save(); c.fillStyle = 'rgba(123,140,255,0.2)'; c.strokeStyle = C.accent; c.lineWidth = 1.6; c.fillRect(r[0], r[1], r[2], r[3]); c.strokeRect(r[0], r[1], r[2], r[3]); c.restore(); };
        // the body: a box with a hump for the prism or the viewfinder
        c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2;
        let r = rect(-3, -42, ffd + 20, 34); c.fillRect(r[0], r[1], r[2], r[3]); c.strokeRect(r[0], r[1], r[2], r[3]);
        if (slr) r = rect(zm - 20, 34, zm + 38, 62); else r = rect(ffd - 18, 34, ffd + 20, 54);
        c.fillRect(r[0], r[1], r[2], r[3]); c.strokeRect(r[0], r[1], r[2], r[3]);
        r = rect(0, -38, ffd + 16, 31); c.fillStyle = C.bg2; c.fillRect(r[0], r[1], r[2], r[3]);
        // the lens barrel, the glass and the rays
        r = rect(zFirst - 3, -maxSd - 4, zRear + 4, maxSd + 4); c.fillStyle = C.dark ? '#39405f' : '#b3bbd1'; c.fillRect(r[0], r[1], r[2], r[3]); c.strokeRect(r[0], r[1], r[2], r[3]);
        r = rect(zFirst - 1.5, -maxSd - 1.5, zRear + 3, maxSd + 1.5); c.fillStyle = C.bg2; c.fillRect(r[0], r[1], r[2], r[3]);
        S.axis(c, m.X(zFirst - 20), m.y0, m.X(ffd + 16));
        S.system(c, sys, ml);
        const fl = Math.atan(Math.hypot(sens.w, sens.h) / 2 / V.f);
        [[0, 0.95, 1.2], [fl * 0.8, 0.45, 1]].forEach(([fld, alpha, w]) => {
          const fan = Sy.fan2d(sys, { nm: 550, n: 5, field: fld, fill: 0.92, zStart: -20, zEnd: par.zImage });
          fan.forEach(rr => {
            let pts = rr.pts.map(p => [p[0] + zFirst, p[1]]);
            if (!up) pts = fold(pts, zm, a);
            c.save(); c.globalAlpha = alpha; S.ray(c, pts.map(p => [m.X(p[0]), m.Y(p[1])]), { nm: 550, width: w, arrows: false }); c.restore();
          });
        });
        // the mount flange, the shutter and the sensor
        c.save(); c.strokeStyle = C.warn; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(m.X(0), m.Y(-47)); c.lineTo(m.X(0), m.Y(40)); c.stroke(); c.restore();
        c.fillStyle = C.dark ? '#c9cfdf' : '#5b6170';
        if (!up) { r = rect(ffd - 4.5, -sh / 2 - 3, ffd - 3, sh / 2 + 3); c.fillRect(r[0], r[1], Math.max(2, r[2]), r[3]); }
        else { r = rect(ffd - 4.5, sh / 2, ffd - 3, sh / 2 + 6); c.fillRect(r[0], r[1], Math.max(2, r[2]), r[3]); r = rect(ffd - 4.5, -sh / 2 - 6, ffd - 3, -sh / 2); c.fillRect(r[0], r[1], Math.max(2, r[2]), r[3]); }
        c.strokeStyle = up ? C.ok : C.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(m.X(ffd), m.Y(-sh / 2)); c.lineTo(m.X(ffd), m.Y(sh / 2)); c.stroke();
        if (slr) {
          // the mirror (down: 45° from lower front to upper rear; up: flat against the screen) and the screen
          const mp = up ? [[zm - a, ys - 3], [zm + a, ys - 6]] : [[zm - a, -a], [zm + a, a]];
          S.flatMirror(c, m.X(mp[0][0]), m.Y(mp[0][1]), m.X(mp[1][0]), m.Y(mp[1][1]), { hatch: false });
          c.strokeStyle = C.muted; c.lineWidth = 2.5; c.beginPath(); c.moveTo(m.X(zm - a), m.Y(ys)); c.lineTo(m.X(zm + a), m.Y(ys)); c.stroke();
          S.poly(c, [[zm - 14, ys + 2], [zm + 14, ys + 2], [zm + 32, ys + 15], [zm + 32, ys + 26], [zm + 2, ys + 29], [zm - 14, ys + 17]].map(p => [m.X(p[0]), m.Y(p[1])]), { fill: glassFill(C) });
          if (!up) { S.ray(c, [[zm, ys + 2], [zm, ys + 19], [zm + 34, ys + 21]].map(p => [m.X(p[0]), m.Y(p[1])]), { nm: 550, width: 1.2, arrows: false }); S.eye(c, m.X(zm + 42), m.Y(ys + 21), 6.5 * m.s, { dir: -1 }); }
          T.txt(c, 'pentaprism', m.X(zm + 8), m.Y(ys + 36), { size: 10, color: C.muted, align: 'center', maxW: 80 });
        } else {
          c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.2;
          r = rect(ffd + 4, -20, ffd + 16, 12); c.fillRect(r[0], r[1], r[2], r[3]); c.strokeRect(r[0], r[1], r[2], r[3]);
          kit.arrow(c, m.X(ffd + 5), m.Y(-4), m.X(ffd + 5) - 0, m.Y(-4), C.muted, 1, 1);
          T.txt(c, 'CPU', m.X(ffd + 10), m.Y(-4), { size: 9.5, color: C.muted, align: 'center', maxW: 30 });
          // the viewfinder: a small display, a magnifier, the eye
          c.fillStyle = C.ok; r = rect(ffd - 12, 38, ffd - 10.5, 50); c.fillRect(r[0], r[1], Math.max(2, r[2]), r[3]);
          S.lens(c, m.X(ffd + 4), m.Y(44), 7 * m.s, { f: 1, bulge: 2.4, t: 3 * m.s });
          S.ray(c, [[ffd - 10, 44], [ffd + 20, 44]].map(p => [m.X(p[0]), m.Y(p[1])]), { nm: 550, width: 1.2, arrows: false });
          S.eye(c, m.X(ffd + 26), m.Y(44), 6.5 * m.s, { dir: -1 });
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(m.X(ffd + 10), m.Y(12)); c.lineTo(m.X(ffd + 10), m.Y(38)); c.stroke(); c.restore();
          T.txt(c, 'viewfinder', m.X(ffd + 6), m.Y(58.5), { size: 10, color: C.muted, align: 'center', maxW: 80 });
        }
        // highlights for the chosen part, and the numbered badges
        hl(1, -4, -maxSd - 6, 6, maxSd + 6); hl(2, zFirst - 4, -maxSd - 5, zRear + 5, maxSd + 5);
        if (slr) { hl(3, zm - a - 3, -a - 3, zm + a + 3, a + 3); hl(4, zm - 16, ys - 3, zm + 34, ys + 31); hl(5, ffd - 7, -sh / 2 - 8, ffd - 2, sh / 2 + 8); hl(6, ffd - 1, -sh / 2 - 3, ffd + 4, sh / 2 + 3); }
        else { hl(3, ffd - 7, -sh / 2 - 8, ffd - 2, sh / 2 + 8); hl(4, ffd - 1, -sh / 2 - 3, ffd + 4, sh / 2 + 3); hl(5, ffd + 3, -22, ffd + 18, 14); hl(6, ffd - 14, 36, ffd + 33, 53); }
        const bpos = slr ? [[0, 44], [zFirst + 0.3 * (zLast), maxSd + 10], [zm + 9, -a - 8], [zm - 18, ys + 22], [ffd - 6, -sh / 2 - 12], [ffd + 7, sh / 2 + 12]]
          : [[0, 44], [zFirst + 0.3 * (zLast), maxSd + 10], [ffd - 6, -sh / 2 - 12], [ffd + 7, sh / 2 + 12], [ffd + 11, -26], [ffd - 22, 54]];
        bpos.forEach((p, i) => T.badge(c, i + 1, m.X(p[0]), m.Y(p[1]), step === 0 || step === i + 1));
        T.txt(c, 'flange', m.X(0) - 4, m.Y(-44), { size: 10, color: C.warn, align: 'right', maxW: 70 });
        T.txt(c, 'flange distance ' + ffd.toFixed(1) + ' mm', m.X(ffd / 2), m.Y(-50.5), { size: 10.5, color: C.muted, align: 'center', maxW: 150 });
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(m.X(0), m.Y(-46.5)); c.lineTo(m.X(ffd), m.Y(-46.5)); c.moveTo(m.X(0), m.Y(-45)); c.lineTo(m.X(0), m.Y(-48)); c.moveTo(m.X(ffd), m.Y(-45)); c.lineTo(m.X(ffd), m.Y(-48)); c.stroke(); c.restore();
        T.txt(c, 'six-element double-Gauss lens, drawn as a stand-in', 10, 14, { size: 10.5, color: C.faint, maxW: W * 0.55 });
        // the caption
        const TEXT = slr ? [
          'A bayonet that locks the lens and holds it exactly ' + ffd.toFixed(1) + ' mm from the sensor plane: the flange focal distance. Lens and body made for the same mount share it.',
          'The lens forms the image; its iris sets the cone of light, here f/' + V.N + ', an entrance pupil of ' + sig(V.f / V.N, 3) + ' mm.',
          'Tilted at 45°, the mirror sends the image up to the focusing screen. For the exposure it flips away, which takes room: that is why the SLR flange distance is long.',
          'The image forms on a ground-glass screen; the pentaprism turns it upright and the right way round for the eye. Light for autofocus and metering is taken here as well.',
          'Two curtains cross the frame in turn; the exposure time is the delay between them. It is closed except during the exposure.',
          'The sensor turns the image into numbers: ' + sens.w + ' × ' + sens.h + ' mm. Some bodies shift it to cancel shake, so every lens benefits.'
        ] : [
          'A bayonet that holds the lens exactly ' + ffd.toFixed(1) + ' mm from the sensor. With no mirror in the way the flange distance is short, and lenses can sit close to the sensor.',
          'The lens forms the image; its iris sets the cone of light, here f/' + V.N + ', an entrance pupil of ' + sig(V.f / V.N, 3) + ' mm.',
          'A mechanical curtain shutter, or an electronic one that reads the sensor row by row. The sensor can stay exposed so that the live view runs.',
          'The sensor turns the image into numbers: ' + sens.w + ' × ' + sens.h + ' mm. Special pixels on it also do phase-detection autofocus.',
          'The processor makes the live picture, runs autofocus and turns the sensor data into a file.',
          'A small display behind a magnifier shows the sensor\'s picture, with exposure and depth of field as they will be recorded.'
        ];
        T.caption(c, 10, H - 78, W - 20, 70, step === 0 ? 'Six parts, in the order the light meets them' : step + '. ' + names[step - 1], step === 0 ? names.map((n, i) => (i + 1) + ' ' + n.toLowerCase()).join(' · ') + '. Slide "Follow the light" to read each one.' : TEXT[step - 1]);
        const crop = sens.crop;
        ro.set('ffd', ffd.toFixed(3) + ' mm' + (slr ? ' (room for a mirror)' : ' (no mirror)'));
        ro.set('rear', zRear > 0 ? sig(zRear, 3) + ' mm inside the body, behind the flange' : sig(-zRear, 3) + ' mm in front of the flange');
        ro.set('sensor', sens.w + ' × ' + sens.h + ' mm, crop factor ' + crop.toFixed(2));
        const fv = O.cam.fov({ f: V.f, sensor: sens });
        ro.set('fov', sig(fv.h * R2D, 3) + '° across, ' + sig(fv.d * R2D, 3) + '° diagonal');
        ro.set('eq', sig(V.f * crop, 3) + ' mm on full frame');
        ro.set('part', step === 0 ? 'all' : names[step - 1]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the data projector */
  Hyper.sim('es-projector', {
    title: 'A data projector, from the lamp to the screen',
    blurb: `The light path of a projector as a chain of six blocks, and the room below it: the picture is **distance ÷ throw ratio** wide, the lumens are spread over its area, and light already in the room adds to black and white alike.

**Try this**
- Double the **distance** at a fixed throw ratio: the picture is twice as wide, four times the area, and the illuminance falls to a quarter.
- Lower the **throw ratio** to 0.5 (a short-throw projector): the same picture from a much shorter distance, with a wider cone and a shorter lens.
- Raise the **room light** from 0 to 100 lx and watch the black bar rise: the contrast falls from 1000:1 to about 14:1 at 3000 lumens.
- Change the **panel**: the block diagram keeps its shape, but the colour and panel stages change, and so does the focal length that gives the same throw ratio.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.88, minH: 470, maxH: 600 });
      const T = tools(st, kit);
      const NAMES = ['Light source', 'Integrator', 'Colour', 'Panel', 'Projection lens', 'Screen'];
      const PANEL = { dlp: { w: 1920 * 0.0054, nm: 'micromirror chip' }, lcd: { w: 15.5, nm: 'three LCD panels' }, lcos: { w: 15.0, nm: 'LCoS panels' } };
      const ctl = kit.controls(box.side, [
        { id: 'panel', type: 'select', label: 'Panel', options: [['Micromirror chip with a colour wheel', 'dlp'], ['Three transmissive LCD panels', 'lcd'], ['LCoS: liquid crystal on mirrors', 'lcos']], value: params.panel || 'dlp' },
        { id: 'src', type: 'select', label: 'Source', options: [['Ultra-high-pressure lamp', 'lamp'], ['LED', 'led'], ['Blue laser and phosphor', 'laser']], value: params.src || 'lamp' },
        { id: 'lm', label: 'Light output', min: 500, max: 10000, value: params.lm || 3000, log: true, sig: 2, unit: 'lm' },
        { id: 'tr', label: 'Throw ratio', min: 0.4, max: 2.5, step: 0.05, value: params.tr || 1.5 },
        { id: 'd', label: 'Distance to the screen', min: 1, max: 8, step: 0.1, value: params.d || 3, unit: 'm' },
        { id: 'amb', label: 'Room light on the screen', min: 0, max: 500, step: 10, value: params.amb != null ? params.amb : 20, unit: 'lx' },
        { id: 'step', label: 'Follow the light', min: 0, max: 6, step: 1, value: params.step || 0, fmt: v => v < 1 ? 'all parts' : v + ' · ' + NAMES[v - 1] }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pic', 'Picture'], ['E', 'Illuminance on the screen'], ['L', 'Ideal matt white screen'], ['room', 'Room light adds'], ['C', 'Contrast the audience sees'], ['f', 'Focal length of the lens'], ['G', 'Étendue the panel and an f/2.4 lens accept']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const step = V.step, pn = PANEL[V.panel];
        const Wp = V.d / V.tr, Hp = Wp * 9 / 16, A = Wp * Hp, diag = Math.hypot(Wp, Hp) / 0.0254;
        const E = V.lm / A, Lw = E / PI, La = V.amb / PI, Cn = 1000, Lb = Lw / Cn;
        const contrast = (Lw + La) / (Lb + La);
        const f = V.tr * pn.w, pa = pn.w * pn.w * 9 / 16, G = O.photo.etendue(pa, Math.atan(1 / (2 * 2.4)), 1);
        // ---- the chain
        const n = 6, gap = 12, bw = (W - 20 - (n - 1) * gap) / n, by = 0.03 * H, bh = 0.17 * H;
        const hs = [0.34, 0.55, 0.55, 0.5, 0.5, 0.7];
        const SUB = [V.src === 'lamp' ? 'lamp' : V.src === 'led' ? 'LED' : 'laser + phosphor', V.panel === 'dlp' ? 'rod' : 'lens arrays', V.panel === 'dlp' ? 'wheel' : 'dichroics', V.panel === 'dlp' ? 'micromirrors' : V.panel === 'lcd' ? '3 × LCD' : 'LCoS', 'zoom, focus', 'matt white'];
        for (let i = 0; i < n; i++) {
          const x = 10 + i * (bw + gap), on = step === 0 || step === i + 1;
          if (i < n - 1) {
            const x1 = x + bw, x2 = x + bw + gap, h1 = hs[i] * bh, h2 = hs[i + 1] * bh, cy = by + bh / 2, lit = step === 0 || step === i + 1 || step === i + 2;
            c.fillStyle = 'rgba(255,205,80,' + (lit ? 0.4 : 0.12) + ')'; c.beginPath(); c.moveTo(x1, cy - h1 / 2); c.lineTo(x2, cy - h2 / 2); c.lineTo(x2, cy + h2 / 2); c.lineTo(x1, cy + h1 / 2); c.closePath(); c.fill();
          }
          c.save(); c.globalAlpha = on ? 1 : 0.5; c.fillStyle = C.surface; c.strokeStyle = step === i + 1 ? C.accent : C.faint; c.lineWidth = step === i + 1 ? 2.4 : 1.2; c.fillRect(x, by, bw, bh); c.strokeRect(x, by, bw, bh); c.restore();
          T.txt(c, ['Source', 'Integrator', 'Colour', 'Panel', 'Lens', 'Screen'][i], x + bw / 2, by + bh * 0.4, { size: 11.5, weight: 650, align: 'center', maxW: bw - 4, color: on ? C.text : C.muted });
          T.txt(c, SUB[i], x + bw / 2, by + bh * 0.72, { size: 10, align: 'center', maxW: bw - 4, color: C.muted });
          T.badge(c, i + 1, x + bw / 2, by + bh + 12, step === 0 || step === i + 1);
        }
        // ---- the room, from above
        const ry = 0.31 * H, rh = 0.29 * H, rw = 0.60 * W, ym = ry + rh / 2, xl = 26;
        const s = Math.min((rw - xl - 30) / V.d, (rh - 14) / Wp), xs = xl + V.d * s, half = Wp * s / 2;
        c.fillStyle = 'rgba(255,205,80,0.22)'; c.strokeStyle = 'rgba(255,205,80,0.7)'; c.lineWidth = 1; c.beginPath(); c.moveTo(xl, ym); c.lineTo(xs, ym - half); c.lineTo(xs, ym + half); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(6, ym - 9, 20, 18); c.strokeRect(6, ym - 9, 20, 18);
        c.strokeStyle = C.text; c.lineWidth = 3.5; c.beginPath(); c.moveTo(xs, ym - half); c.lineTo(xs, ym + half); c.stroke();
        S.dim(c, xl, ry + rh - 2, xs, ry + rh - 2, '', {});
        T.txt(c, 'distance ' + sig(V.d, 2) + ' m', (xl + xs) / 2, ry + rh - 11, { size: 10.5, align: 'center', color: C.muted, maxW: rw });
        T.txt(c, 'width ' + sig(Wp, 3) + ' m', Math.min(xs + 6, rw - 60), ym - half - 8 < ry + 6 ? ry + 8 : ym - half - 8, { size: 10.5, color: C.text, maxW: 90 });
        T.txt(c, 'seen from above', 8, ry + rh + 14, { size: 10, color: C.faint, maxW: 110 });
        // ---- what the audience sees: stacked bars of luminance
        const bx0 = 0.66 * W, bwid = 0.1 * W, top = ry + 16, bot = ry + rh - 16, hmax = bot - top, mx = Lw + La;
        const bar = (x, pic, room, lab) => {
          const hp = hmax * pic / mx, hr = hmax * room / mx;
          c.fillStyle = C.series[1]; c.fillRect(x, bot - hp, bwid, hp);
          c.fillStyle = C.muted; c.fillRect(x, bot - hp - hr, bwid, hr);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x, bot - hp - hr, bwid, hp + hr);
          T.txt(c, lab, x + bwid / 2, bot + 9, { size: 10.5, align: 'center', color: C.muted, maxW: bwid + 20 });
        };
        bar(bx0, Lw, La, 'white'); bar(bx0 + bwid * 1.5, Lb, La, 'black');
        T.txt(c, 'what the audience sees', bx0, ry + 4, { size: 10.5, color: C.muted, maxW: 0.33 * W });
        T.txt(c, 'contrast ' + sig(contrast, 3) + ' : 1', bx0 + bwid * 2.7, ry + rh * 0.45, { size: 11.5, weight: 650, color: contrast < 30 ? C.warn : C.text, maxW: 0.3 * W - bwid * 2.6 });
        T.txt(c, 'orange: picture · grey: room', bx0, ry + rh + 8, { size: 9.5, color: C.faint, maxW: 0.33 * W });
        // ---- the caption
        const TEXT = [
          V.src === 'lamp' ? 'An ultra-high-pressure lamp: an arc about a millimetre long, very bright and hot, with a life of a few thousand hours and a minute of warm-up.' : V.src === 'led' ? 'LEDs: instant on, tens of thousands of hours. The chip is larger than a lamp arc, so less of its light fits through the panel and lens.' : 'Blue laser diodes shine on a spinning phosphor wheel that makes yellow and green; the blue passes on. Small, bright, long-lived.',
          'A glass rod or a pair of lens arrays mixes the light, so that every point of the panel gets the same, and shapes it into the rectangle of the panel.',
          V.panel === 'dlp' ? 'A wheel of red, green and blue segments spins in the beam; the chip shows the red, green and blue pictures in turn, too fast to notice.' : 'Dichroic mirrors split the white light into red, green and blue, one beam for each panel; after the panels they are joined again.',
          V.panel === 'dlp' ? 'About two million micromirrors, each tilting about 12° to send light to the lens or to a dump. Grey is made by timing.' : V.panel === 'lcd' ? 'Three transmissive LCD panels between polarizers: each pixel turns the plane of polarization to let light through or not.' : 'Liquid crystal on a mirror: light enters through a polarizing beam splitter, is turned pixel by pixel and returns through it.',
          'A zoom lens of focal length ' + sig(f, 3) + ' mm for a panel ' + sig(pn.w, 3) + ' mm wide throws the panel onto the screen at throw ratio ' + sig(V.tr, 3) + ': ' + sig(Wp, 3) + ' m wide at ' + sig(V.d, 2) + ' m.',
          'A matt white surface scatters the light to everyone. ' + sig(V.lm, 3) + ' lm over ' + sig(A, 3) + ' m² is ' + sig(E, 3) + ' lx, and an ideal screen shows ' + sig(Lw, 3) + ' cd/m².'
        ];
        T.caption(c, 10, ry + rh + 26, W - 20, H - (ry + rh + 26) - 8, step === 0 ? 'Six parts, in the order the light meets them' : step + '. ' + NAMES[step - 1], step === 0 ? '1 source · 2 integrator · 3 colour · 4 panel · 5 projection lens · 6 screen. Slide "Follow the light" to read each one, and change the distance, throw ratio and room light below.' : TEXT[step - 1]);
        ro.set('pic', sig(Wp, 3) + ' × ' + sig(Hp, 3) + ' m, diagonal ' + sig(diag, 3) + ' in (16:9)');
        ro.set('E', sig(E, 3) + ' lx');
        ro.set('L', sig(Lw, 3) + ' cd/m²');
        ro.set('room', sig(La, 3) + ' cd/m² from ' + sig(V.amb, 3) + ' lx');
        ro.set('C', sig(contrast, 3) + ' : 1 (native ' + Cn + ' : 1)');
        ro.set('f', sig(f, 3) + ' mm (throw ratio × panel width ' + sig(pn.w, 3) + ' mm)');
        ro.set('G', sig(G, 3) + ' mm² sr');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ flat-panel displays */
  Hyper.sim('es-display', {
    title: 'Inside a screen: LCD, OLED and microLED',
    blurb: `The layers of a screen, from the light source up to the eye. For an **LCD** the little arrows show the plane of polarization of the light leaving each layer (computed with Jones calculus): the liquid crystal turns the plane and the crossed front polarizer turns that turning into brightness. For **OLED** and **microLED** there is nothing to turn: each pixel makes its own light. Below, the pixel structure and the sharpness against the eye's one arcminute.

**Try this**
- LCD at a grey level of **100 %**: the cell turns the plane by 90° and the light passes the crossed polarizer. Lower the grey level: the turn shrinks, and the intensity follows sin²θ. Only about 7 % of the backlight leaves even when the pixel is white.
- Switch to **OLED**: the light made equals the grey level, and the circular polarizer at the top takes half of it to stop reflections of the room.
- Choose the **phone**, then the **65-inch 4K television**, and move the viewing distance: the pixels per degree cross 60 (the limit of the eye) at about 0.19 m for the phone and 1.29 m for the television.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 480, maxH: 620 });
      const T = tools(st, kit);
      const DEV = [['Phone, 6.1 in, 2532 × 1170', 6.1, 2532, 1170], ['Laptop, 14 in, 2560 × 1600', 14, 2560, 1600], ['Monitor, 27 in, 3840 × 2160', 27, 3840, 2160], ['Television, 65 in, 3840 × 2160', 65, 3840, 2160], ['Television, 65 in, 7680 × 4320', 65, 7680, 4320]];
      const LAY = {
        lcd: ['Backlight: white LEDs', 'Light guide, diffuser, prism sheets', 'Rear polarizer', 'TFT wiring and liquid crystal', 'Colour filter', 'Front polarizer'],
        oled: ['Backplane: drive transistors', 'Reflective anode', 'Organic emitting layers', 'Thin transparent cathode', 'Encapsulation', 'Circular polarizer'],
        micro: ['Backplane: drive transistors', 'Contact pads', 'microLED chips: R, G, B', 'Common electrode', 'Black matrix', 'Cover glass']
      };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Screen', options: [['LCD with an LED backlight', 'lcd'], ['OLED', 'oled'], ['microLED', 'micro']], value: params.type || 'lcd' },
        { id: 'lvl', label: 'Grey level of the pixel', min: 0, max: 100, step: 1, value: params.lvl != null ? params.lvl : 100, unit: '%' },
        { id: 'dev', type: 'select', label: 'Device', options: DEV.map((d, i) => [d[0], i]), value: params.dev != null ? params.dev : 2 },
        { id: 'dist', label: 'Viewing distance', min: 0.15, max: 4, value: params.dist || 0.55, log: true, sig: 2, unit: 'm' },
        { id: 'step', label: 'Follow the light', min: 0, max: 6, step: 1, value: params.step || 0, fmt: v => v < 1 ? 'all layers' : 'layer ' + v }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['out', 'Light that leaves, for this pixel'], ['th', 'Liquid crystal turns the plane by'], ['ppi', 'Pixel density'], ['one', 'One pixel subtends 1′ at'], ['ppd', 'Pixels per degree at this distance'], ['seen', 'Pixels visible?']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const L = V.lvl / 100, step = V.step, type = V.type, names = LAY[type];
        const th = Math.asin(Math.sqrt(clamp(L, 0, 1)));                 // the turn that gives that grey level between crossed polarizers
        const vH = P.vec('H'), vTw = P.apply(P.rotator(th), vH), vOut = P.chain(vH, [P.rotator(th), P.polarizer(PI / 2)]);
        const Tcell = P.intensity(vOut);
        const frac = type === 'lcd' ? [1, 1, 0.45, 0.27, 0.27 * 0.28, 0.27 * 0.28 * 0.9 * Tcell] : type === 'oled' ? [L, L, L, L, L, 0.5 * L] : [L, L, L, L, L, L];
        // ---- the layers, light going up
        const sh = clamp(0.082 * H, 30, 52), y0 = 0.035 * H + 6, x0 = 30, xr = 0.62 * W;
        const cols = type === 'lcd' ? ['#c9b84a', '#9aa4c4', '#6e7fb0', '#4c9ac4', '#c46a8f', '#6e7fb0'] : type === 'oled' ? ['#7a86b8', '#c9cfdf', '#c46a8f', '#aab2cc', '#9aa4c4', '#6e7fb0'] : ['#7a86b8', '#c9cfdf', '#c46a8f', '#aab2cc', '#4a4f66', '#9aa4c4'];
        for (let k = 1; k <= 6; k++) {
          const y = y0 + (6 - k) * sh, on = step === 0 || step === k;
          c.save(); c.globalAlpha = on ? 1 : 0.4;
          c.fillStyle = cols[k - 1]; c.globalAlpha *= 0.35; c.fillRect(x0, y, xr - x0, sh - 3); c.globalAlpha = on ? 1 : 0.4;
          c.strokeStyle = step === k ? C.accent : C.faint; c.lineWidth = step === k ? 2.4 : 1; c.strokeRect(x0, y, xr - x0, sh - 3);
          c.restore();
          T.badge(c, k, 17, y + sh / 2 - 1.5, on);
          T.txt(c, names[k - 1], x0 + 8, y + (sh - 3) / 2, { size: 11.5, weight: 600, color: on ? C.text : C.muted, maxW: xr - x0 - 74 });
          T.txt(c, sig(100 * frac[k - 1], 2) + ' %', xr - 6, y + (sh - 3) / 2, { size: 11, align: 'right', color: on ? C.text : C.muted, maxW: 60 });
          // the plane of polarization of the light that leaves this layer (LCD only)
          if (type === 'lcd') {
            const xa = xr + 0.1 * W, ya = y + (sh - 3) / 2, len = 13;
            c.save(); c.globalAlpha = on ? 1 : 0.4; c.strokeStyle = C.series[1]; c.fillStyle = C.series[1]; c.lineWidth = 2; c.lineCap = 'round';
            if (k <= 2) { for (let a = 0; a < 3; a++) { const an = a * PI / 3; c.beginPath(); c.moveTo(xa - Math.cos(an) * 9, ya + Math.sin(an) * 9); c.lineTo(xa + Math.cos(an) * 9, ya - Math.sin(an) * 9); c.stroke(); } }
            else {
              const az = k <= 3 ? 0 : k <= 5 ? P.ellipse(vTw).azimuth : PI / 2, amp = k === 6 ? Math.sqrt(Tcell) : 1, ln = len * (0.25 + 0.75 * amp);
              const ex = Math.cos(az) * ln, ey = -Math.sin(az) * ln;
              c.beginPath(); c.moveTo(xa - ex, ya - ey); c.lineTo(xa + ex, ya + ey); c.stroke();
              c.beginPath(); c.arc(xa + ex, ya + ey, 2.6, 0, 2 * PI); c.fill(); c.beginPath(); c.arc(xa - ex, ya - ey, 2.6, 0, 2 * PI); c.fill();
            }
            c.restore();
          }
        }
        kit.arrow(c, W - 16, y0 + 6 * sh - 6, W - 16, y0 + 4, C.warn, 2, 8);
        T.txt(c, 'light', W - 10, y0 + 6 * sh + 4, { size: 10, align: 'right', color: C.warn, maxW: 50 });
        if (type === 'lcd') T.txt(c, 'polarization plane', xr + 0.1 * W, y0 - 8, { size: 10, align: 'center', color: C.series[1], maxW: W - xr - 60 });
        // ---- the pixel structure and the sharpness
        const dv = DEV[V.dev], ppi = Math.hypot(dv[2], dv[3]) / dv[1], pitch = 25400 / ppi;
        const ppd = 1 / (Math.atan(pitch * 1e-6 / V.dist) * R2D), oneArc = pitch * 1e-6 / Math.tan(1 / 60 * D2R);
        const yb = y0 + 6 * sh + 14, pw = Math.min(0.34 * W / 6, 0.15 * H / 4), bx = 0.04 * W;
        S.cells(c, bx, yb, 6 * pw, 4 * pw, 18, 4, (u, v) => { const i = Math.floor(u * 18), sub = i % 3, px = Math.floor(i / 3), py = Math.floor(v * 4); if (px + py < 3 || L < 0.01) return [10, 10, 14]; const b = 255 * Math.pow(L, 1 / 2.2); return sub === 0 ? [b, 0, 0] : sub === 1 ? [0, b, 0] : [0, 0, b]; });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx, yb, 6 * pw, 4 * pw);
        T.txt(c, 'pixels = red, green, blue subpixels', bx, yb - 7, { size: 10, color: C.muted, maxW: 0.5 * W });
        T.txt(c, 'pitch ' + sig(pitch, 3) + ' µm', bx, yb + 4 * pw + 10, { size: 10.5, color: C.text, maxW: 6 * pw + 10 });
        const gx = bx + 6 * pw + 0.04 * W, gw = W - gx - 0.05 * W, gy = yb + 6;
        c.fillStyle = C.surface; c.fillRect(gx, gy, gw, 14);
        c.fillStyle = ppd >= 60 ? C.ok : C.warn; c.fillRect(gx, gy, gw * clamp(ppd / 120, 0, 1), 14);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(gx + gw * 0.5, gy - 4); c.lineTo(gx + gw * 0.5, gy + 18); c.stroke();
        T.txt(c, sig(ppd, 3) + ' pixels per degree', gx, gy + 29, { size: 11, color: C.text, maxW: gw });
        T.txt(c, 'the line marks 60: one arcminute per pixel', gx, gy + 43, { size: 10, color: C.muted, maxW: gw });
        T.txt(c, ppd >= 60 ? 'pixels beyond what the eye resolves' : 'pixels can be told apart', gx, gy + 57, { size: 10, color: C.muted, maxW: gw });
        // ---- the caption
        const TEXT = {
          lcd: ['The only light in the screen is made here: blue LEDs under a yellow phosphor, or blue LEDs with quantum dots, along the edge or behind the panel.', 'A light guide and diffuser spread the light evenly; prism sheets turn it towards the viewer so that less is wasted to the sides.', 'The rear polarizer passes one plane of vibration only: at least half of the light is gone here (round value: 0.45 is left).', 'A voltage on each subpixel untwists the crystal and with it the turning of the plane. Here the cell turns the plane by ' + sig(th * R2D, 3) + '°. The wiring takes part of each pixel (0.6 of it is open, a round value).', 'Red, green and blue filters make each pixel three subpixels; each passes about a third of white light (0.28 here).', 'The front polarizer, crossed with the first, passes the part of the light whose plane has been turned: sin²θ = ' + sig(Tcell, 3) + ' of it.'],
          oled: ['Transistors under each subpixel set the current through it.', 'A reflective anode feeds the current into the organic layers and sends their light forward.', 'Organic layers glow red, green or blue where a current flows: the pixel is as bright as its current, and dark when it is off.', 'A thin transparent cathode closes the circuit and lets the light out.', 'A seal keeps out water and air, which ruin the organic layers.', 'A circular polarizer stops the panel from reflecting the room like a mirror, at the price of half of the emitted light.'],
          micro: ['Transistors under each subpixel set the current through it.', 'Metal pads join each tiny chip to the backplane.', 'Each subpixel is a microscopic inorganic LED, a few to a hundred micrometres across: red, green or blue; very bright and long-lived.', 'A common electrode closes the circuit above the chips.', 'A black matrix between the chips absorbs room light and keeps the colours apart.', 'A cover glass protects the chips. No polarizer is needed, so all the light leaves.']
        };
        const cy = yb + 4 * pw + 22;
        T.caption(c, 10, cy, W - 20, H - cy - 6, step === 0 ? 'Six layers, in the order the light meets them' : step + '. ' + names[step - 1], step === 0 ? names.map((n, i) => (i + 1) + ' ' + n.toLowerCase()).join(' · ') + '. Slide "Follow the light" to read each one.' : TEXT[type][step - 1]);
        ro.set('out', type === 'lcd' ? sig(100 * frac[5], 2) + ' % of the backlight' : sig(100 * frac[5], 2) + ' % of the light made');
        ro.set('th', type === 'lcd' ? sig(th * R2D, 3) + '° (a voltage untwists it: about ' + sig(100 * (1 - th / (PI / 2)), 2) + ' % of the full voltage)' : 'not used: the pixel makes its own light');
        ro.set('ppi', sig(ppi, 3) + ' per inch, pitch ' + sig(pitch, 3) + ' µm');
        ro.set('one', sig(oneArc, 3) + ' m');
        ro.set('ppd', sig(ppd, 3));
        ro.set('seen', ppd >= 60 ? 'no: they are finer than the eye resolves' : 'yes: a sharp eye can tell them apart');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ virtual- and augmented-reality headsets */
  Hyper.sim('es-headset', {
    title: 'A headset: magnifier, folded pancake lens and AR waveguide',
    blurb: `A display a few centimetres from a lens looks like a large picture far away. The picture is drawn for one eye: display, lens and the rays that reach the eye box (to scale; the virtual picture, far to the left, is not). Under it a ruler of dioptres shows where the eyes **focus** (the picture's distance) against where they **converge** (the virtual object's distance).

**Try this**
- Move the display toward the focal length (**gap** 0.2 mm): the picture recedes towards infinity and the magnification soars. Pull it away (gap 8 mm): the picture comes close.
- Increase the **eye relief** with a wide display: the field of view becomes limited by the lens, not the display.
- Choose a virtual object at **0.4 m** and watch the mismatch grow: the eyes converge for 2.5 D but focus at the picture's distance.
- **Pancake**: the same optics folded by polarization, a third as thick and at most a quarter as bright. **Waveguide**: lower the angle in the glass below the critical angle and the ray escapes instead of bouncing.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 480, maxH: 620 });
      const T = tools(st, kit);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Optics', options: [['Simple magnifier lens', 'mag'], ['Pancake: folded by polarization', 'pan'], ['AR waveguide with gratings', 'wg']], value: params.mode || 'mag' },
        { id: 'f', label: 'Focal length', min: 30, max: 60, step: 1, value: params.f || 40, unit: 'mm' },
        { id: 'gap', label: 'Display inside the focal length by', min: 0.2, max: 8, step: 0.1, value: params.gap || 1, unit: 'mm' },
        { id: 'w', label: 'Display width', min: 40, max: 80, step: 1, value: params.w || 60, unit: 'mm' },
        { id: 'e', label: 'Eye relief', min: 8, max: 30, step: 1, value: params.e || 15, unit: 'mm' },
        { id: 'conv', label: 'Virtual object at', min: 0.3, max: 5, value: params.conv || 0.5, log: true, sig: 2, unit: 'm' },
        { id: 'n', label: 'Index of the waveguide glass', min: 1.4, max: 2.1, step: 0.05, value: params.n || 1.8 },
        { id: 'ang', label: 'Angle of the ray in the glass', min: 20, max: 80, step: 1, value: params.ang || 55, unit: '°' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Virtual picture at'], ['b', 'Field of view'], ['c', 'Pixels per degree (2000 across)'], ['d', 'Vergence–accommodation conflict'], ['e', 'Light that reaches the eye']]);
      function vis() { const wg = V.mode === 'wg'; ['f', 'gap', 'w', 'e'].forEach(id => ctl.show(id, !wg)); ['n', 'ang'].forEach(id => ctl.show(id, wg)); }
      // the polarization of the pancake path, from Jones calculus (lab frame: a mirror leaves the components alone)
      const q45 = P.qwp(45 * D2R), pst = [P.vec('R')];
      pst.push(P.apply(q45, pst[0])); pst.push(P.apply(q45, pst[1])); pst.push(P.apply(q45, pst[2]));
      const label = v => { const e = P.ellipse(v); return e.handed === 'linear' ? 'linear ' + (Math.abs(Math.cos(e.azimuth)) > 0.7 ? '↔' : '↕') : 'circular'; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const wg = V.mode === 'wg', pan = V.mode === 'pan';
        const f = V.f, d = f - V.gap, si = f * d / V.gap, mag = f / V.gap, e = V.e, Rl = 20;
        const hc = (V.w / 2) * (e / d) / (1 + e / d - e / f), angD = Math.atan(hc / e), angL = Math.atan(Rl / e), fov = 2 * Math.min(angD, angL);
        const ppd = 2000 / (fov * R2D);
        const dioF = 1 / (si / 1000), dioV = 1 / V.conv, mism = dioF - dioV;
        // ---- the optics, to scale in millimetres
        const top = 0.04 * H, ph = 0.52 * H;
        if (!wg) {
          const g = pan ? f / 3 : 0;
          const m = S.map(st, -d - 8, e + 24, 44, { left: 0.2 * W, right: 12, top, bottom: H - top - ph });
          S.axis(c, m.X(-d - 6), m.y0, m.X(e + 20));
          // the display, the lens (or the pancake module), the eye box and the eye
          c.fillStyle = C.ok; c.fillRect(m.X(-d) - 3, m.Y(V.w / 2), 3, V.w * m.s);
          if (pan) {
            const zd = -g, zp = 0;
            c.fillStyle = 'rgba(123,140,255,0.18)'; c.strokeStyle = C.accent; c.lineWidth = 1.2; c.fillRect(m.X(zd), m.Y(Rl), (zp - zd) * m.s, 2 * Rl * m.s); c.strokeRect(m.X(zd), m.Y(Rl), (zp - zd) * m.s, 2 * Rl * m.s);
            c.strokeStyle = C.muted; c.lineWidth = 2.4; c.beginPath(); c.moveTo(m.X(zd), m.Y(Rl)); c.lineTo(m.X(zd), m.Y(-Rl)); c.stroke();
            c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(m.X(zp), m.Y(Rl)); c.lineTo(m.X(zp), m.Y(-Rl)); c.stroke();
            const ys = [10, 6.5, 3, 0];
            S.ray(c, [[m.X(-d), m.Y(ys[0])], [m.X(zd), m.Y(ys[0])], [m.X(zp), m.Y(ys[1])], [m.X(zd), m.Y(ys[2])], [m.X(zp), m.Y(ys[3])], [m.X(e), m.Y(ys[3])]], { nm: 550, width: 1.4, arrows: false });
            T.txt(c, 'half mirror', m.X(zd) - 2, m.Y(Rl) - 9, { size: 10, align: 'right', color: C.muted, maxW: 80 });
            T.txt(c, 'reflective polarizer', m.X(zp) + 2, m.Y(Rl) - 9, { size: 10, color: C.series[1], maxW: 110 });
            T.txt(c, 'three passes: ' + label(pst[1]) + ' → ' + label(pst[2]) + ' → ' + label(pst[3]), m.X(-d) + 2, m.Y(-Rl) + 14, { size: 10, color: C.text, maxW: W - 20 });
          } else {
            S.lens(c, m.X(0) - 4, m.y0, Rl * m.s, { f: 1, bulge: 2.6, t: 8 });
            // rays: each display point (edge, centre) to the eye pupil (±3 mm) through the lens
            for (const yp of [V.w / 2, 0, -V.w / 2]) {
              for (const tg of [0, 3, -3]) {
                const h = (tg + yp * e / d) / (1 + e / d - e / f);
                if (Math.abs(h) > Rl) continue;
                S.ray(c, [[m.X(-d), m.Y(yp)], [m.X(0), m.Y(h)], [m.X(e), m.Y(tg)]], { nm: 550, width: tg === 0 ? 1.4 : 0.8, alpha: tg === 0 ? 1 : 0.5, arrows: false });
              }
            }
          }
          S.eye(c, m.X(e) + 8 * m.s * 0.8 + 6, m.y0, 8 * m.s * 0.8 + 4, { dir: -1 });
          T.txt(c, 'display', m.X(-d), m.Y(V.w / 2) - 9, { size: 10.5, color: C.ok, align: 'center', maxW: 80 });
          T.txt(c, pan ? 'lens module' : 'lens', m.X(0), m.Y(Rl) - 22, { size: 10.5, color: C.muted, align: 'center', maxW: 90 });
          S.dim(c, m.X(-d), m.Y(-V.w / 2 - 5), m.X(0), m.Y(-V.w / 2 - 5), '', {});
          T.txt(c, 'd = ' + sig(d, 3) + ' mm', m.X(-d / 2), m.Y(-V.w / 2 - 12), { size: 10, align: 'center', color: C.muted, maxW: 80 });
          T.txt(c, 'eye relief ' + sig(e, 2) + ' mm', m.X(e / 2), m.Y(-V.w / 2 - 12) + 12, { size: 10, align: 'center', color: C.muted, maxW: 100 });
          // the virtual picture, far to the left (not to scale)
          const xv = 0.07 * W, hv = 0.17 * ph;
          S.object(c, xv, m.y0 + hv / 2, hv, { dash: true, color: C.accent });
          T.txt(c, 'virtual picture', xv + 2, m.y0 + hv / 2 + 14, { size: 10.5, color: C.accent, align: 'center', maxW: 0.16 * W });
          T.txt(c, sig(si / 1000, 3) + ' m away', xv + 2, m.y0 + hv / 2 + 27, { size: 10, color: C.muted, align: 'center', maxW: 0.16 * W });
          T.txt(c, '(not to scale)', xv + 2, m.y0 + hv / 2 + 40, { size: 9.5, color: C.faint, align: 'center', maxW: 0.16 * W });
          S.virtual(c, m.X(0), m.y0 - hc * 0.5, xv + 10, m.y0 - hv / 2 - 4);
          T.txt(c, 'field of view ' + sig(fov * R2D, 3) + '°', m.X(e) + 6, m.y0 + 8 * m.s + 18, { size: 10.5, align: 'right', color: C.text, maxW: 0.5 * W });
        } else {
          // the waveguide plate: grating in, grating out, the ray bouncing between the faces
          const n = V.n, thc = O.criticalAngle(n, 1), trap = V.ang * D2R > thc, t = 0.07 * ph, px0 = 0.1 * W, px1 = W - 0.1 * W, py = top + ph * 0.5;
          c.fillStyle = glassFill(C); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.fillRect(px0, py - t / 2, px1 - px0, t); c.strokeRect(px0, py - t / 2, px1 - px0, t);
          c.fillStyle = C.series[1]; c.fillRect(px0 + 0.05 * W, py - t / 2 - 3, 0.08 * W, 3); c.fillRect(px1 - 0.05 * W - 0.1 * W, py + t / 2, 0.1 * W, 3);
          T.txt(c, 'in-coupling grating', px0 + 0.09 * W, py - t / 2 - 12, { size: 10, align: 'center', color: C.series[1], maxW: 0.22 * W });
          T.txt(c, 'out-coupling grating', px1 - 0.1 * W, py + t / 2 + 14, { size: 10, align: 'center', color: C.series[1], maxW: 0.24 * W });
          // projector above the in-coupling grating
          c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1; c.fillRect(px0 + 0.03 * W, py - t / 2 - 0.2 * ph, 0.12 * W, 0.12 * ph); c.strokeRect(px0 + 0.03 * W, py - t / 2 - 0.2 * ph, 0.12 * W, 0.12 * ph);
          T.txt(c, 'microdisplay + lens', px0 + 0.09 * W, py - t / 2 - 0.2 * ph - 9, { size: 10, align: 'center', color: C.muted, maxW: 0.26 * W });
          // the ray inside the glass, at V.ang from the normal
          const dx = t * Math.tan(V.ang * D2R), pts = [[px0 + 0.09 * W, py - t / 2]];
          let x = px0 + 0.09 * W, yy = py - t / 2, dir = 1, bounces = 0;
          if (trap) { while (x + dx < px1 - 0.05 * W - 0.05 * W && bounces < 80) { x += dx; yy = dir > 0 ? py + t / 2 : py - t / 2; pts.push([x, yy]); dir = -dir; bounces++; } pts.push([x + dx * 0.5, py + dir * 0]); }
          else { pts.push([x + dx, py + t / 2]); pts.push([x + dx + 0.12 * W, py + t / 2 + 0.2 * ph]); }
          S.ray(c, pts, { nm: 550, width: 1.5, arrows: false });
          if (trap) { const xo = px1 - 0.1 * W; S.ray(c, [[xo, py + t / 2], [xo, py + t / 2 + 0.17 * ph]], { nm: 550, width: 1.5 }); S.eye(c, xo + 0, py + t / 2 + 0.17 * ph + 18, 14, { dir: -1 }); }
          // the world light passes straight through
          S.ray(c, [[px1 - 0.2 * W, py - 0.28 * ph], [px1 - 0.2 * W, py + t / 2 + 0.17 * ph - 8]], { color: C.muted, width: 1.1, arrows: true });
          T.txt(c, 'the world', px1 - 0.2 * W + 6, py - 0.28 * ph + 6, { size: 10, color: C.muted, maxW: 0.2 * W });
          T.txt(c, trap ? 'trapped by total internal reflection' : 'below the critical angle: the ray escapes', px0, top + 6, { size: 11, color: trap ? C.ok : C.bad, weight: 600, maxW: W - 2 * px0 });
        }
        // ---- the dioptre ruler: focus against convergence
        const ry = top + ph + 0.12 * H, rx0 = 0.06 * W, rx1 = 0.94 * W, Dmax = 4, X = D => rx0 + (rx1 - rx0) * clamp(D / Dmax, 0, 1);
        c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(rx0, ry); c.lineTo(rx1, ry); c.stroke();
        for (let D = 0; D <= Dmax; D++) { c.beginPath(); c.moveTo(X(D), ry - 4); c.lineTo(X(D), ry + 4); c.stroke(); T.txt(c, D + (D === 0 ? ' D (far)' : D === Dmax ? ' D (25 cm)' : ''), X(D), ry + 15, { size: 10, align: 'center', color: C.faint, maxW: 70 }); }
        c.fillStyle = C.accent; c.beginPath(); c.arc(X(dioF), ry, 6, 0, 2 * PI); c.fill();
        c.fillStyle = C.warn; c.beginPath(); c.arc(X(dioV), ry, 6, 0, 2 * PI); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(dioF), ry - 14); c.lineTo(X(dioV), ry - 14); c.stroke();
        T.txt(c, 'eyes focus at ' + sig(si / 1000, 3) + ' m (' + sig(dioF, 2) + ' D)', X(dioF), ry - 28, { size: 10.5, align: dioF < dioV ? 'right' : 'left', color: C.accent, maxW: 0.5 * W });
        T.txt(c, 'converge on ' + sig(V.conv, 2) + ' m (' + sig(dioV, 2) + ' D)', X(dioV), ry - 44, { size: 10.5, align: dioF < dioV ? 'left' : 'right', color: C.warn, maxW: 0.5 * W });
        T.txt(c, 'mismatch ' + sig(Math.abs(mism), 2) + ' D', (X(dioF) + X(dioV)) / 2, ry + 32, { size: 11, weight: 650, align: 'center', color: C.text, maxW: 0.5 * W });
        // ---- the caption
        const cap = wg ? 'A glass plate carries the picture from an input grating to an output grating by total internal reflection; the world is seen straight through. Rays steeper than the critical angle (' + sig(O.criticalAngle(V.n, 1) * R2D, 3) + '° for n = ' + sig(V.n, 3) + ') stay in the plate.'
          : pan ? 'The display lies right behind the half mirror. Light crosses the gap three times: it is circular, becomes linear and is reflected by the polarizer, circular again, reflected by the half mirror and finally linear in the other plane, which passes. The optical path is three gaps long; at most a quarter of the light arrives.'
            : 'The display sits just inside the focal length of the lens, so the lens makes a large virtual picture far away. The field of view is set by the display width and distance, or by the lens aperture if the eye is far from it.';
        T.caption(c, 10, H - 0.19 * H, W - 20, 0.19 * H - 6, wg ? 'AR waveguide' : pan ? 'Pancake lens' : 'Simple magnifier', cap);
        ro.set('a', wg ? 'collimated: at infinity' : sig(si / 1000, 3) + ' m, magnified ' + sig(mag, 3) + ' ×');
        ro.set('b', wg ? 'limited by the angles that can be trapped (critical angle ' + sig(O.criticalAngle(V.n, 1) * R2D, 3) + '°)' : sig(fov * R2D, 3) + '° (' + (angD < angL ? 'limited by the display' : 'limited by the lens') + ')');
        ro.set('c', wg ? 'depends on the display' : sig(ppd, 3));
        ro.set('d', 'mismatch ' + sig(Math.abs(mism), 2) + ' D (focus ' + sig(dioF, 2) + ' D, convergence ' + sig(dioV, 2) + ' D)');
        ro.set('e', wg ? 'a few per cent at best' : pan ? 'at most 25 % (0.5 × 0.5)' : 'nearly all of it');
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the optical mouse and the optical encoder */
  Hyper.sim('es-mouse', {
    title: 'The optical mouse and the optical encoder',
    blurb: `**Mouse.** The sensor takes a small picture of the desk, then another one a frame later. The mouse finds the shift that makes the two pictures agree best (the *correlation map*, bright where they match) and reports it as counts. The surface is a made-up texture and the pictures are slowed down: the speed only sets how far apart the two frames are.

**Encoder.** A code disc with lines passes two windows a quarter of a period apart. Channel A and channel B are square waves; which one leads tells the direction, and counting all four edges gives four counts per line.

**Try this**
- Mouse: raise the **speed** until the shift per frame passes the search range: the correlation peak jumps to a wrong place and the mouse loses track. Raise the **frames per second** to follow faster.
- Mouse: raise the **resolution** (counts per inch): the footprint of a pixel shrinks, so the same speed shifts the picture by more pixels.
- Encoder: reverse the **rotation** and watch B change from lagging A to leading it; tick off ×4 counting and the counter runs four times slower.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 480, maxH: 620 });
      const T = tools(st, kit);
      // a made-up surface texture: a sum of waves of 3–12 pixels
      const TX = [];
      for (let k = 0; k < 14; k++) { const lam = 3 + 9 * hash(k * 3.1), a = 2 * PI * hash(k * 5.7 + 1), kk = 2 * PI / lam; TX.push([kk * Math.cos(a), kk * Math.sin(a), 2 * PI * hash(k * 7.3 + 2), 0.6 + hash(k * 11.1 + 3)]); }
      let wsum = 0; TX.forEach(t => { wsum += t[3]; });
      const tex = (x, y) => { let s = 0; for (let k = 0; k < TX.length; k++) { const t = TX[k]; s += t[3] * Math.sin(t[0] * x + t[1] * y + t[2]); } return clamp(0.5 + 1.1 * s / wsum * 2, 0, 1); };
      let cnt0 = 0, pos = 0, last = 0, dirty = true, acc = 1;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'System', options: [['Optical mouse', 'mouse'], ['Incremental encoder', 'enc']], value: params.mode || 'mouse' },
        { id: 'vel', label: 'Speed of the mouse', min: 0.02, max: 5, value: params.vel || 0.5, log: true, sig: 2, unit: 'm/s' },
        { id: 'fps', label: 'Frames per second', min: 500, max: 20000, value: params.fps || 8000, log: true, sig: 2 },
        { id: 'cpi', label: 'Resolution', min: 400, max: 6400, value: params.cpi || 1600, log: true, sig: 2, unit: 'counts per inch' },
        { id: 'N', label: 'Sensor array', min: 12, max: 32, step: 2, value: params.N || 24, unit: 'pixels across' },
        { id: 'ppr', label: 'Lines per revolution', min: 100, max: 5000, value: params.ppr || 1000, log: true, sig: 2 },
        { id: 'rpm', label: 'Rotation (slowed down in the picture)', min: -3000, max: 3000, step: 50, value: params.rpm != null ? params.rpm : 600, unit: 'rpm' },
        { id: 'x4', type: 'check', label: 'Count all four edges (×4)', value: params.x4 !== false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the counter' }] }
      ], id => { if (id === 'reset') cnt0 = Math.floor(pos * (V.x4 ? 4 : 1)); vis(); dirty = true; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Footprint of a pixel / one count'], ['b', 'True shift per frame'], ['c', 'Measured shift'], ['d', 'Fastest it can follow'], ['e', 'State']]);
      function vis() { const m = V.mode === 'mouse'; ['vel', 'fps', 'cpi', 'N'].forEach(id => ctl.show(id, m)); ['ppr', 'rpm', 'x4', 'reset'].forEach(id => ctl.show(id, !m)); }
      const sq = (c, x, y, s, n, f) => S.cells(c, x, y, s, s, n, n, f);
      const loop = kit.loop((dt, t) => {
        acc += dt;
        if (!dirty && acc < 0.05) return;
        const dtt = Math.max(acc, 1 / 60); acc = 0; dirty = false;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.mode === 'mouse') {
          const N = Math.round(V.N), R = Math.max(2, Math.floor(N / 4));
          const foot = 25400 / V.cpi;                                    // µm per pixel of the surface
          const shiftPx = V.vel * 1e6 / V.fps / foot;                     // pixels the picture moves between two frames
          const phi = 0.5 + 0.35 * Math.sin(0.5 * t);
          const dx = shiftPx * Math.cos(phi), dy = shiftPx * Math.sin(phi);
          const fx0 = (56 - N) / 2 * (1 + 0.8 * Math.sin(0.3 * t)), fy0 = (32 - N) / 2 * (1 + 0.8 * Math.sin(0.43 * t + 1));
          // the two pictures, then the sum of squared differences for every shift
          const A = new Float32Array(N * N), B = new Float32Array(N * N);
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { A[j * N + i] = tex(fx0 + i, fy0 + j); B[j * N + i] = tex(fx0 + i + dx, fy0 + j + dy); }
          const M = 2 * R + 1, E = new Float32Array(M * M);
          let best = 1e9, bi = 0, bj = 0, emax = 0;
          for (let my = -R; my <= R; my++) for (let mx = -R; mx <= R; mx++) {
            let s = 0, cn = 0;
            for (let j = Math.max(0, -my); j < Math.min(N, N - my); j++) for (let i = Math.max(0, -mx); i < Math.min(N, N - mx); i++) { const d = A[(j + my) * N + i + mx] - B[j * N + i]; s += d * d; cn++; }
            s = cn ? s / cn : 1;
            E[(my + R) * M + mx + R] = s; if (s < best) { best = s; bi = mx; bj = my; } if (s > emax) emax = s;
          }
          const sub = (em, e0, ep) => { const den = em - 2 * e0 + ep; return Math.abs(den) > 1e-12 ? clamp(0.5 * (em - ep) / den, -0.5, 0.5) : 0; };
          const at = (mx, my) => E[(clamp(my, -R, R) + R) * M + clamp(mx, -R, R) + R];
          const mxs = bi + sub(at(bi - 1, bj), at(bi, bj), at(bi + 1, bj)), mys = bj + sub(at(bi, bj - 1), at(bi, bj), at(bi, bj + 1));
          const err = Math.hypot(mxs - dx, mys - dy), ok = shiftPx <= R && err < 0.6;
          // ---- the surface with the field of view
          const vx = 10, vy = 0.03 * H, vw = 0.56 * W, vh = vw * 32 / 56;
          S.cells(c, vx, vy, vw, vh, 56, 32, (u, v) => tex(u * 56, v * 32));
          c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(vx + vw * fx0 / 56, vy + vh * fy0 / 32, vw * N / 56, vh * N / 32);
          T.txt(c, 'the desk (made-up texture) and the sensor\'s field', vx, vy + vh + 10, { size: 10, color: C.muted, maxW: vw });
          // ---- the mouse in section (schematic)
          const sx0 = vx + vw + 0.04 * W, sw = W - sx0 - 10, ys = vy + vh * 0.82, xl = sx0 + sw * 0.55;
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx0, ys); c.lineTo(sx0 + sw, ys); c.stroke();
          c.fillStyle = C.faint; for (let k = 0; k < 9; k++) { const bx = sx0 + 6 + k * sw / 9.2, bh = 2 + 3 * hash(k + 4); c.beginPath(); c.moveTo(bx, ys); c.lineTo(bx + 4, ys - bh); c.lineTo(bx + 8, ys); c.fill(); }
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(sx0 + 2, ys - vh * 0.75, sw - 4, vh * 0.7);
          S.source(c, sx0 + sw * 0.14, ys - vh * 0.22, { kind: 'led', size: 8 });
          S.ray(c, [[sx0 + sw * 0.18, ys - vh * 0.2], [sx0 + sw * 0.52, ys - 2]], { nm: 650, width: 1.4, arrows: false });
          S.ray(c, [[sx0 + sw * 0.52, ys - 2], [xl, ys - vh * 0.36], [xl, ys - vh * 0.56]], { nm: 650, width: 1.2, arrows: false });
          c.fillStyle = S.edge(); c.fillRect(xl - 8, ys - vh * 0.4, 16, 3);
          c.fillStyle = C.ok; c.fillRect(xl - 9, ys - vh * 0.6, 18, 5);
          T.txt(c, 'LED or laser, low angle', sx0 + 6, ys - vh * 0.75 - 7, { size: 9.5, color: C.muted, maxW: sw });
          T.txt(c, 'lens', xl + 12, ys - vh * 0.4, { size: 9.5, color: C.muted, maxW: 40 });
          T.txt(c, 'sensor', xl + 12, ys - vh * 0.58, { size: 9.5, color: C.muted, maxW: 50 });
          // ---- the two pictures and the correlation map
          const ps = Math.min(0.29 * W, 0.24 * H), py = vy + vh + 30, gx = (W - 3 * ps) / 4;
          sq(c, gx, py, ps, N, (u, v) => A[Math.floor(v * N) * N + Math.floor(u * N)]);
          sq(c, 2 * gx + ps, py, ps, N, (u, v) => B[Math.floor(v * N) * N + Math.floor(u * N)]);
          sq(c, 3 * gx + 2 * ps, py, ps, M, (u, v) => { const e = E[Math.floor(v * M) * M + Math.floor(u * M)]; return 1 - e / (emax || 1); });
          const pk = (3 * gx + 2 * ps) + ps * (bi + R) / M, pj = py + ps * (bj + R) / M;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(pk, pj, ps / M, ps / M);
          [['previous frame', gx], ['this frame', 2 * gx + ps], ['correlation', 3 * gx + 2 * ps]].forEach(([s, x]) => { c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x, py, ps, ps); T.txt(c, s, x + ps / 2, py + ps + 10, { size: 10.5, align: 'center', color: C.muted, maxW: ps + gx - 4 }); });
          T.txt(c, 'bright = best match', 3 * gx + 2 * ps + ps / 2, py - 8, { size: 9.5, align: 'center', color: C.faint, maxW: ps + gx });
          const cy = py + ps + 22;
          T.caption(c, 10, cy, W - 20, H - cy - 6, ok ? 'Tracking: the shift is found' : 'Lost track: the search range is exceeded or the match is poor', ok ? 'The correlation peak (orange square) sits at the true shift: ' + sig(dx, 2) + ', ' + sig(dy, 2) + ' pixels. The sensor reports it as counts; the lens and the pixel footprint turn pixels into millimetres on the desk.' : 'The true shift of ' + sig(shiftPx, 3) + ' pixels per frame is beyond the search range of ±' + R + ' pixels, so the pictures hardly overlap and the best match is somewhere else. Raise the frame rate, lower the speed or the resolution, or use a larger array.');
          ro.set('a', sig(foot, 3) + ' µm (' + sig(V.cpi, 3) + ' counts per inch)');
          ro.set('b', sig(shiftPx, 3) + ' pixels (' + sig(shiftPx * foot, 3) + ' µm)');
          ro.set('c', ok || shiftPx <= R ? sig(Math.hypot(mxs, mys), 3) + ' pixels (error ' + sig(err, 2) + ')' : 'wrong: ' + sig(Math.hypot(mxs, mys), 3) + ' pixels');
          ro.set('d', sig(R * foot * V.fps / 1e6, 3) + ' m/s (search ±' + R + ' pixels)');
          ro.set('e', ok ? 'tracking' : 'lost: shift above the search range');
        } else {
          const rate = V.rpm / 3000 * 6;                                // pitches per second in the picture
          pos += rate * dtt; last = rate;
          hist.push([t, (((pos % 1) + 1) % 1) < 0.5 ? 1 : 0, ((((pos - 0.25) % 1) + 1) % 1) < 0.5 ? 1 : 0, pos]);
          while (hist.length && t - hist[0][0] > 5) hist.shift();
          const A = hist[hist.length - 1][1], B = hist[hist.length - 1][2];
          const pitch = 0.08 * W, sy = 0.06 * H, sh = 0.1 * H;
          // the strip of lines and the two windows
          const stripX = 10, stripW = W - 20;
          c.fillStyle = C.surface; c.fillRect(stripX, sy, stripW, sh);
          c.fillStyle = C.text;
          const off = ((pos % 1) + 1) % 1;
          for (let k = -1; k * pitch < stripW + pitch; k++) { const x0 = stripX + (k + off) * pitch; const a = Math.max(stripX, x0), b = Math.min(stripX + stripW, x0 + pitch / 2); if (b > a) c.fillRect(a, sy, b - a, sh); }
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(stripX, sy, stripW, sh);
          const wa = stripX + stripW * 0.5 - pitch / 8, wb = wa + pitch / 4;
          [[wa, 'A', A], [wb, 'B', B]].forEach(([x, nme, v]) => { c.strokeStyle = v ? C.ok : C.warn; c.lineWidth = 2.4; c.strokeRect(x, sy - 5, pitch / 4 * 0.8, sh + 10); c.fillStyle = v ? C.ok : C.faint; c.fillRect(x, sy + sh + 8, pitch / 4 * 0.8, 6); T.txt(c, nme, x + pitch / 10, sy + sh + 24, { size: 11, weight: 700, align: 'center', color: v ? C.ok : C.muted, maxW: 20 }); });
          T.txt(c, 'code disc (a short stretch, unrolled) and two windows a quarter of a period apart', stripX, sy - 14, { size: 10, color: C.muted, maxW: stripW });
          // the signals against time
          const gy = sy + sh + 44, gh = 0.085 * H, gx0 = 34, gw = W - gx0 - 12;
          [['A', 1, C.ok], ['B', 2, C.series[1]]].forEach(([nme, idx, col], r) => {
            const y0 = gy + r * (gh + 14);
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, y0 + gh); c.lineTo(gx0 + gw, y0 + gh); c.stroke();
            T.txt(c, nme, 12, y0 + gh / 2, { size: 12, weight: 700, color: col, maxW: 20 });
            c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath();
            let pyy = 0;
            hist.forEach((h, i) => { const x = gx0 + gw * (1 - (t - h[0]) / 5), y = y0 + gh * (h[idx] ? 0.08 : 0.92); if (i === 0) c.moveTo(x, y); else { c.lineTo(x, pyy); c.lineTo(x, y); } pyy = y; });
            c.stroke();
          });
          const cnt = Math.floor(pos * (V.x4 ? 4 : 1)) - cnt0;
          const lead = V.rpm > 0 ? 'A leads B: turning forward' : V.rpm < 0 ? 'B leads A: turning backward' : 'stopped';
          const cy = gy + 2 * (gh + 14) + 6;
          T.caption(c, 10, cy, W - 20, H - cy - 6, 'Counter: ' + cnt, lead + '. Each line gives one cycle of A; counting all four edges of A and B gives ' + (V.x4 ? 'four counts per line' : 'one count per line (×1 decoding)') + '. The picture is slowed down: at ' + V.rpm + ' rpm channel A really runs at ' + sig(Math.abs(V.ppr * V.rpm / 60) / 1000, 3) + ' kHz.');
          const cpr = 4 * V.ppr;
          ro.set('a', 'a line every ' + sig(360 / V.ppr, 3) + '°');
          ro.set('b', 'channel A: ' + sig(Math.abs(V.ppr * V.rpm / 60) / 1000, 3) + ' kHz');
          ro.set('c', sig(cpr, 4) + ' counts per revolution (×4), one count = ' + sig(360 / cpr, 3) + '°');
          ro.set('d', 'counter ' + cnt);
          ro.set('e', lead);
        }
      }, box.stage);
      vis();
      st.onResize(() => { dirty = true; loop.once(); });
      loop.start(); dirty = true; loop.once();
    }
  });

  /* ================================================================ a remote control and photoelectric sensors */
  Hyper.sim('es-photoeye', {
    title: 'A remote control and four photoelectric sensors',
    blurb: `**Remote.** The LED sends a burst of 38 kHz light for 562.5 µs, then a gap, in a short code. The receiver's band-pass filter accepts only the carrier: steady light and a 100 Hz lamp are removed, while a flicker near the carrier gets through. **Sensors.** A through-beam, a retro-reflective sensor with polarizers, a diffuse sensor and a safety light curtain, each with an object to place in the beam.

**Try this**
- Remote: choose the **electronic ballast** interference and switch the filter on and off: broadband noise and the lamp are rejected by the filter, but a flicker near 38 kHz is not.
- Retro-reflective: use the **shiny metal box** with the polarizers off: it mirrors the beam back and the sensor does not see it. Switch the polarizers on: the analyser blocks the mirrored light.
- Diffuse: switch from the white to the **black box** and watch the sensing distance fall to about a quarter.
- Curtain: make the object narrower than **pitch + beam width** and find a place where it slips between the beams.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 470, maxH: 600 });
      const T = tools(st, kit);
      const OBJ = { white: { n: 'matt white box', rho: 0.9, kind: 'opaque' }, black: { n: 'matt black box', rho: 0.06, kind: 'opaque' }, metal: { n: 'shiny metal box', rho: 0.02, kind: 'mirror' }, glass: { n: 'clear glass bottle', rho: 0.04, kind: 'clear' } };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'System', options: [['Remote control and receiver', 'remote'], ['Through-beam sensor', 'through'], ['Retro-reflective sensor', 'retro'], ['Diffuse (proximity) sensor', 'diffuse'], ['Safety light curtain', 'curtain']], value: params.mode || 'remote' },
        { id: 'interf', type: 'select', label: 'Interference', options: [['none', 'none'], ['sunlight: steady, with noise', 'sun'], ['incandescent lamp: 100 Hz flicker', 'lamp'], ['electronic ballast: 45 kHz flicker', 'ballast']], value: params.interf || 'none' },
        { id: 'filt', type: 'check', label: 'Band-pass filter at 38 kHz', value: params.filt !== false },
        { id: 'obj', type: 'select', label: 'Object', options: Object.keys(OBJ).map(k => [OBJ[k].n, k]), value: params.obj || 'white' },
        { id: 'pol', type: 'check', label: 'Polarizers in the sensor', value: params.pol !== false },
        { id: 'dist', label: 'Distance of the object', min: 0.05, max: 2.5, step: 0.05, value: params.dist || 0.6, unit: 'm' },
        { id: 'rng', label: 'Sensing range set for white', min: 0.2, max: 2, step: 0.05, value: params.rng || 1, unit: 'm' },
        { id: 'pitch', label: 'Beam spacing (pitch)', min: 10, max: 60, step: 1, value: params.pitch || 30, unit: 'mm' },
        { id: 'wid', label: 'Width of the object', min: 4, max: 90, step: 1, value: params.wid || 30, unit: 'mm' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Carrier'], ['b', 'Burst'], ['c', 'Result'], ['d', 'Detail']]);
      function vis() {
        const m = V.mode, on = (id, v) => ctl.show(id, v);
        on('interf', m === 'remote'); on('filt', m === 'remote'); on('obj', m === 'through' || m === 'retro' || m === 'diffuse'); on('pol', m === 'retro'); on('dist', m === 'diffuse'); on('rng', m === 'diffuse'); on('pitch', m === 'curtain'); on('wid', m === 'curtain');
      }
      // a band-pass filter (second order) over a list of samples
      function bandpass(x, fs, f0, Q) {
        const w0 = 2 * PI * f0 / fs, al = Math.sin(w0) / (2 * Q), b0 = al, b2 = -al, a0 = 1 + al, a1 = -2 * Math.cos(w0), a2 = 1 - al, y = new Float32Array(x.length);
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (let i = 0; i < x.length; i++) { const v = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0; y[i] = v; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; }
        return y;
      }
      const trace = (c, C, x, y, w, h, data, lo, hi, col, label) => {
        c.fillStyle = C.surface; c.fillRect(x, y, w, h);
        c.strokeStyle = col; c.lineWidth = 1; c.beginPath();
        const n = data.length, cols = Math.floor(w);
        for (let px = 0; px < cols; px++) {
          let mn = 1e9, mx = -1e9; const i0 = Math.floor(px / cols * n), i1 = Math.max(i0 + 1, Math.floor((px + 1) / cols * n));
          for (let i = i0; i < i1 && i < n; i++) { if (data[i] < mn) mn = data[i]; if (data[i] > mx) mx = data[i]; }
          const ya = y + h * (1 - clamp((mn - lo) / (hi - lo), 0, 1)), yb = y + h * (1 - clamp((mx - lo) / (hi - lo), 0, 1));
          c.moveTo(x + px + 0.5, ya); c.lineTo(x + px + 0.5, yb - (ya === yb ? 0.8 : 0));
        }
        c.stroke(); c.strokeStyle = C.faint; c.strokeRect(x, y, w, h);
        T.txt(c, label, x + 6, y + 9, { size: 10, color: C.muted, maxW: w - 10 });
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, m = V.mode;
        if (m === 'remote') {
          // ---- the code: 562.5 µs bursts at 38 kHz; gaps of 562.5 and 1687.5 µs
          const fs = 400000, Tw = 3.4e-3, n = Math.round(fs * Tw), f0 = 38000;
          const x = new Float32Array(n), raw = new Float32Array(n);
          const on = tt => (tt < 562.5e-6) || (tt >= 1125e-6 && tt < 1687.5e-6);
          for (let i = 0; i < n; i++) {
            const tt = i / fs, car = Math.sin(2 * PI * f0 * tt) > 0 ? 1 : 0;
            let s = on(tt) ? car : 0;
            if (V.interf === 'sun') s += 1.6 * (hash(i * 0.37) - 0.5) * 2;
            else if (V.interf === 'lamp') s += 6 * Math.sin(2 * PI * 100 * tt + 1);
            else if (V.interf === 'ballast') s += 3 * Math.sin(2 * PI * 45000 * tt);
            raw[i] = s; x[i] = s - 0.25;
          }
          const sigf = V.filt ? bandpass(x, fs, f0, 10) : x;
          // the envelope: rectify and smooth, then a threshold
          const env = new Float32Array(n), out = new Float32Array(n); let e = 0;
          for (let i = 0; i < n; i++) { e += 0.02 * (Math.abs(sigf[i]) - e); env[i] = e; out[i] = e > (V.filt ? 0.12 : 0.28) ? 0 : 1; }
          const gx = 12, gw = W - 24, gh = 0.15 * H;
          let y = 0.06 * H;
          // the picture of the link
          c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(0.06 * W, y + 4, 0.14 * W, 0.07 * H); c.strokeRect(0.06 * W, y + 4, 0.14 * W, 0.07 * H);
          S.source(c, 0.2 * W + 6, y + 4 + 0.035 * H, { kind: 'led', size: 7, color: '#ff6a4a' });
          S.ray(c, [[0.22 * W, y + 4 + 0.035 * H], [0.74 * W, y + 4 + 0.035 * H]], { color: 'rgba(255,106,74,0.7)', width: 1.4, dash: [6, 4], arrows: true });
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.fillRect(0.74 * W, y + 4, 0.1 * W, 0.07 * H); c.strokeRect(0.74 * W, y + 4, 0.1 * W, 0.07 * H);
          T.txt(c, 'remote', 0.13 * W, y + 4 + 0.035 * H, { size: 10.5, align: 'center', color: C.muted, maxW: 0.13 * W });
          T.txt(c, 'receiver', 0.79 * W, y + 4 + 0.035 * H, { size: 10.5, align: 'center', color: C.muted, maxW: 0.1 * W });
          T.txt(c, '940 nm, invisible', 0.48 * W, y + 4 + 0.035 * H - 12, { size: 10, align: 'center', color: C.muted, maxW: 0.4 * W });
          if (V.interf !== 'none') S.source(c, 0.9 * W, y + 12, { kind: V.interf === 'sun' ? 'sun' : 'bulb', size: 9 });
          y += 0.07 * H + 22;
          trace(c, C, gx, y, gw, gh, raw, -3, 7, C.series[1], 'what the photodiode sees (steady light removed)'); y += gh + 8;
          trace(c, C, gx, y, gw, gh, sigf, -1.3, 1.3, C.accent, V.filt ? 'after the 38 kHz band-pass filter' : 'filter off: the broadband signal'); y += gh + 8;
          trace(c, C, gx, y, gw, 0.07 * H, out, -0.2, 1.2, C.ok, 'receiver output (low while a burst is detected)'); y += 0.07 * H + 10;
          let bursts = 0, prev = 1; for (let i = 0; i < n; i++) { if (prev === 1 && out[i] === 0) bursts++; prev = out[i]; }
          const at = ms => out[Math.round(ms * 1e-3 * fs)], clean = bursts === 2 && at(0.3) === 0 && at(1.0) === 1 && at(1.45) === 0 && at(2.6) === 1;
          T.caption(c, 10, y, W - 20, H - y - 6, clean ? 'The code is read: two bursts, three gaps' : 'The code is damaged', 'At 38 kHz a cycle is ' + sig(1e6 / f0, 3) + ' µs, so a burst of 562.5 µs holds ' + sig(562.5e-6 * f0, 3) + ' cycles. The band-pass filter keeps the carrier and rejects steady light and a 100 Hz flicker, which are far slower; a flicker near 38 kHz passes it. The window shows 3.4 ms.');
          ro.set('a', sig(1e6 / f0, 3) + ' µs per cycle (38 kHz)');
          ro.set('b', sig(562.5e-6 * f0, 3) + ' cycles in 562.5 µs');
          ro.set('c', clean ? 'code read correctly' : 'false or missing bursts: ' + bursts + ' seen');
          ro.set('d', V.interf === 'none' ? 'no interference' : V.filt ? 'filter on' : 'filter off');
        } else if (m === 'curtain') {
          const nb = 12, bw = 5, pitch = V.pitch, span = (nb - 1) * pitch + bw, y0 = 0.05 * H, hh = 0.55 * H, sc = hh / span, x0 = 0.16 * W, x1 = W - 0.16 * W;
          c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(x0 - 16, y0 - 6, 16, hh + 12); c.strokeRect(x0 - 16, y0 - 6, 16, hh + 12); c.fillRect(x1, y0 - 6, 16, hh + 12); c.strokeRect(x1, y0 - 6, 16, hh + 12);
          const cyo = ((Math.sin(t * 0.8) + 1) / 2) * (span - V.wid) + V.wid / 2;   // centre of the object, mm from the top beam
          const top = cyo - V.wid / 2, bot = cyo + V.wid / 2;
          let blocked = 0;
          for (let k = 0; k < nb; k++) {
            const yc = k * pitch + bw / 2, full = top <= k * pitch && bot >= k * pitch + bw, part = !(bot < k * pitch || top > k * pitch + bw);
            if (full) blocked++;
            c.fillStyle = full ? 'rgba(229,72,77,0.9)' : part ? 'rgba(224,160,48,0.8)' : 'rgba(255,106,74,0.65)'; c.fillRect(x0, y0 + k * pitch * sc, x1 - x0, Math.max(1.5, bw * sc));
          }
          c.fillStyle = C.series[0]; c.globalAlpha = 0.75; c.beginPath(); c.rect(0.5 * W - 24, y0 + top * sc, 48, V.wid * sc); c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(0.5 * W - 24, y0 + top * sc, 48, V.wid * sc);
          T.txt(c, 'emitters', x0 - 8, y0 + hh + 18, { size: 10, align: 'center', color: C.muted, maxW: 70 });
          T.txt(c, 'receivers', x1 + 8, y0 + hh + 18, { size: 10, align: 'center', color: C.muted, maxW: 70 });
          T.txt(c, 'object ' + V.wid + ' mm wide, moving', 0.5 * W, y0 + hh + 18, { size: 10, align: 'center', color: C.muted, maxW: 0.4 * W });
          const res = pitch + bw;
          T.caption(c, 10, y0 + hh + 30, W - 20, H - (y0 + hh + 30) - 6, blocked > 0 ? 'A whole beam is interrupted: the machine stops' : 'No beam is fully interrupted', 'A row of ' + nb + ' through-beams, ' + bw + ' mm wide and ' + pitch + ' mm apart. An object that always interrupts a whole beam must be at least pitch + beam width = ' + res + ' mm wide; a narrower one can slip between two beams (orange: a beam is only partly covered). Safety light curtains are certified safety components.');
          ro.set('a', 'pitch ' + pitch + ' mm, beam ' + bw + ' mm');
          ro.set('b', blocked + ' of ' + nb + ' beams fully blocked');
          ro.set('c', V.wid >= res ? 'always caught (width ≥ ' + res + ' mm)' : 'can slip through (width < ' + res + ' mm)');
          ro.set('d', 'resolution = pitch + beam width');
        } else {
          const ob = OBJ[V.obj], y0 = 0.05 * H, hh = 0.30 * H, ym = y0 + hh / 2, xa = 0.08 * W, xb = 0.92 * W, xo = m === 'diffuse' ? xa + (xb - xa - 0.06 * W) * clamp(V.dist / 2.5, 0.04, 1) : 0.5 * W;
          const bx = (x, y, w, h, lab) => { c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h); if (lab) T.txt(c, lab, x + w / 2, y + h + 11, { size: 10, align: 'center', color: C.muted, maxW: w + 40 }); };
          const redBeam = (a, b, y) => S.ray(c, [[a, y], [b, y]], { color: 'rgba(255,106,74,0.8)', width: 2, arrows: true, minArrow: 40 });
          let det = false, detail = '', note = '';
          if (m === 'through') {
            bx(xa - 6, ym - 14, 26, 28, 'emitter'); bx(xb - 20, ym - 14, 26, 28, 'receiver');
            det = ob.kind !== 'clear';
            redBeam(xa + 20, det ? xo - 22 : xb - 20, ym);
            note = det ? 'The object breaks the beam: output switches.' : 'The clear glass passes most of the light: the sensor does not see it unless it is set very sensitive.';
            detail = 'a through-beam works to tens of metres: the light travels the gap once';
          } else if (m === 'retro') {
            bx(xa - 6, ym - 14, 26, 28, 'emitter + receiver'); c.strokeStyle = C.series[1]; c.lineWidth = 3; c.beginPath(); c.moveTo(xb - 4, ym - 22); c.lineTo(xb - 4, ym + 22); c.stroke();
            T.txt(c, 'corner-cube reflector', xb - 4, ym + 34, { size: 10, align: 'right', color: C.series[1], maxW: 0.4 * W });
            // the polarization: emitter V, reflector turns it (hwp), mirror keeps it; the receiver analyser crosses the emitter's
            const vV = P.vec('V');
            const refl = P.intensity(P.chain(vV, [P.rotator(PI / 2), P.polarizer(0)]));          // through the reflector, then the analyser along H: 1
            const mirr = P.intensity(P.chain(vV, [P.polarizer(0)]));                               // a mirror keeps the plane: the analyser along H blocks it
            const polOn = V.pol;
            if (ob.kind === 'opaque') { det = true; note = 'The box blocks the beam to the reflector: output switches.'; redBeam(xa + 20, xo - 22, ym); }
            else if (ob.kind === 'mirror') { det = polOn && mirr < 0.05; note = polOn ? 'The box mirrors the beam back, but with its polarization unchanged: the crossed analyser blocks it (received ' + sig(100 * mirr, 2) + ' %): detected.' : 'Without polarizers the mirrored beam looks like the reflector\'s: the sensor does not see the box.'; S.ray(c, [[xa + 20, ym - 5], [xo - 22, ym - 5], [xa + 20, ym + 5]], { color: 'rgba(255,106,74,0.8)', width: 1.6, arrows: false }); }
            else { det = false; note = 'The clear glass lets the beam through both ways: not detected.'; redBeam(xa + 20, xb - 4, ym - 5); redBeam(xb - 4, xa + 20, ym + 5); }
            detail = 'reflector returns ' + sig(100 * refl, 3) + ' % through the analyser; a mirror ' + sig(100 * mirr, 2) + ' %';
          } else {
            bx(xa - 6, ym - 14, 26, 28, 'emitter + receiver');
            const sig0 = ob.rho / Math.pow(V.dist, 2), thr = 0.9 / Math.pow(V.rng, 2), dmax = V.rng * Math.sqrt(ob.rho / 0.9);
            det = sig0 >= thr;
            c.fillStyle = ob.kind === 'opaque' ? (V.obj === 'white' ? '#e8eaf2' : '#1c1f2e') : ob.kind === 'mirror' ? '#9aa4c4' : glassFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(xo, ym - 20, 0.06 * W, 40); c.strokeRect(xo, ym - 20, 0.06 * W, 40);
            redBeam(xa + 20, xo, ym - 4);
            if (det) S.ray(c, [[xo, ym + 4], [xa + 20, ym + 8]], { color: 'rgba(255,106,74,0.55)', width: 1.4, arrows: true, minArrow: 40 });
            note = det ? 'The object returns enough light: detected.' : 'The returned light is below the threshold: not detected. The range for this object is ' + sig(dmax, 2) + ' m.';
            detail = 'range for this object ' + sig(dmax, 2) + ' m (white: ' + sig(V.rng, 2) + ' m)';
            // the signal against distance, relative to the threshold
            const gx = 0.1 * W, gw = W - 0.2 * W, gy = y0 + hh + 28, gh = 0.22 * H, dd = 2.5;
            c.fillStyle = C.surface; c.fillRect(gx, gy, gw, gh); c.strokeStyle = C.faint; c.strokeRect(gx, gy, gw, gh);
            const Y = v => gy + gh * (1 - clamp(v / 4, 0, 1)), X = d => gx + gw * d / dd;
            [['white', C.text, 0.9], ['black', C.muted, 0.06], [V.obj, C.accent, ob.rho]].forEach(([k, col, rho], i) => { c.strokeStyle = col; c.lineWidth = i === 2 ? 2.4 : 1.2; c.beginPath(); for (let j = 0; j <= 80; j++) { const d = 0.1 + (dd - 0.1) * j / 80, v = (rho / 0.9) * Math.pow(V.rng / d, 2); j ? c.lineTo(X(d), Y(v)) : c.moveTo(X(d), Y(v)); } c.stroke(); });
            c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(gx, Y(1)); c.lineTo(gx + gw, Y(1)); c.stroke(); c.setLineDash([]);
            c.fillStyle = C.accent; c.beginPath(); c.arc(X(V.dist), Y((ob.rho / 0.9) * Math.pow(V.rng / V.dist, 2)), 4.5, 0, 2 * PI); c.fill();
            T.txt(c, 'signal ÷ threshold against distance (white, black, and the chosen object)', gx + 4, gy + 9, { size: 9.5, color: C.muted, maxW: gw - 8 });
            T.txt(c, 'threshold', gx + gw - 4, Y(1) - 8, { size: 9.5, align: 'right', color: C.warn, maxW: 70 });
            T.txt(c, '0', gx, gy + gh + 9, { size: 9.5, align: 'center', color: C.faint, maxW: 20 }); T.txt(c, dd + ' m', gx + gw, gy + gh + 9, { size: 9.5, align: 'right', color: C.faint, maxW: 40 });
          }
          if (m !== 'diffuse') { c.fillStyle = ob.kind === 'opaque' ? (V.obj === 'white' ? '#e8eaf2' : '#1c1f2e') : ob.kind === 'mirror' ? '#9aa4c4' : glassFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(xo - 22, ym - 22, 44, 44); c.strokeRect(xo - 22, ym - 22, 44, 44); }
          c.fillStyle = det ? C.ok : C.faint; c.beginPath(); c.arc(W - 22, y0 + 8, 8, 0, 2 * PI); c.fill();
          T.txt(c, det ? 'object detected' : 'no object seen', W - 36, y0 + 8, { size: 10.5, align: 'right', color: det ? C.ok : C.muted, weight: 650, maxW: 0.4 * W });
          const cy = m === 'diffuse' ? y0 + hh + 28 + 0.22 * H + 18 : y0 + hh + 34;
          T.caption(c, 10, cy, W - 20, H - cy - 6, { through: 'Through-beam', retro: 'Retro-reflective with polarizers', diffuse: 'Diffuse (proximity)' }[m] + ' sensor with a ' + ob.n, note);
          ro.set('a', 'a ' + ob.n + ' (reflectance ' + sig(100 * ob.rho, 2) + ' %)');
          ro.set('b', m === 'diffuse' ? 'distance ' + sig(V.dist, 2) + ' m' : 'in the beam');
          ro.set('c', det ? 'detected' : 'not detected');
          ro.set('d', detail);
        }
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ the fibre internet link */
  Hyper.sim('es-fibre', {
    title: 'A fibre link to the home: splitter, decibels and photons',
    blurb: `One fibre from the exchange feeds up to 32 or 64 homes through a **passive splitter**. The staircase shows the optical power along the path: it slopes down along the fibre, steps down at the connectors and drops at the splitter. The dashed line is what the receiver needs; the green gap is the margin. Pulses run down (1490 nm) and up (1310 nm) in the picture.

**Try this**
- Change the split from **1:32 to 1:64**: the staircase drops by another 3 dB.
- Stretch the fibre to **30 km**: the fibre's slope is still smaller than the splitter step.
- Choose **1310 nm** for the long path: the fibre loses more than at 1550 nm.
- Lower the launch power until the margin turns red, and read the photons per bit: a few thousand are enough at the sensitivity limit.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 460, maxH: 590 });
      const T = tools(st, kit);
      const os2 = O.fibre.TYPES.find(t => t.id === 'OS2'), mm = /([\d.]+) dB\/km at 1310[^\d]+([\d.]+) dB\/km at 1550/.exec(os2 ? os2.loss : '');
      const a1310 = mm ? +mm[1] : 0.35, a1550 = mm ? +mm[2] : 0.2;
      const att = nm => nm <= 1310 ? a1310 : nm >= 1550 ? a1550 : lerp(a1310, a1550, (nm - 1310) / 240);
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Split', options: [2, 4, 8, 16, 32, 64, 128].map(k => ['1:' + k, k]), value: params.n || 32 },
        { id: 'km', label: 'Fibre length', min: 0, max: 30, step: 0.5, value: params.km != null ? params.km : 20, unit: 'km' },
        { id: 'wl', type: 'select', label: 'Wavelength', options: [['1310 nm (upstream)', 1310], ['1490 nm (downstream)', 1490], ['1550 nm (video overlay)', 1550]], value: params.wl || 1490 },
        { id: 'oth', label: 'Connectors and splices together', min: 0, max: 6, step: 0.1, value: params.oth != null ? params.oth : 1.8, unit: 'dB' },
        { id: 'Pt', label: 'Launch power', min: -3, max: 7, step: 0.5, value: params.Pt != null ? params.Pt : 1, unit: 'dBm' },
        { id: 'rx', label: 'Receiver sensitivity', min: -34, max: -20, step: 0.5, value: params.rx != null ? params.rx : -27, unit: 'dBm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Splitter, ideal + 1.5 dB excess'], ['b', 'Fibre'], ['c', 'Total loss'], ['d', 'Power at the receiver'], ['e', 'Margin'], ['f', 'Photons per bit at 2.488 Gbit/s']]);
      const EXC = 1.5;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ideal = -O.dB(1 / V.n), Ls = ideal + EXC, a = att(V.wl), fib = a * V.km, tot = fib + Ls + V.oth, Pr = V.Pt - tot, margin = Pr - V.rx;
        const Pw = 1e-3 * Math.pow(10, Pr / 10), E = O.photonEnergy(V.wl) * 1.602176634e-19, ph = Pw / (E * 2.488e9);
        // ---- the network with pulses
        const ny = 0.045 * H, nh = 0.2 * H, ym = ny + nh / 2, xo = 0.1 * W, xs = 0.5 * W, xh = 0.9 * W;
        c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(0.02 * W, ym - 14, 0.08 * W, 28); c.strokeRect(0.02 * W, ym - 14, 0.08 * W, 28);
        S.fibre(c, [[xo, ym], [xs - 12, ym]], { cladWidth: 8, coreWidth: 3 });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.beginPath(); c.moveTo(xs - 12, ym - 12); c.lineTo(xs + 12, ym - 16); c.lineTo(xs + 12, ym + 16); c.lineTo(xs - 12, ym + 12); c.closePath(); c.fill(); c.stroke();
        const homes = 7;
        for (let k = 0; k < homes; k++) {
          const yh = ny + nh * (k + 0.5) / homes; S.fibre(c, [[xs + 12, ym + (yh - ym) * 0.2], [xs + 0.15 * W, yh], [xh - 8, yh]], { cladWidth: 4, coreWidth: 2 });
          c.fillStyle = k === 3 ? C.accent : C.faint; c.fillRect(xh - 6, yh - 4, 9, 8);
        }
        // pulses: downstream 1490 nm towards the homes, upstream 1310 nm back
        for (let k = 0; k < 6; k++) {
          const p = (t * 0.35 + k / 6) % 1, x = lerp(xo, xs - 12, p); c.fillStyle = C.series[0]; c.beginPath(); c.arc(x, ym - 3, 3.2, 0, 2 * PI); c.fill();
          const q = (t * 0.35 + k / 6 + 0.5) % 1, xu = lerp(xs - 12, xo, q); c.fillStyle = C.series[1]; c.beginPath(); c.arc(xu, ym + 3, 3.2, 0, 2 * PI); c.fill();
        }
        for (let k = 0; k < homes; k++) { if (k !== 3) continue; const yh = ny + nh * (k + 0.5) / homes, p = (t * 0.35) % 1; c.fillStyle = C.series[0]; c.beginPath(); c.arc(lerp(xs + 12, xh - 8, p), lerp(ym + (yh - ym) * 0.2, yh, Math.min(1, p * 2)), 3, 0, 2 * PI); c.fill(); }
        T.txt(c, 'exchange', 0.06 * W, ym + 26, { size: 10, align: 'center', color: C.muted, maxW: 0.13 * W });
        T.txt(c, 'splitter 1:' + V.n, xs, ym + nh / 2 + 6, { size: 10.5, align: 'center', color: C.text, maxW: 0.2 * W });
        T.txt(c, 'homes', xh, ny + nh + 8, { size: 10, align: 'center', color: C.muted, maxW: 0.15 * W });
        T.txt(c, '↓ 1490 nm', 0.28 * W, ym - 14, { size: 10, align: 'center', color: C.series[0], maxW: 0.2 * W });
        T.txt(c, '↑ 1310 nm', 0.28 * W, ym + 18, { size: 10, align: 'center', color: C.series[1], maxW: 0.2 * W });
        // ---- the level diagram
        const gx = 46, gw = W - gx - 14, gy = ny + nh + 34, gh = 0.38 * H, top = 6, bot = -34;
        const Y = p => gy + gh * (top - p) / (top - bot), X = u => gx + gw * u;
        c.fillStyle = C.surface; c.fillRect(gx, gy, gw, gh); c.strokeStyle = C.faint; c.strokeRect(gx, gy, gw, gh);
        for (let p = 0; p >= -30; p -= 10) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(gx, Y(p)); c.lineTo(gx + gw, Y(p)); c.stroke(); T.txt(c, p + '', gx - 6, Y(p), { size: 10, align: 'right', color: C.faint, maxW: 36 }); }
        T.txt(c, 'dBm', 4, gy - 8, { size: 10, color: C.muted, maxW: 40 });
        const lv = [V.Pt, V.Pt - fib, V.Pt - fib - V.oth, Pr];
        c.fillStyle = margin >= 0 ? 'rgba(34,179,122,0.25)' : 'rgba(229,72,77,0.25)'; c.fillRect(X(0.86), Y(Math.max(Pr, V.rx)), X(0.98) - X(0.86), Math.abs(Y(Pr) - Y(V.rx)));
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(0.02), Y(lv[0])); c.lineTo(X(0.34), Y(lv[1])); c.lineTo(X(0.34), Y(lv[2])); c.lineTo(X(0.54), Y(lv[2])); c.lineTo(X(0.54), Y(lv[3])); c.lineTo(X(0.98), Y(lv[3])); c.stroke();
        c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(gx, Y(V.rx)); c.lineTo(gx + gw, Y(V.rx)); c.stroke(); c.setLineDash([]);
        T.txt(c, 'receiver needs ' + V.rx + ' dBm', gx + 6, Y(V.rx) - 9, { size: 10, color: C.warn, maxW: gw * 0.6 });
        T.txt(c, 'fibre ' + sig(fib, 3) + ' dB', X(0.18), Y((lv[0] + lv[1]) / 2) - 12, { size: 10, align: 'center', color: C.text, maxW: gw * 0.3 });
        T.txt(c, 'connectors ' + sig(V.oth, 2) + ' dB', X(0.34) - 5, Y(lv[1]) + 12, { size: 10, align: 'right', color: C.text, maxW: gw * 0.32 });
        T.txt(c, 'splitter ' + sig(Ls, 3) + ' dB', X(0.54) + 4, Y((lv[2] + lv[3]) / 2), { size: 10, color: C.text, maxW: gw * 0.4 });
        T.txt(c, sig(Pr, 3) + ' dBm', X(0.9), Math.min(Y(Pr) + 13, gy + gh - 8), { size: 10.5, align: 'center', weight: 650, color: margin >= 0 ? C.ok : C.bad, maxW: gw * 0.2 });
        T.txt(c, 'not to scale along the path', gx + gw - 4, gy + 9, { size: 9.5, align: 'right', color: C.faint, maxW: gw * 0.5 });
        const cy = gy + gh + 22;
        T.caption(c, 10, cy, W - 20, H - cy - 6, margin >= 0 ? 'The link works with ' + sig(margin, 2) + ' dB of margin' : 'The link fails: ' + sig(-margin, 2) + ' dB short', 'Launch ' + V.Pt + ' dBm, lose ' + sig(tot, 3) + ' dB, receive ' + sig(Pr, 3) + ' dBm. The budget between laser and receiver is ' + sig(V.Pt - V.rx, 3) + ' dB; a common class of passive network allows about 28 dB. Every dB of loss multiplies the power by 0.79; 3 dB halves it.');
        ro.set('a', sig(Ls, 3) + ' dB (ideal 10 log₁₀ ' + V.n + ' = ' + sig(ideal, 3) + ' dB)');
        ro.set('b', sig(fib, 3) + ' dB (' + sig(a, 2) + ' dB/km at ' + V.wl + ' nm)');
        ro.set('c', sig(tot, 3) + ' dB');
        ro.set('d', sig(Pr, 3) + ' dBm = ' + sig(Pw * 1e6, 3) + ' µW');
        ro.set('e', sig(margin, 2) + ' dB (' + (margin >= 0 ? 'works' : 'fails') + ')');
        ro.set('f', sig(ph, 3) + ' photons of ' + V.wl + ' nm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ car headlamps */
  Hyper.sim('es-headlamp', {
    title: 'A dipped beam on the road: cut-off, aim and load',
    blurb: `A car's lamp 0.7 m above the road, seen from the side. The wedge is the dipped beam: **bright below the cut-off, dark above it**, so that the oncoming driver's eyes (the dot at 41 m, 1.1 m high) stay outside. The vertical scale is stretched, as the note says. Above the road the section of the optics shows how a **reflector** (soft edge) and a **projector** (sharp edge) make the cut-off.

**Try this**
- Lower the **aim** from 1 % to 0.2 %: the beam reaches 350 m but the cut-off rises towards the oncoming driver's eyes. Raise it to 3 %: safe, but the road is lit only to 23 m.
- Press the **rear axle down** by 60 mm (luggage): the beam rises by 2.2 % and the oncoming driver is dazzled (at 50 mm he is just in the soft edge). That is why many lamps level themselves.
- Switch the **optics** between reflector and projector at a marginal aim: the soft edge of the reflector spills light above the cut-off, the projector's does not.
- Choose the **main beam**: there is no cut-off and the other driver is always dazzled.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 480, maxH: 620 });
      const T = tools(st, kit);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Headlamp optics', options: [['Reflector: the mirror shapes the beam', 'refl'], ['Projector: a lens images a shield edge', 'proj']], value: params.type || 'proj' },
        { id: 'beam', type: 'select', label: 'Beam', options: [['Dipped (low) beam', 'low'], ['Main (high) beam', 'high']], value: params.beam || 'low' },
        { id: 'aim', label: 'Aim: cut-off below the horizontal', min: 0, max: 3, step: 0.05, value: params.aim != null ? params.aim : 1, unit: '%' },
        { id: 'h', label: 'Height of the lamp', min: 0.5, max: 1.2, step: 0.05, value: params.h || 0.7, unit: 'm' },
        { id: 'drop', label: 'Rear axle pushed down by the load', min: 0, max: 120, step: 5, value: params.drop || 0, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Slope of the cut-off'], ['b', 'Reach of the dipped beam'], ['c', 'Cut-off height at 25 m'], ['d', 'Beam raised by the load'], ['e', 'Oncoming driver at 41 m']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const WB = 2.7, tau = V.drop / 1000 / WB, aim = V.aim / 100, low = V.beam === 'low', proj = V.type === 'proj';
        const sUp = low ? -aim + tau : 0.06, sLow = low ? sUp - 0.07 : -0.05, soft = proj ? 0.003 : 0.018;
        const reach = sUp < -1e-9 ? V.h / -sUp : Infinity, XE = 41, eyeS = (1.1 - V.h) / XE;
        const glare = !low ? 2 : eyeS < sUp ? 2 : eyeS < sUp + soft ? 1 : 0;
        // ---- the section of the optics
        const rx0 = 10, rw = W - 20, ry0 = 0.035 * H, rh = 0.25 * H, cy = ry0 + rh / 2;
        c.fillStyle = C.surface; c.fillRect(rx0, ry0, rw, rh);
        const rayLine = (pts, a, w) => { c.save(); c.globalAlpha = a; S.ray(c, pts, { nm: 580, width: w, arrows: false }); c.restore(); };
        if (!proj) {
          const xv = rx0 + 0.04 * rw, R = 0.42 * rh, xr = rx0 + 0.34 * rw, f = R * R / (4 * (xr - xv)), xe = rx0 + 0.8 * rw;
          c.strokeStyle = S.metal(); c.lineWidth = 2.6; c.beginPath(); for (let i = -20; i <= 20; i++) { const y = R * i / 20, x = xv + y * y / (4 * f); i === -20 ? c.moveTo(x, cy + y) : c.lineTo(x, cy + y); } c.stroke();
          for (const yy of [-0.85, -0.5, -0.15, 0.15, 0.5, 0.85]) { const y = R * yy, x = xv + y * y / (4 * f); rayLine([[xv + f, cy], [x, cy + y], [xe, cy + y]], 0.9, 1.2); }
          for (const sg of [-1, 1]) { const y = sg * R * 0.85, x = xv + y * y / (4 * f); rayLine([[x, cy + y], [xe, cy + y + sg * (xe - x) * 0.07]], 0.45, 1); }
          c.fillStyle = C.warn; c.beginPath(); c.arc(xv + f, cy, 3.5, 0, 2 * PI); c.fill(); c.fillStyle = C.text; c.fillRect(xv + f - 4, cy + 4, 10, 3);
          T.txt(c, 'reflector: a mirror around a small source (and a cap below it)', rx0 + 6, ry0 + 10, { size: 10, color: C.muted, maxW: rw - 12 });
          T.txt(c, 'the source has a size, so the beam edge is soft', rx0 + 6, ry0 + rh - 9, { size: 10, color: C.muted, maxW: rw - 12 });
        } else {
          const a = 0.19 * rw, b = 0.36 * rh, cx = rx0 + 0.3 * rw, cc = Math.sqrt(Math.max(1, a * a - b * b)), f1 = cx - cc, f2 = cx + cc, xl = f2 + 0.17 * rw, fl = xl - f2, xe = rx0 + 0.95 * rw;
          c.strokeStyle = S.metal(); c.lineWidth = 2.6; c.beginPath(); for (let i = 0; i <= 24; i++) { const t = PI - 1.25 + 2.5 * i / 24, x = cx + a * Math.cos(t), y = cy + b * Math.sin(t); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
          c.fillStyle = C.text; c.fillRect(f2, cy, 0.035 * rw, 4); c.fillRect(f2 - 1.5, cy, 3, 0.3 * rh);
          S.lens(c, xl, cy, 0.42 * rh, { f: 1, bulge: 2.4, t: 8 });
          for (const t of [-0.9, -0.55, 0.55, 0.9, 1.1]) {
            const px = cx + a * Math.cos(PI + t), py = cy + b * Math.sin(PI + t);
            if (py < cy) rayLine([[f1, cy], [px, py], [f2, cy + 2]], 0.7, 1.1);                      // from the upper arc the light falls on the shield: blocked
            else { const yk = (0.4 + 0.5 * Math.abs(t)) * 3, yl = -0.3 * rh * (t / 1.1); rayLine([[f1, cy], [px, py], [f2, cy - yk], [xl, cy + yl], [xe, cy + yl + yk / fl * (xe - xl)]], 0.9, 1.2); }
          }
          c.fillStyle = C.warn; c.beginPath(); c.arc(f1, cy, 3.5, 0, 2 * PI); c.fill();
          T.txt(c, 'projector: an ellipsoidal mirror focuses the source on a shield edge', rx0 + 6, ry0 + 10, { size: 10, color: C.muted, maxW: rw - 12 });
          T.txt(c, 'the lens images the edge onto the road: a sharp cut-off', rx0 + 6, ry0 + rh - 9, { size: 10, color: C.muted, maxW: rw - 12 });
        }
        // ---- the road, seen from the side with the vertical scale stretched
        const ot = ry0 + rh + 18, oh = 0.45 * H, yb = ot + oh - 16, pxX = (W - 20) / 106, pxY = (oh - 30) / 1.65, X = x => 10 + (x + 6) * pxX, Y = y => yb - y * pxY;
        c.fillStyle = C.surface; c.fillRect(10, yb, W - 20, 12);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(10, yb); c.lineTo(W - 10, yb); c.stroke();
        for (const xm of [0, 25, 50, 75, 100]) { c.beginPath(); c.moveTo(X(xm), yb); c.lineTo(X(xm), yb + 5); c.stroke(); T.txt(c, xm + (xm === 100 ? ' m' : ''), X(xm), yb + 16, { size: 9.5, align: 'center', color: C.faint, maxW: 40 }); }
        // our car and the oncoming one (everything in the road view is clipped to its band)
        c.save(); c.beginPath(); c.rect(10, ot, W - 20, yb + 12 - ot); c.clip();
        c.fillStyle = bodyFill(C); c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(X(-4.4), Y(1.25), 4.4 * pxX, 1.0 * pxY); c.strokeRect(X(-4.4), Y(1.25), 4.4 * pxX, 1.0 * pxY);
        c.fillRect(X(XE - 0.2), Y(1.35), 4.4 * pxX, 1.1 * pxY); c.strokeRect(X(XE - 0.2), Y(1.35), 4.4 * pxX, 1.1 * pxY);
        c.fillStyle = C.warn; c.beginPath(); c.arc(X(0), Y(V.h), 3.5, 0, 2 * PI); c.fill();
        // the beam
        const endOf = s => { const x = s < -1e-9 ? Math.min(100, V.h / -s) : 100; return [x, Math.max(0, V.h + s * x)]; };
        const eu = endOf(sUp), el = endOf(sLow), P0 = [0, V.h], pts = [P0, eu];
        if (eu[1] > 0 && el[1] === 0) pts.push([100, 0]);
        pts.push(el);
        c.fillStyle = 'rgba(255,214,90,0.26)'; c.strokeStyle = 'rgba(255,214,90,0.85)'; c.lineWidth = 1.2; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.closePath(); c.fill(); c.stroke();
        for (let k = 1; k <= 3; k++) { const e = endOf(sUp + soft * k / 3); c.strokeStyle = 'rgba(255,214,90,' + (0.5 - 0.12 * k) + ')'; c.beginPath(); c.moveTo(X(0), Y(V.h)); c.lineTo(X(e[0]), Y(e[1])); c.stroke(); }
        c.restore();
        // the cut-off marks and the oncoming driver
        const hc = V.h + sUp * 25;
        if (low) { c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(X(25) - 5, Y(hc)); c.lineTo(X(25) + 5, Y(hc)); c.stroke(); T.txt(c, hc > 0 ? 'cut-off at 25 m: ' + sig(hc, 2) + ' m high' : 'cut-off meets the road before 25 m', X(25), Y(Math.max(hc, 0)) - 9, { size: 10, align: 'center', color: C.text, maxW: 0.5 * W }); }
        if (low && Number.isFinite(reach) && reach < 100) { c.fillStyle = C.warn; c.beginPath(); c.arc(X(reach), yb, 4, 0, 2 * PI); c.fill(); T.txt(c, 'reach ' + sig(reach, 2) + ' m', X(reach), yb - 12, { size: 10.5, weight: 650, align: 'center', color: C.warn, maxW: 90 }); }
        else if (low) T.txt(c, 'reach beyond 100 m', X(70), yb - 12, { size: 10.5, weight: 650, align: 'center', color: C.warn, maxW: 120 });
        const gc = glare === 2 ? C.bad : glare === 1 ? C.warn : C.ok;
        c.fillStyle = gc; c.beginPath(); c.arc(X(XE + 1.2), Y(1.1), 4.5, 0, 2 * PI); c.fill();
        T.txt(c, glare === 2 ? 'dazzled' : glare === 1 ? 'in the soft edge' : 'not dazzled', X(XE + 1.2), Math.max(Y(1.1) - 14, ot + 8), { size: 10.5, weight: 650, align: 'center', color: gc, maxW: 100 });
        T.txt(c, 'vertical scale × ' + sig(pxY / pxX, 2), W - 12, ot + 8, { size: 9.5, align: 'right', color: C.faint, maxW: 0.4 * W });
        // ---- the caption
        const cap = (low ? 'The cut-off is aimed ' + sig(aim * 100, 3) + ' % below the horizontal' + (tau > 0 ? ' but the load raises it by ' + sig(tau * 100, 3) + ' %, so it ends up ' + sig(Math.abs(sUp) * 100, 3) + ' % ' + (sUp < 0 ? 'below' : 'above') + '. ' : '. ') + (Number.isFinite(reach) ? 'A lamp ' + V.h + ' m high then lights the road to ' + sig(reach, 3) + ' m (height ÷ slope). ' : 'The cut-off never meets the road. ') : 'The main beam has no cut-off: it throws light far up the road and above the horizon, so oncoming drivers are dazzled. ') + (proj ? 'The projector images a shield edge: a sharp line.' : 'The reflector\'s edge is soft because the source has a size.');
        const cy2 = ot + oh + 8;
        T.caption(c, 10, cy2, W - 20, H - cy2 - 6, low ? 'Dipped beam: ' + (glare === 0 ? 'the oncoming driver is not dazzled' : glare === 1 ? 'the oncoming driver is in the soft edge' : 'the oncoming driver is dazzled') : 'Main beam', cap);
        ro.set('a', low ? sig(-sUp * 100, 3) + ' % ' + (sUp <= 0 ? 'below' : 'above') + ' the horizontal' : 'none: main beam');
        ro.set('b', low ? (Number.isFinite(reach) ? sig(reach, 3) + ' m' : 'to the horizon (cut-off above the road)') : 'far up the road');
        ro.set('c', low ? sig(hc, 2) + ' m above the road' : 'not defined');
        ro.set('d', sig(tau * 100, 3) + ' % (' + V.drop + ' mm on a 2.7 m wheelbase)');
        ro.set('e', glare === 2 ? 'dazzled' : glare === 1 ? 'in the soft edge: some glare' : 'not dazzled');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the lighthouse lens */
  Hyper.sim('es-lighthouse', {
    title: 'The lighthouse lens: rings, prisms and a rotating beam',
    blurb: `**Section.** A lamp at the focus of a Fresnel lens, drawn in units of the focal distance. Rays near the axis meet the central **refracting rings**; rays at larger angles meet the **catadioptric prisms**, which refract, reflect totally and refract again. The slider picks a ray (highlighted); the readout gives the slope of the facet it meets or the angle at which it strikes the prism's back face. **Beam.** The lens panels turn round the lamp: the observer sees a short flash each time a beam sweeps past.

**Try this**
- Slide the ray from 0° to 70°: the ring facets grow steeper (49° at 30°); beyond about 31° the prism takes over, and its back face is met at 90° − θ/2, well beyond the critical angle.
- Choose a **shorter focal distance** (sixth order) with the same lamp: the beam widens from 1.6° to 9.5°. A smaller lamp narrows it.
- Raise the **lamp luminance** or take more of the lens: the beam's intensity is lamp luminance × lens area, not lamp area.
- In the beam view, change the **number of panels** and the **revolution time**: the flash period is the time of a revolution divided by the number of panels.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.94, minH: 490, maxH: 630 });
      const T = tools(st, kit);
      const nG = O.index('crown-1.523', 550), crit = O.criticalAngle(nG, 1);
      // the facet slope that turns the light coming through a flat entry face parallel to the axis: tan α = n sin θ′ / (n cos θ′ − 1)
      const facet = th => { const tp = Math.asin(Math.sin(th) / nG), a = Math.atan2(nG * Math.sin(tp), nG * Math.cos(tp) - 1); return { alpha: a, tp, inc: a - tp }; };
      let thLim = 0; for (let d = 0; d < 80; d += 0.1) { if (facet(d * D2R).alpha > 50 * D2R) break; thLim = d * D2R; }
      const yE = Math.tan(thLim), K = Math.max(2, Math.round(yE / 0.055)), t0 = 0.09, rings = [];
      for (let j = 0; j < K; j++) { const ya = j * yE / K, yb = (j + 1) * yE / K, fc = facet(Math.atan((ya + yb) / 2)); rings.push({ ya, yb, a: fc.alpha, d: (yb - ya) * Math.tan(fc.alpha) }); }
      const RE = 1, RS = 0.18, XEX = 1.15;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Section of the lens', 'sec'], ['The rotating beam from above', 'beam']], value: params.view || 'sec' },
        { id: 'f', type: 'select', label: 'Order of the lens', options: [['First order: focal distance 920 mm', 920], ['Second order: 700 mm', 700], ['Third order: 500 mm', 500], ['Third and a half order: 375 mm', 375], ['Fourth order: 250 mm', 250], ['Fifth order: 187.5 mm', 187.5], ['Sixth order: 150 mm', 150]], value: params.f || 920 },
        { id: 's', label: 'Size of the lamp', min: 5, max: 60, step: 1, value: params.s || 25, unit: 'mm' },
        { id: 'th', label: 'Ray from the lamp, angle from the axis', min: 0, max: 72, step: 1, value: params.th != null ? params.th : 20, unit: '°' },
        { id: 'L', label: 'Luminance of the lamp', min: 1e4, max: 1e8, value: params.L || 1e7, log: true, sig: 2, unit: 'cd/m²' },
        { id: 'N', type: 'select', label: 'Lens panels', options: [2, 3, 4, 5, 6, 8].map(k => [k + ' panels', k]), value: params.N || 4 },
        { id: 'Tr', label: 'Time of one revolution', min: 10, max: 60, step: 1, value: params.Tr || 40, unit: 's' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Beam width (lamp size ÷ focal distance)'], ['b', 'Intensity of the beam'], ['c', 'The lamp alone'], ['d', 'The ray shown'], ['e', 'Flash']]);
      function vis() { const sec = V.view === 'sec'; ['th'].forEach(id => ctl.show(id, sec)); ['N', 'Tr'].forEach(id => ctl.show(id, !sec)); }
      const ringAt = y => rings[Math.min(K - 1, Math.max(0, Math.floor(y / (yE / K))))];
      // a ray from the lamp at angle θ (radians): points in units of the focal distance
      function rayPts(th) {
        if (th <= thLim) {
          const ye = Math.tan(th), r = ringAt(ye), fc = facet(th), xf = 1 + t0 - (ye - r.ya) * Math.tan(r.a), yf = ye + (xf - 1) * Math.tan(fc.tp);
          return [[0, 0], [1, ye], [xf, yf], [1.3, yf]];
        }
        const ry = (RE + RS) * Math.sin(th);
        return [[0, 0], [RE * Math.cos(th), RE * Math.sin(th)], [(RE + RS) * Math.cos(th), ry], [XEX, ry], [1.3, ry]];
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const wb = V.s / V.f, Ap = 2.2 * (V.f / 1000) * (V.f / 1000), Ilens = V.L * Ap * 0.8, Asrc = PI / 4 * Math.pow(V.s / 1000, 2), Ilamp = V.L * Asrc;
        const fl = V.Tr / V.N, dur = wb * V.Tr / (2 * PI);
        if (V.view === 'sec') {
          const m = S.map(st, -0.12, 1.3, 1.25, { left: 10, right: 0.2 * W, top: 14, bottom: 96 });
          const P = (x, y) => [m.X(x), m.Y(y)];
          // the prisms (mirrored below the axis)
          const edges = []; for (let d = thLim * R2D; d < 72; d += 6) edges.push(d * D2R); edges.push(72 * D2R);
          for (let i = 0; i + 1 < edges.length; i++) {
            const a = edges[i], b = edges[i + 1], E = th => [RE * Math.cos(th), RE * Math.sin(th)], Rr = th => [(RE + RS) * Math.cos(th), (RE + RS) * Math.sin(th)], X = th => [XEX, (RE + RS) * Math.sin(th)];
            const poly = [E(a), E(b), Rr(b), X(b), X(a), Rr(a)];
            for (const sg of [1, -1]) S.poly(c, poly.map(p => P(p[0], sg * p[1])), { fill: glassFill(C) });
          }
          // the central lens: a flat face towards the lamp, rings on the other side
          const up = []; rings.forEach(r => { up.push([1 + t0, r.ya], [1 + t0 - r.d, r.yb], [1 + t0, r.yb]); });
          const outer = up.map(p => [p[0], -p[1]]).reverse().concat(up);
          S.poly(c, [[1, -yE], [1, yE]].concat(outer.slice().reverse()).map(p => P(p[0], p[1])), { fill: glassFill(C) });
          // the rays
          const sel = V.th * D2R;
          for (let d = 0; d <= 72; d += 8) for (const sg of [1, -1]) { if (d === 0 && sg < 0) continue; const pts = rayPts(d * D2R).map(p => P(p[0], sg * p[1])); c.save(); c.globalAlpha = 0.5; S.ray(c, pts, { nm: 580, width: 1.1, arrows: false }); c.restore(); }
          S.ray(c, rayPts(sel).map(p => P(p[0], p[1])), { color: C.accent, width: 2.6, arrows: true, minArrow: 40 });
          S.ray(c, rayPts(sel).map(p => P(p[0], -p[1])), { color: C.accent, width: 1.2, arrows: false, alpha: 0.6 });
          S.source(c, m.X(0), m.Y(0), { kind: 'bulb', size: 8 });
          S.axis(c, m.X(-0.1), m.Y(0), m.X(1.3));
          T.txt(c, 'lamp at the focus', m.X(0), m.Y(0) + 18, { size: 10.5, align: 'left', color: C.muted, maxW: 0.3 * W });
          T.txt(c, 'rings', m.X(1.3) + 8, m.Y(0), { size: 10.5, color: C.muted, maxW: 0.16 * W });
          T.txt(c, 'prisms', m.X(1.3) + 8, m.Y(0.95), { size: 10.5, color: C.muted, maxW: 0.16 * W });
          T.txt(c, 'prisms', m.X(1.3) + 8, m.Y(-0.95), { size: 10.5, color: C.muted, maxW: 0.16 * W });
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(m.X(0), m.Y(-1.2)); c.lineTo(m.X(1), m.Y(-1.2)); c.moveTo(m.X(0), m.Y(-1.17)); c.lineTo(m.X(0), m.Y(-1.23)); c.moveTo(m.X(1), m.Y(-1.17)); c.lineTo(m.X(1), m.Y(-1.23)); c.stroke(); c.restore();
          T.txt(c, 'focal distance ' + sig(V.f, 4) + ' mm', m.X(0.5), m.Y(-1.2) - 9, { size: 10.5, align: 'center', color: C.muted, maxW: 0.5 * W });
          const zone = sel <= thLim, fc = facet(sel), inc = PI / 2 - sel / 2;
          T.caption(c, 10, H - 84, W - 20, 76, zone ? 'Refracting ring' : 'Catadioptric prism', zone ? 'The ray at ' + V.th + '° enters the flat face, is refracted there and again at a groove that slopes ' + sig(fc.alpha * R2D, 3) + '°, and leaves parallel to the axis. Beyond ' + sig(thLim * R2D, 3) + '° the grooves would slope more than 50° and waste light.' : 'The ray at ' + V.th + '° enters the prism face at right angles, meets its back face at ' + sig(inc * R2D, 3) + '°, beyond the critical angle of ' + sig(crit * R2D, 3) + '°: total internal reflection. It leaves parallel to the axis.');
          ro.set('d', zone ? 'ring: groove slope ' + sig(fc.alpha * R2D, 3) + '° (to ' + sig(thLim * R2D, 3) + '°)' : 'prism: back face met at ' + sig(inc * R2D, 3) + '° (critical ' + sig(crit * R2D, 3) + '°)');
        } else {
          const R = Math.min(0.38 * W, 0.28 * H), cx = 0.46 * W, cy = 0.03 * H + R + 14, tscale = V.Tr / 8, tr = t * tscale, ph = 2 * PI * tr / V.Tr;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, 0, 2 * PI); c.stroke();
          for (let k = 0; k < V.N; k++) {
            const an = ph + 2 * PI * k / V.N, hw = Math.max(wb / 2, 0.004);
            c.fillStyle = 'rgba(255,214,90,0.55)'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, an - hw, an + hw); c.closePath(); c.fill();
            c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 0.2 * R, an - 0.22, an + 0.22); c.stroke();
          }
          S.source(c, cx, cy, { kind: 'bulb', size: 7 });
          S.eye(c, cx + R + 22, cy, 9, { dir: -1 });
          T.txt(c, 'observer', cx + R + 22, cy + 22, { size: 10, align: 'center', color: C.muted, maxW: 70 });
          T.txt(c, 'seen from above; the animation is ' + sig(tscale, 2) + ' × faster than real', 10, 12, { size: 10, color: C.faint, maxW: W - 20 });
          // the intensity the observer sees, in real time
          const gx = 14, gw = W - 28, gy = cy + R + 40, gh = 0.12 * H, Wr = 2.5 * fl;
          c.fillStyle = C.surface; c.fillRect(gx, gy, gw, gh); c.strokeStyle = C.faint; c.strokeRect(gx, gy, gw, gh);
          const sg = Math.max(dur / 2.355, 1e-4);
          for (let mm = Math.floor((tr - Wr) / fl) - 1; mm <= Math.ceil(tr / fl) + 1; mm++) {
            const tc = mm * fl; if (tc < tr - Wr - 4 * sg || tc > tr + 4 * sg) continue;
            c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath();
            for (let u = -4; u <= 4.001; u += 0.5) { const x = gx + gw * ((tc + u * sg) - (tr - Wr)) / Wr, y = gy + gh - 4 - (gh - 10) * Math.exp(-0.5 * u * u); u === -4 ? c.moveTo(clamp(x, gx, gx + gw), y) : c.lineTo(clamp(x, gx, gx + gw), y); }
            c.stroke();
          }
          T.txt(c, 'what the observer sees, in real time (' + sig(Wr, 3) + ' s shown)', gx + 4, gy + 9, { size: 10, color: C.muted, maxW: gw - 8 });
          const cy2 = gy + gh + 14;
          T.caption(c, 10, cy2, W - 20, H - cy2 - 6, 'Flash every ' + sig(fl, 3) + ' s, lasting ' + sig(dur, 2) + ' s', V.N + ' panels turn once in ' + V.Tr + ' s, so a beam sweeps the observer every ' + sig(fl, 3) + ' s. The beam is ' + sig(wb * R2D, 3) + '° wide and moves ' + sig(360 / V.Tr, 3) + '° each second, so it lights the observer for about ' + sig(dur, 2) + ' s. The beam is drawn at its true width.');
          ro.set('d', 'not used in this view');
        }
        ro.set('a', sig(wb * R2D, 3) + '° (' + sig(V.s, 3) + ' mm ÷ ' + sig(V.f, 4) + ' mm)');
        ro.set('b', sig(Ilens, 3) + ' cd (a panel 2.2 f tall and f wide, 80 % transmission)');
        ro.set('c', sig(Ilamp, 3) + ' cd; the lens gives ' + sig(Ilens / Ilamp, 3) + ' ×');
        ro.set('e', 'every ' + sig(fl, 3) + ' s, lasting ' + sig(dur, 2) + ' s');
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ night vision and thermal cameras */
  Hyper.sim('es-night', {
    title: 'Night vision and a thermal camera',
    blurb: `**Image intensifier.** The picture is a magnified patch of the tube's screen, 56 × 40 resolution elements, redrawn ten times a second. At very low light each element receives less than one photon in a tenth of a second, so the picture is a sparse shower of single flashes. **Thermal camera.** The scene is drawn by the heat each object radiates in the 8–14 µm band; the noise is the camera's NETD. The graph shows Planck curves of the person and the wall with the camera's band shaded.

**Try this**
- Intensifier: lower the **illuminance** from full moon (0.25 lx) to starlight (0.001 lx) and watch the picture dissolve into flashes; then raise the **photocathode efficiency**.
- Thermal: close the **temperature range** to 5 K and the person saturates while the wall stays grey; open it to 40 K and the contrast fades.
- Thermal: raise the **noise** to 150 mK, then bring the wall to **34 °C**: the person's face is as warm as the wall and disappears, though the camera never sees any light at all.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.94, minH: 490, maxH: 630 });
      const T = tools(st, kit);
      const NAMES = { int: ['Objective lens', 'Photocathode', 'Microchannel plate', 'Phosphor screen', 'Eyepiece'], th: ['Germanium lens', 'Coating', 'Microbolometer array', 'Processing', 'Display'] };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Camera', options: [['Image intensifier (night vision)', 'int'], ['Thermal camera (8–14 µm)', 'th']], value: params.mode || 'int' },
        { id: 'E', label: 'Scene illuminance', min: 1e-4, max: 1, value: params.E || 0.003, log: true, sig: 2, unit: 'lx' },
        { id: 'qe', label: 'Photocathode efficiency', min: 10, max: 40, step: 1, value: params.qe || 25, unit: '%' },
        { id: 'Tb', label: 'Temperature of the wall and ground', min: -20, max: 40, step: 1, value: params.Tb != null ? params.Tb : 15, unit: '°C' },
        { id: 'span', label: 'Temperature range of the picture', min: 2, max: 40, step: 1, value: params.span || 15, unit: 'K' },
        { id: 'netd', label: 'Noise of the camera (NETD)', min: 15, max: 150, value: params.netd || 40, log: true, sig: 2, unit: 'mK' },
        { id: 'pal', type: 'select', label: 'Palette', options: [['White hot', 'white'], ['Black hot', 'black'], ['Iron', 'iron']], value: params.pal || 'white' },
        { id: 'step', label: 'Follow the light', min: 0, max: 5, step: 1, value: params.step || 0, fmt: v => v < 1 ? 'all parts' : 'part ' + v }
      ], () => { vis(); dirty = true; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Scene'], ['b', 'Light or radiance'], ['c', 'Per pixel'], ['d', 'Noise'], ['e', 'Optics and result']]);
      function vis() { const i = V.mode === 'int'; ['E', 'qe'].forEach(id => ctl.show(id, i)); ['Tb', 'span', 'netd', 'pal'].forEach(id => ctl.show(id, !i)); }
      const NX = 56, NY = 40;
      let dirty = true, lastTick = -1;
      const rnd = (a, b, c) => hash(a * 12.9898 + b * 78.233 + c * 37.719);
      const poisson = (lam, a, b, tick) => { if (lam < 30) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= rnd(a, b, tick * 7 + k); } while (p > L && k < 200); return k - 1; } const u1 = Math.max(1e-9, rnd(a, b, tick * 7 + 1)), u2 = rnd(a, b, tick * 7 + 2); return Math.max(0, Math.round(lam + Math.sqrt(lam) * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * PI * u2))); };
      const gauss = (a, b, tick) => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd(a, b, tick * 3 + 1)))) * Math.cos(2 * PI * rnd(a, b, tick * 3 + 2));
      const inShape = (u, v) => ({ head: ((u - 0.75) / 0.05) ** 2 + ((v - 0.34) / 0.07) ** 2 < 1, body: ((u - 0.75) / 0.09) ** 2 + ((v - 0.62) / 0.2) ** 2 < 1, tree: u > 0.52 && u < 0.62 && v > 0.40 && v < 0.62, pipe: u > 0.08 && u < 0.46 && v > 0.70 && v < 0.76, house: u > 0.08 && u < 0.46 && v > 0.28 && v < 0.62, win: u > 0.16 && u < 0.28 && v > 0.36 && v < 0.5, sky: v < 0.28 });
      const refl = (u, v) => { const s = inShape(u, v); return s.head || s.body ? 0.25 : s.tree ? 0.07 : s.pipe ? 0.3 : s.win ? 0.1 : s.house ? 0.42 : s.sky ? 0.03 : 0.2; };
      const tempK = (u, v, Tb) => { const s = inShape(u, v); return s.head ? 307 : s.body ? 303 : s.tree ? Tb - 1 : s.pipe ? 330 : s.win ? Tb + 6 : s.house ? Tb + 2 : s.sky ? Tb - 20 : Tb - 1; };
      const memo = new Map();
      const bandL = Tk => { const key = Math.round(Tk * 2); let v = memo.get(key); if (v == null) { v = 0; for (let nm = 8000; nm <= 14000; nm += 100) v += O.photo.planck(nm, key / 2); memo.set(key, v); } return v; };
      const iron = v => { const stops = [[0, 0, 0], [60, 0, 120], [200, 40, 60], [255, 160, 0], [255, 255, 200]], x = clamp(v, 0, 1) * 4, i = Math.min(3, Math.floor(x)), f = x - i; return stops[i].map((a, k) => a + (stops[i + 1][k] - a) * f); };
      // the photoelectrons per 10 µm element in 0.1 s for a scene of illuminance E (reflectance 0.2, f/1.4, transmission 0.8)
      const peOf = (E, qe) => { const L = E * 0.2 / PI, Ei = O.photo.imageIlluminance(L, 1.4, 0.8, 0, 0), ph = O.cam.photons({ lux: Ei, t: 0.1, pitch: 10 }); return { Ei, ph, pe: ph * qe / 100 }; };
      let img = new Float32Array(NX * NY);
      const loop = kit.loop((dt, t) => {
        const tick = Math.floor(t * 10);
        if (!dirty && tick === lastTick) return;
        lastTick = tick; dirty = false;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, intens = V.mode === 'int', step = V.step, names = NAMES[V.mode];
        // ---- the chain of parts
        const n = 5, gap = 10, bw = (W - 20 - (n - 1) * gap) / n, by = 0.03 * H, bh = 0.13 * H;
        const SUB = intens ? ['f/1.4', 'photon → electron', 'gain 10³–10⁴', 'electron → green', 'magnifier'] : ['germanium', 'less reflection', '12 µm pixels', 'NETD', 'palette'];
        for (let i = 0; i < n; i++) {
          const x = 10 + i * (bw + gap), on = step === 0 || step === i + 1;
          c.save(); c.globalAlpha = on ? 1 : 0.5; c.fillStyle = C.surface; c.strokeStyle = step === i + 1 ? C.accent : C.faint; c.lineWidth = step === i + 1 ? 2.4 : 1.2; c.fillRect(x, by, bw, bh); c.strokeRect(x, by, bw, bh); c.restore();
          T.txt(c, names[i], x + bw / 2, by + bh * 0.4, { size: 10.5, weight: 650, align: 'center', maxW: bw - 4, color: on ? C.text : C.muted });
          T.txt(c, SUB[i], x + bw / 2, by + bh * 0.74, { size: 9.5, align: 'center', maxW: bw - 4, color: C.muted });
          if (i < n - 1) kit.arrow(c, x + bw + 1, by + bh / 2, x + bw + gap - 1, by + bh / 2, C.muted, 1.3, 5);
          T.badge(c, i + 1, x + bw / 2, by + bh + 11, on);
        }
        const iy = by + bh + 28, iw = 0.52 * W, ih = iw * NY / NX, ix = 10;
        let pe = 0, info = null;
        if (intens) {
          info = peOf(V.E, V.qe); pe = info.pe;
          const lam0 = pe, norm = Math.max(1, 2 * lam0);
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const u = (i + 0.5) / NX, v = (j + 0.5) / NY, lam = lam0 * refl(u, v) / 0.2; img[j * NX + i] = clamp(poisson(lam, i, j, tick) / norm * (lam0 < 1 ? 1 : 1), 0, 1); }
          S.cells(c, ix, iy, iw, ih, NX, NY, (u, v) => { const val = img[Math.floor(v * NY) * NX + Math.floor(u * NX)]; return [30 * val, 255 * Math.pow(val, 0.8), 80 * val]; });
        } else {
          const Tb = V.Tb + 273.15, Tlo = Tb - 0.35 * V.span, Llo = bandL(Tlo), Lhi = bandL(Tlo + V.span);
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const u = (i + 0.5) / NX, v = (j + 0.5) / NY, Tm = tempK(u, v, Tb) + gauss(i, j, tick) * V.netd / 1000; img[j * NX + i] = clamp((bandL(Tm) - Llo) / (Lhi - Llo), 0, 1); }
          S.cells(c, ix, iy, iw, ih, NX, NY, (u, v) => { const val = img[Math.floor(v * NY) * NX + Math.floor(u * NX)]; if (V.pal === 'iron') return iron(val); const g = 255 * (V.pal === 'black' ? 1 - val : val); return [g, g, g]; });
        }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(ix, iy, iw, ih);
        T.txt(c, intens ? 'a patch of the screen: 56 × 40 elements, 0.1 s each' : 'the thermal picture (white hot, black hot or iron)', ix, iy - 9, { size: 10, color: C.muted, maxW: iw + 40 });
        // ---- the graph at the right
        const gx = ix + iw + 0.05 * W, gw = W - gx - 12, gy = iy + 18, gh = ih - 22;
        c.fillStyle = C.surface; c.fillRect(gx, gy, gw, gh); c.strokeStyle = C.faint; c.strokeRect(gx, gy, gw, gh);
        if (intens) {
          const lo = -2, hi = 3, X = pe2 => gx + gw * clamp((Math.log10(Math.max(pe2, 1e-9)) - lo) / (hi - lo), 0, 1);
          c.fillStyle = C.series[2]; c.fillRect(gx, gy + gh * 0.45, Math.max(2, X(pe) - gx), 10);
          T.txt(c, 'photoelectrons per element in 0.1 s', gx, gy - 9, { size: 10, color: C.muted, maxW: gw + 10 });
          let k = 0;
          for (const [nm, E] of [['starlight', 0.001], ['full moon', 0.25], ['twilight', 1]]) { const x = X(peOf(E, V.qe).pe); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, gy + gh * 0.38); c.lineTo(x, gy + gh * 0.45 + 18); c.stroke(); T.txt(c, nm, clamp(x, gx + 24, gx + gw - 24), gy + gh * 0.45 + 28 + 12 * (k++ % 2), { size: 9.5, align: 'center', color: C.warn, maxW: 60 }); }
          T.txt(c, 'now: ' + sig(pe, 3), gx + 4, gy + gh * 0.2, { size: 11, weight: 650, color: C.text, maxW: gw - 8 });
          T.txt(c, '0.01', gx + 2, gy + gh - 7, { size: 9, color: C.faint, maxW: 30 }); T.txt(c, '1000', gx + gw - 2, gy + gh - 7, { size: 9, align: 'right', color: C.faint, maxW: 30 });
        } else {
          const Tb = V.Tb + 273.15, X = nm => gx + gw * (nm - 2000) / 18000, ymax = O.photo.planck(O.photo.wien(307), 307) * 1.05;
          c.fillStyle = 'rgba(255,205,80,0.18)'; c.fillRect(X(8000), gy, X(14000) - X(8000), gh);
          for (const [Tk, col] of [[307, C.accent], [Tb, C.muted]]) { c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath(); for (let nm = 2000; nm <= 20000; nm += 400) { const x = X(nm), y = gy + gh * (1 - clamp(O.photo.planck(nm, Tk) / ymax, 0, 1)); nm === 2000 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
          T.txt(c, 'Planck curves, 2–20 µm', gx, gy - 9, { size: 10, color: C.muted, maxW: gw + 10 });
          T.txt(c, 'person 307 K', gx + gw - 4, gy + 12, { size: 9.5, align: 'right', color: C.accent, maxW: gw - 8 });
          T.txt(c, 'wall ' + sig(Tb, 4) + ' K', gx + gw - 4, gy + 24, { size: 9.5, align: 'right', color: C.muted, maxW: gw - 8 });
          T.txt(c, '8–14 µm band', (X(8000) + X(14000)) / 2, gy + gh - 8, { size: 9.5, align: 'center', color: C.warn, maxW: X(14000) - X(8000) + 10 });
          T.txt(c, '2', gx, gy + gh + 9, { size: 9, align: 'center', color: C.faint, maxW: 20 }); T.txt(c, '20 µm', gx + gw, gy + gh + 9, { size: 9, align: 'right', color: C.faint, maxW: 50 });
        }
        // ---- the caption and the read-outs
        const TEXT = intens ? [
          'A fast lens (f/1.4 here) collects the faint light, visible and near infrared; the night sky is rich in the near infrared that the eye cannot see.',
          'The photocathode turns a photon into an electron with probability ' + V.qe + ' %; most photons give nothing, which is why the picture is noisy.',
          'A glass plate with millions of channels 6–12 µm across: an electron striking a wall frees more, so one becomes thousands.',
          'The electrons strike a phosphor that glows green, the colour where the eye is most sensitive, and the amplified picture appears.',
          'An eyepiece magnifies the screen so that the eye sees it as a scene.'
        ] : [
          'Glass does not pass 8–14 µm; germanium does, with an index of ' + sig(O.index('germanium', 10000), 3) + ' at 10 µm.',
          'Each uncoated surface reflects ' + sig(100 * O.normalR(1, O.index('germanium', 10000)), 3) + ' %; a coating brings that down to a few per cent.',
          'Each pixel is a tiny suspended thermometer: absorbed infrared warms it by a fraction of a millikelvin and changes its resistance.',
          'Each pixel is corrected for its own offset, then the radiance is mapped to a grey or colour palette over the temperature range chosen.',
          'The picture shows radiance, not temperature: the temperature follows only if the surface\'s emissivity is known.'
        ];
        const cy = iy + ih + 24;
        T.caption(c, 10, cy, W - 20, H - cy - 6, step === 0 ? (intens ? 'An intensifier: five parts, in the order the light meets them' : 'A thermal camera: five parts, in the order the light meets them') : step + '. ' + names[step - 1], step === 0 ? names.map((nm, i) => (i + 1) + ' ' + nm.toLowerCase()).join(' · ') + '. Slide "Follow the light" to read each one.' : TEXT[step - 1]);
        if (intens) {
          const lv = [['starlight', 0.001], ['full moon', 0.25], ['twilight', 1]].reduce((a, b) => Math.abs(Math.log10(V.E / b[1])) < Math.abs(Math.log10(V.E / a[1])) ? b : a);
          ro.set('a', sig(V.E, 3) + ' lx, closest to ' + lv[0]);
          ro.set('b', sig(info.Ei, 3) + ' lx on the cathode (f/1.4, reflectance 0.2)');
          ro.set('c', sig(info.ph, 3) + ' photons, ' + sig(pe, 3) + ' photoelectrons');
          ro.set('d', 'shot noise: signal-to-noise ' + sig(Math.sqrt(Math.max(pe, 0)), 3) + ' per element');
          ro.set('e', pe < 1 ? 'fewer than one photoelectron per element: single flashes' : 'enough electrons to see a picture');
        } else {
          const Tb = V.Tb + 273.15, Lw = bandL(307) / bandL(Tb), gain = bandL(Tb + 1) / bandL(Tb) - 1, ge = O.index('germanium', 10000), R = O.normalR(1, ge);
          ro.set('a', 'person 307 K peaks at ' + sig(O.photo.wien(307) / 1000, 3) + ' µm; wall ' + sig(Tb, 4) + ' K at ' + sig(O.photo.wien(Tb) / 1000, 3) + ' µm');
          ro.set('b', 'band radiance rises ' + sig(100 * gain, 2) + ' % per kelvin at the wall');
          ro.set('c', 'the person radiates ' + sig(100 * (Lw - 1), 2) + ' % more than the wall in the band');
          ro.set('d', 'NETD ' + V.netd + ' mK is ' + sig(100 * gain * V.netd / 1000, 2) + ' % of the band radiance');
          ro.set('e', 'germanium: n = ' + sig(ge, 3) + ', ' + sig(100 * R, 3) + ' % lost per uncoated surface; 12 µm behind 25 mm sees 0.48 mrad');
        }
      }, box.stage);
      vis();
      st.onResize(() => { dirty = true; loop.once(); });
      loop.start(); dirty = true; loop.once();
    }
  });

})();
