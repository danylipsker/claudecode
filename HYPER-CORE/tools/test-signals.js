/* Tests of the pure parts of the Signal lab (HYPER-CORE/js/ui/esp-signals.js): parsing what the reader types, the models
 * the tabs draw (frames, bits, decoded bytes, the receiver that samples with a wrong clock, CAN arbitration, NEC, 1-Wire
 * scratchpads) checked by decoding the edges again, and every program the lab generates run through Hyper.code.check.
 *
 *   node HYPER-CORE/tools/test-signals.js
 */
'use strict';
const path = require('path');
const { makeContext, loadCore, run } = require('./load');
const ctx = makeContext();
const H = loadCore(ctx);
run(ctx, path.join(__dirname, '..', 'js', 'esp32-calc.js'));
run(ctx, path.join(__dirname, '..', 'js', 'espsym.js'));
H.ui = undefined;
run(ctx, path.join(__dirname, '..', 'js', 'ui', 'esp-signals.js'));
const E = H.esp, C = H.code, L = H.espTools.signals.lib;
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  FAIL  ' + name); } };
const same = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name + '  (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')');
const near = (a, b, tol, name) => ok(Math.abs(a - b) <= tol, name + '  (got ' + a + ', want ' + b + ')');
const checkCode = (entry, name) => {
  const r = C.check(entry);
  ok(r.errors.length === 0, name + ': code entry has errors ' + r.errors.join('; '));
  ok(r.warnings.length === 0, name + ': code entry has warnings ' + r.warnings.join('; '));
};

/* ---------------------------------------------------------------- what the reader types */
same(L.parseHex('0x48, 65 6c zz'), { bytes: [0x48, 0x65, 0x6c], bad: ['zz'] }, 'parseHex: prefixes, commas, a bad token');
same(L.parseHex('48656C').bytes, [0x48, 0x65, 0x6c], 'parseHex: pairs without spaces');
same(L.parseHex('').bytes, [], 'parseHex: empty');
same(L.textBytes('Hi\\n'), [72, 105, 10], 'textBytes: \\n');
same(L.textBytes('\\x41\\0\\\\'), [65, 0, 92], 'textBytes: \\xHH, \\0 and \\\\');
same(L.textBytes('é€'), [195, 169, 226, 130, 172], 'textBytes: UTF-8');
same(L.escBytes([72, 34, 92, 10, 13, 0, 200]), 'H\\"\\\\\\n\\r\\x00\\xc8', 'escBytes');

/* ---------------------------------------------------------------- UART */
const decodeUart = (edges, t0, tb, nb, parity, stop, n) => {          // a plain receiver: start edge, then the middle of each bit
  const out = [];
  let t = t0;
  for (let i = 0; i < n; i++) {
    let b = 0;
    for (let k = 0; k < nb; k++) b |= E.proto.levelAt(edges, t + (1.5 + k) * tb) << k;
    out.push(b);
    t += (1 + nb + (parity === 'none' ? 0 : 1) + stop) * tb;
  }
  return out;
};
{
  const base = { text: 'Hello', mode: 'text', crlf: false, baud: 9600, bits: 8, parity: 'none', stop: 1, gap: 0, err: 0 };
  const m = L.uartModel(base);
  same(m.bytes, [72, 101, 108, 108, 111], 'uart: Hello is five bytes');
  same(decodeUart(m.traces[0].edges, 0, m.tb, 8, 'none', 1, 5), m.bytes, 'uart: the edges decode back to the bytes');
  ok(m.wrong === 0 && m.frameBits === 10, 'uart: a perfect receiver reads everything, 10 bits per frame');
  near(m.tEnd, 50 / 9600, 1e-12, 'uart: five frames of ten bits');
  ok(L.uartModel(Object.assign({}, base, { err: 3 })).wrong === 0, 'uart: +3 % is still fine at 8N1');
  ok(L.uartModel(Object.assign({}, base, { err: 6 })).wrong > 0, 'uart: +6 % breaks 8N1');
  ok(L.uartModel(Object.assign({}, base, { err: -6 })).wrong > 0, 'uart: −6 % breaks 8N1');
  ok(L.uartModel(Object.assign({}, base, { err: 6, gap: 6, stop: 2 })).wrong <= L.uartModel(Object.assign({}, base, { err: 6 })).wrong, 'uart: a longer stop does not make it worse');
  const p = L.uartModel(Object.assign({}, base, { parity: 'even', text: 'A' }));
  same(p.frames[0].bits.map(b => b.kind), ['start', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'data', 'parity', 'stop'], 'uart: start, 8 data, parity, stop');
  near(p.frames[0].bits.find(b => b.kind === 'parity').v, 0, 0, 'uart: 0x41 has two ones, so even parity is 0');
  ok(L.uartModel(Object.assign({}, base, { parity: 'odd', err: 0, text: 'AB' })).wrong === 0, 'uart: odd parity checks out');
  const five = L.uartModel(Object.assign({}, base, { bits: 5, text: '\\xFF' }));
  ok(five.frames[0].byte === 31 && five.frameBits === 7, 'uart: 5 data bits keep the low five bits');
  ok(L.uartModel(Object.assign({}, base, { text: '' })).bytes[0] === 0x55, 'uart: nothing typed shows 0x55');
  ok(L.uartModel(Object.assign({}, base, { text: 'x'.repeat(80) })).bytes.length === 24, 'uart: at most 24 bytes');
  near(L.uartModel(Object.assign({}, base, { baud: 921600 })).act, 921526.3, 1, 'uart: the ESP32 divider makes 921526 baud');
  for (const s of [base, { text: '48 65 7A', mode: 'hex', crlf: true, baud: 115200, bits: 7, parity: 'odd', stop: 2, gap: 3, err: -2 }, { text: 'a"b\\\\c\\x01', mode: 'text', crlf: false, baud: 9600, bits: 8, parity: 'even', stop: 1, gap: 0, err: 0 }, { text: '00 FF', mode: 'hex', crlf: false, baud: 230400, bits: 6, parity: 'none', stop: 1, gap: 0, err: 0 }]) {
    const mm = L.uartModel(s);
    checkCode(L.uartCode(s, mm.bytes), 'uart code ' + s.text);
  }
}

