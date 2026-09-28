/* HYPER-FEYNMAN · sims/light.js — simulations for Light and Vision (content/light.js).
 *   lux-rays         lenses and mirrors: the three easy rays, a fan of rays and a flash whose dots all reach the image together
 *   lux-kink         field lines of a charge that is kicked or shaken: the kink runs out at c; the field at a probe
 *                    (exact Liénard–Wiechert) against −q a⊥(t − r/c)/(4πε₀c²r)
 *   lux-sources      two or more sources with spacing and phase: the wave field, the polar pattern and the arrows added
 *   lux-diffraction  a slit, two slits or a grating cut into strips: each strip's arrow, added head to tail, and the pattern
 *   lux-index        a wave crossing thin sheets of electrons: the re-radiated wave lags 90° and the total slips in phase
 *   lux-sky          Rayleigh scattering: sunlight through the air, the colour of the sky and of the setting sun
 *   lux-polarizers   Jones vectors through up to three polarizers (or a quarter-wave plate): Malus and the three-polarizer surprise
 *   lux-synchrotron  a charge on a circle: wavefronts crowd forward, the apparent motion and the sharp pulses of field
 *   lux-cones        three cone sensitivities, three lights and a colour match (metamers, colour blindness)
 *   lux-eye          the eye focusing a point: accommodation with age, myopia, spectacles, pupil and blur on the retina
 *   lux-bee          the compound eye: facet size against diffraction, and the best facet √(λR)
 *   lux-edges        lateral inhibition: receptors that subtract their neighbours make edges stand out (Mach bands)
 */
