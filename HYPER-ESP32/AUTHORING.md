# Hyper ESP32 — authoring guide

This is the guide for writing a topic of Hyper ESP32. Read **`HYPER-CORE/AUTHORING.md` first, lines 1–290** (the format
of a concept, text and TeX, the backslash trap, formulas as calculators, examples and quizzes, simulations and the kit)
and its last section, *Checking your work*. The sections in between belong to other apps. This file adds what is special
here: the **programs in three languages**, the terms of every page, the catalogue of chips and boards, the engine and
the drawing kit, and the rules of the subject. Then read the three reference pages and their simulations —
`content/reference.js` and `sims/reference.js` — they set the depth, tone and layout.

Plain JavaScript, no build step, no libraries, no network at run time. **All text must be original**: write every
explanation, example and question yourself; do not fetch or paraphrase any web page, book, datasheet or tutorial.
Facts, pin numbers, API names and published figures are of course fine.

## Who reads it, and what a page is for

Dany asked for an app that gathers **all the relevant knowledge about the ESP32 family**: every chip with its virtues
and limits, the boards of every maker, and how to turn an idea into a working electronic solution — pins, programming,
testing, communication, security, the cloud, motion, antennas, displays and touch GUIs, state machines. The reader is an
intelligent maker, student, technician or engineer: someone who can follow a circuit and wants to *build the thing*.
They may be a beginner in programming, which is why every program is shown three ways.

Every concept page has, besides the explanation, key ideas, mix-ups, examples and quiz of any Hyper page:

1. **Terms** (`terms: [...]`, 3–6 per page): the vocabulary the page introduces, each with a one- to three-sentence
   definition that stands on its own, and the other names and abbreviations it goes by (`also`). They appear on the
   page, in Tools → Dictionary, and in the search box. Abbreviations matter here: GPIO, ADC, PWM, OTA, RSSI, GATT, MTU,
   QoS, NVS, PSRAM, ISR … Define a term on the page where it *belongs*; elsewhere, link to that page.
   ```js
   terms: [ { term: 'Strapping pin', also: ['bootstrap pin'], def: 'A pin whose voltage the chip samples once, as reset is released, to choose a start-up option. It becomes a normal GPIO afterwards.' }, … ]
   ```
2. **The idea working**: a **program** (`code: [...]`, below), a **simulation** (`sim: 'id'`), or both. A page about
   doing something (reading a sensor, connecting to Wi-Fi, drawing on a display, a state machine) has a program. A page
   about how something behaves (a signal on a wire, a link budget, a pin at boot, a scheduler, battery drain) has a
   simulation. A page that is neither (history, licences, choosing) may have neither — but most pages have at least
   one, and **a topic of twelve pages needs about six simulations and eight to ten programs**.
3. **Real numbers.** Typical values with units, in a table where there are several: currents, voltages, frequencies,
   pin numbers, sizes, addresses, times. Numbers about a chip, a pin or a board come **from the catalogue** (below),
   never from memory.
4. **`choose`** on every page about a thing or a method one might pick — a chip, a board, a sensor, a bus, a protocol,
   a library, a display: `choose: { good: [...], avoid: [...], check: [...] }` (2–4 short items each), shown as
   "Is it right for your application?".
5. **Where you meet it** (`applications`, 3–4 items) and **sources** (`sources`, 2–3): the datasheet, the official
   guide (ESP-IDF Programming Guide, Arduino core documentation, MicroPython documentation), or the standard behind
   the page (Bluetooth Core Specification, IEEE 802.11, IEEE 802.15.4, the Matter specification, the I2C-bus
   specification UM10204, USB 2.0, ISO 11898). Name only what you are sure exists; never invent a title or a section
   number, and do not give URLs.

The validator warns when a page has fewer than two terms, no applications, no sources, or neither a program nor a
simulation.

A body runs **1500–3000 characters** with `###` subheadings: the idea and a concrete picture first, then how it is
done, then the numbers and what they mean, then the traps. British spelling (colour, centre, metre, analogue,
programme only for television — a computer *program*). End with a `> [!key]` callout that states the page in two
sentences. Write names as their owners do: ESP32-S3, Wi-Fi, Bluetooth LE, ESP-NOW, MicroPython, GPIO5, I2C, 3.3 V.

## Files

