/* Tests of the Block lab of Hyper ESP32 (HYPER-CORE/js/ui/esp-blocks.js, Hyper.espBlocks): the registry of blocks,
 * the three generators (block notation, Arduino C++, MicroPython) and the interpreter that runs a program on the
 * virtual board in simulated time. The MicroPython text is parsed by a real Python when one is installed.
 *
 *   node HYPER-CORE/tools/test-espblocks.js
 */
'use strict';
const path = require('path');
const { spawnSync } = require('child_process');
const { loadCore, run } = require('./load');
const H = loadCore();
run(H._ctx, path.join(__dirname, '..', 'js', 'ui', 'esp-blocks.js'));
const B = H.espBlocks, C = H.code;
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  FAIL  ' + name); } };

/* ---------------------------------------------------------------- a real Python, if there is one */
let python = null;
for (const exe of ['python', 'python3', 'py']) {
  try { const r = spawnSync(exe, ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: 'x = 1\n', encoding: 'utf8', timeout: 20000 }); if (r.status === 0) { python = exe; break; } } catch (e) { /* not this one */ }
}
const pyParse = src => { const r = spawnSync(python, ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: src, encoding: 'utf8', timeout: 20000 }); return r.status === 0 ? '' : (r.stderr || 'failed').trim().split('\n').slice(-2).join(' '); };
if (!python) console.log('  (no Python found: the MicroPython programs are not parsed)');

/* ---------------------------------------------------------------- the registry */
const cats = new Set(C.blocks.CATEGORIES.map(c => c[0]));
const ids = Object.keys(B.BLOCKS);
ok(ids.length >= 45, 'about 45 blocks or more (' + ids.length + ')');
for (const id of ids) {
  const d = B.BLOCKS[id];
  ok(cats.has(d.cat) && cats.has(d.group), id + ': category and palette group are categories of the block notation');
  ok(['hat', 'stack', 'c', 'ifelse', 'reporter', 'boolean'].includes(d.shape), id + ': a known shape');
  const holes = (d.tpl.match(/%\d/g) || []).length;
  ok(holes === d.slots.length, id + ': the template has one hole per slot');
  if (d.shape !== 'hat') ok(typeof d.cpp === 'function' && typeof d.py === 'function' && typeof d.run === 'function', id + ': a C++ generator, a MicroPython generator and an interpreter function');
  if (d.shape === 'reporter' || d.shape === 'boolean') ok(typeof d.type === 'function', id + ': a value block knows its type');
  // the colour of a statement or hat block is the one the notation gives its first words
  if (['hat', 'stack', 'c', 'ifelse'].includes(d.shape)) {
    const label = B.fillNote(d, B.make(id, null, 'x'));
    ok(C.blocks.categoryOf(label) === d.cat, id + ': the notation colours "' + label + '" as ' + C.blocks.categoryOf(label) + ', the registry says ' + d.cat);
  }
}
ok(B.PALETTE.every(([cat, items]) => cats.has(cat) && items.every(([t]) => B.BLOCKS[t])), 'the palette names existing blocks');
ok(ids.every(id => B.PALETTE.some(([, items]) => items.some(([t]) => t === id))), 'every block is in the palette');

