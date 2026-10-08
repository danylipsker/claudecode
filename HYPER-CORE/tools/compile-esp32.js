/* Compiles the Arduino C++ programs of Hyper ESP32 with a real compiler — if arduino-cli and the ESP32 core are installed.
 *
 *   node HYPER-CORE/tools/compile-esp32.js [--work <dir>] [--only topic[,topic]] [--jobs 6] [--limit n] [--failed] [--redo] [--list]
 *                                          [--report [file.md]] [--report-only [file.md]]     (default HYPER-ESP32/COMPILED.md)
 *                                          [--sketchbook <dir>]   build against <dir>/libraries instead of the configured sketchbook
 *                                          [--data <dir>]         use the cores installed in that Arduino data folder
 *                                          [--libraries <dir>,…]  more folders of libraries, beside the sketchbook's
 *
 * Every `code[].cpp` of every concept is written out as a sketch and built with `arduino-cli compile` for the chip the
 * program is meant for (read from its `needs`, `about` and title; the original ESP32 when nothing is said). Nothing is
 * uploaded and nothing is installed: a program whose library is not installed on this machine is reported as "library
 * not installed", not as a failure. Results go to <work>/results.json; `--failed` compiles only what failed last time;
 * `--redo` builds the chosen programs again even when they built before (after a library or core was updated, say).
 *
 * It needs: arduino-cli (the one inside the Arduino IDE will do, or set ARDUINO_CLI) and the esp32:esp32 core.
 * <work> defaults to a folder in the system's temporary directory; the first build of each chip takes about a minute
 * (the core is compiled once and cached there), the rest a few seconds to half a minute each.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { makeContext, loadCore, run } = require('./load');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? (args[i + 1] && !/^--/.test(args[i + 1]) ? args[i + 1] : true) : def; };
const discDir = path.resolve(__dirname, '..', '..', 'HYPER-ESP32');
const work = path.resolve(String(opt('work', path.join(os.tmpdir(), 'hyper-esp32-compile'))));
const only = opt('only', null) ? new Set(String(opt('only')).split(',')) : null;
const jobs = Math.max(1, +opt('jobs', 6) || 6);
const limit = +opt('limit', 0) || 0;
// --sketchbook <dir>: use that folder's libraries/ instead of the sketchbook arduino-cli is set up with (the setting itself is not touched)
const sketchbook = typeof opt('sketchbook', null) === 'string' ? path.resolve(String(opt('sketchbook'))) : null;
// --libraries <dir>[,<dir>]: more folders of libraries, beside the sketchbook's own
const moreLibs = typeof opt('libraries', null) === 'string' ? String(opt('libraries')).split(',').map(d => path.resolve(d)).filter(d => fs.existsSync(d)) : [];
// --data <dir>: use the cores and tools installed in that Arduino data folder (another version of the ESP32 core, say)
const dataDir = typeof opt('data', null) === 'string' ? path.resolve(String(opt('data'))) : null;
const cliEnv = Object.assign({}, process.env, sketchbook ? { ARDUINO_DIRECTORIES_USER: sketchbook } : {}, dataDir ? { ARDUINO_DIRECTORIES_DATA: dataDir } : {});

/* ---------------------------------------------------------------- the compiler */
function findCli() {
  const cands = [process.env.ARDUINO_CLI,
    'C:\\Program Files\\Arduino IDE\\resources\\app\\lib\\backend\\resources\\arduino-cli.exe',
    path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Arduino IDE', 'resources', 'app', 'lib', 'backend', 'resources', 'arduino-cli.exe'),
    '/Applications/Arduino IDE.app/Contents/Resources/app/lib/backend/resources/arduino-cli',
    'arduino-cli'].filter(Boolean);
  for (const c of cands) {
    if (c !== 'arduino-cli' && !fs.existsSync(c)) continue;
    const r = spawnSync(c, ['version'], { encoding: 'utf8' });
    if (r.status === 0) return c;
  }
  return null;
}
const CLI = findCli();
if (!CLI) { console.log('arduino-cli not found (install the Arduino IDE or set ARDUINO_CLI): the C++ programs were not compiled.'); process.exit(0); }

