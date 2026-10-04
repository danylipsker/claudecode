/* HYPER-OPTICS · sims/laser-principles.js — simulations of the topic "How lasers work".
 *   lp-emission    one atom and one photon: absorption, spontaneous and stimulated emission; then a row of atoms
 *   lp-inversion   three- and four-level schemes: populations against pump rate, gain against the cavity's loss
 *   lp-cavity      two mirrors and a gain medium: the light builds up round trip by round trip until gain = loss
 *   lp-stability   the g₁–g₂ stability diagram with a draggable point, and a ray bouncing between the mirrors
 *   lp-modes       longitudinal modes under the gain curve (with an etalon) and the transverse TEM patterns
 *   lp-coherence   linewidth, wave trains, fringe visibility against path difference
 *   lp-pulses      average power, repetition rate, duration, spot size → energy, peak power, irradiance, fluence
 *   lp-switching   Q-switching (rate equations) and mode-locking (modes added in step or at random)
 *   lp-compare     lamp, LED and laser side by side: spectral width, coherence, divergence, radiance
 *   lp-safety      power, beam and distance against the laser classes, the MPE and the nominal ocular hazard distance
 *   lp-eye         where a beam of each wavelength is absorbed in the eye, and what eyewear must remove
 * The numbers come from kit.optics (laser cavity, beam, safety and eye tables); the drawing from kit.osym. Where a
 * model is a schematic (the pump schemes, the cavity build-up, the pulse train) the blurb says so.
 */
