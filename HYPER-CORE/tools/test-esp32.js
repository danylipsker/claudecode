/* Tests of the Hyper ESP32 engine: the catalogue (chips, pins, modules, boards), the pin planner and the project
 * advisor, the calculators against known values, the serial-signal encoders, state machines, the virtual displays
 * and the block notation. Each line is also a one-line example of the call.
 *
 *   node HYPER-CORE/tools/test-esp32.js
 */
'use strict';
const { loadCore } = require('./load');
const H = loadCore();
const E = H.esp, G = H.gfx, C = H.code;
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  FAIL  ' + name); } };
const near = (a, b, tol, name) => ok(Math.abs(a - b) <= (tol == null ? 1e-9 : tol), name + '  (got ' + a + ', want ' + b + ')');

/* ---------------------------------------------------------------- the catalogue */
ok(E.CHIPS.length >= 15, 'at least 15 chips');
for (const c of E.CHIPS) {
  ok(/^esp(32|8266)/.test(c.id) && c.name && c.tagline && c.role, c.id + ': id, name, tagline, role');
  ok(c.cores >= 1 && c.mhz >= 80 && c.sram > 0 && c.gpio > 0, c.id + ': cores, clock, RAM, GPIO');
  ok(Array.isArray(c.good) && c.good.length >= 3 && Array.isArray(c.bad) && c.bad.length >= 3, c.id + ': virtues and limitations');
  ok(!c.wifi || (c.wifi.gen >= 4 && c.wifi.bands.length), c.id + ': Wi-Fi record');
  ok(typeof c.status === 'string' && c.status, c.id + ': status');
}
ok(E.chip('esp32').bt.classic === true && E.chip('esp32-s3').bt.classic === false, 'Bluetooth Classic: ESP32 yes, S3 no');
ok(E.chip('esp32-c6').ieee802154 && !E.chip('esp32-c3').ieee802154 && E.chip('esp32-h2').wifi == null, '802.15.4 on the C6 and H2; the H2 has no Wi-Fi');
ok(E.chip('esp32-p4').wifi == null && E.chip('esp32-p4').bt == null && E.chip('esp32-p4').mhz === 400, 'the P4 has no radio');
ok(E.chip('esp32-c5').wifi.bands.includes(5), 'the C5 has 5 GHz');
ok(E.chip('esp32-c2').gpio === 14 && E.chip('esp32-h2').gpio === 19, 'GPIO counts of the C2 and H2');
ok(E.chip('esp32').dac === 2 && E.chip('esp32-s2').dac === 2 && !E.chip('esp32-s3').dac, 'DAC only on the ESP32 and S2 (and S31)');
ok(E.chip('ESP32-S3').id === 'esp32-s3', 'chip ids are case-insensitive');

