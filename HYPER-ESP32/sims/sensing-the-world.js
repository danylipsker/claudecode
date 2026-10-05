/* HYPER-ESP32 · sims/sensing-the-world.js
 *
 * Simulations of "Sensing the world" (topic code sw).
 *
 *   sw-chooser    a quantity to measure -> the candidate sensors with connection, supply, accuracy and draw; click one for its wiring
 *   sw-ds18b20    a DS18B20 reading a drifting temperature: resolution against conversion time, and what "waiting" does to the program
 *   sw-rh         relative humidity against temperature: the vapour pressure chart, the dew point, and a sensor warmed by its board
 *   sw-ping       an ultrasonic ping: trigger, bursts, echo pulse, the distance computed, and what a wrong speed of sound costs
 *   sw-pir        a PIR output against movement: hold time, repeatable and single-trigger mode, warm-up, and the program's occupancy
 *   sw-imu-tilt   an accelerometer on a tilted board: gravity in the sensor's axes, pitch and roll, and what shaking does
 *   sw-twopoint   a sensor with offset and gain error, two reference points, and the straight line that corrects it
 *   sw-filters    a noisy reading with spikes: raw, moving average, median and exponential filters, lag and noise
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  function lcg(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
  /* a paragraph that wraps at maxW: kit.label for each line; returns the number of lines */
  function para(kit, c, text, x, y, maxW, lh, o) {
    o = o || {};
    c.save();
    c.font = (o.weight || 500) + ' ' + (o.size || 12.5) + 'px sans-serif';
    const lines = [];
    let line = '';
    for (const w of String(text).split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW * 0.94 && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    c.restore();
    lines.forEach((l, i) => kit.label(c, l, x, y + i * lh, o));
    return lines.length;
  }
  /* text cut to fit maxPx, with an ellipsis */
  function trunc(c, text, maxPx, size, weight) {
    c.save();
    c.font = (weight || 500) + ' ' + (size || 12) + 'px sans-serif';
    let t = String(text);
    if (c.measureText(t).width > maxPx) {
      while (t.length > 1 && c.measureText(t + '…').width > maxPx) t = t.slice(0, -1);
      t += '…';
    }
    c.restore();
    return t;
  }
  const dashLine = (c, x0, y0, x1, y1, color, w) => { c.save(); c.strokeStyle = color; c.lineWidth = w || 1.2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
  const fmtDec = (v, n) => (Math.round(v * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);

  /* ================================================================ sw-chooser */
  const QTY = [['Temperature', 'temp'], ['Humidity', 'hum'], ['Air pressure', 'press'], ['Light', 'light'], ['Distance', 'dist'], ['Presence and movement', 'pres'],
    ['Acceleration and tilt', 'imu'], ['CO₂ and air quality', 'air'], ['Dust (particles)', 'pm'], ['Soil moisture', 'soil'], ['Water flow', 'flow'], ['Position (GNSS)', 'pos']];
  const BUSES = [['Any connection', 'any'], ['I2C bus', 'I2C'], ['SPI bus', 'SPI'], ['UART (serial)', 'UART'], ['One data wire', 'One wire'], ['Analogue voltage', 'Analogue'], ['Plain pins (pulses, on/off)', 'Pins']];
  // the pins each kind of connection uses: [sensor pin, what it joins on the ESP32]
  const PINS = {
    'I2C': [['VCC', '3V3'], ['GND', 'GND'], ['SDA', 'GPIO21'], ['SCL', 'GPIO22']],
    'SPI': [['VCC', '3V3'], ['GND', 'GND'], ['SCK', 'GPIO18'], ['SO', 'GPIO19'], ['CS', 'GPIO5']],
    'UART': [['VCC', '3V3 / 5V'], ['GND', 'GND'], ['TX', 'RX pin'], ['RX', 'TX pin']],
    'One wire': [['VCC', '3V3'], ['GND', 'GND'], ['DATA', 'GPIO4']],
    'Analogue': [['VCC', '3V3'], ['GND', 'GND'], ['OUT', 'GPIO34']],
    'Pins': [['VCC', '3V3 / 5V'], ['GND', 'GND'], ['SIG', 'GPIO']]
  };
  // n name · tag (on the picture) · q quantities · bus · vcc supply · v33 runs from 3.3 V · acc typical accuracy · draw current · low can run from a small battery · addr I2C address · note
  const SENS = [
    { n: 'DS18B20 digital thermometer', tag: 'DS18B20', q: ['temp'], bus: 'One wire', vcc: '3.0–5.5 V', v33: true, acc: '±0.5 °C from −10 to +85 °C', draw: 'about 1 mA converting, under 1 µA idle', low: true, addr: '', note: 'Several share one wire; 750 ms per 12-bit reading. 85.0 °C means "not converted yet", −127 °C "not answering". Needs a 4.7 kΩ pull-up.' },
    { n: 'NTC thermistor, 10 kΩ, in a divider', tag: 'NTC 10k', q: ['temp'], bus: 'Analogue', vcc: 'any (divider)', v33: true, acc: '±1 °C after calibration', draw: 'about 0.1 mA in the divider', low: true, addr: '', note: 'Cheap and fast. Needs the beta equation, an ADC1 pin and a calibration; poor at both ends of its range.' },
    { n: 'MAX31855 with a type K thermocouple', tag: 'MAX31855', q: ['temp'], bus: 'SPI', vcc: '3.0–3.6 V', v33: true, acc: '±2 °C, −200 to +1350 °C', draw: 'about 1.5 mA', low: true, addr: '', note: 'For ovens, kilns and exhausts. The chip adds the cold-junction temperature and flags an open or shorted probe.' },
    { n: 'MLX90614 infrared thermometer', tag: 'MLX90614', q: ['temp'], bus: 'I2C', vcc: '3.3 V (a 5 V version exists)', v33: true, acc: '±0.5 °C near room temperature', draw: 'about 1.5 mA', low: true, addr: '0x5A', note: 'Non-contact: reads the temperature of the surface it sees (a wall, a forehead), not of the air.' },
    { n: 'DHT22 (AM2302)', tag: 'DHT22', q: ['hum', 'temp'], bus: 'One wire', vcc: '3.3–5.5 V', v33: true, acc: '±2 % RH, ±0.5 °C', draw: 'about 1.5 mA measuring', low: true, addr: '', note: 'Its own single-wire protocol (not 1-Wire). One reading per 2 s at most; drifts over the years.' },
    { n: 'DHT11', tag: 'DHT11', q: ['hum', 'temp'], bus: 'One wire', vcc: '3.3–5.5 V', v33: true, acc: '±5 % RH, ±2 °C, whole numbers', draw: 'about 0.5 mA measuring', low: true, addr: '', note: 'For demonstrations: coarse and only useful between 20 and 80 % RH.' },
    { n: 'AHT20', tag: 'AHT20', q: ['hum', 'temp'], bus: 'I2C', vcc: '2.0–5.5 V', v33: true, acc: '±2 % RH, ±0.3 °C', draw: 'tens of µA measuring', low: true, addr: '0x38', note: 'Small, quick and accurate enough for rooms; the address is fixed.' },
    { n: 'SHT40', tag: 'SHT40', q: ['hum', 'temp'], bus: 'I2C', vcc: '1.08–3.6 V', v33: true, acc: '±1.8 % RH, ±0.2 °C', draw: 'under 1 µA idle', low: true, addr: '0x44', note: 'The careful choice for humidity. One command, six bytes with a CRC each.' },
    { n: 'BME280', tag: 'BME280', q: ['hum', 'press', 'temp'], bus: 'I2C', vcc: '1.71–3.6 V', v33: true, acc: '±3 % RH, ±1 hPa, ±1 °C', draw: 'about 4 µA at one reading a second', low: true, addr: '0x76 or 0x77', note: 'Three in one; forced mode saves power and self-heating. A BMP280 looks the same and has no humidity.' },
    { n: 'BMP280', tag: 'BMP280', q: ['press', 'temp'], bus: 'I2C', vcc: '1.71–3.6 V', v33: true, acc: '±1 hPa (relative ±0.12 hPa)', draw: 'about 3 µA at one reading a second', low: true, addr: '0x76 or 0x77', note: 'A barometer for altitude and weather; no humidity. Chip ID 0x58.' },
    { n: 'BH1750', tag: 'BH1750', q: ['light'], bus: 'I2C', vcc: '2.4–3.6 V', v33: true, acc: 'about ±20 %, depends on the lamp', draw: 'about 0.12 mA measuring', low: true, addr: '0x23 or 0x5C', note: 'Lux from 1 to 65 535; it clips near 54 600 lx in default mode. Power it down between readings.' },
    { n: 'TSL2591', tag: 'TSL2591', q: ['light'], bus: 'I2C', vcc: '3.3 V (boards: 3–5 V)', v33: true, acc: 'range 188 µlx to 88 000 lx', draw: 'about 0.3 mA', low: true, addr: '0x29', note: 'Two photodiodes (visible plus infrared, infrared alone); set gain and integration time. Shares 0x29 with the VL53L0X.' },
    { n: 'Light-dependent resistor', tag: 'LDR', q: ['light'], bus: 'Analogue', vcc: 'any (divider)', v33: true, acc: 'light or dark only, uncalibrated', draw: 'set by the divider', low: true, addr: '', note: 'Cheap and slow; every cell differs. Use two thresholds so a lamp does not flicker.' },
    { n: 'HC-SR04 ultrasonic', tag: 'HC-SR04', pins: [['VCC', '5V'], ['GND', 'GND'], ['TRIG', 'GPIO25'], ['ECHO', 'GPIO26']], q: ['dist'], bus: 'Pins', vcc: '5 V', v33: false, acc: 'about ±1 cm, 2 to 400 cm', draw: 'about 15 mA', low: false, addr: '', note: 'A 5 V part: its echo pin needs a divider. Fooled by soft or slanted surfaces; the speed of sound depends on temperature.' },
    { n: 'JSN-SR04T waterproof ultrasonic', tag: 'JSN-SR04T', pins: [['VCC', '5V'], ['GND', 'GND'], ['TRIG', 'GPIO25'], ['ECHO', 'GPIO26']], q: ['dist'], bus: 'Pins', vcc: '5 V', v33: false, acc: 'about ±1 cm, blind below 20 cm or more', draw: 'tens of mA', low: false, addr: '', note: 'A sealed probe on a cable for tanks and outdoors; the blind zone is large.' },
    { n: 'VL53L0X time of flight', tag: 'VL53L0X', q: ['dist'], bus: 'I2C', vcc: '2.6–3.5 V', v33: true, acc: 'about ±3 %, 3 cm to 1.2 m (more in long-range mode)', draw: 'about 20 mA while ranging', low: true, addr: '0x29', note: 'Laser pulses: sees soft surfaces; glass, mirrors and sun fool it. Use XSHUT to give several their own addresses.' },
    { n: 'AM312 mini PIR', tag: 'AM312', pins: [['VCC', '3V3'], ['GND', 'GND'], ['OUT', 'GPIO27']], q: ['pres'], bus: 'Pins', vcc: '2.7–12 V', v33: true, acc: 'movement of warm bodies at a few metres', draw: 'a few µA', low: true, addr: '', note: 'Holds its output about 2 s; ideal for waking an ESP32 from deep sleep. Cannot see people who sit still.' },
    { n: 'HC-SR501 PIR', tag: 'HC-SR501', pins: [['VCC', '5V'], ['GND', 'GND'], ['OUT', 'GPIO27']], q: ['pres'], bus: 'Pins', vcc: '5 V (4.5–20 V)', v33: false, acc: 'range 3–7 m, adjustable hold time', draw: 'about 65 µA', low: true, addr: '', note: '3.3 V output from a 5 V supply; 30–60 s warm-up; repeatable or single-trigger mode by jumper.' },
    { n: 'LD2410 millimetre-wave radar', tag: 'LD2410', q: ['pres'], bus: 'UART', vcc: '5 V', v33: false, acc: 'moving and still people to about 6 m', draw: 'about 80 mA', low: false, addr: '', note: 'Presence even when still; 256 000 baud frames plus an OUT pin. A 24 GHz transmitter: use a certified module.' },
    { n: 'MPU6050', tag: 'MPU6050', q: ['imu'], bus: 'I2C', vcc: '3.3 V (boards: 3–5 V)', v33: true, acc: '6 axes: ±2 to ±16 g, ±250 to ±2000 °/s', draw: 'about 4 mA', low: true, addr: '0x68 or 0x69', note: 'Common and cheap, often a clone; shares 0x68 with a DS3231 clock. Read the WHO_AM_I register.' },
    { n: 'ADXL345', tag: 'ADXL345', q: ['imu'], bus: 'I2C', vcc: '2.0–3.6 V', v33: true, acc: '±2 to ±16 g, tap and free-fall detection', draw: 'about 0.1 mA', low: true, addr: '0x53', note: 'Accelerometer only: tilt, taps, vibration and free fall.' },
    { n: 'BNO055', tag: 'BNO055', q: ['imu'], bus: 'I2C', vcc: '3.3 V', v33: true, acc: 'absolute orientation, fused on the chip', draw: 'about 12 mA', low: false, addr: '0x28 or 0x29', note: 'Does its own sensor fusion: angles and quaternions straight from the chip.' },
    { n: 'SCD40 CO₂ sensor', tag: 'SCD40', q: ['air'], bus: 'I2C', vcc: '2.4–5.5 V', v33: true, acc: '±(50 ppm + 5 %), 400 to 2000 ppm', draw: 'about 15–20 mA in the 5 s mode', low: false, addr: '0x62', note: 'True CO₂ from a photoacoustic cell; one reading per 5 s. Its self-calibration assumes it meets fresh air regularly.' },
    { n: 'SGP40 VOC sensor', tag: 'SGP40', q: ['air'], bus: 'I2C', vcc: '1.7–3.6 V', v33: true, acc: 'VOC index 1–500, relative to the last day', draw: 'about 3 mA', low: false, addr: '0x59', note: 'Gives a raw signal that Sensirion\'s algorithm turns into an index. Not CO₂.' },
    { n: 'MQ-series gas sensor', tag: 'MQ-135', q: ['air'], bus: 'Analogue', vcc: '5 V', v33: false, acc: 'qualitative only; burn-in and calibration', draw: 'about 150 mA (heater)', low: false, addr: '', note: 'NOT for safety: never rely on a hobby sensor for gas, smoke or carbon-monoxide alarms.' },
    { n: 'PMS5003 particle sensor', tag: 'PMS5003', q: ['pm'], bus: 'UART', vcc: '5 V (3.3 V logic)', v33: false, acc: 'PM2.5 about ±10 µg/m³ below 100', draw: 'about 100 mA with the fan', low: false, addr: '', note: 'Laser scattering with a fan; 9600 baud frames; readings drift above about 80 % humidity.' },
    { n: 'Capacitive soil moisture probe', tag: 'Soil C', q: ['soil'], bus: 'Analogue', vcc: '3.3–5.5 V', v33: true, acc: 'a relative index: calibrate dry and wet', draw: 'about 5 mA', low: true, addr: '', note: 'Lasts for years; keep the electronics dry. Reads high in air, falls as the soil gets wetter.' },
    { n: 'Resistive soil probe', tag: 'Soil R', q: ['soil'], bus: 'Analogue', vcc: 'any', v33: true, acc: 'crude; drifts as the prongs corrode', draw: 'about 5 mA while powered', low: true, addr: '', note: 'Corrodes within weeks if powered all the time. Power it only for the reading.' },
    { n: 'YF-S201 flow meter', tag: 'YF-S201', pins: [['VCC', '5V'], ['GND', 'GND'], ['SIG', 'GPIO27']], q: ['flow'], bus: 'Pins', vcc: '5–18 V', v33: false, acc: 'about ±10 %, 1 to 30 L/min', draw: 'under 15 mA', low: false, addr: '', note: 'A turbine with a Hall sensor: about 7.5 pulses per second for each litre per minute. Calibrate by catching a litre.' },
    { n: 'u-blox NEO-6M class GNSS module', tag: 'NEO-6M', q: ['pos'], bus: 'UART', vcc: '3.3 V', v33: true, acc: 'about 2.5 m with a clear sky', draw: 'about 45 mA acquiring', low: false, addr: '', note: 'NMEA text at 9600 baud. A cold start takes minutes with a sky view; a backup battery keeps the almanac for fast restarts.' }
  ];
  Hyper.sim('sw-chooser', {
    title: 'Sensor chooser',
    blurb: `Pick what you want to measure and the table lists the common parts for it. **Click a row** to see how it connects and what to watch for. The two ticks and the connection menu grey out the parts that do not fit, and say why.

**Try this**
- Choose **Temperature**, then tick *Only parts that run from 3.3 V* and *Battery powered*: see which candidates survive.
- Choose **Distance** and **Any connection**: the cheap ultrasonic part is a 5 V part that draws 15 mA all the time.
- Choose **CO₂ and air quality** and read the note of the MQ-series sensor.
- Click the BME280 under **Humidity**, then the BMP280 under **Air pressure**: the same address, different chips.

Figures are typical values from the datasheets, rounded; a real part varies.`,
    mount(box, kit, params) {
      params = params || {};
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 460, maxH: 600 });
      let sel = 0, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'qty', type: 'select', label: 'I want to measure', options: QTY, value: QTY.some(q => q[1] === params.qty) ? params.qty : 'temp' },
        { id: 'bus', type: 'select', label: 'Connection I prefer', options: BUSES, value: 'any' },
        { id: 'v33', type: 'check', label: 'Only parts that run from 3.3 V', value: false },
        { id: 'bat', type: 'check', label: 'Battery powered (no parts that draw mA all the time)', value: false }
      ], id => { if (id === 'qty') sel = 0; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Candidates'], ['part', 'Selected'], ['bus', 'Connection'], ['need', 'Pins']]);
      const candidates = v => {
        const list = SENS.filter(s => s.q.indexOf(v.qty) >= 0).map(s => {
          let why = '';
          if (v.bus !== 'any' && s.bus !== v.bus) why = 'other connection';
          else if (v.v33 && !s.v33) why = 'needs 5 V';
          else if (v.bat && !s.low) why = 'draws mA all the time';
          return { s, why };
        });
        return list.filter(x => !x.why).concat(list.filter(x => x.why));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const list = candidates(ctl.values), ok = list.filter(x => !x.why).length;
        sel = clamp(sel, 0, Math.max(0, list.length - 1));
        const W = st.W, H = st.H, M = 10, narrow = W < 560;
        const qname = (QTY.find(q => q[1] === ctl.values.qty) || QTY[0])[0];
        kit.label(c, qname + ': ' + ok + ' of ' + list.length + ' parts fit', M, 14, { size: 13.5, weight: 650 });
        const detailH = narrow ? 196 : 150, top = 30, n = Math.max(1, list.length);
        const rowH = clamp((H - detailH - top - 10) / n, 22, 34);
        const x1 = narrow ? W * 0.5 : W * 0.33, chipW = narrow ? 56 : 66, x2 = x1 + chipW + 8, sw = W * 0.14, x3 = x2 + sw + 6;
        hits = [];
        list.forEach((it, i) => {
          const y = top + i * rowH, s = it.s, dim = !!it.why, active = i === sel;
          c.save();
          c.fillStyle = active ? (C.dark ? 'rgba(123,140,255,.18)' : 'rgba(60,90,220,.10)') : (i % 2 ? 'transparent' : (C.dark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.025)'));
          c.fillRect(M - 4, y, W - 2 * M + 8, rowH - 2);
          if (active) { c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(M - 4, y, W - 2 * M + 8, rowH - 2); }
          c.globalAlpha = dim ? 0.42 : 1;
          kit.label(c, trunc(c, narrow ? s.tag : s.n, x1 - M - 8, 12, 650), M, y + rowH / 2 - 1, { size: 12, weight: 650, color: dim ? C.muted : C.text });
          S.box(c, x1, y + 3, chipW, rowH - 8, { label: s.bus === 'One wire' ? '1 wire' : s.bus, size: 10.5, r: 8, color: kit.hue(s.bus === 'I2C' ? 186 : s.bus === 'Analogue' ? 36 : s.bus === 'UART' ? 212 : s.bus === 'SPI' ? 312 : s.bus === 'One wire' ? 140 : 280) });
          if (!narrow) {
            kit.label(c, trunc(c, s.vcc, sw - 4, 10.5), x2, y + rowH / 2 - 1, { size: 10.5, color: C.text2 });
            kit.label(c, trunc(c, s.acc, W - M - 124 - x3, 10.5), x3, y + rowH / 2 - 1, { size: 10.5, color: C.text2 });
          } else {
            kit.label(c, trunc(c, dim ? it.why : s.acc, W - M - x2, 10), x2, y + rowH / 2 - 1, { size: 10, color: dim ? C.warn : C.text2 });
          }
          c.restore();
          if (dim && !narrow) kit.label(c, it.why, W - M, y + rowH / 2 - 1, { size: 10, color: C.warn, align: 'right' });
          hits.push({ x: M - 4, y, w: W - 2 * M + 8, h: rowH - 2, i });
        });
        // the detail of the selected part
        const it = list[sel];
        if (!it) { ro.set('n', '0'); return; }
        const s = it.s, dy = H - detailH + 4;
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(M, dy - 6); c.lineTo(W - M, dy - 6); c.stroke(); c.restore();
        const dw = Math.min(250, W * (narrow ? 0.4 : 0.36)), pins = s.pins || PINS[s.bus];
        const bw = narrow ? 40 : 52, tw = Math.min(92, dw * 0.42), dh = detailH - 22;
        S.box(c, M, dy + 6, bw, dh, { label: 'ESP32', size: 11, color: kit.hue(150) });
        const tile = S.tile(c, M + dw - tw, dy + 6, tw, dh, { label: s.tag, color: 'blue', pins: pins.map(p => p[0]), side: 'left', size: 10.5 });
        pins.forEach(p => {
          const pt = tile.pins[p[0]];
          if (!pt) return;
          S.wire(c, [[M + bw, pt[1]], [pt[0], pt[1]]], { color: p[0] === 'VCC' ? C.bad : p[0] === 'GND' ? C.muted : C.accent });
          kit.label(c, p[1], M + bw + 2, pt[1] - 6, { size: 8.5, color: C.muted });
        });
        const tx = M + dw + 14, tw2 = W - tx - M;
        let ty = dy + 8;
        ty += para(kit, c, s.n, tx, ty, tw2, 14, { size: 12.5, weight: 650 }) * 14 + 3;
        ty += para(kit, c, 'Supply ' + s.vcc + (s.addr ? ' · address ' + s.addr : ''), tx, ty, tw2, 13, { size: 10.5, color: C.text2 }) * 13 + 1;
        ty += para(kit, c, 'Draw: ' + s.draw, tx, ty, tw2, 13, { size: 10.5, color: C.text2 }) * 13 + 3;
        para(kit, c, s.note, tx, ty, tw2, 13, { size: 10.5, color: C.muted });
        ro.set('n', ok + ' of ' + list.length);
        ro.set('part', s.n);
        ro.set('bus', (s.bus === 'One wire' ? 'one data wire' : s.bus) + (s.addr ? ', ' + s.addr : ''));
        ro.set('need', (s.pins || PINS[s.bus]).map(p => p[0]).join(', '));
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.i; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sw-ds18b20 */
  const DS_RES = { 9: { t: 0.09375, q: 0.5 }, 10: { t: 0.1875, q: 0.25 }, 11: { t: 0.375, q: 0.125 }, 12: { t: 0.75, q: 0.0625 } };
  Hyper.sim('sw-ds18b20', {
    title: 'DS18B20: resolution against conversion time',
    blurb: `A room whose temperature drifts, and a DS18B20 that measures it. The grey line is the truth; the dots are what the program gets, one for each finished conversion. The amber strip is the sensor busy converting; under it, what the *program* is doing meanwhile.

**Try this**
- Compare **9 bit** and **12 bit**: the 9-bit staircase has steps of 0.5 °C but each value is ready eight times sooner (94 ms against 750 ms).
- Set the style to **waits for each conversion**: the red strip is the time the whole program stands still. At 12 bit and a reading every second, three quarters of every second is lost.
- Choose **starts, works, reads later**: the same readings, and the program is free.
- Choose **reads at once, without waiting**: every value is one conversion old, and the very first is the power-up 85.0 °C.
- Press **Dunk in warm water** and watch the sensor lag behind the truth: a probe in a steel tube needs seconds, whatever the resolution.

The drift and the rounding are schematic; the resolution steps and the conversion times are the datasheet's.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340, maxH: 470 });
      const SPAN = 20, YMIN = 21, YMAX = 23.6;
      let t = 0, base = 22, target = 22, nextStart = 0.2, conv = null, stored = 85, readings = [], busy = [];
      const ctl = kit.controls(box.side, [
        { id: 'res', type: 'select', label: 'Resolution', options: [['9 bit: 0.5 °C, 94 ms', 9], ['10 bit: 0.25 °C, 188 ms', 10], ['11 bit: 0.125 °C, 375 ms', 11], ['12 bit: 0.0625 °C, 750 ms', 12]], value: 12 },
        { id: 'every', type: 'select', label: 'Take a reading every', options: [['0.2 s', 0.2], ['1 s', 1], ['3 s', 3]], value: 1 },
        { id: 'style', type: 'select', label: 'The program', options: [['waits for each conversion (blocks)', 'wait'], ['starts, works, reads later', 'async'], ['reads at once, without waiting', 'early']], value: 'async' },
        { type: 'buttons', items: [{ id: 'dunk', label: 'Dunk in warm water', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id) => {
        if (id === 'dunk') target = target > 22.5 ? 22 : 23;
        if (id === 'reset') { t = 0; base = target = 22; nextStart = 0.2; conv = null; stored = 85; readings = []; busy = []; }
        if (id === 'res' || id === 'every' || id === 'style') { conv = null; nextStart = t + 0.05; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['conv', 'One conversion'], ['step', 'Smallest step'], ['rate', 'Readings'], ['block', 'Program stands still'], ['last', 'Last reading']]);
      const truth = tt => base + 0.32 * Math.sin(tt * 2 * Math.PI / 17) + 0.14 * Math.sin(tt * 2 * Math.PI / 5.3);
      const loop = kit.loop(dt => {
        const R = DS_RES[ctl.values.res], style = ctl.values.style, interval = ctl.values.every;
        if (dt > 0) {
          t += dt;
          base += (target - base) * (1 - Math.exp(-dt / 3.5));
          if (!conv && t >= nextStart) {
            conv = { s: t, e: t + R.t };
            if (style === 'early') { readings.push({ t: conv.s, v: stored, bad: true }); }
          }
          if (conv && t >= conv.e) {
            stored = Math.round(truth(conv.e) / R.q) * R.q;
            if (style !== 'early') readings.push({ t: conv.e, v: stored, bad: false });
            busy.push([conv.s, conv.e]);
            nextStart = Math.max(conv.s + interval, conv.e);
            conv = null;
          }
          readings = readings.filter(r => r.t > t - SPAN - 2);
          busy = busy.filter(b => b[1] > t - SPAN - 2);
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const px = 52, pw = W - px - 14, py = 22, ph = H - py - 94, t0 = t - SPAN;
        const X = tt => px + clamp((tt - t0) / SPAN, 0, 1) * pw, Y = v => py + ph - clamp((v - YMIN) / (YMAX - YMIN), 0, 1) * ph;
        c.save(); c.fillStyle = C.dark ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.035)'; c.fillRect(px, py, pw, ph); c.restore();
        for (let v = 21; v <= 23.5; v += 0.5) {
          c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Math.round(Y(v)) + 0.5); c.lineTo(px + pw, Math.round(Y(v)) + 0.5); c.stroke(); c.restore();
          kit.label(c, fmtDec(v, 1), px - 6, Y(v), { size: 10, color: C.muted, align: 'right' });
        }
        kit.label(c, '°C', px - 6, py - 10, { size: 10, color: C.muted, align: 'right' });
        // the truth
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath();
        for (let i = 0; i <= 120; i++) { const tt = t0 + SPAN * i / 120, x = X(tt), y = Y(truth(tt)); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke(); c.restore();
        // the readings: a held staircase and dots
        const rs = readings.filter(r => r.t >= t0 - 1);
        c.save(); c.lineWidth = 2; c.beginPath(); c.strokeStyle = C.accent;
        rs.forEach((r, i) => { const x = X(r.t), y = Y(r.v); if (i) { c.lineTo(x, Y(rs[i - 1].v)); c.lineTo(x, y); } else c.moveTo(x, y); });
        if (rs.length) c.lineTo(px + pw, Y(rs[rs.length - 1].v));
        c.stroke(); c.restore();
        rs.forEach(r => {
          const high = r.v > YMAX;
          kit.dot(c, X(r.t), Y(r.v), 3, r.bad ? C.bad : C.accent);
          if (high && r.t > t0) kit.label(c, fmtDec(r.v, 1) + ' °C ↑', X(r.t) + 5, py + 8, { size: 10, color: C.bad });
        });
        kit.label(c, 'truth', px + 4, py + ph - 8, { size: 10.5, color: C.muted });
        kit.label(c, 'readings', px + 48, py + ph - 8, { size: 10.5, color: C.accent });
        // the sensor and the program
        const sy = py + ph + 14, sh = 14;
        const strip = (y, label) => { c.save(); c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(px, y, pw, sh); c.restore(); kit.label(c, label, px - 6, y + sh / 2, { size: 10.5, color: C.text2, align: 'right' }); };
        strip(sy, 'sensor'); strip(sy + sh + 8, 'program');
        const segs = busy.concat(conv ? [[conv.s, t]] : []);
        segs.forEach(([a, b]) => {
          if (b < t0) return;
          c.save();
          c.fillStyle = kit.hue(40, 0.85); c.fillRect(X(a), sy, Math.max(1, X(b) - X(a)), sh);
          if (style === 'wait') { c.fillStyle = C.dark ? 'rgba(229,72,77,.8)' : 'rgba(200,40,50,.72)'; c.fillRect(X(a), sy + sh + 8, Math.max(1, X(b) - X(a)), sh); }
          c.restore();
        });
        if (style !== 'wait') { c.save(); c.fillStyle = C.dark ? 'rgba(34,179,122,.5)' : 'rgba(30,150,100,.4)'; c.fillRect(px, sy + sh + 8, pw, sh); c.restore(); }
        const cap = style === 'wait' ? 'red: the program is stuck, waiting for the sensor' : style === 'early' ? 'free, but each reading is a conversion old (red dots)' : 'green: the program is free to do other work';
        kit.label(c, cap, px, sy + 2 * sh + 24, { size: 10.5, color: C.muted });
        kit.label(c, 'now →', px + pw, sy + 2 * sh + 24, { size: 10.5, color: C.muted, align: 'right' });
        // the numbers
        const per = Math.max(interval, R.t);
        const lastR = readings.length ? readings[readings.length - 1] : null;
        const dec = R.q >= 0.5 ? 1 : R.q >= 0.25 ? 2 : R.q >= 0.125 ? 3 : 4;
        ro.set('conv', fmtDec(R.t * 1000, R.t * 1000 % 1 ? 2 : 0) + ' ms');
        ro.set('step', R.q + ' °C');
        ro.set('rate', fmtDec(1 / per, 2) + ' a second' + (interval < R.t ? ' (all the sensor can do)' : ''));
        ro.set('block', style === 'wait' ? fmtDec(100 * R.t / per, 0) + ' % of the time' : 'never');
        ro.set('last', lastR ? fmtDec(lastR.v, dec) + ' °C' + (lastR.bad && lastR.v === 85 ? ' (power-up value)' : '') : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sw-rh */
  const esat = T => 6.112 * Math.exp(17.62 * T / (243.12 + T));          // hPa over water (Magnus)
  const dewPoint = (T, rh) => { const g = Math.log(Math.max(1e-6, rh / 100)) + 17.62 * T / (243.12 + T); return 243.12 * g / (17.62 - g); };
  Hyper.sim('sw-rh', {
    title: 'Why humidity depends on temperature',
    blurb: `The curve is the most water vapour air can hold at each temperature (100 % relative humidity). **A** is the real air: its vapour pressure is fixed by the weather. Warm the air and the point slides right, away from the curve, so the percentage falls. **B** is what a sensor sees when its board heats it above the room.

**Try this**
- Leave the humidity at 60 % and raise **Sensor warmer than the air** to 5 K: the sensor reports about 16 points too dry, though no water went anywhere.
- Compare 60 % and 90 % humidity with the sensor 2 K warm: the wetter the air, the more points the warming costs.
- Raise the humidity to 100 %: the dew point equals the air temperature, and any colder surface gets wet.
- Read the **Dew point**: it depends only on the water in the air, not on where the sensor sits.

Magnus formula over water; schematic outside −10 to 40 °C.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Air temperature', min: -10, max: 35, step: 0.5, value: 20, unit: '°C' },
        { id: 'RH', label: 'True relative humidity', min: 10, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'dT', label: 'Sensor warmer than the air by', min: 0, max: 5, step: 0.5, value: 2, unit: 'K' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['e', 'Water vapour in the air'], ['td', 'Dew point'], ['rh', 'Humidity the sensor reports'], ['err', 'Error']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const T = ctl.values.T, RH = ctl.values.RH, dT = ctl.values.dT, e = RH / 100 * esat(T), Ts = T + dT;
        const rhS = 100 * e / esat(Ts), td = dewPoint(T, RH);
        const px = 46, pw = W - px - 16, py = 14, ph = H - py - 42, X0 = -10, X1 = 40, Y1 = 80;
        const X = x => px + (x - X0) / (X1 - X0) * pw, Y = y => py + ph - clamp(y / Y1, 0, 1) * ph;
        c.save(); c.fillStyle = C.dark ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.035)'; c.fillRect(px, py, pw, ph); c.restore();
        for (let x = -10; x <= 40; x += 10) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(Math.round(X(x)) + 0.5, py); c.lineTo(Math.round(X(x)) + 0.5, py + ph); c.stroke(); c.restore(); kit.label(c, String(x), X(x), py + ph + 12, { size: 10, color: C.muted, align: 'center' }); }
        for (let y = 0; y <= 80; y += 20) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Math.round(Y(y)) + 0.5); c.lineTo(px + pw, Math.round(Y(y)) + 0.5); c.stroke(); c.restore(); kit.label(c, String(y), px - 6, Y(y), { size: 10, color: C.muted, align: 'right' }); }
        kit.label(c, 'temperature, °C', px + pw, py + ph + 28, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'water vapour pressure, hPa', px, py + 4, { size: 10.5, color: C.muted, align: 'left' });
        // curves of constant relative humidity; 100 % is the limit the air can hold
        [20, 40, 60, 80, 100].forEach(f => {
          c.save(); c.strokeStyle = f === 100 ? C.accent : C.faint; c.lineWidth = f === 100 ? 2.2 : 1; if (f < 100) c.setLineDash([3, 4]);
          c.beginPath();
          for (let i = 0; i <= 100; i++) { const x = X0 + (X1 - X0) * i / 100, y = f / 100 * esat(x); if (i) c.lineTo(X(x), Y(y)); else c.moveTo(X(x), Y(y)); }
          c.stroke(); c.restore();
          const lx = f === 100 ? 32 : 40, ly = f / 100 * esat(lx);
          if (ly < Y1 - 2) kit.label(c, f + ' %', X(lx) - 4, Y(ly) - 7, { size: 10, color: f === 100 ? C.accent : C.muted, align: 'right' });
        });
        // dew point: left from A to the 100 % curve
        dashLine(c, X(T), Y(e), X(td), Y(e), C.ok, 1.4);
        dashLine(c, X(td), Y(e), X(td), py + ph, C.ok, 1.4);
        kit.dot(c, X(td), Y(e), 4, C.ok);
        kit.label(c, 'dew point ' + fmtDec(td, 1) + ' °C', clamp(X(td) + 6, px + 4, px + pw - 110), py + ph - 8, { size: 10.5, color: C.ok });
        // A and B
        if (dT > 0) { kit.arrow(c, X(T) + 5, Y(e), X(Ts) - 5, Y(e), C.warn, 2); kit.dot(c, X(Ts), Y(e), 5, C.warn, C.text); kit.label(c, 'B: the sensor ' + fmtDec(rhS, 0) + ' %', X(Ts), Y(e) - 14, { size: 10.5, color: C.warn, align: X(Ts) > px + pw - 100 ? 'right' : 'left', weight: 600 }); }
        kit.dot(c, X(T), Y(e), 5, C.text, C.accent);
        kit.label(c, 'A: the air ' + RH + ' %', X(T), Y(e) + 14, { size: 10.5, color: C.text, align: X(T) > px + pw - 100 ? 'right' : 'left', weight: 600 });
        ro.set('e', fmtDec(e, 1) + ' hPa');
        ro.set('td', fmtDec(td, 1) + ' °C');
        ro.set('rh', fmtDec(rhS, 1) + ' %');
        ro.set('err', (rhS - RH >= 0 ? '+' : '−') + fmtDec(Math.abs(rhS - RH), 1) + ' points of RH');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sw-ping */
  const fmtTime = s => { const a = Math.abs(s); return a >= 1e-3 ? fmtDec(s * 1e3, a >= 1e-2 ? 1 : 2) + ' ms' : fmtDec(s * 1e6, 0) + ' µs'; };
  const SOUND = T => 331.3 * Math.sqrt((273.15 + T) / 273.15);
  Hyper.sim('sw-ping', {
    title: 'An ultrasonic ping',
    blurb: `The module sends eight bursts of 40 kHz sound (the second trace); the ECHO pin then stays high until the echo comes back (the third). **The width of that pulse is the round trip**, and the program turns it into a distance with a speed of sound.

**Try this**
- **Drag the object** (or use the slider) and watch the echo pulse grow by 58 µs for every centimetre.
- Set the air to **−10 °C** and keep the program on *343 m/s, always*: the distance it reports is too long. Switch to the corrected speed and the error vanishes.
- Change the object to **a curtain**: its echo is too weak beyond about 80 cm, and the program waits 30 ms and gives up ("no echo").
- Look at **the first 400 µs**: the 10 µs trigger pulse and the eight bursts of 40 kHz, drawn to scale.

The weak-echo ranges are schematic; the timing is exact.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420, maxH: 580 });
      const MAXR = { hard: 400, slant: 150, soft: 80 };
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Distance to the object', min: 2, max: 400, step: 1, value: 120, unit: 'cm' },
        { id: 'T', label: 'Air temperature', min: -10, max: 40, step: 1, value: 20, unit: '°C' },
        { id: 'surf', type: 'select', label: 'The object', options: [['Hard, facing the sensor', 'hard'], ['Hard, tilted 45°', 'slant'], ['Soft: a curtain', 'soft']], value: 'hard' },
        { id: 'comp', type: 'select', label: 'The program uses', options: [['343 m/s, always', 'fixed'], ['the speed at the air temperature', 'comp']], value: 'fixed' },
        { id: 'view', type: 'select', label: 'Trace', options: [['The whole ping', 'whole'], ['The first 400 µs', 'start']], value: 'whole' }
      ], () => loop.start());
      const ro = kit.readout(box.side, [['echo', 'Echo pulse'], ['calc', 'The program computes'], ['true', 'The real distance'], ['err', 'Error'], ['c', 'Speed of sound']]);
      let objX = 0, sensX = 0, scale = 1;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const d = ctl.values.d, T = ctl.values.T, surf = ctl.values.surf, cTrue = SOUND(T), cUsed = ctl.values.comp === 'comp' ? cTrue : 343;
        const echo = d <= MAXR[surf], tRound = 2 * d / 100 / cTrue, tb = 210e-6;
        const calc = cUsed * tRound / 2 * 100;
        // the scene
        const sceneH = Math.round(H * 0.3), cy = sceneH * 0.55;
        sensX = M + 66; const x1 = W - M - 30; objX = sensX + 20 + (d / 400) * (x1 - sensX - 20);
        S.box(c, M, cy - 22, 62, 44, { label: 'HC-SR04', sub: 'ultrasonic', color: kit.hue(212), size: 10.5 });
        kit.dot(c, M + 18, cy - 4, 6, C.dark ? '#c9cfdf' : '#8a90a0'); kit.dot(c, M + 44, cy - 4, 6, C.dark ? '#c9cfdf' : '#8a90a0');
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(sensX, cy + 34); c.lineTo(x1, cy + 34); c.stroke(); c.restore();
        kit.label(c, 'distance: ' + d + ' cm', (sensX + objX) / 2, cy + 46, { size: 11, color: C.text2, align: 'center' });
        // the object
        c.save();
        if (surf === 'hard') { c.fillStyle = C.muted; c.fillRect(objX, cy - 28, 9, 56); }
        else if (surf === 'slant') { c.strokeStyle = C.muted; c.lineWidth = 9; c.lineCap = 'butt'; c.beginPath(); c.moveTo(objX - 18, cy + 26); c.lineTo(objX + 18, cy - 26); c.stroke(); }
        else { c.strokeStyle = C.muted; c.lineWidth = 2; c.setLineDash([3, 3]); c.strokeRect(objX, cy - 28, 11, 56); c.setLineDash([]); c.beginPath(); for (let k = -24; k <= 24; k += 8) { c.moveTo(objX, cy + k); c.lineTo(objX + 11, cy + k + 4); } c.stroke(); }
        c.restore();
        // a pulse travelling out and back, slowly
        const cyc = 3.2, ph = (t % cyc) / cyc, out = ph < 0.4, f = out ? ph / 0.4 : ph < 0.8 ? 1 - (ph - 0.4) / 0.4 : 0;
        if (ph < 0.8 && (out || echo)) {
          const px = sensX + (objX - sensX) * f, a = out ? 0.9 : 0.55;
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.globalAlpha = a;
          [8, 15, 22].forEach(r => { c.beginPath(); if (out) c.arc(px - r * 0.5, cy, r, -0.7, 0.7); else c.arc(px + r * 0.5, cy, r, Math.PI - 0.7, Math.PI + 0.7); c.stroke(); });
          c.restore();
        }
        if (!echo && ph >= 0.4 && ph < 0.8) kit.label(c, 'echo too weak: nothing comes back', (sensX + objX) / 2, cy - 30, { size: 11, color: C.warn, align: 'center' });
        // the traces
        const whole = ctl.values.view === 'whole';
        const t0 = whole ? -0.04 * (echo ? tb + tRound : 0.03) : -30e-6, t1 = whole ? (echo ? (tb + tRound) * 1.18 : 0.034) : 400e-6;
        const burst = []; for (let i = 0; i < 8; i++) burst.push([10e-6 + i * 25e-6, 1], [10e-6 + i * 25e-6 + 12.5e-6, 0]);
        const trig = [[-1, 0], [0, 1], [10e-6, 0]], echoE = echo ? [[-1, 0], [tb, 1], [tb + tRound, 0]] : [[-1, 0]];
        const ly = sceneH + 18, lh = H - ly - 52;
        const gl = S.logic(c, M, ly, W - 2 * M, lh, [
          { label: 'TRIG', edges: trig, color: kit.hue(150) },
          { label: '40 kHz', edges: [[-1, 0]].concat(burst), color: kit.hue(40) },
          { label: 'ECHO', edges: echoE, color: kit.hue(212), marks: echo ? [{ t0: tb, t1: tb + tRound, text: fmtTime(tRound) + ' = the round trip', color: 'rgba(123,140,255,.30)' }] : [] }
        ], { t0, t1, cursor: ph < 0.8 ? t0 + (t1 - t0) * ph / 0.8 : null, labelW: 50, grid: 8 });
        if (!echo && whole) kit.label(c, 'no echo: the program waits 30 ms and gives up', M + 56, ly + lh - 24, { size: 10.5, color: C.warn });
        const msg = whole ? 'Trigger 10 µs, then 8 bursts (200 µs), then ECHO goes high until the sound is back. Only the width of ECHO matters.' : 'The 10 µs trigger starts eight bursts of 40 kHz (25 µs each); ECHO rises when the last one has left.';
        para(kit, c, msg, M, H - 36, W - 2 * M, 14, { size: 10.5, color: C.muted });
        // the numbers
        ro.set('echo', echo ? fmtTime(tRound) : 'none (timed out at 30 ms)');
        ro.set('calc', echo ? fmtDec(calc, 1) + ' cm' : 'no echo');
        ro.set('true', d + ' cm');
        ro.set('err', echo ? (calc - d >= 0 ? '+' : '−') + fmtDec(Math.abs(calc - d), 1) + ' cm (' + fmtDec(100 * Math.abs(calc - d) / d, 1) + ' %)' : '—');
        ro.set('c', fmtDec(cTrue, 1) + ' m/s real, ' + fmtDec(cUsed, 1) + ' m/s assumed');
      }, box.stage);
      kit.drag(st, {
        hit: p => (Math.abs(p.x - objX) < 30 && p.y < st.H * 0.4 ? 1 : null),
        move: (_, p) => { const x1 = st.W - 40, v = Math.round(clamp((p.x - sensX - 20) / (x1 - sensX - 20), 0, 1) * 398 + 2); ctl.set('d', v, true); },
        hover: true
      });
      st.onResize(() => loop.start());
      loop.start();
    }
  });

  /* ================================================================ sw-pir */
  Hyper.sim('sw-pir', {
    title: 'A PIR output against movement',
    blurb: `Top to bottom: the person in the room, their **movements** (click the row to add one, click a movement to remove it), what the **PIR output** does with them, and what the **program** decides with its own timer. Red shading marks the time the person was there but the program said *empty*.

**Try this**
- In **repeatable** mode every movement restarts the hold; in **single trigger** mode movement during the hold is ignored.
- Lengthen the **PIR hold time**: the output stays high longer after each movement, but it still drops while the person sits still.
- Raise **the program's timeout** until the red shading disappears: the program, not the sensor, should hold "occupied".
- Tick the **warm-up**: for 30 s after power-on the output fires at random, and the program ignores it — and the person's first movements with it.

Hold, block (2.5 s) and warm-up (30 s) follow the typical HC-SR501 behaviour; real modules vary.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 460 });
      const TMAX = 120, WARM = 30, DT = 0.05, PRESENT = [6, 100];
      const EXAMPLE = [[6, 9], [20, 22], [34, 36], [88, 92], [97, 100]];
      const GHOST = [[3, 5], [9, 10.5], [17, 19], [24, 25]];
      let bursts = EXAMPLE.map(b => b.slice()), rowY = 0, rowH = 0, px = 0, pw = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'PIR mode (the jumper)', options: [['Repeatable (H)', 'rep'], ['Single trigger (L)', 'single']], value: 'rep' },
        { id: 'hold', label: 'PIR hold time', min: 2, max: 60, step: 1, value: 12, unit: 's' },
        { id: 'prog', label: 'The program keeps "occupied" for', min: 0, max: 90, step: 5, value: 20, unit: 's' },
        { id: 'warm', type: 'check', label: 'Show the 30 s warm-up', value: true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear movements' }, { id: 'ex', label: 'The example', primary: true }] }
      ], id => { if (id === 'clear') bursts = []; if (id === 'ex') bursts = EXAMPLE.map(b => b.slice()); loop.once(); });
      const ro = kit.readout(box.side, [['rises', 'PIR detections'], ['high', 'PIR output high'], ['occ', 'Program says occupied'], ['wrong', 'Person there, program says empty']]);
      const run = v => {
        const moving = t => bursts.some(b => t >= b[0] && t < b[1]);
        const ghost = t => GHOST.some(g => t >= g[0] && t < g[1]);
        const pir = [[0, 0]], prog = [[0, 0]], warmOn = v.warm;
        let out = 0, endT = 0, block = 0, last = -1e9, occ = 0, lvl = 0, plvl = 0, rises = 0, high = 0, occT = 0, wrong = 0;
        for (let t = 0; t < TMAX; t += DT) {
          const live = !warmOn || t >= WARM;
          if (live) {
            if (out && t >= endT) { out = 0; block = t + 2.5; }
            if (!out && t >= block && moving(t)) { out = 1; endT = t + v.hold; }
            else if (out && v.mode === 'rep' && moving(t)) endT = t + v.hold;
          }
          const level = live ? out : (ghost(t) ? 1 : 0);
          if (level !== lvl) { pir.push([t, level]); if (level && live) rises++; lvl = level; }
          if (level && live) { last = t; high += DT; }
          const o = (level && live) || (last > -1e8 && t - last < v.prog) ? 1 : 0;
          if (o !== plvl) { prog.push([t, o]); plvl = o; }
          if (o) occT += DT;
          if (!o && t >= PRESENT[0] && t < PRESENT[1]) wrong += DT;
        }
        return { pir, prog, rises, high, occT, wrong };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, narrow = W < 480;
        const r = run(ctl.values);
        px = narrow ? 58 : 84; pw = W - px - 12;
        const top = 18; rowH = Math.max(34, Math.min(70, (H - top - 100) / 4));
        const X = t => px + t / TMAX * pw;
        const rows = narrow ? ['person', 'move', 'PIR', 'program'] : ['person', 'movement', 'PIR output', 'program'];
        rows.forEach((l, i) => kit.label(c, l, px - 8, top + i * rowH + rowH / 2, { size: 11, color: C.text2, align: 'right', weight: 600 }));
        c.save(); c.fillStyle = C.dark ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.035)'; c.fillRect(px, top, pw, 4 * rowH); c.restore();
        for (let t = 0; t <= TMAX; t += 20) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(Math.round(X(t)) + 0.5, top); c.lineTo(Math.round(X(t)) + 0.5, top + 4 * rowH); c.stroke(); c.restore(); kit.label(c, t + ' s', X(t), top + 4 * rowH + 12, { size: 10, color: C.muted, align: t === 0 ? 'left' : t === TMAX ? 'right' : 'center' }); }
        if (ctl.values.warm) { c.save(); c.fillStyle = C.dark ? 'rgba(224,160,48,.14)' : 'rgba(224,160,48,.16)'; c.fillRect(px, top, X(WARM) - px, 4 * rowH); c.restore(); kit.label(c, 'warm-up', px + 4, top + 4 * rowH - 8, { size: 10, color: C.warn }); }
        // person, movements
        c.save(); c.fillStyle = kit.hue(150, 0.55); c.fillRect(X(PRESENT[0]), top + rowH * 0.3, X(PRESENT[1]) - X(PRESENT[0]), rowH * 0.4); c.restore();
        bursts.forEach(b => { c.save(); c.fillStyle = kit.hue(40, 0.9); c.fillRect(X(b[0]), top + rowH + rowH * 0.2, Math.max(2, X(b[1]) - X(b[0])), rowH * 0.6); c.restore(); });
        kit.label(c, 'click to add a movement', px + 4, top + rowH + 8, { size: 9.5, color: C.faint });
        // PIR output and program
        S.wave(c, px, top + 2 * rowH + rowH * 0.2, pw, rowH * 0.6, r.pir, { t0: 0, t1: TMAX, color: kit.hue(212), fill: true });
        S.wave(c, px, top + 3 * rowH + rowH * 0.2, pw, rowH * 0.6, r.prog, { t0: 0, t1: TMAX, color: kit.hue(150), fill: true });
        // the person there but the program says empty
        let lv = 0, from = 0;
        const gaps = [];
        const progAt = t => { let v = 0; for (const e of r.prog) { if (e[0] > t) break; v = e[1]; } return v; };
        for (let t = PRESENT[0]; t <= PRESENT[1]; t += 0.25) { const o = progAt(t); if (!o && !lv) { lv = 1; from = t; } if ((o || t + 0.25 > PRESENT[1]) && lv) { lv = 0; gaps.push([from, t]); } }
        gaps.forEach(g => { c.save(); c.fillStyle = C.dark ? 'rgba(229,72,77,.38)' : 'rgba(200,40,50,.28)'; c.fillRect(X(g[0]), top + 3 * rowH + 2, X(g[1]) - X(g[0]), rowH - 4); c.restore(); });
        ro.set('rises', String(r.rises));
        ro.set('high', fmtDec(r.high, 0) + ' s');
        ro.set('occ', fmtDec(r.occT, 0) + ' s');
        ro.set('wrong', fmtDec(r.wrong, 0) + ' s of ' + (PRESENT[1] - PRESENT[0]) + ' s');
        para(kit, c, 'Green: the person is in the room from 6 s to 100 s. Amber: they move. Blue: what the PIR reports. Red: the program wrongly believes the room is empty.', px, top + 4 * rowH + 30, pw, 13, { size: 10.5, color: C.muted });
      }, box.stage);
      kit.click(st, p => {
        if (p.x < px || p.x > px + pw || p.y < 18 + rowH || p.y > 18 + 2 * rowH) return;
        const t = (p.x - px) / pw * TMAX, i = bursts.findIndex(b => t >= b[0] - 0.4 && t <= b[1] + 0.4);
        if (i >= 0) bursts.splice(i, 1); else bursts.push([Math.max(0, t - 1), Math.min(TMAX, t + 1)]);
        loop.once();
      }, p => p.x >= px && p.x <= px + pw && p.y >= 18 + rowH && p.y <= 18 + 2 * rowH);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sw-imu-tilt */
  Hyper.sim('sw-imu-tilt', {
    title: 'Tilt from an accelerometer',
    blurb: `The board is tilted by **pitch** and **roll** (drag on the picture, or use the sliders). An accelerometer at rest feels gravity only, so its three numbers are the "up" direction written in the board's own axes; **pitch and roll are computed from them**. The coloured arrows are the sensor's X, Y and Z axes; the amber arrow is what it feels.

**Try this**
- Tilt the board and watch how the three bars share the 1 g: the vector length stays 1.00 g while the board is still.
- Turn only the roll to 90° and then change the pitch: the Y bar takes the whole g — and notice what happens to the pitch figure.
- Raise **Pushed sideways** to 0.5 g: the amber arrow leans, the length is no longer 1 g, and the computed angles are wrong by the amount the push adds. A length different from 1 g is your warning.
- Note that there is no control for *yaw*: turning about the vertical axis would change none of the three numbers.

Axes follow the formulas in the page: pitch = atan2(−aₓ, √(a_y² + a_z²)), roll = atan2(a_y, a_z).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 370, maxH: 500 });
      const RAD = Math.PI / 180;
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Pitch', min: -80, max: 80, step: 1, value: -30, unit: '°' },
        { id: 'r', label: 'Roll', min: -170, max: 170, step: 1, value: 15, unit: '°' },
        { id: 'push', label: 'Pushed sideways by', min: 0, max: 1, step: 0.05, value: 0, unit: 'g' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'Accelerometer (g)'], ['len', 'Length of the vector'], ['est', 'Pitch and roll from it'], ['true', 'Real pitch and roll'], ['err', 'Error']]);
      // body -> world: Ry(pitch) Rx(roll); world x right, y into the picture, z up
      const Rm = (p, r) => { const cp = Math.cos(p), sp = Math.sin(p), cr = Math.cos(r), sr = Math.sin(r); return [[cp, sp * sr, sp * cr], [0, cr, -sr], [-sp, cp * sr, cp * cr]]; };
      const apply = (R, v) => [R[0][0] * v[0] + R[0][1] * v[1] + R[0][2] * v[2], R[1][0] * v[0] + R[1][1] * v[1] + R[1][2] * v[2], R[2][0] * v[0] + R[2][1] * v[1] + R[2][2] * v[2]];
      const applyT = (R, v) => [R[0][0] * v[0] + R[1][0] * v[1] + R[2][0] * v[2], R[0][1] * v[0] + R[1][1] * v[1] + R[2][1] * v[2], R[0][2] * v[0] + R[1][2] * v[1] + R[2][2] * v[2]];
      const f2 = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, narrow = W < 600;
        const p = ctl.values.p * RAD, r = ctl.values.r * RAD, push = ctl.values.push;
        const R = Rm(p, r), fw = [push, 0, 1], fb = applyT(R, fw);
        const len = Math.hypot(fb[0], fb[1], fb[2]);
        const estP = Math.atan2(-fb[0], Math.hypot(fb[1], fb[2])) / RAD, estR = Math.atan2(fb[1], fb[2]) / RAD;
        // the picture of the board
        const sceneW = narrow ? W : Math.round(W * 0.6), sceneH = narrow ? Math.round(H * 0.62) : H;
        const cx = sceneW * 0.5, cy = sceneH * 0.5, sc = Math.min(sceneW, sceneH) * 0.26;
        const P = v => [cx + sc * (v[0] + 0.45 * v[1]), cy - sc * (v[2] + 0.3 * v[1])];
        const hx = 1.0, hy = 0.62, hz = 0.07;
        const corners = []; for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) corners.push(apply(R, [sx * hx, sy * hy, sz * hz]));
        const idx = (sx, sy, sz) => (sx > 0 ? 4 : 0) + (sy > 0 ? 2 : 0) + (sz > 0 ? 1 : 0);
        // the floor, for orientation
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = -2; k <= 2; k++) { const a = P([k, -1.6, -1.7]), b = P([k, 1.6, -1.7]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); const a2 = P([-2.2, k * 0.7, -1.7]), b2 = P([2.2, k * 0.7, -1.7]); c.beginPath(); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke(); }
        c.restore();
        // top face filled, edges drawn
        const face = [idx(-1, -1, 1), idx(1, -1, 1), idx(1, 1, 1), idx(-1, 1, 1)];
        c.save(); c.beginPath(); face.forEach((i, k) => { const q = P(corners[i]); if (k) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.closePath();
        c.fillStyle = C.dark ? 'rgba(123,140,255,.28)' : 'rgba(60,90,220,.18)'; c.fill(); c.strokeStyle = C.text2; c.lineWidth = 1.4; c.stroke(); c.restore();
        const edges = []; for (const [a, b] of [[0, 4], [1, 5], [2, 6], [3, 7], [0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7]]) edges.push([a, b]);
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; edges.forEach(([a, b]) => { const u = P(corners[a]), w = P(corners[b]); c.beginPath(); c.moveTo(u[0], u[1]); c.lineTo(w[0], w[1]); c.stroke(); }); c.restore();
        // the axes of the sensor
        const o = P([0, 0, 0]);
        [['X', [1.5, 0, 0], C.bad], ['Y', [0, 1.1, 0], C.ok], ['Z', [0, 0, 1.0], C.accent]].forEach(([n, v, col]) => {
          const e = P(apply(R, v)); kit.arrow(c, o[0], o[1], e[0], e[1], col, 2.2);
          kit.label(c, n, e[0] + (e[0] >= o[0] ? 6 : -6), e[1] - 4, { size: 11.5, weight: 700, color: col, align: e[0] >= o[0] ? 'left' : 'right' });
        });
        // what the sensor feels: up, plus any push
        const fe = P([fw[0] * 1.2, 0, fw[2] * 1.2]); kit.arrow(c, o[0], o[1], fe[0], fe[1], C.warn, 3);
        kit.label(c, 'feels ' + len.toFixed(2) + ' g', fe[0] + 8, fe[1] - 2, { size: 11, weight: 650, color: C.warn });
        kit.arrow(c, 22, 30, 22, 66, C.muted, 2); kit.label(c, 'gravity', 32, 50, { size: 10.5, color: C.muted });
        // the three numbers as bars
        const bx = narrow ? 14 : sceneW + 8, by = narrow ? sceneH + 6 : cy - 56, bw = (narrow ? W : W - sceneW) - (narrow ? 28 : 18), zero = bx + 30 + (bw - 30) / 2, scale = ((bw - 30) / 2 - 46) / 1.5;
        [['aₓ', fb[0], C.bad], ['a_y', fb[1], C.ok], ['a_z', fb[2], C.accent]].forEach(([n, v, col], i) => {
          const y = by + i * 26;
          kit.label(c, n, bx, y + 8, { size: 11.5, weight: 650, color: col });
          c.save(); c.fillStyle = col; c.globalAlpha = 0.85; c.fillRect(Math.min(zero, zero + v * scale), y, Math.max(1.5, Math.abs(v * scale)), 16); c.restore();
          kit.label(c, f2(v) + ' g', v >= 0 ? zero + v * scale + 5 : zero + 4, y + 8, { size: 10.5, color: C.text2 });
        });
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(zero, by - 4); c.lineTo(zero, by + 3 * 26 - 6); c.stroke(); c.restore();
        kit.label(c, '0', zero, by + 3 * 26 + 2, { size: 9.5, color: C.muted, align: 'center' });
        para(kit, c, 'From these numbers: pitch ' + estP.toFixed(1) + '°, roll ' + estR.toFixed(1) + '°', bx, by + 3 * 26 + 18, bw, 13, { size: 10.5, color: C.text2 });
        ro.set('a', f2(fb[0]) + ', ' + f2(fb[1]) + ', ' + f2(fb[2]));
        ro.set('len', len.toFixed(2) + ' g' + (Math.abs(len - 1) > 0.03 ? ' (not at rest!)' : ''));
        ro.set('est', estP.toFixed(1) + '°, ' + estR.toFixed(1) + '°');
        ro.set('true', ctl.values.p.toFixed(1) + '°, ' + ctl.values.r.toFixed(1) + '°');
        ro.set('err', (estP - ctl.values.p).toFixed(1) + '°, ' + (estR - ctl.values.r).toFixed(1) + '°');
      }, box.stage);
      let last = null;
      kit.drag(st, {
        hit: p => ({ x: p.x, y: p.y }),
        start: (_, p) => { last = { x: p.x, p: ctl.values.p, r: ctl.values.r, y: p.y }; },
        move: (_, p) => { if (!last) return; ctl.set('r', clamp(Math.round(last.r + (p.x - last.x) * 0.6), -170, 170), false); ctl.set('p', clamp(Math.round(last.p - (p.y - last.y) * 0.5), -80, 80), true); },
        end: () => { last = null; }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sw-twopoint */
  Hyper.sim('sw-twopoint', {
    title: 'Two-point calibration',
    blurb: `A sensor whose reading (vertical) is a straight line of the true value (horizontal), spoilt by an **offset**, a **gain** error and, if you like, a little **curvature**. You measure it at two references, **A** and **B** (drag the green points); the straight line through them is turned around to give the corrected value. The lower graph is the error of the reading before and after.

**Try this**
- Give the sensor an offset only: the error before is a constant, and one point would have been enough.
- Give it a gain error only: the error grows steadily with the value, and the two-point fix cancels it.
- Add **curvature**: the error is zero at A and B and bulges in between. The test point at 50 shows what a third reference would have told you.
- Move A and B close together: any small measuring error between them is magnified outside — choose references far apart.

Units are arbitrary; the sensor and the references are perfect apart from what you set.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'b', label: 'Offset error', min: -10, max: 10, step: 0.5, value: 4 },
        { id: 'g', label: 'Gain', min: 0.8, max: 1.2, step: 0.01, value: 1.08 },
        { id: 'k', label: 'Curvature (middle bow)', min: 0, max: 6, step: 0.5, value: 0 },
        { id: 'A', label: 'Reference A at', min: 0, max: 45, step: 1, value: 10 },
        { id: 'B', label: 'Reference B at', min: 55, max: 100, step: 1, value: 90 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['g', 'Gain of the sensor'], ['b', 'Offset at zero'], ['before', 'Error at 50, before'], ['after', 'Error at 50, after'], ['worst', 'Worst error after']]);
      const raw = (t, v) => v.g * t + v.b + v.k * 4 * (t / 100) * (1 - t / 100);
      const fix = (x, v) => { const xa = raw(v.A, v), xb = raw(v.B, v); return v.A + (x - xa) * (v.B - v.A) / ((xb - xa) || 1e-9); };
      let tops = { x0: 0, y0: 0, w: 1, h: 1, X: () => 0, Y: () => 0 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        const px = 44, pw = W - px - 14, h1 = Math.round(H * 0.5), py = 18;
        const YLO = -20, YHI = 140, X = t => px + t / 100 * pw, Y = y => py + h1 - (y - YLO) / (YHI - YLO) * h1;
        tops = { px, pw, py, h1, X, Y };
        // upper graph: reading against the true value
        c.save(); c.fillStyle = C.dark ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.035)'; c.fillRect(px, py, pw, h1); c.restore();
        for (let y = 0; y <= 140; y += 20) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Math.round(Y(y)) + 0.5); c.lineTo(px + pw, Math.round(Y(y)) + 0.5); c.stroke(); c.restore(); kit.label(c, String(y), px - 6, Y(y), { size: 9.5, color: C.muted, align: 'right' }); }
        for (let t = 0; t <= 100; t += 20) kit.label(c, String(t), X(t), py + h1 + 11, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, 'what the sensor reads', px + 4, py + 8, { size: 10.5, color: C.muted });
        kit.label(c, 'true value', px + pw, py + h1 + 11, { size: 10, color: C.muted, align: 'right' });
        dashLine(c, X(0), Y(0), X(100), Y(100), C.faint, 1.2);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); for (let i = 0; i <= 100; i++) { const q = raw(i, v); if (i) c.lineTo(X(i), Y(q)); else c.moveTo(X(i), Y(q)); } c.stroke(); c.restore();
        const xa = raw(v.A, v), xb = raw(v.B, v);
        // the straight line through the two calibration points, extended
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([5, 4]); const sl = (xb - xa) / (v.B - v.A); c.beginPath(); c.moveTo(X(0), Y(xa + sl * (0 - v.A))); c.lineTo(X(100), Y(xa + sl * (100 - v.A))); c.stroke(); c.restore();
        [[v.A, xa, 'A'], [v.B, xb, 'B']].forEach(([t, y, n]) => { kit.dot(c, X(t), Y(y), 6, C.ok, C.text); kit.label(c, n, X(t), Y(y) - 13, { size: 11.5, weight: 700, color: C.ok, align: 'center' }); });
        dashLine(c, X(50), py, X(50), py + h1, C.faint, 1);
        kit.label(c, 'test point', X(50) + 4, py + h1 - 8, { size: 9.5, color: C.faint });
        kit.label(c, 'dashed grey: a perfect sensor · amber: the line through A and B', px + 4, py + h1 + 26, { size: 10, color: C.muted });
        // lower graph: error before and after
        const y2 = py + h1 + 46, h2 = H - y2 - 20;
        let m = 2;
        const before = i => raw(i, v) - i, after = i => fix(raw(i, v), v) - i;
        for (let i = 0; i <= 100; i++) m = Math.max(m, Math.abs(before(i)), Math.abs(after(i)));
        m = Math.ceil(m / 2) * 2;
        const E = e => y2 + h2 / 2 - e / m * (h2 / 2);
        c.save(); c.fillStyle = C.dark ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.035)'; c.fillRect(px, y2, pw, h2); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, E(0)); c.lineTo(px + pw, E(0)); c.stroke(); c.restore();
        kit.label(c, '+' + m, px - 6, y2 + 4, { size: 9.5, color: C.muted, align: 'right' }); kit.label(c, '−' + m, px - 6, y2 + h2 - 2, { size: 9.5, color: C.muted, align: 'right' }); kit.label(c, '0', px - 6, E(0), { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'error: before (blue) and after (green)', px + 4, y2 + 9, { size: 10.5, color: C.muted });
        [[before, C.accent], [after, C.ok]].forEach(([f, col]) => { c.save(); c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); for (let i = 0; i <= 100; i++) { const q = f(i); if (i) c.lineTo(X(i), E(q)); else c.moveTo(X(i), E(q)); } c.stroke(); c.restore(); });
        dashLine(c, X(50), y2, X(50), y2 + h2, C.faint, 1);
        [v.A, v.B].forEach(t => kit.dot(c, X(t), E(after(t)), 4, C.ok, C.text));
        let worst = 0; for (let i = 0; i <= 100; i++) worst = Math.max(worst, Math.abs(after(i)));
        const gain = v.g, off = raw(0, v);
        ro.set('g', gain.toFixed(2) + (Math.abs(gain - 1) > 0.005 ? ' (' + (100 * (gain - 1)).toFixed(0) + ' %)' : ''));
        ro.set('b', (off >= 0 ? '+' : '−') + Math.abs(off).toFixed(1));
        ro.set('before', (before(50) >= 0 ? '+' : '−') + Math.abs(before(50)).toFixed(2));
        ro.set('after', (after(50) >= 0 ? '+' : '−') + Math.abs(after(50)).toFixed(2));
        ro.set('worst', worst.toFixed(2) + ' (between 0 and 100)');
      }, box.stage);
      kit.drag(st, {
        hit: p => { if (!tops.X) return null; const v = ctl.values, a = Math.hypot(p.x - tops.X(v.A), p.y - tops.Y(raw(v.A, v))), b = Math.hypot(p.x - tops.X(v.B), p.y - tops.Y(raw(v.B, v))); return a < 16 && a <= b ? 'A' : b < 16 ? 'B' : null; },
        move: (id, p) => { const t = clamp(Math.round((p.x - tops.px) / tops.pw * 100), id === 'A' ? 0 : 55, id === 'A' ? 45 : 100); ctl.set(id, t, true); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sw-filters */
  Hyper.sim('sw-filters', {
    title: 'Filtering a noisy reading',
    blurb: `A slowly varying quantity (grey) is read fifty times a second with noise and the occasional **spike** (faint dots). The line is what the filter makes of it. Press **Step** to see how quickly each filter follows a real change.

**Try this**
- With **no filter** raise the noise: the dots scatter around the truth.
- Choose the **moving average** and enlarge N: the noise shrinks, but the line takes longer to follow the step.
- Add spikes and compare **average** with **median**: the average is dragged by every spike, the median ignores them.
- Choose the **exponential filter** and lower α: smooth and slow; the delay shown is its time constant.

The numbers are for this run only: rms means the typical distance of the line from the truth.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 450 });
      const DT = 0.02, NS = 400, YLO = 10, YHI = 110;
      const rnd = lcg(12345);
      const gauss = () => { const u = Math.max(1e-9, rnd()), w = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
      let t = 0, acc = 0, stepOn = 0;
      const truthA = [], rawA = [], outA = [];
      const truthAt = tt => 50 + 10 * Math.sin(2 * Math.PI * tt / 7);
      const mk = v => v.filter === 'ma' ? E.movingAverage(v.n) : v.filter === 'med' ? E.median(v.n) : v.filter === 'ema' ? E.ema(v.alpha) : (x => x);
      const refilter = () => { const f = mk(ctl.values); outA.length = 0; for (const x of rawA) outA.push(f(x)); filt = f; };
      let filt = x => x;
      const ctl = kit.controls(box.side, [
        { id: 'filter', type: 'select', label: 'Filter', options: [['none', 'none'], ['moving average of N', 'ma'], ['median of N', 'med'], ['exponential filter', 'ema']], value: 'med' },
        { id: 'n', label: 'N (readings)', min: 3, max: 21, step: 2, value: 5 },
        { id: 'alpha', label: 'α (exponential)', min: 0.02, max: 0.6, value: 0.2, log: true, sig: 2 },
        { id: 'noise', label: 'Noise (standard deviation)', min: 0, max: 10, step: 0.5, value: 3 },
        { id: 'spikes', label: 'Spikes: chance per reading', min: 0, max: 10, step: 0.5, value: 3, unit: '%' },
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }] }
      ], (id) => { if (id === 'step') stepOn = stepOn ? 0 : 25; else refilter(); loop.start(); });
      const ro = kit.readout(box.side, [['raw', 'Raw error (rms)'], ['out', 'After the filter (rms)'], ['delay', 'Delay after a step']]);
      const loop = kit.loop(dt => {
        const v = ctl.values;
        if (dt > 0) {
          acc += dt;
          while (acc >= DT) {
            acc -= DT; t += DT;
            const tr = truthAt(t) + stepOn;
            let x = tr + v.noise * gauss();
            if (rnd() < v.spikes / 100) x += (rnd() < 0.5 ? -1 : 1) * (25 + 20 * rnd());
            truthA.push(tr); rawA.push(x); outA.push(filt(x));
            if (truthA.length > NS) { truthA.shift(); rawA.shift(); outA.shift(); }
          }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const px = 40, pw = W - px - 12, py = 14, ph = H - py - 74;
        const X = i => px + i / (NS - 1) * pw, Y = y => py + ph - clamp((y - YLO) / (YHI - YLO), 0, 1) * ph;
        c.save(); c.fillStyle = C.dark ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.035)'; c.fillRect(px, py, pw, ph); c.restore();
        for (let y = 20; y <= 100; y += 20) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Math.round(Y(y)) + 0.5); c.lineTo(px + pw, Math.round(Y(y)) + 0.5); c.stroke(); c.restore(); kit.label(c, String(y), px - 6, Y(y), { size: 9.5, color: C.muted, align: 'right' }); }
        const off = NS - truthA.length;
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath(); truthA.forEach((y, i) => { const x = X(i + off); if (i) c.lineTo(x, Y(y)); else c.moveTo(x, Y(y)); }); c.stroke(); c.restore();
        c.save(); c.fillStyle = C.dark ? 'rgba(200,205,230,.45)' : 'rgba(80,90,130,.45)'; rawA.forEach((y, i) => { if (y >= YLO && y <= YHI) c.fillRect(X(i + off) - 1, Y(y) - 1, 2.2, 2.2); }); c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.lineJoin = 'round'; c.beginPath(); outA.forEach((y, i) => { const x = X(i + off); if (i) c.lineTo(x, Y(y)); else c.moveTo(x, Y(y)); }); c.stroke(); c.restore();
        const ly = py + ph + 16;
        kit.label(c, '— truth', px, ly, { size: 10.5, color: C.muted }); kit.label(c, '· raw readings', px + 66, ly, { size: 10.5, color: C.text2 }); kit.label(c, '— filtered', px + 168, ly, { size: 10.5, color: C.accent });
        kit.label(c, '8 s of readings, 50 a second', px + pw, ly, { size: 10, color: C.faint, align: 'right' });
        const msg = v.filter === 'none' ? 'No filter: every spike and every grain of noise goes through.' : v.filter === 'ma' ? 'Moving average: each output is the mean of the last N readings.' : v.filter === 'med' ? 'Median: the middle one of the last N readings; a lone spike never reaches the output.' : 'Exponential filter: output += α × (reading − output).';
        para(kit, c, msg, px, ly + 18, pw, 13, { size: 10.5, color: C.muted });
        // numbers
        const rms = (a, b) => { let s = 0, n = Math.min(a.length, 250); for (let i = a.length - n; i < a.length; i++) s += (a[i] - b[i]) * (a[i] - b[i]); return n ? Math.sqrt(s / n) : 0; };
        const delaySamples = v.filter === 'ma' || v.filter === 'med' ? (v.n - 1) / 2 : v.filter === 'ema' ? (1 - v.alpha) / v.alpha : 0;
        ro.set('raw', rms(rawA, truthA).toFixed(1));
        ro.set('out', rms(outA, truthA).toFixed(1));
        ro.set('delay', v.filter === 'none' ? 'none' : '≈ ' + Math.round(delaySamples * DT * 1000) + ' ms (' + (delaySamples % 1 ? delaySamples.toFixed(1) : delaySamples) + ' readings)');
      }, box.stage);
      st.onResize(() => loop.once());
      // start with some history already on the screen
      for (let i = 0; i < NS; i++) { t += DT; const tr = truthAt(t); const x = tr + ctl.values.noise * gauss() + (rnd() < ctl.values.spikes / 100 ? 35 : 0); truthA.push(tr); rawA.push(x); }
      refilter();
      loop.start();
    }
  });

})();
