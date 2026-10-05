/* Tests of the models behind the Calculators of Hyper ESP32 (HYPER-CORE/js/ui/esp-calc.js): each model is run on a
 * hand-worked case, then on thousands of random settings across the ranges of its controls, and nothing may come out
 * as NaN or Infinity. The pictures and pages are exercised by tools/labtest.js.
 *
 *   node HYPER-CORE/tools/test-espcalc.js
 */
'use strict';
const path = require('path');
const { loadCore, run } = require('./load');
const H = loadCore();
H.espTools = {};
run(H._ctx, path.join(__dirname, '..', 'js', 'ui', 'esp-calc.js'));
const E = H.esp, C = H.code, M = H.espTools.espcalc.model;
let pass = 0, fail = 0;
/* a generated program must pass the same check as the programs of the pages */
const clean = (e, name) => { const r = C.check(e); ok(r.errors.length === 0 && r.warnings.length === 0, name + ' passes the code check ' + JSON.stringify(r)); };
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  FAIL  ' + name); } };
const near = (a, b, tol, name) => ok(Math.abs(a - b) <= tol, name + '  (got ' + a + ', want ' + b + ')');

/* every number in a result must be finite */
function finite(x, where, seen) {
  seen = seen || new Set();
  if (typeof x === 'number') return Number.isFinite(x) ? null : where + ' = ' + x;
  if (x && typeof x === 'object') {
    if (seen.has(x)) return null; seen.add(x);
    if (x.chip && x.chip.id !== undefined && where === '') { /* the catalogue record is data, not a result */ }
    for (const k of Object.keys(x)) { if (k === 'chip' || k === 'cell' || k === 'u' || k === 'rows' || k === 'csv') continue; const r = finite(x[k], where + '.' + k, seen); if (r) return r; }
  }
  return null;
}
const rnd = (() => { let s = 12345; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; })();
const lin = (a, b) => a + (b - a) * rnd(), log = (a, b) => a * Math.pow(b / a, rnd()), pick = xs => xs[Math.floor(rnd() * xs.length)];
function fuzz(name, make, model, n) {
  for (let i = 0; i < (n || 1500); i++) {
    const v = make();
    let r;
    try { r = model(v); } catch (e) { ok(false, name + ' throws ' + e.message + ' for ' + JSON.stringify(v)); return; }
    const bad = finite(r, '');
    if (bad) { ok(false, name + ' gives ' + bad + ' for ' + JSON.stringify(v)); return; }
  }
  ok(true, name + ' survives random settings');
}