// pins
ok(Object.keys(E.PINS).length === 11, '11 pin tables');
for (const [id, P] of Object.entries(E.PINS)) {
  ok(E.chip(id), id + ': the pin table belongs to a chip');
  ok(P.gpios.length > 10 && P.strapping.length >= 2 && P.rules.length >= 5, id + ': gpios, strapping, rules');
  const c = E.chip(id);
  if (c && c.strap) ok(c.strap.every(n => P.gpios.some(g => g.n === n && g.strap)), id + ': the chip\'s strapping list agrees with its pin table');
  ok(P.gpios.every(g => ['yes', 'caution', 'avoid'].includes(g.safe)), id + ': every pin has a verdict');
}
ok(E.pin('esp32', 34).dir === 'I' && E.pin('esp32', 34).adc === 'ADC1_CH6', 'ESP32 GPIO34: input only, ADC1_CH6');
ok(E.pin('esp32', 12).strap && E.pin('esp32', 6).flash === true, 'ESP32 GPIO12 strapping, GPIO6 flash');
ok(E.pin('esp32', 25).dac && E.pin('esp32', 4).touch, 'ESP32 GPIO25 DAC, GPIO4 touch');
ok(E.pin('esp32-s3', 19).usb && E.pin('esp32-s3', 20).usb, 'ESP32-S3 USB on GPIO19/20');
ok(E.pin('esp32-c3', 9).strap && E.pin('esp32-c3', 18).usb, 'ESP32-C3 GPIO9 boot pin, GPIO18 USB');
ok(E.pinsFor('esp32', 'adc-wifi').every(n => n >= 32 && n <= 39), 'ESP32: analogue inputs that work with Wi-Fi are GPIO32–39');
ok(E.pinsFor('esp32', 'dac').join() === '25,26' && E.pinsFor('esp32', 'touch').length === 10, 'ESP32: two DAC pins, ten touch pins');
ok(!E.pinsFor('esp32', 'output').includes(34) && !E.pinsFor('esp32', 'any').includes(6), 'input-only and flash pins are left out');
ok(E.parsePin('VP=36').gpio === 36 && E.parsePin('VP=36').label === 'VP' && E.parsePin('23').gpio === 23 && E.parsePin('GND').gpio === null, 'parsePin');
ok(E.pinKind('esp32', '3V3') === 'power' && E.pinKind('esp32', 'GND') === 'gnd' && E.pinKind('esp32', 'EN') === 'ctrl' && E.pinKind('esp32', '12') === 'strap' && E.pinKind('esp32', 'CLK=6') === 'flash' && E.pinKind('esp32', 'VP=36') === 'input', 'pinKind');
ok(E.pinVerdict('esp32', 6).level === 'avoid' && E.pinVerdict('esp32', 23).level === 'yes' && E.pinVerdict('esp32', 99).level === 'none', 'pinVerdict');
ok(E.pinCaps('esp32', 34).includes('input only'), 'pinCaps');

// modules and boards
ok(E.MODULES.length > 60 && E.MODULES.every(m => E.chip(m.chip)), 'every module names a chip of the catalogue');
ok(E.BOARDS.length > 500, 'more than 500 boards');
ok(E.BOARDS.every(b => b.id && b.name && b.maker && E.chip(b.chip)), 'every board has an id, a name, a maker and a known chip');
ok(new Set(E.BOARDS.map(b => b.id)).size === E.BOARDS.length, 'board ids are unique');
{
  let bad = 0, total = 0;
  for (const b of E.BOARDS) for (const h of (b.headers || [])) for (const p of h.pins) { const q = E.parsePin(p); if (q.gpio != null) { total++; if (!E.pin(b.chip, q.gpio) && !(b.chip === 'esp32' && q.gpio === 20)) bad++; } }
  ok(total > 1000 && bad <= 3, 'header pins are GPIOs of the board\'s chip (' + bad + ' of ' + total + ' are not)');
}
const dk = E.board('esp32-devkitc-v4');
ok(dk && dk.headers.length === 2 && dk.headers[0].pins.length === 19 && dk.headers[0].pins[0] === '3V3' && dk.headers[1].pins[1] === '23', 'ESP32-DevKitC V4: two rows of 19, 3V3 first, GPIO23 second on the right');
ok(E.board('seeed-xiao-esp32c3').headers.flatMap(h => h.pins).includes('D0=2'), 'XIAO ESP32C3: D0 is GPIO2');
ok(E.boardsOf('esp32-c6').length > 10 && E.family('M5Stack').length > 40, 'boardsOf, family');
ok(E.MAKERS.length >= 10 && E.PRODUCTS.length > 50, 'makers and products');

/* ---------------------------------------------------------------- the pin planner */
{
  const p = E.planPins('esp32', [{ what: 'i2c' }, { what: 'adc', n: 2 }, { what: 'dac' }, { what: 'touch' }, { what: 'button', n: 2 }]);
  const g = (what, role) => p.assign.find(a => a.what === what && (!role || a.role === role)).gpio;
  ok(g('i2c', 'SDA') === 21 && g('i2c', 'SCL') === 22, 'planner: the default I2C pins');
  ok(p.assign.filter(a => a.what === 'adc').every(a => a.gpio >= 32 && a.gpio <= 39), 'planner: analogue inputs on ADC1 when Wi-Fi is used');
  ok(g('dac') === 25 && [4, 0, 2, 15, 13, 12, 14, 27, 33, 32].includes(g('touch')), 'planner: DAC and touch pins');
  ok(new Set(p.assign.map(a => a.gpio)).size === p.assign.length, 'planner: no pin used twice');
  ok(/PIN_I2C_SDA = 21/.test(p.cpp) && /PIN_I2C_SDA = 21/.test(p.py), 'planner: pin definitions as code');
  const q = E.planPins(E.board('seeed-xiao-esp32c3'), [{ what: 'i2c' }, { what: 'adc', n: 3 }]);
  ok(q.assign.find(a => a.role === 'SDA').gpio === 6 && q.assign.every(a => a.gpio == null || [2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21].includes(a.gpio)), 'planner: only the pins a board brings out, and its own I2C pins');
  ok(E.planPins('esp32-c3', [{ what: 'dac' }]).warnings.length === 1, 'planner: no DAC on a C3 is reported');
}

