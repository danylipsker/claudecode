/* The Puzzle Cabinet · workbench.js
 *
 * The table every puzzle is played on: an SVG stage with the hand tools.
 *
 *   select   pick up, drag, turn (handle, R / Shift+R), mirror (X), lasso
 *   pan      move the view (also: middle or right drag, Space + drag, one finger)
 *   paint    colour a piece or a cell to pick it out; name the colours (groups)
 *   pen      write on the table; marker = a wide see-through highlighter
 *   eraser   rub out pen and marker strokes
 *   note     stick a note on the table
 *   cut      a knife stroke through pieces (engines may take it over)
 *   fold     bring a point of the paper onto another point (engines take it)
 *   x-ray    every piece half transparent, to see what lies below
 *   loupe    a magnifying glass that follows the pointer
 *   3D       engines with a 3D view get a 2D / 3D switch
 *
 * Engines add pieces with wb.add({...}) (see AUTHORING.md), draw their own
 * boards into wb.layer('board'), and may add modes of their own with
 * wb.addMode({...}). Every user action that changes pieces fires 'change',
 * which the player turns into an undo step and a save.
 */
(function (root) {
  'use strict';

  const C = root.Cabinet;
  const G = C.geom;
  const S = (tag, attrs, parent) => C.s(tag, attrs, parent);

  const PALETTE = ['#ff6b6b', '#ffb057', '#ffd166', '#4ecb8d', '#38d9d3', '#6c7bff', '#b388ff', '#ff7eb6', '#f4f1e8', '#8d93b0', '#4a5078', '#1b2140'];
  C.PALETTE = PALETTE;

  let uid = 0;

  function Workbench(host, opts) {
    this.host = host;
    this.opts = Object.assign({
      tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
      grid: 0,            // snap piece positions to this step (0 = off)
      vertexSnap: false,  // snap piece corners to other corners and snapTargets()
      snapPx: 11,         // how near (screen pixels) before a snap takes
      rotStep: 15,        // default turning step in degrees
      cutMode: 'segment'  // 'segment' (only where the stroke reaches) or 'line'
    }, opts || {});
    this.id = 'wb' + (++uid);
    this.objs = new Map();
    this.order = [];
    this.sel = new Set();
    this.types = {};
    this.modes = {};
    this.modeList = [];
    this.handlers = {};   // engine hooks: cut(a,b) fold(info) board{down,move,up}
    this.listeners = {};
    this.marks = [];
    this.notes = [];
    this.paints = {};
    this.legend = {};
    this.ctxActions = [];
    this.bounds = { x0: 0, y0: 0, x1: 100, y1: 100 };
    this.v = { k: 1, x: 0, y: 0 };
    this.mode = 'select';
    this.seq = 0;
    this.penColor = '#ffd166';
    this.paintColor = '#ff6b6b';
    this.xray = false;
    this.loupeOn = false;
    this.is3D = false;
    this.pointers = new Map();
    this.stats = { cuts: 0, folds: 0 };
    this.build();
    this.bindEvents();
  }
  C.Workbench = Workbench;
  Workbench.PALETTE = PALETTE;

  const proto = Workbench.prototype;

  /* ---------- events ---------- */

  proto.on = function (name, fn) { (this.listeners[name] = this.listeners[name] || []).push(fn); return this; };
  proto.off = function (name, fn) { const l = this.listeners[name]; if (l) this.listeners[name] = l.filter((f) => f !== fn); };
  proto.emit = function (name, arg) {
    let handled = false;
    (this.listeners[name] || []).slice().forEach((fn) => { try { if (fn(arg) === true) handled = true; } catch (e) { console.error(e); } });
    return handled;
  };

  /* ---------- building the stage ---------- */

  proto.build = function () {
    const host = this.host;
    host.innerHTML = '';
    host.classList.add('wb');
    this.svg = S('svg', { class: 'wb-svg', xmlns: C.SVGNS }, host);
    this.defs = S('defs', null, this.svg);
    this.defs.innerHTML =
      '<filter id="' + this.id + '-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".45"/></filter>' +
      '<clipPath id="' + this.id + '-lclip"><circle r="92"/></clipPath>' +
      '<pattern id="' + this.id + '-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="rgba(255,255,255,.25)" stroke-width="2"/></pattern>';
    this.view = S('g', { class: 'wb-view', id: this.id + '-view' }, this.svg);
    this.L = {};
    ['bg', 'board', 'objs', 'top', 'marks', 'notes', 'sel', 'live'].forEach((n) => { this.L[n] = S('g', { class: 'wb-' + n }, this.view); });
    this.loupe = S('g', { class: 'wb-loupe', 'pointer-events': 'none' }, this.svg);
    this.loupeClip = this.defs.querySelector('clipPath circle');
    this.loupeBack = S('circle', { r: 92, class: 'wb-loupe-back' }, this.loupe);
    const lin = S('g', { 'clip-path': 'url(#' + this.id + '-lclip)' }, this.loupe);
    this.loupeUse = S('use', { href: '#' + this.id + '-view' }, lin);
    this.loupeRing = S('circle', { r: 92, class: 'wb-loupe-ring' }, this.loupe);
    this.loupe.style.display = 'none';

    this.box3d = C.h('div.wb-3d');
    host.appendChild(this.box3d);
    this.box3d.hidden = true;

    this.toolbar = C.h('div.wb-tools', { role: 'toolbar', 'aria-label': 'Tools' });
    host.appendChild(this.toolbar);
    this.ctxbar = C.h('div.wb-ctx');
    host.appendChild(this.ctxbar);
    this.zoombar = C.h('div.wb-zoom');
    host.appendChild(this.zoombar);
    this.legendBar = C.h('div.wb-legend');
    host.appendChild(this.legendBar);
    this.toastEl = C.h('div.wb-toast');
    host.appendChild(this.toastEl);
    this.pop = C.h('div.wb-pop');
    this.pop.hidden = true;
    host.appendChild(this.pop);

    this.buildZoom();
    this.buildTools();
    this.ro = root.ResizeObserver ? new root.ResizeObserver(() => this.onResize()) : null;
    if (this.ro) this.ro.observe(host);
  };

  proto.destroy = function () {
    if (this.ro) this.ro.disconnect();
    if (this.v3) this.v3.destroy();
    this.listeners = {};
    this.host.innerHTML = '';
    this.host.classList.remove('wb', 'is3d', 'xray');
  };

  // an engine drawing layer: 'bg' (under everything), 'board', 'top' (over pieces)
  proto.layer = function (name) { return this.L[name]; };

  // opts.keepView: grow the framing (for the fit button) without moving a view the player chose
  proto.setBounds = function (b, pad, opts) {
    this.bounds = { x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 };
    this.boundsPad = pad == null ? 0.08 : pad;
    if (opts && opts.keepView && this.userView) return;
    this.fit();
  };

  /* ---------- view: zoom and pan ---------- */

  proto.size = function () {
    const r = this.svg.getBoundingClientRect();
    return { w: r.width || 600, h: r.height || 400, left: r.left, top: r.top };
  };

  // zoom to a part of the board (fit, 0, still shows everything)
  proto.zoomTo = function (box, pad) {
    const keep = this.bounds, keepPad = this.boundsPad, keepK = this.fitK;
    this.bounds = box;
    if (pad != null) this.boundsPad = pad;
    this.fit();
    this.bounds = keep;
    this.boundsPad = keepPad;
    this.fitK = keepK || this.fitK;
    this.applyView();
  };

  proto.fit = function () {
    const sz = this.size(), b = this.bounds;
    const bw = Math.max(1e-6, b.x1 - b.x0), bh = Math.max(1e-6, b.y1 - b.y0);
    const pad = this.boundsPad == null ? 0.08 : this.boundsPad;
    const narrow = this.isNarrow();
    // keep the board clear of the tool bar (left, or bottom on phones) and the zoom bar (bottom right, or top on phones)
    const reserveL = narrow ? 0 : 56;
    const reserveT = narrow ? 46 : 0;
    const reserveB = narrow ? 54 : 48;
    const k = Math.min((sz.w - reserveL) * (1 - pad) / bw, (sz.h - reserveB - reserveT) * (1 - pad) / bh);
    this.fitK = k;
    this.v.k = k;
    this.v.x = reserveL + (sz.w - reserveL - bw * k) / 2 - b.x0 * k;
    this.v.y = reserveT + (sz.h - reserveB - reserveT - bh * k) / 2 - b.y0 * k;
    this.userView = false;
    this.applyView();
  };

  proto.applyView = function () {
    const v = this.v;
    this.view.setAttribute('transform', 'matrix(' + v.k + ' 0 0 ' + v.k + ' ' + v.x + ' ' + v.y + ')');
    this.svg.style.setProperty('--k', v.k);
    if (this.zoomLabel) this.zoomLabel.textContent = Math.round(100 * v.k / (this.fitK || v.k)) + '%';
    this.drawSel();
    this.emit('view', v);
  };

  proto.zoomAt = function (factor, sx, sy) {
    this.userView = true;
    const v = this.v, fk = this.fitK || v.k;
    const k2 = Math.max(fk / 6, Math.min(fk * 14, v.k * factor));
    const f = k2 / v.k;
    v.x = sx - (sx - v.x) * f;
    v.y = sy - (sy - v.y) * f;
    v.k = k2;
    this.applyView();
  };

  proto.zoom = function (factor) {
    if (this.is3D && this.v3) { this.v3.zoom(factor); return; }
    const sz = this.size();
    this.zoomAt(factor, sz.w / 2, sz.h / 2);
  };

  // the phone layout (tools along the bottom), as in the CSS
  proto.isNarrow = function () {
    return root.matchMedia ? root.matchMedia('(max-width: 640px)').matches : this.size().w < 560;
  };

  proto.onResize = function () {
    const sz = this.size();
    const narrow = this.isNarrow();
    if (this.wasNarrow !== undefined && narrow !== this.wasNarrow) this.emit('layout', { narrow });
    this.wasNarrow = narrow;
    if (!this.lastSize || Math.abs(this.lastSize.w - sz.w) > 2 || Math.abs(this.lastSize.h - sz.h) > 2) {
      const big = !this.lastSize || Math.abs(this.lastSize.w - sz.w) > 60 || Math.abs(this.lastSize.h - sz.h) > 120;
      this.lastSize = sz;
      // a zoom or pan the player (or the engine) chose survives small changes of the stage
      if (big || !(this.userView || this.opts.keepView)) this.fit();
    }
  };

  proto.toWorld = function (clientX, clientY) {
    const r = this.svg.getBoundingClientRect(), v = this.v;
    return [(clientX - r.left - v.x) / v.k, (clientY - r.top - v.y) / v.k];
  };
  proto.toScreen = function (p) { return [p[0] * this.v.k + this.v.x, p[1] * this.v.k + this.v.y]; };
  proto.px = function (n) { return n / this.v.k; }; // screen pixels as world units

  /* ---------- tool bar ---------- */

  const TOOL_INFO = {
    select: { icon: 'select', title: 'Select and move', key: 'V' },
    pan: { icon: 'pan', title: 'Move the view', key: 'H' },
    paint: { icon: 'paint', title: 'Colour pieces and cells', key: 'B' },
    pen: { icon: 'pen', title: 'Pen: write and draw', key: 'P' },
    marker: { icon: 'marker', title: 'Highlighter', key: 'M' },
    eraser: { icon: 'eraser', title: 'Eraser', key: 'E' },
    note: { icon: 'note', title: 'Sticky note', key: 'N' },
    cut: { icon: 'cut', title: 'Knife: cut along a stroke', key: 'C' },
    fold: { icon: 'fold', title: 'Fold: drag a point of the paper to where it should land (Shift: draw the crease)', key: 'F' },
    xray: { icon: 'xray', title: 'X-ray: see through the pieces', key: 'Shift+X', toggle: true },
    loupe: { icon: 'loupe', title: 'Magnifying glass', key: 'L', toggle: true }
  };

  proto.buildTools = function () {
    const bar = this.toolbar;
    bar.innerHTML = '';
    this.toolBtns = {};
    const tools = this.opts.tools.slice();
    const mk = (id, info, onclick) => {
      const b = C.h('button.wb-tool', {
        type: 'button', title: info.title + (info.key ? '  (' + info.key + ')' : ''), 'aria-label': info.title,
        html: C.icon(info.icon), onclick
      });
      b.dataset.tool = id;
      bar.appendChild(b);
      this.toolBtns[id] = b;
      return b;
    };
    if (this.opts.modesFirst && this.modeList.length) {
      this.modeList.forEach((m) => mk(m.id, m, () => this.setMode(m.id)));
      bar.appendChild(C.h('span.wb-sep'));
    }
    let lastGroup = null;
    const groups = { select: 1, pan: 1, paint: 2, pen: 2, marker: 2, eraser: 2, note: 2, cut: 3, fold: 3, xray: 4, loupe: 4 };
    tools.forEach((t) => {
      const info = TOOL_INFO[t];
      if (!info) return;
      if (lastGroup && groups[t] !== lastGroup) bar.appendChild(C.h('span.wb-sep'));
      lastGroup = groups[t];
      if (info.toggle) mk(t, info, () => (t === 'xray' ? this.setXray(!this.xray) : this.setLoupe(!this.loupeOn)));
      else mk(t, info, () => this.setMode(t));
    });
    if (!this.opts.modesFirst) {
      if (this.modeList.length) bar.appendChild(C.h('span.wb-sep'));
      this.modeList.forEach((m) => mk(m.id, m, () => this.setMode(m.id)));
    }
    bar.hidden = !bar.querySelector('.wb-tool'); // tools: [] and no modes: no bar at all
    this.syncTools();
  };

  proto.syncTools = function () {
    for (const id in this.toolBtns) {
      const b = this.toolBtns[id];
      b.classList.toggle('on', id === this.mode || (id === 'xray' && this.xray) || (id === 'loupe' && this.loupeOn));
      const off = this.is3D && ['pen', 'marker', 'eraser', 'note', 'cut', 'fold', 'paint', 'loupe', 'xray'].includes(id) && !(this.modes[id] && this.modes[id].in3D);
      b.disabled = !!off;
    }
    this.host.dataset.mode = this.mode;
  };

  /* An engine mode: { id, icon, title, key, cursor, down(pt, ev, el), move(pt, ev), up(pt, ev), in3D }
   * down() returns true to keep the pointer (then move/up follow). */
  proto.addMode = function (m) {
    this.modes[m.id] = m;
    if (!this.modeList.find((x) => x.id === m.id)) this.modeList.push(m);
    this.buildTools();
    return m;
  };

  proto.setMode = function (id) {
    if (this.is3D && ['pen', 'marker', 'eraser', 'note', 'cut', 'fold', 'paint'].includes(id) && !(this.modes[id] && this.modes[id].in3D)) return;
    const was = this.mode;
    this.mode = id;
    if (id !== 'select') this.select([]);
    this.closePop();
    this.L.live.innerHTML = '';
    this.syncTools();
    if (id === 'paint' || id === 'pen' || id === 'marker') this.openPalette(id);
    if (was !== id) this.emit('mode', id);
  };

  proto.setXray = function (on) {
    this.xray = on;
    this.host.classList.toggle('xray', on);
    this.syncTools();
  };

  proto.setLoupe = function (on) {
    this.loupeOn = on;
    this.loupe.style.display = on ? '' : 'none';
    this.syncTools();
  };

  proto.buildZoom = function () {
    const z = this.zoombar;
    z.innerHTML = '';
    const btn = (icon, title, fn) => C.h('button.wb-zbtn', { type: 'button', title, 'aria-label': title, html: C.icon(icon), onclick: fn });
    this.btn3d = btn('cube', 'Switch between the flat and the 3D view (3)', () => this.set3D(!this.is3D));
    this.btn3d.hidden = true;
    z.append(
      this.btn3d,
      btn('zoomout', 'Zoom out (−)', () => this.zoom(1 / 1.25)),
      this.zoomLabel = C.h('button.wb-zlabel', { type: 'button', title: 'Fit to the screen (0)', onclick: () => (this.is3D && this.v3 ? (this.v3.fit(), this.v3.render()) : this.fit()) }, '100%'),
      btn('zoomin', 'Zoom in (+)', () => this.zoom(1.25))
    );
  };

  proto.toast = function (msg, kind) {
    const t = this.toastEl;
    t.textContent = msg;
    t.className = 'wb-toast show' + (kind ? ' ' + kind : '');
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => { t.className = 'wb-toast'; }, 2600);
  };

  /* ---------- palette pop-up (paint, pen) and legend ---------- */

  proto.openPalette = function (forMode) {
    const pop = this.pop;
    pop.innerHTML = '';
    pop.hidden = false;
    const isPaint = forMode === 'paint';
    const cur = isPaint ? this.paintColor : this.penColor;
    pop.appendChild(C.h('div.wb-pop-title', isPaint ? 'Paint colour — name a colour to make a group' : (forMode === 'marker' ? 'Highlighter colour' : 'Pen colour')));
    const grid = C.h('div.wb-swatches');
    PALETTE.forEach((c) => {
      const b = C.h('button.wb-sw', { type: 'button', title: c, style: { background: c }, onclick: () => {
        if (isPaint) this.paintColor = c; else this.penColor = c;
        this.openPalette(forMode);
      } });
      if (c === cur) b.classList.add('on');
      grid.appendChild(b);
    });
    if (isPaint) {
      const clr = C.h('button.wb-sw.clear', { type: 'button', title: 'Rub out the colour', onclick: () => { this.paintColor = null; this.openPalette(forMode); } }, '×');
      if (!cur) clr.classList.add('on');
      grid.appendChild(clr);
    }
    pop.appendChild(grid);
    if (isPaint && cur) {
      const inp = C.h('input.wb-legend-in', { type: 'text', placeholder: 'Name this colour (e.g. "heavy")', value: this.legend[cur] || '', maxlength: 28 });
      inp.addEventListener('input', () => {
        const v = inp.value.trim();
        if (v) this.legend[cur] = v; else delete this.legend[cur];
        this.drawLegend();
      });
      inp.addEventListener('change', () => this.emit('change', { why: 'legend' }));
      pop.appendChild(inp);
      pop.appendChild(C.h('div.wb-pop-hint', 'Click pieces or cells to colour them. Alt-click rubs a colour out.'));
    }
    pop.appendChild(C.h('button.wb-pop-close', { type: 'button', title: 'Close', html: C.icon('close'), onclick: () => this.closePop() }));
  };
  proto.closePop = function () { this.pop.hidden = true; };

  proto.drawLegend = function () {
    const bar = this.legendBar;
    bar.innerHTML = '';
    const keys = Object.keys(this.legend);
    bar.hidden = !keys.length;
    keys.forEach((c) => {
      let n = 0;
      this.objs.forEach((o) => { if (o.fill === c) n++; });
      for (const k in this.paints) if (this.paints[k] === c) n++;
      bar.appendChild(C.h('span.wb-lg', { title: 'Click to pick out this group' , onclick: () => this.flashColor(c) },
        C.h('i', { style: { background: c } }), this.legend[c], C.h('small', ' ' + n)));
    });
  };

  // briefly light up everything painted a colour
  proto.flashColor = function (c) {
    const els = [];
    this.objs.forEach((o) => { if (o.fill === c && o.el) els.push(o.el); });
    this.view.querySelectorAll('[data-key]').forEach((el) => { if (this.paints[el.dataset.key] === c) els.push(el); });
    els.forEach((el) => { el.classList.remove('wb-flash'); void el.getBBox; el.classList.add('wb-flash'); });
    setTimeout(() => els.forEach((el) => el.classList.remove('wb-flash')), 1300);
  };

  // engines call this after redrawing elements that carry data-key
  proto.applyPaints = function () {
    this.view.querySelectorAll('[data-key]').forEach((el) => {
      const c = this.paints[el.dataset.key];
      if (c) { el.style.fill = c; el.classList.add('wb-painted'); }
      else if (el.classList.contains('wb-painted')) { el.style.fill = ''; el.classList.remove('wb-painted'); }
    });
  };

  /* ---------- pieces ---------- */

  /* A type draws pieces of one kind: { draw(g, o, wb), poly(o) -> local polygon, hit(o) -> local polygon } */
  proto.type = function (name, def) { this.types[name] = def; return def; };

  const DEFAULTS = { x: 0, y: 0, rot: 0, flip: false, scale: 1, move: true, rotate: false, flipable: false, opacity: 1, visible: true, locked: false, group: null };

  proto.add = function (spec) {
    const o = Object.assign({}, DEFAULTS, spec);
    o.id = spec.id || ('o' + (++this.seq));
    if (this.objs.has(o.id)) o.id = o.id + '_' + (++this.seq);
    o.data = o.data || {};
    this.objs.set(o.id, o);
    this.order.push(o.id);
    this.renderObj(o);
    return o;
  };

  proto.remove = function (o) {
    if (typeof o === 'string') o = this.objs.get(o);
    if (!o) return;
    if (o.el) o.el.remove();
    this.objs.delete(o.id);
    this.order = this.order.filter((id) => id !== o.id);
    this.sel.delete(o.id);
    this.drawSel();
  };

  proto.clear = function () {
    this.objs.forEach((o) => o.el && o.el.remove());
    this.objs.clear();
    this.order = [];
    this.sel.clear();
    this.drawSel();
  };

  proto.get = function (id) { return this.objs.get(id); };
  proto.all = function () { return this.order.map((id) => this.objs.get(id)).filter(Boolean); };
  proto.find = function (fn) { return this.all().filter(fn); };

  proto.localPoly = function (o) {
    const t = o.type && this.types[o.type];
    if (t && t.poly) return t.poly(o);
    const sh = o.shape || {};
    if (sh.poly) return sh.poly;
    if (sh.rect) { const w = sh.rect[0] / 2, h = sh.rect[1] / 2; return [[-w, -h], [w, -h], [w, h], [-w, h]]; }
    if (sh.circle) { const r = sh.circle, out = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; out.push([Math.cos(a) * r, Math.sin(a) * r]); } return out; }
    return [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
  };
  proto.worldPoly = function (o, at) { return G.placePoly(this.localPoly(o), at || o); };

  proto.renderObj = function (o) {
    let g = o.el;
    if (!g) {
      g = o.el = S('g', { class: 'wb-obj', 'data-id': o.id });
      this.L.objs.appendChild(g);
      this.restack();
    }
    g.innerHTML = '';
    g.setAttribute('class', 'wb-obj' + (o.kind ? ' k-' + o.kind : '') + (o.cls ? ' ' + o.cls : '') + (this.sel.has(o.id) ? ' sel' : '') + (o.locked ? ' locked' : '') + (o.move === false ? ' fixed' : '') + (o.inert ? ' inert' : ''));
    g.style.display = o.visible === false ? 'none' : '';
    g.style.opacity = o.opacity == null || o.opacity === 1 ? '' : o.opacity;
    if (o.fill) g.style.setProperty('--fill', o.fill); else g.style.removeProperty('--fill');
    const t = o.type && this.types[o.type];
    if (t && t.draw) t.draw(g, o, this);
    else {
      const sh = o.shape || {};
      const attrs = { class: 'wb-shape', fill: o.fill || '#8f9bff', stroke: o.stroke || 'rgba(0,0,0,.45)', 'stroke-width': o.sw == null ? 0.03 : o.sw, 'stroke-linejoin': 'round' };
      if (sh.circle) S('circle', Object.assign({ r: sh.circle }, attrs), g);
      else if (sh.path) S('path', Object.assign({ d: sh.path }, attrs), g);
      else S('path', Object.assign({ d: C.pathOf(this.localPoly(o)) }, attrs), g);
      if (o.label != null) {
        const lb = S('text', { class: 'wb-label', 'font-size': o.labelSize || 0.5, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        lb.textContent = o.label;
        if (o.flip) lb.setAttribute('transform', 'scale(-1 1)');
      }
    }
    if (o.hit) {
      const hp = typeof o.hit === 'number' ? null : o.hit;
      if (hp) S('path', { class: 'wb-hit', d: C.pathOf(hp), 'stroke-width': 0 }, g);
      else S('path', { class: 'wb-hit', d: C.pathOf(this.localPoly(o)), 'stroke-width': o.hit }, g);
    }
    this.place(o);
  };

  proto.place = function (o) {
    if (o.el) o.el.setAttribute('transform', G.svgTransform(o));
  };

  proto.update = function (o, props, redraw) {
    Object.assign(o, props);
    if (redraw) this.renderObj(o); else this.place(o);
    if (this.sel.has(o.id)) this.drawSel();
  };

  // bring pieces to the top quietly (no undo step): a lifted coin, a piece being dragged
  proto.raise = function (objs) {
    const ids = new Set(objs.map((o) => o.id));
    this.order = this.order.filter((id) => !ids.has(id)).concat(this.order.filter((id) => ids.has(id)));
    this.restack();
  };

  proto.restack = function () {
    this.order.forEach((id) => { const o = this.objs.get(id); if (o && o.el) this.L.objs.appendChild(o.el); });
  };

  /* ---------- selection ---------- */

  proto.select = function (list, add) {
    if (!add) this.sel.clear();
    (list || []).forEach((o) => {
      if (!o || o.locked) return;
      this.sel.add(o.id);
      if (o.group) this.objs.forEach((p) => { if (p.group === o.group) this.sel.add(p.id); });
    });
    this.objs.forEach((o) => o.el && o.el.classList.toggle('sel', this.sel.has(o.id)));
    this.drawSel();
    this.emit('select', this.selected());
  };
  proto.selected = function () { return this.order.filter((id) => this.sel.has(id)).map((id) => this.objs.get(id)); };

  proto.selBox = function () {
    const polys = this.selected().map((o) => this.worldPoly(o));
    return polys.length ? G.bbox(polys) : null;
  };

  proto.drawSel = function () {
    const L = this.L.sel;
    L.innerHTML = '';
    const sel = this.selected();
    this.drawCtx(sel);
    if (!sel.length || this.mode !== 'select' || this.opts.selectFrame === false) return;
    const b = this.selBox();
    const p = this.px(1);
    S('rect', { class: 'wb-selbox', x: b.x0 - 4 * p, y: b.y0 - 4 * p, width: b.w + 8 * p, height: b.h + 8 * p, 'stroke-width': 1.3 * p, 'stroke-dasharray': (5 * p) + ' ' + (4 * p) }, L);
    if (sel.some((o) => o.rotate)) {
      const hx = b.cx, hy = b.y0 - 26 * p;
      S('line', { class: 'wb-rotline', x1: hx, y1: b.y0 - 4 * p, x2: hx, y2: hy, 'stroke-width': 1.3 * p }, L);
      const h = S('circle', { class: 'wb-rothandle', cx: hx, cy: hy, r: 8 * p, 'stroke-width': 2 * p }, L);
      h.dataset.handle = 'rot';
      const a = S('path', { class: 'wb-rotglyph', d: 'M' + (hx - 4 * p) + ' ' + (hy + 1 * p) + 'a' + (4 * p) + ' ' + (4 * p) + ' 0 1 1 ' + (4 * p) + ' ' + (4 * p), 'stroke-width': 1.4 * p }, L);
      a.dataset.handle = 'rot';
    }
  };

  // the floating bar of actions above the selection
  proto.drawCtx = function (sel) {
    const bar = this.ctxbar;
    bar.innerHTML = '';
    if (!sel.length || this.mode !== 'select' || this.is3D || this.opts.ctxBar === false) { bar.classList.remove('show'); return; }
    const b = this.selBox();
    const add = (icon, title, fn, cls) => bar.appendChild(C.h('button.wb-cbtn' + (cls ? '.' + cls : ''), { type: 'button', title, 'aria-label': title, html: C.icon(icon), onclick: (e) => { e.stopPropagation(); fn(); } }));
    const canRot = sel.some((o) => o.rotate), canFlip = sel.some((o) => o.flipable);
    if (canRot) { add('rotl', 'Turn left (Shift+R)', () => this.rotateSel(-this.stepOf(sel))); add('rotr', 'Turn right (R)', () => this.rotateSel(this.stepOf(sel))); }
    if (canFlip) { add('flip', 'Turn over, left to right (X)', () => this.flipSel(false)); add('flipv', 'Turn over, top to bottom (Shift+F)', () => this.flipSel(true)); }
    if (this.opts.tools.includes('paint')) add('paint', 'Colour', () => this.colorPop());
    add('opacity', 'See-through: 100% / 55% / 25%', () => this.cycleOpacity());
    add('front', 'Bring to front (Shift+])', () => this.zorder('front'));
    add('back', 'Send to back (Shift+[)', () => this.zorder('back'));
    if (sel.length > 1 && !sel.every((o) => o.group && o.group === sel[0].group)) add('group', 'Group: move them together (Ctrl+G)', () => this.groupSel());
    if (sel.some((o) => o.group)) add('ungroup', 'Ungroup (Ctrl+Shift+G)', () => this.ungroupSel());
    this.ctxActions.forEach((a) => { if (!a.when || a.when(sel)) add(a.icon, a.title, () => a.run(sel, this)); });
    if (sel.every((o) => o.remove)) add('trash', 'Take away (Delete)', () => this.deleteSel(), 'danger');
    const s0 = this.toScreen([b.cx, b.y0]);
    const sz = this.size();
    bar.classList.add('show');
    const w = bar.offsetWidth || 200;
    let x = Math.max(6, Math.min(sz.w - w - 6, s0[0] - w / 2));
    let y = s0[1] - 88;
    if (y < 6) { const s1 = this.toScreen([b.cx, b.y1]); y = Math.min(sz.h - 50, s1[1] + 16); }
    bar.style.left = x + 'px';
    bar.style.top = y + 'px';
  };

  proto.stepOf = function (sel) {
    let st = 0;
    sel.forEach((o) => { if (o.rotate) { const s = o.rotate === true ? this.opts.rotStep : o.rotate; st = st ? Math.min(st, s) : s; } });
    return st || this.opts.rotStep;
  };

  proto.colorPop = function () {
    const pop = this.pop;
    pop.innerHTML = '';
    pop.hidden = false;
    pop.appendChild(C.h('div.wb-pop-title', 'Colour of the selected pieces'));
    const grid = C.h('div.wb-swatches');
    PALETTE.forEach((c) => grid.appendChild(C.h('button.wb-sw', { type: 'button', style: { background: c }, title: this.legend[c] || c, onclick: () => { this.setFill(this.selected(), c); } })));
    grid.appendChild(C.h('button.wb-sw.clear', { type: 'button', title: 'Back to the original colour', onclick: () => this.setFill(this.selected(), null) }, '×'));
    pop.appendChild(grid);
    pop.appendChild(C.h('button.wb-pop-close', { type: 'button', title: 'Close', html: C.icon('close'), onclick: () => this.closePop() }));
  };

  proto.setFill = function (objs, c) {
    objs.forEach((o) => {
      if (o.origFill === undefined) o.origFill = o.fill || null;
      o.fill = c == null ? o.origFill : c;
      this.renderObj(o);
    });
    this.drawLegend();
    this.emit('change', { why: 'colour', objs });
  };

  proto.cycleOpacity = function () {
    const sel = this.selected();
    if (!sel.length) return;
    const cur = sel[0].opacity == null ? 1 : sel[0].opacity;
    const next = cur > 0.8 ? 0.55 : cur > 0.4 ? 0.25 : 1;
    sel.forEach((o) => { o.opacity = next; this.renderObj(o); });
    this.toast('See-through ' + Math.round(next * 100) + '%');
    this.emit('change', { why: 'opacity', objs: sel });
  };

  proto.setOpacity = function (o, v) { o.opacity = v; this.renderObj(o); this.emit('change', { why: 'opacity', objs: [o] }); };
  proto.setVisible = function (o, v) { o.visible = v; if (!v) this.sel.delete(o.id); this.renderObj(o); this.drawSel(); this.emit('change', { why: 'visible', objs: [o] }); };
  proto.setLocked = function (o, v) { o.locked = v; if (v) this.sel.delete(o.id); this.renderObj(o); this.drawSel(); this.emit('change', { why: 'lock', objs: [o] }); };

  proto.zorder = function (how, objs) {
    objs = objs || this.selected();
    if (!objs.length) return;
    const ids = new Set(objs.map((o) => o.id));
    let order = this.order.slice();
    if (how === 'front') order = order.filter((id) => !ids.has(id)).concat(order.filter((id) => ids.has(id)));
    else if (how === 'back') order = order.filter((id) => ids.has(id)).concat(order.filter((id) => !ids.has(id)));
    else if (how === 'forward') {
      for (let i = order.length - 2; i >= 0; i--) if (ids.has(order[i]) && !ids.has(order[i + 1])) { const t = order[i]; order[i] = order[i + 1]; order[i + 1] = t; }
    } else if (how === 'backward') {
      for (let i = 1; i < order.length; i++) if (ids.has(order[i]) && !ids.has(order[i - 1])) { const t = order[i]; order[i] = order[i - 1]; order[i - 1] = t; }
    }
    this.order = order;
    this.restack();
    this.emit('change', { why: 'order', objs });
  };

  proto.groupSel = function () {
    const sel = this.selected();
    if (sel.length < 2) return;
    const gid = 'g' + (++this.seq);
    sel.forEach((o) => { o.group = gid; });
    this.toast('Grouped ' + sel.length + ' pieces: they now move together');
    this.drawSel();
    this.emit('change', { why: 'group', objs: sel });
  };
  proto.ungroupSel = function () {
    const sel = this.selected();
    sel.forEach((o) => { o.group = null; });
    this.drawSel();
    this.emit('change', { why: 'group', objs: sel });
  };

  proto.deleteSel = function () {
    const sel = this.selected().filter((o) => o.remove);
    if (!sel.length) return;
    if (this.handlers.remove && this.handlers.remove(sel) === true) return;
    sel.forEach((o) => this.remove(o));
    this.emit('change', { why: 'remove', objs: sel });
  };

  proto.rotateSel = function (deg, objs) {
    objs = (objs || this.selected()).filter((o) => o.rotate && !o.locked);
    if (!objs.length) return;
    const b = G.bbox(objs.map((o) => this.worldPoly(o)));
    const c = objs.length === 1 && objs[0].pivot !== 'bbox' ? [objs[0].x, objs[0].y] : [b.cx, b.cy];
    objs.forEach((o) => {
      const p = G.rot([o.x, o.y], deg, c);
      o.x = p[0]; o.y = p[1];
      o.rot = G.normDeg((o.rot || 0) + deg);
      this.place(o);
    });
    this.afterMove(objs, 'rotate');
  };

  proto.flipSel = function (vertical, objs) {
    objs = (objs || this.selected()).filter((o) => o.flipable && !o.locked);
    if (!objs.length) return;
    const b = G.bbox(objs.map((o) => this.worldPoly(o)));
    objs.forEach((o) => {
      if (vertical) { o.y = objs.length === 1 ? o.y : 2 * b.cy - o.y; o.rot = G.normDeg(180 - (o.rot || 0)); }
      else { o.x = objs.length === 1 ? o.x : 2 * b.cx - o.x; o.rot = G.normDeg(-(o.rot || 0)); }
      o.flip = !o.flip;
      this.renderObj(o);
    });
    this.afterMove(objs, 'flip');
  };

  // after a move: let the engine settle positions (snap), redraw, report
  proto.afterMove = function (objs, why) {
    const r = this.handlers.settle ? this.handlers.settle(objs, why) : null;
    objs.forEach((o) => this.place(o));
    this.drawSel();
    if (r === false) return; // nothing really changed
    this.emit('change', { why, objs });
  };

  /* ---------- snapping ---------- */

  // candidate points other pieces offer to snap onto
  proto.snapPoints = function (except) {
    const pts = [];
    if (this.opts.vertexSnap) {
      this.objs.forEach((o) => {
        if (except.has(o.id) || o.visible === false || o.snapTo === false) return;
        this.worldPoly(o).forEach((p) => pts.push(p));
      });
    }
    if (this.handlers.snapTargets) this.handlers.snapTargets().forEach((p) => pts.push(p));
    return pts;
  };

  // snap a dragged set: returns the correction [dx, dy] to apply
  proto.snapDelta = function (objs, at) {
    const tol = this.px(this.opts.snapPx);
    const except = new Set(objs.map((o) => o.id));
    const targets = this.snapPoints(except);
    if (!targets.length) return [0, 0];
    let best = null, bd = tol * tol;
    objs.forEach((o) => {
      const t = at.get(o.id);
      this.worldPoly(o, Object.assign({}, o, t)).forEach((p) => {
        for (const q of targets) {
          const d = G.dist2(p, q);
          if (d < bd) { bd = d; best = [q[0] - p[0], q[1] - p[1]]; }
        }
      });
    });
    return best || [0, 0];
  };

  /* ---------- pointer input ---------- */

  proto.bindEvents = function () {
    const svg = this.svg;
    svg.addEventListener('pointerdown', (ev) => this.down(ev));
    svg.addEventListener('pointermove', (ev) => this.move(ev));
    svg.addEventListener('pointerup', (ev) => this.up(ev));
    svg.addEventListener('pointercancel', (ev) => this.up(ev, true));
    svg.addEventListener('contextmenu', (ev) => ev.preventDefault());
    // (a double-click is detected in up(): with pointer capture the browser's dblclick lands on the svg itself)
    svg.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      const sel = this.selected();
      if (ev.shiftKey && sel.some((o) => o.rotate) && this.mode === 'select') {
        this.rotateSel((ev.deltaY > 0 ? 1 : -1) * this.stepOf(sel));
        return;
      }
      const r = svg.getBoundingClientRect();
      const f = Math.exp(-(ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY) * 0.0015);
      this.zoomAt(f, ev.clientX - r.left, ev.clientY - r.top);
    }, { passive: false });
    svg.addEventListener('pointerleave', () => { if (this.loupeOn) this.loupe.style.opacity = 0; });
    svg.addEventListener('pointerenter', () => { if (this.loupeOn) this.loupe.style.opacity = 1; });
  };

  proto.objAt = function (ev, target) {
    const t = target || ev.target;
    const el = t && t.closest ? t.closest('.wb-obj') : null;
    if (!el) return null;
    const o = this.objs.get(el.dataset.id);
    return o && o.visible !== false ? o : null;
  };

  proto.down = function (ev) {
    const svg = this.svg;
    this.closePop();
    const r = svg.getBoundingClientRect();
    const sp = [ev.clientX - r.left, ev.clientY - r.top];
    this.pointers.set(ev.pointerId, sp);
    try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    if (this.pointers.size === 2) { // pinch
      const [a, b] = Array.from(this.pointers.values());
      this.gesture = { kind: 'pinch', d: Math.hypot(a[0] - b[0], a[1] - b[1]), c: G.mid(a, b), v: Object.assign({}, this.v) };
      this.L.live.innerHTML = '';
      return;
    }
    if (this.pointers.size > 2) return;
    const pt = this.toWorld(ev.clientX, ev.clientY);
    const touch = ev.pointerType === 'touch';
    const panButton = ev.button === 1 || ev.button === 2 || this.spaceDown;
    const m = this.mode;
    // a right press on the table goes to the engine first (cross out a cell…); unwanted, it pans
    if (ev.button === 2 && m === 'select' && !this.spaceDown && this.handlers.board && this.handlers.board.down && !this.objAt(ev) &&
        this.handlers.board.down(pt, ev, ev.target) === true) { this.gesture = { kind: 'board' }; return; }
    if (panButton || m === 'pan') { this.gesture = { kind: 'pan', s: sp, v: Object.assign({}, this.v) }; this.host.classList.add('panning'); return; }

    if (m === 'select') {
      const handle = ev.target.dataset && ev.target.dataset.handle;
      if (handle === 'rot') {
        const objs = this.selected().filter((o) => o.rotate && !o.locked);
        const b = this.selBox();
        const c = objs.length === 1 && objs[0].pivot !== 'bbox' ? [objs[0].x, objs[0].y] : [b.cx, b.cy];
        this.gesture = { kind: 'rotate', objs, c, a0: G.angle(G.sub(pt, c)), start: new Map(objs.map((o) => [o.id, { x: o.x, y: o.y, rot: o.rot }])) };
        return;
      }
      const o = this.objAt(ev);
      if (o && !o.locked) {
        if (!this.sel.has(o.id)) this.select([o], ev.shiftKey || ev.ctrlKey || ev.metaKey);
        else if (ev.shiftKey) { this.sel.delete(o.id); this.select(this.selected()); return; }
        const objs = (this.opts.singleDrag ? [o] : this.selected()).filter((q) => q.move !== false && !q.locked);
        this.gesture = { kind: 'drag', o, objs, p0: pt, moved: false, start: new Map(objs.map((q) => [q.id, { x: q.x, y: q.y, rot: q.rot }])) };
        // the engine may refuse the drag (an animation is running…)
        if (this.handlers.pick && this.handlers.pick(o, objs) === false) { this.gesture = null; return; }
        return;
      }
      if (this.handlers.board && this.handlers.board.down && this.handlers.board.down(pt, ev, ev.target) === true) {
        const g = this.gesture = { kind: 'board', s: sp };
        // a long press on a touch screen still reaches the engine when down() took the press
        if (touch && this.handlers.board.longpress) {
          g.longT = setTimeout(() => {
            if (this.gesture !== g || g.movedFar) return;
            this.gesture = null;
            this.pointers.delete(ev.pointerId);
            if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { /* no buzz */ }
            this.handlers.board.longpress(pt, ev, ev.target, { captured: true });
          }, 480);
        }
        return;
      }
      if (touch) {
        this.select([]);
        const g = this.gesture = { kind: 'pan', s: sp, v: Object.assign({}, this.v), tap: pt, el: ev.target };
        // a long press (no movement) is the touch screen's right click
        if (this.handlers.board && this.handlers.board.longpress) {
          g.longT = setTimeout(() => {
            if (this.gesture !== g || !g.tap) return;
            g.tap = null;
            this.gesture = null;
            this.pointers.delete(ev.pointerId);
            if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { /* no buzz */ }
            this.handlers.board.longpress(pt, ev, ev.target);
          }, 480);
        }
        return;
      }
      this.gesture = { kind: 'lasso', p0: pt, add: ev.shiftKey, el: ev.target };
      return;
    }
    // the stroke starts before the first dab, so the whole stroke is one undo step
    if (m === 'paint') { this.gesture = { kind: 'paint' }; this.paintAt(ev, pt); return; }
    if (m === 'pen' || m === 'marker') {
      const w = m === 'marker' ? this.px(18) : this.px(2.6);
      const stroke = { id: 'm' + (++this.seq), kind: m, color: this.penColor, w: +w.toFixed(4), pts: [pt.map((v) => +v.toFixed(3))] };
      this.gesture = { kind: 'ink', stroke, el: this.drawStroke(stroke) };
      return;
    }
    if (m === 'eraser') { this.gesture = { kind: 'erase', hit: false }; this.eraseAt(pt); return; }
    if (m === 'note') { this.addNote(pt); this.setMode('select'); return; }
    if (m === 'cut') { const a = this.snapTool(pt); this.gesture = { kind: 'cut', a, b: a }; return; }
    if (m === 'fold') { const a = this.snapTool(pt); this.gesture = { kind: 'fold', a, b: a, crease: ev.shiftKey }; return; }
    const mode = this.modes[m];
    if (mode && mode.down) {
      if (mode.down(pt, ev, ev.target) === true) this.gesture = { kind: 'mode', mode };
      else if (touch) this.gesture = { kind: 'pan', s: sp, v: Object.assign({}, this.v) };
    }
  };

  proto.move = function (ev) {
    const r = this.svg.getBoundingClientRect();
    const sp = [ev.clientX - r.left, ev.clientY - r.top];
    if (this.loupeOn) this.moveLoupe(sp);
    if (!this.pointers.has(ev.pointerId)) {
      const mode = this.modes[this.mode];
      if (mode && mode.hover) mode.hover(this.toWorld(ev.clientX, ev.clientY), ev);
      else if (this.mode === 'select' && this.handlers.board && this.handlers.board.hover) this.handlers.board.hover(this.toWorld(ev.clientX, ev.clientY), ev, ev.target);
      if (this.handlers.hover) this.handlers.hover(this.toWorld(ev.clientX, ev.clientY), ev, this.mode);
      return;
    }
    this.pointers.set(ev.pointerId, sp);
    const g = this.gesture;
    if (!g) return;
    const pt = this.toWorld(ev.clientX, ev.clientY);
    switch (g.kind) {
      case 'pinch': {
        if (this.pointers.size < 2) return;
        const [a, b] = Array.from(this.pointers.values());
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]), c = G.mid(a, b);
        const fk = this.fitK || g.v.k;
        const k2 = Math.max(fk / 6, Math.min(fk * 14, g.v.k * d / Math.max(10, g.d)));
        this.v.k = k2;
        this.v.x = c[0] - (g.c[0] - g.v.x) * k2 / g.v.k;
        this.v.y = c[1] - (g.c[1] - g.v.y) * k2 / g.v.k;
        this.applyView();
        return;
      }
      case 'pan':
        if (g.tap && Math.hypot(sp[0] - g.s[0], sp[1] - g.s[1]) > 6) { g.tap = null; clearTimeout(g.longT); }
        this.userView = true;
        this.v.x = g.v.x + sp[0] - g.s[0];
        this.v.y = g.v.y + sp[1] - g.s[1];
        this.applyView();
        return;
      case 'drag': {
        const dx = pt[0] - g.p0[0], dy = pt[1] - g.p0[1];
        if (!g.moved && Math.hypot(dx, dy) < this.px(3)) return;
        if (!g.moved) { g.moved = true; g.objs.forEach((o) => o.el && o.el.classList.add('drag')); this.ctxbar.classList.remove('show'); }
        const at = new Map();
        g.objs.forEach((o) => {
          const s = g.start.get(o.id);
          at.set(o.id, { x: s.x + (o.move === 'y' ? 0 : dx), y: s.y + (o.move === 'x' ? 0 : dy), rot: s.rot });
        });
        let corr = [0, 0];
        const lead = at.get(g.o.id);
        if (lead && g.o.snap && this.handlers.snap) {
          const want = this.handlers.snap(g.o, lead, g.objs);
          if (want) {
            corr = [want.x - lead.x, want.y - lead.y];
            if (want.rot != null && want.rot !== g.o.rot) { g.o.rot = want.rot; }
          }
        } else if (this.opts.grid && lead) {
          const gs = this.opts.grid, off = this.opts.gridOffset || [0, 0];
          corr = [Math.round((lead.x - off[0]) / gs) * gs + off[0] - lead.x, Math.round((lead.y - off[1]) / gs) * gs + off[1] - lead.y];
        } else if ((this.opts.vertexSnap || this.handlers.snapTargets) && !this.opts.snapOnDrop) corr = this.snapDelta(g.objs, at);
        g.snapped = corr[0] !== 0 || corr[1] !== 0;
        g.objs.forEach((o) => {
          const t = at.get(o.id);
          o.x = t.x + corr[0]; o.y = t.y + corr[1];
          this.place(o);
        });
        this.drawSel();
        if (this.handlers.dragging) this.handlers.dragging(g.objs);
        return;
      }
      case 'rotate': {
        const a = G.angle(G.sub(pt, g.c));
        let d = a - g.a0;
        const step = ev.altKey ? 1 : this.stepOf(g.objs);
        d = G.snapDeg(d, step);
        g.objs.forEach((o) => {
          const s = g.start.get(o.id);
          const p = G.rot([s.x, s.y], d, g.c);
          o.x = p[0]; o.y = p[1]; o.rot = G.normDeg((s.rot || 0) + d);
          this.place(o);
        });
        g.moved = true;
        this.drawSel();
        return;
      }
      case 'lasso': {
        const x0 = Math.min(g.p0[0], pt[0]), y0 = Math.min(g.p0[1], pt[1]);
        this.L.live.innerHTML = '';
        S('rect', { class: 'wb-lasso', x: x0, y: y0, width: Math.abs(pt[0] - g.p0[0]), height: Math.abs(pt[1] - g.p0[1]), 'stroke-width': this.px(1.2) }, this.L.live);
        g.p1 = pt;
        return;
      }
      case 'ink': {
        const last = g.stroke.pts[g.stroke.pts.length - 1];
        if (G.dist(last, pt) < this.px(1.5)) return;
        g.stroke.pts.push(pt.map((v) => +v.toFixed(3)));
        g.el.setAttribute('d', strokePath(g.stroke.pts));
        return;
      }
      case 'erase': this.eraseAt(pt); return;
      case 'paint': this.paintAt(ev, pt, true); return;
      case 'cut':
      case 'fold': {
        let b = this.snapTool(pt);
        if (ev.shiftKey && g.kind === 'cut') b = angleSnap(g.a, b, 15);
        if (this.handlers.toolPoint) b = this.handlers.toolPoint(b, g, ev) || b;
        g.b = b;
        if (!(this.handlers.toolPreview && this.handlers.toolPreview(g, this) === true)) this.drawToolLine(g);
        return;
      }
      case 'board':
        if (g.s && !g.movedFar && Math.hypot(sp[0] - g.s[0], sp[1] - g.s[1]) > 6) { g.movedFar = true; clearTimeout(g.longT); }
        if (this.handlers.board.move) this.handlers.board.move(pt, ev);
        return;
      case 'mode': if (g.mode.move) g.mode.move(pt, ev); return;
      default:
    }
  };

  proto.up = function (ev, cancelled) {
    if (!this.pointers.has(ev.pointerId)) return;
    this.pointers.delete(ev.pointerId);
    const g = this.gesture;
    if (!g) return;
    if (g.kind === 'pinch') { if (this.pointers.size === 0) this.gesture = null; return; }
    this.gesture = null;
    this.host.classList.remove('panning');
    const pt = this.toWorld(ev.clientX, ev.clientY);
    switch (g.kind) {
      case 'pan':
        clearTimeout(g.longT);
        if (g.tap && !cancelled) { // a touch tap on the board
          if (this.handlers.board && this.handlers.board.tap) this.handlers.board.tap(g.tap, ev, g.el);
          this.emit('tapboard', { pt: g.tap, ev, el: g.el });
        }
        return;
      case 'drag':
        g.objs.forEach((o) => o.el && o.el.classList.remove('drag'));
        if (g.moved && !cancelled) {
          if (this.opts.snapOnDrop && (this.opts.vertexSnap || this.handlers.snapTargets)) {
            const at = new Map(g.objs.map((o) => [o.id, { x: o.x, y: o.y, rot: o.rot }]));
            const corr = this.snapDelta(g.objs, at);
            if (corr[0] || corr[1]) {
              g.snapped = true;
              const from = g.objs.map((o) => [o.x, o.y]);
              C.tween(C.anim(120), (t) => {
                g.objs.forEach((o, i) => { o.x = from[i][0] + corr[0] * t; o.y = from[i][1] + corr[1] * t; this.place(o); });
              }, () => { if (C.sfx) C.sfx('snap'); this.afterMove(g.objs, 'move'); });
              return;
            }
          }
          if (g.snapped && C.sfx) C.sfx('snap');
          this.afterMove(g.objs, 'move');
        } else if (!cancelled) {
          this.drawSel();
          this.emit('tap', { obj: g.o, pt, ev });
          const now = Date.now();
          if (this.lastTap && this.lastTap.id === g.o.id && now - this.lastTap.t < 350) {
            this.lastTap = null;
            this.emit('dbltap', { obj: g.o, pt, ev });
          } else this.lastTap = { id: g.o.id, t: now };
        }
        return;
      case 'rotate':
        if (g.moved) this.afterMove(g.objs, 'rotate');
        return;
      case 'lasso': {
        this.L.live.innerHTML = '';
        if (!g.p1 || G.dist(g.p0, g.p1) < this.px(4)) {
          this.select([]);
          if (this.handlers.board && this.handlers.board.tap) this.handlers.board.tap(g.p0, ev, g.el);
          this.emit('tapboard', { pt: g.p0, ev, el: g.el });
          return;
        }
        const box = G.bbox([[g.p0, g.p1]]);
        const hit = this.all().filter((o) => {
          if (o.locked || o.visible === false) return false;
          const b = G.bbox([this.worldPoly(o)]);
          return b.x0 >= box.x0 && b.x1 <= box.x1 && b.y0 >= box.y0 && b.y1 <= box.y1;
        });
        this.select(hit, g.add);
        return;
      }
      case 'ink':
        if (g.stroke.pts.length === 1) g.stroke.pts.push([g.stroke.pts[0][0] + 0.001, g.stroke.pts[0][1]]);
        this.marks.push(g.stroke);
        g.el.setAttribute('d', strokePath(g.stroke.pts));
        this.emit('change', { why: 'ink' });
        return;
      case 'erase':
        if (g.hit) this.emit('change', { why: 'erase' });
        return;
      case 'paint':
        if (g.painted) this.emit('change', { why: 'paint' });
        this.drawLegend();
        return;
      case 'cut':
        this.L.live.innerHTML = '';
        if (!cancelled && G.dist(g.a, g.b) > this.px(10)) this.doCut(g.a, g.b);
        return;
      case 'fold':
        this.L.live.innerHTML = '';
        if (!cancelled && G.dist(g.a, g.b) > this.px(10)) this.doFold(g);
        return;
      case 'board': clearTimeout(g.longT); if (this.handlers.board.up) this.handlers.board.up(pt, ev); return;
      case 'mode': if (g.mode.up) g.mode.up(pt, ev); return;
      default:
    }
  };

  proto.cancelGesture = function () {
    this.gesture = null;
    this.L.live.innerHTML = '';
  };

  proto.moveLoupe = function (sp) {
    const z = 2.6;
    this.loupe.style.opacity = 1;
    this.loupeUse.setAttribute('transform', 'translate(' + sp[0] + ' ' + sp[1] + ') scale(' + z + ') translate(' + (-sp[0]) + ' ' + (-sp[1]) + ')');
    this.loupeClip.setAttribute('cx', sp[0]);
    this.loupeClip.setAttribute('cy', sp[1]);
    this.loupeBack.setAttribute('cx', sp[0]);
    this.loupeBack.setAttribute('cy', sp[1]);
    this.loupeRing.setAttribute('cx', sp[0]);
    this.loupeRing.setAttribute('cy', sp[1]);
  };

  /* ---------- ink, eraser, paint ---------- */

  function strokePath(pts) {
    if (pts.length < 3) return 'M' + pts.map((p) => p[0] + ' ' + p[1]).join('L');
    let d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (let i = 1; i < pts.length - 1; i++) {
      const m = G.mid(pts[i], pts[i + 1]);
      d += 'Q' + pts[i][0] + ' ' + pts[i][1] + ' ' + C.fmtNum(m[0]) + ' ' + C.fmtNum(m[1]);
    }
    const l = pts[pts.length - 1];
    return d + 'L' + l[0] + ' ' + l[1];
  }

  proto.drawStroke = function (st) {
    const el = S('path', { class: 'wb-ink ' + st.kind, d: strokePath(st.pts), stroke: st.color, 'stroke-width': st.w }, this.L.marks);
    el.dataset.mid = st.id;
    return el;
  };
  proto.redrawMarks = function () {
    this.L.marks.innerHTML = '';
    this.marks.forEach((st) => this.drawStroke(st));
  };

  proto.eraseAt = function (pt) {
    const tol = this.px(10);
    const keep = [];
    let hit = false;
    this.marks.forEach((st) => {
      let near = false;
      for (let i = 0; i < st.pts.length - 1 && !near; i++) if (G.segDist(pt, st.pts[i], st.pts[i + 1]) < tol + st.w / 2) near = true;
      if (st.pts.length === 1 && G.dist(pt, st.pts[0]) < tol) near = true;
      if (near) hit = true; else keep.push(st);
    });
    if (hit) {
      this.marks = keep;
      this.redrawMarks();
      if (this.gesture) this.gesture.hit = true;
    }
  };

  proto.paintAt = function (ev, pt, dragging) {
    // while dragging, the pointer is captured by the stage: find what is really under it
    const target = dragging && root.document.elementFromPoint ? (root.document.elementFromPoint(ev.clientX, ev.clientY) || ev.target) : ev.target;
    const clear = ev.altKey || !this.paintColor;
    const o = this.objAt(ev, target);
    const g = this.gesture;
    if (o && o.paint !== false) {
      if (dragging && g && g.last === o.id) return;
      if (g) g.last = o.id;
      if (o.origFill === undefined) o.origFill = o.fill || null;
      o.fill = clear ? o.origFill : this.paintColor;
      this.renderObj(o);
      if (g) g.painted = true; else this.emit('change', { why: 'paint' });
      return;
    }
    const el = target && target.closest ? target.closest('[data-key]') : null;
    if (el) {
      const key = el.dataset.key;
      if (dragging && g && g.last === key) return;
      if (g) g.last = key;
      if (clear) delete this.paints[key]; else this.paints[key] = this.paintColor;
      this.applyPaints();
      if (g) g.painted = true;
    }
  };

  /* ---------- sticky notes ---------- */

  proto.addNote = function (pt, text, color) {
    const n = { id: 'n' + (++this.seq), x: +pt[0].toFixed(3), y: +pt[1].toFixed(3), w: +this.px(190).toFixed(3), h: +this.px(120).toFixed(3), text: text || '', color: color || '#ffd166' };
    this.notes.push(n);
    this.drawNote(n, true);
    this.emit('change', { why: 'note' });
    return n;
  };

  proto.drawNote = function (n, focus) {
    const fo = S('foreignObject', { x: n.x, y: n.y, width: n.w, height: n.h, class: 'wb-note-fo' }, this.L.notes);
    const scale = n.w / 190; // notes keep the size they were made at
    const box = C.h('div.wb-note', { style: { background: n.color, width: '190px', height: '120px', transform: 'scale(' + scale + ')', transformOrigin: '0 0' } });
    const head = C.h('div.wb-note-head');
    const colors = ['#ffd166', '#9be7c4', '#a9b4ff', '#ffb3c7'];
    colors.forEach((c) => head.appendChild(C.h('i', { style: { background: c }, title: 'Note colour', onpointerdown: (e) => { e.stopPropagation(); n.color = c; box.style.background = c; this.emit('change', { why: 'note' }); } })));
    head.appendChild(C.h('button', { type: 'button', title: 'Throw the note away', html: '×', onpointerdown: (e) => e.stopPropagation(), onclick: () => {
      this.notes = this.notes.filter((q) => q !== n); fo.remove(); this.emit('change', { why: 'note' });
    } }));
    const ta = C.h('textarea', { placeholder: 'Write here…', spellcheck: 'false' });
    ta.value = n.text;
    ta.addEventListener('input', () => { n.text = ta.value; });
    ta.addEventListener('change', () => this.emit('change', { why: 'note' }));
    ta.addEventListener('pointerdown', (e) => e.stopPropagation());
    ta.addEventListener('keydown', (e) => e.stopPropagation());
    box.append(head, ta);
    fo.appendChild(box);
    // drag the note by its head
    head.addEventListener('pointerdown', (e) => {
      if (e.target !== head) return;
      e.stopPropagation();
      head.setPointerCapture(e.pointerId);
      const p0 = this.toWorld(e.clientX, e.clientY), x0 = n.x, y0 = n.y;
      const mv = (ev) => {
        const p = this.toWorld(ev.clientX, ev.clientY);
        n.x = +(x0 + p[0] - p0[0]).toFixed(3); n.y = +(y0 + p[1] - p0[1]).toFixed(3);
        fo.setAttribute('x', n.x); fo.setAttribute('y', n.y);
      };
      const upH = () => { head.removeEventListener('pointermove', mv); head.removeEventListener('pointerup', upH); this.emit('change', { why: 'note' }); };
      head.addEventListener('pointermove', mv);
      head.addEventListener('pointerup', upH);
    });
    if (focus) setTimeout(() => ta.focus(), 30);
  };
  proto.redrawNotes = function () {
    this.L.notes.innerHTML = '';
    this.notes.forEach((n) => this.drawNote(n));
  };

  /* ---------- knife and fold ---------- */

  // snap a cut or fold point to piece corners, edge midpoints, targets and the grid
  proto.snapTool = function (pt) {
    const tol = this.px(this.opts.snapPx);
    let best = null, bd = tol * tol;
    const consider = (q) => { const d = G.dist2(pt, q); if (d < bd) { bd = d; best = q; } };
    this.objs.forEach((o) => {
      if (o.visible === false) return;
      const wp = this.worldPoly(o);
      wp.forEach((p, i) => { consider(p); consider(G.mid(p, wp[(i + 1) % wp.length])); });
    });
    if (this.handlers.toolSnap) this.handlers.toolSnap().forEach(consider);
    if (this.opts.toolGrid) {
      const gs = this.opts.toolGrid;
      consider([Math.round(pt[0] / gs) * gs, Math.round(pt[1] / gs) * gs]);
    }
    return best ? best.slice() : pt;
  };

  function angleSnap(a, b, step) {
    const d = G.dist(a, b), ang = G.snapDeg(G.angle(G.sub(b, a)), step) * Math.PI / 180;
    return [a[0] + Math.cos(ang) * d, a[1] + Math.sin(ang) * d];
  }

  proto.foldLine = function (g) {
    if (g.crease) return { a: g.a, b: g.b, side: 0 };
    // bring point a onto point b: the crease is the perpendicular bisector
    const m = G.mid(g.a, g.b), d = G.perp(G.norm(G.sub(g.b, g.a)));
    const a = G.add(m, G.mul(d, -1000)), b = G.add(m, G.mul(d, 1000));
    return { a, b, side: G.side(g.a, a, b) > 0 ? 1 : -1, from: g.a, to: g.b };
  };

  proto.drawToolLine = function (g) {
    const L = this.L.live;
    L.innerHTML = '';
    const p = this.px(1);
    if (g.kind === 'cut') {
      S('line', { class: 'wb-knife', x1: g.a[0], y1: g.a[1], x2: g.b[0], y2: g.b[1], 'stroke-width': 2 * p, 'stroke-dasharray': (7 * p) + ' ' + (5 * p) }, L);
      S('circle', { class: 'wb-knife-end', cx: g.a[0], cy: g.a[1], r: 3.5 * p }, L);
      return;
    }
    const f = this.foldLine(g);
    const bb = this.bounds, big = Math.max(bb.x1 - bb.x0, bb.y1 - bb.y0) * 3;
    const dir = G.norm(G.sub(f.b, f.a)), mid = g.crease ? G.mid(f.a, f.b) : G.mid(g.a, g.b);
    const la = G.add(mid, G.mul(dir, -big)), lb = G.add(mid, G.mul(dir, big));
    if (!g.crease) {
      S('line', { class: 'wb-foldarrow', x1: g.a[0], y1: g.a[1], x2: g.b[0], y2: g.b[1], 'stroke-width': 1.6 * p, 'stroke-dasharray': (3 * p) + ' ' + (4 * p) }, L);
      S('circle', { class: 'wb-knife-end', cx: g.a[0], cy: g.a[1], r: 4 * p }, L);
      // shade the side that will move
      const n = G.perp(dir);
      const s = f.side;
      const q1 = G.add(la, G.mul(n, s * big)), q2 = G.add(lb, G.mul(n, s * big));
      S('path', { class: 'wb-foldshade', d: C.pathOf([la, lb, q2, q1]) }, L);
    }
    S('line', { class: 'wb-crease', x1: la[0], y1: la[1], x2: lb[0], y2: lb[1], 'stroke-width': 2 * p, 'stroke-dasharray': (10 * p) + ' ' + (4 * p) + ' ' + (2 * p) + ' ' + (4 * p) }, L);
  };

  proto.doCut = function (a, b) {
    if (this.handlers.cut) {
      const r = this.handlers.cut(a, b);
      if (r !== false) { this.stats.cuts++; return; }
    }
    const seg = this.opts.cutMode !== 'line';
    let targets = this.selected().filter((o) => o.cut);
    if (!targets.length) targets = this.all().filter((o) => o.cut && o.visible !== false && !o.locked);
    const made = [];
    targets.forEach((o) => {
      const wp = this.worldPoly(o);
      const pieces = G.splitPoly(wp, a, b, { segment: seg, reach: this.px(2) });
      if (!pieces) return;
      const size = G.bbox([wp]);
      const nudge = Math.max(size.w, size.h) * 0.015;
      const n = G.perp(G.norm(G.sub(b, a)));
      const idx = this.order.indexOf(o.id);
      this.remove(o);
      pieces.forEach((pc, i) => {
        const c = G.centroid(pc.poly);
        const shift = G.mul(n, pc.side * nudge);
        const spec = {
          kind: o.kind, cls: o.cls, fill: o.fill, stroke: o.stroke, sw: o.sw, opacity: o.opacity,
          move: o.move, rotate: o.rotate, flipable: o.flipable, cut: o.cut, fold: o.fold, remove: o.remove, snap: o.snap,
          shape: { poly: pc.poly.map((p) => G.round([p[0] - c[0], p[1] - c[1]], 1e6)) },
          x: c[0] + shift[0], y: c[1] + shift[1], rot: 0, flip: false,
          data: Object.assign(C.clone(o.data) || {}, { from: o.id, piece: i })
        };
        const no = this.add(spec);
        // keep the stacking position of the piece that was cut
        this.order = this.order.filter((id) => id !== no.id);
        this.order.splice(Math.min(idx + i, this.order.length), 0, no.id);
        made.push(no);
      });
    });
    this.restack();
    if (!made.length) { this.toast('The knife met nothing to cut'); return; }
    this.stats.cuts++;
    if (C.sfx) C.sfx('cut');
    this.select([]);
    this.emit('change', { why: 'cut', objs: made, line: [a, b] });
  };

  proto.doFold = function (g) {
    const f = this.foldLine(g);
    if (this.handlers.fold) {
      const r = this.handlers.fold(f);
      if (r !== false) { this.stats.folds++; if (C.sfx) C.sfx('fold'); return; }
      this.toast('Nothing to fold there');
      return;
    }
    // simple default: the foldable pieces are split and the moving part mirrored on top.
    // Which pieces: the selected ones, else the ones under the point that was grabbed, else all.
    let targets = this.selected().filter((o) => o.fold);
    if (!targets.length && f.from) targets = this.all().filter((o) => o.fold && o.visible !== false && G.pointInPoly(f.from, this.worldPoly(o)));
    if (!targets.length) targets = this.all().filter((o) => o.fold && o.visible !== false);
    let side = f.side;
    if (!side) {
      let l = 0, r = 0;
      targets.forEach((o) => {
        const parts = G.splitPoly(this.worldPoly(o), f.a, f.b) || [{ poly: this.worldPoly(o), side: G.side(G.centroid(this.worldPoly(o)), f.a, f.b) > 0 ? 1 : -1 }];
        parts.forEach((pc) => { if (pc.side > 0) l += G.absArea(pc.poly); else r += G.absArea(pc.poly); });
      });
      side = l <= r ? 1 : -1;
    }
    const made = [];
    targets.forEach((o) => {
      const wp = this.worldPoly(o);
      const parts = G.splitPoly(wp, f.a, f.b) || [{ poly: wp, side: G.side(G.centroid(wp), f.a, f.b) > 0 ? 1 : -1 }];
      if (parts.length === 1 && parts[0].side !== side) return;
      this.remove(o);
      parts.forEach((pc) => {
        const poly = pc.side === side ? G.reflectPoly(pc.poly, f.a, f.b) : pc.poly;
        const c = G.centroid(poly);
        made.push(this.add({
          kind: o.kind, cls: o.cls, fill: o.fill, stroke: o.stroke, sw: o.sw, move: o.move, rotate: o.rotate, flipable: o.flipable, cut: o.cut, fold: o.fold,
          shape: { poly: poly.map((p) => [p[0] - c[0], p[1] - c[1]]) }, x: c[0], y: c[1],
          data: Object.assign(C.clone(o.data) || {}, { folded: (o.data.folded || 0) + (pc.side === side ? 1 : 0) })
        }));
      });
    });
    if (!made.length) { this.toast('Nothing to fold there'); return; }
    this.stats.folds++;
    this.emit('change', { why: 'fold', objs: made });
  };

  /* ---------- 3D ---------- */

  proto.use3D = function (opts) {
    if (!this.v3) {
      this.box3d.hidden = false;
      this.v3 = new C.View3D(this.box3d, opts || {});
      this.box3d.hidden = !this.is3D;
    }
    return this.v3;
  };
  // offer the 2D / 3D switch (engines with both views)
  proto.allow3D = function (on) { this.btn3d.hidden = !on; };
  proto.set3D = function (on) {
    this.is3D = !!on;
    this.host.classList.toggle('is3d', this.is3D);
    this.box3d.hidden = !this.is3D;
    if (this.is3D && this.v3) { this.v3.resize(); this.v3.render(); }
    if (!this.is3D) this.fit(); // back to the flat page: frame it again
    if (this.is3D && ['pen', 'marker', 'eraser', 'note', 'cut', 'fold', 'paint'].includes(this.mode)) this.setMode('select');
    this.btn3d.innerHTML = C.icon(this.is3D ? 'flat' : 'cube');
    this.btn3d.title = this.is3D ? 'Back to the flat view (3)' : 'Show in 3D (3)';
    this.select([]);
    this.syncTools();
    this.emit('view3d', this.is3D);
  };

  /* ---------- keyboard ---------- */

  proto.key = function (ev) {
    const k = ev.key, ctrl = ev.ctrlKey || ev.metaKey;
    if (k === ' ') { this.spaceDown = ev.type === 'keydown'; return this.spaceDown; }
    if (ev.type !== 'keydown') return false;
    const sel = this.selected();
    if (ctrl && (k === 'g' || k === 'G')) { if (ev.shiftKey) this.ungroupSel(); else this.groupSel(); return true; }
    if (ctrl && (k === 'a' || k === 'A')) { this.select(this.all().filter((o) => o.visible !== false)); return true; }
    if (ctrl) return false;
    if (k === 'Escape') { this.select([]); this.closePop(); this.cancelGesture(); if (this.mode !== 'select') this.setMode('select'); return true; }
    if (k === '+' || k === '=') { this.zoom(1.25); return true; }
    if (k === '-' || k === '_') { this.zoom(1 / 1.25); return true; }
    if (k === '0') { if (this.is3D && this.v3) { this.v3.fit(); this.v3.render(); } else this.fit(); return true; }
    if (k === '3' && !this.btn3d.hidden) { this.set3D(!this.is3D); return true; }
    if ((k === 'Delete' || k === 'Backspace') && sel.length) { this.deleteSel(); return true; }
    if (sel.length && k.startsWith('Arrow')) {
      const st = this.opts.grid || this.px(ev.shiftKey ? 10 : 2);
      const d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
      const objs = sel.filter((o) => o.move !== false);
      objs.forEach((o) => { o.x += d[0]; o.y += d[1]; this.place(o); });
      clearTimeout(this.nudgeT);
      this.drawSel();
      this.nudgeT = setTimeout(() => this.afterMove(objs, 'move'), 350);
      return true;
    }
    const low = k.toLowerCase();
    if (sel.length && low === 'r') { this.rotateSel((ev.shiftKey ? -1 : 1) * this.stepOf(sel)); return true; }
    if (sel.length && low === 'x' && !ev.shiftKey) { this.flipSel(false); return true; }
    if (sel.length && low === 'f' && ev.shiftKey) { this.flipSel(true); return true; }
    if (sel.length && k === ']') { this.zorder(ev.shiftKey ? 'front' : 'forward'); return true; }
    if (sel.length && k === '[') { this.zorder(ev.shiftKey ? 'back' : 'backward'); return true; }
    if (sel.length && (k === '}' )) { this.zorder('front'); return true; }
    if (sel.length && (k === '{')) { this.zorder('back'); return true; }
    if (low === 'x' && ev.shiftKey && this.toolBtns.xray) { this.setXray(!this.xray); return true; }
    if (low === 'l' && this.toolBtns.loupe) { this.setLoupe(!this.loupeOn); return true; }
    const map = { v: 'select', h: 'pan', b: 'paint', p: 'pen', m: 'marker', e: 'eraser', n: 'note', c: 'cut', f: 'fold' };
    if (map[low] && this.toolBtns[map[low]] && !ev.shiftKey) { this.setMode(map[low]); return true; }
    for (const m of this.modeList) if (m.key && m.key.toLowerCase() === low) { this.setMode(m.id); return true; }
    return false;
  };

  /* ---------- saving and undo ---------- */

  const KEEP = ['id', 'type', 'kind', 'cls', 'inert', 'shape', 'x', 'y', 'rot', 'flip', 'scale', 'fill', 'origFill', 'stroke', 'sw', 'opacity', 'visible', 'locked', 'group', 'move', 'rotate', 'flipable', 'cut', 'fold', 'remove', 'snap', 'snapTo', 'label', 'labelSize', 'hit', 'pivot', 'paint', 'name', 'data'];

  proto.snapshot = function () {
    const objs = this.order.map((id) => {
      const o = this.objs.get(id), c = {};
      KEEP.forEach((k) => { if (o[k] !== undefined) c[k] = o[k]; });
      c.data = C.clone(o.data);
      if (c.shape) c.shape = C.clone(c.shape);
      return c;
    });
    return {
      objs,
      marks: C.clone(this.marks),
      notes: C.clone(this.notes),
      paints: Object.assign({}, this.paints),
      legend: Object.assign({}, this.legend),
      seq: this.seq
    };
  };

  proto.restore = function (s) {
    if (!s) return;
    const selIds = new Set(this.sel);
    // keep the same piece objects where the id survives, so engines holding references stay right
    const old = new Map(this.objs);
    this.objs.forEach((o) => o.el && o.el.remove());
    this.objs.clear();
    this.order = [];
    this.sel.clear();
    (s.objs || []).forEach((c) => {
      const fresh = Object.assign({}, DEFAULTS, C.clone(c));
      let o = old.get(fresh.id);
      if (o) {
        KEEP.forEach((k) => { if (k !== 'id') o[k] = fresh[k]; });
        Object.keys(DEFAULTS).forEach((k) => { if (o[k] === undefined) o[k] = DEFAULTS[k]; });
        o.el = null;
      } else o = fresh;
      this.objs.set(o.id, o);
      this.order.push(o.id);
      this.renderObj(o);
    });
    this.seq = Math.max(this.seq, s.seq || 0);
    this.marks = C.clone(s.marks || []);
    this.notes = C.clone(s.notes || []);
    this.paints = Object.assign({}, s.paints || {});
    this.legend = Object.assign({}, s.legend || {});
    this.redrawMarks();
    this.redrawNotes();
    this.applyPaints();
    this.drawLegend();
    this.select(this.all().filter((o) => selIds.has(o.id)));
    this.emit('restore', s);
  };
})(typeof window !== 'undefined' ? window : globalThis);
