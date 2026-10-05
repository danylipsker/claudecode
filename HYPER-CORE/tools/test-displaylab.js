/* Tests of the Display & GUI lab of Hyper ESP32 (HYPER-CORE/js/ui/esp-display.js): the programs it writes for every
 * panel and every sub-tab (brackets, block notation, stale API forms, and — when a Python is installed — that every
 * MicroPython program parses), the touch calibration arithmetic, the multiplexing model and the number formatting.
 *
 *   node HYPER-CORE/tools/test-displaylab.js
 */
'use strict';
const path = require('path');
const { spawnSync } = require('child_process');
const { makeContext, loadCore, run } = require('./load');
const ctx = makeContext();
const H = loadCore(ctx);
run(ctx, path.join(__dirname, '..', 'js', 'ui', 'esp-display.js'));
const G = H.gfx, C = H.code, T = H.espTools.displaylab, gen = T.gen;
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  FAIL  ' + name); } };
const pys = [];
/* a program card must check clean: no bracket errors, no unparsable blocks, no stale API forms */
function card(e, name) {
  const r = C.check(e);
  ok(r.errors.length === 0, name + ': no errors ' + (r.errors.length ? JSON.stringify(r.errors) : ''));
  ok(r.warnings.length === 0, name + ': no warnings ' + (r.warnings.length ? JSON.stringify(r.warnings) : ''));
  ok(!/NaN|undefined|Infinity/.test(String(e.cpp) + e.py + e.blocks), name + ': no NaN or undefined in the programs');
  if (e.py) pys.push([name, e.py]);
}

