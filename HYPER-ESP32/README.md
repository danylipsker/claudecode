# Hyper ESP32

Espressif's microcontrollers and everything built with them — a study and reference app in the Hyper family
(`HYPER-CORE` is the shared engine). Open `index.html` through the repository's server:

```bash
node scripts/serve.js 8172      # then http://localhost:8172/HYPER-ESP32/
```

Plain JavaScript and CSS: no build step, no libraries, no network at run time.

## What is in it

- **The family mapped.** Every Espressif chip — ESP8266, ESP32, S2, S3, C2, C3, C5, C6, C61, H2, P4 and the 2026
  arrivals S31, H4, H21 and E22 — with its numbers, its virtues and its limits, a page each, and a chip explorer that
  compares up to five side by side.
- **A project advisor.** Describe an idea in words ("a battery weather station that reports over Wi-Fi", "a Bluetooth
  speaker", "a Zigbee light switch on a coin cell"): it picks out what the project needs, ranks the chips with the
  reasons, says what rules the others out, and shows boards that carry the winner.
- **573 boards** from 29 makers — Espressif's kits, M5Stack, Seeed Studio XIAO, Adafruit, SparkFun, Arduino, LilyGO,
  Heltec, LOLIN, Waveshare, DFRobot, Olimex, Unexpected Maker and the rest — with what each carries and its quirks,
  and 79 finished products known to contain an ESP chip.
- **A pinout explorer.** Seventy boards drawn with their header pins coloured by what each can do; every GPIO of eleven
  chips with what it does at boot and whether it is safe; a pin planner that assigns pins to a list of jobs and says why.
- **Every program three ways.** A new concept field, `code`, shows one program as Scratch-style blocks, Arduino C++ and
  MicroPython side by side (and ESP-IDF C or ESPHome where it helps): 626 programs on 524 of the 603 pages.
- **Labs** under Tools: a block lab (build a program from blocks, run it on a virtual board, read the C++ and
  MicroPython), a display and GUI lab (virtual OLED, LCD, TFT and touch screens; a GUI designer that writes LVGL), a
  state-machine lab, a signal lab (UART, I2C, SPI, PWM, WS2812, CAN on a logic analyser) and calculators (battery
  life, PWM, ADC, radio range, flash partitions, LED strips, LoRa air time).
- **603 pages in fourteen branches**, with 456 simulations and a dictionary of 2,864 terms: the family · boards and makers · pins and power · components and circuits ·
  programming · wired communication · wireless · networks, cloud and data · security · displays and GUIs · motion
  and control · sound, vision and AI · instruments and measurement · from idea to product (with fourteen worked
  projects). Every page defines its terms (Tools → Dictionary) and shows its idea working.

## Where the facts come from

The catalogue was compiled on **2026-10-04** from Espressif's datasheets, documentation and product selector, and from
the makers' own product pages and pin tables. It lives in two hand-editable files:

| File | Holds |
|---|---|
| `HYPER-CORE/js/esp32-chips.js` | `E.CHIPS` (15 chips), `E.PINS` (every GPIO of 11 chips: ADC, touch, strapping, flash, USB, pull at reset, a verdict and a note), `E.MODULES` (89 modules) |
| `HYPER-CORE/js/esp32-boards.js` | `E.BOARDS` (573), `E.MAKERS`, `E.PRODUCTS` |

Pages quote these; to correct a fact, correct it there. Software versions the programs are written for are in
`HYPER-CORE/js/esp32-api.js` and `API-CRIB.md`: Arduino core for ESP32 3.3.x, MicroPython 1.29, ESP-IDF 5.5 / 6.x
driver names, LVGL 9, ArduinoJson 7.

**How far the programs are checked.** Every MicroPython program is parsed by a real Python (syntax only: nothing here
runs MicroPython). Every Arduino C++ program is checked for balanced brackets and for API forms known to be out of
date — and, on a machine with the Arduino IDE and the ESP32 core installed, `tools/compile-esp32.js` builds each one
with the real compiler for the chip it is written for (see COMPILED.md for the last run: which programs built, and
which need a library that was not installed). None was run on hardware. Treat them as carefully written teaching
code, and test on your board.

Hyper ESP32 is independent: it is not made, endorsed or checked by Espressif Systems or any board maker.

## The engine behind it (in `HYPER-CORE/js`)

| File | What it does |
|---|---|
| `esp32.js` | Questions asked of the catalogue: pins and their kinds, the pin planner, the project advisor (`E.understand`, `E.advise`), comparisons |
| `esp32-calc.js` | `kit.esp`: PWM and servos, the ADC and dividers, batteries and duty cycles, radio links, Wi-Fi/BLE/802.15.4 channels, LoRa air time, UART / I2C / SPI / 1-Wire / WS2812 / CAN / NEC signals as edge lists, CRCs, flash partitions, a task scheduler, filters, PID, move profiles, and state machines that run (`E.fsm`) and turn into code (`E.fsmCode`) |
| `espcode.js` | Syntax highlighting (C++, Python, YAML, JSON, shell) and the block notation: parser, categories, renderer, checks |
| `espgfx.js` | `kit.gfx`: frame buffers with the classic 5 × 7 font, a character LCD, seven-segment digits, a widget kit, touch mapping, a catalogue of display modules |
| `espsym.js` | `kit.esym`: boards with their pins, chips, modules, parts, wires, logic-analyser traces, bit boxes, packets, memory maps, current profiles, network pictures, radio rings, state-machine diagrams |
| `esp32-api.js` | Versions, and the list of stale API forms the validator warns about |
| `ui/espcode.js` | The three-language program card of a concept page |
| `ui/esptools.js`, `ui/esp-*.js` | The Tools: advisor, chips, boards, dictionary, pinout explorer and the labs |

## Checks

```bash
node HYPER-CORE/tools/test-esp32.js                  # the catalogue, the planner, the advisor, calculators, signals, displays, blocks
node HYPER-CORE/tools/labtest.js --app esp32         # every Tools lab, headless
node HYPER-CORE/tools/validate.js HYPER-ESP32 --final   # links, TeX, formulas, quizzes, programs (blocks parse, brackets balance, Python syntax)
node HYPER-CORE/tools/simtest.js HYPER-ESP32         # every simulation, every control to its ends
node HYPER-CORE/tools/compile-esp32.js               # builds every Arduino C++ program with arduino-cli, if it is installed (slow: about an hour and a half)
node HYPER-CORE/tools/wire.js HYPER-ESP32            # lists new content, simulation and lab files in index.html
node HYPER-CORE/tools/catalog.js --all               # regenerates catalog.js so the other Hyper apps can link here
```

Writing content: `AUTHORING.md` (and `HYPER-CORE/AUTHORING.md` for the format shared by all Hyper apps).