(function () {
  'use strict';
  const TAU = 2 * Math.PI, D2R = Math.PI / 180, R2D = 180 / Math.PI, C0 = 299792458;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lerp = (a, b, t) => a + (b - a) * t;
  const mod = (x, m) => ((x % m) + m) % m;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = n => String(n).replace('-', '⁻').replace(/\d/g, d => SUP[+d]);
  // 1.2 × 10⁻³³ ; plain numbers between 0.01 and 10 000
  function sci(v, d) {
    if (!(v > 0) || !Number.isFinite(v)) return '0';
    if (v >= 0.01 && v < 1e4) return String(+v.toPrecision((d == null ? 1 : d) + 1));
    const p = v.toExponential(d == null ? 1 : d).split('e');
    return p[0] + ' × 10' + sup(+p[1]);
  }
  const PFX = [[1e12, 'T'], [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p'], [1e-15, 'f']];
  function eng(v, unit, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0 ' + unit;
    const a = Math.abs(v);
    let p = PFX[PFX.length - 1];
    for (const q of PFX) if (a >= q[0] * 0.9995) { p = q; break; }
    return +(v / p[0]).toPrecision(sig || 3) + ' ' + p[1] + unit;
  }
  function fmtLen(m) {
    if (!Number.isFinite(m)) return '—';
    const a = Math.abs(m);
    if (a >= 1e3) return +(m / 1e3).toPrecision(3) + ' km';
    if (a >= 1) return +m.toPrecision(3) + ' m';
    if (a >= 1e-3) return +(m * 1e3).toPrecision(3) + ' mm';
    if (a >= 1e-6) return +(m * 1e6).toPrecision(3) + ' µm';
    return +(m * 1e9).toPrecision(3) + ' nm';
  }
  const pc = x => x >= 0.0995 ? (100 * x).toFixed(0) + ' %' : x >= 0.00995 ? (100 * x).toFixed(1) + ' %' : x >= 1e-5 ? String(+(100 * x).toPrecision(2)) + ' %' : x > 0 ? '< 0.001 %' : '0 %';
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const hash = n => { const r = rng(Math.imul(n | 0, 2654435761)); r(); return r(); };
  // wrap a line of text into the width w; returns the next y
  function wrap(c, kit, text, x, y, w, lh, o) {
    const words = String(text).split(' ');
    let line = '';
    for (const wd of words) {
      const t = line ? line + ' ' + wd : wd;
      c.save(); c.font = '500 ' + ((o && o.size) || 12.5) + 'px sans-serif'; const tw = c.measureText(t).width; c.restore();
      if (tw > w && line) { kit.label(c, line, x, y, o); y += lh; line = wd; } else line = t;
    }
    if (line) { kit.label(c, line, x, y, o); y += lh; }
    return y;
  }
  // a Gaussian wave packet along +x of a rotated frame: centre sc, full length len, drawn only for s in [s0, s1].
  // The wave is attached to the envelope, so a packet and its stimulated copy are exactly in step when they share sc and phi0.
  function packet(c, ox, oy, ang, s0, s1, sc, len, amp, lam, phi0, color, lw) {
    if (!(s1 > s0) || !(amp > 0)) return;
    c.save(); c.translate(ox, oy); c.rotate(ang); c.strokeStyle = color; c.lineWidth = lw || 1.8; c.lineJoin = 'round'; c.beginPath();
    let first = true;
    for (let s = s0; s <= s1; s += 1.5) {
      const u = (s - sc) / len, env = Math.exp(-Math.pow(u * 4.2, 2)), y = -amp * env * Math.sin(TAU * (s - sc) / lam + phi0);
      if (first) c.moveTo(s, y); else c.lineTo(s, y);
      first = false;
    }
    c.stroke(); c.restore();
  }

  /* ================================================================ absorption, spontaneous and stimulated emission */
  Hyper.sim('lp-emission', {
    title: 'Absorption, spontaneous emission and stimulated emission',
    blurb: `An atom has two energy levels, **E₁** (ground) and **E₂** (excited), a photon's energy apart. A photon of exactly that energy can lift the atom up (**absorption**); an excited atom can drop on its own and send out a photon in a random direction (**spontaneous emission**); or a passing photon can *make* it drop (**stimulated emission**) — and the new photon is a perfect copy of the one that provoked it. The last view puts 14 atoms in a row, to see which of the two wins.

**Try this**
- In *Stimulated emission* watch the two outgoing waves: same colour, same direction, crests lined up on the dashed line. One photon in, two out.
- In *Spontaneous emission* run it several times: each time the direction and the phase are different, and the delay varies. Nothing links this photon to any other.
- In *A medium of 14 atoms* start from **Thermal equilibrium** (nearly all atoms in the ground state): the photon is absorbed and the beam dies away. At **Half and half** the medium is transparent. Only when more than half the atoms are excited does the beam grow — that is **population inversion**.
- Slide the colour towards blue: the level spacing grows, and the thermal ratio N₂/N₁ at 300 K collapses (read-out). At room temperature no ordinary material has any atoms in the upper level to speak of.

The picture is schematic: a real photon is a quantum object, not a drawn wave, and the real chances per atom are far smaller than the "×1.2 per atom" used here to make the effect visible.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 330 });
      const MODES = [['Absorption', 'abs'], ['Spontaneous emission', 'spont'], ['Stimulated emission', 'stim'], ['A medium of 14 atoms', 'med']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What happens', options: MODES, value: params.mode || 'stim' },
        { id: 'nm', label: 'Colour of the light (sets the level spacing)', min: 450, max: 700, step: 5, value: params.nm || 633, unit: 'nm' },
        { id: 'p', label: 'Atoms that are excited', min: 0, max: 100, step: 1, value: params.p != null ? params.p : 86, unit: '%' },
        { id: 'speed', label: 'Speed', min: 0.2, max: 2, step: 0.1, value: 1 },
        { type: 'buttons', items: [{ id: 'thermal', label: 'Thermal equilibrium' }, { id: 'half', label: 'Half and half' }, { id: 'inv', label: 'Inverted', primary: true }, { id: 'again', label: 'Run again' }] }
      ], id => {
        if (id === 'thermal') ctl.set('p', 0);
        if (id === 'half') ctl.set('p', 50);
        if (id === 'inv') ctl.set('p', 86);
        if (id === 'again' || id === 'mode') clock = 0;
        sync(); loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['what', 'What happens'], ['E', 'Photon energy hν'], ['therm', 'N₂ ÷ N₁ at 300 K, thermal equilibrium'], ['frac', 'Atoms excited'], ['net', 'Each atom changes the beam by'], ['out', 'Light out ÷ light in']]);
      const sync = () => { const m = V.mode === 'med'; ctl.show('p', m); ctl.show('thermal', m); ctl.show('half', m); ctl.show('inv', m); ro.show('frac', m); ro.show('net', m); ro.show('out', m); };
      let clock = 0;
      const PERIOD = 7.5, NAT = 14, A = 0.18;
      const ANG = [-70, -40, -10, 25, 55, 85, 120, 155];
      // the atom: a nucleus and one electron on a small orbit (ground) or a large one (excited)
      function atom(c, C, x, y, r, excited, col, t) {
        c.save();
        c.fillStyle = excited ? col.replace(/rgb\((.*)\)/, 'rgba($1,0.5)') : S.glass(0.12); c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
        c.setLineDash([2, 3]); c.strokeStyle = C.faint; c.beginPath(); c.arc(x, y, r * (excited ? 0.78 : 0.42), 0, TAU); c.stroke(); c.setLineDash([]);
        c.restore();
        kit.dot(c, x, y, Math.max(2, r * 0.1), C.muted);
        const a = t * (excited ? 2.4 : 4.2), rr = r * (excited ? 0.78 : 0.42);
        kit.dot(c, x + rr * Math.cos(a), y + rr * Math.sin(a), Math.max(2.5, r * 0.11), excited ? col : C.accent);
      }
      function levels(c, C, x0, y0, w, h, excited, col, arrow) {
        const yU = y0 + h * 0.14, yL = y0 + h * 0.86;
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, yU); c.lineTo(x0 + w, yU); c.moveTo(x0, yL); c.lineTo(x0 + w, yL); c.stroke(); c.restore();
        kit.label(c, 'E₂', x0 + w + 7, yU, { color: C.muted, size: 12 });
        kit.label(c, 'E₁', x0 + w + 7, yL, { color: C.muted, size: 12 });
        kit.dot(c, x0 + w * 0.72, (excited ? yU : yL) - 7, 5.5, excited ? col : C.accent);
        if (arrow) kit.arrow(c, x0 + w * 0.28, arrow === 'up' ? yL - 2 : yU + 2, x0 + w * 0.28, arrow === 'up' ? yU + 4 : yL - 4, col, 2.4, 9);
        kit.label(c, 'hν = E₂ − E₁', x0 + w * 0.34, (yU + yL) / 2, { color: C.muted, size: 11.5 });
      }
      const loop = kit.loop(dt => {
        clock += dt * V.speed;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const col = S.nm(V.nm), Ep = O.photonEnergy(V.nm), lam = 15, vel = 0.3 * W, Lp = 0.2 * W;
        const idx = Math.floor(clock / PERIOD), t = clock - idx * PERIOD;
        ro.set('E', Ep.toFixed(3) + ' eV  (' + (O.frequency(V.nm) / 1e12).toFixed(0) + ' THz)');
        ro.set('therm', sci(Math.exp(-Ep / 0.025852), 1));
        const ay = Hh * 0.64, ax = W * 0.5, r = Math.min(26, Hh * 0.075);
        let caption = '';
        if (V.mode !== 'med') {
          const mode = V.mode;
          let excited = mode !== 'abs', arrow = null, ph0 = TAU * hash(idx * 7 + 1);
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(0, ay); c.lineTo(W, ay); c.stroke(); c.restore();
          if (mode === 'abs') {
            const u = clamp(t / 2.1, 0, 1), sc = lerp(-Lp / 2, ax, u);
            if (t < 2.1) packet(c, 0, ay, 0, Math.max(0, sc - Lp), Math.min(sc + Lp, ax - r), sc, Lp, 11, lam, ph0, col, 2);
            else { excited = true; if (t < 2.5) arrow = 'up'; }
            caption = t < 2.1 ? 'A photon whose energy matches E₂ − E₁ approaches an atom in its ground state.' : 'The photon has vanished. Its energy is now stored in the atom, which is excited.';
          } else if (mode === 'spont') {
            const te = 1.6 + 2 * hash(idx * 11 + 3), a = ANG[Math.floor(hash(idx * 13 + 5) * ANG.length)] * D2R;
            if (t < te) caption = 'An excited atom. Nothing disturbs it, but it will not stay excited for ever.';
            else {
              excited = false; if (t < te + 0.4) arrow = 'down';
              const sc = vel * (t - te) * 0.8;
              packet(c, ax, ay, a, r, Math.min(sc + Lp, 1.5 * W), sc, Lp, 11, lam, ph0, col, 2);
              caption = 'It dropped on its own and emitted a photon: the direction and the phase are chance, and the moment was too.';
            }
          } else {
            const tin = 2.1;
            if (t < tin) {
              const sc = lerp(-Lp / 2, ax, t / tin);
              packet(c, 0, ay, 0, Math.max(0, sc - Lp), Math.min(sc + Lp, ax - r), sc, Lp, 9, lam, ph0, col, 2);
              caption = 'An excited atom, and a photon of the right energy on its way past.';
            } else {
              excited = false; if (t < tin + 0.4) arrow = 'down';
              const sc = vel * (t - tin) * 0.8;
              for (const dy of [-10, 10]) packet(c, 0, ay + dy, 0, ax + r, Math.min(ax + sc + Lp, 1.4 * W), ax + sc, Lp, 9, lam, ph0, col, 2);
              // a dashed line through a crest of both waves: they are in step
              let d = lam * ((Math.PI / 2 - ph0) / TAU); d = mod(d, lam); if (d > lam / 2) d -= lam;
              const xc = ax + sc + d;
              if (xc > ax + r + 4 && xc < W - 4) { c.save(); c.strokeStyle = C.warn; c.setLineDash([3, 3]); c.lineWidth = 1; c.beginPath(); c.moveTo(xc, ay - 30); c.lineTo(xc, ay + 30); c.stroke(); c.restore(); }
              caption = 'The atom dropped and a second photon appeared, a copy of the first: same colour, same direction, same phase, same polarization.';
            }
          }
          atom(c, C, ax, ay, r, excited, col, clock);
          levels(c, C, W * 0.07, Hh * 0.06, W * 0.17, Hh * 0.36, excited, col, arrow);
          const Cx = { abs: 'one photon in, none out', spont: 'none in, one out, in a random direction', stim: 'one photon in, two identical photons out' };
          ro.set('what', Cx[mode]);
        } else {
          const k = Math.round(V.p / 100 * NAT);
          const order = Array.from({ length: NAT }, (_, i) => i).sort((a, b) => mod((a + 0.5) * 0.6180339887, 1) - mod((b + 0.5) * 0.6180339887, 1));
          const up = new Set(order.slice(0, k));
          const ex = i => up.has(i);
          const xs = i => W * (0.1 + 0.8 * (i + 0.5) / NAT);
          // the beam: its brightness follows the running product of ×e^A (excited) and ×e^−A (ground)
          const nAt = [1]; for (let i = 0; i < NAT; i++) nAt.push(nAt[i] * Math.exp(ex(i) ? A : -A));
          const nOf = x => { let n = 1; for (let i = 0; i < NAT; i++) if (xs(i) < x) n = nAt[i + 1]; return n; };
          const hw = x => Math.min(Hh * 0.2, 4 + 8 * Math.sqrt(nOf(x)));
          S.beam(c, 0.02 * W, 0.98 * W, ay, hw, { nm: V.nm, alpha: 0.18 });
          for (let i = 0; i < NAT; i++) atom(c, C, xs(i), ay, 9, ex(i), col, clock + i);
          const sc = lerp(-Lp / 2, W + Lp / 2, mod(clock / 5.5, 1));
          packet(c, 0, ay, 0, Math.max(0, sc - Lp), Math.min(W, sc + Lp), sc, Lp, 2 + 5 * Math.sqrt(nOf(clamp(sc, 0, W))), lam, 0, col, 2);
          levels(c, C, W * 0.07, Hh * 0.06, W * 0.17, Hh * 0.36, true, col, null);
          caption = k * 2 > NAT ? 'More atoms up than down: the beam gains more from stimulated emission than it loses to absorption. It grows.' : k * 2 === NAT ? 'Equal numbers up and down: absorption and stimulated emission cancel. The medium is transparent.' : 'Most atoms are in the ground state: the beam is absorbed. This is how every ordinary material behaves.';
          ro.set('what', k + ' of ' + NAT + ' atoms up');
          ro.set('frac', k + ' of ' + NAT + '  (' + Math.round(100 * k / NAT) + ' %)');
          ro.set('net', '× ' + Math.exp(A).toFixed(2) + ' (excited atom) or × ' + Math.exp(-A).toFixed(2) + ' (ground atom)');
          ro.set('out', '× ' + nAt[NAT].toFixed(2));
        }
        wrap(c, kit, caption, W * 0.05, Hh - 38, W * 0.9, 17, { color: C.text, size: 12.5 });
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.start();
    }
  });

  /* ================================================================ pumping to inversion */
  Hyper.sim('lp-inversion', {
    title: 'Pumping to inversion: three-level and four-level lasers',
    blurb: `The same pump, two level schemes. **Three-level** (like the ruby of 1960): the laser transition ends on the ground state, so more than *half* of all the ions must be lifted before there is any gain. **Four-level** (like Nd:YAG): the lower laser level is empty because it decays at once, so *any* population in the upper level is an inversion, and only the cavity's loss has to be overcome.

The bars give the steady-state populations from a simple rate-equation model. The graph shows the inversion (upper minus lower population, as a fraction of all the ions) against the pump rate W times the upper-level lifetime τ — a number that is 1 when the pump lifts about one ion per lifetime. The dashed line is the inversion the gain medium needs to overcome the loss, and it depends on the material: it is the threshold gain divided by σN (cross-section times ion density), 0.4 cm⁻¹ for a ruby-like rod and 39 cm⁻¹ for an Nd:YAG-like rod.

**Try this**
- Three-level, sliding the pump up from the left: the medium first absorbs (negative inversion), is transparent at Wτ = 1, and reaches its threshold only a little beyond that.
- Switch to four-level: the threshold sits more than three decades further left. The ratio of the two threshold pump rates is the reason four-level materials dominate.
- Raise the cavity loss (threshold gain): the threshold moves right in both, but in the three-level medium it hardly matters, because the "half the ions" hurdle comes first.
- Press *Set the pump to threshold*, then go a little above: the gain is clamped to the loss and every extra bit of pump becomes laser output.

Schematic: the model ignores stimulated emission below threshold, pump saturation and the population of the pump band; the numbers (σ, N, lifetimes) are typical of ruby and Nd:YAG, quoted to one or two figures.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'pump rate × upper-level lifetime, Wτ', min: 1e-5, max: 1e3, log: true }, y: { label: 'inversion (n₂ − n_lower)', min: -1.05, max: 1.05 }, series: [] }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'scheme', type: 'select', label: 'Level scheme', options: [['Three-level: ruby, 694.3 nm', '3'], ['Four-level: Nd:YAG, 1064 nm', '4']], value: params.scheme || '4' },
        { id: 'w', label: 'Pump rate × lifetime (Wτ)', min: 1e-5, max: 1e3, log: true, sig: 2, value: params.w || 0.5, fmt: v => kit.fmt(v, 2) },
        { id: 'gth', label: 'Threshold gain of the cavity', min: 0.001, max: 0.05, log: true, sig: 2, value: params.gth || 0.01, fmt: v => kit.fmt(v, 2) + ' cm⁻¹' },
        { type: 'buttons', items: [{ id: 'thr', label: 'Set the pump to threshold', primary: true }] }
      ], id => { if (id === 'thr') ctl.set('w', thr()); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n2', 'Population of the upper laser level'], ['nl', 'Population of the lower laser level'], ['dn', 'Inversion'], ['g', 'Gain'], ['need', 'Inversion needed at threshold'], ['pth', 'Pump needed for threshold, Wτ'], ['state', 'The medium is']]);
      const EPS = 1e-3, SN = { '3': 0.4, '4': 39 };          // σN in cm⁻¹: ruby-like rod, Nd:YAG-like rod
      const pops = (s, w) => {
        if (s === '3') { const n1 = 1 / (1 + w * (1 + EPS)); return { n1, n2: w * n1, n3: EPS * w * n1, low: n1 }; }
        const n0 = 1 / (1 + w * (1 + 2 * EPS)); return { n0, n1: EPS * w * n0, n2: w * n0, n3: EPS * w * n0, low: EPS * w * n0 };
      };
      const dn = (s, w) => { const p = pops(s, w); return p.n2 - p.low; };
      const need = () => V.gth / SN[V.scheme];
      function thr() {
        let lo = -9, hi = 9; const x = need(), s = V.scheme;
        for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (dn(s, Math.pow(10, m)) < x) lo = m; else hi = m; }
        return Math.pow(10, (lo + hi) / 2);
      }
      let key = '';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = V.scheme, p = pops(s, V.w);
        const lv = s === '3'
          ? [{ id: 3, y: 0.1, name: 'pump band' }, { id: 2, y: 0.42, name: 'upper laser level' }, { id: 1, y: 0.88, name: 'ground = lower laser level' }]
          : [{ id: 3, y: 0.08, name: 'pump band' }, { id: 2, y: 0.34, name: 'upper laser level' }, { id: 1, y: 0.64, name: 'lower laser level' }, { id: 0, y: 0.92, name: 'ground state' }];
        const X0 = W * 0.06, X1 = W * 0.56, laserCol = s === '3' ? S.nm(694.3) : C.warn;
        const Y = f => Hh * (0.04 + 0.9 * f);
        const val = id => s === '3' ? (id === 3 ? p.n3 : id === 2 ? p.n2 : p.n1) : (id === 3 ? p.n3 : id === 2 ? p.n2 : id === 1 ? p.n1 : p.n0);
        for (const l of lv) {
          const y = Y(l.y);
          if (l.id === 3) { c.fillStyle = C.dark ? 'rgba(120,200,160,0.18)' : 'rgba(40,150,100,0.15)'; c.fillRect(X0, y - 9, X1 - X0, 18); }
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X0, y); c.lineTo(X1, y); c.stroke();
          kit.label(c, l.name, X0 + 4, y - 11, { color: C.muted, size: 11.5 });
          // the population bar
          const n = val(l.id), bx = W * 0.6, bw = W * 0.3;
          c.fillStyle = C.faint; c.globalAlpha = 0.25; c.fillRect(bx, y - 5, bw, 10); c.globalAlpha = 1;
          c.fillStyle = l.id === 2 ? C.accent : C.muted; c.fillRect(bx, y - 5, Math.max(n > 0 ? 1.5 : 0, bw * n), 10);
          kit.label(c, pc(n), bx + bw + 6, y, { color: C.text, size: 11.5 });
        }
        const yy = id => Y(lv.find(l => l.id === id).y);
        const bot = s === '3' ? 1 : 0;
        kit.arrow(c, W * (s === '3' ? 0.16 : 0.12), yy(bot) - 3, W * (s === '3' ? 0.16 : 0.12), yy(3) + 4, C.ok, 2.4, 9);
        kit.label(c, 'pump', W * (s === '3' ? 0.16 : 0.12) + 7, (yy(bot) + yy(3)) / 2, { color: C.ok, size: 11.5 });
        c.save(); c.setLineDash([4, 3]); kit.arrow(c, W * 0.27, yy(3) + 2, W * 0.27, yy(2) - 3, C.faint, 1.8, 7); c.restore();
        kit.label(c, 'fast, no light', W * 0.27 + 6, (yy(3) + yy(2)) / 2, { color: C.faint, size: 11 });
        kit.arrow(c, W * 0.42, yy(2) + 2, W * 0.42, yy(1) - 3, laserCol, 3, 10);
        kit.label(c, s === '3' ? 'laser, 694.3 nm' : 'laser, 1064 nm (invisible)', W * 0.42 + 7, (yy(2) + yy(1)) / 2, { color: laserCol, size: 11.5, weight: 650 });
        if (s === '4') { kit.arrow(c, W * 0.5, yy(1) + 2, W * 0.5, yy(0) - 3, C.faint, 1.8, 7); kit.label(c, 'fast', W * 0.5 + 6, (yy(1) + yy(0)) / 2, { color: C.faint, size: 11 }); }
        const d = p.n2 - p.low, x = need(), g = SN[s] * d, wth = thr();
        const above = g >= V.gth;
        ro.set('n2', pc(p.n2)); ro.set('nl', pc(p.low)); ro.set('dn', (d >= 0 ? '+' : '−') + pc(Math.abs(d)) + ' of the ions');
        ro.set('g', (g >= 0 ? '+' : '−') + Math.abs(g).toPrecision(2) + ' cm⁻¹ (threshold ' + V.gth.toPrecision(2) + ')');
        ro.set('need', pc(x) + ' of the ions');
        ro.set('pth', sci(wth, 1) + (s === '3' ? ' (about one ion lifted per lifetime)' : ''));
        ro.set('state', d < 0 ? 'absorbing: the lower level holds more atoms' : !above ? 'amplifying, but not enough to beat the loss' : 'lasing: the gain is clamped to the loss; extra pump becomes output');
        const k = [s, V.gth].join('|');
        if (k !== key) {
          key = k; const pts = [];
          for (let i = 0; i <= 96; i++) { const w = Math.pow(10, -5 + 8 * i / 96); pts.push([w, dn(s, w)]); }
          plot.set({ series: [{ pts, label: 'inversion', color: C.series[0], width: 2.6 }], hlines: [{ y: x, label: 'needed for threshold', color: C.warn }] });
        }
        plot.set({ marks: [{ x: V.w, y: d, color: above ? C.ok : C.accent, label: above ? 'lasing' : '' }], vlines: [{ x: wth, label: 'threshold', color: C.faint }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the cavity: gain against loss */
  Hyper.sim('lp-cavity', {
    title: 'The laser cavity: the light builds up until gain equals loss',
    blurb: `A gain medium between two mirrors. Light that starts as a trace of spontaneous emission makes round trips; each trip it is amplified by the medium and trimmed by the mirrors and other losses. If the amplification beats the losses the light grows exponentially — until it is strong enough to *saturate* the gain (use up the excited atoms faster than the pump replaces them), and the gain falls to exactly the level of the loss. Then the power holds steady: that is a laser running. The beam that leaves is what the output coupler lets through.

**Try this**
- Press **Switch the pump on**: the circulating power climbs from almost nothing (graph: power in units of the saturation power, logarithmic) over some hundreds of round trips and levels off.
- Lower the small-signal gain until it falls short of the needed gain (read-out *Gain above threshold* below 1.00): nothing builds up. This is the threshold.
- Set the output coupler to 99.9 %: the loss is tiny, the power inside is huge, but almost none comes out. Set it to 30 %: it all leaks out before it can build up. Choose *Output against coupling* for the graph: there is a best value in between.
- Lengthen the cavity: the round trip takes longer, so the build-up takes more *time* and the photon lifetime grows — but the threshold gain per pass is the same.

Schematic: a simple saturation model, gain = small-signal gain ÷ (1 + P ⁄ P_sat) with one number for the power; real lasers have standing waves, spatial hole burning and pump dynamics.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'round trips', min: 0 }, y: { label: 'power inside, in units of P_sat', log: true, min: 1e-9, max: 10 }, series: [] }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'g0', label: 'Small-signal gain per pass', min: 0.5, max: 100, log: true, sig: 2, value: params.g0 || 6, unit: '%' },
        { id: 'r2', label: 'Output coupler reflectance R₂', min: 5, max: 99.9, step: 0.1, value: params.r2 || 98, unit: '%' },
        { id: 'r1', label: 'Back mirror reflectance R₁', min: 90, max: 99.99, step: 0.01, value: params.r1 || 99.9, unit: '%' },
        { id: 'loss', label: 'Other losses per round trip', min: 0, max: 10, step: 0.1, value: params.loss != null ? params.loss : 0.5, unit: '%' },
        { id: 'L', label: 'Length of the cavity', min: 0.1, max: 2, log: true, sig: 2, value: params.L || 0.3, unit: 'm' },
        { id: 'view', type: 'select', label: 'Graph', options: [['Build-up of the power', 'build'], ['Output against coupling', 'out']], value: params.view || 'build' },
        { type: 'buttons', items: [{ id: 'pump', label: 'Switch the pump on', primary: true }] }
      ], id => { if (id === 'pump') play = 0; recompute(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rt', 'Round trip 2L/c'], ['tc', 'Photon lifetime in the cavity'], ['gth', 'Gain per pass needed (threshold)'], ['ratio', 'Gain above threshold'], ['gnow', 'Gain per pass right now'], ['pin', 'Power circulating, steady state'], ['pout', 'Power out, steady state'], ['state', 'The laser is']]);
      const NMAX = 1400;
      let P = [], play = 0, ss = 0, g2 = 0, lossFac = 1, gthL = 0, curveKey = '';
      function recompute() {
        const R1 = V.r1 / 100, R2 = V.r2 / 100, d = V.loss / 100;
        lossFac = R1 * R2 * (1 - d); g2 = 2 * Math.log(1 + V.g0 / 100);
        const nl = -Math.log(lossFac);
        ss = g2 > nl ? g2 / nl - 1 : 0;
        P = [1e-9];
        for (let n = 0; n < NMAX; n++) { const p = P[n]; P.push(clamp(p * lossFac * Math.exp(g2 / (1 + p)), 1e-30, 1e4)); }
        gthL = O.laser.thresholdGain(V.L, R1, R2, d > 0 ? -Math.log(1 - d) / (2 * V.L) : 0) * V.L;      // threshold gain × length
        curveKey = '';
      }
      recompute();
      const tri = u => { const f = u - Math.floor(u); return f < 0.5 ? 2 * f : 2 - 2 * f; };
      let clock = 0, lastK = -1;
      const loop = kit.loop(dt => {
        clock += dt; play = Math.min(NMAX, play + dt * 160);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, k = Math.floor(play);
        const p = P[k], out = (1 - V.r2 / 100) * p, cy = Hh * 0.5, x1 = W * 0.1, x2 = W * 0.72, hh = Math.min(Hh * 0.32, 56);
        // the gain tube, glowing with the gain that is left
        const left = 1 / (1 + p);
        S.block(c, W * 0.17, cy - hh * 0.62, W * 0.48, hh * 1.24, { fill: S.nm(633, 0.1 + 0.3 * left), color: C.faint });
        kit.label(c, 'gain medium', W * 0.41, cy - hh * 0.62 - 10, { align: 'center', color: C.muted, size: 11.5 });
        // spontaneous emission leaving sideways, flickering
        const rr = rng(Math.floor(clock * 7) + 11);
        c.save(); c.strokeStyle = S.nm(633, 0.35); c.lineWidth = 1;
        for (let i = 0; i < 8; i++) { const x = lerp(W * 0.2, W * 0.62, rr()), a = (rr() - 0.5) * 2.2 + (rr() < 0.5 ? -Math.PI / 2 : Math.PI / 2), l = 10 + rr() * 8; c.beginPath(); c.moveTo(x, cy); c.lineTo(x + Math.cos(a) * l, cy + Math.sin(a) * l); c.stroke(); }
        c.restore();
        // the mirrors
        S.flatMirror(c, x1, cy + hh, x1, cy - hh, { color: S.metal() });
        S.flatMirror(c, x2, cy - hh, x2, cy + hh, { color: C.accent });
        kit.label(c, 'back mirror R₁ = ' + V.r1.toFixed(V.r1 > 99.9 ? 2 : 1) + ' %', Math.max(6, x1 - 40), cy + hh + 16, { color: C.muted, size: 11.5 });
        kit.label(c, 'output coupler R₂ = ' + V.r2.toFixed(1) + ' %', x2, cy + hh + 16, { align: 'center', color: C.muted, size: 11.5 });
        // the light inside and the light out, as bright as they are (logarithmic)
        const bin = clamp((Math.log10(p) + 8) / 9, 0.04, 1), bout = clamp((Math.log10(out + 1e-12) + 6) / 6, 0, 1);
        S.beam(c, x1 + 3, x2 - 3, cy - 4, 3.2, { nm: 633, alpha: 0.12 + 0.7 * bin });
        S.beam(c, x1 + 3, x2 - 3, cy + 4, 3.2, { nm: 633, alpha: 0.12 + 0.7 * bin });
        if (out > 1e-9) S.beam(c, x2 + 3, W * 0.97, cy, 1.5 + 3.5 * bout, { nm: 633, alpha: 0.1 + 0.8 * bout });
        for (let j = 0; j < 4; j++) { const u = tri(clock * 0.55 + j / 4); kit.dot(c, lerp(x1 + 6, x2 - 6, u), cy + (j % 2 ? 4 : -4), 3.2, S.nm(633, 0.25 + 0.75 * bin)); }
        kit.label(c, 'beam out', W * 0.86, cy - 14 - 3.5 * bout, { align: 'center', color: C.muted, size: 11.5 });
        // the read-outs
        const tr = 2 * V.L / C0, nl = -Math.log(lossFac), G = Math.exp(Math.log(1 + V.g0 / 100) / (1 + p)) - 1;
        ro.set('rt', eng(tr, 's'));
        ro.set('tc', nl > 0 ? eng(tr / (1 - lossFac), 's') + '  (about ' + Math.round(1 / (1 - lossFac)) + ' round trips)' : '—');
        ro.set('gth', ((Math.exp(gthL) - 1) * 100).toPrecision(3) + ' %');
        ro.set('ratio', (Math.log(1 + V.g0 / 100) / gthL).toFixed(2));
        ro.set('gnow', (G * 100).toPrecision(3) + ' %' + (k > 5 && ss > 0 && Math.abs(G * 100 - (Math.exp(gthL) - 1) * 100) < 0.05 * (Math.exp(gthL) - 1) * 100 ? '  (= the loss: clamped)' : ''));
        ro.set('pin', ss > 0 ? ss.toPrecision(3) + ' P_sat' : 'none');
        ro.set('pout', ss > 0 ? ((1 - V.r2 / 100) * ss).toPrecision(3) + ' P_sat' : 'none');
        ro.set('state', ss <= 0 ? 'below threshold: the losses win' : k < NMAX * 0.5 && p < 0.97 * ss ? 'building up' : 'running: gain = loss');
        // the graph
        if (V.view === 'build') {
          if (k !== lastK || curveKey !== 'b') {
            lastK = k; curveKey = 'b';
            const pts = []; for (let n = 0; n <= k; n += Math.max(1, Math.floor(k / 300))) pts.push([n, Math.max(P[n], 1e-9)]);
            plot.set({ x: { label: 'round trips', min: 0, max: NMAX }, y: { label: 'power inside, in units of P_sat', log: true, min: 1e-9, max: Math.max(10, ss * 3) }, series: [{ pts, label: 'power circulating', color: C.series[0], width: 2.6 }], hlines: ss > 0 ? [{ y: ss, label: 'steady state', color: C.ok }] : [], vlines: [], marks: [] });
          }
        } else if (curveKey !== 'o|' + [V.g0, V.r1, V.loss, V.r2].join()) {
          curveKey = 'o|' + [V.g0, V.r1, V.loss, V.r2].join();
          const R1 = V.r1 / 100, d = V.loss / 100, pts = [];
          const outAt = T => { const nlT = -Math.log((1 - T) * R1 * (1 - d)); return nlT > 0 && g2 > nlT ? T * (g2 / nlT - 1) : 0; };
          let best = 0, bestT = 0.01;
          for (let i = 0; i <= 120; i++) { const T = Math.pow(10, -3 + 2.9 * i / 120), o = outAt(T); pts.push([T * 100, Math.max(o, 1e-6)]); if (o > best) { best = o; bestT = T; } }
          plot.set({ x: { label: 'output coupling T₂ = 1 − R₂ (%)', min: 0.1, max: 90, log: true }, y: { label: 'output power, in units of P_sat', log: true, min: 1e-3, max: Math.max(1, best * 3) }, series: [{ pts, label: 'output power', color: C.series[2], width: 2.6 }], hlines: [], vlines: [{ x: bestT * 100, label: 'best ≈ ' + (bestT * 100).toPrecision(2) + ' %', color: C.ok }], marks: [{ x: Math.max(0.1, 100 - V.r2), y: Math.max(outAt(1 - V.r2 / 100), 1e-6), label: 'now' }] });
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ stability of a two-mirror cavity */
  Hyper.sim('lp-stability', {
    title: 'Cavity stability: the g₁–g₂ diagram and a ray between the mirrors',
    blurb: `Each mirror of a two-mirror cavity has a number $g = 1 - L/R$ (its length L, its radius of curvature R, flat mirror R = ∞ so g = 1). The cavity is **stable** — a ray, and so a beam, stays inside — when the product g₁g₂ lies between 0 and 1: the green region. Drag the point in the diagram (or use the sliders) and watch a ray, started a millimetre off the axis, bounce between the mirrors.

**Try this**
- Press **Confocal** (g₁ = g₂ = 0, R = L, centres of curvature on each other's mirror): the ray is trapped, and the beam envelope shows the smallest spot of any symmetric stable cavity of that length.
- Press **Plane-parallel** and **Hemispherical**: they sit *on* the boundary. A perfectly aligned ray never leaves, but give it a tilt (even 0.5 mrad) and it walks off — marginal stability means extreme sensitivity to alignment.
- Press **Unstable**: the ray grows by a fixed factor every round trip, and escapes round the edge of the mirror after a few passes. High-power lasers use this on purpose, to fill a big gain volume.
- Drag the point along the hyperbola g₁g₂ = 1 and just inside it: the mode waist shrinks to nothing at the edge, and the spots on the mirrors grow without limit.

The mirror curvature is exaggerated in the drawing, and the transverse scale is magnified (the aperture is 6 mm radius). The ray model gives the stability condition exactly; the beam envelope and waist come from the Gaussian mode of the cavity at 632.8 nm.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const PRE = { plane: [1, 1], confocal: [0, 0], concentric: [-1, -1], hemi: [1, 0], hene: [1, 0.4], long: [0.75, 0.75], unstable: [1.5, 0.9] };
      const ctl = kit.controls(box.side, [
        { id: 'g1', label: 'g₁ = 1 − L/R₁', min: -2, max: 2, step: 0.01, value: params.g1 != null ? params.g1 : 1, fmt: v => v.toFixed(2) },
        { id: 'g2', label: 'g₂ = 1 − L/R₂', min: -2, max: 2, step: 0.01, value: params.g2 != null ? params.g2 : 0.4, fmt: v => v.toFixed(2) },
        { id: 'L', label: 'Cavity length L', min: 100, max: 1000, step: 10, value: params.L || 300, unit: 'mm' },
        { id: 'y0', label: 'The ray starts at a height', min: 0, max: 3, step: 0.1, value: 1, unit: 'mm' },
        { id: 'u0', label: 'and with a tilt', min: -5, max: 5, step: 0.1, value: params.u0 != null ? params.u0 : 0.5, unit: 'mrad' },
        { type: 'buttons', items: [{ id: 'plane', label: 'Plane-parallel' }, { id: 'confocal', label: 'Confocal', primary: true }, { id: 'concentric', label: 'Concentric' }, { id: 'hemi', label: 'Hemispherical' }, { id: 'hene', label: 'Like a He–Ne' }, { id: 'long', label: 'R = 4L each' }, { id: 'unstable', label: 'Unstable' }] }
      ], id => { const q = PRE[id]; if (q) { ctl.set('g1', q[0]); ctl.set('g2', q[1]); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Product g₁g₂'], ['v', 'The cavity is'], ['R', 'Mirror radii R₁, R₂'], ['w', 'Mode waist radius, and where'], ['wm', 'Spot radius on the mirrors'], ['ray', 'The ray'], ['grow', 'A ray grows each round trip by']]);
      const A = 6, NP = 40, EPSM = 0.004;
      const rad = (L, g) => Math.abs(1 - g) < 1e-4 ? Infinity : L / (1 - g);
      kit.drag(st, {
        hover: true,
        hit: p => { const d = dia(st.W, st.H); return p.x >= d.x0 && p.x <= d.x0 + d.S && p.y >= d.y0 && p.y <= d.y0 + d.S ? 'g' : null; },
        move: (w, p) => { const d = dia(st.W, st.H); ctl.set('g1', Math.round(clamp((p.x - d.x0) / d.S * 4 - 2, -2, 2) * 100) / 100); ctl.set('g2', Math.round(clamp(2 - (p.y - d.y0) / d.S * 4, -2, 2) * 100) / 100); loop.once(); }
      });
      const dia = (W, Hh) => ({ S: Math.max(120, Math.min(W * 0.4, Hh - 64, 320)), x0: 34, y0: 22 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, d = dia(W, Hh), Sz = d.S;
        const GX = g => d.x0 + (g + 2) / 4 * Sz, GY = g => d.y0 + Sz - (g + 2) / 4 * Sz;
        // the stable region: 0 ≤ g₁g₂ ≤ 1 (first and third quadrant, under the hyperbola)
        c.fillStyle = 'rgba(34,179,122,0.24)';
        for (const sg of [1, -1]) {
          c.beginPath(); c.moveTo(GX(0), GY(0)); c.lineTo(GX(2 * sg), GY(0)); c.lineTo(GX(2 * sg), GY(0.5 * sg));
          for (let g = 2; g >= 0.5 - 1e-9; g -= 0.05) c.lineTo(GX(g * sg), GY(sg / g));
          c.lineTo(GX(0), GY(2 * sg)); c.closePath(); c.fill();
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(d.x0, d.y0, Sz, Sz);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(GX(-2), GY(0)); c.lineTo(GX(2), GY(0)); c.moveTo(GX(0), GY(-2)); c.lineTo(GX(0), GY(2)); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.6;
        for (const sg of [1, -1]) { c.beginPath(); for (let g = 0.5; g <= 2 + 1e-9; g += 0.025) { const x = GX(g * sg), y = GY(sg / g); if (g === 0.5) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); }
        for (const g of [-2, -1, 0, 1, 2]) { kit.label(c, String(g), GX(g), d.y0 + Sz + 11, { align: 'center', color: C.muted, size: 10.5 }); kit.label(c, String(g), d.x0 - 8, GY(g), { align: 'right', color: C.muted, size: 10.5 }); }
        kit.label(c, 'g₁', d.x0 + Sz + 4, GY(0) - 9, { color: C.text, size: 12, weight: 650 }); kit.label(c, 'g₂', GX(0) + 6, d.y0 - 8, { color: C.text, size: 12, weight: 650 });
        kit.label(c, 'stable', GX(0.5), GY(0.5), { align: 'center', color: C.ok, size: 11.5, weight: 650 });
        kit.label(c, 'stable', GX(-0.5), GY(-0.5), { align: 'center', color: C.ok, size: 11.5, weight: 650 });
        kit.label(c, 'unstable', GX(-1.3), GY(1.3), { align: 'center', color: C.bad, size: 11.5, weight: 650 });
        kit.label(c, 'unstable', GX(1.4), GY(-1.3), { align: 'center', color: C.bad, size: 11.5, weight: 650 });
        kit.label(c, 'unstable', GX(1.5), GY(1.5), { align: 'center', color: C.bad, size: 11.5, weight: 650 });
        for (const [g1, g2, t, dx, dy, al] of [[1, 1, 'plane-parallel', -4, 11, 'right'], [0, 0, 'confocal', -7, 12, 'right'], [-1, -1, 'concentric', 8, 11, 'left'], [1, 0, 'hemispherical', 6, 13, 'left'], [0, 1, '', 0, 0, 'left']]) {
          kit.dot(c, GX(g1), GY(g2), 3.5, C.muted);
          if (t) kit.label(c, t, GX(g1) + dx, GY(g2) + dy, { align: al, color: C.muted, size: 10.5 });
        }
        const g1 = V.g1, g2 = V.g2, p = g1 * g2, L = V.L;
        kit.dot(c, GX(g1), GY(g2), 7.5, C.warn, C.text);
        const confocal = Math.abs(g1) <= 0.01 && Math.abs(g2) <= 0.01;
        const verdict = confocal ? 'stable' : !O.laser.stable(g1, g2) ? 'unstable' : (Math.abs(p) <= EPSM || Math.abs(p - 1) <= EPSM) ? 'marginal' : 'stable';
        // the cavity
        const R1 = rad(L, g1), R2 = rad(L, g2), f1 = R1 / 2, f2 = R2 / 2;
        const cx0 = d.x0 + Sz + 44, xm1 = cx0 + 24, xm2 = W - 40, cy = Hh * 0.36, hp = Math.min(Hh * 0.22, 64), sy = hp / A, Lp = xm2 - xm1, sz = Lp / L;
        const mirror = (x, facing, g) => {
          const bend = clamp(10 * (1 - g), -30, 30);
          c.save(); c.strokeStyle = S.metal(); c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath();
          for (let i = -20; i <= 20; i++) { const r = i / 20, xx = x + facing * bend * r * r, yy = cy - hp * 1.25 * r; if (i === -20) c.moveTo(xx, yy); else c.lineTo(xx, yy); }
          c.stroke(); c.lineWidth = 1; c.globalAlpha = 0.6; c.beginPath();
          for (let i = -20; i <= 20; i += 2) { const r = i / 20, xx = x + facing * bend * r * r, yy = cy - hp * 1.25 * r; c.moveTo(xx, yy); c.lineTo(xx - facing * 6, yy + 5); }
          c.stroke(); c.restore();
        };
        S.axis(c, xm1 - 14, cy, xm2 + 14);
        // the Gaussian mode of the cavity, if it has one
        const wv = O.laser.cavityWaist(L / 1000, Number.isFinite(R1) ? R1 / 1000 : Infinity, Number.isFinite(R2) ? R2 / 1000 : Infinity, 632.8);
        const stableNow = verdict === 'stable';
        if (stableNow && wv) {
          const zr = B.rayleigh(wv.w0, 632.8), zw = wv.z1;
          S.beam(c, xm1, xm2, cy, x => Math.min(hp * 1.2, sy * 1e3 * B.w((x - xm1) / sz / 1000 - zw, wv.w0, 632.8)), { nm: 633, alpha: 0.22 });
        }
        mirror(xm1, 1, g1); mirror(xm2, -1, g2);
        // the ray: heights at each mirror from the ray matrices, mirrors as lenses of focal length R/2
        let y = V.y0, u = V.u0 * 1e-3; const pts = [[xm1, cy - sy * y]]; let lost = -1;
        for (let k = 0; k < NP; k++) {
          y += u * L; const f = k % 2 === 0 ? f2 : f1;
          if (Number.isFinite(f)) u -= y / f;
          pts.push([k % 2 === 0 ? xm2 : xm1, cy - clamp(sy * y, -hp * 1.3, hp * 1.3)]);
          if (Math.abs(y) > A) { lost = k + 1; break; }
        }
        for (let i = 1; i < pts.length; i++) S.ray(c, [pts[i - 1], pts[i]], { color: C.warn, width: 1.3, alpha: lost > 0 ? 0.9 : 0.55, arrows: false });
        if (lost > 0) { const q = pts[pts.length - 1]; c.strokeStyle = C.bad; c.lineWidth = 2.4; c.beginPath(); c.moveTo(q[0] - 6, q[1] - 6); c.lineTo(q[0] + 6, q[1] + 6); c.moveTo(q[0] + 6, q[1] - 6); c.lineTo(q[0] - 6, q[1] + 6); c.stroke(); }
        S.dim(c, xm1, cy + hp * 1.5, xm2, cy + hp * 1.5, 'L = ' + L + ' mm', { off: 13 });
        kit.label(c, 'mirror 1', xm1, cy - hp * 1.25 - 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'mirror 2', xm2, cy - hp * 1.25 - 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'verdict: ' + verdict, cx0 + 4, Hh - 30, { color: verdict === 'stable' ? C.ok : verdict === 'marginal' ? C.warn : C.bad, size: 13, weight: 700 });
        kit.label(c, 'transverse scale ×' + Math.round(sy / sz) + ' · mirror curvature exaggerated', cx0 + 4, Hh - 10, { color: C.faint, size: 10.5 });
        // the read-outs
        const fR = R => !Number.isFinite(R) ? 'flat' : Math.abs(R) > 1e5 ? 'flat' : (R > 0 ? '' : 'convex ') + Math.abs(R).toFixed(0) + ' mm';
        ro.set('p', p.toFixed(3));
        ro.set('v', verdict === 'stable' ? 'stable: a ray stays between the mirrors' : verdict === 'marginal' ? 'at the edge of stability: any error decides' : 'unstable: a ray escapes');
        ro.set('R', fR(R1) + ', ' + fR(R2));
        if (stableNow && wv) { ro.set('w', (wv.w0 * 1e3).toFixed(3) + ' mm, ' + (wv.z1 * 1e3).toFixed(0) + ' mm from mirror 1'); ro.set('wm', (wv.w1 * 1e3).toFixed(2) + ' mm and ' + (wv.w2 * 1e3).toFixed(2) + ' mm'); }
        else { ro.set('w', verdict === 'marginal' ? 'none: at the edge the spot on a mirror is infinite' : 'none'); ro.set('wm', '—'); }
        ro.set('ray', lost > 0 ? 'leaves the mirror after ' + lost + ' passes' : 'still inside after ' + NP + ' passes');
        const m = 2 * p - 1;
        ro.set('grow', Math.abs(m) > 1 + 1e-9 ? '× ' + (Math.abs(m) + Math.sqrt(m * m - 1)).toFixed(2) + ' (the ray escapes geometrically)' : 'nothing: its height stays bounded');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ modes */
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const hermite = (n, x) => { let a = 1, b = 2 * x; if (n === 0) return a; for (let k = 1; k < n; k++) { const t = 2 * x * b - 2 * k * a; a = b; b = t; } return b; };
  const hg1 = (m, x) => { const h = hermite(m, Math.SQRT2 * x) * Math.exp(-x * x); return h * h; };
  const hgMax = {};
  const hgPeak = m => hgMax[m] || (hgMax[m] = (() => { let b = 0; for (let i = 0; i <= 400; i++) b = Math.max(b, hg1(m, i / 400 * 4.5)); return b; })());
  // intensity of the Hermite–Gauss mode TEM(m,n) on a window of ±X beam radii; the doughnut is TEM01* = TEM10 + TEM01 in intensity
  function hgFn(m, n, X, donut) {
    if (donut) { const a = hgFn(1, 0, X), b = hgFn(0, 1, X); return (u, v) => Math.min(1, a(u, v) + b(u, v)); }
    const pm = hgPeak(m), pn = hgPeak(n);
    return (u, v) => hg1(m, (u - 0.5) * 2 * X) * hg1(n, (v - 0.5) * 2 * X) / (pm * pn);
  }
  Hyper.sim('lp-modes', {
    title: 'Laser modes: a comb of frequencies and a gallery of patterns',
    blurb: `**Above:** the *longitudinal* modes. The light must fit a whole number of half-wavelengths between the mirrors, so only frequencies spaced c/2nL apart can exist: a comb. The curve is the gain of the medium; the dashed line is the loss. Every comb line whose gain beats the loss can lase (here the medium is taken to be Doppler-broadened, as in the gas lasers, so the modes do not compete for the same atoms). **Below:** the *transverse* modes: the pattern of the beam across its section, TEM with two indices counting the dark lines. Click a tile or use the sliders.

**Try this**
- *Helium–neon*, 30 cm: with the peak gain 1.5 times the loss only two or three lines clear the dashed line. Slide **Cavity tuning**: as the cavity length changes by half a wavelength the lines slide through the gain curve, one fades as the next comes in — the "mode sweep" of a warming He–Ne tube.
- Shorten the cavity to a few centimetres: the comb spacing grows beyond the gain width and a single mode is left. Lengthen it to 2 m: a dozen lines.
- *Nd:YAG* and *laser diode*: the gain is a hundred to a thousand times wider, so dozens to hundreds of modes lase. Tick **etalon**: its transmission peaks (second curve) strike out all the lines between them.
- Click TEM₀₀: a smooth Gaussian spot. TEM₁₀, TEM₁₁, TEM₂₀ …: lobes separated by dark lines, wider as the order rises, with a beam quality M² = 2m + 1 (and 2n + 1) times worse. The *doughnut* has a dark centre.

Schematic: heights of the lines show the gain at that frequency, not the power; the transverse patterns are exact Hermite–Gauss solutions drawn to one common scale.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 420 });
      const MEDIA = {
        hene: { name: 'Helium–neon, 632.8 nm (1.5 GHz)', nm: 632.8, fwhm: 1.5e9, L: 0.3, n: 1 },
        ar: { name: 'Argon ion, 488 nm (3.5 GHz)', nm: 488, fwhm: 3.5e9, L: 1.0, n: 1 },
        yag: { name: 'Nd:YAG, 1064 nm (120 GHz)', nm: 1064, fwhm: 1.2e11, L: 0.3, n: 1 },
        diode: { name: 'Laser diode, 850 nm (4 THz)', nm: 850, fwhm: 4.2e12, L: 3e-4, n: 3.6 }
      };
      let donut = false;
      const ctl = kit.controls(box.side, [
        { id: 'med', type: 'select', label: 'Gain medium', options: Object.keys(MEDIA).map(k => [MEDIA[k].name, k]), value: params.med || 'hene' },
        { id: 'L', label: 'Cavity length', min: 1e-4, max: 3, log: true, sig: 2, value: params.L || MEDIA[params.med || 'hene'].L, fmt: v => eng(v, 'm', 2) },
        { id: 'ratio', label: 'Peak gain ÷ loss', min: 0.8, max: 3, step: 0.05, value: params.ratio || 1.5, fmt: v => v.toFixed(2) },
        { id: 'off', label: 'Cavity tuning (1 = half a wavelength)', min: 0, max: 1, step: 0.01, value: 0.3, fmt: v => v.toFixed(2) },
        { id: 'etalon', type: 'check', label: 'Put an etalon in the cavity', value: !!params.etalon },
        { id: 'ed', label: 'Etalon thickness (fused silica)', min: 0.05, max: 20, log: true, sig: 2, value: 2, fmt: v => kit.fmt(v, 2) + ' mm' },
        { id: 'er', label: 'Etalon surface reflectance', min: 30, max: 95, step: 1, value: 80, unit: '%' },
        { id: 'et', label: 'Etalon tuning (1 = one free spectral range)', min: 0, max: 1, step: 0.01, value: 0, fmt: v => v.toFixed(2) },
        { id: 'm', label: 'Transverse mode index m', min: 0, max: 6, step: 1, value: params.m || 0 },
        { id: 'n', label: 'Transverse mode index n', min: 0, max: 6, step: 1, value: params.n || 0 }
      ], (id, v) => {
        if (id === 'med') ctl.set('L', MEDIA[v].L);
        if (id === 'm' || id === 'n') donut = false;
        sync(); loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sp', 'Mode spacing c/2nL'], ['bw', 'Gain width (FWHM)'], ['cnt', 'Longitudinal modes above threshold'], ['et', 'Etalon: free spectral range, width'], ['tem', 'Transverse mode'], ['m2', 'Beam quality of this mode']]);
      const sync = () => { for (const id of ['ed', 'er', 'et']) ctl.show(id, V.etalon); ro.show('et', V.etalon); };
      // the tiles of the gallery
      const TILES = [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [2, 1], [2, 2], ['d']];
      const geo = (W, Hh) => { const s = Math.min(Hh * 0.37, W * 0.3), x0 = 16, y0 = Hh * 0.58, tw = Math.min(70, (Hh * 0.42 - 44) / 2, (W - s - 70) / 4 - 6); return { s, x0, y0, tw, gx: x0 + s + 24, gy: y0 + 4 }; };
      kit.click(st, p => {
        const g = geo(st.W, st.H);
        TILES.forEach((t, i) => {
          const x = g.gx + (i % 4) * (g.tw + 6), y = g.gy + Math.floor(i / 4) * (g.tw + 24);
          if (p.x >= x && p.x <= x + g.tw && p.y >= y && p.y <= y + g.tw) {
            if (t[0] === 'd') { donut = true; ctl.set('m', 0); ctl.set('n', 1); } else { donut = false; ctl.set('m', t[0]); ctl.set('n', t[1]); }
            loop.once();
          }
        });
      }, p => { const g = geo(st.W, st.H); return p.x >= g.gx && p.y >= g.gy; });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = MEDIA[V.med];
        const sp = O.laser.modeSpacing(V.L, M.n), Xr = 1.5 * M.fwhm, vis = M.nm >= 380 && M.nm <= 780, col = vis ? S.nm(M.nm) : C.warn;
        const x0 = 46, x1 = W - 18, yt = 20, yb = Hh * 0.43;
        const X = f => x0 + (f + Xr) / (2 * Xr) * (x1 - x0);
        const gmax = Math.max(V.ratio, 1.3) * 1.18, Y = v => yb - clamp(v, 0, gmax * 1.05) / gmax * (yb - yt);
        const G = f => V.ratio * Math.exp(-4 * Math.LN2 * f * f / (M.fwhm * M.fwhm));
        // the etalon
        let T = () => 1, et = null;
        if (V.etalon) {
          et = O.etalon({ R: V.er / 100, d: V.ed * 1e-3, nm: M.nm, n: 1.45 });
          const F = Math.pow(2 * et.finesse / Math.PI, 2), fsr = et.fsrHz;
          T = f => 1 / (1 + F * Math.pow(Math.sin(Math.PI * (f / fsr - V.et)), 2));
        }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.moveTo(x0, yt); c.lineTo(x0, yb); c.stroke();
        kit.label(c, 'gain', x0 - 6, yt + 4, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'ν₀ − ' + eng(Xr, 'Hz', 2), x0, yb + 13, { color: C.muted, size: 10.5 });
        kit.label(c, 'line centre ν₀', (x0 + x1) / 2, yb + 13, { align: 'center', color: C.muted, size: 10.5 });
        kit.label(c, 'ν₀ + ' + eng(Xr, 'Hz', 2), x1, yb + 13, { align: 'right', color: C.muted, size: 10.5 });
        // the loss line and the gain curves
        c.save(); c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0, Y(1)); c.lineTo(x1, Y(1)); c.stroke(); c.restore();
        kit.label(c, 'loss', x1 - 2, Y(1) - 8, { align: 'right', color: C.warn, size: 11, weight: 650 });
        const curve = (fn, color, w, fill) => {
          c.beginPath();
          for (let i = 0; i <= 160; i++) { const f = -Xr + 2 * Xr * i / 160, x = X(f), y = Y(fn(f)); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
          c.strokeStyle = color; c.lineWidth = w; c.stroke();
          if (fill) { c.lineTo(x1, yb); c.lineTo(x0, yb); c.closePath(); c.globalAlpha = 0.1; c.fillStyle = color; c.fill(); c.globalAlpha = 1; }
        };
        curve(G, C.accent, 2.2, true);
        if (V.etalon) curve(f => G(f) * T(f) * T(f), C.ok, 1.6, false);
        // the modes
        const total = Math.floor(2 * Xr / sp) + 1, off = V.off * sp;
        let lasing = 0, first = null, second = null;
        const k0 = Math.ceil((-Xr - off) / sp);
        if (total <= 3000) {
          for (let k = k0; ; k++) {
            const f = k * sp + off; if (f > Xr) break;
            const g = G(f) * (V.etalon ? T(f) * T(f) : 1), on = g >= 1;
            if (on) { lasing++; if (first == null) first = f; else if (second == null) second = f; }
            const x = X(f);
            c.strokeStyle = on ? col : C.faint; c.globalAlpha = on ? 1 : 0.55; c.lineWidth = on ? (total > 400 ? 1 : 2.4) : 1; c.beginPath(); c.moveTo(x, yb); c.lineTo(x, Y(g)); c.stroke(); c.globalAlpha = 1;
          }
        } else {
          // too many lines to draw one by one: count the lasing band
          const half = M.fwhm * Math.sqrt(Math.log(V.ratio) / Math.LN2);
          lasing = V.ratio > 1 ? Math.floor(2 * half / sp) : 0;
          if (lasing > 0) { c.fillStyle = col; c.globalAlpha = 0.5; c.fillRect(X(-half), Y(V.ratio), X(half) - X(-half), yb - Y(V.ratio)); c.globalAlpha = 1; }
        }
        // the width of the gain, and the spacing of the lines
        S.dim(c, X(-M.fwhm / 2), Y(V.ratio / 2), X(M.fwhm / 2), Y(V.ratio / 2), 'FWHM ' + eng(M.fwhm, 'Hz', 2), { off: 11 });
        if (second != null && X(second) - X(first) > 7) S.dim(c, X(first), Y(1.0) - 24, X(second), Y(1.0) - 24, 'c/2nL = ' + eng(sp, 'Hz', 3), { off: -9 });
        // the transverse mode
        const m = V.m, n = V.n, g = geo(W, Hh), pcol = vis ? { nm: M.nm } : { rgb: [235, 140, 60] };
        c.fillStyle = '#05060d'; c.fillRect(g.x0 - 2, g.y0 - 2, g.s + 4, g.s + 4);
        S.image(c, g.x0, g.y0, g.s, g.s, 72, 72, hgFn(m, n, 3.6, donut), Object.assign({ gamma: 0.75, key: 'hg|' + (donut ? 'd' : m + ',' + n) + '|' + V.med, id: 'big' }, pcol));
        kit.label(c, donut ? 'TEM₀₁* (doughnut)' : 'TEM' + SUB[m] + SUB[n], g.x0 + g.s / 2, g.y0 - 10, { align: 'center', color: C.text, size: 12.5, weight: 700 });
        TILES.forEach((t, i) => {
          const x = g.gx + (i % 4) * (g.tw + 6), y = g.gy + Math.floor(i / 4) * (g.tw + 24), dn = t[0] === 'd', sel = dn ? donut : (!donut && t[0] === m && t[1] === n);
          c.fillStyle = '#05060d'; c.fillRect(x, y, g.tw, g.tw);
          S.image(c, x, y, g.tw, g.tw, 28, 28, hgFn(dn ? 0 : t[0], dn ? 0 : t[1], 3.6, dn), Object.assign({ gamma: 0.75, key: 'tile|' + i + '|' + V.med, id: 't' + i }, pcol));
          c.strokeStyle = sel ? C.warn : C.faint; c.lineWidth = sel ? 2.4 : 1; c.strokeRect(x, y, g.tw, g.tw);
          kit.label(c, dn ? 'doughnut' : 'TEM' + SUB[t[0]] + SUB[t[1]], x + g.tw / 2, y + g.tw + 11, { align: 'center', color: sel ? C.text : C.muted, size: 10.5 });
        });
        { const dl = M.nm * M.nm * 1e-18 * sp / C0; ro.set('sp', eng(sp, 'Hz', 3) + '  (Δλ = ' + (dl < 1e-9 ? (dl * 1e12).toPrecision(2) + ' pm' : (dl * 1e9).toPrecision(2) + ' nm') + ')'); }
        ro.set('bw', eng(M.fwhm, 'Hz', 2));
        ro.set('cnt', lasing + (total > 3000 ? ' (about)' : '') + (lasing === 0 ? '  (no line clears the loss: no laser)' : lasing === 1 ? '  (single longitudinal mode)' : ''));
        if (et) ro.set('et', eng(et.fsrHz, 'Hz', 2) + ', ' + eng(et.fsrHz / et.finesse, 'Hz', 2) + ' wide (finesse ' + et.finesse.toFixed(1) + ')');
        ro.set('tem', donut ? 'TEM₀₁*: a ring with a dark centre (two TEM₁₀/TEM₀₁ patterns)' : 'TEM' + SUB[m] + SUB[n] + ': ' + (m + 1) * (n + 1) + ' lobe' + ((m + 1) * (n + 1) > 1 ? 's' : '') + ', ' + m + ' dark line' + (m === 1 ? '' : 's') + ' across, ' + n + ' down');
        ro.set('m2', donut ? 'M² = 2' : 'M² = ' + (2 * m + 1) + ' (across), ' + (2 * n + 1) + ' (down)');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ linewidth and coherence */
  const dnuOf = (nm, dnm) => C0 * dnm * 1e-9 / Math.pow(nm * 1e-9, 2);       // Hz from a width in nm
  Hyper.sim('lp-coherence', {
    title: 'Linewidth, wave trains and fringe visibility',
    blurb: `Light is a string of wave trains. Within one train the phase is predictable; between trains it jumps. The narrower the spectral line (the **linewidth Δν**), the longer the trains: a train lasts about 1/Δν and is about c/Δν long, the **coherence length**. Split a beam in two, delay one half by a path difference Δ, and put them together: you see interference fringes only while Δ is less than the coherence length. The strip shows the fringes at the chosen Δ, the graph how their contrast (visibility) falls as Δ grows.

**Try this**
- Choose *Sunlight or a bulb* and move the path difference from 1 µm upwards: the fringes vanish by about 1 µm. Choose the *helium–neon with several modes*: they last to some 10 cm. The *Nd:YAG ring laser* keeps them for kilometres.
- Watch the drawn wave trains lengthen from a couple of cycles (white light) to many (the number of cycles per train is in the read-out: ν/Δν, millions for a narrow laser; the drawing shows at most 14 so that the phase jumps stay visible).
- Switch the line shape between *Gaussian* and *Lorentzian*: the same c/Δν, different tails. The "coherence length" is an order of magnitude, not a sharp edge.
- Set the path difference to exactly c/Δν (the dashed line in the graph): the fringes are almost gone, a few per cent.

Schematic: the wave trains are drawn at a fixed small number of cycles; the visibility curves are the exact Fourier transforms of a Gaussian and of a Lorentzian line.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'path difference between the two beams', min: 1e-7, max: 1e6, log: true, fmt: v => fmtLen(v) }, y: { label: 'fringe visibility', min: 0, max: 1.05 }, series: [] }, 200);
      const SRC = [
        { id: 'sun', name: 'Sunlight or a filament lamp (300 nm wide)', nm: 550, dnu: dnuOf(550, 300) },
        { id: 'wled', name: 'White LED (100 nm wide)', nm: 560, dnu: dnuOf(560, 100) },
        { id: 'rled', name: 'Red LED (25 nm wide)', nm: 630, dnu: dnuOf(630, 25) },
        { id: 'ld', name: 'Multimode laser diode (1.5 nm)', nm: 650, dnu: dnuOf(650, 1.5) },
        { id: 'hene', name: 'Helium–neon, several modes (1.5 GHz)', nm: 632.8, dnu: 1.5e9 },
        { id: 'hene1', name: 'Helium–neon, one mode (1 MHz)', nm: 632.8, dnu: 1e6 },
        { id: 'dfb', name: 'Single-frequency diode (2 MHz)', nm: 1550, dnu: 2e6 },
        { id: 'yag', name: 'Nd:YAG ring laser (1 kHz)', nm: 1064, dnu: 1e3 },
        { id: 'ti', name: 'Femtosecond Ti:sapphire (35 nm)', nm: 800, dnu: dnuOf(800, 35) }
      ];
      const first = SRC.find(s => s.id === (params.src || 'hene'));
      let seed = 3;
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Source', options: SRC.map(s => [s.name, s.id]), value: first.id },
        { id: 'dnu', label: 'Linewidth Δν (full width at half maximum)', min: 1e2, max: 1e15, log: true, sig: 2, value: first.dnu, fmt: v => eng(v, 'Hz', 2) },
        { id: 'nm', label: 'Centre wavelength', min: 400, max: 1600, step: 1, value: first.nm, unit: 'nm' },
        { id: 'path', label: 'Path difference Δ', min: 1e-6, max: 1e6, log: true, sig: 2, value: params.path || 0.1, fmt: v => fmtLen(v) },
        { id: 'shape', type: 'select', label: 'Shape of the line', options: [['Gaussian', 'g'], ['Lorentzian', 'l']], value: params.shape || 'g' },
        { type: 'buttons', items: [{ id: 'new', label: 'Draw new wave trains' }] }
      ], (id, v) => {
        if (id === 'src') { const s = SRC.find(q => q.id === v); ctl.set('dnu', s.dnu); ctl.set('nm', s.nm); }
        if (id === 'new') seed++;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dnu', 'Linewidth Δν'], ['dl', 'In wavelength, Δλ'], ['tau', 'Coherence time ≈ 1/Δν'], ['Lc', 'Coherence length ≈ c/Δν = λ²/Δλ'], ['cyc', 'Cycles in a wave train, ν/Δν'], ['vis', 'Fringe visibility at this path difference']]);
      const vis = (dnu, D, shape) => { const x = Math.PI * dnu * D / C0; return shape === 'g' ? Math.exp(-x * x / (4 * Math.LN2)) : Math.exp(-x); };
      let key = '';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lam = V.nm * 1e-9, dnu = V.dnu, Lc = C0 / dnu, dl = lam * lam * dnu / C0, cyc = C0 / lam / dnu, Vv = vis(dnu, V.path, V.shape);
        const visible = V.nm >= 380 && V.nm <= 780, colr = visible ? S.nm(V.nm) : C.warn;
        // the wave trains: sine waves with a phase jump at the end of each train
        const x0 = 18, x1 = W - 18, yw = Hh * 0.19, amp = Hh * 0.1, lpx = 12, ndraw = clamp(cyc, 1.3, 14), r = rng(seed * 101 + 7);
        kit.label(c, 'the light as a string of wave trains, with a phase jump between trains', x0, 12, { color: C.muted, size: 11.5 });
        c.save(); c.strokeStyle = colr; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath();
        let x = x0, k = 0, bounds = [x0], ph = TAU * r(), mid = null;
        while (x < x1) {
          const len = ndraw * lpx * (0.55 + 0.9 * r()), end = Math.min(x1, x + len);
          for (let s = x; s <= end; s += 1.5) { const y = yw - amp * Math.sin(TAU * (s - x) / lpx + ph); if (s === x && k === 0) c.moveTo(s, y); else c.lineTo(s, y); }
          if (k === 1) mid = [x, end];
          x = end; bounds.push(x); ph = TAU * r(); k++;
          if (k > 400) break;
        }
        c.stroke(); c.restore();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]);
        for (const b of bounds) if (b > x0 + 1 && b < x1 - 1) { c.beginPath(); c.moveTo(b, yw - amp * 1.25); c.lineTo(b, yw + amp * 1.25); c.stroke(); }
        c.setLineDash([]);
        if (mid) { S.dim(c, mid[0], yw + amp * 1.6, mid[1], yw + amp * 1.6, '', {}); kit.label(c, 'one wave train (between the dashed lines): about ' + sci(cyc, 1) + ' cycles, ' + fmtLen(Lc) + ' long', x0, yw + amp * 1.6 + 16, { color: C.text, size: 11.5 }); }
        // the fringes where the two beams are put together
        const fy = Hh * 0.52, fh = Hh * 0.2;
        kit.label(c, 'two copies of the light, one delayed by Δ = ' + fmtLen(V.path) + ', recombined at a slight angle: fringes', x0, fy - 11, { color: C.muted, size: 11.5 });
        S.fringes(c, x0, fy, x1 - x0, fh, u => 0.5 * (1 + Vv * Math.cos(TAU * 10 * u)), visible ? { nm: V.nm, gamma: 1 } : { rgb: [240, 200, 160], gamma: 1 });
        kit.label(c, 'visibility V = ' + (Vv >= 0.995 ? '1.00' : Vv >= 0.0095 ? Vv.toFixed(2) : Vv > 1e-300 ? sci(Vv, 1) : '0'), x0, fy + fh + 15, { color: C.text, size: 13, weight: 700 });
        kit.label(c, Vv > 0.5 ? 'sharp fringes: the beams are still coherent with each other' : Vv > 0.1 ? 'fading: the delayed light is only partly in step' : 'no fringes: the two beams have lost their phase relation', x0 + 140, fy + fh + 15, { color: C.muted, size: 11.5 });
        ro.set('dnu', eng(dnu, 'Hz', 3));
        ro.set('dl', dl >= 1e-9 ? (dl * 1e9).toPrecision(3) + ' nm' : dl >= 1e-12 ? (dl * 1e12).toPrecision(3) + ' pm' : sci(dl * 1e15, 2) + ' fm');
        ro.set('tau', eng(1 / dnu, 's', 3));
        ro.set('Lc', fmtLen(Lc));
        ro.set('cyc', sci(cyc, 1));
        ro.set('vis', Vv >= 0.0095 ? Vv.toFixed(3) : Vv > 1e-300 ? sci(Vv, 1) : '0');
        const k2 = [V.dnu, V.shape].join('|');
        if (k2 !== key) {
          key = k2; const pts = [];
          for (let i = 0; i <= 160; i++) { const D = Math.pow(10, -7 + 13 * i / 160); pts.push([D, vis(dnu, D, V.shape)]); }
          plot.set({ series: [{ pts, label: V.shape === 'g' ? 'Gaussian line' : 'Lorentzian line', color: C.series[0], width: 2.6 }], vlines: [{ x: Lc, label: 'c/Δν', color: C.warn }] });
        }
        plot.set({ marks: [{ x: V.path, y: Vv, label: 'Δ' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pulses: power, energy, duration, spot */
  const EXAMPLES = {
    pointer: { P: 5e-3, f: 1e3, tau: 1e-3, d: 1.5 },
    quasi: { P: 2, f: 100, tau: 200e-6, d: 5 },
    qs: { P: 1, f: 10, tau: 10e-9, d: 5 },
    ml: { P: 1, f: 80e6, tau: 100e-15, d: 0.01 },
    fs: { P: 1, f: 1e3, tau: 100e-15, d: 1 },
    cut: { P: 1000, f: 1e3, tau: 1e-3, d: 0.1 }
  };
  function logBar(c, kit, C, x0, x1, y, h, value, lo, hi, text, color, refs) {
    const a = Math.log10(lo), b = Math.log10(hi), fx = v => x0 + clamp((Math.log10(Math.max(v, 1e-300)) - a) / (b - a), 0, 1) * (x1 - x0);
    c.save(); c.fillStyle = C.faint; c.globalAlpha = 0.16; c.fillRect(x0, y - h / 2, x1 - x0, h); c.globalAlpha = 1;
    c.fillStyle = color; c.fillRect(x0, y - h / 2, Math.max(2, fx(value) - x0), h);
    c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath();
    for (let e = Math.ceil(a); e <= Math.floor(b); e++) { const x = x0 + (e - a) / (b - a) * (x1 - x0); c.moveTo(x, y + h / 2); c.lineTo(x, y + h / 2 + (e % 3 === 0 ? 5 : 3)); }
    c.stroke();
    for (const r of refs || []) { const x = fx(r[0]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y - h / 2 - 3); c.lineTo(x, y + h / 2 + 3); c.stroke(); kit.label(c, r[1], x, y + h / 2 + 11, { align: 'center', color: C.warn, size: 10 }); }
    c.restore();
    const xe = fx(value);
    if (xe > x1 - 150) kit.label(c, text, xe - 6, y, { align: 'right', color: '#fff', size: 11.5, weight: 700 }); else kit.label(c, text, xe + 6, y, { color: C.text, size: 11.5, weight: 700 });
  }
  Hyper.sim('lp-pulses', {
    title: 'Continuous and pulsed beams: power, energy, duration and spot',
    blurb: `Give a laser an **average power**, a **repetition rate** and a **pulse duration** and everything else follows. Energy per pulse is the average power divided by the rate, peak power is that energy divided by the duration, and the **duty cycle** is the fraction of the time the laser is on. Focus the beam to a spot and the peak power becomes an **irradiance** (W/cm²) and the pulse energy a **fluence** (J/cm²). The bars are on logarithmic scales, so each tick is ten times the last; the amber marks are typical landmarks.

**Try this**
- Start with the *laser pointer*: duty cycle 1, peak = average. Then the *Q-switched Nd:YAG*: the same 1 W average, but all of it in 10 ns pulses: a peak power ten million times higher.
- Choose the *femtosecond amplifier*: one watt on average, ten gigawatts at the peak, and a peak irradiance beyond anything the Sun could do at a focus.
- Make the beam diameter ten times smaller: irradiance and fluence rise a hundredfold; power and energy do not change.
- With the *mode-locked Ti:sapphire* try raising the repetition rate at fixed average power: the pulses get weaker, but the duty cycle stays ridiculously small.

Landmarks are typical round figures, not limits. Peak power is taken as E/τ and the irradiance at the centre of a Gaussian beam of 1/e² diameter d (twice the average over that circle); real pulses differ from these by a factor close to 1.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420 });
      const start = EXAMPLES[params.preset] || EXAMPLES.qs;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'An example', options: [['Custom', 'c'], ['Laser pointer, 5 mW, continuous', 'pointer'], ['Pump diode bar, quasi-continuous', 'quasi'], ['Q-switched Nd:YAG, 100 mJ in 10 ns', 'qs'], ['Mode-locked Ti:sapphire, 80 MHz, 100 fs', 'ml'], ['Femtosecond amplifier, 1 mJ, 1 kHz', 'fs'], ['Fibre laser for cutting, 1 kW continuous', 'cut']], value: EXAMPLES[params.preset] ? params.preset : 'qs' },
        { id: 'P', label: 'Average power', min: 1e-3, max: 1e4, log: true, sig: 2, value: start.P, fmt: v => eng(v, 'W', 2) },
        { id: 'f', label: 'Repetition rate', min: 1, max: 1e9, log: true, sig: 2, value: start.f, fmt: v => eng(v, 'Hz', 2) },
        { id: 'tau', label: 'Pulse duration (FWHM)', min: 1e-14, max: 1, log: true, sig: 2, value: start.tau, fmt: v => eng(v, 's', 2) },
        { id: 'd', label: 'Beam diameter at the target (1/e²)', min: 0.01, max: 20, log: true, sig: 2, value: start.d, fmt: v => kit.fmt(v, 2) + ' mm' }
      ], (id, v) => {
        if (id === 'preset') { const e = EXAMPLES[v]; if (e) { ctl.set('P', e.P); ctl.set('f', e.f); ctl.set('tau', e.tau); ctl.set('d', e.d); } }
        else ctl.set('preset', 'c');
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['type', 'The beam is'], ['T', 'Time between pulses 1/f'], ['E', 'Energy per pulse'], ['duty', 'Duty cycle'], ['pk', 'Peak power'], ['I', 'Peak irradiance at the spot'], ['F', 'Fluence per pulse at the spot']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const T = 1 / V.f, tau = Math.min(V.tau, T), E = V.P / V.f, pk = E / tau, duty = tau * V.f, w = V.d * 1e-3 / 2;
        const I0 = O.beam.peakIrradiance(pk, w) / 1e4, F0 = I0 * tau;            // W/cm², J/cm²: centre of a Gaussian beam
        const cw = duty > 0.999;
        // the pulse train, three periods
        const x0 = 56, x1 = W - 20, y1 = Hh * 0.33, ytop = 24, Wp = x1 - x0;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y1); c.lineTo(x1, y1); c.moveTo(x0, ytop - 6); c.lineTo(x0, y1); c.stroke();
        kit.label(c, 'power', x0 - 8, ytop - 8, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'time', x1, y1 + 12, { align: 'right', color: C.muted, size: 11 });
        const fwhmPx = Math.max(4, tau / T * Wp / 3), sg = fwhmPx / 2.355;
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
        if (cw) { c.moveTo(x0, ytop); c.lineTo(x1, ytop); }
        else {
          for (let s = x0; s <= x1; s += 1) {
            let v = 0; for (let j = 0; j < 3; j++) { const xc = x0 + (j + 0.5) * Wp / 3; v += Math.exp(-0.5 * Math.pow((s - xc) / sg, 2)); }
            const y = y1 - v * (y1 - ytop); if (s === x0) c.moveTo(s, y); else c.lineTo(s, y);
          }
        }
        c.stroke(); c.restore();
        const yav = y1 - Math.max(duty, 0.012) * (y1 - ytop);
        c.save(); c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0, yav); c.lineTo(x1, yav); c.stroke(); c.restore();
        kit.label(c, 'average ' + eng(V.P, 'W', 2) + (duty < 0.012 ? ' (a hair above the axis: really ' + sci(duty * 100, 1) + ' % of the peak)' : ''), x1 - 4, yav - 9, { align: 'right', color: C.warn, size: 11.5, weight: 650 });
        kit.label(c, 'peak ' + eng(pk, 'W', 2), x0 + Wp / 6 + 12, ytop + 2, { color: C.accent, size: 11.5, weight: 650 });
        if (!cw) {
          S.dim(c, x0 + Wp / 6, y1 + 22, x0 + Wp / 2, y1 + 22, 'T = 1/f = ' + eng(T, 's', 2), { off: 11 });
          if (tau / T * Wp / 3 < 4) kit.label(c, 'τ = ' + eng(tau, 's', 2) + ' (drawn wider than true)', x0 + Wp / 6, y1 + 50, { align: 'center', color: C.muted, size: 11 });
          else kit.label(c, 'τ = ' + eng(tau, 's', 2), x0 + Wp / 6, y1 + 50, { align: 'center', color: C.muted, size: 11 });
        } else kit.label(c, 'continuous: on all the time', (x0 + x1) / 2, y1 + 22, { align: 'center', color: C.muted, size: 11.5 });
        // the log bars
        const bx0 = Math.min(150, W * 0.25), bx1 = W - 24, top = Hh * 0.5, rowH = (Hh - top - 10) / 5;
        const rows = [
          ['Average power', V.P, 1e-4, 1e5, eng(V.P, 'W', 2), C.series[2], [[O.laser.CLASSES[1].limit, 'class 2'], [O.laser.CLASSES[3].limit, 'class 3B']]],
          ['Peak power', pk, 1e-4, 1e13, eng(pk, 'W', 2), C.series[0], [[1e9, 'a power station']]],
          ['Energy per pulse', E, 1e-9, 10, eng(E, 'J', 2), C.series[4], []],
          ['Peak irradiance', I0, 1e-3, 1e16, sci(I0, 1) + ' W/cm²', C.series[1], [[0.1, 'sunlight'], [1e6, 'steel keyhole welding'], [1e14, 'atoms ionize']]],
          [cw ? 'Dose in 1 second' : 'Fluence per pulse', cw ? I0 : F0, cw ? 1e-3 : 1e-9, cw ? 1e9 : 1e3, sci(cw ? I0 : F0, 1) + ' J/cm²', C.series[3], cw ? [] : [[10, 'good optics, 10 ns']]]
        ];
        rows.forEach((r, i) => { const y = top + rowH * (i + 0.42); kit.label(c, r[0], 12, y, { color: C.text, size: 12 }); logBar(c, kit, C, bx0 + 8, bx1, y, 13, r[1], r[2], r[3], r[4], r[5], r[6]); });
        ro.set('type', cw ? 'continuous (CW)' : duty > 0.1 ? 'chopped, quasi-continuous' : 'pulsed');
        ro.set('T', cw ? '—' : eng(T, 's', 3));
        ro.set('E', eng(E, 'J', 3));
        ro.set('duty', cw ? '100 %' : duty >= 0.01 ? (duty * 100).toPrecision(2) + ' %' : sci(duty, 1) + '  (' + sci(duty * 100, 1) + ' %)');
        ro.set('pk', eng(pk, 'W', 3));
        ro.set('I', sci(I0, 2) + ' W/cm²');
        ro.set('F', cw ? sci(I0, 2) + ' J/cm² in one second' : sci(F0, 2) + ' J/cm²');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Q-switching and mode-locking */
  // the Q-switch rate equations in units of the photon lifetime: dφ/ds = φ(x − 1), dx/ds = −xφ, x = inversion ÷ threshold inversion
  const QS = {};
  function runQs(r) {
    const key = r.toFixed(4);
    if (QS[key]) return QS[key];
    let x = r, ph = 1e-9, s = 0, n = 0, pk = 0, spk = 0;
    const S = [0], PH = [ph], X = [x];
    const d = (xx, pp) => [pp * (xx - 1), -xx * pp];
    while (n++ < 300000) {
      const ds = ph > 1e-4 ? 0.01 : 0.05;
      const k1 = d(x, ph), k2 = d(x + ds / 2 * k1[1], ph + ds / 2 * k1[0]), k3 = d(x + ds / 2 * k2[1], ph + ds / 2 * k2[0]), k4 = d(x + ds * k3[1], ph + ds * k3[0]);
      ph += ds / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); x += ds / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); s += ds;
      S.push(s); PH.push(ph); X.push(x);
      if (ph > pk) { pk = ph; spk = s; }
      if (s > spk && ph < 1e-6 * pk) break;
      if (s > 4000) break;
    }
    let a = 0, b = 0, area = 0;
    for (let i = 1; i < PH.length; i++) {
      area += 0.5 * (PH[i] + PH[i - 1]) * (S[i] - S[i - 1]);
      if (PH[i - 1] < pk / 2 && PH[i] >= pk / 2) a = S[i - 1] + (S[i] - S[i - 1]) * (pk / 2 - PH[i - 1]) / (PH[i] - PH[i - 1]);
      if (PH[i - 1] >= pk / 2 && PH[i] < pk / 2) b = S[i - 1] + (S[i] - S[i - 1]) * (PH[i - 1] - pk / 2) / (PH[i - 1] - PH[i]);
    }
    return (QS[key] = { S, PH, pk, spk, fw: Math.max(1e-3, b - a), area, eta: clamp((r - X[X.length - 1]) / r, 0, 1) });
  }
  const interp = (S, Y, s) => {
    let lo = 0, hi = S.length - 1;
    if (s <= S[0]) return Y[0]; if (s >= S[hi]) return Y[hi];
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m] <= s) lo = m; else hi = m; }
    return Y[lo] + (Y[hi] - Y[lo]) * (s - S[lo]) / (S[hi] - S[lo]);
  };
  Hyper.sim('lp-switching', {
    title: 'Q-switching and mode-locking: where the giant pulses come from',
    blurb: `**Q-switching.** While the pump fills the upper level, the cavity is spoiled (high loss, low Q) so that the laser cannot start; the inversion climbs far above the normal threshold. Then the switch opens, the loss drops, and the light avalanches: all the stored energy leaves in a pulse some tens of nanoseconds long. The graph is a numerical solution of the two rate equations (photons and inversion); the picture above it is a schematic of the pumping.

**Mode-locking.** A laser with N longitudinal modes, spaced c/2L apart, normally has random phases and a steady, noisy output. Put the modes *in step* and they add up, once per round trip, into a short pulse: the more modes (the wider the spectrum), the shorter the pulse, about T/N for a round trip T = 2L/c, and N times more peak power than the average.

**Try this**
- Q-switch: raise the inversion ratio r (how many times the threshold the inversion reaches before the switch opens). The pulse gets shorter and stronger, and nearly all of the stored energy comes out once r > 3.
- Q-switch: lengthen the cavity or raise its loss and see how the photon lifetime, and with it the pulse, changes.
- Mode-locking: with *Locked* phases and 12 modes the picture shows one pulse per round trip, 12 times the average. Switch to *Random* phases: the same modes, the same spectrum, but a noisy, almost steady output.
- Increase N to 60: the pulse narrows in proportion. A femtosecond laser has hundreds of thousands of modes.

Schematic and simplified: four-level gain medium, all the loss taken as output coupling, no pulse-to-pulse fluctuation; the mode-locked waveform is the exact sum of N equal modes.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (ns)' }, y: { label: 'power' }, series: [] }, 200);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Technique', options: [['Q-switching', 'qs'], ['Mode-locking', 'ml']], value: params.mode || 'qs' },
        { id: 'r', label: 'Inversion when the switch opens (× threshold)', min: 1.1, max: 10, log: true, sig: 2, value: params.r || 3, fmt: v => kit.fmt(v, 2) },
        { id: 'Lq', label: 'Cavity length', min: 0.1, max: 2, log: true, sig: 2, value: 0.5, unit: 'm' },
        { id: 'dq', label: 'Loss per round trip', min: 5, max: 60, step: 1, value: 20, unit: '%' },
        { id: 'Es', label: 'Energy stored in the inversion', min: 1e-3, max: 2, log: true, sig: 2, value: 0.1, fmt: v => eng(v, 'J', 2) },
        { id: 'N', label: 'Number of locked modes N', min: 1, max: 60, step: 1, value: params.N || 12 },
        { id: 'Lm', label: 'Cavity length', min: 0.3, max: 3, log: true, sig: 2, value: 1.5, unit: 'm' },
        { id: 'lock', type: 'select', label: 'Phases of the modes', options: [['Locked: all in step', 'l'], ['Random', 'r']], value: params.lock || 'l' },
        { type: 'buttons', items: [{ id: 'new', label: 'New random phases' }] }
      ], id => { if (id === 'new') seed++; sync(); recalc(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['qa', 'Photon lifetime in the cavity'], ['qb', 'Energy extracted'], ['qc', 'Pulse energy'], ['qd', 'Pulse duration (FWHM)'], ['qe', 'Peak power'], ['qf', 'Delay from switching to the peak'], ['ma', 'Mode spacing = repetition rate'], ['mb', 'Round-trip time T'], ['mc', 'Total bandwidth'], ['md', 'Pulse duration'], ['me', 'Peak ÷ average power'], ['mf', 'Output']]);
      let seed = 5, wf = null, qsd = null, clock = 0;
      const sync = () => { const q = V.mode === 'qs'; for (const id of ['r', 'Lq', 'dq', 'Es']) ctl.show(id, q); for (const id of ['N', 'Lm', 'lock']) ctl.show(id, !q); ctl.show('new', !q); gb.style.display = q ? '' : 'none'; for (const k of 'abcdef') { ro.show('q' + k, q); ro.show('m' + k, !q); } };
      const NS = 720;
      function recalc() {
        if (V.mode === 'qs') {
          qsd = runQs(V.r);
          const tc = 2 * V.Lq / (C0 * V.dq / 100), E = qsd.eta * V.Es, Ppk = E * qsd.pk / (tc * qsd.area);
          const unit = Ppk >= 1e9 ? [1e9, 'GW'] : Ppk >= 1e6 ? [1e6, 'MW'] : Ppk >= 1e3 ? [1e3, 'kW'] : [1, 'W'];
          const lo = qsd.spk - 2.5 * qsd.fw, hi = qsd.spk + 4.5 * qsd.fw, pts = [];
          for (let i = 0; i <= 240; i++) { const s = lo + (hi - lo) * i / 240; pts.push([(s - qsd.spk) * tc * 1e9, E * interp(qsd.S, qsd.PH, s) / (tc * qsd.area) / unit[0]]); }
          qsd.out = { tc, E, Ppk, fwhm: qsd.fw * tc, delay: qsd.spk * tc };
          plot.set({ x: { label: 'time from the peak of the pulse (ns)' }, y: { label: 'power (' + unit[1] + ')', min: 0 }, series: [{ pts, label: 'laser output', color: kit.colors().series[1], width: 2.6 }], vlines: [], hlines: [], marks: [] });
        } else {
          const N = V.N, r = rng(seed * 977 + 13), ph = []; for (let k = 0; k < N; k++) ph.push(V.lock === 'l' ? 0 : TAU * r());
          const I = new Float64Array(NS); let mean = 0, pkv = 0;
          for (let i = 0; i < NS; i++) {
            const th = TAU * 2 * i / NS; let re = 0, im = 0;
            for (let k = 0; k < N; k++) { const a = (k - (N - 1) / 2) * th + ph[k]; re += Math.cos(a); im += Math.sin(a); }
            I[i] = (re * re + im * im) / N; mean += I[i] / NS; pkv = Math.max(pkv, I[i]);
          }
          wf = { I, mean, pk: pkv };
        }
      }
      const loop = kit.loop(dt => {
        clock += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'qs') {
          if (!qsd || !qsd.out) recalc();
          const o = qsd.out, r = V.r;
          // the schematic of the pumping: inversion against time, with the switch opening at the end
          const x0 = 50, x1 = W - 20, yb = Hh * 0.8, yt = 30, ymax = 1.45 * r, Y = v => yb - v / ymax * (yb - yt);
          kit.label(c, 'inversion against time while the pump works and the switch opens (schematic, not to scale)', x0, 12, { color: C.muted, size: 11.5 });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.moveTo(x0, yt - 6); c.lineTo(x0, yb); c.stroke();
                    kit.label(c, 'time', x1, yb + 12, { align: 'right', color: C.muted, size: 11 });
          c.save(); c.setLineDash([6, 4]); c.lineWidth = 1.3;
          c.strokeStyle = C.warn; c.beginPath(); c.moveTo(x0, Y(1)); c.lineTo(x1, Y(1)); c.stroke();
          c.strokeStyle = C.bad; c.beginPath(); c.moveTo(x0, Y(1.4 * r)); c.lineTo(x0 + (x1 - x0) * 0.72, Y(1.4 * r)); c.stroke(); c.restore();
          kit.label(c, 'threshold with the switch open', x0 + 6, Y(1) + 12, { color: C.warn, size: 11.5 });
          kit.label(c, 'threshold while the switch blocks the cavity', x0 + 6, Y(1.4 * r) - 9, { color: C.bad, size: 11.5 });
          const xs = x0 + (x1 - x0) * 0.62, t0 = x0, rise = u => r * (1 - Math.exp(-u * 2.1)) / (1 - Math.exp(-2.1));
          c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
          for (let i = 0; i <= 60; i++) { const u = i / 60, x = lerp(t0, xs, u), y = Y(rise(u)); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
          c.lineTo(xs + 3, Y(r * (1 - qsd.eta))); c.lineTo(x1 - 40, Y(r * (1 - qsd.eta)));
          c.stroke();
          c.strokeStyle = C.ok; c.lineWidth = 1.4; c.beginPath(); c.moveTo(xs, yb); c.lineTo(xs, yt); c.stroke();
          kit.label(c, 'switch opens', xs + 5, yt + 6, { color: C.ok, size: 11.5, weight: 650 });
          kit.label(c, 'giant pulse leaves', xs + 5, Y(r * (1 - qsd.eta)) - 12, { color: C.text, size: 11.5 });
          kit.label(c, 'low Q: pumping (about 230 µs in Nd:YAG)', x0 + 8, yb + 14, { color: C.muted, size: 11 }); kit.label(c, 'high Q', xs + 5, yb + 14, { color: C.muted, size: 11 });
          ro.set('qa', eng(o.tc, 's', 3)); ro.set('qb', pc(qsd.eta) + ' of the stored energy'); ro.set('qc', eng(o.E, 'J', 3));
          ro.set('qd', eng(o.fwhm, 's', 3)); ro.set('qe', eng(o.Ppk, 'W', 3)); ro.set('qf', eng(o.delay, 's', 3));
        } else {
          if (!wf) recalc();
          const N = V.N, T = 2 * V.Lm / C0, fr = C0 / (2 * V.Lm), locked = V.lock === 'l';
          // the spectrum: N equal lines
          const sx0 = 40, sx1 = W - 24, pitch = Math.min(14, (sx1 - sx0) * 0.6 / Math.max(1, N)), cxs = (sx0 + sx1) / 2, sy1 = Hh * 0.2;
          kit.label(c, N + ' modes, ' + eng(fr, 'Hz', 3) + ' apart: a spectrum ' + eng(N * fr, 'Hz', 3) + ' wide', sx0, 12, { color: C.muted, size: 11.5 });
          c.strokeStyle = C.accent; c.lineWidth = Math.max(1.2, Math.min(3, pitch * 0.35));
          for (let k = 0; k < N; k++) { const x = cxs + (k - (N - 1) / 2) * pitch; c.beginPath(); c.moveTo(x, sy1); c.lineTo(x, sy1 - 22); c.stroke(); }
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(sx0, sy1); c.lineTo(sx1, sy1); c.stroke();
          // the waveform over two round trips
          const wx0 = 50, wx1 = W - 20, wyb = Hh * 0.56, wyt = Hh * 0.28, ymaxv = Math.max(N, wf.pk) * 1.05, YY = v => wyb - v / ymaxv * (wyb - wyt);
          kit.label(c, 'power over two round trips: one cycle of the beat = T = 2L/c = ' + eng(T, 's', 3), wx0, wyt - 12, { color: C.muted, size: 11.5 });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(wx0, wyb); c.lineTo(wx1, wyb); c.stroke();
          c.fillStyle = locked ? 'rgba(224,160,48,0.35)' : 'rgba(123,140,255,0.3)'; c.strokeStyle = locked ? C.warn : C.accent; c.lineWidth = 1.6; c.beginPath(); c.moveTo(wx0, wyb);
          for (let i = 0; i < NS; i++) c.lineTo(lerp(wx0, wx1, i / (NS - 1)), YY(wf.I[i]));
          c.lineTo(wx1, wyb); c.closePath(); c.fill(); c.stroke();
          c.save(); c.strokeStyle = C.text; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(wx0, YY(wf.mean)); c.lineTo(wx1, YY(wf.mean)); c.stroke(); c.restore();
          kit.label(c, 'average', wx1 - 4, YY(wf.mean) - 9, { align: 'right', color: C.text, size: 11 });
          // the pulse in the cavity: the round trip unfolded, the profile sliding along it
          const mx0 = 60, mx1 = W - 60, my1 = Hh * 0.72, my2 = Hh * 0.9, hmax = Hh * 0.075;
          kit.label(c, 'the light in the cavity now: going right (upper line), coming back (lower line)', mx0 - 30, my1 - hmax - 12, { color: C.muted, size: 11.5 });
          S.flatMirror(c, mx0 - 6, my2 + 10, mx0 - 6, my1 - hmax, {}); S.flatMirror(c, mx1 + 6, my1 - hmax, mx1 + 6, my2 + 10, { color: C.accent });
          for (const [yy, dir] of [[my1, 1], [my2, -1]]) {
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(mx0, yy); c.lineTo(mx1, yy); c.stroke();
            c.beginPath(); c.strokeStyle = locked ? C.warn : C.accent; c.lineWidth = 1.8;
            for (let i = 0; i <= 240; i++) {
              const u = i / 240, s = (dir > 0 ? 0 : 0.5) + 0.5 * u, th = mod(clock * 0.18 - s, 1), idx = Math.floor(th * NS / 2) % (NS / 2);
              const x = dir > 0 ? lerp(mx0, mx1, u) : lerp(mx1, mx0, u), y = yy - clamp(wf.I[idx] / ymaxv, 0, 1) * hmax * 2.2;
              if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
            }
            c.stroke();
          }
          ro.set('ma', eng(fr, 'Hz', 3)); ro.set('mb', eng(T, 's', 3)); ro.set('mc', eng(N * fr, 'Hz', 3));
          ro.set('md', locked ? eng(T / N, 's', 3) + '  (about T/N)' : 'no pulse: a noisy, almost steady beam');
          ro.set('me', (wf.pk / wf.mean).toFixed(1) + ' ×' + (locked ? '  (N)' : ''));
          ro.set('mf', locked ? 'one pulse per round trip' : 'random phases: ' + wf.pk.toFixed(1) + ' at most, ' + wf.mean.toFixed(2) + ' on average');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      sync(); recalc();
      loop.start();
    }
  });

  /* ================================================================ lamp, LED, laser */
  Hyper.sim('lp-compare', {
    title: 'Lamp, LED and laser: four properties side by side',
    blurb: `Laser light is **monochromatic** (a narrow spectral line), **coherent** (the phase holds over a long distance), **directional** (it spreads slowly) and **bright** (a great deal of power from a small area into a small solid angle: high *radiance*). Each row is a source; each column one property, on a logarithmic scale, so every tick is a factor of ten. Click a row for the numbers.

**Try this**
- Read down the first two columns: from the Sun to the single-frequency green laser the spectral width falls by about eleven orders of magnitude and the coherence length rises by the same.
- Third column: a bare LED or filament sends light into a whole hemisphere; the He–Ne beam spreads by only about a milliradian. The laser *diode* is poor until a lens collimates it (see [[collimating-a-laser-diode]]).
- Fourth column: radiance is what cannot be improved by any lens (see [[radiance-and-its-conservation]]). A one-milliwatt He–Ne laser out-shines the Sun's disc by a factor of about a hundred in *total* radiance, and by tens of millions in the narrow band of its own line.
- Move the distance to the wall: a He–Ne spot is still only a couple of millimetres across at 1 m; the lamp has no spot at all.

Typical figures, rounded: the lamps and LEDs are for a bare source, the lasers for their normal beam; radiance of a diffraction-limited laser is P ⁄ (M²λ)².`,
    mount(box, kit, params) {
      const O = kit.optics, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 400 });
      const lasr = (P, M2, nm) => P / (M2 * M2 * Math.pow(nm * 1e-9, 2));
      const wid = (nm, dnu) => nm * nm * 1e-9 * dnu / C0;              // Δλ in nm from Δν
      const SRC = [
        { id: 'sun', name: 'The Sun (from Earth)', nm: 550, dnm: 300, div: 9.3e-3, rad: 2.0e7, note: 'a thermal source at 5772 K; the divergence is its angular size, 0.53°' },
        { id: 'halogen', name: 'Halogen filament', nm: 600, dnm: 300, div: Math.PI, rad: 5e5, note: 'a thermal source: light leaves in all directions of a hemisphere' },
        { id: 'wled', name: 'White LED chip', nm: 560, dnm: 100, div: 2.09, rad: 3e5, note: 'about 1 W of light from a square millimetre into a hemisphere (120° cone)' },
        { id: 'rled', name: 'Red LED chip', nm: 630, dnm: 25, div: 2.09, rad: 3e5, note: 'a narrower spectrum, but the same wide cone' },
        { id: 'ld', name: 'Laser diode, 5 mW (bare)', nm: 650, dnm: 1, div: 0.52, rad: lasr(5e-3, 1.2, 650), w0: 0, note: 'bare chip: a very bright spot but a fast-spreading beam (30° × 8°); a lens fixes that' },
        { id: 'hene', name: 'He–Ne laser, 1 mW', nm: 632.8, dnm: wid(632.8, 1.5e9), div: 2 * B.divergence(0.4e-3, 632.8, 1.05), rad: lasr(1e-3, 1.05, 632.8), w0: 0.4e-3, note: 'a TEM₀₀ beam 0.8 mm across; several modes within 1.5 GHz' },
        { id: 'yag', name: 'Green laser, one mode', nm: 532, dnm: wid(532, 1e3), div: 2 * B.divergence(0.35e-3, 532, 1.05), rad: lasr(0.1, 1.05, 532), w0: 0.35e-3, note: 'a frequency-doubled Nd:YAG ring laser: one mode, a kilohertz wide' }
      ];
      SRC.forEach(s => { s.Lc = O.diff.coherenceLength(s.nm, s.dnm); });
      let sel = Math.max(0, SRC.findIndex(s => s.id === (params.row || 'hene')));
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Distance to the wall', min: 0.1, max: 1000, log: true, sig: 2, value: 10, fmt: v => fmtLen(v) }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Selected'], ['nm', 'Wavelength'], ['dl', 'Spectral width Δλ'], ['Lc', 'Coherence length λ²/Δλ'], ['div', 'Divergence (full angle)'], ['spot', 'Spot diameter on the wall'], ['rad', 'Radiance'], ['sun', 'Radiance ÷ the Sun\'s'], ['note', 'About']]);
      const geo = (W, Hh) => ({ top: 52, rowH: (Hh - 60) / SRC.length, lx: 10, cx: Math.min(190, W * 0.27), cw: (W - Math.min(190, W * 0.27) - 18) / 4 });
      kit.click(st, p => { const g = geo(st.W, st.H), i = Math.floor((p.y - g.top) / g.rowH); if (i >= 0 && i < SRC.length) { sel = i; loop.once(); } }, p => { const g = geo(st.W, st.H); return p.y > g.top; });
      const track = (c, C, x, y, w, h, v, lo, hi, color) => {
        const f = clamp((Math.log10(Math.max(v, 1e-300)) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)), 0, 1);
        c.fillStyle = C.faint; c.globalAlpha = 0.18; c.fillRect(x, y, w, h); c.globalAlpha = 1; c.fillStyle = color; c.fillRect(x, y, Math.max(2, f * w), h);
      };
      const nmTxt = v => v >= 1 ? +v.toPrecision(2) + ' nm' : sci(v, 1) + ' nm';
      const dvTxt = v => v < 0.1 ? +(v * 1e3).toPrecision(2) + ' mrad' : Math.round(v * R2D) + '°';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = geo(W, Hh);
        const cols = [['Spectral width', 1e-7, 1e3, s => s.dnm, nmTxt, C.series[2], 'Δλ, log scale'], ['Coherence length', 1e-7, 1e6, s => s.Lc, fmtLen, C.series[0], 'λ²/Δλ, log scale'], ['Divergence', 1e-4, 4, s => s.div, dvTxt, C.series[3], 'full angle, log'], ['Radiance', 1e4, 1e13, s => s.rad, v => sci(v, 1), C.series[1], 'W/(m²·sr), log']];
        cols.forEach((q, j) => { kit.label(c, q[0], g.cx + j * g.cw, 22, { color: C.text, size: 12, weight: 650 }); kit.label(c, q[6], g.cx + j * g.cw, 38, { color: C.faint, size: 10.5 }); });
        SRC.forEach((s, i) => {
          const y = g.top + g.rowH * i;
          if (i === sel) { c.fillStyle = C.accent; c.globalAlpha = 0.14; c.fillRect(4, y + 1, W - 8, g.rowH - 2); c.globalAlpha = 1; }
          kit.label(c, s.name, g.lx, y + g.rowH / 2, { color: i === sel ? C.text : C.muted, size: 11.5, weight: i === sel ? 700 : 500 });
          cols.forEach((q, j) => {
            const v = q[3](s), x = g.cx + j * g.cw, w = g.cw - 14;
            kit.label(c, q[4](v), x, y + g.rowH * 0.34, { color: C.text, size: 10.5 });
            track(c, C, x, y + g.rowH * 0.55, w, 8, v, q[1], q[2], q[5]);
          });
        });
        const s = SRC[sel];
        ro.set('name', s.name); ro.set('nm', s.nm + ' nm');
        ro.set('dl', nmTxt(s.dnm)); ro.set('Lc', fmtLen(s.Lc)); ro.set('div', s.div < 0.1 ? (s.div * 1e3).toPrecision(2) + ' mrad' : s.div.toFixed(2) + ' rad (' + Math.round(s.div * R2D) + '°)');
        ro.set('spot', s.w0 != null ? fmtLen(2 * s.w0 + s.div * V.d) + ' at ' + fmtLen(V.d) : s.div < 0.1 ? 'the Sun\'s disc: 0.53° across' : 'no spot: the light fills the whole room');
        ro.set('rad', sci(s.rad, 1) + ' W/(m²·sr)'); ro.set('sun', sci(s.rad / 2.0e7, 1) + ' ×'); ro.set('note', s.note);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ laser classes, MPE, NOHD */
  Hyper.sim('lp-safety', {
    title: 'Laser classes, the maximum permissible exposure and the nominal ocular hazard distance',
    blurb: `For a visible continuous beam the **class** follows from the power. What actually matters for the eye is the irradiance that reaches it compared with the **maximum permissible exposure (MPE)**: the most the eye can take without injury, which depends on how long the exposure lasts (a blink, 0.25 s, or a stare, 10 s). A beam spreads as it travels, so there is a **nominal ocular hazard distance (NOHD)**: inside it the beam is above the MPE, beyond it below. The red zone is the hazard distance; the eye marks your distance from the laser.

**Try this**
- Start at 5 mW (Class 3R): the hazard distance for a blink is around ten metres, longer for a stare. The class says "avoid direct viewing", and the number says how far that avoidance must reach.
- Raise the power to 1 W (Class 4): the hazard distance is hundreds of metres for the same small beam. Increase the divergence: the same beam becomes much safer at distance because it spreads.
- Set the power at 1 mW, a blink, and read the *power allowed into a 7 mm pupil*: it is the Class 2 limit. That is how the limit is defined.
- Compare *A blink* with *Staring*: the permissible irradiance is lower for the longer exposure.

This tool is for understanding only. It treats visible (400–700 nm) continuous beams with a uniform beam profile; infrared and ultraviolet beams, pulsed beams and extended sources have different limits, set by the standard (IEC 60825-1). Real work with Class 3B and Class 4 lasers is governed by that standard and by a laser safety officer.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, L = O.laser;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'distance from the laser', min: 0.1, max: 1e4, log: true, fmt: v => fmtLen(v) }, y: { label: 'irradiance (W/m²)', log: true, min: 1e-6, max: 1e10 }, series: [] }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Beam power', min: 1e-4, max: 100, log: true, sig: 2, value: params.P || 5e-3, fmt: v => eng(v, 'W', 2) },
        { id: 'a', label: 'Beam diameter at the laser', min: 0.5, max: 20, step: 0.1, value: params.a || 1.5, unit: 'mm' },
        { id: 'phi', label: 'Divergence (full angle)', min: 0.1, max: 50, log: true, sig: 2, value: params.phi || 1.5, fmt: v => kit.fmt(v, 2) + ' mrad' },
        { id: 't', type: 'select', label: 'How long the eye is exposed', options: [['A blink or a glance: 0.25 s', 0.25], ['Staring: 10 s', 10]], value: params.t || 0.25 },
        { id: 'd', label: 'Your distance from the laser', min: 0.1, max: 1e4, log: true, sig: 2, value: params.d || 5, fmt: v => fmtLen(v) },
        { type: 'buttons', items: [{ id: 'c2', label: '1 mW' }, { id: 'c3r', label: '5 mW' }, { id: 'c3b', label: '100 mW' }, { id: 'c4', label: '1 W', primary: true }] }
      ], id => { const q = { c2: 1e-3, c3r: 5e-3, c3b: 0.1, c4: 1 }[id]; if (q) ctl.set('P', q); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cls', 'Class (visible, continuous)'], ['mpe', 'MPE at the eye'], ['pup', 'Power allowed into a 7 mm pupil'], ['E', 'Beam irradiance at your distance'], ['ratio', 'That is'], ['nohd', 'Hazard distance (NOHD)'], ['say', 'What the class says']]);
      const PUPIL = Math.PI * Math.pow(3.5e-3, 2);
      const names = ['Class 1', 'Class 2', 'Class 3R', 'Class 3B', 'Class 4'];
      const irr = (d, P, a, phi) => 4 * P / (Math.PI * Math.pow(a + phi * d, 2));
      let key = '';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const a = V.a * 1e-3, phi = V.phi * 1e-3, mpe = L.mpe(V.t).E, cls = L.classOf(V.P), ci = L.CLASSES.findIndex(q => q.cls === cls);
        const nohd = L.nohd(V.P, phi, a, mpe), Ed = irr(V.d, V.P, a, phi);
        // the ladder of classes
        const gap = 6, cw = (W - 24 - 4 * gap) / 5, cy = 14, chh = 48;
        L.CLASSES.forEach((q, i) => {
          const x = 12 + i * (cw + gap), on = i === ci;
          c.fillStyle = on ? C.accent : C.faint; c.globalAlpha = on ? 0.3 : 0.12; c.fillRect(x, cy, cw, chh); c.globalAlpha = 1;
          c.strokeStyle = on ? C.accent : C.faint; c.lineWidth = on ? 2.4 : 1; c.strokeRect(x, cy, cw, chh);
          kit.label(c, names[i], x + cw / 2, cy + 15, { align: 'center', color: on ? C.text : C.muted, size: 13, weight: 700 });
          kit.label(c, i < 4 ? '≤ ' + eng(q.limit, 'W', 2) : '> ' + eng(L.CLASSES[3].limit, 'W', 2), x + cw / 2, cy + 34, { align: 'center', color: on ? C.text : C.muted, size: 11.5 });
        });
        let y = wrap(c, kit, L.CLASSES[ci].text + '  Examples: ' + L.CLASSES[ci].examples, 14, cy + chh + 18, W - 28, 16.5, { color: C.text, size: 12 });
        wrap(c, kit, 'Classes 1M and 2M: the limits of 1 and 2, for large or diverging beams; unsafe through binoculars, a telescope or a magnifier.', 14, y + 4, W - 28, 14.5, { color: C.faint, size: 10.5 });
        // the distance axis (logarithmic) with the hazard zone
        const ax0 = 40, ax1 = W - 30, ay = Hh * 0.74, lo = Math.log10(0.1), hi = Math.log10(1e4), X = d => ax0 + clamp((Math.log10(d) - lo) / (hi - lo), 0, 1) * (ax1 - ax0);
        const xn = X(Math.max(0.1, nohd));
        c.fillStyle = C.bad; c.globalAlpha = 0.45; c.fillRect(ax0, ay - 9, xn - ax0, 18); c.globalAlpha = 1;
        c.fillStyle = C.ok; c.globalAlpha = 0.4; c.fillRect(xn, ay - 9, ax1 - xn, 18); c.globalAlpha = 1;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); for (let e = -1; e <= 4; e++) { const x = X(Math.pow(10, e)); c.moveTo(x, ay + 9); c.lineTo(x, ay + 14); } c.stroke();
        for (let e = -1; e <= 4; e++) kit.label(c, fmtLen(Math.pow(10, e)), X(Math.pow(10, e)), ay + 25, { align: 'center', color: C.muted, size: 10.5 });
        S.source(c, ax0 - 12, ay, { kind: 'laser', size: 7, color: C.bad });
        S.eye(c, X(V.d), ay - 28, 11, { dir: -1 });
        kit.label(c, 'you', X(V.d), ay - 48, { align: 'center', color: C.text, size: 11.5 });
        kit.label(c, nohd <= 0.1 ? 'safe everywhere on this scale' : 'NOHD ≈ ' + fmtLen(nohd) + (nohd >= 1e4 ? ' or more' : ''), Math.min(ax1 - 4, Math.max(ax0 + 210, xn)), ay + 46, { align: 'right', color: C.text, size: 12, weight: 700 });
        kit.label(c, 'hazard zone: above the MPE', ax0 + 4, ay - 14, { color: C.bad, size: 11 }); kit.label(c, 'below the MPE', ax1 - 2, ay - 14, { align: 'right', color: C.ok, size: 11 });
        ro.set('cls', names[ci] + '  (limit ' + (ci < 4 ? eng(L.CLASSES[ci].limit, 'W', 2) : 'above ' + eng(L.CLASSES[3].limit, 'W', 2)) + ')');
        ro.set('mpe', mpe.toPrecision(3) + ' W/m²  (' + (mpe / 10).toPrecision(3) + ' mW/cm²)');
        ro.set('pup', eng(mpe * PUPIL, 'W', 3));
        ro.set('E', sci(Ed, 2) + ' W/m² at ' + fmtLen(V.d));
        ro.set('ratio', Ed <= mpe ? (Ed / mpe).toPrecision(2) + ' × the MPE: below the limit' : (Ed / mpe).toPrecision(3) + ' × the MPE: ABOVE the limit');
        ro.set('nohd', nohd <= 0.1 ? 'under 0.1 m' : fmtLen(nohd) + (nohd >= 1e4 ? ' or more' : ''));
        ro.set('say', cls === '1' ? 'safe in normal use' : cls === '2' ? 'the blink reflex protects; do not stare' : cls === '3R' ? 'avoid direct eye exposure' : cls === '3B' ? 'direct beam and mirror reflections injure; enclosures, eyewear, key control' : 'injures by direct and diffuse light; fire hazard; controlled area');
        const k = [V.P, V.a, V.phi, V.t].join('|');
        if (k !== key) {
          key = k; const pts = [];
          for (let i = 0; i <= 100; i++) { const d = Math.pow(10, -1 + 5 * i / 100); pts.push([d, Math.max(irr(d, V.P, a, phi), 1e-7)]); }
          plot.set({ series: [{ pts, label: 'beam irradiance', color: C.series[0], width: 2.6 }], hlines: [{ y: mpe, label: 'MPE', color: C.ok }], vlines: nohd > 0.1 && nohd < 1e4 ? [{ x: nohd, label: 'NOHD', color: C.bad }] : [] });
        }
        plot.set({ marks: [{ x: V.d, y: Math.max(Ed, 1e-7), label: 'you', color: Ed > mpe ? C.bad : C.ok }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the eye and the beam */
  const ZONES = [
    { lo: 100, hi: 315, where: 'cornea', col: 0, text: 'Ultraviolet B and C: absorbed in the cornea, the clear front surface of the eye.', hurt: 'The surface is inflamed (photokeratitis): sandy and painful, and it shows up some hours after the exposure.' },
    { lo: 315, hi: 400, where: 'lens', col: 1, text: 'Ultraviolet A: absorbed mainly by the crystalline lens.', hurt: 'Long or repeated exposure is a recognized risk to the lens (clouding).' },
    { lo: 400, hi: 700, where: 'retina', col: 2, text: 'Visible light: passes through cornea, lens and gel and is focused on the retina.', hurt: 'A burn of the retina, and with blue light a photochemical injury as well. The retina has no pain nerves: there is no pain to warn you.' },
    { lo: 700, hi: 1400, where: 'retina', col: 3, text: 'Near infrared: passes through the eye and is focused on the retina, but is invisible or nearly so: no glare, no blink.', hurt: 'The same retinal burn as for visible light, with no sensation of brightness to make you look away.' },
    { lo: 1400, hi: 3000, where: 'cornea', col: 4, text: 'Short-wave infrared: absorbed by the water of the cornea, the aqueous fluid and the lens; little reaches the retina.', hurt: 'Heating of the front of the eye at high power. "Eye-safer" means a higher exposure limit, not harmless.' },
    { lo: 3000, hi: 1e6, where: 'cornea', col: 5, text: 'Mid and far infrared (such as the 10.6 µm of a CO₂ laser): absorbed in the outer layers of the cornea.', hurt: 'A burn of the surface of the eye.' }
  ];
  Hyper.sim('lp-eye', {
    title: 'A beam and the eye: where each wavelength is absorbed',
    blurb: `The eye is a camera that is transparent from about 400 to 1400 nm. Light in that band is focused on the retina, where the whole beam that the pupil collects lands in a spot some 20 µm across: an irradiance gain of the order of **100 000**. Light outside the band stops earlier: ultraviolet in the cornea and lens, long infrared in the cornea. The strip shows which part takes which wavelength; the numbers compare what reaches the cornea with the visible-light exposure limit, and give the **optical density (OD)** of eyewear that would bring it down. OD 3 passes 1/1000, OD 6 one millionth.

**Try this**
- Press **Green 532** and then **IR 1064**: the beam path is the same, but only one is visible. Then **UV 266** and **CO₂ 10.6 µm**: the beam never reaches the retina.
- Open the pupil from 2 to 7 mm with a wide beam: more power enters, and the retinal gain grows as the square of the beam's width.
- Raise the power to 1 W: the OD needed climbs to 4 or 5. Eyewear is marked with the wavelength range it covers and its OD; it must also survive the beam for some seconds.
- Dial in OD 3 and watch the retinal irradiance fall a thousandfold.

Schematic eye. The cornea-to-retina focusing spot is taken as 20 µm (diffraction plus the eye's own blur), the limits as the visible-light value for a uniform beam, 0.25 s for visible light and 10 s for invisible (no blink reflex). Real limits depend on wavelength, duration and pulse; they are set by the standard (IEC 60825-1) and eyewear is chosen by a laser safety officer. Never look into a laser beam, and never point one at a person, a vehicle or an aircraft.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, L = O.laser;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 200, max: 12000, log: true, sig: 3, value: params.nm || 532, fmt: v => v >= 1000 ? kit.fmt(v / 1000, 3) + ' µm' : Math.round(v) + ' nm' },
        { id: 'P', label: 'Beam power', min: 1e-4, max: 100, log: true, sig: 2, value: params.P || 5e-3, fmt: v => eng(v, 'W', 2) },
        { id: 'db', label: 'Beam diameter at the eye', min: 0.5, max: 20, step: 0.1, value: 3, unit: 'mm' },
        { id: 'pup', label: 'Pupil diameter', min: 2, max: 7, step: 0.1, value: 5, unit: 'mm' },
        { id: 'od', label: 'Optical density of eyewear', min: 0, max: 8, step: 0.5, value: 0 },
        { type: 'buttons', items: [{ id: 'w266', label: 'UV 266' }, { id: 'w445', label: 'Blue 445' }, { id: 'w532', label: 'Green 532', primary: true }, { id: 'w650', label: 'Red 650' }, { id: 'w1064', label: 'IR 1064' }, { id: 'w1550', label: 'IR 1550' }, { id: 'w10600', label: 'CO₂ 10.6 µm' }] }
      ], id => { if (/^w\d+$/.test(id)) ctl.set('nm', +id.slice(1)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['where', 'Absorbed in'], ['Ec', 'Irradiance at the cornea'], ['gain', 'Gain from cornea to retina'], ['Er', 'Irradiance on the retina'], ['lim', 'Exposure limit used'], ['ratio', 'Cornea exposure ÷ limit'], ['need', 'Eyewear needed'], ['with', 'With the eyewear on']]);
      const zoneOf = nm => ZONES.find(z => nm >= z.lo && nm < z.hi) || ZONES[ZONES.length - 1];
      const FEYE = 22.3e-3;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const z = zoneOf(V.nm), lam = V.nm * 1e-9, D = V.db * 1e-3, Dap = Math.min(D, V.pup * 1e-3);
        const reach = z.where === 'retina', visible = V.nm >= 400 && V.nm <= 700, filt = Math.pow(10, -V.od);
        const Pin = V.P * (Dap / D) * (Dap / D), Ec = 4 * V.P / (Math.PI * D * D);
        const spot = Math.hypot(2.44 * lam * FEYE / Dap, 20e-6), gain = Math.pow(Dap / spot, 2), Er = 4 * Pin * filt / (Math.PI * spot * spot);
        const tt = visible ? 0.25 : 10, mpe = L.mpe(tt).E, ratio = Ec * filt / mpe, need = L.od(Ec, mpe);
        // the eye and the beam
        const r = Math.min(W * 0.14, Hh * 0.2), ex = W * 0.7, ey = Hh * 0.3, e = S.eye(c, ex, ey, r, { dir: -1, pupil: 0.1 + 0.5 * (V.pup - 2) / 5 * 0.4 });
        const colr = visible ? S.nm(V.nm) : C.warn, hb = r * (D / 2) / 12;
        const endX = z.where === 'cornea' ? e.cornea : z.where === 'lens' ? ex - r * 0.58 : e.retina;
        S.source(c, 30, ey, { kind: 'laser', size: 8, color: C.bad });
        for (let j = -2; j <= 2; j++) {
          const yj = ey + j / 2 * hb, pts = [[60, yj], [e.cornea, yj]];
          if (z.where === 'retina') pts.push([e.retina, ey]); else if (z.where === 'lens') pts.push([endX, ey + j / 2 * hb * 0.7]); else pts.push([endX + 6, yj]);
          S.ray(c, pts, { color: colr, width: visible ? 1.8 : 1.6, dash: visible ? null : [6, 4], arrows: j === 0, alpha: 0.4 + 0.6 * filt });
        }
        const gx = reach ? e.retina : endX + (z.where === 'cornea' ? 6 : 0), gy = reach ? ey : ey + 0.0;
        c.fillStyle = C.bad; c.globalAlpha = 0.25; c.beginPath(); c.arc(gx, gy, 12, 0, TAU); c.fill(); c.globalAlpha = 0.9; c.beginPath(); c.arc(gx, gy, 4, 0, TAU); c.fill(); c.globalAlpha = 1;
        kit.label(c, z.where === 'retina' ? 'retina' : z.where === 'lens' ? 'lens' : 'cornea', gx + (reach ? 10 : -14), gy - 18, { align: reach ? 'left' : 'right', color: C.bad, size: 11.5, weight: 700 });
        if (!visible) kit.label(c, 'invisible beam', 100, ey - hb - 18, { color: C.warn, size: 11.5 });
        // the strip of wavelengths
        const sx0 = 34, sx1 = W - 34, sy = Hh * 0.64, lo = Math.log10(150), hi = Math.log10(12000), X = nm => sx0 + (Math.log10(clamp(nm, 150, 12000)) - lo) / (hi - lo) * (sx1 - sx0);
        const cols = ['rgba(224,160,48,0.55)', 'rgba(170,110,220,0.55)', 'rgba(229,72,77,0.55)', 'rgba(229,72,77,0.35)', 'rgba(224,160,48,0.4)', 'rgba(224,160,48,0.25)'];
        const tags = ['cornea', 'lens', 'retina', 'retina (invisible)', 'cornea, lens', 'cornea'];
        ZONES.forEach((q, i) => {
          const xa = X(Math.max(q.lo, 150)), xb = X(Math.min(q.hi, 12000)); if (xb <= xa) return;
          c.fillStyle = cols[i]; c.fillRect(xa, sy - 11, xb - xa, 22); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(xa, sy - 11, xb - xa, 22);
          if (xb - xa > tags[i].length * 5.6) kit.label(c, tags[i], (xa + xb) / 2, sy, { align: 'center', color: C.text, size: 10.5 });
        });
        for (const nm of [200, 300, 400, 700, 1000, 1400, 3000, 10000]) { const x = X(nm); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x, sy + 11); c.lineTo(x, sy + 16); c.stroke(); kit.label(c, nm >= 1000 ? nm / 1000 + ' µm' : nm + ' nm', x, sy + 27, { align: 'center', color: C.muted, size: 10 }); }
        const mx = X(V.nm); c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, sy - 13); c.lineTo(mx - 6, sy - 24); c.lineTo(mx + 6, sy - 24); c.closePath(); c.fill();
        kit.label(c, 'absorbed in the…', sx0, sy - 28, { color: C.muted, size: 11 });
        let y = wrap(c, kit, z.text, 16, Hh * 0.8, W - 32, 16.5, { color: C.text, size: 12 });
        wrap(c, kit, 'In general terms: ' + z.hurt, 16, y + 2, W - 32, 16.5, { color: C.muted, size: 11.5 });
        const mw = Ec / 10;
        ro.set('where', z.where === 'retina' ? 'the retina (focused to about ' + (spot * 1e6).toFixed(0) + ' µm)' : z.where === 'lens' ? 'the lens' : 'the cornea' + (z.col === 4 ? ' and the lens' : ''));
        ro.set('Ec', sci(mw, 2) + ' mW/cm²  (' + sci(Ec, 2) + ' W/m²)');
        ro.set('gain', reach ? sci(gain, 1) + ' ×' : 'none: it never reaches the retina');
        ro.set('Er', reach ? sci(Er / 1e4, 2) + ' W/cm²' : '—');
        ro.set('lim', V.nm >= 400 && V.nm <= 1400 ? mpe.toPrecision(3) + ' W/m² (visible value, ' + tt + ' s)' : 'wavelength-specific: see the standard');
        ro.set('ratio', V.nm >= 400 && V.nm <= 1400 ? sci(Ec / mpe, 2) + ' ×' : '—');
        ro.set('need', V.nm >= 400 && V.nm <= 1400 ? (need <= 0 ? 'none at this power' : 'OD ' + need.toFixed(1) + ' or more, at this wavelength') : 'see the standard');
        ro.set('with', V.nm >= 400 && V.nm <= 1400 ? (ratio <= 1 ? 'below the limit (' + sci(ratio, 1) + ' ×)' : 'STILL ABOVE the limit (' + sci(ratio, 1) + ' ×)') : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
