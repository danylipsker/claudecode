/* The Puzzle Cabinet · engines/graphs.js
 *
 * Dots and lines: four kinds of graph puzzle, chosen by data.kind.
 *
 *   stroke    draw the figure in one stroke (an Euler trail)
 *             data: { v: [[x, y]...], e: [edge...], start, trail: [edge indices], closed?, labels? }
 *   strokeq   which of these figures can be drawn in one stroke? (answered in the panel)
 *             data: { figs: [{ v, e, name, start?, trail? }...], answer: [indices] }
 *   bridges   walk over every bridge once (Königsberg); or show it cannot be done and
 *             build the fewest new bridges that make a walk possible
 *             data: { w, h, lands: [{ n: name, p: [[x, y]...], at: [x, y] }...],
 *                     br: [[a, b, x1, y1, x2, y2]...], sites: [[a, b, x1, y1, x2, y2]...],
 *                     goal: 'walk' | 'tour', walk: [start, bridge...] | build: k }
 *   hamilton  visit every corner once (and come home): { v, e, labels?, closed, from?, to?,
 *             prefix?, cycle: [v...] | none: true, ask?: true (offer the "impossible" button) }
 *   untangle  drag the dots until no two lines cross: { v: start, e, emb: a planar layout }
 *
 * An edge is [a, b] (straight), [a, b, bend] (a curve bowing sideways by bend × its
 * length) or [a, b, cx, cy, sweep] (a circular arc about (cx, cy); sweep 1 = clockwise
 * on screen). a === b with an arc is a whole circle. Coordinates are in a box about
 * 100 units across.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const GL = () => C.GraphLib;

  /* ---------- edge geometry ---------- */

  function edgeGeo(V, e) {
    const a = V[e[0]], b = V[e[1]];
    const f = (v) => Math.round(v * 1000) / 1000;
    if (e.length >= 5) {
      const c = [e[2], e[3]], r = G.dist(a, c), sw = e[4] ? 1 : 0, dir = sw ? 1 : -1;
      const t0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
      let span;
      if (e[0] === e[1]) span = 2 * Math.PI;
      else {
        const t1 = Math.atan2(b[1] - c[1], b[0] - c[0]);
        span = sw ? t1 - t0 : t0 - t1;
        while (span <= 1e-9) span += 2 * Math.PI;
        while (span > 2 * Math.PI) span -= 2 * Math.PI;
      }
      const n = Math.max(8, Math.ceil(span / 0.1));
      const pts = [];
      for (let i = 0; i <= n; i++) { const t = t0 + dir * span * i / n; pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); }
      let d;
      if (e[0] === e[1]) {
        const m = pts[Math.round(n / 2)];
        d = 'M' + f(a[0]) + ' ' + f(a[1]) + 'A' + f(r) + ' ' + f(r) + ' 0 0 ' + sw + ' ' + f(m[0]) + ' ' + f(m[1]) + 'A' + f(r) + ' ' + f(r) + ' 0 0 ' + sw + ' ' + f(a[0]) + ' ' + f(a[1]);
      } else d = 'M' + f(a[0]) + ' ' + f(a[1]) + 'A' + f(r) + ' ' + f(r) + ' 0 ' + (span > Math.PI ? 1 : 0) + ' ' + sw + ' ' + f(b[0]) + ' ' + f(b[1]);
      return finish(pts, d);
    }
    if (e.length === 3 && e[2]) {
      const L = G.dist(a, b), m = G.mid(a, b), nrm = G.perp(G.norm(G.sub(b, a)));
      const q = G.add(m, G.mul(nrm, e[2] * L));
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20, u = 1 - t;
        pts.push([u * u * a[0] + 2 * u * t * q[0] + t * t * b[0], u * u * a[1] + 2 * u * t * q[1] + t * t * b[1]]);
      }
      return finish(pts, 'M' + f(a[0]) + ' ' + f(a[1]) + 'Q' + f(q[0]) + ' ' + f(q[1]) + ' ' + f(b[0]) + ' ' + f(b[1]));
    }
    return finish([a.slice(), b.slice()], 'M' + f(a[0]) + ' ' + f(a[1]) + 'L' + f(b[0]) + ' ' + f(b[1]));
  }
  function finish(pts, d) {
    let len = 0;
    const cum = [0];
    for (let i = 1; i < pts.length; i++) { len += G.dist(pts[i - 1], pts[i]); cum.push(len); }
    return { pts, d, len, cum, mid: pointAt({ pts, cum, len }, 0.5) };
  }
  // the point a fraction t of the way along a sampled edge
  function pointAt(g, t) {
    const want = t * g.len;
    for (let i = 1; i < g.pts.length; i++) {
      if (g.cum[i] >= want) {
        const seg = g.cum[i] - g.cum[i - 1] || 1;
        return G.lerp(g.pts[i - 1], g.pts[i], (want - g.cum[i - 1]) / seg);
      }
    }
    return g.pts[g.pts.length - 1].slice();
  }
  function distTo(g, p) {
    let best = Infinity;
    for (let i = 1; i < g.pts.length; i++) best = Math.min(best, G.segDist(p, g.pts[i - 1], g.pts[i]));
    return best;
  }
  function bboxOf(V, geos) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); };
    V.forEach(add);
    (geos || []).forEach((g) => g.pts.forEach(add));
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  }

  // move a figure's arcs along with its corners
  function shiftEdges(E, dx, dy) {
    if (!dx && !dy) return E;
    return E.map((e) => (e.length >= 5 ? [e[0], e[1], e[2] + dx, e[3] + dy, e[4]] : e));
  }

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const numWord = (n) => ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][n] || String(n);

  /* ---------- checking the data (node-safe) ---------- */

  function checkEdges(V, E) {
    if (!Array.isArray(V) || !V.length) return 'no vertices';
    if (!Array.isArray(E) || !E.length) return 'no edges';
    for (const e of E) {
      if (!(e[0] >= 0 && e[0] < V.length && e[1] >= 0 && e[1] < V.length)) return 'edge ' + JSON.stringify(e) + ' has a bad end';
      if (e[0] === e[1] && e.length < 5) return 'a loop must be an arc';
      if (e.length >= 5) {
        const r1 = G.dist(V[e[0]], [e[2], e[3]]), r2 = G.dist(V[e[1]], [e[2], e[3]]);
        if (Math.abs(r1 - r2) > 0.02 * Math.max(r1, 1)) return 'arc ' + JSON.stringify(e) + ' ends at different radii';
      }
    }
    return null;
  }

  function verifyStroke(V, E, start, trail, closed) {
    const bad = checkEdges(V, E);
    if (bad) return bad;
    const L = GL();
    const od = L.odd(V.length, E);
    if (od.length !== 0 && od.length !== 2) return od.length + ' odd corners: cannot be drawn in one stroke';
    if (closed && od.length) return 'a closed stroke needs every corner even';
    if (!trail) return 'no stored trail';
    const end = L.trailEnd(E, start, trail);
    if (end < 0 || trail.length !== E.length) return 'the stored trail is not an Euler trail';
    if (closed && end !== start) return 'the stored trail does not come back to its start';
    return null;
  }

  function drawableFig(f) {
    const L = GL();
    const n = f.v.length;
    const od = L.odd(n, f.e);
    if (od.length !== 0 && od.length !== 2) return false;
    const s = od.length ? od[0] : f.e[0][0];
    return L.eulerFrom(n, f.e, [], s) != null;
  }

  // bridges: land masses are the vertices, bridges the edges
  function bridgeEdges(d, extra) {
    const E = d.br.map((b) => [b[0], b[1]]);
    (extra || []).forEach((i) => { const s = d.sites[i]; E.push([s[0], s[1]]); });
    return E;
  }
  function walkable(n, E, tour) {
    const L = GL();
    const od = L.odd(n, E);
    if (tour ? od.length !== 0 : od.length > 2) return null;
    const s = od.length ? od[0] : E[0][0];
    return L.eulerFrom(n, E, [], s) ? s : null;
  }
  // the fewest building sites to use so that a walk exists: { k, sets: [[site...]] (up to 3) }
  function minBuild(d) {
    const n = d.lands.length, S = (d.sites || []).length, tour = d.goal === 'tour';
    const out = { k: -1, sets: [] };
    for (let k = 0; k <= Math.min(S, 5); k++) {
      const pick = [];
      const rec = (from) => {
        if (out.sets.length >= 3) return;
        if (pick.length === k) {
          if (walkable(n, bridgeEdges(d, pick), tour) != null) out.sets.push(pick.slice());
          return;
        }
        for (let i = from; i < S; i++) { pick.push(i); rec(i + 1); pick.pop(); }
      };
      rec(0);
      if (out.sets.length) { out.k = k; return out; }
    }
    return out;
  }

  function verifyBridges(d) {
    if (!d.lands || d.lands.length < 2) return 'at least two land masses';
    if (!d.br || !d.br.length) return 'no bridges';
    const n = d.lands.length;
    for (const b of d.br.concat(d.sites || [])) if (!(b[0] >= 0 && b[0] < n && b[1] >= 0 && b[1] < n && b[0] !== b[1])) return 'bridge ' + JSON.stringify(b) + ' joins bad lands';
    const L = GL();
    const E = bridgeEdges(d);
    const tour = d.goal === 'tour';
    if (walkable(n, E, tour) != null) {
      if (!d.walk) return 'a walk exists but none is stored';
      const end = L.trailEnd(E, d.walk[0], d.walk.slice(1));
      if (end < 0 || d.walk.length - 1 !== E.length) return 'the stored walk is wrong';
      if (tour && end !== d.walk[0]) return 'the stored walk does not come home';
      if (d.build != null) return 'build is set but a walk exists';
      return null;
    }
    if (d.walk) return 'a walk is stored but none exists';
    const mb = minBuild(d);
    if (mb.k < 0) return 'no set of sites makes a walk possible';
    if (d.build !== mb.k) return 'build is ' + d.build + ' but the fewest new bridges is ' + mb.k;
    return null;
  }

  function verifyHamilton(d) {
    const bad = checkEdges(d.v, d.e);
    if (bad) return bad;
    const L = GL();
    const n = d.v.length, adj = L.adjacency(n, d.e);
    const closed = d.closed !== false;
    const prefix = d.prefix || (d.from != null ? [d.from] : null);
    if (d.none) {
      const r = L.hamilton(n, adj, { closed, prefix, from: d.from, to: d.to, limit: 3e6 });
      if (r.aborted) return 'the search gave up: cannot prove there is no route';
      if (r.sols.length) return 'marked impossible, but a route exists: ' + r.sols[0].join(',');
      return null;
    }
    const cyc = d.cycle;
    if (!cyc || cyc.length !== n) return 'the stored route does not visit every corner';
    if (new Set(cyc).size !== n) return 'the stored route repeats a corner';
    for (let i = 1; i < n; i++) if (!adj[cyc[i - 1]].includes(cyc[i])) return 'the stored route uses a missing line ' + cyc[i - 1] + '-' + cyc[i];
    if (closed && !adj[cyc[n - 1]].includes(cyc[0])) return 'the stored route does not close';
    if (prefix && prefix.some((v, i) => cyc[i] !== v)) return 'the stored route does not begin with the given corners';
    if (!closed && d.to != null && cyc[n - 1] !== d.to) return 'the stored route ends in the wrong place';
    return null;
  }

  function verifyUntangle(d) {
    const bad = checkEdges(d.v, d.e);
    if (bad) return bad;
    if (!d.emb || d.emb.length !== d.v.length) return 'no planar layout';
    if (d.e.some((e) => e.length > 2)) return 'untangle edges must be straight';
    const L = GL();
    const x = L.crossings(d.emb, d.e);
    if (x.length) return 'the stored layout has ' + x.length + ' crossings';
    const s = L.crossings(d.v, d.e);
    if (!s.length) return 'already untangled at the start';
    for (let i = 0; i < d.emb.length; i++) for (let j = i + 1; j < d.emb.length; j++) if (G.dist(d.emb[i], d.emb[j]) < 0.5) return 'two dots of the layout coincide';
    return null;
  }

  /* ---------- a figure you draw in one stroke ---------- */

  const PEN = 'M0 0L-4.6 -9.5Q-6 -13 -5.2 -16H5.2Q6 -13 4.6 -9.5Z';
  const PEN_SLIT = 'M0 -1.5V-10.5';

  function hueOf(k, n) { return Math.round(188 - 150 * (n > 1 ? k / (n - 1) : 0)); }

  function Tracer(ctx, fig, opt) {
    const L = GL();
    const dx = opt.dx || 0, dy = opt.dy || 0;
    const V = fig.v.map((p) => [p[0] + dx, p[1] + dy]);
    const E = shiftEdges(fig.e, dx, dy);
    const n = V.length;
    const geos = E.map((e) => edgeGeo(V, e));
    const t = { V, E, geos, n, trail: [], start: -1, box: bboxOf(V, geos), showNums: false, busy: false };
    const key = opt.key || '';
    const g = ctx.s('g', { class: 'g-fig' }, opt.parent);
    const faintG = ctx.s('g', { class: 'g-faint' }, g);
    const inkG = ctx.s('g', { class: 'g-ink' }, g);
    const numG = ctx.s('g', { class: 'g-nums' }, g);
    const vertG = ctx.s('g', { class: 'g-verts' }, g);
    const flashG = ctx.s('g', { class: 'g-flash' }, opt.top);
    t.faintEls = geos.map((ge, i) => ctx.s('path', { d: ge.d, class: 'g-edge', 'data-key': key + 'e' + i }, faintG));
    t.inkEls = geos.map((ge) => { const el = ctx.s('path', { d: ge.d, class: 'g-trace' }, inkG); el.style.display = 'none'; return el; });
    t.vEls = V.map((p, i) => ctx.s('circle', { cx: p[0], cy: p[1], class: 'g-v', 'data-key': key + 'v' + i }, vertG));
    if (fig.labels) fig.labels.forEach((lb, i) => { if (lb) ctx.s('text', { x: V[i][0], y: V[i][1], class: 'g-vlabel', dy: '-1.2em', text: lb }, vertG); });
    const ring = ctx.s('circle', { class: 'g-penring' }, opt.top);
    const pen = ctx.s('g', { class: 'g-pen' }, opt.top);
    ctx.s('path', { d: 'M-5.6 -16h11.2v4H-5.6z', class: 'g-pen-collar' }, pen);
    ctx.s('path', { d: 'M-6 -38h12v22H-6z', class: 'g-pen-body' }, pen);
    ctx.s('path', { d: PEN, class: 'g-pen-nib' }, pen);
    ctx.s('path', { d: PEN_SLIT, class: 'g-pen-slit' }, pen);
    ctx.s('circle', { cx: 0, cy: -10.5, r: 1.3, class: 'g-pen-hole' }, pen);
    let penAnim = 0;

    function placePen(p) {
      if (!p) { pen.style.display = 'none'; ring.style.display = 'none'; return; }
      pen.style.display = ''; ring.style.display = '';
      pen.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(calc(1 / var(--k))) rotate(32deg)';
      ring.setAttribute('cx', p[0]); ring.setAttribute('cy', p[1]);
    }

    t.used = () => { const u = new Array(E.length).fill(false); t.trail.forEach((i) => { u[i] = true; }); return u; };
    t.end = () => (t.trail.length ? L.trailEnd(E, t.start, t.trail) : t.start);
    t.done = () => t.trail.length === E.length;
    t.canFinish = () => (t.start < 0 ? true : L.eulerFrom(n, E, t.used(), t.end()) != null);
    t.between = (u, w, wantUsed) => {
      const used = t.used(), out = [];
      E.forEach((e, i) => {
        if (!!used[i] !== !!wantUsed) return;
        if ((e[0] === u && e[1] === w) || (e[0] === w && e[1] === u)) out.push(i);
      });
      return out;
    };
    t.stranded = () => { if (t.start < 0 || t.done()) return false; const u = t.used(), v = t.end(); return !E.some((e, i) => !u[i] && (e[0] === v || e[1] === v)); };

    t.draw = () => {
      const used = t.used(), end = t.end();
      t.inkEls.forEach((el, i) => {
        const k = t.trail.indexOf(i);
        el.style.display = k >= 0 ? '' : 'none';
        if (k >= 0) el.style.setProperty('--h', hueOf(k, E.length));
        t.faintEls[i].classList.toggle('used', !!used[i]);
      });
      const stuck = t.stranded();
      t.vEls.forEach((el, i) => {
        el.classList.toggle('start', i === t.start && t.trail.length > 0);
        el.classList.toggle('end', i === end);
        el.classList.toggle('stuck', i === end && stuck);
      });
      numG.innerHTML = '';
      if (t.showNums) t.trail.forEach((i, k) => {
        const m = geos[i].mid;
        const gg = ctx.s('g', { class: 'g-num', transform: 'translate(' + m[0] + ' ' + m[1] + ')' }, numG);
        const inner = ctx.s('g', { class: 'g-num-in' }, gg);
        ctx.s('circle', { r: 9 }, inner);
        ctx.s('text', { y: 0.5, text: String(k + 1) }, inner);
      });
      if (!penAnim) placePen(end >= 0 ? V[end] : null);
      ring.classList.toggle('stuck', stuck);
    };

    // light up edge i, drawn from the pen's corner; the pen rides along
    t.extend = (i, anim, ms) => {
      const from = t.end();
      const rev = E[i][0] !== from;
      t.trail.push(i);
      t.draw();
      if (!anim || !root.requestAnimationFrame) return;
      const el = t.inkEls[i], ge = geos[i];
      const len = ge.len;
      const dur = C.anim(ms || 180);
      el.style.strokeDasharray = len + ' ' + len;
      el.style.strokeDashoffset = rev ? -len : len;
      const t0 = performance.now();
      const my = ++penAnim;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / (dur || 1)), e = 1 - (1 - k) * (1 - k);
        el.style.strokeDashoffset = (rev ? -1 : 1) * len * (1 - e);
        if (my === penAnim) placePen(pointAt(ge, rev ? 1 - e : e));
        if (k < 1) root.requestAnimationFrame(step);
        else {
          el.style.strokeDasharray = ''; el.style.strokeDashoffset = '';
          if (my === penAnim) { penAnim = 0; t.draw(); }
        }
      };
      root.requestAnimationFrame(step);
    };
    t.retract = () => { if (t.trail.length) t.trail.pop(); else t.start = -1; penAnim = 0; t.draw(); };
    t.clear = () => { t.trail = []; t.start = -1; penAnim = 0; t.draw(); };
    t.getState = () => ({ s: t.start, t: t.trail.slice() });
    t.setState = (s) => {
      penAnim = 0;
      t.start = s && s.s != null ? s.s : -1;
      t.trail = s && s.t ? s.t.slice() : [];
      if (t.trail.length && L.trailEnd(E, t.start, t.trail) < 0) { t.trail = []; }
      t.draw();
    };
    t.vertexAt = (pt, tol) => { let best = -1, bd = tol; V.forEach((p, i) => { const d = G.dist(p, pt); if (d < bd) { bd = d; best = i; } }); return best; };
    t.edgeAt = (pt, tol) => { let best = -1, bd = tol; geos.forEach((ge, i) => { const d = distTo(ge, pt); if (d < bd) { bd = d; best = i; } }); return best; };
    t.inBox = (pt, pad) => pt[0] >= t.box.x0 - pad && pt[0] <= t.box.x1 + pad && pt[1] >= t.box.y0 - pad && pt[1] <= t.box.y1 + pad;
    t.fit = (i, track) => { let m = 0; track.forEach((p) => { m = Math.max(m, distTo(geos[i], p)); }); return m; };

    // brief highlights for hints and warnings
    t.flashEdge = (i, cls, ms) => {
      const el = ctx.s('path', { d: geos[i].d, class: 'g-hl ' + (cls || '') }, flashG);
      setTimeout(() => el.remove(), ms || 2600);
    };
    t.pulse = (vs, ms) => {
      vs.forEach((v) => {
        const el = ctx.s('circle', { cx: V[v][0], cy: V[v][1], class: 'g-pulse' }, flashG);
        setTimeout(() => el.remove(), ms || 3200);
      });
    };
    t.showDegrees = (ms) => {
      const d = L.degrees(n, E);
      V.forEach((p, i) => {
        const gg = ctx.s('g', { class: 'g-deg' + (d[i] % 2 ? ' odd' : ''), transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, flashG);
        const inner = ctx.s('g', { class: 'g-deg-in' }, gg);
        ctx.s('rect', { x: 8, y: -24, width: 17, height: 17, rx: 5 }, inner);
        ctx.s('text', { x: 16.5, y: -15, text: String(d[i]) }, inner);
        setTimeout(() => gg.remove(), ms || 4200);
      });
    };
    t.markOdd = (on) => {
      const od = new Set(L.odd(n, E));
      t.vEls.forEach((el, i) => el.classList.toggle('oddmark', !!on && od.has(i)));
    };
    t.draw();
    return t;
  }

  // what a tracer says after a line is drawn
  function strokeNews(t) {
    if (t.start < 0) return { msg: '' };
    if (t.done()) return { msg: 'Every line drawn!', kind: 'good' };
    if (t.stranded()) {
      const left = t.E.length - t.trail.length;
      return { msg: 'Stranded: no line is left at this corner, and ' + C.plural(left, 'line') + ' still wait. Undo (Ctrl+Z) to back up.', kind: 'warn' };
    }
    if (!t.trail.length) return { msg: 'The pen is down. Drag along a line, or click the next corner.' };
    return { msg: t.trail.length + ' of ' + t.E.length + ' lines drawn.' };
  }

  // pointer handling shared by the stroke kinds: tracers = [Tracer...]
  function strokeInput(ctx, tracers, after) {
    const wb = ctx.wb;
    let g = null;
    const wire = ctx.s('path', { class: 'g-wire' }, wb.layer('top'));
    const pick = (pt) => tracers.find((t) => t.inBox(pt, wb.px(30))) || null;

    function commit(t, i) {
      t.extend(i, true, 150);
      ctx.sfx('tap');
      after(t, 'line');
    }
    function tapVertex(t, v) {
      if (t.start < 0 || (!t.trail.length && v !== t.start)) {
        t.start = v; t.draw();
        after(t, 'start');
        return;
      }
      const end = t.end();
      if (v === end) { ctx.say('Drag from the pen along a line, or click a corner joined to it.'); return; }
      const c = t.between(end, v);
      if (c.length) {
        if (c.length > 1) ctx.toast('Two lines join these corners — click a line itself to choose one.');
        const straight = c.find((i) => t.E[i].length < 3);
        commit(t, straight != null ? straight : c[0]);
        return;
      }
      const usedC = t.between(end, v, true);
      if (usedC.length) { ctx.say('That line is drawn already — no line twice.', 'warn'); usedC.forEach((i) => t.flashEdge(i, 'bad', 900)); return; }
      ctx.say('No line joins the pen to that corner, and the pen may not jump.', 'warn');
    }
    function tapEdge(t, i, pt) {
      const e = t.E[i];
      if (t.used()[i]) { ctx.say('That line is drawn already.', 'warn'); t.flashEdge(i, 'bad', 900); return; }
      if (t.start < 0 || !t.trail.length) {
        let s = t.start;
        if (s < 0 || (e[0] !== s && e[1] !== s)) s = G.dist(pt, t.V[e[0]]) <= G.dist(pt, t.V[e[1]]) ? e[0] : e[1];
        t.start = s;
        commit(t, i);
        return;
      }
      const end = t.end();
      if (e[0] === end || e[1] === end) { commit(t, i); return; }
      ctx.say('That line does not start at the pen. Carry on from the pen — the stroke may not break.', 'warn');
    }

    wb.handlers.board = {
      down(pt) {
        const t = pick(pt);
        if (!t || t.busy) return false;
        const v = t.vertexAt(pt, wb.px(18));
        if (v >= 0) { g = { t, v0: v, track: [pt], moved: false, mode: 'v' }; return true; }
        const i = t.edgeAt(pt, wb.px(12));
        if (i >= 0) { g = { t, i, pt, mode: 'e' }; return true; }
        return false;
      },
      move(pt) {
        if (!g || g.mode !== 'v') return;
        const t = g.t;
        if (!g.moved) {
          if (G.dist(pt, g.track[0]) < wb.px(7)) return;
          g.moved = true;
          if (t.start < 0 || (!t.trail.length && g.v0 !== t.start)) { t.start = g.v0; t.draw(); g.began = true; }
          else if (g.v0 !== t.end()) { g.bad = true; ctx.say('Carry on from the pen (the glowing corner) — the stroke may not break.', 'warn'); return; }
        }
        if (g.bad) return;
        g.track.push(pt);
        const cur = t.end(), p0 = t.V[cur];
        wire.setAttribute('d', 'M' + p0[0] + ' ' + p0[1] + 'L' + pt[0] + ' ' + pt[1]);
        const w = t.vertexAt(pt, wb.px(16));
        if (w < 0 || (w === cur && g.track.length < 10)) { if (w < 0) g.warned = -1; return; }
        const cands = t.between(cur, w);
        if (cands.length) {
          let best = -1, bf = Infinity;
          cands.forEach((i) => { const f = t.fit(i, g.track); if (f < bf) { bf = f; best = i; } });
          if (bf < Math.max(wb.px(36), 0.32 * t.geos[best].len)) {
            commit(t, best);
            g.track = [t.V[w].slice()];
            g.committed = true;
            g.warned = w;
          }
        } else if (w !== cur && g.warned !== w) {
          g.warned = w;
          const usedC = t.between(cur, w, true);
          if (usedC.length) { usedC.forEach((i) => t.flashEdge(i, 'bad', 700)); ctx.say('That line is drawn already — no line twice.', 'warn'); }
        }
      },
      up() {
        wire.setAttribute('d', '');
        const gg = g;
        g = null;
        if (!gg) return;
        if (gg.mode === 'e') { tapEdge(gg.t, gg.i, gg.pt); return; }
        if (!gg.moved) { tapVertex(gg.t, gg.v0); return; }
        if (gg.began && !gg.committed) after(gg.t, 'start');
      }
    };
    return { destroy() { wire.remove(); } };
  }

  function strokeExplain(fig) {
    const L = GL();
    const d = L.degrees(fig.v.length, fig.e), od = L.odd(fig.v.length, fig.e);
    if (od.length === 0) return 'Every corner of this figure has an even number of lines, so the stroke can start anywhere — and it must end where it began. Each time the pen passes through a corner it uses two lines, one in and one out, so even corners are never a problem.';
    if (od.length === 2) return 'Exactly two corners have an odd number of lines (' + d[od[0]] + ' and ' + d[od[1]] + '). Each time the pen passes through a corner it uses two lines, one in and one out, so a corner with an odd number must be where the stroke begins or ends. Start at one odd corner and you will finish at the other.';
    return 'This figure has ' + od.length + ' corners where an odd number of lines meet. Every odd corner must be an end of the stroke, and a stroke has only two ends, so it cannot be drawn without lifting the pen: it needs ' + numWord(od.length / 2) + ' strokes.';
  }

  function mountStroke(ctx, p) {
    const d = p.data, wb = ctx.wb, L = GL();
    const board = wb.layer('board'), top = wb.layer('top');
    const box = bboxOf(d.v, d.e.map((e) => edgeGeo(d.v, e)));
    ctx.s('rect', { x: box.x0 - 12, y: box.y0 - 12, width: box.w + 24, height: box.h + 24, rx: 6, class: 'g-slate' }, board);
    const t = Tracer(ctx, { v: d.v, e: d.e, labels: d.labels }, { parent: board, top });
    wb.setBounds({ x0: box.x0 - 14, y0: box.y0 - 14, x1: box.x1 + 14, y1: box.y1 + 14 }, 0.1);
    if (!p.goal) ctx.setGoal(d.closed ? 'Draw every line exactly once without lifting the pen, and finish where you started.' : 'Draw every line exactly once without lifting the pen.');
    const stat = () => ctx.stat('Lines', t.trail.length + ' / ' + d.e.length);
    stat();
    const input = strokeInput(ctx, [t], (tr, why) => {
      const nw = strokeNews(tr);
      if (!tr.done()) ctx.say(nw.msg, nw.kind);
      stat();
      ctx.changed(why);
    });
    const numBtn = ctx.button('Number the lines', () => { t.showNums = !t.showNums; numBtn.classList.toggle('on', t.showNums); t.draw(); }, 'small');
    ctx.button('Start again', () => { if (t.busy || (!t.trail.length && t.start < 0)) return; t.clear(); stat(); ctx.say('A clean sheet.'); ctx.changed('clear'); }, 'small.ghost');

    let hintStage = 0;
    return {
      noMoves: true,
      check() {
        if (!t.done()) return { solved: false, msg: t.trail.length ? t.trail.length + ' of ' + d.e.length + ' lines drawn so far.' : 'Nothing drawn yet: press on a corner and drag along the lines.' };
        if (d.closed && t.end() !== t.start) return { solved: false, msg: 'Every line is drawn, but the stroke must finish where it started.' };
        return { solved: true, msg: 'Every line drawn once, in one stroke' + (d.closed ? ', ending where it began.' : '.') };
      },
      hint() {
        const od = L.odd(t.n, t.E);
        if (t.start < 0 && hintStage === 0) {
          hintStage = 1;
          return {
            text: od.length ? 'Count the lines meeting at each corner. Exactly two corners have an **odd** number — the stroke must begin at one of them and end at the other.' : 'Count the lines meeting at each corner: every count is **even**. Start anywhere you like; you will come back to where you began.',
            show() { t.showDegrees(4800); t.pulse(od, 4800); }
          };
        }
        if (t.start < 0 || (!t.trail.length && od.length && !od.includes(t.start))) {
          const s = od.length ? od[0] : d.start;
          return { text: 'Put the pen down on the pulsing corner' + (od.length ? ', one of the two odd ones' : '') + '.', show() { t.pulse([s], 3500); } };
        }
        if (!t.canFinish()) {
          const all = t.trail.slice();
          let k = all.length - 1;
          for (; k >= 0; k--) {
            const used = new Array(t.E.length).fill(false);
            all.slice(0, k).forEach((i) => { used[i] = true; });
            const end = L.trailEnd(t.E, t.start, all.slice(0, k));
            if (L.eulerFrom(t.n, t.E, used, end) != null) break;
          }
          if (k < 0) return { text: 'This start cannot work: go back to the very beginning and start at an odd corner.', show() { t.pulse(od, 3500); } };
          return {
            text: 'Go back until ' + C.plural(k, 'line is', 'lines are') + ' drawn: line ' + (k + 1) + ' (flashing red) cut off lines you could never return to.',
            show() { t.flashEdge(all[k], 'bad', 3500); }
          };
        }
        const nx = L.eulerFrom(t.n, t.E, t.used(), t.end());
        if (!nx || !nx.length) return 'All drawn!';
        return {
          text: 'Next, the flashing line. A rule of thumb (Fleury\'s): never take a line that would cut the undrawn part in two, unless there is no other way on.',
          show() { t.flashEdge(nx[0], 'good', 2600); }
        };
      },
      solve() {
        let steps = null;
        if (t.start >= 0 && t.canFinish() && (!d.closed || L.odd(t.n, t.E).length === 0)) steps = L.eulerFrom(t.n, t.E, t.used(), t.end());
        if (!steps) { t.clear(); t.start = d.start; t.draw(); steps = d.trail.slice(); }
        t.busy = true;
        let k = 0;
        const next = () => {
          if (k >= steps.length) { t.busy = false; stat(); ctx.changed('solve'); return; }
          t.extend(steps[k++], true, 230);
          stat();
          setTimeout(next, C.anim(250));
        };
        next();
      },
      explain() { return strokeExplain(d); },
      getState() { return t.getState(); },
      setState(s) { t.setState(s); stat(); },
      key(ev) {
        if (ev.type === 'keydown' && ev.key === 'Backspace' && !t.busy && (t.trail.length || t.start >= 0)) { t.retract(); stat(); ctx.changed('back'); return true; }
        return false;
      },
      destroy() { input.destroy(); t.busy = true; }
    };
  }

  function figLayout(figs) {
    // side by side (four figures: two rows of two)
    const out = [];
    const cols = figs.length === 4 ? 2 : figs.length;
    figs.forEach((f, i) => {
      const box = bboxOf(f.v, f.e.map((e) => edgeGeo(f.v, e)));
      const col = i % cols, row = Math.floor(i / cols);
      out.push({ dx: col * 135 + 50 - box.cx, dy: row * 140 + 50 - box.cy, cx: col * 135 + 50, cy: row * 140 + 50 });
    });
    return { cells: out, cols, rows: Math.ceil(figs.length / cols) };
  }

  function mountStrokeQ(ctx, p) {
    const d = p.data, wb = ctx.wb, L = GL();
    const board = wb.layer('board'), top = wb.layer('top');
    const lay = figLayout(d.figs);
    const tracers = d.figs.map((f, i) => {
      const c = lay.cells[i];
      ctx.s('rect', { x: c.cx - 60, y: c.cy - 60, width: 120, height: 130, rx: 7, class: 'g-slate' }, board);
      if (d.figs.length > 1) ctx.s('text', { x: c.cx, y: c.cy + 64, class: 'g-figletter', text: LETTERS[i] }, board);
      return Tracer(ctx, f, { parent: board, top, dx: c.dx, dy: c.dy, key: 'f' + i });
    });
    wb.setBounds({ x0: -16, y0: -16, x1: lay.cols * 135 - 19, y1: lay.rows * 140 - 4 }, 0.08);
    const input = strokeInput(ctx, tracers, (tr, why) => {
      const nw = strokeNews(tr);
      ctx.say(tr.done() ? 'That one can be drawn in one stroke.' : nw.msg, tr.done() ? 'good' : nw.kind);
      ctx.changed(why);
    });
    const single = d.figs.length === 1;
    ctx.setGoal(single ? 'Decide whether the figure can be drawn in one stroke.' : 'Pick every figure that can be drawn in one stroke. (You may try them on the table first.)');
    const oddN = (i) => L.odd(d.figs[i].v.length, d.figs[i].e).length;
    const choices = single ? ['Yes, in one stroke', 'No, it cannot be done'] : d.figs.map((f, i) => 'Figure ' + LETTERS[i] + (f.name ? ': ' + f.name : '')).concat(['None of them']);
    const none = d.figs.length;
    const want = d.answer.slice().sort((a, b) => a - b);
    const box = ctx.answer({
      kind: single ? 'choice' : 'multi',
      choices,
      check(v) {
        if (single) {
          const yes = want.length === 1;
          if ((v === 0) === yes) return { ok: true, msg: yes ? 'Yes — it has ' + (oddN(0) ? 'exactly two odd corners.' : 'no odd corners at all.') : 'Right: it has ' + oddN(0) + ' odd corners, and a stroke has only two ends.' };
          return { ok: false, msg: yes ? 'Look again — try tracing it on the table.' : 'Count the lines at each corner before you try.' };
        }
        if (v.includes(none)) {
          if (v.length > 1) return { ok: false, msg: '“None of them” and a figure at the same time? Pick one or the other.' };
          return want.length ? { ok: false, msg: 'At least one of them can be drawn — try tracing.' } : { ok: true, msg: 'Right — none of them can be drawn in one stroke.' };
        }
        if (v.length === want.length && v.every((x, i) => x === want[i])) return { ok: true, msg: 'Yes: ' + want.map((i) => LETTERS[i]).join(', ') + '.' };
        const extra = v.filter((x) => !want.includes(x));
        if (extra.length) return { ok: false, msg: 'Figure ' + LETTERS[extra[0]] + ' cannot be drawn in one stroke — count its odd corners.' };
        return { ok: false, msg: 'There are more that can be drawn.' };
      }
    });
    ctx.button('Rub out my tracing', () => { tracers.forEach((t) => t.clear()); ctx.changed('clear'); }, 'small.ghost');
    ctx.button('Ring the odd corners', () => { tracers.forEach((t) => t.markOdd(true)); ctx.say('The red rings mark corners where an odd number of lines meet.', 'info'); }, 'small');
    return {
      noMoves: true,
      hint(n) {
        if (n === 0) return { text: 'Count the lines at each corner of ' + (single ? 'the figure' : 'each figure') + '. A figure can be drawn in one stroke when it has no odd corners, or exactly two.', show() { tracers.forEach((t) => t.showDegrees(5200)); } };
        if (n === 1) return { text: 'The red rings mark the odd corners.', show() { tracers.forEach((t) => t.markOdd(true)); } };
        return null;
      },
      solve() {
        box.feedback('The answer: ' + (single ? (want.length ? '<b>yes</b>' : '<b>no</b>') : (want.length ? 'figures <b>' + want.map((i) => LETTERS[i]).join(', ') + '</b>' : '<b>none of them</b>')) + '. Odd corners are ringed in red.', 'good');
        tracers.forEach((t, i) => {
          t.markOdd(true);
          if (!want.includes(i)) return;
          const f = d.figs[i];
          t.clear();
          const od = L.odd(t.n, t.E);
          t.start = f.start != null ? f.start : (od.length ? od[0] : t.E[0][0]);
          const steps = f.trail || L.eulerFrom(t.n, t.E, [], t.start) || [];
          t.draw();
          let k = 0;
          const next = () => { if (k < steps.length) { t.extend(steps[k++], true, 200); setTimeout(next, C.anim(220)); } };
          next();
        });
      },
      explain() {
        return d.figs.map((f, i) => '**' + (single ? 'The figure' : 'Figure ' + LETTERS[i]) + '** has ' + numWord(oddN(i)) + ' odd corner' + (oddN(i) === 1 ? '' : 's') + (want.includes(i) ? ': it can be drawn.' : ': it cannot.')).join(' ') + ' A stroke has two ends, and only its ends can be odd corners — every corner the pen passes through uses its lines in pairs.';
      },
      getState() { return { f: tracers.map((t) => t.getState()) }; },
      setState(s) { if (s && s.f) tracers.forEach((t, i) => t.setState(s.f[i])); },
      destroy() { input.destroy(); }
    };
  }

  /* ---------- round trips (Hamilton) ---------- */

  // two colours with every line joining different colours, or null
  function twoColour(n, adj) {
    const col = new Array(n).fill(-1);
    for (let s = 0; s < n; s++) {
      if (col[s] >= 0) continue;
      col[s] = 0;
      const q = [s];
      while (q.length) {
        const v = q.pop();
        for (const w of adj[v]) {
          if (col[w] < 0) { col[w] = 1 - col[v]; q.push(w); }
          else if (col[w] === col[v]) return null;
        }
      }
    }
    return col;
  }

  function mountHamilton(ctx, p) {
    const d = p.data, wb = ctx.wb, L = GL();
    const V = d.v, n = V.length, adj = L.adjacency(n, d.e);
    const closed = d.closed !== false;
    const fixed = d.prefix ? d.prefix.slice() : (d.from != null ? [d.from] : []);
    const to = d.to == null ? -1 : d.to;
    const geos = d.e.map((e) => edgeGeo(V, e));
    const eOf = new Map();
    d.e.forEach((e, i) => { eOf.set(e[0] + ',' + e[1], i); eOf.set(e[1] + ',' + e[0], i); });
    const labels = d.labels || null;
    let path = fixed.slice(), shut = false, claimed = false, wrong = 0, busy = false;

    const board = wb.layer('board'), top = wb.layer('top');
    const box = bboxOf(V, geos);
    ctx.s('rect', { x: box.x0 - 12, y: box.y0 - 12, width: box.w + 24, height: box.h + 24, rx: 6, class: 'g-slate' }, board);
    const edgeG = ctx.s('g', { class: 'g-hedges' }, board);
    geos.forEach((ge, i) => ctx.s('path', { d: ge.d, class: 'g-hedge', 'data-key': 'e' + i }, edgeG));
    const pathG = ctx.s('g', { class: 'g-hpath' }, board);
    const vertG = ctx.s('g', { class: 'g-hverts' + (labels ? ' lettered' : '') }, board);
    const flashG = ctx.s('g', { class: 'g-flash' }, top);
    const vEls = V.map((q, i) => {
      const gg = ctx.s('g', { class: 'g-hv', transform: 'translate(' + q[0] + ' ' + q[1] + ')' }, vertG);
      const inner = ctx.s('g', { class: 'g-hv-in' }, gg);
      ctx.s('circle', { r: 20, class: 'g-hv-hit' }, inner);
      ctx.s('circle', { r: labels ? 11 : 8.5, class: 'g-hv-dot', 'data-key': 'v' + i }, inner);
      const tx = ctx.s('text', { y: 0.5, class: 'g-hv-t', text: labels ? labels[i] : '' }, inner);
      const badge = ctx.s('text', { x: 13, y: -12, class: 'g-hv-n' }, inner);
      if (i === d.from || (fixed.length && i === fixed[0])) ctx.s('path', { d: 'M-4 -13V-25l9 3.5-9 3.5', class: 'g-flag start' }, inner);
      if (i === to) ctx.s('path', { d: 'M-4 -13V-25l9 3.5-9 3.5', class: 'g-flag finish' }, inner);
      return { gg, tx, badge };
    });
    wb.setBounds({ x0: box.x0 - 14, y0: box.y0 - 14, x1: box.x1 + 14, y1: box.y1 + 14 }, 0.1);

    const nameOf = (v) => (labels ? labels[v] : 'that corner');
    const endV = () => (path.length ? path[path.length - 1] : -1);
    const isCand = (w) => {
      const e = endV();
      if (e < 0 || shut || path.includes(w) || !adj[e].includes(w)) return false;
      if (!closed && to >= 0 && w === to && path.length !== n - 1) return false;
      return true;
    };
    const complete = () => (d.none ? claimed : closed ? shut : (path.length === n && (to < 0 || endV() === to)));

    function draw() {
      pathG.innerHTML = '';
      const segs = [];
      for (let i = 1; i < path.length; i++) segs.push([path[i - 1], path[i], i - 1]);
      if (shut) segs.push([path[path.length - 1], path[0], path.length - 1]);
      segs.forEach(([a, b, k]) => {
        const i = eOf.get(a + ',' + b);
        if (i == null) return;
        const el = ctx.s('path', { d: geos[i].d, class: 'g-hseg' + (k < fixed.length - 1 ? ' given' : '') }, pathG);
        el.style.setProperty('--h', hueOf(k, n));
      });
      const end = endV();
      vEls.forEach((ve, i) => {
        const k = path.indexOf(i);
        ve.gg.setAttribute('class', 'g-hv' + (k >= 0 ? ' on' : '') + (i === end && !shut ? ' end' : '') + (k === 0 ? ' first' : '') + (isCand(i) ? ' cand' : '') + (k >= 0 && k < fixed.length ? ' given' : '') + (shut ? ' shut' : ''));
        if (k >= 0) ve.gg.style.setProperty('--h', hueOf(k, n)); else ve.gg.style.removeProperty('--h');
        const num = k >= 0 ? String(k + 1) : '';
        if (labels) ve.badge.textContent = num; else ve.tx.textContent = num;
      });
      ctx.stat('Visited', path.length + ' / ' + n);
    }

    function news() {
      if (d.none) return;
      if (shut) return;
      const e = endV();
      if (path.length === n) {
        if (closed) ctx.say(adj[e].includes(path[0]) ? 'Every corner visited. Now close the trip: click the first corner.' : 'Every corner visited — but the last is not joined to the first. Back up and try another way.', adj[e].includes(path[0]) ? 'info' : 'warn');
        else if (to >= 0 && e !== to) ctx.say('Every corner visited, but the trip must end at the flag.', 'warn');
        return;
      }
      if (path.length && !adj[e].some((w) => isCand(w))) ctx.say('Dead end: no unvisited corner is joined to this one. Click an earlier corner to go back to it.', 'warn');
      else if (path.length) ctx.say(path.length + ' of ' + n + ' corners visited.');
    }

    function act(why) { draw(); news(); ctx.changed(why); }

    function extend(w) { path.push(w); ctx.sfx('tap'); }
    function tap(v) {
      if (busy || claimed) return;
      if (!path.length) { path = [v]; act('start'); ctx.say('Start at ' + (labels ? labels[v] : 'the lit corner') + '. Now click the next corner along a line.'); return; }
      if (shut) {
        if (v === path[0] || v === endV()) { shut = false; act('open'); }
        return;
      }
      if (isCand(v)) { extend(v); act('step'); return; }
      if (closed && path.length === n && v === path[0] && adj[endV()].includes(v)) { shut = true; ctx.sfx('snap'); act('close'); return; }
      const k = path.indexOf(v);
      if (k >= 0) {
        const keep = Math.max(k + 1, fixed.length);
        if (v === endV()) {
          if (path.length > Math.max(1, fixed.length)) { path.pop(); act('back'); }
          else if (!fixed.length) { path = []; act('back'); ctx.say('Pick any corner to start from.'); }
          else ctx.say('The given part of the trip stays.', 'warn');
          return;
        }
        if (keep < path.length) { path = path.slice(0, keep); act('back'); ctx.say('Back to step ' + keep + '.'); }
        return;
      }
      if (!closed && v === to) { ctx.say('The flag is the finish: visit every other corner first.', 'warn'); return; }
      ctx.say('No line joins ' + (labels ? labels[endV()] + ' to ' + labels[v] : 'the last corner to that one') + '.', 'warn');
    }

    const vertexAt = (pt) => { let best = -1, bd = wb.px(22); V.forEach((q, i) => { const dd = G.dist(q, pt); if (dd < bd) { bd = dd; best = i; } }); return best; };
    let g = null;
    wb.handlers.board = {
      down(pt) {
        if (busy) return false;
        const v = vertexAt(pt);
        if (v < 0) return false;
        g = { v0: v, p0: pt, moved: false, last: v };
        return true;
      },
      move(pt) {
        if (!g) return;
        if (!g.moved && G.dist(pt, g.p0) < wb.px(7)) return;
        if (!g.moved) {
          g.moved = true;
          if (!path.length && !claimed) { path = [g.v0]; draw(); g.changed = true; }
          if (g.v0 !== endV()) { g.dead = true; return; }
        }
        if (g.dead) return;
        const w = vertexAt(pt);
        if (w < 0 || w === g.last) return;
        g.last = w;
        if (isCand(w)) { extend(w); draw(); g.changed = true; }
        else if (path.length > Math.max(1, fixed.length) && w === path[path.length - 2] && !shut) { path.pop(); draw(); g.changed = true; }
        else if (closed && path.length === n && w === path[0] && adj[endV()].includes(w) && !shut) { shut = true; ctx.sfx('snap'); draw(); g.changed = true; }
      },
      up() {
        const gg = g;
        g = null;
        if (!gg) return;
        if (!gg.moved) { tap(gg.v0); return; }
        if (gg.changed) { news(); ctx.changed('drag'); }
        else if (gg.dead) ctx.say('Drag from the end of your trip (the ringed corner), or click corners one by one.', 'warn');
      }
    };

    if (!p.goal) ctx.setGoal(d.none ? 'Find a round trip — or decide that there is none.' : closed ? 'Visit every corner exactly once along the lines and come back to the start.' : 'Visit every corner exactly once along the lines' + (to >= 0 ? ', finishing at the flag.' : '.'));
    let claimBtn = null;
    if (d.ask || d.none) {
      claimBtn = ctx.button(closed ? 'There is no round trip' : 'There is no such route', () => {
        if (busy || claimed) return;
        if (d.none) { claimed = true; draw(); ctx.say('Right: no such route exists.', 'good'); ctx.changed('claim'); }
        else { wrong++; ctx.say('Not so fast — there is one. Keep looking.', 'warn'); ctx.sfx('wrong'); ctx.changed('claim'); }
      }, 'small');
    }

    const col0 = twoColour(n, adj);
    const nBlack = col0 ? col0.reduce((s, c) => s + c, 0) : 0;
    // the colour count proves a round trip impossible when the two colours do not balance
    const col = col0 && closed && nBlack * 2 !== n ? col0 : null;
    function showColours(ms) {
      if (!col) return;
      V.forEach((q, i) => {
        const el = ctx.s('circle', { cx: q[0], cy: q[1], class: 'g-col c' + col[i] }, flashG);
        if (ms) setTimeout(() => el.remove(), ms);
      });
    }
    function search(pre, limit) {
      return L.hamilton(n, adj, { closed, prefix: pre && pre.length ? pre : undefined, to: to >= 0 ? to : undefined, limit: limit || 150000 });
    }

    draw();
    if (path.length) news();
    return {
      noMoves: true,
      check() {
        if (complete()) {
          const r = { solved: true, msg: d.none ? 'There is no such route.' : closed ? 'A round trip through every corner!' : 'Every corner visited exactly once.' };
          if (wrong) r.stars = Math.max(1, 3 - wrong);
          return r;
        }
        if (d.none) return { solved: false, msg: 'Still looking? Decide whether a route exists at all.' };
        return { solved: false, msg: path.length + ' of ' + n + ' corners visited' + (closed && path.length === n ? ' — now close the trip.' : '.') };
      },
      hint(k) {
        if (d.none) {
          if (col && k === 0) {
            return {
              text: 'Colour the corners in two colours so that every line joins two different colours (it can be done here — see the table). A round trip along the lines alternates colours. Count each colour: ' + (n - nBlack) + ' and ' + nBlack + '.',
              show() { showColours(6000); }
            };
          }
          if (col) return 'A round trip alternates colours, so it uses as many corners of one colour as of the other — and here they are not equal. Press the button.';
          return k === 0 ? 'Try hard from a few different starts: every attempt gets stuck. When every try fails the same way, suspect that no route exists.' : 'The cabinet searched every possible route: there is none. Press the button.';
        }
        if (!path.length) {
          const r = search(fixed, 200000);
          const s = r.sols.length ? r.sols[0][0] : 0;
          return { text: 'Start at the pulsing corner' + (closed ? ' (for a round trip any start will do).' : '.'), show() { pulse([s]); } };
        }
        if (shut) return 'The trip is closed already.';
        const r = search(path, 200000);
        if (r.sols.length) {
          const sol = r.sols[0];
          const nx = path.length < n ? sol[path.length] : sol[0];
          return { text: path.length < n ? 'Go to the pulsing corner next.' : 'Close the trip at the first corner.', show() { pulse([nx]); } };
        }
        if (r.aborted) return 'Hard to tell from here — try going back a few steps.';
        for (let m = path.length - 1; m >= Math.max(1, fixed.length); m--) {
          const r2 = search(path.slice(0, m), 120000);
          if (r2.sols.length) {
            const bad = path[m];
            return { text: 'From here the trip cannot be finished. Go back to step ' + m + ': the step to the red corner was the wrong turn.', show() { pulse([bad], 'bad'); } };
          }
          if (r2.aborted) break;
        }
        return 'This beginning cannot be finished — start again from another corner.';
      },
      solve() {
        if (d.none) { claimed = true; showColours(0); draw(); ctx.changed('solve'); return; }
        let target = null;
        if (path.length && !shut) { const r = search(path, 400000); if (r.sols.length) target = r.sols[0]; }
        if (shut) target = path.slice();
        if (!target) { path = fixed.slice(); shut = false; target = d.cycle.slice(); }
        busy = true;
        const next = () => {
          if (path.length < target.length) { path.push(target[path.length]); draw(); setTimeout(next, C.anim(170)); return; }
          if (closed) shut = true;
          busy = false;
          draw();
          ctx.changed('solve');
        };
        next();
      },
      explain() {
        if (d.none) return col ? 'Colour the corners in two colours so that every line joins different colours. Any route along the lines alternates colours, so a round trip needs exactly as many corners of one colour as of the other. Here the colours do not balance, so no round trip exists.' : 'No round trip exists; the cabinet checked every possibility.';
        return null;
      },
      getState() { return { p: path.slice(), s: shut, c: claimed, w: wrong }; },
      setState(s) {
        if (!s) return;
        path = (s.p || fixed).slice(); shut = !!s.s; claimed = !!s.c; wrong = s.w || 0;
        draw();
      },
      key(ev) {
        if (ev.type === 'keydown' && ev.key === 'Backspace' && !busy && !claimed) {
          if (shut) shut = false;
          else if (path.length > Math.max(1, fixed.length) || (path.length === 1 && !fixed.length)) path.pop();
          else return false;
          act('back');
          return true;
        }
        return false;
      },
      destroy() { busy = true; }
    };

    function pulse(vs, cls) {
      vs.forEach((v) => {
        const el = ctx.s('circle', { cx: V[v][0], cy: V[v][1], class: 'g-pulse' + (cls ? ' ' + cls : '') }, flashG);
        setTimeout(() => el.remove(), 3200);
      });
    }
  }

  /* ---------- untangle: drag the dots until no lines cross ---------- */

  function mountUntangle(ctx, p) {
    const d = p.data, wb = ctx.wb, L = GL();
    const n = d.v.length, E = d.e;
    const board = wb.layer('board'), top = wb.layer('top');
    ctx.s('circle', { cx: 50, cy: 50, r: 53, class: 'g-uring' }, wb.layer('bg'));
    const lineG = ctx.s('g', { class: 'g-ulines' }, board);
    const flashG = ctx.s('g', { class: 'g-flash' }, top);
    const lines = E.map((e, i) => ctx.s('line', { class: 'g-uline', 'data-key': 'e' + i }, lineG));
    wb.type('gnode', {
      draw(g, o) {
        ctx.s('circle', { r: 1, class: 'g-nhit' }, g);
        ctx.s('circle', { r: 1, class: 'g-node' }, g);
      },
      poly() { const r = 1.3; return [[-r, -r], [r, -r], [r, r], [-r, r]]; }
    });
    for (let i = 0; i < n; i++) {
      wb.add({ id: 'v' + i, kind: 'gnode', type: 'gnode', name: 'Dot ' + (i + 1), x: d.v[i][0], y: d.v[i][1], move: true, rotate: 15, pivot: 'bbox', flipable: true, data: { i } });
    }
    wb.setBounds({ x0: -4, y0: -4, x1: 104, y1: 104 }, 0.06);
    ctx.setGoal(p.goal || 'Drag the dots until no two lines cross.');
    let hot = new Set(), busy = false, lastX = -1, anim = 0;

    const pos = () => { const P = []; for (let i = 0; i < n; i++) { const o = wb.get('v' + i); P.push(o ? [o.x, o.y] : d.v[i].slice()); } return P; };
    function drawLines() {
      const P = pos();
      const X = L.crossings(P, E);
      const bad = new Set();
      X.forEach(([a, b]) => { bad.add(a); bad.add(b); });
      const sel = new Set(wb.selected().map((o) => o.data.i));
      lines.forEach((el, i) => {
        const e = E[i];
        el.setAttribute('x1', P[e[0]][0]); el.setAttribute('y1', P[e[0]][1]);
        el.setAttribute('x2', P[e[1]][0]); el.setAttribute('y2', P[e[1]][1]);
        el.setAttribute('class', 'g-uline' + (bad.has(i) ? ' x' : '') + (hot.has(e[0]) || hot.has(e[1]) || sel.has(e[0]) || sel.has(e[1]) ? ' hot' : ''));
      });
      if (X.length !== lastX) { ctx.stat('Crossings', X.length); lastX = X.length; }
      lineG.classList.toggle('clear', X.length === 0);
      return X;
    }
    function coincide(P) {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (G.dist(P[i], P[j]) < 0.35) return true;
      return false;
    }

    wb.handlers.pick = (o, objs) => { hot = new Set(objs.map((q) => q.data.i)); drawLines(); };
    wb.handlers.dragging = () => drawLines();
    wb.handlers.settle = (objs, why) => {
      hot = new Set();
      if (why === 'move' && objs.length === 1) wb.select([]);
    };
    const onChange = () => drawLines();
    wb.on('change', onChange);
    wb.on('restore', onChange);
    wb.on('select', onChange);
    drawLines();

    // one untangled drawing, laid over the dots as they are now (turned, scaled, perhaps mirrored)
    function fitted(fill) {
      const P = pos();
      const f = L.fitSimilarity(d.emb, P, true);
      let Q = d.emb.map((q) => f.apply(q));
      if (fill) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        Q.forEach((q) => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
        const k = 88 / Math.max(x1 - x0, y1 - y0, 1e-6), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        Q = Q.map((q) => [50 + (q[0] - cx) * k, 50 + (q[1] - cy) * k]);
      }
      return Q;
    }

    return {
      noMoves: true,
      check() {
        const X = drawLines();
        if (X.length) return { solved: false, msg: C.plural(X.length, 'crossing') + ' left.' };
        if (coincide(pos())) return { solved: false, msg: 'Two dots sit on top of each other — pull them apart.' };
        return { solved: true, msg: 'Not a single crossing left.' };
      },
      hint(k) {
        const P = pos();
        const X = L.crossings(P, E);
        if (!X.length) return 'No crossings left!';
        if (k === 0) return 'Look for a small ring of dots — a triangle or a square whose lines cross nothing else — and build outwards from it. Dots with only two lines can go almost anywhere, so leave them till last.';
        const count = new Array(n).fill(0);
        X.forEach(([a, b]) => { [E[a][0], E[a][1], E[b][0], E[b][1]].forEach((v) => { count[v]++; }); });
        let worst = 0;
        for (let i = 1; i < n; i++) if (count[i] > count[worst]) worst = i;
        const Q = fitted(false);
        return {
          text: 'The pulsing dot is caught in the most crossings. The dashed ring shows where it sits in one untangled drawing, lined up with yours.',
          show() {
            const a = ctx.s('circle', { cx: P[worst][0], cy: P[worst][1], class: 'g-pulse' }, flashG);
            const b = ctx.s('circle', { cx: Q[worst][0], cy: Q[worst][1], class: 'g-ghost' }, flashG);
            const c = ctx.s('line', { x1: P[worst][0], y1: P[worst][1], x2: Q[worst][0], y2: Q[worst][1], class: 'g-ghostline' }, flashG);
            setTimeout(() => { a.remove(); b.remove(); c.remove(); }, 4500);
          }
        };
      },
      solve() {
        wb.select([]);
        const P = pos(), Q = fitted(true);
        busy = true;
        const t0 = performance.now(), ms = C.anim(1100);
        const my = ++anim;
        const step = (now) => {
          if (my !== anim) return;
          const k = Math.min(1, (now - t0) / (ms || 1)), e = 0.5 - Math.cos(k * Math.PI) / 2;
          for (let i = 0; i < n; i++) {
            const o = wb.get('v' + i);
            if (o) wb.update(o, { x: P[i][0] + (Q[i][0] - P[i][0]) * e, y: P[i][1] + (Q[i][1] - P[i][1]) * e });
          }
          drawLines();
          if (k < 1) root.requestAnimationFrame(step);
          else { busy = false; ctx.changed('solve'); }
        };
        root.requestAnimationFrame(step);
      },
      explain() { return 'This net of ' + n + ' dots and ' + E.length + ' lines is **planar**: it can be drawn without a single crossing. The drawing the cabinet shows is only one of many — any drawing without a crossing counts.'; },
      getState() { return null; },
      setState() { drawLines(); },
      destroy() { anim++; wb.off('change', onChange); wb.off('restore', onChange); wb.off('select', onChange); }
    };
  }

  /* ---------- bridges: walk over each once ---------- */

  function smoothPath(poly) {
    const f = (v) => Math.round(v * 100) / 100;
    const n = poly.length;
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n], m = G.mid(a, b);
      if (i === 0) { const z = G.mid(poly[n - 1], a); s = 'M' + f(z[0]) + ' ' + f(z[1]); }
      s += 'Q' + f(a[0]) + ' ' + f(a[1]) + ' ' + f(m[0]) + ' ' + f(m[1]);
    }
    return s + 'Z';
  }
  const PLANK = 4.6;
  function plank(b, extra) {
    const a = [b[2], b[3]], c = [b[4], b[5]];
    const u = G.norm(G.sub(c, a)), nn = G.perp(u), h = PLANK / 2, ex = extra == null ? 1.6 : extra;
    const a2 = G.sub(a, G.mul(u, ex)), c2 = G.add(c, G.mul(u, ex));
    return { poly: [G.add(a2, G.mul(nn, h)), G.add(c2, G.mul(nn, h)), G.sub(c2, G.mul(nn, h)), G.sub(a2, G.mul(nn, h))], a, c, u, nn, a2, c2 };
  }
  function drawPlank(ctx, parent, b, cls) {
    const pk = plank(b);
    const g = ctx.s('g', { class: 'g-bridge ' + (cls || '') }, parent);
    ctx.s('path', { d: C.pathOf(pk.poly), class: 'g-deck' }, g);
    const L = G.dist(pk.a2, pk.c2);
    let boards = '';
    for (let s = 1.3; s < L - 0.5; s += 1.3) {
      const m = G.add(pk.a2, G.mul(pk.u, s));
      const p1 = G.add(m, G.mul(pk.nn, PLANK / 2 - 0.5)), p2 = G.sub(m, G.mul(pk.nn, PLANK / 2 - 0.5));
      boards += 'M' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + 'L' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2);
    }
    ctx.s('path', { d: boards, class: 'g-boards' }, g);
    const r1a = G.add(pk.a2, G.mul(pk.nn, PLANK / 2 - 0.35)), r1b = G.add(pk.c2, G.mul(pk.nn, PLANK / 2 - 0.35));
    const r2a = G.sub(pk.a2, G.mul(pk.nn, PLANK / 2 - 0.35)), r2b = G.sub(pk.c2, G.mul(pk.nn, PLANK / 2 - 0.35));
    ctx.s('path', { d: 'M' + r1a.join(' ') + 'L' + r1b.join(' ') + 'M' + r2a.join(' ') + 'L' + r2b.join(' '), class: 'g-rails' }, g);
    return { g, pk };
  }
  const WALKER = 'M-5.5 0Q-5.5 -9.5 0 -9.5Q5.5 -9.5 5.5 0Z';

  function mountBridges(ctx, p) {
    const d = p.data, wb = ctx.wb, L = GL();
    const nL = d.lands.length, B = d.br, S = d.sites || [];
    const tour = d.goal === 'tour';
    const E0 = bridgeEdges(d);
    const possible = walkable(nL, E0, tour) != null;
    const W = d.w || 160, H = d.h || 100;
    let start = -1, walk = [], phase = 0, built = [], wrong = 0, busy = false, counts = false, anim = 0;
    const here = () => (walk.length ? L.trailEnd(E0, start, walk) : start);

    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    const clipId = 'gclip-' + p.id.replace(/[^\w-]/g, '');
    const defs = ctx.s('defs', null, bg);
    const cp = ctx.s('clipPath', { id: clipId }, defs);
    ctx.s('rect', { x: 0, y: 0, width: W, height: H, rx: 4 }, cp);
    const map = ctx.s('g', { 'clip-path': 'url(#' + clipId + ')' }, board);
    ctx.s('rect', { x: 0, y: 0, width: W, height: H, class: 'g-water' }, map);
    const rng = C.rng(p.id + ':waves');
    let waves = '';
    for (let i = 0; i < 70; i++) {
      const x = rng() * W, y = rng() * H;
      if (d.lands.some((ld) => G.pointInPoly([x, y], ld.p) || G.pointInPoly([x + 4, y], ld.p))) continue;
      waves += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'q1 -1 2 0t2 0';
    }
    ctx.s('path', { d: waves, class: 'g-waves' }, map);
    const landEls = d.lands.map((ld, i) => ctx.s('path', { d: smoothPath(ld.p), class: 'g-land', 'data-key': 'land' + i }, map));
    ctx.s('rect', { x: 0, y: 0, width: W, height: H, rx: 4, class: 'g-mapframe' }, board);
    const bridgeG = ctx.s('g', { class: 'g-bridges' }, board);
    const bEls = B.map((b, i) => {
      const r = drawPlank(ctx, bridgeG, b, '');
      const m = G.mid(r.pk.a, r.pk.c);
      const lab = ctx.s('g', { class: 'g-blabel', transform: 'translate(' + m[0] + ' ' + m[1] + ')' }, r.g);
      const inner = ctx.s('g', { class: 'g-blabel-in' }, lab);
      ctx.s('circle', { r: 8.5 }, inner);
      const tx = ctx.s('text', { y: 0.5, text: 'abcdefghijklmnopqrstuvwxyz'[i] || String(i + 1) }, inner);
      return { g: r.g, pk: r.pk, tx, letter: 'abcdefghijklmnopqrstuvwxyz'[i] || String(i + 1) };
    });
    const siteEls = S.map((s) => {
      const r = drawPlank(ctx, bridgeG, s, 'site');
      const m = G.mid(r.pk.a, r.pk.c);
      const lab = ctx.s('g', { class: 'g-blabel plus', transform: 'translate(' + m[0] + ' ' + m[1] + ')' }, r.g);
      const inner = ctx.s('g', { class: 'g-blabel-in' }, lab);
      ctx.s('circle', { r: 8.5 }, inner);
      ctx.s('path', { d: 'M-4 0H4M0 -4V4' }, inner);
      return { g: r.g, pk: r.pk };
    });
    const nameG = ctx.s('g', { class: 'g-landnames' }, board);
    const cntEls = d.lands.map((ld) => {
      const gg = ctx.s('g', { transform: 'translate(' + ld.at[0] + ' ' + ld.at[1] + ')' }, nameG);
      const inner = ctx.s('g', { class: 'g-landname-in' }, gg);
      ctx.s('text', { class: 'g-landname', text: ld.n }, inner);
      const cg = ctx.s('g', { class: 'g-count', transform: 'translate(0 17)' }, inner);
      ctx.s('rect', { x: -12, y: -9, width: 24, height: 18, rx: 6 }, cg);
      const ct = ctx.s('text', { y: 0.5 }, cg);
      return { cg, ct };
    });
    const flashG = ctx.s('g', { class: 'g-flash' }, top);
    const walker = ctx.s('g', { class: 'g-walker' }, top);
    ctx.s('ellipse', { cx: 0, cy: 1, rx: 7, ry: 2.4, class: 'g-walker-shadow' }, walker);
    ctx.s('path', { d: WALKER, class: 'g-walker-body' }, walker);
    ctx.s('circle', { cx: 0, cy: -13.5, r: 3.6, class: 'g-walker-head' }, walker);
    wb.setBounds({ x0: -3, y0: -3, x1: W + 3, y1: H + 3 }, 0.05);

    function landSpot(land, viaBridge, atEnd) {
      // where the walker stands: at the foot of the bridge it came over, or by the name
      if (viaBridge != null) {
        const pk = bEls[viaBridge].pk;
        const foot = atEnd ? pk.c : pk.a, away = atEnd ? pk.u : G.mul(pk.u, -1);
        return G.add(foot, G.mul(away, 3.4));
      }
      const at = d.lands[land].at;
      return [at[0], at[1] - 9];
    }
    function placeWalker(pt) {
      if (!pt) { walker.style.display = 'none'; return; }
      walker.style.display = '';
      walker.style.transform = 'translate(' + pt[0] + 'px,' + pt[1] + 'px) scale(calc(1 / var(--k)))';
    }
    function walkerSpot() {
      if (start < 0 || phase === 1) return null;
      if (!walk.length) return landSpot(start);
      const last = walk[walk.length - 1];
      const h = here();
      return landSpot(h, last, B[last][1] === h);
    }
    function degreeNow() {
      const deg = new Array(nL).fill(0);
      B.forEach((b) => { deg[b[0]]++; deg[b[1]]++; });
      if (phase === 1) built.forEach((i) => { deg[S[i][0]]++; deg[S[i][1]]++; });
      return deg;
    }

    function draw() {
      const h = here();
      bEls.forEach((be, i) => {
        const k = walk.indexOf(i);
        const cand = phase === 0 && h >= 0 && k < 0 && (B[i][0] === h || B[i][1] === h);
        be.g.setAttribute('class', 'g-bridge' + (k >= 0 ? ' crossed' : '') + (cand ? ' cand' : ''));
        be.tx.textContent = k >= 0 ? String(k + 1) : be.letter;
        if (k >= 0) be.g.style.setProperty('--h', hueOf(k, B.length)); else be.g.style.removeProperty('--h');
      });
      siteEls.forEach((se, i) => {
        se.g.style.display = phase === 1 ? '' : 'none';
        se.g.setAttribute('class', 'g-bridge site' + (built.includes(i) ? ' built' : ''));
      });
      landEls.forEach((el, i) => el.classList.toggle('here', i === h && phase === 0));
      const deg = degreeNow();
      cntEls.forEach((ce, i) => {
        ce.cg.style.display = counts ? '' : 'none';
        ce.cg.setAttribute('class', 'g-count' + (deg[i] % 2 ? ' odd' : ''));
        ce.ct.textContent = String(deg[i]);
      });
      if (!anim) placeWalker(walkerSpot());
      if (phase === 0) { ctx.stat('New bridges', null); ctx.stat('Bridges crossed', walk.length + ' / ' + B.length); }
      else { ctx.stat('Bridges crossed', null); ctx.stat('New bridges', built.length); }
      claimBtn.hidden = phase === 1;
    }

    function cross(i, then) {
      const h = here();
      const fwd = B[i][0] === h;
      walk.push(i);
      const pk = bEls[i].pk;
      const from = fwd ? pk.a : pk.c, to2 = fwd ? pk.c : pk.a;
      busy = true;
      const my = ++anim;
      const t0 = performance.now(), ms = C.anim(420);
      const p0 = G.sub(from, G.mul(fwd ? pk.u : G.mul(pk.u, -1), 3.4)), p1 = G.add(to2, G.mul(fwd ? pk.u : G.mul(pk.u, -1), 3.4));
      draw();
      ctx.sfx('tap');
      const step = (now) => {
        if (my !== anim) return;
        const k = Math.min(1, (now - t0) / (ms || 1)), e = 0.5 - Math.cos(k * Math.PI) / 2;
        placeWalker(G.lerp(p0, p1, e));
        if (k < 1) root.requestAnimationFrame(step);
        else { anim = 0; busy = false; draw(); if (then) then(); }
      };
      root.requestAnimationFrame(step);
    }

    function news() {
      if (phase === 1) return;
      const h = here();
      if (h < 0) return;
      if (walk.length === B.length) {
        if (tour && h !== start) ctx.say('Every bridge crossed — but the walk must end back where it began.', 'warn');
        return;
      }
      const left = B.filter((b, i) => !walk.includes(i));
      const exits = left.filter((b) => b[0] === h || b[1] === h).length;
      if (!exits) ctx.say('Stranded on ' + d.lands[h].n + ': every bridge from here is crossed, and ' + C.plural(left.length, 'bridge') + ' remain elsewhere.', 'warn');
      else ctx.say('On ' + d.lands[h].n + '. ' + C.plural(B.length - walk.length, 'bridge') + ' still to cross.');
    }

    function tapBridge(i, pt) {
      if (phase === 1) return;
      if (walk.includes(i)) { ctx.say('Bridge ' + bEls[i].letter + ' is crossed already — every bridge only once.', 'warn'); return; }
      if (start < 0 || !walk.length && B[i][0] !== start && B[i][1] !== start) {
        start = G.dist(pt, bEls[i].pk.a) <= G.dist(pt, bEls[i].pk.c) ? B[i][0] : B[i][1];
      }
      const h = here();
      if (B[i][0] !== h && B[i][1] !== h) { ctx.say('You are on ' + d.lands[h].n + ', and that bridge does not start there.', 'warn'); return; }
      cross(i, () => { news(); ctx.changed('cross'); });
    }
    function tapLand(l) {
      if (phase === 1) return;
      if (!walk.length) {
        start = l;
        draw();
        ctx.say('You start on ' + d.lands[l].n + '. Click a bridge to cross it.');
        ctx.changed('start');
        return;
      }
      if (l !== here()) ctx.say('No swimming: the only way to ' + d.lands[l].n + ' is over a bridge.', 'warn');
    }
    function tapSite(i) {
      const k = built.indexOf(i);
      if (k >= 0) built.splice(k, 1); else built.push(i);
      built.sort((a, b) => a - b);
      ctx.sfx(k >= 0 ? 'tap' : 'snap');
      draw();
      ctx.changed('build');
    }

    const onPlank = (pk, pt) => G.pointInPoly(pt, pk.poly) || G.segDist(pt, pk.a2, pk.c2) < PLANK / 2 + wb.px(5);
    let downAt = null;
    wb.handlers.board = {
      down(pt) {
        if (busy) return false;
        downAt = null;
        if (phase === 1) { const i = siteEls.findIndex((se) => onPlank(se.pk, pt)); if (i >= 0) { downAt = { kind: 's', i, pt }; return true; } return false; }
        const bi = bEls.findIndex((be) => onPlank(be.pk, pt));
        if (bi >= 0) { downAt = { kind: 'b', i: bi, pt }; return true; }
        const li = d.lands.findIndex((ld) => G.pointInPoly(pt, ld.p));
        if (li >= 0) { downAt = { kind: 'l', i: li, pt }; return true; }
        return false;
      },
      move() {},
      up(pt) {
        const a = downAt;
        downAt = null;
        if (!a || G.dist(pt, a.pt) > wb.px(12)) return;
        if (a.kind === 'b') tapBridge(a.i, a.pt);
        else if (a.kind === 'l') tapLand(a.i);
        else tapSite(a.i);
      }
    };

    if (!p.goal) ctx.setGoal(tour ? 'Walk over every bridge exactly once and come home to where you started — or show that it cannot be done.' : 'Walk over every bridge exactly once — or show that it cannot be done.');
    const claimBtn = ctx.button('It can\'t be done', () => {
      if (busy || phase === 1) return;
      if (!possible) {
        phase = 1; walk = []; start = -1; counts = true;
        draw();
        ctx.say('Right — Euler\'s argument settles it. Now build the **fewest** new bridges (click the dashed sites) so that ' + (tour ? 'a round walk' : 'such a walk') + ' becomes possible.', 'good');
        ctx.setGoal('Build the fewest new bridges that make ' + (tour ? 'a round walk over every bridge' : 'a walk over every bridge') + ' possible.');
        ctx.changed('claim');
      } else {
        wrong++;
        ctx.sfx('wrong');
        ctx.say('It can be done! Keep walking (Undo takes you back a bridge).', 'warn');
        ctx.changed('claim');
      }
    }, 'small');
    const cntBtn = ctx.button('Count the bridges', () => { counts = !counts; cntBtn.classList.toggle('on', counts); draw(); }, 'small.ghost');

    function pulseLand(ls, cls) {
      ls.forEach((l) => {
        const el = ctx.s('path', { d: smoothPath(d.lands[l].p), class: 'g-landpulse' + (cls ? ' ' + cls : ''), 'clip-path': 'url(#' + clipId + ')' }, flashG);
        setTimeout(() => el.remove(), 3200);
      });
    }
    function flashBridge(i, site) {
      const pk = (site ? siteEls : bEls)[i].pk;
      const el = ctx.s('path', { d: C.pathOf(pk.poly), class: 'g-bflash' }, flashG);
      setTimeout(() => el.remove(), 3000);
    }
    const oddLands = () => { const deg = degreeNow(); return deg.map((x, i) => (x % 2 ? i : -1)).filter((i) => i >= 0); };

    draw();
    return {
      noMoves: true,
      check() {
        if (phase === 0) {
          if (possible && walk.length === B.length && (!tour || here() === start)) {
            const r = { solved: true, msg: 'Every bridge crossed exactly once' + (tour ? ', and home again.' : '.') };
            if (wrong) r.stars = Math.max(1, 3 - wrong);
            return r;
          }
          if (walk.length === B.length && tour) return { solved: false, msg: 'Every bridge crossed, but you are not back where you started.' };
          return { solved: false, msg: walk.length + ' of ' + B.length + ' bridges crossed.' };
        }
        const ok = walkable(nL, bridgeEdges(d, built), tour) != null;
        if (ok && built.length === d.build) { const r = { solved: true, msg: C.plural(built.length, 'new bridge') + ' — and now the walk is possible.' }; if (wrong) r.stars = Math.max(1, 3 - wrong); return r; }
        if (ok) return { solved: false, msg: 'A walk is possible now — but fewer new bridges would do.' };
        return { solved: false, msg: 'Not yet: count the bridges at each piece of land.' };
      },
      hint(k) {
        if (phase === 1) {
          const od = oddLands();
          const mb = minBuild(d);
          const want = mb.sets.find((s) => built.every((b) => s.includes(b)));
          if (k === 0 || !want) return { text: 'A new bridge adds one to the count at both its ends, so it can make two odd pieces of land even. ' + (tour ? 'A round walk needs every count even.' : 'A walk may keep two odd pieces of land — its two ends — but no more.'), show() { counts = true; draw(); pulseLand(od); } };
          const nx = want.find((s) => !built.includes(s));
          if (nx == null) return 'That is the fewest already — check it!';
          return { text: 'Build at the flashing site.', show() { flashBridge(nx, true); } };
        }
        if (!counts && k === 0) return { text: 'Count the bridges touching each piece of land (the numbers are on the map now). What happens to the count each time you walk onto a piece of land and off again?', show() { counts = true; cntBtn.classList.add('on'); draw(); } };
        const od = oddLands();
        if (!possible) return { text: 'Walking onto land and off again uses two of its bridges. So a piece of land with an **odd** number of bridges must be where the walk starts or ends. Here ' + numWord(od.length) + ' pieces are odd' + (tour ? ' — and a round walk has no ends at all.' : ' — but a walk has only two ends.'), show() { counts = true; draw(); pulseLand(od, 'bad'); } };
        const h = here();
        if (h < 0 || (!walk.length && od.length && !od.includes(h))) {
          const s = od.length ? od[0] : d.walk[0];
          return { text: 'Start on the pulsing land' + (od.length ? ' — it has an odd number of bridges, so it must be an end of the walk.' : '.'), show() { pulseLand([s]); } };
        }
        const used = new Array(B.length).fill(false);
        walk.forEach((i) => { used[i] = true; });
        const rest = L.eulerFrom(nL, E0, used, h);
        if (rest && (!tour || !rest.length || L.trailEnd(E0, h, rest) === start)) {
          if (!rest.length) return 'All crossed!';
          return { text: 'Cross the flashing bridge next.', show() { flashBridge(rest[0]); } };
        }
        return 'From here the walk cannot be finished. Undo a bridge or two (Ctrl+Z) — never cross a bridge that cuts you off from bridges you still need.';
      },
      solve() {
        if (!possible) {
          phase = 1; walk = []; start = -1; counts = true;
          built = minBuild(d).sets[0].slice();
          draw();
          ctx.setGoal('Build the fewest new bridges that make ' + (tour ? 'a round walk over every bridge' : 'a walk over every bridge') + ' possible.');
          ctx.changed('solve');
          return;
        }
        phase = 0; walk = []; start = d.walk[0];
        draw();
        const steps = d.walk.slice(1);
        let k = 0;
        const next = () => {
          if (k >= steps.length) { ctx.changed('solve'); return; }
          cross(steps[k++], () => setTimeout(next, C.anim(60)));
        };
        next();
      },
      explain() {
        const deg = new Array(nL).fill(0);
        B.forEach((b) => { deg[b[0]]++; deg[b[1]]++; });
        const list = d.lands.map((ld, i) => ld.n + ' ' + deg[i]).join(', ');
        const od = deg.filter((x) => x % 2).length;
        let s = 'Bridges touching each piece of land: ' + list + '. Every time the walk passes over a piece of land it uses two of its bridges, one to arrive and one to leave; only the start and the finish can use an odd number. ';
        if (possible) s += tour ? 'Here every count is even, so a round walk exists.' : (od ? 'Here exactly two counts are odd, so the walk must start on one of those and finish on the other.' : 'Here every count is even, so the walk can start anywhere — and will end where it began.');
        else s += 'Here ' + numWord(od) + ' counts are odd, so no such walk exists. Each new bridge changes two counts, so at least ' + C.plural(d.build, 'new bridge') + (d.build === 1 ? ' is' : ' are') + ' needed.';
        return s;
      },
      getState() { return { s: start, w: walk.slice(), ph: phase, b: built.slice(), x: wrong, c: counts }; },
      setState(s) {
        if (!s) return;
        anim = 0; busy = false;
        start = s.s == null ? -1 : s.s; walk = (s.w || []).slice(); phase = s.ph || 0; built = (s.b || []).slice(); wrong = s.x || 0; counts = !!s.c;
        if (phase === 1) ctx.setGoal('Build the fewest new bridges that make ' + (tour ? 'a round walk over every bridge' : 'a walk over every bridge') + ' possible.');
        else if (!p.goal) ctx.setGoal(tour ? 'Walk over every bridge exactly once and come home to where you started — or show that it cannot be done.' : 'Walk over every bridge exactly once — or show that it cannot be done.');
        cntBtn.classList.toggle('on', counts);
        draw();
      },
      destroy() { anim++; busy = true; }
    };
  }

  /* ---------- small pictures for the drawer ---------- */

  function svgEdges(V, E, attrs) {
    return E.map((e) => '<path d="' + edgeGeo(V, e).d + '" ' + attrs + '/>').join('');
  }
  function thumbGraph(V, E, opt) {
    opt = opt || {};
    const box = bboxOf(V, E.map((e) => edgeGeo(V, e)));
    const pad = Math.max(box.w, box.h) * 0.1 + 3;
    let s = '<svg viewBox="' + (box.x0 - pad) + ' ' + (box.y0 - pad) + ' ' + (box.w + 2 * pad) + ' ' + (box.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
    s += '<g fill="none" stroke="' + (opt.stroke || 'var(--ink-2)') + '" stroke-width="' + (opt.sw || 2.4) + '" stroke-linecap="round" stroke-linejoin="round">' + svgEdges(V, E, '') + '</g>';
    const r = opt.r == null ? 2.6 : opt.r;
    if (r) s += '<g fill="' + (opt.dot || 'var(--ink)') + '"' + (opt.ring ? ' stroke="var(--ink-2)" stroke-width="1"' : '') + '>' + V.map((q) => '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '"/>').join('') + '</g>';
    return s + '</svg>';
  }
  function thumbBridges(d) {
    const W = d.w || 160, H = d.h || 100;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="gtc"><rect width="' + W + '" height="' + H + '" rx="5"/></clipPath></defs><g clip-path="url(#gtc)">';
    s += '<rect width="' + W + '" height="' + H + '" fill="var(--g-water, #2a5d86)"/>';
    d.lands.forEach((ld) => { s += '<path d="' + smoothPath(ld.p) + '" fill="var(--g-land, #3f6b4a)" stroke="var(--g-land-edge, #7fb58a)" stroke-width="1.2"/>'; });
    d.br.forEach((b) => { const pk = plank(b); s += '<path d="' + C.pathOf(pk.poly) + '" fill="var(--wood)" stroke="var(--wood-dark)" stroke-width=".8"/>'; });
    return s + '</g></svg>';
  }

  C.engine({
    id: 'graphs',
    name: 'Dots and lines',
    deps: ['js/lib/graphlib.js', 'js/lib/graphgen.js'],
    noMoves: true,
    generates: ['one-stroke', 'untangle', 'icosian'],

    // endless drawers: a fresh figure, tangle or map of towns of the asked level
    generate(rng, level, meta) {
      const GG = C.GraphGen;
      if (!GG) return null;
      const id = meta && meta.id;
      let p = null;
      if (id === 'one-stroke') p = GG.makeStroke(rng, level);
      else if (id === 'untangle') p = GG.makeUntangle(rng, level);
      else if (id === 'icosian') p = GG.makeRoundTrip(rng, level);
      if (!p) return null;
      if (p.explain === undefined) delete p.explain;
      return p;
    },
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    about: '**One stroke:** press on a corner and drag along the lines — each line lights up as you pass it. Or click corners (or lines) one after another. No line twice, no jumping. **Backspace** or Undo takes back the last line.\n\n' +
      '**Bridges:** click a piece of land to start there, then click bridges to walk over them. If you are sure it cannot be done, press *It can\'t be done* — then build the fewest new bridges at the dashed sites.\n\n' +
      '**Round trips:** click the corners in order along the lines (or drag through them). Click the last corner to step back, an earlier one to go back to it, and the first corner to close the trip.\n\n' +
      '**Untangle:** drag the dots. Lines that cross are red; the count is under the table. Drag on the table to select several dots and move them together (turn a group with R).',

    verify(p) {
      const d = p.data || {};
      let err = null;
      try {
        if (d.kind === 'stroke') err = verifyStroke(d.v, d.e, d.start, d.trail, d.closed);
        else if (d.kind === 'strokeq') {
          if (!d.figs || !d.figs.length) err = 'no figures';
          else {
            const can = [];
            d.figs.forEach((f, i) => {
              const bad = checkEdges(f.v, f.e);
              if (bad && !err) err = 'figure ' + i + ': ' + bad;
              if (drawableFig(f)) {
                can.push(i);
                if (f.trail) { const e2 = verifyStroke(f.v, f.e, f.start, f.trail); if (e2 && !err) err = 'figure ' + i + ': ' + e2; }
              }
            });
            const want = (d.answer || []).slice().sort((a, b) => a - b);
            if (!err && can.join() !== want.join()) err = 'the answer should be [' + can.join(',') + ']';
          }
        } else if (d.kind === 'bridges') err = verifyBridges(d);
        else if (d.kind === 'hamilton') err = verifyHamilton(d);
        else if (d.kind === 'untangle') err = verifyUntangle(d);
        else err = 'unknown kind ' + d.kind;
      } catch (e) { err = 'threw ' + e.message; }
      return err ? { ok: false, err } : { ok: true };
    },

    answerKey(p) {
      const d = p.data;
      if (d.kind !== 'strokeq') return null;
      if (d.figs.length === 1) return d.answer.length ? 0 : 1;
      return d.answer.length ? d.answer.slice().sort((a, b) => a - b) : [d.figs.length];
    },

    mount(ctx, p) {
      const k = p.data.kind;
      if (k === 'stroke') return mountStroke(ctx, p);
      if (k === 'strokeq') return mountStrokeQ(ctx, p);
      if (k === 'hamilton') return mountHamilton(ctx, p);
      if (k === 'untangle') return mountUntangle(ctx, p);
      if (k === 'bridges') return mountBridges(ctx, p);
      ctx.say('Unknown puzzle kind: ' + k, 'warn');
      return {};
    },

    thumb(p) {
      const d = p.data;
      if (d.kind === 'stroke') return thumbGraph(d.v, d.e, { sw: 2.6, r: 2.2 });
      if (d.kind === 'strokeq') {
        const lay = figLayout(d.figs);
        const W = lay.cols * 135 - 15, H = lay.rows * 140 - 20;
        let s = '<svg viewBox="-12 -12 ' + (W + 24) + ' ' + (H + 24) + '" preserveAspectRatio="xMidYMid meet">';
        d.figs.forEach((f, i) => {
          const c = lay.cells[i];
          const V = f.v.map((q) => [q[0] + c.dx, q[1] + c.dy]);
          s += '<g fill="none" stroke="var(--ink-2)" stroke-width="3.4" stroke-linecap="round">' + svgEdges(V, shiftEdges(f.e, c.dx, c.dy), '') + '</g>';
        });
        return s + '</svg>';
      }
      if (d.kind === 'hamilton') return thumbGraph(d.v, d.e, { sw: 1.8, r: 3.4, dot: 'var(--panel-2)', ring: true });
      if (d.kind === 'untangle') return thumbGraph(d.v, d.e, { sw: 0.9, r: 2, dot: 'var(--accent)', stroke: 'var(--ink-2)' });
      if (d.kind === 'bridges') return thumbBridges(d);
      return '';
    }
  });

  C.graphsKit = { edgeGeo, bboxOf, minBuild, walkable, bridgeEdges, drawableFig, verifyStroke, smoothPath, plank };

  C.css('graphs', `
    :root { --g-land: #3d6448; --g-land-edge: #86bb90; --g-water: #1f4b70; --g-wave: rgba(190, 230, 255, .28); }
    [data-theme="light"] { --g-land: #cfe1b9; --g-land-edge: #7d9d66; --g-water: #a4d3f0; --g-wave: rgba(255, 255, 255, .7); }
    .g-slate { fill: var(--board); stroke: var(--line); stroke-width: calc(1px / var(--k)); }
    .g-edge { fill: none; stroke: var(--ink-2); opacity: .3; stroke-width: calc(8px / var(--k)); stroke-linecap: round; stroke-linejoin: round; transition: opacity .2s; }
    .g-edge.used { opacity: .1; }
    .g-trace { fill: none; stroke: hsl(var(--h, 190) 88% 62%); stroke-width: calc(5px / var(--k)); stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 3px hsl(var(--h, 190) 90% 55% / .7)); pointer-events: none; }
    [data-theme="light"] .g-trace { stroke: hsl(var(--h, 190) 80% 40%); filter: none; }
    .g-v { r: calc(5px / var(--k)); fill: var(--ink-2); stroke: var(--board); stroke-width: calc(2px / var(--k)); transition: fill .2s; }
    .g-v.start { fill: var(--teal); }
    .g-v.end { fill: var(--gold); }
    .g-v.stuck { fill: var(--red); }
    .g-v.oddmark { stroke: var(--red); stroke-width: calc(3px / var(--k)); r: calc(8px / var(--k)); fill: var(--board); }
    .g-vlabel { font: 700 calc(13px / var(--k)) "Segoe UI", system-ui, sans-serif; fill: var(--muted); text-anchor: middle; pointer-events: none; }
    .g-figletter { font: 800 14px "Segoe UI", system-ui, sans-serif; fill: var(--muted); text-anchor: middle; }
    .g-penring { r: calc(13px / var(--k)); fill: none; stroke: var(--gold); stroke-width: calc(2px / var(--k)); opacity: .8; pointer-events: none; transform-box: fill-box; transform-origin: center; animation: gring 1.6s ease-in-out infinite; }
    .g-penring.stuck { stroke: var(--red); }
    @keyframes gring { 50% { transform: scale(1.25); opacity: .35; } }
    .g-pen { pointer-events: none; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); }
    .g-pen-nib { fill: #e8c46a; stroke: #7a5a12; stroke-width: 1; }
    .g-pen-slit { stroke: #5a3f08; stroke-width: 1.1; }
    .g-pen-hole { fill: #5a3f08; }
    .g-pen-collar { fill: #c9cfdd; stroke: #555; stroke-width: .8; }
    .g-pen-body { fill: var(--accent); stroke: rgba(0,0,0,.4); stroke-width: 1; }
    .g-wire { fill: none; stroke: var(--gold); stroke-width: calc(2px / var(--k)); stroke-dasharray: calc(5px / var(--k)) calc(5px / var(--k)); opacity: .7; pointer-events: none; }
    .g-hl { fill: none; stroke: var(--gold); stroke-width: calc(12px / var(--k)); stroke-linecap: round; opacity: .55; pointer-events: none; animation: gblink .7s ease-in-out infinite alternate; }
    .g-hl.bad { stroke: var(--red); }
    .g-hl.good { stroke: var(--green); }
    @keyframes gblink { to { opacity: .12; } }
    .g-pulse { r: calc(15px / var(--k)); fill: none; stroke: var(--gold); stroke-width: calc(3px / var(--k)); pointer-events: none; transform-box: fill-box; transform-origin: center; animation: gpulse 1s ease-out infinite; }
    .g-pulse.bad { stroke: var(--red); }
    @keyframes gpulse { from { transform: scale(.5); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }
    .g-deg-in, .g-num-in, .g-hv-in, .g-blabel-in, .g-landname-in { transform: scale(calc(1 / var(--k))); }
    .g-deg rect { fill: var(--panel-2); stroke: var(--line); }
    .g-deg text, .g-num text, .g-blabel text, .g-count text { font: 700 11px "Segoe UI", system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; fill: var(--text); }
    .g-deg.odd rect { fill: var(--red); stroke: none; }
    .g-deg.odd text { fill: #fff; }
    .g-num { pointer-events: none; }
    .g-num circle { fill: var(--panel); stroke: var(--line); }
    .g-num text { font-size: 10px; }
    /* round trips */
    .g-hedge { fill: none; stroke: var(--ink-2); opacity: .5; stroke-width: calc(3px / var(--k)); stroke-linecap: round; }
    .g-hseg { fill: none; stroke: hsl(var(--h, 200) 85% 60%); stroke-width: calc(7px / var(--k)); stroke-linecap: round; pointer-events: none; }
    .g-hseg.given { stroke-dasharray: calc(2px / var(--k)) calc(9px / var(--k)); stroke-width: calc(6px / var(--k)); }
    [data-theme="light"] .g-hseg { stroke: hsl(var(--h, 200) 75% 45%); }
    .g-hv { cursor: pointer; }
    .g-hv-hit { fill: transparent; }
    .g-hv-dot { fill: var(--panel-2); stroke: var(--ink-2); stroke-width: 2; transition: fill .15s, stroke .15s; }
    .g-hv.on .g-hv-dot { fill: hsl(var(--h, 200) 60% 40%); stroke: hsl(var(--h, 200) 85% 65%); }
    [data-theme="light"] .g-hv.on .g-hv-dot { fill: hsl(var(--h, 200) 75% 88%); stroke: hsl(var(--h, 200) 70% 40%); }
    .g-hv.end .g-hv-dot { stroke: var(--gold); stroke-width: 3.5; }
    .g-hv.cand .g-hv-dot { stroke: var(--gold); stroke-dasharray: 3 3; }
    .g-hv.cand:hover .g-hv-dot { fill: var(--gold); stroke-dasharray: none; }
    .g-hv.shut .g-hv-dot { stroke: var(--green); }
    .g-hv-t { font: 700 11px "Segoe UI", system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; fill: var(--text); pointer-events: none; }
    .g-hverts:not(.lettered) .g-hv-t { font-size: 9px; }
    .g-hv-n { font: 700 9px "Segoe UI", system-ui, sans-serif; text-anchor: middle; fill: var(--muted); pointer-events: none; }
    .g-flag { stroke: var(--ink); stroke-width: 1.4; fill: var(--green); pointer-events: none; }
    .g-flag.finish { fill: var(--red); }
    .g-col { r: calc(13px / var(--k)); pointer-events: none; opacity: .55; }
    .g-col.c0 { fill: var(--ink); }
    .g-col.c1 { fill: var(--gold); }
    /* untangle */
    .g-uring { fill: var(--board); stroke: var(--line); stroke-width: calc(1px / var(--k)); }
    .g-uline { stroke: var(--ink-2); stroke-width: calc(2.2px / var(--k)); stroke-linecap: round; transition: stroke .15s; }
    .g-uline.x { stroke: var(--red); }
    .g-uline.hot { stroke: var(--accent); stroke-width: calc(3.2px / var(--k)); }
    .g-uline.x.hot { stroke: #ff9a9a; }
    .g-ulines.clear .g-uline { stroke: var(--green); }
    .k-gnode .g-node { r: calc(7px / var(--k)); fill: var(--fill, var(--accent)); stroke: var(--board); stroke-width: calc(2px / var(--k)); }
    .k-gnode .g-nhit { r: calc(15px / var(--k)); fill: transparent; }
    .wb-obj.k-gnode.sel { filter: none; }
    .wb-obj.k-gnode.sel .g-node { stroke: var(--gold); stroke-width: calc(3px / var(--k)); }
    .wb-obj.k-gnode.drag { filter: drop-shadow(0 3px 3px rgba(0,0,0,.4)); }
    .g-ghost { r: calc(12px / var(--k)); fill: none; stroke: var(--gold); stroke-width: calc(2.5px / var(--k)); stroke-dasharray: calc(4px / var(--k)) calc(3px / var(--k)); pointer-events: none; }
    .g-ghostline { stroke: var(--gold); stroke-width: calc(1.5px / var(--k)); stroke-dasharray: calc(4px / var(--k)) calc(4px / var(--k)); pointer-events: none; }
    /* bridges */
    .g-water { fill: var(--g-water); }
    .g-waves { fill: none; stroke: var(--g-wave); stroke-width: .45; stroke-linecap: round; }
    .g-land { fill: var(--g-land); stroke: var(--g-land-edge); stroke-width: calc(2px / var(--k)); transition: filter .2s; }
    .g-land.here { filter: brightness(1.12); }
    .g-mapframe { fill: none; stroke: var(--line); stroke-width: calc(1.5px / var(--k)); }
    .g-bridge { cursor: pointer; }
    .g-deck { fill: var(--wood); stroke: var(--wood-dark); stroke-width: calc(1.2px / var(--k)); stroke-linejoin: round; transition: fill .2s; }
    .g-boards { stroke: var(--wood-dark); stroke-width: calc(.8px / var(--k)); opacity: .45; }
    .g-rails { stroke: #5b3a17; stroke-width: calc(1.8px / var(--k)); stroke-linecap: round; }
    .g-bridge.cand .g-deck { stroke: var(--gold); stroke-width: calc(2.5px / var(--k)); }
    .g-bridge.cand:hover .g-deck { fill: #f0c080; }
    .g-bridge.crossed { cursor: default; }
    .g-bridge.crossed .g-deck { fill: hsl(var(--h, 190) 70% 55%); stroke: hsl(var(--h, 190) 80% 30%); }
    .g-bridge.site .g-deck { fill: rgba(255,255,255,.08); stroke: var(--gold); stroke-dasharray: calc(4px / var(--k)) calc(3px / var(--k)); }
    .g-bridge.site .g-boards, .g-bridge.site .g-rails { display: none; }
    .g-bridge.site.built .g-deck { fill: #f3d3a0; stroke: var(--wood-dark); stroke-dasharray: none; }
    .g-bridge.site.built .g-boards, .g-bridge.site.built .g-rails { display: inline; }
    .g-bridge.site.built .g-blabel { display: none; }
    .g-blabel circle { fill: var(--panel); stroke: var(--wood-dark); stroke-width: 1.2; }
    .g-blabel.plus path { stroke: var(--gold); stroke-width: 2; stroke-linecap: round; }
    .g-bridge.crossed .g-blabel circle { fill: hsl(var(--h, 190) 80% 25%); stroke: #fff; }
    .g-bridge.crossed .g-blabel text { fill: #fff; }
    .g-landnames { pointer-events: none; }
    .g-landname { font: 700 13px "Segoe UI", system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; fill: var(--text); paint-order: stroke; stroke: var(--g-land); stroke-width: 4px; stroke-linejoin: round; }
    .g-count rect { fill: var(--panel-2); stroke: var(--line); }
    .g-count.odd rect { fill: var(--red); stroke: none; }
    .g-count.odd text { fill: #fff; }
    .g-walker { pointer-events: none; filter: drop-shadow(0 2px 2px rgba(0,0,0,.4)); }
    .g-walker-body { fill: var(--accent); stroke: rgba(0,0,0,.45); stroke-width: 1; }
    .g-walker-head { fill: #ffd9b8; stroke: rgba(0,0,0,.45); stroke-width: 1; }
    .g-walker-shadow { fill: rgba(0,0,0,.3); }
    .g-landpulse { fill: var(--gold); opacity: .0; pointer-events: none; animation: glp 1s ease-in-out infinite alternate; }
    .g-landpulse.bad { fill: var(--red); }
    @keyframes glp { to { opacity: .45; } }
    .g-bflash { fill: none; stroke: var(--gold); stroke-width: calc(4px / var(--k)); pointer-events: none; animation: gblink .6s ease-in-out infinite alternate; }
    .btn.small.on { background: var(--accent); color: #fff; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