/* ---------------------------------------------------------------- battery */
const bat = { chip: 'esp32-c3', cell: '18650', cap: 1000, usable: 80, sd: true, period: 600, sleepUa: 5, q: 0.03, wakeMa: 87, wakeS: 1.5, txMa: 335, txS: 0.05, xa: false, xaMa: 15, xaS: 3, xb: false, xbMa: 5, xbS: 10 };
{
  const m = M.battery(bat);
  // charge of one cycle: 5 µA for 598.45 s, 87 mA for 1.5 s, 335 mA for 0.05 s -> 150.2 mAs; plus the board's 0.03 mA
  near(m.dc.avg, (0.005 * 598.45 + 87 * 1.5 + 335 * 0.05) / 600, 1e-6, 'battery: average current of the chip phases');
  near(m.avg, m.dc.avg + 0.03, 1e-9, 'battery: the board adds its own current');
  near(m.life.days, 2400 / (m.avg + 0.03 * 3000 / 720) / 24, 0.01, 'battery: days from capacity, average and self-discharge');
  near(m.parts.reduce((a, p) => a + p.share, 0), 1, 1e-9, 'battery: the shares add up to one');
  ok(m.parts.find(p => p.key === 'wake').share > m.parts.find(p => p.key === 'tx').share, 'battery: connecting costs more than the transmit burst');
  ok(M.battery(Object.assign({}, bat, { q: 5 })).parts.find(p => p.key === 'board').share > 0.9, 'battery: a 5 mA dev board eats the battery');
  ok(M.battery(Object.assign({}, bat, { wakeS: 30, txS: 30, period: 10 })).over, 'battery: awake longer than the period is reported');
  ok(M.battery(Object.assign({}, bat, { sd: false })).life.days > m.life.days, 'battery: switching self-discharge off lengthens the life');
  ok(/dominates|biggest|takes|never sleeps|draws/.test(M.batteryAdvice(m, bat)), 'battery: advice is chosen from the result');
  ok(/never sleeps/.test(M.batteryAdvice(M.battery(Object.assign({}, bat, { wakeS: 30, txS: 30, period: 10 })), Object.assign({}, bat, { wakeS: 30, txS: 30, period: 10 }))), 'battery: advice for a device that never sleeps');
  const code = M.batteryCode(m);
  ok(/esp_deep_sleep_start/.test(code.cpp) && /machine.deepsleep\(\d+\)/.test(code.py) && /deep sleep for \(\d+\) seconds/.test(code.blocks), 'battery: the sleep program is written in three languages');
  clean(code, 'battery: the sleep program');
  const pre = M.radioPreset(E.chip('esp32'), 'wifi');
  ok(pre.wakeMa === E.chip('esp32').rxMa && pre.txMa === E.chip('esp32').txMa, 'battery: the Wi-Fi preset takes the datasheet currents of the chip');
}
fuzz('battery', () => ({ chip: pick(['esp32', 'esp32-s3', 'esp32-c3', 'esp8266']), cell: pick(['custom', '18650', 'cr2032', 'aa2']), cap: log(10, 20000), usable: lin(50, 100), sd: rnd() < 0.5, period: log(1, 86400), sleepUa: log(0.5, 3000), q: log(0.005, 30),
  wakeMa: log(1, 600), wakeS: log(0.01, 60), txMa: log(1, 600), txS: log(0.001, 60), xa: rnd() < 0.5, xaMa: log(0.1, 600), xaS: log(0.01, 600), xb: rnd() < 0.5, xbMa: log(0.1, 600), xbS: log(0.01, 600) }),
v => { const m = M.battery(v); M.batteryAdvice(m, v); M.batteryCode(m); return m; });

