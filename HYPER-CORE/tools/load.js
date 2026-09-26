/* Loads the DOM-free engine modules (and optionally content files) into a
 * sandbox under Node, the way the browser would with <script> tags. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CORE = path.join(__dirname, '..', 'js');
const CORE_FILES = ['hyper.js', 'tex.js', 'expr.js', 'units.js', 'text.js', 'formula.js', 'chem.js'];

function makeContext() {
  const ctx = { console, Math, JSON, Date, Map, Set, Number, String, Array, Object, Error, RegExp, isFinite, parseFloat, parseInt };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  vm.createContext(ctx);
  return ctx;
}

function run(ctx, file) {
  const src = fs.readFileSync(file, 'utf8');
  vm.runInContext(src, ctx, { filename: file });
}

function loadCore(ctx) {
  ctx = ctx || makeContext();
  for (const f of CORE_FILES) run(ctx, path.join(CORE, f));
  ctx.Hyper._ctx = ctx;
  return ctx.Hyper;
}

module.exports = { makeContext, loadCore, run, CORE_FILES };
