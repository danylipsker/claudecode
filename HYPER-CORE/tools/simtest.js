/* Runs every simulation headless, to catch the errors a browser would hit.
 *
 *   node HYPER-CORE/tools/simtest.js HYPER-PHYSICS
 *   node HYPER-CORE/tools/simtest.js HYPER-PHYSICS --only sims/dynamics.js
 *
 * Each simulation is mounted against a stand-in canvas, stage and controls (the same
 * kit API as the browser), run for a few hundred frames, then every control is moved
 * to its ends, every checkbox flipped, every select option and button tried, with
 * frames in between, and the pointer dragged across the stage. Reported: exceptions
 * (with the line in your file), NaN or Infinity reaching the canvas, and readouts
 * showing NaN.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { makeContext, loadCore, run } = require('./load');

const args = process.argv.slice(2);
const discDir = path.resolve(args.find(a => !a.startsWith('--')) || 'HYPER-PHYSICS');
const onlyArg = (args.find(a => a.startsWith('--only=')) || '').slice(7) || (args.includes('--only') ? args[args.indexOf('--only') + 1] : '');
const only = onlyArg ? new Set(onlyArg.split(',').map(s => path.resolve(discDir, s.trim()))) : null;

const ctx = makeContext();
/* ---------------------------------------------------------------- a stand-in DOM */
function fakeEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(), children: [], style: { setProperty() {}, removeProperty() {} }, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    clientWidth: 760, clientHeight: 420, offsetWidth: 760, offsetHeight: 420, width: 760, height: 420,
    appendChild(c) { this.children.push(c); return c; }, append() {}, prepend() {}, insertBefore(c) { return c; }, removeChild() {}, remove() {},
    insertAdjacentHTML() {}, setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    addEventListener(t, f) { (this._ev = this._ev || {})[t] = f; }, removeEventListener() {},
    querySelector() { return fakeEl(); }, querySelectorAll() { return []; }, closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 760, height: 420, right: 760, bottom: 420 }; },
    setPointerCapture() {}, releasePointerCapture() {}, focus() {}, blur() {}, click() {},
    getContext() { return fakeCtx(); }, toDataURL() { return ''; },
    set innerHTML(v) { this._html = v; }, get innerHTML() { return this._html || ''; },
    textContent: '', value: '', checked: false, isConnected: true
  };
  return el;
}
const bad = [];
let current = '';
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
        return undefined;
      };
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}
ctx.document = {
  createElement: fakeEl, createElementNS: fakeEl, body: fakeEl('body'), documentElement: fakeEl('html'),
  addEventListener() {}, removeEventListener() {}, querySelector: () => fakeEl(), querySelectorAll: () => [], hidden: false, dispatchEvent() {}
};
ctx.getComputedStyle = () => ({ fontFamily: 'sans-serif', getPropertyValue: () => '#888' });
ctx.performance = { now: () => clock };
ctx.requestAnimationFrame = () => 0;
ctx.cancelAnimationFrame = () => {};
ctx.setTimeout = () => 0; ctx.clearTimeout = () => {}; ctx.setInterval = () => 0; ctx.clearInterval = () => {};
ctx.devicePixelRatio = 1; ctx.innerWidth = 1280; ctx.innerHeight = 800;
ctx.ResizeObserver = class { observe() {} disconnect() {} };
ctx.IntersectionObserver = class { observe() {} disconnect() {} };
ctx.Image = class { constructor() { this.onload = null; } };
ctx.Float64Array = Float64Array; ctx.Float32Array = Float32Array; ctx.Uint8ClampedArray = Uint8ClampedArray; ctx.Int32Array = Int32Array; ctx.Uint8Array = Uint8Array; ctx.Int16Array = Int16Array;
ctx.Path2D = class { moveTo() {} lineTo() {} arc() {} rect() {} closePath() {} bezierCurveTo() {} quadraticCurveTo() {} ellipse() {} };
ctx.Symbol = Symbol; ctx.Promise = Promise; ctx.Proxy = Proxy; ctx.Reflect = Reflect; ctx.WeakMap = WeakMap; ctx.BigInt = BigInt;
let clock = 0;

const H = loadCore(ctx);

