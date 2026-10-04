/* HYPER-OPTICS · sims/optometry-methods.js — simulations of the topic "The optometrist's methods".
 *   op-exam           a made-up patient taken through the seven stages of an eye examination; the record card fills in
 *   op-acuity         a Snellen or logMAR chart seen through a defocused eye: the blur disc, the line still read, the notations
 *   op-retinoscopy    the streak reflex in the pupil: with, against or neutral, the far point and the working-distance lens
 *   op-hartmann       a ring of apertures (Scheiner) or a lenslet array (Shack–Hartmann): spot shifts, fitted sphere/cylinder/axis, wavefront maps
 *   op-refraction     trial lenses, the Jackson cross cylinder and the red–green test on a blurred chart: a hidden patient to refract
 *   op-keratometry    the cornea as a convex mirror: mire image size, Placido rings on a toric or conical cornea, a curvature map
 *   op-slitlamp       a slit beam through the cornea and lens: the optical section, its apparent thickness against the angle
 *   op-ophthalmoscope the fundus through a direct ophthalmoscope, an indirect lens and a fundus camera: field and magnification
 *   op-tonometry      applanation: force, flattened area and pressure (Imbert–Fick), the two half-rings of the Goldmann view
 *   op-perimetry      a static threshold field: 4–2 dB staircases at 54 points, the number grid, the grey map, the blind spot
 *   op-ishihara       a pseudo-isochromatic dot plate and how it looks with a colour-vision deficiency (a demonstration, not a test)
 *   op-cover          the cover–uncover test: phorias and tropias, with the movements the examiner watches for
 *   op-oct            a B-scan of a model macula and one A-scan: axial resolution set by the source bandwidth
 * Numbers come from kit.optics (O.eye, O.colour, O.mirrorImage, O.sys) and the drawing from kit.osym.
 * The local numerics are small: the blur of a chart by the image of the pupil, the least-squares fit of a power matrix, a staircase.
 * Every model patient is made up; nothing here is a test or a diagnosis.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180, R2D = 180 / PI, ARC = 180 / PI * 60;     // ARC: arc-minutes in a radian
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (v, s) => Number.isFinite(v) ? String(+Number(v).toPrecision(s || 3)) : '—';
  const sd = (v, d) => (v < -1e-9 ? '−' : '+') + Math.abs(v).toFixed(d == null ? 2 : d);          // a signed number with a true minus
  const rxText = r => {
    const s = Math.abs(r.sph) < 1e-9 ? 'plano' : sd(r.sph);
    return Math.abs(r.cyl) < 1e-9 ? (s === 'plano' ? 'plano' : s + ' DS') : s + ' ' + sd(r.cyl) + ' × ' + ((Math.round(r.axis) % 180) || 180);
  };
  const mulberry = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const grey = v => { const k = Math.round(255 * clamp(v, 0, 1)); return 'rgb(' + k + ',' + k + ',' + k + ')'; };
  const niceStep = (span, n) => (typeof Hyper !== 'undefined' && Hyper.niceStep) ? Hyper.niceStep(span, n) : span / n;

  /* word-wrapped text drawn line by line: returns the y after the last line */
  function wrap(kit, c, text, x, y, maxW, o) {
    o = o || {};
    const size = o.size || 12.5, lh = o.lh || size * 1.42, per = Math.max(8, Math.floor(maxW / (size * 0.54)));
    const words = String(text).split(' '); let line = '';
    const out = () => { if (line) { kit.label(c, line, x, y, { size, color: o.color, weight: o.weight, align: o.align, baseline: 'alphabetic' }); y += lh; line = ''; } };
    for (const w of words) { if ((line + ' ' + w).trim().length > per) out(); line = (line ? line + ' ' : '') + w; }
    out();
    return y;
  }

  /* ---------------------------------------------------------------- power matrices
     A sphero-cylinder in minus-cylinder form (sph, cyl, axis in degrees anticlockwise as drawn) as the symmetric matrix
     [xx, xy, yy] of its powers in dioptres: power along a meridian w is sph + cyl sin²(θw − axis), as O.eye.meridian says. */
  const pmat = (sph, cyl, axis) => { const a = axis * D2R, s = Math.sin(a), c = Math.cos(a); return [sph + cyl * s * s, -cyl * s * c, sph + cyl * c * c]; };
  const msub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const madd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  /* and back: the more plus principal power is the sphere, the difference is the (minus) cylinder, the axis the direction of the sphere meridian */
  function toRx(m) {
    const mean = (m[0] + m[2]) / 2, d = Math.hypot((m[0] - m[2]) / 2, m[1]);
    let ax = 0.5 * Math.atan2(2 * m[1], m[0] - m[2]) * R2D; ax = ((ax % 180) + 180) % 180;
    return { sph: mean + d, cyl: -2 * d, axis: d < 1e-6 ? 0 : ax, M: mean, B: Math.hypot(mean, d) };
  }

  /* ---------------------------------------------------------------- letters on a 5 × 5 grid and the charts made of them */
  const LET = {
    C: ['.###.', '#...#', '#....', '#...#', '.###.'], D: ['####.', '#...#', '#...#', '#...#', '####.'], H: ['#...#', '#...#', '#####', '#...#', '#...#'],
    K: ['#...#', '#..#.', '###..', '#..#.', '#...#'], N: ['#...#', '##..#', '#.#.#', '#..##', '#...#'], O: ['.###.', '#...#', '#...#', '#...#', '.###.'],
    R: ['####.', '#...#', '####.', '#..#.', '#...#'], S: ['.####', '#....', '.###.', '....#', '####.'], V: ['#...#', '#...#', '#...#', '.#.#.', '..#..'],
    Z: ['#####', '...#.', '..#..', '.#...', '#####']
  };
  const CHARTS = {
    snellen: { name: 'Snellen chart (letters per line grow)', W: 200, H: 250, rows: [[200, 'H'], [100, 'VZ'], [70, 'NDK'], [50, 'CRHS'], [40, 'OVZDK'], [30, 'SHNCRV'], [25, 'ZKODSNC'], [20, 'CNHRKZSD']], space: 0.8 },
    etdrs: { name: 'logMAR chart (five letters per line)', W: 440, H: 260, rows: [[20 * Math.pow(10, 0.8), 'DKSNR'], [20 * Math.pow(10, 0.6), 'CVHZO'], [20 * Math.pow(10, 0.5), 'NRDHS'], [20 * Math.pow(10, 0.4), 'KOVCZ'], [20 * Math.pow(10, 0.3), 'SDNKR'], [20 * Math.pow(10, 0.2), 'HCOVD'], [20 * Math.pow(10, 0.1), 'ZRSNK'], [20, 'DHCNV'], [20 * Math.pow(10, -0.1), 'OKZSR']], space: 1 }
  };
  const chartCache = {};
  /* the chart drawn sharp (ink 0…1) on a buffer; arc-minutes map to buffer pixels by `ppa`; rows come back with their pixel positions */
  function buildChart(kind) {
    if (chartCache[kind]) return chartCache[kind];
    const ch = CHARTS[kind], W = ch.W, H = ch.H, src = new Float32Array(W * H), rows = [];
    // layout in arc-minutes: letter height h = 5·den/20; letters spaced by space·h; the gap between lines 0.9 of the lower line
    let hArc = 0, wArc = 0;
    const lay = ch.rows.map(([den, txt], i) => { const h = 5 * den / 20, w = txt.length * h + (txt.length - 1) * ch.space * h; hArc += h + (i ? Math.max(3, 0.9 * h) : 0); wArc = Math.max(wArc, w); return { den, txt, h, w }; });
    const ppa = Math.min((W - 10) / wArc, (H - 10) / hArc);
    let y = (H - hArc * ppa) / 2;
    lay.forEach((r, i) => {
      const hp = r.h * ppa, wp = r.w * ppa, x0 = (W - wp) / 2;
      if (i) y += Math.max(3, 0.9 * r.h) * ppa;
      const xs = []; for (let k = 0; k < r.txt.length; k++) xs.push(x0 + k * (1 + ch.space) * hp);
      for (let k = 0; k < r.txt.length; k++) letter(src, W, H, r.txt[k], xs[k], y, hp);
      rows.push({ den: r.den, txt: r.txt, y: y, h: hp, x0, wp });
      y += hp;
    });
    return (chartCache[kind] = { W, H, src, rows, ppa, kind });
  }
  function letter(buf, W, H, chr, x0, y0, ps) {
    const g = LET[chr];
    for (let j = Math.max(0, Math.floor(y0)); j < Math.min(H, Math.ceil(y0 + ps)); j++) for (let i = Math.max(0, Math.floor(x0)); i < Math.min(W, Math.ceil(x0 + ps)); i++) {
      let s = 0;
      for (let b = 0; b < 3; b++) for (let a = 0; a < 3; a++) {
        const u = (i + (a + 0.5) / 3 - x0) / ps * 5, v = (j + (b + 0.5) / 3 - y0) / ps * 5;
        if (u >= 0 && u < 5 && v >= 0 && v < 5 && g[Math.floor(v)][Math.floor(u)] === '#') s++;
      }
      buf[j * W + i] = Math.max(buf[j * W + i], s / 9);
    }
  }
  /* The picture seen through an eye with a residual power error: every point of the chart becomes the image of the pupil mapped by the
     residual power matrix m (dioptres): a disc for a sphere, an ellipse or a line for a cylinder. rho: pupil radius in metres, ppa: pixels per
     arc-minute. The disc is sampled by n points of a Fibonacci spiral; the picture is the mean of n shifted copies of the sharp chart. */
  function blurChart(src, W, H, m, rho, ppa) {
    const k = ARC * rho * ppa, ex = Math.hypot(m[0], m[1]) * k, ey = Math.hypot(m[1], m[2]) * k, ext = Math.max(ex, ey);
    if (ext < 0.3) return src;
    const n = clamp(Math.ceil(ext * ext * 1.8), 3, 64), dx = new Float32Array(n), dy = new Float32Array(n);
    for (let i = 0; i < n; i++) { const r = Math.sqrt((i + 0.5) / n), a = i * 2.399963229728653, ux = r * Math.cos(a), uy = r * Math.sin(a); dx[i] = (m[0] * ux + m[1] * uy) * k; dy[i] = -(m[1] * ux + m[2] * uy) * k; }
    const out = new Float32Array(W * H), lin = ext > 7;
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      let s = 0;
      for (let q = 0; q < n; q++) {
        const x = i + dx[q], y = j + dy[q];
        if (lin) { const xi = Math.round(x), yi = Math.round(y); if (xi >= 0 && yi >= 0 && xi < W && yi < H) s += src[yi * W + xi]; }
        else {
          const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
          const g = (a, b) => (a >= 0 && b >= 0 && a < W && b < H) ? src[b * W + a] : 0;
          s += g(x0, y0) * (1 - fx) * (1 - fy) + g(x0 + 1, y0) * fx * (1 - fy) + g(x0, y0 + 1) * (1 - fx) * fy + g(x0 + 1, y0 + 1) * fx * fy;
        }
      }
      out[j * W + i] = s / n;
    }
    return out;
  }
  /* the chart lines in the three notations */
  const SNELLEN_LINES = [200, 100, 70, 50, 40, 30, 25, 20];
  const nearestLine = x => SNELLEN_LINES.reduce((a, b) => Math.abs(Math.log(b / x)) < Math.abs(Math.log(a / x)) ? b : a);
  const metric = den => { const m = den * 0.3; return '6/' + (Math.abs(m - Math.round(m)) < 0.05 ? Math.round(m) : m.toFixed(1)); };
  const lineName = den => '20/' + den + ' (' + metric(den) + ')';

  /* ================================================================ the examination, stage by stage */
  Hyper.sim('op-exam', {
    title: 'An eye examination, stage by stage',
    blurb: `A made-up patient is taken through the seven stages of a routine eye examination. Each stage has **one question**, an instrument that answers it, and a line that goes onto the record card. The order matters: every stage uses what the one before it found.

**Try this**
- Step through with **Next**: the card on the right grows. Notice that the refraction (stages 3 and 4) comes *after* the acuity and *before* the health checks, so that the eye is looked at with its best correction in mind.
- At stage 2 the unaided acuity is worked out from the patient's refraction with the same rule of thumb as the chart simulation; at stage 4 the corrected acuity returns to 20/20.
- Count how many stages measure the *optics* of the eye (2 to 5) and how many look at its *health* (1, 6 and 7): the two halves of an examination answer different questions.

*The patient is invented, and so are the findings. This is an order of work, not a test and not a diagnosis.*`,
    mount(box, kit, params) {
      const O = kit.optics, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 430, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'stage', label: 'Stage of the examination', min: 1, max: 7, step: 1, value: params.stage || 1, fmt: v => 'stage ' + Math.round(v) },
        { type: 'buttons', items: [{ id: 'back', label: '◀ Previous' }, { id: 'next', label: 'Next ▶', primary: true }] }
      ], id => {
        if (id === 'next') ctl.set('stage', Math.min(7, Math.round(V.stage) + 1));
        else if (id === 'back') ctl.set('stage', Math.max(1, Math.round(V.stage) - 1));
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Question of this stage'], ['tool', 'Instrument'], ['unit', 'Result is recorded as'], ['rec', 'Record card so far']]);
      const PT = { od: { sph: -1.25, cyl: -0.5, axis: 180 }, os: { sph: -1.0, cyl: -0.25, axis: 170 } };
      const blurB = r => Math.hypot(r.sph + r.cyl / 2, r.cyl / 2);
      const un = r => nearestLine(E.acuityFromDefocus(blurB(r)));
      const STAGES = [
        { name: 'Case history', abbr: 'History', ask: 'Why has this person come, and what could be affecting their eyes?', tool: 'Questions only', unit: 'Words: symptoms, health, medicines, family, work',
          note: 'Tells the examiner which tests matter and how long to spend on each.', rec: 'distance blurred, tired eyes after screen work; well; a parent treated for raised eye pressure' },
        { name: 'Visual acuity', abbr: 'Acuity', ask: 'How small a detail can each eye resolve, with and without its glasses?', tool: 'Letter chart at 6 m (20 ft)', unit: 'A Snellen fraction or a logMAR number',
          note: 'The first number, taken before anything is changed: a baseline to improve on.', rec: 'unaided: right ' + lineName(un(PT.od)) + ', left ' + lineName(un(PT.os)) + '; no glasses' },
        { name: 'Objective refraction', abbr: 'Objective', ask: 'What does the optics of each eye need, measured without asking the patient?', tool: 'Autorefractor, retinoscope', unit: 'Sphere, cylinder × axis in dioptres',
          note: 'A fast, repeatable starting point for the stage that follows.', rec: 'right ' + rxText({ sph: -1.25, cyl: -0.5, axis: 178 }) + '; left ' + rxText({ sph: -1.0, cyl: -0.25, axis: 168 }) },
        { name: 'Subjective refraction', abbr: 'Subjective', ask: 'Which lens gives this person the clearest and most comfortable picture?', tool: 'Phoropter or trial frame', unit: 'The same notation, now with acuity',
          note: 'The patient\'s answers refine the machine\'s numbers; the final prescription is a judgement.', rec: 'right ' + rxText(PT.od) + '; left ' + rxText(PT.os) + '; 20/20 with each, balanced' },
        { name: 'Binocular function', abbr: 'Binocular', ask: 'Do the two eyes point, focus and work together without strain?', tool: 'Cover test, prisms, near-point rule', unit: 'Prism dioptres (Δ), centimetres, dioptres',
          note: 'Explains symptoms that glasses alone do not: strain, double vision, headaches.', rec: 'cover test: no movement at 6 m, 4 Δ exophoria at 40 cm; near point of convergence 7 cm' },
        { name: 'Eye health: front', abbr: 'Front', ask: 'Are the lids, cornea, lens and the eye\'s pressure healthy?', tool: 'Slit lamp, tonometer', unit: 'Descriptions; pressure in mmHg',
          note: 'The slit lamp magnifies the front of the eye in section; the tonometer measures the pressure.', rec: 'cornea and lens clear; eye pressure right 14, left 15 mmHg' },
        { name: 'Eye health: back', abbr: 'Back', ask: 'Are the optic disc, the macula and the retina healthy?', tool: 'Ophthalmoscope, fundus camera, OCT; a field test if indicated', unit: 'Descriptions, photographs, scans',
          note: 'Looks through the pupil at the nerve and retina; the first sign of some conditions is here.', rec: 'optic discs healthy-looking, cup-to-disc ratio 0.3; macula normal; no further tests' }
      ];
      const icon = (c, k, x, y, C) => {
        c.save(); c.strokeStyle = C.accent; c.fillStyle = C.accent; c.lineWidth = 1.8; c.lineCap = 'round';
        if (k === 0) { c.beginPath(); c.rect(x - 24, y - 17, 48, 28); c.stroke(); c.beginPath(); c.moveTo(x - 8, y + 11); c.lineTo(x - 14, y + 20); c.lineTo(x, y + 11); c.stroke(); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x - 17, y - 9 + i * 8); c.lineTo(x + 17 - i * 6, y - 9 + i * 8); c.stroke(); } }
        else if (k === 1) { [18, 12, 8, 5].forEach((s, i) => { kit.label(c, 'EFPT'[i], x - 30 + i * 20 - (i > 0 ? i * 3 : 0), y - 8 + i * 6, { size: s * 1.5, color: C.accent, weight: 700, align: 'center' }); }); }
        else if (k === 2 || k === 3) { c.beginPath(); c.arc(x + 12, y, 15, 0, TAU); c.stroke(); c.beginPath(); c.arc(x - 14, y, 14, 0, TAU); c.stroke(); if (k === 3) { c.beginPath(); c.arc(x - 14, y, 7, 0, TAU); c.stroke(); } else { for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(x - 36, y + i * 6); c.lineTo(x - 28, y + i * 6); c.stroke(); } } }
        else if (k === 4) { c.beginPath(); c.arc(x - 12, y + 6, 9, 0, TAU); c.arc(x + 12, y + 6, 9, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(x - 12, y - 4); c.lineTo(x, y - 20); c.lineTo(x + 12, y - 4); c.stroke(); c.fillRect(x - 3, y - 24, 6, 6); }
        else if (k === 5) { c.beginPath(); c.arc(x + 8, y, 17, 0, TAU); c.stroke(); c.save(); c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 30, y - 12); c.lineTo(x + 2, y - 1); c.stroke(); c.restore(); }
        else { c.beginPath(); c.arc(x, y, 20, 0, TAU); c.stroke(); c.fillStyle = C.warn; c.beginPath(); c.arc(x + 8, y - 2, 5, 0, TAU); c.fill(); c.strokeStyle = C.bad; c.beginPath(); c.moveTo(x + 8, y - 2); c.quadraticCurveTo(x - 6, y - 10, x - 14, y - 4); c.moveTo(x + 8, y - 2); c.quadraticCurveTo(x - 4, y + 8, x - 13, y + 5); c.stroke(); }
        c.restore();
      };
      let tiles = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = clamp(Math.round(V.stage), 1, 7) - 1, S0 = STAGES[s];
        const wide = W >= 560, pad = 12;
        // the strip of stages
        tiles = []; const tw = (W - 2 * pad) / 7;
        for (let i = 0; i < 7; i++) {
          const x = pad + i * tw + tw / 2, on = i === s, done = i < s;
          tiles.push({ x: pad + i * tw, w: tw, i });
          c.fillStyle = on ? C.accent : done ? C.ok : C.surface; c.strokeStyle = on ? C.accent : C.border; c.lineWidth = 1.2;
          c.beginPath(); c.arc(x, 24, 13, 0, TAU); c.fill(); c.stroke();
          kit.label(c, String(i + 1), x, 24, { align: 'center', size: 12.5, weight: 700, color: on || done ? '#fff' : C.muted });
          kit.label(c, tw > 70 ? STAGES[i].abbr : '', x, 48, { align: 'center', size: 11, color: on ? C.text : C.muted, weight: on ? 650 : 500 });
          if (i < 6) { c.strokeStyle = done ? C.ok : C.border; c.beginPath(); c.moveTo(x + 14, 24); c.lineTo(x + tw - 14, 24); c.stroke(); }
        }
        // the stage card
        const top = 66, cw = wide ? Math.round(W * 0.56) - pad : W - 2 * pad;
        c.fillStyle = C.surface; c.strokeStyle = C.border; c.lineWidth = 1;
        c.beginPath(); c.rect(pad, top, cw, Hh - top - pad); c.fill(); c.stroke();
        icon(c, s, pad + 54, top + 40, C);
        let y = wrap(kit, c, 'Stage ' + (s + 1) + ' · ' + S0.name, pad + 108, top + 26, cw - 120, { size: 14.5, weight: 700, lh: 18 }) + 2;
        y = wrap(kit, c, S0.ask, pad + 108, y, cw - 120, { size: 12.5, color: C.text });
        y = Math.max(y, top + 84) + 6;
        const rowsText = [['Instrument', S0.tool], ['Recorded as', S0.unit], ['Why it comes here', S0.note]];
        for (const [k, v] of rowsText) { kit.label(c, k, pad + 14, y, { size: 11.5, color: C.faint, weight: 650, baseline: 'alphabetic' }); y = wrap(kit, c, v, pad + 14, y + 16, cw - 28, { size: 12.5, color: C.text }) + 6; }
        // the record card
        if (wide) {
          const rx = pad + cw + 10, rw = W - rx - pad;
          c.fillStyle = C.bg2; c.strokeStyle = C.border2; c.beginPath(); c.rect(rx, top, rw, Hh - top - pad); c.fill(); c.stroke();
          kit.label(c, 'Record card — a made-up patient', rx + 10, top + 16, { size: 12, weight: 700 });
          let yy = top + 38;
          for (let i = 0; i <= s; i++) {
            yy = wrap(kit, c, (i + 1) + ' ' + STAGES[i].abbr + ' — ' + STAGES[i].rec, rx + 10, yy, rw - 28, { size: 11, color: i === s ? C.text : C.muted, weight: i === s ? 600 : 500, lh: 14 }) + 5;
          }
        }
        ro.set('q', S0.ask); ro.set('tool', S0.tool); ro.set('unit', S0.unit);
        ro.set('rec', STAGES.slice(0, s + 1).map((x, i) => (i + 1) + ' ' + x.abbr + ': ' + x.rec).join(' · '));
      }, box.stage);
      kit.click(st, p => { for (const t of tiles) if (p.x >= t.x && p.x < t.x + t.w && p.y < 58) { ctl.set('stage', t.i + 1); loop.once(); return; } }, p => p.y < 58);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the chart seen through a defocused eye */
  Hyper.sim('op-acuity', {
    title: 'A letter chart seen through a defocused eye',
    blurb: `A chart is drawn the way the retina receives it. Every point of the chart becomes a disc the size of the image of the pupil whenever the eye is out of focus; the picture is that smearing, line by line. The columns name each line in four ways: Snellen in feet, Snellen in metres, decimal, and logMAR.

**Try this**
- Start at 1 D of defocus (a typical mild short-sightedness left uncorrected): the 20/20 line is gone, and the line marked is about the smallest that can still be read. The same eye with its glasses reads 20/20.
- Make the pupil larger: the blur disc grows in proportion to the pupil, which is why vision at dusk, with wide pupils, is worse for the same error. A small pupil is a pinhole that hides defocus.
- Switch to the logMAR chart: five letters on every line, each line 0.1 log unit (26 %) smaller than the one above. The graph shows how acuity falls with defocus: the logMAR number rises steadily, about 0.5 for each dioptre in the first dioptre or two.
- Letters are drawn on the 5 × 5 grid: the 20/20 letter is 5 arc-minutes tall, each stroke 1 arc-minute.

*Geometrical blur of an ideal eye with a round pupil: a little harsher than real vision, which also uses the bright core of its blur. Acuity depends on contrast and on the viewer; the 20/x read-out is the usual clinical rule of thumb, not a measurement.*`,
    mount(box, kit, params) {
      const O = kit.optics, E = O.eye, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 460 });
      const plot = kit.plot(box.stage, { x: { label: 'defocus (D)', name: 'D', min: 0, max: 4 }, y: { label: 'logMAR', name: 'logMAR', min: 0, max: 1.6 }, series: [] }, 130);
      const ctl = kit.controls(box.side, [
        { id: 'chart', type: 'select', label: 'Chart', options: [['Snellen letters', 'snellen'], ['logMAR (ETDRS style)', 'etdrs']], value: params.chart || 'snellen' },
        { id: 'D', label: 'Defocus of the eye', min: 0, max: 4, step: 0.25, value: params.D != null ? params.D : 1, unit: 'D' },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: params.pupil || 4, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['blur', 'Blur disc on the retina (diameter)'], ['acu', 'Smallest line still read (rule of thumb)'], ['log', 'logMAR of that line'], ['mm', 'Letter height of that line at 6 m'], ['ref', 'The 20/20 letter at 6 m']]);
      let cur = { key: '', out: null };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, ch = buildChart(V.chart);
        const eq = V.D * V.pupil / 4;                                                // the same blur expressed for the 4 mm pupil of the rule
        const den = E.acuityFromDefocus(eq), line = nearestLine(den);
        const rho = V.pupil * 1e-3 / 2, diam = E.blurAngle(V.D, V.pupil) * ARC;
        const key = [V.chart, V.D, V.pupil].join();
        if (cur.key !== key) { cur = { key, out: blurChart(ch.src, ch.W, ch.H, [V.D, 0, V.D], rho, ch.ppa) }; }
        // the picture, the labels beside it
        const labW = W >= 520 ? 184 : 92, aw = W - labW - 12, ah = Hh - 12, sc = Math.min(aw / ch.W, ah / ch.H), iw = ch.W * sc, ih = ch.H * sc, ix = labW + (aw - iw) / 2, iy = (Hh - ih) / 2;
        S.image(c, ix, iy, iw, ih, ch.W, ch.H, (u, v) => 0.97 - 0.92 * cur.out[Math.min(ch.H - 1, Math.floor(v * ch.H)) * ch.W + Math.min(ch.W - 1, Math.floor(u * ch.W))], { key: 'ac|' + key, id: 'chart' });
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(ix - 0.5, iy - 0.5, iw + 1, ih + 1);
        const cols = W >= 520 ? [0, 44, 84, 128] : [0, 48]; const heads = W >= 520 ? ['20/', '6/', 'dec.', 'logMAR'] : ['20/', '6/'];
        heads.forEach((h, i) => kit.label(c, h, 10 + cols[i], 12, { size: 10.5, color: C.faint, weight: 650 }));
        let best = null;
        for (const r of ch.rows) { if (!best || Math.abs(Math.log(r.den / den)) < Math.abs(Math.log(best.den / den))) best = r; }
        for (const r of ch.rows) {
          const yc = iy + (r.y + r.h / 2) * sc, on = r === best;
          const vals = [String(Math.round(r.den)), metric(r.den).slice(2), (20 / r.den).toFixed(2), E.logmar(r.den).toFixed(2)];
          if (on) { c.fillStyle = C.accent; c.globalAlpha = 0.16; c.fillRect(4, yc - 9, labW + iw + (aw - iw) / 2 - 4, 18); c.globalAlpha = 1; }
          vals.slice(0, cols.length).forEach((t, i) => kit.label(c, t, 10 + cols[i], yc, { size: 11, color: on ? C.accent : C.muted, weight: on ? 700 : 500 }));
        }
        ro.set('blur', fmt(diam, 3) + ' arc-minutes  (D × pupil)');
        ro.set('acu', lineName(line));
        ro.set('log', E.logmar(line).toFixed(2));
        ro.set('mm', (E.letterHeight(6, line) * 1000).toFixed(1) + ' mm');
        ro.set('ref', (E.letterHeight(6, 20) * 1000).toFixed(2) + ' mm  (5 arc-minutes)');
        const pts = []; for (let d = 0; d <= 4.001; d += 0.125) pts.push([d, E.logmar(E.acuityFromDefocus(d * V.pupil / 4))]);
        plot.set({ series: [{ pts, label: 'logMAR against defocus', color: C.series[0] }], marks: [{ x: V.D, y: E.logmar(den), label: lineName(line).split(' ')[0] }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ retinoscopy */
  Hyper.sim('op-retinoscopy', {
    title: 'Retinoscopy: the reflex in the pupil',
    blurb: `The examiner sweeps a streak of light across the pupil and watches the red reflex from the retina. Above: the geometry. Light leaving the eye converges to the eye's **far point** (or seems to diverge from a point behind it). If the examiner sits *before* that point the reflex moves **with** the streak; if *beyond* it, **against** it; if exactly at it, the whole pupil fills at once: **neutral**. Below: the pupil as the examiner sees it.

**Try this**
- Start with an eye that needs −3 D, examined at 67 cm: the reflex runs **against** the streak. Press **Neutralise**: the trial lens (−1.5 D) puts the far point at the examiner and the pupil fills with light at once.
- The lens that neutralises is not the answer yet. Subtract the **working-distance lens**, 1/d = 1.5 D at 67 cm: the gross lens −1.5 D minus 1.5 D leaves −3.0 D, the eye's own refraction (see the read-outs).
- Set the eye to +2 D with no lens: **with** movement, slow and dim. Add plus lenses and the reflex speeds up and brightens as neutrality nears; go past it and it turns to **against**.
- Drag the examiner (on the left) closer or farther: the working-distance lens changes, and with it the lens that neutralises.

*The streak is swept across one meridian only; an astigmatic eye needs the streak turned through other meridians (see the page).*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 380, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'K', label: 'The eye needs (its refraction)', min: -6, max: 6, step: 0.25, value: params.K != null ? params.K : -3, unit: 'D' },
        { id: 'P', label: 'Trial lens held in front', min: -8, max: 8, step: 0.25, value: params.P || 0, unit: 'D' },
        { id: 'd', label: 'Working distance', min: 40, max: 100, step: 1, value: params.d || 67, unit: 'cm' },
        { id: 'auto', type: 'check', label: 'Sweep the streak by itself', value: params.auto !== false },
        { id: 's', label: 'Streak position (when not sweeping)', min: -1, max: 1, step: 0.05, value: 0 },
        { type: 'buttons', items: [{ id: 'neut', label: 'Neutralise', primary: true }, { id: 'zero', label: 'No lens' }] }
      ], id => {
        if (id === 'neut') ctl.set('P', clamp(Math.round((V.K + 100 / V.d) * 4) / 4, -8, 8));
        else if (id === 'zero') ctl.set('P', 0);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kn', 'Error left for the examiner (eye − lens)'], ['fp', 'Far point of eye and lens'], ['reflex', 'The reflex moves'], ['speed', 'Speed and brightness'], ['gross', 'Gross lens that neutralises'], ['wd', 'Working-distance lens, 1/d'], ['net', 'Net result (gross − 1/d)']]);
      let geo = { xE: 0, sx: 1, yE: 0, xp: 0 };
      kit.drag(st, {
        hover: true,
        hit: p => (p.y < st.H * 0.5 && Math.abs(p.x - geo.xE) < 34) ? 'ex' : null,
        move: (what, p) => { ctl.set('d', clamp(Math.round((geo.xp - p.x) / geo.sx * 100), 40, 100)); }
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const d = V.d / 100, Kn = V.K - V.P, Rres = Kn + 1 / d, dir = Rres > 0 ? 1 : -1, neutral = Math.abs(Rres) < 0.13;
        const s = V.auto ? Math.sin(t * 2.1) : V.s;
        // ---- the geometry above
        const yA = Hh * 0.25, r = 26, xEye = W - 54;
        S.eye(c, xEye, yA, r, { dir: -1, pupil: 0.3 });
        const xp = xEye - 0.78 * r, hp = 0.3 * r, sx = (xp - 26) / 1.15;
        geo = { xE: xp - d * sx, sx, yE: yA, xp };
        S.axis(c, 14, yA, xEye - r * 1.1);
        // the beam leaving the eye: half-width hp·(1 + Kn z) with z the distance in front of the pupil (m); it narrows to a point at the far point
        const zEnd = (xp - 20) / sx, off = z => hp * (1 + Kn * z);
        c.save(); c.fillStyle = S.nm(650, 0.16); c.beginPath(); c.moveTo(xp, yA - hp);
        for (let q = 0; q <= 40; q++) { const z = zEnd * q / 40; c.lineTo(xp - z * sx, yA - off(z)); }
        for (let q = 40; q >= 0; q--) { const z = zEnd * q / 40; c.lineTo(xp - z * sx, yA + off(z)); }
        c.closePath(); c.fill(); c.restore();
        for (const sg of [-1, 1]) S.ray(c, [[xp, yA + sg * hp], [xp - zEnd * sx, yA + sg * off(zEnd)]], { nm: 650, width: 1.4, alpha: 0.9 });
        // the far point
        if (Kn < -0.02) {
          const fz = -1 / Kn, fx = xp - fz * sx;
          if (fz <= zEnd) { kit.dot(c, fx, yA, 4.5, C.warn); kit.label(c, 'far point ' + fz.toFixed(2) + ' m', fx, yA - 20, { align: 'center', size: 11.5, color: C.warn, weight: 650 }); }
          else kit.label(c, '◀ far point ' + fz.toFixed(1) + ' m', 22, yA - 22, { size: 11.5, color: C.warn, weight: 650 });
        } else if (Kn > 0.02) { kit.label(c, 'far point ' + (1 / Kn).toFixed(2) + ' m behind the eye ▶', xEye - 6, yA + r + 18, { align: 'right', size: 11.5, color: C.warn, weight: 650 }); }
        else kit.label(c, '◀ far point at infinity', 22, yA - 22, { size: 11.5, color: C.warn, weight: 650 });
        // the trial lens and the examiner
        if (Math.abs(V.P) > 0.01) { S.thinLens(c, xp - 24, yA, 17, V.P, { color: C.accent }); kit.label(c, sd(V.P) + ' D', xp - 24, yA + 32, { align: 'center', size: 11.5, color: C.accent, weight: 650 }); }
        c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(geo.xE, yA, 11, 0, TAU); c.fill(); c.stroke(); kit.dot(c, geo.xE, yA, 3.2, C.text); c.restore();
        kit.label(c, 'examiner', geo.xE, yA + 28, { align: 'center', size: 11.5, color: C.muted });
        S.dim(c, geo.xE, yA + 50, xp, yA + 50, 'working distance ' + V.d + ' cm', { off: 14 });
        kit.label(c, 'returning beam at the examiner: ' + (Math.abs(1 + Kn * d) * 100).toFixed(0) + ' % of its width at the pupil', 16, 14, { size: 11, color: C.faint });
        // ---- the pupil below: the iris and the streak on it first, then the pupil with its reflex
        const ri = Hh * 0.205, rp = ri / 2.35, cx = W * 0.5, cy = Hh - ri - 10;
        c.save(); c.beginPath(); c.arc(cx, cy, ri, 0, TAU); c.fillStyle = C.dark ? '#5a6577' : '#9aa6b5'; c.fill();
        c.lineWidth = 1; c.strokeStyle = C.dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)';
        for (let q = 0; q < 28; q++) { const a = q * TAU / 28; c.beginPath(); c.moveTo(cx + rp * 1.08 * Math.cos(a), cy + rp * 1.08 * Math.sin(a)); c.lineTo(cx + ri * 0.97 * Math.cos(a), cy + ri * 0.97 * Math.sin(a)); c.stroke(); }
        c.beginPath(); c.arc(cx, cy, ri, 0, TAU); c.clip();
        c.fillStyle = 'rgba(255,255,255,0.6)'; c.fillRect(cx + s * 1.9 * rp - 2, cy - ri, 4, 2 * ri);       // the streak on the iris
        c.restore();
        c.save(); c.beginPath(); c.arc(cx, cy, rp, 0, TAU); c.fillStyle = '#240606'; c.fill(); c.clip();
        const G = clamp(0.6 / Math.max(Math.abs(Rres), 0.05), 0.35, 12), hw = clamp(0.2 + 0.1 / Math.max(Math.abs(Rres), 0.03), 0.2, 3.2), b = 0.35 + 0.65 / (1 + (Rres / 0.6) * (Rres / 0.6));
        const cb = dir * s * G, x0 = cx + (cb - hw) * rp, x1 = cx + (cb + hw) * rp;
        const gr = c.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, 'rgba(255,110,50,0)'); gr.addColorStop(0.22, 'rgba(255,125,60,' + b.toFixed(3) + ')'); gr.addColorStop(0.78, 'rgba(255,125,60,' + b.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,110,50,0)');
        c.fillStyle = gr; c.fillRect(x0, cy - rp, x1 - x0, 2 * rp);
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, rp, 0, TAU); c.stroke();
        kit.label(c, 'streak', cx + s * 1.9 * rp, cy - ri - 9, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'the pupil as the examiner sees it', cx - ri - 18, cy, { align: 'right', size: 11.5, color: C.muted });
        const word = neutral ? 'neutral: the pupil fills at once' : dir > 0 ? 'WITH the streak' : 'AGAINST the streak';
        kit.label(c, word, cx + ri + 18, cy, { size: 14, weight: 700, color: neutral ? C.ok : dir > 0 ? C.accent : C.bad });
        ro.set('kn', sd(Kn) + ' D');
        ro.set('fp', Kn < -0.02 ? (-1 / Kn).toFixed(2) + ' m in front of the eye' : Kn > 0.02 ? (1 / Kn).toFixed(2) + ' m behind the eye' : 'at infinity');
        ro.set('reflex', neutral ? 'neutral: no movement' : dir > 0 ? 'with the streak' : 'against the streak');
        ro.set('speed', neutral ? 'very fast, brightest, broad' : Math.abs(Rres) < 0.5 ? 'fast, bright, broad' : Math.abs(Rres) < 1 ? 'moderate' : 'slow, dim, narrow');
        ro.set('gross', sd(V.K + 1 / d) + ' D');
        ro.set('wd', sd(1 / d) + ' D');
        ro.set('net', sd(V.K) + ' D');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ Scheiner, ring, Shack–Hartmann */
  Hyper.sim('op-hartmann', {
    title: 'Autorefractor and aberrometer: reading the wavefront from spot shifts',
    blurb: `Light from a point on the retina leaves the eye as a wavefront. A mask of small apertures, or an array of tiny lenses, sends each patch of it to its own spot on a sensor; where a spot lands says how the wavefront is tilted there. Left: the spots (hollow circle: where a flat wavefront would put it; dot: where it lands, shift magnified). Middle: the whole wavefront the eye produces. Right: what is left of it after the best sphere and cylinder are taken away.

**Try this**
- **Two apertures** (the Scheiner disc): only one meridian can be measured, the line through the two holes. Turn *the meridian* and the power along it changes as sphere and cylinder say: sphere + cylinder × sin² of the angle to the axis.
- **Eight apertures** on a ring (or the array) give the full sphere, cylinder and axis: the fit reproduces what you set, to a hundredth of a dioptre.
- Add **spherical aberration** with the pupil wide: the fitted sphere drifts from the one you set (a wide pupil sees a different myopia from a narrow one) and the right-hand map is no longer flat.
- Put **−6 D** with the array: the shifts exceed half the lenslet pitch and the dots turn red, the sensor's *dynamic range* is exceeded; real instruments pre-compensate with a movable lens.

*Schematic: lenslet pitch two ninths of the pupil, focal length 20 mm, spot shifts exaggerated by the factor chosen. The eye is modelled by a sphere, a cylinder, one coma term and one spherical-aberration term.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Sampling', options: [['Two apertures (Scheiner disc)', 'two'], ['Ring of eight apertures', 'ring'], ['Lenslet array (Shack–Hartmann)', 'array']], value: params.mode || 'array' },
        { id: 'sph', label: 'Sphere of the eye', min: -6, max: 4, step: 0.25, value: params.sph != null ? params.sph : -2, unit: 'D' },
        { id: 'cyl', label: 'Cylinder (minus form)', min: -4, max: 0, step: 0.25, value: params.cyl != null ? params.cyl : -1, unit: 'D' },
        { id: 'axis', label: 'Axis of the cylinder', min: 0, max: 175, step: 5, value: params.axis != null ? params.axis : 30, unit: '°' },
        { id: 'coma', label: 'Coma (horizontal)', min: -0.5, max: 0.5, step: 0.05, value: params.coma != null ? params.coma : 0.15, unit: 'µm' },
        { id: 'sa', label: 'Spherical aberration', min: -0.3, max: 0.5, step: 0.05, value: params.sa != null ? params.sa : 0, unit: 'µm' },
        { id: 'pupil', label: 'Pupil diameter', min: 3, max: 7, step: 0.5, value: params.pupil || 6, unit: 'mm' },
        { id: 'mer', label: 'Meridian of the two holes', min: 0, max: 175, step: 5, value: params.mer || 0, unit: '°' },
        { id: 'gain', label: 'Shifts drawn larger by', min: 1, max: 20, value: 6, log: true, sig: 2, fmt: v => '× ' + Math.round(v) }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Samples'], ['set', 'Eye as set'], ['fit', 'Fitted by the instrument'], ['se', 'Fitted spherical equivalent'], ['hoa', 'Coma and spherical aberration (RMS)'], ['shift', 'Largest spot shift · half the pitch'], ['note', 'Note']]);
      const FL = 20;                               // lenslet focal length, mm
      const wav = (x, y, R, P, cc, cs) => {         // the wavefront (µm) at (x, y) mm: sphero-cylinder + coma + spherical aberration
        const xi = x / R, eta = y / R, r2 = xi * xi + eta * eta;
        return 0.5 * (P[0] * x * x + 2 * P[1] * x * y + P[2] * y * y) + cc * Math.sqrt(8) * (3 * r2 - 2) * xi + cs * Math.sqrt(5) * (6 * r2 * r2 - 6 * r2 + 1);
      };
      const slope = (x, y, R, P, cc, cs) => {      // its gradient in mrad (µm per mm)
        const xi = x / R, eta = y / R, r2 = xi * xi + eta * eta, kc = cc * Math.sqrt(8) / R, ks = cs * Math.sqrt(5) / R;
        return [P[0] * x + P[1] * y + kc * (9 * xi * xi + 3 * eta * eta - 2) + ks * xi * (24 * r2 - 12), P[1] * x + P[2] * y + kc * 6 * xi * eta + ks * eta * (24 * r2 - 12)];
      };
      const cmap = v => { const a = Math.min(1, Math.abs(v)), t = v > 0 ? [214, 60, 50] : [50, 100, 214], b = 244; return [b + (t[0] - b) * a, b + (t[1] - b) * a, b + (t[2] - b) * a]; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = V.pupil / 2, P = pmat(V.sph, V.cyl, V.axis), p = 2 * R / 9;
        // the sample points
        let pts = [];
        if (V.mode === 'two') { const a = V.mer * D2R; pts = [[R * 0.5 * Math.cos(a), R * 0.5 * Math.sin(a)], [-R * 0.5 * Math.cos(a), -R * 0.5 * Math.sin(a)]]; }
        else if (V.mode === 'ring') { for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + 0.2; pts.push([0.75 * R * Math.cos(a), 0.75 * R * Math.sin(a)]); } }
        else { for (let j = 0; j < 9; j++) for (let i = 0; i < 9; i++) { const x = (i - 4) * p, y = (j - 4) * p; if (Math.hypot(x, y) <= R * 0.97) pts.push([x, y]); } }
        const sl = pts.map(q => slope(q[0], q[1], R, P, V.coma, V.sa));
        // the least-squares power matrix: M = (Σ s rᵀ)(Σ r rᵀ)⁻¹
        let sxx = 0, sxy = 0, syy = 0, axx = 0, axy = 0, ayx = 0, ayy = 0;
        pts.forEach((q, i) => { sxx += q[0] * q[0]; sxy += q[0] * q[1]; syy += q[1] * q[1]; axx += sl[i][0] * q[0]; axy += sl[i][0] * q[1]; ayx += sl[i][1] * q[0]; ayy += sl[i][1] * q[1]; });
        const det = sxx * syy - sxy * sxy, full = Math.abs(det) > 1e-9 * (sxx * syy + 1e-12);
        let M = P.slice(), meridianPower = NaN;
        if (full) { const m00 = (axx * syy - axy * sxy) / det, m01 = (axy * sxx - axx * sxy) / det, m10 = (ayx * syy - ayy * sxy) / det, m11 = (ayy * sxx - ayx * sxy) / det; M = [m00, (m01 + m10) / 2, m11]; }
        else { const u = [Math.cos(V.mer * D2R), Math.sin(V.mer * D2R)]; let num = 0, den = 0; pts.forEach((q, i) => { const t = q[0] * u[0] + q[1] * u[1]; num += (sl[i][0] * u[0] + sl[i][1] * u[1]) * t; den += t * t; }); meridianPower = den > 0 ? num / den : NaN; }
        // ---- the three panels
        const gap = 10, pw = [W * 0.42, W * 0.27, W * 0.27], sz = Math.min(pw[0] - gap, Hh - 54), ph = [sz, Math.min(pw[1] - gap, sz), Math.min(pw[2] - gap, sz)];
        const cy = 30 + (Hh - 40) / 2;
        const cxs = [pw[0] / 2, pw[0] + pw[1] / 2, pw[0] + pw[1] + pw[2] / 2];
        const heads = W < 520 ? ['Spots', 'Wavefront', 'Higher orders'] : ['Sensor: where the spots land', 'Wavefront', 'Higher orders only'];
        cxs.forEach((x, i) => kit.label(c, heads[i], x, 14, { align: 'center', size: 11, color: C.muted, weight: 600 }));
        // sensor
        const sA = ph[0] / 2 / (R * 1.12), cxA = cxs[0];
        c.save(); c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(cxA, cy, R * sA, 0, TAU); c.stroke(); c.restore();
        let maxShift = 0;
        pts.forEach((q, i) => {
          const sh = [FL * sl[i][0] / 1000, FL * sl[i][1] / 1000];                  // mm on the sensor
          maxShift = Math.max(maxShift, Math.hypot(sh[0], sh[1]) * 1000);
          const x0 = cxA + q[0] * sA, y0 = cy - q[1] * sA, x1 = x0 + sh[0] * V.gain * sA, y1 = y0 - sh[1] * V.gain * sA, over = Math.hypot(sh[0], sh[1]) > p / 2;
          if (V.mode === 'array') { c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0 - p * sA / 2, y0 - p * sA / 2, p * sA, p * sA); }
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(x0, y0, V.mode === 'array' ? 2.2 : 4, 0, TAU); c.stroke();
          c.strokeStyle = over ? C.bad : C.accent; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          kit.dot(c, x1, y1, V.mode === 'array' ? 2.6 : 4, over ? C.bad : C.accent);
        });
        // the wavefront maps
        const n = 31;
        for (let k = 1; k <= 2; k++) {
          const half = ph[k] / 2, cx = cxs[k], sc = half / R;
          if (k === 2 && !full) { kit.label(c, 'needs three or more directions', cx, cy, { align: 'center', size: 11.5, color: C.faint }); continue; }
          const vals = []; let mean = 0, cnt = 0;
          for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
            const x = ((i + 0.5) / n * 2 - 1) * R, y = (1 - (j + 0.5) / n * 2) * R;
            let v = NaN;
            if (Math.hypot(x, y) <= R) { v = wav(x, y, R, P, V.coma, V.sa); if (k === 2) { v -= 0.5 * (M[0] * x * x + 2 * M[1] * x * y + M[2] * y * y); mean += v; cnt++; } }
            vals.push(v);
          }
          if (k === 2 && cnt) { mean /= cnt; for (let q = 0; q < vals.length; q++) if (Number.isFinite(vals[q])) vals[q] -= mean; }
          let sclr = 0.1; for (const v of vals) if (Number.isFinite(v)) sclr = Math.max(sclr, Math.abs(v));
          kit.label(c, '± ' + (sclr < 1 ? sclr.toFixed(2) : sclr.toFixed(1)) + ' µm', cx, cy + half + 14, { align: 'center', size: 10.5, color: C.faint });
          for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
            const v = vals[j * n + i]; if (!Number.isFinite(v)) continue;
            const col = cmap(v / sclr); c.fillStyle = 'rgb(' + Math.round(col[0]) + ',' + Math.round(col[1]) + ',' + Math.round(col[2]) + ')';
            c.fillRect(cx - half + i * 2 * half / n, cy - half + j * 2 * half / n, 2 * half / n + 0.7, 2 * half / n + 0.7);
          }
          c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, half, 0, TAU); c.stroke();
        }
        const fit = toRx(M), setRx = { sph: V.sph, cyl: V.cyl, axis: V.axis };
        ro.set('n', pts.length + (V.mode === 'array' ? ' lenslets in the pupil' : ' apertures'));
        ro.set('set', rxText(setRx));
        ro.set('fit', full ? rxText({ sph: fit.sph, cyl: fit.cyl, axis: fit.axis }) : 'only the power along ' + Math.round(V.mer) + '°: ' + sd(meridianPower) + ' D');
        ro.set('se', full ? sd(fit.M) + ' D' : 'needs three or more directions');
        ro.set('hoa', fmt(Math.hypot(V.coma, V.sa), 2) + ' µm');
        ro.set('shift', maxShift.toFixed(0) + ' µm · ' + (p * 500).toFixed(0) + ' µm');
        ro.set('note', maxShift > p * 500 && V.mode === 'array' ? 'beyond the sensor\'s range: spots would be mistaken for their neighbours' : full ? 'sphere, cylinder and axis recovered from the spots' : 'a single meridian is not a refraction');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ trial lenses, cross cylinder, duochrome */
  CHARTS.refr = { name: 'refraction chart', W: 360, H: 210, rows: [[20 * Math.pow(10, 0.8), 'DKSNR'], [20 * Math.pow(10, 0.6), 'CVHZO'], [20 * Math.pow(10, 0.5), 'NRDHS'], [20 * Math.pow(10, 0.4), 'KOVCZ'], [20 * Math.pow(10, 0.3), 'SDNKR'], [20 * Math.pow(10, 0.2), 'HCOVD'], [20 * Math.pow(10, 0.1), 'ZRSNK'], [20, 'DHCNV']], space: 1 };
  CHARTS.mini = { name: 'a few lines', W: 220, H: 150, rows: [[50, 'KOVC'], [40, 'SDNK'], [32, 'HCOV'], [25, 'ZRSN']], space: 1 };
  const dirMat = a => { const r = a * D2R, c = Math.cos(r), s = Math.sin(r); return [c * c, c * s, s * s]; };
  Hyper.sim('op-refraction', {
    title: 'Refracting a patient: trial lenses, the cross cylinder and the red–green test',
    blurb: `A made-up patient looks at a chart through the lenses you dial in. The picture is what remains of the patient's error: **the patient needs** (hidden unless you tick *Reveal*) **minus the lens in front**. When nothing is left over, the chart is as sharp as the eye can make it.

**Try this**
- *Trial lenses.* Patient A first: dial the sphere towards −2.25 and watch the chart sharpen; then add cylinder. Then press **Add +1.00 (fog)**, a deliberate blur from which the examiner works back. Tick *Reveal* to see how acuity falls **equally** on both sides of the best sphere.
- *Cross cylinder.* Patient A needs −2.25 −0.75 × 180. Dial sphere −2.25 and cylinder −0.75 × 160: the axis is 20° out, and the two positions of the ±0.25 D cross cylinder give different blur, one clearly cleaner. Turn the axis towards 180° and the two blur strengths draw together; at 180° they are equal. Choose *the power* in the list and set a cylinder of −0.50 × 180 to see the other use of the same lens.
- *Red–green.* With the right lens the letters on red and on green are equally clear. Make the sphere too minus: green looks clearer. Too plus: red does.
- The pupil sets how much blur any error causes.

*The eye is modelled with relaxed accommodation (as if its focusing muscle were paralysed): a real long-sighted patient would refocus and hide part of the error. Geometrical blur only.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340, maxH: 470 });
      const plot = kit.plot(box.stage, { x: { label: 'trial sphere (D)', name: 'D', min: -8, max: 6 }, y: { label: 'logMAR', name: 'logMAR', min: 0, max: 1.6 }, series: [] }, 120);
      const PAT = [['A: short-sighted, a little astigmatism', { sph: -2.25, cyl: -0.75, axis: 180 }], ['B: long-sighted', { sph: 1.75, cyl: -0.5, axis: 90 }], ['C: strongly short-sighted, astigmatic', { sph: -4.5, cyl: -1.5, axis: 30 }]];
      const ctl = kit.controls(box.side, [
        { id: 'test', type: 'select', label: 'Test', options: [['Trial lenses (phoropter)', 'phoropter'], ['Jackson cross cylinder', 'cross'], ['Red–green (duochrome)', 'duo']], value: params.mode || 'phoropter' },
        { id: 'pat', type: 'select', label: 'Patient', options: PAT.map((q, i) => [q[0], i]), value: params.pat || 0 },
        { id: 'sph', label: 'Trial sphere', min: -8, max: 6, step: 0.25, value: params.sph || 0, unit: 'D' },
        { id: 'cyl', label: 'Trial cylinder', min: -3, max: 0, step: 0.25, value: params.cyl || 0, unit: 'D' },
        { id: 'axis', label: 'Trial cylinder axis', min: 0, max: 175, step: 5, value: params.axis != null ? params.axis : 90, unit: '°' },
        { id: 'orient', type: 'select', label: 'Cross cylinder is used to test', options: [['the axis (its axes at 45° to the cylinder axis)', 'axis'], ['the power (its axes along the cylinder axis)', 'power']], value: params.orient || 'axis' },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 7, step: 0.5, value: 4, unit: 'mm' },
        { id: 'reveal', type: 'check', label: 'Reveal what the patient needs', value: !!params.reveal },
        { type: 'buttons', items: [{ id: 'fog', label: 'Add +1.00 (fog)' }, { id: 'plano', label: 'Plano' }] }
      ], id => {
        if (id === 'fog') ctl.set('sph', Math.min(6, V.sph + 1));
        else if (id === 'plano') { ctl.set('sph', 0); ctl.set('cyl', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['need', 'The patient needs'], ['res', 'Left over (patient − lens)'], ['b', 'Blur strength of what is left'], ['acu', 'Smallest line read (rule of thumb)'], ['x12', 'Blur strength: position 1 · position 2'], ['pref', 'The patient prefers'], ['gr', 'Blur strength: green side · red side'], ['clear', 'Clearer side']]);
      const eyeSys = O.lens('eye'), Pw = nm => 1000 / O.sys.paraxial(eyeSys, nm).efl, LCA = (Pw(532) - Pw(620)) / 2;      // half the focus difference between 532 and 620 nm, dioptres
      const cache = {};
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const rx = PAT[V.pat][1], Rm = msub(pmat(rx.sph, rx.cyl, rx.axis), pmat(V.sph, V.cyl, V.axis)), rho = V.pupil * 1e-3 / 2, mode = V.test;
        const panel = (id, kind, m, x, y, w, h, bg) => {
          const ch = buildChart(kind), key = [id, kind, m.map(v => v.toFixed(3)).join(), V.pupil, bg ? bg.join('-') : ''].join('|');
          if (!cache[id] || cache[id].key !== key) cache[id] = { key, out: blurChart(ch.src, ch.W, ch.H, m, rho, ch.ppa) };
          const out = cache[id].out;
          S.image(c, x, y, w, h, ch.W, ch.H, (u, v) => { const ink = out[Math.min(ch.H - 1, Math.floor(v * ch.H)) * ch.W + Math.min(ch.W - 1, Math.floor(u * ch.W))]; return bg ? [bg[0] * (1 - 0.95 * ink), bg[1] * (1 - 0.95 * ink), bg[2] * (1 - 0.95 * ink)] : 0.97 - 0.92 * ink; }, { key, id });
          c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
        };
        const B = m => toRx(m).B, eq = b => E.acuityFromDefocus(b * V.pupil / 4);
        ctl.show('orient', mode === 'cross'); ro.show('x12', mode === 'cross'); ro.show('pref', mode === 'cross'); ro.show('gr', mode === 'duo'); ro.show('clear', mode === 'duo'); ro.show('acu', mode === 'phoropter'); ro.show('b', mode === 'phoropter');
        const leftOver = toRx(Rm);
        ro.set('need', V.reveal ? rxText(rx) : 'hidden (tick Reveal)');
        ro.set('res', rxText({ sph: leftOver.sph, cyl: leftOver.cyl, axis: leftOver.axis }));
        if (mode === 'phoropter') {
          const ch = CHARTS.refr, w = Math.min(W - 24, (Hh - 40) * ch.W / ch.H), h = w * ch.H / ch.W;
          panel('ph', 'refr', Rm, (W - w) / 2, (Hh - h) / 2 + 6, w, h);
          kit.label(c, 'what the patient sees through ' + rxText({ sph: V.sph, cyl: V.cyl, axis: V.axis }), W / 2, 14, { align: 'center', size: 12, color: C.muted });
          const b = B(Rm), den = nearestLine(eq(b));
          ro.set('b', fmt(b, 2) + ' D'); ro.set('acu', lineName(den));
          const pts = [];
          if (V.reveal) for (let s = -8; s <= 6.001; s += 0.25) pts.push([s, E.logmar(eq(B(msub(pmat(rx.sph, rx.cyl, rx.axis), pmat(s, V.cyl, V.axis)))))]);
          plot.set({ x: { label: 'trial sphere (D)', name: 'D', min: -8, max: 6 }, y: { label: 'logMAR', name: 'logMAR', min: 0, max: 1.6 }, series: pts.length ? [{ pts, label: 'logMAR against trial sphere (other dials as set)', color: C.series[0] }] : [], marks: [{ x: V.sph, y: E.logmar(eq(b)), label: 'now' }] });
        } else {
          const gap = 14, pw = (W - 3 * gap) / 2, ch = CHARTS.mini, ph = Math.min(pw * ch.H / ch.W, Hh - 130), pw2 = ph * ch.W / ch.H, y0 = 28;
          const Prx = pmat(rx.sph, rx.cyl, rx.axis);
          if (mode === 'cross') {
            const power = V.orient === 'power';
            // the cross cylinder as a power matrix: +0.25 D along one meridian, −0.25 D along the one at right angles
            const xmat = (ax, pw0) => { const a = pw0 ? dirMat(ax) : dirMat(ax + 135), b = pw0 ? dirMat(ax + 90) : dirMat(ax + 45); return a.map((v, i) => 0.25 * (v - b[i])); };
            const X = xmat(V.axis, power), Rs = [msub(Rm, X), madd(Rm, X)], bs = Rs.map(B);
            [0, 1].forEach(k => {
              const x = gap + k * (pw + gap) + (pw - pw2) / 2;
              panel('x' + k, 'mini', Rs[k], x, y0, pw2, ph);
              kit.label(c, 'position ' + (k + 1), x + pw2 / 2, 14, { align: 'center', size: 12, weight: 650, color: bs[k] < bs[1 - k] - 0.02 ? C.ok : C.text });
              // the cross cylinder: minus axis (red) and plus axis (blue) against the trial cylinder axis (dashed)
              const ix = x + pw2 / 2 - 50, iy = y0 + ph + 32, r = 18, ax = V.axis * D2R;
              const minusA = power ? V.axis + (k === 0 ? 0 : 90) : V.axis + (k === 0 ? 135 : 45), plusA = power ? V.axis + (k === 0 ? 90 : 0) : V.axis + (k === 0 ? 45 : 135);
              const line = (a, col) => { const t = a * D2R; c.strokeStyle = col; c.beginPath(); c.moveTo(ix - r * Math.cos(t), iy + r * Math.sin(t)); c.lineTo(ix + r * Math.cos(t), iy - r * Math.sin(t)); c.stroke(); };
              c.save(); c.lineWidth = 2; c.lineCap = 'round'; c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ix - r * 1.3 * Math.cos(ax), iy + r * 1.3 * Math.sin(ax)); c.lineTo(ix + r * 1.3 * Math.cos(ax), iy - r * 1.3 * Math.sin(ax)); c.stroke(); c.setLineDash([]);
              line(minusA, C.bad); line(plusA, C.accent); c.restore();
              kit.label(c, 'blur ' + fmt(bs[k], 2) + ' D', ix + r * 1.9, iy, { size: 11.5, color: C.muted });
            });
            kit.label(c, 'in each icon: red line = minus axis of the cross cylinder, blue = its plus axis, dashed = axis of the trial cylinder', W / 2, y0 + ph + 62, { align: 'center', size: 10.5, color: C.faint });
            const dd = bs[0] - bs[1];
            ro.set('x12', fmt(bs[0], 2) + ' D · ' + fmt(bs[1], 2) + ' D');
            ro.set('pref', Math.abs(dd) < 0.02 ? 'neither: they look alike' : dd < 0 ? 'position 1 (clearer)' : 'position 2 (clearer)');
            // blur strength of the two positions as the trial axis (or cylinder) is varied: the curves cross at the right setting
            const one = power ? (v => pmat(V.sph, v, V.axis)) : (v => pmat(V.sph, V.cyl, v)), xs = power ? [-3, 0, 0.125] : [0, 180, 5], p1 = [], p2 = [];
            if (V.reveal) for (let v = xs[0]; v <= xs[1] + 1e-9; v += xs[2]) { const Xv = power ? X : xmat(v, false), Rv = msub(Prx, one(v)); p1.push([v, B(msub(Rv, Xv))]); p2.push([v, B(madd(Rv, Xv))]); }
            plot.set({ x: { label: power ? 'trial cylinder (D)' : 'trial axis (°)', name: power ? 'C' : 'axis', min: xs[0], max: xs[1] }, y: { label: 'blur (D)', name: 'B', min: 0, max: 2 }, series: V.reveal ? [{ pts: p1, label: 'position 1', color: C.series[0] }, { pts: p2, label: 'position 2', color: C.series[1] }] : [], marks: [{ x: power ? V.cyl : V.axis, y: bs[0], label: '1' }, { x: power ? V.cyl : V.axis, y: bs[1], label: '2' }] });
          } else {
            const gcol = [90, 205, 120], rcol = [225, 80, 70];
            const sh = d => [Rm[0] + d, Rm[1], Rm[2] + d], Rg = sh(-LCA), Rr = sh(LCA), bg = B(Rg), br = B(Rr);
            [0, 1].forEach(k => {
              const x = gap + k * (pw + gap) + (pw - pw2) / 2;
              panel('d' + k, 'mini', k === 0 ? Rg : Rr, x, y0, pw2, ph, k === 0 ? gcol : rcol);
              kit.label(c, k === 0 ? 'green, 532 nm' : 'red, 620 nm', x + pw2 / 2, 14, { align: 'center', size: 12, weight: 650, color: C.text });
              kit.label(c, 'blur ' + fmt(k === 0 ? bg : br, 2) + ' D', x + pw2 / 2, y0 + ph + 16, { align: 'center', size: 11.5, color: C.muted });
            });
            const dd = bg - br;
            kit.label(c, "the eye's own focus differs by " + fmt(2 * LCA, 2) + ' D between these two colours', W / 2, y0 + ph + 40, { align: 'center', size: 11.5, color: C.faint });
            ro.set('gr', fmt(bg, 2) + ' D · ' + fmt(br, 2) + ' D');
            ro.set('clear', Math.abs(dd) < 0.04 ? 'equal: the focus lies between the two colours' : dd < 0 ? 'green (the focus is behind the retina)' : 'red (the focus is in front of the retina)');
            const pg = [], pr = [];
            if (V.reveal) for (let v = -8; v <= 6.001; v += 0.25) { const Rv = msub(Prx, pmat(v, V.cyl, V.axis)); pg.push([v, B([Rv[0] - LCA, Rv[1], Rv[2] - LCA])]); pr.push([v, B([Rv[0] + LCA, Rv[1], Rv[2] + LCA])]); }
            plot.set({ x: { label: 'trial sphere (D)', name: 'D', min: -8, max: 6 }, y: { label: 'blur (D)', name: 'B', min: 0, max: 3 }, series: V.reveal ? [{ pts: pg, label: 'green side', color: C.series[2] }, { pts: pr, label: 'red side', color: C.series[3] }] : [], marks: [{ x: V.sph, y: bg, label: 'green' }, { x: V.sph, y: br, label: 'red' }] });
          }
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ keratometry and topography */
  Hyper.sim('op-keratometry', {
    title: 'The cornea as a mirror: keratometer mires, Placido rings and a curvature map',
    blurb: `The front of the cornea is a small convex mirror of radius about 7.8 mm, and the light reflected from it carries its shape. Left: a target of concentric rings (a Placido disc) reflected in the cornea, as a camera sees it; each ring shows where its image falls, and steeper surface pulls the images closer together. Right: the map of corneal power that follows from the ring positions (warm colours steep, cool colours flat).

**Try this**
- A spherical cornea (astigmatism 0) gives circular rings, equally spaced. Add **astigmatism**: the rings turn into ovals, narrower along the steep meridian; the map shows a *bow tie* of steep (red) along one axis and flat (blue) along the other.
- Turn the **steep axis**: 90° is the usual "with the rule" orientation, 180° "against the rule", between them oblique.
- Add a **local steepening**: the rings crowd and shift towards it, and the map shows an island of high power. Such shapes are what topography is built to show.
- Read the numbers: keratometry reports only the flat and the steep value and their axes, measured on a ring about 3 mm across; the map shows the whole surface.

*The power is the keratometric one, (1.3375 − 1)/R: it assumes a single refracting surface and is not the power of the whole cornea. The model is a toric surface plus one Gaussian bump, for illustration.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'R1', label: 'Flattest meridian: radius of curvature', min: 7.0, max: 9.0, step: 0.05, value: params.R1 || 7.9, unit: 'mm' },
        { id: 'ast', label: 'Corneal astigmatism (steep − flat)', min: 0, max: 6, step: 0.25, value: params.ast != null ? params.ast : 1.5, unit: 'D' },
        { id: 'axis', label: 'Axis of the steep meridian', min: 0, max: 175, step: 5, value: params.axis != null ? params.axis : 90, unit: '°' },
        { id: 'cone', label: 'Local steepening (cone-like)', min: 0, max: 14, step: 0.5, value: params.cone || 0, unit: 'D' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k1', 'Flat meridian K1'], ['k2', 'Steep meridian K2'], ['ast', 'Corneal astigmatism'], ['kind', 'Orientation'], ['mean', 'Mean power'], ['peak', 'Highest power in the map'], ['mire', 'Mire image (60 mm ring, 75 mm away)']]);
      const NI = 1.3375, KR = (NI - 1) * 1000;                                           // keratometric index; D = 337.5 / R(mm)
      const kAt = (x, y) => { const phi = Math.atan2(y, x) * R2D, a = Math.cos((phi - V.axis) * D2R); return KR / V.R1 + V.ast * a * a + V.cone * Math.exp(-(Math.pow(x - 0.7, 2) + Math.pow(y + 1.3, 2)) / 2); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sz = Math.min(W * 0.42, Hh - 64), cy = Hh / 2 + 6, c1 = W * 0.27, c2 = W * 0.72;
        kit.label(c, 'Placido rings as reflected', c1, 14, { align: 'center', size: 11.5, color: C.muted, weight: 600 });
        kit.label(c, 'power map (8 mm zone)', c2, 14, { align: 'center', size: 11.5, color: C.muted, weight: 600 });
        // the rings: ring i is a circle on the target; where its image falls is where z = k_i · R(z, φ) with R = 337.5 / power
        const sc = sz / 2 / 5.8;
        c.save(); c.fillStyle = C.dark ? '#1a1d2e' : '#f4f1ea'; c.beginPath(); c.arc(c1, cy, sz / 2, 0, TAU); c.fill(); c.clip();
        c.strokeStyle = C.dark ? '#e8e6f0' : '#202030'; c.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
          const z0 = 0.8 + 0.5 * i, k = z0 / 7.8;            // a reference cornea of 7.8 mm puts ring i at z0
          c.beginPath();
          for (let a = 0; a <= 360; a += 4) {
            const ca = Math.cos(a * D2R), sa = Math.sin(a * D2R); let z = z0;
            for (let it = 0; it < 4; it++) z = k * KR / kAt(z * ca, z * sa);
            const px = c1 + z * ca * sc, py = cy - z * sa * sc;
            if (a === 0) c.moveTo(px, py); else c.lineTo(px, py);
          }
          c.stroke();
        }
        // dotted: the same rings on a spherical cornea of the same mean power
        const Rmean = KR / (KR / V.R1 + V.ast / 2);
        c.strokeStyle = C.bad; c.lineWidth = 1; c.setLineDash([2, 3]);
        for (let i = 0; i < 10; i += 3) { c.beginPath(); c.arc(c1, cy, (0.8 + 0.5 * i) / 7.8 * Rmean * sc, 0, TAU); c.stroke(); }
        c.setLineDash([]);
        kit.dot(c, c1, cy, 2.5, C.bad); c.restore();
        kit.label(c, 'dotted red: a spherical cornea of the same mean power', c1, cy + sz / 2 + 12, { align: 'center', size: 10.5, color: C.faint });
        c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(c1, cy, sz / 2, 0, TAU); c.stroke();
        // the power map
        const n = 41, half = sz / 2, vals = []; let peak = 0;
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const x = ((i + 0.5) / n * 2 - 1) * 4, y = (1 - (j + 0.5) / n * 2) * 4;
          const k = Math.hypot(x, y) > 4 ? NaN : kAt(x, y); vals.push(k); if (Number.isFinite(k)) peak = Math.max(peak, k);
        }
        const lo = 38, hi = Math.max(48, Math.ceil(peak + 0.5)), hue = k => 'hsl(' + Math.round(240 - 240 * clamp((k - lo) / (hi - lo), 0, 1)) + ',82%,52%)';
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const k = vals[j * n + i]; if (!Number.isFinite(k)) continue;
          c.fillStyle = hue(k); c.fillRect(c2 - half + i * sz / n, cy - half + j * sz / n, sz / n + 0.7, sz / n + 0.7);
        }
        c.strokeStyle = C.border2; c.beginPath(); c.arc(c2, cy, half, 0, TAU); c.stroke();
        // the colour bar
        const bx = c2 + half + 12, bw = 10, bh = sz * 0.8, by = cy - bh / 2;
        for (let q = 0; q < 40; q++) { c.fillStyle = hue(hi - (hi - lo) * q / 39); c.fillRect(bx, by + bh * q / 40, bw, bh / 40 + 0.6); }
        [lo, Math.round((lo + hi) / 2), hi].forEach(v => kit.label(c, String(v), bx + bw + 4, by + bh * (hi - v) / (hi - lo), { size: 10.5, color: C.faint }));
        kit.label(c, 'D', bx + bw / 2, by - 8, { align: 'center', size: 10.5, color: C.faint });
        const K1 = KR / V.R1, K2 = K1 + V.ast, Rm = KR / ((K1 + K2) / 2), mi = O.mirrorImage(-Rm / 2, 75), steepAx = V.axis, flatAx = (V.axis + 90) % 180;
        const wtr = Math.min(Math.abs(steepAx - 90), 180) <= 30, atr = steepAx <= 30 || steepAx >= 150;
        ro.set('k1', fmt(K1, 4) + ' D  (R ' + V.R1.toFixed(2) + ' mm) at ' + (flatAx || 180) + '°');
        ro.set('k2', fmt(K2, 4) + ' D  (R ' + (KR / K2).toFixed(2) + ' mm) at ' + (steepAx || 180) + '°');
        ro.set('ast', V.ast.toFixed(2) + ' D');
        ro.set('kind', V.ast < 0.25 ? 'practically spherical' : wtr ? 'with the rule (steep meridian near vertical)' : atr ? 'against the rule (steep meridian near horizontal)' : 'oblique');
        ro.set('mean', fmt((K1 + K2) / 2, 4) + ' D  (R ' + Rm.toFixed(2) + ' mm)');
        ro.set('peak', fmt(peak, 3) + ' D' + (V.cone > 0 ? '  (local steepening)' : ''));
        ro.set('mire', (60 * mi.m).toFixed(2) + ' mm  (a virtual image ' + Math.abs(mi.si).toFixed(2) + ' mm behind the surface)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the slit lamp */
  Hyper.sim('op-slitlamp', {
    title: 'The slit lamp: a beam of light cut through the front of the eye',
    blurb: `A slit lamp is a microscope with a lamp that throws a thin sheet of light. Left: a horizontal section of the front of the eye, traced with the schematic eye: the sheet comes in from one side at the angle you choose, bends at the cornea and the lens, and is aimed so that it crosses the axis where you ask. Right: what the microscope, looking straight ahead, sees: the beam appears as bright slanted slabs, because the part of the sheet that lies deeper is seen displaced sideways. That shift is what turns a flat view into a **section**.

**Try this**
- Widen the **angle**: the cornea's bright band gets wider (its apparent width is the true thickness times the tangent of the angle inside the tissue) and the layers separate more. At small angles everything piles up.
- Narrow the slit to 0.1 mm for an **optical section**: the surfaces of the cornea show as two bright lines with the stroma between them; the clear aqueous between the cornea and the lens is almost black. Widen it to 1 mm: a **parallelepiped**, a thick slab.
- Choose to examine the **lens**: its front and back capsules show bright, with fainter bands between them, the zones of discontinuity that give the lens its layered look.
- Raise the **magnification**: the field of view shrinks in proportion (about 220 mm divided by the magnification).

*The layers of the lens and cornea are drawn schematically from their typical thicknesses; the path of the beam is traced through the standard schematic eye.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'ang', label: 'Angle between lamp and microscope', min: 5, max: 50, step: 1, value: params.ang || 35, unit: '°' },
        { id: 'w', label: 'Width of the slit', min: 0.05, max: 3, value: params.w || 0.15, log: true, sig: 2, unit: 'mm' },
        { id: 'zoom', type: 'select', label: 'Magnification', options: [['10 ×', 10], ['16 ×', 16], ['25 ×', 25], ['40 ×', 40]], value: params.zoom || 25 },
        { id: 'aim', type: 'select', label: 'Examine', options: [['the cornea', 0.275], ['the anterior chamber', 2.1], ['the crystalline lens', 5.6]], value: params.aim != null ? params.aim : 0.275 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kind', 'Kind of beam'], ['ang', 'Direction of the beam inside: cornea · aqueous · lens'], ['cw', 'Cornea: apparent width of its band'], ['par', 'Apparent width ÷ true thickness (0.55 mm)'], ['fov', 'Field of view'], ['ok', 'Beam']]);
      const eye = O.lens('eye');
      const yAt = (pts, z) => { for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1]; if ((a[2] - z) * (b[2] - z) <= 0 && b[2] !== a[2]) return a[1] + (b[1] - a[1]) * (z - a[2]) / (b[2] - a[2]); } return NaN; };
      const trace = (al, y0) => Sy.trace(eye, { p: [0, y0, -2], d: [0, Math.sin(al), Math.cos(al)] }, 550);
      let cache = { key: '', r: null };
      const path = (al, zAim) => {                   // the ray that crosses the axis at depth zAim: Newton on the entry height
        const key = al + '|' + zAim; if (cache.key === key) return cache.r;
        let y0 = -Math.tan(al) * (2 + zAim) * 0.75, r = trace(al, y0);
        for (let it = 0; it < 12; it++) {
          const y = yAt(r.pts, zAim);
          if (Number.isFinite(y)) { if (Math.abs(y) < 1e-4) break; y0 -= y; } else y0 *= 0.7;
          r = trace(al, y0);
        }
        cache = { key, r }; return r;
      };
      const ZONES = [[0, 0.9, 0.03], [0.1, 0.55, 0.03], [0.22, 0.45, 0.03], [0.78, 0.45, 0.03], [0.9, 0.55, 0.03], [1, 0.75, 0.03]];
      const lensI = u => { let v = 0.14 + 0.1 * Math.sin(u * PI); for (const [z, h, wd] of ZONES) v += h * Math.exp(-Math.pow((u - z) / wd, 2)); if (u > 0.4 && u < 0.6) v *= 0.7; return v; };
      const cornI = u => 0.16 + 0.8 * Math.exp(-Math.pow(u / 0.07, 2)) + 0.5 * Math.exp(-Math.pow((u - 1) / 0.07, 2));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const al = V.ang * D2R, r = path(al, V.aim), pts = r.pts, hasAll = pts.length >= 5;
        // ---- the section of the eye with the traced beam
        const pw = W * 0.5, m = S.map(st, -5, 9, 7, { left: 6, right: W - pw - 6 + 0, top: 24, bottom: 8 });
        S.axis(c, m.X(-5), m.y0, m.X(9));
        S.system(c, eye, m);
        const beam = pts.map(p => [m.X(p[2]), m.Y(p[1])]);
        if (pts.length > 1) {
          const hw = V.w / 2;
          c.save(); c.fillStyle = 'rgba(255,200,60,0.28)'; c.beginPath();
          for (let i = 0; i < pts.length; i++) { const a = i + 1 < pts.length ? Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][2] - pts[i][2]) : Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]); const px = m.X(pts[i][2]), py = m.Y(pts[i][1] + hw / Math.cos(a)); if (i === 0) c.moveTo(px, py); else c.lineTo(px, py); }
          for (let i = pts.length - 1; i >= 0; i--) { const a = i + 1 < pts.length ? Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][2] - pts[i][2]) : Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]); c.lineTo(m.X(pts[i][2]), m.Y(pts[i][1] - hw / Math.cos(a))); }
          c.closePath(); c.fill(); c.restore();
          S.ray(c, beam, { color: C.warn, width: 1.6, arrows: false });
        }
        // the microscope looks along the axis, from the left
        c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4; const mx = m.X(-4.6); c.beginPath(); c.rect(mx - 12, m.y0 - 9, 24, 18); c.fill(); c.stroke(); c.restore();
        kit.label(c, 'microscope', mx + 14, m.y0 - 16, { size: 11, color: C.muted });
        kit.label(c, 'lamp ▸', beam[0][0] + 2, Math.min(Hh - 14, beam[0][1] + 4), { size: 11, color: C.warn });
        kit.label(c, 'cornea', m.X(0.2), m.Y(5.5), { size: 10.5, color: C.faint });
        kit.label(c, 'aqueous', m.X(2.1), m.Y(-3.9), { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'lens', m.X(5.6), m.Y(-3.1), { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, W < 560 ? 'section of the eye' : 'horizontal section, light travelling to the right', 8, 12, { size: 11, color: C.muted, weight: 600 });
        // ---- what the microscope sees: bright slabs against black
        const vx = W - pw + 8, vw = pw - 16, vy = 26, vh = Hh - 40, FOV = 220 / V.zoom, pxmm = vw / FOV, cx = vx + vw / 2;
        c.fillStyle = '#020306'; c.fillRect(vx, vy, vw, vh);
        const yb = i => pts[i][1], seg = (i, j) => Math.atan2(pts[j][1] - pts[i][1], pts[j][2] - pts[i][2]);
        const hwOf = a => V.w / 2 / Math.max(0.2, Math.cos(a));
        const bands = [];
        if (pts.length >= 3) bands.push({ y1: yb(1), y2: yb(2), hw: hwOf(seg(1, 2)), f: cornI });
        if (hasAll) bands.push({ y1: yb(3), y2: yb(4), hw: hwOf(seg(3, 4)), f: lensI });
        if (pts.length >= 4) bands.push({ y1: yb(2), y2: yb(3), hw: hwOf(seg(2, 3)), f: u => 0.025 });
        for (let q = 0; q < vw; q++) {
          const y = (q + 0.5 - vw / 2) / pxmm; let I = 0;
          for (const b of bands) {
            const lo = Math.min(b.y1, b.y2) - b.hw, hi = Math.max(b.y1, b.y2) + b.hw;
            if (y >= lo && y <= hi) { const span = b.y2 - b.y1, u = Math.abs(span) < 1e-6 ? 0.5 : clamp((y - b.y1) / span, 0, 1); I = Math.max(I, b.f(u)); }
          }
          if (I > 0.003) { const k = clamp(I, 0, 1); c.fillStyle = 'rgb(' + Math.round(235 * k) + ',' + Math.round(240 * k) + ',' + Math.round(255 * k) + ')'; c.fillRect(vx + q, vy, 1.2, vh); }
        }
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(vx - 0.5, vy - 0.5, vw + 1, vh + 1);
        kit.label(c, W < 560 ? 'microscope view' : 'as seen in the microscope', vx + vw / 2, 12, { align: 'center', size: 11, color: C.muted, weight: 600 });
        // labels on the slabs
        const lab = (i, j, t) => { if (pts.length > j) kit.label(c, t, cx + (yb(i) + yb(j)) / 2 * pxmm, vy + vh - 12, { align: 'center', size: 10.5, color: '#9ab', baseline: 'middle' }); };
        lab(1, 2, 'cornea'); if (hasAll) lab(3, 4, 'lens');
        // a scale bar
        const sb = pxmm >= 40 ? 1 : 2; c.strokeStyle = '#cfd6e6'; c.lineWidth = 2; c.beginPath(); c.moveTo(vx + 10, vy + 14); c.lineTo(vx + 10 + sb * pxmm, vy + 14); c.stroke(); kit.label(c, sb + ' mm', vx + 14 + sb * pxmm, vy + 14, { size: 10.5, color: '#cfd6e6' });
        const aC = pts.length > 2 ? Math.abs(seg(1, 2)) : NaN, aA = pts.length > 3 ? Math.abs(seg(2, 3)) : NaN, aL = hasAll ? Math.abs(seg(3, 4)) : NaN;
        const wA = pts.length > 2 ? Math.abs(yb(2) - yb(1)) : NaN;
        ro.set('kind', V.w < 0.2 ? 'optical section (a very thin slit)' : V.w < 1.5 ? 'parallelepiped (a slab of tissue)' : 'wide beam (diffuse illumination)');
        const dg = a => Number.isFinite(a) ? (a * R2D).toFixed(1) + '°' : '—';
        ro.set('ang', dg(aC) + ' · ' + dg(aA) + ' · ' + dg(aL));
        ro.set('cw', Number.isFinite(wA) ? wA.toFixed(2) + ' mm (plus the slit width)' : '—');
        ro.set('par', Number.isFinite(wA) ? (wA / 0.55).toFixed(2) + '  (= tan of the angle in the cornea: ' + Math.tan(aC).toFixed(2) + ')' : '—');
        ro.set('fov', FOV.toFixed(1) + ' mm across');
        ro.set('ok', r.ok ? 'passes through the pupil' : r.why === 'vignetted' ? 'cut off by the iris' : 'does not reach this depth at this angle');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ looking at the back of the eye */
  /* a schematic fundus of a right eye as an observer sees it, in degrees from the fovea (x towards the nose, y up) */
  function drawFundus(c, C) {
    const bgG = c.createRadialGradient(0, 0, 0, 0, 0, 70);
    bgG.addColorStop(0, '#d9622f'); bgG.addColorStop(0.45, '#c34a28'); bgG.addColorStop(1, '#6e231a');
    c.fillStyle = bgG; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.fill();
    // macula and fovea
    const mg = c.createRadialGradient(0, 0, 0, 0, 0, 5); mg.addColorStop(0, 'rgba(70,15,10,0.62)'); mg.addColorStop(1, 'rgba(70,15,10,0)');
    c.fillStyle = mg; c.beginPath(); c.arc(0, 0, 5, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,225,170,0.85)'; c.beginPath(); c.arc(0, 0, 0.3, 0, TAU); c.fill();
    // vessels: arcades from the disc round the macula, veins a little wider and darker than arteries
    const arc = (p, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]); c.stroke(); };
    const sets = [
      [[[13, 3.6], [8, 18], [-12, 18], [-30, 8]], [[13.6, 3.2], [9, 20.5], [-12, 21], [-30, 12]]],
      [[[13, 1.4], [8, -15], [-12, -17], [-30, -7]], [[13.6, 1.8], [9, -17.5], [-12, -20], [-30, -11]]],
      [[[17, 3.4], [22, 8], [26, 10], [34, 14]], [[17, 1.8], [23, -2], [26, -6], [34, -12]]],
      [[[15, 3], [16, 12], [18, 18], [20, 28]], [[15, 1.6], [16, -8], [18, -16], [20, -28]]]
    ];
    for (const [a, v] of sets) { arc(v, 0.78, '#6d0f12'); arc(a, 0.5, '#b82a22'); }
    for (const [a, b] of [[[[2, 16.2], [1, 12], [0.5, 8], [0, 4.6]], 0], [[[2, -17], [1, -12], [0.5, -8], [0, -4.6]], 0], [[[-8, 15.6], [-6, 11], [-5, 8], [-4, 5]], 0], [[[-8, -16.5], [-6, -11], [-5, -8], [-4, -5]], 0]]) arc(a, 0.34, '#a8261f');
    // the optic disc with its pale cup
    const dg = c.createRadialGradient(15, 2.5, 0, 15, 2.5, 2.6); dg.addColorStop(0, '#fff0b8'); dg.addColorStop(0.55, '#f2c06a'); dg.addColorStop(1, '#d98a45');
    c.fillStyle = dg; c.beginPath(); c.arc(15, 2.5, 2.55, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(120,40,20,0.7)'; c.lineWidth = 0.14; c.stroke();
    c.fillStyle = 'rgba(255,248,215,0.9)'; c.beginPath(); c.ellipse(15, 2.5, 0.95, 1.1, 0, 0, TAU); c.fill();
  }
  Hyper.sim('op-ophthalmoscope', {
    title: 'Looking at the back of the eye: direct, indirect and the fundus camera',
    blurb: `The retina is seen through the pupil, so every method is a way of looking through a small window at a large, curved surface. Left: a schematic retina of a right eye (the macula at the centre, the optic disc towards the nose) with the **circle of what the instrument shows**: drag it. Right: the view. The **direct** ophthalmoscope shows a tiny part, upright and magnified about 15 times; an **indirect** one, with a lens of +20 D or +28 D held in front of the eye, shows a far wider area, upside down and smaller; a **fundus camera** records a wide field as a photograph.

**Try this**
- With *Direct*, aim at the optic disc (15° nasal): the whole view is the disc and a few vessels. Aim at the macula: the dark central area and the tiny pit of the fovea.
- Switch to *Indirect*: the field jumps to some 45° and the picture is inverted, left and right as well as up and down. Move the aim up and the structures in the view move down.
- Change the lens from +20 D to +28 D: the field widens a little and the image gets smaller (magnification is the eye's 60 D divided by the lens power).
- Read the lower read-out: the angle in the eye, how many millimetres of retina that is, and how many optic-disc diameters (1.5 mm) fit across it.

*The retina is drawn schematically (positions and sizes typical of an adult; one degree at the retina is about 0.3 mm). This shows what each instrument looks at; it is not a picture of a real eye and not a means of checking one.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const METHODS = { direct: { name: 'Direct ophthalmoscope', field: 6, mag: E.DATA.power / 4, flip: false }, ind20: { name: 'Indirect, +20 D lens', field: 45, mag: E.DATA.power / 20, flip: true }, ind28: { name: 'Indirect, +28 D lens', field: 53, mag: E.DATA.power / 28, flip: true }, cam: { name: 'Fundus camera', field: 45, mag: null, flip: false } };
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: Object.keys(METHODS).map(k => [METHODS[k].name, k]), value: params.method || 'direct' },
        { id: 'ax', label: 'Aim: towards the nose (+) or the temple (−)', min: -35, max: 35, step: 1, value: params.ax != null ? params.ax : 0, unit: '°' },
        { id: 'ay', label: 'Aim: up (+) or down (−)', min: -25, max: 25, step: 1, value: params.ay != null ? params.ay : 0, unit: '°' },
        { id: 'lab', type: 'check', label: 'Name the structures', value: params.lab !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['view', 'Image seen'], ['mag', 'Magnification'], ['fld', 'Field in the eye'], ['mm', 'Retina in view'], ['dd', 'Optic-disc diameters across'], ['at', 'Aimed at']]);
      let geo = { cxo: 0, cyo: 0, ko: 1 };
      kit.drag(st, {
        hover: true,
        hit: p => Math.hypot(p.x - geo.cxo, p.y - geo.cyo) <= geo.ro + 6 ? 'aim' : null,
        move: (what, p) => { ctl.set('ax', clamp(Math.round((p.x - geo.cxo) / geo.ko), -35, 35)); ctl.set('ay', clamp(Math.round(-(p.y - geo.cyo) / geo.ko), -25, 25)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = METHODS[V.method];
        // ---- the overview, in the anatomical orientation
        const ro0 = Math.min(Hh * 0.34, W * 0.2), cxo = W * 0.21, cyo = Hh * 0.52, ko = ro0 / 42;
        geo = { cxo, cyo, ko, ro: ro0 };
        c.save(); c.beginPath(); c.arc(cxo, cyo, ro0, 0, TAU); c.clip(); c.translate(cxo, cyo); c.scale(ko, -ko); drawFundus(c, C); c.restore();
        c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(cxo, cyo, ro0, 0, TAU); c.stroke();
        const fx = cxo + V.ax * ko, fy = cyo - V.ay * ko, fr = Math.max(3, M.field / 2 * ko);
        c.save(); c.beginPath(); c.arc(cxo, cyo, ro0, 0, TAU); c.clip(); c.strokeStyle = '#ffffff'; c.lineWidth = 2.2; c.beginPath(); c.arc(fx, fy, fr, 0, TAU); c.stroke(); c.strokeStyle = '#101018'; c.lineWidth = 1; c.beginPath(); c.arc(fx, fy, fr + 1.6, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'the retina (right eye) — drag the circle', cxo, 14, { align: 'center', size: 11, color: C.muted, weight: 600 });
        kit.label(c, 'macula', cxo + 2, cyo + 9, { align: 'center', size: 10, color: '#ffe9c8' });
        kit.label(c, 'disc', cxo + 15 * ko, cyo - 2.5 * ko - 11, { align: 'center', size: 10, color: '#ffe9c8' });
        kit.label(c, 'nose ▸', cxo + ro0, cyo + ro0 + 14, { align: 'right', size: 10.5, color: C.faint }); kit.label(c, '◂ temple', cxo - ro0, cyo + ro0 + 14, { size: 10.5, color: C.faint });
        // ---- the view
        const rw = Math.min(Hh * 0.42, W * 0.29), cx = W * 0.71, cy = Hh * 0.52, k = rw / (M.field / 2);
        c.save(); c.beginPath(); c.arc(cx, cy, rw, 0, TAU); c.clip(); c.fillStyle = '#000'; c.fillRect(cx - rw, cy - rw, 2 * rw, 2 * rw);
        c.translate(cx, cy); if (M.flip) c.rotate(PI); c.scale(k, -k); c.translate(-V.ax, -V.ay);
        drawFundus(c, C);
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, rw, 0, TAU); c.stroke();
        kit.label(c, M.name + (M.flip ? ': image inverted' : ''), cx, 14, { align: 'center', size: 11.5, color: C.muted, weight: 600 });
        // names, placed through the same transform
        const toView = (x, y) => { let dx = (x - V.ax) * k, dy = -(y - V.ay) * k; if (M.flip) { dx = -dx; dy = -dy; } return [cx + dx, cy + dy]; };
        if (V.lab) {
          const tag = (x, y, t) => { const p = toView(x, y); if (Math.hypot(p[0] - cx, p[1] - cy) < rw - 16) kit.label(c, t, p[0], p[1], { align: 'center', size: 11, color: '#fff', weight: 650, bg: 'rgba(0,0,0,0.5)' }); };
          tag(15, 2.5, 'optic disc'); tag(0, 0, 'fovea'); tag(0, 8.6, 'artery'); tag(1.8, 15.6, 'vein'); tag(-3, -9, 'macula');
        }
        const fld = M.field, mmAcross = fld * (E.DATA.nodalToRetina * D2R), dd = mmAcross / 1.5;
        const near = (x, y, r) => Math.hypot(V.ax - x, V.ay - y) < r;
        ro.set('view', M.flip ? 'upside down and reversed (a real image)' : M.name === 'Fundus camera' ? 'a photograph, upright' : 'upright (a virtual image)');
        ro.set('mag', M.mag ? fmt(M.mag, 3) + ' ×  (' + E.DATA.power + ' D ÷ ' + (M.name.indexOf('+28') > 0 ? '28' : M.name.indexOf('+20') > 0 ? '20' : '4') + ' D)' : 'recorded on a sensor');
        ro.set('fld', fmt(fld, 2) + '° across');
        ro.set('mm', fmt(mmAcross, 2) + ' mm across');
        ro.set('dd', fmt(dd, 2));
        ro.set('at', near(15, 2.5, 4) ? 'the optic disc' : near(0, 0, 4) ? 'the macula and fovea' : Math.abs(V.ax) > 22 || Math.abs(V.ay) > 16 ? 'the mid-periphery' : 'between the disc and the macula');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tonometry */
  Hyper.sim('op-tonometry', {
    title: 'Applanation tonometry: pressing the cornea flat',
    blurb: `The pressure inside the eye is found by pressing a small flat prism on the cornea until a circle of a set size is flattened, and noting the force. For a thin, perfectly flexible skin the pressure is simply force divided by the flattened area (the Imbert–Fick idea): $P = F/A$. The Goldmann prism flattens a circle 3.06 mm across, an area of 7.35 mm², so that **1 gram of force is 10 mmHg**. Left: the cornea in section. Right: the view through the prism, with the two half-rings of the tear film; the force is right when their inner edges just touch.

**Try this**
- At 15 mmHg set the force to 1.5 gf: the flattened circle is 3.06 mm and the half-rings touch. Press **Balance** at any pressure and the drum reading ×10 equals the pressure.
- Use too little force: the flattened circle is smaller than 3.06 mm and the inner edges stay apart. Too much: they overlap. The reading is wrong either way.
- Raise the pressure to 30 mmHg and keep the force at 1.5 gf: the cornea resists (area = F/P), the circle shrinks to 2.2 mm and the rings part. Twice the pressure needs twice the force for the same circle.
- The graph is the balance line: force against pressure for the 3.06 mm circle.

*A real cornea is neither thin nor perfectly flexible; at 3.06 mm the pull of the tear film on the prism and the stiffness of the cornea cancel almost exactly, which is why that diameter was chosen. A reading depends on corneal thickness and rigidity.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 410 });
      const plot = kit.plot(box.stage, { x: { label: 'pressure (mmHg)', name: 'P', min: 5, max: 40 }, y: { label: 'force (gf)', name: 'F', min: 0, max: 4.2 }, series: [] }, 120);
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Pressure in the eye', min: 5, max: 40, step: 1, value: params.P || 15, unit: 'mmHg' },
        { id: 'F', label: 'Force on the prism (drum reading × 0.1)', min: 0, max: 4.2, step: 0.05, value: params.F != null ? params.F : 1.0, unit: 'gf' },
        { type: 'buttons', items: [{ id: 'bal', label: 'Balance: the rings just touch', primary: true }] }
      ], id => { if (id === 'bal') ctl.set('F', clamp(Math.round(V.P / 10 * 20) / 20, 0, 4.2)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Flattened diameter'], ['A', 'Flattened area'], ['need', 'Force that flattens 3.06 mm at this pressure'], ['read', 'Drum reading (force × 10)'], ['view', 'The two half-rings'], ['err', 'Reading minus true pressure']]);
      const MMHG = 133.322387415, GF = 9.80665e-3, RC = 7.8, DG = 3.06;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const A = V.F * GF / (V.P * MMHG) * 1e6, d = V.F > 0 ? 2 * Math.sqrt(A / PI) : 0, a = d / 2;          // A in mm²
        const sag = x => RC - Math.sqrt(Math.max(0, RC * RC - x * x)), delta = sag(a);
        // ---- the section
        const sc = Math.min(W * 0.46 / 11.5, (Hh - 70) / 8), cx = W * 0.27, ay = Hh * 0.52;
        const front = x => Math.abs(x) < a ? delta : sag(x), back = x => 0.55 + (6.5 - Math.sqrt(Math.max(0, 6.5 * 6.5 - x * x))) + delta * Math.max(0, 1 - Math.abs(x) / (a + 1.6));
        c.save(); c.fillStyle = S.glass(0.3); c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.beginPath();
        for (let q = 0; q <= 60; q++) { const x = -5.5 + 11 * q / 60; (q ? c.lineTo : c.moveTo).call(c, cx + x * sc, ay + front(x) * sc); }
        for (let q = 60; q >= 0; q--) { const x = -5.5 + 11 * q / 60; c.lineTo(cx + x * sc, ay + back(x) * sc); }
        c.closePath(); c.fill(); c.stroke(); c.restore();
        // the aqueous below, and a note
        kit.label(c, 'cornea', cx - 5.6 * sc, ay + 2.6 * sc, { size: 11, color: C.faint, align: 'center' });
        kit.label(c, 'pressure P pushes outwards', cx, ay + 4.2 * sc, { align: 'center', size: 11, color: C.faint });
        for (const x of [-2.4, 0, 2.4]) kit.arrow(c, cx + x * sc, ay + 3.3 * sc, cx + x * sc, ay + 1.9 * sc, C.faint, 1.6);
        // the prism and the force
        const pw = 2.6 * sc, top = ay + delta * sc - 2.2 * sc;
        c.save(); c.fillStyle = S.glass(0.4); c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.beginPath(); c.rect(cx - pw, top, 2 * pw, 2.2 * sc); c.fill(); c.stroke(); c.restore();
        kit.label(c, 'prism', cx + pw + 6, top + 1.1 * sc, { size: 11, color: C.muted });
        if (V.F > 0.01) { kit.arrow(c, cx, top - 34, cx, top - 3, C.accent, 3); kit.label(c, 'F = ' + V.F.toFixed(2) + ' gf', cx + 10, top - 22, { size: 12, color: C.accent, weight: 650 }); }
        if (d > 0.05) S.dim(c, cx - a * sc, ay + delta * sc + 0.9 * sc + 6, cx + a * sc, ay + delta * sc + 0.9 * sc + 6, 'flattened ' + d.toFixed(2) + ' mm', { off: 14 });
        // ---- the view through the prism: two half-rings of fluorescein, each shifted by 1.53 mm
        const vx = W * 0.72, vy = Hh * 0.5, vs = Math.min(W * 0.5 / 7, (Hh - 60) / 5.4), vr = 2.9 * vs;
        c.save(); c.fillStyle = '#04070a'; c.beginPath(); c.arc(vx, vy, vr, 0, TAU); c.fill(); c.clip();
        c.strokeStyle = '#a5ff7c'; c.lineWidth = Math.max(2, 0.22 * vs); c.lineCap = 'butt';
        const ra = Math.max(0.05, a) + 0.11, sh = DG / 2 * vs;
        c.beginPath(); c.arc(vx - sh, vy, ra * vs, PI, TAU); c.stroke();                 // the upper half, moved to the left
        c.beginPath(); c.arc(vx + sh, vy, ra * vs, 0, PI); c.stroke();                    // the lower half, moved to the right
        c.restore();
        c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(vx, vy, vr, 0, TAU); c.stroke();
        kit.label(c, 'through the prism', vx, vy - vr - 11, { align: 'center', size: 11.5, color: C.muted, weight: 600 });
        const gapMm = (DG / 2 - a) * 2;             // the inner edges are this far apart along the horizontal (negative: overlap)
        const word = Math.abs(a * 2 - DG) < 0.04 ? 'touching: the end point' : a * 2 < DG ? 'apart: too little force' : 'overlapping: too much force';
        kit.label(c, word, vx, vy + vr + 14, { align: 'center', size: 12, weight: 650, color: Math.abs(a * 2 - DG) < 0.04 ? C.ok : C.warn });
        const need = V.P * MMHG * (PI * Math.pow(DG / 2, 2)) * 1e-6 / GF;
        ro.set('d', d.toFixed(2) + ' mm'); ro.set('A', A.toFixed(2) + ' mm²');
        ro.set('need', need.toFixed(2) + ' gf  (= P ÷ 10)');
        ro.set('read', (V.F * 10).toFixed(1) + ' mmHg');
        ro.set('view', Math.abs(a * 2 - DG) < 0.04 ? 'inner edges just touch' : a * 2 < DG ? 'inner edges apart by ' + gapMm.toFixed(2) + ' mm' : 'inner edges overlap by ' + (-gapMm).toFixed(2) + ' mm');
        ro.set('err', Math.abs(a * 2 - DG) < 0.04 ? 'none: the reading is the pressure' : sd(V.F * 10 - V.P, 1) + ' mmHg (not a valid reading)');
        plot.set({ series: [{ pts: [[5, 0.5], [40, 4]], label: 'force for a 3.06 mm circle', color: C.series[0] }], marks: [{ x: V.P, y: V.F, label: 'now' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ perimetry */
  Hyper.sim('op-perimetry', {
    title: 'Perimetry: mapping the visual field with a staircase',
    blurb: `A static threshold field test asks, at each of 54 places in the field, **how dim a spot can still be seen** while the eye looks at a central target. The result is a sensitivity in decibels at each place: 0 dB is the brightest spot the machine can show, each 10 dB is ten times dimmer. Each place is found by a **staircase**: dimmer after a "seen", brighter after a "not seen", with 4 dB steps and then 2 dB steps, stopping at the second reversal.

**Try this**
- Run the *normal* field: sensitivity is highest near the centre (about 33 dB) and falls towards the edge. Notice the dark hole at 15° on the temporal side (right, for this right eye): the **blind spot**, where the optic nerve leaves the eye; no cells there, 0 dB.
- Switch to the *schematic arch-shaped loss* in the upper half: the numbers fall in a band and stop sharply at the horizontal midline, the pattern of damage to nerve-fibre bundles.
- Raise the **response variability**: the same field gives different numbers each run; the reading at one place is uncertain by a few decibels. Press *Run again*.
- Click a number: the read-out gives the dimmest spot seen there in luminance, and its contrast against the background.

*The fields here are invented for illustration, and the response model is simple (seen if the spot is brighter than the threshold plus a random error). Real fields are interpreted by a clinician alongside the whole examination.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 310, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'The field being tested', options: [['Normal', 'normal'], ['Schematic arch-shaped loss, upper half', 'arc'], ['Schematic central loss', 'central'], ['Whole field lowered by 8 dB', 'diffuse']], value: params.model || 'normal' },
        { id: 'sig', label: 'Response variability (standard deviation)', min: 0, max: 4, step: 0.5, value: params.sig != null ? params.sig : 1, unit: 'dB' },
        { type: 'buttons', items: [{ id: 'again', label: 'Run again', primary: true }] }
      ], id => { if (id === 'again') run++; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Places tested · presentations'], ['sel', 'Selected place'], ['db', 'Threshold found · true value'], ['lum', 'Dimmest spot seen there'], ['mean', 'Mean of the 54 values'], ['blind', 'At the blind spot']]);
      const PTS = [];
      for (const y of [21, 15, 9, 3, -3, -9, -15, -21]) for (const x of [-21, -15, -9, -3, 3, 9, 15, 21]) if (x * x + y * y <= 600) PTS.push({ x, y });
      PTS.push({ x: -27, y: 3 }, { x: -27, y: -3 });                                       // the nasal step of the 24-2 pattern (the nasal side is on the left for a right eye)
      const BS = { x: 15, y: -1.5, a: 2.75, b: 3.75 };
      const trueDb = (x, y, model) => {
        if (Math.pow((x - BS.x) / BS.a, 2) + Math.pow((y - BS.y) / BS.b, 2) < 1) return 0;
        const ecc = Math.hypot(x, y); let T = 33 - 0.28 * ecc;
        if (model === 'arc' && y > 0.8) T -= 16 * Math.exp(-Math.pow((ecc - 15) / 7, 2));
        else if (model === 'central') T -= 22 * Math.exp(-Math.pow(ecc / 7, 2));
        else if (model === 'diffuse') T -= 8;
        return Math.max(0, T);
      };
      let run = 0, sel = 0, result = { key: '' };
      const gauss = seed => { const r = mulberry(seed * 7919 + 13), z = []; for (let i = 0; i < 4000; i++) z.push(Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(TAU * r())); return z; };
      const test = () => {
        const key = [V.model, V.sig, run].join();
        if (result.key === key) return result;
        const z = gauss(run + 1); let zi = 0, total = 0; const out = [];
        for (const p of PTS) {
          const T = trueDb(p.x, p.y, V.model); let L = 26, step = 4, rev = 0, last = null, lastSeen = -1, n = 0;
          while (rev < 2 && n < 16) {
            const seen = L <= T + V.sig * z[zi++ % z.length]; n++;
            if (last !== null && seen !== last) { rev++; step = 2; }
            if (seen) lastSeen = L;
            last = seen;
            if (rev >= 2) break;
            L = clamp(L + (seen ? step : -step), 0, 40);
            if (!seen && L === 0 && n > 8) break;
          }
          total += n; out.push({ x: p.x, y: p.y, T, db: lastSeen < 0 ? 0 : lastSeen, n });
        }
        return (result = { key, out, total });
      };
      kit.click(st, p => {
        const g = geo; let best = -1, bd = 1e9;
        result.out && result.out.forEach((q, i) => { const dd = Math.hypot(g.cx + q.x * g.k - p.x, g.cy - q.y * g.k - p.y); if (dd < bd) { bd = dd; best = i; } });
        if (best >= 0 && bd < 24) { sel = best; loop.once(); }
      }, p => !!result.out);
      let geo = { cx: 0, cy: 0, k: 1 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, R = test();
        const k = Math.min(W * 0.5 / 66, (Hh - 40) / 62), cx = W * 0.27, cy = Hh * 0.5 + 6;
        geo = { cx, cy, k };
        // ---- the numbers in place
        kit.label(c, W < 560 ? 'dB at each place' : 'sensitivity in dB at each place (right eye)', cx, 14, { align: 'center', size: 11, color: C.muted, weight: 600 });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - 31 * k, cy); c.lineTo(cx + 31 * k, cy); c.moveTo(cx, cy - 26 * k); c.lineTo(cx, cy + 26 * k); c.stroke();
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.ellipse(cx + BS.x * k, cy - BS.y * k, BS.a * k, BS.b * k, 0, 0, TAU); c.stroke(); c.restore();
        R.out.forEach((q, i) => {
          const col = q.db >= 25 ? C.text : q.db >= 15 ? C.warn : C.bad;
          if (i === sel) { c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(cx + q.x * k - 13, cy - q.y * k - 8, 26, 16); }
          kit.label(c, String(q.db), cx + q.x * k, cy - q.y * k, { align: 'center', size: 11, color: col, weight: 600 });
        });
        kit.label(c, 'temporal ▸', cx + 31 * k, cy + 26 * k + 12, { align: 'right', size: 10.5, color: C.faint }); kit.label(c, '◂ nasal', cx - 31 * k, cy + 26 * k + 12, { size: 10.5, color: C.faint });
        // ---- the map: nearest-neighbour weighted values, dark where sensitivity is low
        const mx = W * 0.74, ms = Math.min(W * 0.4, Hh - 50), n = 48;
        kit.label(c, W < 560 ? 'grey-scale map' : 'grey-scale map (dark: less sensitive)', mx, 14, { align: 'center', size: 11, color: C.muted, weight: 600 });
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const x = ((i + 0.5) / n * 2 - 1) * 30, y = (1 - (j + 0.5) / n * 2) * 30;
          if (Math.hypot(x, y) > 30) continue;
          let sw = 0, sv = 0;
          for (const q of R.out) { const d2 = (q.x - x) * (q.x - x) + (q.y - y) * (q.y - y); if (d2 < 100) { const w = 1 / (d2 + 1); sw += w; sv += w * q.db; } }
          if (!sw) continue;
          const g = Math.round(255 * Math.pow(clamp(sv / sw / 35, 0, 1), 0.9)); c.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
          c.fillRect(mx - ms / 2 + i * ms / n, cy - ms / 2 + j * ms / n, ms / n + 0.7, ms / n + 0.7);
        }
        c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(mx, cy, ms / 2, 0, TAU); c.stroke();
        const mean = R.out.reduce((s, q) => s + q.db, 0) / R.out.length, q = R.out[sel] || R.out[0];
        const inc = 3183 * Math.pow(10, -q.db / 10);
        ro.set('n', R.out.length + ' · ' + R.total);
        ro.set('sel', '(' + (q.x > 0 ? q.x + '° temporal' : -q.x + '° nasal') + ', ' + (q.y > 0 ? q.y + '° up' : -q.y + '° down') + ')');
        ro.set('db', q.db + ' dB · ' + fmt(q.T, 3) + ' dB  (' + q.n + ' presentations)');
        ro.set('lum', q.db <= 0 ? 'only the brightest spot, 3183 cd/m² or more' : inc.toFixed(inc < 10 ? 2 : 0) + ' cd/m² added to a 10 cd/m² background (contrast ' + (100 * inc / 10).toFixed(0) + ' %)');
        ro.set('mean', mean.toFixed(1) + ' dB');
        const bs = R.out.filter(p => Math.pow((p.x - BS.x) / BS.a, 2) + Math.pow((p.y - BS.y) / BS.b, 2) < 1.6);
        ro.set('blind', bs.length ? bs.map(p => p.db + ' dB at (' + p.x + '°, ' + p.y + '°)').join(' · ') : 'no test place falls on it');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a pseudo-isochromatic plate */
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  const digitRects = (d, x0, y0, w, h) => {
    const tu = 0.3, tv = 0.2, R = {
      a: [0.08, 0, 0.92, tv], b: [1 - tu, 0.05, 1, 0.55], c: [1 - tu, 0.45, 1, 0.95], d: [0.08, 1 - tv, 0.92, 1], e: [0, 0.45, tu, 0.95], f: [0, 0.05, tu, 0.55], g: [0.08, 0.5 - tv / 2, 0.92, 0.5 + tv / 2]
    };
    return SEG[d].split('').map(s => { const r = R[s]; return [x0 + r[0] * w, y0 + r[1] * h, x0 + r[2] * w, y0 + r[3] * h]; });
  };
  Hyper.sim('op-ishihara', {
    title: 'A dot plate and how it looks with a colour-vision deficiency',
    blurb: `A **pseudo-isochromatic plate** hides a number in a field of dots. The number is made of dots of one hue and the background of another, and every dot is randomly lighter or darker, so brightness is no clue: only the **difference of hue** reveals the number. Colours that a person with a colour-vision deficiency confuses are chosen on purpose, so for them the number sinks into the background.

**Try this**
- With typical colour vision the number stands out (orange dots on olive green). Choose *protan* or *deutan* and watch it dissolve; the read-out gives the colour difference between figure and ground, in CIELAB ΔE units, before and after. Lower the severity to model a weaker deficiency.
- Tritan vision confuses a different pair of hues, so this plate (which is not designed for it) stays readable.
- Rod monochromacy removes colour altogether: nothing is left but the random lightness, and the number cannot be read.
- Tick *Outline the figure* to see where the number is hidden.

*A demonstration of the principle, never a test: a screen's colours are not calibrated, and the simulation is an average model. Real screening uses printed plates under standard light, administered by a practitioner.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'num', type: 'select', label: 'Number hidden in the plate', options: [['12', 12], ['29', 29], ['45', 45], ['74', 74], ['38', 38]], value: params.num || 74 },
        { id: 'vis', type: 'select', label: 'Colour vision', options: [['Typical', 'none'], ['Protan (red-weak)', 'protan'], ['Deutan (green-weak)', 'deutan'], ['Tritan (blue–yellow)', 'tritan'], ['Rod monochromacy (no colour)', 'achroma']], value: params.vis || 'none' },
        { id: 'sev', label: 'Severity of the deficiency', min: 0, max: 100, step: 5, value: params.sev != null ? params.sev : 100, unit: '%' },
        { id: 'outline', type: 'check', label: 'Outline the figure', value: !!params.outline }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['de0', 'Figure against ground, typical vision'], ['de1', 'Figure against ground, as seen'], ['lum', 'Lightness of figure · ground, as seen'], ['say', 'The number']]);
      const FIG = [[201, 138, 42], [214, 122, 50], [222, 150, 60], [190, 125, 35], [208, 146, 56]], GND = [[129, 166, 47], [110, 155, 50], [145, 175, 60], [120, 160, 40], [135, 170, 70]];
      // the dots: placed once by dart throwing, large ones first, in a disc of radius 1
      const rnd = mulberry(20261004), dots = [];
      for (const [rmin, rmax, tries] of [[0.06, 0.08, 900], [0.042, 0.06, 2500], [0.03, 0.042, 5000], [0.02, 0.03, 8000], [0.012, 0.02, 6000]]) {
        for (let t = 0; t < tries; t++) {
          const r = rmin + (rmax - rmin) * rnd(), a = rnd() * TAU, d = Math.sqrt(rnd()) * (1 - r), x = d * Math.cos(a), y = d * Math.sin(a);
          let ok = true; for (const q of dots) { if ((q.x - x) * (q.x - x) + (q.y - y) * (q.y - y) < (q.r + r + 0.008) * (q.r + r + 0.008)) { ok = false; break; } }
          if (ok) dots.push({ x, y, r, k: Math.floor(rnd() * 5), f: 0.8 + 0.4 * rnd() });
        }
      }
      const mean = a => a.reduce((s, c) => [s[0] + c[0] / a.length, s[1] + c[1] / a.length, s[2] + c[2] / a.length], [0, 0, 0]);
      const see = c => V.vis === 'none' ? c : Cl.cvd(c, V.vis, V.sev / 100);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = Math.min(Hh * 0.46, W * 0.3), cx = W * 0.5, cy = Hh * 0.5;
        const rects = digitRects(Math.floor(V.num / 10), -0.6, -0.44, 0.5, 0.88).concat(digitRects(V.num % 10, 0.1, -0.44, 0.5, 0.88));
        const inFig = d => rects.some(r => d.x > r[0] - 0.3 * d.r && d.x < r[2] + 0.3 * d.r && d.y > r[1] - 0.3 * d.r && d.y < r[3] + 0.3 * d.r);
        c.fillStyle = C.dark ? '#d8d6d0' : '#f1efe9'; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
        for (const d of dots) {
          const base = inFig(d) ? FIG[d.k] : GND[d.k], col = see([clamp(base[0] * d.f, 0, 255), clamp(base[1] * d.f, 0, 255), clamp(base[2] * d.f, 0, 255)]);
          c.fillStyle = 'rgb(' + Math.round(col[0]) + ',' + Math.round(col[1]) + ',' + Math.round(col[2]) + ')';
          c.beginPath(); c.arc(cx + d.x * R, cy + d.y * R, d.r * R, 0, TAU); c.fill();
        }
        if (V.outline) { c.strokeStyle = C.bad; c.lineWidth = 1.5; for (const r of rects) c.strokeRect(cx + r[0] * R, cy + r[1] * R, (r[2] - r[0]) * R, (r[3] - r[1]) * R); }
        c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        kit.label(c, 'a plate drawn for this demonstration — hidden number ' + (V.outline ? V.num : '(read it)'), cx, 14, { align: 'center', size: 11.5, color: C.muted });
        const mf = mean(FIG), mg = mean(GND), l0 = Cl.labOfRgb(mf), l1 = Cl.labOfRgb(mg), s0 = Cl.labOfRgb(see(mf)), s1 = Cl.labOfRgb(see(mg));
        const d0 = Cl.deltaE(l0, l1), d1 = Cl.deltaE(s0, s1);
        // the colour difference with lightness left out: what remains for someone who must use hue alone
        const hueOnly = (a, b) => Math.hypot(a[1] - b[1], a[2] - b[2]);
        ro.set('de0', 'ΔE ' + d0.toFixed(0) + '  (hue and chroma part ' + hueOnly(l0, l1).toFixed(0) + ')');
        ro.set('de1', 'ΔE ' + d1.toFixed(0) + '  (hue and chroma part ' + hueOnly(s0, s1).toFixed(0) + ')');
        ro.set('lum', 'L* ' + s0[0].toFixed(0) + ' · ' + s1[0].toFixed(0) + '  (and each dot is varied by about ± 20 %)');
        ro.set('say', hueOnly(s0, s1) > 25 ? 'stands out by hue' : hueOnly(s0, s1) > 12 ? 'faint: hard to read' : 'lost: only lightness is left, and that is random');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the cover test */
  Hyper.sim('op-cover', {
    title: 'The cover–uncover test: phoria and tropia',
    blurb: `Two eyes seen from above, looking at a target straight ahead. The examiner covers one eye and **watches the other** (the *cover* test), then uncovers it and **watches that one** (the *uncover* test). A **tropia** is a deviation that is there even with both eyes open: the eye that was not looking at the target moves to take up fixation when the good eye is covered. A **phoria** is a *latent* tendency: both eyes aim correctly until fusion is broken by covering one, which then drifts, and swings back when uncovered.

**Try this**
- Choose *exophoria* (an outward drift, 12 Δ) and press **Cover right eye**: the left eye, uncovered, does not move; the covered right eye drifts outward behind the cover. Press **Uncover**: the right eye swings *inward* to the target. That swing is the sign.
- Choose *esotropia* (the left eye turned in) and cover the right eye: the left eye moves **outward** to take up the target. A movement of the *uncovered* eye is the sign of a tropia.
- Cover the left (turned) eye: the right eye does not move: the deviation was never in the fixing eye.
- One prism dioptre (1 Δ) is 1 cm of deviation at 1 m: 12 Δ is 6.8°. Move the target to 6 m or 40 cm: the same Δ is the same angle, but the eyes' convergence changes.

*Schematic: the distance to the target is not drawn to scale; the angles of the eyes are. A demonstration of the method, not a means of assessing anyone's eyes.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'cond', type: 'select', label: 'The eyes of this person', options: [['Orthophoria: no deviation', 'none'], ['Exophoria: a latent outward drift', 'exo'], ['Esophoria: a latent inward drift', 'eso'], ['Exotropia: the left eye turns out', 'exot'], ['Esotropia: the left eye turns in', 'esot']], value: params.cond || 'exo' },
        { id: 'dev', label: 'Size of the deviation', min: 2, max: 40, step: 1, value: params.dev || 12, unit: 'Δ' },
        { id: 'dist', type: 'select', label: 'Distance of the target', options: [['6 m (distance)', 6000], ['40 cm (near)', 400]], value: params.dist || 6000 },
        { id: 'cover', type: 'select', label: 'The cover is over', options: [['neither eye', 'none'], ['the right eye', 'R'], ['the left eye', 'L']], value: params.cover || 'none' },
        { type: 'buttons', items: [{ id: 'cr', label: 'Cover right eye' }, { id: 'cl', label: 'Cover left eye' }, { id: 'un', label: 'Uncover', primary: true }, { id: 'alt', label: 'Alternate' }] }
      ], (id, val) => {
        if (id === 'cr') setCover('R'); else if (id === 'cl') setCover('L'); else if (id === 'un') setCover('none'); else if (id === 'alt') setCover(V.cover === 'R' ? 'L' : 'R');
        else if (id === 'cover') handle(prevCover, val), prevCover = val;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dev', 'Deviation'], ['conv', 'Convergence needed by each eye'], ['seen', 'What the examiner saw last'], ['mean', 'What it means']]);
      const tgtAngles = cover => {                       // the steady position of (right, left) eyes in degrees, positive = turned towards the nose
        const c = Math.atan(32 / V.dist) * R2D, dv = Math.atan(V.dev / 100) * R2D, out = { R: c, L: c };
        const sign = V.cond === 'exo' || V.cond === 'exot' ? -1 : 1;
        if (V.cond === 'exo' || V.cond === 'eso') { if (cover === 'R') out.R = c + sign * dv; if (cover === 'L') out.L = c + sign * dv; }
        else if (V.cond === 'exot' || V.cond === 'esot') {
          if (cover === 'none') out.L = c + sign * dv;
          else if (cover === 'R') { out.R = c + sign * dv; out.L = c; }
          else out.L = c + sign * dv;
        }
        return out;
      };
      let prevCover = V.cover, last = { text: 'nothing yet: cover an eye', mean: 'press a button to begin' };
      const dirWord = m => Math.abs(m) < 0.15 ? 'did not move' : m > 0 ? 'moved inward (towards the nose) by ' + Math.abs(m).toFixed(1) + '°, ' + (100 * Math.tan(Math.abs(m) * D2R)).toFixed(0) + ' Δ' : 'moved outward by ' + Math.abs(m).toFixed(1) + '°, ' + (100 * Math.tan(Math.abs(m) * D2R)).toFixed(0) + ' Δ';
      function handle(prev, now) {
        if (prev === now) return;
        const a = tgtAngles(prev), b = tgtAngles(now);
        let eye, kind;
        if (now === 'none') { eye = prev; kind = 'uncover'; } else { eye = now === 'R' ? 'L' : 'R'; kind = 'cover'; }
        const m = b[eye] - a[eye], name = eye === 'R' ? 'right' : 'left';
        if (kind === 'cover') {
          last = { text: 'the uncovered ' + name + ' eye ' + dirWord(m), mean: Math.abs(m) < 0.15 ? 'no movement of the eye being watched: it was already aimed at the target' : 'the eye being watched had to take up fixation: it was not aimed at the target (a tropia; it was turned ' + (m > 0 ? 'outward' : 'inward') + ')' };
        } else {
          last = { text: 'the ' + name + ' eye, just uncovered, ' + dirWord(m), mean: Math.abs(m) < 0.15 ? 'no recovery movement: the eye had stayed aimed at the target behind the cover' : (V.cond === 'exo' || V.cond === 'eso') ? 'it had drifted ' + (m > 0 ? 'outward' : 'inward') + ' behind the cover and swung back to fuse: a phoria' : 'it took up fixation again: the other eye goes back to its deviated position' };
        }
      }
      function setCover(v) { const p = V.cover; ctl.set('cover', v); handle(p, v); prevCover = v; }
      const cur = { R: tgtAngles(V.cover).R, L: tgtAngles(V.cover).L };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, T = tgtAngles(V.cover), k = 1 - Math.exp(-(dt || 0.1) * 9);
        cur.R += (T.R - cur.R) * (dt ? k : 1); cur.L += (T.L - cur.L) * (dt ? k : 1);
        const cx = W / 2, ey = Hh * 0.7, sep = Math.min(W * 0.2, 96), r = Math.min(Hh * 0.1, 38);
        // the target, not to scale
        const ty = 34;
        c.fillStyle = C.accent; c.beginPath(); c.arc(cx, ty, 8, 0, TAU); c.fill();
        kit.label(c, 'target at ' + (V.dist >= 1000 ? V.dist / 1000 + ' m' : V.dist / 10 + ' cm') + '  (not to scale)', cx + 16, ty, { size: 11.5, color: C.muted });
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(cx, ty + 10); c.lineTo(cx, ey - r - 4); c.stroke(); c.restore();
        // the nose
        c.strokeStyle = C.border2; c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - 14, ey + r + 22); c.lineTo(cx, ey + r - 8); c.lineTo(cx + 14, ey + r + 22); c.stroke();
        const eyes = [['R', cx + sep, -1, 'right eye'], ['L', cx - sep, 1, 'left eye']];
        for (const [id, x, sg, name] of eyes) {
          const th = cur[id] * D2R, dx = sg * Math.sin(th), dy = -Math.cos(th), covered = V.cover === id;
          // the line of sight and the straight-ahead line
          c.strokeStyle = covered ? C.faint : C.accent; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, ey); c.lineTo(x + dx * (r + 120), ey + dy * (r + 120)); c.stroke();
          c.fillStyle = C.dark ? 'rgba(235,238,250,0.9)' : '#ffffff'; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(x, ey, r, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = C.dark ? '#5f7fb0' : '#6f93c8'; c.beginPath(); c.arc(x + dx * r * 0.8, ey + dy * r * 0.8, r * 0.36, 0, TAU); c.fill();
          c.fillStyle = '#111'; c.beginPath(); c.arc(x + dx * r * 0.86, ey + dy * r * 0.86, r * 0.17, 0, TAU); c.fill();
          kit.label(c, name, x, ey + r + 16, { align: 'center', size: 11.5, color: C.muted });
          if (covered) { c.fillStyle = C.dark ? '#3a3f55' : '#555a70'; c.fillRect(x - r * 1.25, ey - r - 24, r * 2.5, 12); c.fillRect(x - 5, ey - r - 14, 10, 40 - 14 + 14); kit.label(c, 'cover', x, ey - r - 38, { align: 'center', size: 11, color: C.muted }); }
          // the deviation from the straight-ahead position of this eye, as an arc
          const c0 = Math.atan(32 / V.dist), dv = cur[id] * D2R - c0;
          if (Math.abs(dv) > 0.02 && !covered) { c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); const a0 = -PI / 2 + sg * c0, a1 = -PI / 2 + sg * cur[id] * D2R; c.arc(x, ey, r + 52, Math.min(a0, a1), Math.max(a0, a1)); c.stroke(); }
        }
        const dvDeg = Math.atan(V.dev / 100) * R2D;
        ro.set('dev', V.cond === 'none' ? 'none' : V.dev + ' Δ = ' + dvDeg.toFixed(1) + '°  (' + ({ exo: 'exophoria', eso: 'esophoria', exot: 'exotropia', esot: 'esotropia' })[V.cond] + ')');
        ro.set('conv', (Math.atan(32 / V.dist) * R2D).toFixed(2) + '°  (' + (100 * 32 / V.dist).toFixed(1) + ' Δ each; 64 mm between the eyes)');
        ro.set('seen', last.text); ro.set('mean', last.mean);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ OCT of a model macula */
  const LAYERS = [
    { id: 'RNFL', name: 'nerve fibre layer', T: 30, inner: true, r: 0.85 }, { id: 'GCL', name: 'ganglion cell layer', T: 35, inner: true, r: 0.3 },
    { id: 'IPL', name: 'inner plexiform layer', T: 38, inner: true, r: 0.55 }, { id: 'INL', name: 'inner nuclear layer', T: 32, inner: true, r: 0.25 },
    { id: 'OPL', name: 'outer plexiform layer', T: 28, inner: true, r: 0.6 }, { id: 'ONL', name: 'outer nuclear layer', T: 85, r: 0.1 },
    { id: 'ELM', name: 'external limiting membrane', T: 4, r: 0.55 }, { id: 'EZ', name: 'ellipsoid zone', T: 14, r: 0.9 },
    { id: 'OS', name: 'photoreceptor outer segments', T: 28, r: 0.28 }, { id: 'RPE', name: 'pigment epithelium', T: 14, r: 1.0 }
  ];
  /* thickness (µm) of a layer at x mm from the centre of the fovea: inner layers vanish into the pit and thicken on its rim */
  const layerT = (L, x) => {
    const f = Math.exp(-Math.pow(x / 0.5, 2)), rim = 1 + 0.25 * Math.exp(-Math.pow((Math.abs(x) - 0.95) / 0.5, 2)), per = 1 - 0.05 * Math.abs(x);
    return L.inner ? L.T * (1 - Math.pow(f, 1.3)) * rim * per : L.id === 'ONL' ? L.T * (1 + 0.25 * f) : L.id === 'OS' ? L.T * (1 + 0.3 * f) : L.T;
  };
  const ZRPE = 400, ZMAX = 720, DZ = 2;                       // the bottom of the RPE at 400 µm; the picture is 720 µm deep; 2 µm samples
  /* the reflectivity along depth at x: the layers stacked up from the pigment epithelium, then Bruch's membrane and the choroid */
  function octProfile(x) {
    const n = ZMAX / DZ, r = new Float32Array(n); let z = ZRPE;
    const put = (z0, z1, v) => { for (let i = Math.max(0, Math.floor(z0 / DZ)); i < Math.min(n, Math.ceil(z1 / DZ)); i++) r[i] = Math.max(r[i], v); };
    const spans = [];
    for (let i = LAYERS.length - 1; i >= 0; i--) { const t = layerT(LAYERS[i], x); spans.unshift({ L: LAYERS[i], z0: z - t, z1: z }); z -= t; }
    for (const s of spans) put(s.z0, s.z1, s.L.r);
    put(spans[0].z0 - 3, spans[0].z0 + 2, 0.55);              // the inner limiting membrane against the clear vitreous
    put(ZRPE, ZRPE + 22, 0.5);                                // Bruch's membrane and the capillary layer
    for (let i = Math.floor((ZRPE + 22) / DZ); i < n; i++) r[i] = Math.max(r[i], 0.3 * Math.exp(-(i * DZ - ZRPE - 22) / 170));
    return { r, spans };
  }
  const octBlur = (r, sigUm) => {
    const n = r.length, s = Math.max(0.01, sigUm / DZ), h = Math.ceil(3 * s), k = []; let sum = 0;
    for (let i = -h; i <= h; i++) { const w = Math.exp(-i * i / (2 * s * s)); k.push(w); sum += w; }
    const o = new Float32Array(n);
    for (let i = 0; i < n; i++) { let a = 0; for (let q = -h; q <= h; q++) { const j = i + q; if (j >= 0 && j < n) a += r[j] * k[q + h]; } o[i] = a / sum; }
    return o;
  };
  Hyper.sim('op-oct', {
    title: 'OCT of a model retina: layers, resolution and the A-scan',
    blurb: `Optical coherence tomography builds a cross-section from the echoes of light: each **A-scan** is the reflectivity along one line going into the tissue, and a **B-scan** is many of them side by side. How finely it separates two layers is set by the **bandwidth** of the light source: the broader the spectrum, the shorter the coherence length and the thinner the slice, **0.44 λ²/Δλ** in air (divide by the tissue's index, about 1.38, for the depth in the retina). Left: the B-scan of a made-up macula across its centre (the vertical scale stretched about 4×). Below: the A-scan along the dashed line.

**Try this**
- With 840 nm and 50 nm of bandwidth the resolution is about 4.5 µm in tissue: the retina shows as ten layers, the pit at the centre where the inner layers vanish, and the bright line of the pigment epithelium.
- Narrow the bandwidth to 10 nm: the resolution falls to some 22 µm, thin layers merge and the A-scan loses its separate peaks (the read-out lists which layers have merged).
- Drag the dashed line (or use the position slider) to the centre: the retina is thinnest there, about 0.2 mm; on the rim of the pit it is thickest, about 0.35 mm.
- Switch to 1050 nm: for the same bandwidth the resolution is coarser (it grows as λ²) but the light goes deeper into the choroid below.

*Layer thicknesses are typical orders of magnitude, drawn smoothly; speckle is a simple random texture. Not an image of a real retina.*`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250, maxH: 330 });
      const plot = kit.plot(box.stage, { x: { label: 'depth (µm)', name: 'z', min: 0, max: ZMAX }, y: { label: 'reflectivity', name: 'R', min: 0, max: 1.05 }, series: [] }, 130);
      const ctl = kit.controls(box.side, [
        { id: 'lam', type: 'select', label: 'Centre wavelength', options: [['840 nm (retina, spectral-domain)', 840], ['1050 nm (swept source, deeper)', 1050]], value: params.lam || 840 },
        { id: 'bw', label: 'Bandwidth of the source', min: 5, max: 150, value: params.bw || 50, log: true, sig: 2, unit: 'nm' },
        { id: 'x', label: 'Position of the A-scan', min: -2.9, max: 2.9, step: 0.05, value: params.x != null ? params.x : 0.9, unit: 'mm' },
        { id: 'speckle', type: 'check', label: 'Speckle', value: params.speckle !== false },
        { id: 'names', type: 'check', label: 'Name the layers', value: params.names !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dz', 'Axial resolution in air · in tissue'], ['thick', 'Retina at the A-scan (inner surface to pigment epithelium)'], ['merged', 'Layers thinner than the resolution here'], ['scan', 'Scan']]);
      const NX = 200, NZ = ZMAX / 3, NTISS = 1.38;
      let img = { key: '', a: null }, geo = { x: 0, y: 0, w: 1, h: 1 };
      kit.drag(st, {
        hover: true,
        hit: p => (p.x >= geo.x - 8 && p.x <= geo.x + geo.w + 8 && p.y >= geo.y && p.y <= geo.y + geo.h) ? 'scan' : null,
        move: (what, p) => { ctl.set('x', clamp(Math.round(((p.x - geo.x) / geo.w * 6 - 3) * 20) / 20, -2.9, 2.9)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const dzAir = 0.44 * V.lam * V.lam / V.bw / 1000, dzT = dzAir / NTISS, sig = dzT / 2.355;           // µm
        const key = [V.lam, V.bw, V.speckle].join();
        if (img.key !== key) {
          const a = new Float32Array(NX * NZ), rnd = mulberry(5150), cell = Math.max(1, Math.round(dzT / 3)), noise = [], ncol = Math.ceil(NX / 4) + 2, nrow = Math.ceil(NZ / cell) + 2;
          for (let i = 0; i < ncol * nrow; i++) noise.push(0.25 + 1.5 * rnd() * rnd() + 0.2 * rnd());
          for (let i = 0; i < NX; i++) {
            const x = (i + 0.5) / NX * 6 - 3, b = octBlur(octProfile(x).r, sig);
            for (let j = 0; j < NZ; j++) {
              let v = b[Math.min(b.length - 1, Math.floor(j * 3 / DZ))];
              if (V.speckle) { const fx = i / 4, fz = j / cell, x0 = Math.floor(fx), z0 = Math.floor(fz), tx = fx - x0, tz = fz - z0, g = (p, q) => noise[q * ncol + p]; v *= g(x0, z0) * (1 - tx) * (1 - tz) + g(x0 + 1, z0) * tx * (1 - tz) + g(x0, z0 + 1) * (1 - tx) * tz + g(x0 + 1, z0 + 1) * tx * tz; }
              a[j * NX + i] = clamp(Math.pow(v, 0.55) * 1.15 + 0.02 * rnd(), 0, 1);
            }
          }
          img = { key, a };
        }
        const bw0 = Math.min(W * 0.62, 460), bh = Math.min(Hh - 56, bw0 * 0.5), bx = 14, by = 28;
        geo = { x: bx, y: by, w: bw0, h: bh };
        S.image(c, bx, by, bw0, bh, NX, NZ, (u, v) => img.a[Math.min(NZ - 1, Math.floor(v * NZ)) * NX + Math.min(NX - 1, Math.floor(u * NX))], { key: 'oct|' + key, id: 'oct' });
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(bx - 0.5, by - 0.5, bw0 + 1, bh + 1);
        kit.label(c, W < 560 ? 'B-scan of the macula, 6 mm wide' : 'B-scan across the centre of the macula, 6 mm wide, 0.72 mm deep', bx, 13, { size: 11, color: C.muted, weight: 600 });
        const sx = bx + (V.x + 3) / 6 * bw0;
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(sx, by); c.lineTo(sx, by + bh); c.stroke(); c.restore();
        // scale bar: 500 µm across
        c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + 10, by + bh - 10); c.lineTo(bx + 10 + 0.5 / 6 * bw0, by + bh - 10); c.stroke(); kit.label(c, '0.5 mm', bx + 14 + 0.5 / 6 * bw0, by + bh - 10, { size: 10.5, color: '#fff' });
        // the A-scan and the layer names
        const pr = octProfile(V.x), bl = octBlur(pr.r, sig), top = pr.spans[0].z0, bot = ZRPE;
        const zpx = z => by + z / ZMAX * bh;
        if (V.names) {
          let lastY = -99;
          for (const s of pr.spans) { const yy = zpx((s.z0 + s.z1) / 2); if (s.z1 - s.z0 > 1 && yy - lastY >= 12) { kit.label(c, s.L.id, bx + bw0 + 8, yy, { size: 10.5, color: C.muted }); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(bx + bw0 + 2, yy); c.lineTo(bx + bw0 + 6, yy); c.stroke(); lastY = yy; } }
          kit.label(c, 'choroid', bx + bw0 + 8, zpx(ZRPE + 120), { size: 10.5, color: C.muted });
        }
        const pts = [], truth = []; for (let i = 0; i < bl.length; i++) { pts.push([i * DZ, bl[i]]); truth.push([i * DZ, pr.r[i]]); }
        plot.set({ series: [{ pts: truth, label: 'the layers as they are', color: C.faint, dash: [3, 3] }, { pts, label: 'as the instrument sees them', color: C.series[0] }], vlines: [], marks: [{ x: top, y: bl[Math.floor(top / DZ)] || 0, label: 'inner surface' }, { x: ZRPE - 7, y: bl[Math.floor((ZRPE - 7) / DZ)] || 0, label: 'RPE' }] });
        const merged = pr.spans.filter(s => s.z1 - s.z0 > 1 && s.z1 - s.z0 < dzT).map(s => s.L.id);
        ro.set('dz', fmt(dzAir, 2) + ' µm · ' + fmt(dzT, 2) + ' µm  (0.44 λ² / Δλ, n = ' + NTISS + ')');
        ro.set('thick', (bot - top).toFixed(0) + ' µm  (the inner layers are absent in the middle of the pit)');
        ro.set('merged', merged.length ? merged.join(', ') : 'none: every layer here is thicker than the resolution');
        ro.set('scan', V.lam + ' nm, ' + V.bw + ' nm bandwidth; depth range of the picture 0.72 mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
