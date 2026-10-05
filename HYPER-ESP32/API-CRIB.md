# Hyper ESP32 - API crib sheet (Arduino-ESP32 / MicroPython / ESP-IDF)

Written 2026-10-04. Every writer follows THIS sheet, not their memory.

How it was verified (read this once):
- WebFetch/WebSearch worked, but WebFetch gives a lossy summary (it got release YEARS wrong), so I also pulled raw sources with curl, `gh api` (read-only public GitHub data) and shallow git clones. Every date and signature below was re-read from those raw sources: the GitHub releases API, shallow clones of `espressif/arduino-esp32` tag 3.3.12 (and 4.0.0-RC1 for diffs), `micropython/micropython` tag v1.29.0 (docs + `ports/esp32` C source), raw `esp-idf` headers v5.4.2 / v5.5.5 / v6.1, and the docs.espressif.com / docs.micropython.org pages.
- Code snippets are written fresh from the documented API (checked against headers/examples in those trees). They were NOT compiled or run on hardware. Treat "compiles on core 3.3.12" as very likely, not proven.
- "UNVERIFIED:" marks anything I could not confirm.

## 0. BASELINE TO WRITE FOR

- Arduino C++: **arduino-esp32 3.3.x (3.3.12 = IDF 5.5.5)**. Core 2.x (IDF 4.4) is legacy: show it only in a "version notes" bullet when the API differs. Core 4.0.0-RC1 (IDF 6.1) exists as a pre-release; for everything in this crib it is source-compatible with 3.3.12 except where a section says otherwise (BLE/BT Classic refactor, Zigbee SDK v2).
- MicroPython: **v1.29.0** (docs.micropython.org/en/latest quickref is the dev branch that follows it).
- IDF note: name the **new** driver (IDF 5.x/6.x style). IDF 6.0 REMOVED the legacy `driver/adc.h`, `driver/timer.h`, `driver/i2s.h`, `driver/rmt.h`, `driver/pcnt.h`, `driver/mcpwm.h`, `driver/dac.h`, `driver/sigmadelta.h`; legacy `driver/i2c.h` is end-of-life (removal in v7.0) and legacy `driver/twai.h` is deprecated.

## 1. VERSIONS TABLE (as of 2026-10-04)

| Item | Current | Date | Notes |
|---|---|---|---|
| arduino-esp32 stable | **3.3.12** | 2026-09-18 | IDF v5.5.5. 3.3.9 .. 3.3.12 all IDF 5.5.4/5.5.5. |
| arduino-esp32 pre-release | **4.0.0-RC1** | 2026-09-23 | IDF v6.1. 4.0.0-alpha1 (2026-05-27) was "3.3.9 core + IDF 6.0 libs, Matter/RainMaker/ESP-SR/Insights/Cbor missing". RC1 adds: BT Classic + BLE refactor, Zigbee on esp-zigbee-sdk v2.0, Matter on ESP Matter 1.6 / IDF 6.1. No "3.x to 4.0" migration guide exists yet in the repo (only 2.x_to_3.0 and webserver_hardening). |
| ESP-IDF stable | **v6.1** | 2026-08-27 | docs.espressif.com `/stable/` = v6.1. v5.5.x line still maintained (5.5.5). |
| MicroPython | **v1.29.0** | 2026-08-24 | ESP32 port README: IDF v5.5.2 recommended (also 5.3, 5.4.x, 5.5.1, 5.5.4). |
| CircuitPython | **10.3.1** | 2026-09-14 | ESP port: ESP32-S2, S3 "stable"; ESP32, C3 "beta"; C2, C6, H2, P4 "alpha" (ports/espressif/README.rst). |
| esptool | **5.4.0** | 2026-09-02 | v5: executable is `esptool` (not `esptool.py`); commands hyphenated (`write-flash`, `erase-flash`); old underscore names still work with a deprecation warning. MicroPython 1.29's own deploy page still prints `esptool.py erase_flash` / `write_flash`. |
| PlatformIO `espressif32` (official) | 7.1.3 | 2026-09-11 | Its `platform.json` still pins `framework-arduinoespressif32 ~4.20017.0` = Arduino-ESP32 **2.0.17** (IDF 4.4). It does NOT give you core 3.x. |
| pioarduino (community fork for core 3.x) | **55.03.312-1** | 2026-09-22 | = Arduino 3.3.12 + IDF 5.5.5 ("stable"). `61.04.00-RC1` (2026-09-23) = Arduino 4.0.0-RC1 + IDF 6.1. Install via `platform = https://github.com/pioarduino/platform-espressif32/releases/download/stable/platform-espressif32.zip`. |
| Arduino IDE | 2.3.10 | 2026-06-09 | Board URL `https://espressif.github.io/arduino-esp32/package_esp32_index.json`. |
| arduino-cli | 1.5.1 | 2026-06-05 | |
| ESP-IDF VS Code extension | 2.3.0 | 2026-09-23 | |
| ESPHome | 2026.9.1 | 2026-09-29 | calendar versioning |
| Tasmota | v15.6.0 | 2026-08-25 | |
| WLED | v16.0.1 | 2026-07-07 | |
| ESP Web Tools | 10.4.0 | UNVERIFIED date | latest git tag of esphome/esp-web-tools (no GitHub "release" object). |
| Thonny | 5.0.0 | 2026-04-23 | |
| mpremote | 1.29.0 | 2026-08-24 | same version as MicroPython (PyPI). |
| UIFlow 2 firmware (M5Stack) | 2.5.3 | 2026-09-11 | m5stack/uiflow-micropython (a MicroPython fork + blocks IDE). |
| Wokwi | online simulator, no version | - | docs.wokwi.com supported-hardware page: ESP32, S2, S3 (Xtensa); C3, C6, C61, H2 supported; P4 beta; C5 and S31 alpha. |
| LVGL | **v9.6.0** | 2026-09-16 | |
| ArduinoJson | **v7.4.3** | 2026-03-02 | |
| NimBLE-Arduino (h2zero) | 2.5.1 | 2026-07-30 | |
| ESPAsyncWebServer (ESP32Async org) | v3.12.1 | 2026-09-12 | AsyncTCP (ESP32Async) v3.5.0, 2026-07-21. `me-no-dev/ESPAsyncWebServer` is ARCHIVED (last push 2025-01-20). |
| ESP32Servo | 3.2.1 | 2026-05-31 | "Compatible with Arduino ESP32 v3.0.0+" |
| Adafruit_NeoPixel | 1.15.5 | 2026-05-12 | |
| Adafruit_SSD1306 | 2.5.17 | 2026-05-29 | |
| LovyanGFX | 1.2.32 | 2026-10-02 | |
| Arduino_GFX (moononournation) | v1.6.8 | 2026-09-18 | |
| GxEPD2 | 1.6.9 | 2026-04-19 | |
| TFT_eSPI (Bodmer) | V2.5.43 | 2024-03-06 | Last release 2.5 years old; repo has pushes (2026-04-03) but no release. See task 29. |
| PubSubClient (knolleary) | v2.8 | 2020-05-20 | Not archived; last push 2026-06-10. |
| WiFiManager (tzapu) | repo, no recent release checked | - | last push 2026-02-25 |

Which chips have OFFICIAL MicroPython builds (ports/esp32/boards in v1.29.0): generic **ESP32, ESP32-C2, C3, C5, C6, H2, P4, S2, S3**, plus ~40 vendor boards. First flash offset: ESP32 and S2 = `0x1000`; C3, C6, S3, C2, H2 = `0`; C5 and P4 = `0x2000`. No ESP32-C61 board dir.

Which chips CircuitPython ships for: see CircuitPython row (S2/S3 stable, ESP32/C3 beta, C2/C6/H2/P4 alpha; `esp-idf-config` also has C5 and C61 files, status not stated in the README: UNVERIFIED).

## 2. CHIP FEATURE QUICK TABLE (Arduino-ESP32 3.3.12, docs/en/libraries.rst)

Y = supported through the core, - = not in core API (IDF only), n/a = no hardware.

| Feature | ESP32 | C2 | C3 | C5 | C6 | C61 | H2 | P4 | S2 | S3 |
|---|---|---|---|---|---|---|---|---|---|---|
| BT Classic | Y | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| BLE | Y | Y | Y | Y | Y | Y | Y | Y (via ESP-Hosted) | n/a | Y |
| Wi-Fi | Y | Y | Y | Y | Y | Y | n/a | Y (via ESP-Hosted) | Y | Y |
| ESP-NOW | Y | Y | Y | Y | Y | Y | n/a | n/a | Y | Y |
| DAC | Y | n/a | n/a | n/a | n/a | n/a | n/a | n/a | Y | n/a |
| Touch | Y | n/a | n/a | n/a | n/a | n/a | n/a | Y | Y | Y |
| USB OTG (TinyUSB) | n/a | n/a | n/a | n/a | n/a | n/a | n/a | Y | Y | Y |
| USB Serial/JTAG | n/a | n/a | Y | Y | Y | Y | Y | Y | n/a | Y |
| Zigbee | n/a | n/a | n/a | Y | Y | n/a | Y | n/a | n/a | n/a |
| Thread / OpenThread | n/a | n/a | n/a | Y | Y | n/a | Y | n/a | n/a | n/a |
| Matter over Wi-Fi | Y | - | Y | Y | Y | - | n/a | n/a | Y | Y |
| Matter over Thread | n/a | n/a | n/a | Y | Y | n/a | Y | n/a | n/a | n/a |
| Ethernet | Y (RMII + SPI) | n/a | n/a | n/a | n/a | n/a | n/a | Y | n/a | n/a |
| RMT | Y | Y | Y | Y | Y | n/a | Y | Y | Y | Y |
| TWAI/CAN | - | n/a | - | - | - | n/a | - | - | - | - |
| Hall sensor | removed (all) | | | | | | | | | |
| Pulse counter (PCNT) | - in all | | | | | | | | | |

Core-defined default pins (variants/<chip>/pins_arduino.h, 3.3.12):

| Chip variant | SDA | SCL | SS | MOSI | MISO | SCK | TX (Serial0) | RX | LED_BUILTIN |
|---|---|---|---|---|---|---|---|---|---|
| esp32 (ESP32 Dev Module) | 21 | 22 | 5 | 23 | 19 | 18 | 1 | 3 | **NOT DEFINED** (many DevKits: GPIO 2) |
| esp32s2 | 8 | 9 | 34 | 35 | 37 | 36 | 43 | 44 | = RGB_BUILTIN (PIN_RGB_LED 18) |
| esp32s3 | 8 | 9 | 10 | 11 | 13 | 12 | 43 | 44 | = RGB_BUILTIN (PIN_RGB_LED 48) |
| esp32c3 | 8 | 9 | 7 | 6 | 5 | 4 | 21 | 20 | = RGB_BUILTIN (PIN_RGB_LED 8) |
| esp32c6 | 23 | 22 | 18 | 19 | 20 | 21 | 16 | 17 | = RGB_BUILTIN (PIN_RGB_LED 8) |

On the variants where LED_BUILTIN = RGB_BUILTIN, `digitalWrite(LED_BUILTIN, HIGH)` lights the board's RGB LED white via a hidden driver; once you do that, that pin can no longer be driven as a plain GPIO (BlinkRGB example warning). On the generic `esp32` variant write `#ifndef LED_BUILTIN` / `#define LED_BUILTIN 2` yourself.

---

## TASK 1. Blink and non-blocking blink

Arduino C++ (core 3.x, also 2.x):
```cpp
#ifndef LED_BUILTIN
#define LED_BUILTIN 2          // generic ESP32 variant defines none; GPIO 2 on many DevKits
#endif

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
```

Arduino C++ non-blocking (millis):
```cpp
#ifndef LED_BUILTIN
#define LED_BUILTIN 2
#endif
const uint32_t INTERVAL_MS = 500;
uint32_t lastToggle = 0;
bool ledOn = false;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  uint32_t now = millis();
  if (now - lastToggle >= INTERVAL_MS) {   // unsigned subtraction survives the 49.7-day wrap
    lastToggle += INTERVAL_MS;             // keeps the average period exact
    ledOn = !ledOn;
    digitalWrite(LED_BUILTIN, ledOn);
  }
  // other work runs here without being delayed
}
```

MicroPython:
```python
from machine import Pin
import time

led = Pin(2, Pin.OUT)          # pick your board's LED pin
while True:
    led.value(1)
    time.sleep_ms(500)
    led.value(0)
    time.sleep_ms(500)
```
MicroPython non-blocking (ticks_ms / ticks_diff):
```python
from machine import Pin
import time

led = Pin(2, Pin.OUT)
INTERVAL = 500
last = time.ticks_ms()
while True:
    now = time.ticks_ms()
    if time.ticks_diff(now, last) >= INTERVAL:   # never compare ticks with < or -
        last = time.ticks_add(last, INTERVAL)
        led.toggle()
    # other work here
```

ESP-IDF: `gpio_config_t` + `gpio_config()`, `gpio_set_level(GPIO_NUM_2, 1)` (`driver/gpio.h`, component `esp_driver_gpio`); delay with `vTaskDelay(pdMS_TO_TICKS(500))`; microsecond clock `esp_timer_get_time()`.

Notes:
- `delay()` in Arduino-ESP32 is `vTaskDelay`-based: other FreeRTOS tasks (Wi-Fi, BLE) keep running; it is not a CPU spin.
- `millis()` returns `unsigned long` (32-bit on ESP32). `esp_timer_get_time()` is 64-bit microseconds.
- MicroPython `time.ticks_ms()` wraps (period 2**30 on most ports), so ALWAYS use `ticks_diff()` / `ticks_add()`. `Pin.toggle()` exists on the ESP32 port (docs `machine.Pin.toggle()`; also `Pin.on()/off()`).
- Pin names: Arduino uses GPIO numbers directly (`LED_BUILTIN`, `D2`-style names exist only on some variants); MicroPython `Pin(n)` is the GPIO number. On classic ESP32 modules GPIO 6-11 are wired to the SPI flash: never use them (the MicroPython quickref lists pins 6, 7, 8, 11, 16 and 17 as used for the embedded flash/PSRAM and "not recommended"). Board-specific strapping/PSRAM pin restrictions (e.g. octal PSRAM on S3) are datasheet facts: UNVERIFIED here, tell readers to check their board's pinout.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/variants/esp32/pins_arduino.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/GPIO/BlinkRGB/BlinkRGB.ino , https://docs.micropython.org/en/latest/esp32/quickref.html , https://docs.micropython.org/en/latest/library/machine.Pin.html , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/migration-guides/release-6.x/6.0/peripherals.html

---

## TASK 2. Button, pull-up, debounce, interrupts

Arduino C++ (polling with debounce, internal pull-up, button between pin and GND):
```cpp
const int BTN_PIN = 0;                 // BOOT button on most DevKits is GPIO 0 (active low)
const uint32_t DEBOUNCE_MS = 30;

bool stableState = HIGH;               // HIGH = released (pull-up)
bool lastReading = HIGH;
uint32_t lastChange = 0;

void setup() {
  Serial.begin(115200);
  pinMode(BTN_PIN, INPUT_PULLUP);      // ~45 kOhm internal pull-up
}

void loop() {
  bool reading = digitalRead(BTN_PIN);
  if (reading != lastReading) { lastReading = reading; lastChange = millis(); }
  if (millis() - lastChange > DEBOUNCE_MS && reading != stableState) {
    stableState = reading;
    if (stableState == LOW) Serial.println("pressed");
  }
}
```

Arduino C++ (interrupt; flag set in the ISR, work done in loop):
```cpp
const int BTN_PIN = 0;
volatile bool pressed = false;
volatile uint32_t lastIsrMs = 0;

void IRAM_ATTR onButton() {             // put the ISR in IRAM (see notes: ARDUINO_ISR_ATTR may be empty)
  uint32_t now = millis();              // OK in ISR (reads a timer)
  if (now - lastIsrMs > 30) {           // crude debounce
    lastIsrMs = now;
    pressed = true;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(BTN_PIN, INPUT_PULLUP);
  attachInterrupt(BTN_PIN, onButton, FALLING);   // pin number is the interrupt number on ESP32
}

void loop() {
  if (pressed) { pressed = false; Serial.println("button!"); }
}
```
With an argument: `attachInterruptArg(pin, handler_with_void_ptr, &obj, FALLING);` ; remove with `detachInterrupt(pin)`. Modes: `RISING, FALLING, CHANGE, ONLOW, ONHIGH` (+ `ONLOW_WE, ONHIGH_WE` wake-up variants, `DISABLED`).

MicroPython (poll + debounce):
```python
from machine import Pin
import time

btn = Pin(0, Pin.IN, Pin.PULL_UP)      # active low
last = btn.value()
t_change = time.ticks_ms()
while True:
    v = btn.value()
    if v != last:
        last = v
        t_change = time.ticks_ms()
    elif time.ticks_diff(time.ticks_ms(), t_change) > 30 and v == 0:
        print("pressed")
        while btn.value() == 0:        # wait for release
            time.sleep_ms(5)
    time.sleep_ms(2)
```
MicroPython (interrupt):
```python
from machine import Pin
import time

btn = Pin(0, Pin.IN, Pin.PULL_UP)
count = 0
last_ms = 0

def on_press(pin):                     # exactly one argument: the Pin
    global count, last_ms
    now = time.ticks_ms()
    if time.ticks_diff(now, last_ms) > 30:
        last_ms = now
        count += 1

btn.irq(handler=on_press, trigger=Pin.IRQ_FALLING)

while True:
    print(count)
    time.sleep(1)
```
For code that must not allocate in a hard-IRQ context (other ports / Timer on other ports): `import micropython; micropython.alloc_emergency_exception_buf(100)` and `micropython.schedule(fn, arg)`.

ESP-IDF: `gpio_config()` with `.intr_type = GPIO_INTR_NEGEDGE`, `gpio_install_isr_service(0)`, `gpio_isr_handler_add(pin, isr, arg)`; ISR function marked `IRAM_ATTR`; use `xQueueSendFromISR` / `xTaskNotifyFromISR` to defer work.

Notes:
- ISR rules (Arduino-ESP32): mark the ISR `IRAM_ATTR`. The core's examples use `ARDUINO_ISR_ATTR`, but in esp32-hal.h that macro expands to `IRAM_ATTR` ONLY when `CONFIG_ARDUINO_ISR_IRAM` is set and to nothing otherwise, so in the default prebuilt core it is empty; plain `IRAM_ATTR` is always safe (an ISR living in flash can crash if it fires while flash is being written, e.g. during NVS/LittleFS/OTA writes). Share data via `volatile`; keep it short; no `Serial.print`, no `delay`, no heap allocation, no I2C/SPI, no `String`, no FreeRTOS calls that lack an `...FromISR` variant. Setting a flag, incrementing a counter, `xQueueSendFromISR`, `xSemaphoreGiveFromISR` and `digitalWrite/digitalRead` are fine.
- ESP32 can interrupt on every GPIO (not only a few like AVR); `attachInterrupt(digitalPinToInterrupt(pin), ...)` also compiles but the wrapper is unnecessary. The official GPIO docs call `attachInterrupt(pin, handler, mode)`.
- Core also ships `FunctionalInterrupt` (std::function / lambda handler) examples under `libraries/ESP32/examples/GPIO/FunctionalInterrupt*`: lambdas are fine but the code still runs in the ISR context.
- GPIO 34-39 on ESP32 are input-only and have NO internal pull-up/pull-down; the pull-up gets silently ignored: use an external resistor. Pull value ~45 kOhm.
- MicroPython on ESP32: `Pin.irq(handler=None, trigger=IRQ_FALLING|IRQ_RISING, *, priority=1, wake=None, hard=False)` is the generic doc signature, BUT the ESP32 port (ports/esp32/machine_pin.c v1.29.0) only accepts `handler`, `trigger`, `wake` and always runs the handler through `mp_sched_schedule` (soft IRQ, allocation is allowed, but it runs "between bytecodes", not instantly; the schedule queue is small so avoid very fast storms). Do NOT write `hard=True` for ESP32 (the C code does not declare that keyword, so it should raise TypeError; UNVERIFIED by running it). `Pin.IRQ_LOW_LEVEL` / `IRQ_HIGH_LEVEL` with `wake=machine.DEEPSLEEP|SLEEP` is how a pin wakes from sleep (uses ext0).
- `Timer(..., hard=True)` raises `ValueError: hard Timers are not implemented` on ESP32 (checked in machine_timer.c).

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/gpio.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/GPIO/GPIOInterrupt/GPIOInterrupt.ino , https://docs.micropython.org/en/latest/library/machine.Pin.html , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/machine_pin.c

---

## TASK 3. PWM (LEDC), analogWrite, tone

CURRENT (core 3.x; this is what you write): channel is picked automatically, functions take the PIN.
```cpp
const int PWM_PIN  = 4;
const int PWM_FREQ = 5000;     // Hz
const int PWM_BITS = 8;        // duty range 0 .. 2^8-1 = 255

void setup() {
  ledcAttach(PWM_PIN, PWM_FREQ, PWM_BITS);    // returns bool; true = ok
}

void loop() {
  for (int d = 0; d <= 255; d++) { ledcWrite(PWM_PIN, d); delay(4); }
  for (int d = 255; d >= 0; d--) { ledcWrite(PWM_PIN, d); delay(4); }
}
```
Other 3.x LEDC calls (all take the pin unless noted):
```cpp
ledcAttachChannel(pin, freq, bits, channel);   // choose the channel yourself (pins sharing a channel share duty)
ledcWriteChannel(channel, duty);               // write by channel number
ledcWriteTone(pin, 440);                       // 50 % duty square wave at 440 Hz; freq 0 = silence; returns the freq
ledcWriteNote(pin, NOTE_C, 4);                 // note_t enum: NOTE_C, NOTE_Cs, NOTE_D, NOTE_Eb, NOTE_E, NOTE_F, NOTE_Fs, NOTE_G, NOTE_Gs, NOTE_A, NOTE_Bb, NOTE_B
ledcChangeFrequency(pin, newFreq, bits);       // retunes the whole LEDC TIMER (all channels on it)
ledcOutputInvert(pin, true);
ledcFade(pin, startDuty, targetDuty, ms);      // starts a hardware fade and RETURNS (non-blocking)
ledcFadeWithInterrupt(pin, start, target, ms, void(*cb)(void));   // cb runs in ISR context (mark it IRAM_ATTR)
ledcRead(pin); ledcReadFreq(pin); ledcDetach(pin);
// gamma-corrected fades also exist: ledcFadeGamma(), ledcSetGammaFactor(), ledcSetGammaTable()
```
analogWrite (Arduino-compatible, 0..255 by default, uses LEDC underneath, default 1 kHz):
```cpp
analogWrite(PWM_PIN, 128);           // ~50 %
analogWriteFrequency(PWM_PIN, 20000);
analogWriteResolution(PWM_PIN, 10);  // then value range is 0..1023
```

