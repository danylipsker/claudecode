# Which programs were compiled

Written by `node HYPER-CORE/tools/compile-esp32.js` on 2026-10-04 with arduino-cli 1.3.1 and the Arduino core for ESP32 3.3.7.
Every Arduino C++ program of the pages was built for the chip it is written for. A build proves that the program is
valid C++ against that version of the core and the libraries installed on the machine; it does not prove that it does
what the page says — nothing here was run on hardware. MicroPython programs are only parsed, and block programs are
checked by the validator.

| | Programs |
|---|---|
| Arduino C++ programs | 620 |
| **Built without error** | **543** |
| … of those, only with the large app partition (Tools → Partition Scheme → Huge APP) | 0 |
| … of those, one part of a sketch whose other part is on another page (compiled, not linked) | 7 |
| Need a library that was not installed on that machine (not built) | 71 |
| Use a call of a newer core than the one installed (not built) | 2 |
| Written for a board outside the ESP32 core (not built) | 4 |
| Failed to build | 0 |

Built for: ESP32 452, ESP32-C3 29, ESP32-S3 26, ESP32-C6 24, ESP32-P4 7, ESP32-H2 2, ESP32-C5 2, Arduino Nano ESP32 1.

## Not built: the library is not installed

Install the library named on the page (Sketch → Include Library → Manage Libraries) and they can be built the same way.