/* ---------------------------------------------------------------- the stand-in kit */
function makeKit(record) {
  const colors = { theme: 'dark', bg: '#0d1020', bg2: '#10142a', surface: '#151a31', surface2: '#1a2040', border: '#252d52', border2: '#323c6b', text: '#e7e9f5', text2: '#c3c8e0',
    muted: '#959cbd', faint: '#677096', accent: '#7b8cff', ok: '#22b37a', bad: '#e5484d', warn: '#e0a030', grid: 'rgba(0,0,0,.1)', axis: '#888', dark: true,
    series: ['#7b8cff', '#f90', '#2c8', '#e5a', '#fd4', '#a6f', '#3ce'], hue: (h, a) => 'hsl(' + h + ' 75% 68%' + (a != null ? ' / ' + a : '') + ')' };
  return {
    stage(el, opts) {
      const c = fakeCtx();
      const st = { canvas: fakeEl('canvas'), ctx: c, W: 760, H: Math.round(760 * ((opts && opts.aspect) || 0.58)), dpr: 1, cbs: [] };
      if (opts && opts.height) st.H = opts.height;
      st.onResize = f => { st.cbs.push(f); };
      st.begin = () => c;
      st.pos = e => ({ x: e.clientX || 0, y: e.clientY || 0 });
      record.stages.push(st);
      return st;
    },
    controls(el, defs, onChange) {
      const values = {};
      for (const d of defs) {
        if (d.type === 'buttons' || d.type === 'html') continue;
        if (d.type === 'select') values[d.id] = d.value != null ? d.value : d.options[0][1];
        else if (d.type === 'check') values[d.id] = !!d.value;
        else values[d.id] = d.value;
        if (d.type == null && !(typeof d.value === 'number' && typeof d.min === 'number' && typeof d.max === 'number')) record.errors.push('slider "' + d.id + '" needs numeric value, min and max');
        if (d.type == null && d.log && d.min <= 0) record.errors.push('log slider "' + d.id + '" needs min > 0');
      }
      const api = { values, rows: {}, set(id, v, fire) { values[id] = v; if (fire && onChange) onChange(id, v, values); }, show() {} };
      for (const d of defs) if (d.id) api.rows[d.id] = { row: fakeEl(), set: v => { values[d.id] = v; } };
      for (const d of defs) if (d.type === 'buttons') for (const b of d.items) api.rows[b.id] = fakeEl('button');
      record.controls.push({ defs, onChange, api });
      return api;
    },
    readout(el, rows) {
      const api = { el: fakeEl(), show() {}, set(k, v) { if (/NaN|Infinity|undefined/.test(String(v))) record.readoutBad.add(k + ' = ' + v); } };
      return api;
    },
    loop(step) {
      let on = false;
      const api = { start() { on = true; return api; }, stop() { on = false; return api; }, toggle() { on = !on; return api; }, get running() { return on; }, get t() { return 0; }, reset() {}, once() { step(0, 0); } };
      record.loops.push({ step, api });
      return api;
    },
    arrow(c, x1, y1, x2, y2) { for (const a of [x1, y1, x2, y2]) if (!Number.isFinite(a)) { bad.push(current + ': arrow() got ' + a); break; } },
    label(c, text, x, y) { if (!Number.isFinite(x) || !Number.isFinite(y)) bad.push(current + ': label() at ' + x + ',' + y); if (/NaN/.test(String(text))) record.readoutBad.add('label "' + text + '"'); },
    dot(c, x, y, r) { if (![x, y, r].every(Number.isFinite)) bad.push(current + ': dot() got ' + [x, y, r].join(',')); },
    grid() {},
    drag(st, o) { record.drags.push(o); },
    plot(el, opts) {
      const p = { o: opts || {}, set(o) {
        Object.assign(p.o, o);
        for (const s of (o.series || [])) { if (!Array.isArray(s.pts)) record.errors.push('plot series without pts array'); else if (s.pts.length && !Array.isArray(s.pts[0])) record.errors.push('plot pts must be [[x, y], ...]'); }
      }, draw() {}, destroy() {} };
      return p;
    },
    colors: () => colors, fmt: (v, s) => H.util.fmt(v, s), hue: colors.hue, TAU: Math.PI * 2
  };
}

/* ---------------------------------------------------------------- run */
const files = [];
const simDir = path.join(discDir, 'sims');
if (fs.existsSync(simDir)) for (const f of fs.readdirSync(simDir).filter(f => f.endsWith('.js')).sort()) files.push(path.join(simDir, f));
const fileOf = new Map();
const origSim = H.sim;
let curFile = null;
H.sim = (id, def) => { origSim.call(H, id, def); fileOf.set(id, curFile); };
const loadErr = [];
for (const f of files) { curFile = f; try { run(ctx, f); } catch (e) { loadErr.push(path.relative(discDir, f) + ': ' + e.message); } }
// the params each concept opens a simulation with, so every variant is exercised
const variants = new Map();
{
  const cdir = path.join(discDir, 'content');
  if (fs.existsSync(cdir)) for (const f of fs.readdirSync(cdir).filter(f => f.endsWith('.js')).sort((a, b) => (a === 'outline.js' ? -1 : b === 'outline.js' ? 1 : a.localeCompare(b)))) { try { run(ctx, path.join(cdir, f)); } catch (e) { /* the validator reports content errors */ } }
  for (const n of H.list) for (const s of (n.sims || [])) {
    if (!s.params || !Object.keys(s.params).length) continue;
    const k = JSON.stringify(s.params);
    if (!variants.has(s.id)) variants.set(s.id, new Map());
    if (variants.get(s.id).size < 6) variants.get(s.id).set(k, s.params);
  }
}

