/* The Puzzle Cabinet · engines/countfig.js
 *
 * "How many triangles are in this figure?" — and squares, rectangles,
 * parallelograms. The figure is a set of straight lines; every shape whose
 * sides lie along drawn lines is counted by the computer, so every answer is
 * exact. To help you count, click the corners of a shape you have found:
 * it is shaded and kept, so nothing is counted twice.
 *
 * data: {
 *   pts: [[x, y], …],          points the lines are drawn between
 *   segs: [[i, j], …],         the drawn lines (straight, between two points)
 *   find: 'triangles' | 'squares' | 'rectangles' | 'parallelograms',
 *   answer: n                  (checked by verify: must equal the count)
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const EPS = 1e-7;

  /* ---------- the geometry: vertices, lines, and every shape ---------- */

  function analyse(d) {
    const scale = Math.max(1, ...d.pts.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1]))));
    const tol = scale * 1e-6;
    const V = [];
    const vid = (p) => {
      for (let i = 0; i < V.length; i++) if (Math.abs(V[i][0] - p[0]) < tol && Math.abs(V[i][1] - p[1]) < tol) return i;
      V.push([p[0], p[1]]);
      return V.length - 1;
    };
    const segs = d.segs.map(([i, j]) => [d.pts[i].slice(), d.pts[j].slice()]);
    segs.forEach((s) => { vid(s[0]); vid(s[1]); });
    // every crossing of two lines is a vertex
    for (let a = 0; a < segs.length; a++) {
      for (let b = a + 1; b < segs.length; b++) {
        const p = cross(segs[a], segs[b]);
        if (p) vid(p);
      }
    }
    // merge collinear, overlapping segments into maximal lines
    const lines = [];
    segs.forEach((s) => {
      const dir = norm(sub(s[1], s[0]));
      let merged = false;
      for (const L of lines) {
        if (Math.abs(crossp(L.dir, dir)) > 1e-9) continue;
        if (Math.abs(crossp(L.dir, sub(s[0], L.o))) > tol) continue;
        // same infinite line: merge if the parameter ranges touch
        const t0 = dot(sub(s[0], L.o), L.dir), t1 = dot(sub(s[1], L.o), L.dir);
        const lo = Math.min(t0, t1), hi = Math.max(t0, t1);
        if (hi < L.lo - tol || lo > L.hi + tol) continue;
        L.lo = Math.min(L.lo, lo); L.hi = Math.max(L.hi, hi);
        merged = true;
        break;
      }
      if (!merged) {
        const t0 = 0, t1 = dot(sub(s[1], s[0]), dir);
        lines.push({ o: s[0], dir, lo: Math.min(t0, t1), hi: Math.max(t0, t1) });
      }
    });
    // repeated merging (a segment can join two lines into one)
    for (let changed = true; changed;) {
      changed = false;
      outer: for (let a = 0; a < lines.length; a++) {
        for (let b = a + 1; b < lines.length; b++) {
          const A = lines[a], B = lines[b];
          if (Math.abs(crossp(A.dir, B.dir)) > 1e-9 || Math.abs(crossp(A.dir, sub(B.o, A.o))) > tol) continue;
          const s = dot(B.dir, A.dir) > 0 ? 1 : -1;
          const off = dot(sub(B.o, A.o), A.dir);
          const lo = off + Math.min(B.lo * s, B.hi * s), hi = off + Math.max(B.lo * s, B.hi * s);
          if (hi < A.lo - tol || lo > A.hi + tol) continue;
          A.lo = Math.min(A.lo, lo); A.hi = Math.max(A.hi, hi);
          lines.splice(b, 1);
          changed = true;
          break outer;
        }
      }
    }
    const n = V.length;
    const conn = new Int16Array(n * n).fill(-1); // line index joining two vertices, or -1
    lines.forEach((L, li) => {
      const on = [];
      V.forEach((v, i) => {
        if (Math.abs(crossp(L.dir, sub(v, L.o))) > tol) return;
        const t = dot(sub(v, L.o), L.dir);
        if (t >= L.lo - tol && t <= L.hi + tol) on.push(i);
      });
      L.verts = on;
      for (const a of on) for (const b of on) if (a !== b) conn[a * n + b] = li;
    });
    return { V, lines, conn, n };
  }

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
  function crossp(a, b) { return a[0] * b[1] - a[1] * b[0]; }
  function norm(a) { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; }
  function cross(s, t) {
    const r = sub(s[1], s[0]), q = sub(t[1], t[0]), den = crossp(r, q);
    if (Math.abs(den) < 1e-12) return null;
    const w = sub(t[0], s[0]), a = crossp(w, q) / den, b = crossp(w, r) / den;
    if (a < -EPS || a > 1 + EPS || b < -EPS || b > 1 + EPS) return null;
    return [s[0][0] + r[0] * a, s[0][1] + r[1] * a];
  }

  // every shape of the kind asked for: a list of vertex-index lists (in order around the shape)
  function shapes(G, kind) {
    const { V, conn, n } = G;
    const out = [];
    if (kind === 'triangles') {
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
        const lab = conn[a * n + b];
        if (lab < 0) continue;
        for (let c = b + 1; c < n; c++) {
          const lbc = conn[b * n + c], lac = conn[a * n + c];
          if (lbc < 0 || lac < 0) continue;
          if (lab === lbc && lbc === lac) continue; // all on one line
          if (Math.abs(crossp(sub(V[b], V[a]), sub(V[c], V[a]))) < 1e-9 * (1 + Math.abs(V[a][0]) + Math.abs(V[a][1]))) continue;
          out.push([a, b, c]);
        }
      }
      return out;
    }
    // four-sided shapes: a-b-c turning at b, d = a + c - b must be a vertex joined to a and c
    const seen = new Set();
    const find = (p) => {
      for (let i = 0; i < n; i++) if (Math.abs(V[i][0] - p[0]) < 1e-6 && Math.abs(V[i][1] - p[1]) < 1e-6) return i;
      return -1;
    };
    for (let b = 0; b < n; b++) {
      for (let a = 0; a < n; a++) {
        const lab = conn[b * n + a];
        if (a === b || lab < 0) continue;
        for (let c = a + 1; c < n; c++) {
          const lbc = conn[b * n + c];
          if (c === b || lbc < 0 || lbc === lab) continue;
          const u = sub(V[a], V[b]), w = sub(V[c], V[b]);
          const right = Math.abs(dot(u, w)) < 1e-6 * Math.hypot(...u) * Math.hypot(...w);
          if ((kind === 'rectangles' || kind === 'squares') && !right) continue;
          if (kind === 'squares' && Math.abs(Math.hypot(...u) - Math.hypot(...w)) > 1e-6 * Math.hypot(...u)) continue;
          const d = find([V[a][0] + V[c][0] - V[b][0], V[a][1] + V[c][1] - V[b][1]]);
          if (d < 0 || conn[a * n + d] < 0 || conn[c * n + d] < 0) continue;
          if (conn[a * n + d] === lab || conn[c * n + d] === lbc) continue;
          const key = [a, b, c, d].sort((x, y) => x - y).join(',');
          if (seen.has(key)) continue;
          seen.add(key);
          out.push([a, b, c, d]);
        }
      }
    }
    return out;
  }

  function count(d) { return shapes(analyse(d), d.find).length; }

  const WORD = { triangles: 'triangle', squares: 'square', rectangles: 'rectangle', parallelograms: 'parallelogram' };
  const CORNERS = { triangles: 3, squares: 4, rectangles: 4, parallelograms: 4 };

  /* ---------- figures (for the generator and endless play) ---------- */

  const FIG = {
    // a triangle with k lines from the top to the base and m lines across
    fan(k, m) {
      const pts = [[0, 0], [-6, 10], [6, 10]], segs = [[0, 1], [0, 2], [1, 2]];
      for (let i = 1; i <= k; i++) { const x = -6 + 12 * i / (k + 1); pts.push([x, 10]); segs.push([0, pts.length - 1]); }
      for (let j = 1; j <= m; j++) {
        const y = 10 * j / (m + 1);
        pts.push([-6 * y / 10, y], [6 * y / 10, y]);
        segs.push([pts.length - 2, pts.length - 1]);
      }
      return { pts, segs };
    },
    // a w × h grid of squares, with diagonals in the cells listed (or all)
    grid(w, h, diags) {
      const pts = [], segs = [];
      const P = (x, y) => { pts.push([x * 2, y * 2]); return pts.length - 1; };
      for (let y = 0; y <= h; y++) segs.push([P(0, y), P(w, y)]);
      for (let x = 0; x <= w; x++) segs.push([P(x, 0), P(x, h)]);
      (diags || []).forEach(([x, y, dir]) => {
        if (dir & 1) segs.push([P(x, y), P(x + 1, y + 1)]);
        if (dir & 2) segs.push([P(x + 1, y), P(x, y + 1)]);
      });
      return { pts, segs };
    },
    // a square with both diagonals and the two midlines (and optionally the inner diamond)
    union(diamond) {
      const pts = [[0, 0], [8, 0], [8, 8], [0, 8], [4, 0], [8, 4], [4, 8], [0, 4]];
      const segs = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [4, 6], [5, 7]];
      if (diamond) segs.push([4, 5], [5, 6], [6, 7], [7, 4]);
      return { pts, segs };
    },
    // a regular n-gon with all its diagonals of one step (a star) and its sides
    star(nv, step, withSides) {
      const pts = [], segs = [];
      for (let i = 0; i < nv; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / nv; pts.push([Math.cos(a) * 8, Math.sin(a) * 8]); }
      for (let i = 0; i < nv; i++) {
        if (withSides) segs.push([i, (i + 1) % nv]);
        segs.push([i, (i + step) % nv]);
      }
      return { pts, segs };
    },
    // triangular grid of side n
    trigrid(n) {
      const pts = [], segs = [];
      const h = Math.sqrt(3);
      const Q = (i, j) => { pts.push([(j - i / 2) * 2, i * h]); return pts.length - 1; };
      for (let i = 1; i <= n; i++) segs.push([Q(i, 0), Q(i, i)]);          // across
      for (let j = 0; j < n; j++) segs.push([Q(j, j), Q(n, j)]);          // down to the left
      for (let k = 0; k < n; k++) segs.push([Q(k, 0), Q(n, n - k)]);      // down to the right
      return { pts, segs };
    },
    // a polygon (triangle or square) with random chords between points on its sides
    chords(rng, sides, nchords) {
      const base = sides === 3 ? [[0, 10], [6, 0], [12, 10]] : [[0, 0], [10, 0], [10, 10], [0, 10]];
      const pts = base.map((p) => p.slice()), segs = [];
      base.forEach((p, i) => segs.push([i, (i + 1) % base.length]));
      const onSide = () => {
        const s = rng.int(base.length), t = [0.25, 1 / 3, 0.5, 2 / 3, 0.75][rng.int(5)];
        const a = base[s], b = base[(s + 1) % base.length];
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        return { i: pts.length - 1, s };
      };
      for (let k = 0; k < nchords; k++) {
        if (rng() < 0.5) {
          const c = rng.int(base.length), p = onSide();
          if (p.s === c || (p.s + 1) % base.length === c) { pts.pop(); k--; continue; }
          segs.push([c, p.i]);
        } else {
          const p = onSide(), q = onSide();
          if (p.s === q.s) { pts.pop(); pts.pop(); k--; continue; }
          segs.push([p.i, q.i]);
        }
      }
      return { pts, segs };
    }
  };

  function levelOf(n) { return n <= 8 ? 1 : n <= 16 ? 2 : n <= 30 ? 3 : n <= 55 ? 4 : 5; }

  function randomFigure(rng, level, fam) {
    const want = fam && fam.id === 'count-squares' ? (rng() < 0.55 ? 'squares' : 'rectangles') : 'triangles';
    for (let tries = 0; tries < 60; tries++) {
      let f;
      if (want === 'triangles') {
        const r = rng.int(5);
        if (r === 0) f = FIG.fan(rng.range(1, 4), rng.range(0, 3));
        else if (r === 1) f = FIG.chords(rng, rng() < 0.5 ? 3 : 4, rng.range(2, 2 + level));
        else if (r === 2) { const w = rng.range(1, 3), h = rng.range(1, 3), dg = []; for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (rng() < 0.7) dg.push([x, y, rng.range(1, 3)]); f = FIG.grid(w, h, dg); }
        else if (r === 3) f = FIG.trigrid(rng.range(2, 5));
        else f = rng() < 0.5 ? FIG.union(rng() < 0.5) : FIG.star(rng.pick([5, 6, 7, 8]), 2, rng() < 0.6);
      } else {
        const w = rng.range(1, 3 + level), h = rng.range(1, 2 + level);
        const dg = [];
        f = FIG.grid(w, h, dg);
        // knock out a few inner lines for irregular grids
        if (level >= 3 && rng() < 0.6) f = holes(rng, w, h);
      }
      const d = { pts: f.pts, segs: f.segs, find: want };
      const n = count(d);
      if (n < 2 || levelOf(n) !== level) continue;
      d.answer = n;
      return d;
    }
    return null;
  }

  // a grid where some unit lines are missing (so not every rectangle is there)
  function holes(rng, w, h) {
    const pts = [], segs = [];
    const P = (x, y) => { pts.push([x * 2, y * 2]); return pts.length - 1; };
    for (let y = 0; y <= h; y++) for (let x = 0; x < w; x++) if (y === 0 || y === h || rng() < 0.8) segs.push([P(x, y), P(x + 1, y)]);
    for (let x = 0; x <= w; x++) for (let y = 0; y < h; y++) if (x === 0 || x === w || rng() < 0.8) segs.push([P(x, y), P(x, y + 1)]);
    return { pts, segs };
  }

  const PASTEL = ['#ff8a8a', '#ffc27a', '#ffe08a', '#8fe0b0', '#7fe3df', '#9fa9ff', '#c9a6ff', '#ff9fc9'];

  C.engine({
    id: 'countfig',
    name: 'Count the figures',
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Count every shape of the kind asked for — big and small, overlapping, any size — whose sides all lie along the drawn lines. **Click the corners** of a shape you have found (3 for a triangle, 4 for a square or rectangle): it is shaded and listed, so you never count it twice. Type your total in the panel. The pen and highlighter work too.',

    verify(p) {
      const d = p.data;
      if (!d || !d.pts || !d.segs || !WORD[d.find]) return { ok: false, err: 'pts, segs and find are needed' };
      const n = count(d);
      if (n !== d.answer) return { ok: false, err: 'answer is ' + d.answer + ' but the figure has ' + n };
      return { ok: true };
    },

    answerKey(p) { return String(p.data.answer); },

    generate(rng, level, fam) {
      const d = randomFigure(rng, level, fam);
      if (!d) return null;
      const w = WORD[d.find];
      return { title: 'How many ' + d.find + '?', text: 'Count every ' + w + ' in the figure, of any size, whose sides lie along the lines.', data: d, diff: level };
    },
    generates: ['count-triangles', 'count-squares'],

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data;
      const Gm = analyse(d);
      const all = shapes(Gm, d.find);
      const keyOf = (ids) => ids.slice().sort((x, y) => x - y).join(',');
      const byKey = new Map(all.map((s) => [keyOf(s), s]));
      const need = CORNERS[d.find];
      let found = [];      // keys
      let picked = [];     // vertex ids being clicked
      const bb = C.geom.bbox([Gm.V]);
      const pad = Math.max(bb.w, bb.h) * 0.08;
      wb.setBounds({ x0: bb.x0 - pad, y0: bb.y0 - pad, x1: bb.x1 + pad, y1: bb.y1 + pad }, 0.06);
      const unit = Math.max(bb.w, bb.h) / 100;
      ctx.setGoal('Count the **' + d.find + '**. Click the corners of each one you find to shade it.');

      const board = wb.layer('board');
      const gFound = ctx.s('g', { class: 'cf-found' }, board);
      const gLines = ctx.s('g', { class: 'cf-lines' }, board);
      Gm.lines.forEach((L) => {
        const a = [L.o[0] + L.dir[0] * L.lo, L.o[1] + L.dir[1] * L.lo], b = [L.o[0] + L.dir[0] * L.hi, L.o[1] + L.dir[1] * L.hi];
        ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'stroke-width': unit * 0.9 }, gLines);
      });
      const gPick = ctx.s('g', { class: 'cf-pick' }, wb.layer('top'));
      const gDots = ctx.s('g', { class: 'cf-dots' }, wb.layer('top'));
      const dots = Gm.V.map((v, i) => {
        const c = ctx.s('circle', { cx: v[0], cy: v[1], r: unit * 1.5, 'data-v': i }, gDots);
        return c;
      });
      const gHint = ctx.s('g', { class: 'cf-hint' }, wb.layer('top'));

      const listEl = ctx.h('div.cf-list');
      const counter = ctx.h('div.cf-count');
      const hideBtn = ctx.h('button.btn.small', { type: 'button', onclick: () => { gFound.classList.toggle('hidden'); hideBtn.textContent = gFound.classList.contains('hidden') ? 'Show my shapes' : 'Hide my shapes'; } }, 'Hide my shapes');
      const clearBtn = ctx.h('button.btn.small', { type: 'button', onclick: () => { found = []; draw(); ctx.changed('clear'); } }, 'Clear them');
      ctx.panel.append(ctx.h('div.cf-panel', counter, ctx.h('div.row', hideBtn, clearBtn), listEl));

      function polyOf(ids) { return ids.map((i) => Gm.V[i]); }
      function draw() {
        gFound.innerHTML = '';
        found.forEach((k, i) => {
          const s = byKey.get(k);
          if (!s) return;
          ctx.s('path', { d: C.pathOf(polyOf(s)), fill: PASTEL[i % PASTEL.length], 'data-key': 'shape' + k.replace(/,/g, '-') }, gFound);
        });
        gPick.innerHTML = '';
        if (picked.length > 1) ctx.s('path', { d: C.pathOf(polyOf(picked), picked.length === need), 'stroke-width': unit * 1.2 }, gPick);
        dots.forEach((c, i) => c.classList.toggle('on', picked.includes(i)));
        counter.innerHTML = 'You have marked <b>' + found.length + '</b> ' + (found.length === 1 ? WORD[d.find] : d.find) + '.';
        listEl.textContent = '';
        wb.applyPaints();
      }

      function nearestVertex(pt) {
        let best = -1, bd = (unit * 5) * (unit * 5);
        Gm.V.forEach((v, i) => { const dd = (v[0] - pt[0]) ** 2 + (v[1] - pt[1]) ** 2; if (dd < bd) { bd = dd; best = i; } });
        return best;
      }
      function tapVertex(i) {
        if (i < 0) return;
        const at = picked.indexOf(i);
        if (at >= 0) { picked.splice(at, 1); draw(); return; }
        picked.push(i);
        ctx.sfx('tap');
        if (picked.length < need) { draw(); return; }
        const k = keyOf(picked);
        picked = [];
        if (!byKey.has(k)) { ctx.toast('Those corners do not make a ' + WORD[d.find] + ' of the figure.'); draw(); return; }
        if (found.includes(k)) { ctx.toast('Already counted — that one is shaded.'); draw(); return; }
        found.push(k);
        ctx.sfx('snap');
        draw();
        ctx.changed('found');
        if (found.length === all.length) ctx.say('You have marked every one of them. Now type the number.', 'good');
      }
      wb.handlers.board = {
        down(pt) { const i = nearestVertex(pt); if (i < 0) return false; tapVertex(i); return true; },
        tap(pt) { tapVertex(nearestVertex(pt)); }
      };

      const box = ctx.answer({
        kind: 'number',
        label: 'How many ' + d.find + ' are there altogether?',
        placeholder: 'Your count',
        check: (v) => {
          const n = C.answerTools ? C.answerTools.readNumber(v) : parseFloat(v);
          if (n === d.answer) return { ok: true, msg: 'Yes: **' + d.answer + '** ' + d.find + '.' };
          if (n < d.answer) return { ok: false, msg: 'There are more than that. Look for big ones made of several pieces.' };
          return { ok: false, msg: 'Fewer than that. Is every side of each one on a drawn line?' };
        }
      });
      draw();

      return {
        noMoves: true,
        hint(k) {
          const left = all.filter((s) => !found.includes(keyOf(s)));
          if (!left.length) return 'You have marked them all — the total is how many you marked.';
          // prefer a bigger shape: those are the ones people miss
          left.sort((a, b) => Math.abs(C.geom.area(polyOf(b))) - Math.abs(C.geom.area(polyOf(a))));
          const s = left[Math.min(left.length - 1, k % 3)];
          return {
            text: 'Here is one you have not marked yet (dashed). ' + (left.length > 1 ? 'There are others.' : 'It is the last one.'),
            show() {
              gHint.innerHTML = '';
              ctx.s('path', { d: C.pathOf(polyOf(s)), 'stroke-width': unit * 1.2 }, gHint);
              setTimeout(() => { gHint.innerHTML = ''; }, 5000);
            }
          };
        },
        solve() {
          const left = all.filter((s) => !found.includes(keyOf(s)));
          let i = 0;
          const step = () => {
            if (i >= left.length) { box.feedback('There are <b>' + d.answer + '</b> ' + d.find + ' in all.', 'good'); ctx.changed('solve'); return; }
            found.push(keyOf(left[i++]));
            draw();
            setTimeout(step, C.anim(Math.max(40, 1200 / Math.max(1, left.length))));
          };
          step();
        },
        getState() { return { found: found.slice() }; },
        setState(s) { found = (s && s.found || []).filter((k) => byKey.has(k)); picked = []; draw(); },
        destroy() { wb.handlers.board = null; }
      };
    },

    thumb(p) {
      const G2 = analyse(p.data);
      const bb = C.geom.bbox([G2.V]);
      const pad = Math.max(bb.w, bb.h) * 0.08, sw = Math.max(bb.w, bb.h) / 70;
      let s = '<svg viewBox="' + (bb.x0 - pad) + ' ' + (bb.y0 - pad) + ' ' + (bb.w + 2 * pad) + ' ' + (bb.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet"><g stroke="var(--ink-2)" stroke-width="' + sw + '" stroke-linecap="round">';
      G2.lines.forEach((L) => {
        const a = [L.o[0] + L.dir[0] * L.lo, L.o[1] + L.dir[1] * L.lo], b = [L.o[0] + L.dir[0] * L.hi, L.o[1] + L.dir[1] * L.hi];
        s += '<line x1="' + C.fmtNum(a[0]) + '" y1="' + C.fmtNum(a[1]) + '" x2="' + C.fmtNum(b[0]) + '" y2="' + C.fmtNum(b[1]) + '"/>';
      });
      return s + '</g></svg>';
    }
  });

  C.countFigures = { analyse, shapes, count, FIG, randomFigure, levelOf };

  C.css('countfig', `
    .cf-lines line { stroke: var(--ink); stroke-linecap: round; }
    .cf-found path { opacity: .5; stroke: none; }
    .cf-found.hidden { display: none; }
    .cf-dots circle { fill: var(--ink-2); opacity: .55; cursor: pointer; transition: r .1s; }
    .cf-dots circle:hover { opacity: 1; fill: var(--accent); }
    .cf-dots circle.on { fill: var(--gold); opacity: 1; }
    .cf-pick path { fill: rgba(255, 209, 102, .15); stroke: var(--gold); stroke-dasharray: 1 .8; }
    .cf-hint path { fill: rgba(108, 123, 255, .12); stroke: var(--accent); stroke-dasharray: 1.4 1; animation: cfpulse 1s ease-in-out infinite; }
    @keyframes cfpulse { 50% { opacity: .4; } }
    .cf-panel { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .cf-panel .row { display: flex; gap: 6px; }
    .cf-count { font-size: .9rem; }
    .cf-count b { color: var(--gold); font-size: 1.1rem; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
