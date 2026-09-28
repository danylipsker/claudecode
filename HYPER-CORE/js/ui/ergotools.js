/* HYPER-CORE · ui/ergotools.js
 *
 * The Tools pages of Hyper Ergonomics.
 *
 *   #/tools/bodysize/<explorer|person>        a dimension's spread and who a design range fits; every dimension of one person
 *   #/tools/workstation/<sitting|standing>    seat, desk, screen and standing work heights from the body, across the range
 *   #/tools/lifting/<niosh|carry>             the revised NIOSH lifting equation; the energy cost of carrying loads
 *   #/tools/environment/<noise|vibration|thermal|heat|cold|light>   exposures against limits
 *   #/tools/ranges                             the Dimension finder: every recommended range in the app
 *
 * The models are HYPER-CORE/js/ergo.js (kit.ergo, tested by tools/test-ergo.js). Body data are representative and
 * rounded; a real design uses data for its own users, the standards that apply, and a trial with real people.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, E = () => H.ergo;
  const n3 = (x, d) => Number.isFinite(x) ? U.fmt(x, d || 4) : '—';
  const f0 = x => Number.isFinite(x) ? Math.round(x).toLocaleString('en-GB') : '—';
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  const font = () => getComputedStyle(document.body).fontFamily;
  const TAU = 2 * Math.PI;

  /* ---------------------------------------------------------------- form, layout, plots (as in the other tools) */
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(String(v)) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      if (kind === 'range') return '<label class="mfield"><span>' + esc(label) + ' <b class="rv" data-rv="' + id + '"></b></span><input type="range" data-f="' + id + '" min="' + extra[0] + '" max="' + extra[1] + '" step="' + extra[2] + '" value="' + value + '"></label>';
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp"><input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(String(value)) + '">' + (extra ? '<i>' + esc(extra) + '</i>' : '') + '</span></label>';
    }).join('');
    const defs = Object.fromEntries(fields.map(f => [f[0], f]));
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, d = defs[id];
        if (d[3] === 'sel') { v[id] = inp.value; return; }
        if (d[3] === 'check') { v[id] = inp.checked; return; }
        if (d[3] === 'range') { v[id] = +inp.value; const rv = el.querySelector('[data-rv="' + id + '"]'); if (rv) rv.textContent = inp.value + (d[5] || ''); return; }
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        v[id] = x;
      });
      return v;
    };
    el.addEventListener('input', () => onChange(read()));
    el.addEventListener('change', () => onChange(read()));
    return read;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div></div></div><div class="mwide"></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), plot: ui.$('.mplot', el), wide: ui.$('.mwide', el) };
  }
  function plotIn(el, opts, h) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '8px'; box.style.marginBottom = '10px';
    const cv = document.createElement('canvas'); cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    box.appendChild(cv); el.appendChild(box);
    const p = new H.Plot(cv, Object.assign({ legend: true }, opts || {}));
    ui.onLeave(() => p.destroy());
    return p;
  }
  function canvasIn(el, h, draw) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '6px'; box.style.marginBottom = '10px';
    const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:' + h + 'px';
    box.appendChild(cv); el.appendChild(box);
    const paint = () => {
      const w = cv.clientWidth || 600, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      draw(c, w, h);
    };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => paint()); ro.observe(cv); ui.onLeave(() => ro.disconnect()); }
    const onTheme = () => paint(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
    return { cv, paint };
  }
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' +
      (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';
  const warnBox = msg => '<div class="callout co-warn" style="margin:8px 0"><div class="co-h">Take care</div>' + msg + '</div>';
  const DATA_NOTE = 'Representative, rounded adult data for learning and first estimates. For a real design use data for your own users (nation, age, occupation), add clothing and equipment allowances, check the standards that apply, and try it with real people.';
  const ord = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
  const PCTS = [['f', 5], ['f', 50], ['m', 50], ['m', 95]];
  const who = (s, p) => ord(p) + '-percentile ' + (s === 'm' ? 'man' : 'woman');

  // a side-view manikin from a person's dimensions (mm), standing, with its feet at (x, y) and a scale of k px/mm
  function manikin(c, x, y, k, P, col) {
    const S = E().SEGMENTS, st = P.stature, head = st * S.head;
    c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
    const Y = mm => y - mm * k, W = Math.max(3, 0.012 * st * k);
    const hip = st * S.hip, sh = P.shoulderHeight, knee = st * S.knee, elbow = P.elbowHeight, wrist = P.knuckleHeight + 0.06 * st;
    c.lineWidth = W * 1.6; c.beginPath(); c.moveTo(x, Y(hip)); c.lineTo(x + 40 * k, Y(knee)); c.lineTo(x, Y(st * S.ankle)); c.lineTo(x + st * S.footLength * k, Y(0)); c.stroke();
    c.lineWidth = W * 2.4; c.beginPath(); c.moveTo(x, Y(hip)); c.lineTo(x, Y(sh)); c.stroke();
    c.lineWidth = W * 1.1; c.beginPath(); c.moveTo(x, Y(sh)); c.lineTo(x + 20 * k, Y(elbow)); c.lineTo(x + 90 * k, Y(wrist + 40)); c.stroke();
    c.beginPath(); c.arc(x + 0.02 * st * k, Y(st - head / 2), head / 2 * k * 0.9, 0, TAU); c.fill();
  }

  /* ================================================================ BODY SIZES */
  const BODY = [['explorer', 'Who fits a range?'], ['person', 'One person, every dimension']];
  function bodysize(el, params, sub) {
    const T = subtabs(el, 'bodysize', BODY, sub, DATA_NOTE);
    ({ explorer: bExplorer, person: bPerson })[T.tab](T.body);
  }

  function bExplorer(el) {
    const L = layout(el, 'Pick a body dimension and a design limit: the curves show how the dimension spreads among women and men, the readings give the key percentiles and how many people the design accommodates. Clearances are set by the largest users, reaches by the smallest, adjustments span both.' + link('design-for-range') + link('percentiles') + link('combining-percentiles'));
    const dims = Object.keys(E().DIMS);
    const read = form(L.form, [['dim', 'Body dimension', 'popliteal', 'sel', dims.map(k => [k, E().DIMS[k].name + ' (' + E().DIMS[k].unit + ')'])], ['share', 'Share of men among the users', 50, 'range', [0, 100, 5], ' %'],
      ['mode', 'Design case', 'range', 'sel', [['clear', 'clearance: people must be smaller than the upper limit'], ['reach', 'reach: people must be larger than the lower limit'], ['range', 'adjustable range: between the limits']]],
      ['lo', 'Lower limit', 375, 'n', ''], ['hi', 'Upper limit', 485, 'n', ''], ['allow', 'Allowance added to the body (shoes, clothing)', 0, 'n', '']], calc);
    const pl = plotIn(L.plot, { x: { label: 'size' }, y: { label: 'share of people per unit', min: 0 } }, 230);
    function calc(v) {
      const d = E().DIMS[v.dim], w = v.share / 100, a = v.mode === 'clear' ? -Infinity : v.lo, b = v.mode === 'reach' ? Infinity : v.hi, al = v.allow || 0;
      const frac = s => { const [m, sd] = d[s]; return E().phi((b - al - m) / sd) - E().phi((a - al - m) / sd); };
      const fm = frac('m'), ff = frac('f'), fa = w * fm + (1 - w) * ff;
      const pc = (s, p) => f0(E().pct(v.dim, s, p) + al);
      L.stats.innerHTML = stat('Users accommodated', f1(100 * fa) + ' %', 'men ' + f1(100 * fm) + ' %, women ' + f1(100 * ff) + ' %', 'big' + (fa < 0.9 ? ' bad' : '')) +
        stat('5th-percentile woman · man', pc('f', 5) + ' · ' + pc('m', 5) + ' ' + d.unit, al ? 'including the ' + al + ' ' + d.unit + ' allowance' : '') +
        stat('50th percentile woman · man', pc('f', 50) + ' · ' + pc('m', 50) + ' ' + d.unit, 'means ' + d.f[0] + ' ± ' + d.f[1] + ' and ' + d.m[0] + ' ± ' + d.m[1]) +
        stat('95th-percentile woman · man', pc('f', 95) + ' · ' + pc('m', 95) + ' ' + d.unit, '') +
        stat('Classic design range', pc('f', 5) + ' – ' + pc('m', 95) + ' ' + d.unit, '5th-percentile woman to 95th-percentile man: about ' + f0(100 * E().fractionMix(v.dim, E().pct(v.dim, 'f', 5), E().pct(v.dim, 'm', 95), w)) + ' % of these users');
      const lo = Math.min(d.m[0], d.f[0]) - 4 * Math.max(d.m[1], d.f[1]), hi = Math.max(d.m[0], d.f[0]) + 4 * Math.max(d.m[1], d.f[1]);
      const pdf = (x, m, s) => Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(TAU));
      const pm = [], pf = [], pa = [];
      for (let i = 0; i <= 200; i++) { const x = lo + (hi - lo) * i / 200; pm.push([x + al, w * pdf(x, d.m[0], d.m[1])]); pf.push([x + al, (1 - w) * pdf(x, d.f[0], d.f[1])]); pa.push([x + al, w * pdf(x, d.m[0], d.m[1]) + (1 - w) * pdf(x, d.f[0], d.f[1])]); }
      const C = ui.colors();
      pl.set({ x: { label: d.name + ' (' + d.unit + ')' + (al ? ' with allowance' : '') }, series: [{ pts: pf, label: 'women', color: C.hue(330) }, { pts: pm, label: 'men', color: C.hue(215) }, { pts: pa, label: 'all users', color: C.muted, dash: [5, 4] }],
        vlines: [].concat(v.mode !== 'clear' ? [{ x: v.lo, label: 'lower', color: C.bad }] : []).concat(v.mode !== 'reach' ? [{ x: v.hi, label: 'upper', color: C.bad }] : []) });
    }
    calc(read());
  }

  function bPerson(el) {
    const L = layout(el, 'Every body dimension of one person of any sex and percentile, beside a second person for comparison, drawn to scale. Nobody is the same percentile in every dimension: a man of 95th-percentile height may have 60th-percentile arms.' + link('anthropometry-basics') + link('standing-dimensions') + link('sitting-dimensions'));
    const read = form(L.form, [['s1', 'Person 1', 'f', 'sel', [['f', 'woman'], ['m', 'man']]], ['p1', 'Percentile', 5, 'range', [1, 99, 1], ''], ['s2', 'Person 2', 'm', 'sel', [['f', 'woman'], ['m', 'man']]], ['p2', 'Percentile', 95, 'range', [1, 99, 1], '']], v => { V = v; calc(); });
    let V = read();
    const cv = canvasIn(L.wide, 340, (c, w, h) => {
      const P1 = E().person({ sex: V.s1, p: V.p1 }), P2 = E().person({ sex: V.s2, p: V.p2 }), C = ui.colors(), k = (h - 40) / 2150;
      c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(10, h - 20); c.lineTo(w - 10, h - 20); c.stroke();
      for (let mm = 0; mm <= 2000; mm += 250) { c.fillStyle = C.faint; c.fillRect(10, h - 20 - mm * k, w - 20, 1); c.fillStyle = C.muted; c.font = '11px ' + font(); c.textAlign = 'left'; c.fillText(mm + ' mm', 12, h - 24 - mm * k); }
      manikin(c, w * 0.38, h - 20, k, P1, C.hue(V.s1 === 'm' ? 215 : 330)); manikin(c, w * 0.66, h - 20, k, P2, C.hue(V.s2 === 'm' ? 215 : 330, 0.8));
      c.fillStyle = C.text; c.font = '12px ' + font(); c.textAlign = 'center';
      c.fillText(who(V.s1, V.p1) + ': ' + f0(P1.stature) + ' mm', w * 0.38, h - 26 - P1.stature * k); c.fillText(who(V.s2, V.p2) + ': ' + f0(P2.stature) + ' mm', w * 0.66, h - 26 - P2.stature * k);
    });
    const tbl = document.createElement('div'); L.wide.appendChild(tbl);
    function calc() {
      const P1 = E().person({ sex: V.s1, p: V.p1 }), P2 = E().person({ sex: V.s2, p: V.p2 }), D = E().DIMS;
      L.stats.innerHTML = stat('Stature', f0(P1.stature) + ' · ' + f0(P2.stature) + ' mm', 'difference ' + f0(Math.abs(P2.stature - P1.stature)) + ' mm', 'big') + stat('Body mass', f0(P1.weight) + ' · ' + f0(P2.weight) + ' kg', 'mass varies more than length: a person\'s mass percentile is often far from their stature percentile');
      tbl.innerHTML = '<div class="boxy"><table class="ftable"><thead><tr><th style="text-align:left">Dimension</th><th>' + esc(who(V.s1, V.p1)) + '</th><th>' + esc(who(V.s2, V.p2)) + '</th><th>Difference</th></tr></thead><tbody>' +
        Object.keys(D).map(k => '<tr><td>' + esc(D[k].name) + '</td><td class="num">' + f0(P1[k]) + ' ' + D[k].unit + '</td><td class="num">' + f0(P2[k]) + ' ' + D[k].unit + '</td><td class="num">' + f0(P2[k] - P1[k]) + '</td></tr>').join('') + '</tbody></table></div>';
      cv.paint();
    }
    calc();
  }

  /* ================================================================ WORKSTATIONS */
  const WS = [['sitting', 'Seated work'], ['standing', 'Standing work']];
  function workstation(el, params, sub) {
    const T = subtabs(el, 'workstation', WS, sub, DATA_NOTE);
    ({ sitting: wSit, standing: wStand })[T.tab](T.body);
  }
  function wSit(el) {
    const L = layout(el, 'The seat, desk, keyboard and screen that fit a person follow from their body: the seat at the popliteal height plus the shoe, the desk at the seated elbow, the top of the screen at or below the eyes. Across the range of users the numbers spread — that spread is the adjustment range the furniture must offer. With a fixed desk, small users raise the seat and need a footrest.' + link('office-chair') + link('desk-height') + link('monitor-placement') + link('sit-stand-work'));
    const read = form(L.form, [['sex', 'Person', 'f', 'sel', [['f', 'woman'], ['m', 'man']]], ['p', 'Percentile', 50, 'range', [1, 99, 1], ''], ['shoe', 'Shoe allowance', 25, 'n', 'mm'], ['desk', 'Desk height if fixed', 740, 'n', 'mm']], calc);
    const tbl = document.createElement('div'); L.wide.appendChild(tbl);
    function rec(P, shoe) { const w = E().workstation(P), d = shoe - 25; return { seat: w.seat + d, desk: w.deskSit + d, kb: w.keyboard + d, mon: w.monitorTop + d, knee: w.kneeClearance + d, depth: w.seatDepthMax, leg: w.legroomDepth }; }
    function calc(v) {
      const P = E().person({ sex: v.sex, p: v.p }), r = rec(P, v.shoe), seatFixed = v.desk - P.elbowRest, foot = Math.max(0, seatFixed - r.seat);
      L.stats.innerHTML = stat('Seat height', f0(r.seat) + ' mm', 'popliteal ' + f0(P.popliteal) + ' + shoe ' + v.shoe, 'big') + stat('Work surface (seated elbow)', f0(r.desk) + ' mm', 'keyboard home row about ' + f0(r.kb) + ' mm') +
        stat('Top of the screen', '≤ ' + f0(r.mon) + ' mm', 'at or a little below eye height; viewing distance 500–750 mm') + stat('Seat depth', '≤ ' + f0(r.depth) + ' mm', 'shorter than the thigh, so the seat edge clears the back of the knee') +
        stat('At the fixed ' + f0(v.desk) + ' mm desk', 'seat ' + f0(seatFixed) + ' mm', foot > 10 ? 'then a footrest of about ' + f0(foot) + ' mm' : seatFixed < r.seat - 30 ? 'the desk is low for this person: raise it or accept a stoop' : 'fits without a footrest') +
        stat('Knee clearance under the desk', '≥ ' + f0(r.knee) + ' mm', 'legroom depth ≥ ' + f0(r.leg) + ' mm');
      const cols = PCTS.map(([s, p]) => [who(s, p), rec(E().person({ sex: s, p }), v.shoe)]);
      const rowsDef = [['Seat height', 'seat'], ['Work surface', 'desk'], ['Keyboard', 'kb'], ['Top of the screen', 'mon'], ['Knee clearance', 'knee']];
      tbl.innerHTML = '<div class="boxy"><h3>Across the range of users (mm)</h3><table class="ftable"><thead><tr><th style="text-align:left"></th>' + cols.map(c => '<th>' + esc(c[0]) + '</th>').join('') + '<th>Adjustment range needed</th></tr></thead><tbody>' +
        rowsDef.map(([n, k]) => { const vals = cols.map(c => c[1][k]); return '<tr><td>' + n + '</td>' + vals.map(x => '<td class="num">' + f0(x) + '</td>').join('') + '<td class="num"><b>' + f0(Math.min(...vals)) + '–' + f0(Math.max(...vals)) + '</b></td></tr>'; }).join('') +
        '</tbody></table><p class="small muted mt">Compare office chairs to EN 1335-1 (seat about 400–510 mm) and office desks to EN 527-1 (fixed about 720–750 mm; height-adjustable and sit–stand desks cover a much wider range).</p></div>';
    }
    calc(read());
  }
  function wStand(el) {
    const L = layout(el, 'Standing work heights are set from the standing elbow height: above it for precise work that needs the eyes close, a little below it for light assembly, well below it for heavy work that uses the body\'s weight. The reach envelope sets how far away the parts may be.' + link('standing-work-heights') + link('workbench-design') + link('reach-zones'));
    const read = form(L.form, [['sex', 'Person', 'm', 'sel', [['f', 'woman'], ['m', 'man']]], ['p', 'Percentile', 50, 'range', [1, 99, 1], ''], ['shoe', 'Shoe allowance', 25, 'n', 'mm']], calc);
    let last = null;
    const cv = canvasIn(L.wide, 260, (c, w, h) => draw(c, w, h));
    function calc(v) {
      const P = E().person({ sex: v.sex, p: v.p }), ws = E().workstation(P), d = v.shoe - 25;
      const r = k => f0(ws[k][0] + d) + '–' + f0(ws[k][1] + d) + ' mm';
      const all = PCTS.map(([s, p]) => E().person({ sex: s, p }).elbowHeight + v.shoe);
      L.stats.innerHTML = stat('Elbow height (with shoes)', f0(P.elbowHeight + v.shoe) + ' mm', who(v.sex, v.p), 'big') + stat('Precision work', r('standPrecision'), '50–100 mm above the elbow, with support for the forearms') +
        stat('Light assembly', r('standLight'), '100–150 mm below the elbow') + stat('Heavy work', r('standHeavy'), '150–400 mm below the elbow') +
        stat('Reach, comfortable · maximum', f0(ws.reachComfort) + ' · ' + f0(ws.reachMax) + ' mm', 'keep frequent items in the inner zone') +
        stat('Light work for the range of users', f0(Math.min(...all) - 125) + '–' + f0(Math.max(...all) - 125) + ' mm', '5th-percentile woman to 95th-percentile man: one fixed bench cannot fit all — use adjustable benches or platforms');
      last = { v, P, ws, d }; cv.paint();
    }
    function draw(c, w, h) {
      if (!last) return;
      const { v, P, ws, d } = last, C = ui.colors(), k = (h - 30) / 2000, x0 = w * 0.3, y0 = h - 15, Y = mm => y0 - mm * k;
      c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(10, y0); c.lineTo(w - 10, y0); c.stroke();
      manikin(c, x0, y0, k, P, C.hue(v.sex === 'm' ? 215 : 330));
      const bands = [['precision', ws.standPrecision, 150], ['light', ws.standLight, 40], ['heavy', ws.standHeavy, 10]];
      bands.forEach(([n, r, hue], i) => { const xa = x0 + 60 + i * 110; c.fillStyle = C.hue(hue, 0.35); c.fillRect(xa, Y(r[1] + d), 90, (r[1] - r[0]) * k); c.fillStyle = C.text; c.font = '12px ' + font(); c.textAlign = 'center'; c.fillText(n, xa + 45, Y(r[1] + d) - 6); });
      c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.beginPath(); c.moveTo(x0, Y(P.elbowHeight + v.shoe)); c.lineTo(w - 20, Y(P.elbowHeight + v.shoe)); c.stroke(); c.setLineDash([]);
      c.fillStyle = C.accent; c.textAlign = 'right'; c.font = '12px ' + font(); c.fillText('elbow height', w - 22, Y(P.elbowHeight + v.shoe) - 5);
    }
    calc(read());
  }

  /* ================================================================ LIFTING */
  const LIFT = [['niosh', 'NIOSH lifting equation'], ['carry', 'Carrying a load']];
  function lifting(el, params, sub) {
    const T = subtabs(el, 'lifting', LIFT, sub, 'The NIOSH equation (Waters et al., 1993) covers two-handed lifting of stable loads in front of the body; it does not cover one-handed, seated, kneeling or very fast lifts, or pushing and pulling. Legal limits and methods differ between countries. Not medical advice.');
    ({ niosh: lNiosh, carry: lCarry })[T.tab](T.body);
  }
  function lNiosh(el) {
    const L = layout(el, 'The revised NIOSH lifting equation starts from 23 kg — a load most healthy workers can lift in ideal conditions — and multiplies it by six factors that fall below 1 as the lift gets worse: the hands far from the body, too low or too high, a long travel, twisting, frequent lifts, a poor grip. The lifting index is the actual load over this recommended limit.' + link('niosh-lifting-equation') + link('lifting-index-risk') + link('lifting-principles'));
    const read = form(L.form, [['load', 'Load', 15, 'n', 'kg'], ['H', 'Horizontal distance: hands to the midpoint between the ankles', 40, 'n', 'cm'], ['V', 'Height of the hands at the start', 30, 'n', 'cm'], ['D', 'Vertical travel', 60, 'n', 'cm'],
      ['A', 'Twisting (asymmetry angle)', 30, 'range', [0, 135, 5], '°'], ['F', 'Lifts per minute', 2, 'n', ''], ['hours', 'Duration of the lifting', '2', 'sel', [['1', 'up to 1 hour'], ['2', '1–2 hours'], ['8', '2–8 hours']]],
      ['coupling', 'Grip on the load', 'fair', 'sel', [['good', 'good (handles, fitted box)'], ['fair', 'fair'], ['poor', 'poor (no handles, bulky, slippery)']]]], calc);
    const cv = canvasIn(L.plot, 220, (c, w, h) => draw(c, w, h));
    let R = null;
    function calc(v) {
      if (!(v.H > 0 && v.V >= 0 && v.D >= 0 && v.F >= 0 && v.load >= 0)) { L.stats.innerHTML = '<p class="muted">Enter positive distances, frequency and load.</p>'; return; }
      R = E().niosh({ H: v.H, V: v.V, D: v.D, A: v.A, F: v.F, hours: +v.hours, coupling: v.coupling, load: v.load });
      const LI = R.LI, band = LI <= 1 ? ['acceptable for nearly all healthy workers', 'ok'] : LI <= 3 ? ['increased risk for some workers — redesign the task', 'warn'] : ['high risk for many workers — redesign now', 'bad'];
      const worst = [['HM', 'bring the load closer to the body'], ['VM', 'lift from and to about knuckle height (75 cm)'], ['DM', 'shorten the vertical travel'], ['AM', 'turn the feet, not the trunk: remove the twist'], ['FM', 'lift less often, or share the task'], ['CM', 'add handles or better containers']].sort((a, b) => R[a[0]] - R[b[0]])[0];
      L.stats.innerHTML = stat('Recommended weight limit (RWL)', f1(R.RWL) + ' kg', '23 kg × ' + ['HM', 'VM', 'DM', 'AM', 'FM', 'CM'].map(k => f1(R[k], 2)).join(' × '), 'big') +
        stat('Lifting index', f1(LI, 2), band[0], band[1] === 'ok' ? '' : 'bad') + stat('The biggest improvement', worst[0] + ' = ' + f1(R[worst[0]], 2), worst[1]) +
        (R.RWL <= 0 ? warnBox('A multiplier is zero: this lift is outside the equation\'s limits (H > 63 cm, V > 175 cm, D > 175 cm, twist > 135° or too frequent).') : '');
      cv.paint();
    }
    function draw(c, w, h) {
      if (!R) return;
      const C = ui.colors(), names = [['HM', 'horizontal'], ['VM', 'vertical'], ['DM', 'distance'], ['AM', 'asymmetry'], ['FM', 'frequency'], ['CM', 'coupling']], bw = (w - 40) / names.length;
      c.font = '12px ' + font(); c.textAlign = 'center';
      names.forEach(([k, n], i) => {
        const x = 20 + i * bw, val = R[k], bh = (h - 60) * val;
        c.fillStyle = C.faint; c.fillRect(x + 8, 20, bw - 16, h - 60);
        c.fillStyle = val >= 0.85 ? C.ok : val >= 0.6 ? C.warn : C.bad; c.fillRect(x + 8, 20 + (h - 60) - bh, bw - 16, bh);
        c.fillStyle = C.text; c.fillText(f1(val, 2), x + bw / 2, 14); c.fillText(n, x + bw / 2, h - 24); c.fillStyle = C.muted; c.fillText(k, x + bw / 2, h - 8);
      });
    }
    calc(read());
  }
  const TERRAIN = [['1.0', 'treadmill, asphalt or concrete'], ['1.1', 'dirt road'], ['1.2', 'light brush'], ['1.3', 'hard-packed snow'], ['1.5', 'heavy brush'], ['1.8', 'swampy bog'], ['2.1', 'loose sand']];
  function lCarry(el) {
    const L = layout(el, 'The energy a person spends walking with a load (Pandolf and colleagues, 1977): it grows with body mass, load, speed, slope and the terrain. A working day is usually kept below about a third of a person\'s aerobic capacity — roughly 300–350 W of metabolic power for a fit young adult, less for older or less fit people and in the heat.' + link('carrying-loads') + link('load-carriage'));
    const read = form(L.form, [['W', 'Body mass', 75, 'n', 'kg'], ['Ld', 'Load carried', 20, 'n', 'kg'], ['V', 'Walking speed', 4.5, 'n', 'km/h'], ['G', 'Slope', 0, 'n', '%'], ['eta', 'Terrain', '1.0', 'sel', TERRAIN]], calc);
    const pl = plotIn(L.plot, { x: { label: 'load (kg)', min: 0 }, y: { label: 'metabolic power (W)', min: 0 } }, 230);
    function calc(v) {
      if (!(v.W > 0 && v.Ld >= 0 && v.V >= 0)) { L.stats.innerHTML = '<p class="muted">Positive body mass and speed.</p>'; return; }
      const p = Ld => E().pandolf({ W: v.W, L: Ld, V: v.V / 3.6, G: v.G, eta: +v.eta }), M = p(v.Ld), share = 100 * v.Ld / v.W;
      L.stats.innerHTML = stat('Metabolic power', f0(M) + ' W', 'about ' + f0(M * 3600 / 4184) + ' kcal per hour', 'big' + (M > 450 ? ' bad' : '')) +
        stat('Load as a share of body mass', f0(share) + ' %', share > 45 ? 'above the 45 % often cited for approach marches — expect injury and exhaustion' : share > 30 ? 'above the 30 % often cited as a fighting-load limit for soldiers' : 'within common guidance') +
        stat('Standing still with the load', f0(p(v.Ld) - (+v.eta) * (v.W + v.Ld) * (1.5 * Math.pow(v.V / 3.6, 2) + 0.35 * v.V / 3.6 * v.G)) + ' W', 'the part of the cost that walking does not add') +
        stat('A working day', M > 350 ? 'too hard to sustain' : 'sustainable for a fit adult', 'with breaks, water and shade in the heat');
      const a = [], b = [];
      for (let x = 0; x <= Math.max(60, v.Ld * 1.5); x += 1) { a.push([x, p(x)]); b.push([x, E().pandolf({ W: v.W, L: x, V: v.V / 3.6, G: v.G + 5, eta: +v.eta })]); }
      pl.set({ series: [{ pts: a, label: 'at ' + f1(v.G) + ' % slope' }, { pts: b, label: 'at ' + f1(v.G + 5) + ' % slope', dash: [5, 4] }], hlines: [{ y: 330, label: 'about a third of a fit adult\'s capacity' }], marks: [{ x: v.Ld, y: M, label: 'yours' }] });
    }
    calc(read());
  }

  /* ================================================================ ENVIRONMENT */
  const ENV = [['noise', 'Noise'], ['vibration', 'Vibration'], ['thermal', 'Thermal comfort'], ['heat', 'Heat stress'], ['cold', 'Cold and wind'], ['light', 'Lighting']];
  function environment(el, params, sub) {
    const T = subtabs(el, 'environment', ENV, sub, 'Limits shown are those of the EU directives and US agencies named on each page, for learning; the law of your country and a competent assessment govern real workplaces. Not medical advice.');
    ({ noise: eNoise, vibration: eVib, thermal: eThermal, heat: eHeat, cold: eCold, light: eLight })[T.tab](T.body);
  }
  function eNoise(el) {
    const L = layout(el, 'A day\'s noise exposure from up to four activities. Europe (Directive 2003/10/EC) uses the daily exposure level L_EX,8h with an equal-energy 3 dB rule: every 3 dB halves the allowed time. US OSHA uses a 5 dB rule and a 90 dB(A) limit; NIOSH recommends 85 dB(A) with 3 dB. Hearing protectors are rated in the lab; real-world protection is usually much lower.' + link('noise-exposure') + link('hearing-protection') + link('noise-basics'));
    const read = form(L.form, [['l1', 'Activity 1: level', 92, 'n', 'dB(A)'], ['h1', 'hours', 2, 'n', 'h'], ['l2', 'Activity 2: level', 85, 'n', 'dB(A)'], ['h2', 'hours', 4, 'n', 'h'], ['l3', 'Activity 3: level', 70, 'n', 'dB(A)'], ['h3', 'hours', 2, 'n', 'h'], ['l4', 'Activity 4: level', 0, 'n', 'dB(A)'], ['h4', 'hours', 0, 'n', 'h'],
      ['nrr', 'Hearing protector NRR (US label)', 25, 'n', 'dB']], calc);
    const pl = plotIn(L.plot, { x: { label: 'level (dB(A))', min: 80, max: 115 }, y: { label: 'permitted hours per day', min: 0, max: 16 } }, 220);
    function calc(v) {
      const parts = [[v.l1, v.h1], [v.l2, v.h2], [v.l3, v.h3], [v.l4, v.h4]].filter(([l, h]) => Number.isFinite(l) && Number.isFinite(h) && h > 0 && l > 0);
      if (!parts.length) { L.stats.innerHTML = '<p class="muted">Enter at least one level and time.</p>'; return; }
      const LX = E().lex8(parts), NL = E().NOISE_LIMITS, osha = E().noiseDose(parts.filter(p => p[0] >= 80), { criterion: 90, exchange: 5 }), nio = E().noiseDose(parts, { criterion: 85, exchange: 3 });
      const der = Math.max(0, (v.nrr - 7) / 2), band = LX >= NL.euLimit ? 'above the upper action value, and above 87 dB(A): the exposure limit value, which applies at the ear under the protector — protectors must bring it below' :LX >= NL.euUpperAction ? 'above the upper action value: protectors must be worn, a noise-control programme' : LX >= NL.euLowerAction ? 'above the lower action value: protectors made available, training' : 'below the action values';
      L.stats.innerHTML = stat('Daily exposure L_EX,8h', f1(LX) + ' dB(A)', band, 'big' + (LX >= NL.euUpperAction ? ' bad' : '')) +
        stat('OSHA dose (90 dB, 5 dB rule)', f0(100 * osha.dose) + ' %', 'TWA ' + f1(osha.twa) + ' dB(A); 100 % = the permissible limit; 50 % (85 dB) triggers a hearing conservation programme') +
        stat('NIOSH dose (85 dB, 3 dB rule)', f0(100 * nio.dose) + ' %', 'the recommended limit; stricter than OSHA\'s') +
        stat('With the protector (derated)', f1(LX - der) + ' dB(A)', 'OSHA\'s derating: (NRR − 7) ÷ 2 = ' + f1(der) + ' dB; worn only part of the time, it protects far less');
      const a = [], b = [];
      for (let L = 80; L <= 115; L += 0.5) { a.push([L, Math.min(16, 8 / Math.pow(2, (L - 85) / 3))]); b.push([L, Math.min(16, 8 / Math.pow(2, (L - 90) / 5))]); }
      pl.set({ series: [{ pts: a, label: '85 dB, 3 dB rule (EU, NIOSH)' }, { pts: b, label: '90 dB, 5 dB rule (OSHA)', dash: [5, 4] }] });
    }
    calc(read());
  }
  function eVib(el) {
    const L = layout(el, 'Vibration exposure A(8): the vibration magnitude averaged to an 8-hour day, √(Σ a² t / 8 h). The EU Directive 2002/44/EC sets action and limit values — hand-arm 2.5 and 5 m/s², whole-body 0.5 and 1.15 m/s². Halving the vibration quadruples the time allowed.' + link('hand-arm-vibration') + link('whole-body-vibration'));
    const read = form(L.form, [['kind', 'Exposure', 'ha', 'sel', [['ha', 'hand-arm (tools)'], ['wb', 'whole-body (vehicles, platforms)']]], ['a1', 'Tool or vehicle 1: vibration', 6, 'n', 'm/s²'], ['t1', 'trigger or driving time', 1, 'n', 'h'], ['a2', 'Tool or vehicle 2: vibration', 3, 'n', 'm/s²'], ['t2', 'time', 2, 'n', 'h'], ['a3', 'Tool or vehicle 3: vibration', 0, 'n', 'm/s²'], ['t3', 'time', 0, 'n', 'h']], calc);
    const pl = plotIn(L.plot, { x: { label: 'vibration magnitude (m/s²)', min: 0 }, y: { label: 'hours to reach the value', min: 0, max: 12 } }, 220);
    function calc(v) {
      const lim = E().VIBRATION_LIMITS, ha = v.kind === 'ha', EAV = ha ? lim.handArmAction : lim.wholeBodyAction, ELV = ha ? lim.handArmLimit : lim.wholeBodyLimit;
      const parts = [[v.a1, v.t1], [v.a2, v.t2], [v.a3, v.t3]].filter(([a, t]) => a > 0 && t > 0);
      if (!parts.length) { L.stats.innerHTML = '<p class="muted">Enter at least one vibration and time.</p>'; return; }
      const A8 = E().a8(parts), first = parts[0][0];
      L.stats.innerHTML = stat('Daily exposure A(8)', f1(A8, 2) + ' m/s²', A8 >= ELV ? 'above the limit value — must be reduced at once' : A8 >= EAV ? 'above the action value — a programme to reduce it, health surveillance' : 'below the action value', 'big' + (A8 >= EAV ? ' bad' : '')) +
        stat('Tool 1 alone reaches the action value in', f1(8 * Math.pow(EAV / first, 2), 2) + ' h', 'and the limit value in ' + f1(8 * Math.pow(ELV / first, 2), 2) + ' h') +
        stat('Values (EU)', 'action ' + EAV + ' · limit ' + ELV + ' m/s²', ha ? 'hand-arm: white finger, nerve and joint damage' : 'whole-body: low-back disorders');
      const a = [], b = [], top = Math.max(10, first * 1.5) * (ha ? 1 : 0.2);
      for (let i = 1; i <= 100; i++) { const x = top * i / 100; a.push([x, Math.min(12, 8 * Math.pow(EAV / x, 2))]); b.push([x, Math.min(12, 8 * Math.pow(ELV / x, 2))]); }
      pl.set({ series: [{ pts: a, label: 'to the action value' }, { pts: b, label: 'to the limit value', dash: [5, 4] }], vlines: [{ x: first, label: 'tool 1' }] });
    }
    calc(read());
  }
  function eThermal(el) {
    const L = layout(el, 'Fanger\'s predicted mean vote (ISO 7730) combines air and radiant temperature, air speed, humidity, activity and clothing into the average thermal sensation, from −3 (cold) to +3 (hot); the PPD is the share of people dissatisfied. Even at the best conditions about 5 % are unhappy — people differ.' + link('thermal-comfort'));
    const read = form(L.form, [['ta', 'Air temperature', 23, 'n', '°C'], ['tr', 'Mean radiant temperature', 23, 'n', '°C'], ['vel', 'Air speed', 0.1, 'n', 'm/s'], ['rh', 'Relative humidity', 50, 'n', '%'],
      ['met', 'Activity', '1.2', 'sel', [['1.0', 'seated, relaxed (1.0 met)'], ['1.2', 'office work (1.2 met)'], ['1.6', 'standing, light work (1.6 met)'], ['2.0', 'medium work, walking (2.0 met)'], ['3.0', 'heavy work (3.0 met)']]],
      ['clo', 'Clothing', '0.7', 'sel', [['0.5', 'summer clothes (0.5 clo)'], ['0.7', 'light office clothes (0.7 clo)'], ['1.0', 'business suit (1.0 clo)'], ['1.5', 'winter indoor with a jumper (1.5 clo)']]]], calc);
    const pl = plotIn(L.plot, { x: { label: 'air temperature (°C)', min: 14, max: 32 }, y: { label: 'PPD (%)', min: 0, max: 100 } }, 230);
    function calc(v) {
      if (![v.ta, v.tr, v.vel, v.rh].every(Number.isFinite) || v.vel < 0) { L.stats.innerHTML = '<p class="muted">Numbers, please.</p>'; return; }
      const o = t => E().pmv({ ta: t, tr: v.tr - v.ta + t, vel: Math.max(0.05, v.vel), rh: v.rh, met: +v.met, clo: +v.clo }), r = o(v.ta);
      const cat = Math.abs(r.pmv) < 0.2 ? 'category A (|PMV| < 0.2)' : Math.abs(r.pmv) < 0.5 ? 'category B (|PMV| < 0.5)' : Math.abs(r.pmv) < 0.7 ? 'category C (|PMV| < 0.7)' : 'outside the comfort categories';
      let best = null; for (let t = 10; t <= 35; t += 0.1) { const q = o(t); if (!best || Math.abs(q.pmv) < Math.abs(best[1])) best = [t, q.pmv]; }
      L.stats.innerHTML = stat('Predicted mean vote', f1(r.pmv, 2), r.pmv > 0.5 ? 'warm' : r.pmv < -0.5 ? 'cool' : 'neutral', 'big') + stat('Dissatisfied (PPD)', f0(r.ppd) + ' %', cat) +
        stat('Neutral air temperature', f1(best[0]) + ' °C', 'for this activity and clothing (radiant temperature following the air)') + stat('Clothing surface temperature', f1(r.tcl) + ' °C', '');
      const a = []; for (let t = 14; t <= 32; t += 0.25) a.push([t, o(t).ppd]);
      pl.set({ series: [{ pts: a, label: 'PPD' }], hlines: [{ y: 10, label: 'category B (10 %)' }], marks: [{ x: v.ta, y: r.ppd, label: 'yours' }] });
    }
    calc(read());
  }
  const WBGT_REF = [['0', 'resting', 33, 32], ['1', 'low (light hand and arm work)', 30, 29], ['2', 'moderate (sustained arm and leg work)', 28, 26], ['3', 'high (heavy arm and trunk work)', 26, 23], ['4', 'very high (very intense work)', 25, 20]];
  function eHeat(el) {
    const L = layout(el, 'The wet-bulb globe temperature (ISO 7243) combines humidity, radiant heat and air temperature into one index of heat stress. Compared with a reference value for the work rate — lower for heavier work, and lower still for people not yet acclimatised — it says when to reduce work, add rest, water and shade.' + link('heat-stress') + link('outdoor-heat-sun'));
    const read = form(L.form, [['tnw', 'Natural wet-bulb temperature', 24, 'n', '°C'], ['tg', 'Globe temperature', 35, 'n', '°C'], ['ta', 'Air temperature', 30, 'n', '°C'], ['out', 'Outdoors in sunshine', true, 'check'],
      ['cls', 'Work rate', '2', 'sel', WBGT_REF.map(r => [r[0], r[1]])], ['acc', 'Workers acclimatised to the heat', true, 'check']], calc);
    function calc(v) {
      const W = E().wbgt({ tnw: v.tnw, tg: v.tg, ta: v.ta, outdoor: v.out }), r = WBGT_REF[+v.cls], ref = v.acc ? r[2] : r[3], over = W - ref;
      L.stats.innerHTML = stat('WBGT', f1(W) + ' °C', v.out ? '0.7 t_nw + 0.2 t_g + 0.1 t_a' : '0.7 t_nw + 0.3 t_g', 'big' + (over > 0 ? ' bad' : '')) +
        stat('Reference value for this work', ref + ' °C', (v.acc ? 'acclimatised' : 'not acclimatised') + ' — approximate values in the spirit of ISO 7243; check the standard') +
        stat('Verdict', over > 0 ? f1(over) + ' °C over' : 'within the reference', over > 0 ? 'lighten the work, add rest in the shade, water every 15–20 minutes, watch each other for heat illness' : 'keep drinking; conditions can change within the hour') +
        '<div style="grid-column:1/-1">' + warnBox('Heat stroke is an emergency: confusion, collapse or hot dry skin — call for help and cool the person at once.') + '</div>';
    }
    calc(read());
  }
  function eCold(el) {
    const L = layout(el, 'Wind carries heat away from exposed skin: the wind chill index (the North American formula of 2001) gives the air temperature that would cool the face as fast in calm air. Below about −27 °C wind chill, exposed skin can freeze within 30 minutes; below −40 °C within 10 minutes.' + link('cold-stress') + link('extreme-environments'));
    const read = form(L.form, [['ta', 'Air temperature', -10, 'n', '°C'], ['v', 'Wind speed (at 10 m)', 30, 'n', 'km/h']], calc);
    const pl = plotIn(L.plot, { x: { label: 'wind speed (km/h)', min: 0, max: 80 }, y: { label: 'wind chill (°C)' } }, 230);
    function calc(v) {
      const wc = E().windChill(v.ta, v.v), risk = wc > -10 ? 'low risk' : wc > -28 ? 'moderate: cover up, watch for cold injury' : wc > -40 ? 'high: exposed skin can freeze in 10–30 minutes' : wc > -48 ? 'very high: skin can freeze in 5–10 minutes' : 'severe: skin can freeze in under 5 minutes';
      L.stats.innerHTML = stat('Wind chill', f1(wc) + ' °C', v.ta > 10 ? 'the index is meant for air at 10 °C and below' : '', 'big' + (wc <= -28 ? ' bad' : '')) + stat('Frostbite risk', risk, 'guidance in the spirit of the Canadian wind chill programme') +
        stat('Work in the cold', 'warm-up breaks, layers, dry gloves', 'dexterity falls sharply once hand skin cools below about 15 °C');
      const a = [], b = [];
      for (let s = 5; s <= 80; s += 1) { a.push([s, E().windChill(v.ta, s)]); b.push([s, E().windChill(v.ta - 10, s)]); }
      pl.set({ series: [{ pts: a, label: 'air ' + f1(v.ta) + ' °C' }, { pts: b, label: 'air ' + f1(v.ta - 10) + ' °C', dash: [5, 4] }], hlines: [{ y: -28, label: 'frostbite in 10–30 min' }], marks: [{ x: v.v, y: wc, label: 'yours' }] });
    }
    calc(read());
  }
  function eLight(el) {
    const L = layout(el, 'How much light a task needs, and how many luminaires give it: E = N Φ UF MF / A, with the luminous flux Φ of each luminaire, the utilisation factor UF (how much reaches the work plane) and the maintenance factor MF (dirt and ageing). Light is only half the story — glare, contrast and colour matter as much.' + link('lighting-levels') + link('glare-colour'));
    const LI = E().LIGHTING;
    const read = form(L.form, [['task', 'Task', '4', 'sel', LI.map((r, i) => [String(i), r[0] + ' — ' + r[1] + ' lx'])], ['len', 'Room length', 8, 'n', 'm'], ['wid', 'Room width', 6, 'n', 'm'], ['phi', 'Luminous flux per luminaire', 4000, 'n', 'lm'], ['uf', 'Utilisation factor', 0.6, 'n', ''], ['mf', 'Maintenance factor', 0.8, 'n', ''], ['older', 'Older workers or reduced vision: one step up the scale', false, 'check']], calc);
    // EN 12464-1 raises the requirement by one step of its illuminance scale when, among other conditions, the workers' vision is below normal
    const SCALE = [20, 30, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000];
    const up = e => SCALE.find(s => s > e) || e;
    function calc(v) {
      const E0 = LI[+v.task][1], Em = v.older ? up(E0) : E0, A = v.len * v.wid, N = Math.ceil(Em * A / (v.phi * v.uf * v.mf));
      L.stats.innerHTML = stat('Illuminance needed', f0(Em) + ' lx', LI[+v.task][0] + (Em > E0 ? ' — one step up from ' + E0 + ' lx for older eyes' : ''), 'big') + stat('Luminaires needed', String(N), 'of ' + f0(v.phi) + ' lm each over ' + f1(A) + ' m² — ' + f1(N * v.phi * v.uf * v.mf / A, 0) + ' lx maintained') +
        stat('Watts (LED at about 120 lm/W)', f0(N * v.phi / 120) + ' W', f1(N * v.phi / 120 / A, 1) + ' W/m²');
    }
    calc(read());
  }

  /* ================================================================ THE DIMENSION FINDER */
  function ranges(el) {
    const S = H.rangeSettings || {};
    const all = [];
    for (const n of H.list) if (n.kind === 'concept' && n.ranges && n.ranges.length) n.ranges.forEach(r => all.push({ r, n }));
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every recommended range in Hyper Ergonomics in one table: what it is for, the range, the user who limits it, why it matters and where it stops working. Filter by setting or search; open a row\'s page for the whole story.</p>' +
      '<div class="row" style="flex-wrap:wrap;gap:8px;margin-bottom:10px"><input class="inp" data-q placeholder="Search: seat, door, stair, lift, noise…" style="flex:1;min-width:220px"><select class="inp" data-s><option value="">every setting</option>' + Object.entries(S).map(([k, t]) => '<option value="' + k + '">' + esc(t) + '</option>').join('') + '</select></div><div class="small muted" data-n></div><div data-t></div>';
    const q = ui.$('[data-q]', el), s = ui.$('[data-s]', el), out = ui.$('[data-t]', el), cnt = ui.$('[data-n]', el);
    const txt = x => String(x || '').replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (m, a, b) => b || a).replace(/[*_$`]/g, '');
    function show() {
      const words = q.value.toLowerCase().split(/\s+/).filter(Boolean), set = s.value;
      const rows = all.filter(({ r, n }) => (!set || [].concat(r.setting || []).includes(set) || [].concat(r.setting || []).includes('all')) && words.every(w => (txt(r.dim) + ' ' + txt(r.who) + ' ' + txt(r.why) + ' ' + txt(r.limits) + ' ' + n.title).toLowerCase().includes(w)));
      cnt.textContent = all.length ? rows.length + ' of ' + all.length + ' ranges' : '';
      out.innerHTML = !all.length ? '<p class="muted">No ranges yet — they appear here as the concept pages are written.</p>' :
        '<div class="boxy" style="overflow-x:auto"><table class="ftable"><thead><tr><th style="text-align:left">Dimension</th><th>Range</th><th style="text-align:left">Set by</th><th style="text-align:left">Why</th><th style="text-align:left">Limits</th><th style="text-align:left">Page</th></tr></thead><tbody>' +
        rows.map(({ r, n }) => '<tr><td>' + H.inline(r.dim || '') + ([].concat(r.setting || []).length ? '<div class="small faint">' + [].concat(r.setting).map(x => esc(S[x] || x)).join(' · ') + '</div>' : '') + '</td><td class="num" style="white-space:nowrap"><b>' + esc(H.rangeText ? H.rangeText(r) : String(r.range)) + '</b></td><td class="small">' + H.inline(r.who || '') + '</td><td class="small">' + H.inline(r.why || '') + '</td><td class="small">' + H.inline(r.limits || '') + (r.src ? '<div class="faint">' + H.inline(r.src) + '</div>' : '') + '</td><td class="small"><a href="#/c/' + n.id + '">' + esc(n.title) + '</a></td></tr>').join('') + '</tbody></table></div>';
    }
    q.addEventListener('input', show); s.addEventListener('change', show);
    show();
  }

  H.ergoTools = { bodysize, workstation, lifting, environment, ranges };
})();