LEGACY (core 2.x, IDF 4.4) - show only as "old code you may meet", it does NOT compile on 3.x:
```cpp
ledcSetup(0, 5000, 8);        // channel, freq, bits
ledcAttachPin(4, 0);          // pin, channel
ledcWrite(0, 128);            // CHANNEL, duty
// ledcDetachPin(pin) -> renamed ledcDetach(pin) in 3.x
```

MicroPython:
```python
from machine import Pin, PWM

pwm = PWM(Pin(4), freq=5000, duty_u16=32768)   # 50 %
pwm.duty_u16(16384)        # 0..65535 (portable form, preferred)
pwm.duty(256)              # ESP32: 0..1023, ratio duty/1023
pwm.duty_ns(250_000)       # pulse width in ns, 0 .. 1e9/freq
pwm.freq(1000)             # 1 Hz .. 40 MHz (higher freq = fewer duty bits)
pwm2 = PWM(Pin(2), duty_u16=16384, invert=1)   # inverted output
pwm.deinit()
```

ESP-IDF: `ledc_timer_config()` + `ledc_channel_config()` + `ledc_set_duty()` / `ledc_update_duty()` (`driver/ledc.h`, component `esp_driver_ledc`); hardware fades via `ledc_fade_func_install()` and `ledc_set_fade_with_time()`; IDF 6.0 removed `ledc_timer_set()` (use `ledc_timer_config()` or `ledc_set_freq()`).

Notes:
- Resolution limits: 1-14 bits (1-20 bits on classic ESP32). Frequency and resolution are coupled: `freq ~ ledc_clock / (divider x 2^resolution)`. With the 40 MHz XTAL source (core default on chips that support it) 8-bit resolution cannot go below about 153 Hz; to go lower RAISE the resolution (9-14 bit), not lower it. Classic ESP32 does not use XTAL, it defaults to the auto clock.
- Channels/timers: ESP32 16 channels (2 groups x 8), 4 timers per group; S2/S3/P4 8 channels; C3/C5/C6/H2 6 channels; always 4 timers/group. Two pins with the same freq+resolution SHARE a timer, so `ledcChangeFrequency()` on one changes both. To keep frequencies independent attach them with different freq/resolution from the start (or on ESP32 use channel 0 and channel 8).
- MicroPython: ESP32 has 16 channels but only 8 distinct frequencies; S2/S3/P4: 8 channels/4 freqs; C2/C3/C5/C6/H2: 6 channels/4 freqs. `PWM(Pin, lightsleep=True)` keeps PWM running through light sleep (low-speed mode: 4 timers, 8 channels).
- Servo-style 50 Hz at 16-bit `duty_u16` works; use `duty_ns` for exact microseconds (see task 12).
- `ledcWrite` takes the PIN in 3.x (the first argument used to be the channel). Mixing `analogWrite` and `ledcAttach` on the same pin is a conflict: pick one.
- 3.3.11/3.3.12 add a timeout to the LEDC duty update wait loop and document timer sharing/frequency limits.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html , https://docs.espressif.com/projects/arduino-esp32/en/latest/migration_guides/2.x_to_3.0.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/esp32-hal-ledc.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/AnalogOut/LEDCFade/LEDCFade.ino , https://docs.micropython.org/en/latest/esp32/quickref.html#pwm-pulse-width-modulation

---

## TASK 4. ADC

Arduino C++:
```cpp
const int ADC_PIN = 34;     // ESP32: ADC1 = GPIO 32-39. S3: GPIO 1-10 (ADC1). C3: GPIO 0-4 (ADC1)

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);                     // default 12 bits on every chip (range 1-16, extra bits are shifted)
  analogSetPinAttenuation(ADC_PIN, ADC_11db);   // default for every pin is already ADC_11db
}

void loop() {
  int      raw = analogRead(ADC_PIN);           // 0..4095, uncalibrated
  uint32_t mv  = analogReadMilliVolts(ADC_PIN); // calibrated millivolts (uses eFuse calibration)
  Serial.printf("raw=%d  mV=%u\n", raw, mv);
  delay(500);
}
```
Attenuation constants (`adc_attenuation_t`, header `esp32-hal-adc.h`): `ADC_0db, ADC_2_5db, ADC_6db, ADC_11db` (there is NO `ADC_12db` in the Arduino enum; `analogSetAttenuation(adc_attenuation_t)` sets all pins, `analogSetPinAttenuation(pin, att)` one pin). IDF's own names are `ADC_ATTEN_DB_0/2_5/6/12` (`ADC_ATTEN_DB_11` is the old name of DB_12).

Measurable range per attenuation (table in the Arduino ADC docs):

| Constant | ESP32 | ESP32-S2 | ESP32-C3 | ESP32-S3 |
|---|---|---|---|---|
| ADC_0db | 100-950 mV | 0-750 mV | 0-750 mV | 0-950 mV |
| ADC_2_5db | 100-1250 mV | 0-1050 mV | 0-1050 mV | 0-1250 mV |
| ADC_6db | 150-1750 mV | 0-1300 mV | 0-1300 mV | 0-1750 mV |
| ADC_11db | 150-3100 mV | 0-2500 mV | 0-2500 mV | 0-3100 mV |

MicroPython:
```python
from machine import ADC, Pin

adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # keyword-only atten
raw16 = adc.read_u16()      # 0..65535 (raw reading scaled to 16 bit)
uv    = adc.read_uv()       # calibrated microvolts at the pin (multiple of 1000: mV resolution)
print(raw16, uv / 1000000)  # volts
# legacy still present: adc.read() (raw, width-dependent), adc.atten(), adc.width()
```
Constants: `ADC.ATTN_0DB, ATTN_2_5DB, ATTN_6DB, ATTN_11DB`; widths `ADC.WIDTH_9BIT..WIDTH_13BIT` (chip-dependent). `ADCBlock(1, bits=12).connect(Pin(34))` is the alternative API.

ESP-IDF: `esp_adc/adc_oneshot.h` (`adc_oneshot_new_unit`, `adc_oneshot_config_channel`, `adc_oneshot_read`), `adc_continuous.h`, calibration `esp_adc/adc_cali.h`+`adc_cali_scheme.h` (`adc_oneshot_get_calibrated_result` does both). Legacy `driver/adc.h` REMOVED in IDF 6.0.

Notes:
- The ESP32 ADC is non-linear near the ends; below ~100 mV reads 0 and near the top of each range it flattens. Prefer `analogReadMilliVolts()` / `read_uv()` over scaling the raw value yourself.
- Max input voltage 3.3 V (abs. max 3.6 V). At the highest attenuation the nominal "11 dB" is really ~12 dB in IDF 5+ docs.
- DISCREPANCY: MicroPython's docs list ATTN_11DB as "150mV - 2450mV" for ESP32; Arduino's docs list ADC_11db as "150 mV ~ 3100 mV". They describe the same hardware; the MicroPython text is the older figure. For prose use "roughly 0.15 V to about 3.1 V on classic ESP32 at the top attenuation (Arduino table), 0-2.5 V on S2/C3". UNVERIFIED which number the current datasheet gives (IDF docs just say "see datasheet").
- ADC2 shares hardware with Wi-Fi: MicroPython quickref states reading ADC block 2 pins (ESP32: GPIO 0, 2, 4, 12-15, 25-27) while Wi-Fi is active raises an exception. The Arduino ADC docs do not mention it (UNVERIFIED for Arduino), so say: "use ADC1 pins when Wi-Fi is on".
- Removed in 3.0: `analogSetClockDiv`, `adcAttachPin`, `analogSetVRefPin`. `analogSetWidth()` / `analogContinuousSetWidth()` still exist and only matter on classic ESP32 (9-12 bit hardware width). On ESP32-S2 chip revision v0.0 the default resolution is 13 bits (errata); v1.0+ is 12.
- Continuous (background) sampling API in the core: `analogContinuous(pins[], count, conversions_per_pin, sampling_hz, callback)`, `analogContinuousStart()`, `analogContinuousRead(&result, timeout_ms)` with `adc_continuous_result_t {pin, channel, avg_read_raw, avg_read_mvolts}`.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/esp32-hal-adc.h , https://docs.micropython.org/en/latest/esp32/quickref.html#adc-analog-to-digital-conversion , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/api-reference/peripherals/adc/index.html

---

## TASK 5. DAC (ESP32 and ESP32-S2 only)

Arduino C++:
```cpp
// ESP32: DAC1 = GPIO 25, DAC2 = GPIO 26.  ESP32-S2: GPIO 17 and 18.
const int DAC_PIN = 25;

void setup() {}

void loop() {
  for (int v = 0; v <= 255; v++) { dacWrite(DAC_PIN, v); delayMicroseconds(200); }   // 0..255 = 0 V .. ~3.3 V
  // dacDisable(DAC_PIN);   // release the pad when done
}
```
MicroPython:
```python
from machine import DAC, Pin

dac = DAC(Pin(25))        # ESP32: pins 25, 26; ESP32-S2: pins 17, 18
dac.write(128)            # 0..255, ~1.65 V
```
ESP-IDF: `driver/dac_oneshot.h` (`dac_oneshot_new_channel`, `dac_oneshot_output_voltage`), `dac_continuous.h`, `dac_cosine.h` (component `esp_driver_dac`); legacy `driver/dac.h` removed in 6.0.

Notes:
- 8-bit only. No DAC on S3, C-series, H2, P4: do NOT show `dacWrite` for them; use LEDC PWM + RC filter, or an external I2C DAC (MCP4725).
- `dacWrite(pin, value)`: value is 0-255; pin must be a DAC pad. The ESP32 variant defines `DAC1 = 25`, `DAC2 = 26`.
- Arduino core 3.x also has `dacDisable(pin)`.
- Hardware cosine/continuous DAC modes are IDF-only (no Arduino wrapper).

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/dac.html , https://docs.micropython.org/en/latest/esp32/quickref.html#dac-digital-to-analog-conversion , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/migration-guides/release-6.x/6.0/peripherals.html


---

## TASK 6. Capacitive touch (ESP32, S2, S3, P4)

Arduino C++ (classic ESP32; touched = value DROPS):
```cpp
// ESP32 touch pins (variant constants): T0=GPIO4 T1=0 T2=2 T3=15 T4=13 T5=12 T6=14 T7=27 T8=33 T9=32
// S2/S3: touch channels are GPIO 1-14 (T1..T14)
const int TOUCH_PIN = T0;

void setup() {
  Serial.begin(115200);
}

void loop() {
  uint32_t v = touchRead(TOUCH_PIN);     // touch_value_t (uint32_t in the 3.3.x / IDF 5.5 touch driver)
  Serial.println(v);                     // ESP32: value falls when touched; S2/S3: value rises when touched
  delay(200);
}
```
Interrupt (3.3.x, IDF >= 5.5 "touch-ng" driver; threshold 0 = automatic from the baseline):
```cpp
volatile bool touched = false;
void IRAM_ATTR onTouch() { touched = true; }

void setup() {
  Serial.begin(115200);
  touchSetDefaultThreshold(5);           // optional: auto-threshold = 5 % of the baseline (default 1.5 %)
  touchAttachInterrupt(T2, onTouch, 0);  // 0 = use the automatic threshold
}

void loop() {
  if (touched) { touched = false; Serial.println("touch!"); }
}
```
Fixed-threshold form (works on every core): `touchAttachInterrupt(T2, onTouch, 40);` on ESP32 it fires when the value goes below 40; on S2/S3 the number is how far the value must RISE above the baseline (the deep-sleep example uses 5000 there). Remove: `touchDetachInterrupt(pin)`. Wake-up: `touchSleepWakeUpEnable(pin, threshold)`.

MicroPython:
```python
from machine import TouchPad, Pin
import time

t = TouchPad(Pin(14))          # ESP32 pins: 0 2 4 12 13 14 15 27 32 33; S2/S3: 1..14, else ValueError
while True:
    print(t.read())            # ESP32: SMALLER when touched; S2/S3: LARGER when touched
    time.sleep_ms(200)
# wake from sleep:  t.config(500); esp32.wake_on_touch(True); machine.lightsleep()
```