/* ---------------------------------------------------------------- the GUI designer */
ok(T.tabs.join() === 'gui,draw,lcd,segments,touch,catalogue', 'six sub-tabs');
for (const tg of gen.targets) {
  const d = gen.defaultDesign(tg.id), e = gen.gui(d, tg);
  card(e, 'gui ' + tg.id);
  ok(d.screens.length === 2 && d.screens[0].widgets.some(w => w.type === 'gauge') && d.screens[0].widgets.some(w => w.type === 'chart') && d.screens[0].widgets.some(w => w.action === 'goto'), tg.id + ': the thermostat example has a gauge, a chart and a button to the second screen');
  for (const s of d.screens) for (const w of s.widgets) ok(w.x >= 0 && w.y >= 0 && (w.w == null || w.x + w.w <= tg.w) && (w.h == null || w.y + w.h <= tg.h), tg.id + ': ' + w.id + ' lies on the panel');
  if (tg.depth === 1) {
    ok(/Adafruit_SSD1306 display\(128, 64, &Wire, -1\)/.test(e.cpp) && /display\.display\(\)/.test(e.cpp) && /cp437\(true\)/.test(e.cpp), 'oled: Adafruit SSD1306 set-up, display() and code page 437');
    ok(/ssd1306\.SSD1306_I2C\(128, 64, i2c\)/.test(e.py) && /oled\.show\(\)/.test(e.py), 'oled: MicroPython ssd1306 driver and show()');
    ok(/"21\.5\\xF8" "C"/.test(e.cpp), 'oled: the degree sign as \\xF8, the literal split before a hex digit');
  } else {
    for (const name of ['lv_label_create', 'lv_button_create', 'lv_slider_create', 'lv_switch_create', 'lv_checkbox_create', 'lv_bar_create', 'lv_arc_create', 'lv_chart_create', 'lv_list_create', 'lv_obj_set_pos', 'lv_obj_set_size', 'lv_obj_add_event_cb', 'LV_EVENT_CLICKED', 'LV_EVENT_VALUE_CHANGED', 'lv_screen_load', 'lv_display_create', 'lv_display_set_flush_cb', 'lv_indev_create', 'lv_tick_set_cb', 'lv_timer_handler'])
      ok(e.cpp.includes(name), tg.id + ': the C++ uses ' + name);
    ok(!/lv_btn_create|lv_scr_act|lv_scr_load|lv_disp_drv|lv_obj_clear_flag|lv_img_create/.test(e.cpp), tg.id + ': no LVGL 8 names');
    ok(/import lvgl as lv/.test(e.py) && /lv\.button\(/.test(e.py) && /\.add_event_cb\(/.test(e.py) && /lv\.screen_load\(/.test(e.py), tg.id + ': MicroPython with the LVGL binding');
    ok(/adapt to your board/.test(e.cpp) && /adapt to your board/.test(e.py), tg.id + ': the board set-up is marked as the part to adapt');
    ok(/when button \[btn_settings\] touched/.test(e.blocks) && /show screen \[Settings v\]/.test(e.blocks) && /create button \[btn_plus\]/.test(e.blocks), tg.id + ': blocks create, touch and show screens');
    ok(/btn_plus_clicked[\s\S]*lbl_set_v = constrain\(lbl_set_v \+ 0\.5, 15\.0, 30\.0\)/.test(e.cpp) && /show_number\(lbl_set, "%\.1f°C", lbl_set_v\)/.test(e.cpp), tg.id + ': + steps the set point label and keeps its format');
  }
}
// every widget, every kind of demo data and every action, on every panel
for (const tg of gen.targets) {
  const types = ['label', 'button', 'slider', 'switch', 'checkbox', 'bar', 'gauge', 'chart', 'icon', 'list', 'header'];
  const ws = types.map((t, i) => Object.assign(gen.newWidget(t, tg), { id: 'w' + i + '_' + t, x: 2, y: 2 }));
  const binds = ['none', 'room', 'sine', 'walk'];
  ws.forEach((w, i) => { if ('bind' in w) w.bind = binds[i % 4]; });
  ws.push(Object.assign(gen.newWidget('label', tg), { id: 'loop', text: 'Level 50%', bind: 'walk', x: 1, y: 1 }));
  ws.push(Object.assign(gen.newWidget('icon', tg), { id: 'ic2', icon: 'heart', size: 2, x: 1, y: 1 }));
  ws.push(Object.assign(gen.newWidget('button', tg), { id: 'b_step_bar', action: 'step', target: 'w5_bar', by: -5, x: 1, y: 1 }));
  ws.push(Object.assign(gen.newWidget('button', tg), { id: 'b_step_g', action: 'step', target: 'w6_gauge', by: 2, text: 'Up "50%"', x: 1, y: 1 }));
  ws.push(Object.assign(gen.newWidget('button', tg), { id: 'b_step_s', action: 'step', target: 'w2_slider', by: 10, x: 1, y: 1 }));
  ws.push(Object.assign(gen.newWidget('button', tg), { id: 'b_go', action: 'goto', screen: 's2', x: 1, y: 1 }));
  const d = gen.cleanDesign({ cur: 0, screens: [{ id: 's1', name: 'All the widgets', bg: 'white', widgets: ws }, { id: 's2', name: 'Two [sic]', bg: 'navy', widgets: [Object.assign(gen.newWidget('list', tg), { id: 'setup', items: 'One' })] }] }, tg);
  ok(d && d.screens[1].widgets[0].id === 'setup', tg.id + ': a design read back keeps its widgets');
  card(gen.gui(d, tg), 'gui every widget ' + tg.id);
  ok(/\bsetup_w(_items)?\b/.test(gen.gui(d, tg).cpp) && !/\bsetup_items\b|\*setup\b/.test(gen.gui(d, tg).cpp), tg.id + ': a widget named like a reserved word is renamed in the program');
}
ok(gen.cleanDesign(null, gen.targets[0]) === null && gen.cleanDesign({ screens: [] }, gen.targets[0]) === null, 'an empty or broken design is refused');
ok(gen.textWith('21.5°C', 22) === '22.0°C' && gen.textWith('Level 7 %', 12.34) === 'Level 12 %' && gen.textWith('Speed', 3) === 'Speed 3.0', 'a number in a label keeps its decimals');

/* ---------------------------------------------------------------- draw */
const drawable = G.DISPLAYS.filter(d => d.w && d.h);
ok(drawable.length >= 20, 'at least 20 drawable displays in the catalogue');
for (const d of drawable) {
  const cmds = gen.drawExample(d).concat([{ op: 'pixel', x: 1, y: 1, c: 'white' }, { op: 'rect', x: 1, y: 1, w: 5, h: 5, c: 'red' }, { op: 'fillRect', x: 2, y: 2, w: 3, h: 3, c: 'black' }, { op: 'fillRoundRect', x: 1, y: 1, w: 9, h: 9, r: 2, c: 'blue' },
    { op: 'triangle', x0: 0, y0: 0, x1: 5, y1: 0, x2: 0, y2: 5, c: 'white' }, { op: 'text', x: 0, y: 0, size: 2, text: 'a"b 23°C', c: 'white' }]);
  for (const c of cmds) for (const k of Object.keys(c)) if (typeof c[k] === 'number') ok(Number.isFinite(c[k]), d.id + ': example ' + c.op + '.' + k + ' is a number');
  card(gen.draw(d, cmds), 'draw ' + d.id);
}
const oledDraw = gen.draw(G.display('ssd1306-128x64'), gen.drawExample(G.display('ssd1306-128x64')));
ok(/display\.drawCircle\(/.test(oledDraw.cpp) && /SSD1306_WHITE/.test(oledDraw.cpp) && /fb\.ellipse\(/.test(oledDraw.py) && /fb\.poly\(0, 0, array\("h"/.test(oledDraw.py), 'draw: Adafruit GFX calls and framebuf calls');
ok(/tft\.fillScreen\(0x0000\)/.test(gen.draw(G.display('ili9341-320x240'), gen.drawExample(G.display('ili9341-320x240'))).cpp), 'draw: TFT_eSPI with RGB565 colours');
ok(/GFXcanvas16 display\(800, 480\)/.test(gen.draw(G.display('rgb-800x480'), []).cpp), 'draw: an RGB panel draws on a GFX canvas and says which driver sends it');
ok(gen.rateOf(G.display('ili9341-320x240')).fps > 25 && gen.rateOf(G.display('ili9341-320x240')).fps < 35, 'a full ILI9341 frame over 40 MHz SPI: about 31 per second');
ok(gen.rateOf(G.display('epd-290')).fps == null, 'e-paper: no bus frame rate, the panel limits it');

/* ---------------------------------------------------------------- the character LCD */
const lcd16 = { size: '16x2', bl: 'green', lines: ['{0} Temp  23.5°C', 'x~y\\z', '', ''], col: 3, row: 1, cursor: true, blink: true, shift: 3, custom: Array.from({ length: 8 }, (_, i) => [i, 1, 2, 3, 4, 5, 6, 31]), fw: 6, fd: 1, fz: false };
const e16 = gen.lcd(lcd16);
card(e16, 'lcd 16x2');
ok(/LiquidCrystal_I2C lcd\(0x27, 16, 2\)/.test(e16.cpp) && /lcd\.write\(byte\(223\)\)/.test(e16.cpp) && /lcd\.write\(byte\(0\)\)/.test(e16.cpp) && /lcd\.createChar\(0, custom0\)/.test(e16.cpp), 'lcd: backpack at 0x27, ° as character 223, custom character 0');
ok(/scrollDisplayLeft/.test(e16.cpp) && /hal_write_command\(0x18\)/.test(e16.py) && /I2cLcd\(i2c, 0x27, 2, 16\)/.test(e16.py), 'lcd: scrolling in C++ and in python_lcd');
card(gen.lcd(Object.assign({}, lcd16, { size: '20x4', shift: 30, lines: ['a', 'b', 'c', 'd'] })), 'lcd 20x4 scrolled right');
card(gen.lcdFormat(lcd16), 'lcd number format');
ok(/"%6\.1f"/.test(gen.lcdFormat(lcd16).cpp) && /"\{:06\.2f\}"/.test(gen.lcdFormat(Object.assign({}, lcd16, { fz: true, fd: 2 })).py), 'lcd: printf and str.format widths');
ok(gen.fixedNum(3.14159, 6, 1, false) === '   3.1' && gen.fixedNum(-3.14159, 6, 1, true) === '-003.1' && gen.fixedNum(123.456, 5, 2, false) === '123.46' && gen.fixedNum(-0.01, 5, 1, false) === ' -0.0', 'fixed-width numbers as printf writes them');

/* ---------------------------------------------------------------- seven segments */
for (const mode of ['number', 'clock', 'text', 'raw']) for (const dec of [0, 1, 2, 3]) card(gen.seg({ mode, value: mode === 'number' ? 23.5 : 0, dec, text: 'HELP', raw: [0x76, 0x79, 0x38, 0xF3], bright: 5 }), 'segments ' + mode + ' ' + dec);
ok(/showNumberDecEx\(235, 0b00100000, false\)/.test(gen.seg({ mode: 'number', value: 23.5, dec: 1, bright: 7 }).cpp), 'segments: 23.5 with the dot after the third digit');
ok(/setSegments\(segs\)/.test(gen.seg({ mode: 'number', value: 123456, dec: 0, bright: 7 }).cpp), 'segments: a number too wide becomes dashes');
ok(/0x76, 0x79, 0x38, 0x73/.test(gen.seg({ mode: 'text', text: 'HELP', bright: 7 }).cpp), 'segments: HELP as bytes');
const P = gen.persistence;
ok([0, 1, 2, 3].every(k => P(10, 2000, k) > 0.95), 'multiplexing at 2000 digits a second: all four look lit');
{ const t = 10.3, rate = 0.5, act = Math.floor(t * rate) % 4; ok(P(t, rate, act) > 0.95 && [0, 1, 2, 3].filter(k => k !== act).every(k => P(t, rate, k) < 0.01), 'multiplexing slowed to 0.5 a second: one digit at a time'); }

/* ---------------------------------------------------------------- touch */
for (const rot of [0, 1, 2, 3]) {
  const w = rot & 1 ? 320 : 240, h = rot & 1 ? 240 : 320;
  const ex = gen.exactCal(rot, 'res');
  let worst = 0;
  for (const [x, y] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1], [w >> 1, h >> 2], [37, 101]]) { const r = gen.touchRaw(x, y, rot, 'res'), m = G.touchMap(r.x, r.y, ex, w, h); worst = Math.max(worst, Math.hypot(m.x - x, m.y - y)); }
  ok(worst <= 1.5, 'rotation ' + rot + ': the exact four numbers map within a pixel (worst ' + worst.toFixed(2) + ')');
  const tgts = [{ x: Math.round(w * 0.1), y: Math.round(h * 0.1) }, { x: Math.round(w * 0.9), y: Math.round(h * 0.5) }, { x: Math.round(w * 0.5), y: Math.round(h * 0.9) }];
  const sol = gen.solveCal(tgts.map(t => ({ raw: gen.touchRaw(t.x, t.y, rot, 'res'), target: t })), w, h);
  ok(sol && sol.swap === ex.swap && Math.abs(sol.xMin - ex.xMin) <= 20 && Math.abs(sol.yMax - ex.yMax) <= 20, 'rotation ' + rot + ': three touches give the swap and the four numbers');
  const cap = gen.exactCal(rot, 'cap');
  ok(typeof cap.swap === 'boolean' && (rot & 1 ? cap.swap : !cap.swap), 'rotation ' + rot + ': a capacitive panel needs a swap exactly in landscape');
  card(gen.touch({ panel: 'res', rot, cal: Object.assign({}, ex), cap }), 'touch resistive ' + rot);
  card(gen.touch({ panel: 'cap', rot, cal: ex, cap }), 'touch capacitive ' + rot);
}
ok(/XPT2046_Touchscreen ts\(T_CS, T_IRQ\)/.test(gen.touch({ panel: 'res', rot: 1, cal: gen.exactCal(1, 'res'), cap: {} }).cpp), 'touch: the XPT2046 library of the crib');
ok(/readfrom_mem\(FT6X36, 0x02, 5\)/.test(gen.touch({ panel: 'cap', rot: 1, cal: {}, cap: gen.exactCal(1, 'cap') }).py), 'touch: FT6x36 registers read over I2C');
ok(/X_MAX = 201/.test(gen.touch({ panel: 'res', rot: 1, cal: { xMin: 200, xMax: 200, yMin: 0, yMax: 4095, swap: false }, cap: {} }).cpp), 'touch: equal min and max are kept apart (no division by zero)');

/* ---------------------------------------------------------------- the catalogue */
for (const d of G.DISPLAYS) { const r = gen.catRow(d); ok(!/NaN|undefined|Infinity/.test([r.res, r.memText, r.fpsText, r.how, r.pins, r.href].join(' ')), 'catalogue ' + d.id + ': every cell is filled'); ok(/^#\/tools\/displaylab\/(draw\?d=|lcd\?size=|segments)/.test(r.href), 'catalogue ' + d.id + ': opens in a tab'); }

/* ---------------------------------------------------------------- MicroPython, by a real Python if there is one */
// stdin is read as bytes and decoded as UTF-8: on Windows Python would otherwise decode it with the ANSI code page
const script = 'import ast, json, sys\nprogs = json.loads(sys.stdin.buffer.read().decode("utf-8"))\nbad = []\nfor n, p in progs:\n    try:\n        ast.parse(p)\n    except SyntaxError as e:\n        bad.append("%s: line %s: %s" % (n, e.lineno, e.msg))\nprint(json.dumps(bad))\n';
let parsed = false;
for (const exe of ['python', 'python3', 'py']) {
  const r = spawnSync(exe, ['-c', script], { input: JSON.stringify(pys), encoding: 'utf8', timeout: 60000 });
  if (r.status === 0 && r.stdout) { try { const bad = JSON.parse(r.stdout); for (const b of bad) ok(false, 'py does not parse — ' + b); pass += pys.length - bad.length; parsed = true; break; } catch (e) { /* try the next */ } }
}
if (!parsed) console.log('  (no Python found: ' + pys.length + ' MicroPython programs not syntax-checked)');

if (fail) { console.log(fail + ' FAILED, ' + pass + ' passed'); process.exit(1); }
console.log('OK: ' + pass + ' checks passed');