/* ---------------------------------------------------------------- I2C: decode SCL and SDA again, independently */
const decodeI2C = (scl, sda) => {
  const ev = scl.map(e => ['c', e[0], e[1]]).concat(sda.map(e => ['d', e[0], e[1]])).sort((a, b) => a[1] - b[1] || (a[0] === 'c' ? -1 : 1));
  let sc = scl[0][1], sd = sda[0][1], bits = [];
  const out = [];
  const flush = () => { while (bits.length >= 9) { const b = bits.splice(0, 9); out.push('x' + b.slice(0, 8).reduce((a, v) => a * 2 + v, 0).toString(16).toUpperCase().padStart(2, '0') + (b[8] ? 'N' : 'A')); } };
  for (const [w, , v] of ev) {
    if (w === 'd') {
      if (sc === 1 && sd === 1 && v === 0) { flush(); out.push('S'); bits = []; }
      else if (sc === 1 && sd === 0 && v === 1) { flush(); out.push('P'); bits = []; }
      sd = v;
    } else { if (v === 1 && sc === 0) bits.push(sd); sc = v; flush(); }
  }
  return out;
};
{
  const base = { part: 0x3C, addr: 0x3C, mode: 'write', data: '00 AF', reg: 0x75, hz: 100000, nack: false };
  const w = L.i2cModel(base);
  same(decodeI2C(w.scl, w.sda), ['S', 'x78A', 'x00A', 'xAFA', 'P'], 'i2c: write 0x3C, bytes 00 AF decodes to S, 0x78+A, 00+A, AF+A, P');
  const r = L.i2cModel(Object.assign({}, base, { mode: 'read', addr: 0x68, data: '12 34' }));
  same(decodeI2C(r.scl, r.sda), ['S', 'xD1A', 'x12A', 'x34N', 'P'], 'i2c: read 0x68, two bytes, the last one NACKed');
  const n = L.i2cModel(Object.assign({}, base, { nack: true }));
  same(decodeI2C(n.scl, n.sda), ['S', 'x78N', 'P'], 'i2c: nobody answers: address NACK then STOP');
  const g = L.i2cModel(Object.assign({}, base, { mode: 'reg', addr: 0x68, reg: 0x75, data: '12 34' }));
  same(decodeI2C(g.scl, g.sda), ['S', 'xD0A', 'x75A', 'S', 'xD1A', 'x12A', 'x34N', 'P'], 'i2c: register read: write the register, REPEATED start, read, one STOP');
  ok(g.marks.some(m => m.texts[0] === 'Sr'), 'i2c: the repeated start is labelled Sr');
  ok(g.scl.every((e, i) => i === 0 || e[0] > g.scl[i - 1][0]) && g.sda.every((e, i) => i === 0 || e[0] > g.sda[i - 1][0]), 'i2c: edge lists stay in time order');
  const gn = L.i2cModel(Object.assign({}, base, { mode: 'reg', nack: true }));
  same(decodeI2C(gn.scl, gn.sda), ['S', 'x78N', 'P'], 'i2c: register read with nobody home stops after the address');
  near(w.tb, 1e-5, 1e-15, 'i2c: 100 kHz is 10 µs per bit');
  const w4 = L.i2cModel(Object.assign({}, base, { hz: 400000 }));
  near(w4.tXfer / w.tXfer, 0.25, 0.02, 'i2c: 400 kHz is four times faster');
  ok(L.i2cModel(Object.assign({}, base, { data: '' })).data.length === 1, 'i2c: no data typed still sends one byte');
  for (const mode of ['write', 'read', 'reg']) for (const nack of [false, true]) for (const addr of [0x3C, 0x13]) {
    const s = Object.assign({}, base, { mode, nack, addr, data: '01 02 03' });
    checkCode(L.i2cCode(s, L.i2cModel(s)), 'i2c code ' + mode + (nack ? ' nack ' : ' ') + addr);
  }
}

