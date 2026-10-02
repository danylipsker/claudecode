/* Curves Workshop · tools/load.js
 *
 * Loads the kit, the manifest, every figure file in figures/ and every section file in
 * data/sections/ into this node process, the way index.html loads them in the browser.
 *
 *   const C = require('./load')();                 // everything
 *   const C = require('./load')({ figures: ['astroid'] });   // only figures/astroid.js (+ _reference.js)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function run(file) {
  const src = fs.readFileSync(file, 'utf8');
  try {
    vm.runInThisContext(src, { filename: file });
  } catch (e) {
    e.message = path.relative(ROOT, file) + ': ' + e.message;
    throw e;
  }
}

module.exports = function load(opts) {
  opts = opts || {};
  delete globalThis.Curves;
  run(path.join(ROOT, 'js', 'kit.js'));
  run(path.join(ROOT, 'data', 'manifest.js'));
  const C = globalThis.Curves;
  C.loadErrors = [];
  const list = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort() : [];
  for (const f of list(path.join(ROOT, 'figures'))) {
    const name = f.replace(/\.js$/, '');
    if (opts.figures && !opts.figures.includes(name) && name !== '_reference') continue;
    try { run(path.join(ROOT, 'figures', f)); } catch (e) { C.loadErrors.push({ file: 'figures/' + f, error: e.message }); if (opts.strict) throw e; }
  }
  if (!opts.noSections) {
    for (const f of list(path.join(ROOT, 'data', 'sections'))) {
      const name = f.replace(/\.js$/, '');
      if (opts.sections && !opts.sections.includes(name)) continue;
      try { run(path.join(ROOT, 'data', 'sections', f)); } catch (e) { C.loadErrors.push({ file: 'data/sections/' + f, error: e.message }); if (opts.strict) throw e; }
    }
  }
  C.ROOT = ROOT;
  return C;
};