/* ---------------------------------------------------------------- PWM and servo */
const pw = { chip: 'esp32', clock: 80e6, freq: 5000, bits: 8, duty: 25, angle: 90, range: 180, minUs: 500, maxUs: 2500, sbits: 16 };
{
  const m = M.pwm(pw);
  ok(m.maxBits === 13 && m.ok && m.code === 64 && m.steps === 256, 'pwm: 5 kHz allows 13 bits; 25 % of 8 bits is 64 of 256');
  near(m.p.period, 200e-6, 1e-12, 'pwm: the period of 5 kHz');
  ok(!M.pwm(Object.assign({}, pw, { bits: 14 })).ok, 'pwm: 14 bits does not fit 5 kHz');
  ok(M.pwm(Object.assign({}, pw, { freq: 20000, bits: 11 })).ok && !M.pwm(Object.assign({}, pw, { freq: 20000, bits: 12 })).ok, 'pwm: 20 kHz allows 11 bits, not 12');
  ok(M.pwm(Object.assign({}, pw, { duty: 100 })).code === 255 && M.pwm(Object.assign({}, pw, { duty: 100 })).frac === 1, 'pwm: 100 % writes the top value, which is fully on');
  ok(M.pwm(Object.assign({}, pw, { chip: 'esp32-s3', freq: 50, bits: 16 })).cap === 14 && !M.pwm(Object.assign({}, pw, { chip: 'esp32-s3', freq: 50, bits: 16 })).ok, 'pwm: the S3 timer stops at 14 bits');
  const s = M.servo(pw);
  near(s.s.us, 1500, 1e-9, 'servo: 90 degrees is 1500 microseconds');
  ok(s.bits === 16 && !s.over, 'servo: the classic ESP32 can make 16 bits at 50 Hz');
  ok(M.servo(Object.assign({}, pw, { chip: 'esp32-c3' })).bits === 14 && M.servo(Object.assign({}, pw, { chip: 'esp32-c3' })).over, 'servo: other chips fall back to 14 bits');
  const st = M.stairs(8, 4);
  ok(st.lo === 0 && st.hi === 100 && st.pts.length === 2 * 9, 'stairs: a coarse timer shows all its steps');
  const st2 = M.stairs(65536, 32768);
  ok(st2.hi - st2.lo < 0.1 && st2.pts.length > 4, 'stairs: a fine timer is shown as a close-up');
  const code = M.pwmCode(M.pwm(pw), pw);
  ok(code.length === 2 && /ledcAttach\(PWM_PIN, PWM_FREQ, PWM_BITS\)/.test(code[0].cpp) && /duty_u16=16384/.test(code[0].py) && /ledcWrite/.test(code[1].cpp) && /duty_ns\(1500000\)/.test(code[1].py), 'pwm: the programs use the core 3 calls');
  clean(code[0], 'pwm: the PWM program'); clean(code[1], 'pwm: the servo program');
  ok(M.pwmCode(M.pwm(Object.assign({}, pw, { bits: 14 })), pw) === null, 'pwm: no program for a setting that is impossible');
}
fuzz('pwm', () => ({ chip: pick(['esp32', 'esp32-s3', 'esp32-c3']), clock: pick([80e6, 40e6]), freq: log(1, 1e6), bits: Math.round(lin(1, 20)), duty: lin(0, 100), angle: lin(0, 180), range: lin(90, 270), minUs: lin(400, 1200), maxUs: lin(1800, 2600), sbits: pick([10, 12, 14, 16]) }),
v => { const m = M.pwm(v), s = M.servo(v); M.stairs(m.steps, m.code); M.pwmCode(m, v); return [m, s]; });

/* ---------------------------------------------------------------- ADC */
const ad = { chip: 'esp32', atten: 11, vin: 4.2, head: 95, total: 1e6, series: 'E24', tol: 0.01, vpin: 1.65, counts: 2048, n: 16, noise: 6 };
{
  const m = M.adc(ad), target = 2.45 * 0.95;
  ok(m.needed && m.vout <= target * 1.05 && m.vout > 1.5, 'adc: 4.2 V into the 11 dB range of the ESP32 is divided to about ' + target.toFixed(2) + ' V (got ' + m.vout.toFixed(3) + ')');
  near(m.current, 4.2 / (m.r1 + m.r2), 1e-12, 'adc: the divider wastes Vin over R1 + R2');
  ok(m.current < 10e-6, 'adc: a 1 megohm divider wastes only microamps');
  ok(m.errHi > 0 && m.errLo < 0 && Math.abs(m.errHi + m.errLo) < 0.01, 'adc: the tolerance gives an error either way');
  ok(!M.adc(Object.assign({}, ad, { vin: 1.0 })).needed && M.adc(Object.assign({}, ad, { vin: 1.0 })).vout === 1.0, 'adc: an input within the range needs no divider');
  near(m.cPin, E.adcCounts(1.65, 12, E.adcFullScale(11)), 0, 'adc: counts at the pin come from the engine');
  ok(m.raw && m.rawCounts === E.adcEsp32Raw(1.65), 'adc: the uncalibrated curve is shown for the classic ESP32 at 11 dB');
  ok(!M.adc(Object.assign({}, ad, { chip: 'esp32-s3' })).raw, 'adc: and only there');
  near(m.noiseN, 6 / 4, 1e-12, 'adc: sixteen readings quarter the noise');
  near(m.bitsGain, 2, 1e-12, 'adc: sixteen readings gain two bits');
  ok(M.adc(Object.assign({}, ad, { vin: 12, head: 100, total: 220e3 })).vout > 0 && !M.adc(Object.assign({}, ad, { vin: 12, head: 100, total: 220e3 })).danger, 'adc: 12 V is brought below 3.3 V');
}
fuzz('adc', () => ({ chip: pick(Object.keys(E.ADC_RANGE)), atten: pick([0, 2.5, 6, 11]), vin: lin(0.5, 60), head: lin(60, 100), total: log(1e3, 1e7), series: pick(['E6', 'E12', 'E24']), tol: pick([0.05, 0.01, 0.001]), vpin: lin(0, 3.6), counts: Math.round(lin(0, 4095)), n: log(1, 1024), noise: lin(0.5, 30) }), M.adc);