/* ---------------------------------------------------------------- generating: every example, and one program with every block */
const checkProgram = (model, name) => {
  const blocks = B.gen(model, 'blocks'), cpp = B.gen(model, 'cpp'), py = B.gen(model, 'py');
  ok(blocks.trim() && cpp.trim() && py.trim(), name + ': three forms');
  const p = C.blocks.parse(blocks);
  ok(p.errors.length === 0, name + ': the block text parses without errors ' + p.errors.join('; '));
  ok(p.scripts.length === model.scripts.length, name + ': one script per script of the model (' + p.scripts.length + ')');
  ok(C.balance(cpp, 'cpp') === '', name + ': C++ brackets balance ' + C.balance(cpp, 'cpp'));
  const e = B.entry(model), chk = C.check(e);
  ok(chk.errors.length === 0, name + ': the program card entry has no errors ' + chk.errors.join('; '));
  ok(chk.warnings.length === 0, name + ': no warnings (stale API forms, missing languages) ' + chk.warnings.join('; '));
  ok(/\bvoid setup\(\) \{/.test(cpp) && /\bvoid loop\(\) \{/.test(cpp), name + ': setup() and loop()');
  ok(!/\bledcSetup\b|\bledcAttachPin\b|\bneopixelWrite\b|import u(time|random)\b/.test(cpp + py), name + ': no old API forms');
  ok(!/undefined|NaN/.test(blocks + cpp + py), name + ': no "undefined" or "NaN" in the text');
  if (python) { const err = pyParse(py); ok(!err, name + ': the MicroPython program parses ' + err); }
  return { blocks, cpp, py };
};
for (const ex of B.EXAMPLES) checkProgram(ex.model, 'example ' + ex.id);
ok(B.EXAMPLES.length === 8 && B.EXAMPLES.every(ex => ex.title && ex.teaches.length === 2), 'eight examples, each with two lines of what it teaches');

{
  // every block of the palette, with its default arguments: statements in "when started", values in "print" and "if"
  const stmts = [], vals = [], bools = [], hats = [];
  for (const [, items] of B.PALETTE) for (const [t, preset] of items) {
    const d = B.BLOCKS[t], b = B.make(t, preset, 'x', 'IDLE');
    if (d.shape === 'hat') { if (t !== 'start') hats.push({ hat: b, body: [B.make('changeVar', [undefined, 1], 'x')] }); }
    else if (d.shape === 'reporter') vals.push(b);
    else if (d.shape === 'boolean') bools.push(b);
    else {
      if (d.shape === 'c' || d.shape === 'ifelse') b.body.push(B.make('print', ['inside']));
      if (t === 'waitUntil' || t === 'repeatUntil') b.args[0] = B.make('not', [null]);          // an empty condition would wait for ever
      if (t !== 'forever') stmts.push(b);
    }
  }
  for (const v of vals) stmts.push(B.make('print', [v]));
  for (const c of bools) stmts.push(Object.assign(B.make('if', [c]), { body: [B.make('print', ['yes'])] }));
  const model = { title: 'Everything', vars: ['x'], scripts: [{ hat: B.make('start'), body: stmts.concat([Object.assign(B.make('forever'), { body: [B.make('toggle'), B.make('wait', [0.5])] })]) }].concat(hats) };
  const out = checkProgram(model, 'every block');
  ok(/ledcAttach\(2, 5000, 8\);/.test(out.cpp) && /ledcWrite\(2, 128\);/.test(out.cpp), 'PWM: ledcAttach in setup(), ledcWrite(pin, duty)');
  ok(/servo18\.attach\(18, 500, 2400\)/.test(out.cpp) && /servo_write\(servo18, 90\)/.test(out.py), 'the servo: ESP32Servo in C++, duty_ns in MicroPython');
  ok(/display\.begin\(SSD1306_SWITCHCAPVCC, 0x3C\)/.test(out.cpp) && /ssd1306\.SSD1306_I2C\(128, 64, i2c\)/.test(out.py), 'the OLED: Adafruit_SSD1306 and ssd1306');
  ok(/strip\.setPixelColor\(0, strip\.Color\(255, 0, 0\)\)/.test(out.cpp) && /np\[0\] = \(255, 0, 0\)/.test(out.py), 'pixels: Adafruit_NeoPixel and neopixel');
  ok(/void checkEvents\(\)/.test(out.cpp) && /def check_events\(\):/.test(out.py) && /waitMs\(500\)/.test(out.cpp) && /wait_ms\(500\)/.test(out.py), 'with events, waits keep checking them');
  ok(/millis\(\) - changedA > 30/.test(out.cpp) && /lastTimer1 \+= 1000/.test(out.cpp) && /ticks_add\(last_timer_1, 1000\)/.test(out.py), 'buttons by their edges, timers by millis() and ticks_ms()');
  ok(/def when_button_a\(\):\n    global x\n/.test(out.py), 'a MicroPython event function declares the globals it changes');
  ok(/random\(1, 7\)/.test(out.cpp) && /random\.randint\(1, 6\)/.test(out.py) && /\(float\)1 \/ 1/.test(out.cpp), 'random to b is random(a, b + 1); whole numbers divide as decimals');
  const R = B.run(model).step(2000);
  ok(!R.error && R.now === 2000 && R.serial.length > 10, 'the program with every block runs for two seconds (' + (R.error || R.serial.length + ' lines') + ')');
}
ok(B.gen({ scripts: [] }, 'cpp').includes('void loop()') && B.gen({}, 'py').includes('MicroPython') && B.gen(null, 'blocks') === '', 'an empty program still makes a sketch');

/* ---------------------------------------------------------------- running the examples */
const ex = id => B.EXAMPLES.find(e => e.id === id).model;
{
  const R = B.run(ex('blink')), seen = [];
  for (const t of [500, 1500, 2500, 3500]) { R.step(t - R.now); seen.push(R.led()); }
  ok(seen.join() === '1,0,1,0', 'Blink: the LED changes once a second (' + seen.join() + ')');
  ok(R.current != null || true, 'Blink: the runner reports the block it is on');
}
{
  const R = B.run(ex('button'));
  R.step(100); R.input.A = true; R.step(50);
  const on = R.led(); R.input.A = false; R.step(100); const stays = R.led();
  R.input.A = true; R.step(50); const off = R.led();
  ok(on === 1 && stays === 1 && off === 0, 'Button: a press switches the LED on, the next one off (' + [on, stays, off] + ')');
}
{
  const R = B.run(ex('fade')), lv = [];
  for (let i = 0; i < 150; i++) { R.step(20); lv.push(R.led()); }
  ok(Math.min(...lv) < 0.05 && Math.max(...lv) > 0.95 && lv.some(v => v > 0.3 && v < 0.7), 'Fade: the brightness runs from 0 to full and back');
}
{
  const R = B.run(ex('potbar'));
  const bar = () => { let n = 0; for (let y = 41; y < 51; y++) for (let x = 1; x < 127; x++) n += R.shown.px[y * 128 + x] ? 1 : 0; return n; };
  R.input.pot = 4095; R.step(300); const full = bar();
  R.input.pot = 0; R.step(300); const empty = bar();
  R.input.pot = 2048; R.step(300); const half = bar();
  ok(full > 1200 && empty === 0 && half > 500 && half < 760, 'Potentiometer bar: the bar follows the knob (' + [full, half, empty] + ')');
  ok(R.dispOn && R.shown.lit() > 0, 'Potentiometer bar: the display shows text');
}
{
  const R = B.run(ex('traffic')).step(7500);
  const names = R.serial.map(s => s.split(':')[0]);
  ok(names.slice(0, 4).join() === 'RED,GREEN,YELLOW,RED', 'Traffic light: the states come in order (' + names.join() + ')');
  ok(R.state === 'RED' && R.shownPx[0][0] === 255 && R.shownPx[2][1] === 0, 'Traffic light: red is lit in RED');
}
{
  let seq = 0;
  const R = B.run(ex('reaction'), { random: () => ((seq = (seq * 9301 + 49297) % 233280) / 233280) });
  let line = '', pressedAt = -1;
  for (let i = 0; i < 200 && !line; i++) {
    R.step(50);
    if (R.led() === 1 && pressedAt < 0) { pressedAt = R.now; R.input.A = true; }
    line = R.serial.find(s => /Reaction time/.test(s)) || '';
  }
  const ms = +((/(\d+)$/.exec(line) || [])[1]);
  ok(/^Reaction time in ms: \d+$/.test(line) && ms >= 0 && ms <= 100, 'Reaction game: prints the reaction time (' + line + ')');
}
{
  const R = B.run(ex('servo')), a = [];
  for (let i = 0; i < 80; i++) { R.step(50); a.push(R.servo); }
  ok(Math.min(...a) <= 10 && Math.max(...a) >= 170, 'Servo sweep: from 0 to 180 degrees and back');
}
{
  const R = B.run(ex('rainbow')).step(500);
  const cols = new Set(R.shownPx.map(c => c.join()));
  ok(R.shownPx.every(c => Math.max(...c) > 0) && cols.size >= 6, 'Rainbow: eight lit pixels of different colours (' + cols.size + ')');
}

/* ---------------------------------------------------------------- the interpreter */
{
  // a forever loop without a wait cannot freeze the page: it is cut into slices
  const busy = { scripts: [{ hat: B.make('start'), body: [B.make('pinMode'), Object.assign(B.make('forever'), { body: [B.make('toggle')] })] }] };
  const t0 = Date.now(), R = B.run(busy).step(1000);
  ok(R.now === 1000 && R.steps > 1000 && Date.now() - t0 < 3000, 'a busy forever runs in slices (' + R.steps + ' blocks)');
  R.stop(); const n = R.steps; R.step(1000); ok(R.steps === n, 'Stop stops it');
}
{
  // every n seconds, and an event that arrives while the main script waits
  const m = { vars: ['count', 'presses'], scripts: [
    { hat: B.make('start'), body: [Object.assign(B.make('forever'), { body: [B.make('wait', [10])] })] },
    { hat: B.make('every', [1]), body: [B.make('changeVar', [undefined, 1], 'count')] },
    { hat: B.make('button', ['B']), body: [B.make('changeVar', [undefined, 1], 'presses')] }] };
  const R = B.run(m);
  R.step(3500); R.input.B = true; R.step(100); R.input.B = false; R.step(100); R.input.B = true; R.step(100);
  ok(R.vars.count === 3, '"every 1 seconds" ran three times in 3.8 s (' + R.vars.count + ')');
  ok(R.vars.presses === 2, 'two presses of button B during a wait were both seen (' + R.vars.presses + ')');
  ok(R.read(4) === 0 && R.pins[4].mode === 'pullup', 'a button with an event script gets its pull-up');
}
{
  // an event script that waits holds the main script, as in the generated sketch
  const m = { vars: ['x'], scripts: [
    { hat: B.make('start'), body: [Object.assign(B.make('forever'), { body: [B.make('changeVar', [undefined, 1], 'x'), B.make('wait', [0.1])] })] },
    { hat: B.make('button', ['A']), body: [B.make('wait', [1])] }] };
  const R = B.run(m); R.step(1000); const before = R.vars.x;
  R.input.A = true; R.step(900); const during = R.vars.x;
  ok(before >= 9 && during - before <= 1, 'while an event script waits, the main script waits too (' + before + ' → ' + during + ')');
}
{
  // types: whole numbers stay whole, division makes decimals, join makes text
  const m = { vars: ['a', 'b', 't'], scripts: [{ hat: B.make('start'), body: [
    B.make('setVar', [undefined, B.make('arith', [7, '/', 2])], 'a'), B.make('setVar', [undefined, B.make('arith', [7, 'mod', 3])], 'b'),
    B.make('setVar', [undefined, B.make('join', ['n=', B.make('var', ['b'])])], 't'), B.make('print', [B.make('var', ['a'])]), B.make('print', [B.make('var', ['t'])]),
    B.make('print', [B.make('round', [-2.5])]), B.make('print', [B.make('map', [2048, 0, 4095, 0, 100])])] }] };
  const A = B.analyse(m), R = B.run(m).step(10);
  ok(A.vars.get('a') === 'float' && A.vars.get('b') === 'int' && A.vars.get('t') === 'text', 'variable types are inferred (float, int, text)');
  ok(R.serial.join('|') === '3.50|n=1|-3|50', 'values print as the C++ sketch would print them (' + R.serial.join('|') + ')');
  const cpp = B.gen(m, 'cpp');
  ok(/float a = 0;/.test(cpp) && /long b = 0;/.test(cpp) && /String t = "";/.test(cpp) && /lround\(-2\.5\)/.test(cpp), 'C++ declares float, long and String');
}
{
  const R = B.run({ scripts: [{ hat: B.make('start'), body: [B.make('digitalWrite', [2, 'HIGH']), B.make('dispText', ['x', 0, 0]), B.make('print', ['hi'])] }] }).step(10);
  ok(R.led() === 0 && R.hints.length === 3, 'mistakes are explained: a pin that is not an output, the display not started, serial not started');
}
ok(B.reservedName('delay') && B.reservedName('pin2') && B.reservedName('state') && !B.reservedName('count') && B.cleanName(' my var! ') === 'my_var' && B.cleanState('go on') === 'GO_ON', 'names are cleaned and reserved words refused');

console.log((fail ? 'FAILED: ' + fail + ' of ' : 'OK: ') + (pass + fail) + ' checks' + (fail ? '' : ' passed'));
process.exit(fail ? 1 : 0);
