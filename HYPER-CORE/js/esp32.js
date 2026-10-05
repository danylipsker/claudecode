/* HYPER-CORE · esp32.js
 *
 * What Hyper ESP32 knows about the chips, their pins and the boards built on them, and how it reasons with it
 * (Hyper.esp, kit.esp in simulations). The data itself is in esp32-chips.js (E.CHIPS, E.PINS, E.MODULES) and
 * esp32-boards.js (E.BOARDS, E.MAKERS), read from Espressif's datasheets and the makers' own pages; this file
 * holds the questions asked of it:
 *
 *   E.chip(id)  E.board(id)  E.module(id)  E.boardsOf(chipId)  E.family(maker)
 *   E.pin(chip, n)  E.parsePin('VP=36')  E.pinKind(chip, pin)  E.pinsFor(chip, need)  E.pinCaps(chip, n)
 *   E.planPins(chipOrBoard, wants, opts)        choose pins for a list of jobs, with the reasons and the warnings
 *   E.NEEDS  E.understand(text)  E.advise(needs or text, opts)     which chip suits a project, and why
 *   E.compare(ids)                               the rows of a side-by-side table
 *
 * Nothing here touches the DOM: tools/test-esp32.js runs it under Node.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const E = H.esp = H.esp || {};
  E.CHIPS = E.CHIPS || []; E.PINS = E.PINS || {}; E.MODULES = E.MODULES || []; E.BOARDS = E.BOARDS || []; E.MAKERS = E.MAKERS || [];

  const byId = (list, id) => list.find(x => x.id === id) || null;
  E.chip = id => byId(E.CHIPS, String(id || '').toLowerCase());
  E.module = id => byId(E.MODULES, id);
  E.board = id => byId(E.BOARDS, id);
  E.boardsOf = chipId => E.BOARDS.filter(b => b.chip === chipId);
  E.family = maker => E.BOARDS.filter(b => b.maker === maker);
  E.maker = id => byId(E.MAKERS, id);

  /* ================================================================ pins */
  /* a header label as data: '23' -> GPIO23; 'VP=36' -> GPIO36 printed "VP"; '3V3', 'GND', 'EN' … -> a pin that is not a GPIO */
  E.parsePin = function (raw) {
    if (raw && typeof raw === 'object') return raw;
    const s = String(raw).trim();
    let m;
    if ((m = /^(?:GPIO|IO|G)?(\d+)$/i.exec(s))) return { label: String(+m[1]), gpio: +m[1] };
    if ((m = /^(.+?)\s*=\s*(?:GPIO|IO|G)?(\d+)$/i.exec(s))) return { label: m[1].trim(), gpio: +m[2] };
    return { label: s, gpio: null };
  };
  E.pin = function (chipId, n) {
    const P = E.PINS[chipId];
    return P ? P.gpios.find(g => g.n === n) || null : null;
  };
  /* what a pin mostly is, for colouring a pinout: power gnd ctrl nc | flash strap usb uart input jtag | adc touch gpio */
  E.pinKind = function (chipId, p) {
    p = E.parsePin(p);
    if (p.gpio == null) {
      const L = p.label.toUpperCase();
      if (/^(GND|G|AGND|GND\d?)$/.test(L) || L.includes('GND')) return 'gnd';
      if (/^(EN|RST|RESET|CHIP_PU|CHIP_EN|NRST|RUN)$/.test(L)) return 'ctrl';
      if (/^(NC|N\.C\.|N\/C|-)$/.test(L)) return 'nc';
      if (/^(A0|ADC|TOUT)$/.test(L)) return 'adc';
      if (/^(\+?\d(\.\d)?V\d?|\dV\d|3V3|3V|5V|VIN|VBUS|VCC\w*|VDD\w*|VBAT|BAT\+?|BATT|USB|VEXT|VE|VSYS|VUSB|V\+|VOUT|HPWR|HVIN|5VIN|5VOUT|5V_\w+|AREF)$/.test(L)) return 'power';
      return 'nc';
    }
    const g = E.pin(chipId, p.gpio);
    if (!g) return 'gpio';
    if (g.flash) return 'flash';
    if (g.strap) return 'strap';
    if (g.usb) return 'usb';
    if (g.uart0) return 'uart';
    if (g.dir === 'I') return 'input';
    if (g.safe === 'caution' && g.jtag) return 'jtag';
    if (g.dac) return 'dac';
    if (g.adc) return 'adc';
    if (g.touch) return 'touch';
    return 'gpio';
  };
  /* everything a GPIO can do, as short tags: ['ADC1_CH6', 'TOUCH9', 'RTC_GPIO9', 'input only', 'strapping', …] */
  E.pinCaps = function (chipId, n) {
    const g = E.pin(chipId, n);
    if (!g) return [];
    const out = [];
    if (g.dir === 'I') out.push('input only');
    if (g.adc) out.push(g.adc);
    if (g.dac) out.push(g.dac);
    if (g.touch) out.push(g.touch);
    if (g.rtc) out.push(g.rtc);
    if (g.uart0) out.push('UART0 ' + g.uart0);
    if (g.usb) out.push('USB ' + g.usb);
    if (g.jtag) out.push('JTAG ' + g.jtag);
    if (g.strap) out.push('strapping');
    if (g.flash) out.push('flash / PSRAM');
    return out;
  };
  /* the GPIO numbers of a chip that suit a job. need: 'output' 'input' 'safe' 'adc' 'adc-wifi' 'touch' 'dac' 'wake' 'any' */
  E.pinsFor = function (chipId, need) {
    const P = E.PINS[chipId];
    if (!P) return [];
    const adc1 = g => g.adc && /^ADC1/.test(g.adc);
    const test = {
      any: g => !g.flash,
      output: g => !g.flash && g.dir !== 'I',
      input: g => !g.flash,
      safe: g => g.safe === 'yes',
      adc: g => !!g.adc && !g.flash,
      // on the original ESP32 only ADC1 works while Wi-Fi is on; later chips arbitrate or have a single ADC
      'adc-wifi': g => !g.flash && (chipId === 'esp32' ? adc1(g) : !!g.adc && (adc1(g) || !P.gpios.some(adc1))),
      touch: g => !!g.touch && !g.flash,
      dac: g => !!g.dac,
      wake: g => !!g.rtc && !g.flash
    }[need] || (() => false);
    return P.gpios.filter(test).map(g => g.n);
  };
  /* a one-line verdict on using a GPIO as plain I/O */
  E.pinVerdict = function (chipId, n) {
    const g = E.pin(chipId, n);
    if (!g) return { level: 'none', text: 'This chip has no GPIO' + n + '.' };
    if (g.flash) return { level: 'avoid', text: g.note || 'Wired to the flash memory: leave it alone.' };
    if (g.safe === 'caution') return { level: 'caution', text: g.note || 'Usable, with care.' };
    return { level: 'yes', text: g.note || 'A plain GPIO: free to use.' };
  };

  /* choose pins for a list of jobs.
       target: a chip id, or a board (then only pins on its headers are used)
       wants:  [{ what: 'i2c' | 'spi' | 'uart' | 'adc' | 'touch' | 'dac' | 'out' | 'in' | 'pwm' | 'button' | 'wake' | 'onewire' | 'neopixel' | 'servo' | 'i2s', n (how many, default 1), name }]
       opts:   { wifi: true (analog inputs must work with Wi-Fi on), keepUart0: true, keepUsb: true }
     -> { assign: [{ what, role, name, gpio, why, level }], warnings: [...], free: [gpio…], cpp, py } */
  E.planPins = function (target, wants, opts) {
    opts = Object.assign({ wifi: true, keepUart0: true, keepUsb: true }, opts || {});
    const board = typeof target === 'object' ? target : E.board(target);
    const chipId = board ? board.chip : target;
    const P = E.PINS[chipId];
    const out = { assign: [], warnings: [], free: [], cpp: '', py: '', chip: chipId };
    if (!P) { out.warnings.push('No pin table for "' + chipId + '".'); return out; }
    let avail = P.gpios.filter(g => !g.flash);
    if (board && board.headers && board.headers.length) {
      const onBoard = new Set(board.headers.flatMap(h => h.pins).map(E.parsePin).filter(p => p.gpio != null).map(p => p.gpio));
      avail = avail.filter(g => onBoard.has(g.n));
    }
    const used = new Set();
    // what the board itself has wired to a GPIO (display bus, camera, SD card, radio, LED …), from its pin record: gpio -> the record's key.
    // The buses the board offers to the user (sda, scl, mosi …), its headers and its ratings are not "taken".
    const onboard = new Map();
    if (board && board.pins) for (const [k, v] of Object.entries(board.pins)) {
      if (/header|free|expansion|grove|qwiic|stemma|port_?[abc]?$|_max_|_ma$|_mhz$|^note|arduino_wire|^(?:i2c_|spi_|uart\d?_|default_)?(?:sda|scl|mosi|miso|sck|ss|cs|tx|rx)$|^[ad]\d+$|^mt(?:do|di|ck|ms)$|^(?:dac|adc|touch|t|gpio|io)\d*$/i.test(k)) continue;
      const nums = typeof v === 'number' ? [v] : [...String(v).matchAll(/(?:GPIO|IO)(\d{1,2})\b|(?<![A-Za-z0-9.])(\d{1,2})(?![A-Za-z0-9.])/g)].map(m => +(m[1] || m[2]));
      for (const n of nums) if (!onboard.has(n)) onboard.set(n, k.replace(/_/g, ' '));
    }
    if (board) for (const t of board.onboard || []) {                 // "Addressable RGB LED on GPIO38 (v1.1; was GPIO48 in v1.0)": the first pin named
      const m = /\b(?:GPIO|IO)\s?(\d{1,2})\b/.exec(String(t));
      if (m && !onboard.has(+m[1])) onboard.set(+m[1], String(t).replace(/\s*\(.*$/, '').replace(/\s+on\s+(?:GPIO|IO)\s?\d+.*$/i, ''));
    }
    const D = Object.assign({}, P.defaults || {});
    const boardBus = new Set();                    // the pins the board itself names for its buses
    if (board && board.pins) for (const [k, v] of Object.entries(board.pins)) {
      if (typeof v !== 'number') continue;
      const m = /^(?:i2c_|spi_|uart_|default_|arduino_wire_default_)?(sda|scl|mosi|miso|sck|ss|tx|rx)$/i.exec(k);
      if (m) { D[m[1].toLowerCase()] = v; boardBus.add(v); }
    }
    for (const k of Object.keys(D)) if (onboard.has(D[k]) && !boardBus.has(D[k])) delete D[k];   // the chip's default pin does something else on this board
    // how much we would rather not use a pin for an ordinary job: 0 free, higher = keep for last
    const cost = g => (onboard.has(g.n) ? 14 : 0) + (g.safe === 'avoid' ? 5 : g.safe === 'caution' && g.dir !== 'I' && !g.jtag ? 3.5 : g.safe === 'caution' && g.dir !== 'I' ? 1.5 : 0) + (g.strap ? 6 : 0) + (g.usb ? (opts.keepUsb ? 9 : 2) : 0) + (g.uart0 ? (opts.keepUart0 ? 9 : 2) : 0) + (g.jtag ? 2 : 0) + (g.glitch ? 1 : 0) + (g.dir === 'I' ? 3 : 0) +
      // keep scarce abilities for the jobs that need them
      (g.dac ? 2 : 0) + (g.touch ? 0.6 : 0) + (g.adc ? (/^ADC1/.test(g.adc) ? 0.8 : 0.3) : 0);
    const take = (what, role, name, filter, prefer, why) => {
      const cands = avail.filter(g => !used.has(g.n) && filter(g));
      if (!cands.length) { out.warnings.push('No pin left for ' + (name || what) + (role ? ' (' + role + ')' : '') + '.'); out.assign.push({ what, role, name, gpio: null, why: 'nothing suitable is free', level: 'none' }); return null; }
      cands.sort((a, b) => (prefer ? prefer(a) - prefer(b) : 0) || cost(a) - cost(b) || a.n - b.n);
      const g = cands[0];
      used.add(g.n);
      const noted = g.safe !== 'yes' && g.dir !== 'I' && !g.strap && !g.usb && !g.uart0 && !g.jtag;   // the pin table has a reservation (PSRAM, crystal, 1.8 V …); input-only and JTAG pins are fine for ordinary jobs
      const taken = onboard.has(g.n) && !boardBus.has(g.n);                        // unless it is the board's own pin for a bus
      const level = g.strap || g.usb || g.uart0 || noted || taken ? 'caution' : 'yes';
      const extra = taken ? ' — already used on this board (' + onboard.get(g.n) + ')' : g.strap ? ' — a strapping pin: ' + (g.note || 'its level at reset matters') : g.uart0 ? ' — shared with the serial console' : g.usb ? ' — shared with USB' : noted && g.note ? ' — check: ' + g.note : '';
      out.assign.push({ what, role, name, gpio: g.n, why: (typeof why === 'function' ? why(g) : why) + extra, level });
      if (level === 'caution') out.warnings.push('GPIO' + g.n + ' for ' + (name || what) + (role ? ' ' + role : '') + ': ' + (taken ? 'this board already uses it (' + onboard.get(g.n) + '); nothing else is free.' : g.strap ? 'strapping pin — make sure nothing pulls it the wrong way at power-up.' : g.uart0 ? 'it is the UART0 ' + g.uart0 + ' pin used for flashing and the serial monitor.' : g.usb ? 'it is a USB data pin.' : (g.note || 'the pin table has a reservation about this pin.')));
      return g;
    };
    const isOut = g => g.dir !== 'I';
    const def = n => g => (g.n === n ? -10 : 0);
    // scarce resources first, so ordinary jobs do not take them
    const ORDER = ['dac', 'touch', 'adc', 'wake', 'i2c', 'spi', 'uart', 'i2s', 'neopixel', 'servo', 'pwm', 'onewire', 'button', 'in', 'out'];
    const jobs = [];
    wants.forEach((w, i) => { for (let k = 0; k < (w.n || 1); k++) jobs.push(Object.assign({}, w, { idx: i, k, name: (w.name || w.what) + ((w.n || 1) > 1 ? ' ' + (k + 1) : '') })); });
    jobs.sort((a, b) => ORDER.indexOf(a.what) - ORDER.indexOf(b.what) || a.idx - b.idx);
    for (const j of jobs) {
      switch (j.what) {
        case 'dac': take('dac', null, j.name, g => !!g.dac, null, g => g.dac + ': a true analogue output'); break;
        case 'touch': take('touch', null, j.name, g => !!g.touch, null, g => g.touch + ' capacitive channel'); break;
        case 'adc': {
          const wifiOk = E.pinsFor(chipId, 'adc-wifi');
          take('adc', null, j.name, g => !!g.adc && (!opts.wifi || wifiOk.includes(g.n)), g => (g.dir === 'I' ? -1 : 0), g => g.adc + (opts.wifi && chipId === 'esp32' ? ' (ADC1 keeps working with Wi-Fi on)' : '') + (g.dir === 'I' ? ', an input-only pin — a good use for it' : ''));
          break;
        }
        case 'wake': take('wake', null, j.name, g => !!g.rtc, null, g => g.rtc + ': can wake the chip from deep sleep'); break;
        case 'i2c':
          take('i2c', 'SDA', j.name, isOut, def(D.sda), g => g.n === D.sda ? (board ? 'the SDA pin of this board' : 'the default SDA of the Arduino core') : 'any output-capable GPIO can be SDA');
          take('i2c', 'SCL', j.name, isOut, def(D.scl), g => g.n === D.scl ? (board ? 'the SCL pin of this board' : 'the default SCL of the Arduino core') : 'any output-capable GPIO can be SCL');
          break;
        case 'spi':
          take('spi', 'SCK', j.name, isOut, def(D.sck), g => g.n === D.sck ? 'the default SCK (fast IO_MUX route)' : 'routed through the GPIO matrix');
          take('spi', 'MOSI', j.name, isOut, def(D.mosi), g => g.n === D.mosi ? 'the default MOSI' : 'routed through the GPIO matrix');
          take('spi', 'MISO', j.name, () => true, g => (g.n === D.miso ? -10 : g.dir === 'I' ? -1 : 0), g => g.n === D.miso ? 'the default MISO' : 'an input: any GPIO');
          take('spi', 'CS', j.name, isOut, def(D.ss), g => g.n === D.ss ? 'the default chip select' : 'chip select: any output');
          break;
        case 'uart':
          take('uart', 'TX', j.name, g => isOut(g) && !g.uart0, null, 'a second serial port: any output-capable GPIO');
          take('uart', 'RX', j.name, g => !g.uart0, g => (g.dir === 'I' ? -1 : 0), 'receive: any GPIO, an input-only pin will do');
          break;
        case 'i2s':
          take('i2s', 'BCLK', j.name, isOut, null, 'bit clock: any output'); take('i2s', 'WS', j.name, isOut, null, 'word select: any output'); take('i2s', 'DATA', j.name, isOut, null, 'data: any GPIO');
          break;
        case 'neopixel': take('neopixel', 'DIN', j.name, isOut, null, 'one data line driven by the RMT peripheral: any output'); break;
        case 'servo': take('servo', 'signal', j.name, isOut, null, '50 Hz PWM from LEDC: any output'); break;
        case 'pwm': take('pwm', null, j.name, isOut, null, 'LEDC can drive any output-capable GPIO'); break;
        case 'onewire': take('onewire', 'DQ', j.name, isOut, null, 'open-drain data with a 4.7 kΩ pull-up: any output-capable GPIO'); break;
        case 'button': take('button', null, j.name, g => g.dir !== 'I' || false, null, 'input with the internal pull-up'); break;
        case 'in': take('in', null, j.name, () => true, g => (g.dir === 'I' ? -1 : 0), g => g.dir === 'I' ? 'an input-only pin (add an external pull resistor if needed)' : 'digital input'); break;
        default: take('out', null, j.name, isOut, null, 'digital output');
      }
    }
    out.assign.sort((a, b) => jobs.findIndex(j => j.name === a.name) - jobs.findIndex(j => j.name === b.name));
    out.free = avail.filter(g => !used.has(g.n) && g.safe === 'yes').map(g => g.n);
    const ident = a => (a.name + (a.role ? '_' + a.role : '')).toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const got = out.assign.filter(a => a.gpio != null);
    out.cpp = got.map(a => 'const int PIN_' + ident(a) + ' = ' + a.gpio + ';' + '   // ' + a.why.split(' — ')[0]).join('\n');
    out.py = got.map(a => 'PIN_' + ident(a) + ' = ' + a.gpio + '   # ' + a.why.split(' — ')[0]).join('\n');
    if (chipId === 'esp32' && opts.wifi && wants.some(w => w.what === 'adc') && E.pinsFor(chipId, 'adc-wifi').length < wants.filter(w => w.what === 'adc').reduce((a, w) => a + (w.n || 1), 0)) out.warnings.push('More analogue inputs than ADC1 has pins: the rest would be on ADC2, which cannot be read while Wi-Fi is on.');
    return out;
  };

  /* ================================================================ which chip for the project?
     A need: { id, group, label, words: [what a person might write], must (a chip that fails it is ruled out), weight,
               test(chip) -> 0…1 (how well the chip meets it), yes(chip) / no(chip) -> the sentence shown, board: tag a board should carry } */
  const has = (list, x) => Array.isArray(list) && list.some(v => String(v).toLowerCase().includes(x));
  const N = (id, group, label, words, o) => Object.assign({ id, group, label, words, must: true, weight: 3 }, o);
  E.NEEDS = [
    /* ---- connectivity */
    N('wifi', 'Connectivity', 'Wi-Fi', ['wifi', 'wi-fi', 'wlan', 'internet', 'web page', 'web server', 'webserver', 'website', 'cloud', 'mqtt', 'http', 'https', 'online', 'router', 'home assistant', 'telegram', 'email', 'e-mail', 'weather forecast', 'api', 'dashboard', 'ntp', 'ota', 'over the air', 'remote monitoring', 'smartphone app', 'alexa', 'google home', 'streaming', 'iot', 'weather station', 'upload', 'notification', 'from anywhere', 'web interface', 'web app', 'browser'],
      { test: c => c.wifi ? 1 : 0, yes: c => 'Wi-Fi ' + (c.wifi.gen >= 6 ? '6' : '4') + ' (' + c.wifi.bands.join(' and ') + ' GHz)', no: () => 'has no Wi-Fi radio' }),
    N('link', 'Connectivity', 'Talks to a phone or computer (any radio)', ['phone', 'smartphone', 'tablet', 'app', 'wireless', 'wirelessly', 'remotely', 'laptop', 'pc'],
      { test: c => (c.wifi || c.bt ? 1 : 0), yes: c => [c.wifi ? 'Wi-Fi' : null, c.bt ? 'Bluetooth' : null].filter(Boolean).join(' and ') + ' to reach a phone or computer', no: () => 'has no radio of its own: wireless needs a companion chip' }),
    N('wifi5', 'Connectivity', '5 GHz Wi-Fi', ['5 ghz', '5ghz', '5 g wifi', 'dual band', 'dual-band', 'crowded 2.4'],
      { test: c => c.wifi && c.wifi.bands.includes(5) ? 1 : 0, yes: () => 'dual-band Wi-Fi: 2.4 and 5 GHz', no: () => 'Wi-Fi on 2.4 GHz only' }),
    N('wifi6', 'Connectivity', 'Wi-Fi 6 (802.11ax)', ['wifi 6', 'wi-fi 6', '802.11ax', 'target wake time', 'twt', 'ofdma'],
      { must: false, weight: 2, test: c => c.wifi && c.wifi.gen >= 6 ? 1 : 0, yes: () => 'Wi-Fi 6 with target wake time for battery devices', no: () => 'Wi-Fi 4 only' }),
    N('ble', 'Connectivity', 'Bluetooth LE', ['ble', 'bluetooth low energy', 'bluetooth le', 'bluetooth', 'beacon', 'ibeacon', 'phone app', 'nrf connect', 'heart rate', 'gatt', 'wearable', 'fitness', 'smartwatch', 'smart watch', 'tracker tag', 'proximity', 'presence detection'],
      { test: c => c.bt ? 1 : 0, yes: c => 'Bluetooth LE ' + c.bt.le, no: () => 'has no Bluetooth' }),
    N('btclassic', 'Connectivity', 'Bluetooth Classic (audio, serial)', ['bluetooth speaker', 'bluetooth audio', 'a2dp', 'bluetooth headphones', 'bluetooth headset', 'bluetooth serial', 'spp', 'hc-05', 'classic bluetooth', 'bluetooth classic', 'obd', 'elm327', 'hands-free', 'hfp', 'car stereo', 'bluetooth music'],
      { test: c => c.bt && c.bt.classic ? 1 : 0, yes: () => 'Bluetooth Classic (BR/EDR): A2DP audio and the serial port profile', no: c => c.bt ? 'Bluetooth LE only — no Classic, so no A2DP audio and no SPP' : 'has no Bluetooth' }),
    N('longrange', 'Connectivity', 'Long-range Bluetooth LE (coded PHY)', ['long range bluetooth', 'long-range ble', 'coded phy', 'ble long range'],
      { must: false, weight: 2, test: c => c.bt && has(c.bt.feat, 'coded') ? 1 : 0, yes: () => 'Bluetooth 5 coded PHY for range', no: () => 'no coded PHY' }),
    N('zigbee', 'Connectivity', 'Zigbee', ['zigbee', 'zigbee2mqtt', 'zha', 'philips hue', 'ikea tradfri', 'aqara'],
      { test: c => c.ieee802154 ? 1 : 0, yes: () => 'an 802.15.4 radio: Zigbee 3.0', no: () => 'no 802.15.4 radio, so no Zigbee' }),
    N('thread', 'Connectivity', 'Thread', ['thread', 'openthread', 'border router', 'mesh ipv6'],
      { test: c => c.ieee802154 ? 1 : 0, yes: () => 'an 802.15.4 radio: Thread (OpenThread)', no: () => 'no 802.15.4 radio, so no Thread' }),
    N('matter', 'Connectivity', 'Matter', ['matter', 'apple home', 'homekit', 'google home', 'smartthings', 'works with alexa'],
      { test: c => (c.wifi && c.bt) || (c.ieee802154 && c.bt) ? 1 : (c.wifi ? 0.5 : 0), yes: c => 'Matter over ' + [c.wifi ? 'Wi-Fi' : null, c.ieee802154 ? 'Thread' : null].filter(Boolean).join(' or ') + ', commissioned over Bluetooth LE', no: c => c.wifi ? 'Matter over Wi-Fi is possible, but there is no Bluetooth LE for commissioning' : 'no radio that Matter can use' }),
    N('espnow', 'Connectivity', 'ESP-NOW (board to board)', ['esp-now', 'espnow', 'esp now', 'peer to peer', 'peer-to-peer', 'p2p', 'board to board', 'between two esp', 'without a router', 'no router', 'remote control', 'walkie', 'two boards', 'several boards', 'sensor nodes', 'wireless sensor network'],
      { test: c => c.wifi ? 1 : 0, yes: () => 'ESP-NOW: boards talk directly over the Wi-Fi radio, no router', no: () => 'ESP-NOW needs the Wi-Fi radio' }),
    N('lora', 'Connectivity', 'LoRa / LoRaWAN', ['lora', 'lorawan', 'meshtastic', 'kilometres', 'kilometers', 'long distance', 'ttn', 'the things network', 'helium', 'farm', 'field sensor', 'remote area', 'off-grid', 'off grid'],
      { must: false, weight: 3, test: c => (c.spi >= 1 ? 1 : 0.5), yes: () => 'LoRa is an extra radio (SX1262 / SX1276) on SPI — choose a board that carries one', no: () => '', board: 'lora' }),
    N('cellular', 'Connectivity', 'Mobile network (LTE-M, NB-IoT, 4G)', ['cellular', 'sim card', 'gsm', 'lte', '4g', 'nb-iot', 'lte-m', 'sms', 'mobile network', 'no wifi available', 'vehicle tracker'],
      { must: false, weight: 3, test: c => (c.uart >= 2 ? 1 : 0.6), yes: () => 'a modem (SIM7000, A7670 …) on a spare UART — choose a board that carries one', no: () => '', board: 'cell' }),
    N('ethernet', 'Connectivity', 'Wired Ethernet / PoE', ['ethernet', 'wired network', 'poe', 'power over ethernet', 'rj45', 'lan cable', 'modbus tcp'],
      { must: false, weight: 3, test: c => c.eth ? 1 : (c.spi >= 1 ? 0.6 : 0), yes: c => c.eth ? 'a built-in Ethernet MAC (add a PHY such as LAN8720)' : 'Ethernet through an SPI chip (W5500)', no: () => '', board: 'eth' }),
    N('can', 'Connectivity', 'CAN bus (TWAI)', ['can bus', 'canbus', 'can-bus', 'twai', 'obd-ii', 'obd2', 'vehicle bus', 'canopen', 'j1939', 'nmea 2000', 'nmea2000'],
      { test: c => c.twai ? 1 : 0, yes: c => c.twai + ' CAN (TWAI) controller' + (c.twai > 1 ? 's' : '') + ' — add a transceiver', no: () => 'has no CAN controller' }),
    N('rs485', 'Connectivity', 'RS-485 / Modbus', ['rs485', 'rs-485', 'modbus', 'dmx', 'industrial sensor', 'plc'],
      { must: false, weight: 2, test: c => (c.uart >= 2 ? 1 : 0.5), yes: () => 'a spare UART for an RS-485 transceiver', no: () => 'only one UART to share with the console' }),
    N('usbdev', 'Connectivity', 'USB device (keyboard, mouse, MIDI, drive)', ['usb keyboard', 'macro keyboard', 'usb macro', 'custom keyboard', 'mechanical keyboard', 'macro pad', 'macropad', 'hid', 'usb hid', 'game controller', 'gamepad', 'joystick usb', 'usb midi', 'midi controller', 'usb mouse', 'mass storage', 'usb drive', 'stream deck', 'rubber ducky', 'usb device', 'keyboard emulator'],
      { test: c => has(c.usb, 'otg') ? 1 : 0, yes: () => 'USB OTG: it can be a keyboard, mouse, MIDI device or drive', no: c => has(c.usb, 'serial') ? 'its USB is a fixed serial/JTAG port: it cannot pretend to be a keyboard' : 'no native USB' }),
    N('usbhost', 'Connectivity', 'USB host (plug devices into it)', ['usb host', 'read a usb keyboard', 'usb camera', 'uvc', 'usb stick', 'flash drive reader', 'barcode scanner usb'],
      { test: c => has(c.usb, 'otg') ? (has(c.usb, 'high') ? 1 : 0.8) : 0, yes: c => has(c.usb, 'high') ? 'high-speed USB host' : 'full-speed USB host', no: () => 'cannot be a USB host' }),

    /* ---- people: screens, touch, sound, cameras */
    N('display', 'Screen and controls', 'A small display (OLED, small TFT, character LCD)', ['display', 'screen', 'oled', 'lcd', 'tft', 'show the', 'readout', 'clock', 'e-paper', 'epaper', 'e-ink', 'eink', 'status screen'],
      { must: false, weight: 1, test: c => c.id === 'esp32-c2' ? 0.7 : 1, yes: () => 'drives OLED and SPI TFT screens over I2C or SPI', no: () => '', board: 'display' }),
    N('bigdisplay', 'Screen and controls', 'A large or fast colour display (4″ and up, animations)', ['large display', 'big display', 'big screen', '7 inch', '7"', '5 inch', '4.3', 'hmi', 'control panel', 'touch panel', 'gui', 'lvgl', 'graphical interface', 'user interface', 'smooth animation', 'video', 'games console', 'retro game', 'emulator', '800x480', '1024x600'],
      { must: false, weight: 4, test: c => has(c.lcd, 'dsi') || has(c.lcd, 'rgb') ? 1 : has(c.lcd, 'i80') ? 0.6 : 0.25, yes: c => has(c.lcd, 'dsi') ? 'MIPI-DSI for phone-class panels, with a pixel accelerator' : has(c.lcd, 'rgb') ? 'a parallel RGB interface that streams 800 × 480 from PSRAM' : 'an 8-bit parallel LCD interface', no: () => 'SPI displays only: fine to 320 × 240, slow beyond', board: 'bigdisplay' }),
    N('touchscreen', 'Screen and controls', 'A touch screen', ['touch screen', 'touchscreen', 'touch display', 'touch panel', 'tap the screen', 'swipe'],
      { must: false, weight: 2, test: () => 1, yes: () => 'touch controllers (XPT2046, FT6336, GT911) on SPI or I2C', no: () => '', board: 'touch' }),
    N('touchpins', 'Screen and controls', 'Capacitive touch pads (no screen)', ['touch pad', 'touch button', 'touch sensor', 'capacitive', 'touch sensing', 'touch-sensitive', 'touch lamp', 'fruit piano'],
      { test: c => c.touch ? 1 : 0, yes: c => c.touch + ' capacitive touch channels built in', no: () => 'no touch-sensing pins (needs an external chip such as MPR121)' }),
    N('camera', 'Screen and controls', 'A camera', ['camera', 'video stream', 'photo', 'picture', 'webcam', 'time-lapse', 'timelapse', 'doorbell', 'surveillance', 'qr code', 'barcode', 'face recognition', 'face detection', 'image recognition', 'object detection', 'vision', 'bird feeder', 'wildlife'],
      { test: c => has(c.cam, 'csi') ? 1 : !has(c.cam, 'dvp') ? 0 : has(c.cam, 'i2s') ? 0.76 : 0.93, yes: c => has(c.cam, 'csi') ? 'MIPI-CSI camera input with an image signal processor' : 'a parallel (DVP) camera interface for OV2640 / OV5640', no: () => 'no camera interface', board: 'camera' }),
    N('audioout', 'Screen and controls', 'Sound output (speaker, music)', ['speaker', 'music', 'mp3', 'play sound', 'audio', 'internet radio', 'web radio', 'alarm sound', 'voice prompt', 'text to speech', 'tts'],
      { must: false, weight: 2, test: c => c.i2s ? 1 : (c.dac ? 0.6 : 0.3), yes: c => 'I2S for a digital amplifier (MAX98357)' + (c.dac ? ', or the built-in DAC' : ''), no: () => 'no I2S: only PWM beeps', board: 'speaker' }),
    N('mic', 'Screen and controls', 'A microphone / voice control', ['microphone', 'voice', 'speech', 'wake word', 'voice assistant', 'voice control', 'sound level', 'clap', 'recording', 'record audio', 'intercom', 'walkie-talkie'],
      { must: false, weight: 3, test: c => c.i2s ? (c.ai ? 1 : 0.6) : 0, yes: c => c.ai ? 'I2S microphones, and the speed to run wake-word and command recognition on the chip' : 'I2S microphones (recognition would run elsewhere)', no: () => 'no I2S for a digital microphone', board: 'mic' }),

    /* ---- sensing and driving */
    N('adc', 'Sensors and outputs', 'Analogue inputs', ['analog', 'analogue', 'potentiometer', 'adc', 'voltage measurement', 'measure voltage', 'thermistor', 'ldr', 'photoresistor', 'soil moisture', 'battery voltage', 'joystick', 'current sensor', 'ph sensor', 'load cell', 'pressure sensor'],
      { must: false, weight: 2, test: c => !c.adc ? 0 : Math.min(1, c.adc.ch / 8) * (c.id === 'esp8266' ? 0.4 : 1), yes: c => c.adc.ch + ' ADC channel' + (c.adc.ch > 1 ? 's' : '') + (c.id === 'esp32' ? ' (use ADC1: ADC2 is blocked while Wi-Fi runs)' : ''), no: () => 'no ADC' }),
    N('dac', 'Sensors and outputs', 'True analogue output (DAC)', ['dac', 'analog output', 'analogue output', 'waveform generator', 'signal generator', 'function generator', 'control voltage', '0-10v output'],
      { test: c => c.dac ? 1 : 0, yes: c => c.dac + ' built-in 8-bit DAC channels', no: () => 'no DAC (PWM with a filter, or an external MCP4725)' }),
    N('manygpio', 'Sensors and outputs', 'Many pins (20 or more signals)', ['many pins', 'lots of pins', 'many sensors', 'many buttons', 'many relays', 'many leds', '16 relays', '8 relays', 'keyboard matrix', 'lots of io', 'many inputs', 'many outputs', 'cnc', '3d printer', 'multi-axis'],
      { must: false, weight: 3, test: c => Math.max(0, Math.min(1, (c.gpio - 10) / 25)), yes: c => c.gpio + ' GPIOs', no: c => 'only ' + c.gpio + ' GPIOs — an I/O expander would be needed' }),
    N('leds', 'Sensors and outputs', 'LED strips and addressable LEDs', ['led strip', 'neopixel', 'ws2812', 'sk6812', 'addressable led', 'rgb led', 'wled', 'led matrix', 'ambilight', 'christmas lights', 'pixel'],
      { must: false, weight: 1, test: c => c.rmt ? 1 : 0.6, yes: () => 'the RMT peripheral generates the exact timing addressable LEDs need', no: () => 'no RMT: timing by bit-banging' }),
    N('motor', 'Sensors and outputs', 'Motors (DC, stepper, servo, brushless)', ['motor', 'stepper', 'servo', 'robot', 'rover', 'robot car', 'rc car', 'wheels', 'drone', 'quadcopter', 'bldc', 'esc', 'h-bridge', 'conveyor', 'cnc', '3d printer', 'pan tilt', 'pan-tilt', 'robot arm', 'robotic arm', 'actuator', 'linear actuator', 'balancing', 'foc'],
      { must: false, weight: 3, test: c => c.mcpwm ? 1 : 0.6, yes: c => c.mcpwm ? 'a motor-control PWM unit (dead time, fault inputs, capture) besides LEDC' : 'LEDC PWM drives servos and H-bridges', no: () => '' }),
    N('encoder', 'Sensors and outputs', 'Encoders and pulse counting', ['encoder', 'quadrature', 'pulse counter', 'flow meter', 'flow sensor', 'tachometer', 'rpm', 'anemometer', 'rain gauge', 'geiger', 'energy meter pulse', 'odometer'],
      { must: false, weight: 2, test: c => c.pcnt ? 1 : 0.4, yes: c => c.pcnt + ' hardware pulse counters (quadrature decoding without interrupts)', no: () => 'no pulse-counter unit: counting by interrupts' }),
    N('sdcard', 'Sensors and outputs', 'SD card and data logging', ['sd card', 'microsd', 'micro sd', 'data logger', 'datalogger', 'logger', 'logging', 'store data', 'stores data', 'csv', 'record data'],
      { must: false, weight: 1, test: c => (has(c.sdio, 'host') ? 1 : 0.8), yes: c => has(c.sdio, 'host') ? 'an SD/MMC host for fast card access (SPI works too)' : 'SD cards over SPI', no: () => '', board: 'sd' }),
    N('precise', 'Sensors and outputs', 'Precise timing, IR remote, custom protocols', ['infrared remote', 'ir remote', 'ir transmitter', 'ir receiver', '433', 'rf remote', 'dshot', 'one-wire', 'precise timing', 'pulse train', 'custom protocol'],
      { must: false, weight: 1, test: c => c.rmt ? 1 : 0.4, yes: () => 'RMT sends and measures pulse trains to the microsecond', no: () => 'no RMT' }),

    /* ---- power */
    N('battery', 'Power', 'Runs on a battery for weeks or months', ['battery', 'batteries', 'battery-powered', 'battery powered', 'low power', 'low-power', 'deep sleep', 'solar', 'months', 'years', 'energy harvesting', 'portable', 'coin cell', 'aa cells', 'remote sensor', 'outdoor sensor', 'wireless sensor', 'no mains', 'off-grid', 'off grid', 'wearable'],
      { must: false, weight: 4, test: c => c.sleepUa == null ? 0.5 : c.sleepUa <= 6 ? 1 : c.sleepUa <= 9 ? 0.9 : c.sleepUa <= 12 ? 0.8 : c.sleepUa <= 25 ? 0.6 : 0.3, yes: c => 'about ' + c.sleepUa + ' µA in deep sleep (the chip alone — the board\'s regulator and LEDs usually dominate)', no: () => 'no deep sleep worth the name', board: 'battery' }),
    N('coincell', 'Power', 'Runs on a coin cell', ['coin cell', 'cr2032', 'button cell', 'tag', 'beacon on a coin'],
      { must: false, weight: 4, test: c => c.wifi && !c.ieee802154 ? 0.25 : (c.ieee802154 && !c.wifi ? 1 : 0.6), yes: c => !c.wifi ? 'no Wi-Fi bursts: the radio peaks stay within what a small cell can give' : 'possible for Bluetooth LE or Thread only — Wi-Fi peaks of 300 mA collapse a coin cell', no: () => '' }),
    N('mains', 'Power', 'Switches loads with relays (lamps, pumps, mains)', ['relay', 'mains', '230v', '220v', '110v', '120v', 'ac load', 'light switch', 'smart plug', 'socket', 'dimmer', 'heater', 'boiler', 'appliance'],
      { must: false, weight: 1, test: () => 1, yes: () => 'any chip can drive a relay or solid-state relay through a transistor — the mains side needs proper isolation and a qualified hand', no: () => '', board: 'relay' }),

    /* ---- computing */
    N('ai', 'Computing', 'On-device AI (vision, voice, TinyML)', ['ai', 'machine learning', 'tinyml', 'neural', 'tensorflow', 'edge impulse', 'face recognition', 'object detection', 'wake word', 'keyword spotting', 'gesture recognition', 'anomaly detection', 'classification', 'speech recognition', 'llm'],
      { must: false, weight: 4, test: c => c.id === 'esp32-p4' ? 1 : c.ai ? 0.95 : c.cores > 1 ? 0.5 : 0.25, yes: c => c.ai ? c.ai : 'two cores: small models run, slowly', no: () => 'a single modest core: only tiny models' }),
    N('speed', 'Computing', 'Heavy computing, several things at once', ['fast', 'dual core', 'dual-core', 'multitasking', 'real time', 'real-time', 'high speed', 'dsp', 'fft', 'audio processing', 'signal processing', 'emulator', 'high performance'],
      { must: false, weight: 2, test: c => Math.min(1, c.cores * c.mhz / 480) * (c.fpu ? 1 : 0.8), yes: c => c.cores + ' core' + (c.cores > 1 ? 's' : '') + ' at ' + c.mhz + ' MHz' + (c.fpu ? ' with a floating-point unit' : ''), no: c => 'one core at ' + c.mhz + ' MHz' }),
    N('memory', 'Computing', 'A lot of memory (images, audio buffers, big web pages)', ['psram', 'lots of memory', 'frame buffer', 'framebuffer', 'big json', 'image buffer', 'audio buffer', 'large arrays', 'web app', 'high resolution'],
      { must: false, weight: 3, test: c => c.psramMax ? 1 : Math.min(0.5, c.sram / 800), yes: c => c.psramMax ? 'external PSRAM supported (megabytes of extra RAM)' : c.sram + ' KB of RAM', no: c => c.sram + ' KB of RAM and no way to add PSRAM' }),

    /* ---- the build itself */
    N('tiny', 'The build', 'As small as possible', ['tiny', 'very small', 'as small as possible', 'compact', 'miniature', 'wearable', 'fits inside', 'hidden', 'thumb', 'ring', 'pendant', 'badge', 'keychain', 'key fob'],
      { must: false, weight: 2, test: c => c.gpio <= 22 ? 1 : c.gpio <= 31 ? 0.8 : 0.6, yes: () => 'sold on thumb-sized boards', no: () => '', board: 'tiny' }),
    N('cheap', 'The build', 'Lowest cost (many units)', ['cheap', 'low cost', 'low-cost', 'cost-sensitive', 'budget', 'mass production', 'hundreds of', 'thousands of', 'as cheap as'],
      { must: false, weight: 3, test: c => ({ 'esp32-c2': 1, 'esp8266': 0.9, 'esp32-c3': 0.95, 'esp32-c61': 0.85, 'esp32-h2': 0.8, 'esp32-c6': 0.75, 'esp32-s2': 0.7, 'esp32': 0.7, 'esp32-c5': 0.55, 'esp32-s3': 0.55, 'esp32-p4': 0.3 })[c.id] || 0.5, yes: c => c.gpio <= 22 ? 'among the cheapest chips in the family' : 'mid-priced', no: () => '' }),
    N('beginner', 'The build', 'A first project: most tutorials, fewest surprises', ['beginner', 'first project', 'learning', 'learn', 'student', 'school', 'classroom', 'kids', 'tutorial', 'getting started', 'starter', 'easy', 'simple'],
      { must: false, weight: 2, test: c => ({ 'esp32': 1, 'esp32-s3': 0.9, 'esp32-c3': 0.85, 'esp8266': 0.6, 'esp32-c6': 0.7, 'esp32-s2': 0.6 })[c.id] || 0.4, yes: c => c.id === 'esp32' ? 'the chip nearly every tutorial is written for' : 'well covered by tutorials and libraries', no: () => 'newer or more specialised: fewer tutorials and some libraries lag behind' }),
    N('micropython', 'The build', 'Programmed in MicroPython', ['micropython', 'python', 'circuitpython', 'thonny'],
      { must: false, weight: 3, test: c => c.sw && c.sw.mpy ? (c.sram >= 320 || c.psramMax ? 1 : 0.7) : 0, yes: () => 'official MicroPython firmware', no: () => 'no official MicroPython build' }),
    N('blocks', 'The build', 'Programmed with blocks', ['scratch', 'blocks', 'block programming', 'blockly', 'uiflow', 'visual programming', 'drag and drop'],
      { must: false, weight: 2, test: c => ({ 'esp32': 1, 'esp32-s3': 1, 'esp32-c3': 0.8, 'esp32-c6': 0.7 })[c.id] || 0.4, yes: () => 'supported by block environments (UIFlow on M5Stack boards, MicroBlocks and others)', no: () => 'little block-programming support' }),
    N('esphome', 'The build', 'Home Assistant / ESPHome, no code', ['esphome', 'home assistant', 'tasmota', 'no code', 'without programming', 'yaml'],
      { must: false, weight: 2, test: c => c.sw && c.sw.esphome ? 1 : 0.3, yes: () => 'supported by ESPHome', no: () => 'ESPHome support is partial or absent' }),
    N('secure', 'The build', 'A product: secure boot, encrypted flash', ['secure boot', 'flash encryption', 'product', 'commercial', 'security', 'encrypted', 'tamper', 'certification', 'certified'],
      { must: false, weight: 2, test: c => has(c.security, 'secure boot') ? (has(c.security, 'digital signature') || has(c.security, 'ecdsa') ? 1 : 0.8) : 0.2, yes: () => 'secure boot, flash encryption and hardware key storage', no: () => 'no secure boot or flash encryption' }),
    N('hot', 'The build', 'Hot places (above 85 °C)', ['high temperature', '105', '125', 'engine bay', 'industrial temperature', 'inside a lamp', 'hot environment'],
      { must: false, weight: 2, test: c => (c.tempC && c.tempC[1] >= 105 ? 1 : 0.3), yes: c => 'versions rated to ' + c.tempC[1] + ' °C', no: () => 'rated to 85 °C' })
  ];
  E.need = id => byId(E.NEEDS, id);
  /* a project told in words -> the needs it mentions: [{ id, words: [matched…] }] */
  E.understand = function (text) {
    const t = ' ' + String(text || '').toLowerCase().replace(/[“”"'’`]/g, '').replace(/[^a-z0-9.+\- ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
    const out = [];
    for (const n of E.NEEDS) {
      const hits = n.words.filter(w => { const k = w.toLowerCase(); return new RegExp('(^|[^a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (/[a-z]$/.test(k) ? '(s|es)?' : '') + '([^a-z0-9]|$)').test(t); });
      if (hits.length) out.push({ id: n.id, words: hits });
    }
    // sayings that rule a need out: "no wifi", "without bluetooth"
    const drop = new Set();
    for (const [re, id] of [[/\b(no|without|not using|dont need|do not need) (wi-?fi|internet)\b/, 'wifi'], [/\b(no|without) bluetooth\b/, 'ble'], [/\b(no|without) (a )?(display|screen)\b/, 'display'], [/\bmains[- ]powered\b|\bplugged in\b|\busb[- ]powered\b/, 'battery']]) if (re.test(t)) drop.add(id);
    // "bluetooth speaker" is Classic, not LE; ESP-NOW "remote control" does not need a router
    const ids = new Set(out.map(o => o.id));
    const explicitWifi = /wi-?fi|wlan|internet|web (page|server|interface|app)|browser|http|mqtt/.test(t) && !/\b(without|no) (the )?(cloud|internet|wi-?fi)\b/.test(t);
    // a Zigbee or Thread device reaches Home Assistant through its mesh, not through Wi-Fi; "without the cloud" is not a wish for Wi-Fi
    if ((ids.has('zigbee') || ids.has('thread')) && !explicitWifi) drop.add('wifi');
    if (/\b(without|no) (the )?(cloud|internet)\b|\boffline\b|\blocally\b/.test(t) && !explicitWifi) drop.add('wifi');
    // any named radio makes the general "talks to a phone" need redundant
    if (['wifi', 'ble', 'btclassic', 'zigbee', 'thread', 'matter', 'espnow', 'lora', 'cellular'].some(k => ids.has(k) && !drop.has(k))) drop.add('link');
    if (ids.has('btclassic')) drop.add('ble');
    if (ids.has('bigdisplay')) drop.add('display');
    return out.filter(o => !drop.has(o.id));
  };
  /* rank the chips for a set of needs.
       needs: ['wifi', 'battery', …], or the text of an idea
       opts:  { include: 'all' | 'current' (leave out chips that are not recommended for new designs) }
     -> { needs: [...], ranked: [{ chip, score (0–100), yes: [sentences], partly: [...], watch: [limitations that matter here], boards: [board ids that fit] }],
          out: [{ chip, why: [what rules it out] }] } */
  const HARDWARE = ['lora', 'cell', 'eth', 'gnss', 'epaper', 'camera', 'bigdisplay'];
  const TAGW = { lora: 3, cell: 3, camera: 3, bigdisplay: 3, eth: 3, epaper: 2, display: 2, touch: 2, mic: 2 };
  E.advise = function (needs, opts) {
    opts = opts || {};
    const ids = (typeof needs === 'string' ? E.understand(needs).map(o => o.id) : needs).filter(id => E.need(id));
    const list = ids.map(E.need);
    const ranked = [], out = [];
    for (const c of E.CHIPS) {
      if (c.hidden || c.coproc) continue;       // a radio co-processor is not a chip to build a project on
      const fails = [], yes = [], partly = [];
      let sum = 0, wsum = 0;
      for (const n of list) {
        let s = n.test(c);
        if (HARDWARE.includes(n.board) && s > 0 && !E.BOARDS.some(b => b.chip === c.id && b.role !== 'co' && (b.has || []).includes(n.board))) s *= 0.7;
        if (n.must && s <= 0) { fails.push(n.label + ': ' + n.no(c)); continue; }
        wsum += n.weight; sum += n.weight * s;
        const said = s >= 0.75 ? n.yes(c) : (n.no(c) || n.yes(c));
        if (said) (s >= 0.75 ? yes : partly).push({ need: n.id, label: n.label, text: said, score: s });
      }
      if (fails.length) { out.push({ chip: c.id, why: fails }); continue; }
      // with nothing asked, or as a tie-breaker: how settled and well supported the chip is
      const maturity = ({ 'esp32': 1, 'esp32-s3': 0.98, 'esp32-c3': 0.95, 'esp32-c6': 0.88, 'esp32-s2': 0.7, 'esp32-h2': 0.7, 'esp32-c2': 0.62, 'esp32-c5': 0.72, 'esp32-p4': 0.7, 'esp32-c61': 0.6, 'esp8266': 0.5 })[c.id] || 0.5;
      const base = wsum ? sum / wsum : maturity;
      // not buying more chip than the job needs: a small bonus to the simpler chip when two meet the needs equally
      const lean = 1 - Math.min(1, (c.gpio || 20) / 60) * 0.5 - (c.cores > 1 ? 0.15 : 0);
      const statusPenalty = /nrnd|not recommended|eol/i.test(c.status || '') ? 0.12 : /sampl|announc|pre/i.test(c.status || '') ? 0.08 : 0;
      const exact = 100 * (0.86 * base + 0.09 * maturity + 0.05 * lean - statusPenalty);
      const score = Math.max(0, Math.min(100, Math.round(exact)));
      const watch = (c.bad || []).filter(b => relevant(b, ids)).slice(0, 4);
      if (statusPenalty && c.status) watch.unshift('Status: ' + c.status + '.');
      ranked.push({ chip: c.id, score, exact, yes, partly, watch, boards: E.boardsFor(c.id, ids).slice(0, 6).map(b => b.id) });
    }
    ranked.sort((a, b) => b.exact - a.exact || a.chip.localeCompare(b.chip));
    if (opts.include === 'current') return { needs: ids, ranked: ranked.filter(r => !/nrnd|eol/i.test((E.chip(r.chip).status || ''))), out };
    return { needs: ids, ranked, out };
  };
  // a limitation is worth showing when it touches something that was asked for
  function relevant(text, ids) {
    const t = text.toLowerCase();
    const K = { wifi: ['wi-fi', 'wifi', '2.4'], ble: ['bluetooth'], btclassic: ['bluetooth', 'classic'], adc: ['adc', 'analog'], battery: ['sleep', 'current', 'power'], camera: ['camera'], usbdev: ['usb'], usbhost: ['usb'],
      manygpio: ['gpio', 'pins'], memory: ['ram', 'psram', 'memory'], speed: ['core', 'mhz'], ai: ['core', 'ai', 'vector'], display: ['lcd', 'display'], bigdisplay: ['lcd', 'display', 'rgb'], touchpins: ['touch'], dac: ['dac'],
      zigbee: ['802.15.4', 'zigbee'], thread: ['802.15.4', 'thread'], can: ['twai', 'can'], micropython: ['micropython'], beginner: ['tutorial', 'librar', 'new'], motor: ['mcpwm', 'pwm'], cheap: ['price', 'cost'] };
    return ids.length === 0 || ids.some(id => (K[id] || []).some(k => t.includes(k))) || /no radio|strapping|not recommended/.test(t);
  }
  /* boards on a chip that carry what the needs ask of a board (a display, a battery charger, LoRa …), best fit first */
  E.boardsFor = function (chipId, needIds) {
    const tags = (needIds || []).map(id => (E.need(id) || {}).board).filter(Boolean);
    const all = E.boardsOf(chipId).filter(b => b.role !== 'co' && !/discontinued/.test(b.status || ''));
    const scored = all.map(b => {
      const hasTags = b.has || [];
      const total = tags.reduce((a, t) => a + (TAGW[t] || 1), 0), hit = tags.filter(t => hasTags.includes(t)).reduce((a, t) => a + (TAGW[t] || 1), 0);
      return { b, fit: total ? hit / total : 0, pop: b.pop || 0 };
    });
    const order = (x, y) => y.fit - x.fit || y.pop - x.pop || x.b.name.localeCompare(y.b.name);
    const fit = scored.filter(x => !tags.length || x.fit > 0).sort(order);
    return (fit.length ? fit : scored.sort(order)).map(x => x.b);
  };

  /* the rows of a side-by-side table of chips: [{ group, label, values: [text…], best: [bool…] }] */
  E.compare = function (ids) {
    const cs = ids.map(E.chip).filter(Boolean);
    const yn = v => v ? 'yes' : '—';
    const row = (group, label, f, better) => {
      const raw = cs.map(f), values = raw.map(v => Array.isArray(v) ? v[1] : v == null || v === false ? '—' : v === true ? 'yes' : String(v));
      const nums = raw.map(v => Array.isArray(v) ? v[0] : (typeof v === 'number' ? v : null));
      let best = cs.map(() => false);
      if (better && nums.every(v => v != null) && new Set(nums).size > 1) { const target = better === 'max' ? Math.max(...nums) : Math.min(...nums); best = nums.map(v => v === target); }
      return { group, label, values, best };
    };
    return [
      row('Processor', 'Core', c => c.arch + (c.cores > 1 ? ' × ' + c.cores : '')),
      row('Processor', 'Clock', c => [c.mhz, c.mhz + ' MHz'], 'max'),
      row('Processor', 'Low-power core', c => c.lp || null),
      row('Processor', 'AI / DSP help', c => c.ai || null),
      row('Memory', 'RAM', c => [c.sram, c.sram >= 1024 ? (c.sram / 1024) + ' MB' : c.sram + ' KB'], 'max'),
      row('Memory', 'Flash in the package', c => (c.flashIn || []).join(', ') || null),
      row('Memory', 'PSRAM', c => c.psramMax || ((c.psramIn || []).join(', ')) || null),
      row('Radio', 'Wi-Fi', c => c.wifi ? 'Wi-Fi ' + c.wifi.gen + ' · ' + c.wifi.bands.join(' + ') + ' GHz' : null),
      row('Radio', 'Bluetooth', c => c.bt ? (c.bt.classic ? 'Classic + ' : '') + 'LE ' + c.bt.le : null),
      row('Radio', 'Zigbee / Thread (802.15.4)', c => yn(c.ieee802154)),
      row('Pins', 'GPIO', c => [c.gpio, String(c.gpio)], 'max'),
      row('Pins', 'ADC channels', c => c.adc ? (c.adc.unpublished ? [0, 'not published yet'] : [c.adc.ch, c.adc.ch + ' × ' + c.adc.bits + ' bit']) : [0, '—'], 'max'),
      row('Pins', 'DAC', c => c.dac ? c.dac + ' × 8 bit' : null),
      row('Pins', 'Touch channels', c => c.touch || null),
      row('Peripherals', 'UART / I2C / SPI', c => [c.uart, c.i2c, c.spi].join(' / ')),
      row('Peripherals', 'I2S', c => c.i2s || null),
      row('Peripherals', 'CAN (TWAI)', c => c.twai || null),
      row('Peripherals', 'Motor PWM (MCPWM)', c => c.mcpwm || null),
      row('Peripherals', 'Pulse counters', c => c.pcnt || null),
      row('Peripherals', 'RMT channels', c => c.rmt || null),
      row('Peripherals', 'PWM channels (LEDC)', c => c.ledc || null),
      row('Peripherals', 'USB', c => (c.usb || []).join(', ') || null),
      row('Peripherals', 'Ethernet MAC', c => yn(c.eth)),
      row('Peripherals', 'Camera', c => (c.cam || []).join(', ') || null),
      row('Peripherals', 'LCD interfaces', c => (c.lcd || []).join(', ') || null),
      row('Power', 'Deep sleep', c => c.sleepUa != null ? [c.sleepUa, c.sleepUa + ' µA'] : null, 'min'),
      row('Power', 'Transmit peak', c => c.txMa ? c.txMa + ' mA' : null),
      row('Other', 'Temperature', c => c.tempC ? c.tempC[0] + ' … ' + c.tempC[1] + ' °C' : null),
      row('Other', 'Package', c => (c.pkg || []).join(', ') || null),
      row('Other', 'Status', c => c.status || null),
      row('Software', 'Arduino core', c => c.sw ? (c.sw.arduino === true ? 'yes' : c.sw.arduino || '—') : null),
      row('Software', 'MicroPython', c => c.sw ? (c.sw.mpy === true ? 'yes' : c.sw.mpy || '—') : null),
      row('Software', 'ESP-IDF since', c => c.sw ? c.sw.idf : null)
    ];
  };
  /* the features of a chip as short chips for a card: [[text, 'y' | 'n' | 'w']] */
  E.chipTags = function (c) {
    const t = [];
    t.push([c.wifi ? 'Wi-Fi ' + c.wifi.gen + (c.wifi.bands.includes(5) ? ' · 5 GHz' : '') : 'no Wi-Fi', c.wifi ? 'y' : 'n']);
    t.push([c.bt ? (c.bt.classic ? 'BT Classic + LE' : 'BLE ' + c.bt.le) : 'no Bluetooth', c.bt ? 'y' : 'n']);
    if (c.ieee802154) t.push(['Zigbee · Thread', 'y']);
    t.push([(c.cores > 1 ? c.cores + ' × ' : '') + c.mhz + ' MHz ' + (/risc/i.test(c.arch) ? 'RISC-V' : 'Xtensa'), '']);
    t.push([c.gpio + ' GPIO', '']);
    if (has(c.usb, 'otg')) t.push(['USB OTG', 'y']);
    if ((c.cam || []).length) t.push(['camera', 'y']);
    if (c.ai) t.push(['AI', 'y']);
    if (/nrnd|not recommended|eol/i.test(c.status || '')) t.push(['not for new designs', 'w']);
    else if (/sampl|announc|pre/i.test(c.status || '')) t.push([c.status, 'w']);
    return t;
  };
})(typeof window !== 'undefined' ? window : globalThis);