/* ---------------------------------------------------------------- the link */
const lk = { chip: 'esp32-c3', band: 2442, rate: 0, tx: 21, gt: 0, gr: 0, sens: -98.4, d: 30, n: 3, walls: 0, wallLoss: 5, fade: 10 };
{
  const m = M.link(lk);
  near(E.link(Object.assign({}, lk, { mhz: 2442, d: m.r0, sens: -98.4, tx: 21 })).margin, 0, 0.01, 'link: the margin is zero at the range with no margin');
  near(E.link(Object.assign({}, lk, { mhz: 2442, d: m.rF })).margin, 10, 0.01, 'link: the margin is the fade margin at the reliable range');
  ok(m.rF < m.r0, 'link: keeping a margin shortens the range');
  ok(M.link(Object.assign({}, lk, { walls: 4 })).r0 < m.r0 && M.link(Object.assign({}, lk, { n: 4 })).r0 < m.r0, 'link: walls and a larger exponent shorten the range');
  near(M.link(Object.assign({}, lk, { rate: 23 })).sens, -75.4, 1e-9, 'link: a faster Wi-Fi rate needs a stronger signal');
  ok(m.curve[0][1] > m.curve[m.curve.length - 1][1], 'link: the margin falls with distance');
  ok(!M.insideWifi(E.bleChannel(38), 1) && !M.insideWifi(E.bleChannel(39), 11) && M.insideWifi(E.bleChannel(37), 1), 'link: BLE 38 and 39 sit clear of Wi-Fi 1, 6 and 11; 37 falls under channel 1');
  const clear = [15, 20, 25, 26].filter(z => [1, 6, 11].every(w => !M.insideWifi(E.zigbeeChannel(z), w)));
  ok(clear.length === 4, 'link: Zigbee 15, 20, 25 and 26 sit between the clear Wi-Fi channels');
}
fuzz('link', () => ({ chip: 'esp32', band: pick([2442, 5500]), rate: pick([0, 10, 23]), tx: lin(-10, 22), gt: lin(-3, 12), gr: lin(-3, 12), sens: lin(-110, -60), d: log(1, 10000), n: lin(1.6, 6), walls: Math.round(lin(0, 12)), wallLoss: lin(1, 25), fade: lin(0, 30) }), M.link);

