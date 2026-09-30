/* The Puzzle Cabinet · engines/construct.js
 *
 * Compass and straightedge: Euclid's game. The board shows given points,
 * lines and circles; the player draws lines through two points and circles
 * with a centre through a point, and puts points where things cross. Derived
 * tools (perpendicular bisector, perpendicular, parallel, angle bisector,
 * compass that carries a length) are unlocked in Euclid's order and count as
 * one L move but several E moves (the elementary moves they stand for).
 *
 * data: {
 *   given: [                       what is on the board at the start
 *     ['pt', 'A', x, y, anchor?]   a point (a name starting with _ has no label; anchor 'n' 'ne' … places the label)
 *     ['seg', 'A', 'B', name?]     a segment, ['line', …] an endless line, ['ray', 'V', 'A'] a ray from V
 *     ['circ', 'O', 'A', name?]    a circle centred at the point O through the point A
 *     ['circle', name, cx, cy, r]  a circle whose centre is not marked
 *     ['lxy', name, x1, y1, x2, y2]  an endless line with no marked points
 *   ],
 *   targets: [                     what must be built (numbers, in the board's own coordinates)
 *     ['P', x, y]                  a point (a crossing of two drawn things counts)
 *     ['L', x1, y1, x2, y2]        the line through these two places
 *     ['S', x1, y1, x2, y2]        a side: a drawn line covering this segment
 *     ['C', cx, cy, r]             a circle
 *     ['D', d]                     two points this far apart (or a circle of this radius)
 *     ['any', [targets…], [targets…]]   one of these sets
 *   ],
 *   tools: ['point', 'line', 'circle', 'perpbis', …],   the tools on offer
 *   free: true | 'on' | false,     free points anywhere / only on lines and circles / none
 *   sol:  [steps…]                 the stored solution (the par in L moves; hints and the shown solution)
 *   solE: [steps…]                 optional: a solution with fewer elementary moves (the E par)
 *   parL, parE                     the pars
 * }
 * A step: ['circle', name, O, A] ['line', name, A, B] ['compass', name, A, B, O] (radius AB, centre O)
 *         ['perpbis', name, A, B] ['perp', name, line, P] ['parallel', name, line, P] ['bisect', name, A, V, B]
 *         ['x', name, obj1, obj2, sel] a crossing (sel: 'up' 'down' 'left' 'right', '!P' not P, '~P' nearest P, [x, y] nearest)
 *         ['pt', name, x, y] a free point, ['on', name, obj, t] a point on a line (t along it) or circle (t in degrees)
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the geometry kernel: node-safe, shared by verify, the board and the generator ---------- */

  const TOL = 1e-6;   // points closer than this are one point; targets match within it
  const TAN = 1e-9;   // relative: a crossing this close to touching counts as one touching point

  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const unit = (a) => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
  const perp = (a) => [-a[1], a[0]];
  const xy = (p) => [p.x, p.y];

  const TOOLS = {
    point: { L: 0, E: 0, name: 'Point', icon: 'M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0M12 4v3M12 17v3M4 12h3M17 12h3', verb: 'Put a point on a crossing, on a line or circle, or on the plane.' },
    line: { L: 1, E: 1, name: 'Straightedge', icon: 'M3.5 19.5l17-15M6 17.2a1.6 1.6 0 11-.1 0M18 6.6a1.6 1.6 0 11-.1 0', verb: 'A line through two points.' },
    circle: { L: 1, E: 1, name: 'Compass', icon: 'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0M12 12l5.6 5.6M12 12h.01', verb: 'A circle: its centre, then a point it passes through.' },
    compass: { L: 1, E: 5, name: 'Carry a length', icon: 'M12 3.5l-5 16M12 3.5l5 16M12 3.5v-1M8.2 14.6h7.6M5 20.5c2 .9 4.3 1.4 7 1.4s5-.5 7-1.4', verb: 'A rigid compass: pick two points for the radius, then the centre.', proof: 'Euclid I.2' },
    perpbis: { L: 1, E: 3, name: 'Perpendicular bisector', icon: 'M4 16h16M12 3v18M6.5 16a.1.1 0 100 .01M17.5 16a.1.1 0 100 .01M12 16h2.5v-2.5H12', verb: 'The line of points equally far from two points.', proof: 'Euclid I.10' },
    perp: { L: 1, E: 3, name: 'Perpendicular', icon: 'M3 18h18M12 18V4M12 14.5h3.5V18M12 7.5a.1.1 0 100 .01', verb: 'A line at right angles to a line, through a point.', proof: 'Euclid I.11–12' },
    parallel: { L: 1, E: 4, name: 'Parallel', icon: 'M3 16.5L21 11M3 11L21 5.5M13 8.3a.1.1 0 100 .01', verb: 'A line through a point that never meets a given line.', proof: 'Euclid I.31' },
    bisect: { L: 1, E: 4, name: 'Angle bisector', icon: 'M4 19L20 5M4 19h16M4 19l15.5-7', verb: 'The line that halves an angle: a point on one arm, the vertex, a point on the other arm.', proof: 'Euclid I.9' }
  };
  const TOOL_ORDER = ['point', 'line', 'circle', 'compass', 'perpbis', 'perp', 'parallel', 'bisect'];
  const PICKS = { // what each tool asks for, in order: 'p' a point, 'l' a line
    point: ['p'], line: ['p', 'p'], circle: ['p', 'p'], compass: ['p', 'p', 'p'],
    perpbis: ['p', 'p'], perp: ['l', 'p'], parallel: ['l', 'p'], bisect: ['p', 'p', 'p']
  };

  function lineDir(o) { return unit(sub(o.b, o.a)); }
  function lineRange(o) {
    if (o.kind === 'seg') return [0, dist(o.a, o.b)];
    if (o.kind === 'ray') return [0, Infinity];
    return [-Infinity, Infinity];
  }
  function onExtent(o, p) {
    if (o.k !== 'L' || o.kind === 'line') return true;
    const t = dot(sub(p, o.a), lineDir(o)), r = lineRange(o);
    return t >= r[0] - TOL && t <= r[1] + TOL;
  }
  function distToLine(p, o) { return Math.abs(cross(lineDir(o), sub(p, o.a))); }

  function llx(l1, l2) {
    const u = lineDir(l1), v = lineDir(l2), den = cross(u, v);
    if (Math.abs(den) < 1e-12) return [];
    const t = cross(sub(l2.a, l1.a), v) / den;
    return [add(l1.a, mul(u, t))];
  }
  function lcx(l, c) {
    const u = lineDir(l), t0 = dot(sub(c.c, l.a), u), foot = add(l.a, mul(u, t0));
    const d2 = dot(sub(c.c, foot), sub(c.c, foot)), h2 = c.r * c.r - d2;
    const s = TAN * c.r * c.r;
    if (h2 < -s) return [];
    if (h2 <= s) return [foot];
    const h = Math.sqrt(h2);
    return [sub(foot, mul(u, h)), add(foot, mul(u, h))];
  }
  function ccx(c1, c2) {
    const d = dist(c1.c, c2.c);
    if (d < 1e-12) return [];
    const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d), h2 = c1.r * c1.r - a * a;
    const s = TAN * Math.max(c1.r, c2.r) * Math.max(c1.r, c2.r);
    if (h2 < -s) return [];
    const e = unit(sub(c2.c, c1.c)), base = add(c1.c, mul(e, a));
    if (h2 <= s) return [base];
    const h = Math.sqrt(h2), n = perp(e);
    return [add(base, mul(n, h)), sub(base, mul(n, h))];
  }
  // where two drawn things cross (0, 1 or 2 points), within the extent of segments and rays
  function meet(o1, o2) {
    let pts;
    if (o1.k === 'L' && o2.k === 'L') pts = llx(o1, o2);
    else if (o1.k === 'L') pts = lcx(o1, o2);
    else if (o2.k === 'L') pts = lcx(o2, o1);
    else pts = ccx(o1, o2);
    return pts.filter((p) => onExtent(o1, p) && onExtent(o2, p));
  }
  // the nearest place on a thing to p
  function project(o, p) {
    if (o.k === 'C') { const d = sub(p, o.c), l = Math.hypot(d[0], d[1]); return l < 1e-12 ? add(o.c, [o.r, 0]) : add(o.c, mul(d, o.r / l)); }
    const u = lineDir(o), r = lineRange(o);
    const t = Math.max(r[0], Math.min(r[1], dot(sub(p, o.a), u)));
    return add(o.a, mul(u, t));
  }
  function distTo(o, p) { return o.k === 'C' ? Math.abs(dist(p, o.c) - o.r) : dist(p, project(o, p)); }
  function sameLine(o, a, b) { return o.k === 'L' && distToLine(a, o) < TOL && distToLine(b, o) < TOL; }
  function sameObj(o1, o2) {
    if (o1.k !== o2.k) return false;
    if (o1.k === 'C') return dist(o1.c, o2.c) < TOL && Math.abs(o1.r - o2.r) < TOL;
    return sameLine(o1, o2.a, o2.b) && o1.kind === 'line' && o2.kind === 'line';
  }

  /* ---------- a scene: points and drawn things ---------- */

  function Scene() { this.pts = []; this.objs = []; this.by = {}; this.seq = 0; this.cand = null; this.L = 0; this.E = 0; }
  Scene.prototype.id = function (pre) { let id; do { id = pre + (++this.seq); } while (this.by[id]); return id; };
  Scene.prototype.ptAt = function (p, tol) {
    tol = tol || TOL;
    for (const q of this.pts) if (Math.abs(q.x - p[0]) < tol && Math.abs(q.y - p[1]) < tol && Math.hypot(q.x - p[0], q.y - p[1]) < tol) return q;
    return null;
  };
  Scene.prototype.addPt = function (name, p, extra) {
    const old = this.ptAt(p);
    if (old) { if (name && !this.by[name]) this.by[name] = old; return old; }
    const id = name && !this.by[name] ? name : this.id('p');
    const q = Object.assign({ id, k: 'P', x: p[0], y: p[1] }, extra || {});
    this.pts.push(q);
    this.by[id] = q;
    if (name && name !== id) this.by[name] = q;
    this.cand = null;
    return q;
  };
  Scene.prototype.addObj = function (name, o) {
    o.id = name && !this.by[name] ? name : this.id('o');
    this.objs.push(o);
    this.by[o.id] = o;
    if (name && name !== o.id) this.by[name] = o;
    this.cand = null;
    return o;
  };
  Scene.prototype.get = function (name, kind) {
    const o = this.by[name];
    if (!o) throw new Error('unknown name ' + name);
    if (kind === 'P' && o.k !== 'P') throw new Error(name + ' is not a point');
    if (kind === 'L' && o.k !== 'L') throw new Error(name + ' is not a line');
    if (kind === 'O' && o.k === 'P') throw new Error(name + ' is not a line or circle');
    return o;
  };
  Scene.prototype.clone = function () {
    const s = new Scene();
    s.pts = this.pts.slice(); s.objs = this.objs.slice(); s.by = Object.assign({}, this.by); s.seq = this.seq; s.L = this.L; s.E = this.E;
    return s;
  };
  // crossings that are not yet points: [{ x, y, a, b }]
  Scene.prototype.crossings = function () {
    if (this.cand) return this.cand;
    const out = [];
    const objs = this.objs;
    for (let i = 0; i < objs.length; i++) {
      for (let j = i + 1; j < objs.length; j++) {
        meet(objs[i], objs[j]).forEach((p) => {
          if (this.ptAt(p)) return;
          if (out.some((q) => Math.abs(q.x - p[0]) < TOL && Math.abs(q.y - p[1]) < TOL)) return;
          out.push({ x: p[0], y: p[1], a: objs[i].id, b: objs[j].id });
        });
      }
    }
    this.cand = out;
    return out;
  };
  // the place of a point: an existing point, or a crossing
  Scene.prototype.hasPlace = function (p) {
    if (this.ptAt(p)) return true;
    return this.crossings().some((q) => Math.abs(q.x - p[0]) < TOL && Math.abs(q.y - p[1]) < TOL);
  };

  function givenScene(d) {
    const s = new Scene();
    (d.given || []).forEach((g) => {
      const t = g[0];
      if (t === 'pt') s.addPt(g[1], [g[2], g[3]], { given: true, label: g[1].charAt(0) === '_' ? '' : g[1], anchor: g[4] || null });
      else if (t === 'seg' || t === 'line' || t === 'ray') {
        const a = s.get(g[1], 'P'), b = s.get(g[2], 'P');
        s.addObj(g[3] || (t === 'ray' ? 'ray' + g[1] + g[2] : g[1] + g[2]), { k: 'L', kind: t, a: xy(a), b: xy(b), given: true, from: [a.id, b.id] });
      } else if (t === 'circ') {
        const o = s.get(g[1], 'P'), a = s.get(g[2], 'P');
        s.addObj(g[3] || 'c' + g[1] + g[2], { k: 'C', c: xy(o), r: dist(xy(o), xy(a)), given: true, from: [o.id, a.id] });
      } else if (t === 'circle') {
        s.addObj(g[1], { k: 'C', c: [g[2], g[3]], r: g[4], given: true, from: [] });
      } else if (t === 'lxy') {
        s.addObj(g[1], { k: 'L', kind: 'line', a: [g[2], g[3]], b: [g[4], g[5]], given: true, from: [] });
      } else throw new Error('unknown given ' + t);
    });
    s.seq = 0;
    return s;
  }

  function pickCrossing(s, pts, sel) {
    if (pts.length <= 1 || sel == null) return pts[0];
    if (Array.isArray(sel)) return pts.slice().sort((p, q) => dist(p, sel) - dist(q, sel))[0];
    if (typeof sel === 'number') return pts[Math.min(sel, pts.length - 1)];
    const by = (f) => pts.slice().sort((p, q) => f(p) - f(q))[0];
    if (sel === 'up') return by((p) => p[1]);
    if (sel === 'down') return by((p) => -p[1]);
    if (sel === 'left') return by((p) => p[0]);
    if (sel === 'right') return by((p) => -p[0]);
    if (sel.charAt(0) === '!') { const q = xy(s.get(sel.slice(1), 'P')); return by((p) => -dist(p, q)); }
    if (sel.charAt(0) === '~') { const q = xy(s.get(sel.slice(1), 'P')); return by((p) => dist(p, q)); }
    throw new Error('bad crossing selector ' + sel);
  }

  // the line or circle a tool makes from its picks (points / lines as scene elements); null if it cannot
  function toolObject(tool, picks) {
    const P = (i) => xy(picks[i]);
    switch (tool) {
      case 'line': {
        if (dist(P(0), P(1)) < TOL) return null;
        return { k: 'L', kind: 'line', a: P(0), b: P(1) };
      }
      case 'circle': {
        const r = dist(P(0), P(1));
        if (r < TOL) return null;
        return { k: 'C', c: P(0), r };
      }
      case 'compass': {
        const r = dist(P(0), P(1));
        if (r < TOL) return null;
        return { k: 'C', c: P(2), r };
      }
      case 'perpbis': {
        const a = P(0), b = P(1), l = dist(a, b);
        if (l < TOL) return null;
        const m = mul(add(a, b), 0.5), n = mul(perp(sub(b, a)), 1 / l);
        return { k: 'L', kind: 'line', a: m, b: add(m, n) };
      }
      case 'perp': case 'parallel': {
        const l = picks[0], p = P(1);
        if (!l || l.k !== 'L') return null;
        const u = lineDir(l), d = tool === 'perp' ? perp(u) : u;
        return { k: 'L', kind: 'line', a: p, b: add(p, d) };
      }
      case 'bisect': {
        const a = P(0), v = P(1), b = P(2);
        if (dist(a, v) < TOL || dist(b, v) < TOL) return null;
        const ua = unit(sub(a, v)), ub = unit(sub(b, v));
        if (Math.abs(cross(ua, ub)) < 1e-9 && dot(ua, ub) > 0) return null;
        let d = add(ua, ub);
        if (Math.hypot(d[0], d[1]) < 1e-9) d = perp(ua);
        return { k: 'L', kind: 'line', a: v, b: add(v, unit(d)) };
      }
      default: return null;
    }
  }

  // play one step; returns the new element. Throws when the step cannot be made.
  function applyStep(s, st, opts) {
    opts = opts || {};
    const t = st[0], name = st[1];
    switch (t) {
      case 'pt': return s.addPt(name, [st[2], st[3]], { free: true });
      case 'on': {
        const o = s.get(st[2], 'O');
        const p = o.k === 'C' ? add(o.c, [o.r * Math.cos(st[3] * Math.PI / 180), o.r * Math.sin(st[3] * Math.PI / 180)]) : add(o.a, mul(lineDir(o), st[3]));
        return s.addPt(name, p, { free: true, on: o.id });
      }
      case 'x': {
        const a = s.get(st[2], 'O'), b = s.get(st[3], 'O');
        const pts = meet(a, b);
        if (!pts.length) throw new Error(st[2] + ' and ' + st[3] + ' do not cross');
        return s.addPt(name, pickCrossing(s, pts, st[4]), { via: [a.id, b.id] });
      }
      default: {
        const tool = TOOLS[t];
        if (!tool || t === 'point') throw new Error('unknown step ' + t);
        const kinds = PICKS[t];
        const picks = st.slice(2, 2 + kinds.length).map((n, i) => s.get(n, kinds[i] === 'l' ? 'L' : 'P'));
        const o = toolObject(t, picks);
        if (!o) throw new Error(t + ' cannot be drawn from ' + st.slice(2).join(', '));
        if (opts.lineKind && t === 'line' && opts.lineKind !== 'line') o.kind = opts.lineKind;
        o.tool = t;
        o.from = picks.map((q) => q.id);
        s.L += tool.L; s.E += tool.E;
        return s.addObj(name, o);
      }
    }
  }

  function playSteps(d, steps, base) {
    const s = base || givenScene(d);
    (steps || []).forEach((st, i) => {
      try { applyStep(s, st, { lineKind: d.lineKind }); } catch (e) { throw new Error('step ' + (i + 1) + ' ' + JSON.stringify(st) + ': ' + e.message); }
    });
    return s;
  }

  /* ---------- goals ---------- */

  function targetMet(s, t) {
    switch (t[0]) {
      case 'P': return s.hasPlace([t[1], t[2]]);
      case 'L': return s.objs.some((o) => !o.given && sameLine(o, [t[1], t[2]], [t[3], t[4]]));
      case 'S': { const a = [t[1], t[2]], b = [t[3], t[4]]; return s.objs.some((o) => !o.given && sameLine(o, a, b) && onExtent(o, a) && onExtent(o, b)); }
      case 'C': return s.objs.some((o) => !o.given && o.k === 'C' && Math.abs(o.c[0] - t[1]) < TOL && Math.abs(o.c[1] - t[2]) < TOL && Math.abs(o.r - t[3]) < TOL);
      case 'D': {
        if (s.objs.some((o) => !o.given && o.k === 'C' && Math.abs(o.r - t[1]) < TOL)) return true;
        const pts = s.pts.map((p) => ({ x: p.x, y: p.y, g: p.given })).concat(s.crossings());
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            if (pts[i].g && pts[j].g) continue;
            if (Math.abs(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) - t[1]) < TOL) return true;
          }
        }
        return false;
      }
      case 'any': return t.slice(1).some((alt) => alt.every((u) => targetMet(s, u)));
      default: return false;
    }
  }
  function goalMet(s, d) { return (d.targets || []).every((t) => targetMet(s, t)); }
  // the targets to draw: for 'any', the first set not ruled out (the one nearest completion)
  function flatTargets(s, d) {
    const out = [];
    (d.targets || []).forEach((t) => {
      if (t[0] !== 'any') { out.push(t); return; }
      const alts = t.slice(1);
      let best = alts[0], bn = -1;
      alts.forEach((alt) => { const n = s ? alt.filter((u) => targetMet(s, u)).length : 0; if (n > bn) { bn = n; best = alt; } });
      best.forEach((u) => out.push(u));
    });
    return out;
  }

  function costOf(steps) {
    let L = 0, E = 0;
    (steps || []).forEach((st) => { const t = TOOLS[st[0]]; if (t) { L += t.L; E += t.E; } });
    return { L, E };
  }

  function bounds(d, wide) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const eat = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
    const s = givenScene(d);
    s.pts.forEach((p) => eat(p.x, p.y));
    s.objs.forEach((o) => {
      if (o.k === 'C') { eat(o.c[0] - o.r, o.c[1] - o.r); eat(o.c[0] + o.r, o.c[1] + o.r); }
      else if (!o.from.length) { eat(o.a[0], o.a[1]); eat(o.b[0], o.b[1]); } // a line with no marked points: its two defining places
    });
    const walk = (t) => {
      if (t[0] === 'P') eat(t[1], t[2]);
      else if (t[0] === 'S' || t[0] === 'L') { eat(t[1], t[2]); eat(t[3], t[4]); }
      else if (t[0] === 'C') { eat(t[1] - t[3], t[2] - t[3]); eat(t[1] + t[3], t[2] + t[3]); }
      else if (t[0] === 'any') t[1].forEach(walk); // frame the first answer; the others may lie off the board
      else if (t[0] === 'D' && s.pts.length) { const p = s.pts[0]; eat(p.x + t[1] * Math.cos(-0.9), p.y + t[1] * Math.sin(-0.9)); } // room for the length (the thumbnail draws it there)
    };
    (d.targets || []).forEach(walk);
    if (d.view) { eat(d.view[0], d.view[1]); eat(d.view[2], d.view[3]); }
    if (!isFinite(x0)) { x0 = -5; y0 = -5; x1 = 5; y1 = 5; }
    if (wide && d.sol) {
      // leave room for what the solution draws, but not more than about a third of the figure on each side
      const m = Math.max(x1 - x0, y1 - y0) * 0.35, b0 = [x0 - m, y0 - m, x1 + m, y1 + m];
      try {
        const ss = playSteps(d, d.sol);
        ss.pts.forEach((p) => eat(Math.max(b0[0], Math.min(b0[2], p.x)), Math.max(b0[1], Math.min(b0[3], p.y))));
        ss.objs.forEach((o) => { if (o.k === 'C') { eat(Math.max(b0[0], o.c[0] - o.r), Math.max(b0[1], o.c[1] - o.r)); eat(Math.min(b0[2], o.c[0] + o.r), Math.min(b0[3], o.c[1] + o.r)); } });
      } catch (e) { /* the frame of the givens will do */ }
    }
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    return { x0, y0, x1, y1, w, h, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, size: Math.max(w, h) };
  }

  const KERNEL = { TOL, TOOLS, TOOL_ORDER, PICKS, Scene, givenScene, applyStep, playSteps, toolObject, meet, project, distTo, sameObj, sameLine, targetMet, goalMet, flatTargets, costOf, bounds, lineDir, onExtent, describeStep };
  C.construct = KERNEL;

  function verify(p) {
    const d = p.data;
    if (!d || !d.given || !d.targets || !d.targets.length) return { ok: false, err: 'given and targets are needed' };
    if (!d.sol || !d.sol.length) return { ok: false, err: 'no stored solution' };
    const tools = d.tools || TOOL_ORDER;
    let start;
    try { start = givenScene(d); } catch (e) { return { ok: false, err: 'givens: ' + e.message }; }
    for (const t of d.targets) if (targetMet(start, t)) return { ok: false, err: 'a target is already there at the start: ' + JSON.stringify(t) };
    const check = (steps, label) => {
      for (const st of steps) {
        if (TOOLS[st[0]] && tools.indexOf(st[0]) < 0) return label + ' uses the tool ' + st[0] + ', which is not on offer';
        if ((st[0] === 'pt' && d.free !== true && d.free != null) || ((st[0] === 'pt' || st[0] === 'on') && d.free === false)) return label + ' uses a free point, which this puzzle does not allow';
      }
      let s;
      try { s = playSteps(d, steps); } catch (e) { return label + ': ' + e.message; }
      if (!goalMet(s, d)) {
        const miss = d.targets.filter((t) => !targetMet(s, t));
        return label + ' does not build every target; missing ' + JSON.stringify(miss).slice(0, 200);
      }
      return null;
    };
    let e = check(d.sol, 'sol');
    if (e) return { ok: false, err: e };
    const cs = costOf(d.sol);
    if (d.parL != null && cs.L !== d.parL) return { ok: false, err: 'parL is ' + d.parL + ' but the stored solution takes ' + cs.L + ' L' };
    let eBest = cs.E;
    if (d.solE) {
      e = check(d.solE, 'solE');
      if (e) return { ok: false, err: e };
      const ce = costOf(d.solE);
      if (ce.E > cs.E) return { ok: false, err: 'solE takes more E moves (' + ce.E + ') than sol (' + cs.E + ')' };
      if (ce.L < cs.L) return { ok: false, err: 'solE takes fewer L moves (' + ce.L + ') than sol (' + cs.L + '): make it the stored solution' };
      eBest = ce.E;
    }
    if (d.parE != null && eBest !== d.parE) return { ok: false, err: 'parE is ' + d.parE + ' but the stored solutions take ' + eBest + ' E' };
    const warn = d.sol.some((st) => st[0] === 'pt' || st[0] === 'on') ? 'the stored solution uses free points (live hints may drift)' : null;
    return warn ? { ok: true, warn } : { ok: true };
  }

  /* ---------- words ---------- */

  function costText(t) { const T = TOOLS[t]; return T.L ? T.L + ' L · ' + T.E + ' E' : 'free'; }
  function nameOfPoint(p) { return p && p.label ? '**' + p.label + '**' : null; }
  // describe a solution step for a hint, with the given labels where there are any
  function describeStep(ps, st, elem) {
    const el = elem || ps.by[st[1]] || null;
    const from = el && el.from ? el.from.map((id) => ps.by[id]) : [];
    const pn = (i) => nameOfPoint(from[i]) || 'the marked point';
    const ln = (o) => {
      if (!o) return 'the marked line';
      if (o.given && o.from && o.from.length === 2) {
        const a = ps.by[o.from[0]], b = ps.by[o.from[1]];
        if (a && b && a.label && b.label) return 'the line **' + a.label + b.label + '**';
      }
      return 'the marked line';
    };
    const two = () => {
      const a = nameOfPoint(from[0]), b = nameOfPoint(from[1]);
      if (a && b) return a + ' and ' + b;
      if (!a && !b) return 'the two marked points';
      return (a || b) + ' and the marked point';
    };
    switch (st[0]) {
      case 'line': return 'Draw the line through ' + two() + '.';
      case 'circle': return 'Draw the circle centred at ' + pn(0) + ' through ' + (nameOfPoint(from[1]) || (nameOfPoint(from[0]) ? 'the marked point' : 'the other marked point')) + '.';
      case 'compass': return 'With the rigid compass, carry the length from ' + pn(0) + ' to ' + (nameOfPoint(from[1]) || (nameOfPoint(from[0]) ? 'the marked point' : 'the other marked point')) + ' over to ' + (nameOfPoint(from[2]) || 'the marked point') + ' as a centre.';
      case 'perpbis': return 'Draw the perpendicular bisector of ' + two() + '.';
      case 'perp': return 'Draw the perpendicular to ' + ln(from[0]) + ' through ' + (nameOfPoint(from[1]) || 'the marked point') + '.';
      case 'parallel': return 'Draw the parallel to ' + ln(from[0]) + ' through ' + (nameOfPoint(from[1]) || 'the marked point') + '.';
      case 'bisect': {
        const a = nameOfPoint(from[0]), b = nameOfPoint(from[2]);
        const arms = a && b ? a + ' and ' + b : !a && !b ? 'the two marked points' : (a || b) + ' and the marked point';
        return 'Bisect the angle at ' + (nameOfPoint(from[1]) || 'the marked vertex') + ' between ' + arms + '.';
      }
      default: return 'Put a point where the marked things cross.';
    }
  }

  const PROMPTS = {
    point: ['**Point**: click a crossing, a line or circle, or the open plane.'],
    line: ['**Straightedge**: pick the first point.', 'Now the second point (Esc lets go).'],
    circle: ['**Compass**: pick the centre.', 'Now a point the circle passes through.'],
    compass: ['**Carry a length**: pick one end of the length.', 'Now its other end.', 'Now the centre for the carried circle.'],
    perpbis: ['**Perpendicular bisector**: pick the first point.', 'Now the second point.'],
    perp: ['**Perpendicular**: pick a line.', 'Now the point it must pass through.'],
    parallel: ['**Parallel**: pick a line.', 'Now the point it must pass through.'],
    bisect: ['**Angle bisector**: pick a point on one arm.', 'Now the vertex.', 'Now a point on the other arm.']
  };

  /* ---------- the board ---------- */

  function mount(ctx, p) {
    const wb = ctx.wb, d = p.data, h = ctx.s;
    const tools = (d.tools || TOOL_ORDER).filter((t) => TOOLS[t]);
    const B = bounds(d, true);
    const BIG = B.size * 80;
    const parL = d.parL != null ? d.parL : costOf(d.sol).L;
    const parE = d.parE != null ? d.parE : Math.min(costOf(d.sol).E, d.solE ? costOf(d.solE).E : Infinity);
    const free = d.free == null ? true : d.free;

    let steps = [];          // the player's construction, as kernel steps
    let scene = givenScene(d);
    let tool = null;         // the current construction tool (id) or null
    let picks = [];          // snaps chosen so far for the current tool
    let hov = null;          // the snap under the pointer
    let press = null;        // a press in progress
    let busy = false;        // an animation is running
    let animTok = 0;
    let showGoal = C.store.get('cx:goal', true) !== false;
    let hintEl = null, hintT = 0;
    let uid = 0;

    const L = { goal: h('g', { class: 'cx-goal' }, wb.layer('bg')) };
    L.objs = h('g', { class: 'cx-objs' }, wb.layer('board'));
    L.cand = h('g', { class: 'cx-cands' }, wb.layer('board'));
    L.pts = h('g', { class: 'cx-pts' }, wb.layer('board'));
    L.hint = h('g', { class: 'cx-hint' }, wb.layer('top'));
    L.hov = h('g', { class: 'cx-hov' }, wb.layer('top'));
    L.anim = h('g', { class: 'cx-anim' }, wb.layer('top'));
    const pad = B.size * 0.08;
    wb.setBounds({ x0: B.x0 - pad, y0: B.y0 - pad, x1: B.x1 + pad, y1: B.y1 + pad }, 0.04);

    const px = (n) => wb.px(n);
    const newId = (pre) => { let id; do { id = pre + (++uid); } while (scene.by[id]); return id; };

    /* ----- drawing the construction ----- */

    function lineEnds(o) {
      const u = lineDir(o);
      if (o.kind === 'seg') return [o.a, o.b];
      if (o.kind === 'ray') return [o.a, add(o.a, mul(u, BIG))];
      return [sub(o.a, mul(u, BIG)), add(o.a, mul(u, BIG))];
    }
    function drawObj(o, g, cls) {
      if (o.k === 'C') return h('circle', { cx: o.c[0], cy: o.c[1], r: o.r, class: cls }, g);
      const e = lineEnds(o);
      return h('line', { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1], class: cls }, g);
    }
    // sized in screen pixels: radius, font size, dashes (kept right as the view zooms)
    function spot(g, x, y, r, cls) { const c = h('circle', { cx: x, cy: y, r: px(r), class: cls, 'data-r': r }, g); return c; }
    function dashed(el, a, b) { el.setAttribute('data-dash', a + ' ' + b); el.setAttribute('stroke-dasharray', px(a) + ' ' + px(b)); return el; }
    let lastK = 0;
    function rescale(force) {
      if (!force && wb.v.k === lastK) return; // a pan: sizes are unchanged
      lastK = wb.v.k;
      wb.view.querySelectorAll('[data-r]').forEach((el) => el.setAttribute('r', px(+el.getAttribute('data-r'))));
      wb.view.querySelectorAll('[data-dash]').forEach((el) => el.setAttribute('stroke-dasharray', el.getAttribute('data-dash').split(' ').map((v) => px(+v)).join(' ')));
      wb.view.querySelectorAll('[data-fs]').forEach((el) => {
        el.setAttribute('font-size', px(+el.getAttribute('data-fs')));
        const at = el.cxAt;
        if (at) { el.setAttribute('x', at.x + at.dx * px(at.off)); el.setAttribute('y', at.y + at.dy * px(at.off)); }
      });
    }
    wb.on('view', rescale);

    const ANCH = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [0.72, -0.72], nw: [-0.72, -0.72], se: [0.72, 0.72], sw: [-0.72, 0.72] };
    const gc = (() => { const g = scene.pts.filter((q) => q.given); let x = 0, y = 0; g.forEach((q) => { x += q.x; y += q.y; }); return g.length ? [x / g.length, y / g.length] : [0, 0]; })();
    function labelDir(q) {
      if (q.anchor && ANCH[q.anchor]) return ANCH[q.anchor];
      const v = sub([q.x, q.y], gc);
      if (Math.hypot(v[0], v[1]) < B.size * 0.02) return ANCH.n;
      const u = unit(v);
      return [u[0] * 0.9 + 0.1, u[1] * 0.9 - 0.25];
    }

    function draw() {
      L.objs.innerHTML = '';
      L.cand.innerHTML = '';
      L.pts.innerHTML = '';
      scene.objs.forEach((o) => {
        const el = drawObj(o, L.objs, 'cx-o ' + (o.k === 'C' ? 'cx-ci' : 'cx-ln') + (o.given ? ' given' : '') + (o.tool && o.tool !== 'line' && o.tool !== 'circle' ? ' derived' : ''));
        el.setAttribute('data-id', o.id);
      });
      scene.crossings().forEach((q) => spot(L.cand, q.x, q.y, 2.1, 'cx-x'));
      scene.pts.forEach((q) => {
        spot(L.pts, q.x, q.y, q.given ? 3.6 : 2.9, 'cx-pt' + (q.given ? ' given' : '') + (q.free ? ' free' : ''));
        if (q.label) {
          const dd = labelDir(q);
          const t = h('text', { class: 'cx-lb', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'data-fs': 16, text: q.label }, L.pts);
          t.cxAt = { x: q.x, y: q.y, dx: dd[0], dy: dd[1], off: 13 };
        }
      });
      drawGoal();
      rescale(true);
      stats();
    }

    function drawGoal() {
      L.goal.innerHTML = '';
      L.goal.style.display = showGoal ? '' : 'none';
      flatTargets(scene, d).forEach((t) => {
        const met = targetMet(scene, t);
        const cls = 'cx-tg' + (met ? ' met' : '');
        let el = null;
        if (t[0] === 'P') { el = spot(L.goal, t[1], t[2], met ? 5 : 4.5, cls + ' cx-tgp'); }
        else if (t[0] === 'L') el = drawObj({ k: 'L', kind: 'line', a: [t[1], t[2]], b: [t[3], t[4]] }, L.goal, cls);
        else if (t[0] === 'S') el = drawObj({ k: 'L', kind: 'seg', a: [t[1], t[2]], b: [t[3], t[4]] }, L.goal, cls);
        else if (t[0] === 'C') el = h('circle', { cx: t[1], cy: t[2], r: t[3], class: cls }, L.goal);
        if (el && !met && t[0] !== 'P') dashed(el, 7, 5);
      });
    }

    function stats() {
      ctx.stat('L', scene.L + ' / ' + parL);
      ctx.stat('E', scene.E + ' / ' + parE);
    }

    function rebuild() {
      scene = playSteps(d, steps);
      clearHint();
      draw();
    }
    // after a move of the player's: a word when a piece of a many-piece goal falls into place
    function metCount() { const ts = flatTargets(scene, d); return { n: ts.filter((t) => targetMet(scene, t)).length, of: ts.length }; }
    function cheer(before) {
      const now = metCount();
      if (now.of > 1 && now.n > before.n && now.n < now.of) wb.toast(now.n + ' of ' + now.of + ' goal pieces built');
    }

    /* ----- what is under the pointer ----- */

    // want 'p': a point (existing point, crossing, on a thing, free), 'l': a line
    function snapAt(pt, want) {
      const tolP = px(13), tolO = px(9);
      if (want === 'l') {
        let best = null, bd = tolO * 1.5;
        scene.objs.forEach((o) => { if (o.k !== 'L') return; const dd = distTo(o, pt); if (dd < bd) { bd = dd; best = o; } });
        return best ? { kind: 'obj', obj: best } : null;
      }
      let best = null, bd = tolP;
      scene.pts.forEach((q) => { const dd = Math.hypot(q.x - pt[0], q.y - pt[1]); if (dd < bd) { bd = dd; best = { kind: 'pt', pt: q, x: q.x, y: q.y }; } });
      if (best) return best;
      bd = tolP;
      scene.crossings().forEach((q) => { const dd = Math.hypot(q.x - pt[0], q.y - pt[1]); if (dd < bd) { bd = dd; best = { kind: 'x', x: q.x, y: q.y, a: q.a, b: q.b }; } });
      if (best) return best;
      if (free === false) return null;
      let bo = null, bdo = tolO;
      scene.objs.forEach((o) => { const dd = distTo(o, pt); if (dd < bdo) { bdo = dd; bo = o; } });
      if (bo) { const q = project(bo, pt); return { kind: 'on', obj: bo, x: q[0], y: q[1] }; }
      if (free === 'on') return null;
      return { kind: 'free', x: pt[0], y: pt[1] };
    }
    const wantNow = () => (tool ? PICKS[tool][picks.length] : null);

    // turn a snap into a point step (unless it is a point already); returns the point's id
    function realize(sn, list, trial) {
      if (sn.kind === 'pt') return sn.pt.id;
      const id = newId('u');
      let st;
      if (sn.kind === 'x') st = ['x', id, sn.a, sn.b, [sn.x, sn.y]];
      else if (sn.kind === 'on') {
        const o = sn.obj;
        const t = o.k === 'C' ? Math.atan2(sn.y - o.c[1], sn.x - o.c[0]) * 180 / Math.PI : dot(sub([sn.x, sn.y], o.a), lineDir(o));
        st = ['on', id, o.id, t];
      } else st = ['pt', id, +sn.x.toFixed(5), +sn.y.toFixed(5)];
      list.push(st);
      const q = applyStep(trial, st);
      return q.id;
    }

    // the picks so far plus the snap under the pointer, as scene elements (for the preview)
    function previewObject(extra) {
      if (!tool || tool === 'point') return null;
      const all = picks.concat(extra ? [extra] : []);
      if (all.length < PICKS[tool].length) return null;
      const els = all.map((sn) => (sn.kind === 'obj' ? sn.obj : sn.kind === 'pt' ? sn.pt : { x: sn.x, y: sn.y }));
      return toolObject(tool, els);
    }

    function drawHover() {
      L.hov.innerHTML = '';
      // the things picked so far
      picks.forEach((sn) => {
        if (sn.kind === 'obj') drawObj(sn.obj, L.hov, 'cx-picked-o');
        else { spot(L.hov, sn.x, sn.y, 7, 'cx-picked-ring'); spot(L.hov, sn.x, sn.y, 3.4, 'cx-picked'); }
      });
      if (!tool || busy) return;
      const sn = hov;
      // the preview of what the next pick would draw
      if (sn) {
        const o = previewObject(sn);
        if (o) dashed(drawObj(o, L.hov, 'cx-preview'), 6, 4);
      }
      if (!sn) return;
      if (sn.kind === 'obj') { drawObj(sn.obj, L.hov, 'cx-hot'); return; }
      if (sn.kind === 'x') { const a = scene.by[sn.a], b = scene.by[sn.b]; if (a) drawObj(a, L.hov, 'cx-hot soft'); if (b) drawObj(b, L.hov, 'cx-hot soft'); }
      if (sn.kind === 'on') drawObj(sn.obj, L.hov, 'cx-hot soft');
      spot(L.hov, sn.x, sn.y, sn.kind === 'free' ? 5 : 8, 'cx-ring ' + sn.kind);
      spot(L.hov, sn.x, sn.y, sn.kind === 'pt' ? 3.8 : 2.8, 'cx-snap ' + sn.kind);
    }

    function prompt() {
      if (!tool) return;
      const pr = PROMPTS[tool];
      ctx.say(pr[Math.min(picks.length, pr.length - 1)]);
    }

    function setTool(t) {
      if (t && tools.indexOf(t) < 0) return;
      tool = t;
      picks = [];
      press = null;
      if (t) C.store.set('cx:tool', t);
      drawHover();
      prompt();
    }

    function samePlace(a, b) { return Math.abs(a.x - b.x) < TOL && Math.abs(a.y - b.y) < TOL; }

    function pick(sn) {
      if (!sn) {
        ctx.say(wantNow() === 'l' ? 'Pick a line (a straight one).' : free === false ? 'Pick a point or a crossing: this puzzle has no free points.' : 'There is nothing to pick there.', 'warn');
        return;
      }
      if (tool === 'point') {
        if (sn.kind === 'pt') { ctx.say('There is a point there already.', 'info'); return; }
        const add = [];
        realize(sn, add, scene.clone());
        const before = metCount();
        steps = steps.concat(add);
        rebuild();
        ctx.sfx('tap');
        cheer(before);
        ctx.changed('point');
        return;
      }
      const want = wantNow();
      if (want === 'p' && sn.kind !== 'obj') {
        const others = tool === 'compass' && picks.length === 2 ? [] : picks;
        if (tool !== 'bisect' && others.some((q) => q.kind !== 'obj' && samePlace(q, sn))) { ctx.say('That point is already picked: choose another.', 'warn'); return; }
        if (tool === 'bisect' && picks.length && samePlace(picks[picks.length - 1], sn)) { ctx.say('Pick a different point.', 'warn'); return; }
      }
      picks.push(sn);
      if (picks.length < PICKS[tool].length) { ctx.sfx('tap'); drawHover(); prompt(); return; }
      commit();
    }

    function commit() {
      const tr = scene.clone();
      const add = [];
      const ids = picks.map((sn, i) => (PICKS[tool][i] === 'l' ? sn.obj.id : realize(sn, add, tr)));
      const els = ids.map((id) => tr.by[id]);
      const o = toolObject(tool, els);
      const t = tool;
      picks = [];
      if (!o) { ctx.say(t === 'bisect' ? 'Those three points make no angle to halve.' : 'Those picks do not make a line or a circle.', 'warn'); drawHover(); prompt(); return; }
      if (scene.objs.some((q) => sameObj(q, o) || (o.k === 'L' && q.k === 'L' && q.kind === 'line' && sameLine(q, o.a, o.b)))) {
        wb.toast(o.k === 'C' ? 'That circle is already drawn' : 'That line is already drawn');
        drawHover(); prompt();
        return;
      }
      const oid = newId('u');
      const before = metCount();
      steps = steps.concat(add, [[t, oid].concat(ids)]);
      rebuild();
      ctx.sfx('snap');
      const made = scene.by[oid];
      animateIn(made, 1, () => {});
      drawHover();
      prompt();
      cheer(before);
      ctx.changed('draw');
    }

    /* ----- animation: the pencil draws, the compass swings ----- */

    function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    // animation frames; a hidden page pauses requestAnimationFrame, so fall back to a timer there
    function tick(f) {
      if (root.document && root.document.hidden) setTimeout(() => f(performance.now()), 16);
      else root.requestAnimationFrame(f);
    }
    function frames(ms, fn, done) {
      const tok = animTok, t0 = performance.now();
      const step = (now) => {
        if (tok !== animTok) return;
        const k = Math.min(1, (now - t0) / Math.max(1, ms));
        fn(k);
        if (k < 1) tick(step); else if (done) done();
      };
      tick(step);
    }
    function elOf(o) { return L.objs.querySelector('[data-id="' + o.id + '"]'); }
    // draw a new thing in: quick for the player's own moves, with instruments for the shown solution
    function animateIn(o, slow, done) {
      const el = o && elOf(o);
      if (!el) { if (done) done(); return; }
      el.classList.add('cx-fresh');
      setTimeout(() => el.classList.remove('cx-fresh'), C.anim(900));
      const g = L.anim;
      if (o.k === 'C') {
        const src = o.from && scene.by[o.from[o.tool === 'compass' ? 2 : 1]];
        const start = o.tool === 'circle' && src ? Math.atan2(src.y - o.c[1], src.x - o.c[0]) : -Math.PI / 2;
        el.style.visibility = 'hidden';
        const arc = h('path', { class: 'cx-drawing' }, g);
        const inst = slow > 1 ? h('g', { class: 'cx-compass' }, g) : null;
        const legA = inst && h('line', {}, inst), legB = inst && h('line', {}, inst), hinge = inst && h('circle', { r: px(3.2) }, inst), grip = inst && h('line', { class: 'grip' }, inst);
        frames(C.anim(slow > 1 ? 760 : 260), (k) => {
          const e = ease(k), a1 = start + e * Math.PI * 2 * 0.9999;
          const p0 = [o.c[0] + o.r * Math.cos(start), o.c[1] + o.r * Math.sin(start)];
          const p1 = [o.c[0] + o.r * Math.cos(a1), o.c[1] + o.r * Math.sin(a1)];
          arc.setAttribute('d', 'M' + p0[0] + ' ' + p0[1] + 'A' + o.r + ' ' + o.r + ' 0 ' + (e > 0.5 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1]);
          if (inst) {
            const m = mul(add(o.c, p1), 0.5), leg = Math.max(o.r * 0.78, px(40));
            const hgt = Math.sqrt(Math.max(0, leg * leg - o.r * o.r / 4));
            let n = unit(perp(sub(p1, o.c)));
            if (n[1] > 0) n = mul(n, -1);
            const top = add(m, mul(n, hgt));
            legA.setAttribute('x1', o.c[0]); legA.setAttribute('y1', o.c[1]); legA.setAttribute('x2', top[0]); legA.setAttribute('y2', top[1]);
            legB.setAttribute('x1', p1[0]); legB.setAttribute('y1', p1[1]); legB.setAttribute('x2', top[0]); legB.setAttribute('y2', top[1]);
            hinge.setAttribute('cx', top[0]); hinge.setAttribute('cy', top[1]);
            const gt = add(top, mul(n, px(14)));
            grip.setAttribute('x1', top[0]); grip.setAttribute('y1', top[1]); grip.setAttribute('x2', gt[0]); grip.setAttribute('y2', gt[1]);
          }
        }, () => { arc.remove(); if (inst) inst.remove(); el.style.visibility = ''; if (done) done(); });
        return;
      }
      // a line: the pencil runs along the straightedge from one point to the other, then the line runs on
      const pa = o.from && o.tool === 'line' ? scene.by[o.from[0]] : null, pb = o.from && o.tool === 'line' ? scene.by[o.from[1]] : null;
      const a = pa ? [pa.x, pa.y] : o.a, b = pb ? [pb.x, pb.y] : add(o.a, mul(lineDir(o), B.size * 0.25));
      const u = unit(sub(b, a)), len = dist(a, b), ends = lineEnds(o);
      el.style.visibility = 'hidden';
      const ln = h('line', { class: 'cx-drawing' }, g);
      let ruler = null;
      if (slow > 1) {
        const n = perp(u), w = px(16), m0 = sub(a, mul(u, len * 0.25)), m1 = add(b, mul(u, len * 0.25));
        ruler = h('path', { class: 'cx-ruler', d: C.pathOf([add(m0, mul(n, px(3))), add(m1, mul(n, px(3))), add(m1, mul(n, px(3) + w)), add(m0, mul(n, px(3) + w))]) }, g);
      }
      const far = BIG;
      frames(C.anim(slow > 1 ? 640 : 240), (k) => {
        const e = ease(k);
        let p0, p1;
        if (e < 0.55) { const f = e / 0.55; p0 = a; p1 = add(a, mul(u, len * f)); } else {
          const f = (e - 0.55) / 0.45, ext = len * 0.2 + Math.pow(f, 3) * far;
          p0 = o.kind === 'line' ? sub(a, mul(u, ext)) : a;
          p1 = o.kind === 'seg' ? b : add(b, mul(u, ext));
          if (ruler) ruler.style.opacity = String(1 - f);
        }
        ln.setAttribute('x1', p0[0]); ln.setAttribute('y1', p0[1]); ln.setAttribute('x2', p1[0]); ln.setAttribute('y2', p1[1]);
      }, () => { ln.remove(); if (ruler) ruler.remove(); el.style.visibility = ''; void ends; if (done) done(); });
    }

    /* ----- hints: the next step of the stored solution that is not on the board ----- */

    function clearHint() { L.hint.innerHTML = ''; clearTimeout(hintT); hintEl = null; }
    function has(o) {
      return scene.objs.some((q) => sameObj(q, o) || (o.k === 'L' && q.k === 'L' && sameLine(q, o.a, o.b)));
    }
    function nextPlanStep() {
      const ps = givenScene(d);
      let n = 0;
      for (const st of d.sol) {
        let el;
        try { el = applyStep(ps, st, { lineKind: d.lineKind }); } catch (e) { return null; }
        if (el.k === 'P') continue;
        n++;
        if (has(el)) continue;
        return { st, el, ps, n };
      }
      return null;
    }
    function liveHint() {
      if (goalMet(scene, d)) return 'It is all there — the goal is built.';
      const nx = nextPlanStep();
      if (!nx) return 'Everything the stored solution draws is on the board. Look for the gold goal among your lines.';
      const text = describeStep(nx.ps, nx.st, nx.el);
      return {
        text: text + ' (Step ' + nx.n + ' of ' + costOf(d.sol).L + ' in the stored solution.)',
        show() {
          clearHint();
          hintEl = dashed(drawObj(nx.el, L.hint, 'cx-ghost'), 8, 6);
          (nx.el.from || []).forEach((id) => {
            const q = nx.ps.by[id];
            if (!q) return;
            if (q.k === 'P') spot(L.hint, q.x, q.y, 7, 'cx-ghost-pt');
            else drawObj(q, L.hint, 'cx-ghost-o');
          });
          hintT = setTimeout(clearHint, 9000);
        }
      };
    }

    /* ----- showing the stored solution ----- */

    function playSolution() {
      L.anim.innerHTML = '';
      animTok++;
      busy = true;
      picks = [];
      press = null;
      steps = [];
      rebuild();
      drawHover();
      const plan = [];
      d.sol.forEach((st) => { // give unnamed steps names of their own
        const s2 = st.slice();
        if (!s2[1]) s2[1] = 'z' + (plan.length + 1);
        plan.push(s2);
      });
      let k = 0;
      const tok = ++animTok;
      const next = () => {
        if (tok !== animTok) return;
        if (k >= plan.length) {
          busy = false;
          draw();
          drawHover();
          ctx.say('The solution: ' + scene.L + ' L, ' + scene.E + ' E.', 'info');
          ctx.changed('solve');
          return;
        }
        const st = plan[k++];
        steps = steps.concat([st]);
        rebuild();
        const el = scene.by[st[1]];
        if (el && el.k !== 'P') {
          ctx.say(describeStep(scene, st), 'info');
          animateIn(el, 2, () => setTimeout(next, C.anim(140)));
        } else setTimeout(next, C.anim(60));
      };
      setTimeout(next, C.anim(220));
    }

    /* ----- tools on the tool bar ----- */

    tools.forEach((t, i) => {
      const T = TOOLS[t];
      wb.addMode({
        id: 'cx-' + t, icon: T.icon, title: T.name + ' — ' + costText(t), key: String(TOOL_ORDER.indexOf(t) + 1),
        down(pt) {
          if (busy) return false;
          const sn = snapAt(pt, wantNow());
          press = { sn, p0: pt, moved: false };
          hov = sn;
          drawHover();
          return true;
        },
        move(pt) {
          if (press && dist(pt, press.p0) > px(7)) press.moved = true;
          const want = press && press.moved && picks.length + 1 < PICKS[tool].length ? PICKS[tool][picks.length + 1] : wantNow();
          hov = snapAt(pt, want);
          if (press && press.moved && press.sn && tool !== 'point') {
            // dragging from the first pick: preview with it picked
            picks.push(press.sn); drawHover(); picks.pop();
          } else drawHover();
        },
        up(pt) {
          const pr = press;
          press = null;
          if (!pr || busy) return;
          if (!pr.moved || tool === 'point') { pick(pr.sn); return; }
          if (!pr.sn) { pick(null); return; }
          pick(pr.sn);
          if (picks.length && picks.length < PICKS[tool].length) {
            const sn2 = snapAt(pt, wantNow());
            if (sn2 && !(sn2.kind !== 'obj' && pr.sn.kind !== 'obj' && samePlace(sn2, pr.sn))) pick(sn2);
          }
        },
        hover(pt) {
          if (busy) return;
          hov = snapAt(pt, wantNow());
          drawHover();
        }
      });
    });
    wb.on('mode', (id) => {
      if (id && id.indexOf('cx-') === 0) setTool(id.slice(3));
      else { tool = null; picks = []; hov = null; drawHover(); }
    });

    /* ----- the side panel ----- */

    const panel = ctx.h('div.cx-panel');
    const toolList = ctx.h('div.cx-tools');
    tools.forEach((t, i) => {
      const T = TOOLS[t];
      const isNew = d.newTool === t;
      const proof = d.proved && d.proved[t] && C.byId && C.byId[d.proved[t]];
      toolList.appendChild(ctx.h('button.cx-tool' + (isNew ? '.new' : ''), {
        type: 'button', title: T.verb + (proof ? ' (Proved in “' + proof.title + '”.)' : ''), onclick: () => wb.setMode('cx-' + t),
        html: C.icon(T.icon) + '<span class="cx-tname">' + T.name + (isNew ? ' <b class="cx-new">new</b>' : '') + '</span><span class="cx-tcost">' + costText(t) + '</span><kbd>' + (TOOL_ORDER.indexOf(t) + 1) + '</kbd>'
      }));
      if (isNew) toolList.appendChild(ctx.h('div.cx-newnote', { html: C.md('You have earned a new tool: **' + T.name + '**. ' + T.verb + ' It counts as one L move but ' + T.E + ' E moves — the elementary moves it stands for' + (proof ? ', proved in [[' + proof.id + ']]' : '') + '.') }));
    });
    const goalBtn = ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { showGoal = !showGoal; C.store.set('cx:goal', showGoal); goalBtn.textContent = showGoal ? 'Hide the goal' : 'Show the goal'; drawGoal(); rescale(true); } }, showGoal ? 'Hide the goal' : 'Show the goal');
    panel.append(
      ctx.h('div.cx-par', { html: 'Par: <b>' + parL + ' L</b> · <b>' + parE + ' E</b>' }),
      toolList,
      ctx.h('div.cx-row', goalBtn)
    );
    ctx.panel.appendChild(panel);

    rebuild();
    const last = C.store.get('cx:tool', null);
    wb.setMode('cx-' + (last && tools.indexOf(last) >= 0 && last !== 'point' ? last : (tools.indexOf('circle') >= 0 ? 'circle' : tools[0])));

    return {
      noMoves: true,
      check(manual) {
        if (busy) return { solved: false, msg: 'Wait for the drawing to finish.' };
        if (goalMet(scene, d)) {
          const okL = scene.L <= parL, okE = scene.E <= parE;
          let msg;
          if (okL && okE) msg = 'Built in **' + scene.L + ' L** and **' + scene.E + ' E** — par on both counts. Euclid would nod.';
          else if (okL) msg = '**' + scene.L + ' L** is par. In elementary moves it took ' + scene.E + ' E; ' + parE + ' E is possible.';
          else if (okE) msg = '**' + scene.E + ' E** is par. In lines and circles it took ' + scene.L + ' L; ' + parL + ' L is possible.';
          else msg = 'Built in ' + scene.L + ' L and ' + scene.E + ' E. Par is ' + parL + ' L and ' + parE + ' E: there is a shorter way.';
          const r = { solved: true, msg, perfect: okL && okE };
          if (!okL && !okE) r.stars = 2;
          return r;
        }
        const ts = flatTargets(scene, d);
        const got = ts.filter((t) => targetMet(scene, t)).length;
        return { solved: false, msg: ts.length > 1 ? 'Not yet: ' + got + ' of the ' + ts.length + ' goal pieces are built.' : 'Not yet: the gold goal is not built.' };
      },
      hint() { return liveHint(); },
      solve() { playSolution(); },
      getState() { return { steps: steps }; },
      setState(s) {
        L.anim.innerHTML = '';
        animTok++;
        busy = false;
        steps = s && s.steps ? s.steps : [];
        picks = [];
        press = null;
        try { rebuild(); } catch (e) { steps = []; rebuild(); }
        drawHover();
        prompt();
      },
      reset() { picks = []; drawHover(); prompt(); },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (ev.key === 'Escape') {
          if (picks.length) { picks = []; drawHover(); prompt(); return true; }
          return !!tool;
        }
        const n = parseInt(ev.key, 10);
        const tk = n >= 1 && String(n) === ev.key ? TOOL_ORDER[n - 1] : null;
        if (tk && tools.indexOf(tk) >= 0) { wb.setMode('cx-' + tk); return true; }
        return false;
      },
      destroy() { animTok++; clearHint(); }
    };
  }

  /* ---------- the small picture on the family page ---------- */

  function thumb(p) {
    const d = p.data, B = bounds(d), pad = B.size * 0.12;
    const x0 = B.x0 - pad, y0 = B.y0 - pad, w = B.w + 2 * pad, hh = B.h + 2 * pad;
    const sw = B.size / 55, f = (v) => Math.round(v * 1000) / 1000;
    const big = B.size * 3;
    const seg = (a, b, kind) => {
      const u = unit(sub(b, a));
      const p0 = kind === 'line' ? sub(a, mul(u, big)) : a, p1 = kind === 'seg' ? b : add(a, mul(u, big));
      return '<line x1="' + f(p0[0]) + '" y1="' + f(p0[1]) + '" x2="' + f(p1[0]) + '" y2="' + f(p1[1]) + '"/>';
    };
    let s = '<svg viewBox="' + f(x0) + ' ' + f(y0) + ' ' + f(w) + ' ' + f(hh) + '" preserveAspectRatio="xMidYMid meet">';
    const sc = givenScene(d);
    s += '<g fill="none" stroke="var(--gold)" stroke-width="' + f(sw * 1.1) + '" stroke-dasharray="' + f(sw * 2.4) + ' ' + f(sw * 1.6) + '" stroke-linecap="round">';
    flatTargets(null, d).forEach((t) => {
      if (t[0] === 'L') s += seg([t[1], t[2]], [t[3], t[4]], 'line');
      else if (t[0] === 'S') s += seg([t[1], t[2]], [t[3], t[4]], 'seg');
      else if (t[0] === 'C') s += '<circle cx="' + f(t[1]) + '" cy="' + f(t[2]) + '" r="' + f(t[3]) + '"/>';
    });
    // a wanted length: shown as a gold rod from the first given point
    const p0 = sc.pts[0];
    flatTargets(null, d).forEach((t) => {
      if (t[0] !== 'D' || !p0) return;
      const e = [p0.x + t[1] * Math.cos(-0.9), p0.y + t[1] * Math.sin(-0.9)];
      s += '<line x1="' + f(p0.x) + '" y1="' + f(p0.y) + '" x2="' + f(e[0]) + '" y2="' + f(e[1]) + '"/>';
    });
    s += '</g><g fill="var(--gold)">';
    flatTargets(null, d).forEach((t) => {
      if (t[0] === 'P') s += '<circle cx="' + f(t[1]) + '" cy="' + f(t[2]) + '" r="' + f(sw * 2.2) + '"/>';
      if (t[0] === 'D' && p0) s += '<circle cx="' + f(p0.x + t[1] * Math.cos(-0.9)) + '" cy="' + f(p0.y + t[1] * Math.sin(-0.9)) + '" r="' + f(sw * 1.8) + '"/>';
    });
    s += '</g><g fill="none" stroke="var(--ink-2)" stroke-width="' + f(sw) + '" stroke-linecap="round">';
    sc.objs.forEach((o) => {
      if (o.k === 'C') s += '<circle cx="' + f(o.c[0]) + '" cy="' + f(o.c[1]) + '" r="' + f(o.r) + '"/>';
      else s += seg(o.a, o.b, o.kind);
    });
    s += '</g><g fill="var(--ink)">';
    sc.pts.forEach((q) => { s += '<circle cx="' + f(q.x) + '" cy="' + f(q.y) + '" r="' + f(sw * 1.7) + '"/>'; });
    return s + '</g></svg>';
  }

  C.engine({
    id: 'construct',
    name: 'Compass and straightedge',
    tools: ['pan', 'pen', 'eraser', 'note', 'loupe'],
    noMoves: true,
    about: 'Build the **gold** goal with a straightedge (no marks) and a compass. Pick a tool (or press its number), then pick points: a **line** takes two, a **circle** takes its centre and a point it passes through — click one, then the other, or drag between them. Crossings are ready to use: the pointer snaps to them and lights up what it will take. The **Point** tool marks a crossing, a point on a line or circle, or a free point where the puzzle allows one. Esc lets go.\n\n**L** counts the lines and circles you draw; **E** counts Euclid\'s elementary moves, so a derived tool such as the perpendicular bisector is 1 L but 3 E. Points are free. Meet both pars for a perfect construction. Derived tools are earned in Euclid\'s order, one proposition at a time.\n\nHints nudge first, then show the next step of a stored solution as a teal ghost on the board.',
    verify,
    mount,
    thumb
  });

  C.css('construct', `
    .cx-o { fill: none; stroke: var(--ink-2); stroke-width: calc(1.15px / var(--k, 1)); stroke-linecap: round; }
    .cx-o.given { stroke: var(--ink); stroke-width: calc(1.9px / var(--k, 1)); }
    .cx-o.derived { stroke: color-mix(in srgb, var(--ink-2) 72%, var(--purple)); }
    .cx-o.cx-fresh { stroke: var(--accent); stroke-width: calc(1.6px / var(--k, 1)); transition: stroke .9s, stroke-width .9s; }
    .cx-x { fill: none; stroke: var(--muted); stroke-width: calc(1px / var(--k, 1)); opacity: .75; }
    .cx-pt { fill: var(--text); stroke: var(--stage); stroke-width: calc(1.2px / var(--k, 1)); }
    .cx-pt.given { fill: var(--ink); }
    .cx-pt.free { fill: var(--stage); stroke: var(--text); }
    .cx-lb { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: 600; fill: var(--ink); paint-order: stroke; stroke: var(--stage); stroke-width: calc(3px / var(--k, 1)); stroke-linejoin: round; pointer-events: none; user-select: none; }
    .cx-tg { fill: none; stroke: var(--gold); stroke-width: calc(1.5px / var(--k, 1)); opacity: .7; stroke-linecap: round; }
    .cx-tg.cx-tgp { fill: var(--gold); stroke: none; opacity: .55; }
    .cx-tg.met { stroke: var(--green); opacity: .95; stroke-width: calc(2.6px / var(--k, 1)); filter: drop-shadow(0 0 calc(3px / var(--k, 1)) var(--green)); }
    .cx-tg.cx-tgp.met { fill: var(--green); stroke: none; }
    .cx-hov, .cx-hint, .cx-anim { pointer-events: none; }
    .cx-hot { fill: none; stroke: var(--gold); stroke-width: calc(2.4px / var(--k, 1)); opacity: .9; }
    .cx-hot.soft { opacity: .45; stroke-width: calc(2px / var(--k, 1)); }
    .cx-ring { fill: none; stroke: var(--gold); stroke-width: calc(1.6px / var(--k, 1)); }
    .cx-ring.free { stroke-dasharray: none; opacity: .7; }
    .cx-snap { fill: var(--gold); }
    .cx-snap.free, .cx-snap.on { fill: var(--stage); stroke: var(--gold); stroke-width: calc(1.4px / var(--k, 1)); }
    .cx-picked { fill: var(--accent); }
    .cx-picked-ring { fill: none; stroke: var(--accent); stroke-width: calc(1.6px / var(--k, 1)); }
    .cx-picked-o { fill: none; stroke: var(--accent); stroke-width: calc(2.6px / var(--k, 1)); opacity: .8; }
    .cx-preview { fill: none; stroke: var(--accent); stroke-width: calc(1.2px / var(--k, 1)); opacity: .85; }
    .cx-drawing { fill: none; stroke: var(--accent); stroke-width: calc(1.7px / var(--k, 1)); stroke-linecap: round; }
    .cx-compass line { stroke: var(--metal); stroke-width: calc(2.2px / var(--k, 1)); stroke-linecap: round; opacity: .9; }
    .cx-compass line.grip { stroke-width: calc(4px / var(--k, 1)); }
    .cx-compass circle { fill: var(--metal); }
    .cx-ruler { fill: color-mix(in srgb, var(--wood) 55%, transparent); stroke: var(--wood-dark); stroke-width: calc(1px / var(--k, 1)); }
    .cx-ghost { fill: none; stroke: var(--teal); stroke-width: calc(1.9px / var(--k, 1)); animation: cxghost 1.1s ease-in-out infinite; }
    .cx-ghost-pt { fill: none; stroke: var(--teal); stroke-width: calc(2px / var(--k, 1)); animation: cxghost 1.1s ease-in-out infinite; }
    .cx-ghost-o { fill: none; stroke: var(--teal); stroke-width: calc(3px / var(--k, 1)); opacity: .35; }
    @keyframes cxghost { 50% { opacity: .35; } }
    .wb[data-mode^="cx-"] .wb-svg { cursor: crosshair; }
    .cx-panel { display: grid; gap: 8px; margin: 10px 0 4px; }
    .cx-par { font-size: .86rem; color: var(--muted); }
    .cx-par b { color: var(--gold); }
    .cx-tools { display: grid; gap: 3px; }
    .cx-tool { display: grid; grid-template-columns: 22px 1fr auto 18px; align-items: center; gap: 8px; padding: 5px 8px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: var(--text); font: inherit; font-size: .84rem; text-align: left; cursor: pointer; }
    .cx-tool:hover { background: var(--panel-2); }
    .cx-tool.new { border-color: color-mix(in srgb, var(--gold) 55%, transparent); }
    .cx-tool .ico { width: 18px; height: 18px; color: var(--muted); }
    .cx-tcost { color: var(--muted); font-size: .76rem; white-space: nowrap; }
    .cx-tool kbd { font-size: .7rem; color: var(--faint); }
    .cx-new { color: var(--gold); font-size: .7rem; text-transform: uppercase; letter-spacing: .05em; margin-left: 4px; }
    .cx-newnote, .cx-proof { font-size: .78rem; color: var(--muted); padding: 0 8px 4px 38px; }
    .cx-newnote { color: var(--text); }
    .cx-row { display: flex; gap: 6px; flex-wrap: wrap; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);