/* ---------------------------------------------------------------- the project advisor */
{
  const top = t => E.advise(t).ranked[0].chip, outs = t => E.advise(t).out.map(o => o.chip);
  ok(top('A Bluetooth speaker that plays music from a phone') === 'esp32', 'advisor: Bluetooth audio needs the classic ESP32');
  ok(outs('A Bluetooth speaker that plays music from a phone').includes('esp32-s3'), 'advisor: the S3 is ruled out for Bluetooth audio');
  ok(top('A Zigbee light switch for Home Assistant that runs for a year on a coin cell') === 'esp32-h2', 'advisor: a coin-cell Zigbee switch is an H2');
  ok(top('A USB macro keyboard with 12 keys and RGB LEDs') === 'esp32-s3', 'advisor: a USB keyboard is an S3');
  ok(top('A doorbell with a camera that sends a photo to Telegram') === 'esp32-s3', 'advisor: a Wi-Fi camera is an S3');
  ok(top('A battery-powered weather station that sends temperature over Wi-Fi') === 'esp32-c3', 'advisor: a battery Wi-Fi sensor is a C3');
  ok(top('A voice-controlled lamp that recognises a wake word without the cloud') === 'esp32-s3', 'advisor: wake-word recognition is an S3');
  ok(top('a touch-screen thermostat with a 4.3 inch display') === 'esp32-s3', 'advisor: a 4.3 inch touch panel is an S3');
  ok(top('a 5 GHz wifi sensor') === 'esp32-c5', 'advisor: 5 GHz is a C5');
  ok(E.understand('a CAN bus logger for a car').some(n => n.id === 'can') && !E.understand('a CAN bus logger for a car').some(n => n.id === 'motor'), 'advisor: a car is not a motor');
  ok(!E.understand('a wake word without the cloud').some(n => n.id === 'wifi'), 'advisor: "without the cloud" does not ask for Wi-Fi');
  ok(E.advise([]).ranked[0].chip === 'esp32' && E.advise([]).ranked.every(r => r.chip !== 'esp32-e22'), 'advisor: with nothing asked the classic leads, and the co-processor is not offered');
  ok(E.advise(['wifi', 'lora']).ranked[0].boards.length > 0, 'advisor: boards are suggested');
  ok(E.compare(['esp32', 'esp32-c3']).length > 25, 'compare');
}

