/* view.js — a small 2D camera plus the drawing primitives every panel shares.
 * World y points up; screen y points down, so the camera flips it once here
 * and nothing else in the app has to think about it again.
 */
'use strict';

class View {
  constructor(cv, opts) {
    opts = opts || {};
    this.cv = cv;
    this.ctx = cv.getContext('2d');
    this.scale = 100; this.ox = 0; this.oy = 0;
    this.dpr = 1; this.w = 1; this.h = 1;
    this.onChange = opts.onChange || null;
    if (opts.interactive !== false) this._bindPanZoom();
  }

  resize() {
    const cv = this.cv, rect = cv.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr; cv.height = h * dpr;
    }
    this.dpr = dpr; this.w = w; this.h = h;
    return this;
  }

  /* world → screen (CSS pixels) */
  x(wx) { return this.ox + wx * this.scale; }
  y(wy) { return this.oy - wy * this.scale; }
  /* screen → world */
  wx(sx) { return (sx - this.ox) / this.scale; }
  wy(sy) { return (this.oy - sy) / this.scale; }

  /** Frame a world box [x0,y0,x1,y1] with a margin fraction. */
  fit(box, pad) {
    pad = pad == null ? 0.09 : pad;
    const bw = Math.max(1e-6, box[2] - box[0]), bh = Math.max(1e-6, box[3] - box[1]);
    const s = Math.min(this.w / bw, this.h / bh) * (1 - 2 * pad);
    this.scale = s;
    this.ox = this.w / 2 - (box[0] + box[2]) / 2 * s;
    this.oy = this.h / 2 + (box[1] + box[3]) / 2 * s;
    return this;
  }

  begin(bg) {
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (bg) { c.fillStyle = bg; c.fillRect(0, 0, this.w, this.h); }
    else c.clearRect(0, 0, this.w, this.h);
    return c;
  }

  _bindPanZoom() {
    const cv = this.cv;
    let drag = null;
    cv.addEventListener('pointerdown', (e) => {
      if (this.onDown && this.onDown(e) === true) return;      /* view lets tools claim the press */
      drag = { x: e.clientX, y: e.clientY, ox: this.ox, oy: this.oy };
      cv.setPointerCapture(e.pointerId); cv.classList.add('drag');
    });
    cv.addEventListener('pointermove', (e) => {
      if (this.onMove) this.onMove(e);
      if (!drag) return;
      this.ox = drag.ox + (e.clientX - drag.x);
      this.oy = drag.oy + (e.clientY - drag.y);
      if (this.onChange) this.onChange();
    });
    const end = (e) => {
      if (this.onUp) this.onUp(e);
      drag = null; cv.classList.remove('drag');
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = cv.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const wx = this.wx(mx), wy = this.wy(my);
      const f = Math.exp(-e.deltaY * 0.0012);
      this.scale = clamp(this.scale * f, 4, 40000);
      this.ox = mx - wx * this.scale;
      this.oy = my + wy * this.scale;
      if (this.onChange) this.onChange();
    }, { passive: false });
  }
}

/* ── primitives ──────────────────────────────────────────────────────
 * All of these take world coordinates and a View.
 */

/**
 * Append a polar curve to the CURRENT path, without starting a new one, so
 * several curves can share one path — which is how an even-odd fill draws
 * the band between two outlines.
 */
function polarSubPath(v, r, rot, cx, cy, step) {
  const c = v.ctx, N = r.length, k = step || 1;
  const co = Math.cos(rot), si = Math.sin(rot);
  for (let i = 0; i <= N; i += k) {
    const idx = i % N, t = idx * TAU / N;
    const bx = r[idx] * Math.cos(t), by = r[idx] * Math.sin(t);
    const X = cx + co * bx - si * by, Y = cy + si * bx + co * by;
    if (i === 0) c.moveTo(v.x(X), v.y(Y)); else c.lineTo(v.x(X), v.y(Y));
  }
  c.closePath();
}

