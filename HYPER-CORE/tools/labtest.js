/* Runs the Tools labs of Hyper Optics (or, with --app esp32, of Hyper ESP32) headless, the way simtest.js runs simulations.
 *
 *   node HYPER-CORE/tools/labtest.js                     every lab in HYPER-CORE/js/ui/optics-*.js
 *   node HYPER-CORE/tools/labtest.js --only bench,camera
 *   node HYPER-CORE/tools/labtest.js --app esp32         every lab in HYPER-CORE/js/ui/esp-*.js (Hyper.espTools)
 *
 * Each lab function Hyper.opticsTools.<name>(el, params, sub) is called once for every sub-tab it lists in
 * Hyper.opticsTools.<name>.tabs, against a stand-in DOM, canvas and kit. Every kit control is then moved to its
 * ends, every select option and button tried, every drag and click handler exercised. Reported: exceptions,
 * NaN or Infinity reaching the canvas, negative radii, and read-outs or tables showing NaN.
 * Only what goes through kit.controls / kit.readout / kit.plot / kit.table and the canvas is exercised, so build
 * the labs with those (as simulations are built); hand-made <input> elements are not driven by this test.
 */
'use strict';
const BAD = /(?:^|[^A-Za-z])(?:NaN|-?Infinity|undefined)(?![A-Za-z0-9₀-₉])/;
const fs = require('fs');
const path = require('path');
const { makeContext, loadCore, run } = require('./load');

const args = process.argv.slice(2);
const onlyArg = (args.find(a => a.startsWith('--only=')) || '').slice(7) || (args.includes('--only') ? args[args.indexOf('--only') + 1] : '');
const only = onlyArg ? new Set(onlyArg.split(',').map(s => s.trim())) : null;
const APP = (args.find(a => a.startsWith('--app=')) || '').slice(6) || (args.includes('--app') ? args[args.indexOf('--app') + 1] : 'optics');
const CONF = { optics: { disc: 'optics', folder: 'HYPER-OPTICS', tools: 'opticsTools', first: 'optictools.js', re: /^optics-[a-z]+\.js$/, sym: 'opticsym.js', where: /optic[s-]/, cut: /^.*?(optic)/ },
  esp32: { disc: 'esp32', folder: 'HYPER-ESP32', tools: 'espTools', first: 'esptools.js', re: /^esp-[a-z]+\.js$/, sym: 'espsym.js', where: /esp(tools|-)/, cut: /^.*?(esp(?:tools|-))/ },
  // Hyper Math: the SVD lab (ui/mathtools.js) mounts simulations from HYPER-MATH/sims/svd.js, so those are loaded too
  math: { disc: 'math', folder: 'HYPER-MATH', tools: 'mathTools', first: 'mathtools.js', re: /^math-[a-z]+\.js$/, sym: null, sims: /^svd\.js$/, where: /mathtools|sims[\\/]svd/, cut: /^.*?(mathtools|svd\.js)/ } }[APP];
if (!CONF) { console.error('Unknown --app ' + APP + ' (optics, esp32, math)'); process.exit(2); }

