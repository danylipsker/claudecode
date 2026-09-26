/* HYPER-CORE · ui/simkit.js
 *
 * What a simulation is given to build itself with, and the card it lives in.
 *
 *   Hyper.sim('projectile', {
 *     title: 'Projectile launcher',
 *     blurb: 'Markdown shown under the simulation: what to try, what to notice.',
 *     mount(box, kit, params) {
 *       const st  = kit.stage(box.stage, { aspect: 0.6 });   // canvas: st.ctx, st.W, st.H, st.begin()
 *       const ctl = kit.controls(box.side, [
 *         { id: 'v0', label: 'Launch speed', min: 1, max: 40, step: 0.5, value: 20, unit: 'm/s' },
 *         { id: 'drag', type: 'check', label: 'Air resistance', value: false },
 *         { id: 'g', type: 'select', label: 'Planet', options: [['Earth', 9.81], ['Moon', 1.62]], value: 9.81 },
 *         { type: 'buttons', items: [{ id: 'go', label: 'Launch', primary: true }, { id: 'clear', label: 'Clear' }] }
 *       ], (id, value, all) => { ... });
 *       const ro  = kit.readout(box.side, [['t', 'Time'], ['x', 'Distance']]);
 *       const loop = kit.loop((dt, t) => { ... draw a frame ... });
 *       loop.start();
 *       return () => { ... };                                   // optional cleanup
 *     }
 *   });
 *
 * Loops pause while the simulation is scrolled out of view and stop when the page changes.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui;

  function stage(el, opts) {
    opts = opts || {};
    const cv = document.createElement('canvas');
    el.appendChild(cv);
    const st = { canvas: cv, ctx: cv.getContext('2d'), W: 0, H: 0, dpr: 1, cbs: [] };
    const size = () => {
      const w = el.clientWidth || 600;
      let h = opts.height || Math.round(w * (opts.aspect || 0.58));
      h = Math.max(opts.minH || 240, Math.min(opts.maxH || 540, h));
      const dpr = window.devicePixelRatio || 1;
      cv.style.height = h + 'px';
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      st.W = w; st.H = h; st.dpr = dpr;
      st.cbs.forEach(f => f(w, h));
    };
    st.onResize = f => st.cbs.push(f);
    st.begin = (bg) => {
      const c = st.ctx;
      c.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      if (bg === false) c.clearRect(0, 0, st.W, st.H);
      else { c.fillStyle = bg || ui.colors().bg2; c.fillRect(0, 0, st.W, st.H); }
      return c;
    };
    /* pointer position in canvas pixels */
    st.pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    ui.onLeave(() => ro.disconnect());
    size();
    return st;
  }

  function fmtVal(d, v) {
    if (d.fmt) return d.fmt(v);
    if (typeof v !== 'number') return String(v);
    const s = d.step && d.step >= 1 ? String(Math.round(v)) : H.util.fmt(v, d.sig || 3);
    return s + (d.unit ? (d.unit === '°' ? '' : ' ') + d.unit : '');
  }

  function controls(el, defs, onChange) {
    const values = {};
    const api = { values, rows: {} };
    for (const d of defs) {
      let row;
      if (d.type === 'buttons') {
        row = ui.el('<div class="btnrow"></div>');
        for (const b of d.items) {
          const btn = ui.el('<button class="btn sm' + (b.primary ? ' pri' : '') + '">' + H.util.esc(b.label) + '</button>');
          btn.onclick = () => onChange && onChange(b.id, true, values);
          if (b.id) api.rows[b.id] = btn;
          row.appendChild(btn);
        }
      } else if (d.type === 'check') {
        values[d.id] = !!d.value;
        row = ui.el('<label class="ctl chk"><input type="checkbox"' + (d.value ? ' checked' : '') + '>' + H.util.esc(d.label) + '</label>');
        const inp = row.querySelector('input');
        inp.onchange = () => { values[d.id] = inp.checked; onChange && onChange(d.id, inp.checked, values); };
        api.rows[d.id] = { row, set: v => { inp.checked = !!v; values[d.id] = !!v; } };
      } else if (d.type === 'select') {
        values[d.id] = d.value != null ? d.value : d.options[0][1];
        row = ui.el('<div class="ctl"><div class="cl"><span>' + H.util.esc(d.label) + '</span></div><select></select></div>');
        const sel = row.querySelector('select');
        d.options.forEach((o, i) => {
          const opt = document.createElement('option');
          opt.value = i; opt.textContent = o[0];
          if (o[1] === values[d.id]) opt.selected = true;
          sel.appendChild(opt);
        });
        sel.onchange = () => { values[d.id] = d.options[+sel.value][1]; onChange && onChange(d.id, values[d.id], values); };
        api.rows[d.id] = { row, set: v => { const i = d.options.findIndex(o => o[1] === v); if (i >= 0) sel.value = i; values[d.id] = v; } };
      } else if (d.type === 'html') {
        row = ui.el('<div class="ctl small muted">' + (d.html || '') + '</div>');
        if (d.id) api.rows[d.id] = { row, set: h => { row.innerHTML = h; } };
      } else {
        values[d.id] = d.value;
        const log = !!d.log;
        const toPos = v => log ? Math.log(v / d.min) / Math.log(d.max / d.min) * 1000 : v;
        const fromPos = p => log ? d.min * Math.pow(d.max / d.min, p / 1000) : +p;
        row = ui.el('<div class="ctl"><div class="cl"><span>' + H.util.esc(d.label) + '</span><b></b></div><input type="range"></div>');
        const inp = row.querySelector('input'), out = row.querySelector('b');
        inp.min = log ? 0 : d.min; inp.max = log ? 1000 : d.max; inp.step = log ? 1 : (d.step || (d.max - d.min) / 200);
        inp.value = toPos(d.value);
        out.textContent = fmtVal(d, d.value);
        inp.oninput = () => {
          let v = fromPos(inp.value);
          if (log && d.sig) v = Number(v.toPrecision(d.sig));
          values[d.id] = v;
          out.textContent = fmtVal(d, v);
          onChange && onChange(d.id, v, values);
        };
        api.rows[d.id] = { row, set: v => { values[d.id] = v; inp.value = toPos(v); out.textContent = fmtVal(d, v); } };
      }
      el.appendChild(row);
    }
    api.set = (id, v, fire) => {
      const r = api.rows[id];
      if (r && r.set) r.set(v);
      if (fire && onChange) onChange(id, v, values);
    };
    /* show or hide a control (for simulations with modes) */
    api.show = (id, on) => {
      const r = api.rows[id];
      const el = r && (r.row || r);
      if (el && el.style) el.style.display = on === false ? 'none' : '';
    };
    return api;
  }

  function readout(el, rows) {
    const box = ui.el('<div class="readout"></div>');
    const cells = {};
    for (const [k, label] of rows) {
      const a = document.createElement('span'); a.textContent = label;
      const b = document.createElement('span'); b.textContent = '—';
      box.appendChild(a); box.appendChild(b);
      cells[k] = b;
    }
    el.appendChild(box);
    return {
      el: box,
      set(k, v) { if (cells[k]) cells[k].textContent = v; },
      /* show(false) hides the whole read-out; show(key, false) one row of it */
      show(k, on) {
        if (typeof k === 'boolean' || k == null) { box.style.display = k === false ? 'none' : ''; return; }
        const c = cells[k];
        if (c) { c.style.display = c.previousSibling.style.display = on === false ? 'none' : ''; }
      }
    };
  }

  /* an animation loop: step(dt, t) each frame; dt in seconds, at most 1/20 s */
  function loop(step, host) {
    let raf = 0, last = 0, t = 0, want = false, visible = true;
    const frame = now => {
      raf = 0;
      if (!want || !visible || document.hidden) { last = 0; return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now; t += dt;
      try { step(dt, t); } catch (e) { console.error(e); want = false; return; }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && want && visible) raf = requestAnimationFrame(frame); };
    let io = null;
    if (host && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); });
      io.observe(host);
    }
    const vis = () => { if (!document.hidden) kick(); };
    document.addEventListener('visibilitychange', vis);
    const api = {
      start() { want = true; kick(); return api; },
      stop() { want = false; if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; return api; },
      toggle() { return want ? api.stop() : api.start(); },
      get running() { return want; },
      get t() { return t; },
      reset() { t = 0; },
      once() { try { step(0, t); } catch (e) { console.error(e); } }
    };
    ui.onLeave(() => { api.stop(); if (io) io.disconnect(); document.removeEventListener('visibilitychange', vis); });
    return api;
  }

  /* ---------------------------------------------------------------- drawing helpers */
  function arrow(ctx, x1, y1, x2, y2, color, width, head) {
    const w = width || 2, hl = head || Math.max(7, w * 3.5);
    const a = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 0.5) return;
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.lineWidth = w; ctx.lineCap = 'round';
    const hx = x2 - Math.cos(a) * Math.min(hl, len) * 0.8, hy = y2 - Math.sin(a) * Math.min(hl, len) * 0.8;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(hx, hy); ctx.stroke();
    const h = Math.min(hl, len);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42));
    ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function label(ctx, text, x, y, o) {
    o = o || {};
    ctx.save();
    ctx.font = (o.weight || 500) + ' ' + (o.size || 12.5) + 'px ' + (o.font || getComputedStyle(document.body).fontFamily);
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.baseline || 'middle';
    if (o.bg) {
      const m = ctx.measureText(text), w = m.width + 10, h = (o.size || 12.5) + 8;
      const bx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w + 5 : x - 5;
      ctx.fillStyle = o.bg;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y - h / 2, w, h, 5) : ctx.rect(bx, y - h / 2, w, h); ctx.fill();
    }
    ctx.fillStyle = o.color || ui.colors().text;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function grid(ctx, x0, y0, w, h, step, color) {
    ctx.save();
    ctx.strokeStyle = color || ui.colors().grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = x0; x <= x0 + w + 0.1; x += step) { ctx.moveTo(Math.round(x) + 0.5, y0); ctx.lineTo(Math.round(x) + 0.5, y0 + h); }
    for (let y = y0; y <= y0 + h + 0.1; y += step) { ctx.moveTo(x0, Math.round(y) + 0.5); ctx.lineTo(x0 + w, Math.round(y) + 0.5); }
    ctx.stroke();
    ctx.restore();
  }
  function dot(ctx, x, y, r, color, stroke) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  /* dragging things on a canvas: hit(p) returns what is under the pointer (or null) */
  function drag(st, o) {
    let cur = null;
    const cv = st.canvas;
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', e => {
      const p = st.pos(e);
      cur = o.hit(p);
      if (cur != null) { cv.setPointerCapture(e.pointerId); o.start && o.start(cur, p); e.preventDefault(); }
    });
    cv.addEventListener('pointermove', e => {
      const p = st.pos(e);
      if (cur != null) o.move(cur, p);
      else if (o.hover) cv.style.cursor = o.hit(p) != null ? 'grab' : '';
    });
    const up = () => { if (cur != null) { o.end && o.end(cur); cur = null; } };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
  }
  /* clicks on the stage: fn(p) with p = {x, y} in canvas pixels; hover(p) may return true
     to show a pointer cursor over something clickable */
  function click(st, fn, hover) {
    const cv = st.canvas;
    cv.addEventListener('click', e => fn(st.pos(e)));
    if (hover) cv.addEventListener('pointermove', e => { cv.style.cursor = hover(st.pos(e)) ? 'pointer' : ''; });
  }
  /* a second canvas for a graph under or beside the scene */
  function plot(el, opts, height) {
    const cv = document.createElement('canvas');
    cv.className = 'plot';
    cv.style.height = (height || 200) + 'px';
    el.appendChild(cv);
    const p = new H.Plot(cv, opts);
    ui.onLeave(() => p.destroy());
    return p;
  }

  const kit = H.kit = {
    stage, controls, readout, loop, arrow, label, grid, dot, drag, click, plot,
    colors: () => ui.colors(),
    fmt: (v, s) => H.util.fmt(v, s),
    hue: (h, a) => ui.colors().hue(h, a),
    TAU: Math.PI * 2,
    schem: H.schem,                 // circuit symbols and an oscilloscope screen (schematic.js)
    Circuit: H.Circuit,             // the circuit simulator (circuit.js)
    chem: H.chem,                   // elements, formulas, molar mass, balancing, VSEPR (chem.js)
    mol: H.mol,                     // 3-D molecules: view, rotator, draw, angle (molecule.js)
    eng: (v, unit) => H.schem ? H.schem.fmt(v, unit) : H.util.fmt(v) + ' ' + unit   // 4700, 'Ω' -> '4.7 kΩ'
  };

  /* ---------------------------------------------------------------- the card */
  ui.simCard = function (ref, node) {
    const def = H.sims[ref.id];
    const card = ui.el('<div class="card simcard"></div>');
    if (!def) {
      card.innerHTML = '<div class="simhead"><h3>Simulation “' + H.util.esc(ref.id) + '” is missing</h3></div>';
      return card;
    }
    card.innerHTML = '<div class="simhead"><span class="tag">' + H.icon('play', 15) + '</span><h3>' + H.util.esc(ref.title || def.title || ref.id) + '</h3>' +
      '<button class="tbtn" data-act="reset" title="Start again">' + H.icon('refresh', 16) + '<span>Reset</span></button></div>' +
      '<div class="simbody"><div class="simstage"></div><div class="simside"></div></div>' +
      (def.blurb ? '<div class="simblurb">' + H.text(def.blurb) + '</div>' : '');
    let cleanup = null, mounted = false, extraLeave = [];
    const mount = () => {
      mounted = true;
      const box = { stage: card.querySelector('.simstage'), side: card.querySelector('.simside'), card, node };
      box.stage.innerHTML = ''; box.side.innerHTML = '';
      // loops and observers registered while mounting are stopped on reset too
      const before = ui.leave.length;
      try { cleanup = def.mount(box, kit, Object.assign({}, def.params || {}, ref.params || {})); }
      catch (e) { console.error(e); box.stage.innerHTML = '<div class="empty">This simulation failed to start: ' + H.util.esc(e.message) + '</div>'; }
      extraLeave = ui.leave.splice(before);
    };
    const unmount = () => {
      if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.error(e); } }
      extraLeave.forEach(f => { try { f(); } catch (e) {} });
      extraLeave = []; cleanup = null;
    };
    card.querySelector('[data-act=reset]').onclick = () => { unmount(); mount(); };
    ui.onLeave(unmount);
    // start when first scrolled into view
    ui.whenVisible(card, () => { if (!mounted) mount(); });
    return card;
  };

  /* Run fn once, when el first comes near the screen. IntersectionObserver where it
     works, and a scroll check as well (it does not fire in hidden or throttled views). */
  ui.whenVisible = function (el, fn, margin) {
    margin = margin == null ? 200 : margin;
    let done = false, io = null, t = 0;
    const view = ui.$('#view');
    const cleanup = () => { if (io) io.disconnect(); if (view) view.removeEventListener('scroll', check); clearTimeout(t); };
    function check() {
      if (done || !el.isConnected) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + margin && r.bottom > -margin && r.height > 0) { done = true; cleanup(); fn(); }
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(es => { if (es[0].isIntersecting) check(); }, { rootMargin: margin + 'px' });
      io.observe(el);
    }
    if (view) view.addEventListener('scroll', check, { passive: true });
    t = setTimeout(check, 50);
    ui.onLeave(cleanup);
  };
})();