function where(e) {
  const line = (e.stack || '').split('\n').find(l => /sims[\\/]/.test(l));
  return line ? ' (' + line.trim().replace(/^at /, '').replace(discDir, '').replace(/^.*?(sims[\\/])/, '$1') + ')' : '';
}

let failures = 0, tested = 0;
const report = [];
const runs = [];
for (const [id, def] of Object.entries(H.sims)) {
  runs.push([id, def, {}]);
  for (const p of (variants.get(id) || new Map()).values()) runs.push([id, def, p]);
}
for (const [id, def, variant] of runs) {
  if (only && !only.has(fileOf.get(id))) continue;
  tested++;
  current = id + (Object.keys(variant).length ? ' ' + JSON.stringify(variant) : '');
  const rec = { stages: [], controls: [], loops: [], drags: [], errors: [], readoutBad: new Set() };
  const kit = makeKit(rec);
  const box = { stage: fakeEl(), side: fakeEl(), card: fakeEl(), node: null };
  const problems = [];
  const badBefore = bad.length;
  const frames = n => {
    for (let i = 0; i < n; i++) {
      clock += 16.7;
      for (const l of rec.loops) { try { l.step(1 / 60, clock / 1000); } catch (e) { throw e; } }
    }
  };
  let cleanup = null;
  try {
    cleanup = def.mount(box, kit, Object.assign({}, def.params || {}, variant));
    for (const l of rec.loops) l.api.start();
    frames(240);
    for (const st of rec.stages) for (const f of st.cbs) f(600, 340);
    frames(5);
    for (const c of rec.controls) {
      for (const d of c.defs) {
        const fire = (k, v) => { c.api.values[k] = v; if (c.onChange) c.onChange(k, v, c.api.values); frames(40); };
        if (d.type === 'buttons') { for (const b of d.items) { if (c.onChange) c.onChange(b.id, true, c.api.values); frames(90); } continue; }
        if (d.type === 'html') continue;
        const orig = c.api.values[d.id];
        if (d.type === 'check') { fire(d.id, !orig); fire(d.id, orig); }
        else if (d.type === 'select') { for (const o of d.options) fire(d.id, o[1]); fire(d.id, orig); }
        else { fire(d.id, d.min); fire(d.id, d.max); fire(d.id, orig); }
      }
    }
    for (const o of rec.drags) {
      for (const p of [{ x: 380, y: 200 }, { x: 100, y: 100 }, { x: 700, y: 380 }]) {
        const t = o.hit(p);
        if (t != null) { o.start && o.start(t, p); o.move(t, { x: p.x + 40, y: p.y - 30 }); o.move(t, { x: 5, y: 5 }); o.end && o.end(t); frames(10); }
      }
    }
    frames(120);
    if (typeof cleanup === 'function') cleanup();
  } catch (e) {
    problems.push('throws: ' + e.message + where(e));
  }
  if (!rec.stages.length) problems.push('never called kit.stage (nothing is drawn)');
  if (!rec.loops.length && !rec.stages.length) problems.push('no loop and no stage');
  problems.push(...rec.errors);
  const nans = bad.slice(badBefore);
  if (nans.length) problems.push(nans.length + ' drawing call(s) with NaN/Infinity, e.g. ' + [...new Set(nans)].slice(0, 3).join('; '));
  if (rec.readoutBad.size) problems.push('shows NaN/Infinity: ' + [...rec.readoutBad].slice(0, 4).join('; '));
  if (problems.length) { failures++; report.push('✗ ' + id + ' (' + path.relative(discDir, fileOf.get(id) || '') + ')\n    ' + problems.join('\n    ')); }
  else report.push('✓ ' + id);
}
if (loadErr.length) { console.log('FILES THAT FAILED TO LOAD\n  ' + loadErr.join('\n  ')); failures += loadErr.length; }
console.log(report.join('\n'));
console.log('\n' + tested + ' simulations tested, ' + (failures ? failures + ' with problems' : 'all fine'));
process.exit(failures ? 1 : 0);