/* A sketchbook collects duplicates (an old "Adafruit_GFX" beside "Adafruit GFX Library") and folders that cannot be read
 * (cloud-only files). For every header that more than one library folder offers, the folder to use is chosen here —
 * readable, with a library.properties, the highest version — and named to arduino-cli with --library. Nothing in the
 * sketchbook is changed. */
function libraryIndex() {
  let dir = '';
  if (sketchbook) dir = sketchbook;
  else try { dir = (spawnSync(CLI, ['config', 'get', 'directories.user'], { encoding: 'utf8' }).stdout || '').trim(); } catch (e) { /* none */ }
  dir = dir ? path.join(dir, 'libraries') : '';
  const byHeader = {};
  const dirs = (dir && fs.existsSync(dir) ? [dir] : []).concat(moreLibs);
  if (!dirs.length) return byHeader;
  const key = v => v.split('.').map(x => String(parseInt(x, 10) || 0).padStart(5, '0')).join('.');
  for (const [name, base] of dirs.flatMap(d => fs.readdirSync(d).map(n => [n, d]))) {
    const root = path.join(base, name);
    let headers = [];
    try {
      if (!fs.statSync(root).isDirectory()) continue;
      for (const sub of ['', 'src']) { const d = path.join(root, sub); if (fs.existsSync(d)) headers = headers.concat(fs.readdirSync(d).filter(h => /\.h(pp)?$/.test(h)).map(h => path.join(d, h))); }
    } catch (e) { continue; }
    if (!headers.length) continue;
    let readable = true, version = '';
    try { fs.closeSync(fs.openSync(headers[0], 'r')); } catch (e) { readable = false; }
    try { version = (/^version=(.+)$/m.exec(fs.readFileSync(path.join(root, 'library.properties'), 'utf8')) || [])[1] || ''; } catch (e) { /* no properties */ }
    for (const h of headers) (byHeader[path.basename(h)] = byHeader[path.basename(h)] || []).push({ root, file: h, readable, score: (readable ? '1' : '0') + (version ? '1' : '0') + key(version || '0') });
  }
  for (const list of Object.values(byHeader)) list.sort((x, y) => (x.score < y.score ? 1 : x.score > y.score ? -1 : 0));
  return byHeader;
}
const LIBINDEX = libraryIndex();

/* the core installed here, and the calls that came with a later one: a program that uses them is right, but cannot be built here */
const CORE_VERSION = (/esp32:esp32\s+(\S+)/.exec(spawnSync(CLI, ['core', 'list'], { encoding: 'utf8', env: cliEnv }).stdout || '') || [])[1] || '0';
const NEWER = [[/matterWaitUntilReady|matterRestartIfNoFabric|useBuiltinCACertBundle/, '3.3.12']];
const olderThan = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0); return false; };
/* the library folders to name for one program: for each header it includes (and those headers include, three deep) that
   more than one folder offers, the best folder */
