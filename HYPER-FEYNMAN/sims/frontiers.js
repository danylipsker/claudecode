/* HYPER-FEYNMAN · sims/frontiers.js — simulations for Feynman's frontiers (prefix fr-).
 *   fr-pinhead    zoom from a full-size page to a pin lying on it, the encyclopaedia on its head, one letter, one dot, atoms
 *   fr-qubits     three qubits: a circuit whose eight amplitudes you watch turn, and the 2ⁿ memory wall
 *   fr-gates      reversible and irreversible logic gates: mappings, bits lost, Landauer heat
 *   fr-landauer   a one-molecule memory: erasing by compression costs kT ln 2 on average; Szilard's engine gives it back
 *   fr-helium     Landau's critical velocity from the phonon–roton curve, and an ion shedding rotons
 *   fr-vortices   a rotating bucket of superfluid: quantised vortex lines and the flow they make
 *   fr-parity     Wu's cobalt-60 experiment and its mirror image; left-handed neutrinos; the dates of 1956–58
 *   fr-partons    deep inelastic scattering: electrons knock single partons out of a fast (flattened) proton
 *   fr-oring      the booster joint at ignition and the iced-water test: cold rubber springs back too slowly
 *   fr-risk       1 in 100 or 1 in 100 000: flying the Shuttle programme with a chosen risk per flight
 *   fr-timeline   Feynman's life in physics on three tracks
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- small helpers (private to this file) */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fontOf = () => { try { return getComputedStyle(document.body).fontFamily || 'sans-serif'; } catch (e) { return 'sans-serif'; } };
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  // 2.87e-21 -> "2.87 × 10⁻²¹"
  function sci(v, d) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(v)));
    if (e >= -2 && e <= 4) return (+v.toPrecision(d || 3)).toString();
    const m = v / Math.pow(10, e);
    return m.toFixed(d == null ? 2 : Math.max(0, d - 1)) + ' × 10' + String(e).split('').map(c => SUP[c] || c).join('');
  }
  function sig(v, n) { if (!Number.isFinite(v)) return '—'; return String(+v.toPrecision(n || 3)); }
  // a length with a sensible unit
  function fmtLen(m) {
    const U = [[1, 'm'], [1e-3, 'mm'], [1e-6, 'µm'], [1e-9, 'nm'], [1e-12, 'pm']];
    for (const [f, n] of U) if (Math.abs(m) >= f * 0.9995) return sig(m / f, 3) + ' ' + n;
    return sig(m / 1e-12, 3) + ' pm';
  }
  // a stage drawn in a fixed design space (w × h), scaled to fit and centred
  function fit(st, w, h) { const s = Math.min(st.W / w, st.H / h); return { s, ox: (st.W - w * s) / 2, oy: (st.H - h * s) / 2 }; }
  function hash3(a, b, c) { let h = (Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663) ^ Math.imul(c | 0, 83492791)) >>> 0; h ^= h >>> 13; h = Math.imul(h, 1274126177) >>> 0; return h ^ (h >>> 16); }
  // word-wrap text into lines no wider than maxW
  function wrap(c, text, maxW) {
    const words = String(text).split(' '), lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur);
    return lines;
  }

  /* ================================================================ fr-pinhead */
  // the page layout, in metres at full size: 5 × 7 dot letters of the finest printing dots (1/120 inch)
  const PW = 0.22, PH = 0.28, MARG = 0.016, GAP = 0.008, DOT = 0.0254 / 120, CH = 6 * DOT, LS = 10 * DOT;
  const COLW = (PW - 2 * MARG - GAP) / 2, NCH = Math.floor(COLW / CH), NL = Math.floor((PH - 2 * MARG) / LS);
  const GLYPHS = {
    F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'], E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'], N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'], A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'], O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'], S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'], L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111']
  };
  const LETTERS = Object.keys(GLYPHS);
  const BITS = {}; for (const k of LETTERS) BITS[k] = GLYPHS[k].map(r => r.split('').map(Number));
  // the target: line 58, column 0, character 30 is an F, and its dot (2, 3) sits at the world origin
  const TL = 58, TC = 0, TI = 30;
  const XT = MARG + TC * (COLW + GAP) + TI * CH + 2.5 * DOT, YT = MARG + TL * LS + 3.5 * DOT;
  const letterAt = (pg, L, col, ci) => {
    if (pg === 0 && L === TL && col === TC && ci === TI) return 'F';
    const h = hash3(pg + L * 131, col * 977 + 7, ci);
    if (h % 6 === 0 || (ci > NCH - 6 && h % 3 === 0)) return null;   // spaces, and ragged line ends
    return LETTERS[(h >>> 4) % LETTERS.length];
  };

  Hyper.sim('fr-pinhead', {
    title: 'The encyclopaedia on the head of a pin',
    blurb: `A full-size page of small print with a pin lying on it. On the pinhead the whole encyclopaedia has been written, every length reduced $M$ times (25 000 in Feynman's talk). Zoom in through nine powers of ten: the pinhead, the dust of pages on it, one page, its lines, one letter built of printing dots — and finally the atoms inside one dot. Each dot was 1/120 inch (0.21 mm) at full size, the finest dot of halftone printing; the letters are 5 × 7 of them. The read-out counts how many atoms each dot keeps ([[?scientific-notation|powers of ten]] throughout).

**Try this**
- Press *Fly in* and watch the scale bar. Notice that one full-size letter is about as big as the whole pinhead.
- At the atoms, count across one dot: about 34 atoms at $M$ = 25 000. The dark atoms are the ink, the pale ones the metal of the pin.
- Raise the reduction to 200 000: the dots shrink to about 4 atoms — still (just) writable. How far could you go?
- At $M$ = 25 000 about 20 000 pages of 22 × 28 cm fit on a 1.6 mm head — roughly a large encyclopaedia. Make the pinhead 1 mm: how large must $M$ become to keep 20 000 pages?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Zoom: width of the view', min: -8.7, max: -0.3, step: 0.01, value: -0.4, fmt: v => fmtLen(Math.pow(10, v)) },
        { id: 'M', label: 'Reduction M (in length)', min: 2000, max: 200000, value: 25000, log: true, sig: 3 },
        { id: 'd', label: 'Diameter of the pinhead', min: 0.5, max: 3, step: 0.01, value: 1.59, unit: 'mm' },
        { id: 'a', label: 'Spacing of the atoms', min: 0.15, max: 0.5, step: 0.01, value: 0.25, unit: 'nm' },
        { type: 'buttons', items: [{ id: 'in', label: 'Fly in', primary: true }, { id: 'out', label: 'Fly out' }, { id: 'stop', label: 'Stop' }] }
      ], id => { if (id === 'in') fly = -1; else if (id === 'out') fly = 1; else if (id === 'stop' || id === 'z') fly = 0; dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Width of the view'], ['see', 'You are looking at'], ['pages', 'Pages that fit on the head'], ['page', 'One page, reduced'], ['letter', 'One letter, reduced'], ['dot', 'One printing dot, reduced']]);
      let fly = 0, dirty = true;
      const PAPER = 'hsl(45 35% 93%)', INK = 'hsl(222 30% 20%)', STEEL = 'hsl(210 10% 62%)', STEEL2 = 'hsl(210 10% 48%)';
      const loop = kit.loop(dt => {
        if (fly) {
          const z = clamp(V.z + fly * 0.5 * dt, -8.7, -0.3);
          if (z === -8.7 || z === -0.3) fly = 0;
          ctl.set('z', z); dirty = true;
        }
        if (!dirty) return;
        dirty = false;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W / 2, cy = H / 2;
        const fov = Math.pow(10, V.z), sc = W / fov, M = V.M, R = V.d * 1e-3 / 2, a = V.a * 1e-9;
        const wp = PW / M, hp = PH / M, oX = (XT - PW / 2) / M, oY = (YT - PH / 2) / M;
        const toX = x => cx + x * sc, toY = y => cy + y * sc;
        const wx0 = -cx / sc, wx1 = (W - cx) / sc, wy0 = -cy / sc, wy1 = (H - cy) / sc;   // the view in world metres
        c.fillStyle = C.bg2 || C.bg; c.fillRect(0, 0, W, H);

        // draw the text of one page whose top-left corner is at world (X0, Y0), scaled by k (1 = full size)
        function pageText(pg, X0, Y0, k, alpha) {
          const lp = LS * k * sc, chp = CH * k * sc, dp = DOT * k * sc;
          const lx0 = (wx0 - X0) / k, lx1 = (wx1 - X0) / k, ly0 = (wy0 - Y0) / k, ly1 = (wy1 - Y0) / k;
          if (lx1 < 0 || lx0 > PW || ly1 < 0 || ly0 > PH) return;
          c.globalAlpha = alpha; c.fillStyle = INK;
          if (lp < 1.3) {   // columns as grey blocks
            c.globalAlpha = alpha * 0.35;
            for (let col = 0; col < 2; col++) c.fillRect(toX(X0 + (MARG + col * (COLW + GAP)) * k), toY(Y0 + MARG * k), COLW * k * sc, NL * LS * k * sc);
            c.globalAlpha = 1; return;
          }
          const L0 = clamp(Math.floor((ly0 - MARG) / LS) - 1, 0, NL - 1), L1 = clamp(Math.ceil((ly1 - MARG) / LS) + 1, 0, NL - 1);
          for (let L = L0; L <= L1; L++) {
            const yL = Y0 + (MARG + L * LS) * k;
            for (let col = 0; col < 2; col++) {
              const xc = MARG + col * (COLW + GAP);
              if (chp < 2.5) { c.globalAlpha = alpha * 0.6; c.fillRect(toX(X0 + xc * k), toY(yL), (NCH * CH - DOT) * k * sc, 7 * DOT * k * sc); continue; }
              const i0 = clamp(Math.floor((lx0 - xc) / CH) - 1, 0, NCH - 1), i1 = clamp(Math.ceil((lx1 - xc) / CH) + 1, 0, NCH - 1);
              if (i0 > i1) continue;
              if (dp < 3.5) {   // words as dark bars
                c.globalAlpha = alpha * 0.85;
                let run = -1;
                for (let ci = i0; ci <= i1 + 1; ci++) {
                  const on = ci <= i1 && letterAt(pg, L, col, ci);
                  if (on && run < 0) run = ci;
                  if (!on && run >= 0) { c.fillRect(toX(X0 + (xc + run * CH) * k), toY(yL), ((ci - run) * CH - DOT) * k * sc, 7 * DOT * k * sc); run = -1; }
                }
                continue;
              }
              c.globalAlpha = alpha;
              for (let ci = i0; ci <= i1; ci++) {
                const ch = letterAt(pg, L, col, ci); if (!ch) continue;
                const B = BITS[ch], bx = X0 + (xc + ci * CH) * k;
                for (let gy = 0; gy < 7; gy++) for (let gx = 0; gx < 5; gx++) if (B[gy][gx]) {
                  const X = toX(bx + (gx + 0.5) * DOT * k), Y = toY(yL + (gy + 0.5) * DOT * k);
                  if (X < -dp || X > W + dp || Y < -dp || Y > H + dp) continue;
                  if (dp < 7) c.fillRect(X - dp * 0.45, Y - dp * 0.45, dp * 0.9, dp * 0.9);
                  else { c.beginPath(); c.arc(X, Y, dp * 0.47, 0, 6.2832); c.fill(); }
                }
              }
            }
          }
          c.globalAlpha = 1;
        }

        // 1. the full-size page the pin lies on (fades out once the view is smaller than a few letters)
        const ghost = clamp((V.z - Math.log10(1.5e-3)) / 0.6, 0, 1);
        if (ghost > 0) {
          const GX = -0.08, GY = -0.11;
          c.globalAlpha = ghost; c.fillStyle = PAPER; c.fillRect(toX(GX), toY(GY), PW * sc, PH * sc); c.globalAlpha = 1;
          pageText(7777, GX, GY, 1, ghost);
        }
        // 2. the pin: a shaft and the head
        const Rp = R * sc;
        if (Rp < 6 * W) {
          if (fov > R * 3) {
            const ang = 0.55, L = 0.03, w = 0.6e-3 * sc;
            c.save(); c.translate(cx, cy); c.rotate(ang);
            c.fillStyle = STEEL2; c.beginPath(); c.moveTo(0, -w / 2); c.lineTo(L * sc, -w / 8); c.lineTo(L * sc + 6 * w, 0); c.lineTo(L * sc, w / 8); c.lineTo(0, w / 2); c.closePath(); c.fill();
            c.restore();
          }
          c.fillStyle = STEEL; c.beginPath(); c.arc(cx, cy, Rp, 0, 6.2832); c.fill();
        } else { c.fillStyle = STEEL; c.fillRect(0, 0, W, H); }
        // 3. the encyclopaedia on the head, clipped to the head
        const pagePx = wp * sc;
        c.save();
        if (Rp < 2 * W) { c.beginPath(); c.arc(cx, cy, Math.max(0, Rp * 0.985), 0, 6.2832); c.clip(); }
        if (pagePx < 3) {
          c.fillStyle = PAPER; c.globalAlpha = 0.9; c.beginPath(); c.arc(cx, cy, Math.max(0, Math.min(Rp * 0.985, 4 * W)), 0, 6.2832); c.fill(); c.globalAlpha = 1;
          if (pagePx >= 1.1) {
            c.strokeStyle = 'hsl(222 20% 40% / .35)'; c.lineWidth = 0.6; c.beginPath();
            for (let i = Math.floor((wx0 + oX) / wp); i <= Math.ceil((wx1 + oX) / wp); i++) { const X = toX((i + 0.5) * wp - oX); c.moveTo(X, 0); c.lineTo(X, H); }
            for (let j = Math.floor((wy0 + oY) / hp); j <= Math.ceil((wy1 + oY) / hp); j++) { const Y = toY((j + 0.5) * hp - oY); c.moveTo(0, Y); c.lineTo(W, Y); }
            c.stroke();
          }
        } else {
          const i0 = Math.floor((wx0 + oX) / wp) - 1, i1 = Math.ceil((wx1 + oX) / wp) + 1, j0 = Math.floor((wy0 + oY) / hp) - 1, j1 = Math.ceil((wy1 + oY) / hp) + 1;
          const count = (i1 - i0 + 1) * (j1 - j0 + 1);
          if (count > 4000) {
            c.fillStyle = PAPER; c.fillRect(0, 0, W, H);
            c.strokeStyle = 'hsl(222 20% 40% / .4)'; c.lineWidth = 0.6; c.beginPath();
            for (let i = i0; i <= i1; i++) { const X = toX((i + 0.5) * wp - oX); c.moveTo(X, 0); c.lineTo(X, H); }
            for (let j = j0; j <= j1; j++) { const Y = toY((j + 0.5) * hp - oY); c.moveTo(0, Y); c.lineTo(W, Y); }
            c.stroke();
          } else {
            for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
              const pcx = i * wp - oX, pcy = j * hp - oY;
              if (pcx * pcx + pcy * pcy > R * R) continue;
              const X0 = pcx - wp / 2, Y0 = pcy - hp / 2, gpx = 0.04 * wp * sc;
              c.fillStyle = PAPER; c.fillRect(toX(X0) + gpx, toY(Y0) + gpx, wp * sc - 2 * gpx, hp * sc - 2 * gpx);
              pageText(i === 0 && j === 0 ? 0 : hash3(i, j, 5) % 100000 + 1, X0, Y0, 1 / M, 1);
            }
          }
        }
        // 4. atoms: a triangular lattice; the ones inside a printed dot are ink
        const ap = a * sc;
        if (ap >= 9) {
          const row = a * Math.sqrt(3) / 2, rr = ap * 0.42;
          const r0 = Math.floor(wy0 / row) - 1, r1 = Math.ceil(wy1 / row) + 1;
          const inkAt = (x, y) => {
            const px = x + oX, py = y + oY, i = Math.round(px / wp), j = Math.round(py / hp);
            if ((i * wp - oX) * (i * wp - oX) + (j * hp - oY) * (j * hp - oY) > R * R) return false;
            const X = (px - i * wp) * M + PW / 2, Y = (py - j * hp) * M + PH / 2;
            const L = Math.floor((Y - MARG) / LS); if (L < 0 || L >= NL) return false;
            const yy = Y - MARG - L * LS; if (yy >= 7 * DOT) return false;
            const col = X < MARG + COLW + GAP / 2 ? 0 : 1, xx = X - (MARG + col * (COLW + GAP));
            const ci = Math.floor(xx / CH); if (ci < 0 || ci >= NCH) return false;
            const gx = Math.floor((xx - ci * CH) / DOT), gy = Math.floor(yy / DOT); if (gx > 4) return false;
            const ch = letterAt(i === 0 && j === 0 ? 0 : hash3(i, j, 5) % 100000 + 1, L, col, ci);
            if (!ch || !BITS[ch][gy][gx]) return false;
            const dx = xx - ci * CH - (gx + 0.5) * DOT, dy = yy - (gy + 0.5) * DOT;
            return dx * dx + dy * dy <= DOT * DOT / 4;
          };
          c.fillStyle = PAPER; c.fillRect(0, 0, W, H);
          for (let r = r0; r <= r1; r++) {
            const y = r * row, off = (r & 1) ? a / 2 : 0;
            for (let q = Math.floor((wx0 - off) / a) - 1; q <= Math.ceil((wx1 - off) / a) + 1; q++) {
              const x = q * a + off, ink = inkAt(x, y);
              c.fillStyle = ink ? INK : 'hsl(40 18% 72%)';
              c.beginPath(); c.arc(toX(x), toY(y), rr, 0, 6.2832); c.fill();
            }
          }
          // the outline of the target dot
          c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([5, 4]);
          c.beginPath(); c.arc(cx, cy, Math.max(0, DOT / M / 2 * sc), 0, 6.2832); c.stroke(); c.setLineDash([]);
        }
        c.restore();
        // 5. labels and a scale bar
        const lab = (t, x, y) => kit.label(c, t, x, y, { size: 12, bg: C.surface, color: C.text });
        const dotW = DOT / M, letH = 7 * DOT / M;
        let see;
        if (ghost > 0.5 && fov > 0.02) see = 'a full-size page, with a pin lying on it';
        else if (fov > 2.5 * R) see = 'the pin: its head holds the whole encyclopaedia';
        else if (pagePx < 25) see = 'the pinhead, covered with pages';
        else if (LS / M * sc < 5) see = 'whole pages, reduced ' + sig(M, 3) + ' times';
        else if (CH / M * sc < 14) see = 'lines of text on one page';
        else if (ap < 9 && DOT / M * sc > 0.8 * W) see = 'the inside of one printing dot (atoms further in)';
        else if (ap < 9) see = 'letters made of printing dots';
        else see = 'the atoms inside one printing dot';
        if (fov > 2.5 * R && fov < 0.2) lab('pinhead, ' + fmtLen(2 * R) + ' across', cx + Rp + 12, cy - Rp - 12);
        if (pagePx >= 25 && pagePx < 400) lab('one page: ' + fmtLen(wp) + ' × ' + fmtLen(hp), 10, 18);
        if (ap < 9 && DOT / M * sc > 6) lab('one dot: ' + fmtLen(dotW), 10, 18);
        if (ap >= 9) lab('atoms ' + fmtLen(a) + ' apart; dashed: one printing dot', 10, 18);
        // scale bar
        const target = fov / 5, e = Math.floor(Math.log10(target)), base = Math.pow(10, e);
        const len = [1, 2, 5, 10].map(m => m * base).filter(v => v <= target * 1.6).pop() || base;
        const bx = 14, by = H - 16, bw = len * sc;
        c.fillStyle = C.surface; c.globalAlpha = 0.85; c.fillRect(bx - 6, by - 20, bw + 12, 28); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by - 4); c.lineTo(bx, by); c.lineTo(bx + bw, by); c.lineTo(bx + bw, by - 4); c.stroke();
        kit.label(c, fmtLen(len), bx + bw / 2, by - 11, { size: 11.5, align: 'center', color: C.text });
        // read-outs
        const pages = Math.PI * R * R / (wp * hp), across = dotW / a;
        ro.set('fov', fmtLen(fov));
        ro.set('see', see);
        ro.set('pages', '≈ ' + sig(pages, 3) + ' pages of 22 × 28 cm');
        ro.set('page', fmtLen(wp) + ' × ' + fmtLen(hp));
        ro.set('letter', fmtLen(letH) + ' tall = ' + sig(letH / a, 3) + ' atoms');
        ro.set('dot', fmtLen(dotW) + ': ' + sig(across, 2) + ' atoms across, ≈ ' + sig(Math.PI / 4 * across * across * 2 / Math.sqrt(3), 2) + ' atoms');
      }, box.stage);
      st.onResize(() => { dirty = true; });
      document.addEventListener('hyper:theme', onTheme);
      function onTheme() { dirty = true; }
      loop.start();
      return () => document.removeEventListener('hyper:theme', onTheme);
    }
  });

  /* ================================================================ fr-qubits */
  const NQ = 3, R2 = Math.SQRT1_2;
  const QPRESETS = [
    ['A superposition: H on qubit 1', [['H', 0]]],
    ['An entangled pair: H, then CNOT', [['H', 0], ['CX', 0, 1]]],
    ['Three entangled: H, CNOT, CNOT', [['H', 0], ['CX', 0, 1], ['CX', 1, 2]]],
    ['All eight at once: H on every qubit', [['H', 0], ['H', 1], ['H', 2]]],
    ['Interference: H, then H again', [['H', 0], ['H', 0]]],
    ['Phases: H on all, then T, S, Z', [['H', 0], ['H', 1], ['H', 2], ['T', 0], ['S', 1], ['Z', 2]]],
    ['Grover search for 11 on qubits 1 and 2', [['H', 0], ['H', 1], ['CZ', 0, 1], ['H', 0], ['H', 1], ['X', 0], ['X', 1], ['CZ', 0, 1], ['X', 0], ['X', 1], ['H', 0], ['H', 1]]]
  ];
  function applyGate(psi, g) {
    const bit = q => 1 << (NQ - 1 - q), out = psi.slice(), [k, a, b] = g, n = psi.length;
    if (k === 'H') { const m = bit(a); for (let i = 0; i < n; i++) if (!(i & m)) { const x = psi[i], y = psi[i | m]; out[i] = { re: (x.re + y.re) * R2, im: (x.im + y.im) * R2 }; out[i | m] = { re: (x.re - y.re) * R2, im: (x.im - y.im) * R2 }; } }
    else if (k === 'X') { const m = bit(a); for (let i = 0; i < n; i++) out[i] = psi[i ^ m]; }
    else if (k === 'Z' || k === 'S' || k === 'T') { const m = bit(a), ph = k === 'Z' ? Math.PI : k === 'S' ? Math.PI / 2 : Math.PI / 4, cs = Math.cos(ph), sn = Math.sin(ph); for (let i = 0; i < n; i++) if (i & m) { const z = psi[i]; out[i] = { re: z.re * cs - z.im * sn, im: z.re * sn + z.im * cs }; } }
    else if (k === 'CX') { const mc = bit(a), mt = bit(b); for (let i = 0; i < n; i++) out[i] = (i & mc) ? psi[i ^ mt] : psi[i]; }
    else if (k === 'CZ') { const m1 = bit(a), m2 = bit(b); for (let i = 0; i < n; i++) if ((i & m1) && (i & m2)) out[i] = { re: -psi[i].re, im: -psi[i].im }; }
    return out;
  }
  const ket = i => '|' + i.toString(2).padStart(NQ, '0') + '⟩';
  // a state as text: "0.71|000⟩ − 0.71|110⟩", complex amplitudes in brackets
  function fmtState(psi) {
    const neg = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
    let s = '';
    psi.forEach((z, i) => {
      const r = Math.abs(z.re) < 5e-4 ? 0 : z.re, m = Math.abs(z.im) < 5e-4 ? 0 : z.im;
      if (!r && !m) return;
      let sign, body;
      if (!m) { sign = r < 0 ? '−' : '+'; body = Math.abs(r).toFixed(2); }
      else if (!r) { sign = m < 0 ? '−' : '+'; body = Math.abs(m).toFixed(2) + 'i'; }
      else { sign = '+'; body = '(' + neg(r) + (m < 0 ? ' − ' : ' + ') + Math.abs(m).toFixed(2) + 'i)'; }
      s += (s ? ' ' + sign + ' ' : (sign === '−' ? '−' : '')) + body + ket(i);
    });
    return s;
  }

  Hyper.sim('fr-qubits', {
    title: 'Three qubits, eight amplitudes',
    blurb: `A quantum circuit on three qubits, all starting at $|0\\rangle$. The state is a list of eight [[?amplitude|amplitudes]], one for each [[?base-states|base state]] $|000\\rangle \\dots |111\\rangle$, drawn as arrows ([[?complex-number|complex numbers]]); the bar under each is its [[?probability]], the [[?absolute-square]] of the arrow. Step through the gates and watch the arrows grow, shrink, turn and cancel. The bar at the bottom shows what a classical computer needs to store $n$ qubits: $2^n$ amplitudes of 16 bytes each, on a scale of powers of ten.

**Try this**
- *An entangled pair*: after H and CNOT only $|000\\rangle$ and $|110\\rangle$ survive, each with probability ½ — the two qubits always agree.
- *Interference*: the second H makes the two ways of reaching $|100\\rangle$ cancel, and the state is back to $|000\\rangle$.
- *Phases*: T, S and Z turn arrows by 45°, 90° and 180° without changing any probability — the information is in the directions.
- *Grover search*: twelve gates pile all the probability onto the marked state $|110\\rangle$.
- Slide the number of qubits in the memory bar: 30 fits a laptop, 50 is beyond any supercomputer, and near 266 there are more amplitudes than atoms in the observable universe.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Circuit', options: QPRESETS.map((p, i) => [p[0], i]), value: 1 },
        { type: 'buttons', items: [{ id: 'step', label: 'Next gate', primary: true }, { id: 'run', label: 'Run all' }, { id: 'reset', label: 'Reset' }] },
        { id: 'n', label: 'Qubits in the memory bar', min: 1, max: 300, step: 1, value: 50 }
      ], id => {
        if (id === 'pre' || id === 'reset') reset();
        else if (id === 'step') next();
        else if (id === 'run') { if (k >= gates().length) reset(); running = true; wait = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['step', 'Gate'], ['state', 'State'], ['amps', 'Amplitudes for n qubits'], ['mem', 'Classical memory (16 B each)']]);
      const gates = () => QPRESETS[V.pre][1];
      let psi, from, k = 0, anim = 1, running = false, wait = 0;
      function zero() { const s = []; for (let i = 0; i < 8; i++) s.push({ re: i ? 0 : 1, im: 0 }); return s; }
      function reset() { psi = zero(); from = psi; k = 0; anim = 1; running = false; }
      function next() { const G = gates(); if (k >= G.length) return false; from = psi; psi = applyGate(psi, G[k]); k++; anim = 0; return true; }
      reset();
      const loop = kit.loop(dt => {
        if (anim < 1) anim = Math.min(1, anim + dt / 0.6);
        if (running && anim >= 1) { wait += dt; if (wait > 0.35) { wait = 0; if (!next()) running = false; } }
        const e = anim * anim * (3 - 2 * anim), disp = psi.map((z, i) => ({ re: from[i].re + (z.re - from[i].re) * e, im: from[i].im + (z.im - from[i].im) * e }));
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 540);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        c.font = '13px ' + fontOf();
        // --- the circuit
        const G = gates(), wy = [34, 70, 106], x0 = 96, gw = Math.min(52, (700 - x0) / Math.max(1, G.length));
        c.strokeStyle = C.muted; c.lineWidth = 1.5;
        for (let q = 0; q < NQ; q++) { c.beginPath(); c.moveTo(70, wy[q]); c.lineTo(740, wy[q]); c.stroke(); kit.label(c, 'q' + (q + 1) + '  |0⟩', 16, wy[q], { size: 12.5, color: C.text }); }
        G.forEach((g, i) => {
          const x = x0 + (i + 0.5) * gw, done = i < k, cur = i === k - 1 && anim < 1, col = done ? C.accent : C.faint;
          if (g[0] === 'CX' || g[0] === 'CZ') {
            const ya = wy[g[1]], yb = wy[g[2]];
            c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x, ya); c.lineTo(x, yb); c.stroke();
            kit.dot(c, x, ya, 5, col);
            if (g[0] === 'CX') { c.beginPath(); c.arc(x, yb, 10, 0, 6.2832); c.stroke(); c.beginPath(); c.moveTo(x - 10, yb); c.lineTo(x + 10, yb); c.moveTo(x, yb - 10); c.lineTo(x, yb + 10); c.stroke(); }
            else kit.dot(c, x, yb, 5, col);
          } else {
            const y = wy[g[1]];
            c.fillStyle = done ? C.accent : C.surface; c.strokeStyle = col; c.lineWidth = cur ? 3 : 1.5;
            c.fillRect(x - 13, y - 13, 26, 26); c.strokeRect(x - 13, y - 13, 26, 26);
            kit.label(c, g[0], x, y + 1, { size: 13, align: 'center', weight: 700, color: done ? (C.bg || '#fff') : C.text });
          }
        });
        if (k < G.length) { const x = x0 + (k + 0.5) * gw; c.strokeStyle = C.warn; c.setLineDash([4, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, 14); c.lineTo(x, 126); c.stroke(); c.setLineDash([]); kit.label(c, 'next', x, 134, { size: 11, align: 'center', color: C.warn }); }
        // --- the eight amplitudes
        const r = 34, top = 200;
        kit.label(c, 'amplitudes (arrows; a full-length arrow = 1) and probabilities |amplitude|²', 380, 150, { size: 12.5, align: 'center', color: C.muted });
        for (let i = 0; i < 8; i++) {
          const x = 65 + i * 90, z = disp[i], p = z.re * z.re + z.im * z.im;
          c.strokeStyle = C.grid || C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x, top, r, 0, 6.2832); c.stroke();
          c.beginPath(); c.moveTo(x - r, top); c.lineTo(x + r, top); c.moveTo(x, top - r); c.lineTo(x, top + r); c.stroke();
          kit.arrow(c, x, top, x + r * z.re, top - r * z.im, p > 1e-6 ? C.accent : C.faint, 2.4);
          kit.label(c, ket(i), x, top + r + 16, { size: 13, align: 'center', color: C.text, weight: 600 });
          const bh = 70 * p;
          c.fillStyle = C.faint; c.fillRect(x - 20, 330 - 70, 40, 70);
          c.fillStyle = C.ok; c.fillRect(x - 20, 330 - bh, 40, bh);
          kit.label(c, Math.round(p * 100) + ' %', x, 344, { size: 12, align: 'center', color: C.text });
        }
        // --- the memory wall
        const n = Math.round(V.n), lg = Math.log10(16) + n * Math.LOG10E * Math.LN2, X = v => 40 + v / 100 * 680;
        kit.label(c, 'memory a classical computer needs for ' + n + ' qubits: 16 × 2^' + n + ' bytes ≈ 10^' + lg.toFixed(1), 380, 386, { size: 12.5, align: 'center', color: C.text });
        c.fillStyle = C.faint; c.fillRect(X(0), 400, X(100) - X(0), 22);
        c.fillStyle = lg > 16 ? C.bad : lg > 10.3 ? C.warn : C.ok; c.fillRect(X(0), 400, X(Math.min(100, lg)) - X(0), 22);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let d = 0; d <= 100; d += 10) { c.beginPath(); c.moveTo(X(d), 422); c.lineTo(X(d), 428); c.stroke(); kit.label(c, '10^' + d, X(d), 438, { size: 10.5, align: 'center', color: C.muted }); }
        const marks = [[10.2, 'laptop, 16 GB'], [16, 'largest supercomputers, ~10 PB'], [23, 'all data stored by humankind, ~10²³ B'], [50, 'a byte on every atom of the Earth'], [80, 'a byte on every atom in the observable universe']];
        marks.forEach(([v, t], i) => {
          const y = i % 2 ? 470 : 456;
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(X(v), 398); c.lineTo(X(v), y - 8); c.stroke();
          kit.label(c, t, clamp(X(v), 90, 670), y + (i % 2 ? 12 : 0) + 8, { size: 11, align: 'center', color: C.text });
        });
        c.restore();
        ro.set('step', k + ' of ' + G.length + (k ? ' (' + G[k - 1][0] + ')' : ''));
        ro.set('state', fmtState(psi));
        ro.set('amps', '2^' + n + ' = ' + sci(Math.pow(2, n), 3));
        ro.set('mem', sci(16 * Math.pow(2, n), 3) + ' bytes');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-gates */
  const GATES = {
    AND: { nin: 2, f: b => [b[0] & b[1]], ins: ['a', 'b'], outs: ['a AND b'] },
    OR: { nin: 2, f: b => [b[0] | b[1]], ins: ['a', 'b'], outs: ['a OR b'] },
    NAND: { nin: 2, f: b => [1 - (b[0] & b[1])], ins: ['a', 'b'], outs: ['NOT (a AND b)'] },
    XOR: { nin: 2, f: b => [b[0] ^ b[1]], ins: ['a', 'b'], outs: ['a XOR b'] },
    NOT: { nin: 1, f: b => [1 - b[0]], ins: ['a'], outs: ['NOT a'] },
    CNOT: { nin: 2, f: b => [b[0], b[0] ^ b[1]], ins: ['a', 'b'], outs: ['a', 'a XOR b'], sym: ['dot', 'plus'] },
    TOF: { nin: 3, f: b => [b[0], b[1], b[2] ^ (b[0] & b[1])], ins: ['a', 'b', 'c'], outs: ['a', 'b', 'c XOR ab'], sym: ['dot', 'dot', 'plus'] },
    FRED: { nin: 3, f: b => (b[0] ? [1, b[2], b[1]] : [0, b[1], b[2]]), ins: ['c', 'x', 'y'], outs: ['c', 'x′', 'y′'], sym: ['dot', 'swap', 'swap'] }
  };
  const toBits = (v, n) => Array.from({ length: n }, (_, i) => (v >> (n - 1 - i)) & 1);
  const toInt = b => b.reduce((s, x) => s * 2 + x, 0);
  function analyse(g) {
    const N = 1 << g.nin, map = [], count = {};
    for (let i = 0; i < N; i++) { const o = toInt(g.f(toBits(i, g.nin))); map.push(o); count[o] = (count[o] || 0) + 1; }
    let Hout = 0; for (const k in count) { const p = count[k] / N; Hout -= p * Math.log2(p); }
    return { N, map, count, distinct: Object.keys(count).length, lost: g.nin - Hout, rev: Object.keys(count).length === N };
  }

  Hyper.sim('fr-gates', {
    title: 'Logic that forgets, and logic that does not',
    blurb: `A logic gate is a mapping from input bits to output bits. Click the input bits on the left (or a row of the table on the right) and watch the signal pass. On the right every possible input is joined to its output. When several inputs land on the same output, the gate has *forgotten* which one it was: on average it destroys the number of bits shown, and by Landauer's principle each lost bit must release at least $k_BT\\ln 2$ of heat (the [[?logarithm]] base 2 counts bits).

**Try this**
- AND: three of the four inputs give 0. Press *Run backwards*: the gate cannot tell you which input it came from.
- CNOT, Toffoli and Fredkin: every input has its own output — a permutation. Run them backwards and the input comes back; no heat is required.
- Toffoli with c = 0: the third output is a AND b, but a and b are kept, so nothing is lost.
- Fredkin: count the 1s going in and coming out — always the same, like billiard balls that are only redirected.
- Change the temperature: the least heat per lost bit is proportional to $T$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'g', type: 'select', label: 'Gate', options: [['AND (2 in, 1 out)', 'AND'], ['OR (2 in, 1 out)', 'OR'], ['NAND (2 in, 1 out)', 'NAND'], ['XOR (2 in, 1 out)', 'XOR'], ['NOT (1 in, 1 out)', 'NOT'], ['CNOT, controlled NOT (2 → 2)', 'CNOT'], ['Toffoli, controlled-controlled NOT (3 → 3)', 'TOF'], ['Fredkin, controlled swap (3 → 3)', 'FRED']], value: 'AND' },
        { id: 'T', label: 'Temperature', min: 1, max: 400, step: 1, value: 300, unit: 'K' },
        { type: 'buttons', items: [{ id: 'back', label: 'Run backwards', primary: true }, { id: 'rand', label: 'Random inputs' }] }
      ], id => {
        if (id === 'g') { bits = [0, 0, 0]; sig = 0; back = null; }
        if (id === 'rand') { bits = [0, 1, 2].map(() => Math.random() < 0.5 ? 1 : 0); sig = 0; back = null; }
        if (id === 'back') { back = { t: 0 }; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rev', 'Reversible?'], ['map', 'Inputs → different outputs'], ['lost', 'Bits lost per use (random inputs)'], ['heat', 'Least heat per use'], ['ones', 'Number of 1s, in → out'], ['msg', '']]);
      let bits = [0, 0, 0], sig = 0, back = null, geo = { s: 1, ox: 0, oy: 0 };
      const wireY = (n, i) => 175 + (i - (n - 1) / 2) * 66;
      const rowY = (N, i) => 70 + (i + 0.5) * Math.min(38, 300 / N);
      kit.click(st, p => {
        const x = (p.x - geo.ox) / geo.s, y = (p.y - geo.oy) / geo.s, g = GATES[V.g];
        for (let i = 0; i < g.nin; i++) if (Math.hypot(x - 70, y - wireY(g.nin, i)) < 24) { bits[i] = 1 - bits[i]; sig = 0; back = null; return; }
        const N = 1 << g.nin;
        if (x > 440 && x < 560) for (let i = 0; i < N; i++) if (Math.abs(y - rowY(N, i)) < 14) { const b = toBits(i, g.nin); for (let k = 0; k < g.nin; k++) bits[k] = b[k]; sig = 0; back = null; return; }
      }, p => { const x = (p.x - geo.ox) / geo.s; return x < 100 || (x > 440 && x < 560); });
      const loop = kit.loop(dt => {
        sig = Math.min(1.2, sig + dt / 0.8);
        if (back) back.t += dt;
        if (back && back.t > 3) back = null;
        const g = GATES[V.g], A = analyse(g), inb = bits.slice(0, g.nin), outb = g.f(inb), N = A.N;
        const c = st.begin(), C = kit.colors(); geo = fit(st, 760, 420);
        c.save(); c.translate(geo.ox, geo.oy); c.scale(geo.s, geo.s); c.font = '13px ' + fontOf();
        // --- the gate
        const nOut = outb.length, bx0 = 170, bx1 = 300;
        for (let i = 0; i < g.nin; i++) {
          const y = wireY(g.nin, i);
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(88, y); c.lineTo(bx0, y); c.stroke();
          c.fillStyle = inb[i] ? C.accent : C.surface; c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(70, y, 18, 0, 6.2832); c.fill(); c.stroke();
          kit.label(c, String(inb[i]), 70, y + 1, { size: 15, weight: 700, align: 'center', color: inb[i] ? (C.bg || '#fff') : C.text });
          kit.label(c, g.ins[i], 38, y, { size: 13, align: 'right', color: C.text });
          if (sig < 0.55) kit.dot(c, 88 + (bx0 - 88) * sig / 0.55, y, 5, C.warn);
        }
        const oy = i => nOut === g.nin ? wireY(g.nin, i) : 175;
        for (let i = 0; i < nOut; i++) {
          const y = oy(i), on = sig >= 0.6;
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(bx1, y); c.lineTo(362, y); c.stroke();
          c.fillStyle = on && outb[i] ? C.ok : C.surface; c.strokeStyle = C.ok; c.beginPath(); c.arc(380, y, 18, 0, 6.2832); c.fill(); c.stroke();
          kit.label(c, on ? String(outb[i]) : '?', 380, y + 1, { size: 15, weight: 700, align: 'center', color: on && outb[i] ? (C.bg || '#fff') : C.text });
          kit.label(c, g.outs[i], 380, y + 30, { size: 11.5, align: 'center', color: C.muted });
          if (sig >= 0.6 && sig < 1.1) kit.dot(c, bx1 + (362 - bx1) * (sig - 0.6) / 0.5, y, 5, C.warn);
        }
        const top = wireY(g.nin, 0) - 34, bot = wireY(g.nin, g.nin - 1) + 34;
        c.fillStyle = C.surface; c.strokeStyle = A.rev ? C.ok : C.bad; c.lineWidth = 2.5; c.fillRect(bx0, top, bx1 - bx0, bot - top); c.strokeRect(bx0, top, bx1 - bx0, bot - top);
        if (g.sym) {
          const xs = (bx0 + bx1) / 2, ys = g.sym.map((_, i) => wireY(g.nin, i));
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xs, ys[0]); c.lineTo(xs, ys[ys.length - 1]); c.stroke();
          g.sym.forEach((s, i) => {
            const y = ys[i];
            c.strokeStyle = C.text; c.beginPath(); c.moveTo(bx0, y); c.lineTo(xs - 12, y); c.moveTo(xs + 12, y); c.lineTo(bx1, y); c.stroke();
            if (s === 'dot') kit.dot(c, xs, y, 6, C.text);
            else if (s === 'plus') { c.beginPath(); c.arc(xs, y, 12, 0, 6.2832); c.moveTo(xs - 12, y); c.lineTo(xs + 12, y); c.moveTo(xs, y - 12); c.lineTo(xs, y + 12); c.stroke(); }
            else { c.beginPath(); c.moveTo(xs - 8, y - 8); c.lineTo(xs + 8, y + 8); c.moveTo(xs + 8, y - 8); c.lineTo(xs - 8, y + 8); c.stroke(); }
          });
          kit.label(c, { CNOT: 'CNOT', TOF: 'Toffoli', FRED: 'Fredkin' }[V.g], xs, top - 12, { size: 12.5, align: 'center', color: C.text, weight: 600 });
        } else kit.label(c, V.g, (bx0 + bx1) / 2, 175, { size: 18, weight: 700, align: 'center', color: C.text });
        kit.label(c, A.rev ? 'reversible' : 'forgets', (bx0 + bx1) / 2, bot + 16, { size: 12, align: 'center', color: A.rev ? C.ok : C.bad, weight: 600 });
        // --- the mapping
        const cur = toInt(inb), outVals = A.rev ? Array.from({ length: N }, (_, i) => i) : Object.keys(A.count).map(Number).sort((p, q) => p - q);
        const span = N * Math.min(38, 300 / N), oRow = v => A.rev ? rowY(N, v) : 70 + (outVals.indexOf(v) + 0.5) * span / outVals.length;
        kit.label(c, 'input', 500, 44, { size: 12, align: 'center', color: C.muted }); kit.label(c, 'output', 700, 44, { size: 12, align: 'center', color: C.muted });
        const cand = back ? A.map.map((o, i) => (o === A.map[cur] ? i : -1)).filter(i => i >= 0) : [];
        for (let i = 0; i < N; i++) {
          const y = rowY(N, i), yo = oRow(A.map[i]), hl = i === cur;
          c.strokeStyle = hl ? C.accent : (A.count[A.map[i]] > 1 ? C.bad : C.faint); c.lineWidth = hl ? 3 : 1.5;
          c.beginPath(); c.moveTo(530, y); c.bezierCurveTo(600, y, 610, yo, 672, yo); c.stroke();
          const isCand = cand.indexOf(i) >= 0;
          if (hl || isCand) { c.fillStyle = isCand && !A.rev ? C.warn : C.accent; c.globalAlpha = 0.25; c.fillRect(456, y - 13, 76, 26); c.globalAlpha = 1; }
          kit.label(c, toBits(i, g.nin).join(''), 500, y, { size: 14, align: 'center', color: C.text, weight: hl ? 700 : 500 });
        }
        for (const v of outVals) {
          const y = oRow(v), n = A.count[v] || 0;
          kit.label(c, toBits(v, nOut).join(''), 700, y, { size: 14, align: 'center', color: C.text, weight: v === A.map[cur] ? 700 : 500 });
          if (n > 1) kit.label(c, n + ' → 1', 745, y, { size: 11, align: 'center', color: C.bad });
        }
        c.restore();
        const kT = 1.380649e-23 * V.T, q = A.lost * kT * Math.LN2, ones = a => a.reduce((s, x) => s + x, 0);
        ro.set('rev', A.rev ? 'yes — a permutation of the ' + N + ' states' : 'no — several inputs share an output');
        ro.set('map', N + ' → ' + A.distinct);
        ro.set('lost', A.lost < 1e-9 ? '0' : A.lost.toFixed(2) + ' bits');
        ro.set('heat', A.lost < 1e-9 ? 'no lower limit' : '≥ ' + A.lost.toFixed(2) + ' kT ln 2 = ' + sci(q, 3) + ' J');
        ro.set('ones', ones(inb) + ' → ' + ones(outb) + (V.g === 'FRED' ? ' (always equal)' : ''));
        ro.set('msg', back ? (A.rev ? 'Backwards: output ' + toBits(A.map[cur], nOut).join('') + ' gives back input ' + toBits(cur, g.nin).join('') + ' — nothing forgotten.' : 'Backwards: output ' + toBits(A.map[cur], nOut).join('') + ' could have come from ' + cand.map(i => toBits(i, g.nin).join('')).join(', ') + ' — the input is lost.') : '');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-landauer */
  Hyper.sim('fr-landauer', {
    title: 'Erasing a one-molecule memory',
    blurb: `A box holding a single gas molecule is a one-bit memory: molecule left of the partition means 0, right means 1. The walls are held at temperature $T$: whenever the molecule touches a fixed wall it bounces off with a fresh random thermal speed. **Erase** the bit (reset it to 0 whatever it was): the partition is lifted, a piston pushes the molecule's "gas" into the left half, and the partition drops back. Each collision with the moving piston does a little work; the total, averaged over many erasures, is $kT\\ln 2 = 0.69\\,kT$ — [[?logarithm|ln]] 2 because the space available to the molecule was halved. That work leaves as heat into the walls: Landauer's principle. **Extract work** runs Szilard's engine: knowing which side the molecule is on, let it push the partition out like a piston, and you gain $kT\\ln 2$ on average.

**Try this**
- Press *Repeat: write + erase* with *Fast* on and watch the histogram: single erasures scatter widely (some cost less than $kT\\ln 2$, a few even gain), but the average settles a little above 0.69 $kT$ — about 0.72 $kT$ at a piston speed of 0.02.
- Make the piston fast (0.5 of the thermal speed): the average cost rises to about 1.2 $kT$. The limit $kT\\ln 2$ is reached only as the erasure becomes infinitely slow.
- Write a bit, then extract its work, then write again: information about the molecule is worth $kT\\ln 2$ — and erasing that information afterwards pays it back.
- Change the temperature: in joules the price scales with $T$ (in units of $kT$ it does not change).`,
    mount(box, kit) {
      const Q = kit.qm, rnd = Q.rng(1961);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'u', label: 'Piston speed (× thermal speed)', min: 0.01, max: 1, value: 0.03, log: true, sig: 2 },
        { id: 'T', label: 'Temperature of the walls', min: 1, max: 400, step: 1, value: 300, unit: 'K' },
        { id: 'fast', type: 'check', label: 'Fast (×15 time)', value: false },
        { type: 'buttons', items: [{ id: 'write', label: 'Write a random bit' }, { id: 'erase', label: 'Erase to 0', primary: true }, { id: 'extract', label: 'Extract work (Szilard)' }] },
        { type: 'buttons', items: [{ id: 'auto', label: 'Repeat: write + erase' }, { id: 'stop', label: 'Stop' }, { id: 'clear', label: 'Clear statistics' }] }
      ], id => {
        if (id === 'write') { auto = false; if (!queue.length) write(); }
        else if (id === 'erase') { auto = false; if (!queue.length) erase(); }
        else if (id === 'extract') { auto = false; if (!queue.length) extract(); }
        else if (id === 'auto') { auto = true; }
        else if (id === 'stop') { auto = false; }
        else if (id === 'clear') { eras = []; gains = []; lastW = null; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mem', 'Memory'], ['op', 'Doing'], ['W', 'Work on the gas, this operation'], ['avgE', 'Average cost of an erasure'], ['avgX', 'Average work extracted'], ['lim', 'kT ln 2 at this temperature']]);
      const plot = kit.plot(gb, { x: { label: 'work to erase, in units of kT', min: -1, max: 4 }, y: { label: 'erasures', min: 0 }, legend: true }, 150);
      // physics in units where the box is 1 long, m = 1 and kT = 1 (thermal speed 1)
      const ph = { x: 0.3, vx: 0.8, y: 0.4, vy: 0.55, lo: 0, hi: 1, vlo: 0, vhi: 0, part: false, bit: null, pistonR: 1, pistonL: 0 };
      let queue = [], W = 0, op = 'idle', eras = [], gains = [], lastW = null, auto = false, autoNext = 'write', plotT = 0;
      const thermal = () => Math.sqrt(-2 * Math.log(1 - rnd()));   // speed leaving a wall at temperature T (flux-weighted)
      function write() { op = 'writing a random bit'; queue.push({ call: () => { ph.part = false; ph.bit = null; ph.lo = 0; ph.hi = 1; } }, { wait: 0.8 }, { call: () => { ph.part = true; ph.bit = ph.x < 0.5 ? 0 : 1; if (ph.bit) { ph.lo = 0.5; ph.hi = 1; } else { ph.lo = 0; ph.hi = 0.5; } op = 'idle'; } }); }
      function erase() {
        op = 'erasing';
        queue.push({ call: () => { W = 0; ph.part = false; ph.bit = null; ph.lo = 0; ph.hi = 1; } }, { wait: 0.3 },
          { move: 'hi', to: 0.5 },
          { call: () => { ph.part = true; ph.bit = 0; ph.lo = 0; ph.hi = 0.5; eras.push(W); lastW = W; } },
          { retract: true }, { call: () => { op = 'idle'; } });
      }
      function extract() {
        if (!ph.part || ph.bit == null) { op = 'write a bit first: the engine needs to know the side'; return; }
        op = 'extracting work';
        const right = ph.bit === 0;
        queue.push({ call: () => { W = 0; ph.part = false; if (right) { ph.pistonR = 0.5; } else { ph.pistonL = 0.5; } } },
          { move: right ? 'hi' : 'lo', to: right ? 1 : 0 },
          { call: () => { gains.push(-W); lastW = W; ph.bit = null; ph.lo = 0; ph.hi = 1; ph.pistonR = 1; ph.pistonL = 0; op = 'idle'; } });
      }
      function physics(h) {
        const q = queue[0];
        if (q) {
          if (q.call) { q.call(); queue.shift(); }
          else if (q.wait != null) { q.wait -= h; if (q.wait <= 0) queue.shift(); }
          else if (q.move) {
            const key = q.move, sgn = Math.sign(q.to - ph[key]), v = sgn * V.u;
            ph[key === 'hi' ? 'vhi' : 'vlo'] = v; ph[key] += v * h;
            if ((sgn > 0 && ph[key] >= q.to) || (sgn <= 0 && ph[key] <= q.to)) { ph[key] = q.to; ph.vhi = 0; ph.vlo = 0; queue.shift(); }
            if (key === 'hi') ph.pistonR = ph.hi; else ph.pistonL = ph.lo;
          } else if (q.retract) { ph.pistonR = Math.min(1, ph.pistonR + h * 0.6); if (ph.pistonR >= 1) queue.shift(); }
        } else if (auto) { if (autoNext === 'write') { write(); autoNext = 'erase'; } else { erase(); autoNext = 'write'; } }
        ph.x += ph.vx * h; ph.y += ph.vy * h;
        if (ph.y < 0) { ph.y = -ph.y; ph.vy = Math.abs(ph.vy); } if (ph.y > 1) { ph.y = 2 - ph.y; ph.vy = -Math.abs(ph.vy); }
        if (ph.x <= ph.lo) {
          if (ph.vlo !== 0) { const v2 = 2 * ph.vlo - ph.vx; W += 0.5 * (v2 * v2 - ph.vx * ph.vx); ph.vx = v2; } else ph.vx = thermal();
          ph.x = Math.min(ph.hi, ph.lo + (ph.lo - ph.x));
        }
        if (ph.x >= ph.hi) {
          if (ph.vhi !== 0) { const v2 = 2 * ph.vhi - ph.vx; W += 0.5 * (v2 * v2 - ph.vx * ph.vx); ph.vx = v2; } else ph.vx = -thermal();
          ph.x = Math.max(ph.lo, ph.hi - (ph.x - ph.hi));
        }
        if (!(ph.x >= ph.lo && ph.x <= ph.hi)) ph.x = (ph.lo + ph.hi) / 2;
      }
      const loop = kit.loop(dt => {
        const T = dt * (V.fast ? 15 : 1), n = Math.ceil(T / 0.002);
        for (let i = 0; i < n; i++) physics(T / n);
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 330), X = x => 70 + x * 620, Y0 = 50, Y1 = 250;
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '13px ' + fontOf();
        // the box, warm walls
        c.fillStyle = C.bg2 || C.surface; c.fillRect(X(0), Y0, 620, Y1 - Y0);
        c.strokeStyle = C.warn; c.lineWidth = 5; c.strokeRect(X(0), Y0, 620, Y1 - Y0);
        kit.label(c, 'walls at temperature T (heat bath)', X(0.5), Y0 - 16, { size: 12, align: 'center', color: C.warn });
        // halves and labels
        kit.label(c, '0', X(0.25), Y1 + 18, { size: 16, weight: 700, align: 'center', color: ph.bit === 0 ? C.accent : C.muted });
        kit.label(c, '1', X(0.75), Y1 + 18, { size: 16, weight: 700, align: 'center', color: ph.bit === 1 ? C.accent : C.muted });
        c.setLineDash([3, 5]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0.5), Y0); c.lineTo(X(0.5), Y1); c.stroke(); c.setLineDash([]);
        if (ph.part) { c.fillStyle = C.text; c.fillRect(X(0.5) - 3, Y0, 6, Y1 - Y0); }
        // pistons
        const piston = (x, side) => {
          c.fillStyle = C.muted; c.fillRect(X(x) - 5, Y0 + 3, 10, Y1 - Y0 - 6);
          const rod = side > 0 ? [X(x) + 5, X(1) + 60] : [X(0) - 60, X(x) - 5];
          c.fillRect(rod[0], (Y0 + Y1) / 2 - 4, rod[1] - rod[0], 8);
        };
        if (ph.pistonR < 0.999) piston(ph.pistonR, 1);
        if (ph.pistonL > 0.001) piston(ph.pistonL, -1);
        // the molecule and its velocity
        const mx = X(ph.x), my = Y0 + 8 + ph.y * (Y1 - Y0 - 16);
        kit.dot(c, mx, my, 8, C.accent, C.text);
        kit.arrow(c, mx, my, mx + clamp(ph.vx, -3, 3) * 18, my, C.accent, 1.6);
        // work gauge
        const wv = queue.length ? W : (lastW == null ? 0 : lastW);
        kit.label(c, 'work on the gas: ' + wv.toFixed(2) + ' kT', 690, 300, { size: 13, align: 'right', color: wv >= 0 ? C.bad : C.ok, weight: 600 });
        const gw = clamp(wv / 3, -1, 1) * 200;
        c.fillStyle = C.faint; c.fillRect(250, 312, 400, 10); c.fillStyle = wv >= 0 ? C.bad : C.ok; c.fillRect(450, 312, gw, 10);
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(450 + Math.LN2 / 3 * 200, 306); c.lineTo(450 + Math.LN2 / 3 * 200, 326); c.stroke();
        kit.label(c, 'kT ln 2', 450 + Math.LN2 / 3 * 200, 300, { size: 11, align: 'center', color: C.muted });
        c.restore();
        // read-outs
        const kT = 1.380649e-23 * V.T, mean = a => a.reduce((s, x) => s + x, 0) / a.length;
        ro.set('mem', ph.part ? 'bit = ' + ph.bit + (ph.bit ? ' (right)' : ' (left)') : 'no partition: the molecule can be anywhere');
        ro.set('op', op + (auto ? ' (repeating)' : ''));
        ro.set('W', wv.toFixed(2) + ' kT = ' + sci(wv * kT, 3) + ' J');
        ro.set('avgE', eras.length ? mean(eras).toFixed(3) + ' kT over ' + eras.length + ' erasures (ln 2 = 0.693)' : '—');
        ro.set('avgX', gains.length ? mean(gains).toFixed(3) + ' kT over ' + gains.length + ' runs' : '—');
        ro.set('lim', sci(kT * Math.LN2, 3) + ' J = ' + sci(kT * Math.LN2 / 1.602176634e-19, 3) + ' eV');
        plotT += dt;
        if (plotT > 0.25) {
          plotT = 0;
          const bins = new Array(25).fill(0);
          for (const w of eras) { const b = Math.floor((w + 1) / 0.2); if (b >= 0 && b < 25) bins[b]++; }
          const pts = []; bins.forEach((v, i) => { pts.push([-1 + i * 0.2, v], [-1 + (i + 1) * 0.2, v]); });
          const vl = [{ x: Math.LN2, label: 'kT ln 2' }]; if (eras.length) vl.push({ x: clamp(mean(eras), -1, 4), label: 'average' });
          plot.set({ series: [{ pts, label: 'erasures', fill: true }], vlines: vl });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-helium */
  // monotone cubic interpolation (Fritsch–Carlson): no overshoot between the points
  function mcubic(xs, ys) {
    const n = xs.length, d = [], m = new Array(n);
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    return x => {
      if (x <= xs[0]) return ys[0] + m[0] * (x - xs[0]);
      if (x >= xs[n - 1]) return ys[n - 1] + m[n - 1] * (x - xs[n - 1]);
      let i = 0; while (x > xs[i + 1]) i++;
      const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
    };
  }
  // the phonon–roton curve of helium II at low pressure: k in Å⁻¹, E/k_B in kelvin — a smooth fit through
  // approximate neutron-scattering values (phonon slope 18.3 K·Å = 239 m/s, maxon 13.9 K at 1.1 Å⁻¹, roton 8.62 K at 1.92 Å⁻¹)
  const HE_E = mcubic([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.92, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
                      [0, 1.83, 3.66, 5.45, 7.15, 8.7, 10.1, 11.3, 12.3, 13.1, 13.6, 13.85, 13.7, 13.2, 12.5, 11.6, 10.7, 9.8, 9.1, 8.66, 8.62, 8.85, 9.8, 11.2, 12.8, 14.3, 15.5, 16.4]);
  const KV = 1.380649e-23 / 1.054571817e-34 * 1e-10;   // (E/k_B in K)/(k in Å⁻¹) -> speed in m/s: 13.09
  const NORMAL = mcubic([0.3, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.1, 2.17], [0, 0.0003, 0.0015, 0.0075, 0.024, 0.068, 0.16, 0.30, 0.53, 0.71, 1]);
  const LANDAU = (() => { let best = Infinity, kb = 0; for (let k = 0.05; k <= 2.6; k += 0.002) { const r = HE_E(k) / k; if (r < best) { best = r; kb = k; } } return { v: best * KV, k: kb, E: HE_E(kb) }; })();

  Hyper.sim('fr-helium', {
    title: 'Landau\'s critical velocity',
    blurb: `Below: the energy $E$ of an excitation of superfluid helium against its wave number $k$ (momentum $p = \\hbar k$) — phonons along the straight start, the maxon hump, and the roton dip at 1.92 Å⁻¹ (a smooth fit to neutron-scattering measurements). Above: a small ion pulled through the liquid at speed $v$. It can lose energy only by creating an excitation, and energy and momentum can both be conserved only if $E(p) \\le pv$ — if the straight line $E = pv$ reaches the curve. Below the speed where the line first touches, $v_c = \\min E/p \\approx 58$ m/s, nothing can be created: flow without friction.

**Try this**
- Raise $v$ slowly. At about 58 m/s the line touches the curve near the roton minimum and the ion starts shedding rotons — at an angle $\\cos\\theta = v_c/v$, like a wake.
- Above 239 m/s (the speed of sound) phonons are emitted too: a Mach cone.
- Show the free-atom curve $\\hbar^2k^2/2m$: at the roton's wave number a free atom would need about 22 K. Feynman's relation $E = \\hbar^2k^2/2mS(k)$ divides it by the structure factor $S(k)$, which peaks there.
- Warm the liquid: the thermal excitations (the normal fluid, grey dots) multiply as $e^{-\\Delta/k_BT}$ ([[?boltzmann-factor]]), and above 2.17 K the superfluid is gone.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Speed of the ion', min: 0, max: 300, step: 1, value: 40, unit: 'm/s' },
        { id: 'T', label: 'Temperature', min: 0.3, max: 2.17, step: 0.01, value: 1.2, unit: 'K' },
        { id: 'free', type: 'check', label: 'Show the free-atom curve ħ²k²/2m', value: false },
        { id: 'fits', type: 'check', label: 'Show the phonon line and roton parabola', value: true }
      ], () => { replot(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vc', 'Landau critical velocity'], ['c', 'Speed of sound (phonons)'], ['state', 'The ion'], ['ang', 'Rotons leave at θ'], ['nf', 'Normal-fluid fraction (approx.)']]);
      const plot = kit.plot(gb, { x: { label: 'wave number k (Å⁻¹)', min: 0, max: 2.6 }, y: { label: 'excitation energy E/k_B (K)', min: 0, max: 22 }, legend: true }, 240);
      const curve = []; for (let k = 0; k <= 2.6001; k += 0.02) curve.push([k, HE_E(k)]);
      function replot() {
        const v = V.v, series = [{ pts: curve, label: 'E(k), helium II', width: 2.4 }];
        if (V.fits) {
          series.push({ pts: [[0, 0], [1.2, 1.2 * 18.3]], label: 'phonons E = ħck', dash: [6, 4], width: 1.2 });
          const rp = []; for (let k = 1.55; k <= 2.3; k += 0.02) rp.push([k, 8.62 + 37.9 * (k - 1.92) * (k - 1.92)]);
          series.push({ pts: rp, label: 'roton Δ + ħ²(k−k₀)²/2μ', dash: [2, 3], width: 1.2 });
        }
        if (V.free) { const fp = []; for (let k = 0; k <= 1.9; k += 0.02) fp.push([k, 6.06 * k * k]); series.push({ pts: fp, label: 'free atom ħ²k²/2m', dash: [8, 3], width: 1.4 }); }
        const kmax = Math.min(2.6, v > 0 ? 22 * KV / v : 2.6);
        series.push({ pts: [[0, 0], [kmax, kmax * v / KV]], label: 'E = pv (v = ' + Math.round(v) + ' m/s)', width: 2 });
        plot.set({ series, marks: [{ x: LANDAU.k, y: LANDAU.E, label: 'touches at v_c' }] });
      }
      replot();
      const ions = { x: 60 }, rot = [], waves = [], therm = [];
      const R = kit.qm.rng(1941);
      for (let i = 0; i < 80; i++) therm.push({ x: 20 + R() * 720, y: 40 + R() * 150 });
      let acc = 0, wacc = 0;
      const loop = kit.loop(dt => {
        const v = V.v, vc = LANDAU.v, c0 = 18.3 * KV, T = V.T, nf = clamp(NORMAL(T), 0, 1);
        ions.x += v * dt; if (ions.x > 745) ions.x = 15;
        if (v > vc) {
          acc += dt * Math.min(40, 20 * (v - vc) / vc);
          const th = Math.acos(vc / v);
          while (acc >= 1) { acc -= 1; const ph = R() * 2 * Math.PI; rot.push({ x: ions.x, y: 115, vx: vc * Math.cos(th), vy: vc * Math.sin(th) * Math.cos(ph), t: 0 }); }
        }
        if (v > c0) { wacc += dt; if (wacc > 0.08) { wacc = 0; waves.push({ x: ions.x, y: 115, r: 0 }); } }
        for (const r of rot) { r.x += r.vx * dt; r.y += r.vy * dt; r.t += dt; }
        for (const w of waves) w.r += c0 * dt;
        while (rot.length && (rot[0].t > 4 || rot.length > 200)) rot.shift();
        while (waves.length && (waves[0].r > 400 || waves.length > 60)) waves.shift();
        for (const p of therm) { p.x += (R() - 0.5) * 80 * dt; p.y += (R() - 0.5) * 80 * dt; if (p.x < 20) p.x = 740; if (p.x > 740) p.x = 20; p.y = clamp(p.y, 42, 188); }
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 228);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf();
        c.fillStyle = T < 2.17 ? 'hsl(200 70% 55% / .16)' : 'hsl(200 30% 55% / .12)'; c.fillRect(10, 36, 740, 158);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.strokeRect(10, 36, 740, 158);
        kit.label(c, 'liquid helium at ' + T.toFixed(2) + ' K' + (T >= 2.17 ? ' (normal: above the lambda point)' : ''), 14, 20, { size: 12, color: C.muted });
        const nth = Math.round(80 * nf);
        c.fillStyle = C.faint; for (let i = 0; i < nth; i++) { c.beginPath(); c.arc(therm[i].x, therm[i].y, 2.2, 0, 6.2832); c.fill(); }
        c.save(); c.beginPath(); c.rect(10, 36, 740, 158); c.clip();
        c.strokeStyle = C.series ? C.series[2] : C.ok; c.lineWidth = 1.2;
        for (const w of waves) { c.globalAlpha = Math.max(0, 1 - w.r / 400); c.beginPath(); c.arc(w.x, w.y, Math.max(0, w.r), 0, 6.2832); c.stroke(); }
        c.globalAlpha = 1; c.restore();
        for (const r of rot) {
          const a = Math.max(0, 1 - r.t / 4), ang = Math.atan2(r.vy, r.vx);
          c.save(); c.translate(r.x, r.y); c.rotate(ang); c.globalAlpha = a; c.strokeStyle = C.warn; c.lineWidth = 1.6;
          c.beginPath(); c.ellipse(0, 0, 2.5, 6, 0, 0, 6.2832); c.stroke(); c.restore();
        }
        c.globalAlpha = 1;
        kit.dot(c, ions.x, 115, 7, C.accent, C.text);
        kit.arrow(c, ions.x + 9, 115, ions.x + 9 + Math.min(60, v * 0.25), 115, C.accent, 2);
        c.restore();
        ro.set('vc', LANDAU.v.toFixed(1) + ' m/s (the line touches at k = ' + LANDAU.k.toFixed(2) + ' Å⁻¹)');
        ro.set('c', c0.toFixed(0) + ' m/s');
        ro.set('state', T >= 2.17 ? 'ordinary viscous drag: no superfluid' : v <= vc ? 'no excitation can be made: superflow, no drag' : v <= c0 ? 'sheds rotons: drag' : 'sheds rotons and phonons (Mach cone): drag');
        ro.set('ang', v > vc ? (Math.acos(vc / v) * 180 / Math.PI).toFixed(0) + '° to the motion' : '—');
        ro.set('nf', (100 * nf).toFixed(nf < 0.01 ? 2 : 0) + ' %');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-vortices */
  const KAPPA = 6.62607015e-34 / (4.0026 * 1.66053906660e-27);   // h/m for helium-4, m²/s

  Hyper.sim('fr-vortices', {
    title: 'Quantised vortices in a rotating bucket',
    blurb: `A bucket of superfluid helium seen from above, turning at angular velocity $\\Omega$. The superfluid velocity is the [[?gradient]] of a phase, so it has no [[?curl]]: it cannot turn like a solid. Instead, once $\\Omega$ passes a small critical value, it threads itself with vortex lines, each carrying exactly one quantum of circulation $\\kappa = h/m = 9.97\\times10^{-8}$ m²/s (the [[?closed-integral]] of the velocity round any loop enclosing one line). The lines form a lattice that turns with the bucket, $n = 2\\Omega/\\kappa$ of them per unit area; the tracer particles (orange) are carried by their combined flow. The graph shows the speed along one radius: a sawtooth whose average is the solid-body speed $\\Omega r$.

**Try this**
- Start with $\\Omega$ below the first critical value: no vortices, and the tracers stay still while the bucket turns around them.
- Double $\\Omega$: twice as many lines, each with the same circulation. The total circulation round the rim, $N\\kappa$, matches $2\\pi R^2\\Omega$ of a solid body.
- Watch a tracer near one line: it circles fast close to the core, since the speed there is $\\kappa/2\\pi r$ (right-hand picture).
- Make the bucket larger: at the same $\\Omega$ the density of lines stays the same, about 2000 per cm² per rad/s. (Near the first critical speed the number drawn is approximate.)`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'W', label: 'Angular velocity Ω', min: 0, max: 2, step: 0.01, value: 1, unit: 'rad/s' },
        { id: 'R', label: 'Radius of the bucket', min: 0.3, max: 2, step: 0.01, value: 1, unit: 'mm' },
        { id: 'tr', type: 'check', label: 'Tracer particles in the superfluid', value: true },
        { type: 'buttons', items: [{ id: 'scatter', label: 'Scatter the tracers' }] }
      ], id => { if (id === 'scatter') seed(); build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['oc', 'First vortex appears at Ω ≈'], ['n', 'Density of lines 2Ω/κ'], ['N', 'Lines in the bucket'], ['b', 'Spacing of the lattice'], ['circ', 'Circulation round the rim: Nκ vs 2πR²Ω']]);
      const plot = kit.plot(gb, { x: { label: 'distance from the centre (mm)', min: 0 }, y: { label: 'azimuthal speed (mm/s)' }, legend: true }, 190);
      const rng = kit.qm.rng(1955);
      let vort = [], N = 0, b = 0, oc1 = 0, phi = 0, plotT = 1, tracers = [];
      function seed() { tracers = []; const R = V.R * 1e-3; for (let i = 0; i < 60; i++) { const r = R * 0.95 * Math.sqrt(rng()), a = rng() * 6.2832; tracers.push([r * Math.cos(a), r * Math.sin(a)]); } }
      function build() {
        const R = V.R * 1e-3, Om = V.W, n = 2 * Om / KAPPA;
        oc1 = KAPPA / (2 * Math.PI * R * R) * Math.log(R / 1e-10);
        N = Om < oc1 ? 0 : Math.max(1, Math.round(n * Math.PI * R * R * (1 - Math.exp(-(Om - oc1) / oc1))));
        vort = [];
        if (N === 1) vort.push([0, 0]);
        else if (N >= 2 && N <= 5) { const rr = R * 0.35; for (let i = 0; i < N; i++) vort.push([rr * Math.cos(6.2832 * i / N), rr * Math.sin(6.2832 * i / N)]); }
        else if (N >= 6) {
          b = R * Math.sqrt(2 * Math.PI / (Math.sqrt(3) * N)) * 0.92;
          const pts = [], m = Math.ceil(1.3 * R / b) + 2;
          for (let j = -m; j <= m; j++) for (let i = -m; i <= m; i++) { const x = (i + 0.5 * j) * b, y = j * b * Math.sqrt(3) / 2; pts.push([x, y, x * x + y * y]); }
          pts.sort((p, q) => p[2] - q[2]);
          for (let i = 0; i < N && i < pts.length; i++) vort.push([pts[i][0], pts[i][1]]);
        }
        b = N >= 2 ? Math.sqrt(Math.PI * R * R / N * 2 / Math.sqrt(3)) : R;
        if (!tracers.length) seed();
        plotT = 1;
      }
      // velocity of the superfluid at (x, y): every line and its image outside the wall (so no flow crosses the wall)
      function vel(x, y, rot) {
        const R = V.R * 1e-3, rc2 = Math.pow(0.12 * Math.min(b, R), 2), cs = Math.cos(rot), sn = Math.sin(rot), k = KAPPA / (2 * Math.PI);
        let u = 0, w = 0;
        for (const p of vort) {
          const xv = p[0] * cs - p[1] * sn, yv = p[0] * sn + p[1] * cs;
          let dx = x - xv, dy = y - yv, r2 = Math.max(rc2, dx * dx + dy * dy);
          u -= k * dy / r2; w += k * dx / r2;
          const q2 = xv * xv + yv * yv;
          if (q2 > 1e-14) { const xi = R * R * xv / q2, yi = R * R * yv / q2; dx = x - xi; dy = y - yi; r2 = Math.max(rc2, dx * dx + dy * dy); u += k * dy / r2; w -= k * dx / r2; }
        }
        return [u, w];
      }
      build();
      const loop = kit.loop(dt => {
        const R = V.R * 1e-3, Om = V.W;
        phi += Om * dt;
        if (V.tr && vort.length) {
          const n = vort.length > 150 ? 1 : 2, h = dt / n;
          for (let s = 0; s < n; s++) for (const t of tracers) {
            const a = vel(t[0], t[1], phi), mx = t[0] + a[0] * h / 2, my = t[1] + a[1] * h / 2, b2 = vel(mx, my, phi);
            t[0] += b2[0] * h; t[1] += b2[1] * h;
            const r = Math.hypot(t[0], t[1]); if (r > 0.97 * R) { t[0] *= 0.97 * R / r; t[1] *= 0.97 * R / r; }
          }
        }
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 380), cx = 210, cy = 190, S = 165 / R;
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf();
        // the bucket
        c.fillStyle = 'hsl(200 70% 55% / .14)'; c.beginPath(); c.arc(cx, cy, 165, 0, 6.2832); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 165, 0, 6.2832); c.stroke();
        for (let i = 0; i < 12; i++) { const a = phi + i * Math.PI / 6; c.beginPath(); c.moveTo(cx + 165 * Math.cos(a), cy + 165 * Math.sin(a)); c.lineTo(cx + 176 * Math.cos(a), cy + 176 * Math.sin(a)); c.stroke(); }
        kit.arrow(c, cx + 150, cy - 110, cx + 110, cy - 150, C.muted, 1.5);
        kit.label(c, 'Ω', cx + 142, cy - 142, { size: 13, color: C.muted });
        // vortex lines
        const cs = Math.cos(phi), sn = Math.sin(phi);
        for (const p of vort) {
          const x = cx + (p[0] * cs - p[1] * sn) * S, y = cy + (p[0] * sn + p[1] * cs) * S, rr = Math.max(3, Math.min(9, 0.18 * b * S));
          c.strokeStyle = C.accent; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, rr + 3, phi * 4, phi * 4 + 4.5); c.stroke();
          kit.dot(c, x, y, 2.6, C.accent);
        }
        if (V.tr) { c.fillStyle = C.warn; for (const t of tracers) { c.beginPath(); c.arc(cx + t[0] * S, cy + t[1] * S, 2.2, 0, 6.2832); c.fill(); } }
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 165, cy); c.stroke(); c.setLineDash([]);
        kit.label(c, N ? N + ' vortex lines, R = ' + V.R.toFixed(2) + ' mm' : 'no vortices: the superfluid stays at rest', cx, 12, { size: 12.5, align: 'center', color: C.text });
        // one vortex, close up
        const vx0 = 600, vy0 = 175;
        kit.label(c, 'one vortex line, close up', vx0, 22, { size: 12.5, align: 'center', color: C.text });
        kit.dot(c, vx0, vy0, 4, C.accent);
        [22, 44, 80, 125].forEach((r, i) => {
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(vx0, vy0, r, 0, 6.2832); c.stroke();
          const L = 900 / r, a0 = phi * 1.5 + i;
          for (let j = 0; j < 4; j++) { const a = a0 + j * Math.PI / 2, x = vx0 + r * Math.cos(a), y = vy0 + r * Math.sin(a); kit.arrow(c, x, y, x - L * Math.sin(a), y + L * Math.cos(a), C.accent, 1.6); }
        });
        kit.label(c, 'v = κ / 2πr: faster near the core', vx0, 322, { size: 12, align: 'center', color: C.text });
        kit.label(c, '∮ v · dl = κ = h/m on every loop round it', vx0, 342, { size: 12, align: 'center', color: C.muted });
        c.restore();
        plotT += dt;
        if (plotT > 0.15) {
          plotT = 0;
          const pts = [], sb = [];
          for (let i = 0; i <= 160; i++) {
            const r = R * i / 160, v = N ? vel(r, 0, phi)[1] : 0;
            pts.push([r * 1e3, clamp(v, -2 * Om * R, 3 * Om * R) * 1e3]); sb.push([r * 1e3, Om * r * 1e3]);
          }
          plot.set({ x: { label: 'distance from the centre along the dashed radius (mm)', min: 0, max: V.R }, series: [{ pts, label: 'superfluid speed' }, { pts: sb, label: 'solid body Ωr', dash: [6, 4] }] });
        }
        ro.set('oc', oc1.toFixed(3) + ' rad/s');
        ro.set('n', (2 * Om / KAPPA * 1e-4).toFixed(0) + ' per cm²');
        ro.set('N', N + ' (continuum estimate 2ΩπR²/κ = ' + Math.round(2 * Om * Math.PI * R * R / KAPPA) + ')');
        ro.set('b', N >= 2 ? (b * 1e3).toFixed(3) + ' mm' : '—');
        ro.set('circ', (N * KAPPA * 1e6).toFixed(2) + ' vs ' + (2 * Math.PI * R * R * Om * 1e6).toFixed(2) + ' mm²/s');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-parity */
  const PARITY_DATES = [[1956.29, 'Apr 1956', 'Rochester conference: can parity fail?'], [1956.75, 'Oct 1956', 'Lee and Yang: parity untested in weak decays'], [1957.02, 'Jan 1957', 'Wu et al.: cobalt-60 · muon decay'],
    [1957.7, 'Sep 1957', 'Sudarshan and Marshak: V − A'], [1958.0, 'Jan 1958', 'Feynman and Gell-Mann: V − A'], [1958.3, '1958', 'left-handed neutrino · π → eν at CERN']];

  Hyper.sim('fr-parity', {
    title: 'Wu\'s cobalt-60 experiment in a mirror',
    blurb: `Left: our world. Cobalt-60 nuclei sit inside a coil whose current lines up their spins (the thick arrow; the current runs to the right along the front of the coil). Each nucleus beta-decays, and the electron flies off; the counters above and below tally them. The rate at angle $\\theta$ to the spin is $1 + AP\\beta\\cos\\theta$ with $A = -1$: more electrons leave *against* the spin. Right: the same experiment in a mirror. Every electron track is mirrored, so the counts are the same — but the mirrored current runs the other way round the coil, so the mirrored spin points *down*. In the mirror world, electrons prefer to go *along* the spin. That is not what cobalt does in any laboratory: the mirror image of the experiment is not a possible experiment. Spin is an axial [[?vector]], and $\\cos\\theta$ is a [[?dot-product]] of spin and momentum, which changes sign in a mirror.

**Try this**
- Count a few hundred decays. Compare the fractions leaving along and against the spin in each world.
- *Reverse the magnet*: the spins flip, and so do the counts — the electrons follow the spin, not the laboratory.
- *Let it warm up*: as the nuclei lose their alignment ($P \\to 0$) the asymmetry fades, as it did in Wu's cryostat within minutes.
- Below, the neutrino: always spinning against its motion (left-handed). Its mirror image, a right-handed neutrino, has never been seen — the V − A law.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Nuclear polarisation P', min: 0, max: 1, step: 0.01, value: 0.6 },
        { id: 'beta', label: 'Electron speed β = v/c', min: 0.1, max: 0.95, step: 0.01, value: 0.7 },
        { id: 'rate', label: 'Decays per second (shown)', min: 5, max: 200, step: 1, value: 40 },
        { id: 'mir', type: 'check', label: 'Show the mirror world', value: true },
        { type: 'buttons', items: [{ id: 'flip', label: 'Reverse the magnet', primary: true }, { id: 'warm', label: 'Let it warm up' }, { id: 'clear', label: 'Clear the counts' }] }
      ], id => {
        if (id === 'flip') { spin = -spin; clear(); }
        else if (id === 'clear' || id === 'P' || id === 'beta') { clear(); if (id === 'P') warming = false; }
        else if (id === 'warm') warming = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ours', 'Our world'], ['mirror', 'Mirror world'], ['pred', 'Predicted, against the spin'], ['n', 'Electrons counted']]);
      const rnd = kit.qm.rng(1957);
      let spin = 1, els = [], top = 0, bot = 0, acc = 0, warming = false, t = 0;
      function clear() { top = 0; bot = 0; els = []; }
      const loop = kit.loop(dt => {
        t += dt;
        if (warming) { const P = V.P * Math.exp(-dt / 2); ctl.set('P', P < 0.005 ? 0 : P); if (P < 0.005) warming = false; }
        const a = -V.P * V.beta;
        acc += V.rate * dt;
        while (acc >= 1) {
          acc -= 1;
          let u; do { u = 2 * rnd() - 1; } while (rnd() * (1 + Math.abs(a)) > 1 + a * u);
          const ph = rnd() * 2 * Math.PI, s = Math.sqrt(1 - u * u), dy = -spin * u;
          els.push({ dx: s * Math.cos(ph), dy, r: 0, cat: dy < -0.8 ? 'top' : dy > 0.8 ? 'bot' : null, done: false });
        }
        for (const e of els) { e.r += 170 * dt; if (!e.done && e.r > 112) { e.done = true; if (e.cat === 'top') top++; else if (e.cat === 'bot') bot++; } }
        els = els.filter(e => e.r < 150);
        if (els.length > 400) els.splice(0, els.length - 400);
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 456);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf();
        const worlds = V.mir ? [[190, spin, 1], [570, -spin, -1]] : [[190, spin, 1]];
        for (const [cx, sp, mx] of worlds) {
          const cy = 170;
          kit.label(c, mx > 0 ? 'our world' : 'in the mirror', cx, 14, { size: 13.5, align: 'center', weight: 700, color: C.text });
          // counters
          c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.5;
          c.fillRect(cx - 34, cy - 142, 68, 22); c.strokeRect(cx - 34, cy - 142, 68, 22); c.fillRect(cx - 34, cy + 120, 68, 22); c.strokeRect(cx - 34, cy + 120, 68, 22);
          kit.label(c, String(top), cx, cy - 131, { size: 13, align: 'center', weight: 700, color: C.text });
          kit.label(c, String(bot), cx, cy + 131, { size: 13, align: 'center', weight: 700, color: C.text });
          // coil: back half faint, front half solid, with the current's direction
          for (const oy of [-14, 0, 14]) {
            c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.ellipse(cx, cy + oy, 72, 15, 0, Math.PI, 2 * Math.PI); c.stroke();
          }
          // electrons
          c.fillStyle = C.accent;
          for (const e of els) { const x = cx + mx * e.dx * e.r, y = cy + e.dy * e.r; c.globalAlpha = e.cat ? 1 : 0.45; c.beginPath(); c.arc(x, y, 2.4, 0, 6.2832); c.fill(); }
          c.globalAlpha = 1;
          // nucleus and spin
          kit.dot(c, cx, cy, 13, 'hsl(28 80% 55%)', C.text);
          kit.arrow(c, cx, cy, cx, cy - sp * 62, C.warn, 4);
          kit.label(c, 'spin', cx + 10, cy - sp * 52, { size: 12, color: C.warn, weight: 600 });
          for (const oy of [-14, 0, 14]) {
            c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.ellipse(cx, cy + oy, 72, 15, 0, 0, Math.PI); c.stroke();
          }
          const dir = sp;   // the front of the coil carries current to the right when the spin points up (right-hand rule); the mirror reverses it
          kit.arrow(c, cx - 14 * dir, cy + 29, cx + 14 * dir, cy + 29, C.text, 2);
          kit.label(c, 'current', cx + 40, cy + 38, { size: 11, align: 'center', color: C.muted });
          const along = sp > 0 ? top : bot, against = sp > 0 ? bot : top, n = along + against;
          kit.label(c, n ? 'along the spin ' + Math.round(100 * along / n) + ' %  ·  against ' + Math.round(100 * against / n) + ' %' : 'counting…', cx, cy + 162, { size: 12, align: 'center', color: C.text });
          // the neutrino: momentum and spin
          const ny = 356, pdir = mx;
          kit.arrow(c, cx - 50 * pdir, ny, cx + 50 * pdir, ny, C.muted, 2);
          kit.arrow(c, cx + 10 * pdir, ny - 12, cx - 22 * pdir, ny - 12, C.warn, 3.5);
          kit.label(c, 'ν', cx - 62 * pdir, ny, { size: 14, align: 'center', color: C.text, weight: 700 });
          kit.label(c, mx > 0 ? 'neutrino: spin against motion (left-handed) — seen' : 'mirror: spin along motion (right-handed) — never seen', cx, ny + 22, { size: 11.5, align: 'center', color: mx > 0 ? C.ok : C.bad });
        }
        if (V.mir) { c.strokeStyle = C.muted; c.lineWidth = 3; c.setLineDash([2, 5]); c.beginPath(); c.moveTo(380, 0); c.lineTo(380, 385); c.stroke(); c.setLineDash([]); kit.label(c, 'mirror', 380, 395, { size: 11, align: 'center', color: C.muted }); }
        // the dates
        const X = y => 50 + (y - 1956.1) / 2.4 * 660;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(1956.1), 425); c.lineTo(X(1958.5), 425); c.stroke();
        PARITY_DATES.forEach(([y, d, txt], i) => {
          kit.dot(c, X(y), 425, 4, C.accent);
          kit.label(c, d + ': ' + txt, clamp(X(y), 110, 650), i % 2 ? 443 : 409, { size: 10.5, align: 'center', color: C.text });
        });
        c.restore();
        const n = top + bot, alongO = spin > 0 ? top : bot;
        ro.set('ours', n ? Math.round(100 * (n - alongO) / n) + ' % against the spin' : '—');
        ro.set('mirror', n ? Math.round(100 * (n - alongO) / n) + ' % along the mirrored spin — not a real experiment' : '—');
        ro.set('pred', Math.round(100 * (0.5 + 0.45 * V.P * V.beta)) + ' % (in the counters\' cones)');
        ro.set('n', String(n));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-partons */
  // a simple parton model of the proton (valence and sea quarks; gluons carry the rest); x q(x) integrates to the momentum fraction
  const PDF = {
    uv: x => 2.187 * Math.pow(x, -0.5) * Math.pow(1 - x, 3),
    dv: x => 1.230 * Math.pow(x, -0.5) * Math.pow(1 - x, 4),
    sea: x => 0.2 * Math.pow(1 - x, 7) / x,
    ss: x => 0.1 * Math.pow(1 - x, 7) / x
  };
  const KINDS = [['a valence u quark', 4 / 9, PDF.uv, 'u'], ['a valence d quark', 1 / 9, PDF.dv, 'd'], ['a sea u or ū', 4 / 9, x => 2 * PDF.sea(x), 's'], ['a sea d or d̄', 1 / 9, x => 2 * PDF.sea(x), 's'], ['a sea s or s̄', 1 / 9, x => 2 * PDF.ss(x), 's']];
  const F2x = x => KINDS.reduce((s, k) => s + k[1] * k[2](x), 0);   // F₂(x)/x
  const GD2 = Q2 => Math.pow(1 + Q2 / 0.71, -4);                     // dipole form factor squared

  Hyper.sim('fr-partons', {
    title: 'Knocking partons out of a proton',
    blurb: `Electrons from a linear accelerator hit a proton. Each hard collision is one exchanged virtual photon (the wavy line, as in a Feynman diagram) that transfers $Q^2$ and an energy $\\nu$. In Feynman's frame the proton flies at almost the speed of light: flattened by Lorentz contraction, its internal motion slowed by time dilation (the [[?lorentz-factor]]), so the photon finds one free, frozen parton and knocks it out; the parton turns into a spray of particles (a jet). Which parton is hit is random, with the [[?probability-density]] of the parton model: charge squared times the density of partons carrying momentum fraction $x = Q^2/2M\\nu$. The histogram builds up that distribution. Switch the proton to a smooth ball of charge and hard collisions become rare at large $Q^2$ — the form factor.

**Try this**
- Fire a few dozen electrons and watch the histogram of $x$ fill in the shape of the curve: small $x$ is common (sea quarks), large $x$ rare.
- Raise $Q^2$: with partons the rate of hard scatters stays the same (scaling); with a smooth proton it collapses as $(1 + Q^2/0.71)^{-4}$, lower graph.
- Look at the proton at rest: its partons dart about. In the fast frame they hardly move while the electron passes — the heart of Feynman's argument.
- Note the angles: at SLAC energies the electrons scatter by only a few degrees (the drawing exaggerates them three times).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; gb.style.display = 'grid'; gb.style.gridTemplateColumns = '1fr 1fr'; gb.style.gap = '8px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'Q2', label: 'Momentum transfer Q²', min: 1, max: 10, step: 0.1, value: 3, unit: 'GeV²' },
        { id: 'E', label: 'Beam energy', min: 8, max: 20, step: 0.5, value: 16, unit: 'GeV' },
        { id: 'model', type: 'select', label: 'The proton', options: [['Point-like partons (Feynman)', 'p'], ['A smooth ball of charge', 's']], value: 'p' },
        { id: 'frame', type: 'select', label: 'Seen from', options: [['A frame where the proton is fast', 'fast'], ['The laboratory (proton at rest)', 'rest']], value: 'fast' },
        { id: 'auto', type: 'check', label: 'Keep firing', value: true },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire one electron', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], id => {
        if (id === 'fire' && !ev) start();
        if (id === 'clear' || id === 'Q2' || id === 'E' || id === 'model') { hist = new Array(20).fill(0); shots = 0; hard = 0; table(); replot(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['last', 'Last hard collision'], ['kin', 'Scattered electron'], ['hard', 'Hard collisions'], ['mom', 'In this model']]);
      const p1 = kit.plot(g1, { x: { label: 'Bjorken x', min: 0, max: 1 }, y: { label: 'collisions', min: 0 }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'Q² (GeV²)', min: 0, max: 10 }, y: { label: 'hard-collision rate (relative)', log: true, min: 1e-4, max: 2 }, legend: true }, 170);
      const M = 0.938, rnd = kit.qm.rng(1968);
      let hist = new Array(20).fill(0), shots = 0, hard = 0, ev = null, wait = 0, grid = null, t = 0, lastTxt = '—', kinTxt = '—';
      // partons: 3 valence quarks, 6 sea quarks, 7 gluons, in a unit disc
      const parts = [];
      const col = { u: 'hsl(0 75% 58%)', d: 'hsl(215 80% 60%)', s: 'hsl(140 50% 50%)' };
      [['u', -0.3, -0.35], ['u', 0.35, -0.1], ['d', -0.05, 0.4]].forEach(p => parts.push({ k: p[0], u: p[1], v: p[2], r: 7 }));
      for (let i = 0; i < 6; i++) { const a = rnd() * 6.28, rr = 0.3 + 0.55 * rnd(); parts.push({ k: 's', u: rr * Math.cos(a), v: rr * Math.sin(a), r: 3.5 }); }
      const gl = []; for (let i = 0; i < 7; i++) { const a = rnd() * 6.28, rr = 0.7 * rnd(); gl.push({ u: rr * Math.cos(a), v: rr * Math.sin(a), a: rnd() * 6.28 }); }
      function table() {
        const E = V.E, xmin = clamp(V.Q2 / (2 * M * (E - 0.5)), 0.005, 0.95), xs = [], cum = []; let s = 0;
        for (let i = 0; i <= 400; i++) { const x = xmin + (0.98 - xmin) * i / 400; xs.push(x); if (i) s += 0.5 * (F2x(x) + F2x(xs[i - 1])) * (x - xs[i - 1]); cum.push(s); }
        grid = { xs, cum, total: s, xmin };
      }
      function sampleX() { const u = rnd() * grid.total; let lo = 0, hi = grid.cum.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (grid.cum[m] < u) lo = m + 1; else hi = m; } return grid.xs[Math.max(0, lo - 1)] + rnd() * (grid.xs[1] - grid.xs[0]); }
      function replot() {
        const pts = [], exp = [], n = hist.reduce((a, b) => a + b, 0);
        hist.forEach((h, i) => { pts.push([i * 0.05, h], [(i + 1) * 0.05, h]); });
        if (grid && V.model === 'p') for (let i = 0; i < 20; i++) { const x0 = Math.max(grid.xmin, i * 0.05), x1 = Math.min(0.98, (i + 1) * 0.05); let s = 0; if (x1 > x0) for (let j = 0; j < 10; j++) { const x = x0 + (x1 - x0) * (j + 0.5) / 10; s += F2x(x) * (x1 - x0) / 10; } exp.push([(i + 0.5) * 0.05, n * s / grid.total]); }
        p1.set({ series: [{ pts, label: 'counted', fill: true }].concat(exp.length ? [{ pts: exp, label: 'parton model', dots: 3, line: false }] : []) });
        const pa = [], sm = []; for (let q = 0; q <= 10.001; q += 0.1) { pa.push([q, 1]); sm.push([q, Math.max(1e-4, GD2(q))]); }
        p2.set({ series: [{ pts: pa, label: 'point-like partons: scaling' }, { pts: sm, label: 'smooth proton: (1 + Q²/0.71)⁻⁴' }], vlines: [{ x: V.Q2, label: 'Q²' }] });
      }
      function start() {
        shots++;
        const smooth = V.model === 's', isHard = smooth ? rnd() < GD2(V.Q2) : true;
        let x = 1, kind = null, idx = -1;
        if (isHard && !smooth) {
          x = sampleX();
          let u = rnd() * F2x(x), k = 0; while (k < KINDS.length - 1 && u > KINDS[k][1] * KINDS[k][2](x)) { u -= KINDS[k][1] * KINDS[k][2](x); k++; }
          kind = KINDS[k];
          const cand = parts.map((p, i) => (p.k === kind[3] ? i : -1)).filter(i => i >= 0);
          idx = cand[Math.floor(rnd() * cand.length)];
          hist[Math.min(19, Math.floor(x / 0.05))]++;
        }
        const nu = V.Q2 / (2 * M * x), Ep = Math.max(0.05, V.E - nu), th = 2 * Math.asin(clamp(Math.sqrt(V.Q2 / (4 * V.E * Ep)), 0, 1)), Wm = Math.sqrt(Math.max(M * M, M * M + 2 * M * nu - V.Q2));
        if (isHard) {
          hard++;
          lastTxt = smooth ? 'elastic: the whole proton recoils (x = 1)' : 'x = ' + x.toFixed(3) + ', ' + kind[0];
          kinTxt = 'E′ = ' + Ep.toFixed(2) + ' GeV, θ = ' + (th * 180 / Math.PI).toFixed(1) + '°, ν = ' + nu.toFixed(2) + ' GeV, W = ' + Wm.toFixed(2) + ' GeV';
        }
        ev = { t: 0, hard: isHard, idx, th, jet: Array.from({ length: 9 }, () => [(rnd() - 0.5) * 0.5, 0.6 + 0.6 * rnd()]) };
        replot();
      }
      table(); replot();
      const loop = kit.loop(dt => {
        t += dt;
        if (ev) { ev.t += dt / 1.4; if (ev.t >= 1) ev = null; }
        else if (V.auto) { wait += dt; if (wait > 0.25) { wait = 0; start(); } }
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 330), fast = V.frame === 'fast', cx = 470, cy = 165;
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf();
        // the proton
        const rx = fast ? 14 : 80, ry = 80, jig = fast ? 0.6 : 7, sp = fast ? 0.3 : 9;
        c.fillStyle = 'hsl(30 70% 55% / .15)'; c.strokeStyle = 'hsl(30 70% 50%)'; c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); c.fill(); c.stroke();
        if (V.model === 's') { const gr = c.createRadialGradient(cx, cy, 2, cx, cy, ry); gr.addColorStop(0, 'hsl(30 80% 55% / .55)'); gr.addColorStop(1, 'hsl(30 80% 55% / 0)'); c.fillStyle = gr; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); c.fill(); }
        else {
          c.strokeStyle = C.ok; c.lineWidth = 1.3;
          for (const g of gl) { const x = cx + g.u * rx, y = cy + g.v * ry; c.beginPath(); for (let i = 0; i <= 12; i++) { const s = i / 12, xx = x + (s - 0.5) * 14 * Math.cos(g.a), yy = y + (s - 0.5) * 14 * Math.sin(g.a) + 2.5 * Math.sin(s * 12 + t * sp); if (i) c.lineTo(xx, yy); else c.moveTo(xx, yy); } c.stroke(); }
          parts.forEach((p, i) => {
            if (ev && ev.hard && i === ev.idx && ev.t > 0.45) return;
            const x = cx + p.u * rx + jig * Math.sin(t * sp + i * 1.7), y = cy + p.v * ry + jig * Math.cos(t * sp * 1.3 + i);
            kit.dot(c, x, y, p.r, col[p.k], C.text);
          });
        }
        if (fast) { c.strokeStyle = C.faint; c.lineWidth = 1.5; for (const dy of [-50, 0, 50]) { c.beginPath(); c.moveTo(cx + 30, cy + dy); c.lineTo(cx + 90, cy + dy); c.stroke(); } kit.label(c, '← proton at nearly c: flat, internal motion frozen', cx + 20, cy + ry + 20, { size: 11.5, color: C.muted }); }
        else kit.label(c, 'proton at rest: partons in constant motion', cx, cy + ry + 20, { size: 11.5, align: 'center', color: C.muted });
        // the electron
        const vx = cx - 70, vy = cy;
        if (ev) {
          const T = ev.t;
          if (T < 0.35) { const x = 30 + (vx - 30) * T / 0.35; kit.dot(c, x, vy, 5, C.accent); kit.arrow(c, x - 40, vy, x - 8, vy, C.accent, 1.5); }
          else if (!ev.hard) { const x = vx + (760 - vx) * (T - 0.35) / 0.65; kit.dot(c, x, vy - (x - vx) * 0.02, 5, C.accent); }
          else {
            const p = ev.idx >= 0 ? parts[ev.idx] : { u: 0, v: 0 }, px = cx + p.u * rx, py = cy + p.v * ry;
            if (T < 0.55) {   // the virtual photon
              c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
              const L = Math.hypot(px - vx, py - vy), ang = Math.atan2(py - vy, px - vx), s1 = Math.min(1, (T - 0.35) / 0.15);
              for (let i = 0; i <= 40 * s1; i++) { const s = i / 40 * L, w = 5 * Math.sin(s / 4); const x = vx + s * Math.cos(ang) - w * Math.sin(ang), y = vy + s * Math.sin(ang) + w * Math.cos(ang); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
              c.stroke(); kit.label(c, 'γ*', (vx + px) / 2, (vy + py) / 2 - 14, { size: 12, color: C.warn, weight: 700 });
            }
            const s2 = clamp((T - 0.45) / 0.55, 0, 1), dth = Math.min(1.0, 3 * ev.th);
            kit.dot(c, vx + 520 * s2 * Math.cos(dth), vy - 520 * s2 * Math.sin(dth), 5, C.accent);
            c.strokeStyle = C.accent; c.setLineDash([4, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(vx, vy); c.lineTo(vx + 520 * s2 * Math.cos(dth), vy - 520 * s2 * Math.sin(dth)); c.stroke(); c.setLineDash([]);
            if (T > 0.45) {
              const s3 = (T - 0.45) / 0.55;
              if (ev.idx >= 0) for (const j of ev.jet) kit.dot(c, px + 260 * s3 * j[1], py + 260 * s3 * (0.35 + j[0]), 2.6, col[parts[ev.idx].k]);
              else kit.dot(c, cx + 200 * s3, cy + 90 * s3, 9, 'hsl(30 70% 55%)');
            }
            kit.label(c, 'θ = ' + (ev.th * 180 / Math.PI).toFixed(1) + '° (drawn ×3)', vx + 140, vy - 120 * Math.min(1, 3 * ev.th) - 16, { size: 11.5, color: C.accent });
          }
        }
        kit.label(c, 'electron beam, ' + V.E + ' GeV →', 20, cy - 26, { size: 12, color: C.accent });
        c.restore();
        ro.set('last', lastTxt); ro.set('kin', kinTxt);
        ro.set('hard', hard + ' of ' + shots + ' electrons');
        ro.set('mom', 'quarks carry about 44 % of the proton\'s momentum; gluons (green) the rest');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-oring */
  // an illustrative model, not measured data: the rubber springs back with a time constant that grows about
  // tenfold for every 10 °C of cooling (the trend of a rubber approaching its glassy state)
  const tauOf = T => 0.06 * Math.pow(10, (24 - T) / 10);
  const GAPMAX = 0.8, RAMP = 0.6, FREE = 1.0, LEAK = 0.1;   // mm, s, mm, mm
  const gapAt = t => GAPMAX * (t <= 0 ? 0 : t >= RAMP ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t / RAMP));
  function ringRun(T, tEnd, h) {
    const tau = tauOf(T), out = []; let r = 0, leak = 0, first = null, last = null, maxLag = 0;
    for (let t = 0; t <= tEnd + 1e-9; t += h) {
      const g = gapAt(t);
      r = Math.min(g, r + (FREE - r) * (1 - Math.exp(-h / tau)));
      const lag = g - r; maxLag = Math.max(maxLag, lag);
      if (lag > LEAK) { leak += h; if (first == null) first = t; last = t; }
      out.push([t, g, r]);
    }
    return { pts: out, leak, first, last, maxLag };
  }

  Hyper.sim('fr-oring', {
    title: 'The O-ring and the glass of iced water',
    blurb: `Left: a field joint of the booster in section (the gap is drawn greatly enlarged). Hot gas is on the left. When the booster fires, the pressure makes the joint flex and the gap between tang and clevis opens by a fraction of a millimetre in a few tenths of a second; the squeezed O-rings must spring back to follow it. Right: Feynman's test — a piece of the rubber squeezed in a clamp and dipped in water; release the clamp and watch how fast it recovers. Both use the same **illustrative** model of the rubber: its recovery time grows about ten times for every 10 °C of cooling (the [[?exponential]] trend of a rubber stiffening as it cools). The numbers show the trend; they are not measured data for the Shuttle's rubber.

**Try this**
- *A warm day (24 °C)*: fire the booster. The O-ring follows the opening gap almost at once: sealed.
- *January 1985 (12 °C)*: the ring lags for a while — hot gas gets past it before it catches up. That flight showed the worst blow-by before Challenger.
- *Challenger's morning (2 °C)*: the ring is still far behind the gap seconds later; the secondary ring is just as sluggish.
- Release the clamp in iced water, then at room temperature: at 0 °C the rubber stays flattened for many seconds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Conditions', options: [['Challenger\'s launch morning (about 2 °C)', 2], ['January 1985 flight (about 12 °C)', 12], ['A warm day (24 °C)', 24], ['Iced water (0 °C)', 0]], value: 2 },
        { id: 'T', label: 'Temperature of the rubber', min: -5, max: 30, step: 0.5, value: 2, unit: '°C' },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire the booster', primary: true }, { id: 'rel', label: 'Release the clamp' }, { id: 'sq', label: 'Squeeze again' }] }
      ], id => {
        if (id === 'pre') { ctl.set('T', V.pre); recalc(); }
        if (id === 'T') recalc();
        if (id === 'fire') { tb = 0; firing = true; }
        if (id === 'rel') { tr = 0; released = true; }
        if (id === 'sq') { released = false; tr = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tau', 'Recovery time of the rubber (model)'], ['lag', 'Largest gap left open by the ring'], ['blow', 'Hot gas past the primary O-ring'], ['clamp', 'Clamp test'], ['ref', 'For comparison']]);
      const plot = kit.plot(gb, { x: { label: 'time after ignition (s)', min: 0, max: 4 }, y: { label: 'mm', min: 0, max: 1.05 }, legend: true }, 180);
      let run = null, warm = null, tb = -1, firing = false, released = false, tr = 0;
      function recalc() {
        run = ringRun(V.T, 4, 0.002); warm = ringRun(24, 4, 0.002);
        const pick = (r, i) => r.pts.filter((_, j) => j % 10 === 0).map(p => [p[0], p[i]]);
        plot.set({ series: [{ pts: pick(run, 1), label: 'gap opening', width: 2.2 }, { pts: pick(run, 2), label: 'O-ring face at ' + V.T + ' °C', width: 2.2 }, { pts: pick(warm, 2), label: 'O-ring face at 24 °C', dash: [5, 4] }], vlines: tb >= 0 ? [{ x: Math.min(4, tb), label: '' }] : [] });
      }
      recalc();
      const gasP = []; const rg = kit.qm.rng(1986);
      const loop = kit.loop(dt => {
        if (firing) { tb += dt * 0.5; if (tb >= 4) { tb = 4; firing = false; } }
        if (released) tr += dt;
        const T = V.T, tau = tauOf(T);
        const idx = tb < 0 ? 0 : Math.min(run.pts.length - 1, Math.round(tb / 0.002)), pt = run.pts[idx], g = tb < 0 ? 0 : pt[1], r = tb < 0 ? 0 : pt[2], lag = g - r;
        // hot gas particles leaking past when the ring lags
        if (tb > 0 && tb < 4 && lag > LEAK) for (let k = 0; k < 3; k++) gasP.push({ x: 40, y: 0, v: 90 + 60 * rg(), t: 0 });
        for (const p of gasP) { p.x += p.v * dt; p.t += dt; }
        while (gasP.length && (gasP[0].x > 440 || gasP.length > 300)) gasP.shift();
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 360);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf();
        // --- the joint (the gap exaggerated: 1 mm of opening = 60 px)
        const y0 = 180, steel = 'hsl(210 12% 58%)', steelD = 'hsl(210 12% 42%)', gpx = 4 + 60 * g, yT = y0 - gpx;
        c.fillStyle = tb > 0 ? 'hsl(18 90% 55% / .35)' : 'hsl(18 40% 55% / .12)'; c.fillRect(10, 60, 26, 220);
        kit.label(c, tb > 0 ? 'hot gas' : 'inside', 23, 50, { size: 11.5, align: 'center', color: tb > 0 ? C.bad : C.muted });
        c.fillStyle = steel; c.fillRect(36, 70, 400, yT - 70);                   // tang (above)
        c.fillStyle = steelD; c.fillRect(36, y0, 400, 90);                         // clevis (below)
        kit.label(c, 'tang', 90, 100, { size: 12, color: C.bg || '#fff', weight: 600 }); kit.label(c, 'clevis', 90, 250, { size: 12, color: C.bg || '#fff', weight: 600 });
        c.fillStyle = C.bg2 || C.bg; c.fillRect(36, yT, 400, gpx);
        const ring = (xc, rr, cold) => {
          c.fillStyle = C.bg2 || C.bg; c.fillRect(xc - 30, y0, 60, 30);          // the groove
          const top = y0 - 4 - 60 * rr, bot = y0 + 30, ry = (bot - top) / 2;
          c.fillStyle = cold ? 'hsl(215 30% 30%)' : 'hsl(215 25% 22%)'; c.beginPath(); c.ellipse(xc, (top + bot) / 2, 27, Math.max(1, ry), 0, 0, 6.2832); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          if (yT < top - 0.5) { c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xc, yT); c.lineTo(xc, top); c.stroke(); }
        };
        ring(180, r, T < 10); ring(320, r, T < 10);
        kit.label(c, 'primary O-ring', 180, 292, { size: 11.5, align: 'center', color: C.text }); kit.label(c, 'secondary', 320, 292, { size: 11.5, align: 'center', color: C.text });
        c.fillStyle = 'hsl(18 95% 55%)';
        for (const p of gasP) { const y = yT + gpx / 2 + Math.sin(p.x * 0.2 + p.t * 9) * gpx * 0.3; if (p.x < 180 || lag > LEAK) { c.beginPath(); c.arc(p.x, y, 2.4, 0, 6.2832); c.fill(); } }
        kit.label(c, tb < 0 ? 'press Fire the booster' : 't = ' + tb.toFixed(2) + ' s after ignition' + (lag > LEAK ? ' — blow-by!' : ''), 236, 30, { size: 13, align: 'center', color: lag > LEAK ? C.bad : C.text, weight: 600 });
        kit.label(c, 'gap drawn ×15', 400, 330, { size: 11, align: 'right', color: C.muted });
        // --- the clamp in a glass of water
        const gx = 470, gy = 120;
        c.fillStyle = 'hsl(200 70% 55% / .22)'; c.beginPath(); c.moveTo(gx + 20, gy + 40); c.lineTo(gx + 250, gy + 40); c.lineTo(gx + 235, gy + 220); c.lineTo(gx + 35, gy + 220); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(gx + 10, gy); c.lineTo(gx + 35, gy + 220); c.lineTo(gx + 235, gy + 220); c.lineTo(gx + 260, gy); c.stroke();
        if (T <= 1) { c.fillStyle = 'hsl(200 60% 92% / .8)'; c.strokeStyle = C.muted; c.lineWidth = 1; [[40, 44], [190, 48], [95, 52], [150, 190]].forEach(([dx, dy]) => { c.fillRect(gx + dx, gy + dy, 22, 18); c.strokeRect(gx + dx, gy + dy, 22, 18); }); }
        kit.label(c, 'water at ' + T + ' °C' + (T <= 1 ? ', with ice' : ''), gx + 135, gy - 12, { size: 12, align: 'center', color: C.text });
        const h0 = 12, h1 = 34, h = released ? h0 + (h1 - h0) * (1 - Math.exp(-tr / tau)) : h0, jaw = released ? h1 + 6 : h0;
        const sy = gy + 140;
        c.fillStyle = 'hsl(215 25% 25%)'; c.fillRect(gx + 80, sy - h / 2, 110, h);
        c.strokeStyle = C.muted; c.lineWidth = 6;
        c.beginPath(); c.moveTo(gx + 135, sy - jaw / 2 - 3); c.lineTo(gx + 135, sy - 70); c.lineTo(gx + 225, sy - 70); c.lineTo(gx + 225, sy + 70); c.lineTo(gx + 135, sy + 70); c.lineTo(gx + 135, sy + jaw / 2 + 3); c.stroke();
        c.lineWidth = 3; c.beginPath(); c.moveTo(gx + 115, sy - jaw / 2 - 3); c.lineTo(gx + 155, sy - jaw / 2 - 3); c.moveTo(gx + 115, sy + jaw / 2 + 3); c.lineTo(gx + 155, sy + jaw / 2 + 3); c.stroke();
        kit.label(c, released ? 'released ' + tr.toFixed(1) + ' s ago: ' + Math.round(100 * (h - h0) / (h1 - h0)) + ' % recovered' : 'rubber squeezed in a C-clamp', gx + 135, gy + 245, { size: 12, align: 'center', color: C.text });
        c.restore();
        if (tb >= 0 && Math.floor(tb * 8) !== Math.floor((tb - dt * 0.5) * 8)) plot.set({ vlines: [{ x: Math.min(4, tb), label: '' }] });
        ro.set('tau', tau < 1 ? (tau * 1000).toFixed(0) + ' ms' : tau.toFixed(1) + ' s');
        ro.set('lag', run.maxLag.toFixed(2) + ' mm');
        ro.set('blow', run.leak > 0 ? 'for ' + run.leak.toFixed(2) + ' s (from ' + run.first.toFixed(2) + ' s)' + (run.last >= 3.99 ? ', still open at 4 s' : '') : 'none: sealed');
        ro.set('clamp', released ? Math.round(100 * (1 - Math.exp(-tr / tau))) + ' % recovered after ' + tr.toFixed(1) + ' s' : 'squeezed');
        ro.set('ref', 'Challenger: about 2 °C · January 1985: about 12 °C · earlier flights: warmer');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-risk */
  Hyper.sim('fr-risk', {
    title: 'One in a hundred, or one in a hundred thousand?',
    blurb: `The 135 flights of the Space Shuttle (1981–2011), one square each. Choose a chance of losing a vehicle on any one flight and fly the programme: each flight succeeds or fails at random with that [[?probability]]. The graph shows the chance of at least one loss after $N$ flights, $1 - (1-p)^N$. Engineers estimated about 1 in 100; managers claimed 1 in 100 000. The real record was two losses in 135 flights: Challenger on the 25th flight (1986) and Columbia on the 113th (2003).

**Try this**
- Fly the programme several times at 1 in 100: you will usually see one or two losses, sometimes none, sometimes three.
- Switch to 1 in 100 000 and fly a thousand programmes: almost none has any loss at all. Two losses would be a one-in-a-million event.
- Find the chance per flight at which a 25-flight programme has a 50 % chance of a loss (about 1 in 36).
- Read the last line: at 1 in 100 000 a launch every day would expect one loss in about 270 years.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Estimate', options: [['Engineers: about 1 in 100', 0.01], ['Management: 1 in 100 000', 1e-5], ['The record: 2 in 135', 2 / 135], ['Past solid rockets: 121 in about 2900', 121 / 2900]], value: 0.01 },
        { id: 'p', label: 'Chance of loss per flight', min: 1e-5, max: 0.1, value: 0.01, log: true, fmt: v => '1 in ' + sig(1 / v, 3) },
        { type: 'buttons', items: [{ id: 'fly', label: 'Fly the programme', primary: true }, { id: 'mc', label: 'Fly 1000 programmes' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'pre') { ctl.set('p', V.pre); replot(); reset(); mcTxt = '—'; }
        if (id === 'p') { replot(); mcTxt = '—'; }
        if (id === 'fly') { reset(); flying = true; }
        if (id === 'mc') montecarlo();
        if (id === 'reset') { reset(); mcTxt = '—'; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p1', 'Per flight'], ['p25', 'At least one loss in 25 flights'], ['p135', 'At least one loss in 135 flights'], ['exp', 'Expected losses in 135 flights'], ['run', 'This programme'], ['mc', '1000 programmes'], ['yrs', 'One launch a day: first loss expected after']]);
      const plot = kit.plot(gb, { x: { label: 'number of flights N', min: 0, max: 150 }, y: { label: 'chance of at least one loss (%)', min: 0, max: 100 }, legend: true }, 180);
      const rng = kit.qm.rng(1986);
      let flights = new Array(135).fill(0), k = 0, flying = false, acc = 0, mcTxt = '—';
      function reset() { flights = new Array(135).fill(0); k = 0; flying = false; }
      function curve(p) { const pts = []; for (let n = 0; n <= 150; n++) pts.push([n, 100 * (1 - Math.pow(1 - p, n))]); return pts; }
      function replot() {
        plot.set({ series: [{ pts: curve(V.p), label: 'your choice: 1 in ' + sig(1 / V.p, 3), width: 2.4 }, { pts: curve(0.01), label: '1 in 100', dash: [6, 4] }, { pts: curve(1e-5), label: '1 in 100 000', dash: [2, 3] }],
          vlines: [{ x: 25, label: 'Challenger' }, { x: 113, label: 'Columbia' }, { x: 135, label: 'end' }] });
      }
      function montecarlo() {
        let one = 0, two = 0; const p = V.p;
        for (let r = 0; r < 1000; r++) { let n = 0; for (let i = 0; i < 135; i++) if (rng() < p) n++; if (n >= 1) one++; if (n >= 2) two++; }
        mcTxt = (one / 10).toFixed(1) + ' % had a loss, ' + (two / 10).toFixed(1) + ' % two or more';
      }
      replot();
      const loop = kit.loop(dt => {
        if (flying) { acc += dt * 25; while (acc >= 1 && k < 135) { acc -= 1; flights[k] = rng() < V.p ? 2 : 1; k++; } if (k >= 135) flying = false; }
        const c = st.begin(), C = kit.colors(), f = fit(st, 760, 320);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf();
        const sz = 40, x0 = 80, y0 = 30;
        for (let i = 0; i < 135; i++) {
          const col = i % 15, row = Math.floor(i / 15), x = x0 + col * sz, y = y0 + row * 30;
          c.fillStyle = flights[i] === 2 ? C.bad : flights[i] === 1 ? C.ok : C.faint; c.globalAlpha = flights[i] ? 0.9 : 0.35;
          c.fillRect(x, y, sz - 6, 24); c.globalAlpha = 1;
          if (i === 24 || i === 112) { c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x - 1, y - 1, sz - 4, 26); }
          if (flights[i] === 2) kit.label(c, '✕', x + (sz - 6) / 2, y + 12, { size: 13, align: 'center', color: '#fff', weight: 700 });
        }
        kit.label(c, 'flight 25 (Challenger) and 113 (Columbia) are outlined', 380, 305, { size: 12, align: 'center', color: C.muted });
        c.restore();
        const p = V.p, P = n => 1 - Math.pow(1 - p, n), lost = flights.filter(v => v === 2).length, first = flights.indexOf(2);
        ro.set('p1', '1 in ' + sig(1 / p, 3) + ' (' + sig(100 * p, 3) + ' %)');
        ro.set('p25', sig(100 * P(25), 3) + ' %');
        ro.set('p135', sig(100 * P(135), 3) + ' %');
        ro.set('exp', sig(135 * p, 3));
        ro.set('run', k ? lost + ' lost in ' + k + ' flights' + (first >= 0 ? ', the first on flight ' + (first + 1) : '') : '—');
        ro.set('mc', mcTxt);
        ro.set('yrs', sig(1 / (p * 365), 3) + ' years');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fr-timeline */
  // [year, track (0 life, 1 research, 2 teaching and books), title, what happened, where to read]
  const LIFE = [
    [1918.36, 0, 'Born in New York', '11 May 1918, in New York; he grows up in Far Rockaway, Queens.', 'What Do You Care What Other People Think? (1988)'],
    [1935.7, 0, 'MIT', 'Studies physics at the Massachusetts Institute of Technology, graduating in 1939.', 'Surely You\'re Joking, Mr. Feynman! (1985)'],
    [1939.4, 1, 'Forces in molecules', 'His MIT thesis gives the Hellmann–Feynman theorem on the forces in molecules (Physical Review, 1939).', ''],
    [1939.7, 0, 'Princeton', 'Graduate student of John Wheeler at Princeton.', 'Nobel lecture (1965)'],
    [1941.0, 1, 'Absorber theory with Wheeler', 'Wheeler and Feynman describe radiation as a direct action between charges (published 1945 and 1949).', 'Nobel lecture (1965)'],
    [1942.4, 1, 'Least action in quantum mechanics', 'PhD thesis, The Principle of Least Action in Quantum Mechanics — the seed of the path integral.', 'Nobel lecture (1965); this app: the sum over paths'],
    [1942.46, 0, 'Marries Arline Greenbaum', 'They marry in June 1942.', 'What Do You Care What Other People Think? (1988)'],
    [1943.3, 0, 'Los Alamos', 'Joins Hans Bethe\'s theoretical division; leads the group running large calculations on punched-card machines.', 'Surely You\'re Joking; the talk "Los Alamos from Below" (1975)'],
    [1945.46, 0, 'Arline dies', 'Arline dies of tuberculosis in June 1945.', 'What Do You Care What Other People Think? (1988)'],
    [1945.54, 0, 'Trinity', 'Watches the first nuclear test, 16 July 1945.', 'Surely You\'re Joking, Mr. Feynman! (1985)'],
    [1945.8, 0, 'Cornell', 'Professor at Cornell University until 1950.', ''],
    [1948.3, 1, 'The path integral', '"Space-Time Approach to Non-Relativistic Quantum Mechanics" (Reviews of Modern Physics): quantum mechanics as a sum over histories.', 'Quantum Mechanics and Path Integrals (1965); this app: the sum over paths'],
    [1949.5, 1, 'Feynman diagrams', '"The Theory of Positrons" and "Space-Time Approach to Quantum Electrodynamics"; Freeman Dyson shows the equivalence with Schwinger and Tomonaga.', 'QED (1985); this app: Feynman diagrams'],
    [1950.6, 0, 'Caltech', 'Moves to Caltech, his home for the rest of his life (with a year in Brazil, 1951–52).', 'Surely You\'re Joking, Mr. Feynman! (1985)'],
    [1954.0, 1, 'Superfluid helium', 'Atomic theory of liquid helium: phonons and rotons (1953–54), quantised vortices (1955), backflow with Michael Cohen (1956).', 'Statistical Mechanics (1972); this app: superfluid helium'],
    [1957.8, 1, 'V − A with Gell-Mann', '"Theory of the Fermi Interaction" (January 1958): the weak force acts only on left-handed particles.', 'Surely You\'re Joking, "The 7 Percent Solution"; this app: V − A'],
    [1959.99, 2, 'Plenty of Room at the Bottom', 'Talk of 29 December 1959 at Caltech: the encyclopaedia on the head of a pin.', 'The Pleasure of Finding Things Out (1999); this app'],
    [1961.75, 2, 'The Feynman Lectures', 'Gives Caltech\'s introductory physics course (1961–63), published as The Feynman Lectures on Physics (1963–65).', 'feynmanlectures.caltech.edu'],
    [1962.8, 2, 'Lectures on gravitation', 'A graduate course at Caltech (1962–63), published in 1995.', 'Feynman Lectures on Gravitation (1995)'],
    [1964.2, 2, 'The lost lecture', 'March 1964: why planetary orbits are ellipses, by geometry alone.', 'Feynman\'s Lost Lecture (1996)'],
    [1964.85, 2, 'The Messenger Lectures', 'The Character of Physical Law, Cornell, November 1964 — filmed by the BBC; book 1965.', 'The Character of Physical Law (1965)'],
    [1965.5, 2, 'Quantum Mechanics and Path Integrals', 'The path-integral textbook, written with A. R. Hibbs.', 'Quantum Mechanics and Path Integrals (1965)'],
    [1965.8, 1, 'Nobel Prize', 'Shared with Sin-Itiro Tomonaga and Julian Schwinger for quantum electrodynamics; Nobel lecture on 11 December 1965.', 'Nobel lecture, "The Development of the Space-Time View of Quantum Electrodynamics"'],
    [1968.7, 1, 'Partons', 'Interprets the SLAC electron-scattering results; "Very High-Energy Collisions of Hadrons" (1969).', 'Photon-Hadron Interactions (1972); this app: partons'],
    [1972.5, 2, 'Two books and a teaching medal', 'Statistical Mechanics and Photon-Hadron Interactions; the Oersted Medal for teaching.', ''],
    [1974.45, 2, 'Cargo Cult Science', 'Caltech commencement address on scientific integrity (June 1974).', 'Surely You\'re Joking, Mr. Feynman! (1985)'],
    [1979.5, 2, 'QED in Auckland', 'The Douglas Robb Memorial Lectures on light and electrons, filmed; the book QED follows in 1985.', 'QED: The Strange Theory of Light and Matter (1985)'],
    [1981.4, 1, 'Simulating Physics with Computers', 'Keynote at MIT, May 1981: nature is quantum, so simulate it with a quantum computer.', 'International Journal of Theoretical Physics (1982); this app'],
    [1981.8, 0, 'The Pleasure of Finding Things Out', 'BBC Horizon interview about his father, doubt and the joy of discovery.', 'The Pleasure of Finding Things Out (1999)'],
    [1983.5, 2, 'A course on computation', 'Caltech course on the potentialities and limitations of computing machines (1983–86).', 'Feynman Lectures on Computation (1996)'],
    [1985.3, 2, 'QED and Surely You\'re Joking', 'The arrows for everyone, and his stories told with Ralph Leighton.', 'QED (1985); Surely You\'re Joking, Mr. Feynman! (1985)'],
    [1986.11, 0, 'The Challenger commission', 'The iced-water demonstration, 11 February 1986; his Appendix F of the report, June 1986.', 'What Do You Care What Other People Think? (1988); this app: the Challenger O-ring'],
    [1988.12, 0, 'Dies in Los Angeles', '15 February 1988, aged 69.', ''],
    [1988.8, 2, 'What Do You Care What Other People Think?', 'His second book of stories, including the Challenger inquiry.', ''],
    [1995.8, 2, 'Posthumous lectures', 'On Gravitation (1995), on Computation (1996), the Lost Lecture (1996), The Meaning of It All (1998).', '']
  ];
  const PERIODS = [[1935.7, 1939.4, 'MIT'], [1939.7, 1942.5, 'Princeton'], [1943.3, 1945.8, 'Los Alamos'], [1945.8, 1950.6, 'Cornell'], [1950.6, 1988.12, 'Caltech']];

  Hyper.sim('fr-timeline', {
    title: 'Feynman\'s life in physics',
    blurb: `Seventy years on three tracks: life, research, and teaching and books. The bars along the top are the places he worked. Drag the year, click a dot, or step from event to event; the card says what happened and where to read about it.

**Try this**
- Follow the research track from 1942 to 1949: least action becomes the path integral, and the path integral becomes the diagrams of QED.
- Notice how the teaching track fills after 1960, and how much of it was published after his death.
- Step to 1986 and then open the page on the Challenger O-ring.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'y', label: 'Year', min: 1918, max: 1996, step: 0.1, value: 1948.3, fmt: v => String(Math.floor(v)) },
        { type: 'buttons', items: [{ id: 'prev', label: '◀ Previous' }, { id: 'next', label: 'Next ▶', primary: true }, { id: 'play', label: 'Play' }] }
      ], id => {
        if (id === 'prev') { go(-1); playing = false; }
        else if (id === 'next') { go(1); playing = false; }
        else if (id === 'play') { playing = !playing; wait = 0; }
        else if (id === 'y') { sel = nearest(V.y); playing = false; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['when', 'When'], ['what', 'What'], ['read', 'Read']]);
      const X = y => 40 + (y - 1915) / 85 * 700, TY = [86, 156, 226], TN = ['life', 'research', 'teaching and books'];
      let sel = 11, playing = false, wait = 0, geo = { s: 1, ox: 0, oy: 0 };
      function nearest(y) { let b = 0; LIFE.forEach((e, i) => { if (Math.abs(e[0] - y) < Math.abs(LIFE[b][0] - y)) b = i; }); return b; }
      function go(d) { sel = clamp(sel + d, 0, LIFE.length - 1); ctl.set('y', LIFE[sel][0]); }
      kit.click(st, p => {
        const x = (p.x - geo.ox) / geo.s, y = (p.y - geo.oy) / geo.s;
        let best = -1, bd = 14;
        LIFE.forEach((e, i) => { const d = Math.hypot(x - X(e[0]), y - TY[e[1]]); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { sel = best; ctl.set('y', LIFE[sel][0]); playing = false; }
      }, p => { const x = (p.x - geo.ox) / geo.s, y = (p.y - geo.oy) / geo.s; return LIFE.some(e => Math.hypot(x - X(e[0]), y - TY[e[1]]) < 14); });
      const loop = kit.loop(dt => {
        if (playing) { wait += dt; if (wait > 2.2) { wait = 0; if (sel >= LIFE.length - 1) playing = false; else go(1); } }
        const c = st.begin(), C = kit.colors(); geo = fit(st, 760, 420);
        c.save(); c.translate(geo.ox, geo.oy); c.scale(geo.s, geo.s); c.font = '12px ' + fontOf();
        // places
        PERIODS.forEach(([a, b, n], i) => {
          c.fillStyle = kit.hue(30 + 50 * i, 0.35); c.fillRect(X(a), 30, X(b) - X(a), 20);
          kit.label(c, n, (X(a) + X(b)) / 2, 40, { size: 11, align: 'center', color: C.text, weight: 600 });
        });
        // tracks and the axis
        TY.forEach((y, i) => { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(1915), y); c.lineTo(X(2000), y); c.stroke(); kit.label(c, TN[i], X(1915), y - 11, { size: 11, color: C.muted }); });
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(1915), 252); c.lineTo(X(2000), 252); c.stroke();
        for (let y = 1920; y <= 2000; y += 10) { c.beginPath(); c.moveTo(X(y), 248); c.lineTo(X(y), 256); c.stroke(); kit.label(c, String(y), X(y), 266, { size: 11, align: 'center', color: C.muted }); }
        // the cursor
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(V.y), 24); c.lineTo(X(V.y), 256); c.stroke(); c.setLineDash([]);
        // events
        LIFE.forEach((e, i) => { const on = i === sel; kit.dot(c, X(e[0]), TY[e[1]], on ? 8 : 5, on ? C.accent : [C.ok, C.accent, C.warn][e[1]], on ? C.text : null); });
        const e = LIFE[sel];
        // the card
        c.fillStyle = C.surface; c.strokeStyle = C.accent; c.lineWidth = 1.5; c.fillRect(40, 282, 700, 128); c.strokeRect(40, 282, 700, 128);
        c.strokeStyle = C.accent; c.beginPath(); c.moveTo(X(e[0]), TY[e[1]] + 8); c.lineTo(X(e[0]), 282); c.stroke();
        const age = e[0] < 1988.13 ? Math.floor(e[0] - 1918.36) : 0;
        kit.label(c, e[2], 54, 300, { size: 15, weight: 700, color: C.text });
        kit.label(c, Math.floor(e[0]) + (age > 0 ? ' · age ' + age : ''), 726, 300, { size: 12, align: 'right', color: C.muted });
        c.font = '13px ' + fontOf();
        const lines = wrap(c, e[3], 670).slice(0, 3);
        lines.forEach((l, i) => kit.label(c, l, 54, 326 + i * 18, { size: 13, color: C.text }));
        if (e[4]) kit.label(c, 'Read: ' + e[4], 54, 396, { size: 12, color: C.muted });
        c.restore();
        ro.set('when', String(Math.floor(e[0])) + (age > 0 ? ' (age ' + age + ')' : ''));
        ro.set('what', e[2]);
        ro.set('read', e[4] || '—');
      }, box.stage);
      loop.start();
    }
  });

})();