/* ---------------------------------------------------------------- calculators */
ok(E.ledcMaxBits(5000) === 13 && E.ledcMaxBits(1000, 80e6, 14) === 14 && E.ledcMaxFreq(10) === 78125, 'LEDC: 13 bits at 5 kHz from 80 MHz');
near(E.servo(90).us, 1500, 1e-9, 'servo: 90° is 1500 µs'); ok(E.servo(90).duty === 1229 && E.servo(90, { bits: 16 }).duty === 4915, 'servo: duty at 14 bits (the default) and at 16 bits, 50 Hz');
near(E.fspl(1, 2442), 40.2, 0.05, 'free-space loss at 1 m, 2.4 GHz');
near(E.link({ d: 10, n: 2 }).rx, 20 - 60.2, 0.1, 'link: 20 dBm over 10 m of free space');
near(E.dBmToMw(20), 100, 1e-9, '20 dBm = 100 mW'); near(E.mwToDbm(1), 0, 1e-9, '1 mW = 0 dBm');
near(E.quarterWave(2442), 29.2, 0.1, 'a quarter wave at 2.4 GHz is 29 mm');
ok(E.wifiChannel(1) === 2412 && E.wifiChannel(6) === 2437 && E.wifiChannel(11) === 2462 && E.wifiChannel(14) === 2484, 'Wi-Fi channel frequencies');
ok(!E.wifiOverlap(1, 6) && E.wifiOverlap(1, 4), 'Wi-Fi channels 1 and 6 do not overlap; 1 and 4 do');
ok(E.bleChannel(37) === 2402 && E.bleChannel(38) === 2426 && E.bleChannel(39) === 2480 && E.zigbeeChannel(11) === 2405 && E.zigbeeChannel(26) === 2480, 'BLE and 802.15.4 channels');
near(E.lora({ sf: 7, bytes: 12 }).t, 0.0412, 0.0005, 'LoRa SF7, 125 kHz, 12 bytes: 41 ms'); near(E.lora({ sf: 12, bytes: 12 }).t, 1.155, 0.01, 'LoRa SF12: 1.16 s');
ok(E.dutyLimit(1.155) === 31, 'LoRa: 31 messages an hour at 1 % duty');
near(E.dutyCycle([{ mA: 120, s: 3 }, { mA: 0.01, s: 597 }]).avg, 0.61, 0.005, 'duty cycle: 3 s at 120 mA every 10 minutes averages 0.61 mA');
near(E.batteryLife(2000, 0.61).days, 96, 1.5, 'battery life: 2000 mAh at 0.61 mA');
ok(E.adcCounts(1.65) === 2048 && E.adcEsp32Raw(0.05) === 0 && E.adcEsp32Raw(3.25) === 4095, 'ADC counts; the ESP32 dead zone and ceiling');
near(E.divider(4.2, 100e3, 100e3), 2.1, 1e-9, 'divider'); ok(E.eSeries(4500) === 4700 && E.eSeries(970, 'E24') === 1000, 'E-series');
near(E.ledResistor(3.3, 2.0, 0.01), 130, 1e-6, 'LED resistor'); near(E.ntcT(E.ntcR(40)), 40, 1e-6, 'NTC there and back');
near(E.i2cPullup(3.3, 100e-12, 100e3).min, 966.7, 0.1, 'I2C pull-up minimum'); near(E.i2cPullup(3.3, 100e-12, 100e3).max, 11802, 2, 'I2C pull-up maximum');
ok(E.crc16modbus([1, 3, 0, 0, 0, 0x0A]) === 0xCDC5 && E.crc32(E.bytesOf('123456789')) === 0xCBF43926 && E.crc8([0x02, 0x1C, 0xB8, 0x01, 0, 0, 0]) === 0xA2, 'CRC-16/Modbus, CRC-32, CRC-8/Maxim');
ok(E.hex(255) === '0xFF' && E.bin(5, 4) === '0101' && E.signed(0xFFFF) === -1 && E.kb(4194304) === '4 MB' && E.mac([0x7C, 0xDF, 0xA1, 1, 2, 3]) === '7C:DF:A1:01:02:03', 'hex, bin, signed, kb, mac');
ok(E.elapsed32(5, 4294967290) === 11, 'millis() arithmetic across the 32-bit wrap');
for (const s of E.PARTITION_SCHEMES) { const p = E.partitions(s.parts, s.flash); ok(p.errors.length === 0 && p.used === s.flash, 'partition scheme ' + s.id + ' fills its flash exactly'); }
{
  const p = E.partitions(E.PARTITION_SCHEMES[0].parts, 4 * 1024 * 1024);
  ok(p.rows[0].offset === 0x9000 && p.rows[2].offset === 0x10000 && p.rows[3].offset === 0x150000 && p.rows[4].offset === 0x290000 && p.ota, 'default 4 MB table: nvs 0x9000, app0 0x10000, app1 0x150000, spiffs 0x290000');
  ok(E.partitions([['nvs', 'data', 'nvs', 0x5000], ['app0', 'app', 'ota_0', 0x500000]], 4 * 1024 * 1024).errors.length === 1, 'a table larger than the flash is an error');
}
ok(E.pixelCurrent(60, 1) > 3600 && E.lipoSoc(4.2) === 1 && E.lipoSoc(3.0) === 0 && E.rssiQuality(-55) === 'good', 'pixel current, cell state of charge, RSSI words');

