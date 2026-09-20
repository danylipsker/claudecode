/* tools/make-pair-step.js — build real conjugate pairs with the app's own
 * engine (core.js + gears.js) and write them through the app's own STEP
 * writer, so tools/check-step.py validates the geometry people will actually
 * export rather than a stand-in.
 *
 *   node tools/make-pair-step.js [outdir]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sb = { Math, Date, isFinite, isNaN, console, Float64Array, Int32Array, Array, Object, JSON, Number };
sb.globalThis = sb;
vm.createContext(sb);
for (const f of ['js/core.js', 'js/gears.js', 'js/step.js', 'js/swscript.js', 'js/export.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sb, { filename: f });
}
/* `const` and `class` at the top level of a vm script live in the context's
   lexical scope, not on the sandbox object, so the ones needed out here are
   bridged across from inside. */
vm.runInContext(`globalThis.API = {
  TAU, SHAPE_BY_ID, clamp, rAt, rMin, rMax, symmetryOrder,
  buildShape, addTeeth, solveCenterDistance, buildLaw, mateCentrode, conjugate, buildStep,
  dxfText, svgText, buildSolidWorksScript
};`, sb);
const API = sb.API;

const TAU = Math.PI * 2;
const outDir = process.argv[2] || path.join(root, 'tools', 'out-pairs');
fs.mkdirSync(outDir, { recursive: true });

/** The essentials of studio.js rebuild(), with no UI attached. */
function buildPair(cfg) {
  const N = 1080, M = 1080;
  const def = API.SHAPE_BY_ID[cfg.shape];
  const vals = Object.assign({}, ...def.params.map(p => ({ [p.k]: p.val })), cfg.vals || {});
  const built = API.buildShape(def, vals, N, cfg.smooth == null ? 0.1 : cfg.smooth, {});

  let centrode1, profile1;
  if (def.special === 'involute') {
    const meta = built.r.meta;
    centrode1 = new Float64Array(N).fill(meta.rp);
    profile1 = built.r;
  } else {
    centrode1 = built.r;
    profile1 = cfg.teeth
      ? API.addTeeth(centrode1, cfg.teeth.Z, cfg.teeth.h, cfg.teeth.profile || 'trapezoid', 0, N)
      : centrode1;
  }
  const hasTeeth = profile1 !== centrode1;
  const hRef = hasTeeth ? (def.special === 'involute' ? vals.m : cfg.teeth.h) : 0;

  let cutter1 = profile1;
  const clr = hasTeeth ? 0.25 * hRef : 0;
  if (clr > 0) {
    cutter1 = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const u = API.clamp((profile1[i] - centrode1[i]) / hRef, 0, 1);
      cutter1[i] = profile1[i] + clr * u * u * (3 - 2 * u);
    }
  }
  const ratio = cfg.ratio != null ? cfg.ratio
    : (def.symOf ? def.symOf(vals) : API.symmetryOrder(centrode1)) / (cfg.mateLobes || 1);
  const a = API.solveCenterDistance(centrode1, ratio);
  const law = API.buildLaw(centrode1, a);
  const mate = API.mateCentrode(centrode1, a, M, law);
  const span = TAU / law.ratio;
  const conj = API.conjugate(cutter1, law, a, M, span, 340);
  const blank = a - API.rMin(cutter1);
  const r2 = Float64Array.from(conj.r);
  for (let i = 0; i < M; i++) {
    const cap = hasTeeth ? Math.min(blank, mate.r[i] + hRef) : blank;
    r2[i] = API.clamp(r2[i], 1e-3, cap);
  }
  return { profile1, r2, a, ratio: law.ratio };
}

/** exportPlan()'s sampling, in millimetres. */
function sample(r, scale, n, cx) {
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = i * TAU / n, rr = API.rAt(r, t) * scale;
    out[i] = [(cx || 0) + rr * Math.cos(t), rr * Math.sin(t)];
  }
  return out;
}
function boreLoop(dia, cx) {
  const n = 96, R = dia / 2, out = new Array(n);
  for (let i = 0; i < n; i++) { const t = i * TAU / n; out[i] = [(cx || 0) + R * Math.cos(t), R * Math.sin(t)]; }
  return out;
}
const areaOf = (pts) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
};

