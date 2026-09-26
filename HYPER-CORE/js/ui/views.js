/* HYPER-CORE · ui/views.js
 *
 *   #/formulas    every formula on one sheet, filterable, each one opening as a calculator
 *   #/tools       constants · unit converter · calculator · symbol glossary
 *   #/progress    what you have explored and mastered; bookmarks; export and reset
 *   #/path/<id>   the prerequisites of a concept in the order to learn them
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;

  /* ================================================================ formula sheet */
  H.views.formulas = function (parts, params) {
    ui.setTitle('Formulas');
    const all = [];
    for (const id of H.order) {
      const n = H.nodes.get(id);
      H.formulasOf(n).forEach(f => all.push(f));
    }
    const b0 = params.get('b') || '';
    const page = ui.page(
      '<h1 class="h2" style="margin-top:6px;font-size:30px">Formula sheet</h1>' +
      '<p class="muted">All ' + all.length + ' formulas of ' + esc(H.discipline.title) + '. Open any one as a calculator, or print the sheet.</p>' +
      '<div class="toolbar"><input type="search" class="ff" placeholder="Filter by name, symbol or concept…" style="flex:1;min-width:200px">' +
      '<button class="btn sm" data-act="print">Print</button></div>' +
      '<div class="toolbar bchips"><button class="chip' + (b0 ? '' : ' on') + '" data-b="">All</button>' + H.branches.map(b => '<button class="chip' + (b0 === b.id ? ' on' : '') + '" data-b="' + b.id + '" style="--h:' + b.hue + '">' + esc(b.title) + '</button>').join('') + '</div>' +
      '<table class="ftable"><tbody class="fbody"></tbody></table>', 'wide');
    const body = ui.$('.fbody', page), ff = ui.$('.ff', page);
    let branch = b0;
    const draw = () => {
      const q = ff.value.trim().toLowerCase();
      let h = '', lastB = null;
      for (const f of all) {
        const n = f.node;
        if (branch && n.branch !== branch) continue;
        if (q) {
          const hay = (f.name + ' ' + n.title + ' ' + f.def.expr + ' ' + f.vars.map(v => v.name + ' ' + v.tex).join(' ')).toLowerCase();
          if (!q.split(/\s+/).every(t => hay.includes(t))) continue;
        }
        if (n.branch !== lastB) {
          lastB = n.branch;
          const b = H.nodes.get(n.branch);
          h += '<tr class="grp" style="--h:' + (b ? b.hue : 0) + '"><td colspan="3">' + esc(b ? b.title : '') + '</td></tr>';
        }
        h += '<tr class="fsheet-row" style="--h:' + n.hue + '"><td style="width:28%"><b>' + H.inline(f.name) + '</b><div class="small"><a href="#/c/' + n.id + '?f=' + f.index + '">' + esc(n.title) + '</a></div></td>' +
          '<td class="fx">' + H.texSafe(f.displayTex, false) + '</td>' +
          '<td style="width:120px;text-align:right"><button class="btn sm" data-open="' + esc(f.key) + '">' + H.icon('calc', 14) + 'Calculate</button></td></tr>' +
          '<tr hidden data-slot="' + esc(f.key) + '"><td colspan="3"></td></tr>';
      }
      body.innerHTML = h || '<tr><td class="empty">No formula matches.</td></tr>';
    };
    draw();
    ff.addEventListener('input', U.debounce(draw, 120));
    page.addEventListener('click', e => {
      const c = e.target.closest('[data-b]');
      if (c) { branch = c.dataset.b; ui.$$('.bchips .chip', page).forEach(x => x.classList.toggle('on', x === c)); draw(); return; }
      const o = e.target.closest('[data-open]');
      if (o) {
        const tr = ui.$('tr[data-slot="' + CSS.escape(o.dataset.open) + '"]', page);
        tr.hidden = !tr.hidden;
        if (!tr.hidden && !tr.firstElementChild.firstChild) tr.firstElementChild.appendChild(ui.formulaCard(all.find(f => f.key === o.dataset.open), { link: true }));
        return;
      }
      if (e.target.closest('[data-act=print]')) window.print();
    });
  };

  /* ================================================================ tools */
  H.views.tools = function (parts, params) {
    ui.setTitle('Tools');
    const tab = parts[0] || 'plot';
    const tabs = [['plot', 'Function plotter'], ['calc', 'Calculator'], ['units', 'Unit converter'], ['constants', 'Constants'], ['symbols', 'Symbols'], ['az', 'Index A–Z']];
    const page = ui.page('<h1 class="h2" style="margin-top:6px;font-size:30px">Tools</h1><nav class="tabs">' +
      tabs.map(([k, t]) => '<a href="#/tools/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="tbody"></div>', 'wide');
    const el = ui.$('.tbody', page);
    ({ constants, units: unitsTool, calc, symbols, plot: plotter, az }[tab] || plotter)(el, params);
  };

  /* ---------------------------------------------------------------- function plotter */
  const GREEKN = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'rho', 'sigma', 'tau', 'phi', 'chi', 'psi', 'omega'];
  function plotter(el, params) {
    const init = (params && params.get('f')) ? params.get('f').split(';') : ['sin(x)', 'a*x^2 + b'];
    const st = { fns: init.slice(0, 6), xmin: +(params && params.get('x0')) || -10, xmax: +(params && params.get('x1')) || 10, deriv: false, area: false, a: -1, b: 2, p: {} };
    if (!(st.xmax > st.xmin)) { st.xmin = -10; st.xmax = 10; }
    el.innerHTML = '<div class="cols2" style="grid-template-columns:minmax(280px,380px) 1fr;margin-top:0;align-items:start">' +
      '<div class="boxy"><div class="flist"></div><div class="btnrow mt"><button class="btn sm" data-a="add">+ Add a function</button><button class="btn sm ghost" data-a="share" title="Copy a link to this plot">' + H.icon('link', 14) + 'Link</button></div>' +
      '<div class="row mt small"><span>x from</span><input class="inp x0" style="width:80px;height:30px" value="' + st.xmin + '"><span>to</span><input class="inp x1" style="width:80px;height:30px" value="' + st.xmax + '"></div>' +
      '<div class="pars mt"></div>' +
      '<label class="row small mt" style="gap:6px"><input type="checkbox" class="dv"> also draw the derivatives (dashed)</label>' +
      '<label class="row small" style="gap:6px"><input type="checkbox" class="ar"> area under the first function from <input class="inp ia" style="width:60px;height:28px" value="-1"> to <input class="inp ib" style="width:60px;height:28px" value="2"></label>' +
      '<div class="small muted mt pinfo"></div>' +
      '<p class="small faint mt">Use x as the variable. Any other letter (a, b, k, omega…) becomes a parameter with its own slider. Functions: sin cos tan exp ln log sqrt abs … ; powers with ^ ; 2x means 2·x.</p></div>' +
      '<div class="card" style="padding:8px 8px 4px"><canvas class="plot" style="height:520px"></canvas></div></div>';
    const plot = new H.Plot(ui.$('canvas', el), {});
    ui.onLeave(() => plot.destroy());
    const flist = ui.$('.flist', el), pars = ui.$('.pars', el), info = ui.$('.pinfo', el);
    const C = () => ui.colors();
    const known = new Set(['x', ...'abcdfghijklmnopqrstuvwyzABCDFGHIJKLMNOPQRSTUVWXYZ'.split(''), ...GREEKN]);
    const drawList = () => {
      flist.innerHTML = st.fns.map((f, i) => '<div class="row" style="gap:6px;margin-bottom:6px"><span style="width:12px;height:12px;border-radius:3px;background:' + C().series[i % C().series.length] + '"></span>' +
        '<span class="small" style="font-family:var(--font-math)">f<sub>' + (i + 1) + '</sub>(x) =</span><input class="inp fin2" data-i="' + i + '" style="flex:1;font-family:var(--font-mono);height:32px" value="' + esc(f) + '" spellcheck="false">' +
        '<button class="icon-btn" data-del="' + i + '" title="Remove">' + H.icon('x', 14) + '</button></div>').join('');
    };
    let compiled = [];
    const compileAll = () => {
      const names = new Set();
      compiled = st.fns.map(src => {
        if (!src.trim()) return null;
        try {
          const t = H.expr.parse(src, { known });
          H.expr.vars(t).forEach(v => { if (v !== 'x') names.add(v); });
          return { t, fn: H.expr.compile(t), ok: true };
        } catch (e) { return { ok: false, err: e.message }; }
      });
      for (const n of names) if (!(n in st.p)) st.p[n] = 1;
      pars.innerHTML = [...names].sort().map(n => {
        const v = st.p[n], R = Math.max(5, Math.ceil(Math.abs(v) * 2));
        return '<div class="ctl"><div class="cl"><span style="font-family:var(--font-math)">' + esc(n) + '</span><b>' + U.fmt(v, 3) + '</b></div><input type="range" data-p="' + esc(n) + '" min="' + -R + '" max="' + R + '" step="0.01" value="' + v + '"></div>';
      }).join('');
      ui.$$('.fin2', el).forEach((inp, i) => inp.classList.toggle('bad', !!compiled[i] && !compiled[i].ok));
    };
    const draw = () => {
      const N = 700, xs = [];
      for (let i = 0; i <= N; i++) xs.push(st.xmin + (st.xmax - st.xmin) * i / N);
      const series = [], ys = [];
      let text = '';
      compiled.forEach((c, i) => {
        if (!c || !c.ok) return;
        const s = Object.assign({}, st.p);
        const f = x => { s.x = x; return c.fn(s); };
        const pts = xs.map(x => [x, f(x)]);
        pts.forEach(p => { if (Number.isFinite(p[1])) ys.push(p[1]); });
        const col = C().series[i % C().series.length];
        series.push({ pts, color: col, label: 'f' + (i + 1) });
        if (st.deriv) {
          const h = (st.xmax - st.xmin) * 1e-5;
          series.push({ pts: xs.map(x => [x, (f(x + h) - f(x - h)) / (2 * h)]), color: col, dash: [6, 4], width: 1.6, label: 'f' + (i + 1) + '′' });
        }
        // roots: sign changes of f
        const roots = [];
        for (let k = 1; k < pts.length; k++) {
          const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
          if (Number.isFinite(y0) && Number.isFinite(y1) && y0 * y1 < 0 && Math.abs(y1 - y0) < 1e3 * (Math.abs(y0) + Math.abs(y1) + 1)) {
            const r = H.expr.roots(f, { min: x0, max: x1 })[0];
            if (r != null && roots.length < 8) roots.push(r);
          } else if (y0 === 0) roots.push(x0);
        }
        series.push({ pts: roots.map(r => [r, 0]), color: col, line: false, dots: 4 });
        if (roots.length && i < 3) text += 'f' + (i + 1) + ' = 0 at x ≈ ' + roots.map(r => U.fmt(r, 4)).join(', ') + '<br>';
        if (i === 0 && st.area) {
          const a = Math.min(st.a, st.b), b = Math.max(st.a, st.b);
          const n = 1000; let sum = 0;
          for (let k = 0; k <= n; k++) { const x = a + (b - a) * k / n; const w = k === 0 || k === n ? 1 : k % 2 ? 4 : 2; sum += w * f(x); }
          const I = sum * (b - a) / (3 * n);
          const sp = []; for (let k = 0; k <= 200; k++) { const x = a + (b - a) * k / 200; sp.push([x, f(x)]); }
          series.push({ pts: sp, color: col, line: false, fill: true });
          text = '∫ f₁ dx from ' + U.fmt(st.a, 4) + ' to ' + U.fmt(st.b, 4) + ' = <b>' + U.fmt(st.a <= st.b ? I : -I, 6) + '</b><br>' + text;
        }
      });
      // a y-range that ignores asymptotes
      ys.sort((p, q) => p - q);
      let y0 = -1, y1 = 1;
      if (ys.length) {
        y0 = ys[Math.floor(ys.length * 0.02)]; y1 = ys[Math.min(ys.length - 1, Math.floor(ys.length * 0.98))];
        if (y0 === y1) { y0 -= 1; y1 += 1; }
        const pad = (y1 - y0) * 0.12; y0 -= pad; y1 += pad;
        if (y0 > 0 && y0 < 0.3 * y1) y0 = 0;
        if (y1 < 0 && y1 > 0.3 * y0) y1 = 0;
      }
      plot.set({ x: { min: st.xmin, max: st.xmax, label: 'x', name: 'x' }, y: { min: y0, max: y1, label: 'y' }, series, marks: [] });
      info.innerHTML = text;
    };
    const all = () => { compileAll(); draw(); };
    drawList(); all();
    el.addEventListener('input', e => {
      const t = e.target;
      if (t.classList.contains('fin2')) { st.fns[+t.dataset.i] = t.value; compileAll(); draw(); }
      else if (t.dataset.p) { st.p[t.dataset.p] = +t.value; t.previousElementSibling.querySelector('b').textContent = U.fmt(+t.value, 3); draw(); }
      else if (t.classList.contains('x0') || t.classList.contains('x1')) {
        const a = parseFloat(ui.$('.x0', el).value), b = parseFloat(ui.$('.x1', el).value);
        if (Number.isFinite(a) && Number.isFinite(b) && b > a) { st.xmin = a; st.xmax = b; draw(); }
      } else if (t.classList.contains('ia') || t.classList.contains('ib')) {
        st.a = parseFloat(ui.$('.ia', el).value) || 0; st.b = parseFloat(ui.$('.ib', el).value) || 0; draw();
      }
    });
    el.addEventListener('change', e => {
      if (e.target.classList.contains('dv')) { st.deriv = e.target.checked; draw(); }
      if (e.target.classList.contains('ar')) { st.area = e.target.checked; draw(); }
    });
    el.addEventListener('click', e => {
      const d = e.target.closest('[data-del]');
      if (d) { st.fns.splice(+d.dataset.del, 1); drawList(); all(); return; }
      const a = e.target.closest('[data-a]');
      if (!a) return;
      if (a.dataset.a === 'add' && st.fns.length < 6) { st.fns.push(''); drawList(); all(); ui.$$('.fin2', el).pop().focus(); }
      if (a.dataset.a === 'share') {
        const q = 'f=' + encodeURIComponent(st.fns.filter(Boolean).join(';')) + '&x0=' + st.xmin + '&x1=' + st.xmax;
        ui.copy(location.href.split('#')[0] + '#/tools/plot?' + q);
      }
    });
    document.addEventListener('hyper:theme', draw);
    ui.onLeave(() => document.removeEventListener('hyper:theme', draw));
  }

  /* ---------------------------------------------------------------- A–Z index */
  function az(el) {
    const entries = [];
    for (const n of H.list) {
      if (n.kind === 'root') continue;
      entries.push({ key: n.title, id: n.id, main: true });
      for (const k of n.keywords) if (k.toLowerCase() !== n.title.toLowerCase()) entries.push({ key: k, id: n.id });
    }
    entries.sort((a, b) => a.key.localeCompare(b.key, 'en', { sensitivity: 'base' }) || (b.main ? 1 : 0) - (a.main ? 1 : 0));
    const letter = s => { const c = s.normalize('NFD').charAt(0).toUpperCase(); return /[A-Z]/.test(c) ? c : '#'; };
    const letters = [...new Set(entries.map(e => letter(e.key)))];
    el.innerHTML = '<p class="muted">Every concept, and every term that leads to one. Titles are in bold.</p>' +
      '<div class="toolbar"><input type="search" class="zf" placeholder="Filter the index…" style="flex:1"></div>' +
      '<div class="toolbar">' + letters.map(l => '<a class="chip" href="#" data-l="' + l + '">' + l + '</a>').join('') + '</div><div class="zbody"></div>';
    const body = ui.$('.zbody', el), zf = ui.$('.zf', el);
    const draw = () => {
      const q = zf.value.trim().toLowerCase();
      let h = '', cur = '';
      for (const e of entries) {
        if (q && !e.key.toLowerCase().includes(q)) continue;
        const l = letter(e.key);
        if (l !== cur) { if (cur) h += '</div>'; h += '<h3 class="h3" id="az-' + l + '">' + l + '</h3><div style="columns:260px;column-gap:28px">'; cur = l; }
        const n = H.nodes.get(e.id);
        h += '<div style="break-inside:avoid;padding:2px 0;font-size:14.5px"><a href="#/c/' + e.id + '" data-ref="' + e.id + '" style="--h:' + n.hue + '">' + (e.main ? '<b>' + esc(e.key) + '</b>' : esc(e.key)) + '</a>' +
          (e.main ? '' : ' <span class="faint small">→ ' + esc(n.title) + '</span>') + '</div>';
      }
      body.innerHTML = h + (cur ? '</div>' : '<p class="empty">Nothing matches.</p>');
    };
    draw();
    zf.addEventListener('input', U.debounce(draw, 100));
    el.addEventListener('click', e => {
      const a = e.target.closest('[data-l]');
      if (a) { e.preventDefault(); const t = ui.$('#az-' + a.dataset.l, el); if (t) t.scrollIntoView({ block: 'start' }); }
    });
  }

  function constants(el) {
    const C = H.units.C;
    el.innerHTML = '<div class="toolbar"><input type="search" class="cf" placeholder="Filter constants…" style="flex:1"></div>' +
      '<table class="ftable"><thead><tr><th>Symbol</th><th>Name</th><th style="text-align:right">Value</th><th>Unit</th><th>In the calculator</th><th></th></tr></thead><tbody></tbody></table>' +
      '<p class="small faint mt">CODATA 2018 values; those marked exact are fixed by the 2019 definition of the SI units.</p>';
    const tb = ui.$('tbody', el), cf = ui.$('.cf', el);
    const draw = () => {
      const q = cf.value.toLowerCase();
      tb.innerHTML = Object.entries(C).filter(([k, c]) => !q || (c.name + ' ' + k).toLowerCase().includes(q)).map(([k, c]) =>
        '<tr><td class="m">' + H.texSafe(c.tex, false) + '</td><td>' + esc(c.name) + (c.exact ? ' <span class="chip" style="font-size:10.5px;padding:0 6px">exact</span>' : '') + '</td>' +
        '<td class="num">' + esc(U.fmt(c.v, 10)) + '</td><td>' + esc(c.u) + '</td><td><code>' + esc(k) + '</code></td>' +
        '<td><button class="icon-btn" data-copy="' + c.v + '" title="Copy the value">' + H.icon('copy', 15) + '</button></td></tr>').join('');
    };
    draw();
    cf.addEventListener('input', draw);
    el.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (b) ui.copy(b.dataset.copy); });
  }

  function unitsTool(el) {
    const Q = H.units.Q;
    const qs = Object.entries(Q).filter(([k, q]) => q.units.length > 1);
    el.innerHTML = '<div class="toolbar"><select class="uq">' + qs.map(([k, q]) => '<option value="' + k + '"' + (k === 'length' ? ' selected' : '') + '>' + esc(q.name) + '</option>').join('') + '</select>' +
      '<input class="inp uv" value="1" style="width:160px;font-family:var(--font-mono)"><select class="uu"></select></div><table class="ftable" style="max-width:640px"><tbody></tbody></table>';
    const uq = ui.$('.uq', el), uv = ui.$('.uv', el), uu = ui.$('.uu', el), tb = ui.$('tbody', el);
    const fillUnits = () => { uu.innerHTML = Q[uq.value].units.map(u => '<option>' + esc(u[0]) + '</option>').join(''); };
    const draw = () => {
      let x;
      try { x = H.expr.evaluate(H.expr.parse(uv.value), {}); } catch (e) { x = NaN; }
      const q = uq.value;
      if (!Number.isFinite(x)) { tb.innerHTML = '<tr><td class="empty">Type a number.</td></tr>'; return; }
      const si = H.units.toSI(x, q, uu.value);
      tb.innerHTML = Q[q].units.map(u => '<tr' + (u[0] === uu.value ? ' style="font-weight:700"' : '') + '><td class="num" style="width:55%">' + esc(U.fmt(H.units.fromSI(si, q, u[0]), 7)) + '</td><td>' + esc(u[0] || '(none)') + '</td>' +
        '<td><button class="icon-btn" data-copy="' + H.units.fromSI(si, q, u[0]) + '" title="Copy">' + H.icon('copy', 14) + '</button></td></tr>').join('');
    };
    fillUnits(); draw();
    uq.onchange = () => { fillUnits(); draw(); };
    uu.onchange = draw; uv.oninput = draw;
    el.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (b) ui.copy(b.dataset.copy); });
  }

  function calc(el) {
    const C = H.units.C;
    const hist = [];
    el.innerHTML = '<div class="cols2" style="grid-template-columns:minmax(300px,1.4fr) minmax(240px,1fr);margin-top:0"><div>' +
      '<div class="toolbar"><input class="inp ce" style="flex:1;font-family:var(--font-mono);font-size:16px;height:42px" placeholder="e.g.  sqrt(2*g*10)   or   h*c/(500e-9)" autocomplete="off" spellcheck="false">' +
      '<label class="row small" style="gap:5px"><input type="checkbox" class="deg" checked> degrees</label></div>' +
      '<div class="cpre muted" style="min-height:40px"></div><div class="calcout">&nbsp;</div><div class="hist"></div></div>' +
      '<div class="boxy"><h3>Names you can use</h3><div class="small muted" style="line-height:1.9">' +
        Object.entries(C).map(([k, c]) => '<button class="chip" data-ins="' + k + '" title="' + esc(c.name + ' = ' + U.fmt(c.v, 6) + ' ' + c.u) + '">' + esc(k) + '</button>').join(' ') +
        '<p class="mt">Functions: sin cos tan asin acos atan sinh cosh tanh sqrt cbrt exp ln log log2 abs floor ceil round fact nCr(n,k) atan2(y,x) root(x,n), and pi, e. Write powers with ^ and 2x for 2·x.</p></div></div></div>';
    const inp = ui.$('.ce', el), pre = ui.$('.cpre', el), out = ui.$('.calcout', el), hl = ui.$('.hist', el), deg = ui.$('.deg', el);
    const scope = {};
    for (const [k, c] of Object.entries(C)) scope[k] = c.v;
    // in degree mode trig takes and gives degrees
    const degTree = t => {
      const D = Math.PI / 180;
      const walk = x => {
        if (!x || typeof x !== 'object') return x;
        const y = Object.assign({}, x);
        if (y.a) y.a = walk(y.a);
        if (y.b) y.b = walk(y.b);
        if (y.args) y.args = y.args.map(walk);
        if (y.t === 'fn' && ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'].includes(y.f)) y.args = [{ t: 'mul', a: y.args[0], b: { t: 'num', v: D } }];
        if (y.t === 'fn' && ['asin', 'acos', 'atan', 'arcsin', 'arccos', 'arctan', 'atan2'].includes(y.f)) return { t: 'div', a: y, b: { t: 'num', v: D } };
        return y;
      };
      return walk(t);
    };
    let last = null;
    const run = () => {
      const s = inp.value.trim();
      if (!s) { pre.innerHTML = ''; out.innerHTML = '&nbsp;'; return; }
      try {
        const t = H.expr.parse(s);
        const unknown = [...H.expr.vars(t)].filter(v => !(v in scope));
        pre.innerHTML = H.tex(H.expr.toTex(t, n => C[n] ? C[n].tex : null), true);
        if (unknown.length) { out.innerHTML = '<span class="muted" style="font-size:16px">Unknown name: ' + esc(unknown.join(', ')) + '</span>'; last = null; return; }
        const v = H.expr.evaluate(deg.checked ? degTree(t) : t, scope);
        last = { s, v };
        out.textContent = '= ' + U.fmt(v, 10);
      } catch (e) { out.innerHTML = '<span class="muted" style="font-size:16px">' + esc(e.message) + '</span>'; last = null; }
    };
    inp.addEventListener('input', run);
    deg.addEventListener('change', run);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && last) {
        hist.unshift(last);
        hl.innerHTML = hist.slice(0, 12).map(h => '<div data-h="' + esc(h.s) + '"><code>' + esc(h.s) + '</code><b>' + esc(U.fmt(h.v, 8)) + '</b></div>').join('');
        inp.select();
      }
    });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-ins]');
      if (b) { const p = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, p) + b.dataset.ins + inp.value.slice(p); inp.focus(); run(); }
      const h = e.target.closest('[data-h]');
      if (h) { inp.value = h.dataset.h; run(); inp.focus(); }
    });
    inp.focus();
  }

  function symbols(el) {
    const map = new Map();
    for (const id of H.order) {
      const n = H.nodes.get(id);
      for (const f of H.formulasOf(n)) for (const v of f.vars) {
        const k = H.texKey(v.tex);
        if (!map.has(k)) map.set(k, { tex: v.tex, uses: [] });
        const e = map.get(k);
        const key = v.name.toLowerCase();
        let u = e.uses.find(x => x.name.toLowerCase() === key);
        if (!u) { u = { name: v.name, unit: v.unit, nodes: [] }; e.uses.push(u); }
        if (!u.nodes.includes(n.id)) u.nodes.push(n.id);
      }
    }
    const rows = [...map.values()].sort((a, b) => a.tex.replace(/\\/g, '').localeCompare(b.tex.replace(/\\/g, ''), 'en', { sensitivity: 'base' }));
    el.innerHTML = '<p class="muted">The same letter means different things in different places. Here is every symbol used in the formulas, with what it stands for and where.</p>' +
      '<div class="toolbar"><input type="search" class="sf" placeholder="Filter: a name like wavelength, or a letter like lambda" style="flex:1"></div><table class="ftable"><tbody></tbody></table>';
    const tb = ui.$('tbody', el), sf = ui.$('.sf', el);
    const draw = () => {
      const q = sf.value.toLowerCase().trim();
      tb.innerHTML = rows.filter(r => !q || r.tex.toLowerCase().includes(q) || r.uses.some(u => u.name.toLowerCase().includes(q))).map(r =>
        '<tr><td class="m" style="width:90px;font-size:1.2em">' + H.texSafe(r.tex, false) + '</td><td>' + r.uses.map(u =>
          '<div><b>' + H.inline(u.name) + '</b>' + (u.unit ? ' <span class="faint">(' + esc(u.unit) + ')</span>' : '') + ' <span class="small">— ' +
          u.nodes.slice(0, 6).map(id => '<a href="#/c/' + id + '">' + esc(H.nodes.get(id).title) + '</a>').join(', ') + (u.nodes.length > 6 ? ' …' : '') + '</span></div>').join('') + '</td></tr>').join('');
    };
    draw();
    sf.addEventListener('input', U.debounce(draw, 100));
  }

  /* ================================================================ progress */
  H.views.progress = function () {
    ui.setTitle('Progress');
    const st = H.store, d = st.data;
    const pr = H.progressOf(H.root.id);
    const concepts = H.list.filter(n => n.kind === 'concept');
    const weak = concepts.filter(n => d.stats[n.id] && st.accuracy(n.id) < 0.6).sort((a, b) => st.accuracy(a.id) - st.accuracy(b.id)).slice(0, 12);
    const card = id => { const n = H.nodes.get(id); return n ? '<a class="lcard" href="#/c/' + id + '" style="--h:' + n.hue + '" data-ref="' + id + '"><span class="mdot m' + st.mastery(id) + '"></span><div><div class="lt">' + esc(n.title) + '</div><div class="ls">' + H.inline(n.short || '') + '</div></div></a>' : ''; };
    const page = ui.page('<h1 class="h2" style="margin-top:6px;font-size:30px">Your progress</h1>' +
      '<div class="stats"><div class="stat"><b>' + pr.visited + ' / ' + pr.total + '</b><span>concepts visited</span></div><div class="stat"><b>' + pr.practised + '</b><span>practised</span></div>' +
      '<div class="stat"><b>' + pr.mastered + '</b><span>mastered</span></div><div class="stat"><b>' + (d.total || 0) + '</b><span>questions answered</span></div></div>' +
      '<h2 class="h2">By branch</h2><table class="ftable">' + H.branches.map(b => {
        const p = H.progressOf(b.id);
        return '<tr style="--h:' + b.hue + '"><td style="width:30%"><a href="#/c/' + b.id + '"><b>' + esc(b.title) + '</b></a></td><td><div class="bar" style="height:9px"><i class="ok" style="width:' + (p.total ? 100 * p.mastered / p.total : 0) + '%"></i><i style="width:' + (p.total ? 100 * (p.practised - p.mastered) / p.total : 0) + '%;opacity:.75"></i><i style="width:' + (p.total ? 100 * (p.visited - p.practised) / p.total : 0) + '%;opacity:.35"></i></div></td>' +
          '<td class="num" style="width:180px">' + p.visited + ' visited · ' + p.mastered + ' mastered</td></tr>';
      }).join('') + '</table><p class="small faint">Green: mastered (four or more right, 80 % of the recent answers). Solid: practised. Pale: visited.</p>' +
      (weak.length ? '<h2 class="h2">Worth another look</h2><div class="hlist">' + weak.map(n => card(n.id)).join('') + '</div>' : '') +
      '<h2 class="h2">Bookmarks</h2>' + (d.bookmarks.length ? '<div class="hlist">' + d.bookmarks.map(card).join('') + '</div>' : '<p class="muted">Use <b>Save</b> on any page to keep it here.</p>') +
      (d.notes && Object.keys(d.notes).length ? '<h2 class="h2">Your notes</h2>' + Object.keys(d.notes).filter(id => H.nodes.has(id)).map(id =>
        '<div class="boxy mb" style="--h:' + H.nodes.get(id).hue + '"><h3><a href="#/c/' + id + '?s=notes">' + esc(H.nodes.get(id).title) + '</a></h3><div class="small" style="white-space:pre-wrap">' + esc(d.notes[id]) + '</div></div>').join('') : '') +
      '<h2 class="h2">Recently visited</h2>' + (d.recent.length ? '<div class="hlist">' + d.recent.slice(0, 18).map(card).join('') + '</div>' : '<p class="muted">Nothing yet.</p>') +
      '<h2 class="h2">Your data</h2><p class="muted small">Progress is kept in this browser only. Export it to move it to another computer.</p>' +
      '<div class="btnrow"><button class="btn" data-act="export">' + H.icon('download', 15) + 'Export</button><label class="btn">' + H.icon('upload', 15) + 'Import<input type="file" accept=".json,application/json" hidden></label>' +
      '<button class="btn" data-act="reset" style="color:var(--bad)">' + H.icon('trash', 15) + 'Reset progress</button></div>');
    page.addEventListener('click', e => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'export') {
        const blob = new Blob([JSON.stringify({ discipline: H.discipline.id, saved: new Date().toISOString(), data: d }, null, 1)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = 'hyper-' + H.discipline.id + '-progress.json';
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else if (a.dataset.act === 'reset') {
        if (confirm('Forget everything this browser knows about your progress in ' + H.discipline.title + '? This cannot be undone.')) {
          localStorage.removeItem(st.key()); st.load(); H.go('#/progress'); ui.toast('Progress reset');
          ui.$$('[data-md]').forEach(x => { x.className = 'mdot m0'; });
        }
      }
    });
    ui.$('input[type=file]', page).addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      file.text().then(t => {
        const j = JSON.parse(t);
        if (!j.data || j.discipline !== H.discipline.id) throw new Error('This file is not ' + H.discipline.title + ' progress.');
        st.data = Object.assign(st.data, j.data);
        st.save(); ui.toast('Progress imported'); H.go('#/progress');
      }).catch(err => alert(err.message));
    });
  };

  /* ================================================================ learning path */
  H.views.path = function (parts) {
    const id = parts[0];
    const n = id && H.nodes.get(id);
    ui.setTitle('Learning path');
    if (!n) {
      const page = ui.page('<h1 class="h2" style="margin-top:6px;font-size:30px">Plan a learning path</h1><p class="muted">Choose where you want to get to, and you get everything it builds on, in an order you can study front to back.</p>' +
        '<div class="toolbar"><input type="search" class="pf" placeholder="Where do you want to get to? e.g. Doppler effect" style="flex:1;height:42px"></div><div class="hlist pres"></div>');
      const pf = ui.$('.pf', page), pres = ui.$('.pres', page);
      const draw = () => {
        const q = pf.value.trim();
        const list = q ? H.search(q).filter(e => e.k === 'c').map(e => e.id) : H.list.filter(x => x.kind === 'concept' && x.prereq.length >= 2).slice(0, 12).map(x => x.id);
        pres.innerHTML = list.map(x => { const m = H.nodes.get(x); return '<a class="lcard" href="#/path/' + x + '" style="--h:' + m.hue + '"><div><div class="lt">' + esc(m.title) + '</div><div class="ls">' + H.pathTo(x).length + ' steps</div></div></a>'; }).join('');
      };
      pf.addEventListener('input', U.debounce(draw, 100));
      draw(); pf.focus();
      return;
    }
    const steps = H.pathTo(id);
    const st = H.store;
    const firstOpen = steps.find(x => st.mastery(x) < 1);
    const done = steps.filter(x => st.mastery(x) >= 1).length;
    ui.page('<nav class="crumbs"><a href="#/path">Learning paths</a></nav><h1 class="h2" style="margin-top:0;font-size:28px">Path to ' + esc(n.title) + '</h1>' +
      '<p class="muted">' + steps.length + ' steps, each one building on those before it. ' + done + ' already visited.</p>' +
      (firstOpen ? '<p><a class="btn pri" href="#/c/' + firstOpen + '">' + H.icon('play', 16) + 'Continue with ' + esc(H.nodes.get(firstOpen).title) + '</a></p>' : '<p class="chip" style="color:var(--ok)">You have visited every step.</p>') +
      '<ol class="tline">' + steps.map((x, i) => {
        const m = H.nodes.get(x);
        const k = st.mastery(x);
        return '<li class="' + (k >= 1 ? 'done' : '') + (x === firstOpen ? ' next' : '') + '" style="--h:' + m.hue + '"><span class="tn">' + (k >= 1 ? '✓' : i + 1) + '</span>' +
          '<a class="lcard" href="#/c/' + x + '" style="--h:' + m.hue + '" data-ref="' + x + '"><span class="mdot m' + k + '"></span><div><div class="lt">' + esc(m.title) + '</div><div class="ls">' + H.inline(m.short || '') + '</div></div></a></li>';
      }).join('') + '</ol>');
  };
})();