/* ---------------------------------------------------------------- partitions */
{
  const sc = id => E.PARTITION_SCHEMES.find(s => s.id === id), rows = id => sc(id).parts.map(p => p.slice());
  let m = M.partitions(rows('default-4m'), 4 * 1048576, 1200);
  ok(m.r.errors.length === 0 && m.r.ota && m.otaOk && m.r.appMax === 1280 * 1024, 'partitions: the default 4 MB scheme is valid, with OTA and two 1280 KB apps');
  ok(m.fits && m.layers[0].label === 'Bootloader' && m.layers[1].label === 'Partition table' && m.layers[2].label === 'nvs', 'partitions: the bootloader and the table come before the first partition');
  ok(m.fs === (1408 * 1024), 'partitions: the file system space of the default scheme is 1408 KB');
  m = M.partitions(rows('huge-app'), 4 * 1048576, 2000);
  ok(!m.r.ota && !m.otaOk && m.r.appMax === 3072 * 1024, 'partitions: the huge-app scheme has one 3 MB app and no OTA');
  m = M.partitions(rows('default-8m'), 4 * 1048576, 1200);
  ok(m.r.errors.some(e => /needs/.test(e)) && m.layers.some(l => /beyond/.test(l.label)), 'partitions: a table too big for the flash is flagged and drawn');
  m = M.partitions([['app0', 'app', 'ota_0', 1000 * 1024]], 4 * 1048576, 1200);
  ok(m.r.errors.some(e => /multiple of 4 KB|4 KB/.test(e)) || m.r.rows[0].size % 4096 === 0, 'partitions: an odd size is reported');
  ok(m.warns.some(w => /nvs/.test(w)) && !m.fits, 'partitions: no nvs partition is warned about, and a program too big is reported');
  m = M.partitions([], 4 * 1048576, 100);
  ok(m.r.errors.length > 0 && m.layers.length >= 2 && !m.fits, 'partitions: an empty table is reported, not a crash');
  ok(M.partitions([['a', 'app', 'ota_0', 65536], ['a', 'app', 'ota_1', 65536]], 4 * 1048576, 10).warns.some(w => /twice/.test(w)), 'partitions: a repeated name is reported');
}
fuzz('partitions', () => ({ rows: Array.from({ length: Math.round(lin(0, 8)) }, (_, i) => ['p' + i, pick(['app', 'data']), pick(['ota_0', 'nvs', 'ota', 'spiffs']), Math.round(lin(1, 8000)) * 1024]), flash: pick([1, 2, 4, 8, 16, 32]) * 1048576, prog: log(100, 8192) }), v => M.partitions(v.rows, v.flash, v.prog));

/* ---------------------------------------------------------------- LEDs and strips */
const ld = { supply: 3.3, vf: 2.0, ma: 10, series: 'E12' };
{
  let m = M.led(ld);
  near(m.ideal, 130, 1e-6, 'led: (3.3 - 2.0) V at 10 mA needs 130 ohms');
  ok(m.rStd === 120 && Math.abs(m.mA - 10.833) < 0.01, 'led: the nearest E12 value is 120 ohms, giving 10.8 mA');
  near(m.pR, (1.3 / 120) * (1.3 / 120) * 120, 1e-9, 'led: power in the resistor');
  ok(m.rating === 0.125 && m.pin.level === 'ok', 'led: a 1/8 W resistor and a comfortable pin');
  ok(!M.led(Object.assign({}, ld, { vf: 3.3 })).feasible && M.led(Object.assign({}, ld, { vf: 3.3 })).mA === 0, 'led: a supply that does not exceed the forward voltage lights nothing');
  ok(M.led(Object.assign({}, ld, { ma: 30 })).pin.level === 'bad' && M.led(Object.assign({}, ld, { supply: 5, ma: 30 })).pin.level === 'ok', 'led: 30 mA is too much for a pin but fine from a rail through a transistor');
  const s = { n: 60, bright: 50, mAeach: 60, feed: 1, rail: 8 };
  let q = M.strip(s);
  near(q.I, E.pixelCurrent(60, 0.5, 60), 1e-9, 'strip: the current comes from the engine');
  ok(q.I === 1860 && Math.abs(q.supplyA - 2.232) < 1e-9, 'strip: 60 LEDs at half brightness draw 1.86 A; the supply is chosen 20 % larger');
  const two = M.strip(Object.assign({}, s, { feed: 2 }));
  ok(two.drop < q.drop / 3, 'strip: feeding both ends cuts the drop to a quarter or less');
  near(M.stripDrop(60, 60, 1, q.i, q.r), q.drop, 1e-9, 'strip: the drop at the far end agrees with the model');
  ok(M.stripDrop(0, 60, 1, q.i, q.r) === 0 && M.stripDrop(30, 60, 3, q.i, q.r) === 0, 'strip: no drop where power is fed in');
  ok(M.strip(Object.assign({}, s, { n: 600, bright: 100 })).every < 600 && M.strip(Object.assign({}, s, { n: 8 })).one, 'strip: a long strip needs power fed in along it, a short one does not');
}
fuzz('led', () => ({ supply: pick([3.3, 5, 12]), vf: lin(0.8, 4), ma: lin(0.5, 40), series: pick(['E6', 'E12', 'E24']) }), M.led);
fuzz('strip', () => ({ n: log(1, 600), bright: lin(1, 100), mAeach: lin(10, 100), feed: pick([1, 2, 3, 5]), rail: lin(2, 40) }), M.strip);

