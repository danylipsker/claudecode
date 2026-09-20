/* tools/make-step.js — run the browser STEP writer under Node so the output
 * can be checked against a real CAD kernel (tools/check-step.py).
 *
 *   node tools/make-step.js <outdir>
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { Math, Date, isFinite, console, Float64Array, Array, JSON };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of ['js/step.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
}

const TAU = Math.PI * 2;
const outDir = process.argv[2] || path.join(root, 'tools', 'out');
fs.mkdirSync(outDir, { recursive: true });

/** closed loop of N points on a polar profile, CCW */
function loop(rOf, N, reverse) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const t = i * TAU / N;
    pts.push([rOf(t) * Math.cos(t), rOf(t) * Math.sin(t)]);
  }
  return reverse ? pts.reverse() : pts;
}

const cases = [
  { name: 'disc-d1', r: () => 20, N: 180, bore: 0, h: 10, deg: 1 },
  { name: 'disc-d3', r: () => 20, N: 180, bore: 0, h: 10, deg: 3 },
  { name: 'disc-bore-d3', r: () => 20, N: 180, bore: 5, h: 10, deg: 3 },
  { name: 'gear-d3', r: (t) => 20 * (1 + 0.12 * Math.cos(18 * t)), N: 360, bore: 6, h: 8, deg: 3 },
  { name: 'gear-nobore-d3', r: (t) => 20 * (1 + 0.12 * Math.cos(18 * t)), N: 360, bore: 0, h: 8, deg: 3 },
  { name: 'gear-nobore-d1', r: (t) => 20 * (1 + 0.12 * Math.cos(18 * t)), N: 360, bore: 0, h: 8, deg: 1 },
  { name: 'square-d3', r: (t) => 20 / Math.pow(Math.pow(Math.abs(Math.cos(t)), 6) + Math.pow(Math.abs(Math.sin(t)), 6), 1 / 6), N: 360, bore: 0, h: 10, deg: 3 }
];

const manifest = [];
for (const c of cases) {
  const outer = loop(c.r, c.N, false);
  const bore = c.bore > 0 ? loop(() => c.bore, 72, true) : null;   /* bore runs the other way */
  const text = sandbox.buildStep([{ outer, bore, label: c.name }], c.h, c.deg, c.name);
  const file = path.join(outDir, c.name + '.step');
  fs.writeFileSync(file, text, 'utf8');

  /* analytic expectation: the shoelace area of the loops we actually sent */
  const area = (pts) => {
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      a += p[0] * q[1] - q[0] * p[1];
    }
    return a / 2;
  };
  const vol = (area(outer) + (bore ? area(bore) : 0)) * c.h;
  manifest.push({ name: c.name, file, expectVolume: vol, degree: c.deg, bytes: text.length });
  console.log(c.name.padEnd(14), String(text.length).padStart(8), 'bytes   polygon volume', vol.toFixed(3));
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log('\nwrote', manifest.length, 'files to', outDir);