ESP-IDF: new touch driver `driver/touch_sens.h` (`touch_sensor_new_controller`, `touch_sensor_new_channel`, `touch_channel_read_data`); the older `touch_pad_*` API in `driver/touch_sensor.h` is the legacy one (Arduino's DeepSleep touch example still includes `hal/touch_sensor_legacy_types.h` for IDF >= 6). IDF 6.0 moved `touch_element` to the component registry.

Notes:
- DIRECTION: ESP32 (touch v1): value falls when touched. ESP32-S2/S3 (v2) and P4: value rises when touched. (Arduino docs, MicroPython quickref and the HAL header comment agree.) Code that works on one must flip the comparison on the other. Raw numbers vary by board and wiring: always print them to choose a threshold.
- The Arduino docs page (api/touch.rst) is written for the legacy HAL: it lists `touchSetCycles(measure, sleep)` and says `touchRead` returns uint16_t on ESP32. In 3.3.12 with IDF 5.5 the core compiles `esp32-hal-touch-ng.c` (condition `ESP_IDF_VERSION >= 5.5.0`), where `touch_value_t` is `uint32_t`, `touchSetCycles` is replaced by `touchSetTiming(measure_us, sleep)` / `touchSetConfig(...)` (call before the first touch use) and `touchSetDefaultThreshold(percent)` exists. Do not use `touchSetCycles` in new text. Cores on IDF <= 5.4 (2.x, early 3.x) have the legacy functions.
- `touchRead()` on a pin sets the pin up as touch; it is not a normal GPIO afterwards until detached/reset.
- S2/S3 allow only ONE touch pad as a deep-sleep wake source; ESP32 allows several.
- No touch on C-series/H2 (n/a in the chip table).

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/touch.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/esp32-hal-touch-ng.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/Touch/TouchInterrupt/TouchInterrupt.ino , https://docs.micropython.org/en/latest/esp32/quickref.html#capacitive-touch

---

## TASK 7. Serial / UART, USB-CDC

Arduino C++:
```cpp
void setup() {
  Serial.begin(115200);                                    // console; see notes for what "Serial" is on USB chips
  Serial1.begin(9600, SERIAL_8N1, /*rx*/ 16, /*tx*/ 17);   // order: baud, config, RX pin, TX pin
}

void loop() {
  if (Serial1.available()) {
    String line = Serial1.readStringUntil('\n');
    Serial.printf("got: %s\n", line.c_str());
  }
  Serial1.println("ping");
  delay(1000);
}
```
Useful: `Serial.setRxBufferSize(1024)` (BEFORE `begin`; default RX buffer 256 B), `Serial1.setPins(rx, tx, cts, rts)`, `Serial1.end()`, `Serial1.onReceive(cb)` (runs in the UART event task, not an ISR), `Serial.printf(...)`, `Serial.write(buf, len)`, `Serial.readBytes(buf, n)`. The core defines pin macros `RX1`/`TX1` for Serial1 (the docs use `Serial1.begin(9600, SERIAL_8N1, RX1, TX1)`).

MicroPython:
```python
from machine import UART

uart = UART(1, baudrate=9600, tx=17, rx=16)               # keywords; any GPIO via the matrix
uart.init(baudrate=115200, bits=8, parity=None, stop=1)   # reconfigure
uart.write(b"hello\n")
if uart.any():
    data = uart.read()            # bytes or None
    line = uart.readline()
```
UART ids on classic ESP32: 0, 1, 2 (UART0 is the REPL on GPIO1/3 at 115200). Defaults: UART1 tx10/rx9, UART2 tx17/rx16 (UART1's 10/9 are flash pins on many modules, so ALWAYS pass `tx=`/`rx=`; with SPIRAM the UART1 defaults become tx5/rx4). Input-only pins 34-39 can only be `rx`.

ESP-IDF: `driver/uart.h` (`uart_driver_install`, `uart_param_config`, `uart_set_pin`, `uart_write_bytes`, `uart_read_bytes`), component `esp_driver_uart`; console on USB: `usb_serial_jtag_*`.

Notes:
- What `Serial` means (macro logic in `HardwareSerial.h`): with Tools > **USB CDC On Boot = Disabled** (default on most boards) `Serial` is `Serial0` = UART0 (the USB-to-UART bridge pins: GPIO 1/3 on ESP32, 43/44 on S3, 21/20 on C3, 16/17 on C6). With **Enabled**: `Serial` becomes `HWCDCSerial` (the chip's built-in USB Serial/JTAG; Tools > USB Mode = "Hardware CDC and JTAG") on C3/C6/H2/S3, or `USBSerial` (TinyUSB CDC; USB Mode = "USB-OTG (TinyUSB)") on S2/S3. `Serial0`, `HWCDCSerial` and `USBSerial` are always usable by name. The Arduino docs say to use `Serial0.print()` for the UART when CDC-on-boot is enabled.
- Typical native-USB gotcha (S3/C3/C6 boards): with CDC On Boot disabled nothing shows in the Serial Monitor because the board's USB connector goes to the USB peripheral, not UART0. Enable CDC On Boot, or use `Serial0` with an external UART adapter. `while (!Serial) delay(10);` waits for the host to open the CDC port (on a real UART it never blocks). Text printed before the host connects can be lost.
- Migration guide (2.x to 3.0): `setHwFlowCtrlMode`/`setMode` take enums; default Serial1/Serial2 pins moved (ESP32 UART1 RX/TX = 26/27, UART2 RX/TX = 4/25, ESP32-S2 UART1 = 4/5); `begin(baud, rx, tx)` detaches previously attached pins; a pin passed as -1 is left unchanged. Always pass explicit pins.
- 3.3.11 added RX internal pull-up/pull-down control and one-wire UART (RX and TX on the same pin = automatic open-drain single-wire mode). `begin(0)` baud auto-detect works only on ESP32 and S2.
- HP UART counts: ESP32 3, S3 3, S2/C3/H2/C5/C6 2, P4 5 (plus 1 LP UART on C5/C6/P4; LP UART pins are fixed on C5/C6).
- 4.0.0-RC1: no Serial API change noted in the release notes.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/serial.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/HardwareSerial.h , https://docs.espressif.com/projects/arduino-esp32/en/latest/guides/tools_menu.html , https://docs.micropython.org/en/latest/esp32/quickref.html#uart-serial-bus

---

## TASK 8. I2C

Arduino C++ (scan + read one register):
```cpp
#include <Wire.h>

const int SDA_PIN = 21, SCL_PIN = 22;    // generic ESP32; the S3/C3 variants default to 8/9, C6 to 23/22

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN, 400000);  // bool; (sda, scl, freq). Wire.begin(0x42) would mean a SLAVE address!
  for (uint8_t a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\n", a);
  }
}

uint8_t readReg(uint8_t dev, uint8_t reg) {
  Wire.beginTransmission(dev);
  Wire.write(reg);
  Wire.endTransmission(false);           // repeated start (no STOP)
  Wire.requestFrom(dev, (size_t)1);
  return Wire.available() ? Wire.read() : 0xFF;
}

void loop() {}
```
Other: `Wire.setPins(sda, scl)` before `begin()` (so libraries can call plain `Wire.begin()`), `Wire.setClock(hz)`, `Wire.setTimeOut(ms)` (default 50 ms), second bus `Wire1` (chips with two I2C controllers), `Wire.setBufferSize()`. `endTransmission()` returns 0 ok, 1 too long, 2 NACK on address, 3 NACK on data, 4 other, 5 timeout.

MicroPython:
```python
from machine import I2C, Pin

i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)   # hardware controller ids 0 and 1
print([hex(a) for a in i2c.scan()])
who = i2c.readfrom_mem(0x68, 0x75, 1)                 # (addr, register, nbytes) -> bytes
i2c.writeto_mem(0x68, 0x6B, b"\x00")                  # (addr, register, bytes)
# bit-banged on any pins:
# from machine import SoftI2C
# i2c = SoftI2C(scl=Pin(5), sda=Pin(4), freq=100000)
```
MicroPython defaults (`machine_i2c.h`): I2C(0): SCL 18 / SDA 19, but on ESP32-C3 and S3 SCL 9 / SDA 8; I2C(1): ESP32 SCL 25 / SDA 26, other chips SCL 9 / SDA 8. Pass the pins explicitly.

ESP-IDF: new `driver/i2c_master.h` (`i2c_new_master_bus`, `i2c_master_bus_add_device`, `i2c_master_transmit_receive`); slave `driver/i2c_slave.h`. The legacy `driver/i2c.h` is end-of-life in IDF 6.0 (removal planned in 7.0). Arduino core 3.3.x with IDF >= 5.4 builds Wire on `i2c_master` (`esp32-hal-i2c-ng.c`).

Notes:
- External pull-up resistors (typically 4.7 kOhm) are required.
- `Wire.begin(a, b)` = (sda, scl); `Wire.begin(a)` with ONE argument = slave address. 3.x `begin()` returns `bool`.
- `requestFrom(addr, len)` takes `size_t`: pass a cast or a size_t variable.
- The Arduino core has no software I2C; MicroPython has `SoftI2C`.
- MicroPython `machine.I2CTarget` (I2C slave) appeared in 1.26.0 (release notes).

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/i2c.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/Wire/src/Wire.h , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/machine_i2c.h , https://docs.micropython.org/en/latest/esp32/quickref.html#hardware-i2c-bus

---

## TASK 9. SPI

Arduino C++ (global `SPI` is VSPI on classic ESP32, FSPI on the other chips):
```cpp
#include <SPI.h>

const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23, PIN_CS = 5;   // classic ESP32 defaults

void setup() {
  pinMode(PIN_CS, OUTPUT);
  digitalWrite(PIN_CS, HIGH);
  SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);   // bool begin(sck, miso, mosi, ss)
}

uint8_t transferByte(uint8_t tx) {
  SPI.beginTransaction(SPISettings(1000000, MSBFIRST, SPI_MODE0));   // (clock Hz, bit order, data mode)
  digitalWrite(PIN_CS, LOW);
  uint8_t rx = SPI.transfer(tx);
  digitalWrite(PIN_CS, HIGH);
  SPI.endTransaction();
  return rx;
}

void loop() {}
```
Second bus: `SPIClass hspi(HSPI); hspi.begin(14, 12, 13, 15);` (classic: HSPI = SPI2 on 14/12/13/15; `FSPI` on classic is the flash bus, never use it). On S2/S3/C3/C6/H2/P4 the id macros are `FSPI` (=SPI2) and `HSPI` (SPI3 on S2/S3/P4); pins can be matrixed. Also `SPI.transfer(buf, len)`, `SPI.transferBytes(tx, rx, len)`, `SPI.writeBytes()`, `SPI.writePixels()`, `SPI.transfer16()`.

MicroPython:
```python
from machine import Pin, SPI

cs = Pin(5, Pin.OUT, value=1)
spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, bits=8, firstbit=SPI.MSB,
          sck=Pin(18), mosi=Pin(23), miso=Pin(19))      # id 2 = VSPI on ESP32
cs(0)
spi.write(b"\x9f")            # also: spi.read(n), spi.readinto(buf), spi.write_readinto(out, inp)
jedec = spi.read(3)
cs(1)
# SoftSPI(baudrate=..., polarity=0, phase=0, sck=Pin(..), mosi=Pin(..), miso=Pin(..))   all three pins are required
```
IDs (comment table in `machine_hw_spi.c`): ESP32: SPI(1) = HSPI (default sck14 mosi13 miso12), SPI(2) = VSPI (18/23/19). ESP32-S2/S3: SPI(1) = SPI2, SPI(2) = SPI3. ESP32-C3/C6/H2: only SPI(1) exists, SPI(2) is an error. Hardware SPI up to 80 MHz on default pins, 40 MHz on other pins.

ESP-IDF: `driver/spi_master.h` (`spi_bus_initialize`, `spi_bus_add_device`, `spi_device_transmit`), component `esp_driver_spi`. IDF 6.0 removed the deprecated HSPI/VSPI IOMUX pin macros on ESP32/S2.

Notes:
- `SPIClass(uint8_t spi_bus = HSPI)`; the global is `SPIClass SPI(VSPI)` on classic ESP32 and `SPIClass SPI(FSPI)` elsewhere (SPI.cpp). Names differ per chip: say "the default SPI bus" in prose.
- `SPI.begin()` with no arguments uses the variant default pins (section 2 table). Display/SD libraries often call `SPI.begin()` themselves; if you remap pins call `SPI.begin(sck, miso, mosi, cs)` first.
- Wrap shared-bus transfers in `beginTransaction`/`endTransaction`; `SPISettings()` default = 1 MHz, MSBFIRST, MODE0.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/SPI/src/SPI.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/esp32-hal-spi.h , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/machine_hw_spi.c , https://docs.micropython.org/en/latest/esp32/quickref.html#hardware-spi-bus

---

## TASK 10. DS18B20 (1-Wire) and DHT22

Arduino C++ (libraries: OneWire 2.3.8, DallasTemperature 4.0.6, DHT sensor library 1.4.7 + Adafruit Unified Sensor):
```cpp
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

OneWire oneWire(4);                 // DS18B20 data on GPIO 4 + 4.7k pull-up to 3V3
DallasTemperature ds(&oneWire);
DHT dht(15, DHT22);                 // DHT22 data on GPIO 15

void setup() {
  Serial.begin(115200);
  ds.begin();
  dht.begin();
}

void loop() {
  ds.requestTemperatures();                         // blocks ~750 ms at 12 bit
  float tc = ds.getTempCByIndex(0);                 // DEVICE_DISCONNECTED_C (-127) if missing
  float h = dht.readHumidity();
  float t = dht.readTemperature();                  // Celsius; NaN on failure
  if (!isnan(h) && !isnan(t)) Serial.printf("DS %.2f C | DHT %.1f C %.1f %%\n", tc, t, h);
  delay(2000);                                      // DHT22 needs >= 2 s between reads
}
```
MicroPython (these modules are frozen into the official ESP32 firmware, so no install is needed):
```python
from machine import Pin
import onewire, ds18x20, dht, time

ow = onewire.OneWire(Pin(4))        # 4.7k pull-up to 3V3 on the data line
ds = ds18x20.DS18X20(ow)
roms = ds.scan()                    # list of 8-byte ROM codes
d = dht.DHT22(Pin(15))              # or dht.DHT11(...)

while True:
    ds.convert_temp()
    time.sleep_ms(750)              # wait for the conversion before reading
    print("DS18B20:", ds.read_temp(roms[0]))
    d.measure()                     # raises OSError on a failed read
    print("DHT22:", d.temperature(), d.humidity())
    time.sleep(2)
```

ESP-IDF: there is no 1-Wire driver in IDF itself; use registry components (`espressif/onewire_bus`, `espressif/ds18b20`; names from memory: UNVERIFIED) or bit-bang the DHT.

Notes:
- `ports/esp32/boards/manifest.py` (v1.29.0) does `require("dht")`, `require("ds18x20")`, `require("onewire")`, `require("neopixel")`, `require("umqtt.simple")`, `require("umqtt.robust")`, `require("aioespnow")` and `require("bundle-networking")` (= mip, ntptime, ssl, requests, webrepl, urequests). So on a stock official ESP32 build all of these import with no `mip install`. Custom or vendor builds may omit them.
- The MicroPython DHT driver is software and works on all pins (quickref). DHT22 min interval 2 s, DHT11 1 s.
- OneWire 2.3.8 dates from 2024-05 and is used with core 3.x; DallasTemperature 4.0.6 (2026-02). Library Manager names: "OneWire" (Paul Stoffregen), "DallasTemperature" (Miles Burton), "DHT sensor library" (Adafruit).
- For non-blocking reads: `ds.setWaitForConversion(false)`, `requestTemperatures()`, then `getTempCByIndex(0)` after 750 ms.

Source: https://docs.micropython.org/en/latest/esp32/quickref.html#onewire-driver , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/boards/manifest.py , https://github.com/milesburton/Arduino-Temperature-Control-Library , https://github.com/adafruit/DHT-sensor-library

---

## TASK 11. NeoPixel / WS2812

Core built-in RGB LED helper (3.x). Name: **`rgbLedWrite`** (also `rgbLedWriteOrdered`). `neopixelWrite` still exists in 3.3.12 but is `[[deprecated("Use rgbLedWrite() instead.")]]` and logs a warning.
```cpp
void setup() {}

void loop() {
#ifdef RGB_BUILTIN                                 // defined on the S2/S3/C3/C6 DevKit variants (= LED_BUILTIN)
  rgbLedWrite(RGB_BUILTIN, RGB_BRIGHTNESS, 0, 0);  // red   (RGB_BRIGHTNESS default 64)
  delay(500);
  rgbLedWrite(RGB_BUILTIN, 0, RGB_BRIGHTNESS, 0);  // green
  delay(500);
  rgbLedWrite(RGB_BUILTIN, 0, 0, RGB_BRIGHTNESS);  // blue
  delay(500);
  rgbLedWrite(RGB_BUILTIN, 0, 0, 0);               // off
  delay(500);
#endif
}
```
`rgbLedWriteOrdered(pin, LED_COLOR_ORDER_GRB, r, g, b)` selects the byte order (enum `rgb_led_color_order_t`: RGB, BGR, BRG, RBG, GBR, GRB; the default is `RGB_BUILTIN_LED_COLOR_ORDER` = GRB). `digitalWrite(RGB_BUILTIN, HIGH/LOW)` also works (white/off). After using either, that pin cannot be reused as a normal GPIO. The helper drives ONE pixel; for strips use a library.

Strips: Adafruit_NeoPixel 1.15.5:
```cpp
#include <Adafruit_NeoPixel.h>

#define LED_PIN   5
#define LED_COUNT 8
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(40);                            // 0-255
}

void loop() {
  for (int i = 0; i < LED_COUNT; i++) {
    strip.clear();
    strip.setPixelColor(i, strip.Color(255, 0, 0));
    strip.show();
    delay(100);
  }
}
```
MicroPython:
```python
from machine import Pin
from neopixel import NeoPixel
import time

np = NeoPixel(Pin(48), 8)          # (pin, number of pixels); GPIO 48 is the on-board RGB on many S3 boards: check yours
for i in range(8):
    np.fill((0, 0, 0))
    np[i] = (255, 0, 0)            # (R, G, B) tuples; np[i] reads back a tuple
    np.write()                     # nothing is sent until write()
    time.sleep_ms(100)
# NeoPixel(pin, n, bpp=4) for RGBW, timing=0 for 400 kHz parts
```
ESP-IDF: `espressif/led_strip` managed component (RMT or SPI backend), or the RMT TX encoder (`driver/rmt_tx.h`, `rmt_new_tx_channel`).

Notes:
- `rgbLedWrite` came from the 2024-08-28 commit "Change neopixel references to use RGB LED naming" (#10225), which is in 3.0.5 (released 2024-09-18) / 3.1.0; the exact first tag is UNVERIFIED. On 3.0.0-3.0.4 and 2.x the function is `neopixelWrite(pin, r, g, b)`.
- DevKit RGB LEDs are usually GRB WS2812 on a 3.3 V data line. 5 V strips often need a level shifter, a 300-470 Ohm series resistor on the data line and a big capacitor across 5 V.
- UNVERIFIED: whether Adafruit_NeoPixel 1.15.5 uses RMT or bit-banging on core 3.x (it works there; behavior under heavy Wi-Fi load not checked).

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/esp32-hal-rgb-led.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/GPIO/BlinkRGB/BlinkRGB.ino , https://docs.micropython.org/en/latest/esp32/quickref.html#neopixel-and-apa106-driver

---

## TASK 12. Servo (50 Hz)

Arduino C++ with the ESP32Servo library (3.2.1, "Compatible with Arduino ESP32 v3.0.0+"):
```cpp
#include <ESP32Servo.h>

Servo servo;

void setup() {
  servo.setPeriodHertz(50);          // standard 50 Hz servo
  servo.attach(18, 500, 2400);       // pin, min pulse us, max pulse us
}

void loop() {
  for (int a = 0; a <= 180; a += 5) { servo.write(a); delay(20); }
  for (int a = 180; a >= 0; a -= 5) { servo.write(a); delay(20); }
}
```
No library, LEDC directly (core 3.x):
```cpp
const int SERVO_PIN = 18;
const int FREQ = 50, BITS = 14;                    // 20 ms period, 16384 steps (1.2 us each). NOT 16: the LEDC timer is
                                                   // 14 bits wide on the S2, S3, C3 and C2 (20 on the ESP32, C6, H2, C5, C61, P4)

uint32_t usToDuty(uint32_t us) { return (uint64_t)us * ((1u << BITS) - 1) / 20000u; }

void setup() {
  ledcAttach(SERVO_PIN, FREQ, BITS);
}

void loop() {
  ledcWrite(SERVO_PIN, usToDuty(1000));  delay(1000);   // about 0 deg
  ledcWrite(SERVO_PIN, usToDuty(1500));  delay(1000);   // centre
  ledcWrite(SERVO_PIN, usToDuty(2000));  delay(1000);   // about 180 deg
}
```
(core 2.x: `ledcSetup(0, 50, 16); ledcAttachPin(18, 0); ledcWrite(0, duty);`)

MicroPython:
```python
from machine import Pin, PWM
import time

servo = PWM(Pin(18), freq=50)           # 50 Hz = 20 ms period
def pulse_us(us):
    servo.duty_ns(us * 1000)            # pulse width in nanoseconds

for us in (1000, 1500, 2000, 1500):
    pulse_us(us)
    time.sleep(1)
servo.deinit()
```
ESP-IDF: `driver/mcpwm_prelude.h` (`mcpwm_new_timer`, `mcpwm_new_operator`, `mcpwm_new_comparator`, `mcpwm_new_generator`; component `esp_driver_mcpwm`, not on C3/C2) or LEDC at 50 Hz.

Notes:
- A hobby servo wants roughly 500-2500 us pulses (1000-2000 us nominal) at 50 Hz; power it from its own 5 V supply with a common GND; the signal is 3.3 V logic.
- LEDC pins with the same frequency and resolution share a timer: several servos at 50 Hz share one, which is fine; `analogWrite` pins at 1 kHz use another.
- ESP32Servo README: on the ESP32-S3 it can also use 12 MCPWM channels, otherwise LEDC. Pre-3.0 ESP32Servo code needed `ESP32PWM::allocateTimer(0..3)`; the 3.x-compatible release does not.
- MicroPython `duty_ns` range is 0 .. 1e9/freq; `duty_u16` also works (`us / 20000 * 65535`).

Source: https://github.com/madhephaestus/ESP32Servo , https://docs.micropython.org/en/latest/esp32/quickref.html#pwm-pulse-width-modulation , https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html

---

## TASK 13. Hardware timers, Ticker, machine.Timer

Arduino C++ (core 3.x: ONE argument = frequency; arm the alarm with `timerAlarm`):
```cpp
hw_timer_t *timer = nullptr;
volatile uint32_t ticks = 0;

void IRAM_ATTR onTimer() {            // ISR: keep tiny, no Serial/delay/heap
  ticks++;
}

void setup() {
  Serial.begin(115200);
  timer = timerBegin(1000000);                 // 1 MHz tick = 1 us resolution; the timer starts counting
  timerAttachInterrupt(timer, &onTimer);       // (timer, void(*)(void)); no 'edge' argument any more
  timerAlarm(timer, 1000000, true, 0);         // alarm_value (ticks), autoreload, reload_count (0 = forever)
}

void loop() {
  static uint32_t last = 0;
  if (ticks != last) { last = ticks; Serial.printf("tick %u\n", (unsigned)last); }
}
```
More 3.x calls: `timerEnd(t)`, `timerStart/Stop/Restart(t)`, `timerWrite(t, v)`, `timerRead(t)`, `timerReadMicros/Millis/Seconds(t)`, `timerGetFrequency(t)`, `timerAttachInterruptArg(t, fn(void*), arg)`, `timerDetachInterrupt(t)`. To share data with `loop()`: a `portMUX_TYPE` with `portENTER_CRITICAL_ISR/portEXIT_CRITICAL_ISR` in the ISR (and `portENTER_CRITICAL` in loop), or `xSemaphoreGiveFromISR` as in the core's RepeatTimer example.

LEGACY (core 2.x; does NOT compile on 3.x):
```cpp
hw_timer_t *timer = timerBegin(0, 80, true);        // timer number, prescaler (80 MHz / 80 = 1 MHz), count up
timerAttachInterrupt(timer, &onTimer, true);        // third argument = edge
timerAlarmWrite(timer, 1000000, true);              // value, autoreload
timerAlarmEnable(timer);
```
(Removed in 3.0: timerSetDivider, timerSetCountUp, timerSetAutoReload, timerAlarmWrite/Enable/Disable/Enabled/Read*, timerGet/SetConfig, timerAttachInterruptFlag.)

Ticker library (software timer on `esp_timer`; the callback runs in the esp_timer task, not in an ISR):
```cpp
#include <Ticker.h>
Ticker blinker;
void toggle() { digitalWrite(2, !digitalRead(2)); }
void setup() { pinMode(2, OUTPUT); blinker.attach_ms(500, toggle); }   // attach(seconds, f), attach_ms, attach_us, once(), once_ms(), detach()
void loop() {}
```

MicroPython:
```python
from machine import Timer

def tick(t):
    print("tick")

tim = Timer(0)                                              # ESP32/S2/S3: ids 0-3; C3/C6/H2: 0-1; C2: 0
tim.init(period=1000, mode=Timer.PERIODIC, callback=tick)   # period in ms
# tim.init(freq=2, mode=Timer.PERIODIC, callback=tick)      # or a frequency in Hz
# Timer.ONE_SHOT for a single shot;  tim.deinit() to stop
```
ESP-IDF: `driver/gptimer.h` (`gptimer_new_timer`, `gptimer_set_alarm_action`, `gptimer_register_event_callbacks`, `gptimer_enable`, `gptimer_start`), component `esp_driver_gptimer`; software timers `esp_timer_create` / `esp_timer_start_periodic`. The legacy `driver/timer.h` was removed in IDF 6.0.

Notes:
- Hardware timer counts (Arduino docs): ESP32/S2/S3 4; C3/C6/H2 2. (MicroPython quickref: 1 for C2, 2 for C4/C6/H4, otherwise 4.)
- MicroPython ESP32 timer callbacks are SOFT (scheduled) callbacks: `hard=True` raises `ValueError: hard Timers are not implemented` (quickref + `machine_timer.c`). The generic `machine.Timer` doc shows `hard=True` as the default; the ESP32 default is False. So allocation inside the callback is allowed, but keep it short and do not rely on microsecond timing.
- `machine.Timer(-1)` (virtual timers on esp_timer) is in the C source and in the 1.29.0 release notes ("virtual timers via machine.Timer(-1)"), yet the ESP32 quickref still says "Virtual timers are not currently supported on this port" (stale text). UNVERIFIED by running.
- Prefer `esp_timer`/`Ticker` for millisecond-scale periodic jobs; use `hw_timer_t` only for precise microsecond timing with an ISR. `timerAlarm()` replaced `timerAlarmWrite()` + `timerAlarmEnable()`, and `timerBegin()` starts the timer.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/timer.html , https://docs.espressif.com/projects/arduino-esp32/en/latest/migration_guides/2.x_to_3.0.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/Timer/RepeatTimer/RepeatTimer.ino , https://docs.micropython.org/en/latest/esp32/quickref.html#timers , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/machine_timer.c

---

## TASK 14. Deep sleep and wake-up

Arduino C++ (timer wake + RTC memory + wake cause; API names checked against IDF 5.5.5 / 6.1 headers):
```cpp
RTC_DATA_ATTR int bootCount = 0;               // survives deep sleep (RTC memory), lost on power cycle

void printWakeReason() {
  switch (esp_sleep_get_wakeup_cause()) {      // IDF 6.1 deprecates this for esp_sleep_get_wakeup_causes() (bitmask)
    case ESP_SLEEP_WAKEUP_TIMER:    Serial.println("timer");  break;
    case ESP_SLEEP_WAKEUP_EXT0:     Serial.println("ext0");   break;
    case ESP_SLEEP_WAKEUP_EXT1:     Serial.println("ext1");   break;
    case ESP_SLEEP_WAKEUP_TOUCHPAD: Serial.println("touch");  break;
    case ESP_SLEEP_WAKEUP_ULP:      Serial.println("ulp");    break;
    default:                        Serial.println("power-on / reset"); break;
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.printf("boot #%d\n", ++bootCount);
  printWakeReason();
  esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);   // microseconds, 64-bit
  Serial.flush();
  esp_deep_sleep_start();                               // never returns; the chip restarts into setup()
}

void loop() {}
```
GPIO and touch wake-up sources:
```cpp
#include "driver/rtc_io.h"
#define WAKE_PIN GPIO_NUM_33                            // must be an RTC GPIO (ESP32: 0,2,4,12-15,25-27,32-39)

// ext0: ONE pin, ESP32/S2/S3 only
esp_sleep_enable_ext0_wakeup(WAKE_PIN, 1);              // level: 1 = high, 0 = low
rtc_gpio_pullup_dis(WAKE_PIN);
rtc_gpio_pulldown_en(WAKE_PIN);                         // hold the pin idle-low during sleep

// ext1: several pins named by a 64-bit mask (ESP32, S2, S3, C6, H2)
esp_sleep_enable_ext1_wakeup_io(1ULL << WAKE_PIN, ESP_EXT1_WAKEUP_ANY_HIGH);
//   classic ESP32 also has ESP_EXT1_WAKEUP_ALL_LOW; every OTHER chip has ESP_EXT1_WAKEUP_ANY_LOW
//   (ALL_LOW is marked deprecated there). The old esp_sleep_enable_ext1_wakeup() is documented as
//   "will be deprecated in release/v6.0": use ..._ext1_wakeup_io.

// chips with deep-sleep GPIO wake (SOC_GPIO_SUPPORT_DEEPSLEEP_WAKEUP, e.g. C3):
esp_deep_sleep_enable_gpio_wakeup(1ULL << 4, ESP_GPIO_WAKEUP_GPIO_LOW);   // IDF 5.5 name
//   IDF 6.1 renames it esp_sleep_enable_gpio_wakeup_on_hp_periph_powerdown(mask, esp_sleep_gpio_wake_up_mode_t)

// touch: ESP32 may enable several pads, S2/S3 only one
touchSleepWakeUpEnable(T3, 40);                         // ESP32 threshold ~40; S2/S3 use a larger delta (example 5000)
```
Other: `esp_sleep_get_ext1_wakeup_status()` (mask of the pins that woke the chip), `esp_sleep_get_touchpad_wakeup_status()`, `esp_light_sleep_start()`. `ESP.deepSleep(us)` is ESP8266, not the ESP32 core: use the `esp_sleep_*` calls.

MicroPython:
```python
import machine, esp32
from machine import Pin, RTC

print("reset cause:", machine.reset_cause())           # machine.DEEPSLEEP_RESET after a deep-sleep wake
print("wake reason:", machine.wake_reason())           # machine.TIMER_WAKE / PIN_WAKE / EXT1_WAKE / TOUCHPAD_WAKE / ULP_WAKE

rtc = RTC()
count = int.from_bytes(rtc.memory() or b"\x00", "little") + 1
rtc.memory(count.to_bytes(2, "little"))                # up to 2048 bytes kept across deep sleep

esp32.wake_on_ext0(pin=Pin(33, Pin.IN), level=esp32.WAKEUP_ANY_HIGH)       # ext0 chips
# esp32.wake_on_ext1(pins=(Pin(32), Pin(33)), level=esp32.WAKEUP_ANY_HIGH)
machine.deepsleep(10_000)                              # milliseconds; no argument = sleep until a wake source fires
```
Also: `Pin.irq(trigger=Pin.IRQ_LOW_LEVEL, wake=machine.DEEPSLEEP)` (uses ext0), `esp32.wake_on_gpio(pins, level)` (light sleep always; deep sleep only on boards that support it), `esp32.wake_on_touch(True)`, `esp32.gpio_deep_sleep_hold(True)` with `Pin(n, ..., hold=True)` to keep non-RTC pin states, `machine.wake_pins()` (new in 1.29: which pins woke the chip), `pin.init(pull=None)` before sleeping to switch pulls off.

ESP-IDF: `esp_sleep.h`: `esp_sleep_enable_timer_wakeup`, `esp_sleep_enable_ext0_wakeup`, `esp_sleep_enable_ext1_wakeup_io`, `esp_deep_sleep_start`, `esp_sleep_get_wakeup_cause` / `esp_sleep_get_wakeup_causes` (6.1), `RTC_DATA_ATTR`.

Notes:
- Deep sleep restarts the program: `setup()` runs again, normal RAM is lost; only `RTC_DATA_ATTR`/`RTC_NOINIT_ATTR` variables (Arduino) or `RTC().memory()` / NVS (MicroPython) survive.
- On classic ESP32 ext0 cannot be combined with touch or ULP wake sources (IDF header note). Internal pulls on RTC pins need the RTC peripheral power domain kept on.
- Wi-Fi/BLE are off after deep sleep: re-init and reconnect on every wake.
- ext0 exists on ESP32/S2/S3 only. ext1 RTC GPIO ranges (IDF header): ESP32 0,2,4,12-15,25-27,32-39; S2/S3 0-21; C6 0-7; H2 7-14.
- Arduino-ESP32 3.3.12 (IDF 5.5.5): use `esp_sleep_get_wakeup_cause()`. On core 4.0 (IDF 6.1) it still compiles with a deprecation warning.
- MicroPython port constants: the generic docs list `WLAN_WAKE`, `PIN_WAKE`, `RTC_WAKE`; the ESP32 port (`modmachine.c`) actually defines `PIN_WAKE` (= EXT0), `EXT0_WAKE`, `EXT1_WAKE`, `TIMER_WAKE`, `TOUCHPAD_WAKE`, `ULP_WAKE`. Use `TIMER_WAKE` on ESP32.
- MicroPython ESP32: `RTC.memory()` and `machine.mem_backup()` share one buffer but track length independently, do not mix them.

Source: https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/ESP32/examples/DeepSleep , https://raw.githubusercontent.com/espressif/esp-idf/v6.1/components/esp_hw_support/include/esp_sleep.h , https://raw.githubusercontent.com/espressif/esp-idf/v5.5.5/components/esp_hw_support/include/esp_sleep.h , https://docs.micropython.org/en/latest/esp32/quickref.html#deep-sleep-mode , https://docs.micropython.org/en/latest/library/esp32.html , https://docs.micropython.org/en/latest/library/machine.RTC.html


---

## TASK 15. Wi-Fi station, soft AP, events, mDNS, provisioning

Arduino C++ (core 3.x; `WiFiClient` is now an alias of `NetworkClient`, the `WiFi` object is unchanged):
```cpp
#include <WiFi.h>

const char *SSID = "your-ssid";
const char *PASS = "your-password";

void onGotIp(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void onDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.printf("lost Wi-Fi, reason %d\n", info.wifi_sta_disconnected.reason);
  // with WiFi.setAutoReconnect(true) the stack retries by itself
}

void setup() {
  Serial.begin(115200);
  WiFi.setHostname("esp32-demo");                                   // BEFORE WiFi.begin()/mode()
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.onEvent(onGotIp, ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(onDisconnected, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.begin(SSID, PASS);
  uint32_t t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) { delay(250); Serial.print('.'); }
  if (WiFi.status() == WL_CONNECTED) Serial.printf("\nconnected, RSSI %d dBm\n", WiFi.RSSI());
}

void loop() {}
```
Static IP (call BEFORE `begin`): `WiFi.config(IPAddress(192,168,1,50), IPAddress(192,168,1,1), IPAddress(255,255,255,0), IPAddress(8,8,8,8));` returns bool.

Soft AP:
```cpp
WiFi.mode(WIFI_AP);
WiFi.softAP("esp32-ap", "12345678");          // password >= 8 chars, or none for an open AP
Serial.println(WiFi.softAPIP());              // 192.168.4.1 by default
```
mDNS: `#include <ESPmDNS.h>` then `MDNS.begin("esp32")` (reach it as esp32.local), `MDNS.addService("http", "tcp", 80)`.

Event names (3.x, `arduino_event_id_t`; the ID numbers changed vs 2.x, always use the names): `ARDUINO_EVENT_WIFI_READY`, `..._SCAN_DONE`, `..._STA_START`, `..._STA_STOP`, `..._STA_CONNECTED`, `..._STA_DISCONNECTED`, `..._STA_AUTHMODE_CHANGE`, `..._STA_GOT_IP`, `..._STA_GOT_IP6`, `..._STA_LOST_IP`, `ARDUINO_EVENT_WIFI_AP_START/STOP/STACONNECTED/STADISCONNECTED/STAIPASSIGNED/PROBEREQRECVED`, `ARDUINO_EVENT_ETH_*`, `ARDUINO_EVENT_WPS_ER_*`. The 2.x names `SYSTEM_EVENT_STA_GOT_IP` etc. are gone.
Handler forms: `void f(WiFiEvent_t e)`, `void f(WiFiEvent_t e, WiFiEventInfo_t info)` (info members like `info.wifi_sta_disconnected.reason`, `info.got_ip.ip_info.ip.addr`), `std::function`/lambda; pass an event id as 2nd argument to filter, omit for all events; `WiFi.removeEvent(id)`.

Provisioning (names only): the core's `WiFiProv` library (BLE or SoftAP provisioning with the Espressif app, `WiFiProv.beginProvision(...)`), `WiFi.beginSmartConfig()` (ESP-Touch), WPS (`ARDUINO_EVENT_WPS_ER_*`), and the community **WiFiManager** (tzapu, v2.0.17 dated 2024-03; captive portal) - UNVERIFIED on core 3.3.x.

MicroPython:
```python
import network, time

network.hostname("esp32-demo")                         # module-level; do it before connecting
wlan = network.WLAN(network.WLAN.IF_STA)               # network.WLAN() with no argument = STA; network.STA_IF still exists
wlan.active(True)
wlan.connect("your-ssid", "your-password")
t0 = time.ticks_ms()
while not wlan.isconnected():
    if time.ticks_diff(time.ticks_ms(), t0) > 15000:
        raise RuntimeError("Wi-Fi timeout, status=%d" % wlan.status())
    time.sleep_ms(200)
print(wlan.ipconfig("addr4"), wlan.status("rssi"))     # (ip, netmask) tuple, dBm

# static IP:  wlan.ipconfig(addr4="192.168.1.50/24", gw4="192.168.1.1")   (ifconfig() is deprecated; UNVERIFIED whether dhcp4=False must be set first)
# soft AP:
ap = network.WLAN(network.WLAN.IF_AP)
ap.config(ssid="esp32-ap", password="12345678", security=network.WLAN.SEC_WPA2, max_clients=4)
ap.active(True)
```
After `connect()` the ESP32 port retries FOREVER by default; limit with `wlan.config(reconnects=n)` (-1 = unlimited, 0 = none). `wlan.config(pm=wlan.PM_NONE)` disables power-save for lower latency. mDNS is on by default with the hostname.

ESP-IDF: `esp_wifi.h` (`esp_wifi_init`, `esp_wifi_set_mode`, `esp_wifi_start`, `esp_wifi_connect`), `esp_netif`, events via `esp_event_handler_register(WIFI_EVENT, ...)` / `IP_EVENT_STA_GOT_IP`; `esp_netif_set_hostname`; mDNS component `mdns`.

Notes:
- 2.x to 3.0 (migration guide): `WiFiClient::flush()` no longer clears the receive buffer (new `clear()`), `WiFiServer::available()` deprecated for `accept()`, unimplemented `WiFiServer` write functions removed.
- 3.0 split the networking classes into the `Network` library (`NetworkClient`, `NetworkServer`, `NetworkUdp`, `NetworkClientSecure`); `WiFiClient`, `WiFiServer`, `WiFiUDP`, `WiFiClientSecure` remain as typedef aliases, so old code compiles. Also `WiFi.STA` / `WiFi.AP` interface objects exist (the ESP-NOW examples use `WiFi.STA.started()`).
- Event callbacks run in a separate FreeRTOS task: they must be thread-safe, and never call `WiFi.onEvent`/`removeEvent` from inside a callback (Arduino docs).
- `setHostname()` must be called BEFORE `WiFi.begin()`, `softAP()` or `mode()`.
- MicroPython 1.29 renames: `ap.config(essid=...)` still accepted but `ssid=` is the name; `ap.config(authmode=..., password=...)` is `security=network.WLAN.SEC_*` + `password=` (or `key=`); the old module constants `network.AUTH_WPA2_PSK` etc. are NOT defined on the ESP32 port any more (`network.WLAN.SEC_WPA2`, `SEC_WPA_WPA2`, `SEC_WPA3`, `SEC_OPEN` ...). `wlan.ifconfig()` is deprecated for `ipconfig()`; `wlan.config(hostname=...)` is deprecated for `network.hostname()`. `network.WLAN.IF_STA` / `IF_AP` exist (class constants) next to `network.STA_IF` / `AP_IF`.
- 3.3.12 added `WiFi.setInactiveTime()/getInactiveTime()` (STA).
- P4 has no native Wi-Fi (ESP-Hosted); H2 has none.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/WiFi/examples/WiFiClientEvents/WiFiClientEvents.ino , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/WiFi/examples/WiFiClientStaticIP/WiFiClientStaticIP.ino , https://docs.micropython.org/en/latest/library/network.WLAN.html , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/network_wlan.c

---

## TASK 16. HTTP client (GET/POST JSON), HTTPS, ArduinoJson v7

Arduino C++ (HTTPClient + NetworkClientSecure + ArduinoJson 7.4.x):
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <NetworkClientSecure.h>      // 3.x name; WiFiClientSecure.h still exists as a typedef header
#include <ArduinoJson.h>

extern const char ROOT_CA[];          // PEM of the server chain's ROOT certificate (string literal, includes BEGIN/END lines)

bool postReading(float tempC) {
  NetworkClientSecure client;
  client.setCACert(ROOT_CA);          // verify the server; needs a valid clock (configTime + getLocalTime first)
  HTTPClient http;
  if (!http.begin(client, "https://example.com/api/readings")) return false;
  http.addHeader("Content-Type", "application/json");

  JsonDocument doc;                   // ArduinoJson v7: ONE type, no capacity argument
  doc["sensor"] = "esp32";
  doc["temp"] = tempC;
  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  bool ok = false;
  if (code > 0) {
    JsonDocument resp;
    DeserializationError err = deserializeJson(resp, http.getString());
    if (!err) { const char *status = resp["status"] | "none"; Serial.println(status); ok = (code == HTTP_CODE_OK); }
  } else {
    Serial.println(http.errorToString(code));
  }
  http.end();
  return ok;
}
```
GET: `http.begin(client, url); int code = http.GET(); String s = http.getString();`. Plain HTTP uses `NetworkClient client;` (or `WiFiClient`).

CA options on `NetworkClientSecure` (3.3.12 header): `setCACert(pem)`, `setCACertBundle(bytes, size)`, **`useBuiltinCACertBundle()` (new in 3.3.12: uses the embedded Mozilla-style bundle; example `WiFiClientSecureBuiltinCACertBundle`)**, `setInsecure()` (no validation), `setCertificate()/setPrivateKey()` (mutual TLS), `setPreSharedKey()`, `setHandshakeTimeout()`.

MicroPython:
```python
import requests                                  # frozen into the official ESP32 build (mip install requests if missing)

r = requests.get("http://example.com/api/status", timeout=10)
print(r.status_code, r.json())                   # r.text, r.content also exist
r.close()                                        # always close

r = requests.post("http://example.com/api/readings", json={"sensor": "esp32", "temp": 21.5})
print(r.status_code)
r.close()
```
`urequests` is only a forwarding alias to `requests` now. Signature: `requests.request(method, url, data=None, json=None, headers=None, stream=None, auth=None, timeout=None, parse_headers=True)`.

HTTPS with certificate verification (use the `ssl` module directly; sync the clock first with `ntptime`):
```python
import socket, ssl

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ctx.verify_mode = ssl.CERT_REQUIRED
ctx.load_verify_locations(cadata=open("/root_ca.der", "rb").read())    # DER bytes (or PEM text) of the CA
addr = socket.getaddrinfo("example.com", 443)[0][-1]
s = socket.socket()
s.connect(addr)
s = ctx.wrap_socket(s, server_hostname="example.com")
s.write(b"GET / HTTP/1.0\r\nHost: example.com\r\n\r\n")
print(s.read(200))
s.close()
```
(UNVERIFIED: not run; API names checked in `docs/library/ssl.rst`.)

ESP-IDF: `esp_http_client.h` (`esp_http_client_init`, `esp_http_client_perform`, `crt_bundle_attach = esp_crt_bundle_attach`), `esp_tls`; JSON: IDF 6.0 REMOVED the built-in `json` (cJSON) component, add `espressif/cjson` from the component manager.

Notes:
- ArduinoJson 7 (current 7.4.3): `JsonDocument` replaces `StaticJsonDocument<N>` and `DynamicJsonDocument(N)`; those still compile in 7.4.3 only as `[[deprecated]]` classes (warning). Also deprecated: `createNestedObject()` / `createNestedArray()` -> `doc["a"].to<JsonObject>()`, `arr.add<JsonObject>()`; `JSON_OBJECT_SIZE` etc. are no-ops with a warning; `containsKey()` -> `doc["k"].is<T>()` / `!doc["k"].isNull()`. Read with `doc["k"].as<int>()` or `doc["k"] | defaultValue`.
- `HTTPClient::begin(NetworkClient&, url)`: pass a `NetworkClientSecure` for https. If you parse with `deserializeJson(doc, http.getStream())` and the server answers chunked, call `http.useHTTP10(true)` first, or simply use `http.getString()`.
- `setInsecure()` disables certificate checking: anyone on the path can impersonate the server and read/alter the traffic. Acceptable only for throw-away tests; the docs/examples ship `setCACert` or the bundle for real use. Certificates expire: use the ROOT CA, not the leaf; keep time via SNTP.
- `NetworkClientSecure` (3.0+) replaced `WiFiClientSecure` as the class name (typedef alias kept in `WiFiClientSecure.h`). `WiFiClientSecure::verify(fingerprint, domain)` exists on both.
- MicroPython `requests` HTTPS: the shipped `requests` 1.1.1 code builds a `tls.SSLContext` with `verify_mode = tls.CERT_NONE`, i.e. https URLs work but the server certificate is NOT verified. Say so in the app text; use the raw `ssl` example above if verification matters. On mbedtls ports `CERT_NONE`/`CERT_OPTIONAL` validate nothing, only `CERT_REQUIRED` does.
- Time must be set for CERT_REQUIRED (`ntptime.settime()`).

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/NetworkClientSecure/src/NetworkClientSecure.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/HTTPClient/examples/BasicHttpsClient/BasicHttpsClient.ino , https://raw.githubusercontent.com/bblanchon/ArduinoJson/v7.4.3/src/ArduinoJson/compatibility.hpp , https://raw.githubusercontent.com/micropython/micropython-lib/master/python-ecosys/requests/requests/__init__.py , https://docs.micropython.org/en/latest/library/ssl.html

---

## TASK 17. Web server and WebSocket

Arduino C++, synchronous `WebServer` (in the core):
```cpp
#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);

void handleRoot() {
  server.send(200, "text/html", "<h1>Hello from ESP32</h1>");
}

void handleLed() {
  String state = server.arg("state");            // /led?state=1
  digitalWrite(2, state == "1");
  server.send(200, "application/json", "{\"ok\":true}");
}

void setup() {
  pinMode(2, OUTPUT);
  WiFi.begin("ssid", "pass");
  while (WiFi.status() != WL_CONNECTED) delay(250);
  server.on("/", handleRoot);
  server.on("/led", HTTP_GET, handleLed);
  server.onNotFound([]() { server.send(404, "text/plain", "not found"); });
  server.begin();
}

void loop() {
  server.handleClient();                         // must be called often; no delay() with long values
}
```
Async: **ESPAsyncWebServer from the ESP32Async organisation** (library name "ESP Async WebServer", v3.12.1, with **AsyncTCP** from ESP32Async v3.5.0). `me-no-dev/ESPAsyncWebServer` and `me-no-dev/AsyncTCP` are the ORIGINAL repos: me-no-dev/ESPAsyncWebServer is ARCHIVED (read-only, last push 2025-01-20); the maintained fork is ESP32Async (README: ESP32/ESP8266/RP2040/RP2350, Arduino core 2.x and 3.x).
```cpp
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void onWsEvent(AsyncWebSocket *s, AsyncWebSocketClient *c, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT)    Serial.printf("ws client %u connected\n", c->id());
  else if (type == WS_EVT_DATA)  s->textAll((const char *)data, len);        // echo to everyone
}

void setup() {
  Serial.begin(115200);
  WiFi.softAP("esp32-async");
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "Hello");
  });
  server.begin();
}