/* ---------------------------------------------------------------- LoRa */
const lo = { sf: 7, bw: 125e3, cr: 1, bytes: 12, pre: 8, hdr: true, crc: true, duty: 0.01, txMa: 100 };
{
  const m = M.lora(lo);
  ok(m.r.t > 0.040 && m.r.t < 0.043, 'lora: 12 bytes at SF7 and 125 kHz take about 41 ms (got ' + (m.r.t * 1000).toFixed(1) + ' ms)');
  ok(m.all.length === 6 && m.all.every((a, i) => i === 0 || a.t > m.all[i - 1].t * 1.6), 'lora: every step up in spreading factor roughly doubles the air time');
  ok(m.perHour === Math.floor(36 / m.r.t), 'lora: messages per hour under a 1 % limit');
  near(m.uAh, 100 * m.r.t / 3.6, 1e-9, 'lora: charge per message');
  ok(M.lora(Object.assign({}, lo, { sf: 12 })).r.sensitivity < m.r.sensitivity, 'lora: a higher spreading factor hears weaker signals');
  ok(M.lora(Object.assign({}, lo, { sf: 12 })).r.ldro && !m.r.ldro, 'lora: SF12 at 125 kHz needs low data rate optimisation');
}
fuzz('lora', () => ({ sf: Math.round(lin(7, 12)), bw: pick([62.5e3, 125e3, 250e3, 500e3]), cr: Math.round(lin(1, 4)), bytes: Math.round(lin(1, 255)), pre: Math.round(lin(6, 16)), hdr: rnd() < 0.5, crc: rnd() < 0.5, duty: pick([0.01, 0.001, 0.1, 1]), txMa: lin(10, 150) }), M.lora);

/* ---------------------------------------------------------------- I2C */
const ic = { vcc: 3.3, speed: 100e3, devices: 3, pfDev: 10, cable: 0.3, pfM: 60, own: true, r: 4700, mods: 0, rmod: 4700 };
{
  let m = M.i2c(ic);
  near(m.cBus, (10 + 30 + 18) * 1e-12, 1e-15, 'i2c: capacitance of the pin, three modules and 30 cm of wire');
  near(m.lim.rise, 0.8473 * 4700 * m.cBus, 1e-12, 'i2c: the rise time comes from the engine');
  ok(m.ok && !m.stiff && !m.weak, 'i2c: 4.7 kilohms on a short bus is fine');
  m = M.i2c(Object.assign({}, ic, { mods: 5 }));
  near(m.reff, 1 / (6 / 4700), 1e-6, 'i2c: six 4.7 kilohm pull-ups in parallel are 783 ohms');
  ok(m.stiff && !m.ok, 'i2c: that is below the minimum a device can pull down');
  m = M.i2c(Object.assign({}, ic, { speed: 400e3, cable: 3, devices: 8 }));
  ok(m.weak && m.lim.max < 4700, 'i2c: a long bus at 400 kHz needs a stronger pull-up than 4.7 kilohms');
  m = M.i2c(Object.assign({}, ic, { own: false }));
  ok(m.none && Number.isFinite(m.lim.rise), 'i2c: no pull-up at all is reported without a crash');
}
fuzz('i2c', () => ({ vcc: pick([1.8, 3.3, 5]), speed: pick([100e3, 400e3]), devices: Math.round(lin(1, 16)), pfDev: lin(3, 30), cable: lin(0, 10), pfM: lin(30, 150), own: rnd() < 0.7, r: log(330, 1e5), mods: Math.round(lin(0, 8)), rmod: pick([1000, 2200, 4700, 10000]) }), M.i2c);

