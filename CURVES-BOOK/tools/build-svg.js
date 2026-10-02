/* Curves Workshop · tools/build-svg.js
 *
 * Draws every figure to svg/<id>.svg (standalone files, with their style and a <desc>
 * naming the page of the book). Reports every figure that fails to build.
 *
 *   node tools/build-svg.js                     all figures
 *   node tools/build-svg.js astroid conics      the figures of these files only (figures/<name>.js)
 *   node tools/build-svg.js --fig fig-009       one figure
 *   node tools/build-svg.js --steps fig-009     also one file per step, svg/steps/fig-009.<n>.svg
 */
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const only = args.filter(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--fig' && args[args.indexOf(a) - 1] !== '--steps');
const figArg = args.includes('--fig') ? args[args.indexOf('--fig') + 1] : null;
const stepsArg = args.includes('--steps') ? args[args.indexOf('--steps') + 1] : null;

const C = require('./load')({ figures: only.length ? only : null, noSections: true });
const OUT = path.join(C.ROOT, 'svg');
fs.mkdirSync(OUT, { recursive: true });
if (stepsArg) fs.mkdirSync(path.join(OUT, 'steps'), { recursive: true });

let ok = 0, bad = 0;
C.loadErrors.forEach(e => { console.error('LOAD ERROR ' + e.file + ': ' + e.error); bad++; });
const ids = C.order.filter(id => !figArg || id === figArg).filter(id => !stepsArg || id === stepsArg);
for (const id of ids) {
  const fig = C.figures.get(id);
  if (only.length && fig._file && !only.includes(fig._file)) continue;
  try {
    const scene = C.build(fig);
    const svg = C.svg(scene, { standalone: true, size: 520 });
    if (/NaN/.test(svg)) throw new Error('NaN in the output');
    fs.writeFileSync(path.join(OUT, id + '.svg'), svg);
    if (stepsArg) scene.steps.forEach(st => fs.writeFileSync(path.join(OUT, 'steps', id + '.' + st.i + '.svg'), C.svg(scene, { standalone: true, size: 520, upTo: st.i })));
    ok++;
  } catch (e) {
    bad++;
    console.error('FAIL ' + id + ': ' + e.message);
  }
}
console.log(ok + ' figures drawn to svg/' + (bad ? ', ' + bad + ' FAILED' : ''));
process.exit(bad ? 1 : 0);