void loop() {}
```
(Both forms exist in v3.12.1: `AsyncWebSocket::onEvent(AwsEventHandler)` with `AwsEventType` as above, and the newer `AsyncWebSocketMessageHandler` helper with `onConnect/onDisconnect/onMessage/onError/onFragment` lambdas used by the library's `WebSocketEasy` example. Header `AsyncWebSocket.h` checked.)

MicroPython (raw sockets, blocking; asyncio version below):
```python
import socket

s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("0.0.0.0", 80))
s.listen(2)
while True:
    cl, addr = s.accept()
    req = cl.recv(1024)
    cl.send(b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hello from MicroPython</h1>")
    cl.close()
```
```python
import asyncio

async def handle(reader, writer):
    await reader.readline()                                   # request line
    while (await reader.readline()) != b"\r\n":               # skip headers
        pass
    writer.write(b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hello</h1>")
    await writer.drain()
    writer.close()
    await writer.wait_closed()

async def main():
    await asyncio.start_server(handle, "0.0.0.0", 80)
    while True:
        await asyncio.sleep(3600)

asyncio.run(main())
```
Frameworks (name only): **microdot** (Miguel Grinberg; routes, JSON, WebSocket; installed with mip/copied).

ESP-IDF: `esp_http_server.h` (`httpd_start`, `httpd_register_uri_handler`, WebSocket support built in); IDF 6.0 changes WebSocket handshake handling (from 6.0.1 the frame handler is called only for data frames; `CONFIG_HTTPD_WS_POST_HANDSHAKE_CB_SUPPORT`).

Notes:
- 3.3.12 hardened the core `WebServer` (see `docs/en/migration_guides/webserver_hardening.rst`): new limits (`WEBSERVER_MAX_URI_LEN` 2048, `WEBSERVER_MAX_LINE_LEN` 4096, `WEBSERVER_MAX_HEADER_WAIT` 10 s ...), `authenticate(user, pass)` now accepts only Basic/Digest, `serveStatic` refuses `.`/`..` path segments, and `handleClient()` can answer 408/414/431. All limits are overridable with `-D` flags.
- `WebServer` is single-threaded and polled; long handlers block everything. Async servers answer from the TCP task: no `delay()` and no long blocking calls inside callbacks; do not call `Serial.print` heavily there.
- A static file served from LittleFS: `server.serveStatic("/", LittleFS, "/")` (works for root since 3.3.12; it used to 404).
- ESP32Async ESPAsyncWebServer has middleware (auth, CORS, rate limiting), SSE, templating, JSON/MessagePack helpers; docs at esp32async.github.io/ESPAsyncWebServer.
- MicroPython: sockets are blocking by default; one client at a time in the raw version.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/docs/en/migration_guides/webserver_hardening.rst , https://github.com/ESP32Async/ESPAsyncWebServer , https://github.com/ESP32Async/AsyncTCP , https://github.com/me-no-dev/ESPAsyncWebServer (archived) , https://docs.micropython.org/en/latest/library/asyncio.html

---

## TASK 18. MQTT

Arduino C++, PubSubClient (v2.8, last release 2020-05; repo still receives pushes, last 2026-06-10):
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

NetworkClient net;                       // WiFiClient alias; use NetworkClientSecure for TLS (port 8883)
PubSubClient mqtt(net);

void onMessage(char *topic, byte *payload, unsigned int length) {
  String msg;
  for (unsigned i = 0; i < length; i++) msg += (char)payload[i];
  Serial.printf("%s -> %s\n", topic, msg.c_str());
}

void ensureMqtt() {
  while (!mqtt.connected()) {
    if (mqtt.connect("esp32-demo", "user", "pass")) mqtt.subscribe("home/esp32/cmd");   // QoS 0 or 1 only
    else delay(2000);
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin("ssid", "pass");
  while (WiFi.status() != WL_CONNECTED) delay(250);
  mqtt.setServer("broker.example.com", 1883);
  mqtt.setBufferSize(1024);              // default max packet 256 bytes INCLUDING the header
  mqtt.setCallback(onMessage);
}

void loop() {
  ensureMqtt();
  mqtt.loop();                           // keep-alive + receive; call every pass
  static uint32_t last = 0;
  if (millis() - last > 5000) { last = millis(); mqtt.publish("home/esp32/temp", "21.5"); }
}
```
PubSubClient limits (library README): publishes at QoS 0 only; subscribes at QoS 0 or 1; max message size incl. header 256 bytes by default (`MQTT_MAX_PACKET_SIZE`, change with `setBufferSize(n)`); keep-alive default 15 s (`setKeepAlive()`); MQTT 3.1.1; blocking `connect()`; no MQTT 5; no built-in TLS (wrap a `NetworkClientSecure`).

Alternatives: **espMqttClient** (bertmelis, v1.7.3, 2026-06-22): MQTT 3.1.1, all QoS levels, non-blocking, large payloads, TLS via `WiFiClientSecure`, async variants over AsyncTCP (no TLS); **Adafruit MQTT** (v2.6.6), **arduino-mqtt** (256dpi, v2.5.3), **ESP-IDF esp-mqtt** (`mqtt_client.h`: `esp_mqtt_client_init`, `esp_mqtt_client_register_event`, `esp_mqtt_client_start`, MQTT 3.1.1 and 5.0, TLS). IDF 6.0 moved esp-mqtt OUT of the IDF tree: `idf.py add-dependency espressif/mqtt` (headers unchanged).

MicroPython `umqtt.simple` (v1.8.1; `umqtt.robust` adds reconnect; both are frozen into the official ESP32 builds, otherwise `mip.install("umqtt.simple")`):
```python
import network, time
from umqtt.simple import MQTTClient

def on_msg(topic, msg):                     # bytes, bytes
    print(topic, msg)

c = MQTTClient("esp32-demo", "broker.example.com", port=1883, user=None, password=None, keepalive=60)
c.set_callback(on_msg)
c.connect()
c.subscribe(b"home/esp32/cmd")
last = time.ticks_ms()
while True:
    c.check_msg()                           # non-blocking; wait_msg() blocks
    if time.ticks_diff(time.ticks_ms(), last) > 5000:
        last = time.ticks_ms()
        c.publish(b"home/esp32/temp", b"21.5")
```
TLS: `MQTTClient(..., port=8883, ssl=ctx)` where `ctx` is an `ssl.SSLContext` (preferred) or `ssl=True` (legacy, with `ssl_params`).

Notes:
- Topics and payloads in `umqtt` are bytes. QoS 0/1 supported (`publish(topic, msg, retain=False, qos=0)`; QoS 2 not supported). Set a keepalive and ping (`c.ping()`) or MQTT drops you.
- PubSubClient needs `mqtt.loop()` frequently and reconnection logic; do not block >keepalive in `loop()`.
- Always set a unique client id; two clients with the same id kick each other off.
- `umqtt.simple` 1.8.1 `ssl=True` imports `ssl` and calls `ssl.wrap_socket(**ssl_params)`: CERT_NONE by default (no verification) unless you pass a context with `CERT_REQUIRED`.

Source: https://github.com/knolleary/pubsubclient , https://github.com/bertmelis/espMqttClient , https://raw.githubusercontent.com/micropython/micropython-lib/master/micropython/umqtt.simple/umqtt/simple.py , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/migration-guides/release-6.x/6.0/protocols.html

---

## TASK 19. ESP-NOW

Arduino C++, raw `esp_now.h` C API (what most tutorials use). Core 3.x callbacks have NEW signatures; the send callback changed AGAIN with IDF 5.5 (core 3.3.x):
```cpp
#include <WiFi.h>
#include <esp_now.h>
#include <esp_idf_version.h>

uint8_t peerMac[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};   // broadcast, or the peer's STA MAC

typedef struct __attribute__((packed)) { uint8_t id; float value; } Message;   // payload <= 250 bytes (v1) / 1470 (v2)

// receive callback: (info, data, len)  -- same on IDF 5.x and 6.x
void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (len != sizeof(Message)) return;
  Message m;
  memcpy(&m, data, sizeof(m));
  Serial.printf("from %02X:%02X:%02X:%02X:%02X:%02X id=%u value=%.2f\n",
                info->src_addr[0], info->src_addr[1], info->src_addr[2],
                info->src_addr[3], info->src_addr[4], info->src_addr[5], m.id, m.value);
}

// send callback: IDF >= 5.5 (core 3.3.x) passes esp_now_send_info_t*, older cores passed the MAC
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 5, 0)
void onDataSent(const esp_now_send_info_t *info, esp_now_send_status_t status) {
#else
void onDataSent(const uint8_t *mac, esp_now_send_status_t status) {
#endif
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "delivered" : "failed");
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);                                   // Wi-Fi must be started first (STA or AP)
  if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, peerMac, 6);
  peer.channel = 0;                                      // 0 = current channel
  peer.encrypt = false;
  esp_now_add_peer(&peer);
}

void loop() {
  Message m = {1, 21.5f};
  esp_now_send(peerMac, (uint8_t *)&m, sizeof(m));
  delay(2000);
}
```
Arduino core's C++ wrapper (library `ESP_NOW`, header `ESP32_NOW.h`, since 3.0.0-rc1; class `ESP_NOW_Peer`, global `ESP_NOW`):
```cpp
#include <WiFi.h>
#include <ESP32_NOW.h>

class BroadcastPeer : public ESP_NOW_Peer {
 public:
  BroadcastPeer(uint8_t ch) : ESP_NOW_Peer(ESP_NOW.BROADCAST_ADDR, ch, WIFI_IF_STA, nullptr) {}
  bool begin() { return ESP_NOW.begin() && add(); }
  bool say(const char *s) { return send((const uint8_t *)s, strlen(s) + 1); }
  void onReceive(const uint8_t *data, size_t len, bool broadcast) override { Serial.println((const char *)data); }
  void onSent(bool success) override { Serial.println(success ? "sent" : "send failed"); }
};

BroadcastPeer peer(6);

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.setChannel(6);
  while (!WiFi.STA.started()) delay(100);
  peer.begin();
  Serial.printf("ESP-NOW version %d, max payload %d\n", ESP_NOW.getVersion(), ESP_NOW.getMaxDataLen());
}

void loop() {
  peer.say("hello");
  delay(2000);
}
```
(Receiving from UNKNOWN senders: `ESP_NOW.onNewPeer(cb, arg)` with `cb(const esp_now_recv_info_t *info, const uint8_t *data, int len, void *arg)`; see core example `ESP_NOW_Broadcast_Slave`.)

MicroPython:
```python
import network, espnow

sta = network.WLAN(network.WLAN.IF_STA)
sta.active(True)                          # Wi-Fi interface must be active before ESP-NOW
e = espnow.ESPNow()
e.active(True)
peer = b"\xff\xff\xff\xff\xff\xff"        # broadcast, or the peer's STA MAC (bytes)
e.add_peer(peer)

e.send(peer, b"hello")                    # <= espnow.MAX_DATA_LEN (250 or 1470)
mac, msg = e.recv(2000)                   # timeout in ms; (None, None) on timeout
if msg:
    print(mac, msg)
# callback style: e.irq(lambda e: ...) ;  async: import aioespnow; e = aioespnow.AIOESPNow()
```

ESP-IDF: `esp_now.h`: `esp_now_init`, `esp_now_register_recv_cb`, `esp_now_register_send_cb`, `esp_now_add_peer`, `esp_now_send`, `esp_now_get_version(&v)`; `ESP_NOW_MAX_DATA_LEN` 250, `ESP_NOW_MAX_DATA_LEN_V2` 1470.

Notes:
- Receive callback: since IDF 5.0 / core 3.0 it is `(const esp_now_recv_info_t *info, const uint8_t *data, int len)`; `info->src_addr`, `info->des_addr`, `info->rx_ctrl`. The 2.x form `(const uint8_t *mac, const uint8_t *data, int len)` no longer compiles.
- Send callback: `(const uint8_t *mac_addr, esp_now_send_status_t)` up to IDF 5.4.x; in IDF 5.5 and 6.1 it is `(const esp_now_send_info_t *tx_info, esp_now_send_status_t)` where `esp_now_send_info_t` is a typedef of `wifi_tx_info_t` (use `tx_info->des_addr` for the MAC). Verified by diffing `esp_now.h` v5.4.2 vs v5.5.5 vs v6.1 and by the core's own `ESP32_NOW.cpp` guard `ESP_IDF_VERSION >= 5.5.0`. Core 3.3.x is IDF 5.5, so the NEW form is required there.
- Payload: v1 = 250 bytes; v2 = 1470 bytes (IDF >= 5.4; both ends must be v2 for > 250, v2 receives v1 fine, a v1 device truncates/drops > 250 B; MicroPython: check `espnow.MAX_DATA_LEN` at runtime; Arduino: `ESP_NOW.getMaxDataLen()` / `esp_now_get_version()`).
- ESP-NOW is not supported on ESP32-H2 and P4 (chip table); both devices must be on the same Wi-Fi channel (if the STA is connected to an AP the channel follows the AP).
- Encrypted peers need `esp_now_set_pmk()` + a per-peer 16-byte LMK. Limits from `esp_now.h`: `ESP_NOW_MAX_TOTAL_PEER_NUM` = 20 peers, `ESP_NOW_MAX_ENCRYPT_PEER_NUM` = 6 encrypted peers.
- MicroPython 1.29: `espnow` module, `aioespnow` is frozen into the build; `irq(callback)` runs as a scheduled callback and can lose messages in bursts.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP_NOW/src/ESP32_NOW.cpp , https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/ESP_NOW/examples , https://docs.espressif.com/projects/arduino-esp32/en/latest/api/espnow.html , https://raw.githubusercontent.com/espressif/esp-idf/v5.5.5/components/esp_wifi/include/esp_now.h , https://raw.githubusercontent.com/espressif/esp-idf/v5.4.2/components/esp_wifi/include/esp_now.h , https://docs.micropython.org/en/latest/library/espnow.html

---

## TASK 20. BLE and Bluetooth Classic

Which stack is under the Arduino `BLE` library (verified in `libraries/BLE/README.md`, 3.3.12):
- classic **ESP32: Bluedroid** (supports BT Classic + BLE; "not maintained anymore" upstream); **every other chip: NimBLE**. NimBLE support in the core's BLE library arrived in **3.3.0** (release notes "feat(NimBLE): Add support for NimBLE"); in 3.0 to 3.2 the BLE library was Bluedroid-only.
- The 3.3.12 README announces: "Bluedroid will be replaced by NimBLE in version 4.0.0 of the Arduino Core. Bluetooth Classic and Bluedroid will no longer be supported but can be used by using Arduino as an ESP-IDF component." BUT the 4.0.0-RC1 tree actually still contains `BLE.bluedroid.cpp` and `BLE.nimble.cpp` and a `BluetoothSerial` library: the stack is chosen by board/sdkconfig behind one API. The planned final behavior of 4.0 is therefore UNVERIFIED; treat BT Classic on 4.0 as uncertain.
- **4.0.0-RC1 REWROTE the API**: `#include <BLE.h>`, global `BLE` object, value handles instead of pointers, `BLEProperty::Read | Notify`, `BTStatus`. The old `BLEDevice::init()` API below is the 3.x API (also used by 2.x/3.0-3.3.12). The repo ships `libraries/BLE/MIGRATION.md` (v3.x to v4.0) and `libraries/BluetoothSerial/MIGRATION.md`.

Arduino C++ (core 3.x BLE GATT server, from the core `Server` example):
```cpp
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void setup() {
  Serial.begin(115200);
  if (!BLEDevice::init("BLE Server Example")) {          // returns bool in 3.3.x
    Serial.println("BLE init failed");
    return;
  }
  BLEServer *server = BLEDevice::createServer();
  server->advertiseOnDisconnect(true);                   // restart advertising after a client leaves
  BLEService *service = server->createService(SERVICE_UUID);
  BLECharacteristic *chr = service->createCharacteristic(
    CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  chr->setValue("Hello World");                          // Arduino String / C string (not std::string, since 3.0)
  service->start();
  BLEAdvertising *adv = BLEDevice::getAdvertising();
  adv->addServiceUUID(SERVICE_UUID);
  adv->setScanResponse(true);
  BLEDevice::startAdvertising();
}

void loop() { delay(2000); }
```
Scan (client side) from the core example: `BLEDevice::init(""); BLEScan *scan = BLEDevice::getScan(); scan->setAdvertisedDeviceCallbacks(new MyCallbacks()); scan->setActiveScan(true); BLEScanResults *r = scan->start(5, false);` (note `BLEScanResults*` pointer since 3.0). For UART-style: example `BLE/examples/UART`; notify: `PROPERTY_NOTIFY` + `chr->notify()`.

NimBLE-Arduino (h2zero) 2.5.1 (use it when you want the full NimBLE feature set on any ESP32 core; it replaces the core BLE library, do not use both):
```cpp
#include <NimBLEDevice.h>

class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer *pServer, NimBLEConnInfo &connInfo) override { Serial.println("connected"); }
  void onDisconnect(NimBLEServer *pServer, NimBLEConnInfo &connInfo, int reason) override { Serial.println("disconnected"); }
};

void setup() {
  Serial.begin(115200);
  NimBLEDevice::init("NimBLE");
  NimBLEServer *server = NimBLEDevice::createServer();
  server->setCallbacks(new ServerCallbacks());
  server->advertiseOnDisconnect(true);                   // no longer automatic in 2.x
  NimBLEService *service = server->createService("ABCD");
  NimBLECharacteristic *chr = service->createCharacteristic("1234", NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::NOTIFY);
  chr->setValue("Hello BLE");
  service->start();
  NimBLEAdvertising *adv = NimBLEDevice::getAdvertising();
  adv->addServiceUUID("ABCD");
  adv->start();
}

void loop() {}
```
NimBLE-Arduino 2.x changes vs 1.x: time parameters are in MILLISECONDS (`scan->start(10000)`), callbacks take `NimBLEConnInfo&`, advertising no longer restarts on disconnect, scan callback API changed (`NimBLEScanCallbacks`, `onScanEnd(results, reason)`), `std::string` replaced by Arduino-friendly types in beacon APIs.

Bluetooth Classic (ESP32 only), core library `BluetoothSerial` (3.x API):
```cpp
#include <BluetoothSerial.h>
BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32-BT");              // name seen when pairing (SPP)
}

void loop() {
  if (Serial.available())   SerialBT.write(Serial.read());
  if (SerialBT.available()) Serial.write(SerialBT.read());
  delay(20);
}
```
MicroPython (`bluetooth` module, NimBLE inside; peripheral advertising + one notify characteristic):
```python
import bluetooth, struct, time

_IRQ_CENTRAL_CONNECT = 1
_IRQ_CENTRAL_DISCONNECT = 2
_IRQ_GATTS_WRITE = 3

ble = bluetooth.BLE()
ble.active(True)
ble.config(gap_name="esp32-mp")

SVC_UUID = bluetooth.UUID("6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
TX = (bluetooth.UUID("6E400003-B5A3-F393-E0A9-E50E24DCCA9E"), bluetooth.FLAG_READ | bluetooth.FLAG_NOTIFY)
RX = (bluetooth.UUID("6E400002-B5A3-F393-E0A9-E50E24DCCA9E"), bluetooth.FLAG_WRITE)
((tx_h, rx_h),) = ble.gatts_register_services(((SVC_UUID, (TX, RX)),))

conns = set()
def irq(event, data):
    if event == _IRQ_CENTRAL_CONNECT:
        conns.add(data[0])
    elif event == _IRQ_CENTRAL_DISCONNECT:
        conns.discard(data[0])
        advertise()
    elif event == _IRQ_GATTS_WRITE:
        print("rx:", ble.gatts_read(rx_h))

def advertise():
    name = b"esp32-mp"
    adv = b"\x02\x01\x06" + bytes((len(name) + 1, 0x09)) + name      # flags + complete local name
    ble.gap_advertise(100_000, adv_data=adv)                         # interval in microseconds

ble.irq(irq)
advertise()
while True:
    for c in conns:
        ble.gatts_notify(c, tx_h, b"hi")
    time.sleep(1)
```
`aioble` (asyncio BLE, not frozen): `import mip; mip.install("aioble")`, then `import aioble` (`aioble.advertise(...)`, `aioble.scan(...)`, `aioble.Service/Characteristic`). aioble API forms not re-verified here: UNVERIFIED.

ESP-IDF: Bluedroid (`esp_bt_main.h`, `esp_gap_ble_api.h`, `esp_gatts_api.h`) vs NimBLE (`nimble_port.h`, `host/ble_gap.h`); IDF recommends NimBLE for BLE-only (smaller). NimBLE needs `CONFIG_BT_NIMBLE_ENABLED`.

Notes:
- ESP32-S2 has no Bluetooth (n/a); only classic ESP32 has BT Classic. P4 gets BLE only through ESP-Hosted.
- String vs std::string: core 3.0 switched BLE APIs from `std::string` to Arduino `String`; UUID parameters became `BLEUUID`; `BLEScan::start`/`getResults` return `BLEScanResults*`. Old 2.x sketches using `std::string value = chr->getValue();` need `String`.
- A BLE sketch + Wi-Fi works but shares the radio and RAM: use a partition scheme with enough app space ("Huge APP"), BLE examples' `ci.yml` use `PartitionScheme=huge_app`.
- MicroPython IRQ rule: the `addr`, `adv_data`, `uuid`, ... values in `data` are memoryviews valid only inside the handler: copy with `bytes()` if you keep them. Notification is `gatts_notify(conn_handle, value_handle, data)`.
- Matter sketches own the BLE host: do not use the `BLE` library in a Matter sketch (Arduino docs warning).

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/BLE/README.md , https://github.com/espressif/arduino-esp32/blob/4.0.0-RC1/libraries/BLE/MIGRATION.md , https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/BLE/examples , https://github.com/h2zero/NimBLE-Arduino/blob/master/docs/1.x_to2.x_migration_guide.md , https://docs.micropython.org/en/latest/library/bluetooth.html

---

## TASK 21. Storage: Preferences, LittleFS, SD, SPIFFS, EEPROM; MicroPython files, NVS, btree

Arduino C++ Preferences (NVS key/value, survives reset and OTA):
```cpp
#include <Preferences.h>
Preferences prefs;

void setup() {
  Serial.begin(115200);
  prefs.begin("myapp", false);                    // namespace (<= 15 chars), false = read/write
  uint32_t boots = prefs.getUInt("boots", 0) + 1; // key <= 15 chars, default 0
  prefs.putUInt("boots", boots);
  prefs.putString("name", "esp32");
  Serial.printf("boot %u, name %s\n", boots, prefs.getString("name", "?").c_str());
  prefs.end();
}

void loop() {}
```
LittleFS:
```cpp
#include <LittleFS.h>

void setup() {
  Serial.begin(115200);
  if (!LittleFS.begin(true)) {                    // true = format if mount fails; begin(formatOnFail, basePath="/littlefs", maxFiles=10, partitionLabel="spiffs")
    Serial.println("mount failed");
    return;
  }
  File f = LittleFS.open("/hello.txt", "w");
  f.println("hello");
  f.close();
  f = LittleFS.open("/hello.txt", "r");
  Serial.println(f.readString());
  f.close();
  Serial.printf("used %u / %u bytes\n", (unsigned)LittleFS.usedBytes(), (unsigned)LittleFS.totalBytes());
}

void loop() {}
```
SD over SPI: `#include <SD.h>`, `SD.begin(csPin)` (full form `begin(ssPin=SS, SPIClass&, freq=4000000, mountpoint="/sd", max_files=5, format_if_empty=false)`), `SD.open("/log.txt", FILE_APPEND)`. SD over SDMMC (ESP32, S3): `SD_MMC.setPins(clk, cmd, d0)` then `SD_MMC.begin("/sdcard", true)` (second arg = 1-bit mode). `FFat` (FAT in flash) has the same API as LittleFS (`FFat.begin(true)`).

MicroPython (the flash filesystem is mounted at `/`, LittleFS v2 by default):
```python
import os, json, vfs

with open("config.json", "w") as f:
    json.dump({"ssid": "x", "n": 3}, f)
with open("config.json") as f:
    print(json.load(f))
print(os.listdir("/"))
s = os.statvfs("/")
print("free bytes:", s[0] * s[3])
# SD card:
# import machine; sd = machine.SDCard(slot=2); vfs.mount(sd, "/sd"); os.listdir("/sd"); vfs.umount("/sd")
```
NVS (key/value in flash, namespaced, survives power loss and reflash of the app):
```python
import esp32
nvs = esp32.NVS("app")
try:
    n = nvs.get_i32("boots")
except OSError:
    n = 0
nvs.set_i32("boots", n + 1)
nvs.commit()                                   # REQUIRED or the change is lost
buf = bytearray(32)
nvs.set_blob("name", b"esp32"); nvs.commit()
size = nvs.get_blob("name", buf)               # bytes read
```
btree (sorted key/value store in a file):
```python
import btree
try:
    f = open("mydb", "r+b")
except OSError:
    f = open("mydb", "w+b")
db = btree.open(f)
db[b"temp"] = b"21.5"
db.flush()
print(db[b"temp"])
db.close(); f.close()
```
ESP-IDF: `nvs_flash.h` (`nvs_flash_init`, `nvs_open`, `nvs_set_i32`, `nvs_commit`), `esp_littlefs` (managed component `joltwallet/littlefs`), `esp_vfs_fat_*`, `esp_spiffs`; IDF 6.0 renamed `esp_vfs_console` to `esp_stdio` and deprecates legacy VFS registration functions.

Notes:
- Preferences keys and namespace names max 15 characters (Arduino docs). `getString(key, default)` returns Arduino `String`; also `getBytes/putBytes`, `isKey()`, `clear()`, `remove(key)`.
- **SPIFFS status**: the core still ships `SPIFFS` (`SPIFFS.begin(true)`) and the Arduino/IDF docs I read do not mark it deprecated; pioarduino's README calls SPIFFS a "simple legacy filesystem ... LittleFS is recommended". Use LittleFS for new work (wear levelling, directories); LittleFS is also pioarduino's default. The Tools > Partition Scheme label still says "with spiffs" even though the partition (label `spiffs`) is used by LittleFS.
- Arduino core `LittleFS.begin(true)` formats an unmountable (new/empty) partition: it erases data if the partition is corrupt.
- MicroPython: NVS needs `commit()`. Default generic builds mount a LittleFS2 filesystem on the `vfs` partition (see `ports/esp32/modules/inisetup.py`, `vfs.VfsLfs2`). Use `import vfs` (the old `uos.mount` is deprecated in favour of `vfs.mount`).
- Flash wear: do not write in a fast loop to flash; batch writes, use NVS/Preferences only for rarely changing values.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/preferences.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/LittleFS/src/LittleFS.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/SD/src/SD.h , https://docs.micropython.org/en/latest/library/esp32.html#esp32.NVS , https://docs.micropython.org/en/latest/library/btree.html , https://raw.githubusercontent.com/pioarduino/platform-espressif32/main/README.md

---

## TASK 22. OTA updates

Arduino C++ ArduinoOTA (push from the IDE/`espota.py` over Wi-Fi):
```cpp
#include <WiFi.h>
#include <ArduinoOTA.h>

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin("ssid", "pass");
  while (WiFi.waitForConnectResult() != WL_CONNECTED) { delay(5000); ESP.restart(); }
  ArduinoOTA.setHostname("esp32-ota");
  // ArduinoOTA.setPassword("secret");
  ArduinoOTA
    .onStart([]() { Serial.println(ArduinoOTA.getCommand() == U_FLASH ? "start sketch" : "start filesystem"); })
    .onProgress([](unsigned int done, unsigned int total) { Serial.printf("%u%%\r", done / (total / 100)); })
    .onEnd([]() { Serial.println("\nOTA done"); })
    .onError([](ota_error_t e) { Serial.printf("OTA error %u\n", e); });
  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();
}
```
Pull from an HTTP(S) server (HTTPUpdate; global object `httpUpdate`):
```cpp
#include <HTTPUpdate.h>
#include <NetworkClientSecure.h>

void updateFromUrl() {
  NetworkClientSecure client;
  client.setCACert(ROOT_CA);                         // or useBuiltinCACertBundle() on 3.3.12+
  httpUpdate.rebootOnUpdate(true);
  t_httpUpdate_return r = httpUpdate.update(client, "https://example.com/firmware.bin");
  switch (r) {
    case HTTP_UPDATE_FAILED:     Serial.println(httpUpdate.getLastErrorString()); break;
    case HTTP_UPDATE_NO_UPDATES: Serial.println("no update");                     break;
    case HTTP_UPDATE_OK:         break;               // reboots by itself
  }
}
```
Lower level: `Update.begin(size)`, `Update.write(buf, len)`, `Update.end(true)`, `Update.isFinished()`; also `httpUpdate.updateFs/updateSpiffs/updateLittlefs(...)` for filesystem images. 3.3.12 adds optional SHA-256 / SHA-512 checksums and checksum sidecar URLs (`setMD5sum()`, `setMD5sumUrl()` exist; see HTTPUpdate.h) and IPv6 ArduinoOTA.

MicroPython: firmware OTA on the ESP32 port goes through `esp32.Partition` (needs an OTA-capable partition table):
```python
from esp32 import Partition
import machine

cur = Partition(Partition.RUNNING)
nxt = cur.get_next_update()                    # the other ota_x partition
# stream the new .bin in 4096-byte blocks:
# nxt.writeblocks(block_num, buf)  for each block (buf len = block_size, last block padded)
nxt.set_boot()
machine.reset()                                # hard reset (do NOT deepsleep right after set_boot)

# after the new image runs correctly:
Partition.mark_app_valid_cancel_rollback()     # cancels automatic rollback; OSError(-261) if rollback not enabled
```
Installing PACKAGES (not firmware) is `mip`: `import mip; mip.install("umqtt.simple")` or from the host `mpremote mip install aioble`. mip downloads from micropython-lib (or `github:` URLs) into `/lib`.

ESP-IDF: `esp_https_ota.h` (`esp_https_ota(&cfg)` or the begin/perform/finish API), `esp_ota_ops.h` (`esp_ota_mark_app_valid_cancel_rollback`, `esp_ota_mark_app_invalid_rollback_and_reboot`), `CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE`, partition table with `otadata`, `ota_0`, `ota_1`.

Notes:
- All OTA needs a partition scheme with two app slots: Arduino default schemes have them (`Default 4MB with spiffs`), "Huge APP / No OTA" schemes do NOT. MicroPython's stock `ESP32_GENERIC` image uses a single `factory` partition (`partitions-4MiBplus.csv`); the **OTA build variant** (`ESP32_GENERIC` variant `OTA`, partition table `partitions-4MiB-ota.csv` with `ota_0`/`ota_1` of 0x180000 each) is required for `Partition.set_boot()` updates.
- Always verify the image (HTTPS with a CA, plus MD5/SHA if possible); enable rollback so a broken update returns to the previous slot; call `mark_app_valid` (MicroPython) / `esp_ota_mark_app_valid_cancel_rollback()` (IDF) after a self-test.
- Arduino core 3.x: the `Update` library lives in `libraries/Update`; `HTTPUpdate` takes a `NetworkClient&`/`HTTPClient&`.
- Do not enter deep sleep right after changing the OTA boot partition (MicroPython docs): reset first.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ArduinoOTA/examples/BasicOTA/BasicOTA.ino , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/HTTPUpdate/src/HTTPUpdate.h , https://docs.micropython.org/en/latest/library/esp32.html#esp32.Partition , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/partitions-4MiB-ota.csv


---

## TASK 23. FreeRTOS (Arduino) and threads (MicroPython)

Arduino C++ (two pinned tasks, a queue and a mutex):
```cpp
QueueHandle_t q;
SemaphoreHandle_t printMutex;

void producer(void *arg) {
  int n = 0;
  for (;;) {
    xQueueSend(q, &n, pdMS_TO_TICKS(100));          // returns pdTRUE/errQUEUE_FULL
    n++;
    vTaskDelay(pdMS_TO_TICKS(500));                 // never busy-wait in a task
  }
}

void consumer(void *arg) {
  int v;
  for (;;) {
    if (xQueueReceive(q, &v, pdMS_TO_TICKS(1000)) == pdTRUE) {
      xSemaphoreTake(printMutex, portMAX_DELAY);
      Serial.printf("got %d on core %d\n", v, xPortGetCoreID());
      xSemaphoreGive(printMutex);
    }
  }
}

void setup() {
  Serial.begin(115200);
  q = xQueueCreate(8, sizeof(int));
  printMutex = xSemaphoreCreateMutex();
  xTaskCreatePinnedToCore(producer, "producer", 3072, nullptr, 1, nullptr, 0);   // stack in BYTES; core 0
  xTaskCreatePinnedToCore(consumer, "consumer", 3072, nullptr, 1, nullptr, 1);   // core 1 (use 0 on single-core chips)
}

void loop() {
  vTaskDelay(pdMS_TO_TICKS(1000));
}
```
Single-core chips (ESP32-C3, C6, H2, S2): the core argument must be 0 (`#if CONFIG_FREERTOS_UNICORE` as in the core's examples) or use unpinned `xTaskCreate(...)`. Binary semaphore: `xSemaphoreCreateBinary()` + `xSemaphoreGiveFromISR()` in an ISR, `xSemaphoreTake()` in a task. Task notification: `xTaskNotifyGive(handle)` / `ulTaskNotifyTake(pdTRUE, ticks)`. Stack check: `uxTaskGetStackHighWaterMark(NULL)` (bytes).

The Arduino sketch itself is a FreeRTOS task: **`loopTask`**, priority 1, pinned to `ARDUINO_RUNNING_CORE` (Tools > "Arduino Runs On", normally core 1), default stack **8192 bytes**. Enlarge it with the macro `SET_LOOP_TASK_STACK_SIZE(16 * 1024);` at file scope. Wi-Fi/BLE/events run on other tasks (`Events Run On` setting `ARDUINO_EVENT_RUNNING_CORE`). `delay(ms)` is `vTaskDelay(ms / portTICK_PERIOD_MS)`.

MicroPython:
```python
import _thread, time

lock = _thread.allocate_lock()

def worker(name, period):
    while True:
        with lock:
            print("tick from", name)
        time.sleep(period)

_thread.stack_size(8192)                      # optional, set before starting the thread
_thread.start_new_thread(worker, ("A", 1))
time.sleep(5)
```
asyncio (usually the better tool in MicroPython):
```python
import asyncio
from machine import Pin

led = Pin(2, Pin.OUT)

async def blink():
    while True:
        led.toggle()
        await asyncio.sleep_ms(500)

async def main():
    asyncio.create_task(blink())
    while True:
        await asyncio.sleep(1)               # other tasks run while we wait

asyncio.run(main())
```
ESP-IDF: FreeRTOS is the OS: `xTaskCreatePinnedToCore`, `xQueueCreate`, `xSemaphoreCreateMutex`, `vTaskDelay(pdMS_TO_TICKS(..))`; IDF FreeRTOS specifics (SMP, `tskNO_AFFINITY`).

Notes:
- IDF FreeRTOS specifies task stack sizes in BYTES, not words (IDF docs: "usStackDepth ... NUMBER OF BYTES. Note that this differs from vanilla FreeRTOS"). Arduino examples use 2048-4096.
- `vTaskDelay(pdMS_TO_TICKS(500))` is the portable way; `vTaskDelay(500)` means 500 ticks (tick = 1 ms by default on ESP32, but do not assume).
- Priorities: 0 = idle, higher = more urgent (core examples use 1-2); a task that never blocks starves lower priorities and trips the task watchdog.
- Don't call blocking APIs (`xQueueReceive` with a timeout, `delay`) inside ISRs; use the `...FromISR` variants.
- MicroPython on ESP32 runs the main task AND all `_thread` threads pinned to the SAME core (`MP_TASK_COREID`: core 1 on dual-core chips, core 0 on single-core chips; `ports/esp32/mphalport.h`), so threads share one CPU; the main MicroPython task has a 16 KiB stack. Prefer asyncio for I/O concurrency.
- 4.0.0-RC1: no FreeRTOS API change noted for Arduino.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/FreeRTOS/BasicMultiThreading/BasicMultiThreading.ino , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/ArduinoStackSize/ArduinoStackSize.ino , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/main.cpp , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/api-reference/system/freertos_idf.html , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/mphalport.h

---

## TASK 24. Time: SNTP, time zones, RTC

Arduino C++ (SNTP is built in; POSIX TZ string handles daylight saving):
```cpp
#include <WiFi.h>
#include <time.h>

void setup() {
  Serial.begin(115200);
  WiFi.begin("ssid", "pass");
  while (WiFi.status() != WL_CONNECTED) delay(250);
  // TZ string for Europe/Rome; Jerusalem is "IST-2IDT,M3.4.4/26,M10.5.0"
  configTzTime("CET-1CEST,M3.5.0,M10.5.0/3", "pool.ntp.org", "time.nist.gov");
}

void loop() {
  struct tm t;
  if (getLocalTime(&t, 5000)) {                       // waits up to 5 s for the first sync
    Serial.println(&t, "%A, %B %d %Y %H:%M:%S");      // strftime-style Print overload
    time_t epoch = time(nullptr);                     // Unix epoch seconds, 1970
  } else {
    Serial.println("no time yet");
  }
  delay(1000);
}
```
Fixed offset instead of a TZ rule: `configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org");`. Callbacks: `sntp_set_time_sync_notification_cb(cb)` and `esp_sntp_servermode_dhcp(1)` (`#include "esp_sntp.h"`, shown in the core's `SimpleTime` example; call the DHCP-NTP option BEFORE the DHCP lease). `getLocalTime(struct tm*, uint32_t ms = 5000)` returns false until the clock is set (year < 2016 counts as unset).

MicroPython (no time-zone support; the RTC holds UTC; epoch is 2000-01-01 on ESP32):
```python
import network, ntptime, time, machine

# Wi-Fi must be connected first
ntptime.host = "pool.ntp.org"            # optional, default pool.ntp.org
ntptime.timeout = 2                      # seconds, default 1
ntptime.settime()                        # sets the RTC to UTC; raises OSError on timeout

print(time.localtime())                  # (y, m, d, hh, mm, ss, weekday, yearday), UTC
offset = 3 * 3600                        # manual time-zone offset, you handle DST yourself
print(time.localtime(time.time() + offset))
print(machine.RTC().datetime())          # (year, month, day, weekday, hours, minutes, seconds, subseconds)
```
`ntptime.time()` returns the NTP time in the port's epoch without setting the RTC. Without NTP, set the RTC by hand: `machine.RTC().datetime((2026, 10, 4, 6, 12, 0, 0, 0))` (weekday 0 = Monday). The ESP32 RTC keeps time across soft resets and deep sleep (not power loss).

ESP-IDF: `esp_sntp.h` / `esp_netif_sntp.h` (`esp_netif_sntp_init(&config)`, `esp_netif_sntp_sync_wait()`), `setenv("TZ", "...", 1); tzset();`, `localtime_r`. (`esp_netif_sntp_*` is the IDF 5.x API; not re-checked against the 6.1 headers: UNVERIFIED.)

Notes:
- POSIX TZ syntax: `STDoffset[DST[offset],rule]`; the offset sign is INVERTED (west of Greenwich is positive): "CET-1CEST,M3.5.0,M10.5.0/3" = UTC+1 with DST from last Sunday of March to last Sunday of October.
- `getLocalTime()` and `time()` after deep sleep: the time survives a deep-sleep wake (RTC timer) but is lost on power-on; re-sync on every power-on.
- TLS certificate validation needs a correct clock: sync before HTTPS (see task 16).
- MicroPython `ntptime.settime()` blocks up to `timeout` seconds and raises `OSError` (wrap in try/except and retry). A DST-aware helper is not built in.
- MicroPython epoch: `time.gmtime(0)[0]` is 2000 on ESP32 (docs: "The other embedded ports use an epoch of 2000-01-01"), so `time.time()` is NOT a Unix timestamp; `ntptime` adjusts for that automatically.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/Time/SimpleTime/SimpleTime.ino , https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/esp32-hal-time.c , https://raw.githubusercontent.com/micropython/micropython-lib/master/micropython/net/ntptime/ntptime.py , https://docs.micropython.org/en/latest/library/time.html

---

## TASK 25. I2S audio

Arduino C++ (core 3.x `ESP_I2S` library, class `I2SClass`; there is NO global `I2S` object, create your own):
```cpp
#include <ESP_I2S.h>

I2SClass i2s;                                          // the removed 2.x "I2S.h" API does not exist any more

const int PIN_BCLK = 5, PIN_LRC = 25, PIN_DOUT = 26;   // to an I2S DAC / amp such as MAX98357A

void setup() {
  Serial.begin(115200);
  i2s.setPins(PIN_BCLK, PIN_LRC, PIN_DOUT);            // (bclk, ws, dout, din = -1, mclk = -1): call BEFORE begin
  if (!i2s.begin(I2S_MODE_STD, 16000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO)) {
    Serial.println("I2S init failed");
    while (true) delay(1000);
  }
}

void loop() {
  static int16_t sample = 3000;
  static unsigned count = 0;
  if (++count % 18 == 0) sample = -sample;             // crude square wave at ~440 Hz (16000 / 36)
  int16_t left = sample, right = sample;
  i2s.write(&left, sizeof(left));                      // write(const void*, size_t): NOT write(sample) which sends ONE byte
  i2s.write(&right, sizeof(right));
}
```
Microphone (PDM or standard) input: `i2s.setPins(bclk, ws, -1, din); i2s.begin(I2S_MODE_STD, 16000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO); size_t n = i2s.readBytes((char *)buf, sizeof(buf));`; PDM: `i2s.setPinsPdmRx(clk, din0); i2s.begin(I2S_MODE_PDM_RX, ...)`. Modes: `I2S_MODE_STD`, `I2S_MODE_TDM`, `I2S_MODE_PDM_TX`, `I2S_MODE_PDM_RX`. Bit widths `I2S_DATA_BIT_WIDTH_8BIT/16BIT/24BIT/32BIT`; slot modes `I2S_SLOT_MODE_MONO/STEREO`. Slave: `begin(..., -1, I2S_ROLE_SLAVE)`; runtime switching with `configureTX()/configureRX()`; WAV helpers `i2s.recordWAV(seconds, &size)`, `i2s.playWAV(buf, size)` (examples).

MicroPython:
```python
from machine import I2S, Pin

audio = I2S(0, sck=Pin(5), ws=Pin(25), sd=Pin(26),
            mode=I2S.TX, bits=16, format=I2S.STEREO, rate=16000, ibuf=8000)
buf = bytearray(1024)                       # fill with 16-bit little-endian stereo samples
audio.write(buf)                            # blocks until queued
# recording: I2S(1, sck=..., ws=..., sd=..., mode=I2S.RX, bits=16, format=I2S.MONO, rate=16000, ibuf=20000); n = mic.readinto(buf)
audio.deinit()
```
The class is `machine.I2S(id, *, sck, ws, sd, mck=None, mode, bits, format, rate, ibuf)`; it is still marked a "Technical Preview" in the 1.29 docs; `uasyncio`-style streaming is possible via `asyncio.StreamWriter(audio)` as in the docs examples.

ESP-IDF: `driver/i2s_std.h` (`i2s_new_channel`, `i2s_channel_init_std_mode`, `i2s_channel_enable`, `i2s_channel_write`), `i2s_pdm.h`, `i2s_tdm.h`, component `esp_driver_i2s`. The legacy `driver/i2s.h` was REMOVED in IDF 6.0 (and `i2s_port_t` became plain `int`).

Notes:
- Arduino 2.x had `#include <I2S.h>` and `I2S.begin(mode, rate, bits)` + `i2s_driver_install` calls; **removed in 3.0** ("completely redesigned", migration guide). Sketches that `#include <driver/i2s.h>` fail on IDF 6.x (core 4.0) and show a legacy-driver conflict on IDF 5.x.
- The Arduino API doc page uses `I2S.setPins(...)`/`I2S.begin(...)` in some snippets for a global instance that does not exist in the library source (`ESP_I2S.h` has `I2SClass`, `explicit I2SClass(i2s_port_t port = I2S_NUM_AUTO)`, and the shipped examples declare `I2SClass i2s;`): write `i2s.` with your own instance.
- 24-bit data needs the MCLK multiple set to 384 (docs); 8-bit is packed into the high byte of a 16-bit slot by the library.
- Typical I2S pins are free (GPIO matrix); the original ESP32 also has built-in DAC-over-I2S and internal ADC modes in IDF 4.4 that the new driver dropped.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/i2s.html , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP_I2S/src/ESP_I2S.h , https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP_I2S/examples/Simple_tone/Simple_tone.ino , https://docs.micropython.org/en/latest/library/machine.I2S.html

---

## TASK 26. TWAI / CAN

Arduino C++ (the core has NO Arduino wrapper; the examples use the IDF driver `driver/twai.h` directly, the "legacy" TWAI driver; chips: ESP32, C3, C5, C6, H2, P4, S2, S3; not C2/C61; needs an external CAN transceiver such as SN65HVD230/TJA1051):
```cpp
#include "driver/twai.h"

#define TX_PIN 5
#define RX_PIN 4

void setup() {
  Serial.begin(115200);
  twai_general_config_t g = TWAI_GENERAL_CONFIG_DEFAULT((gpio_num_t)TX_PIN, (gpio_num_t)RX_PIN, TWAI_MODE_NORMAL);
  twai_timing_config_t  t = TWAI_TIMING_CONFIG_500KBITS();
  twai_filter_config_t  f = TWAI_FILTER_CONFIG_ACCEPT_ALL();
  if (twai_driver_install(&g, &t, &f) != ESP_OK) { Serial.println("install failed"); return; }
  if (twai_start() != ESP_OK)                    { Serial.println("start failed");   return; }
}

void loop() {
  twai_message_t tx = {};                             // zero-init: clears extd/rtr flag bits
  tx.identifier = 0x123;
  tx.data_length_code = 2;
  tx.data[0] = 0xAB; tx.data[1] = 0xCD;
  twai_transmit(&tx, pdMS_TO_TICKS(1000));

  twai_message_t rx;
  if (twai_receive(&rx, pdMS_TO_TICKS(100)) == ESP_OK) {
    Serial.printf("id 0x%03X len %d\n", (unsigned)rx.identifier, rx.data_length_code);
  }
}
```
Also used by the examples: `twai_reconfigure_alerts()`, `twai_read_alerts()`, `twai_get_status_info()`, `twai_stop()`, `twai_driver_uninstall()`. Timing macros `TWAI_TIMING_CONFIG_25KBITS ... _1MBITS`.

NEW IDF node API (IDF >= 5.5, the one the IDF docs now teach; no Arduino wrapper): `esp_twai.h` + `esp_twai_onchip.h`: `twai_new_node_onchip(&config, &node)`, `twai_node_enable(node)`, `twai_node_transmit(node, &frame, timeout)`, `twai_node_register_event_callbacks(...)`, `twai_node_receive_from_isr`, `twai_node_delete`; the node config has FD fields (`data_timing`, `twai_frame_t::header::fdf`) that are ignored on controllers without FD; the IDF page says the TWAI controllers on the classic ESP32 are NOT compatible with FD frames and read them as errors. Which newer chips have an FD-capable controller: UNVERIFIED.

MicroPython: **no TWAI/CAN on the ESP32 port in 1.29.0.** The new generic `machine.CAN` (introduced in 1.28.0) is documented as available on **STM32, MIMXRT, Alif** only (docs `machine.CAN`, "Availability"); `ports/esp32` has no CAN/TWAI source and no TWAI in `docs/library/esp32.rst`. Options on ESP32: an external SPI CAN controller (MCP2515) with a community driver (not verified), a third-party MicroPython firmware with CAN (UNVERIFIED), or CircuitPython's `canio` on supported ESP32 chips (UNVERIFIED which chips), or write the node in Arduino/IDF.

Notes:
- Arduino docs chip table lists TWAI as "-" (not provided by the core API) for ESP32, C3, C5, C6, H2, P4, S2, S3 and n/a for C2, C61, meaning "use the ESP-IDF API". The shipped examples (`libraries/ESP32/examples/TWAI/TWAItransmit`, `TWAIreceive`, same in 4.0.0-RC1) still call the legacy `twai_driver_install` flow.
- IDF 5.5 migration: the legacy driver is "not recommended"; IDF 6.0 keeps it behind deprecation warnings (silence with `CONFIG_TWAI_SUPPRESS_DEPRECATE_WARN`; with Arduino you can't change sdkconfig, warnings are cosmetic). The legacy API can disappear in a later IDF major.
- Termination: 120 Ohm at both bus ends; transceiver supply 3.3 V for SN65HVD230, 5 V for TJA1050 (level shift RX).
- CAN bit rates 125/250/500 kbit/s are the common ones; both nodes must agree.

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/ESP32/examples/TWAI/TWAItransmit/TWAItransmit.ino , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/api-reference/peripherals/twai.html , https://docs.espressif.com/projects/esp-idf/en/v6.1/esp32/migration-guides/release-6.x/6.0/peripherals.html , https://docs.micropython.org/en/latest/library/machine.CAN.html

---

## TASK 27. USB device (S2/S3/P4) and host

Arduino C++ (needs Tools > **USB Mode: "USB-OTG (TinyUSB)"** so `ARDUINO_USB_MODE == 0`; ESP32-S2, S3, P4):
```cpp
#include "USB.h"
#include "USBHIDKeyboard.h"
#include "USBHIDMouse.h"

#ifndef ARDUINO_USB_MODE
#error This ESP32 SoC has no native USB (OTG) interface
#elif ARDUINO_USB_MODE == 1
#error Select Tools > USB Mode > USB-OTG (TinyUSB)
#endif

USBHIDKeyboard Keyboard;
USBHIDMouse Mouse;
const int BTN = 0;

void setup() {
  pinMode(BTN, INPUT_PULLUP);
  Keyboard.begin();
  Mouse.begin();
  USB.begin();                                 // starts the USB stack AFTER the classes are added
}

void loop() {
  if (digitalRead(BTN) == LOW) {
    Keyboard.print("Hello from ESP32\n");      // press/release/write/print as on a Leonardo
    Mouse.move(10, 0);
    delay(500);
  }
}
```
Other device classes in `libraries/USB`: `USBCDC` (extra serial port; `USBSerial` is the CDC-on-boot port), `USBHIDGamepad`, `USBHIDConsumerControl`, `USBHIDSystemControl`, `USBHIDVendor`, `USBMSC` (mass storage), `USBMIDI`, `USBAudioCard`, firmware MSC (Tools "USB Firmware MSC On Boot"), DFU option. Descriptor strings: `USB.productName("..")`, `USB.manufacturerName("..")`, `USB.VID()/PID()`, `USB.firmwareVersion(..)`. USB HOST (S3/P4 with OTG) classes: `USBHostHIDKeyboard`, `USBHostHIDMouse`, `USBHostMSC`, `USBHostSerial`, `USBHostHIDGamepad` (examples `USBHostKeyboard`, `USBHostMouse`, `USBHostMSC_Test`); on the S3 do not combine USB Host with "USB-OTG + CDC On Boot enabled" (shared PHY, see notes).

Chip split (Arduino chip table): **USB OTG (TinyUSB)**: S2, S3, P4. **USB Serial/JTAG only** (fixed CDC serial + JTAG, no HID): C3, C5, C6, C61, H2, S3 (its second block), P4. ESP32 and C2 have no USB. The S3 has both blocks sharing one PHY: you choose "Hardware CDC and JTAG" or "USB-OTG (TinyUSB)".

MicroPython: `machine.USBDevice` (generic USB device API: you supply the descriptors and endpoint callbacks) has been available on the ESP32 port **since 1.25.0 (2025-04-15)** (introduced on rp2 in 1.23.0); chips with a USB-OTG peripheral: ESP32-S2, S3, P4 (`MICROPY_HW_ENABLE_USBDEV = SOC_USB_OTG_SUPPORTED`). C3/C6/H2 use the built-in USB Serial/JTAG (REPL only). Higher-level HID/CDC classes come from micropython-lib `usb-device-*` packages via mip (names `usb-device-keyboard`, `usb-device-mouse`, `usb-device-hid`, `usb-device-cdc`: from memory, UNVERIFIED).
```python
import machine
usb = machine.USBDevice()            # singleton
# usb.config(desc_dev, desc_cfg, desc_strs=None, open_itf_cb=..., reset_cb=..., control_xfer_cb=..., xfer_cb=...)
# usb.active(True)
```
(Build the descriptors with the micropython-lib `usb-device` package rather than by hand.)

ESP-IDF: TinyUSB via the managed component `espressif/esp_tinyusb`; `usb_serial_jtag` driver; host stack: `espressif/usb` managed component (IDF 6.0 moved the `usb` component OUT of the IDF tree to the registry).

Notes:
- ESP32-S3 shares ONE PHY between USB Serial/JTAG and USB OTG: for USB Host the Arduino docs say do not combine USB Mode = "USB-OTG (TinyUSB)" with USB CDC On Boot = Enabled (use "Hardware CDC and JTAG", or OTG with CDC on boot disabled so `Serial` is on UART0). ESP32-P4 has separate controllers, any combination works. For plain device use, CDC-on-boot with TinyUSB gives `USBSerial` (see task 7).
- 4.0.0-RC1 includes "multi-sample-rate support for UAC1/UAC2" (USB audio) and a USB fix for IDF 6.
- HID needs the correct endpoint-ordering: add all `begin()` calls before `USB.begin()`; the host may cache descriptors, so re-plug after changes (Windows device cache).

Source: https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/USB , https://github.com/espressif/arduino-esp32/blob/3.3.12/docs/en/api/usb_host.rst , https://docs.micropython.org/en/latest/library/machine.USBDevice.html , https://github.com/micropython/micropython/blob/v1.29.0/ports/esp32/mpconfigport.h

---

## TASK 28. Zigbee, Matter, OpenThread, RainMaker (state per feature)

State table (Arduino-ESP32; verified from the libraries/ trees, release notes and the chip table):

| Feature | Library header | Since (core) | Chips | Needs |
|---|---|---|---|---|
| Zigbee | `Zigbee.h` | first alpha 3.0.0-alpha3 (2023-12); current library implementation 3.0.6 / 3.1.0 (2024-10 / 2024-12) | ESP32-C6, ESP32-H2 (and C5 listed Y in 3.3.12 docs) | Tools > Zigbee Mode (`ed` end device, `zczr` coordinator/router, `*_debug`), partition scheme "Zigbee 4MB with spiffs" etc. (named `zigbee`, `zigbee_2MB`, `zigbee_8MB`, `zigbee_zczr*`) |
| Matter | `Matter.h` | initial Arduino Matter library in 3.1.0 (RC2 2024-10-25, stable 2024-12-16); ESP Matter 1.5 in 3.3.11; Matter 1.6 on IDF 6.1 in 4.0.0-RC1 | Wi-Fi: ESP32, S2, S3, C3, C5, C6; Thread: C5, C6, H2 (C2/C61 only via IDF component) | partition "Huge APP"-like; C5 sets `MatterNetwork=wifi` |
| OpenThread | `OThread.h` (`OThread`, `OpenThread`, `DataSet`, `OThreadCLI`) | 3.0.2 (2024-06) | C5, C6, H2 | `CONFIG_OPENTHREAD_ENABLED` (prebuilt on those chips) |
| ESP RainMaker | `RMaker.h` | 2.0.0-rc1 (2021-07) | Wi-Fi chips (docs say "ESP32-S2 and ESP32 based"; later S3/C3/C6 UNVERIFIED) | claiming service; absent in 4.0.0-alpha1 (IDF 6 incompatibility), present as a directory in 4.0.0-RC1 (status UNVERIFIED) |
| ESP Insights | `ESP32Insights` (library `Insights`) | 2.0.6 (2022-12) | Wi-Fi chips | absent in 4.0.0-alpha1 |

Zigbee end device (on/off light), from the core example `Zigbee_On_Off_Light` (Tools: Zigbee Mode = ED, Partition = Zigbee):
```cpp
#include <Arduino.h>
#ifndef ZIGBEE_MODE_ED
#error "Select Tools > Zigbee Mode > Zigbee ED (end device)"
#endif
#include "Zigbee.h"

#define ZIGBEE_LIGHT_ENDPOINT 10
ZigbeeLight zbLight(ZIGBEE_LIGHT_ENDPOINT);

void setLED(bool on) { digitalWrite(RGB_BUILTIN, on); }

void setup() {
  Serial.begin(115200);
  pinMode(RGB_BUILTIN, OUTPUT);
  zbLight.setManufacturerAndModel("Espressif", "ZBLightBulb");
  zbLight.onLightChange(setLED);
  Zigbee.addEndpoint(&zbLight);                       // add endpoints BEFORE begin()
  if (!Zigbee.begin()) { Serial.println("Zigbee failed to start"); ESP.restart(); }
  while (!Zigbee.connected()) { delay(100); }         // joins the coordinator's network (pairing mode on the hub)
}

void loop() { delay(100); }                           // Zigbee.factoryReset() to forget the network
```
Endpoint classes in `libraries/Zigbee/src/ep` (3.3.12): ZigbeeLight, ZigbeeDimmableLight, ZigbeeColorDimmableLight, ZigbeeSwitch, ZigbeeColorDimmerSwitch, ZigbeePowerOutlet, ZigbeeTempSensor, ZigbeeContactSwitch, ZigbeeOccupancySensor, ZigbeeIlluminanceSensor, ZigbeePressureSensor, ZigbeeFlowSensor, ZigbeeCarbonDioxideSensor, ZigbeePM25Sensor, ZigbeeVibrationSensor, ZigbeeWindSpeedSensor, ZigbeeThermostat, ZigbeeFanControl, ZigbeeWindowCovering, ZigbeeElectricalMeasurement, ZigbeeAnalog, ZigbeeBinary, ZigbeeMultistate, ZigbeeGateway, ZigbeeRangeExtender, ZigbeeDoorWindowHandle (coordinator/router mode is `ZIGBEE_MODE_ZCZR`).

Matter on/off light, from the core example `Lighting/MatterOnOffLight`:
```cpp
#include <Matter.h>

MatterOnOffLight OnOffLight;
const uint8_t ledPin = 2;

bool setLightOnOff(bool state) {                      // return true when applied
  digitalWrite(ledPin, state);
  return true;
}

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
#if !CONFIG_ENABLE_CHIPOBLE
  matterConnectWiFi("ssid", "password");              // Wi-Fi-only builds; BLE commissioning builds skip this
#endif
  OnOffLight.begin(true);                             // initial state
  OnOffLight.onChange(setLightOnOff);
  Matter.begin();
  matterWaitUntilReady();
  OnOffLight.updateAccessory();
}

void loop() {
  matterRestartIfNoFabric();                          // reboot into commissioning mode if the fabric was removed
}
```
Other Matter endpoints (`libraries/Matter/src/MatterEndpoints`, 3.3.12): MatterOnOffLight, MatterDimmableLight, MatterColorLight, MatterColorTemperatureLight, MatterEnhancedColorLight, MatterOnOffPlugin, MatterDimmablePlugin, MatterFan, MatterThermostat, MatterWindowCovering, MatterGenericSwitch, MatterTemperatureSensor, MatterHumiditySensor, MatterPressureSensor, MatterLightSensor, MatterOccupancySensor, MatterContactSensor, MatterRainSensor, MatterWaterLeakDetector, MatterWaterFreezeDetector, MatterTemperatureControlledCabinet. Commission with QR code/manual pairing code from `Matter.getManualPairingCode()` / `getOnboardingQRCodeUrl()` (names from the library docs, not re-checked: UNVERIFIED).

OpenThread (native API, from `Native/SimpleThreadNetwork/LeaderNode`):
```cpp
#include "OThread.h"

OpenThread threadNode;
DataSet dataset;

void setup() {
  Serial.begin(115200);
  threadNode.begin(false);                            // false = do not auto-start
  dataset.initNew();
  dataset.setNetworkName("ESP_OpenThread");
  dataset.setChannel(15);
  dataset.setPanId(0x1234);
  threadNode.commitDataSet(dataset);
  threadNode.networkInterfaceUp();
  threadNode.start();
}

void loop() {
  Serial.printf("role: %s\n", threadNode.otGetStringDeviceRole());
  delay(3000);
}
```
RainMaker (Wi-Fi chips): `#include "RMaker.h"`, `RMaker.initNode("name")`, `RMaker.start()`; device/param helpers in the docs page `api/rainmaker.rst`.

Notes:
- Zigbee/Matter/Thread sketches must be built with the matching Tools menu options; otherwise the example `#error`s ("Zigbee end device mode is not selected").
- 4.0.0-RC1 migrates Zigbee to **esp-zigbee-sdk v2.0** and Matter to ESP Matter 1.6 on IDF 6.1; sketches using the 3.3.x Zigbee API may need changes (no migration guide found; UNVERIFIED).
- In a Matter sketch do not use the core BLE library (Matter owns the BLE host).
- Matter-over-Wi-Fi vs Thread availability per chip: see the table; ESP32-H2 is Thread only; classic ESP32/S3 have no 802.15.4 radio (no Thread/Zigbee without an external RCP).
- MicroPython has no Zigbee/Matter/Thread support in the official builds (none in the 1.29 docs/port); CircuitPython neither (UNVERIFIED). ESPHome provides Zigbee/Matter-like integrations through its own components (not checked).

Source: https://github.com/espressif/arduino-esp32/blob/3.3.12/docs/en/libraries.rst , https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/Zigbee/examples/Zigbee_On_Off_Light , https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/Matter/examples/Lighting/MatterOnOffLight , https://github.com/espressif/arduino-esp32/tree/3.3.12/libraries/OpenThread/examples/Native/SimpleThreadNetwork , https://github.com/espressif/arduino-esp32/releases (3.0.0-alpha3, 3.0.2, 3.0.6, 3.1.0-RC2, 4.0.0-RC1)


---

## TASK 29. Displays and touch (names, constructor lines; LVGL 9 in detail)

All constructor lines below are for the classic 3.3 V ESP32 wiring (SPI: SCK 18, MOSI 23, MISO 19; I2C: SDA 21, SCL 22). Library versions from the GitHub API on 2026-10-04.

Character LCD 16x2 with PCF8574 backpack:
```cpp
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);        // address 0x27 or 0x3F (scan I2C), columns, rows
// setup: lcd.init(); lcd.backlight(); lcd.setCursor(0, 0); lcd.print("Hello");
```
Caveat: the popular `marcoschwartz/LiquidCrystal_I2C` and `johnrickman/LiquidCrystal_I2C` repos (v1.1.4 in `library.properties`; last tagged release 1.1.3, 2016) declare `architectures=avr`: the IDE warns but it normally compiles on ESP32; the `hd44780` library (duinoWitchery, `hd44780_I2Cexp lcd; lcd.begin(16, 2);`, last push 2022-12) is the sturdier choice. Compile-on-3.3.x of each: UNVERIFIED.

OLED SSD1306 128x64 (I2C): **Adafruit_SSD1306 2.5.17 + Adafruit_GFX**:
```cpp
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(128, 64, &Wire, -1);   // width, height, TwoWire*, reset pin (-1 = none)
// setup: Wire.begin(21, 22); display.begin(SSD1306_SWITCHCAPVCC, 0x3C); display.clearDisplay();
//        display.setTextSize(1); display.setTextColor(SSD1306_WHITE); display.setCursor(0, 0);
//        display.println("Hello"); display.display();     // nothing shows until display()
```
**U8g2** (olikraus; Arduino package 2.36.19 on 2026-05-17), full-buffer HW I2C SSD1306:
```cpp
#include <U8g2lib.h>
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);
// setup: u8g2.begin(); u8g2.setFont(u8g2_font_ncenB08_tr); u8g2.clearBuffer(); u8g2.drawStr(0, 12, "Hello"); u8g2.sendBuffer();
```
(SW I2C on any pins: `U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /*clock=*/ 22, /*data=*/ 21, U8X8_PIN_NONE);`.)

TFT (SPI): **TFT_eSPI** (Bodmer):
```cpp
#include <TFT_eSPI.h>              // pins and driver chip come from User_Setup.h / User_Setup_Select.h (or -D build flags), not from code
TFT_eSPI tft = TFT_eSPI();
// setup: tft.init(); tft.setRotation(1); tft.fillScreen(TFT_BLACK); tft.setTextColor(TFT_WHITE, TFT_BLACK); tft.drawString("Hello", 10, 10, 4);
```
Status: last tagged release **V2.5.43 (2024-03-06)**; the repo is still being pushed to (commits 2026-02 "Fix DMA on ESP32 C3 and S3 for board packages 3.x.x", "Setup302 define HSPI for esp32 v3.0 and above", README edit 2026-04-03), 353 open issues. README says the ESP32-S3 DMA path now works with ESP-IDF > 2.0.14, "tested with the Arduino 3.3.6 board package". So: it works on core 3.x ESP32/S2/S3/C3, but the fixes are on `master`, newer than the last release (which version the Library Manager serves: UNVERIFIED). ESP32-C6/H2/P4: not mentioned in the README (UNVERIFIED, expect trouble). Known pain point: editing `User_Setup.h` inside the library folder breaks on every update; use `User_Setup_Select.h` or build flags.

**LovyanGFX** 1.2.32 (2026-10-02, actively maintained; release notes mention ESP32-C6 on arduino-esp32 3.0.x compile fix and a C3 firmware-size fix): you describe the panel and bus in a class:
```cpp
#include <LovyanGFX.hpp>
class LGFX : public lgfx::LGFX_Device {
  lgfx::Panel_ST7789 _panel;
  lgfx::Bus_SPI _bus;
 public:
  LGFX() {
    auto b = _bus.config();             // b.spi_host, b.freq_write, b.pin_sclk/mosi/miso/dc ...
    _bus.config(b);
    _panel.setBus(&_bus);
    auto p = _panel.config();           // p.pin_cs, p.pin_rst, p.panel_width/height ...
    _panel.config(p);
    setPanel(&_panel);
  }
};
LGFX tft;
// setup: tft.init(); tft.fillScreen(TFT_BLACK); tft.drawString("Hello", 10, 10);
```
**Arduino_GFX** (moononournation v1.6.8, 2026-09-18; constructors checked in the headers):
```cpp
#include <Arduino_GFX_Library.h>
Arduino_DataBus *bus = new Arduino_ESP32SPI(/*dc=*/ 2, /*cs=*/ 5, /*sck=*/ 18, /*mosi=*/ 23, /*miso=*/ GFX_NOT_DEFINED);
Arduino_GFX *gfx = new Arduino_ST7789(bus, /*rst=*/ 4, /*rotation=*/ 0, /*ips=*/ true, 240, 240);
// setup: gfx->begin(); gfx->fillScreen(BLACK); gfx->setCursor(10, 10); gfx->println("Hello");
```
**E-paper: GxEPD2** 1.6.9 (2026-04-19). Pattern (display class choice varies; see the library's `GxEPD2_display_selection_new_style.h`): `GxEPD2_BW<GxEPD2_154_D67, GxEPD2_154_D67::HEIGHT> display(GxEPD2_154_D67(/*CS=*/ 5, /*DC=*/ 17, /*RST=*/ 16, /*BUSY=*/ 4));` then `display.init(115200); display.setFullWindow(); display.firstPage(); do { display.fillScreen(GxEPD_WHITE); display.setCursor(10, 20); display.print("Hello"); } while (display.nextPage());` (constructor line from library usage, UNVERIFIED against this exact version).

Touch (names): **XPT2046_Touchscreen** (Paul Stoffregen, v1.4, 2021-06): `XPT2046_Touchscreen ts(CS_PIN, IRQ_PIN); ts.begin(); if (ts.touched()) { TS_Point p = ts.getPoint(); }`; TFT_eSPI's built-in `tft.getTouch(&x, &y)` / `tft.calibrateTouch()`; capacitive FT6236/FT6336 (Adafruit FT6206 library or an FT6336 library), GT911 (e.g. TAMC_GT911 / bb_captouch), CST816S (e.g. a CST816S library): exact library names, versions and ESP32 3.x compatibility UNVERIFIED.

LVGL (**v9.6.0, 2026-09-16; v9.6 is announced as the LAST v9 release, everything marked `LV_DEPRECATED` is removed in v10.0, which is "currently in development and not yet released"** (docs `migration-v9-6.mdx`, `migration-v10.mdx`)). Minimal Arduino use with a TFT driver (v9 API; every name below was checked in the 9.6.0 headers):
```cpp
#include <lvgl.h>                                   // needs lv_conf.h next to the libraries folder; 9.6 moved public headers to include/lvgl/
#include <TFT_eSPI.h>

static const uint16_t W = 320, H = 240;
static uint8_t buf[W * 20 * 2];                     // RGB565 partial render buffer (2 bytes/pixel)
TFT_eSPI tft;

static uint32_t my_tick() { return millis(); }

static void flush_cb(lv_display_t *disp, const lv_area_t *area, uint8_t *px_map) {   // v8: lv_disp_drv_t*, lv_color_t*
  uint32_t w = lv_area_get_width(area), h = lv_area_get_height(area);
  tft.startWrite();
  tft.setAddrWindow(area->x1, area->y1, w, h);
  tft.pushColors((uint16_t *)px_map, w * h, true);  // true = swap bytes for the SPI panel
  tft.endWrite();
  lv_display_flush_ready(disp);                     // v8: lv_disp_flush_ready(drv)
}

static void touch_cb(lv_indev_t *indev, lv_indev_data_t *data) {
  uint16_t x, y;
  if (tft.getTouch(&x, &y)) { data->state = LV_INDEV_STATE_PRESSED; data->point.x = x; data->point.y = y; }
  else data->state = LV_INDEV_STATE_RELEASED;
}

static void on_click(lv_event_t *e) { Serial.println("clicked"); }

void setup() {
  Serial.begin(115200);
  tft.init(); tft.setRotation(1);
  lv_init();
  lv_tick_set_cb(my_tick);                          // v8: lv_tick_inc(ms) from a timer; still available
  lv_display_t *disp = lv_display_create(W, H);     // v8: lv_disp_drv_init + lv_disp_drv_register
  lv_display_set_color_format(disp, LV_COLOR_FORMAT_RGB565);
  lv_display_set_flush_cb(disp, flush_cb);
  lv_display_set_buffers(disp, buf, nullptr, sizeof(buf), LV_DISPLAY_RENDER_MODE_PARTIAL);
  lv_indev_t *indev = lv_indev_create();            // v8: lv_indev_drv_t + lv_indev_drv_register
  lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER);
  lv_indev_set_read_cb(indev, touch_cb);

  lv_obj_t *btn = lv_button_create(lv_screen_active());   // v8: lv_btn_create(lv_scr_act())
  lv_obj_t *lbl = lv_label_create(btn);
  lv_label_set_text(lbl, "Click me");
  lv_obj_center(btn);
  lv_obj_add_event_cb(btn, on_click, LV_EVENT_CLICKED, nullptr);
}

void loop() {
  lv_timer_handler();                               // call every few ms
  delay(5);
}
```
What changed from LVGL v8 to v9 (for text): driver structs are gone (`lv_display_*` / `lv_indev_*` objects); `lv_disp_flush_ready` -> `lv_display_flush_ready`; `lv_scr_act()` -> `lv_screen_active()`; `lv_btn_create` -> `lv_button_create`; flush callback signature `(lv_display_t*, const lv_area_t*, uint8_t *px_map)`; draw buffers via `lv_display_set_buffers(..., render_mode)`; `lv_tick_set_cb()` replaces the `LV_TICK_CUSTOM` config; `LV_COLOR_16_SWAP` removed (swap in the flush callback); `lv_timer_handler()` (alias `lv_task_handler` for old code). The v8-name compatibility aliases live in `api_map/lv_api_map_v8.h` (`lv_scr_act`, `lv_btn_create`, `lv_disp_flush_ready`, `lv_disp_t` ... ) and are what v10 removes. 9.6 also made Kconfig the source of truth for configuration (generated `lv_conf_template.h`; `LV_CONF_MINIMAL` removed).

ESP-IDF display stack: `esp_lcd` (`esp_lcd_new_panel_io_spi`, `esp_lcd_panel_*`; IDF 6.0 changed GPIO fields to `gpio_num_t`, removed `esp_lcd_panel_disp_off` for `esp_lcd_panel_disp_on_off`, moved the NT35510 driver out), `espressif/esp_lvgl_port` (managed component, glue for LVGL 8/9: not re-checked), `esp_lcd_touch*` components.

MicroPython (official firmware has framebuf; displays via drivers):
```python
from machine import I2C, Pin
import ssd1306                         # micropython-lib: mip.install("ssd1306")  (NOT frozen in the ESP32 build)

i2c = I2C(0, scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)          # (width, height, i2c, addr=0x3C, external_vcc=False)
oled.fill(0)
oled.text("Hello", 0, 0, 1)                       # FrameBuffer methods: fill, pixel, line, rect, fill_rect, text, scroll, blit
oled.show()
```
`framebuf.FrameBuffer(buf, w, h, framebuf.MONO_VLSB / RGB565 / ...)` is built in. ST7789: russhughes **st7789_mpy** (fast C module, needs a custom firmware build; repo pushed 2026-07-21; constructor `st7789.ST7789(spi, width, height, dc=, reset=, cs=, backlight=, rotation=)` per its README) or the pure-Python **st7789py_mpy** (last push 2024-08). **LVGL for MicroPython**: `lvgl/lv_binding_micropython` (`lv_micropython`), repo pushed 2026-09-06, its `lv_conf.h` is generated for LVGL v9.3.0 (the pinned `lvgl` submodule revision's tag is not stated here); it needs a custom firmware build (LVGL is NOT in the official MicroPython downloads); readme drivers for ESP32: ILI9341, XPT2046, FT6X36.

Notes:
- Choose one graphics library per project; mixing TFT_eSPI + LVGL is common (LVGL calls the flush callback), TFT_eSPI + Adafruit_GFX is not.
- SPI displays on classic ESP32 default to the VSPI pins above; for ESP32-S3/C3/C6 the pins are free but check the board schematic (PSRAM/flash pins are reserved).
- OLED/LCD libraries share the I2C bus with sensors: use distinct addresses (SSD1306 0x3C/0x3D; PCF8574 LCD 0x27/0x3F).
- LVGL needs RAM: partial buffers of 1/10 screen are typical; PSRAM boards can use full frame buffers.

Source: https://github.com/lvgl/lvgl (tag v9.6.0: include/lvgl/display/lv_display.h, tick/lv_tick.h, indev/lv_indev.h, widgets/lv_button.h, api_map/lv_api_map_v8.h, docs/src/changelog/migration-v9-6.mdx) , https://github.com/Bodmer/TFT_eSPI , https://github.com/lovyan03/LovyanGFX , https://github.com/moononournation/Arduino_GFX , https://github.com/ZinggJM/GxEPD2 , https://github.com/adafruit/Adafruit_SSD1306 , https://github.com/micropython/micropython-lib/tree/master/micropython/drivers/display/ssd1306 , https://github.com/lvgl/lv_binding_micropython

---

## TASK 30. Tools, versions, flashing

(Current versions are in the table in section 1; this section is the how-to and the status notes.)

Arduino IDE 2.x / arduino-cli with the ESP32 core:
```text
# Boards Manager URL (stable):      https://espressif.github.io/arduino-esp32/package_esp32_index.json
# Boards Manager URL (development): https://espressif.github.io/arduino-esp32/package_esp32_dev_index.json
arduino-cli core update-index --additional-urls https://espressif.github.io/arduino-esp32/package_esp32_index.json
arduino-cli core install esp32:esp32 --additional-urls https://espressif.github.io/arduino-esp32/package_esp32_index.json
arduino-cli compile --fqbn esp32:esp32:esp32 MySketch
arduino-cli upload  --fqbn esp32:esp32:esp32 -p COM3 MySketch
```
`esp32:esp32:esp32` = ESP32 Dev Module, `esp32:esp32:esp32s3`, `esp32:esp32:esp32c3`, `esp32:esp32:esp32c6` for the generic chip boards; options append with commas: `--fqbn esp32:esp32:esp32s3:CDCOnBoot=cdc,PartitionScheme=huge_app` (menu ids from `boards.txt`, e.g. `PartitionScheme`, `ZigbeeMode`, `MatterNetwork`, `LoopCore`). The stable index carries 3.3.12; pre-releases such as 4.0.0-RC1 are on the development index.

PlatformIO: the **official** `platform = espressif32` (v7.1.3, 2026-09-11) still pins Arduino-ESP32 **2.0.17** (`framework-arduinoespressif32 ~4.20017.0`; `20017` = 2.0.17) while its `espidf` framework package is IDF 6.1 (`~4.60100.0`). For Arduino core 3.x use the community fork **pioarduino** (`platform = https://github.com/pioarduino/platform-espressif32/releases/download/stable/platform-espressif32.zip`; `stable` = Arduino 3.3.12 / IDF 5.5.5; release `61.04.00-RC1` = Arduino 4.0.0-RC1 / IDF 6.1; also a VS Code "pioarduino IDE" extension). pioarduino adds "hybrid compile" for ESP32-C2/C61/solo1. Its default filesystem is LittleFS. A `platformio.ini` copied from a 2022 tutorial therefore builds against the OLD API (2.x) unless it names pioarduino.

esptool 5.x (5.4.0; the 4.x line is still released, 4.12.0 on 2026-07-14): invoke `esptool` (not `esptool.py`; the .py scripts still exist with a deprecation warning) and use HYPHENS in commands and options:
```text
esptool --chip esp32 --port COM3 erase-flash
esptool --chip esp32 --port COM3 --baud 460800 write-flash 0x1000 firmware.bin     # old: esptool.py write_flash
esptool --port COM3 chip-id          # old: chip_id      |  esptool read-mac, flash-id, image-info, elf2image ...
```
Old underscore names (`write_flash`, `erase_flash`, `chip_id`) still work in v5 with a warning and are to be removed in the next major release; `write-flash --verify` is deprecated (verification is automatic); `--ignore-flash-encryption-efuse-setting` became `--ignore-flash-enc-efuse`; `espsecure sign_data` is `sign-data`. MicroPython 1.29's own deploy page still prints the underscore `esptool.py` form. First-flash offsets for MicroPython: ESP32 and S2 `0x1000`, C5 and P4 `0x2000`, C3/C6/S3/C2/H2 `0`.

MicroPython tooling: **mpremote** (1.29.0, same version as MicroPython; PyPI):
```text
mpremote connect list
mpremote connect COM3 fs cp main.py :main.py + soft-reset
mpremote run script.py
mpremote repl
mpremote mip install aioble            # install a package from micropython-lib onto the device
mpremote reset
```
(`mpremote fs cp`, `run`, `repl`, `mip install`, `soft-reset`, `reset` verified in `docs/reference/mpremote.rst`; `mpremote cp` is accepted shorthand.) On-device: `import mip; mip.install("name")` or `mip.install("github:org/repo/path/file.py")`. **Thonny 5.0.0** (2026-04) is the beginner IDE (MicroPython/CircuitPython interpreters; has a firmware-install helper: UNVERIFIED). **UIFlow 2** (M5Stack; firmware 2.5.3, 2026-09-11): MicroPython fork with a block editor for M5 devices.

Official firmware availability:
- **MicroPython 1.29.0** official generic builds for ESP32, ESP32-C2, C3, C5, C6, H2, P4, S2, S3 plus ~40 vendor boards (`ports/esp32/boards`). Chip support timeline from the release notes: S3 (1.18), C3 (by 1.19), C6 (1.24.0, 2024-10), C2 (1.26.0, 2025-08), C5 and P4 (1.27.0, 2025-12), H2 (1.29.0, 2026-08). IDF 5.5.2. ESP-NOW v2 in 1.29.0.
- **CircuitPython 10.3.1** (2026-09-14): ESP32-S2 and S3 "stable", ESP32 and C3 "beta", C2/C6/H2/P4 "alpha" per `ports/espressif/README.rst` (ESP32-S2/S3 have native USB so CIRCUITPY drive appears; ESP32/C3 REPL over UART or USB-Serial/JTAG, no CIRCUITPY drive over that link per the README).
- **ESPHome** 2026.9.1 (YAML configs compiled to firmware; Arduino or ESP-IDF framework, not re-checked), **Tasmota** v15.6.0, **WLED** v16.0.1: ready-made firmwares (versions only; chip lists not checked).
- **ESP Web Tools** (esphome/esp-web-tools, tag 10.4.0): an HTML `<esp-web-install-button manifest="manifest.json">` that flashes ESP firmware from the browser over Web Serial; the manifest lists `builds[]` per `chipFamily` with `parts[]` of `{path, offset}`; optional `serialType: "cdc"|"uart"`. (Web Serial works in Chromium-based desktop browsers: from general knowledge, UNVERIFIED in this README excerpt.)
- **Wokwi** simulator (online/VS Code; docs list): ESP32, S2, S3, C3, C6, C61, H2 supported; P4 beta; C5 and S31 alpha. It does not emulate every peripheral/radio (UNVERIFIED which).
- **ESP-IDF VS Code extension** 2.3.0 (2026-09-23): install IDF, build/flash/monitor with `idf.py` under the hood; ESP-IDF stable is **v6.1** (released 2026-08-27); Arduino core 3.3.x is built on IDF 5.5.5, 4.0.0-RC1 on IDF 6.1.

Notes:
- "Which version am I on?" - Arduino: Boards Manager shows "esp32 by Espressif Systems 3.3.12" (stable). Print it in a sketch with `ESP.getSdkVersion()` (IDF version string) and `ESP_ARDUINO_VERSION_MAJOR/MINOR/PATCH` macros (`#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)`; checked in `cores/esp32/esp_arduino_version.h`, 3.3.12 has MAJOR 3, MINOR 3, PATCH 12). IDF guard: `#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 5, 0)` (`esp_idf_version.h`). MicroPython: `import sys; sys.implementation` / `os.uname().release`.
- A "Zigbee/Matter/BLE" tutorial for core 2.x may use removed APIs (task 20, 28); check the core version first.
- IDF support policy: each major/minor is supported 30 months from the initial stable release (12 months service + 18 months maintenance) per the IDF versions page; specific end-of-life dates were not on the page, see the IDF support-period chart.

Source: https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html , https://raw.githubusercontent.com/platformio/platform-espressif32/develop/platform.json , https://raw.githubusercontent.com/pioarduino/platform-espressif32/main/README.md , https://docs.espressif.com/projects/esptool/en/latest/esp32/migration-guide.html , https://docs.micropython.org/en/latest/reference/mpremote.html , https://raw.githubusercontent.com/adafruit/circuitpython/main/ports/espressif/README.rst , https://docs.wokwi.com/getting-started/supported-hardware , https://github.com/esphome/esp-web-tools , https://docs.espressif.com/projects/esp-idf/en/stable/esp32/versions.html

---

## APPENDIX A. Things most likely to trip a writer working from older knowledge

Arduino-ESP32 (2.x habits that break on 3.x; 3.0 = IDF 5.1, 3.3 = IDF 5.5):
1. LEDC: `ledcSetup(ch, f, bits)` + `ledcAttachPin(pin, ch)` + `ledcWrite(ch, duty)` -> `ledcAttach(pin, f, bits)` + `ledcWrite(PIN, duty)` (channel auto-assigned; `ledcDetachPin` -> `ledcDetach(pin)`; `ledcAttachChannel` if you need to pick a channel).
2. Hardware timers: `timerBegin(num, prescaler, countUp)`, `timerAlarmWrite/Enable`, 3-arg `timerAttachInterrupt` -> `timerBegin(frequency)`, `timerAttachInterrupt(t, fn)`, `timerAlarm(t, value, autoreload, count)`.
3. ESP-NOW (raw API): receive callback `(const esp_now_recv_info_t*, const uint8_t*, int)`; send callback is `(const esp_now_send_info_t*, status)` on IDF >= 5.5 (core 3.3.x) vs `(const uint8_t *mac, status)` before; old 2.x `(const uint8_t *mac, const uint8_t *data, int len)` receive form is gone.
4. Wi-Fi events: `SYSTEM_EVENT_STA_GOT_IP` -> `ARDUINO_EVENT_WIFI_STA_GOT_IP`; callback `(WiFiEvent_t, WiFiEventInfo_t)` where `info.got_ip.ip_info.ip.addr`; event IDs are renumbered.
5. `WiFiClientSecure` -> class `NetworkClientSecure` (alias kept); `WiFiClient` -> `NetworkClient` (alias kept). 3.3.12 adds `useBuiltinCACertBundle()`.
6. I2S: `#include <I2S.h>` / `driver/i2s.h` removed; use `ESP_I2S.h` + `I2SClass i2s;`. Write with `i2s.write(&sample, sizeof(sample))`.
7. `hallRead()` removed (no Hall sensor in the table for any chip); `analogSetClockDiv`, `adcAttachPin`, `analogSetVRefPin` removed; `touchSetCycles` replaced by `touchSetTiming` on IDF >= 5.5 cores.
8. `neopixelWrite()` is deprecated: use `rgbLedWrite()` (since 3.0.5/3.1.0). The generic `esp32` variant has NO `LED_BUILTIN`; S2/S3/C3/C6 DevKit variants define `LED_BUILTIN`/`RGB_BUILTIN` as the RGB LED.
9. BLE: `std::string` APIs became Arduino `String`, `BLEScan::start()` returns `BLEScanResults*`; since 3.3.0 non-ESP32 chips use NimBLE under the same API; **4.0.0-RC1 replaces `BLEDevice` with `#include <BLE.h>` and a global `BLE`** (see `libraries/BLE/MIGRATION.md`).
10. ADC: no `ADC_12db` in the Arduino enum (IDF's `ADC_ATTEN_DB_12` is the new name of `_DB_11`); ESP32 default attenuation is `ADC_11db`; ADC2 pins conflict with Wi-Fi on classic ESP32.
11. `ARDUINO_ISR_ATTR` is empty unless `CONFIG_ARDUINO_ISR_IRAM`: write `IRAM_ATTR` on ISRs.
12. Serial on native-USB chips (S2/S3/C3/C6/H2): depends on "USB CDC On Boot"; `Serial` may be `HWCDCSerial`/`USBSerial`, UART0 is `Serial0`.
13. WebServer in 3.3.12 rejects over-long URIs/headers and its `authenticate()` accepts only Basic/Digest.
14. ArduinoJson 7: `JsonDocument` (no capacity), `StaticJsonDocument`/`DynamicJsonDocument` deprecated.
15. PlatformIO's official espressif32 platform is still Arduino 2.0.17; use pioarduino for 3.x.
16. TWAI/CAN, PCNT, motor PWM: no Arduino wrapper (chip table "-"); use the IDF API.

MicroPython (1.29 vs older tutorials):
17. `network.WLAN(network.STA_IF)` still works, new form `network.WLAN(network.WLAN.IF_STA)`; `ap.config(essid=..., authmode=network.AUTH_WPA_WPA2_PSK, password=...)` -> `ssid=`, `security=network.WLAN.SEC_WPA_WPA2`, `password=`; module `AUTH_*` constants are not defined on ESP32 any more; `wlan.ifconfig()` deprecated -> `ipconfig()`; `network.hostname("name")`.
18. `Pin.irq` on ESP32 has no `hard=`; handlers are scheduled (soft). `Timer(hard=True)` raises ValueError.
19. `import vfs` (not `uos.mount`); `requests`/`urequests`, `umqtt.simple/robust`, `dht`, `ds18x20`, `onewire`, `neopixel`, `ntptime`, `aioespnow` are frozen into official ESP32 builds: no `mip install` needed.
20. `requests` HTTPS does not verify certificates (CERT_NONE).
21. ADC: `ADC(Pin(n), atten=ADC.ATTN_11DB)`, `read_u16()`, `read_uv()`; `adc.read()`/`atten()`/`width()` are legacy.
22. No machine.CAN / TWAI on ESP32; `machine.USBDevice` only since 1.25.0 and only on chips with USB-OTG (S2/S3/P4).
23. ESP-NOW max payload is 250 bytes on v1 and 1470 on v2 (check `espnow.MAX_DATA_LEN`).
24. time epoch on ESP32 is 2000-01-01 (not 1970); `ntptime.settime()` sets UTC; no time-zone support.
25. Official MicroPython images have no OTA partitions (use the `OTA` build variant); `machine.Timer(-1)` virtual timers exist in the code though the quickref text says otherwise.

ESP-IDF names (6.x): legacy `driver/adc.h`, `timer.h`, `i2s.h`, `rmt.h`, `pcnt.h`, `mcpwm.h`, `dac.h`, `sigmadelta.h` REMOVED; legacy `driver/i2c.h` end-of-life; legacy `driver/twai.h` deprecated (new node API `twai_new_node_onchip`); `esp-mqtt` is a managed component `espressif/mqtt`; the built-in `json` is gone (`espressif/cjson`); `esp_sleep_get_wakeup_cause()` is deprecated for `esp_sleep_get_wakeup_causes()` in 6.1; `esp_sleep_enable_ext1_wakeup()` documented as to-be-deprecated for `..._ext1_wakeup_io()`; `ESP_EXT1_WAKEUP_ALL_LOW` exists only on the classic ESP32.

---

## APPENDIX B. What I could NOT confirm (UNVERIFIED list, collected)

- Nothing in this crib was compiled or run on hardware.
- Exact first core release of `rgbLedWrite` (commit 2024-08-28, thus 3.0.5/3.1.0; tag not checked).
- ADC top-range voltage on classic ESP32: Arduino docs say 150-3100 mV for ADC_11db, MicroPython docs say 150-2450 mV; IDF docs refer to the datasheet.
- Whether the Arduino ADC docs' ADC2/Wi-Fi restriction applies on chips other than classic ESP32.
- MicroPython `machine.Timer(-1)` actual behavior on ESP32 (code present, docs say unsupported).
- `wlan.ipconfig(addr4=...)` static-IP call: whether `dhcp4=False` is needed first.
- The final intended behavior of BT Classic/Bluedroid in Arduino-ESP32 4.0 (README says dropped, RC1 tree still contains BluetoothSerial and a Bluedroid backend).
- Zigbee API changes between 3.3.x and 4.0.0-RC1 (Zigbee SDK v2.0 migration); whether RainMaker/Insights are functional in 4.0.0-RC1.
- Library compatibility with core 3.x for: LiquidCrystal_I2C variants, WiFiManager 2.0.17, touch libraries (XPT2046/FT6336/GT911/CST816S names), esp_lvgl_port, aioble API forms, `usb-device-*` mip package names, ESP-IDF registry component names for 1-Wire/DS18B20/LED strip.
- Which Library Manager version of TFT_eSPI is served (V2.5.43 vs master fixes); TFT_eSPI on C6/H2/P4.
- Wokwi per-peripheral coverage; ESP Web Tools browser support list; Thonny's firmware-install helper; ESPHome/Tasmota/WLED supported-chip lists; CircuitPython status of ESP32-C5/C61.
- IDF 6.1 `esp_netif_sntp_*` signatures; ESP-IDF EOL dates.
- Which newer ESP32 chips have a CAN-FD-capable TWAI controller.
- WebFetch summaries were wrong on dates, so every date in the versions table comes from the GitHub releases API or git tags; the "published" date of ESP Web Tools 10.4.0 was not checked.


## APPENDIX C. Corrections found while the pages were being written (2026-10-04)

- **LEDC timer width** (ESP-IDF 5.5 `SOC_LEDC_TIMER_BIT_WIDTH`): 20 bits on the ESP32, C6, H2, C5, C61 and P4; **14 bits**
  on the S2, S3, C3 and C2. `ledcAttach(pin, 50, 16)` fails on an S3 or C3. A servo at 50 Hz uses 14 bits or fewer
  when the program is meant for any chip. LEDC channels: 16 on the ESP32, 8 on the S2, S3 and P4, 6 on the C and H series.
- **DNSServer in core 3.3.x** answers from an asynchronous callback: `dnsServer.start(53, "*", ip)` is enough, and
  `processNextRequest()` is an empty stub kept for old sketches (calling it does no harm and nothing).
- **Wi-Fi long-range mode**: Arduino `WiFi.enableLongRange(true)` before `WiFi.mode(...)`; MicroPython
  `wlan.config(protocol=network.WLAN.PROTOCOL_LR)` (older spelling `network.MODE_LR`); not on the ESP32-C2.
- **MicroPython static address** (1.29): `wlan.ipconfig(addr4='192.168.1.50/24', gw4='192.168.1.1')` switches DHCP off
  by itself; the DNS server is module-level — `network.ipconfig(dns='1.1.1.1')`, read with `network.ipconfig('dns')`.
- **FTM and CSI** (from the IDF capability headers): fine timing measurement on the C2, C3, C5, C6, C61, S2, S3 — not
  on the original ESP32; channel state information on the ESP32, C3, C5, C6, C61, S2, S3 — not on the C2.
- **M5Unified / UIFlow** have no section above: programs for M5Stack hardware are written from the library's own
  well-known calls (`M5.begin()`, `M5.update()`, `M5.BtnA.wasPressed()`, `M5.Display…`) and say that they need the
  M5Unified library.
- **Block notation**: a top-level `every (5) seconds` line is an event (a hat); `every (5) seconds do … end` is a C block.
- **The ESP32's ADC range at 11/12 dB attenuation**: the datasheet specifies 150–2450 mV; the Arduino documentation's
  table says 150–3100 mV. Both are "true": the converter keeps reading to about 3.1 V but outside 2.45 V the error
  grows. Pages say "specified from 0.15 to 2.45 V; it keeps reading to about 3.1 V, less and less accurately".
- **SPI.begin** takes `(sck, miso, mosi, ss)`; `ss` may be left out (`SPI.begin(sck, miso, mosi)`) when chip select is
  an ordinary pin driven by the sketch or the library.
- **ArduinoJson 7** removed `JsonDocument::memoryUsage()`, `capacity()` and the `JSON_OBJECT_SIZE()` family: the
  document grows by itself. To see what a parse costs, read `ESP.getFreeHeap()` before and after.
- **RMT** (ESP-IDF `soc_caps.h`): the ESP32-C2 and the ESP32-C61 have no RMT peripheral (the note in section 2 that
  the C2 has one is wrong); the C61 has I2S but no pulse counter, motor PWM or TWAI. WS2812 strips on those chips
  are driven by SPI or bit-banging libraries.
- **Names the core already uses** (found by compiling): a sketch cannot declare its own `RX`, `TX`, `SDA`, `SCL`, `SS`,
  `MOSI`, `MISO`, `SCK`, `BOOT_PIN`, `LED_BUILTIN` or `A0…` — the core defines them. Use `PIN_RX`, `PIN_BOOT` and so on.
- **ESP_I2S** `write()` takes bytes: `i2s.write((uint8_t *)samples, sizeof(samples))`.
- **Arduino_GFX** (GFX Library for Arduino 1.6): the colour constants are `RGB565_BLACK`, `RGB565_RED` …; the bare
  `BLACK`, `RED` of older versions no longer exist.
- **MicroPython**: `int.from_bytes(b, 'big')` has no `signed` argument (fold the sign yourself); `bluetooth` exports
  `FLAG_READ`, `FLAG_WRITE`, `FLAG_NOTIFY`, `FLAG_INDICATE`, `FLAG_WRITE_NO_RESPONSE` only — the encrypted and
  authenticated flags (0x0200 …) are numbers you define from the documentation.
- **The built-in CA bundle on any 3.x core** (built on 3.3.7): `useBuiltinCACertBundle()` exists only from 3.3.12.
  The form that works everywhere is
  `extern const uint8_t ca_bundle_start[] asm("_binary_x509_crt_bundle_start"); extern const uint8_t ca_bundle_end[] asm("_binary_x509_crt_bundle_end");`
  and `client.setCACertBundle(ca_bundle_start, ca_bundle_end - ca_bundle_start);`.
- **Matter helpers**: `matterWaitUntilReady()` and `matterRestartIfNoFabric()` (MatterHelpers.h) exist from core 3.3.12;
  a page that uses them says "core 3.3.12 or later" in `needs`.
- **Arduino_GFX and the core version** (built both ways): GFX Library for Arduino 1.6.4 builds with the Arduino core
  3.3.3 and fails with 3.3.7 (`spiFrequencyToClockDiv` gained a first argument in the core); the library's current
  release has both forms. A page that uses the library tells the reader to keep it up to date.
- **MAX7219 on an ESP32**: the LedControl library includes `avr/pgmspace.h` and does not compile for the ESP32. Write
  the chip's registers over SPI (two bytes: register, value) or use MD_MAX72XX / MD_Parola for matrices.
- **A global named `bars`** (and other short, common names) can collide with a symbol inside the Wi-Fi libraries at
  link time ("multiple definition"): give globals specific names or make them `static`.
- **Big libraries need the Huge APP partition scheme**: an internet radio with ESP32-audioI2S is about 1.9 MB.