/* ---------------------------------------------------------------- SPI: read the bytes back at the sampling edges */
{
  const readSpi = (m, lsb) => {
    const rd = edges => {
      const bits = m.samples.map(t => E.proto.levelAt(edges, t + 1e-12)), bytes = [];
      for (let k = 0; k < bits.length; k += 8) { let b = 0; for (let i = 0; i < 8; i++) b |= bits[k + i] << (lsb ? i : 7 - i); bytes.push(b); }
      return bytes;
    };
    return { mosi: rd(m.X.mosi), miso: rd(m.X.miso) };
  };
  for (const mode of [0, 1, 2, 3]) for (const lsb of [false, true]) {
    const s = { mode, hz: 1000000, out: '9F A5 00 FF', inn: '00 EF 40 18', lsb };
    const m = L.spiModel(s), r = readSpi(m, lsb);
    same(r.mosi, [0x9F, 0xA5, 0x00, 0xFF], 'spi mode ' + mode + (lsb ? ' LSB' : ' MSB') + ': MOSI read at the sampling edges');
    same(r.miso, [0x00, 0xEF, 0x40, 0x18], 'spi mode ' + mode + (lsb ? ' LSB' : ' MSB') + ': MISO read at the sampling edges');
    ok(m.samples.length === 32, 'spi mode ' + mode + ': one sampling edge per bit');
    ok(m.rising === (mode === 0 || mode === 3), 'spi mode ' + mode + ': rising-edge sampling only in modes 0 and 3');
    checkCode(L.spiCode(s, m), 'spi code mode ' + mode);
  }
  const m = L.spiModel({ mode: 0, hz: 1e6, out: '12', inn: '', lsb: false });
  same(m.inn, [0], 'spi: missing MISO bytes read as 0');
  near(m.tb, 1e-6, 1e-15, 'spi: 1 MHz is one microsecond per bit');
}

/* ---------------------------------------------------------------- PWM */
{
  const base = { kind: 'duty', freq: 5000, bits: 8, duty: 50, clock: 80, filter: false, tau: 6, angle: 90, range: 'nom' };
  const m = L.pwmModel(base);
  ok(m.maxBits === 13 && !m.over && m.bits === 8, 'pwm: 5 kHz on an 80 MHz timer allows 13 bits, 8 fit');
  ok(m.raw === 128 && m.full === 255, 'pwm: 50 % of 8 bits is duty value 128 of 255');
  near(m.avg, 3.3 * 128 / 255, 1e-9, 'pwm: the average voltage follows the quantised duty');
  ok(L.pwmModel(Object.assign({}, base, { freq: 1e6 })).over && L.pwmModel(Object.assign({}, base, { freq: 1e6 })).maxBits === 6, 'pwm: 1 MHz allows only 6 bits, 8 do not fit');
  ok(L.pwmModel(Object.assign({}, base, { clock: 40, freq: 100 })).maxBits === 14, 'pwm: the 14-bit timers stop at 14 bits');
  ok(L.pwmModel(Object.assign({}, base, { clock: 40, freq: 4e7 })).over, 'pwm: at the timer clock itself not even one bit fits');
  near(L.pwmModel(Object.assign({}, base, { bits: 2, duty: 40 })).frac, 1 / 3, 1e-9, 'pwm: at 2 bits 40 % can only be 1/3');
  const sv = L.pwmModel(Object.assign({}, base, { kind: 'servo' }));
  ok(sv.freq === 50 && Math.abs(sv.sv.us - 1500) < 1e-9 && sv.raw === 4915 && sv.bits === 16, 'pwm: a servo at 90° gets 1500 µs, duty 4915 of 65535 at 16 bits');
  ok(L.pwmModel(Object.assign({}, base, { kind: 'servo', clock: 40 })).bits === 14, 'pwm: a servo on a 14-bit timer uses 14 bits');
  near(L.pwmModel(Object.assign({}, base, { kind: 'servo', angle: 0, range: 'wide' })).sv.us, 500, 1e-9, 'pwm: servo range 500–2500 µs, angle 0');
  const f = L.pwmModel(Object.assign({}, base, { filter: true, tau: 3 }));
  const last = f.rc.pts.filter(p => p[0] >= 63 * f.T0), lo = Math.min(...last.map(p => p[1])), hi = Math.max(...last.map(p => p[1]));
  near(hi - lo, f.rc.ripple, 0.01 * 3.3, 'pwm: the closed-form ripple matches the simulated filter');
  near((hi + lo) / 2, f.avg, 0.12, 'pwm: the filter settles round the average');
  ok(f.traces.length === 3 && L.pwmModel(base).traces.length === 2, 'pwm: the RC trace only with the filter');
  for (const s of [base, Object.assign({}, base, { kind: 'servo', angle: 33, range: 'ard' }), Object.assign({}, base, { filter: true, freq: 20000, bits: 10, duty: 12.5 }), Object.assign({}, base, { duty: 0 }), Object.assign({}, base, { duty: 100, bits: 1 })]) {
    const mm = L.pwmModel(s);
    checkCode(L.pwmCode(s, mm), 'pwm code ' + s.kind + ' ' + s.duty);
  }
}