/* ---------------------------------------------------------------- power */
const po = { chip: 'esp32', vin: 5, vout: 3.3, load: 150, buckEff: 90, theta: 70, ta: 25, burst: 350, tb: 0.5, dv: 0.2, rs: 2, cbase: 10, c: 470, bod: 2.43 };
{
  const m = M.power(po);
  near(m.ldo.loss, 1.7 * 0.15, 1e-12, 'power: an LDO from 5 V to 3.3 V at 150 mA burns 0.255 W');
  near(m.tj, 25 + 0.255 * 70, 1e-9, 'power: its chip warms by loss times thermal resistance');
  near(m.buckLoss, 3.3 * 0.15 * (1 / 0.9 - 1), 1e-9, 'power: a 90 % buck converter loses a ninth of the output power');
  near(m.need, 0.35 * 0.0005 / 0.2, 1e-12, 'power: capacitor for the burst is I x t / dV');
  ok(m.low1 > m.low0 + 0.2 && m.low0 < 3.3 && m.low1 <= 3.3, 'power: the capacitor keeps the rail higher during the burst');
  ok(m.low0 > po.bod && m.low0 < m.vmin && m.low1 > m.vmin, 'power: on the default settings the board alone dips below the minimum supply and the capacitor cures it');
  near(M.dip(3.3, 0.35, 0.5, 1e-9, 1, 0.5), 3.3 - 0.175, 1e-6, 'power: with no capacitor the rail sags by I x R at once');
  near(M.dip(3.3, 0.35, 0.5, 1, 0.003, 0.003), 3.3, 5e-3, 'power: a huge capacitor holds the rail');
  near(M.dip(3.3, 0.35, 0.5, 1e-4, 0.003, 1), 3.3, 1e-9, 'power: the rail recovers after the burst');
  ok(M.dip(3.3, 0.35, 0.5, 1e-5, 0.01, -0.01) === 3.3, 'power: the rail is steady before the burst');
  ok(M.power(Object.assign({}, po, { vin: 24 })).tj > 110 && M.power(po).tj < 60, 'power: from 24 V an LDO overheats; from 5 V it does not');
}
fuzz('power', () => ({ chip: 'esp32', vin: lin(3.4, 24), vout: lin(1.8, 5), load: log(1, 2000), buckEff: lin(60, 98), theta: pick([200, 70, 40]), ta: lin(0, 60), burst: log(20, 1000), tb: log(0.05, 2000), dv: lin(0.05, 1), rs: log(0.05, 30), cbase: log(1, 100), c: log(1, 10000), bod: lin(2, 3) }), M.power);