/** Build (but do not stroke) the path of a polar curve placed in the world. */
function polarPath(v, r, rot, cx, cy, step) {
  v.ctx.beginPath();
  polarSubPath(v, r, rot, cx, cy, step);
}

function strokePolar(v, r, rot, cx, cy, style, width, dash) {
  const c = v.ctx;
  c.save();
  if (dash) c.setLineDash(dash);
  polarPath(v, r, rot, cx, cy);
  c.strokeStyle = style; c.lineWidth = width || 1.5; c.lineJoin = 'round';
  c.stroke(); c.restore();
}

function fillPolar(v, r, rot, cx, cy, fill, stroke, width) {
  const c = v.ctx;
  polarPath(v, r, rot, cx, cy);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width || 1.6; c.lineJoin = 'round'; c.stroke(); }
}

function line(v, p, q, style, width, dash) {
  const c = v.ctx;
  c.save(); if (dash) c.setLineDash(dash);
  c.beginPath(); c.moveTo(v.x(p[0]), v.y(p[1])); c.lineTo(v.x(q[0]), v.y(q[1]));
  c.strokeStyle = style; c.lineWidth = width || 1; c.stroke(); c.restore();
}

function circle(v, p, rWorld, fill, stroke, width, dash) {
  const c = v.ctx;
  c.save(); if (dash) c.setLineDash(dash);
  c.beginPath(); c.arc(v.x(p[0]), v.y(p[1]), Math.abs(rWorld) * v.scale, 0, TAU);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width || 1; c.stroke(); }
  c.restore();
}

function dot(v, p, rPx, fill, ring) {
  const c = v.ctx;
  c.beginPath(); c.arc(v.x(p[0]), v.y(p[1]), rPx, 0, TAU);
  c.fillStyle = fill; c.fill();
  if (ring) { c.strokeStyle = ring; c.lineWidth = 1.5; c.stroke(); }
}

/** Arrow from p to p+d (world units), head sized in pixels. */
function arrow(v, p, d, style, width, head) {
  const c = v.ctx;
  const x0 = v.x(p[0]), y0 = v.y(p[1]);
  const x1 = v.x(p[0] + d[0]), y1 = v.y(p[1] + d[1]);
  const L = Math.hypot(x1 - x0, y1 - y0);
  if (L < 0.6) return;
  const ux = (x1 - x0) / L, uy = (y1 - y0) / L, hs = Math.min(head || 7, L * 0.5);
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - ux * hs * 0.75, y1 - uy * hs * 0.75);
  c.strokeStyle = style; c.lineWidth = width || 1.8; c.lineCap = 'round'; c.stroke();
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x1 - ux * hs - uy * hs * 0.45, y1 - uy * hs + ux * hs * 0.45);
  c.lineTo(x1 - ux * hs + uy * hs * 0.45, y1 - uy * hs - ux * hs * 0.45);
  c.closePath(); c.fillStyle = style; c.fill();
}

/** Text with a dark halo so it survives any background. */
function label(v, p, text, style, dx, dy, font, align) {
  const c = v.ctx;
  c.font = font || '11px "Segoe UI",system-ui,sans-serif';
  c.textAlign = align || 'left'; c.textBaseline = 'middle';
  const X = v.x(p[0]) + (dx || 0), Y = v.y(p[1]) + (dy || 0);
  c.lineWidth = 3.4; c.strokeStyle = 'rgba(10,12,18,.92)'; c.lineJoin = 'round';
  c.strokeText(text, X, Y);
  c.fillStyle = style; c.fillText(text, X, Y);
}

/** Axle cross: the little centre marker on each gear. */
function axle(v, p, style) {
  const c = v.ctx, X = v.x(p[0]), Y = v.y(p[1]);
  c.strokeStyle = style; c.lineWidth = 1.3;
  c.beginPath();
  c.moveTo(X - 7, Y); c.lineTo(X + 7, Y); c.moveTo(X, Y - 7); c.lineTo(X, Y + 7);
  c.stroke();
  c.beginPath(); c.arc(X, Y, 3.2, 0, TAU); c.stroke();
}

