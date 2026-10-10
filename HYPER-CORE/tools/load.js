/* Loads the DOM-free engine modules (and optionally content files) into a
 * sandbox under Node, the way the browser would with <script> tags. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CORE = path.join(__dirname, '..', 'js');
const CORE_FILES = ['hyper.js', 'tex.js', 'expr.js', 'units.js', 'text.js', 'formula.js', 'chem.js', 'finance.js', 'medicine.js', 'fluid.js', 'pharma.js', 'bio.js', 'quantum.js', 'glossary.js', 'linalg.js', 'motors.js', 'ergo.js', 'projection.js', 'geodata.js', 'celestial.js', 'construct.js', 'optics.js', 'optics-wave.js', 'optics-vision.js', 'espcode.js', 'esp32-calc.js', 'esp32-chips.js', 'esp32-boards.js', 'esp32.js', 'esp32-api.js', 'espgfx.js'];

function makeContext() {
  const ctx = { console, Math, JSON, Date, Map, Set, Number, String, Array, Object, Error, RegExp, isFinite, parseFloat, parseInt, Uint8Array, Uint32Array };
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