(function () {
  'use strict';

  // fit a W0 × H0 drawing into the stage, centred; returns the scale and offsets (drawing units -> CSS px)
  function fit(st, W0, H0) { const s = Math.min(st.W / W0, st.H / H0); return { s, ox: (st.W - W0 * s) / 2, oy: (st.H - H0 * s) / 2 }; }
  function font(c, size, weight) { c.font = (weight ? weight + ' ' : '') + (size || 12) + 'px ' + ((typeof getComputedStyle === 'function' && getComputedStyle(document.body).fontFamily) || 'sans-serif'); }
  function text(c, s, x, y, col, align, size, weight) { font(c, size, weight); c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'middle'; c.fillText(s, x, y); }
  function line(c, x1, y1, x2, y2, col, w, dash) { c.strokeStyle = col; c.lineWidth = w || 1.5; c.setLineDash(dash || []); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.setLineDash([]); }
  function arrowTo(c, x1, y1, x2, y2, col, w) {
    const L = Math.hypot(x2 - x1, y2 - y1); if (!(L > 0.5)) return;
    const a = Math.atan2(y2 - y1, x2 - x1), hl = Math.min(9, L * 0.45);
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 2; c.setLineDash([]);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2 - 0.6 * hl * Math.cos(a), y2 - 0.6 * hl * Math.sin(a)); c.stroke();
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - hl * Math.cos(a - 0.38), y2 - hl * Math.sin(a - 0.38)); c.lineTo(x2 - hl * Math.cos(a + 0.38), y2 - hl * Math.sin(a + 0.38)); c.closePath(); c.fill();
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => Number.isFinite(v) ? v : (d || 0);

  // colour: the CIE 1931 colour-matching functions (the analytic fit of Wyman, Sloan and Shirley, 2013), XYZ to linear
  // sRGB, and cone sensitivities L, M, S from XYZ (Hunt–Pointer–Estevez) — used by lux-sky and lux-cones
  const g3 = (x, mu, s1, s2) => { const t = (x - mu) / (x < mu ? s1 : s2); return Math.exp(-0.5 * t * t); };
  const cie = l => [1.056 * g3(l, 599.8, 37.9, 31.0) + 0.362 * g3(l, 442.0, 16.0, 26.7) - 0.065 * g3(l, 501.1, 20.4, 26.2),
    0.821 * g3(l, 568.8, 46.9, 40.5) + 0.286 * g3(l, 530.9, 16.3, 31.1),
    1.217 * g3(l, 437.0, 11.8, 36.0) + 0.681 * g3(l, 459.0, 26.0, 13.8)];
  const toLin = ([X, Y, Z]) => [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.2040 * Y + 1.0570 * Z];
  const toLMS = ([X, Y, Z]) => [Math.max(0, 0.38971 * X + 0.68898 * Y - 0.07868 * Z), Math.max(0, -0.22981 * X + 1.18340 * Y + 0.04641 * Z), Math.max(0, Z)];
  const gam = v => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  // a displayable colour: out-of-gamut colours are desaturated (white added), too-bright ones scaled down
  function rgbCss(rgb, scale) {
    let r = fin(rgb[0] * scale), g = fin(rgb[1] * scale), b = fin(rgb[2] * scale);
    const m = Math.min(r, g, b); if (m < 0) { r -= m; g -= m; b -= m; }
    const M = Math.max(r, g, b); if (M > 1) { r /= M; g /= M; b /= M; }
    return 'rgb(' + [r, g, b].map(v => Math.round(255 * gam(clamp(v, 0, 1)))).join(',') + ')';
  }
  // a pure spectral colour cannot be shown on a screen: clip the negative primaries, keep the hue, full brightness
  const spectralCss = l => { const v = toLin(cie(l)).map(x => Math.max(0, x)); return rgbCss(v, 1 / Math.max(1e-9, ...v)); };

  /* ================================================================ lux-rays: lenses and mirrors */
  Hyper.sim('lux-rays', {
    title: 'Lenses and mirrors: rays, foci and images',
    blurb: `A thin lens or a curved mirror with its focal points **F** and **F′**. From the tip of the object (the arrow on the left) three easy rays are drawn: parallel to the axis (it leaves through a focal point), through the centre (straight on — for a mirror, reflected symmetrically at the vertex) and through the near focal point (it leaves parallel). Where they cross is the image: solid if it is real, dashed if it is virtual — where the rays only *seem* to come from.

**Try this**
- Drag the object (or its tip) towards the lens. Beyond $2f$ the image is smaller and inverted; between $f$ and $2f$ it is larger; inside $f$ it jumps to the object's side, upright and virtual — a magnifying glass.
- Turn on the **fan of rays**: every ray from the tip passes through the same image point. That is what a focus is.
- Press **Send a flash**: dots leave the tip together along every ray; in the glass each is delayed by the thickness it crosses (they wait at the lens). They all reach the image **at the same moment** — the curve joining the dots is a wavefront that closes onto the image point. With a virtual image the wavefront spreads as if from the dashed image.
- Drag a focal point to change $f$; try the diverging lens and the two mirrors (a mirror is a lens folded back, $f = R/2$).`,
    mount(box, kit) {
      const W0 = 720, H0 = 360, PX = 6, AP = 15;              // 6 px per cm; lens half-aperture 15 cm
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Optical element', options: [['Converging lens', 'lens+'], ['Diverging lens', 'lens-'], ['Concave mirror', 'mirror+'], ['Convex mirror', 'mirror-']], value: 'lens+' },
        { id: 'f', label: 'Focal length |f|', min: 4, max: 25, step: 0.5, value: 10, unit: 'cm' },
        { id: 'so', label: 'Object distance sₒ', min: 2, max: 55, step: 0.5, value: 30, unit: 'cm' },
        { id: 'ho', label: 'Object height', min: 1, max: 12, step: 0.5, value: 5, unit: 'cm' },
        { id: 'principal', type: 'check', label: 'The three easy rays', value: true },
        { id: 'fan', type: 'check', label: 'Fan of rays from the tip', value: false },
        { type: 'buttons', items: [{ id: 'flash', label: 'Send a flash', primary: true }] }
      ], id => { if (id === 'flash') flash = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['so', 'Object distance sₒ'], ['si', 'Image distance sᵢ'], ['m', 'Magnification m = −sᵢ/sₒ'], ['kind', 'The image'], ['chk', '1/sₒ + 1/sᵢ  and  1/f']]);
      let flash = 0, geo = fit(st, W0, H0);
      const X = x => W0 / 2 + PX * x, Y = y => H0 / 2 - PX * y;
      const toWorld = p => ({ x: ((p.x - geo.ox) / geo.s - W0 / 2) / PX, y: (H0 / 2 - (p.y - geo.oy) / geo.s) / PX });
      kit.drag(st, {
        hit(p) {
          const w = toWorld(p), f = V.f;
          if (Math.hypot(w.x + V.so, w.y - V.ho) < 3 || (Math.abs(w.x + V.so) < 2 && w.y > -1 && w.y < V.ho + 1)) return 'obj';
          if (Math.abs(w.y) < 2.5 && (Math.abs(Math.abs(w.x) - f) < 2)) return 'focus';
          return null;
        },
        move(what, p) {
          const w = toWorld(p);
          if (what === 'obj') { ctl.set('so', Math.round(clamp(-w.x, 2, 55) * 2) / 2); if (w.y > 0.8) ctl.set('ho', Math.round(clamp(w.y, 1, 12) * 2) / 2); }
          else ctl.set('f', Math.round(clamp(Math.abs(w.x), 4, 25) * 2) / 2);
        },
        hover: true
      });
      const loop = kit.loop(dt => {
        flash += dt;
        const mirror = V.kind.startsWith('mirror'), f = (V.kind.endsWith('+') ? 1 : -1) * V.f, so = V.so, ho = V.ho;
        const inv = 1 / f - 1 / so, atInf = Math.abs(inv) < 1e-4, si = atInf ? Infinity : 1 / inv, hi = atInf ? 0 : -si / so * ho;
        // a ray from the tip that meets the element at height yL: unfolded outgoing slope u' = u − yL/f; mirror rays go back to the left
        const ray = yL => { const u = (yL - ho) / so, up = u - yL / f; return { yL, up, at: s => yL + up * s }; };
        const dir = mirror ? -1 : 1;                             // outgoing x direction
        ro.set('so', so.toFixed(1) + ' cm');
        ro.set('si', atInf ? 'at infinity (rays leave parallel)' : (si > 0 ? '+' : '') + si.toFixed(1) + ' cm' + (si > 0 ? (mirror ? ' in front of the mirror' : ' behind the lens') : (mirror ? ' behind the mirror' : ' on the object side')));
        ro.set('m', atInf ? '—' : (hi / ho).toFixed(2));
        ro.set('kind', atInf ? 'no image (at infinity)' : (si > 0 ? 'real, ' : 'virtual, ') + (hi < 0 ? 'inverted, ' : 'upright, ') + (Math.abs(hi) > ho * 1.005 ? 'larger' : Math.abs(hi) < ho * 0.995 ? 'smaller' : 'same size'));
        ro.set('chk', atInf ? (1 / so).toFixed(4) + ' + 0  =  ' + (1 / f).toFixed(4) + ' cm⁻¹' : (1 / so).toFixed(4) + ' + ' + (1 / si).toFixed(4) + '  =  ' + (1 / f).toFixed(4) + ' cm⁻¹');
        geo = fit(st, W0, H0);
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(geo.ox, geo.oy); c.scale(geo.s, geo.s);
        c.beginPath(); c.rect(0, 0, W0, H0); c.clip();
        // axis
        line(c, 0, Y(0), W0, Y(0), C.faint, 1, [6, 5]);
        // the element
        if (mirror) {
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath();
          for (let y = -AP; y <= AP + 0.01; y += 0.5) { const sag = -(f > 0 ? 1 : -1) * 2.2 * (y / AP) * (y / AP); y === -AP ? c.moveTo(X(sag), Y(y)) : c.lineTo(X(sag), Y(y)); }
          c.stroke();
          c.strokeStyle = C.faint; c.lineWidth = 1; for (let y = -AP; y <= AP; y += 2.5) { const sag = -(f > 0 ? 1 : -1) * 2.2 * (y / AP) * (y / AP); line(c, X(sag) + 1, Y(y), X(sag) + 8, Y(y) + 8, C.faint, 1); }
        } else {
          const b = f > 0 ? 9 : -7, t0 = f > 0 ? 1 : 6;
          c.fillStyle = kit.hue(200, 0.22); c.strokeStyle = kit.hue(200, 0.9); c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(X(0) - t0, Y(AP)); c.quadraticCurveTo(X(0) - t0 - b, Y(0), X(0) - t0, Y(-AP)); c.lineTo(X(0) + t0, Y(-AP)); c.quadraticCurveTo(X(0) + t0 + b, Y(0), X(0) + t0, Y(AP)); c.closePath(); c.fill(); c.stroke();
        }
        // focal points (a mirror has one, in front: F; its centre of curvature C at 2f)
        const fx = mirror ? [-f] : [-f, f];
        fx.forEach((x, i) => { kit.dot(c, X(x), Y(0), 5, C.warn); text(c, mirror ? 'F' : (i ? 'F′' : 'F'), X(x), Y(0) + 14, C.warn, 'center', 12, 'bold'); });
        if (mirror) { kit.dot(c, X(-2 * f), Y(0), 3.5, C.muted); text(c, 'C', X(-2 * f), Y(0) + 14, C.muted, 'center', 11); }
        else { [-2 * f, 2 * f].forEach(x => { kit.dot(c, X(x), Y(0), 2.5, C.muted); text(c, '2f', X(x), Y(0) + 14, C.muted, 'center', 10); }); }
        const drawRay = (r, col, w, alpha) => {
          c.globalAlpha = alpha || 1;
          line(c, X(-so), Y(ho), X(0), Y(r.yL), col, w);
          const sEnd = 70; line(c, X(0), Y(r.yL), X(dir * sEnd), Y(r.at(sEnd)), col, w);
          if (!atInf && si < 0) line(c, X(0), Y(r.yL), X(-dir * si), Y(r.at(si)), col, w * 0.8, [4, 4]);
          c.globalAlpha = 1;
        };
        if (V.fan) for (let k = 0; k <= 14; k++) drawRay(ray(-AP + 2 * AP * k / 14), C.muted, 1, 0.55);
        if (V.principal) {
          const cols = [C.series[1], C.series[2], C.series[3]];
          const ys = [ho, 0, Math.abs(so - f) > 0.05 ? ho * f / (f - so) : null];
          ys.forEach((yL, i) => { if (yL != null && Math.abs(yL) < 60) drawRay(ray(yL), cols[i], 2); });
        }
        // the flash: dots leave the tip together; each waits at the element for the delay of the glass it crosses
        if (flash < 4.5) {
          const cs = 45, D0 = f > 0 ? AP * AP / (2 * f) : 0, pts = [];
          for (let k = 0; k <= 14; k++) {
            const r = ray(-AP + 2 * AP * k / 14), L1 = Math.hypot(so, r.yL - ho), del = D0 - r.yL * r.yL / (2 * f), d = cs * flash;
            let px, py;
            if (d < L1) { const q = d / L1; px = -so + so * q; py = ho + (r.yL - ho) * q; }
            else if (d < L1 + del) { px = 0; py = r.yL; }
            else { const s2 = (d - L1 - del) / Math.sqrt(1 + r.up * r.up); px = dir * s2; py = r.at(s2); }
            pts.push([px, py]);
          }
          c.strokeStyle = kit.hue(45, 0.55); c.lineWidth = 2; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
          pts.forEach(p => kit.dot(c, X(p[0]), Y(p[1]), 3.2, kit.hue(45)));
        } else if (flash > 5.5) flash = 0;
        // object and image arrows
        arrowTo(c, X(-so), Y(0), X(-so), Y(ho), C.text, 3);
        text(c, 'object', X(-so), Y(0) + 14, C.muted, 'center', 11);
        if (!atInf && Math.abs(si) < 200) {
          const xi = mirror ? -si : si;
          if (si > 0) arrowTo(c, X(xi), Y(0), X(xi), Y(hi), C.accent, 3);
          else { c.globalAlpha = 0.9; line(c, X(xi), Y(0), X(xi), Y(hi), C.accent, 2.5, [5, 4]); kit.dot(c, X(xi), Y(hi), 3.5, C.accent); c.globalAlpha = 1; }
          text(c, si > 0 ? 'real image' : 'virtual image', X(xi), Y(0) + (hi > 0 ? 14 : -14), C.accent, 'center', 11, 'bold');
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-kink: the field lines of an accelerated charge */
  Hyper.sim('lux-kink', {
    title: 'The kink: an accelerated charge radiates',
    blurb: `The electric field lines of a charge. Before anything happens they are straight spokes. **Kick** it: it speeds up for a short time Δt, coasts, then stops. The news travels outward at the speed of light (the dashed circles): outside, the lines still point at the old position; inside, at the new one; in the thin shell between they must run sideways — a **kink** that races outward. That kink is light. The graph shows the field across the line of sight at the probe (drag it), worked out exactly from the moving charge, and the prediction of the radiation formula $-q\\,a_\\perp(t - r/c)/4\\pi\\varepsilon_0 c^2 r$. Speed of light: 120 px per second of simulation time.

**Try this**
- Watch where the kink is sharpest: broadside to the motion (up and down). Along the line of motion (left and right) there is no kink at all — $\\sin\\theta = 0$.
- Move the probe further out: the kink's sideways field shrinks only as 1/r, while the ordinary Coulomb field shrinks as 1/r². Far away, the kink wins.
- A shorter push (smaller Δt) with the same final speed means a larger acceleration: a thinner, stronger kink.
- Choose **Shake**: the charge oscillates and a train of kinks becomes a wave. The probe's field traces the acceleration, delayed by r/c — the two curves lie on top of each other.
- Put the probe to the right, ahead of the motion, and raise v/c: the exact field grows stronger than the slow-motion formula. A charge moving towards you radiates more strongly your way — the first hint of the forward beaming of [[synchrotron-radiation]].`,
    mount(box, kit) {
      const W0 = 720, H0 = 400, OX = 360, OY = 200, CL = 120, DTS = 1 / 120, KEEP = 4.4, TC = 1.4, T0 = 0.6;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Motion', options: [['Kick: start, coast, stop', 'kick'], ['Shake back and forth', 'shake']], value: 'kick' },
        { id: 'beta', label: 'Top speed v/c', min: 0.02, max: 0.6, step: 0.01, value: 0.25 },
        { id: 'dt', label: 'Push time Δt (kick)', min: 0.05, max: 0.6, step: 0.01, value: 0.15, unit: 's' },
        { id: 'T', label: 'Period (shake)', min: 0.6, max: 3, step: 0.1, value: 1.4, unit: 's' },
        { id: 'n', label: 'Number of field lines', min: 8, max: 36, step: 2, value: 24 },
        { type: 'buttons', items: [{ id: 'go', label: 'Kick again / restart', primary: true }] }
      ], id => { if (id === 'mode') ctl.set('beta', V.mode === 'shake' ? 0.08 : 0.25); if (id !== 'n') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['front', 'News front c·t'], ['pr', 'Probe: r and θ'], ['e', 'E⊥ at the probe (exact)'], ['f', 'Radiation formula'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'E across the line of sight (÷ Coulomb field there)' }, legend: true }, 160);
      // the motion along x, relative to the centre, as a function of τ = t − T0
      function motion(tau) {
        if (V.mode === 'shake') {
          const w = 2 * Math.PI / V.T, A = V.beta * CL / w;
          if (tau < 0) return { x: -A, v: 0, a: 0 };
          return { x: -A * Math.cos(w * tau), v: A * w * Math.sin(w * tau), a: A * w * w * Math.cos(w * tau) };
        }
        const v = V.beta * CL, d = V.dt, a = v / d, D = v * (d + TC), x0 = -D / 2;
        if (tau < 0) return { x: x0, v: 0, a: 0 };
        if (tau < d) return { x: x0 + 0.5 * a * tau * tau, v: a * tau, a };
        if (tau < d + TC) return { x: x0 + 0.5 * a * d * d + v * (tau - d), v, a: 0 };
        if (tau < 2 * d + TC) { const u = tau - d - TC; return { x: x0 + 0.5 * a * d * d + v * TC + v * u - 0.5 * a * u * u, v: v - a * u, a: -a }; }
        return { x: x0 + D, v: 0, a: 0 };
      }
      let t = 0, hist = [], trace = [], probe = { x: OX + 40, y: OY - 172 }, geo = fit(st, W0, H0), lastPlot = 0;
      function restart() { t = 0; hist = []; trace = []; lastPlot = -1; push(); }
      function push() { const m = motion(t - T0); hist.push({ t, x: m.x, v: m.v, a: m.a }); }
      restart();
      kit.drag(st, {
        hit(p) { const x = (p.x - geo.ox) / geo.s, y = (p.y - geo.oy) / geo.s; return Math.hypot(x - probe.x, y - probe.y) < 16 ? 'probe' : null; },
        move(_, p) { const x = (p.x - geo.ox) / geo.s, y = (p.y - geo.oy) / geo.s; const r = Math.hypot(x - OX, y - OY); const k = r < 60 ? 60 / Math.max(r, 1e-6) : 1; probe = { x: clamp(OX + (x - OX) * k, 10, W0 - 10), y: clamp(OY + (y - OY) * k, 10, H0 - 10) }; trace = []; },
        hover: true
      });
      // the exact (Liénard–Wiechert) field at a point, with q/4πε₀ = 1, lengths in px and c = CL px/s
      function fieldAt(px, py) {
        let j = hist.length - 1, prev = null;
        for (; j >= 0; j--) { const h = hist[j], f = CL * (t - h.t) - Math.hypot(px - OX - h.x, py - OY); if (f >= 0) break; prev = { h, f }; }
        let s;
        if (j < 0) { const h = hist[0]; s = { x: h.x, v: 0, a: 0 }; }
        else if (!prev) s = hist[j];
        else { const h = hist[j], f1 = CL * (t - h.t) - Math.hypot(px - OX - h.x, py - OY), w = f1 / Math.max(1e-12, f1 - prev.f); s = { x: h.x + (prev.h.x - h.x) * w, v: h.v + (prev.h.v - h.v) * w, a: h.a + (prev.h.a - h.a) * w }; }
        const Rx = px - OX - s.x, Ry = py - OY, R = Math.max(1e-6, Math.hypot(Rx, Ry)), nx = Rx / R, ny = Ry / R, b = s.v / CL, bd = s.a / CL;
        const k = 1 - nx * b, k3 = k * k * k;
        const e1x = (nx - b) * (1 - b * b) / (k3 * R * R), e1y = ny * (1 - b * b) / (k3 * R * R);
        // n × ((n − β) × β̇) = (n − β)(n·β̇) − β̇ (n·(n − β)), with β and β̇ along x
        const nbd = nx * bd, nnb = 1 - nx * b;
        const e2x = ((nx - b) * nbd - bd * nnb) / (CL * k3 * R), e2y = (ny * nbd) / (CL * k3 * R);
        return { x: e1x + e2x, y: e1y + e2y, R, nx, ny, a: s.a };
      }
      const loop = kit.loop(dt => {
        // advance in fixed sub-steps, recording the charge's history
        const end = t + dt;
        while (t + DTS <= end + 1e-9) { t += DTS; push(); }
        while (hist.length > 2 && hist[1].t < t - KEEP) hist.shift();
        if (V.mode === 'kick' && t > T0 + 2 * V.dt + TC + 4.2) restart();
        const now = motion(t - T0), n = Math.round(V.n);
        // the probe: the exact field across the line of sight (to where the charge appears to be), and the slow-motion
        // radiation formula −a⊥(t − r/c)/c²r with the same retarded r and a — both as multiples of the Coulomb field there
        const r0 = Math.hypot(probe.x - OX, probe.y - OY), ux = (probe.x - OX) / r0;
        const E = fieldAt(probe.x, probe.y), tx = -E.ny, ty = E.nx, Ec = 1 / (E.R * E.R);
        const ep = (E.x * tx + E.y * ty) / Ec, fp = (-(E.a * tx) / (CL * CL * E.R)) / Ec;
        if (t - lastPlot > 1 / 30 || lastPlot < 0) { trace.push([t, fin(ep), fin(fp)]); lastPlot = t; while (trace.length && trace[0][0] < t - 8) trace.shift(); }
        const th = Math.acos(clamp(Math.abs(ux), 0, 1)) * 180 / Math.PI;
        ro.set('t', t.toFixed(2) + ' s');
        ro.set('front', V.mode === 'kick' ? (t < T0 ? 'waiting…' : Math.round(CL * (t - T0)) + ' px from where the push began') : Math.round(CL * Math.max(0, t - T0)) + ' px');
        ro.set('pr', Math.round(r0) + ' px, θ = ' + th.toFixed(0) + '° from the line of motion');
        ro.set('e', kit.fmt(ep, 3) + ' × Coulomb');
        ro.set('f', kit.fmt(fp, 3) + ' × Coulomb');
        ro.set('msg', Math.abs(fp) > 0.05 ? 'The kink is passing the probe.' : V.mode === 'kick' && t > T0 + 2 * V.dt + TC + r0 / CL ? 'Both kinks have passed: the field is static again.' : '');
        if (Math.floor(t * 10) !== Math.floor((t - dt) * 10) && trace.length > 1) {
          plot.set({ x: { label: 'time (s)', min: Math.max(0, t - 8), max: Math.max(1, t) }, series: [
            { pts: trace.map(p => [p[0], p[1]]), label: 'exact field (Liénard–Wiechert)', width: 2.4 },
            { pts: trace.map(p => [p[0], p[2]]), label: 'formula −a⊥(t − r/c)/c²r', width: 1.6, dash: [5, 4] }] });
        }
        // drawing
        geo = fit(st, W0, H0);
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(geo.ox, geo.oy); c.scale(geo.s, geo.s);
        c.beginPath(); c.rect(0, 0, W0, H0); c.clip();
        // news fronts
        if (V.mode === 'kick') {
          const marks = [[0, 'kink: start'], [V.dt + TC, 'kink: stop']];
          for (const [tm, lab] of marks) {
            const age = t - T0 - tm; if (age <= 0) continue;
            const x0 = motion(tm).x, r1 = CL * age, r2 = CL * Math.max(0, age - V.dt);
            c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 5]);
            c.beginPath(); c.arc(OX + x0, OY, r1, 0, 6.283); c.stroke(); if (r2 > 0) { c.beginPath(); c.arc(OX + x0, OY, r2, 0, 6.283); c.stroke(); } c.setLineDash([]);
            if (r1 < 330) text(c, lab, OX + x0, OY - r1 - 7, C.muted, 'center', 11);
          }
        }
        // field lines: each label θ′ leaves every past position of the charge in the direction θ′ aberrated by its velocity then,
        // travelling at c; joining the same label across emission times draws the line
        c.strokeStyle = C.accent; c.lineWidth = 1.4;
        for (let k = 0; k < n; k++) {
          const tp = 2 * Math.PI * (k + 0.5) / n, ct = Math.cos(tp), stp = Math.sin(tp);
          c.beginPath();
          let lx = 0, ly = 0;
          for (let j = hist.length - 1; j >= 0; j--) {
            const h = hist[j], b = h.v / CL, den = 1 + b * ct, cs = (ct + b) / den, sn = stp * Math.sqrt(1 - b * b) / den, r = CL * (t - h.t);
            lx = OX + h.x + r * cs; ly = OY + r * sn;
            j === hist.length - 1 ? c.moveTo(lx, ly) : c.lineTo(lx, ly);
          }
          const h0 = hist[0], b0 = h0.v / CL, d0 = 1 + b0 * ct, R = 900;
          c.lineTo(OX + h0.x + R * (ct + b0) / d0, OY + R * stp * Math.sqrt(1 - b0 * b0) / d0);
          c.stroke();
        }
        // the charge, its velocity and acceleration
        const qx = OX + now.x;
        if (Math.abs(now.v) > 0.5) arrowTo(c, qx, OY, qx + 0.6 * now.v, OY, C.ok, 2.4);
        if (Math.abs(now.a) > 1) arrowTo(c, qx, OY + 16, qx + clamp(0.12 * now.a, -90, 90), OY + 16, C.warn, 2.4);
        kit.dot(c, qx, OY, 8, C.bad); text(c, '+', qx, OY + 0.5, '#fff', 'center', 13, 'bold');
        if (Math.abs(now.a) > 1) text(c, 'a', qx + clamp(0.12 * now.a, -90, 90) + (now.a > 0 ? 8 : -8), OY + 16, C.warn, 'center', 12, 'bold');
        // the probe and its field
        const Em = Math.hypot(E.x, E.y), L = clamp(34 * Em / Ec, 0, 110);
        if (Em > 0) arrowTo(c, probe.x, probe.y, probe.x + L * E.x / Em, probe.y + L * E.y / Em, C.series[1], 2.6);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(probe.x, probe.y, 7, 0, 6.283); c.stroke();
        text(c, 'probe', probe.x + 10, probe.y - 12, C.text, 'left', 11, 'bold');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-sources: interference of N sources, beam steering */
  Hyper.sim('lux-sources', {
    title: 'Sources in step: interference and a steerable beam',
    blurb: `A row of sources (antennas, or slits lit by one lamp) numbered from the bottom; each lags the one below it by the phase α. On the left, the waves they send out, at one instant or averaged into intensity. On the right, far away: the polar curve is the intensity in every direction, and below it the arrows of the sources for the direction θ you pick, added head to tail — the square of the total is the intensity there.

**Try this**
- Two sources λ/2 apart, in step: a strong beam broadside, nothing along the line of the pair. Now make them opposite (α = 180°): the pattern turns through 90°.
- λ/4 apart with a 90° lag: all the radiation goes one way along the line, none the other — a one-way pair.
- Eight sources λ/2 apart: slide α and watch the beam swing, with no moving parts. The beam points where 2πd sin θ₀/λ = α.
- Add sources: the beam narrows as λ/(Nd), and the chain of arrows curls into a closed polygon at the first zero.
- Spacing above one wavelength: extra beams (grating lobes) appear — the arrows line up again whenever the path difference is a whole number of wavelengths.`,
    mount(box, kit) {
      const W0 = 720, H0 = 380, FX = 440, CW = 6, SX = 46, SY = 190, PCX = 585, PCY = 142, PR = 100;
      const st = kit.stage(box.stage, { aspect: 0.53, minH: 260 });
      const presets = { a: [2, 0.5, 0], b: [2, 0.5, 180], c: [2, 0.25, 90], d: [2, 1, 0], e: [8, 0.5, 90], f: [12, 1.5, 0] };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Start from', options: [['Two, λ/2 apart, in step', 'a'], ['Two, λ/2 apart, opposite', 'b'], ['Two, λ/4 apart, 90° lag', 'c'], ['Two, λ apart, in step', 'd'], ['Eight, λ/2 apart, steered to 30°', 'e'], ['Twelve, 1.5λ apart: grating lobes', 'f']], value: 'a' },
        { id: 'N', label: 'Number of sources N', min: 1, max: 12, step: 1, value: 2 },
        { id: 'd', label: 'Spacing d (wavelengths)', min: 0.1, max: 1.5, step: 0.05, value: 0.5 },
        { id: 'alpha', label: 'Phase lag α, each source to the next', min: -180, max: 180, step: 5, value: 0, unit: '°' },
        { id: 'th', label: 'Direction θ to look at', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'view', type: 'select', label: 'Show', options: [['The waves at one instant', 'w'], ['Time-averaged intensity', 'i']], value: 'w' }
      ], id => { if (id === 'preset') { const p = presets[V.preset]; ctl.set('N', p[0]); ctl.set('d', p[1]); ctl.set('alpha', p[2]); } if (id !== 'th' && id !== 'view') build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dl', 'Phase step δ between neighbours at θ'], ['I', 'Intensity at θ (× one source)'], ['beam', 'Main beam(s) at'], ['w', 'Beam width ≈ λ/(Nd)']]);
      let grid = null, nx = 0, ny = 0, maxS = 1, lam = 30, t = 0;
      const pattern = s => { const N = Math.round(V.N), dl = 2 * Math.PI * V.d * s - V.alpha * Math.PI / 180; let re = 0, im = 0; for (let j = 0; j < N; j++) { re += Math.cos(j * dl); im += Math.sin(j * dl); } return re * re + im * im; };
      const srcY = j => SY - (j - (Math.round(V.N) - 1) / 2) * V.d * lam;
      function build() {
        const N = Math.round(V.N);
        lam = clamp(300 / Math.max(1e-9, (N - 1) * V.d), 12, 34);
        nx = Math.ceil((FX - 0) / CW); ny = Math.ceil(H0 / CW);
        grid = new Float64Array(nx * ny * 2); maxS = 1e-9;
        const k = 2 * Math.PI / lam, al = V.alpha * Math.PI / 180;
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const x = (i + 0.5) * CW, y = (j + 0.5) * CW; let re = 0, im = 0;
          for (let s = 0; s < N; s++) { const r = Math.hypot(x - SX, y - srcY(s)), a = 1 / Math.sqrt(1 + r / lam), ph = -(k * r + s * al); re += a * Math.cos(ph); im += a * Math.sin(ph); }
          grid[2 * (i * ny + j)] = re; grid[2 * (i * ny + j) + 1] = im;
          if (x > SX + 2 * lam) maxS = Math.max(maxS, Math.hypot(re, im));
        }
      }
      build();
      const loop = kit.loop(dt => {
        t += dt;
        const N = Math.round(V.N), th = V.th * Math.PI / 180, al = V.alpha * Math.PI / 180, dl = 2 * Math.PI * V.d * Math.sin(th) - al;
        const Imax = N * N, Ith = pattern(Math.sin(th));
        let dd = ((dl * 180 / Math.PI) % 360 + 540) % 360 - 180;
        ro.set('dl', dd.toFixed(0) + '°');
        ro.set('I', (Ith < 1e-9 ? '0' : kit.fmt(Ith, 3)) + '  (' + (100 * Ith / Imax).toFixed(0) + ' % of the peak N² = ' + Imax + ')');
        // main beams: kd sin θ − α = 2πm
        if (N === 1) ro.set('beam', 'all directions (one source)');
        else {
          const beams = [];
          for (let m = -4; m <= 4; m++) { const s = (al + 2 * Math.PI * m) / (2 * Math.PI * V.d); if (Math.abs(s) <= 1) beams.push((Math.asin(s) * 180 / Math.PI).toFixed(0) + '°'); }
          ro.set('beam', beams.length ? beams.join(', ') : 'none: the arrows never line up');
        }
        ro.set('w', N > 2 ? (180 / Math.PI / (N * V.d)).toFixed(1) + '° (broadside)' : '—');
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // the field
        const w = 2 * Math.PI * 0.9, co = Math.cos(w * t), si = Math.sin(w * t);
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const re = grid[2 * (i * ny + j)], im = grid[2 * (i * ny + j) + 1];
          let L;
          if (V.view === 'i') { const v = clamp((re * re + im * im) / (maxS * maxS), 0, 1); L = C.dark ? 8 + 62 * v : 97 - 62 * v; c.fillStyle = 'hsl(45 90% ' + L.toFixed(0) + '%)'; }
          else { const v = clamp((re * co - im * si) / maxS, -1, 1); L = 48 + 26 * v; c.fillStyle = 'hsl(205 70% ' + L.toFixed(0) + '%)'; }
          c.fillRect(i * CW, j * CW, CW + 0.5, CW + 0.5);
        }
        // the sources, and the direction looked at
        for (let s = 0; s < N; s++) { kit.dot(c, SX, srcY(s), 5, C.warn, C.text); if (N <= 8) text(c, String(s + 1), SX - 13, srcY(s), C.text, 'center', 10, 'bold'); }
        line(c, SX, SY, SX + 380 * Math.cos(th), SY - 380 * Math.sin(th), C.text, 1.5, [6, 4]);
        text(c, 'θ = ' + V.th.toFixed(0) + '°', SX + 70 * Math.cos(th) + 8, SY - 70 * Math.sin(th) - 10, C.text, 'left', 12, 'bold');
        text(c, 'λ', 16, 16, C.text, 'left', 11); line(c, 26, 16, 26 + lam, 16, C.text, 2);
        // polar pattern (far away)
        c.fillStyle = C.bg2 || C.surface; c.fillRect(FX, 0, W0 - FX, H0);
        c.strokeStyle = C.faint; c.lineWidth = 1;
        [0.5, 1].forEach(f => { c.beginPath(); c.arc(PCX, PCY, PR * f, 0, 6.283); c.stroke(); });
        line(c, PCX - PR, PCY, PCX + PR, PCY, C.faint, 1); line(c, PCX, PCY - PR, PCX, PCY + PR, C.faint, 1);
        c.fillStyle = kit.hue(45, 0.35); c.strokeStyle = kit.hue(45); c.lineWidth = 2; c.beginPath();
        for (let k = 0; k <= 360; k++) { const ps = k * Math.PI / 180, r = PR * pattern(Math.sin(ps)) / Imax; k ? c.lineTo(PCX + r * Math.cos(ps), PCY - r * Math.sin(ps)) : c.moveTo(PCX + r * Math.cos(ps), PCY - r * Math.sin(ps)); }
        c.closePath(); c.fill(); c.stroke();
        const sc = Math.min(8, 60 / Math.max(1, (N - 1) * V.d)); for (let s = 0; s < N; s++) kit.dot(c, PCX, PCY - (s - (N - 1) / 2) * V.d * sc, 2.5, C.warn);
        arrowTo(c, PCX, PCY, PCX + (PR + 12) * Math.cos(th), PCY - (PR + 12) * Math.sin(th), C.text, 1.6);
        text(c, 'intensity far away, in every direction', PCX, 12, C.muted, 'center', 11);
        // the arrows for direction θ, head to tail
        const zs = []; for (let s = 0; s < N; s++) zs.push({ re: Math.cos(s * dl), im: Math.sin(s * dl) });
        let x = 0, y = 0; const pts = [[0, 0]]; for (const z of zs) { x += z.re; y += z.im; pts.push([x, y]); }
        let minx = 0, maxx = 0, miny = 0, maxy = 0; for (const p of pts) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }
        const L = Math.min(24, 190 / Math.max(1, maxx - minx), 80 / Math.max(1, maxy - miny)), bx = PCX - L * (minx + maxx) / 2, by = 318 + L * (miny + maxy) / 2;
        text(c, 'the arrows at θ, head to tail', PCX, 262, C.muted, 'center', 11);
        for (let s = 0; s < N; s++) arrowTo(c, bx + L * pts[s][0], by - L * pts[s][1], bx + L * pts[s + 1][0], by - L * pts[s + 1][1], C.series[1 + (s % 2)], 2);
        arrowTo(c, bx, by, bx + L * x, by - L * y, C.text, 2.8);
        text(c, '|total|² = ' + kit.fmt(x * x + y * y, 3), PCX, H0 - 10, C.text, 'center', 12, 'bold');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-diffraction: strips of an opening and their arrows */
  Hyper.sim('lux-diffraction', {
    title: 'Diffraction: an arrow from every strip',
    blurb: `Light arrives from the left, in step across the opening. Cut the opening into narrow strips: each strip sends light in the direction θ, and the extra path it must travel (drawn to the dashed wavefront) sets the angle of its arrow. On the right the arrows are added head to tail; the square of the total, compared with straight ahead, is the brightness in that direction — the graph below.

**Try this**
- One slit, θ = 0: the arrows form a straight line. Slide θ: the line bends into an arc, and at a sin θ = λ it closes into a **circle** — the first dark band. Beyond it the arc winds past a full turn: the weak side bands.
- Narrow the slit: the first dark band moves out. Widen it: the light stays in a narrower beam.
- Two slits: the arcs from each slit are joined; their totals add like the two arrows of the two-slit experiment, under the envelope of one slit.
- A grating: the chain lines up only where d sin θ = mλ. Add slits and the beams sharpen, but stay where they are.
- Press **Scan the directions** and watch the arrows and the curve together.`,
    mount(box, kit) {
      const W0 = 720, H0 = 340, WX = 150, CXR = 545, CYR = 165;
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Opening', options: [['One slit', 'slit'], ['Two slits', 'two'], ['A grating of N slits', 'grating']], value: 'slit' },
        { id: 'a', label: 'Slit width a (wavelengths)', min: 1, max: 8, step: 0.1, value: 3 },
        { id: 'd', label: 'Slit spacing d (wavelengths)', min: 2, max: 10, step: 0.1, value: 4 },
        { id: 'N', label: 'Number of slits (grating)', min: 3, max: 16, step: 1, value: 6 },
        { id: 'th', label: 'Direction θ', min: -60, max: 60, step: 0.1, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'scan', label: 'Scan the directions', primary: true }] }
      ], id => { if (id === 'scan') scan = -60; else if (id !== 'th') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ph', 'Phase across one slit, 2πa sin θ/λ'], ['pn', 'Phase from slit to slit, 2πd sin θ/λ'], ['I', 'Brightness I/I(0)'], ['z', 'First dark band of one slit'], ['m', 'Grating beams at']]);
      const plot = kit.plot(gb, { x: { label: 'direction θ (°)', min: -60, max: 60 }, y: { label: 'I / I(0)', min: 0, max: 1.05 } }, 150);
      let scan = null, tt = 0;
      const ns = () => V.mode === 'slit' ? 1 : V.mode === 'two' ? 2 : Math.round(V.N);
      function strips() {
        const n = ns(), a = Math.min(V.a, V.mode === 'slit' ? V.a : V.d * 0.95), M = clamp(Math.round(96 / n), 8, 24), ys = [];
        for (let s = 0; s < n; s++) { const yc = (s - (n - 1) / 2) * V.d; for (let k = 0; k < M; k++) ys.push({ y: yc - a / 2 + a * (k + 0.5) / M, s }); }
        return { ys, a, n, M };
      }
      const inten = (S, sn) => { let re = 0, im = 0; for (const p of S.ys) { const ph = 2 * Math.PI * p.y * sn; re += Math.cos(ph); im += Math.sin(ph); } const T = S.ys.length; return (re * re + im * im) / (T * T); };
      function curve() {
        const S = strips(), pts = [];
        for (let k = 0; k <= 1200; k++) { const th = -60 + k * 0.1; pts.push([th, inten(S, Math.sin(th * Math.PI / 180))]); }
        plot.set({ series: [{ pts, label: 'brightness', width: 2 }] });
      }
      curve();
      const loop = kit.loop(dt => {
        if (scan != null) { scan += 10 * dt; ctl.set('th', Math.round(Math.min(60, scan) * 10) / 10); if (scan >= 60) scan = null; }
        const S = strips(), sn = Math.sin(V.th * Math.PI / 180), I = inten(S, sn);
        ro.set('ph', (360 * S.a * sn).toFixed(0) + '°  (' + (S.a * sn).toFixed(2) + ' turns)');
        ro.set('pn', S.n > 1 ? (360 * V.d * sn).toFixed(0) + '°  (' + (V.d * sn).toFixed(2) + ' turns)' : '—');
        ro.set('I', I.toFixed(3));
        ro.set('z', S.a > 1 ? '±' + (Math.asin(1 / S.a) * 180 / Math.PI).toFixed(1) + '°' : 'none: slit narrower than λ');
        if (S.n > 1) { const bs = []; for (let m = 0; m <= 9; m++) if (m / V.d <= Math.sin(60 * Math.PI / 180)) bs.push((m ? '±' : '') + (Math.asin(m / V.d) * 180 / Math.PI).toFixed(1) + '°'); ro.set('m', bs.join(', ')); } else ro.set('m', '—');
        plot.set({ marks: [{ x: V.th, y: I, label: 'θ' }] });
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        const ext = (S.n - 1) * V.d + S.a, u = Math.min(34, 270 / ext), cy = H0 / 2, th = V.th * Math.PI / 180;
        // incoming plane waves
        tt += dt; const ph0 = tt;
        c.strokeStyle = kit.hue(205, 0.45); c.lineWidth = 2;
        for (let x = 20 + ((ph0 * 30) % u); x < WX - 4; x += u) { c.beginPath(); c.moveTo(x, cy - ext * u / 2 - 10); c.lineTo(x, cy + ext * u / 2 + 10); c.stroke(); }
        // the wall with its openings
        c.fillStyle = C.text;
        const open = []; for (let s = 0; s < S.n; s++) { const yc = cy + (s - (S.n - 1) / 2) * V.d * u; open.push([yc - S.a * u / 2, yc + S.a * u / 2]); }
        let y0 = 0; for (const [a0, a1] of open) { if (a0 > y0) c.fillRect(WX - 3, y0, 6, a0 - y0); y0 = a1; } if (y0 < H0) c.fillRect(WX - 3, y0, 6, H0 - y0);
        // strips: phase colour, rays in direction θ, and the extra path to the wavefront
        const dirx = Math.cos(th), diry = -Math.sin(th), ymin = Math.min(...S.ys.map(p => p.y)), ymax = Math.max(...S.ys.map(p => p.y));
        const lead = sn >= 0 ? ymin : ymax;                       // the strip with the shortest path in direction θ
        const every = Math.max(1, Math.round(S.ys.length / 24));
        S.ys.forEach((p, i) => {
          const py = cy + p.y * u, ph = 2 * Math.PI * p.y * sn, hue = ((ph * 180 / Math.PI) % 360 + 360) % 360;
          c.fillStyle = 'hsl(' + hue.toFixed(0) + ' 75% 55%)'; c.fillRect(WX - 3, py - u * S.a / S.M / 2, 6, Math.max(1, u * S.a / S.M));
          if (i % every) return;
          const extra = (p.y - lead) * sn * u;                    // extra path (px) to the dashed wavefront
          line(c, WX + 4, py, WX + 4 + (150 + extra) * dirx, py + (150 + extra) * diry, C.faint, 1);
          line(c, WX + 4, py, WX + 4 + extra * dirx, py + extra * diry, C.series[1], 2.4);
          arrowTo(c, WX - 18, py, WX - 18 + 9 * Math.cos(ph), py - 9 * Math.sin(ph), 'hsl(' + hue.toFixed(0) + ' 75% 50%)', 1.4);
        });
        // the wavefront: perpendicular to the rays, through the leading strip
        const lx = WX + 4, ly = cy + lead * u;
        line(c, lx - 400 * diry, ly + 400 * dirx, lx + 400 * diry, ly - 400 * dirx, C.muted, 1.2, [5, 4]);
        text(c, 'extra path', WX + 20, 14, C.series[1], 'left', 11, 'bold');
        // the chain of arrows
        c.fillStyle = C.bg2 || C.surface; c.fillRect(380, 0, W0 - 380, H0);
        const T = S.ys.length, L0 = 250, la = L0 / T;
        let x = 0, y = 0; const pts = [[0, 0]];
        for (const p of S.ys) { const ph = 2 * Math.PI * p.y * sn; x += Math.cos(ph); y += Math.sin(ph); pts.push([x, y]); }
        let minx = 0, maxx = 0, miny = 0, maxy = 0; for (const p of pts) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }
        const bx = CXR - la * (minx + maxx) / 2, by = CYR + la * (miny + maxy) / 2;
        c.lineWidth = 2;
        for (let i = 0; i < T; i++) { c.strokeStyle = S.n > 1 ? C.series[1 + (S.ys[i].s % 2)] : C.series[1]; c.beginPath(); c.moveTo(bx + la * pts[i][0], by - la * pts[i][1]); c.lineTo(bx + la * pts[i + 1][0], by - la * pts[i + 1][1]); c.stroke(); }
        arrowTo(c, bx, by, bx + la * x, by - la * y, C.text, 3);
        kit.dot(c, bx, by, 3, C.text);
        text(c, 'the strips\' arrows, head to tail', CXR, 14, C.muted, 'center', 11);
        text(c, '(|total| / straight ahead)² = ' + I.toFixed(3), CXR, H0 - 12, C.text, 'center', 12, 'bold');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-index: sheets of electrons and the phase slip */
  Hyper.sim('lux-index', {
    title: 'Why light seems slower in glass',
    blurb: `A light wave (the electric field, drawn up and down) travels from left to right at the speed c and passes through thin sheets of material. The electrons in each sheet are bound like masses on springs with a natural frequency ω₀; the wave shakes them (the dots — being negative, they move against the field), and each sheet radiates a small wave of its own. **Top:** the total wave (solid) against the wave that would have crossed a vacuum (dashed). **Middle:** the sheets' own wave alone, magnified — right after the first sheet it is a quarter-cycle behind the driving wave. **Bottom left:** the arrows — the original wave, plus a small arrow from each sheet at right angles to the running total, turning it back a little each time.

**Try this**
- One sheet: compare the middle trace with the dashed wave — the sheet's wave peaks a quarter-cycle later. Added to the original, it delays the total a little.
- Add sheets: the total falls steadily further behind the vacuum wave. Its crests move as if the light were slower — yet every piece of it travels at c.
- Raise the frequency towards ω₀: the delay per sheet grows (dispersion — blue is slowed more than red). At resonance the wave is absorbed.
- Go above resonance (ω > ω₀): the electrons move with the field instead of against it, the sheets' wave is a quarter-cycle *ahead*, and the total runs ahead of the vacuum wave — an index below one, as for X-rays.`,
    mount(box, kit) {
      const W0 = 720, H0 = 380, X0 = 16, X1 = 704, LAM = 96, SX = 250, GAP = 30, YA = 78, YB = 205;
      const st = kit.stage(box.stage, { aspect: 0.53, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Number of sheets', min: 0, max: 12, step: 1, value: 1 },
        { id: 's', label: 'Phase lag per sheet at ω = ω₀/2', min: 2, max: 20, step: 1, value: 8, unit: '°' },
        { id: 'u', label: 'Frequency of the light ω/ω₀', min: 0.05, max: 2.5, step: 0.01, value: 0.5 },
        { id: 'g', label: 'Damping of the electrons γ/ω₀', min: 0.02, max: 0.5, step: 0.01, value: 0.08 },
        { id: 'run', type: 'check', label: 'Animate', value: true }
      ], id => { if (id !== 'run' && id !== 'n') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lag', 'Phase change per sheet'], ['tot', 'Total phase change after the sheets'], ['amp', 'Intensity getting through'], ['nn', 'As if the index were']]);
      const plot = kit.plot(gb, { x: { label: 'frequency of the light ω/ω₀', min: 0, max: 2.5 }, y: { label: 'per sheet' }, legend: true }, 150);
      // the complex response of a sheet: its wave is g = −i·k·u·R(u) times the wave arriving, R = 1/(1 − u² + iγu); the
      // factor across a sheet is e^g (≈ 1 + g for a thin sheet), k set so the lag at u = ½ is the chosen value
      const resp = u => { const a = 1 - u * u, b = V.g * u, d = a * a + b * b; return { re: a / d, im: -b / d }; };
      const gOf = u => { const R = resp(u), R5 = resp(0.5), kk = (V.s * Math.PI / 180) / (0.5 * Math.hypot(R5.re, R5.im)); return { re: kk * u * R.im, im: -kk * u * R.re }; };   // −i·k·u·R
      const fac = g => { const m = Math.exp(g.re); return { re: m * Math.cos(g.im), im: m * Math.sin(g.im) }; };
      const cm = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
      function curve() {
        const lag = [], abs = [];
        for (let k = 1; k <= 250; k++) { const u = k / 100, g = gOf(u), F = fac(g); lag.push([u, -Math.atan2(F.im, F.re) * 180 / Math.PI]); abs.push([u, 100 * (1 - (F.re * F.re + F.im * F.im))]); }
        plot.set({ series: [{ pts: lag, label: 'phase delay (°)' }, { pts: abs, label: 'absorbed (%)', dash: [5, 4] }], hlines: [{ y: 0 }] });
      }
      curve();
      let t = 0;
      const loop = kit.loop(dt => {
        if (V.run) t += dt;
        const n = Math.round(V.n), u = V.u, g = gOf(u), F = fac(g), R = resp(u), w = 2 * Math.PI * 0.5, k = 2 * Math.PI / LAM;
        // amplitude before each sheet, and after the last
        const A = [{ re: 1, im: 0 }]; for (let j = 0; j < n; j++) A.push(cm(A[j], F));
        const Aend = A[n], lag = -Math.atan2(F.im, F.re) * 180 / Math.PI, tot = -Math.atan2(Aend.im, Aend.re) * 180 / Math.PI;
        const totUnwrapped = n * lag;
        ro.set('lag', (lag >= 0 ? 'delayed ' : 'advanced ') + Math.abs(lag).toFixed(1) + '°');
        ro.set('tot', n ? (totUnwrapped >= 0 ? 'delayed ' : 'advanced ') + Math.abs(totUnwrapped).toFixed(1) + '°' : '— (no sheets)');
        ro.set('amp', (100 * (Aend.re * Aend.re + Aend.im * Aend.im)).toFixed(1) + ' %');
        ro.set('nn', n ? 'n = 1 ' + (totUnwrapped >= 0 ? '+ ' : '− ') + kit.fmt(Math.abs(totUnwrapped / 360 * LAM / (n * GAP)), 3) + ' (for these sheets ' + GAP + ' px apart)' : '—');
        plot.set({ marks: [{ x: u, y: lag, label: 'now' }] });
        const Aat = x => { let j = 0; while (j < n && x > SX + j * GAP) j++; return A[j]; };
        const field = (x, Ax) => { const ph = w * t - k * (x - X0); return Ax.re * Math.cos(ph) - Ax.im * Math.sin(ph); };
        const c = st.begin(), C = kit.colors(), geo = fit(st, W0, H0);
        c.save(); c.translate(geo.ox, geo.oy); c.scale(geo.s, geo.s);
        // sheets
        for (let j = 0; j < n; j++) { const x = SX + j * GAP; c.fillStyle = kit.hue(200, 0.16); c.fillRect(x - 3, 18, 6, YB + 50); line(c, x, 18, x, YB + 68, kit.hue(200, 0.6), 1); }
        text(c, 'total wave (solid) and the wave in vacuum (dashed)', X0, 12, C.muted, 'left', 11);
        line(c, X0, YA, X1, YA, C.faint, 1);
        // the vacuum wave and the total
        c.lineWidth = 1.6; c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.beginPath();
        for (let x = X0; x <= X1; x += 2) { const y = YA - 50 * field(x, { re: 1, im: 0 }); x === X0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
        c.lineWidth = 2.6; c.strokeStyle = C.accent; c.beginPath();
        for (let x = X0; x <= X1; x += 2) { const y = YA - 50 * field(x, Aat(x)); x === X0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
        // electrons on each sheet, driven by the wave arriving there; negative, so displaced against the field below resonance
        const Rm = Math.hypot(R.re, R.im);
        for (let j = 0; j < n; j++) {
          const x = SX + j * GAP, Aj = A[j], drv = cm(Aj, R), ph = w * t - k * (x - X0), disp = (drv.re * Math.cos(ph) - drv.im * Math.sin(ph)) / Math.max(1e-9, Rm);
          for (const dy of [-26, 0, 26]) kit.dot(c, x, YA + dy + 12 * disp, 3.2, C.warn);
        }
        // the sheets' own wave: total − vacuum, magnified
        let big = 1e-6; for (let j = 1; j <= n; j++) big = Math.max(big, Math.hypot(A[j].re - 1, A[j].im));
        const mag = n ? 0.9 / big : 1;
        text(c, 'the wave made by the sheets alone' + (n ? ', magnified ×' + kit.fmt(mag, 2) : '') + ' (dashed: the driving wave, for timing)', X0, YB - 58, C.muted, 'left', 11);
        line(c, X0, YB, X1, YB, C.faint, 1);
        c.lineWidth = 1.2; c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath();
        for (let x = X0; x <= X1; x += 2) { const y = YB - 40 * field(x, { re: 1, im: 0 }); x === X0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
        c.lineWidth = 2.4; c.strokeStyle = C.series[1]; c.beginPath();
        for (let x = X0; x <= X1; x += 2) { const Ax = Aat(x), y = YB - 40 * mag * field(x, { re: Ax.re - 1, im: Ax.im }); x === X0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
        // the arrows at the exit: the original, then each sheet's small arrow
        const bx = 60, by = 330, L = 150;
        text(c, 'arrows at the exit: original + one small arrow per sheet', bx - 40, 272, C.muted, 'left', 11);
        arrowTo(c, bx, by, bx + L, by, C.muted, 2);
        let px = bx + L, py = by;
        for (let j = 0; j < n; j++) { const d = { re: A[j + 1].re - A[j].re, im: A[j + 1].im - A[j].im }, nx = px + L * d.re, ny = py - L * d.im; arrowTo(c, px, py, nx, ny, C.series[1], 2); px = nx; py = ny; }
        if (n) arrowTo(c, bx, by, bx + L * Aend.re, by - L * Aend.im, C.accent, 3);
        text(c, 'vacuum', bx + L / 2, by + 13, C.muted, 'center', 10);
        if (n) text(c, 'total: ' + (tot >= 0 ? tot.toFixed(1) + '° behind' : (-tot).toFixed(1) + '° ahead'), bx + L + 20, by - 22, C.accent, 'left', 12, 'bold');
        text(c, u < 0.97 ? 'below resonance: n > 1' : u > 1.03 ? 'above resonance: n < 1' : 'at resonance: absorbed', 470, 330, u < 0.97 ? C.ok : u > 1.03 ? C.warn : C.bad, 'left', 13, 'bold');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-sky: Rayleigh scattering, blue sky and red sunset */
  Hyper.sim('lux-sky', {
    title: 'The blue sky and the red sunset',
    blurb: `Sunlight (a 5778 K spectrum) enters the air. Molecules scatter each wavelength in proportion to 1/λ⁴ (the exponent is yours to change). The picture shows the sky from the horizon up to overhead, and the sun's disc; the colours are computed from the spectra of the scattered and the transmitted light, as the eye would see them after adapting to daylight. On the right: the path of the sunlight through the air (exaggerated). Below: the spectra.

**Try this**
- Press **Watch a sunset**: as the sun sinks its light crosses up to 38 times more air, the blue is scattered out of the direct beam, and the disc turns yellow, orange and red.
- Compare the spectra: the scattered skylight (blue curve) leans to short wavelengths; the transmitted sunlight leans to long ones. They are two halves of the same light.
- Turn the exponent down to 0 — scatterers much larger than the wavelength, like cloud droplets: the sky turns white and the sunset loses its colour.
- Raise the haze: more scattering everywhere — a paler sky by day and a deeper, dimmer red sun at dusk.`,
    mount(box, kit) {
      const W0 = 720, H0 = 330, SKYW = 450, HOR = 290, RE = 6371, HS = 8;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'el', label: 'Height of the sun above the horizon', min: 0.5, max: 90, step: 0.5, value: 40, unit: '°' },
        { id: 'p', label: 'Scattering ∝ 1/λ^p, exponent p', min: 0, max: 4, step: 0.25, value: 4 },
        { id: 'tau', label: 'Vertical optical depth at 550 nm (haze)', min: 0.05, max: 0.4, step: 0.005, value: 0.097 },
        { type: 'buttons', items: [{ id: 'set', label: 'Watch a sunset', primary: true }] }
      ], id => { if (id === 'set') sunset = 40; else if (id !== 'el') ready = false; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Air mass (path ÷ vertical path)'], ['T', 'Direct sunlight through: blue / green / red'], ['r', 'Blue (450) scattered more than red (700)'], ['b', 'Sky brightness overhead (noon = 100)']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 380, max: 720 }, y: { label: 'relative', min: 0, max: 1.05 }, legend: true }, 150);
      const LS = []; for (let l = 380; l <= 720; l += 5) LS.push(l);
      const CMF = LS.map(cie), SUN = LS.map(l => kit.qm.planck(l * 1e-9, 5778)), SMAX = Math.max(...SUN);
      const lin = spec => { let X = 0, Y = 0, Z = 0; spec.forEach((v, i) => { X += v * CMF[i][0]; Y += v * CMF[i][1]; Z += v * CMF[i][2]; }); return { rgb: toLin([X, Y, Z]), Y }; };
      const WB = lin(SUN).rgb;                                   // white balance: the sun above the air looks white
      const bal = rgb => rgb.map((v, i) => v / WB[i]);
      const airMass = e => 1 / (Math.sin(e * Math.PI / 180) + 0.50572 * Math.pow(e + 6.07995, -1.6364));   // Kasten and Young
      const tauL = l => V.tau * Math.pow(550 / l, V.p);
      // single scattering along a view ray (curved Earth, air density e^(−h/8 km)); sunlight reaching height h is dimmed by
      // the air above it along the sun's slant path
      function skySpec(viewEl, sunEl) {
        const Ms = airMass(sunEl), se = Math.sin(viewEl * Math.PI / 180), out = new Array(LS.length).fill(0), NS = 36, smax = 400;
        let prev = 0, tv = 0;
        for (let i = 1; i <= NS; i++) {
          const s = smax * (i / NS) * (i / NS), ds = s - prev, h = Math.sqrt(RE * RE + s * s + 2 * RE * s * se) - RE, rho = Math.exp(-Math.max(0, h) / HS);
          tv += rho * ds / HS; prev = s;
          for (let j = 0; j < LS.length; j++) { const tl = tauL(LS[j]); out[j] += SUN[j] * tl * rho * ds / HS * Math.exp(-tl * (tv + rho * Ms)); }
          if (h > 60) break;
        }
        return out;
      }
      let ready = false, bands = [], noon = 1, sunset = null, lastEl = -1;
      function compute() {
        bands = [];
        for (let e = 0; e <= 90; e += 3) { const sp = skySpec(Math.max(0.3, e), V.el), L = lin(sp); bands.push({ e, rgb: bal(L.rgb), Y: L.Y, sp }); }
        if (!ready) { noon = lin(skySpec(90, 60)).Y || 1; }
        ready = true; lastEl = V.el;
        const Ms = airMass(V.el), trans = SUN.map((v, j) => v * Math.exp(-tauL(LS[j]) * Ms));
        const top = bands[bands.length - 1].sp, tm = Math.max(...top) || 1;
        plot.set({ series: [
          { pts: LS.map((l, j) => [l, SUN[j] / SMAX]), label: 'sunlight above the air', color: kit.hue(45), width: 2 },
          { pts: LS.map((l, j) => [l, trans[j] / SMAX]), label: 'direct sunlight at the ground', color: kit.hue(20), width: 2.2 },
          { pts: LS.map((l, j) => [l, top[j] / tm]), label: 'scattered light from overhead (shape)', color: kit.hue(215), width: 2.2 }] });
      }
      const loop = kit.loop(dt => {
        if (sunset != null) { sunset -= 4 * dt; ctl.set('el', Math.max(0.5, Math.round(sunset * 2) / 2)); if (sunset <= 0.5) sunset = null; }
        if (!ready || V.el !== lastEl) compute();
        const Ms = airMass(V.el), T = [450, 550, 700].map(l => Math.exp(-tauL(l) * Ms));
        ro.set('M', Ms.toFixed(2));
        ro.set('T', T.map(v => (100 * v).toFixed(0) + ' %').join(' / '));
        ro.set('r', (Math.pow(700 / 450, V.p)).toFixed(2) + ' ×');
        ro.set('b', (100 * bands[bands.length - 1].Y / noon).toFixed(0));
        const c = st.begin(), C = kit.colors(), geo = fit(st, W0, H0);
        c.save(); c.translate(geo.ox, geo.oy); c.scale(geo.s, geo.s);
        // the sky, band by band (normalised to its brightest band, so the colours show at any hour)
        const maxY = Math.max(...bands.map(b => Math.max(...b.rgb))) || 1;
        for (let i = 0; i < bands.length; i++) {
          const b = bands[i], y0 = HOR - HOR * Math.min(90, b.e + 3) / 90, y1 = HOR - HOR * b.e / 90;
          c.fillStyle = rgbCss(b.rgb, 1 / maxY); c.fillRect(0, y0, SKYW, y1 - y0 + 1);
        }
        // the sun's disc, coloured by the light that gets through
        const tr = lin(SUN.map((v, j) => v * Math.exp(-tauL(LS[j]) * Ms))).rgb, trb = bal(tr), sx = 300, sy = HOR - HOR * V.el / 90;
        const sunCol = rgbCss(trb, 1 / Math.max(1e-12, ...trb));
        c.fillStyle = sunCol; c.globalAlpha = 0.25; c.beginPath(); c.arc(sx, sy, 26, 0, 6.283); c.fill(); c.globalAlpha = 1;
        c.beginPath(); c.arc(sx, sy, 14, 0, 6.283); c.fill();
        // ground and the observer
        c.fillStyle = C.dark ? '#1d2418' : '#4d5a3a'; c.fillRect(0, HOR, SKYW, H0 - HOR);
        kit.dot(c, 90, HOR - 6, 4, C.text); line(c, 90, HOR - 2, 90, HOR + 12, C.text, 2);
        text(c, 'overhead', 8, 12, '#fff', 'left', 11, 'bold'); text(c, 'horizon', 8, HOR - 10, '#fff', 'left', 11, 'bold');
        // right panel: swatches and the path through the air
        c.fillStyle = C.bg2 || C.surface; c.fillRect(SKYW, 0, W0 - SKYW, H0);
        const sw = [['sunlight above the air', rgbCss([1, 1, 1], 1)], ['the sun\'s disc, from the ground', sunCol],
          ['the sky overhead', rgbCss(bands[bands.length - 1].rgb, 1 / Math.max(1e-12, ...bands[bands.length - 1].rgb))], ['the sky near the horizon', rgbCss(bands[1].rgb, 1 / Math.max(1e-12, ...bands[1].rgb))]];
        sw.forEach(([lab, col], i) => { const y = 14 + i * 40; c.fillStyle = col; c.fillRect(SKYW + 14, y, 44, 30); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(SKYW + 14, y, 44, 30); text(c, lab, SKYW + 66, y + 15, C.text, 'left', 11); });
        // the Earth, an exaggerated atmosphere, and the sun's slant path to the observer
        const ex = SKYW + 135, ey = 470, Rr = 200, Ra = 232, ob = [ex, ey - Rr];
        c.save(); c.beginPath(); c.rect(SKYW, 0, W0 - SKYW, H0); c.clip();
        c.fillStyle = kit.hue(205, 0.14); c.beginPath(); c.arc(ex, ey, Ra, Math.PI * 1.2, Math.PI * 1.8); c.arc(ex, ey, Rr, Math.PI * 1.8, Math.PI * 1.2, true); c.closePath(); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(ex, ey, Rr, Math.PI * 1.2, Math.PI * 1.8); c.stroke();
        const ang = V.el * Math.PI / 180, dx = -Math.cos(ang), dy = -Math.sin(ang);
        // distance along the ray from the observer to the top of the (drawn) atmosphere
        const ox = ob[0] - ex, oy = ob[1] - ey, bq = ox * dx + oy * dy, cq = ox * ox + oy * oy - Ra * Ra, sT = -bq + Math.sqrt(Math.max(0, bq * bq - cq));
        line(c, ob[0], ob[1], ob[0] + dx * sT, ob[1] + dy * sT, sunCol, 3.5);
        line(c, ob[0] + dx * sT, ob[1] + dy * sT, ob[0] + dx * (sT + 40), ob[1] + dy * (sT + 40), kit.hue(45), 2, [4, 3]);
        kit.dot(c, ob[0], ob[1], 3.5, C.text);
        c.restore();
        text(c, 'path through the air: ' + Ms.toFixed(1) + ' × the vertical', SKYW + 14, 190, C.text, 'left', 11, 'bold');
        text(c, '(atmosphere drawn much too thick)', SKYW + 14, 206, C.muted, 'left', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-polarizers: Jones vectors through polarizers and a wave plate */
  Hyper.sim('lux-polarizers', {
    title: 'Polarizers: Malus\'s law and the third polarizer',
    blurb: `A beam travels from left to right; the arrows show its electric field at points along the beam, in the plane across it (drawn in perspective: up is up, the slanted direction points into the page). Polarizers pass only the component of the field along their axis (the lines across each disc); angles are measured from the vertical. The bars above give the intensity after each element, the patch on the right the light reaching the screen, and the graph how it depends on the angle of the element you are turning.

**Try this**
- Unpolarized light: the field arrows point every which way. After the first polarizer they all lie along its axis, and exactly half the intensity is left, whatever the angle.
- Turn the last polarizer: the screen follows Malus's law, $I = I_1\\cos^2(\\theta_3 - \\theta_1)$. At 90° — crossed — it goes dark.
- Now press **Add a polarizer at 45°**: light reappears, 1/8 of the original. Turn the middle one: the most gets through at 45°, nothing at 0° or 90°.
- Choose the **quarter-wave plate** as the middle element at 45° to the first polarizer: the tip of the field now goes round in a circle — circular polarization — and the last polarizer passes half of it at any angle.`,
    mount(box, kit) {
      const W0 = 720, H0 = 330, AX = 190, XS = 24, XSCR = 676, PX = [190, 360, 530], A = 52, DXP = -0.42, DYP = 0.34;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Light source', options: [['Unpolarized (a lamp)', 'u'], ['Polarized vertically (a laser)', 'v']], value: 'u' },
        { id: 't1', label: 'First polarizer, axis', min: 0, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'mid', type: 'select', label: 'Middle element', options: [['None', 'none'], ['Polarizer', 'pol'], ['Quarter-wave plate', 'qwp']], value: 'none' },
        { id: 't2', label: 'Middle element, axis', min: 0, max: 180, step: 1, value: 45, unit: '°' },
        { id: 't3', label: 'Last polarizer, axis', min: 0, max: 180, step: 1, value: 60, unit: '°' },
        { id: 'run', type: 'check', label: 'Animate the wave', value: true },
        { type: 'buttons', items: [{ id: 'cross', label: 'Cross the outer two' }, { id: 'three', label: 'Add a polarizer at 45°', primary: true }] }
      ], id => { if (id === 'cross') { ctl.set('t1', 0); ctl.set('t3', 90); } if (id === 'three') { ctl.set('mid', 'pol'); ctl.set('t2', 45); ctl.set('t1', 0); ctl.set('t3', 90); } curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['i1', 'After the first polarizer'], ['i2', 'After the middle element'], ['i3', 'At the screen'], ['state', 'Light arriving at the last polarizer']]);
      const plot = kit.plot(gb, { x: { label: 'angle of the element being turned (°)', min: 0, max: 180 }, y: { label: 'intensity at the screen (÷ source)', min: 0 } }, 140);
      // Jones vectors [h, v] of complex numbers; angles from the vertical towards the horizontal
      const cx = (re, im) => ({ re, im: im || 0 });
      const pol = th => J => { const a = [Math.sin(th), Math.cos(th)], s = cx(a[0] * J[0].re + a[1] * J[1].re, a[0] * J[0].im + a[1] * J[1].im); return [cx(a[0] * s.re, a[0] * s.im), cx(a[1] * s.re, a[1] * s.im)]; };
      const qwp = th => J => {
        const a = [Math.sin(th), Math.cos(th)], b = [Math.cos(th), -Math.sin(th)];
        const sa = cx(a[0] * J[0].re + a[1] * J[1].re, a[0] * J[0].im + a[1] * J[1].im), sb = cx(b[0] * J[0].re + b[1] * J[1].re, b[0] * J[0].im + b[1] * J[1].im), sbs = cx(sb.im, -sb.re);   // slow axis: × (−i)
        return [cx(a[0] * sa.re + b[0] * sbs.re, a[0] * sa.im + b[0] * sbs.im), cx(a[1] * sa.re + b[1] * sbs.re, a[1] * sa.im + b[1] * sbs.im)];
      };
      const d2r = Math.PI / 180, I = J => J[0].re * J[0].re + J[0].im * J[0].im + J[1].re * J[1].re + J[1].im * J[1].im;
      const chain = (t1, t2, t3) => { const els = [{ x: PX[0], f: pol(t1 * d2r) }]; if (V.mid !== 'none') els.push({ x: PX[1], f: (V.mid === 'pol' ? pol : qwp)(t2 * d2r) }); els.push({ x: PX[2], f: pol(t3 * d2r) }); return els; };
      // intensities after each element: unpolarized = the average over two perpendicular inputs
      function through(els) {
        const ins = V.src === 'u' ? [[cx(1), cx(0)], [cx(0), cx(1)]] : [[cx(0), cx(1)]];
        const out = els.map(() => 0);
        for (const J0 of ins) { let J = J0; els.forEach((e, k) => { J = e.f(J); out[k] += I(J) / ins.length; }); }
        return out;
      }
      function curve() {
        const pts = [];
        for (let a = 0; a <= 180; a += 1) { const els = V.mid !== 'none' ? chain(V.t1, a, V.t3) : chain(V.t1, V.t2, a); const o = through(els); pts.push([a, o[o.length - 1]]); }
        plot.set({ series: [{ pts, label: V.mid !== 'none' ? 'turning the middle element' : 'turning the last polarizer' }] });
      }
      curve();
      const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
      let t = 0;
      const loop = kit.loop(dt => {
        if (V.run) t += dt;
        const els = chain(V.t1, V.t2, V.t3), out = through(els), last = out[out.length - 1];
        const pc = v => (100 * v).toFixed(1) + ' %';
        ro.set('i1', pc(out[0]) + (V.src === 'u' ? ' (half of unpolarized light)' : ' = cos²(' + V.t1 + '°)'));
        ro.set('i2', V.mid === 'none' ? '—' : pc(out[1]));
        ro.set('i3', pc(last) + (V.mid === 'none' ? '  = ' + pc(out[0]) + ' × cos²(' + (V.t3 - V.t1) + '°)' : ''));
        // the state reaching the screen, from a fixed input along the first polarizer
        let Jp = [cx(Math.sin(V.t1 * d2r)), cx(Math.cos(V.t1 * d2r))]; for (let k = 1; k < els.length - 1; k++) Jp = els[k].f(Jp);
        const S0 = I(Jp), S3 = 2 * (Jp[0].re * Jp[1].im - Jp[0].im * Jp[1].re);
        ro.set('state', S0 < 1e-6 ? 'none' : Math.abs(S3) / S0 > 0.97 ? 'circular' : Math.abs(S3) / S0 < 0.03 ? 'linear, at ' + (((0.5 * Math.atan2(2 * (Jp[0].re * Jp[1].re + Jp[0].im * Jp[1].im), (Jp[1].re * Jp[1].re + Jp[1].im * Jp[1].im) - (Jp[0].re * Jp[0].re + Jp[0].im * Jp[0].im))) * 180 / Math.PI + 180) % 180).toFixed(0) + '°' : 'elliptical');
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), w = 2 * Math.PI * 0.6, k = 2 * Math.PI / 70;
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        const P = (x, h, v) => [x + A * DXP * h, AX - A * v + A * DYP * h];
        // the beam axis
        line(c, XS, AX, XSCR, AX, C.faint, 1, [4, 4]);
        // the elements: discs with their axes
        els.forEach((e, idx) => {
          const isQ = V.mid === 'qwp' && e.x === PX[1], th = (idx === 0 ? V.t1 : e.x === PX[1] ? V.t2 : V.t3) * d2r;
          c.fillStyle = isQ ? kit.hue(160, 0.16) : kit.hue(45, 0.14); c.strokeStyle = isQ ? kit.hue(160) : kit.hue(45); c.lineWidth = 1.6;
          c.beginPath(); for (let q = 0; q <= 64; q++) { const ph = q / 64 * 2 * Math.PI, p = P(e.x, 1.25 * Math.cos(ph), 1.25 * Math.sin(ph)); q ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.closePath(); c.fill(); c.stroke();
          const ax = [Math.sin(th), Math.cos(th)], pr = [Math.cos(th), -Math.sin(th)];
          if (!isQ) for (let q = -3; q <= 3; q++) { const o = q * 0.3, L = Math.sqrt(Math.max(0, 1.5 - o * o)), p1 = P(e.x, o * pr[0] - L * ax[0], o * pr[1] - L * ax[1]), p2 = P(e.x, o * pr[0] + L * ax[0], o * pr[1] + L * ax[1]); line(c, p1[0], p1[1], p2[0], p2[1], kit.hue(45, 0.55), 1); }
          const a1 = P(e.x, -1.25 * ax[0], -1.25 * ax[1]), a2 = P(e.x, 1.25 * ax[0], 1.25 * ax[1]);
          line(c, a1[0], a1[1], a2[0], a2[1], isQ ? kit.hue(160) : kit.hue(45), 3);
          text(c, isQ ? 'λ/4 plate ' + Math.round(th / d2r) + '°' : 'polarizer ' + Math.round(th / d2r) + '°', e.x, AX + 96, C.text, 'center', 11, 'bold');
          // intensity bar
          const v = out[idx], bh = 70 * v;
          c.fillStyle = C.bg2 || C.surface; c.fillRect(e.x + 34, 20, 12, 70); c.fillStyle = C.accent; c.fillRect(e.x + 34, 90 - bh, 12, bh);
          text(c, pc(v), e.x + 52, 84, C.text, 'left', 11);
        });
        text(c, 'source', XS + 4, AX + 96, C.muted, 'left', 11);
        // the field along the beam
        const seg = x => { let J; if (V.src === 'u') { const psi = Math.PI * hash(Math.floor((x - 90 * t) / 46)); J = [cx(Math.sin(psi)), cx(Math.cos(psi))]; } else J = [cx(0), cx(1)]; for (const e of els) if (x > e.x) J = e.f(J); return J; };
        let prev = null;
        for (let x = XS + 6; x < XSCR - 6; x += 7) {
          if (els.some(e => Math.abs(x - e.x) < 5)) { prev = null; continue; }
          const J = seg(x), ph = w * t - k * x, h = J[0].re * Math.cos(ph) - J[0].im * Math.sin(ph), v = J[1].re * Math.cos(ph) - J[1].im * Math.sin(ph);
          const p = P(x, h, v);
          if (Math.hypot(h, v) > 0.03) arrowTo(c, x, AX, p[0], p[1], C.series[1], 1.4);
          if (prev) line(c, prev[0], prev[1], p[0], p[1], C.series[1], 1);
          prev = p;
        }
        // the screen
        c.fillStyle = kit.hue(45, clamp(0.05 + 1.9 * last, 0, 1)); c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.rect(XSCR, AX - 60, 20, 120); c.fill(); c.stroke();
        text(c, 'screen', XSCR + 10, AX + 96, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-synchrotron: a charge circling near c */
  Hyper.sim('lux-synchrotron', {
    title: 'A charge circling near the speed of light',
    blurb: `A charge goes round a circle, always once every 4 seconds; the speed of light in the picture is set by your choice of v/c. It emits wavefronts (circles, each centred where the charge was when it sent it). An observer far away to the right records the field that arrives — the strip chart. Below, the curves Feynman used: the **apparent** sideways position of the charge against the time its light arrives, and the field, which follows the second derivative of that curve.

**Try this**
- At low speed the wavefronts are nearly concentric, the apparent motion is a sine curve, and the observer sees a gentle wave: ordinary dipole radiation.
- Raise v/c: the wavefronts crowd together ahead of the charge, and they bunch most when it moves straight at the observer (the bottom of the circle).
- Near v/c = 0.95 the apparent motion grows sharp cusps and the field becomes a train of spikes, one per turn — synchrotron flashes. The readouts show how the flash scales: squeezed by 1/(1 − β) in time, peaked by 1/(1 − β)².
- Watch the beam cone (angle 1/γ): the flash reaches the observer only while the cone sweeps across.`,
    mount(box, kit) {
      const W0 = 720, H0 = 330, CX = 170, CY = 165, R = 58, TORB = 4, EMIT = 0.09, OBX = 450, RX = 480;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'beta', label: 'Speed of the charge v/c', min: 0.1, max: 0.98, step: 0.01, value: 0.5 },
        { id: 'fronts', type: 'check', label: 'Show the wavefronts', value: true },
        { id: 'cone', type: 'check', label: 'Show the beam cone (angle 1/γ)', value: true }
      ], id => { if (id === 'beta') { fronts = []; hist = []; trace = []; curve(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'Lorentz factor γ'], ['ang', 'Beam angle 1/γ'], ['sq', 'Motion towards you seen faster by 1/(1 − β)'], ['pk', 'Peak field ÷ slow-motion value, 1/(1 − β)²']]);
      const plot = kit.plot(gb, { x: { label: 'arrival time at the observer (orbits)', min: 0, max: 2 }, y: { label: 'relative', min: -1.1, max: 1.1 }, legend: true }, 160);
      const W = 2 * Math.PI / TORB, v = R * W;
      const cl = () => v / V.beta;                                  // the speed of light in the picture, px/s
      // the field at a far observer: −d²(apparent height)/dτ², normalised to its peak at the cusp
      const fieldN = (u, b) => (Math.sin(u) + b) * (1 - b) * (1 - b) / Math.pow(1 + b * Math.sin(u), 3);
      function curve() {
        const b = V.beta, h = [], f = [];
        for (let i = 0; i <= 4000; i++) { const u = 4 * Math.PI * i / 4000, tau = (u - b * Math.cos(u)) / (2 * Math.PI); h.push([tau, Math.sin(u)]); f.push([tau, fieldN(u, b)]); }
        plot.set({ series: [{ pts: h, label: 'apparent height ÷ R', width: 2 }, { pts: f, label: 'field at the observer ÷ its peak', width: 2 }] });
      }
      curve();
      let t = 0, u = -Math.PI / 2 + 0.3, fronts = [], hist = [], trace = [], lastE = 0;
      const loop = kit.loop(dt => {
        const b = V.beta, c0 = cl(), gam = 1 / Math.sqrt(1 - b * b);
        // sub-steps: advance the charge, emit wavefronts, remember its history for the observer
        const n = Math.max(1, Math.ceil(dt / 0.01)), h = dt / n;
        for (let s = 0; s < n; s++) {
          t += h; u += W * h;
          const x = CX + R * Math.cos(u), y = CY - R * Math.sin(u);
          hist.push({ t, u, x }); if (!fronts.length || t - fronts[fronts.length - 1].t >= EMIT) fronts.push({ t, x, y });
        }
        while (fronts.length && c0 * (t - fronts[0].t) > 900) fronts.shift();
        while (hist.length > 2 && hist[1].t < t - 8) hist.shift();
        // the light reaching the observer now left the charge at t_e with t_e − (x_e − CX)/c = t − (OBX − CX)/c
        const target = t - (OBX - CX) / c0; let e = null;
        for (let j = hist.length - 1; j > 0; j--) { const a = hist[j - 1], q = hist[j], ga = a.t - (a.x - CX) / c0 - target, gq = q.t - (q.x - CX) / c0 - target; if (ga <= 0 && gq >= 0) { const w = gq - ga > 0 ? -ga / (gq - ga) : 0; e = a.u + (q.u - a.u) * w; break; } }
        const En = e == null ? 0 : fieldN(e, b);
        lastE = En; trace.push([t, En]); while (trace.length && trace[0][0] < t - 2 * TORB) trace.shift();
        ro.set('g', gam.toFixed(2));
        ro.set('ang', (180 / Math.PI / gam).toFixed(1) + '°');
        ro.set('sq', (1 / (1 - b)).toFixed(1) + ' ×');
        ro.set('pk', kit.fmt(1 / ((1 - b) * (1 - b)), 3) + ' ×');
        const um = ((u % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        plot.set({ marks: [{ x: (um - b * Math.cos(um)) / (2 * Math.PI), y: Math.sin(um), label: 'now' }] });
        const cx2 = st.begin(), C = kit.colors(), g = fit(st, W0, H0), c = cx2;
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        c.save(); c.beginPath(); c.rect(0, 0, OBX + 20, H0); c.clip();
        if (V.fronts) {
          c.lineWidth = 1.2;
          for (const f of fronts) { const r = c0 * (t - f.t); if (r < 1) continue; c.strokeStyle = kit.hue(205, clamp(0.85 - r / 700, 0.08, 0.85)); c.beginPath(); c.arc(f.x, f.y, r, 0, 6.283); c.stroke(); }
        }
        // the orbit, the charge, its velocity and beam cone
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.arc(CX, CY, R, 0, 6.283); c.stroke(); c.setLineDash([]);
        const qx = CX + R * Math.cos(u), qy = CY - R * Math.sin(u), vx = -Math.sin(u), vy = -Math.cos(u), va = Math.atan2(vy, vx);
        if (V.cone) { const ha = Math.max(0.02, Math.min(1.2, 1 / gam)); c.fillStyle = kit.hue(45, 0.3); c.beginPath(); c.moveTo(qx, qy); c.arc(qx, qy, 150, va - ha, va + ha); c.closePath(); c.fill(); }
        arrowTo(c, qx, qy, qx + 34 * vx, qy + 34 * vy, C.ok, 2.2);
        kit.dot(c, qx, qy, 6, C.bad); text(c, '−', qx, qy, '#fff', 'center', 11, 'bold');
        c.restore();
        // the observer
        const glow = clamp(lastE * lastE, 0, 1);
        c.fillStyle = kit.hue(45, 0.15 + 0.85 * glow); c.beginPath(); c.arc(OBX, CY, 9 + 10 * glow, 0, 6.283); c.fill();
        kit.dot(c, OBX, CY, 5, C.text); text(c, 'observer', OBX, CY + 26, C.text, 'center', 11, 'bold'); text(c, '(far away)', OBX, CY + 40, C.muted, 'center', 10);
        // the strip chart of the field arriving at the observer
        c.fillStyle = C.bg2 || C.surface; c.fillRect(RX, 0, W0 - RX, H0);
        line(c, RX + 10, CY, W0 - 10, CY, C.faint, 1);
        text(c, 'field arriving at the observer', RX + 10, 16, C.muted, 'left', 11);
        text(c, 'last ' + 2 * TORB + ' s →', W0 - 12, H0 - 12, C.muted, 'right', 10);
        c.strokeStyle = C.series[1]; c.lineWidth = 2; c.beginPath();
        trace.forEach((p, i) => { const x = RX + 10 + (W0 - RX - 20) * (1 - (t - p[0]) / (2 * TORB)), y = CY - 120 * p[1]; i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-cones: three cones, three lights, one match */
  Hyper.sim('lux-cones', {
    title: 'Three cones: matching a colour with three lights',
    blurb: `The curves are the sensitivities of the three kinds of cone, S, M and L (approximate, computed from the standard colour-matching functions). A **target** light of one wavelength (dashed line) is compared with a **mixture** of three lights (the coloured bars; their heights are the amounts). The bars on the right are the responses of the three cones to each; the split disc shows the two colours side by side, as in a colorimeter. When all three responses agree, the two halves look identical — whatever their spectra.

**Try this**
- Target 580 nm (yellow). Press **Find the match**: a mixture of red and green light, with no yellow in it, gives the same three responses. That is how every screen makes yellow.
- Move the target to 490 nm (blue-green) and find the match: one light comes out *negative*. It must be added to the target instead (drawn below the axis): no mixture of these primaries is as saturated as the spectral colour.
- Choose an observer without L cones (protanope) and find a match: only two lights are needed. The two halves may look different to you — but not to that observer.
- Slide the target along the spectrum and watch which cones it excites: two numbers change smoothly, and that is all the eye knows.`,
    mount(box, kit) {
      const W0 = 720, H0 = 330, X0 = 40, X1 = 420, Y0 = 250, Y1 = 40, LMIN = 380, LMAX = 720;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'lt', label: 'Target wavelength', min: 400, max: 700, step: 1, value: 580, unit: 'nm' },
        { id: 'l1', label: 'Light 1 wavelength', min: 400, max: 700, step: 1, value: 640, unit: 'nm' },
        { id: 'i1', label: 'Light 1 amount', min: -1, max: 2, step: 0.01, value: 0.5 },
        { id: 'l2', label: 'Light 2 wavelength', min: 400, max: 700, step: 1, value: 540, unit: 'nm' },
        { id: 'i2', label: 'Light 2 amount', min: -1, max: 2, step: 0.01, value: 0.5 },
        { id: 'l3', label: 'Light 3 wavelength', min: 400, max: 700, step: 1, value: 450, unit: 'nm' },
        { id: 'i3', label: 'Light 3 amount', min: -1, max: 2, step: 0.01, value: 0 },
        { id: 'obs', type: 'select', label: 'Observer', options: [['Three kinds of cone (normal)', 'n'], ['No L cones (protanope)', 'L'], ['No M cones (deuteranope)', 'M'], ['No S cones (tritanope)', 'S']], value: 'n' },
        { type: 'buttons', items: [{ id: 'solve', label: 'Find the match', primary: true }] }
      ], id => { if (id === 'solve') solve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Target responses L, M, S'], ['m', 'Mixture responses L, M, S'], ['ok', 'Match'], ['neg', '']]);
      // cone sensitivities, each scaled to a peak of 1
      const PK = [0, 0, 0]; for (let l = LMIN; l <= LMAX; l++) toLMS(cie(l)).forEach((v, k) => { PK[k] = Math.max(PK[k], v); });
      const lms = l => toLMS(cie(l)).map((v, k) => v / PK[k]);
      const present = () => V.obs === 'L' ? [1, 2] : V.obs === 'M' ? [0, 2] : V.obs === 'S' ? [0, 1] : [0, 1, 2];
      function solve() {
        const idx = present(), T = lms(V.lt), P = [lms(V.l1), lms(V.l2), lms(V.l3)];
        const snap = v => Math.abs(v) < 0.02 ? 0 : v, set = a => { a = a.map(snap); ctl.set('i1', clamp(+a[0].toFixed(3), -1, 2)); ctl.set('i2', clamp(+a[1].toFixed(3), -1, 2)); ctl.set('i3', clamp(+a[2].toFixed(3), -1, 2)); };
        if (idx.length === 3) {
          // Cramer's rule for Σ aᵢ Pᵢ = T
          const m = [0, 1, 2].map(r => [P[0][r], P[1][r], P[2][r]]), det = M3 => M3[0][0] * (M3[1][1] * M3[2][2] - M3[1][2] * M3[2][1]) - M3[0][1] * (M3[1][0] * M3[2][2] - M3[1][2] * M3[2][0]) + M3[0][2] * (M3[1][0] * M3[2][1] - M3[1][1] * M3[2][0]);
          const D = det(m); if (Math.abs(D) < 1e-9) return;
          set([0, 1, 2].map(k => det(m.map((row, r) => row.map((v, j) => j === k ? T[r] : v))) / D));
        } else {
          // two cones: use the pair of lights that is best conditioned, the third at zero
          let best = null;
          for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) { const d = P[a][idx[0]] * P[b][idx[1]] - P[b][idx[0]] * P[a][idx[1]]; if (!best || Math.abs(d) > Math.abs(best.d)) best = { a, b, d }; }
          if (!best || Math.abs(best.d) < 1e-9) return;
          const out = [0, 0, 0];
          out[best.a] = (T[idx[0]] * P[best.b][idx[1]] - P[best.b][idx[0]] * T[idx[1]]) / best.d;
          out[best.b] = (P[best.a][idx[0]] * T[idx[1]] - T[idx[0]] * P[best.a][idx[1]]) / best.d;
          set(out);
        }
      }
      const X = l => X0 + (X1 - X0) * (l - LMIN) / (LMAX - LMIN), Y = v => Y0 - (Y0 - Y1) * v;
      const loop = kit.loop(() => {
        const ls = [V.l1, V.l2, V.l3], is = [V.i1, V.i2, V.i3], T = lms(V.lt), idx = present();
        // responses: a negative amount means that light is added to the target side instead
        const tgt = T.slice(), mix = [0, 0, 0], xyzT = cie(V.lt).slice(), xyzM = [0, 0, 0];
        ls.forEach((l, k) => { const r = lms(l), x = cie(l); for (let q = 0; q < 3; q++) { if (is[k] >= 0) { mix[q] += is[k] * r[q]; xyzM[q] += is[k] * x[q]; } else { tgt[q] -= is[k] * r[q]; xyzT[q] -= is[k] * x[q]; } } });
        const f3 = a => a.map(v => v.toFixed(2)).join(', ');
        ro.set('t', f3(tgt)); ro.set('m', f3(mix));
        const top = Math.max(1e-9, ...idx.map(k => Math.max(tgt[k], mix[k]))), err = Math.max(...idx.map(k => Math.abs(tgt[k] - mix[k]))) / top;
        ro.set('ok', err < 0.02 ? (V.obs === 'n' ? 'yes — the two halves are identical' : 'yes, for this observer') : 'no (' + (100 * err).toFixed(0) + ' % off)');
        ro.set('neg', is.some(v => v < -0.005) ? 'A negative amount: that light is added to the target.' : '');
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // axes and the spectrum
        line(c, X0, Y0, X1, Y0, C.axis || C.muted, 1.2); line(c, X0, Y0, X0, Y1 - 10, C.axis || C.muted, 1.2);
        for (let l = LMIN; l < LMAX; l += 2) { c.fillStyle = spectralCss(l); c.fillRect(X(l), Y0 + 4, X(l + 2) - X(l) + 0.5, 10); }
        for (let l = 400; l <= 700; l += 50) text(c, String(l), X(l), Y0 + 26, C.muted, 'center', 10);
        text(c, 'wavelength (nm)', (X0 + X1) / 2, Y0 + 40, C.muted, 'center', 11);
        // cone curves
        const names = ['L', 'M', 'S'], cols = [kit.hue(8), kit.hue(130), kit.hue(225)];
        for (let k = 0; k < 3; k++) {
          const on = idx.includes(k);
          c.strokeStyle = cols[k]; c.lineWidth = on ? 2.4 : 1; c.setLineDash(on ? [] : [3, 4]); c.beginPath();
          for (let l = LMIN; l <= LMAX; l += 2) { const y = Y(lms(l)[k]); l === LMIN ? c.moveTo(X(l), y) : c.lineTo(X(l), y); }
          c.stroke(); c.setLineDash([]);
          let pk = LMIN, pv = 0; for (let l = LMIN; l <= LMAX; l++) { const v = lms(l)[k]; if (v > pv) { pv = v; pk = l; } }
          text(c, names[k] + (on ? '' : ' (missing)'), X(pk), Y(1) - 10, cols[k], 'center', 12, 'bold');
        }
        // the target and the three lights
        line(c, X(V.lt), Y0, X(V.lt), Y(1.05), C.text, 2, [5, 4]); text(c, 'target', X(V.lt), Y(1.05) - 8, C.text, 'center', 11, 'bold');
        ls.forEach((l, k) => {
          const h = Math.min(1.2, Math.abs(is[k])) * (Y0 - Y1) * 0.8;
          c.fillStyle = spectralCss(l); c.strokeStyle = C.text; c.lineWidth = 1;
          if (is[k] >= 0) { c.fillRect(X(l) - 4, Y0 - h, 8, h); c.strokeRect(X(l) - 4, Y0 - h, 8, h); }
          else { c.globalAlpha = 0.6; c.fillRect(X(l) - 4, Y0 + 16, 8, Math.min(60, h / 2)); c.globalAlpha = 1; c.strokeRect(X(l) - 4, Y0 + 16, 8, Math.min(60, h / 2)); }
          text(c, String(k + 1), X(l), is[k] >= 0 ? Y0 - h - 9 : Y0 + 16 + Math.min(60, h / 2) + 9, C.text, 'center', 11, 'bold');
        });
        // response bars
        const BX = 450, BW = 16, BY = 200, BH = 150, sc = BH / Math.max(1e-9, ...tgt, ...mix);
        text(c, 'cone responses', BX + 60, 20, C.muted, 'center', 11);
        for (let k = 0; k < 3; k++) {
          const x = BX + k * 42;
          c.globalAlpha = idx.includes(k) ? 1 : 0.3;
          c.strokeStyle = cols[k]; c.lineWidth = 2; c.strokeRect(x, BY - tgt[k] * sc, BW, tgt[k] * sc);
          c.fillStyle = cols[k]; c.fillRect(x + BW + 2, BY - mix[k] * sc, BW, mix[k] * sc);
          c.globalAlpha = 1;
          text(c, names[k], x + BW, BY + 12, cols[k], 'center', 12, 'bold');
        }
        text(c, 'outline: target   solid: mixture', BX + 60, BY + 30, C.muted, 'center', 10);
        // the split field
        const lt = toLin(xyzT), lm = toLin(xyzM), s = 0.95 / Math.max(1e-9, ...lt, ...lm), PXc = 635, PYc = 130, PR = 62;
        c.fillStyle = rgbCss(lt, s); c.beginPath(); c.moveTo(PXc, PYc - PR); c.arc(PXc, PYc, PR, -Math.PI / 2, Math.PI / 2, true); c.closePath(); c.fill();
        c.fillStyle = rgbCss(lm, s); c.beginPath(); c.moveTo(PXc, PYc - PR); c.arc(PXc, PYc, PR, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(PXc, PYc, PR, 0, 6.283); c.stroke(); line(c, PXc, PYc - PR, PXc, PYc + PR, C.text, 1);
        text(c, 'target', PXc - 32, PYc + PR + 14, C.text, 'center', 11); text(c, 'mixture', PXc + 32, PYc + PR + 14, C.text, 'center', 11);
        text(c, '(as a normal eye sees them)', PXc, PYc + PR + 30, C.muted, 'center', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-eye: focusing, age, spectacles, pupil */
  Hyper.sim('lux-eye', {
    title: 'The eye: focusing, age and spectacles',
    blurb: `A cross-section of an eye (the "reduced eye": its cornea and lens act as one lens of about 60 dioptres, with the retina 22.3 mm behind it in fluid of index 1.336). Rays from a point on the object pass the pupil and meet — ideally on the retina. The eye **accommodates** automatically, bulging its lens as far as its age allows. The letter at top left shows how blurred the object looks.

**Try this**
- Bring the object closer: the lens bulges (the accommodation readout rises). Below the near point the rays meet behind the retina and the letter blurs.
- Raise the age: the range of accommodation shrinks — about 10 D at 20, 4 D at 45, 1 D at 60 — and the near point runs away. Add **+2 D spectacles** and read again.
- Choose the short-sighted eye: distant objects focus in front of the retina, however relaxed the lens. A **−3 D** lens fixes it.
- Dim the light: the pupil opens (2 → 8 mm). A wide pupil blurs more when the focus is off, a narrow one diffracts more; in dim light the rods take over and the colour goes.`,
    mount(box, kit) {
      const W0 = 720, H0 = 330, CY = 175, XL = 330, PXMM = 11, SI = 22.3, NE = 1.336, ZG = -12, P0 = 1000 * NE / SI;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'so', label: 'Distance of the object', min: 0.07, max: 100, value: 0.4, unit: 'm', log: true, sig: 3 },
        { id: 'age', label: 'Age', min: 10, max: 70, step: 1, value: 25, unit: 'years' },
        { id: 'eye', type: 'select', label: 'Eye', options: [['Normal', 0], ['Short-sighted (needs −3 D)', 3], ['Long-sighted (needs +2 D)', -2]], value: 0 },
        { id: 'sp', label: 'Spectacles', min: -6, max: 4, step: 0.25, value: 0, unit: 'D' },
        { id: 'auto', type: 'check', label: 'Eye focuses by itself', value: true },
        { id: 'acc', label: 'Accommodation (when not automatic)', min: 0, max: 14, step: 0.1, value: 0, unit: 'D' },
        { id: 'lum', label: 'Brightness of the scene', min: 0.001, max: 10000, value: 100, unit: 'cd/m²', log: true, sig: 2 }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Accommodation used / available'], ['np', 'Near point / far point'], ['blur', 'Blur on the retina'], ['pu', 'Pupil and vision']]);
      const AGE = [[10, 14], [20, 10], [30, 7.5], [40, 5], [45, 4], [50, 2], [55, 1.3], [60, 1], [70, 0.8]];
      const amax = a => { for (let i = 1; i < AGE.length; i++) if (a <= AGE[i][0]) { const [a0, v0] = AGE[i - 1], [a1, v1] = AGE[i]; return v0 + (v1 - v0) * (a - a0) / (a1 - a0); } return 0.8; };
      // vergence (dioptres) of light from an object at so metres, arriving at the eye through spectacles 12 mm in front
      const vergAtEye = so => { const d = Math.max(1e-3, so - Math.abs(ZG) / 1000), V1 = -1 / d + V.sp, t = Math.abs(ZG) / 1000; return V1 / (1 - t * V1); };
      const need = so => -vergAtEye(so) - (+V.eye);                         // accommodation that puts the focus on the retina
      function findDist(A) {                                                // the object distance that needs accommodation A
        let lo = Math.log(0.02), hi = Math.log(1e4);
        if (need(Math.exp(hi)) >= A) return Infinity;
        if (need(Math.exp(lo)) <= A) return 0.02;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (need(Math.exp(m)) > A) lo = m; else hi = m; }
        return Math.exp((lo + hi) / 2);
      }
      const loop = kit.loop(() => {
        const Am = amax(V.age), A = V.auto ? clamp(need(V.so), 0, Am) : Math.min(V.acc, Am), Peye = P0 + (+V.eye) + A;
        if (!V.auto && V.acc > Am) ctl.set('acc', +Am.toFixed(1));
        const D = 4.9 - 3 * Math.tanh(0.4 * Math.log10(V.lum));             // pupil (mm), Moon and Spencer
        const regime = V.lum > 3 ? 'cones (colour, sharp)' : V.lum > 0.005 ? 'cones and rods (dusk)' : 'rods only (no colour)';
        // trace rays in mm: object on the axis at −so, spectacles at ZG, eye's optics at 0, retina at SI (inside, index NE)
        const so = V.so * 1000, rays = [];
        for (let k = -3; k <= 3; k++) {
          const yE = D / 2 * k / 3, den = so + ZG * (ZG + so) * V.sp / 1000, u0 = yE / den;
          const yG = u0 * (ZG + so), u1 = u0 - yG * V.sp / 1000, u2 = u1 - yE * Peye / 1000;
          rays.push({ u0, yG, yE, u2 });
        }
        const edge = rays[6], yR = edge.yE + edge.u2 * SI / NE, blurMM = 2 * Math.abs(yR), zf = Math.abs(edge.u2) > 1e-12 ? -edge.yE * NE / edge.u2 : Infinity;
        const blurAng = blurMM / (SI / NE), difAng = 1.22 * 550e-6 / D, am = 180 / Math.PI * 60, tot = Math.hypot(blurAng, difAng) * am;
        ro.set('a', A.toFixed(2) + ' D of ' + Am.toFixed(1) + ' D' + (V.auto && need(V.so) > Am + 0.01 ? ' — not enough!' : V.auto && need(V.so) < -0.01 ? ' — cannot relax further' : ''));
        const np = findDist(Am), fp = findDist(0);
        ro.set('np', (np < 0.021 ? '< 2 cm' : (100 * np).toFixed(0) + ' cm') + '  /  ' + (fp === Infinity ? '∞' : fp > 50 ? '∞ (beyond 50 m)' : (100 * fp).toFixed(0) + ' cm'));
        ro.set('blur', (1000 * blurMM).toFixed(0) + ' µm = ' + (blurAng * am).toFixed(1) + '′  (diffraction ' + (difAng * am).toFixed(1) + '′, cones 0.5′ apart)');
        ro.set('pu', D.toFixed(1) + ' mm — ' + regime);
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        const Xz = z => XL + PXMM * z, Yy = y => CY - PXMM * y * 1.6;        // heights drawn 1.6 × larger
        // the eye
        const ecx = Xz(SI - 12), er = PXMM * 12;
        c.fillStyle = C.dark ? 'hsl(210 25% 16%)' : 'hsl(210 40% 96%)'; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.arc(ecx, CY, er, 0, 6.283); c.fill(); c.stroke();
        c.strokeStyle = kit.hue(8); c.lineWidth = 3; c.beginPath(); c.arc(ecx, CY, er, -1.1, 1.1); c.stroke();
        text(c, 'retina', ecx + er + 6, CY - 70, kit.hue(8), 'left', 11, 'bold');
        kit.dot(c, Xz(SI), CY, 3, kit.hue(8)); text(c, 'fovea', Xz(SI) + 8, CY + 12, C.muted, 'left', 10);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(Xz(-2.4) + PXMM * 7.8, CY, PXMM * 7.8, Math.PI - 0.62, Math.PI + 0.62); c.stroke();
        text(c, 'cornea', Xz(-3), CY - 92, C.text, 'center', 11);
        // lens: thicker with accommodation
        const lt = 1.8 + 0.06 * A;
        c.fillStyle = kit.hue(200, 0.3); c.strokeStyle = kit.hue(200); c.lineWidth = 1.5; c.beginPath(); c.ellipse(Xz(1.8), CY, PXMM * lt, PXMM * 4.4, 0, 0, 6.283); c.fill(); c.stroke();
        text(c, 'lens', Xz(1.8), CY + 66, kit.hue(200), 'center', 11, 'bold');
        // iris and pupil
        c.fillStyle = C.dark ? 'hsl(28 40% 40%)' : 'hsl(28 45% 45%)';
        c.fillRect(Xz(0.2) - 2, Yy(6.5), 4, Yy(D / 2) - Yy(6.5));
        c.fillRect(Xz(0.2) - 2, Yy(-D / 2), 4, Yy(-6.5) - Yy(-D / 2));
        text(c, 'pupil ' + D.toFixed(1) + ' mm', Xz(0.2), Yy(6.5) - 10, C.muted, 'center', 10);
        // spectacles
        if (Math.abs(V.sp) > 0.01) {
          const xg = Xz(ZG); c.strokeStyle = kit.hue(160); c.lineWidth = 2; c.fillStyle = kit.hue(160, 0.18);
          const b = V.sp > 0 ? 7 : -5; c.beginPath(); c.moveTo(xg - 2, CY - 70); c.quadraticCurveTo(xg - 2 - b, CY, xg - 2, CY + 70); c.lineTo(xg + 2, CY + 70); c.quadraticCurveTo(xg + 2 + b, CY, xg + 2, CY - 70); c.closePath(); c.fill(); c.stroke();
          text(c, (V.sp > 0 ? '+' : '') + V.sp.toFixed(2) + ' D', xg, CY - 82, kit.hue(160), 'center', 11, 'bold');
        }
        // rays: from the object (or the edge of the picture) to the spectacles, the eye, and the retina
        const zStart = Math.max(-so, (8 - XL) / PXMM);
        c.strokeStyle = kit.hue(45); c.lineWidth = 1.3;
        for (const r of rays) {
          const yS = r.u0 * (zStart + so);
          c.beginPath(); c.moveTo(Xz(zStart), Yy(yS)); c.lineTo(Xz(ZG), Yy(r.yG)); c.lineTo(Xz(0), Yy(r.yE));
          c.lineTo(Xz(SI), Yy(r.yE + r.u2 * SI / NE)); c.stroke();
        }
        if (Number.isFinite(zf) && zf > 0 && zf < 60) kit.dot(c, Xz(zf), CY, 3.5, kit.hue(45));
        c.strokeStyle = C.bad; c.lineWidth = 4; line(c, Xz(SI) + 1, Yy(yR), Xz(SI) + 1, Yy(-yR), C.bad, 4);
        text(c, '← rays from a point ' + (V.so < 1 ? (100 * V.so).toFixed(0) + ' cm' : V.so.toFixed(1) + ' m') + ' away', 12, CY + 96, C.text, 'left', 11);
        // what the eye sees: a letter, blurred by the defocus and the diffraction of the pupil
        c.fillStyle = C.bg2 || C.surface; c.fillRect(8, 8, 150, 120); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(8, 8, 150, 120);
        const col = V.lum > 3 ? 'hsl(0 75% 45%)' : V.lum > 0.005 ? 'hsl(0 30% 40%)' : 'hsl(0 0% 45%)', rb = clamp(tot * 2.2, 0, 26), N = 24;
        font(c, 70, 'bold'); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col;
        if (rb < 0.8) { c.globalAlpha = 1; c.fillText('E', 83, 64); }
        else { c.globalAlpha = 2.2 / N; for (let q = 0; q < N; q++) { const a = q * 2.39996, r = rb * Math.sqrt((q + 0.5) / N); c.fillText('E', 83 + r * Math.cos(a), 64 + r * Math.sin(a)); } c.globalAlpha = 1; }
        text(c, 'what the eye sees', 83, 118, C.muted, 'center', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-bee: the compound eye and its best facet */
  Hyper.sim('lux-bee', {
    title: 'A compound eye: the best size of a facet',
    blurb: `An insect's eye is a dome of tiny tubes (ommatidia), each looking in its own direction through a lens of diameter δ. Neighbouring tubes point δ/R apart (R is the radius of the eye) — the finer the facets, the finer the sampling. But each tiny lens diffracts, taking in light from an angle of about λ/δ — the finer the facets, the blurrier each one. On the right, a scene of bars (top) and the same scene as the eye's facets report it (bottom). The graph shows the two blurs and their sum.

**Try this**
- Shrink the facets: the sampling gets finer but each facet's view (the orange cone) widens — the fine bars wash out.
- Enlarge them: sharp facets, but too few of them — the bars break into blocks.
- Press **Best facet**: δ = √(λR), where the two blurs are equal and their sum is smallest (for a bee, about 35 µm).
- A bigger eye (larger R) allows a sharper view — which is why insects cannot see as sharply as we do: an eye with our resolution would have to be about a metre across.`,
    mount(box, kit) {
      const W0 = 720, H0 = 300, EX = 150, EY = 150, ER = 110, SX0 = 300, SX1 = 700;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Facet diameter δ', min: 5, max: 100, step: 0.5, value: 20, unit: 'µm' },
        { id: 'R', label: 'Radius of the eye R', min: 0.5, max: 10, step: 0.1, value: 3, unit: 'mm' },
        { id: 'lam', label: 'Wavelength λ', min: 300, max: 650, step: 5, value: 400, unit: 'nm' },
        { type: 'buttons', items: [{ id: 'best', label: 'Best facet: δ = √(λR)', primary: true }] }
      ], id => { if (id === 'best') ctl.set('d', Math.round(clamp(Math.sqrt(V.lam * 1e-9 * V.R * 1e-3) * 1e6, 5, 100) * 2) / 2); curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['s', 'Sampling angle δ/R'], ['df', 'Diffraction blur λ/δ'], ['t', 'Total blur'], ['b', 'Best facet √(λR)'], ['n', 'Facets across 180°']]);
      const plot = kit.plot(gb, { x: { label: 'facet diameter δ (µm)', min: 5, max: 100 }, y: { label: 'blur (degrees)', min: 0 }, legend: true }, 150);
      const deg = 180 / Math.PI;
      function curve() {
        const s = [], f = [], t = [], R = V.R * 1e-3, l = V.lam * 1e-9;
        for (let d = 5; d <= 100; d += 0.5) { const a = d * 1e-6 / R * deg, b = l / (d * 1e-6) * deg; s.push([d, a]); f.push([d, b]); t.push([d, a + b]); }
        plot.set({ series: [{ pts: s, label: 'sampling δ/R', dash: [5, 4] }, { pts: f, label: 'diffraction λ/δ', dash: [2, 3] }, { pts: t, label: 'total', width: 2.6 }], y: { label: 'blur (degrees)', min: 0, max: Math.min(20, 3 * (2 * Math.sqrt(l / R) * deg)) } });
      }
      curve();
      // the scene: groups of bars of shrinking width, as a function of direction (degrees, −90 … 90)
      const scene = a => { const groups = [[-88, 10], [-20, 5], [18, 2.5], [41, 1.2], [56, 0.6]]; for (const [s0, w] of groups) { if (a >= s0 && a < s0 + 6 * w) return Math.floor((a - s0) / w) % 2 ? 0.1 : 0.95; } return 0.1; };
      const loop = kit.loop(() => {
        const R = V.R * 1e-3, d = V.d * 1e-6, l = V.lam * 1e-9, samp = d / R * deg, dif = l / d * deg, best = Math.sqrt(l * R);
        ro.set('s', samp.toFixed(2) + '°'); ro.set('df', dif.toFixed(2) + '°'); ro.set('t', (samp + dif).toFixed(2) + '°  (least ' + (2 * Math.sqrt(l / R) * deg).toFixed(2) + '°)');
        ro.set('b', (best * 1e6).toFixed(1) + ' µm'); ro.set('n', Math.round(Math.PI * R / d).toString());
        plot.set({ marks: [{ x: V.d, y: samp + dif, label: 'this eye' }], vlines: [{ x: best * 1e6, label: '√(λR)' }] });
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // the eye: a half dome of facets looking out to the right
        const nF = Math.PI * R / d, show = Math.min(nF, 60), step = Math.PI / show;
        c.fillStyle = C.dark ? 'hsl(30 30% 18%)' : 'hsl(30 40% 90%)'; c.beginPath(); c.arc(EX, EY, ER, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let k = 0; k <= show; k++) { const a = -Math.PI / 2 + k * step; line(c, EX + 0.45 * ER * Math.cos(a), EY + 0.45 * ER * Math.sin(a), EX + ER * Math.cos(a), EY + ER * Math.sin(a), C.muted, 0.8); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(EX, EY, ER, -Math.PI / 2, Math.PI / 2); c.stroke();
        // one facet, with its sampling wedge and its diffraction cone (angles exaggerated ×3 when tiny)
        const ex = Math.max(1, 6 / Math.max(samp, dif, 1e-9)), ws = samp * ex / deg, wd = dif * ex / deg;
        c.fillStyle = kit.hue(205, 0.35); c.beginPath(); c.moveTo(EX, EY); c.arc(EX, EY, ER, -ws / 2, ws / 2); c.closePath(); c.fill();
        c.fillStyle = kit.hue(28, 0.35); c.beginPath(); c.moveTo(EX + ER, EY); c.arc(EX + ER, EY, 110, -wd / 2, wd / 2); c.closePath(); c.fill();
        text(c, 'δ/R', EX + 0.55 * ER, EY - 12, kit.hue(205), 'center', 11, 'bold'); text(c, 'λ/δ', EX + ER + 70, EY - 16 - 30 * Math.tan(Math.min(1.2, wd / 2)), kit.hue(28), 'center', 11, 'bold');
        text(c, ex > 1.01 ? 'angles drawn ×' + ex.toFixed(0) : '', EX, H0 - 12, C.muted, 'center', 10);
        text(c, Math.round(nF) + ' facets across 180°' + (nF > 60 ? ' (60 drawn)' : ''), EX, 16, C.text, 'center', 11);
        // the scene and what the facets report
        const Xa = a => SX0 + (SX1 - SX0) * (a + 90) / 180;
        text(c, 'the scene', SX0, 40, C.muted, 'left', 11);
        for (let x = SX0; x < SX1; x++) { const a = -90 + 180 * (x - SX0) / (SX1 - SX0), v = scene(a); c.fillStyle = 'hsl(45 20% ' + (8 + 84 * v).toFixed(0) + '%)'; c.fillRect(x, 50, 1.2, 60); }
        text(c, 'as the facets report it', SX0, 140, C.muted, 'left', 11);
        // each facet averages the scene over its acceptance (a Gaussian whose width combines its own wedge δ/R and
        // diffraction λ/δ), and reports one value for its whole wedge; facets finer than a pixel are drawn per pixel
        const sig = Math.hypot(dif, samp) / 2.355, cell = Math.max(samp, 180 / (SX1 - SX0)), n = Math.max(1, Math.round(180 / cell));
        for (let k = 0; k < n; k++) {
          const a0 = -90 + k * cell, ac = a0 + cell / 2; let s = 0, wsum = 0;
          for (let q = -12; q <= 12; q++) { const a = ac + q * sig / 4, w = Math.exp(-0.5 * (q / 4) * (q / 4)); s += w * scene(a); wsum += w; }
          const v = s / wsum;
          c.fillStyle = 'hsl(45 20% ' + (8 + 84 * v).toFixed(0) + '%)'; c.fillRect(Xa(a0), 150, Math.max(1, Xa(a0 + cell) - Xa(a0)) + 0.4, 60);
        }
        [[-88, 10], [-20, 5], [18, 2.5], [41, 1.2], [56, 0.6]].forEach(([s0, w]) => text(c, w + "°", Xa(s0 + 3 * w), 228, C.muted, 'center', 10));
        text(c, 'bar widths', SX1, 244, C.muted, 'right', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lux-edges: lateral inhibition and Mach bands */
  Hyper.sim('lux-edges', {
    title: 'Receptors that subtract their neighbours',
    blurb: `A row of receptors, like those in the eye of the horseshoe crab, looks at a pattern of light (top strip). Each receptor's output is its own light minus a fraction of its neighbours' outputs — **lateral inhibition** (drag the highlighted receptor to see which neighbours it inhibits). The graph compares the light falling on the receptors (dashed) with what they signal (bars); the lower strip paints the signals as brightness.

**Try this**
- A step from dark to light: the output overshoots on the bright side of the edge and undershoots on the dark side. The edge is exaggerated; uniform areas are played down.
- The ramp: the light changes smoothly, yet the output shows a bright band at the top corner and a dark band at the bottom corner — Mach bands, which you can see in the lower strip (and in real life, along soft shadows).
- Turn the inhibition off: the output copies the input. Make it wider: the bands broaden.`,
    mount(box, kit) {
      const W0 = 720, H0 = 300, N = 64, X0 = 40, X1 = 680, dx = (X1 - X0) / N;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Pattern of light', options: [['A step', 'step'], ['A ramp (Mach bands)', 'ramp'], ['A bright bar', 'bar']], value: 'ramp' },
        { id: 'k', label: 'Strength of inhibition', min: 0, max: 0.9, step: 0.01, value: 0.7 },
        { id: 'w', label: 'Reach (receptors each side)', min: 1, max: 10, step: 1, value: 5 }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['hi', 'Overshoot on the bright side'], ['lo', 'Undershoot on the dark side']]);
      let sel = 20;
      const light = i => { const x = (i + 0.5) / N; if (V.pat === 'step') return x < 0.5 ? 0.25 : 0.75; if (V.pat === 'bar') return x > 0.42 && x < 0.58 ? 0.8 : 0.25; return x < 0.4 ? 0.2 : x > 0.6 ? 0.8 : 0.2 + 0.6 * (x - 0.4) / 0.2; };
      // Hartline–Ratliff: r_i = e_i − k Σ w_ij r_j over neighbours within the reach (weights falling off, summing to 1)
      function respond() {
        const e = Array.from({ length: N }, (_, i) => light(i)), w = Math.round(V.w), wts = [];
        let tot = 0; for (let d = 1; d <= w; d++) { wts.push(w + 1 - d); tot += 2 * (w + 1 - d); }
        let r = e.slice();
        for (let it = 0; it < 80; it++) {
          const nr = r.slice();
          for (let i = 0; i < N; i++) { let s = 0; for (let d = 1; d <= w; d++) { s += wts[d - 1] * ((r[Math.max(0, i - d)]) + (r[Math.min(N - 1, i + d)])); } nr[i] = Math.max(0, e[i] - V.k * s / tot); }
          for (let i = 0; i < N; i++) r[i] = 0.5 * r[i] + 0.5 * nr[i];
        }
        return { e, r };
      }
      kit.drag(st, {
        hit(p) { const g = fit(st, W0, H0), y = (p.y - g.oy) / g.s; return y > 60 && y < 90 ? 'sel' : null; },
        move(_, p) { const g = fit(st, W0, H0), x = (p.x - g.ox) / g.s; sel = clamp(Math.floor((x - X0) / dx), 0, N - 1); },
        hover: true
      });
      const loop = kit.loop(() => {
        const { e, r } = respond(), k0 = 1 / (1 + V.k);                 // a uniform area gives r = e − k r, so r = e/(1 + k)
        // compare the extremes with what uniform areas at the same light would give
        let hi = 0, lo = 0;
        for (let i = 0; i < N; i++) { const base = e[i] * k0; if (base > 0) { hi = Math.max(hi, (r[i] - base) / base); lo = Math.min(lo, (r[i] - base) / base); } }
        ro.set('hi', V.k > 0 ? '+' + (100 * hi).toFixed(0) + ' %' : 'none (no inhibition)');
        ro.set('lo', V.k > 0 ? (100 * lo).toFixed(0) + ' %' : 'none');
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        text(c, 'light falling on the receptors', X0, 10, C.muted, 'left', 11);
        for (let i = 0; i < N; i++) { c.fillStyle = 'hsl(45 15% ' + (6 + 90 * e[i]).toFixed(0) + '%)'; c.fillRect(X0 + i * dx, 18, dx + 0.5, 34); }
        // receptors, with the inhibitory links of the selected one
        const w = Math.round(V.w), rmax = Math.max(1e-9, ...r, ...e.map(v => v * k0));
        for (let d = -w; d <= w; d++) { if (!d) continue; const j = sel + d; if (j < 0 || j >= N) continue; const xs = X0 + (sel + 0.5) * dx, xj = X0 + (j + 0.5) * dx; c.strokeStyle = C.bad; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xs, 70); c.quadraticCurveTo((xs + xj) / 2, 60 - 3 * Math.abs(d), xj, 70); c.stroke(); line(c, xj - 3, 70, xj + 3, 70, C.bad, 2); }
        for (let i = 0; i < N; i++) kit.dot(c, X0 + (i + 0.5) * dx, 76, i === sel ? 5 : 3, i === sel ? C.warn : C.muted);
        // the graph: light (dashed) and signal (bars)
        const GY = 190, GH = 95, sc = GH / Math.max(rmax, ...e);
        line(c, X0, GY, X1, GY, C.faint, 1);
        for (let i = 0; i < N; i++) { c.fillStyle = i === sel ? C.warn : C.accent; c.fillRect(X0 + i * dx + 1, GY - r[i] * sc, dx - 2, r[i] * sc); }
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); for (let i = 0; i < N; i++) { const x = X0 + (i + 0.5) * dx, y = GY - e[i] * sc; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); for (let i = 0; i < N; i++) { const x = X0 + (i + 0.5) * dx, y = GY - e[i] * k0 * sc; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]);
        text(c, 'dashed: light   bars: signal   dotted: signal if the area were uniform', X0, GY + 12, C.muted, 'left', 10);
        // the signals painted as brightness
        text(c, 'what the receptors signal', X0, 228, C.muted, 'left', 11);
        for (let i = 0; i < N; i++) { c.fillStyle = 'hsl(45 15% ' + (6 + 90 * clamp(r[i] / rmax, 0, 1)).toFixed(0) + '%)'; c.fillRect(X0 + i * dx, 236, dx + 0.5, 34); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