/** Faint world grid, spacing chosen so lines stay ~60–140 px apart. */
function grid(v, style, axisStyle) {
  const c = v.ctx;
  let step = Math.pow(10, Math.floor(Math.log10(90 / v.scale)));
  while (step * v.scale < 55) step *= 2;
  while (step * v.scale > 150) step /= 2;
  const x0 = Math.floor(v.wx(0) / step) * step, x1 = v.wx(v.w);
  const y0 = Math.floor(v.wy(v.h) / step) * step, y1 = v.wy(0);
  c.strokeStyle = style; c.lineWidth = 1;
  c.beginPath();
  for (let x = x0; x <= x1; x += step) { c.moveTo(Math.round(v.x(x)) + .5, 0); c.lineTo(Math.round(v.x(x)) + .5, v.h); }
  for (let y = y0; y <= y1; y += step) { c.moveTo(0, Math.round(v.y(y)) + .5); c.lineTo(v.w, Math.round(v.y(y)) + .5); }
  c.stroke();
  if (axisStyle) {
    c.strokeStyle = axisStyle; c.beginPath();
    c.moveTo(0, Math.round(v.y(0)) + .5); c.lineTo(v.w, Math.round(v.y(0)) + .5);
    c.moveTo(Math.round(v.x(0)) + .5, 0); c.lineTo(Math.round(v.x(0)) + .5, v.h);
    c.stroke();
  }
}

/* ── tiny line plot, used in the analysis panel ──────────────────── */
function plot(cv, series, opts) {
  opts = opts || {};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = cv.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
  if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
  const c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  let lo = opts.lo, hi = opts.hi;
  if (lo == null) {
    lo = Infinity; hi = -Infinity;
    for (const s of series) for (const v of s.data) { if (v < lo) lo = v; if (v > hi) hi = v; }
  }
  if (!isFinite(lo) || !isFinite(hi)) { lo = 0; hi = 1; }
  /* a constant series (a circular pair's ratio, say) should read as a flat
     line through the middle, not as an empty box */
  if (hi - lo < 1e-9) { const c0 = lo; lo = c0 - 0.5; hi = c0 + 0.5; }
  const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
  const Y = (v) => h - 4 - (v - lo) / (hi - lo) * (h - 8);

  if (opts.zero != null && opts.zero >= lo && opts.zero <= hi) {
    c.strokeStyle = '#2a3040'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, Y(opts.zero)); c.lineTo(w, Y(opts.zero)); c.stroke();
  }
  for (const s of series) {
    const n = s.data.length; if (!n) continue;
    c.beginPath();
    for (let i = 0; i < n; i++) { const X = i / (n - 1) * w; if (i === 0) c.moveTo(X, Y(s.data[i])); else c.lineTo(X, Y(s.data[i])); }
    c.strokeStyle = s.color; c.lineWidth = s.width || 1.6; c.lineJoin = 'round'; c.stroke();
    if (s.fill) { c.lineTo(w, h); c.lineTo(0, h); c.closePath(); c.fillStyle = s.fill; c.fill(); }
  }
  if (opts.cursor != null) {
    const X = clamp(opts.cursor, 0, 1) * w;
    c.strokeStyle = '#e7eaf2'; c.lineWidth = 1; c.globalAlpha = .55;
    c.beginPath(); c.moveTo(X, 0); c.lineTo(X, h); c.stroke(); c.globalAlpha = 1;
  }
  if (opts.note) {
    c.font = '9.5px "Segoe UI",system-ui,sans-serif'; c.fillStyle = '#6b7488';
    c.textAlign = 'right'; c.textBaseline = 'top';
    c.fillText(opts.note, w - 4, 3);
  }
}