/* ---------------------------------------------------------------- WS2812 */
{
  const s = { n: 3, sel: 0, colors: [[255, 0, 0], [0, 128, 5], [1, 2, 250], [9, 9, 9], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] };
  const m = L.pixelsModel(s), TB = 1.25e-6;
  // read the pulses: a bit is 1 if the line is still high 0.6 µs after its rising edge
  const bytes = [];
  for (let i = 0; i < 9; i++) { let b = 0; for (let k = 0; k < 8; k++) b = b * 2 + E.proto.levelAt(m.W.edges, (i * 8 + k) * TB + 0.6e-6); bytes.push(b); }
  same(bytes, [0, 255, 0, 128, 0, 5, 2, 1, 250], 'pixels: three LEDs come out green, red, blue each, most significant bit first');
  ok(E.proto.levelAt(m.W.edges, m.tData + 25e-6) === 0, 'pixels: the line rests low in the reset gap');
  near(m.W.t1 - m.tData, 50e-6, 1e-12, 'pixels: a reset gap of 50 µs');
  ok(m.traces[0].marks.length === 72 && m.traces[1].marks.length === 9 && m.traces[2].marks.length === 4, 'pixels: 72 bit marks, 9 byte marks, 3 LEDs and the reset');
  ok(L.pixelsModel(Object.assign({}, s, { n: 8 })).tData > m.tData, 'pixels: more LEDs take longer');
  checkCode(L.pixelsCode(s, m), 'pixels code 3');
  checkCode(L.pixelsCode(Object.assign({}, s, { n: 1 }), L.pixelsModel(Object.assign({}, s, { n: 1 }))), 'pixels code 1');
}

