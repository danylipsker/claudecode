/* HYPER-CORE · esp32-calc.js
 *
 * The arithmetic of microcontroller work for Hyper ESP32 (Hyper.esp, kit.esp in simulations) — everything a page
 * or a simulation would otherwise re-derive: PWM resolution, the ADC and its dividers, battery life from a duty
 * cycle, radio link budgets, UART / I2C / SPI / 1-Wire / WS2812 / servo signals as edge lists, checksums, flash
 * partition tables, Wi-Fi channels, ESP-NOW and LoRa air time, filters and PID, and state machines that run.
 *
 * SI units unless a name says otherwise (mA, mAh, dBm, MHz appear where practice uses them). Times of signals are
 * in seconds; an "edge list" is [[t, level], …] with level 0 or 1, the first entry giving the starting level.
 * Nothing here touches the DOM: tools/test-esp32.js runs it under Node.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const E = H.esp = H.esp || {};
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const log2 = x => Math.log(x) / Math.LN2;
  E.clamp = clamp;
  /* Arduino's map(): a value from one range to another (integer result unless `float`) */
  E.map = (v, inLo, inHi, outLo, outHi, float) => { const r = (v - inLo) * (outHi - outLo) / ((inHi - inLo) || 1) + outLo; return float ? r : Math.trunc(r); };

  /* ================================================================ PWM (LEDC) */
  /* the finest duty resolution the LEDC timer can give at a frequency: bits = floor(log2(clock / f)), capped by the timer width
     (E.ledcTimerBits: 20 bits on the ESP32, C6, H2, C5, C61 and P4; 14 on the S2, S3, C3 and C2). clock: 80e6 (APB), 40e6 (XTAL), 1e6/8e6 (RC) */
  E.LEDC_TIMER_BITS = { 'esp32': 20, 'esp32-s2': 14, 'esp32-s3': 14, 'esp32-c3': 14, 'esp32-c2': 14, 'esp32-c6': 20, 'esp32-h2': 20, 'esp32-c5': 20, 'esp32-c61': 20, 'esp32-p4': 20 };   // SOC_LEDC_TIMER_BIT_WIDTH of ESP-IDF 5.5
  E.ledcTimerBits = chipId => E.LEDC_TIMER_BITS[chipId] || 14;
  E.ledcMaxBits = (freq, clock, cap) => clamp(Math.floor(log2((clock || 80e6) / Math.max(1e-9, freq))), 0, cap || 20);
  /* the highest frequency that still gives `bits` of resolution */
  E.ledcMaxFreq = (bits, clock) => (clock || 80e6) / Math.pow(2, bits);
  /* duty value for a fraction (0…1) at a resolution: 50 % at 10 bits -> 512 */
  E.ledcDuty = (frac, bits) => Math.round(clamp(frac, 0, 1) * Math.pow(2, bits));
  /* one PWM setting described: { period, tOn, steps, stepTime, avg (of vcc) } */
  E.pwm = function (freq, bits, duty, vcc) {
    const steps = Math.pow(2, bits), d = clamp(duty, 0, steps), period = 1 / freq;
    return { period, steps, frac: d / steps, tOn: period * d / steps, stepTime: period / steps, avg: (vcc == null ? 3.3 : vcc) * d / steps };
  };
  /* a hobby servo: the pulse width for an angle, and the LEDC duty that makes it. o: { minUs (500), maxUs (2500), range (180), freq (50), bits (14: what every chip's LEDC timer can do at 50 Hz) } */
  E.servo = function (angle, o) {
    o = o || {};
    const minUs = o.minUs == null ? 500 : o.minUs, maxUs = o.maxUs == null ? 2500 : o.maxUs, range = o.range || 180, freq = o.freq || 50, bits = o.bits || 14;
    const us = minUs + (maxUs - minUs) * clamp(angle, 0, range) / range;
    return { us, duty: Math.round(us * 1e-6 * freq * Math.pow(2, bits)), frac: us * 1e-6 * freq, period: 1 / freq, stepUs: 1e6 / freq / Math.pow(2, bits), stepDeg: (1e6 / freq / Math.pow(2, bits)) * range / (maxUs - minUs) };
  };
  /* gamma-corrected brightness: the eye is not linear, so a fade that looks even needs duty = level^gamma */
  E.gamma = (level, gamma) => Math.pow(clamp(level, 0, 1), gamma || 2.2);

  /* ================================================================ the ADC */
  /* attenuation -> the input range it can measure usefully (volts), per chip family. Values are the ranges Espressif recommends. */
  E.ADC_RANGE = {
    esp32: { 0: [0.10, 0.95], 2.5: [0.10, 1.25], 6: [0.15, 1.75], 11: [0.15, 2.45] },
    'esp32-s2': { 0: [0, 0.75], 2.5: [0, 1.05], 6: [0, 1.30], 11: [0, 2.50] },
    'esp32-s3': { 0: [0, 0.95], 2.5: [0, 1.25], 6: [0, 1.75], 11: [0, 3.10] },
    'esp32-c3': { 0: [0, 0.75], 2.5: [0, 1.05], 6: [0, 1.30], 11: [0, 2.50] },
    'esp32-c6': { 0: [0, 1.00], 2.5: [0, 1.30], 6: [0, 1.90], 11: [0, 3.30] },
    'esp32-h2': { 0: [0, 1.00], 2.5: [0, 1.30], 6: [0, 1.90], 11: [0, 3.30] }
  };
  /* full-scale voltage of the converter for an attenuation in dB (the nominal 1.1 V reference times the divider) */
  E.adcFullScale = db => 1.1 * Math.pow(10, (db || 0) / 20);
  /* an ideal converter: volts -> counts, and back */
  E.adcCounts = (v, bits, vfs) => clamp(Math.round(v / (vfs || 3.3) * (Math.pow(2, bits || 12) - 1)), 0, Math.pow(2, bits || 12) - 1);
  E.adcVolts = (counts, bits, vfs) => counts / (Math.pow(2, bits || 12) - 1) * (vfs || 3.3);
  E.adcLsb = (bits, vfs) => (vfs || 3.3) / Math.pow(2, bits || 12);
  /* the classic ESP32's converter is not ideal: it reads nothing below about 0.1 V and flattens near the top.
     A representative model of the uncalibrated curve at 11 dB (for showing why calibration matters) -> counts 0…4095 */
  E.adcEsp32Raw = function (v) {
    if (v <= 0.10) return 0;
    if (v >= 3.2) return 4095;
    const lin = (v - 0.10) / (3.2 - 0.10);                   // ideal fraction of the usable span
    const bow = v > 2.5 ? Math.pow((v - 2.5) / 0.7, 2) * 0.045 : 0;   // the top bends upwards (compression)
    return clamp(Math.round(4095 * Math.min(1, lin + bow)), 0, 4095);
  };
  /* a voltage divider: Vout from Vin; and the pair for a wanted ratio near a total resistance */
  E.divider = (vin, r1, r2) => vin * r2 / (r1 + r2);
  E.dividerFor = function (vinMax, voutMax, total) {
    const ratio = voutMax / vinMax, t = total || 200e3;
    return { r1: t * (1 - ratio), r2: t * ratio, ratio, current: vinMax / t };
  };
  /* E-series: the nearest standard value (E12 by default, E24, E96) */
  E.eSeries = function (v, series) {
    const S = { E6: [1, 1.5, 2.2, 3.3, 4.7, 6.8], E12: [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2],
      E24: [1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1] }[series || 'E12'];
    if (!(v > 0)) return 0;
    const dec = Math.pow(10, Math.floor(Math.log10(v)));
    let best = S[0] * dec, err = Infinity;
    for (const m of S.concat([10])) { const x = m * dec, e = Math.abs(Math.log(x / v)); if (e < err) { err = e; best = x; } }
    return Number(best.toPrecision(3));
  };
  /* the series resistor for an LED on a pin: (Vpin − Vf) / I */
  E.ledResistor = (vcc, vf, amps) => Math.max(0, (vcc - vf) / Math.max(1e-9, amps));
  /* an NTC thermistor (beta model): resistance at a temperature in °C, and the temperature for a resistance */
  E.ntcR = (tC, r25, beta) => (r25 || 10e3) * Math.exp((beta || 3950) * (1 / (tC + 273.15) - 1 / 298.15));
  E.ntcT = (r, r25, beta) => 1 / (Math.log(r / (r25 || 10e3)) / (beta || 3950) + 1 / 298.15) - 273.15;
  /* noise of an averaged measurement: averaging n samples divides random noise by sqrt(n) */
  E.oversample = (noiseLsb, n) => noiseLsb / Math.sqrt(Math.max(1, n));

  /* ================================================================ power and batteries */
  /* average current of a repeating cycle. phases: [{ mA, s }] -> { avg mA, period s, mAhPerDay, charge mAs } */
  E.dutyCycle = function (phases) {
    const period = phases.reduce((a, p) => a + Math.max(0, p.s), 0), charge = phases.reduce((a, p) => a + Math.max(0, p.s) * p.mA, 0);
    const avg = period > 0 ? charge / period : 0;
    return { avg, period, charge, mAhPerDay: avg * 24, share: phases.map(p => (charge > 0 ? Math.max(0, p.s) * p.mA / charge : 0)) };
  };
  /* how long a battery lasts: capacity in mAh, average current in mA. o: { usable (0.8: fraction usable before cut-off), selfDischarge (fraction per month; when left out it is that of o.cell — an entry of E.CELLS or its id — or 0.03), regulator (efficiency 0…1 for a converter; 1 for an LDO, whose loss is in voltage not current) }
     -> { hours, days, years } */
  E.batteryLife = function (mAh, avgmA, o) {
    o = o || {};
    const cell = typeof o.cell === 'string' ? E.CELLS.find(c => c.id === o.cell) : o.cell;
    const usable = (o.usable == null ? 0.8 : o.usable) * mAh, sd = (o.selfDischarge != null ? o.selfDischarge : cell && cell.sd != null ? cell.sd : 0.03) * mAh / (30 * 24);   // mA equivalent
    const draw = avgmA / (o.regulator || 1) + sd;
    const hours = draw > 0 ? usable / draw : Infinity;
    return { hours, days: hours / 24, years: hours / 8760, draw };
  };
  /* typical cells: nominal volts, usable range, capacity, sd = self-discharge as a fraction per month (typical), note */
  E.CELLS = [
    { id: 'lipo-1000', name: 'LiPo pouch 1000 mAh', v: 3.7, vFull: 4.2, vEmpty: 3.0, mAh: 1000, rechargeable: true, sd: 0.03, note: 'Needs a charger IC and protection; 3.0–4.2 V suits a low-dropout 3.3 V regulator.' },
    { id: '18650', name: 'Li-ion 18650', v: 3.6, vFull: 4.2, vEmpty: 2.8, mAh: 3000, rechargeable: true, sd: 0.02, note: 'Real cells hold 2000–3500 mAh; labels claiming 9900 mAh are false.' },
    { id: 'lifepo4', name: 'LiFePO₄ 18650 / 14500', v: 3.2, vFull: 3.6, vEmpty: 2.5, mAh: 1500, rechargeable: true, sd: 0.03, note: 'Flat 3.2 V: can feed an ESP32 directly with no regulator.' },
    { id: 'aa2', name: '2 × AA alkaline', v: 3.0, vFull: 3.2, vEmpty: 1.8, mAh: 2500, rechargeable: false, sd: 0.002, note: 'Sags below 3 V quickly under Wi-Fi bursts; a boost converter recovers the rest.' },
    { id: 'aa3', name: '3 × AA alkaline', v: 4.5, vFull: 4.8, vEmpty: 2.7, mAh: 2500, rechargeable: false, sd: 0.002, note: 'Needs a regulator; uses nearly the whole capacity.' },
    { id: 'cr2032', name: 'CR2032 coin cell', v: 3.0, vFull: 3.2, vEmpty: 2.0, mAh: 225, rechargeable: false, sd: 0.001, note: 'Can give only a few milliamps: a Wi-Fi burst of 300 mA collapses it. Fine for BLE beacons with a large capacitor, not for Wi-Fi.' },
    { id: 'cr123a', name: 'CR123A lithium', v: 3.0, vFull: 3.2, vEmpty: 2.0, mAh: 1500, rechargeable: false, sd: 0.001, note: 'High pulse current, ten-year shelf life.' },
    { id: 'lisocl2-aa', name: 'Li-SOCl₂ AA (ER14505)', v: 3.6, vFull: 3.65, vEmpty: 3.0, mAh: 2400, rechargeable: false, sd: 0.0008, note: 'Decade-long sensors; needs a capacitor or hybrid layer for radio pulses.' }
  ];
  /* a rough state of charge of a single lithium cell from its resting voltage (0…1) */
  E.lipoSoc = function (v) {
    const T = [[3.0, 0], [3.3, 0.05], [3.5, 0.12], [3.6, 0.22], [3.7, 0.42], [3.8, 0.62], [3.9, 0.76], [4.0, 0.86], [4.1, 0.94], [4.2, 1]];
    if (v <= T[0][0]) return 0;
    for (let i = 1; i < T.length; i++) if (v <= T[i][0]) return T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (v - T[i - 1][0]) / (T[i][0] - T[i - 1][0]);
    return 1;
  };
  /* heat in a linear regulator: (Vin − Vout) · I, and its efficiency */
  E.ldo = (vin, vout, amps) => ({ loss: Math.max(0, vin - vout) * amps, eff: vin > 0 ? Math.min(1, vout / vin) : 0, dropout: vin - vout });
  /* the voltage sag across a supply's resistance during a current burst, and the capacitor that holds the rail up for the burst: C = I·t / ΔV */
  E.holdupCap = (amps, seconds, dv) => amps * seconds / Math.max(1e-9, dv);
  /* total current of addressable LEDs: n LEDs, brightness 0…1, mA per LED at full white (60 for WS2812B) */
  E.pixelCurrent = (n, brightness, mAeach) => n * clamp(brightness == null ? 1 : brightness, 0, 1) * (mAeach || 60) + n * 1;

  /* ================================================================ radio */
  E.dBmToMw = dbm => Math.pow(10, dbm / 10);
  E.mwToDbm = mw => 10 * Math.log10(Math.max(1e-30, mw));
  E.wavelength = mhz => 299.792458 / mhz;                              // metres
  /* free-space path loss in dB at a distance (m) and frequency (MHz) */
  E.fspl = (m, mhz) => 20 * Math.log10(Math.max(1e-3, m)) + 20 * Math.log10(mhz) - 27.55;
  /* a link budget. o: { tx (dBm), gt, gr (antenna gains dBi), mhz, d (m), n (path-loss exponent: 2 free space, 2.7–3.5 indoors), walls, wallLoss (dB each), sens (receiver sensitivity dBm) }
     -> { loss, rx (dBm), margin (dB), ok } */
  E.link = function (o) {
    const mhz = o.mhz || 2442, n = o.n || 2, d = Math.max(0.01, o.d || 1);
    const loss = E.fspl(1, mhz) + 10 * n * Math.log10(d) + (o.walls || 0) * (o.wallLoss == null ? 5 : o.wallLoss);
    const rx = (o.tx == null ? 20 : o.tx) + (o.gt || 0) + (o.gr || 0) - loss;
    const sens = o.sens == null ? -90 : o.sens;
    return { loss, rx, margin: rx - sens, ok: rx >= sens };
  };
  /* the distance at which the margin runs out, for the same options */
  E.linkRange = function (o) {
    const mhz = o.mhz || 2442, n = o.n || 2, sens = o.sens == null ? -90 : o.sens;
    const budget = (o.tx == null ? 20 : o.tx) + (o.gt || 0) + (o.gr || 0) - sens - (o.margin || 0) - (o.walls || 0) * (o.wallLoss == null ? 5 : o.wallLoss) - E.fspl(1, mhz);
    return Math.pow(10, budget / (10 * n));
  };
  /* radius of the first Fresnel zone at the middle of a link (m): keep 60 % of it clear */
  E.fresnel = (d, mhz) => 8.657 * Math.sqrt(d / 1000 / (mhz / 1000)) ;
  /* what an RSSI means for Wi-Fi */
  E.rssiQuality = rssi => rssi >= -50 ? 'excellent' : rssi >= -60 ? 'good' : rssi >= -70 ? 'fair' : rssi >= -80 ? 'weak' : rssi >= -90 ? 'poor' : 'unusable';
  /* a quarter-wave antenna length in millimetres (with the usual 0.95 shortening) */
  E.quarterWave = mhz => 0.95 * 299792.458 / mhz / 4;
  /* 2.4 GHz Wi-Fi channels: centre frequency (MHz), and whether two channels overlap (20 MHz wide) */
  E.wifiChannel = ch => ch === 14 ? 2484 : 2407 + 5 * ch;
  E.wifiOverlap = (a, b) => Math.abs(E.wifiChannel(a) - E.wifiChannel(b)) < 20;
  E.WIFI_CLEAR = [1, 6, 11];
  /* Bluetooth LE channels: 40 of 2 MHz; 37, 38, 39 advertise at 2402, 2426, 2480 MHz */
  E.bleChannel = function (ch) {
    if (ch === 37) return 2402; if (ch === 38) return 2426; if (ch === 39) return 2480;
    return ch <= 10 ? 2404 + 2 * ch : 2428 + 2 * (ch - 11);
  };
  /* 802.15.4 (Zigbee, Thread) channels 11–26 at 2405 + 5 (k − 11) MHz */
  E.zigbeeChannel = ch => 2405 + 5 * (ch - 11);
  /* time on air of one ESP-NOW frame: payload bytes at a PHY rate (1 Mbit/s by default) with the 802.11 overheads */
  E.espnowAirtime = function (bytes, mbps) {
    const rate = (mbps || 1) * 1e6, overhead = 24 + 4 + 7 + 4;      // MAC header, category/OUI, vendor element header, FCS
    return 192e-6 + (overhead + clamp(bytes, 0, 1470) + 8) * 8 / rate;   // long preamble at 1 Mbit/s
  };
  /* LoRa time on air (Semtech's formula). o: { sf (7–12), bw (Hz, 125e3), cr (1…4 for 4/5…4/8), preamble (8), header (true), crc (true), bytes }
     -> { tSym, tPreamble, nPayload, t, ldro, bitrate } */
  E.lora = function (o) {
    const sf = o.sf || 7, bw = o.bw || 125e3, cr = o.cr || 1, pre = o.preamble == null ? 8 : o.preamble, bytes = o.bytes == null ? 12 : o.bytes;
    const tSym = Math.pow(2, sf) / bw, ldro = tSym > 0.016 ? 1 : 0, ih = o.header === false ? 1 : 0, crc = o.crc === false ? 0 : 1;
    const nPayload = 8 + Math.max(0, Math.ceil((8 * bytes - 4 * sf + 28 + 16 * crc - 20 * ih) / (4 * (sf - 2 * ldro))) * (cr + 4));
    const tPreamble = (pre + 4.25) * tSym;
    return { tSym, tPreamble, nPayload, t: tPreamble + nPayload * tSym, ldro: !!ldro, bitrate: sf * (4 / (4 + cr)) * bw / Math.pow(2, sf), sensitivity: -174 + 10 * Math.log10(bw) + 6 + [-7.5, -10, -12.5, -15, -17.5, -20][sf - 7] };
  };
  /* the messages per hour a duty-cycle limit allows (1 % in the EU 868 MHz band) */
  E.dutyLimit = (airtime, limit) => Math.floor(3600 * (limit == null ? 0.01 : limit) / Math.max(1e-9, airtime));
  /* average current of a BLE advertiser: an event of `ms` at `mA`, every `interval` seconds, sleeping at `sleepUa` */
  E.bleAdvCurrent = function (interval, o) {
    o = o || {};
    const ev = (o.ms == null ? 3 : o.ms) / 1000, i = o.mA == null ? 12 : o.mA, s = (o.sleepUa == null ? 10 : o.sleepUa) / 1000;
    return (ev * i + Math.max(0, interval - ev) * s) / Math.max(ev, interval);
  };

  /* ================================================================ serial signals as edge lists */
  const P = E.proto = {};
  /* one UART frame. o: { baud (115200), bits (8), parity ('none' | 'even' | 'odd'), stop (1), t (start time), invert }
     -> { edges, bits: [{ t0, t1, kind: 'start' | 'data' | 'parity' | 'stop', v, i }], t1, tBit } */
  P.uart = function (byte, o) {
    o = o || {};
    const tb = 1 / (o.baud || 115200), nb = o.bits || 8, t0 = o.t || 0, inv = o.invert ? 1 : 0;
    const seq = [{ kind: 'start', v: 0 }];
    let ones = 0;
    for (let i = 0; i < nb; i++) { const v = (byte >> i) & 1; ones += v; seq.push({ kind: 'data', v, i }); }
    if (o.parity === 'even' || o.parity === 'odd') seq.push({ kind: 'parity', v: (ones % 2) ^ (o.parity === 'odd' ? 1 : 0) });
    for (let i = 0; i < (o.stop || 1); i++) seq.push({ kind: 'stop', v: 1 });
    const edges = [[t0 - tb, 1 ^ inv]], bits = [];
    let t = t0, last = 1;
    for (const b of seq) { if (b.v !== last) { edges.push([t, b.v ^ inv]); last = b.v; } bits.push(Object.assign({ t0: t, t1: t + tb }, b)); t += tb; }
    if (last !== 1) edges.push([t, 1 ^ inv]);
    return { edges, bits, t1: t, tBit: tb };
  };
  /* a string of bytes, frame after frame, with `gap` bit-times idle between them -> { edges, marks: [{ t0, t1, text }], t1 } */
  P.uartBytes = function (bytes, o) {
    o = o || {};
    const tb = 1 / (o.baud || 115200), edges = [[(o.t || 0) - tb, 1]], marks = [];
    let t = o.t || 0;
    for (const b of bytes) {
      const f = P.uart(b, Object.assign({}, o, { t }));
      for (const e of f.edges.slice(1)) edges.push(e);
      marks.push({ t0: t, t1: f.t1, text: fmtByte(b, o.show) });
      t = f.t1 + (o.gap || 0) * tb;
    }
    return { edges, marks, t1: t, tBit: tb };
  };
  const fmtByte = (b, show) => show === 'ascii' && b >= 32 && b < 127 ? "'" + String.fromCharCode(b) + "'" : show === 'dec' ? String(b) : '0x' + b.toString(16).toUpperCase().padStart(2, '0');
  /* how far two UARTs may disagree: the receiver samples mid-bit, so the error accumulated over a frame must stay under about half a bit.
     -> { errorPct (of the actual baud against the wanted), drift (bit-times at the last bit), ok } */
  E.baudError = function (wanted, actual, frameBits) {
    const err = (actual - wanted) / wanted, n = frameBits || 10;
    return { errorPct: err * 100, drift: Math.abs(err) * (n - 0.5), ok: Math.abs(err) * (n - 0.5) < 0.4 };
  };
  /* the divider the UART uses: clock / baud, in sixteenths (ESP32: 80 MHz APB) -> the baud it really makes */
  E.uartActualBaud = (baud, clock) => { const c = clock || 80e6, div = Math.round(c * 16 / baud) / 16; return c / div; };

  /* an I2C transfer. o: { addr (7-bit), read (false), data: [bytes], hz (100e3), ack: [true, …] per byte after the address (default all acknowledged), addrAck (true), t }
     -> { scl, sda (edge lists), marks: [{ t0, t1, text, kind }], t1 } */
  P.i2c = function (o) {
    const tb = 1 / (o.hz || 100e3), q = tb / 4;
    let t = o.t || 0;
    const scl = [[t - tb, 1]], sda = [[t - tb, 1]], marks = [];
    let sclL = 1, sdaL = 1;
    const setScl = (tt, v) => { if (v !== sclL) { scl.push([tt, v]); sclL = v; } };
    const setSda = (tt, v) => { if (v !== sdaL) { sda.push([tt, v]); sdaL = v; } };
    // start: SDA falls while SCL is high
    setSda(t, 0); marks.push({ t0: t - q, t1: t + q, text: 'S', kind: 'start' }); t += 2 * q; setScl(t, 0); t += q;
    const sendBit = v => { setSda(t, v); t += q; setScl(t, 1); t += 2 * q; setScl(t, 0); t += q; };
    const sendByte = (b, ack, label, kind) => {
      const a = t;
      for (let i = 7; i >= 0; i--) sendBit((b >> i) & 1);
      marks.push({ t0: a, t1: t, text: label, kind });
      const k = t;
      sendBit(ack ? 0 : 1);
      marks.push({ t0: k, t1: t, text: ack ? 'A' : 'N', kind: ack ? 'ack' : 'nack' });
    };
    const addrAck = o.addrAck !== false;
    sendByte(((o.addr & 0x7F) << 1) | (o.read ? 1 : 0), addrAck, '0x' + (o.addr & 0x7F).toString(16).toUpperCase().padStart(2, '0') + (o.read ? ' R' : ' W'), 'addr');
    if (addrAck) (o.data || []).forEach((b, i) => {
      // when reading, the controller acknowledges every byte but the last
      const ack = o.ack ? o.ack[i] !== false : (o.read ? i < o.data.length - 1 : true);
      sendByte(b, ack, '0x' + (b & 255).toString(16).toUpperCase().padStart(2, '0'), 'data');
    });
    // stop: SDA rises while SCL is high
    setSda(t, 0); t += q; setScl(t, 1); t += q; setSda(t, 1); marks.push({ t0: t - q, t1: t + q, text: 'P', kind: 'stop' }); t += 2 * q;
    return { scl, sda, marks, t1: t, tBit: tb };
  };
  /* the pull-up range for an I2C bus: the smallest that the pins can sink (3 mA), the largest that still meets the rise time with the bus capacitance
     -> { min, max (ohms), rise (s, with R) } rise limit: 1000 ns standard mode, 300 ns fast mode */
  E.i2cPullup = function (vcc, cBus, hz, r) {
    const tr = (hz || 100e3) > 100e3 ? 300e-9 : 1000e-9;
    const min = ((vcc || 3.3) - 0.4) / 3e-3, max = tr / (0.8473 * Math.max(1e-13, cBus || 100e-12));
    return { min, max, rise: 0.8473 * (r || 4700) * (cBus || 100e-12), limit: tr };
  };
  /* known I2C addresses of popular parts: address -> names */
  E.I2C_ADDR = { 0x0D: ['QMC5883L compass'], 0x1E: ['HMC5883L compass'], 0x20: ['MCP23017 / PCF8574 (0x20–0x27)'], 0x23: ['BH1750 light (or 0x5C)'], 0x27: ['PCF8574 LCD backpack (often)'], 0x29: ['VL53L0X / VL53L1X distance', 'TSL2591 light', 'BNO055 (alt)'],
    0x36: ['MAX17048 fuel gauge', 'AS5600 angle'], 0x38: ['AHT10 / AHT20 humidity', 'FT6236 touch'], 0x3C: ['SSD1306 / SH1106 OLED'], 0x3D: ['SSD1306 OLED (alt)'], 0x3F: ['PCF8574A LCD backpack'], 0x40: ['INA219 / INA226 current', 'PCA9685 PWM', 'HTU21D / SHT21 / Si7021'],
    0x44: ['SHT30 / SHT31 / SHT40 humidity'], 0x48: ['ADS1115 ADC', 'TMP102', 'LM75', 'PCF8591'], 0x50: ['AT24C EEPROM (0x50–0x57)'], 0x51: ['PCF8563 clock'], 0x53: ['ADXL345 accelerometer'], 0x57: ['MAX30102 pulse'], 0x58: ['SGP30 gas'], 0x59: ['SGP40 / SGP41 gas'],
    0x5A: ['MLX90614 IR thermometer', 'CCS811 gas', 'MPR121 touch'], 0x5D: ['GT911 touch (or 0x14)'], 0x60: ['MCP4725 DAC', 'Si5351 clock'], 0x61: ['SCD30 CO₂'], 0x62: ['SCD40 / SCD41 CO₂'], 0x68: ['MPU6050 / MPU9250 / ICM-20948 IMU', 'DS3231 / DS1307 clock'],
    0x69: ['MPU6050 (AD0 high)', 'BMI160'], 0x6A: ['LSM6DS3 IMU'], 0x70: ['TCA9548A multiplexer', 'HT16K33 LED driver'], 0x76: ['BME280 / BMP280 / BME680 (or 0x77)'], 0x77: ['BMP180 / BMP388 / BME280 (alt)'] };

  /* an SPI transfer of bytes. o: { mode (0–3), hz (1e6), bytes: [mosi bytes], miso: [bytes], lsbFirst, t }
     -> { cs, sck, mosi, miso (edge lists), marks, t1, sample: 'rising' | 'falling' } */
  P.spi = function (o) {
    const tb = 1 / (o.hz || 1e6), h = tb / 2, mode = o.mode || 0, cpol = mode >> 1, cpha = mode & 1;
    let t = o.t || 0;
    const cs = [[t - tb, 1], [t, 0]], sck = [[t - tb, cpol]], mosi = [[t - tb, 0]], miso = [[t - tb, 0]], marks = [];
    let mL = 0, sL = 0;
    t += h;
    (o.bytes || []).forEach((b, k) => {
      const a = t, mb = (o.miso || [])[k] || 0;
      for (let i = 0; i < 8; i++) {
        const sh = o.lsbFirst ? i : 7 - i, v = (b >> sh) & 1, w = (mb >> sh) & 1;
        // data changes on the edge that is not the sampling edge: before the first clock edge when CPHA = 0, on it when CPHA = 1
        const tData = cpha ? t : t - (i === 0 ? h * 0.5 : h);
        if (v !== mL) { mosi.push([Math.max(tData, a - h * 0.5), v]); mL = v; }
        if (w !== sL) { miso.push([Math.max(tData, a - h * 0.5), w]); sL = w; }
        sck.push([t, 1 - cpol]); sck.push([t + h, cpol]);
        t += tb;
      }
      marks.push({ t0: a, t1: t - h * 0.2, text: '0x' + (b & 255).toString(16).toUpperCase().padStart(2, '0') });
    });
    cs.push([t, 1]);
    return { cs, sck, mosi, miso, marks, t1: t + h, sample: (cpol ^ cpha) ? 'falling' : 'rising', tBit: tb };
  };
  /* WS2812 ("NeoPixel") bits: 800 kHz, a 0 is 0.4 µs high + 0.85 µs low, a 1 is 0.8 µs high + 0.45 µs low; bytes go green, red, blue, most significant bit first
     -> { edges, marks, t1 } for a list of [r, g, b] colours */
  P.ws2812 = function (colours, o) {
    o = o || {};
    const T0H = 0.4e-6, T1H = 0.8e-6, TB = 1.25e-6;
    let t = o.t || 0;
    const edges = [[t - TB, 0]], marks = [];
    for (const c of colours) {
      const a = t;
      for (const b of [c[1], c[0], c[2]]) for (let i = 7; i >= 0; i--) { const v = (b >> i) & 1; edges.push([t, 1], [t + (v ? T1H : T0H), 0]); t += TB; }
      marks.push({ t0: a, t1: t, text: 'G' + c[1] + ' R' + c[0] + ' B' + c[2] });
    }
    return { edges, marks, t1: t + 50e-6, tBit: TB, reset: 50e-6 };
  };
  /* 1-Wire: reset and presence, then the bits of a byte, least significant first -> { edges, marks, t1 } */
  P.onewire = function (bytes, o) {
    o = o || {};
    let t = o.t || 0;
    const edges = [[t - 100e-6, 1]], marks = [];
    if (o.reset !== false) { edges.push([t, 0], [t + 480e-6, 1], [t + 540e-6, 0], [t + 660e-6, 1]); marks.push({ t0: t, t1: t + 480e-6, text: 'reset' }, { t0: t + 540e-6, t1: t + 660e-6, text: 'presence' }); t += 960e-6; }
    for (const b of bytes) {
      const a = t;
      for (let i = 0; i < 8; i++) { const v = (b >> i) & 1; edges.push([t, 0], [t + (v ? 6e-6 : 60e-6), 1]); t += 70e-6; }
      marks.push({ t0: a, t1: t, text: '0x' + b.toString(16).toUpperCase().padStart(2, '0') });
    }
    return { edges, marks, t1: t };
  };
  /* an infra-red remote code (NEC): 9 ms mark, 4.5 ms space, 32 bits of 560 µs marks with short or long spaces -> envelope edges (before the 38 kHz carrier) */
  P.nec = function (addr, cmd, o) {
    o = o || {};
    let t = o.t || 0;
    const edges = [[t - 1e-3, 0], [t, 1], [t + 9e-3, 0]], marks = [{ t0: t, t1: t + 13.5e-3, text: 'leader' }];
    t += 13.5e-3;
    for (const b of [addr & 255, ~addr & 255, cmd & 255, ~cmd & 255]) {
      const a = t;
      for (let i = 0; i < 8; i++) { const v = (b >> i) & 1; edges.push([t, 1], [t + 560e-6, 0]); t += v ? 2.25e-3 : 1.125e-3; }
      marks.push({ t0: a, t1: t, text: '0x' + b.toString(16).toUpperCase().padStart(2, '0') });
    }
    edges.push([t, 1], [t + 560e-6, 0]);
    return { edges, marks, t1: t + 1e-3 };
  };
  /* a CAN (TWAI) data frame, standard 11-bit identifier, with bit stuffing -> { bits: [{ v, field, stuffed }], edges, t1, crc } */
  P.can = function (id, data, o) {
    o = o || {};
    const tb = 1 / (o.bitrate || 500e3), raw = [];
    const push = (v, field) => raw.push({ v, field });
    push(0, 'SOF');
    for (let i = 10; i >= 0; i--) push((id >> i) & 1, 'ID');
    push(0, 'RTR'); push(0, 'IDE'); push(0, 'r0');
    const n = Math.min(8, (data || []).length);
    for (let i = 3; i >= 0; i--) push((n >> i) & 1, 'DLC');
    for (let k = 0; k < n; k++) for (let i = 7; i >= 0; i--) push((data[k] >> i) & 1, 'DATA');
    // CRC-15 over everything so far
    let crc = 0;
    for (const b of raw) { const nx = b.v ^ ((crc >> 14) & 1); crc = (crc << 1) & 0x7FFF; if (nx) crc ^= 0x4599; }
    for (let i = 14; i >= 0; i--) push((crc >> i) & 1, 'CRC');
    // stuffing: after five equal bits, one of the opposite level is inserted (from SOF to the end of the CRC)
    const bits = [];
    let run = 0, last = -1;
    for (const b of raw) {
      bits.push({ v: b.v, field: b.field, stuffed: false });
      if (b.v === last) run++; else { run = 1; last = b.v; }
      if (run === 5) { bits.push({ v: 1 - b.v, field: b.field, stuffed: true }); last = 1 - b.v; run = 1; }
    }
    for (const [v, f] of [[1, 'CRC del'], [0, 'ACK'], [1, 'ACK del']]) bits.push({ v, field: f, stuffed: false });
    for (let i = 0; i < 7; i++) bits.push({ v: 1, field: 'EOF', stuffed: false });
    let t = o.t || 0, lv = 1;
    const edges = [[t - tb, 1]];
    for (const b of bits) { if (b.v !== lv) { edges.push([t, b.v]); lv = b.v; } b.t0 = t; t += tb; b.t1 = t; }
    if (lv !== 1) edges.push([t, 1]);
    return { bits, edges, t1: t, crc, tBit: tb, stuffed: bits.filter(b => b.stuffed).length };
  };
  /* a quadrature encoder: A and B edge lists for a move of `counts` quarter-steps at `rate` counts per second (negative: the other way) */
  P.quadrature = function (counts, rate, o) {
    o = o || {};
    const dt = 1 / Math.max(1e-9, Math.abs(rate || 100)), dir = counts < 0 ? -1 : 1, SEQ = [[0, 0], [1, 0], [1, 1], [0, 1]];
    let t = o.t || 0, k = 0;
    const a = [[t - dt, 0]], b = [[t - dt, 0]];
    let la = 0, lb = 0;
    for (let i = 0; i < Math.abs(counts); i++) {
      k = (k + dir + 4) % 4;
      const [va, vb] = SEQ[k];
      if (va !== la) { a.push([t, va]); la = va; }
      if (vb !== lb) { b.push([t, vb]); lb = vb; }
      t += dt;
    }
    return { a, b, t1: t };
  };
  /* the level of an edge list at a time */
  P.levelAt = function (edges, t) { let v = edges.length ? edges[0][1] : 0; for (const e of edges) { if (e[0] > t) break; v = e[1]; } return v; };
  /* a bouncing button: the contact chatters for `bounceMs` after each press and release. seeded so a simulation repeats. -> edge list (1 = released with a pull-up) */
  P.bounce = function (presses, o) {
    o = o || {};
    const rnd = H.util.rng(o.seed || 7), edges = [[(presses[0] ? presses[0][0] : 0) - 0.05, 1]], bms = (o.bounceMs == null ? 4 : o.bounceMs) / 1000;
    for (const [tDown, tUp] of presses) {
      for (const [t, v] of [[tDown, 0], [tUp, 1]]) {
        let tt = t, lv = v;
        edges.push([tt, lv]);
        const n = bms > 0 ? 2 + Math.floor(rnd() * 5) : 0;
        for (let i = 0; i < n; i++) { tt += bms / (n + 1) * (0.4 + rnd()); lv = 1 - lv; edges.push([Math.min(tt, t + bms), lv]); }
        if (lv !== v) edges.push([t + bms, v]);
      }
    }
    // a bounce longer than the press overlaps the release: put the edges in time order and drop the ones that change nothing
    edges.sort((a, b) => a[0] - b[0]);
    const out = [];
    for (const e of edges) if (!out.length || e[1] !== out[out.length - 1][1]) out.push(e);
    return out;
  };

  /* ================================================================ checksums and numbers */
  E.crc8 = function (bytes, poly, init) {          // CRC-8 (default the Dallas/Maxim one of 1-Wire: poly 0x31 reflected = 0x8C)
    let crc = init || 0;
    const p = poly == null ? 0x8C : poly;
    for (const b of bytes) { crc ^= b; for (let i = 0; i < 8; i++) crc = crc & 1 ? (crc >> 1) ^ p : crc >> 1; }
    return crc & 0xFF;
  };
  E.crc16modbus = function (bytes) {
    let crc = 0xFFFF;
    for (const b of bytes) { crc ^= b; for (let i = 0; i < 8; i++) crc = crc & 1 ? (crc >> 1) ^ 0xA001 : crc >> 1; }
    return crc & 0xFFFF;
  };
  E.crc32 = function (bytes) {
    let crc = 0xFFFFFFFF;
    for (const b of bytes) { crc ^= b; for (let i = 0; i < 8; i++) crc = crc & 1 ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1; }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  };
  E.checksum8 = bytes => bytes.reduce((a, b) => (a + b) & 0xFF, 0);
  E.hex = (v, digits) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(digits || 2, '0');
  E.bin = (v, digits) => (v >>> 0).toString(2).padStart(digits || 8, '0');
  E.bytesOf = function (str) {                    // UTF-8, as Serial.print and str.encode() send it
    const out = [];
    for (const ch of String(str)) {
      const c = ch.codePointAt(0);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  };
  /* two's complement: a raw 16-bit register as a signed number */
  E.signed = (v, bits) => { const n = bits || 16, m = 1 << (n - 1); return (v & (m - 1)) - (v & m); };
  /* a MAC address as text */
  E.mac = bytes => bytes.map(b => (b & 255).toString(16).toUpperCase().padStart(2, '0')).join(':');
  E.kb = n => n >= 1048576 ? (n / 1048576).toFixed(n % 1048576 ? 2 : 0).replace(/\.?0+$/, '') + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B';

  /* ================================================================ flash partitions */
  /* ready-made layouts (sizes in bytes) in the manner of the Arduino core's schemes. A table starts at 0x8000; the first partition at 0x9000; app partitions sit on 64 KB boundaries */
  const K = 1024, M = 1024 * 1024;
  E.PARTITION_SCHEMES = [
    { id: 'default-4m', name: 'Default 4 MB (two apps for OTA, 1.5 MB file system)', flash: 4 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 1280 * K], ['app1', 'app', 'ota_1', 1280 * K], ['spiffs', 'data', 'spiffs', 1408 * K], ['coredump', 'data', 'coredump', 64 * K]] },
    { id: 'huge-app', name: 'Huge app 4 MB (one 3 MB app, no OTA)', flash: 4 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 3072 * K], ['spiffs', 'data', 'spiffs', 896 * K], ['coredump', 'data', 'coredump', 64 * K]] },
    { id: 'min-spiffs', name: 'Minimal file system 4 MB (two 1.9 MB apps)', flash: 4 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 1920 * K], ['app1', 'app', 'ota_1', 1920 * K], ['spiffs', 'data', 'spiffs', 128 * K], ['coredump', 'data', 'coredump', 64 * K]] },
    { id: 'no-ota', name: 'No OTA 4 MB (2 MB app, 2 MB file system)', flash: 4 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 2048 * K], ['spiffs', 'data', 'spiffs', 1920 * K], ['coredump', 'data', 'coredump', 64 * K]] },
    { id: 'default-8m', name: '8 MB (two 3.3 MB apps, 1.5 MB file system)', flash: 8 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 3264 * K], ['app1', 'app', 'ota_1', 3264 * K], ['spiffs', 'data', 'spiffs', 1536 * K], ['coredump', 'data', 'coredump', 64 * K]] },
    { id: 'default-16m', name: '16 MB (two 6.25 MB apps, 3.4 MB file system)', flash: 16 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 6400 * K], ['app1', 'app', 'ota_1', 6400 * K], ['spiffs', 'data', 'spiffs', 3456 * K], ['coredump', 'data', 'coredump', 64 * K]] },
    { id: 'zigbee-4m', name: 'Zigbee 4 MB (app, file system, Zigbee storage)', flash: 4 * M, parts: [['nvs', 'data', 'nvs', 20 * K], ['otadata', 'data', 'ota', 8 * K], ['app0', 'app', 'ota_0', 1280 * K], ['app1', 'app', 'ota_1', 1280 * K], ['spiffs', 'data', 'spiffs', 1388 * K], ['zb_storage', 'data', 'fat', 16 * K], ['zb_fct', 'data', 'fat', 4 * K], ['coredump', 'data', 'coredump', 64 * K]] }
  ];
  /* lay partitions out: [[name, type, subtype, size], …] -> { rows: [{ name, type, subtype, offset, size, end }], used, free, flash, errors: [...], csv } */
  E.partitions = function (parts, flash) {
    const rows = [], errors = [];
    let off = 0x9000;
    for (const [name, type, subtype, size] of parts) {
      if (type === 'app') off = Math.ceil(off / 0x10000) * 0x10000;       // apps start on a 64 KB boundary
      else off = Math.ceil(off / 0x1000) * 0x1000;
      if (size % 0x1000) errors.push(name + ': size is not a multiple of 4 KB (one flash sector)');
      if (name.length > 15) errors.push(name + ': a partition name is at most 15 characters');
      rows.push({ name, type, subtype, offset: off, size, end: off + size });
      off += size;
    }
    const total = flash || 4 * M;
    if (off > total) errors.push('the table needs ' + E.kb(off) + ' but the flash holds ' + E.kb(total));
    const apps = rows.filter(r => r.type === 'app');
    if (!apps.length) errors.push('no app partition: there is nowhere to put the program');
    if (apps.length > 1 && !rows.some(r => r.subtype === 'ota')) errors.push('two app partitions but no otadata partition to say which one boots');
    if (apps.length > 1 && new Set(apps.map(a => a.size)).size > 1) errors.push('the OTA app partitions differ in size: an update must fit the smaller one');
    const csv = '# Name,   Type, SubType, Offset,   Size\n' + rows.map(r => [r.name, r.type, r.subtype, '0x' + r.offset.toString(16), '0x' + r.size.toString(16)].join(', ')).join('\n') + '\n';
    return { rows, used: off, free: total - off, flash: total, errors, csv, ota: apps.length > 1, appMax: apps.length ? Math.min(...apps.map(a => a.size)) : 0 };
  };
  /* how long a flash sector lasts: writes per day against the endurance (100 000 erase cycles typical), spread by wear levelling over `sectors` */
  E.flashLife = (writesPerDay, sectors, endurance) => (endurance || 1e5) * Math.max(1, sectors || 1) / Math.max(1e-9, writesPerDay) / 365;

  /* ================================================================ time, timers and tasks */
  /* a hardware timer alarm: the tick frequency and the count for a period. clock 80 MHz; divider 2…65536 */
  E.timer = function (period, tickHz) {
    const f = tickHz || 1e6;
    return { tickHz: f, divider: 80e6 / f, count: Math.round(period * f), actual: Math.round(period * f) / f, resolution: 1 / f };
  };
  /* millis() rolls over after 2^32 ms = 49.7 days; subtraction of unsigned numbers still gives the right interval */
  E.millisRollover = 4294967296 / 86400000;
  E.elapsed32 = (now, then) => ((now >>> 0) - (then >>> 0)) >>> 0;
  /* FreeRTOS ticks for a time: the tick is 1 ms on ESP32 Arduino (configTICK_RATE_HZ 1000), 10 ms by default in ESP-IDF */
  E.ticks = (ms, tickHz) => Math.floor(ms * (tickHz || 1000) / 1000);
  /* a fixed-priority preemptive scheduler on one core, for showing who runs when.
     tasks: [{ name, prio, period (ms), run (ms of CPU each period), offset, blocks: true }] -> { slots: [{ t, task (index or -1 for idle) }] per ms, missed: [names], load } */
  E.schedule = function (tasks, totalMs, o) {
    o = o || {};
    const n = tasks.length, left = new Array(n).fill(0), due = tasks.map(t => t.offset || 0), missed = new Set(), slots = [];
    let rr = 0;
    for (let t = 0; t < totalMs; t++) {
      for (let i = 0; i < n; i++) if (t >= due[i]) { if (left[i] > 0) missed.add(tasks[i].name); left[i] = tasks[i].run; due[i] += tasks[i].period; }
      // the ready task of highest priority runs; equal priorities take turns (time slicing)
      let best = -1;
      for (let k = 0; k < n; k++) { const i = (rr + k) % n; if (left[i] > 0 && (best < 0 || tasks[i].prio > tasks[best].prio)) best = i; }
      if (best >= 0) { left[best]--; if (o.slice !== false) rr = (best + 1) % n; }
      slots.push({ t, task: best });
    }
    const busy = slots.filter(s => s.task >= 0).length;
    return { slots, missed: [...missed], load: busy / Math.max(1, totalMs), need: tasks.reduce((a, t) => a + t.run / t.period, 0) };
  };

  /* ================================================================ filters and control */
  /* an exponential moving average: y += alpha (x − y). The alpha for a time constant at a sample period: alpha = dt / (tau + dt) */
  E.ema = alpha => { let y = null; return x => (y = y == null ? x : y + alpha * (x - y)); };
  E.emaAlpha = (tau, dt) => dt / (tau + dt);
  E.movingAverage = n => { const buf = []; let sum = 0; return x => { buf.push(x); sum += x; if (buf.length > n) sum -= buf.shift(); return sum / buf.length; }; };
  E.median = n => { const buf = []; return x => { buf.push(x); if (buf.length > n) buf.shift(); const s = buf.slice().sort((a, b) => a - b); return s[s.length >> 1]; }; };
  /* a switch with hysteresis: on above `hi`, off below `lo` */
  E.hysteresis = (lo, hi, start) => { let on = !!start; return x => { if (x >= hi) on = true; else if (x <= lo) on = false; return on; }; };
  /* a debouncer: the output follows the input only after it has been steady for `ms` */
  E.debouncer = function (ms, start) {
    let out = start == null ? 1 : start, cand = out, since = 0;
    return (level, tMs) => { if (level !== cand) { cand = level; since = tMs; } else if (cand !== out && tMs - since >= ms) out = cand; return out; };
  };
  /* a PID controller with output limits and anti-windup. o: { kp, ki, kd, min, max, dOnMeasurement (true) } -> step(setpoint, measured, dt) -> { out, p, i, d } */
  E.pid = function (o) {
    let integ = 0, prev = null, prevErr = null;
    const min = o.min == null ? -Infinity : o.min, max = o.max == null ? Infinity : o.max;
    const api = {
      step(sp, pv, dt) {
        const err = sp - pv, p = (o.kp || 0) * err;
        let d = 0;
        if (dt > 0) d = o.dOnMeasurement === false ? (prevErr == null ? 0 : (o.kd || 0) * (err - prevErr) / dt) : (prev == null ? 0 : -(o.kd || 0) * (pv - prev) / dt);
        prev = pv; prevErr = err;
        const tryI = integ + (o.ki || 0) * err * dt;
        let out = p + tryI + d;
        // anti-windup: do not integrate further into a limit
        if (out > max) { out = max; if (err < 0) integ = tryI; } else if (out < min) { out = min; if (err > 0) integ = tryI; } else integ = tryI;
        return { out, p, i: integ, d, err };
      },
      reset() { integ = 0; prev = null; prevErr = null; }
    };
    return api;
  };
  /* a first-order process (a heater, a tank, a motor's speed): tau dy/dt = K u − (y − ambient), with optional dead time */
  E.plant = function (o) {
    o = o || {};
    let y = o.y0 == null ? (o.ambient || 0) : o.y0;
    const queue = [];
    return { step(u, dt) { queue.push(u); const delayed = queue.length > Math.round((o.dead || 0) / Math.max(1e-9, dt)) ? queue.shift() : 0; y += dt / (o.tau || 1) * ((o.gain || 1) * delayed - (y - (o.ambient || 0))); return y; }, get y() { return y; }, set y(v) { y = v; } };
  };
  /* a trapezoidal move: distance, top speed, acceleration -> { tAcc, tCruise, tTotal, vPeak, triangle, at(t) -> { x, v } } (steps, steps/s, steps/s²) */
  E.move = function (dist, vmax, acc) {
    const d = Math.abs(dist), sgn = dist < 0 ? -1 : 1;
    let tAcc = vmax / acc, dAcc = 0.5 * acc * tAcc * tAcc, vPeak = vmax, triangle = false;
    if (2 * dAcc > d) { triangle = true; tAcc = Math.sqrt(d / acc); dAcc = d / 2; vPeak = acc * tAcc; }
    const tCruise = triangle ? 0 : (d - 2 * dAcc) / vmax, tTotal = 2 * tAcc + tCruise;
    return { tAcc, tCruise, tTotal, vPeak, triangle,
      at(t) {
        if (t <= 0) return { x: 0, v: 0 };
        if (t >= tTotal) return { x: dist, v: 0 };
        if (t < tAcc) return { x: sgn * 0.5 * acc * t * t, v: sgn * acc * t };
        if (t < tAcc + tCruise) return { x: sgn * (dAcc + vPeak * (t - tAcc)), v: sgn * vPeak };
        const td = tTotal - t;
        return { x: sgn * (d - 0.5 * acc * td * td), v: sgn * acc * td };
      } };
  };
  /* a stepper: steps per second for a speed. stepsPerRev 200, microsteps, and either rpm or mm/s with a lead (mm per rev) */
  E.stepRate = (rpm, stepsPerRev, micro) => rpm / 60 * (stepsPerRev || 200) * (micro || 1);

  /* ================================================================ state machines
     def: { start: 'IDLE', states: { IDLE: { on: { PRESS: 'RUN' }, after: { 5000: 'SLEEP' }, entry: 'led off', exit: '…' }, … } }
       on:    event -> next state, or { to, if: guardName, do: 'action text' }, or a list of those (the first whose guard holds);
              { internal: true, do: '…' } runs its action and stays, without the exit and entry actions and without restarting the state's clock
       after: milliseconds in the state -> next state (a timeout), or { to, if, do } or a list of those: a timeout whose guards all fail does not fire
     E.fsm(def, { guards: { name: ctx => bool } }) -> a running machine */
  E.fsm = function (def, o) {
    o = o || {};
    const m = { state: def.start, since: 0, now: 0, log: [], def, ctx: o.ctx || {}, passed: -1 };
    const holds = t => !t.if || !!(o.guards && o.guards[t.if] && o.guards[t.if](m.ctx));
    const norm = t => (Array.isArray(t) ? t : [t]).map(x => typeof x === 'string' ? { to: x } : x);
    const enter = (to, why, act) => {
      const from = m.state, S0 = def.states[from] || {}, S1 = def.states[to];
      if (!S1) { m.log.push({ t: m.now, error: 'no state "' + to + '"' }); return false; }
      const actions = [];
      if (S0.exit) actions.push(S0.exit);
      if (act) actions.push(act);
      if (S1.entry) actions.push(S1.entry);
      m.state = to; m.since = m.now; m.passed = -1;
      m.log.push({ t: m.now, from, to, why, actions });
      if (o.onChange) o.onChange(from, to, why, actions);
      return true;
    };
    /* send an event: -> true when a transition was taken */
    m.send = function (ev) {
      const S0 = def.states[m.state] || {}, opts = S0.on && S0.on[ev];
      if (opts == null) return false;
      for (const t of norm(opts)) {
        if (!holds(t)) continue;
        if (t.internal) {
          const actions = t.do ? [t.do] : [];
          m.log.push({ t: m.now, from: m.state, to: m.state, why: ev, actions, internal: true });
          if (o.onChange) o.onChange(m.state, m.state, ev, actions, true);
          return true;
        }
        return enter(t.to || m.state, ev, t.do);
      }
      return false;
    };
    /* advance the clock by ms: timeouts fire in order */
    m.tick = function (ms) {
      let left = ms, guard = 0;
      while (guard++ < 1000) {
        const S0 = def.states[m.state] || {}, after = S0.after || {};
        const next = Object.keys(after).map(Number).sort((a, b) => a - b).find(a => a > Math.max(m.passed, (m.now - m.since) - 1e-9) && a - (m.now - m.since) <= left + 1e-9);
        if (next == null) break;
        const wait = Math.max(0, next - (m.now - m.since));
        m.now += wait; left -= wait;
        const t = norm(after[next]).find(holds);
        if (!t) { m.passed = next; continue; }                      // every guard of this timeout fails: it does not fire
        if (!enter(t.to, 'after ' + next + ' ms', t.do)) break;
      }
      m.now += Math.max(0, left);
      return m.state;
    };
    m.inState = () => m.now - m.since;
    m.events = () => Object.keys((def.states[m.state] || {}).on || {});
    m.reset = () => { m.state = def.start; m.since = 0; m.now = 0; m.log = []; m.passed = -1; return m; };
    return m;
  };
  /* what is wrong with a definition: unknown targets, states nothing leads to, states with no way out */
  E.fsmCheck = function (def) {
    const out = [], names = Object.keys(def.states || {}), reach = new Set([def.start]);
    if (!def.states || !def.states[def.start]) out.push('the start state "' + def.start + '" is not defined');
    const targets = s => { const S0 = def.states[s] || {}, r = []; for (const grp of [S0.on || {}, S0.after || {}]) for (const v of Object.values(grp)) for (const t of (Array.isArray(v) ? v : [v])) r.push(typeof t === 'string' ? t : (t.to || s)); return r; };
    for (const s of names) for (const t of targets(s)) if (!def.states[t]) out.push('"' + s + '" goes to "' + t + '", which is not a state');
    let grew = true;
    while (grew) { grew = false; for (const s of [...reach]) for (const t of targets(s)) if (def.states[t] && !reach.has(t)) { reach.add(t); grew = true; } }
    for (const s of names) if (!reach.has(s)) out.push('nothing leads to "' + s + '"');
    for (const s of names) if (!targets(s).length) out.push('"' + s + '" has no way out (a final state, or a trap?)');
    return out;
  };
  /* the same machine as a drawing for kit.esym.fsm: -> { states: [{ id, label, note }], transitions: [{ from, to, label }], start } */
  E.fsmDiagram = function (def, layout) {
    const states = Object.keys(def.states).map(id => Object.assign({ id, label: id, note: def.states[id].entry || '' }, (layout && layout[id]) ? { x: layout[id][0], y: layout[id][1] } : {}));
    const transitions = [];
    for (const [id, S0] of Object.entries(def.states)) {
      for (const [ev, v] of Object.entries(S0.on || {})) for (const t of (Array.isArray(v) ? v : [v])) transitions.push({ from: id, to: typeof t === 'string' ? t : (t.to || id), label: ev + (t.if ? ' [' + t.if + ']' : ''), ev });
      for (const [ms, v] of Object.entries(S0.after || {})) for (const t of (Array.isArray(v) ? v : [v])) transitions.push({ from: id, to: typeof t === 'string' ? t : (t.to || id), label: 'after ' + (ms >= 1000 ? ms / 1000 + ' s' : ms + ' ms') + (t.if ? ' [' + t.if + ']' : ''), ev: 'after ' + ms + ' ms' });
    }
    return { states, transitions, start: def.start };
  };
  /* the same machine as a program: lang 'cpp' | 'py' | 'blocks' -> text. Actions become comments to fill in. */
  E.fsmCode = function (def, lang) {
    const names = Object.keys(def.states), ident = s => String(s).toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'S';
    const evs = [...new Set(names.flatMap(s => Object.keys(def.states[s].on || {})))];
    const norm = t => (Array.isArray(t) ? t : [t]).map(x => typeof x === 'string' ? { to: x } : x);
    if (lang === 'blocks') {
      let s = 'when started\n  go to state [' + def.start + ' v]\n\n';
      for (const st of names) {
        const S0 = def.states[st];
        s += 'when entering state [' + st + ' v]\n  ' + (S0.entry ? S0.entry : 'do nothing') + ' :: state\n\n';
        for (const [ev, v] of Object.entries(S0.on || {})) for (const t of norm(v)) s += 'when event [' + ev + ' v] in state [' + st + ' v]\n' + (t.do ? '  ' + t.do + ' :: state\n' : '') + '  go to state [' + (t.to || st) + ' v]\n\n';
        for (const [ms, v] of Object.entries(S0.after || {})) s += 'when (' + (ms / 1000) + ') seconds in state [' + st + ' v]\n  go to state [' + norm(v)[0].to + ' v]\n\n';
      }
      return s.trim() + '\n';
    }
    if (lang === 'py') {
      let s = 'import time\n\n' + names.map((n, i) => ident(n) + ' = ' + i).join('\n') + '\n\nstate = ' + ident(def.start) + '\nentered = time.ticks_ms()\n\n';
      s += 'def go(new_state):\n    global state, entered\n    state = new_state\n    entered = time.ticks_ms()\n    on_entry(state)\n\n';
      s += 'def on_entry(s):\n' + (names.filter(n => def.states[n].entry).map((n, i) => '    ' + (i ? 'elif' : 'if') + ' s == ' + ident(n) + ':\n        pass  # ' + def.states[n].entry).join('\n') || '    pass') + '\n\n';
      s += 'def handle(event):\n';
      let any = false;
      for (const st of names) for (const [ev, v] of Object.entries(def.states[st].on || {})) { const t = norm(v)[0]; s += '    ' + (any ? 'elif' : 'if') + ' state == ' + ident(st) + ' and event == "' + ev + '":\n' + (t.do ? '        # ' + t.do + '\n' : '') + '        go(' + ident(t.to || st) + ')\n'; any = true; }
      if (!any) s += '    pass\n';
      s += '\ndef check_timeouts():\n    held = time.ticks_diff(time.ticks_ms(), entered)\n';
      any = false;
      for (const st of names) for (const [ms, v] of Object.entries(def.states[st].after || {})) { s += '    ' + (any ? 'elif' : 'if') + ' state == ' + ident(st) + ' and held >= ' + ms + ':\n        go(' + ident(norm(v)[0].to) + ')\n'; any = true; }
      if (!any) s += '    pass\n';
      s += '\non_entry(state)\nwhile True:\n    # read the inputs here and call handle("' + (evs[0] || 'EVENT') + '") when something happens\n    check_timeouts()\n    time.sleep_ms(10)\n';
      return s;
    }
    let s = 'enum State { ' + names.map(ident).join(', ') + ' };\n' + (evs.length ? 'enum Event { ' + evs.map(e => 'EV_' + ident(e)).join(', ') + ' };\n' : '') + '\nState state = ' + ident(def.start) + ';\nunsigned long enteredAt = 0;\n\n';
    s += 'void onEntry(State s) {\n  switch (s) {\n' + names.map(n => '    case ' + ident(n) + ': ' + (def.states[n].entry ? '/* ' + def.states[n].entry + ' */ ' : '') + 'break;').join('\n') + '\n  }\n}\n\n';
    s += 'void go(State next) {\n  state = next;\n  enteredAt = millis();\n  onEntry(state);\n}\n\n';
    if (evs.length) {
      s += 'void handle(Event ev) {\n  switch (state) {\n';
      for (const st of names) {
        const on = Object.entries(def.states[st].on || {});
        if (!on.length) continue;
        s += '    case ' + ident(st) + ':\n';
        for (const [ev, v] of on) { const t = norm(v)[0]; s += '      if (ev == EV_' + ident(ev) + ') { ' + (t.do ? '/* ' + t.do + ' */ ' : '') + 'go(' + ident(t.to || st) + '); }\n'; }
        s += '      break;\n';
      }
      s += '    default: break;\n  }\n}\n\n';
    }
    s += 'void checkTimeouts() {\n  unsigned long held = millis() - enteredAt;\n';
    for (const st of names) for (const [ms, v] of Object.entries(def.states[st].after || {})) s += '  if (state == ' + ident(st) + ' && held >= ' + ms + 'UL) go(' + ident(norm(v)[0].to) + ');\n';
    s += '}\n\nvoid setup() {\n  go(' + ident(def.start) + ');\n}\n\nvoid loop() {\n  // read the inputs here and call handle(' + (evs.length ? 'EV_' + ident(evs[0]) : '…') + ') when something happens\n  checkTimeouts();\n}\n';
    return s;
  };
})(typeof window !== 'undefined' ? window : globalThis);
