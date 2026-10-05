/* Tests of the State machine lab of Hyper ESP32 (HYPER-CORE/js/ui/esp-fsm.js, Hyper.espTools.fsmlab.lib): the design
 * model and its JSON form, the problems it reports, the eight examples run on the engine, and the three generated
 * programs (block notation parsed, C++ and Python brackets balanced, the MicroPython parsed by a real Python when one
 * is installed). With --dump <folder> it also writes every example as an Arduino sketch and a main.py, for compiling
 * with arduino-cli by hand.
 *
 *   node HYPER-CORE/tools/test-fsmlab.js [--dump <folder>]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadCore, run } = require('./load');
const H = loadCore();
H._ctx.performance = { now: () => 0 };
run(H._ctx, path.join(__dirname, '..', 'js', 'espsym.js'));
run(H._ctx, path.join(__dirname, '..', 'js', 'ui', 'esp-fsm.js'));
const L = H.espTools.fsmlab.lib, E = H.esp, C = H.code;
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  FAIL  ' + name); } };
const throws = (fn, re, name) => { try { fn(); ok(false, name + ' (did not throw)'); } catch (e) { ok(!re || re.test(e.message), name + ' (' + e.message + ')'); } };

let python = null;
for (const exe of ['python', 'python3', 'py']) {
  try { const r = spawnSync(exe, ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: 'x = 1\n', encoding: 'utf8', timeout: 20000 }); if (r.status === 0) { python = exe; break; } } catch (e) { /* not this one */ }
}
const pyParse = src => { const r = spawnSync(python, ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: src, encoding: 'utf8', timeout: 20000 }); return r.status === 0 ? '' : (r.stderr || 'failed').trim().split('\n').slice(-2).join(' '); };
if (!python) console.log('  (no Python found: the MicroPython programs are not parsed)');