/* ---------------------------------------------------------------- CAN: de-stuff, parse and check the CRC independently */
{
  const crc15 = bits => { let crc = 0; for (const b of bits) { const nx = b ^ ((crc >> 14) & 1); crc = (crc << 1) & 0x7FFF; if (nx) crc ^= 0x4599; } return crc; };
  const parseCan = (edges, tb) => {
    const raw = []; for (let i = 0; i < 170; i++) raw.push(E.proto.levelAt(edges, (i + 0.5) * tb));
    const bits = [], num = (a, n) => { let v = 0; for (let i = 0; i < n; i++) v = v * 2 + bits[a + i]; return v; };
    let run = 0, last = -1, i = 0, total = 1e9;
    while (i < raw.length && bits.length < total) {                  // stuffing runs from SOF to the end of the CRC only
      const v = raw[i++];
      if (run === 5) { if (v === last) return { error: 'stuff error at ' + (i - 1) }; last = v; run = 1; continue; }   // a stuffed bit: drop it
      bits.push(v);
      if (v === last) run++; else { run = 1; last = v; }
      if (bits.length === 19) total = 19 + 8 * Math.min(8, num(15, 4)) + 15;
    }
    if (run === 5) i++;                                              // a stuffed bit may follow the last CRC bit
    const id = num(1, 11), dlc = num(15, 4), data = [];
    for (let k = 0; k < Math.min(8, dlc); k++) data.push(num(19 + 8 * k, 8));
    const crcAt = 19 + 8 * data.length, crc = num(crcAt, 15);
    return { sof: bits[0], id, dlc, data, crc, crcOk: crc15(bits.slice(0, crcAt)) === crc, delim: raw[i], ackSlot: raw[i + 1] };
  };
  const base = { id: 0x123, data: 'AB CD', rate: 500000, ack: true, kind: 'one', id2: 0x120 };
  for (const s of [base, Object.assign({}, base, { id: 0x7FF, data: 'FF FF FF FF FF FF FF FF' }), Object.assign({}, base, { id: 0, data: '00 00 00' }), Object.assign({}, base, { id: 0x555, data: '' }), Object.assign({}, base, { id: 0x2AA, data: '55 AA 01' })]) {
    const m = L.canModel(s), r = parseCan(m.F.edges, m.F.tb);
    ok(!r.error && r.sof === 0 && r.id === s.id && r.dlc === Math.min(8, L.parseHex(s.data).bytes.length) && r.crcOk, 'can: id ' + s.id.toString(16) + ' data "' + s.data + '" decodes, CRC checks (' + JSON.stringify(r) + ')');
    same(r.data, L.parseHex(s.data).bytes.slice(0, 8), 'can: data bytes of "' + s.data + '"');
    ok(r.ackSlot === 0, 'can: a receiver acknowledges by pulling the ACK slot low');
    ok(m.F.stuffed === m.F.bits.filter(b => b.stuffed).length, 'can: stuffed bits are counted');
    ok(m.fields.length >= 12 - (s.data === '' ? 1 : 0), 'can: the fields row has the fields');
  }
  ok(L.canModel(Object.assign({}, base, { id: 0x7FF, data: 'FF FF FF FF FF FF FF FF' })).F.stuffed > 0, 'can: a run of ones needs stuffing');
  const na = L.canModel(Object.assign({}, base, { ack: false }));
  ok(parseCan(na.F.edges, na.F.tb).ackSlot === 1, 'can: with nobody home the ACK slot stays recessive');
  // arbitration: 0x123 against 0x120: the first difference is identifier bit 1, where 0x123 sends 1 and loses
  const arb = L.canModel(Object.assign({}, base, { kind: 'arb' }));
  ok(arb.loser === 'A' && arb.lose > 0 && arb.A.bits[arb.lose].field === 'ID', 'can: the higher identifier loses arbitration');
  const w = parseCan(edgesFromBus(arb), arb.A.tb);
  ok(w.id === 0x120 && w.crcOk, 'can: the bus carries the winner\'s frame intact (' + JSON.stringify(w) + ')');
  ok(L.canModel(Object.assign({}, base, { kind: 'arb', id: 0x010, id2: 0x7F0 })).loser === 'B', 'can: 0x010 beats 0x7F0');
  ok(L.canModel(Object.assign({}, base, { kind: 'arb', id2: 0x123 })).lose >= 0 && L.canModel(Object.assign({}, base, { kind: 'arb', id2: 0x123 })).loser === null, 'can: equal identifiers are not arbitration');
  for (const s of [base, Object.assign({}, base, { kind: 'arb' }), Object.assign({}, base, { rate: 125000, data: '' }), Object.assign({}, base, { rate: 1000000, id: 0 })]) checkCode(L.canCode(s, L.canModel(s)), 'can code ' + s.rate);
  function edgesFromBus(m) { const e = [[-1, 1]]; let last = 1; m.bus.forEach((v, i) => { if (v !== last) { e.push([i * m.A.tb, v]); last = v; } }); return e; }
}

