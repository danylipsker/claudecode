/* HYPER-FEYNMAN · sims/qed.js — QED: photons, arrows, electrons and diagrams.
 *   qed-clicks     a dim lamp, a block of glass and two photomultipliers: light arrives in whole photons, 4 % reflected
 *   qed-stopwatch  the arrow rule: a stopwatch rides along each path; the arrows are added head to tail at the detector
 *   (more below: glass sheet, mirror, grating, lens, basic actions, diagrams, g − 2, renormalization, beyond QED)
 * Every stopwatch hand starts at twelve o'clock and turns clockwise, once per wavelength travelled; the arrow of a
 * path points where its hand points on arrival (angle θ = π/2 − 2πL/λ, drawn as (cos θ, −sin θ) on the canvas).
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fam = () => { try { return getComputedStyle(document.body).fontFamily || 'sans-serif'; } catch (e) { return 'sans-serif'; } };

  // fit a logical W0 × H0 drawing into the stage; F keeps the transform for pointer hit tests
  function fit(c, st, W0, H0, F) {
    const s = Math.min(st.W / W0, st.H / H0), ox = (st.W - W0 * s) / 2, oy = (st.H - H0 * s) / 2;
    c.save(); c.translate(ox, oy); c.scale(s, s);
    if (F) { F.s = s; F.ox = ox; F.oy = oy; }
    return s;
  }
  const toL = (F, p) => ({ x: (p.x - F.ox) / (F.s || 1), y: (p.y - F.oy) / (F.s || 1) });
  function txt(c, s, x, y, col, px, align, base, weight) {
    c.font = (weight || 500) + ' ' + (px || 12) + 'px ' + fam();
    c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = base || 'middle';
    c.fillText(s, x, y);
  }
  function arw(c, x0, y0, x1, y1, col, w) {
    const L = Math.hypot(x1 - x0, y1 - y0); if (!(L > 0.3)) return;
    const a = Math.atan2(y1 - y0, x1 - x0), h = Math.min(L * 0.6, 4 + 2.5 * (w || 2));
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - 0.7 * h * Math.cos(a), y1 - 0.7 * h * Math.sin(a)); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - h * Math.cos(a - 0.42), y1 - h * Math.sin(a - 0.42)); c.lineTo(x1 - h * Math.cos(a + 0.42), y1 - h * Math.sin(a + 0.42)); c.closePath(); c.fill();
  }
  // a stopwatch: dial, crown and one hand at angle th (canvas direction (cos th, −sin th)); len scales the hand
  function watch(c, x, y, r, th, col, C, len) {
    c.fillStyle = C.surface || '#fff'; c.strokeStyle = col; c.lineWidth = 1.6;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = col; c.fillRect(x - 2, y - r - 4, 4, 4);
    c.strokeStyle = C.faint; c.lineWidth = 1;
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; c.beginPath(); c.moveTo(x + 0.78 * r * Math.cos(a), y + 0.78 * r * Math.sin(a)); c.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); c.stroke(); }
    const L = 0.85 * r * (len == null ? 1 : len);
    c.strokeStyle = col; c.lineWidth = 2.2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + L * Math.cos(th), y - L * Math.sin(th)); c.stroke();
    c.fillStyle = col; c.beginPath(); c.arc(x, y, 1.8, 0, TAU); c.fill();
  }
  // the colour of light of a wavelength in nm
  function lamHue(nm) {
    const P = [[380, 275], [440, 240], [480, 200], [510, 140], [560, 70], [590, 45], [620, 18], [700, 0], [800, 0]];
    for (let i = 1; i < P.length; i++) if (nm <= P[i][0]) { const f = (nm - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return P[i - 1][1] + f * (P[i][1] - P[i - 1][1]); }
    return 0;
  }
  const lamCol = (nm, a, L) => 'hsl(' + lamHue(nm).toFixed(0) + ' 90% ' + (L || 55) + '%' + (a != null ? ' / ' + a : '') + ')';
  // the angle of a stopwatch hand after a path of length L (same units as lam)
  const hand = (L, lam) => Math.PI / 2 - TAU * L / lam;
  const PATHCOL = ['hsl(210 85% 58%)', 'hsl(22 90% 56%)', 'hsl(150 65% 45%)', 'hsl(330 75% 60%)', 'hsl(265 70% 64%)'];

  /* ================================================================ qed-clicks */
  Hyper.sim('qed-clicks', {
    title: 'Light comes in clicks',
    blurb: `A very dim lamp shines on a block of glass. Photomultiplier **A** catches light reflected from the surface; **B**, inside the glass, catches light that goes in. Each photon is drawn as a dot; when it arrives, its detector clicks. (The paths are drawn slanted so they can be seen; the probabilities are those for light falling straight on the surface.) The graph shows the fraction of photons found at A as the count grows, with the band of likely values, $p \\pm \\sigma/N$ with $\\sigma = \\sqrt{Np(1-p)}$ (one [[?standard-deviation]]).

**Try this**
- Send photons one at a time. Each goes whole to A or whole to B — never both, never half. Which one? No way to tell in advance.
- Turn the brightness up. The clicks come faster but stay the same size; at thousands a second the dots merge into what looks like a steady beam.
- Watch the fraction at A: it wanders early on, then settles near 4 % for glass. The band narrows as $1/\\sqrt N$.
- Change the colour: each photon carries a different energy, but the fraction reflected hardly changes. Try water (2 %) and diamond (17 %).
- Tick *Click sound* to hear the photomultipliers.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1985), W0 = 640, H0 = 340, F = {};
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Brightness (photons per second)', min: 0.3, max: 3000, value: 3, log: true, sig: 2 },
        { id: 'col', type: 'select', label: 'Colour', options: [['Red, 650 nm', 650], ['Green, 530 nm', 530], ['Blue, 450 nm', 450]], value: 530 },
        { id: 'n', type: 'select', label: 'The block is', options: [['water (n = 1.33)', 1.33], ['glass (n = 1.5)', 1.5], ['diamond (n = 2.42)', 2.42]], value: 1.5 },
        { id: 'sound', type: 'check', label: 'Click sound', value: false },
        { type: 'buttons', items: [{ id: 'one', label: 'Send one photon', primary: true }, { id: 'clear', label: 'Clear the counts' }] }
      ], id => { if (id === 'one') emit(); if (id === 'clear' || id === 'n') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sent', 'Photons sent'], ['A', 'Clicks at A (reflected)'], ['B', 'Clicks at B (inside)'], ['f', 'Fraction at A'], ['Rx', 'Expected ((n − 1)/(n + 1))²'], ['E', 'Energy of each photon']]);
      const plot = kit.plot(gb, { x: { label: 'photons detected', min: 1, log: true }, y: { label: 'fraction found at A (%)', min: 0 }, legend: true }, 170);
      const LAMP = { x: 70, y: 70 }, HIT = { x: 300, y: 210 }, A = { x: 530, y: 70 }, SURF = 210;
      let B = { x: 360, y: 300 }, fl = [], flashes = [], nA = 0, nB = 0, sent = 0, pts = [], nextMark = 1, clock = 0, nextT = 0, audio = null, lastSnd = 0;
      const Rx = () => Math.pow((V.n - 1) / (V.n + 1), 2);
      function placeB() {
        const dx = HIT.x - LAMP.x, dy = HIT.y - LAMP.y, s1 = dx / Math.hypot(dx, dy), s2 = s1 / V.n, c2 = Math.sqrt(1 - s2 * s2);
        B = { x: HIT.x + 105 * s2, y: HIT.y + 105 * c2 };
      }
      function reset() { placeB(); fl = []; flashes = []; nA = 0; nB = 0; sent = 0; pts = []; nextMark = 1; updPlot(); }
      function click(hi) {
        if (!V.sound || clock - lastSnd < 0.03) return;
        lastSnd = clock;
        try {
          if (!audio) { const AC = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null; if (!AC) return; audio = new AC(); }
          const t0 = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
          o.type = 'square'; o.frequency.value = hi ? 1700 : 1100;
          g.gain.setValueAtTime(0.06, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
          o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + 0.04);
        } catch (e) { audio = null; }
      }
      function emit() { sent++; fl.push({ t: 0, refl: R() < Rx(), nm: V.col }); if (fl.length > 2500) fl.splice(0, fl.length - 2500); }
      function arrive(p) {
        if (p.refl) nA++; else nB++;
        const N = nA + nB;
        if (N >= nextMark) { pts.push([N, 100 * nA / N]); nextMark = Math.max(nextMark + 1, Math.ceil(nextMark * 1.08)); if (pts.length > 400) pts.shift(); }
        if (flashes.length < 60) flashes.push({ at: p.refl ? 'A' : 'B', t: 0, nm: p.nm });
        click(p.refl);
      }
      function updPlot() {
        const r = Rx(), N = Math.max(10, nA + nB), band = [], lo = [];
        for (let i = 0; i <= 60; i++) { const n = Math.pow(N, i / 60), s = Math.sqrt(r * (1 - r) / n); band.push([n, 100 * (r + s)]); lo.push([n, Math.max(0, 100 * (r - s))]); }
        plot.set({ x: { label: 'photons detected', min: 1, max: N, log: true }, y: { label: 'fraction found at A (%)', min: 0, max: Math.max(8, 100 * r * 2.6) },
          series: [{ pts: band, label: 'p + σ/N', dash: [4, 3], width: 1.2 }, { pts: lo, label: 'p − σ/N', dash: [4, 3], width: 1.2 }, { pts: pts.length ? pts : [[1, 100 * r]], label: 'measured', width: 2 }],
          hlines: [{ y: 100 * r, label: 'expected ' + (100 * r).toFixed(1) + ' %' }] });
      }
      reset();
      const T1 = 0.8, T2A = 0.8, T2B = 0.45;
      const loop = kit.loop(dt => {
        clock += dt;
        // photons leave the lamp at random moments (a Poisson stream)
        let k = 0;
        if (nextT < clock - 1) nextT = clock;
        while (nextT <= clock && k < 200) { emit(); nextT += -Math.log(Math.max(1e-9, R())) / V.rate; k++; }
        for (const p of fl) { p.t += dt; if (!p.done && p.t >= T1 + (p.refl ? T2A : T2B)) { p.done = true; arrive(p); } }
        fl = fl.filter(p => !p.done);
        for (const f of flashes) f.t += dt; flashes = flashes.filter(f => f.t < 0.5);
        if (Math.floor(clock * 3) !== Math.floor((clock - dt) * 3)) updPlot();
        const N = nA + nB, r = Rx();
        ro.set('sent', String(sent)); ro.set('A', String(nA)); ro.set('B', String(nB));
        ro.set('f', N ? (100 * nA / N).toFixed(2) + ' % ± ' + (100 * Math.sqrt(r * (1 - r) / N)).toFixed(2) + ' %' : '—');
        ro.set('Rx', (100 * r).toFixed(2) + ' %');
        ro.set('E', (1239.84 / V.col).toFixed(2) + ' eV (' + V.col + ' nm)');
        // drawing
        const c = st.begin(), C = kit.colors();
        fit(c, st, W0, H0, F);
        // the block
        c.fillStyle = 'hsl(195 60% 60% / 0.16)'; c.fillRect(140, SURF, 490, H0 - SURF);
        c.strokeStyle = 'hsl(195 50% 60% / 0.8)'; c.lineWidth = 2; c.beginPath(); c.moveTo(140, SURF); c.lineTo(630, SURF); c.stroke();
        txt(c, V.n === 1.33 ? 'water' : V.n === 2.42 ? 'diamond' : 'glass', 620, SURF + 16, C.muted, 12, 'right');
        // light paths
        c.setLineDash([3, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(LAMP.x, LAMP.y); c.lineTo(HIT.x, HIT.y); c.lineTo(A.x, A.y); c.moveTo(HIT.x, HIT.y); c.lineTo(B.x, B.y); c.stroke(); c.setLineDash([]);
        // a steady-looking beam when photons are many
        const beam = clamp(Math.log10(V.rate / 30) / 2, 0, 1);
        if (beam > 0) {
          c.strokeStyle = lamCol(V.col, 0.5 * beam); c.lineWidth = 5;
          c.beginPath(); c.moveTo(LAMP.x, LAMP.y); c.lineTo(HIT.x, HIT.y); c.lineTo(B.x, B.y); c.stroke();
          c.strokeStyle = lamCol(V.col, 0.5 * beam * Math.sqrt(r)); c.beginPath(); c.moveTo(HIT.x, HIT.y); c.lineTo(A.x, A.y); c.stroke();
        }
        // photons in flight
        const draw = fl.length > 600 ? 600 : fl.length;
        for (let i = 0; i < draw; i++) {
          const p = fl[fl.length - 1 - i];
          let x, y;
          if (p.t < T1) { const f = p.t / T1; x = LAMP.x + (HIT.x - LAMP.x) * f; y = LAMP.y + (HIT.y - LAMP.y) * f; }
          else { const E2 = p.refl ? A : B, f = clamp((p.t - T1) / (p.refl ? T2A : T2B), 0, 1); x = HIT.x + (E2.x - HIT.x) * f; y = HIT.y + (E2.y - HIT.y) * f; }
          c.fillStyle = lamCol(p.nm, 0.35); c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();
          c.fillStyle = lamCol(p.nm, 1, 62); c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill();
        }
        // the lamp
        const glow = 0.25 + 0.6 * clamp((Math.log10(V.rate) + 0.6) / 4, 0, 1);
        c.fillStyle = lamCol(V.col, glow * 0.5); c.beginPath(); c.arc(LAMP.x, LAMP.y, 22, 0, TAU); c.fill();
        c.fillStyle = lamCol(V.col, 1, 60); c.beginPath(); c.arc(LAMP.x, LAMP.y, 9, 0, TAU); c.fill();
        c.fillStyle = C.muted; c.fillRect(LAMP.x - 6, LAMP.y - 30, 12, 8);
        txt(c, 'dim lamp', LAMP.x, LAMP.y + 34, C.muted, 12, 'center');
        // the photomultipliers, turned towards the spot on the surface
        const tube = (P, name, count) => {
          const a = Math.atan2(HIT.y - P.y, HIT.x - P.x);
          c.save(); c.translate(P.x, P.y); c.rotate(a);
          c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.text2 || C.text; c.lineWidth = 1.4;
          c.beginPath(); c.rect(-34, -12, 40, 24); c.fill(); c.stroke();
          c.fillStyle = 'hsl(48 90% 60% / 0.7)'; c.fillRect(4, -10, 4, 20);
          c.restore();
          txt(c, name, P.x + (name === 'A' ? 30 : 30), P.y - (name === 'A' ? 16 : 0), C.text, 15, 'left', 'middle', 700);
          txt(c, count + (count === 1 ? ' click' : ' clicks'), P.x + 30, P.y + (name === 'A' ? 4 : 18), C.muted, 12);
        };
        tube(A, 'A', nA); tube(B, 'B', nB);
        for (const f of flashes) {
          const P = f.at === 'A' ? A : B, a = 1 - f.t / 0.5;
          c.strokeStyle = 'hsl(48 100% 60% / ' + a.toFixed(3) + ')'; c.lineWidth = 3; c.beginPath(); c.arc(P.x, P.y, 8 + 26 * (1 - a), 0, TAU); c.stroke();
          txt(c, 'click', P.x - 20, P.y - 26 - 20 * (1 - a), 'hsl(48 100% 55% / ' + a.toFixed(3) + ')', 13, 'center', 'middle', 700);
        }
        txt(c, 'every click is one whole photon', 20, H0 - 14, C.muted, 12);
        c.restore();
      }, box.stage);
      loop.start();
      return () => { try { if (audio && audio.close) audio.close(); } catch (e) { /* ignore */ } };
    }
  });

  /* ================================================================ qed-stopwatch */
  Hyper.sim('qed-stopwatch', {
    title: 'A stopwatch for every path',
    blurb: `A photon can go from the source **S** to the detector **D** by several paths (drag the round handles to change them). Each path is drawn as a ruler of wavelengths: one dash and one gap is one wavelength, one full turn of the stopwatch hand. Press *Send a photon*: a stopwatch rides along every path, and when each arrives, the direction of its hand becomes that path's arrow. At the right the arrows are laid head to tail in the order they arrive; the final arrow (black) squared is the [[?probability]]. The graph shows how the probability changes as path 1 is moved up and down.

**Try this**
- With two paths, press *Make the paths equal*: the hands arrive pointing the same way and the arrows line up — the largest possible probability, four times one path alone.
- Drag path 1 until its arrow points opposite to path 2's: the final arrow vanishes. The photon cannot reach D, although each path alone would take it there.
- Use five paths and scatter the handles: the arrows point every which way and mostly cancel.
- Put a grey filter or a bounce off glass on path 1: its arrow **shrinks and turns** — the multiplication rule for steps in sequence.
- Make the wavelength shorter: small moves of a handle now turn the arrows a lot.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340, F = {}, S = { x: 40, y: 170 }, D = { x: 392, y: 170 };
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const wp = [{ x: 215, y: 75 }, { x: 215, y: 262 }, { x: 150, y: 32 }, { x: 292, y: 312 }, { x: 215, y: 170 }];
      let travel = null;
      const ctl = kit.controls(box.side, [
        { id: 'np', label: 'Number of paths', min: 1, max: 5, step: 1, value: 2 },
        { id: 'lam', label: 'Wavelength (drawn enlarged)', min: 10, max: 60, step: 1, value: 24, unit: 'px' },
        { id: 'mod', type: 'select', label: 'On path 1', options: [['nothing in the way', 'none'], ['a grey filter: arrow × 0.5', 'filter'], ['a bounce off glass: × 0.2, half a turn', 'glass']], value: 'none' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a photon', primary: true }, { id: 'equal', label: 'Make the paths equal' }] }
      ], id => { if (id === 'send') travel = 0; if (id === 'equal') equalize(); updPlot(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Paths (in wavelengths)'], ['fin', 'Final arrow (one path = 1)'], ['P', 'Probability ∝ length²'], ['rel', 'Compared with all arrows in line']]);
      const plot = kit.plot(gb, { x: { label: 'height of path 1\'s handle (px, top = 0)', min: 0, max: H0 }, y: { label: 'final arrow² ÷ (all in line)²', min: 0, max: 1.05 } }, 150);
      const len = (p, q) => Math.hypot(q.x - p.x, q.y - p.y);
      const pathL = k => len(S, wp[k]) + len(wp[k], D);
      const amp = k => k === 0 ? (V.mod === 'filter' ? 0.5 : V.mod === 'glass' ? 0.2 : 1) : 1;
      const turn = k => k === 0 && V.mod === 'glass' ? Math.PI : 0;
      const arrowOf = (k, L) => { const th = hand(L, V.lam) + turn(k); return { x: amp(k) * Math.cos(th), y: amp(k) * Math.sin(th), th }; };
      function sumAt(yFirst) {
        let x = 0, y = 0, tot = 0;
        for (let k = 0; k < V.np; k++) {
          const L = k === 0 ? len(S, { x: wp[0].x, y: yFirst }) + len({ x: wp[0].x, y: yFirst }, D) : pathL(k);
          const a = arrowOf(k, L); x += a.x; y += a.y; tot += amp(k);
        }
        return (x * x + y * y) / Math.max(1e-9, tot * tot);
      }
      function updPlot() {
        const pts = [];
        for (let y = 4; y <= H0 - 4; y += 1) pts.push([y, sumAt(y)]);
        plot.set({ series: [{ pts, label: 'probability as path 1 moves' }], marks: [{ x: wp[0].y, y: sumAt(wp[0].y), label: 'now' }] });
      }
      // move every handle onto the ellipse of the same total length as path 1 (same side of the axis)
      function equalize() {
        const L1 = pathL(0);
        for (let k = 1; k < 5; k++) {
          const side = wp[k].y >= S.y ? 1 : -1, x = wp[k].x;
          let lo = 0, hi = 400;
          if (len(S, { x, y: S.y }) + len({ x, y: S.y }, D) >= L1) { wp[k].y = S.y; continue; }
          for (let it = 0; it < 60; it++) { const m = (lo + hi) / 2, p = { x, y: S.y + side * m }; if (len(S, p) + len(p, D) < L1) lo = m; else hi = m; }
          wp[k].y = clamp(S.y + side * lo, 8, H0 - 8);
        }
      }
      kit.drag(st, {
        hit(p) { const q = toL(F, p); for (let k = 0; k < V.np; k++) if (Math.hypot(q.x - wp[k].x, q.y - wp[k].y) < 16) return k; return null; },
        move(k, p) { const q = toL(F, p); wp[k].x = clamp(q.x, 80, 360); wp[k].y = clamp(q.y, 8, H0 - 8); updPlot(); },
        hover: true
      });
      updPlot();
      const SPEED = 170;
      const loop = kit.loop(dt => {
        if (travel != null) { travel += dt; let far = 0; for (let k = 0; k < V.np; k++) far = Math.max(far, pathL(k)); if (travel > far / SPEED + 1.2) travel = null; }
        const C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        // the paths, as rulers of wavelengths
        const arrived = [];
        for (let k = 0; k < V.np; k++) {
          const col = PATHCOL[k], L = pathL(k);
          c.strokeStyle = col; c.lineWidth = 2.2; c.setLineDash([V.lam / 2, V.lam / 2]);
          c.beginPath(); c.moveTo(S.x, S.y); c.lineTo(wp[k].x, wp[k].y); c.lineTo(D.x, D.y); c.stroke(); c.setLineDash([]);
          if (k === 0 && V.mod !== 'none') {
            c.fillStyle = V.mod === 'glass' ? 'hsl(195 60% 60% / 0.55)' : 'hsl(0 0% 50% / 0.6)';
            c.fillRect(wp[0].x - 4, wp[0].y - 14, 8, 28);
          }
          const s = travel == null ? null : travel * SPEED;
          if (s == null) {
            const a = arrowOf(k, L);
            watch(c, wp[k].x, wp[k].y, 13, a.th, col, C, amp(k));
            txt(c, (L / V.lam).toFixed(2), wp[k].x + 18, wp[k].y - 12, col, 11.5, 'left', 'middle', 600);
          } else {
            const L1 = len(S, wp[k]), ss = Math.min(s, L);
            const P = ss < L1 ? { x: S.x + (wp[k].x - S.x) * ss / L1, y: S.y + (wp[k].y - S.y) * ss / L1 } : { x: wp[k].x + (D.x - wp[k].x) * (ss - L1) / Math.max(1e-9, L - L1), y: wp[k].y + (D.y - wp[k].y) * (ss - L1) / Math.max(1e-9, L - L1) };
            const past = ss >= L1;
            watch(c, P.x, P.y, 13, hand(ss, V.lam) + (past ? turn(k) : 0), col, C, past ? amp(k) : 1);
            c.fillStyle = C.muted; c.beginPath(); c.arc(wp[k].x, wp[k].y, 4, 0, TAU); c.fill();
            if (s >= L) arrived.push({ k, at: L / SPEED });
          }
        }
        if (travel == null) for (let k = 0; k < V.np; k++) arrived.push({ k, at: pathL(k) });
        arrived.sort((a, b) => a.at - b.at);
        // source and detector
        c.fillStyle = 'hsl(48 95% 55%)'; c.beginPath(); c.arc(S.x, S.y, 9, 0, TAU); c.fill(); txt(c, 'S', S.x, S.y + 22, C.text, 13, 'center', 'middle', 700);
        c.fillStyle = C.text; c.fillRect(D.x - 5, D.y - 12, 10, 24); txt(c, 'D', D.x, D.y + 26, C.text, 13, 'center', 'middle', 700);
        // the arrows, head to tail
        const bx = 530, by = 170;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(430, 20, 200, 300);
        txt(c, 'arrows at D, head to tail', bx, 34, C.muted, 12, 'center');
        let tot = 0; for (let k = 0; k < V.np; k++) tot += amp(k);
        const u = 88 / Math.max(0.2, tot);
        c.strokeStyle = C.faint; c.setLineDash([2, 4]); c.beginPath(); c.arc(bx, by, u * tot, 0, TAU); c.stroke(); c.setLineDash([]);
        let x = bx, y = by;
        for (const a of arrived) { const z = arrowOf(a.k, pathL(a.k)); const nx = x + u * z.x, ny = y - u * z.y; arw(c, x, y, nx, ny, PATHCOL[a.k], 2.6); x = nx; y = ny; }
        const fx = x - bx, fy = y - by, finLen = Math.hypot(fx, fy) / u;
        if (arrived.length === V.np) arw(c, bx, by, x, y, C.text, 3.4);
        c.fillStyle = C.text; c.beginPath(); c.arc(bx, by, 2.5, 0, TAU); c.fill();
        txt(c, arrived.length === V.np ? 'final arrow² = ' + (finLen * finLen).toFixed(2) : 'on the way…', bx, 306, C.text, 12.5, 'center');
        c.restore();
        const Ls = []; for (let k = 0; k < V.np; k++) Ls.push((pathL(k) / V.lam).toFixed(2));
        ro.set('L', Ls.join(' · '));
        ro.set('fin', arrived.length === V.np ? finLen.toFixed(3) : '…');
        ro.set('P', arrived.length === V.np ? (finLen * finLen).toFixed(3) : '…');
        ro.set('rel', arrived.length === V.np ? (100 * finLen * finLen / (tot * tot)).toFixed(1) + ' %' : '…');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-glass */
  Hyper.sim('qed-glass', {
    title: 'Two surfaces, two arrows',
    blurb: `Light from **S** reaches the detector **A** by reflecting from the front surface of a thin sheet of glass or from its back surface. The front arrow (orange) is **reversed**; the back arrow (blue) is turned by the extra round trip through the glass, $\\delta = 4\\pi n d/\\lambda$ (inside the glass the wavelength is shorter, so the ruler of wavelengths is finer there). Their sum (black) squared is QED's answer; the green chain adds every further bounce inside the glass — the exact thin-film result. The graph shows both against thickness; A's clicks come at a rate proportional to the reflection. (The paths are drawn slanted and the sheet enlarged; the numbers are for light falling straight on.)

**Try this**
- Start at 0 nm: the two arrows cancel exactly and the sheet reflects nothing.
- Press *Sweep the thickness*: the back arrow turns round and round, and the reflection cycles between 0 and 16 % every λ/2n (200 nm for 600 nm light).
- At 100 nm the arrows line up: 16 % in QED's picture, 14.8 % exactly. The tiny green arrows from repeated bounces make the difference.
- Change the colour at a fixed thickness: blue and red are reflected differently — the colours of soap bubbles.
- Raise the refractive index: longer arrows, and a faster rhythm.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(7), W0 = 640, H0 = 330, F = {};
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let travel = null, sweep = null, flashes = [], clock = 0, counted = 0, hits = 0;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Thickness of the sheet', min: 0, max: 1200, step: 2, value: 100, unit: 'nm' },
        { id: 'lam', label: 'Wavelength', min: 400, max: 700, step: 5, value: 600, unit: 'nm' },
        { id: 'n', label: 'Refractive index', min: 1.2, max: 2.4, step: 0.01, value: 1.5 },
        { id: 'exact', type: 'check', label: 'Add the arrows of every bounce inside (exact)', value: true },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a photon', primary: true }, { id: 'sweep', label: 'Sweep the thickness' }] }
      ], id => { if (id === 'send') travel = 0; if (id === 'sweep') sweep = 0; if (id !== 'send') { updPlot(); counted = 0; hits = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dl', 'Extra turn of the back arrow'], ['P2', 'Reflected: two arrows'], ['Pe', 'Reflected: exact'], ['per', 'Cycle repeats every'], ['cl', 'Clicks at A (of photons sent)']]);
      const plot = kit.plot(gb, { x: { label: 'thickness of the sheet (nm)', min: 0, max: 1200 }, y: { label: 'reflected (%)', min: 0, max: 20 }, legend: true }, 170);
      function updPlot() {
        const a = [], b = [], o = { n: V.n, lambda: V.lam * 1e-9 };
        for (let i = 0; i <= 480; i++) { const d = 1200 * i / 480; o.d = d * 1e-9; a.push([d, 100 * Q.glassSimple(o)]); b.push([d, 100 * Q.glassExact(o)]); }
        const top = 100 * 4 * Math.pow((V.n - 1) / (V.n + 1), 2);
        plot.set({ y: { label: 'reflected (%)', min: 0, max: Math.max(5, top * 1.15) }, series: [{ pts: a, label: 'QED\'s two arrows' }, { pts: b, label: 'exact (all bounces)', dash: [5, 4] }],
          marks: [{ x: V.d, y: 100 * Q.glassSimple({ n: V.n, d: V.d * 1e-9, lambda: V.lam * 1e-9 }), label: 'this sheet' }] });
      }
      updPlot();
      const S = { x: 40, y: 40 }, A = { x: 340, y: 40 }, FR = { x: 190, y: 150 };
      const loop = kit.loop(dt => {
        clock += dt;
        if (sweep != null) { sweep += dt; ctl.set('d', Math.min(1200, Math.round(sweep * 100 / 2) * 2)); if (sweep * 100 >= 1200) sweep = null; updPlot(); }
        if (travel != null) { travel += dt / 3; if (travel > 1.35) travel = null; }
        const r = (V.n - 1) / (V.n + 1), del = 4 * Math.PI * V.n * V.d / V.lam;
        const P2 = Q.glassSimple({ n: V.n, d: V.d, lambda: V.lam }), Pe = Q.glassExact({ n: V.n, d: V.d, lambda: V.lam });
        // clicks at A: 40 photons a second, each reflected with the exact probability
        if (R() < 40 * dt) { counted++; if (R() < Pe) { hits++; flashes.push({ t: 0 }); } }
        for (const f of flashes) f.t += dt; flashes = flashes.filter(f => f.t < 0.5);
        const c = st.begin(), C = kit.colors(), beam = lamCol(V.lam, 0.9);
        fit(c, st, W0, H0, F);
        // the sheet, thickness drawn enlarged
        const tp = 6 + 110 * V.d / 1200, back = FR.y + tp;
        c.fillStyle = 'hsl(195 60% 60% / 0.2)'; c.fillRect(20, FR.y, 350, tp);
        c.strokeStyle = 'hsl(195 50% 60% / 0.9)'; c.lineWidth = 1.5; c.strokeRect(20, FR.y, 350, tp);
        txt(c, 'front surface', 24, FR.y - 8, C.muted, 11); txt(c, 'back surface', 24, back + 10, C.muted, 11);
        txt(c, V.d.toFixed(0) + ' nm (drawn enlarged)', 366, FR.y + tp / 2, C.muted, 11, 'right');
        // the two paths
        const s1 = Math.sin(Math.atan2(FR.x - S.x, FR.y - S.y)), s2 = s1 / V.n, t2 = s2 / Math.sqrt(1 - s2 * s2);
        const E1 = { x: FR.x - tp * t2, y: FR.y }, BK = { x: FR.x, y: back }, E2 = { x: FR.x + tp * t2, y: FR.y };
        c.lineWidth = 2; c.strokeStyle = 'hsl(22 90% 56%)'; c.setLineDash([]);
        c.beginPath(); c.moveTo(S.x, S.y); c.lineTo(FR.x, FR.y); c.lineTo(A.x, A.y); c.stroke();
        c.strokeStyle = 'hsl(210 85% 58%)'; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(S.x, S.y); c.lineTo(E1.x, E1.y); c.lineTo(BK.x, BK.y); c.lineTo(E2.x, E2.y); c.lineTo(A.x, A.y); c.stroke(); c.setLineDash([]);
        c.fillStyle = beam; c.beginPath(); c.arc(S.x, S.y, 8, 0, TAU); c.fill(); txt(c, 'S', S.x, S.y - 16, C.text, 13, 'center', 'middle', 700);
        c.fillStyle = C.text; c.fillRect(A.x - 6, A.y - 10, 12, 20); txt(c, 'A', A.x, A.y - 18, C.text, 13, 'center', 'middle', 700);
        for (const f of flashes) { const a = 1 - f.t / 0.5; c.strokeStyle = 'hsl(48 100% 60% / ' + a.toFixed(3) + ')'; c.lineWidth = 3; c.beginPath(); c.arc(A.x, A.y, 8 + 20 * (1 - a), 0, TAU); c.stroke(); }
        // the travelling stopwatches: a common turn outside, the reversal at the front, the extra turn δ inside
        const common = 5 * TAU, th0 = Math.PI / 2;      // whole turns outside, so the hands end where the arrows point
        if (travel != null) {
          const f = Math.min(1, travel);
          const along = (pts, g) => { let Ls = [], tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); Ls.push(l); tot += l; } let s = g * tot; for (let i = 0; i < Ls.length; i++) { if (s <= Ls[i] || i === Ls.length - 1) { const u = Ls[i] > 0 ? clamp(s / Ls[i], 0, 1) : 1; return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * u, y: pts[i].y + (pts[i + 1].y - pts[i].y) * u, seg: i, u }; } s -= Ls[i]; } return pts[pts.length - 1]; };
          const pf = along([S, FR, A], f), pb = along([S, E1, BK, E2, A], f);
          const thF = th0 - common * f + (pf.seg >= 1 ? Math.PI : 0);
          const inside = pb.seg === 0 ? 0 : pb.seg === 1 ? pb.u / 2 : pb.seg === 2 ? 0.5 + pb.u / 2 : 1;
          const thB = th0 - common * f - del * inside;
          watch(c, pf.x, pf.y, 12, thF, 'hsl(22 90% 56%)', C, pf.seg >= 1 ? 0.6 : 1);
          watch(c, pb.x, pb.y, 12, thB, 'hsl(210 85% 58%)', C, pb.seg >= 3 ? 0.6 : 1);
        }
        // the arrows: front (reversed), back (turned by δ), and the exact chain of bounces
        const bx = 515, by = 175, u = 280, done = travel == null || travel >= 1;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(392, 16, 244, 306);
        txt(c, 'arrows at A', 514, 30, C.muted, 12, 'center');
        c.strokeStyle = C.faint; c.setLineDash([2, 4]); c.beginPath(); c.arc(bx, by, 2 * r * u, 0, TAU); c.stroke(); c.setLineDash([]);
        if (done) {
          const zf = { x: -r * Math.cos(th0), y: -r * Math.sin(th0) }, zb = { x: r * Math.cos(th0 - del), y: r * Math.sin(th0 - del) };
          const x1 = bx + u * zf.x, y1 = by - u * zf.y, x2 = x1 + u * zb.x, y2 = y1 - u * zb.y;
          if (V.exact) {
            // −r, then (1 − r²) r^(2k−1) e^{−ikδ} for k = 1, 2, …
            let x = bx + u * zf.x, y = by - u * zf.y;
            for (let k = 1; k <= 12; k++) {
              const a = (1 - r * r) * Math.pow(r, 2 * k - 1), th = th0 - k * del, nx = x + u * a * Math.cos(th), ny = y - u * a * Math.sin(th);
              arw(c, x, y, nx, ny, 'hsl(150 65% 45%)', k === 1 ? 1.6 : 1.2); x = nx; y = ny;
              if (a * u < 0.3) break;
            }
            c.strokeStyle = 'hsl(150 65% 45% / 0.8)'; c.setLineDash([4, 3]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(bx, by); c.lineTo(x, y); c.stroke(); c.setLineDash([]);
          }
          arw(c, bx, by, x1, y1, 'hsl(22 90% 56%)', 2.8); arw(c, x1, y1, x2, y2, 'hsl(210 85% 58%)', 2.8); arw(c, bx, by, x2, y2, C.text, 3.2);
          txt(c, 'front (reversed)', 400, 296, 'hsl(22 90% 56%)', 11.5); txt(c, 'back', 400, 311, 'hsl(210 85% 58%)', 11.5);
          if (V.exact) txt(c, 'all bounces', 630, 311, 'hsl(150 65% 45%)', 11.5, 'right');
          txt(c, 'final² = ' + (100 * P2).toFixed(1) + ' %', 630, 296, C.text, 11.5, 'right', 'middle', 600);
        } else txt(c, 'on the way…', bx, by, C.muted, 12, 'center');
        c.fillStyle = C.text; c.beginPath(); c.arc(bx, by, 2.5, 0, TAU); c.fill();
        c.restore();
        let turns = (V.n * 2 * V.d / V.lam); ro.set('dl', turns.toFixed(2) + ' turns (' + ((turns % 1) * 360).toFixed(0) + '° beyond whole turns)');
        ro.set('P2', (100 * P2).toFixed(2) + ' %'); ro.set('Pe', (100 * Pe).toFixed(2) + ' %');
        ro.set('per', (V.lam / (2 * V.n)).toFixed(0) + ' nm of thickness');
        ro.set('cl', hits + ' of ' + counted + (counted ? ' (' + (100 * hits / counted).toFixed(1) + ' %)' : ''));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-mirror */
  Hyper.sim('qed-mirror', {
    title: 'Every part of the mirror reflects',
    blurb: `Light goes from **S** to the detector **D** by bouncing off every strip of the mirror. Each strip's path is coloured by the direction of its arrow (the colour wheel of the stopwatch hand). Under the mirror, the curve is the time each path takes: a valley whose bottom is the equal-angle point, with a grid line every wavelength of delay. At the right, the arrows of all the strips are added head to tail.

**Try this**
- Whole mirror: the arrows from the middle point the same way and make the long straight run in the middle of the spiral; the arrows from the ends curl up into the two coils and cancel.
- Choose *Only the left end*: the end strips alone give almost nothing at D. Then *Left end, scraped into a grating*: keeping only the strips whose arrows point roughly one way, the same end now reflects strongly — at an angle where no mirror should send light.
- Click any strip to scrape it away (or put it back).
- Drag **S** or **D**: the valley and its colours move with the equal-angle point.
- Make the wavelength shorter: the coils tighten and the part of the mirror that matters narrows (as $\\sqrt{\\lambda}$).`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 360, F = {}, MY = 250, X0 = 10, X1 = 430;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const S = { x: 80, y: 60 }, D = { x: 360, y: 60 };
      let kept = [];
      const ctl = kit.controls(box.side, [
        { id: 'lam', label: 'Wavelength (drawn enlarged)', min: 6, max: 40, step: 1, value: 14, unit: 'px' },
        { id: 'N', label: 'Number of strips', min: 60, max: 240, step: 4, value: 120 },
        { id: 'preset', type: 'select', label: 'The mirror', options: [['the whole mirror', 'all'], ['only the middle', 'middle'], ['the middle covered', 'ends'], ['only the left end', 'left'], ['left end, scraped into a grating for D', 'grating']], value: 'all' },
        { type: 'buttons', items: [{ id: 'restore', label: 'Restore the mirror', primary: true }] }
      ], id => { if (id === 'restore') { ctl.set('preset', 'all'); apply(); } if (id === 'preset' || id === 'N' || id === 'lam') apply(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Probability at D (whole mirror = 1)'], ['kept', 'Strips kept'], ['eq', 'Equal angles at'], ['zone', 'Strips within ½ λ of the least time']]);
      const SUBS = 8;
      // each strip is a piece of mirror: its arrow is the sum of the arrows across its width (kit.qm.mirrorPaths, finely sampled)
      function paths() {
        const N = V.N, m = Q.mirrorPaths({ src: [S.x, S.y], det: [D.x, D.y], y: MY, x0: X0, x1: X1, n: N * SUBS, lambda: V.lam }), pts = [];
        for (let i = 0; i < N; i++) {
          let re = 0, im = 0;
          for (let j = 0; j < SUBS; j++) { const th = hand(m.pts[i * SUBS + j].L, V.lam); re += Math.cos(th) / (N * SUBS); im += Math.sin(th) / (N * SUBS); }
          pts.push({ x: X0 + (X1 - X0) * (i + 0.5) / N, L: m.pts[i * SUBS + (SUBS >> 1)].L, re, im, ang: Math.atan2(im, re) });
        }
        return { pts };
      }
      const eqX = () => (S.x * (MY - D.y) + D.x * (MY - S.y)) / ((MY - S.y) + (MY - D.y));
      function apply() {
        const m = paths(), N = V.N, xe = eqX();
        kept = m.pts.map(p => {
          if (V.preset === 'middle') return Math.abs(p.x - xe) < 60;
          if (V.preset === 'ends') return Math.abs(p.x - xe) >= 60;
          if (V.preset === 'left') return p.x < 110;
          if (V.preset === 'grating') { if (p.x >= 110) return false; return Math.cos(p.ang - m.pts[0].ang) > 0; }
          return true;
        });
        if (kept.length !== N) kept = new Array(N).fill(true);
      }
      apply();
      kit.drag(st, {
        hit(p) { const q = toL(F, p); if (Math.hypot(q.x - S.x, q.y - S.y) < 16) return 'S'; if (Math.hypot(q.x - D.x, q.y - D.y) < 16) return 'D'; return null; },
        move(k, p) { const q = toL(F, p), P = k === 'S' ? S : D; P.x = clamp(q.x, 20, 420); P.y = clamp(q.y, 20, MY - 60); if (V.preset === 'grating' || V.preset === 'middle' || V.preset === 'ends') apply(); },
        hover: true
      });
      kit.click(st, p => {
        const q = toL(F, p);
        if (q.y > MY - 14 && q.y < MY + 20 && q.x >= X0 && q.x <= X1) { const i = Math.floor((q.x - X0) / (X1 - X0) * V.N); if (i >= 0 && i < kept.length) kept[i] = !kept[i]; }
      }, p => { const q = toL(F, p); return q.y > MY - 14 && q.y < MY + 20 && q.x >= X0 && q.x <= X1; });
      const loop = kit.loop(() => {
        const m = paths(), N = V.N; if (kept.length !== N) kept = new Array(N).fill(true);
        const C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        const hueOf = a => (((a % TAU) + TAU) % TAU / TAU * 360).toFixed(0);
        // paths, faint and coloured by the direction of their arrows
        const every = Math.max(1, Math.ceil(N / 60));
        for (let i = 0; i < N; i += every) {
          const p = m.pts[i]; if (!kept[i]) continue;
          c.strokeStyle = 'hsl(' + hueOf(p.ang) + ' 80% 55% / 0.28)'; c.lineWidth = 1;
          c.beginPath(); c.moveTo(S.x, S.y); c.lineTo(p.x, MY); c.lineTo(D.x, D.y); c.stroke();
        }
        // the mirror strips
        const sw = (X1 - X0) / N;
        for (let i = 0; i < N; i++) {
          const x = X0 + i * sw;
          if (kept[i]) { c.fillStyle = 'hsl(' + hueOf(m.pts[i].ang) + ' 80% 55%)'; c.fillRect(x + 0.2, MY - 3, Math.max(0.5, sw - 0.4), 10); }
          else { c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x + 0.8, MY - 2, sw - 1.6, 8); }
        }
        txt(c, 'mirror — click a strip to scrape it away', 220, MY + 20, C.muted, 11.5, 'center');
        // the valley of times, with a line every wavelength of delay
        let Lmin = Infinity, Lmax = 0; for (const p of m.pts) { Lmin = Math.min(Lmin, p.L); Lmax = Math.max(Lmax, p.L); }
        const gy0 = 350, gh = 64, sc = gh / Math.max(1e-9, Lmax - Lmin);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 1; k * V.lam < Lmax - Lmin; k++) { const y = gy0 - k * V.lam * sc; if (gy0 - y > gh) break; c.beginPath(); c.moveTo(X0, y); c.lineTo(X1, y); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath();
        m.pts.forEach((p, i) => { const y = gy0 - (p.L - Lmin) * sc; if (i) c.lineTo(p.x, y); else c.moveTo(p.x, y); }); c.stroke();
        const xe = eqX();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(xe, 50); c.lineTo(xe, gy0); c.stroke(); c.setLineDash([]);
        txt(c, 'time of each path (least time at equal angles)', X0 + 4, gy0 - gh - 6, C.muted, 11);
        // S and D
        c.fillStyle = 'hsl(48 95% 55%)'; c.beginPath(); c.arc(S.x, S.y, 9, 0, TAU); c.fill(); txt(c, 'S', S.x, S.y - 18, C.text, 13, 'center', 'middle', 700);
        c.fillStyle = C.text; c.beginPath(); c.arc(D.x, D.y, 8, 0, TAU); c.fill(); txt(c, 'D', D.x, D.y - 18, C.text, 13, 'center', 'middle', 700);
        // the arrows of the kept strips, head to tail, scaled to fit; the whole mirror's final arrow for comparison
        const zs = m.pts.map((p, i) => kept[i] ? { re: p.re, im: p.im } : { re: 0, im: 0 });
        const chain = Q.arrowSum(zs).chain, full = Q.arrowSum(m.pts.map(p => ({ re: p.re, im: p.im }))).total;
        let mnx = 0, mxx = 0, mny = 0, mxy = 0; for (const [x, y] of chain) { mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); }
        const u = Math.min(160 / Math.max(1e-6, mxx - mnx), 280 / Math.max(1e-6, mxy - mny), 4000);
        const cx0 = 540 - u * (mnx + mxx) / 2, cy0 = 180 + u * (mny + mxy) / 2;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(450, 20, 180, 320);
        txt(c, 'arrows of the strips', 540, 32, C.muted, 12, 'center');
        c.lineWidth = 1.2;
        for (let i = 1; i < chain.length; i++) {
          if (!kept[i - 1]) continue;
          c.strokeStyle = 'hsl(' + hueOf(m.pts[i - 1].ang) + ' 80% 50%)';
          c.beginPath(); c.moveTo(cx0 + u * chain[i - 1][0], cy0 - u * chain[i - 1][1]); c.lineTo(cx0 + u * chain[i][0], cy0 - u * chain[i][1]); c.stroke();
        }
        const last = chain[chain.length - 1];
        arw(c, cx0, cy0, cx0 + u * last[0], cy0 - u * last[1], C.text, 2.6);
        const Pk = last[0] * last[0] + last[1] * last[1], Pf = Q.abs2(full);
        c.restore();
        let nk = 0; for (const k of kept) if (k) nk++;
        let zone = 0; for (const p of m.pts) if (p.L - Lmin < V.lam / 2) zone++;
        ro.set('P', Pf > 1e-12 ? (Pk / Pf).toFixed(3) : '—'); ro.set('kept', nk + ' of ' + N);
        ro.set('eq', xe >= X0 && xe <= X1 ? 'x = ' + xe.toFixed(0) + ' px' : 'beyond the mirror');
        ro.set('zone', zone + ' (' + (zone * (X1 - X0) / N).toFixed(0) + ' px wide)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-grating */
  Hyper.sim('qed-grating', {
    title: 'A grating splits the colours',
    blurb: `White light falls on a grating: shiny lines a distance $d$ apart (drawn much enlarged). For every line there is a path to the detector, and its arrow. The coloured rays show where the arrows of each colour line up: straight back like a mirror (order 0), and in fans of colour to either side, where $d(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$. At the right, each colour's arrows at the detector's angle are added head to tail; the graph shows the brightness of each colour at every angle.

**Try this**
- Drag the detector (the round head on the arc) through a fan: blue, then green, then red take their turns — each arrow chain straightens as its colour lines up.
- Set the shiny fraction to 1: the lines touch and the grating is a plain mirror; every coloured fan vanishes and only order 0 remains.
- Increase the number of lines: the peaks get sharper (more arrows in line, and faster cancellation away from the peak).
- Make the lines closer together (a DVD is 0.74 µm, a CD 1.6 µm): the fans open out to larger angles.`,
    mount(box, kit) {
      const W0 = 640, H0 = 320, F = {}, G = { x: 230, y: 290 }, RAD = 230;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'col', type: 'select', label: 'Light', options: [['white (blue, green, red)', 0], ['blue, 450 nm', 450], ['green, 530 nm', 530], ['red, 650 nm', 650]], value: 0 },
        { id: 'd', label: 'Line spacing', min: 0.8, max: 4, step: 0.02, value: 1.6, unit: 'µm' },
        { id: 'thi', label: 'Angle of the incoming light', min: 0, max: 60, step: 1, value: 20, unit: '°' },
        { id: 'th', label: 'Detector angle', min: -85, max: 85, step: 0.5, value: 40, unit: '°' },
        { id: 'N', label: 'Number of shiny lines', min: 4, max: 60, step: 1, value: 16 },
        { id: 'f', label: 'Shiny fraction of each line', min: 0.1, max: 1, step: 0.05, value: 0.5 }
      ], id => { if (id !== 'th') updPlot(); else markDet(); });
      const V = ctl.values;
      const markDet = () => plot.set({ vlines: [{ x: V.th, label: 'detector' }] });
      const ro = kit.readout(box.side, [['o1', 'First order leaves at'], ['I', 'Brightness at the detector'], ['see', 'The detector sees']]);
      const plot = kit.plot(gb, { x: { label: 'detector angle (°)', min: -85, max: 85 }, y: { label: 'brightness (mirror = 1)', min: 0 }, legend: true }, 160);
      const cols = () => V.col ? [V.col] : [450, 530, 650];
      const SUB = 6;
      // the arrow of each shiny line at angle th (radians), as the sum over its width; lengths so that a plain mirror gives 1
      function lineArrows(lam, th) {
        const dnm = V.d * 1000, k = TAU / lam * (Math.sin(th) - Math.sin(V.thi * Math.PI / 180)), out = [];
        for (let j = 0; j < V.N; j++) {
          let re = 0, im = 0;
          for (let s = 0; s < SUB; s++) { const x = j * dnm + V.f * dnm * (s + 0.5) / SUB, ph = k * x; re += Math.cos(ph); im += Math.sin(ph); }
          out.push({ re: re * V.f / (SUB * V.N), im: im * V.f / (SUB * V.N) });
        }
        return out;
      }
      const bright = (lam, th) => { let re = 0, im = 0; for (const z of lineArrows(lam, th)) { re += z.re; im += z.im; } return re * re + im * im; };
      function updPlot() {
        const series = cols().map(l => { const pts = []; for (let a = -85; a <= 85; a += 0.25) pts.push([a, bright(l, a * Math.PI / 180)]); return { pts, label: l + ' nm', color: lamCol(l, 1, 50) }; });
        plot.set({ series, vlines: [{ x: V.th, label: 'detector' }] });
      }
      updPlot();
      kit.drag(st, {
        hit(p) { const q = toL(F, p), a = V.th * Math.PI / 180, x = G.x + RAD * Math.sin(a), y = G.y - RAD * Math.cos(a); return Math.hypot(q.x - x, q.y - y) < 18 ? 1 : null; },
        move(k, p) { const q = toL(F, p); const a = Math.atan2(q.x - G.x, G.y - q.y) * 180 / Math.PI; ctl.set('th', clamp(Math.round(a * 2) / 2, -85, 85)); markDet(); },
        hover: true
      });
      const loop = kit.loop(() => {
        const C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        const thi = V.thi * Math.PI / 180, th = V.th * Math.PI / 180;
        // the arc of detector positions
        c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.arc(G.x, G.y, RAD, Math.PI + 0.09, TAU - 0.09); c.stroke(); c.setLineDash([]);
        // incoming white beam from the upper left
        for (let k = -2; k <= 2; k++) {
          const ox = G.x - RAD * Math.sin(thi) + 8 * k * Math.cos(thi), oy = G.y - RAD * Math.cos(thi) - 8 * k * Math.sin(thi);
          arw(c, ox, oy, ox + (G.x + 8 * k * Math.cos(thi) - ox) * 0.9, oy + (G.y - 8 * k * Math.sin(thi) - oy) * 0.9, V.col ? lamCol(V.col, 0.8) : 'hsl(0 0% 85% / 0.8)', 1.6);
        }
        txt(c, V.col ? V.col + ' nm' : 'white light', G.x - RAD * Math.sin(thi) - 6, G.y - RAD * Math.cos(thi) - 10, C.muted, 12, 'center');
        // the orders: rays wherever d(sin θm − sin θi) = mλ, as bright as the arrows make them
        for (const l of cols()) for (let m = -4; m <= 4; m++) {
          const s = Math.sin(thi) + m * l / (V.d * 1000); if (Math.abs(s) >= 1) continue;
          const a = Math.asin(s), I = bright(l, a); if (I < 0.002) continue;
          c.strokeStyle = V.col || m ? lamCol(l, clamp(0.25 + 1.6 * Math.sqrt(I), 0, 1), 55) : 'hsl(0 0% 85% / 0.7)'; c.lineWidth = 2 + 4 * Math.sqrt(I);
          c.beginPath(); c.moveTo(G.x, G.y); c.lineTo(G.x + (RAD - 6) * Math.sin(a), G.y - (RAD - 6) * Math.cos(a)); c.stroke();
          if (l === cols()[cols().length - 1] || V.col) txt(c, (m > 0 ? '+' : '') + m, G.x + (RAD + 14) * Math.sin(a), G.y - (RAD + 14) * Math.cos(a), C.muted, 11, 'center');
        }
        // the grating, much enlarged
        const gw = 360, pitch = gw / V.N;
        c.fillStyle = C.surface2 || C.surface; c.fillRect(G.x - gw / 2 - 4, G.y, gw + 8, 12);
        for (let j = 0; j < V.N; j++) { c.fillStyle = C.text2 || C.text; c.fillRect(G.x - gw / 2 + j * pitch, G.y - 2, Math.max(1, pitch * V.f), 4); }
        txt(c, 'grating: ' + V.N + ' lines, ' + V.d.toFixed(2) + ' µm apart (enlarged)', G.x, G.y + 22, C.muted, 11.5, 'center');
        // the detector
        const dx = G.x + RAD * Math.sin(th), dy = G.y - RAD * Math.cos(th);
        c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(G.x, G.y); c.lineTo(dx, dy); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.text; c.beginPath(); c.arc(dx, dy, 8, 0, TAU); c.fill(); txt(c, 'detector', dx, dy - 16, C.text, 12, 'center');
        // each colour's arrows at the detector
        const L = cols(), bh = 300 / L.length;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(470, 10, 160, 300);
        let best = null, bestI = 0, parts = [];
        L.forEach((l, i) => {
          const zs = lineArrows(l, th), u = 0.7 * Math.min(150, bh);
          const cy = 10 + bh * i + bh / 2, cx = 550;
          let x = cx - u * 0.5, y = cy;
          let sx = 0, sy = 0; for (const z of zs) { sx += z.re; sy += z.im; }
          // start so the chain is roughly centred
          x = cx - u * sx / 2; y = cy + u * sy / 2;
          const x0 = x, y0 = y;
          c.strokeStyle = lamCol(l, 1, 52); c.lineWidth = 1.6;
          for (const z of zs) { const nx = x + u * z.re, ny = y - u * z.im; c.beginPath(); c.moveTo(x, y); c.lineTo(nx, ny); c.stroke(); x = nx; y = ny; }
          arw(c, x0, y0, x, y, C.text, 2);
          const I = sx * sx + sy * sy; parts.push(l + ' nm: ' + I.toFixed(3));
          txt(c, l + ' nm', 476, 10 + bh * i + 12, lamCol(l, 1, 52), 11, 'left', 'middle', 600);
          if (I > bestI) { bestI = I; best = l; }
        });
        c.restore();
        const s1 = Math.sin(thi) + 0.53 / V.d;
        ro.set('o1', V.col ? (Math.abs(Math.sin(thi) + V.col / (V.d * 1000)) < 1 ? (Math.asin(Math.sin(thi) + V.col / (V.d * 1000)) * 180 / Math.PI).toFixed(1) + '°' : 'no first order') : (Math.abs(s1) < 1 ? 'green at ' + (Math.asin(s1) * 180 / Math.PI).toFixed(1) + '°' : 'no first order for green'));
        ro.set('I', parts.join(' · '));
        ro.set('see', bestI < 0.003 ? 'darkness' : L.length > 1 && bestI > 0 && parts.length > 1 && L.every(l => bright(l, th) > 0.3 * bestI) ? 'white-ish light' : (best === 450 ? 'blue' : best === 530 ? 'green' : 'red') + ' light');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-lens */
  Hyper.sim('qed-lens', {
    title: 'A lens lines up the arrows',
    blurb: `Light goes from **S** to the detector **P** along every path through the lens (a sample of them is drawn, coloured by the direction of its arrow). The glass is thickest in the middle, delaying the short central paths by just as much as the outer paths are longer, so at the focus every path takes the same time. The graph shows the time of each path (in periods, measured from the quickest); at the right, the arrows are added head to tail.

**Try this**
- With P at the focus, the time graph is flat, all paths have the same colour, and the arrows make one straight line: the brightest possible spot.
- Drag P along the axis or sideways: the times fan out, the colours cycle, the arrows curl into a circle and the light fades. The focus is where the times agree.
- Untick *Glass in place*: without the lens the central paths are quickest again; at the old focus the arrows coil up.
- Switch to *Air into water*: the light bends at the surface. The time curve has a flat bottom at the path that obeys Snell's law — the path of least time — and only the paths near it add up.
- A shorter wavelength makes the useful bundle of paths narrower: light behaves more and more like a ray.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340, F = {}, AX = 170, XL = 210, HL = 100, S1 = 180, S2 = 210, NW = 1.33;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const S = { x: XL - S1, y: AX }, P = { x: XL + S2, y: AX }, SW = { x: 70, y: 40 }, PW = { x: 380, y: 300 };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['a lens', 'lens'], ['air into water (least time)', 'water']], value: 'lens' },
        { id: 'glass', type: 'check', label: 'Glass in place', value: true },
        { id: 'lam', label: 'Wavelength (drawn enlarged)', min: 4, max: 30, step: 1, value: 10, unit: 'px' },
        { id: 'M', label: 'Paths drawn', min: 9, max: 81, step: 2, value: 41 },
        { type: 'buttons', items: [{ id: 'focus', label: 'Detector to the focus', primary: true }] }
      ], id => { if (id === 'focus') { P.x = XL + S2; P.y = AX; PW.x = 380; PW.y = 300; } if (id === 'mode') ctl.show('glass', V.mode === 'lens'); updPlot(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Final arrow (all in line = 1)'], ['B', 'Brightness (focus = 1)'], ['sp', 'Spread of times across the paths'], ['sn', '']]);
      const plot = kit.plot(gb, { x: { label: 'where the path crosses (px)' }, y: { label: 'time − quickest (periods)', min: 0 } }, 150);
      const Lf = y => Math.hypot(S1, y) + Math.hypot(S2, y);
      const w = y => (Lf(HL) - Lf(Math.min(HL, Math.abs(y)))) / 0.5;      // glass thickness so that all times to the focus are equal (n = 1.5)
      // the paths: M bands, each the sum of SUB sub-paths; t in px of vacuum travel
      function bands() {
        const out = [], M = V.M, lens = V.mode === 'lens', SUB = Math.ceil(720 / M);   // the sum always uses about 720 sub-paths
        const lo = lens ? -HL : 10, hi = lens ? HL : 450;
        for (let i = 0; i < M; i++) {
          let re = 0, im = 0, tc = 0;
          for (let j = 0; j < SUB; j++) {
            const u = lo + (hi - lo) * (i * SUB + j + 0.5) / (M * SUB);
            let t;
            if (lens) t = Math.hypot(XL - S.x, u) + Math.hypot(P.x - XL, P.y - (AX + u)) + (V.glass ? 0.5 * w(u) : 0);
            else t = Math.hypot(u - SW.x, AX - SW.y) + NW * Math.hypot(PW.x - u, PW.y - AX);
            const th = hand(t, V.lam); re += Math.cos(th) / (M * SUB); im += Math.sin(th) / (M * SUB);
            if (j === (SUB >> 1)) tc = t;
          }
          out.push({ u: lo + (hi - lo) * (i + 0.5) / M, t: tc, re, im, ang: Math.atan2(im, re) });
        }
        return out;
      }
      const focusRef = () => { const sv = { x: P.x, y: P.y }, g = V.glass, md = V.mode; P.x = XL + S2; P.y = AX; V.glass = true; V.mode = 'lens'; const b = bands(); P.x = sv.x; P.y = sv.y; V.glass = g; V.mode = md; let re = 0, im = 0; for (const z of b) { re += z.re; im += z.im; } return re * re + im * im; };
      function updPlot() {
        const b = bands(); let tmin = Infinity; for (const z of b) tmin = Math.min(tmin, z.t);
        const series = [{ pts: b.map(z => [z.u, (z.t - tmin) / V.lam]), label: V.mode === 'lens' ? (V.glass ? 'with the lens' : 'no glass') : 'air, then water', dots: 2.2 }];
        plot.set({ x: { label: V.mode === 'lens' ? 'height where the path crosses the lens (px)' : 'where the path meets the water (px)' }, series });
      }
      kit.drag(st, {
        hit(p) { const q = toL(F, p), D = V.mode === 'lens' ? P : PW; return Math.hypot(q.x - D.x, q.y - D.y) < 18 ? 1 : null; },
        move(k, p) { const q = toL(F, p); if (V.mode === 'lens') { P.x = clamp(q.x, 290, 450); P.y = clamp(q.y, 20, 320); } else { PW.x = clamp(q.x, 20, 450); PW.y = clamp(q.y, AX + 20, 330); } updPlot(); },
        hover: true
      });
      updPlot();
      let fref = focusRef(), lastKey = '';
      const loop = kit.loop(() => {
        const key = V.lam + '|' + V.M; if (key !== lastKey) { fref = focusRef(); lastKey = key; }
        const b = bands(), lens = V.mode === 'lens', C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        const hueOf = a => (((a % TAU) + TAU) % TAU / TAU * 360).toFixed(0);
        const src = lens ? S : SW, det = lens ? P : PW;
        if (lens) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(0, AX); c.lineTo(455, AX); c.stroke();
          if (V.glass) {
            c.fillStyle = 'hsl(195 60% 60% / 0.22)'; c.strokeStyle = 'hsl(195 50% 60% / 0.9)'; c.lineWidth = 1.5; c.beginPath();
            for (let y = -HL; y <= HL; y += 4) c.lineTo(XL - w(y) / 2 / 2, AX + y);
            for (let y = HL; y >= -HL; y -= 4) c.lineTo(XL + w(y) / 2 / 2, AX + y);
            c.closePath(); c.fill(); c.stroke();
          } else { c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(XL, AX - HL); c.lineTo(XL, AX + HL); c.stroke(); c.setLineDash([]); }
          c.fillStyle = C.text; c.fillRect(XL - 3, AX - HL - 12, 6, 10); c.fillRect(XL - 3, AX + HL + 2, 6, 10);
          txt(c, 'focus', XL + S2, AX + 14, C.muted, 11, 'center');
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(XL + S2 - 5, AX); c.lineTo(XL + S2 + 5, AX); c.moveTo(XL + S2, AX - 5); c.lineTo(XL + S2, AX + 5); c.stroke();
        } else {
          c.fillStyle = 'hsl(205 70% 55% / 0.18)'; c.fillRect(0, AX, 455, H0 - AX);
          c.strokeStyle = 'hsl(205 60% 55% / 0.9)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, AX); c.lineTo(455, AX); c.stroke();
          txt(c, 'air', 12, AX - 12, C.muted, 12); txt(c, 'water (n = 1.33)', 12, AX + 14, C.muted, 12);
        }
        for (const z of b) {
          const mx = lens ? XL : z.u, my = lens ? AX + z.u : AX;
          c.strokeStyle = 'hsl(' + hueOf(z.ang) + ' 80% 55% / 0.55)'; c.lineWidth = 1.1;
          c.beginPath(); c.moveTo(src.x, src.y); c.lineTo(mx, my); c.lineTo(det.x, det.y); c.stroke();
        }
        // the least-time path in water, with its angles
        let tmin = Infinity, best = null; for (const z of b) if (z.t < tmin) { tmin = z.t; best = z; }
        if (!lens && best) {
          // refine the least-time point by a fine search
          let bx = best.u, bt = Infinity; for (let x = 10; x <= 450; x += 0.25) { const t = Math.hypot(x - SW.x, AX - SW.y) + NW * Math.hypot(PW.x - x, PW.y - AX); if (t < bt) { bt = t; bx = x; } }
          c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(SW.x, SW.y); c.lineTo(bx, AX); c.lineTo(PW.x, PW.y); c.stroke();
          c.setLineDash([3, 3]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(bx, AX - 60); c.lineTo(bx, AX + 60); c.stroke(); c.setLineDash([]);
          const t1 = Math.atan2(Math.abs(bx - SW.x), AX - SW.y), t2 = Math.atan2(Math.abs(PW.x - bx), PW.y - AX);
          ro.set('sn', 'θ₁ = ' + (t1 * 180 / Math.PI).toFixed(1) + '°, θ₂ = ' + (t2 * 180 / Math.PI).toFixed(1) + '°: sin θ₁ = ' + Math.sin(t1).toFixed(3) + ', 1.33 sin θ₂ = ' + (NW * Math.sin(t2)).toFixed(3));
        } else ro.set('sn', lens ? (V.glass ? 'lens: glass n = 1.5' : 'no glass') : '');
        c.fillStyle = 'hsl(48 95% 55%)'; c.beginPath(); c.arc(src.x, src.y, 8, 0, TAU); c.fill(); txt(c, 'S', src.x, src.y - 17, C.text, 13, 'center', 'middle', 700);
        c.fillStyle = C.text; c.beginPath(); c.arc(det.x, det.y, 8, 0, TAU); c.fill(); txt(c, 'P', det.x + 13, det.y - 13, C.text, 13, 'center', 'middle', 700);
        // the arrows
        const chain = kit.qm.arrowSum(b.map(z => ({ re: z.re, im: z.im }))).chain, u = 150;
        let mnx = 0, mxx = 0, mny = 0, mxy = 0; for (const [x, y] of chain) { mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); }
        const cx0 = 550 - u * (mnx + mxx) / 2, cy0 = 175 + u * (mny + mxy) / 2;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(465, 15, 170, 315);
        txt(c, 'arrows at P', 550, 28, C.muted, 12, 'center');
        c.lineWidth = 1.6;
        for (let i = 1; i < chain.length; i++) { c.strokeStyle = 'hsl(' + hueOf(b[i - 1].ang) + ' 80% 50%)'; c.beginPath(); c.moveTo(cx0 + u * chain[i - 1][0], cy0 - u * chain[i - 1][1]); c.lineTo(cx0 + u * chain[i][0], cy0 - u * chain[i][1]); c.stroke(); }
        const last = chain[chain.length - 1];
        arw(c, cx0, cy0, cx0 + u * last[0], cy0 - u * last[1], C.text, 2.6);
        c.restore();
        let tmax = 0; for (const z of b) tmax = Math.max(tmax, z.t);
        const A2 = last[0] * last[0] + last[1] * last[1];
        ro.set('A', Math.sqrt(A2).toFixed(3));
        ro.set('B', lens ? (fref > 0 ? (A2 / fref).toFixed(3) : '—') : (A2 * 100).toFixed(2) + ' % of all in line');
        ro.set('sp', ((tmax - tmin) / V.lam).toFixed(2) + ' periods');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-actions */
  // space-time pictures: x across (px), time up (px; light moves at 45°). Segments: e (electron, arrow from a to b), g (photon)
  const STORIES = {
    photon: { name: 'A photon goes from A to B', seg: [['g', 'A', 'B']], pts: { A: [110, 40], B: [290, 220] }, drag: ['B'], rec: ['P(A → B)'], j: 0 },
    electron: { name: 'An electron goes from A to B', seg: [['e', 'A', 'B']], pts: { A: [160, 30], B: [230, 300] }, drag: ['B'], rec: ['E(A → B)'], j: 0 },
    emit: { name: 'An electron emits a photon', seg: [['e', 'a', 'J'], ['e', 'J', 'b'], ['g', 'J', 'c']], pts: { a: [120, 20], J: [170, 150], b: [150, 320], c: [330, 310] }, drag: ['J'], rec: ['E(a → J)', 'j', 'E(J → b)', 'P(J → c)'], j: 1 },
    absorb: { name: 'An electron absorbs a photon', seg: [['g', 'c', 'J'], ['e', 'a', 'J'], ['e', 'J', 'b']], pts: { c: [70, 40], a: [250, 20], J: [210, 180], b: [240, 320] }, drag: ['J'], rec: ['P(c → J)', 'E(a → J)', 'j', 'E(J → b)'], j: 1 },
    exchange: { name: 'Two electrons exchange a photon', seg: [['e', 'a', 'J1'], ['e', 'J1', 'b'], ['e', 'c', 'J2'], ['e', 'J2', 'd'], ['g', 'J1', 'J2']], pts: { a: [100, 20], J1: [130, 100], b: [80, 330], c: [330, 20], J2: [300, 270], d: [340, 335] }, drag: ['J1', 'J2'], rec: ['E(a → J₁)', 'j', 'E(J₁ → b)', 'P(J₁ → J₂)', 'E(c → J₂)', 'j', 'E(J₂ → d)'], j: 2 },
    scatter: { name: 'An electron scatters light (both orders)', seg: [['g', 'c', 'J1'], ['e', 'a', 'J1'], ['e', 'J1', 'J2'], ['e', 'J2', 'b'], ['g', 'J2', 'd']], pts: { c: [115, 30], a: [200, 20], J1: [205, 120], J2: [215, 220], b: [225, 330], d: [325, 330] }, drag: ['J1', 'J2'], rec: ['P(c → J₁)', 'j', 'E(J₁ → J₂)', 'j', 'P(J₂ → d)', '+ the other order'], j: 2, alt: true },
    pair: { name: 'An electron and a positron annihilate', seg: [['e', 'a', 'J1'], ['e', 'J1', 'J2'], ['e', 'J2', 'b'], ['g', 'J1', 'c'], ['g', 'J2', 'd']], pts: { a: [120, 20], J1: [185, 200], J2: [255, 160], b: [320, 20], c: [55, 330], d: [390, 295] }, drag: ['J1', 'J2'], rec: ['E(a → J₁)', 'j', 'E(J₁ → J₂)', 'j', 'E(J₂ → b)', 'P(J₁ → c) P(J₂ → d)'], j: 2 }
  };
  function wavy(c, x0, y0, x1, y1, col, w, amp, wl) {
    const L = Math.hypot(x1 - x0, y1 - y0); if (!(L > 1)) return;
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L, n = Math.max(8, Math.round(L / 2));
    c.strokeStyle = col; c.lineWidth = w || 2; c.beginPath();
    for (let i = 0; i <= n; i++) { const s = L * i / n, o = (amp || 4) * Math.sin(TAU * s / (wl || 12)); const x = x0 + ux * s - uy * o, y = y0 + uy * s + ux * o; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
    c.stroke();
  }
  // an electron line with a mid-arrow in the direction of electron flow (down the page = a positron going forward)
  function eline(c, x0, y0, x1, y1, col, w) {
    c.strokeStyle = col; c.lineWidth = w || 2.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, a = Math.atan2(y1 - y0, x1 - x0), h = 8;
    c.fillStyle = col; c.beginPath(); c.moveTo(mx + h * Math.cos(a), my + h * Math.sin(a)); c.lineTo(mx - h * Math.cos(a - 0.5), my - h * Math.sin(a - 0.5)); c.lineTo(mx - h * Math.cos(a + 0.5), my - h * Math.sin(a + 0.5)); c.closePath(); c.fill();
  }

  Hyper.sim('qed-actions', {
    title: 'Three basic actions in space-time',
    blurb: `A space-time picture: space across, time **up** the page, drawn so that light travels at 45°. Electrons are straight lines (with an arrow), photons wavy lines, and each dot where they meet is a **junction** — an electron emitting or absorbing a photon. A line of "now" sweeps up the picture and shows what exists at each moment: electrons (blue), positrons (red), photons (yellow). At the right, the recipe for the arrow of this way: the arrows of the pieces multiplied, one factor j for each junction.

**Try this**
- *A photon goes from A to B*: drag B. On the 45° lines of the light cone the photon's arrow is largest; off them it is small but not zero.
- *Two electrons exchange a photon*: drag the junctions. Every position is another way, with its own arrow — QED adds them all. The photon may even run "backwards" in time between them.
- *An electron scatters light*: both orders count — absorb then emit, and emit first then absorb.
- *An electron and a positron annihilate*: the electron line zigzags back in time. Follow the now-line: an electron and a positron approach, and two photons leave.`,
    mount(box, kit) {
      const W0 = 640, H0 = 360, F = {}, T0 = 345;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'story', type: 'select', label: 'Story', options: Object.keys(STORIES).map(k => [STORIES[k].name, k]), value: 'exchange' },
        { id: 'speed', label: 'Speed of the now-line', min: 0.2, max: 2, step: 0.1, value: 0.7 },
        { id: 'cones', type: 'check', label: 'Show light cones at the junctions', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Play again', primary: true }, { id: 'reset', label: 'Reset the picture' }] }
      ], id => { if (id === 'play') now = 0; if (id === 'story' || id === 'reset') load(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['j', 'Junctions'], ['f', 'Arrow shrunk by about'], ['I', 'Photon interval (c Δt)² − Δx²'], ['now', 'Now']]);
      let pts = {}, now = 0, flip = false;
      function load() { const s = STORIES[V.story]; pts = {}; for (const k in s.pts) pts[k] = s.pts[k].slice(); now = 0; flip = false; }
      load();
      const Y = t => T0 - t;
      kit.drag(st, {
        hit(p) { const q = toL(F, p), s = STORIES[V.story]; for (const k of s.drag) if (Math.hypot(q.x - pts[k][0], q.y - Y(pts[k][1])) < 16) return k; return null; },
        move(k, p) { const q = toL(F, p); pts[k][0] = clamp(q.x, 20, 410); pts[k][1] = clamp(T0 - q.y, 10, 330); },
        hover: true
      });
      const loop = kit.loop(dt => {
        now += dt * 60 * V.speed; if (now > 360) { now = 0; flip = !flip; }
        const s = STORIES[V.story], C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        // axes
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(14, T0); c.lineTo(418, T0); c.moveTo(14, T0); c.lineTo(14, 8); c.stroke();
        txt(c, 'space →', 412, T0 + 10, C.muted, 11, 'right'); txt(c, 'time ↑', 20, 12, C.muted, 11);
        // the scatter story alternates between its two orders
        let seg = s.seg, P = pts;
        if (s.alt && flip) { seg = [['g', 'c', 'J2'], ['e', 'a', 'J1'], ['e', 'J1', 'J2'], ['e', 'J2', 'b'], ['g', 'J1', 'd']]; }
        // light cones
        const cone = (x, t) => { c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(x - 330, Y(t + 330)); c.lineTo(x, Y(t)); c.lineTo(x + 330, Y(t + 330)); c.moveTo(x - 330, Y(t - 330)); c.lineTo(x, Y(t)); c.lineTo(x + 330, Y(t - 330)); c.stroke(); c.setLineDash([]); };
        c.save(); c.beginPath(); c.rect(14, 8, 404, T0 - 8); c.clip();
        if (V.story === 'photon') cone(P.A[0], P.A[1]);
        if (V.cones) for (const k of s.drag) cone(P[k][0], P[k][1]);
        c.restore();
        // the lines
        const eCol = 'hsl(210 85% 58%)', pCol = 'hsl(0 80% 60%)', gCol = 'hsl(45 95% 52%)';
        for (const [kind, a, b] of seg) {
          const A = P[a], B = P[b];
          if (kind === 'g') wavy(c, A[0], Y(A[1]), B[0], Y(B[1]), gCol, 2);
          else eline(c, A[0], Y(A[1]), B[0], Y(B[1]), B[1] >= A[1] ? eCol : pCol, 2.4);
        }
        for (const k in P) {
          const isJ = k[0] === 'J';
          c.fillStyle = isJ ? C.text : C.muted; c.beginPath(); c.arc(P[k][0], Y(P[k][1]), isJ ? 5.5 : 3.5, 0, TAU); c.fill();
          if (s.drag.includes(k)) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(P[k][0], Y(P[k][1]), 10, 0, TAU); c.stroke(); }
          txt(c, k.replace('J1', 'J₁').replace('J2', 'J₂'), P[k][0] + 9, Y(P[k][1]) - 9, C.text2 || C.text, 11.5);
        }
        // the now-line and what exists at that moment
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(14, Y(now)); c.lineTo(418, Y(now)); c.stroke(); c.setLineDash([]);
        let ne = 0, np = 0, ng = 0;
        for (const [kind, a, b] of seg) {
          const A = P[a], B = P[b], lo = Math.min(A[1], B[1]), hi = Math.max(A[1], B[1]);
          if (now < lo || now > hi || hi - lo < 1e-6) continue;
          const f = (now - A[1]) / (B[1] - A[1]), x = A[0] + (B[0] - A[0]) * f;
          const col = kind === 'g' ? gCol : B[1] >= A[1] ? eCol : pCol;
          if (kind === 'g') ng++; else if (B[1] >= A[1]) ne++; else np++;
          c.fillStyle = col; c.beginPath(); c.arc(x, Y(now), 6.5, 0, TAU); c.fill();
        }
        // the recipe and the shrinking arrow
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(430, 10, 205, 340);
        txt(c, s.alt && flip ? 'the other order' : 'the arrow for this way', 532, 26, C.muted, 12, 'center');
        s.rec.forEach((r, i) => txt(c, (i ? '× ' : '   ') + r, 442, 50 + 19 * i, r === 'j' ? C.accent : C.text, 12.5, 'left', 'middle', r === 'j' ? 700 : 500));
        const y0 = 50 + 19 * s.rec.length + 22;
        txt(c, 'each j shrinks the arrow ~10×:', 442, y0, C.muted, 11.5);
        for (let k = 0; k <= s.j; k++) { const L = 150 * Math.pow(0.1, k); arw(c, 450, y0 + 22 + 22 * k, 450 + Math.max(L, 1), y0 + 22 + 22 * k, k === s.j ? C.text : C.faint, 2.2); txt(c, k ? 'j' + (k > 1 ? '²' : '') : '1', 450 + Math.max(L, 1) + 8, y0 + 22 + 22 * k, C.muted, 11); }
        txt(c, 'then add the arrows for', 442, 318, C.muted, 11.5); txt(c, 'every place and time of the junctions', 442, 334, C.muted, 11.5);
        c.restore();
        ro.set('j', String(s.j)); ro.set('f', s.j ? 'j' + (s.j > 1 ? '²' : '') + ' ≈ ' + Math.pow(0.0854, s.j).toExponential(1) + ' (|j| ≈ 0.085)' : '1 (no junction)');
        const g = seg.find(q => q[0] === 'g');
        if (g) { const A = P[g[1]], B = P[g[2]], dT = B[1] - A[1], dX = B[0] - A[0], I = dT * dT - dX * dX; ro.set('I', Math.abs(I) < 0.06 * (dT * dT + dX * dX) ? '≈ 0: on the light cone' : (I > 0 ? 'positive (slower than light)' : 'negative (faster than light)') + ', ' + (I / 900).toFixed(1) + ' (30 px)²'); }
        else ro.set('I', 'no photon');
        ro.set('now', ne + ' electron' + (ne === 1 ? '' : 's') + ', ' + np + ' positron' + (np === 1 ? '' : 's') + ', ' + ng + ' photon' + (ng === 1 ? '' : 's'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-diagrams */
  // a wavy line along a polyline of points
  function wavyPath(c, P, col, w, amp, wl) {
    if (P.length < 2) return;
    const out = []; let s = 0;
    for (let i = 0; i < P.length; i++) {
      if (i) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      const a = P[Math.min(i + 1, P.length - 1)], b = P[Math.max(i - 1, 0)], L = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1;
      const nx = -(a[1] - b[1]) / L, ny = (a[0] - b[0]) / L, o = amp * Math.sin(TAU * s / wl);
      out.push([P[i][0] + nx * o, P[i][1] + ny * o]);
    }
    c.strokeStyle = col; c.lineWidth = w; c.beginPath(); out.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
  }
  // the points of a photon line from a to b, bulging sideways by `bulge` (a fraction of the box width)
  function photonPts(a, b, bulge, n) {
    const out = [], mx = (a[0] + b[0]) / 2 + (bulge || 0), my = (a[1] + b[1]) / 2;
    for (let i = 0; i <= n; i++) { const t = i / n, u = (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * mx + t * t * b[0], v = (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * my + t * t * b[1]; out.push([u, v]); }
    return out;
  }
  // electron–electron scattering diagrams; u across (left electron at 0.25, right at 0.75), v = time upwards, both 0..1
  function exchange(perm, name) {
    const n = perm.length, h = i => (i + 1) / (n + 1), L = [[0.25, 0]], R = [[0.75, 0]], g = [];
    for (let i = 0; i < n; i++) { L.push([0.25, h(i)]); R.push([0.75, h(i)]); g.push([[0.25, h(i)], [0.75, h(perm[i])], 0]); }
    L.push([0.25, 1]); R.push([0.75, 1]);
    return { name, e: [L, R], g, loops: [], j: 2 * n };
  }
  function perms(n) { if (n === 1) return [[0]]; const out = []; for (const p of perms(n - 1)) for (let k = 0; k <= p.length; k++) out.push(p.slice(0, k).concat([n - 1], p.slice(k))); return out; }
  function diagramsOf(order) {
    if (order === 1) return [exchange([0], 'one photon exchanged')];
    if (order === 3) return perms(3).map((p, i) => exchange(p, i === 0 ? 'three-photon ladder' : 'three photons, order ' + p.map(x => x + 1).join('-')));
    const vtx = side => { const x = side ? 0.75 : 0.25, o = side ? 0.25 : 0.75; const E = [[x, 0], [x, 0.3], [x, 0.5], [x, 0.7], [x, 1]], F = [[o, 0], [o, 0.5], [o, 1]]; return { name: 'vertex correction (' + (side ? 'right' : 'left') + ')', e: side ? [F, E] : [E, F], g: [[[0.25, 0.5], [0.75, 0.5], 0], [[x, 0.3], [x, 0.7], side ? 0.14 : -0.14]], loops: [], j: 4 }; };
    const self = (side, late) => { const x = side ? 0.75 : 0.25, o = side ? 0.25 : 0.75, a = late ? 0.62 : 0.12, b = late ? 0.88 : 0.38, m = late ? 0.4 : 0.6; const E = [[x, 0]].concat([[x, a], [x, b], [x, m]].sort((p, q) => p[1] - q[1]), [[x, 1]]); const F =[[o, 0], [o, m], [o, 1]]; return { name: 'self-energy, ' + (side ? 'right' : 'left') + (late ? ' outgoing' : ' incoming') + ' (part of the mass)', e: side ? [F, E] : [E, F], g: [[[0.25, m], [0.75, m], 0], [[x, a], [x, b], side ? 0.11 : -0.11]], loops: [], j: 4, mass: true }; };
    const vac = { name: 'vacuum polarization (a pair on the photon)', e: [[[0.25, 0], [0.25, 0.5], [0.25, 1]], [[0.75, 0], [0.75, 0.5], [0.75, 1]]], g: [[[0.25, 0.5], [0.43, 0.5], 0], [[0.57, 0.5], [0.75, 0.5], 0]], loops: [[0.5, 0.5, 0.07]], j: 4 };
    return [exchange([0, 1], 'two-photon ladder'), exchange([1, 0], 'crossed ladder'), vtx(0), vtx(1), vac, self(0, 0), self(0, 1), self(1, 0), self(1, 1)];
  }
  // the twin with the two outgoing electrons swapped (subtracted, for identical fermions)
  function swapped(d) {
    const e = d.e.map(l => l.map(p => p.slice()));
    const L = e[0], R = e[1], a = L[L.length - 1], b = R[R.length - 1];
    L[L.length - 1] = [b[0], b[1]]; R[R.length - 1] = [a[0], a[1]];
    return Object.assign({}, d, { e, name: d.name + ', outgoing swapped', sign: -1 });
  }
  function drawDiagram(c, d, x, y, w, h, C, big, vnow) {
    const X = u => x + u * w, Y = v => y + h - v * h, eCol = 'hsl(210 85% 58%)', gCol = 'hsl(45 95% 52%)';
    for (const l of d.e) {
      c.strokeStyle = eCol; c.lineWidth = big ? 2.6 : 1.6; c.beginPath(); l.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
      if (big) for (let i = 1; i < l.length; i++) { const x0 = X(l[i - 1][0]), y0 = Y(l[i - 1][1]), x1 = X(l[i][0]), y1 = Y(l[i][1]); if (Math.hypot(x1 - x0, y1 - y0) > 30) arw(c, x0 + (x1 - x0) * 0.35, y0 + (y1 - y0) * 0.35, x0 + (x1 - x0) * 0.55, y0 + (y1 - y0) * 0.55, eCol, 2.6); }
    }
    for (const lp of d.loops) {
      const r = lp[2] * w; c.strokeStyle = eCol; c.lineWidth = big ? 2.4 : 1.5; c.beginPath(); c.arc(X(lp[0]), Y(lp[1]), r, 0, TAU); c.stroke();
    }
    for (const g of d.g) {
      const pts = photonPts([X(g[0][0]), Y(g[0][1])], [X(g[1][0]), Y(g[1][1])], g[2] * w, 30);
      wavyPath(c, pts, gCol, big ? 2.2 : 1.3, big ? 4 : 2.2, big ? 13 : 7);
    }
    const J = [];
    for (const g of d.g) for (const p of [g[0], g[1]]) if (!d.loops.some(lp => Math.abs(lp[0] - p[0]) < 0.1 && Math.abs(lp[1] - p[1]) < 0.01)) J.push(p);
    for (const lp of d.loops) { J.push([lp[0] - lp[2], lp[1]]); J.push([lp[0] + lp[2], lp[1]]); }
    c.fillStyle = C.text; for (const p of J) { c.beginPath(); c.arc(X(p[0]), Y(p[1]), big ? 4.5 : 2.4, 0, TAU); c.fill(); }
    if (big && vnow != null) {
      c.strokeStyle = C.accent; c.setLineDash([6, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 6, Y(vnow)); c.lineTo(x + w + 6, Y(vnow)); c.stroke(); c.setLineDash([]);
      const hit = (p, q, col) => { const lo = Math.min(p[1], q[1]), hi = Math.max(p[1], q[1]); if (vnow < lo || vnow > hi || hi - lo < 1e-6) return; const f = (vnow - p[1]) / (q[1] - p[1]); c.fillStyle = col; c.beginPath(); c.arc(X(p[0] + (q[0] - p[0]) * f), Y(vnow), 6, 0, TAU); c.fill(); };
      for (const l of d.e) for (let i = 1; i < l.length; i++) hit(l[i - 1], l[i], eCol);
      for (const g of d.g) hit(g[0], g[1], gCol);
      for (const lp of d.loops) if (Math.abs(vnow - lp[1]) < lp[2] * w / h) { const dy = (vnow - lp[1]) * h / w, dx = Math.sqrt(Math.max(0, lp[2] * lp[2] - dy * dy)); c.fillStyle = eCol; c.beginPath(); c.arc(X(lp[0] - dx), Y(vnow), 5, 0, TAU); c.fill(); c.fillStyle = 'hsl(0 80% 60%)'; c.beginPath(); c.arc(X(lp[0] + dx), Y(vnow), 5, 0, TAU); c.fill(); }
    }
  }

  Hyper.sim('qed-diagrams', {
    title: 'Diagrams for two electrons',
    blurb: `Two electrons come in (bottom) and two go out (top); time runs up. On the right are **all the diagrams of the chosen order** for this scattering; click one to see it large, with a line of "now" sweeping up through it. Straight lines are electrons, wavy lines photons, dots junctions (each one a factor j). The graph shows how big each order's arrows are compared with one exchanged photon: about 1/137 smaller for every extra photon, which is why the first few orders are enough.

**Try this**
- Order 1: one diagram, one photon — the whole of Coulomb's repulsion.
- Order 2: the ladder and the crossed ladder (two photons), the two vertex corrections (an electron emits and reabsorbs a photon around the exchange), vacuum polarization (the photon briefly becomes a pair: watch an electron and a positron appear on the now-line), and four self-energies, which end up as part of the electron's measured mass.
- Order 3: six ways to order three exchanged photons — and many more diagrams with loops, not drawn.
- Tick *swapped twins*: the electrons are identical, so each diagram has a twin with the outgoing electrons exchanged, whose arrow is subtracted.`,
    mount(box, kit) {
      const W0 = 640, H0 = 380, F = {}, GX = 300, GY = 8, GW = 336, GH = 364;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'order', type: 'select', label: 'Order', options: [['1 photon (2 junctions)', 1], ['2 photons or a loop (4 junctions)', 2], ['3 photons (6 junctions)', 3]], value: 2 },
        { id: 'swap', type: 'check', label: 'Show the swapped twins (identical electrons)', value: false },
        { id: 'speed', label: 'Speed of the now-line', min: 0.1, max: 1.5, step: 0.05, value: 0.35 }
      ], () => { build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Diagrams drawn'], ['j', 'Junctions each'], ['s', 'Arrow compared with one photon'], ['sel', 'Selected']]);
      const plot = kit.plot(gb, { x: { label: 'photons exchanged (order)', min: 0.5, max: 4.5 }, y: { label: 'arrow size ÷ one photon', log: true, min: 1e-7, max: 3 } }, 150);
      const ALPHA = 7.2973525693e-3;
      let list = [], sel = 0, vnow = 0, cols = 1, rows = 1;
      function build() {
        const base = diagramsOf(V.order);
        list = []; for (const d of base) { list.push(Object.assign({ sign: 1 }, d)); if (V.swap) list.push(swapped(d)); }
        sel = Math.min(sel, list.length - 1);
        cols = Math.max(1, Math.ceil(Math.sqrt(list.length * GW / GH))); rows = Math.ceil(list.length / cols);
        const pts = [1, 2, 3, 4].map(k => [k, Math.pow(ALPHA, k - 1)]);
        plot.set({ series: [{ pts, label: 'about α^(n − 1)', dots: 4 }], marks: [{ x: V.order, y: Math.pow(ALPHA, V.order - 1), label: 'this order' }] });
      }
      build();
      const cellOf = q => { if (q.x < GX || q.x > GX + GW || q.y < GY || q.y > GY + GH) return -1; const i = Math.floor((q.y - GY) / (GH / rows)) * cols + Math.floor((q.x - GX) / (GW / cols)); return i < list.length ? i : -1; };
      kit.click(st, p => { const i = cellOf(toL(F, p)); if (i >= 0) { sel = i; vnow = 0; } }, p => cellOf(toL(F, p)) >= 0);
      const loop = kit.loop(dt => {
        vnow += dt * V.speed * 0.5; if (vnow > 1.08) vnow = -0.04;
        const C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        const d = list[sel] || list[0];
        // the selected diagram, large
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(8, 8, 284, 364);
        txt(c, 'time ↑', 16, 22, C.muted, 11); txt(c, 'in', 150, 360, C.muted, 11, 'center'); txt(c, 'out', 150, 22, C.muted, 11, 'center');
        drawDiagram(c, d, 20, 40, 260, 300, C, true, clamp(vnow, 0, 1));
        txt(c, (d.sign < 0 ? '− ' : '+ ') + d.name, 150, 346, d.mass ? C.muted : C.text, 11.5, 'center', 'middle', 600);
        // the thumbnails
        const cw = GW / cols, ch = GH / rows;
        list.forEach((q, i) => {
          const x = GX + (i % cols) * cw, y = GY + Math.floor(i / cols) * ch;
          c.strokeStyle = i === sel ? C.accent : (C.border || C.faint); c.lineWidth = i === sel ? 2 : 1; c.strokeRect(x + 2, y + 2, cw - 4, ch - 4);
          drawDiagram(c, q, x + 8, y + 8, cw - 16, ch - 22, C, false, null);
          txt(c, q.sign < 0 ? '−' : '+', x + 8, y + ch - 9, q.sign < 0 ? C.bad : C.ok, 12, 'left', 'middle', 700);
          if (q.mass) txt(c, 'mass', x + cw - 8, y + ch - 9, C.muted, 9.5, 'right');
        });
        if (V.order === 3) txt(c, '+ many diagrams with loops (not drawn)', GX + GW / 2, GY + GH - 4, C.muted, 10.5, 'center');
        c.restore();
        ro.set('n', String(list.length) + (V.order === 3 ? ' (exchange only)' : ''));
        ro.set('j', String(d.j) + ' → factor j^' + d.j);
        ro.set('s', 'about ' + (V.order === 1 ? '1' : Math.pow(ALPHA, V.order - 1).toExponential(1) + ' (α' + (V.order > 2 ? '²' : '') + ')'));
        ro.set('sel', (d.sign < 0 ? '− ' : '+ ') + d.name);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-g2 */
  const G2 = {
    C: [0.5, -0.328478965579193, 1.181241456587, -1.9122457649, 6.737],
    diagrams: ['1', '7', '72', '891', '12 672'],
    other: 4.471e-12,                     // muon and tau loops (2.75e-12), quark loops (1.69e-12), weak force (0.03e-12)
    exp: 0.00115965218059, expErr: 1.3e-13,   // Fan, Myers, Sukra, Gabrielse (2023)
    alphaInv: { rb: 137.035999206, cs: 137.035999046 }
  };
  const g2str = a => '1.' + String(Math.round(a * 1e14)).padStart(14, '0');
  const groupDigits = s => s.slice(0, 2) + s.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ');

  Hyper.sim('qed-g2', {
    title: 'The magnet, digit by digit',
    blurb: `**Left:** a single electron circling in a magnetic field, as in a Penning trap. Its spin (the red–blue magnet) turns a little faster than its orbit, so it creeps ahead of the direction of motion (green): by $a = (g-2)/2 = 0.00116$ of a turn per orbit — magnified here so you can see it. **Right:** QED's prediction for $g/2$ built term by term. Digits that agree with the 2023 measurement turn green. The graph shows the size of each term against the experimental uncertainty.

**Try this**
- Press *Add the next term* repeatedly: Dirac's 1, then Schwinger's one diagram (α/2π) — three digits of the anomaly right at once — then 7, 72, 891 and 12 672 diagrams, and finally the loops of heavier particles. Watch the green digits advance.
- Compare the two measured values of α: the last digits of the theory move by about 1 × 10⁻¹². The electron's magnet is now a test of α itself.
- Set the magnification to 1: the real spin gains only 0.42° per orbit — one full extra turn every 862 orbits.`,
    mount(box, kit) {
      const W0 = 640, H0 = 360, F = {};
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let shown = 0, phi = 0;
      const ctl = kit.controls(box.side, [
        { id: 'al', type: 'select', label: 'Value of α from', options: [['rubidium atoms, 2020 (1/α = 137.035 999 206)', 'rb'], ['caesium atoms, 2018 (1/α = 137.035 999 046)', 'cs']], value: 'rb' },
        { id: 'k', label: 'Magnify the anomaly (left)', min: 1, max: 500, value: 60, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'next', label: 'Add the next term', primary: true }, { id: 'all', label: 'Show all' }, { id: 'again', label: 'Start again' }] }
      ], id => { if (id === 'next') shown = Math.min(6, shown + 1); if (id === 'all') shown = 6; if (id === 'again') shown = 0; if (id === 'k') phi = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['th', 'Theory so far, g/2'], ['ex', 'Experiment (2023), g/2'], ['m', 'Digits that agree'], ['sp', 'Spin ahead of the orbit']]);
      const plot = kit.plot(gb, { x: { label: 'order (6 = heavier particles)', min: 0.5, max: 6.5 }, y: { label: '|term| in g/2', log: true, min: 1e-14, max: 1e-2 } }, 150);
      const terms = () => { const x = 1 / (G2.alphaInv[V.al] * Math.PI); return G2.C.map((c, k) => c * Math.pow(x, k + 1)).concat([G2.other]); };
      function updPlot() {
        const t = terms();
        plot.set({ series: [{ pts: t.map((v, i) => [i + 1, Math.abs(v)]), label: '|term|', dots: 4 }], hlines: [{ y: G2.expErr, label: 'experimental uncertainty' }], marks: shown ? [{ x: shown, y: Math.abs(t[shown - 1]), label: 'last added' }] : [] });
      }
      updPlot();
      let lastShown = -1, lastAl = '';
      const loop = kit.loop(dt => {
        if (shown !== lastShown || V.al !== lastAl) { updPlot(); lastShown = shown; lastAl = V.al; }
        phi += 1.4 * dt;
        const C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        // left: the orbit, the field, the velocity and the spin
        const cx = 150, cy = 195, R = 95, a = G2.exp * V.k;
        c.fillStyle = C.faint; for (let x = 20; x < 290; x += 30) for (let y = 50; y < 345; y += 30) { c.beginPath(); c.arc(x, y, 1.6, 0, TAU); c.fill(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(x, y, 5, 0, TAU); c.stroke(); }
        txt(c, 'B out of the page', 20, 34, C.muted, 11.5);
        c.strokeStyle = C.muted; c.setLineDash([3, 4]); c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.setLineDash([]);
        const ex = cx + R * Math.cos(phi), ey = cy - R * Math.sin(phi), vdir = phi + Math.PI / 2, sdir = vdir + a * phi;
        arw(c, ex, ey, ex + 46 * Math.cos(vdir), ey - 46 * Math.sin(vdir), C.ok, 2.4);
        const mx = Math.cos(sdir), my = -Math.sin(sdir);
        c.lineWidth = 7; c.lineCap = 'butt';
        c.strokeStyle = 'hsl(0 75% 55%)'; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + 26 * mx, ey + 26 * my); c.stroke();
        c.strokeStyle = 'hsl(215 75% 55%)'; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - 26 * mx, ey - 26 * my); c.stroke();
        c.lineCap = 'round';
        c.fillStyle = C.text; c.beginPath(); c.arc(ex, ey, 5, 0, TAU); c.fill();
        const orbits = phi / TAU, ahead = ((a * phi) % TAU) * 180 / Math.PI;
        txt(c, 'orbits: ' + orbits.toFixed(1), 20, 330, C.text, 12); txt(c, 'spin ahead: ' + ahead.toFixed(0) + '°', 160, 330, C.text, 12);
        txt(c, 'velocity', 20, 346, C.ok, 11); txt(c, 'spin (magnet)', 90, 346, 'hsl(0 75% 55%)', 11);
        // right: the digits
        const t = terms(); let sum = 0; for (let i = 0; i < shown; i++) sum += t[i];
        const th = g2str(sum), exs = g2str(G2.exp);
        let match = 0; while (match < th.length && th[match] === exs[match]) match++;
        const sig = th.slice(0, match).replace('.', '').length;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(306, 8, 330, 344);
        txt(c, 'experiment (2023)', 318, 26, C.muted, 11.5);
        txt(c, groupDigits(exs) + ' ± 13', 318, 46, C.text, 15, 'left', 'middle', 600);
        txt(c, 'QED so far', 318, 72, C.muted, 11.5);
        // the theory digits, green while they agree
        c.font = '600 15px ' + fam(); c.textBaseline = 'middle'; c.textAlign = 'left';
        const tg = groupDigits(th); let xx = 318, k = 0;
        for (const ch of tg) {
          if (ch !== ' ') { c.fillStyle = k < match ? C.ok : C.muted; k++; } else c.fillStyle = C.muted;
          c.fillText(ch, xx, 92); xx += c.measureText(ch).width;
        }
        const names = ['½ (α/π)', '(α/π)²', '(α/π)³', '(α/π)⁴', '(α/π)⁵', 'μ, τ, quarks, weak'];
        txt(c, 'Dirac', 318, 122, C.text, 12); txt(c, '1', 630, 122, C.text, 12, 'right');
        names.forEach((n, i) => {
          const y = 144 + 24 * i, on = i < shown, col = on ? C.text : C.faint;
          txt(c, n, 318, y, col, 12); txt(c, i < 5 ? G2.diagrams[i] + (i ? ' diagrams' : ' diagram') : 'loops', 430, y, on ? C.muted : C.faint, 11);
          txt(c, (t[i] >= 0 ? '+' : '−') + Math.abs(t[i]).toExponential(4), 630, y, col, 12, 'right');
        });
        txt(c, shown < 6 ? 'press "Add the next term"' : 'all terms: agreement to about 1 part in 10¹²', 318, 300, C.muted, 11.5);
        txt(c, 'difference: ' + ((sum - G2.exp) >= 0 ? '+' : '−') + Math.abs(sum - G2.exp).toExponential(2), 318, 320, C.text, 12);
        txt(c, 'α from ' + (V.al === 'rb' ? 'rubidium (2020)' : 'caesium (2018)'), 318, 338, C.muted, 11);
        c.restore();
        ro.set('th', groupDigits(th)); ro.set('ex', groupDigits(exs) + ' (± 13 in the last two)');
        ro.set('m', sig + ' significant figures');
        ro.set('sp', (a * 360).toFixed(a * 360 < 1 ? 2 : 1) + '° per orbit' + (V.k > 1 ? ' (magnified ×' + V.k.toFixed(0) + ')' : ' (real)'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-renorm */
  // charged particles in loops: rest energy (GeV; rough effective values for the light quarks) and (2/3π)·N_colour·charge²
  const LOOPS = [['e', 0.000511, 1], ['μ', 0.10566, 1], ['τ', 1.777, 1], ['u', 0.3, 4 / 3], ['d', 0.3, 1 / 3], ['s', 0.5, 1 / 3], ['c', 1.5, 4 / 3], ['b', 4.7, 1 / 3], ['t', 173, 4 / 3]];
  const invAlphaAt = (Q, all) => { let v = 137.035999; for (const [, m, w] of (all ? LOOPS : LOOPS.slice(0, 1))) if (Q > m) v -= 2 / (3 * Math.PI) * w * Math.log(Q / m); return v; };

  Hyper.sim('qed-renorm', {
    title: 'A cut-off that drops out',
    blurb: `**Left:** an electron in its cloud of short-lived electron–positron pairs. The positrons lean in and the electrons lean out, so the cloud screens the charge; a probe that reaches inside the dashed circle sees less of the screening and so more charge. **Right:** the numbers of renormalization. The cut-off Λ says where the sums over loops are stopped; the bare charge needed at Λ depends strongly on it, but once everything is written in terms of the charge measured at low energy (1/137.036), the prediction at any energy below Λ does not depend on Λ at all. The graph shows 1/α running with energy — slowly, like a [[?logarithm]].

**Try this**
- Slide the cut-off from 10 GeV to 10²⁰⁰ GeV: the bare value swings, the prediction stays put. The cut-off has dropped out.
- Push the cut-off past about 10²⁷⁷ GeV: the bare 1/α would have to be zero or negative — an infinite bare charge. This is the Landau pole.
- Move the probe closer (smaller distance, higher energy): the charge seen grows, by less than a per cent with electron loops alone.
- Include the other charged particles: at the Z boson (91 GeV, about 2 × 10⁻¹⁸ m) 1/α comes down to about 128, as measured.`,
    mount(box, kit) {
      const W0 = 640, H0 = 330, F = {}, R = kit.qm.rng(137);
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'lam', label: 'Cut-off Λ (power of ten, in GeV)', min: 1, max: 300, step: 1, value: 19 },
        { id: 'probe', label: 'Probe distance (power of ten, in metres)', min: -18, max: -11, step: 0.1, value: -15 },
        { id: 'all', type: 'check', label: 'Include muon, tau and quark loops (rough)', value: false }
      ], () => updPlot());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Cut-off Λ'], ['bare', 'Bare 1/α needed at Λ'], ['obs', 'Measured 1/α at low energy'], ['Q', 'Probe energy ħc/r'], ['pred', 'Predicted 1/α at the probe']]);
      const plot = kit.plot(gb, { x: { label: 'energy of the probe (GeV)', log: true, min: 1e-4, max: 1e20 }, y: { label: '1/α', min: 120, max: 140 }, legend: true }, 160);
      const Qprobe = () => 1.97327e-16 / Math.pow(10, V.probe);
      function updPlot() {
        const pts = [], ptsE = [];
        for (let e = -4; e <= 20; e += 0.1) { const Q = Math.pow(10, e); pts.push([Q, invAlphaAt(Q, V.all)]); }
        const series = [{ pts, label: V.all ? '1/α, all charged particles (rough)' : '1/α, electron loops' }];
        if (V.all) { for (let e = -4; e <= 20; e += 0.1) { const Q = Math.pow(10, e); ptsE.push([Q, invAlphaAt(Q, false)]); } series.push({ pts: ptsE, label: 'electron loops only', dash: [5, 4] }); }
        const vl = [{ x: Qprobe(), label: 'probe' }]; if (V.lam <= 20) vl.push({ x: Math.pow(10, V.lam), label: 'cut-off' });
        plot.set({ series, vlines: vl, hlines: [{ y: 137.036, label: '137.036' }] });
      }
      updPlot();
      // the virtual pairs of the cloud
      const pairs = []; for (let i = 0; i < 80; i++) pairs.push({ a: R() * TAU, r: 26 + 130 * Math.sqrt(R()), ph: R() * TAU, w: 0.6 + 1.4 * R() });
      const loop = kit.loop(dt => {
        const C = kit.colors(), c = st.begin();
        fit(c, st, W0, H0, F);
        const cx = 160, cy = 160, rp = 16 + 140 * (V.probe + 18) / 7, Q = Qprobe();
        // the cloud
        for (const p of pairs) {
          p.ph += p.w * dt; const life = Math.sin(p.ph); if (life <= 0) { if (life > -0.02) { p.a = R() * TAU; p.r = 26 + 130 * Math.sqrt(R()); } continue; }
          const x = cx + p.r * Math.cos(p.a), y = cy + p.r * Math.sin(p.a), ux = Math.cos(p.a), uy = Math.sin(p.a), inside = p.r < rp, al = (inside ? 0.25 : 0.9) * life;
          c.fillStyle = 'hsl(0 80% 60% / ' + al.toFixed(3) + ')'; c.beginPath(); c.arc(x - 4 * ux, y - 4 * uy, 3.2, 0, TAU); c.fill();
          c.fillStyle = 'hsl(210 85% 60% / ' + al.toFixed(3) + ')'; c.beginPath(); c.arc(x + 4 * ux, y + 4 * uy, 3.2, 0, TAU); c.fill();
        }
        c.fillStyle = 'hsl(210 85% 55%)'; c.beginPath(); c.arc(cx, cy, 13, 0, TAU); c.fill();
        txt(c, 'e⁻', cx, cy + 1, '#fff', 12, 'center', 'middle', 700);
        c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, rp, 0, TAU); c.stroke(); c.setLineDash([]);
        txt(c, 'probe reaches r = 10^' + V.probe.toFixed(1) + ' m', cx, cy + rp + 12 > 318 ? 318 : cy + rp + 12, C.accent, 11.5, 'center');
        txt(c, '+ positron   − electron (virtual pairs)', 12, 14, C.muted, 11);
        // the numbers of renormalization, as bars on a 1/α scale
        const bare = invAlphaAt(Math.pow(10, V.lam), V.all), obs = 137.036, pred = Q < Math.pow(10, V.lam) ? invAlphaAt(Q, V.all) : null;
        const x0 = 336, x1 = 628, s = v => x0 + (x1 - x0) * clamp(v, 0, 140) / 140;
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(326, 8, 310, 314);
        txt(c, '1/α (0 → 140)', 336, 24, C.muted, 11.5);
        const bar = (y, v, label, col, note) => {
          c.fillStyle = C.grid; c.fillRect(x0, y, x1 - x0, 16);
          if (v != null && v > 0) { c.fillStyle = col; c.fillRect(x0, y, s(v) - x0, 16); }
          txt(c, label, x0, y - 9, C.text, 12, 'left', 'middle', 600);
          txt(c, note, x1, y - 9, col, 12, 'right', 'middle', 600);
        };
        bar(60, bare, 'bare, at the cut-off Λ = 10^' + V.lam + ' GeV', 'hsl(0 75% 58%)', bare > 0 ? bare.toFixed(2) : 'infinite charge!');
        bar(120, obs, 'measured, at low energy', C.ok, obs.toFixed(3));
        bar(180, pred, 'predicted at the probe (' + kit.fmt(Q, 3) + ' GeV)', C.accent, pred != null ? pred.toFixed(3) : 'beyond the cut-off');
        // how much the bare value moved while the prediction did not
        txt(c, 'the bare number depends on Λ;', 336, 232, C.muted, 12);
        txt(c, 'the prediction, written in the measured', 336, 250, C.muted, 12);
        txt(c, 'charge, does not.', 336, 268, C.muted, 12);
        const rel = pred != null ? Math.sqrt(obs / pred) : null;
        txt(c, 'charge seen at the probe: ' + (rel != null ? rel.toFixed(4) + ' × e' : '—'), 336, 298, C.text, 12.5, 'left', 'middle', 600);
        c.restore();
        ro.set('L', '10^' + V.lam + ' GeV' + (V.lam > 19 ? ' (beyond the Planck energy)' : ''));
        ro.set('bare', bare > 0 ? bare.toFixed(3) : 'none: beyond the Landau pole');
        ro.set('obs', '137.036 (input)');
        ro.set('Q', kit.fmt(Q, 3) + ' GeV');
        ro.set('pred', pred != null ? pred.toFixed(3) + ' (independent of Λ)' : 'the probe is beyond the cut-off');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qed-beyond */
  const QCOL = { r: 'hsl(0 80% 58%)', g: 'hsl(130 65% 45%)', b: 'hsl(215 85% 60%)' };
  const BEYOND = {
    qed: { name: 'QED: electrons exchange a photon',
      seg: [['e', [90, 20], [120, 170], 'e⁻'], ['e', [120, 170], [80, 330], 'e⁻'], ['e', [320, 20], [290, 180], 'e⁻'], ['e', [290, 180], [330, 330], 'e⁻'], ['g', [120, 170], [290, 180]]],
      card: ['Carrier: the photon', 'mass 0, no charge', 'range: unlimited (a 1/r² force)', 'coupling α = 1/137 (about 1/128 at 91 GeV)', 'junction: electron–electron–photon'] },
    qcd: { name: 'Quarks exchange a gluon (colours swap)',
      seg: [['q', [90, 20], [120, 170], 'r'], ['q', [120, 170], [80, 330], 'g'], ['q', [320, 20], [290, 180], 'g'], ['q', [290, 180], [330, 330], 'r'], ['G', [120, 170], [290, 180], 'rg']],
      card: ['Carrier: gluons (8 kinds)', 'mass 0, but they carry colour', 'range: confined to about 10⁻¹⁵ m', 'α_s ≈ 0.118 at 91 GeV, ≈ 0.3 at 2 GeV', 'a red quark that emits a red–antigreen', 'gluon turns green'] },
    ggg: { name: 'Gluons interact with gluons',
      seg: [['q', [70, 20], [110, 140], 'b'], ['q', [110, 140], [70, 330], 'r'], ['q', [330, 20], [300, 230], 'g'], ['q', [300, 230], [340, 330], 'b'], ['G', [110, 140], [200, 180], 'br'], ['G', [200, 180], [300, 230], 'bg'], ['G', [200, 180], [230, 330], 'gr']],
      card: ['Junctions of three and four gluons', 'have no photon counterpart.', 'Gluon loops make α_s grow at', 'long distances: quarks are', 'confined, and fall almost free', 'at high energy (asymptotic freedom).'] },
    beta: { name: 'Beta decay: a d quark emits a W⁻',
      seg: [['q', [60, 20], [60, 330], 'u'], ['q', [95, 20], [95, 330], 'd'], ['q', [130, 20], [150, 150], 'd'], ['q', [150, 150], [150, 330], 'u'], ['W', [150, 150], [260, 200]], ['e', [260, 200], [340, 330], 'e⁻'], ['n', [390, 250], [260, 200], 'ν̄']],
      card: ['Carrier: W⁻ (80.4 GeV, charge −1)', 'range about 2.5 × 10⁻¹⁸ m', 'changes a d quark into a u quark:', 'neutron (udd) → proton (uud)', '+ electron + antineutrino', 'a free neutron lasts about 15 min'] },
    z: { name: 'A neutrino scatters off an electron (Z)',
      seg: [['n', [90, 20], [120, 170], 'ν'], ['n', [120, 170], [80, 330], 'ν'], ['e', [320, 20], [290, 180], 'e⁻'], ['e', [290, 180], [330, 330], 'e⁻'], ['W', [120, 170], [290, 180]]],
      card: ['Carrier: Z⁰ (91.19 GeV, neutral)', 'range about 2.2 × 10⁻¹⁸ m', 'neutrinos feel only the weak force', '(and gravity)', 'first seen as "neutral currents"', 'at CERN in 1973'] }
  };
  function curly(c, x0, y0, x1, y1, col, w) {
    const L = Math.hypot(x1 - x0, y1 - y0); if (!(L > 1)) return;
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L, r = 5, k = TAU / 10, n = Math.max(20, Math.round(L * 1.5));
    c.strokeStyle = col; c.lineWidth = w; c.beginPath();
    for (let i = 0; i <= n; i++) { const s = L * i / n, a = r * Math.cos(k * s) - r, b = r * Math.sin(k * s), x = x0 + ux * (s + a) - uy * b, y = y0 + uy * (s + a) + ux * b; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
    c.stroke();
  }

  Hyper.sim('qed-beyond', {
    title: 'Beyond QED: the same game, other players',
    blurb: `Space-time pictures (time **up**) of the other forces, drawn exactly as in QED: straight lines for particles of matter, wavy lines for photons, curly lines for **gluons**, dashed waves for the heavy **W and Z**. A line of "now" sweeps up each picture. The card describes the carrier, and the graph shows how the strengths of the three forces of the Standard Model change with energy (as 1/α, so a stronger force is lower).

**Try this**
- *Quarks exchange a gluon*: the quarks swap colours — a gluon carries colour away.
- *Gluons interact with gluons*: a three-gluon junction, impossible for photons. It is why the strong force behaves in the opposite way to QED.
- *Beta decay*: a d quark turns into a u quark by emitting a W⁻, which becomes an electron and an antineutrino (whose line points backwards in time, like a positron's).
- In the graph, follow the strong coupling (1/α₃) from low to high energy: it gets weaker. The three lines nearly meet — but not quite — far above any accelerator's reach.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340, T0 = 335, F = {};
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'story', type: 'select', label: 'Picture', options: Object.keys(BEYOND).map(k => [BEYOND[k].name, k]), value: 'qcd' },
        { id: 'E', label: 'Energy for the read-outs (power of ten, in GeV)', min: 0.3, max: 19, step: 0.05, value: 1.96 },
        { id: 'speed', label: 'Speed of the now-line', min: 0.2, max: 2, step: 0.1, value: 0.7 }
      ], id => { if (id === 'E') updPlot(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Q', 'Energy'], ['as', 'Strong coupling α_s'], ['a2', 'Weak coupling α₂'], ['aem', 'Electromagnetic α']]);
      const plot = kit.plot(gb, { x: { label: 'energy (GeV)', log: true, min: 1, max: 1e19 }, y: { label: '1/α (lower = stronger)', min: 0, max: 70 }, legend: true }, 170);
      const MZ = 91.19, MT = 173;
      const inv3 = Q => Q <= MT ? (23 / (12 * Math.PI)) * Math.log(Q * Q / (0.088 * 0.088)) : (23 / (12 * Math.PI)) * Math.log(MT * MT / (0.088 * 0.088)) + 7 / TAU * Math.log(Q / MT);
      const inv2 = Q => 29.58 + (19 / 6) / TAU * Math.log(Q / MZ);
      const inv1 = Q => 59.02 - 4.1 / TAU * Math.log(Q / MZ);
      function updPlot() {
        const s3 = [], s2 = [], s1 = [];
        for (let e = 0.3; e <= 19; e += 0.05) { const Q = Math.pow(10, e); s3.push([Q, inv3(Q)]); if (Q >= MZ) { s2.push([Q, inv2(Q)]); s1.push([Q, inv1(Q)]); } }
        plot.set({ series: [{ pts: s3, label: '1/α₃ strong' }, { pts: s2, label: '1/α₂ weak' }, { pts: s1, label: '1/α₁ hypercharge (scaled by 5/3)' }], vlines: [{ x: Math.pow(10, V.E), label: 'read-outs' }] });
      }
      updPlot();
      let now = 0;
      const loop = kit.loop(dt => {
        now += dt * 60 * V.speed; if (now > 350) now = 0;
        const s = BEYOND[V.story], C = kit.colors(), c = st.begin(), Y = t => T0 - t;
        fit(c, st, W0, H0, F);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(12, T0); c.lineTo(400, T0); c.moveTo(12, T0); c.lineTo(12, 8); c.stroke();
        txt(c, 'time ↑', 18, 12, C.muted, 11); txt(c, 'space →', 396, T0 - 8, C.muted, 11, 'right');
        const eCol = 'hsl(210 85% 58%)', gCol = 'hsl(45 95% 52%)', wCol = 'hsl(280 65% 62%)', nCol = C.muted;
        const colOf = q => { const k = q[0], tag = q[3] || ''; if (k === 'e') return eCol; if (k === 'n') return nCol; if (k === 'g') return gCol; if (k === 'W') return wCol; if (k === 'G') return QCOL[tag[0]] || gCol; return QCOL[tag] || (tag === 'u' ? 'hsl(25 85% 55%)' : tag === 'd' ? 'hsl(170 60% 42%)' : C.text); };
        for (const q of s.seg) {
          const [k, A, B, tag] = q, x0 = A[0], y0 = Y(A[1]), x1 = B[0], y1 = Y(B[1]), col = colOf(q);
          if (k === 'g') wavy(c, x0, y0, x1, y1, gCol, 2.2);
          else if (k === 'G') { curly(c, x0, y0, x1, y1, QCOL[tag[0]] || gCol, 2); curly(c, x0, y0 + 1.5, x1, y1 + 1.5, QCOL[tag[1]] || gCol, 1.2); }
          else if (k === 'W') { c.setLineDash([7, 4]); wavy(c, x0, y0, x1, y1, wCol, 2.4, 5, 16); c.setLineDash([]); }
          else { if (k === 'n') c.setLineDash([5, 3]); eline(c, x0, y0, x1, y1, col, k === 'q' ? 3 : 2.4); c.setLineDash([]); }
          if ((k === 'e' || k === 'n' || k === 'q') && tag) { const lx = B[1] > A[1] ? x1 : x0, ly = B[1] > A[1] ? y1 : y0; txt(c, k === 'q' && QCOL[tag] ? 'q' : tag, lx + 8, ly + (B[1] > A[1] ? 8 : -8), col, 12, 'left', 'middle', 700); }
        }
        // junctions
        const J = new Map(); for (const q of s.seg) for (const p of [q[1], q[2]]) { const key = p[0] + ',' + p[1]; J.set(key, (J.get(key) || 0) + 1); }
        c.fillStyle = C.text; for (const [key, n] of J) if (n >= 2) { const [x, t] = key.split(',').map(Number); c.beginPath(); c.arc(x, Y(t), 4.5, 0, TAU); c.fill(); }
        if (V.story === 'beta') { txt(c, 'neutron (udd)', 95, T0 - 4, C.muted, 11, 'center'); txt(c, 'proton (uud)', 105, 12, C.muted, 11, 'center'); }
        // now-line
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(12, Y(now)); c.lineTo(400, Y(now)); c.stroke(); c.setLineDash([]);
        for (const q of s.seg) {
          const [k, A, B] = q, lo = Math.min(A[1], B[1]), hi = Math.max(A[1], B[1]);
          if (now < lo || now > hi || hi - lo < 1e-6) continue;
          const f = (now - A[1]) / (B[1] - A[1]);
          c.fillStyle = colOf(q); c.beginPath(); c.arc(A[0] + (B[0] - A[0]) * f, Y(now), 6, 0, TAU); c.fill();
        }
        // the card
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(410, 8, 225, 324);
        txt(c, s.name, 420, 26, C.text, 12, 'left', 'middle', 700);
        s.card.forEach((line, i) => txt(c, line, 420, 54 + 20 * i, i === 0 ? C.accent : C.text2 || C.text, 12, 'left', 'middle', i === 0 ? 700 : 500));
        const key = [['electron, neutrino', eCol], ['quark (colour)', QCOL.r], ['photon', gCol], ['W, Z', wCol]];
        key.forEach(([n, col], i) => { c.fillStyle = col; c.fillRect(420, 250 + 18 * i, 14, 4); txt(c, n, 440, 252 + 18 * i, C.muted, 11); });
        c.restore();
        const Q = Math.pow(10, V.E);
        ro.set('Q', kit.fmt(Q, 3) + ' GeV');
        ro.set('as', (1 / inv3(Q)).toFixed(3) + (Q < 2 ? ' (one loop: rough here)' : ''));
        ro.set('a2', Q >= MZ ? '1/' + inv2(Q).toFixed(1) : '1/29.6 (below the Z: shown at 91 GeV)');
        ro.set('aem', Q >= MZ ? '1/' + (inv2(Q) + (5 / 3) * inv1(Q)).toFixed(1) : '≈ 1/128 at 91 GeV, 1/137 at low energy');
      }, box.stage);
      loop.start();
    }
  });

})();
