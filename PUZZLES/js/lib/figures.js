/* The Puzzle Cabinet · js/lib/figures.js
 *
 * Living figures for the riddle cards of the question engine: the moving
 * paradoxes of physics (data/phenomena.js), experiments in chance
 * (data/probability.js) and tricks at the table (data/table-tricks.js).
 *
 * A figure is registered with Cabinet.figure(id, { draw(g, params, ctx) })
 * and draws into an SVG group on the card, in its own units (w × h). All the
 * figures here are built on a small kit, Cabinet.figKit (K below):
 *
 *   const F = K.frame(g, ctx, { w, h, bar })   the figure box: a scene, a bar of controls,
 *                                              animation loops, timers and a watch on the answer
 *   F.button(label, fn, {icon, primary}) · F.slider({...}) · F.seg({...})   controls drawn on the card
 *   F.loop(tick)        an animation loop; tick(dt) gets seconds of figure time
 *                       (C.animScale speeds it up in the self-test); return false to stop
 *   F.whenSolved(fn)    runs once the riddle is answered, or the solution is shown
 *   F.inst({...})       the instance the question engine keeps (solve, getState, setState, destroy)
 *
 * The controls answer only to the select tool (the pen and highlighter still
 * write over them). Nothing here touches the page when the file loads: node
 * loads it for the checks. Figure ids start with phys-, prob- or trick-.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const K = C.figKit = C.figKit || {};

  /* ---------- colours on the cream card ---------- */

  const COL = K.COL = {
    ink: '#3a3020', ink2: '#5c4e36', muted: '#8f8266', faint: '#cfc3a6', line: '#e2d8c0', bar: '#f3ead6',
    red: '#b0472f', blue: '#3a6ea5', green: '#4f7f3a', gold: '#d9a520', goldDark: '#9c7414', orange: '#d9772b',
    purple: '#7d52d6', teal: '#2a8f8a', pink: '#c24c85',
    silver: '#c3c8d2', silverDark: '#7d8494', copper: '#c47a3a',
    water: '#a9d0ee', waterDeep: '#7fb3dd', waterLine: '#4f8fc4', glass: 'rgba(175,208,232,.30)', glassLine: '#7fa3bf',
    wood: '#c98c45', woodDark: '#8a5a26', table: '#dcc39a', tableDark: '#a9885a', paper: '#fffdf6', sky: '#eef5fa',
    skin: '#f0c8a0', skinDark: '#b98a60'
  };
  const FONT = '"Segoe UI", system-ui, sans-serif';
  const SERIF = 'Georgia, "Times New Roman", serif';
  const TAU = Math.PI * 2;
  K.TAU = TAU;

  const clamp = K.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = K.lerp = (a, b, t) => a + (b - a) * t;
  const ease = K.ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - Math.cos(t * Math.PI) / 2);
  const fx = K.fx = (v) => Math.round(v * 100) / 100;
  const tr = K.tr = (x, y, rot, s) => 'translate(' + fx(x) + ' ' + fx(y) + ')' + (rot ? ' rotate(' + fx(rot) + ')' : '') + (s != null && s !== 1 ? ' scale(' + fx(s) + ')' : '');

  function S(tag, attrs, parent) { return C.s(tag, attrs, parent); }
  K.S = S;
  function set(el, attrs) { for (const k in attrs) { const v = attrs[k]; if (v == null) el.removeAttribute(k); else el.setAttribute(k, typeof v === 'number' ? fx(v) : v); } return el; }
  K.set = set;
  // text: T(parent, x, y, 'words', { size, weight, anchor, fill, italic, serif, opacity })
  function T(parent, x, y, str, o) {
    o = o || {};
    const t = S('text', {
      x: fx(x), y: fx(y), class: 'fk-t', 'font-size': o.size || 13, 'font-weight': o.weight || 600,
      'text-anchor': o.anchor || 'start', fill: o.fill || COL.ink, 'font-style': o.italic ? 'italic' : null,
      'font-family': o.serif ? SERIF : null, opacity: o.opacity
    }, parent);
    t.textContent = str == null ? '' : String(str);
    return t;
  }
  K.T = T;
  K.say = (el, s) => { if (el && el.textContent !== String(s)) el.textContent = String(s); };
  K.show = (el, on) => { if (el) el.style.display = on ? '' : 'none'; };
  K.path = (pts, closed) => {
    if (!pts.length) return '';
    let d = 'M' + fx(pts[0][0]) + ' ' + fx(pts[0][1]);
    for (let i = 1; i < pts.length; i++) d += 'L' + fx(pts[i][0]) + ' ' + fx(pts[i][1]);
    return closed ? d + 'Z' : d;
  };
  K.pct = (v, d) => (isFinite(v) ? (v * 100).toFixed(d == null ? 1 : d) + ' %' : '–');
  K.num = (v, d) => (isFinite(v) ? v.toFixed(d == null ? 2 : d) : '–');

  // styles for the controls (C.css does nothing in node)
  C.css('figkit', [
    '.fk-t { font-family: ' + FONT + '; pointer-events: none; user-select: none; -webkit-user-select: none; }',
    '.fk-btn { cursor: pointer; color: #3a3020; }',
    '.fk-btn > rect { fill: #f8f0de; stroke: #c9b68c; stroke-width: 1.3; transition: fill .12s, stroke .12s; }',
    '.fk-btn:hover > rect { fill: #fffaf0; stroke: #a8915f; }',
    '.fk-btn:active > rect { fill: #efe2c3; }',
    '.fk-btn.primary { color: #fff; }',
    '.fk-btn.primary > rect { fill: #3a6ea5; stroke: #2d5886; }',
    '.fk-btn.primary:hover > rect { fill: #4a7db6; }',
    '.fk-btn.gold > rect { fill: #f4d27a; stroke: #b98f2a; }',
    '.fk-btn.gold:hover > rect { fill: #f8dc93; }',
    '.fk-btn.on { color: #fbf8ef; }',
    '.fk-btn.on > rect { fill: #5c4e36; stroke: #3a3020; }',
    '.fk-btn.off { opacity: .4; cursor: default; }',
    '.fk-btn text { fill: currentColor; }',
    '.fk-seg { cursor: pointer; }',
    '.fk-seg > rect { fill: transparent; transition: fill .12s; }',
    '.fk-seg:hover > rect { fill: rgba(92,78,54,.1); }',
    '.fk-seg.on > rect { fill: #5c4e36; }',
    '.fk-seg.on text { fill: #fbf8ef; }',
    '.fk-knob, .fk-drag { cursor: grab; }',
    '.fk-knob:active, .fk-drag:active { cursor: grabbing; }',
    '.fk-hit { cursor: pointer; }',
    '.fk-drag:hover { filter: brightness(1.06); }'
  ].join('\n'));

  const ICON = {
    play: '<path d="M2 .5 11.5 6 2 11.5Z" fill="currentColor"/>',
    pause: '<path d="M1.5 .5h3.3v11H1.5zM7.2 .5h3.3v11H7.2z" fill="currentColor"/>',
    step: '<path d="M.5 .5 7.5 6 .5 11.5zM8.5 .5h3v11h-3z" fill="currentColor"/>',
    fast: '<path d="M.3 .5 6 6 .3 11.5zM6 .5 11.7 6 6 11.5z" fill="currentColor"/>',
    reset: '<path d="M10.2 3.4A5 5 0 1 0 11 7.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 .4 11.5 5.4 7 3.4Z" fill="currentColor"/>',
    eye: '<path d="M.4 6Q6 -1.2 11.6 6Q6 13.2 .4 6Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="6" r="2.3" fill="currentColor"/>',
    cube: '<path d="M6 .4 11.2 3.2V8.8L6 11.6.8 8.8V3.2Z M.8 3.2 6 6 11.2 3.2 M6 6V11.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    dice: '<rect x=".8" y=".8" width="10.4" height="10.4" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="3.9" cy="3.9" r="1.25" fill="currentColor"/><circle cx="8.1" cy="8.1" r="1.25" fill="currentColor"/><circle cx="6" cy="6" r="1.25" fill="currentColor"/>',
    hand: '<path d="M3 11.5V5.5M3 5.5V1.8a1.1 1.1 0 0 1 2.2 0V5M5.2 5V1a1.1 1.1 0 0 1 2.2 0v4.2M7.4 5.2V1.8a1.1 1.1 0 0 1 2.2 0v5.4c0 2.4-1.4 4.3-3.6 4.3H4.8c-1 0-1.8-.7-2.3-1.6L.6 6.8a1 1 0 0 1 1.7-1Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    bolt: '<path d="M7 .3 1.5 7h4l-1 4.7L10.5 5h-4Z" fill="currentColor"/>'
  };
  K.ICON = ICON;

  /* ---------- pointer handling: only the select tool plays with figures ---------- */

  K.live = function (ctx, ev) {
    if (ev && ev.button != null && ev.button !== 0) return false;
    const wb = ctx && ctx.wb;
    if (!wb) return true;
    if (wb.spaceDown || wb.is3D) return false;
    return wb.mode == null || wb.mode === 'select';
  };
  K.onPress = function (el, ctx, fn) {
    el.addEventListener('pointerdown', (ev) => {
      if (!K.live(ctx, ev)) return;
      ev.stopPropagation();
      ev.preventDefault();
      fn(ev);
    });
  };
  // a point of the pointer in the coordinates of group g
  K.local = function (g, ev) {
    const m = g.getScreenCTM && g.getScreenCTM();
    if (!m) return [0, 0];
    const inv = m.inverse();
    return [inv.a * ev.clientX + inv.c * ev.clientY + inv.e, inv.b * ev.clientX + inv.d * ev.clientY + inv.f];
  };
  // drag: h = { start(pt, ev) -> false to refuse, move(pt, ev), end(pt, ev) }; points in g's coordinates
  K.onDrag = function (el, g, ctx, h) {
    el.addEventListener('pointerdown', (ev) => {
      if (!K.live(ctx, ev)) return;
      ev.stopPropagation();
      ev.preventDefault();
      const pt = K.local(g, ev);
      if (h.start && h.start(pt, ev) === false) return;
      try { el.setPointerCapture(ev.pointerId); } catch (e) { /* not supported */ }
      const mv = (e) => { if (e.pointerId !== ev.pointerId) return; e.stopPropagation(); if (h.move) h.move(K.local(g, e), e); };
      const up = (e) => {
        if (e.pointerId !== ev.pointerId) return;
        e.stopPropagation();
        el.removeEventListener('pointermove', mv);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        if (h.end) h.end(K.local(g, e), e);
      };
      el.addEventListener('pointermove', mv);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  };

  // figure time runs faster when the self-test shrinks C.animScale
  K.speed = () => 1 / Math.max(0.02, C.animScale == null ? 1 : C.animScale);
  const raf = (f) => (root.requestAnimationFrame ? root.requestAnimationFrame(f) : setTimeout(() => f(Date.now()), 16));
  const now = () => (root.performance ? root.performance.now() : Date.now());

  /* ---------- the frame ---------- */

  K.frame = function (g, ctx, o) {
    o = o || {};
    const w = o.w || 620, h = o.h || 360, rows = o.bar == null ? 1 : o.bar;
    const F = { g, ctx, w, h, rows, loops: [], timers: [], ends: [], solvedFns: [], dead: false, solved: false, K };
    F.barH = rows ? rows * 38 + 10 : 0;
    F.sh = h - F.barH;
    F.back = S('g', { class: 'fk-back' }, g);
    F.scene = S('g', { class: 'fk-scene' }, g);
    F.fore = S('g', { class: 'fk-fore' }, g);
    F.ui = S('g', { class: 'fk-ui' }, g);
    if (rows) S('rect', { x: 8, y: F.sh, width: w - 16, height: F.barH - 8, rx: 12, fill: COL.bar, stroke: COL.line, 'stroke-width': 1.2 }, F.ui);
    let cx = 18, row = 0;
    F.slot = function (wid) {
      if (cx + wid > w - 16 && cx > 18 && row < rows - 1) { row++; cx = 18; }
      const at = [cx, F.sh + 4 + row * 38];
      cx += wid + 8;
      return at;
    };
    F.newRow = function () { if (row < rows - 1) { row++; cx = 18; } };
    F.gap = function (n) { cx += n; };
    // a line of text at the right end of a bar row
    F.note = function (r, o2) {
      return T(F.ui, w - 22, F.sh + 4 + (r || 0) * 38 + 20, '', Object.assign({ anchor: 'end', size: 13, fill: COL.ink2 }, o2 || {}));
    };
    F.button = (label, fn, o2) => K.button(F, label, fn, o2);
    F.slider = (o2) => K.slider(F, o2);
    F.seg = (o2) => K.seg(F, o2);
    F.text = (x, y, s, o2) => T((o2 && o2.parent) || F.scene, x, y, s, o2);

    F.loop = function (tick) {
      const L = { running: false, id: 0, last: 0 };
      const frame = (t) => {
        L.id = 0;
        if (!L.running || F.dead) return;
        let dt = (t - L.last) / 1000;
        L.last = t;
        if (!(dt > 0)) dt = 0;
        dt = Math.min(dt, 0.1) * K.speed();
        let more;
        try { more = tick(dt); } catch (e) { L.running = false; F.sync(); throw e; }
        if (more === false) { L.running = false; F.sync(); return; }
        L.id = raf(frame);
      };
      L.start = function () {
        if (L.running || F.dead) return;
        L.running = true;
        L.last = now();
        L.id = raf(frame);
        F.sync();
      };
      L.stop = function () {
        if (!L.running) return;
        L.running = false;
        if (L.id && root.cancelAnimationFrame) root.cancelAnimationFrame(L.id);
        L.id = 0;
        F.sync();
      };
      L.toggle = () => (L.running ? L.stop() : L.start());
      F.loops.push(L);
      return L;
    };
    // a one-off animation: fn(eased t) over ms (scaled by C.anim), then done()
    F.tween = function (ms, fn, done, raw) {
      if (C.tween) {
        // the core tween always finishes, even in a hidden tab
        let stop = null;
        const L0 = { running: true, stop() { if (stop) stop(); L0.running = false; F.sync(); }, start() {}, toggle() {} };
        stop = C.tween(C.anim ? C.anim(ms) : ms, (t) => { if (!F.dead) fn(t); }, () => { L0.running = false; if (!F.dead) { if (done) done(); F.sync(); } }, raw ? 'linear' : undefined);
        F.ends.push(() => { if (stop) stop(); });
        return L0;
      }
      const dur = Math.max(1, ms) / 1000;
      let t = 0;
      const L = F.loop((dt) => {
        t += dt;
        const u = Math.min(1, t / dur);
        fn(raw ? u : ease(u));
        if (u >= 1) { if (done) done(); return false; }
        return true;
      });
      L.start();
      return L;
    };
    F.after = function (ms, fn) {
      const id = setTimeout(() => { F.timers = F.timers.filter((x) => x !== id); if (!F.dead) fn(); }, C.anim ? C.anim(ms) : ms);
      F.timers.push(id);
      return id;
    };
    F.sync = function () { if (F.onSync && !F.dead) F.onSync(); };
    F.onEnd = (fn) => F.ends.push(fn);

    // the answer: watch the answer box for a right answer (the engine does not tell figures)
    F.whenSolved = function (fn) { F.solvedFns.push(fn); if (F.solved) fn(); };
    F.markSolved = function () {
      if (F.solved || F.dead) return;
      F.solved = true;
      F.solvedFns.slice().forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    };
    try { if (C.progress && ctx && ctx.p && C.progress.solved(ctx.p.id)) F.solved = true; } catch (e) { /* no progress store */ }
    const host = ctx && ctx.answerHost;
    if (host && root.MutationObserver) {
      F.mo = new root.MutationObserver(() => { if (host.querySelector('.ans.done')) F.markSolved(); });
      F.mo.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    }

    F.destroy = function () {
      if (F.dead) return;
      F.dead = true;
      F.loops.forEach((L) => { L.running = false; if (L.id && root.cancelAnimationFrame) root.cancelAnimationFrame(L.id); });
      F.timers.forEach((id) => clearTimeout(id));
      if (F.mo) F.mo.disconnect();
      F.ends.forEach((fn) => { try { fn(); } catch (e) { /* closing anyway */ } });
    };
    F.inst = function (i) {
      i = i || {};
      return {
        solve() { F.markSolved(); if (i.solve) i.solve(); },
        getState() { return i.getState ? i.getState() : null; },
        setState(s) { if (s != null && i.setState) { try { i.setState(s); } catch (e) { console.warn('figure state ignored', e); } } },
        destroy() { F.destroy(); if (i.destroy) i.destroy(); }
      };
    };
    return F;
  };

  /* ---------- controls ---------- */

  K.button = function (F, label, fn, o) {
    o = o || {};
    label = label || '';
    const tw = label.length * 7.4;
    const wid = o.w || Math.max(34, Math.round(tw + (o.icon ? (label ? 40 : 34) : 26)));
    const at = o.at || F.slot(wid);
    const b = S('g', { class: 'fk-btn' + (o.primary ? ' primary' : '') + (o.cls ? ' ' + o.cls : ''), transform: tr(at[0], at[1]) }, o.parent || F.ui);
    if (o.title) S('title', { text: o.title }, b);
    S('rect', { x: 0, y: 0, width: wid, height: 30, rx: 15 }, b);
    const ic = S('g', { transform: tr(label ? 13 : wid / 2 - 6, 9) }, b);
    const tx = T(b, o.icon ? (label ? 31 + (wid - 31 - 12) / 2 : 0) : wid / 2, 20, label, { anchor: 'middle', size: 13, fill: 'currentColor' });
    const api = {
      el: b, w: wid, at, disabled: false,
      label(s) { tx.textContent = s; },
      icon(name) { ic.innerHTML = ICON[name] || ''; },
      disable(on) { api.disabled = !!on; b.classList.toggle('off', !!on); },
      on(v) { b.classList.toggle('on', !!v); },
      hide(v) { b.style.display = v ? 'none' : ''; },
      title(s) { let t = b.querySelector('title'); if (!t) t = S('title', null, b); t.textContent = s; }
    };
    if (o.icon) api.icon(o.icon);
    K.onPress(b, F.ctx, (ev) => { if (!api.disabled && !F.dead) fn(ev); });
    return api;
  };

  K.slider = function (F, o) {
    const tw = o.w || 120;
    const lw = o.lw != null ? o.lw : Math.max(20, Math.round((o.label || '').length * 7 + 8));
    const vw = o.vw != null ? o.vw : 46;
    const wid = lw + tw + vw + 18;
    const at = o.at || F.slot(wid);
    const gg = S('g', { transform: tr(at[0], at[1]), class: 'fk-slider' }, o.parent || F.ui);
    if (o.label) T(gg, 0, 20, o.label, { size: 13, fill: COL.ink2 });
    const x0 = lw + 8, x1 = x0 + tw;
    const hit = S('rect', { x: x0 - 9, y: 2, width: tw + 18, height: 26, fill: 'transparent', class: 'fk-hit' }, gg);
    S('line', { x1: x0, y1: 15, x2: x1, y2: 15, stroke: '#d3c29b', 'stroke-width': 4, 'stroke-linecap': 'round' }, gg);
    const fill = S('line', { x1: x0, y1: 15, x2: x0, y2: 15, stroke: o.color || COL.blue, 'stroke-width': 4, 'stroke-linecap': 'round' }, gg);
    const knob = S('circle', { cx: x0, cy: 15, r: 8.5, fill: '#fff', stroke: o.color || COL.blue, 'stroke-width': 2.2, class: 'fk-knob' }, gg);
    const val = T(gg, x1 + 11, 20, '', { size: 13, weight: 700 });
    const fmt = o.fmt || ((v) => String(v));
    const api = { value: o.value, disabled: false, el: gg, w: wid };
    function place() {
      const t = (api.value - o.min) / (o.max - o.min);
      const x = x0 + clamp(t, 0, 1) * tw;
      knob.setAttribute('cx', fx(x));
      fill.setAttribute('x2', fx(x));
      val.textContent = fmt(api.value);
    }
    api.set = function (v, silent) {
      v = clamp(+v, o.min, o.max);
      if (o.step) v = Math.round((v - o.min) / o.step) * o.step + o.min;
      v = +v.toFixed(6);
      const changed = v !== api.value;
      api.value = v;
      place();
      if (changed && !silent && o.onInput) o.onInput(v);
    };
    const at2v = (p) => o.min + (p[0] - x0) / tw * (o.max - o.min);
    const drag = {
      start(p) { if (api.disabled || F.dead) return false; api.set(at2v(p)); },
      move(p) { api.set(at2v(p)); },
      end() { if (o.onChange) o.onChange(api.value); }
    };
    K.onDrag(hit, gg, F.ctx, drag);
    K.onDrag(knob, gg, F.ctx, drag);
    api.disable = (on) => { api.disabled = !!on; gg.style.opacity = on ? 0.45 : ''; };
    place();
    return api;
  };

  // a row of pills, one of them on: o = { options: [[value, label], ...], value, onChange(v) }
  K.seg = function (F, o) {
    const items = o.options.map((x) => ({ v: x[0], l: x[1], w: Math.max(32, Math.round(x[1].length * 7.3 + 22)) }));
    const wid = items.reduce((s, it) => s + it.w, 0) + 4;
    const at = o.at || F.slot(wid);
    const gg = S('g', { transform: tr(at[0], at[1]) }, o.parent || F.ui);
    S('rect', { x: 0, y: 0, width: wid, height: 30, rx: 15, fill: '#f8f0de', stroke: '#c9b68c', 'stroke-width': 1.3 }, gg);
    const api = { value: o.value, el: gg, w: wid, disabled: false };
    let x = 2;
    items.forEach((it) => {
      it.g = S('g', { class: 'fk-seg', transform: tr(x, 0) }, gg);
      S('rect', { x: 0, y: 2, width: it.w, height: 26, rx: 13 }, it.g);
      T(it.g, it.w / 2, 20, it.l, { anchor: 'middle', size: 13 });
      K.onPress(it.g, F.ctx, () => { if (!api.disabled && !F.dead) api.set(it.v); });
      x += it.w;
    });
    api.set = function (v, silent) {
      const changed = v !== api.value;
      api.value = v;
      items.forEach((it) => it.g.classList.toggle('on', it.v === v));
      if (changed && !silent && o.onChange) o.onChange(v);
    };
    api.disable = (on) => { api.disabled = !!on; gg.style.opacity = on ? 0.45 : ''; };
    api.set(o.value, true);
    return api;
  };

  // the usual Play / Pause button bound to a loop
  K.playButton = function (F, L, o) {
    o = o || {};
    const b = F.button(o.label || 'Play', () => { if (o.onPress) o.onPress(); else L.toggle(); }, { icon: 'play', primary: true, w: o.w || 84 });
    const sync = () => { b.icon(L.running ? 'pause' : 'play'); b.label(L.running ? (o.pauseLabel || 'Pause') : (o.label || 'Play')); };
    const prev = F.onSync;
    F.onSync = () => { if (prev) prev(); sync(); };
    sync();
    return b;
  };

  /* ---------- drawing helpers ---------- */

  K.arrow = function (parent, color, width, o) {
    o = o || {};
    const g = S('g', { class: 'fk-arrow', opacity: o.opacity }, parent);
    const ln = S('line', { stroke: color, 'stroke-width': width || 3, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null }, g);
    const hd = S('path', { fill: color }, g);
    const api = {
      g,
      set(x1, y1, x2, y2) {
        const L = Math.hypot(x2 - x1, y2 - y1);
        if (L < 1.5) { g.style.display = 'none'; return api; }
        g.style.display = '';
        const ux = (x2 - x1) / L, uy = (y2 - y1) / L, hs = Math.min(L * 0.6, o.head || (width || 3) * 2.8 + 5);
        const bx = x2 - ux * hs, by = y2 - uy * hs;
        set(ln, { x1, y1, x2: bx + ux, y2: by + uy });
        hd.setAttribute('d', 'M' + fx(x2) + ' ' + fx(y2) + 'L' + fx(bx - uy * hs * 0.52) + ' ' + fx(by + ux * hs * 0.52) + 'L' + fx(bx + uy * hs * 0.52) + ' ' + fx(by - ux * hs * 0.52) + 'Z');
        return api;
      },
      hide() { g.style.display = 'none'; return api; },
      color(c) { ln.setAttribute('stroke', c); hd.setAttribute('fill', c); return api; }
    };
    return api;
  };
  // a static arrow in one call
  K.arrowAt = (parent, x1, y1, x2, y2, color, width, o) => K.arrow(parent, color, width, o).set(x1, y1, x2, y2);

  K.table = function (parent, x0, x1, y, o) {
    o = o || {};
    const g = S('g', null, parent);
    S('rect', { x: x0, y, width: x1 - x0, height: o.th || 14, rx: 3, fill: o.fill || COL.table, stroke: COL.tableDark, 'stroke-width': 1.5 }, g);
    S('line', { x1: x0 + 4, y1: y + 4, x2: x1 - 4, y2: y + 4, stroke: '#e8d4b0', 'stroke-width': 1.5 }, g);
    return g;
  };
  K.ground = function (parent, x0, x1, y, o) {
    o = o || {};
    const g = S('g', null, parent);
    S('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: o.color || COL.ink2, 'stroke-width': o.sw || 2.5 }, g);
    if (o.hatch !== false) for (let x = x0 + 4; x < x1; x += 12) S('line', { x1: x, y1: y + 1, x2: x - 7, y2: y + 8, stroke: COL.faint, 'stroke-width': 1.4 }, g);
    return g;
  };
  // a coin seen from above
  K.coin = function (parent, x, y, r, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y) }, parent);
    const fill = o.fill || '#e9c46a', rim = o.rim || '#9c7414';
    S('circle', { r, fill, stroke: rim, 'stroke-width': Math.max(1.2, r * 0.08) }, g);
    S('circle', { r: r * 0.84, fill: 'none', stroke: o.inner || 'rgba(120,85,10,.35)', 'stroke-width': Math.max(0.8, r * 0.04) }, g);
    let lab = null;
    if (o.label != null) lab = T(g, 0, r * 0.36, o.label, { anchor: 'middle', size: r * 1.0, weight: 800, fill: o.labelFill || 'rgba(110,78,10,.8)', serif: true });
    return { g, lab, move(x2, y2, rot) { g.setAttribute('transform', tr(x2, y2, rot)); }, label(s) { if (lab) lab.textContent = s; } };
  };
  K.dieFace = function (v) {
    const P = { 1: [[0.5, 0.5]], 2: [[0.27, 0.27], [0.73, 0.73]], 3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]], 4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], 5: [[0.26, 0.26], [0.74, 0.26], [0.5, 0.5], [0.26, 0.74], [0.74, 0.74]], 6: [[0.27, 0.24], [0.73, 0.24], [0.27, 0.5], [0.73, 0.5], [0.27, 0.76], [0.73, 0.76]] };
    return P[v] || [];
  };
  // a die seen from above: api.set(value), api.move(x, y, rot)
  K.die = function (parent, x, y, s, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y) }, parent);
    S('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.18, fill: o.fill || '#fffdf6', stroke: o.stroke || COL.ink, 'stroke-width': Math.max(1.2, s * 0.05) }, g);
    const pips = S('g', null, g);
    const api = {
      g, value: 0,
      set(v) {
        if (v === api.value) return;
        api.value = v;
        pips.innerHTML = '';
        if (o.faces) { T(pips, 0, s * 0.2, o.faces[v - 1], { anchor: 'middle', size: s * 0.56, weight: 800, fill: o.pip || COL.ink }); return; }
        K.dieFace(v).forEach((p) => S('circle', { cx: (p[0] - 0.5) * s, cy: (p[1] - 0.5) * s, r: s * 0.085, fill: o.pip || COL.ink }, pips));
      },
      text(str) { api.value = -1; pips.innerHTML = ''; T(pips, 0, s * 0.2, str, { anchor: 'middle', size: s * 0.56, weight: 800, fill: o.pip || COL.ink }); },
      move(x2, y2, rot) { g.setAttribute('transform', tr(x2, y2, rot)); }
    };
    if (o.value) api.set(o.value);
    return api;
  };
  // a playing card: rank 'A', '7' …, suit '♠♥♦♣'
  K.card = function (parent, x, y, w, h, rank, suit, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y) }, parent);
    const red = suit === '♥' || suit === '♦';
    const face = S('g', null, g), back = S('g', null, g);
    S('rect', { x: 0, y: 0, width: w, height: h, rx: w * 0.1, fill: '#fffdf8', stroke: COL.ink2, 'stroke-width': 1.3 }, face);
    T(face, w * 0.12, h * 0.24, rank, { size: w * 0.28, weight: 800, fill: red ? COL.red : COL.ink });
    T(face, w / 2, h * 0.68, suit, { anchor: 'middle', size: w * 0.52, weight: 400, fill: red ? COL.red : COL.ink });
    S('rect', { x: 0, y: 0, width: w, height: h, rx: w * 0.1, fill: '#3a6ea5', stroke: COL.ink2, 'stroke-width': 1.3 }, back);
    S('rect', { x: w * 0.12, y: h * 0.1, width: w * 0.76, height: h * 0.8, rx: w * 0.06, fill: 'none', stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1.2 }, back);
    const api = {
      g,
      up(on) { face.style.display = on ? '' : 'none'; back.style.display = on ? 'none' : ''; },
      move(x2, y2, rot) { g.setAttribute('transform', tr(x2, y2, rot)); }
    };
    api.up(o.up !== false);
    return api;
  };
  // a child: sex 'B' or 'G' (drawn simply: head, body, a bow for a girl)
  K.kid = function (parent, x, y, s, sex, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y), opacity: o.opacity }, parent);
    const c = sex === 'G' ? COL.pink : COL.blue;
    S('path', { d: 'M' + fx(-s * 0.36) + ' ' + fx(s * 0.95) + 'Q' + fx(-s * 0.36) + ' ' + fx(s * 0.2) + ' 0 ' + fx(s * 0.2) + 'Q' + fx(s * 0.36) + ' ' + fx(s * 0.2) + ' ' + fx(s * 0.36) + ' ' + fx(s * 0.95) + 'Z', fill: c, stroke: COL.ink, 'stroke-width': 1.2 }, g);
    S('circle', { cx: 0, cy: 0, r: s * 0.22, fill: COL.skin, stroke: COL.ink, 'stroke-width': 1.2 }, g);
    if (sex === 'G') S('path', { d: 'M' + fx(s * 0.1) + ' ' + fx(-s * 0.2) + 'l' + fx(s * 0.18) + ' ' + fx(-s * 0.1) + 'v' + fx(s * 0.2) + 'Zm0 0l' + fx(-s * 0.02) + ' ' + fx(-s * 0.02), fill: COL.red, stroke: COL.red, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    if (o.label) T(g, 0, s * 1.25, o.label, { anchor: 'middle', size: Math.max(10, s * 0.32), fill: COL.ink2 });
    return g;
  };
  // a glass tumbler, open at the top; returns the group
  K.glass = function (parent, x, y, w, h, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y) }, parent);
    const t = o.taper == null ? w * 0.08 : o.taper;
    S('path', { d: 'M0 0L' + fx(t) + ' ' + h + 'H' + fx(w - t) + 'L' + w + ' 0', fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
    S('line', { x1: t + 3, y1: h - 3, x2: w - t - 3, y2: h - 3, stroke: COL.glassLine, 'stroke-width': 3, opacity: 0.5 }, g);
    S('line', { x1: w * 0.18, y1: h * 0.12, x2: w * 0.2 + t * 0.3, y2: h * 0.8, stroke: '#fff', 'stroke-width': 2.5, opacity: 0.6, 'stroke-linecap': 'round' }, g);
    return g;
  };
  // a candle: api.flame(on, size), api.move(x, y)
  K.candle = function (parent, x, y, h, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y) }, parent);
    const w = o.w || 16;
    S('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 2, fill: o.fill || '#f6efe0', stroke: COL.ink2, 'stroke-width': 1.3 }, g);
    S('line', { x1: 0, y1: -h, x2: 0, y2: -h - 6, stroke: COL.ink, 'stroke-width': 1.6 }, g);
    const fl = S('g', { transform: tr(0, -h - 6) }, g);
    S('path', { d: 'M0 -26C9 -14 8 -3 0 0C-8 -3 -9 -14 0 -26Z', fill: '#ffcf4a', opacity: 0.95 }, fl);
    S('path', { d: 'M0 -15C4 -9 4 -3 0 -1C-4 -3 -4 -9 0 -15Z', fill: '#fff6c8' }, fl);
    return {
      g, fl,
      flame(on, s) { fl.style.display = on ? '' : 'none'; if (on) fl.setAttribute('transform', tr(0, -h - 6, 0, s == null ? 1 : s)); }
    };
  };
  // wavy water surface path between x0 and x1 at level y, down to the bottom yb
  K.waterPath = function (x0, x1, y, yb, amp, phase) {
    const n = Math.max(2, Math.round((x1 - x0) / 12));
    let d = 'M' + fx(x0) + ' ' + fx(yb) + 'L' + fx(x0) + ' ' + fx(y);
    for (let i = 1; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n;
      d += 'L' + fx(x) + ' ' + fx(y + (amp || 0) * Math.sin(i * 1.3 + (phase || 0)));
    }
    return d + 'L' + fx(x1) + ' ' + fx(yb) + 'Z';
  };
  // a pointing hand (a simple mitten with a finger), pointing along +x; scaled by s
  K.hand = function (parent, x, y, s, rot, o) {
    o = o || {};
    const g = S('g', { transform: tr(x, y, rot, s) }, parent);
    S('path', { d: 'M-34 -10C-40 -10 -44 -6 -44 0C-44 6 -40 10 -34 10H-8C-4 10 -2 8 -2 5H10C13 5 15 3 15 0C15 -3 13 -5 10 -5H-6C-8 -9 -12 -11 -16 -10Z', fill: o.fill || COL.skin, stroke: COL.skinDark, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, g);
    S('path', { d: 'M-44 -8H-58V8H-44', fill: o.sleeve || '#8fa7c9', stroke: '#5f7598', 'stroke-width': 1.5 }, g);
    return { g, move(x2, y2, r2) { g.setAttribute('transform', tr(x2, y2, r2 == null ? rot : r2, s)); } };
  };

  /* ---------- charts ---------- */

  // how a running frequency settles: log-scaled trials across, frequency up
  K.conv = function (parent, o) {
    const g = S('g', { transform: tr(o.x, o.y) }, parent);
    const w = o.w, h = o.h, ymin = o.ymin == null ? 0 : o.ymin, ymax = o.ymax == null ? 1 : o.ymax;
    let nmax = o.nmax || 1000;
    S('rect', { x: 0, y: 0, width: w, height: h, fill: '#fffdf8', stroke: COL.line, 'stroke-width': 1.2, rx: 4 }, g);
    const grid = S('g', null, g), tgtG = S('g', null, g), lines = S('g', null, g);
    const Y = (v) => h - (clamp(v, ymin, ymax) - ymin) / (ymax - ymin) * h;
    const X = (n) => Math.log10(Math.max(1, n)) / Math.log10(nmax) * w;
    const series = (o.series || [{ color: COL.blue }]).map((s) => ({ color: s.color, label: s.label, pts: [], lastLog: -1, el: S('path', { fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round' }, lines) }));
    function drawGrid() {
      grid.innerHTML = '';
      const ticks = o.yticks || [ymin, (ymin + ymax) / 2, ymax];
      ticks.forEach((v) => {
        S('line', { x1: 0, y1: Y(v), x2: w, y2: Y(v), stroke: COL.line, 'stroke-width': 1 }, grid);
        T(grid, -4, Y(v) + 4, o.yfmt ? o.yfmt(v) : String(v), { anchor: 'end', size: 10, fill: COL.muted, weight: 500 });
      });
      for (let n = 1; n <= nmax; n *= 10) {
        S('line', { x1: X(n), y1: h, x2: X(n), y2: h + 3, stroke: COL.muted, 'stroke-width': 1 }, grid);
        T(grid, X(n), h + 13, n >= 1000 ? (n / 1000) + 'k' : String(n), { anchor: 'middle', size: 10, fill: COL.muted, weight: 500 });
      }
      if (o.xlabel) T(grid, w, h + 25, o.xlabel, { anchor: 'end', size: 10, fill: COL.muted, weight: 500 });
    }
    function redraw() { series.forEach((s) => s.el.setAttribute('d', K.path(s.pts.map((p) => [X(p[0]), Y(p[1])])))); }
    drawGrid();
    let target = null, targets = null;
    const drawTargets = () => {
      if (!targets) return;
      tgtG.innerHTML = '';
      targets.forEach((q, i) => {
        if (q.v == null || !isFinite(q.v)) return;
        S('line', { x1: 0, y1: Y(q.v), x2: w, y2: Y(q.v), stroke: q.color || COL.red, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, tgtG);
        if (q.label) T(tgtG, w - 4 - i * 0, Y(q.v) + (q.below ? 13 : -5), q.label, { anchor: 'end', size: 11, fill: q.color || COL.red, weight: 700 });
      });
    };
    const api = {
      g,
      targets(list) { targets = list; target = null; drawTargets(); },
      push(si, n, v) {
        const s = series[si || 0];
        if (!isFinite(v)) return;
        if (n > nmax) { while (n > nmax) nmax *= 10; drawGrid(); if (target) api.target(target.v, target.label, target.color); drawTargets(); redraw(); }
        const lg = Math.log10(Math.max(1, n));
        if (lg - s.lastLog < 0.004 && s.pts.length) { s.pts[s.pts.length - 1] = [n, v]; } else { s.pts.push([n, v]); s.lastLog = lg; }
        s.dirty = true;
      },
      flush() { series.forEach((s) => { if (s.dirty) { s.el.setAttribute('d', K.path(s.pts.map((p) => [X(p[0]), Y(p[1])]))); s.dirty = false; } }); },
      reset() { nmax = o.nmax || 1000; series.forEach((s) => { s.pts = []; s.lastLog = -1; s.el.setAttribute('d', ''); }); drawGrid(); if (target) api.target(target.v, target.label, target.color); drawTargets(); },
      setRange(a, b) { o.ymin = a; o.ymax = b; },
      target(v, label, color) {
        target = { v, label, color };
        tgtG.innerHTML = '';
        S('line', { x1: 0, y1: Y(v), x2: w, y2: Y(v), stroke: color || COL.red, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, tgtG);
        if (label) T(tgtG, w - 4, Y(v) - 5, label, { anchor: 'end', size: 11, fill: color || COL.red, weight: 700 });
      },
      state() { return series.map((s) => s.pts.slice()); },
      load(st) { (st || []).forEach((pts, i) => { if (series[i]) { series[i].pts = pts.slice(); series[i].lastLog = pts.length ? Math.log10(Math.max(1, pts[pts.length - 1][0])) : -1; } }); let mx = 1; series.forEach((s) => s.pts.forEach((p) => { mx = Math.max(mx, p[0]); })); while (mx > nmax) nmax *= 10; drawGrid(); if (target) api.target(target.v, target.label, target.color); drawTargets(); redraw(); }
    };
    return api;
  };

  // bars with labels underneath: api.set(values) (fractions 0..1 or counts with total)
  K.bars = function (parent, o) {
    const g = S('g', { transform: tr(o.x, o.y) }, parent);
    const n = o.labels.length, w = o.w, h = o.h, gap = o.gap == null ? Math.max(1, w / n * 0.16) : o.gap, bw = w / n - gap;
    S('line', { x1: 0, y1: h, x2: w, y2: h, stroke: COL.ink2, 'stroke-width': 1.4 }, g);
    const tg = S('g', null, g);
    const items = o.labels.map((lab, i) => {
      const x = i * (w / n) + gap / 2;
      const r = S('rect', { x, y: h, width: bw, height: 0, rx: Math.min(3, bw / 4), fill: (o.colors && o.colors[i]) || o.color || COL.blue }, g);
      const lt = lab === '' || lab == null ? null : T(g, x + bw / 2, h + 14, lab, { anchor: 'middle', size: o.lsize || 11, fill: COL.ink2 });
      const vt = o.values === false ? null : T(g, x + bw / 2, h - 4, '', { anchor: 'middle', size: o.vsize || 10, fill: COL.ink2, weight: 600 });
      return { x, r, lt, vt };
    });
    let scaleMax = o.max || 0;
    const api = {
      g, items,
      set(vals, fmt) {
        const mx = o.max || Math.max(1e-9, ...vals) * 1.12;
        scaleMax = mx;
        vals.forEach((v, i) => {
          const bh = Math.max(0, v / mx * h);
          set(items[i].r, { y: h - bh, height: bh });
          if (items[i].vt) { K.say(items[i].vt, fmt ? fmt(v, i) : ''); items[i].vt.setAttribute('y', fx(h - bh - 4)); }
        });
        if (api.exactVals) api.exact(api.exactVals);
      },
      color(i, c) { items[i].r.setAttribute('fill', c); },
      exact(vals, color) {
        api.exactVals = vals;
        tg.innerHTML = '';
        if (!vals) return;
        vals.forEach((v, i) => {
          const y = h - v / scaleMax * h;
          S('line', { x1: items[i].x - 1, y1: y, x2: items[i].x + bw + 1, y2: y, stroke: color || COL.red, 'stroke-width': 2 }, tg);
        });
      }
    };
    return api;
  };

  /* ---------- a shared random source for experiments (not the puzzle's seeded rng) ---------- */

  K.rng = function () {
    const seed = (Date.now() ^ Math.floor(Math.random() * 4294967296)) >>> 0;
    return C.rng(seed);
  };

  /* ---------- 3D helpers ---------- */

  // a cylinder from a to b, in n pieces so the painter sorts it well
  K.cyl3 = function (v, a, b, r, color, o) {
    o = o || {};
    const n = o.n || 8, pts = [];
    for (let i = 0; i <= n; i++) pts.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, a[2] + (b[2] - a[2]) * i / n]);
    return v.tube(pts, r, color, Object.assign({ sides: o.sides || 12 }, o));
  };

  /* =====================================================================
   * PHYSICS: moving paradoxes
   * ===================================================================== */

  // the path of the centre of a coin rolling round fixed coins: arcs of circles
  K.rollPath = function (P) {
    const R = P.R || 1, r = P.r || 1, inside = !!P.inside;
    const fixed = P.fixed || [[0, 0]];
    const arcs = [];
    if (fixed.length === 1) {
      const rad = inside ? R - r : R + r;
      const a0 = P.start == null ? Math.PI / 2 : P.start;
      arcs.push({ c: fixed[0], rad, a0, a1: a0 + TAU });
    } else {
      // fixed coins in anticlockwise order round the outside; the rolling coin changes coin where it touches two
      const rad = R + r, n = fixed.length, sw = [];
      for (let i = 0; i < n; i++) {
        const a = fixed[i], b = fixed[(i + 1) % n];
        const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
        const hh = Math.sqrt(Math.max(0, rad * rad - d * d / 4));
        sw.push([(a[0] + b[0]) / 2 + dy / d * hh, (a[1] + b[1]) / 2 - dx / d * hh]);
      }
      for (let i = 0; i < n; i++) {
        const c = fixed[i], pIn = sw[(i - 1 + n) % n], pOut = sw[i];
        const a0 = Math.atan2(pIn[1] - c[1], pIn[0] - c[0]);
        let a1 = Math.atan2(pOut[1] - c[1], pOut[0] - c[0]);
        while (a1 <= a0) a1 += TAU;
        arcs.push({ c, rad, a0, a1 });
      }
    }
    let s = 0;
    arcs.forEach((a) => { a.s0 = s; a.len = a.rad * (a.a1 - a.a0); s += a.len; });
    const off = fixed.length > 1 ? arcs[0].len / 2 : 0;
    const path = { arcs, L: s, R, r, inside, sign: inside ? -1 : 1, off };
    path.at = function (u) {
      let v = (u + off) % s;
      if (v < 0) v += s;
      let a = arcs[arcs.length - 1];
      for (const q of arcs) if (v < q.s0 + q.len) { a = q; break; }
      const ang = a.a0 + (v - a.s0) / a.rad;
      return { x: a.c[0] + a.rad * Math.cos(ang), y: a.c[1] + a.rad * Math.sin(ang), ang, cx: a.c[0] + R * Math.cos(ang), cy: a.c[1] + R * Math.sin(ang) };
    };
    path.turns = (u) => u / (TAU * r);   // turns of the rolling coin, seen from the table
    return path;
  };

  C.figure('phys-coin-roll', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: P.h || 400, bar: 1 });
      const path = K.rollPath(P);
      const fixed = P.fixed || [[0, 0]], R = path.R, r = path.r;
      // fit the world (math axes, y up) into the scene
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let i = 0; i <= 240; i++) {
        const q = path.at(path.L * i / 240);
        x0 = Math.min(x0, q.x - r); x1 = Math.max(x1, q.x + r); y0 = Math.min(y0, q.y - r); y1 = Math.max(y1, q.y + r);
      }
      fixed.forEach((c) => { x0 = Math.min(x0, c[0] - R); x1 = Math.max(x1, c[0] + R); y0 = Math.min(y0, c[1] - R); y1 = Math.max(y1, c[1] + R); });
      const k = Math.min((F.w - 70) / (x1 - x0), (F.sh - 36) / (y1 - y0), 95);
      const ox = F.w / 2 - k * (x0 + x1) / 2, oy = F.sh / 2 + 4 + k * (y0 + y1) / 2;
      const X = (x) => ox + k * x, Y = (y) => oy - k * y;
      // centre path (faint), fixed coins, trace, rolling coin
      const pd = [];
      for (let i = 0; i <= 200; i++) { const q = path.at(path.L * i / 200); pd.push([X(q.x), Y(q.y)]); }
      S('path', { d: K.path(pd, true), fill: 'none', stroke: COL.faint, 'stroke-width': 1.3, 'stroke-dasharray': '3 5' }, F.scene);
      if (path.inside) {
        S('circle', { cx: X(fixed[0][0]), cy: Y(fixed[0][1]), r: k * R + 10, fill: '#d9dde5', stroke: COL.silverDark, 'stroke-width': 2 }, F.scene);
        S('circle', { cx: X(fixed[0][0]), cy: Y(fixed[0][1]), r: k * R, fill: '#fbf8ef', stroke: COL.silverDark, 'stroke-width': 2 }, F.scene);
      } else {
        fixed.forEach((c) => K.coin(F.scene, X(c[0]), Y(c[1]), k * R, { fill: COL.silver, rim: COL.silverDark, inner: 'rgba(80,90,110,.3)' }));
      }
      const trail = S('path', { fill: 'none', stroke: COL.red, 'stroke-width': 1.8, opacity: 0.75 }, F.scene);
      const spark = S('circle', { r: 3.2, fill: COL.orange }, F.scene);
      const coinG = S('g', null, F.scene);
      const cr = k * r;
      S('circle', { r: cr, fill: '#e9c46a', stroke: COL.goldDark, 'stroke-width': 2 }, coinG);
      S('circle', { r: cr * 0.84, fill: 'none', stroke: 'rgba(120,85,10,.35)', 'stroke-width': 1 }, coinG);
      // an arrow on the coin, like the head on a real coin (drawn along +x, turned with the coin)
      S('path', { d: 'M' + fx(-cr * 0.45) + ' 0H' + fx(cr * 0.5), stroke: COL.red, 'stroke-width': Math.max(2.5, cr * 0.12), 'stroke-linecap': 'round' }, coinG);
      S('path', { d: 'M' + fx(cr * 0.78) + ' 0L' + fx(cr * 0.38) + ' ' + fx(-cr * 0.24) + 'L' + fx(cr * 0.38) + ' ' + fx(cr * 0.24) + 'Z', fill: COL.red }, coinG);
      S('circle', { cx: -cr * 0.45, cy: 0, r: Math.max(2, cr * 0.08), fill: COL.red }, coinG);
      const note = F.note(0);
      let u = 0, trace = P.trace !== false, pts = [];
      const phi0 = path.at(0).ang;
      function draw() {
        const q = path.at(u);
        const phi = phi0 + path.sign * u / r;
        coinG.setAttribute('transform', tr(X(q.x), Y(q.y), -phi * 180 / Math.PI));
        set(spark, { cx: X(q.cx), cy: Y(q.cy) });
        const tip = [X(q.x + r * 0.78 * Math.cos(phi)), Y(q.y + r * 0.78 * Math.sin(phi))];
        if (!pts.length || Math.hypot(tip[0] - pts[pts.length - 1][0], tip[1] - pts[pts.length - 1][1]) > 1.5) pts.push(tip);
        trail.setAttribute('d', trace ? K.path(pts) : '');
        const turns = path.turns(u);
        K.say(note, 'Round trip ' + Math.round(u / path.L * 100) + ' %  ·  turns of the coin ' + turns.toFixed(2));
      }
      function rebuildTrail() { pts = []; const n = Math.ceil(u / path.L * 400); for (let i = 0; i <= n; i++) { const uu = Math.min(u, path.L * i / 400); const q = path.at(uu); const phi = phi0 + path.sign * uu / r; pts.push([X(q.x + r * 0.78 * Math.cos(phi)), Y(q.y + r * 0.78 * Math.sin(phi))]); } }
      const trip = P.seconds || 8;
      const L = F.loop((dt) => {
        u = Math.min(path.L, u + dt * path.L / trip);
        draw();
        return u < path.L;
      });
      K.playButton(F, L, { onPress() { if (!L.running && u >= path.L - 1e-9) { u = 0; pts = []; } L.toggle(); } });
      F.button('Step', () => {
        L.stop();
        if (u >= path.L - 1e-9) { u = 0; pts = []; }
        const from = u, to = Math.min(path.L, (Math.floor(u / (path.L / 8) + 1e-6) + 1) * path.L / 8);
        F.tween(700, (t) => { u = lerp(from, to, t); draw(); });
      }, { icon: 'step', title: 'An eighth of the way round' });
      F.button('', () => { L.stop(); u = 0; pts = []; draw(); }, { icon: 'reset', title: 'Back to the start' });
      const tb = F.button('Trace', () => { trace = !trace; tb.on(trace); draw(); }, { title: 'Draw the path of the arrow tip' });
      tb.on(trace);
      draw();
      return F.inst({
        solve() { L.stop(); u = 0; pts = []; L.start(); },
        getState: () => ({ u: +u.toFixed(4), trace }),
        setState(s) { u = clamp(+s.u || 0, 0, path.L); trace = s.trace !== false; tb.on(trace); rebuildTrail(); draw(); }
      });
    }
  });

  /* Aristotle's wheel: two circles fixed together, each on its own rail */
  C.figure('phys-aristotle', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 340, bar: 2 });
      let ratio = P.ratio || 0.5, mode = P.mode || 'big';
      const R = 62, x0 = 88, yG = F.sh - 40;
      const rails = S('g', null, F.scene), marks = S('g', null, F.scene), wheel = S('g', null, F.scene), over = S('g', null, F.scene);
      const COLS = ['#b0472f', '#d9772b', '#d9a520', '#4f7f3a', '#2a8f8a', '#3a6ea5', '#7d52d6', '#c24c85'];
      let d = 0, r = R * ratio;
      const skid = K.arrow(over, COL.red, 3);
      const skidT = T(over, 0, 0, '', { size: 12, fill: COL.red, anchor: 'middle', weight: 700 });
      const info1 = T(F.scene, 20, 22, '', { size: 13, fill: COL.ink2 });
      const info2 = T(F.scene, 20, 40, '', { size: 13, fill: COL.ink2 });
      function build() {
        r = R * ratio;
        rails.innerHTML = ''; wheel.innerHTML = '';
        K.ground(rails, 16, F.w - 16, yG);
        T(rails, F.w - 20, yG + 22, 'rail of the big wheel', { anchor: 'end', size: 11, fill: COL.muted });
        const yU = yG - (R - r);
        S('rect', { x: 16, y: yU, width: F.w - 32, height: 5, fill: '#8a5a26', rx: 2 }, rails);
        T(rails, F.w - 20, yU + 18, 'rail of the hub', { anchor: 'end', size: 11, fill: COL.woodDark });
        S('circle', { r: R, fill: '#e8cfa2', stroke: COL.woodDark, 'stroke-width': 3 }, wheel);
        for (let i = 0; i < 8; i++) { const a = i * TAU / 8; S('line', { x1: r * Math.cos(a), y1: r * Math.sin(a), x2: (R - 3) * Math.cos(a), y2: (R - 3) * Math.sin(a), stroke: COL.woodDark, 'stroke-width': 2 }, wheel); }
        S('circle', { r, fill: '#b98a50', stroke: '#6b4318', 'stroke-width': 2.5 }, wheel);
        S('circle', { r: 5, fill: COL.ink }, wheel);
        // coloured dots on both rims: dot k reaches the bottom after 1/8 turn more than dot k - 1
        // (a clockwise turn by a brings the point at (sin a, cos a) down to the bottom)
        for (let k = 0; k < 8; k++) {
          const a = k * TAU / 8;
          S('circle', { cx: R * Math.sin(a), cy: R * Math.cos(a), r: 5, fill: COLS[k], stroke: '#fff', 'stroke-width': 1 }, wheel);
          S('circle', { cx: r * Math.sin(a), cy: r * Math.cos(a), r: 4.2, fill: COLS[k], stroke: '#fff', 'stroke-width': 1 }, wheel);
        }
      }
      function dist() { return TAU * (mode === 'big' ? R : r); }
      function draw() {
        const rr = mode === 'big' ? R : r, th = d / rr;   // clockwise turn
        const cx = x0 + d, cy = yG - R;
        wheel.setAttribute('transform', tr(cx, cy, th * 180 / Math.PI));
        marks.innerHTML = '';
        const yU = yG - (R - r);
        // rims unrolled so far: the tape each rim has laid on its rail
        S('line', { x1: x0, y1: yG - 2, x2: x0 + R * th, y2: yG - 2, stroke: COL.blue, 'stroke-width': 4, opacity: 0.35 }, marks);
        S('line', { x1: x0, y1: yU - 2, x2: x0 + r * th, y2: yU - 2, stroke: COL.blue, 'stroke-width': 4, opacity: 0.35 }, marks);
        for (let k = 0; k < 8; k++) {
          const at = k * TAU / 8;
          if (at > th + 1e-9) break;
          const x = x0 + rr * at;
          S('path', { d: 'M' + fx(x) + ' ' + fx(yG) + 'l-4 7h8Z', fill: COLS[k] }, marks);
          S('path', { d: 'M' + fx(x) + ' ' + fx(yU + 5) + 'l-4 7h8Z', fill: COLS[k] }, marks);
        }
        // the slipping contact
        const slip = mode === 'big' ? 1 - r / R : 1 - R / r;   // speed of the other rim's contact point over its rail, per unit speed
        const sy = mode === 'big' ? yU + 14 : yG + 16;
        const L2 = slip * 46;
        if (d > 0.5 && d < dist() - 0.5) {
          skid.set(cx, sy, cx + L2, sy);
          set(skidT, { x: cx + L2 + (L2 > 0 ? 8 : -8), y: sy + 4 });
          skidT.setAttribute('text-anchor', L2 > 0 ? 'start' : 'end');
          K.say(skidT, mode === 'big' ? 'skids forward' : 'skids backward');
        } else { skid.hide(); K.say(skidT, ''); }
        const cm = (v) => Math.round(v / R * 50);   // the big wheel is 50 cm in radius
        K.say(info1, 'Ground covered: ' + cm(d) + ' cm   ·   big rim laid down: ' + cm(R * th) + ' cm   ·   hub rim laid down: ' + cm(r * th) + ' cm');
        K.say(info2, (mode === 'big' ? 'The big wheel rolls without slipping.' : 'The hub rolls without slipping on its rail.') + '  Blue bands: rim that has touched its rail.');
      }
      const L = F.loop((dt) => { d = Math.min(dist(), d + dt * dist() / 5); draw(); return d < dist(); });
      K.playButton(F, L, { label: 'Roll', onPress() { if (!L.running && d >= dist() - 1e-6) d = 0; L.toggle(); } });
      F.button('', () => { L.stop(); d = 0; draw(); }, { icon: 'reset', title: 'Back to the start' });
      const seg = F.seg({ options: [['big', 'Big wheel rolls'], ['small', 'Hub rolls']], value: mode, onChange(v) { mode = v; L.stop(); d = 0; draw(); } });
      F.newRow();
      const sl = F.slider({ label: 'Hub size', min: 0.25, max: 0.85, step: 0.05, value: ratio, w: 150, fmt: (v) => Math.round(v * 100) + ' % of the wheel', vw: 130, onInput(v) { ratio = v; L.stop(); d = 0; build(); draw(); } });
      build();
      draw();
      return F.inst({
        solve() { L.stop(); d = 0; L.start(); },
        getState: () => ({ d: +d.toFixed(2), mode, ratio }),
        setState(s) { mode = s.mode || mode; ratio = s.ratio || ratio; seg.set(mode, true); sl.set(ratio, true); build(); d = clamp(+s.d || 0, 0, dist()); draw(); }
      });
    }
  });

  /* A rolling wheel: speeds of its points, and the flange of a train wheel */
  C.figure('phys-cycloid', {
    draw(g, P, ctx) {
      const flange = P.mode === 'flange';
      const F = K.frame(g, ctx, { w: 620, h: P.h || (flange ? 320 : 270), bar: 1 });
      const R = flange ? 50 : 46, Rp = flange ? 68 : R, yG = F.sh - (flange ? 58 : 30), x0 = 76;
      const turns = flange ? 1.25 : 1.5, D = TAU * R * turns;
      const back = S('g', null, F.scene), trailG = S('g', null, F.scene), wheel = S('g', null, F.scene), top = S('g', null, F.scene);
      if (flange) {
        S('rect', { x: 16, y: yG, width: F.w - 32, height: 16, fill: '#9aa1b3', stroke: '#5d6475', 'stroke-width': 1.5 }, back);
        S('rect', { x: 16, y: yG + 16, width: F.w - 32, height: 26, fill: '#b9bfcc', stroke: '#5d6475', 'stroke-width': 1.2 }, back);
        for (let x = 30; x < F.w - 20; x += 64) S('rect', { x, y: yG + 42, width: 40, height: 10, fill: COL.woodDark, rx: 2 }, back);
        T(back, F.w - 22, yG + 34, 'rail', { anchor: 'end', size: 11, fill: '#3d4352' });
        S('circle', { r: Rp, fill: '#c7ccd6', stroke: '#5d6475', 'stroke-width': 2, opacity: 0.9 }, wheel);
        T(wheel, 0, -Rp + 11, 'flange', { anchor: 'middle', size: 9, fill: '#3d4352' });
      } else {
        K.ground(back, 16, F.w - 16, yG);
      }
      S('circle', { r: R, fill: flange ? '#a9b0bf' : '#fbf8ef', stroke: flange ? '#4a5060' : COL.ink, 'stroke-width': flange ? 2.5 : 5 }, wheel);
      if (!flange) S('circle', { r: R - 7, fill: 'none', stroke: COL.faint, 'stroke-width': 1 }, wheel);
      for (let i = 0; i < (flange ? 6 : 12); i++) { const a = i * TAU / (flange ? 6 : 12); S('line', { x1: 0, y1: 0, x2: (R - 4) * Math.cos(a), y2: (R - 4) * Math.sin(a), stroke: flange ? '#5d6475' : COL.muted, 'stroke-width': flange ? 5 : 1.2 }, wheel); }
      S('circle', { r: 7, fill: COL.ink }, wheel);
      const dotR = flange ? Rp - 4 : R;
      const dot = S('circle', { cx: 0, cy: dotR, r: 6, fill: COL.red, stroke: '#fff', 'stroke-width': 1.5 }, wheel);
      const arrows = [0, 1, 2, 3, 4].map(() => K.arrow(top, COL.blue, 2.6));
      const arrowLab = [0, 1, 2, 3, 4].map(() => T(top, 0, 0, '', { size: 11, fill: COL.blue, weight: 700 }));
      const dotArrow = K.arrow(top, COL.red, 2.8);
      const note = F.note(0);
      const warn = T(F.scene, F.w / 2, 26, '', { anchor: 'middle', size: 15, fill: COL.red, weight: 800 });
      let d = 0, speeds = !flange, segs = [];
      function pointAt(dd) { const th = dd / R, cx = x0 + dd, cy = yG - R; return [cx - dotR * Math.sin(th), cy + dotR * Math.cos(th)]; }
      function draw() {
        const th = d / R, cx = x0 + d, cy = yG - R;
        wheel.setAttribute('transform', tr(cx, cy, th * 180 / Math.PI));
        // the trace: blue when the point goes forward, red when it goes backward
        trailG.innerHTML = '';
        const n = Math.max(2, Math.ceil(d / 3));
        let run = [], back = null;
        for (let i = 0; i <= n; i++) {
          const dd = d * i / n, p = pointAt(dd), vx = 1 - dotR / R * Math.cos(dd / R);
          const b = vx < -1e-9;
          if (back === null) back = b;
          if (b !== back) { run.push(p); S('path', { d: K.path(run), fill: 'none', stroke: back ? COL.red : COL.blue, 'stroke-width': back ? 3.2 : 2, opacity: 0.85 }, trailG); run = [p]; back = b; }
          else run.push(p);
        }
        if (run.length > 1) S('path', { d: K.path(run), fill: 'none', stroke: back ? COL.red : COL.blue, 'stroke-width': back ? 3.2 : 2, opacity: 0.85 }, trailG);
        // speeds: v = ω × (point − contact); the axle moves at 1 unit = 34 px
        const vs = 34, pts = [[cx, cy - R, 'top: 2v'], [cx + R, cy, ''], [cx, cy, 'axle: v'], [cx - R, cy, ''], [cx, cy + R - 1, 'bottom: 0']];
        pts.forEach((q, i) => {
          if (!speeds) { arrows[i].hide(); K.say(arrowLab[i], ''); return; }
          const rx = q[0] - cx, ry = q[1] - (cy + R);   // from the contact point
          const vx = -ry / R * vs, vy = rx / R * vs;    // clockwise turning, y down
          arrows[i].set(q[0], q[1], q[0] + vx, q[1] + vy);
          K.say(arrowLab[i], q[2]);
          set(arrowLab[i], { x: q[0] + vx + (i === 4 ? 8 : 6), y: q[1] + vy + (i === 0 ? -4 : i === 4 ? 16 : 4) });
        });
        const p = pointAt(d), vx = 1 - dotR / R * Math.cos(th), vy = -dotR / R * Math.sin(th);
        if (flange) dotArrow.set(p[0], p[1], p[0] + vx * 34, p[1] + vy * 34); else dotArrow.hide();
        K.say(warn, flange && vx < -0.01 && d > 0 ? 'This point is moving backwards!' : '');
        K.say(note, 'Red point: ' + (Math.hypot(vx, vy)).toFixed(2) + '× the axle’s speed');
      }
      const L = F.loop((dt) => { d = Math.min(D, d + dt * D / (flange ? 9 : 7)); draw(); return d < D; });
      K.playButton(F, L, { label: 'Roll', onPress() { if (!L.running && d >= D - 1e-6) d = 0; L.toggle(); } });
      F.button('Step', () => { L.stop(); if (d >= D - 1e-6) d = 0; const from = d, to = Math.min(D, (Math.floor(d / (TAU * R / 8) + 1e-6) + 1) * TAU * R / 8); F.tween(600, (t) => { d = lerp(from, to, t); draw(); }); }, { icon: 'step', title: 'An eighth of a turn' });
      F.button('', () => { L.stop(); d = 0; draw(); }, { icon: 'reset', title: 'Back to the start' });
      const sb = F.button('Speeds', () => { speeds = !speeds; sb.on(speeds); draw(); }, { title: 'Show how fast each point moves' });
      sb.on(speeds);
      draw();
      return F.inst({
        solve() { speeds = true; sb.on(true); L.stop(); d = 0; L.start(); },
        getState: () => ({ d: +d.toFixed(2), speeds }),
        setState(s) { d = clamp(+s.d || 0, 0, D); speeds = !!s.speeds; sb.on(speeds); draw(); }
      });
    }
  });

  /* The Moon round the Earth, the Earth round the Sun: turns seen from the stars */
  C.figure('phys-orbit', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 400, bar: 1 });
      const moon = P.mode !== 'earth', days = P.days || 4;
      const cx = 250, cy = F.sh / 2 + 4, Ro = Math.min(150, F.sh / 2 - 34);
      // stars far away: a fixed direction
      for (let i = 0; i < 26; i++) { const a = i * 2.39996, rr = 170 + (i * 37) % 60; const x = cx + rr * 1.3 * Math.cos(a), y = cy + rr * 0.9 * Math.sin(a); if (x > 10 && x < 440 && y > 10 && y < F.sh - 10) S('path', { d: 'M' + fx(x) + ' ' + fx(y - 3) + 'l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z', fill: '#c9b77e' }, F.back); }
      S('circle', { cx, cy, r: Ro, fill: 'none', stroke: COL.faint, 'stroke-width': 1.3, 'stroke-dasharray': '4 5' }, F.scene);
      if (moon) {
        S('circle', { cx, cy, r: 34, fill: '#6fa3d6', stroke: '#2f5f92', 'stroke-width': 2 }, F.scene);
        S('path', { d: 'M' + (cx - 20) + ' ' + (cy - 12) + 'q10 -8 18 0t14 10q-6 10-18 6t-14-16Z', fill: '#7fae5a', opacity: 0.9 }, F.scene);
        T(F.scene, cx, cy + 52, 'Earth', { anchor: 'middle', size: 12, fill: COL.ink2 });
      } else {
        S('circle', { cx, cy, r: 30, fill: '#ffd35a', stroke: '#d9a520', 'stroke-width': 2 }, F.scene);
        for (let i = 0; i < 12; i++) { const a = i * TAU / 12; S('line', { x1: cx + 36 * Math.cos(a), y1: cy + 36 * Math.sin(a), x2: cx + 46 * Math.cos(a), y2: cy + 46 * Math.sin(a), stroke: '#d9a520', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, F.scene); }
        T(F.scene, cx, cy + 62, 'Sun', { anchor: 'middle', size: 12, fill: COL.ink2 });
      }
      const body = S('g', null, F.scene);
      const br = moon ? 20 : 17;
      S('circle', { r: br, fill: moon ? '#d8d8d0' : '#6fa3d6', stroke: moon ? '#7c7c70' : '#2f5f92', 'stroke-width': 2 }, body);
      if (moon) { S('circle', { cx: 6, cy: -7, r: 4, fill: '#b9b9ae' }, body); S('circle', { cx: -7, cy: 6, r: 3, fill: '#b9b9ae' }, body); }
      // the face (moon) or the noon mark (earth): an arrow along +x in the body's frame, pointing at the centre at the start
      S('line', { x1: -br + 4, y1: 0, x2: br - 2, y2: 0, stroke: COL.red, 'stroke-width': 3 }, body);
      S('path', { d: 'M' + (br + 12) + ' 0L' + (br - 2) + ' -7V7Z', fill: COL.red }, body);
      const starArrow = K.arrow(F.scene, COL.purple, 2.4, { dash: '4 3' });
      const starLab = T(F.scene, 0, 0, 'to a far star', { size: 10, fill: COL.purple, anchor: 'middle' });
      const panel = S('g', { transform: tr(418, 24) }, F.scene);
      S('rect', { x: 0, y: 0, width: 190, height: 140, rx: 10, fill: '#fffdf8', stroke: COL.line }, panel);
      const t1 = T(panel, 12, 26, '', { size: 12.5 }), t2 = T(panel, 12, 56, '', { size: 12.5, fill: COL.red }), t3 = T(panel, 12, 86, '', { size: 12.5, fill: COL.purple }), t4 = T(panel, 12, 118, '', { size: 11, fill: COL.muted });
      let a = 0, frozen = false;   // orbit angle (anticlockwise on screen)
      const turnsStar = () => (frozen ? 0 : moon ? a / TAU : (days + 1) * a / TAU);
      function draw() {
        const ang = Math.PI + a;              // start on the left of the centre
        const x = cx + Ro * Math.cos(ang), y = cy - Ro * Math.sin(ang);
        // spin seen from the stars: the moon turns once per orbit; the toy Earth turns days+1 times per year
        const spin = frozen ? 0 : (moon ? a : (days + 1) * a);
        body.setAttribute('transform', tr(x, y, -spin * 180 / Math.PI));
        starArrow.set(x, y - br - 2, x, y - br - 40);
        set(starLab, { x, y: y - br - 45 });
        const orbits = a / TAU;
        if (moon) {
          K.say(t1, 'Day ' + (orbits * 27.3).toFixed(1) + ' of 27.3');
          K.say(t2, 'Turns seen from Earth: ' + (frozen ? orbits : 0).toFixed(2));
          K.say(t3, 'Turns against the stars: ' + turnsStar().toFixed(2));
          K.say(t4, frozen ? 'Not spinning: we see its far side' : 'The same face always looks at us');
        } else {
          const solar = turnsStar() - orbits;
          K.say(t1, 'Toy year: ' + orbits.toFixed(2) + ' orbits');
          K.say(t2, 'Noons so far: ' + solar.toFixed(2));
          K.say(t3, 'Turns against the stars: ' + turnsStar().toFixed(2));
          K.say(t4, 'Red: noon mark · dashed: a fixed star');
        }
      }
      const L = F.loop((dt) => { a = Math.min(TAU, a + dt * TAU / (moon ? 8 : 10)); draw(); return a < TAU; });
      K.playButton(F, L, { label: 'Orbit', onPress() { if (!L.running && a >= TAU - 1e-9) a = 0; L.toggle(); } });
      F.button('', () => { L.stop(); a = 0; draw(); }, { icon: 'reset', title: 'Back to the start' });
      let fb = null;
      if (moon) fb = F.button('Stop it spinning', () => { frozen = !frozen; fb.on(frozen); fb.label(frozen ? 'Let it spin' : 'Stop it spinning'); draw(); }, { title: 'What would we see if the Moon did not turn at all?' });
      draw();
      return F.inst({
        solve() { L.stop(); a = 0; frozen = false; if (fb) { fb.on(false); fb.label('Stop it spinning'); } L.start(); },
        getState: () => ({ a: +a.toFixed(4), frozen }),
        setState(s) { a = clamp(+s.a || 0, 0, TAU); frozen = !!s.frozen; if (fb) { fb.on(frozen); fb.label(frozen ? 'Let it spin' : 'Stop it spinning'); } draw(); }
      });
    }
  });

  /* A ladder sliding down a wall: where the cat goes, and when the top leaves the wall */
  C.figure('phys-ladder', {
    draw(g, P, ctx) {
      const dyn = P.mode === 'dyn';
      const F = K.frame(g, ctx, { w: 620, h: 380, bar: 1 });
      const Lm = 5, px = 250 / Lm, wallX = 70, floorY = F.sh - 26;
      const back = S('g', null, F.scene), guide = S('g', null, F.scene), trail = S('g', null, F.scene), lad = S('g', null, F.scene), over = S('g', null, F.scene);
      S('rect', { x: wallX - 22, y: 12, width: 22, height: floorY - 12, fill: '#e3d6bb', stroke: COL.tableDark, 'stroke-width': 1.5 }, back);
      for (let y = 20; y < floorY; y += 18) S('line', { x1: wallX - 22, y1: y, x2: wallX, y2: y, stroke: '#cdbd98', 'stroke-width': 1 }, back);
      K.ground(back, wallX - 22, F.w - 16, floorY);
      const rails = [S('line', { stroke: COL.woodDark, 'stroke-width': 5, 'stroke-linecap': 'round' }, lad), S('line', { stroke: COL.woodDark, 'stroke-width': 5, 'stroke-linecap': 'round' }, lad)];
      const rungs = S('g', null, lad);
      const cat = S('g', null, over);
      S('ellipse', { cx: 0, cy: -9, rx: 12, ry: 8, fill: '#e08a3c', stroke: COL.ink, 'stroke-width': 1.3 }, cat);
      S('circle', { cx: 10, cy: -18, r: 6.5, fill: '#e08a3c', stroke: COL.ink, 'stroke-width': 1.3 }, cat);
      S('path', { d: 'M6 -23l1 -6 4 4M11 -24l4 -5 1 6', fill: '#e08a3c', stroke: COL.ink, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, cat);
      S('path', { d: 'M-11 -8q-10 -4 -8 -16', fill: 'none', stroke: COL.ink, 'stroke-width': 2, 'stroke-linecap': 'round' }, cat);
      const catDot = S('circle', { r: 3, fill: COL.red }, over);
      const foot = S('circle', { r: 9, fill: 'rgba(58,110,165,.18)', stroke: COL.blue, 'stroke-width': 2, class: 'fk-drag' }, over);
      const note = F.note(0);
      const info = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 13, fill: COL.ink2 });
      const info2 = T(F.scene, F.w - 20, 46, '', { anchor: 'end', size: dyn ? 13 : 12, fill: dyn ? COL.red : COL.muted, weight: dyn ? 700 : 600 });
      const gauge = S('g', { transform: tr(F.w - 170, 64) }, F.scene);
      let gaugeBar = null;
      if (dyn) {
        S('rect', { x: 0, y: 0, width: 150, height: 12, rx: 6, fill: '#eee4cc', stroke: COL.line }, gauge);
        gaugeBar = S('rect', { x: 0, y: 0, width: 0, height: 12, rx: 6, fill: COL.blue }, gauge);
        T(gauge, 0, 28, 'push of the wall on the ladder', { size: 11, fill: COL.muted });
      }
      let th, frac = P.cat == null ? 0.5 : P.cat, pts = [];
      let th0 = (P.start || 70) * Math.PI / 180, sim = null, left = null, showCircle = false;
      function ends() {
        if (sim && sim.phase === 2) { const xc = sim.X, yc = Lm / 2 * Math.sin(sim.th); return { top: [xc - Lm / 2 * Math.cos(sim.th), 2 * yc], foot: [xc + Lm / 2 * Math.cos(sim.th), 0] }; }
        return { top: [0, Lm * Math.sin(th)], foot: [Lm * Math.cos(th), 0] };
      }
      const W = (p) => [wallX + p[0] * px, floorY - p[1] * px];
      function draw() {
        const e = ends(), a = W(e.top), b = W(e.foot);
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), nx = -dy / len * 5, ny = dx / len * 5;
        set(rails[0], { x1: a[0] + nx, y1: a[1] + ny, x2: b[0] + nx, y2: b[1] + ny });
        set(rails[1], { x1: a[0] - nx, y1: a[1] - ny, x2: b[0] - nx, y2: b[1] - ny });
        rungs.innerHTML = '';
        for (let i = 1; i < 12; i++) { const t = i / 12; S('line', { x1: a[0] + dx * t + nx, y1: a[1] + dy * t + ny, x2: a[0] + dx * t - nx, y2: a[1] + dy * t - ny, stroke: COL.wood, 'stroke-width': 3 }, rungs); }
        const cp = [b[0] - dx * frac, b[1] - dy * frac];
        cat.setAttribute('transform', tr(cp[0], cp[1] - 6));
        K.show(cat, !dyn);
        set(catDot, { cx: cp[0], cy: cp[1] });
        if (!pts.length || Math.hypot(cp[0] - pts[pts.length - 1][0], cp[1] - pts[pts.length - 1][1]) > 1.2) pts.push(cp);
        trail.innerHTML = '';
        S('path', { d: K.path(pts), fill: 'none', stroke: COL.red, 'stroke-width': 2.2, opacity: 0.8 }, trail);
        set(foot, { cx: b[0], cy: b[1] });
        K.show(foot, !dyn);
        const ang = Math.atan2(e.top[1] - e.foot[1], e.foot[0] - e.top[0]) * 180 / Math.PI;
        if (dyn) {
          const Nw = sim && sim.phase === 1 ? Math.max(0, sim.Nw) : 0;
          set(gaugeBar, { width: clamp(Nw / 0.8, 0, 1) * 150 });
          K.say(info, 'Top of the ladder: ' + (e.top[1]).toFixed(2) + ' m  (started at ' + (Lm * Math.sin(th0)).toFixed(2) + ' m)');
          K.say(info2, left ? 'Left the wall at ' + left.h.toFixed(2) + ' m — ' + (left.h / (Lm * Math.sin(th0))).toFixed(3) + ' of its starting height' : '');
          K.say(note, 'No friction anywhere · slow motion');
        } else {
          K.say(info, 'Angle ' + ang.toFixed(0) + '°  ·  the cat is ' + Math.round(frac * 100) + ' % of the way up');
          K.say(info2, 'Drag the blue ring at the foot, or press Slide');
          K.say(note, '');
        }
      }
      function drawGuide() {
        guide.innerHTML = '';
        if (!showCircle) return;
        const c = W([0, 0]);
        S('path', { d: 'M' + fx(c[0]) + ' ' + fx(c[1] - Lm / 2 * px) + 'A' + fx(Lm / 2 * px) + ' ' + fx(Lm / 2 * px) + ' 0 0 1 ' + fx(c[0] + Lm / 2 * px) + ' ' + fx(c[1]), fill: 'none', stroke: COL.blue, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, guide);
        if (!dyn) {
          const e = ends(), a = W(e.top), b = W(e.foot);
          S('path', { d: 'M' + fx(c[0]) + ' ' + fx(c[1]) + 'L' + fx(b[0]) + ' ' + fx(a[1]), stroke: COL.blue, 'stroke-width': 1.4, 'stroke-dasharray': '3 3' }, guide);
          S('rect', { x: c[0], y: a[1], width: b[0] - c[0], height: c[1] - a[1], fill: 'none', stroke: COL.blue, 'stroke-width': 1, opacity: 0.5 }, guide);
          T(guide, c[0] + 10, c[1] - Lm / 2 * px - 8, 'a quarter circle round the corner', { size: 11, fill: COL.blue });
        }
      }
      // dynamics (no friction): phase 1 against the wall, θ'' = −(3g/2L) cos θ; phase 2 free of the wall
      const gacc = 9.81;
      function simStart() { th = th0; sim = { phase: 1, th: th0, w: 0, t: 0, Nw: 0 }; left = null; pts = []; }
      function simStep(h) {
        const s = sim;
        if (s.phase === 1) {
          const f = (t2, w) => [w, -1.5 * gacc / Lm * Math.cos(t2)];
          const k1 = f(s.th, s.w), k2 = f(s.th + h / 2 * k1[0], s.w + h / 2 * k1[1]), k3 = f(s.th + h / 2 * k2[0], s.w + h / 2 * k2[1]), k4 = f(s.th + h * k3[0], s.w + h * k3[1]);
          s.th += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
          s.w += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
          const acc = -1.5 * gacc / Lm * Math.cos(s.th);
          s.Nw = -(Lm / 2) * (Math.cos(s.th) * s.w * s.w + Math.sin(s.th) * acc) / gacc;   // wall push / weight
          th = s.th;
          if (s.Nw <= 0 && s.t > 0.01) { s.phase = 2; s.X = Lm / 2 * Math.cos(s.th); s.V = -Lm / 2 * Math.sin(s.th) * s.w; left = { h: Lm * Math.sin(s.th) }; }
        } else {
          const A = (t2) => Lm * Lm / 4 * Math.cos(t2) ** 2 + Lm * Lm / 12;
          const f = (t2, w) => [w, (Lm * Lm / 4 * Math.cos(t2) * Math.sin(t2) * w * w - gacc * Lm / 2 * Math.cos(t2)) / A(t2)];
          const k1 = f(s.th, s.w), k2 = f(s.th + h / 2 * k1[0], s.w + h / 2 * k1[1]), k3 = f(s.th + h / 2 * k2[0], s.w + h / 2 * k2[1]), k4 = f(s.th + h * k3[0], s.w + h * k3[1]);
          s.th += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
          s.w += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
          s.X += s.V * h;
          th = s.th;
        }
        s.t += h;
        return s.th > 0.002;
      }
      const L = F.loop((dt) => {
        if (dyn) {
          let t = dt * 0.3;   // slow motion
          while (t > 0) { const h = Math.min(0.0005, t); t -= h; if (!simStep(h)) { sim.th = 0; th = 0; draw(); return false; } }
          draw();
          return true;
        }
        th = Math.max(0.03, th - dt * 0.28);
        draw();
        return th > 0.03;
      });
      const reset = () => { L.stop(); pts = []; if (dyn) simStart(); else th = Math.acos(0.25); draw(); };
      K.playButton(F, L, { label: 'Slide', onPress() { if (!L.running && (dyn ? (sim && sim.th <= 0.003) : th <= 0.031)) reset(); L.toggle(); } });
      F.button('', reset, { icon: 'reset', title: 'Stand the ladder up again' });
      let sl;
      if (dyn) sl = F.slider({ label: 'Start at', min: 40, max: 85, step: 5, value: Math.round(th0 * 180 / Math.PI), w: 110, vw: 40, fmt: (v) => v + '°', onInput(v) { th0 = v * Math.PI / 180; reset(); } });
      else sl = F.slider({ label: 'Cat at', min: 0, max: 1, step: 0.05, value: frac, w: 110, vw: 44, fmt: (v) => Math.round(v * 100) + ' %', onInput(v) { frac = v; pts = []; draw(); } });
      K.onDrag(foot, F.scene, ctx, {
        start() { if (dyn) return false; L.stop(); },
        move(p) { const x = clamp((p[0] - wallX) / px, 0.15, Lm - 0.01); th = Math.acos(x / Lm); draw(); }
      });
      F.whenSolved(() => { showCircle = true; drawGuide(); });
      if (dyn) simStart(); else th = Math.acos(0.25);
      draw();
      drawGuide();
      const origDraw = draw;
      return F.inst({
        solve() { showCircle = true; drawGuide(); reset(); L.start(); },
        getState: () => (dyn ? { th0 } : { th: +th.toFixed(4), frac }),
        setState(s) { if (dyn) { th0 = s.th0 || th0; sl.set(Math.round(th0 * 180 / Math.PI), true); reset(); } else { frac = s.frac == null ? frac : s.frac; sl.set(frac, true); th = s.th || th; pts = []; origDraw(); } }
      });
    }
  });

  /* The bicycle pedal pulled backwards with a string */
  C.figure('phys-bike', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 360, bar: 1 });
      const px = 190, Rw = 0.34, c = 0.17, ring = 0.1, yG = F.sh - 34;
      let G = P.gear || 2.4, x = 0, hand = 0, busy = false, done = null;
      const k = () => 1 - c / (Rw * G);
      const ghost = S('g', { opacity: 0.18 }, F.scene), bike = S('g', null, F.scene), over = S('g', null, F.scene);
      K.ground(F.back, 16, F.w - 16, yG);
      const X0 = 330;   // rear axle at the start
      function frame(gp, alpha, crank, wheel) {
        gp.innerHTML = '';
        const rx = 0, ry = -Rw * px, fx2 = 1.02 * px, bb = [0.42 * px, -0.27 * px], seat = [0.3 * px, -0.9 * px], head = [0.86 * px, -0.92 * px];
        [[rx, ry], [fx2, ry]].forEach((wc, i) => {
          const wg = S('g', { transform: tr(wc[0], wc[1], wheel * 180 / Math.PI) }, gp);
          S('circle', { r: Rw * px, fill: 'none', stroke: COL.ink, 'stroke-width': 5 }, wg);
          S('circle', { r: Rw * px - 5, fill: 'none', stroke: COL.faint, 'stroke-width': 1 }, wg);
          for (let s = 0; s < 12; s++) { const a = s * TAU / 12; S('line', { x1: 0, y1: 0, x2: (Rw * px - 4) * Math.cos(a), y2: (Rw * px - 4) * Math.sin(a), stroke: COL.muted, 'stroke-width': 1 }, wg); }
          S('circle', { r: 4, fill: COL.ink }, wg);
          if (i === 0) S('circle', { cx: 0, cy: -(Rw * px - 2), r: 4, fill: COL.red }, wg);
        });
        const fr = COL.blue;
        S('path', { d: 'M0 ' + fx(ry) + 'L' + fx(bb[0]) + ' ' + fx(bb[1]) + 'L' + fx(seat[0]) + ' ' + fx(seat[1]) + 'Z M' + fx(seat[0]) + ' ' + fx(seat[1]) + 'L' + fx(head[0]) + ' ' + fx(head[1] + 16) + 'L' + fx(bb[0]) + ' ' + fx(bb[1]) + ' M' + fx(head[0]) + ' ' + fx(head[1]) + 'L' + fx(fx2) + ' ' + fx(ry), fill: 'none', stroke: fr, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gp);
        S('path', { d: 'M' + fx(seat[0] - 16) + ' ' + fx(seat[1] - 6) + 'h32', stroke: COL.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, gp);
        S('path', { d: 'M' + fx(head[0]) + ' ' + fx(head[1]) + 'l-10 -12h22', fill: 'none', stroke: COL.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, gp);
        // chain: chainring at the bottom bracket, sprocket at the rear axle
        const sr = ring / G * px, cr = ring * px;
        S('line', { x1: 0, y1: ry - sr, x2: bb[0], y2: bb[1] - cr, stroke: '#6b6b6b', 'stroke-width': 2 }, gp);
        S('line', { x1: 0, y1: ry + sr, x2: bb[0], y2: bb[1] + cr, stroke: '#6b6b6b', 'stroke-width': 2 }, gp);
        S('circle', { cx: 0, cy: ry, r: sr, fill: 'none', stroke: '#6b6b6b', 'stroke-width': 2 }, gp);
        S('circle', { cx: bb[0], cy: bb[1], r: cr, fill: 'rgba(0,0,0,.05)', stroke: '#6b6b6b', 'stroke-width': 2.5 }, gp);
        // cranks: clockwise angle `crank` from pointing straight down
        const p1 = [bb[0] - c * px * Math.sin(crank), bb[1] + c * px * Math.cos(crank)], p2 = [bb[0] + c * px * Math.sin(crank), bb[1] - c * px * Math.cos(crank)];
        S('line', { x1: bb[0], y1: bb[1], x2: p2[0], y2: p2[1], stroke: '#555', 'stroke-width': 5, 'stroke-linecap': 'round' }, gp);
        S('rect', { x: p2[0] - 9, y: p2[1] - 3, width: 18, height: 6, rx: 2, fill: '#444' }, gp);
        S('line', { x1: bb[0], y1: bb[1], x2: p1[0], y2: p1[1], stroke: '#333', 'stroke-width': 6, 'stroke-linecap': 'round' }, gp);
        S('rect', { x: p1[0] - 10, y: p1[1] - 3.5, width: 20, height: 7, rx: 2, fill: COL.red }, gp);
        S('circle', { cx: bb[0], cy: bb[1], r: 4, fill: COL.ink }, gp);
        return p1;
      }
      const str = S('line', { stroke: COL.ink2, 'stroke-width': 1.6 }, over);
      const hnd = K.hand(over, 0, 0, 0.9, 0);
      const aBike = K.arrow(over, COL.blue, 3.5), aPed = K.arrow(over, COL.red, 3.5);
      const tB = T(over, 0, 0, '', { size: 12, fill: COL.blue, weight: 700, anchor: 'middle' }), tP = T(over, 0, 0, '', { size: 12, fill: COL.red, weight: 700, anchor: 'middle' });
      const info = T(F.scene, 20, 26, '', { size: 13, fill: COL.ink2 }), info2 = T(F.scene, 20, 44, '', { size: 13, fill: COL.ink2 });
      const pedal0 = () => [X0 + 0.42 * px, yG - 0.27 * px + c * px];
      function draw() {
        const crank = x / (Rw * G), wheel = x / Rw;
        bike.setAttribute('transform', tr(X0 + x * px, yG));
        const p1 = frame(bike, 1, crank, wheel);
        const pw = [X0 + x * px + p1[0], yG + p1[1]];
        const hx = pw[0] - 150;   // the string stays taut: the hand is 150 px behind the pedal
        set(str, { x1: pw[0] - 9, y1: pw[1], x2: hx + 10, y2: pw[1] });
        hnd.move(hx - 5, pw[1], 0);
        const p0 = pedal0();
        if (done || busy) {
          aBike.set(X0 + 0.5 * px, yG - 0.95 * px - 20, X0 + 0.5 * px + x * px, yG - 0.95 * px - 20);
          set(tB, { x: X0 + 0.5 * px + x * px / 2, y: yG - 0.95 * px - 30 }); K.say(tB, Math.abs(x) > 0.01 ? 'bicycle' : '');
          aPed.set(p0[0], yG + 16, pw[0], yG + 16);
          set(tP, { x: Math.min(p0[0], pw[0]) - 8, y: yG + 20 }); tP.setAttribute('text-anchor', 'end'); K.say(tP, Math.abs(pw[0] - p0[0]) > 4 ? 'pedal' : '');
        } else { aBike.hide(); aPed.hide(); K.say(tB, ''); K.say(tP, ''); }
        const kk = k();
        K.say(info, 'Gear: one turn of the pedals turns the wheel ' + G.toFixed(1) + ' times' + (G < 1 ? ' (a very low gear)' : ''));
        if (done) {
          const pedRel = -c * crank;   // pedal motion relative to the frame (+ forward)
          K.say(info2, Math.abs(x) < 0.005 && !busy ? 'The pedal will not budge: at this gear the wheel and the crank cancel exactly.' :
            'Bicycle: ' + Math.abs(x * 100).toFixed(0) + ' cm ' + (x < 0 ? 'backwards' : 'forwards') + ' · pedal on the frame: ' + Math.abs(pedRel * 100).toFixed(0) + ' cm ' + (pedRel > 0 ? 'forwards' : 'backwards') + ' (cranks turn ' + (crank < 0 ? 'backwards' : 'forwards') + ')');
        } else K.say(info2, 'A string is tied to the lower pedal. Pull it backwards…');
      }
      // the pedal's place on the ground is x − c·sin(crank), crank = x / (R·G): the hand draws it back steadily
      const kAt = (xx) => 1 - c / (Rw * G) * Math.cos(xx / (Rw * G));
      const PL = F.loop((dt) => {
        let t = dt;
        while (t > 0) {
          const h = Math.min(0.004, t); t -= h;
          const kk = kAt(x);
          if (Math.abs(kk) < 0.05 || hand <= -0.45 || Math.abs(x) > 0.7) { busy = false; draw(); return false; }
          const dp = -0.18 * h;
          hand += dp;
          x += dp / kk;
        }
        draw();
        return true;
      });
      function pull() {
        if (busy) return;
        x = 0; hand = 0; done = { k: k() }; busy = true;
        PL.start();
      }
      F.button('Pull the string', pull, { icon: 'hand', primary: true });
      F.button('', () => { if (busy) return; x = 0; hand = 0; done = null; draw(); }, { icon: 'reset', title: 'Back to the start' });
      F.slider({ label: 'Gear', min: 0.3, max: 3.5, step: 0.1, value: G, w: 150, vw: 60, fmt: (v) => v.toFixed(1) + '×', onInput(v) { if (busy) return; G = v; x = 0; hand = 0; done = null; draw(); } });
      // a faint copy where the bicycle started
      ghost.setAttribute('transform', tr(X0, yG));
      frame(ghost, 0.2, 0, 0);
      draw();
      return F.inst({ solve() { x = 0; done = null; pull(); }, getState: () => ({ G }), setState(s) { G = s.G || G; x = 0; done = null; draw(); } });
    }
  });

  /* The spool pulled by its thread */
  C.figure('phys-spool', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 360, bar: 2 });
      const R = 58, yT = F.sh - 36;
      let ratio = P.ratio || 0.5, ang = P.angle == null ? 20 : P.angle, x = 0, busy = false;
      K.table(F.back, 16, F.w - 16, yT);
      const lineG = S('g', null, F.scene), spool = S('g', null, F.scene), over = S('g', null, F.scene);
      const X0 = 260;
      const thread = S('line', { stroke: '#c0392b', 'stroke-width': 2.2 }, over);
      const hnd = K.hand(over, 0, 0, 0.8, 0);
      const cP = S('path', { fill: COL.red }, over);
      const verdict = T(F.scene, 20, 28, '', { size: 14, weight: 700 });
      const why = T(F.scene, 20, 47, '', { size: 12, fill: COL.ink2 });
      function build() {
        spool.innerHTML = '';
        const r = R * ratio;
        S('circle', { r: R, fill: '#e2c28a', stroke: COL.woodDark, 'stroke-width': 3 }, spool);
        S('circle', { r: R - 7, fill: 'none', stroke: 'rgba(138,90,38,.35)', 'stroke-width': 1.5 }, spool);
        S('circle', { r, fill: '#e07a6a', stroke: '#8f2d22', 'stroke-width': 2 }, spool);
        for (let i = 1; i < 5; i++) S('circle', { r: r - i * 3, fill: 'none', stroke: 'rgba(143,45,34,.35)', 'stroke-width': 1 }, spool);
        S('circle', { r: 5, fill: COL.ink }, spool);
        S('line', { x1: 0, y1: -R + 4, x2: 0, y2: -r - 2, stroke: COL.woodDark, 'stroke-width': 3, 'stroke-linecap': 'round' }, spool);
      }
      function draw() {
        const r = R * ratio, a = ang * Math.PI / 180, cx = X0 + x, cy = yT - R;
        spool.setAttribute('transform', tr(cx, cy, x / R * 180 / Math.PI));
        // the thread leaves the bottom of the axle and runs up and to the right at angle a
        const tp = [cx + r * Math.sin(a), cy + r * Math.cos(a)], d = [Math.cos(a), -Math.sin(a)];
        const len = 190 - (busy ? 0 : 0);
        const hp = [tp[0] + d[0] * len, tp[1] + d[1] * len];
        set(thread, { x1: tp[0], y1: tp[1], x2: hp[0], y2: hp[1] });
        hnd.move(hp[0] + d[0] * 15, hp[1] + d[1] * 15, 180 - ang);
        // the line of the pull, carried on backwards past the contact point
        lineG.innerHTML = '';
        const back = 170;
        S('line', { x1: tp[0] - d[0] * back, y1: tp[1] - d[1] * back, x2: tp[0], y2: tp[1], stroke: COL.purple, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, lineG);
        const Px = cx, Py = yT;
        cP.setAttribute('d', 'M' + fx(Px) + ' ' + fx(Py) + 'l-6 10h12Z');
        const m = R * Math.cos(a) - r;   // turning effect about the contact point (per unit pull)
        if (Math.abs(m) < 1.5) { K.say(verdict, 'The pull passes through the point of contact: the spool does not roll.'); verdict.setAttribute('fill', COL.purple); }
        else if (m > 0) { K.say(verdict, 'The line of pull passes above the contact point: it rolls towards you.'); verdict.setAttribute('fill', COL.blue); }
        else { K.say(verdict, 'The line of pull passes beyond the contact point: it rolls away.'); verdict.setAttribute('fill', COL.red); }
        K.say(why, 'Thread at ' + ang + '° · axle ' + Math.round(ratio * 100) + ' % of the rim · the critical angle is ' + (Math.acos(ratio) * 180 / Math.PI).toFixed(1) + '°');
      }
      function go() {
        if (busy) return;
        busy = true;
        const r = R * ratio, a = ang * Math.PI / 180;
        const acc = (Math.cos(a) - r / R) / 1.5;   // rolling: torque about the contact point over I about it (a disc: 3/2 m R²)
        const X1 = x;
        F.tween(2200, (t) => { x = clamp(X1 + acc * 170 * t * t, -X0 + R + 30, F.w - X0 - R - 40); draw(); }, () => { busy = false; }, true);
      }
      F.button('Pull', go, { icon: 'hand', primary: true, w: 80 });
      F.button('', () => { if (!busy) { x = 0; draw(); } }, { icon: 'reset', title: 'Put the spool back' });
      F.slider({ label: 'Angle', min: 0, max: 90, step: 1, value: ang, w: 170, vw: 40, fmt: (v) => v + '°', onInput(v) { if (busy) return; ang = v; draw(); } });
      F.newRow();
      if (P.sizes !== false) F.slider({ label: 'Axle', min: 0.3, max: 0.8, step: 0.05, value: ratio, w: 140, vw: 110, fmt: (v) => Math.round(v * 100) + ' % of the rim', onInput(v) { if (busy) return; ratio = v; build(); draw(); } });
      build();
      draw();
      return F.inst({ solve() { x = 0; go(); }, getState: () => ({ ang, ratio }), setState(s) { ang = s.ang == null ? ang : s.ang; ratio = s.ratio || ratio; x = 0; build(); draw(); } });
    }
  });

  /* Archimedes' tank: ice, a pebble in ice, a boat with an anchor, with a magnified level gauge */
  C.figure('phys-float', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 410, bar: 1 });
      const sc = P.scene || 'ice', boat = /^boat/.test(sc);
      const cm = 18, Wcm = 16, Dcm = 6, A = Wcm * Dcm;   // the tank: 16 cm wide and 6 cm from front to back
      const tx0 = 46, tx1 = tx0 + Wcm * cm, yb = F.sh - 26;
      const rhoL = sc === 'salt' ? 1.2 : 1, ICE = 0.917, STONE = 2.7;
      const cfg = {
        ice: { water: 560, ice: 4.4 }, salt: { water: 560, ice: 4.4 }, stone: { water: 500, ice: 5.2, stone: 6 },
        'boat-anchor': { water: 640, load: 120, rho: 7.8, name: 'an iron anchor' },
        'boat-water': { water: 640, load: 100, rho: 1, name: 'a bucket of water' },
        'boat-wood': { water: 640, load: 100, rho: 0.6, name: 'a log' }
      }[sc] || { water: 560, ice: 4.4 };
      const BOAT = 60, HL = 10, HW = 5.5, HH = 4.2;   // the boat: 60 g, a box hull 10 × 5.5 cm, 4.2 cm high
      function iceState(t) {
        const all = Math.pow(cfg.ice, 3) * ICE, iceM = all * (1 - t), melt = all * t;
        const stM = cfg.stone ? cfg.stone * STONE : 0, stV = cfg.stone || 0;
        const m = iceM + stM, v = iceM / ICE + stV, sunk = stM > 0 && m > v * rhoL;
        const disp = sunk ? v : m / rhoL;
        return { level: (cfg.water + melt + disp) / A, sunk, sub: sunk ? 1 : m / rhoL / v, side: Math.cbrt(iceM / ICE), iceM };
      }
      function boatState(ph) {
        const out = clamp((ph - 0.5) / 0.12, 0, 1);   // 0: aboard, 1: over the side
        const dIn = (BOAT + cfg.load) / rhoL;
        const loadOut = cfg.rho > 1 ? cfg.load / cfg.rho : cfg.load / rhoL;   // a sunk load displaces its volume, a floating one its weight
        const bd = lerp(dIn, BOAT / rhoL, out);
        return { level: (cfg.water + lerp(dIn, BOAT / rhoL + loadOut, out)) / A, draft: bd / (HL * HW), out };
      }
      const state = (u) => (boat ? boatState(u) : iceState(u));
      const h0 = state(0).level;
      const full = sc === 'ice' || sc === 'salt';
      const brim = full ? h0 : h0 + (boat ? 3.6 : 2.2);
      const Y = (h) => yb - h * cm;
      const back = S('g', null, F.scene), waterG = S('g', null, F.scene), obj = S('g', null, F.scene), front = S('g', null, F.scene), gaugeG = S('g', null, F.scene);
      K.table(back, 16, F.w - 16, yb + 8);
      const water = S('path', { fill: sc === 'salt' ? 'rgba(168,206,214,.8)' : 'rgba(150,196,232,.72)', stroke: COL.waterLine, 'stroke-width': 1.6 }, waterG);
      [[tx0 - 7, 7], [tx1, 7]].forEach((w) => S('rect', { x: w[0], y: Y(brim) - 1, width: w[1], height: yb - Y(brim) + 9, fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 1.5 }, front));
      S('rect', { x: tx0 - 7, y: yb, width: tx1 - tx0 + 14, height: 8, fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 1.5 }, front);
      if (full) T(front, tx0 - 10, Y(brim) - 6, 'brim', { size: 11, fill: COL.muted });
      S('line', { x1: tx0 - 22, y1: Y(h0), x2: tx1 + 22, y2: Y(h0), stroke: COL.red, 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, front);
      T(front, tx1 + 24, Y(h0) + 4, 'start', { size: 11, fill: COL.red });
      const spill = S('g', null, front);
      // the gauge: the surface near the start line, magnified
      const mag = boat ? 2 : 10, pxmm = mag * cm / 10, stepmm = boat ? 5 : 1;
      const gx = 438, gy = 26, gw = 160, gh = 170, gmid = gy + 30 + (gh - 38) / 2;
      S('rect', { x: gx, y: gy, width: gw, height: gh, rx: 12, fill: '#fffdf8', stroke: COL.line, 'stroke-width': 1.3 }, gaugeG);
      T(gaugeG, gx + gw / 2, gy + 19, 'the surface, ×' + mag, { anchor: 'middle', size: 12, fill: COL.ink2 });
      const clipId = 'fkc' + Math.floor(Math.random() * 1e9);
      S('rect', { x: gx + 8, y: gy + 28, width: gw - 16, height: gh - 36 }, S('clipPath', { id: clipId }, S('defs', null, gaugeG)));
      const gIn = S('g', { 'clip-path': 'url(#' + clipId + ')' }, gaugeG);
      const gWater = S('rect', { x: gx + 8, width: gw - 16, height: gh, fill: 'rgba(150,196,232,.8)' }, gIn);
      for (let k = -12; k <= 12; k++) {
        const yy = gmid - k * stepmm * pxmm;
        S('line', { x1: gx + 8, y1: yy, x2: gx + (k % 2 === 0 ? 30 : 20), y2: yy, stroke: COL.ink2, 'stroke-width': 1 }, gIn);
        if (k % 2 === 0) T(gIn, gx + 34, yy + 4, (k > 0 ? '+' : k < 0 ? '−' : '') + Math.abs(k * stepmm) + ' mm', { size: 10, fill: COL.ink2 });
      }
      S('line', { x1: gx + 8, y1: gmid, x2: gx + gw - 8, y2: gmid, stroke: COL.red, 'stroke-width': 1.3, 'stroke-dasharray': '4 3' }, gIn);
      const gRead = T(gaugeG, gx + gw / 2, gy + gh + 22, '', { anchor: 'middle', size: 14, weight: 700 });
      const cap = T(F.scene, 20, 24, '', { size: 13, fill: COL.ink2 });
      K.say(cap, boat ? 'A toy boat carrying ' + cfg.name + ', afloat in a tank' : sc === 'salt' ? 'Ice floating in very salty water, filled to the brim' : sc === 'stone' ? 'Ice with a pebble frozen inside it' : 'Ice floating in water, filled to the brim');
      let u = 0, wob = 0, drops = 0;
      function anchor(parent, x, y, s) {
        S('path', { d: 'M' + fx(x) + ' ' + fx(y - s) + 'V' + fx(y + s * 0.9) + 'M' + fx(x - s * 0.9) + ' ' + fx(y + s * 0.25) + 'Q' + fx(x - s * 0.8) + ' ' + fx(y + s * 1.1) + ' ' + fx(x) + ' ' + fx(y + s * 0.95) + 'Q' + fx(x + s * 0.8) + ' ' + fx(y + s * 1.1) + ' ' + fx(x + s * 0.9) + ' ' + fx(y + s * 0.25) + 'M' + fx(x - s * 0.45) + ' ' + fx(y - s * 0.5) + 'H' + fx(x + s * 0.45), fill: 'none', stroke: '#474a52', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, parent);
        S('circle', { cx: x, cy: y - s - 4, r: 4, fill: 'none', stroke: '#474a52', 'stroke-width': 3 }, parent);
      }
      function draw() {
        const st = state(u), lv = Math.min(st.level, brim), yl = Y(lv);
        water.setAttribute('d', K.waterPath(tx0, tx1, yl, yb, 0.7, wob));
        obj.innerHTML = '';
        spill.innerHTML = '';
        if (!boat) {
          const s = st.side * cm, cx = (tx0 + tx1) / 2 + 6;
          const blockH = Math.max(s, cfg.stone ? Math.cbrt(cfg.stone) * cm * 1.2 : 0);
          const top = st.sunk ? yb - blockH : yl - blockH * st.sub;
          if (s > 1.5) S('rect', { x: cx - s / 2, y: top + blockH - s, width: s, height: s, rx: Math.min(s / 3, 4 + u * 10), fill: 'rgba(236,247,255,.88)', stroke: '#8fb8d8', 'stroke-width': 1.6 }, obj);
          if (s > 6) S('path', { d: 'M' + fx(cx - s * 0.3) + ' ' + fx(top + blockH - s * 0.8) + 'l' + fx(s * 0.2) + ' ' + fx(s * 0.15), stroke: '#fff', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, obj);
          if (cfg.stone) { const ss = Math.cbrt(cfg.stone) * cm * 1.2, by = top + blockH - 2; S('path', { d: 'M' + fx(cx - ss / 2) + ' ' + fx(by) + 'Q' + fx(cx - ss / 2) + ' ' + fx(by - ss * 0.8) + ' ' + fx(cx) + ' ' + fx(by - ss * 0.75) + 'Q' + fx(cx + ss / 2) + ' ' + fx(by - ss * 0.7) + ' ' + fx(cx + ss / 2) + ' ' + fx(by) + 'Z', fill: '#83807a', stroke: '#4a4740', 'stroke-width': 1.3 }, obj); }
          if (st.level > brim + 1e-6) {
            const over = (st.level - brim) * A;
            for (let i = 0; i < 3; i++) { const yy = Y(brim) + ((drops * 60 + i * 40) % 120); S('path', { d: 'M' + fx(tx1 + 11) + ' ' + fx(yy) + 'q3.5 6 0 9q-3.5 -3 0 -9Z', fill: COL.waterLine, opacity: 0.8 }, spill); }
            S('ellipse', { cx: tx1 + 22, cy: yb + 9, rx: 8 + over * 1.2, ry: 2.5, fill: COL.waterLine, opacity: 0.5 }, spill);
          }
        } else {
          const cx = (tx0 + tx1) / 2 - 36, bt = yl + st.draft * cm, top = bt - HH * cm, hl = HL * cm;
          S('path', { d: 'M' + fx(cx - hl / 2 - 8) + ' ' + fx(top) + 'H' + fx(cx + hl / 2 + 8) + 'L' + fx(cx + hl / 2 - 6) + ' ' + fx(bt) + 'H' + fx(cx - hl / 2 + 6) + 'Z', fill: '#c98c45', stroke: COL.woodDark, 'stroke-width': 2, 'stroke-linejoin': 'round' }, obj);
          S('line', { x1: cx - hl / 2 - 4, y1: top + 7, x2: cx + hl / 2 + 4, y2: top + 7, stroke: COL.woodDark, 'stroke-width': 1.2 }, obj);
          S('line', { x1: cx - hl / 2, y1: top + 16, x2: cx + hl / 2, y2: top + 16, stroke: 'rgba(138,90,38,.4)', 'stroke-width': 1 }, obj);
          const aboard = [cx + 18, top - 16], land = [tx1 - 34, yl];
          const fly = clamp((u - 0.25) / 0.25, 0, 1), settle = clamp((u - 0.5) / 0.35, 0, 1);
          if (sc === 'boat-water') {
            // pour the bucket over the side: the water simply joins the rest
            S('path', { d: 'M' + fx(cx + 6) + ' ' + fx(top - 26) + 'h24l-3 24h-18Z', fill: fly < 1 ? 'rgba(150,196,232,.9)' : 'none', stroke: '#6b6f78', 'stroke-width': 2 }, obj);
            if (fly > 0 && st.out < 1) S('path', { d: 'M' + fx(cx + 30) + ' ' + fx(top - 24) + 'Q' + fx(cx + 80) + ' ' + fx(top - 40) + ' ' + fx(land[0] - 30) + ' ' + fx(yl), fill: 'none', stroke: COL.waterLine, 'stroke-width': 7 * (1 - fly * 0.6), opacity: 0.75, 'stroke-linecap': 'round' }, obj);
          } else {
            const lx = lerp(aboard[0], land[0], fly);
            let ly = lerp(aboard[1], land[1], fly) - Math.sin(fly * Math.PI) * 70;
            if (u >= 0.5) ly = cfg.rho > 1 ? lerp(yl, yb - 26, ease(settle)) : yl + 3;
            if (cfg.rho > 1) anchor(obj, lx, ly - 4, 17);
            else { S('rect', { x: lx - 30, y: ly - 11, width: 60, height: 20, rx: 10, fill: '#b98a50', stroke: COL.woodDark, 'stroke-width': 1.6 }, obj); S('ellipse', { cx: lx + 24, cy: ly - 1, rx: 5, ry: 8, fill: '#e2c28a', stroke: COL.woodDark, 'stroke-width': 1.2 }, obj); }
            if (u >= 0.5 && u < 0.62) S('path', { d: 'M' + fx(land[0] - 16) + ' ' + fx(yl - 4) + 'l-8 -12M' + fx(land[0]) + ' ' + fx(yl - 6) + 'v-14M' + fx(land[0] + 16) + ' ' + fx(yl - 4) + 'l8 -12', stroke: COL.waterLine, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.8 }, obj);
          }
        }
        const dmm = (st.level - h0) * 10;
        gWater.setAttribute('y', fx(gmid - dmm * pxmm));
        const txt = Math.abs(dmm) < 0.05 ? 'no change' : (dmm > 0 ? 'up ' : 'down ') + Math.abs(dmm).toFixed(1) + ' mm';
        K.say(gRead, txt + (st.level > brim + 1e-6 ? ' — it spills over' : ''));
        gRead.setAttribute('fill', Math.abs(dmm) < 0.05 ? COL.green : dmm > 0 ? COL.blue : COL.red);
      }
      const L = F.loop((dt) => {
        wob += dt * 2.2;
        drops += dt;
        u = Math.min(1, u + dt / (boat ? 3.4 : 7));
        draw();
        return u < 1;
      });
      K.playButton(F, L, { label: boat ? 'Over the side' : 'Melt', w: boat ? 136 : 84, onPress() { if (!L.running && u >= 1) u = 0; L.toggle(); } });
      F.button('', () => { L.stop(); u = 0; draw(); }, { icon: 'reset', title: 'Start again' });
      draw();
      return F.inst({ solve() { L.stop(); u = 0; L.start(); }, getState: () => ({ u: +u.toFixed(3) }), setState(s) { u = clamp(+s.u || 0, 0, 1); draw(); } });
    }
  });

  /* An hourglass on a kitchen scale, with the reading plotted against time */
  C.figure('phys-hourglass', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 400, bar: 1 });
      const M = 400, mu = 20, t1 = 6, Tf = 0.25;   // grams, g per second, seconds of flow, seconds of fall (30 cm)
      const reading = (t) => {
        if (t <= 0) return M;
        const len = Math.max(0, Math.min(t1, t) - Math.max(0, t - Tf));
        return M - mu * len + (t >= Tf && t <= t1 + Tf ? mu * Tf : 0);
      };
      const cx = 118, yTop = 44, yNeck = 150, yBot = 256;
      const glass = S('g', null, F.scene), sandG = S('g', null, F.scene), stream = S('g', null, F.scene), front = S('g', null, F.scene);
      // the bulbs (outline), the sand is clipped to them
      const bulb = (y0, y1) => 'M' + (cx - 46) + ' ' + y0 + 'C' + (cx - 50) + ' ' + (y0 + (y1 - y0) * 0.55) + ' ' + (cx - 6) + ' ' + (y1 - 14) + ' ' + (cx - 4) + ' ' + y1 + 'H' + (cx + 4) + 'C' + (cx + 6) + ' ' + (y1 - 14) + ' ' + (cx + 50) + ' ' + (y0 + (y1 - y0) * 0.55) + ' ' + (cx + 46) + ' ' + y0 + 'Z';
      const topPath = bulb(yTop, yNeck), botPathD = (function () { const p = bulb(yBot, yNeck); return p; })();
      const cid = 'fkh' + Math.floor(Math.random() * 1e9);
      const defs = S('defs', null, F.scene);
      S('path', { d: topPath }, S('clipPath', { id: cid + 'a' }, defs));
      S('path', { d: botPathD }, S('clipPath', { id: cid + 'b' }, defs));
      const topSand = S('path', { fill: '#e2b85e', 'clip-path': 'url(#' + cid + 'a)' }, sandG);
      const botSand = S('path', { fill: '#e2b85e', 'clip-path': 'url(#' + cid + 'b)' }, sandG);
      S('path', { d: topPath, fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 2 }, glass);
      S('path', { d: botPathD, fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 2 }, glass);
      [yTop - 10, yBot].forEach((y) => S('rect', { x: cx - 60, y, width: 120, height: 10, rx: 3, fill: COL.wood, stroke: COL.woodDark, 'stroke-width': 1.5 }, front));
      [cx - 54, cx + 50].forEach((x) => S('rect', { x, y: yTop - 2, width: 4, height: yBot - yTop + 4, fill: COL.woodDark }, front));
      // the scale
      S('rect', { x: cx - 80, y: yBot + 10, width: 160, height: 8, rx: 3, fill: '#c3c8d2', stroke: COL.silverDark, 'stroke-width': 1.5 }, front);
      S('path', { d: 'M' + (cx - 72) + ' ' + (yBot + 18) + 'h144l8 44h-160Z', fill: '#e8ebf0', stroke: COL.silverDark, 'stroke-width': 1.5 }, front);
      S('rect', { x: cx - 42, y: yBot + 26, width: 84, height: 26, rx: 4, fill: '#1f2a24', stroke: '#111', 'stroke-width': 1 }, front);
      const disp = T(front, cx, yBot + 45, '400.0 g', { anchor: 'middle', size: 17, weight: 700, fill: '#8cf5a0' });
      // the graph
      const gx = 262, gy = 36, gw = 330, gh = 230, t0 = -0.5, tEnd = t1 + 1.2, lo = M - 7, hi = M + 7;
      const X = (t) => gx + (t - t0) / (tEnd - t0) * gw, Yg = (v) => gy + gh - (v - lo) / (hi - lo) * gh;
      S('rect', { x: gx, y: gy, width: gw, height: gh, rx: 6, fill: '#fffdf8', stroke: COL.line, 'stroke-width': 1.2 }, F.scene);
      [-5, 0, 5].forEach((d) => { S('line', { x1: gx, y1: Yg(M + d), x2: gx + gw, y2: Yg(M + d), stroke: d === 0 ? COL.faint : COL.line, 'stroke-width': 1 }, F.scene); T(F.scene, gx - 5, Yg(M + d) + 4, String(M + d), { anchor: 'end', size: 10, fill: COL.muted, weight: 500 }); });
      for (let s = 0; s <= 7; s++) T(F.scene, X(s), gy + gh + 14, s + ' s', { anchor: 'middle', size: 10, fill: COL.muted, weight: 500 });
      T(F.scene, gx, gy - 10, 'scale reading (grams)', { size: 11, fill: COL.ink2 });
      const curve = S('path', { fill: 'none', stroke: COL.blue, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, F.scene);
      const labels = S('g', null, F.scene);
      const cap = T(F.scene, 262, 304, '', { size: 11, fill: COL.ink2 });
      let t = -0.5, slow = false, pts = [];
      function sandAt(tt) { return clamp(tt / t1, 0, 1); }   // fraction of the sand that has left the top
      function draw() {
        const out = sandAt(t), landed = clamp((t - Tf) / t1, 0, 1);
        // top: a level surface falling from 40 % of the bulb, with a little funnel over the neck
        const hs = lerp(yTop + 42, yNeck - 4, Math.sqrt(out));
        topSand.setAttribute('d', out >= 1 ? '' : 'M' + (cx - 60) + ' ' + fx(hs) + 'H' + (cx - 10) + 'L' + cx + ' ' + fx(Math.min(yNeck, hs + 10)) + 'L' + (cx + 10) + ' ' + fx(hs) + 'H' + (cx + 60) + 'V' + yNeck + 'H' + (cx - 60) + 'Z');
        // bottom: a cone that grows
        const hm = 44 * Math.sqrt(landed), wm = 50 * Math.sqrt(landed) + (landed > 0 ? 6 : 0);
        botSand.setAttribute('d', landed <= 0 ? '' : 'M' + (cx - 60) + ' ' + yBot + 'V' + fx(yBot - hm * 0.35) + 'L' + fx(cx - wm) + ' ' + fx(yBot - hm * 0.35) + 'L' + cx + ' ' + fx(yBot - hm) + 'L' + fx(cx + wm) + ' ' + fx(yBot - hm * 0.35) + 'H' + (cx + 60) + 'V' + yBot + 'Z');
        // the stream: grains released over the last T seconds
        stream.innerHTML = '';
        const land = yBot - hm, drop = land - yNeck;
        for (let k = 0; k < 14; k++) {
          const age = k / 14 * Tf, tau = t - age;
          if (tau < 0 || tau > t1) continue;
          const y = yNeck + drop * (age / Tf) * (age / Tf);
          S('circle', { cx: cx + ((k * 7) % 3 - 1) * 0.8, cy: y, r: 1.6, fill: '#c9973a' }, stream);
        }
        const v = reading(t);
        K.say(disp, v.toFixed(1) + ' g');
        if (!pts.length || t > pts[pts.length - 1][0]) pts.push([t, v]);
        curve.setAttribute('d', K.path(pts.map((p) => [X(p[0]), Yg(p[1])])));
        labels.innerHTML = '';
        if (t > Tf + 0.3) { T(labels, X(0.15), Yg(M - 5.6), 'grains in the air,', { size: 10, fill: COL.red }); T(labels, X(0.15), Yg(M - 5.6) + 12, 'none landing yet', { size: 10, fill: COL.red }); }
        if (t > 3) T(labels, X(3), Yg(M) - 8, 'steady flow: exactly balanced', { anchor: 'middle', size: 10, fill: COL.green });
        if (t > t1 + Tf + 0.1) { T(labels, X(t1 - 0.2), Yg(M + 5.8), 'still landing,', { anchor: 'end', size: 10, fill: COL.blue }); T(labels, X(t1 - 0.2), Yg(M + 5.8) + 12, 'none leaving', { anchor: 'end', size: 10, fill: COL.blue }); }
        K.say(cap, 'Glass 280 g + sand 120 g · 20 g of sand a second falls 30 cm' + (slow ? ' · slow motion' : ''));
      }
      const L = F.loop((dt) => { t = Math.min(tEnd, t + dt * (slow ? 0.2 : 1)); draw(); return t < tEnd; });
      K.playButton(F, L, { label: 'Open the neck', w: 140, onPress() { if (!L.running && t >= tEnd) { t = -0.5; pts = []; } L.toggle(); } });
      F.button('', () => { L.stop(); t = -0.5; pts = []; draw(); }, { icon: 'reset', title: 'Start again' });
      const sb = F.button('Slow motion', () => { slow = !slow; sb.on(slow); draw(); });
      draw();
      return F.inst({ solve() { L.stop(); t = -0.5; pts = []; L.start(); }, getState: () => ({ slow }), setState(s) { slow = !!s.slow; sb.on(slow); draw(); } });
    }
  });

  /* A candle in a dish of water, covered by a glass: a small gas model */
  C.figure('phys-candle', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 400, bar: 1 });
      const cx = 170, yDish = F.sh - 40, waterY = yDish - 22, gW = 120, gH = 190;
      // gas in the glass, in units of the gas it held at the start (20 °C, 21 % oxygen, a little vapour)
      const T0 = 293;
      const psat = (Tk) => 0.61078 * Math.exp(17.27 * (Tk - 273) / (Tk - 273 + 237.3)) / 101.3;   // vapour pressure / 1 atm
      function run() {
        const out = [];
        let n2 = 0.78, o2 = 0.21, co2 = 0.0004, h2oTot = 0.01, Tin = T0, escaped = 0, burning = true, tOut = null;
        const dt = 0.02;
        for (let t = 0; t <= 12; t += dt) {
          if (t < 1.2) { out.push({ t, placed: t / 1.2, Tin, o2f: 0.21, v: 1, rise: 0, burning: true, bubbles: 0 }); continue; }
          if (burning) {
            const nd = n2 + o2 + co2;
            if (o2 / nd <= 0.16) { burning = false; tOut = t; }
            else { const dO = 0.0125 * dt * 1.1; o2 -= dO; co2 += dO / 1.5; h2oTot += dO / 1.5; }
            Tin += (T0 + 70 - Tin) * dt / 1.1;
          } else Tin += (T0 - Tin) * dt / 1.5;
          const dry = n2 + o2 + co2, x = psat(Tin), vap = Math.min(h2oTot, x / (1 - x) * dry);
          let v = (dry + vap) * Tin / T0;
          if (v > 1) { const k = 1 / v; escaped += (dry + vap) * (1 - k); n2 *= k; o2 *= k; co2 *= k; h2oTot -= vap * (1 - k); v = 1; }
          out.push({ t, placed: 1, Tin, o2f: o2 / (n2 + o2 + co2), v, rise: Math.max(0, 1 - v), burning, escaped, tOut, cond: Math.max(0, h2oTot - vap) });
        }
        return out;
      }
      const TL = run();
      const tOut = TL[TL.length - 1].tOut;
      const back = S('g', null, F.scene), inner = S('g', null, F.scene), front = S('g', null, F.scene), chart = S('g', null, F.scene);
      K.table(back, 16, 330, yDish + 8);
      S('path', { d: 'M' + (cx - 120) + ' ' + (yDish - 30) + 'L' + (cx - 108) + ' ' + yDish + 'H' + (cx + 108) + 'L' + (cx + 120) + ' ' + (yDish - 30), fill: 'rgba(255,255,255,.5)', stroke: COL.silverDark, 'stroke-width': 2 }, back);
      const outWater = S('path', { fill: 'rgba(150,196,232,.75)', stroke: COL.waterLine, 'stroke-width': 1.4 }, back);
      const inWater = S('rect', { fill: 'rgba(150,196,232,.85)' }, inner);
      const candle = K.candle(inner, cx, yDish - 4, 64, { w: 18 });
      const smoke = S('path', { fill: 'none', stroke: '#9a9a9a', 'stroke-width': 2, opacity: 0, 'stroke-linecap': 'round' }, inner);
      const bub = S('g', null, inner);
      const glassG = S('g', null, front);
      S('path', { d: 'M0 0V' + (-gH + 12) + 'Q0 ' + (-gH) + ' 12 ' + (-gH) + 'H' + (gW - 12) + 'Q' + gW + ' ' + (-gH) + ' ' + gW + ' ' + (-gH + 12) + 'V0', fill: 'rgba(175,208,232,.22)', stroke: COL.glassLine, 'stroke-width': 2.5 }, glassG);
      S('line', { x1: 14, y1: -gH + 20, x2: 14, y2: -30, stroke: '#fff', 'stroke-width': 3, opacity: 0.6, 'stroke-linecap': 'round' }, glassG);
      const mist = S('rect', { x: 3, y: -gH + 3, width: gW - 6, height: gH - 10, rx: 10, fill: '#ffffff', opacity: 0 }, glassG);
      // the readouts and the chart
      const pnl = S('g', { transform: tr(356, 22) }, chart);
      S('rect', { x: 0, y: 0, width: 246, height: 76, rx: 10, fill: '#fffdf8', stroke: COL.line }, pnl);
      const r1 = T(pnl, 12, 22, '', { size: 12.5 }), r2 = T(pnl, 12, 44, '', { size: 12.5 }), r3 = T(pnl, 12, 66, '', { size: 12.5, fill: COL.blue, weight: 700 });
      const cx0 = 360, cy0 = 118, cw = 236, ch = 150;
      S('rect', { x: cx0, y: cy0, width: cw, height: ch, rx: 6, fill: '#fffdf8', stroke: COL.line }, chart);
      T(chart, cx0, cy0 - 6, 'water risen in the glass', { size: 11, fill: COL.ink2 });
      const maxRise = Math.max(0.05, ...TL.map((p) => p.rise));
      const Xc = (t) => cx0 + t / 12 * cw, Yc = (r) => cy0 + ch - r / (maxRise * 1.15) * ch;
      if (tOut) { S('line', { x1: Xc(tOut), y1: cy0, x2: Xc(tOut), y2: cy0 + ch, stroke: COL.orange, 'stroke-width': 1.3, 'stroke-dasharray': '4 3' }, chart); T(chart, Xc(tOut) + 4, cy0 + 14, 'flame out', { size: 10, fill: COL.orange }); }
      for (let s = 0; s <= 12; s += 3) T(chart, Xc(s), cy0 + ch + 13, s + ' s', { anchor: 'middle', size: 10, fill: COL.muted, weight: 500 });
      const riseLine = S('path', { fill: 'none', stroke: COL.blue, 'stroke-width': 2.2 }, chart);
      let t = 0;
      function at(tt) { const i = clamp(Math.round(tt / 0.02), 0, TL.length - 1); return TL[i]; }
      function draw() {
        const p = at(t);
        const gy = lerp(yDish - gH - 150, yDish - 6, ease(p.placed));   // bottom of the glass rim
        glassG.setAttribute('transform', tr(cx - gW / 2, gy));
        const riseY = p.rise * (gH - 30);
        outWater.setAttribute('d', 'M' + (cx - 112) + ' ' + (waterY + riseY * 0.12) + 'H' + (cx + 112) + 'L' + (cx + 108) + ' ' + yDish + 'H' + (cx - 108) + 'Z');
        const inside = p.placed >= 1;
        set(inWater, { x: cx - gW / 2 + 2, width: gW - 4, y: waterY - (inside ? riseY : 0), height: yDish - waterY + (inside ? riseY : 0) - 2 });
        const fl = p.burning ? clamp((p.o2f - 0.155) / 0.055, 0.25, 1) : 0;
        candle.flame(fl > 0, 0.55 + 0.45 * fl + 0.05 * Math.sin(t * 23));
        smoke.setAttribute('opacity', !p.burning && tOut ? clamp(1 - (t - tOut) / 2, 0, 0.7) : 0);
        smoke.setAttribute('d', 'M' + cx + ' ' + (yDish - 76) + 'q-8 -12 0 -24t0 -24');
        bub.innerHTML = '';
        if (p.burning && p.placed >= 1 && t < 3.6) for (let k = 0; k < 3; k++) { const ph = (t * 1.7 + k / 3) % 1; S('circle', { cx: cx + gW / 2 + 4 + k * 3, cy: yDish - 8 - ph * 26, r: 3 + k, fill: 'none', stroke: COL.waterLine, 'stroke-width': 1.3, opacity: 1 - ph }, bub); }
        mist.setAttribute('opacity', inside && p.cond ? clamp(p.cond / 0.02, 0, 1) * 0.28 : 0);
        K.say(r1, 'Oxygen in the glass: ' + (p.o2f * 100).toFixed(1) + ' %');
        K.say(r2, 'Air in the glass: ' + (p.Tin - 273).toFixed(0) + ' °C' + (p.burning && inside && t < 3.6 ? ' · bubbling out' : ''));
        K.say(r3, 'Water risen: ' + (p.rise * 100).toFixed(1) + ' % of the glass');
        const pts = [];
        for (let s = 0; s <= t + 1e-9; s += 0.1) pts.push([Xc(s), Yc(at(s).rise)]);
        riseLine.setAttribute('d', K.path(pts));
      }
      const L = F.loop((dt) => { t = Math.min(12, t + dt); draw(); return t < 12; });
      K.playButton(F, L, { label: 'Cover it', w: 110, onPress() { if (!L.running && t >= 12) t = 0; L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; draw(); }, { icon: 'reset', title: 'Start again' });
      draw();
      return F.inst({ solve() { L.stop(); t = 0; L.start(); }, getState: () => ({ t: +t.toFixed(2) }), setState(s) { t = clamp(+s.t || 0, 0, 12); draw(); } });
    }
  });

  /* A hanging slinky let go at the top: a chain of masses and springs whose coils stick when they meet */
  C.figure('phys-slinky', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 420, bar: 1 });
      const N = 26, Mt = 0.2, m = Mt / N, gA = 9.81, d = 0.003, Ls = 0.9;
      const k = m * gA * N * (N - 1) / (2 * Ls);
      const px = 300, y0 = 44, xS = 230, xB = 330;
      let ys, vs, front, tt, slow = true, ball;
      function init() {
        // hanging at rest: each spring stretched by the weight of the coils below it
        ys = [0]; vs = new Array(N).fill(0);
        for (let i = 0; i < N - 1; i++) ys.push(ys[i] + d + (N - 1 - i) * m * gA / k);
        front = 0; tt = 0; ball = { y: ys[N - 1], v: 0 };
      }
      function step(h) {
        // coils 0..front have met and move as one clump; the coils below are still on their springs
        const Tn = (i) => Math.max(0, k * (ys[i + 1] - ys[i] - d));   // tension of the spring below coil i
        const n = front + 1;
        const aC = gA + (front < N - 1 ? Tn(front) / (n * m) : 0);
        const acc = [];
        for (let i = front + 1; i < N; i++) acc[i] = gA + ((i < N - 1 ? Tn(i) : 0) - Tn(i - 1)) / m;
        const vC = vs[0] + aC * h;
        for (let i = 0; i <= front; i++) { vs[i] = vC; ys[i] += vC * h; }
        for (let i = front + 1; i < N; i++) { vs[i] += acc[i] * h; ys[i] += vs[i] * h; }
        // a coil that meets the clump sticks to it, sharing momentum
        while (front < N - 1 && ys[front + 1] - ys[front] <= d) {
          const size = front + 1, V = (vs[0] * size + vs[front + 1]) / (size + 1);
          front++;
          for (let i = 0; i <= front; i++) vs[i] = V;
        }
        for (let i = 1; i <= front; i++) ys[i] = ys[i - 1] + d;
        ball.v += gA * h; ball.y += ball.v * h;
        tt += h;
      }
      const hand = K.hand(F.scene, xS - 46, y0 - 8, 1, 0);
      const coils = S('g', null, F.scene), marks = S('g', null, F.scene);
      K.ground(F.back, 16, F.w - 16, F.sh - 14);
      S('line', { x1: xS - 70, y1: y0 + Ls * px + 8, x2: xB + 60, y2: y0 + Ls * px + 8, stroke: COL.red, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, F.back);
      const bottomLab = T(F.back, xS - 72, y0 + Ls * px + 12, 'bottom at the start', { anchor: 'end', size: 11, fill: COL.red });
      void bottomLab;
      const ballEl = S('circle', { r: 9, fill: COL.blue, stroke: '#244a75', 'stroke-width': 1.5 }, F.scene);
      T(F.scene, xB, y0 - 18, 'a ball let go', { anchor: 'middle', size: 11, fill: COL.blue });
      T(F.scene, xB, y0 - 6, 'at the same moment', { anchor: 'middle', size: 11, fill: COL.blue });
      const cmEl = S('path', { d: 'M-7 0h14M0 -7v14', stroke: COL.purple, 'stroke-width': 2.2 }, F.scene);
      let ys0last = 0;
      const pnl = S('g', { transform: tr(430, 36) }, F.scene);
      S('rect', { x: 0, y: 0, width: 170, height: 98, rx: 10, fill: '#fffdf8', stroke: COL.line }, pnl);
      const r1 = T(pnl, 12, 24, '', { size: 13, weight: 700 }), r2 = T(pnl, 12, 46, '', { size: 12, fill: COL.red }), r3 = T(pnl, 12, 68, '', { size: 12, fill: COL.purple }), r4 = T(pnl, 12, 88, '', { size: 11, fill: COL.muted });
      function draw() {
        coils.innerHTML = '';
        for (let i = 0; i < N; i++) {
          const y = y0 + ys[i] * px;
          if (y > F.sh - 14) continue;
          S('ellipse', { cx: xS, cy: y, rx: 30, ry: 5.5, fill: 'none', stroke: i === N - 1 ? COL.red : '#8a93a6', 'stroke-width': i === N - 1 ? 3 : 2.2 }, coils);
        }
        const released = tt > 0;
        hand.g.style.opacity = released ? 0.35 : 1;
        set(ballEl, { cx: xB, cy: Math.min(F.sh - 23, y0 + ball.y * px) });
        const cm = ys.reduce((s, y) => s + y, 0) / N;
        cmEl.setAttribute('transform', tr(xS + 44, y0 + cm * px));
        const moved = (ys[N - 1] - (ball ? ys0last : 0)) * 1000;
        K.say(r1, 'Time: ' + (tt * 1000).toFixed(0) + ' ms');
        K.say(r2, 'Bottom has moved: ' + Math.max(0, moved).toFixed(1) + ' mm');
        K.say(r3, '+ centre of mass: falls as usual');
        K.say(r4, slow ? 'slow motion, 12 times slower' : 'real speed');
      }
      const L = F.loop((dt) => {
        let s = dt * (slow ? 1 / 12 : 1);
        while (s > 0) { const h = Math.min(0.0002, s); s -= h; step(h); }
        draw();
        return y0 + ys[0] * px < F.sh - 30 && tt < 1.2;
      });
      function reset() { L.stop(); init(); ys0last = ys[N - 1]; draw(); }
      K.playButton(F, L, { label: 'Let go', onPress() { if (!L.running && tt > 0 && !(y0 + ys[0] * px < F.sh - 30 && tt < 1.2)) reset(); L.toggle(); } });
      F.button('', reset, { icon: 'reset', title: 'Hang it up again' });
      const sb = F.button('Slow motion', () => { slow = !slow; sb.on(slow); draw(); });
      sb.on(slow);
      init(); ys0last = ys[N - 1];
      draw();
      return F.inst({ solve() { reset(); L.start(); }, getState: () => ({ slow }), setState(s) { slow = s.slow !== false; sb.on(slow); reset(); } });
    }
  });

  /* An aeroplane on a conveyor belt that runs backwards as fast as the plane goes forwards */
  C.figure('phys-conveyor', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 330, bar: 1 });
      const acc = 2.5, vTO = 30, tTO = vTO / acc, dTO = vTO * vTO / (2 * acc);   // 12 s and 180 m to take off
      const yB = F.sh - 58, x0 = 40, span = 430, ppm = span / dTO;
      let t = 0, belt = true, off = 0, spin = 0;
      S('rect', { x: 8, y: 8, width: F.w - 16, height: yB - 8, rx: 8, fill: '#eef5fa' }, F.back);
      [[90, 50], [300, 36], [480, 70]].forEach((c) => { S('ellipse', { cx: c[0], cy: c[1], rx: 34, ry: 11, fill: '#fff' }, F.back); S('ellipse', { cx: c[0] + 18, cy: c[1] - 7, rx: 20, ry: 10, fill: '#fff' }, F.back); });
      const beltG = S('g', null, F.scene), plane = S('g', null, F.scene);
      S('rect', { x: 14, y: yB, width: F.w - 28, height: 22, rx: 11, fill: '#555b66', stroke: '#2f333a', 'stroke-width': 2 }, beltG);
      const stripes = S('g', null, beltG);
      for (let x = 30; x < F.w - 20; x += 46) S('circle', { cx: x, cy: yB + 11, r: 7, fill: '#8b919c', stroke: '#2f333a', 'stroke-width': 1.2 }, beltG);
      S('rect', { x: 14, y: yB + 24, width: F.w - 28, height: 14, fill: '#b9bec8' }, beltG);
      // the plane, drawn facing right, wheels at y = 0
      S('path', { d: 'M-70 -30C-70 -40 -58 -44 -40 -44H40C62 -44 78 -36 84 -30C78 -24 62 -18 40 -18H-40C-58 -18 -70 -22 -70 -30Z', fill: '#f4f5f7', stroke: '#4a5060', 'stroke-width': 2 }, plane);
      S('path', { d: 'M-66 -40L-82 -70H-68L-48 -44Z', fill: COL.red, stroke: '#4a5060', 'stroke-width': 1.6 }, plane);
      S('path', { d: 'M-12 -30L-30 -6H-14L14 -30Z', fill: '#c9ced8', stroke: '#4a5060', 'stroke-width': 1.6 }, plane);
      S('path', { d: 'M52 -40Q66 -38 72 -32H52Z', fill: '#9fc6e6' }, plane);
      for (let i = 0; i < 5; i++) S('circle', { cx: -34 + i * 16, cy: -34, r: 3, fill: '#9fc6e6' }, plane);
      S('path', { d: 'M84 -30h8', stroke: '#4a5060', 'stroke-width': 3 }, plane);
      const prop = S('line', { x1: 93, y1: -44, x2: 93, y2: -16, stroke: '#4a5060', 'stroke-width': 3, 'stroke-linecap': 'round' }, plane);
      const wheels = [[-18, 0], [60, 0]].map((w) => {
        S('line', { x1: w[0], y1: -18, x2: w[0], y2: -8, stroke: '#4a5060', 'stroke-width': 3 }, plane);
        const wg = S('g', { transform: tr(w[0], -8) }, plane);
        S('circle', { r: 8, fill: '#2f333a' }, wg);
        S('line', { x1: -6, y1: 0, x2: 6, y2: 0, stroke: '#9aa0aa', 'stroke-width': 2 }, wg);
        S('line', { x1: 0, y1: -6, x2: 0, y2: 6, stroke: '#9aa0aa', 'stroke-width': 2 }, wg);
        return { wg, x: w[0] };
      });
      const pnl = S('g', { transform: tr(F.w - 214, 20) }, F.scene);
      S('rect', { x: 0, y: 0, width: 196, height: 92, rx: 10, fill: 'rgba(255,253,248,.92)', stroke: COL.line }, pnl);
      const r1 = T(pnl, 12, 24, '', { size: 12.5, weight: 700 }), r2 = T(pnl, 12, 46, '', { size: 12.5 }), r3 = T(pnl, 12, 68, '', { size: 12.5 }), r4 = T(pnl, 12, 86, '', { size: 11, fill: COL.muted });
      const msg = T(F.scene, 24, 34, '', { size: 15, weight: 800, fill: COL.green });
      function draw() {
        const v = Math.min(vTO, acc * t), dist = t <= tTO ? 0.5 * acc * t * t : dTO + vTO * (t - tTO);
        const climb = t > tTO ? Math.pow(t - tTO, 1.6) * 9 : 0;
        const px = x0 + 70 + dist * ppm, py = yB - climb;
        plane.setAttribute('transform', tr(px, py, t > tTO ? -Math.min(12, (t - tTO) * 8) : 0));
        prop.setAttribute('transform', 'scale(1 ' + fx(0.3 + 0.7 * Math.abs(Math.sin(t * 40))) + ')');
        prop.setAttribute('transform-origin', '93px -30px');
        stripes.innerHTML = '';
        for (let x = 14 - (off % 40) - 40; x < F.w - 20; x += 40) if (x > 16) S('rect', { x, y: yB + 2, width: 18, height: 4, rx: 2, fill: '#cfd3da' }, stripes);
        wheels.forEach((w) => w.wg.setAttribute('transform', tr(w.x, -8, spin * 57.3)));
        const vb = belt ? v : 0, onGround = t <= tTO;
        K.say(r1, 'Airspeed: ' + Math.round(v * 3.6) + ' km/h');
        K.say(r2, 'Belt: ' + (belt ? Math.round(vb * 3.6) + ' km/h backwards' : 'switched off'));
        K.say(r3, 'Wheel rims: ' + (onGround ? Math.round((v + vb) * 3.6) + ' km/h' : 'in the air'));
        K.say(r4, 'Take-off speed ' + Math.round(vTO * 3.6) + ' km/h');
        K.say(msg, t > tTO ? 'Airborne after ' + tTO.toFixed(0) + ' s and ' + dTO.toFixed(0) + ' m' + (belt ? ' — belt or no belt' : '') : '');
      }
      const L = F.loop((dt) => {
        t = Math.min(tTO + 4, t + dt * 1.6);
        const v = Math.min(vTO, acc * t), onGround = t <= tTO;
        off += (belt ? v : 0) * dt * 1.6 * ppm;
        spin += (onGround ? (v + (belt ? v : 0)) : 0) * dt * 0.35;
        draw();
        return t < tTO + 4;
      });
      K.playButton(F, L, { label: 'Full throttle', w: 130, onPress() { if (!L.running && t >= tTO + 4) { t = 0; off = 0; } L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; off = 0; draw(); }, { icon: 'reset', title: 'Back to the start' });
      const bs = F.seg({ options: [[true, 'Belt on'], [false, 'Belt off']], value: belt, onChange(v) { belt = v; L.stop(); t = 0; off = 0; draw(); } });
      draw();
      return F.inst({ solve() { L.stop(); t = 0; off = 0; L.start(); }, getState: () => ({ belt }), setState(s) { belt = s.belt !== false; bs.set(belt, true); t = 0; draw(); } });
    }
  });

  /* Things thrown and dropped: a dropped ball and a flicked one; the monkey and the dart; a ball in a train */
  C.figure('phys-projectile', {
    draw(g, P, ctx) {
      const mode = P.mode || 'drop';
      const F = K.frame(g, ctx, { w: 620, h: mode === 'train' ? 330 : 380, bar: 1 });
      const gA = 9.81, yG = F.sh - 22;
      K.ground(F.back, 16, F.w - 16, yG);
      const trails = S('g', null, F.scene), objs = S('g', null, F.scene), over = S('g', null, F.scene);
      const msg = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 14, weight: 800 });
      const sub = T(F.scene, F.w - 20, 46, '', { anchor: 'end', size: 12, fill: COL.ink2 });
      let t = 0, v = P.speed || (mode === 'monkey' ? 10 : 2.5), frame = 'train', endT = 1, drawFn = () => {}, onReset = () => {};
      const L = F.loop((dt) => { t = Math.min(endT, t + dt * 0.3); drawFn(); return t < endT; });
      const reset = () => { L.stop(); t = 0; onReset(); drawFn(); };
      K.playButton(F, L, { label: mode === 'monkey' ? 'Fire' : mode === 'train' ? 'Toss' : 'Let go', onPress() { if (!L.running && t >= endT) reset(); L.toggle(); } });
      F.button('', reset, { icon: 'reset', title: 'Start again' });
      if (mode === 'drop') {
        const ppm = 120, H = 1.8, xe = 150, tFall = Math.sqrt(2 * H / gA);
        endT = tFall;
        S('rect', { x: 16, y: yG - H * ppm, width: xe - 16, height: 12, rx: 3, fill: COL.wood, stroke: COL.woodDark, 'stroke-width': 1.5 }, F.back);
        [30, xe - 26].forEach((x) => S('rect', { x, y: yG - H * ppm + 12, width: 10, height: H * ppm - 12, fill: COL.woodDark }, F.back));
        const A = S('circle', { r: 10, fill: COL.red, stroke: '#7a2a1a', 'stroke-width': 1.5 }, objs);
        const B = S('circle', { r: 10, fill: COL.blue, stroke: '#244a75', 'stroke-width': 1.5 }, objs);
        const xa = xe - 24, xb0 = xe - 2;
        const yAt = (tt) => yG - Math.max(0, H - 0.5 * gA * tt * tt) * ppm - 10;
        drawFn = function () {
          const tt = Math.min(t, tFall);
          set(A, { cx: xa, cy: yAt(tt) });
          set(B, { cx: xb0 + v * tt * ppm, cy: yAt(tt) });
          trails.innerHTML = '';
          for (let s2 = 0.1; s2 <= tt + 1e-9; s2 += 0.1) {
            const y = yAt(s2), xb = xb0 + v * s2 * ppm;
            S('line', { x1: xa, y1: y, x2: xb, y2: y, stroke: COL.faint, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, trails);
            S('circle', { cx: xa, cy: y, r: 9, fill: 'none', stroke: COL.red, 'stroke-width': 1, opacity: 0.45 }, trails);
            S('circle', { cx: xb, cy: y, r: 9, fill: 'none', stroke: COL.blue, 'stroke-width': 1, opacity: 0.45 }, trails);
          }
          const landed = t >= tFall - 1e-9;
          K.say(msg, landed ? 'Both land after ' + tFall.toFixed(2) + ' s' : 't = ' + t.toFixed(2) + ' s');
          msg.setAttribute('fill', landed ? COL.green : COL.ink);
          K.say(sub, 'Red is let go; blue is flicked off at ' + v.toFixed(1) + ' m/s · circles every 0.1 s');
        };
        F.slider({ label: 'Flick', min: 0, max: 3.5, step: 0.1, value: Math.min(3.5, v), w: 110, vw: 60, fmt: (x) => x.toFixed(1) + ' m/s', onInput(x) { v = x; reset(); } });
      } else if (mode === 'monkey') {
        const ppm = 62, X = 7.4, Y = 4.4, h0 = 0.45, x0 = 0.5;
        const W = (x, y) => [16 + x * ppm, yG - y * ppm];
        endT = 2.2;
        S('path', { d: 'M' + fx(W(x0, 0)[0] - 8) + ' ' + yG + 'l6 -26h10l6 26Z', fill: COL.woodDark }, F.back);
        S('path', { d: 'M' + (F.w - 16) + ' ' + fx(yG - Y * ppm - 18) + 'H' + fx(W(X, 0)[0] - 26) + 'l-14 -8', fill: 'none', stroke: COL.woodDark, 'stroke-width': 9, 'stroke-linecap': 'round' }, F.back);
        const a0 = W(x0, h0), a1 = W(X, Y);
        S('line', { x1: a0[0], y1: a0[1], x2: a1[0], y2: a1[1], stroke: COL.red, 'stroke-width': 1.2, 'stroke-dasharray': '6 5', opacity: 0.7 }, F.back);
        T(F.back, (a0[0] + a1[0]) / 2 - 10, (a0[1] + a1[1]) / 2 - 12, 'line of aim', { size: 11, fill: COL.red, anchor: 'end' });
        const monkey = S('g', null, objs);
        S('path', { d: 'M-4 10q-16 8 -10 24', fill: 'none', stroke: '#6b4318', 'stroke-width': 3, 'stroke-linecap': 'round' }, monkey);
        S('ellipse', { cx: 0, cy: 10, rx: 11, ry: 14, fill: '#9a6a3a', stroke: '#5a3a18', 'stroke-width': 1.5 }, monkey);
        S('circle', { cx: 0, cy: -10, r: 10, fill: '#9a6a3a', stroke: '#5a3a18', 'stroke-width': 1.5 }, monkey);
        S('ellipse', { cx: 0, cy: -7, rx: 7, ry: 5.5, fill: '#e8c89c' }, monkey);
        S('circle', { cx: -3, cy: -12, r: 1.5, fill: COL.ink }, monkey);
        S('circle', { cx: 3, cy: -12, r: 1.5, fill: COL.ink }, monkey);
        S('path', { d: 'M-8 2l-8 -22M8 2l8 -22', stroke: '#6b4318', 'stroke-width': 4, 'stroke-linecap': 'round' }, monkey);
        const dart = S('g', null, objs);
        S('line', { x1: -14, y1: 0, x2: 8, y2: 0, stroke: COL.ink2, 'stroke-width': 3 }, dart);
        S('path', { d: 'M8 -6a6 6 0 0 1 0 12Z', fill: COL.red }, dart);
        S('path', { d: 'M-14 0l-6 -5M-14 0l-6 5', stroke: COL.gold, 'stroke-width': 2.5 }, dart);
        [msg, sub].forEach((el) => { el.setAttribute('x', 20); el.setAttribute('text-anchor', 'start'); });
        const ang = Math.atan2(Y - h0, X - x0);
        drawFn = function () {
          const vx = v * Math.cos(ang), vy0 = v * Math.sin(ang);
          const tx = (X - x0) / vx;   // when the dart reaches the monkey's line
          const dyAt = (s2) => h0 + vy0 * s2 - 0.5 * gA * s2 * s2;
          const tGround = (vy0 + Math.sqrt(vy0 * vy0 + 2 * gA * h0)) / gA;
          const hit = tx < tGround && dyAt(tx) > 0.3;
          const stopT = hit ? tx : Math.min(tGround, 2.2);
          endT = stopT + 0.35;
          const td = Math.min(t, stopT);
          // the monkey lets go at the moment of the shot
          const mT = hit ? Math.min(t, tx) : t;
          const my = Math.max(0.35, Y - 0.5 * gA * mT * mT);
          const m = W(X, my);
          monkey.setAttribute('transform', tr(m[0], m[1] + 20));
          const dp = W(x0 + vx * td, Math.max(0, dyAt(td)));
          dart.setAttribute('transform', tr(dp[0], dp[1], -Math.atan2(vy0 - gA * td, vx) * 180 / Math.PI));
          trails.innerHTML = '';
          const pts = [];
          for (let s2 = 0; s2 <= td + 1e-9; s2 += 0.02) pts.push(W(x0 + vx * s2, Math.max(0, dyAt(s2))));
          S('path', { d: K.path(pts), fill: 'none', stroke: COL.ink2, 'stroke-width': 1.5, 'stroke-dasharray': '2 3' }, trails);
          if (t >= stopT && hit) { K.say(msg, 'Boing! Right on the nose'); msg.setAttribute('fill', COL.green); K.say(sub, 'Both fell ' + (0.5 * gA * tx * tx).toFixed(2) + ' m below the line of aim in the same time'); }
          else if (t >= stopT) { K.say(msg, 'Too slow: it lands short'); msg.setAttribute('fill', COL.red); K.say(sub, 'It reached the ground before it reached the monkey'); }
          else { K.say(msg, ''); K.say(sub, 'A toy dart with a sucker, and a very sporting monkey'); }
        };
        F.slider({ label: 'Dart speed', min: 5, max: 16, step: 0.5, value: v, w: 110, vw: 64, fmt: (x) => x.toFixed(1) + ' m/s', onInput(x) { v = x; reset(); } });
      } else {
        // a ball tossed straight up inside a train moving steadily to the right
        const ppm = 110, V = 2.2, v0 = 2.7, tf = 2 * v0 / gA, hx = 0.9;
        endT = tf + 0.15;
        const scenery = S('g', null, F.back);
        const car = S('g', null, objs);
        S('rect', { x: -10, y: -170, width: 300, height: 150, rx: 14, fill: '#d86b4a', stroke: '#7a3322', 'stroke-width': 2 }, car);
        S('rect', { x: 10, y: -150, width: 260, height: 80, rx: 6, fill: '#eef5fa', stroke: '#7a3322', 'stroke-width': 1.5 }, car);
        [40, 240].forEach((x) => S('circle', { cx: x, cy: -12, r: 12, fill: '#333', stroke: '#111' }, car));
        S('circle', { cx: hx * ppm, cy: -122, r: 9, fill: COL.skin, stroke: COL.ink, 'stroke-width': 1.3 }, car);
        S('path', { d: 'M' + fx(hx * ppm) + ' -113v34M' + fx(hx * ppm) + ' -103l14 8', stroke: COL.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, car);
        const ball = S('circle', { r: 7, fill: COL.gold, stroke: COL.goldDark, 'stroke-width': 1.5 }, over);
        const path = S('path', { fill: 'none', stroke: COL.goldDark, 'stroke-width': 1.8, 'stroke-dasharray': '3 3' }, trails);
        drawFn = function () {
          const tt = Math.min(t, tf), carX = frame === 'train' ? 150 : 40 + V * t * ppm;
          car.setAttribute('transform', tr(carX, yG));
          scenery.innerHTML = '';
          const shift = frame === 'train' ? -((V * t * ppm) % 120) : 0;
          for (let x = 16 + shift; x < F.w; x += 120) if (x > 12) { S('line', { x1: x, y1: yG, x2: x, y2: yG - 190, stroke: COL.faint, 'stroke-width': 4 }, scenery); S('circle', { cx: x, cy: yG - 194, r: 5, fill: COL.faint }, scenery); }
          const handY = yG - 103, hand0 = hx * ppm + 14;
          const bx = carX + hand0, by = handY - (v0 * tt - 0.5 * gA * tt * tt) * ppm;
          set(ball, { cx: bx, cy: by });
          const pts = [];
          for (let s2 = 0; s2 <= tt + 1e-9; s2 += 0.02) pts.push([frame === 'train' ? bx : 40 + V * s2 * ppm + hand0, handY - (v0 * s2 - 0.5 * gA * s2 * s2) * ppm]);
          path.setAttribute('d', K.path(pts));
          K.say(msg, t >= tf ? 'Back in the hand' : '');
          msg.setAttribute('fill', COL.green);
          K.say(sub, frame === 'train' ? 'Seen from inside the train: straight up and down' : 'Seen from the platform: a curve, as the ball keeps the train’s speed');
        };
        F.seg({ options: [['train', 'From the train'], ['ground', 'From the platform']], value: frame, onChange(x) { frame = x; reset(); } });
      }
      drawFn();
      return F.inst({ solve() { reset(); L.start(); }, getState: () => ({ v, frame }), setState(s2) { v = s2.v || v; frame = s2.frame || frame; reset(); } });
    }
  });

  /* Pendulums: heavy and light bobs, long and short strings */
  C.figure('phys-pendulum', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 380, bar: 1 });
      const mode = P.mode || 'mass', gA = 9.81, ppm = 150, top = 46;
      let L2 = P.len2 || 1.0;
      const bobs = mode === 'mass'
        ? [{ L: 1.0, r: 15, fill: '#5d6270', stroke: '#2d3038', name: 'lead, 2 kg' }, { L: 1.0, r: 11, fill: '#e2c28a', stroke: COL.woodDark, name: 'cork, 20 g' }]
        : [{ L: 0.5, r: 12, fill: COL.red, stroke: '#7a2a1a', name: 'A' }, { L: L2, r: 12, fill: COL.blue, stroke: '#244a75', name: 'B' }];
      const xs = [190, 420];
      S('rect', { x: 100, y: top - 12, width: 420, height: 12, rx: 3, fill: COL.wood, stroke: COL.woodDark, 'stroke-width': 1.5 }, F.back);
      const els = bobs.map((b, i) => {
        const gg = S('g', null, F.scene);
        const str = S('line', { x1: xs[i], y1: top, stroke: COL.ink2, 'stroke-width': 1.5 }, gg);
        const bob = S('circle', { r: b.r, fill: b.fill, stroke: b.stroke, 'stroke-width': 2 }, gg);
        const lab = T(gg, xs[i], F.sh - 30, '', { anchor: 'middle', size: 12.5, weight: 700 });
        const lab2 = T(gg, xs[i], F.sh - 12, '', { anchor: 'middle', size: 12, fill: COL.ink2 });
        return { str, bob, lab, lab2, th: 0.21, w: 0, swings: 0, last: 0 };
      });
      let t = 0;
      const period = (L) => 2 * Math.PI * Math.sqrt(L / gA);
      function resetAll() { t = 0; els.forEach((e) => { e.th = 0.21; e.w = 0; e.swings = 0; e.last = 0; }); }
      function draw() {
        els.forEach((e, i) => {
          const b = bobs[i], len = Math.min(b.L, 2.2) * ppm * (b.L > 1.6 ? 1.6 / Math.min(b.L, 2.2) : 1);
          const x = xs[i] + len * Math.sin(e.th), y = top + len * Math.cos(e.th);
          set(e.str, { x2: x, y2: y });
          set(e.bob, { cx: x, cy: y });
          K.say(e.lab, (mode === 'mass' ? b.name : b.name + ': ' + b.L.toFixed(2) + ' m') + (b.L > 1.6 ? ' (drawn shorter)' : ''));
          K.say(e.lab2, 'period ' + period(b.L).toFixed(2) + ' s · swings ' + e.swings);
        });
      }
      const Lp = F.loop((dt) => {
        let s = dt;
        while (s > 0) {
          const h = Math.min(0.002, s); s -= h; t += h;
          els.forEach((e, i) => {
            const b = bobs[i];
            // the true (not small-angle) pendulum, RK2
            const a1 = -gA / b.L * Math.sin(e.th), thm = e.th + e.w * h / 2, wm = e.w + a1 * h / 2;
            const before = e.w;
            e.th += wm * h; e.w += -gA / b.L * Math.sin(thm) * h;
            if (before > 0 && e.w <= 0) e.swings++;
          });
        }
        draw();
        return true;
      });
      K.playButton(F, Lp, { label: 'Swing' });
      F.button('', () => { Lp.stop(); resetAll(); draw(); }, { icon: 'reset', title: 'Hold them back again' });
      if (mode !== 'mass') F.slider({ label: 'Length of B', min: 0.5, max: 2.5, step: 0.05, value: L2, w: 130, vw: 56, fmt: (x) => x.toFixed(2) + ' m', onInput(x) { L2 = x; bobs[1].L = x; Lp.stop(); resetAll(); draw(); } });
      const note = T(F.scene, F.w / 2, 22, '', { anchor: 'middle', size: 13, weight: 700, fill: COL.ink2 });
      K.say(note, mode === 'mass' ? 'Same string, very different bobs' : 'B takes ' + (period(L2) / period(0.5)).toFixed(2) + '× as long as A');
      const prevSync = F.onSync;
      F.onSync = () => { if (prevSync) prevSync(); K.say(note, mode === 'mass' ? 'Same string, very different bobs' : 'B takes ' + (period(bobs[1].L) / period(0.5)).toFixed(2) + '× as long as A'); };
      resetAll();
      draw();
      return F.inst({ solve() { Lp.stop(); resetAll(); Lp.start(); }, getState: () => ({ L2 }), setState(s) { if (s.L2) { L2 = s.L2; if (mode !== 'mass') bobs[1].L = L2; } resetAll(); draw(); } });
    }
  });

  /* Two pendulum clocks: one at sea level, one on a mountain (or in a warm room) */
  C.figure('phys-clock', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 360, bar: 1 });
      const warm = P.case === 'warm';
      // how much slower the second clock's pendulum swings
      const ratio = warm ? Math.sqrt(1 + 19e-6 * 10) : 1 / (6371 / 6376);   // brass +10 °C, or 5 km up: g falls as 1/r²
      const perDay = 86400 * (1 - 1 / ratio);
      const faces = [[160, warm ? 'Cool room (20 °C)' : 'Sea level'], [460, warm ? 'Warm room (30 °C)' : 'Mountain hut, 5 km up']];
      const hands = faces.map((f) => {
        const gg = S('g', { transform: tr(f[0], 130) }, F.scene);
        S('circle', { r: 88, fill: '#fffdf6', stroke: COL.woodDark, 'stroke-width': 6 }, gg);
        for (let i = 0; i < 60; i++) { const a = i * TAU / 60, r1 = i % 5 === 0 ? 72 : 78; S('line', { x1: r1 * Math.sin(a), y1: -r1 * Math.cos(a), x2: 82 * Math.sin(a), y2: -82 * Math.cos(a), stroke: COL.ink, 'stroke-width': i % 5 === 0 ? 2.5 : 1 }, gg); }
        [12, 3, 6, 9].forEach((n, i) => T(gg, 60 * Math.sin(i * Math.PI / 2), -60 * Math.cos(i * Math.PI / 2) + 5, String(n), { anchor: 'middle', size: 14, weight: 700, serif: true }));
        const hh = S('line', { x1: 0, y1: 0, x2: 0, y2: -42, stroke: COL.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, gg);
        const mm = S('line', { x1: 0, y1: 0, x2: 0, y2: -62, stroke: COL.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, gg);
        const ss = S('line', { x1: 0, y1: 12, x2: 0, y2: -70, stroke: COL.red, 'stroke-width': 1.5 }, gg);
        S('circle', { r: 4, fill: COL.ink }, gg);
        T(F.scene, f[0], 248, f[1], { anchor: 'middle', size: 13, weight: 700 });
        return { hh, mm, ss };
      });
      const lag = T(F.scene, F.w / 2, 284, '', { anchor: 'middle', size: 15, weight: 800, fill: COL.red });
      const day = T(F.scene, F.w / 2, 26, '', { anchor: 'middle', size: 13, fill: COL.ink2 });
      let t = 0;   // true seconds since both clocks said noon
      function show(hd, sec) {
        const s = sec % 60, m = (sec / 60) % 60, h = (sec / 3600) % 12;
        hd.hh.setAttribute('transform', 'rotate(' + fx(h * 30) + ')');
        hd.mm.setAttribute('transform', 'rotate(' + fx(m * 6) + ')');
        hd.ss.setAttribute('transform', 'rotate(' + fx(Math.floor(s) * 6) + ')');
      }
      function draw() {
        show(hands[0], t);
        show(hands[1], t / ratio);
        const behind = t - t / ratio;
        K.say(day, 'Both clocks were set to noon together · true time passed: ' + (t / 3600).toFixed(1) + ' hours');
        K.say(lag, 'The ' + (warm ? 'warm' : 'mountain') + ' clock is ' + behind.toFixed(1) + ' s behind');
      }
      let fast = 3600;
      const L = F.loop((dt) => { t = Math.min(86400, t + dt * fast); draw(); return t < 86400; });
      K.playButton(F, L, { label: 'Run a day', w: 118, onPress() { if (!L.running && t >= 86400) t = 0; L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; draw(); }, { icon: 'reset', title: 'Set both to noon' });
      const note = F.note(0);
      K.say(note, 'One hour of true time a second');
      draw();
      void perDay;
      return F.inst({ solve() { L.stop(); t = 0; L.start(); }, getState: () => ({ t: Math.round(t) }), setState(s) { t = clamp(+s.t || 0, 0, 86400); draw(); } });
    }
  });

  /* Races on curves: the brachistochrone, the tautochrone, and things rolling down a slope */
  C.figure('phys-race', {
    draw(g, P, ctx) {
      const mode = P.mode || 'brach';
      const nObj = mode === 'roll' ? (P.objects || [0, 0, 0, 0]).length : 0;
      const F = K.frame(g, ctx, { w: 620, h: mode === 'roll' ? (nObj > 2 ? 440 : 330) : 400, bar: 1 });
      const gA = 9.81;
      const tracksG = S('g', null, F.scene), balls = S('g', null, F.scene), over = S('g', null, F.scene);
      const clock = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 15, weight: 800 });
      let t = 0, slow = 0.3, racers = [], tEnd = 1;
      // a polyline track (metres, y down) with the time to reach each point, from rest at y = 0
      function timed(pts, k) {
        const cum = [0];
        for (let i = 1; i < pts.length; i++) {
          const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          const v1 = Math.sqrt(Math.max(0, 2 * gA * pts[i - 1][1] / (1 + k))), v2 = Math.sqrt(Math.max(0, 2 * gA * pts[i][1] / (1 + k)));
          cum.push(cum[i - 1] + (v1 + v2 > 1e-12 ? 2 * l / (v1 + v2) : 0));
        }
        return cum;
      }
      function posAt(r, tt) {
        const c = r.cum, n = c.length;
        if (tt >= c[n - 1]) return r.pts[n - 1];
        let lo = 0, hi = n - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= tt) lo = m; else hi = m; }
        const u = (tt - c[lo]) / Math.max(1e-12, c[hi] - c[lo]);
        return [lerp(r.pts[lo][0], r.pts[hi][0], u), lerp(r.pts[lo][1], r.pts[hi][1], u)];
      }
      let ox = 60, oy = 40, ppm = 80;
      const W = (p) => [ox + p[0] * ppm, oy + p[1] * ppm];
      if (mode === 'brach') {
        const a = 1, X = Math.PI * a, Y = 2 * a, N = 500;
        ppm = 84; ox = 70; oy = 46;
        const straight = [], cyc = [], arc = [], steep = [];
        for (let i = 0; i <= N; i++) { const u = i / N; straight.push([X * u, Y * u]); const ph = Math.PI * u; cyc.push([a * (ph - Math.sin(ph)), a * (1 - Math.cos(ph))]); }
        const Rc = (X * X + Y * Y) / (2 * Y), c0 = [X, Y - Rc], a0 = Math.atan2(0 - c0[1], 0 - c0[0]), a1 = Math.PI / 2;
        for (let i = 0; i <= N; i++) { const an = lerp(a0, a1, i / N); arc.push([c0[0] + Rc * Math.cos(an), c0[1] + Rc * Math.sin(an)]); }
        const r0 = 0.35;
        for (let i = 0; i <= 120; i++) steep.push([0, (Y - r0) * i / 120]);
        for (let i = 1; i <= 80; i++) { const an = Math.PI - i / 80 * Math.PI / 2; steep.push([r0 + r0 * Math.cos(an), Y - r0 + r0 * Math.sin(an)]); }
        for (let i = 1; i <= 200; i++) steep.push([r0 + (X - r0) * i / 200, Y]);
        racers = [
          { name: 'straight line', pts: straight, color: COL.blue },
          { name: 'circle arc', pts: arc, color: COL.green },
          { name: 'straight down, then along', pts: steep, color: COL.purple },
          { name: 'cycloid', pts: cyc, color: COL.red }
        ];
        S('circle', { cx: W([0, 0])[0], cy: W([0, 0])[1], r: 4, fill: COL.ink }, tracksG);
        T(tracksG, W([0, 0])[0] - 8, W([0, 0])[1] + 4, 'A', { anchor: 'end', size: 14, weight: 800 });
        T(tracksG, W([X, Y])[0] + 10, W([X, Y])[1] + 5, 'B', { size: 14, weight: 800 });
      } else if (mode === 'tauto') {
        const a = 1, N = 400;
        ppm = 80; ox = (F.w - TAU * a * ppm) / 2; oy = 60;
        const bowl = [];
        for (let i = 0; i <= N; i++) { const ph = TAU * i / N; bowl.push(W([a * (ph - Math.sin(ph)), a * (1 - Math.cos(ph))])); }
        S('path', { d: K.path(bowl), fill: 'none', stroke: COL.woodDark, 'stroke-width': 5, 'stroke-linecap': 'round' }, tracksG);
        const w = Math.sqrt(gA / (4 * a));
        [[0.35, COL.red], [1.1, COL.blue], [2.2, COL.green]].forEach((q) => {
          const s0 = 4 * a * Math.cos(q[0] / 2);
          racers.push({ color: q[1], name: 'from ' + (a * (1 + Math.cos(q[0]))).toFixed(2) + ' m up', s0, fn: (tt) => { const s = s0 * Math.cos(w * tt); const ph = 2 * Math.acos(clamp(s / (4 * a), -1, 1)); return [a * (ph - Math.sin(ph)), a * (1 - Math.cos(ph))]; }, finish: Math.PI / (2 * w) });
        });
        S('line', { x1: W([Math.PI * a, 0])[0], y1: oy - 10, x2: W([Math.PI * a, 0])[0], y2: W([0, 2 * a])[1] + 14, stroke: COL.faint, 'stroke-dasharray': '4 4' }, tracksG);
        T(tracksG, W([Math.PI * a, 2 * a])[0], W([0, 2 * a])[1] + 28, 'bottom', { anchor: 'middle', size: 11, fill: COL.muted });
      } else {
        const objs = P.objects || ['hoop', 'shell', 'disc', 'ball'];
        const K2 = { hoop: [1, 'hoop (ring)'], shell: [2 / 3, 'hollow ball'], disc: [0.5, 'solid disc'], ball: [0.4, 'solid ball'], iron: [0.4, 'iron ball, 5 kg'], wood: [0.4, 'wooden ball, 50 g'], can: [0.5, 'can of soup'] };
        const th = 14 * Math.PI / 180, Lm = 3;
        ppm = 100;
        const drop = Lm * Math.sin(th) * ppm, gap = objs.length > 1 ? (F.sh - 60 - drop) / (objs.length - 1) : 0;
        objs.forEach((id, i) => {
          const kk = K2[id][0], y0 = 34 + i * gap;
          const x0 = 40, x1 = x0 + Lm * Math.cos(th) * ppm, y1 = y0 + Lm * Math.sin(th) * ppm;
          S('line', { x1: x0, y1: y0 + 13, x2: x1 + 30, y2: y1 + 13 + 30 * Math.tan(th), stroke: COL.woodDark, 'stroke-width': 3 }, tracksG);
          S('line', { x1: x1, y1: y1 + 2, x2: x1, y2: y1 + 22, stroke: COL.red, 'stroke-width': 2 }, tracksG);
          const acc = gA * Math.sin(th) / (1 + kk);
          racers.push({ color: [COL.purple, COL.blue, COL.green, COL.red, '#5d6270', COL.wood][i % 6], name: K2[id][1], id, finish: Math.sqrt(2 * Lm / acc), acc, x0, y0, th, x1, y1 });
        });
      }
      if (mode === 'brach') racers.forEach((r) => { r.cum = timed(r.pts, 0); r.finish = r.cum[r.cum.length - 1]; S('path', { d: K.path(r.pts.map(W)), fill: 'none', stroke: r.color, 'stroke-width': 3.2, opacity: 0.8, 'stroke-linejoin': 'round' }, tracksG); });
      tEnd = Math.max(...racers.map((r) => r.finish)) + 0.15;
      racers.forEach((r) => {
        r.el = S('g', null, balls);
        const rad = mode === 'roll' ? 12 : 9;
        if (mode === 'roll' && r.id === 'hoop') { S('circle', { r: rad, fill: 'none', stroke: r.color, 'stroke-width': 4 }, r.el); }
        else if (mode === 'roll' && r.id === 'shell') { S('circle', { r: rad, fill: '#fff', stroke: r.color, 'stroke-width': 3 }, r.el); S('circle', { r: rad - 4, fill: 'none', stroke: r.color, 'stroke-width': 1, 'stroke-dasharray': '2 2' }, r.el); }
        else S('circle', { r: mode === 'roll' && r.id === 'wood' ? rad * 0.8 : rad, fill: r.color, stroke: '#2a2418', 'stroke-width': 1.5 }, r.el);
        S('line', { x1: 0, y1: 0, x2: 0, y2: -(rad - 2), stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }, r.el);
        r.lab = T(over, 0, 0, '', { size: 11.5, weight: 700, fill: r.color });
      });
      function draw() {
        const done = [];
        racers.forEach((r, i) => {
          const tt = Math.min(t, r.finish);
          let p, rot = 0, lx, ly;
          if (mode === 'brach') { p = W(posAt(r, tt)); lx = F.w - 20; ly = 56 + i * 18; r.lab.setAttribute('text-anchor', 'end'); }
          else if (mode === 'tauto') { p = W(r.fn(tt)); p[1] -= 9; lx = 20; ly = F.sh - 70 + i * 16; }
          else {
            const s = 0.5 * r.acc * tt * tt;
            p = [r.x0 + s * Math.cos(r.th) * ppm + 12 * Math.sin(r.th), r.y0 + s * Math.sin(r.th) * ppm + 13 - 12 * Math.cos(r.th)];
            rot = s / (12 / ppm) * 180 / Math.PI;
            lx = r.x1 + 44; ly = r.y1 + 18;
          }
          r.el.setAttribute('transform', tr(p[0], p[1], rot));
          if (t >= r.finish) done.push(r);
          set(r.lab, { x: lx, y: ly });
          K.say(r.lab, r.name + ': ' + (t >= r.finish ? r.finish.toFixed(3) + ' s' : '…'));
        });
        K.say(clock, t.toFixed(2) + ' s');
      }
      const L = F.loop((dt) => { t = Math.min(tEnd, t + dt * slow); draw(); return t < tEnd; });
      K.playButton(F, L, { label: 'Race', onPress() { if (!L.running && t >= tEnd) t = 0; L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; draw(); }, { icon: 'reset', title: 'Back to the start' });
      const sb = F.button('Real speed', () => { slow = slow < 1 ? 1 : 0.3; sb.on(slow === 1); });
      const note = F.note(0);
      K.say(note, mode === 'brach' ? 'Frictionless beads, starting from rest at A' : mode === 'tauto' ? 'Three beads let go together at different heights' : 'All rolling without slipping on a 14° slope, 3 m long');
      draw();
      return F.inst({ solve() { L.stop(); t = 0; L.start(); }, getState: () => ({ t: +t.toFixed(3) }), setState(s) { t = clamp(+s.t || 0, 0, tEnd); draw(); } });
    }
  });

  /* Books stacked over the edge of a table: drag them; the centres of mass decide */
  C.figure('phys-overhang', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: P.adjust ? 420 : 380, bar: 1 });
      let n = P.n || 4;
      const edgeX = 170, yTop = F.sh - 40;
      let Lpx = 150, Hpx = 24;
      let xs = [];   // left end of each book, in book lengths, 0 = table edge; book 0 is at the bottom
      const COLS = ['#b0472f', '#3a6ea5', '#4f7f3a', '#d9a520', '#7d52d6', '#2a8f8a', '#c24c85', '#8a5a26', '#5d6270', '#d9772b', '#3a3020', '#6fa3d6'];
      S('rect', { x: 16, y: yTop, width: edgeX - 16, height: 16, rx: 3, fill: COL.table, stroke: COL.tableDark, 'stroke-width': 1.5 }, F.back);
      S('rect', { x: 30, y: yTop + 16, width: 12, height: F.sh - yTop - 16, fill: COL.tableDark }, F.back);
      S('rect', { x: edgeX - 30, y: yTop + 16, width: 12, height: F.sh - yTop - 16, fill: COL.tableDark }, F.back);
      S('line', { x1: edgeX, y1: 20, x2: edgeX, y2: yTop, stroke: COL.red, 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: 0.6 }, F.back);
      T(F.back, edgeX + 4, yTop + 12, 'edge of the table', { size: 10, fill: COL.red });
      const booksG = S('g', null, F.scene), cmG = S('g', null, F.scene);
      const info = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 14, weight: 800 });
      const info2 = T(F.scene, F.w - 20, 48, '', { anchor: 'end', size: 12, fill: COL.ink2 });
      function layout() { Hpx = Math.min(26, (yTop - 70) / Math.max(4, n)); Lpx = n > 6 ? 130 : 150; }
      function fresh() { xs = []; for (let i = 0; i < n; i++) xs.push(-1.02); }
      function best() {
        // harmonic stack: the book k from the top sticks out 1/(2k) beyond the one below (and the bottom one 1/(2n) beyond the edge)
        const R = [];
        for (let i = 0; i < n; i++) { let s = 0; for (let j = n - i; j <= n; j++) s += 1 / (2 * j); R.push(s * 0.997); }
        return R.map((r) => r - 1);
      }
      function check() {
        // for each book, the centre of mass of all the books above it must lie over it; the whole stack over the table
        const bad = [];
        for (let i = 0; i < n; i++) {
          let s = 0; for (let j = i; j < n; j++) s += xs[j] + 0.5;
          const cm = s / (n - i);
          const lo = i === 0 ? -99 : xs[i - 1], hi = i === 0 ? 0 : xs[i - 1] + 1;
          bad.push({ cm, ok: cm <= hi + 1e-9 && cm >= lo - 1e-9, i });
        }
        return bad;
      }
      const els = [];
      function build() {
        booksG.innerHTML = '';
        els.length = 0;
        for (let i = 0; i < n; i++) {
          const gg = S('g', { class: 'fk-drag' }, booksG);
          const r = S('rect', { x: 0, y: 0, width: Lpx, height: Hpx - 2, rx: 3, fill: COLS[i % COLS.length], stroke: 'rgba(0,0,0,.45)', 'stroke-width': 1.3 }, gg);
          S('line', { x1: 8, y1: 4, x2: 8, y2: Hpx - 6, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 2 }, gg);
          S('line', { x1: Lpx - 10, y1: 4, x2: Lpx - 10, y2: Hpx - 6, stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1.5 }, gg);
          els.push({ gg, r });
          let grab = 0;
          K.onDrag(gg, F.scene, ctx, {
            start(p) { grab = (p[0] - edgeX) / Lpx - xs[i]; },
            move(p) { xs[i] = clamp((p[0] - edgeX) / Lpx - grab, -2.2, 2.2); draw(); },
            end() { draw(); }
          });
        }
      }
      function draw() {
        const st = check();
        const firstBad = st.find((q) => !q.ok);
        els.forEach((e, i) => {
          const y = yTop - (i + 1) * Hpx;
          let rot = 0, px = edgeX + xs[i] * Lpx;
          if (firstBad && i >= firstBad.i) {
            // lean the part above the failing support a little, round the corner it would fall over
            const k = firstBad.i, hi = k === 0 ? 0 : xs[k - 1] + 1, lo = k === 0 ? -99 : xs[k - 1], right = firstBad.cm > hi;
            rot = right ? 6 : -6;
            e.gg.setAttribute('transform', 'rotate(' + rot + ' ' + fx(edgeX + (right ? hi : lo) * Lpx) + ' ' + fx(yTop - k * Hpx) + ') translate(' + fx(px) + ' ' + fx(y) + ')');
          } else e.gg.setAttribute('transform', tr(px, y));
        });
        cmG.innerHTML = '';
        st.forEach((q) => {
          const x = edgeX + q.cm * Lpx, y = yTop - q.i * Hpx;
          S('line', { x1: x, y1: y - (n - q.i) * Hpx - 6, x2: x, y2: y + 3, stroke: q.ok ? COL.green : COL.red, 'stroke-width': 1.2, 'stroke-dasharray': '2 3' }, cmG);
          S('path', { d: 'M' + fx(x) + ' ' + fx(y + 1) + 'l-4 -6h8Z', fill: q.ok ? COL.green : COL.red }, cmG);
        });
        const topRight = xs[n - 1] + 1, overhang = Math.max(...xs.map((x) => x + 1));
        if (firstBad) { K.say(info, 'This stack would topple'); info.setAttribute('fill', COL.red); }
        else { K.say(info, 'Stable · overhang ' + overhang.toFixed(3) + ' book lengths'); info.setAttribute('fill', xs[n - 1] >= 0 ? COL.green : COL.ink); }
        K.say(info2, xs[n - 1] >= 0 && !firstBad ? 'The top book is entirely beyond the edge!' : 'Drag the books sideways · triangles: centre of mass of all the books above each support');
        void topRight;
      }
      F.button('Build the best stack', () => { const target = best(); const from = xs.slice(); F.tween(900, (u) => { xs = from.map((x, i) => lerp(x, target[i], u)); draw(); }); }, { icon: 'bolt', primary: true });
      F.button('', () => { fresh(); draw(); }, { icon: 'reset', title: 'Put them back on the table' });
      let sl = null;
      if (P.adjust) sl = F.slider({ label: 'Books', min: 1, max: 12, step: 1, value: n, w: 120, vw: 30, fmt: (v) => String(v), onInput(v) { n = v; layout(); fresh(); build(); draw(); } });
      layout(); fresh(); build(); draw();
      return F.inst({
        solve() { const target = best(); xs = target; draw(); },
        getState: () => ({ n, xs: xs.map((x) => +x.toFixed(4)) }),
        setState(s) { if (s.n && P.adjust) { n = s.n; if (sl) sl.set(n, true); layout(); build(); } if (Array.isArray(s.xs) && s.xs.length === n) xs = s.xs.slice(); draw(); }
      });
    }
  });

  /* A broom balanced on a finger, sawn in two at the balance point, and weighed */
  C.figure('phys-broom', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 360, bar: 1 });
      // metres and kilograms: a stick of 1.2 m and 0.4 kg, a brush 0.3 m long of 0.6 kg on its end
      const ms = 0.4, Ls = 1.2, mb = 0.6, Lb = 0.3;
      const cm = (ms * Ls / 2 + mb * (Ls + Lb / 2)) / (ms + mb);
      const mLeft = ms * cm / Ls, mRight = ms + mb - mLeft;
      const ppm = 300, x0 = 80, yB = 110;
      const X = (m) => x0 + m * ppm * 0.95;
      const left = S('g', null, F.scene), right = S('g', null, F.scene), top = S('g', null, F.scene);
      function stick(gp, a, b) { S('rect', { x: X(a), y: -5, width: X(b) - X(a), height: 10, rx: 4, fill: '#c98c45', stroke: COL.woodDark, 'stroke-width': 1.5 }, gp); }
      stick(left, 0, cm);
      stick(right, cm, Ls);
      S('path', { d: 'M' + fx(X(Ls) - 4) + ' -16H' + fx(X(Ls + Lb)) + 'l6 4v24l-6 4H' + fx(X(Ls) - 4) + 'Z', fill: '#d9b24a', stroke: '#8a6a1a', 'stroke-width': 1.5 }, right);
      for (let k = 0; k < 9; k++) S('line', { x1: X(Ls) + 6 + k * 9, y1: -14, x2: X(Ls) + 6 + k * 9, y2: 14, stroke: '#8a6a1a', 'stroke-width': 1 }, right);
      const finger = S('path', { d: 'M' + fx(X(cm) - 12) + ' ' + (yB + 60) + 'V' + (yB + 16) + 'q0 -10 12 -10t12 10V' + (yB + 60) + 'Z', fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, F.back);
      const saw = S('g', { opacity: 0 }, top);
      S('path', { d: 'M0 -34h14v60h-14Z', fill: '#c3c8d2', stroke: '#5d6475', 'stroke-width': 1.3 }, saw);
      S('rect', { x: -6, y: -54, width: 26, height: 22, rx: 6, fill: COL.red }, saw);
      // the balance
      const bal = S('g', { opacity: 0 }, F.scene), beam = S('g', null, bal);
      const bx = 330, by = 196;
      S('path', { d: 'M' + (bx - 10) + ' ' + (by + 70) + 'L' + bx + ' ' + by + 'L' + (bx + 10) + ' ' + (by + 70) + 'Z', fill: '#8a93a6', stroke: '#4a5060', 'stroke-width': 1.5 }, bal);
      S('rect', { x: bx - 60, y: by + 70, width: 120, height: 8, rx: 3, fill: '#8a93a6' }, bal);
      S('line', { x1: bx - 190, y1: by, x2: bx + 190, y2: by, stroke: '#4a5060', 'stroke-width': 5, 'stroke-linecap': 'round' }, beam);
      const pans = [-1, 1].map((sgn) => { const pg = S('g', null, bal); S('path', { d: 'M-50 0h100l-12 10h-76Z', fill: '#c3c8d2', stroke: '#4a5060', 'stroke-width': 1.5 }, pg); S('line', { x1: -40, y1: 0, x2: 0, y2: -46, stroke: '#4a5060' }, pg); S('line', { x1: 40, y1: 0, x2: 0, y2: -46, stroke: '#4a5060' }, pg); return { pg, sgn }; });
      const lab = T(F.scene, F.w / 2, 30, '', { anchor: 'middle', size: 14, weight: 800 });
      const lab2 = T(F.scene, F.w / 2, 50, '', { anchor: 'middle', size: 12, fill: COL.ink2 });
      let u = 0;   // 0 balanced, 0.2 sawing, 0.35 cut, then carried to the pans and weighed
      function draw() {
        const cut = clamp((u - 0.1) / 0.2, 0, 1), carry = ease(clamp((u - 0.35) / 0.35, 0, 1)), weigh = ease(clamp((u - 0.72) / 0.28, 0, 1));
        saw.setAttribute('opacity', u > 0.05 && u < 0.4 ? 1 : 0);
        saw.setAttribute('transform', tr(X(cm) - 7, yB + Math.sin(u * 90) * 6));
        const tilt = weigh * 9;   // degrees, towards the brush side
        bal.setAttribute('opacity', clamp((u - 0.3) / 0.1, 0, 1));
        beam.setAttribute('transform', 'rotate(' + fx(tilt) + ' ' + bx + ' ' + by + ')');
        const ends = [-1, 1].map((sgn) => { const a = tilt * Math.PI / 180; return [bx + sgn * 180 * Math.cos(a), by + sgn * 180 * Math.sin(a)]; });
        pans.forEach((p, i) => p.pg.setAttribute('transform', tr(ends[i][0], ends[i][1] + 46)));
        // pieces: from the finger to the pans
        const hop = Math.sin(carry * Math.PI) * 70;
        const lx = lerp(0, ends[0][0] - X(cm / 2), carry), ly = lerp(yB, ends[0][1] + 40, carry) - hop;
        const rx = lerp(0, ends[1][0] - X((cm + Ls + Lb) / 2), carry), ry = lerp(yB, ends[1][1] + 30, carry) - hop;
        left.setAttribute('transform', 'translate(' + fx(lx + (cut > 0 && carry === 0 ? -3 * cut : 0)) + ' ' + fx(ly) + ') ' + (carry > 0 ? 'rotate(0)' : ''));
        right.setAttribute('transform', 'translate(' + fx(rx + (cut > 0 && carry === 0 ? 3 * cut : 0)) + ' ' + fx(ry) + ')');
        finger.setAttribute('opacity', 1 - carry);
        if (u <= 0) { K.say(lab, 'Balanced on one finger'); K.say(lab2, 'Saw it through exactly at the balance point…'); }
        else if (u < 0.72) { K.say(lab, 'Sawn at the balance point'); K.say(lab2, ''); }
        else { K.say(lab, 'Handle piece ' + Math.round(mLeft * 1000) + ' g · brush piece ' + Math.round(mRight * 1000) + ' g'); K.say(lab2, 'The balance point is ' + Math.round(cm * 100) + ' cm from the end of the handle'); }
      }
      const L = F.loop((dt) => { u = Math.min(1, u + dt / 4.5); draw(); return u < 1; });
      K.playButton(F, L, { label: 'Saw and weigh', w: 140, onPress() { if (!L.running && u >= 1) u = 0; L.toggle(); } });
      F.button('', () => { L.stop(); u = 0; draw(); }, { icon: 'reset', title: 'Mend the broom' });
      draw();
      return F.inst({ solve() { L.stop(); u = 0; L.start(); }, getState: () => ({ u: +u.toFixed(3) }), setState(s) { u = clamp(+s.u || 0, 0, 1); draw(); } });
    }
  });

  /* Two fingers slid together under a ruler: static and sliding friction take turns */
  C.figure('phys-fingers', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 300, bar: 1 });
      const clay = P.clay || 0;   // kg of clay at 90 cm
      const Ms = 0.1, ppm = 520, x0 = 50, yS = 120, muS = 0.6, muK = 0.4, speed = 0.06;
      const cmS = (Ms * 0.5 + clay * 0.9) / (Ms + clay);
      let a0 = P.left == null ? 0.08 : P.left, b0 = P.right == null ? 0.83 : P.right;
      let a, b, off, slideR, tt, done;
      function reset() { a = a0; b = b0; off = 0; tt = 0; done = false; slideR = (cmS - a) < (b - cmS) ? true : false; }
      // stick-frame positions a (left finger), b (right finger); the stick is moved by the finger that grips
      function step(h) {
        if (done) return;
        const NL = (b - cmS), NR = (cmS - a);   // normal forces, up to a common factor
        if (slideR) { if (muK * NR > muS * NL) slideR = false; }
        else if (muK * NL > muS * NR) slideR = true;
        // both fingers move towards each other at `speed`; the gripping one carries the stick
        if (slideR) { b -= 2 * speed * h; off += speed * h; }
        else { a += 2 * speed * h; off -= speed * h; }
        tt += h;
        if (b - a < 0.006) done = true;
      }
      const stick = S('g', null, F.scene);
      S('rect', { x: 0, y: -10, width: ppm, height: 20, rx: 2, fill: '#f0d68a', stroke: '#9c7a2a', 'stroke-width': 1.5 }, stick);
      for (let c = 0; c <= 100; c++) S('line', { x1: c / 100 * ppm, y1: -10, x2: c / 100 * ppm, y2: c % 10 === 0 ? 2 : c % 5 === 0 ? -2 : -5, stroke: '#6b5520', 'stroke-width': c % 10 === 0 ? 1.4 : 0.8 }, stick);
      for (let c = 10; c < 100; c += 10) T(stick, c / 100 * ppm, 7, String(c), { anchor: 'middle', size: 7.5, fill: '#6b5520', weight: 700 });
      if (clay) S('path', { d: 'M' + fx(0.9 * ppm - 14) + ' -10q2 -18 14 -18t14 18Z', fill: '#c0503a', stroke: '#7a2a1a', 'stroke-width': 1.3 }, stick);
      const cmMark = S('path', { d: 'M' + fx(cmS * ppm) + ' -12l-6 -10h12Z', fill: COL.purple, opacity: 0 }, stick);
      const fingers = [0, 1].map((i) => {
        const gg = S('g', { class: 'fk-drag' }, F.scene);
        S('path', { d: 'M-13 90V14q0 -14 13 -14t13 14V90Z', fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, gg);
        S('path', { d: 'M-7 8q7 -6 14 0v8h-14Z', fill: '#f8e2cf', stroke: COL.skinDark, 'stroke-width': 1 }, gg);
        const lab = T(gg, 0, 108, '', { anchor: 'middle', size: 12, weight: 700 });
        return { gg, lab };
      });
      const info = T(F.scene, F.w / 2, 30, '', { anchor: 'middle', size: 14, weight: 800 });
      const info2 = T(F.scene, F.w / 2, 50, '', { anchor: 'middle', size: 12, fill: COL.ink2 });
      let showCm = false;
      function draw() {
        stick.setAttribute('transform', tr(x0 + off * ppm, yS));
        const gl = x0 + (a + off) * ppm, gr = x0 + (b + off) * ppm;
        fingers[0].gg.setAttribute('transform', tr(gl, yS + 10));
        fingers[1].gg.setAttribute('transform', tr(gr, yS + 10));
        const moving = tt > 0 && !done;
        K.say(fingers[0].lab, moving ? (slideR ? 'grips' : 'slides') : '');
        K.say(fingers[1].lab, moving ? (slideR ? 'slides' : 'grips') : '');
        fingers[0].lab.setAttribute('fill', slideR ? COL.green : COL.red);
        fingers[1].lab.setAttribute('fill', slideR ? COL.red : COL.green);
        cmMark.setAttribute('opacity', showCm || done ? 1 : 0);
        if (done) { K.say(info, 'They meet at ' + ((a + b) / 2 * 100).toFixed(1) + ' cm'); K.say(info2, 'the balance point of the stick' + (clay ? ' with its lump of clay' : '')); }
        else if (tt > 0) { K.say(info, 'Left at ' + (a * 100).toFixed(1) + ' cm, right at ' + (b * 100).toFixed(1) + ' cm'); K.say(info2, 'The finger nearer the balance point carries more weight — and grips'); }
        else { K.say(info, 'Put your fingers anywhere under the stick'); K.say(info2, 'Drag them, then slide them together'); }
      }
      fingers.forEach((f, i) => K.onDrag(f.gg, F.scene, ctx, {
        start() { if (L.running) return false; reset(); },
        move(p) { const v = clamp((p[0] - x0) / ppm, 0.02, 0.98); if (i === 0) a0 = Math.min(v, b0 - 0.05); else b0 = Math.max(v, a0 + 0.05); reset(); draw(); }
      }));
      const L = F.loop((dt) => { let s = dt; while (s > 0) { const h = Math.min(0.01, s); s -= h; step(h); } draw(); return !done; });
      K.playButton(F, L, { label: 'Slide together', w: 140, onPress() { if (!L.running && done) reset(); L.toggle(); } });
      F.button('', () => { L.stop(); reset(); draw(); }, { icon: 'reset', title: 'Start again' });
      F.whenSolved(() => { showCm = true; draw(); });
      reset();
      draw();
      return F.inst({ solve() { showCm = true; L.stop(); reset(); L.start(); }, getState: () => ({ a0, b0 }), setState(s) { a0 = s.a0 == null ? a0 : s.a0; b0 = s.b0 == null ? b0 : s.b0; reset(); draw(); } });
    }
  });

  /* A car with a hanging weight and a helium balloon inside */
  C.figure('phys-balloon', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 360, bar: 1 });
      const gA = 9.81, yR = F.sh - 34;
      let acc = 0, th = [0, 0], w = [0, 0], scroll = 0, speed = 8, phase = 'cruise', left = 0;
      const road = S('g', null, F.back);
      const car = S('g', { transform: tr(150, yR) }, F.scene);
      S('path', { d: 'M0 -30V-120Q0 -150 40 -160H250Q300 -150 320 -110L350 -80Q360 -60 360 -40V-30Z', fill: '#6fa3d6', stroke: '#2f5f92', 'stroke-width': 2.5 }, car);
      S('path', { d: 'M20 -110V-140Q22 -150 44 -152H240Q280 -146 296 -112Z', fill: '#eef5fa', stroke: '#2f5f92', 'stroke-width': 1.5 }, car);
      [70, 290].forEach((x) => { S('circle', { cx: x, cy: -26, r: 26, fill: '#333', stroke: '#111' }, car); S('circle', { cx: x, cy: -26, r: 11, fill: '#9aa0aa' }, car); });
      T(car, 336, -60, '→', { size: 22, weight: 800, fill: '#2f5f92' });
      // the pendulum from the roof (at x 110) and the balloon tied to the floor (at x 210)
      const pend = S('g', { transform: tr(110, -150) }, car);
      S('line', { x1: 0, y1: 0, x2: 0, y2: 70, stroke: COL.ink2, 'stroke-width': 1.6 }, pend);
      S('circle', { cx: 0, cy: 78, r: 9, fill: '#5d6270', stroke: '#2d3038', 'stroke-width': 1.5 }, pend);
      const ball = S('g', { transform: tr(210, -40) }, car);
      S('path', { d: 'M0 0C4 -20 -4 -40 0 -64', fill: 'none', stroke: COL.ink2, 'stroke-width': 1.3 }, ball);
      S('ellipse', { cx: 0, cy: -80, rx: 14, ry: 17, fill: '#e2574c', stroke: '#8f2d22', 'stroke-width': 1.5 }, ball);
      S('path', { d: 'M-4 -88q2 -5 6 -5', stroke: '#fff', 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round', opacity: 0.8 }, ball);
      S('path', { d: 'M0 -63l-3 4h6Z', fill: '#8f2d22' }, ball);
      const msg = T(F.scene, 20, 28, '', { size: 14, weight: 800 });
      const msg2 = T(F.scene, 20, 46, '', { size: 12, fill: COL.ink2 });
      function draw() {
        road.innerHTML = '';
        K.ground(road, 16, F.w - 16, yR, { hatch: false });
        for (let x = 16 - (scroll % 60); x < F.w; x += 60) if (x > 14) S('rect', { x, y: yR + 8, width: 28, height: 4, fill: COL.faint }, road);
        for (let x = 40 - ((scroll * 0.4) % 200); x < F.w; x += 200) if (x > 10) { S('line', { x1: x, y1: yR, x2: x, y2: yR - 60, stroke: '#8a6a3a', 'stroke-width': 4 }, road); S('circle', { cx: x, cy: yR - 74, r: 18, fill: '#8fb86a', opacity: 0.8 }, road); }
        pend.setAttribute('transform', tr(110, -150, th[0] * 180 / Math.PI));
        ball.setAttribute('transform', tr(210, -40, th[1] * 180 / Math.PI));
        const word = phase === 'go' ? 'Speeding up' : phase === 'brake' ? 'Braking' : 'Steady speed';
        K.say(msg, word + ' · ' + Math.round(speed * 3.6) + ' km/h');
        msg.setAttribute('fill', phase === 'go' ? COL.green : phase === 'brake' ? COL.red : COL.ink);
        K.say(msg2, phase === 'cruise' ? 'Both hang straight' : 'The weight swings ' + (th[0] < -0.01 ? 'back' : th[0] > 0.01 ? 'forward' : '…') + ', the balloon leans ' + (th[1] > 0.01 ? 'forward' : th[1] < -0.01 ? 'back' : '…'));
      }
      const L = F.loop((dt) => {
        let s = dt;
        while (s > 0) {
          const h = Math.min(0.005, s); s -= h;
          if (left > 0) { left -= h; if (left <= 0) { phase = 'cruise'; acc = 0; } }
          speed = Math.max(0, speed + acc * h);
          if (speed <= 0 && acc < 0) { acc = 0; phase = 'cruise'; }
          scroll += speed * h * 30;
          // in the car, "gravity" tilts: the weight hangs along it, the balloon floats against it (both damped)
          const tgt = Math.atan2(acc, gA);
          const kk = 26, dmp = 3.2;
          w[0] += (-kk * (th[0] + tgt) - dmp * w[0]) * h; th[0] += w[0] * h;
          w[1] += (-kk * (th[1] - tgt) - dmp * w[1]) * h; th[1] += w[1] * h;
        }
        draw();
        return true;
      });
      F.button('Speed up', () => { phase = 'go'; acc = 4; left = 2.2; L.start(); }, { primary: true, icon: 'play' });
      F.button('Brake', () => { phase = 'brake'; acc = -4; left = 2.2; L.start(); });
      F.button('', () => { phase = 'cruise'; acc = 0; left = 0; speed = 8; th = [0, 0]; w = [0, 0]; draw(); }, { icon: 'reset', title: 'Steady again' });
      L.start();
      draw();
      return F.inst({ solve() { phase = 'go'; acc = 4; left = 2.2; L.start(); }, getState: () => null, setState() {} });
    }
  });

  /* A spring balance between two equal weights, and one tied to a wall */
  C.figure('phys-scale', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 330, bar: 1 });
      const yA = 70;
      let u = 0;
      function pulley(x, y) { S('circle', { cx: x, cy: y, r: 16, fill: '#c3c8d2', stroke: '#4a5060', 'stroke-width': 2 }, F.scene); S('circle', { cx: x, cy: y, r: 3, fill: '#4a5060' }, F.scene); }
      function weight(x, y) { S('path', { d: 'M' + (x - 20) + ' ' + (y + 40) + 'L' + (x - 14) + ' ' + y + 'H' + (x + 14) + 'L' + (x + 20) + ' ' + (y + 40) + 'Z', fill: '#5d6270', stroke: '#2d3038', 'stroke-width': 1.5 }, F.scene); T(F.scene, x, y + 28, '10 kg', { anchor: 'middle', size: 11, weight: 800, fill: '#fff' }); }
      const dials = [];
      function scaleAt(x, y) {
        const gg = S('g', { transform: tr(x, y) }, F.scene);
        S('rect', { x: -34, y: -14, width: 68, height: 28, rx: 6, fill: '#e8ebf0', stroke: '#4a5060', 'stroke-width': 1.5 }, gg);
        S('circle', { cx: 0, cy: -34, r: 22, fill: '#fffdf6', stroke: '#4a5060', 'stroke-width': 1.5 }, gg);
        for (let k = 0; k <= 20; k += 5) { const a = (-120 + k * 12) * Math.PI / 180; S('line', { x1: 16 * Math.sin(a), y1: -34 - 16 * Math.cos(a), x2: 20 * Math.sin(a), y2: -34 - 20 * Math.cos(a), stroke: COL.ink, 'stroke-width': 1 }, gg); }
        T(gg, 0, -40, '', { anchor: 'middle', size: 7, fill: COL.muted });
        const needle = S('line', { x1: 0, y1: -34, x2: 0, y2: -52, stroke: COL.red, 'stroke-width': 2 }, gg);
        const rd = T(gg, 0, 5, '', { anchor: 'middle', size: 12, weight: 800 });
        dials.push({ needle, rd });
      }
      // left: a wall, the balance, a rope over a pulley to one weight
      S('rect', { x: 20, y: 30, width: 14, height: 120, fill: '#d9ccb0', stroke: COL.tableDark }, F.scene);
      S('line', { x1: 34, y1: yA, x2: 250, y2: yA, stroke: COL.ink2, 'stroke-width': 2 }, F.scene);
      pulley(266, yA + 16);
      S('line', { x1: 282, y1: yA + 16, x2: 282, y2: 190, stroke: COL.ink2, 'stroke-width': 2 }, F.scene);
      weight(282, 190);
      scaleAt(140, yA);
      T(F.scene, 150, 260, 'Tied to a wall', { anchor: 'middle', size: 13, weight: 700 });
      // right: a weight on each end, over two pulleys
      S('line', { x1: 350, y1: yA, x2: 560, y2: yA, stroke: COL.ink2, 'stroke-width': 2 }, F.scene);
      pulley(350, yA + 16); pulley(560, yA + 16);
      S('line', { x1: 334, y1: yA + 16, x2: 334, y2: 190, stroke: COL.ink2, 'stroke-width': 2 }, F.scene);
      S('line', { x1: 576, y1: yA + 16, x2: 576, y2: 190, stroke: COL.ink2, 'stroke-width': 2 }, F.scene);
      weight(334, 190); weight(576, 190);
      scaleAt(455, yA);
      T(F.scene, 455, 260, 'A weight on each end', { anchor: 'middle', size: 13, weight: 700 });
      function draw() {
        const v = 10 * (1 - Math.exp(-u * 3) * Math.cos(u * 9));
        dials.forEach((d) => { d.needle.setAttribute('transform', 'rotate(' + fx(-120 + clamp(v, 0, 20) * 12) + ' 0 -34)'); K.say(d.rd, u > 0 ? v.toFixed(1) + ' kg' : 'held'); });
      }
      const L = F.loop((dt) => { u = Math.min(2, u + dt); draw(); return u < 2; });
      K.playButton(F, L, { label: 'Let the weights hang', w: 190, onPress() { if (!L.running && u >= 2) u = 0; L.toggle(); } });
      F.button('', () => { L.stop(); u = 0; draw(); }, { icon: 'reset', title: 'Hold the weights up again' });
      draw();
      return F.inst({ solve() { L.stop(); u = 0; L.start(); }, getState: () => null, setState() {} });
    }
  });

  /* Newton's cradle: equal steel balls, hard elastic collisions */
  C.figure('phys-cradle', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 350, bar: 1 });
      const N = 5, R = 22, Lp = 180, gA = 9.81, ppm = 180 / 0.2, top = 40, cx = F.w / 2 + 80;
      let lift = P.lift || 2, th, w, hist = [];
      const xRest = (i) => cx + (i - (N - 1) / 2) * 2 * R;
      S('rect', { x: cx - 160, y: top - 14, width: 320, height: 12, rx: 5, fill: '#9aa0aa', stroke: '#4a5060', 'stroke-width': 1.5 }, F.back);
      S('rect', { x: cx - 170, y: F.sh - 30, width: 340, height: 14, rx: 5, fill: '#9aa0aa', stroke: '#4a5060', 'stroke-width': 1.5 }, F.back);
      [-160, 150].forEach((dx) => S('rect', { x: cx + dx, y: top - 10, width: 10, height: F.sh - 30 - top + 10, fill: '#b9bfcc', stroke: '#4a5060' }, F.back));
      const balls = [];
      for (let i = 0; i < N; i++) {
        const gg = S('g', null, F.scene);
        const str = S('line', { stroke: COL.ink2, 'stroke-width': 1.3 }, gg);
        const b = S('circle', { r: R - 0.5, fill: '#c3c8d2', stroke: '#4a5060', 'stroke-width': 1.8 }, gg);
        const hl = S('circle', { r: 6, fill: '#fff', opacity: 0.7 }, gg);
        balls.push({ str, b, hl });
      }
      const info = T(F.scene, 20, 40, '', { size: 14, weight: 800 });
      const info2 = T(F.scene, 20, 62, '', { size: 12, fill: COL.ink2 });
      const info3 = T(F.scene, 20, 80, 'must both come out', { size: 12, fill: COL.ink2 });
      T(F.scene, 20, 98, 'the same as they went in', { size: 12, fill: COL.ink2 });
      void info3;
      const Lm = Lp / ppm;   // string length in metres (0.2 m)
      function reset() { th = new Array(N).fill(0); w = new Array(N).fill(0); for (let i = 0; i < lift; i++) th[i] = -0.55; }
      function step(h) {
        for (let i = 0; i < N; i++) { w[i] += -gA / Lm * Math.sin(th[i]) * h; th[i] += w[i] * h; }
        // touching balls that approach swap velocities (equal masses, elastic); repeat until none approach
        for (let pass = 0; pass < N; pass++) {
          let any = false;
          for (let i = 0; i < N - 1; i++) {
            const xi = Lm * Math.sin(th[i]), xj = Lm * Math.sin(th[i + 1]);
            const gap = (2 * R / ppm + xj) - xi - 2 * R / ppm;
            const vi = Lm * Math.cos(th[i]) * w[i], vj = Lm * Math.cos(th[i + 1]) * w[i + 1];
            if (gap <= 1e-6 && vi > vj) { const t2 = w[i]; w[i] = w[i + 1]; w[i + 1] = t2; any = true; }
          }
          if (!any) break;
        }
      }
      function draw() {
        balls.forEach((bb, i) => {
          const px = xRest(i) + Lp * Math.sin(th[i]), py = top + Lp * Math.cos(th[i]);
          set(bb.str, { x1: xRest(i), y1: top, x2: px, y2: py - R });
          set(bb.b, { cx: px, cy: py });
          set(bb.hl, { cx: px - 7, cy: py - 7 });
        });
        const moving = th.filter((a, i) => Math.abs(a) > 0.02 || Math.abs(w[i]) > 0.3).length;
        K.say(info, lift + (lift === 1 ? ' ball lifted' : ' balls lifted'));
        K.say(info2, 'Momentum and energy');
        void moving;
      }
      const Lo = F.loop((dt) => { let s = dt * 0.6; while (s > 0) { const h = Math.min(0.0005, s); s -= h; step(h); } draw(); return true; });
      K.playButton(F, Lo, { label: 'Let go' });
      F.button('', () => { Lo.stop(); reset(); draw(); }, { icon: 'reset', title: 'Lift them again' });
      F.slider({ label: 'Lift', min: 1, max: 4, step: 1, value: lift, w: 110, vw: 50, fmt: (v) => v + (v === 1 ? ' ball' : ' balls'), onInput(v) { lift = v; Lo.stop(); reset(); draw(); } });
      reset();
      draw();
      void hist;
      return F.inst({ solve() { Lo.stop(); reset(); Lo.start(); }, getState: () => ({ lift }), setState(s) { lift = s.lift || lift; reset(); draw(); } });
    }
  });

  /* Falling side by side: the hammer and the feather (on the Earth or the Moon), and Galileo's tied stones */
  C.figure('phys-drop', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 360, bar: 1 });
      const galileo = P.mode === 'galileo';
      let place = P.place || 'moon', t = 0;
      const H = 1.6, ppm = (F.sh - 110) / H, yG = F.sh - 30, BO = { hammer: 34, feather: 30, big: 16, small: 8, tied: 16 };
      const back = S('g', null, F.back), objs = S('g', null, F.scene);
      const items = galileo
        ? [{ x: 170, kind: 'big', label: 'big stone' }, { x: 300, kind: 'small', label: 'small stone' }, { x: 440, kind: 'tied', label: 'both, tied together' }]
        : [{ x: 220, kind: 'hammer', label: 'hammer' }, { x: 400, kind: 'feather', label: 'feather' }];
      items.forEach((it) => {
        it.g = S('g', null, objs);
        if (it.kind === 'hammer') { S('rect', { x: -3, y: -4, width: 6, height: 38, rx: 2, fill: '#b98a50', stroke: COL.woodDark }, it.g); S('rect', { x: -14, y: -14, width: 28, height: 12, rx: 2, fill: '#5d6270', stroke: '#2d3038' }, it.g); }
        else if (it.kind === 'feather') { S('path', { d: 'M0 -18C12 -8 10 12 0 22C-10 12 -12 -8 0 -18Z', fill: '#f2f2f2', stroke: '#9a9a9a', 'stroke-width': 1.3 }, it.g); S('path', { d: 'M0 -18V30', stroke: '#9a9a9a', 'stroke-width': 1.3 }, it.g); }
        else if (it.kind === 'big') S('path', { d: 'M-18 6q-2 -18 16 -20q20 0 20 16q-2 14 -18 14q-16 0 -18 -10Z', fill: '#8a857a', stroke: '#4a4740', 'stroke-width': 1.5 }, it.g);
        else if (it.kind === 'small') S('path', { d: 'M-9 3q-1 -9 8 -10q10 0 10 8q-1 7 -9 7q-8 0 -9 -5Z', fill: '#a8a294', stroke: '#4a4740', 'stroke-width': 1.3 }, it.g);
        else { S('path', { d: 'M-24 6q-2 -18 16 -20q20 0 20 16q-2 14 -18 14q-16 0 -18 -10Z', fill: '#8a857a', stroke: '#4a4740', 'stroke-width': 1.5 }, it.g); S('path', { d: 'M8 -2q-1 -9 8 -10q10 0 10 8q-1 7 -9 7q-8 0 -9 -5Z', fill: '#a8a294', stroke: '#4a4740', 'stroke-width': 1.3 }, it.g); S('path', { d: 'M2 -6q6 4 10 0', fill: 'none', stroke: '#b0472f', 'stroke-width': 2 }, it.g); }
        it.lab = T(F.scene, it.x, yG + 20, it.label, { anchor: 'middle', size: 12, weight: 700 });
        it.tl = T(F.scene, it.x, yG - 70, '', { anchor: 'middle', size: 12, fill: COL.ink2 });
      });
      const title = T(F.scene, F.w / 2, 24, '', { anchor: 'middle', size: 14, weight: 800 });
      function gOf() { return place === 'moon' ? 1.62 : 9.81; }
      function yAt(it, tt) {
        const gg = gOf();
        if (place === 'earth' && it.kind === 'feather') { const vt = 0.45; return Math.min(H, vt * tt - vt * vt / gg * (1 - Math.exp(-gg * tt / vt))); }
        return Math.min(H, 0.5 * gg * tt * tt);
      }
      function landT(it) { let lo = 0, hi = 20; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (yAt(it, m) >= H) hi = m; else lo = m; } return hi; }
      function draw() {
        back.innerHTML = '';
        if (place === 'vacuum') { S('rect', { x: 8, y: 8, width: F.w - 16, height: yG - 8, rx: 8, fill: '#eef0f4' }, back); S('rect', { x: 8, y: yG, width: F.w - 16, height: F.sh - yG, fill: '#c9cdd6' }, back); S('rect', { x: 110, y: 40, width: 400, height: yG - 40, rx: 30, fill: 'none', stroke: '#9fb4c8', 'stroke-width': 3 }, back); T(back, 500, 58, 'vacuum chamber', { anchor: 'end', size: 11, fill: '#7a8ea2' }); }
        else if (place === 'moon') { S('rect', { x: 8, y: 8, width: F.w - 16, height: yG - 8, rx: 8, fill: '#1d2233' }, back); for (let i = 0; i < 30; i++) S('circle', { cx: 20 + (i * 97) % 580, cy: 16 + (i * 53) % (yG - 40), r: (i % 3) * 0.5 + 0.6, fill: '#fff', opacity: 0.8 }, back); S('rect', { x: 8, y: yG, width: F.w - 16, height: F.sh - yG, fill: '#b8b3a6' }, back); }
        else { S('rect', { x: 8, y: 8, width: F.w - 16, height: yG - 8, rx: 8, fill: '#eaf3fa' }, back); S('rect', { x: 8, y: yG, width: F.w - 16, height: F.sh - yG, fill: '#9cc27a' }, back); }
        items.forEach((it) => {
          const y = yG - BO[it.kind] - (H - yAt(it, t)) * ppm;
          it.g.setAttribute('transform', tr(it.x, y));
          it.lab.setAttribute('fill', place === 'moon' ? '#3a3020' : COL.ink);
          const lt = landT(it);
          K.say(it.tl, t >= lt ? 'landed after ' + lt.toFixed(2) + ' s' : '');
          it.tl.setAttribute('fill', place === 'moon' ? '#e8e4d8' : COL.ink2);
        });
        K.say(title, galileo ? 'In a vacuum, from 1.6 m' : place === 'moon' ? 'On the Moon: no air, gravity 1.62 m/s²' : 'On the Earth, in air');
        title.setAttribute('fill', place === 'moon' ? '#f4efe1' : COL.ink);
      }
      const tEnd = () => Math.max(...items.map(landT)) + 0.2;
      const L = F.loop((dt) => { t = Math.min(tEnd(), t + dt * 0.8); draw(); return t < tEnd(); });
      K.playButton(F, L, { label: 'Let go', onPress() { if (!L.running && t >= tEnd()) t = 0; L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; draw(); }, { icon: 'reset', title: 'Pick them up again' });
      let seg = null;
      if (!galileo) seg = F.seg({ options: [['moon', 'On the Moon'], ['earth', 'On the Earth']], value: place, onChange(v) { place = v; L.stop(); t = 0; draw(); } });
      else place = 'vacuum';
      draw();
      return F.inst({ solve() { L.stop(); t = 0; L.start(); }, getState: () => ({ place }), setState(s) { if (!galileo && s.place) { place = s.place; if (seg) seg.set(place, true); } t = 0; draw(); } });
    }
  });

  /* Lewis Carroll's monkey: a rope over a pulley, a monkey on one end, an equal weight on the other */
  C.figure('phys-monkey-rope', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 400, bar: 1 });
      const px = 310, py = 50, R = 40, yFloor = F.sh - 20, ppm = 90;
      let rise = 0, climbed = 0;
      S('rect', { x: px - 80, y: 16, width: 160, height: 10, fill: COL.woodDark }, F.back);
      S('line', { x1: px, y1: 26, x2: px, y2: py, stroke: '#4a5060', 'stroke-width': 4 }, F.back);
      S('circle', { cx: px, cy: py, r: R, fill: '#c3c8d2', stroke: '#4a5060', 'stroke-width': 2.5 }, F.back);
      S('circle', { cx: px, cy: py, r: 5, fill: '#4a5060' }, F.back);
      K.ground(F.back, 16, F.w - 16, yFloor);
      // height scales beside each side
      [px - R - 60, px + R + 60].forEach((x) => { for (let k = 0; k <= 3; k++) { const y = yFloor - 40 - k * ppm * 0.5; S('line', { x1: x - 6, y1: y, x2: x + 6, y2: y, stroke: COL.faint, 'stroke-width': 1.5 }, F.back); } });
      const ropeL = S('line', { stroke: '#8a6a3a', 'stroke-width': 3 }, F.scene), ropeR = S('line', { stroke: '#8a6a3a', 'stroke-width': 3 }, F.scene);
      const ribbon = S('path', { fill: COL.red }, F.scene);
      const monkey = S('g', null, F.scene);
      S('ellipse', { cx: 0, cy: 12, rx: 13, ry: 16, fill: '#9a6a3a', stroke: '#5a3a18', 'stroke-width': 1.5 }, monkey);
      S('circle', { cx: 0, cy: -10, r: 11, fill: '#9a6a3a', stroke: '#5a3a18', 'stroke-width': 1.5 }, monkey);
      S('ellipse', { cx: 0, cy: -7, rx: 8, ry: 6, fill: '#e8c89c' }, monkey);
      S('circle', { cx: -3, cy: -12, r: 1.5, fill: COL.ink }, monkey); S('circle', { cx: 3, cy: -12, r: 1.5, fill: COL.ink }, monkey);
      const armA = S('path', { stroke: '#6b4318', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, monkey);
      S('path', { d: 'M-6 24q-10 14 -4 26', fill: 'none', stroke: '#6b4318', 'stroke-width': 3, 'stroke-linecap': 'round' }, monkey);
      const sack = S('g', null, F.scene);
      S('path', { d: 'M-18 0q-6 34 4 42h28q10 -8 4 -42Z', fill: '#c9a46a', stroke: COL.woodDark, 'stroke-width': 1.5 }, sack);
      S('path', { d: 'M-10 0l10 -8 10 8', fill: 'none', stroke: COL.woodDark, 'stroke-width': 2 }, sack);
      T(sack, 0, 26, 'as heavy', { anchor: 'middle', size: 8, weight: 800, fill: '#5a3a18' });
      T(sack, 0, 35, 'as the monkey', { anchor: 'middle', size: 7, weight: 700, fill: '#5a3a18' });
      const info = T(F.scene, 20, F.sh - 64, '', { size: 14, weight: 800 });
      const info2 = T(F.scene, 20, F.sh - 46, '', { size: 12, fill: COL.ink2 });
      const y0 = yFloor - 120;
      function draw() {
        const ym = y0 - rise * ppm, ys = y0 - rise * ppm;
        set(ropeL, { x1: px - R, y1: py, x2: px - R, y2: ym + 60 });
        set(ropeR, { x1: px + R, y1: py, x2: px + R, y2: ys });
        monkey.setAttribute('transform', tr(px - R, ym));
        const yr = y0 - 60 + rise * ppm;
        ribbon.setAttribute('d', 'M' + fx(px - R) + ' ' + fx(yr) + 'l-12 -6v12Z');
        const k = Math.sin(climbed * 18);
        armA.setAttribute('d', 'M-8 4L-2 ' + fx(-22 + k * 6) + 'M8 4L2 ' + fx(-22 - k * 6));
        sack.setAttribute('transform', tr(px + R, ys));
        K.say(info, 'The monkey has climbed ' + (climbed * 100).toFixed(0) + ' cm of rope');
        K.say(info2, 'Monkey: up ' + (rise * 100).toFixed(0) + ' cm · weight: up ' + (rise * 100).toFixed(0) + ' cm — the rope slides over the pulley');
      }
      const Lp = F.loop((dt) => { const du = dt * 0.5; climbed = Math.min(1.6, climbed + du); rise = climbed / 2; draw(); return climbed < 1.6; });
      K.playButton(F, Lp, { label: 'Climb', onPress() { if (!Lp.running && climbed >= 1.6) { climbed = 0; rise = 0; } Lp.toggle(); } });
      F.button('', () => { Lp.stop(); climbed = 0; rise = 0; draw(); }, { icon: 'reset', title: 'Back to the start' });
      draw();
      return F.inst({ solve() { Lp.stop(); climbed = 0; rise = 0; Lp.start(); }, getState: () => ({ c: +climbed.toFixed(3) }), setState(s) { climbed = clamp(+s.c || 0, 0, 1.6); rise = climbed / 2; draw(); } });
    }
  });

  /* The rower and the hat: seen from the bank, or drifting with the water */
  C.figure('phys-river', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 300, bar: 1 });
      const u = 6, wv = 3, turn = 10;   // km/h rowing speed, river speed, minutes before turning back
      const tMeet = 2 * turn;
      const ppk = 150, xB = 320, yR = 150;
      let t = 0, frame = 'bank';
      const bank = S('g', null, F.back), flow = S('g', null, F.back), items = S('g', null, F.scene);
      S('rect', { x: 8, y: yR - 60, width: F.w - 16, height: 120, fill: 'rgba(150,196,232,.6)' }, F.back);
      S('rect', { x: 8, y: yR - 90, width: F.w - 16, height: 30, fill: '#a9c98a' }, F.back);
      S('rect', { x: 8, y: yR + 60, width: F.w - 16, height: 30, fill: '#a9c98a' }, F.back);
      const hat = S('g', null, items);
      S('ellipse', { cx: 0, cy: 3, rx: 13, ry: 5, fill: '#5d6270' }, hat);
      S('path', { d: 'M-8 3q0 -12 8 -12t8 12Z', fill: '#3a3020' }, hat);
      const boat = S('g', null, items);
      S('path', { d: 'M-24 0h48q-6 10 -18 10h-12q-12 0 -18 -10Z', fill: '#c98c45', stroke: COL.woodDark, 'stroke-width': 1.5 }, boat);
      S('circle', { cx: 0, cy: -10, r: 6, fill: COL.skin, stroke: COL.ink, 'stroke-width': 1.2 }, boat);
      const oar = S('line', { x1: -26, y1: -2, x2: 26, y2: 6, stroke: COL.woodDark, 'stroke-width': 2.5 }, boat);
      const bridge = S('g', null, F.scene);
      S('rect', { x: -10, y: yR - 92, width: 20, height: 184, fill: '#b9a88a', stroke: '#6b5a3a', 'stroke-width': 1.5, opacity: 0.85 }, bridge);
      T(bridge, 0, yR - 98, 'bridge', { anchor: 'middle', size: 11, fill: COL.ink2 });
      const info = T(F.scene, 20, 26, '', { size: 14, weight: 800 });
      const info2 = T(F.scene, 20, 44, '', { size: 12, fill: COL.ink2 });
      function draw() {
        const tm = t;   // minutes
        const hatX = wv * tm / 60, boatW = tm <= turn ? -u * tm / 60 : -u * turn / 60 + u * (tm - turn) / 60;   // boat position relative to the water
        const boatX = boatW + wv * tm / 60;
        const shift = frame === 'water' ? -wv * tm / 60 : 0;
        const X = (km) => xB + (km + shift) * ppk;
        hat.setAttribute('transform', tr(X(Math.min(hatX, wv * tMeet / 60)), yR + 10));
        boat.setAttribute('transform', tr(X(tm >= tMeet ? wv * tMeet / 60 - 0.12 : boatX), yR - 16) + (tm > turn ? '' : ' scale(-1 1)'));
        oar.setAttribute('transform', 'rotate(' + fx(Math.sin(tm * 5) * 10) + ')');
        bridge.setAttribute('transform', tr(X(0), 0));
        flow.innerHTML = '';
        const fo = frame === 'water' ? 0 : (wv * tm / 60 * ppk) % 60;
        for (let x = 8 + fo - 60; x < F.w - 70; x += 60) for (let r = 0; r < 3; r++) if (x > 8) S('path', { d: 'M' + fx(x + r * 20) + ' ' + (yR - 40 + r * 36) + 'q8 -4 16 0', fill: 'none', stroke: '#fff', 'stroke-width': 1.5, opacity: 0.8 }, flow);
        bank.innerHTML = '';
        const bo = frame === 'water' ? (-wv * tm / 60 * ppk) % 80 : 0;
        for (let x = 20 + bo; x < F.w - 60; x += 80) if (x > 10) { S('circle', { cx: x, cy: yR - 78, r: 9, fill: '#6f9a4a' }, bank); S('circle', { cx: x + 40, cy: yR + 76, r: 9, fill: '#6f9a4a' }, bank); }
        K.say(info, (tm < turn ? 'Rowing upstream, unaware' : tm < tMeet ? 'Turned back after ' + turn + ' minutes' : 'Caught the hat!') + ' · ' + tm.toFixed(1) + ' min');
        K.say(info2, frame === 'bank' ? 'Seen from the bank: the river flows right at ' + wv + ' km/h' : 'Seen from a raft drifting with the river: the water is still');
      }
      const L = F.loop((dt) => { t = Math.min(tMeet, t + dt * 2.2); draw(); return t < tMeet; });
      K.playButton(F, L, { label: 'Row', onPress() { if (!L.running && t >= tMeet) t = 0; L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; draw(); }, { icon: 'reset', title: 'Back to the bridge' });
      const seg = F.seg({ options: [['bank', 'From the bank'], ['water', 'Drifting with the water']], value: frame, onChange(v) { frame = v; draw(); } });
      draw();
      return F.inst({ solve() { L.stop(); t = 0; L.start(); }, getState: () => ({ frame }), setState(s) { frame = s.frame || frame; seg.set(frame, true); t = 0; draw(); } });
    }
  });

  /* How much mirror do you need to see all of yourself? */
  C.figure('phys-mirror', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 400, bar: 2 });
      const Hm = 1.8, eye = 1.68, ppm = 120, wallX = 250, yF = F.sh - 26;
      let dist = P.dist || 1.5, mb = P.mb == null ? 0.84 : P.mb, mt = P.mt == null ? 1.74 : P.mt;
      const W = (x, y) => [wallX + x * ppm, yF - y * ppm];
      S('rect', { x: wallX - 8, y: 12, width: 8, height: yF - 12, fill: '#d9ccb0', stroke: COL.tableDark, 'stroke-width': 1.2 }, F.back);
      K.ground(F.back, 16, F.w - 16, yF);
      const imgG = S('g', { opacity: 0.35 }, F.scene), mir = S('rect', { width: 7, fill: '#bfe0f4', stroke: '#5f8fb0', 'stroke-width': 1.5 }, F.scene), rays = S('g', null, F.scene), me = S('g', null, F.scene);
      function person(gp, x, flip, vis) {
        gp.innerHTML = '';
        const seg = (a, b, col) => S('path', { d: K.path([W(x, a), W(x, b)]), stroke: col, 'stroke-width': 14, 'stroke-linecap': 'round' }, gp);
        const lo = vis ? vis[0] : -9, hi = vis ? vis[1] : 9;
        const col = (h) => (h >= lo - 1e-9 && h <= hi + 1e-9 ? '#3a6ea5' : '#c9c1ad');
        for (let h = 0; h < 1.52; h += 0.08) seg(h, Math.min(1.52, h + 0.08), col(h + 0.04));
        const hc = W(x, 1.66);
        S('circle', { cx: hc[0], cy: hc[1], r: 0.13 * ppm, fill: col(1.66) === '#3a6ea5' ? COL.skin : '#e0d8c4', stroke: COL.ink, 'stroke-width': 1.5 }, gp);
        const ey = W(x + (flip ? 0.06 : -0.06), eye);
        S('circle', { cx: ey[0], cy: ey[1], r: 3, fill: COL.ink }, gp);
      }
      const info = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 14, weight: 800 });
      const info2 = T(F.scene, F.w - 20, 46, '', { anchor: 'end', size: 12, fill: COL.ink2 });
      function draw() {
        const vis = [2 * mb - eye, 2 * mt - eye];   // body heights whose reflections reach the eye
        person(me, dist, false, vis);
        person(imgG, -dist, true, null);
        const a = W(0, mt), b = W(0, mb);
        set(mir, { x: wallX - 7, y: a[1], height: b[1] - a[1] });
        rays.innerHTML = '';
        const e = W(dist - 0.06, eye);
        [[Math.max(0, vis[0]), COL.green], [Math.min(Hm, vis[1]), COL.orange]].forEach((q) => {
          const hh = q[0], mY = (hh + eye) / 2, m = W(0, mY), body = W(dist, hh);
          S('path', { d: K.path([body, m, e]), fill: 'none', stroke: q[1], 'stroke-width': 1.8 }, rays);
          S('path', { d: K.path([m, W(-dist, hh)]), fill: 'none', stroke: q[1], 'stroke-width': 1.3, 'stroke-dasharray': '4 4' }, rays);
        });
        const seen = Math.max(0, Math.min(Hm, vis[1]) - Math.max(0, vis[0]));
        K.say(info, 'Mirror ' + Math.round((mt - mb) * 100) + ' cm tall · you see ' + Math.round(seen / Hm * 100) + ' % of yourself');
        info.setAttribute('fill', seen >= Hm - 1e-6 ? COL.green : COL.ink);
        K.say(info2, 'You are 180 cm tall, ' + dist.toFixed(1) + ' m from the mirror · blue: the parts you can see');
      }
      F.slider({ label: 'Distance', min: 0.4, max: 1.9, step: 0.05, value: dist, w: 120, vw: 56, fmt: (v) => v.toFixed(2) + ' m', onInput(v) { dist = v; draw(); } });
      F.newRow();
      F.slider({ label: 'Mirror bottom', min: 0, max: 1.5, step: 0.01, value: mb, w: 110, vw: 56, fmt: (v) => Math.round(v * 100) + ' cm', onInput(v) { mb = Math.min(v, mt - 0.05); draw(); } });
      F.slider({ label: 'top', min: 0.3, max: 2.1, step: 0.01, value: mt, w: 110, vw: 56, fmt: (v) => Math.round(v * 100) + ' cm', onInput(v) { mt = Math.max(v, mb + 0.05); draw(); } });
      draw();
      return F.inst({ solve() { mb = 0.84; mt = 1.74; draw(); }, getState: () => ({ dist, mb, mt }), setState(s) { dist = s.dist || dist; mb = s.mb == null ? mb : s.mb; mt = s.mt == null ? mt : s.mt; draw(); } });
    }
  });

  /* Two eggs spinning on a table: one boiled, one raw */
  C.figure('phys-eggs', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 340, bar: 1 });
      // raw: a shell (I 0.25) and a liquid (I 0.75) coupled by the liquid's stickiness; boiled: one solid (I 1)
      const E = [{ x: 170, name: 'Egg A', raw: false }, { x: 450, name: 'Egg B', raw: true }].map((e) => Object.assign(e, { ws: 0, wf: 0, ang: 0, held: 0 }));
      S('ellipse', { cx: F.w / 2, cy: 136, rx: 280, ry: 104, fill: '#e8d9bb', stroke: COL.tableDark, 'stroke-width': 1.5 }, F.back);
      E.forEach((e) => {
        e.g = S('g', null, F.scene);
        S('ellipse', { cx: 0, cy: 0, rx: 56, ry: 40, fill: '#fbf3e4', stroke: '#b9a27a', 'stroke-width': 2 }, e.g);
        S('ellipse', { cx: -16, cy: -12, rx: 14, ry: 7, fill: '#fff', opacity: 0.7 }, e.g);
        S('circle', { cx: 38, cy: 0, r: 5, fill: COL.red }, e.g);
        e.lab = T(F.scene, e.x, 262, e.name, { anchor: 'middle', size: 14, weight: 800 });
        e.lab2 = T(F.scene, e.x, 281, '', { anchor: 'middle', size: 12, fill: COL.ink2 });
        e.finger = S('path', { d: 'M-12 -120V-58q0 -10 12 -10t12 10V-120Z', fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5, opacity: 0 }, e.g);
      });
      const shown = { reveal: false };
      function draw() {
        E.forEach((e) => {
          e.g.setAttribute('transform', tr(e.x, 136, e.ang * 180 / Math.PI));
          e.finger.setAttribute('opacity', e.held > 0 ? 1 : 0);
          e.finger.setAttribute('transform', 'rotate(' + fx(-e.ang * 180 / Math.PI) + ')');
          K.say(e.lab2, (Math.abs(e.ws) < 0.05 ? 'still' : (e.ws / TAU).toFixed(2) + ' turns a second') + (shown.reveal ? ' · ' + (e.raw ? 'raw' : 'boiled') : ''));
        });
      }
      const L = F.loop((dt) => {
        let s = dt;
        while (s > 0) {
          const h = Math.min(0.004, s); s -= h;
          E.forEach((e) => {
            const fr = 0.45 * Math.sign(e.ws) * (Math.abs(e.ws) > 0.02 ? 1 : 0);   // table friction on the shell
            if (e.held > 0) { e.held -= h; e.ws = 0; }
            if (e.raw) {
              const c = 0.35 * (e.ws - e.wf);
              if (e.held <= 0) e.ws += (-c - fr) / 0.25 * h;
              e.wf += c / 0.75 * h;
            } else if (e.held <= 0) { e.ws += -fr * h; if (Math.abs(e.ws) < 0.02) e.ws = 0; }
            e.ang += e.ws * h;
          });
        }
        draw();
        return E.some((e) => Math.abs(e.ws) > 0.01 || Math.abs(e.wf) > 0.01 || e.held > 0);
      });
      F.button('Spin both', () => { E.forEach((e) => { e.ws = 8; if (e.raw) e.wf = 8; e.held = 0; }); L.start(); }, { primary: true, icon: 'play', title: 'Set both spinning (the raw one long enough for its insides to spin too)' });
      F.button('Touch and let go', () => { E.forEach((e) => { e.held = 0.35; }); L.start(); }, { icon: 'hand', title: 'Stop both for a moment with a finger' });
      F.button('', () => { L.stop(); E.forEach((e) => { e.ws = 0; e.wf = 0; e.held = 0; }); draw(); }, { icon: 'reset', title: 'Stop them' });
      F.whenSolved(() => { shown.reveal = true; draw(); });
      draw();
      return F.inst({ solve() { shown.reveal = true; E.forEach((e) => { e.ws = 10; e.wf = e.raw ? 10 : 0; }); L.start(); F.after(1600, () => { E.forEach((e) => { e.held = 0.35; }); }); }, getState: () => null, setState() {} });
    }
  });

  /* A paper cup with a hole near the bottom, held and then dropped */
  C.figure('phys-cup', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 380, bar: 1 });
      const gA = 9.81, ppm = 260, yG = F.sh - 20, head = 0.1, vJet = Math.sqrt(2 * gA * head);
      let t = 0, dropped = false, tDrop = 0, drops = [];
      const x0 = 190, y00 = 70;
      K.ground(F.back, 16, F.w - 16, yG);
      const jet = S('g', null, F.scene), cup = S('g', null, F.scene);
      S('path', { d: 'M-40 0L-32 110H32L40 0Z', fill: '#f4f5f7', stroke: '#7a808c', 'stroke-width': 2 }, cup);
      const water = S('path', { d: 'M-37 20L-32 108H32L37 20Z', fill: 'rgba(150,196,232,.85)' }, cup);
      S('circle', { cx: 33, cy: 100, r: 2.5, fill: '#4f8fc4' }, cup);
      S('path', { d: 'M-40 0h80', stroke: '#7a808c', 'stroke-width': 3 }, cup);
      const hand = K.hand(F.scene, x0 - 70, y00 + 50, 1, 0);
      const info = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 14, weight: 800 });
      const info2 = T(F.scene, F.w - 20, 46, '', { anchor: 'end', size: 12, fill: COL.ink2 });
      function cupY(tt) { return Math.min(yG - 110, dropped ? y00 + 0.5 * gA * Math.pow(Math.max(0, tt - tDrop), 2) * ppm : y00); }
      function draw() {
        const cy = cupY(t);
        cup.setAttribute('transform', tr(x0, Math.min(cy, yG - 110)));
        hand.g.style.opacity = dropped ? 0.3 : 1;
        jet.innerHTML = '';
        drops.forEach((d) => { const dt2 = t - d.t0; const x = d.x + d.vx * dt2 * ppm, y = d.y + 0.5 * gA * dt2 * dt2 * ppm; if (y < yG) S('circle', { cx: x, cy: y, r: 2.6, fill: '#4f8fc4', opacity: 0.85 }, jet); });
        if (!dropped) { K.say(info, 'Held still: water spurts from the hole'); K.say(info2, 'The water above the hole pushes it out at ' + vJet.toFixed(1) + ' m/s'); }
        else if (cy < yG - 110) { K.say(info, 'Falling: the spurt stops'); K.say(info2, 'In free fall the water weighs nothing, and presses on nothing'); }
        else { K.say(info, 'Landed — and it spurts again'); K.say(info2, 'Resting on the ground, the water has weight again'); }
      }
      let emit = 0;
      const L = F.loop((dt) => {
        const h = dt * 0.35;
        t += h;
        const cy = cupY(t), falling = dropped && cy < yG - 110;
        // new drops leave the hole only while the cup is held (the water inside is weightless in free fall)
        emit += h;
        while (emit > 0.012) { emit -= 0.012; if (!falling) drops.push({ t0: t, x: x0 + 35, y: cy + 100, vx: vJet }); }
        drops = drops.filter((d) => t - d.t0 < 1.2);
        draw();
        return !(dropped && t - tDrop > 3);
      });
      F.button('Drop it', () => { if (!L.running) L.start(); if (!dropped) { dropped = true; tDrop = t; } }, { primary: true, icon: 'play' });
      F.button('', () => { L.stop(); dropped = false; t = 0; drops = []; L.start(); }, { icon: 'reset', title: 'Pick it up again' });
      L.start();
      draw();
      void water;
      return F.inst({ solve() { if (!dropped) { dropped = true; tDrop = t; } L.start(); }, getState: () => null, setState() {} });
    }
  });

  /* A skater spinning, arms out and arms in */
  C.figure('phys-skater', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 340, bar: 1 });
      const Ib = 1.0, ma = 3;   // body and the two arms (3 kg at the hands, each)
      let r = 0.8, target = 0.8, ang = 0, Lz = (Ib + 2 * ma * 0.8 * 0.8) * TAU * 0.5;   // starts at half a turn a second, arms out
      const cx = 220, cy = 150, ppm = 110;
      S('ellipse', { cx, cy, rx: 150, ry: 135, fill: '#e8f2f8', stroke: '#b8d2e2', 'stroke-width': 2 }, F.back);
      const sk = S('g', null, F.scene);
      const arms = S('line', { stroke: COL.skinDark, 'stroke-width': 8, 'stroke-linecap': 'round' }, sk);
      const hands = [S('circle', { r: 8, fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, sk), S('circle', { r: 8, fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, sk)];
      S('ellipse', { cx: 0, cy: 0, rx: 30, ry: 22, fill: '#c24c85', stroke: '#7a2a55', 'stroke-width': 2 }, sk);
      S('circle', { cx: 0, cy: 0, r: 13, fill: '#6b4318', stroke: '#3a2410', 'stroke-width': 1.5 }, sk);
      S('path', { d: 'M13 -4l8 4-8 4Z', fill: COL.skin }, sk);
      const pnl = S('g', { transform: tr(410, 40) }, F.scene);
      S('rect', { x: 0, y: 0, width: 190, height: 110, rx: 10, fill: '#fffdf8', stroke: COL.line }, pnl);
      const r1 = T(pnl, 12, 26, '', { size: 13, weight: 700 }), r2 = T(pnl, 12, 50, '', { size: 12 }), r3 = T(pnl, 12, 74, '', { size: 12, fill: COL.blue }), r4 = T(pnl, 12, 96, '', { size: 11, fill: COL.muted });
      const I = () => Ib + 2 * ma * r * r;
      function draw() {
        const ax = r * ppm;
        sk.setAttribute('transform', tr(cx, cy, ang * 180 / Math.PI));
        set(arms, { x1: 0, y1: -ax, x2: 0, y2: ax });
        set(hands[0], { cx: 0, cy: -ax }); set(hands[1], { cx: 0, cy: ax });
        const w = Lz / I();
        K.say(r1, (w / TAU).toFixed(2) + ' turns a second');
        K.say(r2, 'Hands ' + Math.round(r * 100) + ' cm from the axis');
        K.say(r3, 'Spin energy ' + (0.5 * I() * w * w).toFixed(0) + ' J');
        K.say(r4, 'Angular momentum stays the same');
      }
      const Lo = F.loop((dt) => { r += (target - r) * Math.min(1, dt * 3); ang += Lz / I() * dt * 0.5; draw(); return true; });
      const ab = F.button('Pull the arms in', () => { target = target > 0.5 ? 0.15 : 0.8; ab.label(target > 0.5 ? 'Pull the arms in' : 'Throw the arms out'); Lo.start(); }, { primary: true, w: 170 });
      F.button('', () => { target = 0.8; r = 0.8; ab.label('Pull the arms in'); draw(); }, { icon: 'reset', title: 'Arms out again' });
      const note = F.note(0);
      K.say(note, 'Shown at half speed');
      Lo.start();
      draw();
      return F.inst({ solve() { target = 0.15; ab.label('Throw the arms out'); Lo.start(); }, getState: () => null, setState() {} });
    }
  });

  /* A tennis ball dropped on top of a basketball */
  C.figure('phys-bounce', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 400, bar: 1 });
      const gA = 9.81, h0 = 1.0;
      let ratio = P.ratio || 10, t = 0, phase = 0;
      const yG = F.sh - 20, xB = 200;
      K.ground(F.back, 16, F.w - 16, yG);
      const marks = S('g', null, F.back);
      const big = S('g', null, F.scene), small = S('g', null, F.scene);
      S('circle', { r: 26, fill: '#e07a2a', stroke: '#7a3a10', 'stroke-width': 2 }, big);
      S('path', { d: 'M-26 0h52M0 -26v52M-18 -18q10 18 0 36M18 -18q-10 18 0 36', fill: 'none', stroke: '#7a3a10', 'stroke-width': 1.5 }, big);
      S('circle', { r: 10, fill: '#d6e84a', stroke: '#7a8a10', 'stroke-width': 1.5 }, small);
      S('path', { d: 'M-8 -5q8 5 16 0M-8 5q8 -5 16 0', fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, small);
      const info = T(F.scene, F.w - 20, 28, '', { anchor: 'end', size: 14, weight: 800 });
      const info2 = T(F.scene, F.w - 20, 46, '', { anchor: 'end', size: 12, fill: COL.ink2 });
      let sim = null;
      function plan() {
        // fall together from h0; the big ball bounces off the floor, then meets the small one: elastic, head on
        const v = Math.sqrt(2 * gA * h0), M = ratio, m = 1;
        const vs = (3 * M - m) / (M + m) * v, vb = (M - 3 * m) / (M + m) * v;
        const hs = vs * vs / (2 * gA), hb = vb > 0 ? vb * vb / (2 * gA) : 0;
        sim = { v, vs, vb, hs, hb, tf: Math.sqrt(2 * h0 / gA) };
      }
      function scale() { return (yG - 110 - 52) / Math.max(h0, sim.hs); }
      function draw() {
        const ppm = scale();
        const tf = sim.tf;
        const bs = 26 / ppm, ss = 10 / ppm;   // drawn radii, in metres at this scale
        let yb, ysb;   // heights of the bottoms of the two balls above the floor (m)
        if (t <= tf) { yb = h0 - 0.5 * gA * t * t; ysb = yb + 2 * bs; }
        else { const u = t - tf; yb = Math.max(0, sim.vb * u - 0.5 * gA * u * u); ysb = Math.max(yb + 2 * bs, 2 * bs + sim.vs * u - 0.5 * gA * u * u); }
        big.setAttribute('transform', tr(xB, yG - (yb + bs) * ppm));
        small.setAttribute('transform', tr(xB, yG - (ysb + ss) * ppm));
        marks.innerHTML = '';
        [[h0, 'dropped from ' + h0.toFixed(1) + ' m', COL.ink2], [sim.hs, 'the tennis ball rises ' + (sim.hs).toFixed(1) + ' m', COL.green]].forEach((q) => {
          const y = yG - (q[0] + 2 * bs) * ppm;
          S('line', { x1: xB + 40, y1: y, x2: xB + 260, y2: y, stroke: q[2], 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, marks);
          T(marks, xB + 266, y + 4, q[1], { size: 11, fill: q[2] });
        });
        K.say(info, t > tf ? 'The tennis ball flies up to ' + (sim.hs / h0).toFixed(1) + '× the drop height' : 'Falling together…');
        K.say(info2, 'Basketball ' + ratio + ' times as heavy · perfectly bouncy balls · sizes not to scale');
      }
      const L = F.loop((dt) => { t += dt * 0.5; const end = sim.tf + 2 * sim.vs / gA + 0.1; if (t > end) t = end; draw(); return t < end; });
      K.playButton(F, L, { label: 'Drop', onPress() { if (!L.running && t > sim.tf) t = 0; L.toggle(); } });
      F.button('', () => { L.stop(); t = 0; draw(); }, { icon: 'reset', title: 'Pick them up' });
      F.slider({ label: 'Heavier by', min: 1, max: 40, step: 1, value: ratio, w: 130, vw: 40, fmt: (v) => v + '×', onInput(v) { ratio = v; L.stop(); t = 0; plan(); draw(); } });
      plan();
      draw();
      return F.inst({ solve() { L.stop(); t = 0; L.start(); }, getState: () => ({ ratio }), setState(s) { ratio = s.ratio || ratio; plan(); t = 0; draw(); } });
    }
  });

  /* =====================================================================
   * CHANCE: run the experiment
   * ===================================================================== */

  /* A scenario for the experiment figure (all but draw() run in node too, for the checks):
   *   events(st) -> [{ label, color, exact, show }]   what is counted (exact: the true value, shown after answering)
   *   cond: 'text' | null                              trials count only when the condition holds
   *   mean: true                                       events are averages (trial returns vals) instead of frequencies
   *   range(st) -> [lo, hi]                            the chart's vertical range (default 0..1)
   *   trial(rng, st) -> { ok, hits: [bool] | vals: [number], pic }
   *   draw(g, pic, st, W, H, ok)                       the picture of one trial (keep: pictures pile up; clear(g, st, W, H) first)
   *   controls(F, st, changed)                         sliders or switches in a second row of the bar
   *   extra(counts, st) -> 'text'                      one more line of readout (an estimate of π …)
   */
  const SCEN = K.SCEN = {};

  C.figure('prob-sim', {
    draw(g, P, ctx) {
      const sc = SCEN[P.scenario];
      if (!sc) throw new Error('prob-sim: unknown scenario ' + P.scenario);
      const st = Object.assign({}, sc.defaults || {}, P.set || {});
      const hasCtl = !!sc.controls;
      const F = K.frame(g, ctx, { w: 620, h: P.h || (hasCtl ? 470 : 430), bar: hasCtl ? 2 : 1 });
      const rng = K.rng();
      const W = 286, H = F.sh - 22, px0 = 12, py0 = 10;
      S('rect', { x: px0, y: py0, width: W, height: H, rx: 10, fill: '#fffdf8', stroke: COL.line, 'stroke-width': 1.2 }, F.back);
      const picG = S('g', { transform: tr(px0, py0) }, F.scene);
      const keepG = S('g', null, picG), liveG = S('g', null, picG);
      const stamp = T(picG, W - 10, 20, '', { anchor: 'end', size: 12, weight: 800, fill: COL.muted });
      const sx = 314, sw = F.w - sx - 14;
      const txt = S('g', null, F.scene), chartG = S('g', null, F.scene);
      let evs, chart, cnt, lines, extraEl, last = null;
      const fmtN = (n) => n.toLocaleString('en-GB');
      function fresh() { cnt = { n: 0, m: 0, hits: evs.map(() => 0), sums: evs.map(() => 0) }; }
      function est(i) { return cnt.m ? (sc.mean ? cnt.sums[i] : cnt.hits[i]) / cnt.m : NaN; }
      function build() {
        evs = sc.events(st);
        txt.innerHTML = '';
        chartG.innerHTML = '';
        lines = {};
        lines.n = T(txt, sx, 26, '', { size: 14, weight: 800 });
        if (sc.cond) lines.c = T(txt, sx, 45, 'counting only when ' + sc.cond, { size: 11.5, fill: COL.muted });
        const y0 = sc.cond ? 68 : 52;
        lines.ev = evs.map((e, i) => T(txt, sx, y0 + i * 19, '', { size: 12.5, weight: 700, fill: e.color }));
        let cy = y0 + evs.length * 19 - 4;
        extraEl = sc.extra ? T(txt, sx, cy + 10, '', { size: 12.5, weight: 700, fill: COL.ink2 }) : null;
        if (extraEl) cy += 20;
        const rg = sc.range ? sc.range(st) : [0, 1];
        const ticks = sc.ticks ? sc.ticks(st) : [rg[0], (rg[0] + rg[1]) / 2, rg[1]];
        chart = K.conv(chartG, { x: sx + 34, y: cy + 8, w: sw - 38, h: Math.max(90, F.sh - cy - 38), ymin: rg[0], ymax: rg[1], nmax: 1000, yticks: ticks, yfmt: sc.yfmt || ((v) => (sc.mean ? String(+v.toFixed(2)) : String(+v.toFixed(3)))), series: evs.map((e) => ({ color: e.color })), xlabel: sc.cond ? 'trials counted' : 'trials' });
        fresh();
        showTargets();
      }
      function showTargets() {
        if (!F.solved) return;
        chart.targets(evs.map((e, i) => ({ v: e.exact, label: e.exact == null ? '' : 'exact ' + (e.show || K.num(e.exact, 3)), color: e.color, below: i % 2 === 1 })));
      }
      function writeStats() {
        K.say(lines.n, (sc.cond ? 'Trials ' + fmtN(cnt.n) + ' · counted ' + fmtN(cnt.m) : 'Trials ' + fmtN(cnt.n)));
        evs.forEach((e, i) => {
          const v = est(i);
          const ex = F.solved && e.exact != null ? '   (exact ' + (e.show || K.num(e.exact, 3)) + ')' : '';
          K.say(lines.ev[i], sc.mean ? e.label + ': average ' + (isFinite(v) ? v.toFixed(3) : '–') + ex : e.label + ': ' + fmtN(cnt.hits[i]) + ' → ' + (isFinite(v) ? v.toFixed(3) : '–') + ex);
        });
        if (extraEl) K.say(extraEl, sc.extra(cnt, st));
      }
      function drawPic(r) {
        if (!r) return;
        if (sc.keep) { if (cnt.m + (r.ok === false ? 0 : 0) < (sc.keepMax || 2500)) sc.draw(keepG, r.pic, st, W, H, r.ok !== false); liveG.innerHTML = ''; if (sc.drawLive) sc.drawLive(liveG, r.pic, st, W, H, r.ok !== false); }
        else { liveG.innerHTML = ''; sc.draw(liveG, r.pic, st, W, H, r.ok !== false); }
        K.say(stamp, r.ok === false ? 'not counted' : '');
      }
      function one() {
        const r = sc.trial(rng, st);
        cnt.n++;
        last = r;
        if (r.ok === false) return r;
        cnt.m++;
        evs.forEach((e, i) => {
          if (sc.mean) cnt.sums[i] += r.vals[i]; else if (r.hits[i]) cnt.hits[i]++;
          chart.push(i, cnt.m, est(i));
        });
        return r;
      }
      function resetAll() {
        pending = 0; L.stop();
        fresh();
        chart.reset();
        showTargets();
        keepG.innerHTML = ''; liveG.innerHTML = '';
        if (sc.clear) sc.clear(keepG, st, W, H);
        if (sc.idle) sc.idle(liveG, st, W, H);
        K.say(stamp, '');
        writeStats();
      }
      let pending = 0, rate = 1, budget = 0;
      const L = F.loop((dt) => {
        budget += dt * rate;
        let drew = null;
        while (budget >= 1 && pending > 0) {
          budget -= 1; pending--;
          const r = one();
          if (sc.keep) drawPic(r); else drew = r;
        }
        if (drew) drawPic(drew);
        chart.flush();
        writeStats();
        if (pending <= 0) { budget = 0; return false; }
        return true;
      });
      function run(n, perSec) { pending += n; rate = perSec; if (n === 1) budget = 1; L.start(); }
      F.button('Once', () => run(1, 4), { icon: 'dice', primary: true, w: 86 });
      F.button('×10', () => run(10, 7), { w: 52 });
      F.button('×100', () => run(100, 90), { w: 60 });
      F.button('×1000', () => run(1000, 800), { w: 68, icon: 'fast' });
      F.button('', () => resetAll(), { icon: 'reset', title: 'Forget all the trials' });
      if (hasCtl) { F.newRow(); sc.controls(F, st, () => { build(); resetAll(); }); }
      build();
      if (sc.clear) sc.clear(keepG, st, W, H);
      if (sc.idle) sc.idle(liveG, st, W, H);
      writeStats();
      F.whenSolved(() => { showTargets(); writeStats(); });
      return F.inst({
        solve() { if (cnt.m < 1000) run(1000, 800); showTargets(); },
        getState: () => ({ st: sc.keepState ? sc.keepState(st) : null, cnt, pts: chart.state() }),
        setState(s) {
          if (s.st && sc.keepState) { Object.assign(st, s.st); if (sc.syncControls) sc.syncControls(st); build(); }
          if (s.cnt && s.cnt.hits && s.cnt.hits.length === evs.length) { cnt = s.cnt; chart.load(s.pts); showTargets(); }
          keepG.innerHTML = ''; if (sc.clear) sc.clear(keepG, st, W, H);
          writeStats();
        }
      });
    }
  });

  // ---------- small drawing helpers for the scenarios ----------
  const P2 = K.prob = {};
  P2.check = (g, x, y, ok) => T(g, x, y, ok ? '✓' : '✗', { anchor: 'middle', size: 18, weight: 800, fill: ok ? COL.green : COL.red });
  P2.note = (g, x, y, s, o) => T(g, x, y, s, Object.assign({ anchor: 'middle', size: 12.5, fill: COL.ink2 }, o || {}));
  P2.gold = { fill: '#e9c46a', rim: '#9c7414' };
  P2.silver = { fill: '#d5d9e0', rim: '#7d8494', inner: 'rgba(80,90,110,.3)' };
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  /* Bertrand's box: three boxes GG, SS, GS; draw a box, then a coin */
  SCEN['bertrand-box'] = {
    cond: 'the coin you drew is gold',
    events: () => [{ label: 'the other coin is gold', color: COL.goldDark, exact: 2 / 3, show: '2/3' }],
    trial(r) {
      const box = r.int(3), coins = [['G', 'G'], ['S', 'S'], ['G', 'S']][box], k = r.int(2);
      return { ok: coins[k] === 'G', hits: [coins[1 - k] === 'G'], pic: { box, k, coins } };
    },
    draw(g, p, st, W, H, ok) {
      const names = ['gold · gold', 'silver · silver', 'gold · silver'];
      for (let b = 0; b < 3; b++) {
        const x = W * (b + 0.5) / 3, y = H * 0.55, on = b === p.box;
        S('rect', { x: x - 38, y: y - 28, width: 76, height: 56, rx: 6, fill: on ? '#c98c45' : '#e2c9a0', stroke: COL.woodDark, 'stroke-width': on ? 2.5 : 1.3, opacity: on ? 1 : 0.6 }, g);
        S('path', { d: 'M' + fx(x - 40) + ' ' + fx(y - 28) + (on ? 'l10 -24h60l10 24' : 'h80'), fill: 'none', stroke: COL.woodDark, 'stroke-width': 2.5 }, g);
        T(g, x, y + 46, names[b], { anchor: 'middle', size: 11, fill: COL.ink2 });
        if (on) {
          const other = p.coins[1 - p.k], drawn = p.coins[p.k];
          K.coin(g, x, y + 2, 15, other === 'G' ? P2.gold : P2.silver);
          K.coin(g, x, y - 88, 19, drawn === 'G' ? P2.gold : P2.silver);
          T(g, x, y - 115, 'drawn', { anchor: 'middle', size: 11, fill: COL.ink2 });
        }
      }
      P2.note(g, W / 2, H - 16, ok ? (p.coins[1 - p.k] === 'G' ? 'Gold drawn — the other is gold too' : 'Gold drawn — the other is silver') : 'Silver drawn: this one does not count');
    }
  };

  /* Three cards: red/red, white/white, red/white; one is drawn and laid down at random */
  SCEN['three-cards'] = {
    cond: 'the side you see is red',
    events: () => [{ label: 'the hidden side is red too', color: COL.red, exact: 2 / 3, show: '2/3' }],
    trial(r) {
      const c = r.int(3), sides = [['R', 'R'], ['W', 'W'], ['R', 'W']][c], up = r.int(2);
      return { ok: sides[up] === 'R', hits: [sides[1 - up] === 'R'], pic: { c, sides, up } };
    },
    draw(g, p, st, W, H, ok) {
      const col = (s) => (s === 'R' ? '#d8543f' : '#fbf8f1');
      const face = p.sides[p.up], back = p.sides[1 - p.up];
      S('rect', { x: W / 2 - 60, y: 40, width: 90, height: 130, rx: 8, fill: col(face), stroke: COL.ink2, 'stroke-width': 2 }, g);
      T(g, W / 2 - 15, 190, 'the side you see', { anchor: 'middle', size: 11, fill: COL.ink2 });
      S('path', { d: 'M' + (W / 2 + 40) + ' 60h60v94h-60Z', fill: col(back), stroke: COL.ink2, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, g);
      T(g, W / 2 + 70, 172, 'underneath', { anchor: 'middle', size: 11, fill: COL.ink2 });
      ['red · red', 'white · white', 'red · white'].forEach((n, i) => T(g, W / 2, 222 + i * 16, (i === p.c ? '▶ ' : '') + n, { anchor: 'middle', size: 11, fill: i === p.c ? COL.ink : COL.muted, weight: i === p.c ? 800 : 500 }));
      P2.note(g, W / 2, H - 14, ok ? (back === 'R' ? 'Red up — red underneath' : 'Red up — white underneath') : 'White up: not counted');
    }
  };

  /* Two children: several ways of learning something about them */
  function kidsScen(kind) {
    return {
      cond: { older: 'the older child is a girl', atleast: 'at least one is a boy', meet: 'the child you meet is a boy', tuesday: 'at least one is a boy born on a Tuesday' }[kind],
      events: () => [kind === 'older'
        ? { label: 'both are girls', color: COL.pink, exact: 1 / 2, show: '1/2' }
        : { label: kind === 'meet' ? 'the other child is a boy' : 'both are boys', color: COL.blue, exact: kind === 'atleast' ? 1 / 3 : kind === 'tuesday' ? 13 / 27 : 1 / 2, show: kind === 'atleast' ? '1/3' : kind === 'tuesday' ? '13/27' : '1/2' }],
      trial(r) {
        const s = [r() < 0.5 ? 'B' : 'G', r() < 0.5 ? 'B' : 'G'], d = [r.int(7), r.int(7)], met = r.int(2);
        let ok, hit;
        if (kind === 'older') { ok = s[0] === 'G'; hit = s[1] === 'G'; }
        else if (kind === 'atleast') { ok = s[0] === 'B' || s[1] === 'B'; hit = s[0] === 'B' && s[1] === 'B'; }
        else if (kind === 'meet') { ok = s[met] === 'B'; hit = s[1 - met] === 'B'; }
        else { ok = (s[0] === 'B' && d[0] === 1) || (s[1] === 'B' && d[1] === 1); hit = s[0] === 'B' && s[1] === 'B'; }
        return { ok, hits: [hit], pic: { s, d, met } };
      },
      draw(g, p, st, W, H, ok) {
        [0, 1].forEach((i) => {
          const x = W * (i === 0 ? 0.32 : 0.68), y = H * 0.36;
          const sz = i === 0 ? 62 : 50;
          K.kid(g, x, y + (i === 0 ? 0 : 10), sz, p.s[i], { opacity: ok ? 1 : 0.45 });
          T(g, x, y + sz + 30, i === 0 ? 'older' : 'younger', { anchor: 'middle', size: 12, fill: COL.ink2 });
          T(g, x, y + sz + 46, p.s[i] === 'B' ? 'boy' : 'girl', { anchor: 'middle', size: 12, weight: 700, fill: p.s[i] === 'B' ? COL.blue : COL.pink });
          if (kind === 'tuesday') T(g, x, y + sz + 62, 'born on a ' + ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][p.d[i]], { anchor: 'middle', size: 11, fill: p.d[i] === 1 ? COL.red : COL.muted, weight: p.d[i] === 1 ? 700 : 500 });
          if (kind === 'meet' && i === p.met) S('circle', { cx: x, cy: y + (i === 0 ? 0 : 10) + sz * 0.4, r: sz * 0.8, fill: 'none', stroke: COL.gold, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, g);
        });
        if (kind === 'meet') P2.note(g, W / 2, 28, 'You meet the child in the gold ring', { size: 11.5 });
        P2.note(g, W / 2, H - 14, ok ? 'Counted' : 'Does not fit what you were told');
      }
    };
  }
  SCEN['kids-older'] = kidsScen('older');
  SCEN['kids-atleast'] = kidsScen('atleast');
  SCEN['kids-meet'] = kidsScen('meet');
  SCEN['kids-tuesday'] = kidsScen('tuesday');

  /* The three prisoners */
  SCEN.prisoners = {
    cond: 'the warden names B',
    events: () => [{ label: 'A is pardoned', color: COL.blue, exact: 1 / 3, show: '1/3' }, { label: 'C is pardoned', color: COL.green, exact: 2 / 3, show: '2/3' }],
    trial(r) {
      const free = r.int(3);
      const named = free === 0 ? (r() < 0.5 ? 1 : 2) : (free === 1 ? 2 : 1);   // one of B and C who will not go free
      return { ok: named === 1, hits: [free === 0, free === 2], pic: { free, named } };
    },
    draw(g, p, st, W, H, ok) {
      ['A', 'B', 'C'].forEach((n, i) => {
        const x = W * (i + 0.5) / 3, y = 70;
        S('rect', { x: x - 32, y, width: 64, height: 90, rx: 6, fill: '#e8e2d2', stroke: COL.ink2, 'stroke-width': 1.5 }, g);
        for (let k = 1; k < 4; k++) S('line', { x1: x - 32 + k * 16, y1: y, x2: x - 32 + k * 16, y2: y + 90, stroke: COL.ink2, 'stroke-width': 2 }, g);
        T(g, x, y + 112, n, { anchor: 'middle', size: 18, weight: 800 });
        if (i === p.free) T(g, x, y + 132, 'pardoned', { anchor: 'middle', size: 12, weight: 800, fill: COL.green });
        if (i === p.named) T(g, x, y - 10, '"not this one"', { anchor: 'middle', size: 11, fill: COL.red, weight: 700 });
      });
      P2.note(g, W / 2, 30, 'The warden names one of B and C who stays locked up', { size: 11.5 });
      P2.note(g, W / 2, H - 14, ok ? 'The warden said B: counted' : 'The warden said C: not counted');
    }
  };

  /* Taking turns until someone wins: a coin (first head) or a die (first six) */
  function raceScen(die) {
    const p = die ? 1 / 6 : 1 / 2;
    return {
      events: () => [{ label: 'the first player wins', color: COL.blue, exact: 1 / (2 - p), show: die ? '6/11' : '2/3' }],
      trial(r) {
        const seq = [];
        for (;;) { const v = die ? 1 + r.int(6) : (r() < 0.5 ? 'H' : 'T'); seq.push(v); if (die ? v === 6 : v === 'H') break; }
        return { hits: [seq.length % 2 === 1], pic: seq };
      },
      draw(g, seq, st, W, H) {
        const n = seq.length, per = 6;
        seq.slice(0, 24).forEach((v, i) => {
          const x = 36 + (i % per) * 44, y = 60 + Math.floor(i / per) * 62;
          const who = i % 2 === 0 ? 'Ann' : 'Bob';
          if (die) { const d = K.die(g, x, y, 32); d.set(v); } else K.coin(g, x, y, 17, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver));
          T(g, x, y + 32, who, { anchor: 'middle', size: 10, fill: i % 2 === 0 ? COL.blue : COL.red });
        });
        P2.note(g, W / 2, H - 14, (n % 2 ? 'Ann' : 'Bob') + ' wins on throw ' + n, { weight: 700, fill: n % 2 ? COL.blue : COL.red });
      }
    };
  }
  SCEN['coin-race'] = raceScen(false);
  SCEN['dice-race'] = raceScen(true);

  // exact helpers
  const choose = K.choose = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
  const binTail = (n, k0) => { let s = 0; for (let k = k0; k <= n; k++) s += choose(n, k); return s / Math.pow(2, n); };
  // a wall of little squares that fills up, one per counted trial (keep mode)
  function wallCell(g, i, color, W, top) { const per = 20, sz = (W - 30) / per; if (i >= per * 14) return; S('rect', { x: 15 + (i % per) * sz, y: top + Math.floor(i / per) * sz, width: sz - 2, height: sz - 2, rx: 2, fill: color }, g); }

  /* A medical test: 1 person in 100 has the illness; the test finds 99 % of the ill and wrongly alarms 1 % of the well */
  SCEN.test = {
    cond: 'the test says "ill"',
    keep: true,
    events: () => [{ label: 'the person really is ill', color: COL.red, exact: 1 / 2, show: '1/2' }],
    trial(r) { const ill = r() < 0.01, pos = ill ? r() < 0.99 : r() < 0.01; return { ok: pos, hits: [ill], pic: { ill, pos } }; },
    clear(g, st, W) { P2.note(g, W / 2, 24, 'Every positive test, as it comes:', { size: 12 }); S('rect', { x: 20, y: 36, width: 12, height: 12, rx: 2, fill: COL.red }, g); T(g, 38, 46, 'ill', { size: 11, fill: COL.ink2 }); S('rect', { x: 80, y: 36, width: 12, height: 12, rx: 2, fill: '#e8b04a' }, g); T(g, 98, 46, 'well (a false alarm)', { size: 11, fill: COL.ink2 }); this.i = 0; },
    draw(g, p, st, W, H, ok) { if (!ok) return; wallCell(g, this.i++, p.ill ? COL.red : '#e8b04a', W, 60); },
    drawLive(g, p, st, W, H, ok) { P2.note(g, W / 2, H - 14, ok ? (p.ill ? 'Positive, and ill' : 'Positive, but well: a false alarm') : 'Negative: not counted', { size: 12 }); }
  };

  /* The taxi-cab witness: 85 % of cabs are green, 15 % blue; the witness names the colour correctly 80 % of the time */
  SCEN.taxi = {
    cond: 'the witness says "blue"',
    keep: true,
    events: () => [{ label: 'the cab really was blue', color: COL.blue, exact: 12 / 29, show: '12/29 ≈ 0.414' }],
    trial(r) { const blue = r() < 0.15, right = r() < 0.8, says = right ? blue : !blue; return { ok: says, hits: [blue], pic: { blue, says } }; },
    clear(g, st, W) { P2.note(g, W / 2, 24, 'Every time the witness says "blue":', { size: 12 }); S('rect', { x: 20, y: 36, width: 12, height: 12, rx: 2, fill: COL.blue }, g); T(g, 38, 46, 'the cab was blue', { size: 11, fill: COL.ink2 }); S('rect', { x: 150, y: 36, width: 12, height: 12, rx: 2, fill: COL.green }, g); T(g, 168, 46, 'it was green', { size: 11, fill: COL.ink2 }); this.i = 0; },
    draw(g, p, st, W, H, ok) { if (!ok) return; wallCell(g, this.i++, p.blue ? COL.blue : COL.green, W, 60); },
    drawLive(g, p, st, W, H, ok) { P2.note(g, W / 2, H - 14, 'A ' + (p.blue ? 'blue' : 'green') + ' cab; the witness says ' + (p.says ? 'blue' : 'green'), { size: 12 }); }
  };

  /* Galton's three coins */
  SCEN['three-coins'] = {
    events: () => [{ label: 'all three alike', color: COL.goldDark, exact: 1 / 4, show: '1/4' }],
    trial(r) { const c = [0, 1, 2].map(() => (r() < 0.5 ? 'H' : 'T')); return { hits: [c[0] === c[1] && c[1] === c[2]], pic: c }; },
    draw(g, c, st, W, H) {
      c.forEach((v, i) => K.coin(g, W * (i + 1) / 4, H * 0.42, 32, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver)));
      const same = c[0] === c[1] && c[1] === c[2];
      P2.note(g, W / 2, H * 0.42 + 70, same ? 'All alike' : 'Two alike, one different', { weight: 700, fill: same ? COL.green : COL.ink2 });
    }
  };

  /* Socks in a drawer: draw two in the dark */
  SCEN.socks = {
    defaults: { red: 3, black: 1 },
    events: (st) => [{ label: 'both socks are red', color: COL.red, exact: st.red * (st.red - 1) / ((st.red + st.black) * (st.red + st.black - 1)), show: null }],
    trial(r, st) { const n = st.red + st.black, a = r.int(n); let b = r.int(n - 1); if (b >= a) b++; return { hits: [a < st.red && b < st.red], pic: { a, b } }; },
    draw(g, p, st, W, H) {
      const n = st.red + st.black, per = Math.min(10, n), sz = Math.min(26, (W - 30) / per);
      S('rect', { x: 10, y: 34, width: W - 20, height: Math.ceil(n / per) * (sz + 12) + 16, rx: 8, fill: '#e2c9a0', stroke: COL.woodDark }, g);
      for (let i = 0; i < n; i++) {
        const x = 20 + (i % per) * (sz + 2), y = 44 + Math.floor(i / per) * (sz + 12), picked = i === p.a || i === p.b;
        const col = i < st.red ? '#d8543f' : '#3a3a3a';
        S('path', { d: 'M' + fx(x + sz * 0.25) + ' ' + fx(y) + 'v' + fx(sz * 0.55) + 'q0 ' + fx(sz * 0.3) + ' ' + fx(sz * 0.3) + ' ' + fx(sz * 0.3) + 'h' + fx(sz * 0.35) + 'v' + fx(-sz * 0.3) + 'h' + fx(-sz * 0.3) + 'v' + fx(-sz * 0.55) + 'Z', fill: col, stroke: picked ? COL.gold : 'none', 'stroke-width': 3, opacity: picked ? 1 : 0.35 }, g);
      }
      const both = p.a < st.red && p.b < st.red;
      P2.note(g, W / 2, H - 14, 'Drew ' + (p.a < st.red ? 'red' : 'black') + ' and ' + (p.b < st.red ? 'red' : 'black') + (both ? ': a red pair' : ''), { weight: 700, fill: both ? COL.red : COL.ink2 });
      P2.note(g, W / 2, 22, st.red + ' red and ' + st.black + ' black socks', { size: 12 });
    },
    controls(F, st, changed) {
      F.slider({ label: 'Red', min: 1, max: 20, step: 1, value: st.red, w: 90, vw: 26, onInput(v) { st.red = v; changed(); } });
      F.slider({ label: 'Black', min: 1, max: 20, step: 1, value: st.black, w: 90, vw: 26, onInput(v) { st.black = v; changed(); } });
    },
    keepState: (st) => ({ red: st.red, black: st.black })
  };

  /* Two cards from a shuffled deck */
  function deckScen(kind) {
    return {
      events: () => [kind === 'aces' ? { label: 'both are aces', color: COL.red, exact: 1 / 221, show: '1/221' } : { label: 'both the same colour', color: COL.ink2, exact: 25 / 51, show: '25/51' }],
      range: () => (kind === 'aces' ? [0, 0.02] : [0, 1]),
      ticks: () => (kind === 'aces' ? [0, 0.01, 0.02] : [0, 0.5, 1]),
      trial(r) { const a = r.int(52); let b = r.int(51); if (b >= a) b++; const rank = (c) => c % 13, suit = (c) => Math.floor(c / 13); return { hits: [kind === 'aces' ? rank(a) === 0 && rank(b) === 0 : (suit(a) < 2) === (suit(b) < 2)], pic: [a, b] }; },
      draw(g, cs, st, W, H) {
        const R = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], SU = ['♥', '♦', '♠', '♣'];
        cs.forEach((c, i) => K.card(g, W / 2 - 80 + i * 90, 50, 70, 100, R[c % 13], SU[Math.floor(c / 13)]));
        const r = kind === 'aces' ? (cs[0] % 13 === 0 && cs[1] % 13 === 0) : ((Math.floor(cs[0] / 13) < 2) === (Math.floor(cs[1] / 13) < 2));
        P2.note(g, W / 2, 190, r ? (kind === 'aces' ? 'Two aces!' : 'Same colour') : (kind === 'aces' ? 'Not two aces' : 'Different colours'), { weight: 700, fill: r ? COL.green : COL.ink2 });
      }
    };
  }
  SCEN['two-aces'] = deckScen('aces');
  SCEN['same-colour'] = deckScen('colour');

  /* The first ace: where does it turn up in a shuffled deck? */
  SCEN['first-ace'] = {
    mean: true,
    events: () => [{ label: 'position of the first ace', color: COL.red, exact: 53 / 5, show: '10.6' }],
    range: () => [0, 20], ticks: () => [0, 10, 20],
    trial(r) { const d = r.shuffle(Array.from({ length: 52 }, (_, i) => i)); const k = d.findIndex((c) => c % 13 === 0); return { vals: [k + 1], pic: d.slice(0, k + 1) }; },
    draw(g, cs, st, W, H) {
      const R = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], SU = ['♥', '♦', '♠', '♣'];
      cs.slice(0, 30).forEach((c, i) => K.card(g, 14 + (i % 8) * 33, 40 + Math.floor(i / 8) * 56, 30, 44, R[c % 13], SU[Math.floor(c / 13)]));
      P2.note(g, W / 2, H - 14, 'The first ace is card number ' + cs.length, { weight: 700 });
    }
  };

  /* The hat-check: n hats handed back at random */
  SCEN.hats = {
    defaults: { n: 4 },
    events: (st) => { let s = 0, f = 1; for (let k = 0; k <= st.n; k++) { if (k) f *= k; s += (k % 2 ? -1 : 1) / f; } return [{ label: 'nobody gets their own hat', color: COL.purple, exact: s, show: null }]; },
    trial(r, st) { const perm = r.shuffle(Array.from({ length: st.n }, (_, i) => i)); return { hits: [perm.every((h, i) => h !== i)], pic: perm }; },
    draw(g, perm, st, W, H) {
      const n = perm.length, cols = COL, pal = ['#b0472f', '#3a6ea5', '#4f7f3a', '#d9a520', '#7d52d6', '#2a8f8a', '#c24c85', '#8a5a26', '#5d6270', '#d9772b', '#3a3020', '#6fa3d6'];
      const per = Math.min(n, 6), sp = (W - 20) / per;
      perm.forEach((h, i) => {
        const x = 10 + sp * (i % per + 0.5), y = 80 + Math.floor(i / per) * 110;
        S('circle', { cx: x, cy: y, r: 13, fill: COL.skin, stroke: COL.ink, 'stroke-width': 1.2 }, g);
        S('path', { d: 'M' + fx(x - 16) + ' ' + fx(y + 42) + 'q0 -26 16 -26t16 26Z', fill: pal[i % 12], stroke: COL.ink, 'stroke-width': 1.2 }, g);
        S('path', { d: 'M' + fx(x - 15) + ' ' + fx(y - 11) + 'h30M' + fx(x - 9) + ' ' + fx(y - 11) + 'v-12h18v12', fill: pal[h % 12], stroke: COL.ink, 'stroke-width': 1.2 }, g);
        if (h === i) T(g, x, y + 60, '✓ own', { anchor: 'middle', size: 11, weight: 800, fill: COL.green });
      });
      const none = perm.every((h, i) => h !== i);
      P2.note(g, W / 2, H - 14, none ? 'Nobody has their own hat' : perm.filter((h, i) => h === i).length + ' got their own hat back', { weight: 700, fill: none ? COL.purple : COL.ink2 });
      P2.note(g, W / 2, 24, 'Coat colour = the hat that is theirs', { size: 11 });
      void cols;
    },
    controls(F, st, changed) { F.slider({ label: 'Guests', min: 2, max: 12, step: 1, value: st.n, w: 120, vw: 30, onInput(v) { st.n = v; changed(); } }); },
    keepState: (st) => ({ n: st.n })
  };

  /* Darts at a square with a circle inside: estimate π */
  SCEN.darts = {
    keep: true, keepMax: 3000,
    events: () => [{ label: 'darts inside the circle', color: COL.red, exact: Math.PI / 4, show: 'π/4 ≈ 0.785' }],
    trial(r) { const x = r() * 2 - 1, y = r() * 2 - 1; return { hits: [x * x + y * y <= 1], pic: [x, y] }; },
    clear(g, st, W, H) { const s = Math.min(W, H) - 40, x0 = (W - s) / 2, y0 = (H - s) / 2 - 6; this.box = [x0, y0, s]; S('rect', { x: x0, y: y0, width: s, height: s, fill: '#fff', stroke: COL.ink2, 'stroke-width': 1.5 }, g); S('circle', { cx: x0 + s / 2, cy: y0 + s / 2, r: s / 2, fill: 'none', stroke: COL.ink2, 'stroke-width': 1.5 }, g); },
    draw(g, p) { const [x0, y0, s] = this.box; S('circle', { cx: x0 + (p[0] + 1) / 2 * s, cy: y0 + (p[1] + 1) / 2 * s, r: 1.7, fill: p[0] * p[0] + p[1] * p[1] <= 1 ? COL.red : COL.blue }, g); },
    extra: (c) => (c.m ? 'π ≈ 4 × ' + (c.hits[0] / c.m).toFixed(4) + ' = ' + (4 * c.hits[0] / c.m).toFixed(4) : 'π ≈ …')
  };

  /* Buffon's needle: needles as long as the boards are wide */
  SCEN.buffon = {
    keep: true, keepMax: 900,
    events: () => [{ label: 'needles crossing a line', color: COL.red, exact: 2 / Math.PI, show: '2/π ≈ 0.637' }],
    trial(r) { const y = r() * 1, a = r() * Math.PI, x = r(); const dy = Math.sin(a) / 2; return { hits: [y - dy < 0 || y + dy > 1], pic: [x, y, a] }; },
    clear(g, st, W, H) {
      const d = (H - 50) / 4;
      this.d = d;
      for (let k = 0; k < 4; k++) S('rect', { x: 10, y: 20 + k * d, width: W - 20, height: d, fill: k % 2 ? '#e9d3a9' : '#f0dcb5' }, g);
      for (let k = 0; k <= 4; k++) S('line', { x1: 10, y1: 20 + k * d, x2: W - 10, y2: 20 + k * d, stroke: COL.woodDark, 'stroke-width': 1.5 }, g);
      this.row = 0;
    },
    draw(g, p, st, W) {
      const d = this.d, row = (this.row = (this.row + 1) % 4), cy = 20 + (row + p[1]) * d, cx = 20 + p[0] * (W - 40);
      const dx = Math.cos(p[2]) * d / 2, dy = Math.sin(p[2]) * d / 2;
      const cross = p[1] - Math.sin(p[2]) / 2 < 0 || p[1] + Math.sin(p[2]) / 2 > 1;
      S('line', { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy, stroke: cross ? COL.red : '#555', 'stroke-width': 1.4, opacity: 0.8 }, g);
    },
    extra: (c) => (c.hits[0] ? 'π ≈ 2 × needles ÷ crossings = ' + (2 * c.m / c.hits[0]).toFixed(4) : 'π ≈ …')
  };

  /* A stick broken at two random points: do the pieces make a triangle? */
  SCEN.stick = {
    events: () => [{ label: 'the pieces make a triangle', color: COL.green, exact: 1 / 4, show: '1/4' }],
    trial(r) { const a = r(), b = r(), x = Math.min(a, b), y = Math.max(a, b); const L = [x, y - x, 1 - y]; return { hits: [Math.max(...L) < 0.5], pic: L }; },
    draw(g, L, st, W, H) {
      const len = W - 40, cols = [COL.red, COL.blue, COL.gold];
      let x = 20;
      L.forEach((l, i) => { S('rect', { x, y: 40, width: l * len - 3, height: 10, rx: 3, fill: cols[i] }, g); x += l * len; });
      const ok = Math.max(...L) < 0.5, s = 150;
      if (ok) {
        const [a, b, c] = L;
        const cosC = (a * a + b * b - c * c) / (2 * a * b), C2 = Math.acos(clamp(cosC, -1, 1));
        const p0 = [W / 2 - a * s / 2, 200], p1 = [p0[0] + a * s, 200], p2 = [p1[0] - b * s * Math.cos(C2), 200 - b * s * Math.sin(C2)];
        S('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: cols[0], 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
        S('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: cols[1], 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
        S('line', { x1: p2[0], y1: p2[1], x2: p0[0], y2: p0[1], stroke: cols[2], 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      } else {
        const big = L.indexOf(Math.max(...L));
        P2.note(g, W / 2, 140, 'One piece is longer than the other two together', { size: 11.5, fill: cols[big], weight: 700 });
      }
      P2.note(g, W / 2, H - 14, ok ? 'A triangle!' : 'No triangle', { weight: 700, fill: ok ? COL.green : COL.ink2 });
    }
  };

  /* Bertrand's chord, three ways of choosing "a random chord" */
  SCEN.chord = {
    events: () => [
      { label: '1 · two points on the rim', color: COL.red, exact: 1 / 3, show: '1/3' },
      { label: '2 · a point on a radius', color: COL.blue, exact: 1 / 2, show: '1/2' },
      { label: '3 · a midpoint in the disc', color: COL.green, exact: 1 / 4, show: '1/4' }
    ],
    trial(r) {
      const S3 = Math.sqrt(3);
      const a1 = r() * TAU, a2 = r() * TAU;
      const l1 = 2 * Math.abs(Math.sin((a1 - a2) / 2));
      const d2 = r(), t2 = r() * TAU, l2 = 2 * Math.sqrt(1 - d2 * d2);
      let mx, my; do { mx = r() * 2 - 1; my = r() * 2 - 1; } while (mx * mx + my * my > 1);
      const l3 = 2 * Math.sqrt(1 - mx * mx - my * my);
      return { hits: [l1 > S3, l2 > S3, l3 > S3], pic: { a1, a2, d2, t2, mx, my } };
    },
    draw(g, p, st, W, H) {
      const R = 40, S3 = Math.sqrt(3);
      const circ = (cx, cy, label) => { S('circle', { cx, cy, r: R, fill: '#fff', stroke: COL.ink2, 'stroke-width': 1.3 }, g); S('path', { d: 'M' + fx(cx) + ' ' + fx(cy - R) + 'L' + fx(cx + R * S3 / 2) + ' ' + fx(cy + R / 2) + 'L' + fx(cx - R * S3 / 2) + ' ' + fx(cy + R / 2) + 'Z', fill: 'none', stroke: COL.faint, 'stroke-width': 1 }, g); T(g, cx, cy + R + 16, label, { anchor: 'middle', size: 10.5, fill: COL.ink2 }); };
      const chord = (cx, cy, x1, y1, x2, y2, col, long) => S('line', { x1: cx + x1 * R, y1: cy + y1 * R, x2: cx + x2 * R, y2: cy + y2 * R, stroke: col, 'stroke-width': long ? 3.5 : 1.8, opacity: long ? 1 : 0.6 }, g);
      const cy = 90, xs = [W * 0.2, W * 0.5, W * 0.8];
      circ(xs[0], cy, 'two rim points'); circ(xs[1], cy, 'point on a radius'); circ(xs[2], cy, 'random midpoint');
      const l1 = 2 * Math.abs(Math.sin((p.a1 - p.a2) / 2));
      chord(xs[0], cy, Math.cos(p.a1), Math.sin(p.a1), Math.cos(p.a2), Math.sin(p.a2), COL.red, l1 > S3);
      const ux = Math.cos(p.t2), uy = Math.sin(p.t2), h2 = Math.sqrt(1 - p.d2 * p.d2);
      S('line', { x1: xs[1], y1: cy, x2: xs[1] + ux * R, y2: cy + uy * R, stroke: COL.faint, 'stroke-dasharray': '2 2' }, g);
      chord(xs[1], cy, p.d2 * ux - h2 * uy, p.d2 * uy + h2 * ux, p.d2 * ux + h2 * uy, p.d2 * uy - h2 * ux, COL.blue, h2 * 2 > S3);
      const dm = Math.hypot(p.mx, p.my) || 1e-9, h3 = Math.sqrt(1 - dm * dm), vx = -p.my / dm, vy = p.mx / dm;
      chord(xs[2], cy, p.mx - h3 * vx, p.my - h3 * vy, p.mx + h3 * vx, p.my + h3 * vy, COL.green, h3 * 2 > S3);
      S('circle', { cx: xs[2] + p.mx * R, cy: cy + p.my * R, r: 2.5, fill: COL.green }, g);
      P2.note(g, W / 2, 190, 'Thick: longer than a side of the triangle', { size: 11.5 });
      P2.note(g, W / 2, 26, 'The same question, three meanings of "random"', { size: 11.5 });
    }
  };

  /* The problem of points: first to 3 wins; the game stops at 2–1 */
  SCEN.points = {
    events: () => [{ label: 'the leader goes on to win', color: COL.blue, exact: 3 / 4, show: '3/4' }],
    trial(r) { let a = 2, b = 1; const seq = []; while (a < 3 && b < 3) { if (r() < 0.5) { a++; seq.push('A'); } else { b++; seq.push('B'); } } return { hits: [a === 3], pic: seq }; },
    draw(g, seq, st, W, H) {
      P2.note(g, W / 2, 40, 'Stopped at 2 – 1 (first to 3 wins)', { size: 12.5 });
      seq.forEach((w, i) => { const x = W / 2 - (seq.length - 1) * 40 + i * 80; K.coin(g, x, 110, 24, Object.assign({ label: w }, w === 'A' ? P2.gold : P2.silver)); T(g, x, 150, 'round ' + (4 + i), { anchor: 'middle', size: 11, fill: COL.ink2 }); });
      const aw = seq[seq.length - 1] === 'A';
      P2.note(g, W / 2, H - 14, (aw ? 'Anne' : 'Bert') + ' would have won', { weight: 700, fill: aw ? COL.blue : COL.red });
    }
  };

  /* Gambler's ruin: a fair coin, £1 a toss, from £start until £0 or £goal */
  SCEN.ruin = {
    defaults: { start: 3, goal: 10 },
    events: (st) => [{ label: 'reaches £' + st.goal + ' before £0', color: COL.green, exact: st.start / st.goal, show: st.start + '/' + st.goal }],
    trial(r, st) { let x = st.start; const path = [x]; while (x > 0 && x < st.goal) { x += r() < 0.5 ? 1 : -1; path.push(x); } return { hits: [x === st.goal], pic: path }; },
    draw(g, path, st, W, H) {
      const n = path.length, sx = (W - 30) / Math.max(20, n), sy = (H - 70) / st.goal, Y = (v) => H - 30 - v * sy;
      S('line', { x1: 15, y1: Y(st.goal), x2: W - 15, y2: Y(st.goal), stroke: COL.green, 'stroke-dasharray': '4 3' }, g);
      S('line', { x1: 15, y1: Y(0), x2: W - 15, y2: Y(0), stroke: COL.red, 'stroke-dasharray': '4 3' }, g);
      T(g, W - 16, Y(st.goal) - 4, '£' + st.goal, { anchor: 'end', size: 11, fill: COL.green });
      T(g, W - 16, Y(0) - 4, '£0', { anchor: 'end', size: 11, fill: COL.red });
      S('path', { d: K.path(path.map((v, i) => [15 + i * sx, Y(v)])), fill: 'none', stroke: COL.ink2, 'stroke-width': 1.6 }, g);
      P2.note(g, W / 2, 24, 'Your money after each toss (' + (n - 1) + ' tosses)', { size: 12 });
    },
    controls(F, st, changed) {
      F.slider({ label: 'Start', min: 1, max: 9, step: 1, value: st.start, w: 90, vw: 36, fmt: (v) => '£' + v, onInput(v) { st.start = Math.min(v, st.goal - 1); changed(); } });
      F.slider({ label: 'Goal', min: 2, max: 20, step: 1, value: st.goal, w: 90, vw: 36, fmt: (v) => '£' + v, onInput(v) { st.goal = Math.max(v, st.start + 1); changed(); } });
    },
    keepState: (st) => ({ start: st.start, goal: st.goal })
  };

  /* The Chevalier de Méré's two bets */
  SCEN.demere = {
    events: () => [{ label: 'a six in 4 throws of one die', color: COL.blue, exact: 1 - Math.pow(5 / 6, 4), show: '671/1296 ≈ 0.518' }, { label: 'a double six in 24 throws of two', color: COL.red, exact: 1 - Math.pow(35 / 36, 24), show: '≈ 0.491' }],
    range: () => [0.3, 0.7], ticks: () => [0.3, 0.5, 0.7],
    trial(r) { const a = [0, 1, 2, 3].map(() => 1 + r.int(6)); const b = Array.from({ length: 24 }, () => [1 + r.int(6), 1 + r.int(6)]); return { hits: [a.includes(6), b.some((q) => q[0] === 6 && q[1] === 6)], pic: { a, b } }; },
    draw(g, p, st, W, H) {
      P2.note(g, W / 2, 22, 'Bet 1: four throws', { size: 12, weight: 700, fill: COL.blue });
      p.a.forEach((v, i) => { const d = K.die(g, W / 2 - 66 + i * 44, 52, 32, { fill: v === 6 ? '#dbe8f7' : '#fffdf6' }); d.set(v); });
      P2.note(g, W / 2, 100, 'Bet 2: twenty-four throws of a pair', { size: 12, weight: 700, fill: COL.red });
      p.b.forEach((q, i) => { const x = 18 + (i % 8) * 34, y = 116 + Math.floor(i / 8) * 34, dd = q[0] === 6 && q[1] === 6; S('rect', { x, y, width: 30, height: 26, rx: 4, fill: dd ? '#f6d4cc' : '#fffdf6', stroke: dd ? COL.red : COL.line }, g); T(g, x + 15, y + 17, q[0] + '·' + q[1], { anchor: 'middle', size: 11, weight: dd ? 800 : 500, fill: dd ? COL.red : COL.ink2 }); });
    }
  };

  /* Two dice: a double */
  SCEN.doubles = {
    events: () => [{ label: 'a double', color: COL.purple, exact: 1 / 6, show: '1/6' }],
    range: () => [0, 0.4], ticks: () => [0, 0.2, 0.4],
    trial(r) { const a = 1 + r.int(6), b = 1 + r.int(6); return { hits: [a === b], pic: [a, b] }; },
    draw(g, p, st, W, H) { p.forEach((v, i) => { const d = K.die(g, W / 2 - 40 + i * 80, H * 0.4, 60); d.set(v); }); P2.note(g, W / 2, H * 0.4 + 70, p[0] === p[1] ? 'A double!' : 'Not a double', { weight: 700, fill: p[0] === p[1] ? COL.purple : COL.ink2 }); }
  };

  /* Chuck-a-luck: bet $1 on a number, roll three dice */
  SCEN.chuck = {
    mean: true,
    events: () => [{ label: 'dollars won per $1 game', color: COL.red, exact: -17 / 216, show: '−17/216 ≈ −0.079' }],
    range: () => [-0.5, 0.5], ticks: () => [-0.5, 0, 0.5], yfmt: (v) => (v > 0 ? '+' : '') + v.toFixed(2),
    trial(r) { const d = [1 + r.int(6), 1 + r.int(6), 1 + r.int(6)]; const k = d.filter((v) => v === 6).length; return { vals: [k ? k : -1], pic: d }; },
    draw(g, d, st, W, H) {
      P2.note(g, W / 2, 30, 'You bet $1 on six', { size: 12.5 });
      d.forEach((v, i) => { const dd = K.die(g, W / 2 - 70 + i * 70, 100, 52, { fill: v === 6 ? '#dbe8f7' : '#fffdf6' }); dd.set(v); });
      const k = d.filter((v) => v === 6).length;
      P2.note(g, W / 2, 170, k ? 'Win $' + k + ' (and keep your dollar)' : 'Lose your dollar', { weight: 700, fill: k ? COL.green : COL.red });
    }
  };

  /* Waiting times */
  function waitScen(kind) {
    const cfg = {
      six: { label: 'throws until the first six', exact: 6, show: '6', range: [0, 12] },
      coupon: { label: 'throws until all six faces have shown', exact: 14.7, show: '14.7', range: [0, 30] },
      '66': { label: 'throws until two sixes in a row', exact: 42, show: '42', range: [0, 90] },
      hhht: null
    }[kind];
    if (kind === 'hhht') {
      return {
        mean: true,
        events: () => [{ label: 'tosses until HH', color: COL.red, exact: 6, show: '6' }, { label: 'tosses until HT', color: COL.blue, exact: 4, show: '4' }],
        range: () => [0, 12], ticks: () => [0, 4, 6, 12],
        trial(r) {
          const run = (t) => { const s = []; for (;;) { s.push(r() < 0.5 ? 'H' : 'T'); const n = s.length; if (n >= 2 && s[n - 2] + s[n - 1] === t) return s; } };
          const a = run('HH'), b = run('HT');
          return { vals: [a.length, b.length], pic: [a, b] };
        },
        draw(g, p, st, W, H) {
          ['HH', 'HT'].forEach((t, k) => {
            T(g, 14, 36 + k * 120, 'Waiting for ' + t + ': ' + p[k].length + ' tosses', { size: 12.5, weight: 700, fill: k ? COL.blue : COL.red });
            p[k].slice(-24).forEach((v, i) => { const x = 22 + (i % 12) * 22, y = 58 + k * 120 + Math.floor(i / 12) * 26; K.coin(g, x, y, 9.5, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver)); });
          });
        }
      };
    }
    return {
      mean: true,
      events: () => [{ label: cfg.label, color: kind === '66' ? COL.red : COL.blue, exact: cfg.exact, show: cfg.show }],
      range: () => cfg.range,
      trial(r) {
        const s = [], seen = new Set();
        for (;;) {
          const v = 1 + r.int(6); s.push(v); seen.add(v);
          if (kind === 'six' && v === 6) break;
          if (kind === 'coupon' && seen.size === 6) break;
          if (kind === '66' && v === 6 && s[s.length - 2] === 6) break;
        }
        return { vals: [s.length], pic: s };
      },
      draw(g, s, st, W, H) {
        const show = s.slice(-48), per = 8, sz = 28;
        show.forEach((v, i) => { const d = K.die(g, 26 + (i % per) * 33, 44 + Math.floor(i / per) * 33, sz, { fill: (kind === 'six' || kind === '66') && v === 6 ? '#dbe8f7' : '#fffdf6' }); d.set(v); });
        if (s.length > 48) P2.note(g, W / 2, 24, '… the last 48 of ' + s.length + ' throws', { size: 11 });
        P2.note(g, W / 2, H - 14, s.length + (s.length === 1 ? ' throw' : ' throws'), { weight: 700 });
      }
    };
  }
  SCEN['wait-six'] = waitScen('six');
  SCEN['wait-coupon'] = waitScen('coupon');
  SCEN['wait-66'] = waitScen('66');
  SCEN['wait-hh-ht'] = waitScen('hhht');

  /* After five heads in a row … the next toss */
  SCEN.streak = {
    events: () => [{ label: 'the next toss is heads', color: COL.goldDark, exact: 1 / 2, show: '1/2' }],
    trial(r) { const s = []; let run = 0; for (;;) { const v = r() < 0.5 ? 'H' : 'T'; s.push(v); run = v === 'H' ? run + 1 : 0; if (run === 5) break; } const nx = r() < 0.5 ? 'H' : 'T'; s.push(nx); return { hits: [nx === 'H'], pic: s }; },
    draw(g, s, st, W, H) {
      const show = s.slice(-12);
      show.forEach((v, i) => { const last = i === show.length - 1; K.coin(g, 26 + (i % 6) * 46, 70 + Math.floor(i / 6) * 60, last ? 20 : 17, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver)); if (last) S('circle', { cx: 26 + (i % 6) * 46, cy: 70 + Math.floor(i / 6) * 60, r: 26, fill: 'none', stroke: COL.red, 'stroke-width': 2.5 }, g); });
      P2.note(g, W / 2, 24, 'Toss until five heads in a row, then once more', { size: 11.5 });
      P2.note(g, W / 2, H - 14, 'After ' + (s.length - 1) + ' tosses: the next one is ' + (s[s.length - 1] === 'H' ? 'heads' : 'tails'), { weight: 700 });
    }
  };

  /* Two particular sequences of five tosses */
  SCEN.sequences = {
    events: () => [{ label: 'exactly H H H H H', color: COL.red, exact: 1 / 32, show: '1/32' }, { label: 'exactly H T H H T', color: COL.blue, exact: 1 / 32, show: '1/32' }],
    range: () => [0, 0.1], ticks: () => [0, 0.05, 0.1],
    trial(r) { const s = [0, 1, 2, 3, 4].map(() => (r() < 0.5 ? 'H' : 'T')).join(''); return { hits: [s === 'HHHHH', s === 'HTHHT'], pic: s }; },
    draw(g, s, st, W, H) {
      s.split('').forEach((v, i) => K.coin(g, 38 + i * 54, H * 0.4, 22, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver)));
      P2.note(g, W / 2, H * 0.4 + 50, s === 'HHHHH' || s === 'HTHHT' ? 'One of the two!' : 'Neither of the two', { weight: 700 });
    }
  };

  /* Two hospitals: how often do more than 60 % of a day's babies turn out to be boys? */
  SCEN.hospital = {
    events: () => [{ label: 'small hospital (15 births): ≥ 60 % boys', color: COL.red, exact: binTail(15, 9), show: K.num(binTail(15, 9), 3) }, { label: 'large hospital (45 births): ≥ 60 % boys', color: COL.blue, exact: binTail(45, 27), show: K.num(binTail(45, 27), 3) }],
    range: () => [0, 0.6], ticks: () => [0, 0.3, 0.6],
    trial(r) { const a = Array.from({ length: 15 }, () => r() < 0.5), b = Array.from({ length: 45 }, () => r() < 0.5); const ka = a.filter(Boolean).length, kb = b.filter(Boolean).length; return { hits: [ka >= 9, kb >= 27], pic: { a, b, ka, kb } }; },
    draw(g, p, st, W, H) {
      const row = (arr, y, sz, per) => arr.forEach((b, i) => S('circle', { cx: 20 + (i % per) * sz, cy: y + Math.floor(i / per) * sz, r: sz * 0.36, fill: b ? COL.blue : COL.pink }, g));
      T(g, 14, 30, 'Small: ' + p.ka + ' boys of 15 (' + Math.round(p.ka / 15 * 100) + ' %)', { size: 12, weight: 700, fill: p.ka >= 9 ? COL.red : COL.ink2 });
      row(p.a, 48, 17, 15);
      T(g, 14, 92, 'Large: ' + p.kb + ' boys of 45 (' + Math.round(p.kb / 45 * 100) + ' %)', { size: 12, weight: 700, fill: p.kb >= 27 ? COL.blue : COL.ink2 });
      row(p.b, 110, 17, 15);
      P2.note(g, W / 2, H - 14, 'One day at each hospital (blue: boys)', { size: 11.5 });
    }
  };

  /* Penney's game: two patterns of three tosses race each other */
  const penneyCorr = (x, y) => { let s = 0; for (let k = 1; k <= 3; k++) if (x.slice(3 - k) === y.slice(0, k)) s += 1 << (k - 1); return s; };
  K.penney = (a, b) => { if (a === b) return 0.5; const num = penneyCorr(a, a) - penneyCorr(a, b), den = num + penneyCorr(b, b) - penneyCorr(b, a); return num / den; };   // chance that b turns up before a
  SCEN.penney = {
    defaults: { a: 'HHH', b: 'THH' },
    events: (st) => [{ label: 'your ' + st.b + ' comes first (friend: ' + st.a + ')', color: COL.blue, exact: K.penney(st.a, st.b), show: null }],
    trial(r, st) { let s = ''; for (;;) { s += r() < 0.5 ? 'H' : 'T'; if (s.endsWith(st.b)) return { hits: [true], pic: s }; if (s.endsWith(st.a)) return { hits: [false], pic: s }; } },
    draw(g, s, st, W, H) {
      const show = s.slice(-30), off = s.length - show.length;
      show.split('').forEach((v, i) => { const inWin = i >= show.length - 3; const x = 24 + (i % 10) * 26, y = 60 + Math.floor(i / 10) * 34; K.coin(g, x, y, 11, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver)); if (inWin) S('circle', { cx: x, cy: y, r: 14, fill: 'none', stroke: s.endsWith(st.b) ? COL.blue : COL.red, 'stroke-width': 2.5 }, g); });
      void off;
      const you = s.endsWith(st.b);
      P2.note(g, W / 2, H - 14, (you ? 'Your ' + st.b : 'Friend’s ' + st.a) + ' came first, after ' + s.length + ' tosses', { weight: 700, fill: you ? COL.blue : COL.red });
    },
    controls(F, st, changed) {
      const opts = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'];
      let ia = opts.indexOf(st.a), ib = opts.indexOf(st.b);
      const ba = F.button('Friend: ' + st.a, () => { ia = (ia + 1) % 8; if (opts[ia] === opts[ib]) ia = (ia + 1) % 8; st.a = opts[ia]; ba.label('Friend: ' + st.a); changed(); }, { w: 124, title: 'Change your friend’s pattern' });
      const bb = F.button('You: ' + st.b, () => { ib = (ib + 1) % 8; if (opts[ib] === opts[ia]) ib = (ib + 1) % 8; st.b = opts[ib]; bb.label('You: ' + st.b); changed(); }, { w: 110, title: 'Change your pattern' });
    },
    keepState: (st) => ({ a: st.a, b: st.b })
  };

  /* The two envelopes: one holds twice the other; you open one; stick or switch? */
  SCEN.envelopes = {
    mean: true,
    events: () => [{ label: 'always keep: average win', color: COL.blue, exact: 150, show: '150' }, { label: 'always switch: average win', color: COL.red, exact: 150, show: '150' }],
    range: () => [0, 300], ticks: () => [0, 150, 300],
    trial(r) { const x = 100, pair = [x, 2 * x], k = r.int(2); return { vals: [pair[k], pair[1 - k]], pic: { mine: pair[k], other: pair[1 - k] } }; },
    draw(g, p, st, W, H) {
      [[p.mine, 'yours'], [p.other, 'the other']].forEach((q, i) => {
        const x = W * (i ? 0.72 : 0.28), y = 90;
        S('rect', { x: x - 50, y, width: 100, height: 64, rx: 4, fill: '#f6efe0', stroke: COL.ink2, 'stroke-width': 1.5 }, g);
        S('path', { d: 'M' + (x - 50) + ' ' + y + 'l50 34 50 -34', fill: 'none', stroke: COL.ink2, 'stroke-width': 1.5 }, g);
        T(g, x, y + 92, '$' + q[0], { anchor: 'middle', size: 18, weight: 800, fill: i ? COL.red : COL.blue });
        T(g, x, y - 10, q[1], { anchor: 'middle', size: 12, fill: COL.ink2 });
      });
      P2.note(g, W / 2, 30, 'One envelope holds $100, the other $200', { size: 12 });
    }
  };

  /* The bus: buses come 5 and 15 minutes apart, in turn; you arrive at a random moment */
  SCEN.bus = {
    mean: true,
    events: () => [{ label: 'minutes you wait', color: COL.orange, exact: 6.25, show: '6.25' }],
    range: () => [0, 15], ticks: () => [0, 5, 10, 15],
    trial(r) { const t = r() * 20, wait = t < 5 ? 5 - t : 20 - t; return { vals: [wait], pic: t }; },
    draw(g, t, st, W, H) {
      const x0 = 20, sc = (W - 40) / 40, y = 110;
      S('line', { x1: x0, y1: y, x2: W - 20, y2: y, stroke: COL.ink2, 'stroke-width': 2 }, g);
      [0, 5, 20, 25, 40].forEach((b) => { S('rect', { x: x0 + b * sc - 10, y: y - 26, width: 20, height: 18, rx: 3, fill: COL.red }, g); T(g, x0 + b * sc, y + 18, b + '′', { anchor: 'middle', size: 10, fill: COL.ink2 }); });
      const at = 20 + t, next = t < 5 ? 25 : 40;
      S('circle', { cx: x0 + at * sc, cy: y, r: 6, fill: COL.blue }, g);
      S('path', { d: 'M' + fx(x0 + at * sc) + ' ' + (y + 30) + 'H' + fx(x0 + next * sc), stroke: COL.orange, 'stroke-width': 4 }, g);
      P2.note(g, W / 2, 60, 'You arrive at a random moment', { size: 12 });
      P2.note(g, W / 2, y + 60, 'You wait ' + (next - at).toFixed(1) + ' minutes', { weight: 700, fill: COL.orange });
      P2.note(g, W / 2, H - 14, 'Buses: 5 and 15 minutes apart, in turn (every 10 on average)', { size: 11 });
    }
  };

  /* The secretary problem: skip the first k candidates, then take the first one better than all of them */
  SCEN.secretary = {
    defaults: { n: 100, k: 20 },
    events: (st) => { let s = 0; for (let i = st.k + 1; i <= st.n; i++) s += 1 / (i - 1); return [{ label: 'you pick the very best (skipping ' + st.k + ')', color: COL.green, exact: st.k / st.n * s, show: null }]; },
    trial(r, st) {
      const q = r.shuffle(Array.from({ length: st.n }, (_, i) => i));
      let bestSeen = -1; for (let i = 0; i < st.k; i++) bestSeen = Math.max(bestSeen, q[i]);
      let pick = st.n - 1; for (let i = st.k; i < st.n; i++) if (q[i] > bestSeen) { pick = i; break; }
      return { hits: [q[pick] === st.n - 1], pic: { q, pick } };
    },
    draw(g, p, st, W, H) {
      const n = p.q.length, bw = (W - 20) / n, base = H - 40;
      p.q.forEach((v, i) => S('rect', { x: 10 + i * bw, y: base - (v + 1) / n * (H - 90), width: Math.max(1, bw - 0.6), height: (v + 1) / n * (H - 90), fill: i === p.pick ? (v === n - 1 ? COL.green : COL.red) : v === n - 1 ? COL.gold : i < st.k ? COL.faint : '#b9c3d6' }, g));
      S('line', { x1: 10 + st.k * bw, y1: 36, x2: 10 + st.k * bw, y2: base, stroke: COL.purple, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, g);
      T(g, 10 + st.k * bw + 4, 46, 'look only', { size: 10, fill: COL.purple });
      P2.note(g, W / 2, 24, 'Candidates in the order they come', { size: 11.5 });
      P2.note(g, W / 2, H - 14, p.q[p.pick] === n - 1 ? 'You picked the best!' : 'You picked number ' + (n - p.q[p.pick]) + ' of ' + n, { weight: 700, fill: p.q[p.pick] === n - 1 ? COL.green : COL.red });
    },
    controls(F, st, changed) { F.slider({ label: 'Skip the first', min: 1, max: 99, step: 1, value: st.k, w: 170, vw: 40, onInput(v) { st.k = v; changed(); } }); },
    keepState: (st) => ({ k: st.k })
  };

  /* Birthdays in a room */
  SCEN.birthday = {
    defaults: { n: 23, mine: false },
    events: (st) => {
      let p = 1; for (let i = 0; i < st.n; i++) p *= (365 - i) / 365;
      return [st.mine ? { label: 'someone shares YOUR birthday', color: COL.red, exact: 1 - Math.pow(364 / 365, st.n), show: null } : { label: 'two people share a birthday', color: COL.red, exact: 1 - p, show: null }];
    },
    trial(r, st) {
      const d = Array.from({ length: st.n }, () => r.int(365));
      let hit;
      if (st.mine) hit = d.includes(0);
      else { const seen = new Set(); hit = false; for (const x of d) { if (seen.has(x)) { hit = true; break; } seen.add(x); } }
      return { hits: [hit], pic: d };
    },
    draw(g, d, st, W, H) {
      const cx = W / 2, cy = H / 2 - 4, R = Math.min(W, H) / 2 - 34;
      S('circle', { cx, cy, r: R, fill: 'none', stroke: COL.faint, 'stroke-width': 8 }, g);
      ['Jan', 'Apr', 'Jul', 'Oct'].forEach((m, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; T(g, cx + (R + 20) * Math.cos(a), cy + (R + 20) * Math.sin(a) + 4, m, { anchor: 'middle', size: 10, fill: COL.muted }); });
      const cnt = {};
      d.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; });
      if (st.mine) { const a = -Math.PI / 2; S('circle', { cx: cx + R * Math.cos(a), cy: cy + R * Math.sin(a), r: 7, fill: 'none', stroke: COL.gold, 'stroke-width': 3 }, g); }
      Object.keys(cnt).forEach((k) => {
        const a = -Math.PI / 2 + k / 365 * TAU, c = cnt[k];
        const shared = st.mine ? +k === 0 : c > 1;
        for (let j = 0; j < c; j++) S('circle', { cx: cx + (R - j * 7) * Math.cos(a), cy: cy + (R - j * 7) * Math.sin(a), r: shared ? 4.5 : 2.6, fill: shared ? COL.red : COL.blue }, g);
      });
      const pairs = Object.values(cnt).filter((c) => c > 1).length;
      P2.note(g, cx, cy - 4, st.n + ' people', { size: 14, weight: 800, fill: COL.ink });
      P2.note(g, cx, cy + 14, st.mine ? (d.includes(0) ? 'someone shares yours!' : 'nobody shares yours') : pairs ? pairs + (pairs > 1 ? ' shared birthdays' : ' shared birthday') : 'all different', { size: 11.5, fill: (st.mine ? d.includes(0) : pairs) ? COL.red : COL.ink2 });
    },
    controls(F, st, changed) { F.slider({ label: 'People in the room', min: st.mine ? 20 : 2, max: st.mine ? 500 : 80, step: 1, value: st.n, w: 160, vw: 36, onInput(v) { st.n = v; changed(); } }); },
    keepState: (st) => ({ n: st.n })
  };

  /* Ten tosses of a coin: exactly five heads */
  SCEN.ten = {
    events: () => [{ label: 'exactly 5 heads', color: COL.goldDark, exact: 252 / 1024, show: '63/256 ≈ 0.246' }],
    range: () => [0, 0.5], ticks: () => [0, 0.25, 0.5],
    trial(r) { const s = Array.from({ length: 10 }, () => (r() < 0.5 ? 'H' : 'T')); return { hits: [s.filter((v) => v === 'H').length === 5], pic: s }; },
    draw(g, s, st, W, H) { s.forEach((v, i) => K.coin(g, 32 + (i % 5) * 56, 80 + Math.floor(i / 5) * 62, 22, Object.assign({ label: v }, v === 'H' ? P2.gold : P2.silver))); const k = s.filter((v) => v === 'H').length; P2.note(g, W / 2, 230, k + ' heads', { weight: 700, fill: k === 5 ? COL.green : COL.ink2 }); }
  };

  /* The St Petersburg game: toss until the first tail; the prize doubles each time */
  SCEN.stpete = {
    mean: true,
    defaults: { cap: 0 },
    events: (st) => [{ label: 'average prize per game', color: COL.purple, exact: st.cap ? Math.log2(st.cap) + 1 : null, show: st.cap ? String(Math.log2(st.cap) + 1) : '∞' }],
    range: () => [0, 40], ticks: () => [0, 10, 20, 30, 40],
    trial(r, st) { let k = 1; while (r() < 0.5) k++; let prize = Math.pow(2, k); if (st.cap) prize = Math.min(prize, st.cap); return { vals: [prize], pic: { k, prize } }; },
    draw(g, p, st, W, H) {
      for (let i = 0; i < Math.min(p.k, 16); i++) K.coin(g, 26 + (i % 8) * 34, 60 + Math.floor(i / 8) * 40, 13, Object.assign({ label: i === p.k - 1 ? 'T' : 'H' }, i === p.k - 1 ? P2.silver : P2.gold));
      if (p.k > 16) P2.note(g, W / 2, 150, '… ' + p.k + ' tosses in all', { size: 11.5 });
      P2.note(g, W / 2, 190, 'Prize: $' + p.prize.toLocaleString('en-GB'), { size: 16, weight: 800, fill: COL.purple });
      P2.note(g, W / 2, 24, 'Heads doubles the prize; the first tail ends the game', { size: 11 });
    },
    controls(F, st, changed) { F.seg({ options: [[0, 'Unlimited bank'], [1048576, 'Bank of $1,048,576']], value: st.cap, onChange(v) { st.cap = v; changed(); } }); },
    keepState: (st) => ({ cap: st.cap })
  };

  // a goat and a car, small and simple
  function goat(g, x, y, s) {
    const q = S('g', { transform: tr(x, y, 0, s) }, g);
    S('ellipse', { cx: 0, cy: 0, rx: 16, ry: 10, fill: '#d9d4c8', stroke: '#6b665a', 'stroke-width': 1.5 }, q);
    S('path', { d: 'M12 -6l10 -8 6 4 -2 8 -8 2Z', fill: '#d9d4c8', stroke: '#6b665a', 'stroke-width': 1.5 }, q);
    S('path', { d: 'M20 -13q-4 -8 -10 -8M23 -12q2 -8 -2 -11', fill: 'none', stroke: '#6b665a', 'stroke-width': 1.5 }, q);
    S('path', { d: 'M-10 8v10M-4 9v10M6 9v10M12 8v10', stroke: '#6b665a', 'stroke-width': 2 }, q);
    S('path', { d: 'M24 -2l1 6', stroke: '#6b665a', 'stroke-width': 1.5 }, q);
    return q;
  }
  function car(g, x, y, s) {
    const q = S('g', { transform: tr(x, y, 0, s) }, g);
    S('path', { d: 'M-26 6v-8q2 -6 10 -6l6 -8h18l8 8q10 0 10 6v8Z', fill: '#d8543f', stroke: '#7a2a1a', 'stroke-width': 1.5 }, q);
    S('path', { d: 'M-8 -8l4 -6h12l6 6Z', fill: '#cfe3f3' }, q);
    [-14, 14].forEach((cx) => S('circle', { cx, cy: 7, r: 5.5, fill: '#333' }, q));
    return q;
  }

  /* Monty Hall: play the game, then let the computer play a thousand */
  C.figure('prob-monty', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 470, bar: 1 });
      const nD = P.doors || 3, host = P.host || 'knows';
      const big = nD <= 5;
      const doorsG = S('g', null, F.scene), msgG = S('g', null, F.scene), statG = S('g', null, F.scene);
      const say1 = T(msgG, F.w / 2, big ? 228 : 236, '', { anchor: 'middle', size: 14, weight: 800 });
      const say2 = T(msgG, F.w / 2, big ? 247 : 255, '', { anchor: 'middle', size: 12, fill: COL.ink2 });
      const rng = K.rng();
      let game, mine = { stick: [0, 0], swap: [0, 0] };
      // the rules of the show
      function hostOpens(carAt, pick, r) {
        const others = []; for (let i = 0; i < nD; i++) if (i !== pick) others.push(i);
        const nOpen = nD === 100 ? 98 : 1;
        if (host === 'knows') {
          const goats = others.filter((i) => i !== carAt);
          r.shuffle(goats);
          return goats.slice(0, nOpen);
        }
        r.shuffle(others);
        return others.slice(0, nOpen);
      }
      function simGame(r) {
        const carAt = r.int(nD), pick = r.int(nD), open = hostOpens(carAt, pick, r);
        if (open.includes(carAt)) return null;   // the host showed the car: this game is void
        const rest = []; for (let i = 0; i < nD; i++) if (i !== pick && !open.includes(i)) rest.push(i);
        const sw = rest[r.int(rest.length)];
        return [carAt === pick, carAt === sw];
      }
      const exact = host === 'random' ? [0.5, 0.5] : nD === 4 ? [0.25, 0.375] : [1 / nD, (nD - 1) / nD];
      const exactShow = host === 'random' ? ['1/2', '1/2'] : nD === 4 ? ['1/4', '3/8'] : ['1/' + nD, (nD - 1) + '/' + nD];
      // doors
      const doors = [];
      const layout = (i) => {
        if (big) { const w = Math.min(110, (F.w - 60) / nD - 16), gap = (F.w - 32 - nD * w) / (nD + 1); return { x: 16 + gap + i * (w + gap), y: 20, w, h: 160 }; }
        const c = i % 20, rw = Math.floor(i / 20); return { x: 20 + c * 29, y: 20 + rw * 38, w: 25, h: 32 };
      };
      for (let i = 0; i < nD; i++) {
        const L = layout(i), dg = S('g', { class: 'fk-hit' }, doorsG);
        const back = S('g', null, dg);
        const panel = S('rect', { x: L.x, y: L.y, width: L.w, height: L.h, rx: big ? 6 : 2, fill: '#8a5a26', stroke: '#5a3a18', 'stroke-width': big ? 2 : 1 }, dg);
        const num = T(dg, L.x + L.w / 2, L.y + (big ? L.h / 2 + 10 : L.h / 2 + 4), String(i + 1), { anchor: 'middle', size: big ? 28 : 10, weight: 800, fill: '#f4e2c0' });
        const ring = S('rect', { x: L.x - 4, y: L.y - 4, width: L.w + 8, height: L.h + 8, rx: big ? 9 : 4, fill: 'none', stroke: COL.gold, 'stroke-width': big ? 4 : 2.5, opacity: 0 }, dg);
        doors.push({ L, dg, back, panel, num, ring, open: false });
        K.onPress(dg, ctx, () => click(i));
      }
      function showDoor(i, open) {
        const d = doors[i];
        d.open = open;
        d.back.innerHTML = '';
        if (open) {
          S('rect', { x: d.L.x, y: d.L.y, width: d.L.w, height: d.L.h, rx: big ? 6 : 2, fill: '#fbf3e0', stroke: '#b9a27a', 'stroke-width': 1.5 }, d.back);
          const cx = d.L.x + d.L.w / 2, cy = d.L.y + d.L.h * 0.62;
          if (i === game.car) car(d.back, cx, cy, big ? 1.4 : 0.42); else goat(d.back, cx - (big ? 4 : 1), cy, big ? 1.25 : 0.38);
        }
        d.panel.style.display = open ? 'none' : '';
        d.num.style.display = open ? 'none' : '';
      }
      function newGame() {
        game = { car: rng.int(nD), pick: null, open: [], stage: 'pick' };
        for (let i = 0; i < nD; i++) { showDoor(i, false); doors[i].ring.setAttribute('opacity', 0); }
        K.say(say1, 'Pick a door');
        K.say(say2, 'Behind one door is a car; behind the others, goats.');
      }
      function click(i) {
        if (F.dead) return;
        if (game.stage === 'pick') {
          game.pick = i;
          doors[i].ring.setAttribute('opacity', 1);
          game.open = hostOpens(game.car, i, rng);
          game.stage = 'opening';
          K.say(say1, 'The host opens ' + (game.open.length > 1 ? game.open.length + ' doors…' : 'a door…'));
          K.say(say2, host === 'random' ? 'This host does not know where the car is.' : 'The host knows where the car is, and always shows goats.');
          F.after(700, () => {
            game.open.forEach((k) => showDoor(k, true));
            if (game.open.includes(game.car)) { game.stage = 'void'; K.say(say1, 'Oops — the host showed the car!'); K.say(say2, 'This game does not count. Click any door to play again.'); return; }
            game.stage = 'decide';
            K.say(say1, 'Stick with door ' + (i + 1) + ', or switch?');
            K.say(say2, 'Click your door to stick, or another closed door to switch.');
          });
        } else if (game.stage === 'decide') {
          if (doors[i].open) return;
          const swapped = i !== game.pick;
          doors[game.pick].ring.setAttribute('opacity', swapped ? 0.3 : 1);
          doors[i].ring.setAttribute('opacity', 1);
          for (let k = 0; k < nD; k++) showDoor(k, true);
          const win = i === game.car;
          const rec = swapped ? mine.swap : mine.stick;
          rec[0]++; if (win) rec[1]++;
          game.stage = 'done';
          K.say(say1, (win ? 'A car! ' : 'A goat. ') + (swapped ? 'You switched.' : 'You stuck.'));
          say1.setAttribute('fill', win ? COL.green : COL.red);
          K.say(say2, 'Click any door to play again.');
          writeMine();
        } else if (game.stage === 'done' || game.stage === 'void') { say1.setAttribute('fill', COL.ink); newGame(); }
      }
      // your record and the machine's
      const top = big ? 268 : 276;
      S('rect', { x: 14, y: top, width: 196, height: F.sh - top - 8, rx: 10, fill: '#fffdf8', stroke: COL.line }, statG);
      T(statG, 26, top + 22, 'Your games', { size: 13, weight: 800 });
      const m1 = T(statG, 26, top + 46, '', { size: 12.5, fill: COL.blue }), m2 = T(statG, 26, top + 68, '', { size: 12.5, fill: COL.red });
      function writeMine() {
        K.say(m1, 'Stuck: ' + mine.stick[0] + ' games, ' + mine.stick[1] + ' cars');
        K.say(m2, 'Switched: ' + mine.swap[0] + ' games, ' + mine.swap[1] + ' cars');
      }
      T(statG, 224, top + 16, 'The computer plays', { size: 13, weight: 800 });
      const c1 = T(statG, 224, top + 36, '', { size: 12, fill: COL.blue, weight: 700 }), c2 = T(statG, 224, top + 53, '', { size: 12, fill: COL.red, weight: 700 });
      const chart = K.conv(statG, { x: 256, y: top + 64, w: F.w - 256 - 20, h: F.sh - top - 100, series: [{ color: COL.blue }, { color: COL.red }], yticks: [0, 0.5, 1], yfmt: (v) => String(v), xlabel: 'games' });
      let sim = { n: 0, st: 0, sw: 0, voided: 0 }, pending = 0, budget = 0;
      function writeSim() {
        const n = sim.n;
        const ex = (k) => (F.solved ? '  (exact ' + exactShow[k] + ')' : '');
        K.say(c1, 'Sticking wins ' + sim.st + ' of ' + n + (n ? ' = ' + (sim.st / n).toFixed(3) : '') + ex(0));
        K.say(c2, 'Switching wins ' + sim.sw + ' of ' + n + (n ? ' = ' + (sim.sw / n).toFixed(3) : '') + ex(1) + (sim.voided ? ' · ' + sim.voided + ' void' : ''));
      }
      const L = F.loop((dt) => {
        budget += dt * 700;
        while (budget >= 1 && pending > 0) {
          budget -= 1; pending--;
          const r = simGame(rng);
          if (!r) { sim.voided++; continue; }
          sim.n++; if (r[0]) sim.st++; if (r[1]) sim.sw++;
          chart.push(0, sim.n, sim.st / sim.n); chart.push(1, sim.n, sim.sw / sim.n);
        }
        chart.flush(); writeSim();
        if (pending <= 0) { budget = 0; return false; }
        return true;
      });
      F.button('Play 1000 games', () => { pending += 1000; L.start(); }, { icon: 'fast', primary: true });
      F.button('', () => { L.stop(); pending = 0; sim = { n: 0, st: 0, sw: 0, voided: 0 }; chart.reset(); showT(); writeSim(); }, { icon: 'reset', title: 'Forget the computer’s games' });
      F.button('New game', () => { say1.setAttribute('fill', COL.ink); newGame(); }, { title: 'Start a fresh game for you' });
      const note = F.note(0);
      K.say(note, nD + ' doors · ' + (host === 'random' ? 'a host who does not know' : 'a host who knows'));
      function showT() { if (F.solved) chart.targets([{ v: exact[0], label: 'stick ' + exactShow[0], color: COL.blue, below: true }, { v: exact[1], label: 'switch ' + exactShow[1], color: COL.red }]); }
      F.whenSolved(() => { showT(); writeSim(); });
      newGame(); writeMine(); writeSim();
      return F.inst({
        solve() { if (sim.n < 1000) { pending += 1000; L.start(); } showT(); },
        getState: () => ({ mine, sim, pts: chart.state() }),
        setState(s) { if (s.mine) mine = s.mine; if (s.sim) { sim = s.sim; chart.load(s.pts); } showT(); writeMine(); writeSim(); }
      });
    }
  });

  /* Dice sums: roll, count and compare */
  C.figure('prob-dice', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 420, bar: 1 });
      const nd = P.dice || 2, lo = nd, hi = 6 * nd, hl = P.highlight || [];
      const rng = K.rng();
      // exact distribution by counting
      let dist = [1]; for (let d = 0; d < nd; d++) { const nx = new Array(dist.length + 6).fill(0); dist.forEach((c, s) => { for (let f = 1; f <= 6; f++) nx[s + f] += c; }); dist = nx; }
      const tot = Math.pow(6, nd), exact = []; for (let s = lo; s <= hi; s++) exact.push(dist[s] / tot);
      const dice = [];
      for (let i = 0; i < nd; i++) dice.push(K.die(F.scene, 60 + i * 76, 64, 60, { value: 1 + i }));
      const counts = new Array(hi - lo + 1).fill(0);
      let n = 0;
      const bars = K.bars(F.scene, { x: 30, y: 130, w: F.w - 60, h: F.sh - 170, labels: counts.map((c, i) => String(lo + i)), color: '#b9c3d6', max: Math.max(...exact) * 1.35, vsize: nd === 3 ? 8.5 : 10 });
      hl.forEach((s) => bars.color(s - lo, COL.blue));
      const info = T(F.scene, F.w - 20, 40, '', { anchor: 'end', size: 14, weight: 800 });
      const info2 = T(F.scene, F.w - 20, 60, '', { anchor: 'end', size: 12.5, fill: COL.blue, weight: 700 });
      const info3 = T(F.scene, F.w - 20, 80, '', { anchor: 'end', size: 11.5, fill: COL.ink2 });
      function write() {
        bars.set(counts.map((c) => (n ? c / n : 0)), (v) => (n ? (v * 100).toFixed(1) : ''));
        const top = counts.indexOf(Math.max(...counts));
        K.say(info, 'Rolls: ' + n.toLocaleString('en-GB') + (n ? ' · most common so far: ' + (lo + top) : ''));
        K.say(info2, hl.map((s) => s + ': ' + (n ? (counts[s - lo] / n * 100).toFixed(1) + ' %' : '–')).join('   '));
        K.say(info3, F.solved ? 'red marks: the exact chances (ways ÷ ' + tot + ')' : 'bars: how often each total has come up (%)');
        if (F.solved) bars.exact(exact);
      }
      function roll() { const v = []; let s = 0; for (let i = 0; i < nd; i++) { const f = 1 + rng.int(6); v.push(f); s += f; } counts[s - lo]++; n++; return v; }
      let pending = 0, budget = 0, rate = 1;
      const L = F.loop((dt) => {
        budget += dt * rate;
        let last = null;
        while (budget >= 1 && pending > 0) { budget -= 1; pending--; last = roll(); }
        if (last) last.forEach((f, i) => { dice[i].set(f); dice[i].move(60 + i * 76, 64, (rng() - 0.5) * 30); });
        write();
        if (pending <= 0) { budget = 0; return false; }
        return true;
      });
      const run = (k, r) => { pending += k; rate = r; if (k === 1) budget = 1; L.start(); };
      F.button('Roll', () => run(1, 4), { icon: 'dice', primary: true, w: 80 });
      F.button('×100', () => run(100, 100), { w: 60 });
      F.button('×1000', () => run(1000, 900), { w: 68, icon: 'fast' });
      F.button('', () => { L.stop(); pending = 0; counts.fill(0); n = 0; write(); }, { icon: 'reset', title: 'Forget the rolls' });
      F.whenSolved(write);
      write();
      return F.inst({ solve() { if (n < 1000) run(1000, 900); write(); }, getState: () => ({ counts, n }), setState(s) { if (s.counts && s.counts.length === counts.length) { s.counts.forEach((c, i) => { counts[i] = c; }); n = s.n; } write(); } });
    }
  });

  /* The Galton board: balls bounce left or right at every peg */
  C.figure('prob-galton', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 480, bar: 2 });
      let rows = P.rows || 10;
      const rng = K.rng();
      const pegsG = S('g', null, F.back), binsG = S('g', null, F.scene), ballG = S('g', null, F.scene);
      let counts, n, balls = [], geo;
      const info = T(F.scene, F.w - 18, 26, '', { anchor: 'end', size: 13.5, weight: 800 });
      const info2 = T(F.scene, F.w - 18, 45, '', { anchor: 'end', size: 12, fill: COL.blue, weight: 700 });
      function exactBin(k) { return choose(rows, k) / Math.pow(2, rows); }
      function build() {
        pegsG.innerHTML = '';
        const top = 30, dx = Math.min(34, (F.w - 80) / (rows + 1)), dy = Math.min(22, 200 / rows);
        geo = { top, dx, dy, cx: F.w / 2, binTop: top + rows * dy + 16, binBot: F.sh - 22 };
        for (let r = 0; r < rows; r++) for (let k = 0; k <= r; k++) S('circle', { cx: geo.cx + (k - r / 2) * dx, cy: top + r * dy + 10, r: 3, fill: '#6b6f78' }, pegsG);
        for (let k = 0; k <= rows + 1; k++) S('line', { x1: geo.cx + (k - (rows + 1) / 2) * dx, y1: geo.binTop, x2: geo.cx + (k - (rows + 1) / 2) * dx, y2: geo.binBot, stroke: '#9aa0aa', 'stroke-width': 1.5 }, pegsG);
        S('line', { x1: geo.cx - (rows + 1) / 2 * dx, y1: geo.binBot, x2: geo.cx + (rows + 1) / 2 * dx, y2: geo.binBot, stroke: '#6b6f78', 'stroke-width': 2 }, pegsG);
        counts = new Array(rows + 1).fill(0); n = 0; balls = [];
      }
      function binX(k) { return geo.cx + (k - rows / 2) * geo.dx; }
      function drawBins() {
        binsG.innerHTML = '';
        const mx = Math.max(1, ...counts), hgt = geo.binBot - geo.binTop - 6;
        const scale = Math.max(mx / n || 0, exactBin(Math.floor(rows / 2)) * 1.25);
        counts.forEach((c, k) => {
          const h = n ? c / n / scale * hgt : 0;
          S('rect', { x: binX(k) - geo.dx / 2 + 2, y: geo.binBot - h, width: geo.dx - 4, height: h, fill: k === rows / 2 ? COL.blue : '#9fb4d6', rx: 2 }, binsG);
          if (F.solved) { const e = exactBin(k) / scale * hgt; S('line', { x1: binX(k) - geo.dx / 2 + 1, y1: geo.binBot - e, x2: binX(k) + geo.dx / 2 - 1, y2: geo.binBot - e, stroke: COL.red, 'stroke-width': 2 }, binsG); }
        });
        const mid = rows % 2 === 0 ? rows / 2 : null;
        K.say(info, 'Balls: ' + n.toLocaleString('en-GB') + ' · ' + rows + ' rows of pegs');
        K.say(info2, mid != null ? 'middle bin: ' + counts[mid] + (n ? ' = ' + (counts[mid] / n).toFixed(3) : '') + (F.solved ? ' (exact ' + choose(rows, mid) + '/' + Math.pow(2, rows) + ' ≈ ' + exactBin(mid).toFixed(3) + ')' : '') : '');
      }
      function path() { const d = []; let k = 0; for (let r = 0; r < rows; r++) { const right = rng() < 0.5; d.push(right); if (right) k++; } return { d, k }; }
      const L = F.loop((dt) => {
        balls.forEach((b) => { b.t += dt * 1.6; });
        ballG.innerHTML = '';
        const still = [];
        balls.forEach((b) => {
          const pos = b.t * rows;   // rows passed
          if (pos >= rows + 1.5) { counts[b.k]++; n++; return; }
          still.push(b);
          const r = Math.min(rows, Math.floor(pos)), f = pos - Math.floor(pos);
          let kx = 0; for (let i = 0; i < r; i++) if (b.d[i]) kx++;
          let x, y;
          if (pos < rows) { const nx = kx + (b.d[r] ? 1 : 0); const x0 = geo.cx + (kx - r / 2) * geo.dx, x1 = geo.cx + (nx - (r + 1) / 2) * geo.dx; x = lerp(x0, x1, f); y = geo.top + r * geo.dy + f * geo.dy + 2 - Math.sin(f * Math.PI) * 6; }
          else { x = binX(b.k); y = lerp(geo.top + rows * geo.dy, geo.binBot - 8, Math.min(1, pos - rows)); }
          S('circle', { cx: x, cy: y, r: 4.5, fill: COL.red }, ballG);
        });
        balls = still;
        drawBins();
        if (feed > 0) { feedT += dt; while (feedT > 0.05 && feed > 0) { feedT -= 0.05; feed--; balls.push(Object.assign(path(), { t: 0 })); } }
        return balls.length > 0 || feed > 0;
      });
      let feed = 0, feedT = 0;
      F.button('Drop one', () => { balls.push(Object.assign(path(), { t: 0 })); L.start(); }, { primary: true, icon: 'play' });
      F.button('Drop 100', () => { feed += 100; L.start(); });
      F.button('×1000 at once', () => { for (let i = 0; i < 1000; i++) { counts[path().k]++; n++; } drawBins(); }, { icon: 'fast' });
      F.button('', () => { L.stop(); feed = 0; build(); drawBins(); ballG.innerHTML = ''; }, { icon: 'reset', title: 'Empty the bins' });
      F.newRow();
      const sl = F.slider({ label: 'Rows of pegs', min: 2, max: 14, step: 1, value: rows, w: 150, vw: 30, onInput(v) { rows = v; L.stop(); feed = 0; build(); drawBins(); ballG.innerHTML = ''; } });
      F.whenSolved(drawBins);
      build(); drawBins();
      return F.inst({
        solve() { for (let i = 0; i < 1000; i++) { counts[path().k]++; n++; } drawBins(); },
        getState: () => ({ rows, counts, n }),
        setState(s) { if (s.rows) { rows = s.rows; sl.set(rows, true); build(); } if (s.counts && s.counts.length === rows + 1) { counts = s.counts.slice(); n = s.n; } drawBins(); }
      });
    }
  });

  /* Efron's dice: A beats B, B beats C, C beats D, and D beats A */
  const EFRON = K.EFRON = { A: [4, 4, 4, 4, 0, 0], B: [3, 3, 3, 3, 3, 3], C: [6, 6, 2, 2, 2, 2], D: [5, 5, 5, 1, 1, 1] };
  K.beats = (x, y) => { let w = 0; EFRON[x].forEach((a) => EFRON[y].forEach((b) => { if (a > b) w++; })); return w / 36; };
  C.figure('prob-efron', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 470, bar: 2 });
      let fr = P.friend || 'A', me = P.mine || 'D';
      const rng = K.rng();
      const names = ['A', 'B', 'C', 'D'], cols = { A: COL.red, B: COL.blue, C: COL.green, D: COL.purple };
      // the four dice, unfolded as a row of faces
      names.forEach((nm, i) => {
        const y = 22 + i * 36;
        T(F.scene, 18, y + 21, 'Die ' + nm, { size: 13, weight: 800, fill: cols[nm] });
        EFRON[nm].forEach((v, k) => { const d = K.die(F.scene, 96 + k * 32, y + 14, 26, { faces: EFRON[nm].map(String), stroke: cols[nm], pip: cols[nm] }); d.set(k + 1); });
      });
      const dF = K.die(F.scene, 350, 70, 54, { faces: ['0', '1', '2', '3', '4', '5', '6'].slice(0, 7), stroke: COL.ink2 });
      const dM = K.die(F.scene, 520, 70, 54, { faces: ['0', '1', '2', '3', '4', '5', '6'], stroke: COL.ink2 });
      dF.text('?'); dM.text('?');
      const lF = T(F.scene, 350, 118, '', { anchor: 'middle', size: 12, weight: 700 }), lM = T(F.scene, 520, 118, '', { anchor: 'middle', size: 12, weight: 700 });
      const res = T(F.scene, 435, 150, '', { anchor: 'middle', size: 14, weight: 800 });
      let n = 0, wins = 0;
      const info = T(F.scene, 20, 190, '', { size: 13, weight: 800 });
      const chart = K.conv(F.scene, { x: 54, y: 210, w: 300, h: F.sh - 250, series: [{ color: COL.purple }], yticks: [0, 0.5, 1], yfmt: (v) => String(v), xlabel: 'rolls' });
      const mat = S('g', { transform: tr(392, 196) }, F.scene);
      function drawMat() {
        mat.innerHTML = '';
        T(mat, 0, 0, 'Row beats column, how often:', { size: 11.5, weight: 700 });
        names.forEach((a, i) => { T(mat, 30 + (i + 1) * 40, 22, a, { anchor: 'middle', size: 12, weight: 800, fill: cols[a] }); T(mat, 22, 44 + i * 26, a, { anchor: 'middle', size: 12, weight: 800, fill: cols[a] }); });
        names.forEach((a, i) => names.forEach((b, j) => {
          if (i === j) return;
          const p = K.beats(a, b), show = F.solved;
          S('rect', { x: 32 + j * 40 + 20, y: 30 + i * 26, width: 36, height: 22, rx: 4, fill: show ? (p > 0.5 ? 'rgba(79,127,58,.18)' : 'rgba(176,71,47,.12)') : '#f3ead6' }, mat);
          T(mat, 50 + j * 40 + 20, 45 + i * 26, show ? (p === 2 / 3 ? '2/3' : p === 1 / 3 ? '1/3' : p.toFixed(2)) : '?', { anchor: 'middle', size: 10.5, fill: COL.ink2 });
        }));
      }
      function write() {
        K.say(lF, 'friend: ' + fr); lF.setAttribute('fill', cols[fr]);
        K.say(lM, 'you: ' + me); lM.setAttribute('fill', cols[me]);
        K.say(info, 'Your ' + me + ' against ' + fr + ': won ' + wins + ' of ' + n + (n ? ' = ' + (wins / n).toFixed(3) : '') + (F.solved ? ' (exact ' + (K.beats(me, fr) === 2 / 3 ? '2/3' : K.beats(me, fr).toFixed(3)) + ')' : ''));
        if (F.solved) chart.targets([{ v: K.beats(me, fr), label: 'exact', color: COL.purple }]);
      }
      function roll() { const a = EFRON[fr][rng.int(6)], b = EFRON[me][rng.int(6)]; n++; if (b > a) wins++; chart.push(0, n, wins / n); return [a, b]; }
      let pending = 0, budget = 0, rate = 1;
      const L = F.loop((dt) => {
        budget += dt * rate; let last = null;
        while (budget >= 1 && pending > 0) { budget -= 1; pending--; last = roll(); }
        if (last) { dF.text(String(last[0])); dM.text(String(last[1])); K.say(res, last[1] > last[0] ? 'You win' : 'Friend wins'); res.setAttribute('fill', last[1] > last[0] ? COL.green : COL.red); }
        chart.flush(); write();
        if (pending <= 0) { budget = 0; return false; }
        return true;
      });
      const run = (k, r) => { pending += k; rate = r; if (k === 1) budget = 1; L.start(); };
      const clear = () => { L.stop(); pending = 0; n = 0; wins = 0; chart.reset(); dF.text('?'); dM.text('?'); K.say(res, ''); write(); };
      F.button('Roll both', () => run(1, 4), { icon: 'dice', primary: true });
      F.button('×1000', () => run(1000, 900), { icon: 'fast', w: 70 });
      F.button('', clear, { icon: 'reset', title: 'Forget the rolls' });
      F.newRow();
      T(F.ui, 18, F.sh + 4 + 38 + 20, 'Friend', { size: 12.5, fill: COL.ink2 });
      const sF = F.seg({ at: [70, F.sh + 4 + 38], options: names.map((x) => [x, x]), value: fr, onChange(v) { fr = v; clear(); } });
      T(F.ui, 250, F.sh + 4 + 38 + 20, 'You', { size: 12.5, fill: COL.ink2 });
      const sM = F.seg({ at: [284, F.sh + 4 + 38], options: names.map((x) => [x, x]), value: me, onChange(v) { me = v; clear(); } });
      F.whenSolved(() => { drawMat(); write(); });
      drawMat(); write();
      return F.inst({ solve() { if (n < 1000) run(1000, 900); drawMat(); write(); }, getState: () => ({ fr, me }), setState(s) { fr = s.fr || fr; me = s.me || me; sF.set(fr, true); sM.set(me, true); clear(); } });
    }
  });

  /* Simpson's paradox: two hospitals, patients in good and in poor condition */
  C.figure('prob-simpson', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 440, bar: 1 });
      // [survived, treated] for (hospital, condition)
      const D = { A: { good: [95, 100], poor: [300, 400] }, B: { good: [360, 400], poor: [70, 100] } };
      const hs = ['A', 'B'], hx = { A: 30, B: 330 }, per = 25, cell = 10.4;
      let split = true, u = 1;
      const dotsG = S('g', null, F.scene), labG = S('g', null, F.scene);
      const dots = { A: [], B: [] };
      hs.forEach((h) => {
        const list = [];
        ['good', 'poor'].forEach((c) => { const [s, t] = D[h][c]; for (let i = 0; i < t; i++) list.push({ c, alive: i < s }); });
        list.forEach((p, i) => { p.i = i; p.el = S('circle', { r: 3.9, fill: p.alive ? (p.c === 'good' ? '#4f9a6a' : '#3a7aa5') : '#c9c1ad' }, dotsG); });
        dots[h] = list;
      });
      function place() {
        hs.forEach((h) => {
          const ng = D[h].good[1];
          dots[h].forEach((p, i) => {
            const gap = p.c === 'poor' ? u * 34 : 0;
            const idx = i, row = Math.floor(idx / per), col = idx % per;
            set(p.el, { cx: hx[h] + col * cell + 5, cy: 64 + row * cell + gap });
          });
          void ng;
        });
        labG.innerHTML = '';
        const pc = (a) => Math.round(a[0] / a[1] * 100) + ' %';
        hs.forEach((h) => {
          const x = hx[h];
          T(labG, x, 30, 'Hospital ' + h, { size: 15, weight: 800 });
          const all = [D[h].good[0] + D[h].poor[0], D[h].good[1] + D[h].poor[1]];
          T(labG, x, 50, 'All patients: ' + all[0] + ' of ' + all[1] + ' survive = ' + pc(all), { size: 12, weight: 700, fill: !split ? COL.ink : COL.muted });
          if (split) {
            const yg = 64 + Math.ceil(D[h].good[1] / per) * cell + 6;
            T(labG, x, yg + 12, 'good condition: ' + D[h].good[0] + '/' + D[h].good[1] + ' = ' + pc(D[h].good), { size: 11.5, weight: 700, fill: '#2f7a4a' });
            const yp = 64 + Math.ceil(D[h].A === 0 ? 0 : 500 / per) * cell + 34 + 14;
            T(labG, x, yp, 'poor condition: ' + D[h].poor[0] + '/' + D[h].poor[1] + ' = ' + pc(D[h].poor), { size: 11.5, weight: 700, fill: '#2a5f86' });
          }
        });
        T(labG, F.w / 2, F.sh - 10, 'coloured dots survived · grey dots did not', { anchor: 'middle', size: 11, fill: COL.muted });
      }
      const seg = F.seg({ options: [[true, 'By condition'], [false, 'All together']], value: split, onChange(v) { split = v; const from = u, to = v ? 1 : 0; F.tween(600, (t) => { u = lerp(from, to, t); place(); }); } });
      const note = F.note(0);
      K.say(note, '500 patients at each hospital');
      place();
      return F.inst({ solve() { split = true; seg.set(true, true); u = 1; place(); }, getState: () => ({ split }), setState(s) { split = s.split !== false; seg.set(split, true); u = split ? 1 : 0; place(); } });
    }
  });

  /* =====================================================================
   * TABLE TRICKS: the setting first; the way it is done once you have answered
   * ===================================================================== */

  /* A scene: { h, ms, before: 'caption before', steps: [[t, 'caption'], …], draw(g, t, W, H), three(v3), note } */
  const TRICK = K.TRICK = {};
  const sg = (t, a, b) => ease(clamp((t - a) / (b - a), 0, 1));   // eased progress of the stretch a..b of t
  K.sg = sg;

  C.figure('trick', {
    draw(g, P, ctx) {
      const sc = TRICK[P.scene];
      if (!sc) throw new Error('trick: unknown scene ' + P.scene);
      const F = K.frame(g, ctx, { w: 620, h: P.h || sc.h || 340, bar: 1 });
      const W = F.w, H = F.sh;
      const stage = S('g', null, F.scene);
      const cap = T(F.scene, W / 2, 26, '', { anchor: 'middle', size: 14, weight: 800 });
      let t = 0, running = false, stop = null;
      const shownAtStart = F.solved;
      function caption() {
        if (t <= 0 && !F.solved) return sc.before || '';
        let s = sc.before || '';
        (sc.steps || []).forEach((q) => { if (t >= q[0]) s = q[1]; });
        return s;
      }
      function draw() { stage.innerHTML = ''; sc.draw(stage, t, W, H, F); K.say(cap, caption()); }
      function play() {
        if (!F.solved) return;
        if (stop) stop.stop();
        running = true; t = 0; draw();
        stop = F.tween(sc.ms || 6000, (u) => { t = u; draw(); }, () => { running = false; t = 1; draw(); }, true);
      }
      const pb = F.button('Show me how', play, { icon: 'play', primary: true, w: 150 });
      let b3 = null;
      const note = F.note(0);
      function sync() {
        pb.disable(!F.solved);
        pb.label(F.solved ? (t >= 1 ? 'Again' : 'Show me how') : 'Show me how');
        if (b3) b3.hide(!F.solved);
        K.say(note, F.solved ? (sc.note || '') : 'Answer first — then the card shows how it is done');
      }
      if (sc.three) {
        let v3 = null;
        b3 = F.button('Turn it in 3D', () => { if (!v3) build3(); ctx.wb.set3D(!ctx.wb.is3D); }, { icon: 'cube', w: 140 });
        const build3 = () => {
          v3 = ctx.wb.use3D({});
          v3.clear();
          v3.bg = '#f4efe1';
          sc.three(v3);
          v3.fit(1.05); v3.cam.pitch = 38; v3.cam.yaw = -30;
          v3.render();
        };
        ctx.wb.on('view3d', (on) => { if (on && !F.dead) { if (!v3) build3(); v3.resize(); v3.fit(1.05); v3.render(); } });
        F.whenSolved(() => { ctx.wb.allow3D(true); });
      }
      const prev = F.onSync;
      F.onSync = () => { if (prev) prev(); sync(); };
      F.whenSolved(() => { sync(); if (!shownAtStart) play(); else { t = 1; draw(); } });
      if (shownAtStart) t = 1;
      sync(); draw();
      return F.inst({ solve() { F.markSolved(); play(); }, getState: () => null, setState() {} });
    }
  });

  // side views of everyday things
  const TK = K.tk = {};
  TK.table = (g, W, y) => K.table(g, 16, W - 16, y);
  TK.glass = (g, x, yb, w, h, o) => { o = o || {}; const gg = S('g', { transform: tr(x, yb, o.rot || 0) }, g); const t = w * 0.08; if (o.water) S('path', { d: 'M' + fx(-w / 2 + t * (1 - o.water) + 2) + ' ' + fx(-h * o.water) + 'L' + fx(-w / 2 + t + 2) + ' -2H' + fx(w / 2 - t - 2) + 'L' + fx(w / 2 - t * (1 - o.water) - 2) + ' ' + fx(-h * o.water) + 'Z', fill: 'rgba(150,196,232,.75)' }, gg); S('path', { d: 'M' + fx(-w / 2) + ' ' + fx(-h) + 'L' + fx(-w / 2 + t) + ' 0H' + fx(w / 2 - t) + 'L' + fx(w / 2) + ' ' + fx(-h), fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, gg); S('line', { x1: -w / 2 + t + 2, y1: -2, x2: w / 2 - t - 2, y2: -2, stroke: COL.glassLine, 'stroke-width': 3, opacity: 0.5 }, gg); S('line', { x1: -w * 0.3, y1: -h * 0.85, x2: -w * 0.27, y2: -h * 0.2, stroke: '#fff', 'stroke-width': 2.5, opacity: 0.6, 'stroke-linecap': 'round' }, gg); return gg; };
  TK.coinSide = (g, x, y, w, o) => S('rect', { x: x - w / 2, y: y - 3, width: w, height: 5, rx: 2, fill: (o && o.fill) || '#e0b650', stroke: '#9c7414', 'stroke-width': 1.2 }, g);
  TK.bottle = (g, x, yb, s, o) => { o = o || {}; const gg = S('g', { transform: tr(x, yb, o.rot || 0, s || 1) }, g); S('path', { d: 'M-30 0V-110Q-30 -140 -10 -150V-190H10V-150Q30 -140 30 -110V0Z', fill: o.fill || 'rgba(90,150,110,.35)', stroke: o.stroke || '#3f7a55', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, gg); S('line', { x1: -20, y1: -120, x2: -20, y2: -20, stroke: '#fff', 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' }, gg); return gg; };
  TK.finger = (g, x, y, rot) => { const gg = S('g', { transform: tr(x, y, rot || 0) }, g); S('path', { d: 'M-11 0V-60H11V0Q11 12 0 12Q-11 12 -11 0Z', fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, gg); S('path', { d: 'M-6 -2q6 6 12 0v-10h-12Z', fill: '#f8e2cf', stroke: COL.skinDark, 'stroke-width': 1 }, gg); return gg; };
  TK.label = (g, x, y, s, o) => T(g, x, y, s, Object.assign({ anchor: 'middle', size: 12, fill: COL.ink2 }, o || {}));
  TK.arrow = (g, x1, y1, x2, y2, c, w) => K.arrowAt(g, x1, y1, x2, y2, c || COL.red, w || 2.5);

  /* The coin under the glass, got out without touching anything */
  TRICK['coin-glass'] = {
    h: 330, ms: 6000,
    before: 'A glass stands upside down on two coins, with a small coin trapped under it',
    steps: [[0, 'Scratch the tablecloth just in front of the glass…'], [0.3, '…with a fingernail, again and again'], [0.8, 'The cloth’s springy weave nudges the coin towards you']],
    draw(g, t, W, H) {
      const y = H - 70;
      S('rect', { x: 16, y, width: W - 32, height: 30, rx: 4, fill: '#c9d9ee', stroke: '#8fa9c9' }, g);
      for (let x = 22; x < W - 20; x += 8) S('line', { x1: x, y1: y + 2, x2: x, y2: y + 28, stroke: '#aac2e0', 'stroke-width': 1 }, g);
      TK.coinSide(g, W / 2 - 60, y, 30, { fill: '#c9ced8' }); TK.coinSide(g, W / 2 + 60, y, 30, { fill: '#c9ced8' });
      const cx = W / 2 + sg(t, 0.25, 1) * 150;
      TK.coinSide(g, cx, y + 1, 24);
      TK.glass(g, W / 2, y - 3, 170, 140, { rot: 180 }).setAttribute('transform', tr(W / 2, y - 144, 180));
      const scr = Math.sin(t * 60) * 12 * (t > 0.05 && t < 0.95 ? 1 : 0);
      TK.finger(g, W / 2 + 175 + scr, y - 4, -20);
      if (t > 0.1) TK.label(g, W / 2 + 190, y + 50, 'scratch, scratch', { fill: COL.red, weight: 700 });
    }
  };

  /* The card, the coin and the glass: a flick */
  TRICK['card-flick'] = {
    h: 320, ms: 4000,
    before: 'A playing card lies on a glass, with a coin on top of the card',
    steps: [[0, 'Flick the card sharply sideways…'], [0.25, 'The card shoots away — too fast to drag the coin with it'], [0.55, 'The coin, left behind, drops straight into the glass']],
    draw(g, t, W, H) {
      const y = H - 20;
      TK.table(g, W, y);
      TK.glass(g, W / 2, y, 90, 130);
      const fly = sg(t, 0.18, 0.4);
      S('rect', { x: W / 2 - 60 + fly * 400, y: y - 134 - fly * 30, width: 120, height: 4, rx: 1, fill: '#fff', stroke: COL.ink2, 'stroke-width': 1.3, transform: 'rotate(' + fx(fly * 30) + ' ' + fx(W / 2 + fly * 400) + ' ' + fx(y - 132) + ')' }, g);
      const drop = sg(t, 0.35, 0.65);
      TK.coinSide(g, W / 2, y - 138 + drop * 132, 34);
      const fx0 = W / 2 - 110 + (t < 0.2 ? Math.min(1, t / 0.18) * 48 : 48);
      TK.finger(g, fx0, y - 130, -90);
    }
  };

  /* The glass of water turned upside down under a card */
  TRICK['glass-card'] = {
    h: 360, ms: 5000,
    before: 'A glass filled to the brim, a postcard laid on top',
    steps: [[0, 'Hold the card on and turn the glass over…'], [0.4, '…then take your hand away'], [0.6, 'The air below pushes up on the card far harder than the water pushes down']],
    draw(g, t, W, H) {
      const turn = sg(t, 0, 0.35) * 180, cx = W / 2, cy = H / 2 + 10;
      const gg = S('g', { transform: 'rotate(' + fx(turn) + ' ' + cx + ' ' + cy + ')' }, g);
      TK.glass(gg, cx, cy + 70, 110, 140, { water: 1 });
      S('rect', { x: cx - 68, y: cy - 74, width: 136, height: 4, rx: 1, fill: '#fff', stroke: COL.ink2, 'stroke-width': 1.3 }, gg);
      if (t < 0.45) K.hand(g, cx - 110 + (turn > 90 ? 0 : 0), cy - 70 + turn * 0.78, 0.8, 0);
      if (t > 0.55) for (let k = -2; k <= 2; k++) TK.arrow(g, cx + k * 25, cy + 150, cx + k * 25, cy + 90, COL.blue, 3);
      if (t > 0.55) TK.label(g, cx, cy + 172, 'air pressure: about 1 kg on every square centimetre', { fill: COL.blue, weight: 700 });
    }
  };

  /* Coins into a brim-full glass */
  TRICK['brim-coins'] = {
    h: 340, ms: 7000,
    before: 'A glass filled right to the brim with water',
    steps: [[0, 'Slide coins in, gently, edge first, one at a time…'], [0.5, 'The water bulges up above the rim'], [0.85, 'Surface tension holds the dome — until one coin too many']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2, w = 140, h = 170;
      TK.table(g, W, y);
      const n = Math.floor(sg(t, 0.05, 0.95) * 40), dome = Math.min(14, n * 0.36);
      S('path', { d: 'M' + (x - w / 2 + 3) + ' ' + (y - h) + 'Q' + x + ' ' + fx(y - h - dome * 2) + ' ' + (x + w / 2 - 3) + ' ' + (y - h) + 'L' + (x + w / 2 - w * 0.08) + ' ' + (y - 2) + 'H' + (x - w / 2 + w * 0.08) + 'Z', fill: 'rgba(150,196,232,.75)' }, g);
      TK.glass(g, x, y, w, h);
      for (let i = 0; i < n; i++) TK.coinSide(g, x - 30 + (i * 17) % 60, y - 6 - Math.floor(i / 4) * 6, 22);
      TK.label(g, x + 110, y - h + 10, n + ' coins', { size: 15, weight: 800, fill: COL.ink });
      if (t > 0.5) TK.label(g, x, y - h - 30, 'a dome of water above the rim', { fill: COL.blue, weight: 700 });
    }
  };

  /* A cork inside an empty bottle, and a handkerchief */
  TRICK['cork-bottle'] = {
    h: 360, ms: 7000,
    before: 'A cork has been pushed down into an empty bottle',
    steps: [[0, 'Feed a large handkerchief into the bottle…'], [0.35, 'Tip the bottle till the cork rolls into the cloth'], [0.6, 'Pull the handkerchief slowly: it wraps the cork and drags it out']],
    draw(g, t, W, H) {
      const tip = sg(t, 0.3, 0.45) * 60 - sg(t, 0.55, 0.62) * 0;
      const gg = S('g', { transform: 'rotate(' + fx(-tip) + ' ' + W / 2 + ' ' + (H - 40) + ')' }, g);
      TK.bottle(gg, W / 2, H - 40, 1.25);
      const out = sg(t, 0.6, 0.95);
      const hk = sg(t, 0.02, 0.3);
      if (hk > 0) S('path', { d: 'M' + (W / 2) + ' ' + fx(H - 40 - 240) + 'q-10 ' + fx(80 * hk) + ' -20 ' + fx(180 * hk) + 'q10 20 40 10', fill: 'none', stroke: '#d8543f', 'stroke-width': 10 * (1 - out) + 4, 'stroke-linecap': 'round', opacity: 0.85 }, gg);
      const cy = lerp(H - 60, H - 40 - 250, out), cx = W / 2 + lerp(12 * (t > 0.4 ? -1 : 0), 0, out);
      S('rect', { x: cx - 13, y: cy - 22, width: 26, height: 40, rx: 5, fill: '#c9a46a', stroke: COL.woodDark, 'stroke-width': 1.5, transform: 'rotate(' + fx(t < 0.4 ? 80 : lerp(80, 0, out)) + ' ' + cx + ' ' + cy + ')' }, gg);
      if (out > 0.2) S('path', { d: 'M' + cx + ' ' + fx(cy - 30) + 'q-30 -30 -10 -80', fill: 'none', stroke: '#d8543f', 'stroke-width': 8, 'stroke-linecap': 'round' }, gg);
    }
  };

  /* The cork that will not float in the middle */
  TRICK['cork-middle'] = {
    h: 320, ms: 6000,
    before: 'A cork floats in a glass of water — and always drifts to the side',
    steps: [[0, 'In a part-filled glass the water curves up at the edge, and the cork slides up it'], [0.4, 'Top the glass up until the water bulges above the rim…'], [0.7, '…now the surface is highest in the middle, and the cork drifts there']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2, w = 180, h = 170;
      TK.table(g, W, y);
      const fill = lerp(0.72, 1.0, sg(t, 0.35, 0.6)), full = fill >= 0.999, lv = y - h * fill;
      const edge = full ? 0 : -9, mid = full ? -12 * sg(t, 0.55, 0.65) : 0;
      S('path', { d: 'M' + fx(x - w / 2 + 6) + ' ' + fx(lv + edge) + 'Q' + x + ' ' + fx(lv + mid - (full ? 10 : -12)) + ' ' + fx(x + w / 2 - 6) + ' ' + fx(lv + edge) + 'L' + fx(x + w / 2 - 14) + ' ' + (y - 2) + 'H' + fx(x - w / 2 + 14) + 'Z', fill: 'rgba(150,196,232,.75)' }, g);
      TK.glass(g, x, y, w, h);
      const cxp = lerp(x - w / 2 + 26, x, sg(t, 0.65, 0.95));
      S('ellipse', { cx: cxp, cy: lv + (full ? -12 : -4) + (cxp - x) * (full ? 0.08 : -0.08), rx: 16, ry: 9, fill: '#c9a46a', stroke: COL.woodDark, 'stroke-width': 1.5 }, g);
      if (t > 0.4 && t < 0.62) S('path', { d: 'M' + (x + 30) + ' ' + (y - h - 60) + 'q10 20 0 40', fill: 'none', stroke: COL.waterLine, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    }
  };

  /* A paper clip that floats */
  TRICK.paperclip = {
    h: 300, ms: 6000,
    before: 'A bowl of water and a steel paper clip',
    steps: [[0, 'Lay a small square of tissue paper on the water…'], [0.25, '…and set the clip gently on the tissue'], [0.5, 'The tissue soaks and sinks away'], [0.75, 'The clip stays, resting on the stretched skin of the water']],
    draw(g, t, W, H) {
      const y = H - 110, x = W / 2;
      S('path', { d: 'M' + (x - 200) + ' ' + y + 'Q' + (x - 190) + ' ' + (H - 10) + ' ' + x + ' ' + (H - 10) + 'Q' + (x + 190) + ' ' + (H - 10) + ' ' + (x + 200) + ' ' + y + 'Z', fill: 'rgba(150,196,232,.7)', stroke: COL.silverDark, 'stroke-width': 2 }, g);
      const tissue = sg(t, 0.45, 0.75);
      if (t > 0.05) S('rect', { x: x - 40, y: y - 2 + tissue * 70, width: 80, height: 3, fill: '#fff', stroke: '#ccc', opacity: 1 - tissue * 0.7 }, g);
      const clipIn = sg(t, 0.2, 0.3);
      const cy = lerp(y - 60, y - 5, clipIn);
      S('path', { d: 'M' + (x - 26) + ' ' + cy + 'h48a4 3 0 0 0 0 -6h-44a4 3 0 0 0 0 6', fill: 'none', stroke: '#6b6f78', 'stroke-width': 2.2 }, g);
      if (t > 0.75) { S('path', { d: 'M' + (x - 60) + ' ' + y + 'Q' + (x - 30) + ' ' + y + ' ' + (x - 26) + ' ' + (y + 3) + 'M' + (x + 26) + ' ' + (y + 3) + 'Q' + (x + 30) + ' ' + y + ' ' + (x + 60) + ' ' + y, fill: 'none', stroke: COL.waterLine, 'stroke-width': 2 }, g); TK.label(g, x, y + 40, 'the surface dips under the clip like a trampoline', { fill: COL.blue, weight: 700 }); }
    }
  };

  /* Two forks and a toothpick balanced on the rim of a glass */
  TRICK.forks = {
    h: 360, ms: 6000,
    before: 'Two forks, a toothpick and a glass',
    steps: [[0, 'Push the prongs of the two forks together so they lock, handles out like a V'], [0.3, 'Wedge a toothpick between the middle prongs'], [0.55, 'Rest the toothpick’s tip on the rim — and let go'], [0.8, 'The weight of the handles hangs below the rim: it is stable']],
    draw(g, t, W, H) {
      const y = H - 20, gx = W / 2 - 60;
      TK.table(g, W, y);
      TK.glass(g, gx, y, 110, 170);
      const rim = [gx + 55, y - 170];
      const place = sg(t, 0.5, 0.7), wob = t > 0.7 ? Math.sin((t - 0.7) * 30) * 6 * (1 - t) : 0;
      const px = lerp(rim[0] + 90, rim[0], place), py = lerp(rim[1] - 60, rim[1], place);
      // the forks, seen from the side: prongs locked at J, the two handles curving back down beside the glass
      const J = [30, 2], ends = [[-8, 150], [8, 138]];
      const w = [0.5, 0.5];   // each fork: half its weight at the prongs, half along the handle towards its end
      let cmx = 0, cmy = 0;
      ends.forEach((e) => { cmx += 0.5 * J[0] + 0.5 * (J[0] + e[0]) / 2 * 2 * 0.5 + 0.25 * e[0]; cmy += 0.5 * J[1] + 0.25 * (J[1] + e[1]) + 0.25 * e[1]; });
      cmx /= 2.5; cmy /= 2.5;   // (weights: prongs ½, handle ¼ spread along it, ¼ at its heavy end)
      void w;
      const settle = -Math.atan2(cmx, cmy) * 180 / Math.PI;   // turn until the centre of mass is straight below the tip
      const gg = S('g', { transform: tr(px, py, lerp(-25, settle, place) + wob) }, g);
      S('line', { x1: 0, y1: 0, x2: J[0], y2: J[1], stroke: '#e8d2a0', 'stroke-width': 3 }, gg);
      ends.forEach((e, i) => {
        S('path', { d: 'M' + J[0] + ' ' + J[1] + 'Q' + fx(J[0] + 20) + ' ' + fx(e[1] * 0.45) + ' ' + e[0] + ' ' + e[1], fill: 'none', stroke: i ? '#b9bfcc' : '#9aa0aa', 'stroke-width': 7, 'stroke-linecap': 'round' }, gg);
      });
      S('path', { d: 'M' + (J[0] - 10) + ' ' + (J[1] - 9) + 'h20v16h-20Z', fill: '#b9bfcc', stroke: '#7d8494' }, gg);
      if (t > 0.8) {
        S('circle', { cx: cmx, cy: cmy, r: 7, fill: COL.red }, gg);
        S('line', { x1: 0, y1: 0, x2: cmx, y2: cmy, stroke: COL.red, 'stroke-dasharray': '4 3', 'stroke-width': 1.5 }, gg);
        TK.label(g, px + 60, py + 100, 'centre of mass', { fill: COL.red, weight: 700, anchor: 'start' });
      }
    },
    note: 'The red dot hangs below the point of support'
  };

  /* An egg standing on its end */
  TRICK.egg = {
    h: 320, ms: 5000,
    before: 'An egg, a table, a pinch of salt',
    steps: [[0, 'Pour a little heap of salt on the table'], [0.3, 'Stand the egg in the salt, pointed end up'], [0.6, 'Blow the loose salt gently away'], [0.8, 'A few grains, hidden under the egg, keep it standing']],
    draw(g, t, W, H) {
      const y = H - 30, x = W / 2;
      TK.table(g, W, y);
      const heap = 1 - sg(t, 0.55, 0.8);
      if (t > 0.02) S('path', { d: 'M' + fx(x - 50 * (0.3 + heap * 0.7)) + ' ' + y + 'Q' + x + ' ' + fx(y - 26 * heap - 3) + ' ' + fx(x + 50 * (0.3 + heap * 0.7)) + ' ' + y + 'Z', fill: '#f4f4f4', stroke: '#bbb' }, g);
      const eg = sg(t, 0.25, 0.4);
      S('ellipse', { cx: x, cy: lerp(y - 160, y - 48, eg), rx: 34, ry: 46, fill: '#f6ead2', stroke: '#b9a27a', 'stroke-width': 2 }, g);
      if (t > 0.55 && t < 0.8) for (let i = 0; i < 6; i++) S('circle', { cx: x + 60 + i * 12 + (t - 0.55) * 200, cy: y - 6 - (i % 3) * 5, r: 1.6, fill: '#aaa' }, g);
      if (t > 0.55 && t < 0.8) S('path', { d: 'M' + (x - 150) + ' ' + (y - 12) + 'h60', stroke: COL.blue, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, g);
    }
  };

  /* Emptying a full glass without lifting or tipping it: a siphon */
  TRICK.siphon = {
    h: 360, ms: 7000,
    before: 'A full glass on a stack of books; an empty one on the table',
    steps: [[0, 'Fill a bendy straw (or a tube) with water, a finger over each end…'], [0.3, 'Put one end in the full glass, the other in the lower one'], [0.45, 'Let go: the water flows up and over by itself'], [0.85, 'It runs until the upper glass is empty — no tipping']],
    draw(g, t, W, H) {
      const y = H - 20, x1 = W / 2 - 110, x2 = W / 2 + 120, top = y - 100;
      TK.table(g, W, y);
      [0, 1, 2].forEach((k) => S('rect', { x: x1 - 70, y: y - 34 * (k + 1), width: 140, height: 32, rx: 3, fill: ['#3a6ea5', '#b0472f', '#4f7f3a'][k], stroke: 'rgba(0,0,0,.3)' }, g));
      const flow = sg(t, 0.45, 0.95), up = 1 - flow, dn = flow;
      TK.glass(g, x1, top, 90, 130, { water: Math.max(0.03, up * 0.95) });
      TK.glass(g, x2, y, 90, 130, { water: Math.max(0.0, dn * 0.95) });
      const tube = 'M' + (x1 + 10) + ' ' + (top - 12) + 'V' + (top - 118) + 'Q' + ((x1 + x2) / 2) + ' ' + (top - 158) + ' ' + (x2 - 10) + ' ' + (top - 118) + 'V' + (y - 20);
      if (t > 0.25) S('path', { d: tube, fill: 'none', stroke: COL.glassLine, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
      if (t > 0.25) S('path', { d: tube, fill: 'none', stroke: t > 0.45 && t < 0.9 ? 'rgba(90,150,210,.9)' : 'rgba(150,196,232,.8)', 'stroke-width': 5, 'stroke-dasharray': t > 0.45 && t < 0.9 ? '8 6' : null, 'stroke-dashoffset': fx(-t * 400) }, g);
    }
  };

  /* Lifting an ice cube with a thread and salt */
  TRICK['ice-thread'] = {
    h: 330, ms: 7000,
    before: 'An ice cube floats in a glass of water; you have a thread and some salt',
    steps: [[0, 'Lay the thread across the top of the ice cube'], [0.2, 'Sprinkle a pinch of salt over it'], [0.35, 'The salt melts the ice a little — melting takes heat, so the wet ice gets colder'], [0.65, 'The meltwater, diluted, freezes again around the thread'], [0.85, 'Lift: the ice cube comes up on the thread']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2, lift = sg(t, 0.85, 1) * 60;
      TK.table(g, W, y);
      TK.glass(g, x, y, 170, 170, { water: 0.6 });
      const iy = y - 102 - lift;
      S('rect', { x: x - 30, y: iy - 34, width: 60, height: 50, rx: 7, fill: 'rgba(236,247,255,.92)', stroke: '#8fb8d8', 'stroke-width': 1.6 }, g);
      if (t > 0.05) S('path', { d: 'M' + (x - 120) + ' ' + fx(iy - 36 - lift * 0.2) + 'Q' + (x - 40) + ' ' + fx(iy - 36) + ' ' + x + ' ' + fx(iy - 35) + 'Q' + (x + 40) + ' ' + fx(iy - 36) + ' ' + (x + 120) + ' ' + fx(iy - 36 - lift * 1.2), fill: 'none', stroke: '#b0472f', 'stroke-width': 2 }, g);
      if (t > 0.2) for (let i = 0; i < 16; i++) S('rect', { x: x - 26 + (i * 13) % 52, y: iy - 38 + ((i * 7) % 5) * 0.6, width: 2.4, height: 2.4, fill: '#fff', stroke: '#999', 'stroke-width': 0.5 }, g);
      if (t > 0.65 && t < 0.85) TK.label(g, x, iy - 70, 'wait a minute or two', { fill: COL.blue, weight: 700 });
    }
  };

  /* The matchbox that lands on its end */
  TRICK.matchbox = {
    h: 340, ms: 6000,
    before: 'Drop a matchbox on its end onto the table: it bounces and falls over',
    steps: [[0, 'Push the tray out about a third of the way'], [0.25, 'Drop it, tray end up, from a hand’s height'], [0.55, 'On landing the tray slams shut — soaking up the bounce'], [0.8, 'The box stays standing']],
    draw(g, t, W, H) {
      const y = H - 24;
      TK.table(g, W, y);
      const box = (x, yy, rot, tray) => {
        const gg = S('g', { transform: tr(x, yy, rot) }, g);
        S('rect', { x: -14, y: -tray - 70, width: 28, height: 20 + tray, fill: '#f2e6c8', stroke: '#8a6a3a', 'stroke-width': 1.2 }, gg);
        S('rect', { x: -16, y: -60, width: 32, height: 60, rx: 2, fill: '#d8543f', stroke: '#7a2a1a', 'stroke-width': 1.5 }, gg);
        S('rect', { x: -12, y: -48, width: 24, height: 30, fill: '#f4d27a' }, gg);
        return gg;
      };
      // plain box: bounces and topples
      const f1 = sg(t, 0.25, 0.45), b1 = sg(t, 0.45, 0.8);
      box(W * 0.28, y - 120 * (1 - f1) - Math.sin(b1 * Math.PI) * 30, b1 * 90, 0);
      TK.label(g, W * 0.28, y - 200, 'tray closed', { size: 11.5, weight: 700 });
      // tray out: lands and stays
      const f2 = sg(t, 0.25, 0.45), shut = sg(t, 0.45, 0.55);
      box(W * 0.68, y - 120 * (1 - f2), 0, 22 * (1 - shut) * (t > 0.02 ? 1 : 0));
      TK.label(g, W * 0.68, y - 200, 'tray a third out', { size: 11.5, weight: 700 });
    }
  };

  /* Whipping away the tablecloth */
  TRICK.tablecloth = {
    h: 320, ms: 4500,
    before: 'A table laid with plates and a vase, on a cloth without a hem',
    steps: [[0, 'Grip the edge of the cloth, and pull — fast and level, slightly downwards'], [0.35, 'The cloth is gone before friction can get the plates moving'], [0.7, 'They hardly move: the pull was too short to give them speed']],
    draw(g, t, W, H) {
      const y = H - 110, pull = sg(t, 0.2, 0.35);
      S('rect', { x: 110, y, width: 400, height: 12, fill: COL.wood, stroke: COL.woodDark }, g);
      [130, 480].forEach((x) => S('rect', { x, y: y + 12, width: 12, height: 90, fill: COL.woodDark }, g));
      S('path', { d: 'M' + fx(100 - pull * 480) + ' ' + (y - 2) + 'H' + fx(520 - pull * 480) + 'v' + fx(40 * (1 - pull)) + 'h-8V' + (y + 4) + 'H' + fx(108 - pull * 480) + 'v' + fx(40) + 'h-8Z', fill: '#e8f0f8', stroke: '#8fa9c9', 'stroke-width': 1.3, opacity: 1 - sg(t, 0.35, 0.5) }, g);
      const slide = sg(t, 0.2, 0.35) * 4;
      [[200, 'plate'], [310, 'vase'], [420, 'plate']].forEach((q) => {
        const x = q[0] - slide;
        if (q[1] === 'plate') S('path', { d: 'M' + (x - 34) + ' ' + (y - 2) + 'h68l-6 -6h-56Z', fill: '#fff', stroke: '#7a808c', 'stroke-width': 1.5 }, g);
        else { S('path', { d: 'M' + (x - 14) + ' ' + (y - 2) + 'q-8 -30 4 -50h20q12 20 4 50Z', fill: '#6fa3d6', stroke: '#2f5f92', 'stroke-width': 1.5 }, g); S('path', { d: 'M' + (x - 2) + ' ' + (y - 50) + 'q-6 -20 -16 -30M' + (x + 2) + ' ' + (y - 50) + 'q8 -22 18 -26', fill: 'none', stroke: COL.green, 'stroke-width': 2 }, g); S('circle', { cx: x - 18, cy: y - 82, r: 6, fill: '#d8543f' }, g); S('circle', { cx: x + 20, cy: y - 78, r: 6, fill: '#f4d27a' }, g); }
      });
      if (t < 0.35) K.hand(g, 80 - pull * 480, y + 6, 0.9, 180);
    }
  };

  /* The bottle standing upside down on a banknote */
  TRICK['note-bottle'] = {
    h: 360, ms: 7000,
    before: 'A bottle stands upside down, balanced on its neck, on a banknote',
    steps: [[0, 'Start rolling the banknote up tightly from the far end…'], [0.3, '…and keep rolling, slowly and evenly'], [0.6, 'The roll pushes the note gently out from under the bottle'], [0.9, 'The bottle is left standing on the table']],
    draw(g, t, W, H) {
      const y = H - 30, bx = W / 2 + 40;
      TK.table(g, W, y);
      const roll = sg(t, 0.05, 0.95), r0 = 150, rr = 5 + roll * 9;
      const noteX0 = bx - 110 + roll * 170, noteX1 = bx + 110;
      if (noteX0 < noteX1) S('rect', { x: noteX0, y: y - 3, width: noteX1 - noteX0, height: 3, fill: '#8fbf7a', stroke: '#4f7f3a', 'stroke-width': 1 }, g);
      S('circle', { cx: noteX0 - rr + 2, cy: y - rr, r: rr, fill: '#b5d9a3', stroke: '#4f7f3a', 'stroke-width': 1.5 }, g);
      TK.bottle(g, bx, 0, 1).setAttribute('transform', tr(bx, y - 193, 180, 1));
      void r0;
    }
  };

  /* Knocking the bottom coin out of a stack */
  TRICK['coin-stack'] = {
    h: 300, ms: 4000,
    before: 'A tall stack of coins',
    steps: [[0, 'Lay one coin flat on the table and flick it hard at the stack'], [0.35, 'It strikes the bottom coin and knocks it out'], [0.55, 'The stack, barely disturbed, drops down one coin']],
    draw(g, t, W, H) {
      const y = H - 30, x = W / 2;
      TK.table(g, W, y);
      const hit = sg(t, 0.1, 0.35), out = sg(t, 0.35, 0.6), drop = sg(t, 0.45, 0.6);
      for (let i = 1; i < 10; i++) TK.coinSide(g, x, y - 3 - i * 6 + drop * 6, 40);
      TK.coinSide(g, x + out * 200, y - 3, 40, { fill: '#c9ced8' });
      TK.coinSide(g, x - 220 + hit * 175 - out * 20, y - 3, 40, { fill: '#e8c25a' });
      if (t < 0.12) TK.finger(g, x - 250, y - 4, -90);
    }
  };

  /* A skewer through a balloon */
  TRICK.balloon = {
    h: 340, ms: 5000,
    before: 'A balloon and a long wooden skewer',
    steps: [[0, 'Dip the skewer’s point in a little oil'], [0.25, 'Push it in, twisting, through the thick rubber beside the knot'], [0.6, 'Out through the dark patch at the top, where the rubber is stretched least'], [0.85, 'Rubber that is barely stretched closes round the skewer']],
    draw(g, t, W, H) {
      const x = W / 2, y = H / 2 + 20;
      S('path', { d: 'M' + x + ' ' + (y + 90) + 'q-110 -10 -110 -110t110 -80t110 80t-110 110Z', fill: '#e2574c', stroke: '#8f2d22', 'stroke-width': 2 }, g);
      S('ellipse', { cx: x, cy: y - 99, rx: 12, ry: 6, fill: '#b53a2f' }, g);
      S('path', { d: 'M' + (x - 6) + ' ' + (y + 90) + 'l6 10 6 -10Z', fill: '#b53a2f' }, g);
      S('ellipse', { cx: x - 50, cy: y - 40, rx: 16, ry: 28, fill: '#fff', opacity: 0.25 }, g);
      const push = sg(t, 0.2, 0.8), L = 300;
      const tipY = y + 160 - push * 300;
      S('line', { x1: x, y1: tipY, x2: x, y2: tipY + L, stroke: '#c9a46a', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      if (t > 0.25) { S('circle', { cx: x, cy: y + 88, r: 5, fill: 'none', stroke: COL.green, 'stroke-width': 2 }, g); }
      if (t > 0.6) S('circle', { cx: x, cy: y - 99, r: 5, fill: 'none', stroke: COL.green, 'stroke-width': 2 }, g);
    }
  };

  /* A straw through a raw potato */
  TRICK['straw-potato'] = {
    h: 320, ms: 4500,
    before: 'A raw potato and a thin plastic straw',
    steps: [[0, 'Jab straight down: the straw crumples'], [0.35, 'Now cover the top of the straw with your thumb'], [0.55, 'Jab again, fast: the trapped air stiffens the straw'], [0.8, 'It goes right into the potato']],
    draw(g, t, W, H) {
      const y = H - 30;
      TK.table(g, W, y);
      [[W * 0.3, false], [W * 0.7, true]].forEach((q) => {
        const x = q[0], thumb = q[1];
        S('ellipse', { cx: x, cy: y - 38, rx: 70, ry: 38, fill: '#c9a46a', stroke: '#8a6a3a', 'stroke-width': 2 }, g);
        const jab = sg(t, thumb ? 0.55 : 0.1, thumb ? 0.75 : 0.3);
        const top = y - 200 + jab * (thumb ? 80 : 40);
        if (!thumb && jab > 0.9) S('path', { d: 'M' + x + ' ' + top + 'v60l-12 10 14 8', fill: 'none', stroke: '#e2574c', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        else S('line', { x1: x, y1: top, x2: x, y2: top + 100, stroke: '#e2574c', 'stroke-width': 6 }, g);
        if (thumb && t > 0.35) S('ellipse', { cx: x, cy: top - 4, rx: 12, ry: 8, fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, g);
        TK.label(g, x + (thumb ? -34 : 0), y - 26, thumb ? 'thumb on top' : 'open straw', { size: 11, fill: '#5a3a18', weight: 700 });
      });
    }
  };

  /* A paper ball that will not be blown into a bottle */
  TRICK['bottle-ball'] = {
    h: 300, ms: 4500,
    before: 'A bottle lying on its side, with a small ball of paper in its mouth',
    steps: [[0, 'Blow hard at the ball, into the bottle…'], [0.35, 'Your breath raises the pressure inside the bottle'], [0.6, 'The air rushes back out past the ball and shoots it out at you']],
    draw(g, t, W, H) {
      const y = H / 2 + 30;
      const gg = S('g', { transform: tr(W / 2 + 60, y, -90, 1.1) }, g);
      TK.bottle(gg, 0, 0, 1);
      const out = sg(t, 0.45, 0.8);
      const bx = W / 2 + 60 - 205 - out * 150 + (t < 0.4 ? Math.min(1, t / 0.4) * 6 : 0);
      S('circle', { cx: bx, cy: y, r: 9, fill: '#fff', stroke: '#999' }, g);
      if (t < 0.45) for (let k = -1; k <= 1; k++) TK.arrow(g, W / 2 - 250, y + k * 12, W / 2 - 170, y + k * 5, COL.blue, 2);
      if (t > 0.45) for (let k = -1; k <= 1; k += 2) TK.arrow(g, W / 2 - 140, y + k * 6, W / 2 - 200, y + k * 22, COL.red, 2);
    }
  };

  /* A ball held in a funnel by blowing */
  TRICK['funnel-ball'] = {
    h: 340, ms: 5000,
    before: 'A funnel and a ping-pong ball resting in its mouth',
    steps: [[0, 'Blow hard up through the stem of the funnel, held mouth up'], [0.35, 'The ball does not fly off — it sits there, jiggling'], [0.6, 'Fast air streaming past it presses less than the still air above it']],
    draw(g, t, W, H) {
      const x = W / 2, y = H / 2 + 60;
      S('path', { d: 'M' + (x - 80) + ' ' + (y - 80) + 'L' + (x - 8) + ' ' + y + 'V' + (y + 70) + 'H' + (x + 8) + 'V' + y + 'L' + (x + 80) + ' ' + (y - 80), fill: 'rgba(195,200,210,.3)', stroke: '#6b6f78', 'stroke-width': 3 }, g);
      const jig = t > 0.2 ? Math.sin(t * 90) * 2 : 0;
      S('circle', { cx: x, cy: y - 34 - (t > 0.2 ? 6 : 0) + jig, r: 22, fill: '#fff', stroke: '#999', 'stroke-width': 1.5 }, g);
      if (t > 0.15) { for (const s of [-1, 1]) { S('path', { d: 'M' + x + ' ' + (y + 60) + 'V' + (y - 4) + 'q' + (s * 26) + ' -10 ' + (s * 30) + ' -40q2 -20 ' + (s * 30) + ' -50', fill: 'none', stroke: COL.blue, 'stroke-width': 1.8, 'stroke-dasharray': '6 5', 'stroke-dashoffset': fx(-t * 300) }, g); } }
      if (t > 0.6) { TK.arrow(g, x, y - 120, x, y - 62, COL.red, 3); TK.label(g, x + 60, y - 110, 'still air presses harder', { fill: COL.red, weight: 700 }); }
    }
  };

  /* Blowing between two hanging balloons */
  TRICK['blow-between'] = {
    h: 330, ms: 4500,
    before: 'Two balloons hang on threads, a hand’s width apart',
    steps: [[0, 'Blow hard into the gap between them'], [0.35, 'They swing together, not apart!'], [0.7, 'The moving air between them presses less than the still air outside']],
    draw(g, t, W, H) {
      const x = W / 2, sw = sg(t, 0.2, 0.45) * 20 * (1 - sg(t, 0.85, 1));
      S('line', { x1: x - 140, y1: 20, x2: x + 140, y2: 20, stroke: COL.woodDark, 'stroke-width': 6 }, g);
      [-1, 1].forEach((s) => {
        const bx = x + s * (60 - sw);
        S('line', { x1: x + s * 60, y1: 20, x2: bx, y2: 150, stroke: COL.ink2, 'stroke-width': 1.3 }, g);
        S('ellipse', { cx: bx, cy: 200, rx: 44, ry: 52, fill: s < 0 ? '#e2574c' : '#6fa3d6', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 }, g);
        S('path', { d: 'M' + (bx - 4) + ' 150l4 -6 4 6Z', fill: 'rgba(0,0,0,.35)' }, g);
        if (t > 0.35) TK.arrow(g, bx + s * 80, 200, bx + s * 50, 200, COL.red, 2.5);
      });
      if (t > 0.1) for (let k = 0; k < 3; k++) S('path', { d: 'M' + x + ' ' + (H - 10) + 'V' + (110 + k * 10), stroke: COL.blue, 'stroke-width': 1.8, 'stroke-dasharray': '6 5', 'stroke-dashoffset': fx(t * 300 + k * 4), transform: tr((k - 1) * 8, 0) }, g);
    }
  };

  /* A coin balanced on the edge of a banknote */
  TRICK['coin-note'] = {
    h: 320, ms: 7000,
    before: 'A banknote and a coin',
    steps: [[0, 'Fold the note in half and open it to a V, standing on its edges'], [0.2, 'Stand the coin in the crease of the V'], [0.45, 'Now pull the ends apart, very slowly and evenly'], [0.85, 'The crease becomes a straight edge — with the coin balanced on it']],
    draw(g, t, W, H) {
      const y = H - 60, x = W / 2, open = sg(t, 0.45, 0.85);
      const ang = lerp(40, 88, open) * Math.PI / 180, L = 160;
      S('path', { d: 'M' + fx(x - L * Math.sin(ang)) + ' ' + fx(y + L * Math.cos(ang) * 0.35) + 'L' + x + ' ' + y + 'L' + fx(x + L * Math.sin(ang)) + ' ' + fx(y + L * Math.cos(ang) * 0.35), fill: 'none', stroke: '#6f9a4a', 'stroke-width': 8, 'stroke-linejoin': 'round' }, g);
      if (t > 0.18) { const cg = S('g', { transform: tr(x, y - 26, Math.sin(t * 20) * 2 * (1 - open)) }, g); S('ellipse', { cx: 0, cy: 0, rx: 7, ry: 26, fill: '#e0b650', stroke: '#9c7414', 'stroke-width': 1.5 }, cg); }
      if (t > 0.45 && t < 0.85) [-1, 1].forEach((s) => TK.arrow(g, x + s * 150, y + 50, x + s * 190, y + 50, COL.blue, 2.5));
    }
  };

  /* A handkerchief holds the water in */
  TRICK['hanky-glass'] = {
    h: 360, ms: 6000,
    before: 'A glass of water with a handkerchief stretched tight over the top',
    steps: [[0, 'Hold the cloth tight round the glass…'], [0.2, '…and turn it upside down'], [0.55, 'Water fills the holes of the weave with tiny curved surfaces'], [0.75, 'Surface tension and the air below hold it in — like a card, but full of holes']],
    draw(g, t, W, H) {
      const turn = sg(t, 0.15, 0.45) * 180, cx = W / 2, cy = H / 2 + 10;
      const gg = S('g', { transform: 'rotate(' + fx(turn) + ' ' + cx + ' ' + cy + ')' }, g);
      TK.glass(gg, cx, cy + 70, 110, 140, { water: 0.85 });
      S('path', { d: 'M' + (cx - 64) + ' ' + (cy - 70) + 'h128v18q-64 10 -128 0Z', fill: 'rgba(240,240,250,.85)', stroke: '#9aa0aa', 'stroke-width': 1.3 }, gg);
      for (let k = -60; k <= 60; k += 8) S('line', { x1: cx + k, y1: cy - 70, x2: cx + k, y2: cy - 54, stroke: '#c9ced8', 'stroke-width': 1 }, gg);
      if (t > 0.55) for (let k = -2; k <= 2; k++) TK.arrow(g, cx + k * 25, cy + 150, cx + k * 25, cy + 95, COL.blue, 2.5);
    }
  };

  /* Pepper and a drop of soap */
  TRICK.pepper = {
    h: 300, ms: 4000,
    before: 'A plate of water with ground pepper sprinkled over it',
    steps: [[0, 'Touch the middle with a fingertip dipped in washing-up liquid'], [0.3, 'The pepper rushes to the rim in an instant'], [0.6, 'Soap weakens the skin of the water where it lands; the stronger skin outside pulls away']],
    draw(g, t, W, H) {
      const x = W / 2, y = H / 2 + 20;
      S('ellipse', { cx: x, cy: y, rx: 220, ry: 100, fill: '#f4f5f7', stroke: '#9aa0aa', 'stroke-width': 3 }, g);
      S('ellipse', { cx: x, cy: y, rx: 190, ry: 82, fill: 'rgba(150,196,232,.5)' }, g);
      const spread = sg(t, 0.28, 0.45);
      for (let i = 0; i < 160; i++) {
        const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 160);
        const rr = lerp(r, 0.8 + 0.18 * r, spread);
        S('circle', { cx: x + Math.cos(a) * rr * 185, cy: y + Math.sin(a) * rr * 78, r: 1.8, fill: '#3a3020' }, g);
      }
      const dip = sg(t, 0.05, 0.28);
      if (t < 0.9) TK.finger(g, x, y - 140 + dip * 130, 0);
    }
  };

  /* A candle see-saw */
  TRICK['candle-seesaw'] = {
    h: 330, ms: 8000,
    before: 'A candle with a needle pushed through its middle, resting on two glasses',
    steps: [[0, 'Trim the bottom end so both ends have a wick, and light both'], [0.3, 'A drip falls from the lower end: it becomes lighter and rises'], [0.55, 'Now the other end is lower, and drips — and so on'], [0.8, 'The candle rocks up and down by itself for as long as it burns']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2;
      TK.table(g, W, y);
      TK.glass(g, x - 60, y, 70, 120); TK.glass(g, x + 60, y, 70, 120);
      S('line', { x1: x - 70, y1: y - 124, x2: x + 70, y2: y - 124, stroke: '#9aa0aa', 'stroke-width': 3 }, g);
      const a = t > 0.2 ? Math.sin((t - 0.2) * 28) * 16 : 6;
      const gg = S('g', { transform: tr(x, y - 128, a) }, g);
      S('rect', { x: -170, y: -9, width: 340, height: 18, rx: 4, fill: '#f6efe0', stroke: COL.ink2, 'stroke-width': 1.3 }, gg);
      [-1, 1].forEach((s) => { const fl = S('g', { transform: tr(s * 176, 0, s * 90) }, gg); S('path', { d: 'M0 -22C7 -12 6 -3 0 0C-6 -3 -7 -12 0 -22Z', fill: '#ffcf4a' }, fl); });
      if (t > 0.3) { const low = a > 0 ? 1 : -1; S('ellipse', { cx: x + low * 165, cy: y - 80 + ((t * 7) % 1) * 60, rx: 3, ry: 5, fill: '#f6efe0', stroke: '#bbb' }, g); }
    }
  };

  /* Blowing out a candle through a bottle */
  TRICK['bottle-candle'] = {
    h: 320, ms: 4500,
    before: 'A lit candle stands behind a bottle',
    steps: [[0, 'Blow hard at the front of the bottle'], [0.35, 'The air hugs the curved glass and flows round both sides'], [0.6, 'It meets again behind the bottle — and the flame goes out']],
    draw(g, t, W, H) {
      const y = H - 30, x = W / 2;
      TK.table(g, W, y);
      TK.bottle(g, x, y, 0.95);
      const out = t > 0.6;
      const c = K.candle(g, x + 120, y, 60, { w: 14 });
      c.flame(!out, out ? 0 : 1 - sg(t, 0.45, 0.6) * 0.5);
      if (t > 0.1) [-1, 1].forEach((s) => S('path', { d: 'M' + (x - 190) + ' ' + (y - 90 + s * 4) + 'C' + (x - 80) + ' ' + (y - 90 + s * 6) + ' ' + (x - 40) + ' ' + (y - 90 + s * 50) + ' ' + x + ' ' + (y - 90 + s * 50) + 'S' + (x + 70) + ' ' + (y - 90 + s * 10) + ' ' + (x + 120) + ' ' + (y - 88), fill: 'none', stroke: COL.blue, 'stroke-width': 2, 'stroke-dasharray': '7 5', 'stroke-dashoffset': fx(-t * 400) }, g));
      if (out) S('path', { d: 'M' + (x + 120) + ' ' + (y - 70) + 'q-8 -12 0 -24t0 -24', fill: 'none', stroke: '#9a9a9a', 'stroke-width': 2, opacity: 1 - sg(t, 0.6, 1) }, g);
    }
  };

  /* Taking a coin out of a plate of water with dry fingers */
  TRICK['coin-dry'] = {
    h: 340, ms: 8000,
    before: 'A coin lies in a plate of shallow water. Get it out without wetting your fingers',
    steps: [[0, 'Stand a short candle on the plate, away from the coin, and light it'], [0.25, 'Cover it with a glass'], [0.5, 'The flame goes out, the hot air cools and shrinks…'], [0.7, '…and the outside air pushes the water up into the glass'], [0.9, 'The coin is left high and dry — pick it up']],
    draw(g, t, W, H) {
      const y = H - 30, x = W / 2;
      TK.table(g, W, y);
      const suck = sg(t, 0.5, 0.85);
      S('path', { d: 'M' + (x - 200) + ' ' + (y - 16) + 'L' + (x - 180) + ' ' + y + 'H' + (x + 180) + 'L' + (x + 200) + ' ' + (y - 16), fill: '#f4f5f7', stroke: '#9aa0aa', 'stroke-width': 2 }, g);
      if (suck < 0.98) S('rect', { x: x - 186 + suck * 100, y: y - 12, width: 372 - suck * 200, height: 10, fill: 'rgba(150,196,232,.75)' }, g);
      const c = K.candle(g, x - 40, y - 4, 40, { w: 12 });
      c.flame(t < 0.5, 1);
      const gl = sg(t, 0.22, 0.4);
      const gg = S('g', { transform: tr(x - 40, lerp(y - 250, y - 150, gl), 180) }, g);
      TK.glass(gg, 0, 0, 90, 140);
      if (suck > 0) S('rect', { x: x - 80, y: y - 8 - suck * 40, width: 80, height: suck * 40, fill: 'rgba(150,196,232,.8)' }, g);
      const lift = sg(t, 0.9, 1);
      S('ellipse', { cx: x + 120, cy: y - 8 - lift * 80, rx: 16, ry: 4, fill: '#e0b650', stroke: '#9c7414', 'stroke-width': 1.2 }, g);
      if (lift > 0) K.hand(g, x + 60, y - 8 - lift * 80, 0.8, 0);
    }
  };

  /* Lifting a bottle with a straw */
  TRICK['bottle-straw'] = {
    h: 360, ms: 5000,
    before: 'An empty bottle and a bendy straw',
    steps: [[0, 'Bend the straw sharply, about a third of the way along'], [0.25, 'Push the bent end down into the bottle, folded'], [0.5, 'Inside, the fold springs open and wedges under the shoulder'], [0.75, 'Lift the straw: the bottle comes with it']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2, lift = sg(t, 0.75, 1) * 30;
      TK.table(g, W, y);
      TK.bottle(g, x, y - lift, 1.05);
      const inn = sg(t, 0.25, 0.5), open = sg(t, 0.5, 0.6);
      const top = y - lift - 290 + inn * 130;
      S('path', { d: 'M' + x + ' ' + top + 'V' + (top + 170) + 'l' + fx(lerp(4, 36, open)) + ' ' + fx(lerp(-60, -40, open)), fill: 'none', stroke: '#e2574c', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
      if (lift > 0) K.hand(g, x - 50, top + 10, 0.9, 0);
    }
  };

  /* Lifting a glass with a balloon */
  TRICK['glass-balloon'] = {
    h: 340, ms: 5000,
    before: 'A glass and an uninflated balloon',
    steps: [[0, 'Put the balloon inside the glass and blow it up'], [0.5, 'It swells and presses hard against the inside of the glass'], [0.75, 'Hold the balloon’s neck and lift: the glass comes too']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2, inf = sg(t, 0.05, 0.5), lift = sg(t, 0.75, 1) * 30;
      TK.table(g, W, y);
      const r = lerp(20, 58, inf);
      S('ellipse', { cx: x, cy: y - lift - 60 - r * 0.8, rx: r, ry: r * 1.2, fill: '#e2574c', stroke: '#8f2d22', 'stroke-width': 2 }, g);
      TK.glass(g, x, y - lift, 130, 150);
      S('path', { d: 'M' + (x - 5) + ' ' + fx(y - lift - 60 - r * 2) + 'v-20h10v20Z', fill: '#b53a2f' }, g);
      if (lift > 0) K.hand(g, x - 40, y - lift - 80 - r * 2, 0.8, 0);
    }
  };

  /* A chopstick in a jar of rice */
  TRICK.rice = {
    h: 360, ms: 6000,
    before: 'A jar filled to the top with dry rice, and a chopstick',
    steps: [[0, 'Push the chopstick into the rice, pull it out, push it in again…'], [0.35, 'Each jab packs the grains tighter, and the level sinks a little'], [0.65, 'Soon the packed grains grip the stick on every side'], [0.85, 'Lift the chopstick: the jar hangs from it']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2, lift = sg(t, 0.85, 1) * 30, pack = sg(t, 0.05, 0.7);
      TK.table(g, W, y);
      S('path', { d: 'M' + (x - 60) + ' ' + (y - lift) + 'V' + (y - lift - 170) + 'h120V' + (y - lift) + 'Z', fill: COL.glass, stroke: COL.glassLine, 'stroke-width': 2.2 }, g);
      const lv = y - lift - 160 + pack * 14;
      S('rect', { x: x - 57, y: lv, width: 114, height: y - lift - lv - 2, fill: '#f3ecd8' }, g);
      for (let i = 0; i < 90; i++) S('ellipse', { cx: x - 52 + (i * 37) % 104, cy: lv + 4 + ((i * 53) % Math.max(1, y - lift - lv - 10)), rx: 2.6, ry: 1.3, fill: '#d8ceb4', transform: 'rotate(' + ((i * 47) % 180) + ' ' + (x - 52 + (i * 37) % 104) + ' ' + (lv + 4 + ((i * 53) % Math.max(1, y - lift - lv - 10))) + ')' }, g);
      const jab = t < 0.7 ? Math.abs(Math.sin(t * 22)) : 1;
      S('line', { x1: x, y1: lv - 90 + jab * 60, x2: x, y2: lv + 30 + jab * 60, stroke: '#8a5a26', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    }
  };

  /* Two books with interleaved pages */
  TRICK.books = {
    h: 320, ms: 5000,
    before: 'Two paperback books',
    steps: [[0, 'Riffle the pages of the two books together, one leaf over the other, like shuffling cards'], [0.4, 'Now try to pull them apart by their spines'], [0.7, 'They hold: hundreds of pages each add a little friction, and pulling presses them tighter']],
    draw(g, t, W, H) {
      const y = H / 2 + 20, x = W / 2, merge = sg(t, 0.05, 0.4), pull = t > 0.45 ? Math.sin((t - 0.45) * 40) * 3 : 0;
      const gap = lerp(90, 0, merge);
      S('rect', { x: x - 150 - gap - pull, y: y - 60, width: 30, height: 120, rx: 4, fill: '#3a6ea5', stroke: '#244a75' }, g);
      S('rect', { x: x + 120 + gap + pull, y: y - 60, width: 30, height: 120, rx: 4, fill: '#b0472f', stroke: '#7a2a1a' }, g);
      for (let k = 0; k < 16; k++) {
        const yy = y - 54 + k * 7.2;
        S('line', { x1: x - 120 - gap - pull, y1: yy, x2: x + 60 * merge - gap * 0, y2: yy, stroke: '#9fb4d6', 'stroke-width': 2 }, g);
        S('line', { x1: x + 120 + gap + pull, y1: yy + 3.6, x2: x - 60 * merge, y2: yy + 3.6, stroke: '#e0a090', 'stroke-width': 2 }, g);
      }
      if (t > 0.45) { K.hand(g, x - 190 - pull, y, 0.9, 180); K.hand(g, x + 190 + pull, y, 0.9, 0); }
    }
  };

  /* A bridge of paper between two glasses */
  TRICK['paper-bridge'] = {
    h: 330, ms: 6000,
    before: 'Two glasses a little apart, a third glass, and a sheet of paper',
    steps: [[0, 'Laid flat across the gap, the paper sags even under its own weight'], [0.35, 'Fold it lengthwise into narrow pleats, like a fan'], [0.6, 'Laid across the gap, the pleated paper is stiff'], [0.8, 'It carries the third glass']],
    draw(g, t, W, H) {
      const y = H - 20, x = W / 2;
      TK.table(g, W, y);
      TK.glass(g, x - 130, y, 90, 140); TK.glass(g, x + 130, y, 90, 140);
      const pleat = sg(t, 0.35, 0.6), top = y - 142;
      if (pleat < 0.5) S('path', { d: 'M' + (x - 175) + ' ' + top + 'Q' + x + ' ' + fx(top + 40 * (1 - pleat * 2)) + ' ' + (x + 175) + ' ' + top, fill: 'none', stroke: '#9aa0aa', 'stroke-width': 3 }, g);
      else { let d = 'M' + (x - 175) + ' ' + top; for (let k = 0; k < 28; k++) d += 'L' + fx(x - 175 + (k + 0.5) * 12.5) + ' ' + fx(top + (k % 2 ? 0 : -8)); S('path', { d: d + 'L' + (x + 175) + ' ' + top, fill: 'none', stroke: '#6b6f78', 'stroke-width': 2 }, g); }
      const on = sg(t, 0.75, 0.9);
      if (on > 0) TK.glass(g, x, lerp(top - 80, top - 9, on), 80, 110);
    }
  };

  /* ---------- the cigarette arrangements (a sketch in plan, and in 3D) ---------- */
  // cigarettes in plan: two layers of three, each layer a "pinwheel" whose ends rest on the next;
  // radius r, length L, all axes passing at distance rho from the centre (rho = 2r leaves room for a seventh, upright)
  function cigLayout(seven) {
    const r = 0.4, L = 8.4, rho = seven ? 2 * r : 1.2 * r;
    const out = [];
    for (let layer = 0; layer < 2; layer++) for (let k = 0; k < 3; k++) {
      const ph = (layer ? Math.PI / 6 : 0) + k * TAU / 3, sgn = layer ? -1 : 1;   // the top layer turned by 30°, so no two are parallel
      const p = [rho * Math.cos(ph), rho * Math.sin(ph)], d = [-Math.sin(ph) * sgn, Math.cos(ph) * sgn];
      const t0 = -2.2 * r, t1 = t0 + L;
      const y0 = layer ? 3 * r : r, lift = 0.7 * r;   // the start end rests on the neighbour
      out.push({ a: [p[0] + d[0] * t0, y0 + lift, p[1] + d[1] * t0], b: [p[0] + d[0] * t1, y0 - (layer ? 0 : 0), p[1] + d[1] * t1], layer });
    }
    if (seven) out.push({ a: [0, 0, 0], b: [0, L, 0], layer: 2 });
    return { r, L, cigs: out };
  }
  function cig3(v3, seven) {
    const lay = cigLayout(seven);
    // a tablecloth made of tiles, so the painter draws it underneath
    for (let i = -4; i < 4; i++) for (let j = -4; j < 4; j++) v3.add({ verts: [[i * 2.2, 0, j * 2.2], [(i + 1) * 2.2, 0, j * 2.2], [(i + 1) * 2.2, 0, (j + 1) * 2.2], [i * 2.2, 0, (j + 1) * 2.2]], faces: [[0, 3, 2, 1]], color: (i + j) % 2 ? '#e8d9bb' : '#efe3c8', stroke: false, smooth: true, pickable: false, doubleSided: true });
    lay.cigs.forEach((c) => {
      const f = 0.24;
      const m = [c.a[0] + (c.b[0] - c.a[0]) * f, c.a[1] + (c.b[1] - c.a[1]) * f, c.a[2] + (c.b[2] - c.a[2]) * f];
      K.cyl3(v3, c.a, m, lay.r, '#d9a05b', { n: 3 });
      K.cyl3(v3, m, c.b, lay.r, c.layer === 2 ? '#f7f3ea' : '#f4f1ea', { n: 9 });
    });
  }
  function cigPlan(g, t, W, H, seven) {
    const lay = cigLayout(seven), sc = 19, cx = W / 2, cy = H / 2 - 4;
    const put = sg(t, 0.1, 0.8);
    const order = [0, 1, 2, 3, 4, 5, 6];
    order.forEach((i) => {
      const c = lay.cigs[i];
      if (!c) return;
      if (c.layer === 2) {
        const app = sg(t, 0.8, 0.95);
        if (app > 0) { S('circle', { cx, cy, r: lay.r * sc + 1, fill: '#f7f3ea', stroke: '#8a7a5a', 'stroke-width': 1.5, opacity: app }, g); S('circle', { cx, cy, r: 3, fill: '#bbb', opacity: app }, g); }
        return;
      }
      // from a loose heap on the left to its place
      const heap = [60 + i * 14, H - 60 - i * 10, 10 + i * 25];
      const ax = cx + c.a[0] * sc, az = cy + c.a[2] * sc, bx = cx + c.b[0] * sc, bz = cy + c.b[2] * sc;
      const ang = Math.atan2(bz - az, bx - ax) * 180 / Math.PI, len = Math.hypot(bx - ax, bz - az);
      const x = lerp(heap[0], ax, put), y = lerp(heap[1], az, put), rot = lerp(heap[2], ang, put);
      const gg = S('g', { transform: tr(x, y, rot) }, g);
      const wdt = lay.r * 2 * sc;
      S('rect', { x: 2, y: -wdt / 2 + 3, width: len, height: wdt, rx: wdt / 2, fill: 'rgba(0,0,0,.12)' }, gg);
      S('rect', { x: 0, y: -wdt / 2, width: len * 0.24, height: wdt, rx: 3, fill: '#d9a05b', stroke: '#8a5a26', 'stroke-width': 1 }, gg);
      S('rect', { x: len * 0.24, y: -wdt / 2, width: len * 0.76, height: wdt, rx: 3, fill: c.layer ? '#fffdf8' : '#ebe6da', stroke: '#8a7a5a', 'stroke-width': 1 }, gg);
    });
    if (t >= 0.8) TK.label(g, W - 20, H - 16, seven ? 'seen from above: the seventh stands upright in the middle' : 'seen from above: three below (grey), three on top (white)', { anchor: 'end', size: 11.5 });
  }
  TRICK['six-cig'] = {
    h: 380, ms: 5000,
    before: 'Six identical cigarettes (or pencils, or new crayons) on the table',
    steps: [[0, 'Lay three in a triangle, each resting its end on the next, like a pinwheel'], [0.45, 'Lay the other three on top, the same way but turned round'], [0.85, 'Each touches the two in its own layer, and all three in the other']],
    draw(g, t, W, H) { cigPlan(g, t, W, H, false); },
    three(v3) { cig3(v3, false); },
    note: 'A sketch of the arrangement: turn it in 3D'
  };
  TRICK['seven-cig'] = {
    h: 380, ms: 5000,
    before: 'Seven identical cigarettes — long and thin ones',
    steps: [[0, 'Make the two layers of three, leaving a small hole in the middle'], [0.8, 'Stand the seventh upright through the hole: it touches all six']],
    draw(g, t, W, H) { cigPlan(g, t, W, H, true); },
    three(v3) { cig3(v3, true); },
    note: 'A sketch of the arrangement: turn it in 3D'
  };

  /* Twelve nails on the head of one */
  function nails3(v3) {
    const H = 5.4, r = 0.07, L = 4, hr = 0.2;
    const nail = (a, b, head) => {
      const d = V3n.norm(V3n.sub(b, a));
      K.cyl3(v3, a, b, r, '#9aa0aa', { n: 4, sides: 8 });
      K.cyl3(v3, V3n.sub(a, V3n.mul(d, 0.06)), V3n.add(a, V3n.mul(d, 0.02)), hr, '#7d8494', { n: 1, sides: 12 });
      void head;
    };
    v3.box(-1.4, 0, -1.4, 2.8, 1.2, 2.8, '#c98c45');
    nail([0, H - 0.02, 0], [0, 1.2 - 0.6, 0]);                  // the upright nail, point in the block
    nail([-2, H + 0.07 + hr * 0, 0], [2, H + 0.07, 0]);          // the base nail across its head
    for (let i = 0; i < 10; i++) {
      const s = i % 2 ? 1 : -1, x = -1.6 + i * 0.36;
      const head = [x, H + 0.55, s * 0.55], tip = [x + 0.05, H + 0.55 - 3.0, -s * 1.0];
      nail(head, tip);
    }
    nail([-2, H + 0.62, 0], [2, H + 0.62, 0]);                    // the top nail, in the V of the heads
  }
  const V3n = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
  TRICK.nails = {
    h: 400, ms: 8000,
    before: 'One nail hammered upright into a block of wood, and twelve loose nails',
    steps: [[0, 'Lay one nail flat on the table'], [0.15, 'Lay ten nails across it, heads resting on it, alternately from each side'], [0.5, 'Lay the last nail on top, in the groove between the heads'], [0.65, 'Lift the bottom nail by its ends: the hanging nails swing in and lock the top one'], [0.85, 'Set it on the head of the upright nail: the weight hangs low, so it balances']],
    draw(g, t, W, H) {
      // seen end-on, along the nails lying flat
      const cx = W / 2, top = 120, sc = 42;
      const lifted = sg(t, 0.62, 0.85);
      S('rect', { x: cx - 70, y: H - 60, width: 140, height: 50, rx: 4, fill: '#c98c45', stroke: COL.woodDark, 'stroke-width': 1.5 }, g);
      S('line', { x1: cx, y1: H - 40, x2: cx, y2: top + 6 + 4 * sc * (1 - lifted) * 0, stroke: '#7d8494', 'stroke-width': 3 }, g);
      S('ellipse', { cx, cy: top + 4, rx: 9, ry: 3, fill: '#7d8494' }, g);
      const bx = lerp(cx - 190, cx, lifted), by = lerp(H - 70, top - 2, lifted);
      S('circle', { cx: bx, cy: by, r: 4, fill: '#9aa0aa', stroke: '#555' }, g);
      const n = Math.round(sg(t, 0.15, 0.5) * 10);
      for (let i = 0; i < n; i++) {
        const s = i % 2 ? 1 : -1;
        const swing = lifted;
        const hx = bx + s * lerp(0.9, 0.5, swing) * sc, hy = by - lerp(0.25, 0.55, swing) * sc;
        const tx = bx - s * lerp(3, 1.2, swing) * sc, ty = by + lerp(0.3, 3.2, swing) * sc;
        S('line', { x1: hx, y1: hy, x2: tx, y2: ty, stroke: '#9aa0aa', 'stroke-width': 2.4, opacity: 0.85 }, g);
        S('line', { x1: hx - 5, y1: hy - 3 * s * 0, x2: hx + 5, y2: hy, stroke: '#6b6f78', 'stroke-width': 3, transform: 'rotate(' + fx(Math.atan2(ty - hy, tx - hx) * 180 / Math.PI + 90) + ' ' + fx(hx) + ' ' + fx(hy) + ')' }, g);
      }
      if (t >= 0.5) S('circle', { cx: bx, cy: by - lerp(0.4, 0.62, lifted) * sc, r: 4, fill: '#9aa0aa', stroke: '#555' }, g);
      if (t >= 0.85) { S('circle', { cx: bx, cy: by + 1.7 * sc, r: 6, fill: COL.red }, g); TK.label(g, bx + 60, by + 1.7 * sc + 4, 'centre of mass, below the support', { fill: COL.red, weight: 700, anchor: 'start' }); }
      TK.label(g, 20, H - 12, 'seen end-on, along the nail lying across', { anchor: 'start', size: 11 });
    },
    three: nails3,
    note: 'A sketch of the arrangement: turn it in 3D'
  };

  /* Catch the falling banknote: a reaction-time game (real time, on purpose) */
  C.figure('trick-catch', {
    draw(g, P, ctx) {
      const F = K.frame(g, ctx, { w: 620, h: 380, bar: 1 });
      const gA = 9.81, ppm = 900, noteL = 0.156;   // a banknote about 15.6 cm long, drawn at 900 px per metre (0.34 m of fall fits)
      const x = 200, y0 = 60, fy = y0 + noteL * ppm * 0.5;   // the fingers are at the middle of the note
      const note = S('g', null, F.scene);
      S('rect', { x: -32, y: 0, width: 64, height: noteL * ppm, rx: 4, fill: '#9ccf8a', stroke: '#4f7f3a', 'stroke-width': 1.5 }, note);
      S('circle', { cx: 0, cy: noteL * ppm / 2, r: 18, fill: 'none', stroke: '#4f7f3a', 'stroke-width': 1.5 }, note);
      T(note, 0, 30, '10', { anchor: 'middle', size: 18, weight: 800, fill: '#2f5a2a' });
      const thumb = S('path', { fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, F.scene), finger = S('path', { fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, F.scene);
      const holder = S('g', null, F.scene);
      S('path', { d: 'M' + (x - 14) + ' 20h28v' + (y0 - 14) + 'h-28Z', fill: COL.skin, stroke: COL.skinDark, 'stroke-width': 1.5 }, holder);
      const big = T(F.scene, 440, 110, '', { anchor: 'middle', size: 22, weight: 800 });
      const small = T(F.scene, 440, 136, '', { anchor: 'middle', size: 13, fill: COL.ink2 });
      const hist = T(F.scene, 440, 170, '', { anchor: 'middle', size: 12.5, fill: COL.ink2 });
      const hint = T(F.scene, 440, 60, 'Press "Ready", wait — and click "Catch!"', { anchor: 'middle', size: 12.5, fill: COL.muted });
      let state = 'idle', tDrop = 0, fallT = 0, timer = null, raf2 = 0, closed = 0, tries = [];
      function fingers() {
        const gap = lerp(34, 6, closed);
        finger.setAttribute('d', 'M' + (x - gap) + ' ' + (fy - 24) + 'h-60q-10 0 -10 12t10 12h60Z');
        thumb.setAttribute('d', 'M' + (x + gap) + ' ' + (fy - 24) + 'h60q10 0 10 12t-10 12h-60Z');
      }
      function place() { const d = 0.5 * gA * fallT * fallT; note.setAttribute('transform', tr(x, y0 + d * ppm)); holder.style.opacity = state === 'idle' || state === 'ready' ? 1 : 0.25; }
      function fall() {
        raf2 = 0;
        if (F.dead || state !== 'falling') return;
        fallT = (now() - tDrop) / 1000;
        const d = 0.5 * gA * fallT * fallT;
        if (d > noteL / 2 + 0.03) { state = 'missed'; K.say(big, 'Too late!'); big.setAttribute('fill', COL.red); K.say(small, 'It fell past your fingers'); place(); return; }
        place();
        raf2 = root.requestAnimationFrame ? root.requestAnimationFrame(fall) : setTimeout(fall, 16);
      }
      function ready() {
        if (state === 'ready' || state === 'falling') return;
        state = 'ready'; fallT = 0; closed = 0; fingers(); place();
        K.say(big, 'Get ready…'); big.setAttribute('fill', COL.ink); K.say(small, '');
        clearTimeout(timer);
        timer = setTimeout(() => { if (F.dead || state !== 'ready') return; state = 'falling'; tDrop = now(); fall(); }, 1200 + Math.random() * 2300);
      }
      function catchIt() {
        if (state === 'ready') { clearTimeout(timer); state = 'idle'; K.say(big, 'Too early!'); big.setAttribute('fill', COL.orange); K.say(small, 'Wait for it to drop'); return; }
        if (state !== 'falling') return;
        const rt = (now() - tDrop) / 1000;
        fallT = rt; state = 'done'; closed = 1; fingers(); place();
        const d = 0.5 * gA * rt * rt;
        const caught = d <= noteL / 2;
        tries.push(Math.round(rt * 1000));
        K.say(big, caught ? 'Caught! ' + Math.round(rt * 1000) + ' ms' : 'Missed: ' + Math.round(rt * 1000) + ' ms');
        big.setAttribute('fill', caught ? COL.green : COL.red);
        K.say(small, 'In that time it fell ' + (d * 100).toFixed(1) + ' cm; half the note is ' + (noteL * 50).toFixed(1) + ' cm');
        K.say(hist, 'Your tries: ' + tries.slice(-6).join(', ') + ' ms');
      }
      F.button('Ready', ready, { primary: true, icon: 'play', w: 90 });
      F.button('Catch!', catchIt, { cls: 'gold', icon: 'hand', w: 100 });
      F.onEnd(() => { clearTimeout(timer); if (raf2 && root.cancelAnimationFrame) root.cancelAnimationFrame(raf2); });
      void hint;
      fingers(); place();
      return F.inst({ getState: () => ({ tries }), setState(s) { if (Array.isArray(s.tries)) { tries = s.tries.slice(-20); if (tries.length) K.say(hist, 'Your tries: ' + tries.slice(-6).join(', ') + ' ms'); } } });
    }
  });

  /* @@END@@ */
})(typeof window !== 'undefined' ? window : globalThis);
