/* HYPER-ESP32 · sims/long-range-and-other-radios.js
 *
 * Simulations of the topic "long-range-and-other-radios" (ids lr-*).
 *
 *   lr-chirp      a LoRa chirp in time and frequency, and the receiver's spectrum after the down-chirp, in noise
 *   lr-airtime    air time, bit rate and sensitivity of the six spreading factors; click a row to select it
 *   lr-duty       packets in an hour under a duty-cycle limit, and your own reporting schedule against it
 *   lr-lorawan    a LoRaWAN uplink with its two receive windows; classes A, B and C
 *   lr-mesh       a message flooding through a mesh of LoRa nodes under a hop limit
 *   lr-range      received power against distance at 433, 868 and 2442 MHz, for the same radio
 *   lr-cellular   a cellular modem's current bursts pulling down a weak supply
 *   lr-uwb        two-way ranging: single-sided against double-sided, and the clock error
 *   lr-ir         an NEC infrared frame: the carrier, the receiver's output and the decoded bytes
 *   lr-compare    the reach of six radio links from one link-budget model, in one environment
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* a number with d decimals and a true minus sign */
  const num = (v, d) => (v < 0 && Math.abs(v) >= Math.pow(10, -d) / 2 ? '−' : '') + Math.abs(v).toFixed(d);
  const fmtT = (kit, s) => !(s > 0) ? '0 s' : s >= 1 ? kit.fmt(s, 3) + ' s' : s >= 1e-3 ? kit.fmt(s * 1e3, 3) + ' ms' : kit.fmt(s * 1e6, 3) + ' µs';
  const fmtDist = (kit, m) => m >= 1000 ? kit.fmt(m / 1000, 3) + ' km' : m >= 1 ? kit.fmt(m, 3) + ' m' : kit.fmt(m * 100, 3) + ' cm';
  const SHADE = C => C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  const SHADE2 = C => C.dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.10)';
  const BGLABEL = C => C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.85)';
  // the signal-to-noise ratio each spreading factor needs at the demodulator, from the Semtech data sheets
  const SNR_NEED = { 7: -7.5, 8: -10, 9: -12.5, 10: -15, 11: -17.5, 12: -20 };

  /* a small seeded random generator and a Gaussian from it, so a picture stays put until the reader asks for new noise */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  /* an in-place radix-2 FFT of a complex signal (re, im), length a power of two */
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang), half = len >> 1;
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < half; k++) {
          const a = i + k, b = a + half;
          const vr = re[b] * cr - im[b] * ci, vi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - vr; im[b] = im[a] - vi; re[a] += vr; im[a] += vi;
          const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }

  /* ================================================================ lr-chirp */
  Hyper.sim('lr-chirp', {
    title: 'A LoRa chirp, in time and in frequency',
    blurb: `**Top:** frequency against time. Every packet starts with plain up-chirps, the *preamble*, each sweeping the whole 125 kHz channel from bottom to top. A data symbol is the same sweep **started part-way up**: when it reaches the top it wraps round to the bottom and carries on, so the symbol is *where the sweep starts*.

**Bottom:** what the receiver does. It multiplies the signal by a mirror-image down-chirp, and the symbol turns into one steady tone; an FFT then shows it as a single tall bin out of $2^{SF}$ bins. Noise is added to every sample before that. This is an ideal receiver: real chips need a few decibels more than it does, and the data-sheet limit is shown for comparison.

**Try this**
- Move the **starting point**: the chirp wraps at a different moment, and the tall bin moves with it.
- Lower the **signal-to-noise ratio** to -15 dB: in the time signal there is nothing to see, but the spectrum still has one clear peak.
- Raise the **spreading factor**: more bins, a taller peak against the noise (the processing gain is $10\\log_{10}2^{SF}$ dB), and a chirp twice as long for each step.
- Push the noise far enough that the receiver picks the wrong bin, then press *Draw new noise* to see how marginal the limit is.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 380, maxH: 520 });
      let seed = 1, cache = null;
      const ctl = kit.controls(box.side, [
        { id: 'sf', label: 'Spreading factor', min: 7, max: 12, step: 1, value: 9 },
        { id: 'pos', label: 'Where the data chirp starts', min: 0, max: 99, step: 1, value: 30, unit: '%' },
        { id: 'snr', label: 'Signal-to-noise ratio', min: -30, max: 10, step: 1, value: -10, unit: 'dB' },
        { type: 'buttons', items: [{ id: 'noise', label: 'Draw new noise', primary: true }] }
      ], (id) => { if (id === 'noise') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['sym', 'Symbol sent'], ['tsym', 'Chirp time (125 kHz)'], ['found', 'Receiver finds'], ['peak', 'Peak above the noise'], ['gain', 'Gain from correlating'], ['lim', 'Data-sheet limit']]);
      /* the spectrum of the dechirped signal: a tone at bin m plus noise of the given SNR per sample */
      function spectrum(N, m, snr) {
        const key = N + '|' + m + '|' + snr + '|' + seed;
        if (cache && cache.key === key) return cache;
        const r = rng(seed * 7919 + N), re = new Array(N), im = new Array(N), sd = Math.sqrt(Math.pow(10, -snr / 10) / 2);
        for (let n = 0; n < N; n++) {
          const a = 2 * Math.PI * ((m * n) % N) / N;
          re[n] = Math.cos(a) + sd * gauss(r); im[n] = Math.sin(a) + sd * gauss(r);
        }
        fft(re, im);
        const p = new Array(N);
        let best = 0, sumN = 0;
        for (let k = 0; k < N; k++) { p[k] = re[k] * re[k] + im[k] * im[k]; if (p[k] > p[best]) best = k; if (k !== m) sumN += p[k]; }
        const noise = Math.max(1e-12, sumN / (N - 1));
        cache = { key, p, best, noise, peakDb: 10 * Math.log10(Math.max(1e-12, p[m]) / noise) };
        return cache;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const sf = Math.round(ctl.values.sf), N = 1 << sf, BW = 125e3, tSym = N / BW;
        const m = Math.round(ctl.values.pos / 100 * N) % N, f0 = m / N, snr = ctl.values.snr;
        const L = 60, R = st.W - 14, w = R - L, u = w / 3;
        // ---- frequency against time
        const yt = 34, h1 = Math.round(st.H * 0.3), yb = yt + h1;
        kit.label(c, 'Frequency against time', 10, 14, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = SHADE(C); c.fillRect(L, yt, w, h1);
        kit.label(c, '+62.5 kHz', L - 6, yt + 2, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '−62.5 kHz', L - 6, yb - 2, { size: 10, color: C.muted, align: 'right' });
        c.save();
        c.lineWidth = 2.4; c.lineJoin = 'round';
        c.strokeStyle = C.muted;
        for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(L + k * u, yb); c.lineTo(L + (k + 1) * u, yt); c.stroke(); }
        c.strokeStyle = C.accent;
        const x2 = L + 2 * u, xw = x2 + (1 - f0) * u, ys = yb - f0 * h1;
        c.beginPath(); c.moveTo(x2, ys); c.lineTo(xw, yt); c.stroke();
        if (f0 > 0) { c.beginPath(); c.moveTo(xw, yb); c.lineTo(x2 + u, ys); c.stroke(); c.setLineDash([3, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.3; c.beginPath(); c.moveTo(xw, yt); c.lineTo(xw, yb); c.stroke(); }
        c.restore();
        kit.label(c, 'preamble: plain up-chirps', L + u, yb + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'data symbol ' + m, x2 + u / 2, yb + 12, { size: 10.5, color: C.accent, align: 'center', weight: 600 });
        if (f0 > 0 && u > 90) kit.label(c, 'wraps round', xw > R - 80 ? xw - 4 : xw + 4, yt + 10, { size: 9.5, color: C.warn, align: xw > R - 80 ? 'right' : 'left' });
        // symbol time bracket
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(L, yb + 28); c.lineTo(L + u, yb + 28); c.moveTo(L, yb + 24); c.lineTo(L, yb + 32); c.moveTo(L + u, yb + 24); c.lineTo(L + u, yb + 32); c.stroke();
        kit.label(c, 'one chirp = ' + fmtT(kit, tSym) + ' = 2^' + sf + ' / 125 kHz', L, yb + 42, { size: 10.5, color: C.text2 });
        // ---- the spectrum
        const sp = spectrum(N, m, snr);
        const y0 = yb + 70, hs = st.H - y0 - 34;
        kit.label(c, 'After the down-chirp: spectrum of ' + N + ' bins', 10, y0 - 12, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = SHADE(C); c.fillRect(L, y0, w, hs);
        let maxA = 0;
        for (let k = 0; k < N; k++) maxA = Math.max(maxA, Math.sqrt(sp.p[k]));
        const cols = Math.max(1, Math.floor(w));
        const colMax = new Array(cols).fill(0);
        for (let k = 0; k < N; k++) { const ci = Math.min(cols - 1, Math.floor(k / N * cols)); colMax[ci] = Math.max(colMax[ci], Math.sqrt(sp.p[k])); }
        c.fillStyle = C.faint;
        for (let i = 0; i < cols; i++) { const hh = colMax[i] / maxA * (hs - 6); c.fillRect(L + i, y0 + hs - hh, 1, hh); }
        // the true symbol's bin, and what the receiver picked
        const bx = k => L + (k + 0.5) / N * w, ok = sp.best === m;
        c.fillStyle = C.accent; const ht = Math.sqrt(sp.p[m]) / maxA * (hs - 6); c.fillRect(Math.round(bx(m)) - 1.5, y0 + hs - ht, 3, ht);
        if (!ok) { c.fillStyle = C.bad; const hb = Math.sqrt(sp.p[sp.best]) / maxA * (hs - 6); c.fillRect(Math.round(bx(sp.best)) - 1.5, y0 + hs - hb, 3, hb); }
        const lx = clamp(bx(m), L + 40, R - 60);
        kit.label(c, 'symbol ' + m, lx, y0 + 9, { size: 10, color: C.accent, align: 'center', weight: 600, bg: BGLABEL(C) });
        if (!ok) kit.label(c, 'picked ' + sp.best, clamp(bx(sp.best), L + 40, R - 60), y0 + 26, { size: 10, color: C.bad, align: 'center', weight: 600, bg: BGLABEL(C) });
        kit.label(c, 'bin 0', L, y0 + hs + 12, { size: 10, color: C.faint });
        kit.label(c, 'bin ' + (N - 1), R, y0 + hs + 12, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'noise ' + num(snr, 0) + ' dB per sample', L + w / 2, y0 + hs + 12, { size: 10, color: C.muted, align: 'center' });
        ro.set('sym', m + '  (' + m.toString(2).padStart(sf, '0') + ')');
        ro.set('tsym', fmtT(kit, tSym));
        ro.set('found', ok ? 'bin ' + sp.best + ': correct' : 'bin ' + sp.best + ': wrong');
        ro.set('peak', num(sp.peakDb, 1) + ' dB');
        ro.set('gain', num(10 * Math.log10(N), 1) + ' dB');
        ro.set('lim', num(SNR_NEED[sf], 1) + ' dB at SF' + sf);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-airtime */
  Hyper.sim('lr-airtime', {
    title: 'Air time and sensitivity against spreading factor',
    blurb: `Six spreading factors, one packet. **Left:** the time the packet is on the air. **Right:** how weak a signal the receiver can still decode, so how far the link reaches. Each step up in spreading factor roughly **doubles the air time** and gains **about 2.5 dB**. Click a row (or use the slider) to read its numbers.

The figures come from Semtech's time-on-air formula, with an 8-symbol preamble, header and CRC on, and a receiver noise figure of 6 dB. A payload in LoRaWAN includes 13 bytes of headers.

**Try this**
- Compare **SF7 and SF12** at 20 bytes: about twenty times the air time for about 12.5 dB, a factor four in free-space reach.
- Raise the **bandwidth** to 500 kHz: the air time falls fourfold but sensitivity drops 6 dB, so the reach shrinks.
- Lengthen the **payload** to 200 bytes at SF12: a single packet takes several seconds, which no 1 % duty cycle will let you repeat often.
- Switch the **coding rate** to 4/8: the packet grows by about a third, for more resistance to interference.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 400, maxH: 470 });
      let sel = 9, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'bw', type: 'select', label: 'Bandwidth', options: [['125 kHz', 125e3], ['250 kHz', 250e3], ['500 kHz', 500e3]], value: 125e3 },
        { id: 'cr', type: 'select', label: 'Coding rate', options: [['4/5', 1], ['4/6', 2], ['4/7', 3], ['4/8', 4]], value: 1 },
        { id: 'len', label: 'Payload', min: 1, max: 222, step: 1, value: 20, unit: 'bytes' },
        { id: 'sf', label: 'Read out spreading factor', min: 7, max: 12, step: 1, value: 9 }
      ], (id, v) => { if (id === 'sf') sel = v; loop.once(); });
      const ro = kit.readout(box.side, [['t', 'Air time'], ['sym', 'Symbol time'], ['rate', 'Raw bit rate'], ['sens', 'Sensitivity'], ['reach', 'Free-space reach vs SF7'], ['hour', 'Packets an hour at 1 %'], ['ldro', 'Low-data-rate optimisation']]);
      const rows = () => {
        const v = ctl.values, out = [];
        for (let sf = 7; sf <= 12; sf++) out.push(Object.assign({ sf }, E.lora({ sf, bw: v.bw, cr: v.cr, bytes: Math.round(v.len) })));
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), R = rows();
        const wide = st.W >= 560, gap = 14;
        const pw = wide ? (st.W - 16 - gap) / 2 : st.W - 16, ph = wide ? st.H - 16 : (st.H - 16 - gap) / 2;
        const panels = wide ? [[8, 8], [8 + pw + gap, 8]] : [[8, 8], [8, 8 + ph + gap]];
        const rowH = clamp((ph - 40) / 6, 20, 34);
        const tmax = Math.max(...R.map(r => r.t));
        hits = [];
        const drawPanel = (p, title, valueOf, textOf, hue) => {
          const [px, py] = p;
          kit.label(c, title, px + 2, py + 8, { size: 11.5, weight: 650, color: C.text2 });
          const bx = px + 38, bw = pw - 44;
          R.forEach((r, i) => {
            const y = py + 28 + i * rowH, on = r.sf === sel;
            if (on) { c.fillStyle = SHADE(C); c.fillRect(px, y - 2, pw, rowH - 2); }
            kit.label(c, 'SF' + r.sf, px + 4, y + rowH / 2 - 2, { size: 11.5, weight: on ? 700 : 500, color: on ? C.accent : C.text2 });
            const f = clamp(valueOf(r), 0.01, 1), len = Math.max(2, f * bw * 0.78);
            c.fillStyle = on ? C.accent : kit.hue(hue, 0.75); c.fillRect(bx, y + 3, len, rowH - 10);
            kit.label(c, textOf(r), bx + len + 6, y + rowH / 2 - 2, { size: 11, color: on ? C.text : C.text2, weight: on ? 650 : 500 });
            if (p === panels[0]) hits.push({ y0: y - 2, y1: y + rowH - 2, sf: r.sf });
          });
        };
        drawPanel(panels[0], 'Time on air of one packet', r => r.t / tmax, r => fmtT(kit, r.t), 200);
        const s0 = R[0].sensitivity;
        // sensitivity bars: longer is more sensitive, measured from -105 dBm
        drawPanel(panels[1], 'Sensitivity (longer bar is better)', r => (-105 - r.sensitivity) / 40, r => num(r.sensitivity, 1) + ' dBm', 150);
        if (!wide) {                                   // the rows of the second panel select the same spreading factors
          const py = panels[1][1];
          R.forEach((r, i) => hits.push({ y0: py + 28 + i * rowH - 2, y1: py + 28 + i * rowH + rowH - 2, sf: r.sf, second: true }));
        }
        if (wide) kit.label(c, 'time on air = (preamble + 4.25 + payload symbols) × 2^SF / bandwidth', 10, st.H - 12, { size: 10.5, color: C.muted });
        const r = R[sel - 7];
        ro.set('t', fmtT(kit, r.t));
        ro.set('sym', fmtT(kit, r.tSym));
        ro.set('rate', kit.fmt(r.bitrate, 3) + ' bit/s');
        ro.set('sens', num(r.sensitivity, 1) + ' dBm');
        ro.set('reach', '× ' + kit.fmt(Math.pow(10, (r.sensitivity - s0) / 20), 3) + '  (' + num(r.sensitivity - s0, 1) + ' dB)');
        ro.set('hour', String(E.dutyLimit(r.t, 0.01)));
        ro.set('ldro', r.ldro ? 'on (chirp longer than 16 ms)' : 'off');
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.y >= q.y0 && p.y < q.y1);
        if (h) { sel = h.sf; ctl.set('sf', h.sf, false); loop.once(); }
      }, p => hits.some(q => p.y >= q.y0 && p.y < q.y1));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-duty */
  Hyper.sim('lr-duty', {
    title: 'Messages in an hour under a duty-cycle limit',
    blurb: `A **duty-cycle** limit says a transmitter may be on the air only a fraction of the time. After a packet of air time $t$ at a limit $d$, the radio must stay silent for $t(1/d - 1)$. **Top:** the most packets one hour allows. **Middle:** the first ten minutes, zoomed: dark blocks are packets, pale blocks the compulsory silence, with **your own schedule** on the second row. **Bottom:** how much of the limit you use.

The sub-bands are the usual European ones (check the current rules for your country and equipment); in other regions the limit may be a dwell time or a listen-before-talk rule instead.

**Try this**
- Set SF12 and 1 %: a 20-byte packet forces over two minutes of silence.
- Move to the **10 %** sub-band and see the same radio send ten times as often.
- Slide the **interval** down until the bar turns red: that is where the schedule would break the rule.
- Compare SF7 with SF12 at the same interval: the lower spreading factor uses a twentieth of the budget.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 290, maxH: 310 });
      const ctl = kit.controls(box.side, [
        { id: 'sf', label: 'Spreading factor', min: 7, max: 12, step: 1, value: 9 },
        { id: 'len', label: 'Packet length', min: 1, max: 222, step: 1, value: 20, unit: 'bytes' },
        { id: 'rule', type: 'select', label: 'Band rule', options: [['868.0–868.6 MHz: 1 %', 0.01], ['869.4–869.65 MHz: 10 %', 0.1], ['868.7–869.2 MHz: 0.1 %', 0.001]], value: 0.01 },
        { id: 'int', label: 'Your reporting interval', min: 5, max: 3600, value: 300, unit: 's', log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['t', 'Air time'], ['sil', 'Silent after each packet'], ['max', 'Most packets an hour'], ['min', 'Shortest interval allowed'], ['use', 'Your schedule uses']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const t = E.lora({ sf: Math.round(v.sf), bw: 125e3, cr: 1, bytes: Math.round(v.len) }).t, d = v.rule;
        const period = t / d, maxN = Math.floor(3600 * d / t), my = Math.max(5, v.int), use = t / my / d;
        const L = 12, R = st.W - 12, w = R - L;
        // one hour at the fastest the rule allows
        kit.label(c, 'Fastest allowed: ' + maxN + ' packets in an hour', L, 14, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = SHADE(C); c.fillRect(L, 26, w, 24);
        c.fillStyle = C.accent;
        for (let k = 0; k < maxN && k < 4000; k++) { const x = L + (k * period) / 3600 * w; c.fillRect(x, 26, Math.max(1, t / 3600 * w), 24); }
        // the first ten minutes
        const Z = 600, X = s => L + s / Z * w;
        kit.label(c, 'The first ten minutes, zoomed', L, 70, { size: 11.5, weight: 650, color: C.text2 });
        const rowA = 94, rowB = 128, rh = 22;
        kit.label(c, 'as fast as allowed', L, rowA - 6, { size: 10, color: C.muted });
        kit.label(c, 'your schedule', L, rowB - 6, { size: 10, color: C.muted });
        c.fillStyle = SHADE(C); c.fillRect(L, rowA, w, rh); c.fillRect(L, rowB, w, rh);
        for (let s = 0; s < Z; s += period) {
          c.fillStyle = SHADE2(C); c.fillRect(X(s + t), rowA, Math.max(0, Math.min(X(Math.min(Z, s + period)) - X(s + t), L + w - X(s + t))), rh);
          c.fillStyle = C.accent; c.fillRect(X(s), rowA, Math.max(1.5, X(s + t) - X(s)), rh);
        }
        const okCol = use <= 1 ? C.ok : C.bad;
        for (let s = 0; s < Z; s += my) { c.fillStyle = okCol; c.fillRect(X(s), rowB, Math.max(1.5, X(s + t) - X(s)), rh); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(L, rowB + rh + 6.5); c.lineTo(R, rowB + rh + 6.5); c.stroke();
        for (let mnt = 0; mnt <= 10; mnt += 2) {
          const x = L + mnt / 10 * w; c.beginPath(); c.moveTo(x, rowB + rh + 6); c.lineTo(x, rowB + rh + 11); c.stroke();
          kit.label(c, mnt + ' min', clamp(x, L + 14, R - 14), rowB + rh + 22, { size: 10, color: C.muted, align: 'center' });
        }
        // how much of the limit is used
        const by = 212;
        kit.label(c, 'Your schedule against the limit', L, by - 12, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = SHADE(C); c.fillRect(L, by, w, 16);
        c.fillStyle = use <= 0.8 ? C.ok : use <= 1 ? C.warn : C.bad; c.fillRect(L, by, Math.min(w, use * w * 0.7), 16);
        const lim = L + w * 0.7;
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(lim, by - 3); c.lineTo(lim, by + 19); c.stroke();
        kit.label(c, 'the limit', lim + 4, by + 8, { size: 10, color: C.text2 });
        kit.label(c, (use < 0.01 ? '< 1' : kit.fmt(use * 100, 3)) + ' % of it used' + (use > 1 ? ': too often' : ''), L + 4, by + 8, { size: 10.5, color: use > 0.55 ? C.text : C.text2, weight: 600 });
        ro.set('t', fmtT(kit, t));
        ro.set('sil', fmtT(kit, t * (1 / d - 1)));
        ro.set('max', String(maxN));
        ro.set('min', fmtT(kit, period));
        ro.set('use', (use < 0.01 ? 'under 1' : kit.fmt(use * 100, 3)) + ' % of the limit' + (use > 1 ? ' (too often)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-lorawan */
  Hyper.sim('lr-lorawan', {
    title: 'A LoRaWAN uplink and its two receive windows',
    blurb: `Time runs left to right. The device **sends** an uplink (top row); the gateway hears it (bottom row). A **class A** device then switches its receiver on twice, **one and two seconds after the uplink ends** (middle row), each time only long enough to catch the start of a message. Only then can the network say anything.

The air times are exact for the chosen spreading factor and payload plus 13 bytes of LoRaWAN framing; the length of a window is drawn as about ten symbols, and the second window's rate is fixed (SF9 here). Timing is to scale, and the class B slots are schematic.

**Try this**
- Choose **SF12**: the uplink alone takes well over a second, and everything moves later.
- Let the network answer **in window 2**: the downlink that missed window 1 still arrives, a second later.
- Tick **confirmed uplink** and make the network answer *not at all*: the device waits and sends the uplink again.
- Switch the **class** to C: the receiver is on the whole time, which is why such devices need mains power.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 430 });
      let clock = 0, M = null;
      const ctl = kit.controls(box.side, [
        { id: 'cls', type: 'select', label: 'Device class', options: [['A: two windows after each uplink', 'A'], ['B: plus scheduled ping slots', 'B'], ['C: listening almost always', 'C']], value: 'A' },
        { id: 'sf', label: 'Spreading factor', min: 7, max: 12, step: 1, value: 9 },
        { id: 'len', label: 'Application payload', min: 1, max: 50, step: 1, value: 10, unit: 'bytes' },
        { id: 'conf', type: 'check', label: 'Confirmed uplink (the network must acknowledge)', value: false },
        { id: 'ans', type: 'select', label: 'The network answers', options: [['Not at all', 'none'], ['In receive window 1', 'rx1'], ['In receive window 2', 'rx2']], value: 'rx1' }
      ], () => { clock = 0; M = null; loop.start(); });
      const ro = kit.readout(box.side, [['tu', 'Uplink air time'], ['rx', 'Windows open at'], ['on', 'Receiver on, in this view'], ['first', 'Earliest downlink'], ['out', 'Outcome']]);
      /* everything that happens, as intervals on three rows */
      function model() {
        const v = ctl.values, sf = Math.round(v.sf), tSym = Math.pow(2, sf) / 125e3, cls = v.cls, ans = v.ans;
        const tu = E.lora({ sf, bw: 125e3, cr: 1, bytes: Math.round(v.len) + 13 }).t;
        const dl1 = E.lora({ sf, bw: 125e3, cr: 1, bytes: 13 }).t, dl2 = E.lora({ sf: 9, bw: 125e3, cr: 1, bytes: 13 }).t;
        const win = Math.max(0.012, 10 * tSym), rx1 = tu + 1, rx2 = tu + 2;
        const tx = [], rx = [], gw = [], phases = [];
        const dlLabel = v.conf ? 'acknowledgement' : 'downlink';
        tx.push({ t0: 0, t1: tu, label: 'uplink' });
        gw.push({ t0: 0, t1: tu, label: 'hears it', hear: true });
        phases.push({ t0: 0, t1: tu, text: 'The device sends its uplink and the gateway hears it' });
        let end = tu, got = false, rx2End = rx2;
        const w1 = ans === 'rx1' ? Math.max(win, dl1) : win;
        if (cls === 'C') {
          rx.push({ t0: tu, t1: tu, open: true, label: 'listening all the time' });   // widened to the end of the view below
          if (ans === 'rx2') { gw.push({ t0: tu + 0.3, t1: tu + 0.3 + dl2, label: dlLabel + ' at once' }); got = true; end = tu + 0.3 + dl2; phases.push({ t0: tu, t1: tu + 0.3, text: 'Class C is already listening' }); }
        }
        rx.push({ t0: rx1, t1: rx1 + w1, label: 'RX1' });
        phases.push({ t0: tu, t1: rx1, text: cls === 'C' ? 'Class C keeps listening during the delay' : 'The receiver is off for one second' });
        if (ans === 'rx1') {
          gw.push({ t0: rx1, t1: rx1 + dl1, label: dlLabel });
          got = true; end = rx1 + w1;
          phases.push({ t0: rx1, t1: rx1 + w1, text: 'Window 1 is open and the ' + dlLabel + ' arrives' });
        } else {
          phases.push({ t0: rx1, t1: rx1 + win, text: 'Window 1 is open for a few symbols: nothing heard' });
          rx.push({ t0: rx2, t1: rx2 + (ans === 'rx2' ? Math.max(win, dl2) : win), label: 'RX2' });
          rx2End = rx2 + (ans === 'rx2' ? Math.max(win, dl2) : win);
          phases.push({ t0: rx1 + win, t1: rx2, text: 'The receiver is off again for a second' });
          if (ans === 'rx2') {
            if (cls !== 'C') { gw.push({ t0: rx2, t1: rx2 + dl2, label: dlLabel }); phases.push({ t0: rx2, t1: rx2End, text: 'Window 2 is open and the ' + dlLabel + ' arrives' }); }
            got = true; end = Math.max(end, rx2End);
          }
          else { phases.push({ t0: rx2, t1: rx2 + win, text: 'Window 2 is open: nothing heard' }); end = rx2End; }
        }
        let outcome = got ? 'The ' + dlLabel + ' arrives' : 'No downlink: the device sleeps until it next sends';
        if (v.conf && !got) {                                   // no acknowledgement: send again after a pause
          const tr = rx2End + 2;
          tx.push({ t0: tr, t1: tr + tu, label: 'repeat' });
          gw.push({ t0: tr, t1: tr + tu, label: 'hears it', hear: true });
          rx.push({ t0: tr + tu + 1, t1: tr + tu + 1 + Math.max(win, dl1), label: 'RX1' });
          gw.push({ t0: tr + tu + 1, t1: tr + tu + 1 + dl1, label: 'acknowledgement' });
          phases.push({ t0: rx2End, t1: tr, text: 'No acknowledgement: the device waits about two seconds' });
          phases.push({ t0: tr, t1: tr + tu, text: 'The device repeats the uplink' });
          phases.push({ t0: tr + tu, t1: tr + tu + 1 + Math.max(win, dl1), text: 'Window 1 of the repeat: the acknowledgement arrives' });
          end = tr + tu + 1 + Math.max(win, dl1);
          outcome = 'Repeated after ' + fmtT(kit, tr - tu) + ': then acknowledged';
        }
        const view = Math.max(3.4, end + 0.35);
        if (cls === 'C') { const k = rx.find(r => r.open); k.t1 = view; }
        const slots = [];
        if (cls === 'B') for (let t = 0.3; t < view; t += 1.5) if (t > tu && !rx.some(r => t < r.t1 + 0.05 && t + 0.04 > r.t0)) slots.push({ t0: t, t1: t + 0.04, label: 'ping' });
        const on = cls === 'C' ? view - tu : rx.reduce((a, r) => a + Math.min(view, r.t1) - r.t0, 0) + slots.length * 0.04;
        return { tu, win, rx1, rx2, tx, rx: rx.concat(slots), gw, phases, view, on, outcome, cls, got };
      }
      const loop = kit.loop((dt) => {
        if (!M) M = model();
        const c = st.begin(), C = kit.colors();
        const speed = M.view / 6, cycle = M.view + 0.7;
        clock += dt * speed;
        if (clock > cycle) clock = 0;
        const L = 96, R = st.W - 12, w = R - L, X = t => L + clamp(t / M.view, 0, 1) * w;
        const rowY = [Math.round(st.H * 0.2), Math.round(st.H * 0.46), Math.round(st.H * 0.72)], bh = 26;
        const names = ['device sends', 'device listens', 'gateway'];
        rowY.forEach((y, i) => {
          c.fillStyle = SHADE(C); c.fillRect(L, y, w, bh);
          kit.label(c, names[i], L - 8, y + bh / 2, { size: 11, color: C.text2, align: 'right', weight: 600 });
        });
        const block = (row, r, fill, stroke, labelAbove) => {
          const x0 = X(r.t0), ww = Math.max(3, X(r.t1) - x0), y = rowY[row];
          c.fillStyle = fill; c.fillRect(x0, y, ww, bh);
          c.strokeStyle = stroke; c.lineWidth = 1.6; c.strokeRect(x0 + 0.5, y + 0.5, ww - 1, bh - 1);
          if (r.label) {
            const fits = ww > r.label.length * 6.2 + 8;
            if (fits && !labelAbove) kit.label(c, r.label, x0 + ww / 2, y + bh / 2, { size: 10.5, align: 'center', color: C.text, weight: 600 });
            else kit.label(c, r.label, clamp(x0 + ww / 2, L + 22, R - 22), y - 8, { size: 10, align: 'center', color: C.text2, weight: 600 });
          }
        };
        M.tx.forEach(r => block(0, r, kit.hue(8, 0.35), kit.hue(8)));
        M.rx.forEach(r => { if (r.open) block(1, r, kit.hue(150, 0.18), kit.hue(150), false); else block(1, r, kit.hue(150, 0.4), kit.hue(150), true); });
        M.gw.forEach(r => block(2, r, r.hear ? kit.hue(8, 0.2) : kit.hue(212, 0.4), r.hear ? kit.hue(8, 0.7) : kit.hue(212), r.hear));
        // the time axis
        const ya = rowY[2] + bh + 10;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(L, ya + 0.5); c.lineTo(R, ya + 0.5); c.stroke();
        const stepT = M.view > 7 ? 2 : 1;
        for (let t = 0; t <= M.view + 1e-9; t += stepT) { c.beginPath(); c.moveTo(X(t), ya); c.lineTo(X(t), ya + 5); c.stroke(); kit.label(c, t + ' s', X(t), ya + 15, { size: 10, color: C.muted, align: 'center' }); }
        // a dashed guide at the end of the uplink, and the playhead
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1;
        [M.tu, M.rx1].forEach(t => { c.beginPath(); c.moveTo(X(t), rowY[0] + bh); c.lineTo(X(t), rowY[1]); c.stroke(); });
        c.restore();
        const ph = Math.min(clock, M.view);
        c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); c.moveTo(X(ph), rowY[0] - 14); c.lineTo(X(ph), ya); c.stroke();
        if (M.cls === 'B') kit.label(c, 'ping slots are agreed with the gateway through a beacon every 128 s', L, rowY[1] + bh + 12, { size: 9.5, color: C.muted });
        const cur = M.phases.find(p => ph >= p.t0 && ph < p.t1);
        kit.label(c, cur ? cur.text : (ph >= M.view ? M.outcome : 'The device sleeps'), 10, st.H - 14, { size: 11.5, color: C.text, weight: 600 });
        ro.set('tu', fmtT(kit, M.tu));
        ro.set('rx', M.cls === 'C' ? 'any time (class C), and 1 s and 2 s' : '1 s and 2 s after the uplink');
        ro.set('on', kit.fmt(M.on / M.view * 100, 2) + ' % of the time');
        ro.set('first', M.cls === 'A' ? 'about 1 s after the uplink' : M.cls === 'B' ? 'the next ping slot, or window 1' : 'at once, after the uplink');
        ro.set('out', M.outcome);
      }, box.stage);
      st.onResize(() => { loop.once(); });
      loop.start();
    }
  });

  /* ================================================================ lr-mesh */
  const PRESETS = [
    { id: 'short', name: 'Short Fast', sf: 7, bw: 250e3, cr: 1 },
    { id: 'medium', name: 'Medium Fast', sf: 9, bw: 250e3, cr: 1 },
    { id: 'long', name: 'Long Fast', sf: 11, bw: 250e3, cr: 1 },
    { id: 'slow', name: 'Long Slow', sf: 12, bw: 125e3, cr: 4 }
  ];
  Hyper.sim('lr-mesh', {
    title: 'A message flooding through a mesh',
    blurb: `Each dot is a node. The **source** (click any dot to change it) sends one message. A node that hears it for the first time **repeats it once**, while the **hop limit** lasts; a node that has already heard someone else repeat it may keep quiet. Rings show each transmission, lines who heard whom, and the picture is held when the flood ends: green nodes got the message, red ones did not.

Each preset also changes the **reach** (a slower preset is more sensitive; here with a path-loss exponent of 3) and the **air time** of every transmission. The layout and the way transmissions are ordered are simplified: this shows the idea of flooding, not Meshtastic's exact timing.

**Try this**
- Set the hop limit to **0**, then 1, 2, 3: watch the message creep outwards and the transmissions pile up.
- Turn off **cancel when someone else repeated** and count the transmissions: all that extra noise reaches no extra node.
- Switch the preset from Short Fast to **Long Fast**: more reach, but each transmission occupies the channel many times longer.
- Press **New layout** until a node is stranded out of range: no hop limit can reach it.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360, maxH: 500 });
      let seedN = 3, pos = [], src = 0, anim = 0, F = null, nodesPx = [];
      const makeLayout = () => {
        const r = rng(seedN * 104729), out = [];
        for (let i = 0; i < 40; i++) {
          let best = null, bestD = -1;
          for (let k = 0; k < 40; k++) {                     // the candidate farthest from the others, for an even spread
            const q = { x: 0.06 + 0.88 * r(), y: 0.1 + 0.8 * r() };
            const d = out.reduce((a, o) => Math.min(a, Math.hypot(o.x - q.x, (o.y - q.y) * 0.7)), 9);
            if (d > bestD) { bestD = d; best = q; }
          }
          out.push(best);
        }
        pos = out;
      };
      makeLayout();
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Modem preset', options: PRESETS.map(p => [p.name, p.id]), value: 'long' },
        { id: 'n', label: 'Nodes', min: 8, max: 40, step: 1, value: 24 },
        { id: 'reach', label: 'Reach with Short Fast', min: 8, max: 35, step: 1, value: 16, unit: '% of the width' },
        { id: 'hops', label: 'Hop limit', min: 0, max: 7, step: 1, value: 3 },
        { id: 'cancel', type: 'check', label: 'Cancel when someone else repeated', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'Send again', primary: true }, { id: 'layout', label: 'New layout' }] }
      ], (id) => { if (id === 'layout') { seedN++; makeLayout(); src = 0; } restart(); });
      const ro = kit.readout(box.side, [['heard', 'Heard it'], ['tx', 'Transmissions'], ['air', 'Air time used (shared channel)'], ['far', 'Farthest node'], ['reach', 'Reach against Short Fast']]);
      const preset = () => PRESETS.find(p => p.id === ctl.values.preset);
      /* the flood: rounds of transmissions, with the first round the source's */
      function flood() {
        const v = ctl.values, n = Math.round(v.n), H = Math.round(v.hops), p = preset();
        const sens = x => E.lora({ sf: x.sf, bw: x.bw, cr: x.cr }).sensitivity;
        const mult = Math.pow(10, (sens(p) - sens(PRESETS[0])) / 30);
        const rad = Math.min(1.2, v.reach / 100 * mult) * st.W;
        const P = pos.slice(0, n).map(q => ({ x: q.x * st.W, y: q.y * st.H }));
        const s = Math.min(src, n - 1), d = (i, j) => Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
        const heardAt = new Array(n).fill(-1), heardFrom = new Array(n).fill(-1), tx = [{ node: s, round: 0 }];
        heardAt[s] = 0;
        const hear = (i, round) => { for (let j = 0; j < n; j++) if (j !== i && heardAt[j] < 0 && d(i, j) <= rad) { heardAt[j] = round; heardFrom[j] = i; } };
        hear(s, 0);
        for (let round = 1; round <= H; round++) {
          const cands = [];
          for (let j = 0; j < n; j++) if (heardAt[j] === round - 1 && j !== s) cands.push(j);
          cands.sort((a, b) => d(b, heardFrom[b]) - d(a, heardFrom[a]));     // the farthest listeners answer first
          const done = [];
          for (const j of cands) {
            if (v.cancel && done.some(k => d(j, k) <= rad)) continue;      // someone close by has already repeated it
            done.push(j); tx.push({ node: j, round }); hear(j, round);
          }
        }
        const air = E.lora({ sf: p.sf, bw: p.bw, cr: p.cr, bytes: 36, preamble: 16 }).t;
        F = { P, rad, heardAt, heardFrom, tx, n, s, air, mult, rounds: tx.reduce((a, t) => Math.max(a, t.round), 0), p };
        nodesPx = P;
      }
      function restart() { anim = 0; flood(); loop.start(); }
      const STEP = 0.9;
      const loop = kit.loop((dt) => {
        if (!F) flood();
        const c = st.begin(), C = kit.colors();
        anim += dt;
        const cur = anim / STEP, done = cur >= F.rounds + 1.2;
        const upto = done ? 99 : Math.floor(cur);
        // lines from each repeater to those that first heard it, and rings for the transmissions
        for (let j = 0; j < F.n; j++) {
          const hr = F.heardAt[j];
          if (hr < 0 || hr > upto || F.heardFrom[j] < 0) continue;
          const a = F.P[F.heardFrom[j]], b = F.P[j];
          c.strokeStyle = kit.hue(150, 0.55); c.lineWidth = 1.4; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
        }
        for (const t of F.tx) {
          if (t.round > upto) continue;
          const q = F.P[t.node], live = !done && t.round === upto, f = live ? clamp(cur - t.round, 0, 1) : 1;
          c.strokeStyle = live ? C.accent : kit.hue(212, 0.5); c.lineWidth = live ? 2 : 1.2;
          c.setLineDash(live ? [] : [3, 4]);
          c.beginPath(); c.arc(q.x, q.y, Math.max(1, F.rad * (live ? f : 1)), 0, Math.PI * 2); c.stroke();
          c.setLineDash([]);
        }
        // the nodes
        const txSet = new Set(F.tx.filter(t => t.round <= upto).map(t => t.node));
        for (let j = 0; j < F.n; j++) {
          const q = F.P[j], heard = F.heardAt[j] >= 0 && F.heardAt[j] <= upto, isSrc = j === F.s;
          if (isSrc) { kit.dot(c, q.x, q.y, 9, C.accent, C.text); kit.label(c, 'source', q.x, q.y - 16, { size: 10.5, align: 'center', color: C.accent, weight: 650, bg: BGLABEL(C) }); continue; }
          if (heard) { kit.dot(c, q.x, q.y, 6.5, kit.hue(150), txSet.has(j) ? C.accent : null); if (txSet.has(j)) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(q.x, q.y, 9.5, 0, Math.PI * 2); c.stroke(); } }
          else kit.dot(c, q.x, q.y, 5.5, done ? C.bad : C.faint);
        }
        kit.label(c, done ? 'Flood finished' : 'Round ' + Math.min(F.rounds, upto) + (upto === 0 ? ': the source sends' : ''), 10, 14, { size: 11.5, weight: 650, color: C.text2 });
        const reached = F.heardAt.filter(h => h >= 0).length, far = F.heardAt.reduce((a, h) => Math.max(a, h), 0);
        ro.set('heard', reached + ' of ' + F.n + ' nodes');
        ro.set('tx', F.tx.length + (F.tx.length === 1 ? ' (the source only)' : ' (1 source + ' + (F.tx.length - 1) + ' repeats)'));
        ro.set('air', fmtT(kit, F.tx.length * F.air) + '  (' + fmtT(kit, F.air) + ' each)');
        ro.set('far', far === 0 ? 'direct neighbours only' : far + (far === 1 ? ' repeat' : ' repeats') + ' away');
        ro.set('reach', '× ' + kit.fmt(F.mult, 3) + ' the range');
        if (done) loop.stop();
      }, box.stage);
      kit.click(st, p => {
        if (!F) return;
        let b = -1, bd = 18;
        F.P.forEach((q, i) => { const dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd) { bd = dd; b = i; } });
        if (b >= 0) { src = b; restart(); }
      }, p => F && F.P.some(q => Math.hypot(q.x - p.x, q.y - p.y) < 18));
      st.onResize(() => { flood(); loop.once(); });
      flood();
      loop.start();
    }
  });

  /* ================================================================ lr-range */
  const BANDS = [
    { mhz: 433.92, name: '433 MHz', hue: 150 },
    { mhz: 868, name: '868 MHz', hue: 40 },
    { mhz: 2442, name: '2.4 GHz', hue: 8 }
  ];
  Hyper.sim('lr-range', {
    title: 'Why lower frequencies reach farther',
    blurb: `Three identical radios, differing only in frequency: the same transmit power, the same antenna gain and the same receiver sensitivity. Each curve is the signal arriving at the receiver, from the link budget; the dashed line is the weakest signal the receiver can use, and the dot where a curve crosses it is the **range**.

In free space the loss between antennas of the same kind rises with the square of the frequency, so 868 MHz starts 9 dB ahead of 2.4 GHz and 433 MHz 15 dB ahead. The **surroundings** set how steeply every curve falls; a steeper fall shrinks the advantage in distance, but not in decibels.

**Try this**
- In **free space**, read the three ranges: 868 MHz reaches 2.8 times as far as 2.4 GHz, and 433 MHz 5.6 times.
- Switch to **a town**: every range collapses, and the lead of 433 MHz over 2.4 GHz shrinks from 5.6 to about 2.9 times. A steeper fall shortens all the ranges and squeezes the gaps between them.
- Raise the **receiver sensitivity** from -110 to -125 dBm (what LoRa gives): every range grows, far more than any change of frequency.
- Notice the **antenna sizes**: the longer wave needs a longer antenna, which is the price of the range.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'tx', label: 'Transmit power', min: 0, max: 20, step: 1, value: 10, unit: 'dBm' },
        { id: 'gain', label: 'Antenna gain, each end', min: -3, max: 6, step: 1, value: 0, unit: 'dBi' },
        { id: 'sens', label: 'Receiver sensitivity', min: -130, max: -90, step: 1, value: -110, unit: 'dBm' },
        { id: 'n', type: 'select', label: 'Surroundings', options: [['Free space · exponent 2.0', 2.0], ['Open country · 2.4', 2.4], ['Suburb · 2.8', 2.8], ['A town · 3.3', 3.3]], value: 2.8 },
        { id: 'd', label: 'Distance to read off', min: 10, max: 100000, value: 1000, unit: 'm', log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rng', 'Range: 433 · 868 · 2.4 GHz'], ['at', 'Signal at that distance'], ['ant', 'Quarter-wave antenna'], ['ratio', '868 MHz against 2.4 GHz']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const px = 52, py = 44, pw = st.W - px - 14, ph = st.H - py - 46;
        const X = d => px + (Math.log10(clamp(d, 10, 1e5)) - 1) / 4 * pw, P0 = -30, P1 = -140, Y = p => py + clamp((P0 - p) / (P0 - P1), 0, 1) * ph;
        const link = (b, d) => E.link({ tx: v.tx, gt: v.gain, gr: v.gain, mhz: b.mhz, d, n: v.n, sens: v.sens });
        // legend
        BANDS.forEach((b, i) => {
          const lx = px + i * Math.min(130, pw / 3);
          c.fillStyle = kit.hue(b.hue); c.fillRect(lx, 11, 12, 12);
          kit.label(c, b.name, lx + 17, 17, { size: 11, color: C.text2, weight: 600 });
        });
        // grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let p = -40; p >= -140; p -= 20) { const y = Math.round(Y(p)) + 0.5; c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke(); kit.label(c, num(p, 0), px - 6, y, { size: 10, color: C.muted, align: 'right' }); }
        ['10 m', '100 m', '1 km', '10 km', '100 km'].forEach((t, i) => { const x = Math.round(px + i / 4 * pw) + 0.5; c.beginPath(); c.moveTo(x, py); c.lineTo(x, py + ph); c.stroke(); kit.label(c, t, clamp(x, px + 12, px + pw - 14), py + ph + 14, { size: 10, color: C.muted, align: 'center' }); });
        kit.label(c, 'received power, dBm', 4, py - 8, { size: 10, color: C.muted });
        kit.label(c, 'distance', px + pw / 2, py + ph + 32, { size: 10, color: C.muted, align: 'center' });
        c.strokeStyle = C.axis; c.strokeRect(px + 0.5, py + 0.5, pw, ph);
        // the sensitivity line
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(px, Y(v.sens)); c.lineTo(px + pw, Y(v.sens)); c.stroke(); c.restore();
        kit.label(c, 'receiver sensitivity ' + num(v.sens, 0) + ' dBm', px + pw - 4, Y(v.sens) + 10, { size: 10, color: C.warn, align: 'right' });
        // the curves and where they meet the line
        const ranges = [];
        BANDS.forEach((b, i) => {
          c.strokeStyle = kit.hue(b.hue); c.lineWidth = 2.4; c.beginPath();
          for (let k = 0; k <= 120; k++) { const d = Math.pow(10, 1 + 4 * k / 120), y = Y(link(b, d).rx); if (k) c.lineTo(X(d), y); else c.moveTo(X(d), y); }
          c.stroke();
          const r = E.linkRange({ tx: v.tx, gt: v.gain, gr: v.gain, mhz: b.mhz, n: v.n, sens: v.sens });
          ranges.push(r);
          if (r >= 10 && r <= 1e5) {
            kit.dot(c, X(r), Y(v.sens), 5, kit.hue(b.hue), C.text);
            kit.label(c, fmtDist(kit, r), clamp(X(r), px + 24, px + pw - 30), Y(v.sens) - 12 - i * 14, { size: 10.5, color: C.text, align: 'center', weight: 650, bg: BGLABEL(C) });
          }
        });
        // the cursor
        c.save(); c.setLineDash([2, 3]); c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.moveTo(X(v.d), py); c.lineTo(X(v.d), py + ph); c.stroke(); c.restore();
        BANDS.forEach(b => kit.dot(c, X(v.d), Y(link(b, v.d).rx), 4, kit.hue(b.hue), C.text));
        ro.set('rng', ranges.map(r => fmtDist(kit, r)).join(' · '));
        ro.set('at', BANDS.map(b => num(link(b, v.d).rx, 0)).join(' · ') + ' dBm at ' + fmtDist(kit, v.d));
        ro.set('ant', BANDS.map(b => kit.fmt(E.quarterWave(b.mhz), 3) + ' mm').join(' · '));
        ro.set('ratio', '× ' + kit.fmt(ranges[1] / ranges[2], 3) + ' the range');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-cellular */
  Hyper.sim('lr-cellular', {
    title: 'A modem\'s current bursts and a sagging supply',
    blurb: `**Top:** the current the modem draws. A 2G transmit burst is 577 µs long and repeats every 4.6 ms; an LTE-M or NB-IoT uplink draws a lower current for much longer. **Bottom:** the voltage at the module. The source (a cell or a regulator) reaches the module through some **resistance**, with a **capacitor** beside the module. The voltage follows from the circuit, and where it falls under the modem's limit the picture turns red: the modem browns out and resets.

The current shapes are typical, not those of one module: read the data sheet of yours for its peak current and its minimum supply voltage.

**Try this**
- Press **Dev-board 3V3 pin**: a regulator and thin traces cannot feed a 2 A burst, and the voltage collapses.
- Press **Lithium cell and 470 µF**: the same bursts barely dent the supply.
- Keep the 2 A burst and raise the **resistance** slowly: the dip is just the current times the resistance, softened by the capacitor.
- Switch to **LTE-M** at 0.5 A: a lower peak, but it lasts so long that no capacitor can carry it, only a low resistance.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'tech', type: 'select', label: 'Modem traffic', options: [['2G burst: 577 µs every 4.6 ms', 'gsm'], ['LTE-M or NB-IoT: long, lower bursts', 'lte']], value: 'gsm' },
        { id: 'ipk', label: 'Peak current', min: 0.1, max: 2.5, step: 0.05, value: 2, unit: 'A' },
        { id: 'v0', label: 'Source voltage', min: 3.3, max: 4.2, step: 0.05, value: 3.8, unit: 'V' },
        { id: 'r', label: 'Source and wiring resistance', min: 0.05, max: 1.5, value: 0.4, unit: 'Ω', log: true, sig: 2 },
        { id: 'c', label: 'Capacitor at the module', min: 10, max: 4700, value: 100, unit: 'µF', log: true, sig: 2 },
        { id: 'vmin', label: 'Modem browns out below', min: 2.8, max: 3.6, step: 0.05, value: 3.3, unit: 'V' },
        { type: 'buttons', items: [{ id: 'weak', label: 'Dev-board 3V3 pin' }, { id: 'good', label: 'Lithium cell and 470 µF', primary: true }] }
      ], (id, val) => {
        if (id === 'tech') ctl.set('ipk', val === 'gsm' ? 2 : 0.5, false);
        if (id === 'weak') { ctl.set('v0', 3.3, false); ctl.set('r', 1.2, false); ctl.set('c', 47, false); ctl.set('tech', 'gsm', false); ctl.set('ipk', 2, false); }
        if (id === 'good') { ctl.set('v0', 3.8, false); ctl.set('r', 0.15, false); ctl.set('c', 470, false); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['ipk', 'Peak current'], ['vmin', 'Lowest voltage at the module'], ['dip', 'Dip below the source'], ['low', 'Time under the limit'], ['verdict', 'The modem']]);
      const T = 0.015, BASE = 0.04;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const px = 50, pw = st.W - px - 14;
        const hI = Math.round(st.H * 0.26), yI = 30, yV = yI + hI + 44, hV = st.H - yV - 36;
        const N = Math.max(60, Math.round(pw * 3)), dt = T / N, RC = Math.max(1e-9, v.r * v.c * 1e-6);
        const cur = t => {
          if (v.tech === 'gsm') return (t % 0.004615) < 0.000577 ? v.ipk : BASE;
          return t < 0.002 ? BASE : BASE + (v.ipk - BASE) * (0.92 + 0.08 * ((t % 0.001) < 0.0005 ? 1 : 0));
        };
        // the voltage at the module: exact for a current that is constant within each small step
        const I = [], V = [];
        let volt = v.v0 - BASE * v.r;
        for (let k = 0; k <= N; k++) {
          const t = k * dt, i = cur(t);
          const vInf = v.v0 - i * v.r;
          volt = vInf + (volt - vInf) * Math.exp(-dt / RC);
          I.push(i); V.push(volt);
        }
        const X = k => px + k / N * pw, YI = i => yI + hI - clamp(i / 2.6, 0, 1) * hI, VLO = 1.5, VHI = 4.4, YV = x => yV + hV - clamp((x - VLO) / (VHI - VLO), 0, 1) * hV;
        // current
        kit.label(c, 'Current drawn by the modem', 10, 14, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = SHADE(C); c.fillRect(px, yI, pw, hI);
        c.strokeStyle = kit.hue(30); c.lineWidth = 2; c.beginPath();
        I.forEach((i, k) => { if (k) c.lineTo(X(k), YI(i)); else c.moveTo(X(k), YI(i)); });
        c.stroke();
        [0, 1, 2].forEach(a => { kit.label(c, a + ' A', px - 6, YI(a), { size: 10, color: C.muted, align: 'right' }); });
        // voltage
        kit.label(c, 'Voltage at the module', 10, yV - 14, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = SHADE(C); c.fillRect(px, yV, pw, hV);
        c.fillStyle = C.dark ? 'rgba(229,72,77,.28)' : 'rgba(200,40,50,.2)'; c.fillRect(px, YV(v.vmin), pw, yV + hV - YV(v.vmin));
        [2, 3, 4].forEach(a => { kit.label(c, a + ' V', px - 6, YV(a), { size: 10, color: C.muted, align: 'right' }); });
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.bad; c.lineWidth = 1.4; c.beginPath(); c.moveTo(px, YV(v.vmin)); c.lineTo(px + pw, YV(v.vmin)); c.stroke();
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(px, YV(v.v0)); c.lineTo(px + pw, YV(v.v0)); c.stroke(); c.restore();
        kit.label(c, 'brown-out ' + num(v.vmin, 2) + ' V', px + pw - 4, YV(v.vmin) + 10, { size: 10, color: C.bad, align: 'right' });
        kit.label(c, 'source ' + num(v.v0, 2) + ' V', px + pw - 4, YV(v.v0) - 9, { size: 10, color: C.muted, align: 'right' });
        let vmin = 99, low = 0;
        c.lineWidth = 2.2; c.lineJoin = 'round';
        for (let k = 1; k <= N; k++) {
          vmin = Math.min(vmin, V[k]);
          const bad = V[k] < v.vmin;
          if (bad) low += dt;
          c.strokeStyle = bad ? C.bad : C.ok;
          c.beginPath(); c.moveTo(X(k - 1), YV(V[k - 1])); c.lineTo(X(k), YV(V[k])); c.stroke();
        }
        // the time axis
        const ya = yV + hV + 4;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, ya + 0.5); c.lineTo(px + pw, ya + 0.5); c.stroke();
        for (let ms = 0; ms <= 15; ms += 5) { const x = px + ms / 15 * pw; c.beginPath(); c.moveTo(x, ya); c.lineTo(x, ya + 5); c.stroke(); kit.label(c, ms + ' ms', clamp(x, px + 12, px + pw - 14), ya + 16, { size: 10, color: C.muted, align: 'center' }); }
        const dip = v.v0 - vmin, ok = vmin >= v.vmin;
        ro.set('ipk', num(v.ipk, 2) + ' A');
        ro.set('vmin', num(vmin, 2) + ' V');
        ro.set('dip', num(dip, 2) + ' V' + (v.ipk * v.r > 0 ? '  (current × resistance = ' + num(v.ipk * v.r, 2) + ' V)' : ''));
        ro.set('low', low > 0 ? fmtT(kit, low) + ' in this window' : 'none');
        ro.set('verdict', ok ? 'keeps running' : 'browns out and resets');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-uwb */
  Hyper.sim('lr-uwb', {
    title: 'Two-way ranging and the clock error',
    blurb: `A initiates: it sends a **poll**, B answers after a **reply delay**, and A times the round trip on its own clock. Subtracting B's reply delay leaves twice the flight time. The catch: B measures its reply delay on **its own crystal**, which runs a little fast or slow. In **single-sided** ranging that error is multiplied by the whole reply delay; **double-sided** ranging adds a third message and combines two round trips, and the error all but cancels.

The timing diagram is not to scale (the flight time is thousands of times shorter than the reply delay). The numbers are computed exactly, from timestamps taken on two clocks that differ by the chosen amount.

**Try this**
- With the defaults (300 µs reply, 20 ppm) the single-sided answer is about **0.9 m** out at any distance; the double-sided one is out by a fraction of a millimetre.
- Cut the **reply delay** to 50 µs: the single-sided error shrinks in proportion. Fast replies help, but a chip cannot reply in no time.
- Set the clock difference to **0**: both methods agree and are right.
- Move the **distance**: the single-sided error does not change with it, because it comes from the reply delay.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 400, maxH: 480 });
      const CL = 299792458;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Distance', min: 0.5, max: 50, value: 5, unit: 'm', log: true, sig: 2 },
        { id: 'tp', label: 'Reply delay', min: 50, max: 2000, value: 300, unit: 'µs', log: true, sig: 2 },
        { id: 'ppm', label: 'Responder\'s clock runs fast by', min: -40, max: 40, step: 1, value: 20, unit: 'ppm' },
        { id: 'ds', type: 'check', label: 'Show double-sided ranging (three messages)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['tof', 'Flight time'], ['ss', 'Single-sided result'], ['dsr', 'Double-sided result']]);
      function calc() {
        const v = ctl.values, tof = v.d / CL, tp = v.tp * 1e-6, e = v.ppm * 1e-6;
        const tofSS = ((2 * tof + tp) - tp * (1 + e)) / 2;                       // B reports its delay as counted on B's clock
        const Ra = 2 * tof + tp, Da = tp, Rb = (2 * tof + tp) * (1 + e), Db = tp * (1 + e);
        const tofDS = (Ra * Rb - Da * Db) / (Ra + Rb + Da + Db);
        return { tof, tofSS, tofDS, errSS: (tofSS - tof) * CL, errDS: (tofDS - tof) * CL, dSS: tofSS * CL, dDS: tofDS * CL };
      }
      const errText = (kit, e) => Math.abs(e) >= 0.01 ? num(e, 2) + ' m' : num(e * 1000, 2) + ' mm';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, m = calc(), ds = v.ds;
        const nr = clamp(st.W / 30, 12, 17), ny = 22 + nr, ax = Math.round(st.W * 0.12), bx = Math.round(st.W * 0.88);
        S.node(c, ax, ny, { kind: 'esp', label: 'initiator A', r: nr, color: 8 });
        S.node(c, bx, ny, { kind: 'esp', label: 'responder B', r: nr, color: 212 });
        S.link(c, ax + nr + 8, ny, bx - nr - 8, ny, { wireless: true, arrow: 'both', label: kit.fmt(v.d, 3) + ' m: light takes ' + kit.fmt(m.tof * 1e9, 3) + ' ns' });
        // the timing diagram
        const L = 38, R = st.W - 14, w = R - L, yA = ny + nr + 58, yB = yA + 104;
        const colA = kit.hue(8), colB = kit.hue(212);
        let s = 30, rw = clamp(40 + 70 * Math.log(v.tp / 50) / Math.log(40), 40, 110);
        const total = 10 + (ds ? 3 : 2) * s + (ds ? 2 : 1) * rw, f = Math.min(1, (w - 16) / total);
        s *= f; rw *= f;
        const x1 = L + 10, x2 = x1 + s + rw, x3 = x2 + s + rw;
        c.fillStyle = SHADE(C); c.fillRect(L, yA - 1, w, 3); c.fillRect(L, yB - 1, w, 3);
        kit.label(c, 'A', L - 10, yA, { size: 13, weight: 700, color: colA, align: 'right' });
        kit.label(c, 'B', L - 10, yB, { size: 13, weight: 700, color: colB, align: 'right' });
        const msg = (xa, ya, xb, yb, text, col, side) => {
          kit.arrow(c, xa, ya, xb, yb, col, 2);
          kit.label(c, text, (xa + xb) / 2 + side * 6, (ya + yb) / 2, { size: 10.5, color: C.text, align: side < 0 ? 'right' : 'left', bg: BGLABEL(C) });
        };
        msg(x1, yA, x1 + s, yB, 'poll', colA, -1);
        msg(x2, yB, x2 + s, yA, 'response', colB, 1);
        if (ds) msg(x3, yA, x3 + s, yB, 'final', colA, -1);
        const bracket = (xa, xb, y, up, text, col) => {
          c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xa, y); c.lineTo(xb, y); c.moveTo(xa, y - 4); c.lineTo(xa, y + 4); c.moveTo(xb, y - 4); c.lineTo(xb, y + 4); c.stroke();
          kit.label(c, text, (xa + xb) / 2, y + (up ? -10 : 11), { size: 10.5, color: col, align: 'center', weight: 600 });
        };
        bracket(x1, x2 + s, yA - 20, true, 'T_round (A)', colA);
        bracket(x1 + s, x2, yB + 20, false, 'T_reply (B)', colB);
        if (ds) { bracket(x2 + s, x3, yA - 20, true, 'T_reply 2 (A)', colA); bracket(x2, x3 + s, yB + 20, false, 'T_round 2 (B)', colB); }
        kit.label(c, ds ? 'distance = c × (Ra·Rb − Da·Db) / (Ra + Rb + Da + Db)' : 'distance = c × (T_round − T_reply) / 2', st.W / 2, yB + 52, { size: 11.5, color: C.text2, align: 'center', weight: 600 });
        kit.label(c, 'not to scale: the flight time is far shorter than the delay', st.W / 2, yB + 68, { size: 10, color: C.muted, align: 'center' });
        // the two answers
        const rows = [['Single-sided', m.dSS, m.errSS, !ds], ['Double-sided', m.dDS, m.errDS, ds]], y0 = yB + 90;
        rows.forEach(([name, d, err, on], i) => {
          const y = y0 + i * 30, good = Math.abs(err) < 0.05, col = good ? C.ok : C.bad;
          c.fillStyle = good ? (C.dark ? 'rgba(34,179,122,.18)' : 'rgba(34,179,122,.14)') : (C.dark ? 'rgba(229,72,77,.2)' : 'rgba(200,40,50,.12)');
          c.fillRect(10, y, st.W - 20, 24);
          c.strokeStyle = col; c.lineWidth = on ? 2.2 : 1; c.strokeRect(10.5, y + 0.5, st.W - 21, 23);
          kit.label(c, name + ':  ' + (d >= 0 ? kit.fmt(d, 3) : '−' + kit.fmt(-d, 3)) + ' m', 18, y + 12, { size: 12, weight: on ? 700 : 500, color: C.text });
          kit.label(c, 'error ' + errText(kit, err), st.W - 18, y + 12, { size: 12, align: 'right', color: col, weight: 650 });
        });
        ro.set('tof', kit.fmt(m.tof * 1e9, 3) + ' ns  (' + kit.fmt(v.d, 3) + ' m)');
        ro.set('ss', kit.fmt(m.dSS, 3) + ' m, error ' + errText(kit, m.errSS));
        ro.set('dsr', kit.fmt(m.dDS, 3) + ' m, error ' + errText(kit, m.errDS));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-ir */
  Hyper.sim('lr-ir', {
    title: 'An NEC infrared frame',
    blurb: `**Top:** the frame as the remote's LED sends it (the carrier is switched on during each burst) and, below, what an IR receiver module outputs: high at rest, **low during a burst**. The shaded fields are the bytes it decodes. A 0 is a short space after the 560 µs burst, a 1 a long one, and each byte is followed by its inverse so that the receiver can check it. **Bottom:** inside a single burst, the carrier itself.

**Try this**
- Change the **command** or the **address**: the pattern of long and short spaces changes, but the frame never gets longer, because every byte is followed by its inverse and so half of the 32 bits are always 1s.
- Make the remote's **carrier 56 kHz** and leave the module tuned to 38 kHz: the module does not see the remote at all.
- A carrier of 36 or 40 kHz still gets through a 38 kHz module, with less range.
- Tick **key held down**: a short repeat code follows every 108 ms, carrying no address or command.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 440 });
      const FREQS = [['36 kHz', 36], ['38 kHz', 38], ['40 kHz', 40], ['56 kHz', 56]];
      const ctl = kit.controls(box.side, [
        { id: 'addr', label: 'Address', min: 0, max: 255, step: 1, value: 0 },
        { id: 'cmd', label: 'Command', min: 0, max: 255, step: 1, value: 69 },
        { id: 'car', type: 'select', label: 'The remote\'s carrier', options: FREQS, value: 38 },
        { id: 'mod', type: 'select', label: 'The receiver module is tuned to', options: FREQS, value: 38 },
        { id: 'rep', type: 'check', label: 'Key held down (repeat code)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['frame', 'Frame length'], ['bytes', 'Bytes sent'], ['car', 'Carrier period'], ['seen', 'Receiver module'], ['dec', 'Decoded']]);
      const hex = n => '0x' + (n & 255).toString(16).toUpperCase().padStart(2, '0');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const addr = Math.round(v.addr), cmd = Math.round(v.cmd), T0 = 0.004;
        const f = E.proto.nec(addr, cmd, { t: T0 });
        const edges = f.edges.slice();
        let t1 = Math.max(f.t1 + 0.004, 0.06);
        if (v.rep) { const t = T0 + 0.108; edges.push([t, 1], [t + 0.009, 0], [t + 0.01125, 1], [t + 0.01125 + 0.00056, 0]); t1 = T0 + 0.108 + 0.0125 + 0.004; }
        const diff = Math.abs(v.car - v.mod), seen = diff <= 3;
        const out = seen ? edges.map(e => [e[0], 1 - e[1]]) : [[0, 1]];
        const marks = seen ? f.marks.map((m, i) => ({ t0: m.t0, t1: m.t1, text: i === 0 ? 'leader' : m.text })) : [];
        kit.label(c, 'The frame, at the LED and at the receiver', 10, 14, { size: 11.5, weight: 650, color: C.text2 });
        const h = Math.round(st.H * 0.4);
        S.logic(c, 8, 26, st.W - 16, h, [
          { label: 'LED', edges, color: C.warn },
          { label: 'OUT', edges: out, color: C.accent, marks }
        ], { t0: 0, t1, unit: 'ms', labelW: 44 });
        kit.label(c, 'leader, address, its inverse, command, its inverse', st.W / 2, 26 + h + 8, { size: 10.5, color: C.muted, align: 'center' });
        // the carrier inside one burst
        const y2 = 26 + h + 40, pw2 = Math.min(st.W - 24, 420), per = pw2 / 5, x0 = Math.max(12, (st.W - pw2) / 2);
        kit.label(c, 'Inside one burst: the carrier', 10, y2, { size: 11.5, weight: 650, color: C.text2 });
        const yh = y2 + 18, yl = yh + 24;
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, yl);
        for (let k = 0; k < 5; k++) { const a = x0 + k * per; c.lineTo(a, yl); c.lineTo(a, yh); c.lineTo(a + per / 3, yh); c.lineTo(a + per / 3, yl); c.lineTo(a + per, yl); }
        c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yl + 8); c.lineTo(x0 + per, yl + 8); c.moveTo(x0, yl + 4); c.lineTo(x0, yl + 12); c.moveTo(x0 + per, yl + 4); c.lineTo(x0 + per, yl + 12); c.stroke();
        kit.label(c, 'period ' + kit.fmt(1000 / v.car, 3) + ' µs (' + v.car + ' kHz); LED on for a third', x0, yl + 22, { size: 10.5, color: C.text2 });
        const verdict = diff <= 1 ? 'tuned: sees it clearly' : seen ? 'off centre: sees it, with less range' : 'blind to this carrier';
        ro.set('frame', kit.fmt((f.t1 - T0 - 0.001) * 1000, 3) + ' ms' + (v.rep ? ' and then a repeat' : ''));
        ro.set('bytes', hex(addr) + ' ' + hex(~addr) + ' ' + hex(cmd) + ' ' + hex(~cmd));
        ro.set('car', kit.fmt(1000 / v.car, 3) + ' µs');
        ro.set('seen', verdict);
        ro.set('dec', seen ? 'address ' + hex(addr) + ', command ' + hex(cmd) : 'nothing');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lr-compare */
  Hyper.sim('lr-compare', {
    title: 'How far each radio reaches',
    blurb: `Six radios, one **link-budget** model: the received power is the transmit power plus both antenna gains minus the path loss, and the range is where it falls to the receiver's sensitivity less a **fade margin**. The transmit powers and sensitivities are typical figures (the Wi-Fi radio's come from the chip catalogue; the others from the usual data sheets, rounded), at the frequency shown. Bars are on a **logarithmic** scale, one decade per gridline.

Cellular, UWB and infrared do not appear: a cellular link reaches as far as the nearest tower, UWB is chosen for timing not reach, and infrared is a few metres in sight. Real ranges also depend on the horizon, antennas and obstacles; this compares the radios, it does not promise a distance.

**Try this**
- In **free space**, LoRa at SF12 reaches hundreds of kilometres, past the horizon: only the horizon would stop it. In **a town** the same radio reaches a few kilometres.
- Compare **SF7 with SF12**: the slow setting gains 12.5 dB, a factor of about two to four in range depending on the surroundings.
- Put the radios **indoors** and watch the 2.4 GHz and nRF24 bars shrink to a room or two.
- Raise the **fade margin**: ranges you could count on are shorter than ranges you could get on a good day.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 400, maxH: 480 });
      const wifi = E.chip('esp32-c3') || E.chip('esp32');
      const TECH = [
        { name: 'Wi-Fi or ESP-NOW, 1 Mbit/s', mhz: 2442, tx: wifi.txDbm, sens: wifi.sensDbm, hue: 212 },
        { name: 'nRF24L01+, 250 kbit/s', mhz: 2476, tx: 0, sens: -94, hue: 280 },
        { name: '433 MHz OOK module', mhz: 433.92, tx: 10, sens: -105, hue: 150 },
        { name: 'CC1101 FSK, 1.2 kbit/s', mhz: 868, tx: 10, sens: -112, hue: 100 },
        { name: 'LoRa SF7, 125 kHz', mhz: 868, tx: 14, sens: E.lora({ sf: 7, bw: 125e3 }).sensitivity, hue: 40 },
        { name: 'LoRa SF12, 125 kHz', mhz: 868, tx: 14, sens: E.lora({ sf: 12, bw: 125e3 }).sensitivity, hue: 8 }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'env', type: 'select', label: 'Surroundings', options: [['Free space · exponent 2.0', 'free'], ['Open country · 2.4', 'open'], ['Suburb · 2.8', 'sub'], ['A town · 3.3', 'town'], ['Inside a building · 3.5, two walls', 'in']], value: 'sub' },
        { id: 'gain', label: 'Antenna gain, each end', min: -3, max: 6, step: 1, value: 0, unit: 'dBi' },
        { id: 'margin', label: 'Fade margin', min: 0, max: 20, step: 1, value: 10, unit: 'dB' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['far', 'Reaches farthest'], ['near', 'Reaches least'], ['ratio', 'LoRa SF12 against Wi-Fi']]);
      const ENV = { free: [2, 0], open: [2.4, 0], sub: [2.8, 0], town: [3.3, 0], 'in': [3.5, 2] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, [n, walls] = ENV[v.env];
        const rng2 = TECH.map(t => E.linkRange({ tx: t.tx, gt: v.gain, gr: v.gain, mhz: t.mhz, n, sens: t.sens, margin: v.margin, walls, wallLoss: 5 }));
        const x0 = 10, pw = st.W - 20 - 72, top = 24, rowH = clamp((st.H - top - 34) / 6, 48, 64), X = d => x0 + clamp(Math.log10(Math.max(1, d)) / 5, 0, 1) * pw;
        kit.label(c, 'Range, from a link budget (logarithmic)', 10, 12, { size: 11.5, weight: 650, color: C.text2 });
        // gridlines and the axis
        c.strokeStyle = C.grid; c.lineWidth = 1;
        ['1 m', '10 m', '100 m', '1 km', '10 km', '100 km'].forEach((t, i) => {
          const x = Math.round(x0 + i / 5 * pw) + 0.5;
          c.beginPath(); c.moveTo(x, top); c.lineTo(x, top + rowH * 6); c.stroke();
          kit.label(c, t, clamp(x, x0 + 10, x0 + pw - 10), top + rowH * 6 + 12, { size: 10, color: C.muted, align: 'center' });
        });
        TECH.forEach((t, i) => {
          const y = top + i * rowH, r = rng2[i], len = Math.max(2, X(r) - x0), beyond = r > 1e5;
          kit.label(c, t.name, x0, y + 9, { size: 11.5, weight: 650, color: C.text });
          kit.label(c, 'tx ' + num(t.tx, 0) + ' dBm · sensitivity ' + num(t.sens, 1) + ' dBm · ' + kit.fmt(t.mhz / 1000, 3) + ' GHz', x0, y + 23, { size: 10, color: C.muted });
          c.fillStyle = kit.hue(t.hue, 0.85); c.fillRect(x0, y + 31, len, 11);
          kit.label(c, (beyond ? '> 100 km' : r < 1 ? '< 1 m' : fmtDist(kit, r)), x0 + len + 6, y + 37, { size: 11.5, weight: 650, color: C.text });
        });
        const hi = rng2.indexOf(Math.max(...rng2)), lo = rng2.indexOf(Math.min(...rng2));
        ro.set('far', TECH[hi].name + ': ' + fmtDist(kit, rng2[hi]));
        ro.set('near', TECH[lo].name + ': ' + (rng2[lo] < 1 ? 'under 1 m' : fmtDist(kit, rng2[lo])));
        ro.set('ratio', '× ' + kit.fmt(rng2[5] / Math.max(1e-9, rng2[0]), 3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