/* ---------------------------------------------------------------- inputs: button, encoder, NEC */
{
  const base = { what: 'button', bounce: 5, win: 30, tau: 2, presses: 'two', dir: 1, detents: 3, speed: 150, poll: 0, addr: 0x00, cmd: 0x45, noise: false };
  const b0 = L.buttonModel(Object.assign({}, base, { bounce: 0 }));
  ok(b0.rawN === 2 && b0.real === 2, 'button: an ideal contact is counted exactly');
  const b5 = L.buttonModel(base);
  ok(b5.rawN > b5.real, 'button: with 5 ms of bounce, counting raw edges counts too many (' + b5.rawN + ')');
  ok(L.buttonModel(Object.assign({}, base, { win: 10 })).softN === 2, 'button: a 10 ms window beats a 5 ms bounce and keeps the 15 ms tap');
  ok(L.buttonModel(base).softN === 1, 'button: a 30 ms window swallows the 15 ms tap');
  ok(L.buttonModel(Object.assign({}, base, { presses: 'one', win: 30 })).softN === 1, 'button: one press, one count');
  ok(L.buttonModel(Object.assign({}, base, { win: 0 })).softN > 2, 'button: no window lets the chatter through');
  ok(b5.rcN === b5.real, 'button: a 2 ms RC filter also counts every press once (' + b5.rcN + ')');
  ok(L.buttonModel(Object.assign({}, base, { tau: 0.1 })).rcN > b5.real, 'button: a 0.1 ms RC filter is too fast to help');
  ok(b5.pts.every(p => Number.isFinite(p[0]) && p[1] >= -1e-9 && p[1] <= 1 + 1e-9), 'button: the RC voltage stays between 0 and Vcc');
  // the encoder
  for (const dir of [1, -1]) {
    const m = L.encoderModel(Object.assign({}, base, { dir, poll: 0 }));
    ok(m.count === m.counts && m.counts === 12 * dir && m.bad === 0, 'encoder: an interrupt on every edge counts ' + 12 * dir + ' (got ' + m.count + ')');
    ok(L.encoderModel(Object.assign({}, base, { dir, poll: 1e-4 })).count === 12 * dir, 'encoder: looking every 0.1 ms at 150 counts/s loses nothing');
  }
  const slow = L.encoderModel(Object.assign({}, base, { poll: 2e-2 }));
  ok(slow.count !== slow.counts && slow.bad > 0, 'encoder: looking every 20 ms at 150 counts/s loses steps (counted ' + slow.count + ' of ' + slow.counts + ')');
  ok(L.encoderModel(Object.assign({}, base, { poll: 1e-3, speed: 20000 })).count !== 12, 'encoder: spinning at 20000 counts/s beats a 1 ms poll');
  same(L.ENC_STEP.length, 16, 'encoder: the step table has 16 entries');
  // NEC: the local encoder equals the engine's, and the hand decoder of the sketch reads it back
  for (const [a, c] of [[0x00, 0x45], [0xFF, 0x00], [0x5A, 0xA5]]) {
    const F = L.necFrame(L.NEC_BYTES(a, c), 0), N = E.proto.nec(a, c);
    same(F.edges, N.edges, 'nec: the local encoder equals the engine for ' + a + ',' + c);
    const falls = L.irModel(Object.assign({}, base, { addr: a, cmd: c })).traces[1].edges.filter((e, i, arr) => i > 0 && e[1] === 0).map(e => e[0] * 1e6);   // falling edges of the receiver pin, µs
    let last = 0, frame = 0, bitCount = -1, ready = false;
    for (const now of falls) {                                                    // the sketch's interrupt handler, line by line
      const dt = now - last; last = now;
      if (dt > 12000 && dt < 15000) { bitCount = 0; frame = 0; continue; }
      const n = bitCount; if (n < 0) continue;
      let f = frame >>> 1; if (dt > 1900) f = (f | 0x80000000) >>> 0;
      frame = f; bitCount = n + 1; if (n + 1 === 32) { bitCount = -1; ready = true; }
    }
    ok(ready && (frame & 255) === a && ((frame >>> 16) & 255) === c && ((frame >>> 8) & 255) === (~a & 255) && ((frame >>> 24) & 255) === (~c & 255), 'nec: the sketch decodes address ' + a + ' command ' + c + ' (frame ' + frame.toString(16) + ')');
  }
  const bad = L.irModel(Object.assign({}, base, { noise: true }));
  ok(!bad.ok && L.irModel(base).ok, 'nec: a damaged bit fails the inverse check, a clean frame passes');
  for (const w of ['button', 'encoder', 'ir']) for (const extra of [{}, { win: 0, bounce: 0, poll: 1e-3, noise: true, dir: -1 }]) {
    const s = Object.assign({}, base, { what: w }, extra), m = w === 'encoder' ? L.encoderModel(s) : w === 'ir' ? L.irModel(s) : L.buttonModel(s);
    checkCode(w === 'encoder' ? L.encoderCode(s) : w === 'ir' ? L.irCode(s) : L.buttonCode(s), 'inputs code ' + w);
  }
}