function librariesFor(src) {
  const out = new Set(), seen = new Set();
  let queue = [...src.matchAll(/#include\s*[<"]([^>"]+)[>"]/g)].map(m => path.basename(m[1]));
  for (let depth = 0; depth < 4 && queue.length; depth++) {
    const next = [];
    for (const h of queue) {
      if (seen.has(h) || seen.size > 80) continue;
      seen.add(h);
      const list = LIBINDEX[h];
      if (!list) continue;
      const best = list[0];
      if (!best.readable) continue;
      if (list.length > 1) out.add(best.root);
      try { for (const m of fs.readFileSync(best.file, 'utf8').matchAll(/#include\s*[<"]([^>"]+)[>"]/g)) next.push(path.basename(m[1])); } catch (e) { /* unreadable */ }
    }
    queue = next;
  }
  return [...out];
}
if (args.includes('--libs')) {
  const dup = Object.entries(LIBINDEX).filter(([h, l]) => l.length > 1);
  console.log(dup.length ? 'Headers offered by more than one library folder (the first is used):\n' + dup.map(([h, l]) => '  ' + h + ': ' + l.map(x => path.basename(x.root) + (x.readable ? '' : ' (unreadable)')).join(', ')).join('\n') : 'No duplicate libraries in the sketchbook.');
  process.exit(0);
}

/* ---------------------------------------------------------------- the programs */
const ctx = makeContext();
const H = loadCore(ctx);
const cdir = path.join(discDir, 'content');
for (const f of fs.readdirSync(cdir).filter(f => f.endsWith('.js'))) {
  try { run(ctx, path.join(cdir, f)); } catch (e) { console.log('! ' + f + ' does not load: ' + e.message); }
}
const fileOf = {};
for (const f of fs.readdirSync(cdir).filter(f => f.endsWith('.js') && f !== 'outline.js')) {
  const src = fs.readFileSync(path.join(cdir, f), 'utf8');
  for (const m of src.matchAll(/^\s{2,4}id:\s*'([a-z0-9-]+)'/gm)) fileOf[m[1]] = f.replace(/\.js$/, '');
}

/* which board a program is for: [fqbn, options] */
const BOARD = { nano: 'arduino:esp32:nano_nora', other: null, esp32: 'esp32:esp32:esp32', s3: 'esp32:esp32:esp32s3', s2: 'esp32:esp32:esp32s2', c3: 'esp32:esp32:esp32c3', c6: 'esp32:esp32:esp32c6', h2: 'esp32:esp32:esp32h2', c5: 'esp32:esp32:esp32c5', p4: 'esp32:esp32:esp32p4', c2: null, c61: null, esp8266: null };
function chipsNamed(text) {
  const out = [];
  // "ESP32-S3" always counts; a bare "S3", "C6", "P4" only in a sentence that has already said ESP32 (a PCF8574 has pins P4…P7)
  const add = (re, k) => {
    const long = new RegExp('ESP32-?' + k.toUpperCase() + '\\b'), short = new RegExp('ESP32[^.;]{0,90}\\b' + k.toUpperCase() + '\\b');
    if ((/^(p4|h2|c61|c6|c5|c3|c2|s3|s2)$/.test(k) ? long.test(text) || short.test(text) || (k === 'c3' && /SuperMini/.test(text)) || (k === 's3' && /CoreS3|AtomS3|StampS3/.test(text)) || (k === 'c2' && /ESP8684/.test(text)) : re.test(text)) && !out.includes(k)) out.push(k);
  };
  add(/ESP32-?P4\b|\bP4\b/, 'p4'); add(/ESP32-?H2\b|\bH2\b/, 'h2'); add(/ESP32-?C61\b|\bC61\b/, 'c61'); add(/ESP32-?C6\b|\bC6\b/, 'c6');
  add(/ESP32-?C5\b|\bC5\b/, 'c5'); add(/ESP32-?C3\b|\bC3\b|SuperMini/, 'c3'); add(/ESP32-?C2\b|\bC2\b|ESP8684/, 'c2');
  add(/ESP32-?S3\b|\bS3\b|CoreS3|AtomS3|StampS3/, 's3'); add(/ESP32-?S2\b|\bS2\b/, 's2');
  return out;
}
function targetsOf(entry, node) {
  const src = entry.cpp;
  // "all chips but the ESP8266", "not the S2", "except the C2": a chip named to exclude it is not a target
  const pos = s => String(s || '').replace(/\b(?:not|but|except|without|no|nor)\b[^.;()]*?\b(?:ESP32-?)?(?:S2|S3|C2|C3|C5|C61|C6|H2|P4|ESP8266|ESP8684)\b/gi, ' ');
  entry = Object.assign({}, entry, { needs: pos(entry.needs), title: pos(entry.title), about: pos(entry.about) });
  const said = chipsNamed([entry.needs, entry.title].join(' ')), about = chipsNamed([entry.about, node.title].join(' '));
  const order = [];
  const push = k => { if (!order.includes(k)) order.push(k); };
  // a program for a board that is not one of Espressif's own targets
  const all = [entry.needs, entry.title, entry.about].join(' ');
  if (/WiFiNINA\.h|WiFiS3\.h|ESP8266WiFi\.h/.test(src) || /UNO R4|Nano 33 IoT|MKR WiFi|Nano RP2040|Portenta/i.test(all)) return ['other'];     // the sketch runs on another microcontroller (or needs the ESP8266 core)
  if (/Nano ESP32/i.test(all)) return ['nano'];
  if (/ESP8266|ESP-01\b|ESP-12|NodeMCU|D1 mini(?! ESP32)/i.test([entry.needs, entry.title].join(' ')) && !/ESP32/i.test(String(entry.needs || ''))) return ['esp8266'];
  // a program said to run on many chips is built for the original ESP32 first
  if (chipsNamed(String(entry.needs || '')).length >= 3 || /\b(any|every)\b/i.test(String(entry.needs || ''))) push('esp32');
  // what the source itself demands
  if (/\bZigbee\.h\b/.test(src)) { push('c6'); push('h2'); }
  if (/\bOThread\.h\b/.test(src)) { push('c6'); push('h2'); }
  if (/\bUSB\.h\b|USBHID|USBMIDI|USBCDC\b/.test(src)) { push('s3'); push('s2'); }
  if (/BluetoothSerial\.h|BluetoothA2DP|dacWrite|\bhall|DAC_CHANNEL|ETH\.h/.test(src)) push('esp32');
  said.forEach(push); about.forEach(push);
  if (/RGB_BUILTIN|rgbLedWrite/.test(src) && !order.length) push('s3');
  if (!said.length || /any|every|all the|family|ESP32\b(?!-)/i.test(String(entry.needs || ''))) push('esp32');
  push('esp32'); push('s3');
  return order.filter(k => BOARD[k]);              // chips this core cannot build (C2, C61) are usually named to say "not on the …"
}
function fqbnOf(key, src) {
  const base = BOARD[key];
  if (!base) return null;
  const o = [];
  if (/\bZigbee\.h\b/.test(src)) { o.push('ZigbeeMode=' + (/ZIGBEE_ROUTER|ZIGBEE_COORDINATOR/.test(src) ? 'zczr' : 'ed')); o.push('PartitionScheme=' + (/ZIGBEE_ROUTER|ZIGBEE_COORDINATOR/.test(src) ? 'zigbee_zczr' : 'zigbee')); }
  if (/\bMatter\.h\b/.test(src)) o.push('PartitionScheme=huge_app');
  if (/BluetoothA2DP|esp_camera\.h|TFT_eSPI|lvgl\.h/.test(src) && key === 'esp32') o.push('PartitionScheme=huge_app');
  if ((key === 's3' || key === 's2') && /\bUSB\.h\b|USBHID|USBMIDI/.test(src)) { if (key === 's3') o.push('USBMode=default'); }
  return base + (o.length ? ':' + o.join(',') : '');
}

const allProgs = [];                 // every program (the report covers them all); progs = the ones this run is about
for (const node of H.list) {
  if (!node.code || !node.code.length) continue;
  const topic = fileOf[node.id] || node.parent;
  node.code.forEach((entry, i) => {
    if (!entry.cpp) return;
    const src = H.code.dedent(entry.cpp);
    allProgs.push({ id: node.id + '#' + (i + 1), topic, title: entry.title || node.title, src, targets: targetsOf(Object.assign({}, entry, { cpp: src }), node) });
  });
}
const progs = only ? allProgs.filter(p => only.has(p.topic) || only.has(p.id.replace(/#\d+$/, ''))) : allProgs;
const resFile = path.join(work, 'results.json');
let previous = {};
try { previous = JSON.parse(fs.readFileSync(resFile, 'utf8')); } catch (e) { /* first run */ }
let todo = progs;
if (opt('redo', false)) todo = progs.slice();   // again, whatever happened last time
else if (opt('failed', false)) todo = progs.filter(p => !previous[p.id] || previous[p.id].status !== 'ok' || previous[p.id].src !== hash(p.src));   // everything that did not build
else todo = progs.filter(p => !(previous[p.id] && previous[p.id].status === 'ok' && previous[p.id].src === hash(p.src)));   // unchanged and fine: not again
if (limit) todo = todo.slice(0, limit);
if (opt('list', false)) { for (const p of progs) console.log(p.id.padEnd(46) + p.targets.join(',')); console.log(progs.length + ' programs'); process.exit(0); }

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }

/* ---------------------------------------------------------------- the report: --report <file.md> (after a run), --report-only (from the last results) */
function writeReport(results, file) {
  const tally = {};
  for (const p of allProgs) { const r = results[p.id]; if (r && r.status === 'ok') tally[r.core || CORE_VERSION] = (tally[r.core || CORE_VERSION] || 0) + 1; }
  const coreV = (Object.entries(tally).sort((a, b) => b[1] - a[1])[0] || [CORE_VERSION])[0];
  const cliV = ((spawnSync(CLI, ['version'], { encoding: 'utf8' }).stdout || '').match(/Version:\s*(\S+)/) || [])[1] || '?';
  const rows = allProgs.map(p => Object.assign({ id: p.id, stale: results[p.id] && results[p.id].src !== hash(p.src) }, results[p.id] || { status: 'none' }));
  const by = s => rows.filter(r => r.status === s && !r.stale);
  const needCore = by('core');
  const ok = by('ok'), lib = by('lib'), skip = by('skip'), fail = by('fail'), none = rows.filter(r => r.status === 'none' || r.stale);
  const page = id => id.replace(/#\d+$/, ''), num = id => id.replace(/^.*#/, '');
  const line = r => '| `' + page(r.id) + '` | ' + num(r.id) + ' | ' + String(r.title || '').replace(/\|/g, '/') + ' | ' + String(r.why || r.note || '').replace(/\|/g, '/').slice(0, 220) + ' |';
  const table = (list, last) => '| Page | Program | Title | ' + last + ' |\n|---|---|---|---|\n' + list.map(line).join('\n') + '\n';
  const boards = {};
  ok.forEach(r => { boards[r.board] = (boards[r.board] || 0) + 1; });
  const names = { esp32: 'ESP32', s3: 'ESP32-S3', s2: 'ESP32-S2', c3: 'ESP32-C3', c6: 'ESP32-C6', h2: 'ESP32-H2', c5: 'ESP32-C5', p4: 'ESP32-P4', nano: 'Arduino Nano ESP32' };
  let md = '# Which programs were compiled\n\n' +
    'Written by `node HYPER-CORE/tools/compile-esp32.js` on ' + new Date().toISOString().slice(0, 10) + ' with arduino-cli ' + cliV + ' and the Arduino core for ESP32 ' + coreV + '.\n' +
    'Every Arduino C++ program of the pages was built for the chip it is written for. A build proves that the program is\nvalid C++ against that version of the core and the libraries installed on the machine; it does not prove that it does\nwhat the page says — nothing here was run on hardware. MicroPython programs are only parsed, and block programs are\nchecked by the validator.\n\n' +
    '| | Programs |\n|---|---|\n| Arduino C++ programs | ' + rows.length + ' |\n| **Built without error** | **' + ok.length + '** |\n' +
    '| … of those, only with the large app partition (Tools → Partition Scheme → Huge APP) | ' + ok.filter(r => r.note && !r.part).length + ' |\n| … of those, one part of a sketch whose other part is on another page (compiled, not linked) | ' + ok.filter(r => r.part).length + ' |\n' +
    '| Need a library that was not installed on that machine (not built) | ' + lib.length + ' |\n| Use a call of a newer core than the one installed (not built) | ' + needCore.length + ' |\n| Written for another board, or needing a file of your own (not built) | ' + skip.length + ' |\n' +
    '| Failed to build | ' + fail.length + ' |\n' + (none.length ? '| Not compiled since they were last changed | ' + none.length + ' |\n' : '') +
    '\nBuilt for: ' + Object.entries(boards).sort((a, b) => b[1] - a[1]).map(([k, n]) => (names[k] || k) + ' ' + n).join(', ') + '.\n';
  if (fail.length) md += '\n## Failed to build\n\n' + table(fail, 'Compiler says');
  if (lib.length) md += '\n## Not built: the library is not installed\n\nInstall the library named on the page (Sketch → Include Library → Manage Libraries) and they can be built the same way.\n\n' + table(lib, 'Missing header');
  if (needCore.length) md += '\n## Not built: they need a newer core\n\nUpdate the "esp32 by Espressif Systems" package in the Boards Manager and they can be built the same way.\n\n' + table(needCore, 'Why');
  if (skip.length) md += '\n## Not built: another board, or a file of your own\n\n' + table(skip, 'Why');
  if (ok.some(r => r.note && !r.part)) md += '\n## Built, but only with a larger app partition\n\n' + table(ok.filter(r => r.note && !r.part), 'Note');
  const other = ok.filter(r => r.core && r.core !== coreV);
  if (other.length) md += '\n## Built with another version of the core\n\nThey were built with the version of the core named, not with ' + coreV + ' like the rest: either they use a call that only a newer core has, or the library they use, as installed on that machine, does not build with ' + coreV + '.\n\n' + table(other.map(r => Object.assign({}, r, { why: 'built with the Arduino core ' + r.core })), 'Note');
  if (ok.some(r => r.part)) md += '\n## Compiled as one part of a sketch\n\n' + table(ok.filter(r => r.part), 'Note');
  if (none.length) md += '\n## Not compiled since their last change\n\n' + none.map(r => '`' + r.id + '`').join(', ') + '\n';
  fs.writeFileSync(file, md);
  console.log('report: ' + file);
}
if (opt('report-only', false)) { writeReport(previous, path.resolve(typeof opt('report-only') === 'string' ? opt('report-only') : path.join(discDir, 'COMPILED.md'))); process.exit(0); }

/* ---------------------------------------------------------------- compiling */
fs.mkdirSync(work, { recursive: true });
const env = Object.assign({}, cliEnv, { ARDUINO_BUILD_CACHE_PATH: path.join(work, 'cache') });
function compile(worker, p, key, extra) {
  return new Promise(resolve => {
    let fqbn = fqbnOf(key, p.src);
    if (fqbn && extra && !fqbn.includes(extra.split('=')[0])) fqbn += (fqbn.split(':').length > 3 ? ',' : ':') + extra;
    if (!fqbn) return resolve({ status: 'skip', why: key === 'other' ? 'written for a board outside the ESP32 core (another microcontroller, or the ESP8266)' : 'no Arduino board for the ' + key.toUpperCase() + ' in this core' });
    const sk = path.join(work, 'w' + worker, 's_' + key), ino = path.join(sk, 's_' + key + '.ino');
    fs.mkdirSync(sk, { recursive: true });
    fs.writeFileSync(ino, p.src + '\n');
    const extraArgs = [];
    for (const d of moreLibs) extraArgs.push('--libraries', d);
    for (const l of librariesFor(p.src)) extraArgs.push('--library', l);
    // LVGL wants an lv_conf.h beside its folder; without one, build it on its defaults (and with its TFT_eSPI driver when the program uses it)
    // (flags go through the ESP32 core's own mechanism: a build_opt.h file in the sketch folder)
    const optFile = path.join(sk, 'build_opt.h');
    // what a project sets in lv_conf.h and in TFT_eSPI's User_Setup.h: the fonts the program names, the TFT_eSPI driver, the touch pin
    const flags = [];
    if (/\blvgl\.h\b/.test(p.src)) {
      flags.push('-DLV_CONF_SKIP=1');
      if (/lv_tft_espi_create/.test(p.src)) flags.push('-DLV_USE_TFT_ESPI=1');
      for (const m of new Set([...p.src.matchAll(/lv_font_montserrat_(\d+)/g)].map(x => x[1]))) if (m !== '14') flags.push('-DLV_FONT_MONTSERRAT_' + m + '=1');
    }
    if (/TFT_eSPI\.h/.test(p.src) && /\b(getTouch|setTouch|getTouchRaw|calibrateTouch)\b/.test(p.src)) flags.push('-DTOUCH_CS=33');
    fs.writeFileSync(optFile, flags.length ? flags.join(' ') + '\n' : '');     // (empty when none, so that the flags of the program before do not linger)
    const child = spawn(CLI, ['compile', '--fqbn', fqbn, '--build-path', path.join(work, 'w' + worker, 'build_' + key + (fqbn.split(':').length > 3 ? '_' + hash(fqbn) : '')), '--warnings', 'none', '--no-color', '--jobs', '4'].concat(extraArgs, [sk]), { env });
    let out = '';
    child.stdout.on('data', d => { out += d; }); child.stderr.on('data', d => { out += d; });
    const timer = setTimeout(() => { try { child.kill(); } catch (e) { /* gone */ } }, 45 * 60 * 1000);                  // (a big audio or GUI library alone can take a quarter of an hour)
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0) return resolve({ status: 'ok', board: key });
      if (code === null) return resolve({ status: 'fail', board: key, why: 'the build did not finish in 45 minutes and was stopped' });
      const lines = out.split(/\r?\n/);
      // a library that is installed but whose files cannot be opened (cloud-only copies in a synchronised folder)
      const locked = /error: [^\n]*[\\/]libraries[\\/]([^\\/\n]+)[\\/][^\n:]*: (?:Invalid argument|Permission denied)/.exec(out);
      if (locked) return resolve({ status: 'lib', board: key, why: 'the library "' + locked[1] + '" is installed but its files cannot be read on this machine' });
      const newer = NEWER.find(([re, v]) => re.test(out) && olderThan(CORE_VERSION, v));
      if (newer && /was not declared|has no member|not a member/.test(out)) return resolve({ status: 'core', board: key, why: 'uses ' + (newer[0].exec(out) || [''])[0] + '(): needs the Arduino core ' + newer[1] + ' or later (installed here: ' + CORE_VERSION + ')' });
      // a header no library provides: the reader's own trained model, exported for their project
      const own = /fatal error: ((?:model_data|model|\w+_inferencing)\.h): No such file or directory/.exec(out);
      if (own) return resolve({ status: 'skip', board: key, why: 'includes ' + own[1] + ', a file of the reader\'s own (the model exported for their project)' });
      const miss = /fatal error: ([^\s:]+): No such file or directory/.exec(out);
      if (miss) return resolve({ status: 'lib', board: key, why: 'library not installed: ' + miss[1] });
      // a page that shows one part of a sketch declares the function another page defines (void start_display();): it compiles, and
      // the linker misses only that function
      const undef = [...new Set([...out.matchAll(/undefined reference to `([A-Za-z_]\w*)\(/g)].map(m => m[1]))];
      const declaredOnly = n => new RegExp('\\b' + n + '\\s*\\([^)]*\\)\\s*;').test(p.src) && !new RegExp('\\b' + n + '\\s*\\([^)]*\\)\\s*\\{').test(p.src);
      const noMain = n => (n === 'setup' || n === 'loop') && !new RegExp('\\bvoid\\s+' + n + '\\s*\\(').test(p.src);       // a page that shows only the functions another program calls
      if (undef.length && !/\berror:/.test(out.replace(/collect2(\.exe)?: error: ld returned \d+ exit status/g, '')) && undef.every(n => declaredOnly(n) || noMain(n)))
        return resolve({ status: 'ok', board: key, part: true, note: 'one part of a sketch: it compiles, and needs ' + undef.map(n => n + '()').join(', ') + ' from the rest of the sketch (the page says where)' });
      if (/exceeds available space|Sketch too big|will not fit in region|region `[a-z0-9_]+' overflowed/i.test(out)) return resolve({ status: 'big', board: key, why: 'too big for the default partition scheme' });
      const noise = /#pragma message|\bnote:|^\s*\d+ \||\^~|^\s*$/;
      // every error is inside a library's own files, none in the sketch: the installed library does not build with this core
      const errLines = lines.filter(l => /\berror\b/i.test(l) && !/Error during build|exit status/.test(l) && !noise.test(l));
      if (errLines.length && !errLines.some(l => /s_[a-z0-9]+\.ino/.test(l)) && !/undefined reference|multiple definition/.test(out)) {
        const m = /[\\/]libraries[\\/]([^\\/]+)[\\/]/.exec(errLines[0]);
        if (m && !/[\\/]hardware[\\/]esp32[\\/]/.test(errLines[0])) return resolve({ status: 'lib', board: key, why: 'the installed library "' + m[1] + '" does not build with this core: ' + errLines[0].replace(/^.*?[\\/]libraries[\\/]/, '').trim().slice(0, 150) });
      }
      const errs = lines.filter(l => /(\berror\b|undefined reference|multiple definition)/i.test(l) && !/Error during build|exit status/.test(l) && !noise.test(l)).map(l => l.replace(/^.*?s_[a-z0-9]+\.ino:/, 'line ').trim()).slice(0, 6);
      resolve({ status: 'fail', board: key, why: errs.join(' | ') || lines.filter(l => !noise.test(l)).slice(-4).join(' | ') });
    });
  });
}
async function build(worker, p) {
  // a program written for a chip this core cannot build (the ESP8266, the C2, the C61) is not tried on another chip
  if (BOARD[p.targets[0]] === null) return compile(worker, p, p.targets[0]);
  let last = null;
  for (const key of p.targets.slice(0, 3)) {
    let r = await compile(worker, p, key);
    if (r.status === 'big') {                      // too big for the default app partition: build it again with the large one
      const r2 = await compile(worker, p, key, 'PartitionScheme=huge_app');
      r = r2.status === 'ok' ? { status: 'ok', board: key, note: 'needs a larger app partition (Tools > Partition Scheme > Huge APP)' }
        : r2.status === 'big' ? { status: 'fail', board: key, why: 'too big even for the Huge APP partition scheme' } : r2;
    }
    if (r.status === 'ok' || r.status === 'lib' || r.status === 'core' || (r.status === 'skip' && /reader/.test(r.why || ''))) return r;
    if (r.status === 'fail') { if (!last || last.status === 'skip') last = r; else last.also = (last.also || '') + ' · on ' + key + ': ' + r.why.slice(0, 160); }
    else if (!last) last = r;
    // a failure that has nothing to do with the chip is not retried on another chip
    if (r.status === 'fail' && !/not declared|no member|was not declared|undefined reference|No such file|not supported|has no member|does not name a type/.test(r.why)) break;
  }
  return last || { status: 'skip', why: 'no target' };
}

(async function main() {
  console.log('arduino-cli: ' + CLI);
  console.log(progs.length + ' C++ programs, ' + todo.length + ' to compile, ' + jobs + ' at a time; work folder ' + work);
  // build each chip's core once, one after another, before the workers start (they share the cache)
  const boards = [...new Set(todo.map(p => p.targets[0]))].filter(k => BOARD[k]);
  for (const k of boards) {
    const t0 = Date.now();
    const r = await compile(0, { src: 'void setup() {}\nvoid loop() {}' }, k);
    console.log('  core for ' + k + ': ' + r.status + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)' + (r.why ? ' ' + r.why.slice(0, 200) : ''));
  }
  const results = Object.assign({}, previous);
  let done = 0;
  const t0 = Date.now();
  // programs for the same chip with the same libraries go to the same worker, one after another: its build folder then
  // holds those libraries already compiled
  const groupOf = p => p.targets[0] + '|' + [...p.src.matchAll(/#include\s*[<"]([^>"]+)[>"]/g)].map(m => m[1]).sort().join(',');
  const groups = {};
  for (const p of todo) (groups[groupOf(p)] = groups[groupOf(p)] || []).push(p);
  const nw = Math.min(jobs, todo.length) || 1, queues = Array.from({ length: nw }, () => []);
  for (const g of Object.values(groups).sort((a, b) => b.length - a.length)) queues.reduce((a, b) => (b.length < a.length ? b : a)).push(...g);
  async function worker(w) {
    const q = queues[w - 1];
    while (q.length) {
      const p = q.shift();
      const r = await build(w, p);
      results[p.id] = Object.assign({ src: hash(p.src), topic: p.topic, title: p.title, core: CORE_VERSION }, r);
      done++;
      if (r.status !== 'ok') console.log((r.status === 'fail' ? 'FAIL ' : r.status === 'core' ? 'core ' : r.status === 'lib' ? 'lib  ' : 'skip ') + p.id + ' [' + (r.board || '-') + '] ' + String(r.why || '').slice(0, 300));
      fs.writeFileSync(resFile, JSON.stringify(results, null, 1));
      if (done % 20 === 0) console.log('  … ' + done + ' / ' + todo.length + ' (' + Math.round((Date.now() - t0) / 60000) + ' min)');
    }
  }
  await Promise.all(queues.map((x, i) => worker(i + 1)));
  // drop results of programs that no longer exist
  const ids = new Set(progs.map(p => p.id));
  for (const k of Object.keys(results)) if (!ids.has(k) && !only) delete results[k];
  fs.writeFileSync(resFile, JSON.stringify(results, null, 1));
  const all = progs.map(p => results[p.id]).filter(Boolean);
  const n = s => all.filter(r => r.status === s).length;
  const big = all.filter(r => r.status === 'ok' && r.note && !r.part).length;
  console.log('\n' + progs.length + ' C++ programs: ' + n('ok') + ' compile' + (big ? ' (' + big + ' of them only with the large app partition)' : '') + ', ' + n('fail') + ' fail, ' + n('lib') + ' need a library that is not installed here, ' + n('core') + ' need a newer core, ' + n('skip') + ' skipped' +
    (progs.length - all.length ? ', ' + (progs.length - all.length) + ' not compiled yet' : '') + '   (' + Math.round((Date.now() - t0) / 60000) + ' min)');
  if (opt('report', false)) writeReport(results, path.resolve(typeof opt('report') === 'string' ? opt('report') : path.join(discDir, 'COMPILED.md')));
  process.exit(n('fail') ? 1 : 0);
})();