```
HYPER-ESP32/
  content/outline.js     the branches, topics and planned concepts (do not edit)
  content/reference.js   the three reference pages: first-program-blink, strapping-pins, soc-esp32-c3 (do not edit)
  content/<topic>.js     your concepts                                   ← you write
  sims/reference.js      ref-blink, ref-strapping, ref-chip (do not edit)
  sims/<topic>.js        your simulations                                ← you write
  AUTHORING.md           this file
  API-CRIB.md            the current, verified API forms for Arduino C++, MicroPython and ESP-IDF — FOLLOW IT
HYPER-CORE/js/esp32-chips.js    the chips, their pins and the modules      (Hyper.esp.CHIPS, PINS, MODULES)
HYPER-CORE/js/esp32-boards.js   573 boards, the makers, finished products  (Hyper.esp.BOARDS, MAKERS, PRODUCTS)
HYPER-CORE/js/esp32.js          questions asked of the catalogue: pins, the pin planner, the project advisor
HYPER-CORE/js/esp32-calc.js     kit.esp — PWM, ADC, batteries, radio links, serial signals as edges, partitions, filters, PID, state machines
HYPER-CORE/js/espgfx.js         kit.gfx — virtual displays: frame buffers, the 5 × 7 font, character LCDs, seven segments, widgets
HYPER-CORE/js/espsym.js         kit.esym — drawing boards, parts, logic traces, packets, networks, radio, state machines
HYPER-CORE/js/espcode.js        the block notation and the highlighter
```

Write only `content/<topic>.js` and `sims/<topic>.js` for your topic id. Do not edit the outline, the reference files,
anything in `HYPER-CORE`, `index.html`, or another writer's files; the integrator wires your files in. Wrap the sims
file in `(function () { 'use strict'; … })();`. Every simulation id starts with your **topic code** (given in your
brief), e.g. `gp-pull-ups`.

**Ids.** Use the ids of your topic's `plan` in the outline, exactly. The three pages of `content/reference.js` are not
to be written again. Link freely to any planned id of the whole outline — `[[deep-sleep]]`,
`[[strapping-pins|strapping pin]]` — whether or not it is written yet. Use two to four **prerequisites** per page (they
draw the concept map), mostly from your own topic and the ones before it. Links to other apps (the id must exist in
that app's `catalog.js`; the validator warns): `electronics:` (ohms-law, voltage-divider, leds, capacitors, pull-up …
check the catalog), `motors:`, `physics:`, `math:`. When unsure whether an id exists, grep the catalog; do not guess.

## Programs: the `code` field

```js
code: [
  {
    title: 'Read a button and light the LED',          // required
    about: 'One or two sentences: what the program does. Markdown.',
    needs: 'An ESP32 DevKit and a push button.',
    wiring: [['GPIO4', 'button → GND', 'internal pull-up'], ['GPIO2', '220 Ω → LED → GND']],   // [from, to, note?]
    libs: ['Adafruit SSD1306', 'Adafruit GFX'],        // Arduino libraries to install, if any
    blocks: `…`,                                       // the block notation, below
    cpp: String.raw`…`,                                // Arduino C++ (core 3.x)
    py: String.raw`…`,                                 // MicroPython
    idf: String.raw`…`,                                // optional: ESP-IDF C, where it teaches something the Arduino form hides
    yaml: `…`,                                         // optional: ESPHome
    na: { py: 'MicroPython has no CAN driver for the ESP32: this needs C++.' },   // why a language is missing
    output: `what the serial monitor (or the display) shows`,
    notes: ['A trap, a variant, a version remark.']
  }
]
```

- **Write programs inside `String.raw`** so that `\n`, `\t` and `\0` in C and Python strings survive. Inside it only a
  backtick and `${` are special — neither occurs in C++ or Python. The validator rejects a program that contains a
  swallowed escape.
- **All three versions do the same thing**, with the same pins, the same names and the same comments, so that a reader
  can lay them side by side. Give `blocks`, `cpp` and `py` unless one truly cannot exist; then say why in `na`.
- **Complete and minimal.** A sketch has `setup()` and `loop()`; a MicroPython program runs as `main.py`. 10–40 lines.
  No placeholders like "your code here" except as a comment for the reader's own work. Credentials are written as
  `"your-ssid"` / `"your-password"` — and a note says not to leave them in shared code ([[credentials-handling]]).
- **Follow `API-CRIB.md`**, not your memory. The baseline is the Arduino core **3.3.x**, MicroPython **1.29**, ESP-IDF
  **5.5 / 6.x** driver names, LVGL **9**, ArduinoJson **7**. Read the crib's section for each API you use and its
  Appendix A. The validator warns about the stale forms it knows (`ledcSetup`, `timerBegin(0, 80, true)`,
  `StaticJsonDocument`, `import urequests`, `lv_btn_create` …). The validator does not compile: MicroPython
  is parsed by a real Python, C++ is checked only for balanced brackets — so write only what you are sure of. Where
  the Arduino IDE and the ESP32 core are installed, `node HYPER-CORE/tools/compile-esp32.js --only <topic>` builds
  your C++ programs with the real compiler (about a minute each): run it if you can, and say in `needs` which chip a
  program is for — the tool reads the target from there ("ESP32-S3 …", "any ESP32-family board").
