/* HYPER-FEYNMAN · sims/feynman-way.js — simulations for Feynman's way of thinking (prefix way-).
 *   way-water-drop     molecules jiggling in a drop, magnified: solid, liquid, gas, evaporation, attraction and repulsion
 *   way-rules-game     learning the rules of a game by watching it; laws that hold, laws that break
 *   way-powers-of-ten  a zoom from nuclei to the observable universe, with the force that rules each scale
 *   way-energy-ladder  k_BT against the energies of chemistry, biology and the stars; waiting times e^(E/kT)/ν
 *   way-orbits         one law, many consequences: equal areas for any central force, closed ellipses only for 1/r²
 *   way-three-ways     one orbit computed three ways: force at a distance, local field, least action
 *   way-guess-compare  guess a pendulum law, compute, compare with noisy data; throw out the wrong guesses
 *   way-how-sure       degrees of belief narrowing with evidence (Bayes); a mind with no doubt never learns
 *   way-wagon-ball     the ball in the wagon, seen from the ground and from the wagon
 *   way-fool-yourself  honest protocol against stopping when it looks good and reporting the best of many tries
 *   way-creep          how a wrong value creeps when results that disagree are checked harder than those that agree
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fin = (v, d) => Number.isFinite(v) ? v : (d || 0);
  const sup = n => String(n).replace(/-/g, '⁻').replace(/[0-9]/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
  // a number as "3.2 × 10⁻⁹" (or plain when moderate)
  function sci(v, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e-3 && a < 1e5) return String(+v.toPrecision(sig || 3));
    const e = Math.floor(Math.log10(a)), m = v / Math.pow(10, e);
    return (+m.toPrecision(sig || 2)) + ' × 10' + sup(e);
  }
  // a length in a sensible unit
  function fmtLen(m) {
    const a = Math.abs(m);
    if (!Number.isFinite(a) || a === 0) return '0 m';
    const U = [[9.4607e15, 'ly'], [1.495978707e11, 'AU'], [1e3, 'km'], [1, 'm'], [1e-3, 'mm'], [1e-6, 'µm'], [1e-9, 'nm'], [1e-12, 'pm'], [1e-15, 'fm']];
    for (const [f, u] of U) if (a >= f * 0.999 || u === 'fm') {
      const v = m / f;
      return (Math.abs(v) >= 1e5 ? sci(v, 2) : String(+v.toPrecision(Math.abs(v) >= 100 ? 3 : 2))) + ' ' + u;
    }
    return m + ' m';
  }

  /* ================================================================ a drop of water, magnified */
  Hyper.sim('way-water-drop', {
    title: 'A drop of water, magnified',
    blurb: `A tiny patch of a drop, with each ball one molecule, magnified tens of millions of times. The molecules move by Newton's laws with a force that pulls when they are a little apart and pushes hard when they are squeezed (the Lennard-Jones law, drawn under the picture). Colour shows speed — blue slow, orange fast. The *heat bath* holds the temperature, measured as $k_BT$ in units of the depth ε of the attraction.

**Try this**
- Start as *Ice*: the molecules sit in a hexagonal pattern, six neighbours each inside the crystal, vibrating in place — they hardly wander. Warm the bath slowly: around 0.35 the crystal melts, and the molecules start to wander while still touching. Above about 0.5 more and more evaporate, and at 1.3 it is a gas.
- Open the lid and switch the heat bath off. The fastest molecules escape; watch the measured temperature of those left behind fall — evaporation cools.
- Lower the piston on a gas: the push on it grows as the molecules hit it more often.
- Drag a molecule out of the drop: its neighbours cling to it (attraction). Push it into the crowd: they shove back (repulsion). The arrow is the net force on it.
- Press *Quench*: sudden cold freezes the liquid into a disordered solid, a glass.`,
    mount(box, kit, params) {
      const Q = kit.qm;
      const BW = 32, BH = 20, NMAX = 110, RC2 = 9, DT = 0.005, SUB = 10, G0 = 0.03;
      const PRESET = { solid: 0.12, liquid: 0.4, gas: 1.3 };
      let R = Q.rng(1961), seedBump = 0;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Start as', options: [['Ice: a crystal', 'solid'], ['Water: a liquid drop', 'liquid'], ['Steam: a gas', 'gas']], value: (params && params.preset) || 'liquid' },
        { id: 'T', label: 'Heat bath temperature (kT in units of ε)', min: 0.05, max: 2, step: 0.01, value: 0.45 },
        { id: 'bath', type: 'check', label: 'Heat bath on (holds the temperature)', value: true },
        { id: 'lid', type: 'check', label: 'Open the lid: molecules can escape', value: false },
        { id: 'top', label: 'Piston height (squeeze the box)', min: 6, max: 20, step: 0.1, value: 20, unit: 'σ' },
        { id: 'grav', type: 'check', label: 'Gravity (the liquid settles)', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }, { id: 'quench', label: 'Quench (sudden cold)' }] }
      ], (id, v) => {
        if (id === 'preset') { ctl.set('T', PRESET[v] || 0.45); init(); }
        else if (id === 'reset') init();
        else if (id === 'quench') { ctl.set('T', 0.08); for (let i = 0; i < n; i++) { vx[i] *= 0.3; vy[i] *= 0.3; } }
      });
      const V = ctl.values;
      ctl.set('T', PRESET[V.preset] || 0.45);
      const ro = kit.readout(box.side, [['n', 'Molecules in the box'], ['T', 'Temperature kT/ε (measured)'], ['nb', 'Neighbours per molecule'], ['msd', 'How far they wander in 4 time units (mean square)'], ['P', 'Push on the piston (per unit length)'], ['esc', 'Escaped through the lid'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'distance between two molecules, r/σ', min: 0.8, max: 3 }, y: { label: 'U/ε, and pairs found (scaled)', min: -1.2, max: 1.6 }, legend: true }, 165);
      const upts = []; for (let r = 0.96; r <= 3.0001; r += 0.01) { const i6 = Math.pow(r, -6); upts.push([r, 4 * (i6 * i6 - i6)]); }

      const x = new Float64Array(NMAX), y = new Float64Array(NMAX), vx = new Float64Array(NMAX), vy = new Float64Array(NMAX), ax = new Float64Array(NMAX), ay = new Float64Array(NMAX);
      let n = 0, held = -1, pist = BH, esc = 0, imp = 0, Psm = 0, Tcur = 0, Tsm = 0, nbSum = 0, t = 0, lastHist = -1;
      let sc = 10, ox = 0, oy = 0;
      // mobility: mean square distance moved over a window of 4 time units (a crystal's molecules stay put)
      const refX = new Float64Array(NMAX), refY = new Float64Array(NMAX);
      let simT = 0, refT = 0, refOK = false, msd = -1;
      function mobility() {
        if (simT - refT < 4) return;
        if (refOK && n > 0) { let s = 0; for (let i = 0; i < n; i++) s += (x[i] - refX[i]) ** 2 + (y[i] - refY[i]) ** 2; msd = s / n; }
        refX.set(x); refY.set(y); refT = simT; refOK = true;
      }
      function forces(g) {
        ax.fill(0); ay.fill(0); let nb = 0;
        for (let i = 0; i < n; i++) {
          const xi = x[i], yi = y[i];
          for (let j = i + 1; j < n; j++) {
            const dx = xi - x[j], dy = yi - y[j];
            let r2 = dx * dx + dy * dy;
            if (r2 > RC2) continue;
            if (r2 < 2.25) nb += 2;
            if (r2 < 0.6) r2 = 0.6;                         // cap the force when two are pushed right together
            const ir2 = 1 / r2, ir6 = ir2 * ir2 * ir2, f = 24 * ir6 * (2 * ir6 - 1) * ir2;
            ax[i] += f * dx; ay[i] += f * dy; ax[j] -= f * dx; ay[j] -= f * dy;
          }
          ay[i] -= g;
        }
        nbSum = nb;
      }
      function remove(i) {
        const k = n - 1;
        x[i] = x[k]; y[i] = y[k]; vx[i] = vx[k]; vy[i] = vy[k]; ax[i] = ax[k]; ay[i] = ay[k];
        if (held === k) held = i; else if (held === i) held = -1;
        n--; refOK = false;
      }
      function init() {
        R = Q.rng(1961 + (seedBump++));
        ctl.set('top', BH); pist = BH;
        n = NMAX; esc = 0; held = -1; Psm = 0; imp = 0;
        const T0 = V.T;
        if (V.preset === 'gas') {
          let k = 0;
          for (let r = 0; r < 10; r++) for (let c = 0; c < 11 && k < n; c++, k++) { x[k] = (c + 0.5) * BW / 11; y[k] = 1 + r * 1.9; }
        } else {
          const a = 1.12, h = a * Math.sqrt(3) / 2, x0 = BW / 2 - 5.25 * a;
          let k = 0;
          for (let r = 0; k < n; r++) for (let c = 0; c < 11 && k < n; c++, k++) { x[k] = x0 + (c + (r % 2) * 0.5) * a; y[k] = 0.62 + r * h; }
        }
        let sx = 0, sy = 0;
        for (let i = 0; i < n; i++) { vx[i] = Math.sqrt(T0) * Q.gauss(R); vy[i] = Math.sqrt(T0) * Q.gauss(R); sx += vx[i]; sy += vy[i]; }
        for (let i = 0; i < n; i++) { vx[i] -= sx / n; vy[i] -= sy / n; }
        Tsm = T0; refOK = false; refT = simT; msd = -1;
        forces(V.grav ? G0 : 0);
      }
      function step(dt) {
        const lid = V.lid, g = V.grav ? G0 : 0;
        const target = lid ? BH : V.top;
        pist += clamp(target - pist, -2 * dt, 2 * dt);
        for (let i = 0; i < n; i++) {
          if (i === held) { vx[i] = 0; vy[i] = 0; continue; }
          vx[i] += 0.5 * dt * ax[i]; vy[i] += 0.5 * dt * ay[i];
          x[i] += dt * vx[i]; y[i] += dt * vy[i];
          if (x[i] < 0.5) { x[i] = 1 - x[i]; vx[i] = Math.abs(vx[i]); }
          if (x[i] > BW - 0.5) { x[i] = 2 * (BW - 0.5) - x[i]; vx[i] = -Math.abs(vx[i]); }
          if (y[i] < 0.5) { y[i] = 1 - y[i]; vy[i] = Math.abs(vy[i]); }
          if (!lid && y[i] > pist - 0.5) { y[i] = 2 * (pist - 0.5) - y[i]; if (vy[i] > 0) { imp += 2 * vy[i]; vy[i] = -vy[i]; } }
          x[i] = clamp(x[i], 0.5, BW - 0.5);
          if (y[i] < 0.5) y[i] = 0.5;
          if (!lid && y[i] > pist - 0.5) y[i] = pist - 0.5;
        }
        if (lid) for (let i = n - 1; i >= 0; i--) if (y[i] > BH + 1 && i !== held) { remove(i); esc++; }
        forces(g);
        let ke = 0, cnt = 0;
        for (let i = 0; i < n; i++) {
          if (i === held) continue;
          vx[i] += 0.5 * dt * ax[i]; vy[i] += 0.5 * dt * ay[i];
          const s2 = vx[i] * vx[i] + vy[i] * vy[i];
          if (s2 > 100) { const f = 10 / Math.sqrt(s2); vx[i] *= f; vy[i] *= f; }
          ke += 0.5 * (vx[i] * vx[i] + vy[i] * vy[i]); cnt++;
        }
        Tcur = cnt ? ke / cnt : 0;                           // two dimensions: ⟨½mv²⟩ = kT
        if (V.bath && Tcur > 1e-9) {
          const lam = Math.sqrt(clamp(1 + dt / 0.4 * (V.T / Tcur - 1), 0.8, 1.25));
          for (let i = 0; i < n; i++) if (i !== held) { vx[i] *= lam; vy[i] *= lam; }
        }
      }
      function pairPlot() {
        const bins = new Float64Array(44);
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const r = Math.hypot(x[i] - x[j], y[i] - y[j]);
          if (r >= 0.8 && r < 3) bins[Math.min(43, Math.floor((r - 0.8) / 0.05))] += 1 / r;
        }
        let mx = 0; for (const b of bins) mx = Math.max(mx, b);
        const hp = Array.from(bins, (b, i) => [0.825 + 0.05 * i, mx > 0 ? 1.4 * b / mx : 0]);
        plot.set({ series: [{ pts: upts, label: 'energy of a pair U(r)/ε', width: 2.2 }, { pts: hp, label: 'pairs found at that distance (scaled)', width: 1.4, dash: [3, 3] }],
          hlines: [{ y: 0 }], vlines: [{ x: 1.122, label: 'preferred distance 1.12σ' }] });
      }
      const toModel = p => ({ x: (p.x - ox) / sc, y: BH - (p.y - oy) / sc });
      kit.drag(st, {
        hover: true,
        hit(p) {
          const m = toModel(p); let best = -1, bd = 0.9;
          for (let i = 0; i < n; i++) { const d = Math.hypot(x[i] - m.x, y[i] - m.y); if (d < bd) { bd = d; best = i; } }
          return best >= 0 ? best : null;
        },
        start(i) { held = i; },
        move(i, p) {
          if (held < 0) return;
          const m = toModel(p);
          x[held] = clamp(m.x, 0.5, BW - 0.5); y[held] = clamp(m.y, 0.5, (V.lid ? BH + 0.5 : pist - 0.5));
          vx[held] = 0; vy[held] = 0;
          if (!loop.running) loop.once();
        },
        end() { held = -1; }
      });
      init();
      pairPlot();
      const loop = kit.loop(dt => {
        if (dt > 0) { for (let k = 0; k < SUB; k++) step(DT); t += dt; simT += SUB * DT; mobility(); }
        const Pinst = dt > 0 ? imp / (SUB * DT) / BW : Psm; imp = 0;
        if (dt > 0) { Psm += (Pinst - Psm) * Math.min(1, dt * 1.5); Tsm += (Tcur - Tsm) * Math.min(1, dt * 3); }
        const nbAvg = n ? nbSum / n : 0;
        ro.set('n', String(n));
        ro.set('T', fin(Tsm).toFixed(2));
        ro.set('nb', nbAvg.toFixed(1));
        ro.set('msd', msd < 0 ? 'measuring…' : (msd < 10 ? msd.toFixed(2) : msd.toFixed(0)) + ' σ²');
        ro.set('P', V.lid ? '— (lid open)' : fin(Psm).toFixed(3) + ' ε/σ²');
        ro.set('esc', String(esc));
        ro.set('msg', n === 0 ? 'All the molecules have evaporated.'
          : nbAvg > 4.2 && msd >= 0 && msd < 0.3 ? 'A crystal: molecules vibrate in fixed places.'
          : nbAvg > 3.3 ? 'A liquid: molecules touch but wander past each other.'
          : nbAvg > 1.2 ? 'Liquid and vapour: some molecules have evaporated.' : 'A gas: far apart, flying free.');
        if (Math.floor(t / 0.35) !== lastHist) { lastHist = Math.floor(t / 0.35); pairPlot(); }
        // drawing
        const c = st.begin(), C = kit.colors();
        sc = Math.max(2, Math.min((st.W - 24) / BW, (st.H - 34) / BH)); ox = (st.W - BW * sc) / 2; oy = 26;
        const X = v => ox + v * sc, Y = v => oy + (BH - v) * sc;
        c.fillStyle = C.surface || C.bg; c.fillRect(X(0), Y(BH), BW * sc, BH * sc);
        c.strokeStyle = C.text; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(X(0), Y(BH)); c.lineTo(X(0), Y(0)); c.lineTo(X(BW), Y(0)); c.lineTo(X(BW), Y(BH)); c.stroke();
        if (V.lid) {
          c.save(); c.setLineDash([6, 5]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(0), Y(BH)); c.lineTo(X(BW), Y(BH)); c.stroke(); c.restore();
          kit.label(c, 'open: molecules that fly out are gone', X(BW) - 4, Y(BH) - 9, { size: 11, color: C.muted, align: 'right' });
        } else {
          c.fillStyle = C.muted; c.globalAlpha = 0.35; c.fillRect(X(0), Y(BH), BW * sc, (BH - pist) * sc); c.globalAlpha = 1;
          c.fillStyle = C.text; c.fillRect(X(0), Y(pist) - 3, BW * sc, 4);
          kit.label(c, 'piston', X(BW) - 6, Y(pist) - 10, { size: 11, color: C.muted, align: 'right' });
        }
        const rad = Math.max(1.5, 0.54 * sc);
        for (let i = 0; i < n; i++) {
          const sp = Math.hypot(vx[i], vy[i]), hue = 220 - 195 * clamp(sp / 2.6, 0, 1);
          c.fillStyle = 'hsl(' + hue.toFixed(0) + ' 75% 55%)';
          c.beginPath(); c.arc(X(x[i]), Y(y[i]), rad, 0, TAU); c.fill();
        }
        if (held >= 0 && held < n) {
          const hx = X(x[held]), hy = Y(y[held]);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(hx, hy, rad + 3, 0, TAU); c.stroke();
          const fx = ax[held], fy = ay[held] + (V.grav ? G0 : 0), F = Math.hypot(fx, fy);
          if (F > 0.05) {
            const L = clamp(12 + 14 * Math.log10(1 + F), 12, 80);
            kit.arrow(c, hx, hy, hx + L * fx / F, hy - L * fy / F, C.warn, 2.4);
            kit.label(c, F > 20 ? 'pushed away: repulsion' : 'force from its neighbours', hx + 10, hy - rad - 14, { size: 11.5, color: C.warn, bg: C.bg2 });
          }
        }
        // legend
        kit.label(c, 'one ball = one molecule (about 0.3 nm)   colour = speed:', ox, 12, { size: 11, color: C.muted });
        const lx = ox + Math.min(310, st.W * 0.55);
        for (let k = 0; k < 6; k++) { c.fillStyle = 'hsl(' + (220 - 39 * k) + ' 75% 55%)'; c.beginPath(); c.arc(lx + 12 * k, 12, 4.5, 0, TAU); c.fill(); }
        kit.label(c, 'slow → fast', lx + 78, 12, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ learning the rules of a game by watching */
  const LAW_TEXT = [
    '● always moves along a diagonal',
    '● always stays on squares of one colour',
    'The number of ● never changes',
    'The number of ● on dark squares never changes',
    '■ moves one square, straight',
    'No piece ever passes over another',
    '▲ always lands on the other colour',
    'Pieces never change their shape'
  ];
  Hyper.sim('way-rules-game', {
    title: 'Learning the rules by watching',
    blurb: `A game of our own invention, played on a chessboard by rules you are not told: circles ●, squares ■ and triangles ▲ move one at a time. Your notebook lists laws a careful watcher might write down. Each move tests them; a law that fails is crossed out with the move that broke it.

**Try this**
- Watch at a slow speed and guess the rules yourself before looking at the notebook. Which laws are about *how* a piece moves, and which say that something *never changes*?
- Speed up. Some laws fall quickly; others survive hundreds of moves. Does surviving a long time prove a law?
- Wait for the rare event. When it comes, look at which laws it breaks and which survive — "the number of ● on dark squares" may or may not fall, depending on where it happens, but every ● still keeps its colour. The deeper law survives.
- Tick *Reveal the rulebook* to check your guesses. Did you find all the rules, or only their consequences?`,
    mount(box, kit) {
      const Q = kit.qm;
      let seed = 11, R = Q.rng(seed);
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 290 });
      let playing = true, queue = 0, acc = 0;
      const ctl = kit.controls(box.side, [
        { id: 'speed', label: 'Moves per second', min: 0.5, max: 30, value: 3, log: true, sig: 2 },
        { id: 'reveal', type: 'check', label: 'Reveal the hidden rulebook', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Watch / pause', primary: true }, { id: 'one', label: 'One move' }, { id: 'new', label: 'New game' }] }
      ], id => {
        if (id === 'play') playing = !playing;
        else if (id === 'one') { playing = false; queue = 1; }
        else if (id === 'new') newGame();
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['moves', 'Moves watched'], ['laws', 'Laws still standing'], ['last', 'Latest surprise']]);
      let pieces = [], moveNo = 0, laws = [], anim = null, surprise = '—';
      const inb = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
      const occ = (r, c) => pieces.some(q => q.r === r && q.c === c);
      const dark = (r, c) => (r + c) % 2 === 1;
      function place(kind, r0, r1) {
        for (let k = 0; k < 200; k++) {
          const r = r0 + Math.floor(R() * (r1 - r0 + 1)), c = Math.floor(R() * 8);
          if (!occ(r, c)) { pieces.push({ kind, r, c }); return; }
        }
      }
      function newGame() {
        seed++; R = Q.rng(seed);
        pieces = []; moveNo = 0; anim = null; surprise = '—'; acc = 0;
        for (let i = 0; i < 3; i++) place('R', 2, 5);
        for (let i = 0; i < 4; i++) place('S', 5, 7);
        for (let i = 0; i < 2; i++) place('L', 3, 6);
        laws = LAW_TEXT.map(text => ({ text, tests: 0, broken: 0, why: '' }));
      }
      function moves(p) {
        const out = [];
        if (p.kind === 'R') {
          for (const [dr, dc] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) for (let k = 1; k < 8; k++) { const r = p.r + dr * k, c = p.c + dc * k; if (!inb(r, c) || occ(r, c)) break; out.push({ r, c }); }
        } else if (p.kind === 'S') {
          for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const r = p.r + dr, c = p.c + dc; if (inb(r, c) && !occ(r, c)) out.push({ r, c }); }
        } else {
          for (const [dr, dc] of [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]) { const r = p.r + dr, c = p.c + dc; if (inb(r, c) && !occ(r, c)) out.push({ r, c }); }
        }
        return out;
      }
      function passesOver(from, to) {
        for (const f of [0.25, 0.5, 0.75]) {
          const r = Math.round(from.r + (to.r - from.r) * f), c = Math.round(from.c + (to.c - from.c) * f);
          if ((r !== from.r || c !== from.c) && (r !== to.r || c !== to.c) && occ(r, c)) return true;
        }
        return false;
      }
      const counts = () => ({ nR: pieces.filter(p => p.kind === 'R').length, nRd: pieces.filter(p => p.kind === 'R' && dark(p.r, p.c)).length });
      const NAME = { R: '●', S: '■', L: '▲' };
      function doMove() {
        const movable = pieces.filter(p => moves(p).length);
        if (!movable.length) return;
        const p = movable[Math.floor(R() * movable.length)], ms = moves(p), m = ms[Math.floor(R() * ms.length)];
        const before = counts(), kind = p.kind, from = { r: p.r, c: p.c }, over = kind === 'L' && passesOver(from, m);
        p.r = m.r; p.c = m.c;
        let promoted = false;
        if (p.kind === 'S' && p.r === 0) { p.kind = 'R'; promoted = true; }
        moveNo++;
        const after = counts(), dr = m.r - from.r, dc = m.c - from.c;
        const ev = [
          kind === 'R' ? Math.abs(dr) === Math.abs(dc) : null,
          kind === 'R' ? dark(from.r, from.c) === dark(m.r, m.c) : null,
          after.nR === before.nR,
          after.nRd === before.nRd,
          kind === 'S' ? Math.abs(dr) + Math.abs(dc) === 1 : null,
          !over,
          kind === 'L' ? dark(from.r, from.c) !== dark(m.r, m.c) : null,
          !promoted
        ];
        const whyOf = () => promoted ? 'a ■ reached the top row and became a ●' + (dark(m.r, m.c) ? ' (on a dark square)' : ' (on a light square)') : over ? 'a ▲ jumped over a piece' : 'an unexpected move';
        ev.forEach((ok, i) => {
          const L = laws[i];
          if (ok === null || L.broken) return;
          L.tests++;
          if (!ok) { L.broken = moveNo; L.why = whyOf(); surprise = 'move ' + moveNo + ': ' + L.why; }
        });
        anim = { p, from, to: m, t: 0, kind, promoted };
      }
      newGame();
      const loop = kit.loop(dt => {
        if (playing && dt > 0) { acc += dt * V.speed; let k = 0; while (acc >= 1 && k < 6) { doMove(); acc -= 1; k++; } if (acc > 3) acc = 0; }
        if (queue) { doMove(); queue = 0; }
        if (anim && dt > 0) anim.t = Math.min(1, anim.t + dt / Math.min(0.45, 0.8 / V.speed));
        const standing = laws.filter(L => !L.broken).length;
        ro.set('moves', String(moveNo)); ro.set('laws', standing + ' of ' + laws.length); ro.set('last', surprise);
        // drawing
        const c = st.begin(), C = kit.colors();
        const B = Math.max(120, Math.min(st.H - 28, st.W * 0.5)), cell = B / 8, bx = 10, by = (st.H - B) / 2;
        for (let r = 0; r < 8; r++) for (let cc = 0; cc < 8; cc++) {
          c.fillStyle = C.surface || C.bg; c.fillRect(bx + cc * cell, by + r * cell, cell, cell);
          if (dark(r, cc)) { c.globalAlpha = 0.32; c.fillStyle = C.muted; c.fillRect(bx + cc * cell, by + r * cell, cell, cell); c.globalAlpha = 1; }
        }
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx, by, B, B);
        kit.label(c, 'top row', bx + B / 2, by - 8, { size: 10.5, color: C.muted, align: 'center' });
        const cx = (r, cc) => [bx + (cc + 0.5) * cell, by + (r + 0.5) * cell];
        if (anim) {
          const [x0, y0] = cx(anim.from.r, anim.from.c), [x1, y1] = cx(anim.to.r, anim.to.c);
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore();
        }
        const COL = { R: C.series[0], S: C.series[1], L: C.series[2] };
        const drawPiece = (kind, px, py) => {
          c.fillStyle = COL[kind]; c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath();
          if (kind === 'R') c.arc(px, py, cell * 0.32, 0, TAU);
          else if (kind === 'S') c.rect(px - cell * 0.28, py - cell * 0.28, cell * 0.56, cell * 0.56);
          else { c.moveTo(px, py - cell * 0.32); c.lineTo(px + cell * 0.31, py + cell * 0.25); c.lineTo(px - cell * 0.31, py + cell * 0.25); c.closePath(); }
          c.fill(); c.stroke();
        };
        for (const p of pieces) {
          if (anim && p === anim.p && anim.t < 1) {
            const [x0, y0] = cx(anim.from.r, anim.from.c), [x1, y1] = cx(anim.to.r, anim.to.c), f = anim.t;
            const lift = anim.kind === 'L' ? Math.sin(Math.PI * f) * cell * 0.6 : 0;
            drawPiece(anim.kind, x0 + (x1 - x0) * f, y0 + (y1 - y0) * f - lift);
          } else {
            const [px, py] = cx(p.r, p.c);
            drawPiece(p.kind, px, py);
          }
        }
        if (anim && anim.promoted) {
          const [px, py] = cx(anim.to.r, anim.to.c);
          c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.arc(px, py, cell * (0.45 + 0.25 * (1 - anim.t)), 0, TAU); c.stroke();
        }
        // the notebook
        const nx = bx + B + 18, nw = st.W - nx - 8, fs = clamp(st.W / 64, 9.5, 12.5);
        let yy = by + 6;
        kit.label(c, V.reveal ? 'The hidden rulebook' : 'Your notebook: laws guessed from watching', nx, yy, { size: fs + 0.5, weight: 700 });
        yy += fs * 1.9;
        if (V.reveal) {
          for (const s of ['● slides any distance diagonally, never over a piece', '■ steps one square up, down, left or right', '▲ jumps in an L (two one way, one across); it may jump over pieces', 'Rare: a ■ reaching the top row turns into a ●']) {
            kit.label(c, s, nx, yy, { size: fs, color: C.accent }); yy += fs * 1.55;
          }
          yy += fs * 0.5;
        }
        const lh = V.reveal ? fs * 1.45 : Math.min(fs * 2.9, (by + B - yy) / laws.length);
        laws.forEach(L => {
          kit.label(c, L.broken ? '✗' : '✓', nx, yy, { size: fs + 1, weight: 700, color: L.broken ? C.bad : C.ok });
          kit.label(c, L.text, nx + fs * 1.4, yy, { size: fs, color: L.broken ? C.muted : C.text });
          if (L.broken) { c.strokeStyle = C.bad; c.lineWidth = 1.2; c.beginPath(); c.moveTo(nx + fs * 1.4, yy); c.lineTo(Math.min(nx + nw, nx + fs * 1.4 + L.text.length * fs * 0.52), yy); c.stroke(); }
          if (!V.reveal) kit.label(c, L.broken ? 'broken at move ' + L.broken + ': ' + L.why : L.tests ? 'held in ' + L.tests + ' tests so far' : 'not tested yet', nx + fs * 1.4, yy + fs * 1.15, { size: fs - 1.5, color: L.broken ? C.bad : C.muted });
          yy += lh;
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ powers of ten */
  // [size in metres (the diameter drawn), name, pictogram]
  const SCALES = [
    [1.7e-15, 'a proton', 'proton'], [1.5e-14, 'a uranium nucleus', 'nucleus'], [1.06e-10, 'a hydrogen atom', 'atom'],
    [2.8e-10, 'a water molecule', 'water'], [2e-9, 'the width of DNA', 'dna'], [1e-7, 'a flu virus', 'virus'],
    [2e-6, 'a bacterium', 'bacterium'], [8e-6, 'a red blood cell', 'cell'], [8e-5, 'the width of a hair', 'hair'],
    [5e-3, 'an ant', 'ant'], [1.7, 'a person', 'person'], [300, 'a skyscraper', 'tower'], [8.8e3, 'Mount Everest (height)', 'mountain'],
    [1.27e7, 'the Earth', 'earth'], [7.69e8, 'the Moon\'s orbit', 'orbit'], [1.39e9, 'the Sun', 'sun'], [3.0e11, 'the Earth\'s orbit', 'orbit'],
    [9.0e12, 'Neptune\'s orbit', 'orbit'], [8.0e16, 'the nearest stars (4.2 light-years away)', 'stars'], [1.0e21, 'the Milky Way', 'galaxy'],
    [9e22, 'the Local Group of galaxies', 'group'], [8.8e26, 'the observable universe', 'universe']
  ];
  const BANDS = [
    [-16, -14, 'nuclear forces', 330, 'the strong and weak nuclear forces, with quantum mechanics and relativity'],
    [-14, -8, 'atoms', 205, 'the electric force, with quantum mechanics: atoms, molecules, chemical bonds'],
    [-8, 5, 'matter in bulk', 140, 'the electric force in bulk: chemistry, materials, life — classical physics usually enough'],
    [5, 22, 'gravity', 35, 'gravity: charges cancel, mass adds up — moons, planets, stars, galaxies'],
    [22, 28, 'cosmos', 270, 'gravity and the expansion of the universe (general relativity)']
  ];
  Hyper.sim('way-powers-of-ten', {
    title: 'Powers of ten: from a proton to the universe',
    blurb: `A zoom through 42 [[?scientific-notation|powers of ten]]. Each circle is the size of something real, drawn to scale at the width of view you choose; the thing that fills the view is pictured. The ruler below shows where you are and which force rules there.

**Try this**
- Press *Zoom out* from a proton and watch the rulers change hands: nuclear forces, then the electric force in atoms, then the same electric force holding up cells, people and mountains, then gravity from about a hundred kilometres upwards.
- Stop at the Earth and at the atom: the atom is about as many powers of ten below you as the Earth is above.
- How many powers of ten from a hair to the Earth? From a proton to a person? (Count them on the ruler, or use the formula on the page.)`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280 });
      let dir = 0;
      const start = params && Number.isFinite(params.start) ? params.start : 0.3;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Width of view: power of ten (metres)', min: -15.5, max: 27.5, step: 0.01, value: start },
        { id: 'speed', label: 'Zoom speed (powers of ten per second)', min: 0.2, max: 4, step: 0.1, value: 1 },
        { type: 'buttons', items: [{ id: 'out', label: 'Zoom out', primary: true }, { id: 'in', label: 'Zoom in' }, { id: 'stop', label: 'Stop' }] }
      ], id => { if (id === 'out') dir = 1; else if (id === 'in') dir = -1; else if (id === 'stop' || id === 'z') dir = id === 'z' ? dir : 0; if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'Width of view'], ['p', 'Power of ten'], ['main', 'Filling the view'], ['force', 'What rules at this scale']]);
      function picto(c, kind, x, y, r, C) {
        c.save();
        const circle = (px, py, rr, col) => { c.fillStyle = col; c.beginPath(); c.arc(px, py, Math.max(0.5, rr), 0, TAU); c.fill(); };
        if (kind === 'proton') { circle(x, y, r, 'hsl(0 60% 60% / .25)'); [[0, -0.4, 0], [-0.38, 0.25, 120], [0.38, 0.25, 240]].forEach(([dx, dy, h]) => circle(x + dx * r, y + dy * r, r * 0.18, 'hsl(' + h + ' 80% 55%)')); }
        else if (kind === 'nucleus') { for (let i = 0; i < 40; i++) { const a = i * 2.39996, rr = r * 0.85 * Math.sqrt((i + 0.5) / 40); circle(x + rr * Math.cos(a), y + rr * Math.sin(a), r * 0.16, i % 2 ? 'hsl(0 70% 55%)' : 'hsl(220 10% 60%)'); } }
        else if (kind === 'atom') { for (let k = 6; k >= 1; k--) circle(x, y, r * k / 6, 'hsl(205 80% 60% / ' + (0.08 + 0.02 * (6 - k)) + ')'); circle(x, y, Math.max(1.5, r * 0.03), C.bad); }
        else if (kind === 'water') { circle(x, y, r * 0.55, 'hsl(0 75% 55%)'); const a = 52.25 * Math.PI / 180; circle(x - r * 0.55 * Math.sin(a), y + r * 0.55 * Math.cos(a), r * 0.33, C.surface2 || '#ddd'); circle(x + r * 0.55 * Math.sin(a), y + r * 0.55 * Math.cos(a), r * 0.33, C.surface2 || '#ddd'); }
        else if (kind === 'dna') { c.lineWidth = Math.max(1, r * 0.12); for (const ph of [0, Math.PI]) { c.strokeStyle = ph ? C.series[1] : C.series[0]; c.beginPath(); for (let k = 0; k <= 40; k++) { const yy = y - 3 * r + 6 * r * k / 40, xx = x + r * Math.sin(k / 40 * 4 * Math.PI + ph); k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); } }
        else if (kind === 'virus') { c.strokeStyle = C.series[3]; c.lineWidth = Math.max(1, r * 0.06); for (let k = 0; k < 16; k++) { const a = k * TAU / 16; c.beginPath(); c.moveTo(x + r * 0.8 * Math.cos(a), y + r * 0.8 * Math.sin(a)); c.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); c.stroke(); } circle(x, y, r * 0.8, 'hsl(330 60% 55% / .6)'); }
        else if (kind === 'bacterium') { c.fillStyle = 'hsl(140 50% 50% / .7)'; c.beginPath(); c.ellipse(x, y, r, r * 0.35, 0.3, 0, TAU); c.fill(); }
        else if (kind === 'cell') { circle(x, y, r, 'hsl(0 70% 50%)'); circle(x, y, r * 0.45, 'hsl(0 70% 62%)'); }
        else if (kind === 'hair') { c.fillStyle = 'hsl(30 40% 35%)'; c.fillRect(x - r, y - 3 * r, 2 * r, 6 * r); }
        else if (kind === 'ant') { c.fillStyle = C.text; [[-0.6, 0.3], [0, 0.22], [0.55, 0.28]].forEach(([dx, rr]) => { c.beginPath(); c.ellipse(x + dx * r, y, rr * r, rr * r * 0.75, 0, 0, TAU); c.fill(); }); c.strokeStyle = C.text; c.lineWidth = Math.max(1, r * 0.04); for (const s of [-1, 0, 1]) { c.beginPath(); c.moveTo(x + s * 0.2 * r, y); c.lineTo(x + s * 0.35 * r, y + 0.6 * r); c.moveTo(x + s * 0.2 * r, y); c.lineTo(x + s * 0.35 * r, y - 0.6 * r); c.stroke(); } }
        else if (kind === 'person') { c.strokeStyle = C.text; c.lineWidth = Math.max(1.5, r * 0.06); c.beginPath(); c.arc(x, y - 0.78 * r, 0.16 * r, 0, TAU); c.moveTo(x, y - 0.62 * r); c.lineTo(x, y + 0.2 * r); c.lineTo(x - 0.25 * r, y + r); c.moveTo(x, y + 0.2 * r); c.lineTo(x + 0.25 * r, y + r); c.moveTo(x - 0.35 * r, y - 0.3 * r); c.lineTo(x + 0.35 * r, y - 0.3 * r); c.stroke(); }
        else if (kind === 'tower') { c.fillStyle = C.muted; c.fillRect(x - 0.18 * r, y - r, 0.36 * r, 2 * r); c.fillStyle = C.surface || '#fff'; for (let k = 0; k < 12; k++) c.fillRect(x - 0.12 * r, y - r + (k + 0.3) * r / 6.2, 0.24 * r, r / 20); }
        else if (kind === 'mountain') { c.fillStyle = 'hsl(30 20% 45%)'; c.beginPath(); c.moveTo(x - 1.6 * r, y + r); c.lineTo(x, y - r); c.lineTo(x + 1.6 * r, y + r); c.closePath(); c.fill(); c.fillStyle = '#f4f7fb'; c.beginPath(); c.moveTo(x - 0.4 * r, y - 0.5 * r); c.lineTo(x, y - r); c.lineTo(x + 0.4 * r, y - 0.5 * r); c.closePath(); c.fill(); }
        else if (kind === 'earth') { circle(x, y, r, 'hsl(210 70% 45%)'); circle(x - 0.3 * r, y - 0.2 * r, 0.35 * r, 'hsl(120 40% 40%)'); circle(x + 0.35 * r, y + 0.3 * r, 0.25 * r, 'hsl(120 40% 40%)'); }
        else if (kind === 'sun') { circle(x, y, r * 1.15, 'hsl(45 100% 60% / .25)'); circle(x, y, r, 'hsl(45 100% 55%)'); }
        else if (kind === 'orbit') { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); c.setLineDash([]); circle(x, y, 4, 'hsl(45 100% 55%)'); circle(x + r * 0.7071, y - r * 0.7071, 3.5, C.accent); }
        else if (kind === 'stars') { circle(x, y, 3, 'hsl(45 100% 55%)'); for (let k = 0; k < 14; k++) { const a = k * 2.39996, rr = r * (0.55 + 0.45 * ((k * 0.618) % 1)); circle(x + rr * Math.cos(a), y + rr * Math.sin(a), 2.2, C.text); } }
        else if (kind === 'galaxy') { for (let k = 0; k < 420; k++) { const arm = k % 2, tt = (k >> 1) / 210, a = arm * Math.PI + tt * 7, rr = r * (0.08 + 0.92 * tt); circle(x + rr * Math.cos(a) + ((k * 37) % 7 - 3) * r * 0.012, y + 0.55 * rr * Math.sin(a) + ((k * 53) % 7 - 3) * r * 0.012, 1.1, 'hsl(' + (45 + 170 * tt) + ' 70% 70%)'); } circle(x, y, r * 0.09, 'hsl(45 90% 75%)'); }
        else if (kind === 'group') { [[0, 0, 0.25], [-0.55, 0.2, 0.3], [0.5, -0.3, 0.12], [0.2, 0.6, 0.08]].forEach(([dx, dy, s]) => { c.fillStyle = 'hsl(220 60% 75% / .55)'; c.beginPath(); c.ellipse(x + dx * r, y + dy * r, s * r, s * r * 0.45, dx, 0, TAU); c.fill(); }); }
        else if (kind === 'universe') { for (let k = 0; k < 500; k++) { const a = k * 2.39996, rr = r * Math.sqrt(((k * 0.7548776) % 1)); circle(x + rr * Math.cos(a), y + rr * Math.sin(a), 1, 'hsl(' + (200 + (k % 5) * 20) + ' 60% 70%)'); } }
        c.restore();
      }
      const loop = kit.loop(dt => {
        if (dir && dt > 0) {
          let z = V.z + dir * V.speed * dt;
          if (z >= 27.5 || z <= -15.5) { z = clamp(z, -15.5, 27.5); dir = 0; }
          ctl.set('z', z);
        }
        const z = V.z, w = Math.pow(10, z), k = st.W / w;
        const band = BANDS.find(b => z >= b[0] && z < b[1]) || BANDS[BANDS.length - 1];
        let main = null, bestD = 1e9;
        for (const o of SCALES) { const d = Math.abs(Math.log10(o[0] * k / (0.62 * st.H))); if (d < bestD) { bestD = d; main = o; } }
        ro.set('w', fmtLen(w)); ro.set('p', '10' + sup(Math.floor(z)) + ' m to 10' + sup(Math.floor(z) + 1) + ' m');
        ro.set('main', bestD < 0.6 ? main[1] + ' (' + fmtLen(main[0]) + ')' : 'between ' + main[1] + ' and its neighbours');
        ro.set('force', band[4]);
        const c = st.begin(), C = kit.colors();
        const ruleH = 58, cx = st.W / 2, cy = (st.H - ruleH) / 2 + 6;
        c.save(); c.beginPath(); c.rect(0, 0, st.W, st.H - ruleH); c.clip();
        // every object, drawn to scale as a circle; the one filling the view as a picture
        for (const o of SCALES) {
          const r = o[0] * k / 2;
          if (r < 1 || r > 3 * st.W) continue;
          if (o === main && bestD < 0.6) picto(c, o[2], cx, cy, r, C);
          c.strokeStyle = o === main ? C.text : C.faint; c.lineWidth = o === main ? 1.6 : 1;
          c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
          if (r > 14 && r < 1.4 * st.H) {
            const a = -Math.PI / 4 - 0.35 * Math.log10(o[0]) % 1, lx = cx + r * Math.cos(a), ly = cy + r * Math.sin(a);
            if (ly > 10 && ly < st.H - ruleH - 6 && lx < st.W - 10) kit.label(c, o[1] + ' · ' + fmtLen(o[0]), lx + 4, ly - 6, { size: 11.5, color: o === main ? C.text : C.muted, bg: C.bg2 });
          }
        }
        c.restore();
        // scale bar
        const bar = Math.pow(10, Math.floor(z - 0.6)), bpx = bar * k;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(14, 16); c.lineTo(14 + bpx, 16); c.moveTo(14, 11); c.lineTo(14, 21); c.moveTo(14 + bpx, 11); c.lineTo(14 + bpx, 21); c.stroke();
        kit.label(c, fmtLen(bar), 20 + bpx, 16, { size: 11.5, color: C.text });
        // the ruler of all scales
        const rx0 = 20, rx1 = st.W - 20, ry = st.H - ruleH + 22, zx = zz => rx0 + (rx1 - rx0) * (zz + 15.5) / 43;
        for (const b of BANDS) {
          const x0 = zx(Math.max(-15.5, b[0])), x1 = zx(Math.min(27.5, b[1]));
          c.fillStyle = 'hsl(' + b[3] + ' 70% 55% / ' + (b === band ? 0.55 : 0.22) + ')'; c.fillRect(x0, ry - 7, x1 - x0, 14);
          if (x1 - x0 > 60) kit.label(c, b[2], (x0 + x1) / 2, ry + 20, { size: 10.5, color: b === band ? C.text : C.muted, align: 'center' });
        }
        for (let e = -15; e <= 27; e += 3) { c.fillStyle = C.muted; c.fillRect(zx(e) - 0.5, ry - 11, 1, 4); kit.label(c, '10' + sup(e), zx(e), ry - 17, { size: 9.5, color: C.muted, align: 'center' }); }
        for (const o of SCALES) { c.fillStyle = C.text; c.fillRect(zx(Math.log10(o[0])) - 0.5, ry - 4, 1, 8); }
        const mx = zx(z);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(mx, ry + 9); c.lineTo(mx - 6, ry + 19); c.lineTo(mx + 6, ry + 19); c.closePath(); c.fill();
        c.fillRect(mx - 1, ry - 9, 2, 18);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the ladder of energies */
  const RUNGS = [
    { E: 0.2, name: 'a hydrogen bond in water breaks', sci: 'chemistry, biology' },
    { E: 0.44, name: 'a water molecule evaporates from the surface', sci: 'chemistry, weather' },
    { E: 1.0, name: 'a slow reaction gets over its barrier', sci: 'chemistry' },
    { E: 2.3, name: 'a photon of green light (for scale)', sci: 'vision, photosynthesis', photon: true },
    { E: 3.6, name: 'a carbon–carbon bond breaks', sci: 'chemistry, biology' },
    { E: 13.6, name: 'a hydrogen atom is ionised', sci: 'physics, astronomy' },
    { E: 5e4, name: 'a medical X-ray photon (for scale)', sci: 'physics', photon: true },
    { E: 1e6, name: 'two protons get over their electric repulsion', sci: 'astronomy' },
    { E: 8e6, name: 'a proton or neutron is pulled out of a nucleus', sci: 'nuclear physics' }
  ];
  const KB_EV = 8.617333262e-5, NU = 1e13, AGE = Math.log10(4.35e17);
  const logWait = (E, T) => -13 + E / (KB_EV * T) / Math.LN10;            // log₁₀ of e^(E/kT)/ν in seconds
  function fmtWait(l) {
    if (!Number.isFinite(l)) return 'never';
    if (l < -9) return sci(Math.pow(10, l), 2) + ' s';
    if (l < -6) return (+Math.pow(10, l + 9).toPrecision(2)) + ' ns';
    if (l < -3) return (+Math.pow(10, l + 6).toPrecision(2)) + ' µs';
    if (l < 0) return (+Math.pow(10, l + 3).toPrecision(2)) + ' ms';
    const s = Math.pow(10, Math.min(l, 300));
    if (l < 2) return (+s.toPrecision(2)) + ' s';
    if (l < 3.6) return (+(s / 60).toPrecision(2)) + ' min';
    if (l < 4.9) return (+(s / 3600).toPrecision(2)) + ' hours';
    if (l < 7.5) return (+(s / 86400).toPrecision(2)) + ' days';
    if (l < AGE) return sci(s / 3.156e7, 2) + ' years';
    const e = l - AGE;
    return e < 15 ? sci(Math.pow(10, e), 2) + ' × the age of the universe' : '10' + sup(Math.round(e)) + ' × the age of the universe';
  }
  Hyper.sim('way-energy-ladder', {
    title: 'The ladder of energies',
    blurb: `Why can chemistry, biology and astronomy each keep their own rules? The rungs are energies of real processes, on a [[?logarithm|logarithmic]] scale. The orange glow is the thermal jiggling at the chosen temperature: it reaches up to about $k_BT$ and then fades as the [[?boltzmann-factor|Boltzmann factor]] $e^{-E/k_BT}$. A rung the glow reaches happens all the time; one far above it effectively never happens. The graph gives the waiting time $e^{E/k_BT}/\\nu$ with $\\nu = 10^{13}$ tries a second (an order-of-magnitude model).

**Try this**
- At room temperature (300 K), hydrogen bonds break every fraction of a nanosecond, a 1 eV reaction takes hours, a carbon–carbon bond waits far longer than the age of the universe. That is why water is a liquid and DNA lasts.
- Cool to liquid nitrogen (77 K): a hydrogen bond, which broke billions of times a second, now holds for about a second — everything soft goes stiff. Heat to a flame: 1 eV barriers are crossed in well under a nanosecond and even carbon–carbon bonds break within milliseconds — burning.
- Go to the Sun's core (15.7 million K). $k_BT$ is only about 1.4 keV: the proton barrier still says *never*. Protons in the Sun fuse only because quantum mechanics lets them tunnel through.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 3, max: 1e8, value: 300, log: true, sig: 3, unit: 'K' },
        { id: 'jump', type: 'select', label: 'Go to', options: [['(choose a place)', 0], ['Liquid nitrogen, 77 K', 77], ['A freezer, 255 K', 255], ['A room, 300 K', 300], ['Boiling water, 373 K', 373], ['A candle flame, about 1700 K', 1700], ['The Sun\'s surface, 5800 K', 5800], ['The Sun\'s core, 15.7 million K', 1.57e7]], value: 0 },
        { id: 'rung', type: 'select', label: 'Read out the process', options: RUNGS.map((r, i) => [r.name, i]).filter((o, i) => !RUNGS[i].photon), value: 2 }
      ], (id, v) => { if (id === 'jump' && v > 0) ctl.set('T', v); if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['kT', 'k_BT, the typical jiggle'], ['bf', 'Boltzmann factor e^(−E/k_BT)'], ['wait', 'Typical waiting time'], ['who', 'Belongs to']]);
      const plot = kit.plot(gb, { x: { label: 'energy needed (eV)', min: 1e-2, max: 1e7, log: true }, y: { label: 'waiting time, log₁₀(seconds)', min: -14, max: 60 }, legend: true }, 170);
      const E0 = -2.5, E1 = 7.5;                            // log₁₀ eV range of the ladder
      let lastT = -1;
      const loop = kit.loop(() => {
        const T = clamp(fin(V.T, 300), 3, 1e8), kT = KB_EV * T, r = RUNGS[V.rung] || RUNGS[2];
        ro.set('T', sci(T, 3) + ' K' + (T < 2000 ? ' (' + (T - 273.15).toFixed(0) + ' °C)' : ''));
        ro.set('kT', kT < 1 ? (+kT.toPrecision(3)) + ' eV (1/' + (1 / kT).toFixed(0) + ' eV)' : sci(kT, 3) + ' eV');
        const x = r.E / kT;
        ro.set('bf', x > 700 ? 'e' + sup('-' + Math.round(x)) + ' ≈ 10' + sup('-' + Math.round(x / Math.LN10)) : sci(Math.exp(-x), 2));
        ro.set('wait', fmtWait(logWait(r.E, T)));
        ro.set('who', r.sci);
        if (T !== lastT) {
          lastT = T;
          const pts = []; for (let i = 0; i <= 200; i++) { const le = -2 + 9 * i / 200, E = Math.pow(10, le); pts.push([E, clamp(logWait(E, T), -14, 60)]); }
          plot.set({ series: [{ pts, label: 'waiting time at ' + sci(T, 3) + ' K' }],
            hlines: [{ y: 0, label: '1 second' }, { y: AGE, label: 'age of the universe' }],
            marks: RUNGS.filter(q => !q.photon).map(q => ({ x: q.E, y: clamp(logWait(q.E, T), -14, 60), label: q === r ? q.name : '' })) });
        }
        // the ladder
        const c = st.begin(), C = kit.colors();
        const top = 16, bot = st.H - 16, ax = 64, yOf = E => bot - (bot - top) * (Math.log10(E) - E0) / (E1 - E0);
        for (let le = Math.ceil(E0); le <= E1; le++) {
          const y = yOf(Math.pow(10, le));
          c.fillStyle = C.grid; c.fillRect(ax, y, st.W - ax - 8, 1);
          kit.label(c, (le === 0 ? '1' : '10' + sup(le)) + ' eV', ax - 6, y, { size: 10.5, color: C.muted, align: 'right' });
        }
        // the thermal glow: e^(−E/kT) along the axis
        for (let y = top; y < bot; y += 2) {
          const E = Math.pow(10, E0 + (E1 - E0) * (bot - y) / (bot - top)), a = Math.exp(-E / kT);
          if (a < 0.003) continue;
          c.fillStyle = 'hsl(22 95% 55% / ' + (0.8 * a).toFixed(3) + ')'; c.fillRect(ax + 2, y, 46, 2);
        }
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ax, top); c.lineTo(ax, bot); c.stroke();
        const yk = yOf(kT);
        if (yk > top && yk < bot) { c.strokeStyle = 'hsl(22 95% 50%)'; c.lineWidth = 2; c.beginPath(); c.moveTo(ax - 4, yk); c.lineTo(ax + 56, yk); c.stroke(); kit.label(c, 'k_BT', ax + 30, yk - 9, { size: 11, weight: 700, color: 'hsl(22 95% 50%)', align: 'center' }); }
        else kit.label(c, yk >= bot ? 'k_BT is below the ladder' : 'k_BT is above the ladder', ax + 4, yk >= bot ? bot - 8 : top + 8, { size: 11, color: 'hsl(22 95% 50%)' });
        // rungs, with labels pushed apart so they do not overlap
        const lx = ax + 70, items = RUNGS.map(q => ({ q, y: yOf(q.E), ly: yOf(q.E) }));
        const gap = 26;
        for (let i = items.length - 2; i >= 0; i--) if (items[i].ly - items[i + 1].ly < gap) items[i].ly = items[i + 1].ly + gap;
        for (let pass = 0; pass < 2; pass++) for (let i = 0; i < items.length; i++) { if (items[i].ly > bot - 6) items[i].ly = bot - 6; if (i > 0 && items[i - 1].ly - items[i].ly < gap) items[i].ly = items[i - 1].ly - gap; }
        for (const it of items) {
          const q = it.q, l = logWait(q.E, T);
          const col = q.photon ? C.accent : l < 0 ? C.ok : l < AGE ? C.warn : C.muted;
          c.strokeStyle = col; c.lineWidth = q === r ? 3 : 2; c.setLineDash(q.photon ? [5, 4] : []);
          c.beginPath(); c.moveTo(ax, it.y); c.lineTo(ax + 56, it.y); c.lineTo(lx - 6, it.ly); c.stroke(); c.setLineDash([]);
          const status = q.photon ? '' : l < 0 ? ' — happens all the time (every ' + fmtWait(l) + ')' : l < AGE ? ' — slow: about every ' + fmtWait(l) : ' — never (' + fmtWait(l) + ')';
          kit.label(c, q.name, lx, it.ly - 6, { size: 12, weight: q === r ? 700 : 500, color: C.text });
          kit.label(c, (q.E >= 1e3 ? sci(q.E, 2) : q.E) + ' eV · ' + q.sci + status, lx, it.ly + 7, { size: 10.5, color: col });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ one law, many consequences: orbits */
  const GM_SUN = 4 * Math.PI * Math.PI;                    // AU³/yr²: a circle of 1 AU takes one year
  Hyper.sim('way-orbits', {
    title: 'One law, many consequences',
    blurb: `A planet launched sideways from 1 AU, pulled towards the Sun by a force $F \\propto 1/r^n$ (the same strength at 1 AU whatever $n$). With $n = 2$ this is Newton's law of gravitation. The shaded wedges are the areas swept in equal times; the arrows are the velocity (green) and the pull of the Sun (orange). Units: astronomical units and years, in which Kepler's third law reads $T^2 = a^3$.

**Try this**
- With $n = 2$, check Kepler's three rules: the orbit is a closed ellipse with the Sun at a focus, the wedges have equal areas, and $T^2/a^3 = 1$.
- Change $n$ to 1.7 or 2.4. The wedges stay equal — equal areas only say the force points at the Sun — but the ellipse no longer closes: it becomes a rosette, the perihelion moving round each orbit.
- Tick *Add a second planet*: with $n = 2$ both have the same $T^2/a^3$; with any other $n$ they do not. Kepler's third rule is what picks out the inverse square.
- Try $n = 3$ with a slow launch: the planet spirals into the Sun. Stable, closed orbits are a special gift of the inverse square.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      let paused = false;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Force law: F ∝ 1/rⁿ, with n =', min: 1.5, max: 3, step: 0.05, value: 2 },
        { id: 'v', label: 'Launch speed (× circular speed at 1 AU)', min: 0.5, max: 1.3, step: 0.01, value: 0.8 },
        { id: 'areas', type: 'check', label: 'Shade the areas swept in equal times', value: true },
        { id: 'two', type: 'check', label: 'Add a second planet at 2.5 AU', value: false },
        { id: 'speed', label: 'Time speed', min: 0.05, max: 2, step: 0.05, value: 0.4, unit: 'yr/s' },
        { type: 'buttons', items: [{ id: 'launch', label: 'Launch again', primary: true }, { id: 'pause', label: 'Pause / go' }] }
      ], id => { if (id === 'pause') paused = !paused; else if (id === 'n' || id === 'v' || id === 'launch' || id === 'two') launch(); if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['law', 'Force law'], ['area', 'Areas of the last wedges'], ['T', 'Period (perihelion to perihelion)'], ['a', 'Semi-major axis a'], ['k1', 'T²/a³, planet 1 (yr²/AU³)'], ['k2', 'T²/a³, planet 2'], ['prec', 'Perihelion moves per orbit'], ['msg', '']]);
      const DT = 1e-4;
      let bodies = [], simT = 0, viewR = 1.5, sectorDt = 0.05;
      const acc = (x, y, out) => { const r = Math.hypot(x, y), a = GM_SUN * Math.pow(r, -V.n); out[0] = -a * x / r; out[1] = -a * y / r; };
      function body(x, y, vx, vy, col) {
        return { x, y, vx, vy, col, trail: [[x, y]], rPrev: Math.hypot(x, y), drPrev: 0, peri: [], rmin: Infinity, rmax: 0, rminLast: NaN, rmaxLast: NaN, angle: 0, turns: [], sectors: [], cur: { pts: [[x, y]], area: 0, t0: 0 }, dead: '' };
      }
      function launch() {
        simT = 0;
        const v1 = V.v * 2 * Math.PI;                          // circular speed at 1 AU is 2π AU/yr for any n
        bodies = [body(1, 0, 0, v1, null)];
        if (V.two) { const r2 = 2.5, vc = Math.sqrt(GM_SUN * Math.pow(r2, 1 - V.n)); bodies.push(body(r2, 0, 0, vc, 2)); }
        // an estimate of the period for the wedge length (inverse-square formula; rough for other n)
        const E = 0.5 * v1 * v1 - GM_SUN;
        sectorDt = E < 0 ? clamp(2 * Math.PI * Math.sqrt(Math.pow(-GM_SUN / (2 * E), 3) / GM_SUN) / 16, 0.01, 0.5) : 0.05;
        viewR = 1.5;
      }
      const a0 = [0, 0];
      function advance(b, dt) {
        if (b.dead) return;
        acc(b.x, b.y, a0);
        b.vx += 0.5 * dt * a0[0]; b.vy += 0.5 * dt * a0[1];
        const x0 = b.x, y0 = b.y;
        b.x += dt * b.vx; b.y += dt * b.vy;
        acc(b.x, b.y, a0);
        b.vx += 0.5 * dt * a0[0]; b.vy += 0.5 * dt * a0[1];
        const r = Math.hypot(b.x, b.y);
        b.cur.area += 0.5 * Math.abs(x0 * b.y - y0 * b.x);
        let da = Math.atan2(b.y, b.x) - Math.atan2(y0, x0); if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
        b.angle += da;
        const dr = r - b.rPrev;
        b.rmin = Math.min(b.rmin, r); b.rmax = Math.max(b.rmax, r);
        if (b.drPrev < 0 && dr >= 0) { b.peri.push([simT, Math.atan2(b.y, b.x)]); if (b.peri.length > 3) b.peri.shift(); b.rminLast = b.rmin; b.rmin = Infinity; }
        if (b.drPrev > 0 && dr <= 0) { b.rmaxLast = b.rmax; b.rmax = 0; }
        if (Math.abs(b.angle) >= TAU * (b.turns.length + 1)) b.turns.push(simT);
        b.rPrev = r; if (dr !== 0) b.drPrev = dr;
        if (r < 0.03) b.dead = 'fell into the Sun';
        if (r > 40) b.dead = 'escaped from the Sun';
      }
      launch();
      const loop = kit.loop(dt => {
        if (!paused && dt > 0) {
          const steps = Math.min(4000, Math.round(V.speed * dt / DT));
          for (let k = 0; k < steps; k++) {
            simT += DT;
            for (const b of bodies) {
              if (b.dead) continue;
              advance(b, DT);
              if (simT - b.cur.t0 >= sectorDt) {
                b.cur.pts.push([b.x, b.y]); b.sectors.push(b.cur); if (b.sectors.length > 12) b.sectors.shift();
                b.cur = { pts: [[b.x, b.y]], area: 0, t0: simT };
              } else if (k % 10 === 0) b.cur.pts.push([b.x, b.y]);
            }
          }
          for (const b of bodies) { b.trail.push([b.x, b.y]); if (b.trail.length > 1500) b.trail.shift(); }
        }
        const p = bodies[0];
        let maxR = 1.2; for (const b of bodies) for (const q of b.trail) maxR = Math.max(maxR, Math.hypot(q[0], q[1]));
        viewR += (Math.min(maxR * 1.12, 12) - viewR) * (dt > 0 ? Math.min(1, dt * 2) : 1);
        // measurements
        const A = p.sectors.map(s => s.area);
        const mean = A.length ? A.reduce((s, v) => s + v, 0) / A.length : 0, spread = A.length > 1 ? (Math.max(...A) - Math.min(...A)) / mean : 0;
        const Tp = p.peri.length >= 2 ? p.peri[p.peri.length - 1][0] - p.peri[p.peri.length - 2][0] : NaN;
        const aAx = (p.rminLast + p.rmaxLast) / 2;
        let prec = NaN;
        if (p.peri.length >= 2) { prec = (p.peri[p.peri.length - 1][1] - p.peri[p.peri.length - 2][1]) * 180 / Math.PI; while (prec > 180) prec -= 360; while (prec <= -180) prec += 360; }
        ro.set('law', 'F ∝ 1/r' + (Math.abs(V.n - 2) < 1e-9 ? '² (Newton)' : '^' + V.n.toFixed(2)));
        ro.set('area', A.length > 1 && mean > 0 ? mean.toFixed(4) + ' AU² each, spread ' + (100 * spread).toFixed(2) + ' %' : p.dead ? '—' : 'measuring…');
        ro.set('T', Number.isFinite(Tp) ? Tp.toFixed(3) + ' yr' : 'measuring…');
        ro.set('a', Number.isFinite(aAx) ? aAx.toFixed(3) + ' AU' : 'measuring…');
        ro.set('k1', Number.isFinite(Tp) && Number.isFinite(aAx) ? (Tp * Tp / Math.pow(aAx, 3)).toFixed(3) : '—');
        const q = bodies[1];
        const T2 = q && q.turns.length >= 2 ? q.turns[q.turns.length - 1] - q.turns[q.turns.length - 2] : q && q.turns.length === 1 ? q.turns[0] : NaN;
        ro.set('k2', q ? (Number.isFinite(T2) ? (T2 * T2 / Math.pow(2.5, 3)).toFixed(3) + ' (T = ' + T2.toFixed(2) + ' yr)' : 'measuring…') : '—');
        ro.set('prec', Number.isFinite(prec) ? (Math.abs(prec) < 0.05 ? '0° — the ellipse closes' : prec.toFixed(1) + '°') : '—');
        ro.set('msg', p.dead ? 'The planet ' + p.dead + '.' : Math.abs(V.n - 2) > 1e-9 && Number.isFinite(prec) ? 'Equal areas still hold, but the orbit does not close.' : '');
        // drawing
        const c = st.begin(), C = kit.colors();
        const cx = st.W / 2, cy = st.H / 2, k = Math.min(st.W, st.H) * 0.46 / viewR;
        const X = v => cx + v * k, Y = v => cy - v * k;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let rr = 1; rr <= viewR * 1.5; rr += (viewR > 6 ? 2 : 1)) { c.beginPath(); c.arc(cx, cy, rr * k, 0, TAU); c.stroke(); }
        kit.label(c, '1 AU', X(0.72), Y(0.72) - 2, { size: 10.5, color: C.muted });
        if (V.areas) {
          p.sectors.forEach((s, i) => {
            c.globalAlpha = 0.28; c.fillStyle = i % 2 ? C.series[1] : C.series[0];
            c.beginPath(); c.moveTo(cx, cy); for (const pt of s.pts) c.lineTo(X(pt[0]), Y(pt[1])); c.closePath(); c.fill(); c.globalAlpha = 1;
          });
        }
        for (const b of bodies) {
          c.strokeStyle = b.col == null ? C.accent : C.series[b.col]; c.lineWidth = 1.6; c.beginPath();
          b.trail.forEach((pt, i) => i ? c.lineTo(X(pt[0]), Y(pt[1])) : c.moveTo(X(pt[0]), Y(pt[1]))); c.stroke();
        }
        c.fillStyle = 'hsl(45 100% 60% / .3)'; c.beginPath(); c.arc(cx, cy, 13, 0, TAU); c.fill();
        c.fillStyle = 'hsl(45 100% 55%)'; c.beginPath(); c.arc(cx, cy, 8, 0, TAU); c.fill();
        for (const b of bodies) {
          if (b.dead) continue;
          const px = X(b.x), py = Y(b.y), r = Math.hypot(b.x, b.y), v = Math.hypot(b.vx, b.vy);
          const fl = clamp(18 + 16 * Math.log10(1 + GM_SUN * Math.pow(r, -V.n) / 10), 10, 70), vl = clamp(v * 5, 8, 70);
          kit.arrow(c, px, py, px - fl * b.x / r, py + fl * b.y / r, C.warn, 2.2);
          kit.arrow(c, px, py, px + vl * b.vx / v, py - vl * b.vy / v, C.ok, 2.2);
          c.fillStyle = b.col == null ? C.accent : C.series[b.col]; c.beginPath(); c.arc(px, py, 6, 0, TAU); c.fill();
        }
        kit.label(c, 'F ∝ 1/r' + (Math.abs(V.n - 2) < 1e-9 ? '²' : '^' + V.n.toFixed(2)), 12, 16, { size: 13, weight: 700 });
        kit.label(c, 't = ' + simT.toFixed(2) + ' yr', 12, 36, { size: 11.5, color: C.muted });
        if (V.areas) kit.label(c, 'each wedge: ' + (sectorDt * 365.25).toFixed(0) + ' days', st.W - 12, 16, { size: 11.5, color: C.muted, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ one law, three ways */
  Hyper.sim('way-three-ways', {
    title: 'One law, three ways',
    blurb: `The same arc of an orbit, from A to B in a given time, found three ways. **1. Force at a distance**: at each moment add up the pull of the Sun, $GMm/r^2$, reaching across space, and step forward. **2. The field**: space is filled with a potential $\\phi = -GM/r$ (the rings); the body only feels the slope of $\\phi$ where it is — a purely local rule. **3. Least action**: take any trial path from A to B in the same time, compute its [[?action]] $S = \\int (KE - PE)\\,dt$, and change the path to make $S$ [[?stationary|least]]. Units: AU and years; the action is per kilogram.

**Try this**
- Run ways 1 and 2: the planet follows the same arc, though one computes a force from far away and the other only looks at the slope under its feet.
- Choose way 3 and press *Start from a straight line*: the trial path is a straight, steady trip from A to B. Watch it relax, the action falling, until it lies on Newton's path.
- Press *Wiggle the trial path*: any bump raises the action; relaxation removes it again.
- Show *All three together*: three different-looking rules, one path. That is what "mathematically equivalent" means.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const N = 60, SUBS = 40, GM = GM_SUN;
      let R = kit.qm.rng(2024);
      const ctl = kit.controls(box.side, [
        { id: 'way', type: 'select', label: 'Way of stating the law', options: [['1. Force at a distance (Newton)', 'force'], ['2. The field: roll down the potential', 'field'], ['3. Least action: the whole path at once', 'action'], ['All three together', 'all']], value: 'force' },
        { id: 's', label: 'Launch speed at A (× circular speed)', min: 0.85, max: 1.15, step: 0.01, value: 0.92 },
        { id: 'T', label: 'Time from A to B', min: 0.08, max: 0.3, step: 0.01, value: 0.22, unit: 'yr' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run again', primary: true }, { id: 'wiggle', label: 'Wiggle the trial path' }, { id: 'straight', label: 'Start from a straight line' }] }
      ], id => {
        if (id === 's' || id === 'T') setup();
        else if (id === 'run') { tau = 0; if (V.way === 'action') straight(); }
        else if (id === 'wiggle') wiggle();
        else if (id === 'straight') straight();
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Action of the trial path (per kg)'], ['Sn', 'Action of Newton\'s path'], ['dev', 'Largest gap, trial path to Newton\'s'], ['nf', 'Largest gap, field way to force way'], ['msg', '']]);
      let newton = [], field = [], trial = [], fine = [], fineF = [], A = [1, 0], B = [1, 0], tau = 0, Tn = 0;
      const phi = (x, y) => -GM / Math.hypot(x, y);
      function integrate(useField) {
        const T = V.T, h = T / (N * SUBS), out = [], pts = [];
        let x = 1, y = 0, vx = 0, vy = V.s * 2 * Math.PI;
        const g = (x, y) => {
          if (useField) { const e = 1e-5; return [-(phi(x + e, y) - phi(x - e, y)) / (2 * e), -(phi(x, y + e) - phi(x, y - e)) / (2 * e)]; }
          const r = Math.hypot(x, y), f = GM / (r * r * r); return [-f * x, -f * y];
        };
        out.push([x, y]); pts.push([x, y]);
        let a = g(x, y);
        for (let i = 1; i <= N * SUBS; i++) {
          vx += 0.5 * h * a[0]; vy += 0.5 * h * a[1];
          x += h * vx; y += h * vy;
          a = g(x, y);
          vx += 0.5 * h * a[0]; vy += 0.5 * h * a[1];
          if (i % SUBS === 0) out.push([x, y]);
          if (i % 4 === 0) pts.push([x, y]);
        }
        return { out, pts };
      }
      function action(path) {
        const dt = V.T / N; let S = 0;
        for (let i = 0; i < N; i++) { const dx = path[i + 1][0] - path[i][0], dy = path[i + 1][1] - path[i][1]; S += 0.5 * (dx * dx + dy * dy) / dt; }
        for (let i = 0; i <= N; i++) S += (i === 0 || i === N ? 0.5 : 1) * GM / Math.hypot(path[i][0], path[i][1]) * dt;   // −PE = +GM/r
        return S;
      }
      function straight() { trial = []; for (let i = 0; i <= N; i++) trial.push([A[0] + (B[0] - A[0]) * i / N, A[1] + (B[1] - A[1]) * i / N]); }
      function wiggle() {
        const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, m = 1 + Math.floor(R() * 3), amp = (R() < 0.5 ? -1 : 1) * (0.05 + 0.08 * R());
        for (let i = 1; i < N; i++) { const s = amp * Math.sin(Math.PI * m * i / N); trial[i][0] += s * nx; trial[i][1] += s * ny; }
      }
      function relax(sweeps) {
        const dt = V.T / N, w = 1.85;
        for (let k = 0; k < sweeps; k++) for (let i = 1; i < N; i++) {
          const x = trial[i][0], y = trial[i][1], r = Math.max(0.05, Math.hypot(x, y)), f = 0.5 * dt * dt * GM / (r * r * r);
          const gx = (trial[i - 1][0] + trial[i + 1][0]) / 2 + f * x, gy = (trial[i - 1][1] + trial[i + 1][1]) / 2 + f * y;
          trial[i][0] = x + w * (gx - x); trial[i][1] = y + w * (gy - y);
        }
      }
      function setup() {
        const nw = integrate(false), fd = integrate(true);
        newton = nw.out; fine = nw.pts; field = fd.out; fineF = fd.pts;
        A = newton[0]; B = newton[N]; tau = 0; Tn = action(newton);
        straight();
      }
      setup();
      const loop = kit.loop(dt => {
        if (dt > 0) { tau += dt; if (V.way === 'action' || V.way === 'all') relax(2); }
        const S = action(trial);
        let dev = 0, nf = 0;
        for (let i = 0; i <= N; i++) { dev = Math.max(dev, Math.hypot(trial[i][0] - newton[i][0], trial[i][1] - newton[i][1])); nf = Math.max(nf, Math.hypot(field[i][0] - newton[i][0], field[i][1] - newton[i][1])); }
        ro.set('S', S.toFixed(4) + ' AU²/yr'); ro.set('Sn', Tn.toFixed(4) + ' AU²/yr');
        ro.set('dev', dev < 1e-4 ? 'less than 0.0001 AU' : dev.toFixed(4) + ' AU (' + sci(dev * 1.496e8, 2) + ' km)');
        ro.set('nf', nf < 1e-6 ? 'less than 10⁻⁶ AU — the same path' : sci(nf, 2) + ' AU');
        const act = V.way === 'action' || V.way === 'all';
        ro.show('S', act); ro.show('dev', act);
        ro.set('msg', act ? (dev < 2e-3 ? 'The least-action path is Newton\'s path.' : 'Relaxing: the action is still falling.') : V.way === 'force' ? 'Newton: add up the pull of the Sun, step by step.' : 'Field: follow the local slope of the potential.');
        // drawing
        const c = st.begin(), C = kit.colors();
        let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
        for (const p of fine.concat(trial)) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
        const k = Math.min((st.W - 60) / (x1 - x0 + 0.3), (st.H - 50) / (y1 - y0 + 0.3));
        const ox = (st.W - (x1 - x0) * k) / 2 - x0 * k, oy = (st.H + (y1 - y0) * k) / 2 + y0 * k;
        const X = v => ox + v * k, Y = v => oy - v * k;
        const way = V.way;
        // the potential: rings of equal φ, and field arrows (ways 2 and all)
        if (way === 'field' || way === 'all') {
          for (let i = 1; i <= 14; i++) { const rr = 0.2 * i; c.strokeStyle = 'hsl(265 60% 60% / ' + (0.5 - 0.025 * i).toFixed(2) + ')'; c.lineWidth = 1; c.beginPath(); c.arc(X(0), Y(0), rr * k, 0, TAU); c.stroke(); }
          const step = 46;
          for (let sx = 20; sx < st.W; sx += step) for (let sy = 20; sy < st.H; sy += step) {
            const wx = (sx - ox) / k, wy = (oy - sy) / k, r = Math.hypot(wx, wy);
            if (r < 0.15) continue;
            const L = clamp(14 / (r * r), 3, 20);
            kit.arrow(c, sx, sy, sx - L * wx / r, sy + L * wy / r, 'hsl(265 60% 60% / .55)', 1.2, 5);
          }
        }
        // Newton's path, the field path, the trial path
        const line = (pts, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.setLineDash([]); };
        if (way === 'all') { c.globalAlpha = 0.45; line(fine, C.series[0], 8); c.globalAlpha = 1; line(field, C.series[1], 3); }
        if (way === 'action') line(fine, C.muted, 1.5, [5, 5]);
        if (way === 'action' || way === 'all') { line(trial, C.series[2], 2); for (let i = 1; i < N; i++) { c.fillStyle = C.series[2]; c.beginPath(); c.arc(X(trial[i][0]), Y(trial[i][1]), 2.4, 0, TAU); c.fill(); } }
        // the Sun, A and B
        c.fillStyle = 'hsl(45 100% 60% / .3)'; c.beginPath(); c.arc(X(0), Y(0), 14, 0, TAU); c.fill();
        c.fillStyle = 'hsl(45 100% 55%)'; c.beginPath(); c.arc(X(0), Y(0), 8, 0, TAU); c.fill();
        kit.label(c, 'Sun', X(0), Y(0) + 22, { size: 11, color: C.muted, align: 'center' });
        for (const [p, nm] of [[A, 'A'], [B, 'B']]) { c.fillStyle = C.text; c.beginPath(); c.arc(X(p[0]), Y(p[1]), 4.5, 0, TAU); c.fill(); kit.label(c, nm, X(p[0]) + 8, Y(p[1]) - 10, { size: 13, weight: 700 }); }
        // the moving planet for ways 1 and 2
        if (way === 'force' || way === 'field') {
          const src = way === 'force' ? fine : fineF, cyc = 3.5, f = Math.min(1, (tau % (cyc + 1)) / cyc), idx = Math.min(src.length - 1, Math.floor(f * (src.length - 1)));
          line(src.slice(0, idx + 1), way === 'force' ? C.series[0] : C.series[1], 2.5);
          const p = src[idx], px = X(p[0]), py = Y(p[1]), r = Math.hypot(p[0], p[1]);
          if (way === 'force') {
            c.save(); c.setLineDash([3, 5]); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(px, py); c.lineTo(X(0), Y(0)); c.stroke(); c.restore();
            const L = clamp(40 / (r * r), 15, 90);
            kit.arrow(c, px, py, px - L * p[0] / r, py + L * p[1] / r, C.warn, 2.6);
            kit.label(c, 'pull of the Sun, GMm/r², across space', px + 10, py + 18, { size: 11.5, color: C.warn, bg: C.bg2 });
          } else {
            c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.beginPath(); c.arc(px, py, 22, 0, TAU); c.stroke();
            const L = clamp(40 / (r * r), 15, 90);
            kit.arrow(c, px, py, px - L * p[0] / r, py + L * p[1] / r, C.series[1], 2.6);
            kit.label(c, 'only the slope of φ right here', px + 26, py + 18, { size: 11.5, color: C.series[1], bg: C.bg2 });
          }
          c.fillStyle = C.accent; c.beginPath(); c.arc(px, py, 6, 0, TAU); c.fill();
        }
        if (way === 'action') kit.label(c, 'S = ' + S.toFixed(4) + '   (Newton\'s path: ' + Tn.toFixed(4) + ')', 12, 16, { size: 12.5, weight: 700, color: C.series[2] });
        if (way === 'all') {
          const lg = [[C.series[0], '1. force: steps from the pull of the Sun'], [C.series[1], '2. field: the local slope of φ'], [C.series[2], '3. least action: the relaxed trial path']];
          lg.forEach(([col, t], i) => { c.fillStyle = col; c.fillRect(12, 12 + i * 18, 18, 4); kit.label(c, t, 36, 14 + i * 18, { size: 11.5 }); });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ guess, compute, compare: the pendulum */
  // the standard normal distribution function (Abramowitz and Stegun 7.1.26 for erf)
  function ncdf(z) {
    const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
  }
  // the chance that χ² with k degrees of freedom exceeds x (Wilson–Hilferty)
  function chi2Tail(x, k) {
    if (k <= 0) return NaN;
    const z = (Math.cbrt(x / k) - (1 - 2 / (9 * k))) / Math.sqrt(2 / (9 * k));
    return z > 8 ? 0 : 1 - ncdf(z);
  }
  const agm = (a, b) => { for (let k = 0; k < 40; k++) { const m = (a + b) / 2; b = Math.sqrt(a * b); a = m; } return a; };
  Hyper.sim('way-guess-compare', {
    title: 'Guess, compute, compare: the pendulum',
    blurb: `An experiment times pendulums of different lengths $L$, each period with a random timing error $\\sigma$ (the error bars). Choose a guess for the law. The simulation **computes** what the guess predicts (the curve; a guess with a free constant $C$ is given its best-fitting value) and **compares**: the strip below shows each point's miss in [[?standard-deviation|standard deviations]], $z = (T_{\\text{measured}} - T_{\\text{guess}})/\\sigma$, and the verdict adds them up ($\\chi^2$, the sum of $z^2$).

**Try this**
- Try each guess at small swings. "T does not depend on L" and "T ∝ L" fail at once; "T ∝ √L" and Newton's $2\\pi\\sqrt{L/g}$ agree.
- Now swing the pendulums through 40° and make the timing precise (0.005 s). Newton's small-swing law fails — every point is too slow. The law was right, but only for small swings. (At 20° it fails too, if you time well enough.)
- Switch to *Newton with the swing correction*: agreement again. Push to 60°: even the correction fails; the next term is needed. With the finest timing (0.002 s) it begins to show at 40°.
- At 40°, the guess "T ∝ √L" still fits — its free constant soaks up the difference. Read the fitted C: it implies the wrong $g$. A fitted constant can hide a failure.`,
    mount(box, kit) {
      const Q = kit.qm, g = 9.80665;
      let seed = 5, R = Q.rng(seed);
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const GUESSES = [['T does not depend on L:  T = C', 'const'], ['T ∝ L:  T = C·L', 'lin'], ['T ∝ √L:  T = C·√L', 'sqrt'], ['T ∝ L²:  T = C·L²', 'sq'], ['Newton, small swings:  T = 2π√(L/g)', 'newton'], ['Newton with the swing correction:  T = 2π√(L/g)·(1 + θ₀²/16)', 'newton2']];
      const ctl = kit.controls(box.side, [
        { id: 'guess', type: 'select', label: 'Your guess', options: GUESSES, value: 'lin' },
        { id: 'amp', label: 'Size of the swing θ₀', min: 2, max: 60, step: 1, value: 5, unit: '°' },
        { id: 'sig', label: 'Timing error of each period (σ)', min: 0.002, max: 0.05, value: 0.02, log: true, sig: 2, unit: 's' },
        { id: 'np', label: 'Number of lengths measured', min: 4, max: 20, step: 1, value: 10 },
        { type: 'buttons', items: [{ id: 'measure', label: 'Measure again', primary: true }] }
      ], id => { if (id === 'guess') evaluate(); else measure(); if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fit', 'Fitted constant'], ['chi', 'χ² per degree of freedom'], ['p', 'Chance of so big a misfit if the guess were right'], ['zmax', 'Worst point'], ['verdict', 'Verdict']]);
      const Ttrue = (L, th) => 2 * Math.PI * Math.sqrt(L / g) / agm(1, Math.cos(th / 2));
      const BASIS = { const: L => 1, lin: L => L, sqrt: L => Math.sqrt(L), sq: L => L * L };
      let data = [], reveal = 0, revT = 0, res = null, show = 0, th = 0, om = 0, curL = 1;
      function predict(kind, L, C) {
        const th0 = V.amp * Math.PI / 180;
        if (kind === 'newton') return 2 * Math.PI * Math.sqrt(L / g);
        if (kind === 'newton2') return 2 * Math.PI * Math.sqrt(L / g) * (1 + th0 * th0 / 16);
        return C * BASIS[kind](L);
      }
      function measure() {
        seed++; R = Q.rng(seed);
        const n = Math.max(2, Math.round(V.np)), th0 = V.amp * Math.PI / 180;
        data = [];
        for (let i = 0; i < n; i++) { const L = 0.2 + 1.8 * i / (n - 1); data.push({ L, T: Ttrue(L, th0) + V.sig * Q.gauss(R) }); }
        reveal = 0; revT = 0; show = 0; startSwing(data[0].L);
        evaluate();
      }
      function evaluate() {
        const pts = data.slice(0, Math.max(0, reveal)), kind = V.guess, f = BASIS[kind];
        if (pts.length < 2) { res = null; return; }
        let C = null;
        if (f) { let a = 0, b = 0; for (const p of pts) { a += p.T * f(p.L); b += f(p.L) * f(p.L); } C = b > 0 ? a / b : 0; }
        let chi = 0, zmax = 0, zL = 0;
        const zs = pts.map(p => { const z = (p.T - predict(kind, p.L, C)) / V.sig; chi += z * z; if (Math.abs(z) > Math.abs(zmax)) { zmax = z; zL = p.L; } return z; });
        const dof = pts.length - (f ? 1 : 0), pv = chi2Tail(chi, dof);
        res = { C, chi, dof, pv, zs, zmax, zL };
      }
      function startSwing(L) { curL = L; th = V.amp * Math.PI / 180; om = 0; }
      measure();
      const loop = kit.loop(dt => {
        if (dt > 0) {
          revT += dt;
          if (reveal < data.length && revT > 0.45) { reveal++; revT = 0; show = reveal - 1; startSwing(data[show].L); evaluate(); }
          else if (reveal >= data.length && revT > 3.5) { revT = 0; show = (show + 1) % data.length; startSwing(data[show].L); }
          // the real pendulum, integrated with small RK4 steps: θ'' = −(g/L) sin θ
          const h = 1 / 600, k = g / curL;
          for (let s = 0; s < Math.round(dt / h); s++) {
            const f = (a, w) => [w, -k * Math.sin(a)];
            const k1 = f(th, om), k2 = f(th + h / 2 * k1[0], om + h / 2 * k1[1]), k3 = f(th + h / 2 * k2[0], om + h / 2 * k2[1]), k4 = f(th + h * k3[0], om + h * k3[1]);
            th += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); om += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
          }
        }
        // read-outs
        const kind = V.guess;
        if (!res) { ['fit', 'chi', 'p', 'zmax'].forEach(key => ro.set(key, '—')); ro.set('verdict', 'taking data…'); }
        else {
          ro.set('fit', res.C == null ? 'none — nothing to adjust' : 'C = ' + res.C.toFixed(4) + (kind === 'sqrt' ? ' s/√m, which implies g = ' + Math.pow(2 * Math.PI / res.C, 2).toFixed(2) + ' m/s²' : kind === 'const' ? ' s' : kind === 'lin' ? ' s/m' : ' s/m²'));
          ro.set('chi', (res.chi / Math.max(1, res.dof)).toFixed(2) + ' (' + res.dof + ' degrees of freedom)');
          ro.set('p', res.pv < 1e-12 ? 'less than 10⁻¹²' : res.pv < 0.001 ? sci(res.pv, 2) : (100 * res.pv).toFixed(1) + ' %');
          ro.set('zmax', (res.zmax >= 0 ? '+' : '') + res.zmax.toFixed(1) + ' σ at L = ' + res.zL.toFixed(2) + ' m');
          ro.set('verdict', res.pv < 0.001 ? 'Wrong: the guess disagrees with the measurements.' : res.pv < 0.01 ? 'Doubtful: take more or better data.' : 'Agrees within the errors — so far.');
        }
        // drawing
        const c = st.begin(), C = kit.colors();
        const pw = Math.min(st.W * 0.3, 230), gx0 = pw + 52, gx1 = st.W - 14, gy0 = 18, gy1 = st.H * 0.64, ry0 = gy1 + 30, ry1 = st.H - 22;
        // the pendulum
        const pivX = pw / 2 + 6, pivY = 26, Lpx = (st.H - 90) * curL / 2.0, bx = pivX + Lpx * Math.sin(th), by = pivY + Lpx * Math.cos(th);
        c.fillStyle = C.muted; c.fillRect(pivX - 30, pivY - 6, 60, 5);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(pivX, pivY); c.lineTo(bx, by); c.stroke();
        c.fillStyle = C.accent; c.beginPath(); c.arc(bx, by, 9, 0, TAU); c.fill();
        const th0 = V.amp * Math.PI / 180;
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(pivX, pivY, Lpx, Math.PI / 2 - th0, Math.PI / 2 + th0); c.stroke(); c.setLineDash([]);
        const cur = data[show];
        if (cur) {
          kit.label(c, 'L = ' + cur.L.toFixed(2) + ' m', 10, st.H - 36, { size: 12, weight: 700 });
          kit.label(c, show < reveal ? 'measured T = ' + cur.T.toFixed(3) + ' s' : 'timing…', 10, st.H - 16, { size: 12, color: C.muted });
        }
        // the graph of T against L
        const Lmax = 2.1, Tmax = 3.4, GX = L => gx0 + (gx1 - gx0) * L / Lmax, GY = T => gy1 - (gy1 - gy0) * T / Tmax;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, gy0); c.lineTo(gx0, gy1); c.lineTo(gx1, gy1); c.stroke();
        for (let L = 0; L <= 2.0001; L += 0.5) { c.fillStyle = C.muted; c.fillRect(GX(L), gy1, 1, 4); kit.label(c, L.toFixed(1), GX(L), gy1 + 11, { size: 10, color: C.muted, align: 'center' }); }
        for (let T = 0; T <= 3.0001; T += 1) { c.fillRect(gx0 - 4, GY(T), 4, 1); kit.label(c, T.toFixed(0) + ' s', gx0 - 7, GY(T), { size: 10, color: C.muted, align: 'right' }); }
        kit.label(c, 'length L (m)', gx1, gy1 + 11, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'period T', gx0 + 6, gy0 + 2, { size: 10.5, color: C.muted });
        c.save(); c.beginPath(); c.rect(gx0, gy0, gx1 - gx0, gy1 - gy0); c.clip();
        if (res) {
          const col = res.pv < 0.001 ? C.bad : res.pv < 0.05 ? C.warn : C.ok;
          c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath();
          for (let i = 0; i <= 100; i++) { const L = 0.02 + 2.06 * i / 100, T = predict(kind, L, res.C); i ? c.lineTo(GX(L), GY(T)) : c.moveTo(GX(L), GY(T)); }
          c.stroke();
        }
        c.restore();
        data.forEach((p, i) => {
          if (i >= reveal) return;
          const x = GX(p.L), y = GY(p.T), e = Math.max(2.5, (gy1 - gy0) * V.sig / Tmax);
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y - e); c.lineTo(x, y + e); c.moveTo(x - 3, y - e); c.lineTo(x + 3, y - e); c.moveTo(x - 3, y + e); c.lineTo(x + 3, y + e); c.stroke();
          c.fillStyle = i === show ? C.accent : C.text; c.beginPath(); c.arc(x, y, i === show ? 4.5 : 3, 0, TAU); c.fill();
        });
        // the misses, in standard deviations
        const ZM = 6, RY = z => (ry0 + ry1) / 2 - (ry1 - ry0) / 2 * clamp(z, -ZM, ZM) / ZM;
        c.fillStyle = C.ok; c.globalAlpha = 0.12; c.fillRect(gx0, RY(2), gx1 - gx0, RY(-2) - RY(2)); c.globalAlpha = 1;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, RY(0)); c.lineTo(gx1, RY(0)); c.stroke();
        kit.label(c, '+2σ', gx0 - 7, RY(2), { size: 9.5, color: C.muted, align: 'right' }); kit.label(c, '−2σ', gx0 - 7, RY(-2), { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'miss z = (measured − guess)/σ', gx0 + 6, ry0 - 8, { size: 10.5, color: C.muted });
        if (res) res.zs.forEach((z, i) => {
          const x = GX(data[i].L), y = RY(z), big = Math.abs(z) > 2;
          c.strokeStyle = big ? C.bad : C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(x, RY(0)); c.lineTo(x, y); c.stroke();
          c.fillStyle = big ? C.bad : C.text; c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill();
          if (Math.abs(z) > ZM) kit.label(c, (z > 0 ? '+' : '') + z.toFixed(0), x, z > 0 ? y - 8 : y + 8, { size: 9.5, color: C.bad, align: 'center' });
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ how sure can you be? */
  Hyper.sim('way-how-sure', {
    title: 'How sure can you be?',
    blurb: `A coin with a secret bias — its true chance of heads. You flip it and keep a degree of belief for every possible bias: the curve below, updated after each flip by Bayes' rule (each possibility is weighted by how well it predicted the flip). The dashed curve is what you believed before flipping.

**Try this**
- With an open mind, flip 10, then 100, then 1000 times. The curve narrows roughly as $1/\\sqrt{N}$ — four times the flips for half the width — but never becomes a single line: certainty grows, it is never complete.
- Hide the true value, flip until you are "sure", then reveal it. How often is the truth inside your 95 % range?
- Choose *Certain it is fair* and a coin with bias 0.65. Flip a thousand times. Nothing moves: a belief with no room for doubt can never learn.
- Choose *Fairly sure it is fair*: it takes more evidence to move, but it does move — a strong opinion is fine, as long as it is not a closed one.`,
    mount(box, kit) {
      const Q = kit.qm, NG = 401, dp = 1 / (NG - 1), P = Array.from({ length: NG }, (_, i) => i * dp);
      let seed = 3, R = Q.rng(seed), auto = false, acc = 0, flip = 0, lastFace = '', snaps = [], hist = [];
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'bias', label: 'The coin\'s secret: true chance of heads', min: 0.3, max: 0.7, step: 0.01, value: 0.55 },
        { id: 'hide', type: 'check', label: 'Hide the true value', value: false },
        { id: 'prior', type: 'select', label: 'What you believed before flipping', options: [['Open mind: every bias equally likely', 'flat'], ['Fairly sure it is fair', 'fair'], ['Certain it is fair: no doubt at all', 'certain'], ['Sure it favours heads', 'heads']], value: 'flat' },
        { id: 'rate', label: 'Flips per second', min: 1, max: 300, value: 12, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'auto', label: 'Flip / stop', primary: true }, { id: 'f10', label: '+10 flips' }, { id: 'f100', label: '+100' }, { id: 'f1000', label: '+1000' }, { id: 'reset', label: 'Start over' }] }
      ], id => {
        if (id === 'auto') auto = !auto;
        else if (id === 'f10') many(10); else if (id === 'f100') many(100); else if (id === 'f1000') many(1000);
        else if (id === 'reset' || id === 'prior' || id === 'bias') reset();
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Flips'], ['h', 'Heads'], ['est', 'Best estimate ± 1σ'], ['ci', '95 % of your belief lies between'], ['fav', 'Belief that heads are favoured'], ['fair', 'Belief that the coin is fair (0.49–0.51)']]);
      const plot = kit.plot(gb, { x: { label: 'chance of heads (the bias)', min: 0, max: 1 }, y: { label: 'strength of belief (density)', min: 0 }, legend: true }, 190);
      let heads = 0, tails = 0, prior = [];
      function makePrior() {
        const k = V.prior;
        prior = P.map(p => k === 'flat' ? 0 : k === 'fair' ? 19 * Math.log(Math.max(p, 1e-300)) + 19 * Math.log(Math.max(1 - p, 1e-300)) : k === 'heads' ? 7 * Math.log(Math.max(p, 1e-300)) + 2 * Math.log(Math.max(1 - p, 1e-300)) : (Math.abs(p - 0.5) < dp / 2 ? 0 : -Infinity));
      }
      function posterior(h, t, pr) {
        const lp = P.map((p, i) => pr[i] + (h ? h * Math.log(Math.max(p, 1e-300)) : 0) + (t ? t * Math.log(Math.max(1 - p, 1e-300)) : 0));
        let m = -Infinity; for (const v of lp) if (v > m) m = v;
        const w = lp.map(v => Number.isFinite(v) ? Math.exp(v - m) : 0);
        const s = w.reduce((a, b) => a + b, 0) || 1;
        return w.map(v => v / s);                               // probabilities on the grid (sum 1)
      }
      function reset() { seed++; R = Q.rng(seed); heads = 0; tails = 0; snaps = []; hist = []; lastFace = ''; makePrior(); update(); }
      function one() {
        const H = R() < V.bias; if (H) heads++; else tails++;
        hist.push(H); if (hist.length > 80) hist.shift();
        lastFace = H ? 'H' : 'T'; flip = 1;
        const n = heads + tails;
        if (n === 10 || n === 100 || n === 1000) snaps.push({ n, w: posterior(heads, tails, prior) });
      }
      function many(k) { for (let i = 0; i < k; i++) one(); update(); }
      let stats = null;
      function update() {
        const w = posterior(heads, tails, prior);
        let mean = 0; w.forEach((v, i) => mean += v * P[i]);
        let vv = 0; w.forEach((v, i) => vv += v * (P[i] - mean) * (P[i] - mean));
        let cdf = 0, lo = 0, hi = 1, loSet = false, fav = 0, fair = 0;
        w.forEach((v, i) => { cdf += v; if (!loSet && cdf >= 0.025) { lo = P[i]; loSet = true; } if (cdf <= 0.975) hi = P[Math.min(NG - 1, i + 1)]; if (P[i] > 0.5 + 1e-9) fav += v; else if (Math.abs(P[i] - 0.5) < 1e-9) fav += v / 2; if (Math.abs(P[i] - 0.5) <= 0.01 + 1e-9) fair += v; });
        stats = { mean, sd: Math.sqrt(Math.max(0, vv)), lo, hi, fav, fair };
        const dens = arr => arr.map((v, i) => [P[i], v / dp]);
        const pw = posterior(0, 0, prior);
        const series = [{ pts: dens(pw), label: 'before flipping', dash: [5, 4], width: 1.5 }];
        snaps.forEach((s, i) => series.push({ pts: dens(s.w), label: 'after ' + s.n, width: 1.2, color: 'hsl(' + (200 + 40 * i) + ' 30% 60%)' }));
        series.push({ pts: dens(w), label: 'now, after ' + (heads + tails), width: 2.6, fill: true });
        const vl = [{ x: 0.5, label: 'fair' }];
        if (!V.hide) vl.push({ x: V.bias, label: 'true value' });
        plot.set({ series, vlines: vl });
      }
      makePrior(); update();
      let lastUpd = 0, clock = 0;
      const loop = kit.loop(dt => {
        clock += dt;
        if (auto && dt > 0) { acc += dt * V.rate; let k = 0; while (acc >= 1 && k < 400) { one(); acc -= 1; k++; } if (acc > 5) acc = 0; }
        if (flip > 0 && dt > 0) flip = Math.max(0, flip - dt * 4);
        if (clock - lastUpd > 0.12) { lastUpd = clock; update(); }
        const n = heads + tails, s = stats;
        ro.set('n', String(n));
        ro.set('h', n ? heads + ' (' + (100 * heads / n).toFixed(1) + ' %)' : '0');
        ro.set('est', s.mean.toFixed(3) + ' ± ' + s.sd.toFixed(3));
        ro.set('ci', s.lo.toFixed(3) + ' and ' + s.hi.toFixed(3));
        ro.set('fav', (100 * s.fav).toFixed(1) + ' %');
        ro.set('fair', (100 * s.fair).toFixed(1) + ' %');
        // drawing: the coin and the recent flips
        const c = st.begin(), C = kit.colors();
        const cx = 70, cy = st.H / 2, r = Math.min(46, st.H / 2 - 16), sy = Math.max(0.08, Math.abs(Math.cos(flip * Math.PI * 3)));
        c.save(); c.translate(cx, cy); c.scale(1, sy);
        c.fillStyle = 'hsl(45 70% 55%)'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
        c.strokeStyle = 'hsl(45 60% 35%)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r - 5, 0, TAU); c.stroke();
        c.restore();
        if (lastFace && sy > 0.5) kit.label(c, lastFace === 'H' ? 'heads' : 'tails', cx, cy, { size: 14, weight: 700, color: 'hsl(45 60% 22%)', align: 'center' });
        const x0 = 150, cols = Math.max(10, Math.floor((st.W - x0 - 20) / 16)), rowH = 18;
        kit.label(c, 'recent flips (● heads, ○ tails)', x0, 16, { size: 11.5, color: C.muted });
        hist.forEach((H, i) => {
          const px = x0 + 8 + (i % cols) * 16, py = 38 + Math.floor(i / cols) * rowH;
          if (py > st.H - 8) return;
          c.beginPath(); c.arc(px, py, 5.5, 0, TAU);
          if (H) { c.fillStyle = C.accent; c.fill(); } else { c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke(); }
        });
        if (V.prior === 'certain' && n > 0) kit.label(c, 'No doubt, no learning: the belief cannot move.', st.W - 12, st.H - 14, { size: 12, weight: 700, color: C.bad, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the ball in the wagon */
  Hyper.sim('way-wagon-ball', {
    title: 'The ball in the wagon',
    blurb: `Feynman's childhood puzzle, worked out. A ball lies in a wagon; the wagon is pulled, coasts, and is stopped. The same motion is shown twice: **from the ground** (fence posts every half metre) and **from the wagon** (the camera rides along). Friction at the bottom of the ball is the only horizontal force on it; the orange arrow shows it. Rolling without slipping, a ball with $I = k\\,mR^2$ accelerates over the ground at $\\frac{k}{1+k}A$ — for a solid ball $\\tfrac27$ of the wagon's acceleration $A$.

**Try this**
- Press *Pull, then stop*. From the wagon the ball rolls to the back, then to the front. From the ground, follow the trail of dots: the ball moves *forwards* when the wagon is pulled, only more slowly than the wagon.
- Compare the shapes: the hollow ball and the thin pipe are dragged along more (they take $\\tfrac25$ and $\\tfrac12$ of $A$).
- Choose *A box that cannot roll*: with good friction it simply moves with the wagon. Make the floor slippery (friction 0.05) and pull hard: now the box slides, and moves over the ground at $\\mu g$.
- Pull very hard on a slippery floor with the ball: it skids instead of rolling — the friction needed, $\\mu = kA/((1+k)g)$, is more than the floor can give.`,
    mount(box, kit) {
      const g = 9.81, RB = 0.11, WL = 2.4, DH = 0.3;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'What lies in the wagon', options: [['A solid ball (k = 2/5)', 0.4], ['A hollow ball (k = 2/3)', 2 / 3], ['A solid cylinder (k = 1/2)', 0.5], ['A thin pipe (k = 1)', 1], ['A box that cannot roll', -1]], value: 0.4 },
        { id: 'A', label: 'Pull: the wagon\'s acceleration', min: 0.5, max: 4, step: 0.1, value: 1.5, unit: 'm/s²' },
        { id: 'mu', label: 'Friction coefficient of the wagon floor', min: 0.02, max: 1, step: 0.01, value: 0.5 },
        { id: 'trail', type: 'check', label: 'Mark where the ball is over the ground', value: true },
        { type: 'buttons', items: [{ id: 'seq', label: 'Pull, then stop', primary: true }, { id: 'pull', label: 'Pull' }, { id: 'stop', label: 'Stop the wagon' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'reset' || id === 'shape') reset();
        else if (id === 'pull') { phase = 'pull'; timer = 0; seq = false; }
        else if (id === 'stop') { phase = 'brake'; seq = false; }
        else if (id === 'seq') { phase = 'pull'; timer = 0; seq = true; }
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vw', 'Wagon\'s speed'], ['vb', 'Ball\'s speed over the ground'], ['vr', 'Ball\'s speed relative to the wagon'], ['ab', 'Ball\'s acceleration over the ground'], ['state', 'The ball is'], ['dist', 'Moved since the start (wagon / ball)']]);
      let X = 0, Vw = 0, Aw = 0, xb = 0, vb = 0, om = 0, phi = 0, ab = 0, phase = 'idle', timer = 0, seq = false, state = 'at rest', marks = [], markT = 0, camG = 0;
      function reset() { X = 0; Vw = 0; Aw = 0; xb = 0; vb = 0; om = 0; phi = 0; ab = 0; phase = 'idle'; timer = 0; seq = false; state = 'at rest'; marks = []; markT = 0; camG = null; }
      function physics(h) {
        timer += h;
        if (phase === 'pull') { Aw = V.A; if (timer > 1.2) { phase = seq ? 'coast' : 'idle'; timer = 0; } }
        else if (phase === 'coast') { Aw = 0; if (timer > 0.8) { phase = 'brake'; timer = 0; } }
        else if (phase === 'brake') { Aw = -V.A; if (Vw + Aw * h <= 0) { Aw = -Vw / h; phase = 'idle'; seq = false; } }
        else Aw = 0;
        const k = V.shape, fmax = V.mu * g;
        let f = 0, alpha = 0;
        if (k > 0) {
          const u = vb - om * RB - Vw, need = Aw * k / (1 + k);
          if (Math.abs(u) < 1e-4 && Math.abs(need) <= fmax) { f = need; alpha = (f - Aw) / RB; state = Math.abs(vb - Vw) < 1e-4 && Math.abs(Aw) < 1e-9 ? (Math.abs(Vw) < 1e-6 ? 'at rest' : 'resting, carried along by the wagon') : 'rolling without slipping'; }
          else { f = Math.abs(u) < 1e-4 ? fmax * Math.sign(need) : -fmax * Math.sign(u); alpha = -f / (k * RB); state = 'skidding'; }
          const u0 = u;
          vb += f * h; om += alpha * h; Vw += Aw * h;
          const u1 = vb - om * RB - Vw;
          if (Math.abs(u0) >= 1e-4 && u0 * u1 <= 0) om = (vb - Vw) / RB;    // slip has stopped: it rolls from now on
        } else {
          const u = vb - Vw;
          if (Math.abs(u) < 1e-4 && Math.abs(Aw) <= fmax) { f = Aw; state = Math.abs(Aw) < 1e-9 ? 'at rest on the floor' : 'held by friction, moving with the wagon'; }
          else { f = Math.abs(u) < 1e-4 ? fmax * Math.sign(Aw) : -fmax * Math.sign(u); state = 'sliding'; }
          const u0 = u;
          vb += f * h; Vw += Aw * h;
          const u1 = vb - Vw;
          if (Math.abs(u0) >= 1e-4 && u0 * u1 <= 0) vb = Vw;
          om = 0;
        }
        if (Math.abs(Vw) < 1e-9) Vw = 0;
        ab = f;
        X += Vw * h; xb += vb * h; phi += om * h;
        // the ends of the wagon
        // the ends of the wagon are padded: the ball stops against them and then moves with the wagon
        const lim = WL / 2 - 0.06 - RB, xr = xb - X;
        if ((xr < -lim && vb - Vw < 0) || (xr > lim && vb - Vw > 0)) {
          xb = X + (xr < 0 ? -lim : lim);
          vb = Vw;
          if (V.shape > 0) om = 0;
        }
        markT += h;
        if (markT >= 0.1) { markT = 0; if (Vw !== 0 || vb !== 0) { marks.push(xb); if (marks.length > 200) marks.shift(); } }
      }
      reset();
      const loop = kit.loop(dt => {
        if (dt > 0) { const n = Math.round(dt * 1000); for (let i = 0; i < n; i++) physics(0.001); }
        ro.set('vw', Vw.toFixed(2) + ' m/s' + (phase === 'pull' ? ' (being pulled)' : phase === 'brake' ? ' (braking)' : ''));
        ro.set('vb', vb.toFixed(2) + ' m/s');
        ro.set('vr', (vb - Vw).toFixed(2) + ' m/s' + (vb - Vw < -0.005 ? ' (towards the back)' : vb - Vw > 0.005 ? ' (towards the front)' : ''));
        ro.set('ab', ab.toFixed(2) + ' m/s²' + (Math.abs(Aw) > 1e-6 ? ' = ' + (ab / Aw).toFixed(3) + ' × the wagon\'s' : ''));
        ro.set('state', state);
        ro.set('dist', X.toFixed(2) + ' m / ' + xb.toFixed(2) + ' m');
        // drawing
        const c = st.begin(), C = kit.colors();
        const ph = (st.H - 8) / 2, s = Math.min(st.W / 6.5, ph / 1.2);
        if (camG == null) camG = X - 0.35 * st.W / s;
        if ((X - camG) * s > 0.62 * st.W) camG = X - 0.62 * st.W / s;
        if ((X - camG) * s < 0.3 * st.W) camG = X - 0.3 * st.W / s;
        const scene = (y0, cam, title, ground) => {
          const yG = y0 + ph - 22, sx = w => (w - cam) * s, deck = yG - DH * s;
          c.save(); c.beginPath(); c.rect(0, y0, st.W, ph); c.clip();
          c.fillStyle = C.surface || C.bg; c.fillRect(0, y0, st.W, ph);
          kit.label(c, title, 10, y0 + 13, { size: 12, weight: 700, color: C.muted });
          // ground and posts (fixed to the ground)
          c.fillStyle = C.muted; c.fillRect(0, yG, st.W, 2);
          for (let m = Math.floor(cam * 2) / 2; m <= cam + st.W / s + 0.5; m += 0.5) {
            const px = sx(m), whole = Math.abs(m - Math.round(m)) < 1e-6;
            c.fillStyle = C.faint; c.fillRect(px - 1, yG - (whole ? 16 : 9), 2, whole ? 16 : 9);
            if (whole) kit.label(c, Math.round(m) + ' m', px, yG + 11, { size: 9.5, color: C.muted, align: 'center' });
          }
          // the ball's track over the ground
          if (ground && V.trail) for (const m of marks) { c.fillStyle = C.accent; c.globalAlpha = 0.55; c.beginPath(); c.arc(sx(m), deck + 6, 2.2, 0, TAU); c.fill(); c.globalAlpha = 1; }
          // the wagon
          const wx0 = sx(X - WL / 2), wx1 = sx(X + WL / 2);
          c.fillStyle = C.series[1]; c.globalAlpha = 0.85; c.fillRect(wx0, deck, wx1 - wx0, 0.1 * s); c.fillRect(wx0, deck - 0.2 * s, 0.06 * s, 0.3 * s); c.fillRect(wx1 - 0.06 * s, deck - 0.2 * s, 0.06 * s, 0.3 * s); c.globalAlpha = 1;
          for (const wxw of [X - 0.8, X + 0.8]) {
            const cx = sx(wxw), cy = yG - 0.1 * s, rr = 0.1 * s, a = X / 0.1;
            c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.moveTo(cx, cy); c.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); c.stroke();
          }
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(wx1, deck + 0.05 * s); c.lineTo(wx1 + 0.45 * s, deck - 0.35 * s); c.stroke();
          if (Math.abs(Aw) > 1e-6) kit.arrow(c, wx1 + 0.45 * s, deck - 0.35 * s, wx1 + 0.45 * s + (Aw > 0 ? 1 : -1) * clamp(Math.abs(Aw) * 12, 14, 50), deck - 0.35 * s, Aw > 0 ? C.ok : C.bad, 2.4);
          // the ball (or box)
          const bx = sx(xb), by = deck - RB * s;
          if (V.shape > 0) {
            c.fillStyle = C.accent; c.beginPath(); c.arc(bx, by, RB * s, 0, TAU); c.fill();
            c.strokeStyle = C.surface || '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + RB * s * Math.cos(phi), by + RB * s * Math.sin(phi)); c.stroke();
          } else { c.fillStyle = C.accent; c.fillRect(bx - RB * s, deck - 2 * RB * s, 2 * RB * s, 2 * RB * s); }
          if (ground && Math.abs(ab) > 0.02) {
            kit.arrow(c, bx, deck - 2, bx + Math.sign(ab) * clamp(Math.abs(ab) * 14, 10, 60), deck - 2, C.warn, 2.4);
            kit.label(c, 'friction', bx + Math.sign(ab) * 30, deck + 12, { size: 10.5, color: C.warn, align: 'center' });
          }
          c.restore();
          c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(0.5, y0 + 0.5, st.W - 1, ph - 1);
        };
        scene(0, camG, 'Seen from the ground — the dots mark where the ball has been', true);
        scene(ph + 8, X - 0.5 * st.W / s, 'Seen from the wagon', false);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ how to fool yourself */
  Hyper.sim('way-fool-yourself', {
    title: 'How to fool yourself',
    blurb: `Hundreds of experiments ask one question: is this coin biased? Each flip moves a running score $z$ — how many [[?standard-deviation|standard deviations]] the heads are from half — which wanders like a [[?random-walk]]. A "discovery" is claimed when $|z| > 1.96$, the usual 5 % threshold. The three protocols differ only in *when* you look and *what* you report.

**Try this**
- *Honest*: the number of flips is fixed in advance and $z$ is looked at once, at the end. Run 100 experiments on a fair coin: about 5 % are false discoveries, as promised.
- *Stop when it looks good*: look after every flip and stop the moment $|z| > 1.96$. Same fair coin — about a third of the experiments "discover" a bias.
- *Best of k*: run k experiments and report only the best. With k = 10, about 40 % of fair coins look biased; with 20, about 64 % — the formula $1 - 0.95^k$.
- Switch to a real effect (60 % heads): with 100 flips the honest protocol finds it about half the time; with 400 flips, nearly always. When the effect is real, honesty and patience find it.`,
    mount(box, kit) {
      const Q = kit.qm;
      let seed = 17, R = Q.rng(seed);
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'proto', type: 'select', label: 'Protocol', options: [['Honest: fixed number of flips, look once', 'honest'], ['Stop as soon as it looks significant', 'peek'], ['Run k experiments, report the best', 'best']], value: 'honest' },
        { id: 'p', type: 'select', label: 'The coin', options: [['No real effect: a fair coin', 0.5], ['A real effect: 60 % heads', 0.6]], value: 0.5 },
        { id: 'N', label: 'Flips per experiment', min: 20, max: 400, step: 10, value: 100 },
        { id: 'k', label: 'k, the number of experiments tried (best of k)', min: 2, max: 40, step: 1, value: 10 },
        { type: 'buttons', items: [{ id: 'one', label: 'Run 1 experiment', primary: true }, { id: 'hundred', label: 'Run 100 experiments' }, { id: 'clear', label: 'Clear the tally' }] }
      ], id => {
        if (id === 'one') { queue = runOne(); anim = 0; }
        else if (id === 'hundred') { for (let i = 0; i < 99; i++) runOne(); queue = runOne(); anim = 1; }
        else if (id === 'clear') { tally = {}; traces = []; queue = null; }
        else if (id === 'N' || id === 'p' || id === 'proto' || id === 'k') { traces = []; queue = null; }
        ctl.show('k', V.proto === 'best');
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      ctl.show('k', V.proto === 'best');
      const ro = kit.readout(box.side, [['runs', 'Experiments run with this protocol'], ['disc', 'Discoveries claimed'], ['rate', 'Rate of discoveries'], ['prom', 'What the 5 % threshold promises']]);
      let tally = {}, traces = [], queue = null, anim = 1;
      // a separate tally for each protocol, coin, number of flips (and k for best of k)
      const keyOf = proto => proto + '|' + V.p + '|' + Math.round(V.N) + (proto === 'best' ? '|' + Math.round(V.k) : '');
      const key = () => keyOf(V.proto);
      // one run of N flips: the path of z, and where (if anywhere) the protocol stops and claims a discovery
      function path(N, p, peek) {
        const z = [0]; let h = 0, stop = -1;
        for (let n = 1; n <= N; n++) {
          if (R() < p) h++;
          const zn = (h - n / 2) / (Math.sqrt(n) / 2); z.push(zn);
          if (peek && Math.abs(zn) > 1.96) { stop = n; break; }
        }
        if (!peek && Math.abs(z[z.length - 1]) > 1.96) stop = N;
        return { z, stop };
      }
      function runOne() {
        const N = Math.round(V.N), p = +V.p;
        let res;
        if (V.proto === 'best') {
          const runs = []; for (let i = 0; i < Math.round(V.k); i++) runs.push(path(N, p, false));
          let bi = 0; runs.forEach((r, i) => { if (Math.abs(r.z[N]) > Math.abs(runs[bi].z[N])) bi = i; });
          res = { lines: runs, best: bi, found: runs[bi].stop > 0 };
        } else {
          const r = path(N, p, V.proto === 'peek');
          res = { lines: [r], best: 0, found: r.stop > 0 };
        }
        const t = tally[key()] = tally[key()] || { runs: 0, disc: 0 };
        t.runs++; if (res.found) t.disc++;
        traces.push(res); if (traces.length > (V.proto === 'best' ? 1 : 30)) traces.shift();
        return res;
      }
      const loop = kit.loop(dt => {
        if (dt > 0 && anim < 1) anim = Math.min(1, anim + dt / 1.6);
        const t = tally[key()] || { runs: 0, disc: 0 }, real = +V.p !== 0.5;
        ro.set('runs', String(t.runs));
        ro.set('disc', String(t.disc) + (real ? ' (the effect is real)' : ' (all false: the coin is fair)'));
        ro.set('rate', t.runs ? (100 * t.disc / t.runs).toFixed(1) + ' %' : '—');
        ro.set('prom', real ? 'a real effect should be found often' : V.proto === 'best' ? '5 % — but best of ' + Math.round(V.k) + ' gives ' + (100 * (1 - Math.pow(0.95, Math.round(V.k)))).toFixed(0) + ' %' : '5 %');
        // drawing: z paths above, the tally below
        const c = st.begin(), C = kit.colors();
        const N = Math.round(V.N), x0 = 46, x1 = st.W - 14, y0 = 14, y1 = st.H * 0.62, ZM = 4.2;
        const PX = n => x0 + (x1 - x0) * n / N, PY = z => (y0 + y1) / 2 - (y1 - y0) / 2 * clamp(z, -ZM, ZM) / ZM;
        c.fillStyle = C.ok; c.globalAlpha = 0.1; c.fillRect(x0, PY(1.96), x1 - x0, PY(-1.96) - PY(1.96)); c.globalAlpha = 1;
        c.strokeStyle = C.bad; c.lineWidth = 1; c.setLineDash([5, 4]);
        for (const zz of [1.96, -1.96]) { c.beginPath(); c.moveTo(x0, PY(zz)); c.lineTo(x1, PY(zz)); c.stroke(); }
        c.setLineDash([]);
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x0, PY(0)); c.lineTo(x1, PY(0)); c.moveTo(x0, y0); c.lineTo(x0, y1); c.stroke();
        kit.label(c, 'z = +1.96', x0 - 4, PY(1.96), { size: 9.5, color: C.bad, align: 'right' });
        kit.label(c, '−1.96', x0 - 4, PY(-1.96), { size: 9.5, color: C.bad, align: 'right' });
        kit.label(c, 'flips →', x1, y1 + 10, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'running score z of each experiment', x0 + 6, y0 + 2, { size: 10.5, color: C.muted });
        traces.forEach((res, ti) => {
          const newest = ti === traces.length - 1;
          res.lines.forEach((r, li) => {
            const lastIdx = r.z.length - 1, upto = newest ? Math.max(1, Math.floor(anim * lastIdx)) : lastIdx;
            const isBest = V.proto === 'best' && li === res.best, found = r.stop > 0 && (V.proto !== 'best' || isBest);
            c.strokeStyle = found ? C.bad : isBest || newest ? C.accent : C.faint; c.lineWidth = newest && (isBest || V.proto !== 'best') ? 2 : 1;
            c.globalAlpha = newest ? 1 : 0.6;
            c.beginPath(); for (let n = 0; n <= upto; n++) { const x = PX(n), y = PY(r.z[n]); n ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
            c.globalAlpha = 1;
            if (found && upto >= lastIdx) { c.fillStyle = C.bad; c.beginPath(); c.arc(PX(lastIdx), PY(r.z[lastIdx]), 4, 0, TAU); c.fill(); }
          });
        });
        if (traces.length && anim >= 1) {
          const last = traces[traces.length - 1];
          kit.label(c, last.found ? (+V.p !== 0.5 ? 'Discovery — and the effect is real.' : 'Discovery claimed! (The coin is fair.)') : 'Nothing found.', x1, y0 + 2, { size: 12, weight: 700, color: last.found ? C.bad : C.muted, align: 'right' });
        }
        // the tally for the three protocols (same coin)
        const by0 = y1 + 30, bh = st.H - by0 - 14, bw = (x1 - x0) / 3;
        const names = [['honest', 'honest'], ['peek', 'stop when it looks good'], ['best', 'best of ' + Math.round(V.k)]];
        const PB = f => by0 + bh - bh * clamp(f, 0, 1);
        c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, PB(0.05)); c.lineTo(x1, PB(0.05)); c.stroke(); c.setLineDash([]);
        kit.label(c, '5 %', x0 - 4, PB(0.05), { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, '100 %', x0 - 4, PB(1), { size: 9.5, color: C.muted, align: 'right' });
        names.forEach(([id, nm], i) => {
          const tt = tally[keyOf(id)] || { runs: 0, disc: 0 }, f = tt.runs ? tt.disc / tt.runs : 0, bx = x0 + i * bw + bw * 0.2, w = bw * 0.6;
          c.fillStyle = id === V.proto ? C.accent : C.faint; c.globalAlpha = id === V.proto ? 0.9 : 0.6; c.fillRect(bx, PB(f), w, by0 + bh - PB(f)); c.globalAlpha = 1;
          kit.label(c, tt.runs ? (100 * f).toFixed(0) + ' %  (' + tt.disc + ' of ' + tt.runs + ')' : 'not run yet', bx + w / 2, PB(f) - 9, { size: 10.5, align: 'center', color: C.text });
          kit.label(c, nm, bx + w / 2, by0 + bh + 8, { size: 10.5, align: 'center', color: C.muted });
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ how a wrong value creeps */
  Hyper.sim('way-creep', {
    title: 'How a wrong value creeps',
    blurb: `A model, not the historical data. The first measurement of a constant came out 0.6 % low (as Millikan's charge of the electron did, because of a wrong value for the viscosity of air). Later experimenters measure honestly, each with a random error (the error bars), improving over the years. But when a result disagrees with the last published value by more than two error bars, they look hard for a mistake — and, looking hard, find something to "correct" that moves their number towards the accepted one. Results that agree are not checked so hard. The grey crosses are what the experiments actually gave before correction.

**Try this**
- Replay the history with strong extra checking: the published values climb towards the truth slowly, one small step at a time, and many of their error bars miss the true value. Now and then someone publishes what they really found, and the history jumps.
- Compare with the honest history (the same experimenters, reporting what they get): it reaches the truth at the first try.
- Set the extra checking to zero: the two histories become the same. The fault is not in any single measurement, but in checking some results harder than others.`,
    mount(box, kit) {
      const Q = kit.qm;
      let seed = 1916;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'bias', label: 'Extra checking of results that disagree with the last value', min: 0, max: 1, step: 0.05, value: 0.9 },
        { id: 'first', label: 'Error of the first measurement', min: -2, max: 2, step: 0.1, value: -0.6, unit: '%' },
        { id: 'n', label: 'Number of later experiments', min: 8, max: 40, step: 1, value: 24 },
        { id: 'honest', type: 'check', label: 'Also show the honest history', value: true },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay the history', primary: true }, { id: 'new', label: 'New experimenters' }] }
      ], id => { if (id === 'new') seed++; build(); shown = id === 'replay' || id === 'new' ? 0 : shown; if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['last', 'Latest published value (checked-hard history)'], ['miss', 'Error bars that miss the true value'], ['rej', 'Results "corrected" towards the last value'], ['reach', 'First result within one error bar of the truth']]);
      let hist = [], honest = [], rejected = [], shown = 0, tick = 0;
      function build() {
        const Rb = Q.rng(seed), Rx = Q.rng(seed + 7777), n = Math.round(V.n);
        hist = [{ v: V.first, s: 0.1 }]; honest = [{ v: V.first, s: 0.1 }]; rejected = [];
        for (let i = 1; i <= n; i++) {
          const s = 0.05 + 0.08 * Math.pow(0.95, i);            // percent: each experiment a little more precise than the last
          const base = s * Q.gauss(Rb);
          honest.push({ v: base, s });
          // a result that disagrees with the last published value is searched for mistakes; a "correction"
          // is found that moves it towards that value, to within about one error bar of it
          const prev = hist[hist.length - 1].v;
          let v = base;
          if (Math.abs(base - prev) > 2 * s && Rx() < V.bias) { rejected.push({ i, v: base }); v = prev + Math.sign(base - prev) * s * (0.2 + 0.7 * Rx()); }
          hist.push({ v, s });
        }
      }
      build();
      const loop = kit.loop(dt => {
        if (dt > 0) { tick += dt; if (tick > 0.3 && shown < hist.length - 1) { tick = 0; shown++; } }
        const upto = Math.min(shown, hist.length - 1);
        const H1 = hist.slice(0, upto + 1), H0 = honest.slice(0, upto + 1);
        const miss = arr => arr.slice(1).filter(p => Math.abs(p.v) > 2 * p.s).length;
        const reach = arr => { for (let i = 1; i < arr.length; i++) if (Math.abs(arr[i].v) <= arr[i].s) return i; return 0; };
        const last = H1[H1.length - 1];
        ro.set('last', (last.v >= 0 ? '+' : '') + last.v.toFixed(2) + ' % ± ' + last.s.toFixed(2) + ' % from the truth');
        ro.set('miss', miss(H1) + ' of ' + (H1.length - 1) + (V.honest ? ' (honest: ' + miss(H0) + ')' : '') + ' — by more than 2 error bars');
        ro.set('rej', String(rejected.filter(r => r.i <= upto).length));
        const r1 = reach(H1), r0 = reach(H0);
        ro.set('reach', (r1 ? 'experiment ' + r1 : 'not yet') + (V.honest ? ' (honest: ' + (r0 ? 'experiment ' + r0 : 'not yet') + ')' : ''));
        // drawing
        const c = st.begin(), C = kit.colors();
        const n = hist.length - 1, x0 = 58, x1 = st.W - 16, y0 = 20, y1 = st.H - 34;
        let lo = Math.min(-0.8, V.first * 1.25, ...rejected.map(r => r.v)), hi = Math.max(0.8, V.first * 1.25, ...rejected.map(r => r.v));
        lo = Math.max(lo, -3); hi = Math.min(hi, 3);
        const PX = i => x0 + (x1 - x0) * i / Math.max(1, n), PY = v => y1 - (y1 - y0) * (clamp(v, lo, hi) - lo) / (hi - lo);
        const step = Hyper.niceStep ? Hyper.niceStep(hi - lo, 6) : 0.5;
        for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) { c.fillStyle = C.grid; c.fillRect(x0, PY(v), x1 - x0, 1); kit.label(c, (v > 0 ? '+' : '') + (+v.toFixed(2)) + ' %', x0 - 6, PY(v), { size: 10, color: C.muted, align: 'right' }); }
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, PY(0)); c.lineTo(x1, PY(0)); c.stroke();
        kit.label(c, 'the true value', x1, PY(0) - 9, { size: 11, color: C.ok, align: 'right', weight: 700 });
        kit.label(c, 'experiment number (later →)', x1, y1 + 18, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'published value − true value', x0 + 4, y0 - 8, { size: 10.5, color: C.muted });
        for (const r of rejected) if (r.i <= upto) { const x = PX(r.i), y = PY(r.v); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 3, y - 3); c.lineTo(x + 3, y + 3); c.moveTo(x - 3, y + 3); c.lineTo(x + 3, y - 3); c.stroke(); }
        const series = (arr, col, dx) => {
          c.strokeStyle = col; c.globalAlpha = 0.5; c.lineWidth = 1.2; c.beginPath(); arr.forEach((p, i) => i ? c.lineTo(PX(i) + dx, PY(p.v)) : c.moveTo(PX(i) + dx, PY(p.v))); c.stroke(); c.globalAlpha = 1;
          arr.forEach((p, i) => {
            const x = PX(i) + dx, ya = PY(p.v - p.s), yb = PY(p.v + p.s);
            c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x, ya); c.lineTo(x, yb); c.stroke();
            c.fillStyle = col; c.beginPath(); c.arc(x, PY(p.v), i === 0 ? 5 : 3.2, 0, TAU); c.fill();
          });
        };
        if (V.honest) series(H0, C.series[2], 3);
        series(H1, C.warn, -3);
        kit.label(c, 'first measurement', PX(0) + 8, PY(V.first) + (V.first < 0 ? 14 : -14), { size: 10.5, color: C.warn });
        const lg = [[C.warn, 'checked harder when they disagree']].concat(V.honest ? [[C.series[2], 'honest: every result reported']] : []);
        lg.forEach(([col, t], i) => { c.fillStyle = col; c.fillRect(x1 - 230, y1 - 38 + i * 16, 14, 4); kit.label(c, t, x1 - 210, y1 - 36 + i * 16, { size: 10.5 }); });
      }, box.stage);
      loop.start();
    }
  });

})();
