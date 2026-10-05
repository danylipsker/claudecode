/* HYPER-ESP32 · sims/tinyml.js
 *
 * Machine learning on the chip. Simulations (ids start with ml-):
 *   ml-fit        what a model needs against what each chip has: memory (flash, RAM, PSRAM) or time; params: { mode: 'memory' | 'speed' }
 *   ml-net        a tiny network separating two kinds of points: training, the probe, the weights rounded to fewer bits
 *   ml-quant      float to integer: the staircase, the step, the error, and what one outlier does to the range
 *   ml-arena      the tensor arena: which layer buffers are alive at each step, reused or not
 *   ml-confusion  a confusion matrix of a gesture classifier on simulated recordings
 *   ml-kws        a synthetic word -> frames -> spectrogram -> scores, with a loudness gate and a threshold
 *   ml-gesture    three accelerometer traces, the features computed from them, the class scores
 *   ml-anomaly    a motor that learns its normal vibration, then a fault of adjustable strength
 *   ml-cloud      one request on the chip against one in the cloud: latency, energy, battery life
 * The model sizes and speeds are typical orders of magnitude, not published figures of one model; the chips come from the catalogue.
 */
(function () {
  'use strict';

  /* ================================================================ helpers */
  function rng(seed) {                                   // a small seeded generator: the same seed gives the same picture
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { let u = 0; while (u === 0) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = v => (typeof v === 'number' && isFinite(v) ? v : 0);
  function fmtKB(kb) {                                   // a size in KB -> "820 B", "12.5 KB", "3.2 MB"
    kb = fin(kb);
    if (kb < 1) return Math.round(kb * 1024) + ' B';
    if (kb < 10) return kb.toFixed(1) + ' KB';
    if (kb < 1024) return Math.round(kb) + ' KB';
    return (kb / 1024).toFixed(kb < 10240 ? 1 : 0) + ' MB';
  }
  function fmtMs(ms) {                                   // a time in ms -> "0.12 ms", "35 ms", "1.4 s"
    ms = fin(ms);
    if (ms < 1) return ms.toFixed(ms < 0.1 ? 3 : 2) + ' ms';
    if (ms < 100) return ms.toFixed(ms < 10 ? 1 : 0) + ' ms';
    if (ms < 1000) return Math.round(ms) + ' ms';
    if (ms < 100000) return (ms / 1000).toFixed(ms < 10000 ? 2 : 1) + ' s';
    return Math.round(ms / 1000) + ' s';
  }
  const shortName = c => String(c.name || c.id).replace(/\s*\(.*\)/, '');
  const trunc = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s));
  function psramMB(c) {                                  // the largest PSRAM the catalogue mentions for a chip, in MB (0: none)
    const nums = [];
    [c.psramMax].concat(c.psramIn || []).forEach(s => {
      if (typeof s === 'string') (s.match(/(\d+)\s*MB/g) || []).forEach(m => nums.push(parseInt(m, 10)));
    });
    return nums.length ? Math.max.apply(null, nums) : 0;
  }
  const MCU = kit => kit.esp.CHIPS.filter(c => !c.coproc && c.sram);

  /* typical model sizes (orders of magnitude, int8): parameters, MACs per inference, arena in KB */
  const MODELS = [
    { id: 'gesture', name: 'Gesture classifier', params: 8500, macs: 8500, arena: 1.0 },
    { id: 'anomaly', name: 'Anomaly autoencoder', params: 5000, macs: 5000, arena: 0.8 },
    { id: 'kws', name: 'Keyword spotter', params: 20000, macs: 2500000, arena: 30 },
    { id: 'person', name: 'Person detector, 96 × 96', params: 250000, macs: 7000000, arena: 136 },
    { id: 'image', name: 'Image classifier, 128 × 128', params: 1700000, macs: 20000000, arena: 450 },
    { id: 'large', name: 'Large vision model', params: 12000000, macs: 400000000, arena: 3000 }
  ];

  /* ================================================================ ml-fit */
  Hyper.sim('ml-fit', {
    title: 'Does the model fit the chip?',
    blurb: `Every row is a chip from the catalogue. **Memory view**: the bar is the chip's internal SRAM; the dark part is what Wi-Fi, the system and the rest of your program keep, and the coloured part is the arena the model asks for. **Time view**: how long one inference takes at the clock of each chip, on a log scale, against a deadline you set.

The model sizes are typical orders of magnitude, not one published model. The *rate* of the time view is yours to measure with the timing program on the page.

**Try this**
- Pick the **person detector** in the memory view: which chips hold its arena in internal RAM, and which only with PSRAM?
- Switch to **float32**: the weights and the arena grow fourfold, and chips without a floating-point unit are marked.
- In the time view raise the **speed-up of the vector kernels**: only the chips with vector instructions move.
- Set a tight **deadline** and see which chips can keep it.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { height: 440 });
      const chips = MCU(kit);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'View', options: [['Memory', 'memory'], ['Time', 'speed']], value: params.mode === 'speed' ? 'speed' : 'memory' },
        { id: 'model', type: 'select', label: 'Model', options: MODELS.map(m => [m.name, m.id]), value: 'person' },
        { id: 'scale', label: 'Scale the model', min: 0.25, max: 4, value: 1, log: true, unit: '×', sig: 2 },
        { id: 'prec', type: 'select', label: 'Stored as', options: [['8-bit integers', 'int8'], ['32-bit floats', 'f32']], value: 'int8' },
        { id: 'reserved', label: 'RAM kept by the rest of the program', min: 0, max: 400, step: 10, value: 120, unit: 'KB' },
        { id: 'psram', type: 'check', label: 'Allow PSRAM for the arena', value: true },
        { id: 'flash', label: 'Flash available for the model', min: 256, max: 16384, value: 1280, log: true, unit: 'KB', sig: 3 },
        { id: 'r0', label: 'MACs per cycle, plain code', min: 0.02, max: 2, value: 0.25, log: true, sig: 2 },
        { id: 'speedup', label: 'Speed-up of vector kernels', min: 1, max: 16, step: 0.5, value: 4, unit: '×' },
        { id: 'deadline', label: 'Deadline per answer', min: 10, max: 5000, value: 200, log: true, unit: 'ms', sig: 2 }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['a', 'Weights'], ['b', 'Arena'], ['c', 'Chips with room in internal RAM'], ['d', 'Flash'], ['e', 'MACs per inference'], ['f', 'Fastest'], ['g', 'Slowest']]);
      function sync() {
        const mem = ctl.values.mode === 'memory';
        ['prec', 'reserved', 'psram', 'flash'].forEach(k => ctl.show(k, mem));
        ['r0', 'speedup', 'deadline'].forEach(k => ctl.show(k, !mem));
        ['a', 'b', 'c', 'd'].forEach(k => ro.show(k, mem));
        ['e', 'f', 'g'].forEach(k => ro.show(k, !mem));
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const M = MODELS.find(m => m.id === v.model) || MODELS[0];
        const f32 = v.prec === 'f32', bytes = f32 ? 4 : 1;
        const params2 = M.params * v.scale, macs = M.macs * v.scale;
        const weightsKB = params2 * bytes / 1024, arenaKB = M.arena * v.scale * bytes;
        const W = st.W, mem = v.mode === 'memory';
        const labW = W < 520 ? 74 : 116, vW = W < 520 ? 62 : 96, x0 = 8 + labW, barW = Math.max(60, W - x0 - vW - 12);
        const top = 34, rowH = (st.H - top - 40) / chips.length;
        kit.label(c, mem ? 'Internal SRAM (scale 0 – 800 KB)' : 'Time of one inference (log scale)', x0, 14, { size: 11.5, color: C.text2, weight: 600 });
        if (mem) {
          kit.label(c, 'dark: kept for the rest', x0 + barW, 14, { size: 10, color: C.muted, align: 'right' });
        }
        let fits = 0, fastest = null, slowest = null, anyNoFpu = false;
        const maxKB = 800, tMin = -2, tMax = 5;               // log10 ms
        chips.forEach((ch, i) => {
          const y = top + i * rowH, h = Math.max(8, rowH - 5);
          kit.label(c, trunc(shortName(ch), W < 520 ? 12 : 17), 8, y + h / 2, { size: 11, color: C.text });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)';
          c.fillRect(x0, y, barW, h);
          if (mem) {
            const free = ch.sram - v.reserved, ps = psramMB(ch);
            const ok = arenaKB <= free, viaPs = !ok && v.psram && ps > 0 && arenaKB <= ps * 1024;
            if (ok) fits++;
            const wSram = barW * Math.min(1, ch.sram / maxKB), wRes = barW * Math.min(1, Math.min(v.reserved, ch.sram) / maxKB);
            c.fillStyle = C.dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.2)';
            c.fillRect(x0, y, wSram, h);
            c.fillStyle = C.dark ? 'rgba(255,255,255,.45)' : 'rgba(0,0,0,.4)';
            c.fillRect(x0, y, wRes, h);
            const wA = barW * Math.min(1, arenaKB / maxKB);
            c.fillStyle = ok ? C.ok : viaPs ? C.warn : C.bad;
            c.fillRect(x0 + wRes, y + 2, Math.min(wA, barW - wRes), h - 4);
            c.strokeStyle = C.text; c.lineWidth = 1.5;
            c.beginPath(); c.moveTo(x0 + wSram, y - 1); c.lineTo(x0 + wSram, y + h + 1); c.stroke();
            const noFpu = f32 && !ch.fpu;
            if (noFpu) anyNoFpu = true;
            const verdict = ok ? 'fits' : viaPs ? 'PSRAM' : 'no';
            kit.label(c, verdict + (noFpu ? ' *' : ''), x0 + barW + 8, y + h / 2, { size: 11, weight: 650, color: ok ? C.ok : viaPs ? C.warn : C.bad });
          } else {
            const r = v.r0 * (ch.ai ? v.speedup : 1), ms = macs / (ch.mhz * 1e3 * r);
            if (!fastest || ms < fastest[1]) fastest = [ch, ms];
            if (!slowest || ms > slowest[1]) slowest = [ch, ms];
            const frac = clamp((Math.log10(Math.max(ms, 1e-9)) - tMin) / (tMax - tMin), 0.01, 1);
            const ok = ms <= v.deadline;
            c.fillStyle = ok ? (ch.ai ? C.ok : kit.hue(150, 0.85)) : C.bad;
            c.fillRect(x0, y + 2, barW * frac, h - 4);
            kit.label(c, fmtMs(ms), x0 + barW + 8, y + h / 2, { size: 11, weight: 650, color: ok ? C.text : C.bad });
            if (ch.ai) kit.label(c, '▲', x0 + barW * frac + 6, y + h / 2, { size: 9, color: C.accent });
          }
        });
        if (!mem) {
          const dx = x0 + barW * clamp((Math.log10(v.deadline) - tMin) / (tMax - tMin), 0, 1);
          c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([4, 3]);
          c.beginPath(); c.moveTo(dx, top - 4); c.lineTo(dx, top + chips.length * rowH); c.stroke(); c.setLineDash([]);
          kit.label(c, 'deadline', dx, top + chips.length * rowH + 8, { size: 10, color: C.warn, align: 'center' });
          kit.label(c, '▲ = vector instructions', 8, st.H - 12, { size: 10.5, color: C.muted });
        } else {
          const fl = weightsKB <= v.flash;
          kit.label(c, 'Weights ' + fmtKB(weightsKB) + ', flash ' + fmtKB(v.flash) + ': ' + (fl ? 'fits' : 'too large'), 8, st.H - 12, { size: 10.5, color: fl ? C.text2 : C.bad });
          if (anyNoFpu) kit.label(c, '* no FPU: float is emulated', W - 8, st.H - 28, { size: 10.5, color: C.muted, align: 'right' });
        }
        ro.set('a', fmtKB(weightsKB));
        ro.set('b', fmtKB(arenaKB));
        ro.set('c', fits + ' of ' + chips.length);
        ro.set('d', weightsKB <= v.flash ? 'fits' : 'too large for the partition');
        ro.set('e', macs >= 1e6 ? kit.fmt(macs / 1e6, 3) + ' million' : Math.round(macs).toLocaleString('en-US'));
        ro.set('f', fastest ? shortName(fastest[0]) + ', ' + fmtMs(fastest[1]) : '—');
        ro.set('g', slowest ? shortName(slowest[0]) + ', ' + fmtMs(slowest[1]) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ ml-net */
  function makePoints(kind, noise, seed) {
    const r = rng(seed), pts = [], n = 60;
    const add = (x, y, k) => pts.push({ x: clamp(x, -0.98, 0.98), y: clamp(y, -0.98, 0.98), k });
    for (let i = 0; i < n; i++) {
      if (kind === 'blobs') {
        add(-0.45 + gauss(r) * noise, -0.35 + gauss(r) * noise, 0);
        add(0.45 + gauss(r) * noise, 0.35 + gauss(r) * noise, 1);
      } else if (kind === 'xor') {
        const s = noise * 0.9;
        add(0.5 + gauss(r) * s, 0.5 + gauss(r) * s, 0); add(-0.5 + gauss(r) * s, -0.5 + gauss(r) * s, 0);
        add(0.5 + gauss(r) * s, -0.5 + gauss(r) * s, 1); add(-0.5 + gauss(r) * s, 0.5 + gauss(r) * s, 1);
        i += 0;
      } else {
        const a = r() * 2 * Math.PI, rad = 0.7 + gauss(r) * noise * 0.6;
        add(gauss(r) * noise * 0.9, gauss(r) * noise * 0.9, 0);
        add(rad * Math.cos(a), rad * Math.sin(a), 1);
      }
    }
    return pts;
  }
  function qdq(arr, bits) {                              // round an array of weights to a symmetric integer grid and back
    if (bits >= 32) return arr.slice();
    const qmax = Math.pow(2, bits - 1) - 1;
    let m = 0;
    arr.forEach(w => { m = Math.max(m, Math.abs(w)); });
    const s = m > 0 ? m / qmax : 1;
    return arr.map(w => clamp(Math.round(w / s), -qmax, qmax) * s);
  }
  Hyper.sim('ml-net', {
    title: 'A tiny network learns to separate points',
    blurb: `A network with two inputs (the position of a point), a layer of hidden neurons and one output that says "blue" or "orange". **Training** (the Train button) adjusts the weights on a computer; afterwards only the **forward pass** remains — the same arithmetic that the chip runs. Drag the white **probe** to see that forward pass: the output of each hidden neuron and the answer.

**Try this**
- Train on the **two clouds** with 2 hidden neurons: a straight boundary is enough.
- Choose **opposite corners (XOR)**: one neuron cannot do it; with 3 or 4 it can. More neurons also mean more parameters, bytes and MACs.
- After training, store the weights with **fewer bits**: the boundary shifts and the accuracy drops, first a little, then a lot.
- The **ring** needs more neurons and more training than the clouds.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 1.4, maxH: 560 });
      let seed = 3, pts = [], net = null, step = 0, training = false, hist = [], probe = { x: 0.2, y: -0.1 };
      const ctl = kit.controls(box.side, [
        { id: 'data', type: 'select', label: 'Points', options: [['Two clouds', 'blobs'], ['Opposite corners (XOR)', 'xor'], ['A ring around a disc', 'ring']], value: 'blobs' },
        { id: 'H', label: 'Hidden neurons', min: 1, max: 8, step: 1, value: 4 },
        { id: 'noise', label: 'Spread of the points', min: 0.05, max: 0.4, step: 0.01, value: 0.15 },
        { id: 'lr', label: 'Learning rate', min: 0.05, max: 2, value: 0.8, log: true, sig: 2 },
        { id: 'bits', type: 'select', label: 'Weights stored as', options: [['32-bit floats', 32], ['8 bits', 8], ['4 bits', 4], ['3 bits', 3], ['2 bits', 2]], value: 32 },
        { type: 'buttons', items: [{ id: 'train', label: 'Train', primary: true }, { id: 'init', label: 'New random weights' }, { id: 'newdata', label: 'New points' }] }
      ], (id) => {
        if (id === 'train') { training = !training; setBtn(); if (training) loop.start(); return; }
        if (id === 'newdata') seed++;
        if (id === 'H' || id === 'init' || id === 'data' || id === 'newdata' || id === 'noise') { reset(id !== 'H' && id !== 'init'); }
        loop.start(); loop.once();
      });
      const ro = kit.readout(box.side, [['acc', 'Accuracy'], ['loss', 'Loss'], ['step', 'Training steps'], ['par', 'Parameters'], ['size', 'Size at this precision'], ['mac', 'MACs per answer']]);
      const setBtn = () => { const b = ctl.rows.train; if (b) b.textContent = training ? 'Stop' : 'Train'; };
      function reset(newPoints) {
        const v = ctl.values, r = rng(seed * 17 + v.H);
        if (newPoints || !pts.length) pts = makePoints(v.data, v.noise, seed);
        net = { H: v.H, W1: [], b1: [], W2: [], b2: 0 };
        for (let j = 0; j < v.H; j++) { net.W1.push([gauss(r) * 1.2, gauss(r) * 1.2]); net.b1.push(gauss(r) * 0.3); net.W2.push(gauss(r) * 0.8); }
        step = 0; hist = []; training = false; setBtn();
      }
      function forward(W1, b1, W2, b2, x, y) {
        const h = new Array(W1.length);
        let z = b2;
        for (let j = 0; j < W1.length; j++) { h[j] = Math.tanh(W1[j][0] * x + W1[j][1] * y + b1[j]); z += W2[j] * h[j]; }
        return { h, p: 1 / (1 + Math.exp(-clamp(z, -30, 30))) };
      }
      function trainSteps(n) {
        const H = net.H, N = pts.length, lr = ctl.values.lr;
        for (let s = 0; s < n; s++) {
          const gW1 = net.W1.map(() => [0, 0]), gb1 = new Array(H).fill(0), gW2 = new Array(H).fill(0);
          let gb2 = 0;
          for (const q of pts) {
            const f = forward(net.W1, net.b1, net.W2, net.b2, q.x, q.y), dz = f.p - q.k;
            gb2 += dz;
            for (let j = 0; j < H; j++) {
              gW2[j] += dz * f.h[j];
              const dh = dz * net.W2[j] * (1 - f.h[j] * f.h[j]);
              gW1[j][0] += dh * q.x; gW1[j][1] += dh * q.y; gb1[j] += dh;
            }
          }
          for (let j = 0; j < H; j++) { net.W1[j][0] -= lr * gW1[j][0] / N; net.W1[j][1] -= lr * gW1[j][1] / N; net.b1[j] -= lr * gb1[j] / N; net.W2[j] -= lr * gW2[j] / N; }
          net.b2 -= lr * gb2 / N;
          step++;
        }
      }
      function effective() {                               // the weights as the chip would store them
        const bits = +ctl.values.bits;
        const flat1 = qdq(net.W1.map(w => w[0]).concat(net.W1.map(w => w[1])), bits), H = net.H;
        return { W1: net.W1.map((w, j) => [flat1[j], flat1[H + j]]), b1: net.b1, W2: qdq(net.W2, bits), b2: net.b2 };
      }
      function loss(w) {
        let L = 0;
        for (const q of pts) { const p = forward(w.W1, w.b1, w.W2, w.b2, q.x, q.y).p; L -= q.k ? Math.log(Math.max(p, 1e-9)) : Math.log(Math.max(1 - p, 1e-9)); }
        return L / pts.length;
      }
      let geo = null;
      const loop = kit.loop(() => {
        if (training) {
          trainSteps(12);
          if (step % 12 === 0 && (hist.length === 0 || step - hist[hist.length - 1][0] >= 24)) hist.push([step, loss(net)]);
          if (hist.length > 400) hist = hist.filter((_, i) => i % 2 === 0);
          if (step >= 6000) { training = false; setBtn(); }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, w = effective();
        const wide = W >= 560;
        const side = wide ? Math.min(H - 24, W * 0.52) : Math.min(W - 20, H * 0.5);
        const mx = wide ? 10 : (W - side) / 2, my = wide ? 12 : 10;
        geo = { mx, my, side };
        const G = 32, cell = side / G;
        for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
          const x = -1 + (gx + 0.5) / G * 2, y = 1 - (gy + 0.5) / G * 2, p = forward(w.W1, w.b1, w.W2, w.b2, x, y).p;
          c.fillStyle = kit.hue(p > 0.5 ? 28 : 212, 0.12 + 0.55 * Math.abs(p - 0.5) * 2);
          c.fillRect(mx + gx * cell, my + gy * cell, cell + 0.6, cell + 0.6);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(mx, my, side, side);
        let right = 0;
        for (const q of pts) {
          const p = forward(w.W1, w.b1, w.W2, w.b2, q.x, q.y).p, ok = (p > 0.5) === (q.k === 1), px = mx + (q.x + 1) / 2 * side, py = my + (1 - q.y) / 2 * side;
          if (ok) right++;
          kit.dot(c, px, py, 3.6, kit.hue(q.k ? 28 : 212, 1), C.dark ? 'rgba(0,0,0,.6)' : 'rgba(255,255,255,.9)');
          if (!ok) { c.strokeStyle = C.bad; c.lineWidth = 1.6; c.beginPath(); c.moveTo(px - 5, py - 5); c.lineTo(px + 5, py + 5); c.moveTo(px + 5, py - 5); c.lineTo(px - 5, py + 5); c.stroke(); }
        }
        const pf = forward(w.W1, w.b1, w.W2, w.b2, probe.x, probe.y);
        const qx = mx + (probe.x + 1) / 2 * side, qy = my + (1 - probe.y) / 2 * side;
        c.strokeStyle = C.text; c.lineWidth = 2; c.fillStyle = C.bg2;
        c.beginPath(); c.moveTo(qx, qy - 8); c.lineTo(qx + 8, qy); c.lineTo(qx, qy + 8); c.lineTo(qx - 8, qy); c.closePath(); c.fill(); c.stroke();
        kit.label(c, 'probe', qx + 11, qy - 8, { size: 10, color: C.text });
        // loss curve and the forward pass of the probe
        const px0 = wide ? mx + side + 22 : 14, pw = wide ? W - px0 - 12 : W - 28;
        const ly = wide ? 28 : my + side + 26, lh = wide ? Math.min(110, H * 0.22) : Math.max(40, H * 0.12);
        kit.label(c, 'loss while training', px0, ly - 12, { size: 11, color: C.text2, weight: 600 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px0, ly, pw, lh);
        if (hist.length > 1) {
          const sMax = hist[hist.length - 1][0] || 1;
          c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
          hist.forEach((hh, i) => { const x = px0 + hh[0] / sMax * pw, y = ly + lh - clamp(hh[1] / 0.8, 0, 1) * lh; if (i) c.lineTo(x, y); else c.moveTo(x, y); });
          c.stroke();
        } else kit.label(c, 'press Train', px0 + pw / 2, ly + lh / 2, { size: 11, color: C.faint, align: 'center' });
        kit.label(c, '0.8', px0 + 4, ly + 8, { size: 9.5, color: C.faint });
        const fy = ly + lh + 30, rowH = Math.min(18, (H - fy - 36) / Math.max(1, net.H + 1));
        kit.label(c, 'forward pass at the probe: x = ' + probe.x.toFixed(2) + ', y = ' + probe.y.toFixed(2), px0, fy - 12, { size: 11, color: C.text2, weight: 600 });
        const bx = px0 + 62, bw = Math.max(40, pw - 140);
        for (let j = 0; j < net.H; j++) {
          const y = fy + j * rowH, v = pf.h[j];
          kit.label(c, 'hidden ' + (j + 1), px0, y + rowH / 2, { size: 10, color: C.muted });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, y + 2, bw, rowH - 4);
          c.fillStyle = v >= 0 ? kit.hue(150, 0.9) : kit.hue(8, 0.9);
          c.fillRect(bx + bw / 2, y + 2, v * bw / 2, rowH - 4);
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(bx + bw / 2, y); c.lineTo(bx + bw / 2, y + rowH); c.stroke();
        }
        const oy = fy + net.H * rowH + 2;
        c.fillStyle = kit.hue(pf.p > 0.5 ? 28 : 212, 0.9); c.fillRect(bx, oy + 2, bw * pf.p, rowH - 4);
        kit.label(c, 'output', px0, oy + rowH / 2, { size: 10, color: C.text, weight: 650 });
        kit.label(c, (pf.p > 0.5 ? 'orange ' : 'blue ') + (pf.p > 0.5 ? pf.p : 1 - pf.p).toFixed(2), bx + bw + 6, oy + rowH / 2, { size: 10.5, weight: 650, color: pf.p > 0.5 ? kit.hue(28, 1) : kit.hue(212, 1) });
        const bits = +ctl.values.bits, par = 4 * net.H + 1;
        ro.set('acc', Math.round(right / pts.length * 100) + ' %  (' + right + ' of ' + pts.length + ')');
        ro.set('loss', fin(loss(w)).toFixed(3));
        ro.set('step', String(step));
        ro.set('par', par + '  (' + net.H + ' hidden neurons)');
        ro.set('size', fmtKB(par * bits / 8 / 1024) + '  at ' + bits + ' bits  (float32: ' + fmtKB(par * 4 / 1024) + ')');
        ro.set('mac', String(3 * net.H));
        if (!training) loop.stop();
      }, box.stage);
      kit.drag(st, {
        hit(p) { if (!geo) return null; const qx = geo.mx + (probe.x + 1) / 2 * geo.side, qy = geo.my + (1 - probe.y) / 2 * geo.side; return Math.hypot(p.x - qx, p.y - qy) < 18 ? 'probe' : null; },
        move(t, p) { if (!geo) return; probe.x = clamp((p.x - geo.mx) / geo.side * 2 - 1, -1, 1); probe.y = clamp(1 - (p.y - geo.my) / geo.side * 2, -1, 1); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      reset(true);
      loop.once();
    }
  });

  /* ================================================================ ml-quant */
  Hyper.sim('ml-quant', {
    title: 'Rounding to integers',
    blurb: `A few hundred values are stored as integers with a **scale**. The upper picture is the mapping: the straight line is the real value, the staircase is what the chip stores and uses. The lower picture is the histogram of the values, with the integer levels drawn as ticks (where there are few enough).

**Try this**
- Lower the **bits** from 8 to 4 and then 2: the steps grow and the error with them (about 6 dB of signal-to-noise ratio per bit).
- Add an **outlier**: one big weight stretches the range, the step grows and the ordinary values land on a few levels.
- Then choose **clip at the 99.5th percentile**: the outlier is cut off, the step shrinks again, and the error of everything else falls.
- Choose **activations**: the values are all positive, so the scheme uses a zero point and covers only the range they really take.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.78, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Values', options: [['Weights (around zero)', 'w'], ['Activations (all positive)', 'a']], value: 'w' },
        { id: 'bits', label: 'Bits per value', min: 2, max: 8, step: 1, value: 8 },
        { id: 'outlier', label: 'One outlier value', min: 0, max: 3, step: 0.1, value: 0 },
        { id: 'range', type: 'select', label: 'Range from', options: [['the largest value', 'max'], ['clip at the 99.5th percentile', 'clip']], value: 'max' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['step', 'Step (scale)'], ['max', 'Largest rounding error'], ['rms', 'RMS error'], ['snr', 'Signal-to-noise ratio'], ['clip', 'Values clipped'], ['lev', 'Levels in use'], ['size', 'Size against 32-bit floats']]);
      const N = 300;
      const base = (() => { const r = rng(11), a = []; for (let i = 0; i < N; i++) a.push(gauss(r) * 0.15); return a; })();
      const baseA = base.map(x => Math.abs(x) * 3.2);
      function data() {
        const v = ctl.values, a = (v.kind === 'w' ? base : baseA).slice();
        if (v.outlier > 0) a[0] = v.outlier;
        return a;
      }
      function pct(arr, f) { const s = arr.slice().sort((x, y) => x - y); return s[clamp(Math.round(f * (s.length - 1)), 0, s.length - 1)]; }
      function quantise(x) {
        const v = ctl.values, b = v.bits, clip = v.range === 'clip', out = { q: [], back: [] };
        if (v.kind === 'w') {
          const m = clip ? pct(x.map(Math.abs), 0.995) : Math.max.apply(null, x.map(Math.abs));
          const qmax = Math.pow(2, b - 1) - 1;
          out.scale = m > 0 ? m / qmax : 1; out.lo = -m; out.hi = m; out.z = 0; out.qmin = -qmax; out.qmax = qmax;
        } else {
          const lo = clip ? pct(x, 0.005) : Math.min.apply(null, x), hi = clip ? pct(x, 0.995) : Math.max.apply(null, x), lv = Math.pow(2, b) - 1;
          out.scale = hi > lo ? (hi - lo) / lv : 1; out.lo = lo; out.hi = hi; out.z = Math.round(-lo / out.scale); out.qmin = 0; out.qmax = lv;
        }
        let clipped = 0, e2 = 0, s2 = 0, maxe = 0;
        const used = {};
        x.forEach(val => {
          const raw = Math.round(val / out.scale) + out.z, q = clamp(raw, out.qmin, out.qmax);
          if (raw !== q) clipped++;
          const back = (q - out.z) * out.scale;
          out.q.push(q); out.back.push(back); used[q] = 1;
          const e = back - val;
          if (raw === q) maxe = Math.max(maxe, Math.abs(e));
          e2 += e * e; s2 += val * val;
        });
        out.clipped = clipped; out.rms = Math.sqrt(e2 / x.length); out.maxe = maxe;
        out.snr = e2 > 0 ? 10 * Math.log10(s2 / e2) : 99; out.used = Object.keys(used).length;
        return out;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, x = data(), Q = quantise(x);
        const W = st.W, H = st.H, ml = 44, mr = 14, pw = W - ml - mr;
        const xmin = Math.min(Math.min.apply(null, x), Q.lo) - 0.03, xmax = Math.max(Math.max.apply(null, x), Q.hi) + 0.03;
        const X = t => ml + (t - xmin) / (xmax - xmin) * pw;
        // the mapping
        const y0 = 26, h1 = H * 0.5 - 20, ymin = xmin, ymax = xmax, Y = t => y0 + h1 - (t - ymin) / (ymax - ymin) * h1;
        kit.label(c, 'stored value against real value', ml, 11, { size: 11.5, color: C.text2, weight: 600 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ml, y0, pw, h1);
        c.strokeStyle = C.faint; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(xmin), Y(xmin)); c.lineTo(X(xmax), Y(xmax)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        const steps = 360;
        for (let i = 0; i <= steps; i++) {
          const t = xmin + (xmax - xmin) * i / steps, q = clamp(Math.round(t / Q.scale) + Q.z, Q.qmin, Q.qmax), bk = (q - Q.z) * Q.scale;
          if (i) c.lineTo(X(t), Y(bk)); else c.moveTo(X(t), Y(bk));
        }
        c.stroke();
        for (let i = 0; i < x.length; i += 2) kit.dot(c, X(x[i]), Y(Q.back[i]), 1.8, C.dark ? 'rgba(255,255,255,.45)' : 'rgba(0,0,0,.35)');
        kit.label(c, 'real', ml + pw, y0 + h1 + 10, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'stored', ml - 6, y0 + 6, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, kit.fmt(xmin, 2), ml, y0 + h1 + 10, { size: 9.5, color: C.faint });
        // the histogram, with the levels
        const y2 = y0 + h1 + 34, h2 = H - y2 - 30, bins = 60, cnt = new Array(bins).fill(0);
        x.forEach(val => { cnt[clamp(Math.floor((val - xmin) / (xmax - xmin) * bins), 0, bins - 1)]++; });
        const cmax = Math.max.apply(null, cnt) || 1;
        kit.label(c, 'how the values are spread, and the integer levels', ml, y2 - 12, { size: 11.5, color: C.text2, weight: 600 });
        cnt.forEach((n, i) => { c.fillStyle = kit.hue(212, 0.8); const bh = n / cmax * h2; c.fillRect(ml + i * pw / bins + 1, y2 + h2 - bh, pw / bins - 2, bh); });
        if (Q.qmax - Q.qmin <= 64) {
          c.strokeStyle = C.warn; c.lineWidth = 1;
          for (let q = Q.qmin; q <= Q.qmax; q++) { const xx = X((q - Q.z) * Q.scale); if (xx >= ml && xx <= ml + pw) { c.beginPath(); c.moveTo(xx, y2 + h2); c.lineTo(xx, y2 + h2 + 8); c.stroke(); } }
          kit.label(c, 'ticks: the ' + (Q.qmax - Q.qmin + 1) + ' integer levels', ml + pw, y2 + h2 + 18, { size: 10, color: C.warn, align: 'right' });
        } else kit.label(c, (Q.qmax - Q.qmin + 1) + ' levels: too fine to draw', ml + pw, y2 + h2 + 18, { size: 10, color: C.muted, align: 'right' });
        ro.set('step', kit.fmt(Q.scale, 3));
        ro.set('max', kit.fmt(Q.maxe, 3) + '  (half a step: ' + kit.fmt(Q.scale / 2, 3) + ')');
        ro.set('rms', kit.fmt(Q.rms, 3));
        ro.set('snr', kit.fmt(Q.snr, 3) + ' dB');
        ro.set('clip', Q.clipped + ' of ' + x.length);
        ro.set('lev', Q.used + ' of ' + (Q.qmax - Q.qmin + 1));
        ro.set('size', Math.round(v.bits / 32 * 100) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ml-arena */
  // tensors[i] is produced by layer i (1-based); tensor 0 is the input. skips: [tensor, layer that reads it again]
  const ARENA_MODELS = [
    { id: 'cnn', name: 'Small image classifier', layers: ['conv', 'conv', 'conv', 'pool', 'dense', 'softmax'],
      tensors: [['input', 9216], ['conv1', 18432], ['conv2', 9216], ['conv3', 4608], ['pool', 1152], ['dense', 64], ['out', 4]], skips: [] },
    { id: 'kws', name: 'Keyword spotter', layers: ['conv', 'conv', 'dense', 'softmax'],
      tensors: [['input', 1960], ['conv1', 4000], ['conv2', 2080], ['dense', 64], ['out', 4]], skips: [] },
    { id: 'gesture', name: 'Gesture classifier', layers: ['dense', 'dense', 'softmax'],
      tensors: [['input', 150], ['hidden1', 48], ['hidden2', 24], ['out', 5]], skips: [] },
    { id: 'skip', name: 'Image model with a skip connection', layers: ['conv', 'conv', 'conv', 'add', 'pool', 'dense'],
      tensors: [['input', 12288], ['conv1', 16384], ['conv2', 16384], ['conv3', 16384], ['sum', 16384], ['pool', 1024], ['out', 10]], skips: [[1, 4]] }
  ];
  Hyper.sim('ml-arena', {
    title: 'The tensor arena, layer by layer',
    blurb: `Each column is one step of the model: one layer running. The coloured blocks are the buffers that must exist **at that moment** — the input of the layer, its output, and anything a skip connection still needs later. The dashed line is the peak: that is the **arena** the interpreter must be given. Switch off *reuse* and every buffer stays alive: the arena becomes the sum of all of them.

Real arenas are a little larger than the peak because of bookkeeping and alignment; the interpreter reports the exact figure.

**Try this**
- Compare **reuse on** and **off** for the small image classifier: the early layers dominate, and the saving is large.
- Choose the model with a **skip connection**: the buffer of the first layer cannot be released until the addition, so the peak rises.
- Switch to **float32**: everything grows fourfold.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Model', options: ARENA_MODELS.map(m => [m.name, m.id]), value: 'cnn' },
        { id: 'prec', type: 'select', label: 'Activations stored as', options: [['8-bit integers', 1], ['32-bit floats', 4]], value: 1 },
        { id: 'reuse', type: 'check', label: 'Reuse buffers that are no longer needed', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['peak', 'Arena needed'], ['where', 'Peak while running'], ['sum', 'If nothing were reused'], ['saved', 'Saved by reuse']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const M = ARENA_MODELS.find(m => m.id === v.model) || ARENA_MODELS[0], n = M.layers.length, by = +v.prec;
        const size = i => M.tensors[i][1] * by / 1024;                            // KB
        const last = i => { let l = i < n ? i + 1 : n; M.skips.forEach(s => { if (s[0] === i) l = Math.max(l, s[1]); }); return l; };
        const total = M.tensors.reduce((a, t, i) => a + size(i), 0);
        const live = s => { const a = []; for (let i = 0; i <= n; i++) if (v.reuse ? (i <= s && last(i) >= s) : true) a.push(i); return a; };
        let peak = 0, peakAt = 1;
        for (let s = 1; s <= n; s++) { const m = live(s).reduce((a, i) => a + size(i), 0); if (m > peak) { peak = m; peakAt = s; } }
        const W = st.W, H = st.H, ml = 52, mr = 12, mt = 26, mb = 44, pw = W - ml - mr, ph = H - mt - mb;
        const Y = kb => mt + ph - kb / total * ph, colW = pw / n, bw = Math.min(70, colW * 0.7);
        kit.label(c, 'buffers alive while each layer runs', ml, 11, { size: 11.5, color: C.text2, weight: 600 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ml, mt); c.lineTo(ml, mt + ph); c.lineTo(ml + pw, mt + ph); c.stroke();
        kit.label(c, fmtKB(total), ml - 6, mt + 4, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '0', ml - 6, mt + ph, { size: 9.5, color: C.faint, align: 'right' });
        for (let s = 1; s <= n; s++) {
          const x = ml + (s - 0.5) * colW - bw / 2;
          let acc = 0;
          live(s).forEach(i => {
            const h = size(i) / total * ph;
            c.fillStyle = kit.hue(30 + i * 47, 0.8);
            c.fillRect(x, mt + ph - acc - h, bw, Math.max(0.5, h - 1));
            if (h > 13 && bw > 36) kit.label(c, M.tensors[i][0], x + bw / 2, mt + ph - acc - h / 2, { size: 9.5, color: C.dark ? '#111' : '#fff', align: 'center', weight: 600 });
            acc += h;
          });
          kit.label(c, M.layers[s - 1], x + bw / 2, mt + ph + 12, { size: 10, color: C.text2, align: 'center' });
          kit.label(c, 'layer ' + s, x + bw / 2, mt + ph + 26, { size: 9.5, color: C.faint, align: 'center' });
        }
        const yp = Y(peak);
        c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 3]);
        c.beginPath(); c.moveTo(ml, yp); c.lineTo(ml + pw, yp); c.stroke(); c.setLineDash([]);
        kit.label(c, 'arena ' + fmtKB(peak), ml + pw, Math.max(mt + 8, yp - 9), { size: 10.5, color: C.warn, align: 'right', weight: 650 });
        ro.set('peak', fmtKB(peak));
        ro.set('where', 'layer ' + peakAt + ' (' + M.layers[peakAt - 1] + ')');
        ro.set('sum', fmtKB(total));
        ro.set('saved', Math.round((1 - peak / total) * 100) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gestures: a generator and a classifier shared by ml-gesture and ml-confusion */
  const FS = 50;                                          // samples per second
  const GCLASSES = ['idle', 'wave', 'shake', 'circle'];
  function gestureWindow(cls, r, o) {                     // o: { T (s), noise (g), tilt (degrees) }
    const n = Math.max(8, Math.round(FS * o.T)), th = o.tilt * Math.PI / 180, gx = Math.sin(th), gz = Math.cos(th);
    const A = 0.35 + 0.3 * r(), TAU = 2 * Math.PI;
    const f = cls === 'wave' ? 1.5 + r() : cls === 'circle' ? 0.9 + 0.6 * r() : 5 + 2 * r();
    const p1 = r() * TAU, p2 = r() * TAU, p3 = r() * TAU, amp = 0.9 + 0.5 * r();
    const x = [], y = [], z = [];
    for (let i = 0; i < n; i++) {
      const t = i / FS;
      let ax = 0, ay = 0, az = 0;
      if (cls === 'wave') { ax = A * Math.sin(TAU * f * t + p1); ay = 0.12 * A * Math.sin(TAU * f * t + p2); az = 0.1 * A * Math.sin(TAU * f * t + p3); }
      else if (cls === 'circle') { ax = 0.8 * A * Math.sin(TAU * f * t + p1); ay = 0.8 * A * Math.sin(TAU * f * t + p1 + Math.PI / 2); }
      else if (cls === 'shake') {
        ax = amp * Math.sin(TAU * f * t + p1) + 0.4 * amp * Math.sin(TAU * 1.7 * f * t + p2);
        ay = amp * Math.sin(TAU * f * t + p2) + 0.4 * amp * Math.sin(TAU * 1.7 * f * t + p3);
        az = 0.8 * amp * Math.sin(TAU * f * t + p3);
      }
      x.push(gx + ax + o.noise * gauss(r)); y.push(ay + o.noise * gauss(r)); z.push(gz + az + o.noise * gauss(r));
    }
    return { x, y, z, n };
  }
  function gestureFeatures(w) {                           // per axis: mean, spread, peak-to-peak
    const out = [];
    [w.x, w.y, w.z].forEach(a => {
      const m = a.reduce((s, v) => s + v, 0) / a.length;
      const sd = Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / a.length);
      out.push(m, sd, Math.max.apply(null, a) - Math.min.apply(null, a));
    });
    return out;
  }
  const gestureModels = {};
  function gestureModel(withTilt) {                       // trained once, in fixed conditions: 1 s windows, 0.05 g noise
    const key = withTilt ? 't' : 'f';
    if (gestureModels[key]) return gestureModels[key];
    const r = rng(101), data = [];
    GCLASSES.forEach((cls, k) => {
      for (let i = 0; i < 40; i++) data.push({ k, f: gestureFeatures(gestureWindow(cls, r, { T: 1, noise: 0.05, tilt: withTilt ? (r() * 80 - 40) : 0 })) });
    });
    const nf = 9, mean = new Array(nf).fill(0), sd = new Array(nf).fill(0);
    data.forEach(d => d.f.forEach((v, j) => { mean[j] += v / data.length; }));
    data.forEach(d => d.f.forEach((v, j) => { sd[j] += (v - mean[j]) * (v - mean[j]) / data.length; }));
    for (let j = 0; j < nf; j++) sd[j] = Math.sqrt(sd[j]) || 1;
    const cen = GCLASSES.map(() => new Array(nf).fill(0)), cnt = GCLASSES.map(() => 0);
    data.forEach(d => { cnt[d.k]++; d.f.forEach((v, j) => { cen[d.k][j] += (v - mean[j]) / sd[j]; }); });
    cen.forEach((c, k) => c.forEach((_, j) => { c[j] /= cnt[k]; }));
    return (gestureModels[key] = { mean, sd, cen });
  }
  function gesturePredict(w, withTilt, useMeans) {
    const M = gestureModel(withTilt), f = gestureFeatures(w), use = [];
    for (let j = 0; j < 9; j++) if (useMeans || j % 3 !== 0) use.push(j);
    const d2 = M.cen.map(c => use.reduce((s, j) => s + Math.pow((f[j] - M.mean[j]) / M.sd[j] - c[j], 2), 0));
    const t = 0.25 * use.length, lo = Math.min.apply(null, d2), e = d2.map(d => Math.exp(-(d - lo) / t)), sum = e.reduce((a, b) => a + b, 0);
    const scores = e.map(v => v / sum);
    let best = 0;
    scores.forEach((s, i) => { if (s > scores[best]) best = i; });
    return { scores, best, f };
  }

  /* ================================================================ ml-gesture */
  Hyper.sim('ml-gesture', {
    title: 'A gesture as three accelerometer traces',
    blurb: `Three traces (x, y, z, in g) of a window of samples at 50 per second, the nine features computed from them (mean, spread and peak-to-peak of each axis) and the score the classifier gives each gesture. The classifier compares the features with the average of each gesture seen in training, which was done once with the board flat, 1 s windows and little noise.

**Try this**
- Look at the four gestures: **idle** is flat at 1 g on z, **wave** swings on x, **circle** swings on x and y together, **shake** is large on every axis.
- Raise the **noise**: the quiet gestures blur first.
- **Tilt the board**: gravity moves between z and x, the means change, and the classifier is fooled — stop *using the averages* and it recovers fully; training with random tilts helps less.
- Make the **window short** (0.4 s): a slow gesture no longer shows a whole swing.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 1.0, maxH: 560 });
      let seed = 7;
      const ctl = kit.controls(box.side, [
        { id: 'cls', type: 'select', label: 'Gesture', options: GCLASSES.map(g => [g, g]), value: 'wave' },
        { id: 'noise', label: 'Sensor noise', min: 0, max: 0.5, step: 0.01, value: 0.05, unit: 'g' },
        { id: 'T', label: 'Window length', min: 0.4, max: 2, step: 0.1, value: 1, unit: 's' },
        { id: 'tilt', label: 'Tilt of the board', min: 0, max: 70, step: 1, value: 0, unit: '°' },
        { id: 'means', type: 'check', label: 'Use the averages as features', value: true },
        { id: 'trainTilt', type: 'check', label: 'Train with random tilts', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'New recording', primary: true }] }
      ], (id) => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Samples in the window'], ['mem', 'Memory of the window'], ['pred', 'The model says'], ['score', 'Score'], ['ok', 'Right?']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const w = gestureWindow(v.cls, rng(seed * 7919 + GCLASSES.indexOf(v.cls) * 131), { T: v.T, noise: v.noise, tilt: v.tilt });
        const P = gesturePredict(w, v.trainTilt, v.means);
        // the traces
        const ml = 40, mr = 12, pw = W - ml - mr, top = 22, th = Math.max(34, (H * 0.5 - top) / 3 - 4), lim = 2.5;
        kit.label(c, 'acceleration, ' + w.n + ' samples over ' + kit.fmt(v.T, 2) + ' s', ml, 10, { size: 11.5, color: C.text2, weight: 600 });
        [['x', w.x], ['y', w.y], ['z', w.z]].forEach(([nm, a], k) => {
          const y0 = top + k * (th + 4), Y = g => y0 + th / 2 - g / lim * (th / 2);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ml, y0, pw, th);
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(ml, Y(0)); c.lineTo(ml + pw, Y(0)); c.stroke();
          const mean = a.reduce((s, q) => s + q, 0) / a.length;
          c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(ml, Y(mean)); c.lineTo(ml + pw, Y(mean)); c.stroke(); c.setLineDash([]);
          c.strokeStyle = kit.hue([212, 150, 28][k], 1); c.lineWidth = 1.6; c.beginPath();
          a.forEach((g, i) => { const x = ml + i / (a.length - 1) * pw; if (i) c.lineTo(x, Y(clamp(g, -lim, lim))); else c.moveTo(x, Y(clamp(g, -lim, lim))); });
          c.stroke();
          kit.label(c, nm, ml - 8, y0 + th / 2, { size: 12, weight: 650, color: C.text, align: 'right' });
        });
        kit.label(c, '±2.5 g per trace; dashed: the mean', ml + pw, top + 3 * (th + 4) + 4, { size: 9.5, color: C.faint, align: 'right' });
        // the features
        const fy = top + 3 * (th + 4) + 22, cw = Math.min(110, (pw - 30) / 3);
        ['mean', 'spread', 'peak-to-peak'].forEach((h, j) => kit.label(c, h, ml + 24 + j * cw + cw / 2, fy, { size: 10.5, color: j === 0 && !v.means ? C.faint : C.text2, align: 'center', weight: 600 }));
        ['x', 'y', 'z'].forEach((nm, a) => {
          kit.label(c, nm, ml + 6, fy + 16 + a * 15, { size: 11, color: C.text2, weight: 650 });
          for (let j = 0; j < 3; j++) kit.label(c, P.f[a * 3 + j].toFixed(2), ml + 24 + j * cw + cw / 2, fy + 16 + a * 15, { size: 11, color: j === 0 && !v.means ? C.faint : C.text, align: 'center' });
        });
        // the scores
        const sy = fy + 70, rowH = Math.min(24, (H - sy - 12) / 4), bx = ml + 56, bw = pw - 56 - 56;
        kit.label(c, 'score of each gesture', ml, sy - 12, { size: 11.5, color: C.text2, weight: 600 });
        GCLASSES.forEach((g, i) => {
          const y = sy + i * rowH, win = i === P.best;
          kit.label(c, g, ml + 50, y + rowH / 2, { size: 11, color: win ? C.text : C.muted, align: 'right', weight: win ? 650 : 500 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, y + 2, bw, rowH - 4);
          c.fillStyle = win ? (g === v.cls ? C.ok : C.bad) : kit.hue(212, 0.6);
          c.fillRect(bx, y + 2, bw * P.scores[i], rowH - 4);
          kit.label(c, P.scores[i].toFixed(2), bx + bw + 6, y + rowH / 2, { size: 10.5, color: C.text2 });
          if (g === v.cls) kit.label(c, '◀ recorded', bx + bw * Math.min(P.scores[i], 0.72) + 6, y + rowH / 2, { size: 9.5, color: C.faint });
        });
        ro.set('n', w.n + ' per axis, ' + w.n * 3 + ' values');
        ro.set('mem', w.n * 3 * 2 + ' bytes as 16-bit values');
        ro.set('pred', GCLASSES[P.best]);
        ro.set('score', P.scores[P.best].toFixed(2));
        ro.set('ok', GCLASSES[P.best] === v.cls ? 'yes' : 'no: it took ' + v.cls + ' for ' + GCLASSES[P.best]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ml-confusion */
  Hyper.sim('ml-confusion', {
    title: 'A confusion matrix from simulated recordings',
    blurb: `Many simulated windows of each gesture are classified, and every answer is counted in a table. **Rows** are what really happened, **columns** what the model said: the diagonal is right, every other cell is a mistake of one kind. At the right, *recall* is the fraction of each row that was found; below, *precision* is the fraction of each column that was correct.

**Try this**
- At the default settings the diagonal is almost full. Raise the **noise** and watch the mistakes appear between the *quiet* gestures first.
- **Tilt the board**: the model, trained flat, starts to confuse one gesture with another. Then stop using the averages (the cure) or train with random tilts (which helps a little).
- Shorten the **window**: slow gestures are mistaken for each other.
- Press *New test set*: the numbers wobble a little. That wobble is why a test set needs many examples.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.8, maxH: 480 });
      let seed = 5;
      const ctl = kit.controls(box.side, [
        { id: 'noise', label: 'Sensor noise', min: 0, max: 0.5, step: 0.01, value: 0.08, unit: 'g' },
        { id: 'tilt', label: 'Tilt of the board', min: 0, max: 70, step: 1, value: 0, unit: '°' },
        { id: 'T', label: 'Window length', min: 0.4, max: 2, step: 0.1, value: 1, unit: 's' },
        { id: 'n', label: 'Test windows per gesture', min: 20, max: 300, step: 10, value: 100 },
        { id: 'means', type: 'check', label: 'Use the averages as features', value: true },
        { id: 'trainTilt', type: 'check', label: 'Train with random tilts', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'New test set', primary: true }] }
      ], (id) => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['acc', 'Accuracy'], ['worst', 'Most common mistake'], ['n', 'Windows tested']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, K = GCLASSES.length;
        const mat = GCLASSES.map(() => new Array(K).fill(0));
        GCLASSES.forEach((cls, k) => {
          for (let i = 0; i < v.n; i++) {
            const r = rng(seed * 100003 + k * 7919 + i * 31 + 1);
            const w = gestureWindow(cls, r, { T: v.T, noise: v.noise, tilt: v.tilt + (r() - 0.5) * 6 });
            mat[k][gesturePredict(w, v.trainTilt, v.means).best]++;
          }
        });
        const cell = Math.max(34, Math.min((W - 190) / K, (H - 130) / K, 84)), mx = Math.max(74, (W - K * cell - 110) / 2 + 60), my = 52;
        kit.label(c, 'what the model said', mx + K * cell / 2, 12, { size: 11.5, color: C.text2, align: 'center', weight: 600 });
        GCLASSES.forEach((g, j) => kit.label(c, g, mx + (j + 0.5) * cell, my - 12, { size: 10.5, color: C.text2, align: 'center' }));
        let right = 0, total = 0, worst = null;
        GCLASSES.forEach((g, i) => {
          kit.label(c, g, mx - 8, my + (i + 0.5) * cell, { size: 10.5, color: C.text2, align: 'right' });
          const rowN = mat[i].reduce((a, b) => a + b, 0);
          for (let j = 0; j < K; j++) {
            const n = mat[i][j], f = rowN ? n / rowN : 0, x = mx + j * cell, y = my + i * cell;
            c.fillStyle = i === j ? kit.hue(150, 0.12 + 0.7 * f) : kit.hue(8, n ? 0.12 + 0.8 * Math.min(1, f * 2) : 0.03);
            c.fillRect(x + 1, y + 1, cell - 2, cell - 2);
            kit.label(c, String(n), x + cell / 2, y + cell / 2, { size: 12, color: C.text, align: 'center', weight: i === j ? 650 : 500 });
            total += n; if (i === j) right += n;
            if (i !== j && (!worst || n > worst.n)) worst = { i, j, n };
          }
          kit.label(c, rowN ? Math.round(mat[i][i] / rowN * 100) + ' %' : '—', mx + K * cell + 10, my + (i + 0.5) * cell, { size: 10.5, color: C.text, weight: 600 });
        });
        kit.label(c, 'recall', mx + K * cell + 10, my - 12, { size: 10, color: C.muted });
        kit.label(c, 'real ↓   said →', mx - 8, my - 12, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'precision', mx - 8, my + K * cell + 14, { size: 10, color: C.muted, align: 'right' });
        for (let j = 0; j < K; j++) {
          const colN = mat.reduce((a, row) => a + row[j], 0);
          kit.label(c, colN ? Math.round(mat[j][j] / colN * 100) + ' %' : '—', mx + (j + 0.5) * cell, my + K * cell + 14, { size: 10.5, color: C.text, align: 'center', weight: 600 });
        }
        ro.set('acc', total ? (right / total * 100).toFixed(1) + ' %' : '—');
        ro.set('worst', worst && worst.n > 0 ? GCLASSES[worst.i] + ' taken for ' + GCLASSES[worst.j] + ' (' + worst.n + ')' : 'none');
        ro.set('n', String(total));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ml-kws */
  const KFS = 8000, KN = 8000, KFR = 240, KHOP = 160, KB = 16;     // 8 kHz, one second, 30 ms frames every 20 ms, 16 bands
  const KWORDS = ['yes', 'no', 'stop', 'nothing'];
  const KBANDS = (() => { const a = []; for (let b = 0; b < KB; b++) a.push(250 * Math.pow(3700 / 250, b / (KB - 1))); return a; })();
  const KWIN = (() => { const w = new Float32Array(KFR); for (let i = 0; i < KFR; i++) w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (KFR - 1)); return w; })();
  function kwsSignal(word, noise, seed) {                 // a synthetic "word": tones and hiss, with a little jitter, over background noise
    const r = rng(seed), x = new Float32Array(KN), TAU = 2 * Math.PI, jit = (r() - 0.5) * 0.12;
    let ph = 0, prev = 0;
    for (let i = 0; i < KN; i++) {
      const t = i / KFS, g = gauss(r), hiss = g - prev;
      prev = g;
      let s = 0;
      const burst = (a, b, f0, f1, amp) => {
        if (t >= a + jit && t < b + jit) { const u = (t - a - jit) / (b - a); ph += TAU * (f0 + (f1 - f0) * u) / KFS; s += amp * Math.pow(Math.sin(Math.PI * u), 1.3) * Math.sin(ph); }
      };
      const puff = (a, b, amp) => { if (t >= a + jit && t < b + jit) s += amp * Math.sin(Math.PI * (t - a - jit) / (b - a)) * hiss; };
      if (word === 'yes') { burst(0.15, 0.55, 500, 1800, 0.5); puff(0.55, 0.78, 0.28); }
      else if (word === 'no') { burst(0.2, 0.62, 1400, 400, 0.5); }
      else if (word === 'stop') { puff(0.1, 0.2, 0.3); burst(0.22, 0.37, 900, 900, 0.5); burst(0.5, 0.65, 900, 900, 0.5); }
      x[i] = s + noise * 0.25 * gauss(r);
    }
    return x;
  }
  function kwsSpectrogram(x) {                            // [frame][band]: the log of the power in each band, scaled to about 0..1
    const frames = Math.floor((KN - KFR) / KHOP) + 1, S = [], rms = [];
    const coef = KBANDS.map(f => 2 * Math.cos(2 * Math.PI * f / KFS));
    for (let fr = 0; fr < frames; fr++) {
      const o = fr * KHOP, row = new Array(KB);
      let e = 0;
      for (let i = 0; i < KFR; i++) e += x[o + i] * x[o + i];
      rms.push(Math.sqrt(e / KFR));
      for (let b = 0; b < KB; b++) {
        let s1 = 0, s2 = 0;
        for (let i = 0; i < KFR; i++) { const s0 = x[o + i] * KWIN[i] + coef[b] * s1 - s2; s2 = s1; s1 = s0; }
        const p = (s1 * s1 + s2 * s2 - coef[b] * s1 * s2) / (KFR * KFR);
        row[b] = clamp((Math.log10(p + 1e-7) + 6.5) / 5.5, 0, 1);
      }
      S.push(row);
    }
    return { S, rms };
  }
  function kwsNorm(S) {                                   // subtract the mean, scale to unit length: a flat rise in noise does not matter
    const flat = [].concat.apply([], S), m = flat.reduce((a, v) => a + v, 0) / flat.length;
    const v = flat.map(q => q - m), n = Math.sqrt(v.reduce((a, q) => a + q * q, 0)) || 1;
    return v.map(q => q / n);
  }
  let kwsTpl = null;
  function kwsTemplates() {
    if (kwsTpl) return kwsTpl;
    kwsTpl = {};
    ['yes', 'no', 'stop'].forEach(w => {
      const acc = new Array(49 * KB).fill(0);
      for (let k = 0; k < 6; k++) kwsNorm(kwsSpectrogram(kwsSignal(w, 0.05, 900 + k)).S).forEach((q, i) => { acc[i] += q / 6; });
      const n = Math.sqrt(acc.reduce((a, q) => a + q * q, 0)) || 1;
      kwsTpl[w] = acc.map(q => q / n);
    });
    return kwsTpl;
  }
  function kwsScores(S) {                                 // a template matcher standing in for the small network
    const T = kwsTemplates(), v = kwsNorm(S), logits = [];
    ['yes', 'no', 'stop'].forEach(w => logits.push(8 * T[w].reduce((a, q, i) => a + q * v[i], 0)));
    logits.push(8 * 0.3);
    const m = Math.max.apply(null, logits), e = logits.map(l => Math.exp(l - m)), sum = e.reduce((a, b) => a + b, 0);
    return e.map(q => q / sum);
  }
  Hyper.sim('ml-kws', {
    title: 'From a word to a score',
    blurb: `A synthetic "word" (tones and hiss, not a real voice) goes through the stages of a keyword spotter. **Top**: the waveform, one second. **Strip**: the loudness of each 30 ms frame against the gate. **Picture**: the spectrogram, 49 frames by 16 bands (a real one might use 40 bands). **Bars**: the score of each word; the word counts only above the threshold.

The scoring here is a template matcher standing in for a small neural network: it compares the picture with the average picture of each word.

**Try this**
- Say each word in turn: *yes* rises and ends in a hiss, *no* falls, *stop* is two bursts.
- Raise the **background noise**: the picture fills with speckle, the scores drop and *nothing* takes over.
- Raise the **threshold**: fewer false accepts, but the noisy words are now rejected.
- Choose **nothing** and raise the noise: pure noise has no pattern for this matcher to latch onto, so nothing fires. A real spotter hears words in television chatter, and false accepts are the price of a low threshold.
- Raise the **gate**: in loud noise it never closes, so it saves no energy.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 1.05, maxH: 560 });
      let seed = 21, cache = null;
      const ctl = kit.controls(box.side, [
        { id: 'word', type: 'select', label: 'Spoken word', options: KWORDS.map(w => [w, w]), value: 'yes' },
        { id: 'noise', label: 'Background noise', min: 0, max: 1.5, step: 0.05, value: 0.15 },
        { id: 'thr', label: 'Decision threshold', min: 0.5, max: 0.99, step: 0.01, value: 0.7 },
        { id: 'gate', label: 'Loudness gate', min: 0, max: 0.4, step: 0.01, value: 0.06 },
        { type: 'buttons', items: [{ id: 'again', label: 'Record again', primary: true }] }
      ], (id) => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['raw', 'Raw samples in this picture'], ['feat', 'Numbers the network reads'], ['gate', 'Frames passing the gate'], ['best', 'Best word'], ['dec', 'Decision']]);
      function analyse() {
        const v = ctl.values, key = v.word + '|' + v.noise + '|' + seed;
        if (cache && cache.key === key) return cache;
        const x = kwsSignal(v.word, v.noise, seed * 131 + KWORDS.indexOf(v.word)), sp = kwsSpectrogram(x);
        return (cache = { key, x, S: sp.S, rms: sp.rms, sc: kwsScores(sp.S) });
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, A = analyse(), W = st.W, H = st.H;
        const ml = 46, mr = 12, pw = W - ml - mr;
        // the waveform
        let y = 24;
        kit.label(c, '1. the sound: ' + KN + ' samples in 1 s', ml, 10, { size: 11, color: C.text2, weight: 600 });
        const wh = H * 0.16;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ml, y, pw, wh);
        c.strokeStyle = kit.hue(212, 1); c.lineWidth = 1;
        c.beginPath();
        for (let px = 0; px < pw; px++) {
          const a = Math.floor(px / pw * KN), b = Math.max(a + 1, Math.floor((px + 1) / pw * KN));
          let lo = 9, hi = -9;
          for (let i = a; i < b; i++) { lo = Math.min(lo, A.x[i]); hi = Math.max(hi, A.x[i]); }
          const yy = q => y + wh / 2 - clamp(q, -1, 1) * wh / 2;
          c.moveTo(ml + px + 0.5, yy(hi)); c.lineTo(ml + px + 0.5, yy(lo) + 0.5);
        }
        c.stroke();
        // the gate strip
        y += wh + 20;
        kit.label(c, '2. loudness of each frame, against the gate', ml, y - 8, { size: 11, color: C.text2, weight: 600 });
        const gh = H * 0.07, nF = A.rms.length, cw = pw / nF;
        let pass = 0;
        A.rms.forEach((q, i) => {
          const open = q >= v.gate; if (open) pass++;
          const h = clamp(q / 0.5, 0, 1) * gh;
          c.fillStyle = open ? kit.hue(150, 0.9) : kit.hue(250, 0.35);
          c.fillRect(ml + i * cw + 0.5, y + gh - h, Math.max(1, cw - 1), h);
        });
        const gy = y + gh - clamp(v.gate / 0.5, 0, 1) * gh;
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(ml, gy); c.lineTo(ml + pw, gy); c.stroke(); c.setLineDash([]);
        // the spectrogram
        y += gh + 22;
        kit.label(c, '3. spectrogram: ' + nF + ' frames × ' + KB + ' bands', ml, y - 8, { size: 11, color: C.text2, weight: 600 });
        const sh = H * 0.3, ch = sh / KB;
        A.S.forEach((row, i) => row.forEach((q, b) => {
          c.fillStyle = kit.hue(28, 0.06 + 0.94 * Math.pow(q, 1.4));
          c.fillRect(ml + i * cw, y + sh - (b + 1) * ch, cw + 0.4, ch + 0.4);
        }));
        c.strokeStyle = C.axis; c.strokeRect(ml, y, pw, sh);
        kit.label(c, '0 s', ml, y + sh + 9, { size: 9.5, color: C.faint });
        kit.label(c, '1 s', ml + pw, y + sh + 9, { size: 9.5, color: C.faint, align: 'right' });
        // the scores
        y += sh + 30;
        kit.label(c, '4. the network: a score for each word', ml, y - 8, { size: 11, color: C.text2, weight: 600 });
        const rowH = Math.min(22, (H - y - 8) / 4), bx = ml + 54, bw = pw - 54 - 44;
        let best = 0;
        A.sc.forEach((q, i) => { if (q > A.sc[best]) best = i; });
        KWORDS.forEach((w, i) => {
          const yy = y + i * rowH, win = i === best;
          kit.label(c, w, ml + 48, yy + rowH / 2, { size: 11, align: 'right', color: win ? C.text : C.muted, weight: win ? 650 : 500 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, yy + 2, bw, rowH - 4);
          c.fillStyle = win ? (best < 3 && A.sc[i] >= v.thr ? C.ok : C.warn) : kit.hue(212, 0.6);
          c.fillRect(bx, yy + 2, bw * A.sc[i], rowH - 4);
          kit.label(c, A.sc[i].toFixed(2), bx + bw + 6, yy + rowH / 2, { size: 10.5, color: C.text2 });
        });
        const tx = bx + bw * v.thr;
        c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(tx, y); c.lineTo(tx, y + 3 * rowH); c.stroke(); c.setLineDash([]);
        kit.label(c, 'threshold', tx, y - 1, { size: 9.5, color: C.warn, align: 'center' });
        const heard = best < 3 && A.sc[best] >= v.thr;
        ro.set('raw', KN + ' samples (' + (KN * 2 / 1024).toFixed(0) + ' KB as 16-bit values)');
        ro.set('feat', nF + ' × ' + KB + ' = ' + nF * KB + ' (a real one: 49 × 40 = 1960)');
        ro.set('gate', pass + ' of ' + nF);
        ro.set('best', KWORDS[best] + ', ' + A.sc[best].toFixed(2));
        ro.set('dec', heard ? 'heard "' + KWORDS[best] + '"' + (KWORDS[best] === v.word ? '' : ' (a false accept)') : (v.word === 'nothing' ? 'nothing heard (correct)' : 'nothing heard' + (v.word === 'nothing' ? '' : ' (a false reject)')));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ml-anomaly */
  const AFS = 2000, AN = 128, AF0 = 50, AFH = 700;
  const ANAMES = ['strength', '50 Hz', '100 Hz', '700 Hz'];
  function goertzelAmp(x, f, fs) {
    const n = x.length, k = 2 * Math.cos(2 * Math.PI * f / fs);
    let s1 = 0, s2 = 0;
    for (let i = 0; i < n; i++) { const s0 = x[i] + k * s1 - s2; s2 = s1; s1 = s0; }
    return 2 * Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - k * s1 * s2)) / n;
  }
  function motorWindow(idx, fault, seed) {
    const r = rng(seed * 1000003 + idx * 7919 + 3), TAU = 2 * Math.PI, p0 = r() * TAU, p1 = r() * TAU, p2 = r() * TAU, x = [];
    for (let i = 0; i < AN; i++) {
      const t = i / AFS;
      x.push(Math.sin(TAU * AF0 * t + p0) + 0.3 * Math.sin(TAU * 2 * AF0 * t + p1) + 0.25 * gauss(r) + fault * Math.sin(TAU * AFH * t + p2));
    }
    const rms = Math.sqrt(x.reduce((a, q) => a + q * q, 0) / AN);
    return { x, f: [rms, goertzelAmp(x, AF0, AFS), goertzelAmp(x, 2 * AF0, AFS), goertzelAmp(x, AFH, AFS)] };
  }
  function erfApprox(x) { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; }
  Hyper.sim('ml-anomaly', {
    title: 'A motor that learns its normal',
    blurb: `A synthetic motor vibrates at 50 Hz with a second harmonic and some noise. The detector measures four features of every window (strength, and the amplitude at 50, 100 and 700 Hz), **learns** their mean and spread over the first windows, and then scores each new window by its distance from normal (the RMS of the four z-scores). An alarm needs the score above the threshold for *N* windows in a row; a triangle marks it, green if the fault was really on and red if not.

**Try this**
- Wait for the learning to finish, then press **Start the fault** with a strength of about 0.25: a 700 Hz component appears and the score jumps over the threshold.
- Lower the **fault strength** to 0.08: the fault hides inside the normal scatter, and a threshold low enough to catch it would raise false alarms.
- Lower the **threshold** to 1.5 and the windows in a row to 1: false alarms appear in normal running. Raise the persistence to 3 and most of them go.
- Shorten the **learning** to 10 windows: the spread is badly estimated, and the detector is jumpy.
- Start the fault *during* learning, then press *Learn again* with it still on: the fault becomes "normal".`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.95, maxH: 540 });
      const HL = 140;                                      // windows kept on the screen
      let idx = 0, seed = 4, acc = 0, faultOn = false, faultAt = -1, stats = null, hist = [], falseN = 0, det = null, over = 0, latch = false, last = null, learnBuf = [];
      const ctl = kit.controls(box.side, [
        { id: 'fault', label: 'Fault strength (700 Hz)', min: 0, max: 0.6, step: 0.01, value: 0.25 },
        { id: 'thr', label: 'Alarm threshold', min: 1, max: 8, step: 0.1, value: 3.5, unit: 'σ' },
        { id: 'need', label: 'Windows in a row', min: 1, max: 5, step: 1, value: 3 },
        { id: 'learn', label: 'Windows used to learn normal', min: 10, max: 150, step: 5, value: 50 },
        { type: 'buttons', items: [{ id: 'toggle', label: 'Start the fault', primary: true }, { id: 'reset', label: 'Learn again' }] }
      ], (id) => {
        if (id === 'toggle') { faultOn = !faultOn; if (faultOn && faultAt < 0) faultAt = idx; setBtn(); }
        if (id === 'reset' || id === 'learn') reset();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['score', 'Score now'], ['false', 'False alarms'], ['det', 'Fault detected'], ['bell', 'Bell-curve estimate, one feature']]);
      const setBtn = () => { const b = ctl.rows.toggle; if (b) b.textContent = faultOn ? 'Stop the fault' : 'Start the fault'; };
      function reset() { idx = 0; seed++; stats = null; hist = []; falseN = 0; det = null; over = 0; latch = false; last = null; learnBuf = []; faultAt = faultOn ? 0 : -1; }
      function stepWindow() {
        const v = ctl.values, L = v.learn, w = motorWindow(idx, faultOn ? v.fault : 0, seed);
        const item = { learning: idx < L, fault: faultOn && v.fault > 0, alarm: false, s: 0, z: [0, 0, 0, 0] };
        if (idx < L) { learnBuf.push(w.f); }
        else {
          if (!stats) {
            const n = learnBuf.length, mean = [0, 0, 0, 0], sd = [0, 0, 0, 0];
            learnBuf.forEach(f => f.forEach((q, j) => { mean[j] += q / n; }));
            learnBuf.forEach(f => f.forEach((q, j) => { sd[j] += (q - mean[j]) * (q - mean[j]) / n; }));
            stats = { mean, sd: sd.map(q => Math.max(Math.sqrt(q), 0.002)) };
          }
          item.z = w.f.map((q, j) => (q - stats.mean[j]) / stats.sd[j]);
          item.s = Math.sqrt(item.z.reduce((a, q) => a + q * q, 0) / 4);
          over = item.s > v.thr ? over + 1 : 0;
          if (over >= v.need && !latch) {
            latch = true; item.alarm = true;
            if (item.fault) { if (det == null) det = idx - faultAt; } else falseN++;
          }
          if (item.s <= v.thr) latch = false;
        }
        last = { w, item };
        hist.push(item);
        if (hist.length > HL) hist.shift();
        idx++;
      }
      const loop = kit.loop((dt) => {
        acc += dt * 10;
        let guard = 0;
        while (acc >= 1 && guard++ < 6) { acc -= 1; stepWindow(); }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const ml = 46, mr = 12, pw = W - ml - mr;
        // the latest window
        const wh = H * 0.14;
        kit.label(c, 'the latest window: ' + AN + ' samples, ' + Math.round(AN / AFS * 1000) + ' ms', ml, 10, { size: 11, color: C.text2, weight: 600 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ml, 22, pw, wh);
        if (last) {
          c.strokeStyle = kit.hue(212, 1); c.lineWidth = 1.2; c.beginPath();
          last.w.x.forEach((q, i) => { const x = ml + i / (AN - 1) * pw, y = 22 + wh / 2 - clamp(q, -2.4, 2.4) / 2.4 * wh / 2; if (i) c.lineTo(x, y); else c.moveTo(x, y); });
          c.stroke();
        }
        // the score trace
        const sy = 22 + wh + 30, sh = H * 0.36, smax = 10, Y = q => sy + sh - clamp(q, 0, smax) / smax * sh;
        kit.label(c, 'score = distance from normal (older on the left)', ml, sy - 9, { size: 11, color: C.text2, weight: 600 });
        const slot = pw / HL, first = idx - hist.length;
        hist.forEach((h, i) => {
          const x = ml + (HL - hist.length + i) * slot;
          if (h.fault) { c.fillStyle = kit.hue(8, 0.14); c.fillRect(x, sy, slot + 0.5, sh); }
          if (h.learning) { c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(x, sy, slot + 0.5, sh); }
        });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ml, sy, pw, sh);
        c.strokeStyle = C.warn; c.lineWidth = 1.3; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(ml, Y(v.thr)); c.lineTo(ml + pw, Y(v.thr)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'threshold ' + kit.fmt(v.thr, 2) + ' σ', ml + pw - 4, Y(v.thr) - 8, { size: 10, color: C.warn, align: 'right' });
        c.strokeStyle = C.accent; c.lineWidth = 1.7; c.beginPath();
        let started = false;
        hist.forEach((h, i) => {
          if (h.learning) return;
          const x = ml + (HL - hist.length + i + 0.5) * slot, y = Y(h.s);
          if (started) c.lineTo(x, y); else { c.moveTo(x, y); started = true; }
        });
        c.stroke();
        hist.forEach((h, i) => {
          if (!h.alarm) return;
          const x = ml + (HL - hist.length + i + 0.5) * slot;
          c.fillStyle = h.fault ? C.ok : C.bad;
          c.beginPath(); c.moveTo(x, sy + 2); c.lineTo(x - 6, sy - 9); c.lineTo(x + 6, sy - 9); c.closePath(); c.fill();
        });
        kit.label(c, 'grey: learning · tint: fault on · ▲: alarm', ml, sy + sh + 11, { size: 9.5, color: C.faint });
        // the z-scores of the latest window
        const zy = sy + sh + 34, rowH = Math.min(20, (H - zy - 8) / 4), bx = ml + 60, bw = pw - 60 - 40;
        kit.label(c, 'z-score of each feature in the latest window', ml, zy - 9, { size: 11, color: C.text2, weight: 600 });
        ANAMES.forEach((nm, j) => {
          const y = zy + j * rowH, z = last ? last.item.z[j] : 0, big = Math.abs(z) > v.thr;
          kit.label(c, nm, ml + 54, y + rowH / 2, { size: 10.5, color: C.muted, align: 'right' });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, y + 2, bw, rowH - 4);
          c.fillStyle = big ? C.bad : kit.hue(212, 0.7);
          c.fillRect(bx, y + 2, bw * clamp(Math.abs(z), 0, 12) / 12, rowH - 4);
          kit.label(c, z.toFixed(1), bx + bw + 6, y + rowH / 2, { size: 10, color: C.text2 });
        });
        const learning = idx < v.learn;
        ro.set('state', learning ? 'learning normal: ' + idx + ' of ' + v.learn + ' windows' : faultOn ? 'watching, fault is on' : 'watching, normal running');
        ro.set('score', last && !learning ? kit.fmt(last.item.s, 3) + ' σ' : '—');
        ro.set('false', String(falseN));
        ro.set('det', det != null ? 'yes, after ' + det + ' windows (' + kit.fmt(det / 10, 2) + ' s here)' : faultOn ? 'not yet' : 'no fault yet');
        ro.set('bell', kit.fmt(345600 * (1 - erfApprox(v.thr / Math.SQRT2)), 3) + ' a day at 4 windows a second');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ml-cloud */
  Hyper.sim('ml-cloud', {
    title: 'On the chip or in the cloud?',
    blurb: `One request, added up phase by phase. **On the chip**: the model runs locally. **In the cloud**: the device joins Wi-Fi, negotiates TLS, uploads the data, waits for the server and receives the answer. The upper pair of bars is time, the lower pair is energy (supply voltage times current times time, at 3.3 V). The readouts also give the battery life at the request rate you set.

The currents are yours to measure: the catalogue lists the transmit peak and the receive current of the chip, and your averages will differ.

**Try this**
- Send **features** instead of **audio**: the upload shrinks, but the connection set-up stays.
- Set the **connection set-up** to 0, as if the connection stayed open: the cloud's latency drops to a few hundred milliseconds.
- Make the **chip model** slower than the cloud round trip: at some point the cloud wins on time, still not on energy.
- Lower the **uplink** to 0.2 Mbit/s, a weak signal: audio takes seconds.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 440 });
      const chips = E.CHIPS.filter(c => !c.coproc && c.wifi);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [shortName(c), c.id]), value: 'esp32-s3' },
        { id: 'bytes', type: 'select', label: 'What is sent', options: [['features, 2 KB', 2048], ['one second of audio, 32 KB', 32768], ['a small JPEG, 15 KB', 15360], ['a large JPEG, 60 KB', 61440]], value: 32768 },
        { id: 'mbps', label: 'Effective uplink', min: 0.2, max: 20, value: 2, log: true, unit: 'Mbit/s', sig: 2 },
        { id: 'conn', label: 'Wi-Fi connection set-up', min: 0, max: 5, step: 0.1, value: 2, unit: 's' },
        { id: 'tls', label: 'TLS handshake', min: 100, max: 2000, step: 50, value: 600, unit: 'ms' },
        { id: 'srv', label: 'Server time', min: 50, max: 3000, value: 400, log: true, unit: 'ms', sig: 2 },
        { id: 'local', label: 'Model time on the chip', min: 1, max: 2000, value: 50, log: true, unit: 'ms', sig: 2 },
        { id: 'iRadio', label: 'Current, radio busy', min: 50, max: 350, step: 5, value: 160, unit: 'mA' },
        { id: 'iCpu', label: 'Current, model running', min: 20, max: 150, step: 5, value: 60, unit: 'mA' },
        { id: 'perHour', label: 'Requests per hour', min: 1, max: 3600, value: 12, log: true, sig: 2 },
        { id: 'mAh', label: 'Battery capacity', min: 100, max: 5000, step: 100, value: 2000, unit: 'mAh' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['lat', 'Latency: chip · cloud'], ['en', 'Energy per request: chip · cloud'], ['bat', 'Battery life: chip · cloud'], ['cat', 'Catalogue for this chip']]);
      const PH = [['Wi-Fi join', 28], ['TLS', 286], ['upload', 205], ['server', 150], ['answer', 70]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, ch = E.chip(v.chip) || chips[0], W = st.W, H = st.H;
        const iListen = ch.rxMa != null ? ch.rxMa : 90, iSleep = (ch.sleepUa != null ? ch.sleepUa : 10) / 1000;
        const up = v.bytes * 8 / (v.mbps * 1e6) * 1000;
        const t = [v.conn * 1000, v.tls, up, v.srv, 20], cur = [v.iRadio, v.iRadio, v.iRadio, iListen, iListen];
        const tCloud = t.reduce((a, b) => a + b, 0), eCloud = t.reduce((a, q, i) => a + 3.3 * cur[i] * q / 1000, 0);
        const tLocal = v.local, eLocal = 3.3 * v.iCpu * v.local / 1000;
        const period = 3600 / v.perHour * 1000;                // ms between requests
        const avg = (act, e) => { const T = Math.max(period, act); return (e / 3.3 + iSleep * (T - act) / 1000) / (T / 1000); };   // mA
        const aLocal = avg(tLocal, eLocal), aCloud = avg(tCloud, eCloud);
        const life = a => { const r = E.batteryLife(v.mAh, Math.max(a, 1e-6), { cell: '18650' }); return r && isFinite(r.days) ? r.days : 0; };
        const fmtDays = d => (d >= 730 ? kit.fmt(d / 365, 3) + ' years' : d >= 2 ? kit.fmt(d, 3) + ' days' : kit.fmt(d * 24, 3) + ' hours');
        const lx = Math.min(98, W * 0.22), x0 = lx + 6, bw = W - x0 - 12;
        const block = (y0, title, localV, cloudV, fmt) => {
          kit.label(c, title, 8, y0 - 12, { size: 11.5, color: C.text2, weight: 600 });
          const lt = localV, ct = cloudV.reduce((a, b) => a + b, 0), mx = Math.max(lt, ct, 1e-9), sc = bw / mx, bh = 24;
          kit.label(c, 'On the chip', lx, y0 + bh / 2, { size: 11, align: 'right' });
          c.fillStyle = kit.hue(8, 0.85); c.fillRect(x0, y0, Math.max(2, lt * sc), bh);
          kit.label(c, fmt(lt), x0 + Math.max(2, lt * sc) + 6, y0 + bh / 2, { size: 10.5, weight: 650 });
          const y1 = y0 + bh + 8;
          kit.label(c, 'In the cloud', lx, y1 + bh / 2, { size: 11, align: 'right' });
          let x = x0;
          cloudV.forEach((q, i) => {
            const w = q * sc;
            c.fillStyle = kit.hue(PH[i][1], 0.85); c.fillRect(x, y1, Math.max(0, w), bh);
            x += w;
          });
          kit.label(c, fmt(ct), Math.min(x + 6, W - 70), y1 + bh / 2, { size: 10.5, weight: 650, align: x + 6 > W - 70 ? 'right' : 'left', color: x + 6 > W - 70 ? C.text : C.text });
          return y1 + bh;
        };
        const yb = block(34, 'Time of one request', tLocal, t, fmtMs);
        const eMJ = t.map((q, i) => 3.3 * cur[i] * q / 1000);
        const yb2 = block(yb + 44, 'Energy of one request', eLocal, eMJ, e => kit.fmt(e, 3) + ' mJ');
        // the legend
        let lx2 = 8, ly = yb2 + 22;
        PH.forEach(([nm, hue]) => {
          const wlab = 22 + nm.length * 6.4;
          if (lx2 + wlab > W - 8) { lx2 = 8; ly += 16; }
          c.fillStyle = kit.hue(hue, 0.85); c.fillRect(lx2, ly - 5, 10, 10);
          kit.label(c, nm, lx2 + 14, ly, { size: 10, color: C.text2 });
          lx2 += wlab + 8;
        });
        if (ly + 16 < H) kit.label(c, 'current: radio busy ' + v.iRadio + ' mA · listening ' + iListen + ' mA · model ' + v.iCpu + ' mA', 8, Math.min(H - 8, ly + 18), { size: 10, color: C.faint });
        ro.set('lat', fmtMs(tLocal) + ' · ' + fmtMs(tCloud) + '  (' + kit.fmt(tCloud / Math.max(tLocal, 1e-6), 2) + ' ×)');
        ro.set('en', kit.fmt(eLocal, 3) + ' mJ · ' + kit.fmt(eCloud, 3) + ' mJ  (' + kit.fmt(eCloud / Math.max(eLocal, 1e-9), 2) + ' ×)');
        ro.set('bat', fmtDays(life(aLocal)) + ' · ' + fmtDays(life(aCloud)) + (tCloud > period ? '  (cloud cannot keep up)' : ''));
        ro.set('cat', (ch.txMa != null ? ch.txMa + ' mA transmit peak' : 'no transmit figure') + (ch.rxMa != null ? ', ' + ch.rxMa + ' mA receive' : '') + (ch.sleepUa != null ? ', ' + ch.sleepUa + ' µA deep sleep' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