/* ---------------------------------------------------------------- 1-Wire: a DS18B20 exchange, decoded from the low pulses */
{
  const decodeOw = edges => {
    const lows = []; let st = null;
    for (const [t, v] of edges) { if (v === 0 && st == null) st = t; else if (v === 1 && st != null) { lows.push([st, t - st]); st = null; } }
    const segs = []; let i = 0;
    while (i < lows.length) {
      if (lows[i][1] < 400e-6) { i++; continue; }
      const seg = { presence: false, bytes: [] }; i++;
      if (i < lows.length && lows[i][1] >= 50e-6 && lows[i][1] <= 240e-6 && lows[i][0] - (lows[i - 1][0] + lows[i - 1][1]) < 100e-6) { seg.presence = true; i++; }
      const bits = [];
      while (i < lows.length && lows[i][1] < 400e-6) { bits.push(lows[i][1] < 15e-6 ? 1 : 0); i++; }
      for (let k = 0; k + 8 <= bits.length; k += 8) seg.bytes.push(bits.slice(k, k + 8).reduce((a, b, j) => a | (b << j), 0));
      segs.push(seg);
    }
    return segs;
  };
  same(L.owScratch(85, 12), [0x50, 0x05, 0x4B, 0x46, 0x7F, 0xFF, 0x0C, 0x10, 0x1C], 'onewire: the power-on scratchpad of the datasheet (85 °C, CRC 0x1C)');
  same(L.owScratch(25.0625, 12).slice(0, 2), [0x91, 0x01], 'onewire: 25.0625 °C is 0x0191');
  const base = { temp: 25.0625, res: 12, missing: false, corrupt: false };
  const m = L.owModel(base), segs = decodeOw(m.edges);
  ok(segs.length === 2 && segs[0].presence && segs[1].presence, 'onewire: two resets, each answered by a presence pulse');
  same(segs[0].bytes, [0xCC, 0x44], 'onewire: Skip ROM, Convert T');
  same(segs[1].bytes, [0xCC, 0xBE].concat(L.owScratch(25.0625, 12)), 'onewire: Skip ROM, Read Scratchpad, then the nine scratchpad bytes');
  ok(m.crcOk && Math.abs(m.T - 25.0625) < 1e-9, 'onewire: the CRC matches and the temperature reads back');
  near(L.owModel(Object.assign({}, base, { temp: -10.125 })).T, -10.125, 1e-9, 'onewire: a negative temperature (two\'s complement)');
  near(L.owModel(Object.assign({}, base, { temp: 25.3, res: 9 })).T, 25.0, 1e-9, 'onewire: at 9 bits the low bits are undefined and read 0');
  near(L.owModel(Object.assign({}, base, { res: 9 })).conv, 0.09375, 1e-9, 'onewire: 9 bits convert in 93.75 ms');
  const c = L.owModel(Object.assign({}, base, { corrupt: true }));
  ok(!c.crcOk && decodeOw(c.edges)[1].bytes[3] !== L.owScratch(25.0625, 12)[1], 'onewire: a damaged bit fails the CRC check');
  const none = L.owModel(Object.assign({}, base, { missing: true })), ns = decodeOw(none.edges);
  ok(ns.length === 1 && !ns[0].presence && none.edges.length === 3, 'onewire: with no sensor there is a reset and no presence pulse');
  ok(m.slots.length === 8 * 13 && m.samples.length === 104, 'onewire: thirteen bytes (two, then two and nine), 104 slots');
  for (const s of [base, Object.assign({}, base, { res: 10, temp: -3 }), Object.assign({}, base, { missing: true }), Object.assign({}, base, { corrupt: true })]) checkCode(L.owCode(s), 'onewire code ' + s.res + (s.missing ? ' missing' : '') + (s.corrupt ? ' corrupt' : ''));
}