- Pins in programs must be **sensible for the board named in `needs`**: no flash pins, no strapping pin held the wrong
  way, ADC1 pins for analogue input with Wi-Fi on an ESP32. Check with the catalogue (below).

### The block notation

Blocks are our teaching notation for the structure of a program, in the manner of Scratch. They are not the language of
one particular tool (UIFlow, MicroBlocks and others each name their blocks differently — say so where it matters). One
block per line; indentation is for the eye; `end` closes a C-shaped block; a blank line starts a new script.

```
when started                              a hat: every script starts with "when …" (or "define …")
  set pin (2) as [output v]               (…) a number or a value block   [… v] a menu   [text] a text slot
forever                                   C blocks: forever · repeat (10) · repeat until <…> · while <…> · if <…> then
  if <(read pin (0)) = [LOW v]> then          · else · else if <…> then · for each [x v] in (list)
    set pin (2) to [HIGH v]               <…> a condition; inside one, < and > with a space on their inner side
  else                                        are comparisons:  <(t) > (30)>   <<a> and <b>>   <not <done>>
    set pin (2) to [LOW v]
  end
  wait (0.5) seconds                      // a comment after two slashes
end
```

Use this vocabulary so that every page reads alike (colours follow the first words; `:: category` after a block
overrides — categories: events control pins sensing operators variables serial time wifi net mqtt ble radio display
sound motion light storage power state tasks my bus cloud security ai):

| | |
|---|---|
| Events | `when started` · `when pin (4) goes [low v]` · `when button [A v] pressed` · `every (5) seconds` · `when timer fires` · `when Wi-Fi connects` · `when message arrives on [topic]` · `when data received` · `when value written` · `when button [OK] touched` |
| Control | `forever` · `repeat (10)` · `repeat until <…>` · `while <…>` · `if <…> then` · `else` · `for each [x v] in (list)` · `stop [this script v]` · `define blink (times)` and then `blink (3) :: my` |
| Pins | `set pin (2) as [output v]` (`[input v]`, `[input with pull-up v]`) · `set pin (2) to [HIGH v]` · `toggle pin (2)` · `(read pin (0))` · `(analog read pin (34))` · `(analog read pin (34) in millivolts)` · `set PWM on pin (5) to (128)` · `set PWM on pin (5) frequency (5000) resolution (8)` · `set DAC pin (25) to (128)` · `(touch value of pin (4))` |
| Variables | `set [x v] to (0)` · `change [x v] by (1)` · `(x)` · `add (v) to [list v]` · `(item (1) of [list v])` |
| Operators | `((a) + (b))` `-` `*` `/` · `<(a) = (b)>` `<` `>` `≤` `≥` `≠` · `<<a> and <b>>` · `(join [text ] (x))` · `(map (x) from (0) (4095) to (0) (100))` · `(round (x))` · `(random (1) to (6))` |
| Serial, time | `start serial at (115200) baud` · `print (x)` · `wait (0.5) seconds` · `(milliseconds since start)` · `(current time)` |
| Wi-Fi, internet | `connect to Wi-Fi [name] password [secret]` · `<Wi-Fi connected?>` · `(IP address)` · `(signal strength)` · `(http get [url])` · `http post (data) to [url]` · `start web server on port (80)` · `when request for [/] arrives` |
| MQTT | `connect to MQTT broker [host]` · `publish (v) to topic [home/temp]` · `subscribe to [topic]` |
| Bluetooth, ESP-NOW | `start BLE as [name]` · `add service [uuid]` · `add characteristic [uuid] [notify v]` · `notify (value)` · `start advertising` · `start ESP-NOW` · `add peer [AA:BB:CC:DD:EE:FF]` · `send (data) to peer [..] :: radio` |
| Buses | `start I2C on SDA (21) SCL (22)` · `(I2C read (2) bytes from address (0x48) register (0x00))` · `I2C write (bytes) to address (0x48)` · `start SPI …` · `start UART (1) at (9600) baud` |
| Display | `start display [SSD1306 128×64 v]` · `clear display` · `show (text) at x (0) y (0)` · `draw rectangle …` · `update display` · `create button [OK] at x (10) y (40)` |
| Lights, sound, motors | `set pixel (0) to colour (r) (g) (b)` · `show pixels` · `play tone (440) Hz on pin (25) for (0.2) seconds` · `set servo on pin (18) to (90) degrees` · `set motor [A v] speed (50)` |
| Storage, power | `save (v) as [key]` · `(load [key])` · `append (line) to file [log.csv]` · `deep sleep for (60) seconds` · `enable wake on pin (33)` |
| State machines | `go to state [RUNNING v]` · `when entering state [X v]` · `when event [PRESS v] in state [IDLE v]` · `when (5) seconds in state [X v]` · `<state = [X v]>` |
| Tasks | `start task [blink v]` · `send (x) to queue [q v]` · `(receive from queue [q v])` · `lock [bus v]` … `unlock [bus v]` |