const codeChecks = (mo, name) => {
  const G = L.genCode(mo);
  ok(C.balance(G.cpp, 'cpp') === '', name + ': C++ brackets balance (' + C.balance(G.cpp, 'cpp') + ')');
  ok(C.balance(G.py, 'python') === '', name + ': Python brackets balance (' + C.balance(G.py, 'python') + ')');
  const bp = C.blocks.parse(G.blocks);
  ok(bp.errors.length === 0, name + ': the blocks parse (' + bp.errors.join('; ') + ')');
  ok(C.lint(G.cpp, 'cpp').length === 0 && C.lint(G.py, 'python').length === 0, name + ': no out-of-date API forms');
  if (python) { const e = pyParse(G.py); ok(!e, name + ': the MicroPython parses (' + e + ')'); }
  ok(/void setup\(\)/.test(G.cpp) && /void loop\(\)/.test(G.cpp), name + ': a sketch with setup() and loop()');
  ok(!/delay\(\d/.test(G.cpp) && !/sleep\((?!_ms\()/.test(G.py), name + ': nothing blocks');
  return G;
};

/* ---------------------------------------------------------------- the examples */
ok(L.EXAMPLES.length === 8, 'eight examples');
const dump = process.argv.includes('--dump') ? process.argv[process.argv.indexOf('--dump') + 1] : null;
for (const x of L.EXAMPLES) {
  const mo = L.fromObj(x), name = x.id;
  ok(mo.states.length >= 4 && x.about.length > 150 && x.teaches, name + ': four states or more, a paragraph, what it teaches');
  const ps = L.problems(mo);
  ok(ps.length === 0, name + ': no problems (' + ps.map(p => p.text).join(' | ') + ')');
  ok(E.fsmCheck(L.toDef(mo)).length === 0, name + ': the engine finds nothing wrong');
  ok(L.undecided(mo).length === 0, name + ': every state/event pair is decided');
  for (const s of mo.states) ok(s.x >= 0 && s.x <= 1 && s.y >= 0 && s.y <= 1 && x.layout[s.name], name + ': ' + s.name + ' has a position');
  // JSON round trip
  const back = L.fromObj(JSON.parse(JSON.stringify(L.exportObj(mo))));
  ok(JSON.stringify(L.toDef(back)) === JSON.stringify(L.toDef(mo)) && JSON.stringify(back) === JSON.stringify(mo), name + ': export then import gives the same design');
  const G = codeChecks(mo, name);
  for (const s of mo.states) ok(G.cpp.includes('ST_' + s.name) && G.py.includes(s.name + ' = ') && G.blocks.includes('[' + s.name + ' v]'), name + ': ' + s.name + ' is in all three programs');
  for (const ev of L.knownEvents(mo)) ok(G.cpp.includes('EV_' + ev) && G.py.includes('"' + ev + '"') && G.blocks.includes('[' + ev + ' v]'), name + ': ' + ev + ' is in all three programs');
  for (const g of L.guardNames(mo)) ok(G.cpp.includes('bool ' + g + '()') && G.py.includes('def ' + g + '():') && G.blocks.includes('<' + g + '>'), name + ': the guard ' + g + ' is in all three programs');
  for (const s of mo.states) { if (s.entry) ok(G.cpp.includes(JSON.stringify(s.entry)) && G.py.includes(JSON.stringify(s.entry)), name + ': the entry action of ' + s.name + ' is in the programs'); if (s.exit) ok(G.cpp.includes(JSON.stringify(s.exit)), name + ': the exit action of ' + s.name + ' is in the program'); }
  const out = L.sampleOutput(mo);
  ok(out.startsWith(mo.title) && out.includes('start in ' + mo.start) && !/undefined|NaN/.test(out), name + ': the sample output');
  const D = L.diagramOf(mo);
  ok(D.def.states.length === mo.states.length && D.def.transitions.every(t => D.index.get(t.from + '>' + t.to) === D.def.transitions.indexOf(t)), name + ': the diagram and its index of arrows');
  if (dump) {
    const dir = path.join(dump, 'fsm_' + name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'fsm_' + name + '.ino'), G.cpp);
    fs.writeFileSync(path.join(dir, 'main.py'), G.py);
    fs.writeFileSync(path.join(dir, 'blocks.txt'), G.blocks);
  }
}

/* ---------------------------------------------------------------- the examples run as they should */
const runEx = (id, guards) => { const mo = L.fromObj(L.EXAMPLES.find(x => x.id === id)); Object.assign(mo.guards, guards || {}); const log = []; const m = E.fsm(L.toDef(mo), { guards: Object.fromEntries(L.guardNames(mo).map(g => [g, () => mo.guards[g] !== false])), onChange: (f, t, w) => log.push(f + '>' + t) }); return { m, log }; };
{
  const { m, log } = runEx('traffic');
  m.tick(5000); ok(m.state === 'RED_AMBER', 'traffic: red for 5 s');
  m.tick(1500 + 5000 + 2000); ok(m.state === 'RED' && log.length === 4, 'traffic: a whole cycle in 13.5 s');
}
{
  const { m } = runEx('button');
  m.send('DOWN'); m.send('UP'); ok(m.state === 'IDLE', 'button: an UP inside the debounce time is a bounce');
  m.send('DOWN'); m.tick(40); ok(m.state === 'PRESSED', 'button: a press is trusted after 30 ms');
  m.send('UP'); ok(m.state === 'IDLE' && m.log[m.log.length - 1].actions.includes('click!'), 'button: a short press is a click');
  m.send('DOWN'); m.tick(800); ok(m.state === 'LONG_PRESS', 'button: holding is a long press');
}
{
  let r = runEx('lock');
  r.m.send('CODE_BAD'); ok(r.m.state === 'LOCKED', 'lock: a wrong code with tries left stays locked');
  r = runEx('lock', { triesLeft: false });
  r.m.send('CODE_BAD'); ok(r.m.state === 'LOCKOUT', 'lock: with no tries left the keypad is locked out');
  r.m.tick(30000); ok(r.m.state === 'LOCKED', 'lock: the lockout ends after 30 s');
  r.m.send('DOOR_OPENED'); ok(r.m.state === 'ALARM', 'lock: forcing the door raises the alarm');
  r.m.send('CODE_OK'); ok(r.m.state === 'UNLOCKED' && r.m.log[r.m.log.length - 1].actions.includes('siren off'), 'lock: the right code stops the siren (exit action)');
  r = runEx('lock', { doorClosed: false });
  r.m.send('CODE_OK'); r.m.send('LOCK_BUTTON'); ok(r.m.state === 'UNLOCKED', 'lock: it will not lock with the door open');
}
{
  const { m } = runEx('garage');
  m.send('BUTTON'); m.send('TOP_LIMIT'); m.send('BUTTON'); ok(m.state === 'CLOSING', 'garage: open, then close');
  m.send('OBSTACLE'); ok(m.state === 'OPENING', 'garage: an obstacle reverses the door');
  m.tick(20000); ok(m.state === 'FAULT', 'garage: a movement that never ends is a fault');
  m.send('BUTTON'); ok(m.state === 'FAULT', 'garage: the button does nothing in FAULT');
  m.send('RESET'); ok(m.state === 'STOPPED', 'garage: RESET clears the fault');
}
{
  const { m } = runEx('washer');
  m.send('START'); m.send('LEVEL_OK'); m.tick(20000); m.send('EMPTY'); m.tick(10000); ok(m.state === 'DONE', 'washer: a whole cycle');
  const r = runEx('washer'); r.m.send('START'); r.m.tick(30000); ok(r.m.state === 'ERROR', 'washer: no water is an error');
}
{
  const { m } = runEx('wifi');
  m.tick(500); m.send('WIFI_OK'); m.send('MQTT_OK'); ok(m.state === 'MQTT_UP', 'wifi: up to MQTT');
  m.send('WIFI_LOST'); ok(m.state === 'CONNECTING', 'wifi: a lost network goes back to CONNECTING');
  m.tick(15000); ok(m.state === 'BACKOFF', 'wifi: a failed attempt backs off');
  m.tick(5000); ok(m.state === 'CONNECTING', 'wifi: and tries again');
}
{
  const { m } = runEx('node', { batteryOk: false });
  m.tick(100); m.send('READING_OK'); ok(m.state === 'SLEEP', 'node: a low battery skips sending');
  const r = runEx('node'); r.m.tick(100); r.m.send('READING_OK'); r.m.tick(10000); ok(r.m.state === 'SLEEP', 'node: sending gives up after 10 s');
}
{
  const { m } = runEx('thermostat');
  m.send('TOO_COLD'); m.send('WARM_ENOUGH'); m.send('TOO_COLD'); ok(m.state === 'COOLDOWN', 'thermostat: TOO_COLD is ignored during the minimum off time');
  m.tick(30000); m.send('TOO_COLD'); ok(m.state === 'HEATING', 'thermostat: and heats again after it');
}

/* ---------------------------------------------------------------- the model and its checks */
throws(() => L.fromObj({ start: 'A' }), /states/, 'a design without states is refused');
throws(() => L.fromObj({ states: { 'two words': {} } }), /name/, 'a state name with a space is refused');
throws(() => L.fromObj({ states: { A: { after: { 5: 'A' } } } }), /timeout/, 'a 5 ms timeout is refused');
throws(() => L.fromObj({ states: { loop: {} } }), /already use/, 'a state called loop is refused');
{
  const mo = L.fromObj({ start: 'A', states: { A: { on: { GO: 'B', X: 'NOWHERE' } }, B: {}, C: { after: { 1000: 'A', 2000: 'B' } } } });
  const t = L.problems(mo).map(p => p.text).join(' | ');
  ok(/NOWHERE, which is not a state/.test(t) && /Nothing leads to C/.test(t) && /B has no way out/.test(t) && /after 2 s never fires/.test(t), 'problems: a missing target, an unreachable state, a dead end, a timeout that never fires (' + t + ')');
  ok(/not decided/.test(t), 'problems: undecided pairs are counted');
  const G = codeChecks(mo, 'broken design');
  ok(/which is not a state/.test(G.cpp) && !/ST_NOWHERE/.test(G.cpp) && !/go\(NOWHERE/.test(G.py), 'a transition to a missing state is left out of the program, with a comment');
}
{
  const mo = L.fromObj({ start: 'A', states: { A: { on: { GO: ['B', { to: 'A', if: 'never' }] } }, B: { on: { GO: 'A' } } } });
  ok(L.problems(mo).some(p => /can never be taken/.test(p.text)), 'problems: an option after an unguarded one can never be taken');
  const G = codeChecks(mo, 'shadowed option');
  ok(!/&& never\(\)/.test(G.cpp) && !/and never\(\)/.test(G.py), 'the unreachable option is not generated');
}
{
  const mo = L.fromObj({ start: 'ONLY', states: { ONLY: {} } });
  codeChecks(mo, 'a machine with one state and nothing else');
  const G = L.genCode(mo);
  ok(!/handle\(/.test(G.cpp) && !/checkTimeouts/.test(G.cpp) && !/select/.test(G.py), 'no events and no timeouts: no handle(), no timeout check, no console reading');
}
{
  const mo = L.fromObj({ title: 'Quotes "and" back\\slashes', start: 'A', states: { A: { entry: 'say "hi" \\ [now] // here', on: { E: { to: 'A', do: 'it\'s (fine) <ok>' } } } } });
  codeChecks(mo, 'quotes and brackets in the actions');
}

console.log((fail ? 'FAILED: ' + fail + ' of ' + (pass + fail) : 'OK: ' + pass + ' checks passed'));
process.exit(fail ? 1 : 0);
