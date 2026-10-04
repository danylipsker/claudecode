/* HYPER-OPTICS · sims/scanning-methods.js — simulations for the topic "Scanning devices" (prefix sm-).
 *   sm-build-picture  one spot, one line or a whole array building the same picture: time, light and noise per pixel
 *   sm-raster-vector  a spot drawing a raster (with flyback, or both ways) or the outline of a figure: path and time
 *   sm-galvo          a galvanometer mirror: the beam turns by twice the angle; the closed-loop step response
 *   sm-polygon        a spinning polygon: angle per facet, line rate, duty cycle, tilt errors (animated)
 *   sm-resonant       a sinusoidal mirror (uneven pixels) and a two-axis Lissajous scan
 *   sm-aod            an acousto-optic deflector: sound wave, Bragg angle, sweep, spots, access time (animated)
 *   sm-risley         two rotating wedges: arrows that add, circles, lines and roses (animated)
 *   sm-ftheta         an ordinary scan lens against an f-theta lens and a telecentric one
 *   sm-resolvable     the number of resolvable spots: angle, beam, wavelength, criterion
 *   sm-distortion     the two-mirror head traced exactly on a flat target, and a look-up-table correction
 *   sm-sync           start-of-scan, pixel clock and the ragged edge of an unsynchronized scan (animated)
 * Numbers come from kit.optics (O.scan, O.beam, O.prism, O.index …), the drawing from kit.osym. Where a quantity
 * has no engine function (a second-order step response, mirror reflection in three dimensions, Lissajous coverage)
 * a small local helper does the arithmetic.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const grp = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const fx = (v, d) => Number.isFinite(v) ? v.toFixed(d) : '–';
  // a deterministic pseudo-random number in [0, 1) from two integers, and a roughly normal one (standard deviation 1)
  const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const gauss = (a, b) => (hash(a, b) + hash(a + 17, b + 3) + hash(a + 5, b + 29) - 1.5) * 2;
  const tfmt = t => !Number.isFinite(t) ? '–' : Math.abs(t) < 1e-6 ? fx(t * 1e9, 0) + ' ns' : Math.abs(t) < 1e-3 ? fx(t * 1e6, t < 1e-5 ? 2 : 1) + ' µs' : Math.abs(t) < 1 ? fx(t * 1e3, t < 1e-2 ? 2 : 1) + ' ms' : fx(t, 2) + ' s';
  const lfmt = m => Math.abs(m) < 1e-3 ? fx(m * 1e6, 1) + ' µm' : Math.abs(m) < 1 ? fx(m * 1e3, Math.abs(m) < 1e-2 ? 2 : 1) + ' mm' : fx(m, 2) + ' m';
  const grey = v => { const g = Math.round(255 * clamp(v, 0, 1)); return 'rgb(' + g + ',' + g + ',' + Math.min(255, g + 6) + ')'; };

  /* ================================================================ a picture built in time */
  // the scene: a bright disc with a dark ring, five bars, a diagonal stripe and a graded square
  function scene(u, v) {
    let b = 0.2 + 0.12 * (1 - v);
    const d1 = Math.hypot(u - 0.3, v - 0.33);
    if (d1 < 0.16) b = 0.96; else if (d1 < 0.205) b = 0.04;
    if (u > 0.56 && u < 0.93 && v > 0.14 && v < 0.5) b = Math.floor((u - 0.56) / 0.074) % 2 === 0 ? 0.92 : 0.06;
    if (u > 0.1 && u < 0.5 && Math.abs((v - 0.9) + 0.55 * (u - 0.1)) < 0.025) b = 0.88;
    if (u > 0.58 && u < 0.9 && v > 0.62 && v < 0.88) b = 0.15 + 0.8 * (u - 0.58) / 0.32;
    return b;
  }

  Hyper.sim('sm-build-picture', {
    title: 'Building a picture one spot at a time',
    blurb: `The same scene (left) is taken three ways, and the picture (right) is built as time passes. **One spot, one detector** reads the scene in a raster, pixel after pixel; a **line of detectors** reads a whole row at a time; a **staring array** exposes all the pixels together. The frame is shown in slow motion; the read-outs give the real times.

**Try this**
- In *one spot* mode watch the dwell time: at 1 frame a second with 32 × 32 pixels each pixel gets about 0.8 ms, only about a thousandth of the light a staring array collects in the same frame. At the start value of the light the picture is noisy; raise the light and it clears.
- Switch to *line scan*: a row at a time gives each pixel about 40 times as long, and the picture is much cleaner at the same light.
- Raise the frame rate to 30: the dwell time falls to tens of microseconds and the scanned picture dissolves into noise, while the array hardly changes.
- Lower the active share of each line: in scanning mode the spot spends part of every line returning (flyback), which cuts the dwell further.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 400 });
      let clk = 0, cache = { key: '', samp: null };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'How the picture is taken', options: [['One spot, one detector (scanning)', 'spot'], ['A line of detectors (line scan)', 'line'], ['All pixels at once (staring array)', 'stare']], value: params.mode || 'spot' },
        { id: 'N', label: 'Pixels per line (and lines)', min: 16, max: 64, step: 8, value: params.N || 32 },
        { id: 'fps', label: 'Frame rate', min: 0.1, max: 100, value: params.fps || 1, log: true, sig: 2, unit: 'frames/s' },
        { id: 'eta', label: 'Active share of each line (scanning)', min: 50, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'P', label: 'Light: photons per pixel in one frame of an array', min: 1e3, max: 1e7, value: params.P || 3e4, log: true, sig: 2 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['px', 'Pixels in a frame'], ['rate', 'Lines a second'], ['dwell', 'Each pixel is exposed for'], ['rel', 'Light per pixel, against a staring array'], ['det', 'Detectors needed'], ['slow', 'Shown in slow motion']]);
      const T = 6, HOLD = 1.4;
      // what each pixel records: the scene plus photon noise that depends on the light the pixel collected
      const exposure = () => {
        const N = V.N, eta = V.eta / 100, tf = 1 / V.fps;
        if (V.mode === 'spot') return { rel: eta / (N * N), t: Sc.pixelDwell(V.fps * N, N, eta), det: 1 };
        if (V.mode === 'line') return { rel: 1 / N, t: tf / N, det: N };
        return { rel: 1, t: tf, det: N * N };
      };
      const samples = () => {
        const ex = exposure(), key = [V.mode, V.N, V.P, V.eta, V.fps].join();
        if (cache.key !== key) {
          const N = V.N, P = V.P * ex.rel, a = new Float32Array(N * N);
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
            const b = scene((i + 0.5) / N, (j + 0.5) / N);
            a[j * N + i] = clamp(b + gauss(i + 1, j + 1) * Math.sqrt(Math.max(b, 0.03) / Math.max(P, 1)), 0, 1);
          }
          cache = { key, samp: a };
        }
        return cache.samp;
      };
      const loop = kit.loop(dt => {
        clk = (clk + dt) % (T + HOLD);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const N = V.N, eta = V.eta / 100, p = clamp(clk / T, 0, 1), samp = samples(), ex = exposure();
        const gap = 14, pw = (W - 3 * gap) / 2, side = Math.max(60, Math.min(pw, Hh - 78)), y0 = 30;
        const lx = gap + (pw - side) / 2, rx = 2 * gap + pw + (pw - side) / 2, cw = side / N;
        // the scene
        S.image(c, lx, y0, side, side, 64, 64, (u, v) => scene(u, v), { key: 'sm-scene', id: 'sm-scene' });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, y0 + 0.5, side, side);
        // the picture: cells that have been read so far
        c.fillStyle = C.bg2; c.fillRect(rx, y0, side, side);
        const L = p * N, rows = Math.floor(L), q = L - rows;
        const cols = V.mode === 'spot' ? (q < eta ? Math.floor(q / eta * N) : N) : N;
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          let on = false, g = 1;
          if (V.mode === 'stare') { on = p > 0; g = clamp(p / 0.9, 0, 1); }
          else if (V.mode === 'line') on = j <= rows && p > 0;
          else on = j < rows || (j === rows && i < cols);
          if (!on) continue;
          c.fillStyle = grey(samp[j * N + i] * g); c.fillRect(rx + i * cw, y0 + j * cw, cw + 0.6, cw + 0.6);
        }
        c.strokeStyle = C.axis; c.strokeRect(rx + 0.5, y0 + 0.5, side, side);
        // the scanner on the scene
        if (p < 1 && p > 0) {
          if (V.mode === 'spot') {
            const row = Math.min(rows, N - 1), sx = q < eta ? q / eta : 1 - (q - eta) / Math.max(1e-6, 1 - eta);
            c.fillStyle = C.warn; c.globalAlpha = 0.18; c.fillRect(lx, y0 + row * cw, side, cw); c.globalAlpha = 1;
            kit.dot(c, lx + sx * side, y0 + (row + 0.5) * cw, Math.max(3, cw * 0.55), q < eta ? C.warn : C.faint, C.text);
          } else if (V.mode === 'line') {
            const row = Math.min(rows, N - 1);
            c.fillStyle = C.warn; c.globalAlpha = 0.35; c.fillRect(lx, y0 + row * cw, side, Math.max(2, cw)); c.globalAlpha = 1;
          } else { c.strokeStyle = C.warn; c.lineWidth = 3; c.strokeRect(lx + 1.5, y0 + 1.5, side - 2, side - 2); }
        }
        kit.label(c, 'the scene', lx + side / 2, y0 - 12, { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, 'the picture', rx + side / 2, y0 - 12, { align: 'center', color: C.muted, size: 12, weight: 650 });
        // progress along the frame
        const by = y0 + side + 18;
        c.fillStyle = C.bg2; c.fillRect(gap, by, W - 2 * gap, 5); c.fillStyle = C.accent; c.fillRect(gap, by, (W - 2 * gap) * p, 5);
        kit.label(c, 'one frame: ' + tfmt(1 / V.fps) + ' for real, ' + fx(T, 0) + ' s here', W / 2, by + 20, { align: 'center', color: C.muted, size: 11.5 });
        ro.set('px', grp(N * N) + ' (' + N + ' lines of ' + N + ')');
        ro.set('rate', grp(V.fps * N) + ' a second');
        ro.set('dwell', tfmt(ex.t) + (V.mode === 'spot' ? '  (spot on the pixel)' : V.mode === 'line' ? '  (row exposure)' : '  (the whole frame)'));
        ro.set('rel', ex.rel >= 1 ? '100 %' : ex.rel >= 0.01 ? fx(100 * ex.rel, 1) + ' %' : '1/' + grp(1 / ex.rel));
        ro.set('det', grp(ex.det) + (ex.det === 1 ? ' detector' : ' detectors'));
        ro.set('slow', '× ' + fx(T * V.fps, V.fps * T < 10 ? 1 : 0));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ raster and vector */
  const HOUSE = [
    [[0.14, 0.88], [0.14, 0.46], [0.5, 0.12], [0.86, 0.46], [0.86, 0.88], [0.14, 0.88]],
    [[0.42, 0.88], [0.42, 0.62], [0.58, 0.62], [0.58, 0.88]],
    [[0.24, 0.54], [0.36, 0.54], [0.36, 0.66], [0.24, 0.66], [0.24, 0.54]],
    [[0.64, 0.54], [0.76, 0.54], [0.76, 0.66], [0.64, 0.66], [0.64, 0.54]]
  ];
  const distSeg = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy, t = l2 ? clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1) : 0; return Math.hypot(px - ax - t * dx, py - ay - t * dy); };

  Hyper.sim('sm-raster-vector', {
    title: 'Raster and vector scans drawing the same figure',
    blurb: `A spot draws a house on a field 100 mm wide. A **raster** visits every line and switches the beam on only where the figure is; a **vector** scan follows the outline and jumps, with the beam off, between strokes. The bright path is the beam on, the dashed path is the beam off (flyback or jump). Everything is in slow motion; the read-outs give the real times at the spot speed you set.

**Try this**
- Choose *Raster, one way* and watch the flyback: when the return takes 20 % of a line time, about a sixth of the whole time is lost. Switch to *both ways*: it is gone (in a real scanner the two directions must then be kept in register).
- Switch to *Vector*: the same house takes a small fraction of the time. Raise the number of lines to 64: the raster gets slower, the vector scan does not change.
- Look at the ratio read-out: at the default 24 lines the raster is about 6 times slower than the vector scan, at 64 lines about 17 times. A real marker uses a line pitch of 0.1 mm, 1000 lines, and the ratio is in the hundreds.
- Make the spot slower: the times grow in proportion, the ratio does not.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280, maxH: 420 });
      let clk = 0, segs = [], total = 0, mask = null, maskKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Scan', options: [['Raster, one way (with flyback)', 'uni'], ['Raster, both ways', 'bi'], ['Vector: follow the outline', 'vec']], value: params.mode || 'uni' },
        { id: 'M', label: 'Lines in the raster', min: 8, max: 64, step: 1, value: params.M || 24 },
        { id: 'fb', label: 'Flyback time, share of a line', min: 5, max: 50, step: 1, value: 20, unit: '%' },
        { id: 'v', label: 'Spot speed', min: 1, max: 20, step: 0.5, value: params.v || 5, unit: 'm/s' }
      ], () => { build(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pitch', 'Line pitch in a 100 mm field'], ['ras', 'Raster of the whole field'], ['vec', 'Vector scan of the outline'], ['ratio', 'The raster is slower by'], ['lost', 'Time lost to flyback'], ['slow', 'Shown in slow motion']]);
      const JUMP = 3;                                        // jumps between strokes go three times faster than drawing
      const strokeLen = HOUSE.map(s => s.reduce((a, p, i) => i ? a + Math.hypot(p[0] - s[i - 1][0], p[1] - s[i - 1][1]) : 0, 0));
      const S_ON = strokeLen.reduce((a, b) => a + b, 0);
      let S_JUMP = 0; for (let k = 1; k < HOUSE.length; k++) S_JUMP += Math.hypot(HOUSE[k][0][0] - HOUSE[k - 1][HOUSE[k - 1].length - 1][0], HOUSE[k][0][1] - HOUSE[k - 1][HOUSE[k - 1].length - 1][1]);
      const times = () => { const M = V.M, fb = V.fb / 100, tu = 0.1 / V.v; return { rasUni: M * (1 + fb) * tu, rasBi: M * tu, vec: (S_ON + S_JUMP / JUMP) * tu, tu }; };
      // the set of dots a raster writes: rows × columns, on where the outline passes within about a line pitch
      const getMask = () => {
        const M = V.M, key = String(M);
        if (maskKey !== key) {
          const C = 140, a = new Uint8Array(M * C), th = Math.max(0.011, 0.55 / M);
          for (let j = 0; j < M; j++) for (let i = 0; i < C; i++) {
            const x = (i + 0.5) / C, y = (j + 0.5) / M; let m = 1e9;
            for (const s of HOUSE) for (let k = 1; k < s.length; k++) m = Math.min(m, distSeg(x, y, s[k - 1][0], s[k - 1][1], s[k][0], s[k][1]));
            a[j * C + i] = m < th ? 1 : 0;
          }
          mask = { a, C }; maskKey = key;
        }
        return mask;
      };
      // the path as pieces: { x0, y0, x1, y1, on, dur } with durations in units of one line's forward time
      function build() {
        segs = []; const M = V.M, fb = V.fb / 100;
        if (V.mode === 'vec') {
          let px = HOUSE[0][0][0], py = HOUSE[0][0][1];
          HOUSE.forEach((s, k) => {
            if (k) { const d = Math.hypot(s[0][0] - px, s[0][1] - py); segs.push({ x0: px, y0: py, x1: s[0][0], y1: s[0][1], on: false, dur: d / JUMP }); }
            for (let i = 1; i < s.length; i++) { const d = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); segs.push({ x0: s[i - 1][0], y0: s[i - 1][1], x1: s[i][0], y1: s[i][1], on: true, dur: d }); }
            px = s[s.length - 1][0]; py = s[s.length - 1][1];
          });
        } else {
          for (let j = 0; j < M; j++) {
            const y = (j + 0.5) / M, fwd = V.mode === 'bi' ? j % 2 === 0 : true, ya = (j + 1.5) / M;
            segs.push({ x0: fwd ? 0 : 1, y0: y, x1: fwd ? 1 : 0, y1: y, on: true, dur: 1, row: j, fwd });
            if (j < M - 1) { if (V.mode === 'bi') segs.push({ x0: fwd ? 1 : 0, y0: y, x1: fwd ? 1 : 0, y1: ya, on: false, dur: 0.02 }); else segs.push({ x0: 1, y0: y, x1: 0, y1: ya, on: false, dur: fb }); }
          }
        }
        total = segs.reduce((a, s) => a + s.dur, 0);
      }
      build();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const M = V.M, fb = V.fb / 100, tm = times();
        const side = Math.max(80, Math.min(W - 24, Hh - 60)), fx0 = (W - side) / 2, fy0 = 28;
        const unitsPerSec = Math.max(3, M * (1 + fb) / 9);                 // one frame of the slowest raster takes about nine seconds
        clk = (clk + dt * unitsPerSec) % (total + 1.2 * unitsPerSec);
        const pos = Math.min(clk, total);
        c.fillStyle = C.bg2; c.fillRect(fx0, fy0, side, side);
        const X = u => fx0 + u * side, Y = v => fy0 + v * side;
        // what has been travelled
        let acc = 0, head = null;
        const faint = [], dashed = [];
        for (const s of segs) {
          const f = clamp((pos - acc) / Math.max(1e-9, s.dur), 0, 1);
          if (f > 0) {
            const x1 = s.x0 + (s.x1 - s.x0) * f, y1 = s.y0 + (s.y1 - s.y0) * f;
            if (V.mode === 'vec') { if (s.on) { c.strokeStyle = C.ok; c.lineWidth = 2.2; c.beginPath(); c.moveTo(X(s.x0), Y(s.y0)); c.lineTo(X(x1), Y(y1)); c.stroke(); } else dashed.push([s.x0, s.y0, x1, y1]); }
            else if (s.on) { faint.push([s.x0, s.y0, x1, y1]); }
            else dashed.push([s.x0, s.y0, x1, y1]);
            if (f < 1 || pos >= total) head = [x1, y1, s];
          }
          acc += s.dur; if (acc >= pos && pos < total) break;
        }
        if (V.mode !== 'vec') {
          c.strokeStyle = C.faint; c.globalAlpha = 0.35; c.lineWidth = 1; c.beginPath();
          for (const l of faint) { c.moveTo(X(l[0]), Y(l[1])); c.lineTo(X(l[2]), Y(l[3])); } c.stroke(); c.globalAlpha = 1;
          // the dots written where the outline crosses each line
          const mk = getMask(), cw = side / mk.C, rh = side / M; let a2 = 0;
          c.fillStyle = C.ok;
          for (const s of segs) {
            if (!s.on) { a2 += s.dur; continue; }
            const f = clamp((pos - a2) / s.dur, 0, 1); a2 += s.dur;
            if (f <= 0) continue;
            for (let i = 0; i < mk.C; i++) {
              const u = (i + 0.5) / mk.C, prog = s.fwd ? u : 1 - u;
              if (prog > f) continue;
              if (mk.a[s.row * mk.C + i]) c.fillRect(fx0 + u * side - cw / 2, fy0 + (s.row + 0.5) * rh - Math.max(1.1, rh * 0.42), Math.max(1.8, cw), Math.max(2.2, rh * 0.84));
            }
          }
        }
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        for (const l of dashed) { c.moveTo(X(l[0]), Y(l[1])); c.lineTo(X(l[2]), Y(l[3])); } c.stroke(); c.setLineDash([]);
        if (head) kit.dot(c, X(head[0]), Y(head[1]), 4.5, head[2].on ? C.warn : C.faint, C.text);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(fx0 + 0.5, fy0 + 0.5, side, side);
        kit.label(c, V.mode === 'vec' ? 'vector: beam on along strokes' : V.mode === 'bi' ? 'raster, both directions' : 'raster, flyback dashed', W / 2, fy0 - 12, { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, 'field 100 mm', W / 2, fy0 + side + 13, { align: 'center', color: C.faint, size: 11 });
        // numbers
        const ratio = (V.mode === 'bi' ? tm.rasBi : tm.rasUni) / tm.vec;
        ro.set('pitch', fx(100 / M, 2) + ' mm  (' + M + ' lines)');
        ro.set('ras', lfmt(M * 0.1 * (V.mode === 'bi' ? 1 : 1)) + ' of path, ' + tfmt(V.mode === 'bi' ? tm.rasBi : tm.rasUni));
        ro.set('vec', lfmt((S_ON) * 0.1) + ' drawn + ' + lfmt(S_JUMP * 0.1) + ' of jumps, ' + tfmt(tm.vec));
        ro.set('ratio', '× ' + fx(ratio, ratio < 100 ? 1 : 0));
        ro.set('lost', V.mode === 'uni' ? fx(100 * fb / (1 + fb), 0) + ' % of the raster time' : V.mode === 'bi' ? 'none (both sweeps carry picture)' : 'jumps: ' + fx(100 * (S_JUMP / JUMP) / (S_ON + S_JUMP / JUMP), 0) + ' % of the vector time');
        ro.set('slow', '× ' + fx(10 * V.v / unitsPerSec, 0) + ' slower than real');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ a galvanometer mirror */
  // the unit step response of a second-order loop with natural angular frequency wn and damping ratio z
  function stepResp(t, wn, z) {
    if (t <= 0) return 0;
    if (z < 0.9999) { const wd = wn * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + z * wn / wd * Math.sin(wd * t)); }
    if (z < 1.0001) return 1 - (1 + wn * t) * Math.exp(-wn * t);
    const r = Math.sqrt(z * z - 1), s1 = -wn * (z - r), s2 = -wn * (z + r);
    return 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
  }

  Hyper.sim('sm-galvo', {
    title: 'A galvanometer mirror: twice the angle, and the settling after a jump',
    blurb: `Above: a beam meets a mirror that turns about its pivot. Turn it by α and the reflected beam turns by **2α**; the spot on a target 300 mm away moves by L tan 2α. Below: how the closed servo loop follows a sudden jump of the command, as a second-order system with the natural frequency and damping you choose.

**Try this**
- Drag the spot on the target (or use the slider): the mirror turns by half the beam's angle. At 10° of mirror the beam is at 20° and the spot 109 mm off the axis.
- In the step response, raise the damping ratio from 0.7 to 1.5: the overshoot disappears but the settling is slower. Lower it to 0.3 and the mirror rings.
- Raise the natural frequency: the settling time falls in proportion. A smaller, lighter mirror allows a higher natural frequency of the loop; a large one has to settle more slowly.
- Tighten the tolerance from 5 % to 0.5 %: the *settling time* grows, because the ringing has to die away further.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 330 });
      const plot = kit.plot(box.stage, { x: { label: 'time (ms)', name: 't', min: 0, max: 1 }, y: { label: 'share of step', name: 'y', min: 0, max: 1.4 }, series: [] }, 150);
      const L = 300;
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Mirror angle α (mechanical)', min: -20, max: 20, step: 0.1, value: params.a != null ? params.a : 10, unit: '°' },
        { id: 'fn', label: 'Natural frequency of the loop', min: 0.3, max: 5, value: params.fn || 2, log: true, sig: 2, unit: 'kHz' },
        { id: 'z', label: 'Damping ratio', min: 0.2, max: 1.6, step: 0.05, value: params.z || 0.7 },
        { id: 'tol', label: 'Settling tolerance', min: 0.5, max: 5, step: 0.5, value: 1, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Mirror turns by α'], ['th', 'Beam turns by 2α'], ['x', 'Spot on the target, 300 mm away'], ['ts', 'Settling time after a step'], ['os', 'Overshoot'], ['fn', 'Natural frequency']]);
      kit.drag(st, {
        hover: true,
        hit: p => p.y < st.H * 0.7 ? 'spot' : null,
        move: (w, p) => { const x = 0.5 * Math.atan((p.x - st.W * 0.44) / (st.H * 0.68)) * R2D; ctl.set('a', clamp(Math.round(x * 10) / 10, -20, 20)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const al = V.a * D2R, px = W * 0.44, py = Hh * 0.82, sy = Hh * 0.14, Lp = py - sy;
        // the target and the spot
        const th = Sc.galvoOptical(al), xs = L * Math.tan(th), spotx = px + Lp * Math.tan(th);
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(W * 0.06, sy); c.lineTo(W * 0.94, sy); c.stroke();
        kit.label(c, 'target', W * 0.06, sy - 11, { color: C.muted, size: 11.5 });
        // the beam in, the dashed reference, the beam out
        const phi = -PI / 4 + al, ux = Math.cos(phi), uy = Math.sin(phi);
        S.ray(c, [[W * 0.04, py], [px, py]], { nm: 633, width: 2.2, arrows: false });
        S.ray(c, [[px, py], [px, sy]], { color: C.faint, dash: [5, 4], width: 1, arrows: false });
        S.ray(c, [[px, py], [clamp(spotx, 8, W - 8), sy]], { nm: 633, width: 2.2, arrows: false });
        S.flatMirror(c, px - ux * 24, py - uy * 24, px + ux * 24, py + uy * 24, { width: 3 });
        S.flatMirror(c, px - 20 * Math.SQRT1_2, py + 20 * Math.SQRT1_2, px + 20 * Math.SQRT1_2, py - 20 * Math.SQRT1_2, { color: C.faint, width: 1 });
        kit.dot(c, px, py, 2.5, C.text);
        if (Math.abs(V.a) > 0.4) {
          S.angle(c, px, py, Math.min(78, Lp * 0.5), -PI / 2, -PI / 2 + th, '2α', { color: C.warn });
          S.angle(c, px, py, 30, -PI / 4, -PI / 4 + al, 'α', { color: C.accent, gap: 12 });
        }
        kit.dot(c, clamp(spotx, 8, W - 8), sy, 5, C.warn, C.text);
        kit.label(c, 'x = ' + fx(xs, 0) + ' mm', clamp(spotx, 40, W - 40), sy + 16, { align: 'center', color: C.warn, size: 11.5, weight: 600 });
        kit.label(c, 'mirror', px - 28, py + 24, { align: 'right', color: C.muted, size: 11.5 });
        // the step response
        const wn = TAU * V.fn * 1e3, tol = V.tol / 100, z = V.z;
        const sMin = z < 1 ? z * wn : wn * (z - Math.sqrt(z * z - 1)), hor = 9 / sMin;
        let ts = 0, ymax = 0; const NP = 600;
        for (let k = 1; k <= NP; k++) { const t = hor * k / NP, y = stepResp(t, wn, z); if (Math.abs(y - 1) > tol) ts = t; if (y > ymax) ymax = y; }
        const tmax = Math.max(1.8 * ts, 4 / wn), pts = [], cmd = [[0, 0], [0, 1], [tmax * 1e3, 1]];
        for (let k = 0; k <= 160; k++) { const t = tmax * k / 160; pts.push([t * 1e3, stepResp(t, wn, z)]); }
        plot.set({
          x: { label: 'time (ms)', name: 't', min: 0, max: tmax * 1e3 }, y: { label: 'share of step', name: 'y', min: 0, max: Math.max(1.2, ymax + 0.08) },
          series: [{ pts: cmd, label: 'command', dash: true, color: C.faint }, { pts, label: 'mirror', color: C.series[0] }],
          hlines: [{ y: 1 + tol, label: '' }, { y: 1 - tol, label: '' }], vlines: [{ x: ts * 1e3, label: 'settled' }]
        });
        ro.set('a', fx(V.a, 1) + '°');
        ro.set('th', fx(th * R2D, 1) + '°  (optical)');
        ro.set('x', fx(xs, 1) + ' mm');
        ro.set('ts', tfmt(ts) + ' to within ' + fx(V.tol, 1) + ' %');
        ro.set('os', ymax > 1.0005 ? fx((ymax - 1) * 100, 1) + ' % of the step' : 'none');
        ro.set('fn', fx(V.fn, 2) + ' kHz, damping ' + fx(z, 2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a spinning polygon */
  const wrapA = a => { while (a > PI) a -= TAU; while (a <= -PI) a += TAU; return a; };
  // the first facet a horizontal ray at height y0 (mm), travelling to the right, meets on a polygon of circumradius R
  // whose first corner is at angle rho: -> { k, x, nang } (nang: direction of that facet's outward normal) or null
  function polyHit(n, R, rho, y0) {
    let best = null;
    for (let k = 0; k < n; k++) {
      const a0 = rho + TAU * k / n, a1 = rho + TAU * (k + 1) / n;
      const ax = R * Math.cos(a0), ay = R * Math.sin(a0), bx = R * Math.cos(a1), by = R * Math.sin(a1);
      if ((ay - y0) * (by - y0) > 0 || Math.abs(by - ay) < 1e-12) continue;
      const t = (y0 - ay) / (by - ay), x = ax + t * (bx - ax);
      if (!best || x < best.x) best = { k, x, nang: a0 + PI / n };
    }
    return best;
  }

  Hyper.sim('sm-polygon', {
    title: 'A spinning polygon: one facet, one line',
    blurb: `A beam arrives from the left and meets a spinning polygon. Each facet turns the beam into a sweep across a fan (the grey arc); when the beam moves from one facet to the next the sweep starts again. The picture is in slow motion; the read-outs give the real numbers for the speed you choose. The facet in use is outlined: green while the whole beam lies on it, amber while the beam crosses an edge and part of it is lost.

**Try this**
- Count the facets: with 8, each sweeps 90° (720°/n). Change to 12 and each sweeps only 60°, but at the same speed of rotation the line rate is 1.5 times higher.
- Widen the beam to 8 mm: the usable share of each facet collapses, because the beam’s footprint is longer than the facet allows. Raise the radius to 40 mm and it recovers.
- At 30 000 rpm with 8 facets the line rate is 4000 lines a second, and one facet lasts 250 µs.
- Set the tilt error to 30″ with a 200 mm lens: one facet writes its line 58 µm out of place, more than a pixel at 600 dpi.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320, maxH: 450 });
      let rho = 0.3, mKey = '', mVal = { duty: 0, lo: 0, hi: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Number of facets', min: 4, max: 24, step: 1, value: params.n || 8 },
        { id: 'R', label: 'Polygon radius (corner to centre)', min: 10, max: 40, step: 1, value: 20, unit: 'mm' },
        { id: 'D', label: 'Beam diameter', min: 1, max: 10, step: 0.5, value: params.D || 4, unit: 'mm' },
        { id: 'rpm', label: 'Speed of rotation', min: 1000, max: 60000, value: params.rpm || 30000, log: true, sig: 3, unit: 'rpm' },
        { id: 'f', label: 'Focal length of the scan lens', min: 50, max: 400, step: 10, value: 200, unit: 'mm' },
        { id: 'eps', label: 'Tilt error of one facet', min: 0, max: 60, step: 1, value: 10, unit: '″' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Optical angle per facet, 720°/n'], ['lr', 'Lines a second'], ['ft', 'Time for one facet'], ['duty', 'Share of the facet time usable'], ['use', 'Usable scan angle (traced)'], ['len', 'Line length behind the lens'], ['shift', 'A tilted facet shifts its line by'], ['slow', 'Shown in slow motion']]);
      // trace one revolution step by step: when does the whole beam lie on one facet, and what angles does it sweep
      const measure = () => {
        const key = [V.n, V.R, V.D].join();
        if (key !== mKey) {
          const n = V.n, R = V.R, D = V.D, yb = R * Math.SQRT1_2; let ok = 0, lo = 1e9, hi = -1e9; const M = 360;
          for (let m = 0; m < M; m++) {
            const r = TAU / n * m / M, a = polyHit(n, R, r, yb), b = polyHit(n, R, r, yb + D / 2), c = polyHit(n, R, r, yb - D / 2);
            if (a && b && c && a.k === b.k && a.k === c.k) { ok++; const s = wrapA(2 * a.nang + PI / 2); lo = Math.min(lo, s); hi = Math.max(hi, s); }
          }
          mVal = { duty: ok / M, lo: ok ? lo : 0, hi: ok ? hi : 0 }; mKey = key;
        }
        return mVal;
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = V.n, R = V.R, D = V.D, yb = R * Math.SQRT1_2, ra = 2.3;
        rho = (rho + dt * (TAU / n) / 1.6) % TAU;
        const sR = Math.min((W - 16) / 4.6, (Hh - 74) / 4.2), k = sR / R, cx = W * 0.56, cy = 30 + 3.05 * sR;
        const X = x => cx + x * k, Y = y => cy - y * k;
        const m = measure(), hit = polyHit(n, R, rho, yb), hu = polyHit(n, R, rho, yb + D / 2), hl = polyHit(n, R, rho, yb - D / 2);
        const usable = !!(hit && hu && hl && hit.k === hu.k && hit.k === hl.k);
        // the fan: everything one facet can sweep, and the usable part
        const p0x = X(-yb), p0y = Y(yb), arR = ra * sR;
        const half = 2 * PI / n;
        c.save(); c.lineWidth = 9; c.lineCap = 'butt'; c.strokeStyle = C.grid; c.beginPath(); c.arc(p0x, p0y, arR, -PI / 2 - half, -PI / 2 + half); c.stroke();
        if (m.hi > m.lo) { c.strokeStyle = C.ok; c.globalAlpha = 0.7; c.beginPath(); c.arc(p0x, p0y, arR, -PI / 2 - m.hi, -PI / 2 - m.lo); c.stroke(); }
        c.restore();
        // the polygon
        const vx = [], vy = [];
        for (let i = 0; i < n; i++) { const a = rho + TAU * i / n; vx.push(X(R * Math.cos(a))); vy.push(Y(R * Math.sin(a))); }
        c.beginPath(); for (let i = 0; i < n; i++) i ? c.lineTo(vx[i], vy[i]) : c.moveTo(vx[i], vy[i]); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.stroke();
        if (hit) { const i0 = hit.k, i1 = (hit.k + 1) % n; c.strokeStyle = usable ? C.ok : C.warn; c.lineWidth = 4; c.beginPath(); c.moveTo(vx[i0], vy[i0]); c.lineTo(vx[i1], vy[i1]); c.stroke(); }
        kit.dot(c, cx, cy, 2.5, C.muted);
        // the beam in
        const bw = Math.max(2, D * k);
        if (hit) {
          c.save(); c.strokeStyle = S.nm(650, 0.28); c.lineWidth = bw; c.lineCap = 'butt'; c.beginPath(); c.moveTo(0, Y(yb)); c.lineTo(X(hit.x), Y(yb)); c.stroke(); c.restore();
          S.ray(c, [[0, Y(yb)], [X(hit.x), Y(yb)]], { nm: 650, width: 1.5, arrows: false });
          // the beam out, to the fan
          const dx = -Math.cos(2 * hit.nang), dy = -Math.sin(2 * hit.nang);
          const ox = hit.x + yb, oy = 0, bq = ox * dx + oy * dy, cq = ox * ox + oy * oy - (ra * R) * (ra * R), tq = -bq + Math.sqrt(Math.max(0, bq * bq - cq));
          const ex = hit.x + dx * tq, ey = yb + dy * tq;
          c.save(); c.strokeStyle = usable ? S.nm(650, 0.3) : 'rgba(224,160,48,0.25)'; c.lineWidth = bw; c.lineCap = 'butt'; c.beginPath(); c.moveTo(X(hit.x), Y(yb)); c.lineTo(X(ex), Y(ey)); c.stroke(); c.restore();
          S.ray(c, [[X(hit.x), Y(yb)], [X(ex), Y(ey)]], { color: usable ? C.ok : C.warn, width: 1.6, arrows: false });
          kit.dot(c, X(ex), Y(ey), 4.5, usable ? C.ok : C.warn, C.text);
        }
        kit.label(c, 'one facet sweeps ' + fx(720 / n, 0) + '°', p0x, Math.max(12, p0y - arR - 12), { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, n + ' facets', cx, cy + R * k + 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, usable ? 'whole beam on one facet: usable' : 'beam on an edge: part is lost', 10, Hh - 12, { color: usable ? C.ok : C.warn, size: 12, weight: 600 });
        // numbers
        const pl = Sc.polygon({ facets: n, rpm: V.rpm, beam: D / Math.cos(PI / 4), facetWidth: 2 * R * Math.sin(PI / n) });
        ro.set('ang', fx(pl.scanAngle * R2D, 0) + '°  (before the duty cycle)');
        ro.set('lr', grp(pl.lineRate) + ' a second');
        ro.set('ft', tfmt(pl.facetTime));
        ro.set('duty', fx(100 * pl.dutyCycle, 0) + ' % by 1 − D/(w cos i), ' + fx(100 * m.duty, 0) + ' % traced');
        ro.set('use', m.hi > m.lo ? fx((m.hi - m.lo) * R2D, 0) + '°' : 'none: the beam is wider than a facet');
        ro.set('len', m.hi > m.lo ? fx(V.f * (m.hi - m.lo), 0) + ' mm with an f-theta lens' : '–');
        ro.set('shift', fx(2 * V.eps / 206265 * V.f * 1e3, 1) + ' µm  (' + fx(2 * V.eps / 206265 * V.f * 1e3 / (Sc.dpiPitch(600) * 1e6), 2) + ' pixels at 600 dpi)');
        ro.set('slow', 'a facet in 1.6 s here, × ' + grp(1.6 / pl.facetTime) + ' slower');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ resonant and MEMS mirrors */
  Hyper.sim('sm-resonant', {
    title: 'A resonant mirror: a sine-wave sweep, and a two-axis Lissajous scan',
    blurb: `**One axis.** A mirror swings as a sine wave. The dots show where the spot is at equal steps of time: dense near the ends of the sweep, where the spot slows and turns, and wide apart in the middle. The ticks below mark the pixel boundaries when the pixel clock runs evenly in time or evenly in position. The graph shows the spot speed against position.
**Two axes.** Two mirrors, or one MEMS mirror turning about two axes, oscillate at different frequencies and trace a Lissajous figure. The graph shows what share of the field the line has touched as the frame goes by.

**Try this**
- One axis, 80 % of the amplitude used: the edge pixels are 60 % as wide as those in the middle when clocked evenly in time. Switch to *evenly in position* and they are equal.
- Use only 50 % of the amplitude: the speed varies by only 13 % over the used part, but only a third of the time is used.
- Two axes, 13 and 8 cycles: the curve touches about 80 % of a 32 × 32 field in one frame. Try 12 and 8 (common factor 4): the pattern repeats four times a frame and touches only 28 %.
- Make the frequencies nearly equal, 13 : 12 and then 21 : 20: the coverage rises to 86 % and 97 %, because the long curve turns slowly and sweeps the whole field.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 380 });
      const plot = kit.plot(box.stage, { x: { label: 'position ÷ amplitude', name: 'x', min: -1, max: 1 }, y: { label: 'speed ÷ max', name: 'v', min: 0, max: 1.05 }, series: [] }, 150);
      let clk = 0, lKey = '', liss = null; const trail = [];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['One axis: the sine-wave sweep', 'line'], ['Two axes: a Lissajous scan', 'liss']], value: params.view || 'line' },
        { id: 'f', label: 'Mirror frequency', min: 1, max: 16, step: 0.5, value: 8, unit: 'kHz' },
        { id: 'u', label: 'Share of the amplitude used', min: 30, max: 100, step: 1, value: params.u || 80, unit: '%' },
        { id: 'clock', type: 'select', label: 'Pixels are clocked', options: [['evenly in time', 'time'], ['evenly in position (corrected)', 'pos']], value: params.clock || 'time' },
        { id: 'p', label: 'x oscillations per frame', min: 1, max: 24, step: 1, value: params.p || 13 },
        { id: 'q', label: 'y oscillations per frame', min: 1, max: 24, step: 1, value: params.q || 8 },
        { id: 'ph', label: 'Phase of x', min: 0, max: 180, step: 5, value: 90, unit: '°' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { const l = V.view === 'line'; for (const id of ['f', 'u', 'clock']) ctl.show(id, l); for (const id of ['p', 'q', 'ph']) ctl.show(id, !l); roL.show(l); roS.show(!l); };
      const roL = kit.readout(box.side, [['lr', 'Lines a second (both sweeps)'], ['fps', 'Frames a second of 512 lines'], ['share', 'Time spent in the used part'], ['edge', 'Spot speed at the edge of it'], ['pix', 'Edge pixel ÷ centre pixel']]);
      const roS = kit.readout(box.side, [['cyc', 'Oscillations in a frame'], ['rep', 'The pattern repeats'], ['cov', 'Field touched in one frame'], ['rate', 'Frames a second, x at 20 kHz']]);
      vis();
      const gcd = (a, b) => b ? gcd(b, a % b) : a;
      // one frame of the Lissajous curve and the share of a 32 × 32 field it has touched as time passes
      const lissajous = () => {
        const key = [V.p, V.q, V.ph].join();
        if (key !== lKey) {
          const g = gcd(V.p, V.q), p = V.p / g, q = V.q / g, M = 6000, NC = 32, seen = new Uint8Array(NC * NC), pts = [], cov = [];
          let touched = 0;
          for (let i = 0; i <= M; i++) {
            const t = i / M, x = Math.sin(TAU * p * t + V.ph * D2R), y = Math.sin(TAU * q * t);
            pts.push([x, y]);
            const cx = Math.min(NC - 1, Math.floor((x + 1) / 2 * NC)), cy = Math.min(NC - 1, Math.floor((y + 1) / 2 * NC));
            if (!seen[cy * NC + cx]) { seen[cy * NC + cx] = 1; touched++; }
            if (i % 100 === 0) cov.push([t, 100 * touched / (NC * NC)]);
          }
          liss = { pts, cov, g, p, q, total: 100 * touched / (NC * NC) }; lKey = key;
        }
        return liss;
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        clk += dt;
        if (V.view === 'line') {
          const u = V.u / 100, A = (W - 40) / 2, cx = W / 2, y0 = Hh * 0.36, th = clk * TAU * 0.3;
          const x = cx + A * Math.sin(th);
          c.fillStyle = C.bg2; c.fillRect(cx - A, y0 - 3, 2 * A, 6);
          c.fillStyle = C.grid; c.fillRect(cx - A * u, y0 - 16, 2 * A * u, 32);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - A * u, y0 - 17); c.lineTo(cx - A * u, y0 + 17); c.moveTo(cx + A * u, y0 - 17); c.lineTo(cx + A * u, y0 + 17); c.stroke();
          trail.push(x); if (trail.length > 48) trail.shift();
          for (let i = 0; i < trail.length; i++) { c.globalAlpha = 0.12 + 0.6 * i / trail.length; kit.dot(c, trail[i], y0, 3.2, C.warn); } c.globalAlpha = 1;
          kit.dot(c, x, y0, 5, C.warn, C.text);
          // pixel boundaries
          const K = 24, a0 = Math.asin(u), ty = y0 + 46;
          for (let i = 0; i <= K; i++) {
            const px = V.clock === 'time' ? cx + A * Math.sin(-a0 + 2 * a0 * i / K) : cx + A * u * (-1 + 2 * i / K);
            c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath(); c.moveTo(px, ty - 11); c.lineTo(px, ty + 11); c.stroke();
          }
          kit.label(c, 'where the spot is at equal steps of time', cx, y0 - 30, { align: 'center', color: C.muted, size: 12, weight: 650 });
          kit.label(c, 'pixel boundaries, clocked ' + (V.clock === 'time' ? 'evenly in time' : 'evenly in position'), cx, ty + 28, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'used part', cx, y0 + 28 + 0, { align: 'center', color: C.faint, size: 10.5 });
          const pts = []; for (let i = 0; i <= 100; i++) { const xx = -1 + 0.02 * i; pts.push([xx, Math.sqrt(Math.max(0, 1 - xx * xx))]); }
          plot.set({ x: { label: 'position ÷ amplitude', name: 'x', min: -1, max: 1 }, y: { label: 'speed ÷ max', name: 'v', min: 0, max: 1.05 }, series: [{ pts, label: 'spot speed', color: C.series[0] }], vlines: [{ x: -u, label: '' }, { x: u, label: 'used' }], hlines: [{ y: Math.sqrt(1 - u * u), label: 'edge' }], marks: [] });
          const edge = Math.sqrt(1 - u * u);
          roL.set('lr', grp(2 * V.f * 1000) + ' a second');
          roL.set('fps', fx(2 * V.f * 1000 / 512, 1) + ' a second');
          roL.set('share', fx(100 * 2 / PI * Math.asin(u), 0) + ' %');
          roL.set('edge', fx(100 * edge, 0) + ' % of the speed at the centre');
          roL.set('pix', V.clock === 'time' ? fx(edge, 2) : '1.00 (clocked by position)');
        } else {
          const L = lissajous(), side = Math.max(80, Math.min(W - 24, Hh - 34)), x0 = (W - side) / 2, y0 = 22;
          c.fillStyle = C.bg2; c.fillRect(x0, y0, side, side);
          c.strokeStyle = C.accent; c.globalAlpha = 0.65; c.lineWidth = 1; c.beginPath();
          L.pts.forEach((pt, i) => { const px = x0 + (pt[0] + 1) / 2 * side, py = y0 + (1 - (pt[1] + 1) / 2) * side; i ? c.lineTo(px, py) : c.moveTo(px, py); });
          c.stroke(); c.globalAlpha = 1;
          const tau = (clk * 0.08) % 1, i0 = Math.floor(tau * 6000), pt = L.pts[i0];
          for (let j = 0; j < 40; j++) { const q = L.pts[(i0 - j * 4 + 6000) % 6000]; c.globalAlpha = 1 - j / 40; kit.dot(c, x0 + (q[0] + 1) / 2 * side, y0 + (1 - (q[1] + 1) / 2) * side, 2.6, C.warn); } c.globalAlpha = 1;
          kit.dot(c, x0 + (pt[0] + 1) / 2 * side, y0 + (1 - (pt[1] + 1) / 2) * side, 4.5, C.warn, C.text);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 + 0.5, side, side);
          kit.label(c, 'one frame of the scan', W / 2, y0 - 10, { align: 'center', color: C.muted, size: 12, weight: 650 });
          plot.set({ x: { label: 'time in the frame', name: 't', min: 0, max: 1 }, y: { label: 'touched (%)', name: '%', min: 0, max: 100 }, series: [{ pts: L.cov, label: 'touched', color: C.series[0] }], vlines: [], hlines: [], marks: [] });
          roS.set('cyc', 'x ' + V.p + ' times, y ' + V.q + ' times');
          roS.set('rep', L.g > 1 ? L.g + ' times a frame (common factor ' + L.g + ')' : 'once: one long curve per frame');
          roS.set('cov', fx(L.total, 0) + ' % of a 32 × 32 field');
          roS.set('rate', fx(20000 * L.g / V.p, 0) + ' a second');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ an acousto-optic deflector */
  Hyper.sim('sm-aod', {
    title: 'An acousto-optic deflector: a sound wave that steers light',
    blurb: `Sound travels up a crystal from a transducer at its foot and makes layers of higher and lower refractive index (the horizontal lines, drawn schematically: the real spacing is a few micrometres). A beam that meets the layers at the **Bragg angle** is diffracted; the diffracted beam leaves at twice that angle from the straight-through one. Below, a screen 1 m away shows where the diffracted spot goes as the sound frequency is swept.

**Try this**
- Raise the sound frequency: the sound wavelength falls, the Bragg angle and the deflection grow in proportion. At 100 MHz in tellurium dioxide with 633 nm light the deflection is 5.6°.
- Widen the sweep: the number of resolvable spots grows (sweep × transit time), and so does the length of the bar on the screen.
- Make the beam wider: more spots, but the access time grows too, because the sound must cross the whole beam.
- Switch the crystal to fused silica: sound travels nine times faster, so the same frequencies give a deflection nine times smaller, and far fewer spots.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 430 });
      let clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Sound frequency (centre of the sweep)', min: 40, max: 160, step: 1, value: params.f || 100, unit: 'MHz' },
        { id: 'df', label: 'Frequency sweep', min: 5, max: 80, step: 1, value: params.df || 50, unit: 'MHz' },
        { id: 'nm', type: 'select', label: 'Light', options: [['Blue, 488 nm', 488], ['Green, 532 nm', 532], ['Red, 633 nm', 633], ['Infrared, 1064 nm', 1064]], value: params.nm || 633 },
        { id: 'v', type: 'select', label: 'Crystal', options: [['Tellurium dioxide, slow shear wave (650 m/s)', 650], ['Fused silica, longitudinal wave (5960 m/s)', 5960]], value: params.v || 650 },
        { id: 'D', label: 'Beam diameter', min: 1, max: 10, step: 0.5, value: params.D || 5, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lam', 'Sound wavelength, v/f'], ['br', 'Bragg angle'], ['de', 'Deflection of the beam, 2θ'], ['sw', 'Range of the sweep'], ['sp', 'Resolvable spots, Δf × D/v'], ['ta', 'Access time, D/v'], ['scr', 'Sweep on a screen 1 m away']]);
      const loop = kit.loop(dt => {
        clk += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const v = V.v, f = V.f * 1e6, thB = Sc.braggAngle(V.nm, f, v), lam = v / f;
        const ao = Sc.aod({ df: V.df * 1e6, v, D: V.D * 1e-3, nm: V.nm });
        // the crystal: 25 mm along the beam, 20 mm high
        const Lc = W * 0.36, s = Lc / 25, cxl = W * 0.26, cyt = 30, ch = Math.min(20 * s, Hh * 0.46), cym = cyt + ch / 2;
        c.fillStyle = S.glass(0.2); c.fillRect(cxl, cyt, Lc, ch); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(cxl + 0.5, cyt + 0.5, Lc, ch);
        c.fillStyle = C.muted; c.fillRect(cxl, cyt + ch, Lc, 5);
        kit.label(c, 'transducer (radio-frequency in)', cxl + Lc / 2, cyt + ch + 17, { align: 'center', color: C.muted, size: 11 });
        // the sound planes travel up
        const sp = clamp(7 * (lam / 6.5e-6), 3.5, 22), off = (clk * 14) % sp;
        c.strokeStyle = C.accent; c.lineWidth = 1; c.globalAlpha = 0.7; c.beginPath();
        for (let y = cyt + ch - off; y > cyt; y -= sp) { c.moveTo(cxl + 2, y); c.lineTo(cxl + Lc - 2, y); }
        c.stroke(); c.globalAlpha = 1;
        kit.label(c, 'crystal, sound planes (not to scale)', cxl + Lc / 2, cyt - 12, { align: 'center', color: C.muted, size: 11.5, weight: 600 });
        // the beams, at their true angles
        const xm = cxl + Lc / 2, xs = W * 0.84, tb = Math.tan(thB), bw = Math.max(2, V.D * s);
        const yIn = x => cym + (xm - x) * tb, yUn = x => cym - (x - xm) * tb, yDf = x => cym + (x - xm) * tb;
        const band = (ptsl, alpha, w) => { c.save(); c.strokeStyle = S.nm(V.nm, alpha); c.lineWidth = w; c.lineCap = 'butt'; c.beginPath(); ptsl.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
        band([[6, yIn(6)], [xm, cym]], 0.3, bw); S.ray(c, [[6, yIn(6)], [xm, cym]], { nm: V.nm, width: 1.4, arrows: false });
        band([[xm, cym], [xs, yUn(xs)]], 0.3, bw * 0.85); S.ray(c, [[xm, cym], [xs, yUn(xs)]], { nm: V.nm, width: 1.4, arrows: false });
        band([[xm, cym], [xs, yDf(xs)]], 0.18, bw * 0.55); S.ray(c, [[xm, cym], [xs, yDf(xs)]], { nm: V.nm, width: 1.4, arrows: false, alpha: 0.8 });
        S.screen(c, xs, cym, ch * 0.55, { w: 3 });
        kit.dot(c, xs, yUn(xs), 3.5, S.nm(V.nm), C.text); kit.dot(c, xs, yDf(xs), 3.5, S.nm(V.nm), C.text);
        kit.label(c, 'straight on', xs - 8, Math.min(yUn(xs), yDf(xs)) - 16, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'diffracted', xs - 8, Math.max(yUn(xs), yDf(xs)) + 16, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'beam', 8, yIn(6) - 14, { color: C.muted, size: 11 });
        // the sweep on a screen 1 m away: positions of the diffracted spot, measured from the straight-through spot
        const sy = Hh - 40, sx0 = W * 0.08, sx1 = W * 0.92, maxMm = 200, pxm = (sx1 - sx0) / 2 / maxMm, scx = (sx0 + sx1) / 2;
        const lo = Math.max(0, V.f - V.df / 2), hi = V.f + V.df / 2, pos = ff => Sc.braggAngle(V.nm, ff * 1e6, v) * 2 * 1000;     // mm at 1 m
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx0, sy); c.lineTo(sx1, sy); c.stroke();
        for (const t of [-200, -100, 0, 100, 200]) { c.beginPath(); c.moveTo(scx + t * pxm, sy - 3); c.lineTo(scx + t * pxm, sy + 3); c.stroke(); }
        const a = scx + pos(lo) * pxm, b = scx + pos(hi) * pxm;
        c.fillStyle = S.nm(V.nm, 0.55); c.fillRect(a, sy - 7, Math.max(2, b - a), 14);
        if (ao.spots <= 70) { c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= ao.spots; i++) { const xx = a + (b - a) * i / ao.spots; c.moveTo(xx, sy - 7); c.lineTo(xx, sy + 7); } c.stroke(); }
        kit.dot(c, scx, sy, 3, C.muted);
        kit.label(c, 'screen 1 m away', sx0, sy - 20, { color: C.muted, size: 11.5, weight: 600 });
        kit.label(c, '0', scx, sy + 16, { align: 'center', color: C.faint, size: 10.5 });
        kit.label(c, '200 mm', sx1, sy + 16, { align: 'right', color: C.faint, size: 10.5 });
        ro.set('lam', fx(lam * 1e6, 2) + ' µm');
        ro.set('br', fx(thB * R2D, 2) + '°');
        ro.set('de', fx(2 * thB * R2D, 2) + '°  at ' + fx(V.f, 0) + ' MHz');
        ro.set('sw', fx(ao.angle * 1e3, 1) + ' mrad = ' + fx(ao.angle * R2D, 2) + '° for ' + fx(V.df, 0) + ' MHz');
        ro.set('sp', fx(ao.spots, 0) + ' spots');
        ro.set('ta', tfmt(ao.access));
        ro.set('scr', fx(pos(lo), 0) + ' to ' + fx(pos(hi), 0) + ' mm from the straight-through spot');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ Risley prisms */
  Hyper.sim('sm-risley', {
    title: 'Risley prisms: two wedges, two arrows, one beam direction',
    blurb: `Two thin wedges turn about one axis. Each bends a beam by δ towards its thick edge, so each is an arrow of length δ; the pair bends the beam by the **sum of the two arrows** (arrow 1 from the centre, arrow 2 added to its tip). The spot in the field is the tip of the sum. The faint curve is the whole pattern, the bright trail its latest part. The circle is the field of regard, of radius 2δ.

**Try this**
- Speeds 1 : −1 (equal and opposite): the sum swings along a line through the centre. 1 : 1: a circle of radius 2δ.
- 1 : −2 gives three petals, 1 : −3 four: with speeds in the ratio 1 : −m the pattern has m + 1 petals.
- Untick *Turn the wedges* and set the two orientations by hand: 180° apart, the arrows cancel and the beam goes straight through; equal, it is deviated by the full 2δ.
- Raise the apex angle or choose the dense flint: the field of regard grows in proportion to (n − 1)α.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 310, maxH: 440 });
      let clk = 0, pKey = '', pPts = null;
      const ctl = kit.controls(box.side, [
        { id: 'al', label: 'Apex angle of each wedge', min: 1, max: 10, step: 0.5, value: params.al || 5, unit: '°' },
        { id: 'glass', type: 'select', label: 'Glass', options: [['N-BK7 crown glass (n 1.52)', 'N-BK7'], ['Fused silica (n 1.46)', 'fused-silica'], ['N-SF11 dense flint (n 1.79)', 'N-SF11']], value: params.glass || 'N-BK7' },
        { id: 'r', label: 'Speed of wedge 2 ÷ speed of wedge 1', min: -6, max: 6, step: 0.5, value: params.r != null ? params.r : -3 },
        { id: 'run', type: 'check', label: 'Turn the wedges', value: params.run !== false },
        { id: 'o1', label: 'Orientation of wedge 1 (start)', min: 0, max: 360, step: 5, value: params.o1 || 0, unit: '°' },
        { id: 'o2', label: 'Orientation of wedge 2 (start)', min: 0, max: 360, step: 5, value: params.o2 != null ? params.o2 : 180, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Deviation of each wedge'], ['max', 'Field of regard, half-angle 2δ'], ['now', 'Net deviation now'], ['rel', 'Angle between the wedges now'], ['pat', 'The pattern']]);
      const wedge = () => { const n = O.index(V.glass, 550); return { n, d: O.prism(n, V.al * D2R, 0).delta, thin: (n - 1) * V.al * D2R }; };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const w = wedge(), dl = w.d;
        const th = V.run ? (clk += dt * 1.2) : 0;
        const f1 = (V.run ? th : 0) + V.o1 * D2R, f2 = (V.run ? V.r * th : 0) + V.o2 * D2R;
        const cx = W / 2, cy = Hh * 0.47, pr = Math.max(60, Math.min(W * 0.45, (Hh - 66) / 2)), k = pr / (2 * dl * 1.06);
        // the pattern of the whole run: two turns of wedge 1
        const key = [dl.toFixed(5), V.r, V.o1, V.o2].join();
        if (key !== pKey) { pPts = []; for (let i = 0; i <= 480; i++) { const t = 4 * PI * i / 480, a = t + V.o1 * D2R, b = V.r * t + V.o2 * D2R; pPts.push([dl * (Math.cos(a) + Math.cos(b)), dl * (Math.sin(a) + Math.sin(b))]); } pKey = key; }
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, 2 * dl * k, 0, TAU); c.fill();
        c.strokeStyle = C.axis; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, 2 * dl * k, 0, TAU); c.stroke();
        c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, dl * k, 0, TAU); c.moveTo(cx - 2 * dl * k, cy); c.lineTo(cx + 2 * dl * k, cy); c.moveTo(cx, cy - 2 * dl * k); c.lineTo(cx, cy + 2 * dl * k); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.globalAlpha = 0.45; c.lineWidth = 1.2; c.beginPath(); pPts.forEach((p, i) => i ? c.lineTo(cx + p[0] * k, cy - p[1] * k) : c.moveTo(cx + p[0] * k, cy - p[1] * k)); c.stroke(); c.globalAlpha = 1;
        if (V.run) {
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath();
          for (let i = 0; i <= 50; i++) { const t = th - 1.3 * (1 - i / 50), a = t + V.o1 * D2R, b = V.r * t + V.o2 * D2R, x = cx + dl * k * (Math.cos(a) + Math.cos(b)), y = cy - dl * k * (Math.sin(a) + Math.sin(b)); c.globalAlpha = 0.15 + 0.85 * i / 50; i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke(); c.globalAlpha = 1;
        }
        const ax = cx + dl * k * Math.cos(f1), ay = cy - dl * k * Math.sin(f1), px = ax + dl * k * Math.cos(f2), py = ay - dl * k * Math.sin(f2);
        kit.arrow(c, cx, cy, ax, ay, C.series[0], 2.4);
        kit.arrow(c, ax, ay, px, py, C.series[2], 2.4);
        kit.arrow(c, cx, cy, px, py, C.warn, 3);
        kit.dot(c, px, py, 4.5, C.warn, C.text); kit.dot(c, cx, cy, 2.5, C.muted);
        kit.label(c, '2δ = ' + fx(2 * dl * R2D, 1) + '°', cx + 2 * dl * k * 0.71 + 4, cy - 2 * dl * k * 0.71 - 6, { color: C.muted, size: 11.5 });
        kit.label(c, 'the field the beam can reach', cx, 14, { align: 'center', color: C.muted, size: 12, weight: 650 });
        const ly = Hh - 14; [['wedge 1', C.series[0], 0.05], ['wedge 2', C.series[2], 0.37], ['sum', C.warn, 0.69]].forEach(([t, col, fxp]) => { c.fillStyle = col; c.fillRect(W * fxp, ly - 5, 11, 10); kit.label(c, t, W * fxp + 16, ly, { color: C.muted, size: 11.5 }); });
        const dphi = Math.abs(wrapA(f1 - f2)) * R2D, net = Math.hypot(px - cx, py - cy) / k;
        const r = V.r;
        ro.set('d', fx(dl * R2D, 2) + '°  (thin wedge: ' + fx(w.thin * R2D, 2) + '°)');
        ro.set('max', fx(2 * dl * R2D, 2) + '°  (a cone of ' + fx(4 * dl * R2D, 1) + '°)');
        ro.set('now', fx(net * R2D, 2) + '°');
        ro.set('rel', fx(dphi, 0) + '°');
        ro.set('pat', r === 1 ? 'a circle of radius 2δ' : r === -1 ? 'a line through the centre' : r === 0 ? 'a circle of radius δ about a fixed point' : (r <= -2 && Number.isInteger(r)) ? 'a rose with ' + (1 - r) + ' petals' : 'a rosette, closing after two turns of wedge 1');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ scan lenses */
  Hyper.sim('sm-ftheta', {
    title: 'An ordinary lens against an f-theta lens behind a scanning mirror',
    blurb: `The mirror turns in equal steps and the lens turns each angle into a spot on a flat target. The rays drawn are the chief rays of the equal steps. With an **ordinary lens** the spots are at f tan θ and spread out towards the edge; with an **f-theta lens** they are at f θ, equally spaced. A **telecentric** f-theta lens also lands every ray square on the target. The lens is drawn as a single plane, so the paths inside it are schematic; the spot positions are exact. The graph compares the two laws.

**Try this**
- Open the field to ±40° with 11 steps: with the ordinary lens the outermost step is about 1.5 times the central one (the spot speed ratio 1/cos²θ comes from this). Switch to f-theta and the steps are equal.
- Keep *show where the other lens puts the spots* ticked: the hollow dots are the other law’s positions. At 25° they are 7 % apart.
- Choose the telecentric lens: the rays arrive parallel to the axis, so a surface a little too high or too low does not move the spot sideways.
- Change the focal length: everything scales, the shape of the pattern does not.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 380 });
      const plot = kit.plot(box.stage, { x: { label: 'optical scan angle (°)', name: 'θ', min: 0, max: 40 }, y: { label: 'y (mm)', name: 'y', min: 0, max: 100 }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Scan lens', options: [['Ordinary lens: y = f tan θ', 'tan'], ['f-theta lens: y = f θ', 'ftheta'], ['Telecentric f-theta lens', 'tele']], value: params.lens || 'tan' },
        { id: 'tm', label: 'Half-angle of the scan (optical)', min: 5, max: 40, step: 1, value: params.tm || 25, unit: '°' },
        { id: 'n', label: 'Steps drawn', min: 5, max: 21, step: 2, value: 11 },
        { id: 'f', label: 'Focal length', min: 50, max: 400, step: 10, value: 160, unit: 'mm' },
        { id: 'both', type: 'check', label: 'Show where the other lens puts the spots', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['edge', 'Spot at the edge, this lens'], ['oth', 'Spot at the edge, the other law'], ['dif', 'The two differ by'], ['stp', 'Outermost step ÷ central step'], ['spd', 'Spot speed at the edge ÷ centre'], ['arr', 'The beam reaches the work']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const tm = V.tm * D2R, f = V.f, n = V.n, ft = V.lens !== 'tan';
        const yOf = (th, tanLaw) => tanLaw ? Sc.fTan(f, th) : Sc.fTheta(f, th);
        const yc = Hh * 0.5, gapL = W * 0.07;
        const fpx = Math.max(60, Math.min(W * 0.72, Hh * 0.4 / Math.max(Math.tan(tm), tm)));
        const x0 = (W - (gapL + fpx)) / 2 - 4, xp = x0 + 2, xl = xp + gapL, xt = xl + fpx, kk = fpx / f;
        // the lens and the target
        if (V.lens === 'tele') { const hh = Math.max(24, Sc.fTheta(f, tm) * kk * 1.15); S.thinLens(c, xt - fpx * 0.16, yc, hh, 1, { width: 2 }); S.thinLens(c, xl, yc, 16, 1, { width: 2 }); }
        else S.thinLens(c, xl, yc, 22, 1, { width: 2 });
        const ymax = Math.max(Sc.fTan(f, tm), Sc.fTheta(f, tm)) * kk;
        S.screen(c, xt, yc, ymax * 1.08, { w: 3 });
        S.flatMirror(c, xp - 8, yc + 8, xp + 8, yc - 8, { width: 3 });
        S.ray(c, [[Math.max(2, xp - 30), yc], [xp, yc]], { nm: 633, width: 1.8, arrows: false });
        // equal steps of the mirror
        const own = [], oth = [];
        for (let i = 0; i < n; i++) {
          const th = -tm + 2 * tm * i / (n - 1), y = yOf(th, !ft) * kk, yo = yOf(th, ft) * kk;
          own.push(y); oth.push(yo);
          const tl = yc - (xl - xp) * Math.tan(th);
          const col = i === (n - 1) / 2 ? C.faint : S.nm(633, 0.9);
          if (V.lens !== 'tele') S.ray(c, [[xp, yc], [xl, tl], [xt, yc - y]], { color: col, width: 1.2, arrows: false });
          else S.ray(c, [[xp, yc], [xl, tl], [xt - fpx * 0.16, yc - y], [xt, yc - y]], { color: col, width: 1.2, arrows: false });
        }
        if (V.both) for (const yo of oth) { c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath(); c.arc(xt, yc - yo, 4.2, 0, TAU); c.stroke(); }
        for (const y of own) kit.dot(c, xt, yc - y, 3.3, C.warn);
        kit.label(c, 'mirror', xp, yc + 26, { align: 'center', color: C.muted, size: 11 });
        if (V.lens === 'tele') kit.label(c, 'big last element', xt - fpx * 0.16 + 6, yc + 18, { color: C.muted, size: 11, bg: C.bg2 });
        else kit.label(c, 'lens', xl, yc - 34, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'target', xt, Math.max(12, yc - ymax * 1.08 - 12), { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'equal steps of ' + fx(2 * V.tm / (n - 1), 1) + '° each', 10, Hh - 12, { color: C.muted, size: 11.5 });
        // numbers
        const yE = yOf(tm, !ft), yO = yOf(tm, ft), mid = (n - 1) / 2, st1 = own[mid + 1] - own[mid], stN = own[n - 1] - own[n - 2];
        ro.set('edge', fx(yE, 1) + ' mm  (field ' + fx(2 * yE, 0) + ' mm wide)');
        ro.set('oth', fx(yO, 1) + ' mm');
        ro.set('dif', fx(Math.abs(yO - yE), 2) + ' mm (' + fx(100 * Math.abs(yO - yE) / Math.min(yE, yO), 1) + ' %)');
        ro.set('stp', fx(stN / st1, 2));
        ro.set('spd', V.lens === 'tan' ? fx(1 / Math.pow(Math.cos(tm), 2), 2) + ' for a steady mirror' : '1.00: equal');
        ro.set('arr', V.lens === 'tele' ? 'square on (0°), everywhere' : V.lens === 'tan' ? 'at the scan angle, ' + fx(V.tm, 0) + '° off square at the edge' : 'tilted, depending on the design');
        const a = [], b = [];
        for (let d = 0; d <= 40; d += 1) { a.push([d, Sc.fTan(f, d * D2R)]); b.push([d, Sc.fTheta(f, d * D2R)]); }
        plot.set({ x: { label: 'optical scan angle (°)', name: 'θ', min: 0, max: 40 }, y: { label: 'y (mm)', name: 'y', min: 0, max: Math.ceil(Sc.fTan(f, 40 * D2R) / 20) * 20 }, series: [{ pts: a, label: 'f tan θ', color: C.series[1] }, { pts: b, label: 'f θ', color: C.series[0] }], vlines: [{ x: V.tm, label: 'edge' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ resolvable spots */
  Hyper.sim('sm-resolvable', {
    title: 'How many spots can a scanner resolve?',
    blurb: `The scan angle, the beam diameter and the wavelength decide the number of spots along a line, N = θD/(aλ), and nothing behind the mirror can change it. The lower strip shows a stretch of the line with the spots at true size: ten touching spots, each of the diameter a λ f/D. The graph shows N against beam diameter for four scan angles, at the wavelength and criterion you set; the dot is your scanner.

**Try this**
- Change the focal length of the lens: the spot size and the length of the line both change, but N does not.
- Double the beam diameter: N doubles and the spot halves. Halve the scan angle: N halves.
- Compare the three criteria for what counts as one spot: the same scanner has 8700, 9000 or 14 700 spots.
- Choose the pixels you need (for example 4961, an A4 line at 600 dpi) and see which beam diameters are enough.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250, maxH: 340 });
      const plot = kit.plot(box.stage, { x: { label: 'beam diameter (mm)', name: 'D', min: 0.5, max: 30, log: true }, y: { label: 'spots N', name: 'N', min: 10, max: 1e5, log: true }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Total optical scan angle', min: 2, max: 80, step: 1, value: params.th || 40, unit: '°' },
        { id: 'D', label: 'Beam diameter at the mirror', min: 0.5, max: 30, value: params.D || 10, log: true, sig: 3, unit: 'mm' },
        { id: 'nm', label: 'Wavelength', min: 350, max: 1600, value: params.nm || 633, log: true, sig: 3, unit: 'nm' },
        { id: 'f', label: 'Focal length of the f-theta lens', min: 50, max: 400, step: 10, value: 160, unit: 'mm' },
        { id: 'a', type: 'select', label: 'What counts as one spot', options: [['Gaussian 1/e² diameter (a = 1.27)', 1.27], ['Rayleigh criterion (a = 1.22)', 1.22], ['Gaussian half-maximum width (a = 0.75)', 0.75]], value: 1.27 },
        { id: 'need', type: 'select', label: 'Pixels you need on a line', options: [['512', 512], ['1024', 1024], ['2048', 2048], ['4961 (A4 at 600 dpi)', 4961], ['8192', 8192]], value: 2048 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'Resolvable spots N'], ['d', 'Spot diameter on the target'], ['L', 'Length of the line'], ['chk', 'Compared with the pixels needed'], ['inv', 'Scan angle × beam diameter']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const th = V.th * D2R, N = Sc.resolvableSpots(th, V.D * 1e-3, V.nm, V.a), d = V.a * V.nm * 1e-9 * V.f * 1e-3 / (V.D * 1e-3), L = V.f * 1e-3 * th;
        // the layout: mirror, fan, lens, line
        const xp = W * 0.1, yp = Hh * 0.3, xl = W * 0.24, xt = W * 0.86, yt = yp + 0, half = Math.min(Hh * 0.2, (xt - xp) * 0.22);
        c.strokeStyle = C.accent; c.lineWidth = 1; c.globalAlpha = 0.5;
        c.beginPath(); c.moveTo(xp, yp); c.lineTo(xt, yp - half); c.moveTo(xp, yp); c.lineTo(xt, yp + half); c.stroke(); c.globalAlpha = 1;
        const bw = clamp(Math.log(V.D / 0.5) / Math.log(60) * 34 + 3, 3, 38);
        c.save(); c.strokeStyle = S.nm(V.nm, 0.3); c.lineWidth = bw; c.lineCap = 'butt'; c.beginPath(); c.moveTo(4, yp); c.lineTo(xp - 6, yp); c.stroke(); c.restore();
        S.ray(c, [[4, yp], [xp - 6, yp]], { nm: V.nm, width: 1.4, arrows: false });
        S.flatMirror(c, xp - 6, yp + 8, xp + 6, yp - 8, { width: 3 });
        S.thinLens(c, xl, yp, Math.min(26, half * 0.9), 1, { width: 2 });
        S.screen(c, xt, yp, half, { w: 3 });
        S.angle(c, xp, yp, 38, -Math.atan2(half, xt - xp), Math.atan2(half, xt - xp), 'θ', { color: C.warn, gap: 12 });
        kit.label(c, 'D = ' + fx(V.D, V.D < 10 ? 1 : 0) + ' mm', 6, yp - 8 - bw / 2, { color: C.muted, size: 11.5 });
        kit.label(c, 'line L = ' + fx(L * 1e3, 0) + ' mm', xt - 6, yp - half - 8, { align: 'right', color: C.muted, size: 11.5 });
        // a stretch of the line with ten spots at true size
        const sx0 = W * 0.08, sx1 = W * 0.92, sy = Hh * 0.62, bandW = sx1 - sx0;
        const dpx = bandW / 10.6;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.fillStyle = C.bg2; c.fillRect(sx0, sy - 14, bandW, 40);
        for (let i = 0; i < 10; i++) { const cx = sx0 + dpx * (i + 0.8); c.fillStyle = S.nm(V.nm, 0.55); c.beginPath(); c.arc(cx, sy + 6, dpx / 2 * 0.98, 0, TAU); c.fill(); c.strokeStyle = S.nm(V.nm); c.stroke(); }
        kit.label(c, 'ten touching spots, true size: each ' + lfmt(d), W / 2, sy - 26, { align: 'center', color: C.muted, size: 11.5, weight: 600 });
        kit.label(c, 'a piece of the line ' + lfmt(10 * d) + ' long, of ' + lfmt(L), W / 2, sy + 40, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, 'N = ' + grp(N) + ' spots', W / 2, Hh - 12, { align: 'center', color: C.text, size: 13, weight: 650 });
        // the plot
        const series = []; [10, 20, 40, 80].forEach((a, i) => { const pts = []; for (let k = 0; k <= 30; k++) { const Dm = 0.5 * Math.pow(60, k / 30); pts.push([Dm, Sc.resolvableSpots(a * D2R, Dm * 1e-3, V.nm, V.a)]); } series.push({ pts, label: a + '°', color: C.series[i] }); });
        plot.set({ x: { label: 'beam diameter (mm)', name: 'D', min: 0.5, max: 30, log: true }, y: { label: 'spots N', name: 'N', min: 10, max: 1e5, log: true }, series, marks: [{ x: V.D, y: Math.max(10, N), label: 'yours' }], hlines: [{ y: V.need, label: 'needed' }] });
        ro.set('N', grp(N) + ' spots  (a = ' + V.a + ')');
        ro.set('d', lfmt(d) + '  (a λ f / D)');
        ro.set('L', lfmt(L) + '  (f θ), so ' + grp(L / d) + ' spots of that size');
        ro.set('chk', N >= V.need ? 'enough: ' + fx(N / V.need, 2) + ' spots per pixel' : 'too few: only ' + fx(100 * N / V.need, 0) + ' % of the pixels');
        ro.set('inv', fx(V.th * D2R * V.D, 2) + ' rad·mm (unchanged by any scan lens)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ distortion of a two-mirror head */
  // Mirror 1 (axis z) turns the beam from +x towards +y; mirror 2 (axis x) turns it on to +z, towards a flat target a
  // distance Z beyond mirror 2; the two pivots are s12 apart. al, ga: the mirrors' mechanical turns (rad). The law of
  // reflection in three dimensions gives where the beam lands, measured from the middle of the field.
  function head2(al, ga, s12, Z) {
    const b = PI / 4 + al, d1x = Math.cos(2 * b), d1y = Math.sin(2 * b), m = PI / 4 + ga;
    const n2y = -Math.sin(m), n2z = Math.cos(m), s = s12 / d1y, hx = s * d1x, hy = s * d1y, dn = d1y * n2y;
    const d2x = d1x, d2y = d1y - 2 * dn * n2y, d2z = -2 * dn * n2z, t = Z / d2z;
    return [-(hx + t * d2x), -(hy + t * d2y - s12)];
  }
  // bilinear interpolation of a table of positions made on an n × n grid of commands in [-1, 1]
  function tabAt(tab, n, u, v) {
    const x = (clamp(u, -1, 1) + 1) / 2 * (n - 1), y = (clamp(v, -1, 1) + 1) / 2 * (n - 1), i = Math.min(n - 2, Math.floor(x)), j = Math.min(n - 2, Math.floor(y)), fx_ = x - i, fy_ = y - j;
    const a = tab[j * n + i], b = tab[j * n + i + 1], c = tab[(j + 1) * n + i], d = tab[(j + 1) * n + i + 1];
    return [a[0] * (1 - fx_) * (1 - fy_) + b[0] * fx_ * (1 - fy_) + c[0] * (1 - fx_) * fy_ + d[0] * fx_ * fy_, a[1] * (1 - fx_) * (1 - fy_) + b[1] * fx_ * (1 - fy_) + c[1] * (1 - fx_) * fy_ + d[1] * fx_ * fy_];
  }

  Hyper.sim('sm-distortion', {
    title: 'Distortion of a two-mirror scan head, and a look-up table that removes it',
    blurb: `The beam is traced exactly through two mirrors and on to a flat target (no scan lens), for a square grid of commands. The dashed grid is where the commands should land; the amber grid is where the head puts them: a pincushion, because a flat target is farther from the head off axis and the second mirror turns a beam the first has already turned sideways. The green grid is the result of a look-up table made by measuring where the head lands for the blue calibration points and correcting every command by interpolation; its errors are drawn enlarged by the factor you set.

**Try this**
- At the start (±10°, 250 mm, pivots 15 mm apart) the corners land about 10 mm out. Make the pivots 0 mm apart: almost all of the pincushion stays. It comes from two mirrors and a flat target, not from the spacing.
- Raise the number of calibration points from 5 to 9: the largest error left falls from about 1.1 mm to 0.3 mm; at 17 points it is 0.08 mm.
- Reduce the working distance to 100 mm: the field shrinks to ±40 mm and the errors shrink with it, but the percentages stay the same, because they depend only on the angles.
- Use *corrected* and raise the error magnification: what remains is the interpolation error between the calibration points.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 330, maxH: 470 });
      let cache = { key: '', d: null };
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Half-angle of each mirror (mechanical)', min: 2, max: 15, step: 0.5, value: params.A || 10, unit: '°' },
        { id: 'Z', label: 'Distance to the target', min: 100, max: 500, step: 10, value: params.Z || 250, unit: 'mm' },
        { id: 's12', label: 'Distance between the two pivots', min: 0, max: 40, step: 1, value: params.s12 != null ? params.s12 : 15, unit: 'mm' },
        { id: 'n', label: 'Calibration points per side', min: 2, max: 21, step: 1, value: params.n || 5 },
        { id: 'mag', label: 'Enlarge the errors of the corrected grid', min: 1, max: 50, value: 1, log: true, sig: 2, fmt: v => '× ' + kit.fmt(v, 2) },
        { id: 'view', type: 'select', label: 'Show', options: [['Uncorrected and corrected', 'both'], ['Uncorrected only', 'raw'], ['Corrected only', 'fix']], value: params.view || 'both' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Field the commands ask for'], ['edge', 'Middle of an edge lands'], ['corner', 'A corner lands'], ['raw', 'Largest error, uncorrected'], ['fix', 'Largest error, corrected'], ['pt', 'Spacing of the calibration points']]);
      const compute = () => {
        const key = [V.A, V.Z, V.s12, V.n].join();
        if (cache.key !== key) {
          const a = V.A * D2R, n = V.n, s12 = V.s12, Z = V.Z, gx = 2 * (Z + s12) * a, gy = 2 * Z * a, P = (u, v) => head2(u * a, v * a, s12, Z);
          const tab = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) tab.push(P(-1 + 2 * i / (n - 1), -1 + 2 * j / (n - 1)));
          // the command that makes the head land on the target point T (u, v in the ideal field): a few passes through the table
          const fix = (u, v) => { let cu = u, cv = v; for (let it = 0; it < 10; it++) { const p = tabAt(tab, n, cu, cv); cu -= (p[0] - gx * u) / gx; cv -= (p[1] - gy * v) / gy; } return [clamp(cu, -1, 1), clamp(cv, -1, 1)]; };
          const lines = [], NL = 9, NP = 26;
          for (let L = 0; L < NL; L++) {
            const w = -1 + 2 * L / (NL - 1), rawH = [], rawV = [], fixH = [], fixV = [], idH = [], idV = [];
            for (let k = 0; k < NP; k++) {
              const t = -1 + 2 * k / (NP - 1);
              rawH.push(P(t, w)); rawV.push(P(w, t)); idH.push([gx * t, gy * w]); idV.push([gx * w, gy * t]);
              const ch = fix(t, w), cv2 = fix(w, t); fixH.push(P(ch[0], ch[1])); fixV.push(P(cv2[0], cv2[1]));
            }
            lines.push({ rawH, rawV, fixH, fixV, idH, idV });
          }
          let eRaw = 0, eFix = 0;
          for (let j = 0; j <= 20; j++) for (let i = 0; i <= 20; i++) {
            const u = -1 + i / 10, v = -1 + j / 10, p = P(u, v), c = fix(u, v), q = P(c[0], c[1]);
            eRaw = Math.max(eRaw, Math.hypot(p[0] - gx * u, p[1] - gy * v)); eFix = Math.max(eFix, Math.hypot(q[0] - gx * u, q[1] - gy * v));
          }
          const e = P(1, 0), cn = P(1, 1);
          cache = { key, d: { lines, tab, gx, gy, eRaw, eFix, edge: e[0] / gx - 1, corner: cn[0] / gx - 1, node: tab.map(p => p) } };
        }
        return cache.d;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, d = compute(), n = V.n, mag = V.mag;
        const side = Math.max(90, Math.min(W - 16, Hh - 66)), x0 = (W - side) / 2, y0 = 22;
        // extent of everything drawn, so that the field fits the square
        let ext = Math.max(d.gx, d.gy);
        for (const p of d.tab) ext = Math.max(ext, Math.abs(p[0]), Math.abs(p[1]));
        for (const L of d.lines) for (const arr of [L.rawH, L.rawV]) for (const p of arr) ext = Math.max(ext, Math.abs(p[0]), Math.abs(p[1]));
        const k = side / 2 / (ext * 1.04), cx = x0 + side / 2, cy = y0 + side / 2, X = p => cx + p[0] * k, Y = p => cy - p[1] * k;
        c.fillStyle = C.bg2; c.fillRect(x0, y0, side, side);
        const poly = (arr, mapf) => { c.beginPath(); arr.forEach((p, i) => { const q = mapf ? mapf(p) : p; i ? c.lineTo(X(q), Y(q)) : c.moveTo(X(q), Y(q)); }); c.stroke(); };
        c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; for (const L of d.lines) { poly(L.idH); poly(L.idV); } c.setLineDash([]);
        if (V.view !== 'fix') { c.strokeStyle = C.warn; c.lineWidth = 1.6; for (const L of d.lines) { poly(L.rawH); poly(L.rawV); } }
        if (V.view !== 'raw') {
          c.strokeStyle = C.ok; c.lineWidth = 1.6;
          const mp = (arr, idArr) => arr.map((p, i) => [idArr[i][0] + mag * (p[0] - idArr[i][0]), idArr[i][1] + mag * (p[1] - idArr[i][1])]);
          for (const L of d.lines) { poly(mp(L.fixH, L.idH)); poly(mp(L.fixV, L.idV)); }
        }
        for (const p of d.tab) kit.dot(c, X(p), Y(p), 2.6, C.accent);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 + 0.5, side, side);
        kit.label(c, 'the target, seen from the head', W / 2, y0 - 10, { align: 'center', color: C.muted, size: 12, weight: 650 });
        // legend
        const ly = Hh - 30, items = [['ideal grid', C.muted, 0.04], ['uncorrected', C.warn, 0.36], ['corrected' + (mag > 1.05 ? ', errors × ' + fx(mag, 0) : ''), C.ok, 0.04, 1], ['calibration points', C.accent, 0.5, 1]];
        items.forEach(([t, col, xf, row]) => { const yy = ly + (row ? 16 : 0); c.fillStyle = col; c.fillRect(W * xf, yy - 4, 10, 8); kit.label(c, t, W * xf + 15, yy, { color: C.muted, size: 11 }); });
        ro.set('f', '±' + fx(d.gx, 0) + ' mm across, ±' + fx(d.gy, 0) + ' mm up');
        ro.set('edge', fx(100 * d.edge, 1) + ' % farther out than a linear scale');
        ro.set('corner', fx(100 * d.corner, 1) + ' % farther out across');
        ro.set('raw', fx(d.eRaw, 2) + ' mm  (' + fx(100 * d.eRaw / d.gx, 1) + ' % of the half-field)');
        ro.set('fix', fx(d.eFix, 2) + ' mm  (' + fx(100 * d.eFix / d.gx, 2) + ' %) with ' + n + ' × ' + n + ' points');
        ro.set('pt', fx(2 * d.gx / (n - 1), 0) + ' mm across the field');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ start-of-scan and the pixel clock */
  Hyper.sim('sm-sync', {
    title: 'Start-of-scan, pixel clock and the ragged edge of an unsynchronized scan',
    blurb: `A polygon printer draws one line per facet. Top: the spot sweeps the line past the **start-of-scan detector**. Middle: the detector’s pulse and the pixel clock that cuts the line into pixels. Bottom: a vertical bar printed line by line, magnified so that one cell is one pixel. Each facet is a little out of place, so its line starts early or late. **Without** the start-of-scan pulse each line simply starts at the nominal time and the bar comes out ragged; **with** it each line restarts its clock when the beam crosses the detector, and only the detector’s own timing jitter is left.

**Try this**
- Start with the pulse off and a 30″ facet error: the lines are displaced by about 1.4 pixels at 600 dpi. Tick *start-of-scan* and the edge straightens.
- With the pulse on, raise the detector’s jitter to 20 ns: at 1000 m/s each nanosecond is a micrometre, so the edge roughens again. The read-out shows what timing a tenth of a pixel needs.
- Change to 1200 dpi: the pixels halve and the same errors are twice as visible, and the clock doubles.
- Set the facet error to 0 with the pulse off: a perfect polygon needs no synchronisation (but none is perfect).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.98, minH: 390, maxH: 480 });
      let clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'sos', type: 'check', label: 'Restart the clock from the start-of-scan detector', value: !!params.sos },
        { id: 'eps', label: 'Facet angle error (largest)', min: 0, max: 60, step: 1, value: params.eps != null ? params.eps : 30, unit: '″' },
        { id: 'jit', label: 'Timing jitter of the detector pulse', min: 0, max: 20, step: 0.5, value: params.jit != null ? params.jit : 5, unit: 'ns' },
        { id: 'dpi', type: 'select', label: 'Resolution', options: [['300 dpi', 300], ['600 dpi', 600], ['1200 dpi', 1200]], value: params.dpi || 600 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['clk', 'Pixel clock'], ['v', 'Spot speed on the page'], ['pix', 'Pixel size'], ['f', 'A facet error shifts its line by'], ['j', 'Detector jitter shifts it by'], ['ok', 'Timing needed for a tenth of a pixel']]);
      const FL = 210e-3, LR = 3508, ETA = 0.7, FOC = 200e-3, M = 28, PER = 0.26, NF = 8;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        clk = (clk + dt) % ((M + 4) * PER);
        const row = Math.floor(clk / PER), u = (clk % PER) / PER, pitch = Sc.dpiPitch(V.dpi) * 1e6;     // µm
        const v = FL * LR / ETA, Np = Math.round(FL / (pitch * 1e-6));
        const shiftOf = r => V.sos ? (2 * hash(r, 7) - 1) * V.jit * 1e-9 * v * 1e6 / pitch : (2 * hash(r % NF, 1) - 1) * (2 * V.eps / 206265 * FOC * 1e6) / pitch;   // pixels
        // the scan line and the detector
        const xa = W * 0.07, xb = W * 0.93, X = uu => xa + uu * (xb - xa), yA = 52, w0 = 0.14, w1 = 0.84;
        c.fillStyle = C.bg2; c.fillRect(xa, yA - 7, xb - xa, 14);
        c.fillStyle = C.grid; c.fillRect(X(w0), yA - 7, X(w1) - X(w0), 14);
        const sosHit = u > 0.015 && u < 0.07 && row < M;
        c.fillStyle = sosHit ? C.warn : C.muted; c.fillRect(X(0.03) - 5, yA - 16, 10, 9);
        if (row < M) kit.dot(c, X(u), yA, 5, C.warn, C.text);
        kit.label(c, 'start-of-scan detector', xa, yA - 28, { color: C.muted, size: 11.5, weight: 600 });
        kit.label(c, 'active part of the line', X((w0 + w1) / 2), yA + 21, { align: 'center', color: C.faint, size: 11 });
        // the timing diagram
        const tr = [100, 128, 156], tx = X(0), tw = xb - xa;
        ['start-of-scan pulse', 'pixel clock (24 ticks of ' + grp(Np) + ' shown)', 'data'].forEach((t, i) => kit.label(c, t, xa, tr[i] - 12, { color: C.muted, size: 11 }));
        c.strokeStyle = sosHit ? C.warn : C.text; c.lineWidth = 1.8; c.beginPath(); c.moveTo(X(0), tr[0] + 6); c.lineTo(X(0.02), tr[0] + 6); c.lineTo(X(0.02), tr[0] - 5); c.lineTo(X(0.06), tr[0] - 5); c.lineTo(X(0.06), tr[0] + 6); c.lineTo(X(1), tr[0] + 6); c.stroke();
        for (let i = 0; i < 24; i++) { const xx = X(w0 + (w1 - w0) * (i + 0.5) / 24); c.strokeStyle = (row < M && X(u) > xx) ? C.accent : C.faint; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xx, tr[1] + 6); c.lineTo(xx, tr[1] - 5); c.stroke(); }
        c.fillStyle = C.bg2; c.fillRect(X(w0), tr[2] - 5, X(w1) - X(w0), 11); if (row < M) { c.fillStyle = C.accent; c.globalAlpha = 0.6; c.fillRect(X(w0), tr[2] - 5, Math.max(0, Math.min(X(u), X(w1)) - X(w0)), 11); c.globalAlpha = 1; }
        c.strokeStyle = C.warn; c.lineWidth = 1; if (row < M) { c.beginPath(); c.moveTo(X(u), yA + 8); c.lineTo(X(u), tr[2] + 8); c.stroke(); }
        // what is printed: a bar six pixels wide, line by line
        const cw = Math.max(6, Math.min(14, W * 0.028)), px0 = W / 2 - 3 * cw, py0 = 188, rh = Math.max(3, (Hh - py0 - 30) / M);
        kit.label(c, 'printed bar, magnified: one cell is one pixel', W / 2, py0 - 12, { align: 'center', color: C.muted, size: 11.5, weight: 600 });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(px0, py0); c.lineTo(px0, py0 + M * rh); c.moveTo(px0 + 6 * cw, py0); c.lineTo(px0 + 6 * cw, py0 + M * rh); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.text;
        for (let r = 0; r < Math.min(row, M); r++) c.fillRect(px0 + shiftOf(r) * cw, py0 + r * rh, 6 * cw, rh - 0.6);
        // numbers
        const f1 = 2 * V.eps / 206265 * FOC * 1e6, j1 = v * V.jit * 1e-9 * 1e6;
        ro.set('clk', fx(Np * LR / ETA / 1e6, 1) + ' MHz  (' + grp(Np) + ' pixels × ' + grp(LR) + ' lines/s ÷ ' + ETA + ')');
        ro.set('v', fx(v, 0) + ' m/s along the line');
        ro.set('pix', fx(pitch, 1) + ' µm');
        ro.set('f', fx(f1, 0) + ' µm = ' + fx(f1 / pitch, 2) + ' pixels (f = 200 mm)');
        ro.set('j', fx(j1, 1) + ' µm = ' + fx(j1 / pitch, 2) + ' pixels');
        ro.set('ok', fx(0.1 * pitch * 1e-6 / v * 1e9, 1) + ' ns');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