const ctx = makeContext();
const bad = [];
let current = '';
function fakeEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(), children: [], style: { setProperty() {}, removeProperty() {} }, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    clientWidth: 900, clientHeight: 520, offsetWidth: 900, offsetHeight: 520, width: 900, height: 520,
    appendChild(c) { this.children.push(c); return c; }, append() {}, prepend() {}, insertBefore(c) { return c; }, removeChild() {}, remove() {},
    insertAdjacentHTML() {}, setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    addEventListener(t, f) { (this._ev = this._ev || {})[t] = f; }, removeEventListener() {},
    querySelector() { return fakeEl(); }, querySelectorAll() { return []; }, closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 900, height: 520, right: 900, bottom: 520 }; },
    setPointerCapture() {}, releasePointerCapture() {}, focus() {}, blur() {}, click() {}, scrollIntoView() {},
    getContext() { return fakeCtx(); }, toDataURL() { return ''; },
    set innerHTML(v) { this._html = String(v); if (BAD.test(this._html.replace(/<[^>]*>/g, ' '))) htmlBad.add(this._html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').match(/.{0,40}(?:NaN|Infinity|undefined).{0,20}/)[0]); },
    get innerHTML() { return this._html || ''; },
    textContent: '', value: '', checked: false, isConnected: true
  };
  return el;
}
let htmlBad = new Set();
function fakeCtx() {
  const target = {
    canvas: fakeEl('canvas'),
    measureText: s => ({ width: String(s).length * 7, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 }),
    createLinearGradient: () => ({ addColorStop() {} }), createRadialGradient: () => ({ addColorStop() {} }), createPattern: () => ({}),
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h }),
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(Math.max(1, (w.width || w) * (h || w.height) * 4)), width: w.width || w, height: h || w.height }),
    putImageData() {}, drawImage() {}, getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }), isPointInPath: () => false, getLineDash: () => []
  };
  const numeric = new Set(['moveTo', 'lineTo', 'arc', 'arcTo', 'rect', 'fillRect', 'strokeRect', 'clearRect', 'quadraticCurveTo', 'bezierCurveTo', 'ellipse', 'translate', 'scale', 'rotate', 'fillText', 'strokeText', 'roundRect', 'setTransform', 'transform']);
  return new Proxy(target, {
    get(t, k) {
      if (k in t) return t[k];
      return function () {
        if (numeric.has(k)) for (const a of arguments) if (typeof a === 'number' && !Number.isFinite(a)) { bad.push(current + ': ' + k + '() got ' + a); break; }
        const radii = { arc: [2], arcTo: [4], ellipse: [2, 3] }[k];
        if (radii && radii.some(i => arguments[i] < 0)) bad.push(current + ': ' + k + '() got a negative radius (throws in a browser)');
        if (k === 'setLineDash' && !(arguments[0] && typeof arguments[0] === 'object' && typeof arguments[0].length === 'number')) bad.push(current + ': setLineDash() needs an array (throws in a browser)');
        if ((k === 'fillText' || k === 'strokeText') && BAD.test(String(arguments[0]))) bad.push(current + ': text "' + arguments[0] + '" drawn on the canvas');
        return undefined;
      };
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}
ctx.document = { createElement: fakeEl, createElementNS: fakeEl, body: fakeEl('body'), documentElement: fakeEl('html'), addEventListener() {}, removeEventListener() {}, querySelector: () => fakeEl(), querySelectorAll: () => [], getElementById: () => fakeEl(), hidden: false, dispatchEvent() {} };
ctx.getComputedStyle = () => ({ fontFamily: 'sans-serif', getPropertyValue: () => '#888' });
let clock = 0;
ctx.performance = { now: () => clock };
ctx.requestAnimationFrame = () => 0; ctx.cancelAnimationFrame = () => {};
ctx.setTimeout = () => 0; ctx.clearTimeout = () => {}; ctx.setInterval = () => 0; ctx.clearInterval = () => {};
ctx.devicePixelRatio = 1; ctx.innerWidth = 1280; ctx.innerHeight = 800;
ctx.ResizeObserver = class { observe() {} disconnect() {} };
ctx.IntersectionObserver = class { observe() {} disconnect() {} };
ctx.Float64Array = Float64Array; ctx.Float32Array = Float32Array; ctx.Uint8ClampedArray = Uint8ClampedArray; ctx.Int32Array = Int32Array; ctx.Uint8Array = Uint8Array;
ctx.Symbol = Symbol; ctx.Promise = Promise; ctx.Proxy = Proxy; ctx.Reflect = Reflect; ctx.WeakMap = WeakMap; ctx.CSS = { escape: s => s };
ctx.decodeURIComponent = decodeURIComponent; ctx.encodeURIComponent = encodeURIComponent; ctx.URLSearchParams = URLSearchParams; ctx.location = { hash: '' };

const H = loadCore(ctx);
if (CONF.sym) run(ctx, path.join(__dirname, '..', 'js', CONF.sym));
H.use(CONF.disc);
// the content, so that links to pages and the dictionary have something to show
const cdir = path.join(__dirname, '..', '..', CONF.folder, 'content');
if (fs.existsSync(cdir)) for (const f of fs.readdirSync(cdir).filter(f => f.endsWith('.js')).sort((a, b) => (a === 'outline.js' ? -1 : b === 'outline.js' ? 1 : a.localeCompare(b)))) { try { run(ctx, path.join(cdir, f)); } catch (e) { /* validate.js reports content errors */ } }
H.build();
// simulations the labs mount (Hyper Math: sims/svd.js) — loaded after the kit stand-in is in place, below
const simFiles = [];
if (CONF.sims) { const sdir = path.join(__dirname, '..', '..', CONF.folder, 'sims'); if (fs.existsSync(sdir)) for (const f of fs.readdirSync(sdir).filter(f => CONF.sims.test(f)).sort()) simFiles.push(path.join(sdir, f)); }

const colors = { theme: 'dark', bg: '#0d1020', bg2: '#10142a', surface: '#151a31', surface2: '#1a2040', border: '#252d52', border2: '#323c6b', text: '#e7e9f5', text2: '#c3c8e0',
  muted: '#959cbd', faint: '#677096', accent: '#7b8cff', ok: '#22b37a', bad: '#e5484d', warn: '#e0a030', grid: 'rgba(0,0,0,.1)', axis: '#888', dark: true,
  series: ['#7b8cff', '#f90', '#2c8', '#e5a', '#fd4', '#a6f', '#3ce'], hue: (h, a) => 'hsl(' + h + ' 75% 68%' + (a != null ? ' / ' + a : '') + ')' };
let rec = null;
const kit = {
  stage(el, opts) {
    const c = fakeCtx();
    const st = { canvas: fakeEl('canvas'), ctx: c, W: 900, H: Math.round(900 * ((opts && opts.aspect) || 0.58)), dpr: 1, cbs: [] };
    if (opts && opts.height) st.H = opts.height;
    st.onResize = f => { st.cbs.push(f); }; st.begin = () => c; st.pos = e => ({ x: e.clientX || 0, y: e.clientY || 0 });
    rec.stages.push(st); return st;
  },
  controls(el, defs, onChange) {
    const values = {};
    for (const d of defs) {
      if (d.type === 'buttons' || d.type === 'html') continue;
      values[d.id] = d.type === 'select' ? (d.value != null ? d.value : d.options[0][1]) : d.type === 'check' ? !!d.value : d.value;
      if (d.type == null && !(typeof d.value === 'number' && typeof d.min === 'number' && typeof d.max === 'number')) rec.errors.push('slider "' + d.id + '" needs numeric value, min and max');
      if (d.type == null && d.log && d.min <= 0) rec.errors.push('log slider "' + d.id + '" needs min > 0');
      if (typeof d.fmt === 'function') d.fmt(values[d.id]);
    }
    const api = { values, rows: {}, set(id, v, fire) { values[id] = v; if (fire && onChange) onChange(id, v, values); }, show() {} };
    for (const d of defs) if (d.id) api.rows[d.id] = { row: fakeEl(), set: v => { values[d.id] = v; } };
    for (const d of defs) if (d.type === 'buttons') for (const b of d.items) api.rows[b.id] = fakeEl('button');
    rec.controls.push({ defs, onChange, api }); return api;
  },
  readout() { return { el: fakeEl(), show() {}, set(k, v) { if (BAD.test(String(v))) rec.readoutBad.add(k + ' = ' + v); } }; },
  loop(step) {
    let on = false, last = 0;
    const runStep = (dt, t) => { last = t; return step(dt, t); };
    const api = { start() { on = true; return api; }, stop() { on = false; return api; }, toggle() { on = !on; return api; }, get running() { return on; }, get t() { return last; }, reset() { last = 0; }, once() { step(0, last); } };
    rec.loops.push({ step: runStep, api }); return api;
  },
  arrow(c, x1, y1, x2, y2) { for (const a of [x1, y1, x2, y2]) if (!Number.isFinite(a)) { bad.push(current + ': arrow() got ' + a); break; } },
  label(c, text, x, y) { if (!Number.isFinite(x) || !Number.isFinite(y)) bad.push(current + ': label() at ' + x + ',' + y); if (BAD.test(String(text))) rec.readoutBad.add('label "' + text + '"'); },
  dot(c, x, y, r) { if (![x, y, r].every(Number.isFinite)) bad.push(current + ': dot() got ' + [x, y, r].join(',')); },
  grid() {},
  drag(st, o) { rec.drags.push(o); },
  click(st, fn, hover) { rec.clicks.push(fn); if (hover) hover({ x: 100, y: 100 }); },
  plot(el, opts) {
    const p = { o: opts || {}, set(o) { Object.assign(p.o, o); for (const s of (o.series || [])) { if (!Array.isArray(s.pts)) rec.errors.push('plot series without pts array'); else { if (s.pts.length && !Array.isArray(s.pts[0])) rec.errors.push('plot pts must be [[x, y], ...]'); if (s.pts.some(q => q && (Number.isNaN(q[0]) || Number.isNaN(q[1])))) rec.errors.push('plot series "' + (s.label || '') + '" contains NaN'); } } }, draw() {}, destroy() {} };
    rec.plots.push(p); return p;
  },
  table(el, cols) { return { el: fakeEl(), set(rows) { if (!Array.isArray(rows)) { rec.errors.push('table.set needs an array of rows'); return; } for (const r of rows) for (const c of cols) { const v = typeof c.key === 'function' ? c.key(r) : r[c.key]; const t = String(c.fmt ? c.fmt(v, r) : v); if (BAD.test(t)) rec.readoutBad.add('table ' + c.label + ' = ' + t); } } }; },
  colors: () => colors, fmt: (v, s) => H.util.fmt(v, s), hue: colors.hue, TAU: Math.PI * 2, optics: H.optics, osym: H.osym, esp: H.esp, esym: H.esym, gfx: H.gfx, code: H.code, linalg: H.linalg, terms: () => '',
  eng: (v, u) => H.util.fmt(v) + ' ' + u, money: v => String(v), pct: (f, d) => H.util.pct(f, d)
};
H.kit = kit;
H.icon = () => ''; H.hasIcon = () => false; H.views = {}; H.go = () => {};
H.texSafe = H.texSafe || ((s) => String(s));
H.ui = { $: () => fakeEl(), $$: () => [], el: () => fakeEl(), onLeave() {}, leave: [], colors: () => colors, page: () => fakeEl(), setTitle() {}, toast() {}, whenVisible(el, fn) { fn(); },
  simCard: () => fakeEl(), formulaCard: () => fakeEl() };

/* ---------------------------------------------------------------- load the labs */
const uiDir = path.join(__dirname, '..', 'js', 'ui');
const loadErr = [];
for (const f of simFiles) { try { run(ctx, f); } catch (e) { loadErr.push(path.basename(f) + ': ' + e.message); } }
try { run(ctx, path.join(uiDir, CONF.first)); } catch (e) { loadErr.push(CONF.first + ': ' + e.message); }
for (const f of fs.readdirSync(uiDir).filter(f => CONF.re.test(f)).sort()) { try { run(ctx, path.join(uiDir, f)); } catch (e) { loadErr.push(f + ': ' + e.message + ' ' + ((e.stack || '').split('\n').find(l => l.includes(f)) || '').trim()); } }

const T = H[CONF.tools] || {};
const where = e => { const line = (e.stack || '').split('\n').find(l => CONF.where.test(l)); return line ? ' (' + line.trim().replace(/^at /, '').replace(CONF.cut, (m, a) => a) + ')' : ''; };
let failures = 0, tested = 0;
const report = [];
for (const [name, fn] of Object.entries(T)) {
  if (typeof fn !== 'function' || name === 'util') continue;
  if (only && !only.has(name)) continue;
  for (const sub of (fn.tabs && fn.tabs.length ? fn.tabs : [undefined])) {
    tested++;
    current = name + (sub ? '/' + sub : '');
    rec = { stages: [], plots: [], controls: [], loops: [], drags: [], clicks: [], errors: [], readoutBad: new Set() };
    htmlBad = new Set();
    const problems = [], badBefore = bad.length;
    const frames = n => { for (let i = 0; i < n; i++) { clock += 16.7; for (const l of rec.loops) l.step(1 / 60, clock / 1000); } };
    try {
      fn(fakeEl(), new URLSearchParams(''), sub);
      for (const l of rec.loops) l.api.start();
      frames(60);
      for (const st of rec.stages) for (const f of st.cbs) f(640, 360);
      frames(3);
      for (const c of rec.controls) for (const d of c.defs) {
        const fire = (k, v) => { c.api.values[k] = v; if (c.onChange) c.onChange(k, v, c.api.values); frames(6); };
        if (d.type === 'buttons') { for (const b of d.items) { if (c.onChange) c.onChange(b.id, true, c.api.values); frames(12); } continue; }
        if (d.type === 'html') continue;
        const orig = c.api.values[d.id];
        if (d.type === 'check') { fire(d.id, !orig); fire(d.id, orig); }
        else if (d.type === 'select') { for (const o of d.options) fire(d.id, o[1]); fire(d.id, orig); }
        else { fire(d.id, d.min); fire(d.id, d.max); fire(d.id, orig); }
      }
      for (const o of rec.drags) for (const p of [{ x: 450, y: 260 }, { x: 120, y: 120 }, { x: 800, y: 420 }, { x: 300, y: 250 }, { x: 600, y: 270 }]) {
        const t = o.hit(p);
        if (t != null) { o.start && o.start(t, p); o.move(t, { x: p.x + 40, y: p.y - 30 }); o.move(t, { x: 5, y: 5 }); o.move(t, { x: 895, y: 500 }); o.end && o.end(t, p, true); frames(4); }
      }
      for (const f2 of rec.clicks) for (let y = 20; y < 520; y += 70) for (let x = 20; x < 900; x += 70) { f2({ x, y }); frames(1); }
      frames(30);
    } catch (e) { problems.push('throws: ' + e.message + where(e)); }
    if (name !== 'dictionary' && !fn.dom && !rec.stages.length && !rec.plots.length && !rec.controls.length) problems.push('builds nothing with the kit (no stage, plot or controls)');
    problems.push(...rec.errors);
    const nans = bad.slice(badBefore);
    if (nans.length) problems.push(nans.length + ' drawing call(s) with bad values, e.g. ' + [...new Set(nans)].slice(0, 3).join('; '));
    if (rec.readoutBad.size) problems.push('shows NaN/Infinity/undefined: ' + [...rec.readoutBad].slice(0, 4).join('; '));
    // the dictionary prints the writers' own words ("Infinity-corrected objective"), which are not computed values
    if (htmlBad.size && name !== 'dictionary' && !fn.words) problems.push('writes NaN/Infinity/undefined into the page: ' + [...htmlBad].slice(0, 3).join('; '));
    if (problems.length) { failures++; report.push('✗ ' + current + '\n    ' + [...new Set(problems)].join('\n    ')); } else report.push('✓ ' + current);
  }
}
if (loadErr.length) { console.log('FILES THAT FAILED TO LOAD\n  ' + loadErr.join('\n  ')); failures += loadErr.length; }
console.log(report.join('\n'));
console.log('\n' + tested + ' lab pages tested, ' + (failures ? failures + ' with problems' : 'all fine'));
process.exit(failures ? 1 : 0);
