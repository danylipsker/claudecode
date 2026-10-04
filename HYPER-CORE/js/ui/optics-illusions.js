/* HYPER-CORE · ui/optics-illusions.js — Tools → Illusions (#/tools/illusions/<id>)
 *
 * A gallery of interactive illusions. One stage, one set of controls, one loop: the select (or Previous / Next) picks the
 * illusion, shows its own controls and read-out, hides the others, and the sub-route follows. Every illusion is an entry of
 * LIST with the same shape:
 *
 *   id, name, group, page (its concept), also [more concepts], hint (the line over the figure), bg (the figure's own
 *   panel colour), controls [kit.controls definitions with local ids], rows [read-out rows], init() -> state kept between
 *   visits, draw(g) the figure, optional hit / move (a drag on the stage), click, on(key, value, state) (a control changed),
 *   anim (needs the loop), text [what you see, what is really there, why], cond (the viewing condition).
 *
 * g is the drawing context of one frame: g.c (canvas), g.C (theme), the panel g.x g.y g.w g.h g.cx g.cy g.u, g.V (control
 * values), g.s (state), g.ink (text colour for the panel), g.dt (seconds since the last frame, 0 for a still redraw) and
 * g.say(row, text). The figure is drawn with fixed colours on its own panel; the theme only paints the frame, the
 * guides (g.C.bad) and the labels. Where a figure claims "the same grey" the value is computed once, used for every fill
 * and printed in the read-out.
 *
 * All input goes through kit.controls and kit.drag / kit.click, so the headless test (tools/labtest.js) can drive it.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics;
  const T = H.opticsTools = H.opticsTools || {};
  const Cl = O.colour, clamp = O.clamp, f = T.util.f, TAU = Math.PI * 2, D2R = Math.PI / 180;

  /* ---------------------------------------------------------------- small helpers */
  const gr = v => { v = Math.round(clamp(v, 0, 255)); return 'rgb(' + v + ',' + v + ',' + v + ')'; };       // a grey, as a fill
  const rgb = a => 'rgb(' + a.map(v => Math.round(clamp(v, 0, 255))).join(',') + ')';
  const rgbT = a => 'rgb(' + a.map(v => Math.round(clamp(v, 0, 255))).join(', ') + ')';                      // the same, for read-outs
  const grT = v => rgbT([v, v, v]);
  const lab = (L, a, b) => Cl.srgb(Cl.fit(Cl.toRgb(Cl.fromLab([L, a, b])), 0));                              // CIELAB -> sRGB 0…255
  const pc = v => Math.round(v) + ' %';
  const num = (x, d) => f(x, d == null ? 1 : d);
  const lumOf = css => { const m = /^#([0-9a-f]{6})$/i.exec(css); const a = m ? [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16)) : (css.match(/\d+/g) || [128, 128, 128]).map(Number); return 0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]; };
  function ln(c, x1, y1, x2, y2, col, w, dash) { c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.setLineDash(dash || []); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore(); }
  function poly(c, pts, fill, stroke, w) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.stroke(); } }
  function circ(c, x, y, r, fill, stroke, w, dash) { if (!(r > 0)) return; c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.setLineDash(dash || []); c.stroke(); } c.restore(); }
  const rect = (c, x, y, w, h, fill) => { c.fillStyle = fill; c.fillRect(x, y, w, h); };
  const txt = (g, s, x, y, o) => K.label(g.c, s, x, y, Object.assign({ size: 11.5, color: g.ink }, o || {}));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const LIST = [];
  const add = it => { LIST.push(it); return it; };
  const SIZE = 'Size and length', LINES = 'Lines and angles', BRIGHT = 'Brightness and contrast', COLOUR = 'Colour', MOTION = 'Motion', AMBIG = 'Ambiguous and impossible', SEE = 'Seeing';
  const GROUP_TAG = { [SIZE]: 'Size', [LINES]: 'Lines', [BRIGHT]: 'Brightness', [COLOUR]: 'Colour', [MOTION]: 'Motion', [AMBIG]: 'Ambiguous', [SEE]: 'Seeing' };
  /* the matching tasks start from a deliberately wrong setting, so that the reader has something to correct */
  const wrongStart = () => (Math.random() < 0.5 ? rnd(0.72, 0.88) : rnd(1.14, 1.3));

  /* ================================================================ size and length */

  /* the two fins at each end of a shaft: out = tails (they point away from the shaft), otherwise heads (they point back along it) */
  function fins(c, ink, xa, xb, y, fl, a, out) {
    for (const [x, sg] of [[xa, -1], [xb, 1]]) {
      const dx = (out ? sg : -sg) * Math.cos(a) * fl, dy = Math.sin(a) * fl;
      ln(c, x, y, x + dx, y - dy, ink, 3); ln(c, x, y, x + dx, y + dy, ink, 3);
    }
  }

  add({
    id: 'muller-lyer', name: 'Müller-Lyer arrows', group: SIZE, page: 'size-and-length-illusions', also: ['depth-and-perspective-illusions'],
    hint: 'Which shaft is longer: the one with fins pointing out, or the one with fins pointing in?',
    controls: [
      { id: 'angle', label: 'Fin angle to the shaft', min: 10, max: 80, step: 1, value: 30, unit: '°' },
      { id: 'fin', label: 'Fin length, as a share of the shaft', min: 0, max: 50, step: 1, value: 22, unit: '%' },
      { id: 'match', type: 'check', label: 'Matching task: drag the lower shaft’s right end until it looks equal', value: false },
      { id: 'guides', type: 'check', label: 'Show guides: lines dropped from the ends', value: false }
    ],
    rows: [['up', 'Upper shaft (fins out)'], ['lo', 'Lower shaft (fins in)'], ['fact', 'The fact'], ['you', 'Your match']],
    init: () => ({ k: 1 }),
    on(key, v, s) { if (key === 'match') s.k = v ? wrongStart() : 1; },
    geo(g) { const A = clamp(g.w * 0.5, 100, 480); return { A, x0: g.cx - A / 2, fl: A * g.V.fin / 100, a: g.V.angle * D2R, yU: g.cy - g.h * 0.17, yL: g.cy + g.h * 0.17 }; },
    hit(g, p) { if (!g.V.match) return null; const q = this.geo(g); return Math.hypot(p.x - (q.x0 + q.A * g.s.k), p.y - q.yL) < 28 ? 'k' : null; },
    move(t, p, g) { const q = this.geo(g); g.s.k = clamp((p.x - q.x0) / q.A, 0.5, 1.5); },
    draw(g) {
      const { c, V, s } = g, q = this.geo(g), B = q.A * s.k;
      ln(c, q.x0, q.yU, q.x0 + q.A, q.yU, g.ink, 3); fins(c, g.ink, q.x0, q.x0 + q.A, q.yU, q.fl, q.a, true);
      ln(c, q.x0, q.yL, q.x0 + B, q.yL, g.ink, 3); fins(c, g.ink, q.x0, q.x0 + B, q.yL, q.fl, q.a, false);
      if (V.guides) for (const x of [q.x0, q.x0 + q.A, q.x0 + B]) ln(c, x, g.y + 12, x, g.y + g.h - 12, g.C.bad, 1, [5, 4]);
      if (V.match) { circ(c, q.x0 + B, q.yL, 10, null, g.C.bad, 2); txt(g, 'drag', q.x0 + B + 16, q.yL + 22, { color: g.C.bad, align: 'left' }); }
      g.say('up', num(q.A, 0) + ' px'); g.say('lo', num(B, 0) + ' px');
      const e = (s.k - 1) * 100;
      g.say('fact', Math.abs(e) < 0.05 ? 'The shafts are exactly equal' : 'Lower shaft is ' + num(Math.abs(e), 1) + ' % ' + (e > 0 ? 'longer' : 'shorter') + ' than the upper');
      g.say('you', !V.match ? 'Switch on the matching task to try' : Math.abs(e) < 1 ? 'Within 1 % of equal' : 'You made the lower shaft ' + num(Math.abs(e), 1) + ' % ' + (e > 0 ? 'longer' : 'shorter') + ' to make it look equal');
    },
    text: [
      'The shaft with fins pointing outward looks longer than the shaft with fins pointing inward, by roughly a tenth.',
      'Two shafts of exactly the same length; only the fins differ. Show the guides and the ends line up. Shrink the fins, or make them nearly parallel to the shaft, and the effect fades.',
      'The usual account is that the fins make the figure read as a corner in depth: outward fins like the near corner of a building, inward fins like the far corner of a room, and size is scaled for apparent distance. Others hold that the fins pull the judged ends outward or inward by their own extent. Both contribute, and the debate is not settled. Described by Franz Müller-Lyer in 1889.'
    ]
  });

  add({
    id: 'ponzo', name: 'Ponzo railway lines', group: SIZE, page: 'size-and-length-illusions', also: ['the-moon-illusion-and-size-constancy', 'depth-and-perspective-illusions'],
    hint: 'Two equal bars between converging rails: which is longer?',
    controls: [
      { id: 'conv', label: 'Convergence of the rails', min: 0, max: 40, step: 1, value: 24, unit: '°' },
      { id: 'hide', type: 'check', label: 'Hide the rails', value: false },
      { id: 'guides', type: 'check', label: 'Show guides: lines dropped from the bar ends', value: false }
    ],
    rows: [['bars', 'The two bars'], ['rails', 'The rails'], ['fact', 'The fact']],
    geo(g) {
      const top = g.y + g.h * 0.06, bot = g.y + g.h * 0.94, half0 = g.w * 0.34, half1 = Math.max(4, half0 - (bot - top) * Math.tan(g.V.conv * D2R / 2)), bw = clamp(g.w * 0.2, 60, 200);
      return { top, bot, half0, half1, bw, hw: y => half1 + (half0 - half1) * (y - top) / (bot - top), y1: top + (bot - top) * 0.27, y2: top + (bot - top) * 0.78 };
    },
    draw(g) {
      const { c, V } = g, q = this.geo(g), cx = g.cx;
      if (!V.hide) {
        for (let k = 1; k < 14; k++) { const y = q.top + (q.bot - q.top) * k / 14, w = q.hw(y); ln(c, cx - w, y, cx + w, y, '#b9b9b9', 2); }
        for (const sg of [-1, 1]) ln(c, cx + sg * q.half1, q.top, cx + sg * q.half0, q.bot, g.ink, 4);
      }
      for (const y of [q.y1, q.y2]) ln(c, cx - q.bw / 2, y, cx + q.bw / 2, y, '#b3242a', 8);
      if (V.guides) for (const x of [cx - q.bw / 2, cx + q.bw / 2]) ln(c, x, q.y1 - 30, x, q.y2 + 30, g.C.bad, 1, [5, 4]);
      g.say('bars', 'Both ' + num(q.bw, 0) + ' px long');
      g.say('rails', V.hide ? 'Hidden' : num(V.conv, 0) + '° between them; ' + num(2 * q.hw(q.y1), 0) + ' px apart at the upper bar, ' + num(2 * q.hw(q.y2), 0) + ' px at the lower');
      g.say('fact', V.conv < 1 || V.hide ? 'No rails, no perspective: the bars look equal' : 'The upper bar sits where the rails are closer: it reads as farther away, so it looks longer');
    },
    text: [
      'The bar higher up, between the closer rails, looks longer than the identical bar lower down.',
      'Both bars are exactly the same length. Hide the rails, or let them run parallel, and the bars look equal; the guides show where their ends are.',
      'The rails are a picture of a road or railway running away from you. A bar that spans a narrower gap between rails is read as a farther, and so bigger, object, and the size of the image is scaled for that distance. Some researchers suggest that the angles between the bars and rails also bias the judgement. Described by Mario Ponzo in 1911.'
    ]
  });

  /* the discs of the Ebbinghaus figure: ring of n circles around (x, y) */
  function ring(c, x, y, d, rr, n, a0, col) { for (let i = 0; i < n; i++) { const a = a0 + TAU * i / n; circ(c, x + d * Math.cos(a), y + d * Math.sin(a), rr, col); } }

  add({
    id: 'ebbinghaus', name: 'Ebbinghaus (Titchener) circles', group: SIZE, page: 'size-and-length-illusions', also: ['the-moon-illusion-and-size-constancy'],
    hint: 'Which central disc is bigger: the one among large circles or the one among small circles?',
    controls: [
      { id: 'big', label: 'Size of the large circles (× the disc)', min: 1, max: 3, step: 0.05, value: 2, fmt: v => v.toFixed(2) + ' ×' },
      { id: 'gap', label: 'Gap between the disc and its surround (× the disc)', min: 0.1, max: 1.5, step: 0.05, value: 0.3, fmt: v => v.toFixed(2) + ' ×' },
      { id: 'bare', type: 'check', label: 'Remove the surrounds', value: false },
      { id: 'guides', type: 'check', label: 'Overlay a circle of the true size on each disc', value: false },
      { id: 'match', type: 'check', label: 'Matching task: drag the right disc’s edge until the discs look equal', value: false }
    ],
    rows: [['l', 'Left disc (large surround)'], ['r', 'Right disc (small surround)'], ['fact', 'The fact'], ['you', 'Your match']],
    init: () => ({ k: 1 }),
    on(key, v, s) { if (key === 'match') s.k = v ? wrongStart() : 1; },
    geo(g) {
      const V = g.V, R = Math.min(g.w / 4 - 12, g.h / 2 - 12), r = Math.max(8, Math.min(g.u * 0.1, R / (1 + V.gap + 2 * V.big))), rb = r * V.big, rs = r * 0.32;
      return { r, rb, rs, xL: g.cx - g.w * 0.25, xR: g.cx + g.w * 0.25, y: g.cy, dB: r * (1 + V.gap) + rb, dS: r * (1 + V.gap) + rs };
    },
    hit(g, p) { if (!g.V.match) return null; const q = this.geo(g); return Math.hypot(p.x - (q.xR + q.r * g.s.k), p.y - q.y) < 28 ? 'k' : null; },
    move(t, p, g) { const q = this.geo(g); g.s.k = clamp(Math.abs(p.x - q.xR) / q.r, 0.5, 1.6); },
    draw(g) {
      const { c, V, s } = g, q = this.geo(g), disc = '#d9531e', sur = '#6f86a6';
      if (!V.bare) { ring(c, q.xL, q.y, q.dB, q.rb, 6, 0, sur); ring(c, q.xR, q.y, q.dS, q.rs, 8, Math.PI / 8, sur); }
      circ(c, q.xL, q.y, q.r, disc); circ(c, q.xR, q.y, q.r * s.k, disc);
      if (V.guides) { circ(c, q.xL, q.y, q.r, null, g.C.bad, 1.5, [4, 3]); circ(c, q.xR, q.y, q.r, null, g.C.bad, 1.5, [4, 3]); }
      if (V.match) { circ(c, q.xR + q.r * s.k, q.y, 10, null, g.C.bad, 2); txt(g, 'drag', q.xR + q.r * s.k + 16, q.y + 24, { color: g.C.bad, align: 'left' }); }
      g.say('l', 'Diameter ' + num(2 * q.r, 0) + ' px'); g.say('r', 'Diameter ' + num(2 * q.r * s.k, 0) + ' px');
      const e = (s.k - 1) * 100;
      g.say('fact', Math.abs(e) < 0.05 ? 'The discs are exactly equal' : 'The right disc is ' + num(Math.abs(e), 1) + ' % ' + (e > 0 ? 'bigger' : 'smaller') + ' than the left');
      g.say('you', !V.match ? 'Switch on the matching task to try' : Math.abs(e) < 1 ? 'Within 1 % of equal' : 'You made the right disc ' + num(Math.abs(e), 1) + ' % ' + (e > 0 ? 'bigger' : 'smaller') + ' to make it look equal');
    },
    text: [
      'The disc among large circles looks smaller than the identical disc among small circles.',
      'Both discs have the same diameter. Remove the surrounds, or overlay the true-size circles, and they match. Widen the gap and the effect weakens.',
      'The standard account is a size contrast: the large neighbours make the centre look small by comparison and the small ones make it look big. A second factor is the gap: a surround close to the disc has a stronger effect, and some work finds that the surround alters the perceived distance of the disc. Described by Hermann Ebbinghaus and made well known by Edward Titchener.'
    ]
  });

  add({
    id: 'vertical-horizontal', name: 'Vertical and horizontal lines', group: SIZE, page: 'size-and-length-illusions',
    hint: 'Is the upright line longer than the flat one?',
    controls: [
      { id: 'form', type: 'select', label: 'Figure', options: [['An inverted T', 'T'], ['An L', 'L']], value: 'T' },
      { id: 'lay', type: 'check', label: 'Lay a copy of the upright along the flat line', value: false },
      { id: 'match', type: 'check', label: 'Matching task: drag the flat line’s right end until it looks as long as the upright', value: false }
    ],
    rows: [['v', 'Upright line'], ['h', 'Flat line'], ['fact', 'The fact'], ['you', 'Your match']],
    init: () => ({ k: 1 }),
    on(key, v, s) { if (key === 'match') s.k = v ? rnd(0.78, 0.9) : 1; },
    geo(g) {
      const Lv = clamp(g.h * 0.62, 80, 420), T = g.V.form === 'T', k = g.s.k, xv = T ? g.cx : g.cx - Lv / 2;
      return { Lv, T, xv, base: g.cy + Lv / 2, xl: T ? xv - Lv * k / 2 : xv, xr: T ? xv + Lv * k / 2 : xv + Lv * k };
    },
    hit(g, p) { if (!g.V.match) return null; const q = this.geo(g); return Math.hypot(p.x - q.xr, p.y - q.base) < 28 ? 'k' : null; },
    move(t, p, g) { const q = this.geo(g); g.s.k = clamp((q.T ? 2 : 1) * (p.x - q.xv) / q.Lv, 0.5, 1.6); },
    draw(g) {
      const { c, V, s } = g, q = this.geo(g);
      ln(c, q.xv, q.base, q.xv, q.base - q.Lv, g.ink, 7); ln(c, q.xl, q.base, q.xr, q.base, g.ink, 7);
      if (V.lay) {
        const y = q.base + 20;
        ln(c, q.xl, y, q.xl + q.Lv, y, g.C.bad, 2, [6, 4]); ln(c, q.xl, y - 7, q.xl, y + 7, g.C.bad, 2); ln(c, q.xl + q.Lv, y - 7, q.xl + q.Lv, y + 7, g.C.bad, 2);
        ln(c, q.xr, q.base - 6, q.xr, y + 7, g.C.bad, 1, [3, 3]);
        txt(g, 'the upright, laid down', q.xl, y + 20, { color: g.C.bad, align: 'left' });
      }
      if (V.match) { circ(c, q.xr, q.base, 10, null, g.C.bad, 2); txt(g, 'drag', q.xr + 16, q.base + 24, { color: g.C.bad, align: 'left' }); }
      g.say('v', num(q.Lv, 0) + ' px'); g.say('h', num(q.Lv * s.k, 0) + ' px');
      const e = (s.k - 1) * 100;
      g.say('fact', Math.abs(e) < 0.05 ? 'Both lines are exactly the same length' : 'The flat line is ' + num(Math.abs(e), 1) + ' % ' + (e > 0 ? 'longer' : 'shorter') + ' than the upright');
      g.say('you', !V.match ? 'Switch on the matching task to try' : Math.abs(e) < 1 ? 'Within 1 % of equal' : 'You made the flat line ' + num(Math.abs(e), 1) + ' % ' + (e > 0 ? 'longer' : 'shorter') + ' to make it look equal');
    },
    text: [
      'The upright line looks about a tenth longer than the flat line that carries it, in the inverted T most of all.',
      'Both lines are the same length. Lay a copy of the upright along the flat one and its end falls exactly on the end of the flat line.',
      'The usual account is that vertical extents are over-estimated compared with horizontal ones; the bisected line in a T adds a further over-estimate of the line that is cut in the middle. The causes are debated: eye movements, the shape of the visual field and the use of vertical lines to signal height or distance have all been proposed. The effect is smaller for an L, where neither line is bisected.'
    ]
  });

  add({
    id: 'delboeuf', name: 'Delboeuf circles', group: SIZE, page: 'size-and-length-illusions',
    hint: 'Which black disc is bigger: the one in the close ring or the one in the wide ring?',
    controls: [
      { id: 'near', label: 'Close ring (× the disc radius)', min: 1.1, max: 2, step: 0.05, value: 1.3, fmt: v => v.toFixed(2) + ' ×' },
      { id: 'far', label: 'Wide ring (× the disc radius)', min: 2, max: 4, step: 0.1, value: 2.8, fmt: v => v.toFixed(1) + ' ×' },
      { id: 'bare', type: 'check', label: 'Remove the rings', value: false },
      { id: 'guides', type: 'check', label: 'Overlay a circle of the true size on each disc', value: false }
    ],
    rows: [['d', 'The two discs'], ['rings', 'The rings'], ['fact', 'The fact']],
    geo(g) { const V = g.V, R = Math.min(g.w / 4 - 12, g.h / 2 - 12), r = Math.max(8, Math.min(g.u * 0.15, R / V.far)); return { r, xL: g.cx - g.w * 0.25, xR: g.cx + g.w * 0.25, y: g.cy }; },
    draw(g) {
      const { c, V } = g, q = this.geo(g);
      circ(c, q.xL, q.y, q.r, '#1a1a1a'); circ(c, q.xR, q.y, q.r, '#1a1a1a');
      if (!V.bare) { circ(c, q.xL, q.y, q.r * V.near, null, '#1a1a1a', 2.5); circ(c, q.xR, q.y, q.r * V.far, null, '#1a1a1a', 2.5); }
      if (V.guides) { circ(c, q.xL, q.y, q.r, null, g.C.bad, 1.5, [4, 3]); circ(c, q.xR, q.y, q.r, null, g.C.bad, 1.5, [4, 3]); }
      g.say('d', 'Both ' + num(2 * q.r, 0) + ' px across'); g.say('rings', V.bare ? 'Removed' : 'Close ring ' + num(V.near, 2) + ' ×, wide ring ' + num(V.far, 1) + ' × the disc radius');
      g.say('fact', 'The discs are exactly equal; only the rings differ');
    },
    text: [
      'The disc inside the close ring looks bigger than the identical disc inside the wide ring.',
      'The two black discs are identical. Take the rings away, or overlay the true-size circle, and they match.',
      'A ring that is only a little bigger than the disc seems to enlarge it by assimilation, while a much larger ring makes the disc look small by contrast, as in the Ebbinghaus figure. The two effects are probably one family of size contrast and assimilation, and which one wins depends on the gap, so the account is not settled.'
    ]
  });

  /* ================================================================ lines and angles */
  add({
    id: 'zollner', name: 'Zöllner lines', group: LINES, page: 'line-and-angle-illusions',
    hint: 'Are the four long lines parallel?',
    controls: [
      { id: 'angle', label: 'Angle of the short strokes to the long lines', min: 0, max: 90, step: 1, value: 28, unit: '°' },
      { id: 'hide', type: 'check', label: 'Hide the short strokes', value: false },
      { id: 'edge', type: 'check', label: 'Show guides: extend the lines and measure the gaps', value: false }
    ],
    rows: [['gap', 'Gap between the long lines'], ['str', 'Short strokes'], ['fact', 'The fact']],
    geo(g) {
      const gap = clamp(g.w * 0.13, 40, 130);
      return { gap, xs: [0, 1, 2, 3].map(i => g.cx + (i - 1.5) * gap), top: g.y + g.h * 0.14, bot: g.y + g.h * 0.86, step: clamp(g.h * 0.045, 12, 26), sl: gap * 0.3 };
    },
    draw(g) {
      const { c, V } = g, q = this.geo(g), a = V.angle * D2R;
      q.xs.forEach((x, i) => {
        if (!V.hide) for (let y = q.top + q.step / 2; y < q.bot; y += q.step) { const dx = Math.sin(a) * q.sl * (i % 2 ? -1 : 1), dy = Math.cos(a) * q.sl; ln(c, x - dx, y - dy, x + dx, y + dy, g.ink, 1.6); }
        ln(c, x, q.top, x, q.bot, g.ink, 3);
      });
      if (V.edge) {
        for (const x of q.xs) ln(c, x, g.y + 2, x, g.y + g.h - 2, g.C.bad, 1, [5, 4]);
        for (const y of [q.top - 12, q.bot + 12]) {
          ln(c, q.xs[0], y, q.xs[3], y, g.C.bad, 1);
          for (const x of q.xs) ln(c, x, y - 5, x, y + 5, g.C.bad, 1.5);
          txt(g, num(q.gap, 0) + ' px each', g.cx, y + (y < g.cy ? -12 : 12), { color: g.C.bad, align: 'center' });
        }
      }
      g.say('gap', num(q.gap, 0) + ' px at the top, and ' + num(q.gap, 0) + ' px at the bottom');
      g.say('str', V.hide ? 'Hidden' : 'At ' + num(V.angle, 0) + '° to the long lines, leaning one way on the 1st and 3rd, the other way on the 2nd and 4th');
      g.say('fact', 'All four lines are exactly vertical and parallel');
    },
    text: [
      'The four long lines seem to lean, each turning away from the direction of its strokes, with neighbouring lines leaning opposite ways.',
      'The long lines are exactly vertical and parallel, with equal gaps at top and bottom. Hide the strokes and they stand straight; at 0° or 90° the strokes lose their effect.',
      'Small angles between a line and a crossing stroke are over-estimated, so the line seems to rotate away from the stroke. The usual explanation is an exaggeration of acute angles in early visual processing, perhaps through inhibition between neurons tuned to nearby orientations; a depth interpretation has also been suggested, and the matter is not closed. Described by Johann Zöllner in 1860.'
    ]
  });

  add({
    id: 'hering', name: 'Hering and Wundt illusions', group: LINES, page: 'line-and-angle-illusions',
    hint: 'Are the two horizontal lines straight?',
    controls: [
      { id: 'form', type: 'select', label: 'Figure', options: [['Hering: rays from the centre', 'hering'], ['Wundt: rays from the two ends', 'wundt']], value: 'hering' },
      { id: 'rays', label: 'Number of rays', min: 0, max: 60, step: 1, value: 28 },
      { id: 'edge', type: 'check', label: 'Lay a straightedge along each line', value: false }
    ],
    rows: [['lines', 'The two lines'], ['rays', 'The rays'], ['fact', 'The fact']],
    geo(g) { const d = g.h * 0.17; return { d, xl: g.x + g.w * 0.07, xr: g.x + g.w * 0.93, R: Math.hypot(g.w, g.h) }; },
    draw(g) {
      const { c, V } = g, q = this.geo(g), n = Math.round(V.rays), grey = '#7d7d7d';
      if (V.form === 'hering') for (let k = 0; k < n; k++) { const a = Math.PI * k / n, dx = Math.cos(a) * q.R, dy = Math.sin(a) * q.R; ln(c, g.cx - dx, g.cy - dy, g.cx + dx, g.cy + dy, grey, 1.2); }
      else for (const [fx, sg] of [[q.xl, 1], [q.xr, -1]]) for (let k = 0; k < n; k++) { const a = n > 1 ? D2R * (-78 + 156 * k / (n - 1)) : 0; ln(c, fx, g.cy, fx + sg * Math.cos(a) * q.R, g.cy + Math.sin(a) * q.R, grey, 1.2); }
      for (const y of [g.cy - q.d, g.cy + q.d]) { ln(c, q.xl, y, q.xr, y, g.ink, 3.5); if (V.edge) ln(c, q.xl - 20, y, q.xr + 20, y, g.C.bad, 1); }
      g.say('lines', 'Two straight lines, ' + num(2 * q.d, 0) + ' px apart along their whole length');
      g.say('rays', n === 0 ? 'None: the lines stand alone' : n + ' rays, ' + num(180 / n, 1) + '° apart' + (V.form === 'wundt' ? ' in each fan' : ''));
      g.say('fact', V.edge ? 'The hairline runs down the middle of each line from end to end' : 'Both lines are perfectly straight and parallel');
    },
    text: [
      'With the rays behind them, the two lines seem to bow apart in the middle (Hering) or pinch together in the middle (Wundt).',
      'Both lines are straight and exactly parallel. Lay the straightedge along them, or take the rays away, and the bowing goes.',
      'Lines that cross a ray at a small angle are judged to be turned further from it than they are, and since the rays fan out from the centre the effect is largest near it. This angle expansion is the usual explanation; a depth reading of the fan as a tunnel is a rival. Described by Ewald Hering in 1861; Wilhelm Wundt’s version reverses the bowing.'
    ]
  });

  add({
    id: 'poggendorff', name: 'Poggendorff illusion', group: LINES, page: 'line-and-angle-illusions',
    hint: 'Drag the right-hand piece up or down until it looks like the continuation of the left-hand piece.',
    controls: [
      { id: 'angle', label: 'Angle of the line to the horizontal', min: 30, max: 80, step: 1, value: 60, unit: '°' },
      { id: 'bar', label: 'Width of the bar', min: 8, max: 35, step: 1, value: 18, unit: '%' },
      { id: 'opaque', label: 'Opacity of the bar', min: 0, max: 100, step: 1, value: 100, unit: '%' },
      { id: 'reveal', type: 'check', label: 'Show the true continuation', value: false },
      { type: 'buttons', items: [{ id: 'again', label: 'Start from a new offset' }] }
    ],
    rows: [['off', 'Your right-hand piece'], ['fact', 'The fact']],
    init: () => ({ off: 55 }),
    on(key, v, s) { if (key === 'again') s.off = (Math.random() < 0.5 ? -1 : 1) * rnd(35, 90); },
    geo(g) {
      const bw = g.h * g.V.bar / 100, a = Math.min(g.V.angle * D2R, Math.atan2(0.42 * g.h, bw)), dy = bw * Math.tan(a), xl = g.cx - bw / 2, xr = g.cx + bw / 2, yl = g.cy - dy / 2 - 0.08 * g.h;
      return { bw, a, dy, xl, xr, yl, yr: yl + dy, top: g.y + g.h * 0.06, bot: g.y + g.h * 0.94, R: Math.hypot(g.w, g.h) };
    },
    hit(g, p) { const q = this.geo(g); return p.x > q.xr ? 'off' : null; },
    move(t, p, g) { const q = this.geo(g); g.s.off = clamp(p.y - q.yr - (p.x - q.xr) * Math.tan(q.a), -0.3 * g.h, 0.3 * g.h); },
    draw(g) {
      const { c, V, s } = g, q = this.geo(g), ca = Math.cos(q.a), sa = Math.sin(q.a), op = V.opaque / 100;
      c.save(); c.globalAlpha = op; rect(c, q.xl, q.top, q.bw, q.bot - q.top, '#9a9a9a'); c.restore();
      ln(c, q.xl - ca * q.R, q.yl - sa * q.R, q.xl, q.yl, g.ink, 3);                                   // the left-hand piece
      if (op < 1) { c.save(); c.globalAlpha = 1 - op; ln(c, q.xl, q.yl, q.xr, q.yr, g.ink, 3); c.restore(); }   // the line seen through the bar
      const y0 = q.yr + s.off;
      ln(c, q.xr, y0, q.xr + ca * q.R, y0 + sa * q.R, g.ink, 3);                                        // the right-hand piece, where the reader put it
      if (V.reveal) ln(c, q.xl - ca * q.R, q.yl - sa * q.R, q.xl + ca * q.R * 2, q.yl + sa * q.R * 2, g.C.bad, 1.5, [6, 4]);
      g.say('off', Math.abs(s.off) < 1.5 ? 'On the true line' : num(Math.abs(s.off), 0) + ' px ' + (s.off < 0 ? 'above' : 'below') + ' the true line (' + num(Math.abs(s.off) / q.bw * 100, 0) + ' % of the bar’s width)');
      g.say('fact', 'The two pieces are parts of one straight line only when the offset is 0');
    },
    text: [
      'The line vanishes behind the bar and comes out on the other side apparently too high or too low: the two pieces do not look like one line.',
      'Both pieces belong to one straight line, with the bar simply covering a stretch of it. Show the true continuation to see how far off your setting was, or make the bar see-through and the line reveals itself.',
      'Acute angles between the line and the edge of the bar are over-estimated, and the offset the line must make to cross the bar is misjudged with it. Another view puts the error in how far the eye extrapolates a line across a gap. The explanation is still discussed. The effect is strongest for steep lines and wide bars, and bears the name of Johann Poggendorff, 1860.'
    ]
  });

  add({
    id: 'cafe-wall', name: 'Café wall', group: LINES, page: 'line-and-angle-illusions', also: ['illusions-in-design-and-safety'],
    hint: 'Are the grey mortar lines horizontal and parallel?',
    bg: g => gr(g.V.mort),
    controls: [
      { id: 'off', label: 'Shift of every second row (share of a tile pair)', min: 0, max: 0.5, step: 0.01, value: 0.25, fmt: v => Math.round(v * 100) + ' %' },
      { id: 'mort', label: 'Grey of the mortar', min: 0, max: 255, step: 1, value: 128 },
      { id: 'thick', label: 'Thickness of the mortar', min: 1, max: 8, step: 1, value: 3, unit: 'px' },
      { id: 'guides', type: 'check', label: 'Draw a hairline along each mortar line', value: false }
    ],
    rows: [['mort', 'Mortar'], ['shift', 'Shift between rows'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, t = clamp(g.w / 16, 18, 56), m = V.thick, nr = Math.max(2, Math.floor((g.h + m) / (t + m))), y0 = g.y + (g.h - nr * (t + m) + m) / 2, DARK = 24, LIGHT = 236;
      for (let r = 0; r < nr; r++) {
        const sh = (r % 2) * V.off * 2 * t, y = y0 + r * (t + m);
        for (let i = -3; i <= Math.ceil(g.w / t) + 1; i++) rect(c, g.x + sh + i * t, y, t, t, (((i % 2) + 2) % 2) ? gr(LIGHT) : gr(DARK));
        if (V.guides && r < nr - 1) ln(c, g.x, y + t + m / 2, g.x + g.w, y + t + m / 2, g.C.bad, 1);
      }
      const weak = V.off < 0.03 || V.off > 0.47 || V.mort < DARK + 12 || V.mort > LIGHT - 12;
      g.say('mort', grT(V.mort) + ', ' + m + ' px thick, between tiles of ' + grT(DARK) + ' and ' + grT(LIGHT));
      g.say('shift', num(V.off * 2 * t, 0) + ' px (' + Math.round(V.off * 100) + ' % of a black-and-white pair of ' + num(2 * t, 0) + ' px)');
      g.say('fact', 'Every mortar line is exactly horizontal; neighbours are ' + num(t + m, 0) + ' px apart. ' + (weak ? 'Here the tilt is weak or gone: the mortar is nearly as dark or as light as the tiles, or the rows are not staggered.' : 'The tilt you see is not in the drawing.'));
    },
    text: [
      'The grey lines between the rows of tiles seem to slope, in long wedges, the rows looking as if they converge in alternate directions.',
      'Every mortar line is exactly horizontal, and a hairline laid along each shows it. The tilt vanishes when the rows are not staggered, when the stagger is half a tile, or when the mortar is black or white instead of a grey between the two tile shades.',
      'Where a tile corner meets the mortar the brightness makes a tiny local tilt, and the cells of early visual cortex that sum such cues along a line see the sum as a slope; it needs the thin mid-grey mortar to join the staggered corners. The account is not settled. The pattern is named after the tiled wall of a café in Bristol where it was noticed.'
    ]
  });

  /* ================================================================ brightness and contrast */
  add({
    id: 'contrast', name: 'Simultaneous contrast', group: BRIGHT, page: 'brightness-and-contrast-illusions',
    hint: 'Do the two squares have the same grey?',
    controls: [
      { id: 'grey', label: 'Grey of both squares', min: 60, max: 200, step: 1, value: 128 },
      { id: 'str', label: 'Strength of the background contrast', min: 0, max: 100, step: 1, value: 100, unit: '%' },
      { id: 'kind', type: 'select', label: 'Background', options: [['A smooth gradient', 'grad'], ['Two plain halves', 'halves']], value: 'grad' },
      { id: 'bridge', type: 'check', label: 'Join the squares with a bridge of the same grey', value: false },
      { id: 'plain', type: 'check', label: 'Remove the background', value: false }
    ],
    rows: [['sq', 'The two squares'], ['bg', 'Background behind them'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, G = V.grey, k = V.str / 100, lo = G - k * (G - 8), hi = G + k * (247 - G), sz = clamp(g.u * 0.2, 40, 160), xL = g.cx - g.w * 0.25, xR = g.cx + g.w * 0.25;
      let bl = 255, br = 255;
      if (!V.plain) {
        if (V.kind === 'grad') { const gd = c.createLinearGradient(g.x, 0, g.x + g.w, 0); gd.addColorStop(0, gr(lo)); gd.addColorStop(1, gr(hi)); c.fillStyle = gd; c.fillRect(g.x, g.y, g.w, g.h); bl = lo + (hi - lo) * (xL - g.x) / g.w; br = lo + (hi - lo) * (xR - g.x) / g.w; }
        else { rect(c, g.x, g.y, g.w / 2, g.h, gr(lo)); rect(c, g.cx, g.y, g.w / 2, g.h, gr(hi)); bl = lo; br = hi; }
      }
      if (V.bridge) rect(c, xL, g.cy - sz * 0.2, xR - xL, sz * 0.4, gr(G));
      rect(c, xL - sz / 2, g.cy - sz / 2, sz, sz, gr(G)); rect(c, xR - sz / 2, g.cy - sz / 2, sz, sz, gr(G));
      g.say('sq', 'Both: ' + grT(G)); g.say('bg', V.plain ? 'None: plain white' : 'Left ' + grT(bl) + ', right ' + grT(br));
      g.say('fact', 'The squares carry literally the same value' + (V.bridge ? ', and the bridge of that value joins them' : ''));
    },
    text: [
      'The square on the dark side looks lighter than the identical square on the light side.',
      'The two squares are filled with exactly the same grey, printed in the read-out. Remove the background, or join them with a bridge of the same grey, and they look equal.',
      'The visual system judges lightness by comparison with the surround: neighbouring regions inhibit one another, which exaggerates differences at borders. This simultaneous contrast has retinal and cortical parts, and the proportions are still studied. A bridge makes the two squares read as parts of one surface, which breaks the comparison.'
    ]
  });

  add({
    id: 'checker-shadow', name: 'Checker shadow', group: BRIGHT, page: 'brightness-and-contrast-illusions',
    hint: 'Is square A darker than square B?',
    controls: [
      { id: 'k', label: 'Light the shadow lets through', min: 0.35, max: 0.8, step: 0.01, value: 0.5, fmt: v => Math.round(v * 100) + ' %' },
      { id: 'soft', label: 'Softness of the shadow’s edge', min: 0.02, max: 1.4, step: 0.02, value: 0.8, fmt: v => v < 0.1 ? 'hard' : v.toFixed(1) + ' cells' },
      { id: 'bridge', type: 'check', label: 'Join A and B with a bar of the same grey', value: false }
    ],
    rows: [['A', 'Square A (dark, in the light)'], ['B', 'Square B (light, in the shadow)'], ['light', 'Light squares in the open'], ['dark', 'Dark squares in the shadow'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, G = 118, k = V.k, Lt = Math.min(255, Math.round(G / k)), Dk = Math.round(G * k), N = 7, sk = 0.42, vs = 0.78;
      const cs = Math.min(g.w / (N * (1 + sk) + 0.6), g.h / (N * vs + 0.8)), ox = g.cx - cs * N * (1 + sk) / 2, oy = g.cy - cs * N * vs / 2;
      const scr = (u, v) => [ox + cs * (u - sk * v + sk * N), oy + cs * vs * v];
      c.save(); c.transform(cs, 0, -cs * sk, cs * vs, ox + cs * sk * N, oy);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) rect(c, i - 0.01, j - 0.01, 1.02, 1.02, (i + j) % 2 ? gr(Lt) : gr(G));
      const a = 3.6, b = 5.4, e = V.soft, span = b - a + 2 * e, gd = c.createLinearGradient(a - e, 0, b + e, 0), sh = 'rgba(0,0,0,' + (1 - k).toFixed(3) + ')';
      gd.addColorStop(0, 'rgba(0,0,0,0)'); gd.addColorStop(clamp(e / span, 0, 0.49), sh); gd.addColorStop(clamp(1 - e / span, 0.51, 1), sh); gd.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gd; c.fillRect(0, 0, N, N);
      rect(c, 1, 3, 1, 1, gr(G)); rect(c, 4, 3, 1, 1, gr(G));                                              // A and B, exactly the same value
      c.restore();
      const A = scr(1.5, 3.5), B = scr(4.5, 3.5);
      if (V.bridge) rect(c, A[0], A[1] - cs * 0.17, B[0] - A[0], cs * 0.34, gr(G));
      txt(g, 'A', A[0], A[1], { size: 18, weight: 700, align: 'center', color: '#fff' }); txt(g, 'B', B[0], B[1], { size: 18, weight: 700, align: 'center', color: '#fff' });
      g.say('A', grT(G)); g.say('B', grT(G)); g.say('light', grT(Lt)); g.say('dark', grT(Dk));
      g.say('fact', 'A and B are filled with literally the same value; the shadow passes ' + Math.round(k * 100) + ' % of the light');
    },
    text: [
      'Square B, a light square lying in the shadow, looks much lighter than square A, a dark square in the open.',
      'A and B are filled with exactly the same grey, printed in the read-out; a bar of that grey joins them and shows it. A drawn board with a darker band is all there is, and the shadow is painted as a soft gradient.',
      'Vision tries to recover the colour of a surface, not the light that reaches the eye, so it discounts the shadow: the soft edge reads as a shadow rather than paint, and a surface that is dim only because of the shadow is judged to be a light one. A hard edge makes the band look like paint and the effect weakens. Made famous by Edward Adelson in 1995.'
    ]
  });

  add({
    id: 'mach-bands', name: 'Mach bands', group: BRIGHT, page: 'brightness-and-contrast-illusions',
    hint: 'Look along the stripe: do you see a bright line and a dark line where the grey starts and stops changing?',
    controls: [
      { id: 'form', type: 'select', label: 'Figure', options: [['A ramp between two plateaus', 'ramp'], ['A staircase of greys', 'stairs']], value: 'ramp' },
      { id: 'width', label: 'Width of the ramp (ramp form)', min: 4, max: 60, step: 1, value: 24, unit: '%' },
      { id: 'steps', label: 'Number of steps (staircase form)', min: 3, max: 12, step: 1, value: 6 },
      { id: 'cover', type: 'check', label: 'Cover the edges with thin dark bars', value: false },
      { id: 'graph', type: 'check', label: 'Show the luminance drawn, and a model of the response', value: true }
    ],
    rows: [['drawn', 'What is drawn'], ['model', 'Model of the retina’s response'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, w = g.w, n = Math.ceil(w / 2) + 1, D = 60, Lt = 196, ramp = V.form === 'ramp', rw = w * V.width / 100, xa = w / 2 - rw / 2, ns = Math.round(V.steps);
      const lum = Array.from({ length: n }, (_, i) => { const x = i * 2; return ramp ? D + (Lt - D) * clamp((x - xa) / Math.max(1, rw), 0, 1) : D + (Lt - D) * Math.min(ns - 1, Math.floor(x / w * ns)) / (ns - 1); });
      const sig = 6, R = 18, ker = []; let ks = 0;
      for (let j = -R; j <= R; j++) { const kk = Math.exp(-j * j / (2 * sig * sig)); ker.push(kk); ks += kk; }
      const per = lum.map((v, i) => { let s = 0; for (let j = -R; j <= R; j++) s += ker[j + R] * lum[clamp(i + j, 0, n - 1)]; return v + 2 * (v - s / ks); });
      const top = g.y + 8, hs = V.graph ? g.h * 0.4 : g.h - 16;
      for (let i = 0; i < n; i++) rect(c, g.x + i * 2, top, 2.5, hs, gr(lum[i]));
      if (V.cover) for (const x of (ramp ? [xa, xa + rw] : Array.from({ length: ns - 1 }, (_, i) => (i + 1) * w / ns))) rect(c, g.x + x - 3, top, 6, hs, '#1a1a1a');
      if (V.graph) {
        const y0 = top + hs + 36, y1 = g.y + g.h - 24, Y = v => y1 - (y1 - y0) * clamp((v - (D - 30)) / (Lt - D + 60), 0, 1);
        if (y1 - y0 > 40) {
          for (const v of [D, Lt]) { ln(c, g.x + 30, Y(v), g.x + w - 6, Y(v), '#d0d0d0', 1); txt(g, String(v), g.x + 26, Y(v), { align: 'right', size: 10.5 }); }
          const path = (arr, col, lw, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = lw; c.setLineDash(dash || []); c.beginPath(); arr.forEach((v, i) => i ? c.lineTo(g.x + i * 2, Y(v)) : c.moveTo(g.x, Y(v))); c.stroke(); c.restore(); };
          path(lum, '#111', 2.2); path(per, '#c02a2a', 1.8, [6, 4]);
          txt(g, 'drawn luminance (grey value)', g.x + 36, y0 - 14, { align: 'left' }); txt(g, 'model response', g.x + 36 + 190, y0 - 14, { align: 'left', color: '#c02a2a' });
        }
      }
      let over = 0, under = 0; per.forEach((p, i) => { over = Math.max(over, p - lum[i]); under = Math.min(under, p - lum[i]); });
      g.say('drawn', ramp ? 'A straight ramp from ' + D + ' to ' + Lt + ' over ' + num(rw, 0) + ' px, between flat plateaus' : ns + ' flat steps from ' + D + ' to ' + Lt + ', each one uniform');
      g.say('model', 'Overshoots by +' + num(over, 0) + ' grey levels at the bright edge, undershoots by −' + num(-under, 0) + ' at the dark edge');
      g.say('fact', 'The drawn luminance never overshoots; the bands exist only in the response');
    },
    text: [
      'A narrow bright band seems to run along the edge where the ramp meets the light plateau, and a dark band where it meets the dark one. On the staircase every step looks scalloped, lighter at one edge and darker at the other.',
      'Each step is a perfectly flat grey and the ramp is a straight line; the graph shows exactly what is drawn. Cover the edges with thin bars and the steps look flat.',
      'Cells in the retina respond to the difference between a spot and its surround (lateral inhibition), which exaggerates a change in brightness at its start and stop; the dashed curve is a simple model of that. Described by Ernst Mach in 1865. Whether all of the band comes from the retina is debated, since cortical processing contributes.'
    ]
  });

  add({
    id: 'hermann', name: 'Hermann grid and scintillating grid', group: BRIGHT, page: 'brightness-and-contrast-illusions', also: ['illusions-in-design-and-safety'],
    hint: 'Look at the grid, not at one crossing: do grey spots appear at the other crossings?',
    bg: g => g.V.mode === 'scint' ? '#000' : '#fff',
    controls: [
      { id: 'mode', type: 'select', label: 'Figure', options: [['Hermann grid: black squares, white streets', 'hermann'], ['Scintillating grid: white discs on grey lines', 'scint']], value: 'hermann' },
      { id: 'street', label: 'Width of the streets', min: 4, max: 40, step: 1, value: 14, unit: 'px' },
      { id: 'size', label: 'Size of the squares', min: 24, max: 90, step: 1, value: 52, unit: 'px' },
      { id: 'mark', type: 'check', label: 'Ring the crossings', value: false }
    ],
    rows: [['paint', 'What is drawn'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, scint = V.mode === 'scint', sq = V.size, st = V.street, p = sq + st, nx = Math.ceil(g.w / p) + 2, ny = Math.ceil(g.h / p) + 2, ox = g.cx - p * nx / 2, oy = g.cy - p * ny / 2, pts = [];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const x = ox + i * p, y = oy + j * p;
        if (!scint) rect(c, x, y, sq, sq, '#000');
        pts.push([x - st / 2, y - st / 2]);
      }
      if (scint) {
        for (let i = 0; i < nx; i++) ln(c, ox + i * p - st / 2, g.y, ox + i * p - st / 2, g.y + g.h, '#808080', Math.max(2, st * 0.5));
        for (let j = 0; j < ny; j++) ln(c, g.x, oy + j * p - st / 2, g.x + g.w, oy + j * p - st / 2, '#808080', Math.max(2, st * 0.5));
        for (const q of pts) circ(c, q[0], q[1], Math.max(2.5, st * 0.62), '#fff');
      }
      if (V.mark) for (const q of pts) circ(c, q[0], q[1], st * 0.95 + 4, null, g.C.bad, 1.5);
      g.say('paint', scint ? 'Lines ' + grT(128) + ', discs ' + grT(255) + ', background ' + grT(0) : 'Streets and crossings are all ' + grT(255) + '; squares ' + grT(0));
      g.say('fact', scint ? 'Nothing dark is drawn at a crossing: the dots that blink are made by the eye' : 'Every crossing is exactly as white as the streets between them');
    },
    text: [
      'Faint grey spots appear at the crossings of the white streets, but never at the crossing you are looking at. In the scintillating version, dark dots seem to blink on and off in the white discs as your eyes move.',
      'The streets and their crossings are the same white: the read-out says so, and the rings mark places where nothing grey is drawn. Narrow the streets and the effect changes with them.',
      'The older explanation is lateral inhibition: a cell centred on a crossing has more white around it than one on a street, so it is inhibited more and signals darker. The effect is stronger in the periphery where the cells’ centres are larger. But the spots follow the streets’ orientation, and are weak in a grid of curved streets, so cortical processing of edges is also involved, and the account is debated. Described by Ludimar Hermann in 1870.'
    ]
  });

  /* White's illusion and its colour twin share a layout: horizontal stripes with bars set into them, the bars in black stripes
     and in white ones taking different columns */
  function stripeLayout(g, ns) {
    const h = g.h / ns, bw = g.w * 0.13, slots = [0.2, 0.4, 0.6, 0.8].map(q => g.x + g.w * q - bw / 2), stripes = [], bars = [];
    for (let i = 0; i < ns; i++) {
      stripes.push({ y: g.y + i * h, h, odd: i % 2 === 1 });
      if (i >= 1 && i <= ns - 2) for (const sl of i % 2 ? [1, 3] : [0, 2]) bars.push({ x: slots[sl], y: g.y + i * h, w: bw, h, odd: i % 2 === 1 });
    }
    return { stripes, bars };
  }

  add({
    id: 'white', name: 'White’s illusion', group: BRIGHT, page: 'brightness-and-contrast-illusions',
    hint: 'Are the grey bars on the black stripes the same as the grey bars on the white stripes?',
    controls: [
      { id: 'grey', label: 'Grey of all the bars', min: 60, max: 200, step: 1, value: 128 },
      { id: 'ns', label: 'Number of stripes', min: 5, max: 15, step: 2, value: 9 },
      { id: 'cover', type: 'check', label: 'Hide the stripes: show only the bars', value: false }
    ],
    rows: [['bars', 'Every bar'], ['count', 'Bars on black, bars on white'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, q = stripeLayout(g, Math.round(V.ns));
      if (!V.cover) for (const s of q.stripes) rect(c, g.x, s.y, g.w, s.h + 0.5, s.odd ? '#fff' : '#000');
      for (const b of q.bars) rect(c, b.x, b.y, b.w, b.h + 0.5, gr(V.grey));
      g.say('bars', 'All ' + q.bars.length + ': ' + grT(V.grey));
      g.say('count', q.bars.filter(b => !b.odd).length + ' set in black stripes, ' + q.bars.filter(b => b.odd).length + ' in white');
      g.say('fact', V.cover ? 'With the stripes gone the bars look the same: they are' : 'The bars are one grey; the stripes alone make them look different');
    },
    text: [
      'The grey bars set into the black stripes look lighter than the same grey bars set into the white stripes.',
      'Every bar is filled with exactly the same grey, printed in the read-out. Hide the stripes and the bars match.',
      'Each bar set in a black stripe touches white along its long edges and black only at its short ends, and each bar in a white stripe the reverse. Simultaneous contrast would make the first darker; the effect goes the other way, which is why it is a puzzle. Accounts include assimilation to the longer borders, a model with edge-and-orientation filters, and a model that sorts the scene into layers. The debate is open. Described by Michael White in 1979.'
    ]
  });

  add({
    id: 'cornsweet', name: 'Cornsweet edge', group: BRIGHT, page: 'brightness-and-contrast-illusions',
    hint: 'Does the left half look darker than the right half?',
    controls: [
      { id: 'amp', label: 'Size of the edge’s cusps', min: 0, max: 60, step: 1, value: 36, unit: 'levels' },
      { id: 'cover', type: 'check', label: 'Cover the edge with a bar of the plateau grey', value: false }
    ],
    rows: [['pl', 'The two plateaus'], ['cusp', 'Cusps at the edge'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, P = 130, tau = g.w * 0.055, y0 = g.y + g.h * 0.2, hh = g.h * 0.6;
      for (let x = 0; x < g.w; x += 2) { const d = (x + 1 - g.w / 2) / tau; rect(c, g.x + x, y0, 2.5, hh, gr(P + (d < 0 ? -1 : 1) * V.amp * Math.exp(-Math.abs(d)))); }
      if (V.cover) rect(c, g.cx - g.w * 0.13, y0, g.w * 0.26, hh, gr(P));
      ln(c, g.x, y0 - 0.5, g.x + g.w, y0 - 0.5, '#000', 1); ln(c, g.x, y0 + hh + 0.5, g.x + g.w, y0 + hh + 0.5, '#000', 1);
      g.say('pl', 'Far left ' + grT(P) + ', far right ' + grT(P));
      g.say('cusp', V.amp < 0.5 ? 'None' : grT(P - V.amp) + ' just left of the edge, ' + grT(P + V.amp) + ' just right');
      g.say('fact', V.cover ? 'With the edge hidden the halves match: they are the same grey' : 'Away from the edge both halves are exactly the same grey');
    },
    text: [
      'The left half of the stripe looks darker than the right half, as if a step in brightness ran across it.',
      'Both plateaus are the same grey. Only a narrow cusp at the join differs: darker on the left of the edge, lighter on the right, then fading to the plateau. Cover the edge, or take the cusps down to zero, and the halves look alike.',
      'The visual system encodes edges strongly and builds the lightness of the regions between them from the edge signals, so the edge’s sign is carried across the plateau as if it were a real step: a filling-in process. Named for Craik, O’Brien and Cornsweet, who studied it in the middle of the twentieth century.'
    ]
  });

  /* ================================================================ colour */
  const AFTER = { red: ['Red', [225, 25, 35]], green: ['Green', [25, 190, 70]], blue: ['Blue', [30, 60, 225]], yellow: ['Yellow', [250, 220, 20]], magenta: ['Magenta', [225, 35, 190]], cyan: ['Cyan', [15, 205, 225]] };
  const complement = col => { const l = Cl.labOfRgb(col); return lab(100 - l[0], -l[1], -l[2]); };     // opposite hue and opposite lightness

  add({
    id: 'afterimage', name: 'Colour afterimage', group: COLOUR, page: 'colour-illusions-and-afterimages', anim: true,
    hint: g => g.s.phase === 'after' ? 'Keep your eyes on the cross, blink a few times: what colour is the ghost of the shape?' : 'Press Start, then keep your eyes on the cross for the whole countdown.',
    bg: g => g.s.phase === 'after' && g.V.ground === 'white' ? '#ffffff' : '#808080',
    controls: [
      { id: 'col', type: 'select', label: 'Colour of the shape', options: Object.keys(AFTER).map(k => [AFTER[k][0], k]), value: 'red' },
      { id: 'shape', type: 'select', label: 'Shape', options: [['A disc', 'disc'], ['A square', 'square']], value: 'disc' },
      { id: 'time', label: 'Time to stare', min: 10, max: 40, step: 1, value: 25, unit: 's' },
      { id: 'ground', type: 'select', label: 'Afterwards, look at', options: [['A plain grey screen', 'grey'], ['A plain white screen', 'white']], value: 'grey' },
      { type: 'buttons', items: [{ id: 'go', label: 'Start staring', primary: true }, { id: 'stop', label: 'Stop and reset' }] }
    ],
    rows: [['phase', 'Now'], ['shape', 'What is on the screen'], ['pred', 'Colour you should see after'], ['fact', 'The fact']],
    init: () => ({ phase: 'idle', t: 0 }),
    enter(s) { s.phase = 'idle'; s.t = 0; },
    on(key, v, s) { if (key === 'go') { s.phase = 'stare'; s.t = 0; } else if (key === 'stop') { s.phase = 'idle'; s.t = 0; } },
    tick(g) { const s = g.s; if (s.phase === 'stare') { s.t += g.dt; if (s.t >= g.V.time) { s.phase = 'after'; s.t = 0; } } else if (s.phase === 'after') s.t += g.dt; },
    draw(g) {
      const { c, s, V } = g, [name, col] = AFTER[V.col], R = g.u * 0.28, after = s.phase === 'after', pred = complement(col);
      if (!after) { if (V.shape === 'disc') circ(c, g.cx, g.cy, R, rgb(col)); else rect(c, g.cx - R, g.cy - R, 2 * R, 2 * R, rgb(col)); }
      ln(c, g.cx - 14, g.cy, g.cx + 14, g.cy, '#fff', 5); ln(c, g.cx, g.cy - 14, g.cx, g.cy + 14, '#fff', 5);
      ln(c, g.cx - 13, g.cy, g.cx + 13, g.cy, '#000', 2); ln(c, g.cx, g.cy - 13, g.cx, g.cy + 13, '#000', 2);
      txt(g, s.phase === 'idle' ? 'Press “Start staring”, then keep your eyes on the cross' : s.phase === 'stare' ? 'Keep looking at the cross: ' + Math.max(0, Math.ceil(V.time - s.t)) + ' s left' : 'Now look at the cross on the plain screen. The ghost you see is made by your eyes.', g.cx, g.y + 24, { align: 'center', size: 14, weight: 600 });
      rect(c, g.x + g.w - 54, g.y + g.h - 54, 38, 38, rgb(pred)); txt(g, 'predicted afterimage', g.x + g.w - 62, g.y + g.h - 35, { align: 'right', size: 11 });
      g.say('phase', s.phase === 'idle' ? 'Waiting for you to start' : s.phase === 'stare' ? 'Staring: ' + num(s.t, 0) + ' s of ' + V.time + ' s' : 'Afterimage phase: ' + num(s.t, 0) + ' s');
      g.say('shape', after ? 'Only plain ' + (V.ground === 'white' ? grT(255) : grT(128)) + ' and the cross' : 'A ' + name.toLowerCase() + ' ' + V.shape + ', ' + rgbT(col) + ', on ' + grT(128));
      g.say('pred', rgbT(pred) + ' (opposite hue, opposite lightness)');
      g.say('fact', after ? 'Nothing coloured is drawn now: the colour you see is made inside your own eyes' : 'The shape is a steady colour; the afterimage can only appear once it is gone');
    },
    text: [
      'After you stare at a coloured shape and the screen turns plain grey (or white), a ghost of the shape appears in the opposite colour, light where the shape was dark and dark where it was light, and it drifts as your eyes move.',
      'After the countdown the screen is a plain, uniform grey; the predicted colour in the read-out is only the opposite of the shape’s colour. Nothing coloured is drawn.',
      'Staring tires the cone cells that respond to the shape’s colour, so when the colour goes their response is weaker than their neighbours’, which is read as the opposite hue. The tiredness is partly in the photoreceptors and partly in later stages. The complementary colours you meet in afterimages are not quite the ones of paint mixing.'
    ],
    cond: 'Keep your eyes on the cross for the whole countdown, in ordinary room light, and blink gently afterwards. The afterimage fades within a few seconds to half a minute.'
  });

  add({
    id: 'munker', name: 'Munker–White colour', group: COLOUR, page: 'colour-illusions-and-afterimages', also: ['brightness-and-contrast-illusions'],
    hint: 'Are the grey bars on one set of stripes the same colour as the grey bars on the other?',
    controls: [
      { id: 'pair', type: 'select', label: 'Stripe colours', options: [['Orange and teal', 'a'], ['Yellow and blue', 'b'], ['Magenta and green', 'c']], value: 'a' },
      { id: 'chroma', label: 'Colour strength of the stripes', min: 0, max: 70, step: 1, value: 55 },
      { id: 'cover', type: 'check', label: 'Hide the stripes: show only the bars', value: false }
    ],
    rows: [['bars', 'Every bar'], ['stripes', 'The two stripe colours'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, hues = { a: [45, 225], b: [95, 275], c: [345, 155] }[V.pair], q = stripeLayout(g, 9), L = 62;
      const col = h => lab(L, V.chroma * Math.cos(h * D2R), V.chroma * Math.sin(h * D2R)), s0 = col(hues[0]), s1 = col(hues[1]), bar = lab(L, 0, 0);
      if (!V.cover) for (const s of q.stripes) rect(c, g.x, s.y, g.w, s.h + 0.5, rgb(s.odd ? s1 : s0));
      for (const b of q.bars) rect(c, b.x, b.y, b.w, b.h + 0.5, rgb(bar));
      g.say('bars', 'All ' + q.bars.length + ': ' + rgbT(bar) + ' (a neutral grey)');
      g.say('stripes', V.cover ? 'Hidden' : rgbT(s0) + ' and ' + rgbT(s1) + ', the same lightness as the bars');
      g.say('fact', V.cover || V.chroma < 1 ? 'With no coloured stripes the bars look the same: they are' : 'The bars are one neutral grey; the stripes alone tint them');
    },
    text: [
      'The neutral grey bars look tinted, differently on the two sets of stripes, though they are the same grey.',
      'Every bar is filled with the same neutral grey, and the stripes are of matched lightness so only their colour differs. Hide the stripes, or drain the colour out of them, and the bars look identical.',
      'This is the colour version of White’s illusion, and it is the same puzzle: the bar seems to take on the colour of the stripes along its long edges, rather than the opposite colour that simultaneous contrast would give. Explanations that combine spatial filtering with a sorting of the scene into layers are still argued over. Named for Munker, who described the coloured version, and Michael White, who found the grey one.'
    ]
  });

  const MOND = [[.85, .85, .85], [.75, .25, .25], [.2, .55, .25], [.25, .3, .75], [.85, .8, .3], [.5, .5, .5], [.9, .55, .2], [.6, .3, .6], [.25, .6, .65], [.7, .7, .7],
    [.3, .3, .3], [.8, .35, .5], [.55, .7, .3], [.9, .9, .9], [.4, .4, .7], [.7, .5, .35], [.3, .5, .3], [.9, .75, .6], [.2, .2, .5], [.6, .6, .6]];
  const enc = v => Math.round(255 * Math.pow(clamp(v, 0, 1), 1 / 2.2));

  add({
    id: 'constancy', name: 'Colour constancy', group: COLOUR, page: 'colour-illusions-and-afterimages',
    bg: '#7a7a7a', hint: 'The two marked patches: are they the same colour?',
    controls: [
      { id: 'tint', label: 'Strength of the two lights', min: 0, max: 100, step: 1, value: 80, unit: '%' },
      { id: 'grey', label: 'Grey of the two patches', min: 90, max: 210, step: 1, value: 150 },
      { id: 'mark', type: 'check', label: 'Ring the two patches', value: true },
      { id: 'iso', type: 'check', label: 'Isolate the patches: hide both scenes', value: false }
    ],
    rows: [['patch', 'The two patches'], ['light', 'The two lights'], ['white', 'The white tile of each scene'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, t = V.tint / 100, I = [[1 - 0.5 * t, 1 - 0.22 * t, 1], [1, 1 - 0.18 * t, 1 - 0.6 * t]], T = V.grey;
      const cs = Math.min(g.w * 0.46 / 5, g.h * 0.62 / 4), sw = cs * 5, sh = cs * 4, xs = [g.cx - g.w * 0.25 - sw / 2, g.cx + g.w * 0.25 - sw / 2], y0 = g.cy - sh / 2 - 8, ty = y0 + cs + (cs - 2) / 2;
      I.forEach((il, k) => {
        if (V.iso) return;
        for (let n = 0; n < 20; n++) {                                  // four rows of five tiles; the tile in row 2, column 3 is the patch
          const x = xs[k] + (n % 5) * cs, y = y0 + Math.floor(n / 5) * cs, target = n === 7;
          rect(c, x, y, cs - 2, cs - 2, target ? gr(T) : rgb(MOND[n].map((v, j) => enc(v * il[j]))));
          if (target && V.mark) circ(c, x + (cs - 2) / 2, ty, cs * 0.6, null, g.C.bad, 2);
        }
        txt(g, k ? 'under a yellowish light' : 'under a bluish light', xs[k] + sw / 2, y0 + sh + 16, { align: 'center', size: 12 });
      });
      if (V.iso) { rect(c, g.cx - cs, g.cy - cs / 2, cs - 1, cs, gr(T)); rect(c, g.cx + 1, g.cy - cs / 2, cs - 1, cs, gr(T)); }
      const w0 = MOND[0].map((v, j) => enc(v * I[0][j])), w1 = MOND[0].map((v, j) => enc(v * I[1][j]));
      g.say('patch', 'Both: ' + grT(T)); g.say('light', 'Bluish × (' + I[0].map(v => v.toFixed(2)).join(', ') + '), yellowish × (' + I[1].map(v => v.toFixed(2)).join(', ') + ')');
      g.say('white', rgbT(w0) + ' in the bluish scene, ' + rgbT(w1) + ' in the yellowish one');
      g.say('fact', V.iso ? 'On their own the patches look alike: they are one grey' : 'The two patches carry the same value; only the lights around them differ');
    },
    text: [
      'The patch in the bluish scene looks yellowish-grey, while the identical patch in the yellowish scene looks bluish-grey.',
      'The two patches are filled with exactly the same grey, printed in the read-out. Only the tiles around them differ, each multiplied by the colour of a light. Isolate the patches and they match.',
      'Vision estimates the colour of the surface rather than of the light reaching the eye: it takes the overall tint of the scene as the colour of the illumination and discounts it. A grey patch under a bluish light is expected to reflect a bluish grey, so one that is not bluish is judged to be yellowish. How this comes about, from the cones up, is partly understood.'
    ]
  });

  /* ================================================================ motion */
  add({
    id: 'phi', name: 'Apparent motion (phi and beta)', group: MOTION, page: 'motion-illusions', anim: true,
    bg: '#9e9e9e', hint: g => g.V.both ? 'Both dots are on together: nothing moves' : 'Look at the cross between the dots: does one dot seem to jump across?',
    controls: [
      { id: 'isi', label: 'Dark gap between the flashes', min: 0, max: 600, step: 5, value: 100, unit: 'ms' },
      { id: 'dur', label: 'Length of each flash', min: 60, max: 300, step: 5, value: 120, unit: 'ms' },
      { id: 'sep', label: 'Separation of the dots', min: 5, max: 45, step: 1, value: 22, unit: '% of the width' },
      { id: 'both', type: 'check', label: 'Show both dots at once', value: false }
    ],
    rows: [['cycle', 'One cycle'], ['regime', 'What you should see'], ['fact', 'The fact']],
    init: () => ({ t: 0 }),
    tick(g) { g.s.t += g.dt; },
    draw(g) {
      const { c, V, s } = g, cyc = 2 * (V.dur + V.isi), tm = (s.t * 1000) % cyc, dx = g.w * V.sep / 200, r = clamp(g.u * 0.04, 8, 20);
      const left = V.both || tm < V.dur, right = V.both || (tm >= V.dur + V.isi && tm < 2 * V.dur + V.isi);
      ln(c, g.cx - 9, g.cy, g.cx + 9, g.cy, '#555', 1.5); ln(c, g.cx, g.cy - 9, g.cx, g.cy + 9, '#555', 1.5);
      if (left) circ(c, g.cx - dx, g.cy, r, '#111'); if (right) circ(c, g.cx + dx, g.cy, r, '#111');
      circ(c, g.cx - dx, g.cy, r + 5, null, 'rgba(0,0,0,.25)', 1, [3, 3]); circ(c, g.cx + dx, g.cy, r + 5, null, 'rgba(0,0,0,.25)', 1, [3, 3]);
      const hi = 150 + 6 * V.sep;
      g.say('cycle', num(cyc, 0) + ' ms: each dot flashes ' + num(1000 / cyc, 1) + ' times a second, one dot in each half');
      g.say('regime', V.both ? 'Two dots, steadily on' : V.isi < 20 ? 'Both dots seem to be on together, with a flicker' : V.isi < 55 ? 'A flicker, perhaps a trembling between the two places' : V.isi <= hi ? 'One dot seems to jump to and fro (beta motion)' : 'Two separate flashes, one after the other');
      g.say('fact', 'Neither dot ever moves: each flashes in its own fixed place. The usual ranges shift with the separation, the flash length and the viewer.');
    },
    text: [
      'With the right gap between the flashes, one dot seems to travel across the gap and back. With a very short gap the two seem to be on together; with a long one they are two separate flashes.',
      'Two fixed dots, each lit in turn. Show both together and nothing moves; the dashed circles mark where each one is.',
      'The visual system joins two flashes that are close in space and time into one object that has moved, as it would for a real moving object seen through a gap, a process known as the correspondence problem. The smoothest jump is called beta motion, while the pure impression of motion without a seen object is the phi phenomenon. Described by Max Wertheimer in 1912.'
    ],
    cond: 'Small dots on a grey ground, flashing a few times a second. Look at the cross between the dots.'
  });

  add({
    id: 'wagon-wheel', name: 'Wagon-wheel effect', group: MOTION, page: 'stroboscopic-effects', also: ['motion-illusions'], anim: true,
    bg: '#b8b8b8', hint: g => g.V.steady ? 'The wheel turns steadily; your screen itself is a strobe at its own refresh rate' : 'The wheel is lit in flashes. Which way does it turn?',
    controls: [
      { id: 'rps', label: 'True speed of the wheel', min: 0, max: 8, step: 0.05, value: 1, unit: 'turns/s' },
      { id: 'sp', label: 'Number of spokes', min: 2, max: 24, step: 1, value: 8 },
      { id: 'fs', label: 'Flash rate', min: 1, max: 12, step: 0.5, value: 10, unit: 'flashes/s' },
      { id: 'steady', type: 'check', label: 'Light it steadily instead of flashing', value: false },
      { id: 'mark', type: 'check', label: 'Mark one spoke in red', value: false }
    ],
    rows: [['true', 'True turning'], ['app', 'Apparent turning'], ['flash', 'Between two flashes'], ['fact', 'The fact']],
    init: () => ({ t: 0 }),
    tick(g) { g.s.t += g.dt; },
    draw(g) {
      const { c, V, s } = g, R = Math.min(g.w * 0.22, g.h * 0.32), N = Math.round(V.sp), fs = V.fs, k = Math.floor(s.t * fs), lit = V.steady || (s.t * fs - k) < 0.22;
      const th = V.steady ? TAU * V.rps * s.t : TAU * V.rps * k / fs;
      if (lit) {
        circ(c, g.cx, g.cy, R, null, '#222', 5);
        for (let i = 0; i < N; i++) { const a = th + TAU * i / N; ln(c, g.cx, g.cy, g.cx + R * Math.cos(a), g.cy + R * Math.sin(a), V.mark && i === 0 ? '#d4202a' : '#222', V.mark && i === 0 ? 5 : 3); }
        circ(c, g.cx, g.cy, 9, '#222');
      } else circ(c, g.cx, g.cy, 4, '#777');
      const Np = V.mark ? 1 : N, fp = V.rps * Np, fa = fp - Math.round(fp / fs) * fs, app = fa / Np;
      g.say('true', V.rps < 0.005 ? 'Not turning' : num(V.rps, 2) + ' turns a second, forwards (' + num(360 * V.rps, 0) + '° a second)');
      g.say('app', V.steady ? 'The true motion, as far as your screen allows' : V.rps < 0.005 ? 'Standing still' : Math.abs(app) < 0.005 ? 'Standing still' : num(Math.abs(app), 2) + ' turns a second, ' + (app > 0 ? 'forwards' : 'backwards') + (V.mark ? ' (following the red spoke)' : ' (spokes look alike)'));
      g.say('flash', V.steady ? 'Not flashing' : 'It turns ' + num(360 * V.rps / fs, 1) + '°; the spokes are ' + num(360 / N, 1) + '° apart');
      g.say('fact', V.steady ? 'Lit steadily the wheel is seen as it turns' : 'Sampling a regular pattern too slowly makes it alias: a motion of more than half the pattern period between flashes seems to run backwards');
    },
    text: [
      'In flashes, a wheel that is really turning forwards can seem to stand still, turn slowly backwards, or turn slowly forwards at the wrong speed.',
      'The wheel turns at one steady speed, the true figure in the read-out. The apparent motion is computed from the flash rate: between flashes the pattern of spokes moves on by some fraction of the gap between two spokes. Light it steadily, or mark one spoke, and the picture changes.',
      'This is aliasing, the same effect as in a sampled signal. When the wheel turns more than half a spoke gap between flashes, the nearest repeat of the pattern is the one behind, so the eye matches each spoke with its neighbour behind it and sees backwards motion. Under steady light, a similar effect with no strobe is known and its cause is argued.'
    ],
    cond: 'Small dark wheel on a grey ground, flashing at up to twelve times a second; stop if flicker bothers you. A screen redraws its picture at a fixed rate too, so even the steady setting is a series of frames.'
  });

  add({
    id: 'motion-aftereffect', name: 'Motion after-effect', group: MOTION, page: 'motion-illusions', anim: true,
    bg: '#808080',
    hint: g => g.s.phase === 'adapt' ? 'Keep your eyes on the dot while the pattern moves' : g.s.phase === 'test' ? 'The pattern is now still. Does it seem to drift the other way?' : 'Press Start, keep your eyes on the dot, then watch the still pattern.',
    controls: [
      { id: 'kind', type: 'select', label: 'Pattern', options: [['Expanding rings', 'rings'], ['Drifting bars', 'bars']], value: 'rings' },
      { id: 'speed', label: 'Speed of the motion', min: 0.2, max: 2.5, step: 0.1, value: 1, unit: 'periods/s' },
      { id: 'dur', label: 'Time to watch the motion', min: 8, max: 30, step: 1, value: 20, unit: 's' },
      { type: 'buttons', items: [{ id: 'go', label: 'Start', primary: true }, { id: 'stop', label: 'Stop and reset' }] }
    ],
    rows: [['phase', 'Now'], ['speed', 'Speed of the pattern on the screen'], ['fact', 'The fact']],
    init: () => ({ phase: 'idle', t: 0, ph: 0 }),
    enter(s) { s.phase = 'idle'; s.t = 0; },
    on(key, v, s) { if (key === 'go') { s.phase = 'adapt'; s.t = 0; } else if (key === 'stop') { s.phase = 'idle'; s.t = 0; } },
    tick(g) { const s = g.s; if (s.phase === 'adapt') { s.t += g.dt; s.ph += g.V.speed * g.dt; if (s.t >= g.V.dur) { s.phase = 'test'; s.t = 0; } } else if (s.phase === 'test') s.t += g.dt; },
    draw(g) {
      const { c, V, s } = g, lam = g.u * 0.075, A = 55;
      if (V.kind === 'rings') for (let r = g.u * 0.44; r > 0; r -= 3) circ(c, g.cx, g.cy, r, gr(128 + A * Math.sin(TAU * (r / lam - s.ph))));
      else for (let x = g.cx - g.w * 0.4; x < g.cx + g.w * 0.4; x += 3) rect(c, x, g.cy - g.h * 0.36, 3.5, g.h * 0.72, gr(128 + A * Math.sin(TAU * ((x - g.cx) / lam - s.ph))));
      circ(c, g.cx, g.cy, 5, '#fff', '#000', 1.5);
      g.say('phase', s.phase === 'idle' ? 'Waiting for you to start' : s.phase === 'adapt' ? 'Watching the motion: ' + num(s.t, 0) + ' s of ' + V.dur + ' s' : 'Still pattern: ' + num(s.t, 0) + ' s');
      g.say('speed', s.phase === 'adapt' ? num(V.speed, 1) + ' periods a second, ' + (V.kind === 'rings' ? 'outwards' : 'to the right') : 'Zero: the pattern is perfectly still');
      g.say('fact', s.phase === 'test' ? 'Nothing on the screen moves now; the drift you see is in your visual system' : 'Contrast of the pattern is only ±' + A + ' grey levels about ' + grT(128));
    },
    text: [
      'After watching the pattern move for twenty seconds, the still pattern seems to drift the opposite way: rings that expanded seem to shrink, and bars that drifted right seem to slide left.',
      'During the test the pattern is perfectly still, the read-out says so, and nothing in the picture changes.',
      'Cells tuned to one direction of motion tire during the long exposure, so when the motion stops, cells tuned to the opposite direction are the more active and signal motion the other way, a process called adaptation. The effect has been noticed on waterfalls, and is known as the waterfall illusion. It is a fine example of how the sense of motion comes from comparing directions.'
    ],
    cond: 'Keep your eyes on the dot throughout. The pattern has low contrast and moves smoothly; stop at any time with the button.'
  });

  /* ================================================================ ambiguous and impossible figures */
  add({
    id: 'necker', name: 'Necker cube', group: AMBIG, page: 'ambiguous-and-impossible-figures', also: ['depth-and-perspective-illusions'],
    hint: 'Which face of the cube is in front? Click the figure to step through the locks.',
    controls: [
      { id: 'lock', type: 'select', label: 'Reading', options: [['Free: let it flip', 'free'], ['Lock: lower-left face in front', 'A'], ['Lock: upper-right face in front', 'B']], value: 'free' },
      { id: 'cue', type: 'select', label: 'Cue that does the locking', options: [['Tint the front face', 'tint'], ['Draw the hidden edges dashed', 'dash'], ['Leave the hidden edges out', 'solid']], value: 'tint' }
    ],
    rows: [['lines', 'What is drawn'], ['now', 'Reading'], ['fact', 'The fact']],
    clickable: () => true,
    click(p, g) { g.set('lock', { free: 'A', A: 'B', B: 'free' }[g.V.lock]); },
    draw(g) {
      const { c, V } = g, sq = clamp(g.u * 0.34, 80, 260), d = sq * 0.42, xa = g.cx - (sq + d) / 2, ya = g.cy - (sq - d) / 2;
      const Lq = [[xa, ya], [xa + sq, ya], [xa + sq, ya + sq], [xa, ya + sq]], Uq = Lq.map(p => [p[0] + d, p[1] - d]), lock = V.lock;
      const hid = lock === 'A' ? ['U23', 'U03', 'C3'] : lock === 'B' ? ['L01', 'L12', 'C1'] : [];
      const edge = (name, p, q) => {
        const h = hid.includes(name);
        if (h && V.cue === 'solid') return;
        ln(c, p[0], p[1], q[0], q[1], h ? '#8a8a8a' : g.ink, h ? 1.6 : 3.2, h ? [5, 4] : null);
      };
      if (lock !== 'free' && V.cue === 'tint') poly(c, lock === 'A' ? Lq : Uq, 'rgba(70,130,210,0.38)');
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4, lo = Math.min(i, j), hi = Math.max(i, j); edge('L' + lo + hi, Lq[i], Lq[j]); edge('U' + lo + hi, Uq[i], Uq[j]); edge('C' + i, Lq[i], Uq[i]); }
      g.say('lines', lock === 'free' ? '12 edges, all plain lines of equal weight' : V.cue === 'tint' ? '12 equal edges, the front face tinted' : V.cue === 'dash' ? '12 edges, the 3 hidden ones dashed and thin' : '9 edges: the 3 hidden ones are left out');
      g.say('now', lock === 'free' ? 'Free: the cube flips by itself every few seconds' : 'Locked: the ' + (lock === 'A' ? 'lower-left' : 'upper-right') + ' face is in front');
      g.say('fact', 'The picture is flat. Both readings fit the lines exactly, and nothing in them favours one');
    },
    text: [
      'The cube flips: the lower-left square comes forward for a few seconds, then the upper-right one does, and back again, though nothing on the screen changes.',
      'Twelve flat lines, in two squares joined at the corners. Both ways of seeing them as a cube are equally good fits. A tint on one face, or dashed hidden edges, makes one reading the only reasonable one.',
      'The lines on the retina do not say how far each part is. The visual system must pick an interpretation, and with two that fit equally it settles on one and then, as the neurons for it tire, swaps to the other: a form of competition that is studied as a model of perceptual decision. Described by Louis Albert Necker in 1832, who saw it in drawings of crystals.'
    ]
  });

  /* the contour of Rubin's vase: half-width (a share of the height) against height, as a vase and as a pair of facing profiles */
  const FACE = [[0, 0.20], [0.10, 0.19], [0.20, 0.17], [0.27, 0.15], [0.31, 0.16], [0.40, 0.09], [0.46, 0.13], [0.50, 0.12], [0.53, 0.14], [0.57, 0.12], [0.63, 0.15], [0.70, 0.12], [0.78, 0.19], [0.88, 0.27], [1, 0.30]];
  const faceW = y => { for (let i = 1; i < FACE.length; i++) if (y <= FACE[i][0]) { const a = FACE[i - 1], b = FACE[i], t = (y - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (1 - Math.cos(Math.PI * t)) / 2; } return FACE[FACE.length - 1][1]; };
  const vaseW = y => 0.12 + 0.11 * Math.sin(Math.PI * y) + 0.10 * y * y * y;

  add({
    id: 'rubin', name: 'Rubin’s vase', group: AMBIG, page: 'ambiguous-and-impossible-figures',
    bg: g => g.V.swap ? '#000000' : '#ffffff',
    hint: 'Do you see a vase, or two faces looking at each other? Click the figure to swap black and white.',
    controls: [
      { id: 'detail', label: 'Detail of the profile (smooth vase to faces)', min: 0, max: 100, step: 1, value: 100, unit: '%' },
      { id: 'tint', type: 'select', label: 'Colour', options: [['None', 'none'], ['Colour the vase', 'vase'], ['Colour the faces', 'faces']], value: 'none' },
      { id: 'swap', type: 'check', label: 'Swap black and white', value: false },
      { id: 'edge', type: 'check', label: 'Draw the one shared contour in red', value: false }
    ],
    rows: [['contour', 'What is drawn'], ['fact', 'The fact']],
    clickable: () => true,
    click(p, g) { g.set('swap', !g.V.swap); },
    draw(g) {
      const { c, V } = g, k = V.detail / 100, N = 120, H = g.h, L = [], R = [];
      for (let i = 0; i <= N; i++) { const y = i / N, w = (vaseW(y) * (1 - k) + faceW(y) * k) * H, py = g.y + y * H; L.push([g.cx - w, py]); R.push([g.cx + w, py]); }
      const vase = V.tint === 'vase' ? '#d9a62e' : V.swap ? '#ffffff' : '#000000', faces = V.tint === 'faces' ? '#c9704f' : null;
      poly(c, L.concat(R.slice().reverse()), vase);
      if (faces) { poly(c, [[g.x - 2, g.y - 2]].concat(L, [[g.x - 2, g.y + H + 2]]), faces); poly(c, [[g.x + g.w + 2, g.y - 2]].concat(R, [[g.x + g.w + 2, g.y + H + 2]]), faces); }
      if (V.edge) for (const side of [L, R]) { c.save(); c.strokeStyle = g.C.bad; c.lineWidth = 3; c.beginPath(); side.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); }
      g.say('contour', 'One curve, mirrored about the centre line; the vase is the space between the two copies' + (k < 0.01 ? ' (a smooth vase: little to see as faces)' : ''));
      g.say('fact', 'Only the contour is drawn: it belongs to the vase and to the faces at once, and you see it as belonging to one at a time');
    },
    text: [
      'You see a vase, or two faces in profile, but not both at once; the view changes by itself and you cannot hold the two together.',
      'One curve and its mirror image, with black on one side and white on the other. The edge between them is the only thing drawn, and it is shared by the vase and the faces. Colour the vase or the faces, or smooth the curve into a plain vase, and one reading takes over.',
      'The brain must decide which side of an edge is the object and which is the background, because the edge is seen as belonging to the object. With a symmetrical choice it flips between them. Cues that favour one side, such as colour, smaller area and convexity, tip the balance. Introduced by Edgar Rubin in 1915, as a study of figure and ground.'
    ]
  });

  /* Penrose's tribar as a real model: sixteen cubes in three bars along the x, y and z axes, seen from a camera that turns about the vertical */
  const NB = 6, CUBES = [];
  for (let i = 0; i < NB; i++) CUBES.push([i, 0, 0]);
  for (let j = 1; j < NB; j++) CUBES.push([NB - 1, j, 0]);
  for (let k = 1; k < NB; k++) CUBES.push([NB - 1, NB - 1, k]);
  const HAS = new Set(CUBES.map(q => q.join()));
  const has = (i, j, k) => HAS.has(i + ',' + j + ',' + k);
  const TONE = { '0+': '#a9a9a9', '1+': '#7b7b7b', '2+': '#e4e4e4', '0-': '#6c6c6c', '1-': '#575757', '2-': '#cdcdcd' };
  const RED = { '0+': '#d98b8b', '1+': '#b04a4a', '2+': '#f2baba', '0-': '#8f3a3a', '1-': '#6e2a2a', '2-': '#dd9d9d' };
  const BLUE = { '0+': '#8fa6d6', '1+': '#4d68a8', '2+': '#bccbee', '0-': '#3c5287', '1-': '#2c3d66', '2-': '#9bb0dc' };
  /* the camera: direction from the model to the eye, screen axes, and the roll that stands the triangle on its base */
  function camera(phi) {
    const c = [Math.cos(phi) - Math.sin(phi), Math.sin(phi) + Math.cos(phi), 1].map(v => v / Math.sqrt(3)), hz = Math.hypot(c[0], c[1]) || 1, r = [-c[1] / hz, c[0] / hz, 0];
    const up = [c[1] * r[2] - c[2] * r[1], c[2] * r[0] - c[0] * r[2], c[0] * r[1] - c[1] * r[0]], ro = 30 * D2R, co = Math.cos(ro), so = Math.sin(ro);
    return { c, proj: p => { const sx = p[0] * r[0] + p[1] * r[1] + p[2] * r[2], sy = p[0] * up[0] + p[1] * up[1] + p[2] * up[2]; return [sx * co - sy * so, sx * so + sy * co]; } };
  }
  const PIV = CUBES.reduce((m, q) => [m[0] + (q[0] + 0.5) / CUBES.length, m[1] + (q[1] + 0.5) / CUBES.length, m[2] + (q[2] + 0.5) / CUBES.length], [0, 0, 0]);   // the model turns about the middle of its mass

  add({
    id: 'penrose', name: 'Penrose triangle', group: AMBIG, page: 'ambiguous-and-impossible-figures', also: ['depth-and-perspective-illusions'],
    hint: 'Three bars at right angles that seem to close into a triangle. Turn the model to see how.',
    bg: '#ffffff',
    controls: [
      { id: 'turn', label: 'Turn the model', min: -90, max: 90, step: 1, value: 0, unit: '°' },
      { id: 'hl', type: 'check', label: 'Colour the two ends that seem to meet', value: false },
      { type: 'buttons', items: [{ id: 'home', label: 'Back to the one viewpoint', primary: true }] }
    ],
    rows: [['view', 'Camera'], ['gap', 'The two ends'], ['fact', 'The fact']],
    on(key, v, s, V, set) { if (key === 'home') set('turn', 0); },
    draw(g) {
      const { c, V } = g, phi = V.turn * D2R, cam = camera(phi), sc = Math.min(g.h / 9.1, g.w / 13), sx = p => g.cx + p[0] * sc, sy = p => g.cy + 0.6 * sc - p[1] * sc;
      const depth = q => cam.c[0] * (q[0] + 0.5) + cam.c[1] * (q[1] + 0.5) + cam.c[2] * (q[2] + 0.5), order = CUBES.slice().sort((a, b) => depth(a) - depth(b));
      const END = CUBES[CUBES.length - 1], START = CUBES[0];
      for (const q of order) {
        const pal = V.hl && q === END ? RED : V.hl && q === START ? BLUE : TONE;
        for (let a = 0; a < 3; a++) for (const sg of [1, -1]) {
          if (sg * cam.c[a] <= 1e-6) continue;
          const n = [0, 0, 0]; n[a] = sg;
          if (has(q[0] + n[0], q[1] + n[1], q[2] + n[2])) continue;                  // a face against another cube is not there to see
          const b = (a + 1) % 3, d = (a + 2) % 3, pt = (u, v) => { const p = [0, 0, 0]; p[a] = q[a] + (sg > 0 ? 1 : 0); p[b] = q[b] + u; p[d] = q[d] + v; const m = cam.proj([p[0] - PIV[0], p[1] - PIV[1], p[2] - PIV[2]]); return [sx(m), sy(m)]; };
          const cs = [pt(0, 0), pt(1, 0), pt(1, 1), pt(0, 1)], tone = pal[a + (sg > 0 ? '+' : '-')];
          poly(c, cs, tone, tone, 1);
          // an edge is drawn where the surface turns a corner or ends; a seam between two flat faces of one bar is not
          const nb = [[0, -1], [1, 0], [0, 1], [-1, 0]];
          for (let e = 0; e < 4; e++) {
            const o = [q[0], q[1], q[2]]; o[b] += nb[e][0]; o[d] += nb[e][1];
            const flat = has(o[0], o[1], o[2]) && !has(o[0] + n[0], o[1] + n[1], o[2] + n[2]);
            if (!flat) ln(c, cs[e][0], cs[e][1], cs[(e + 1) % 4][0], cs[(e + 1) % 4][1], '#1c1c1c', 1.6);
          }
        }
      }
      const ends = cam.proj([(NB - 1) * 1, (NB - 1) * 1, (NB - 1) * 1]), off = Math.hypot(ends[0], ends[1]) * sc, near = (NB - 1) * (cam.c[0] + cam.c[1] + cam.c[2]) / NB;
      g.say('view', Math.abs(V.turn) < 0.5 ? 'The one viewpoint, looking along the diagonal of the cube the bars lie on' : num(Math.abs(V.turn), 0) + '° ' + (V.turn > 0 ? 'one way' : 'the other way') + ' from the one viewpoint');
      g.say('gap', 'On the screen they are ' + num(off, 0) + ' px apart; in space the end of the third bar is ' + num(Math.abs(near), 2) + ' bar-lengths ' + (near >= 0 ? 'nearer to you than' : 'farther from you than') + ' the start of the first');
      g.say('fact', Math.abs(V.turn) < 1.5 ? 'From this one viewpoint the near end lines up exactly with the far one, so the loop seems closed' : 'Three straight bars at right angles that do not meet: the model is open at one corner');
    },
    text: [
      'Three square bars, each at right angles to the next, seem to join in a closed triangle, with every corner a proper right angle, which cannot be built.',
      'A real model of sixteen cubes in three bars along the three axes of space, drawn with its true hidden surfaces. The third bar ends well in front of where the first begins. From the one viewpoint they line up on the screen and look joined; turn the model and the gap opens.',
      'The picture follows the rules of perspective locally, so each corner is seen as a right angle, but the eye cannot place all three corners in one space at once. Only by pretending the parts that line up are touching is the figure possible; the visual system assumes this by default. Devised by Lionel and Roger Penrose and published in 1958, after Oscar Reutersvärd had drawn a similar figure in 1934.'
    ]
  });

  add({
    id: 'kanizsa', name: 'Kanizsa triangle', group: AMBIG, page: 'ambiguous-and-impossible-figures', also: ['what-an-optical-illusion-is'],
    hint: 'Do you see a white triangle lying on top of three black discs?',
    controls: [
      { id: 'rot', label: 'Turn the notches away from alignment', min: 0, max: 180, step: 1, value: 0, unit: '°' },
      { id: 'side', label: 'Size of the triangle', min: 40, max: 100, step: 1, value: 75, unit: '%' },
      { id: 'edges', type: 'check', label: 'Draw the three sides of the triangle', value: false }
    ],
    rows: [['inside', 'Inside and outside the triangle'], ['rot', 'The notches'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, S = Math.min(g.h * 0.7, g.w * 0.6) * V.side / 100, Rc = S / Math.sqrt(3), rho = S * 0.2, cy0 = g.cy + Rc / 4, vs = [];     // the whole figure, discs included, is centred
      for (const a of [-90, 30, 150]) {
        const ar = a * D2R, vx = g.cx + Rc * Math.cos(ar), vy = cy0 + Rc * Math.sin(ar), mc = ar + Math.PI + V.rot * D2R;
        vs.push([vx, vy]);
        c.beginPath(); c.moveTo(vx, vy); c.arc(vx, vy, rho, mc + Math.PI / 6, mc - Math.PI / 6 + TAU); c.closePath(); c.fillStyle = '#000'; c.fill();
      }
      if (V.edges) poly(c, vs, null, '#000', 2);
      g.say('inside', 'Both ' + grT(255) + ': there is no brightness step at the sides you seem to see');
      g.say('rot', V.rot < 0.5 ? 'Aligned: each notch’s edges lie along the sides of the triangle' : 'Turned ' + num(V.rot, 0) + '°: the edges no longer line up' + (V.rot > 40 ? ', so the triangle goes' : ''));
      g.say('fact', V.edges ? 'With the sides drawn there is a real triangle, and you see it plainly' : 'The triangle is not drawn: the three notched discs are all there is');
    },
    text: [
      'A bright white triangle seems to lie on top of three black discs and an upside-down outline triangle, with sharp edges and a surface a little whiter than the page.',
      'Three black discs with a wedge cut out of each. The inside of the triangle is exactly as white as the page around it, and no edge is drawn. Turn the notches and the triangle goes; draw the sides and it becomes real.',
      'The three notches line up to suggest a triangle lying in front of three whole discs, which would be hidden in part by it, and the visual system fills in the edges and the whiteness that the simplest explanation needs. The edges are signalled by cells in early visual cortex, which respond to illusory contours as to real ones. Described by Gaetano Kanizsa in 1955.'
    ]
  });

  /* ================================================================ seeing */
  add({
    id: 'blind-spot', name: 'The blind spot', group: SEE, page: 'the-blind-spot-and-filling-in',
    hint: g => 'Cover your ' + (g.V.eye === 'right' ? 'left' : 'right') + ' eye, look at the cross with the other, and move nearer or farther until the target vanishes.',
    controls: [
      { id: 'eye', type: 'select', label: 'The eye you will use', options: [['Right eye (cross on the left)', 'right'], ['Left eye (cross on the right)', 'left']], value: 'right' },
      { id: 'target', type: 'select', label: 'Target', options: [['A black dot', 'dot'], ['A line with a gap', 'gap'], ['A white dot on stripes', 'stripes']], value: 'dot' },
      { id: 'dist', label: 'Distance from your eye to the screen', min: 20, max: 100, step: 1, value: 40, unit: 'cm' },
      { id: 'ang', label: 'Angle from the cross to the target', min: 10, max: 20, step: 0.5, value: 15, unit: '°' },
      { id: 'dia', label: 'Size of the dot or of the gap', min: 2, max: 40, step: 1, value: 12, unit: 'mm' },
      { id: 'card', label: 'Calibrate: make the bar as long as a bank card (85.6 mm)', min: 150, max: 700, step: 1, value: 324, unit: 'px' }
    ],
    rows: [['scale', 'Scale of your screen'], ['where', 'Where the target is'], ['size', 'Size of the target'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, pxmm = V.card / 85.6, Dpx = V.dist * 10 * Math.tan(V.ang * D2R) * pxmm, right = V.eye === 'right', fits = Dpx + 70 <= g.w;
      const xc = fits ? g.cx + (right ? -Dpx / 2 : Dpx / 2) : (right ? g.x + 35 : g.x + g.w - 35), tx = fits ? xc + (right ? Dpx : -Dpx) : clamp(xc + (right ? Dpx : -Dpx), g.x + 16, g.x + g.w - 16), y = g.y + g.h * 0.36, dpx = V.dia * pxmm;
      ln(c, xc - 14, y, xc + 14, y, '#000', 2.5); ln(c, xc, y - 14, xc, y + 14, '#000', 2.5);
      if (V.target === 'dot') circ(c, tx, y, dpx / 2, '#000');
      else if (V.target === 'gap') { const ll = dpx * 2.2 + 70; ln(c, tx - ll, y, tx - dpx / 2, y, '#000', 4); ln(c, tx + dpx / 2, y, tx + ll, y, '#000', 4); }
      else {
        const half = dpx * 1.5 + 40; c.save(); c.beginPath(); c.rect(tx - half, y - half, 2 * half, 2 * half); c.clip();
        for (let k = -2 * half; k < 2 * half; k += 9) ln(c, tx - half, y + k, tx + half, y + k + 2 * half, '#000', 2);
        c.restore(); circ(c, tx, y, dpx / 2, '#fff');
      }
      const by = g.y + g.h * 0.84, bx = g.cx - V.card / 2;
      ln(c, bx, by, bx + V.card, by, g.ink, 10); ln(c, bx, by - 14, bx, by + 14, g.ink, 2); ln(c, bx + V.card, by - 14, bx + V.card, by + 14, g.ink, 2);
      txt(g, 'Lay a bank card along this bar and slide until they match', g.cx, by - 26, { align: 'center', size: 12 });
      const dAng = 2 * Math.atan(V.dia / (2 * V.dist * 10)) / D2R;
      g.say('scale', num(pxmm, 2) + ' px per mm: the bar of ' + V.card + ' px stands for 85.6 mm');
      g.say('where', num(V.ang, 1) + '° from the cross at ' + V.dist + ' cm is ' + num(V.dist * 10 * Math.tan(V.ang * D2R), 0) + ' mm, or ' + num(Dpx, 0) + ' px' + (fits ? '' : '; there is not room, so the target is held at the edge: sit nearer or turn the angle down'));
      g.say('size', num(V.dia, 0) + ' mm is ' + num(dAng, 1) + '° across: ' + (dAng < 4.5 ? 'small enough to vanish inside the blind spot (about 5° across)' : 'too big to vanish completely (the spot is about 5° across)'));
      g.say('fact', 'Nothing is missing from the drawing: the target is there all the time, and only seems to go when its image falls on the place where the optic nerve leaves the eye');
    },
    text: [
      'With one eye closed and the other on the cross, the target vanishes at the right distance. A line with a gap looks whole, and stripes seem to run through the place where the white dot is.',
      'The dot, the gap and the white dot are all drawn at full strength. The target is placed at the angle you set from the cross, converted to a distance on your screen from the calibration bar and your viewing distance.',
      'Where the optic nerve leaves the retina there are no light-sensing cells, a blind spot about 5° across and 7° tall, some 15° to the side of the point you look at. The brain does not see a hole: it fills in the gap from the surroundings, so a line continues and a pattern carries on. Edme Mariotte described the blind spot in the 1660s.'
    ],
    cond: 'Cover the eye that is on the side of the target. Keep the other eye on the cross, at about the distance in the control, and do not let it wander. The angle varies a little between people, so nudge the angle or the distance until the target goes.'
  });

  add({
    id: 'troxler', name: 'Troxler fading', group: SEE, page: 'the-blind-spot-and-filling-in',
    bg: '#b4b4b4', hint: 'Keep your eyes on the cross without moving them: the soft ring in the periphery should fade away.',
    controls: [
      { id: 'tint', type: 'select', label: 'Ring', options: [['A lighter ring', 'light'], ['A darker ring', 'dark'], ['A blue ring', 'blue']], value: 'light' },
      { id: 'con', label: 'Contrast of the ring', min: 4, max: 60, step: 1, value: 22, unit: '%' },
      { id: 'soft', label: 'Softness of the ring’s edge', min: 8, max: 80, step: 1, value: 40, unit: 'px' },
      { id: 'ecc', label: 'Distance of the ring from the cross', min: 25, max: 95, step: 1, value: 62, unit: '% of the half-height' },
      { id: 'dist', label: 'Distance from your eye to the screen', min: 30, max: 100, step: 1, value: 50, unit: 'cm' },
      { id: 'fix', type: 'check', label: 'Show the cross to look at', value: true }
    ],
    rows: [['ring', 'What is drawn'], ['ecc', 'Where the ring is'], ['fact', 'The fact']],
    draw(g) {
      const { c, V } = g, R = g.h / 2 * V.ecc / 100, hw = V.soft, a = V.con / 100, col = { light: [255, 255, 255], dark: [0, 0, 0], blue: [40, 80, 255] }[V.tint], r0 = Math.max(0, R - hw), r1 = R + hw;
      const gd = c.createRadialGradient(g.cx, g.cy, r0, g.cx, g.cy, r1);
      for (let k = 0; k <= 8; k++) { const u = k / 8; gd.addColorStop(u, 'rgba(' + col.join(',') + ',' + (a * Math.pow(Math.max(0, 1 - Math.abs(2 * u - 1)), 1.4)).toFixed(3) + ')'); }
      c.fillStyle = gd; c.fillRect(g.x, g.y, g.w, g.h);
      if (V.fix) { ln(c, g.cx - 10, g.cy, g.cx + 10, g.cy, '#000', 2.5); ln(c, g.cx, g.cy - 10, g.cx, g.cy + 10, '#000', 2.5); }
      const peak = [0, 1, 2].map(j => 180 * (1 - a) + col[j] * a), ecc = Math.atan(R * 0.2646 / (V.dist * 10)) / D2R;
      g.say('ring', 'A soft ring, peak ' + rgbT(peak) + ' on the ground ' + grT(180) + ', ' + num(2 * hw, 0) + ' px wide at its base');
      g.say('ecc', num(R, 0) + ' px from the cross, about ' + num(ecc, 1) + '° at ' + V.dist + ' cm, assuming 96 dots to the inch');
      g.say('fact', 'The ring never changes: it is drawn at the same strength the whole time, and what fades is your response to it');
    },
    text: [
      'The soft ring seems to thin and then vanish, leaving a plain grey ground, after some seconds of steady looking at the cross. A blink or a flick of the eyes brings it back.',
      'The ring is drawn at one constant strength all the time. A lower contrast, a softer edge or a larger distance from the cross makes it fade faster; a sharper, stronger and closer one resists.',
      'Away from the centre of the eye’s field, cells respond to change and adapt to a steady image, and their signal for a faint, blurry patch drops until it matches the surround. Eye movements, even tiny ones, constantly refresh the signal and normally prevent this. Described by Ignaz Troxler in 1804.'
    ],
    cond: 'Keep your gaze fixed on the cross for ten to twenty seconds, in steady light. A soft low-contrast ring in the periphery fades most quickly.'
  });

  /* ================================================================ the lab */
  const INTRO = 'An illusion is a place where what you see and what is measured part company. Choose one from the list, or step through with Previous and Next. Look at it first as it is drawn, then use the controls to take its context away — weaken the strength, cover the surround, lay a guide across it, join the parts together — and watch the effect fade. Where an illusion asks you to judge a size or a position, switch on the matching task: adjust the figure until it looks right to you, and the read-out says by how much you were off. Every grey, colour and length is drawn exactly as the read-out states; the effects are in your visual system, and several depend on your screen and on how far you sit from it.';
  const SMALL = '<p class="small faint mt">Photosensitivity: nothing here flashes a large bright area. The apparent-motion and wagon-wheel figures use small objects on a grey ground, and the wheel can be lit steadily instead; stop if any flicker troubles you. Illusions that need a viewing condition — a distance, one eye closed, steady fixation — say so in their notes.</p>';

  T.illusions = function (el, params, sub) {
    const L = T.util.lab(el, INTRO, 0.62, { minH: 360, maxH: 640 }), st = L.st, byId = {};
    LIST.forEach(it => { byId[it.id] = it; it.s = it.init ? it.init() : {}; });
    let cur = byId[sub] || LIST[0];

    /* the gallery: which illusion, and the way through the list */
    const gal = K.controls(L.side, [
      { id: 'pick', type: 'select', label: 'Illusion', options: LIST.map(x => [GROUP_TAG[x.group] + ' · ' + x.name, x.id]), value: cur.id },
      { type: 'buttons', items: [{ id: 'prev', label: '← Previous' }, { id: 'next', label: 'Next →' }] },
      { id: 'where', type: 'html', html: '' }
    ], (id, v) => { if (id === 'pick') go(v); else go(LIST[(LIST.indexOf(cur) + (id === 'next' ? 1 : LIST.length - 1)) % LIST.length].id); });

    /* every illusion's own controls, under their own ids; only the current ones are shown */
    const defs = [];
    for (const it of LIST) for (const d of it.controls) defs.push(d.type === 'buttons' ? Object.assign({}, d, { items: d.items.map(b => Object.assign({}, b, { id: it.id + '.' + b.id })) }) : Object.assign({}, d, { id: d.id ? it.id + '.' + d.id : d.id }));
    const ctl = K.controls(L.side, defs, (id, v) => {
      const i = id.indexOf('.'), it = byId[id.slice(0, i)];
      if (!it || it !== cur) return;
      if (it.on) it.on(id.slice(i + 1), v, it.s, vals(it), (k, val) => ctl.set(it.id + '.' + k, val));
      if (!loop.running) redraw(0);
    });
    LIST.forEach(it => { it.ro = K.readout(L.side, it.rows); });
    const vals = it => { const V = {}; for (const d of it.controls) if (d.id) V[d.id] = ctl.values[it.id + '.' + d.id]; return V; };

    /* one frame: the panel the figure is drawn on, then the figure, then the frame and the line above it */
    function makeG(c) {
      const W = st.W, Hh = st.H, x = 8, y = 28, w = Math.max(100, W - 16), h = Math.max(100, Hh - y - 8);
      return { c, C: K.colors(), W, H: Hh, x, y, w, h, cx: x + w / 2, cy: y + h / 2, u: Math.min(w, h), V: vals(cur), s: cur.s, dt: 0, ink: '#1a1a1a', bg: '#fff', say: (k, v) => cur.ro.set(k, v), set: (k, v) => ctl.set(cur.id + '.' + k, v) };
    }
    function redraw(dt) {
      const c = st.begin(), g = makeG(c);
      g.dt = dt || 0;
      if (cur.tick) cur.tick(g);
      g.bg = typeof cur.bg === 'function' ? cur.bg(g) : (cur.bg || '#ffffff');
      g.ink = lumOf(g.bg) > 140 ? '#1a1a1a' : '#f0f0f0';
      c.fillStyle = g.bg; c.fillRect(g.x, g.y, g.w, g.h);
      c.save(); c.beginPath(); c.rect(g.x, g.y, g.w, g.h); c.clip();
      try { cur.draw(g); } finally { c.restore(); }
      c.strokeStyle = g.C.axis; c.lineWidth = 1; c.strokeRect(g.x + 0.5, g.y + 0.5, g.w - 1, g.h - 1);
      K.label(c, typeof cur.hint === 'function' ? cur.hint(g) : cur.hint, g.x, 14, { size: 12, color: g.C.muted });
    }
    const loop = K.loop(dt => redraw(dt), L.stage);

    const explain = it => T.util.box(esc(it.name),
      '<p class="small" style="margin:0 0 6px"><b>What you see.</b> ' + it.text[0] + '</p><p class="small" style="margin:0 0 6px"><b>What is really there.</b> ' + it.text[1] + '</p><p class="small" style="margin:0"><b>Why it happens.</b> ' + it.text[2] + '</p>' +
      (it.cond ? '<p class="small faint" style="margin:6px 0 0"><b>Viewing condition.</b> ' + it.cond + '</p>' : '')) +
      T.util.more([it.page].concat(it.also || [], ['what-an-optical-illusion-is']).filter((id, i, a) => a.indexOf(id) === i)) + SMALL;

    function go(id, quiet) {
      cur = byId[id] || LIST[0];
      for (const it of LIST) {
        const on = it === cur;
        for (const d of it.controls) { if (d.type === 'buttons') d.items.forEach(b => ctl.show(it.id + '.' + b.id, on)); else if (d.id) ctl.show(it.id + '.' + d.id, on); }
        it.ro.show(on);
      }
      gal.set('pick', cur.id);
      gal.set('where', 'Group: ' + cur.group + ' · ' + (LIST.indexOf(cur) + 1) + ' of ' + LIST.length);
      L.under.innerHTML = explain(cur);
      if (!quiet && typeof history !== 'undefined' && history.replaceState) { try { history.replaceState(null, '', '#/tools/illusions/' + cur.id); } catch (e) { /* the address is only a courtesy */ } }
      if (cur.enter) cur.enter(cur.s, vals(cur));
      if (cur.anim) loop.start(); else loop.stop();
      redraw(0);
    }

    K.drag(st, {
      hit: p => cur.hit ? cur.hit(makeG(null), p) : null,
      start: (t, p) => { cur.move(t, p, makeG(null)); if (!loop.running) redraw(0); },
      move: (t, p) => { cur.move(t, p, makeG(null)); if (!loop.running) redraw(0); }
    });
    K.click(st, p => { if (cur.click) { cur.click(p, makeG(null)); if (!loop.running) redraw(0); } }, p => !!(cur.click && cur.clickable && cur.clickable(p, makeG(null))));
    st.onResize(() => redraw(0)); T.util.onTheme(() => redraw(0));
    go(cur.id, true);
  };
  T.illusions.tabs = LIST.map(x => x.id);
})();