/* ---------------------------------------------------------------- serial signals */
{
  const u = E.proto.uart(0x41, { baud: 9600 });
  ok(u.bits.map(b => b.v).join('') === '0100000101' && Math.abs(u.t1 - 10 / 9600) < 1e-9, 'UART: 0x41 is start, 1000 0010 (LSB first), stop');
  ok(E.proto.uart(0x03, { parity: 'even' }).bits.find(b => b.kind === 'parity').v === 0 && E.proto.uart(0x07, { parity: 'even' }).bits.find(b => b.kind === 'parity').v === 1, 'UART parity');
  ok(E.proto.uartBytes(E.bytesOf('Hi'), { show: 'ascii' }).marks.map(m => m.text).join() === "'H','i'", 'UART bytes with marks');
  const i = E.proto.i2c({ addr: 0x3C, data: [0x00, 0xAF] });
  ok(i.marks.map(m => m.text).join(' ') === 'S 0x3C W A 0x00 A 0xAF A P', 'I2C: start, address, data, stop');
  ok(E.proto.i2c({ addr: 0x50, data: [1], addrAck: false }).marks.map(m => m.text).join(' ') === 'S 0x50 W N P', 'I2C: nobody answers');
  ok(E.proto.i2c({ addr: 0x48, read: true, data: [0x12, 0x34] }).marks.map(m => m.text).join(' ') === 'S 0x48 R A 0x12 A 0x34 N P', 'I2C read: the last byte is not acknowledged');
  const s = E.proto.spi({ mode: 0, bytes: [0xA5], miso: [0x3C] });
  ok(s.sample === 'rising' && s.sck.length === 17 && E.proto.spi({ mode: 1, bytes: [1] }).sample === 'falling' && E.proto.spi({ mode: 3, bytes: [1] }).sample === 'rising', 'SPI modes and their sampling edge');
  ok(E.proto.ws2812([[255, 0, 0]]).edges.length === 49 && Math.abs(E.proto.ws2812([[0, 0, 0]]).tBit - 1.25e-6) < 1e-12, 'WS2812: 24 bits per LED at 800 kHz');
  const c = E.proto.can(0x123, [0xDE, 0xAD]);
  ok(c.bits.filter(b => b.field === 'ID' && !b.stuffed).length === 11 && c.bits.some(b => b.stuffed), 'CAN: 11 identifier bits, with stuffing');
  ok(E.proto.quadrature(8, 100).a.length > 3 && E.proto.levelAt([[0, 0], [1, 1], [2, 0]], 1.5) === 1, 'quadrature, levelAt');
  ok(E.proto.bounce([[0.1, 0.3]], { seed: 3 }).length > 4 && E.baudError(115200, 115200 * 1.06).ok === false && E.baudError(115200, 115200 * 1.01).ok, 'bouncing contacts; a 6 % baud error breaks a frame, 1 % does not');
  const d = E.debouncer(20); d(1, 0); d(0, 5); ok(d(0, 10) === 1 && d(0, 30) === 0, 'debouncer: the output follows after 20 ms of quiet');
}