| Page | Program | Title | Missing header |
|---|---|---|---|
| `tm1637-and-max7219` | 1 | A minutes-and-seconds counter on a TM1637 | library not installed: TM1637Display.h |
| `tm1637-and-max7219` | 2 | An eight-digit MAX7219 counter | library not installed: LedControl.h |
| `character-lcd` | 1 | Two lines of text and an uptime counter | the library "LiquidCrystal" is installed but its files cannot be read on this machine |
| `lcd-i2c-backpack` | 1 | Hello on a backpack LCD | library not installed: LiquidCrystal_I2C.h |
| `custom-characters` | 1 | A progress bar with 80 steps | library not installed: LiquidCrystal_I2C.h |
| `formatting-numbers` | 1 | A readout that never jumps | library not installed: LiquidCrystal_I2C.h |
| `menus-on-small-displays` | 1 | A three-button menu on a 16 × 2 display | library not installed: LiquidCrystal_I2C.h |
| `led-matrices` | 1 | Scrolling text across four modules | library not installed: MD_Parola.h |
| `led-matrices` | 2 | Drawing one picture: a smiley | library not installed: LedControl.h |
| `internet-radio` | 1 | Play an internet radio station | library not installed: Audio.h |
| `bluetooth-audio` | 1 | Send a tone to a Bluetooth speaker | library not installed: BluetoothA2DPSource.h |
| `ble-security` | 1 | A characteristic that needs an encrypted link | library not installed: NimBLEDevice.h |
| `ble-hid` | 1 | A one-button macro pad | library not installed: BleKeyboard.h |
| `bluetooth-classic-spp-and-a2dp` | 2 | A Bluetooth speaker (A2DP sink) | library not installed: BluetoothA2DPSink.h |
| `iot-architecture` | 1 | Publish a measurement as JSON, with identity and time | library not installed: PubSubClient.h |
| `dashboards` | 1 | Announce a sensor to Home Assistant by MQTT discovery | library not installed: PubSubClient.h |
| `aws-iot-and-azure` | 1 | Connect to a cloud broker with a device certificate | library not installed: PubSubClient.h |
| `device-shadows-and-twins` | 1 | A shadow made of two retained MQTT topics | library not installed: PubSubClient.h |
| `batching-rates-and-cost` | 1 | Batch six readings into one message | library not installed: PubSubClient.h |
| `tls-on-esp` | 1 | MQTT over TLS with the broker checked | library not installed: PubSubClient.h |
| `mutual-tls` | 1 | MQTT with a certificate for the device | library not installed: PubSubClient.h |
| `thermostats` | 1 | A thermostat with minimum times and a sensor check | library not installed: OneWire.h |
| `step-pulses-and-acceleration` | 1 | Move a stepper out and back with acceleration | library not installed: AccelStepper.h |
| `field-oriented-control` | 1 | Spin a gimbal motor at a set speed with SimpleFOC | library not installed: SimpleFOC.h |
| `esp-now-gateway` | 1 | ESP-NOW in, MQTT out | library not installed: PubSubClient.h |
| `mesh-networks-on-esp` | 1 | Every node says hello to all the others | library not installed: painlessMesh.h |
| `tcp-between-boards` | 3 | A WebSocket hub for a browser and boards | library not installed: AsyncTCP.h |
| `colour-tft-displays` | 1 | Colour bars and a greeting on an ST7789 | the installed library "GFX_Library_for_Arduino" does not build with this core: GFX_Library_for_Arduino\src\databus\Arduino_ESP32SPI.cpp:124:59: error: invalid conversion from 'long unsigned int' to 'spi_t*' {aka 'spi_str |
| `display-interfaces` | 1 | Time a full-screen fill and compare it with the theory | the installed library "GFX_Library_for_Arduino" does not build with this core: GFX_Library_for_Arduino\src\databus\Arduino_ESP32SPIDMA.cpp:63:35: error: invalid conversion from 'int32_t' {aka 'long int'} to 'spi_t*' {aka |
| `flicker-and-double-buffering` | 1 | A counter without flicker | the installed library "GFX_Library_for_Arduino" does not build with this core: GFX_Library_for_Arduino\src\databus\Arduino_ESP32SPIDMA.cpp:63:35: error: invalid conversion from 'int32_t' {aka 'long int'} to 'spi_t*' {aka |
| `frame-rate-and-bus-speed` | 1 | Whole screen against only the square | the installed library "GFX_Library_for_Arduino" does not build with this core: GFX_Library_for_Arduino\src\databus\Arduino_ESP32SPIDMA.cpp:63:35: error: invalid conversion from 'int32_t' {aka 'long int'} to 'spi_t*' {aka |
| `e-paper` | 1 | A counter with partial refreshes | library not installed: GxEPD2_BW.h |
| `round-and-odd-displays` | 1 | A clock face with a seconds hand | the installed library "GFX_Library_for_Arduino" does not build with this core: GFX_Library_for_Arduino\src\databus\Arduino_ESP32SPIDMA.cpp:63:35: error: invalid conversion from 'int32_t' {aka 'long int'} to 'spi_t*' {aka |
| `rfid-and-nfc` | 1 | Read the UID of a card with an RC522 | library not installed: MFRC522.h |
| `web-server-on-esp` | 2 | The same server, without blocking the loop | library not installed: AsyncTCP.h |
| `websockets` | 1 | Push a reading every second, and echo what arrives | library not installed: AsyncTCP.h |
| `mqtt` | 1 | Publish a reading and obey a command | library not installed: PubSubClient.h |
| `mqtt-topics-qos-retain` | 1 | Announce online and offline, and listen at QoS 1 | library not installed: PubSubClient.h |
| `lora` | 1 | Send a packet every ten seconds | library not installed: RadioLib.h |
| `lora` | 2 | Receive packets and print the signal | library not installed: RadioLib.h |
| `lora-parameters` | 2 | A sender that keeps to a duty cycle | library not installed: RadioLib.h |
| `nrf24` | 1 | Send a counter and wait for the acknowledgement | library not installed: RF24.h |
| `nrf24` | 2 | Receive and print the counter | library not installed: RF24.h |
| `m5-core-controllers` | 1 | Three keys and the battery | library not installed: M5Unified.h |
| `uiflow` | 1 | A counter on the screen, the same in three forms | library not installed: M5Unified.h |
| `m5unified-and-m5gfx` | 1 | Tilt readout, and a beep on key A | library not installed: M5Unified.h |
| `esphome` | 1 | A temperature sensor that appears in Home Assistant | library not installed: PubSubClient.h |
| `tasmota` | 1 | A relay with an auto-off timer, in Tasmota's own topics | library not installed: PubSubClient.h |
| `home-assistant-integration` | 1 | A light sensor that announces itself to Home Assistant | library not installed: PubSubClient.h |
| `espeasy-and-openmqttgateway` | 1 | React to a decoded sensor message from a gateway | library not installed: PubSubClient.h |
| `temperature-sensors` | 1 | A DS18B20 that never blocks | library not installed: OneWire.h |
| `humidity-and-pressure-sensors` | 1 | Read a DHT22 | library not installed: DHT.h |
| `reading-sensors-reliably` | 1 | A DHT22 read that is checked, bounded and aged | library not installed: DHT.h |
| `lora-boards` | 1 | Send a LoRa packet every thirty seconds | library not installed: RadioLib.h |
| `e-paper-boards` | 1 | Write two lines on a 1.54-inch panel | library not installed: GxEPD2_BW.h |
| `connection-manager-machine` | 1 | A connection manager for Wi-Fi and MQTT | library not installed: PubSubClient.h |
| `tflite-micro-and-esp-dl` | 1 | Run a quantised model: the TFLM skeleton | library not installed: model_data.h |
| `edge-impulse` | 1 | Classify one window with an exported library | library not installed: my_project_inferencing.h |
| `resistive-touch` | 1 | Read the raw touch | library not installed: XPT2046_Touchscreen.h |
| `touch-calibration-and-rotation` | 1 | Calibrate with two touches and keep the result | library not installed: XPT2046_Touchscreen.h |
| `gui-concepts` | 1 | Widgets as rectangles: press, click and press lost | library not installed: XPT2046_Touchscreen.h |
| `one-wire` | 1 | Read a DS18B20 temperature | library not installed: OneWire.h |
| `one-wire` | 2 | List every part on the wire | library not installed: OneWire.h |
| `fleet-monitoring` | 1 | A heartbeat with a last will | library not installed: PubSubClient.h |
| `project-robot-car` | 1 | The car, its page and its failsafe | library not installed: AsyncTCP.h |
| `project-data-logger` | 1 | The logger, with a flush every 30 s | library not installed: OneWire.h |
| `project-lora-field-sensor` | 1 | The node: measure, check the limit, send, sleep | library not installed: RadioLib.h |
| `project-weather-station` | 1 | Wake, read, publish, sleep | library not installed: PubSubClient.h |
| `project-esp-now-sensors` | 2 | The gateway: ESP-NOW in, MQTT out | library not installed: PubSubClient.h |
| `project-ble-presence` | 1 | Listen for the tag, decide, publish | library not installed: PubSubClient.h |
| `project-energy-monitor` | 1 | Ask the meter, check the answer, publish | library not installed: PubSubClient.h |

## Not built: they need a newer core

Update the "esp32 by Espressif Systems" package in the Boards Manager and they can be built the same way.

| Page | Program | Title | Why |
|---|---|---|---|
| `matter-commissioning` | 1 | Print the codes needed to commission | uses matterWaitUntilReady(): needs the Arduino core 3.3.12 or later (installed here: 3.3.7) |
| `matter-on-esp` | 1 | A Matter on/off light | uses matterWaitUntilReady(): needs the Arduino core 3.3.12 or later (installed here: 3.3.7) |

## Not built: another board

| Page | Program | Title | Why |
|---|---|---|---|
| `u-blox-nina-and-nora` | 2 | Ask the NINA module which firmware it runs | written for a board outside the ESP32 core (another microcontroller, or the ESP8266) |
| `esp-as-a-co-processor` | 1 | Connect through the NINA radio | written for a board outside the ESP32 core (another microcontroller, or the ESP8266) |
| `nodemcu-and-doit-boards` | 1 | Which GPIO is D4? | no Arduino board for the ESP8266 in this core |
| `esp-01-and-esp-12` | 1 | A Wi-Fi switch for the on-board LED | written for a board outside the ESP32 core (another microcontroller, or the ESP8266) |

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
