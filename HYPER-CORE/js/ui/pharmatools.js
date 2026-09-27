/* HYPER-CORE · ui/pharmatools.js
 *
 * The Tools pages of Hyper Pharmaceutics.
 *
 *   #/tools/pharmcalc/<dilution|alligation|isotonic|electrolytes|infusion|sterile>
 *                     pharmacy calculations: strengths and dilutions, alligation, isotonicity by the
 *                     sodium chloride equivalent and freezing point, mmol / mEq / mOsm, infusion rates,
 *                     and F0 of a steam cycle with the sterility assurance level it gives
 *   #/tools/formulation/<solubility|dissolution|release|stability|powder|emulsion>
 *                     pH and solubility, a powder dissolving, release models fitted to your data,
 *                     Arrhenius shelf life and mean kinetic temperature, powder flow, HLB and creaming
 *   #/tools/pk/<dosing|nca|twocomp|nonlinear|be|pd>
 *                     a dosing regimen, non-compartmental analysis of your data, two compartments,
 *                     saturable elimination, a bioequivalence confidence interval, dose–response
 *
 * The science is HYPER-CORE/js/pharma.js and medicine.js (tested by tools/test-pharma.js and
 * test-medicine.js). For learning: every page says the drugs are hypothetical, and none is a dosing tool.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, P = () => H.pharma, M = () => H.med;
  const n3 = (x, d) => Number.isFinite(x) ? U.fmt(x, d || 4) : '—';
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  const pc = (x, d) => Number.isFinite(x) ? (100 * x).toFixed(d == null ? 1 : d) + ' %' : '—';
  const inU = (x, q, u, d) => Number.isFinite(x) ? U.fmt(H.units.fromSI(x, q, u), d || 4) + ' ' + u : '—';
  const LEARN = 'For learning, with hypothetical drugs and numbers. Real preparation and dosing follow the product information and local protocols, with an independent check by a qualified person.';

  /* ---------------------------------------------------------------- form, layout, plots */
  // fields: [id, label, value, kind, extra]; kind 'q' (extra = [quantity, unit]: value read in the quantity's base unit),
  // 'n' (a plain number, extra = unit label), 'sel' (extra = [[value, text], …]), 'check', 'sep'
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(String(v)) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      const q = kind === 'q' ? H.units.Q[extra[0]] : null;
      const unit = q ? '<select class="munit" data-u="' + id + '">' + q.units.map(u => '<option' + (u[0] === extra[1] ? ' selected' : '') + '>' + esc(u[0]) + '</option>').join('') + '</select>' : (extra ? '<i>' + esc(extra) + '</i>' : '');
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp"><input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(String(value)) + '">' + unit + '</span></label>';
    }).join('');
    const defs = Object.fromEntries(fields.map(f => [f[0], f]));
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, d = defs[id];
        if (d[3] === 'sel') { v[id] = inp.value; return; }
        if (d[3] === 'check') { v[id] = inp.checked; return; }
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        if (d[3] === 'q') x = H.units.toSI(x, d[4][0], el.querySelector('[data-u="' + id + '"]').value);
        v[id] = x;
      });
      return v;
    };
    el.querySelectorAll('[data-u]').forEach(sel => {
      let prev = sel.value;
      sel.addEventListener('change', () => {
        const id = sel.dataset.u, q = defs[id][4][0], inp = el.querySelector('[data-f="' + id + '"]');
        const x = parseFloat(U.cleanNum(inp.value));
        if (Number.isFinite(x)) inp.value = String(Number(H.units.convert(x, q, prev, sel.value).toPrecision(5)));
        prev = sel.value;
        onChange(read());
      });
    });
    el.addEventListener('input', () => onChange(read()));
    el.addEventListener('change', e => { if (!e.target.dataset.u) onChange(read()); });
    return read;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), plot: ui.$('.mplot', el), extra: ui.$('.mextra', el) };
  }
  function plotIn(el, opts, h) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '8px';
    const cv = document.createElement('canvas'); cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    box.appendChild(cv); el.appendChild(box);
    const p = new H.Plot(cv, opts || {});
    ui.onLeave(() => p.destroy());
    return p;
  }
  // a plain canvas that redraws itself with draw(ctx, w, h) on demand and on resize
  function canvasIn(el, h, draw) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '6px';
    const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:' + h + 'px';
    box.appendChild(cv); el.appendChild(box);
    const paint = () => {
      const w = cv.clientWidth || 600, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      draw(c, w, h);
    };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => paint()); ro.observe(cv); ui.onLeave(() => ro.disconnect()); }
    return { cv, paint };
  }
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' +
      (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  // a text box of numbers, one row per line ("1, 12.5" or "1 12.5"); onChange(rows) with rows of finite numbers
  function dataBox(el, label, text, rows, onChange) {
    const wrap = document.createElement('label'); wrap.className = 'mfield';
    wrap.innerHTML = '<span>' + esc(label) + '</span><textarea class="inp" rows="' + (rows || 8) + '" spellcheck="false" style="width:100%;height:auto;font-family:var(--font-mono);font-size:13px;resize:vertical">' + esc(text) + '</textarea>';
    el.appendChild(wrap);
    const ta = ui.$('textarea', wrap);
    const parse = () => ta.value.split(/\n/).map(l => l.trim()).filter(l => l && !/^[#a-z]/i.test(l))
      .map(l => l.split(/[\s,;\t]+/).map(s => parseFloat(U.cleanNum(s)))).filter(r => r.length && r.every(Number.isFinite));
    ta.addEventListener('input', () => onChange(parse()));
    return parse;
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';
  // least squares y = a + b x, and through the origin y = b x
  function linfit(xs, ys) {
    const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    const b = sxx > 0 ? sxy / sxx : NaN;
    return { a: my - b * mx, b, r2: sxx > 0 && syy > 0 ? sxy * sxy / (sxx * syy) : NaN };
  }
  const origin = (xs, ys) => { let sxy = 0, sxx = 0; for (let i = 0; i < xs.length; i++) { sxy += xs[i] * ys[i]; sxx += xs[i] * xs[i]; } return sxx > 0 ? sxy / sxx : NaN; };
  const rsq = (obs, pred) => { const m = obs.reduce((a, b) => a + b, 0) / obs.length; let r = 0, t = 0; obs.forEach((o, i) => { r += (o - pred[i]) ** 2; t += (o - m) ** 2; }); return t > 0 ? 1 - r / t : NaN; };

  /* ================================================================ PHARMACY CALCULATIONS */
  const CALC = [['dilution', 'Strength & dilution'], ['alligation', 'Alligation'], ['isotonic', 'Isotonicity'], ['electrolytes', 'mmol, mEq & mOsm'], ['infusion', 'Infusion rates'], ['sterile', 'Sterilisation F₀']];
  function pharmcalc(el, params, sub) {
    const T = subtabs(el, 'pharmcalc', CALC, sub, LEARN);
    ({ dilution: cDilution, alligation: cAlligation, isotonic: cIsotonic, electrolytes: cElectro, infusion: cInfusion, sterile: cSterile })[T.tab](T.body);
  }
  // strengths: mg/mL <-> % w/v (g per 100 mL) <-> ratio strength 1 in X (g in mL)
  const strength = mgPerMl => f1(mgPerMl / 10, mgPerMl / 10 < 0.1 ? 3 : 2) + ' % w/v · 1 in ' + n3(1000 / mgPerMl, 3);
  function cDilution(el) {
    const L = layout(el, 'C₁V₁ = C₂V₂: how much of a stock solution makes a weaker one, and what the strengths are in % w/v and ratio form. Below, a serial dilution.' + link('dilution-concentration') + link('percent-strength'));
    const read = form(L.form, [['C1', 'Stock strength C₁', 50, 'q', ['massconc', 'mg/mL']], ['C2', 'Strength wanted C₂', 2, 'q', ['massconc', 'mg/mL']], ['V2', 'Final volume V₂', 250, 'q', ['volume', 'mL']],
      ['s1', 'Serial dilution', 0, 'sep'], ['f', 'Dilution factor per step', 10, 'n', '×'], ['k', 'Number of steps', 4, 'n']], v => calc(v));
    let last = null;
    const cyl = canvasIn(L.plot, 190, (c, w, h) => {
      if (!last) return;
      const C = ui.colors(), x0 = w / 2 - 50, top = 18, bot = h - 22, fr = Math.max(0, Math.min(1, last.V1 / last.V2));
      c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, top); c.lineTo(x0, bot); c.lineTo(x0 + 100, bot); c.lineTo(x0 + 100, top); c.stroke();
      const yS = bot - (bot - top - 4) * fr;
      c.fillStyle = C.hue(210, 0.18); c.fillRect(x0 + 2, top + 4, 96, yS - top - 4);
      c.fillStyle = C.hue(294, 0.7); c.fillRect(x0 + 2, yS, 96, bot - yS - 1);
      c.font = '12px ' + getComputedStyle(document.body).fontFamily; c.fillStyle = C.text; c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillText('stock ' + inU(last.V1, 'volume', 'mL', 3), x0 + 112, (yS + bot) / 2);
      c.fillText('diluent ' + inU(last.V2 - last.V1, 'volume', 'mL', 3), x0 + 112, (top + yS) / 2);
      c.textAlign = 'center'; c.fillStyle = C.muted; c.fillText('the final volume', x0 + 50, bot + 12);
    });
    function calc(v) {
      if (!(v.C2 < v.C1)) { L.stats.innerHTML = '<p class="muted">The strength wanted must be weaker than the stock: dilution cannot concentrate.</p>'; last = null; cyl.paint(); return; }
      const V1 = v.C2 * v.V2 / v.C1; last = { V1, V2: v.V2 };
      const mg1 = v.C1 / 1000, mg2 = v.C2 / 1000;                       // base unit mg/L -> mg/mL
      L.stats.innerHTML = stat('Stock to measure V₁', inU(V1, 'volume', 'mL', 4), 'V₁ = C₂V₂/C₁', 'big') + stat('Make up with diluent to', inU(v.V2, 'volume', 'mL', 4), 'about ' + inU(v.V2 - V1, 'volume', 'mL', 3) + ' of diluent') +
        stat('Dilution', '1 in ' + n3(v.C1 / v.C2, 4), 'the factor C₁/C₂') + stat('Stock strength', strength(mg1)) + stat('Final strength', strength(mg2)) +
        stat('Drug in the final volume', inU(v.C2 * v.V2 * 1e-3, 'mass', 'mg', 4), 'C₂ × V₂') +
        stat('After ' + v.k + ' serial steps of ×' + n3(v.f, 3), inU(v.C1 / Math.pow(v.f, v.k), 'massconc', 'mg/mL', 4), 'overall 1 in ' + n3(Math.pow(v.f, v.k), 4));
      cyl.paint();
    }
    calc(read());
  }
  function cAlligation(el) {
    const L = layout(el, 'Mixing a stronger and a weaker preparation of the same thing to get a strength between them. The parts are the differences across the diagonal: the high strength gets (wanted − low) parts, the low one (high − wanted).' + link('alligation'));
    const read = form(L.form, [['hi', 'Higher strength', 95, 'n', '%'], ['lo', 'Lower strength (0 for a diluent)', 0, 'n', '%'], ['want', 'Strength wanted', 70, 'n', '%'], ['tot', 'Total amount wanted', 500, 'n', 'g or mL']], v => calc(v));
    let last = null;
    const grid = canvasIn(L.plot, 200, (c, w, h) => {
      if (!last) return;
      const C = ui.colors(), f = getComputedStyle(document.body).fontFamily, cx = w / 2, cy = h / 2, dx = Math.min(150, w / 3), dy = 62;
      c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx - dx + 30, cy - dy + 8); c.lineTo(cx + dx - 30, cy + dy - 8); c.moveTo(cx - dx + 30, cy + dy - 8); c.lineTo(cx + dx - 30, cy - dy + 8); c.stroke();
      const t = (s, x, y, col, size) => { c.fillStyle = col; c.font = (size || 15) + 'px ' + f; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); };
      t(n3(last.hi, 4) + ' %', cx - dx, cy - dy, C.text); t(n3(last.lo, 4) + ' %', cx - dx, cy + dy, C.text);
      t(n3(last.want, 4) + ' %', cx, cy, C.accent, 17);
      t(n3(last.ph, 4) + ' parts', cx + dx, cy - dy, C.text); t(n3(last.pl, 4) + ' parts', cx + dx, cy + dy, C.text);
      t('strengths', cx - dx, 12, C.muted, 12); t('parts', cx + dx, 12, C.muted, 12);
    });
    function calc(v) {
      if (!(v.hi > v.want && v.want > v.lo)) { L.stats.innerHTML = '<p class="muted">The strength wanted must lie between the two strengths you mix.</p>'; last = null; grid.paint(); return; }
      const a = P().alligation({ high: v.hi, low: v.lo, want: v.want }), sum = a.partsHigh + a.partsLow;
      last = { hi: v.hi, lo: v.lo, want: v.want, ph: a.partsHigh, pl: a.partsLow };
      L.stats.innerHTML = stat('Parts of the ' + n3(v.hi, 3) + ' %', n3(a.partsHigh, 4), 'wanted − low') + stat('Parts of the ' + n3(v.lo, 3) + ' %', n3(a.partsLow, 4), 'high − wanted') +
        stat('Of the ' + n3(v.hi, 3) + ' %', n3(v.tot * a.partsHigh / sum, 4), 'for ' + n3(v.tot, 4) + ' in total', 'big') + stat('Of the ' + n3(v.lo, 3) + ' %', n3(v.tot * a.partsLow / sum, 4), 'the rest') +
        stat('Check', n3((v.hi * a.partsHigh + v.lo * a.partsLow) / sum, 4) + ' %', 'the weighted mean of the two');
      grid.paint();
    }
    calc(read());
  }
  // sodium chloride equivalents E: grams of NaCl with the same osmotic effect as 1 g of the substance (usual textbook values)
  const EVAL = [['0.50', 'Boric acid (E 0.50)'], ['0.16', 'Glucose monohydrate (E 0.16)'], ['0.34', 'Glycerol (E 0.34)'], ['0.76', 'Potassium chloride (E 0.76)'],
    ['0.65', 'Sodium bicarbonate (E 0.65)'], ['0.15', 'Zinc sulfate (E 0.15)'], ['0.13', 'Atropine sulfate (E 0.13)'], ['0.24', 'Pilocarpine hydrochloride (E 0.24)'],
    ['0.22', 'Lidocaine hydrochloride (E 0.22)'], ['0.21', 'Procaine hydrochloride (E 0.21)'], ['0.32', 'Phenylephrine hydrochloride (E 0.32)'], ['0', 'None'], ['other', 'Other: use the E below']];
  function cIsotonic(el) {
    const L = layout(el, 'How much sodium chloride makes a solution isotonic with tears or blood (0.9 % NaCl, freezing point −0.52 °C). Each ingredient counts as its weight × E grams of NaCl; the rest of the 0.009 g per mL is added.' + link('isotonic-calculations') + link('osmolarity-tonicity'));
    const read = form(L.form, [['V', 'Final volume', 30, 'q', ['volume', 'mL']],
      ['s1', 'Ingredient 1', 0, 'sep'], ['d1', 'Substance', '0.24', 'sel', EVAL], ['g1', 'Amount', 0.3, 'q', ['mass', 'g']], ['e1', 'E if other', 0.2, 'n'],
      ['s2', 'Ingredient 2', 0, 'sep'], ['d2', 'Substance', '0', 'sel', EVAL], ['g2', 'Amount', 0, 'q', ['mass', 'g']], ['e2', 'E if other', 0.2, 'n'],
      ['s3', 'Freezing-point method', 0, 'sep'], ['a', 'Freezing-point depression of the unadjusted solution', 0.08, 'n', '°C'], ['b', 'Depression by 1 % NaCl', 0.576, 'n', '°C']], v => calc(v));
    let last = null;
    const bar = canvasIn(L.plot, 96, (c, w, h) => {
      if (!last) return;
      const C = ui.colors(), f = getComputedStyle(document.body).fontFamily, x0 = 20, x1 = w - 20, X = p => x0 + (x1 - x0) * Math.min(1, p / 2.5), y = 40;
      c.fillStyle = C.hue(210, 0.18); c.fillRect(X(0), y - 10, X(0.6) - X(0), 20);
      c.fillStyle = C.hue(140, 0.25); c.fillRect(X(0.6), y - 10, X(2.0) - X(0.6), 20);
      c.fillStyle = C.hue(20, 0.2); c.fillRect(X(2.0), y - 10, X(2.5) - X(2.0), 20);
      c.font = '11.5px ' + f; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
      [0, 0.5, 0.9, 1.5, 2, 2.5].forEach(p => c.fillText(p + (p === 2.5 ? '+' : ''), X(p), y + 13));
      c.fillText('% NaCl equivalent: roughly tolerated by the eye between 0.6 and 2 %', (x0 + x1) / 2, y + 30);
      const mark = (p, col, t, up) => { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(X(p), y - 14); c.lineTo(X(p), y + 10); c.stroke(); c.fillStyle = col; c.textBaseline = 'bottom'; c.fillText(t, X(p), y - 15 - (up ? 11 : 0)); };
      mark(0.9, C.faint, 'isotonic', true); mark(last.before, C.accent, 'as made');
    });
    function calc(v) {
      const mL = v.V * 1e6, E = (d, e) => d === 'other' ? e : +d;
      const drugs = [[v.g1 * 1000, E(v.d1, v.e1)], [v.g2 * 1000, E(v.d2, v.e2)]];
      const eq = drugs.reduce((s, [g, e]) => s + g * e, 0), add = P().naclToAdd({ volume: mL, drugs });
      const pctBefore = eq / mL * 100, fpd = P().fpdMethod({ a: v.a, b: v.b });
      last = { before: pctBefore };
      L.stats.innerHTML = stat('NaCl to add', add >= 0 ? inU(add / 1000, 'mass', 'g', 4) : 'none', add >= 0 ? '0.009 × V − Σ(weight × E)' : 'the solution is already hypertonic by ' + inU(-add / 1000, 'mass', 'g', 3) + ' of NaCl', 'big') +
        stat('NaCl equivalent of the ingredients', inU(eq / 1000, 'mass', 'g', 4), 'Σ weight × E') + stat('Tonicity as made', n3(pctBefore, 3) + ' % NaCl eq.', '≈ ' + n3(pctBefore / 0.9 * 100, 3) + ' % of isotonic, ≈ ' + f1(pctBefore / 0.9 * 290, 0) + ' mOsm/kg') +
        stat('Or glucose monohydrate', add > 0 ? inU(add / 0.16 / 1000, 'mass', 'g', 4) : '—', 'instead of NaCl (E 0.16), where sodium is unwanted') +
        stat('Freezing-point method', fpd > 0 ? n3(fpd, 3) + ' % w/v NaCl' : 'none needed', fpd > 0 ? '(0.52 − a)/b: ' + inU(fpd / 100 * mL / 1000, 'mass', 'g', 3) + ' in this volume' : 'a ≥ 0.52 °C: isotonic or above');
      bar.paint();
    }
    calc(read());
  }
  // [name, molar mass g/mol, charges of the named ion per formula unit, particles on dissolving, ion]
  const SALTS = { nacl: ['Sodium chloride NaCl', 58.44, 1, 2, 'Na⁺'], kcl: ['Potassium chloride KCl', 74.55, 1, 2, 'K⁺'], cacl: ['Calcium chloride dihydrate CaCl₂·2H₂O', 147.01, 2, 3, 'Ca²⁺'],
    mgso: ['Magnesium sulfate heptahydrate MgSO₄·7H₂O', 246.47, 2, 2, 'Mg²⁺'], mgcl: ['Magnesium chloride hexahydrate MgCl₂·6H₂O', 203.30, 2, 3, 'Mg²⁺'], bicarb: ['Sodium bicarbonate NaHCO₃', 84.01, 1, 2, 'Na⁺'],
    lact: ['Sodium lactate', 112.06, 1, 2, 'Na⁺'], kphos: ['Dipotassium phosphate K₂HPO₄', 174.18, 2, 3, 'K⁺'], glu: ['Glucose, anhydrous', 180.16, 0, 1, '—'], other: ['Other: use the values below', NaN, 1, 2, 'ion'] };
  function cElectro(el) {
    const L = layout(el, 'Millimoles count formula units; milliequivalents count charge (mmol × charge); milliosmoles count dissolved particles (mmol × particles, for an ideal solution). One gram of potassium chloride is 13.4 mmol, 13.4 mEq of K⁺ and about 27 mOsm.' + link('meq-mmol') + link('osmolarity-tonicity'));
    const read = form(L.form, [['s', 'Substance', 'kcl', 'sel', Object.entries(SALTS).map(([k, s]) => [k, s[0]])], ['m', 'Amount', 1, 'q', ['mass', 'g']], ['V', 'Dissolved in', 1000, 'q', ['volume', 'mL']],
      ['s1', 'For "other"', 0, 'sep'], ['MW', 'Molar mass', 100, 'n', 'g/mol'], ['z', 'Charges of the ion per formula unit', 1, 'n'], ['np', 'Particles per formula unit', 2, 'n']], v => calc(v));
    function calc(v) {
      const s = SALTS[v.s], other = v.s === 'other', MW = other ? v.MW : s[1], z = other ? v.z : s[2], np = other ? v.np : s[3];
      const mg = v.m * 1e6, L_ = v.V * 1000, mmol = mg / MW, meq = P().mEq({ mg, MW, valence: z }), mosm = mmol * np;
      L.stats.innerHTML = stat('Millimoles', n3(mmol, 4) + ' mmol', 'mg ÷ molar mass (' + n3(MW, 5) + ' g/mol)', 'big') +
        stat('Milliequivalents' + (z ? ' of ' + (other ? 'the ion' : s[4]) : ''), z ? n3(meq, 4) + ' mEq' : '— (not an electrolyte)', z ? 'mmol × ' + z : '') +
        stat('Milliosmoles (ideal)', n3(mosm, 4) + ' mOsm', 'mmol × ' + np + ' particles') +
        stat('Concentration', n3(mmol / L_, 4) + ' mmol/L', (z ? n3(meq / L_, 4) + ' mEq/L · ' : '') + n3(mosm / L_, 4) + ' mOsm/L') +
        stat('Strength', f1(mg / (L_ * 1000) / 10, 3) + ' % w/v', 'g per 100 mL') +
        stat('Real osmolality', '≈ ' + n3(mosm / L_ * (np > 1 ? 0.93 : 1), 3) + ' mOsm/kg', np > 1 ? 'ions attract each other: the osmotic coefficient of a salt like NaCl is about 0.93' : 'close to ideal for a non-electrolyte');
    }
    calc(read());
  }
  const RATE = [['ugkgmin', 'µg/kg/min'], ['mgkgh', 'mg/kg/h'], ['mgh', 'mg/h'], ['mgmin', 'mg/min']];
  function cInfusion(el) {
    const L = layout(el, 'From a dose rate to a pump rate and a drip rate, for a hypothetical drug. Real infusions are set from the product information and local protocols, programmed with pump safety limits and checked independently.' + link('infusion-rates') + link('dose-calculations'));
    const read = form(L.form, [['w', 'Body weight', 70, 'q', ['mass', 'kg']], ['r', 'Dose rate', 5, 'n'], ['ru', 'Dose-rate unit', 'ugkgmin', 'sel', RATE],
      ['s1', 'The bag or syringe', 0, 'sep'], ['amt', 'Drug in it', 400, 'q', ['mass', 'mg']], ['vol', 'Volume', 250, 'q', ['volume', 'mL']],
      ['df', 'Giving set', '20', 'sel', [['20', 'Standard set, 20 drops/mL'], ['15', 'Blood set, 15 drops/mL'], ['60', 'Microdrip set, 60 drops/mL']]]], v => calc(v));
    function calc(v) {
      const kg = v.w, mgPerH = v.r * ({ ugkgmin: kg * 60 / 1000, mgkgh: kg, mgh: 1, mgmin: 60 })[v.ru];
      const conc = v.amt * 1e6 / (v.vol * 1e6), mLh = mgPerH / conc, dpm = mLh * +v.df / 60;
      L.stats.innerHTML = stat('Concentration', n3(conc, 4) + ' mg/mL', n3(conc * 1000, 4) + ' µg/mL') + stat('Drug per hour', n3(mgPerH, 4) + ' mg/h', n3(mgPerH / kg * 1000 / 60, 4) + ' µg/kg/min') +
        stat('Pump rate', n3(mLh, 4) + ' mL/h', 'mg/h ÷ mg/mL', 'big') + stat('Drip rate', n3(dpm, 3) + ' drops/min', 'mL/h × ' + v.df + ' drops/mL ÷ 60') +
        stat('The bag lasts', n3(v.vol * 1e6 / mLh, 4) + ' h', 'volume ÷ pump rate');
    }
    calc(read());
  }
  function cSterile(el) {
    const L = layout(el, 'The lethality of a moist-heat cycle: each minute at T counts as 10^((T − 121.1)/z) minutes at 121.1 °C, and F₀ adds them up — heating and cooling included. The log reduction is F₀ / D₁₂₁; the sterility assurance level is the chance that an item keeps one survivor.' + link('sterility-assurance') + link('sterilisation-methods'));
    const pT = plotIn(L.plot, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)' } }, 210);
    const pF = plotIn(L.plot, { x: { label: 'time (min)', min: 0 }, y: { label: 'F₀ accumulated (min)', min: 0 } }, 190);
    const read = form(L.form, [['Th', 'Hold temperature', 121.1, 'n', '°C'], ['th', 'Hold time', 15, 'n', 'min'], ['tu', 'Heating from 100 °C', 10, 'n', 'min'], ['td', 'Cooling to 100 °C', 12, 'n', 'min'],
      ['s1', 'Microbes', 0, 'sep'], ['z', 'z value', 10, 'n', '°C'], ['D', 'D₁₂₁ of the most resistant spores', 1.5, 'n', 'min'], ['N0', 'Bioburden per item', 1000, 'n', 'CFU']], v => calc(v));
    function calc(v) {
      if (!(v.Th > 100 && v.z > 0 && v.D > 0 && v.th >= 0 && v.tu >= 0 && v.td >= 0)) { L.stats.innerHTML = '<p class="muted">Enter a hold above 100 °C and positive times, z and D.</p>'; return; }
      const prof = [], step = 0.25, T = v.tu + v.th + v.td;
      for (let t = 0; t <= T + 1e-9; t += step) prof.push([t, t < v.tu ? 100 + (v.Th - 100) * t / (v.tu || 1) : t <= v.tu + v.th ? v.Th : v.Th - (v.Th - 100) * (t - v.tu - v.th) / (v.td || 1)]);
      const F0 = P().f0(prof, v.z), LR = P().logReduction(F0, v.D), sal = v.N0 * Math.pow(10, -LR), hold = v.th * Math.pow(10, (v.Th - 121.1) / v.z);
      const cum = [[0, 0]]; for (let i = 1; i < prof.length; i++) cum.push([prof[i][0], P().f0(prof.slice(0, i + 1), v.z)]);
      L.stats.innerHTML = stat('F₀', n3(F0, 4) + ' min', 'of which the hold gives ' + n3(hold, 3), 'big') + stat('Log reduction', n3(LR, 3), 'F₀ ÷ D₁₂₁') +
        stat('Sterility assurance level', sal > 0 ? '1 in ' + n3(1 / sal, 3) : '—', 'probability of a surviving microbe per item', sal <= 1e-6 ? 'good' : 'bad') +
        stat('Against SAL 10⁻⁶', sal <= 1e-6 ? 'met' : 'not met', 'the usual target for terminally sterilised products');
      pT.set({ series: [{ pts: prof, label: 'chamber and load' }], hlines: [{ y: 121.1, label: '121.1 °C' }] });
      pF.set({ series: [{ pts: cum, label: 'F₀' }], hlines: [{ y: 12, label: 'overkill: F₀ 12 min' }] });
    }
    calc(read());
  }

  /* ================================================================ FORMULATION */
  const FORM = [['solubility', 'pH & solubility'], ['dissolution', 'Dissolution'], ['release', 'Release models'], ['stability', 'Stability & shelf life'], ['powder', 'Powders & tablets'], ['emulsion', 'HLB & emulsions']];
  function formulation(el, params, sub) {
    const T = subtabs(el, 'formulation', FORM, sub, 'For learning and first estimates, with hypothetical drugs. Formulations are proven by experiment and by the pharmacopoeia\'s tests, not by these models.');
    ({ solubility: fSol, dissolution: fDiss, release: fRel, stability: fStab, powder: fPowder, emulsion: fEmul })[T.tab](T.body);
  }
  function fSol(el) {
    const L = layout(el, 'A weak acid dissolves more as the pH rises past its pKa, a weak base as it falls: the un-ionised form has a fixed intrinsic solubility S₀ and the ionised form adds to it, until the salt itself runs out of room at pH_max. log D is the partition of all forms together between octanol and water.' + link('ph-solubility') + link('ionisation-pka') + link('partition-logp'));
    const pS = plotIn(L.plot, { x: { label: 'pH', min: 0, max: 12 }, y: { label: 'solubility (mg/mL)', log: true } }, 250);
    const pD = plotIn(L.plot, { x: { label: 'pH', min: 0, max: 12 }, y: { label: 'log D' } }, 190);
    const read = form(L.form, [['acid', 'The drug is a', 'acid', 'sel', [['acid', 'weak acid'], ['base', 'weak base']]], ['pKa', 'pKa', 4.2, 'n'], ['S0', 'Intrinsic solubility S₀', 20, 'q', ['massconc', 'µg/mL']],
      ['Ss', 'Solubility of the salt', 50, 'q', ['massconc', 'mg/mL']], ['logP', 'log P (un-ionised)', 3, 'n'], ['pH', 'pH', 6.8, 'n'], ['dose', 'Highest dose', 200, 'q', ['mass', 'mg']]], v => calc(v));
    function calc(v) {
      const acid = v.acid === 'acid', S0 = v.S0 / 1000, Ss = v.Ss / 1000;          // mg/mL
      const S = pH => Math.min(P().solubility({ S0, pKa: v.pKa, pH, acid }), Ss * (1 + Math.pow(10, acid ? v.pKa - pH : pH - v.pKa)));
      const pHmax = acid ? v.pKa + Math.log10(Ss / S0) : v.pKa - Math.log10(Ss / S0);
      let Smin = Infinity; for (let p = 1.2; p <= 6.8 + 1e-9; p += 0.05) Smin = Math.min(Smin, S(p));
      const dmg = v.dose * 1e6, need = dmg / Smin, here = S(v.pH);
      L.stats.innerHTML = stat('Solubility at pH ' + n3(v.pH, 3), n3(here, 4) + ' mg/mL', n3(here / S0, 3) + ' × S₀', 'big') + stat('Ionised at pH ' + n3(v.pH, 3), pc(P().ionised(v.pKa, v.pH, acid), 2)) +
        stat('log D at pH ' + n3(v.pH, 3), n3(P().logD(v.logP, v.pKa, v.pH, acid), 3), 'log P = ' + n3(v.logP, 3)) + stat('pH_max', n3(pHmax, 3), acid ? 'above it the salt limits solubility' : 'below it the salt limits solubility') +
        stat('Volume for the highest dose', n3(need, 4) + ' mL', 'at the least favourable pH from 1.2 to 6.8') +
        stat('BCS solubility', need <= 250 ? 'high' : 'low', need <= 250 ? 'the dose dissolves in 250 mL across pH 1.2–6.8' : 'the dose needs more than 250 mL somewhere from pH 1.2 to 6.8', need <= 250 ? 'good' : 'bad');
      const pts = [], pd = []; for (let p = 0; p <= 12 + 1e-9; p += 0.05) { pts.push([p, S(p)]); pd.push([p, P().logD(v.logP, v.pKa, p, acid)]); }
      const gi = [{ x: 1.2, label: 'gastric 1.2' }, { x: 4.5, label: '4.5' }, { x: 6.8, label: 'intestinal 6.8' }];
      pS.set({ series: [{ pts, label: 'total solubility' }], vlines: gi, hlines: [{ y: dmg / 250, label: 'dose in 250 mL' }], marks: [{ x: v.pH, y: here, label: 'here' }] });
      pD.set({ series: [{ pts: pd, label: 'log D' }], vlines: gi, hlines: [{ y: v.logP, label: 'log P' }] });
    }
    calc(read());
  }
  function fDiss(el) {
    const L = layout(el, 'A powder of equal spheres dissolving by Noyes–Whitney: each particle loses mass through a diffusion layer as thin as its own radius (at most 30 µm), in a stirred vessel. Smaller particles have more surface per gram, so they dissolve faster — unless the solution is near saturation.' + link('dissolution-rate') + link('particle-size') + link('dissolution-testing'));
    const pl = plotIn(L.plot, { x: { label: 'time (min)', min: 0 }, y: { label: 'dissolved (%)', min: 0, max: 100 } }, 260);
    const read = form(L.form, [['dose', 'Dose', 100, 'q', ['mass', 'mg']], ['d', 'Particle diameter', 20, 'q', ['length', 'µm']], ['rho', 'Particle density', 1.3, 'q', ['density', 'g/cm³']],
      ['Cs', 'Solubility C_s', 0.5, 'q', ['massconc', 'mg/mL']], ['D', 'Diffusion coefficient', 7, 'n', '× 10⁻¹⁰ m²/s'], ['V', 'Medium volume', 900, 'q', ['volume', 'mL']], ['T', 'Test length', 60, 'n', 'min']], v => calc(v));
    function calc(v) {
      if (!(v.dose > 0 && v.d > 0 && v.Cs > 0 && v.V > 0 && v.T > 0 && v.D > 0 && v.rho > 0)) { L.stats.innerHTML = '<p class="muted">All the inputs must be positive.</p>'; return; }
      const T = v.T * 60, dt = T / 1200, Cs = v.Cs / 1000;                          // kg/m³ = mg/mL
      const run = f => P().dissolve({ dose: v.dose, r0: v.d * f / 2, rho: v.rho, Cs, D: v.D * 1e-10, V: v.V, T, dt }).map(([t, x]) => [t / 60, 100 * x]);
      const main = run(1), fine = run(0.25), coarse = run(4);
      const at = min => { const i = Math.min(main.length - 1, Math.round(min * 60 / dt)); return main[i][1]; };
      const t85 = (main.find(p => p[1] >= 85) || [NaN])[0], sink = Cs * v.V / v.dose, max = Math.min(100, sink * 100);
      L.stats.innerHTML = stat('At 15 min', f1(at(15)) + ' %') + stat('At 30 min', f1(at(30)) + ' %', '', at(30) >= 85 ? 'good' : '') + stat('At the end', f1(main[main.length - 1][1]) + ' %') +
        stat('Time to 85 %', Number.isFinite(t85) ? f1(t85) + ' min' : 'not reached', '85 % in 15 min counts as very rapidly dissolving, in 30 min as rapidly', 'big') +
        stat('Sink factor', n3(sink, 3), sink >= 3 ? 'C_s·V / dose ≥ 3: sink conditions' : 'below 3: the medium nears saturation; at most ' + f1(max) + ' % can dissolve', sink >= 3 ? 'good' : 'bad');
      pl.set({ series: [{ pts: main, label: 'this powder' }, { pts: fine, label: 'particles ¼ the size', dash: [6, 4] }, { pts: coarse, label: '4 × the size', dash: [2, 3] }], hlines: [{ y: 85, label: '85 %' }] });
    }
    calc(read());
  }
  // release models fitted by linearising each one; R² is on the percentage released so they compare fairly
  const MODELS = [
    ['zero', 'Zero order', 'Q = k·t'], ['first', 'First order', 'Q = 100(1 − e^(−kt))'], ['higuchi', 'Higuchi', 'Q = k·√t'],
    ['kp', 'Korsmeyer–Peppas', 'Q = k·tⁿ (Q ≤ 60 %)'], ['hixson', 'Hixson–Crowell', '∛100 − ∛(100 − Q) = k·t'], ['weibull', 'Weibull', 'Q = 100(1 − e^(−tᵇ/a))']];
  function fitRelease(rows) {
    const t = rows.map(r => r[0]), q = rows.map(r => r[1]), out = {};
    const ok = (i, lim) => t[i] > 0 && q[i] > 0 && q[i] < (lim || 100);
    const sel = lim => t.map((_, i) => i).filter(i => ok(i, lim));
    const k0 = origin(t, q); out.zero = { k: k0, f: x => k0 * x };
    let I = sel(); const k1 = origin(I.map(i => t[i]), I.map(i => -Math.log(1 - q[i] / 100))); out.first = { k: k1, f: x => 100 * (1 - Math.exp(-k1 * x)) };
    const kh = origin(t.map(Math.sqrt), q); out.higuchi = { k: kh, f: x => kh * Math.sqrt(x) };
    I = sel(60.0001); if (I.length >= 2) { const r = linfit(I.map(i => Math.log(t[i])), I.map(i => Math.log(q[i]))); const kk = Math.exp(r.a), n = r.b; out.kp = { k: kk, n, f: x => kk * Math.pow(x, n), pts: I.length }; }
    const c = Math.cbrt(100), kx = origin(t, q.map(x => c - Math.cbrt(Math.max(0, 100 - x)))); out.hixson = { k: kx, f: x => 100 - Math.pow(Math.max(0, c - kx * x), 3) };
    I = sel(); if (I.length >= 2) { const r = linfit(I.map(i => Math.log(t[i])), I.map(i => Math.log(-Math.log(1 - q[i] / 100)))); const b = r.b, a = Math.exp(-r.a); out.weibull = { a, b, f: x => 100 * (1 - Math.exp(-Math.pow(x, b) / a)) }; }
    for (const m of Object.values(out)) m.r2 = rsq(q, t.map(x => Math.min(100, Math.max(0, m.f(x)))));
    return out;
  }
  function fRel(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Paste a release profile — time and % released, one pair per line — and each classic model is fitted to it. The best fit hints at the mechanism: √t for diffusion from a matrix, a constant rate for an osmotic or erosion-controlled system. A second profile at the same times gives the similarity factor f₂.' +
      link('release-kinetics') + link('f2-similarity') + link('modified-release') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el), pl = plotIn(ui.$('.mplot', el), { x: { label: 'time', min: 0 }, y: { label: 'released (%)', min: 0, max: 100 } }, 280), extra = ui.$('.mextra', el);
    const readA = dataBox(fEl, 'Profile: time, % released', '0.5, 18\n1, 26\n2, 37\n3, 45\n4, 52\n6, 63\n8, 72\n10, 79\n12, 85', 10, () => calc());
    const readB = dataBox(fEl, 'Second profile for f₂ (optional)', '0.5, 12\n1, 19\n2, 30\n3, 39\n4, 47\n6, 60\n8, 70\n10, 78\n12, 84', 10, () => calc());
    function calc() {
      const rows = readA().filter(r => r.length >= 2).sort((a, b) => a[0] - b[0]);
      if (rows.length < 3) { stats.innerHTML = '<p class="muted">At least three time points are needed.</p>'; return; }
      const fit = fitRelease(rows), best = MODELS.filter(m => fit[m[0]]).sort((a, b) => fit[b[0]].r2 - fit[a[0]].r2)[0][0];
      const kp = fit.kp, mech = !kp ? '' : kp.n <= 0.45 ? 'n ≤ 0.45: Fickian diffusion (for a cylinder)' : kp.n < 0.89 ? '0.45 < n < 0.89: anomalous — diffusion and swelling together' : kp.n < 1.0 ? 'n ≈ 0.89: case II, relaxation-controlled' : 'n > 0.89: super case II';
      stats.innerHTML = MODELS.filter(m => fit[m[0]]).map(([k, name, eq]) => {
        const m = fit[k], par = k === 'kp' ? 'k = ' + n3(m.k, 3) + ', n = ' + n3(m.n, 3) : k === 'weibull' ? 'a = ' + n3(m.a, 3) + ', b = ' + n3(m.b, 3) : 'k = ' + n3(m.k, 4);
        return stat(name, m.r2 < 0 ? 'R² < 0' : 'R² = ' + f1(m.r2, 4), (m.r2 < 0 ? 'worse than a flat line · ' : '') + eq + ' · ' + par, k === best ? 'big' : '');
      }).join('') + (kp ? stat('Release exponent', 'n = ' + n3(kp.n, 3), mech + ' (from ' + kp.pts + ' points)') : '');
      const tmax = rows[rows.length - 1][0], xs = []; for (let i = 0; i <= 120; i++) xs.push(tmax * i / 120);
      const series = [{ pts: rows.map(r => [r[0], r[1]]), line: false, dots: 4, label: 'data', color: ui.colors().text }]
        .concat(MODELS.filter(m => fit[m[0]]).map(([k, name]) => ({ pts: xs.map(x => [x, Math.min(100, Math.max(0, fit[k].f(x)))]), label: name, width: k === best ? 2.6 : 1.3, dash: k === best ? null : [5, 4] })));
      const B = readB().filter(r => r.length >= 2), pairs = rows.map(r => [r[1], (B.find(b => Math.abs(b[0] - r[0]) < 1e-9) || [])[1]]).filter(p => Number.isFinite(p[1]));
      if (pairs.length >= 3) {
        const f2 = P().f2(pairs.map(p => p[0]), pairs.map(p => p[1]));
        series.push({ pts: B.map(r => [r[0], r[1]]), line: false, dots: 3.5, label: 'second profile', color: ui.colors().series[1] });
        extra.innerHTML = '<div class="mstats">' + stat('Similarity factor f₂', n3(f2, 3), f2 >= 50 ? '≥ 50: the profiles are similar (differences under about 10 % on average)' : 'below 50: not similar', f2 >= 50 ? 'good' : 'bad') +
          stat('Points compared', String(pairs.length), 'regulators use one point above 85 % at most, and at least three points') + '</div>';
      } else extra.innerHTML = '';
      pl.set({ series });
    }
    calc();
  }
  const R = 8.314462618;
  function fStab(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Rate constants measured at raised temperatures, fitted to Arrhenius (ln k against 1/T) and extrapolated to the storage temperature: the idea behind accelerated stability studies. Real shelf lives are set from real-time data under ICH Q1A(R2) (2003) and Q1E.' +
      link('shelf-life') + link('stability-testing') + link('reaction-order') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el), plots = ui.$('.mplot', el), extra = ui.$('.mextra', el);
    const pA = plotIn(plots, { x: { label: '1000 / T (1/K)' }, y: { label: 'ln k' } }, 220), pC = plotIn(plots, { x: { label: 'time at the storage temperature (months)', min: 0 }, y: { label: 'drug remaining (%)', max: 100 } }, 200);
    const opts = document.createElement('div'); fEl.appendChild(opts);
    const read = form(opts, [['order', 'Reaction order', '1', 'sel', [['1', 'first order (k in 1/month)'], ['0', 'zero order (k in % per month)']]], ['Ts', 'Storage temperature', 25, 'n', '°C']], () => calc());
    const readK = dataBox(fEl, 'Study: temperature °C, k', '40, 0.011\n50, 0.029\n60, 0.072', 5, () => calc());
    const mktBox = document.createElement('div'); fEl.appendChild(mktBox);
    mktBox.innerHTML = '<div class="msep">Mean kinetic temperature</div>';
    const readM = dataBox(mktBox, 'Monthly mean temperatures, °C', '18\n19\n21\n24\n27\n29\n30\n29\n26\n23\n20\n18', 8, () => calc());
    function calc() {
      const v = read(), zero = v.order === '0', rows = readK().filter(r => r.length >= 2 && r[1] > 0);
      if (rows.length < 2) { stats.innerHTML = '<p class="muted">Enter at least two temperatures with their rate constants.</p>'; return; }
      const fit = linfit(rows.map(r => 1 / (r[0] + 273.15)), rows.map(r => Math.log(r[1]))), Ea = -fit.b * R, Ts = v.Ts + 273.15;
      const kS = Math.exp(fit.a + fit.b / Ts), q10 = Math.exp(fit.b * (1 / (Ts + 10) - 1 / Ts)), t90 = P().t90({ order: zero ? 0 : 1, k: kS, C0: 100 });
      const temps = readM().map(r => r[0]), dH = 83.144e3;
      const mkt = temps.length ? dH / R / -Math.log(temps.reduce((s, x) => s + Math.exp(-dH / (R * (x + 273.15))), 0) / temps.length) - 273.15 : NaN;
      stats.innerHTML = stat('Activation energy', n3(Ea / 1000, 3) + ' kJ/mol', 'R² of the Arrhenius line ' + f1(fit.r2, 4)) + stat('k at ' + n3(v.Ts, 3) + ' °C', n3(kS, 3) + (zero ? ' %/month' : ' /month')) +
        stat('t₉₀ at ' + n3(v.Ts, 3) + ' °C', n3(t90, 3) + ' months', '≈ ' + n3(t90 / 12, 3) + ' years to 90 % of the label claim', 'big') + stat('Q₁₀', n3(q10, 3), 'the rate multiplies by this for each 10 °C near the storage temperature');
      extra.innerHTML = temps.length ? '<div class="mstats">' + stat('Mean kinetic temperature', f1(mkt) + ' °C', 'ΔH = 83.144 kJ/mol (USP): warm months weigh more than the plain mean of ' + f1(temps.reduce((a, b) => a + b, 0) / temps.length) + ' °C') + '</div>' : '';
      const xs = rows.map(r => 1000 / (r[0] + 273.15)), x0 = Math.min(1000 / Ts, ...xs), x1 = Math.max(1000 / Ts, ...xs);
      pA.set({ series: [{ pts: rows.map(r => [1000 / (r[0] + 273.15), Math.log(r[1])]), line: false, dots: 4.5, label: 'measured' }, { pts: [[x0, fit.a + fit.b * x0 / 1000], [x1, fit.a + fit.b * x1 / 1000]], dash: [6, 4], label: 'Arrhenius fit' }],
        marks: [{ x: 1000 / Ts, y: Math.log(kS), label: n3(v.Ts, 3) + ' °C' }] });
      const tEnd = Math.min(600, Math.max(12, 1.6 * t90)), curve = []; for (let i = 0; i <= 200; i++) { const t = tEnd * i / 200; curve.push([t, P().degrade({ order: zero ? 0 : 1, k: kS, C0: 100, t })]); }
      pC.set({ series: [{ pts: curve, label: 'at ' + n3(v.Ts, 3) + ' °C' }], hlines: [{ y: 90, label: '90 %' }], vlines: [{ x: t90, label: 't₉₀' }] });
    }
    calc();
  }
  // USP <1174> flow scales: [character, Carr index up to, Hausner up to, angle of repose up to]
  const FLOW = [['Excellent', 10, 1.11, 30], ['Good', 15, 1.18, 35], ['Fair', 20, 1.25, 40], ['Passable', 25, 1.34, 45], ['Poor', 31, 1.45, 55], ['Very poor', 37, 1.59, 65], ['Very, very poor', Infinity, Infinity, Infinity]];
  function fPowder(el) {
    const L = layout(el, 'How well a powder will flow into a die, from its bulk and tapped densities (compressibility) and its angle of repose, on the scales of USP <1174>; and the tensile strength of a tablet from a diametral crushing test.' + link('powder-flow') + link('compaction') + link('tablet-testing'));
    const read = form(L.form, [['b', 'Bulk density', 0.45, 'q', ['density', 'g/mL']], ['t', 'Tapped density', 0.6, 'q', ['density', 'g/mL']], ['a', 'Angle of repose', 38, 'n', '°'],
      ['s1', 'Tablet crushing test', 0, 'sep'], ['F', 'Breaking force', 90, 'q', ['force', 'N']], ['D', 'Diameter', 10, 'q', ['length', 'mm']], ['h', 'Thickness', 4, 'q', ['length', 'mm']]], v => calc(v));
    function calc(v) {
      if (!(v.t >= v.b && v.b > 0)) { L.stats.innerHTML = '<p class="muted">The tapped density must be at least the bulk density.</p>'; return; }
      const ci = P().carr(v.b, v.t), hr = P().hausner(v.b, v.t), row = x => FLOW.findIndex(r => x <= r[1] + 1e-9), i = row(ci), j = FLOW.findIndex(r => v.a <= r[3]), sig = 2 * v.F / (Math.PI * v.D * v.h);
      L.stats.innerHTML = stat('Compressibility (Carr) index', f1(ci) + ' %', '100 (1 − ρ_bulk/ρ_tapped)') + stat('Hausner ratio', n3(hr, 3), 'ρ_tapped/ρ_bulk') + stat('Flow from compressibility', FLOW[i][0].toLowerCase(), '', 'big') +
        stat('Flow from angle of repose', FLOW[Math.max(0, j)][0].toLowerCase(), '') + stat('Tablet tensile strength', inU(sig, 'pressure', 'MPa', 3), 'σ = 2F/(πDt); about 1–2 MPa is usually strong enough to handle and coat', sig >= 1e6 ? 'good' : '');
      L.extra.innerHTML = '<div class="simtable mt"><table class="ftable"><thead><tr><th>Flow</th><th>Compressibility index (%)</th><th>Hausner ratio</th><th>Angle of repose (°)</th></tr></thead><tbody>' +
        FLOW.map((r, k) => '<tr' + (k === i ? ' style="background:var(--accent-bg)"' : '') + '><td>' + r[0] + '</td><td>' + (k ? (FLOW[k - 1][1] + 1) + (r[1] < Infinity ? '–' + r[1] : '+') : '≤ ' + r[1]) + '</td><td>' +
          (k ? (FLOW[k - 1][2] + 0.01).toFixed(2) + (r[2] < Infinity ? '–' + r[2].toFixed(2) : '+') : '1.00–' + r[2].toFixed(2)) + '</td><td>' + (k ? (FLOW[k - 1][3] + 1) + (r[3] < Infinity ? '–' + r[3] : '+') : '25–' + r[3]) + '</td></tr>').join('') + '</tbody></table></div>';
    }
    calc(read());
  }
  const SURF = [['1.8', 'Sorbitan trioleate (HLB 1.8)'], ['3.8', 'Glyceryl monostearate (HLB 3.8)'], ['4.3', 'Sorbitan monooleate (HLB 4.3)'], ['4.7', 'Sorbitan monostearate (HLB 4.7)'],
    ['6.7', 'Sorbitan monopalmitate (HLB 6.7)'], ['8.6', 'Sorbitan monolaurate (HLB 8.6)'], ['11', 'Polysorbate 85 (HLB 11.0)'], ['14.9', 'Polysorbate 60 (HLB 14.9)'], ['15', 'Polysorbate 80 (HLB 15.0)'],
    ['15.6', 'Polysorbate 40 (HLB 15.6)'], ['16.7', 'Polysorbate 20 (HLB 16.7)'], ['16.9', 'Polyoxyl 40 stearate (HLB 16.9)'], ['18', 'Sodium oleate (HLB 18)'], ['40', 'Sodium lauryl sulfate (HLB about 40)']];
  const HLB_USE = [[1.5, 3, 'antifoams', 20], [3, 6, 'w/o emulsifiers', 200], [7, 9, 'wetting agents', 50], [8, 18, 'o/w emulsifiers', 140], [13, 15, 'detergents', 320], [15, 18, 'solubilisers', 280]];
  function fEmul(el) {
    const L = layout(el, 'Two surfactants blended to the HLB an oil phase needs: HLB values mix in proportion to weight. Below, how fast the droplets cream (or particles settle) by Stokes\' law — the reason small droplets and a thicker continuous phase keep an emulsion or suspension uniform longer.' + link('surfactants') + link('emulsions') + link('suspensions'));
    const read = form(L.form, [['a', 'Low-HLB surfactant', '4.3', 'sel', SURF], ['b', 'High-HLB surfactant', '15', 'sel', SURF], ['req', 'Required HLB of the oil phase', 10.5, 'n'], ['m', 'Total emulsifier', 5, 'q', ['mass', 'g']],
      ['s1', 'Creaming or settling (Stokes)', 0, 'sep'], ['d', 'Droplet or particle diameter', 5, 'q', ['length', 'µm']], ['rp', 'Its density', 0.85, 'q', ['density', 'g/mL']], ['rf', 'Continuous phase density', 1.0, 'q', ['density', 'g/mL']],
      ['eta', 'Continuous phase viscosity', 1, 'q', ['viscosity', 'mPa·s']], ['H', 'Height of the container', 10, 'q', ['length', 'cm']]], v => calc(v));
    let last = null;
    const scale = canvasIn(L.plot, 150, (c, w, h) => {
      if (!last) return;
      const C = ui.colors(), f = getComputedStyle(document.body).fontFamily, x0 = 16, x1 = w - 16, X = v => x0 + (x1 - x0) * Math.min(20, v) / 20;
      HLB_USE.forEach(([lo, hi, t, hue], i) => { const y = 14 + i * 15; c.fillStyle = C.hue(hue, 0.35); c.fillRect(X(lo), y, X(hi) - X(lo), 11); c.fillStyle = C.text; c.font = '10.5px ' + f; c.textBaseline = 'middle'; c.textAlign = hi > 15 ? 'right' : 'left'; c.fillText(t, hi > 15 ? X(lo) - 4 : X(hi) + 4, y + 6); });
      const ya = 14 + HLB_USE.length * 15 + 8;
      c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, ya); c.lineTo(x1, ya); c.stroke();
      c.fillStyle = C.muted; c.font = '11px ' + f; c.textAlign = 'center'; c.textBaseline = 'top'; for (let k = 0; k <= 20; k += 2) c.fillText(k, X(k), ya + 3);
      const mk = (x, col, t) => { c.fillStyle = col; c.beginPath(); c.moveTo(X(x), ya - 1); c.lineTo(X(x) - 5, ya - 9); c.lineTo(X(x) + 5, ya - 9); c.fill(); c.textBaseline = 'top'; c.fillText(t, X(x), ya + 16); };
      mk(last.a, C.series[1], 'A'); mk(last.b, C.series[2], last.b > 20 ? 'B (' + last.b + ')' : 'B'); mk(last.req, C.accent, 'required');
    });
    function calc(v) {
      const a = +v.a, b = +v.b, fb = (v.req - a) / (b - a), ok = b > a && fb >= 0 && fb <= 1;
      last = { a, b, req: v.req };
      const u = P().stokes({ d: v.d, rhoP: v.rp, rhoF: v.rf, eta: v.eta }), speed = Math.abs(u), tH = v.H / speed;
      L.stats.innerHTML = (ok ? stat('Low-HLB surfactant', pc(1 - fb, 1), inU(v.m * (1 - fb), 'mass', 'g', 3)) + stat('High-HLB surfactant', pc(fb, 1), inU(v.m * fb, 'mass', 'g', 3), 'big') +
          stat('Blend HLB', n3(P().hlbMix([[1 - fb, a], [fb, b]]), 3), v.req >= 8 ? 'in the oil-in-water range' : v.req <= 6 ? 'in the water-in-oil range' : 'between the w/o and o/w ranges')
        : stat('Blend', 'not possible', 'the required HLB must lie between the two surfactants (low first)', 'bad')) +
        stat(u < 0 ? 'Creaming speed' : 'Settling speed', inU(speed, 'speed', 'µm/s', 3), n3(speed * 1000 * 86400, 3) + ' mm per day · v = d²(ρ_p − ρ_f)g / 18η') + stat('Time to cross the container', Number.isFinite(tH) ? inU(tH, 'time', tH > 86400 * 2 ? 'day' : 'h', 3) : '—', 'if nothing else slows it; flocculation and viscosity change this');
      scale.paint();
    }
    calc(read());
  }

  /* ================================================================ PHARMACOKINETICS */
  const PKT = [['dosing', 'Dosing regimen'], ['nca', 'Non-compartmental analysis'], ['twocomp', 'Two compartments'], ['nonlinear', 'Saturable elimination'], ['be', 'Bioequivalence'], ['pd', 'Dose–response']];
  function pk(el, params, sub) {
    const T = subtabs(el, 'pk', PKT, sub, LEARN);
    ({ dosing: kDosing, nca: kNca, twocomp: kTwo, nonlinear: kNonlin, be: kBe, pd: kPd })[T.tab](T.body);
  }
  function kDosing(el) {
    const L = layout(el, 'Repeated doses of a hypothetical drug in one compartment: each dose adds a curve, and the curves pile up until what is eliminated over an interval equals the dose. It takes about 3.3 half-lives to reach 90 % of the steady state, whatever the dose.' + link('multiple-dosing') + link('loading-dose') + link('half-life'));
    const pl = plotIn(L.plot, { x: { label: 'time (h)', min: 0 }, y: { label: 'plasma concentration (mg/L)', min: 0 } }, 270);
    const read = form(L.form, [['route', 'Route', 'oral', 'sel', [['iv', 'IV bolus'], ['oral', 'Oral'], ['infusion', 'Short IV infusion']]], ['dose', 'Dose', 500, 'q', ['mass', 'mg']], ['tau', 'Dosing interval τ', 8, 'q', ['time', 'h']],
      ['nd', 'Number of doses', 10, 'n'], ['th', 'Half-life', 6, 'q', ['time', 'h']], ['Vd', 'Volume of distribution', 40, 'q', ['volume', 'L']], ['F', 'Oral bioavailability F', 80, 'n', '%'],
      ['ka', 'Absorption rate constant kₐ', 1.2, 'q', ['rate', '1/h']], ['ti', 'Infusion time', 1, 'q', ['time', 'h']],
      ['s1', 'Target window', 0, 'sep'], ['lo', 'Lowest effective', 5, 'q', ['massconc', 'mg/L']], ['hi', 'Highest safe', 20, 'q', ['massconc', 'mg/L']]], v => calc(v));
    function calc(v) {
      const half = v.th / 3600, Vd = v.Vd * 1000, dose = v.dose * 1e6, tau = v.tau / 3600, ka = v.ka * 3600, dur = v.ti / 3600, nd = Math.max(1, Math.min(60, Math.round(v.nd)));
      if (!(half > 0 && Vd > 0 && dose > 0 && tau > 0 && (v.route !== 'oral' || (ka > 0 && v.F > 0)) && (v.route !== 'infusion' || (dur > 0 && dur <= tau)))) { L.stats.innerHTML = '<p class="muted">Enter positive values; an infusion must end before the next dose.</p>'; return; }
      const F = v.route === 'oral' ? v.F / 100 : 1, k = Math.LN2 / half, CL = k * Vd;
      const doses = []; for (let i = 0; i < nd; i++) doses.push({ t: i * tau, amount: dose, route: v.route, F, ka, duration: dur });
      const m = M().pk({ halfLife: half, Vd, doses }), T = nd * tau + 2 * half, pts = [];
      for (let i = 0; i <= 800; i++) { const t = T * i / 800; pts.push([t, m.at(t)]); }
      let top = 0, tr = Infinity; for (let i = 0; i <= 200; i++) { const t = (nd - 1) * tau + tau * i / 200, c = m.at(t); top = Math.max(top, c); if (i > 0) tr = Math.min(tr, c); }
      const avg = F * dose / (CL * tau), R = 1 / (1 - Math.exp(-k * tau));
      L.stats.innerHTML = stat('Average at steady state', n3(avg, 4) + ' mg/L', 'C_ss,avg = F·Dose/(CL·τ)', 'big') + stat('Last interval: peak / trough', n3(top, 4) + ' / ' + n3(tr, 4) + ' mg/L', 'fluctuation ' + f1(100 * (top - tr) / avg, 0) + ' % of the average') +
        stat('Clearance', n3(CL, 4) + ' L/h', 'k·V_d, with k = ' + n3(k, 3) + ' /h') + stat('Accumulation ratio', n3(R, 4), '1/(1 − e^(−kτ))') +
        stat('90 % of steady state after', n3(3.32 * half, 3) + ' h', '3.32 half-lives, ≈ ' + n3(3.32 * half / tau, 3) + ' doses') +
        stat('Loading dose', n3(dose * R, 4) + ' mg', 'Dose × R reaches the steady-state level at once');
      pl.set({ series: [{ pts, label: 'concentration', fill: true }], hlines: [{ y: v.lo, label: 'lowest effective', color: ui.colors().ok }, { y: v.hi, label: 'highest safe', color: ui.colors().bad }] });
    }
    calc(read());
  }
  function kNca(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Paste a concentration–time profile. The area under the curve is summed by trapezoids — linear while the level rises, logarithmic while it falls — and the terminal slope λz from the last points gives the half-life and the area beyond the last sample. No compartments are assumed.' +
      link('nca') + link('auc-cmax') + link('clearance') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el);
    const pl = plotIn(ui.$('.mplot', el), { x: { label: 'time (h)', min: 0 }, y: { label: 'concentration (mg/L)' } }, 280);
    const opts = document.createElement('div'); opts.className = 'mform'; fEl.appendChild(opts);
    const read = form(opts, [['dose', 'Dose', 250, 'q', ['mass', 'mg']], ['route', 'Given', 'ev', 'sel', [['ev', 'by mouth or another extravascular route'], ['iv', 'as an IV bolus']]],
      ['nz', 'Points for λz', 3, 'n'], ['log', 'Logarithmic concentration axis', true, 'check']], () => calc());
    const readD = dataBox(fEl, 'Profile: time h, concentration mg/L', '0, 0\n0.5, 2.8\n1, 4.6\n1.5, 5.4\n2, 5.6\n3, 5.1\n4, 4.4\n6, 3.2\n8, 2.3\n12, 1.2\n24, 0.17', 12, () => calc());
    function calc() {
      const v = read(), rows = readD().filter(r => r.length >= 2).sort((a, b) => a[0] - b[0]), dose = v.dose * 1e6;
      if (rows.length < 4) { stats.innerHTML = '<p class="muted">At least four samples are needed.</p>'; return; }
      const nz = Math.max(2, Math.min(rows.length - 1, Math.round(v.nz) || 3));
      const t = rows.map(r => r[0]), c = rows.map(r => r[1]), r0 = P().nca(t, c);
      const tail = rows.slice(-nz).filter(r => r[1] > 0), fit = tail.length >= 2 ? linfit(tail.map(r => r[0]), tail.map(r => Math.log(r[1]))) : { a: NaN, b: NaN, r2: NaN }, lz = -fit.b;
      const cl = c[c.length - 1], tl = t[t.length - 1], aucInf = r0.auc + cl / lz;
      let aumc = 0; for (let i = 1; i < t.length; i++) aumc += (t[i] - t[i - 1]) * (t[i] * c[i] + t[i - 1] * c[i - 1]) / 2;
      const aumcInf = aumc + cl * tl / lz + cl / (lz * lz), CL = dose / aucInf, f = v.route === 'iv' ? '' : '/F', good = lz > 0 && Number.isFinite(lz);
      stats.innerHTML = stat('C_max', n3(r0.cmax, 4) + ' mg/L', 'at t_max = ' + n3(r0.tmax, 3) + ' h') + stat('AUC₀₋t', n3(r0.auc, 4) + ' mg·h/L', 'linear-up / log-down trapezoids') +
        (good ? stat('Terminal half-life', n3(Math.LN2 / lz, 4) + ' h', 'λz = ' + n3(lz, 4) + ' /h from ' + tail.length + ' points, R² ' + f1(fit.r2, 4)) +
          stat('AUC₀₋∞', n3(aucInf, 4) + ' mg·h/L', 'extrapolated part ' + f1(100 * (cl / lz) / aucInf) + ' %' + (cl / lz / aucInf > 0.2 ? ' — over 20 %: sample longer' : ''), 'big') +
          stat('Clearance CL' + f, n3(CL, 4) + ' L/h', 'Dose / AUC₀₋∞') + stat('Volume V_z' + f, n3(CL / lz, 4) + ' L', 'CL / λz') +
          stat('Mean residence time', n3(aumcInf / aucInf, 4) + ' h', 'AUMC/AUC' + (v.route === 'iv' ? '' : ', including the time to be absorbed'))
          : stat('Terminal phase', 'not falling', 'the last points must decline to estimate λz', 'bad'));
      const series = [{ pts: rows.filter(r => !v.log || r[1] > 0), label: 'measured', dots: 4, fill: !v.log }];
      if (good) { const te = tl + 2 * Math.LN2 / lz; series.push({ pts: [[tail[0][0], Math.exp(fit.a + fit.b * tail[0][0])], [te, Math.exp(fit.a + fit.b * te)]], dash: [6, 4], label: 'terminal slope' }); }
      pl.set({ y: v.log ? { label: 'concentration (mg/L)', log: true } : { label: 'concentration (mg/L)', min: 0 }, series });
    }
    calc();
  }
  function kTwo(el) {
    const L = layout(el, 'After an IV bolus the drug leaves the blood two ways at once: it spreads into the tissues (the fast α phase) while it is eliminated (the slow β phase). On a log scale the curve bends, then runs straight: C = A·e^(−αt) + B·e^(−βt).' + link('two-compartment') + link('volume-distribution'));
    const pC = plotIn(L.plot, { x: { label: 'time (h)', min: 0 }, y: { label: 'plasma concentration (mg/L)', log: true } }, 240);
    const pA = plotIn(L.plot, { x: { label: 'time (h)', min: 0 }, y: { label: 'amount (mg)', min: 0 } }, 200);
    const read = form(L.form, [['dose', 'Dose', 500, 'q', ['mass', 'mg']], ['V1', 'Central volume V₁', 15, 'q', ['volume', 'L']], ['k10', 'Elimination k₁₀', 0.3, 'q', ['rate', '1/h']],
      ['k12', 'To the tissues k₁₂', 0.6, 'q', ['rate', '1/h']], ['k21', 'Back from the tissues k₂₁', 0.25, 'q', ['rate', '1/h']], ['T', 'Show', 24, 'q', ['time', 'h']]], v => calc(v));
    function calc(v) {
      const o = { dose: v.dose * 1e6, V1: v.V1 * 1000, k10: v.k10 * 3600, k12: v.k12 * 3600, k21: v.k21 * 3600 }, T = v.T / 3600;
      if (!(o.dose > 0 && o.V1 > 0 && o.k10 > 0 && o.k12 > 0 && o.k21 > 0 && T > 0)) { L.stats.innerHTML = '<p class="muted">Enter positive values.</p>'; return; }
      const m = P().twoComp(o), CL = o.k10 * o.V1, Vss = o.V1 * (1 + o.k12 / o.k21);
      const c = [], bl = [], al = [], x1 = [], x2 = [], xe = [];
      for (let i = 0; i <= 400; i++) {
        const t = T * i / 400, C = m.at(t), X2 = o.dose * o.k12 / (m.alpha - m.beta) * (Math.exp(-m.beta * t) - Math.exp(-m.alpha * t));
        c.push([t, C]); bl.push([t, m.B * Math.exp(-m.beta * t)]); al.push([t, m.A * Math.exp(-m.alpha * t)]);
        x1.push([t, C * o.V1]); x2.push([t, X2]); xe.push([t, Math.max(0, o.dose - C * o.V1 - X2)]);
      }
      L.stats.innerHTML = stat('α phase', 't½ ' + n3(Math.LN2 / m.alpha, 3) + ' h', 'α = ' + n3(m.alpha, 4) + ' /h, A = ' + n3(m.A, 4) + ' mg/L') + stat('β phase', 't½ ' + n3(Math.LN2 / m.beta, 4) + ' h', 'β = ' + n3(m.beta, 4) + ' /h, B = ' + n3(m.B, 4) + ' mg/L', 'big') +
        stat('AUC', n3(m.auc, 4) + ' mg·h/L', 'A/α + B/β') + stat('Clearance', n3(CL, 4) + ' L/h', 'k₁₀·V₁ = Dose/AUC') + stat('V_ss', n3(Vss, 4) + ' L', 'V₁ (1 + k₁₂/k₂₁)') + stat('V_β (area)', n3(CL / m.beta, 4) + ' L', 'CL/β: larger than V_ss');
      pC.set({ series: [{ pts: c, label: 'plasma' }, { pts: bl, dash: [6, 4], label: 'B·e^(−βt), back-extrapolated' }, { pts: al, dash: [2, 3], label: 'residuals A·e^(−αt)' }] });
      pA.set({ series: [{ pts: x1, label: 'central' }, { pts: x2, label: 'tissues' }, { pts: xe, label: 'eliminated', dash: [5, 4] }] });
    }
    calc(read());
  }
  function kNonlin(el) {
    const L = layout(el, 'When the enzymes that clear a drug saturate, elimination follows Michaelis–Menten: a small rise in the dose rate can give a large rise in the steady-state level, and it takes much longer to get there. Classic teaching examples are phenytoin and ethanol.' + link('nonlinear-pk'));
    const pC = plotIn(L.plot, { x: { label: 'time (days)', min: 0 }, y: { label: 'concentration (mg/L)', min: 0 } }, 230);
    const pS = plotIn(L.plot, { x: { label: 'dose rate (mg/day)', min: 0 }, y: { label: 'steady-state level (mg/L)', min: 0 } }, 210);
    const read = form(L.form, [['dose', 'Dose', 300, 'q', ['mass', 'mg']], ['tau', 'Interval', 24, 'q', ['time', 'h']], ['Vd', 'Volume of distribution', 50, 'q', ['volume', 'L']],
      ['Vmax', 'V_max', 500, 'n', 'mg/day'], ['Km', 'K_m', 4, 'q', ['massconc', 'mg/L']], ['days', 'Show', 30, 'n', 'days']], v => calc(v));
    function calc(v) {
      const dose = v.dose * 1e6, tau = v.tau / 3600, Vd = v.Vd * 1000, Km = v.Km, days = Math.max(2, Math.min(120, v.days || 30));
      if (!(dose > 0 && tau > 0 && Vd > 0 && v.Vmax > 0 && Km > 0)) { L.stats.innerHTML = '<p class="muted">Enter positive values.</p>'; return; }
      const Rd = dose * 24 / tau, run = f => P().mmPK({ dose: dose * f, Vd, Vmax: v.Vmax / 24, Km, tau, n: Math.ceil(days * 24 / tau), dt: 0.1 }).filter((_, i) => i % 5 === 0).map(([t, c]) => [t / 24, c]);
      const css = R => R < v.Vmax ? Km * R / (v.Vmax - R) : Infinity, cNow = css(Rd), c12 = css(Rd * 1.2), t90 = Km * Vd / Math.pow(v.Vmax - Rd, 2) * (2.3 * v.Vmax - 0.9 * Rd);
      L.stats.innerHTML = stat('Dose rate', n3(Rd, 4) + ' mg/day', n3(100 * Rd / v.Vmax, 3) + ' % of V_max') +
        stat('Steady-state level', Number.isFinite(cNow) ? n3(cNow, 4) + ' mg/L' : 'none', Number.isFinite(cNow) ? 'K_m·R/(V_max − R)' : 'the dose rate reaches V_max: the drug keeps accumulating', Number.isFinite(cNow) ? 'big' : 'bad') +
        stat('20 % more dose gives', Number.isFinite(c12) ? n3(c12, 4) + ' mg/L' : 'no steady state', Number.isFinite(c12) && Number.isFinite(cNow) ? '× ' + n3(c12 / cNow, 3) + ' — not × 1.2' : '') +
        stat('Time to 90 % of it', Number.isFinite(cNow) ? n3(t90, 3) + ' days' : '—', 'K_m·V_d (2.3 V_max − 0.9 R)/(V_max − R)²') + stat('Clearance at low levels', n3(v.Vmax / Km, 4) + ' L/day', 'V_max/K_m; it falls as the level rises');
      pC.set({ series: [{ pts: run(1), label: 'this regimen' }, { pts: run(1.2), label: '20 % more', dash: [6, 4] }, { pts: run(0.8), label: '20 % less', dash: [2, 3] }], hlines: Number.isFinite(cNow) ? [{ y: cNow, label: 'steady state' }] : [] });
      const cur = [], lin = []; for (let i = 0; i <= 200; i++) { const R = 0.95 * v.Vmax * i / 200; cur.push([R, css(R)]); lin.push([R, R * Km / v.Vmax]); }
      pS.set({ series: [{ pts: cur, label: 'Michaelis–Menten' }, { pts: lin, dash: [6, 4], label: 'if elimination stayed linear' }], marks: Number.isFinite(cNow) ? [{ x: Rd, y: cNow, label: 'here' }] : [], vlines: [{ x: v.Vmax, label: 'V_max' }] });
    }
    calc(read());
  }
  function kBe(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">A generic is bioequivalent when the 90 % confidence interval of the geometric mean ratio of its AUC and C_max to the reference lies within 80.00–125.00 %. Paste each subject’s test and reference values, and the sequence (1 = test first, 2 = reference first) to get the 2×2 crossover analysis, in which the period effect cancels (ICH M13A, 2024); without the sequence column the interval comes from the paired log differences.' +
      link('bioequivalence') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el);
    const readD = dataBox(fEl, 'Per subject: test, reference (AUC or C_max), sequence 1 or 2', '102, 98, 1\n88, 95, 2\n120, 118, 1\n75, 81, 2\n96, 90, 1\n110, 121, 2\n85, 84, 1\n131, 125, 2\n92, 101, 1\n78, 76, 2\n104, 112, 1\n99, 97, 2', 14, () => calc());
    let last = null;
    const fig = canvasIn(ui.$('.mplot', el), 170, (c, w, h) => {
      if (!last) return;
      const C = ui.colors(), f = getComputedStyle(document.body).fontFamily, x0 = 24, x1 = w - 24, lo = Math.log(0.6), hi = Math.log(1.6), X = r => x0 + (x1 - x0) * (Math.log(r) - lo) / (hi - lo), y = 70;
      c.fillStyle = C.hue(140, 0.18); c.fillRect(X(0.8), 18, X(1.25) - X(0.8), 104);
      c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, 122); c.lineTo(x1, 122); c.stroke();
      c.font = '11.5px ' + f; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
      [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.6].forEach(r => { c.fillText(Math.round(r * 100) + ' %', X(r), 126); c.beginPath(); c.moveTo(X(r), 122); c.lineTo(X(r), 118); c.stroke(); });
      c.fillText('test / reference on a log scale; the green band is 80–125 %; grey dots are single subjects', (x0 + x1) / 2, 146);
      c.fillStyle = C.faint; last.ratios.forEach((r, i) => { c.beginPath(); c.arc(X(Math.max(0.6, Math.min(1.6, r))), 30 + (i % 5) * 5, 2.6, 0, 7); c.fill(); });
      const col = last.pass ? C.ok : C.bad;
      c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(X(Math.max(0.6, last.lo)), y); c.lineTo(X(Math.min(1.6, last.hi)), y); c.stroke();
      c.fillStyle = col; c.beginPath(); c.arc(X(Math.max(0.6, Math.min(1.6, last.gmr))), y, 6, 0, 7); c.fill();
      c.textBaseline = 'bottom'; c.fillText('90 % CI', X(Math.max(0.6, Math.min(1.6, last.gmr))), y - 9);
    });
    function calc() {
      const rows = readD().filter(r => r.length >= 2 && r[0] > 0 && r[1] > 0);
      if (rows.length < 3) { stats.innerHTML = '<p class="muted">At least three subjects are needed.</p>'; last = null; fig.paint(); return; }
      const withSeq = rows.every(r => r.length >= 3 && (r[2] === 1 || r[2] === 2));
      const b = P().be(rows.map(r => r[0]), rows.map(r => r[1]), withSeq ? rows.map(r => r[2]) : null), cross = withSeq && b.df === rows.length - 2;
      last = { lo: b.lo, hi: b.hi, gmr: b.gmr, pass: b.pass, ratios: rows.map(r => r[0] / r[1]) };
      stats.innerHTML = stat('Geometric mean ratio', f1(100 * b.gmr, 2) + ' %', rows.length + ' subjects · ' + (cross ? '2×2 crossover, ' : 'paired, ') + b.df + ' degrees of freedom') +
        stat('90 % confidence interval', f1(100 * b.lo, 2) + ' – ' + f1(100 * b.hi, 2) + ' %', '', 'big') +
        stat('Within-subject variability', '≈ ' + f1(100 * b.cv, 1) + ' % CV', cross ? 'from the spread of ln(T/R) within each sequence' : 'from the spread of the log differences, whose variance is twice the within-subject one') +
        stat('Verdict', b.pass ? 'bioequivalent' : 'not shown', b.pass ? 'the whole interval lies inside 80–125 %' : 'part of the interval lies outside 80–125 %', b.pass ? 'good' : 'bad');
      fig.paint();
    }
    calc();
  }
  function kPd(el) {
    const L = layout(el, 'The effect of an agonist against its concentration on a log axis is an S-shaped curve set by E_max, EC₅₀ and the Hill slope. A competitive antagonist shifts it to the right in parallel (the dose ratio is 1 + [B]/K_B); a non-competitive one pulls the top down. Below, quantal curves for the effect and for toxicity in a population.' + link('dose-response') + link('agonists-antagonists') + link('therapeutic-index'));
    const pE = plotIn(L.plot, { x: { label: 'agonist concentration (nM)', log: true }, y: { label: 'effect (% of maximum)', min: 0, max: 100 } }, 240);
    const pQ = plotIn(L.plot, { x: { label: 'dose (mg/kg)', log: true }, y: { label: 'population responding (%)', min: 0, max: 100 } }, 210);
    const read = form(L.form, [['Emax', 'E_max', 100, 'n', '%'], ['EC50', 'EC₅₀', 10, 'q', ['concentration', 'nM']], ['n', 'Hill slope', 1, 'n'],
      ['type', 'Antagonist', 'competitive', 'sel', [['competitive', 'competitive (surmountable)'], ['noncompetitive', 'non-competitive (insurmountable)']]], ['B', 'Antagonist concentration [B]', 20, 'q', ['concentration', 'nM']], ['KB', 'Its K_B', 5, 'q', ['concentration', 'nM']],
      ['s1', 'Effect and toxicity in a population', 0, 'sep'], ['ED50', 'ED₅₀', 10, 'n', 'mg/kg'], ['TD50', 'TD₅₀', 200, 'n', 'mg/kg'], ['nq', 'Slope of the quantal curves', 2, 'n']], v => calc(v));
    function calc(v) {
      const nM = x => x * 1e6, EC = nM(v.EC50), B = nM(v.B), KB = nM(v.KB), n = v.n > 0 ? v.n : 1;
      if (!(EC > 0 && KB > 0 && B >= 0 && v.ED50 > 0 && v.TD50 > 0)) { L.stats.innerHTML = '<p class="muted">Enter positive values.</p>'; return; }
      const r = 1 + B / KB, comp = v.type === 'competitive', EC2 = comp ? EC * r : EC, Em2 = comp ? v.Emax : v.Emax / r;
      const lo = Math.min(EC, EC2) / 1000, hi = Math.max(EC, EC2) * 1000, pts = f => { const o = []; for (let i = 0; i <= 200; i++) { const c = lo * Math.pow(hi / lo, i / 200); o.push([c, f(c)]); } return o; };
      const nq = v.nq > 0 ? v.nq : 1, ed99 = v.ED50 * Math.pow(99, 1 / nq), td1 = v.TD50 * Math.pow(1 / 99, 1 / nq);
      L.stats.innerHTML = stat('EC₅₀ with the antagonist', n3(EC2, 4) + ' nM', comp ? 'dose ratio r = 1 + [B]/K_B = ' + n3(r, 4) : 'unchanged; E_max falls to ' + f1(Em2) + ' %') +
        stat('pA₂ (Schild)', n3(-Math.log10(v.KB * 1e-3), 3), '−log K_B with K_B in mol/L; log(r − 1) = log[B] − log K_B') + stat('Receptors held by the antagonist', pc(P().occupancy(B, KB), 1), '[B]/([B] + K_B), on its own') +
        stat('Therapeutic index', n3(P().ti(v.TD50, v.ED50), 4), 'TD₅₀/ED₅₀', 'big') + stat('Certain safety factor', n3(td1 / ed99, 3), 'TD₁/ED₉₉: ' + (td1 / ed99 >= 1 ? 'the curves do not overlap even at the extremes' : 'below 1: some people meet toxicity before others get the effect'), td1 / ed99 >= 1 ? 'good' : 'bad');
      pE.set({ x: { label: 'agonist concentration (nM)', log: true, min: lo, max: hi }, series: [{ pts: pts(c => P().hill(c, v.Emax, EC, n)), label: 'agonist alone' }, { pts: pts(c => P().hill(c, Em2, EC2, n)), label: 'with ' + n3(B, 3) + ' nM antagonist', dash: [6, 4] }] });
      const qlo = Math.min(v.ED50, v.TD50) / 30, qhi = Math.max(v.ED50, v.TD50) * 30, q = f => { const o = []; for (let i = 0; i <= 200; i++) { const d = qlo * Math.pow(qhi / qlo, i / 200); o.push([d, f(d)]); } return o; };
      pQ.set({ x: { label: 'dose (mg/kg)', log: true, min: qlo, max: qhi }, series: [{ pts: q(d => P().hill(d, 100, v.ED50, nq)), label: 'therapeutic effect', color: ui.colors().ok }, { pts: q(d => P().hill(d, 100, v.TD50, nq)), label: 'toxicity', color: ui.colors().bad }],
        vlines: [{ x: v.ED50, label: 'ED₅₀' }, { x: v.TD50, label: 'TD₅₀' }] });
    }
    calc(read());
  }

  H.pharmaTools = { pharmcalc, formulation, pk, fitRelease };
})();
