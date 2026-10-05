# Which programs were compiled

Written by `node HYPER-CORE/tools/compile-esp32.js` on 2026-10-05 with arduino-cli 1.3.1 and the Arduino core for ESP32 3.3.7.
Every Arduino C++ program of the pages was built for the chip it is written for. A build proves that the program is
valid C++ against that version of the core and the libraries installed on the machine; it does not prove that it does
what the page says — nothing here was run on hardware. MicroPython programs are only parsed, and block programs are
checked by the validator.

| | Programs |
|---|---|
| Arduino C++ programs | 620 |
| **Built without error** | **609** |
| … of those, only with the large app partition (Tools → Partition Scheme → Huge APP) | 1 |
| … of those, one part of a sketch whose other part is on another page (compiled, not linked) | 7 |
| Need a library that was not installed on that machine (not built) | 3 |
| Use a call of a newer core than the one installed (not built) | 2 |
| Written for another board, or needing a file of your own (not built) | 6 |
| Failed to build | 0 |

Built for: ESP32 512, ESP32-C3 32, ESP32-S3 29, ESP32-C6 24, ESP32-P4 7, ESP32-H2 2, ESP32-C5 2, Arduino Nano ESP32 1.

## Not built: the library is not installed

Install the library named on the page (Sketch → Include Library → Manage Libraries) and they can be built the same way.

| Page | Program | Title | Missing header |
|---|---|---|---|
| `bluetooth-audio` | 1 | Send a tone to a Bluetooth speaker | library not installed: BluetoothA2DPSource.h |
| `ble-hid` | 1 | A one-button macro pad | library not installed: BleKeyboard.h |
| `bluetooth-classic-spp-and-a2dp` | 2 | A Bluetooth speaker (A2DP sink) | library not installed: BluetoothA2DPSink.h |

## Not built: they need a newer core

Update the "esp32 by Espressif Systems" package in the Boards Manager and they can be built the same way.

| Page | Program | Title | Why |
|---|---|---|---|
| `matter-commissioning` | 1 | Print the codes needed to commission | uses matterWaitUntilReady(): needs the Arduino core 3.3.12 or later (installed here: 3.3.7) |
| `matter-on-esp` | 1 | A Matter on/off light | uses matterWaitUntilReady(): needs the Arduino core 3.3.12 or later (installed here: 3.3.7) |

## Not built: another board, or a file of your own

| Page | Program | Title | Why |
|---|---|---|---|
| `u-blox-nina-and-nora` | 2 | Ask the NINA module which firmware it runs | written for a board outside the ESP32 core (another microcontroller, or the ESP8266) |
| `esp-as-a-co-processor` | 1 | Connect through the NINA radio | written for a board outside the ESP32 core (another microcontroller, or the ESP8266) |
| `nodemcu-and-doit-boards` | 1 | Which GPIO is D4? | no Arduino board for the ESP8266 in this core |
| `esp-01-and-esp-12` | 1 | A Wi-Fi switch for the on-board LED | written for a board outside the ESP32 core (another microcontroller, or the ESP8266) |
| `tflite-micro-and-esp-dl` | 1 | Run a quantised model: the TFLM skeleton | includes model_data.h, a file of the reader's own (the model exported for their project) |
| `edge-impulse` | 1 | Classify one window with an exported library | includes my_project_inferencing.h, a file of the reader's own (the model exported for their project) |

## Built, but only with a larger app partition

| Page | Program | Title | Note |
|---|---|---|---|
| `internet-radio` | 1 | Play an internet radio station | needs a larger app partition (Tools > Partition Scheme > Huge APP) |

## Built with another version of the core

The library these use, as installed on that machine, does not build with core 3.3.7; they were built with the version named.

| Page | Program | Title | Note |
|---|---|---|---|
| `colour-tft-displays` | 1 | Colour bars and a greeting on an ST7789 | built with the Arduino core 3.3.3 |
| `display-interfaces` | 1 | Time a full-screen fill and compare it with the theory | built with the Arduino core 3.3.3 |
| `flicker-and-double-buffering` | 1 | A counter without flicker | built with the Arduino core 3.3.3 |
| `frame-rate-and-bus-speed` | 1 | Whole screen against only the square | built with the Arduino core 3.3.3 |
| `round-and-odd-displays` | 1 | A clock face with a seconds hand | built with the Arduino core 3.3.3 |

## Compiled as one part of a sketch

| Page | Program | Title | Note |
|---|---|---|---|
| `lvgl` | 1 | The smallest LVGL screen: a button that counts | one part of a sketch: it compiles, and needs start_display() from the rest of the sketch (the page says where) |
| `lvgl-widgets` | 1 | A slider that drives a gauge, a label and a chart | one part of a sketch: it compiles, and needs start_display() from the rest of the sketch (the page says where) |
| `lvgl-styles-and-layouts` | 1 | Cards in a column with one shared style | one part of a sketch: it compiles, and needs start_display() from the rest of the sketch (the page says where) |
| `lvgl-events-and-screens` | 1 | Two screens and a switch | one part of a sketch: it compiles, and needs start_display() from the rest of the sketch (the page says where) |
| `gui-designers` | 1 | A screen built from a table | one part of a sketch: it compiles, and needs start_display() from the rest of the sketch (the page says where) |
| `hmi-design-rules` | 1 | A destructive button that needs a press-and-hold | one part of a sketch: it compiles, and needs start_display() from the rest of the sketch (the page says where) |
| `project-thermostat` | 2 | The touch screen in LVGL 9 | one part of a sketch: it compiles, and needs setup(), loop() from the rest of the sketch (the page says where) |
