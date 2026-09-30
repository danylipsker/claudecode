/* The Puzzle Cabinet · tools/load.js
 * Loads the cabinet in node: the core, every engine, every puzzle file.
 *   const { C, famFiles } = require('./load').all();
 * Engines must not touch the page when they load (C.css does nothing here).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CORE = ['js/cabinet.js', 'js/geom.js', 'js/paper.js', 'js/view3d.js', 'js/icons.js', 'js/quips.js', 'js/notebook.js'];

function req(rel) {
  const full = path.join(ROOT, rel);
  delete require.cache[require.resolve(full)];
  require(full);
}

function listJs(dir) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.js')).sort().map((f) => dir + '/' + f);
}

function core() {
  if (!globalThis.Cabinet || !globalThis.Cabinet.geom) CORE.forEach(req);
  return globalThis.Cabinet;
}

// everything; returns the Cabinet and which data files defined each family
function all(opts) {
  opts = opts || {};
  const C = core();
  const errors = [];
  listJs('js/lib').forEach((f) => { try { req(f); } catch (e) { errors.push(f + ': ' + e.message); } });
  listJs('engines').forEach((f) => {
    if (opts.engine && !f.endsWith('/' + opts.engine + '.js')) return;
    try { req(f); } catch (e) { errors.push(f + ': ' + e.stack.split('\n').slice(0, 3).join(' | ')); }
  });
  const famFiles = {};
  const orig = C.family, origHist = C.history, origConc = C.concepts;
  let curFile = null;
  const extraHistory = [], extraConcepts = [];
  C.family = function (meta, list) {
    famFiles[meta.id] = famFiles[meta.id] || [];
    if (!famFiles[meta.id].includes(curFile)) famFiles[meta.id].push(curFile);
    return orig.call(C, meta, list);
  };
  // events and concepts declared in puzzle files (not the two shared files) go into the catalog
  C.history = function (list) {
    if (curFile !== 'data/history.js') (list || []).forEach((e) => extraHistory.push(e));
    return origHist.call(C, list);
  };
  C.concepts = function (list) {
    if (curFile !== 'data/concepts.js') (list || []).forEach((c) => extraConcepts.push(c));
    return origConc.call(C, list);
  };
  listJs('data').forEach((f) => {
    if (f === 'data/catalog.js') return;
    curFile = f;
    try { req(f); } catch (e) { errors.push(f + ': ' + e.stack.split('\n').slice(0, 3).join(' | ')); }
  });
  C.family = orig;
  C.history = origHist;
  C.concepts = origConc;
  return { C, famFiles, errors, ROOT, extraHistory, extraConcepts };
}

module.exports = { all, core, ROOT, listJs };
