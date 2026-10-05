/* HYPER-CORE · ui/esp-blocks.js
 *
 * Hyper ESP32 · Tools → Block lab: build an ESP32 program from blocks, Scratch style, watch it run on a virtual
 * board, and read the very same program as Arduino C++ (core 3.3.x) and MicroPython (1.29).
 *
 *   #/tools/blocklab/build      the editor: a palette of blocks, the workspace, a virtual ESP32 DevKit (LED on GPIO2,
 *                               buttons A = GPIO0 and B = GPIO4, a potentiometer on GPIO34, a servo on GPIO18,
 *                               8 pixels on GPIO5, a buzzer on GPIO25, an SSD1306 OLED on I2C 21/22, a serial
 *                               monitor), and the program in three languages underneath
 *   #/tools/blocklab/examples   eight ready programs that load into the editor
 *
 * The DOM-free part is Hyper.espBlocks (it loads under Node; tools/test-espblocks.js tests it):
 *
 *   BLOCKS                       the registry: category, template in the block notation, slots, shape, and for each
 *                                block a C++ generator, a MicroPython generator and an interpreter function
 *   gen(model, 'blocks' | 'cpp' | 'py')   the program as block notation, an Arduino sketch, a MicroPython program
 *   run(model, hooks) -> runner  { step(ms), stop(), input: { A, B, pot }, board, vars, serial, hints, current, … }
 *   EXAMPLES                     [{ id, title, teaches, model }]
 *
 * A program (plain data, kept in localStorage under hyper:esp32:blocklab):
 *   { title, vars: ['count'], states: ['RED'], scripts: [{ hat: { type, args }, body: [block, …] }] }
 *   block = { type, args: [number | text | block | null], body?: [...], else?: [...] }
 *
 * How events become code. A sketch has one thread, so the event scripts (when button pressed, every n seconds,
 * when entering state) are checked by checkEvents() at the end of loop() and inside every wait (waitMs()), with
 * edge detection for the buttons and millis() timers; an event script runs to its end before the one that was
 * waiting carries on. The interpreter keeps exactly that discipline (a stack of coroutines in simulated time), so
 * the virtual board behaves as the generated programs would.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const C = H.code, G = H.gfx;

  /* ================================================================ small helpers */
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const toNum = v => typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 1 : 0) : (Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0);
  const trunc = v => { const n = toNum(v); return Number.isFinite(n) ? Math.trunc(n) : 0; };
  const isBlock = v => v != null && typeof v === 'object' && typeof v.type === 'string';
  const strLit = s => JSON.stringify(String(s));
  const numLit = n => (Number.isFinite(n) ? String(n) : '0');
  // the parts the virtual board carries, by GPIO: also the comments of the generated programs
  const PART = { 0: 'button A (the BOOT button)', 2: 'the LED', 4: 'button B', 5: 'the pixel strip', 18: 'the servo', 25: 'the buzzer', 34: 'the potentiometer' };
  const partNote = n => PART[n] ? 'GPIO' + n + ': ' + PART[n] : '';
  const BUTTON_PIN = { A: 0, B: 4 };
  const PIXELS = 8;
  // names a variable may not take: words of C++, Python and Arduino, and the names the generated programs use
  const RESERVED = new Set(('alignas alignof and asm auto bool break case catch char class const continue default delete do double else enum explicit extern false float for friend goto if inline int long mutable namespace new not ' +
    'nullptr operator or private protected public register return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while xor ' +
    'as assert async await def del elif except finally from global import in is lambda nonlocal pass raise with yield None True False print range len str ' +
    'setup loop delay millis micros random map min max abs round lround constrain digitalWrite digitalRead analogRead analogWrite pinMode Serial String byte word boolean HIGH LOW INPUT OUTPUT ' +
    'display strip state time waitMs wait_ms checkEvents check_events goToState go_to_state playTone play_tone servo_write map_range enterPending enter_pending entering i j k np oled i2c math machine ' +
    'Pin PWM ADC I2C NeoPixel ssd1306 Wire Servo State begin').split(/\s+/));
  const reservedName = s => RESERVED.has(s) || /^(pin|adc|pwm|tone|servo)\d+$/i.test(s) || /^(last|busy|changed)(_?a|_?b|_?timer_?\d+)$/i.test(s) ||
    /^(when_?button|every_?timer|enter|state_)/i.test(s);
  const cleanName = s => String(s || '').trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_]/g, '').replace(/^[^A-Za-z]+/, '').slice(0, 20);
  const cleanState = s => String(s || '').trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '').replace(/^[^A-Z]+/, '').slice(0, 16);
  const ident = s => { const c = cleanName(s) || 'value'; return reservedName(c) ? 'v_' + c : c; };

  /* ================================================================ the registry
     slot types:  num  (a number or a value block)      pin, const  (a number typed in, no value block)
                  text (a text or a value block)        menu, var, state, op  (chosen from a list)
                  bool (a condition block, or empty)
     shapes:      hat · stack · c (one body) · ifelse (two bodies) · reporter (round) · boolean (pointed)
     each block:  cpp(b, g) / py(b, g) -> lines (statements) or { c, atom } / a string (values)
                  run(b, R) -> nothing, or a generator for blocks that take time; values return the value
                  type(b, A) for values: 'int' | 'float' | 'text' | 'bool'                                        */
  const LEVELS = [['HIGH', 'HIGH'], ['LOW', 'LOW']];
  const MODES = [['output', 'output'], ['input', 'input'], ['input with pull-up', 'input with pull-up']];
  const ARITH = [['+', '+'], ['-', '−'], ['*', '×'], ['/', '÷'], ['mod', 'mod']];
  const CMP = [['=', '='], ['<', '<'], ['>', '>'], ['≤', '≤'], ['≥', '≥'], ['≠', '≠']];
  const CMP_CPP = { '=': '==', '<': '<', '>': '>', '≤': '<=', '≥': '>=', '≠': '!=' };

  const BLOCKS = {};
  const def = (id, o) => { o.id = id; o.group = o.group || o.cat; BLOCKS[id] = o; return o; };
  const op2 = (c, atom) => ({ c, atom: !!atom });

  /* ---------------------------------------------------------------- events (hats) */
  def('start', { cat: 'events', shape: 'hat', tpl: 'when started', slots: [], help: 'Runs once when the board starts. A "forever" in it becomes loop().' });
  def('button', { cat: 'events', shape: 'hat', tpl: 'when button %1 pressed', slots: [{ t: 'menu', opts: [['A', 'A'], ['B', 'B']], def: 'A' }], help: 'Runs when the button is pressed (A is GPIO0, the BOOT button; B is GPIO4).' });
  def('every', { cat: 'time', group: 'events', shape: 'hat', tpl: 'every %1 seconds', slots: [{ t: 'const', def: 1, min: 0.01 }], help: 'Runs again and again, at this interval, timed with millis().' });
  def('stateEnter', { cat: 'events', group: 'state', shape: 'hat', tpl: 'when entering state %1', slots: [{ t: 'state', def: 'IDLE' }], help: 'Runs each time the program goes into this state.' });

  /* ---------------------------------------------------------------- control */
  def('forever', {
    cat: 'control', shape: 'c', tpl: 'forever', slots: [],
    cpp: (b, g) => ['while (true) {', ...g.body(b.body, g.ev ? ['checkEvents();'] : []), '}'],
    py: (b, g) => ['while True:', ...g.body(b.body, g.ev ? ['check_events()'] : [])],
    run: function* (b, R) { for (;;) { yield* R.body(b.body); yield R.POLL; yield* R.tick(); } }
  });
  def('repeat', {
    cat: 'control', shape: 'c', tpl: 'repeat %1', slots: [{ t: 'num', def: 10 }],
    cpp: (b, g) => { const v = g.loopVar(); const lines = ['for (int ' + v + ' = 0; ' + v + ' < ' + g.cint(b.args[0]) + '; ' + v + '++) {', ...g.body(b.body), '}']; g.loopDepth--; return lines; },
    py: (b, g) => ['for _ in range(' + g.int(b.args[0]) + '):', ...g.body(b.body)],
    run: function* (b, R) { const n = trunc(R.val(b.args[0])); for (let i = 0; i < n; i++) { yield* R.body(b.body); yield* R.tick(); } }
  });
  def('if', {
    cat: 'control', shape: 'c', tpl: 'if %1 then', slots: [{ t: 'bool' }],
    cpp: (b, g) => ['if (' + g.e(b.args[0]) + ') {', ...g.body(b.body), '}'],
    py: (b, g) => ['if ' + g.e(b.args[0]) + ':', ...g.body(b.body)],
    run: function* (b, R) { if (R.bool(b.args[0])) yield* R.body(b.body); }
  });
  def('ifElse', {
    cat: 'control', shape: 'ifelse', tpl: 'if %1 then', slots: [{ t: 'bool' }],
    cpp: (b, g) => ['if (' + g.e(b.args[0]) + ') {', ...g.body(b.body), '} else {', ...g.body(b.else), '}'],
    py: (b, g) => ['if ' + g.e(b.args[0]) + ':', ...g.body(b.body), 'else:', ...g.body(b.else)],
    run: function* (b, R) { if (R.bool(b.args[0])) yield* R.body(b.body); else yield* R.body(b.else); }
  });
  def('waitUntil', {
    cat: 'control', shape: 'stack', tpl: 'wait until %1', slots: [{ t: 'bool' }],
    cpp: (b, g) => g.ev ? 'while (!(' + g.e(b.args[0]) + ')) waitMs(1);' : 'while (!(' + g.e(b.args[0]) + ')) delay(1);   // look again every millisecond',
    py: (b, g) => ['while not (' + g.e(b.args[0]) + '):', g.ind + (g.ev ? 'wait_ms(1)' : 'time.sleep_ms(1)')],
    run: function* (b, R) { while (!R.bool(b.args[0])) yield* R.wait(1); }
  });
  def('repeatUntil', {
    cat: 'control', shape: 'c', tpl: 'repeat until %1', slots: [{ t: 'bool' }],
    cpp: (b, g) => ['while (!(' + g.e(b.args[0]) + ')) {', ...g.body(b.body), '}'],
    py: (b, g) => ['while not (' + g.e(b.args[0]) + '):', ...g.body(b.body)],
    run: function* (b, R) { while (!R.bool(b.args[0])) { yield* R.body(b.body); yield* R.tick(); } }
  });

  /* ---------------------------------------------------------------- time */
  def('wait', {
    cat: 'time', shape: 'stack', tpl: 'wait %1 seconds', slots: [{ t: 'num', def: 1 }],
    cpp: (b, g) => (g.ev ? 'waitMs(' : 'delay(') + g.ms(b.args[0]) + ');',
    py: (b, g) => g.ev ? 'wait_ms(' + g.ms(b.args[0]) + ')' : 'time.sleep(' + g.e(b.args[0]) + ')',
    run: function* (b, R) { yield* R.wait(R.ms(b.args[0])); }
  });
  def('millis', {
    cat: 'time', shape: 'reporter', tpl: 'milliseconds since start', slots: [], type: () => 'int',
    cpp: () => 'millis()', py: () => 'time.ticks_ms()',
    run: (b, R) => Math.floor(R.now)
  });

  /* ---------------------------------------------------------------- pins */
  def('pinMode', {
    cat: 'pins', shape: 'stack', tpl: 'set pin %1 as %2', slots: [{ t: 'pin', def: 2 }, { t: 'menu', opts: MODES, def: 'output' }],
    cpp: (b, g) => { const n = trunc(b.args[0]); return 'pinMode(' + n + ', ' + ({ output: 'OUTPUT', input: 'INPUT' }[b.args[1]] || 'INPUT_PULLUP') + ');' + g.note(n); },
    py: (b, g) => { const n = trunc(b.args[0]); g.glob('pin' + n); return 'pin' + n + ' = Pin(' + n + ', ' + ({ output: 'Pin.OUT', input: 'Pin.IN' }[b.args[1]] || 'Pin.IN, Pin.PULL_UP') + ')' + g.note(n); },
    run: (b, R) => { R.pin(trunc(b.args[0])).mode = { output: 'out', input: 'in' }[b.args[1]] || 'pullup'; }
  });
  def('digitalWrite', {
    cat: 'pins', shape: 'stack', tpl: 'set pin %1 to %2', slots: [{ t: 'pin', def: 2 }, { t: 'menu', opts: LEVELS, def: 'HIGH' }],
    cpp: b => 'digitalWrite(' + trunc(b.args[0]) + ', ' + (b.args[1] === 'LOW' ? 'LOW' : 'HIGH') + ');',
    py: b => 'pin' + trunc(b.args[0]) + '.value(' + (b.args[1] === 'LOW' ? 0 : 1) + ')',
    run: (b, R) => R.write(trunc(b.args[0]), b.args[1] === 'LOW' ? 0 : 1)
  });
  def('toggle', {
    cat: 'pins', shape: 'stack', tpl: 'toggle pin %1', slots: [{ t: 'pin', def: 2 }],
    cpp: b => { const n = trunc(b.args[0]); return 'digitalWrite(' + n + ', !digitalRead(' + n + '));'; },
    py: b => 'pin' + trunc(b.args[0]) + '.toggle()',
    run: (b, R) => { const n = trunc(b.args[0]); R.write(n, R.pin(n).out ? 0 : 1); }
  });
  def('digitalRead', {
    cat: 'pins', shape: 'reporter', tpl: 'read pin %1', slots: [{ t: 'pin', def: 0 }], type: () => 'int',
    cpp: b => 'digitalRead(' + trunc(b.args[0]) + ')', py: b => 'pin' + trunc(b.args[0]) + '.value()',
    run: (b, R) => R.read(trunc(b.args[0]))
  });
  def('analogRead', {
    cat: 'pins', shape: 'reporter', tpl: 'analog read pin %1', slots: [{ t: 'pin', def: 34 }], type: () => 'int',
    cpp: b => 'analogRead(' + trunc(b.args[0]) + ')', py: b => op2('adc' + trunc(b.args[0]) + '.read_u16() >> 4'),
    run: (b, R) => R.analog(trunc(b.args[0]))
  });
  def('pwm', {
    cat: 'pins', shape: 'stack', tpl: 'set PWM on pin %1 to %2', slots: [{ t: 'pin', def: 2 }, { t: 'num', def: 128 }],
    cpp: (b, g) => 'ledcWrite(' + trunc(b.args[0]) + ', ' + g.e(b.args[1]) + ');',
    py: (b, g) => 'pwm' + trunc(b.args[0]) + '.duty_u16(' + (g.type(b.args[1]) === 'int' ? g.p(b.args[1]) + ' * 257' : 'int(' + g.p(b.args[1]) + ' * 257)') + ')',
    run: (b, R) => { const p = R.pin(trunc(b.args[0])); p.mode = 'pwm'; p.duty = clamp(Math.round(toNum(R.val(b.args[1]))), 0, 255); }
  });
  def('level', {
    cat: 'pins', shape: 'reporter', bare: true, tpl: '%1', slots: [{ t: 'menu', opts: LEVELS, def: 'LOW' }], type: () => 'int',
    cpp: b => b.args[0] === 'HIGH' ? 'HIGH' : 'LOW', py: b => b.args[0] === 'HIGH' ? '1' : '0',
    run: b => (b.args[0] === 'HIGH' ? 1 : 0)
  });

  /* ---------------------------------------------------------------- variables */
  def('setVar', {
    cat: 'variables', shape: 'stack', tpl: 'set %1 to %2', slots: [{ t: 'var' }, { t: 'num', def: 0 }],
    cpp: (b, g) => { const n = ident(b.args[0]); return n + ' = ' + (g.varType(b.args[0]) === 'text' && g.type(b.args[1]) !== 'text' ? 'String(' + g.e(b.args[1]) + ')' : g.e(b.args[1])) + ';'; },
    py: (b, g) => { const n = ident(b.args[0]); g.glob(n); return n + ' = ' + g.e(b.args[1]); },
    run: (b, R) => R.setVar(b.args[0], R.val(b.args[1]), b.args[1])
  });
  def('changeVar', {
    cat: 'variables', shape: 'stack', tpl: 'change %1 by %2', slots: [{ t: 'var' }, { t: 'num', def: 1 }],
    cpp: (b, g) => { const n = ident(b.args[0]); return g.varType(b.args[0]) === 'text' ? n + ' = String(' + n + '.toFloat() + ' + g.p(b.args[1]) + ');' : n + ' += ' + g.e(b.args[1]) + ';'; },
    py: (b, g) => { const n = ident(b.args[0]); g.glob(n); return g.varType(b.args[0]) === 'text' ? n + ' = str(float(' + n + ') + ' + g.p(b.args[1]) + ')' : n + ' += ' + g.e(b.args[1]); },
    run: (b, R) => R.setVar(b.args[0], toNum(R.vars[b.args[0]]) + toNum(R.val(b.args[1])), b.args[1])
  });
  def('var', {
    cat: 'variables', shape: 'reporter', tpl: '%1', slots: [{ t: 'var' }], type: (b, A) => (A.vars.get(b.args[0]) || 'int'),
    cpp: b => ident(b.args[0]), py: b => ident(b.args[0]),
    run: (b, R) => (b.args[0] in R.vars ? R.vars[b.args[0]] : 0)
  });

  /* ---------------------------------------------------------------- operators */
  const arithType = (b, A) => b.args[1] === '/' ? 'float' : b.args[1] === 'mod' ? 'int' : (exprType(b.args[0], A) === 'float' || exprType(b.args[2], A) === 'float') ? 'float' : 'int';
  def('arith', {
    cat: 'operators', shape: 'reporter', tpl: '%1 %2 %3', slots: [{ t: 'num', def: 1 }, { t: 'op', opts: ARITH, def: '+' }, { t: 'num', def: 1 }], type: arithType,
    cpp: (b, g) => {
      const o = b.args[1];
      if (o === '/') return op2((g.type(b.args[0]) === 'float' || g.type(b.args[2]) === 'float' || (typeof b.args[2] === 'number' && !Number.isInteger(b.args[2])) ? g.p(b.args[0]) : '(float)' + g.p(b.args[0])) + ' / ' + g.p(b.args[2]));
      if (o === 'mod') return op2((g.type(b.args[0]) === 'float' ? '(long)' : '') + g.p(b.args[0]) + ' % ' + (g.type(b.args[2]) === 'float' ? '(long)' : '') + g.p(b.args[2]));
      return op2(g.p(b.args[0]) + ' ' + o + ' ' + g.p(b.args[2]));
    },
    py: (b, g) => {
      const o = b.args[1];
      // ticks_ms() wraps around: a difference of two times is written with ticks_diff()
      if (o === '-' && isBlock(b.args[0]) && b.args[0].type === 'millis') return op2('time.ticks_diff(time.ticks_ms(), ' + g.e(b.args[2]) + ')', true);
      return op2(g.p(b.args[0]) + ' ' + (o === 'mod' ? '%' : o) + ' ' + g.p(b.args[2]));
    },
    run: (b, R) => {
      const x = toNum(R.val(b.args[0])), y = toNum(R.val(b.args[2])), o = b.args[1];
      const r = o === '+' ? x + y : o === '-' ? x - y : o === '*' ? x * y : o === '/' ? x / y : (trunc(y) === 0 ? NaN : trunc(x) % trunc(y));
      return arithType(b, R.A) === 'int' && Number.isFinite(r) ? Math.trunc(r) : r;
    }
  });
  def('compare', {
    cat: 'operators', shape: 'boolean', tpl: '%1 %2 %3', slots: [{ t: 'num', def: 0 }, { t: 'op', opts: CMP, def: '=' }, { t: 'num', def: 0 }], type: () => 'bool',
    cpp: (b, g) => op2(g.p(b.args[0]) + ' ' + CMP_CPP[b.args[1]] + ' ' + g.p(b.args[2])),
    py: (b, g) => op2(g.p(b.args[0]) + ' ' + CMP_CPP[b.args[1]] + ' ' + g.p(b.args[2])),
    run: (b, R) => {
      const a = R.val(b.args[0]), c = R.val(b.args[2]), o = b.args[1];
      if (o === '=' || o === '≠') { const eq = (typeof a === 'string' || typeof c === 'string') && !(Number.isFinite(parseFloat(a)) && Number.isFinite(parseFloat(c))) ? String(a) === String(c) : toNum(a) === toNum(c); return o === '=' ? eq : !eq; }
      const x = toNum(a), y = toNum(c);
      return o === '<' ? x < y : o === '>' ? x > y : o === '≤' ? x <= y : x >= y;
    }
  });
  def('logic', {
    cat: 'operators', shape: 'boolean', tpl: '%1 %2 %3', slots: [{ t: 'bool' }, { t: 'op', opts: [['and', 'and'], ['or', 'or']], def: 'and' }, { t: 'bool' }], type: () => 'bool',
    cpp: (b, g) => op2(g.p(b.args[0]) + (b.args[1] === 'or' ? ' || ' : ' && ') + g.p(b.args[2])),
    py: (b, g) => op2(g.p(b.args[0]) + (b.args[1] === 'or' ? ' or ' : ' and ') + g.p(b.args[2])),
    run: (b, R) => (b.args[1] === 'or' ? R.bool(b.args[0]) || R.bool(b.args[2]) : R.bool(b.args[0]) && R.bool(b.args[2]))
  });
  def('not', {
    cat: 'operators', shape: 'boolean', tpl: 'not %1', slots: [{ t: 'bool' }], type: () => 'bool',
    cpp: (b, g) => op2('!' + g.p(b.args[0]), true), py: (b, g) => op2('not ' + g.p(b.args[0])),
    run: (b, R) => !R.bool(b.args[0])
  });
  def('map', {
    cat: 'operators', shape: 'reporter', tpl: 'map %1 from %2 %3 to %4 %5', slots: [{ t: 'num', def: 0 }, { t: 'num', def: 0 }, { t: 'num', def: 4095 }, { t: 'num', def: 0 }, { t: 'num', def: 100 }], type: () => 'int',
    cpp: (b, g) => 'map(' + b.args.map(g.e).join(', ') + ')',
    py: (b, g) => 'map_range(' + b.args.map(g.e).join(', ') + ')',
    run: (b, R) => { const [x, a, c, d, e] = b.args.map(v => trunc(R.val(v))); return c - a === 0 ? -1 : Math.trunc((x - a) * (e - d) / (c - a)) + d; }
  });
  def('random', {
    cat: 'operators', shape: 'reporter', tpl: 'random %1 to %2', slots: [{ t: 'num', def: 1 }, { t: 'num', def: 6 }], type: () => 'int',
    cpp: (b, g) => 'random(' + g.e(b.args[0]) + ', ' + (typeof b.args[1] === 'number' ? numLit(trunc(b.args[1]) + 1) : g.p(b.args[1]) + ' + 1') + ')',
    py: (b, g) => 'random.randint(' + g.int(b.args[0]) + ', ' + g.int(b.args[1]) + ')',
    run: (b, R) => { const a = trunc(R.val(b.args[0])), c = trunc(R.val(b.args[1])); return c <= a ? a : a + Math.floor(R.random() * (c - a + 1)); }
  });
  def('join', {
    cat: 'operators', shape: 'reporter', tpl: 'join %1 %2', slots: [{ t: 'text', def: 'Hello ' }, { t: 'num', def: 1 }], type: () => 'text',
    cpp: (b, g) => op2((g.type(b.args[0]) === 'text' && !isBlock(b.args[0]) ? 'String(' + g.e(b.args[0]) + ')' : g.type(b.args[0]) === 'text' ? g.p(b.args[0]) : 'String(' + g.e(b.args[0]) + ')') + ' + ' + (g.type(b.args[1]) === 'text' ? g.p(b.args[1]) : 'String(' + g.e(b.args[1]) + ')')),
    py: (b, g) => op2(g.str(b.args[0]) + ' + ' + g.str(b.args[1])),
    run: (b, R) => R.text(b.args[0]) + R.text(b.args[1])
  });
  def('round', {
    cat: 'operators', shape: 'reporter', tpl: 'round %1', slots: [{ t: 'num', def: 2.5 }], type: () => 'int',
    cpp: (b, g) => 'lround(' + g.e(b.args[0]) + ')', py: (b, g) => 'round(' + g.e(b.args[0]) + ')',
    run: (b, R) => { const x = toNum(R.val(b.args[0])); return Number.isFinite(x) ? Math.sign(x) * Math.round(Math.abs(x)) : x; }
  });

  /* ---------------------------------------------------------------- serial */
  def('serialBegin', {
    cat: 'serial', shape: 'stack', tpl: 'start serial at %1 baud', slots: [{ t: 'const', def: 115200 }],
    cpp: b => 'Serial.begin(' + trunc(b.args[0]) + ');',
    py: b => '# start serial at ' + trunc(b.args[0]) + ' baud: MicroPython\'s USB serial port is already open',
    run: (b, R) => { R.serialOn = true; }
  });
  def('print', {
    cat: 'serial', shape: 'stack', tpl: 'print %1', slots: [{ t: 'text', def: 'Hello' }],
    cpp: (b, g) => 'Serial.println(' + g.e(b.args[0]) + ');', py: (b, g) => 'print(' + g.e(b.args[0]) + ')',
    run: (b, R) => R.print(R.text(b.args[0]))
  });

  /* ---------------------------------------------------------------- display: an SSD1306 128 × 64 on I2C */
  const dispOk = (R) => { if (!R.dispOn) { R.hint('The display is used before "start display": nothing shows until the display is started.'); return false; } return true; };
  def('dispStart', {
    cat: 'display', shape: 'stack', tpl: 'start display %1', slots: [{ t: 'menu', opts: [['SSD1306 128×64', 'SSD1306 128×64']], def: 'SSD1306 128×64' }],
    cpp: () => ['Wire.begin(21, 22);                          // I2C: SDA on GPIO21, SCL on GPIO22', 'display.begin(SSD1306_SWITCHCAPVCC, 0x3C);   // 0x3C: the usual address of these OLEDs', 'display.setTextColor(SSD1306_WHITE);', 'display.clearDisplay();'],
    py: (b, g) => { g.glob('oled'); return 'oled = ssd1306.SSD1306_I2C(128, 64, i2c)   # address 0x3C'; },
    run: (b, R) => { R.dispOn = true; R.fb.clear(); }
  });
  def('dispClear', {
    cat: 'display', shape: 'stack', tpl: 'clear display', slots: [],
    cpp: () => 'display.clearDisplay();', py: () => 'oled.fill(0)',
    run: (b, R) => { if (dispOk(R)) R.fb.clear(); }
  });
  def('dispText', {
    cat: 'display', shape: 'stack', tpl: 'show %1 at x %2 y %3', slots: [{ t: 'text', def: 'Hello' }, { t: 'num', def: 0 }, { t: 'num', def: 0 }],
    cpp: (b, g) => ['display.setCursor(' + g.e(b.args[1]) + ', ' + g.e(b.args[2]) + ');', 'display.print(' + g.e(b.args[0]) + ');'],
    py: (b, g) => 'oled.text(' + g.str(b.args[0], true) + ', ' + g.int(b.args[1]) + ', ' + g.int(b.args[2]) + ', 1)',
    run: (b, R) => { if (dispOk(R)) R.fb.text(R.text(b.args[0]), trunc(R.val(b.args[1])), trunc(R.val(b.args[2]))); }
  });
  const rectSlots = () => [{ t: 'num', def: 0 }, { t: 'num', def: 0 }, { t: 'num', def: 40 }, { t: 'num', def: 20 }];
  def('dispRect', {
    cat: 'display', shape: 'stack', tpl: 'draw rectangle at x %1 y %2 width %3 height %4', slots: rectSlots(),
    cpp: (b, g) => 'display.drawRect(' + b.args.map(g.e).join(', ') + ', SSD1306_WHITE);',
    py: (b, g) => 'oled.rect(' + b.args.map(g.int).join(', ') + ', 1)',
    run: (b, R) => { if (dispOk(R)) { const [x, y, w, h] = b.args.map(v => trunc(R.val(v))); if (w > 0 && h > 0) R.fb.rect(x, y, w, h, 1); } }
  });
  def('dispFill', {
    cat: 'display', shape: 'stack', tpl: 'fill rectangle at x %1 y %2 width %3 height %4', slots: rectSlots(),
    cpp: (b, g) => 'display.fillRect(' + b.args.map(g.e).join(', ') + ', SSD1306_WHITE);',
    py: (b, g) => 'oled.fill_rect(' + b.args.map(g.int).join(', ') + ', 1)',
    run: (b, R) => { if (dispOk(R)) { const [x, y, w, h] = b.args.map(v => trunc(R.val(v))); if (w > 0 && h > 0) R.fb.fillRect(x, y, w, h, 1); } }
  });
  def('dispLine', {
    cat: 'display', shape: 'stack', tpl: 'draw line from x %1 y %2 to x %3 y %4', slots: [{ t: 'num', def: 0 }, { t: 'num', def: 0 }, { t: 'num', def: 127 }, { t: 'num', def: 63 }],
    cpp: (b, g) => 'display.drawLine(' + b.args.map(g.e).join(', ') + ', SSD1306_WHITE);',
    py: (b, g) => 'oled.line(' + b.args.map(g.int).join(', ') + ', 1)',
    run: (b, R) => { if (dispOk(R)) { const [x0, y0, x1, y1] = b.args.map(v => clamp(trunc(R.val(v)), -1000, 1000)); R.fb.line(x0, y0, x1, y1, 1); } }
  });
  def('dispCircle', {
    cat: 'display', shape: 'stack', tpl: 'draw circle at x %1 y %2 radius %3', slots: [{ t: 'num', def: 64 }, { t: 'num', def: 32 }, { t: 'num', def: 20 }],
    cpp: (b, g) => 'display.drawCircle(' + b.args.map(g.e).join(', ') + ', SSD1306_WHITE);',
    py: (b, g) => { const [x, y, r] = b.args.map(g.int); return 'oled.ellipse(' + x + ', ' + y + ', ' + r + ', ' + r + ', 1)'; },
    run: (b, R) => { if (dispOk(R)) { const [x, y, r] = b.args.map(v => trunc(R.val(v))); if (r >= 0 && r < 200) R.fb.circle(x, y, r, 1); } }
  });
  def('dispUpdate', {
    cat: 'display', shape: 'stack', tpl: 'update display', slots: [],
    cpp: () => 'display.display();', py: () => 'oled.show()',
    run: (b, R) => { if (dispOk(R)) { R.shown.px.set(R.fb.px); R.shown.version++; } }
  });

  /* ---------------------------------------------------------------- lights: 8 WS2812 pixels on GPIO5 */
  def('pixel', {
    cat: 'light', shape: 'stack', tpl: 'set pixel %1 to colour %2 %3 %4', slots: [{ t: 'num', def: 0 }, { t: 'num', def: 255 }, { t: 'num', def: 0 }, { t: 'num', def: 0 }],
    cpp: (b, g) => 'strip.setPixelColor(' + g.e(b.args[0]) + ', strip.Color(' + b.args.slice(1).map(g.e).join(', ') + '));',
    py: (b, g) => 'np[' + g.int(b.args[0]) + '] = (' + b.args.slice(1).map(g.int).join(', ') + ')',
    run: (b, R) => { const i = trunc(R.val(b.args[0])); if (i >= 0 && i < PIXELS) R.px[i] = b.args.slice(1).map(v => clamp(trunc(R.val(v)), 0, 255)); }
  });
  def('pixelsShow', {
    cat: 'light', shape: 'stack', tpl: 'show pixels', slots: [],
    cpp: () => 'strip.show();', py: () => 'np.write()',
    run: (b, R) => { R.shownPx = R.px.map(c => c.slice()); }
  });
  def('pixelsClear', {
    cat: 'light', shape: 'stack', tpl: 'clear pixels', slots: [],
    cpp: () => 'strip.clear();', py: () => 'np.fill((0, 0, 0))',
    run: (b, R) => { R.px = R.px.map(() => [0, 0, 0]); }
  });

  /* ---------------------------------------------------------------- sound, motion */
  def('tone', {
    cat: 'sound', shape: 'stack', tpl: 'play tone %1 Hz on pin %2 for %3 seconds', slots: [{ t: 'num', def: 440 }, { t: 'pin', def: 25 }, { t: 'num', def: 0.2 }],
    cpp: (b, g) => 'playTone(' + trunc(b.args[1]) + ', ' + g.e(b.args[0]) + ', ' + g.ms(b.args[2]) + ');',
    py: (b, g) => 'play_tone(tone' + trunc(b.args[1]) + ', ' + g.int(b.args[0]) + ', ' + g.ms(b.args[2]) + ')',
    run: function* (b, R) {
      const pin = trunc(b.args[1]), ms = R.ms(b.args[2]);
      if (pin !== 25) R.hint('The virtual buzzer is on GPIO25: a tone on GPIO' + pin + ' is not heard.');
      R.tone = { pin, hz: toNum(R.val(b.args[0])) };
      try { yield* R.wait(ms); } finally { R.tone = null; }
    }
  });
  def('servo', {
    cat: 'motion', shape: 'stack', tpl: 'set servo on pin %1 to %2 degrees', slots: [{ t: 'pin', def: 18 }, { t: 'num', def: 90 }],
    cpp: (b, g) => 'servo' + trunc(b.args[0]) + '.write(' + g.e(b.args[1]) + ');',
    py: (b, g) => 'servo_write(servo' + trunc(b.args[0]) + ', ' + g.e(b.args[1]) + ')',
    run: (b, R) => { const pin = trunc(b.args[0]); if (pin === 18) R.servo = clamp(toNum(R.val(b.args[1])), 0, 180); else R.hint('The virtual servo is on GPIO18: GPIO' + pin + ' drives nothing.'); }
  });

  /* ---------------------------------------------------------------- state machines */
  def('goState', {
    cat: 'state', shape: 'stack', tpl: 'go to state %1', slots: [{ t: 'state', def: 'IDLE' }],
    cpp: b => 'goToState(STATE_' + cleanState(b.args[0]) + ');',
    py: b => 'go_to_state(' + strLit(cleanState(b.args[0])) + ')',
    run: (b, R) => { R.state = cleanState(b.args[0]); R.enterPending = true; }
  });
  def('stateIs', {
    cat: 'operators', group: 'state', shape: 'boolean', tpl: 'state = %1', slots: [{ t: 'state', def: 'IDLE' }], type: () => 'bool',
    cpp: b => op2('state == STATE_' + cleanState(b.args[0])), py: b => op2('state == ' + strLit(cleanState(b.args[0]))),
    run: (b, R) => R.state === cleanState(b.args[0])
  });

  /* the type of a value: 'int' | 'float' | 'text' | 'bool' */
  function exprType(e, A) {
    if (e == null) return 'bool';
    if (typeof e === 'number') return Number.isInteger(e) ? 'int' : 'float';
    if (typeof e === 'string') return 'text';
    const d = BLOCKS[e.type];
    return d && d.type ? d.type(e, A) : 'int';
  }

  /* palette groups, in order: [category id, the blocks in it (with preset arguments)] */
  const PALETTE = [
    ['events', [['start'], ['button'], ['every']]],
    ['control', [['forever'], ['repeat'], ['if'], ['ifElse'], ['waitUntil'], ['repeatUntil']]],
    ['time', [['wait'], ['millis']]],
    ['pins', [['pinMode'], ['digitalWrite'], ['toggle'], ['digitalRead'], ['analogRead'], ['pwm'], ['level']]],
    ['variables', [['setVar'], ['changeVar'], ['var']]],
    ['operators', [['arith', [1, '+', 1]], ['arith', [1, '-', 1]], ['arith', [1, '*', 1]], ['arith', [1, '/', 1]], ['arith', [7, 'mod', 3]], ['compare', [0, '=', 0]], ['compare', [0, '<', 0]], ['compare', [0, '>', 0]],
      ['logic', [null, 'and', null]], ['logic', [null, 'or', null]], ['not'], ['map'], ['random'], ['join'], ['round']]],
    ['serial', [['serialBegin'], ['print']]],
    ['display', [['dispStart'], ['dispClear'], ['dispText'], ['dispRect'], ['dispFill'], ['dispLine'], ['dispCircle'], ['dispUpdate']]],
    ['light', [['pixel'], ['pixelsShow'], ['pixelsClear']]],
    ['sound', [['tone']]],
    ['motion', [['servo']]],
    ['state', [['goState'], ['stateEnter'], ['stateIs']]]
  ];

  /* ================================================================ reading a program */
  /* every block of a program, hats and nested values included: fn(block, { script, main }) */
  function eachBlock(model, fn) {
    const args = (b, ctx) => { for (const a of b.args || []) if (isBlock(a)) { fn(a, ctx); args(a, ctx); } };
    const walk = (list, ctx) => { for (const b of list || []) { if (!isBlock(b)) continue; fn(b, ctx); args(b, ctx); walk(b.body, ctx); walk(b.else, ctx); } };
    for (const s of (model && model.scripts) || []) {
      if (!s || !isBlock(s.hat)) continue;
      const ctx = { script: s, main: s.hat.type === 'start' };
      fn(s.hat, ctx); args(s.hat, ctx); walk(s.body, ctx);
    }
  }
  const titleOf = m => String((m && m.title) || 'My program').replace(/[\r\n]+/g, ' ').slice(0, 60);

  /* what a program uses: variables and their types, states, event scripts, pins, parts */
  function analyse(model) {
    model = model || {};
    const A = { vars: new Map(), states: [], start: [], pre: [], loop: null, after: [], buttons: { A: [], B: [] }, timers: [], entries: {}, entryOrder: [],
      pins: { dig: new Set(), cfgMain: new Set(), adc: new Set(), pwm: new Set(), tone: new Set(), servo: new Set() }, uses: {}, hasEvents: false };
    const addVar = n => { n = String(n || ''); if (n && !A.vars.has(n)) A.vars.set(n, 'int'); };
    const addState = s => { s = cleanState(s); if (s && !A.states.includes(s)) A.states.push(s); };
    (model.vars || []).forEach(addVar);
    (model.states || []).forEach(addState);
    eachBlock(model, (b, ctx) => {
      const t = b.type, a = b.args || [], n = trunc(a[0]);
      A.uses[t] = true;
      if (t === 'setVar' || t === 'changeVar' || t === 'var') addVar(a[0]);
      else if (t === 'goState' || t === 'stateEnter' || t === 'stateIs') addState(a[0]);
      else if (t === 'pinMode') { A.pins.dig.add(n); if (ctx.main) A.pins.cfgMain.add(n); }
      else if (t === 'digitalWrite' || t === 'toggle' || t === 'digitalRead') A.pins.dig.add(n);
      else if (t === 'analogRead') A.pins.adc.add(n);
      else if (t === 'pwm') A.pins.pwm.add(n);
      else if (t === 'tone') A.pins.tone.add(trunc(a[1]));
      else if (t === 'servo') A.pins.servo.add(n);
    });
    A.display = Object.keys(A.uses).some(t => /^disp/.test(t));
    A.pixels = !!(A.uses.pixel || A.uses.pixelsShow || A.uses.pixelsClear);
    for (const s of model.scripts || []) {
      if (!s || !isBlock(s.hat)) continue;
      const h = s.hat;
      if (h.type === 'start') A.start.push(...(s.body || []));
      else if (h.type === 'button') A.buttons[(h.args || [])[0] === 'B' ? 'B' : 'A'].push(s);
      else if (h.type === 'every') { const sec = Math.max(0.01, toNum((h.args || [])[0]) || 1); A.timers.push({ sec, ms: Math.round(sec * 1000), script: s, n: A.timers.length + 1 }); }
      else if (h.type === 'stateEnter') { const k = cleanState((h.args || [])[0]); if (!k) continue; if (!A.entries[k]) { A.entries[k] = []; A.entryOrder.push(k); } A.entries[k].push(s); }
    }
    A.btns = ['A', 'B'].filter(k => A.buttons[k].length);
    A.hasEvents = A.btns.length + A.timers.length + A.entryOrder.length > 0;
    const fi = A.start.findIndex(b => b && b.type === 'forever');
    if (fi >= 0) { A.pre = A.start.slice(0, fi); A.loop = A.start[fi].body || []; A.after = A.start.slice(fi + 1); } else A.pre = A.start;
    // a variable is text if it is ever given a text, a decimal number if ever given one, else a whole number
    const rank = { int: 0, float: 1, text: 2 };
    for (let pass = 0, changed = true; changed && pass < 8; pass++) {
      changed = false;
      eachBlock(model, b => {
        if ((b.type !== 'setVar' && b.type !== 'changeVar') || !b.args || !b.args[0]) return;
        let t = exprType(b.args[1], A);
        if (t === 'bool') t = 'int';
        if (b.type === 'changeVar' && t === 'text') t = 'float';
        const cur = A.vars.get(b.args[0]) || 'int';
        if (rank[t] > rank[cur]) { A.vars.set(b.args[0], t); changed = true; }
      });
    }
    // the event scripts as functions of the generated programs: { kind, key, cpp, py, head, script }
    A.fns = [];
    for (const k of A.btns) A.buttons[k].forEach((s, i) => A.fns.push({ kind: 'button', key: k, cpp: 'whenButton' + k + (i ? i + 1 : ''), py: 'when_button_' + k.toLowerCase() + (i ? i + 1 : ''), head: 'when button ' + k + ' pressed', script: s }));
    for (const t of A.timers) A.fns.push({ kind: 'timer', key: t.n, cpp: 'everyTimer' + t.n, py: 'every_timer_' + t.n, head: 'every ' + t.sec + ' seconds', script: t.script });
    for (const k of A.entryOrder) A.entries[k].forEach((s, i) => A.fns.push({ kind: 'enter', key: k, cpp: 'enter' + k + (i ? i + 1 : ''), py: 'enter_' + k.toLowerCase() + (i ? i + 1 : ''), head: 'when entering state ' + k, script: s }));
    A.fnsOf = (kind, key) => A.fns.filter(f => f.kind === kind && f.key === key);
    A.usesWait = A.hasEvents && !!(A.uses.wait || A.uses.waitUntil || A.uses.tone);
    return A;
  }

  /* ================================================================ the block notation */
  // text typed into a slot, made safe for the notation: no brackets, no "//" (a comment), no trailing " v" (a menu)
  const noteText = s => String(s == null ? '' : s).replace(/[[\]]/g, '').replace(/\/\//g, '/ /').replace(/::/g, ':').replace(/\s+v$/, ' v ');
  function slotNote(v, s) {
    if (s.t === 'menu' || s.t === 'var') return '[' + noteText(v) + ' v]';
    if (s.t === 'state') return '[' + cleanState(v) + ' v]';
    if (s.t === 'op') return String(v);
    if (s.t === 'bool') return isBlock(v) ? valueNote(v) : '<>';
    if (isBlock(v)) return valueNote(v);
    if (s.t === 'text') return '[' + noteText(v) + ']';
    return '(' + numLit(toNum(v)) + ')';
  }
  const fillNote = (d, b) => d.tpl.replace(/%(\d)/g, (m, k) => slotNote((b.args || [])[k - 1], d.slots[k - 1] || { t: 'num' }));
  function valueNote(b) {
    const d = BLOCKS[b.type];
    if (!d) return '(0)';
    if (b.type === 'var') return '(' + noteText(b.args[0]) + ')';
    const inner = fillNote(d, b);
    return d.bare ? inner : d.shape === 'boolean' ? '<' + inner + '>' : '(' + inner + ')';
  }
  function genBlocks(model) {
    const out = [];
    const line = (s, d) => out.push('  '.repeat(d) + s);
    const stmt = (b, d) => {
      const def = isBlock(b) && BLOCKS[b.type];
      if (!def) return;
      line(fillNote(def, b), d);
      if (def.shape === 'c' || def.shape === 'ifelse') {
        for (const x of b.body || []) stmt(x, d + 1);
        if (def.shape === 'ifelse') { line('else', d); for (const x of b.else || []) stmt(x, d + 1); }
        line('end', d);
      }
    };
    ((model && model.scripts) || []).filter(s => s && isBlock(s.hat) && BLOCKS[s.hat.type]).forEach((s, i) => {
      if (i) out.push('');
      line(fillNote(BLOCKS[s.hat.type], s.hat), 0);
      // as on the concept pages: the "forever" of "when started" stands at the left, like the loop() it becomes
      for (const b of s.body || []) stmt(b, s.hat.type === 'start' && b.type === 'forever' ? 0 : 1);
    });
    return out.join('\n');
  }

  /* ================================================================ the generator context shared by C++ and MicroPython */
  function makeGen(lang, A) {
    const py = lang === 'py';
    const g = { lang, py, A, ev: A.hasEvents, ind: py ? '    ' : '  ', loopDepth: 0, fn: false, globals: new Set() };
    g.type = e => exprType(e, A);
    g.varType = n => A.vars.get(n) || 'int';
    g.x = e => {
      if (e == null) return op2(py ? 'False' : 'false', true);                       // an empty condition
      if (typeof e === 'number') return op2(numLit(e), e >= 0);
      if (typeof e === 'string') return op2(strLit(e), true);
      const d = BLOCKS[e.type];
      if (!d || !d[lang]) return op2('0', true);
      const r = d[lang](e, g);
      return typeof r === 'string' ? op2(r, true) : r;
    };
    g.e = e => g.x(e).c;                                                               // a value as it stands
    g.p = e => { const r = g.x(e); return r.atom ? r.c : '(' + r.c + ')'; };          // a value inside a bigger one
    g.int = e => (!py || g.type(e) === 'int' ? g.e(e) : 'int(' + g.e(e) + ')');      // MicroPython wants whole numbers for pins, pixels, dots
    g.cint = e => (g.type(e) === 'int' ? g.e(e) : '(int)' + g.p(e));
    g.str = e => (g.type(e) === 'text' ? g.e(e) : 'str(' + g.e(e) + ')');
    g.ms = e => typeof e === 'number' ? numLit(Math.max(0, Math.round(e * 1000))) : py ? (g.type(e) === 'int' ? g.p(e) + ' * 1000' : 'int(' + g.p(e) + ' * 1000)') : g.p(e) + ' * 1000';
    g.note = n => (PART[n] ? (py ? '   # ' : '   // ') + partNote(n) : '');
    g.glob = name => { if (py && g.fn) g.globals.add(name); };
    g.loopVar = () => { const v = 'ijk'[g.loopDepth] || 'i' + g.loopDepth; g.loopDepth++; return v; };
    g.stmt = b => { const d = isBlock(b) && BLOCKS[b.type]; return d && d[lang] ? [].concat(d[lang](b, g)) : []; };
    g.lines = list => (list || []).flatMap(g.stmt);
    g.body = (list, extra) => {
      const lines = g.lines(list).concat(extra || []);
      if (py && !lines.some(l => l.trim() && !l.trim().startsWith('#'))) lines.push('pass');
      return lines.map(l => g.ind + l);
    };
    return g;
  }

  /* ================================================================ Arduino C++ (core 3.3.x) */
  function genCpp(model) {
    const A = analyse(model), g = makeGen('cpp', A), P = A.pins, L = [];
    const push = (...a) => { for (const x of a) if (x != null) L.push(x); };
    push('// ' + titleOf(model) + ' - made in the Block lab of Hyper ESP32', '// For an ESP32 DevKit and the Arduino core 3.3.x');
    const inc = [];
    if (A.display) inc.push('#include <Wire.h>', '#include <Adafruit_GFX.h>', '#include <Adafruit_SSD1306.h>');
    if (A.pixels) inc.push('#include <Adafruit_NeoPixel.h>');
    if (P.servo.size) inc.push('#include <ESP32Servo.h>');
    if (inc.length) push('', ...inc);
    const obj = [];
    if (A.display) obj.push('Adafruit_SSD1306 display(128, 64, &Wire, -1);   // the OLED: 128 x 64 dots on I2C, no reset pin');
    if (A.pixels) obj.push('Adafruit_NeoPixel strip(8, 5, NEO_GRB + NEO_KHZ800);   // 8 WS2812 pixels on GPIO5');
    for (const n of P.servo) obj.push('Servo servo' + n + ';' + g.note(n));
    if (obj.length) push('', ...obj);
    if (A.vars.size) { push(''); for (const [n, t] of A.vars) push((t === 'text' ? 'String ' : t === 'float' ? 'float ' : 'long ') + ident(n) + (t === 'text' ? ' = "";' : ' = 0;')); }
    if (A.states.length) {
      push('', '// the states of the state machine', 'enum State { STATE_NONE, ' + A.states.map(s => 'STATE_' + s).join(', ') + ' };', 'State state = STATE_NONE;');
      if (A.entryOrder.length) push('bool enterPending = false;   // a new state whose entry script has not run yet', 'bool entering = false;       // an entry script is running');
    }
    if (A.btns.length || A.timers.length) push('', '// for the events: the last level of each button, the timers');
    for (const k of A.btns) push('bool last' + k + ' = HIGH, busy' + k + ' = false;', 'uint32_t changed' + k + ' = 0;');
    for (const t of A.timers) push('uint32_t lastTimer' + t.n + ' = 0;', 'bool busyTimer' + t.n + ' = false;');
    if (A.hasEvents) push('', 'void checkEvents();   // below: it runs the event scripts');
    if (A.usesWait) push('', '// wait, but keep checking the events, so that no press is missed', 'void waitMs(uint32_t ms) {', '  uint32_t begin = millis();', '  while (millis() - begin < ms) {', '    checkEvents();', '    delay(1);', '  }', '}');
    if (A.states.length) push('', 'void goToState(State next) {', '  state = next;', A.entryOrder.length ? '  enterPending = true;   // checkEvents() runs its entry script' : null, '}');
    if (A.uses.tone) push('', '// a tone on a passive buzzer: the LEDC makes the square wave', 'void playTone(int pin, int hz, uint32_t ms) {', '  ledcWriteTone(pin, hz);', A.hasEvents ? '  waitMs(ms);' : '  delay(ms);', '  ledcWriteTone(pin, 0);', '}');
    for (const f of A.fns) push('', '// ' + f.head, 'void ' + f.cpp + '() {', ...g.body(f.script.body), '}');
    if (A.hasEvents) {
      push('', '// the event scripts run from here: at the end of loop() and while the program waits', 'void checkEvents() {');
      for (const k of A.btns) {
        const pin = BUTTON_PIN[k], lv = 'level' + k;
        push('  // button ' + k + ' (GPIO' + pin + '): pressed reads LOW; react to the press, not to holding it', '  bool ' + lv + ' = digitalRead(' + pin + ');',
          '  if (' + lv + ' != last' + k + ' && millis() - changed' + k + ' > 30) {   // 30 ms: ignore the contact bounce',
          '    changed' + k + ' = millis();', '    last' + k + ' = ' + lv + ';', '    if (' + lv + ' == LOW && !busy' + k + ') {', '      busy' + k + ' = true;',
          ...A.fnsOf('button', k).map(f => '      ' + f.cpp + '();'), '      busy' + k + ' = false;', '    }', '  }');
      }
      for (const t of A.timers) push('  // every ' + t.sec + ' seconds', '  if (millis() - lastTimer' + t.n + ' >= ' + t.ms + ') {', '    lastTimer' + t.n + ' += ' + t.ms + ';', '    if (!busyTimer' + t.n + ') {',
        '      busyTimer' + t.n + ' = true;', '      everyTimer' + t.n + '();', '      busyTimer' + t.n + ' = false;', '    }', '  }');
      if (A.entryOrder.length) push('  // the entry script of a new state, one at a time, so that states never nest', '  while (enterPending && !entering) {', '    enterPending = false;', '    entering = true;', '    switch (state) {',
        ...A.entryOrder.map(k => '      case STATE_' + k + ': ' + A.fnsOf('enter', k).map(f => f.cpp + '(); ').join('') + 'break;'), '      default: break;', '    }', '    entering = false;', '  }');
      push('}');
    }
    push('', 'void setup() {');
    const auto = [];
    for (const k of A.btns) auto.push('pinMode(' + BUTTON_PIN[k] + ', INPUT_PULLUP);   // button ' + k + ', for "when button ' + k + ' pressed"');
    for (const n of P.pwm) auto.push('ledcAttach(' + n + ', 5000, 8);   // PWM on GPIO' + n + ': 5 kHz, 8 bits (0-255)');
    for (const n of P.tone) if (!P.pwm.has(n)) auto.push('ledcAttach(' + n + ', 2000, 8);   // GPIO' + n + ': the tones of the buzzer');
    for (const n of P.servo) auto.push('servo' + n + '.setPeriodHertz(50);       // a hobby servo wants 50 pulses a second', 'servo' + n + '.attach(' + n + ', 500, 2400);   // of 500-2400 microseconds for 0-180 degrees');
    if (A.pixels) auto.push('strip.begin();');
    if (auto.length) push('  // the parts the blocks use', ...auto.map(l => '  ' + l));
    if (A.pre.length) push(auto.length ? '' : null, '  // when started', ...g.body(A.pre));
    if (A.after.length) push('  // (the blocks after "forever" never run)');
    push('}', '', 'void loop() {');
    if (A.loop) push(...g.body(A.loop));
    if (A.hasEvents) push('  checkEvents();');
    if (!A.loop && !A.hasEvents) push('  // nothing repeats: everything ran once in setup()');
    push('}');
    return L.join('\n');
  }

  /* ================================================================ MicroPython (1.29) */
  function genPy(model) {
    const A = analyse(model), g = makeGen('py', A), P = A.pins, L = [];
    const push = (...a) => { for (const x of a) if (x != null) L.push(x); };
    push('# ' + titleOf(model) + ' - made in the Block lab of Hyper ESP32', '# For an ESP32 DevKit and MicroPython 1.29: save it on the board as main.py');
    const mach = ['Pin'];
    if (P.pwm.size || P.tone.size || P.servo.size) mach.push('PWM');
    if (P.adc.size) mach.push('ADC');
    if (A.display) mach.push('I2C');
    push('from machine import ' + mach.join(', '));
    if (A.pixels) push('from neopixel import NeoPixel');
    if (A.hasEvents || A.uses.wait || A.uses.waitUntil || A.uses.millis || A.uses.tone) push('import time');
    if (A.uses.random) push('import random');
    if (A.display) push('import ssd1306   # not built in: install it with  mpremote mip install ssd1306');
    const obj = [], btnPins = new Set(A.btns.map(k => BUTTON_PIN[k]));
    for (const k of A.btns) obj.push('pin' + BUTTON_PIN[k] + ' = Pin(' + BUTTON_PIN[k] + ', Pin.IN, Pin.PULL_UP)   # button ' + k + ', for "when button ' + k + ' pressed"');
    for (const n of P.dig) if (!P.cfgMain.has(n) && !btnPins.has(n)) obj.push('pin' + n + ' = Pin(' + n + ')' + g.note(n));
    for (const n of P.adc) obj.push('adc' + n + ' = ADC(Pin(' + n + '), atten=ADC.ATTN_11DB)   # 0-3.3 V; read_u16() >> 4 gives 0-4095, like analogRead()');
    for (const n of P.pwm) obj.push('pwm' + n + ' = PWM(Pin(' + n + '), freq=5000, duty_u16=0)   # the blocks use 0-255, so duty_u16 = value * 257');
    for (const n of P.tone) obj.push('tone' + n + ' = PWM(Pin(' + n + '), freq=440, duty_u16=0)' + g.note(n));
    for (const n of P.servo) obj.push('servo' + n + ' = PWM(Pin(' + n + '), freq=50)   # a hobby servo wants 50 pulses a second');
    if (A.pixels) obj.push('np = NeoPixel(Pin(5), 8)   # 8 WS2812 pixels on GPIO5');
    if (A.display) obj.push('i2c = I2C(0, scl=Pin(22), sda=Pin(21))   # the OLED: SDA on GPIO21, SCL on GPIO22');
    if (obj.length) push('', ...obj);
    if (A.vars.size) push('', ...[...A.vars].map(([n, t]) => ident(n) + (t === 'text' ? ' = ""' : ' = 0')));
    if (A.states.length) {
      push('', 'state = None   # the state machine: ' + A.states.map(s => strLit(s)).join(', '));
      if (A.entryOrder.length) push('enter_pending = False   # a new state whose entry script has not run yet', 'entering = False        # an entry script is running');
    }
    for (const k of A.btns) { const l = k.toLowerCase(); push('last_' + l + ' = 1', 'changed_' + l + ' = 0', 'busy_' + l + ' = False'); }
    for (const t of A.timers) push('last_timer_' + t.n + ' = time.ticks_ms()', 'busy_timer_' + t.n + ' = False');
    if (A.uses.map) push('', '', 'def map_range(x, in_min, in_max, out_min, out_max):', '    # Arduino\'s map(): whole numbers, and the result may go beyond the output range',
      '    return int((int(x) - in_min) * (out_max - out_min) / (in_max - in_min)) + out_min');
    if (P.servo.size) push('', '', 'def servo_write(pwm, angle):', '    # 0-180 degrees as a pulse of 500-2400 microseconds, as servo.attach(pin, 500, 2400) does in C++',
      '    angle = max(0, min(180, angle))', '    pwm.duty_ns(int((500 + angle * 1900 / 180) * 1000))');
    if (A.states.length) push('', '', 'def go_to_state(name):', '    global state' + (A.entryOrder.length ? ', enter_pending' : ''), '    state = name', A.entryOrder.length ? '    enter_pending = True   # check_events() runs its entry script' : null);
    if (A.usesWait) push('', '', 'def wait_ms(ms):', '    # wait, but keep checking the events, so that no press is missed', '    begin = time.ticks_ms()', '    while time.ticks_diff(time.ticks_ms(), begin) < ms:', '        check_events()', '        time.sleep_ms(1)');
    if (A.uses.tone) push('', '', 'def play_tone(pwm, hz, ms):', '    pwm.freq(hz)', '    pwm.duty_u16(32768)   # on half the time: a square wave', A.hasEvents ? '    wait_ms(ms)' : '    time.sleep_ms(ms)', '    pwm.duty_u16(0)');
    for (const f of A.fns) {
      g.fn = true; g.globals = new Set();
      const body = g.body(f.script.body);
      push('', '', '# ' + f.head, 'def ' + f.py + '():', g.globals.size ? '    global ' + [...g.globals].join(', ') : null, ...body);
      g.fn = false;
    }
    if (A.hasEvents) {
      const gl = [...A.btns.flatMap(k => ['last_', 'changed_', 'busy_'].map(p => p + k.toLowerCase())), ...A.timers.flatMap(t => ['last_timer_' + t.n, 'busy_timer_' + t.n]), ...(A.entryOrder.length ? ['enter_pending', 'entering'] : [])];
      push('', '', '# the event scripts run from here: at the end of the main loop and while the program waits', 'def check_events():', gl.length ? '    global ' + gl.join(', ') : null);
      for (const k of A.btns) {
        const pin = BUTTON_PIN[k], l = k.toLowerCase();
        push('    # button ' + k + ' (GPIO' + pin + '): pressed reads 0; react to the press, not to holding it', '    level = pin' + pin + '.value()',
          '    if level != last_' + l + ' and time.ticks_diff(time.ticks_ms(), changed_' + l + ') > 30:   # 30 ms: ignore the contact bounce',
          '        changed_' + l + ' = time.ticks_ms()', '        last_' + l + ' = level', '        if level == 0 and not busy_' + l + ':', '            busy_' + l + ' = True',
          ...A.fnsOf('button', k).map(f => '            ' + f.py + '()'), '            busy_' + l + ' = False');
      }
      for (const t of A.timers) push('    if time.ticks_diff(time.ticks_ms(), last_timer_' + t.n + ') >= ' + t.ms + ':   # every ' + t.sec + ' seconds', '        last_timer_' + t.n + ' = time.ticks_add(last_timer_' + t.n + ', ' + t.ms + ')',
        '        if not busy_timer_' + t.n + ':', '            busy_timer_' + t.n + ' = True', '            every_timer_' + t.n + '()', '            busy_timer_' + t.n + ' = False');
      if (A.entryOrder.length) push('    # the entry script of a new state, one at a time, so that states never nest', '    while enter_pending and not entering:', '        enter_pending = False', '        entering = True',
        ...A.entryOrder.flatMap((k, i) => [(i ? '        elif' : '        if') + ' state == ' + strLit(k) + ':', ...A.fnsOf('enter', k).map(f => '            ' + f.py + '()')]), '        entering = False');
    }
    push('', '');
    if (A.pre.length) push('# when started', ...g.lines(A.pre));
    if (A.after.length) push('# (the blocks after "forever" never run)');
    if (A.loop) push('while True:', ...g.body(A.loop, A.hasEvents ? ['check_events()'] : []));
    else if (A.hasEvents) push('while True:', '    check_events()', '    time.sleep_ms(1)');
    else push('# nothing repeats, so the program ends here');
    // no more than one blank line in a row inside the program, two between functions
    return L.join('\n').replace(/\n{4,}/g, '\n\n\n');
  }

  function gen(model, kind) {
    model = model || { scripts: [] };
    return kind === 'cpp' ? genCpp(model) : kind === 'py' ? genPy(model) : genBlocks(model);
  }

  /* the program as an entry for the three-language card: { title, about, needs, wiring, libs, blocks, cpp, py, notes } */
  function entry(model) {
    const A = analyse(model), P = A.pins, need = [], wiring = [], libs = [], notes = [];
    const uses = n => P.dig.has(n) || P.pwm.has(n) || P.adc.has(n) || P.tone.has(n) || P.servo.has(n);
    if (uses(2)) wiring.push(['GPIO2', 'the LED on the board', 'or GPIO2 → 220 Ω → LED → GND']);
    if (uses(0) || A.buttons.A.length) wiring.push(['GPIO0', 'the BOOT button (A)', 'pressed reads LOW']);
    if (uses(4) || A.buttons.B.length) { wiring.push(['GPIO4', 'push button B → GND', 'internal pull-up']); need.push('a push button'); }
    if (P.adc.has(34)) { wiring.push(['GPIO34', 'potentiometer wiper', 'its ends to 3.3 V and GND']); need.push('a 10 kΩ potentiometer'); }
    if (P.servo.has(18)) { wiring.push(['GPIO18', 'servo signal', 'servo power from 5 V, common GND']); need.push('a hobby servo'); libs.push('ESP32Servo'); }
    if (A.pixels) { wiring.push(['GPIO5', 'pixel strip DIN', 'a 5 V strip wants 330 Ω in series']); need.push('a strip of 8 WS2812 pixels'); libs.push('Adafruit NeoPixel'); }
    if (P.tone.has(25)) { wiring.push(['GPIO25', 'passive buzzer → GND']); need.push('a passive buzzer'); }
    if (A.display) { wiring.push(['GPIO21 / GPIO22', 'OLED SDA / SCL', '3.3 V and GND; address 0x3C']); need.push('an SSD1306 OLED, 128 × 64, I2C'); libs.push('Adafruit SSD1306', 'Adafruit GFX'); }
    if (A.hasEvents) notes.push('The event scripts are checked at the end of loop() and inside every wait, so no button press is missed. An event script runs to its end before the rest carries on: a wait inside one holds the others for that time.');
    if (A.display) notes.push('MicroPython\'s font is 8 dots wide, Adafruit GFX\'s 6: text is a little wider in the MicroPython version.');
    if (A.after.length) notes.push('Blocks placed after "forever" never run.');
    return {
      title: titleOf(model), needs: 'An ESP32 DevKit' + (need.length ? ', ' + need.slice(0, -1).join(', ') + (need.length > 1 ? ' and ' : '') + need[need.length - 1] : '') + '.',
      wiring, libs, blocks: genBlocks(model), cpp: genCpp(model), py: genPy(model), notes
    };
  }

  /* ================================================================ the interpreter: the program on a virtual board, in simulated time
     Scripts are generators. Only the top of a stack runs, as in the generated programs: "when started" at the bottom
     (setup(), then loop()), an event script pushed on top whenever events are checked (at the end of each pass of
     "forever", and while the script on top waits), and popped when it ends. A busy loop is cut into slices of SLICE
     blocks a simulated millisecond, so a "forever" without a wait cannot freeze the page. */
  const SLICE = 400;
  const POLL = { t: 'poll' }, BUDGET = { t: 'budget' }, IDLE = { t: 'idle' };
  const fmtVal = (v, t) => {
    if (typeof v === 'string') return v;
    if (typeof v === 'boolean') return v ? '1' : '0';
    if (!Number.isFinite(v)) return Number.isNaN(v) ? 'nan' : v > 0 ? 'inf' : '-inf';
    return t === 'float' ? v.toFixed(2) : String(Math.trunc(v));
  };

  function run(model, hooks) {
    hooks = hooks || {};
    const A = analyse(model || {});
    const fb = () => (G && G.fb ? G.fb(128, 64) : { px: new Uint8Array(128 * 64), version: 0, clear() { this.px.fill(0); }, text() {}, rect() {}, fillRect() {}, line() {}, circle() {} });
    const R = {
      A, now: 0, slice: 0, steps: 0, stack: [], busy: new Set(), stopped: false, error: '', current: null, frame: null,
      vars: {}, state: null, enterPending: false, entering: false,
      input: { A: false, B: false, pot: 2048 },
      pins: {}, px: [], shownPx: [], servo: null, tone: null,
      dispOn: false, fb: fb(), shown: fb(), serial: [], printed: 0, serialOn: false, hints: [], POLL,
      random: typeof hooks.random === 'function' ? hooks.random : Math.random
    };
    for (let i = 0; i < PIXELS; i++) { R.px.push([0, 0, 0]); R.shownPx.push([0, 0, 0]); }
    for (const [n, t] of A.vars) R.vars[n] = t === 'text' ? '' : 0;
    R.pin = n => R.pins[n] || (R.pins[n] = { mode: null, out: 0, duty: 0 });
    R.hint = msg => { if (!R.hints.includes(msg) && R.hints.length < 8) R.hints.push(msg); };
    // the parts the generated setup() prepares by itself
    for (const k of A.btns) R.pin(BUTTON_PIN[k]).mode = 'pullup';
    for (const n of A.pins.pwm) R.pin(n).mode = 'pwm';

    /* ---- the board */
    R.read = n => {
      const p = R.pin(n);
      if (p.mode === 'out') return p.out;
      if (n === 0) return R.input.A ? 0 : 1;                       // the BOOT button has its own pull-up resistor on the board
      if (n === 4) {
        if (R.input.B) return 0;
        if (p.mode === 'pullup') return 1;
        R.hint('GPIO4 has no pull-up: set it as [input with pull-up], or the open pin floats and reads at random.');
        return (Math.floor(R.now / 23) * 2654435761 >>> 0) % 3 === 0 ? 1 : 0;
      }
      if (n === 34) return R.input.pot >= 2048 ? 1 : 0;
      return p.mode === 'pullup' ? 1 : 0;
    };
    R.analog = n => n === 34 ? clamp(Math.round(R.input.pot), 0, 4095) : n === 0 ? (R.input.A ? 0 : 4095) : n === 4 ? (R.input.B || R.pin(4).mode !== 'pullup' ? 0 : 4095) : 0;
    R.write = (n, v) => {
      const p = R.pin(n);
      if (p.mode !== 'out') { R.hint('GPIO' + n + ' is not an output yet: put "set pin (' + n + ') as [output]" before switching it.'); return; }
      p.out = v ? 1 : 0;
    };
    R.led = () => { const p = R.pins[2]; return !p ? 0 : p.mode === 'pwm' ? p.duty / 255 : p.mode === 'out' ? p.out : 0; };
    R.buzzing = () => !!(R.tone && R.tone.pin === 25 && R.tone.hz > 0);
    R.print = s => {
      if (!R.serialOn) R.hint('"print" before "start serial": on a real board nothing appears until the serial port is started.');
      R.serial.push(s); R.printed++;
      if (R.serial.length > 300) R.serial.splice(0, R.serial.length - 300);
      if (hooks.print) hooks.print(s);
    };

    /* ---- values */
    R.val = e => e == null ? false : typeof e === 'number' || typeof e === 'string' ? e : (BLOCKS[e.type] && BLOCKS[e.type].run ? BLOCKS[e.type].run(e, R) : 0);
    R.bool = e => !!R.val(e);
    R.text = e => fmtVal(R.val(e), exprType(e, A));
    R.ms = e => { const s = toNum(R.val(e)); return Number.isFinite(s) ? Math.max(0, Math.round(s * 1000)) : 0; };
    R.setVar = (name, v, src) => {
      if (!name) return;
      const t = A.vars.get(name) || 'int';
      R.vars[name] = t === 'text' ? (typeof v === 'string' ? v : fmtVal(v, exprType(src, A))) : t === 'float' ? toNum(v) : trunc(v);
    };

    /* ---- running blocks */
    R.body = function* (list) { for (const b of list || []) yield* R.exec(b); };
    R.exec = function* (b) {
      const d = isBlock(b) && BLOCKS[b.type];
      if (!d || !d.run) return;
      if (R.frame) R.frame.cur = b.id;
      R.steps++;
      if (++R.slice > SLICE) yield BUDGET;
      const r = d.run(b, R);
      if (r && typeof r.next === 'function') yield* r;
    };
    R.tick = function* () { if (++R.slice > SLICE) yield BUDGET; };
    R.wait = function* (ms) { yield { t: 'wait', until: R.now + Math.max(0, ms) }; };

    /* ---- the events, checked as checkEvents() checks them */
    const push = (key, gen, onDone) => { R.stack.push({ gen, wake: R.now, kind: null, key, onDone, cur: null }); if (key !== 'main') R.busy.add(key); };
    const scripts = function* (list) { for (const s of list) yield* R.body(s.body); };
    const buttons = A.btns.map(k => ({ pin: BUTTON_PIN[k], last: 1, changed: 0, key: 'button ' + k, list: A.buttons[k] }));
    const timers = A.timers.map(t => ({ ms: t.ms, last: 0, key: 'timer ' + t.n, list: [t.script] }));
    function checkEvents() {
      for (const b of buttons) {
        const lv = R.read(b.pin);
        if (lv !== b.last && R.now - b.changed > 30) {
          b.changed = R.now; b.last = lv;
          if (lv === 0 && !R.busy.has(b.key)) { push(b.key, scripts(b.list)); return true; }
        }
      }
      for (const t of timers) if (R.now - t.last >= t.ms) { t.last += t.ms; if (!R.busy.has(t.key)) { push(t.key, scripts(t.list)); return true; } }
      while (R.enterPending && !R.entering) {
        R.enterPending = false;
        const list = A.entries[R.state];
        if (list && list.length) { R.entering = true; push('enter', scripts(list), () => { R.entering = false; }); return true; }
      }
      return false;
    }
    // when something can happen next while the top script waits: a timer falls due, a button's bounce time ends
    const nextDue = () => {
      let t = Infinity;
      for (const x of timers) t = Math.min(t, x.last + x.ms);
      for (const b of buttons) if (R.read(b.pin) !== b.last) t = Math.min(t, b.changed + 31);
      return t;
    };
    push('main', (function* () {
      yield* R.body(A.pre);
      if (A.loop) for (;;) { yield* R.body(A.loop); yield POLL; yield* R.tick(); }
      for (;;) yield IDLE;
    })());

    R.step = function (ms) {
      if (R.stopped) return R;
      const target = R.now + Math.max(0, +ms || 0);
      for (let guard = 0; guard < 2e6; guard++) {
        const top = R.stack[R.stack.length - 1];
        if (!top) { R.now = target; break; }
        if (top.wake > R.now) {
          if (top.kind !== 'budget' && checkEvents()) continue;
          let next = top.kind === 'budget' ? top.wake : Math.min(top.wake, nextDue());
          if (!(next > R.now)) next = R.now + 1;
          if (next > target) { R.now = target; break; }
          R.now = next; R.slice = 0;
          continue;
        }
        top.kind = null;
        R.frame = top;
        let r;
        try { r = top.gen.next(); } catch (e) { R.error = String((e && e.message) || e); R.stopped = true; R.frame = null; break; }
        R.frame = null;
        if (r.done) { R.stack.pop(); R.busy.delete(top.key); if (top.onDone) top.onDone(); continue; }
        const y = r.value || POLL;
        if (y.t === 'wait') { top.wake = y.until; top.kind = 'wait'; }
        else if (y.t === 'budget') { top.wake = R.now + 1; top.kind = 'budget'; }
        else if (y.t === 'idle') { top.wake = Infinity; top.kind = 'wait'; }
        else { top.wake = R.now; checkEvents(); }               // the end of a pass of loop(): the events run, then it goes on
      }
      const top = R.stack[R.stack.length - 1];
      R.current = top ? top.cur : null;
      return R;
    };
    R.stop = function () { R.stopped = true; R.tone = null; return R; };
    return R;
  }

  /* ================================================================ eight examples */
  const k = (type, args, body, els) => { const b = { type, args: args || [] }; if (body) b.body = body; if (els) b.else = els; return b; };
  const hat = (type, args, body) => ({ hat: k(type, args), body: body || [] });
  const vr = name => k('var', [name]);
  const ar = (a, o, b) => k('arith', [a, o, b]);
  const lamps = (a, b, c) => [k('pixel', [0].concat(a)), k('pixel', [1].concat(b)), k('pixel', [2].concat(c)), k('pixelsShow')];
  const OFF = [0, 0, 0];
  const wheel = (part, base) => {
    const t = base ? ar(ar(vr('h'), '-', base), '*', 3) : ar(vr('h'), '*', 3), inv = ar(255, '-', t);
    return k('pixel', [vr('n')].concat(part === 0 ? [inv, t, 0] : part === 1 ? [0, inv, t] : [t, 0, inv]));
  };
  const EXAMPLES = [
    { id: 'blink', title: 'Blink', teaches: ['The first program of any board: a pin set as an output, switched on and off with a wait between.', '"forever" becomes loop() in C++ and while True in MicroPython; "wait" becomes delay() and time.sleep().'],
      model: { title: 'Blink', scripts: [hat('start', [], [k('pinMode', [2, 'output']), k('forever', [], [k('digitalWrite', [2, 'HIGH']), k('wait', [1]), k('digitalWrite', [2, 'LOW']), k('wait', [1])])])] } },
    { id: 'button', title: 'Button lights the LED', teaches: ['An event script: press button A (the BOOT button, GPIO0) and the LED changes over, press again and it goes out.', 'The C++ and MicroPython versions look at the button at the end of every loop and react to the press, the edge, not to holding it down.'],
      model: { title: 'Button lights the LED', scripts: [hat('start', [], [k('pinMode', [2, 'output'])]), hat('button', ['A'], [k('toggle', [2])])] } },
    { id: 'fade', title: 'Fade with PWM', teaches: ['PWM switches the pin thousands of times a second; the share of the time it is on, 0 to 255 here, sets how bright the LED looks.', 'Two counted loops and a variable ramp it up and down; the LEDC hardware does the fast switching.'],
      model: { title: 'Fade with PWM', vars: ['level'], scripts: [hat('start', [], [k('forever', [], [k('setVar', ['level', 0]),
        k('repeat', [51], [k('pwm', [2, vr('level')]), k('changeVar', ['level', 5]), k('wait', [0.02])]),
        k('repeat', [51], [k('changeVar', ['level', -5]), k('pwm', [2, vr('level')]), k('wait', [0.02])])])])] } },
    { id: 'potbar', title: 'Potentiometer bar on the display', teaches: ['The potentiometer on GPIO34 reads 0 to 4095; map() turns that into the 0 to 128 dots of a bar.', 'The display is drawn in memory and appears all at once on "update display", so nothing flickers.'],
      model: { title: 'Potentiometer bar', vars: ['pot'], scripts: [hat('start', [], [k('dispStart', ['SSD1306 128×64']), k('forever', [], [k('setVar', ['pot', k('analogRead', [34])]), k('dispClear'),
        k('dispText', ['Potentiometer', 0, 0]), k('dispText', [vr('pot'), 0, 16]), k('dispRect', [0, 40, 128, 12]), k('dispFill', [0, 40, k('map', [vr('pot'), 0, 4095, 0, 128]), 12]), k('dispUpdate'), k('wait', [0.1])])])] } },
    { id: 'traffic', title: 'Traffic light as a state machine', teaches: ['Each state has its own script, "when entering state", which lights its lamps (pixels 0, 1 and 2), waits and names the next state.', 'In C++ the states are an enum and goToState() leaves the change to checkEvents(), so one state\'s script ends before the next one starts.'],
      model: { title: 'Traffic light', states: ['RED', 'GREEN', 'YELLOW'], scripts: [hat('start', [], [k('serialBegin', [115200]), k('goState', ['RED'])]),
        hat('stateEnter', ['RED'], [k('print', ['RED: stop'])].concat(lamps([255, 0, 0], OFF, OFF), [k('wait', [3]), k('goState', ['GREEN'])])),
        hat('stateEnter', ['GREEN'], [k('print', ['GREEN: go'])].concat(lamps(OFF, OFF, [0, 255, 0]), [k('wait', [3]), k('goState', ['YELLOW'])])),
        hat('stateEnter', ['YELLOW'], [k('print', ['YELLOW: stop if you can'])].concat(lamps(OFF, [255, 160, 0], OFF), [k('wait', [1]), k('goState', ['RED'])]))] } },
    { id: 'reaction', title: 'Reaction game', teaches: ['After a random wait the LED lights and the time is noted; the program waits until button A reads LOW and prints how long that took.', '"milliseconds since start" is millis() in C++ and time.ticks_ms() in MicroPython, where the difference of two times is taken with ticks_diff().'],
      model: { title: 'Reaction game', vars: ['start'], scripts: [hat('start', [], [k('serialBegin', [115200]), k('pinMode', [2, 'output']), k('pinMode', [0, 'input with pull-up']),
        k('print', ['Press button A as soon as the LED lights']),
        k('forever', [], [k('digitalWrite', [2, 'LOW']), k('wait', [k('random', [2, 5])]), k('digitalWrite', [2, 'HIGH']), k('setVar', ['start', k('millis')]),
          k('waitUntil', [k('compare', [k('digitalRead', [0]), '=', k('level', ['LOW'])])]),
          k('print', [k('join', ['Reaction time in ms: ', ar(k('millis'), '-', vr('start'))])]), k('wait', [2])])])] } },
    { id: 'servo', title: 'Servo sweep', teaches: ['A hobby servo turns to the angle it is given, 0 to 180 degrees; the library makes the 50 pulses a second it needs.', 'The angle steps by 10 degrees with a short wait between, out and back again.'],
      model: { title: 'Servo sweep', vars: ['angle'], scripts: [hat('start', [], [k('forever', [], [k('setVar', ['angle', 0]),
        k('repeat', [18], [k('changeVar', ['angle', 10]), k('servo', [18, vr('angle')]), k('wait', [0.05])]),
        k('repeat', [18], [k('changeVar', ['angle', -10]), k('servo', [18, vr('angle')]), k('wait', [0.05])])])])] } },
    { id: 'rainbow', title: 'Rainbow on the pixels', teaches: ['Eight addressable LEDs each take a colour as red, green and blue from 0 to 255; nothing changes until "show pixels" sends them.', 'The colour wheel is the classic three-part formula; "mod", the remainder, makes the colours go round and round.'],
      model: { title: 'Rainbow', vars: ['n', 'h', 'shift'], scripts: [hat('start', [], [k('setVar', ['shift', 0]), k('forever', [], [k('setVar', ['n', 0]),
        k('repeat', [8], [k('setVar', ['h', ar(ar(ar(vr('n'), '*', 32), '+', vr('shift')), 'mod', 256)]),
          k('ifElse', [k('compare', [vr('h'), '<', 85])], [wheel(0)], [k('ifElse', [k('compare', [vr('h'), '<', 170])], [wheel(1, 85)], [wheel(2, 170)])]),
          k('changeVar', ['n', 1])]),
        k('pixelsShow'), k('changeVar', ['shift', 4]), k('wait', [0.05])])])] } }
  ];

  /* a new block with its default arguments (preset ones win); a variable slot gets `varName` */
  const clone = v => (v == null || typeof v !== 'object' ? v : JSON.parse(JSON.stringify(v)));
  function make(type, preset, varName, stateName) {
    const d = BLOCKS[type];
    if (!d) return null;
    const b = { type, args: d.slots.map((s, i) => preset && preset[i] !== undefined ? clone(preset[i]) : s.t === 'bool' ? null : s.t === 'var' ? (varName || '') : s.t === 'state' ? (stateName || s.def) : s.def !== undefined ? s.def : s.opts ? s.opts[0][0] : 0) };
    if (d.shape === 'c' || d.shape === 'ifelse') b.body = [];
    if (d.shape === 'ifelse') b.else = [];
    return b;
  }

  H.espBlocks = { BLOCKS, PALETTE, EXAMPLES, gen, run, entry, analyse, exprType, make, clone, valueNote, fillNote, cleanName, cleanState, reservedName, ident, PART, BUTTON_PIN, PIXELS, fmtVal, isBlock, eachBlock };

  /* ================================================================================================ the lab (DOM) */
  const T = H.espTools = H.espTools || {};
  const LS_KEY = 'hyper:esp32:blocklab';
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const CATNAME = id => { const c = C && C.blocks.CATEGORIES.find(x => x[0] === id); return c ? c[1] : id; };
  const hue = cat => (C ? C.blocks.hue(cat) : 200);
  const isC = d => d && (d.shape === 'c' || d.shape === 'ifelse');
  const isVal = d => d && (d.shape === 'reporter' || d.shape === 'boolean');

  // kept while the app is open: the program, the selection, undo, the inputs of the virtual board
  const st = { model: null, sel: null, foot: false, undo: [], redo: [], target: null, speed: 1, input: { A: false, B: false, pot: 2048 }, nextId: 1 };

  /* ---------------------------------------------------------------- the program: ids, loading, saving, undo */
  const giveIds = b => { if (!isBlock(b)) return b; b.id = st.nextId++; (b.args || []).forEach(giveIds); (b.body || []).forEach(giveIds); (b.else || []).forEach(giveIds); return b; };
  const withIds = model => { for (const s of model.scripts) { giveIds(s.hat); s.body.forEach(giveIds); } return model; };
  /* a program read from storage, made safe: known blocks only, arguments of the right number, bodies where needed */
  function tidy(raw) {
    const fixV = (v, s) => {
      if (isBlock(v) && BLOCKS[v.type] && isVal(BLOCKS[v.type])) return fixB(v);
      if (s.t === 'bool') return null;
      if (s.t === 'text') return typeof v === 'string' ? v.slice(0, 60) : v == null ? String(s.def || '') : String(v);
      if (s.t === 'num' || s.t === 'pin' || s.t === 'const') return Number.isFinite(+v) ? +v : (s.def || 0);
      return typeof v === 'string' ? v.slice(0, 30) : (s.def || '');
    };
    const fixB = b => {
      const d = BLOCKS[b.type], o = { type: b.type, args: d.slots.map((s, i) => fixV((b.args || [])[i], s)) };
      if (isC(d)) o.body = fixL(b.body);
      if (d.shape === 'ifelse') o.else = fixL(b.else);
      return o;
    };
    const fixL = list => (Array.isArray(list) ? list : []).filter(b => isBlock(b) && BLOCKS[b.type] && !isVal(BLOCKS[b.type]) && BLOCKS[b.type].shape !== 'hat').map(fixB);
    const m = { title: titleOf(raw), vars: [], states: [], scripts: [] };
    for (const v of (raw && raw.vars) || []) { const n = cleanName(v); if (n && !m.vars.includes(n)) m.vars.push(n); }
    for (const v of (raw && raw.states) || []) { const n = cleanState(v); if (n && !m.states.includes(n)) m.states.push(n); }
    for (const s of (raw && raw.scripts) || []) if (s && isBlock(s.hat) && BLOCKS[s.hat.type] && BLOCKS[s.hat.type].shape === 'hat') m.scripts.push({ hat: fixB(s.hat), body: fixL(s.body) });
    return m;
  }
  const loadModel = () => {
    try {
      const s = root.localStorage && root.localStorage.getItem(LS_KEY);
      if (s) { const raw = JSON.parse(s), m = tidy(raw); if (m.scripts.length || !(raw.scripts || []).length) return withIds(m); }
    } catch (e) { /* no storage, or a broken entry */ }
    return withIds(tidy(clone(EXAMPLES[0].model)));
  };
  const strip = m => JSON.parse(JSON.stringify(m, (k, v) => (k === 'id' ? undefined : v)));
  const saveModel = () => { try { if (root.localStorage) root.localStorage.setItem(LS_KEY, JSON.stringify(strip(st.model))); } catch (e) { /* storage full or blocked */ } };
  const snap = () => { st.undo.push(JSON.stringify(strip(st.model))); if (st.undo.length > 60) st.undo.shift(); st.redo.length = 0; };
  const varsOf = () => [...analyse(st.model).vars.keys()];
  const statesOf = () => analyse(st.model).states;
  const firstVar = () => { const v = varsOf(); if (v.length) return v[0]; st.model.vars.push('count'); return 'count'; };
  const firstState = () => { const s = statesOf(); if (s.length) return s[0]; st.model.states.push('IDLE'); return 'IDLE'; };
  const fresh = (type, preset) => { const d = BLOCKS[type]; return giveIds(make(type, preset, d.slots.some(x => x.t === 'var') ? firstVar() : '', d.slots.some(x => x.t === 'state') ? firstState() : '')); };

  /* ---------------------------------------------------------------- finding blocks */
  // a statement block: { list, i, block, parent, arm, script }; a hat: { hat: true, script, i }
  function locate(id) {
    if (id == null) return null;
    const find = (list, parent, arm, script) => {
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (b.id === id) return { list, i, block: b, parent, arm, script };
        for (const a of ['body', 'else']) if (b[a]) { const r = find(b[a], b, a, script); if (r) return r; }
      }
      return null;
    };
    for (let i = 0; i < st.model.scripts.length; i++) {
      const s = st.model.scripts[i];
      if (s.hat.id === id) return { hat: true, script: s, i, block: s.hat };
      const r = find(s.body, null, null, s);
      if (r) return r;
    }
    return null;
  }
  // any block by id, values included
  function findAny(id) {
    let hit = null;
    const v = x => { if (hit || !isBlock(x)) return; if (x.id === id) { hit = x; return; } (x.args || []).forEach(v); (x.body || []).forEach(v); (x.else || []).forEach(v); };
    for (const s of st.model.scripts) { v(s.hat); (s.body || []).forEach(v); if (hit) break; }
    return hit;
  }
  const labelOf = b => { const d = b && BLOCKS[b.type]; return d ? fillNote(d, b).replace(/\s+v\]/g, ']') : ''; };

  /* ---------------------------------------------------------------- drawing blocks as HTML (the classes of the block notation) */
  const opLabel = (s, v) => { const o = (s.opts || []).find(x => x[0] === v); return o ? o[1] : String(v); };
  const width = (s, min) => 'width:calc(' + Math.max(min || 2, String(s).length) + 'ch + 16px)';
  function slotHtml(b, i, s, v, edit) {
    const at = ' data-bid="' + b.id + '" data-slot="' + i + '"';
    if (!edit) {
      if (s.t === 'op') return esc(opLabel(s, v));
      if (s.t === 'menu' || s.t === 'var' || s.t === 'state') return '<span class="sb-m">' + esc(s.t === 'menu' ? opLabel(s, v) : v || '…') + '</span>';
      if (s.t === 'bool') return isBlock(v) ? valHtml(v, false) : '<span class="sb-h bl-hole"></span>';
      if (isBlock(v)) return valHtml(v, false);
      if (s.t === 'text') return '<span class="sb-i">' + esc(v) + '</span>';
      return '<span class="sb-n">' + esc(numLit(toNum(v))) + '</span>';
    }
    const pick = '<button type="button" class="bl-pick-b"' + at + ' title="Put a value block in this slot" aria-label="Choose a value">▾</button>';
    if (s.t === 'menu' || s.t === 'op') return '<select class="slot"' + at + '>' + s.opts.map(([val, lab]) => '<option value="' + esc(val) + '"' + (val === v ? ' selected' : '') + '>' + esc(lab) + '</option>').join('') + '</select>';
    if (s.t === 'var' || s.t === 'state') {
      const list = s.t === 'var' ? varsOf() : statesOf();
      if (v && !list.includes(v)) list.unshift(v);
      return '<select class="slot"' + at + '>' + list.map(x => '<option' + (x === v ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select>';
    }
    if (s.t === 'bool') return (isBlock(v) ? valHtml(v, true) : '<span class="sb-h bl-hole"' + at + ' role="button" tabindex="0" title="Click to choose a condition"></span>') + (isBlock(v) ? pick : '');
    if (isBlock(v)) return valHtml(v, true) + pick;
    if (s.t === 'text') return '<input class="slot txt"' + at + ' value="' + esc(v) + '" style="' + width(v, 4) + '" spellcheck="false" maxlength="60" aria-label="text">' + pick;
    return '<input class="slot"' + at + ' value="' + esc(numLit(toNum(v))) + '" style="' + width(numLit(toNum(v))) + '" inputmode="decimal" aria-label="number">' + (s.t === 'num' ? pick : '');
  }
  function partsHtml(d, b, edit) {
    return d.tpl.split(/(%\d)/).map(piece => {
      const m = /^%(\d)$/.exec(piece);
      if (!m) return piece.trim() ? '<span>' + esc(piece.trim()) + '</span>' : '';
      const i = +m[1] - 1;
      return slotHtml(b, i, d.slots[i], (b.args || [])[i], edit);
    }).join('');
  }
  function valHtml(v, edit) {
    const d = BLOCKS[v.type];
    if (!d) return '';
    const id = edit ? ' data-vid="' + v.id + '"' : '';
    if (v.type === 'var') return '<span class="sb-r bl-val"' + id + ' style="--sh:' + hue('variables') + '">' + esc(v.args[0]) + '</span>';
    if (d.bare) return edit ? '<select class="slot bl-lvl" data-bid="' + v.id + '" data-slot="0">' + LEVELS.map(([x]) => '<option' + (x === v.args[0] ? ' selected' : '') + '>' + x + '</option>').join('') + '</select>' : '<span class="sb-m">' + esc(v.args[0]) + '</span>';
    return '<span class="' + (d.shape === 'boolean' ? 'sb-h' : 'sb-r') + ' bl-val"' + id + ' style="--sh:' + hue(d.cat) + '">' + partsHtml(d, v, edit) + '</span>';
  }
  function stmtHtml(b) {
    const d = BLOCKS[b.type];
    if (!d) return '';
    const sh = ' style="--sh:' + hue(d.cat) + '"';
    if (isC(d)) {
      const arm = list => '<div class="sb-body">' + (list.length ? list.map(stmtHtml).join('') : '<div class="sb-empty"></div>') + '</div>';
      return '<div class="sb-c bl-item" data-id="' + b.id + '"' + sh + '><div class="sb-line"><div class="sb-b sb-ch">' + partsHtml(d, b, true) + '</div></div>' + arm(b.body) +
        (d.shape === 'ifelse' ? '<div class="sb-line"><div class="sb-b sb-ch sb-else"><span>else</span></div></div>' + arm(b.else) : '') +
        '<div class="sb-b sb-foot" data-foot="' + b.id + '" title="Click here to put new blocks after this one"></div></div>';
    }
    return '<div class="sb-line bl-item" data-id="' + b.id + '"><div class="sb-b"' + sh + '>' + partsHtml(d, b, true) + '</div></div>';
  }
  function scriptHtml(s) {
    const d = BLOCKS[s.hat.type], fi = s.hat.type === 'start' ? s.body.findIndex(b => b.type === 'forever') : -1;
    const live = fi >= 0 ? s.body.slice(0, fi + 1) : s.body, dead = fi >= 0 ? s.body.slice(fi + 1) : [];
    return '<div class="sb-script bl-script"><div class="sb-line bl-item" data-id="' + s.hat.id + '"><div class="sb-b sb-hat" style="--sh:' + hue(d.cat) + '">' + partsHtml(d, s.hat, true) + '</div></div>' +
      live.map(stmtHtml).join('') + (dead.length ? '<div class="bl-dead"><div class="bl-note">These blocks come after “forever”, so they never run: move them up, or into it.</div>' + dead.map(stmtHtml).join('') + '</div>' : '') +
      (s.body.length ? '' : '<div class="bl-note">Click blocks on the left to fill this script.</div>') + '</div>';
  }
  // a block of the palette or the value picker: drawn like the others, but nothing to edit
  function paletteHtml(b) {
    const d = BLOCKS[b.type];
    if (isVal(d)) return valHtml(b, false);
    const sh = ' style="--sh:' + hue(d.cat) + '"';
    if (isC(d)) return '<div class="sb-c"' + sh + '><div class="sb-line"><div class="sb-b sb-ch">' + partsHtml(d, b, false) + '</div></div><div class="sb-body"><div class="sb-empty"></div></div>' +
      (d.shape === 'ifelse' ? '<div class="sb-line"><div class="sb-b sb-ch sb-else"><span>else</span></div></div><div class="sb-body"><div class="sb-empty"></div></div>' : '') + '<div class="sb-b sb-foot"></div></div>';
    return '<div class="sb-b' + (d.shape === 'hat' ? ' sb-hat' : '') + '"' + sh + '>' + partsHtml(d, b, false) + '</div>';
  }

  const toast = msg => { if (H.ui && H.ui.toast) H.ui.toast(msg); };
  function loadExample(id) {
    const ex = EXAMPLES.find(e => e.id === id);
    if (!ex) return;
    if (!st.model) st.model = loadModel();
    snap();
    st.model = withIds(tidy(clone(ex.model)));
    st.sel = null; st.foot = false;
    saveModel();
    toast('“' + ex.title + '” is in the editor. Undo brings your own program back.');
  }
  const partsUsed = model => {
    const A = analyse(model), P = A.pins, out = [];
    if (P.dig.has(2) || P.pwm.has(2)) out.push('LED');
    if (A.buttons.A.length || P.dig.has(0)) out.push('button A');
    if (A.buttons.B.length || P.dig.has(4)) out.push('button B');
    if (P.adc.has(34)) out.push('potentiometer');
    if (A.display) out.push('display');
    if (A.pixels) out.push('pixels');
    if (P.servo.size) out.push('servo');
    if (P.tone.size) out.push('buzzer');
    if (A.uses.print) out.push('serial monitor');
    return out;
  };

  /* ---------------------------------------------------------------- the virtual board on a canvas: -> where the parts are, for the mouse */
  const fmtT = s => (s < 60 ? s.toFixed(1) + ' s' : Math.floor(s / 60) + ' min ' + (s % 60).toFixed(0).padStart(2, '0') + ' s');
  let blankFb = null;
  function drawBoard(ctx, W, Hh, R, input) {
    const S = H.esym, c = H.ui.colors(), lay = {};
    if (!blankFb && G && G.fb) blankFb = G.fb(128, 64);
    const t = R ? R.now / 1000 : 0;
    S.text(ctx, 'ESP32 DevKit · virtual board', 12, 15, { align: 'left', size: 12.5, weight: 650, color: c.text });
    S.text(ctx, !R ? 'not running' : R.error ? 'stopped by an error' : (R.stopped ? 'stopped at ' : '') + fmtT(t), W - 12, 15, { align: 'right', size: 11.5, mono: true, color: R && !R.stopped ? c.ok : c.muted });
    // the OLED, dot for dot
    const sc = W >= 300 ? 2 : Math.max(1, (W - 30) / 128), ow = 128 * sc, oh = 64 * sc, ox = Math.round((W - ow) / 2), oy = 38;
    if (G && G.draw) G.draw(ctx, R && R.dispOn ? R.shown : blankFb, ox, oy, sc, { style: 'oled' });
    if (!R || !R.dispOn) S.text(ctx, R ? 'the display is not started' : 'OLED 128 × 64', W / 2, oy + oh / 2, { color: 'rgba(127,216,255,.45)', size: 11.5 });
    S.text(ctx, 'SSD1306 OLED · I2C on GPIO21 (SDA) and GPIO22 (SCL)', W / 2, oy + oh + 15, { size: 10.5 });
    // LED, the two buttons, the buzzer
    const y1 = oy + oh + 56, cx = i => W / 4 * (i + 0.5);
    const lab = (x, y, name, pin, on) => { S.text(ctx, name, x, y, { size: 11.5, color: on ? c.accent : c.text2, weight: on ? 650 : 500 }); S.text(ctx, pin, x, y + 13, { size: 10, color: c.muted, mono: true }); };
    S.led(ctx, cx(0), y1, { color: 212, on: R ? R.led() : 0, r: 10 });
    lab(cx(0), y1 + 25, 'LED', 'GPIO2', false);
    lay.A = S.button(ctx, cx(1), y1, { pressed: input.A, size: 32 });
    lay.B = S.button(ctx, cx(2), y1, { pressed: input.B, size: 32 });
    lab(cx(1), y1 + 25, 'button A', 'GPIO0', input.A);
    lab(cx(2), y1 + 25, 'button B', 'GPIO4', input.B);
    const buzz = !!(R && R.buzzing());
    S.buzzer(ctx, cx(3), y1, buzz, { phase: t * 4 });
    lab(cx(3), y1 + 25, buzz ? Math.round(R.tone.hz) + ' Hz' : 'buzzer', 'GPIO25', buzz);
    // the servo and the potentiometer
    const y2 = y1 + 84, ang = R && R.servo != null ? R.servo : 90;
    S.servo(ctx, W * 0.29, y2, ang, { size: 52 });
    lab(W * 0.29, y2 + 34, 'servo' + (R && R.servo != null ? ' · ' + Math.round(ang) + '°' : ''), 'GPIO18', false);
    lay.pot = { x: W * 0.72, y: y2, r: 30 };
    S.pot(ctx, lay.pot.x, y2, 19, clamp(input.pot / 4095, 0, 1));
    lab(lay.pot.x, y2 + 34, 'potentiometer · ' + Math.round(input.pot), 'GPIO34', false);
    // the pixels
    const y3 = y2 + 70, pr = Math.max(4, Math.min(11, (W - 40) / PIXELS / 2.7)), pw = PIXELS * pr * 2.7 - pr * 0.7;
    S.pixels(ctx, (W - pw) / 2, y3 - pr, R ? R.shownPx : Array.from({ length: PIXELS }, () => [0, 0, 0]), { r: pr });
    lab(W / 2, y3 + pr + 13, '8 pixels (WS2812)', 'GPIO5', false);
    return lay;
  }

  /* ---------------------------------------------------------------- the editor: #/tools/blocklab/build */
  const TOOLS = [['undo', '↶ Undo', 'Undo the last change (Ctrl+Z)'], ['redo', '↷ Redo', 'Redo (Ctrl+Y)'], null, ['up', '↑ Up', 'Move the selected block up'], ['down', '↓ Down', 'Move the selected block down'],
    ['in', '→ In', 'Put the block into the C-shaped block just above it'], ['out', '← Out', 'Take the block out of the C-shaped block around it'], ['dup', '⧉ Duplicate', 'Put a copy just after it'], ['del', '✕ Delete', 'Delete the selected block (Delete key)']];
  const SPEEDS = [['Real time', 1], ['Half speed', 0.5], ['Quarter speed: follow the blocks', 0.25], ['Twice as fast', 2]];

  function build(body) {
    const ui = H.ui, kit = H.kit, U = H.util;
    if (!st.model) st.model = loadModel();
    body.innerHTML = '<div class="bl">' +
      '<p class="muted bl-intro">Build a program from blocks: click a block on the left to add it, type its numbers, press <b>▶ Run</b> and watch the virtual ESP32. Underneath is the same program in Arduino C++ and in MicroPython, ready for a real board.</p>' +
      '<div class="bl-grid">' +
        '<div class="bl-pal"><div class="esppal" aria-label="Blocks"></div></div>' +
        '<div class="bl-mid">' +
          '<div class="bl-head"><input class="inp bl-title" maxlength="40" aria-label="The name of the program" title="The name of the program, used in the code"><select class="inp bl-load" aria-label="Load an example"><option value="">Load an example…</option>' +
            EXAMPLES.map(ex => '<option value="' + ex.id + '">' + esc(ex.title) + '</option>').join('') + '</select><button type="button" class="btn sm ghost" data-act="new">New program</button></div>' +
          '<div class="bl-tools">' + TOOLS.map(x => x ? '<button type="button" class="btn sm" data-act="' + x[0] + '" title="' + esc(x[2]) + '">' + x[1] + '</button>' : '<span class="bl-sep"></span>').join('') + '</div>' +
          '<div class="bl-selinfo small"></div>' +
          '<div class="bl-wsbox"><div class="espws bl-ws"></div><div class="bl-picker" hidden></div></div>' +
        '</div>' +
        '<div class="bl-board"><div class="bl-runbar"></div><div class="bl-stage"></div><div class="bl-bside"><div class="bl-ctl"></div><div class="bl-status small"></div>' +
          '<div class="bl-mon"><div class="bl-monh"><b>Serial monitor</b><span class="small muted">115200 baud</span><button type="button" class="btn sm ghost" data-act="clrmon">Clear</button></div><div class="espout bl-out" aria-live="polite"></div></div>' +
          '<div class="bl-vars"></div></div></div>' +
      '</div>' +
      '<div class="bl-code"></div>' +
      (T.util ? T.util.more(['block-programming-tools', 'first-program-blink', 'setup-loop-and-main', 'non-blocking-timing', 'debouncing', 'pwm-with-ledc', 'state-machine-in-code']) : '') +
      '</div>';
    const $ = s => ui.$(s, body);
    const pal = $('.esppal'), ws = $('.bl-ws'), wsbox = $('.bl-wsbox'), picker = $('.bl-picker'), selinfo = $('.bl-selinfo'), tools = $('.bl-tools'), titleIn = $('.bl-title'), loadSel = $('.bl-load');
    const stageEl = $('.bl-stage'), status = $('.bl-status'), out = $('.bl-out'), varsEl = $('.bl-vars'), codeEl = $('.bl-code');
    let R = null, running = false, lay = {}, printed = -1, lastRun = null, lastVars = null, lastStatus = null, pickList = [], A0 = analyse(st.model);

    /* ---- the palette */
    function renderPalette() {
      const v0 = varsOf()[0] || 'count', s0 = statesOf()[0] || 'IDLE';
      pal.innerHTML = PALETTE.map(([cat, items], gi) => '<div class="cat" style="color:hsl(' + hue(cat) + ' 55% 55%)">' + esc(CATNAME(cat)) + '</div>' +
        items.map(([t, preset], ii) => '<div class="bl-pi" role="button" tabindex="0" data-pal="' + gi + ':' + ii + '" title="' + esc(BLOCKS[t].help || 'Click to add') + '">' + paletteHtml(make(t, preset, v0, s0)) + '</div>').join('') +
        (cat === 'variables' ? '<div class="bl-mk"><input class="inp" data-mk="var" maxlength="20" placeholder="a new variable" aria-label="Name of a new variable"><button type="button" class="btn sm" data-mkgo="var">Make</button></div>' +
          '<div class="small muted bl-mkl">' + (varsOf().length ? 'Variables: ' + varsOf().map(esc).join(', ') : 'No variables yet.') + '</div>' : '') +
        (cat === 'state' ? '<div class="bl-mk"><input class="inp" data-mk="state" maxlength="16" placeholder="a new state" aria-label="Name of a new state"><button type="button" class="btn sm" data-mkgo="state">Make</button></div>' +
          '<div class="small muted bl-mkl">' + (statesOf().length ? 'States: ' + statesOf().map(esc).join(', ') : 'No states yet.') + '</div>' : '') +
        (cat === 'operators' ? '<div class="small muted bl-mkl">Values go into the slots of blocks: click a slot (or its ▾), then a value here.</div>' : '')).join('');
    }
    function makeName(kind) {
      const inp = pal.querySelector('[data-mk="' + kind + '"]');
      const raw = inp ? inp.value : '';
      const n = kind === 'var' ? cleanName(raw) : cleanState(raw);
      if (!n) { toast(kind === 'var' ? 'Type a name: letters, digits and _, starting with a letter.' : 'Type a name for the state, such as RUNNING.'); return; }
      if (kind === 'var' && reservedName(n)) { toast('“' + n + '” is a word that C++, MicroPython or the generated code uses: choose another name.'); return; }
      const list = kind === 'var' ? varsOf() : statesOf();
      if (list.includes(n)) { toast('There is already a ' + (kind === 'var' ? 'variable' : 'state') + ' called ' + n + '.'); return; }
      snap();
      (kind === 'var' ? st.model.vars : st.model.states).push(n);
      renderPalette(); renderWS(); changed(false);
      toast(kind === 'var' ? 'Variable “' + n + '” made: choose it in “set” and “change”, or put it in a slot with ▾.' : 'State “' + n + '” made: choose it in the state blocks.');
    }

    /* ---- the workspace */
    function renderWS() {
      closePicker();
      ws.innerHTML = st.model.scripts.length ? '<div class="sb bl-sb">' + st.model.scripts.map(scriptHtml).join('') + '</div>'
        : '<div class="bl-empty"><b>Click a block on the left to start.</b><br>A program begins with a hat block such as “when started”; the first block you add brings one along. Or load an example from the list above.</div>';
      markSel(); lastRun = null; markRun();
    }
    const mark = (id, cls) => { ui.$$('.' + cls, ws).forEach(e => e.classList.remove(cls)); if (id != null) { const e = ws.querySelector('[data-id="' + id + '"]'); if (e) e.classList.add(cls); } };
    function markSel() { ui.$$('.selfoot', ws).forEach(e => e.classList.remove('selfoot')); mark(st.foot ? null : st.sel, 'sel'); if (st.foot) mark(st.sel, 'selfoot'); }
    function markRun() { const id = R && running ? R.current : null; if (id !== lastRun) { lastRun = id; mark(id, 'bl-on'); } }
    function select(id, foot) { st.sel = id; st.foot = !!foot; markSel(); renderTools(); }
    function can() {
      const loc = locate(st.sel), c = { undo: st.undo.length > 0, redo: st.redo.length > 0, up: false, down: false, in: false, out: false, dup: false, del: false };
      if (!loc) return c;
      c.del = true;
      if (loc.hat) { c.up = loc.i > 0; c.down = loc.i < st.model.scripts.length - 1; c.dup = loc.block.type !== 'start'; return c; }
      c.dup = true; c.out = !!loc.parent;
      c.up = loc.i > 0 || !!loc.parent; c.down = loc.i < loc.list.length - 1 || !!loc.parent;
      c.in = loc.i > 0 && isC(BLOCKS[loc.list[loc.i - 1].type]);
      return c;
    }
    function renderTools() {
      const c = can();
      ui.$$('[data-act]', tools).forEach(b => { b.disabled = !c[b.dataset.act]; });
      const loc = locate(st.sel), name = loc ? '“' + (labelOf(loc.block).length > 44 ? labelOf(loc.block).slice(0, 42) + '…' : labelOf(loc.block)) + '”' : '';
      selinfo.innerHTML = !st.model.scripts.length ? 'Nothing here yet: click a block on the left.'
        : !loc ? 'Nothing selected: a new block goes at the end of the last script. Click a block to select it, or drag blocks where you want them.'
        : loc.hat ? 'Selected: ' + esc(name) + '. A new block goes at the top of this script.'
        : isC(BLOCKS[loc.block.type]) && !st.foot ? 'Selected: ' + esc(name) + '. A new block goes <b>inside</b> it; click its foot (the bar at the bottom) to add after it.'
        : st.foot ? 'Selected: the end of ' + esc(name) + '. A new block goes <b>after</b> it.'
        : 'Selected: ' + esc(name) + '. A new block goes after it.';
    }

    /* ---- changes */
    const renderCode = () => {
      if (!st.model.scripts.length) { codeEl.innerHTML = '<div class="boxy bl-codeempty muted">The program is empty: add blocks and the same program appears here as Arduino C++ and MicroPython.</div>'; return; }
      const e = entry(st.model);
      e.about = 'The blocks above, three ways. The C++ is a complete sketch for the Arduino IDE (board “ESP32 Dev Module”, core 3.3); the MicroPython program runs saved on the board as main.py.';
      T.util.code(codeEl, e);
    };
    const codeSoon = U.debounce(renderCode, 160);
    function changed(structure) {
      A0 = analyse(st.model);
      saveModel();
      if (structure) renderWS(); else markSel();
      renderTools();
      codeSoon();
      if (running) start(true);
    }
    function afterLoad() { A0 = analyse(st.model); titleIn.value = st.model.title || ''; renderPalette(); renderWS(); renderTools(); saveModel(); codeSoon(); if (running) start(true); }

    /* ---- editing: the toolbar */
    const act = {
      undo() { if (!st.undo.length) return; st.redo.push(JSON.stringify(strip(st.model))); st.model = withIds(tidy(JSON.parse(st.undo.pop()))); st.sel = null; afterLoad(); },
      redo() { if (!st.redo.length) return; st.undo.push(JSON.stringify(strip(st.model))); st.model = withIds(tidy(JSON.parse(st.redo.pop()))); st.sel = null; afterLoad(); },
      up() {
        const loc = locate(st.sel); if (!loc) return;
        snap();
        if (loc.hat) { const a = st.model.scripts; if (loc.i > 0) [a[loc.i - 1], a[loc.i]] = [a[loc.i], a[loc.i - 1]]; }
        else if (loc.i > 0) { const l = loc.list; [l[loc.i - 1], l[loc.i]] = [l[loc.i], l[loc.i - 1]]; }
        else if (loc.parent) { loc.list.splice(loc.i, 1); if (loc.arm === 'else') loc.parent.body.push(loc.block); else { const p = locate(loc.parent.id); p.list.splice(p.i, 0, loc.block); } }
        else { st.undo.pop(); return; }
        changed(true);
      },
      down() {
        const loc = locate(st.sel); if (!loc) return;
        snap();
        if (loc.hat) { const a = st.model.scripts; if (loc.i < a.length - 1) [a[loc.i + 1], a[loc.i]] = [a[loc.i], a[loc.i + 1]]; }
        else if (loc.i < loc.list.length - 1) { const l = loc.list; [l[loc.i + 1], l[loc.i]] = [l[loc.i], l[loc.i + 1]]; }
        else if (loc.parent) { loc.list.splice(loc.i, 1); if (loc.arm === 'body' && loc.parent.else) loc.parent.else.unshift(loc.block); else { const p = locate(loc.parent.id); p.list.splice(p.i + 1, 0, loc.block); } }
        else { st.undo.pop(); return; }
        changed(true);
      },
      in() {
        const loc = locate(st.sel); if (!loc || loc.hat || loc.i === 0) return;
        const prev = loc.list[loc.i - 1]; if (!isC(BLOCKS[prev.type])) return;
        snap(); loc.list.splice(loc.i, 1); (prev.else || prev.body).push(loc.block); changed(true);
      },
      out() {
        const loc = locate(st.sel); if (!loc || loc.hat || !loc.parent) return;
        snap(); loc.list.splice(loc.i, 1); const p = locate(loc.parent.id); p.list.splice(p.i + 1, 0, loc.block); st.foot = false; changed(true);
      },
      dup() {
        const loc = locate(st.sel); if (!loc) return;
        if (loc.hat) {
          if (loc.block.type === 'start') { toast('A program has one “when started” script.'); return; }
          snap(); const copy = { hat: giveIds(strip(loc.script.hat)), body: loc.script.body.map(b => giveIds(strip(b))) };
          st.model.scripts.splice(loc.i + 1, 0, copy); st.sel = copy.hat.id;
        } else { snap(); const copy = giveIds(strip(loc.block)); loc.list.splice(loc.i + 1, 0, copy); st.sel = copy.id; }
        st.foot = false; changed(true);
      },
      del() {
        const loc = locate(st.sel); if (!loc) return;
        snap();
        if (loc.hat) { st.model.scripts.splice(loc.i, 1); st.sel = null; toast('Script deleted. Undo brings it back.'); }
        else { loc.list.splice(loc.i, 1); const nb = loc.list[loc.i] || loc.list[loc.i - 1] || loc.parent || loc.script.hat; st.sel = nb ? nb.id : null; }
        st.foot = false; changed(true);
      },
      new() { snap(); st.model = { title: 'My program', vars: [], states: [], scripts: [] }; st.sel = null; afterLoad(); toast('A new, empty program. Undo brings the old one back.'); },
      clrmon() { if (R) R.serial.length = 0; out.textContent = ''; }
    };
    function addFromPalette(t, preset) {
      const d = BLOCKS[t];
      if (isVal(d)) {
        const tg = st.target && findAny(st.target.bid), s = tg && BLOCKS[tg.type].slots[st.target.slot];
        if (!s || !['num', 'text', 'bool'].includes(s.t)) { toast('A value goes into a slot of a block: click a number in a block first (or the ▾ beside it), then the value.'); return; }
        if ((s.t === 'bool') !== (d.shape === 'boolean')) { toast(s.t === 'bool' ? 'That slot wants a condition: a pointed block.' : 'A pointed block is a condition: it goes into a pointed slot, such as the one of “if”.'); return; }
        snap(); tg.args[st.target.slot] = fresh(t, preset); changed(true); return;
      }
      if (t === 'start' && st.model.scripts.some(s => s.hat.type === 'start')) { toast('The program already has its “when started” script. Other scripts start with an event: a button, a timer, a state.'); return; }
      snap();
      const b = fresh(t, preset);
      if (d.shape === 'hat') st.model.scripts.push({ hat: b, body: [] });
      else {
        const loc = locate(st.sel);
        if (loc && loc.hat) loc.script.body.unshift(b);
        else if (loc && isC(BLOCKS[loc.block.type]) && !st.foot) loc.block.body.push(b);
        else if (loc) loc.list.splice(loc.i + 1, 0, b);
        else if (st.model.scripts.length) {
          const list = st.model.scripts[st.model.scripts.length - 1].body, last = list[list.length - 1];
          (last && last.type === 'forever' ? last.body : list).push(b);
        }
        else st.model.scripts.push({ hat: giveIds(make('start')), body: [b] });
      }
      st.sel = b.id; st.foot = false;
      if (d.slots.some(s => s.t === 'var' || s.t === 'state')) renderPalette();
      changed(true);
      const e = ws.querySelector('[data-id="' + b.id + '"]');
      if (e && e.scrollIntoView) e.scrollIntoView({ block: 'nearest' });
    }

    /* ---- the value picker beside a slot */
    function choices(owner, s) {
      if (s.t === 'bool') return [['Compare', CMP.map(([o]) => make('compare', [0, o, 0])).concat([make('compare', [make('digitalRead', [0]), '=', make('level', ['LOW'])])])],
        ['Logic', [make('logic', [null, 'and', null]), make('logic', [null, 'or', null]), make('not')]], ['State machine', statesOf().map(x => make('stateIs', [x]))]].filter(g => g[1].length);
      return [['Variables', varsOf().map(v => make('var', [v]))], ['Pins', [make('digitalRead'), make('analogRead')].concat(owner.type === 'compare' ? [make('level', ['LOW']), make('level', ['HIGH'])] : [])],
        ['Time', [make('millis')]], ['Operators', ARITH.map(([o]) => make('arith', [1, o, 1])).concat([make('map'), make('random'), make('join'), make('round')])]].filter(g => g[1].length);
    }
    function openPicker(bid, slot, anchor) {
      const owner = findAny(bid), s = owner && BLOCKS[owner.type].slots[slot];
      if (!s) return;
      st.target = { bid, slot };
      pickList = [];
      const groups = choices(owner, s), cur = owner.args[slot];
      picker.innerHTML = '<div class="bl-pk-h"><b>' + (s.t === 'bool' ? 'Choose a condition' : 'Choose a value') + '</b><button type="button" class="bl-pk-x" data-pk="x" aria-label="Close">✕</button></div>' +
        groups.map(([g, items]) => '<div class="bl-pk-g">' + esc(g) + '</div>' + items.map(it => { pickList.push(it); return '<div class="bl-pk-i" role="button" tabindex="0" data-pk="' + (pickList.length - 1) + '">' + paletteHtml(it) + '</div>'; }).join('')).join('') +
        (isBlock(cur) ? '<button type="button" class="btn sm ghost bl-pk-clear" data-pk="clear">' + (s.t === 'bool' ? 'Empty the slot' : s.t === 'text' ? 'Back to typed text' : 'Back to a typed number') + '</button>' : '');
      const r = anchor.getBoundingClientRect(), box = wsbox.getBoundingClientRect();
      picker.style.left = Math.max(0, Math.min(r.left - box.left - 8, box.width - 290)) + 'px';
      picker.style.top = (r.bottom - box.top + 6) + 'px';
      picker.hidden = false;
    }
    function closePicker() { picker.hidden = true; picker.innerHTML = ''; }
    picker.addEventListener('click', e => {
      const p = e.target.closest('[data-pk]');
      if (!p || !st.target) return;
      const owner = findAny(st.target.bid), s = owner && BLOCKS[owner.type].slots[st.target.slot];
      if (p.dataset.pk === 'x' || !s) { closePicker(); return; }
      snap();
      owner.args[st.target.slot] = p.dataset.pk === 'clear' ? (s.t === 'bool' ? null : s.def !== undefined ? s.def : 0) : giveIds(clone(pickList[+p.dataset.pk]));
      closePicker(); changed(true);
    });

    /* ---- the workspace: clicks, typing, menus */
    ws.addEventListener('click', e => {
      if (st.justDragged) return;
      const t = e.target, item = t.closest('.bl-item');
      const pb = t.closest('.bl-pick-b, .bl-hole');
      if (pb) { e.stopPropagation(); if (item) select(+item.dataset.id); openPicker(+pb.dataset.bid, +pb.dataset.slot, pb); return; }
      if (t.closest('input, select')) { if (item && st.sel !== +item.dataset.id) select(+item.dataset.id); return; }
      const foot = t.closest('[data-foot]');
      if (foot) { select(+foot.dataset.foot, true); return; }
      select(item ? +item.dataset.id : null);
    });
    ws.addEventListener('keydown', e => { const h = e.target.closest('.bl-hole'); if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPicker(+h.dataset.bid, +h.dataset.slot, h); } });
    ws.addEventListener('focusin', e => { const t = e.target; if (t.matches && t.matches('input.slot')) st.target = { bid: +t.dataset.bid, slot: +t.dataset.slot }; });
    ws.addEventListener('input', e => { const t = e.target; if (t.matches && t.matches('input.slot')) t.style.width = 'calc(' + Math.max(t.classList.contains('txt') ? 4 : 2, t.value.length) + 'ch + 16px)'; });
    ws.addEventListener('change', e => {
      const t = e.target;
      if (!t.dataset || t.dataset.bid == null) return;
      const owner = findAny(+t.dataset.bid), slot = +t.dataset.slot, s = owner && BLOCKS[owner.type].slots[slot];
      if (!s) return;
      let v = t.value;
      if (t.tagName === 'SELECT') { if (s.t === 'state') v = cleanState(v); }
      else if (s.t === 'text') v = String(v).slice(0, 60);
      else {
        let n = parseFloat(String(v).replace(',', '.'));
        if (!Number.isFinite(n)) { t.value = numLit(toNum(owner.args[slot])); toast('Type a number here.'); return; }
        if (s.t === 'pin') {
          n = clamp(Math.round(n), 0, 48);
          const E = H.esp, pv = E && E.pinVerdict ? E.pinVerdict('esp32', n) : null;
          const outBlock = ['digitalWrite', 'toggle', 'pwm', 'servo', 'tone'].includes(owner.type) || (owner.type === 'pinMode' && owner.args[1] === 'output');
          if (pv && (pv.level === 'avoid' || pv.level === 'none')) toast('GPIO' + n + ': ' + (pv.text || 'there is no such pin on an ESP32 DevKit'));
          else if (outBlock && n >= 34 && n <= 39) toast('GPIO' + n + ' is an input only on the ESP32: it cannot drive anything.');
        }
        if (s.t === 'const') n = Math.max(s.min || 1, owner.type === 'serialBegin' ? Math.round(n) : n);
        t.value = numLit(n); v = n;
      }
      if (owner.args[slot] === v) return;
      snap(); owner.args[slot] = v; changed(false);
    });

    /* ---- the palette, the toolbar, the header */
    pal.addEventListener('click', e => {
      if (st.justDragged) return;
      const go = e.target.closest('[data-mkgo]');
      if (go) { makeName(go.dataset.mkgo); return; }
      const p = e.target.closest('[data-pal]');
      if (!p) return;
      const [gi, ii] = p.dataset.pal.split(':').map(Number), it = PALETTE[gi][1][ii];
      addFromPalette(it[0], it[1]);
    });
    pal.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const mk = e.target.closest('[data-mk]');
      if (mk) { if (e.key === 'Enter') makeName(mk.dataset.mk); return; }
      const p = e.target.closest('[data-pal]');
      if (p) { e.preventDefault(); p.click(); }
    });
    body.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b && act[b.dataset.act] && !b.disabled) act[b.dataset.act](); });
    titleIn.addEventListener('change', () => { const t = titleIn.value.replace(/[\r\n]+/g, ' ').trim().slice(0, 40) || 'My program'; if (t !== st.model.title) { snap(); st.model.title = t; titleIn.value = t; changed(false); } });
    loadSel.addEventListener('change', () => { if (loadSel.value) { loadExample(loadSel.value); loadSel.value = ''; afterLoad(); } });
    const outside = e => { if (!picker.hidden && !picker.contains(e.target) && !(e.target.closest && e.target.closest('.bl-pick-b, .bl-hole'))) closePicker(); };
    const typing = e => e.target && e.target.closest && e.target.closest('input, select, textarea, [contenteditable]');
    const keydown = e => {
      if (e.key === 'Escape') { closePicker(); return; }
      if (typing(e) || !body.isConnected) return;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === 'z' && !e.shiftKey) { e.preventDefault(); act.undo(); }
      else if ((e.ctrlKey || e.metaKey) && (k === 'y' || (k === 'z' && e.shiftKey))) { e.preventDefault(); act.redo(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && st.sel != null && !e.ctrlKey) { e.preventDefault(); act.del(); }
      else if ((k === 'a' || k === 'b') && !e.ctrlKey && !e.metaKey && !e.altKey && !e.repeat) press(k.toUpperCase(), true);
    };
    const keyup = e => { const k = (e.key || '').toLowerCase(); if ((k === 'a' || k === 'b') && st.input[k.toUpperCase()]) press(k.toUpperCase(), false); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    ui.onLeave(() => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup); st.input.A = st.input.B = false; });

    /* ---- the virtual board */
    const stage = kit.stage(stageEl, { height: 418, minH: 300, maxH: 460 });
    const loop = kit.loop(dt => { if (R && running) { R.step(dt * 1000 * st.speed); if (R.stopped) { running = false; loop.stop(); buttons(); } } paint(); side(); }, stageEl);
    const runCtl = kit.controls($('.bl-runbar'), [{ type: 'buttons', items: [{ id: 'run', label: '▶ Run', primary: true }, { id: 'stop', label: '■ Stop' }, { id: 'reset', label: '⟲ Reset' }] }],
      id => { if (id === 'run') start(); else if (id === 'stop') stop(); else if (id === 'reset') reset(); });
    const ctl = kit.controls($('.bl-ctl'), [
      { id: 'pot', label: 'Potentiometer on GPIO34', min: 0, max: 4095, step: 1, value: st.input.pot, fmt: v => Math.round(v) + ' of 4095' },
      { id: 'speed', type: 'select', label: 'Speed of the simulation', options: SPEEDS, value: st.speed }
    ], (id, v) => { if (id === 'pot') st.input.pot = clamp(+v || 0, 0, 4095); else if (id === 'speed') st.speed = +v || 1; if (!running) loop.once(); });
    function paint() { lay = drawBoard(stage.begin(), stage.W, stage.H, R, st.input); }
    function buttons() {
      const r = runCtl.rows;
      if (r.run) r.run.textContent = running ? '↻ Restart' : '▶ Run';
      if (r.stop) r.stop.disabled = !running;
      if (r.reset) r.reset.disabled = !R;
    }
    function start(quiet) {
      R = run(st.model, {});
      R.input = st.input;
      running = true; printed = -1;
      buttons(); loop.start();
      if (quiet) toast('Restarted with the change.');
    }
    function stop() { if (R) R.stop(); running = false; loop.stop(); buttons(); markRun(); paint(); side(); }
    function reset() { stop(); R = null; out.textContent = ''; buttons(); paint(); side(); }
    function press(k, down) { st.input[k] = down; if (!running) loop.once(); }
    function side() {
      const n = R ? R.printed : 0;
      if (n !== printed) { printed = n; out.textContent = R ? R.serial.join('\n') : ''; out.scrollTop = out.scrollHeight; }
      const A = A0;
      const vs = [...A.vars].map(([name, t]) => '<span>' + esc(name) + '</span><b>' + esc(R && name in R.vars ? fmtVal(R.vars[name], t) : '—') + '</b>').join('') +
        (A.states.length ? '<span>state</span><b>' + esc(R && R.state ? R.state : '—') + '</b>' : '');
      if (vs !== lastVars) { lastVars = vs; varsEl.innerHTML = vs ? '<div class="bl-varh small muted">Variables</div><div class="bl-vgrid">' + vs + '</div>' : ''; }
      const s = !R ? 'Press <b>▶ Run</b> to start the program. Hold the buttons with the mouse, or with the A and B keys; turn the potentiometer with the slider or on the board.'
        : R.error ? '<span class="bl-bad">The program stopped: ' + esc(R.error) + '</span>'
        : (running ? 'Running' + ({ 0.5: ' at half speed', 0.25: ' at a quarter of the speed', 2: ' twice as fast' }[st.speed] || '') + '. The block being run is outlined.' : 'Stopped. ▶ Run starts the program again from the beginning.') +
          (R.hints.length ? '<ul class="bl-hints">' + R.hints.map(h => '<li>' + esc(h) + '</li>').join('') + '</ul>' : '');
      if (s !== lastStatus) { lastStatus = s; status.innerHTML = s; }
      markRun();
    }
    // the buttons and the knob on the board answer the mouse
    const inside = (r, p) => r && p.x >= r.x - 4 && p.x <= r.x + r.w + 4 && p.y >= r.y - 4 && p.y <= r.y + r.h + 4;
    const potFrom = p => {
      const deg = Math.atan2(p.y - lay.pot.y, p.x - lay.pot.x) * 180 / Math.PI;    // the knob turns 270°, from -225° to 45°
      let f = (((deg + 225) % 360) + 360) % 360 / 270;
      if (f > 1) f = f > 1 + 45 / 270 ? 0 : 1;
      st.input.pot = Math.round(f * 4095); ctl.set('pot', st.input.pot);
      if (!running) loop.once();
    };
    kit.drag(stage, {
      hit: p => inside(lay.A, p) ? 'A' : inside(lay.B, p) ? 'B' : lay.pot && Math.hypot(p.x - lay.pot.x, p.y - lay.pot.y) <= lay.pot.r ? 'pot' : null,
      start: (w, p) => { if (w === 'pot') potFrom(p); else press(w, true); },
      move: (w, p) => { if (w === 'pot') potFrom(p); },
      end: w => { if (w !== 'pot') press(w, false); },
      hover: true
    });
    /* ---- drag and drop (mouse and pen; on a touch screen a tap adds the block and the toolbar moves it) */
    let drag = null;
    const inside2 = (outer, inner) => { const walk = b => b === inner || (b.body || []).some(walk) || (b.else || []).some(walk); return walk(outer); };
    function dropTarget(x, y) {
      const el = document.elementFromPoint ? document.elementFromPoint(x, y) : null;
      if (!el || !ws.contains(el)) return null;
      const foot = el.closest('[data-foot]');
      if (foot) return { id: +foot.dataset.foot, mode: 'after', el: foot.closest('.bl-item') };
      const item = el.closest('.bl-item');
      if (!item) return null;
      const id = +item.dataset.id, loc = locate(id);
      if (!loc) return null;
      return { id, mode: loc.hat ? 'top' : isC(BLOCKS[loc.block.type]) ? 'into' : 'after', el: item };
    }
    function showDrop(t) {
      ui.$$('.bl-drop', ws).forEach(e => e.classList.remove('bl-drop', 'into', 'after', 'top'));
      if (t && t.el) t.el.classList.add('bl-drop', t.mode);
    }
    function endDrag(e) {
      const d = drag;
      drag = null;
      if (!d) return;
      if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
      if (d.srcEl) d.srcEl.classList.remove('bl-dragging');
      showDrop(null);
      if (!d.moved) return;
      st.justDragged = true;
      setTimeout(() => { st.justDragged = false; }, 0);
      const t = e ? dropTarget(e.clientX, e.clientY) : null;
      if (!t) { if (d.type && e) toast('Drop the block on a block of the workspace: it goes after that block, or into a C-shaped one.'); return; }
      let b;
      if (d.id != null) {
        const src = locate(d.id), tgt = locate(t.id);
        if (!src || src.hat || !tgt || t.id === d.id) return;
        if (tgt.block && inside2(src.block, tgt.block)) { toast('A block cannot go inside itself.'); return; }
        snap();
        src.list.splice(src.i, 1);
        b = src.block;
      } else {
        if (d.type === 'start' && st.model.scripts.some(x => x.hat.type === 'start')) { toast('The program already has its “when started” script.'); return; }
        snap();
        b = fresh(d.type, d.preset);
      }
      const loc = locate(t.id);
      if (BLOCKS[b.type].shape === 'hat') st.model.scripts.splice(loc ? (loc.hat ? loc.i : st.model.scripts.indexOf(loc.script)) + 1 : st.model.scripts.length, 0, { hat: b, body: [] });
      else if (!loc) { st.undo.pop(); return; }
      else if (loc.hat) loc.script.body.unshift(b);
      else if (t.mode === 'into') loc.block.body.unshift(b);
      else loc.list.splice(loc.i + 1, 0, b);
      st.sel = b.id; st.foot = false;
      if (d.type) renderPalette();
      changed(true);
    }
    function startDrag(e, d) {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      drag = Object.assign({ x: e.clientX, y: e.clientY, moved: false, ghost: null }, d);
    }
    ws.addEventListener('pointerdown', e => {
      if (e.target.closest('input, select, button, .bl-hole, [data-foot]')) return;
      const item = e.target.closest('.bl-item'), loc = item && locate(+item.dataset.id);
      if (!loc || loc.hat) return;
      startDrag(e, { id: loc.block.id, srcEl: item, html: item.outerHTML });
    });
    pal.addEventListener('pointerdown', e => {
      const p = e.target.closest('[data-pal]');
      if (!p) return;
      const [gi, ii] = p.dataset.pal.split(':').map(Number), it = PALETTE[gi][1][ii];
      if (isVal(BLOCKS[it[0]])) return;
      startDrag(e, { type: it[0], preset: it[1], html: p.innerHTML });
    });
    const dragMove = e => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        drag.ghost = document.createElement('div');
        drag.ghost.className = 'sb bl-ghost';
        drag.ghost.innerHTML = drag.html;
        document.body.appendChild(drag.ghost);
        if (drag.srcEl) drag.srcEl.classList.add('bl-dragging');
        closePicker();
      }
      drag.ghost.style.left = (e.clientX + 10) + 'px';
      drag.ghost.style.top = (e.clientY + 8) + 'px';
      showDrop(dropTarget(e.clientX, e.clientY));
      if (e.preventDefault) e.preventDefault();
    };
    const dragUp = e => endDrag(e);
    const dragCancel = () => { if (drag) { drag.moved = false; endDrag(null); } };
    document.addEventListener('pointermove', dragMove);
    document.addEventListener('pointerup', dragUp);
    document.addEventListener('pointercancel', dragCancel);
    ui.onLeave(() => { dragCancel(); document.removeEventListener('pointermove', dragMove); document.removeEventListener('pointerup', dragUp); document.removeEventListener('pointercancel', dragCancel); });

    stage.onResize(() => loop.once());
    if (T.util && T.util.onTheme) T.util.onTheme(() => loop.once());

    titleIn.value = st.model.title || '';
    renderPalette(); renderWS(); renderTools(); renderCode(); buttons(); paint(); side();
  }

  /* ---------------------------------------------------------------- the examples: #/tools/blocklab/examples */
  function examples(body) {
    if (!st.model) st.model = loadModel();
    body.innerHTML = '<p class="muted bl-intro">Eight finished programs. Open one in the editor to run it on the virtual board, change it, and read it as C++ and MicroPython. Your own program is not lost: Undo in the editor brings it back.</p>' +
      '<div class="bl-ex">' + EXAMPLES.map((ex, i) => '<div class="boxy bl-excard"><h3><span class="bl-exn">' + (i + 1) + '</span>' + esc(ex.title) + '</h3>' + ex.teaches.map(t => '<p class="small">' + esc(t) + '</p>').join('') +
        '<div class="bl-exblocks">' + (C ? C.blocks.html(gen(ex.model, 'blocks')) : '') + '</div>' +
        '<div class="bl-exfoot"><button type="button" class="btn sm pri" data-ex="' + ex.id + '">Open in the editor</button><span class="small muted">' + esc(partsUsed(ex.model).join(' · ')) + '</span></div></div>').join('') + '</div>' +
      (T.util ? T.util.more(['block-programming-tools', 'conditions-and-loops', 'state-machines', 'driving-leds-with-pwm']) : '');
    body.addEventListener('click', e => {
      const b = e.target.closest('[data-ex]');
      if (!b) return;
      loadExample(b.dataset.ex);
      if (root.location) root.location.hash = '#/tools/blocklab/build';
    });
  }

  T.blocklab = function (el, params, sub) {
    const { tab, body } = T.util.subtabs(el, 'blocklab', [['build', 'Build'], ['examples', 'Examples']], sub);
    const want = params && params.get ? params.get('example') : null;
    if (want && want !== st.exParam) loadExample(want);
    st.exParam = want;
    ({ build, examples })[tab](body);
  };
  T.blocklab.tabs = ['build', 'examples'];
  T.blocklab.dom = true;
})(typeof window !== 'undefined' ? window : globalThis);
