/* HYPER-MOTORS · sims/feedback.js — simulations for Encoders, Sensors and Limit Switches (prefix fb-):
 *   fb-quadrature    an incremental disc in slow motion: A, B, Z, ×1/×2/×4 decoding, noise spikes, sampling limits, index check
 *   fb-encoder-line  one encoder channel down a cable: RS-422, HTL, open collector, TTL; rise times, thresholds, motor-cable spikes
 *   fb-absolute      a code disc in binary or Gray with misaligned detectors, multi-turn retention at power-off, an SSI frame
 *   fb-resolver      a resolver's carriers and envelopes, and a tracking resolver-to-digital converter
 *   fb-hall          three Hall latches on a brushless rotor: codes, commutation steps, misplacement, pull-ups
 *   fb-tacho         a DC tacho closing a speed loop: ripple, loading, filtering, a broken wire; speed from an encoder
 *   fb-limit         a carriage running into a limit switch: stopping distance, NC/NO wiring, broken wire, welded contact
 *   fb-prox          an inductive proximity sensor: oscillator damping, materials, flush/non-flush, PNP/NPN/2-wire outputs
 *   fb-optical       through-beam, retro-reflective, diffuse and slot sensors on a conveyor: excess gain, tricky objects
 *   fb-homing        homing on a switch, a switch plus index, or a hard stop: repeatability over many runs, the index trap
 *   fb-estop         an emergency-stop circuit with a safety relay: stop categories 0/1/2, welded contactor, cross fault, STO
 *   fb-brake         a spring-applied brake: pull-in against air gap and voltage, AC- or DC-side switching, energy per stop
 */