/* ---------------------------------------------------------------- filters, control, state machines */
{
  const f = E.movingAverage(4); [4, 8, 4, 8].forEach(f); near(f(6), 6.5, 1e-9, 'moving average');
  const h = E.hysteresis(20, 22); ok(h(21) === false && h(22.5) === true && h(21) === true && h(19) === false, 'hysteresis');
  const pid = E.pid({ kp: 2, ki: 0.5, kd: 0.1, min: 0, max: 100 }), pl = E.plant({ tau: 20, gain: 1, ambient: 20 });
  let y = 20; for (let k = 0; k < 3000; k++) y = pl.step(pid.step(50, y, 0.1).out, 0.1);
  near(y, 50, 0.05, 'PID holds a heater at its setpoint');
  const mv = E.move(1000, 400, 800); ok(mv.tTotal === 3 && !mv.triangle && Math.abs(mv.at(3).x - 1000) < 1e-9 && E.move(100, 400, 800).triangle, 'trapezoid and triangle moves');
  const sc = E.schedule([{ name: 'hi', prio: 3, period: 10, run: 2 }, { name: 'lo', prio: 1, period: 20, run: 12 }], 100);
  ok(sc.load === 0.8 && sc.missed.length === 0 && E.schedule([{ name: 'a', prio: 1, period: 10, run: 8 }, { name: 'b', prio: 1, period: 10, run: 8 }], 100).missed.length > 0, 'the scheduler: a load of 80 % fits, 160 % misses deadlines');
  const def = { start: 'RED', states: { RED: { after: { 3000: 'GREEN' }, entry: 'red on' }, GREEN: { after: { 3000: 'YELLOW' }, on: { BUTTON: 'YELLOW' } }, YELLOW: { after: { 1000: 'RED' } } } };
  const m = E.fsm(def);
  ok(m.tick(3500) === 'GREEN' && m.send('BUTTON') && m.state === 'YELLOW' && m.send('BUTTON') === false && m.tick(1200) === 'RED' && m.log.length === 3, 'a state machine with timeouts and an event');
  ok(E.fsmCheck(def).length === 0 && E.fsmCheck({ start: 'A', states: { A: { on: { x: 'B' } }, C: {} } }).length >= 2, 'fsmCheck finds unknown targets and unreachable states');
  ok(E.fsmDiagram(def).transitions.length === 4 && /enum State \{ RED, GREEN, YELLOW \}/.test(E.fsmCode(def, 'cpp')) && /def handle\(event\)/.test(E.fsmCode(def, 'py')), 'a machine as a diagram and as programs');
  ok(C.blocks.parse(E.fsmCode(def, 'blocks')).errors.length === 0 && C.balance(E.fsmCode(def, 'cpp'), 'cpp') === '', 'the generated programs are well formed');
  const g = E.fsm({ start: 'A', states: { A: { on: { go: [{ to: 'B', if: 'ready' }, { to: 'C' }] } }, B: {}, C: {} } }, { guards: { ready: ctx => ctx.ok }, ctx: { ok: false } });
  g.send('go'); ok(g.state === 'C', 'guards choose between transitions');
}

/* ---------------------------------------------------------------- virtual displays */
{
  const fb = G.fb(128, 64); fb.text('A', 0, 0);
  ok(fb.get(0, 1) === 1 && fb.get(2, 0) === 1 && fb.get(0, 0) === 0 && fb.lit() === 18, 'the letter A of the 5 × 7 font');
  fb.clear(); fb.fillRect(10, 10, 4, 3); ok(fb.lit() === 12, 'fillRect'); fb.clear(); fb.line(0, 0, 9, 9); ok(fb.lit() === 10, 'a diagonal line');
  fb.clear(); fb.rect(0, 0, 10, 10); ok(fb.lit() === 36, 'rect outline'); fb.clear(); fb.fillCircle(20, 20, 5); ok(fb.lit() > 70 && fb.lit() < 90, 'fillCircle');
  ok(G.textWidth('Hello', 2) === 60 && G.frameBytes(128, 64, 1) === 1024 && G.frameBytes(320, 240, 16) === 153600, 'text width; frame sizes');
  near(G.busFps(320, 240, 16, 40e6), 31, 0.5, 'an ILI9341 over 40 MHz SPI: about 31 frames a second'); near(G.i2cFps(128, 64, 400000), 40.6, 0.5, 'an SSD1306 over 400 kHz I2C');
  const col = G.fb(8, 8, { depth: 16 }); col.fillRect(0, 0, 8, 8, G.rgb(255, 0, 0)); ok(col.get(3, 3) === 0xFF0000 && G.rgb565(255, 255, 255) === 0xFFFF && G.css(0xFF8800) === '#ff8800', 'colour buffers, RGB565');
  const lcd = G.lcd(16, 2); lcd.print('Temp: 23.5 C'); lcd.setCursor(0, 1); lcd.print('This line is far too long');
  ok(lcd.text() === 'Temp: 23.5 C    \nThis line is far' && lcd.dots(0, 0)[0] === 0b11111, 'a character LCD cuts a long line; the dots of T');
  ok(G.seg7Number(23.5, 4, 1).map(c => c.seg).join() === '0,91,79,109' && G.seg7Number(23.5, 4, 1)[2].dp && G.seg7Number(12345, 4)[0].seg === 0x40, 'seven-segment numbers, the decimal point, overflow as dashes');
  const ui = G.ui(G.fb(128, 64)); ui.screen(); ui.button(10, 20, 40, 14, 'OK', { id: 'ok' });
  ok(ui.hit(20, 25) === 'ok' && ui.hit(100, 50) === null, 'widgets know where they are');
  const cal = { xMin: 200, xMax: 3900, yMin: 240, yMax: 3800 }, r = G.touchRaw(160, 120, cal, 320, 240), p = G.touchMap(r.x, r.y, cal, 320, 240);
  ok(Math.abs(p.x - 160) <= 1 && Math.abs(p.y - 120) <= 1 && G.DISPLAYS.length > 20 && G.display('ssd1306-128x64').w === 128, 'touch calibration there and back; the display catalogue');
}

