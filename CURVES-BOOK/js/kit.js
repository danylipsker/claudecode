/* Curves Workshop · js/kit.js
 *
 * The drawing kit every figure of the book is rebuilt with, and the SVG renderer.
 * Runs in the browser (window.Curves) and in node (globalThis.Curves, see tools/load.js).
 *
 * A figure is registered with Curves.figure({...}) and drawn by its build(k) function,
 * which describes the construction as a sequence of steps, each made with one tool:
 *
 *   k.given('The fixed circle of radius a', () => { ... })
 *   k.step('compass', 'Draw the rolling circle', () => { ... })
 *   k.step('pencil', 'Trace the curve through the points', () => { ... })
 *
 * Inside a step the shapes are created with k.seg, k.line, k.circle, k.arc, k.curve,
 * k.point, k.label, k.angle, k.axes ... (see AUTHORING.md). Coordinates are ordinary
 * mathematical coordinates (y upwards); the renderer flips them for SVG.
 *
 *   Curves.svg(fig, { upTo })  -> an SVG string (all steps, or the steps up to an index)
 *   Curves.build(fig)          -> { steps, shapes, bounds } (the scene, for the app)
 */
(function (root) {
  'use strict';
  const C = root.Curves = root.Curves || {};
  const PI = Math.PI, TAU = 2 * Math.PI;
  const sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, abs = Math.abs, atan2 = Math.atan2;

  /* ------------------------------------------------------------------ registry */
  C.figures = C.figures || new Map();
  C.sections = C.sections || new Map();
  C.order = C.order || [];
  C.errors = C.errors || [];

  C.figure = function (def) {
    if (!def || typeof def.id !== 'string') throw new Error('Curves.figure: an id is required');
    if (!/^fig-\d{3}[a-z]?$/.test(def.id)) throw new Error('Curves.figure: bad id "' + def.id + '" (fig-NNN or fig-NNNa)');
    if (typeof def.build !== 'function') throw new Error('Curves.figure ' + def.id + ': build(k) is required');
    if (C.figures.has(def.id) && !C.allowRedefine) throw new Error('Curves.figure: ' + def.id + ' is defined twice');
    const m = /^fig-(\d{3})([a-z]?)$/.exec(def.id);
    def.fig = Number(m[1]);
    def.part = m[2] || '';
    def.caption = def.caption || ('Fig. ' + def.fig + (def.part ? '(' + def.part + ')' : ''));
    if (def.src) def.src = String(def.src);
    C.figures.set(def.id, def);
    if (!C.order.includes(def.id)) C.order.push(def.id);
    return def;
  };

  C.section = function (def) {
    if (!def || typeof def.id !== 'string') throw new Error('Curves.section: an id is required');
    C.sections.set(def.id, def);
    return def;
  };

  C.TOOLS = {
    given: { name: 'Given', hint: 'What you start from: the data of the problem.' },
    straightedge: { name: 'Straightedge', hint: 'A line through two known points (or along an edge). The straightedge has no marks.' },
    compass: { name: 'Compass', hint: 'A circle or an arc about a known centre, with a radius taken between two known points.' },
    dividers: { name: 'Dividers', hint: 'Carry a length from one place to another, or step off equal lengths along a line or a circle.' },
    ruler: { name: 'Ruler', hint: 'Measure or lay off a stated length (drafting practice; with compass and straightedge only, use dividers).' },
    square: { name: 'Set square', hint: 'A perpendicular or a parallel through a point (drafting practice; the classical way is a compass construction).' },
    protractor: { name: 'Protractor', hint: 'Lay off a stated angle (drafting practice).' },
    pencil: { name: 'Pencil', hint: 'Draw the curve through the points found, with a French curve or a steady hand.' },
    roll: { name: 'Rolling', hint: 'A rolling motion: the drawing shows the generating circle in one or more positions.' },
    fold: { name: 'Paper folding', hint: 'A crease of the paper: fold a point onto a line or a circle.' },
    linkage: { name: 'Linkage', hint: 'A mechanism of bars and pivots that draws the curve.' },
    note: { name: 'Note', hint: 'An explanation drawn on the figure: labels, arrows, shading.' }
  };

  /* ------------------------------------------------------------------ geometry */
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
  g.perp = a => ({ x: -a.y, y: a.x });                       // rotated +90°
  g.rot = (a, t) => ({ x: a.x * cos(t) - a.y * sin(t), y: a.x * sin(t) + a.y * cos(t) });
  g.rotAbout = (p, c, t) => g.add(c, g.rot(g.sub(p, c), t));
  g.mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  g.lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  g.polar = (c, r, t) => ({ x: c.x + r * cos(t), y: c.y + r * sin(t) });
  g.angleOf = v => atan2(v.y, v.x);
  g.angle = (a, v, b) => {                                    // angle AVB, ccw from VA to VB, in (-π, π]
    let t = g.angleOf(g.sub(b, v)) - g.angleOf(g.sub(a, v));
    while (t > PI) t -= TAU; while (t <= -PI) t += TAU; return t;
  };
  g.dir = t => ({ x: cos(t), y: sin(t) });
  g.along = (a, b, d) => g.add(a, g.mul(g.unit(g.sub(b, a)), d));   // the point at distance d from a towards b
  g.lineLine = (a, b, c, d) => {                              // intersection of lines ab and cd (null if parallel)
    const r = g.sub(b, a), s = g.sub(d, c), den = g.cross(r, s);
    if (abs(den) < 1e-12) return null;
    const t = g.cross(g.sub(c, a), s) / den;
    return g.add(a, g.mul(r, t));
  };
  g.segSeg = (a, b, c, d) => {                                // intersection of segments (null if none)
    const r = g.sub(b, a), s = g.sub(d, c), den = g.cross(r, s);
    if (abs(den) < 1e-12) return null;
    const t = g.cross(g.sub(c, a), s) / den, u = g.cross(g.sub(c, a), r) / den;
    return (t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9) ? g.add(a, g.mul(r, t)) : null;
  };
  g.foot = (p, a, b) => {                                     // foot of the perpendicular from p to line ab
    const d = g.sub(b, a), t = g.dot(g.sub(p, a), d) / (g.dot(d, d) || 1);
    return g.add(a, g.mul(d, t));
  };
  g.reflect = (p, a, b) => { const f = g.foot(p, a, b); return g.add(f, g.sub(f, p)); };
  g.lineCircle = (a, b, c, r) => {                            // intersections of line ab with circle (c, r): [] / [p] / [p1, p2]
    const d = g.unit(g.sub(b, a)), f = g.sub(a, c);
    const B = g.dot(f, d), D = B * B - (g.dot(f, f) - r * r);
    if (D < -1e-9) return [];
    const s = sqrt(Math.max(D, 0));
    const p1 = g.add(a, g.mul(d, -B - s)), p2 = g.add(a, g.mul(d, -B + s));
    return D <= 1e-9 ? [p1] : [p1, p2];
  };
  g.circleCircle = (c1, r1, c2, r2) => {                      // intersections of two circles: [] / [p] / [p1, p2]
    const d = g.dist(c1, c2);
    if (d < 1e-12 || d > r1 + r2 + 1e-9 || d < abs(r1 - r2) - 1e-9) return [];
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h2 = r1 * r1 - a * a, h = sqrt(Math.max(h2, 0));
    const u = g.unit(g.sub(c2, c1)), m = g.add(c1, g.mul(u, a)), n = g.perp(u);
    if (h2 <= 1e-9) return [m];
    return [g.add(m, g.mul(n, h)), g.sub(m, g.mul(n, h))];
  };
  g.tangentPoints = (p, c, r) => {                            // points of contact of the tangents from p to circle (c, r)
    const d = g.dist(p, c); if (d <= r) return [];
    const m = g.mid(p, c); return g.circleCircle(m, d / 2, c, r);
  };
  g.circumcenter = (a, b, c) => {
    const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
    if (abs(d) < 1e-12) return null;
    const A = a.x * a.x + a.y * a.y, B = b.x * b.x + b.y * b.y, Cc = c.x * c.x + c.y * c.y;
    return { x: (A * (b.y - c.y) + B * (c.y - a.y) + Cc * (a.y - b.y)) / d, y: (A * (c.x - b.x) + B * (a.x - c.x) + Cc * (b.x - a.x)) / d };
  };
  g.incenter = (a, b, c) => {
    const la = g.dist(b, c), lb = g.dist(a, c), lc = g.dist(a, b), s = la + lb + lc;
    return { x: (la * a.x + lb * b.x + lc * c.x) / s, y: (la * a.y + lb * b.y + lc * c.y) / s };
  };
  g.centroid = pts => { let x = 0, y = 0; pts.forEach(p => { x += p.x; y += p.y; }); return { x: x / pts.length, y: y / pts.length }; };
  g.onLine = (a, b, p, tol) => abs(g.cross(g.sub(b, a), g.sub(p, a))) / (g.dist(a, b) || 1) < (tol || 1e-6);
  g.parallelThrough = (p, a, b) => [p, g.add(p, g.sub(b, a))];
  g.perpThrough = (p, a, b) => [p, g.add(p, g.perp(g.sub(b, a)))];
  g.inversion = (p, c, k2) => {                               // inverse of p in the circle (c, sqrt(k2))
    const v = g.sub(p, c), d2 = g.dot(v, v) || 1e-12; return g.add(c, g.mul(v, k2 / d2));
  };
  g.closest = (p, pts) => pts.reduce((best, q) => (!best || g.dist(p, q) < g.dist(p, best)) ? q : best, null);
  g.frenet = (f, t, h) => {                                   // unit tangent and normal of a parametric curve at t
    h = h || 1e-4; const a = f(t - h), b = f(t + h);
    const T = g.unit({ x: b[0] - a[0], y: b[1] - a[1] }); return { T, N: g.perp(T) };
  };
  g.curvature = (f, t, h) => {                                // signed curvature of a parametric curve at t
    h = h || 1e-3; const a = f(t - h), b = f(t), c = f(t + h);
    const x1 = (c[0] - a[0]) / (2 * h), y1 = (c[1] - a[1]) / (2 * h);
    const x2 = (c[0] - 2 * b[0] + a[0]) / (h * h), y2 = (c[1] - 2 * b[1] + a[1]) / (h * h);
    const den = Math.pow(x1 * x1 + y1 * y1, 1.5); return den ? (x1 * y2 - y1 * x2) / den : 0;
  };
  g.centerOfCurvature = (f, t) => {
    const p = f(t), k = g.curvature(f, t), fr = g.frenet(f, t);
    if (!k) return null; const R = 1 / k; return { x: p[0] + R * fr.N.x, y: p[1] + R * fr.N.y, R: abs(R) };
  };
  g.arcLength = (f, t0, t1, n) => {
    n = n || 400; let s = 0, a = f(t0);
    for (let i = 1; i <= n; i++) { const b = f(t0 + (t1 - t0) * i / n); s += Math.hypot(b[0] - a[0], b[1] - a[1]); a = b; }
    return s;
  };
  g.deg = d => d * PI / 180;
  g.rad = r => r * 180 / PI;
  C.g = g;

  /* ------------------------------------------------------------------ the curves of the book */
  /* Each returns a parametric function t -> [x, y] (or an object of branches). The parameter ranges
     are the natural ones; the comments say which. Names as in the book. */
  const K = {};
  K.circle = (r, c) => t => [(c ? c.x : 0) + r * cos(t), (c ? c.y : 0) + r * sin(t)];
  K.ellipse = (a, b) => t => [a * cos(t), b * sin(t)];                          // t in [0, 2π]
  K.hyperbola = (a, b) => t => [a * Math.cosh(t), b * Math.sinh(t)];              // right branch, t in [-T, T]
  K.parabola = p => t => [t * t / (4 * p), t];                                  // y² = 4px, t = y
  K.astroid = a => t => [a * Math.pow(cos(t), 3), a * Math.pow(sin(t), 3)];      // t in [0, 2π]
  K.cardioid = a => t => [a * (2 * cos(t) - cos(2 * t)), a * (2 * sin(t) - sin(2 * t))];  // cusp at origin (a, cusp pointing left... see epicycloid)
  K.nephroid = a => t => [a * (3 * cos(t) - cos(3 * t)), a * (3 * sin(t) - sin(3 * t))];  // fixed circle radius 2a, rolling a
  K.deltoid = a => t => [2 * a * cos(t) + a * cos(2 * t), 2 * a * sin(t) - a * sin(2 * t)];  // fixed circle 3a, rolling a
  K.epicycloid = (a, b) => t => [(a + b) * cos(t) - b * cos((a + b) / b * t), (a + b) * sin(t) - b * sin((a + b) / b * t)];
  K.hypocycloid = (a, b) => t => [(a - b) * cos(t) + b * cos((a - b) / b * t), (a - b) * sin(t) - b * sin((a - b) / b * t)];
  K.epitrochoid = (a, b, h) => t => [(a + b) * cos(t) - h * cos((a + b) / b * t), (a + b) * sin(t) - h * sin((a + b) / b * t)];
  K.hypotrochoid = (a, b, h) => t => [(a - b) * cos(t) + h * cos((a - b) / b * t), (a - b) * sin(t) - h * sin((a - b) / b * t)];
  K.cycloid = a => t => [a * (t - sin(t)), a * (1 - cos(t))];                    // rolling on the x-axis, cusp at O
  K.trochoid = (a, h) => t => [a * t - h * sin(t), a - h * cos(t)];              // h < a curtate, h > a prolate
  K.limacon = (a, k) => t => [(2 * a * cos(t) + k) * cos(t), (2 * a * cos(t) + k) * sin(t)];   // r = 2a cos θ + k
  K.lemniscate = a => t => { const r2 = a * a * cos(2 * t); return r2 < 0 ? null : [sqrt(r2) * cos(t), sqrt(r2) * sin(t)]; };  // r² = a² cos 2θ
  K.lemniscateParam = a => t => { const d = 1 + sin(t) * sin(t); return [a * cos(t) / d, a * sin(t) * cos(t) / d]; };   // t in [0, 2π], no gaps
  K.cissoid = a => t => [2 * a * sin(t) * sin(t), 2 * a * sin(t) * sin(t) * Math.tan(t)];   // y² = x³/(2a − x), t = θ in (−π/2, π/2)
  K.conchoid = (a, k, sign) => t => { const r = a / cos(t) + (sign || 1) * k; return [r * cos(t), r * sin(t)]; };   // r = a sec θ ± k
  K.strophoid = a => t => { const r = a * (1 / cos(t) - 2 * cos(t)); return [r * cos(t), r * sin(t)]; };   // r = a(sec θ − 2cos θ), t in (−π/2, π/2)
  K.witch = a => t => [2 * a * Math.tan(t), 2 * a * cos(t) * cos(t)];           // x = 2a tan θ, y = 2a cos²θ
  K.folium = a => t => [3 * a * t / (1 + t * t * t), 3 * a * t * t / (1 + t * t * t)];   // t = y/x, t ≠ −1
  K.catenary = a => t => [t, a * Math.cosh(t / a)];
  K.tractrix = a => t => [a * Math.log(1 / cos(t) + Math.tan(t)) - a * sin(t), a * cos(t)];   // t in (−π/2, π/2), asymptote the x-axis
  K.semicubic = a => t => [t * t, a * t * t * t];                                // ay² = x³ ... as y = a x^{3/2}: use (t², a t³)
  K.cubicParabola = (A, B, Cc, D) => t => [t, ((A * t + B) * t + Cc) * t + D];
  K.sine = (A, w) => t => [t, A * sin(w * t)];
  K.equiangularSpiral = (a, k) => t => [a * Math.exp(k * t) * cos(t), a * Math.exp(k * t) * sin(t)];   // r = a e^{kθ}
  K.archimedes = a => t => [a * t * cos(t), a * t * sin(t)];                     // r = aθ
  K.hyperbolicSpiral = a => t => [a / t * cos(t), a / t * sin(t)];               // rθ = a
  K.lituus = a => t => [a / sqrt(t) * cos(t), a / sqrt(t) * sin(t)];             // r²θ = a²
  K.fermat = a => t => [a * sqrt(t) * cos(t), a * sqrt(t) * sin(t)];             // r² = a²θ
  K.sinusoidal = (a, n) => t => { const c = cos(n * t); const r = a * Math.sign(c) * Math.pow(abs(c), 1 / n); return [r * cos(t), r * sin(t)]; };   // rⁿ = aⁿ cos nθ
  K.rose = (a, k) => t => [a * cos(k * t) * cos(t), a * cos(k * t) * sin(t)];     // r = a cos kθ
  K.cassini = (a, k, sign) => t => {                                              // r² = a² cos 2θ ± sqrt(k⁴ − a⁴ sin² 2θ), foci at ±a
    const d = Math.pow(k, 4) - Math.pow(a, 4) * sin(2 * t) * sin(2 * t); if (d < 0) return null;
    const r2 = a * a * cos(2 * t) + (sign || 1) * sqrt(d); if (r2 < 0) return null; const r = sqrt(r2);
    return [r * cos(t), r * sin(t)];
  };
  K.involuteOfCircle = a => t => [a * (cos(t) + t * sin(t)), a * (sin(t) - t * cos(t))];
  K.kieroid = (a, b, c, sign) => t => {                                       // Kieroid (Kiernan 1945): circle of radius a, centre B on the line BA with AB = b, O on it at c from A; the secant through O meets the circle at P1, P2 — see the Kieroid section
    const d = a * a - b * b * sin(t) * sin(t); if (d < 0) return null;
    const r = (b + (c || 0)) / cos(t) - b * cos(t) + (sign || 1) * sqrt(d); return [r * cos(t), r * sin(t)];
  };
  K.euler = (a, n) => t => {                                                      // Euler (Cornu) spiral, s = t, numeric Fresnel integral
    n = n || 200; let x = 0, y = 0; const sgn = Math.sign(t) || 1, T = abs(t), h = T / n;
    for (let i = 0; i < n; i++) { const s = (i + 0.5) * h, th = s * s / (2 * a * a); x += cos(th) * h; y += sin(th) * h; }
    return [sgn * x, sgn * y];
  };
  K.pursuit = (k, n) => {                                                         // pursuer from (1,0) chases a quarry moving up the y-axis from O at speed ratio k; returns samples
    n = n || 600; const pts = []; let px = 1, py = 0, qy = 0; const dt = 1.5 / n;
    for (let i = 0; i < n; i++) { pts.push([px, py]); const dx = -px, dy = qy - py, l = Math.hypot(dx, dy) || 1e-9; px += k * dx / l * dt; py += k * dy / l * dt; qy += dt; }
    return pts;
  };
  K.normal = (s, m) => t => [t, Math.exp(-t * t / (2 * s * s)) / (s * sqrt(TAU)) * (m || 1)];
  K.exp = (a, k) => t => [t, a * Math.exp(k * t)];
  K.probability = K.normal;
  C.curves = K;

  /* ------------------------------------------------------------------ the kit */
  const DIRS = { n: [0, 1], ne: [1, 1], e: [1, 0], se: [1, -1], s: [0, -1], sw: [-1, -1], w: [-1, 0], nw: [-1, 1], c: [0, 0] };

  function Kit(fig) {
    this.fig = fig;
    this.steps = [];
    this.shapes = [];
    this.cur = null;
    this.opts = { pad: 0.07, fontScale: 1, frame: null, aspect: null };
    this.g = g;
    this.curves = K;
    this.PI = PI; this.TAU = TAU;
  }
  const kp = Kit.prototype;

  kp.ensureStep = function () {
    if (!this.cur) this.given('The figure');
  };
  kp.given = function (text, fn) { return this.step('given', text, fn); };
  kp.step = function (tool, text, fn) {
    if (!C.TOOLS[tool]) throw new Error(this.fig.id + ': unknown tool "' + tool + '"');
    const s = { i: this.steps.length, tool, text: String(text || ''), shapes: [] };
    this.steps.push(s);
    const prev = this.cur; this.cur = s;
    if (typeof fn === 'function') fn(this);
    return s;
  };
  kp.note = function (text, fn) { return this.step('note', text, fn); };
  kp.result = function (text, fn) { return this.step('pencil', text, fn); };

  kp.add = function (shape) {
    this.ensureStep();
    shape.step = this.cur.i;
    shape.i = this.shapes.length;
    if (!shape.o) shape.o = {};
    this.shapes.push(shape); this.cur.shapes.push(shape);
    return shape;
  };

  /* options */
  kp.frame = function (x0, y0, x1, y1) { this.opts.frame = [x0, y0, x1, y1]; return this; };
  kp.pad = function (f) { this.opts.pad = f; return this; };
  kp.fontScale = function (f) { this.opts.fontScale = f; return this; };

  /* points */
  kp.pt = (x, y) => ({ x, y });
  kp.P = function (x, y, label, o) {
    const p = { x, y }; if (label != null) this.point(p, label, o); else if (o) this.point(p, null, o);
    return p;
  };
  kp.point = function (p, label, o) {
    o = typeof o === 'string' ? { at: o } : (o || {});
    chk(this, p, 'point');
    this.add({ t: 'point', p: { x: p.x, y: p.y }, o });
    if (label != null && label !== '') this.label(p, label, o.at || 'ne', o.lo || {});
    return p;
  };
  kp.dot = function (p, o) { return this.point(p, null, o); };
  kp.label = function (p, text, at, o) {
    o = o || {}; chk(this, p, 'label');
    this.add({ t: 'label', p: { x: p.x, y: p.y }, text: String(text), at: at || 'ne', o });
    return p;
  };
  kp.text = function (x, y, text, o) {
    o = o || {}; chk(this, { x, y }, 'text');
    return this.add({ t: 'text', p: { x, y }, text: String(text), o });
  };

  /* lines */
  kp.seg = function (a, b, o) { chk(this, a, 'seg'); chk(this, b, 'seg'); return this.add({ t: 'seg', a: cp(a), b: cp(b), o: o || {} }); };
  kp.line = function (a, b, o) { chk(this, a, 'line'); chk(this, b, 'line'); return this.add({ t: 'line', a: cp(a), b: cp(b), o: o || {} }); };
  kp.ray = function (a, b, o) { chk(this, a, 'ray'); chk(this, b, 'ray'); return this.add({ t: 'ray', a: cp(a), b: cp(b), o: o || {} }); };
  kp.poly = function (pts, o) { pts.forEach(p => chk(this, p, 'poly')); return this.add({ t: 'poly', pts: pts.map(cp), o: o || {} }); };
  kp.arrow = function (a, b, o) { chk(this, a, 'arrow'); chk(this, b, 'arrow'); return this.add({ t: 'seg', a: cp(a), b: cp(b), o: Object.assign({ arrow: 'end' }, o || {}) }); };
  kp.axes = function (origin, o) {
    o = o || {}; const O = origin || { x: 0, y: 0 };
    const x = o.x || [-100, 100], y = o.y || [-100, 100];
    const sx = this.add({ t: 'seg', a: { x: O.x + x[0], y: O.y }, b: { x: O.x + x[1], y: O.y }, o: { cls: o.cls || 'axis', arrow: o.arrows === false ? null : 'end' } });
    const sy = this.add({ t: 'seg', a: { x: O.x, y: O.y + y[0] }, b: { x: O.x, y: O.y + y[1] }, o: { cls: o.cls || 'axis', arrow: o.arrows === false ? null : 'end' } });
    if (o.labels !== false) {
      this.label({ x: O.x + x[1], y: O.y }, o.xl || 'X', 'se', { cls: 'axis' });
      this.label({ x: O.x, y: O.y + y[1] }, o.yl || 'Y', 'ne', { cls: 'axis' });
    }
    if (o.origin) this.label(O, o.origin, o.originAt || 'sw');
    return [sx, sy];
  };

  /* circles and arcs */
  kp.circle = function (c, r, o) { chk(this, c, 'circle'); chkn(this, r, 'circle radius'); return this.add({ t: 'circle', c: cp(c), r, o: o || {} }); };
  kp.arc = function (c, r, a0, a1, o) { chk(this, c, 'arc'); chkn(this, r, 'arc radius'); chkn(this, a0, 'arc a0'); chkn(this, a1, 'arc a1'); return this.add({ t: 'arc', c: cp(c), r, a0, a1, o: o || {} }); };
  kp.arc3 = function (c, p, q, o) {                           // the arc about c from point p to point q, counter-clockwise
    chk(this, c, 'arc3'); return this.arc(c, g.dist(c, p), g.angleOf(g.sub(p, c)), g.angleOf(g.sub(q, c)), o);
  };
  kp.ellipse = function (c, a, b, o) { chk(this, c, 'ellipse'); return this.curve(t => [c.x + a * cos(t), c.y + b * sin(t)], [0, TAU], Object.assign({ n: 180 }, o || {})); };

  /* curves */
  kp.curve = function (f, range, o) {
    o = o || {};
    let pts;
    if (Array.isArray(f)) pts = f.map(p => p == null ? null : (Array.isArray(p) ? p : [p.x, p.y]));   // null = a gap in the curve
    else {
      const t0 = range ? range[0] : 0, t1 = range ? range[1] : 1, n = o.n || 400;
      pts = [];
      for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; const p = f(t); pts.push(p ? (Array.isArray(p) ? p : [p.x, p.y]) : null); }
    }
    pts.forEach((p, i) => { if (p && !(isFinite(p[0]) && isFinite(p[1]))) pts[i] = null; });
    const s = this.add({ t: 'curve', pts, o, f: typeof f === 'function' ? f : null, range });
    if (o.arrow != null && typeof f === 'function') {
      const ts = Array.isArray(o.arrow) ? o.arrow : [o.arrow];
      ts.forEach(t => { const p = f(t), fr = g.frenet(f, t); if (p) this.add({ t: 'head', p: { x: p[0], y: p[1] }, d: o.cw ? g.mul(fr.T, -1) : fr.T, o: { cls: o.cls } }); });
    }
    return s;
  };
  kp.fn = function (f, range, o) { return this.curve(x => [x, f(x)], range, o); };
  kp.polar = function (f, range, o) { return this.curve(t => { const r = f(t); return r == null || !isFinite(r) ? null : [r * cos(t), r * sin(t)]; }, range, o); };
  kp.smooth = function (ctrl, o) {                           // a smooth curve through control points (Catmull–Rom), for the book's freehand "given curves"
    o = o || {}; const P = ctrl.map(p => Array.isArray(p) ? { x: p[0], y: p[1] } : p);
    if (P.length < 2) throw new Error(this.fig.id + ': smooth needs 2 points or more');
    const seg = o.n || 24, pts = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t;
        pts.push([0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)]); }
    }
    pts.push([P[P.length - 1].x, P[P.length - 1].y]);
    return this.curve(pts, null, o);
  };

  /* marks */
  kp.angle = function (v, a, b, o) {                          // angle mark at v, from direction va to vb, counter-clockwise
    o = o || {}; chk(this, v, 'angle'); chk(this, a, 'angle'); chk(this, b, 'angle');
    const a0 = g.angleOf(g.sub(a, v)); let a1 = g.angleOf(g.sub(b, v)); while (a1 < a0) a1 += TAU;
    if (o.right) return this.add({ t: 'rightangle', v: cp(v), a: cp(a), b: cp(b), o });
    return this.add({ t: 'anglemark', v: cp(v), a0, a1, o });
  };
  kp.right = function (v, a, b, o) { return this.angle(v, a, b, Object.assign({ right: true }, o || {})); };
  kp.dim = function (a, b, text, o) {                         // a length written beside the segment ab
    o = o || {}; chk(this, a, 'dim'); chk(this, b, 'dim');
    return this.add({ t: 'dim', a: cp(a), b: cp(b), text: String(text), o });
  };
  kp.hatch = function (pts, o) {                              // a hatched region (polygon)
    pts.forEach(p => chk(this, p, 'hatch')); return this.add({ t: 'hatch', pts: pts.map(cp), o: o || {} });
  };
  kp.head = function (p, dir, o) {                            // an arrow head at p pointing along dir
    chk(this, p, 'head'); return this.add({ t: 'head', p: cp(p), d: g.unit(dir), o: o || {} });
  };
  kp.tick = function (p, dir, o) { chk(this, p, 'tick'); return this.add({ t: 'tick', p: cp(p), d: g.unit(dir), o: o || {} }); };
  kp.pivot = function (p, o) { chk(this, p, 'pivot'); return this.add({ t: 'pivot', p: cp(p), o: o || {} }); };     // a linkage pivot (double circle)
  kp.bar = function (a, b, o) { chk(this, a, 'bar'); chk(this, b, 'bar'); return this.add({ t: 'bar', a: cp(a), b: cp(b), o: o || {} }); };   // a linkage bar
  kp.target = function (shape) { shape.o.target = true; return shape; };

  function cp(p) { return { x: p.x, y: p.y }; }
  function chk(k, p, what) {
    if (!p || typeof p.x !== 'number' || typeof p.y !== 'number' || !isFinite(p.x) || !isFinite(p.y))
      throw new Error(k.fig.id + ': bad point in ' + what + ' (' + (p && JSON.stringify(p)) + ')');
  }
  function chkn(k, n, what) { if (typeof n !== 'number' || !isFinite(n)) throw new Error(k.fig.id + ': bad number in ' + what + ' (' + n + ')'); }

  /* ------------------------------------------------------------------ building a scene */
  C.build = function (fig) {
    const k = new Kit(fig);
    fig.build(k);
    if (!k.shapes.length) throw new Error(fig.id + ': the figure draws nothing');
    const bounds = computeBounds(k);
    return { fig, steps: k.steps, shapes: k.shapes, bounds, opts: k.opts };
  };

  function computeBounds(k) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const ext = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
    const extP = p => ext(p.x, p.y);
    k.shapes.forEach(s => {
      if (s.o && s.o.nobounds) return;
      switch (s.t) {
        case 'point': case 'label': case 'text': case 'head': case 'tick': case 'pivot': extP(s.p); break;
        case 'seg': case 'bar': case 'dim': extP(s.a); extP(s.b); break;
        case 'ray': extP(s.a); break;
        case 'line': break;
        case 'poly': case 'hatch': s.pts.forEach(extP); break;
        case 'circle': ext(s.c.x - s.r, s.c.y - s.r); ext(s.c.x + s.r, s.c.y + s.r); break;
        case 'arc': { extP(g.polar(s.c, s.r, s.a0)); extP(g.polar(s.c, s.r, s.a1));
          for (let q = 0; q < 4; q++) { const t = q * PI / 2; let a = t; while (a < s.a0) a += TAU; if (a <= s.a1) extP(g.polar(s.c, s.r, t)); } break; }
        case 'curve': s.pts.forEach(p => { if (p) ext(p[0], p[1]); }); break;
        case 'anglemark': extP(s.v); break;
        case 'rightangle': extP(s.v); break;
      }
    });
    if (k.opts.frame) { const f = k.opts.frame; x0 = f[0]; y0 = f[1]; x1 = f[2]; y1 = f[3]; }
    if (!isFinite(x0)) { x0 = -100; y0 = -100; x1 = 100; y1 = 100; }
    if (x1 - x0 < 1e-6) { x0 -= 50; x1 += 50; }
    if (y1 - y0 < 1e-6) { y0 -= 50; y1 += 50; }
    // curves that run off to infinity: clip them to a sane box around everything else first
    const w = x1 - x0, h = y1 - y0, S = Math.max(w, h);
    const pad = S * k.opts.pad;                      // a frame gets the same margin as a free drawing (k.pad(0) for none)
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad, S: S + 2 * pad };
  }

  /* ------------------------------------------------------------------ SVG */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const f2 = n => (Math.round(n * 100) / 100).toString();

  C.STYLE = [
    'svg.cw{font-family:"Times New Roman",Times,"Liberation Serif",serif;background:#fff}',
    'svg.cw .ink{stroke:#1b1b1b;fill:none;stroke-linecap:round;stroke-linejoin:round}',
    'svg.cw .given{stroke:#1b1b1b}',
    'svg.cw .cons{stroke:#4b4b4b}',
    'svg.cw .aux{stroke:#8a8a8a}',
    'svg.cw .axis{stroke:#1b1b1b}',
    'svg.cw .curve{stroke:#0b4fa0}',
    'svg.cw .thick{stroke:#1b1b1b}',
    'svg.cw .hatchline{stroke:#2a2a2a}',
    'svg.cw .lbl{fill:#1b1b1b;stroke:none;font-style:italic}',
    'svg.cw .lbl.axis{font-style:normal}',
    'svg.cw .lbl.upright{font-style:normal}',
    'svg.cw .pt{fill:#1b1b1b;stroke:none}',
    'svg.cw .pt.curve{fill:#0b4fa0}',
    'svg.cw .pt.open{fill:#fff;stroke:#1b1b1b}',
    'svg.cw .head{stroke:none}',
    'svg.cw .fill{stroke:none}',
    'svg.cw .pivot{fill:#fff;stroke:#1b1b1b}',
    'svg.cw .dash{stroke-dasharray:var(--dash)}',
    'svg.cw .dot{stroke-dasharray:var(--dot)}'
  ].join('\n');

  /* Render a built scene (or a figure) to an SVG string.
     opts.upTo: draw the steps 0..upTo only; opts.size: the width in px (height follows);
     opts.standalone: include the xml header, style and title (for files). */
  C.svg = function (figOrScene, opts) {
    opts = opts || {};
    const sc = figOrScene.shapes ? figOrScene : C.build(figOrScene);
    const fig = sc.fig, B = sc.bounds, S = B.S;
    const W = B.x1 - B.x0, H = B.y1 - B.y0;
    const fs = S * 0.034 * (sc.opts.fontScale || 1);                // label size
    const lw = { given: S * 0.0036, cons: S * 0.0022, aux: S * 0.0018, axis: S * 0.003, curve: S * 0.0056, thick: S * 0.0056, hatchline: S * 0.0028 };
    const rPt = S * 0.0065;
    const upTo = opts.upTo == null ? Infinity : opts.upTo;
    const X = x => f2(x - B.x0), Y = y => f2(B.y1 - y);          // to SVG (y flipped)
    const parts = [];
    const stepGroups = new Map();
    const out = (step, s) => { if (!stepGroups.has(step)) stepGroups.set(step, []); stepGroups.get(step).push(s); };

    const clsOf = (s, extra) => {
      const cls = s.o.cls || (s.t === 'curve' ? 'curve' : 'given');
      let c = 'ink ' + cls + (extra ? ' ' + extra : '');
      if (s.o.dash) c += ' dash'; if (s.o.dotted) c += ' dot';
      return c;
    };
    const widthOf = s => {
      const cls = s.o.cls || (s.t === 'curve' ? 'curve' : 'given');
      return (s.o.width != null ? s.o.width : (lw[cls] || lw.given)) * (s.o.w || 1);
    };
    const styleOf = s => {
      let st = 'stroke-width:' + f2(widthOf(s)) + ';fill:' + (s.o.fill || 'none');
      if (s.o.stroke) st += ';stroke:' + s.o.stroke;
      if (s.o.opacity != null) st += ';opacity:' + s.o.opacity;
      if (s.o.dash) st += ';--dash:' + (typeof s.o.dash === 'string' ? s.o.dash : f2(S * 0.012) + ' ' + f2(S * 0.008));
      if (s.o.dotted) st += ';--dot:' + f2(S * 0.002) + ' ' + f2(S * 0.009);
      return st;
    };
    const attrs = (s, extra) => ' class="' + clsOf(s, extra) + '" style="' + styleOf(s) + (s.o.stroke ? '' : ';stroke:' + (COLORS[s.o.cls || (s.t === 'curve' ? 'curve' : 'given')] || '#1b1b1b')) + (s.o.dash ? ';stroke-dasharray:' + (typeof s.o.dash === 'string' ? s.o.dash : f2(S * 0.012) + ' ' + f2(S * 0.008)) : '') + (s.o.dotted ? ';stroke-dasharray:' + f2(S * 0.002) + ' ' + f2(S * 0.009) : '') + ';stroke-linecap:round;stroke-linejoin:round"' + (s.o.target ? ' data-target="1"' : '') + (s.o.id ? ' id="' + esc(s.o.id) + '"' : '');

    const COLORS = { given: '#1b1b1b', cons: '#4b4b4b', aux: '#8a8a8a', axis: '#1b1b1b', curve: '#0b4fa0', thick: '#1b1b1b', hatchline: '#2a2a2a' };
    const head = (p, d, size, cls, step) => {                   // a filled arrow head at p pointing along unit d
      const L = size, Wd = size * 0.42;
      const tip = p, base = g.sub(p, g.mul(d, L)), n = g.perp(d);
      const l = g.add(base, g.mul(n, Wd)), r = g.sub(base, g.mul(n, Wd));
      out(step, '<path class="head ' + (cls || 'given') + '" style="stroke:none;fill:' + (cls === 'curve' ? '#0b4fa0' : '#1b1b1b') + '" d="M' + X(tip.x) + ' ' + Y(tip.y) + 'L' + X(l.x) + ' ' + Y(l.y) + 'L' + X(r.x) + ' ' + Y(r.y) + 'Z"/>');
    };
    const clipLine = (a, b) => {                                // the piece of line ab inside the bounds (Liang–Barsky)
      const d = g.sub(b, a); let t0 = -Infinity, t1 = Infinity;
      const tests = [[-d.x, a.x - B.x0], [d.x, B.x1 - a.x], [-d.y, a.y - B.y0], [d.y, B.y1 - a.y]];
      for (const [p, q] of tests) {
        if (abs(p) < 1e-12) { if (q < 0) return null; continue; }
        const t = q / p; if (p < 0) { if (t > t0) t0 = t; } else { if (t < t1) t1 = t; }
      }
      if (t0 > t1) return null;
      return [g.add(a, g.mul(d, t0)), g.add(a, g.mul(d, t1))];
    };
    const pathOfPts = pts => {                                  // polyline with gaps (null) and jump breaks
      let d = '', pen = false, prev = null, lens = [];
      for (let i = 1; i < pts.length; i++) if (pts[i] && pts[i - 1]) lens.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      lens.sort((a, b) => a - b); const med = lens.length ? lens[lens.length >> 1] : S; const jump = Math.max(med * 40, S * 0.5);
      const inBox = p => p[0] > B.x0 - S * 2 && p[0] < B.x1 + S * 2 && p[1] > B.y0 - S * 2 && p[1] < B.y1 + S * 2;
      for (const p of pts) {
        if (!p || !inBox(p)) { pen = false; prev = null; continue; }
        if (prev && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > jump) pen = false;
        d += (pen ? 'L' : 'M') + X(p[0]) + ' ' + Y(p[1]); pen = true; prev = p;
      }
      return d;
    };
    const textEl = (p, text, o, cls, step, anchor, baseline) => {
      const size = fs * (o.size || 1);
      const t = richText(text);
      out(step, '<text class="lbl ' + (cls || '') + (o.upright ? ' upright' : '') + '" x="' + X(p.x) + '" y="' + Y(p.y) + '" font-size="' + f2(size) + '" text-anchor="' + anchor + '" dominant-baseline="' + baseline + '"' + (o.rotate ? ' transform="rotate(' + f2(-o.rotate) + ' ' + X(p.x) + ' ' + Y(p.y) + ')"' : '') + (o.bold ? ' font-weight="bold"' : '') + ' style="fill:' + (o.fill || '#1b1b1b') + ';stroke:none;font-family:Times New Roman,Times,serif;font-style:' + ((o.upright || cls === 'axis') ? 'normal' : 'italic') + '">' + t + '</text>');
    };

    sc.shapes.forEach(s => {
      if (s.step > upTo) return;
      const step = s.step, o = s.o;
      switch (s.t) {
        case 'seg': case 'bar': {
          const a = s.a, b = s.b;
          if (s.t === 'bar') out(step, '<path class="ink given" style="fill:none;stroke-width:' + f2(lw.given * 2.6 * (o.w || 1)) + ';stroke:#1b1b1b;stroke-linecap:round" d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>' +
            '<path class="ink" style="fill:none;stroke-width:' + f2(lw.given * 2.6 * (o.w || 1) - 2 * lw.given * 0.7) + ';stroke:#fff;stroke-linecap:round" d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>');
          else out(step, '<path' + attrs(s) + ' d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>');
          const d = g.unit(g.sub(b, a)), hs = fs * 0.55 * (o.headSize || 1);
          if (o.arrow === 'end' || o.arrow === 'both' || o.arrow === true) head(b, d, hs, o.cls, step);
          if (o.arrow === 'start' || o.arrow === 'both') head(a, g.mul(d, -1), hs, o.cls, step);
          break; }
        case 'line': { const c = clipLine(s.a, s.b); if (c) out(step, '<path' + attrs(s) + ' d="M' + X(c[0].x) + ' ' + Y(c[0].y) + 'L' + X(c[1].x) + ' ' + Y(c[1].y) + '"/>'); break; }
        case 'ray': { const far = g.add(s.a, g.mul(g.unit(g.sub(s.b, s.a)), S * 10)); const c = clipLine(s.a, far);
          if (c) { const p0 = s.a; const end = g.dot(g.sub(c[1], s.a), g.sub(s.b, s.a)) > 0 ? c[1] : c[0];
            out(step, '<path' + attrs(s) + ' d="M' + X(p0.x) + ' ' + Y(p0.y) + 'L' + X(end.x) + ' ' + Y(end.y) + '"/>');
            if (o.arrow) head(end, g.unit(g.sub(s.b, s.a)), fs * 0.55, o.cls, step); }
          break; }
        case 'poly': { let d = s.pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ' ' + Y(p.y)).join(''); if (o.close) d += 'Z';
          out(step, '<path' + attrs(s) + ' d="' + d + '"/>'); break; }
        case 'circle': {
          out(step, '<circle' + attrs(s) + ' cx="' + X(s.c.x) + '" cy="' + Y(s.c.y) + '" r="' + f2(s.r) + '"/>');
          if (o.hatch) {                                          // short slanted strokes along the circumference, inside or outside
            const n = Math.max(24, Math.round(TAU * s.r / (S * 0.022))), L = S * 0.03 * (o.hatchLen || 1), side = o.hatch === 'in' ? -1 : 1;
            let d = '';
            for (let i = 0; i < n; i++) { const t = TAU * i / n; const p = g.polar(s.c, s.r, t); const dir = g.rot(g.dir(t), side * 0.6);
              const q = g.add(p, g.mul(dir, side * L)); d += 'M' + X(p.x) + ' ' + Y(p.y) + 'L' + X(q.x) + ' ' + Y(q.y); }
            out(step, '<path class="ink hatchline" style="fill:none;stroke:#2a2a2a;stroke-width:' + f2(lw.hatchline) + '" d="' + d + '"/>');
          }
          if (o.arrow != null) { const ts = Array.isArray(o.arrow) ? o.arrow : [o.arrow];
            ts.forEach(t => head(g.polar(s.c, s.r, t), g.rot(g.dir(t), o.cw ? -PI / 2 : PI / 2), fs * 0.55, o.cls, step)); }
          if (o.label != null) textEl(g.polar(s.c, s.r + fs * 0.9, o.labelAt != null ? o.labelAt : PI / 4), o.label, o, o.cls, step, 'middle', 'middle');
          break; }
        case 'arc': {
          let a0 = s.a0, a1 = s.a1; if (o.cw) { const t = a0; a0 = a1; a1 = t; }
          while (a1 < a0) a1 += TAU; if (a1 - a0 >= TAU - 1e-9) a1 = a0 + TAU - 1e-4;
          const p0 = g.polar(s.c, s.r, a0), p1 = g.polar(s.c, s.r, a1), large = (a1 - a0) > PI ? 1 : 0;
          // sweep flag: ccw in math coords is cw on screen (y flipped) → sweep=0
          out(step, '<path' + attrs(s) + ' d="M' + X(p0.x) + ' ' + Y(p0.y) + 'A' + f2(s.r) + ' ' + f2(s.r) + ' 0 ' + large + ' 0 ' + X(p1.x) + ' ' + Y(p1.y) + '"/>');
          if (o.arrow) { const end = o.cw ? s.a1 : a1; const dir = g.rot(g.dir(end), o.cw ? -PI / 2 : PI / 2); head(g.polar(s.c, s.r, end), dir, fs * 0.55, o.cls, step); }
          if (o.hatch) { const n = Math.max(6, Math.round((a1 - a0) * s.r / (S * 0.022))), L = S * 0.03, side = o.hatch === 'in' ? -1 : 1; let d = '';
            for (let i = 0; i <= n; i++) { const t = a0 + (a1 - a0) * i / n; const p = g.polar(s.c, s.r, t); const q = g.add(p, g.mul(g.rot(g.dir(t), side * 0.6), side * L)); d += 'M' + X(p.x) + ' ' + Y(p.y) + 'L' + X(q.x) + ' ' + Y(q.y); }
            out(step, '<path class="ink hatchline" style="fill:none;stroke:#2a2a2a;stroke-width:' + f2(lw.hatchline) + '" d="' + d + '"/>'); }
          break; }
        case 'curve': { const d = pathOfPts(s.pts); if (d) out(step, '<path' + attrs(s) + ' d="' + d + '"/>'); break; }
        case 'point': {
          const r = rPt * (o.r || 1);
          out(step, '<circle class="pt' + (o.cls ? ' ' + o.cls : '') + (o.open ? ' open' : '') + '" style="' + (o.open ? 'fill:#fff;stroke:#1b1b1b;stroke-width:' + f2(lw.cons) : 'fill:' + (o.fill || (o.cls === 'curve' ? '#0b4fa0' : '#1b1b1b'))) + '" cx="' + X(s.p.x) + '" cy="' + Y(s.p.y) + '" r="' + f2(r) + '"/>');
          break; }
        case 'pivot': { const sz = o.size || 1; out(step, '<circle class="ink pivot" style="fill:#fff;stroke:#1b1b1b;stroke-width:' + f2(lw.given) + '" cx="' + X(s.p.x) + '" cy="' + Y(s.p.y) + '" r="' + f2(rPt * 2.2 * sz) + '"/><circle class="pt" style="fill:#1b1b1b" cx="' + X(s.p.x) + '" cy="' + Y(s.p.y) + '" r="' + f2(rPt * 0.9 * sz) + '"/>'); break; }
        case 'label': {
          const dv = DIRS[s.at] || DIRS.ne, off = fs * 0.62 * (o.dist || 1);
          const p = { x: s.p.x + dv[0] * off * (dv[1] ? 0.85 : 1), y: s.p.y + dv[1] * off };
          const anchor = dv[0] > 0 ? 'start' : dv[0] < 0 ? 'end' : 'middle';
          const baseline = dv[1] > 0 ? 'auto' : dv[1] < 0 ? 'hanging' : 'middle';
          textEl(p, s.text, o, o.cls, step, anchor, baseline); break; }
        case 'text': textEl(s.p, s.text, o, o.cls, step, o.anchor || 'middle', o.baseline || 'middle'); break;
        case 'head': head(s.p, s.d, fs * 0.6 * (o.size || 1), o.cls, step); break;
        case 'tick': { const n = g.perp(s.d), L = fs * 0.35 * (o.size || 1); const a = g.add(s.p, g.mul(n, L)), b = g.sub(s.p, g.mul(n, L));
          out(step, '<path class="ink ' + (o.cls || 'given') + '" style="fill:none;stroke:' + (COLORS[o.cls || 'given'] || '#1b1b1b') + ';stroke-width:' + f2(lw.cons) + '" d="M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + '"/>'); break; }
        case 'anglemark': {
          const r = fs * 0.9 * (o.r || 1), n = o.n || 1;                    // n concentric arcs
          for (let j = 0; j < n; j++) { const rr = r + j * fs * 0.22; const p0 = g.polar(s.v, rr, s.a0), p1 = g.polar(s.v, rr, s.a1), large = (s.a1 - s.a0) > PI ? 1 : 0;
            out(step, '<path class="ink ' + (o.cls || 'cons') + '" style="fill:none;stroke:' + (COLORS[o.cls || 'cons'] || '#4b4b4b') + ';stroke-width:' + f2(lw.cons) + '" d="M' + X(p0.x) + ' ' + Y(p0.y) + 'A' + f2(rr) + ' ' + f2(rr) + ' 0 ' + large + ' 0 ' + X(p1.x) + ' ' + Y(p1.y) + '"/>'); }
          if (o.arrow) { const dir = g.rot(g.dir(s.a1), PI / 2); head(g.polar(s.v, r, s.a1), dir, fs * 0.45, o.cls, step); }
          if (o.label != null) { const m = (s.a0 + s.a1) / 2; textEl(g.polar(s.v, r + fs * 0.75 * (o.labelDist || 1), m), o.label, o, o.cls, step, 'middle', 'middle'); }
          break; }
        case 'rightangle': {
          const L = fs * 0.55 * (o.r || 1), da = g.unit(g.sub(s.a, s.v)), db = g.unit(g.sub(s.b, s.v));
          const p1 = g.add(s.v, g.mul(da, L)), p2 = g.add(g.add(s.v, g.mul(da, L)), g.mul(db, L)), p3 = g.add(s.v, g.mul(db, L));
          out(step, '<path class="ink ' + (o.cls || 'cons') + '" style="fill:none;stroke:' + (COLORS[o.cls || 'cons'] || '#4b4b4b') + ';stroke-width:' + f2(lw.cons) + '" d="M' + X(p1.x) + ' ' + Y(p1.y) + 'L' + X(p2.x) + ' ' + Y(p2.y) + 'L' + X(p3.x) + ' ' + Y(p3.y) + '"/>'); break; }
        case 'dim': {
          const m = g.mid(s.a, s.b), n = g.perp(g.unit(g.sub(s.b, s.a))), side = o.side === 'right' ? -1 : 1;
          const p = g.add(m, g.mul(n, side * fs * 0.6 * (o.dist || 1)));
          textEl(p, s.text, o, o.cls, step, 'middle', 'middle'); break; }
        case 'hatch': {                                           // parallel lines at o.angle (default 45°) clipped to the polygon
          const ang = o.angle != null ? o.angle : PI / 4, gap = S * 0.016 * (o.gap || 1);
          const u = g.dir(ang), n = g.perp(u);
          const pts = s.pts; let lo = Infinity, hi = -Infinity, slo = Infinity, shi = -Infinity;
          pts.forEach(p => { const d = g.dot(p, n), e = g.dot(p, u); if (d < lo) lo = d; if (d > hi) hi = d; if (e < slo) slo = e; if (e > shi) shi = e; });
          let d = '';
          for (let c = lo + gap / 2; c < hi; c += gap) {
            const A = g.add(g.mul(n, c), g.mul(u, slo - 1)), Bp = g.add(g.mul(n, c), g.mul(u, shi + 1));
            const xs = [];
            for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; const r = g.segSeg(A, Bp, p, q); if (r) xs.push(g.dot(r, u)); }
            xs.sort((a, b) => a - b);
            for (let i = 0; i + 1 < xs.length; i += 2) { if (xs[i + 1] - xs[i] < 1e-9) continue; const p = g.add(g.mul(n, c), g.mul(u, xs[i])), q = g.add(g.mul(n, c), g.mul(u, xs[i + 1]));
              d += 'M' + X(p.x) + ' ' + Y(p.y) + 'L' + X(q.x) + ' ' + Y(q.y); }
          }
          if (o.fill) out(step, '<path class="fill" style="fill:' + o.fill + '" d="' + pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ' ' + Y(p.y)).join('') + 'Z"/>');
          out(step, '<path class="ink hatchline' + (o.cls ? ' ' + o.cls : '') + '" style="fill:none;stroke-width:' + f2(lw.hatchline * (o.w || 1)) + ';stroke:' + (o.stroke || '#2a2a2a') + '" d="' + d + '"/>');
          if (o.outline) out(step, '<path class="ink given" style="fill:none;stroke:#1b1b1b;stroke-width:' + f2(lw.cons) + '" d="' + pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ' ' + Y(p.y)).join('') + 'Z"/>');
          break; }
      }
    });

    const size = opts.size || 480;
    const w = size, h = Math.round(size * H / W);
    let s = '';
    if (opts.standalone) s += '<?xml version="1.0" encoding="UTF-8"?>\n';
    s += '<svg xmlns="http://www.w3.org/2000/svg" class="cw" viewBox="0 0 ' + f2(W) + ' ' + f2(H) + '"' + (opts.noSize ? '' : ' width="' + w + '" height="' + h + '"') + ' data-fig="' + esc(fig.id) + '">\n';
    if (opts.standalone) {
      s += '<title>' + esc(fig.caption + ' — ' + (fig.title || '')) + '</title>\n';
      s += '<desc>' + esc('Redrawn from Robert C. Yates, A Handbook on Curves and Their Properties (1947), ' + fig.caption + ', page ' + (fig.page || '?') + '. Section: ' + (fig.section || '') + '.') + '</desc>\n';
      s += '<style>' + C.STYLE + '</style>\n';
      s += '<rect width="100%" height="100%" fill="#fff"/>\n';
    }
    sc.steps.forEach(st => {
      if (st.i > upTo) return;
      const items = stepGroups.get(st.i) || [];
      s += '<g class="step" data-step="' + st.i + '" data-tool="' + esc(st.tool) + '" data-text="' + esc(st.text) + '">\n' + items.join('\n') + '\n</g>\n';
    });
    s += '</svg>\n';
    return s;
  };

  /* P_1, P_{12}, T', x^2 → tspans; Greek letters are typed as they are */
  function richText(t) {
    let s = esc(t).replace(/\\bar\{([^}]*)\}/g, (m, a) => a + '̄');   // \bar{A} → Ā
    s = s.replace(/_\{([^}]*)\}|_(\S)/g, (m, a, b) => '<tspan baseline-shift="sub" font-size="70%">' + (a != null ? a : b) + '</tspan>');
    s = s.replace(/\^\{([^}]*)\}|\^(\S)/g, (m, a, b) => '<tspan baseline-shift="super" font-size="70%">' + (a != null ? a : b) + '</tspan>');
    return s;
  }
  C.richText = richText;

  /* ------------------------------------------------------------------ practice targets */
  /* The elements a learner must reproduce on the practice board, step by step. */
  C.targets = function (scene) {
    const T = [];
    scene.steps.forEach(st => {
      const tool = st.tool;
      const wanted = ['straightedge', 'compass', 'dividers', 'ruler', 'square', 'protractor', 'pencil'].includes(tool);
      st.shapes.forEach(s => {
        if (s.o && s.o.target === false) return;
        if (!(wanted || (s.o && s.o.target))) return;
        if (s.o && (s.o.cls === 'aux' || s.o.cls === 'axis')) return;
        if (s.t === 'seg' || s.t === 'line' || s.t === 'ray') T.push({ step: st.i, tool, t: 'line', a: s.a, b: s.b, kind: s.t });
        else if (s.t === 'circle') T.push({ step: st.i, tool, t: 'circle', c: s.c, r: s.r });
        else if (s.t === 'arc') T.push({ step: st.i, tool, t: 'circle', c: s.c, r: s.r, a0: s.a0, a1: s.a1 });
        else if (s.t === 'point') T.push({ step: st.i, tool, t: 'point', p: s.p });
        else if (s.t === 'curve') T.push({ step: st.i, tool, t: 'curve', pts: s.pts.filter(Boolean) });
      });
    });
    return T;
  };
})(typeof window !== 'undefined' ? window : globalThis);