/* ---------------------------------------------------------------- timing */
const ti = { mode: 'millis', m_before: 300, m_delta: 800, m_days: 20, b_baud: 115200, b_frame: '8N1', b_n: 100, t_period: 0.001, t_tick: 1e6, k_ms: 15, k_hz: 1000, s_fs: 16000, s_fmt: 'b16', s_ch: 1, s_secs: 1, s_chip: 'esp32-s3', f_wpd: 1440, f_sect: 5, f_end: 1e5 };
{
  const m = M.timing(ti), a = m.mil;
  ok(a.wraps && a.then === 4294967296 - 300 && a.now === 500 && a.elapsed === 800, 'timing: 300 ms before the rollover and an 800 ms wait: now reads 500, and the subtraction still gives 800');
  ok(a.early && a.deadline === 500, 'timing: the deadline test goes wrong across the wrap');
  ok(!M.timing(Object.assign({}, ti, { m_before: 5000 })).mil.wraps && M.timing(Object.assign({}, ti, { m_before: 5000 })).mil.elapsed === 800, 'timing: away from the wrap both ways work');
  near(E.millisRollover, 49.71, 0.01, 'timing: millis() rolls over after 49.7 days');
  ok(m.baud.bits === 10 && Math.abs(m.baud.ft - 10 / 115200) < 1e-12 && Math.abs(m.baud.eff - 0.8) < 1e-12, 'timing: a 8N1 byte is 10 bits and 80 % data');
  ok(M.timing(Object.assign({}, ti, { b_frame: '8E1' })).baud.bits === 11 && M.timing(Object.assign({}, ti, { b_frame: '7E2' })).baud.bits === 11, 'timing: parity and a second stop bit add bits');
  ok(m.baud.err.ok, 'timing: 115200 baud comes out close enough');
  ok(m.timer.count === 1000 && m.timer.divider === 80 && m.timer.divOk && !m.timer.zero, 'timing: 1 ms at a 1 MHz tick is 1000 counts after a divider of 80');
  ok(M.timing(Object.assign({}, ti, { t_period: 1e-6, t_tick: 1e5 })).timer.zero, 'timing: an alarm shorter than a tick is reported');
  ok(!M.timing(Object.assign({}, ti, { t_tick: 1e3 })).timer.divOk, 'timing: a 1 kHz tick is outside the divider range');
  ok(m.ticks.ticks === 15 && M.timing(Object.assign({}, ti, { k_ms: 15, k_hz: 100 })).ticks.ticks === 1 && M.timing(Object.assign({}, ti, { k_ms: 5, k_hz: 100 })).ticks.zero, 'timing: 15 ms is 15 ticks at 1 kHz, 1 at 100 Hz; 5 ms is none at 100 Hz');
  near(m.buf.bytes, 32000, 1e-9, 'timing: a second of 16 kHz, 16-bit mono audio is 32 000 bytes');
  ok(m.buf.ram === E.chip('esp32-s3').sram * 1024 && m.buf.share < 0.1, 'timing: the RAM comes from the catalogue');
  near(m.flash.yrs, 1e5 * 5 / 1440 / 365, 1e-9, 'timing: flash life is endurance x sectors / writes a day');
  const code = M.timerCode(m.timer, ti);
  ok(/timerBegin\(1000000\)/.test(code.cpp) && /timerAlarm\(timer, 1000, true, 0\)/.test(code.cpp) && /period=1,/.test(code.py) && /when timer fires/.test(code.blocks) && /every 0.001 seconds/.test(code.blocks), 'timing: the timer program uses the core 3 calls');
  clean(code, 'timing: the timer program');
  ok(M.timerCode(M.timing(Object.assign({}, ti, { t_tick: 1e3 })).timer, Object.assign({}, ti, { t_tick: 1e3 })) === null, 'timing: no program for an impossible timer');
}
fuzz('timing', () => ({ mode: 'millis', m_before: Math.round(lin(0, 20000)), m_delta: log(1, 60000), m_days: lin(0, 100), b_baud: pick([300, 9600, 115200, 2000000]), b_frame: pick(['8N1', '8E1', '8O1', '8N2', '7E1', '7E2']), b_n: log(1, 1e5), t_period: log(1e-6, 60), t_tick: pick([10e6, 1e6, 100e3, 10e3, 2e3]), k_ms: log(0.1, 60000), k_hz: pick([1000, 100]), s_fs: log(100, 192000), s_fmt: pick(['b8', 'b16', 'b24', 'f32']), s_ch: Math.round(lin(1, 8)), s_secs: log(0.01, 600), s_chip: pick(['esp32', 'esp32-s3', 'esp32-c3']), f_wpd: log(1, 1e6), f_sect: log(1, 1000), f_end: pick([1e4, 1e5]) }), v => { const m = M.timing(v); M.timerCode(m.timer, v); return m; });

console.log((fail ? 'FAILED: ' + fail + ' of ' : 'OK: ') + (pass + fail) + ' checks' + (fail ? '' : ' passed'));
process.exit(fail ? 1 : 0);
