/* HYPER-CHEMISTRY · sims/bonding.js — simulations for Bonding and Structure:
 * the energy curve of a bond, the Born–Haber staircase, a Lewis-structure trainer,
 * polarity from a bond to a whole molecule, hybrid orbitals in 3-D, molecular-orbital
 * diagrams, boiling points and intermolecular forces, and crystal-field colour. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const pretty = f => String(f).replace(/\d/g, d => SUB[d]);
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const KJ_PER_EV = 96.485332;           // kJ/mol per eV
  const KJ_PER_CM = 0.0119627;           // kJ/mol per cm⁻¹
  const AMU = 1.66053906660e-27, C_CM = 2.99792458e10;
  const KE2 = 138935.46;                  // k e² N_A in kJ·pm/mol
  const N_PER_UNIT = 1660.539;            // 1 kJ/mol per pm² in N/m (and 1 kJ/mol per pm = 1.6605 nN)
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const minus = v => String(v).replace(/^-/, '−');          // a typographic minus sign
  const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const tone = (hex, k) => {             // lighten (k > 0) or darken (k < 0) a #rrggbb colour
    const t = k > 0 ? 255 : 0, a = Math.abs(k);
    return 'rgb(' + rgbOf(hex).map(v => Math.round(v + (t - v) * a)).join(',') + ')';
  };
  // a shaded sphere in an element's CPK colour
  function ball(c, x, y, r, hex, label, C) {
    if (!(r > 0.5)) return;
    const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, tone(hex, 0.55)); g.addColorStop(0.55, hex); g.addColorStop(1, tone(hex, -0.45));
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.45)'; c.stroke();
    if (label && r > 7) {
      const [R, G, B] = rgbOf(hex);
      c.font = '600 ' + Math.round(clamp(r * 0.8, 10, 16)) + 'px system-ui, sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = R * 0.3 + G * 0.59 + B * 0.11 > 150 ? '#111' : '#fff';
      c.fillText(label, x, y + 0.5);
    }
    void C;
  }
  // the same rotation and perspective as kit.mol, to draw arrows and orbitals over a molecule
  function project(p, v, o) {
    const cy = Math.cos(v.rotY), sy = Math.sin(v.rotY), cx = Math.cos(v.rotX), sx = Math.sin(v.rotX);
    const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
    const y2 = p[1] * cx - z1 * sx, z2 = p[1] * sx + z1 * cx;
    const d = v.dist || 12, f = d / (d - z2);
    return { x: o.cx + x1 * v.scale * f, y: o.cy - y2 * v.scale * f, z: z2, f };
  }
  const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len3 = a => Math.hypot(a[0], a[1], a[2]);
  const unit3 = a => { const n = len3(a) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  // a small panel label with a coloured swatch
  function key(c, x, y, color, text, C) {
    c.fillStyle = color; c.fillRect(x, y - 5, 14, 10);
    c.font = '12px system-ui, sans-serif'; c.fillStyle = C.muted; c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillText(text, x + 20, y);
  }

  /* ================================================================ the energy of a bond */
  // spectroscopic constants: r_e (pm), well depth D_e and bond energy D_0 (kJ/mol), ω_e (cm⁻¹)
  const PAIRS = [
    { id: 'H2', name: 'H₂', a: 'H', b: 'H', kind: 'morse', re: 74.14, De: 458.0, we: 4401, D0: 432.1 },
    { id: 'HCl', name: 'HCl', a: 'H', b: 'Cl', kind: 'morse', re: 127.46, De: 445.7, we: 2991, D0: 427.8 },
    { id: 'F2', name: 'F₂ (single bond)', a: 'F', b: 'F', kind: 'morse', re: 141.2, De: 160.1, we: 916.6, D0: 154.6 },
    { id: 'O2', name: 'O₂ (double bond)', a: 'O', b: 'O', kind: 'morse', re: 120.75, De: 503.0, we: 1580, D0: 493.6 },
    { id: 'N2', name: 'N₂ (triple bond)', a: 'N', b: 'N', kind: 'morse', re: 109.77, De: 955.7, we: 2359, D0: 941.6 },
    { id: 'Cl2', name: 'Cl₂', a: 'Cl', b: 'Cl', kind: 'morse', re: 198.8, De: 242.6, we: 559.7, D0: 239.2 },
    { id: 'I2', name: 'I₂', a: 'I', b: 'I', kind: 'morse', re: 266.6, De: 150.1, we: 214.5, D0: 148.8 },
    // an ion pair: Coulomb attraction plus a Born–Mayer repulsion; EA(Cl) = 348.6 kJ/mol, measured D_0 to atoms 408 kJ/mol
    { id: 'NaCl', name: 'Na⁺ Cl⁻ ion pair (gas)', a: 'Na', b: 'Cl', kind: 'ionic', re: 236.1, rho: 29, EA: 348.6, D0: 408, weMeas: 366, rA: 102, rB: 181 },
    // two argon atoms: Lennard-Jones, ε/k_B = 120 K, σ = 340.5 pm; measured well depth 1.19 kJ/mol at 376 pm
    { id: 'Ar2', name: 'Ar···Ar (dispersion only)', a: 'Ar', b: 'Ar', kind: 'lj', eps: 0.998, sigma: 340.5, D0: 1.19, rvdw: 188 }
  ];
  function bondModel(P, chem) {
    const ea = chem.el(P.a), eb = chem.el(P.b);
    const mu = ea.mass * eb.mass / (ea.mass + eb.mass) * AMU;
    const M = { P, mu, a: P.a, b: P.b };
    if (P.kind === 'morse') {
      const kSI = mu * Math.pow(2 * Math.PI * C_CM * P.we, 2);
      const al = Math.sqrt(kSI / N_PER_UNIT / (2 * P.De));
      M.re = P.re; M.De = P.De;
      M.V = r => { const e = Math.exp(-al * (r - P.re)); return P.De * ((1 - e) * (1 - e) - 1); };
      M.dV = r => { const e = Math.exp(-al * (r - P.re)); return 2 * P.De * al * e * (1 - e); };
      M.xmax = P.re + 5.5 / al; M.xmin = Math.max(0.45 * P.re, P.re - 1.4 / al);
      M.ytop = 0.75 * P.De; M.floor = 0;
    } else if (P.kind === 'ionic') {
      const IE = ea.ie * KJ_PER_EV, gap = IE - P.EA;
      const A = P.rho * KE2 / (P.re * P.re) * Math.exp(P.re / P.rho);
      M.re = P.re; M.gap = gap; M.IE = IE; M.rcross = KE2 / gap;
      M.V = r => gap - KE2 / r + A * Math.exp(-r / P.rho);
      M.dV = r => KE2 / (r * r) - A / P.rho * Math.exp(-r / P.rho);
      M.De = -M.V(P.re);
      M.xmax = M.rcross * 1.12; M.xmin = 0.72 * P.re;
      M.ytop = gap + 0.3 * M.De; M.floor = 0;
    } else {
      const s = P.sigma, eps = P.eps;
      M.re = Math.pow(2, 1 / 6) * s; M.De = eps;
      M.V = r => { const q = Math.pow(s / r, 6); return 4 * eps * (q * q - q); };
      M.dV = r => { const q = Math.pow(s / r, 6); return 4 * eps * (-12 * q * q + 6 * q) / r; };
      M.xmax = 2.7 * s; M.xmin = 0.86 * s;
      M.ytop = 0.8 * eps; M.floor = 0;
    }
    const h = 0.01;
    M.kU = (M.dV(M.re + h) - M.dV(M.re - h)) / (2 * h);           // kJ/mol per pm²
    M.k = M.kU * N_PER_UNIT;                                         // N/m
    M.we = Math.sqrt(M.k / mu) / (2 * Math.PI * C_CM);               // cm⁻¹
    M.T = 1 / (C_CM * M.we);                                         // period, s
    M.D0 = M.De - 0.5 * M.we * KJ_PER_CM;
    M.mass = mu / (M.T * M.T * N_PER_UNIT);                          // inertia in units where one period = 1
    return M;
  }

  Hyper.sim('bond-pe-curve', {
    title: 'The energy of a bond: two atoms approaching',
    blurb: `The curve is the potential energy of two atoms against the distance between their nuclei, drawn from measured spectroscopic constants. Far apart the atoms do not interact (zero); closer in they attract and the energy falls; too close and the nuclei and inner electrons repel. The bottom of the well is the **bond length** and its depth the **bond energy**.

- Untick **Vibrate** and move the separation: the force on the atoms is attractive outside the minimum, repulsive inside.
- Vibrate with more and more energy: the vibration becomes lopsided (the curve is not a parabola), and above the well depth the atoms fly apart — the bond is broken.
- Compare F₂, O₂ and N₂ (single, double, triple bonds): each step shortens the bond, deepens the well and stiffens the spring.
- The ion pair falls as −1/r and levels off at the cost of making the ions; Ar···Ar is held only by dispersion, a well hundreds of times shallower.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const p0 = Math.max(0, PAIRS.findIndex(p => p.id === (params && params.pair)));
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Atoms', options: PAIRS.map((p, i) => [p.name, i]), value: p0 },
        { id: 'vib', type: 'check', label: 'Vibrate', value: true },
        { id: 'E', label: 'Vibration energy (× well depth)', min: 0.02, max: 1.25, step: 0.01, value: 0.25 },
        { id: 'sep', label: 'Separation (× bond length)', min: 0.8, max: 3.6, step: 0.01, value: 1.4 },
        { id: 'harm', type: 'check', label: 'Show the spring (harmonic) approximation', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }] }
      ], id => {
        if (id === 'pair') { M = bondModel(PAIRS[V.pair] || PAIRS[0], kit.chem); release(); }
        else if (id === 'go' || id === 'E' || id === 'vib') release();
        ctl.show('E', V.vib); ctl.show('sep', !V.vib);
        loop.once();
      });
      const ro = kit.readout(box.side, [['re', 'Bond length rₑ'], ['De', 'Well depth Dₑ'], ['D0', 'Bond energy D₀'], ['k', 'Stiffness k'], ['nu', 'Vibration'], ['r', 'Separation now'], ['V', 'Potential energy now'], ['F', 'Force on each atom']]);
      const V = ctl.values;
      let M = bondModel(PAIRS[p0], kit.chem);
      let r = M.re, v = 0, Etot = 0, broken = false, neutral = false, wait = 0;
      function release() {
        broken = false; neutral = false; wait = 0;
        r = M.re; Etot = -M.De + V.E * M.De;
        v = Math.sqrt(Math.max(0, 2 * V.E * M.De / M.mass));
      }
      function step(dt) {
        if (!V.vib) { r = V.sep * M.re; v = 0; broken = false; return; }
        if (broken) { wait += dt; r += v * dt / 1.5; if (wait > 1.6) release(); return; }
        const n = 60, h = dt / 1.5 / n;               // one vibration period takes about 1.5 s on screen
        for (let i = 0; i < n; i++) {
          v += -0.5 * h * M.dV(r) / M.mass;
          r += h * v;
          if (r < 0.3 * M.re) { r = 0.3 * M.re; v = Math.abs(v); }
          v += -0.5 * h * M.dV(r) / M.mass;
        }
        if (M.P.kind === 'ionic' && r > M.rcross && v > 0) neutral = true;
        if (r > M.xmax * 0.97 && v > 0) { broken = true; wait = 0; }
      }
      function frame(dt) {
        step(dt || 0);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const top = 40, band = Math.min(120, H * 0.27);
        const px0 = 62, px1 = W - 18, py0 = top + band + 18, py1 = H - 34;
        const X = x => px0 + (x - 0) / M.xmax * (px1 - px0);
        const ylo = -1.18 * M.De, yhi = M.ytop;
        const Y = y => py1 - (y - ylo) / (yhi - ylo) * (py1 - py0);
        // title
        kit.label(c, M.P.name, 14, 18, { size: 16, weight: 650 });
        const slow = Math.round(Math.log10(1.5 / M.T));
        kit.label(c, V.vib ? 'slowed down about 10' + String(slow).replace(/\d/g, d => SUP[d]) + ' times' : 'separation set by hand', W - 14, 18, { size: 11.5, color: C.muted, align: 'right' });
        // the atoms, on the same distance scale as the graph
        const ea = kit.chem.el(M.a), eb = kit.chem.el(M.b);
        const rad = (P, e, which) => {
          let pm = P.kind === 'ionic' ? (which ? P.rB : P.rA) : P.kind === 'lj' ? P.rvdw : (e.r || 70);
          return clamp(pm * 0.75 * (px1 - px0) / M.xmax, 6, band * 0.42);
        };
        const ay = top + band / 2, xa = X(0), xb = X(r);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px0, ay); c.lineTo(px1, ay); c.stroke();
        ball(c, xa, ay, rad(M.P, ea, 0), ea.color, M.a + (M.P.kind === 'ionic' && !neutral ? '⁺' : ''), C);
        if (xb < W + 60) ball(c, xb, ay, rad(M.P, eb, 1), eb.color, M.b + (M.P.kind === 'ionic' && !neutral ? '⁻' : ''), C);
        // force arrows (attractive: pointing together)
        const F = -M.dV(r);                             // kJ/mol per pm, + pushes apart
        const Fmax = Math.max(1e-9, Math.abs(M.dV(M.re * 0.9)), Math.abs(M.dV(M.re * 1.2)));
        const flen = clamp(F / Fmax, -1, 1) * 60;
        if (!broken && Math.abs(flen) > 2 && xb < W) {
          kit.arrow(c, xb, ay - band * 0.42 - 4, xb + flen, ay - band * 0.42 - 4, F > 0 ? C.bad : C.ok, 2.5);
          kit.arrow(c, xa, ay - band * 0.42 - 4, xa - flen, ay - band * 0.42 - 4, F > 0 ? C.bad : C.ok, 2.5);
          kit.label(c, F > 0 ? 'repulsion' : 'attraction', (xa + xb) / 2, ay - band * 0.42 - 4, { size: 11, color: F > 0 ? C.bad : C.ok, align: 'center' });
        }
        if (broken) kit.label(c, M.P.kind === 'lj' ? 'the atoms drift apart' : 'bond broken: the atoms fly apart', W / 2, ay + band * 0.45, { size: 13, color: C.warn, align: 'center', weight: 600 });
        else if (neutral) kit.label(c, 'past the crossing the electron jumps back: neutral atoms', W / 2, ay + band * 0.45, { size: 12, color: C.warn, align: 'center' });
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px0, py0); c.lineTo(px0, py1); c.lineTo(px1, py1); c.stroke();
        const sx = Hyper.niceStep ? Hyper.niceStep(M.xmax, 6) : 50;
        for (let x = 0; x <= M.xmax + 1e-9; x += sx) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(x), py0); c.lineTo(X(x), py1); c.stroke();
          kit.label(c, String(Math.round(x)), X(x), py1 + 11, { size: 10.5, color: C.muted, align: 'center' });
        }
        kit.label(c, 'distance between nuclei r (pm)', (px0 + px1) / 2, py1 + 25, { size: 11, color: C.muted, align: 'center' });
        const sy = Hyper.niceStep ? Hyper.niceStep(yhi - ylo, 6) : 100;
        for (let y = Math.ceil(ylo / sy) * sy; y <= yhi + 1e-9; y += sy) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px0, Y(y)); c.lineTo(px1, Y(y)); c.stroke();
          kit.label(c, kit.fmt(y, 3), px0 - 5, Y(y), { size: 10.5, color: C.muted, align: 'right' });
        }
        c.save(); c.translate(14, (py0 + py1) / 2); c.rotate(-Math.PI / 2);
        kit.label(c, 'energy (kJ/mol)', 0, 0, { size: 11, color: C.muted, align: 'center' }); c.restore();
        // reference lines: separated atoms, well bottom, bond length
        c.setLineDash([5, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(px0, Y(0)); c.lineTo(px1, Y(0)); c.stroke();
        c.beginPath(); c.moveTo(X(M.re), py0); c.lineTo(X(M.re), py1); c.stroke();
        c.beginPath(); c.moveTo(px0, Y(-M.De)); c.lineTo(X(M.re) + 60, Y(-M.De)); c.stroke();
        c.setLineDash([]);
        kit.label(c, M.P.kind === 'ionic' ? 'neutral Na + Cl atoms' : 'separated atoms', px1 - 4, Y(0) - 9, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'rₑ', X(M.re) + 4, py0 + 8, { size: 12, color: C.muted });
        kit.arrow(c, X(M.re) + 40, Y(0), X(M.re) + 40, Y(-M.De), C.faint, 1.2);
        kit.label(c, 'Dₑ', X(M.re) + 46, Y(-M.De / 2), { size: 12, color: C.muted });
        if (M.P.kind === 'ionic') {
          c.setLineDash([5, 4]); c.strokeStyle = C.warn;
          c.beginPath(); c.moveTo(px0, Y(M.gap)); c.lineTo(px1, Y(M.gap)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'Na⁺ + Cl⁻ far apart: IE − EA = +' + Math.round(M.gap) + ' kJ/mol', px1 - 4, Y(M.gap) - 9, { size: 11, color: C.warn, align: 'right' });
          kit.dot(c, X(M.rcross), Y(0), 4, C.warn);
          kit.label(c, 'crossing ' + Math.round(M.rcross) + ' pm', X(M.rcross) - 6, Y(0) + 12, { size: 11, color: C.warn, align: 'right' });
        }
        // the curve (and the spring approximation)
        const drawCurve = (fn, color, width, dash) => {
          c.save(); c.beginPath(); c.rect(px0, py0 - 2, px1 - px0, py1 - py0 + 2); c.clip();
          c.strokeStyle = color; c.lineWidth = width; c.setLineDash(dash || []);
          c.beginPath();
          let first = true;
          for (let i = 0; i <= 320; i++) {
            const x = M.xmin + (M.xmax - M.xmin) * i / 320;
            const y = clamp(fn(x), ylo - (yhi - ylo), yhi + (yhi - ylo));
            if (first) { c.moveTo(X(x), Y(y)); first = false; } else c.lineTo(X(x), Y(y));
          }
          c.stroke(); c.restore();
        };
        if (V.harm) drawCurve(x => -M.De + 0.5 * M.kU * (x - M.re) * (x - M.re), C.series[2], 1.8, [6, 4]);
        drawCurve(M.V, C.accent, 2.6);
        // total energy and the current state
        const Vr = M.V(r);
        if (V.vib && !broken) {
          c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(px0, Y(Etot)); c.lineTo(px1, Y(Etot)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'total energy', px0 + 6, Y(Etot) - 9, { size: 11, color: C.warn });
        }
        if (X(r) <= px1 && Y(Vr) >= py0 - 2 && Y(Vr) <= py1 + 2) {
          c.setLineDash([2, 3]); c.strokeStyle = C.faint;
          c.beginPath(); c.moveTo(X(r), ay + band * 0.2); c.lineTo(X(r), Y(Vr)); c.stroke(); c.setLineDash([]);
          kit.dot(c, X(r), Y(Vr), 6, C.warn, C.text);
        }
        // read-outs
        const mol = M.P.kind === 'ionic' ? 'relative to the neutral atoms' : '';
        ro.set('re', kit.fmt(M.re, 4) + ' pm');
        ro.set('De', kit.fmt(M.De, 3) + ' kJ/mol (' + kit.fmt(M.De / KJ_PER_EV, 3) + ' eV)' + (mol ? ' ' + mol : ''));
        ro.set('D0', 'model ' + kit.fmt(M.D0, 3) + ' · measured ' + kit.fmt(M.P.D0, 3) + ' kJ/mol');
        ro.set('k', kit.fmt(M.k, 3) + ' N/m');
        ro.set('nu', kit.fmt(M.we, 3) + ' cm⁻¹ · period ' + kit.fmt(M.T * 1e15, 3) + ' fs');
        ro.set('r', broken ? 'apart' : kit.fmt(r, 4) + ' pm');
        ro.set('V', broken ? '0 (atoms apart)' : kit.fmt(Vr, 3) + ' kJ/mol');
        ro.set('F', broken ? '0' : kit.fmt(F * N_PER_UNIT / 1000, 3) + ' nN ' + (F > 0 ? '(repulsive)' : '(attractive)'));
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      release();
      ctl.show('E', V.vib); ctl.show('sep', !V.vib);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Born–Haber staircase */
  // kJ/mol. Hm, Hx: atomisation; EA: electron affinity (released); EA2: second electron affinity
  // of oxygen (absorbed); IE2: second ionisation energy; Hf: enthalpy of formation. The first
  // ionisation energy comes from kit.chem. Radii: six-coordinate ionic radii (pm).
  const SALTS = [
    { f: 'LiF', m: 'Li', x: 'F', zc: 1, nx: 1, Hm: 159, Hx: 79, EA: 328, Hf: -616, rc: 76, ra: 133, x2: 'F₂(g)' },
    { f: 'NaF', m: 'Na', x: 'F', zc: 1, nx: 1, Hm: 107, Hx: 79, EA: 328, Hf: -576, rc: 102, ra: 133, x2: 'F₂(g)' },
    { f: 'NaCl', m: 'Na', x: 'Cl', zc: 1, nx: 1, Hm: 107, Hx: 121, EA: 349, Hf: -411, rc: 102, ra: 181, x2: 'Cl₂(g)' },
    { f: 'NaBr', m: 'Na', x: 'Br', zc: 1, nx: 1, Hm: 107, Hx: 112, EA: 325, Hf: -361, rc: 102, ra: 196, x2: 'Br₂(l)' },
    { f: 'NaI', m: 'Na', x: 'I', zc: 1, nx: 1, Hm: 107, Hx: 107, EA: 295, Hf: -288, rc: 102, ra: 220, x2: 'I₂(s)' },
    { f: 'KCl', m: 'K', x: 'Cl', zc: 1, nx: 1, Hm: 89, Hx: 121, EA: 349, Hf: -437, rc: 138, ra: 181, x2: 'Cl₂(g)' },
    { f: 'CsCl', m: 'Cs', x: 'Cl', zc: 1, nx: 1, Hm: 76, Hx: 121, EA: 349, Hf: -443, rc: 167, ra: 181, x2: 'Cl₂(g)' },
    { f: 'AgCl', m: 'Ag', x: 'Cl', zc: 1, nx: 1, Hm: 285, Hx: 121, EA: 349, Hf: -127, rc: 115, ra: 181, x2: 'Cl₂(g)' },
    { f: 'AgI', m: 'Ag', x: 'I', zc: 1, nx: 1, Hm: 285, Hx: 107, EA: 295, Hf: -62, rc: 115, ra: 220, x2: 'I₂(s)' },
    { f: 'MgCl2', m: 'Mg', x: 'Cl', zc: 2, nx: 2, Hm: 147, IE2: 1451, Hx: 121, EA: 349, Hf: -641, rc: 72, ra: 181, x2: 'Cl₂(g)' },
    { f: 'CaF2', m: 'Ca', x: 'F', zc: 2, nx: 2, Hm: 178, IE2: 1145, Hx: 79, EA: 328, Hf: -1228, rc: 100, ra: 133, x2: 'F₂(g)' },
    { f: 'MgO', m: 'Mg', x: 'O', zc: 2, nx: 1, za: 2, Hm: 147, IE2: 1451, Hx: 249, EA: 141, EA2: 798, Hf: -602, rc: 72, ra: 140, x2: 'O₂(g)' },
    { f: 'CaO', m: 'Ca', x: 'O', zc: 2, nx: 1, za: 2, Hm: 178, IE2: 1145, Hx: 249, EA: 141, EA2: 798, Hf: -635, rc: 100, ra: 140, x2: 'O₂(g)' }
  ];
  const SUPC = { 1: '⁺', 2: '²⁺' }, SUPA = { 1: '⁻', 2: '²⁻' };
  function cycle(S, chem) {
    const IE1 = chem.el(S.m).ie * KJ_PER_EV;
    const za = S.za || 1, n = S.nx, M = S.m, X = S.x;
    const Xs = (n > 1 ? n : '') + X;
    const el = (n === 1 ? '½' : '') + S.x2;          // one X atom needs half an X₂ molecule
    const e = k => (k > 1 ? k : '') + 'e⁻';
    const steps = [];
    steps.push({ name: 'atomise ' + M, dH: S.Hm, lvl: M + '(g) + ' + el });
    steps.push({ name: '1st ionisation', dH: IE1, lvl: M + '⁺(g) + e⁻ + ' + el });
    if (S.zc === 2) steps.push({ name: '2nd ionisation', dH: S.IE2, lvl: M + '²⁺(g) + 2e⁻ + ' + el });
    steps.push({ name: 'atomise ' + (n > 1 ? n + ' ' : '') + X, dH: n * S.Hx, lvl: M + SUPC[S.zc] + '(g) + ' + e(S.zc) + ' + ' + Xs + '(g)' });
    if (za === 2) {
      steps.push({ name: '1st electron affinity', dH: -S.EA, lvl: M + '²⁺(g) + e⁻ + ' + X + '⁻(g)' });
      steps.push({ name: '2nd electron affinity', dH: S.EA2, lvl: M + '²⁺(g) + ' + X + '²⁻(g)' });
    } else steps.push({ name: (n > 1 ? n + ' × ' : '') + 'electron affinity', dH: -n * S.EA, lvl: M + SUPC[S.zc] + '(g) + ' + (n > 1 ? n : '') + X + '⁻(g)' });
    const up = steps.reduce((s, q) => s + q.dH, 0);
    const U = up - S.Hf;
    const nu = 1 + n, rs = S.rc + S.ra;
    const kap = 120250 * nu * S.zc * za / rs * (1 - 34.5 / rs);
    return { steps, up, U, kap, IE1, start: M + '(s) + ' + el, end: pretty(S.f) + '(s)' };
  }

  Hyper.sim('bond-born-haber', {
    title: 'Born–Haber cycle: the energy staircase of a salt',
    blurb: `Climb from the elements to separate gaseous ions — atomise the metal, ionise it, atomise the non-metal, give it the electrons — then drop into the solid. The drop from the gaseous ions to the solid is the **lattice energy**, and it is the only step nobody can measure: it is whatever closes the loop, because the solid's enthalpy of formation is known (Hess's law). The graph under the staircase compares every salt's cycle value with the purely ionic Kapustinskii estimate.

- Step through NaF → NaCl → NaBr → NaI: the larger the anion, the smaller the drop.
- Try MgO: the second ionisation and the second electron affinity are huge, and the doubly charged lattice pays for both.
- AgCl and AgI sit well above the line on the graph: their bonding is partly covalent, which the ionic model misses.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 360 });
      let i0 = SALTS.findIndex(s => s.f === (params && params.salt));
      if (i0 < 0) i0 = 2;
      const ctl = kit.controls(box.side, [
        { id: 'salt', type: 'select', label: 'Salt', options: SALTS.map((s, i) => [pretty(s.f), i]), value: i0 },
        { id: 'model', type: 'check', label: 'Show the ionic-model estimate', value: true },
        { type: 'buttons', items: [{ id: 'build', label: 'Build step by step', primary: true }, { id: 'all', label: 'Show all' }] }
      ], id => {
        if (id === 'build') { shown = 0; clock = 0; building = true; }
        else if (id === 'all') { building = false; shown = 99; }
        else if (id === 'salt') { building = false; shown = 99; plotAll(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['salt', 'Salt'], ['up', 'Elements → gaseous ions'], ['hf', 'Enthalpy of formation'], ['U', 'Lattice energy (cycle)'], ['kap', 'Ionic model (Kapustinskii)'], ['dev', 'Cycle above the model by']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'ionic model (kJ/mol)', log: true }, y: { label: 'Born–Haber cycle (kJ/mol)', log: true } }, 190);
      const V = ctl.values;
      let shown = 99, clock = 0, building = false;
      function plotAll() {
        const S = SALTS[V.salt] || SALTS[2];
        const pts = SALTS.map(s => { const q = cycle(s, kit.chem); return [q.kap, q.U]; });
        const q = cycle(S, kit.chem);
        plot.set({
          x: { label: 'ionic-model estimate (kJ/mol)', min: 550, max: 4200, log: true },
          y: { label: 'Born–Haber value (kJ/mol)', min: 550, max: 4200, log: true },
          series: [{ pts: [[550, 550], [4200, 4200]], label: 'cycle = model', dash: [5, 4] }, { pts, label: 'salts', dots: 3.5, line: false }],
          marks: [{ x: q.kap, y: q.U, label: pretty(S.f) }]
        });
      }
      function frame(dt) {
        if (building) { clock += dt || 0; if (clock > 0.75) { clock = 0; shown++; if (shown > 8) building = false; } }
        const S = SALTS[V.salt] || SALTS[2];
        const q = cycle(S, kit.chem);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        // energy scale
        let lv = [0], acc = 0;
        for (const s of q.steps) { acc += s.dH; lv.push(acc); }
        const ymax = Math.max(...lv) * 1.06 + 40, ymin = Math.min(S.Hf, 0) * 1.25 - 40;
        const py0 = 34, py1 = H - 16, ax = 58;
        const Y = e => py1 - (e - ymin) / (ymax - ymin) * (py1 - py0);
        kit.label(c, 'Born–Haber cycle for ' + pretty(S.f), 14, 16, { size: 15, weight: 650 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ax, py0); c.lineTo(ax, py1); c.stroke();
        const sy = Hyper.niceStep ? Hyper.niceStep(ymax - ymin, 7) : 500;
        for (let e = Math.ceil(ymin / sy) * sy; e <= ymax; e += sy) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(ax, Y(e)); c.lineTo(W - 10, Y(e)); c.stroke();
          kit.label(c, String(Math.round(e)), ax - 5, Y(e), { size: 10.5, color: C.muted, align: 'right' });
        }
        c.save(); c.translate(13, (py0 + py1) / 2); c.rotate(-Math.PI / 2);
        kit.label(c, 'enthalpy (kJ/mol)', 0, 0, { size: 11, color: C.muted, align: 'center' }); c.restore();
        // levels as a staircase
        const nS = q.steps.length;
        const colW = (W - ax - 24) / (nS + 2);
        const lx = k => ax + 12 + k * colW;
        const level = (k, e, text, color, wide) => {
          const x0 = lx(k), x1 = x0 + colW * (wide || 1.6);
          c.strokeStyle = color || C.text; c.lineWidth = 2.2;
          c.beginPath(); c.moveTo(x0, Y(e)); c.lineTo(Math.min(x1, W - 8), Y(e)); c.stroke();
          kit.label(c, text, x0 + 2, Y(e) - 9, { size: 10.5, color: C.muted });
        };
        level(0, 0, q.start + '   (elements)', C.text, 2.2);
        const show = Math.min(shown, nS + 1);
        for (let k = 0; k < nS && k < show; k++) {
          const s = q.steps[k], e0 = lv[k], e1 = lv[k + 1];
          const x = lx(k + 1) - 6;
          kit.arrow(c, x, Y(e0), x, Y(e1), s.dH > 0 ? C.bad : C.ok, 2.2);
          level(k + 1, e1, s.lvl, C.text);
          kit.label(c, (s.dH > 0 ? '+' : '−') + Math.round(Math.abs(s.dH)), x + 5, (Y(e0) + Y(e1)) / 2, { size: 11.5, weight: 650, color: s.dH > 0 ? C.bad : C.ok });
          kit.label(c, s.name, x + 5, (Y(e0) + Y(e1)) / 2 + 13, { size: 10, color: C.muted });
        }
        // formation (always known) and the lattice drop that closes the loop
        const xf = lx(0) + 10;
        kit.arrow(c, xf, Y(0), xf, Y(S.Hf), C.series[1], 2);
        kit.label(c, 'ΔfH = ' + S.Hf, xf + 6, (Y(0) + Y(S.Hf)) / 2, { size: 11.5, weight: 650, color: C.series[1] });
        level(0, S.Hf, q.end + '   (the salt)', C.series[1], 2.2);
        if (show > nS) {
          const x = lx(nS + 1) - 6;
          kit.arrow(c, x, Y(q.up), x, Y(S.Hf), C.accent, 3.2);
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
          c.beginPath(); c.moveTo(lx(0) + colW * 2.2, Y(S.Hf)); c.lineTo(x, Y(S.Hf)); c.stroke(); c.setLineDash([]);
          kit.label(c, '−Uₗ = −' + Math.round(q.U), x + 6, (Y(q.up) + Y(S.Hf)) / 2, { size: 13, weight: 700, color: C.accent });
          kit.label(c, 'lattice energy', x + 6, (Y(q.up) + Y(S.Hf)) / 2 + 15, { size: 10.5, color: C.accent });
          if (V.model) {
            const yk = Y(q.up - q.kap);
            c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.6;
            c.beginPath(); c.moveTo(x - 30, yk); c.lineTo(Math.min(W - 8, x + 60), yk); c.stroke(); c.setLineDash([]);
            kit.label(c, 'ionic model lands here', Math.min(W - 8, x + 60), yk + 11, { size: 10.5, color: C.warn, align: 'right' });
          }
        }
        ro.set('salt', pretty(S.f) + ' · ' + S.zc + '+ / ' + (S.za || 1) + '− ions');
        ro.set('up', '+' + Math.round(q.up) + ' kJ/mol');
        ro.set('hf', S.Hf + ' kJ/mol');
        ro.set('U', Math.round(q.U) + ' kJ/mol');
        ro.set('kap', Math.round(q.kap) + ' kJ/mol (r₊ ' + S.rc + ' pm, r₋ ' + S.ra + ' pm)');
        const dev = (q.U - q.kap) / q.kap * 100;
        ro.set('dev', (dev >= 0 ? '+' : '−') + Math.abs(dev).toFixed(0) + ' %' + (dev > 15 ? ': covalent character' : ''));
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      plotAll();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Lewis-structure trainer */
  // atoms: [symbol, x, y] in bond lengths (y down); bonds: skeleton; forms: the accepted structures,
  // rank 0 = best (equivalent resonance forms share it), 1 = minor contributor, 2 = poor
  const LEWIS = [
    { id: 'H2O', name: 'water', f: 'H₂O', q: 0, atoms: [['O', 0, 0], ['H', -0.8, 0.62], ['H', 0.8, 0.62]], bonds: [[0, 1], [0, 2]], forms: [{ b: [1, 1], lp: [2, 0, 0], rank: 0 }] },
    { id: 'NH3', name: 'ammonia', f: 'NH₃', q: 0, atoms: [['N', 0, 0], ['H', -1, 0.35], ['H', 1, 0.35], ['H', 0, 1.05]], bonds: [[0, 1], [0, 2], [0, 3]], forms: [{ b: [1, 1, 1], lp: [1, 0, 0, 0], rank: 0 }] },
    { id: 'CH2O', name: 'methanal (formaldehyde)', f: 'CH₂O', q: 0, atoms: [['C', 0, 0.2], ['O', 0, -1], ['H', -0.95, 0.8], ['H', 0.95, 0.8]], bonds: [[0, 1], [0, 2], [0, 3]], forms: [{ b: [2, 1, 1], lp: [0, 2, 0, 0], rank: 0 }] },
    { id: 'CO2', name: 'carbon dioxide', f: 'CO₂', q: 0, atoms: [['C', 0, 0], ['O', -1.3, 0], ['O', 1.3, 0]], bonds: [[0, 1], [0, 2]], forms: [{ b: [2, 2], lp: [0, 2, 2], rank: 0 }, { b: [3, 1], lp: [0, 1, 3], rank: 2 }] },
    { id: 'HCN', name: 'hydrogen cyanide', f: 'HCN', q: 0, atoms: [['C', 0, 0], ['H', -1.2, 0], ['N', 1.25, 0]], bonds: [[0, 1], [0, 2]], forms: [{ b: [1, 3], lp: [0, 0, 1], rank: 0 }] },
    { id: 'N2', name: 'nitrogen', f: 'N₂', q: 0, atoms: [['N', -0.65, 0], ['N', 0.65, 0]], bonds: [[0, 1]], forms: [{ b: [3], lp: [1, 1], rank: 0 }] },
    { id: 'CO', name: 'carbon monoxide', f: 'CO', q: 0, atoms: [['C', -0.65, 0], ['O', 0.65, 0]], bonds: [[0, 1]], forms: [{ b: [3], lp: [1, 1], rank: 0 }] },
    { id: 'O3', name: 'ozone', f: 'O₃', q: 0, atoms: [['O', 0, -0.3], ['O', -1.1, 0.4], ['O', 1.1, 0.4]], bonds: [[0, 1], [0, 2]], forms: [{ b: [2, 1], lp: [1, 2, 3], rank: 0 }, { b: [1, 2], lp: [1, 3, 2], rank: 0 }] },
    { id: 'NO3-', name: 'nitrate ion', f: 'NO₃⁻', q: -1, atoms: [['N', 0, 0], ['O', 0, -1.25], ['O', -1.08, 0.62], ['O', 1.08, 0.62]], bonds: [[0, 1], [0, 2], [0, 3]],
      forms: [{ b: [2, 1, 1], lp: [0, 2, 3, 3], rank: 0 }, { b: [1, 2, 1], lp: [0, 3, 2, 3], rank: 0 }, { b: [1, 1, 2], lp: [0, 3, 3, 2], rank: 0 }] },
    { id: 'CO3^2-', name: 'carbonate ion', f: 'CO₃²⁻', q: -2, atoms: [['C', 0, 0], ['O', 0, -1.25], ['O', -1.08, 0.62], ['O', 1.08, 0.62]], bonds: [[0, 1], [0, 2], [0, 3]],
      forms: [{ b: [2, 1, 1], lp: [0, 2, 3, 3], rank: 0 }, { b: [1, 2, 1], lp: [0, 3, 2, 3], rank: 0 }, { b: [1, 1, 2], lp: [0, 3, 3, 2], rank: 0 }] },
    { id: 'OCN-', name: 'cyanate ion', f: 'OCN⁻', q: -1, atoms: [['C', 0, 0], ['O', -1.3, 0], ['N', 1.3, 0]], bonds: [[0, 1], [0, 2]],
      forms: [{ b: [1, 3], lp: [0, 3, 1], rank: 0 }, { b: [2, 2], lp: [0, 2, 2], rank: 1 }, { b: [3, 1], lp: [0, 1, 3], rank: 2 }] },
    { id: 'N2O', name: 'dinitrogen monoxide', f: 'N₂O', q: 0, atoms: [['N', 0, 0], ['N', -1.3, 0], ['O', 1.3, 0]], bonds: [[0, 1], [0, 2]],
      forms: [{ b: [3, 1], lp: [0, 1, 3], rank: 0 }, { b: [2, 2], lp: [0, 2, 2], rank: 1 }, { b: [1, 3], lp: [0, 3, 1], rank: 2 }] },
    { id: 'NH4+', name: 'ammonium ion', f: 'NH₄⁺', q: 1, atoms: [['N', 0, 0], ['H', 0, -1.05], ['H', 1.05, 0], ['H', 0, 1.05], ['H', -1.05, 0]], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]], forms: [{ b: [1, 1, 1, 1], lp: [0, 0, 0, 0, 0], rank: 0 }] },
    { id: 'BF3', name: 'boron trifluoride', f: 'BF₃', q: 0, atoms: [['B', 0, 0], ['F', 0, -1.25], ['F', -1.08, 0.62], ['F', 1.08, 0.62]], bonds: [[0, 1], [0, 2], [0, 3]], forms: [{ b: [1, 1, 1], lp: [0, 3, 3, 3], rank: 0 }] },
    { id: 'C2H4', name: 'ethene', f: 'C₂H₄', q: 0, atoms: [['C', -0.65, 0], ['C', 0.65, 0], ['H', -1.25, -0.85], ['H', -1.25, 0.85], ['H', 1.25, -0.85], ['H', 1.25, 0.85]], bonds: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]], forms: [{ b: [2, 1, 1, 1, 1], lp: [0, 0, 0, 0, 0, 0], rank: 0 }] }
  ];
  const valence = sym => { const g = Hyper.chem.el(sym).group; return g <= 2 ? g : g - 10; };
  const chargeText = q => q === 0 ? '0' : (q > 0 ? '+' : '−') + (Math.abs(q) > 1 ? Math.abs(q) : '');
  const DEFICIENT = new Set(['B', 'Be', 'Al']);

  Hyper.sim('bond-lewis', {
    title: 'Lewis-structure trainer',
    blurb: `Build Lewis structures by hand or let the recipe run one step at a time. **Click a bond** to make it single → double → triple, **click an atom** to add a lone pair (after four it starts again at none). The rings show each atom's octet (green: complete; amber: short; red: too many), and the badges its formal charge.

- Press **Next step** repeatedly: count the electrons, fill the outer atoms, put the rest on the centre, then share lone pairs as multiple bonds.
- Draw CO₂ as O≡C–O: it has complete octets but formal charges of +1 and −1. O=C=O has none.
- Take OCN⁻ or N₂O and compare their structures with **Show best**: formal charges choose, and negative charge prefers the more electronegative atom.
- NO₃⁻, CO₃²⁻ and O₃ have several equivalent structures: keep pressing **Show best** to cycle through the resonance forms.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      let i0 = LEWIS.findIndex(m => m.id === (params && params.mol));
      if (i0 < 0) i0 = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: LEWIS.map((m, i) => [m.f + ' · ' + m.name, i]), value: i0 },
        { type: 'buttons', items: [{ id: 'next', label: 'Next step', primary: true }, { id: 'reset', label: 'Start again' }, { id: 'best', label: 'Show best' }] },
        { type: 'html', html: 'Click a bond to change its order; click an atom to add a lone pair.' }
      ], id => {
        if (id === 'mol') { mol = LEWIS[V.mol] || LEWIS[0]; reset(); }
        else if (id === 'reset') reset();
        else if (id === 'next') next();
        else if (id === 'best') showBest();
        loop.once();
      });
      const ro = kit.readout(box.side, [['A', 'Valence electrons'], ['drawn', 'Electrons drawn'], ['oct', 'Octets'], ['fc', 'Formal charges'], ['ver', 'Verdict']]);
      const V = ctl.values;
      let mol = LEWIS[i0], b = [], lp = [], stage = 0, msg = '', formIx = -1;
      const n = () => mol.atoms.length;
      const sym = i => mol.atoms[i][0];
      const isH = i => sym(i) === 'H';
      const deg = i => mol.bonds.reduce((s, [p, q]) => s + (p === i || q === i ? 1 : 0), 0);
      const bondSum = (i, bb) => mol.bonds.reduce((s, [p, q], k) => s + (p === i || q === i ? bb[k] : 0), 0);
      const elec = (i, bb, ll) => 2 * bondSum(i, bb) + 2 * ll[i];
      const fc = (i, bb, ll) => valence(sym(i)) - 2 * ll[i] - bondSum(i, bb);
      const A = () => mol.atoms.reduce((s, a) => s + valence(a[0]), 0) - mol.q;
      const drawn = (bb, ll) => 2 * bb.reduce((s, x) => s + x, 0) + 2 * ll.reduce((s, x) => s + x, 0);
      const target = i => isH(i) ? 2 : 8;
      // lower is better: formal charges first, then negative charge on electronegative atoms
      const score = (bb, ll) => {
        let s = 0;
        for (let i = 0; i < n(); i++) {
          const f = fc(i, bb, ll);
          s += 10 * Math.abs(f);
          if (f < 0) s += (4 - Hyper.chem.el(sym(i)).en) * Math.abs(f);
          if (f > 0) s += (Hyper.chem.el(sym(i)).en - 2) * f * 0.5;
        }
        return s;
      };
      const matchForm = () => mol.forms.findIndex(F => F.b.every((x, k) => x === b[k]) && F.lp.every((x, k) => x === lp[k]));
      const fcList = (bb, ll) => {
        const out = [];
        for (let i = 0; i < n(); i++) { const f = fc(i, bb, ll); if (f) out.push(sym(i) + ' ' + chargeText(f)); }
        return out.length ? out.join(', ') : 'all zero';
      };
      function reset() {
        b = mol.bonds.map(() => 1); lp = mol.atoms.map(() => 0); stage = 0; formIx = -1;
        const parts = {};
        mol.atoms.forEach(a => { parts[a[0]] = (parts[a[0]] || 0) + 1; });
        const sum = Object.entries(parts).map(([s, k]) => (k > 1 ? k + ' × ' : '') + valence(s) + ' (' + s + ')').join(' + ');
        const qTxt = mol.q ? (mol.q < 0 ? ' + ' + (-mol.q) + ' for the negative charge' : ' − ' + mol.q + ' for the positive charge') : '';
        msg = 'Step 1 — count the valence electrons: ' + sum + qTxt + ' = ' + A() + '. The skeleton\'s ' + mol.bonds.length + ' single bond' + (mol.bonds.length > 1 ? 's use ' : ' uses ') + (2 * mol.bonds.length) + ', leaving ' + (A() - 2 * mol.bonds.length) + '.';
      }
      function next() {
        if (stage < 0) reset();
        let left = A() - drawn(b, lp);
        if (stage === 0) {
          const outer = [];
          for (let i = 0; i < n(); i++) if (!isH(i) && deg(i) === 1) {
            while (left >= 2 && elec(i, b, lp) < 8) { lp[i]++; left -= 2; }
            outer.push(sym(i));
          }
          stage = 1;
          msg = outer.length ? 'Step 2 — complete the outer atoms (' + outer.join(', ') + ') with lone pairs, up to eight electrons each. ' + left + ' electron' + (left === 1 ? '' : 's') + ' left.' : 'Step 2 — no outer atoms except hydrogen, which is already complete with one bond. ' + left + ' electrons left.';
        } else if (stage === 1) {
          const got = [];
          for (let i = 0; i < n() && left >= 2; i++) if (!isH(i) && deg(i) > 1) {
            while (left >= 2 && elec(i, b, lp) < 8) { lp[i]++; left -= 2; got.push(sym(i)); }
          }
          for (let i = 0; i < n() && left >= 2; i++) if (!isH(i)) { while (left >= 2 && elec(i, b, lp) < 8) { lp[i]++; left -= 2; got.push(sym(i)); } }
          stage = 2;
          msg = got.length ? 'Step 3 — put the remaining electrons on the central atom as lone pairs (' + got.length + ' pair' + (got.length > 1 ? 's' : '') + ').' : 'Step 3 — nothing is left over for the central atom.';
        } else if (stage === 2) {
          let moves = 0, skipped = '';
          for (let it = 0; it < 12; it++) {
            let short = -1;
            for (let i = 0; i < n(); i++) if (!isH(i) && elec(i, b, lp) < 8) {
              if (DEFICIENT.has(sym(i))) { skipped = sym(i); continue; }
              short = i; break;
            }
            if (short < 0) break;
            let best = null;
            mol.bonds.forEach(([p, q], k) => {
              if (p !== short && q !== short) return;
              const j = p === short ? q : p;
              if (lp[j] < 1 || b[k] >= 3) return;
              const bb = b.slice(), ll = lp.slice();
              bb[k]++; ll[j]--;
              const s = score(bb, ll);
              if (!best || s < best.s - 1e-9) best = { s, bb, ll };
            });
            if (!best) break;
            b = best.bb; lp = best.ll; moves++;
          }
          stage = 3;
          if (moves) msg = 'Step 4 — an atom was short of eight, so ' + (moves > 1 ? moves + ' lone pairs of its neighbours were shared as extra bonds (multiple bonds).' : 'one lone pair of a neighbour was shared to make a double bond.');
          else if (skipped) msg = 'Step 4 — ' + skipped + ' has only six electrons around it. Sharing a fluorine lone pair would complete its octet but put +1 on fluorine, so boron compounds accept the gap (and readily take a lone pair from a donor such as NH₃).';
          else msg = 'Step 4 — every atom already has a full shell: no multiple bonds needed.';
        } else if (stage === 3) {
          const k = matchForm();
          stage = 4;
          if (k >= 0 && mol.forms[k].rank === 0) {
            formIx = k;
            msg = 'Step 5 — check the formal charges: ' + fcList(b, lp) + '. This is the best structure' + (mol.forms.filter(F => F.rank === 0).length > 1 ? ', and there are equivalent ones: press Show best to see the other resonance forms.' : '.');
          } else {
            const prev = fcList(b, lp);
            formIx = 0; b = mol.forms[0].b.slice(); lp = mol.forms[0].lp.slice();
            msg = 'Step 5 — the formal charges (' + prev + ') can be smaller: moving pairs gives ' + fcList(b, lp) + ', the better structure shown now.';
          }
        } else showBest();
      }
      function showBest() {
        const k = matchForm();
        formIx = k >= 0 ? (k + 1) % mol.forms.length : 0;
        b = mol.forms[formIx].b.slice(); lp = mol.forms[formIx].lp.slice(); stage = 5;
        const F = mol.forms[formIx], eq = mol.forms.filter(G => G.rank === 0).length;
        msg = (F.rank === 0 ? (eq > 1 ? 'One of ' + eq + ' equivalent resonance structures' : 'The best structure') : F.rank === 1 ? 'A minor resonance contributor' : 'A poor structure: octets complete, but large or misplaced formal charges') + ' — formal charges: ' + fcList(b, lp) + '.' + (mol.forms.length > 1 ? ' Press again for the next.' : '');
      }
      function verdict() {
        const a = A(), d = drawn(b, lp);
        if (d < a) return [a - d + ' electron' + (a - d > 1 ? 's' : '') + ' still to place', 'warn'];
        if (d > a) return [d - a + ' electron' + (d - a > 1 ? 's' : '') + ' too many', 'bad'];
        for (let i = 0; i < n(); i++) {
          const e = elec(i, b, lp);
          if (isH(i) && e !== 2) return ['hydrogen makes exactly one bond', 'bad'];
          if (!isH(i) && e > 8 && Hyper.chem.el(sym(i)).period === 2) return [sym(i) + ' has ' + e + ' electrons: a second-period atom holds at most 8', 'bad'];
        }
        const short = [];
        for (let i = 0; i < n(); i++) if (elec(i, b, lp) < target(i) && !(DEFICIENT.has(sym(i)) && elec(i, b, lp) === 6)) short.push(sym(i) + ' (' + elec(i, b, lp) + ')');
        if (short.length) return ['short of an octet: ' + short.join(', '), 'warn'];
        const k = matchForm();
        if (k >= 0) return [mol.forms[k].rank === 0 ? 'correct: the best structure' + (mol.forms.filter(F => F.rank === 0).length > 1 ? ' (one resonance form)' : '') : mol.forms[k].rank === 1 ? 'valid: a minor contributor' : 'valid octets, poor formal charges', mol.forms[k].rank === 0 ? 'ok' : 'warn'];
        const sBest = score(mol.forms[0].b, mol.forms[0].lp), s = score(b, lp);
        return [s <= sBest + 1e-9 ? 'valid structure' : 'valid octets, but the formal charges could be smaller', s <= sBest + 1e-9 ? 'ok' : 'warn'];
      }
      // layout
      let P = [], R = 17;
      function layout() {
        const xs = mol.atoms.map(a => a[1]), ys = mol.atoms.map(a => a[2]);
        const w = Math.max(...xs) - Math.min(...xs) + 2.2, h = Math.max(...ys) - Math.min(...ys) + 2.2;
        const areaH = st.H - 130;
        const u = Math.min((st.W - 40) / w, areaH / h, 95);
        const cx = st.W / 2 - (Math.max(...xs) + Math.min(...xs)) / 2 * u, cy = 44 + areaH / 2 - (Math.max(...ys) + Math.min(...ys)) / 2 * u;
        P = mol.atoms.map(a => ({ x: cx + a[1] * u, y: cy + a[2] * u }));
        R = clamp(u * 0.2, 13, 19);
      }
      function hitAtom(p) { for (let i = 0; i < P.length; i++) if (Math.hypot(p.x - P[i].x, p.y - P[i].y) < R + 4) return i; return -1; }
      function hitBond(p) {
        let best = -1, bd = 9;
        mol.bonds.forEach(([i, j], k) => {
          const A0 = P[i], B0 = P[j], dx = B0.x - A0.x, dy = B0.y - A0.y, L2 = dx * dx + dy * dy || 1;
          const t = clamp(((p.x - A0.x) * dx + (p.y - A0.y) * dy) / L2, 0, 1);
          if (t < 0.15 || t > 0.85) return;
          const d = Math.hypot(p.x - A0.x - t * dx, p.y - A0.y - t * dy);
          if (d < bd) { bd = d; best = k; }
        });
        return best;
      }
      kit.click(st, p => {
        layout();
        const i = hitAtom(p);
        if (i >= 0) {
          if (isH(i)) msg = 'Hydrogen has room for only two electrons — its one bond — so it never carries a lone pair.';
          else { lp[i] = (lp[i] + 1) % 5; stage = -1; msg = 'Your structure: ' + verdict()[0] + '.'; }
          loop.once(); return;
        }
        const k = hitBond(p);
        if (k >= 0) { b[k] = b[k] % 3 + 1; stage = -1; msg = 'Your structure: ' + verdict()[0] + '.'; loop.once(); }
      }, p => { layout(); return hitAtom(p) >= 0 || hitBond(p) >= 0; });

      function wrap(c, text, x, y, maxW, lineH) {
        c.font = '12.5px system-ui, sans-serif';
        const words = text.split(' '), lines = [];
        let cur = '';
        for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
        if (cur) lines.push(cur);
        return lines.slice(0, 5);
      }
      function frame() {
        layout();
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        kit.label(c, 'Lewis structure of ' + mol.name + ', ' + mol.f, 14, 18, { size: 15, weight: 650 });
        // bonds
        mol.bonds.forEach(([i, j], k) => {
          const A0 = P[i], B0 = P[j], dx = B0.x - A0.x, dy = B0.y - A0.y, L = Math.hypot(dx, dy) || 1;
          const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
          c.strokeStyle = C.text; c.lineWidth = 2.6; c.lineCap = 'round';
          for (let m = 0; m < b[k]; m++) {
            const off = (m - (b[k] - 1) / 2) * 6.5;
            c.beginPath();
            c.moveTo(A0.x + ux * (R + 3) + nx * off, A0.y + uy * (R + 3) + ny * off);
            c.lineTo(B0.x - ux * (R + 3) + nx * off, B0.y - uy * (R + 3) + ny * off);
            c.stroke();
          }
        });
        // atoms, octet rings, lone pairs, formal charges
        for (let i = 0; i < n(); i++) {
          const p = P[i], e = elec(i, b, lp), tg = target(i);
          const ok = e === tg || (DEFICIENT.has(sym(i)) && e === 6);
          c.beginPath(); c.arc(p.x, p.y, R + 4, 0, Math.PI * 2);
          c.strokeStyle = e > tg ? C.bad : ok ? C.ok : C.warn; c.lineWidth = 2; c.stroke();
          const el = kit.chem.el(sym(i));
          ball(c, p.x, p.y, R, el.color, sym(i), C);
          // lone-pair directions: as far as possible from the bonds and from each other
          const taken = [];
          mol.bonds.forEach(([a0, b0]) => { if (a0 === i || b0 === i) { const j = a0 === i ? b0 : a0; taken.push(Math.atan2(P[j].y - p.y, P[j].x - p.x)); } });
          const angDist = (a, b2) => { let d = Math.abs(a - b2) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d; };
          for (let m = 0; m < lp[i]; m++) {
            let bestA = -Math.PI / 2, bestD = -1;
            for (let s = 0; s < 72; s++) {
              const a = -Math.PI / 2 + s * Math.PI / 36;
              const d = taken.length ? Math.min(...taken.map(t => angDist(a, t))) : 10 - Math.abs(angDist(a, -Math.PI / 2));
              if (d > bestD + 1e-6) { bestD = d; bestA = a; }
            }
            taken.push(bestA);
            const rx = p.x + Math.cos(bestA) * (R + 10), ry = p.y + Math.sin(bestA) * (R + 10);
            const tx = -Math.sin(bestA) * 4, ty = Math.cos(bestA) * 4;
            kit.dot(c, rx + tx, ry + ty, 2.6, C.text); kit.dot(c, rx - tx, ry - ty, 2.6, C.text);
          }
          const f = fc(i, b, lp);
          if (f) {
            const bx = p.x + R * 0.95, by = p.y - R * 0.95;
            c.beginPath(); c.arc(bx, by, 8.5, 0, Math.PI * 2); c.fillStyle = f > 0 ? C.bad : C.accent; c.fill();
            kit.label(c, chargeText(f), bx, by + 0.5, { size: 11, weight: 700, color: '#fff', align: 'center' });
          }
        }
        // brackets for an ion
        if (mol.q) {
          const xs = P.map(p => p.x), ys = P.map(p => p.y);
          const x0 = Math.min(...xs) - R - 22, x1 = Math.max(...xs) + R + 22, y0 = Math.min(...ys) - R - 22, y1 = Math.max(...ys) + R + 22;
          c.strokeStyle = C.muted; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(x0 + 8, y0); c.lineTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x0 + 8, y1); c.stroke();
          c.beginPath(); c.moveTo(x1 - 8, y0); c.lineTo(x1, y0); c.lineTo(x1, y1); c.lineTo(x1 - 8, y1); c.stroke();
          kit.label(c, (Math.abs(mol.q) > 1 ? Math.abs(mol.q) : '') + (mol.q > 0 ? '+' : '−'), x1 + 4, y0 + 2, { size: 14, weight: 700, color: C.muted });
        }
        // the step message
        const bxY = H - 84;
        c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.rect(10, bxY, W - 20, 74); c.fill(); c.stroke();
        const lines = wrap(c, msg, 20, bxY + 16, W - 44, 16);
        lines.forEach((t, k) => kit.label(c, t, 20, bxY + 15 + k * 16, { size: 12.5, color: C.text }));
        // read-outs
        const a = A(), d = drawn(b, lp);
        ro.set('A', String(a));
        ro.set('drawn', d + (d === a ? ' ✓' : d < a ? ' (' + (a - d) + ' to go)' : ' (' + (d - a) + ' too many)'));
        const shortN = mol.atoms.filter((_, i) => elec(i, b, lp) < target(i) && !(DEFICIENT.has(sym(i)) && elec(i, b, lp) === 6)).length;
        const overN = mol.atoms.filter((_, i) => elec(i, b, lp) > target(i)).length;
        ro.set('oct', overN ? overN + ' atom' + (overN > 1 ? 's' : '') + ' over' : shortN ? shortN + ' atom' + (shortN > 1 ? 's' : '') + ' short' : 'all complete');
        ro.set('fc', fcList(b, lp));
        ro.set('ver', verdict()[0]);
      }
      const loop = kit.loop(() => frame(), box.stage);
      reset();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ polarity: a bond, then a molecule */
  // measured gas-phase dipole moments (D) and bond lengths (pm) of diatomic molecules
  const DIATOMIC = {
    'F|H': [1.83, 91.7], 'Cl|H': [1.11, 127.5], 'Br|H': [0.83, 141.4], 'H|I': [0.45, 160.9], 'H|Li': [5.88, 159.6],
    'Cl|Na': [9.00, 236.1], 'Cl|K': [10.27, 266.7], 'F|Li': [6.33, 156.4], 'F|Na': [8.16, 192.6], 'Cs|F': [7.88, 234.5], 'Cl|F': [0.89, 162.8], 'Br|Cl': [0.52, 213.6]
  };
  const pairKey = (a, b) => [a, b].sort().join('|');
  const ELEMS = ['H', 'Li', 'B', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'K', 'Ca', 'Br', 'I', 'Cs', 'Ag'];
  const D_PER_EN = 1.2;          // the simple model: a bond moment of 1.2 D per unit of electronegativity difference
  const deg2 = Math.PI / 180;
  // geometry builders (Å, degrees): real bond lengths and angles
  function around(center, ligs) { return { atoms: [{ el: center, x: 0, y: 0, z: 0 }].concat(ligs.map(l => ({ el: l[0], x: l[1][0], y: l[1][1], z: l[1][2] }))), bonds: ligs.map((l, i) => [0, i + 1, l[2] || 1]), lone: [] }; }
  const pyr = (d, ang, k, up) => {        // three bonds around the −y axis (or +y), bond angle ang
    const cb = Math.sqrt(Math.max(0, (2 * Math.cos(ang * deg2) + 1) / 3)), sb = Math.sqrt(1 - cb * cb), ph = k * 2 * Math.PI / 3;
    return [d * sb * Math.cos(ph), (up ? 1 : -1) * d * cb, d * sb * Math.sin(ph)];
  };
  const TETRA = [[0, 1, 0], [0.9428, -0.3333, 0], [-0.4714, -0.3333, 0.8165], [-0.4714, -0.3333, -0.8165]];
  const MOL3 = [
    { id: 'HCl', f: 'HCl', mu: 1.11, shape: 'linear', build: () => ({ atoms: [{ el: 'H', x: -0.6375, y: 0, z: 0 }, { el: 'Cl', x: 0.6375, y: 0, z: 0 }], bonds: [[0, 1, 1]], lone: [] }) },
    { id: 'CO2', f: 'CO₂', mu: 0, shape: 'linear', build: () => around('C', [['O', [-1.16, 0, 0], 2], ['O', [1.16, 0, 0], 2]]) },
    { id: 'H2O', f: 'H₂O', mu: 1.85, shape: 'bent, 104.5°', build: () => { const h = 104.5 / 2 * deg2, d = 0.958; const m = around('O', [['H', [d * Math.sin(h), -d * Math.cos(h), 0]], ['H', [-d * Math.sin(h), -d * Math.cos(h), 0]]]); m.lone = [{ atom: 0, dir: [0, 0.58, 0.81] }, { atom: 0, dir: [0, 0.58, -0.81] }]; return m; } },
    { id: 'SO2', f: 'SO₂', mu: 1.63, shape: 'bent, 119°', note: 'the S=O bonds and the lone pair on sulfur add more than the simple model counts', build: () => { const h = 119.3 / 2 * deg2, d = 1.431; const m = around('S', [['O', [d * Math.sin(h), -d * Math.cos(h), 0], 2], ['O', [-d * Math.sin(h), -d * Math.cos(h), 0], 2]]); m.lone = [{ atom: 0, dir: [0, 1, 0] }]; return m; } },
    { id: 'NH3', f: 'NH₃', mu: 1.47, shape: 'trigonal pyramidal, 106.7°', note: 'the lone pair on nitrogen adds to the bond dipoles', build: () => { const m = around('N', [0, 1, 2].map(k => ['H', pyr(1.012, 106.7, k)])); m.lone = [{ atom: 0, dir: [0, 1, 0] }]; return m; } },
    { id: 'NF3', f: 'NF₃', mu: 0.23, shape: 'trigonal pyramidal, 102°', note: 'the lone pair on nitrogen points the other way and almost cancels the N–F dipoles', build: () => { const m = around('N', [0, 1, 2].map(k => ['F', pyr(1.365, 102.2, k)])); m.lone = [{ atom: 0, dir: [0, 1, 0] }]; return m; } },
    { id: 'BF3', f: 'BF₃', mu: 0, shape: 'trigonal planar', build: () => around('B', [0, 1, 2].map(k => ['F', [1.307 * Math.cos(k * 2 * Math.PI / 3 + Math.PI / 2), 1.307 * Math.sin(k * 2 * Math.PI / 3 + Math.PI / 2), 0]])) },
    { id: 'CH4', f: 'CH₄', mu: 0, shape: 'tetrahedral', build: () => around('C', TETRA.map(t => ['H', mul3(t, 1.087)])) },
    { id: 'CH3Cl', f: 'CH₃Cl', mu: 1.87, shape: 'tetrahedral (distorted)', note: 'the C–Cl bond is more polar than the electronegativity difference suggests', build: () => around('C', [['Cl', [0, -1.785, 0]]].concat([0, 1, 2].map(k => ['H', pyr(1.090, 110.5, k, true)]))) },
    { id: 'CH2Cl2', f: 'CH₂Cl₂', mu: 1.60, shape: 'tetrahedral (distorted)', note: 'the C–Cl bonds are more polar than the simple model counts', build: () => { const a = 112 / 2 * deg2, h = 111.8 / 2 * deg2; return around('C', [['Cl', [1.765 * Math.sin(a), -1.765 * Math.cos(a), 0]], ['Cl', [-1.765 * Math.sin(a), -1.765 * Math.cos(a), 0]], ['H', [0, 1.087 * Math.cos(h), 1.087 * Math.sin(h)]], ['H', [0, 1.087 * Math.cos(h), -1.087 * Math.sin(h)]]]); } },
    { id: 'CHCl3', f: 'CHCl₃', mu: 1.04, shape: 'tetrahedral (distorted)', build: () => around('C', [['H', [0, 1.100, 0]]].concat([0, 1, 2].map(k => ['Cl', pyr(1.758, 111.3, k)]))) },
    { id: 'CCl4', f: 'CCl₄', mu: 0, shape: 'tetrahedral', build: () => around('C', TETRA.map(t => ['Cl', mul3(t, 1.766)])) },
    { id: 'cis', f: 'cis-C₂H₂Cl₂', mu: 1.90, shape: 'planar, both Cl on one side', build: () => dce(true) },
    { id: 'trans', f: 'trans-C₂H₂Cl₂', mu: 0, shape: 'planar, Cl on opposite sides', build: () => dce(false) }
  ];
  // 1,2-dichloroethene: C=C 133 pm, C–Cl 172 pm, C–H 108 pm, angles about 123° (C=C–Cl) and 120° (C=C–H)
  function dce(cis) {
    // directions measured from +x in the molecular plane: from C1 the other carbon lies at 0°, from C2 at 180°
    const at = (c, a, d) => [c[0] + d * Math.cos(a * deg2), c[1] + d * Math.sin(a * deg2), 0];
    const c1 = [-0.666, 0, 0], c2 = [0.666, 0, 0];
    const cl1 = at(c1, 123.6, 1.72), h1 = at(c1, -120, 1.08);
    const cl2 = at(c2, cis ? 56.4 : -56.4, 1.72), h2 = at(c2, cis ? -60 : 60, 1.08);
    const atoms = [c1, c2, cl1, h1, cl2, h2];
    const els = ['C', 'C', 'Cl', 'H', 'Cl', 'H'];
    return { atoms: atoms.map((p, i) => ({ el: els[i], x: p[0], y: p[1], z: p[2] })), bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]], lone: [] };
  }
  function bondDipoles(m, chem) {
    const out = [];
    for (const [i, j] of m.bonds) {
      const a = m.atoms[i], b = m.atoms[j], ea = chem.el(a.el).en, eb = chem.el(b.el).en;
      if (ea == null || eb == null) continue;
      const neg = eb > ea ? j : i, pos = neg === j ? i : j;
      const P0 = m.atoms[pos], N0 = m.atoms[neg];
      const u = unit3([N0.x - P0.x, N0.y - P0.y, N0.z - P0.z]);
      out.push({ pos, neg, mag: D_PER_EN * Math.abs(eb - ea), u, dEN: Math.abs(eb - ea) });
    }
    const net = out.reduce((s, q) => add3(s, mul3(q.u, q.mag)), [0, 0, 0]);
    return { list: out, net, netMag: len3(net) };
  }

  Hyper.sim('bond-polarity', {
    title: 'Polarity: from one bond to a whole molecule',
    blurb: `**Two atoms:** pick any pair. The more electronegative atom pulls the shared electrons towards itself; the cloud shifts, partial charges appear and the bond gets a dipole moment. Where the molecule has been measured, its real dipole is shown too; the graph compares measured ionic character with Pauling's curve.

**Molecules in 3-D:** each bond dipole is an amber arrow (drawn the chemists' way, from δ+ towards δ−, with a simple bond moment of 1.2 D per unit of electronegativity difference); the thick arrow is their vector sum. Drag to turn the molecule.

- CO₂, BF₃, CH₄ and CCl₄ have polar bonds but cancel exactly; H₂O, NH₃ and SO₂ do not.
- Walk from CCl₄ to CHCl₃, CH₂Cl₂ and CH₃Cl, and compare cis- with trans-dichloroethene: same bonds, different shapes.
- NF₃ is the surprise: the bond dipoles add up to about 1.5 D, but the measured value is 0.23 D. The lone pair on nitrogen points the other way — a reminder that bond dipoles are not the whole story.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const m0 = params && params.mol && (params.mol === 'pair' || MOL3.some(m => m.id === params.mol)) ? params.mol : 'pair';
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Show', options: [['Any two atoms A–B', 'pair']].concat(MOL3.map(m => [m.f, m.id])), value: m0 },
        { id: 'A', type: 'select', label: 'Atom A', options: ELEMS.map(s => [s + ' · ' + Hyper.chem.el(s).name, s]), value: 'H' },
        { id: 'B', type: 'select', label: 'Atom B', options: ELEMS.map(s => [s + ' · ' + Hyper.chem.el(s).name, s]), value: 'Cl' },
        { id: 'bonds', type: 'check', label: 'Bond dipoles', value: true },
        { id: 'net', type: 'check', label: 'Net dipole (vector sum)', value: true },
        { id: 'lone', type: 'check', label: 'Lone pairs', value: true },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true }
      ], id => { if (id === 'mol') modeChanged(); else if (id === 'A' || id === 'B') plotPair(); loop.once(); });
      const roP = kit.readout(box.side, [['en', 'Electronegativities'], ['dx', 'Difference Δχ'], ['type', 'Bond type'], ['ion', 'Ionic character'], ['mu', 'Dipole moment']]);
      const roM = kit.readout(box.side, [['shape', 'Shape'], ['bd', 'Bond dipoles (model)'], ['net', 'Net dipole (model)'], ['meas', 'Measured dipole'], ['pol', 'Verdict']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'Δχ' }, y: { label: 'ionic character' } }, 170);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.3, rotY: 0.5 });
      kit.mol.rotator(st, view, () => loop.once());
      let M = null, cur = null;
      function modeChanged() {
        const pair = V.mol === 'pair';
        ctl.show('A', pair); ctl.show('B', pair);
        ctl.show('bonds', !pair); ctl.show('net', !pair); ctl.show('lone', !pair); ctl.show('spin', !pair);
        roP.show(pair); roM.show(!pair);
        if (pair) plotPair();
        else {
          cur = MOL3.find(m => m.id === V.mol) || MOL3[0];
          M = cur.build();
          plotMol();
        }
      }
      function pairInfo() {
        const a = kit.chem.el(V.A), b = kit.chem.el(V.B);
        const dx = Math.abs((a.en || 0) - (b.en || 0));
        const meas = DIATOMIC[pairKey(V.A, V.B)];
        const d = meas ? meas[1] : (a.r || 70) + (b.r || 70);
        const I = 1 - Math.exp(-dx * dx / 4);
        const muEst = I * 1.602176634e-19 * d * 1e-12 / 3.33564e-30;
        const delta = meas ? meas[0] * 3.33564e-30 / (1.602176634e-19 * d * 1e-12) : I;
        return { a, b, dx, meas, d, I, muEst, delta, negB: (b.en || 0) >= (a.en || 0) };
      }
      function plotPair() {
        const pts = [];
        for (let x = 0; x <= 3.5; x += 0.05) pts.push([x, 100 * (1 - Math.exp(-x * x / 4))]);
        const mp = Object.entries(DIATOMIC).map(([k, v]) => {
          const [s1, s2] = k.split('|'), e1 = kit.chem.el(s1).en, e2 = kit.chem.el(s2).en;
          return [Math.abs(e1 - e2), 100 * v[0] * 3.33564e-30 / (1.602176634e-19 * v[1] * 1e-12)];
        });
        const q = pairInfo();
        plot.set({
          x: { label: 'electronegativity difference Δχ', min: 0, max: 3.5 }, y: { label: 'ionic character (%)', min: 0, max: 100 },
          series: [{ pts, label: 'Pauling: 1 − exp(−Δχ²/4)' }, { pts: mp, label: 'measured (from dipole moments)', dots: 3.5, line: false }],
          marks: [{ x: q.dx, y: 100 * q.delta, label: V.A + '–' + V.B }]
        });
      }
      function plotMol() {
        const pts = MOL3.map(m => [bondDipoles(m.build(), kit.chem).netMag, m.mu]);
        const q = bondDipoles(M, kit.chem);
        plot.set({
          x: { label: 'sum of bond dipoles, simple model (D)', min: 0, max: 2.2 }, y: { label: 'measured dipole (D)', min: 0, max: 2.2 },
          series: [{ pts: [[0, 0], [2.2, 2.2]], label: 'model = measured', dash: [5, 4] }, { pts, label: 'molecules', dots: 3.5, line: false }],
          marks: [{ x: q.netMag, y: cur.mu, label: cur.f }]
        });
      }
      function drawPair(c, C) {
        const q = pairInfo(), W = st.W, H = st.H;
        const ra = (q.a.r || 70), rb = (q.b.r || 70);
        const span = Math.min(W * 0.46, 260), s = span / q.d;
        const cy = H * 0.5, xa = W / 2 - span / 2, xb = W / 2 + span / 2;
        const Ra = clamp(ra * s * 0.72, 12, 70), Rb = clamp(rb * s * 0.72, 12, 70);
        // the shared electron cloud, weighted towards the more electronegative atom
        const f = 0.5 + 0.5 * q.delta * (q.negB ? 1 : -1);
        const acc = /^#/.test(C.accent || '') ? rgbOf(C.accent) : [120, 140, 255];
        const g = c.createLinearGradient(xa - Ra, cy, xb + Rb, cy);
        g.addColorStop(0, 'rgba(' + acc.join(',') + ',' + (0.05 + 0.5 * (1 - f)).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + acc.join(',') + ',' + (0.05 + 0.5 * f).toFixed(3) + ')');
        c.beginPath(); c.ellipse((xa + xb) / 2 + (f - 0.5) * span * 0.5, cy, span / 2 + Math.max(Ra, Rb) + 16, Math.max(Ra, Rb) + 18, 0, 0, Math.PI * 2);
        c.fillStyle = g; c.fill();
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(xa, cy); c.lineTo(xb, cy); c.stroke();
        ball(c, xa, cy, Ra, q.a.color, V.A, C);
        ball(c, xb, cy, Rb, q.b.color, V.B, C);
        const dl = q.delta.toFixed(2);
        if (q.dx > 0.005) {
          kit.label(c, (q.negB ? 'δ+ ' : 'δ− ') + dl, xa, cy - Ra - 16, { size: 13, weight: 650, align: 'center', color: q.negB ? C.bad : C.accent });
          kit.label(c, (q.negB ? 'δ− ' : 'δ+ ') + dl, xb, cy - Rb - 16, { size: 13, weight: 650, align: 'center', color: q.negB ? C.accent : C.bad });
          // the dipole arrow: from δ+ to δ−, with a cross at the tail
          const mu = q.meas ? q.meas[0] : q.muEst, L = clamp(mu * 26, 18, W * 0.8);
          const y = cy + Math.max(Ra, Rb) + 34, x0 = W / 2 - (q.negB ? L / 2 : -L / 2), x1 = W / 2 + (q.negB ? L / 2 : -L / 2);
          kit.arrow(c, x0, y, x1, y, C.warn, 3);
          const xc = x0 + (x1 - x0) * 0.12;
          c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(xc, y - 8); c.lineTo(xc, y + 8); c.stroke();
          kit.label(c, 'μ = ' + mu.toFixed(2) + ' D' + (q.meas ? ' (measured)' : ' (estimate)'), W / 2, y + 20, { size: 12.5, color: C.warn, align: 'center' });
        } else kit.label(c, 'identical electronegativities: an even, nonpolar bond', W / 2, cy + Math.max(Ra, Rb) + 34, { size: 12.5, color: C.muted, align: 'center' });
        kit.label(c, V.A + '–' + V.B + ' · bond length ' + Math.round(q.d) + ' pm' + (q.meas ? ' (measured)' : ' (sum of covalent radii)'), 14, 18, { size: 14, weight: 650 });
        const type = q.dx < 0.4 ? 'nonpolar covalent' : q.dx < 1.7 ? 'polar covalent' : 'largely ionic';
        roP.set('en', V.A + ' ' + (q.a.en == null ? '—' : q.a.en.toFixed(2)) + ', ' + V.B + ' ' + (q.b.en == null ? '—' : q.b.en.toFixed(2)));
        roP.set('dx', q.dx.toFixed(2));
        roP.set('type', type + (q.dx >= 1.4 && q.dx < 2.2 ? ' (borderline)' : ''));
        roP.set('ion', 'Pauling ' + (100 * q.I).toFixed(0) + ' %' + (q.meas ? ' · from μ ' + (100 * q.delta).toFixed(0) + ' %' : ''));
        roP.set('mu', q.meas ? q.meas[0].toFixed(2) + ' D measured' : '≈ ' + q.muEst.toFixed(1) + ' D (Pauling estimate)');
      }
      function drawMol(dt, c, C) {
        if (V.spin && !view.dragging) view.rotY += 0.3 * (dt || 0);
        const ctr = kit.mol.centre(M);
        const ext = Math.max(...M.atoms.map(a => Math.hypot(a.x - ctr[0], a.y - ctr[1], a.z - ctr[2]))) + 0.9;
        view.scale = clamp(Math.min(st.W, st.H - 40) / (2 * ext), 30, 150);
        const o = { cx: st.W / 2, cy: st.H / 2 + 10, style: 'ball', lone: V.lone, centre: ctr };
        const pts = kit.mol.draw(c, M, view, o);
        const q = bondDipoles(M, kit.chem);
        const P = p => project(sub3(p, ctr), view, o);
        if (V.bonds) for (const bd of q.list) {
          const A0 = pts[bd.pos], B0 = pts[bd.neg];
          if (!A0 || !B0 || bd.mag < 0.05) continue;
          const t0 = 0.5 - 0.3 * Math.min(1, bd.mag / 1.6), t1 = 0.5 + 0.3 * Math.min(1, bd.mag / 1.6);
          const x0 = A0.x + (B0.x - A0.x) * t0, y0 = A0.y + (B0.y - A0.y) * t0, x1 = A0.x + (B0.x - A0.x) * t1, y1 = A0.y + (B0.y - A0.y) * t1;
          kit.arrow(c, x0, y0, x1, y1, C.warn, 2.4);
          const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L * 5, ny = (x1 - x0) / L * 5;
          const xc = x0 + (x1 - x0) * 0.15, yc = y0 + (y1 - y0) * 0.15;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(xc - nx, yc - ny); c.lineTo(xc + nx, yc + ny); c.stroke();
        }
        if (V.net && q.netMag > 0.02) {
          const half = mul3(q.net, 0.45 / 1);   // 0.9 Å per debye, centred on the middle of the molecule
          const a = P(sub3(ctr, half)), b = P(add3(ctr, half));
          kit.arrow(c, a.x, a.y, b.x, b.y, C.accent, 4.5);
          kit.label(c, 'net ' + q.netMag.toFixed(2) + ' D', b.x + 8, b.y - 8, { size: 12.5, weight: 650, color: C.accent });
        } else if (V.net) kit.label(c, 'bond dipoles cancel: net 0', st.W / 2, st.H - 16, { size: 12.5, weight: 650, color: C.accent, align: 'center' });
        kit.label(c, cur.f + ' · ' + cur.shape, 14, 18, { size: 15, weight: 650 });
        kit.label(c, 'drag to turn', st.W - 14, st.H - 12, { size: 11, color: C.faint, align: 'right' });
        const kinds = {};
        for (const bd of q.list) if (bd.mag > 0.01) { const k = M.atoms[bd.pos].el + '→' + M.atoms[bd.neg].el; kinds[k] = bd.mag; }
        roM.set('shape', cur.shape);
        roM.set('bd', Object.entries(kinds).map(([k, v]) => k + ' ' + v.toFixed(2) + ' D').join(', ') || '—');
        roM.set('net', q.netMag.toFixed(2) + ' D');
        roM.set('meas', cur.mu.toFixed(2) + ' D');
        roM.set('pol', cur.mu > 0.05 ? 'polar' + (cur.note && Math.abs(q.netMag - cur.mu) > 0.25 ? ' — ' + cur.note : '') : 'nonpolar: the bond dipoles cancel by symmetry');
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        if (V.mol === 'pair') drawPair(c, C); else drawMol(dt, c, C);
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      modeChanged();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ hybrid orbitals in 3-D */
  // real geometries (Å): bond lengths and angles as measured
  function hybScene(id) {
    const S = { centres: [], ligands: [], pis: [] };
    const centre = (el, pos, hyb, ps) => { S.centres.push({ el, pos, hyb, ps }); return S.centres.length - 1; };
    const bondTo = (ci, el, dir, d) => { const u = unit3(dir); const c = S.centres[ci]; S.ligands.push({ el, pos: add3(c.pos, mul3(u, d)), from: ci }); c.hyb.push({ dir: u, lone: false, len: Math.min(0.95, 0.8 * d) }); };
    const lone = (ci, dir) => S.centres[ci].hyb.push({ dir: unit3(dir), lone: true, len: 0.85 });
    if (id === 'CH4') { const c = centre('C', [0, 0, 0], [], []); TETRA.forEach(t => bondTo(c, 'H', t, 1.087)); }
    else if (id === 'NH3') { const c = centre('N', [0, 0, 0], [], []); [0, 1, 2].forEach(k => bondTo(c, 'H', pyr(1, 106.7, k), 1.012)); lone(c, [0, 1, 0]); }
    else if (id === 'H2O') { const c = centre('O', [0, 0, 0], [], []); const h = 104.5 / 2 * deg2; bondTo(c, 'H', [Math.sin(h), -Math.cos(h), 0], 0.958); bondTo(c, 'H', [-Math.sin(h), -Math.cos(h), 0], 0.958); lone(c, [0, 0.545, 0.839]); lone(c, [0, 0.545, -0.839]); }
    else if (id === 'BF3') { const c = centre('B', [0, 0, 0], [], [[0, 0, 1]]); [90, 210, 330].forEach(a => bondTo(c, 'F', [Math.cos(a * deg2), Math.sin(a * deg2), 0], 1.307)); }
    else if (id === 'BeCl2') { const c = centre('Be', [0, 0, 0], [], [[0, 1, 0], [0, 0, 1]]); bondTo(c, 'Cl', [1, 0, 0], 1.791); bondTo(c, 'Cl', [-1, 0, 0], 1.791); }
    else if (id === 'C2H4') {
      const a = centre('C', [-0.6695, 0, 0], [], [[0, 0, 1]]), b = centre('C', [0.6695, 0, 0], [], [[0, 0, 1]]);
      S.centres[a].hyb.push({ dir: [1, 0, 0], lone: false, len: 0.8, to: b }); S.centres[b].hyb.push({ dir: [-1, 0, 0], lone: false, len: 0.8, to: a });
      [121.3, -121.3].forEach(g => bondTo(a, 'H', [Math.cos(g * deg2), Math.sin(g * deg2), 0], 1.087));
      [58.7, -58.7].forEach(g => bondTo(b, 'H', [Math.cos(g * deg2), Math.sin(g * deg2), 0], 1.087));
      S.pis.push({ axis: [0, 0, 1], half: 1.0 });
    } else if (id === 'C2H2') {
      const a = centre('C', [-0.6015, 0, 0], [], [[0, 1, 0], [0, 0, 1]]), b = centre('C', [0.6015, 0, 0], [], [[0, 1, 0], [0, 0, 1]]);
      S.centres[a].hyb.push({ dir: [1, 0, 0], lone: false, len: 0.75, to: b }); S.centres[b].hyb.push({ dir: [-1, 0, 0], lone: false, len: 0.75, to: a });
      bondTo(a, 'H', [-1, 0, 0], 1.063); bondTo(b, 'H', [1, 0, 0], 1.063);
      S.pis.push({ axis: [0, 1, 0], half: 0.95 }, { axis: [0, 0, 1], half: 0.95 });
    }
    return S;
  }
  const HYB = [
    { id: 'CH4', name: 'sp³ · CH₄, methane', type: 'sp³', n: 3, ideal: '109.5°', real: 'H–C–H 109.5°', sig: 4, pi: 0, ex: 'diamond, every saturated carbon' },
    { id: 'NH3', name: 'sp³ · NH₃, ammonia', type: 'sp³', n: 3, ideal: '109.5°', real: 'H–N–H 106.7° (the lone pair squeezes)', sig: 3, pi: 0, ex: 'the nitrogen of amines and NH₄⁺' },
    { id: 'H2O', name: 'sp³ · H₂O, water', type: 'sp³', n: 3, ideal: '109.5°', real: 'H–O–H 104.5°', sig: 2, pi: 0, ex: 'the oxygen of alcohols and ethers' },
    { id: 'BF3', name: 'sp² · BF₃, boron trifluoride', type: 'sp²', n: 2, ideal: '120°', real: 'F–B–F 120°', sig: 3, pi: 0, ex: 'carbocations; the empty p orbital accepts a lone pair' },
    { id: 'C2H4', name: 'sp² · C₂H₄, ethene (σ + π)', type: 'sp²', n: 2, ideal: '120°', real: 'H–C–H 117.4°, H–C=C 121.3°', sig: 5, pi: 1, ex: 'benzene, graphite, C=O carbons' },
    { id: 'BeCl2', name: 'sp · BeCl₂ (gas)', type: 'sp', n: 1, ideal: '180°', real: 'Cl–Be–Cl 180°', sig: 2, pi: 0, ex: 'gaseous BeCl₂ (the solid is a chain polymer)' },
    { id: 'C2H2', name: 'sp · C₂H₂, ethyne (σ + 2π)', type: 'sp', n: 1, ideal: '180°', real: 'H–C≡C 180°', sig: 3, pi: 2, ex: 'the carbon of CO₂ and of nitriles' }
  ];

  Hyper.sim('bond-hybrid', {
    title: 'Hybrid orbitals: sp³, sp² and sp in 3-D',
    blurb: `Slide **Mixing** from 0 to 1: the central atom's one s orbital and three p orbitals blend into equivalent hybrids that point along the bonds. Blue lobes hold bonding pairs, violet ones lone pairs; the small orange lobes behind are the opposite phase of each hybrid. Green p orbitals are the ones left unmixed. The boxes on the right follow the electrons of the central atom. Drag to turn the model.

- sp³ (CH₄, NH₃, H₂O): four hybrids at about 109.5°. In NH₃ and H₂O some hold lone pairs, and the real angles close up.
- sp² (BF₃, C₂H₄): three hybrids in a plane, one p orbital standing up. In ethene the two upright p orbitals overlap side-on into the π bond — twist it and the overlap would be lost.
- sp (BeCl₂, C₂H₂): two hybrids in a line, two p orbitals left, which in ethyne make two π bonds at right angles.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      let i0 = HYB.findIndex(h => h.id === (params && params.preset));
      if (i0 < 0) i0 = 0;
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Molecule', options: HYB.map((h, i) => [h.name, i]), value: i0 },
        { id: 'mix', label: 'Mixing: atomic orbitals → hybrids', min: 0, max: 1, step: 0.01, value: 1 },
        { id: 'p', type: 'check', label: 'Unhybridised p orbitals', value: true },
        { id: 'pi', type: 'check', label: 'π overlap (two-carbon molecules)', value: true },
        { id: 'atoms', type: 'check', label: 'Bonded atoms', value: true },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true }
      ], id => { if (id === 'pre') { H0 = HYB[V.pre] || HYB[0]; scene = hybScene(H0.id); } loop.once(); });
      const ro = kit.readout(box.side, [['hyb', 'Hybrids'], ['sc', 's character'], ['ang', 'Angle'], ['bonds', 'Bonds'], ['ex', 'Also found in']]);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.35, rotY: 0.55 });
      kit.mol.rotator(st, view, () => loop.once());
      let H0 = HYB[i0], scene = hybScene(H0.id);
      // an orbital lobe as a projected ellipse; centre3, direction, half-length and half-width in Å
      function lobe(items, o, c3, dir, half, width, color, alpha) {
        const P = project(c3, view, o), T = project(add3(c3, mul3(dir, half)), view, o);
        const dx = T.x - P.x, dy = T.y - P.y;
        const w = width * view.scale * P.f;
        items.push({ z: P.z, draw: c => {
          c.save(); c.globalAlpha = alpha;
          c.translate(P.x, P.y); c.rotate(Math.atan2(dy, dx));
          c.beginPath(); c.ellipse(0, 0, Math.max(w, Math.hypot(dx, dy)), w, 0, 0, Math.PI * 2);
          c.fillStyle = color; c.fill();
          c.globalAlpha = Math.min(1, alpha * 1.6); c.strokeStyle = color; c.lineWidth = 1; c.stroke();
          c.restore();
        } });
      }
      function boxes(c, C, x0, y0) {
        // the central atom's valence electrons, before and after mixing
        const cen = scene.centres[0], el = cen.el, v = valence(el);
        const nh = cen.hyb.length, lp = cen.hyb.filter(h => h.lone).length, np = 3 - (nh - 1);
        const bx = 17, gap = 4;
        const drawBox = (x, y, e, color) => {
          c.strokeStyle = color; c.lineWidth = 1.4; c.strokeRect(x, y, bx, bx);
          if (e >= 1) kit.arrow(c, x + (e === 2 ? 5 : 8.5), y + bx - 3, x + (e === 2 ? 5 : 8.5), y + 3, C.text, 1.4, 5);
          if (e === 2) kit.arrow(c, x + 12, y + 3, x + 12, y + bx - 3, C.text, 1.4, 5);
        };
        const m = V.mix;
        kit.label(c, 'electrons of ' + el, x0, y0, { size: 12, weight: 650, color: C.muted });
        // ground state: 2s², then 2p singly then paired
        const gy = y0 + 22, colA = m < 0.5 ? C.text : C.faint, colB = m >= 0.5 ? C.text : C.faint;
        kit.label(c, 'atom', x0, gy, { size: 11, color: colA });
        const s = Math.min(2, v); let r = v - s; const pe = [0, 0, 0];
        for (let k = 0; k < 3 && r > 0; k++) { pe[k]++; r--; } for (let k = 0; k < 3 && r > 0; k++) { pe[k]++; r--; }
        drawBox(x0, gy + 54, s, colA);
        kit.label(c, '2s', x0 + bx + 6, gy + 54 + bx / 2, { size: 11, color: colA });
        pe.forEach((e, k) => drawBox(x0 + k * (bx + gap), gy + 18, e, colA));
        kit.label(c, '2p', x0 + 3 * (bx + gap) + 2, gy + 18 + bx / 2, { size: 11, color: colA });
        // hybridised: bonding hybrids one electron, lone-pair hybrids two, the rest into p
        const hy = gy + 96;
        kit.label(c, 'hybridised', x0, hy, { size: 11, color: colB });
        let left = v - lp * 2 - (nh - lp);
        for (let k = 0; k < nh; k++) drawBox(x0 + k * (bx + gap), hy + 44, k < nh - lp ? 1 : 2, colB);
        kit.label(c, H0.type, x0 + nh * (bx + gap) + 2, hy + 44 + bx / 2, { size: 11, color: colB });
        for (let k = 0; k < np; k++) { const e = left > 0 ? 1 : 0; left -= e; drawBox(x0 + k * (bx + gap), hy + 14, e, np ? colB : C.faint); }
        if (np) kit.label(c, '2p', x0 + np * (bx + gap) + 2, hy + 14 + bx / 2, { size: 11, color: colB });
      }
      function frame(dt) {
        if (V.spin && !view.dragging) view.rotY += 0.3 * (dt || 0);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, m = V.mix;
        const ext = Math.max(1.4, ...scene.ligands.map(l => len3(l.pos))) + 0.45;
        const sceneW = W * 0.68;
        view.scale = clamp(Math.min(sceneW, H - 40) / (2 * ext), 30, 150);
        const o = { cx: sceneW / 2, cy: H / 2 + 8 };
        const items = [];
        const colB = C.series[0], colL = C.series[5], colBack = C.series[1], colP = C.series[2];
        const two = scene.centres.length > 1;
        for (const cen of scene.centres) {
          // the atomic orbitals, fading out as they mix
          if (m < 0.999) {
            const a = 0.42 * (1 - m);
            const Pc = project(cen.pos, view, o);
            items.push({ z: Pc.z - 0.01, draw: cc => { cc.save(); cc.globalAlpha = a; cc.beginPath(); cc.arc(Pc.x, Pc.y, 0.5 * view.scale * Pc.f, 0, Math.PI * 2); cc.fillStyle = colB; cc.fill(); cc.restore(); } });
            for (const ax of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
              lobe(items, o, add3(cen.pos, mul3(ax, 0.42)), ax, 0.42, 0.26, colP, a);
              lobe(items, o, add3(cen.pos, mul3(ax, -0.42)), mul3(ax, -1), 0.42, 0.26, colBack, a);
            }
          }
          // the hybrids
          if (m > 0.001) for (const hb of cen.hyb) {
            const a = 0.5 * m;
            lobe(items, o, add3(cen.pos, mul3(hb.dir, hb.len * 0.52)), hb.dir, hb.len * 0.52, 0.3, hb.lone ? colL : colB, a);
            lobe(items, o, add3(cen.pos, mul3(hb.dir, -0.14)), mul3(hb.dir, -1), 0.14, 0.14, colBack, a);
          }
          // the p orbitals left over
          if (V.p && m > 0.001 && !(two && V.pi && m > 0.98)) for (const pd of cen.ps) {
            const a = 0.45 * m;
            lobe(items, o, add3(cen.pos, mul3(pd, 0.45)), pd, 0.45, 0.24, colP, a);
            lobe(items, o, add3(cen.pos, mul3(pd, -0.45)), mul3(pd, -1), 0.45, 0.24, colBack, a);
          }
        }
        // π bonds: side-on overlap of the parallel p orbitals, above and below the axis
        if (two && V.pi && m > 0.98) for (const pi of scene.pis) for (const sgn of [1, -1]) {
          lobe(items, o, mul3(pi.axis, 0.5 * sgn), [1, 0, 0], pi.half, 0.26, sgn > 0 ? colP : colBack, 0.42);
        }
        // atoms
        const atomBall = (el, pos, alpha) => {
          const P = project(pos, view, o), e = kit.chem.el(el);
          const r = (0.2 + (e.r || 70) / 100 * 0.18) * view.scale * P.f;
          items.push({ z: P.z, draw: cc => { cc.save(); cc.globalAlpha = alpha; ball(cc, P.x, P.y, r, e.color, el, C); cc.restore(); } });
        };
        for (const cen of scene.centres) atomBall(cen.el, cen.pos, 1);
        if (V.atoms) for (const l of scene.ligands) {
          const A0 = project(scene.centres[l.from].pos, view, o), B0 = project(l.pos, view, o);
          items.push({ z: (A0.z + B0.z) / 2 - 0.05, draw: cc => { cc.save(); cc.globalAlpha = 0.25 + 0.6 * m; cc.strokeStyle = C.muted; cc.lineWidth = 2; cc.beginPath(); cc.moveTo(A0.x, A0.y); cc.lineTo(B0.x, B0.y); cc.stroke(); cc.restore(); } });
          atomBall(l.el, l.pos, 0.3 + 0.7 * m);
        }
        if (two && V.atoms) {
          const A0 = project(scene.centres[0].pos, view, o), B0 = project(scene.centres[1].pos, view, o);
          items.push({ z: (A0.z + B0.z) / 2 - 0.05, draw: cc => { cc.strokeStyle = C.muted; cc.lineWidth = 2; cc.beginPath(); cc.moveTo(A0.x, A0.y); cc.lineTo(B0.x, B0.y); cc.stroke(); } });
        }
        items.sort((p, q) => p.z - q.z);
        for (const it of items) it.draw(c);
        kit.label(c, H0.name, 14, 18, { size: 15, weight: 650 });
        kit.label(c, m < 0.02 ? 'unmixed: one s and three p orbitals' : m > 0.98 ? H0.type + ' hybrids' : 'mixing…', 14, 38, { size: 12, color: C.muted });
        kit.label(c, 'drag to turn', sceneW - 10, H - 12, { size: 11, color: C.faint, align: 'right' });
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(sceneW + 4, 20); c.lineTo(sceneW + 4, H - 20); c.stroke();
        boxes(c, C, sceneW + 18, 34);
        const cen = scene.centres[0], nh = cen.hyb.length;
        ro.set('hyb', H0.type + ': ' + nh + ' hybrid' + (nh > 1 ? 's' : '') + ' per ' + cen.el + ', ' + (4 - nh) + ' p left' + (cen.hyb.some(h => h.lone) ? ' · ' + (cen.hyb.filter(h => h.lone).length > 1 ? cen.hyb.filter(h => h.lone).length + ' hold lone pairs' : 'one holds a lone pair') : ''));
        ro.set('sc', Math.round(100 / (H0.n + 1)) + ' % (one s shared among ' + (H0.n + 1) + ' orbitals)');
        ro.set('ang', 'ideal ' + H0.ideal + ' · real ' + H0.real);
        ro.set('bonds', H0.sig + ' σ' + (H0.pi ? ' + ' + H0.pi + ' π' : ''));
        ro.set('ex', H0.ex);
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ MO diagrams */
  // measured bond lengths (pm) and bond energies D₀ (kJ/mol) where known
  const MOSP = [
    { id: 'Li2', f: 'Li₂', Z: 3, q: 0, len: 267, D: 102 },
    { id: 'Be2', f: 'Be₂', Z: 4, q: 0, len: 245, D: 11, note: 'barely bound' },
    { id: 'B2', f: 'B₂', Z: 5, q: 0, len: 159, D: 290 },
    { id: 'C2', f: 'C₂', Z: 6, q: 0, len: 124, D: 600 },
    { id: 'N2', f: 'N₂', Z: 7, q: 0, len: 110, D: 942 },
    { id: 'O2', f: 'O₂', Z: 8, q: 0, len: 121, D: 494 },
    { id: 'F2', f: 'F₂', Z: 9, q: 0, len: 142, D: 155 },
    { id: 'Ne2', f: 'Ne₂', Z: 10, q: 0, len: null, D: null, note: 'not bound' },
    { id: 'N2+', f: 'N₂⁺', Z: 7, q: 1, len: 112, D: 840 },
    { id: 'O2+', f: 'O₂⁺', Z: 8, q: 1, len: 112, D: 643 },
    { id: 'O2-', f: 'O₂⁻ (superoxide)', Z: 8, q: -1, len: 133, D: null },
    { id: 'O22-', f: 'O₂²⁻ (peroxide)', Z: 8, q: -2, len: 149, D: null },
    { id: 'C22-', f: 'C₂²⁻ (acetylide)', Z: 6, q: -2, len: 120, D: null }
  ];
  const MOLEV = {
    mix: [['σ2s', 1, 1, 's'], ['σ*2s', 1, -1, 's'], ['π2p', 2, 1, 'p'], ['σ2p', 1, 1, 'p'], ['π*2p', 2, -1, 'p'], ['σ*2p', 1, -1, 'p']],
    pure: [['σ2s', 1, 1, 's'], ['σ*2s', 1, -1, 's'], ['σ2p', 1, 1, 'p'], ['π2p', 2, 1, 'p'], ['π*2p', 2, -1, 'p'], ['σ*2p', 1, -1, 'p']]
  };
  function moFill(sp, order) {
    const key = order === 'auto' ? (sp.Z <= 7 ? 'mix' : 'pure') : order;
    const n = 2 * (sp.Z - 2) - sp.q;
    let left = n;
    const lev = MOLEV[key].map(([name, g, b, from]) => ({ name, g, b, from, e: new Array(g).fill(0) }));
    for (const L of lev) {
      const take = Math.min(left, 2 * L.g);
      left -= take;
      for (let k = 0; k < take; k++) L.e[k < L.g ? k : k - L.g]++;       // Hund: one in each first, then pair
    }
    const nb = lev.reduce((s, L) => s + (L.b > 0 ? L.e.reduce((a, x) => a + x, 0) : 0), 0);
    const na = lev.reduce((s, L) => s + (L.b < 0 ? L.e.reduce((a, x) => a + x, 0) : 0), 0);
    const unp = lev.reduce((s, L) => s + L.e.filter(x => x === 1).length, 0);
    return { key, n, lev, nb, na, bo: (nb - na) / 2, unp };
  }
  const SUBS = { s: 'ₛ', p: 'ₚ' };
  const moName = s => s.replace(/2([sp])/, (m, l) => '₂' + SUBS[l]);
  const supN = k => String(k).replace(/\d/g, d => SUP[d]);

  Hyper.sim('bond-mo', {
    title: 'Molecular-orbital diagrams of the second-period diatomics',
    blurb: `The valence orbitals of two identical atoms (left and right) combine into molecular orbitals (centre): each bonding orbital lies below its parent atomic orbitals, each antibonding one (*) above them. The electrons fill from the bottom, one into each of two equal orbitals before pairing up. The graph compares the bond order with the measured bond energy.

- Step from Li₂ to Ne₂: the bond order climbs to 3 at N₂ and falls back to 0 — and Be₂ and Ne₂ are hardly bound at all.
- Look at O₂: its last two electrons sit alone in the two π* orbitals. Oxygen is paramagnetic, which no Lewis structure shows.
- Compare N₂⁺ with O₂⁺: removing an electron weakens one bond and strengthens the other.
- Switch **Level order** by hand for B₂: with σ₂ₚ below π₂ₚ it would be diamagnetic, but B₂ is paramagnetic — evidence that s–p mixing lifts σ₂ₚ above π₂ₚ in the lighter molecules.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      let i0 = MOSP.findIndex(s => s.id === (params && params.species));
      if (i0 < 0) i0 = 5;
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Molecule or ion', options: MOSP.map((s, i) => [s.f, i]), value: i0 },
        { id: 'order', type: 'select', label: 'Level order', options: [['automatic (as observed)', 'auto'], ['π₂ₚ below σ₂ₚ (Li₂–N₂)', 'mix'], ['σ₂ₚ below π₂ₚ (O₂–Ne₂)', 'pure']], value: 'auto' }
      ], () => { replot(); loop.once(); });
      const ro = kit.readout(box.side, [['ne', 'Valence electrons'], ['cfg', 'Configuration'], ['bo', 'Bond order'], ['mag', 'Unpaired electrons'], ['len', 'Bond length (measured)'], ['D', 'Bond energy (measured)']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'bond order' }, y: { label: 'bond energy (kJ/mol)' } }, 170);
      const V = ctl.values;
      function replot() {
        const sp = MOSP[V.sp] || MOSP[5];
        const pts = MOSP.filter(s => s.D != null).map(s => [moFill(s, 'auto').bo, s.D]);
        const q = moFill(sp, V.order);
        plot.set({
          x: { label: 'bond order (from the diagram)', min: 0, max: 3.2 }, y: { label: 'bond energy (kJ/mol)', min: 0, max: 1000 },
          series: [{ pts, label: 'second-period molecules and ions', dots: 4, line: false }],
          marks: sp.D != null ? [{ x: q.bo, y: sp.D, label: sp.f }] : [],
          vlines: sp.D == null ? [{ x: q.bo, label: sp.f + ': no measured energy' }] : []
        });
      }
      function frame() {
        const sp = MOSP[V.sp] || MOSP[5];
        const q = moFill(sp, V.order);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const Zi = sp.Z;
        // qualitative energies: the 2s–2p gap widens across the period, weakening s–p mixing
        const gap = [0, 0, 0, 3.2, 3.5, 3.9, 4.3, 4.7, 5.6, 6.2, 6.8][Zi];
        const E = { AO_s: 0, AO_p: gap, 'σ2s': -1.1, 'σ*2s': 1.25, 'π2p': gap - 1.1, 'π*2p': gap + 1.3, 'σ*2p': gap + 2.3 };
        E['σ2p'] = q.key === 'mix' ? gap - 0.45 : gap - 1.9;
        const lo = -1.6, hi = gap + 2.8, py0 = 46, py1 = H - 22;
        const Y = e => py1 - (e - lo) / (hi - lo) * (py1 - py0);
        const xL = W * 0.16, xR = W * 0.84, xM = W * 0.5;
        kit.label(c, 'MO diagram of ' + sp.f, 14, 18, { size: 15, weight: 650 });
        kit.label(c, 'energy ↑', 14, 38, { size: 11, color: C.muted });
        kit.label(c, 'atom', xL, py0 - 8, { size: 12, color: C.muted, align: 'center' });
        kit.label(c, 'atom', xR, py0 - 8, { size: 12, color: C.muted, align: 'center' });
        kit.label(c, 'molecule', xM, py0 - 8, { size: 12, color: C.muted, align: 'center' });
        const lw = 34, gp = 8;
        const slots = (x, g) => Array.from({ length: g }, (_, k) => x + (k - (g - 1) / 2) * (lw + gp));
        const pair = (x, y, e, col) => {
          if (e >= 1) kit.arrow(c, x - (e === 2 ? 5 : 0), y + 9, x - (e === 2 ? 5 : 0), y - 9, col, 1.6, 6);
          if (e === 2) kit.arrow(c, x + 5, y - 9, x + 5, y + 9, col, 1.6, 6);
        };
        const line = (x, y, col, w) => { c.strokeStyle = col; c.lineWidth = w || 2.2; c.beginPath(); c.moveTo(x - lw / 2, y); c.lineTo(x + lw / 2, y); c.stroke(); };
        // atomic orbitals of the neutral atoms
        const v = Zi - 2, se = Math.min(2, v); let pr = v - se; const pe = [0, 0, 0];
        for (let k = 0; k < 3 && pr > 0; k++) { pe[k]++; pr--; } for (let k = 0; k < 3 && pr > 0; k++) { pe[k]++; pr--; }
        for (const xa of [xL, xR]) {
          line(xa, Y(E.AO_s), C.text); pair(xa, Y(E.AO_s), se, C.text);
          slots(xa, 3).forEach((x, k) => { line(x, Y(E.AO_p), C.text); pair(x, Y(E.AO_p), pe[k], C.text); });
          kit.label(c, '2s', xa + (xa < xM ? -lw / 2 - 8 : lw / 2 + 8), Y(E.AO_s), { size: 12, color: C.muted, align: xa < xM ? 'right' : 'left' });
          kit.label(c, '2p', xa + (xa < xM ? -1.5 * lw - gp - 8 : 1.5 * lw + gp + 8), Y(E.AO_p), { size: 12, color: C.muted, align: xa < xM ? 'right' : 'left' });
        }
        // connectors and molecular orbitals
        c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const L of q.lev) {
          const y = Y(E[L.name]), ya = L.from === 's' ? Y(E.AO_s) : Y(E.AO_p);
          const xo = L.from === 's' ? lw / 2 : 1.5 * lw + gp;
          const half = L.g === 2 ? lw + gp / 2 : lw / 2;
          c.beginPath(); c.moveTo(xL + xo, ya); c.lineTo(xM - half, y); c.stroke();
          c.beginPath(); c.moveTo(xR - xo, ya); c.lineTo(xM + half, y); c.stroke();
        }
        c.setLineDash([]);
        for (const L of q.lev) {
          const y = Y(E[L.name]), col = L.b > 0 ? C.ok : C.bad;
          slots(xM, L.g).forEach((x, k) => { line(x, y, col, 2.6); pair(x, y, L.e[k], C.text); });
          kit.label(c, moName(L.name), xM + (L.g === 2 ? lw + gp : lw / 2) + 10, y, { size: 12.5, color: col });
        }
        kit.label(c, 'bonding', W - 14, H - 26, { size: 11, color: C.ok, align: 'right' });
        kit.label(c, 'antibonding (*)', W - 14, H - 12, { size: 11, color: C.bad, align: 'right' });
        if (sp.q) kit.label(c, 'ion: ' + (sp.q > 0 ? sp.q + ' electron' + (sp.q > 1 ? 's' : '') + ' removed' : -sp.q + ' electron' + (sp.q < -1 ? 's' : '') + ' added') + ' (atoms shown neutral)', 14, H - 12, { size: 11, color: C.muted });
        // read-outs
        const cfg = q.lev.filter(L => L.e.some(x => x)).map(L => moName(L.name) + supN(L.e.reduce((a, x) => a + x, 0))).join(' ');
        ro.set('ne', String(q.n));
        ro.set('cfg', cfg || '—');
        ro.set('bo', '(' + q.nb + ' − ' + q.na + ')/2 = ' + (q.bo % 1 ? q.bo.toFixed(1) : String(q.bo)));
        ro.set('mag', q.unp + (q.unp ? ' → paramagnetic' : ' → diamagnetic'));
        ro.set('len', sp.len ? sp.len + ' pm' : '— (' + (sp.note || 'not measured') + ')');
        ro.set('D', sp.D != null ? sp.D + ' kJ/mol' + (sp.note ? ' (' + sp.note + ')' : '') : '—');
      }
      const loop = kit.loop(() => frame(), box.stage);
      replot();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ boiling points and intermolecular forces */
  // normal boiling points (°C) at 1 atm
  const HB3 = new Set(['NH3', 'H2O', 'HF']);
  const BPSETS = {
    hydrides: { title: 'Hydrides of groups 14–17', xlab: 'period of the central atom', period: true, series: [
      ['group 14', [['CH4', 2, -161.5], ['SiH4', 3, -111.9], ['GeH4', 4, -88.5], ['SnH4', 5, -52]]],
      ['group 15', [['NH3', 2, -33.3], ['PH3', 3, -87.7], ['AsH3', 4, -62.5], ['SbH3', 5, -17]]],
      ['group 16', [['H2O', 2, 100.0], ['H2S', 3, -60.3], ['H2Se', 4, -41.3], ['H2Te', 5, -2.2]]],
      ['group 17', [['HF', 2, 19.5], ['HCl', 3, -85.1], ['HBr', 4, -66.8], ['HI', 5, -35.4]]]] },
    alkanes: { title: 'Straight-chain alkanes CₙH₂ₙ₊₂', xlab: 'molar mass (g/mol)', series: [
      ['alkanes', [['CH4', null, -161.5, 'methane'], ['C2H6', null, -88.6, 'ethane'], ['C3H8', null, -42.1, 'propane'], ['C4H10', null, -0.5, 'butane'], ['C5H12', null, 36.1, 'pentane'],
        ['C6H14', null, 68.7, 'hexane'], ['C7H16', null, 98.4, 'heptane'], ['C8H18', null, 125.6, 'octane'], ['C9H20', null, 150.8, 'nonane'], ['C10H22', null, 174.1, 'decane']]]] },
    noble: { title: 'Noble gases and halogens: dispersion only', xlab: 'molar mass (g/mol)', series: [
      ['noble gases', [['He', null, -268.9], ['Ne', null, -246.0], ['Ar', null, -185.8], ['Kr', null, -153.4], ['Xe', null, -108.1], ['Rn', null, -61.7]]],
      ['halogens', [['F2', null, -188.1], ['Cl2', null, -34.0], ['Br2', null, 58.8], ['I2', null, 184.4]]]] },
    mass: { title: 'About the same molar mass, different forces', xlab: 'molar mass (g/mol)', series: [
      ['44–46 g/mol', [['C3H8', null, -42.1, 'propane', 'dispersion only'], ['CH3OCH3', null, -24.8, 'dimethyl ether', 'dispersion + dipole (1.3 D)'], ['CH3CHO', null, 20.2, 'ethanal', 'dispersion + dipole (2.7 D)'],
        ['CH3CN', null, 81.6, 'ethanenitrile', 'dispersion + a large dipole (3.9 D)'], ['C2H5OH', null, 78.4, 'ethanol', 'hydrogen bonds + dipole + dispersion'], ['HCOOH', null, 100.8, 'methanoic acid', 'hydrogen-bonded pairs + dipole + dispersion']]]] },
    isomers: { title: 'Three C₅H₁₂ isomers: only the shape differs', xlab: 'branching', cats: ['pentane', '2-methylbutane', '2,2-dimethylpropane'], series: [
      ['C₅H₁₂', [['C5H12', 0, 36.1, 'pentane (a zig-zag rod)', 'dispersion over a large contact area'], ['C5H12', 1, 27.7, '2-methylbutane', 'dispersion, less contact'], ['C5H12', 2, 9.5, '2,2-dimethylpropane (nearly a sphere)', 'dispersion over the least contact']]]] }
  };

  Hyper.sim('bond-hydrides', {
    title: 'Boiling points and the forces between molecules',
    blurb: `Real boiling points, grouped to isolate one effect at a time. **Click a point** for its details.

- **Hydrides**: down each group the boiling point rises with the number of electrons (dispersion). NH₃, H₂O and HF break the pattern — hydrogen bonds. Tick the trend lines to see where they "should" boil.
- **Alkanes** and **noble gases**: dispersion only, climbing steadily with size.
- **Same molar mass**: add a dipole, then a hydrogen bond, and the boiling point jumps.
- **Isomers**: identical formula and forces; only the shape — the contact area — changes.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const s0 = params && BPSETS[params.set] ? params.set : 'hydrides';
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Compare', options: [['Hydrides of groups 14–17', 'hydrides'], ['Straight-chain alkanes', 'alkanes'], ['Noble gases and halogens', 'noble'], ['Same molar mass, different forces', 'mass'], ['Pentane isomers: shape', 'isomers']], value: s0 },
        { id: 'trend', type: 'check', label: 'Trend lines without hydrogen bonds (hydrides)', value: true },
        { id: 'room', type: 'check', label: 'Room temperature (25 °C)', value: true }
      ], id => { if (id === 'set') pickDefault(); loop.once(); });
      const ro = kit.readout(box.side, [['sel', 'Substance'], ['M', 'Molar mass'], ['bp', 'Boiling point'], ['forces', 'Forces between molecules'], ['note', 'Note']]);
      const V = ctl.values;
      let sel = null, pts = [];
      const pointsOf = set => {
        const S = BPSETS[set], out = [];
        S.series.forEach(([label, list], si) => list.forEach(p => {
          const M = kit.chem.molarMass(p[0]);
          out.push({ f: p[0], x: p[1] != null ? p[1] : M, bp: p[2], name: p[3] || pretty(p[0]), forces: p[4], si, label, M });
        }));
        return out;
      };
      function pickDefault() {
        const want = { hydrides: 'H2O', alkanes: 'C5H12', noble: 'Xe', mass: 'C2H5OH', isomers: 'C5H12' }[V.set];
        sel = pointsOf(V.set).find(p => p.f === want) || null;
      }
      function forcesOf(p) {
        if (p.forces) return p.forces;
        if (V.set === 'hydrides') return HB3.has(p.f) ? 'hydrogen bonds + dipole–dipole + dispersion' : p.si === 0 ? 'dispersion only (symmetric, nonpolar)' : 'dispersion + dipole–dipole';
        return 'dispersion only (nonpolar)';
      }
      function fit(list) {                       // least-squares line through (period, bp) for periods 3–5
        const q = list.filter(p => p.x >= 3);
        const mx = q.reduce((s, p) => s + p.x, 0) / q.length, my = q.reduce((s, p) => s + p.bp, 0) / q.length;
        const sxx = q.reduce((s, p) => s + (p.x - mx) * (p.x - mx), 0) || 1, sxy = q.reduce((s, p) => s + (p.x - mx) * (p.bp - my), 0);
        const k = sxy / sxx;
        return x => my + k * (x - mx);
      }
      let geom = null;
      kit.click(st, p => {
        if (!geom) return;
        let best = null, bd = 18;
        for (const q of pts) { const d = Math.hypot(geom.X(q.x) - p.x, geom.Y(q.bp) - p.y); if (d < bd) { bd = d; best = q; } }
        if (best) { sel = best; loop.once(); }
      }, p => geom && pts.some(q => Math.hypot(geom.X(q.x) - p.x, geom.Y(q.bp) - p.y) < 18));
      function frame() {
        const S = BPSETS[V.set] || BPSETS.hydrides;
        pts = pointsOf(V.set);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const px0 = 58, px1 = W - 22, py0 = 44, py1 = H - 42;
        let x0, x1;
        if (S.period) { x0 = 1.6; x1 = 5.4; } else if (S.cats) { x0 = -0.5; x1 = 2.5; } else { x0 = 0; x1 = Math.max(...pts.map(p => p.x)) * 1.12; }
        const ys = pts.map(p => p.bp).concat(V.room ? [25] : []);
        let y0 = Math.min(...ys) - 25, y1 = Math.max(...ys) + 30;
        if (V.set === 'hydrides' && V.trend) y0 = Math.min(y0, -150);
        const X = x => px0 + (x - x0) / (x1 - x0) * (px1 - px0), Y = y => py1 - (y - y0) / (y1 - y0) * (py1 - py0);
        geom = { X, Y };
        kit.label(c, S.title, 14, 18, { size: 15, weight: 650 });
        // axes and grid
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px0, py0); c.lineTo(px0, py1); c.lineTo(px1, py1); c.stroke();
        const sy = Hyper.niceStep ? Hyper.niceStep(y1 - y0, 7) : 50;
        for (let y = Math.ceil(y0 / sy) * sy; y <= y1; y += sy) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px0, Y(y)); c.lineTo(px1, Y(y)); c.stroke();
          kit.label(c, String(Math.round(y)), px0 - 6, Y(y), { size: 10.5, color: C.muted, align: 'right' });
        }
        c.save(); c.translate(14, (py0 + py1) / 2); c.rotate(-Math.PI / 2);
        kit.label(c, 'boiling point (°C)', 0, 0, { size: 11, color: C.muted, align: 'center' }); c.restore();
        if (S.period) for (let k = 2; k <= 5; k++) kit.label(c, 'period ' + k, X(k), py1 + 13, { size: 11, color: C.muted, align: 'center' });
        else if (S.cats) S.cats.forEach((t, k) => kit.label(c, t, X(k), py1 + 13, { size: 11, color: C.muted, align: 'center' }));
        else {
          const sx = Hyper.niceStep ? Hyper.niceStep(x1 - x0, 8) : 20;
          for (let x = 0; x <= x1; x += sx) kit.label(c, String(Math.round(x)), X(x), py1 + 13, { size: 10.5, color: C.muted, align: 'center' });
        }
        kit.label(c, S.xlab, (px0 + px1) / 2, py1 + 29, { size: 11, color: C.muted, align: 'center' });
        if (V.room && Y(25) > py0 && Y(25) < py1) {
          c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(px0, Y(25)); c.lineTo(px1, Y(25)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'room temperature: liquids and solids above, gases below', px1 - 4, Y(25) - 9, { size: 10.5, color: C.warn, align: 'right' });
        }
        // series
        S.series.forEach(([label, list], si) => {
          const col = C.series[si % C.series.length];
          const P = pts.filter(p => p.si === si).sort((a, b) => a.x - b.x);
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
          P.forEach((p, k) => { if (k) c.lineTo(X(p.x), Y(p.bp)); else c.moveTo(X(p.x), Y(p.bp)); });
          if (!S.cats) c.stroke();
          if (S.period && V.trend && si > 0) {
            const g = fit(P);
            c.setLineDash([5, 4]); c.strokeStyle = col; c.lineWidth = 1.4;
            c.beginPath(); c.moveTo(X(5), Y(g(5))); c.lineTo(X(2), Y(g(2))); c.stroke(); c.setLineDash([]);
            c.beginPath(); c.arc(X(2), Y(g(2)), 5, 0, Math.PI * 2); c.strokeStyle = col; c.lineWidth = 1.5; c.stroke();
            kit.label(c, 'expected ≈ ' + minus(Math.round(g(2))) + ' °C', X(2) + 9, Y(g(2)) + 1, { size: 10.5, color: col });
          }
          for (const p of P) {
            kit.dot(c, X(p.x), Y(p.bp), p === sel ? 7 : 5, col, p === sel ? C.text : null);
            kit.label(c, S.cats ? minus(p.bp.toFixed(1)) + ' °C' : pretty(p.f), X(p.x) + 8, Y(p.bp) - 9, { size: 11.5, weight: 600, color: col });
          }
          kit.label(c, label, px1 - 6, py0 + 8 + si * 16, { size: 11.5, color: col, align: 'right' });
        });
        if (sel) {
          const q = pts.find(p => p.f === sel.f && p.x === sel.x) || sel;
          ro.set('sel', q.name + (q.name !== pretty(q.f) ? ' (' + pretty(q.f) + ')' : ''));
          ro.set('M', q.M.toFixed(2) + ' g/mol');
          ro.set('bp', minus(q.bp.toFixed(1)) + ' °C = ' + (q.bp + 273.15).toFixed(2) + ' K');
          ro.set('forces', forcesOf(q));
          let note = '—';
          if (V.set === 'hydrides' && q.x === 2 && q.si > 0) { const P = pts.filter(p => p.si === q.si); note = 'the heavier members extrapolate to about ' + minus(Math.round(fit(P)(2))) + ' °C; hydrogen bonds add ' + Math.round(q.bp - fit(P)(2)) + ' °C'; }
          else if (V.set === 'hydrides' && q.si === 0) note = 'no hydrogen bonds even at period 2: C–H is almost nonpolar';
          else note = q.bp > 25 ? 'liquid (or solid) at room temperature' : 'gas at room temperature';
          ro.set('note', note);
        } else ['sel', 'M', 'bp', 'forces', 'note'].forEach(k => ro.set(k, '—'));
      }
      const loop = kit.loop(() => frame(), box.stage);
      pickDefault();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ crystal field and colour */
  // g: the octahedral splitting with water (10³ cm⁻¹); P: free-ion pairing energy (cm⁻¹), for d⁴–d⁷
  const CF_IONS = [
    { id: 'Ti3+', el: 'Ti', ox: 3, g: 20.3 },
    { id: 'Cr3+', el: 'Cr', ox: 3, g: 17.4 },
    { id: 'Mn2+', el: 'Mn', ox: 2, g: 8.5, P: 25500 },
    { id: 'Fe3+', el: 'Fe', ox: 3, g: 14.0, P: 30000 },
    { id: 'Fe2+', el: 'Fe', ox: 2, g: 10.4, P: 17600 },
    { id: 'Co3+', el: 'Co', ox: 3, g: 18.2, P: 21000 },
    { id: 'Co2+', el: 'Co', ox: 2, g: 9.3, P: 22500 },
    { id: 'Ni2+', el: 'Ni', ox: 2, g: 8.5 },
    { id: 'Cu2+', el: 'Cu', ox: 2, g: 12.6 },
    { id: 'Zn2+', el: 'Zn', ox: 2, g: 10 }
  ];
  // f: Jørgensen's ligand factor; d: typical metal–donor distance (Å)
  const CF_LIGS = [
    { id: 'Br', f: 0.72, q: -1, el: 'Br', fx: 'Br', d: 2.50, name: 'bromide' },
    { id: 'Cl', f: 0.78, q: -1, el: 'Cl', fx: 'Cl', d: 2.35, name: 'chloride' },
    { id: 'F', f: 0.90, q: -1, el: 'F', fx: 'F', d: 1.95, name: 'fluoride' },
    { id: 'H2O', f: 1.00, q: 0, el: 'O', fx: 'H₂O', d: 2.05, name: 'water' },
    { id: 'NH3', f: 1.25, q: 0, el: 'N', fx: 'NH₃', d: 2.10, name: 'ammonia' },
    { id: 'en', f: 1.28, q: 0, el: 'N', fx: 'en', d: 1.98, name: 'ethane-1,2-diamine (en)' },
    { id: 'CN', f: 1.70, q: -1, el: 'C', fx: 'CN', d: 1.95, name: 'cyanide' }
  ];
  // measured octahedral splittings (cm⁻¹)
  const CF_MEAS = {
    'Ti3+': { H2O: 20300 }, 'Cr3+': { F: 15200, Cl: 13600, H2O: 17400, NH3: 21600, en: 21900, CN: 26600 }, 'Mn2+': { H2O: 8500 },
    'Fe3+': { F: 14000, H2O: 14000, CN: 35000 }, 'Fe2+': { H2O: 10400, CN: 33800 }, 'Co3+': { F: 13000, H2O: 18200, NH3: 22900, en: 23200, CN: 34800 },
    'Co2+': { H2O: 9300, NH3: 10200 }, 'Ni2+': { H2O: 8500, NH3: 10800, en: 11500 }, 'Cu2+': { H2O: 12600 }
  };
  const SUPCH = q => q === 0 ? '' : (Math.abs(q) > 1 ? String(Math.abs(q)).replace(/\d/g, d => SUP[d]) : '') + (q > 0 ? '⁺' : '⁻');
  function dConfig(dn, low) {
    const order = low ? 'tttttteeee' : 'tttee' + 'tttee';
    let t = 0, e = 0;
    for (let k = 0; k < dn; k++) if (order[k] === 't') t++; else e++;
    return { t, e, unp: (t <= 3 ? t : 6 - t) + (e <= 2 ? e : 4 - e) };
  }
  // absorption bands as multiples of Δo with relative strengths, a simple stand-in for the full ligand-field spectrum
  function cfBands(dn, low) {
    if (dn <= 0 || dn >= 10) return [];
    if (dn === 1) return [[1, 1], [0.86, 0.6]];                                   // Jahn–Teller shoulder
    if (dn === 3) return [[1, 1], [1.41, 1]];
    if (dn === 5) return low ? [[1, 0.25]] : [[2.22, 0.03], [2.72, 0.03], [2.93, 0.03]];   // high spin: spin-forbidden, very weak
    if (dn === 6) return low ? [[0.92, 1], [1.29, 1]] : [[1, 1]];
    if (dn === 7) return low ? [[1, 1]] : [[0.87, 0.3], [2.09, 1]];
    if (dn === 8) return [[1, 0.5], [1.62, 1], [2.98, 1]];
    return [[1, 1]];
  }
  // CIE 1931 colour-matching functions, multi-lobe Gaussian fit
  function cmf(l) {
    const g = (x, m, s1, s2) => { const t = (x - m) / (x < m ? s1 : s2); return Math.exp(-0.5 * t * t); };
    return [1.056 * g(l, 599.8, 37.9, 31.0) + 0.362 * g(l, 442.0, 16.0, 26.7) - 0.065 * g(l, 501.1, 20.4, 26.2),
      0.821 * g(l, 568.8, 46.9, 40.5) + 0.286 * g(l, 530.9, 16.3, 31.1),
      1.217 * g(l, 437.0, 11.8, 36.0) + 0.681 * g(l, 459.0, 26.0, 13.8)];
  }
  const xyzRGB = (x, y, z) => [3.2406 * x - 1.5372 * y - 0.4986 * z, -0.9689 * x + 1.8758 * y + 0.0415 * z, 0.0557 * x - 0.2040 * y + 1.0570 * z];
  // the colour of white light after passing through a solution with transmission T(λ), white-balanced
  function seenColour(T) {
    let X = 0, Y = 0, Z = 0, Xw = 0, Yw = 0, Zw = 0;
    for (let l = 380; l <= 780; l += 5) { const c = cmf(l), t = T(l); X += c[0] * t; Y += c[1] * t; Z += c[2] * t; Xw += c[0]; Yw += c[1]; Zw += c[2]; }
    const w = xyzRGB(Xw, Yw, Zw), v = xyzRGB(X, Y, Z);
    return v.map((c, i) => { let x = clamp(c / w[i], 0, 1); x = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; return Math.round(255 * x); });
  }
  // an approximate display colour for monochromatic light
  function lambdaRGB(l) {
    let r = 0, g = 0, b = 0;
    if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = (510 - l) / 20; }
    else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1;
    const f = l < 420 ? 0.35 + 0.65 * (l - 380) / 40 : l > 700 ? 0.35 + 0.65 * (780 - l) / 80 : 1;
    return [r, g, b].map(v => Math.round(255 * Math.pow(clamp(v * f, 0, 1), 0.8)));
  }
  const bandName = l => l < 430 ? 'violet' : l < 480 ? 'blue' : l < 500 ? 'blue-green' : l < 560 ? 'green' : l < 575 ? 'yellow-green' : l < 590 ? 'yellow' : l < 620 ? 'orange' : l < 750 ? 'red' : 'near infrared';
  function colourName(rgb) {
    const [r, g, b] = rgb.map(v => v / 255), M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2, d = M - m;
    if (d < 0.04) return l > 0.9 ? 'colourless' : 'grey';
    let h = M === r ? ((g - b) / d + 6) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
    const pale = l > 0.88 ? 'very pale ' : l > 0.76 ? 'pale ' : l < 0.3 ? 'deep ' : '';
    const nm = h < 15 || h >= 345 ? (l > 0.65 ? 'pink' : 'red') : h < 40 ? 'orange' : h < 65 ? 'yellow' : h < 85 ? 'yellow-green' : h < 160 ? 'green' : h < 195 ? 'blue-green' : h < 250 ? 'blue' : h < 285 ? 'violet' : (l > 0.65 ? 'pink-violet' : 'purple');
    return pale + nm;
  }
  const AX6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  // the complex in 3-D: donor atoms on the axes; water and ammonia with their hydrogens, en as chelate rings
  function complexMol(metal, L) {
    const atoms = [{ el: metal, x: 0, y: 0, z: 0 }], bonds = [];
    const at = (el, p) => { atoms.push({ el, x: p[0], y: p[1], z: p[2] }); return atoms.length - 1; };
    const pos = i => [atoms[i].x, atoms[i].y, atoms[i].z];
    if (L.id === 'en') {
      // each ring spans a cis pair; C positions solved for N–C 1.48 Å, C–C 1.52 Å, N–C–C 109.5°
      for (const [a, b] of [[0, 2], [1, 4], [3, 5]]) {
        const u = AX6[a], v = AX6[b], w = cross3(u, v);
        const n1 = at('N', mul3(u, 1.98)), n2 = at('N', mul3(v, 1.98));
        const c1 = at('C', add3(add3(mul3(u, 2.354), mul3(v, 1.391)), mul3(w, 0.338)));
        const c2 = at('C', add3(add3(mul3(u, 1.391), mul3(v, 2.354)), mul3(w, -0.338)));
        bonds.push([0, n1, 1], [0, n2, 1], [n1, c1, 1], [c1, c2, 1], [c2, n2, 1]);
      }
    } else for (const u of AX6) {
      const D = at(L.el, mul3(u, L.d));
      bonds.push([0, D, 1]);
      const p = unit3(cross3(u, [0.35, 0.8, 0.5])), q = cross3(u, p);
      const h = (dir, len) => { const i = at('H', add3(pos(D), mul3(unit3(dir), len))); bonds.push([D, i, 1]); };
      if (L.id === 'H2O') for (const s of [1, -1]) h(add3(mul3(u, 0.612), mul3(p, 0.791 * s)), 0.96);        // H–O–H 104.5°, planar at O
      else if (L.id === 'NH3') for (let k = 0; k < 3; k++) { const ph = k * 2 * Math.PI / 3; h(add3(mul3(u, 0.358), add3(mul3(p, 0.934 * Math.cos(ph)), mul3(q, 0.934 * Math.sin(ph)))), 1.01); }   // M–N–H 111°
      else if (L.id === 'CN') { const n = at('N', mul3(u, L.d + 1.16)); bonds.push([D, n, 3]); }
    }
    return { atoms, bonds, lone: [] };
  }

  Hyper.sim('bond-crystal-field', {
    title: 'Crystal field: splitting, spin and colour',
    blurb: `Choose a metal ion and a ligand. The six ligands split the metal's d orbitals into a lower t₂g set and an upper e_g set, Δo apart; the electrons fill them (high spin or low spin, depending on Δo against the pairing energy). Light of energy Δo lifts an electron across the gap: the spectrum at the bottom shows what is absorbed, and the tube shows what is left — the colour you see. Measured Δo values are used where known, otherwise Jørgensen's estimate (ligand factor × metal factor); you can also drag Δo yourself.

- Cr³⁺ with F⁻ → H₂O → NH₃ → CN⁻: as Δo grows the absorption moves to shorter wavelengths, and the colour goes from green through blue-violet to yellow.
- Fe²⁺ with water and with cyanide: high spin with four unpaired electrons, then low spin with none.
- Zn²⁺ (d¹⁰) is colourless whatever you do; Mn²⁺ (high-spin d⁵) is almost colourless, because all its transitions are spin-forbidden.
- Drag the complex to turn it.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const iI = Math.max(0, CF_IONS.findIndex(i => i.id === (params && params.metal)));
      let iL = CF_LIGS.findIndex(l => l.id === (params && params.lig));
      if (iL < 0) iL = 3;
      const i0 = params && params.metal ? iI : 1;
      const ctl = kit.controls(box.side, [
        { id: 'ion', type: 'select', label: 'Metal ion', options: CF_IONS.map((m, i) => [m.id.replace(/(\d)\+/, (s, d) => SUP[d] + '⁺'), i]), value: i0 },
        { id: 'lig', type: 'select', label: 'Ligand (six donor atoms)', options: CF_LIGS.map((l, i) => [l.fx + ' · ' + l.name, i]), value: iL },
        { id: 'Do', label: 'Δo (cm⁻¹)', min: 5000, max: 40000, step: 100, value: 17400 },
        { id: 'conc', label: 'Concentration', min: 0.2, max: 3, step: 0.05, value: 1 },
        { id: 'mol3d', type: 'check', label: 'Complex in 3-D', value: true },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true }
      ], id => {
        if (id === 'ion' || id === 'lig') setAuto();
        else if (id === 'Do') manual = true;
        loop.once();
      });
      const ro = kit.readout(box.side, [['cx', 'Complex'], ['dn', 'd electrons'], ['Do', 'Splitting Δo'], ['spin', 'Spin state'], ['mu', 'Magnetic moment'], ['cfse', 'CFSE'], ['abs', 'Absorbs'], ['seen', 'Colour seen']]);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.45, rotY: 0.6 });
      kit.mol.rotator(st, view, () => loop.once());
      let manual = false, mol = null, src = '';
      const ion = () => CF_IONS[V.ion] || CF_IONS[1];
      const lig = () => CF_LIGS[V.lig] || CF_LIGS[3];
      function setAuto() {
        const I = ion(), L = lig();
        const meas = CF_MEAS[I.id] && CF_MEAS[I.id][L.id];
        const Do = meas || Math.round(L.f * I.g * 10) * 100;
        src = meas ? 'measured' : 'estimate (Jørgensen f × g)';
        manual = false;
        ctl.set('Do', clamp(Do, 5000, 40000));
        mol = complexMol(I.el, L);
      }
      function frame(dt) {
        if (V.spin && !view.dragging) view.rotY += 0.3 * (dt || 0);
        const I = ion(), L = lig(), Do = V.Do;
        const grp = kit.chem.el(I.el).group, dn = grp - I.ox;
        const P = I.P ? 0.8 * I.P : null;
        const low = dn >= 4 && dn <= 7 && P != null && Do > P;
        const cf = dConfig(dn, low);
        const bands = cfBands(dn, low), wid = dn === 9 ? 2600 : dn === 1 ? 1700 : dn === 5 && !low ? 900 : 1500;
        const Aof = l => { const nu = 1e7 / l; let A = 0; for (const [k, a] of bands) { const x = (nu - k * Do) / wid; A += a * Math.exp(-0.5 * x * x); } return A; };
        const rgb = seenColour(l => Math.pow(10, -V.conc * Aof(l)));
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const n = L.id === 'en' ? 3 : 6, qc = I.ox + n * L.q;
        const formula = '[' + I.el + (L.fx.length > 2 || L.id === 'en' || L.id === 'CN' ? '(' + L.fx + ')' : L.fx) + SUB[n] + ']' + SUPCH(qc);
        kit.label(c, formula, 14, 18, { size: 16, weight: 650 });
        kit.label(c, 'd' + String(dn).replace(/\d/g, d => SUP[d]) + ' · ' + (dn >= 4 && dn <= 7 && P ? (low ? 'low spin' : 'high spin') : 'one arrangement only'), 14, 38, { size: 12, color: C.muted });
        // ---- splitting diagram
        const top = 56, H1 = H - 170, dx0 = 16, dxW = W * 0.4;
        const s = (H1 - 30) / 40000, yb = top + 14 + 0.6 * (H1 - 30);
        const yE = yb - 0.6 * Do * s, yT = yb + 0.4 * Do * s;
        const bw = 26, bg = 6;
        const lineAt = (x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + bw, y); c.stroke(); };
        const elec = (x, y, e) => {
          if (e >= 1) kit.arrow(c, x + bw / 2 - (e === 2 ? 5 : 0), y + 9, x + bw / 2 - (e === 2 ? 5 : 0), y - 9, C.text, 1.5, 5);
          if (e === 2) kit.arrow(c, x + bw / 2 + 5, y - 9, x + bw / 2 + 5, y + 9, C.text, 1.5, 5);
        };
        const fx0 = dx0 + 6, sx0 = dx0 + dxW * 0.42;
        for (let k = 0; k < 5; k++) lineAt(fx0 + k * (bw * 0.55 + 2), yb, C.faint);
        kit.label(c, 'free ion', fx0, yb + 16, { size: 10.5, color: C.muted });
        c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(fx0 + 5 * (bw * 0.55 + 2), yb); c.lineTo(sx0 - 4, yE); c.moveTo(fx0 + 5 * (bw * 0.55 + 2), yb); c.lineTo(sx0 - 4, yT); c.stroke(); c.setLineDash([]);
        const eBox = [0, 0], tBox = [0, 0, 0];
        for (let k = 0; k < cf.t; k++) tBox[k % 3]++;
        for (let k = 0; k < cf.e; k++) eBox[k % 2]++;
        for (let k = 0; k < 3; k++) { lineAt(sx0 + k * (bw + bg), yT, C.ok); elec(sx0 + k * (bw + bg), yT, tBox[k]); }
        for (let k = 0; k < 2; k++) { lineAt(sx0 + (k + 0.5) * (bw + bg), yE, C.bad); elec(sx0 + (k + 0.5) * (bw + bg), yE, eBox[k]); }
        kit.label(c, 't₂g', sx0 + 3 * (bw + bg) + 2, yT, { size: 12, color: C.ok });
        kit.label(c, 'e_g', sx0 + 2.5 * (bw + bg) + 2, yE, { size: 12, color: C.bad });
        const ax = Math.min(dx0 + dxW - 8, sx0 + 3 * (bw + bg) + 34);
        if (yT - yE > 6) { kit.arrow(c, ax, yT, ax, yE, C.accent, 1.6, 6); kit.arrow(c, ax, yE, ax, yT, C.accent, 1.6, 6); }
        kit.label(c, 'Δo', ax + 5, (yE + yT) / 2, { size: 12.5, weight: 650, color: C.accent });
        kit.label(c, '+0.6Δo', sx0 - 4, yE - 13, { size: 10, color: C.muted });
        kit.label(c, '−0.4Δo', sx0 - 4, yT + 16, { size: 10, color: C.muted });
        // ---- the complex in 3-D
        if (V.mol3d && mol) {
          const cx = W * 0.6, cy = top + H1 / 2 - 6;
          view.scale = clamp(Math.min(W * 0.2, H1 / 2) / 4.2, 14, 60);
          kit.mol.draw(c, mol, view, { cx, cy, style: 'ball', labels: false, centre: [0, 0, 0] });
          kit.label(c, 'drag to turn', cx, top + H1 - 4, { size: 10.5, color: C.faint, align: 'center' });
        }
        // ---- the tube
        const tx = W * 0.82, tw = Math.min(56, W * 0.1), ty0 = top + 4, th = H1 - 30;
        c.fillStyle = 'rgb(' + rgb.join(',') + ')';
        c.beginPath(); c.moveTo(tx, ty0 + th * 0.25); c.lineTo(tx, ty0 + th - tw / 2); c.arc(tx + tw / 2, ty0 + th - tw / 2, tw / 2, Math.PI, 0, true); c.lineTo(tx + tw, ty0 + th * 0.25); c.closePath(); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(tx, ty0); c.lineTo(tx, ty0 + th - tw / 2); c.arc(tx + tw / 2, ty0 + th - tw / 2, tw / 2, Math.PI, 0, true); c.lineTo(tx + tw, ty0); c.stroke();
        const cname = colourName(rgb);
        kit.label(c, 'seen:', tx + tw / 2, ty0 + th + 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, cname, tx + tw / 2, ty0 + th + 26, { size: 12, weight: 650, align: 'center' });
        // ---- the spectrum
        const sx = 60, sw = W - 80, sy = H - 52, sh = 16;
        const Xl = l => sx + (l - 380) / (750 - 380) * sw;
        for (let l = 380; l < 750; l += 2) { c.fillStyle = 'rgb(' + lambdaRGB(l).join(',') + ')'; c.fillRect(Xl(l), sy, Xl(l + 2) - Xl(l) + 0.6, sh); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx, sy, sw, sh);
        for (const l of [400, 500, 600, 700]) kit.label(c, l + ' nm', Xl(l), sy + sh + 11, { size: 10, color: C.muted, align: 'center' });
        let Amax = 0, lmax = 0;
        for (let l = 380; l <= 750; l += 2) { const A = Aof(l); if (A > Amax) { Amax = A; lmax = l; } }
        const scaleA = 70 / Math.max(1, Amax * V.conc);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
        for (let l = 380; l <= 750; l += 2) { const y = sy - 4 - V.conc * Aof(l) * scaleA; if (l === 380) c.moveTo(Xl(l), y); else c.lineTo(Xl(l), y); }
        c.stroke();
        kit.label(c, 'absorbance', sx - 6, sy - 10, { size: 10, color: C.muted, align: 'right' });
        const visible = Amax * V.conc > 0.04;
        if (visible) {
          kit.arrow(c, Xl(lmax), sy - 30 - V.conc * Amax * scaleA, Xl(lmax), sy - 8 - V.conc * Amax * scaleA, C.accent, 1.6, 6);
          kit.label(c, 'absorbs ' + lmax + ' nm (' + bandName(lmax) + ')', clamp(Xl(lmax), sx + 70, sx + sw - 70), sy - 40 - V.conc * Amax * scaleA, { size: 11.5, weight: 650, color: C.accent, align: 'center' });
        } else kit.label(c, dn >= 10 || dn <= 0 ? 'no d–d transition: nothing absorbed in the visible' : 'only very weak absorption in the visible', sx + sw / 2, sy - 22, { size: 11.5, color: C.muted, align: 'center' });
        // ---- read-outs
        ro.set('cx', formula + (L.id === 'en' ? ' (three en, six N donors)' : ''));
        ro.set('dn', 'd' + dn + ': t₂g' + String(cf.t).replace(/\d/g, d => SUP[d]) + ' e_g' + String(cf.e).replace(/\d/g, d => SUP[d]));
        ro.set('Do', Math.round(Do) + ' cm⁻¹ = ' + (Do * KJ_PER_CM).toFixed(0) + ' kJ/mol · ' + (manual ? 'set by hand' : src));
        ro.set('spin', dn >= 4 && dn <= 7 && P ? (low ? 'low spin: Δo > P ≈ ' : 'high spin: Δo < P ≈ ') + Math.round(P) + ' cm⁻¹' : 'no choice for d' + dn);
        ro.set('mu', cf.unp + ' unpaired · ' + Math.sqrt(cf.unp * (cf.unp + 2)).toFixed(2) + ' μB (spin only)');
        const cfse = (-0.4 * cf.t + 0.6 * cf.e);
        ro.set('cfse', Math.abs(cfse) < 1e-9 ? '0 (no stabilisation)' : minus(cfse.toFixed(1)) + ' Δo = ' + minus(Math.round(cfse * Do * KJ_PER_CM)) + ' kJ/mol');
        const where = l => Math.round(l) + ' nm ' + (l > 750 ? '(infrared)' : l < 380 ? '(ultraviolet)' : '(' + bandName(l) + ')');
        const list = bands.map(([k]) => 1e7 / (k * Do)).map(where).join(', ');     // the main band first
        ro.set('abs', dn >= 10 ? 'nothing: d¹⁰ has no d–d transition' : dn === 5 && !low ? 'only faint, spin-forbidden bands: ' + list
          : dn === 5 && low ? list + ' — the real ion\'s red-orange colour comes from charge transfer, not modelled here'
            : list + (dn === 9 ? ' (one broad, Jahn–Teller-distorted band)' : ''));
        ro.set('seen', cname);
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      setAuto();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

})();
