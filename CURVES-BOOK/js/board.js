/* Curves Workshop · js/board.js
 *
 * The practice board: the learner redraws a figure's construction with virtual classical
 * tools. The given steps are shown; each construction step names its tool and what to
 * draw; every element drawn is checked against the step's targets (from Curves.targets).
 *
 *   Curves.Board.open(container, scene) -> board (call board.destroy() when leaving)
 */
(function (root) {
  'use strict';
  const C = root.Curves = root.Curves || {};
  const g = C.g;
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const f2 = n => (Math.round(n * 100) / 100).toString();
  const TARGET_TOOLS = ['straightedge', 'compass', 'dividers', 'ruler', 'square', 'protractor', 'pencil', 'fold'];
  const TOOL_ORDER = ['point', 'straightedge', 'compass', 'dividers', 'square', 'pencil'];
  const TOOL_NAME = { point: 'Point', straightedge: 'Straightedge', compass: 'Compass', dividers: 'Dividers', square: 'Set square', pencil: 'Pencil' };
  const TOOL_HELP = {
    point: 'Click to mark a point (it snaps to intersections and to the curves).',
    straightedge: 'Click two points: the line through them.',
    compass: 'Click the centre, then the point that fixes the radius.',
    dividers: 'Click two points to take their distance, then click a centre to swing a circle of that radius. Esc resets the opening.',
    square: 'Click a line, then a point: the perpendicular through the point. Hold Shift for the parallel.',
    pencil: 'Drag along the curve through the points you have found.'
  };
  const STEP_TOOL = { straightedge: 'straightedge', compass: 'compass', dividers: 'dividers', ruler: 'straightedge', square: 'square', protractor: 'straightedge', pencil: 'pencil', fold: 'straightedge' };

  function open(container, scene) {
    const B = scene.bounds, S = B.S;
    const X = x => x - B.x0, Y = y => B.y1 - y;           // to SVG
    const toMath = (sx, sy) => ({ x: sx + B.x0, y: B.y1 - sy });
    const tol = S * 0.016, snapTol = S * 0.022, curveTol = S * 0.03;
    const targets = C.targets(scene);
    const stepsWithTargets = Array.from(new Set(targets.map(t => t.step)));
    const fig = scene.fig;
    const state = { tool: 'straightedge', pending: [], opening: null, elements: [], matched: new Set(), step: 0, hints: 0, shows: 0, t0: Date.now(), done: false, pencil: null };
    const key = 'practice:' + fig.id;

    container.innerHTML =
      '<div class="board-wrap"><div>' +
      '<div class="palette" id="palette">' + TOOL_ORDER.map(t => '<button data-tool="' + t + '" title="' + esc(TOOL_HELP[t]) + '">' + (C.ICON ? '<span class="toolicon">' + C.ICON[t === 'point' ? 'given' : t] + '</span>' : '') + esc(TOOL_NAME[t]) + '</button>').join('') +
      '<span class="spacer" style="flex:1"></span><button id="bundo" title="Undo (Ctrl+Z)">Undo</button><button id="bclear">Clear</button></div>' +
      '<div class="board" id="boardbox">' + C.svg(scene, { noSize: true }) + '</div>' +
      '<p class="status" id="bstatus"></p>' +
      '</div><aside>' +
      '<div class="instr"><div class="muted small">Step <span id="bstepno"></span> of ' + scene.steps.length + '</div><div class="now" id="bnow"></div><div class="progress"><i id="bprog"></i></div>' +
      '<div class="actions"><button id="bhint">Hint</button><button id="bshow">Show</button><button id="brestart">Restart</button></div>' +
      '<div class="hintbox" id="bhelp"></div></div>' +
      '<div class="instr" style="margin-top:12px"><h3 style="margin:0 0 6px">Steps</h3><ol class="steps small" id="bsteps">' + scene.steps.map(st => '<li data-i="' + st.i + '"><span class="tool ' + st.tool + '">' + (C.icon ? C.icon(st.tool) : '') + esc(C.TOOLS[st.tool].name) + '</span>' + esc(st.text) + '</li>').join('') + '</ol></div>' +
      '<div id="bdone"></div></aside></div>';

    const svg = container.querySelector('#boardbox svg');
    svg.setAttribute('class', 'cw board-svg');
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
    const gGhost = mk('g', { id: 'ghost' }), gUser = mk('g', { id: 'user' }), gPrev = mk('g', { id: 'preview' });
    svg.appendChild(gGhost); svg.appendChild(gUser); svg.appendChild(gPrev);
    const stepGroups = Array.from(svg.querySelectorAll('g.step'));
    const lw = S * 0.0036, rPt = S * 0.0065;

    /* ---- which steps are shown */
    function revealed(i) { return stepGroups[i] && stepGroups[i].style.display !== 'none'; }
    function reveal(i) { const gg = stepGroups[i]; if (gg) gg.style.display = ''; }
    stepGroups.forEach(gg => gg.style.display = 'none');
    const isTargetStep = i => stepsWithTargets.includes(i);

    function advance() {
      // reveal every non-target step at the current position, stop at a target step or the end
      while (state.step < scene.steps.length && !isTargetStep(state.step)) { reveal(state.step); state.step++; }
      if (state.step >= scene.steps.length) finish();
      updateUI();
    }
    function finish() {
      if (state.done) return;
      state.done = true;
      const secs = Math.round((Date.now() - state.t0) / 1000);
      const best = C.store ? C.store.get(key, null) : null;
      const rec = { done: true, elements: state.elements.length, hints: state.hints, shows: state.shows, secs, when: new Date().toISOString().slice(0, 10) };
      if (C.store && (!best || rec.shows < best.shows || (rec.shows === best.shows && rec.secs < best.secs))) C.store.set(key, rec);
      container.querySelector('#bdone').innerHTML = '<div class="done"><b>Construction complete.</b> ' + state.elements.length + ' elements drawn, ' + state.hints + ' hints, ' + state.shows + ' shown, ' + secs + ' s.' +
        (best ? ' Best so far: ' + best.shows + ' shown, ' + best.secs + ' s.' : '') + '<div class="actions" style="margin-top:8px"><a class="btn primary" href="#/f/' + fig.id + '">See the worked figure</a><button id="bagain">Draw it again</button></div></div>';
      container.querySelector('#bagain').onclick = restart;
    }

    /* ---- candidates for snapping: given points, user points, intersections, points on given curves */
    let cands = null;
    function lineElems() {
      const L = [];
      state.elements.forEach(e => { if (e.t === 'line') L.push({ a: e.a, b: e.b }); });
      scene.shapes.forEach(s => { if (!revealed(s.step)) return; if (s.t === 'seg' || s.t === 'line' || s.t === 'ray' || s.t === 'bar') L.push({ a: s.a, b: s.b, seg: s.t === 'seg' || s.t === 'bar' }); });
      return L;
    }
    function circleElems() {
      const L = [];
      state.elements.forEach(e => { if (e.t === 'circle') L.push({ c: e.c, r: e.r }); });
      scene.shapes.forEach(s => { if (!revealed(s.step)) return; if (s.t === 'circle' || s.t === 'arc') L.push({ c: s.c, r: s.r }); });
      return L;
    }
    function curvePts() {
      const P = [];
      scene.shapes.forEach(s => { if (!revealed(s.step)) return; if (s.t === 'curve') s.pts.forEach(p => { if (p) P.push({ x: p[0], y: p[1] }); }); });
      state.elements.forEach(e => { if (e.t === 'curve') e.pts.forEach(p => P.push(p)); });
      return P;
    }
    function candidates() {
      if (cands) return cands;
      const pts = [];
      scene.shapes.forEach(s => { if (revealed(s.step) && s.t === 'point') pts.push(Object.assign({ kind: 'given' }, s.p)); });
      scene.shapes.forEach(s => { if (revealed(s.step) && (s.t === 'seg' || s.t === 'bar')) { pts.push(Object.assign({ kind: 'end' }, s.a)); pts.push(Object.assign({ kind: 'end' }, s.b)); } });
      state.elements.forEach(e => { if (e.t === 'point') pts.push(Object.assign({ kind: 'user' }, e.p)); if (e.t === 'line') { pts.push(Object.assign({ kind: 'user' }, e.a)); pts.push(Object.assign({ kind: 'user' }, e.b)); } if (e.t === 'circle') pts.push(Object.assign({ kind: 'user' }, e.c)); });
      const L = lineElems(), Cc = circleElems();
      for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const p = g.lineLine(L[i].a, L[i].b, L[j].a, L[j].b); if (p && inSeg(L[i], p) && inSeg(L[j], p)) pts.push(Object.assign({ kind: 'x' }, p)); }
      L.forEach(l => Cc.forEach(c => g.lineCircle(l.a, l.b, c.c, c.r).forEach(p => { if (inSeg(l, p)) pts.push(Object.assign({ kind: 'x' }, p)); })));
      for (let i = 0; i < Cc.length; i++) for (let j = i + 1; j < Cc.length; j++) g.circleCircle(Cc[i].c, Cc[i].r, Cc[j].c, Cc[j].r).forEach(p => pts.push(Object.assign({ kind: 'x' }, p)));
      cands = { pts: pts.filter(p => isFinite(p.x) && isFinite(p.y)), lines: L, circles: Cc, curve: curvePts() };
      return cands;
    }
    function inSeg(l, p) { if (!l.seg) return true; const d = g.sub(l.b, l.a), t = g.dot(g.sub(p, l.a), d) / (g.dot(d, d) || 1); return t > -0.02 && t < 1.02; }
    function snap(p) {
      const c = candidates();
      let best = null, bd = snapTol;
      c.pts.forEach(q => { const d = g.dist(p, q); if (d < bd) { bd = d; best = { x: q.x, y: q.y, kind: q.kind }; } });
      if (best) return best;
      // on a line or circle or curve: the foot
      let onBest = null; bd = snapTol * 0.8;
      c.lines.forEach(l => { const f = g.foot(p, l.a, l.b); if (inSeg(l, f)) { const d = g.dist(p, f); if (d < bd) { bd = d; onBest = { x: f.x, y: f.y, kind: 'on' }; } } });
      c.circles.forEach(cc => { const d = Math.abs(g.dist(p, cc.c) - cc.r); if (d < bd) { bd = d; const q = g.add(cc.c, g.mul(g.unit(g.sub(p, cc.c)), cc.r)); onBest = { x: q.x, y: q.y, kind: 'on' }; } });
      c.curve.forEach(q => { const d = g.dist(p, q); if (d < bd) { bd = d; onBest = { x: q.x, y: q.y, kind: 'on' }; } });
      return onBest || { x: p.x, y: p.y, kind: 'free' };
    }
    function nearestLine(p) {
      const c = candidates(); let best = null, bd = snapTol;
      c.lines.forEach(l => { const f = g.foot(p, l.a, l.b); if (inSeg(l, f)) { const d = g.dist(p, f); if (d < bd) { bd = d; best = l; } } });
      return best;
    }

    /* ---- drawing the user's elements */
    function clipLine(a, b) {
      const d = g.sub(b, a); let t0 = -Infinity, t1 = Infinity;
      const tests = [[-d.x, a.x - B.x0], [d.x, B.x1 - a.x], [-d.y, a.y - B.y0], [d.y, B.y1 - a.y]];
      for (const [p, q] of tests) { if (Math.abs(p) < 1e-12) { if (q < 0) return null; continue; } const t = q / p; if (p < 0) { if (t > t0) t0 = t; } else { if (t < t1) t1 = t; } }
      if (t0 > t1) return null; return [g.add(a, g.mul(d, t0)), g.add(a, g.mul(d, t1))];
    }
    function elemNode(e, cls) {
      cls = 'user ' + (cls || '');
      if (e.t === 'point') return mk('circle', { class: cls + ' pt', cx: X(e.p.x), cy: Y(e.p.y), r: rPt });
      if (e.t === 'line') { const c = clipLine(e.a, e.b); if (!c) return mk('g', {}); return mk('path', { class: cls, 'stroke-width': lw, d: 'M' + f2(X(c[0].x)) + ' ' + f2(Y(c[0].y)) + 'L' + f2(X(c[1].x)) + ' ' + f2(Y(c[1].y)) }); }
      if (e.t === 'circle') return mk('circle', { class: cls, 'stroke-width': lw, cx: X(e.c.x), cy: Y(e.c.y), r: e.r });
      if (e.t === 'curve') return mk('path', { class: cls, 'stroke-width': lw * 1.5, d: e.pts.map((p, i) => (i ? 'L' : 'M') + f2(X(p.x)) + ' ' + f2(Y(p.y))).join('') });
      return mk('g', {});
    }
    function redraw() {
      while (gUser.firstChild) gUser.removeChild(gUser.firstChild);
      state.elements.forEach((e, i) => { const n = elemNode(e, e.ok ? 'ok' : ''); gUser.appendChild(n); });
      cands = null;
    }
    function preview(nodes) { while (gPrev.firstChild) gPrev.removeChild(gPrev.firstChild); nodes.forEach(n => gPrev.appendChild(n)); }
    function ghost(target) {
      while (gGhost.firstChild) gGhost.removeChild(gGhost.firstChild);
      if (!target) return;
      let e = null;
      if (target.t === 'point') e = { t: 'point', p: target.p };
      else if (target.t === 'line') e = { t: 'line', a: target.a, b: target.b };
      else if (target.t === 'circle') e = { t: 'circle', c: target.c, r: target.r };
      else if (target.t === 'curve') e = { t: 'curve', pts: target.pts.map(p => ({ x: p[0], y: p[1] })) };
      const n = elemNode(e, ''); n.setAttribute('class', 'ghost' + (target.t === 'point' ? ' pt' : '')); if (target.t === 'point') { n.setAttribute('fill', '#888'); n.setAttribute('r', rPt * 1.4); }
      gGhost.appendChild(n);
    }

    /* ---- matching */
    function matches(e, t) {
      if (t.t === 'point') return e.t === 'point' && g.dist(e.p, t.p) < tol;
      if (t.t === 'line') { if (e.t !== 'line') return false; return ptLine(t.a, e) < tol && ptLine(t.b, e) < tol; }
      if (t.t === 'circle') return e.t === 'circle' && g.dist(e.c, t.c) < tol && Math.abs(e.r - t.r) < tol;
      if (t.t === 'curve') {
        if (e.t !== 'curve' || e.pts.length < 3) return false;
        const T = t.pts.filter((p, i) => i % Math.max(1, Math.floor(t.pts.length / 60)) === 0).map(p => ({ x: p[0], y: p[1] }));
        if (!T.length) return false;
        const cover = T.filter(p => distToPoly(p, e.pts) < curveTol).length / T.length;
        const stay = e.pts.filter(p => distToPts(p, T) < curveTol * 1.6).length / e.pts.length;
        return cover >= 0.85 && stay >= 0.75;
      }
      return false;
    }
    function ptLine(p, l) { return Math.abs(g.cross(g.sub(l.b, l.a), g.sub(p, l.a))) / (g.dist(l.a, l.b) || 1e-9); }
    function distToPoly(p, pts) { let d = Infinity; for (let i = 1; i < pts.length; i++) d = Math.min(d, distSeg(p, pts[i - 1], pts[i])); return d; }
    function distSeg(p, a, b) { const d = g.sub(b, a), L2 = g.dot(d, d) || 1e-12; const t = Math.max(0, Math.min(1, g.dot(g.sub(p, a), d) / L2)); return g.dist(p, g.add(a, g.mul(d, t))); }
    function distToPts(p, pts) { let d = Infinity; for (const q of pts) { const e = g.dist(p, q); if (e < d) d = e; } return d; }
    function stepTargets(i) { return targets.map((t, j) => ({ t, j })).filter(x => x.t.step === i); }
    function unmatched(i) { return stepTargets(i).filter(x => !state.matched.has(x.j)); }

    function addElement(e, viaShow) {
      const dup = state.elements.find(x => sameElem(x, e));
      const all = targets.map((t, j) => ({ t, j })).filter(x => !state.matched.has(x.j));
      const now = all.filter(x => x.t.step === state.step && matches(e, x.t));
      const later = all.filter(x => x.t.step > state.step && matches(e, x.t));
      if (now.length || later.length) {
        now.concat(later).forEach(x => state.matched.add(x.j));
        if (dup) dup.ok = true; else { e.ok = true; state.elements.push(e); }
        status(viaShow ? 'Drawn for you.' : now.length ? 'Right: that is what the step asks for.' : 'That belongs to a later step; kept.', 'ok');
      } else {
        if (dup) { status('Already drawn.', 'bad'); return; }
        state.elements.push(e);
        status(e.t === 'curve' ? 'The curve does not follow the one asked for closely enough; try again, through the points you constructed.' : 'Kept as a construction line; it is not what this step asks for.', 'bad');
      }
      redraw();
      ghost(null);
      while (state.step < scene.steps.length && isTargetStep(state.step) && !unmatched(state.step).length) { reveal(state.step); animateReveal(state.step); state.step++; }
      advance();
    }
    function sameElem(a, b) {
      if (a.t !== b.t) return false;
      if (a.t === 'point') return g.dist(a.p, b.p) < tol * 0.5;
      if (a.t === 'line') return ptLine(b.a, a) < tol * 0.5 && ptLine(b.b, a) < tol * 0.5;
      if (a.t === 'circle') return g.dist(a.c, b.c) < tol * 0.5 && Math.abs(a.r - b.r) < tol * 0.5;
      return false;
    }
    function animateReveal(i) {
      const gg = stepGroups[i]; if (!gg) return;
      gg.querySelectorAll('path, circle, text').forEach((el, k) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: k * 40, fill: 'backwards' }));
    }

    /* ---- UI */
    function status(msg, cls) { const el = container.querySelector('#bstatus'); el.innerHTML = '<span class="' + (cls === 'ok' ? 'okmsg' : 'badmsg') + '">' + esc(msg) + '</span>'; }
    function updateUI() {
      const st = scene.steps[state.step];
      container.querySelector('#bstepno').textContent = Math.min(state.step + 1, scene.steps.length);
      const now = container.querySelector('#bnow');
      if (!st) now.innerHTML = '<b>Done.</b> Every step of the construction is drawn.';
      else {
        const um = unmatched(state.step);
        const want = STEP_TOOL[st.tool] || st.tool;
        now.innerHTML = '<span class="tool ' + st.tool + '" style="font-weight:600;color:var(--accent2)">' + (C.icon ? C.icon(st.tool) : '') + esc(C.TOOLS[st.tool].name) + '</span> ' + esc(st.text) +
          '<div class="small muted" style="margin-top:6px">To draw: ' + um.map(x => x.t.t === 'line' ? 'a line' : x.t.t === 'circle' ? 'a circle' : x.t.t === 'point' ? 'a point' : 'the curve').join(', ') + ' (' + um.length + ' left).</div>';
        if (STEP_TOOL[st.tool] && state.tool !== want && !(want === 'straightedge' && state.tool === 'point')) setTool(want);
      }
      const total = targets.length, done = state.matched.size;
      container.querySelector('#bprog').style.width = (total ? 100 * done / total : 100) + '%';
      container.querySelectorAll('#bsteps li').forEach(li => { const k = Number(li.dataset.i); li.classList.toggle('on', k === state.step); li.classList.toggle('done', k < state.step); });
      container.querySelector('#bhelp').textContent = TOOL_HELP[state.tool] + (state.tool === 'dividers' && state.opening ? ' Opening set: ' + f2(state.opening) + '.' : '');
    }
    function setTool(t) {
      state.tool = t; state.pending = []; preview([]);
      if (t !== 'dividers') state.opening = null;
      container.querySelectorAll('#palette button[data-tool]').forEach(b => b.classList.toggle('on', b.dataset.tool === t));
      container.querySelector('#bhelp').textContent = TOOL_HELP[t];
    }
    container.querySelectorAll('#palette button[data-tool]').forEach(b => b.onclick = () => setTool(b.dataset.tool));
    container.querySelector('#bundo').onclick = undo;
    container.querySelector('#bclear').onclick = () => { if (state.elements.length && confirm('Clear everything you drew?')) restart(); };
    container.querySelector('#brestart').onclick = restart;
    container.querySelector('#bhint').onclick = () => { const um = unmatched(state.step); if (!um.length) return; state.hints++; ghost(um[0].t); setTimeout(() => ghost(null), 4000); };
    container.querySelector('#bshow').onclick = () => {
      const um = unmatched(state.step); if (!um.length) return; state.shows++;
      const t = um[0].t; let e;
      if (t.t === 'point') e = { t: 'point', p: t.p }; else if (t.t === 'line') e = { t: 'line', a: t.a, b: t.b }; else if (t.t === 'circle') e = { t: 'circle', c: t.c, r: t.r }; else e = { t: 'curve', pts: t.pts.map(p => ({ x: p[0], y: p[1] })) };
      addElement(e, true);
    };
    function undo() {
      const e = state.elements.pop(); if (!e) return;
      // un-match whatever it matched
      targets.forEach((t, j) => { if (state.matched.has(j) && e.ok && matches(e, t)) state.matched.delete(j); });
      // step back if the current step lost its completion
      while (state.step > 0 && unmatched(state.step - 1).length) { state.step--; stepGroups[state.step].style.display = 'none'; }
      redraw(); updateUI(); status('Undone.', 'ok');
    }
    function restart() {
      state.elements = []; state.matched = new Set(); state.step = 0; state.hints = 0; state.shows = 0; state.t0 = Date.now(); state.done = false; state.pending = []; state.opening = null;
      stepGroups.forEach(gg => gg.style.display = 'none');
      container.querySelector('#bdone').innerHTML = '';
      redraw(); ghost(null); preview([]); advance(); status('', 'ok');
    }

    /* ---- pointer handling */
    const pt = svg.createSVGPoint();
    function toSvg(ev) { pt.x = ev.clientX; pt.y = ev.clientY; const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const q = pt.matrixTransform(m.inverse()); return toMath(q.x, q.y); }
    let cursor = null, drawing = false;
    function markSnap(p) {
      const n = [];
      if (p.kind !== 'free') n.push(mk('circle', { class: 'snap', cx: X(p.x), cy: Y(p.y), r: rPt * 2.2 }));
      n.push(mk('circle', { class: 'cursorpt', cx: X(p.x), cy: Y(p.y), r: rPt * 0.8 }));
      return n;
    }
    svg.addEventListener('pointermove', ev => {
      if (state.done && !drawing) return;
      const raw = toSvg(ev);
      if (state.tool === 'pencil') {
        if (drawing && state.pencil) { const last = state.pencil[state.pencil.length - 1]; if (g.dist(last, raw) > S * 0.004) { state.pencil.push(raw); preview([elemNode({ t: 'curve', pts: state.pencil }, '')].map(n => { n.setAttribute('class', 'preview'); return n; })); } }
        return;
      }
      const p = snap(raw); cursor = p;
      const nodes = markSnap(p);
      if (state.tool === 'straightedge' && state.pending.length === 1) { const n = elemNode({ t: 'line', a: state.pending[0], b: p }, ''); n.setAttribute('class', 'preview'); nodes.unshift(n); }
      if (state.tool === 'compass' && state.pending.length === 1) { const r = g.dist(state.pending[0], p); if (r > 0) { const n = elemNode({ t: 'circle', c: state.pending[0], r }, ''); n.setAttribute('class', 'preview'); nodes.unshift(n); } }
      if (state.tool === 'dividers' && state.opening) { const n = elemNode({ t: 'circle', c: p, r: state.opening }, ''); n.setAttribute('class', 'preview'); nodes.unshift(n); }
      if (state.tool === 'dividers' && !state.opening && state.pending.length === 1) { const n = elemNode({ t: 'line', a: state.pending[0], b: p }, ''); n.setAttribute('class', 'preview'); nodes.unshift(n); }
      if (state.tool === 'square' && state.pending.length === 1) { const l = state.pending[0]; const dir = ev.shiftKey ? g.sub(l.b, l.a) : g.perp(g.sub(l.b, l.a)); const n = elemNode({ t: 'line', a: p, b: g.add(p, dir) }, ''); n.setAttribute('class', 'preview'); nodes.unshift(n); }
      preview(nodes);
    });
    svg.addEventListener('pointerleave', () => { if (!drawing) preview([]); });
    svg.addEventListener('pointerdown', ev => {
      if (state.done) return;
      if (ev.button !== 0) return;
      svg.setPointerCapture(ev.pointerId);
      const raw = toSvg(ev);
      if (state.tool === 'pencil') { drawing = true; state.pencil = [raw]; return; }
      const p = snap(raw);
      if (state.tool === 'point') { addElement({ t: 'point', p: { x: p.x, y: p.y } }); return; }
      if (state.tool === 'straightedge') {
        if (!state.pending.length) { state.pending.push({ x: p.x, y: p.y }); return; }
        const a = state.pending[0]; if (g.dist(a, p) < tol * 0.3) return;
        state.pending = []; addElement({ t: 'line', a, b: { x: p.x, y: p.y } }); return;
      }
      if (state.tool === 'compass') {
        if (!state.pending.length) { state.pending.push({ x: p.x, y: p.y }); return; }
        const c = state.pending[0], r = g.dist(c, p); if (r < tol * 0.3) return;
        state.pending = []; addElement({ t: 'circle', c, r }); return;
      }
      if (state.tool === 'dividers') {
        if (state.opening) { addElement({ t: 'circle', c: { x: p.x, y: p.y }, r: state.opening }); return; }
        if (!state.pending.length) { state.pending.push({ x: p.x, y: p.y }); return; }
        const L = g.dist(state.pending[0], p); if (L < tol * 0.3) return;
        state.opening = L; state.pending = []; status('Opening taken: now click the centre to swing it.', 'ok'); updateUI(); return;
      }
      if (state.tool === 'square') {
        if (!state.pending.length) { const l = nearestLine(raw); if (!l) { status('Click on a line first.', 'bad'); return; } state.pending.push(l); status('Now click the point the ' + (ev.shiftKey ? 'parallel' : 'perpendicular') + ' must pass through.', 'ok'); return; }
        const l = state.pending[0]; const dir = ev.shiftKey ? g.sub(l.b, l.a) : g.perp(g.sub(l.b, l.a));
        state.pending = []; addElement({ t: 'line', a: { x: p.x, y: p.y }, b: g.add(p, g.unit(dir)) }); return;
      }
    });
    svg.addEventListener('pointerup', ev => {
      if (state.tool === 'pencil' && drawing) {
        drawing = false; preview([]);
        const pts = smooth(state.pencil || []); state.pencil = null;
        if (pts.length >= 3) addElement({ t: 'curve', pts });
      }
    });
    function smooth(pts) {
      if (pts.length < 5) return pts;
      const out = [];
      for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 2)], b = pts[Math.max(0, i - 1)], c = pts[i], d = pts[Math.min(pts.length - 1, i + 1)], e = pts[Math.min(pts.length - 1, i + 2)]; out.push({ x: (a.x + b.x + c.x + d.x + e.x) / 5, y: (a.y + b.y + c.y + d.y + e.y) / 5 }); }
      return out;
    }
    function onKey(ev) {
      if (ev.target.tagName === 'INPUT') return;
      if (ev.key === 'Escape') { state.pending = []; state.opening = null; preview([]); updateUI(); }
      else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') { ev.preventDefault(); undo(); }
      else if (ev.key === 'Delete' || ev.key === 'Backspace') { if (!state.pending.length) undo(); }
      else if (ev.key === '1') setTool('point'); else if (ev.key === '2') setTool('straightedge'); else if (ev.key === '3') setTool('compass');
      else if (ev.key === '4') setTool('dividers'); else if (ev.key === '5') setTool('square'); else if (ev.key === '6') setTool('pencil');
    }
    document.addEventListener('keydown', onKey);

    setTool('straightedge');
    advance();
    if (!targets.length) container.querySelector('#bnow').innerHTML = '<b>This figure has no construction steps to practise.</b> It is a drawing to study; see the worked figure.';
    return { destroy() { document.removeEventListener('keydown', onKey); } };
  }

  C.Board = { open };
})(typeof window !== 'undefined' ? window : globalThis);
