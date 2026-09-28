/* HYPER-FEYNMAN · sims/reference.js — reference simulations for Hyper Feynman authors.
 *   ref-twoslit      bullets, water waves or electrons at two slits: lumps that add, waves that interfere, and electrons
 *                    that arrive one at a time yet build fringes — with a light that shows which slit each one used
 *   ref-slit-arrows  the rule behind it: the arrow for each path turns as the electron travels; at each point of the
 *                    screen the two arrows are added head to tail and the square of the total is the probability
 */
(function () {
  'use strict';

  // the drawing: gun at x = 40, wall with the slits at x = 200, screen at x = 520, all 360 high
  const W0 = 640, H0 = 360, GUN = 40, WALL = 200, SCREEN = 520, MID = 180, NY = 181;

  // amplitudes at the screen from each slit, by adding wavelets across its width (Huygens): { A1: [cx], A2: [cx], ys }
  function amplitudes(Q, d, a, lam) {
    const k = 2 * Math.PI / lam, ys = [], A1 = [], A2 = [], M = Math.max(3, Math.round(a / 2));
    for (let i = 0; i < NY; i++) {
      const y = H0 * i / (NY - 1); ys.push(y);
      const amp = yc => { let re = 0, im = 0; for (let j = 0; j < M; j++) { const ys_ = yc - a / 2 + a * (j + 0.5) / M, r = Math.hypot(SCREEN - WALL, y - ys_); re += Math.cos(k * r) / Math.sqrt(r); im += Math.sin(k * r) / Math.sqrt(r); } return Q.cx(re / M, im / M); };
      A1.push(amp(MID - d / 2)); A2.push(amp(MID + d / 2));
    }
    return { ys, A1, A2 };
  }
  // a cumulative table for drawing screen positions from a distribution over the NY points
  function table(p) { const c = []; let s = 0; for (const v of p) { s += Math.max(0, v); c.push(s); } return { c, s }; }
  function draw(tab, R) { const u = R() * tab.s; let lo = 0, hi = tab.c.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (tab.c[m] < u) lo = m + 1; else hi = m; } return H0 * (lo + R() - 0.5) / (NY - 1); }

  Hyper.sim('ref-twoslit', {
    title: 'Two slits: bullets, waves and electrons',
    blurb: `A wall with two slits and a screen behind it. Choose what to send. **Bullets** arrive in lumps and pile up behind each slit — with both slits open the heaps simply add. **Water waves** spread from both slits and interfere: bands of strong and calm water. **Electrons** arrive one at a time, each as a single dot — and yet the dots build the same bands as the waves. The curves under the picture show the probabilities: P₁ (slit 1 alone), P₂ (slit 2 alone), their sum, and P₁₂ with both open.

**Try this**
- Electrons, both slits: slow the rate right down and watch single dots appear at random places. After a few hundred the fringes appear. No electron "knows" the pattern — each follows the probability |φ₁ + φ₂|².
- Close slit 2, then slit 1, then open both: at the dark bands, opening the second slit *reduces* the number of electrons arriving.
- Switch to bullets with both slits open: P₁₂ = P₁ + P₂, no fringes.
- Turn on the light to watch the electrons. Each electron seen at a slit flashes there — and the fringes fade: seen electrons land like bullets. Dim the light (fewer electrons are seen) and the fringes partly return.
- Make the wavelength longer or the slits closer: the fringes spread apart as λL/d.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1963);
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Send', options: [['Electrons, one at a time', 'e'], ['Bullets', 'b'], ['Water waves', 'w']], value: 'e' },
        { id: 'open', type: 'select', label: 'Slits open', options: [['Both', 'both'], ['Only slit 1 (upper)', '1'], ['Only slit 2 (lower)', '2']], value: 'both' },
        { id: 'd', label: 'Distance between the slits', min: 30, max: 160, step: 2, value: 80, unit: 'px' },
        { id: 'a', label: 'Width of each slit', min: 3, max: 30, step: 1, value: 10, unit: 'px' },
        { id: 'lam', label: 'Wavelength (drawn greatly enlarged)', min: 6, max: 40, step: 1, value: 16, unit: 'px' },
        { id: 'rate', label: 'Particles per second', min: 1, max: 400, step: 1, value: 60 },
        { id: 'watch', type: 'check', label: 'Shine a light to see which slit (electrons)', value: false },
        { id: 'light', label: 'Brightness: share of electrons seen', min: 0, max: 1, step: 0.05, value: 1 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the screen', primary: true }] }
      ], id => { if (id === 'clear' || id === 'mode' || id === 'open' || id === 'd' || id === 'a' || id === 'lam' || id === 'watch') { reset(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Arrived'], ['seen', 'Seen at a slit'], ['dx', 'Fringe spacing λL/d'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'position on the screen (top → bottom)', min: 0, max: H0 }, y: { label: 'probability (relative)', min: 0 }, legend: true }, 170);
      let P = null, hits = [], bins = new Float64Array(90), n = 0, seen = 0, flashes = [], acc = 0, t = 0;
      function reset() {
        const d = V.d, a = V.a, lam = V.lam, o = V.open;
        if (V.mode === 'b') {
          // bullets: broad heaps behind each slit, spread by ricochets off its edges
          const heap = yc => { const yS = MID + (yc - MID) * (SCREEN - GUN) / (WALL - GUN), s = 26 + 1.5 * a; return Array.from({ length: NY }, (_, i) => Math.exp(-0.5 * Math.pow((H0 * i / (NY - 1) - yS) / s, 2))); };
          const p1 = heap(MID - d / 2), p2 = heap(MID + d / 2);
          P = { p1, p2, p12: p1.map((v, i) => v + p2[i]) };
        } else {
          const A = amplitudes(Q, d, a, lam);
          P = { p1: A.A1.map(Q.abs2), p2: A.A2.map(Q.abs2), p12: A.A1.map((z, i) => Q.abs2(Q.add(z, A.A2[i]))) };
        }
        const pick = o === '1' ? P.p1 : o === '2' ? P.p2 : P.p12;
        P.tab = { both: table(P.p12), s1: table(P.p1), s2: table(P.p2), now: table(pick) };
        P.w1 = P.tab.s1.s / (P.tab.s1.s + P.tab.s2.s);
        hits = []; bins = new Float64Array(90); n = 0; seen = 0; flashes = [];
        ro.set('dx', V.mode === 'b' ? 'no fringes' : (V.lam * (SCREEN - WALL) / V.d).toFixed(0) + ' px on the screen');
        updatePlot();
      }
      function updatePlot() {
        if (!P) return;
        const ys = Array.from({ length: NY }, (_, i) => H0 * i / (NY - 1)), top = Math.max(...P.p12, ...P.p1, ...P.p2), sc = 1 / top;
        const series = [{ pts: ys.map((y, i) => [y, P.p1[i] * sc]), label: 'P₁ (slit 1)', width: 1.3, dash: [4, 3] }, { pts: ys.map((y, i) => [y, P.p2[i] * sc]), label: 'P₂ (slit 2)', width: 1.3, dash: [4, 3] },
          { pts: ys.map((y, i) => [y, (P.p1[i] + P.p2[i]) * sc]), label: 'P₁ + P₂', width: 1.5, dash: [1, 3] }, { pts: ys.map((y, i) => [y, P.p12[i] * sc]), label: 'P₁₂ = |φ₁ + φ₂|²', width: 2.2 }];
        if (n > 20 && V.mode !== 'w') {
          const pick = V.open === '1' ? P.tab.s1 : V.open === '2' ? P.tab.s2 : P.tab.both, bw = H0 / bins.length;
          const norm = (pick.s * sc) / (NY - 1) * H0 / (n * bw);
          series.push({ pts: Array.from(bins, (c, i) => [(i + 0.5) * bw, c * norm]), label: 'counted', line: false, dots: 2.6 });
        }
        plot.set({ series });
      }
      reset();
      const emit = () => {
        let y, at = null;
        if (V.mode === 'e' && V.watch && R() < V.light) {
          // the electron is seen at a slit: its arrival is drawn from that slit's own distribution
          const s = V.open === '1' ? 1 : V.open === '2' ? 2 : (R() < P.w1 ? 1 : 2);
          y = draw(s === 1 ? P.tab.s1 : P.tab.s2, R); at = s; seen++;
        } else y = draw(P.tab.now, R);
        n++; hits.push(y); if (hits.length > 4000) hits.shift();
        bins[Math.max(0, Math.min(bins.length - 1, Math.floor(y / H0 * bins.length)))]++;
        flashes.push({ y, t: 0, at });
      };
      const loop = kit.loop(dt => {
        t += dt;
        if (V.mode !== 'w') {
          acc += dt * V.rate;
          let k = 0; while (acc >= 1 && k < 200) { emit(); acc -= 1; k++; }
          if (acc > 5) acc = 0;
        }
        for (const f of flashes) f.t += dt; flashes = flashes.filter(f => f.t < 0.6);
        ro.set('n', V.mode === 'w' ? '—' : String(n));
        ro.set('seen', V.mode === 'e' && V.watch ? seen + ' (' + (n ? (100 * seen / n).toFixed(0) : 0) + ' %)' : '—');
        ro.set('msg', V.mode === 'e' && V.watch && V.light > 0.8 && V.open === 'both' ? 'Every electron is seen: the fringes are gone.' : V.mode === 'b' ? 'Bullets: P₁₂ = P₁ + P₂.' : V.mode === 'w' ? 'Waves: the intensity is |h₁ + h₂|².' : '');
        if (Math.floor(t * 4) !== Math.floor((t - dt) * 4)) updatePlot();
        // drawing
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / W0, st.H / H0), ox = (st.W - W0 * s) / 2, oy = (st.H - H0 * s) / 2;
        c.save(); c.translate(ox, oy); c.scale(s, s);
        const y1 = MID - V.d / 2, y2 = MID + V.d / 2, o1 = V.open !== '2', o2 = V.open !== '1';
        if (V.mode === 'w') {
          // the wave field between the wall and the screen: the heights of the two circular waves added
          const k = 2 * Math.PI / V.lam, w = 5, cw = 8;
          for (let x = WALL + 2; x < SCREEN; x += cw) for (let y = 0; y < H0; y += cw) {
            let h = 0;
            if (o1) { const r = Math.hypot(x - WALL, y - y1); h += Math.cos(k * r - w * t) / Math.sqrt(r / 30 + 1); }
            if (o2) { const r = Math.hypot(x - WALL, y - y2); h += Math.cos(k * r - w * t) / Math.sqrt(r / 30 + 1); }
            c.fillStyle = 'hsl(205 70% ' + (45 + 22 * Math.max(-1.6, Math.min(1.6, h))) + '%)'; c.fillRect(x, y, cw + 0.5, cw + 0.5);
          }
          for (let r = ((t * w / k) % V.lam); r < WALL - GUN; r += V.lam) { c.strokeStyle = 'hsl(205 70% 55% / .5)'; c.lineWidth = 2; c.beginPath(); c.arc(GUN, MID, r, -0.9, 0.9); c.stroke(); }
          // the intensity along the screen
          const top = Math.max(...P.p12, ...P.p1, ...P.p2), pick = V.open === '1' ? P.p1 : V.open === '2' ? P.p2 : P.p12;
          for (let i = 0; i < NY - 1; i++) { c.fillStyle = 'hsl(205 80% ' + (20 + 60 * pick[i] / top) + '%)'; c.fillRect(SCREEN, H0 * i / (NY - 1), 14, H0 / (NY - 1) + 0.5); }
        } else {
          // the plate: every arrival as a dot, recent ones as flashes
          c.fillStyle = C.surface2 || '#223'; c.fillRect(SCREEN, 0, 14, H0);
          c.fillStyle = C.text; for (let i = 0; i < hits.length; i++) { const y = hits[i]; c.fillRect(SCREEN + 2 + ((i * 7919) % 10), y - 0.6, 1.4, 1.4); }
          for (const f of flashes) {
            const a = 1 - f.t / 0.6; c.fillStyle = 'hsl(48 100% 60% / ' + a + ')'; c.beginPath(); c.arc(SCREEN + 7, f.y, 3 + 5 * a, 0, 6.283); c.fill();
            if (f.at) { c.fillStyle = 'hsl(48 100% 70% / ' + a + ')'; c.beginPath(); c.arc(WALL, f.at === 1 ? y1 : y2, 5 + 8 * a, 0, 6.283); c.fill(); }
          }
          // the counted histogram, drawn to the right of the plate
          const mx = Math.max(1, ...bins), bw = H0 / bins.length;
          c.fillStyle = 'hsl(22 85% 55% / .8)'; for (let i = 0; i < bins.length; i++) c.fillRect(SCREEN + 18, i * bw, 100 * bins[i] / mx, bw - 0.5);
        }
        // the gun, the wall with its slits, the light
        c.fillStyle = C.muted; c.fillRect(GUN - 28, MID - 10, 30, 20);
        c.fillStyle = C.text; c.font = '12px ' + (getComputedStyle(document.body).fontFamily || 'sans-serif'); c.textAlign = 'center';
        c.fillText(V.mode === 'b' ? 'gun' : V.mode === 'w' ? 'wave source' : 'electron gun', GUN - 12, MID + 28);
        c.fillStyle = C.faint;
        const gap = (yc, open) => open ? [yc - V.a / 2, yc + V.a / 2] : null;
        const g1 = gap(y1, o1), g2 = gap(y2, o2), segs = [[0, g1 ? g1[0] : y1], [g1 ? g1[1] : y1, g2 ? g2[0] : y2], [g2 ? g2[1] : y2, H0]];
        c.fillStyle = C.text; for (const [a, b] of segs) if (b > a) c.fillRect(WALL - 3, a, 6, b - a);
        c.fillText('1', WALL - 14, y1 + 4); c.fillText('2', WALL - 14, y2 + 4);
        if (V.mode === 'e' && V.watch) { c.fillStyle = 'hsl(48 100% 60% / ' + (0.25 + 0.5 * V.light) + ')'; c.beginPath(); c.arc(WALL + 22, MID, 9, 0, 6.283); c.fill(); c.fillStyle = C.muted; c.fillText('light', WALL + 22, MID + 24); }
        c.fillStyle = C.muted; c.fillText('screen', SCREEN + 7, H0 - 4); if (V.mode !== 'w') c.fillText('counted', SCREEN + 60, H0 - 4);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('ref-slit-arrows', {
    title: 'Adding the arrows',
    blurb: `The rule behind the fringes, drawn. An electron (or a photon) can reach the chosen point of the screen by two ways: through slit 1 or through slit 2. Imagine a stopwatch whose hand turns once for every wavelength travelled. When the particle arrives, each way leaves its hand pointing somewhere — that direction is the arrow, the [[?amplitude|probability amplitude]]. Put the two arrows head to tail: the square of the length of the total is the [[?probability]] of arriving there.

**Try this**
- Press *Send* to watch the two hands turn along the paths and the arrows being added.
- Move the point along the screen: when the paths differ by a whole number of wavelengths the arrows line up (a bright fringe); at half a wavelength more they point opposite ways and cancel (a dark fringe).
- Compare |φ₁ + φ₂|² with P₁ + P₂, what you would get by adding the probabilities instead of the arrows: the average is the same, but the arrows make the stripes.
- Change the wavelength: the hands turn faster for short wavelengths, and the fringes crowd together.`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'y', label: 'Point on the screen (from the centre)', min: -160, max: 160, step: 1, value: 0, unit: 'px' },
        { id: 'lam', label: 'Wavelength', min: 8, max: 40, step: 1, value: 20, unit: 'px' },
        { id: 'd', label: 'Distance between the slits', min: 30, max: 160, step: 2, value: 90, unit: 'px' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send', primary: true }, { id: 'scan', label: 'Scan the screen' }] }
      ], id => { if (id === 'send') { travel = 0; } if (id === 'scan') scan = -160; if (id === 'd' || id === 'lam') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Paths through slit 1 / slit 2'], ['dl', 'Path difference'], ['ph', 'Angle between the arrows'], ['p', '|φ₁ + φ₂|² (P₁ + P₂ = 2)']]);
      const plot = kit.plot(gb, { x: { label: 'point on the screen (px from the centre)', min: -160, max: 160 }, y: { label: 'probability (relative)', min: 0, max: 4.2 }, legend: true }, 160);
      const Lw = 300, X0 = 60, XS = X0 + Lw;
      let travel = null, scan = null;
      const geom = y => { const r1 = Math.hypot(Lw, y - (-V.d / 2)), r2 = Math.hypot(Lw, y - V.d / 2); return { r1, r2 }; };
      function curve() {
        const pts = [], sum = [];
        for (let y = -160; y <= 160; y += 1) { const g = geom(y), a = Q.add(Q.expi(2 * Math.PI * g.r1 / V.lam), Q.expi(2 * Math.PI * g.r2 / V.lam)); pts.push([y, Q.abs2(a)]); sum.push([y, 2]); }
        plot.set({ series: [{ pts, label: '|φ₁ + φ₂|²' }, { pts: sum, label: 'P₁ + P₂', dash: [5, 4] }] });
      }
      curve();
      const loop = kit.loop(dt => {
        if (scan != null) { scan += 60 * dt; ctl.set('y', Math.round(scan)); if (scan >= 160) scan = null; }
        const g = geom(V.y), f = travel == null ? 1 : Math.min(1, travel);
        if (travel != null) { travel += dt / 2.5; if (travel >= 1.3) travel = null; }
        const th1 = 2 * Math.PI * g.r1 * f / V.lam, th2 = 2 * Math.PI * g.r2 * f / V.lam;
        const z1 = Q.expi(th1), z2 = Q.expi(th2), tot = Q.add(z1, z2), P = Q.abs2(tot);
        let dph = ((th2 - th1) * 180 / Math.PI) % 360; if (dph < 0) dph += 360;
        ro.set('r', g.r1.toFixed(1) + ' / ' + g.r2.toFixed(1) + ' px');
        ro.set('dl', (g.r2 - g.r1).toFixed(1) + ' px = ' + ((g.r2 - g.r1) / V.lam).toFixed(2) + ' wavelengths');
        ro.set('ph', dph.toFixed(0) + '°'); ro.set('p', (f < 1 ? '…' : P.toFixed(2)));
        plot.set({ marks: [{ x: V.y, y: f < 1 ? 0 : P, label: 'here' }] });
        const c = st.begin(), C = kit.colors(), W = 640, Hh = 320, s = Math.min(st.W / W, st.H / Hh), ox = (st.W - W * s) / 2, oy = (st.H - Hh * s) / 2, cy = Hh / 2;
        c.save(); c.translate(ox, oy); c.scale(s, s);
        c.font = '12px ' + (getComputedStyle(document.body).fontFamily || 'sans-serif');
        // wall and screen
        c.fillStyle = C.text; c.fillRect(X0 - 3, 0, 6, cy - V.d / 2 - 5); c.fillRect(X0 - 3, cy - V.d / 2 + 5, 6, V.d - 10); c.fillRect(X0 - 3, cy + V.d / 2 + 5, 6, Hh - cy - V.d / 2 - 5);
        c.fillStyle = C.faint; c.fillRect(XS, 0, 4, Hh);
        const py = cy + V.y, colors = ['hsl(210 85% 58%)', 'hsl(22 90% 56%)'];
        [[cy - V.d / 2, f, z1], [cy + V.d / 2, f, z2]].forEach(([sy, ff], i) => {
          c.strokeStyle = colors[i]; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X0, sy); c.lineTo(XS, py); c.stroke(); c.setLineDash([]);
          const px = X0 + (XS - X0) * ff, pyy = sy + (py - sy) * ff, th = i ? th2 : th1;
          // the stopwatch travelling with the particle
          c.strokeStyle = colors[i]; c.fillStyle = C.surface || '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(px, pyy, 13, 0, 6.283); c.fill(); c.stroke();
          c.lineWidth = 2.4; c.beginPath(); c.moveTo(px, pyy); c.lineTo(px + 11 * Math.cos(-th), pyy + 11 * Math.sin(-th)); c.stroke();
        });
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText('slit 1', X0 - 28, cy - V.d / 2 + 4); c.fillText('slit 2', X0 - 28, cy + V.d / 2 + 4);
        // the arrows added head to tail, in a box at the right
        const bx = 520, by = cy, u = 38;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(bx - 100, by - 100, 200, 200);
        c.fillStyle = C.muted; c.fillText('adding the arrows', bx, by - 106);
        const arrow = (x0, y0, x1, y1, col, w) => { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); const a = Math.atan2(y1 - y0, x1 - x0); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - 9 * Math.cos(a - 0.4), y1 - 9 * Math.sin(a - 0.4)); c.lineTo(x1 - 9 * Math.cos(a + 0.4), y1 - 9 * Math.sin(a + 0.4)); c.closePath(); c.fill(); };
        if (f >= 1) {
          const ax = bx + u * z1.re, ay = by - u * z1.im, tx = ax + u * z2.re, ty = ay - u * z2.im;
          arrow(bx, by, ax, ay, colors[0], 2.4); arrow(ax, ay, tx, ty, colors[1], 2.4); arrow(bx, by, tx, ty, C.text, 3.2);
          c.fillStyle = C.text; c.fillText('length² = ' + P.toFixed(2), bx, by + 92);
        } else { c.fillStyle = C.muted; c.fillText('on the way…', bx, by); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
