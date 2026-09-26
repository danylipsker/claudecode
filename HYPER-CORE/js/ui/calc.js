/* HYPER-CORE · ui/calc.js
 *
 * The formula card. Every formula is a calculator:
 *   - click any symbol (in the list, or in the formula itself) to make it the unknown
 *   - type values in any unit, or drag the sliders; the unknown follows live
 *   - the rearranged formula for the unknown is shown, and other roots if there are any
 *   - "Graph" plots the unknown against any other variable, the others held fixed
 *   - "Practice" asks a generated question from this formula, with a worked solution
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;
  const units = () => H.units;

  function unitOptions(v, sel) {
    const q = units().Q[v.q];
    if (!q) return '';
    return q.units.map(u => '<option' + (u[0] === sel ? ' selected' : '') + ' value="' + esc(u[0]) + '">' + (u[0] ? esc(u[0]) : '—') + '</option>').join('');
  }
  const toShow = (si, v, unit) => v.q ? units().fromSI(si, v.q, unit) : si;
  const toSI = (x, v, unit) => v.q ? units().toSI(x, v.q, unit) : x;

  /* slider range for a variable, in SI: [lo, hi, log] */
  function sliderRange(v, cur) {
    if (v.min != null && v.max != null) return [v.min, v.max, v.log && v.min > 0];
    const base = Math.abs(v.def != null && v.def !== 0 ? v.def : (cur || 1));
    if (v.signed) return [-3 * base, 3 * base, false];
    if (v.min != null && v.min <= 0) return [v.min, Math.max(base * 4, v.min + 1), false];
    return [base / 20, base * 20, true];
  }

  ui.formulaCard = function (f, opts) {
    opts = opts || {};
    const node = f.node;
    const card = ui.el('<div class="card fcard" id="f-' + esc(f.key.replace(/[^\w-]/g, '_')) + '" style="--h:' + (node ? node.hue : H.discipline.hue) + '"></div>');
    if (f.errors.length && !f.eq) {
      card.innerHTML = '<div class="fhead"><h3>' + esc(f.name) + '</h3></div><div class="fnote" style="color:var(--bad)">' + esc(f.errors.join('; ')) + '</div>';
      return card;
    }
    const vals = f.defaults();
    const unitOf = {};
    f.vars.forEach(v => { unitOf[v.id] = v.unit; });
    let target = f.target;
    { const r = f.solve(target, vals); if (r.ok) vals[target] = r.value; }

    card.innerHTML =
      '<div class="fhead"><h3>' + H.inline(f.name) + '</h3>' +
        (opts.link && node ? '<a class="tbtn" href="#/c/' + node.id + '" title="Open ' + esc(node.title) + '">' + esc(node.title) + '</a>' : '') +
        '<button class="tbtn" data-act="graph" title="Plot one variable against another">' + H.icon('graph', 16) + '<span>Graph</span></button>' +
        (f.def.practice === false ? '' : '<button class="tbtn" data-act="practice" title="A practice problem from this formula">' + H.icon('practice', 16) + '<span>Practice</span></button>') +
        '<button class="tbtn" data-act="reset" title="Back to the starting values">' + H.icon('refresh', 16) + '</button>' +
      '</div>' +
      '<div class="fdisp" title="Click a symbol to solve for it">' + H.texSafe(f.displayTex, true) + '</div>' +
      (f.def.note ? '<div class="fnote">' + H.text(f.def.note) + '</div>' : '') +
      '<div class="fcalc"><div class="fgrid">' + f.vars.map(v =>
        '<div class="frow" data-v="' + esc(v.id) + '">' +
          '<button class="fsym" title="Solve for ' + esc(v.name) + '">' + H.texSafe(v.tex, false) + '</button>' +
          '<div class="fname">' + H.inline(v.name) + (v.isConst ? '<span class="cbadge" title="A constant; you may still change it (try the Moon)">const</span> <button class="freset" hidden title="Back to the standard value">reset</button>' : '') +
            (v.q && units().Q[v.q] ? '<small>' + esc(units().Q[v.q].name) + '</small>' : '') + '</div>' +
          '<input class="fin" inputmode="decimal" spellcheck="false" aria-label="' + esc(v.name) + '">' +
          (v.q && units().Q[v.q].units.length > 1 ? '<select class="fu" aria-label="unit of ' + esc(v.name) + '">' + unitOptions(v, v.unit) + '</select>' : '<span class="fu fixed">' + esc(v.unit || '') + '</span>') +
          '<input class="fsl" type="range" min="0" max="1000" step="1" aria-label="' + esc(v.name) + ' slider">' +
        '</div>').join('') + '</div><div class="fres"></div></div>' +
      '<div class="fgraph" hidden></div><div class="fprac" hidden style="border-top:1px solid var(--border)"></div>';

    const rows = {};
    f.vars.forEach(v => {
      const r = card.querySelector('.frow[data-v="' + CSS.escape(v.id) + '"]');
      rows[v.id] = { el: r, inp: r.querySelector('.fin'), sel: r.querySelector('select.fu'), sl: r.querySelector('.fsl'), reset: r.querySelector('.freset'), range: sliderRange(v, vals[v.id]) };
    });
    const res = card.querySelector('.fres');
    const disp = card.querySelector('.fdisp');

    /* ---------------- showing values */
    const showRow = (id) => {
      const v = f.byName[id], r = rows[id];
      const x = toShow(vals[id], v, unitOf[id]);
      if (document.activeElement !== r.inp || id === target) r.inp.value = Number.isFinite(vals[id]) ? U.fmtInput(x, id === target ? 5 : 6) : '—';
      r.inp.classList.toggle('none', !Number.isFinite(vals[id]));
      const [lo, hi, lg] = r.range;
      const cur = vals[id];
      let pos = lg ? Math.log(cur / lo) / Math.log(hi / lo) * 1000 : (cur - lo) / (hi - lo) * 1000;
      r.sl.value = Number.isFinite(pos) ? U.clamp(pos, 0, 1000) : 500;
      if (r.reset) r.reset.hidden = Math.abs(vals[id] - f.byName[id].def) <= 1e-12 * Math.abs(f.byName[id].def || 1);
    };
    const setTarget = (id) => {
      target = id;
      f.vars.forEach(v => {
        const r = rows[v.id];
        r.el.classList.toggle('tgt', v.id === id);
        r.inp.readOnly = v.id === id;
        r.inp.tabIndex = v.id === id ? -1 : 0;
        r.el.querySelector('.fsym').setAttribute('aria-pressed', v.id === id);
      });
      compute();
    };
    let lastAll = [];
    const compute = () => {
      const r = f.solve(target, vals);
      const v = f.byName[target];
      let msg = '';
      if (r.ok) {
        vals[target] = r.value;
        lastAll = r.all;
        if (r.note) msg = '<span class="notemsg">' + esc(v.name.charAt(0).toUpperCase() + v.name.slice(1)) + ' is ' + esc(r.note) + '.</span>';
      } else {
        vals[target] = NaN;
        lastAll = [];
        msg = '<span class="warnmsg">No answer: ' + esc(r.reason) + '.</span>';
      }
      f.vars.forEach(x => showRow(x.id));
      const rt = f.rearrangedTex(target);
      const alone = f.eq.l.t === 'var' && f.eq.l.n === target;
      let h = '';
      if (rt && !alone) h += '<span class="rearr" title="The formula rearranged for the unknown">' + H.texSafe('\\displaystyle ' + rt, false) + '</span>';
      else if (!rt) h += '<span class="hint">Solved numerically: ' + H.texSafe(v.tex, false) + ' appears more than once.</span>';
      if (r.ok && r.all.length > 1) {
        h += '<span class="hint">Also a solution: ' + r.all.slice(1, 4).map((x, i) => '<span class="alt" data-alt="' + (i + 1) + '">' + esc(H.Formula.show(x, v, unitOf[target])) + '</span>').join(', ') + '</span>';
      }
      res.innerHTML = h + msg;
      if (graph) graph.redraw();
    };

    /* ---------------- events */
    card.addEventListener('click', e => {
      const sym = e.target.closest('.fsym');
      if (sym) { setTarget(sym.closest('.frow').dataset.v); return; }
      const alt = e.target.closest('[data-alt]');
      if (alt) {
        // adopt another root: move it to the front
        const x = lastAll[+alt.dataset.alt];
        if (x != null) { vals[target] = x; const rr = f.solve(target, vals); if (rr.ok) { rr.all.sort((a, b) => Math.abs(a - x) - Math.abs(b - x)); vals[target] = rr.all[0]; } f.vars.forEach(v => showRow(v.id)); if (graph) graph.redraw(); }
        return;
      }
      const rs = e.target.closest('.freset');
      if (rs) { const id = rs.closest('.frow').dataset.v; vals[id] = f.byName[id].def; compute(); return; }
      const act = e.target.closest('[data-act]');
      if (act) {
        const a = act.dataset.act;
        if (a === 'reset') {
          Object.assign(vals, f.defaults());
          f.vars.forEach(v => { unitOf[v.id] = v.unit; if (rows[v.id].sel) rows[v.id].sel.value = v.unit; rows[v.id].range = sliderRange(v, vals[v.id]); });
          setTarget(f.target);
        } else if (a === 'graph') {
          const g = card.querySelector('.fgraph');
          g.hidden = !g.hidden;
          act.classList.toggle('on', !g.hidden);
          if (!g.hidden && !graph) graph = makeGraph(g);
          if (graph) graph.redraw();
        } else if (a === 'practice') {
          const p = card.querySelector('.fprac');
          if (!p.hidden && p.dataset.live) { p.hidden = true; act.classList.remove('on'); return; }
          p.hidden = false; p.dataset.live = 1;
          act.classList.add('on');
          if (H.practice) H.practice.formulaInline(p, f);
        }
        return;
      }
      // a symbol inside the displayed formula
      const k = e.target.closest('.fdisp [data-k]');
      if (k) {
        const v = f.vars.find(x => H.texKey(x.tex) === k.dataset.k);
        if (v) setTarget(v.id);
      }
    });
    f.vars.forEach(v => {
      const r = rows[v.id];
      const read = () => {
        const s = r.inp.value.trim();
        if (!s) return;
        let x;
        try {
          const scope = {};
          for (const [k, c] of Object.entries(units().C)) scope[k] = c.v;
          x = H.expr.evaluate(H.expr.parse(s), scope);
        } catch (e) { x = NaN; }
        r.inp.classList.toggle('bad', !Number.isFinite(x));
        if (!Number.isFinite(x)) return;
        vals[v.id] = toSI(x, v, unitOf[v.id]);
        // keep the slider useful when a value far outside its range is typed
        const [lo, hi] = r.range;
        if (vals[v.id] < lo || vals[v.id] > hi) {
          if (v.min == null || v.max == null) r.range = sliderRange(Object.assign({}, v, { def: vals[v.id] }), vals[v.id]);
        }
        compute();
      };
      r.inp.addEventListener('input', read);
      r.inp.addEventListener('change', () => { read(); showRow(v.id); });
      r.inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { r.inp.blur(); return; }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && v.id !== target) {
          e.preventDefault();
          const k = e.key === 'ArrowUp' ? 1 : -1;
          const x = toShow(vals[v.id], v, unitOf[v.id]);
          let nx;
          if (v.int) nx = x + k;
          else if (x === 0) nx = k * 0.1;
          else nx = x * (1 + k * (e.shiftKey ? 0.1 : 0.01) * Math.sign(x));
          vals[v.id] = toSI(nx, v, unitOf[v.id]);
          r.inp.value = U.fmtInput(nx, 6);
          compute();
        }
      });
      r.inp.addEventListener('blur', () => showRow(v.id));
      if (r.sel) r.sel.addEventListener('change', () => { unitOf[v.id] = r.sel.value; showRow(v.id); if (graph) graph.redraw(); if (v.id === target) compute(); });
      r.sl.addEventListener('input', () => {
        const [lo, hi, lg] = r.range;
        const p = r.sl.value / 1000;
        let x = lg ? lo * Math.pow(hi / lo, p) : lo + (hi - lo) * p;
        // round to something readable in the shown unit
        let shown = toShow(x, v, unitOf[v.id]);
        shown = v.int ? Math.round(shown) : Number(shown.toPrecision(3));
        vals[v.id] = toSI(shown, v, unitOf[v.id]);
        r.inp.value = U.fmtInput(shown, 6);
        if (v.id === target) return;
        compute();
      });
      // light the symbol up in the formula while pointing at its row
      const key = H.texKey(v.tex);
      r.el.addEventListener('mouseenter', () => lit(key, true));
      r.el.addEventListener('mouseleave', () => lit(key, false));
    });
    function lit(key, on) {
      disp.querySelectorAll('[data-k]').forEach(el => { if (el.dataset.k === key) el.classList.toggle('lit', on); });
    }
    disp.addEventListener('mouseover', e => {
      const k = e.target.closest('[data-k]');
      f.vars.forEach(v => rows[v.id].el.classList.toggle('lit', !!k && H.texKey(v.tex) === k.dataset.k));
    });
    disp.addEventListener('mouseleave', () => f.vars.forEach(v => rows[v.id].el.classList.remove('lit')));

    /* ---------------- graph */
    let graph = null;
    function makeGraph(host) {
      const others = () => f.vars.filter(v => v.id !== target);
      host.innerHTML = '<div class="gctl"><span>Plot the unknown against</span><select class="gx"></select>' +
        '<label class="row" style="gap:5px"><input type="checkbox" class="glog"> log–log</label><span class="grow"></span><span class="gtitle"></span></div><canvas class="plot"></canvas>';
      const sx = host.querySelector('.gx'), lg = host.querySelector('.glog'), title = host.querySelector('.gtitle');
      const plot = new H.Plot(host.querySelector('canvas'), {});
      ui.onLeave(() => plot.destroy());
      let xvar = null;
      const fill = () => {
        const os = others().filter(v => !v.isConst).concat(others().filter(v => v.isConst));
        if (!xvar || xvar === target || !f.byName[xvar]) xvar = os[0] ? os[0].id : null;
        sx.innerHTML = os.map(v => '<option value="' + esc(v.id) + '"' + (v.id === xvar ? ' selected' : '') + '>' + esc(v.name) + '</option>').join('');
      };
      sx.onchange = () => { xvar = sx.value; api.redraw(); };
      lg.onchange = () => api.redraw();
      let pending = 0;
      const api = {
        redraw() {
          if (host.hidden) return;
          if (pending) return;
          pending = requestAnimationFrame(() => { pending = 0; draw(); });
        }
      };
      function draw() {
        fill();
        if (!xvar) return;
        const xv = f.byName[xvar], yv = f.byName[target];
        const ux = unitOf[xvar], uy = unitOf[target];
        const cur = vals[xvar];
        const log = lg.checked;
        let lo, hi;
        if (log) { const c = Math.abs(cur) || 1; lo = c / 10; hi = c * 10; if (xv.min != null && xv.min > 0) lo = Math.max(lo, xv.min); if (xv.max != null) hi = Math.min(hi, xv.max); }
        else if (xv.min != null && xv.max != null) { lo = xv.min; hi = xv.max; }
        else if (xv.signed) { const c = Math.abs(cur) || 1; lo = -2.5 * c; hi = 2.5 * c; }
        else { lo = xv.min != null ? xv.min : 0; hi = Math.max(lo + 1e-12, 2.5 * (Math.abs(cur) || 1)); }
        const N = 220;
        const pts = [];
        const s = Object.assign({}, vals);
        const iso = f.isolated(target);
        let prev = vals[target];
        for (let i = 0; i <= N; i++) {
          const x = log ? lo * Math.pow(hi / lo, i / N) : lo + (hi - lo) * i / N;
          s[xvar] = x;
          let y;
          if (iso) y = iso.fn(s);
          else { s[target] = prev; const r = f.solve(target, s); y = r.ok ? r.value : NaN; }
          if (Number.isFinite(y)) prev = y;
          if (!yv.signed && y < 0 && !iso) y = NaN;
          pts.push([toShow(x, xv, ux), toShow(y, yv, uy)]);
        }
        const nm = (v, u) => (v.name.length > 22 ? v.id : v.name) + (u ? ' (' + u + ')' : '');
        plot.set({
          x: { label: nm(xv, ux), log, name: xv.id, min: toShow(lo, xv, ux), max: toShow(hi, xv, ux) },
          y: { label: nm(yv, uy), log, name: yv.id },
          series: [{ pts, label: yv.id }],
          marks: Number.isFinite(vals[target]) ? [{ x: toShow(cur, xv, ux), y: toShow(vals[target], yv, uy) }] : [],
          fmtX: x => U.fmt(x, 4) + ' ' + ux, fmtY: y => U.fmt(y, 4) + ' ' + uy
        });
        title.innerHTML = H.texSafe(yv.tex, false) + ' vs ' + H.texSafe(xv.tex, false) + ', the rest as above';
      }
      return api;
    }

    setTarget(target);
    return card;
  };
})();