/* ---------------------------------------------------------------- programs and blocks */
{
  const p = C.blocks.parse('when started\n  set pin (2) as [output v]\nforever\n  if <(read pin (0)) = [LOW v]> then\n    set pin (2) to [HIGH v]\n  else\n    set pin (2) to [LOW v]\n  end\n  wait (0.5) seconds // half a second\nend');
  ok(p.errors.length === 0 && p.scripts.length === 1 && C.blocks.flat(p).length === 7, 'a block program parses');
  ok(C.blocks.flat(p).map(b => b.cat).join() === 'events,pins,control,control,pins,pins,time', 'block categories from their first words');
  ok(C.blocks.parse('forever\n  wait (1 seconds').errors.length === 2 && C.blocks.parse('end').errors.length === 1, 'unbalanced blocks are reported');
  ok(C.blocks.parse('if <(t) > (30)> then\n  print [hot]\nend').errors.length === 0, 'a comparison inside a condition');
  ok(C.blocks.categoryOf('publish (t) to topic [x]') === 'mqtt' && C.blocks.categoryOf('start display [SSD1306]') === 'display' && C.blocks.categoryOf('go to state [RUN]') === 'state', 'more categories');
  ok(/class="sb-b sb-hat"/.test(C.blocks.html('when started\n  print [hi]')), 'blocks as HTML');
  ok(C.balance('void f() { int a[2] = {1, 2}; char c = \'}\'; /* ) */ }', 'cpp') === '' && C.balance('x = [1, 2', 'python') !== '', 'bracket balance');
  ok(C.check({ title: 't', cpp: 'void setup() {}\nvoid loop() {}', py: 'x = 1', blocks: 'when started\n  print [x]' }).errors.length === 0, 'a complete program entry passes');
  ok(C.check({ title: 't', cpp: 'void setup() {}\nvoid loop() {}' }).warnings.length === 2 && C.check({ title: 't', cpp: 'void setup() {}\nvoid loop() {}', na: { py: 'why', blocks: 'why' } }).warnings.length === 0, 'missing languages need a reason');
  ok(C.lint('ledcSetup(0, 5000, 8);', 'cpp').length === 1 && C.lint('ledcAttach(5, 5000, 8);', 'cpp').length === 0 && C.lint('import urequests', 'python').length === 1, 'stale API forms are caught');
  ok(/tk-k/.test(C.highlight('void setup() {}', 'cpp')) && /tk-c/.test(C.highlight('x = 1  # note', 'py')) && C.dedent('\n    a\n      b\n') === 'a\n  b', 'highlighting; dedent');
  ok(/<pre class="code lang-cpp">/.test(H.text('Before\n\n~~~cpp\nint x = 1;\n~~~\n\nafter')), 'a fenced program in a body');
}

console.log((fail ? 'FAILED: ' + fail + ' of ' : 'OK: ') + (pass + fail) + ' checks' + (fail ? '' : ' passed'));
process.exit(fail ? 1 : 0);
