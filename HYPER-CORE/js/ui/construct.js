/* HYPER-CORE · ui/construct.js
 *
 * Hand constructions on a concept page (Hyper Projections): the construction card with its step
 * player (every step named with its tool, drawn in with an animated stroke), the practice board on
 * which the learner redraws the construction with virtual tools and has every stroke checked, and the
 * gallery of all constructions (Tools → Constructions). The kit itself is js/construct.js.
 *
 *   ui.constructionCard(ref, node) -> card element       ref = { id, title? } from a concept's `construction`
 *   H.constructionGallery(el, params)                     the Tools page
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;
  const C = H.construct, g = C.g;
  const f2 = n => (Math.round(n * 100) / 100).toString();

  const toolChip = t => '<span class="cxchip">' + C.icon(t) + esc(C.TOOLS[t].name) + '</span>';
  const toolTag = t => '<span class="cxtool ' + t + '">' + C.icon(t) + esc(C.TOOLS[t].name) + '</span>';
  function sceneOf(def) { try { return C.build(def); } catch (e) { return { error: e.message || String(e) }; } }
  const svgBlob = sc => new Blob([C.svg(sc, { standalone: true, size: 900 })], { type: 'image/svg+xml' });

  /* ================================================================ the card */
  ui.constructionCard = function (ref, node) {
    const def = H.constructions.get(ref.id);
    const card = ui.el('<div class="card cxcard"></div>');
    if (!def) { card.innerHTML = '<div class="cxhead"><h3>Construction “' + esc(ref.id) + '” is missing</h3></div>'; return card; }
    const sc = sceneOf(def);
    if (sc.error) { card.innerHTML = '<div class="cxhead"><h3>' + esc(def.title) + '</h3></div><div class="empty" style="padding:14px">This construction fails to build: ' + esc(sc.error) + '</div>'; return card; }
    const tools = [...new Set(sc.steps.map(s => s.tool))].filter(t => t !== 'given' && t !== 'note');
    const canPractise = C.targets(sc).length > 0;
    card.innerHTML = '<div class="cxhead"><span class="tag">' + H.icon('drafting', 15) + '</span><h3>' + esc(ref.title || def.title) + '</h3><div class="cxtools">' + tools.map(toolChip).join('') + '</div></div>' +
      '<div class="cxbody"><div class="cxstage">' + C.svg(sc, { noSize: true }) + '<div class="cxlabel"></div></div>' +
      '<div class="cxside"><div class="cxplayer"><button class="btn sm" data-a="first" title="First step">⏮</button><button class="btn sm" data-a="prev" title="Previous step (←)">◀</button><button class="btn sm pri" data-a="play">▶ Play</button><button class="btn sm" data-a="next" title="Next step (→)">▶</button><button class="btn sm" data-a="last" title="All steps">⏭</button><input type="range" min="0" max="' + (sc.steps.length - 1) + '" value="0"><span class="small muted cxcount"></span></div>' +
      '<ol class="cxsteps">' + sc.steps.map((st, i) => '<li data-i="' + i + '" data-n="' + (i + 1) + '">' + toolTag(st.tool) + esc(st.text) + '</li>').join('') + '</ol></div></div>' +
      '<div class="cxboardwrap" hidden></div>' +
      '<div class="cxactions">' + (canPractise ? '<button class="btn sm pri" data-a="practise">' + H.icon('drafting', 14) + 'Practise it yourself</button>' : '<span class="small muted">A drawing to study (no construction steps to practise).</span>') +
      '<button class="btn sm" data-a="print">Print worksheet</button><button class="btn sm" data-a="svg">' + H.icon('download', 14) + 'Download SVG</button><button class="btn sm ghost" data-a="copy">Copy SVG</button><span class="small faint" style="margin-left:auto">' + sc.steps.length + ' steps · ' + sc.shapes.length + ' elements</span></div>' +
      (def.note ? '<div class="cxnote">' + H.text(def.note) + '</div>' : '');

    /* ---- the player */
    const svg = card.querySelector('.cxstage svg'), label = card.querySelector('.cxlabel'), range = card.querySelector('input[type=range]'), count = card.querySelector('.cxcount'), play = card.querySelector('[data-a=play]');
    const lis = Array.from(card.querySelectorAll('.cxsteps li')), groups = Array.from(svg.querySelectorAll('g.step'));
    const n = sc.steps.length;
    let cur = n - 1, timer = null;
    function show(i, animate) {
      i = Math.max(0, Math.min(n - 1, i)); cur = i;
      groups.forEach(gr => { const k = Number(gr.dataset.step); gr.style.display = k <= i ? '' : 'none'; gr.style.opacity = k === i ? '1' : (k < i ? '0.92' : '0'); });
      if (animate) animateGroup(groups.find(gr => Number(gr.dataset.step) === i));
      lis.forEach(li => { const k = Number(li.dataset.i); li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); });
      const st = sc.steps[i];
      label.innerHTML = C.icon(st.tool) + esc(C.TOOLS[st.tool].name) + ' · step ' + (i + 1) + ' of ' + n;
      range.value = i; count.textContent = (i + 1) + ' / ' + n;
      const on = lis[i]; if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } play.textContent = '▶ Play'; }
    card.querySelector('[data-a=first]').onclick = () => { stop(); show(0, false); };
    card.querySelector('[data-a=last]').onclick = () => { stop(); show(n - 1, false); };
    card.querySelector('[data-a=prev]').onclick = () => { stop(); show(cur - 1, false); };
    card.querySelector('[data-a=next]').onclick = () => { stop(); show(cur + 1, true); };
    range.oninput = () => { stop(); show(Number(range.value), false); };
    lis.forEach(li => li.onclick = () => { stop(); show(Number(li.dataset.i), true); });
    play.onclick = () => {
      if (timer) { stop(); return; }
      play.textContent = '⏸ Pause';
      let i = cur >= n - 1 ? -1 : cur;
      const tick = () => { i++; if (i >= n) { stop(); return; } show(i, true); timer = setTimeout(tick, 1700 + Math.min(2500, 180 * sc.steps[i].shapes.length)); };
      tick();
    };
    ui.onLeave(stop);
    show(n - 1, false);
    const onKey = e => { if (!card.isConnected || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || board) return; if (!card.matches(':hover')) return; if (e.key === 'ArrowRight') { stop(); show(cur + 1, true); e.preventDefault(); } else if (e.key === 'ArrowLeft') { stop(); show(cur - 1, false); e.preventDefault(); } };
    document.addEventListener('keydown', onKey); ui.onLeave(() => document.removeEventListener('keydown', onKey));

    /* ---- actions */
    card.querySelector('[data-a=print]').onclick = () => { show(0, false); setTimeout(() => window.print(), 100); };
    card.querySelector('[data-a=svg]').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(svgBlob(sc)); a.download = def.id + '.svg'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
    card.querySelector('[data-a=copy]').onclick = e => { if (navigator.clipboard) navigator.clipboard.writeText(C.svg(sc, { standalone: true, size: 900 })).then(() => { e.target.textContent = 'Copied'; }); };
    let board = null;
    const pr = card.querySelector('[data-a=practise]');
    if (pr) pr.onclick = () => {
      const wrap = card.querySelector('.cxboardwrap'), body = card.querySelector('.cxbody');
      if (board) { board.destroy(); board = null; wrap.hidden = true; wrap.innerHTML = ''; body.hidden = false; pr.innerHTML = H.icon('drafting', 14) + 'Practise it yourself'; return; }
      stop(); body.hidden = true; wrap.hidden = false;
      board = C.Board.open(wrap, sc, { key: def.id, title: def.title });
      pr.innerHTML = H.icon('eye', 14) + 'Back to the worked drawing';
      wrap.scrollIntoView({ block: 'nearest' });
    };
    ui.onLeave(() => { if (board) board.destroy(); });
    return card;
  };

  function animateGroup(gr) {
    if (!gr) return;
    let delay = 0;
    gr.querySelectorAll('path, circle').forEach(el => {
      if (el.classList.contains('pt') || el.classList.contains('head') || el.classList.contains('fill')) { fade(el, delay); return; }
      let L = 0; try { L = el.getTotalLength ? el.getTotalLength() : 0; } catch (e) { L = 0; }
      if (!L) { fade(el, delay); return; }
      const dur = Math.min(1400, 250 + L * 1.2);
      const dashBefore = el.style.strokeDasharray;
      el.style.strokeDasharray = L + ' ' + L; el.style.strokeDashoffset = L;
      const a = el.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: dur, delay, easing: 'ease-in-out', fill: 'forwards' });
      a.onfinish = () => { el.style.strokeDasharray = dashBefore; el.style.strokeDashoffset = ''; };
      delay += Math.min(dur * 0.5, 300);
    });
    gr.querySelectorAll('text').forEach(el => fade(el, delay));
  }
  function fade(el, delay) { try { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay, fill: 'backwards' }); } catch (e) { /* older browsers */ } }

  /* ================================================================ the practice board */
  const TOOL_ORDER = ['point', 'straightedge', 'compass', 'dividers', 'square', 'pencil'];
  const TOOL_NAME = { point: 'Point', straightedge: 'Straightedge', compass: 'Compass', dividers: 'Dividers', square: 'Set square', pencil: 'Pencil' };
  const TOOL_HELP = {
    point: 'Click to mark a point (it snaps to intersections and to the given lines and curves).',
    straightedge: 'Click two points: the line through them.',
    compass: 'Click the centre, then the point that fixes the radius.',
    dividers: 'Click two points to take their distance, then click a centre to swing a circle of that radius. Esc resets the opening.',
    square: 'Click a line, then a point: the perpendicular through the point. Hold Shift for the parallel.',
    pencil: 'Drag along the curve through the points you have found.'
  };
  const STEP_TOOL = { straightedge: 'straightedge', tee: 'straightedge', compass: 'compass', dividers: 'dividers', ruler: 'straightedge', square: 'square', protractor: 'straightedge', pencil: 'pencil', fold: 'straightedge', thread: 'straightedge' };

  function openBoard(container, scene, opts) {
    opts = opts || {};
    const B = scene.bounds, S = B.S;
    const X = x => x - B.x0, Y = y => B.y1 - y;
    const toMath = (sx, sy) => ({ x: sx + B.x0, y: B.y1 - sy });
    const tol = S * 0.016, snapTol = S * 0.022, curveTol = S * 0.03;
    const targets = C.targets(scene);
    const stepsWithTargets = Array.from(new Set(targets.map(t => t.step)));
    const state = { tool: 'straightedge', pending: [], opening: null, elements: [], matched: new Set(), step: 0, hints: 0, shows: 0, t0: Date.now(), done: false, pencil: null };
    const store = H.store && H.store.data ? (H.store.data.constructions = H.store.data.constructions || {}) : {};
    const key = opts.key || scene.def.id;

    container.innerHTML =
      '<div class="cxbody"><div>' +
      '<div class="cxpalette">' + TOOL_ORDER.map(t => '<button class="btn sm" data-tool="' + t + '" title="' + esc(TOOL_HELP[t]) + '">' + C.icon(t === 'point' ? 'given' : t) + esc(TOOL_NAME[t]) + '</button>').join('') +
      '<span style="flex:1"></span><button class="btn sm" data-b="undo" title="Undo (Ctrl+Z)">Undo</button><button class="btn sm" data-b="clear">Clear</button></div>' +
      '<div class="cxboard">' + C.svg(scene, { noSize: true }) + '</div>' +
      '<p class="cxstatus" data-b="status"></p>' +
      '</div><aside class="cxside">' +
      '<div class="small muted">Step <span data-b="stepno"></span> of ' + scene.steps.length + '</div><div class="cxnow" data-b="now"></div><div class="cxprog"><i data-b="prog"></i></div>' +
      '<div class="btnrow"><button class="btn sm" data-b="hint">Hint</button><button class="btn sm" data-b="show">Show</button><button class="btn sm ghost" data-b="restart">Restart</button></div>' +
      '<div class="cxhelp" data-b="help"></div>' +
      '<ol class="cxsteps">' + scene.steps.map(st => '<li data-i="' + st.i + '" data-n="' + (st.i + 1) + '">' + toolTag(st.tool) + esc(st.text) + '</li>').join('') + '</ol>' +
      '<div data-b="done"></div></aside></div>';
    const $ = sel => container.querySelector(sel);
    const svg = container.querySelector('.cxboard svg');
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
    const gGhost = mk('g', {}), gUser = mk('g', {}), gPrev = mk('g', {});
    svg.appendChild(gGhost); svg.appendChild(gUser); svg.appendChild(gPrev);
    const stepGroups = Array.from(svg.querySelectorAll('g.step'));
    const lw = S * 0.0036, rPt = S * 0.0065;

    function revealed(i) { return stepGroups[i] && stepGroups[i].style.display !== 'none'; }
    function reveal(i) { const gg = stepGroups[i]; if (gg) gg.style.display = ''; }
    stepGroups.forEach(gg => gg.style.display = 'none');
    const isTargetStep = i => stepsWithTargets.includes(i);
    function advance() {
      while (state.step < scene.steps.length && !isTargetStep(state.step)) { reveal(state.step); state.step++; }
      if (state.step >= scene.steps.length) finish();
      updateUI();
    }
    function finish() {
      if (state.done) return;
      state.done = true;
      const secs = Math.round((Date.now() - state.t0) / 1000);
      const best = store[key] || null;
      const rec = { done: true, elements: state.elements.length, hints: state.hints, shows: state.shows, secs, when: new Date().toISOString().slice(0, 10) };
      if (!best || rec.shows < best.shows || (rec.shows === best.shows && rec.secs < best.secs)) { store[key] = rec; if (H.store && H.store.save) H.store.save(); }
      $('[data-b=done]').innerHTML = '<div class="cxdone"><b>Construction complete.</b> ' + state.elements.length + ' elements drawn, ' + state.hints + ' hints, ' + state.shows + ' shown, ' + secs + ' s.' + (best ? ' Best so far: ' + best.shows + ' shown, ' + best.secs + ' s.' : '') + '<div class="btnrow" style="margin-top:8px"><button class="btn sm pri" data-b="again">Draw it again</button></div></div>';
      $('[data-b=again]').onclick = restart;
      if (H.store && H.store.data && opts.conceptId) { /* nothing else to record */ }
    }

    let cands = null;
    function lineElems() {
      const L = [];
      state.elements.forEach(e => { if (e.t === 'line') L.push({ a: e.a, b: e.b }); });
      scene.shapes.forEach(s => { if (!revealed(s.step)) return; if (s.t === 'seg' || s.t === 'line' || s.t === 'ray') L.push({ a: s.a, b: s.b, seg: s.t === 'seg' }); if (s.t === 'poly') for (let i = 0; i + 1 < s.pts.length + (s.o.close ? 1 : 0); i++) L.push({ a: s.pts[i], b: s.pts[(i + 1) % s.pts.length], seg: true }); });
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
      scene.shapes.forEach(s => { if (revealed(s.step) && s.t === 'seg') { pts.push(Object.assign({ kind: 'end' }, s.a)); pts.push(Object.assign({ kind: 'end' }, s.b)); } if (revealed(s.step) && s.t === 'poly') s.pts.forEach(p => pts.push(Object.assign({ kind: 'end' }, p))); });
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
    function redraw() { while (gUser.firstChild) gUser.removeChild(gUser.firstChild); state.elements.forEach(e => gUser.appendChild(elemNode(e, e.ok ? 'ok' : ''))); cands = null; }
    function preview(nodes) { while (gPrev.firstChild) gPrev.removeChild(gPrev.firstChild); nodes.forEach(n => gPrev.appendChild(n)); }
    function ghost(target) {
      while (gGhost.firstChild) gGhost.removeChild(gGhost.firstChild);
      if (!target) return;
      let e = null;
      if (target.t === 'point') e = { t: 'point', p: target.p }; else if (target.t === 'line') e = { t: 'line', a: target.a, b: target.b }; else if (target.t === 'circle') e = { t: 'circle', c: target.c, r: target.r }; else e = { t: 'curve', pts: target.pts.map(p => ({ x: p[0], y: p[1] })) };
      const n = elemNode(e, ''); n.setAttribute('class', 'ghost' + (target.t === 'point' ? ' pt' : '')); if (target.t === 'point') { n.setAttribute('fill', '#888'); n.setAttribute('r', rPt * 1.4); }
      gGhost.appendChild(n);
    }
    function matches(e, t) {
      if (t.t === 'point') return e.t === 'point' && g.dist(e.p, t.p) < tol;
      if (t.t === 'line') return e.t === 'line' && ptLine(t.a, e) < tol && ptLine(t.b, e) < tol;
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
      redraw(); ghost(null);
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
    function animateReveal(i) { const gg = stepGroups[i]; if (!gg) return; gg.querySelectorAll('path, circle, text').forEach((el, k) => { try { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: k * 40, fill: 'backwards' }); } catch (e) { /* ignore */ } }); }
    function status(msg, cls) { $('[data-b=status]').innerHTML = '<span class="' + (cls === 'ok' ? 'okmsg' : 'badmsg') + '">' + esc(msg) + '</span>'; }
    function updateUI() {
      const st = scene.steps[state.step];
      $('[data-b=stepno]').textContent = Math.min(state.step + 1, scene.steps.length);
      const now = $('[data-b=now]');
      if (!st) now.innerHTML = '<b>Done.</b> Every step of the construction is drawn.';
      else {
        const um = unmatched(state.step), want = STEP_TOOL[st.tool] || st.tool;
        now.innerHTML = toolTag(st.tool) + ' ' + esc(st.text) + '<div class="small muted" style="margin-top:6px">To draw: ' + um.map(x => x.t.t === 'line' ? 'a line' : x.t.t === 'circle' ? 'a circle' : x.t.t === 'point' ? 'a point' : 'the curve').join(', ') + ' (' + um.length + ' left).</div>';
        if (STEP_TOOL[st.tool] && state.tool !== want && !(want === 'straightedge' && state.tool === 'point')) setTool(want);
      }
      const total = targets.length, done = state.matched.size;
      $('[data-b=prog]').style.width = (total ? 100 * done / total : 100) + '%';
      container.querySelectorAll('.cxsteps li').forEach(li => { const k = Number(li.dataset.i); li.classList.toggle('on', k === state.step); li.classList.toggle('done', k < state.step); });
      $('[data-b=help]').textContent = TOOL_HELP[state.tool] + (state.tool === 'dividers' && state.opening ? ' Opening set: ' + f2(state.opening) + '.' : '');
    }
    function setTool(t) {
      state.tool = t; state.pending = []; preview([]);
      if (t !== 'dividers') state.opening = null;
      container.querySelectorAll('.cxpalette button[data-tool]').forEach(b => b.classList.toggle('on', b.dataset.tool === t));
      $('[data-b=help]').textContent = TOOL_HELP[t];
    }
    container.querySelectorAll('.cxpalette button[data-tool]').forEach(b => b.onclick = () => setTool(b.dataset.tool));
    $('[data-b=undo]').onclick = undo;
    $('[data-b=clear]').onclick = () => { if (!state.elements.length || confirm('Clear everything you drew?')) restart(); };
    $('[data-b=restart]').onclick = restart;
    $('[data-b=hint]').onclick = () => { const um = unmatched(state.step); if (!um.length) return; state.hints++; ghost(um[0].t); setTimeout(() => ghost(null), 4000); };
    $('[data-b=show]').onclick = () => {
      const um = unmatched(state.step); if (!um.length) return; state.shows++;
      const t = um[0].t; let e;
      if (t.t === 'point') e = { t: 'point', p: t.p }; else if (t.t === 'line') e = { t: 'line', a: t.a, b: t.b }; else if (t.t === 'circle') e = { t: 'circle', c: t.c, r: t.r }; else e = { t: 'curve', pts: t.pts.map(p => ({ x: p[0], y: p[1] })) };
      addElement(e, true);
    };
    function undo() {
      const e = state.elements.pop(); if (!e) return;
      targets.forEach((t, j) => { if (state.matched.has(j) && e.ok && matches(e, t)) state.matched.delete(j); });
      while (state.step > 0 && unmatched(state.step - 1).length) { state.step--; stepGroups[state.step].style.display = 'none'; }
      redraw(); updateUI(); status('Undone.', 'ok');
    }
    function restart() {
      state.elements = []; state.matched = new Set(); state.step = 0; state.hints = 0; state.shows = 0; state.t0 = Date.now(); state.done = false; state.pending = []; state.opening = null;
      stepGroups.forEach(gg => gg.style.display = 'none');
      $('[data-b=done]').innerHTML = '';
      redraw(); ghost(null); preview([]); advance(); status('', 'ok');
    }
    const pt = svg.createSVGPoint();
    function toSvg(ev) { pt.x = ev.clientX; pt.y = ev.clientY; const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const q = pt.matrixTransform(m.inverse()); return toMath(q.x, q.y); }
    let drawing = false;
    function markSnap(p) { const n = []; if (p.kind !== 'free') n.push(mk('circle', { class: 'snap', cx: X(p.x), cy: Y(p.y), r: rPt * 2.2 })); n.push(mk('circle', { class: 'cursorpt', cx: X(p.x), cy: Y(p.y), r: rPt * 0.8 })); return n; }
    const onMove = ev => {
      if (state.done && !drawing) return;
      const raw = toSvg(ev);
      if (state.tool === 'pencil') { if (drawing && state.pencil) { const last = state.pencil[state.pencil.length - 1]; if (g.dist(last, raw) > S * 0.004) { state.pencil.push(raw); preview([elemNode({ t: 'curve', pts: state.pencil }, '')].map(n => { n.setAttribute('class', 'preview'); return n; })); } } return; }
      const p = snap(raw);
      const nodes = markSnap(p);
      const prev = (e) => { const n = elemNode(e, ''); n.setAttribute('class', 'preview'); nodes.unshift(n); };
      if (state.tool === 'straightedge' && state.pending.length === 1) prev({ t: 'line', a: state.pending[0], b: p });
      if (state.tool === 'compass' && state.pending.length === 1) { const r = g.dist(state.pending[0], p); if (r > 0) prev({ t: 'circle', c: state.pending[0], r }); }
      if (state.tool === 'dividers' && state.opening) prev({ t: 'circle', c: p, r: state.opening });
      if (state.tool === 'dividers' && !state.opening && state.pending.length === 1) prev({ t: 'line', a: state.pending[0], b: p });
      if (state.tool === 'square' && state.pending.length === 1) { const l = state.pending[0]; const dir = ev.shiftKey ? g.sub(l.b, l.a) : g.perp(g.sub(l.b, l.a)); prev({ t: 'line', a: p, b: g.add(p, dir) }); }
      preview(nodes);
    };
    const onDown = ev => {
      if (state.done || ev.button !== 0) return;
      svg.setPointerCapture(ev.pointerId);
      const raw = toSvg(ev);
      if (state.tool === 'pencil') { drawing = true; state.pencil = [raw]; return; }
      const p = snap(raw);
      if (state.tool === 'point') { addElement({ t: 'point', p: { x: p.x, y: p.y } }); return; }
      if (state.tool === 'straightedge') { if (!state.pending.length) { state.pending.push({ x: p.x, y: p.y }); return; } const a = state.pending[0]; if (g.dist(a, p) < tol * 0.3) return; state.pending = []; addElement({ t: 'line', a, b: { x: p.x, y: p.y } }); return; }
      if (state.tool === 'compass') { if (!state.pending.length) { state.pending.push({ x: p.x, y: p.y }); return; } const c = state.pending[0], r = g.dist(c, p); if (r < tol * 0.3) return; state.pending = []; addElement({ t: 'circle', c, r }); return; }
      if (state.tool === 'dividers') { if (state.opening) { addElement({ t: 'circle', c: { x: p.x, y: p.y }, r: state.opening }); return; } if (!state.pending.length) { state.pending.push({ x: p.x, y: p.y }); return; } const L = g.dist(state.pending[0], p); if (L < tol * 0.3) return; state.opening = L; state.pending = []; status('Opening taken: now click the centre to swing it.', 'ok'); updateUI(); return; }
      if (state.tool === 'square') { if (!state.pending.length) { const l = nearestLine(raw); if (!l) { status('Click on a line first.', 'bad'); return; } state.pending.push(l); status('Now click the point the ' + (ev.shiftKey ? 'parallel' : 'perpendicular') + ' must pass through.', 'ok'); return; } const l = state.pending[0]; const dir = ev.shiftKey ? g.sub(l.b, l.a) : g.perp(g.sub(l.b, l.a)); state.pending = []; addElement({ t: 'line', a: { x: p.x, y: p.y }, b: g.add(p, g.unit(dir)) }); return; }
    };
    const onUp = () => { if (state.tool === 'pencil' && drawing) { drawing = false; preview([]); const pts = smooth(state.pencil || []); state.pencil = null; if (pts.length >= 3) addElement({ t: 'curve', pts }); } };
    svg.addEventListener('pointermove', onMove); svg.addEventListener('pointerleave', () => { if (!drawing) preview([]); }); svg.addEventListener('pointerdown', onDown); svg.addEventListener('pointerup', onUp);
    function smooth(pts) { if (pts.length < 5) return pts; const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 2)], b = pts[Math.max(0, i - 1)], c = pts[i], d = pts[Math.min(pts.length - 1, i + 1)], e = pts[Math.min(pts.length - 1, i + 2)]; out.push({ x: (a.x + b.x + c.x + d.x + e.x) / 5, y: (a.y + b.y + c.y + d.y + e.y) / 5 }); } return out; }
    function onKey(ev) {
      if (!container.isConnected) return;
      if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA' || ev.target.tagName === 'SELECT') return;
      if (ev.key === 'Escape') { state.pending = []; state.opening = null; preview([]); updateUI(); }
      else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') { ev.preventDefault(); undo(); }
      else if (ev.key === '1') setTool('point'); else if (ev.key === '2') setTool('straightedge'); else if (ev.key === '3') setTool('compass');
      else if (ev.key === '4') setTool('dividers'); else if (ev.key === '5') setTool('square'); else if (ev.key === '6') setTool('pencil');
    }
    document.addEventListener('keydown', onKey);
    setTool('straightedge');
    advance();
    if (!targets.length) $('[data-b=now]').innerHTML = '<b>This drawing has no construction steps to practise.</b> It is a figure to study.';
    return { destroy() { document.removeEventListener('keydown', onKey); } };
  }
  C.Board = { open: openBoard };

  /* ================================================================ the gallery (Tools → Constructions) */
  H.constructionGallery = function (el, params) {
    const byCx = new Map();
    for (const n of H.list) for (const c of n.constructions) { if (!byCx.has(c.id)) byCx.set(c.id, []); byCx.get(c.id).push(n); }
    const all = H.constructionOrder.map(id => H.constructions.get(id));
    const summaries = new Map();
    const summary = def => { if (!summaries.has(def.id)) { try { summaries.set(def.id, Object.assign(C.summary(def), { svg: C.svg(C.build(def), { noSize: true }) })); } catch (e) { summaries.set(def.id, { error: e.message, tools: [], steps: 0 }); } } return summaries.get(def.id); };
    const tools = Object.keys(C.TOOLS).filter(t => t !== 'given' && t !== 'note');
    const q0 = (params && params.get('q')) || '';
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every construction in the app: a drawing made step by step with named hand tools. Open one to play it, print it as a worksheet, or practise it on the board.</p>' +
      '<div class="toolbar"><input type="search" class="inp cxq" placeholder="Filter by title or concept…" value="' + esc(q0) + '" style="flex:1;min-width:200px"><select class="inp cxt"><option value="">any tool</option>' + tools.map(t => '<option value="' + t + '">' + esc(C.TOOLS[t].name) + '</option>').join('') + '</select>' +
      '<select class="inp cxb"><option value="">every branch</option>' + H.branches.map(b => '<option value="' + b.id + '">' + esc(b.title) + '</option>').join('') + '</select><span class="small muted cxn"></span></div><div class="cxgallery"></div>';
    const grid = el.querySelector('.cxgallery'), q = el.querySelector('.cxq'), tsel = el.querySelector('.cxt'), bsel = el.querySelector('.cxb'), cnt = el.querySelector('.cxn');
    const draw = () => {
      const qq = q.value.trim().toLowerCase(), t = tsel.value, b = bsel.value;
      let html = '', shown = 0;
      for (const def of all) {
        const nodes = byCx.get(def.id) || [], s = summary(def);
        if (qq && !(def.title + ' ' + nodes.map(n => n.title).join(' ')).toLowerCase().includes(qq)) continue;
        if (t && !s.tools.includes(t)) continue;
        if (b && !nodes.some(n => n.branch === b)) continue;
        shown++;
        const n = nodes[0];
        html += '<a class="cxg" href="' + (n ? '#/c/' + n.id + '?s=construct' : '#/tools/constructions') + '"><div class="thumb">' + (s.svg || '<div class="empty">' + esc(s.error || '') + '</div>') + '</div><div class="t">' + esc(def.title) + '</div><div class="s">' + (n ? esc(n.title) + ' · ' : '') + s.steps + ' steps' + (s.practice ? ' · practice' : '') + '</div></a>';
      }
      grid.innerHTML = html || '<div class="empty">No construction matches.</div>';
      cnt.textContent = shown + ' of ' + all.length;
    };
    draw();
    q.addEventListener('input', U.debounce(draw, 120)); tsel.onchange = draw; bsel.onchange = draw;
  };
})();