A block program that cannot say something (a callback's arguments, a struct) says it in words inside one block —
`when data received from (sender) :: radio` — rather than inventing syntax. The validator parses every block program
and reports unbalanced brackets and missing `end`s. Fenced snippets inside a body are also possible:
`~~~cpp … ~~~` (also `python`, `yaml`, `json`, `sh`, `ini`, `blocks`); remember that a body is an ordinary template
string, so backslashes there are doubled.

## The catalogue: never type a chip fact from memory

The chips, pins, modules and boards were read from Espressif's datasheets and the makers' own pages on 2026-10-04.
**Pages must agree with them.** Before you write a number about a chip or a pin, print it:

```
node -e "const {loadCore}=require('./HYPER-CORE/tools/load.js');const E=loadCore().esp; console.log(E.chip('esp32-s3')); console.log(E.pin('esp32',12)); console.log(E.PINS['esp32-c3'].rules); console.log(E.board('seeed-xiao-esp32c3'))"
```

```js
const E = kit.esp;                 // in simulations (Hyper.esp anywhere)
E.CHIPS                            // 15 chips: esp32 esp32-s3 esp32-s2 esp32-c3 esp32-c6 esp32-c5 esp32-c61 esp32-c2 esp32-h2 esp32-p4 esp32-s31 esp32-h4 esp32-h21 esp8266 esp32-e22
E.chip('esp32-s3')                 // { name, year, tagline, role, arch, cores, mhz, fpu, lp, ai, sram, rom (KB), flashIn, psramIn, psramMax,
                                   //   wifi: { gen, std, bands, bw, mbps, feat } | null, bt: { classic, le, feat } | null, ieee802154: { zigbee, thread } | null,
                                   //   txDbm, sensDbm, gpio, strap: [gpio…], adc: { units, ch, bits }, dac, touch, uart, i2c, spi, i2s, twai, rmt, ledc, mcpwm, pcnt,
                                   //   usb: [...], eth, sdio, cam, lcd, temp, vdd: [min, max], sleepUa, lightUa, rxMa, txMa, tempC, pkg, sw: { idf, arduino, mpy, … },
                                   //   status, good: [...], bad: [...], security: [...] }
E.PINS['esp32']                    // { src, defaults: { tx, rx, sda, scl, mosi, miso, sck, ss, led, boot }, strapping: [{ gpio, meaning, level, pull }], rules: [...], gpios: [...] }
E.pin('esp32', 12)                 // { n, dir ('I' = input only), adc, touch, dac, rtc, strap, flash, usb, jtag, uart0, pull, glitch, safe: 'yes'|'caution'|'avoid', note }
E.pinsFor('esp32', 'adc-wifi')     // GPIO numbers that suit a job: output input safe adc adc-wifi touch dac wake any
E.pinCaps('esp32', 34)  E.pinVerdict('esp32', 12)  E.pinKind(chip, pin)  E.parsePin('VP=36')
E.planPins('esp32' | board, [{ what: 'i2c' }, { what: 'adc', n: 2 }, …], { wifi: true })   // -> { assign, warnings, free, cpp, py }
E.BOARDS  E.board(id)  E.boardsOf('esp32-c6')  E.family('M5Stack')  E.MAKERS  E.MODULES  E.PRODUCTS
                                   // a board: { id, name, maker, family, chip, part, role ('co' = radio co-processor), flash, psram, usb: { conn, bridge }, size, display, battery,
                                   //   has: ['display','touch','battery','lora','camera','mic','speaker','sd','eth','imu','qwiic','grove','tiny', …], onboard, expansion,
                                   //   pins: { … fixed assignments }, headers: [{ side, pins: ['3V3','EN','VP=36','34', …] }], good, watch, status, src }
E.NEEDS  E.understand(text)  E.advise(needs | text)  E.compare([ids])  E.VERSIONS
```

To find boards: `node -e "…E.BOARDS.filter(b=>b.maker==='M5Stack').forEach(b=>console.log(b.id,'|',b.name,'|',b.chip))"`.
Board pages (the M5Stack, Seeed, LilyGO … topics) take their facts from these records — chip, memory, display,
battery, fixed pins, `good`, `watch` — and say so honestly when the catalogue has no figure. If the catalogue and your
memory disagree, the catalogue wins; if you are sure it is wrong, write the page from the catalogue and **report the
disagreement** — do not edit the data.

Things that surprise people and are true (verified from the datasheets): the ESP32-C2 exposes only 14 GPIOs and the
ESP32-H2 19; "ADC2 cannot be used with Wi-Fi" is a hard rule only on the original ESP32; the C3's ADC2 channel is
unusable; the ESP32's Hall sensor was withdrawn; the ESP8266 is not recommended for new designs since November 2025;
the ESP32-P4 has no radio and no flash in the package; the ESP32-C5 has been in mass production since 2025; the
ESP32-S31 (2026) has Bluetooth Classic, Wi-Fi 6 and 802.15.4 but only preview software; among the
microcontrollers Bluetooth Classic exists only on the ESP32 and the S31 (the ESP32-E22, a radio co-processor and
not a microcontroller, has it too).

## The engine — `kit.esp` (`const E = kit.esp`)

Tested in `HYPER-CORE/tools/test-esp32.js`; read it for one-line examples. SI units unless a name says otherwise.

```js
// PWM, servos                                                         // ADC, dividers, parts
E.ledcTimerBits(chipId) -> 20 (ESP32, C6, H2, C5, C61, P4) or 14 (S2, S3, C3, C2): never 16 bits at 50 Hz in a program for any chip
E.ledcMaxBits(freq, clock = 80e6, cap = 20)  E.ledcMaxFreq(bits)       E.adcFullScale(dB)  E.adcCounts(v, bits, vfs)  E.adcVolts(counts, bits, vfs)  E.adcLsb(bits, vfs)
E.ledcDuty(frac, bits)  E.pwm(freq, bits, duty, vcc)                    E.adcEsp32Raw(v)   (the uncalibrated curve)   E.ADC_RANGE[chip][dB] -> [vMin, vMax]
E.servo(angle, { minUs, maxUs, freq, bits }) -> { us, duty, … }        E.divider(vin, r1, r2)  E.dividerFor(vinMax, voutMax, total)  E.eSeries(v, 'E12')
E.gamma(level, 2.2)  E.map(v, a, b, c, d)                               E.ledResistor(vcc, vf, amps)  E.ntcR(tC, r25, beta)  E.ntcT(r)  E.oversample(noise, n)
// power                                                               // radio
E.dutyCycle([{ mA, s }, …]) -> { avg, period, mAhPerDay, share }       E.dBmToMw  E.mwToDbm  E.wavelength(MHz)  E.fspl(m, MHz)  E.fresnel(d, MHz)  E.quarterWave(MHz)
E.batteryLife(mAh, avgmA, { usable, selfDischarge, cell }) -> { hours, days, years }  (pass cell: 'cr2032' … so a primary cell is not charged a lithium-ion's 3 % a month)   E.link({ tx, gt, gr, mhz, d, n, walls, wallLoss, sens }) -> { loss, rx, margin, ok }  E.linkRange({…})
E.CELLS  E.lipoSoc(v)  E.ldo(vin, vout, amps)  E.holdupCap(amps, s, dv)  E.rssiQuality(rssi)  E.wifiChannel(ch)  E.wifiOverlap(a, b)  E.bleChannel(ch)  E.zigbeeChannel(ch)
E.pixelCurrent(n, brightness)                                          E.espnowAirtime(bytes, mbps)  E.lora({ sf, bw (Hz: 125e3), cr (1–4 for 4/5–4/8), bytes }) -> { t, tSym, bitrate, sensitivity }  E.dutyLimit(airtime, 0.01)  E.bleAdvCurrent(interval, {…})
// serial signals as edge lists [[t, level], …] — draw them with kit.esym.wave / kit.esym.logic
const P = E.proto;
P.uart(byte, { baud, bits, parity, stop }) -> { edges, bits: [{ t0, t1, kind, v }], t1, tBit }     P.uartBytes(bytes, { baud, gap, show: 'hex'|'ascii' }) -> { edges, marks, t1 }
P.i2c({ addr, read, data, hz, ack }) -> { scl, sda, marks, t1 }        P.spi({ mode, hz, bytes, miso }) -> { cs, sck, mosi, miso, marks, sample }
P.ws2812([[r, g, b], …])  P.onewire(bytes)  P.nec(addr, cmd)  P.can(id, data, { bitrate }) -> { bits: [{ v, field, stuffed }], edges, crc }
P.quadrature(counts, rate) -> { a, b }  P.bounce([[tDown, tUp], …], { bounceMs, seed })  P.levelAt(edges, t)
E.baudError(wanted, actual)  E.uartActualBaud(baud)  E.i2cPullup(vcc, cBus, hz, r) -> { min, max, rise, limit }  E.I2C_ADDR[0x3C] -> ['SSD1306 / SH1106 OLED']
E.crc8(bytes)  E.crc16modbus(bytes)  E.crc32(bytes)  E.checksum8  E.hex(v, digits)  E.bin(v, digits)  E.bytesOf('text')  E.signed(v, 16)  E.mac(bytes)  E.kb(n)
// flash, time, tasks                                                  // filters and control
E.PARTITION_SCHEMES  E.partitions(parts, flash) -> { rows, used, free, errors, csv, appMax }       E.ema(alpha)  E.emaAlpha(tau, dt)  E.movingAverage(n)  E.median(n)  -> x => filtered
E.flashLife(writesPerDay, sectors)  E.timer(period, tickHz)  E.elapsed32(now, then)  E.ticks(ms)   E.hysteresis(lo, hi) -> x => bool   E.debouncer(ms) -> (level, tMs) => level
E.schedule([{ name, prio, period, run }], totalMs) -> { slots, missed, load }                       E.pid({ kp, ki, kd, min, max }).step(sp, pv, dt) -> { out, p, i, d }
                                                                       E.plant({ tau, gain, ambient, dead }).step(u, dt)   E.move(dist, vmax, acc).at(t) -> { x, v }   E.stepRate(rpm, 200, micro)
// state machines
const def = { start: 'IDLE', states: { IDLE: { on: { PRESS: 'RUN' }, entry: 'LED off' }, RUN: { after: { 5000: 'IDLE' }, on: { PRESS: { to: 'IDLE', do: 'beep' } } } } };
const m = E.fsm(def);  m.send('PRESS');  m.tick(ms);  m.state;  m.inState();  m.events();  m.log;  m.reset()
// on: { EV: { internal: true, do: 'count' } } acts and stays (no exit/entry, the state's clock keeps running);
// after: { 5000: { to: 'X', if: 'guard' } } is a guarded timeout — it does not fire while every guard fails
E.fsmCheck(def) -> [problems]   E.fsmDiagram(def, { IDLE: [x, y] }) -> for kit.esym.fsm   E.fsmCode(def, 'cpp' | 'py' | 'blocks') -> the program text
```

## Virtual displays — `kit.gfx` (`const G = kit.gfx`)

```js
const fb = G.fb(128, 64);                       // a monochrome frame buffer; G.fb(240, 240, { depth: 16 }) for colour (colours are 0xRRGGBB, G.rgb(r, g, b), G.COLORS.red …)
fb.clear()  fb.pixel(x, y, c)  fb.line(x0, y0, x1, y1, c)  fb.hline  fb.vline  fb.rect(x, y, w, h, c)  fb.fillRect  fb.circle(cx, cy, r, c)  fb.fillCircle
fb.roundRect(x, y, w, h, r, c)  fb.fillRoundRect  fb.triangle  fb.fillTriangle  fb.arc(cx, cy, r, a0, a1, thick, c)   (degrees, clockwise from 12 o'clock)
fb.text('Hello', x, y, { size: 2, color, bg, align: 'center' })   (the classic 5 × 7 font: a character cell is 6 × 8 dots times size; also ° µ Ω → ← ↑ ↓ ± ²)
fb.bitmap(x, y, ['.##.', '####'], c)  fb.scroll(dx, dy)  fb.invert()  fb.get(x, y)  fb.lit()  G.textWidth(str, size)
G.draw(ctx, fb, x, y, scale, { style: 'oled' | 'lcd' | 'epaper' | 'led' | 'tft', round })   // paint it on the canvas; -> { x, y, w, h }   G.pick(fb, x, y, scale, px, py) -> the dot under a point
const lcd = G.lcd(16, 2);  lcd.clear()  lcd.setCursor(col, row)  lcd.print('Temp 23.5 C')  lcd.createChar(0, [0b00100, …8 rows])  lcd.write(0)  lcd.cursor()  lcd.blink()  lcd.scrollLeft()
G.drawLcd(ctx, lcd, x, y, dot, { backlight: 'green' | 'blue', t })
G.seg7Number(23.5, 4, 1) -> cells   G.drawSeg7(ctx, cells | '12:34', x, y, height, { color, colon })   G.SEG7  G.seg7('A')
const ui = G.ui(fb);  ui.screen()  ui.header('Thermostat')  ui.label(x, y, 'text', { size })  ui.button(x, y, w, h, 'OK', { id, pressed })  ui.bar(x, y, w, h, frac)  ui.slider(x, y, w, frac, { id })
ui.toggle(x, y, on, { id })  ui.check(x, y, on, 'text')  ui.gauge(cx, cy, r, frac, { text })  ui.chart(x, y, w, h, data)  ui.list(x, y, w, items, selected, { id })  ui.icon('wifi', x, y)  ui.hit(x, y) -> id
G.DISPLAYS  G.display('ssd1306-128x64')  G.frameBytes(w, h, depth)  G.busFps(w, h, bitsPerPixel, hz)  G.i2cFps(w, h, hz)  G.touchMap(rawX, rawY, cal, w, h)  G.touchRaw  G.pxToMm(px, w, h, inch)
```

## Drawing — `kit.esym` (`const S = kit.esym`)

Every function takes the canvas context first; positions are canvas pixels; colours come from the theme unless given.

```js
S.text(ctx, str, x, y, { size, color, align, weight, mono, bg })     // centred by default (kit.label is left-aligned by default): pass align
S.box(ctx, x, y, w, h, { label, sub, color, active, dash }) -> { cx, cy, l, r, t, b }      // a block of a block diagram; l r t b are the mid-side points
S.chip(ctx, x, y, w, h, { label, sub })   S.module(ctx, x, y, w, h, { label, antenna })   S.tile(ctx, x, y, w, h, { label, sub, color: 'blue'|'red'|'green'|'purple'|'black', pins: ['VCC','GND','SDA','SCL'], side }) -> { pins: { SDA: [x, y] } }
S.board(ctx, E.board('esp32-devkitc-v4'), { x, y, w, h }, { highlight: { 12: css, 'GND': css }, dim: pin => bool, labels: true }) -> { pins: [{ label, gpio, kind, x, y, side }], rect }
                                                                         // boards with headers: E.BOARDS.filter(b => b.headers)
S.led(ctx, x, y, { color: css | hue, on: true | 0…1, r, label })   S.pixels(ctx, x, y, [[r, g, b], …], { r, cols, serpentine })   S.button(ctx, x, y, { pressed, label })   S.pot(ctx, x, y, r, frac)
S.relay(ctx, x, y, on) -> { com, no, nc, coil }   S.buzzer(ctx, x, y, on, { phase })   S.servo(ctx, x, y, angleDeg)   S.motor(ctx, x, y, r, angleRad, { kind: 'dc'|'step' })
S.battery(ctx, x, y, w, h, frac, { charging })   S.gauge(ctx, cx, cy, r, frac, { value, label, zones })
S.wire(ctx, [[x, y], …], { color, dash })   S.flow(ctx, pts, phase, { color })   S.breadboard(ctx, x, y, cols) -> { hole(col, row) }
S.wave(ctx, x, y, w, h, edges, { t0, t1, color, label, fill })           // a digital trace from [[t, level], …];  S.pwmEdges(freq, duty, t0, t1)
S.analog(ctx, x, y, w, h, pts | t => v, { t0, t1, min, max, color, label })
S.logic(ctx, x, y, w, h, [{ label, edges | pts, color, marks: [{ t0, t1, text }] }], { t0, t1, cursor }) -> { X(t), rowY(i) }      // a logic analyser with decoded bytes
S.bits(ctx, x, y, 0xA5, { n: 8, cell, labels: true, hi: [0, 1] })   S.frame(ctx, x, y, w, [{ label, size, value, color: hue }], { h })   S.layers(ctx, x, y, w, [{ label, sub, size, color: hue, right }], { h })
S.timeline(ctx, x, y, w, h, [{ dur, mA, label }], { log: true }) -> { avg }     // current against time, with its average
S.node(ctx, x, y, { kind, label, sub, r, active })                        // kinds: esp router phone laptop cloud server db sensor bulb motor display battery user gateway broker lock speaker mic camera sd tag home
S.link(ctx, x1, y1, x2, y2, { wireless, label, arrow, bend })   S.msg(ctx, x1, y1, x2, y2, f, { label })   S.radio(ctx, x, y, { r, phase })   S.antenna(ctx, x, y, h)   S.bars(ctx, x, y, rssi)
S.fsm(ctx, E.fsmDiagram(def), { box: { x, y, w, h }, active: m.state, fired: transitionIndex, pulse }) -> { pos, hit(x, y) }
```

Circuit symbols (resistors, capacitors, transistors, the oscilloscope screen) are `kit.schem`, and circuits can be
solved with `kit.Circuit` — both documented in `HYPER-CORE/AUTHORING.md`.

If something you need is missing or looks wrong, do **not** work around it silently and do not edit the engine: write
what you needed in your report. A small helper local to your sims file is fine.

## Simulations — what a good one looks like here

Everything in `HYPER-CORE/AUTHORING.md` applies (`kit.stage`, `kit.controls`, `kit.readout`, `kit.loop`, `kit.drag`,
`kit.click`, `kit.plot`, theme colours only, both themes, no libraries, `mount` must not throw).

- **Static pictures redraw on demand**: build the loop, call `loop.once()` after every control change and on resize
  (`st.onResize(() => loop.once())`), as `ref-chip` does. Run the loop continuously (`loop.start()`) only when
  something moves by itself — a signal scrolling, a packet travelling, a battery draining — as `ref-blink` does.
- **Show the thing**: the pin's voltage against time, the bytes on the wire with their decoding, the packet crossing
  the air, the state machine with its active state lit, the display with its pixels. Label what is drawn; put the
  numbers in the read-out with units.
- **Let the reader do something**: press the virtual button, pull a pin high, drag the antenna away, type the byte
  to send, flip the switch that causes the fault. Three to six controls and a blurb with a *Try this* list of three or
  four things to do and what to notice.
- **One simulation may serve two or three pages** through `params` (`sim: { id: 'ub-i2c', params: { mode: 'nack' } }`).
- **Honest numbers**: timing from `E.proto`, currents from `E.chip(...)`, ranges from `E.link`. Say in the blurb when a
  picture is schematic.

## Rules of the subject

- **Mains voltage.** Wherever a page switches or measures 110–230 V (relays, solid-state relays, dimmers, energy
  monitors, smart plugs, heaters): a `> [!warn]` callout saying that mains wiring is work for a qualified person, behind
  isolation and in an enclosure, following the local wiring code; that a bare relay board on a desk is not a product;
  and that reflashing a mains device means opening it — never while it is plugged in.
- **Lithium cells.** Charge only with a charger IC and a protection circuit; never from a GPIO or a bare supply; a
  swollen, punctured or shorted cell burns. Say so on pages that use them.
- **Radio is regulated.** Transmit power, bands and duty cycle have legal limits (ETSI in Europe, FCC in the US).
  Changing the antenna of a certified module voids its certification. Say "check your country's rules" where it matters.
- **Security pages are defensive.** Explain how attacks work in principle and how to defend; never give step-by-step
  instructions for attacking networks or devices that are not the reader's own — no deauthentication, jamming, evil-twin
  portals, credential harvesting, BLE spam, key extraction from products. Firmware made for such things (Marauder and
  the like) may be named as existing, with the legal position, and not taught. Promiscuous mode and CSI are explained as
  measurement tools on your own network.
- **Cameras and microphones** record people: a page that uses them says that consent and local law apply.
- **Reflashing commercial products** (Shelly, Sonoff, Tuya): it is the owner's right on their own device; it voids the
  warranty and the safety approval; mains devices need the care above.
- **Names and brands.** This app maps real products, so name them — factually, with virtues *and* limits, never as an
  advertisement. No prices (they change); say "among the cheapest", "costs more than". Product names are spelt as
  their makers spell them.
- **Dates.** Software and product status are "as of October 2026"; say "at the time of writing" where a fact is likely
  to move (a chip in sampling, a library's support for a chip).
- Never name `kit.esp`, a function or a `.js` file in reader-facing text (the validator warns): say "the pinout
  explorer", "the simulation below", "the board catalogue".

## Checks you must run (0 errors required; read the warnings)

```
node --check HYPER-ESP32/content/<topic>.js
node HYPER-CORE/tools/validate.js HYPER-ESP32 --only <topic>
node HYPER-CORE/tools/simtest.js HYPER-ESP32 --only <topic>
```

Notes about *planned concepts not written yet* are expected. Fix every error and every warning that is yours (a stale
API form, a missing language without `na`, fewer than two terms, no applications, no sources, neither program nor
simulation, a short body). To look at a page before it is wired in:
`http://localhost:8172/HYPER-ESP32/index.html?extra=content/<topic>.js,sims/<topic>.js#/c/<id>` — but other writers
share the browser, so the command-line checks are what must pass; do not start or stop servers.

Write the content file **in parts** (create it with the first three or four concepts, then append the rest with further
edits) rather than in one enormous write, and run `node --check` as you go.

Traps that caught the first writers: a literal dollar sign in prose (an NMEA sentence, a price) opens a math span —
keep it inside inline code or escape it; a page that names a simulation which does not exist yet is an error, so
write the simulations file early; `ledcAttach(pin, 50, 16)` fails on the 14-bit chips (S2, S3, C3, C2); ArduinoJson 7
has no `memoryUsage()`; the words "undefined" and "NaN" in a simulation's labels fail the simulation test; a
`kit.label` is left-aligned and an `S.text` centred unless told otherwise; and `HYPER-ESP32/API-CRIB.md` ends with
an appendix of corrections that overrides what stands earlier in it.

## Tools to link to

`[the project advisor](#/tools/advisor)`, `#/tools/chips` (`?c=esp32-s3`), `#/tools/boards` (`?b=<board id>`,
`?maker=M5Stack`, `?chip=esp32-c6`), `#/tools/pinout` (`/explore`, `/plan`, `/boot`; `?board=<id>` or `?chip=<id>`),
`#/tools/blocklab`, `#/tools/displaylab`, `#/tools/fsmlab`, `#/tools/signals` (`/uart`, `/i2c`, `/spi`, `/pwm`,
`/pixels`, `/can`), `#/tools/espcalc` (`/battery`, `/pwm`, `/adc`, `/link`, `/partitions`, `/leds`, `/lora`, `/i2c`),
`#/tools/dictionary`.