const CASES = [
  { name: 'involute-pair', shape: 'involute', vals: { z: 12, m: 0.16, alpha: 20, x: 0 }, ratio: 12 / 18, bore: 12, both: true },
  { name: 'square-roll', shape: 'square', mateLobes: 4, bore: 10, both: true },
  { name: 'square-teeth', shape: 'square', mateLobes: 4, teeth: { Z: 20, h: 0.06 }, bore: 10, both: true },
  { name: 'ellipse-teeth', shape: 'ellipseF', vals: { A: 1, e: 0.35 }, mateLobes: 1, teeth: { Z: 16, h: 0.06 }, bore: 8, both: true },
  { name: 'star-solo', shape: 'star', vals: { R: 1, N: 5, k: 0.55 }, mateLobes: 5, bore: 0, both: false },
  { name: 'pins-pair', shape: 'circle', ratio: 0.5, teeth: { Z: 12, h: 0.07, profile: 'pin' }, bore: 9, both: true },
  { name: 'polyline-wall', shape: 'square', mateLobes: 3, bore: 10, both: true, degree: 1 }
];

const scale = 50, n = 480, thickness = 10;   /* the app's defaults */
const wallDegree = 1;                        /* polyline wall, as the app now defaults to */
const manifest = [];
for (const c of CASES) {
  const P = buildPair(c);
  const gears = [
    { label: 'gear1', cx: 0, outline: sample(P.profile1, scale, n, 0) },
    { label: 'gear2', cx: P.a * scale, outline: sample(P.r2, scale, n, P.a * scale) }
  ].slice(0, c.both ? 2 : 1);
  for (const g of gears) g.bore = c.bore > 0 ? boreLoop(c.bore, g.cx) : null;

  const deg = c.degree || wallDegree;
  const text = API.buildStep(gears.map(g => ({ outer: g.outline, bore: g.bore, label: g.label })),
    thickness, deg, c.name);
  const file = path.join(outDir, c.name + '.step');
  fs.writeFileSync(file, text, 'utf8');

  let vol = 0;
  for (const g of gears) vol += (Math.abs(areaOf(g.outline)) - (g.bore ? Math.abs(areaOf(g.bore)) : 0)) * thickness;
  manifest.push({ name: c.name, file, expectVolume: vol, solids: gears.length, bytes: text.length });
  console.log(c.name.padEnd(16), String(text.length).padStart(8), 'bytes  ', gears.length, 'solid(s)  ratio',
    P.ratio.toFixed(4), '  a', (P.a * scale).toFixed(2), 'mm');
}
/* ── the 2D writers and the SOLIDWORKS script, for the first case ── */
{
  const c = CASES[2];                     /* square with teeth, both gears */
  const P = buildPair(c);
  const gears = [
    { key: 'g1', label: 'gear1', cx: 0, outline: sample(P.profile1, scale, n, 0), pitch: sample(P.profile1, scale, n, 0) },
    { key: 'g2', label: 'gear2', cx: P.a * scale, outline: sample(P.r2, scale, n, P.a * scale), pitch: sample(P.r2, scale, n, P.a * scale) }
  ];
  for (const g of gears) {
    g.bore = boreLoop(c.bore, g.cx);
    g.rMin = Math.min(...g.outline.map(q => Math.hypot(q[0] - g.cx, q[1])));
    g.rMax = Math.max(...g.outline.map(q => Math.hypot(q[0] - g.cx, q[1])));
  }
  const plan = {
    gears, centre: P.a * scale, boreOK: true, n,
    boreDia: c.bore, withPitch: true, ratio: P.ratio, thickness, degree: 3
  };
  const dxf = API.dxfText(plan);
  fs.writeFileSync(path.join(outDir, 'pair.dxf'), dxf.text, 'utf8');
  fs.writeFileSync(path.join(outDir, 'pair.svg'), API.svgText(plan), 'utf8');
  console.log('dxf     ', String(dxf.text.length).padStart(8), 'bytes  layers', dxf.layers.join(' '));

  const local2 = {
    outer: gears[1].outline.map(q => [q[0] - gears[1].cx, q[1]]),
    bore: gears[1].bore.map(q => [q[0] - gears[1].cx, q[1]]),
    label: 'gear2'
  };
  const ps1 = API.buildSolidWorksScript({
    gear1Step: API.buildStep([{ outer: gears[0].outline, bore: gears[0].bore, label: 'gear1' }], thickness, wallDegree, 'pair-1'),
    gear2Step: API.buildStep([local2], thickness, wallDegree, 'pair-2'),
    centreDistanceMM: (P.a * scale).toFixed(6),
    baseName: 'unique-gears-pair',
    thicknessMM: thickness, boreMM: c.bore,
    summary: 'Rounded square pair, ratio 1.0000, 20 and 20 teeth.'
  });
  fs.writeFileSync(path.join(outDir, 'pair.ps1'), ps1, 'utf8');
  console.log('ps1     ', String(ps1.length).padStart(8), 'bytes');
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log('\nwrote', manifest.length, 'files to', outDir);
