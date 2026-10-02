/* HYPER-CORE · construct.js
 *
 * The construction kit: a drawing described as a sequence of steps, each made with one hand tool
 * (straightedge, T-square, set square, compass, dividers, scale, protractor, pencil …), built into a
 * scene of shapes and rendered as SVG, step by step. Grown out of the Curves Workshop kit.
 * Runs in the browser (Hyper.construct) and under Node (tools/validate.js, tools/test-construct.js).
 *
 *   Hyper.construction({ id, title, tags, note, build(k) })   registers one construction (Hyper.constructions)
 *   Hyper.construct.build(def) -> { def, steps, shapes, bounds, opts }
 *   Hyper.construct.svg(sceneOrDef, { upTo, size, standalone, noSize }) -> an SVG string
 *   Hyper.construct.targets(scene) -> what the learner must draw on the practice board, step by step
 *
 * Inside build(k): k.given(text, fn), k.step(tool, text, fn), k.note(text, fn) and, inside a step,
 * k.point k.P k.dot k.label k.text k.seg k.line k.ray k.arrow k.poly k.rect k.axes k.grid k.circle k.arc
 * k.arc3 k.ellipse k.curve k.fn k.polar k.smooth k.angle k.right k.dim k.hatch k.head k.tick k.wire
 * k.project. Geometry helpers in k.g, projection matrices in k.proj (HYPER-CORE/js/projection.js).
 * Coordinates are mathematical (y upwards); the renderer flips them.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const C = H.construct = {};
  const PI = Math.PI, TAU = 2 * Math.PI;
  const sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, abs = Math.abs, atan2 = Math.atan2;

  /* ------------------------------------------------------------------ registry */
  H.constructions = H.constructions || new Map();
  H.constructionOrder = H.constructionOrder || [];
  H.construction = function (def) {
    if (!def || typeof def.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(def.id)) throw new Error('Hyper.construction: an id (lowercase-with-dashes) is required, got ' + JSON.stringify(def && def.id));
    if (typeof def.build !== 'function') throw new Error('Hyper.construction ' + def.id + ': build(k) is required');
    if (H.constructions.has(def.id)) { (H.errors = H.errors || []).push('Duplicate construction id: ' + def.id); return def; }
    if (!def.title) (H.errors = H.errors || []).push('construction ' + def.id + ': missing title');
    def.tags = def.tags || [];
    H.constructions.set(def.id, def);
    H.constructionOrder.push(def.id);
    return def;
  };

  C.TOOLS = {
    given: { name: 'Given', hint: 'What you start from: the data of the problem, the views you were handed, the station point.' },
    straightedge: { name: 'Straightedge', hint: 'A line through two known points (or along an edge). It has no marks.' },
    tee: { name: 'T-square', hint: 'A horizontal line across the sheet; with a set square against it, a vertical.' },
    square: { name: 'Set square', hint: 'A perpendicular or a parallel through a point; a 30°, 45° or 60° line.' },
    compass: { name: 'Compass', hint: 'A circle or an arc about a known centre, with a radius taken between two known points.' },
    dividers: { name: 'Dividers', hint: 'Carry a length from one place to another, or step off equal lengths along a line or a circle.' },
    ruler: { name: 'Scale', hint: 'Measure or lay off a stated length.' },
    protractor: { name: 'Protractor', hint: 'Lay off a stated angle.' },
    pencil: { name: 'Pencil', hint: 'Draw the curve through the points found, with a French curve or a steady hand; shade; letter.' },
    fold: { name: 'Fold', hint: 'A crease of the paper: fold a drawing about a line (unfolding a surface, rabatting a plane).' },
    thread: { name: 'Thread', hint: 'A stretched thread or sight line, as in Dürer\'s drawing devices.' },
    note: { name: 'Note', hint: 'An explanation drawn on the figure: labels, arrows, shading.' }
  };
  C.ICON = {
    given: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8M12 8v8"/></svg>',
    straightedge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 17 17 3l4 4L7 21z"/><path d="M8 12l2 2M11 9l2 2M14 6l2 2"/></svg>',
    tee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 5h18M12 5v15M9 8h6"/></svg>',
    square: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 20V4l16 16z"/><path d="M8 16v-6l6 6z"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 3v3M8 21l4-13 4 13"/><circle cx="12" cy="7.5" r="1.6"/><path d="M6 15.5a8 8 0 0 0 12 0"/></svg>',
    dividers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 3v3M7 21l5-13 5 13"/><circle cx="12" cy="7.5" r="1.6"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="9" width="18" height="6" rx="1"/><path d="M7 9v3M11 9v2M15 9v3M19 9v2"/></svg>',
    protractor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 16a9 9 0 0 1 18 0zM3 16h18M12 16V7M7 16l1.5-5M17 16l-1.5-5"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/></svg>',
    fold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6" /><path d="M4 20 14 10" stroke-dasharray="2 2"/></svg>',
    thread: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 18 21 6"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/><circle cx="21" cy="6" r="1.5" fill="currentColor"/><path d="M8 4v16" stroke-dasharray="2 2"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>'
  };
  C.icon = tool => '<span class="cxicon">' + (C.ICON[tool] || C.ICON.note) + '</span>';

  /* ------------------------------------------------------------------ geometry (plane) */
  const g = {};
  g.pt = (x, y) => ({ x, y });
  g.add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  g.sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  g.mul = (a, s) => ({ x: a.x * s, y: a.y * s });
  g.dot = (a, b) => a.x * b.x + a.y * b.y;
  g.cross = (a, b) => a.x * b.y - a.y * b.x;
  g.len = a => sqrt(a.x * a.x + a.y * a.y);
  g.dist = (a, b) => sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  g.unit = a => { const l = g.len(a) || 1; return { x: a.x / l, y: a.y / l }; };
  g.perp = a => ({ x: -a.y, y: a.x });
  g.rot = (a, t) => ({ x: a.x * cos(t) - a.y * sin(t), y: a.x * sin(t) + a.y * cos(t) });
  g.rotAbout = (p, c, t) => g.add(c, g.rot(g.sub(p, c), t));
  g.mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  g.lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  g.polar = (c, r, t) => ({ x: c.x + r * cos(t), y: c.y + r * sin(t) });
  g.angleOf = v => atan2(v.y, v.x);
  g.angle = (a, v, b) => { let t = g.angleOf(g.sub(b, v)) - g.angleOf(g.sub(a, v)); while (t > PI) t -= TAU; while (t <= -PI) t += TAU; return t; };
  g.dir = t => ({ x: cos(t), y: sin(t) });
  g.along = (a, b, d) => g.add(a, g.mul(g.unit(g.sub(b, a)), d));
  g.lineLine = (a, b, c, d) => { const r = g.sub(b, a), s = g.sub(d, c), den = g.cross(r, s); if (abs(den) < 1e-12) return null; const t = g.cross(g.sub(c, a), s) / den; return g.add(a, g.mul(r, t)); };
  g.segSeg = (a, b, c, d) => { const r = g.sub(b, a), s = g.sub(d, c), den = g.cross(r, s); if (abs(den) < 1e-12) return null; const t = g.cross(g.sub(c, a), s) / den, u = g.cross(g.sub(c, a), r) / den; return (t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9) ? g.add(a, g.mul(r, t)) : null; };
  g.foot = (p, a, b) => { const d = g.sub(b, a), t = g.dot(g.sub(p, a), d) / (g.dot(d, d) || 1); return g.add(a, g.mul(d, t)); };
  g.reflect = (p, a, b) => { const f = g.foot(p, a, b); return g.add(f, g.sub(f, p)); };
  g.lineCircle = (a, b, c, r) => { const d = g.unit(g.sub(b, a)), f = g.sub(a, c); const B = g.dot(f, d), D = B * B - (g.dot(f, f) - r * r); if (D < -1e-9) return []; const s = sqrt(Math.max(D, 0)); const p1 = g.add(a, g.mul(d, -B - s)), p2 = g.add(a, g.mul(d, -B + s)); return D <= 1e-9 ? [p1] : [p1, p2]; };
  g.circleCircle = (c1, r1, c2, r2) => { const d = g.dist(c1, c2); if (d < 1e-12 || d > r1 + r2 + 1e-9 || d < abs(r1 - r2) - 1e-9) return []; const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h2 = r1 * r1 - a * a, h = sqrt(Math.max(h2, 0)); const u = g.unit(g.sub(c2, c1)), m = g.add(c1, g.mul(u, a)), n = g.perp(u); if (h2 <= 1e-9) return [m]; return [g.add(m, g.mul(n, h)), g.sub(m, g.mul(n, h))]; };
  g.tangentPoints = (p, c, r) => { const d = g.dist(p, c); if (d <= r) return []; const m = g.mid(p, c); return g.circleCircle(m, d / 2, c, r); };
  g.circumcenter = (a, b, c) => { const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)); if (abs(d) < 1e-12) return null; const A = a.x * a.x + a.y * a.y, B = b.x * b.x + b.y * b.y, Cc = c.x * c.x + c.y * c.y; return { x: (A * (b.y - c.y) + B * (c.y - a.y) + Cc * (a.y - b.y)) / d, y: (A * (c.x - b.x) + B * (a.x - c.x) + Cc * (b.x - a.x)) / d }; };
  g.centroid = pts => { let x = 0, y = 0; pts.forEach(p => { x += p.x; y += p.y; }); return { x: x / pts.length, y: y / pts.length }; };
  g.onLine = (a, b, p, tol) => abs(g.cross(g.sub(b, a), g.sub(p, a))) / (g.dist(a, b) || 1) < (tol || 1e-6);
  g.parallelThrough = (p, a, b) => [p, g.add(p, g.sub(b, a))];
  g.perpThrough = (p, a, b) => [p, g.add(p, g.perp(g.sub(b, a)))];
  g.inversion = (p, c, k2) => { const v = g.sub(p, c), d2 = g.dot(v, v) || 1e-12; return g.add(c, g.mul(v, k2 / d2)); };
  g.closest = (p, pts) => pts.reduce((best, q) => (!best || g.dist(p, q) < g.dist(p, best)) ? q : best, null);
  g.frenet = (f, t, h) => { h = h || 1e-4; const a = f(t - h), b = f(t + h); const T = g.unit({ x: b[0] - a[0], y: b[1] - a[1] }); return { T, N: g.perp(T) }; };
  g.deg = d => d * PI / 180;
  g.rad = r => r * 180 / PI;
  /* the ellipse of the isometric circle: a circle of radius r in a plane whose two axes project with the given paper vectors */
  g.ellipseOfCircle = (c, r, u, v) => t => [c.x + r * (u.x * cos(t) + v.x * sin(t)), c.y + r * (u.y * cos(t) + v.y * sin(t))];
  C.g = g;

  /* a few curves writers reach for */
  const K = {};
  K.circle = (r, c) => t => [(c ? c.x : 0) + r * cos(t), (c ? c.y : 0) + r * sin(t)];
  K.ellipse = (a, b, c) => t => [(c ? c.x : 0) + a * cos(t), (c ? c.y : 0) + b * sin(t)];
  K.parabola = p => t => [t * t / (4 * p), t];
  K.hyperbola = (a, b) => t => [a * Math.cosh(t), b * Math.sinh(t)];
  K.sine = (A, w) => t => [t, A * sin(w * t)];
  K.catenary = a => t => [t, a * Math.cosh(t / a)];
  K.archimedes = a => t => [a * t * cos(t), a * t * sin(t)];
  K.involute = a => t => [a * (cos(t) + t * sin(t)), a * (sin(t) - t * cos(t))];
  C.curves = K;

  /* ------------------------------------------------------------------ the kit */
  const DIRS = { n: [0, 1], ne: [1, 1], e: [1, 0], se: [1, -1], s: [0, -1], sw: [-1, -1], w: [-1, 0], nw: [-1, 1], c: [0, 0] };

  function Kit(def) {
    this.def = def;
    this.steps = [];
    this.shapes = [];
    this.cur = null;
    this.opts = { pad: 0.07, fontScale: 1, frame: null };
    this.g = g;
    this.curves = K;
    this.proj = H.proj || null;
    this.PI = PI; this.TAU = TAU;
  }
  const kp = Kit.prototype;
  kp.ensureStep = function () { if (!this.cur) this.given('The figure'); };
  kp.given = function (text, fn) { return this.step('given', text, fn); };
  kp.step = function (tool, text, fn) {
    if (!C.TOOLS[tool]) throw new Error(this.def.id + ': unknown tool "' + tool + '" (' + Object.keys(C.TOOLS).join(', ') + ')');
    const s = { i: this.steps.length, tool, text: String(text || ''), shapes: [] };
    this.steps.push(s);
    this.cur = s;
    if (typeof fn === 'function') fn(this);
    return s;
  };
  kp.note = function (text, fn) { return this.step('note', text, fn); };
  kp.add = function (shape) {
    this.ensureStep();
    shape.step = this.cur.i;
    shape.i = this.shapes.length;
    if (!shape.o) shape.o = {};
    this.shapes.push(shape); this.cur.shapes.push(shape);
    return shape;
  };
  kp.frame = function (x0, y0, x1, y1) { this.opts.frame = [x0, y0, x1, y1]; return this; };
  kp.pad = function (f) { this.opts.pad = f; return this; };
  kp.fontScale = function (f) { this.opts.fontScale = f; return this; };

  kp.pt = (x, y) => ({ x, y });
  kp.P = function (x, y, label, o) { const p = { x, y }; if (label != null) this.point(p, label, o); else if (o) this.point(p, null, o); return p; };
  kp.point = function (p, label, o, lo) {
    o = typeof o === 'string' ? { at: o } : (o || {});
    if (lo && typeof lo === 'object') o.lo = Object.assign({}, o.lo || {}, lo);   // k.point(P, 'P', 'ne', { upright: true, size: 0.8 })
    chk(this, p, 'point');
    this.add({ t: 'point', p: { x: p.x, y: p.y }, o });
    if (label != null && label !== '') this.label(p, label, o.at || 'ne', o.lo || {});
    return p;
  };
  kp.dot = function (p, o) { return this.point(p, null, o); };
  kp.label = function (p, text, at, o) { o = o || {}; chk(this, p, 'label'); this.add({ t: 'label', p: { x: p.x, y: p.y }, text: String(text), at: at || 'ne', o }); return p; };
  kp.text = function (x, y, text, o) { o = o || {}; chk(this, { x, y }, 'text'); return this.add({ t: 'text', p: { x, y }, text: String(text), o }); };
  kp.seg = function (a, b, o) { chk(this, a, 'seg'); chk(this, b, 'seg'); return this.add({ t: 'seg', a: cp(a), b: cp(b), o: o || {} }); };
  kp.line = function (a, b, o) { chk(this, a, 'line'); chk(this, b, 'line'); return this.add({ t: 'line', a: cp(a), b: cp(b), o: o || {} }); };
  kp.ray = function (a, b, o) { chk(this, a, 'ray'); chk(this, b, 'ray'); return this.add({ t: 'ray', a: cp(a), b: cp(b), o: o || {} }); };
  kp.poly = function (pts, o) { pts.forEach(p => chk(this, p, 'poly')); return this.add({ t: 'poly', pts: pts.map(cp), o: o || {} }); };
  kp.rect = function (x0, y0, x1, y1, o) { return this.poly([{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }], Object.assign({ close: true }, o || {})); };
  kp.arrow = function (a, b, o) { chk(this, a, 'arrow'); chk(this, b, 'arrow'); return this.add({ t: 'seg', a: cp(a), b: cp(b), o: Object.assign({ arrow: 'end' }, o || {}) }); };
  kp.axes = function (origin, o) {
    o = o || {}; const O = origin || { x: 0, y: 0 };
    const x = o.x || [-100, 100], y = o.y || [-100, 100];
    const sx = this.add({ t: 'seg', a: { x: O.x + x[0], y: O.y }, b: { x: O.x + x[1], y: O.y }, o: { cls: o.cls || 'axis', arrow: o.arrows === false ? null : 'end' } });
    const sy = this.add({ t: 'seg', a: { x: O.x, y: O.y + y[0] }, b: { x: O.x, y: O.y + y[1] }, o: { cls: o.cls || 'axis', arrow: o.arrows === false ? null : 'end' } });
    if (o.labels !== false) { this.label({ x: O.x + x[1], y: O.y }, o.xl || 'x', 'se', { cls: 'axis' }); this.label({ x: O.x, y: O.y + y[1] }, o.yl || 'y', 'ne', { cls: 'axis' }); }
    if (o.origin) this.label(O, o.origin, o.originAt || 'sw');
    return [sx, sy];
  };
  /* graph paper: light lines every `step` inside the box */
  kp.grid = function (x0, y0, x1, y1, step, o) {
    o = Object.assign({ cls: 'aux' }, o || {});
    for (let x = x0; x <= x1 + 1e-9; x += step) this.add({ t: 'seg', a: { x, y: y0 }, b: { x, y: y1 }, o });
    for (let y = y0; y <= y1 + 1e-9; y += step) this.add({ t: 'seg', a: { x: x0, y }, b: { x: x1, y }, o });
  };
  kp.circle = function (c, r, o) { chk(this, c, 'circle'); chkn(this, r, 'circle radius'); return this.add({ t: 'circle', c: cp(c), r, o: o || {} }); };
  kp.arc = function (c, r, a0, a1, o) { chk(this, c, 'arc'); chkn(this, r, 'arc radius'); chkn(this, a0, 'arc a0'); chkn(this, a1, 'arc a1'); return this.add({ t: 'arc', c: cp(c), r, a0, a1, o: o || {} }); };
  kp.arc3 = function (c, p, q, o) { chk(this, c, 'arc3'); return this.arc(c, g.dist(c, p), g.angleOf(g.sub(p, c)), g.angleOf(g.sub(q, c)), o); };
  /* the arc from P to Q that passes through M (the circle through the three points, the short way round that contains M) */
  kp.arcThrough = function (p, m, q, o) {
    chk(this, p, 'arcThrough'); chk(this, m, 'arcThrough'); chk(this, q, 'arcThrough');
    const c = g.circumcenter(p, m, q);
    if (!c) return this.poly([p, m, q], o);
    const a0 = g.angleOf(g.sub(p, c)); let a1 = g.angleOf(g.sub(q, c)), am = g.angleOf(g.sub(m, c));
    while (a1 < a0) a1 += TAU; while (am < a0) am += TAU;
    return am <= a1 ? this.arc(c, g.dist(c, p), a0, a1, o) : this.arc(c, g.dist(c, p), a1, a0 + TAU, o);
  };
  kp.ellipse = function (c, a, b, o) { chk(this, c, 'ellipse'); o = o || {}; const rot = o.rotate || 0; return this.curve(t => { const x = a * cos(t), y = b * sin(t); return [c.x + x * cos(rot) - y * sin(rot), c.y + x * sin(rot) + y * cos(rot)]; }, [0, TAU], Object.assign({ n: 180 }, o)); };
  kp.curve = function (f, range, o) {
    o = o || {};
    let pts;
    if (Array.isArray(f)) pts = f.map(p => p == null ? null : (Array.isArray(p) ? p : [p.x, p.y]));
    else { const t0 = range ? range[0] : 0, t1 = range ? range[1] : 1, n = o.n || 400; pts = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; const p = f(t); pts.push(p ? (Array.isArray(p) ? p : [p.x, p.y]) : null); } }
    pts.forEach((p, i) => { if (p && !(isFinite(p[0]) && isFinite(p[1]))) pts[i] = null; });
    const s = this.add({ t: 'curve', pts, o, f: typeof f === 'function' ? f : null, range });
    if (o.arrow != null && typeof f === 'function') { const ts = Array.isArray(o.arrow) ? o.arrow : [o.arrow]; ts.forEach(t => { const p = f(t), fr = g.frenet(f, t); if (p) this.add({ t: 'head', p: { x: p[0], y: p[1] }, d: o.cw ? g.mul(fr.T, -1) : fr.T, o: { cls: o.cls } }); }); }
    return s;
  };
  kp.fn = function (f, range, o) { return this.curve(x => [x, f(x)], range, o); };
  kp.polar = function (f, range, o) { return this.curve(t => { const r = f(t); return r == null || !isFinite(r) ? null : [r * cos(t), r * sin(t)]; }, range, o); };
  kp.smooth = function (ctrl, o) {
    o = o || {}; const Pp = ctrl.map(p => Array.isArray(p) ? { x: p[0], y: p[1] } : p);
    if (Pp.length < 2) throw new Error(this.def.id + ': smooth needs 2 points or more');
    const seg = o.n || 24, pts = [];
    for (let i = 0; i < Pp.length - 1; i++) {
      const p0 = Pp[Math.max(0, i - 1)], p1 = Pp[i], p2 = Pp[i + 1], p3 = Pp[Math.min(Pp.length - 1, i + 2)];
      for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t;
        pts.push([0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)]); }
    }
    pts.push([Pp[Pp.length - 1].x, Pp[Pp.length - 1].y]);
    return this.curve(pts, null, o);
  };
  kp.angle = function (v, a, b, o) {
    o = o || {}; chk(this, v, 'angle'); chk(this, a, 'angle'); chk(this, b, 'angle');
    if (o.cw) { const t = a; a = b; b = t; }                   // the mark swept clockwise from VA to VB (bearings)
    const a0 = g.angleOf(g.sub(a, v)); let a1 = g.angleOf(g.sub(b, v)); while (a1 < a0) a1 += TAU;
    if (o.right) return this.add({ t: 'rightangle', v: cp(v), a: cp(a), b: cp(b), o });
    return this.add({ t: 'anglemark', v: cp(v), a0, a1, o });
  };
  kp.right = function (v, a, b, o) { return this.angle(v, a, b, Object.assign({ right: true }, o || {})); };
  kp.dim = function (a, b, text, o) { o = o || {}; chk(this, a, 'dim'); chk(this, b, 'dim'); return this.add({ t: 'dim', a: cp(a), b: cp(b), text: String(text), o }); };
  kp.hatch = function (pts, o) { pts.forEach(p => chk(this, p, 'hatch')); return this.add({ t: 'hatch', pts: pts.map(cp), o: o || {} }); };
  kp.head = function (p, dir, o) { chk(this, p, 'head'); return this.add({ t: 'head', p: cp(p), d: g.unit(dir), o: o || {} }); };
  kp.tick = function (p, dir, o) { chk(this, p, 'tick'); return this.add({ t: 'tick', p: cp(p), d: g.unit(dir), o: o || {} }); };
  kp.target = function (shape) { shape.o.target = true; return shape; };

  /* 3-D helpers: project points [x, y, z] with a 4×4 matrix (kit.proj) to paper points {x, y}, scaled and placed */
  kp.project = function (M, pts3, o) {
    o = o || {}; const s = o.scale == null ? 100 : o.scale, ox = o.origin ? o.origin.x : 0, oy = o.origin ? o.origin.y : 0;
    if (!this.proj) throw new Error('k.project needs HYPER-CORE/js/projection.js');
    return pts3.map(p => { const q = this.proj.mat4.point(M, p); return q ? { x: ox + s * q[0], y: oy + s * q[1], z: q[2] } : null; });
  };
  /* a wireframe model (kit.proj.models) under a projection: visible edges full, hidden ones dashed (or omitted) */
  kp.wire = function (M, model, o) {
    o = o || {}; const pp = this.project(M, model.pts, o);
    const ev = this.proj.edgesWithVisibility(M, model);
    const shown = [];
    for (const e of ev) {
      const a = pp[e.a], b = pp[e.b]; if (!a || !b) continue;
      if (!e.visible && o.hidden === 'none') continue;
      shown.push(this.seg(a, b, Object.assign({ cls: o.cls || 'given' }, e.visible ? (o.visibleOpts || {}) : Object.assign({ dash: true, cls: 'cons' }, o.hiddenOpts || {}))));
    }
    return { points: pp, segs: shown };
  };

  function cp(p) { return { x: p.x, y: p.y }; }
  function chk(k, p, what) { if (!p || typeof p.x !== 'number' || typeof p.y !== 'number' || !isFinite(p.x) || !isFinite(p.y)) throw new Error(k.def.id + ': bad point in ' + what + ' (' + (p && JSON.stringify(p)) + ')'); }
  function chkn(k, n, what) { if (typeof n !== 'number' || !isFinite(n)) throw new Error(k.def.id + ': bad number in ' + what + ' (' + n + ')'); }

  /* ------------------------------------------------------------------ building a scene */
  C.build = function (def) {
    if (typeof def === 'string') def = H.constructions.get(def);
    if (!def) throw new Error('no such construction');
    const k = new Kit(def);
    def.build(k);
    if (!k.shapes.length) throw new Error(def.id + ': the construction draws nothing');
    const bounds = computeBounds(k);
    return { def, steps: k.steps, shapes: k.shapes, bounds, opts: k.opts };
  };
  function computeBounds(k) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const ext = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
    const extP = p => ext(p.x, p.y);
    k.shapes.forEach(s => {
      if (s.o && s.o.nobounds) return;
      switch (s.t) {
        case 'point': case 'label': case 'text': case 'head': case 'tick': extP(s.p); break;
        case 'seg': case 'dim': extP(s.a); extP(s.b); break;
        case 'ray': extP(s.a); break;
        case 'line': break;
        case 'poly': case 'hatch': s.pts.forEach(extP); break;
        case 'circle': ext(s.c.x - s.r, s.c.y - s.r); ext(s.c.x + s.r, s.c.y + s.r); break;
        case 'arc': { extP(g.polar(s.c, s.r, s.a0)); extP(g.polar(s.c, s.r, s.a1)); for (let q = 0; q < 4; q++) { const t = q * PI / 2; let a = t; while (a < s.a0) a += TAU; if (a <= s.a1) extP(g.polar(s.c, s.r, t)); } break; }
        case 'curve': s.pts.forEach(p => { if (p) ext(p[0], p[1]); }); break;
        case 'anglemark': case 'rightangle': extP(s.v); break;
      }
    });
    if (k.opts.frame) { const f = k.opts.frame; x0 = f[0]; y0 = f[1]; x1 = f[2]; y1 = f[3]; }
    if (!isFinite(x0)) { x0 = -100; y0 = -100; x1 = 100; y1 = 100; }
    if (x1 - x0 < 1e-6) { x0 -= 50; x1 += 50; }
    if (y1 - y0 < 1e-6) { y0 -= 50; y1 += 50; }
    const w = x1 - x0, h = y1 - y0, S = Math.max(w, h), pad = S * k.opts.pad;
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad, S: S + 2 * pad };
  }

  /* ------------------------------------------------------------------ SVG */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const f2 = n => (Math.round(n * 100) / 100).toString();
  const COLORS = { given: '#1b1b1b', cons: '#4b4b4b', aux: '#9a9a9a', axis: '#1b1b1b', curve: '#0b4fa0', result: '#0b4fa0', thick: '#1b1b1b', hatchline: '#2a2a2a', red: '#b03a2e', green: '#2d7a3a' };
  C.COLORS = COLORS;
  C.STYLE = 'svg.cx{font-family:"Times New Roman",Times,"Liberation Serif",serif;background:#fff}svg.cx .ink{fill:none;stroke-linecap:round;stroke-linejoin:round}svg.cx .lbl{stroke:none}';

  C.svg = function (sceneOrDef, opts) {
    opts = opts || {};
    const sc = sceneOrDef.shapes ? sceneOrDef : C.build(sceneOrDef);
    const def = sc.def, B = sc.bounds, S = B.S;
    const W = B.x1 - B.x0, Hh = B.y1 - B.y0;
    const fs = S * 0.034 * (sc.opts.fontScale || 1);
    const lw = { given: S * 0.0036, cons: S * 0.0022, aux: S * 0.0016, axis: S * 0.003, curve: S * 0.0056, result: S * 0.0056, thick: S * 0.0062, hatchline: S * 0.0028, red: S * 0.0036, green: S * 0.0036 };
    const rPt = S * 0.0065;
    const upTo = opts.upTo == null ? Infinity : opts.upTo;
    const X = x => f2(x - B.x0), Y = y => f2(B.y1 - y);
    const stepGroups = new Map();
    const out = (step, s) => { if (!stepGroups.has(step)) stepGroups.set(step, []); stepGroups.get(step).push(s); };
    const clsName = s => s.o.cls || (s.t === 'curve' ? 'curve' : 'given');
    const widthOf = s => (s.o.width != null ? s.o.width : (lw[clsName(s)] || lw.given)) * (s.o.w || 1);
    const attrs = s => {
      const cls = clsName(s);
      let st = 'stroke-width:' + f2(widthOf(s)) + ';fill:' + (s.o.fill || 'none') + ';stroke:' + (s.o.stroke || COLORS[cls] || '#1b1b1b') + ';stroke-linecap:round;stroke-linejoin:round';
      if (s.o.opacity != null) st += ';opacity:' + s.o.opacity;
      if (s.o.dash) st += ';stroke-dasharray:' + (typeof s.o.dash === 'string' ? s.o.dash : f2(S * 0.012) + ' ' + f2(S * 0.008));
      if (s.o.dotted) st += ';stroke-dasharray:' + f2(S * 0.002) + ' ' + f2(S * 0.009);
      return ' class="ink ' + cls + '" style="' + st + '"' + (s.o.target ? ' data-target="1"' : '') + (s.o.id ? ' id="' + esc(s.o.id) + '"' : '');
    };
    const head = (p, d, size, cls, step, stroke) => {
      const L = size, Wd = size * 0.42, base = g.sub(p, g.mul(d, L)), n = g.perp(d), l = g.add(base, g.mul(n, Wd)), r = g.sub(base, g.mul(n, Wd));
      out(step, '<path class="head" style="stroke:none;fill:' + (stroke || COLORS[cls] || '#1b1b1b') + '" d="M' + X(p.x) + ' ' + Y(p.y) + 'L' + X(l.x) + ' ' + Y(l.y) + 'L' + X(r.x) + ' ' + Y(r.y) + 'Z"/>');
    };
    const clipLine = (a, b) => {
      const d = g.sub(b, a); let t0 = -Infinity, t1 = Infinity;
      const tests = [[-d.x, a.x - B.x0], [d.x, B.x1 - a.x], [-d.y, a.y - B.y0], [d.y, B.y1 - a.y]];
      for (const [p, q] of tests) { if (abs(p) < 1e-12) { if (q < 0) return null; continue; } const t = q / p; if (p < 0) { if (t > t0) t0 = t; } else { if (t < t1) t1 = t; } }
      if (t0 > t1) return null;
      return [g.add(a, g.mul(d, t0)), g.add(a, g.mul(d, t1))];
    };
    const pathOfPts = pts => {
      let d = '', pen = false, prev = null; const lens = [];
      for (let i = 1; i < pts.length; i++) if (pts[i] && pts[i - 1]) lens.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      lens.sort((a, b) => a - b); const med = lens.length ? lens[lens.length >> 1] : S; const jump = Math.max(med * 40, S * 0.5);
      const inBox = p => p[0] > B.x0 - S * 2 && p[0] < B.x1 + S * 2 && p[1] > B.y0 - S * 2 && p[1] < B.y1 + S * 2;
      for (const p of pts) { if (!p || !inBox(p)) { pen = false; prev = null; continue; } if (prev && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > jump) pen = false; d += (pen ? 'L' : 'M') + X(p[0]) + ' ' + Y(p[1]); pen = true; prev = p; }
      return d;
    };
    const textEl = (p, text, o, cls, step, anchor, baseline) => {
      const size = fs * (o.size || 1);
      out(step, '<text class="lbl' + (cls ? ' ' + cls : '') + '" x="' + X(p.x) + '" y="' + Y(p.y) + '" font-size="' + f2(size) + '" text-anchor="' + anchor + '" dominant-baseline="' + baseline + '"' + (o.rotate ? ' transform="rotate(' + f2(-o.rotate) + ' ' + X(p.x) + ' ' + Y(p.y) + ')"' : '') + (o.bold ? ' font-weight="bold"' : '') + ' style="fill:' + (o.fill || o.stroke || (cls && COLORS[cls] && cls !== 'given' && cls !== 'axis' ? COLORS[cls] : '#1b1b1b')) + ';stroke:none;font-family:Times New Roman,Times,serif;font-style:' + ((o.upright || cls === 'axis') ? 'normal' : 'italic') + (o.bg ? ';paint-order:stroke;stroke:#fff;stroke-width:' + f2(size * 0.35) + ';stroke-linejoin:round' : '') + '">' + richText(text) + '</text>');
    };
    sc.shapes.forEach(s => {
      if (s.step > upTo) return;
      const step = s.step, o = s.o;
      switch (s.t) {
        case 'seg': { const a = s.a, b = s.b; out(step, '<path' + attrs(s) + ' d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>');
          const d = g.unit(g.sub(b, a)), hs = fs * 0.55 * (o.headSize || 1);
          if (o.arrow === 'end' || o.arrow === 'both' || o.arrow === true) head(b, d, hs, clsName(s), step, o.stroke);
          if (o.arrow === 'start' || o.arrow === 'both') head(a, g.mul(d, -1), hs, clsName(s), step, o.stroke);
          break; }
        case 'line': { const c = clipLine(s.a, s.b); if (c) out(step, '<path' + attrs(s) + ' d="M' + X(c[0].x) + ' ' + Y(c[0].y) + 'L' + X(c[1].x) + ' ' + Y(c[1].y) + '"/>'); break; }
        case 'ray': { const far = g.add(s.a, g.mul(g.unit(g.sub(s.b, s.a)), S * 10)); const c = clipLine(s.a, far);
          if (c) { const end = g.dot(g.sub(c[1], s.a), g.sub(s.b, s.a)) > 0 ? c[1] : c[0]; out(step, '<path' + attrs(s) + ' d="M' + X(s.a.x) + ' ' + Y(s.a.y) + 'L' + X(end.x) + ' ' + Y(end.y) + '"/>'); if (o.arrow) head(end, g.unit(g.sub(s.b, s.a)), fs * 0.55, clsName(s), step, o.stroke); }
          break; }
        case 'poly': { let d = s.pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ' ' + Y(p.y)).join(''); if (o.close) d += 'Z'; out(step, '<path' + attrs(s) + ' d="' + d + '"/>'); break; }
        case 'circle': {
          out(step, '<circle' + attrs(s) + ' cx="' + X(s.c.x) + '" cy="' + Y(s.c.y) + '" r="' + f2(s.r) + '"/>');
          if (o.hatch) { const n = Math.max(24, Math.round(TAU * s.r / (S * 0.022))), L = S * 0.03 * (o.hatchLen || 1), side = o.hatch === 'in' ? -1 : 1; let d = '';
            for (let i = 0; i < n; i++) { const t = TAU * i / n; const p = g.polar(s.c, s.r, t); const q = g.add(p, g.mul(g.rot(g.dir(t), side * 0.6), side * L)); d += 'M' + X(p.x) + ' ' + Y(p.y) + 'L' + X(q.x) + ' ' + Y(q.y); }
            out(step, '<path class="ink hatchline" style="fill:none;stroke:#2a2a2a;stroke-width:' + f2(lw.hatchline) + '" d="' + d + '"/>'); }
          if (o.arrow != null) { const ts = Array.isArray(o.arrow) ? o.arrow : [o.arrow]; ts.forEach(t => head(g.polar(s.c, s.r, t), g.rot(g.dir(t), o.cw ? -PI / 2 : PI / 2), fs * 0.55, clsName(s), step, o.stroke)); }
          if (o.label != null) textEl(g.polar(s.c, s.r + fs * 0.9, o.labelAt != null ? o.labelAt : PI / 4), o.label, o, o.cls, step, 'middle', 'middle');
          break; }
        case 'arc': {
          let a0 = s.a0, a1 = s.a1; if (o.cw) { const t = a0; a0 = a1; a1 = t; }
          while (a1 < a0) a1 += TAU; if (a1 - a0 >= TAU - 1e-9) a1 = a0 + TAU - 1e-4;
          const p0 = g.polar(s.c, s.r, a0), p1 = g.polar(s.c, s.r, a1), large = (a1 - a0) > PI ? 1 : 0;
          out(step, '<path' + attrs(s) + ' d="M' + X(p0.x) + ' ' + Y(p0.y) + 'A' + f2(s.r) + ' ' + f2(s.r) + ' 0 ' + large + ' 0 ' + X(p1.x) + ' ' + Y(p1.y) + '"/>');
          if (o.arrow) { const end = o.cw ? s.a1 : a1; head(g.polar(s.c, s.r, end), g.rot(g.dir(end), o.cw ? -PI / 2 : PI / 2), fs * 0.55, clsName(s), step, o.stroke); }
          break; }
        case 'curve': { const d = pathOfPts(s.pts); if (d) out(step, '<path' + attrs(s) + ' d="' + d + '"/>'); break; }
        case 'point': { const r = rPt * (o.r || 1);
          out(step, '<circle class="pt' + (o.cls ? ' ' + o.cls : '') + (o.open ? ' open' : '') + '" style="' + (o.open ? 'fill:#fff;stroke:' + (o.stroke || '#1b1b1b') + ';stroke-width:' + f2(lw.cons) : 'fill:' + (o.fill || o.stroke || (COLORS[o.cls] && o.cls !== 'given' ? COLORS[o.cls] : '#1b1b1b')) + ';stroke:none') + '" cx="' + X(s.p.x) + '" cy="' + Y(s.p.y) + '" r="' + f2(r) + '"/>');
          break; }
        case 'label': {
          const dv = DIRS[s.at] || DIRS.ne, off = fs * 0.62 * (o.dist || 1);
          const p = { x: s.p.x + dv[0] * off * (dv[1] ? 0.85 : 1), y: s.p.y + dv[1] * off };
          textEl(p, s.text, o, o.cls, step, dv[0] > 0 ? 'start' : dv[0] < 0 ? 'end' : 'middle', dv[1] > 0 ? 'auto' : dv[1] < 0 ? 'hanging' : 'middle'); break; }
        case 'text': textEl(s.p, s.text, o, o.cls, step, o.anchor || 'middle', o.baseline || 'middle'); break;
        case 'head': head(s.p, s.d, fs * 0.6 * (o.size || 1), o.cls, step, o.stroke); break;
        case 'tick': { const n = g.perp(s.d), L = fs * 0.35 * (o.size || 1); const a = g.add(s.p, g.mul(n, L)), b = g.sub(s.p, g.mul(n, L));
          out(step, '<path class="ink" style="fill:none;stroke:' + (o.stroke || COLORS[o.cls || 'given'] || '#1b1b1b') + ';stroke-width:' + f2(lw.cons) + '" d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>'); break; }
        case 'anglemark': {
          const r = fs * 0.9 * (o.r || 1), n = o.n || 1;
          for (let j = 0; j < n; j++) { const rr = r + j * fs * 0.22; const p0 = g.polar(s.v, rr, s.a0), p1 = g.polar(s.v, rr, s.a1), large = (s.a1 - s.a0) > PI ? 1 : 0;
            out(step, '<path class="ink" style="fill:none;stroke:' + (o.stroke || COLORS[o.cls || 'cons']) + ';stroke-width:' + f2(lw.cons) + '" d="M' + X(p0.x) + ' ' + Y(p0.y) + 'A' + f2(rr) + ' ' + f2(rr) + ' 0 ' + large + ' 0 ' + X(p1.x) + ' ' + Y(p1.y) + '"/>'); }
          if (o.arrow) head(g.polar(s.v, r, s.a1), g.rot(g.dir(s.a1), PI / 2), fs * 0.45, o.cls || 'cons', step, o.stroke);
          if (o.label != null) { const m = (s.a0 + s.a1) / 2; textEl(g.polar(s.v, r + fs * 0.75 * (o.labelDist || 1), m), o.label, o, o.cls, step, 'middle', 'middle'); }
          break; }
        case 'rightangle': {
          const L = fs * 0.55 * (o.r || 1), da = g.unit(g.sub(s.a, s.v)), db = g.unit(g.sub(s.b, s.v));
          const p1 = g.add(s.v, g.mul(da, L)), p2 = g.add(g.add(s.v, g.mul(da, L)), g.mul(db, L)), p3 = g.add(s.v, g.mul(db, L));
          out(step, '<path class="ink" style="fill:none;stroke:' + (o.stroke || COLORS[o.cls || 'cons']) + ';stroke-width:' + f2(lw.cons) + '" d="M' + X(p1.x) + ' ' + Y(p1.y) + 'L' + X(p2.x) + ' ' + Y(p2.y) + 'L' + X(p3.x) + ' ' + Y(p3.y) + '"/>'); break; }
        case 'dim': {
          const m = g.mid(s.a, s.b), u = g.unit(g.sub(s.b, s.a)), n = g.perp(u), side = o.side === 'right' ? -1 : 1;
          if (o.line) {
            // a drawing-office dimension: extension lines from the points, a dimension line with arrowheads, the text above it
            const off = side * fs * 1.1 * (o.dist || 1), A = g.add(s.a, g.mul(n, off)), Bq = g.add(s.b, g.mul(n, off)), ext = fs * 0.25;
            const col = o.stroke || COLORS[o.cls || 'cons'] || '#4b4b4b', wd = f2(lw.cons);
            [[s.a, A], [s.b, Bq]].forEach(([q, r]) => { const r2 = g.add(r, g.mul(n, Math.sign(off) * ext)), q2 = g.add(q, g.mul(n, Math.sign(off) * ext * 0.4)); out(step, '<path class="ink" style="fill:none;stroke:' + col + ';stroke-width:' + wd + '" d="M' + X(q2.x) + ' ' + Y(q2.y) + 'L' + X(r2.x) + ' ' + Y(r2.y) + '"/>'); });
            out(step, '<path class="ink" style="fill:none;stroke:' + col + ';stroke-width:' + wd + '" d="M' + X(A.x) + ' ' + Y(A.y) + 'L' + X(Bq.x) + ' ' + Y(Bq.y) + '"/>');
            head(Bq, u, fs * 0.5, o.cls || 'cons', step, col); head(A, g.mul(u, -1), fs * 0.5, o.cls || 'cons', step, col);
            textEl(g.add(g.mid(A, Bq), g.mul(n, Math.sign(off) * fs * 0.55)), s.text, Object.assign({ upright: true, size: 0.85 }, o), o.cls, step, 'middle', 'middle');
            break;
          }
          const p = g.add(m, g.mul(n, side * fs * 0.6 * (o.dist || 1)));
          if (o.ticks) { [s.a, s.b].forEach(q => { const a = g.add(q, g.mul(n, fs * 0.3)), b = g.sub(q, g.mul(n, fs * 0.3)); out(step, '<path class="ink" style="fill:none;stroke:#4b4b4b;stroke-width:' + f2(lw.cons) + '" d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>'); }); }
          textEl(p, s.text, o, o.cls, step, 'middle', 'middle'); break; }
        case 'hatch': {
          const ang = o.angle != null ? o.angle : PI / 4, gap = S * 0.016 * (o.gap || 1);
          const u = g.dir(ang), n = g.perp(u), pts = s.pts; let lo = Infinity, hi = -Infinity, slo = Infinity, shi = -Infinity;
          pts.forEach(p => { const d = g.dot(p, n), e = g.dot(p, u); if (d < lo) lo = d; if (d > hi) hi = d; if (e < slo) slo = e; if (e > shi) shi = e; });
          let d = '';
          for (let c = lo + gap / 2; c < hi; c += gap) {
            const A = g.add(g.mul(n, c), g.mul(u, slo - 1)), Bp = g.add(g.mul(n, c), g.mul(u, shi + 1)); const xs = [];
            for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; const r = g.segSeg(A, Bp, p, q); if (r) xs.push(g.dot(r, u)); }
            xs.sort((a, b) => a - b);
            for (let i = 0; i + 1 < xs.length; i += 2) { if (xs[i + 1] - xs[i] < 1e-9) continue; const p = g.add(g.mul(n, c), g.mul(u, xs[i])), q = g.add(g.mul(n, c), g.mul(u, xs[i + 1])); d += 'M' + X(p.x) + ' ' + Y(p.y) + 'L' + X(q.x) + ' ' + Y(q.y); }
          }
          const poly = pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ' ' + Y(p.y)).join('') + 'Z';
          if (o.fill) out(step, '<path class="fill" style="fill:' + o.fill + ';stroke:none" d="' + poly + '"/>');
          out(step, '<path class="ink hatchline" style="fill:none;stroke-width:' + f2(lw.hatchline * (o.w || 1)) + ';stroke:' + (o.stroke || '#2a2a2a') + '" d="' + d + '"/>');
          if (o.outline) out(step, '<path class="ink" style="fill:none;stroke:#1b1b1b;stroke-width:' + f2(lw.cons) + '" d="' + poly + '"/>');
          break; }
      }
    });
    const size = opts.size || 480, w = size, h = Math.round(size * Hh / W);
    let s = '';
    if (opts.standalone) s += '<?xml version="1.0" encoding="UTF-8"?>\n';
    s += '<svg xmlns="http://www.w3.org/2000/svg" class="cx" viewBox="0 0 ' + f2(W) + ' ' + f2(Hh) + '"' + (opts.noSize ? '' : ' width="' + w + '" height="' + h + '"') + ' data-construction="' + esc(def.id) + '">\n';
    if (opts.standalone) { s += '<title>' + esc(def.title || def.id) + '</title>\n<desc>' + esc('A construction from Hyper Projections: ' + (def.title || def.id) + '. Steps: ' + sc.steps.map(st => C.TOOLS[st.tool].name + ' — ' + st.text).join(' ')) + '</desc>\n<style>' + C.STYLE + '</style>\n'; }
    s += '<rect width="100%" height="100%" fill="#fff"/>\n';
    sc.steps.forEach(st => { if (st.i > upTo) return; const items = stepGroups.get(st.i) || []; s += '<g class="step" data-step="' + st.i + '" data-tool="' + esc(st.tool) + '">\n' + items.join('\n') + '\n</g>\n'; });
    s += '</svg>\n';
    return s;
  };

  /* P_1, P', x^2, \bar{A} → tspans; Greek letters are typed as they are */
  function richText(t) {
    let s = esc(t).replace(/\\bar\{([^}]*)\}/g, (m, a) => a + '̄');
    s = s.replace(/_\{([^}]*)\}|_(\S)/g, (m, a, b) => '<tspan baseline-shift="sub" font-size="70%">' + (a != null ? a : b) + '</tspan>');
    s = s.replace(/\^\{([^}]*)\}|\^(\S)/g, (m, a, b) => '<tspan baseline-shift="super" font-size="70%">' + (a != null ? a : b) + '</tspan>');
    return s;
  }
  C.richText = richText;

  /* ------------------------------------------------------------------ practice targets */
  C.TARGET_TOOLS = ['straightedge', 'tee', 'square', 'compass', 'dividers', 'ruler', 'protractor', 'pencil', 'thread'];
  C.targets = function (scene) {
    const T = [];
    scene.steps.forEach(st => {
      const wanted = C.TARGET_TOOLS.includes(st.tool);
      st.shapes.forEach(s => {
        if (s.o && s.o.target === false) return;
        if (!(wanted || (s.o && s.o.target))) return;
        if (s.o && (s.o.cls === 'aux' || s.o.cls === 'axis')) return;
        if (s.t === 'seg' || s.t === 'line' || s.t === 'ray') T.push({ step: st.i, tool: st.tool, t: 'line', a: s.a, b: s.b, kind: s.t });
        else if (s.t === 'poly') { const n = s.pts.length; for (let i = 0; i + 1 < n + (s.o && s.o.close ? 1 : 0); i++) T.push({ step: st.i, tool: st.tool, t: 'line', a: s.pts[i], b: s.pts[(i + 1) % n], kind: 'seg' }); }
        else if (s.t === 'circle') T.push({ step: st.i, tool: st.tool, t: 'circle', c: s.c, r: s.r });
        else if (s.t === 'arc') T.push({ step: st.i, tool: st.tool, t: 'circle', c: s.c, r: s.r, a0: s.a0, a1: s.a1 });
        else if (s.t === 'point') T.push({ step: st.i, tool: st.tool, t: 'point', p: s.p });
        else if (s.t === 'curve') T.push({ step: st.i, tool: st.tool, t: 'curve', pts: s.pts.filter(Boolean) });
      });
    });
    return T;
  };
  /* a summary for catalogs and galleries */
  C.summary = function (def) {
    const sc = C.build(def);
    const tools = [...new Set(sc.steps.map(s => s.tool))];
    return { id: def.id, title: def.title, steps: sc.steps.length, tools, practice: C.targets(sc).length > 0, shapes: sc.shapes.length };
  };
})(typeof window !== 'undefined' ? window : globalThis);