/* ---------------------------------------------------------------- fuzz: random settings never give NaN, undefined or a bad program */
{
  let seed = 12345;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const pick = a => a[Math.floor(rnd() * a.length)], between = (a, b) => a + rnd() * (b - a), int = (a, b) => Math.floor(between(a, b + 1));
  const junk = () => pick(['', 'Hello', '48 65 6C', 'zz 1', '0x', '\\n\\r\\x', 'é€😀', 'FF FF FF FF FF FF FF FF FF FF', '  ', '12,34;56', 'x'.repeat(50)]);
  const BAD = /NaN|Infinity|undefined|\[object/;
  const strings = (o, path, out) => { if (typeof o === 'string') out.push([path, o]); else if (o && typeof o === 'object') for (const k of Object.keys(o)) if (typeof o[k] !== 'function') strings(o[k], path + '.' + k, out); return out; };
  const finite = (m, name) => {
    for (const tr of m.traces) {
      if (tr.edges) ok(tr.edges.every((e, i) => Number.isFinite(e[0]) && (e[1] === 0 || e[1] === 1) && (i === 0 || e[0] >= tr.edges[i - 1][0] - 1e-15)), name + ': edges finite and in order (' + tr.label + ')');
      if (tr.pts) ok(tr.pts.every(p => Number.isFinite(p[0]) && Number.isFinite(p[1])), name + ': points finite (' + tr.label + ')');
      ok(tr.marks.every(k => Number.isFinite(k.t0) && Number.isFinite(k.t1) && k.t1 >= k.t0 && k.texts.length), name + ': marks sane (' + tr.label + ')');
    }
    ok(Number.isFinite(m.t0) && Number.isFinite(m.t1) && m.t1 > m.t0 && m.focus && m.focus.span > 0, name + ': a time range and a focus');
    const bad = strings(m.ro.v, 'ro', []).filter(([, s]) => BAD.test(s));
    ok(bad.length === 0, name + ': readout text has NaN or undefined ' + JSON.stringify(bad.slice(0, 2)));
    ok(!m.hover || !BAD.test(m.hover(m.t0 + (m.t1 - m.t0) * rnd())), name + ': hover text');
  };
  for (let i = 0; i < 120; i++) {
    let s = { text: junk(), mode: pick(['text', 'hex']), crlf: rnd() < 0.3, baud: pick([9600, 115200, 921600]), bits: int(5, 8), parity: pick(['none', 'even', 'odd']), stop: int(1, 2), gap: int(0, 12), err: between(-12, 12) };
    let m = L.uartModel(s); finite(m, 'fuzz uart'); checkCode(L.uartCode(s, m.bytes), 'fuzz uart code');
    s = { part: 0x3C, addr: int(8, 119), mode: pick(['write', 'read', 'reg']), data: junk(), reg: int(0, 255), hz: pick([100000, 400000]), nack: rnd() < 0.3 };
    m = L.i2cModel(s); finite(m, 'fuzz i2c'); checkCode(L.i2cCode(s, m), 'fuzz i2c code');
    s = { mode: int(0, 3), hz: pick([100000, 1e6, 8e7]), out: junk(), inn: junk(), lsb: rnd() < 0.5 };
    m = L.spiModel(s); finite(m, 'fuzz spi'); checkCode(L.spiCode(s, m), 'fuzz spi code');
    s = { kind: pick(['duty', 'servo']), freq: Math.exp(between(0, Math.log(4e7))), bits: int(1, 16), duty: between(0, 100), clock: pick([80, 40]), filter: rnd() < 0.5, tau: Math.exp(between(Math.log(0.2), Math.log(40))), angle: int(0, 180), range: pick(['nom', 'ard', 'wide']) };
    m = L.pwmModel(s); finite(m, 'fuzz pwm'); checkCode(L.pwmCode(s, m), 'fuzz pwm code');
    s = { n: int(1, 8), sel: 0, colors: Array.from({ length: 8 }, () => [int(0, 255), int(0, 255), int(0, 255)]) };
    m = L.pixelsModel(s); finite(m, 'fuzz pixels'); checkCode(L.pixelsCode(s, m), 'fuzz pixels code');
    s = { id: int(0, 2047), data: junk(), rate: pick([125000, 250000, 500000, 1000000]), ack: rnd() < 0.5, kind: pick(['one', 'arb']), id2: int(0, 2047) };
    m = L.canModel(s); finite(m, 'fuzz can'); checkCode(L.canCode(s, m), 'fuzz can code');
    s = { what: 'button', bounce: between(0, 20), win: int(0, 60), tau: Math.exp(between(Math.log(0.1), Math.log(20))), presses: pick(['one', 'two']), dir: pick([1, -1]), detents: int(1, 8), speed: Math.exp(between(Math.log(10), Math.log(20000))), poll: pick([0, 1e-4, 1e-3, 5e-3, 2e-2]), addr: int(0, 255), cmd: int(0, 255), noise: rnd() < 0.5 };
    m = L.buttonModel(s); finite(m, 'fuzz button'); checkCode(L.buttonCode(s), 'fuzz button code');
    m = L.encoderModel(s); finite(m, 'fuzz encoder'); checkCode(L.encoderCode(s), 'fuzz encoder code');
    m = L.irModel(s); finite(m, 'fuzz ir'); checkCode(L.irCode(s), 'fuzz ir code');
    s = { temp: between(-55, 125), res: pick([9, 10, 11, 12]), missing: rnd() < 0.2, corrupt: rnd() < 0.3 };
    m = L.owModel(s); finite(m, 'fuzz onewire'); checkCode(L.owCode(s), 'fuzz onewire code');
  }
}

console.log(fail ? fail + ' FAILED, ' + pass + ' passed' : 'OK: ' + pass + ' checks passed');
process.exit(fail ? 1 : 0);