(function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const frac = x => x - Math.floor(x);
  // small seeded random numbers, so every run of a simulation is the same
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const gauss = R => Math.sqrt(-2 * Math.log(Math.max(1e-12, R()))) * Math.cos(TAU * R());
  // a drawing area of W0 × H0 units, scaled and centred in the stage
  function view(st, W0, H0) {
    const c = st.begin(), s = Math.min(st.W / W0, st.H / H0);
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.lineCap = 'round'; c.lineJoin = 'round';
    return c;
  }
  function T(c, s, x, y, col, al, sz, wt) {
    c.fillStyle = col; c.textAlign = al || 'center'; c.textBaseline = 'alphabetic';
    c.font = (wt || 400) + ' ' + (sz || 12) + 'px ' + font(); c.fillText(s, x, y);
  }
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  function line(c, pts, col, w, dash) {
    if (!pts.length) return;
    c.strokeStyle = col; c.lineWidth = w || 1.5; c.setLineDash(dash || []);
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.setLineDash([]);
  }
  function rbox(c, x, y, w, h, fill, stroke, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r == null ? 4 : r); else c.rect(x, y, w, h);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); }
  }
  function sector(c, cx, cy, r0, r1, a0, a1) { c.beginPath(); c.arc(cx, cy, r1, a0, a1); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); }
  function led(c, x, y, on, col, C) { c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fillStyle = on ? col : C.bg2; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke(); }
  const seq4 = (a, b) => a ? (b ? 2 : 1) : (b ? 3 : 0);   // quadrature states in forward order 00 → 10 → 11 → 01

  /* ================================================================ fb-quadrature */
  Hyper.sim('fb-quadrature', {
    title: 'Quadrature: A, B, Z and ×4 counting',
    blurb: `An incremental disc in slow motion, with few lines so they can be seen. Light passes the slots to detectors A and B, a quarter of a line apart, and to Z on the inner track once a turn. A counter samples A and B at its own rate and counts every change of state up or down; the graph compares its count with a perfect decoder's.

**Try this**
- Turn slowly forwards: A rises before B, and each of the four edges per line adds a count (×4). Make the speed negative: B leads and the count falls.
- Switch to ×2 and ×1: fewer counts per line, the same direction logic.
- Add spikes on channel A at low speed in ×4: each spike is counted up and straight back down — the count survives. In ×1 every spike adds a count that never goes away.
- With spikes on, raise the speed: once a spike lasts longer than the gap between edges it hides real edges, and the count drifts. The index check at Z reports it.
- Lower the counter's sampling rate until edges come faster than it samples: A and B change together between samples (illegal transitions, ✕) and counts are lost — the "maximum input frequency" of a counter.
- Move B away from 90°: the edges bunch in pairs, and the closest pair sets the speed limit.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (counts)' }, legend: true }, 170);
      const R = rng(11), hist = [], ev = [], track = [];
      let V = null, th = 0, t = 0, ts = 0, cnt = 0, icnt = 0, pa = 0, pb = 0, ia = 0, ib = 0, pz = 0, illegal = 0;
      let spikeEnd = -1, nextSpike = 0.6, lastZ = null, lastZdir = 0, zMsg = '', lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Lines on the disc (few, so they can be seen)', options: [['12 lines', 12], ['24 lines', 24], ['48 lines', 48]], value: 24 },
        { id: 'rpm', label: 'Shaft speed, slow motion (negative = reverse)', min: -60, max: 60, step: 1, value: 6, unit: 'rpm' },
        { id: 'mode', type: 'select', label: 'Decoding', options: [['×4: every edge of A and B', 4], ['×2: both edges of A', 2], ['×1: rising edges of A', 1]], value: 4 },
        { id: 'phase', label: 'Phase of B behind A', min: 30, max: 150, step: 1, value: 90, unit: '°' },
        { id: 'fs', label: 'Counter sampling rate', min: 40, max: 4000, value: 2000, unit: 'Hz', log: true, sig: 2 },
        { id: 'noise', type: 'select', label: 'Noise spikes', options: [['none', 'none'], ['on channel A only', 'A'], ['on A and B together', 'AB']], value: 'none' },
        { type: 'buttons', items: [{ id: 'zero', label: 'Reset the count', primary: true }] }
      ], id => { if (id === 'zero' || id === 'N' || id === 'mode' || id === 'phase') reset(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Line frequency'], ['cpr', 'Counts per revolution'], ['dir', 'Direction'], ['c', 'Counter / true count'], ['err', 'Error'], ['ill', 'Illegal transitions'], ['z', 'Index check']]);
      const Nn = () => +V.N, Mm = () => +V.mode, ph = () => V.phase / 360;
      const sigA = x => frac(Nn() * x) < 0.5 ? 1 : 0;
      const sigB = x => frac(Nn() * x - ph()) < 0.5 ? 1 : 0;
      const sigZ = x => frac(x - 0.25) < 0.25 / Nn() ? 1 : 0;
      // one decoder step; real = the sampled counter, otherwise the perfect decoder
      function step(a, b, s, real) {
        const pa0 = real ? pa : ia, pb0 = real ? pb : ib;
        if (a === pa0 && b === pb0) return 0;
        const both = a !== pa0 && b !== pb0, m = Mm();
        let d = 0;
        if (m === 4) { if (!both) d = ((seq4(a, b) - seq4(pa0, pb0) + 4) % 4) === 1 ? 1 : -1; }
        else if (a !== pa0) { if (a === 1) d = b === 0 ? 1 : -1; else if (m === 2) d = b === 1 ? 1 : -1; }
        if (real) { pa = a; pb = b; if (both) illegal++; if (d || both) ev.push([s, both ? 0 : d]); } else { ia = a; ib = b; }
        return d;
      }
      function reset() {
        cnt = 0; icnt = 0; illegal = 0; pa = ia = sigA(th); pb = ib = sigB(th); pz = sigZ(th);
        lastZ = null; zMsg = 'waiting for an index pulse'; track.length = 0; ev.length = 0;
      }
      function sample(s, x) {
        if (V.noise !== 'none' && s >= nextSpike) { spikeEnd = s + 0.03; nextSpike = s + 0.2 + 0.7 * R(); }
        const sp = V.noise !== 'none' && s < spikeEnd ? 1 : 0;
        let a = sigA(x), b = sigB(x);
        if (sp) { a = 1; if (V.noise === 'AB') b = 1; }
        cnt += step(a, b, s, true);
        const z = sigZ(x);
        if (z && !pz) {
          const dir = Math.sign(V.rpm);
          if (lastZ != null && dir !== 0 && dir === lastZdir) {
            const d = cnt - lastZ, want = dir * Mm() * Nn();
            zMsg = d === want ? '✓ ' + Math.abs(d) + ' counts between index pulses' : '✗ ' + Math.abs(d) + ' counts between index pulses — should be ' + Math.abs(want);
          }
          lastZ = cnt; lastZdir = dir;
        }
        pz = z;
        const h = hist.length ? hist[hist.length - 1] : null;
        if (!h || h[1] !== a || h[2] !== b || h[3] !== z || h[4] !== sp) hist.push([s, a, b, z, sp]);
      }
      reset();
      const loop = kit.loop(dt => {
        const w = V.rpm / 60, N = Nn(), m = Mm();
        const n = Math.max(1, Math.ceil(Math.abs(w * dt) * N * 16)), h = dt / n;
        for (let k = 0; k < n; k++) {
          const th1 = th + w * h, t1 = t + h;
          icnt += step(sigA(th1), sigB(th1), t1, false);
          while (ts <= t1) { sample(ts, th + w * (ts - t)); ts += 1 / V.fs; }
          th = th1; t = t1;
        }
        while (hist.length > 2 && hist[1][0] < t - 3) hist.shift();
        while (ev.length && ev[0][0] < t - 3) ev.shift();
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t; track.push([t, cnt, icnt]); if (track.length > 300) track.shift();
          pl.set({ series: [{ pts: track.map(p => [p[0], p[2]]), label: 'true count (perfect decoder)', color: kit.colors().muted, dash: [5, 4] }, { pts: track.map(p => [p[0], p[1]]), label: 'counter' }] });
        }
        const f = Math.abs(w) * N, err = cnt - icnt;
        const gapT = Math.abs(w) > 0 ? Math.min(ph(), 0.5 - ph()) / N / Math.abs(w) : Infinity;
        ro.set('f', f.toFixed(2) + ' Hz per channel; closest edges ' + (isFinite(gapT) ? (gapT * 1000).toFixed(1) + ' ms' : '—') + ' apart');
        ro.set('cpr', (m * N) + ' (' + m + ' × ' + N + ' lines), ' + (360 / (m * N)).toFixed(2) + '° each');
        ro.set('dir', V.rpm > 0 ? 'forwards: A leads B' : V.rpm < 0 ? 'reverse: B leads A' : 'stopped');
        ro.set('c', cnt + ' / ' + icnt);
        ro.set('err', err === 0 ? '0 — the count is right' : (err > 0 ? '+' : '') + err + ' counts = ' + (err * 360 / (m * N)).toFixed(1) + '°');
        ro.set('ill', illegal + (gapT < 1 / V.fs ? ' — edges come faster than the counter samples!' : ''));
        ro.set('z', zMsg);

        // drawing: the disc and its detectors, then the logic traces
        const C = kit.colors(), c = view(st, 660, 270), cx = 135, cy = 140;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 120, 0, TAU); c.fill();
        c.fillStyle = C.text;
        for (let k = 0; k < N; k++) { sector(c, cx, cy, 88, 114, TAU * ((k + 0.5) / N - th), TAU * ((k + 1) / N - th)); c.fill(); }
        sector(c, cx, cy, 60, 74, TAU * (0.25 / N - th), TAU * (1 - th)); c.fill();
        c.fillStyle = C.muted; c.beginPath(); c.arc(cx, cy, 18, 0, TAU); c.fill();
        const sa = sigA(th), sb = sigB(th), sz = sigZ(th), spNow = V.noise !== 'none' && t < spikeEnd;
        const det = (ang, r, on, lab, lr) => {
          const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
          c.save(); c.translate(x, y); c.rotate(ang + Math.PI / 2); rbox(c, -5, -10, 10, 20, on ? C.warn : C.bg2, C.accent, 2); c.restore();
          T(c, lab, cx + lr * Math.cos(ang), cy + lr * Math.sin(ang) + 4, C.text, 'center', 12, 700);
        };
        det(-Math.PI / 2, 101, sa, 'A', 128);
        det(-Math.PI / 2 - TAU * (1 + ph()) / N, 101, sb, 'B', 128);
        det(-Math.PI / 2, 67, sz, 'Z', 44);
        if (spNow) T(c, '⚡ spike', cx + 70, 22, C.bad, 'center', 12, 700);
        T(c, 'the disc turns anticlockwise going forwards', cx, 266, C.muted, 'center', 10.5);
        const x0 = 292, x1 = 650, span = 2.5, tx = s => x0 + (s - (t - span)) / span * (x1 - x0);
        for (let i = 0; i < hist.length; i++) {
          if (!hist[i][4]) continue;
          const a0 = Math.max(x0, tx(hist[i][0])), a1 = i + 1 < hist.length ? tx(hist[i + 1][0]) : x1;
          if (a1 > x0) { c.fillStyle = 'hsl(0 80% 55% / .18)'; c.fillRect(a0, 30, Math.max(1, a1 - a0), 150); }
        }
        [['A', 1, 34], ['B', 2, 86], ['Z', 3, 138]].forEach(([lab, idx, y]) => {
          T(c, lab, x0 - 14, y + 22, C.text, 'center', 13, 700);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y + 32); c.lineTo(x1, y + 32); c.stroke();
          const pts = []; let prev = null;
          for (const hh of hist) {
            const x = tx(Math.max(hh[0], t - span)), v = hh[idx];
            if (prev != null) pts.push([x, y + 32 - prev * 26]);
            pts.push([x, y + 32 - v * 26]); prev = v;
          }
          if (prev != null) pts.push([x1, y + 32 - prev * 26]);
          line(c, pts, idx === 3 ? C.series[2] : C.accent, 2);
        });
        T(c, 'counts', x0 - 14, 208, C.muted, 'center', 10);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, 204); c.lineTo(x1, 204); c.stroke();
        for (const e of ev) {
          const x = tx(e[0]); if (x < x0) continue;
          if (e[1] === 0) T(c, '✕', x, 209, C.bad, 'center', 12, 700);
          else { c.strokeStyle = e[1] > 0 ? C.ok : C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 204); c.lineTo(x, e[1] > 0 ? 192 : 216); c.stroke(); }
        }
        T(c, 'up: +1 · down: −1 · ✕: A and B changed together (illegal)', 471, 236, C.muted, 'center', 11);
        T(c, 'the last ' + span + ' s as the counter samples it; red bands are noise spikes', 471, 254, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-encoder-line */
  const LINK = {
    // Imax: the current the output can push into the cable's capacitance, which limits the slew rate
    rs422: { name: 'TTL line driver (RS-422)', diff: true, hi: 2.5, lo: -2.5, up: 0.2, dn: -0.2, Rout: 25, Imax: 0.1 },
    htl: { name: 'HTL push-pull, 24 V', hi: 22, lo: 1, up: 13, dn: 8, Rout: 150, Imax: 0.03 },
    oc: { name: 'Open collector, pull-up to 24 V', hi: 24, lo: 0.4, up: 13, dn: 8, Rout: 20, oc: true, Imax: 0.03 },
    ttl: { name: 'TTL single-ended, 5 V', hi: 4, lo: 0.2, up: 2.0, dn: 0.8, Rout: 50, Imax: 0.02 }
  };
  const PWM_EDGE = 1 / 16000;   // spikes from a motor cable: every edge of an 8 kHz PWM
  // one encoder link over three line periods: both channels through the cable's RC and the receiver's thresholds
  function linkRun(o) {
    const L = LINK[o.type], P = 1 / o.f, Cc = 100e-12 * o.len + 100e-12;
    const tauR = (L.oc ? o.rpull : L.Rout) * Cc, tauF = L.Rout * Cc;
    const t0 = -2 * P, t1 = 3 * P, n = Math.min(250000, Math.max(3000, Math.ceil((t1 - t0) / Math.min(P / 600, 5e-8))));
    const dt = (t1 - t0) / n, aR = 1 - Math.exp(-dt / tauR), aF = 1 - Math.exp(-dt / tauF), slew = L.Imax / Cc * dt;
    const swing = L.hi - L.lo, trise = L.oc ? 2.2 * tauR : Math.max(2.2 * tauR, 0.8 * swing * Cc / L.Imax), tfall = Math.max(2.2 * tauF, 0.8 * swing * Cc / L.Imax);
    const tsp0 = 0.9 * P;
    const spike = s => {
      if (!o.vn) return 0;
      let u = (s - tsp0) % PWM_EDGE; if (u < 0) u += PWM_EDGE;
      return u < 2e-6 ? o.vn * Math.exp(-u / 2e-7) * Math.cos(TAU * u / 5e-7) : 0;
    };
    const ideal = (s, sh) => frac(s / P + 0.1 - sh) < 0.5 ? 1 : 0;
    const chan = sh => {
      const v = new Float32Array(n + 1), d = new Uint8Array(n + 1);
      let x = ideal(t0, sh) ? L.hi : L.lo, q = ideal(t0, sh);
      for (let k = 0; k <= n; k++) {
        const s = t0 + k * dt, tgt = ideal(s, sh) ? L.hi : L.lo;
        const lim = L.oc && tgt > x ? Infinity : slew;   // the pull-up's rise is plain RC; driven edges are also current-limited
        x += clamp((tgt - x) * (tgt > x ? aR : aF), -lim, lim);
        const vin = x + (L.diff ? 0.05 : 1) * spike(s);
        if (vin > L.up) q = 1; else if (vin < L.dn) q = 0;
        v[k] = x; d[k] = q;
      }
      return { v, d };
    };
    const A = chan(0), B = chan(0.25), k0 = Math.ceil(-t0 / dt);
    let pa = A.d[k0], pb = B.d[k0], plus = 0, minus = 0, ill = 0;
    for (let k = k0 + 1; k <= n; k++) {
      const a = A.d[k], b = B.d[k];
      if (a === pa && b === pb) continue;
      if (a !== pa && b !== pb) ill++; else if (((seq4(a, b) - seq4(pa, pb) + 4) % 4) === 1) plus++; else minus++;
      pa = a; pb = b;
    }
    const nsp = Math.floor((3 * P - tsp0) / PWM_EDGE) - Math.ceil(-tsp0 / PWM_EDGE) + 1;
    return { L, P, Cc, tauR, tauF, trise, tfall, t0, dt, n, k0, A, B, spike, ideal, net: plus - minus, minus, ill, err: Math.abs(12 - (plus - minus)) + minus + ill, nsp: Math.max(1, nsp) };
  }

  Hyper.sim('fb-encoder-line', {
    title: 'An encoder signal down a cable',
    blurb: `Channels A and B of an incremental encoder travel down a cable to a receiver with switching thresholds. The cable's capacitance (about 100 pF per metre) slows every edge through the driver's output resistance — or, for open collector, through the pull-up resistor — and a motor cable alongside couples a spike at every PWM edge. The left graph is what the receiver's input sees over three line periods; the right graph compares the logic sent with the logic received, and the read-out says whether the ×4 count survives.

**Try this**
- Start with open collector: lengthen the cable or raise the speed until the rising edges arrive too late. The high pulses shrink, A's rise slips past B's edges and counts go wrong. A smaller pull-up helps — at the cost of more current.
- Switch to HTL push-pull: the output drives both ways, so the edges are much faster at the same length.
- Add motor-cable spikes with TTL single-ended: a few volts cross its 0.8–2 V thresholds and fake extra edges. Now choose the RS-422 line driver: the spike appears on both wires alike and the receiver, looking at the difference, ignores it.
- Untick the shielded, separated cable and watch every spike grow.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      const pA = kit.plot(g1, { x: { label: 'time (µs)' }, y: { label: 'receiver input (V)' }, legend: true }, 200);
      const pD = kit.plot(g2, { x: { label: 'time (µs)' }, y: { label: 'logic, stacked', min: -0.3, max: 6 }, legend: true }, 200);
      let V = null, res = null, ang = 0, flick = 0;
      const R = rng(5);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Output stage', options: Object.entries(LINK).map(([k, v]) => [v.name, k]), value: 'oc' },
        { id: 'ppr', label: 'Lines per revolution (PPR)', min: 100, max: 10000, value: 1000, log: true, sig: 2 },
        { id: 'rpm', label: 'Shaft speed', min: 100, max: 6000, step: 50, value: 1500, unit: 'rpm' },
        { id: 'len', label: 'Cable length', min: 1, max: 300, value: 50, unit: 'm', log: true, sig: 2 },
        { id: 'rpull', label: 'Pull-up resistor (open collector)', min: 0.47, max: 10, value: 2.2, unit: 'kΩ', log: true, sig: 2 },
        { id: 'vn', label: 'Spike coupled from a motor cable', min: 0, max: 15, step: 0.5, value: 0, unit: 'V' },
        { id: 'shield', type: 'check', label: 'Shielded cable in a separate duct (spikes ÷ 4)', value: true }
      ], () => run());
      V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Line frequency / count rate'], ['q', 'A-to-B edge spacing'], ['tr', 'Rise time (10–90 %)'], ['cc', 'Cable capacitance'], ['st', 'The ×4 count'], ['dr', 'Drift']]);
      function run() {
        const f = V.ppr * V.rpm / 60, o = { type: V.type, f, len: V.len, rpull: V.rpull * 1000, vn: V.vn * (V.shield ? 0.25 : 1) };
        ctl.show('rpull', V.type === 'oc');
        res = linkRun(o);
        const clean = o.vn ? linkRun(Object.assign({}, o, { vn: 0 })) : res;
        const r = res, L = r.L, us = s => s * 1e6;
        const k1 = r.n, bins = 700, per = Math.max(1, Math.floor((k1 - r.k0) / bins));
        const decim = g => {
          const pts = [];
          for (let k = r.k0; k < k1; k += per) {
            let mn = Infinity, mx = -Infinity, kmn = k, kmx = k;
            for (let j = k; j < Math.min(k1, k + per); j++) { const v = g(j); if (v < mn) { mn = v; kmn = j; } if (v > mx) { mx = v; kmx = j; } }
            const a = Math.min(kmn, kmx), b = Math.max(kmn, kmx);
            pts.push([us(r.t0 + a * r.dt), g(a)]); if (b !== a) pts.push([us(r.t0 + b * r.dt), g(b)]);
          }
          return pts;
        };
        const nz = j => r.spike(r.t0 + j * r.dt);
        const series = L.diff
          ? [{ pts: decim(j => 2.2 + r.A.v[j] / 2 + nz(j)), label: 'wire A' }, { pts: decim(j => 2.2 - r.A.v[j] / 2 + 0.95 * nz(j)), label: 'wire Ā' }, { pts: decim(j => r.A.v[j] + 0.05 * nz(j)), label: 'receiver: A − Ā' }]
          : [{ pts: decim(j => r.A.v[j] + nz(j)), label: 'channel A at the receiver' }];
        pA.set({ series, hlines: [{ y: L.up, label: 'switches on' }, { y: L.dn, label: 'switches off' }] });
        const dig = (arr, off) => { const pts = []; let prev = null; for (let j = r.k0; j <= k1; j += Math.max(1, Math.floor(per / 4))) { const v = arr(j); if (prev !== null && v !== prev) pts.push([us(r.t0 + j * r.dt), off + prev]); pts.push([us(r.t0 + j * r.dt), off + v]); prev = v; } return pts; };
        const C = kit.colors();
        pD.set({ series: [
          { pts: dig(j => r.ideal(r.t0 + j * r.dt, 0), 4.5), label: 'A sent', color: C.muted, dash: [4, 3] }, { pts: dig(j => r.A.d[j], 3), label: 'A received', color: C.series[0] },
          { pts: dig(j => r.ideal(r.t0 + j * r.dt, 0.25), 1.5), label: 'B sent', color: C.muted, dash: [4, 3] }, { pts: dig(j => r.B.d[j], 0), label: 'B received', color: C.series[1] }] });
        const P = r.P, errRC = clean.err, errNz = Math.max(0, r.err - errRC);
        const rate = errRC * f / 3 + errNz / r.nsp / PWM_EDGE;
        ro.set('f', kit.eng(f, 'Hz') + ' per channel, ' + kit.eng(4 * f, 'counts/s'));
        ro.set('q', kit.eng(P / 4, 's'));
        ro.set('tr', kit.eng(r.trise, 's') + (L.oc ? ' up, ' + kit.eng(r.tfall, 's') + ' down' : '') + ' = ' + (100 * r.trise / (P / 4)).toFixed(0) + ' % of the edge spacing');
        ro.set('cc', kit.eng(r.Cc, 'F'));
        ro.set('st', r.err === 0 ? '✓ 12 of 12 edges counted in 3 periods' : '✗ net ' + r.net + ' of 12 counts, ' + r.minus + ' backwards, ' + r.ill + ' illegal');
        ro.set('dr', rate < 0.5 ? 'none' : '≈ ' + kit.eng(rate, 'counts/s') + ' wrong — ' + (rate * 60 / (4 * V.ppr)).toFixed(1) + ' turns a minute');
      }
      run();
      const loop = kit.loop(dt => {
        ang += dt * Math.min(4, V.rpm / 500); flick += dt;
        const C = kit.colors(), c = view(st, 660, 190), L = LINK[V.type], ok = res && res.err === 0;
        rbox(c, 14, 58, 92, 84, C.surface2, C.text, 6);
        c.save(); c.translate(60, 94); c.rotate(ang); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 24, 0, TAU); c.stroke();
        for (let k = 0; k < 16; k++) { const a = k * TAU / 16; c.beginPath(); c.moveTo(18 * Math.cos(a), 18 * Math.sin(a)); c.lineTo(24 * Math.cos(a), 24 * Math.sin(a)); c.stroke(); }
        c.restore();
        T(c, 'encoder', 60, 136, C.muted, 'center', 11);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(112, 84); c.lineTo(136, 100); c.lineTo(112, 116); c.closePath(); c.fill();
        const xa = 142, xb = 500;
        if (V.shield) { c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(xa, 76, xb - xa, 48); c.setLineDash([]); T(c, 'shield', xa + 24, 72, C.muted, 'center', 10); }
        if (L.diff) {
          const p1 = [], p2 = [];
          for (let x = xa; x <= xb; x += 3) { const y = 9 * Math.cos((x - xa) / 9); p1.push([x, 100 + y]); p2.push([x, 100 - y]); }
          line(c, p1, C.accent, 2); line(c, p2, C.series[1], 2);
          T(c, 'A and Ā twisted together', (xa + xb) / 2, 138, C.muted, 'center', 11);
        } else {
          line(c, [[xa, 96], [xb, 96]], C.accent, 2); line(c, [[xa, 112], [xb, 112]], C.muted, 1.5, [6, 4]);
          T(c, 'signal A over one wire; 0 V return', (xa + xb) / 2, 138, C.muted, 'center', 11);
        }
        T(c, V.len.toFixed(0) + ' m of cable', (xa + xb) / 2, 66, C.text, 'center', 12, 600);
        line(c, [[xa, 168], [xb, 168]], C.warn, 4);
        T(c, 'motor cable: PWM edges of hundreds of volts', (xa + xb) / 2, 186, C.muted, 'center', 11);
        if (V.vn > 0 && Math.floor(flick * 8) % 2 === 0) {
          for (let k = 0; k < 4; k++) { const x = xa + 40 + ((k * 97 + Math.floor(flick * 8) * 53) % (xb - xa - 80)), s = V.shield ? 0.5 : 1; line(c, [[x, 162], [x + 5, 150], [x - 4, 144], [x + 3, 150 - 26 * s]], C.bad, 1.5); }
        }
        rbox(c, 510, 58, 136, 84, C.surface2, C.text, 6);
        T(c, 'receiver', 578, 78, C.text, 'center', 12, 600);
        T(c, L.diff ? 'on above +0.2 V' : 'on above ' + L.up + ' V', 578, 98, C.muted, 'center', 11);
        T(c, L.diff ? 'off below −0.2 V' : 'off below ' + L.dn + ' V', 578, 114, C.muted, 'center', 11);
        led(c, 578, 130, true, ok ? C.ok : C.bad, C);
        if (L.oc) {
          kit.schem.resistor(c, 522, 20, 522, 56, { label: V.rpull.toFixed(2) + ' kΩ', color: C.text });
          T(c, '+24 V', 522, 14, C.muted, 'center', 11);
        }
        T(c, ok ? 'count OK' : 'counts lost', 578, 156, ok ? C.ok : C.bad, 'center', 12, 700);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-absolute */
  Hyper.sim('fb-absolute', {
    title: 'An absolute encoder: code disc, Gray code and SSI',
    blurb: `A code disc with one track per bit (the innermost is the most significant) read by a row of detectors at the top. Real detectors are never perfectly in line, so each sits a little ahead of or behind its neighbours. The graph shows the true position and what the encoder reads; the frame at the bottom right is the SSI transmission of the whole position, turns first.

**Try this**
- In natural binary with some misalignment, watch the reading at the boundaries: when several bits change together, false positions flash up (at 7 → 8 on four bits anything can appear). The false-reading count climbs.
- Switch to Gray code: one bit changes at each boundary, so a boundary reading is always one of the two neighbours — the false readings stop, whatever the misalignment.
- Press *Switch off, turn 3¾ turns, switch on* with each multi-turn method: the gear train and a good battery keep the turn count; a flat battery or a single-turn encoder cannot say how many turns went by.
- Lengthen the SSI cable at a high clock: the bits come back later than the receiver samples them and the number it reads is shifted. Lower the clock until it fits.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position within the turn', min: 0 }, legend: true }, 170);
      const MIS = [0.8, -1, 0.55, -0.7, 1];
      const trk = [];
      let V = null, th = 0.3, t = 0, powered = true, offLeft = 0, mtValid = true, alarm = '', falseN = 0, wasWrong = false, lastPlot = -1, lastRead = -1;
      const ctl = kit.controls(box.side, [
        { id: 'b', type: 'select', label: 'Bits per turn (few, so they can be seen)', options: [['3 bits: 8 positions', 3], ['4 bits: 16 positions', 4], ['5 bits: 32 positions', 5]], value: 4 },
        { id: 'code', type: 'select', label: 'Code on the disc', options: [['natural binary', 'bin'], ['Gray code', 'gray']], value: 'bin' },
        { id: 'mis', label: 'Detector misalignment, % of a step', min: 0, max: 45, step: 1, value: 20, unit: '%' },
        { id: 'rpm', label: 'Shaft speed, slow motion', min: -12, max: 12, step: 0.5, value: 2, unit: 'rpm' },
        { id: 'mt', type: 'select', label: 'Multi-turn method', options: [['battery-backed counter', 'batt'], ['gear train', 'gear'], ['none: single-turn only', 'single']], value: 'batt' },
        { id: 'flat', type: 'check', label: 'Battery flat', value: false },
        { id: 'clk', label: 'SSI clock', min: 50, max: 2000, value: 500, unit: 'kHz', log: true, sig: 2 },
        { id: 'len', label: 'SSI cable length', min: 1, max: 1000, value: 50, unit: 'm', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'off', label: 'Switch off, turn 3¾ turns, switch on', primary: true }, { id: 'clr', label: 'Clear the false readings' }] }
      ], id => {
        if (id === 'off' && powered) { powered = false; offLeft = 3.75; }
        if (id === 'mt') { mtValid = V.mt !== 'single'; alarm = V.mt === 'single' ? 'single-turn: the number of turns is not known' : ''; }
        if (id === 'clr' || id === 'b' || id === 'code') { falseN = 0; trk.length = 0; lastRead = -1; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['rd', 'Detectors read'], ['tp', 'True position'], ['fr', 'False readings'], ['turn', 'Turns counted'], ['ssi', 'SSI frame'], ['cab', 'Cable round trip']]);
      const P = () => 1 << +V.b;
      const enc = v => V.code === 'gray' ? (v ^ (v >> 1)) : v;
      const dec = g => { if (V.code !== 'gray') return g; let v = 0; for (let s = g; s; s >>= 1) v ^= s; return v; };
      const read = x => {
        const b = +V.b, Pn = P(); let wd = 0;
        for (let i = 0; i < b; i++) { const pos = Math.floor(frac(x + MIS[i] * V.mis / 100 / Pn) * Pn); wd |= ((enc(pos) >> i) & 1) << i; }
        return { word: wd, value: dec(wd) };
      };
      const bitsOf = (wd, n) => { let s = ''; for (let i = n - 1; i >= 0; i--) s += (wd >> i) & 1; return s; };
      const loop = kit.loop(dt => {
        const n = 40, h = dt / n, Pn = P(), b = +V.b;
        for (let k = 0; k < n; k++) {
          const w = powered ? V.rpm / 60 : 1.5;
          th += w * h; t += h;
          if (!powered) {
            offLeft -= w * h;
            if (offLeft <= 0) {
              powered = true; mtValid = V.mt === 'gear' || (V.mt === 'batt' && !V.flat);
              alarm = V.mt === 'single' ? 'single-turn: the number of turns is not known' : mtValid ? '' : 'battery flat: the turn count is lost — reference the axis';
            }
            continue;
          }
          const r = read(th), tp = Math.floor(frac(th) * Pn);
          const ok = r.value === tp || r.value === (tp + 1) % Pn || r.value === (tp + Pn - 1) % Pn;
          if (!ok && !wasWrong) falseN++;
          wasWrong = !ok;
          if (r.value !== lastRead) { trk.push([t, tp, r.value]); lastRead = r.value; }
        }
        while (trk.length > 2 && trk[1][0] < t - 12) trk.shift();
        if (trk.length > 3000) trk.splice(0, trk.length - 3000);
        const r = read(th), tp = Math.floor(frac(th) * Pn), turns = Math.floor(th), known = powered && mtValid;
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const tr = [], rd = [];
          for (let i = 0; i < trk.length; i++) {
            const tt = trk[i][0], nx = i + 1 < trk.length ? trk[i + 1][0] : t;
            tr.push([tt, trk[i][1]], [nx, trk[i][1]]); rd.push([tt, trk[i][2]], [nx, trk[i][2]]);
          }
          pl.set({ x: { label: 'time (s)', min: Math.max(0, t - 12), max: Math.max(12, t) }, y: { label: 'position within the turn', min: 0, max: Pn }, series: [{ pts: tr, label: 'true position', color: kit.colors().muted, dash: [5, 4] }, { pts: rd, label: 'read by the encoder' }] });
        }
        const nb = 4 + b, tcode = known ? enc(((turns % 16) + 16) % 16) : 0, frame = (tcode << b) | r.word;
        const trt = 10e-9 * V.len, fmax = 1 / (2 * (trt + 1e-7)), fitOk = V.clk * 1e3 <= fmax;
        const tf = (nb + 1) / (V.clk * 1e3) + 20e-6;
        ro.set('rd', bitsOf(r.word, b) + ' → ' + r.value + (wasWrong ? '  ✗ false' : ''));
        ro.set('tp', tp + ' of ' + Pn + ' (' + (360 * frac(th)).toFixed(1) + '°)');
        ro.set('fr', String(falseN));
        ro.set('turn', !powered ? 'power off — the shaft is being turned' : known ? turns + ' → absolute position ' + (turns * Pn + r.value) : alarm || '?');
        ro.set('ssi', nb + ' bits in ' + (tf * 1e6).toFixed(0) + ' µs (' + (1 / tf / 1000).toFixed(1) + ' k readings/s)');
        ro.set('cab', kit.eng(trt, 's') + '; clock up to about ' + kit.eng(fmax, 'Hz') + (fitOk ? ' ✓' : ' ✗ too fast: bits arrive late'));

        // drawing
        const C = kit.colors(), c = view(st, 660, 290), cx = 140, cy = 150, wr = 88 / b;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 130, 0, TAU); c.fill();
        c.fillStyle = C.text;
        for (let i = 0; i < b; i++) {
          const r0 = 36 + (b - 1 - i) * wr;
          for (let k = 0; k < Pn; k++) if ((enc(k) >> i) & 1) { sector(c, cx, cy, r0, r0 + wr - 2, -Math.PI / 2 + TAU * (k / Pn - th), -Math.PI / 2 + TAU * ((k + 1) / Pn - th)); c.fill(); }
        }
        c.fillStyle = C.muted; c.beginPath(); c.arc(cx, cy, 16, 0, TAU); c.fill();
        for (let i = 0; i < b; i++) {
          const rm = 36 + (b - 1 - i) * wr + wr / 2 - 1, a = -Math.PI / 2 + TAU * MIS[i] * V.mis / 100 / Pn, on = (r.word >> i) & 1;
          c.save(); c.translate(cx + rm * Math.cos(a), cy + rm * Math.sin(a)); c.rotate(a + Math.PI / 2); rbox(c, -4, -wr / 2 + 2, 8, wr - 4, on ? C.warn : C.bg2, C.accent, 2); c.restore();
        }
        T(c, 'detectors (MSB innermost)', cx, 12, C.muted, 'center', 11);
        if (!powered) { rbox(c, cx - 70, cy - 14, 140, 26, C.bg2, C.bad, 6); T(c, 'POWER OFF', cx, cy + 5, C.bad, 'center', 13, 700); }
        const x0 = 300;
        T(c, 'the detectors read', x0, 30, C.muted, 'left', 12);
        for (let i = 0; i < b; i++) { const bit = (r.word >> (b - 1 - i)) & 1; rbox(c, x0 + 128 + i * 26, 14, 22, 22, bit ? C.warn : C.bg2, C.muted, 3); T(c, String(bit), x0 + 139 + i * 26, 30, C.text, 'center', 13, 700); }
        T(c, (V.code === 'gray' ? 'Gray code → binary → ' : 'binary → ') + r.value, x0, 58, wasWrong ? C.bad : C.text, 'left', 14, 700);
        T(c, 'true position ' + tp + (wasWrong ? '  — a false reading!' : ''), x0, 80, wasWrong ? C.bad : C.muted, 'left', 12);
        T(c, 'turns: ' + (!powered ? '(counting with the power off?)' : known ? turns : '?'), x0, 110, known ? C.text : C.warn, 'left', 13, 600);
        if (alarm && powered) T(c, alarm, x0, 128, C.bad, 'left', 11.5);
        T(c, 'an incremental encoder would restart at 0 after a power cut', x0, 146, C.muted, 'left', 11);
        // the SSI frame: clock from the receiver, data from the encoder
        const slots = nb + 4, x1 = 650, sw = (x1 - x0) / slots, yc = 188, yd = 236;
        const ck = [[x0, yc]];
        for (let k = 0; k <= nb; k++) { const xf = x0 + (1 + k) * sw, xr = x0 + (1.5 + k) * sw; ck.push([xf, yc], [xf, yc + 18], [xr, yc + 18], [xr, yc]); }
        ck.push([x1, yc]);
        line(c, ck, C.accent, 1.8);
        const dd = [[x0, yd], [x0 + sw, yd], [x0 + sw, yd + 18]];
        let lv = 1;
        for (let k = 0; k < nb; k++) {
          const xr = x0 + (1.5 + k) * sw, bit = (frame >> (nb - 1 - k)) & 1;
          dd.push([xr, dd[dd.length - 1][1]], [xr, bit ? yd : yd + 18]); lv = bit;
          T(c, String(bit), xr + sw / 2, yd - 5, k < 4 ? C.series[2] : C.text, 'center', 10.5, 600);
        }
        const xe = x0 + (1.5 + nb) * sw;
        dd.push([xe, lv ? yd : yd + 18], [xe, yd + 18], [xe + 1.5 * sw, yd + 18], [xe + 1.5 * sw, yd], [x1, yd]);
        line(c, dd, fitOk ? C.ok : C.bad, 1.8);
        T(c, 'SSI clock (from the receiver)', x0, yc - 6, C.muted, 'left', 10.5);
        T(c, 'data: 4 turn bits, then ' + b + ' position bits, MSB first; then the monoflop pause', x0, yd + 34, C.muted, 'left', 10.5);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-resolver */
  Hyper.sim('fb-resolver', {
    title: 'A resolver and its tracking converter',
    blurb: `The rotor winding is excited with a sine-wave carrier; the two stator windings, at 90°, pick it up with amplitudes $\\sin\\theta$ and $\\cos\\theta$ of the electrical angle. The scope shows four carrier cycles as they are now; the left graph is the error of a resolver-to-digital converter's tracking loop, the right graph the two envelopes over one electrical cycle with the present angle marked.

**Try this**
- Watch the coils: the sine winding's carrier is strongest when the rotor lines up with it, and flips phase on the other side.
- At a constant speed the tracking error settles near zero — a type-II loop follows a steady speed exactly. Press *Reverse the set-point*: during the acceleration the converter lags, and the error jumps. Raise the loop bandwidth and it shrinks with the square of the bandwidth.
- Add 1 % amplitude imbalance: the error ripples twice per electrical cycle, about ±17 arc-minutes electrical — divided by the speed number on a 2X or 4X resolver.
- Choose 4X and a high speed: the electrical frequency climbs; the read-out warns when the excitation is no longer many times faster.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      const pE = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'tracking error (arc-min, mechanical)' } }, 190);
      const pS = kit.plot(g2, { x: { label: 'electrical angle (°)', min: 0, max: 360 }, y: { label: 'envelope (× k·Vr)', min: -1.25, max: 1.25 }, legend: true }, 190);
      const errs = [];
      let V = null, th = 0, w = 0, phi = 0, wh = 0, t = 0, disp = 0, lastPlot = -1, tw = 0;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Speed set-point', min: -6000, max: 6000, step: 100, value: 1200, unit: 'rpm' },
        { id: 'acc', label: 'Acceleration', min: 1000, max: 200000, value: 20000, unit: 'rpm/s', log: true, sig: 2 },
        { id: 'p', type: 'select', label: 'Resolver speed', options: [['1X: one cycle per turn', 1], ['2X', 2], ['4X: matches an 8-pole motor', 4]], value: 1 },
        { id: 'bw', label: 'Tracking-loop bandwidth', min: 50, max: 2000, value: 300, unit: 'Hz', log: true, sig: 2 },
        { id: 'fex', label: 'Excitation frequency', min: 2, max: 20, step: 0.5, value: 10, unit: 'kHz' },
        { id: 'imb', label: 'Sine/cosine amplitude imbalance', min: 0, max: 5, step: 0.1, value: 0, unit: '%' },
        { id: 'quad', label: 'Windings off 90° by', min: 0, max: 3, step: 0.1, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'rev', label: 'Reverse the set-point', primary: true }] }
      ], id => { if (id === 'rev') ctl.set('n', -V.n); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Shaft speed (RDC reads)'], ['fe', 'Electrical frequency'], ['ex', 'Carrier cycles per electrical cycle'], ['ang', 'Electrical angle / RDC estimate'], ['err', 'Error now / peak in the last second']]);
      const loop = kit.loop(dt => {
        tw += dt;
        const p = +V.p, wn = TAU * V.bw / 2, Ki = wn * wn, Kp = 1.4 * wn, eps = V.imb / 100, del = V.quad * Math.PI / 180;
        const wt = V.n * TAU / 60, a = V.acc * TAU / 60;
        const n = Math.max(1, Math.ceil(dt / Math.min(2e-5, 0.1 / wn))), h = dt / n;
        for (let k = 0; k < n; k++) {
          w += clamp(wt - w, -a * h, a * h);
          th += w * h; t += h;
          const te = p * th, s = (1 + eps) * Math.sin(te), co = Math.cos(te + del);
          const e = s * Math.cos(phi) - co * Math.sin(phi);
          wh += Ki * e * h; phi += (wh + Kp * e) * h;
        }
        if (Math.abs(th) > 1000) { const kk = Math.floor(th / TAU) * TAU; th -= kk; phi -= p * kk; }
        const d = p * th - phi, errE = Math.atan2(Math.sin(d), Math.cos(d)), errM = errE / p * 180 / Math.PI * 60;
        errs.push([t, errM]); while (errs.length > 2 && errs[0][0] < t - 3) errs.shift();
        let peak = 0; for (const q of errs) if (q[0] > t - 1) peak = Math.max(peak, Math.abs(q[1]));
        const teDeg = ((p * th * 180 / Math.PI) % 360 + 360) % 360, phDeg = ((phi * 180 / Math.PI) % 360 + 360) % 360;
        const fe = p * Math.abs(w) / TAU, ratio = fe > 0.01 ? V.fex * 1000 / fe : Infinity;
        ro.set('n', (w * 60 / TAU).toFixed(0) + ' rpm (' + (wh / p * 60 / TAU).toFixed(0) + ' rpm)');
        ro.set('fe', fe.toFixed(0) + ' Hz');
        ro.set('ex', isFinite(ratio) ? ratio.toFixed(0) + (ratio < 10 ? ' — too few: raise the excitation frequency' : '') : '—');
        ro.set('ang', teDeg.toFixed(1) + '° / ' + phDeg.toFixed(1) + '°');
        ro.set('err', errM.toFixed(1) + ' / ' + peak.toFixed(1) + ' arc-min');
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const cs = [], ss = [];
          for (let i = 0; i <= 90; i++) { const x = i * 4, r = x * Math.PI / 180; ss.push([x, (1 + eps) * Math.sin(r)]); cs.push([x, Math.cos(r + del)]); }
          pE.set({ x: { label: 'time (s)', min: Math.max(0, t - 3), max: Math.max(3, t) }, series: [{ pts: errs.slice(), label: 'error' }], hlines: [{ y: 0 }] });
          const ter = teDeg * Math.PI / 180;
          pS.set({ series: [{ pts: ss, label: 'sine winding' }, { pts: cs, label: 'cosine winding' }], vlines: [{ x: teDeg, label: 'now' }], marks: [{ x: teDeg, y: (1 + eps) * Math.sin(ter) }, { x: teDeg, y: Math.cos(ter + del) }] });
        }
        // drawing: the resolver (slowed) and a scope of the real carriers
        disp += w * dt / Math.max(1, Math.abs(V.n) / 20);
        const C = kit.colors(), c = view(st, 660, 270), cx = 135, cy = 138, ted = p * disp;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 118, 0, TAU); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, 80, 0, TAU); c.fill();
        const coil = (ang, amp, lab) => {
          const x = cx + 97 * Math.cos(ang), y = cy + 97 * Math.sin(ang), hue = amp >= 0 ? '215 80% 55%' : '28 90% 55%';
          c.save(); c.translate(x, y); c.rotate(ang + Math.PI / 2); rbox(c, -24, -9, 48, 18, 'hsl(' + hue + ' / ' + (0.15 + 0.8 * Math.abs(amp)).toFixed(2) + ')', C.text, 3); c.restore();
          T(c, lab, cx + 128 * Math.cos(ang), cy + 128 * Math.sin(ang) + 4, C.text, 'center', 11, 600);
        };
        const sAmp = (1 + V.imb / 100) * Math.sin(ted), cAmp = Math.cos(ted + V.quad * Math.PI / 180);
        coil(-Math.PI / 2, sAmp, 'sin'); coil(Math.PI / 2, -sAmp, ''); coil(0, cAmp, 'cos'); coil(Math.PI, -cAmp, '');
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, 68, 0, TAU); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
        const pulse = Math.cos(TAU * 1.2 * tw);
        for (let k = 0; k < p; k++) {
          const ar = disp + k * TAU / p - Math.PI / 2;
          c.save(); c.translate(cx, cy); c.rotate(ar); rbox(c, -8, -62, 16, 26, 'hsl(48 90% 55% / .55)', C.text, 3); c.restore();
          kit.arrow(c, cx, cy, cx + 58 * pulse * Math.cos(ar), cy + 58 * pulse * Math.sin(ar), 'hsl(48 90% 50%)', 3);
        }
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
        T(c, 'rotor excited; drawn at most 20 rpm, carrier slowed', cx, 268, C.muted, 'center', 10.5);
        const f = V.fex * 1000, tdiv = 4 / f / 10, th0 = th, w0 = w;
        const env = (tt, which) => { const te = p * (th0 + w0 * tt); return which ? (1 + V.imb / 100) * Math.sin(te) : Math.cos(te + V.quad * Math.PI / 180); };
        kit.schem.scope(c, 300, 16, 350, 196, { tdiv, traces: [
          { fn: tt => Math.sin(TAU * f * tt), vdiv: 0.5, offset: 2.6, label: 'excitation' },
          { fn: tt => env(tt, 1) * Math.sin(TAU * f * tt - 0.15), vdiv: 0.5, offset: 0, label: 'sine winding' },
          { fn: tt => env(tt, 0) * Math.sin(TAU * f * tt - 0.15), vdiv: 0.5, offset: -2.6, label: 'cosine winding' }] });
        T(c, 'electrical angle ' + teDeg.toFixed(1) + '°, the converter reads ' + phDeg.toFixed(1) + '°', 475, 256, C.text, 'center', 12, 600);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-hall */
  const HALL_STEP = { '101': 1, '100': 2, '110': 3, '010': 4, '011': 5, '001': 6 };
  const HALL_PH = ['A+ B−', 'A+ C−', 'B+ C−', 'B+ A−', 'C+ A−', 'C+ B−'];
  Hyper.sim('fb-hall', {
    title: 'Hall sensors on a brushless rotor',
    blurb: `A brushless rotor with alternating magnet poles (red north, blue south) turns past three Hall latches on the stator. Each latch switches high when the field at it passes +B_op and low when it passes −B_op. Together the three give a code that tells the drive which two phases to energise; the table lights the present step. The graph is the field at each sensor over two electrical cycles, with the switching points.

**Try this**
- Watch the code step through 101, 100, 110, 010, 011, 001 — six states per electrical cycle, never 000 or 111. Change the pole pairs: more states per turn, each a smaller angle.
- Misplace H2 by 10–20° electrical: its edges move, the steps become uneven (see the step widths) and the commutation comes early or late — in a real motor, torque ripple, noise and current.
- Raise the switching points or weaken the magnet (a larger air gap): the latches switch later — all steps shift together — until at last they never switch and the code freezes.
- Choose 60° spacing: the raw codes include 000 and 111; the drive, set to 60°, inverts the middle sensor to get the same six steps.
- Untick the pull-ups: the open-drain outputs float whenever they should be high, and the codes become nonsense — a Hall fault.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'electrical angle (°)', min: 0, max: 720 }, y: { label: 'field at the sensor (mT)' }, legend: true }, 170);
      const R = rng(3), hist = [];
      let V = null, th = 0, t = 0, nextFlo = 0, lastPlot = -1;
      const lat = [0, 0, 0], flo = [1, 1, 1];
      const ctl = kit.controls(box.side, [
        { id: 'rpm', label: 'Speed, slow motion', min: 0, max: 30, step: 0.5, value: 4, unit: 'rpm' },
        { id: 'p', type: 'select', label: 'Pole pairs', options: [['1 (2 poles)', 1], ['2 (4 poles)', 2], ['4 (8 poles)', 4]], value: 2 },
        { id: 'sp', type: 'select', label: 'Sensor spacing (the drive is set to match)', options: [['120° electrical', 120], ['60° electrical', 60]], value: 120 },
        { id: 'mis', label: 'H2 misplaced by (electrical)', min: -30, max: 30, step: 1, value: 0, unit: '°' },
        { id: 'bpk', label: 'Magnet field at the sensors (peak)', min: 2, max: 80, step: 1, value: 40, unit: 'mT' },
        { id: 'bop', label: 'Latch switching points ±', min: 1, max: 30, step: 0.5, value: 5, unit: 'mT' },
        { id: 'pu', type: 'check', label: 'Pull-up resistors fitted', value: true }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Hall frequency (at this slow speed)'], ['n', 'States per turn / angle per state'], ['code', 'Code H1 H2 H3'], ['step', 'Step and phases driven'], ['w', 'Step widths (° electrical)'], ['lag', 'Switching lag']]);
      const offs = () => { const sp = +V.sp, m = V.mis * Math.PI / 180; return sp === 120 ? [0, TAU / 3 + m, 2 * TAU / 3] : [0, Math.PI / 3 + m, 2 * Math.PI / 3]; };
      const psi = k => -Math.PI / 2 + offs()[k] / +V.p;
      const field = (k, x) => -V.bpk * clamp(1.6 * Math.sin(+V.p * (psi(k) - x)), -1, 1);
      const loop = kit.loop(dt => {
        t += dt; th += V.rpm / 60 * TAU * dt;
        if (t >= nextFlo) { for (let k = 0; k < 3; k++) flo[k] = R() < 0.5 ? 1 : 0; nextFlo = t + 0.12 + 0.2 * R(); }
        const B = [0, 1, 2].map(k => field(k, th));
        for (let k = 0; k < 3; k++) { if (B[k] > V.bop) lat[k] = 1; else if (B[k] < -V.bop) lat[k] = 0; }
        const H = lat.map((l, k) => l ? (V.pu ? 1 : flo[k]) : 0);
        const code = +V.sp === 120 ? '' + H[0] + H[1] + H[2] : '' + H[0] + H[2] + (1 - H[1]);
        const raw = '' + H[0] + H[1] + H[2], stp = HALL_STEP[code] || 0;
        hist.push([t, H[0], H[1], H[2], stp]); while (hist.length > 2 && hist[1][0] < t - 4) hist.shift();
        const p = +V.p, x = V.bop / (1.6 * V.bpk), ok = V.bop < V.bpk, dl = ok ? Math.asin(clamp(x, 0, 1)) * 180 / Math.PI : NaN;
        const edges = offs().flatMap(o => [o * 180 / Math.PI + dl, o * 180 / Math.PI + 180 + dl]).map(e => ((e % 360) + 360) % 360).sort((a, b) => a - b);
        const widths = edges.map((e, i) => ((edges[(i + 1) % 6] - e) + 360) % 360);
        ro.set('f', (p * V.rpm / 60).toFixed(2) + ' Hz; at 3000 rpm it would be ' + (p * 50) + ' Hz');
        ro.set('n', (6 * p) + ' / ' + (360 / (6 * p)).toFixed(1) + '°');
        ro.set('code', raw + (+V.sp === 60 ? ' → as 120°: ' + code : ''));
        ro.set('step', stp ? stp + ': ' + HALL_PH[stp - 1] : 'Hall fault: ' + code + ' is not a valid state');
        ro.set('w', ok ? widths.map(v => v.toFixed(0)).join(' · ') : '—');
        ro.set('lag', ok ? dl.toFixed(1) + '° electrical after the field changes sign' : 'the field never reaches the switching points: no signals');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const ser = [0, 1, 2].map(k => { const pts = []; for (let i = 0; i <= 240; i++) { const e = i * 3; pts.push([e, V.bpk * clamp(1.6 * Math.sin(e * Math.PI / 180 - offs()[k]), -1, 1)]); } return { pts, label: 'H' + (k + 1) }; });
          const ted = (((p * (th + Math.PI / 2)) * 180 / Math.PI) % 720 + 720) % 720;
          pl.set({ series: ser, hlines: [{ y: V.bop, label: '+B_op' }, { y: -V.bop, label: '−B_op' }], vlines: [{ x: ted, label: 'now' }] });
        }
        // drawing
        const C = kit.colors(), c = view(st, 660, 280), cx = 140, cy = 145;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 128, 0, TAU); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, 94, 0, TAU); c.fill();
        for (let j = 0; j < 2 * p; j++) {
          const a0 = j * Math.PI / p + th, a1 = (j + 1) * Math.PI / p + th;
          c.fillStyle = j % 2 ? 'hsl(0 70% 52% / .8)' : 'hsl(215 75% 55% / .8)'; sector(c, cx, cy, 44, 86, a0, a1); c.fill();
          const am = (a0 + a1) / 2; T(c, j % 2 ? 'N' : 'S', cx + 66 * Math.cos(am), cy + 66 * Math.sin(am) + 4, '#fff', 'center', 12, 700);
        }
        c.fillStyle = C.muted; c.beginPath(); c.arc(cx, cy, 40, 0, TAU); c.fill();
        for (let k = 0; k < 3; k++) {
          const a = psi(k), x0 = cx + 104 * Math.cos(a), y0 = cy + 104 * Math.sin(a);
          c.save(); c.translate(x0, y0); c.rotate(a + Math.PI / 2); rbox(c, -9, -7, 18, 14, H[k] ? C.warn : C.bg2, C.text, 3); c.restore();
          T(c, 'H' + (k + 1), cx + 120 * Math.cos(a), cy + 120 * Math.sin(a) + 4, C.text, 'center', 11, 700);
        }
        T(c, 'rotor turning clockwise (slow motion)', cx, 278, C.muted, 'center', 10.5);
        const x0 = 300;
        T(c, 'code', x0, 30, C.muted, 'left', 12);
        for (let k = 0; k < 3; k++) { rbox(c, x0 + 44 + k * 30, 12, 26, 26, H[k] ? C.warn : C.bg2, C.muted, 4); T(c, String(H[k]), x0 + 57 + k * 30, 31, C.text, 'center', 14, 700); }
        T(c, stp ? 'step ' + stp + ': drive ' + HALL_PH[stp - 1] : 'HALL FAULT', x0 + 150, 31, stp ? C.text : C.bad, 'left', 14, 700);
        const tw = 350 / 6;
        for (let s = 0; s < 6; s++) {
          const x = x0 + s * tw, on = s + 1 === stp;
          rbox(c, x + 1, 48, tw - 2, 40, on ? 'hsl(150 60% 45% / .35)' : C.bg2, on ? C.ok : C.muted, 4);
          T(c, Object.keys(HALL_STEP)[s], x + tw / 2, 64, C.text, 'center', 12, 700); T(c, HALL_PH[s], x + tw / 2, 81, C.muted, 'center', 11);
        }
        const tx = s => x0 + (s - (t - 4)) / 4 * 350;
        [0, 1, 2].forEach(k => {
          const y = 118 + k * 40; T(c, 'H' + (k + 1), x0 - 4, y + 18, C.text, 'right', 11, 700);
          const pts = []; let prev = null;
          for (const hh of hist) { const x = tx(Math.max(hh[0], t - 4)); if (prev != null) pts.push([x, y + 28 - prev * 22]); pts.push([x, y + 28 - hh[k + 1] * 22]); prev = hh[k + 1]; }
          if (prev != null) pts.push([x0 + 350, y + 28 - prev * 22]);
          line(c, pts, C.series[k], 2);
        });
        T(c, 'the last 4 s of the three signals', x0 + 175, 256, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-tacho */
  const TACHO = { 7: 40, 20: 200, 60: 800 };   // armature resistance (Ω) of the example tachos, by constant (V/krpm)
  Hyper.sim('fb-tacho', {
    title: 'A tachogenerator closing a speed loop',
    blurb: `A DC motor under a PI speed controller, with a DC tachogenerator on its shaft. The drive reads the tacho voltage through a filter and scales it with the tacho's nominal constant; the left graph shows the true speed and the speed the drive believes, the right graph the last 30 ms of tacho voltage before and after the filter. You can also close the loop on speed counted from an encoder instead.

**Try this**
- Look at the raw voltage: the commutator ripple rides on it. A filter smooths it — then set the filter to 15–20 ms and step the set-point: the loop overshoots and rings, because the filter's lag sits inside it.
- Load the tacho with 1 kΩ: the drive sees a lower voltage, believes the motor is slow, and makes it run about 20 % too fast.
- Reverse the set-point: the voltage changes sign.
- Break the tacho wire with the tacho-loss monitor off: the drive sees zero speed and drives the motor flat out — until the overspeed trip. With the monitor on it trips at once.
- Switch the feedback to the encoder at 300 rpm with 100 PPR and a 1 ms window: the measured speed jumps in steps of 150 rpm and the torque chatters. More lines or a longer window smooth it, the window at the cost of lag.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      const pN = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'speed (rpm)' }, legend: true }, 190);
      const pV = kit.plot(g2, { x: { label: 'time (ms)' }, y: { label: 'tacho voltage (V)' }, legend: true }, 190);
      const M = { K: 0.6, R: 1.5, J: 0.005, TL: 1.5, b: 0.002, Vmax: 230, Imax: 20 }, Kp = 0.75, Ki = 22.5, H = 1e-4;
      const hs = [], hv = [];
      let V = null, w = 0, th = 0, t = 0, integ = 0, vf = 0, trip = '', encLast = 0, encT = 0, encW = 0, lowT = 0, lastPlot = -1, Tm = 0, vRaw = 0;
      const ctl = kit.controls(box.side, [
        { id: 'nset', label: 'Speed set-point', min: -3000, max: 3000, step: 50, value: 1500, unit: 'rpm' },
        { id: 'fb', type: 'select', label: 'Speed feedback', options: [['tachogenerator', 'tacho'], ['encoder, counted in a window', 'enc']], value: 'tacho' },
        { id: 'kg', type: 'select', label: 'Tacho constant', options: [['7 V/krpm (40 Ω)', 7], ['20 V/krpm (200 Ω)', 20], ['60 V/krpm (800 Ω)', 60]], value: 20 },
        { id: 'rip', label: 'Commutator ripple (peak-to-peak)', min: 0, max: 10, step: 0.5, value: 3, unit: '%' },
        { id: 'RL', label: 'Drive input resistance', min: 0.5, max: 100, value: 20, unit: 'kΩ', log: true, sig: 2 },
        { id: 'tf', label: 'Filter time constant', min: 0, max: 20, step: 0.5, value: 1, unit: 'ms' },
        { id: 'ppr', type: 'select', label: 'Encoder lines (×4 decoded)', options: [['100 PPR', 100], ['1024 PPR', 1024], ['2500 PPR', 2500]], value: 1024 },
        { id: 'tw', label: 'Encoder counting window', min: 0.5, max: 20, step: 0.5, value: 1, unit: 'ms' },
        { id: 'broken', type: 'check', label: 'Tacho wire broken', value: false },
        { id: 'mon', type: 'check', label: 'Tacho-loss monitor', value: true },
        { type: 'buttons', items: [{ id: 'step', label: 'Step: set-point ÷ 2 and back', primary: true }, { id: 'reset', label: 'Reset the trip' }] }
      ], id => {
        if (id === 'reset') { trip = ''; integ = 0; lowT = 0; }
        if (id === 'step') { const n0 = V.nset; ctl.set('nset', Math.round(n0 / 100) * 50); stepBack = t + 1; stepTo = n0; }
      });
      let stepBack = -1, stepTo = 0;
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'True speed'], ['m', 'Speed the drive believes'], ['v', 'Tacho voltage (after the filter)'], ['T', 'Motor torque'], ['r', 'Encoder speed step'], ['s', 'Status']]);
      const loop = kit.loop(dt => {
        const Kg = +V.kg * 60 / (TAU * 1000), Ra = TACHO[+V.kg], RL = V.RL * 1000, Nc = 4 * +V.ppr, tw = V.tw / 1000, tau = V.tf / 1000;
        if (stepBack > 0 && t >= stepBack) { ctl.set('nset', stepTo); stepBack = -1; }
        const n = Math.max(1, Math.round(dt / H));
        for (let k = 0; k < n; k++) {
          t += H;
          vRaw = V.broken ? 0 : Kg * w * (1 + V.rip / 200 * Math.cos(24 * th)) * RL / (RL + Ra);
          vf = tau > 0 ? vf + (vRaw - vf) * H / tau : vRaw;
          const cnt = Math.floor(th * Nc / TAU);
          if (t - encT >= tw) { encW = (cnt - encLast) * TAU / (Nc * (t - encT)); encLast = cnt; encT = t; }
          const fbw = V.fb === 'tacho' ? vf / Kg : encW, ws = V.nset * TAU / 60;
          const Tlim = Math.max(0, Math.min(M.K * M.Imax, M.K * (M.Vmax - M.K * Math.abs(w)) / M.R));
          let Tc = 0;
          if (!trip) {
            const e = ws - fbw;
            integ = clamp(integ + Ki * e * H, -M.K * M.Imax, M.K * M.Imax);
            Tc = clamp(Kp * e + integ, -Tlim, Tlim);
            if (V.mon && V.fb === 'tacho' && Math.abs(ws) > 10 && Math.abs(Tc) > 0.95 * Tlim && Math.abs(fbw) < 0.05 * Math.abs(ws)) { lowT += H; if (lowT > 0.3) trip = 'tacho loss: tripped, motor coasting'; } else lowT = 0;
            if (Math.abs(w) > 3300 * TAU / 60) trip = 'overspeed trip at 3300 rpm (110 % of top speed)';
          }
          Tm = Tc;
          w += H * (Tc - M.TL * Math.tanh(w / 2) - M.b * w) / M.J;
          th += w * H;
        }
        if (Math.abs(th) > 1e4) th = th % TAU;
        hv.push([t, vRaw, vf]); while (hv.length > 2 && hv[0][0] < t - 0.03) hv.shift();
        const fbw = V.fb === 'tacho' ? vf / Kg : encW;
        if (t - lastPlot > 0.05 || lastPlot < 0) {
          lastPlot = t; hs.push([t, w * 60 / TAU, fbw * 60 / TAU]); while (hs.length > 2 && hs[0][0] < t - 4) hs.shift();
          pN.set({ series: [{ pts: hs.map(q => [q[0], q[1]]), label: 'true speed' }, { pts: hs.map(q => [q[0], q[2]]), label: 'what the drive believes', dash: [5, 3] }], hlines: [{ y: V.nset, label: 'set-point' }] });
          pV.set({ x: { label: 'time (ms)', min: -30, max: 0 }, series: [{ pts: hv.map(q => [(q[0] - t) * 1000, q[1]]), label: 'raw' }, { pts: hv.map(q => [(q[0] - t) * 1000, q[2]]), label: 'filtered' }] });
        }
        const step = 60 / (Nc * tw);
        ro.set('n', (w * 60 / TAU).toFixed(0) + ' rpm');
        ro.set('m', (fbw * 60 / TAU).toFixed(0) + ' rpm');
        ro.set('v', vf.toFixed(2) + ' V (' + (+V.kg) + ' V/krpm, loaded to ' + (100 * RL / (RL + Ra)).toFixed(1) + ' %)');
        ro.set('T', Tm.toFixed(2) + ' N·m');
        ro.set('r', step.toFixed(1) + ' rpm per count' + (V.fb === 'enc' ? '' : ' (not in use)'));
        ro.set('s', trip || 'running');
        // drawing
        const C = kit.colors(), c = view(st, 660, 200);
        rbox(c, 30, 70, 150, 80, C.surface2, C.text, 8); T(c, 'DC motor', 105, 115, C.text, 'center', 13, 600);
        line(c, [[180, 110], [300, 110]], C.text, 6);
        rbox(c, 300, 88, 70, 44, C.surface2, C.text, 6); T(c, 'tacho', 335, 115, C.text, 'center', 12, 600);
        c.save(); c.translate(240, 110); c.rotate(th * 0.02); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -12); c.lineTo(0, 12); c.stroke(); c.restore();
        const wy = [96, 124];
        line(c, [[370, wy[0]], [520, wy[0]]], vf >= 0 ? C.series[0] : C.series[1], 2);
        line(c, [[370, wy[1]], [520, wy[1]]], C.muted, 2);
        if (V.broken) { T(c, '✕', 445, wy[0] + 5, C.bad, 'center', 18, 700); }
        kit.schem.meter(c, 445, 160, 'V', vf.toFixed(1) + ' V');
        rbox(c, 520, 60, 128, 100, C.surface2, trip ? C.bad : C.text, 8);
        T(c, 'speed drive', 584, 80, C.text, 'center', 12, 600);
        T(c, 'set ' + V.nset.toFixed(0) + ' rpm', 584, 100, C.muted, 'center', 11);
        T(c, 'reads ' + (fbw * 60 / TAU).toFixed(0) + ' rpm', 584, 118, C.muted, 'center', 11);
        T(c, 'torque ' + Tm.toFixed(1) + ' N·m', 584, 136, C.muted, 'center', 11);
        if (trip) T(c, trip, 584, 184, C.bad, 'center', 12, 700);
        else if (Math.abs(w * 60 / TAU) > 1.15 * Math.abs(V.nset) + 100) T(c, 'running away!', 584, 184, C.bad, 'center', 13, 700);
        T(c, V.fb === 'tacho' ? 'feedback: tacho' : 'feedback: encoder counts', 105, 60, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-limit */
  Hyper.sim('fb-limit', {
    title: 'Running into a limit switch',
    blurb: `A carriage with a cam runs towards a roller-lever limit switch; 100 mm beyond the switch's operating point is a hard stop. The switch's contact is wired to a 24 V PLC input. After the input changes, the control needs its response time to react, then brakes the axis. The graph shows speed against position for the last run.

**Try this**
- Run at 500 mm/s: the axis stops $v\\,t_r + v^2/2a$ after the switch, well before the hard stop. Double the speed: the braking part quadruples and it crashes.
- Shorten the cam until it leaves the roller before the axis stops: the switch releases and the controller believes the axis is back in range.
- Wired NC, cut the wire: the input goes off exactly as if the switch had tripped, and the axis refuses to start — the fault is safe and visible. Wired NO, cut the wire: nothing looks wrong until the axis sails into the hard stop.
- Weld the NC contact: without positive opening it stays closed when the cam arrives — a crash. With positive opening the cam forces it apart anyway.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'position of the cam\'s leading edge (mm)', min: 100, max: 560 }, y: { label: 'speed (mm/s)', min: 0 }, legend: true }, 170);
      const XOP = 400, XHS = 500, trace = [];
      let V = null, x = 150, v = 0, state = 'idle', tSeen = -1, t = 0, msg = 'press Run towards the limit', released = false, flash = 0;
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Speed', min: 50, max: 1500, step: 10, value: 500, unit: 'mm/s' },
        { id: 'a', label: 'Braking deceleration', min: 1, max: 20, step: 0.5, value: 5, unit: 'm/s²' },
        { id: 'tr', label: 'Response time (input filter, scan, drive)', min: 2, max: 100, step: 1, value: 20, unit: 'ms' },
        { id: 'cam', label: 'Cam length', min: 20, max: 200, step: 5, value: 150, unit: 'mm' },
        { id: 'wire', type: 'select', label: 'Contact wired to the input', options: [['normally closed (NC)', 'NC'], ['normally open (NO)', 'NO']], value: 'NC' },
        { id: 'cut', type: 'check', label: 'Cut the wire', value: false },
        { id: 'weld', type: 'check', label: 'Weld the contact', value: false },
        { id: 'pos', type: 'check', label: 'Positive-opening switch', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Run towards the limit', primary: true }, { id: 'back', label: 'Back to the start' }] }
      ], id => {
        if (id === 'run' && (state === 'idle' || state === 'stopped' || state === 'crash')) {
          x = 150; trace.length = 0; released = false;
          if (limitSeen()) { state = 'idle'; msg = 'refused to start: the limit input already says "limit reached" — find the fault'; }
          else { state = 'run'; v = V.v; msg = 'running'; }
        }
        if (id === 'back') { x = 150; v = 0; state = 'idle'; trace.length = 0; msg = 'press Run towards the limit'; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['s', 'Stopping distance v·t_r + v²/2a'], ['sw', 'Switch'], ['in', 'PLC input'], ['stop', 'Stopped at'], ['st', 'Status']]);
      const actuated = () => x >= XOP && x - V.cam <= XOP;
      const contact = () => {
        const act = actuated();
        if (V.wire === 'NC') return V.weld ? (act && V.pos ? false : true) : !act;
        return V.weld ? true : act;
      };
      const input = () => V.cut ? 0 : (contact() ? 1 : 0);
      function limitSeen() { return V.wire === 'NC' ? input() === 0 : input() === 1; }
      const loop = kit.loop(dt => {
        const n = 20, h = dt / n;
        for (let k = 0; k < n; k++) {
          t += h;
          if (state === 'run' || state === 'react') {
            if (state === 'run' && limitSeen()) { state = 'react'; tSeen = t; }
            if (state === 'react' && t - tSeen >= V.tr / 1000) state = 'brake';
          }
          if (state === 'brake') { v = Math.max(0, v - V.a * 1000 * h); if (x > XOP && !actuated()) released = true; }
          if (state === 'run' || state === 'react' || state === 'brake') {
            x += v * h;
            if (trace.length === 0 || x - trace[trace.length - 1][0] > 1) trace.push([x, v]);
            if (x >= XHS && v > 0) { msg = 'CRASH into the hard stop at ' + v.toFixed(0) + ' mm/s'; state = 'crash'; flash = 1; x = XHS; trace.push([x, v]); v = 0; }
            else if (state === 'brake' && v <= 0) { state = 'stopped'; msg = 'stopped ' + (XHS - x).toFixed(0) + ' mm before the hard stop' + (released ? ' — but the cam has left the roller: the switch reads "in range"!' : ''); }
          }
        }
        flash = Math.max(0, flash - dt);
        const s = V.v * V.tr / 1000 + V.v * V.v / (2 * V.a * 1000);
        ro.set('s', s.toFixed(1) + ' mm (' + (V.v * V.tr / 1000).toFixed(1) + ' + ' + (V.v * V.v / (2 * V.a * 1000)).toFixed(1) + ')');
        ro.set('sw', (actuated() ? 'actuated' : 'free') + '; contact ' + (contact() ? 'closed' : 'open'));
        ro.set('in', (input() ? 'ON (24 V)' : 'OFF') + ' → ' + (limitSeen() ? 'limit reached' : 'in range'));
        ro.set('stop', state === 'stopped' || state === 'crash' ? (x - XOP).toFixed(1) + ' mm past the operating point' : '—');
        ro.set('st', msg);
        if (trace.length) pl.set({ series: [{ pts: trace.slice(), label: 'last run' }], vlines: [{ x: XOP, label: 'switch operates' }, { x: XHS, label: 'hard stop' }, { x: XOP + V.cam, label: 'cam leaves the roller' }] });
        // drawing
        const C = kit.colors(), c = view(st, 660, 250), X = mm => 30 + (mm - 100) * 1.2;
        if (flash > 0) { c.fillStyle = 'hsl(0 80% 50% / ' + (0.3 * flash).toFixed(2) + ')'; c.fillRect(0, 0, 660, 250); }
        line(c, [[X(100), 172], [X(560), 172]], C.muted, 4);
        rbox(c, X(x - 100), 140, 120, 30, C.surface2, C.text, 4);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(X(x - V.cam), 138); c.lineTo(X(x - V.cam) + 8, 128); c.lineTo(X(x) - 8, 128); c.lineTo(X(x), 138); c.closePath(); c.fill();
        T(c, 'cam', X(x - V.cam / 2), 124, C.muted, 'center', 10.5);
        const act = actuated(), ry = act ? 121 : 126, rx = X(XOP) + (act ? 0 : -8);
        rbox(c, X(XOP) - 18, 56, 36, 40, C.surface2, C.text, 4);
        line(c, [[X(XOP), 92], [rx, ry]], C.text, 3);
        c.fillStyle = C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(rx, ry, 6, 0, TAU); c.fill(); c.stroke();
        T(c, 'limit switch', X(XOP), 50, C.muted, 'center', 11);
        c.fillStyle = C.muted; c.fillRect(X(XHS), 118, 16, 54); c.fillStyle = C.warn; c.fillRect(X(XHS) - 6, 128, 6, 34);
        T(c, 'hard stop', X(XHS) + 8, 112, C.muted, 'center', 11);
        line(c, [[X(XOP), 190], [X(XHS), 190]], C.faint, 1, [3, 3]); line(c, [[X(XOP), 184], [X(XOP), 196]], C.faint, 1); line(c, [[X(XHS), 184], [X(XHS), 196]], C.faint, 1);
        T(c, '100 mm', (X(XOP) + X(XHS)) / 2, 205, C.muted, 'center', 11);
        // the wiring: +24 V through the contact to the PLC input
        T(c, '+24 V', 26, 34, C.text, 'left', 12, 600);
        line(c, [[70, 30], [100, 30]], C.text, 2);
        kit.schem.switch(c, 100, 30, 160, 30, { closed: contact(), label: V.wire + (V.weld ? ' (welded)' : '') });
        line(c, V.cut ? [[160, 30], [190, 30]] : [[160, 30], [250, 30]], input() ? C.ok : C.text, 2);
        if (V.cut) { line(c, [[205, 30], [250, 30]], C.text, 2); T(c, '✕', 197, 35, C.bad, 'center', 16, 700); }
        led(c, 262, 30, input(), C.ok, C);
        T(c, 'PLC input ' + (input() ? 'ON' : 'OFF'), 276, 34, C.text, 'left', 12);
        T(c, msg, 330, 238, state === 'crash' ? C.bad : state === 'stopped' && !released ? C.ok : C.text, 'center', 12.5, 600);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-prox */
  const PROX_SIZE = { M8: [1.5, 2.5], M12: [2, 4], M18: [5, 8], M30: [10, 15] };
  const PROX_MAT = [['mild steel', 1, 'hsl(210 8% 55%)'], ['stainless steel', 0.75, 'hsl(210 10% 72%)'], ['brass', 0.45, 'hsl(45 70% 52%)'], ['aluminium', 0.4, 'hsl(210 12% 82%)'], ['copper', 0.3, 'hsl(22 70% 52%)']];
  Hyper.sim('fb-prox', {
    title: 'An inductive proximity sensor and its output',
    blurb: `On the left, a metal target approaches the face of an inductive sensor. Eddy currents in the target draw energy from the sensor's oscillator; when its amplitude falls past a threshold the output switches on, and it switches off again a little farther out (hysteresis). The graph shows the oscillator's amplitude against distance for the chosen metal and for mild steel. On the right, the output is wired to a 24 V PLC input.

**Try this**
- Change the metal: aluminium and brass switch at less than half the steel distance. The read-out also gives the assured distance, $0.81\\,k\\,S_n$ — design to that.
- Compare flush and non-flush mounting of the same size: the non-flush head reaches farther but needs metal-free space around it.
- Switch between PNP and NPN and follow the current: PNP switches +24 V to the input; NPN pulls the input's other side to 0 V.
- Choose two-wire: with the target gone, the leakage current still puts about 7 V on a 4.7 kΩ input — neither ON nor OFF. Fit the 2.2 kΩ bleeder and it drops to about 2 V.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'target distance (mm)', min: 0 }, y: { label: 'oscillator amplitude (relative)', min: 0, max: 1.05 }, legend: true }, 170);
      let V = null, t = 0, on = false, d = 3, ph = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Size', options: Object.keys(PROX_SIZE).map(k => [k, k]), value: 'M18' },
        { id: 'mount', type: 'select', label: 'Mounting', options: [['flush (shielded)', 'flush'], ['non-flush (unshielded)', 'non']], value: 'flush' },
        { id: 'mat', type: 'select', label: 'Target', options: PROX_MAT.map((m, i) => [m[0] + ' (k ≈ ' + m[1] + ')', i]), value: 0 },
        { id: 'sweep', type: 'check', label: 'Move the target in and out', value: true },
        { id: 'd', label: 'Target distance (when not moving)', min: 0, max: 25, step: 0.1, value: 3, unit: 'mm' },
        { id: 'out', type: 'select', label: 'Output', options: [['PNP, 3-wire (sourcing)', 'pnp'], ['NPN, 3-wire (sinking)', 'npn'], ['2-wire', 'two']], value: 'pnp' },
        { id: 'bleed', type: 'check', label: '2.2 kΩ bleeder across the input (2-wire)', value: false }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['sn', 'Nominal distance S_n'], ['sw', 'Switches on / off at'], ['sa', 'Assured distance 0.81·k·S_n'], ['d', 'Target now'], ['o', 'Output'], ['pl', 'PLC input']]);
      const Sn = () => PROX_SIZE[V.size][V.mount === 'flush' ? 0 : 1];
      const amp = (dd, k) => { const s = Sn(), lam = s / Math.log(1 / 0.3), m = Math.pow(0.3, 1 - k); return 1 - m * Math.exp(-dd / lam); };
      const loop = kit.loop(dt => {
        t += dt; ph += dt;
        const s = Sn(), mat = PROX_MAT[+V.mat], k = mat[1], don = k * s, doff = 1.1 * don;
        d = V.sweep ? 1.6 * s * (0.5 - 0.5 * Math.cos(TAU * t / 8)) : V.d;
        if (d <= don) on = true; else if (d > doff) on = false;
        const A = amp(d, k), Rin = 4700, Rp = V.bleed ? 1 / (1 / Rin + 1 / 2200) : Rin;
        let vIn;
        if (V.out === 'two') vIn = on ? 24 - 5 : 1.5e-3 * Rp; else vIn = on ? 22.5 : 0;
        const plc = vIn >= 11 ? 'ON' : vIn <= 5 ? 'OFF' : 'neither: between the OFF and ON levels';
        ro.set('sn', s + ' mm (' + V.size + ', ' + (V.mount === 'flush' ? 'flush' : 'non-flush') + ')');
        ro.set('sw', don.toFixed(2) + ' mm / ' + doff.toFixed(2) + ' mm');
        ro.set('sa', (0.81 * k * s).toFixed(2) + ' mm');
        ro.set('d', d.toFixed(2) + ' mm');
        ro.set('o', on ? 'ON — target detected' : 'OFF');
        ro.set('pl', vIn.toFixed(1) + ' V → ' + plc);
        if (t - lastPlot > 0.5 || lastPlot < 0) {
          lastPlot = t;
          const cur = [], steel = [];
          for (let i = 0; i <= 100; i++) { const dd = 2 * s * i / 100; cur.push([dd, amp(dd, k)]); steel.push([dd, amp(dd, 1)]); }
          pl.set({ x: { label: 'target distance (mm)', min: 0, max: 2 * s }, series: [{ pts: cur, label: mat[0] }, { pts: steel, label: 'mild steel', color: kit.colors().muted, dash: [5, 4] }], hlines: [{ y: 0.7, label: 'switches on below' }, { y: amp(1.1 * don, k), label: 'off above' }], marks: [{ x: d, y: A, label: 'now' }] });
        }
        // drawing: the sensor and target, then the circuit
        const C = kit.colors(), c = view(st, 660, 260), face = 170, yc = 100, sc = 140 / (1.6 * s), hh = 34;
        const flush = V.mount === 'flush';
        c.fillStyle = C.surface2; c.fillRect(20, yc - hh, (flush ? face : face - 12) - 20, 2 * hh);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let x = 26; x < (flush ? face : face - 12); x += 7) { c.beginPath(); c.moveTo(x, yc - hh); c.lineTo(x + 4, yc - hh + 5); c.stroke(); c.beginPath(); c.moveTo(x, yc + hh); c.lineTo(x + 4, yc + hh - 5); c.stroke(); }
        if (!flush) { c.fillStyle = C.bg; rbox(c, face - 12, yc - hh + 4, 12, 2 * hh - 8, 'hsl(215 30% 50% / .5)', C.text, 3); line(c, [[face + 2, yc - hh - 14], [face + 2 + 3 * s * sc, yc - hh - 14]], C.faint, 1, [3, 3]); T(c, 'keep metal-free', face + 40, yc - hh - 18, C.muted, 'left', 10); }
        else { c.fillStyle = 'hsl(210 8% 50% / .5)'; c.fillRect(face - 60, yc - hh - 12, 60, 10); c.fillRect(face - 60, yc + hh + 2, 60, 10); T(c, 'steel bracket', face - 30, yc - hh - 16, C.muted, 'center', 10); }
        rbox(c, face - 4, yc - hh + 2, 4, 2 * hh - 4, C.accent);
        const reach = (flush ? 1 : 1.4) * s * sc;
        for (let i = 1; i <= 3; i++) {
          c.strokeStyle = 'hsl(215 80% 60% / ' + (0.5 * A * (1 - i / 4)).toFixed(2) + ')'; c.lineWidth = 2;
          c.beginPath(); c.ellipse(face, yc, Math.max(1, reach * i / 3), hh * (flush ? 0.8 : 1.2) * i / 3, 0, -Math.PI / 2, Math.PI / 2); c.stroke();
        }
        const tx = face + d * sc;
        c.fillStyle = mat[2]; c.fillRect(tx, yc - 46, 10, 92);
        const D = 1 - A;
        if (D > 0.05) { c.strokeStyle = 'hsl(28 90% 55% / ' + clamp(D * 1.6, 0, 1).toFixed(2) + ')'; c.lineWidth = 1.5; for (let i = 0; i < 2; i++) { c.beginPath(); c.ellipse(tx + 5, yc, 3 + i * 1.5, 10 + i * 10, 0, 0, TAU); c.stroke(); } }
        led(c, 32, yc - hh - 12, on, C.warn, C);
        T(c, V.size + ' ' + (flush ? 'flush' : 'non-flush'), 90, yc + 4, C.text, 'center', 12, 600);
        T(c, d.toFixed(1) + ' mm', tx + 5, yc + 62, C.text, 'center', 11);
        const ox = 20, oy = 196, ow = 220;
        rbox(c, ox, oy - 26, ow, 56, C.bg2, C.faint, 4);
        const opts = [];
        for (let i = 0; i <= 120; i++) { const x = ox + i * ow / 120; opts.push([x, oy + 22 * A * Math.sin(i * 0.6 + ph * 20)]); }
        line(c, opts, C.accent, 1.5);
        line(c, [[ox, oy - 22 * 0.7], [ox + ow, oy - 22 * 0.7]], C.warn, 1, [4, 3]);
        T(c, 'oscillator: amplitude ' + (100 * A).toFixed(0) + ' % (switches below 70 %)', ox + ow / 2, oy + 44, C.muted, 'center', 10.5);
        // the circuit
        const x0 = 350, x1 = 640, yT = 34, yB = 226, S = kit.schem, hot = on || (V.out === 'two');
        line(c, [[x0, yT], [x1, yT]], 'hsl(25 60% 40%)', 2.5); T(c, '+24 V (brown)', x0, yT - 8, C.text, 'left', 11, 600);
        line(c, [[x0, yB], [x1, yB]], 'hsl(215 70% 50%)', 2.5); T(c, '0 V (blue)', x0, yB + 16, C.text, 'left', 11, 600);
        const sx = 400, sy = 130;
        rbox(c, sx - 36, sy - 50, 72, 100, C.surface2, C.text, 6); T(c, 'sensor', sx, sy - 56, C.muted, 'center', 10.5);
        const lx = 560, cur = on ? C.ok : C.faint;
        if (V.out === 'pnp') {
          line(c, [[sx, yT], [sx, sy - 44]], C.text, 2);
          c.save(); c.translate(sx, sy - 10); c.rotate(Math.PI); S.npn(c, 0, 0, { pnp: true, size: 0.7 }); c.restore();
          line(c, [[sx - 5.6, sy - 10 - 21], [sx - 5.6, sy - 44], [sx, sy - 44]], C.text, 2);
          line(c, [[sx - 5.6, sy - 10 + 21], [sx - 5.6, sy + 30], [sx + 36, sy + 30], [lx, sy + 30], [lx, sy + 38]], on ? C.ok : C.text, 2);
          S.resistor(c, lx, sy + 38, lx, yB - 10, { label: 'PLC input', value: '4.7 kΩ' }); line(c, [[lx, yB - 10], [lx, yB]], C.text, 2);
          line(c, [[sx + 20, sy + 50], [sx + 20, yB]], C.text, 2);
          T(c, 'black: output', sx + 90, sy + 24, C.muted, 'center', 10.5);
          if (on) S.flow(c, [[sx, yT], [sx, sy - 44], [sx - 5.6, sy - 44], [sx - 5.6, sy + 30], [lx, sy + 30], [lx, yB]], ph * 30, { color: C.warn });
        } else if (V.out === 'npn') {
          line(c, [[sx + 20, yT], [sx + 20, sy - 50]], C.text, 2);
          S.npn(c, sx - 4, sy + 6, { size: 0.7 });
          line(c, [[sx + 1.6, sy + 6 + 21], [sx + 1.6, yB]], C.text, 2);
          line(c, [[sx + 1.6, sy + 6 - 21], [sx + 1.6, sy - 24], [lx, sy - 24], [lx, sy - 32]], on ? C.ok : C.text, 2);
          S.resistor(c, lx, yT + 10, lx, sy - 32, { label: 'PLC input', value: '4.7 kΩ' }); line(c, [[lx, yT], [lx, yT + 10]], C.text, 2);
          T(c, 'black: output', sx + 90, sy - 30, C.muted, 'center', 10.5);
          if (on) S.flow(c, [[lx, yT], [lx, sy - 24], [sx + 1.6, sy - 24], [sx + 1.6, yB]], ph * 30, { color: C.warn });
        } else {
          S.resistor(c, lx, yT, lx, sy - 20, { label: 'PLC input', value: V.bleed ? '4.7 kΩ ∥ 2.2 kΩ' : '4.7 kΩ' });
          line(c, [[lx, sy - 20], [lx, sy - 40], [sx, sy - 40], [sx, sy - 50]], C.text, 2);
          line(c, [[sx, sy + 50], [sx, yB]], C.text, 2);
          T(c, on ? 'on: drops about 5 V' : 'off: leaks about 1.5 mA', sx, sy + 4, C.muted, 'center', 10.5);
          S.flow(c, [[lx, yT], [lx, sy - 40], [sx, sy - 40], [sx, yB]], ph * (on ? 30 : 4), { color: on ? C.warn : C.muted, gap: on ? 16 : 30 });
        }
        led(c, lx + 40, sy, vIn >= 11, C.ok, C);
        T(c, 'input ' + (vIn >= 11 ? 'ON' : vIn <= 5 ? 'OFF' : '??'), lx + 40, sy + 24, vIn > 5 && vIn < 11 ? C.bad : C.text, 'center', 11, 700);
        T(c, vIn.toFixed(1) + ' V', lx + 40, sy - 14, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-optical */
  // Rmax: the distance at which a clean sensor has an excess gain of 1 (diffuse: on a white target of 90 % reflectance)
  const OPT = {
    through: { name: 'through-beam', Rmax: 30, d: 5 }, retro: { name: 'retro-reflective', Rmax: 8, d: 3 }, pol: { name: 'retro-reflective, polarised', Rmax: 6, d: 3 },
    diffuse: { name: 'diffuse', Rmax: 0.8, d: 0.3 }, bgs: { name: 'diffuse, background suppression', Rmax: 0.8, d: 0.3 }, slot: { name: 'slot (fork) sensor', Rmax: 0, d: 0.02 }
  };
  const OBJ = {
    box: { name: 'matte cardboard box', len: 0.2, col: 'hsl(30 45% 50%)', trans: 0, rho: 0.6 },
    can: { name: 'shiny tin can', len: 0.1, col: 'hsl(210 12% 78%)', trans: 0, rho: 0.15, shiny: true },
    bottle: { name: 'clear bottle', len: 0.08, col: 'hsl(190 60% 70% / .45)', trans: 0.65, rho: 0.08 },
    black: { name: 'black rubber part', len: 0.12, col: 'hsl(0 0% 14%)', trans: 0, rho: 0.04 }
  };
  Hyper.sim('fb-optical', {
    title: 'Photoelectric sensors on a conveyor',
    blurb: `Objects ride a conveyor through the light of a photoelectric sensor (seen from above, distances not to scale). The bar on the right is the *excess gain* — the light received divided by the light needed to switch, on a log scale — and the graph follows it over time. The counters compare objects that passed with objects the output reported.

**Try this**
- Through-beam on a box: huge excess gain when clear, zero when blocked — the most reliable arrangement. Try the clear bottle: 65 % of the light gets through, still far above 1 — it is never seen.
- Retro-reflective on the shiny can: the can returns the light like the reflector and the sensor misses it. Switch to the polarised version: the can now blocks the beam.
- Diffuse on the black part at 0.3 m: too little light comes back. Move it closer. Then put a white wall 0.5 m behind a box: the wall alone switches the sensor. Background suppression ignores it.
- Dirty the lenses: the excess gain falls by the square of what each lens lets through; below 2 the sensor is living dangerously.
- Raise the speed and the response time: short objects pass before the output can react and are missed.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'excess gain', log: true, min: 0.01, max: 1000 } }, 160);
      const hist = [];
      let V = null, t = 0, off = 0, raw = false, filt = false, timer = 0, lastPlot = -1, passed = 0, reported = 0, lastIdx = null, eg = 0, seen = false;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Sensor', options: Object.entries(OPT).map(([k, o]) => [o.name, k]), value: 'through' },
        { id: 'obj', type: 'select', label: 'Objects', options: Object.entries(OBJ).map(([k, o]) => [o.name, k]), value: 'box' },
        { id: 'd', label: 'Distance: between the units, to the reflector or to the objects', min: 0.05, max: 40, value: 5, unit: 'm', log: true, sig: 2 },
        { id: 'dirt', label: 'Dirt on each lens (light lost)', min: 0, max: 90, step: 5, value: 0, unit: '%' },
        { id: 'wall', type: 'check', label: 'White wall behind the conveyor (diffuse)', value: false },
        { id: 'dbg', label: 'Wall distance from the sensor', min: 0.2, max: 5, value: 0.5, unit: 'm', log: true, sig: 2 },
        { id: 'v', label: 'Conveyor speed', min: 0.1, max: 5, step: 0.1, value: 0.8, unit: 'm/s' },
        { id: 'tr', label: 'Sensor response time', min: 0.1, max: 50, value: 1, unit: 'ms', log: true, sig: 2 },
        { id: 'mode', type: 'select', label: 'Output', options: [['on when an object is present', 'obj'], ['light-operate (on when light is received)', 'light'], ['dark-operate (on when the light is interrupted)', 'dark']], value: 'obj' },
        { type: 'buttons', items: [{ id: 'clr', label: 'Clear the counters', primary: true }] }
      ], id => {
        if (id === 'type') ctl.set('d', OPT[V.type].d);
        if (id === 'clr' || id === 'type' || id === 'obj') { passed = 0; reported = 0; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['eg', 'Excess gain now (clear / with object)'], ['lt', 'Light received'], ['out', 'Output'], ['cnt', 'Objects passed / reported'], ['min', 'Shortest object seen at this speed']]);
      const GAP = 0.3, BEAM = 0.005;
      const pitch = () => OBJ[V.obj].len + GAP;
      // excess gain with (k = index of the object in the beam) or without an object (k = null)
      const gain = k => {
        const o = OPT[V.type], ob = OBJ[V.obj], tau = Math.pow(1 - V.dirt / 100, 2), d = Math.max(0.01, V.d);
        if (V.type === 'slot') return 50 * tau * (k == null ? 1 : ob.trans);
        if (V.type === 'through') return Math.pow(o.Rmax / d, 2) * tau * (k == null ? 1 : ob.trans);
        if (V.type === 'retro' || V.type === 'pol') {
          const clear = Math.pow(o.Rmax / d, 2) * tau;
          if (k == null) return clear;
          if (ob.shiny) return V.type === 'retro' ? 2 * clear : 0.002 * clear;
          return ob.trans ? clear * ob.trans * ob.trans : clear * 0.01 * ob.rho;
        }
        const bgOn = V.wall && (V.type === 'diffuse' || V.dbg <= 1.3 * d);
        if (k == null) return bgOn ? Math.pow(o.Rmax / Math.max(0.05, V.dbg), 2) * tau : 0;
        const rho = ob.shiny ? (k % 3 === 0 ? 2.5 : 0.05) : ob.rho;
        return Math.pow(o.Rmax / d, 2) * rho / 0.9 * tau;
      };
      const loop = kit.loop(dt => {
        const n = 20, h = dt / n, beamType = V.type !== 'diffuse' && V.type !== 'bgs';
        for (let j = 0; j < n; j++) {
          t += h; off += V.v * h;
          const P = pitch(), L = OBJ[V.obj].len, k = Math.floor(off / P), lead = off - k * P;
          const inBeam = lead >= BEAM && lead <= L ? k : null;
          if (lastIdx != null && inBeam == null) passed++;
          lastIdx = inBeam;
          eg = gain(inBeam);
          if (eg >= 1) seen = true; else if (eg < 0.9) seen = false;
          const present = beamType ? !seen : seen;
          if (present !== raw) { raw = present; timer = 0; }
          if (filt !== raw) { timer += h; if (timer >= V.tr / 1000) { filt = raw; if (filt) reported++; } }
        }
        const out = V.mode === 'obj' ? filt : V.mode === 'light' ? (beamType ? !filt : filt) : (beamType ? filt : !filt);
        const clear = gain(null), withObj = gain(1);
        hist.push([t, Math.max(0.01, eg)]); while (hist.length > 2 && hist[0][0] < t - 4) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) { lastPlot = t; pl.set({ x: { label: 'time (s)', min: Math.max(0, t - 4), max: Math.max(4, t) }, series: [{ pts: hist.slice(), label: 'excess gain' }], hlines: [{ y: 1, label: 'switching point' }, { y: 2, label: 'clean-air margin' }] }); }
        const fmtEG = g => g < 0.01 ? '< 0.01' : g >= 100 ? g.toFixed(0) : g.toFixed(2);
        ro.set('eg', fmtEG(clear) + ' / ' + fmtEG(withObj));
        ro.set('lt', seen ? 'yes' : 'no');
        ro.set('out', (out ? 'ON' : 'OFF') + ' (' + (filt ? 'object reported' : 'no object reported') + ')');
        ro.set('cnt', passed + ' / ' + reported + (passed > 0 && reported < passed ? ' — objects missed' : reported > passed + 1 ? ' — false detections' : ''));
        ro.set('min', (V.v * V.tr + BEAM * 1000).toFixed(1) + ' mm (objects are ' + (OBJ[V.obj].len * 1000).toFixed(0) + ' mm)');
        // drawing: a top view
        const C = kit.colors(), c = view(st, 660, 270), X0 = 270, sc = 300, ob = OBJ[V.obj];
        c.fillStyle = C.surface2; c.fillRect(20, 110, 500, 80);
        for (let x = ((-off * sc) % 30 + 30) % 30; x < 500; x += 30) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(20 + x, 110); c.lineTo(20 + x, 190); c.stroke(); }
        T(c, 'conveyor →', 60, 204, C.muted, 'center', 11);
        const P = pitch();
        for (let k = Math.floor((off - 1.2) / P); k <= Math.floor((off + 1) / P) + 1; k++) {
          const lead = off - k * P, x1 = X0 + lead * sc, x0 = x1 - ob.len * sc;
          if (x1 < 20 || x0 > 520) continue;
          const a = Math.max(20, x0), b = Math.min(520, x1);
          rbox(c, a, 124, b - a, 52, ob.col, C.text, ob.shiny ? 26 : 4);
        }
        const lit = Math.min(1, Math.log10(Math.max(1, eg * 10)) / 3), beamCol = 'hsl(0 90% 60% / ' + (0.15 + 0.8 * lit).toFixed(2) + ')';
        const t0 = V.type;
        if (t0 === 'through' || t0 === 'retro' || t0 === 'pol' || t0 === 'slot') {
          rbox(c, X0 - 22, 40, 44, 26, C.surface2, C.text, 4); T(c, t0 === 'through' || t0 === 'slot' ? 'emitter' : 'sensor', X0, 34, C.muted, 'center', 11);
          if (t0 === 'through' || t0 === 'slot') { rbox(c, X0 - 22, 234, 44, 26, C.surface2, C.text, 4); T(c, 'receiver', X0, 272 - 2, C.muted, 'center', 11); }
          else { c.fillStyle = 'hsl(0 70% 50% / .7)'; c.fillRect(X0 - 24, 236, 48, 14); T(c, 'reflector', X0, 266, C.muted, 'center', 11); }
          if (t0 === 'slot') { line(c, [[X0 - 30, 66], [X0 - 30, 234]], C.muted, 3); T(c, 'fork', X0 - 40, 150, C.muted, 'right', 11); }
          const blocked = lastIdx != null && !(ob.trans > 0) && !(ob.shiny && t0 === 'retro');
          line(c, [[X0, 66], [X0, blocked ? 124 : 236]], beamCol, 5);
          if (ob.shiny && t0 === 'retro' && lastIdx != null) T(c, '↺ glare returned', X0 + 30, 118, C.bad, 'left', 11, 600);
        } else {
          rbox(c, X0 - 22, 40, 44, 26, C.surface2, C.text, 4); T(c, 'sensor', X0, 34, C.muted, 'center', 11);
          if (V.wall) { c.fillStyle = C.text; c.fillRect(20, 236, 500, 8); T(c, 'white wall at ' + V.dbg.toFixed(2) + ' m' + (t0 === 'bgs' ? (V.dbg <= 1.3 * V.d ? ' (inside the range)' : ' (suppressed)') : ''), 270, 262, C.muted, 'center', 11); }
          line(c, [[X0, 66], [X0, lastIdx != null ? 124 : V.wall ? 236 : 200]], beamCol, 5);
          if (t0 === 'bgs') T(c, 'sees only up to ' + (1.3 * V.d).toFixed(2) + ' m', X0 + 30, 90, C.muted, 'left', 11);
        }
        T(c, 'not to scale', 480, 34, C.faint, 'center', 10);
        // the excess-gain bar
        const bx = 575, by0 = 236, by1 = 36, Y = g => by0 - (Math.log10(clamp(g, 0.01, 1000)) + 2) / 5 * (by0 - by1);
        rbox(c, bx - 12, by1, 24, by0 - by1, C.bg2, C.muted, 3);
        c.fillStyle = eg >= 2 ? C.ok : eg >= 1 ? C.warn : C.bad; c.fillRect(bx - 10, Y(eg), 20, by0 - Y(eg));
        [[0.01, '0.01'], [1, '1'], [2, '2'], [10, '10'], [100, '100'], [1000, '1000']].forEach(([g, s]) => { line(c, [[bx - 16, Y(g)], [bx + 16, Y(g)]], g === 1 ? C.bad : C.faint, g === 1 ? 2 : 1); T(c, s, bx + 20, Y(g) + 4, C.muted, 'left', 10); });
        T(c, 'excess gain', bx, 26, C.muted, 'center', 11);
        led(c, bx, 254, out, C.warn, C); T(c, 'output', bx + 12, 258, C.text, 'left', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-homing */
  Hyper.sim('fb-homing', {
    title: 'Homing an axis',
    blurb: `A linear axis on a ball screw of 5 mm lead: the encoder gives one index pulse per turn, every 5 mm (the ticks under the rail). The home switch operates when the carriage's flag passes its edge; the PLC or drive sees it after a delay that varies by the jitter you set. The left graph is the position during the last homing run; the right graph collects the home position found in every run.

**Try this**
- Home on the switch alone with a fast creep speed, then press *Home 20 times*: the home wanders by speed × jitter. Slow the creep and the spread shrinks in proportion.
- Switch to switch + index: the spread collapses to about a micrometre, because the index is latched in hardware — whatever the creep speed.
- Now move the switch edge to within 0.1 mm of an index pulse and home 20 times: some runs pick the next index, and the home jumps by a whole lead (5000 µm). Put the edge half a lead (2.5 mm) away and the trap disappears.
- Try the hard stop at a fast approach speed: the read-out warns about the impact; the home depends on the stiffness and friction of the stop.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      const pX = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'position (mm)' }, legend: true }, 180);
      const pH = kit.plot(g2, { x: { label: 'homing run', min: 0 }, y: { label: 'home found − ideal (µm)' } }, 180);
      const LEAD = 5, XSW0 = 20, ACC = 500, R = rng(21), runs = [];
      let V = null, run = null, msg = 'press Home once';
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Method', options: [['home switch only', 'sw'], ['home switch + index pulse', 'idx'], ['hard stop (torque limit)', 'hard']], value: 'sw' },
        { id: 'vs', label: 'Search speed', min: 10, max: 200, step: 5, value: 50, unit: 'mm/s' },
        { id: 'vc', label: 'Creep (final approach) speed', min: 0.5, max: 50, value: 10, unit: 'mm/s', log: true, sig: 2 },
        { id: 'jit', label: 'Input delay jitter (filter + scan)', min: 0, max: 10, step: 0.5, value: 4, unit: 'ms' },
        { id: 'off', label: 'Switch edge beyond the index pulse', min: 0.05, max: 4.95, step: 0.05, value: 2.5, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'one', label: 'Home once', primary: true }, { id: 'many', label: 'Home 20 times' }, { id: 'clr', label: 'Clear' }] }
      ], id => {
        if (id === 'one') { run = newRun(); msg = 'homing…'; }
        if (id === 'many') { for (let i = 0; i < 20; i++) { const r = newRun(); let g = 0; while (r.phase !== 'done' && g++ < 400000) stepRun(r, 5e-4); record(r); } plotRuns(); msg = 'did 20 runs'; }
        if (id === 'clr' || id === 'm' || id === 'off') { runs.length = 0; plotRuns(); }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['ph', 'Phase'], ['x', 'Position'], ['last', 'Last home error'], ['sp', 'Spread over the runs'], ['est', 'Speed × jitter at the creep speed'], ['w', 'Note']]);
      const xsw = () => XSW0 + V.off;
      const ideal = () => V.m === 'hard' ? 0 : V.m === 'idx' ? Math.floor(xsw() / LEAD) * LEAD : xsw();
      const lat = () => 0.001 + R() * V.jit / 1000;
      function newRun() { const x0 = V.m === 'hard' ? 15 : 100; return { x: x0, v: 0, t: 0, phase: V.m === 'hard' ? 'approach' : 'search', edge: xsw() + 0.005 * gauss(R), seenAt: -1, home: null, trace: [[0, x0]], contact: -1 }; }
      function stepRun(r, h) {
        const act = r.x <= r.edge;
        r.t += h;
        switch (r.phase) {
          case 'search': r.v = -V.vs; if (act && r.seenAt < 0) r.seenAt = r.t + lat(); if (r.seenAt >= 0 && r.t >= r.seenAt) { r.phase = 'decel'; r.seenAt = -1; } break;
          case 'decel': r.v = Math.min(0, r.v + ACC * h); if (r.v === 0) r.phase = 'backoff'; break;
          case 'backoff': r.v = V.vc; if (!act && r.seenAt < 0) r.seenAt = r.t + lat(); if (r.seenAt >= 0 && r.t >= r.seenAt) { r.phase = 'creep'; r.seenAt = -1; r.v = 0; r.edge = xsw() + 0.005 * gauss(R); } break;
          case 'creep': r.v = -V.vc; if (act && r.seenAt < 0) r.seenAt = r.t + lat(); if (r.seenAt >= 0 && r.t >= r.seenAt) { if (V.m === 'sw') { r.home = r.x; r.phase = 'done'; r.v = 0; } else r.phase = 'index'; } break;
          case 'index': { r.v = -V.vc; const xn = r.x + r.v * h; if (Math.floor(xn / LEAD) < Math.floor(r.x / LEAD)) { r.home = Math.floor(r.x / LEAD) * LEAD + 0.0005 * gauss(R); r.phase = 'done'; r.v = 0; } break; }
          case 'approach': r.v = -V.vc; if (r.x <= 0) { r.x = 0; r.v = 0; r.phase = 'push'; r.contact = r.t; } break;
          case 'push': r.v = 0; if (r.t - r.contact > 0.005) { r.home = -0.010 * (1 + 0.2 * gauss(R)) - V.vc * 0.001 * R(); r.phase = 'done'; } break;
        }
        r.x += r.v * h;
        if (r.trace.length === 0 || r.t - r.trace[r.trace.length - 1][0] > 0.01) r.trace.push([r.t, r.x]);
        if (r.t > 150) r.phase = 'done';
      }
      function record(r) { if (r.home != null) runs.push((r.home - ideal()) * 1000); }
      function plotRuns() { pH.set({ x: { label: 'homing run', min: 0, max: Math.max(20, runs.length + 1) }, series: [{ pts: runs.map((e, i) => [i + 1, e]), line: false, dots: true, label: 'runs' }] }); }
      plotRuns();
      const loop = kit.loop(dt => {
        if (run && run.phase !== 'done') {
          const n = Math.max(1, Math.round(dt / 5e-4));
          for (let i = 0; i < n && run.phase !== 'done'; i++) stepRun(run, 5e-4);
          if (run.phase === 'done') { record(run); plotRuns(); msg = 'home found'; }
          pX.set({ series: [{ pts: run.trace.slice(), label: 'carriage' }], hlines: [{ y: xsw(), label: 'switch edge' }] });
        }
        const last = runs.length ? runs[runs.length - 1] : null, sp = runs.length > 1 ? Math.max(...runs) - Math.min(...runs) : null;
        ro.set('ph', run ? { search: 'fast search', decel: 'decelerating', backoff: 'backing off the switch', creep: 'creeping back to the edge', index: 'waiting for the index pulse', approach: 'creeping towards the stop', push: 'pushing: current rising', done: 'done' }[run.phase] : '—');
        ro.set('x', run ? run.x.toFixed(3) + ' mm' : '—');
        ro.set('last', last == null ? '—' : last.toFixed(1) + ' µm');
        ro.set('sp', sp == null ? '—' : sp.toFixed(1) + ' µm over ' + runs.length + ' runs');
        ro.set('est', (V.vc * V.jit).toFixed(1) + ' µm');
        ro.set('w', V.m === 'hard' && V.vc > 20 ? 'approach too fast: the impact hammers the screw and the stop' : V.m === 'idx' && Math.min(V.off, LEAD - V.off) < 0.3 ? 'the switch edge is close to an index pulse: the home may jump by a lead' : msg);
        // drawing
        const C = kit.colors(), c = view(st, 660, 200), X = mm => 40 + mm * 3.8, x = run ? run.x : 100;
        line(c, [[X(-2), 120], [X(160), 120]], C.muted, 4);
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let s = 0; s < 160; s += 2) { c.beginPath(); c.moveTo(X(s), 116); c.lineTo(X(s + 1), 124); c.stroke(); }
        for (let s = 0; s <= 160; s += LEAD) { line(c, [[X(s), 136], [X(s), 146]], C.series[2], 2); }
        T(c, 'index pulses: one per turn, every 5 mm', X(80), 162, C.muted, 'center', 11);
        c.fillStyle = C.muted; c.fillRect(X(-2) - 12, 84, 12, 44); T(c, 'hard stop', X(-2) - 6, 78, C.muted, 'center', 10.5);
        rbox(c, X(xsw()) - 10, 44, 20, 26, C.surface2, C.text, 3); line(c, [[X(xsw()), 70], [X(xsw()), 84]], C.text, 2);
        T(c, 'home switch', X(xsw()), 38, C.muted, 'center', 10.5);
        const act = run ? run.x <= run.edge : false;
        led(c, X(xsw()) + 22, 57, act, C.warn, C);
        rbox(c, X(x), 90, 60, 26, C.surface2, C.text, 4);
        c.fillStyle = C.accent; c.fillRect(X(x) - 2, 78, 4, 14);
        T(c, 'carriage', X(x) + 30, 108, C.text, 'center', 11);
        T(c, msg, 330, 190, C.text, 'center', 12, 600);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-estop */
  Hyper.sim('fb-estop', {
    title: 'An emergency-stop circuit',
    blurb: `A two-channel emergency-stop button feeds a safety relay. The relay closes two contactors, K1 and K2, in series in the supply to the drive; their mirror contacts form the feedback loop through the reset button. The load is a heavy flywheel or a vertical axis. The graph shows the motion after the last press of the emergency stop; the marker is the moment the power was removed.

**Try this**
- *Reset*, *Start*, then press the emergency stop in category 0: the power goes at once and the flywheel coasts for over half a minute. In category 1 the drive brakes it in about two seconds first, then the power goes.
- Release the button: nothing restarts. Only *Reset* and then *Start* bring it back.
- Category 2 stops the flywheel but leaves the power on: not permitted for an emergency stop.
- Weld K1, start and stop: K2 still cuts the power, but the feedback loop stays open and the relay refuses to reset.
- Short channel 2 to 24 V: pressing the button opens only channel 1; the relay sees the discrepancy and locks out.
- Choose the vertical axis without a brake: in category 0, or at the end of category 1, the load falls as soon as the torque goes. With the brake it holds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'time after the emergency stop (s)', min: 0 }, y: { label: 'speed' }, legend: true }, 170);
      const J = 0.5, TF = 2, TACC = 20, TBRK = 40, WRUN = 1500 * TAU / 60, TDEL = 2.5;
      let V = null, es = false, relay = 'off', lock = false, k1 = false, k2 = false, drive = 'idle', w = 0, y = 0.5, vy = 0, dirY = 1, brakeOn = true, brakeT = 0;
      let t = 0, tPress = -1, tPower = -1, msg = 'press Reset, then Start', dropped = false;
      const trace = [];
      const ctl = kit.controls(box.side, [
        { id: 'cat', type: 'select', label: 'Stop category', options: [['0: remove power at once', 0], ['1: controlled stop, then remove power', 1], ['2: controlled stop, power left on', 2]], value: 0 },
        { id: 'load', type: 'select', label: 'Load', options: [['flywheel, 0.5 kg·m² at 1500 rpm', 'fly'], ['vertical axis, no brake', 'vert'], ['vertical axis with a spring-applied brake', 'vertb']], value: 'fly' },
        { id: 'weld', type: 'check', label: 'K1 main contact welded', value: false },
        { id: 'cross', type: 'check', label: 'Channel 2 shorted to 24 V', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset' }, { id: 'start', label: 'Start' }] },
        { type: 'buttons', items: [{ id: 'press', label: 'EMERGENCY STOP', primary: true }, { id: 'rel', label: 'Release the button' }] }
      ], id => {
        if (id === 'press' && !es) {
          es = true;
          if (relay === 'on') {
            tPress = t; tPower = -1; trace.length = 0; dropped = false;
            if (V.cross) { lock = true; msg = 'channel 1 opened but channel 2 did not: discrepancy — the relay locks out'; }
            if (+V.cat === 0) { removePower(); msg = (lock ? msg + '; ' : '') + 'category 0: power removed at once'; }
            else { drive = 'stopping'; msg = (lock ? msg + '; ' : '') + (+V.cat === 1 ? 'category 1: the drive brakes, then the power is removed' : 'category 2: the drive stops and holds — power stays on (not allowed for emergency stop)'); }
          } else msg = 'emergency stop pressed';
        }
        if (id === 'rel') { es = false; msg = 'button released — nothing restarts; press Reset'; }
        if (id === 'reset') {
          const fb = !k1 && !k2;
          if (es) msg = 'reset refused: the emergency-stop button is still pressed';
          else if (lock && V.cross) msg = 'reset refused: channel fault — remove the short first';
          else if (!fb) msg = 'reset refused: the feedback loop is open — a contactor has not dropped out (welded?)';
          else if (relay === 'on') msg = 'already reset';
          else { lock = false; relay = 'on'; k1 = true; k2 = true; drive = 'idle'; msg = 'reset: power available — press Start'; }
        }
        if (id === 'start') { if (relay === 'on' && k1 && k2 && drive !== 'stopping') { drive = 'run'; brakeOn = false; msg = 'running'; } else msg = 'cannot start: reset the safety relay first'; }
        if (id === 'load') { w = 0; y = 0.5; vy = 0; drive = 'idle'; trace.length = 0; }
      });
      V = ctl.values;
      function removePower() { relay = 'off'; k2 = false; if (!V.weld) k1 = false; drive = 'off'; tPower = t; if (V.load === 'vertb') brakeT = t + 0.03; }
      const ro = kit.readout(box.side, [['r', 'Safety relay'], ['k', 'K1 / K2'], ['fb', 'Feedback loop'], ['m', 'Motion'], ['e', 'Kinetic energy'], ['s', 'Status']]);
      const loop = kit.loop(dt => {
        const n = 40, h = dt / n, vert = V.load !== 'fly', power = k1 && k2 && drive !== 'off';
        for (let i = 0; i < n; i++) {
          t += h;
          if (tPress >= 0 && drive === 'stopping' && +V.cat === 1) {
            const stopped = vert ? Math.abs(vy) < 1e-3 : w < 0.5;
            if ((stopped || t - tPress >= TDEL) && tPower < 0) { if (V.load === 'vertb') brakeOn = true; removePower(); msg = 'category 1: stopped, then the power was removed' + (V.load === 'vert' ? ' — and with no brake the load drops' : ''); }
          }
          if (brakeT > 0 && t >= brakeT) { brakeOn = true; brakeT = 0; }
          const pw = k1 && k2 && drive !== 'off';
          if (!vert) {
            let Tm = 0;
            if (pw && drive === 'run') Tm = w < WRUN ? TACC : 0;
            if (pw && drive === 'stopping') Tm = w > 0 ? -TBRK : 0;
            w = Math.max(0, w + h * (Tm - (w > 0 ? TF : 0)) / J);
            if (drive === 'run' && w > WRUN) w = WRUN;
          } else {
            if (pw && drive === 'run') { vy = 0.25 * dirY; if (y > 0.8) dirY = -1; if (y < 0.2) dirY = 1; }
            else if (pw && (drive === 'stopping' || drive === 'idle')) { vy = Math.abs(vy) < 2 * h ? 0 : vy - Math.sign(vy) * 2 * h; }
            else if (!pw && brakeOn) { vy = Math.abs(vy) < 10 * h ? 0 : vy - Math.sign(vy) * 10 * h; }
            else if (!pw) { vy -= 4.9 * h; }
            y += vy * h;
            if (y <= 0) { if (vy < -0.05) dropped = true; y = 0; vy = 0; }
          }
          if (tPress >= 0 && t - tPress < 60 && (trace.length === 0 || t - tPress - trace[trace.length - 1][0] > 0.02)) trace.push([t - tPress, vert ? vy * 1000 : w * 60 / TAU]);
        }
        if (dropped && vert) msg = 'THE LOAD FELL: no torque and no brake';
        const E = vert ? 0.5 * 50 * vy * vy : 0.5 * J * w * w;
        ro.set('r', relay === 'on' ? 'outputs ON' : lock ? 'LOCKED OUT (channel fault)' : 'outputs off');
        ro.set('k', (k1 ? 'closed' : 'open') + (V.weld && k1 ? ' (welded)' : '') + ' / ' + (k2 ? 'closed' : 'open'));
        ro.set('fb', !k1 && !k2 ? 'closed: reset allowed' : 'open');
        ro.set('m', vert ? 'height ' + (y * 1000).toFixed(0) + ' mm, ' + (vy * 1000).toFixed(0) + ' mm/s' : (w * 60 / TAU).toFixed(0) + ' rpm');
        ro.set('e', E >= 1000 ? (E / 1000).toFixed(1) + ' kJ' : E.toFixed(0) + ' J');
        ro.set('s', msg);
        if (trace.length) pl.set({ y: { label: vert ? 'vertical speed (mm/s)' : 'speed (rpm)' }, series: [{ pts: trace.slice(), label: 'category ' + V.cat }], vlines: tPower >= 0 && tPress >= 0 ? [{ x: tPower - tPress, label: 'power removed' }] : [] });
        // drawing: the circuit, the contactors and the load
        const C = kit.colors(), c = view(st, 660, 280), S = kit.schem;
        T(c, '+24 V', 16, 30, C.text, 'left', 12, 600); line(c, [[16, 38], [110, 38]], C.text, 2);
        c.fillStyle = 'hsl(50 95% 55%)'; c.beginPath(); c.arc(60, 88, 26, 0, TAU); c.fill();
        c.fillStyle = 'hsl(0 80% 48%)'; c.beginPath(); c.arc(60, es ? 92 : 86, 18, 0, TAU); c.fill();
        T(c, es ? 'pressed' : 'E-stop', 60, 128, es ? C.bad : C.muted, 'center', 11, 600);
        const ch1 = !es, ch2 = V.cross ? true : !es;
        line(c, [[110, 38], [110, 150], [120, 150]], C.text, 2); S.switch(c, 120, 150, 160, 150, { closed: ch1 }); line(c, [[160, 150], [190, 150]], ch1 ? C.ok : C.text, 2);
        line(c, [[110, 150], [110, 190], [120, 190]], C.text, 2); S.switch(c, 120, 190, 160, 190, { closed: !es }); line(c, [[160, 190], [190, 190]], ch2 ? C.ok : C.text, 2);
        T(c, 'CH1', 140, 140, C.muted, 'center', 10); T(c, 'CH2', 140, 180, C.muted, 'center', 10);
        if (V.cross) { line(c, [[16, 38], [16, 205], [176, 205], [176, 190]], C.bad, 2, [4, 3]); T(c, 'short', 60, 218, C.bad, 'center', 10.5, 600); }
        rbox(c, 190, 120, 110, 100, C.surface2, lock ? C.bad : relay === 'on' ? C.ok : C.text, 6);
        T(c, 'safety relay', 245, 140, C.text, 'center', 12, 600);
        T(c, relay === 'on' ? 'outputs ON' : lock ? 'LOCKOUT' : 'outputs off', 245, 160, relay === 'on' ? C.ok : lock ? C.bad : C.muted, 'center', 11, 700);
        T(c, 'two channels, cross', 245, 180, C.muted, 'center', 10); T(c, 'monitoring, delayed', 245, 193, C.muted, 'center', 10); T(c, 'outputs for cat. 1', 245, 206, C.muted, 'center', 10);
        rbox(c, 222, 238, 46, 22, C.surface2, C.text, 4); T(c, 'reset', 245, 253, C.text, 'center', 11);
        line(c, [[268, 249], [470, 249], [470, 108]], !k1 && !k2 ? C.ok : C.bad, 1.5, [5, 3]);
        T(c, 'feedback loop: K1 and K2 mirror contacts', 370, 266, C.muted, 'center', 10.5);
        line(c, [[300, 150], [330, 150], [330, 60], [360, 60]], relay === 'on' ? C.ok : C.text, 1.5); line(c, [[330, 108], [360, 108]], relay === 'on' ? C.ok : C.text, 1.5);
        [['K1', 60, k1], ['K2', 108, k2]].forEach(([lab, yy, on]) => { rbox(c, 360, yy - 14, 44, 28, on ? 'hsl(150 60% 45% / .35)' : C.bg2, C.text, 4); T(c, lab, 382, yy + 5, C.text, 'center', 12, 700); line(c, [[404, yy], [436, yy]], C.muted, 1, [2, 2]); });
        line(c, [[450, 14], [450, 50]], C.warn, 4); S.switch(c, 450, 50, 450, 72, { closed: k1 }); line(c, [[450, 72], [450, 98]], C.warn, 4);
        S.switch(c, 450, 98, 450, 120, { closed: k2 }); line(c, [[450, 120], [450, 150]], k1 && k2 ? C.warn : C.muted, 4);
        T(c, '3 × 400 V', 462, 20, C.muted, 'left', 10.5);
        if (V.weld) T(c, 'welded', 470, 64, C.bad, 'left', 10.5, 600);
        rbox(c, 420, 150, 70, 44, C.surface2, C.text, 5); T(c, 'drive', 455, 168, C.text, 'center', 11, 600);
        T(c, !power ? 'no power' : drive === 'stopping' ? 'braking' : drive === 'run' ? 'running' : 'ready', 455, 184, C.muted, 'center', 10);
        line(c, [[490, 172], [520, 172]], C.text, 2);
        c.beginPath(); c.arc(540, 172, 18, 0, TAU); c.fillStyle = C.surface2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke(); T(c, 'M', 540, 177, C.text, 'center', 13, 700);
        if (!vert) {
          c.save(); c.translate(610, 172); c.rotate(t * w / 30); c.fillStyle = C.muted; c.beginPath(); c.arc(0, 0, 38, 0, TAU); c.fill(); c.strokeStyle = C.bg2; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -34); c.stroke(); c.restore();
          T(c, 'flywheel (drawn slowed)', 610, 226, C.muted, 'center', 10);
        } else {
          line(c, [[610, 30], [610, 250]], C.muted, 3);
          rbox(c, 590, 230 - y * 240, 40, 26, dropped ? C.bad : C.surface2, C.text, 4);
          T(c, V.load === 'vertb' ? (brakeOn ? 'brake ON' : 'brake off') : 'no brake', 610, 272, C.muted, 'center', 10);
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fb-brake */
  const BRK = { R: 48, L: 2.9, V1: 24, F1: 800, d1: 0.3, dres: 0.05, Fs: 500, TB: 10, J: 0.01, W: 1500 * TAU / 60 };
  Hyper.sim('fb-brake', {
    title: 'A spring-applied brake',
    blurb: `A cross-section of a spring-applied, electromagnetically released brake on a motor shaft (not to scale; the air gap is exaggerated). Springs push the armature plate against the friction disc; the coil's pull, which falls with the square of the gap, must beat the springs to release it. The right graph is the pull against the gap at the present voltage, with the spring force; the left graph is the speed after the last power cut.

**Try this**
- With the power off, set the voltage to 18 V and press *Power on and run*: at the 0.30 mm gap the brake needs about 19 V, so it stays shut and the motor drags it — watch the temperature climb. Cut the power, set 24 V and run again: it releases.
- Cut the power, raise the gap (lining wear) to 0.40 mm and run at 24 V: the pull-in voltage has risen past the supply, and the brake drags again.
- Released at 24 V, lower the voltage while it runs: once pulled in, the armature holds on down to a few volts — the gap has closed.
- *Run*, then *Cut the power* with DC-side switching, then with AC-side switching: the coil current decays slowly through the rectifier, and the brake bites several times later.
- Choose the hoist lowering: during the delay the load accelerates the motor, the stop takes longer, and the brake absorbs more energy than on the conveyor — compare with ½Jω²·T_B/(T_B + T_L).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      const pW = kit.plot(g1, { x: { label: 'time after the cut (ms)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 180);
      const pF = kit.plot(g2, { x: { label: 'air gap (mm)', min: 0, max: 1 }, y: { label: 'force (N)', min: 0, max: 3000 }, legend: true }, 180);
      const B = BRK, trace = [], prev = [];
      let V = null, i = 0, rel = false, powered = false, running = false, w = 0, eng = 1, tCut = -1, tBite = -1, wBite = 0, tStop = -1, Wb = 0, ang = 0, temp = 40, t = 0, lastPlot = -1, arm = 0, cutMode = '';
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Coil voltage', min: 0, max: 30, step: 0.5, value: 24, unit: 'V' },
        { id: 'gap', label: 'Air gap (grows as the linings wear)', min: 0.15, max: 0.8, step: 0.01, value: 0.3, unit: 'mm' },
        { id: 'sw', type: 'select', label: 'Switching the coil off', options: [['DC side, with a varistor (fast)', 'dc'], ['AC side / freewheel diode (slow)', 'ac']], value: 'dc' },
        { id: 'load', type: 'select', label: 'Load', options: [['conveyor: load torque helps stop (+2 N·m)', 2], ['hoist lowering: load drives (−4 N·m)', -4]], value: 2 },
        { type: 'buttons', items: [{ id: 'run', label: 'Power on and run', primary: true }, { id: 'cut', label: 'Cut the power' }, { id: 'cool', label: 'Cool down' }] }
      ], id => {
        if (id === 'run') { powered = true; running = true; tCut = -1; }
        if (id === 'cut' && powered) { powered = false; running = false; tCut = t; tBite = -1; tStop = -1; Wb = 0; cutMode = V.sw; prev.length = 0; trace.forEach(p => prev.push(p)); trace.length = 0; }
        if (id === 'cool') temp = 40;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['i', 'Coil current'], ['f', 'Pull at the open gap / springs'], ['pi', 'Pull-in voltage at this gap'], ['st', 'Brake'], ['d', 'Delay to bite / stopping time'], ['wb', 'Energy into the linings (formula)'], ['tp', 'Brake temperature']]);
      const pull = (cur, gap) => B.F1 * Math.pow(cur * B.R / B.V1, 2) * Math.pow(B.d1 / gap, 2);
      const loop = kit.loop(dt => {
        const n = Math.max(1, Math.round(dt / 2e-4)), h = dt / n, TL = +V.load;
        for (let k = 0; k < n; k++) {
          t += h;
          const tauOff = (tCut >= 0 ? cutMode : V.sw) === 'dc' ? 0.003 : B.L / B.R;
          i += powered ? h * (V.V - B.R * i) / B.L : -h * i / tauOff;
          if (i < 0) i = 0;
          if (!rel && pull(i, V.gap) > B.Fs) rel = true;
          else if (rel && pull(i, B.dres) < B.Fs) { rel = false; if (tCut >= 0 && tBite < 0) { tBite = t; wBite = w; } }
          arm = clamp(arm + (rel ? 1 : -1) * h / 0.008, 0, 1);
          eng = rel ? 0 : clamp(eng + h / 0.012, 0, 1);
          const Tb = rel ? 0 : B.TB * eng;
          if (running) { w = B.W; if (!rel) { temp += h * (Tb * w - 2 * (temp - 40)) / 400; } }
          else if (w > 0 || (tCut >= 0 && TL < 0)) {
            const acc = (-(TL) - Tb * Math.sign(w || 1)) / B.J;
            const wn = w + acc * h;
            if (w > 0 && wn <= 0 && Tb > Math.abs(TL)) { w = 0; if (tStop < 0) tStop = t; }
            else w = Math.max(0, wn);
            Wb += Tb * w * h; temp += h * Tb * w / 400;
          }
          temp -= h * 2 * (temp - 40) / 400;
          ang += w * h;
          if (tCut >= 0 && t - tCut < 1 && (trace.length === 0 || t - tCut - trace[trace.length - 1][0] / 1000 > 0.002)) trace.push([(t - tCut) * 1000, w * 60 / TAU]);
        }
        const Vpi = B.V1 * Math.sqrt(B.Fs / B.F1) * V.gap / B.d1, drag = running && !rel;
        const wf = tBite > 0 ? wBite : B.W, Wf = 0.5 * B.J * wf * wf * B.TB / (B.TB + TL);
        ro.set('i', (i * 1000).toFixed(0) + ' mA (' + (V.V / B.R * 1000).toFixed(0) + ' mA steady)');
        ro.set('f', pull(V.V / B.R, V.gap).toFixed(0) + ' N / ' + B.Fs + ' N');
        ro.set('pi', Vpi.toFixed(1) + ' V' + (Vpi > V.V ? ' — above the supply: it will not release' : ''));
        ro.set('st', rel ? 'released' : drag ? 'DRAGGING: the motor turns against the closed brake' : 'applied (springs)');
        ro.set('d', tCut < 0 ? '—' : (tBite > 0 ? ((tBite - tCut) * 1000).toFixed(0) + ' ms' : '…') + ' / ' + (tStop > 0 ? ((tStop - tCut) * 1000).toFixed(0) + ' ms' : '…'));
        ro.set('wb', tCut < 0 ? '—' : Wb.toFixed(0) + ' J (½Jω²·T_B/(T_B+T_L) = ' + Wf.toFixed(0) + ' J at ' + (wf * 60 / TAU).toFixed(0) + ' rpm when it bites)');
        ro.set('tp', temp.toFixed(0) + ' °C' + (temp > 150 ? ' — overheating!' : ''));
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const fm = [], fs = [];
          for (let q = 1; q <= 100; q++) { const g = q / 100; fm.push([g, Math.min(3000, pull(V.V / B.R, g))]); fs.push([g, B.Fs]); }
          pF.set({ series: [{ pts: fm, label: 'magnet pull at ' + V.V.toFixed(1) + ' V' }, { pts: fs, label: 'springs', color: kit.colors().muted, dash: [5, 4] }], vlines: [{ x: V.gap, label: 'gap' }] });
          const ser = [{ pts: trace.slice(), label: 'last stop (' + (cutMode === 'dc' ? 'DC side' : 'AC side') + ')' }];
          if (prev.length) ser.push({ pts: prev.slice(), label: 'the stop before', color: kit.colors().muted, dash: [5, 4] });
          pW.set({ series: ser });
        }
        // drawing: the brake in section
        const C = kit.colors(), c = view(st, 660, 270), sc = 30, gapPx = V.gap * sc, XB = 250, armW = 14;
        const armL = XB + (rel || arm > 0.5 ? B.dres * sc + (1 - arm) * (gapPx - B.dres * sc) : gapPx), discW = Math.max(6, 24 - (gapPx - 9)), discL = XB + gapPx + armW, XF = discL + discW;
        line(c, [[20, 135], [640, 135]], C.muted, 14);
        c.fillStyle = 'hsl(210 8% 50% / .8)'; c.fillRect(150, 40, XB - 150, 80); c.fillRect(150, 150, XB - 150, 80);
        const glow = clamp(i / (B.V1 / B.R), 0, 1.3);
        c.fillStyle = 'hsl(24 80% ' + (35 + 25 * glow).toFixed(0) + '% / .95)'; c.fillRect(168, 58, 40, 44); c.fillRect(168, 168, 40, 44);
        T(c, 'coil', 188, 84, '#fff', 'center', 11, 600); T(c, 'coil', 188, 194, '#fff', 'center', 11, 600);
        T(c, 'magnet body', 200, 32, C.muted, 'center', 11);
        [80, 190].forEach(ys => { const pts = []; const x0 = 216, x1 = armL; for (let q = 0; q <= 10; q++) pts.push([x0 + (x1 - x0) * q / 10, ys + (q % 2 ? -7 : 7) * (q && q < 10 ? 1 : 0)]); line(c, pts, C.text, 1.5); });
        T(c, 'springs', 232, 128 - 8, C.muted, 'center', 10);
        c.fillStyle = C.surface2; c.fillRect(armL, 40, armW, 190); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(armL, 40, armW, 190);
        T(c, 'armature', armL + armW / 2, 250, C.muted, 'center', 10.5);
        const dL = rel ? discL + 1 : discL;
        c.fillStyle = 'hsl(28 45% 38%)'; c.fillRect(dL, 55, discW, 160);
        c.strokeStyle = 'hsl(28 50% 60%)'; c.lineWidth = 2;
        for (let q = 0; q < 8; q++) { const yy = 55 + ((q * 20 + ang * 8) % 160 + 160) % 160; c.beginPath(); c.moveTo(dL + 2, yy); c.lineTo(dL + discW - 2, yy); c.stroke(); }
        T(c, 'friction disc', dL + discW / 2, 264, C.muted, 'center', 10.5);
        c.fillStyle = 'hsl(210 8% 50% / .8)'; c.fillRect(XF + (rel ? 2 : 0), 40, 18, 190);
        T(c, 'flange', XF + 11, 32, C.muted, 'center', 10.5);
        if (!rel) { line(c, [[XB, 238], [XB + gapPx, 238]], C.warn, 2); T(c, 'gap ' + V.gap.toFixed(2) + ' mm', XB + gapPx / 2, 226, C.warn, 'center', 10.5, 600); }
        const x0 = 440;
        T(c, rel ? 'RELEASED' : drag ? 'DRAGGING' : 'APPLIED', x0, 56, rel ? C.ok : drag ? C.bad : C.warn, 'left', 16, 700);
        T(c, 'coil ' + V.V.toFixed(1) + ' V, ' + (i * 1000).toFixed(0) + ' mA', x0, 84, C.text, 'left', 12);
        rbox(c, x0, 94, 190, 10, C.bg2, C.faint, 3); c.fillStyle = C.accent; c.fillRect(x0, 94, 190 * clamp(i / 0.6, 0, 1), 10);
        T(c, 'shaft ' + (w * 60 / TAU).toFixed(0) + ' rpm', x0, 132, C.text, 'left', 12);
        T(c, 'brake ' + temp.toFixed(0) + ' °C', x0, 154, temp > 150 ? C.bad : C.text, 'left', 12);
        T(c, +V.load < 0 ? 'hoist lowering: the load drives' : 'conveyor: the load helps stop', x0, 178, C.muted, 'left', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
