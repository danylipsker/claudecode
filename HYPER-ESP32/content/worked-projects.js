/* HYPER-ESP32 · content/worked-projects.js
 *
 * Worked projects, the first seven (the other seven are in a second file): each page is a small design document —
 * requirements with numbers, the chip and why, the circuit and its pins, the behaviour as a state machine, the program
 * in blocks, Arduino C++ and MicroPython, the power budget, and what to test and extend.
 *
 *   project-weather-station   an ESP32-C3 that sleeps ten minutes at a time and reports over Wi-Fi and MQTT
 *   project-thermostat        an ESP32-S3 touch panel, hysteresis control and a relay (mains)
 *   project-plant-watering    a capacitive soil probe, a pump through a MOSFET and safety time-outs
 *   project-doorbell-camera   an ESP32-S3 camera board that wakes on the button, photographs and uploads
 *   project-esp-now-sensors   battery nodes on ESP-NOW and a gateway on the router's channel
 *   project-ble-presence      a scanner that notices a known beacon coming and going
 *   project-energy-monitor    an isolated metering module read over a serial port (mains)
 */
Hyper.add(
/* ================================================================ project-weather-station */
{
  id: 'project-weather-station',
  parent: 'worked-projects',
  title: 'A weather station that sleeps',
  level: 2,
  short: 'A battery sensor that spends 99 % of its life asleep: every ten minutes it wakes, reads temperature and humidity, tells an MQTT broker and sleeps again. The whole design comes from one number, the average current.',
  keywords: ['weather station', 'battery sensor', 'deep sleep', 'MQTT', 'SHT31', 'XIAO ESP32C3', 'ESP32-C3', 'duty cycle', 'battery life', 'retained message', 'worked project', 'temperature and humidity', 'wake and send'],
  prereq: ['deep-sleep', 'mqtt', 'wifi-station', 'battery-life-budget'],
  related: ['fast-wifi-reconnect', 'the-board-is-not-the-chip', 'measuring-battery-level', 'lithium-cells', 'humidity-and-pressure-sensors', 'i2c', 'json-on-a-microcontroller', 'soc-esp32-c3', 'from-idea-to-requirements', 'block-diagrams', 'project-esp-now-sensors'],
  body: `A weather station is the classic battery sensor. It wakes every ten minutes for about four seconds, tells the home network what it measured, and goes back to sleep. Nearly every decision follows from that rhythm. This page walks the seven parts that every worked project has: requirements, chip, circuit, behaviour, program, power, tests.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Measures | air temperature (±0.5 °C is plenty), relative humidity (±3 %RH), battery voltage |
| Reports | every 10 minutes to an MQTT broker on the home network; the broker keeps the last value (a *retained* message) |
| Runs on | one protected 18650 Li-ion cell of 3000 mAh class, **at least six months** without sunshine |
| Lives | in a shaded, ventilated box outdoors, with Wi-Fi at −70 dBm or better |
| Never | transmits when the cell is below 3.3 V: the radio's current peaks would crash it ([[brownout]]) |

### 2. The chip, and why

Asked for Wi-Fi and a battery, [the project advisor](#/tools/advisor) ranks the **ESP32-C3** first (score 99), then the ESP32-C2 (96, but fewer pins and Wi-Fi limited to 20 MHz channels), the ESP32-C6 (93: Wi-Fi 6 buys nothing here) and the ESP32-S3 (92). It rules out the H2, H4, H21 and P4: they have no Wi-Fi radio. The C3 sleeps at 5 µA, runs on one 3.0–3.6 V rail, and costs little. The board is the advisor's first suggestion, the **Seeed Studio XIAO ESP32C3**: native USB, a LiPo charger on the board, 11 pins. See [[soc-esp32-c3]]; and remember that the *board* decides the sleep current, not the chip ([[the-board-is-not-the-chip]]).

### 3. The circuit

The simulation below draws the block diagram. The pins come from [the pin planner](#/tools/pinout/plan) for this board: no strapping pin, and an ADC channel that works with Wi-Fi.

| Part | Board pin | GPIO | Note |
|---|---|---|---|
| SHT31 SDA | D4 | 6 | I2C; most breakout modules carry the pull-ups |
| SHT31 SCL | D5 | 7 | |
| Battery divider, middle | D1 | 3 | ADC1 channel 3; two 1 MΩ resistors from the cell's + pad to ground, 100 nF across the lower one |
| Cell | BAT pads | | through the charger on the board ([[battery-chargers]]) |

Two million ohms draws only 2 µA from a 4.2 V cell, which matters when the chip itself sleeps at 5 µA. So much resistance needs the capacitor, or the ADC's sampling pulls the voltage down ([[measuring-battery-level]]).

### 4. The behaviour as a state machine

The program is four states, entered once per wake-up: **SLEEPING**, **READING**, **CONNECTING**, **SENDING**. Every wait has a time-out, and every time-out ends in SLEEPING after counting a failure: a node that cannot reach the broker must not stay awake trying, because staying awake is what empties the cell. One guard watches the battery: below 3.3 V the radio is skipped. In the simulation the events are buttons, or play by themselves; the clock runs fast so that ten minutes pass in seconds. See [[state-machine-in-code]] and [[timeouts-and-timed-states]]. The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The program

Below, in blocks, Arduino C++ and MicroPython. The SHT31 is read straight over I2C (one command, six bytes, two formulas), so no library is needed. The message is a small JSON object ([[json-on-a-microcontroller]]) published *retained* ([[mqtt-topics-qos-retain]]). PubSubClient publishes at QoS 0, so the node cannot know the broker received it; the failure counter, kept in RTC memory across sleeps ([[rtc-memory]]), is published with the next reading instead. The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power budget

Phases of one wake-up (the figures are assumptions: measure yours, [[measuring-current]]), with 35 µA asleep for the whole board:

| Phase | Time | Current |
|---|---|---|
| Boot and read the sensor | 0.3 s | 20–35 mA |
| Wi-Fi scan, connect, DHCP | 3.5 s | 95 mA |
| MQTT connect and publish | 0.5 s | 120 mA |
| Shut down | 0.1 s | 35 mA |

That averages **0.71 mA: 126 days**, short of the six months. Three changes, tried in [the battery calculator](#/tools/espcalc/battery): keep the channel and access point in RTC memory so the connect takes 1.3 s (0.36 mA, 224 days, see [[fast-wifi-reconnect]]); choose a board that really sleeps at 35 µA and not 150 µA (178 days even with the fast connect); or report every 30 minutes (439 days). The radio, not the sleep, is most of the bill.

> [!warn] The cell. Charge a lithium cell only through a charger IC with protection, never from a GPIO or a bare supply; a swollen, punctured or shorted cell burns. Do not charge below 0 °C: most small charger boards have no cell-temperature input.

### 7. What to test, what goes wrong first, how to extend

Watch the first wake with a USB power meter or a current profiler, not the serial monitor. What goes wrong first: the cell sags in the cold and the radio browns out on connect; the sensor sits next to the board and reads its warmth; the router changes channel and the cached connect fails (the program must clear the cache and fall back to a scan). Extend with pressure (a BMP280 on the same bus), a rain gauge on a wake pin, a small solar panel through a proper charger, or an over-the-air update window once a day ([[ota-updates]]).

> [!key] A battery node is its duty cycle: sleep current times almost all of the time, plus a few seconds of radio. Choose the chip, the board and the connect strategy by that average, give every wait a time-out that returns to sleep, and let the numbers, not hope, say how long it lasts.`,
  ideas: [
    'The average current is the design: a few seconds of radio at about 100 mA each wake-up outweigh a sleep of tens of microamps.',
    'Every wait has a time-out that ends in sleep; a node that cannot reach the broker gives up and counts a failure.',
    'A cached channel and access point shorten the Wi-Fi connect and can double the battery life.',
    'A retained MQTT message lets a dashboard that starts later show the last reading at once.'
  ],
  pitfalls: [
    'The chip sleeps at 5 µA, so the node will last for years — The board adds a regulator, a charger and LEDs, and the Wi-Fi connect uses most of the charge. Compute the average of the whole cycle, not the sleep alone.',
    'Reading the battery with two 100 kΩ resistors is fine — They draw 21 µA all the time, four times the chip\'s sleep current. Use megaohms and a capacitor, or switch the divider from a pin.',
    'If it connected once it will connect every time — A cached channel is wrong the day the router changes channel. Clear it after a failed connect.'
  ],
  terms: [
    { term: 'Duty cycle', also: ['duty factor'], def: 'The fraction of time a device is active. A node awake four seconds in every 600 has a duty cycle of 0.7 %, yet that part uses most of its charge.' },
    { term: 'Retained message', also: ['MQTT retain'], def: 'An MQTT message the broker stores and hands to every new subscriber of its topic, so a late dashboard sees the last value without waiting for the next report.' },
    { term: 'Quiescent current', also: ['standby current', 'sleep current of the board'], def: 'What a board draws while the chip sleeps: the chip\'s own few microamps plus the regulator, the charger, LEDs, a divider and any sensor left powered.' },
    { term: 'Brownout', also: ['supply dip'], def: 'A dip of the supply voltage below the level at which the chip can run, usually caused by a current peak of the radio on a weak or cold battery; the chip resets.' }
  ],
  choose: {
    good: ['Readings every few minutes that a dashboard or Home Assistant collects', 'A place with Wi-Fi coverage and no mains socket', 'A first project that teaches deep sleep, MQTT and a power budget together'],
    avoid: ['Readings every few seconds: the radio cost per report then dominates, use a mains supply', 'Far corners of the garden with no Wi-Fi: use ESP-NOW to a relay or LoRa', 'Freezing sites without a cell that is rated for the cold'],
    check: ['The whole board\'s sleep current, measured', 'The connect time with your router', 'The cell voltage at the end of the cold night, not on the bench']
  },
  code: [
    {
      title: 'Wake, read, publish, sleep',
      about: 'Each wake-up reads an SHT31 and the battery, connects to Wi-Fi, publishes one retained JSON message and goes back to deep sleep. Every failure counts and sleeps at once; a low cell skips the radio.',
      needs: 'A Seeed Studio XIAO ESP32C3, an SHT31 module at address 0x44, a 3.7 V cell on the BAT pads, two 1 MΩ resistors and 100 nF; an MQTT broker; the PubSubClient library for Arduino. Do not leave real credentials in shared code ([[credentials-handling]]).',
      wiring: [['GPIO6 (D4)', 'SHT31 SDA', 'I2C'], ['GPIO7 (D5)', 'SHT31 SCL', 'I2C'], ['GPIO3 (D1)', 'middle of the 1 MΩ + 1 MΩ divider on the cell', '100 nF to GND'], ['3V3 / GND', 'SHT31 power']],
      libs: ['PubSubClient'],
      blocks: `
        when started
          start I2C on SDA (6) SCL (7)
          set [vbat v] to (((analog read pin (3) in millivolts) * (2)) / (1000))
          I2C write (0x24 0x00) to address (0x44)
          wait (0.02) seconds
          set [raw v] to (I2C read (6 bytes) from address (0x44))
          set [t v] to ((-45) + (((175) * (word (1) of (raw))) / (65535)))
          set [rh v] to (((100) * (word (2) of (raw))) / (65535))
          if <(vbat) ≥ (3.3)> then
            connect to Wi-Fi [your-ssid] password [your-password]
            wait until <Wi-Fi connected?> for at most (10) seconds
            connect to MQTT broker [192.168.1.10]
            publish (join [t=] (t) [ rh=] (rh) [ vbat=] (vbat)) to topic [home/weather/garden]
          end
          deep sleep for (600) seconds
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <Wire.h>
        #include <PubSubClient.h>
        #include <esp_sleep.h>

        const char *SSID = "your-ssid", *PASS = "your-password", *BROKER = "192.168.1.10";
        const int PIN_SDA = 6, PIN_SCL = 7, PIN_VBAT = 3;          // from the pin planner, XIAO ESP32C3
        const uint8_t SHT = 0x44;
        const uint64_t SLEEP_US = 600ULL * 1000000ULL;             // ten minutes
        RTC_DATA_ATTR uint32_t failures = 0;                       // survives deep sleep

        NetworkClient net;
        PubSubClient mqtt(net);

        bool readSht31(float &t, float &rh) {
          Wire.beginTransmission(SHT);
          Wire.write(0x24); Wire.write(0x00);                      // one measurement, high repeatability
          if (Wire.endTransmission() != 0) return false;
          delay(20);                                               // the sensor needs up to 15 ms
          if (Wire.requestFrom(SHT, (size_t)6) != 6) return false;
          uint16_t rawT = (Wire.read() << 8) | Wire.read(); Wire.read();   // third byte is a CRC
          uint16_t rawH = (Wire.read() << 8) | Wire.read(); Wire.read();
          t = -45.0f + 175.0f * rawT / 65535.0f;
          rh = 100.0f * rawH / 65535.0f;
          return true;
        }

        void sleepNow(bool failed) {
          if (failed) failures++;
          WiFi.disconnect(true);
          esp_sleep_enable_timer_wakeup(SLEEP_US);
          esp_deep_sleep_start();                                  // restarts in setup()
        }

        void setup() {
          Wire.begin(PIN_SDA, PIN_SCL);
          float vbat = 2.0f * analogReadMilliVolts(PIN_VBAT) / 1000.0f;   // 1:1 divider
          float t, rh;
          if (!readSht31(t, rh)) sleepNow(true);
          if (vbat < 3.3f) sleepNow(false);                        // save the cell: no radio
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 10000) delay(50);
          if (WiFi.status() != WL_CONNECTED) sleepNow(true);
          mqtt.setServer(BROKER, 1883);
          if (!mqtt.connect("weather-garden")) sleepNow(true);
          char msg[96];
          snprintf(msg, sizeof(msg), "{\"t\":%.2f,\"rh\":%.1f,\"vbat\":%.2f,\"fail\":%lu}", t, rh, vbat, (unsigned long)failures);
          mqtt.publish("home/weather/garden", msg, true);          // retained
          mqtt.loop();
          delay(50);
          mqtt.disconnect();
          sleepNow(false);
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, network, time
        from machine import Pin, I2C, ADC
        from umqtt.simple import MQTTClient

        SSID, PASS, BROKER = "your-ssid", "your-password", "192.168.1.10"
        PIN_SDA, PIN_SCL, PIN_VBAT = 6, 7, 3        # from the pin planner, XIAO ESP32C3
        SHT = 0x44
        SLEEP_MS = 600_000                          # ten minutes

        rtc = machine.RTC()
        failures = int.from_bytes(rtc.memory() or b"\x00\x00", "little")   # survives deep sleep

        def sleep_now(failed):
            if failed:
                rtc.memory((failures + 1).to_bytes(2, "little"))
            network.WLAN(network.WLAN.IF_STA).active(False)
            machine.deepsleep(SLEEP_MS)             # restarts main.py

        def read_sht31(i2c):
            i2c.writeto(SHT, b"\x24\x00")           # one measurement, high repeatability
            time.sleep_ms(20)                       # the sensor needs up to 15 ms
            d = i2c.readfrom(SHT, 6)                # bytes 2 and 5 are CRCs
            t = -45 + 175 * ((d[0] << 8) | d[1]) / 65535
            rh = 100 * ((d[3] << 8) | d[4]) / 65535
            return t, rh

        i2c = I2C(0, scl=Pin(PIN_SCL), sda=Pin(PIN_SDA))
        vbat = 2 * ADC(Pin(PIN_VBAT), atten=ADC.ATTN_11DB).read_uv() / 1_000_000   # 1:1 divider
        try:
            t, rh = read_sht31(i2c)
        except OSError:
            sleep_now(True)
        if vbat < 3.3:
            sleep_now(False)                        # save the cell: no radio
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        t0 = time.ticks_ms()
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 10000:
            time.sleep_ms(50)
        if not wlan.isconnected():
            sleep_now(True)
        try:
            c = MQTTClient("weather-garden", BROKER, keepalive=30)
            c.connect()
            msg = '{"t":%.2f,"rh":%.1f,"vbat":%.2f,"fail":%d}' % (t, rh, vbat, failures)
            c.publish(b"home/weather/garden", msg.encode(), retain=True)
            c.disconnect()
        except OSError:
            sleep_now(True)
        sleep_now(False)
      `,
      output: `
        (on the broker, topic home/weather/garden, retained)
        {"t":18.42,"rh":63.1,"vbat":3.94,"fail":0}
      `,
      notes: ['The pattern is one wake-up per run: deep sleep restarts the program from the top, so there is no loop.', 'To cache the channel and access point, store WiFi.channel() and WiFi.BSSID() in RTC memory and pass them to WiFi.begin(); MicroPython has no equivalent for the channel. Clear the cache after a failed connect.', 'The SHT31 sends a CRC byte after each value; check it before trusting a reading ([[reading-sensors-reliably]]).']
    }
  ],
  examples: [
    {
      title: 'Does it last six months?',
      q: 'A node is awake 4.4 s in every 600 s at an average of 85 mA and asleep at 35 µA, on a 3000 mAh cell of which 80 % is usable and which loses 2 % of its charge a month. How long does it last, and what does cutting the awake time to 2.2 s do?',
      steps: ['Average current: $0.035 + (85 - 0.035) \\times 4.4 / 600 = 0.66$ mA.', 'Usable charge: $0.8 \\times 3000 = 2400$ mAh. Self-discharge of 2 % a month is $60 / 720 = 0.083$ mA, added to the load: 0.74 mA.', 'Life: $2400 / 0.74 = 3240$ h, about 135 days.', 'With 2.2 s awake the average falls to 0.35 mA, the draw to 0.43 mA and the life to about 233 days.'],
      a: 'About 135 days, short of six months. Halving the time awake nearly doubles the life, which is why the connect time is the first thing to work on.'
    }
  ],
  quiz: [
    { q: 'A node sleeps at 35 µA and is awake for 4 s at 90 mA every 10 minutes. Which part uses more charge?', choices: ['The sleep, because it lasts 99 % of the time', 'The four seconds awake', 'They are about equal', 'Neither: the sensor does'], a: 1, why: 'Awake: 90 mA × 4 s = 360 mA·s. Asleep: 0.035 mA × 596 s = 21 mA·s. The short burst is more than ten times larger.' },
    { q: 'Why does the program publish with the retain flag?', choices: ['So that the message is encrypted', 'So that a dashboard that starts later still shows the last reading', 'So that the broker acknowledges it', 'So that the node need not sleep'], a: 1, why: 'A retained message is stored by the broker and sent to each new subscriber. It does not encrypt or acknowledge anything.' },
    { q: 'The cell reads 3.2 V at wake-up. What does the program do, and why?', choices: ['It transmits anyway', 'It sleeps without the radio, because the transmit peak would brown out a weak cell', 'It switches to ESP-NOW', 'It erases the failure counter'], a: 1, why: 'A cell that low sags further under the radio\'s current peak, which resets the chip in the middle of the connect. Skipping the radio saves what is left.' },
    { q: 'A divider of two 100 kΩ resistors is used to read the cell. What is wrong?', choices: ['Nothing', 'It draws about 21 µA all the time, several times the chip\'s sleep current', 'It cannot be read by an ADC', 'It needs a 5 V supply'], a: 1, why: '4.2 V across 200 kΩ is 21 µA. Two 1 MΩ resistors cost 2 µA, with a capacitor to steady the ADC.' }
  ],
  applications: [
    'Garden, greenhouse and cellar sensors that feed Home Assistant or a dashboard.',
    'The pattern behind commercial battery sensors: wake, measure, send, sleep.',
    'A test bed for the cost of every second of radio: change the connect strategy and watch the budget move.'
  ],
  sources: [
    'Espressif, *ESP32-C3 Series Datasheet*: the current consumption tables (deep sleep, receive, transmit).',
    'Sensirion, *SHT3x-DIS datasheet*: the single-shot commands, the conversion formulas and the CRC.',
    'OASIS, *MQTT Version 3.1.1*: the retain flag and the quality-of-service levels.'
  ],
  sim: 'wp-weather'
},
/* ================================================================ project-thermostat */
{
  id: 'project-thermostat',
  parent: 'worked-projects',
  title: 'A touch-screen thermostat',
  level: 3,
  short: 'A wall panel with a 4 inch touch screen that holds a room at a temperature by closing a relay. The interesting part is not the screen but the rules that protect the boiler and the house when something fails.',
  keywords: ['thermostat', 'touch screen', 'LVGL', 'hysteresis', 'relay', 'ESP32-S3', 'ESP32-4848S040', 'heating control', 'short cycling', 'volt-free contact', 'fail safe', 'worked project', 'SHT31', 'wall panel'],
  prereq: ['on-off-control-and-hysteresis', 'relays', 'lvgl', 'state-machine-in-code'],
  related: ['thermostats', 'time-proportioning', 'switching-mains-safely', 'touch-display-boards', 'capacitive-touch-screens', 'lvgl-widgets', 'lvgl-events-and-screens', 'temperature-sensors', 'hmi-design-rules', 'safety-in-control', 'error-states-and-recovery', 'entry-exit-and-guards', 'project-esp-now-sensors', 'ntp-and-time'],
  body: `A thermostat sounds like one comparison: if it is too cold, heat. The comparison is the easy part. A real one must not click the relay ten times a minute, must not heat for ever if a sensor falls off the wall, and must behave sensibly when it loses power. Most of this page is about those rules; the screen only shows them.

> [!warn] Mains voltage. The panel below has a mains supply and a relay on its board, and the relay switches a heating circuit. Wiring that is work for a qualified person, inside an enclosure, following your local wiring code. A bare relay board on a desk is not a product. Flash and test the panel over USB with nothing on its mains terminals, and never open or reflash a unit that is plugged in. Where you can, let the relay close only a *volt-free* thermostat input of the boiler, which is low voltage; to switch a mains load use a certified contactor.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Holds | the room within ±0.5 °C of a setpoint from 10 to 28 °C, in 0.5 °C steps |
| Reads | the temperature every 5 s; a reading older than 10 min counts as lost |
| Protects | the boiler: heat for 4 h at most, then rest; 3 min between a stop and the next start |
| Shows | the temperature and the setpoint in large type on 480 × 480 pixels, a touch answered within a tenth of a second |
| Fails safe | a normally open contact: no power, no sensor, no heat call |

### 2. The chip, and why

For Wi-Fi, a large display, a touch screen, a relay and plenty of memory, [the project advisor](#/tools/advisor) ranks the **ESP32-S3** first (score 97). The ESP32-S2 follows at 96 but has no Bluetooth, 320 KB of RAM and at most 2 MB of PSRAM; the original ESP32 scores 87, since it drives only SPI displays well; the ESP32-S31 at 84 has software that is still in preview. The S3 has the RGB display interface and the octal PSRAM that 480 × 480 pixels in 16-bit colour needs (460 KB per frame). The advisor's first board is the **ESP32-4848S040**: 4 inch, capacitive touch, 16 MB flash, 8 MB PSRAM, and a relay. Its octal PSRAM is rated to 65 °C ambient, which a living-room wall will not reach but a panel above a radiator might.

### 3. The circuit

The pins are in the catalogue, which lists the board as what it is, an all-in-one panel:

| Signal | GPIO | Note |
|---|---|---|
| Relay 1 | 40 | driven *inverted*: low closes it; set it high first thing at start-up |
| Backlight | 38 | PWM |
| Touch controller (GT911) | SDA 19, SCL 45 | I2C; reset and interrupt are not connected |
| Temperature sensor (SHT31) | the same bus, SDA 19, SCL 45 | its address 0x44 differs from the touch controller's |
| Free pins | none documented | the RGB bus and the display's three-wire interface use the rest |

[The pin planner](#/tools/pinout/plan) is built for boards whose fixed pins are listed one by one; for this panel the colour bus is listed in groups, so the planner does not see it and may suggest pins the display uses. Read the table above instead. The panel's own heat warms a sensor inside the case, so put the sensor on a short cable away from it, or take the temperature from a radio node across the room ([[project-esp-now-sensors]]).

### 4. The behaviour as a state machine

Four states: **IDLE** (relay open), **HEATING** (relay closed), **RESTING** (open, for at least three minutes: the boiler's protection) and **NO_SENSOR** (open, with an alarm). Cold by half a degree starts the heating; warm by half a degree, or four hours, stops it. The band of one degree is the *hysteresis*: with a single threshold a noisy reading would chatter the relay ([[on-off-control-and-hysteresis]]). A stale reading sends the machine to NO_SENSOR from any state; in the picture one arrow stands for all of them. Operate it below: the room warms and cools by a simple model, or press the events yourself. The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The programs

Two, because they are two jobs. The **control core** reads the sensor, runs the machine and drives the relay, in all three languages. The **screen** is LVGL 9: a large temperature, the setpoint, and two touch buttons; it needs a build with LVGL, which official MicroPython does not have, so only blocks and C++ are given. The maker's board-support code starts the display and the touch driver; the screen program builds on it ([[lvgl-events-and-screens]], [[lvgl-widgets]]). The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power

There is no battery: the panel runs from its own supply, so the thing to budget is heat and time. Dim the backlight a little after thirty seconds, and keep the radio idle between reports ([[wifi-power-save-and-dtim]]).

### 7. What to test, what goes first, how to extend

Test with the relay contacts on a low-voltage lamp: warm the sensor with a hand and watch the band; unplug it and wait ten minutes for NO_SENSOR; cycle the power in a cold room, and check that the relay does not click at start-up. What goes wrong first: the sensor reads the panel's warmth, so the relay drops out early; a setpoint saved nowhere returns to 20 °C after every power cut ([[nvs-and-preferences]]). Extend with a weekly schedule from network time ([[ntp-and-time]]), a remote setpoint over MQTT, a frost guard that keeps 5 °C even with the sensor lost, and time-proportioning for a boiler that modulates ([[time-proportioning]]).

> [!key] A thermostat is a hysteresis band wrapped in protections: a minimum rest, a maximum run, a state for a lost sensor, and a contact that is open when nothing works. Write those as states first; the touch screen is then only a window on them.`,
  ideas: [
    'Hysteresis is a band, not a threshold: heat below setpoint minus 0.5 °C, stop above setpoint plus 0.5 °C, so noise cannot chatter the relay.',
    'A resting state of three minutes protects the boiler from short cycling, and a four-hour limit protects the house from a stuck reading.',
    'The failure states are part of the design: a lost sensor opens the relay and raises an alarm, and a normally open contact means that no power gives no heat call.',
    'The panel and the sensor are different jobs: the sensor belongs in the room, away from the panel\'s own warmth.'
  ],
  pitfalls: [
    'One threshold is enough for a thermostat — Noise of a tenth of a degree around the threshold would click the relay repeatedly. Two thresholds, a band, stop it.',
    'The screen is the hard part — The screen is a window. The rules (rest, limit, lost sensor, start-up state) are what decide whether the device is safe.',
    'Any relay board will do for the boiler — A relay that switches mains is a mains device: certified parts, an enclosure and a qualified installer. Often the boiler only needs a volt-free contact.'
  ],
  terms: [
    { term: 'Short cycling', also: ['anti-short-cycle'], def: 'Starting and stopping a heater, compressor or boiler again and again within a few minutes, which wears it out. A minimum rest time between a stop and the next start prevents it.' },
    { term: 'Volt-free contact', also: ['dry contact', 'potential-free contact'], def: 'A relay contact that carries no voltage of its own, used to close a separate low-voltage circuit such as the thermostat input of a boiler.' },
    { term: 'Fail-safe state', also: ['safe state'], def: 'The state a device takes when it loses power or a signal: for a heating call, open. Choose the contact (normally open or closed) so that failure leads to it.' },
    { term: 'Stale reading', also: ['sensor time-out'], def: 'A measurement older than the time a program is willing to trust. A control loop that keeps acting on a stale reading acts on the past.' }
  ],
  choose: {
    good: ['A heating call to a boiler with a volt-free thermostat input', 'A panel that also shows other home data on its large screen', 'A first control project: the rules fit on one page'],
    avoid: ['Switching a mains heater directly from a hobby relay board', 'A sensor inside the panel case', 'A design with no state for a lost sensor'],
    check: ['What your boiler or heater really expects on its thermostat terminals', 'The temperature rating of the display\'s memory against the wall\'s', 'What the relay does while the chip is in reset']
  },
  code: [
    {
      title: 'The control core: sensor, hysteresis, rest and limit',
      about: 'Reads an SHT31 every five seconds and runs the four-state machine. The relay is closed only in HEATING; a stale reading opens it. `adjustSetpoint()` is what the touch buttons call.',
      needs: 'An ESP32-4848S040 (single-relay version), flashed over USB with nothing on its mains terminals, and an SHT31 module on the touch panel\'s I2C bus, GPIO19 and GPIO45.',
      wiring: [['GPIO40', 'relay 1 on the board', 'inverted: low = closed'], ['GPIO19', 'I2C SDA', 'shared with the touch controller'], ['GPIO45', 'I2C SCL', 'shared with the touch controller']],
      blocks: `
        when started
          set pin (40) as [output v]
          set pin (40) to [HIGH v]          // the relay line is inverted: HIGH = open
          start I2C on SDA (19) SCL (45)
          set [setpoint v] to (20)
          set [lastGood v] to (milliseconds since start)
          go to state [IDLE v]

        every (5) seconds
          set [room v] to (read temperature on address (0x44) :: bus)
          if <(room) is a number> then
            set [lastGood v] to (milliseconds since start)
          end
          if <((milliseconds since start) - (lastGood)) > (600000)> then
            go to state [NO_SENSOR v]
          else if <<state = [IDLE v]> and <(room) < ((setpoint) - (0.5))>> then
            go to state [HEATING v]
          else if <<state = [HEATING v]> and <(room) > ((setpoint) + (0.5))>> then
            go to state [RESTING v]
          else if <<state = [NO_SENSOR v]> and <(room) is a number>> then
            go to state [IDLE v]
          end

        when entering state [HEATING v]
          set pin (40) to [LOW v]

        when entering state [IDLE v]
          set pin (40) to [HIGH v]

        when entering state [RESTING v]
          set pin (40) to [HIGH v]

        when entering state [NO_SENSOR v]
          set pin (40) to [HIGH v]

        when (180) seconds in state [RESTING v]
          go to state [IDLE v]

        when (14400) seconds in state [HEATING v]
          go to state [RESTING v]
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int PIN_RELAY = 40;                  // on-board relay, driven inverted: LOW = closed
        const int PIN_SDA = 19, PIN_SCL = 45;      // the touch panel's I2C bus, shared with the sensor
        const uint8_t SHT = 0x44;
        const float HYST = 0.5;                    // heat below setpoint - 0.5, stop above setpoint + 0.5
        const uint32_t MIN_OFF_MS = 3UL * 60 * 1000, MAX_ON_MS = 4UL * 3600 * 1000, STALE_MS = 10UL * 60 * 1000;

        enum State { IDLE, HEATING, RESTING, NO_SENSOR };
        State state = IDLE;
        float setpoint = 20.0, roomTemp = NAN;
        uint32_t enteredAt = 0, lastGood = 0, lastRead = 0;

        void go(State s) {
          state = s;
          enteredAt = millis();
          digitalWrite(PIN_RELAY, s == HEATING ? LOW : HIGH);   // closed only in HEATING
          Serial.printf("state %d, room %.1f, setpoint %.1f\n", (int)s, roomTemp, setpoint);
        }
        void adjustSetpoint(float delta) { setpoint = constrain(setpoint + delta, 10.0f, 28.0f); }
        bool isHeating() { return state == HEATING; }

        bool readTemperature(float &t) {
          Wire.beginTransmission(SHT);
          Wire.write(0x24); Wire.write(0x00);                   // one measurement, high repeatability
          if (Wire.endTransmission() != 0) return false;
          delay(20);
          if (Wire.requestFrom(SHT, (size_t)6) != 6) return false;
          uint16_t raw = (Wire.read() << 8) | Wire.read();
          for (int i = 0; i < 4; i++) Wire.read();              // CRC and humidity: not used here
          t = -45.0f + 175.0f * raw / 65535.0f;
          return true;
        }

        void setup() {
          pinMode(PIN_RELAY, OUTPUT);
          digitalWrite(PIN_RELAY, HIGH);                        // first thing: relay open
          Serial.begin(115200);
          Wire.begin(PIN_SDA, PIN_SCL);
          lastGood = millis();
          go(IDLE);
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastRead >= 5000) {
            lastRead = now;
            float t;
            if (readTemperature(t)) { roomTemp = t; lastGood = now; }
          }
          bool fresh = now - lastGood < STALE_MS;
          switch (state) {
            case IDLE:      if (!fresh) go(NO_SENSOR); else if (roomTemp < setpoint - HYST) go(HEATING); break;
            case HEATING:   if (!fresh) go(NO_SENSOR); else if (roomTemp > setpoint + HYST || now - enteredAt > MAX_ON_MS) go(RESTING); break;
            case RESTING:   if (now - enteredAt >= MIN_OFF_MS) go(IDLE); break;
            case NO_SENSOR: if (fresh) go(IDLE); break;
          }
        }
      `,
      py: String.raw`
        import time
        from machine import Pin, I2C

        PIN_RELAY, PIN_SDA, PIN_SCL = 40, 19, 45   # relay is inverted: low = closed
        SHT = 0x44
        HYST = 0.5                                 # heat below setpoint - 0.5, stop above setpoint + 0.5
        MIN_OFF_MS, MAX_ON_MS, STALE_MS = 3 * 60_000, 4 * 3_600_000, 10 * 60_000

        relay = Pin(PIN_RELAY, Pin.OUT, value=1)   # first thing: relay open
        i2c = I2C(0, scl=Pin(PIN_SCL), sda=Pin(PIN_SDA))
        state, setpoint, room_temp = "IDLE", 20.0, None
        entered_at = last_good = last_read = time.ticks_ms()

        def go(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            relay.value(0 if state == "HEATING" else 1)    # closed only in HEATING
            print("state", state, "room", room_temp, "setpoint", setpoint)

        def adjust_setpoint(delta):
            global setpoint
            setpoint = min(28.0, max(10.0, setpoint + delta))

        def read_temperature():
            try:
                i2c.writeto(SHT, b"\x24\x00")      # one measurement, high repeatability
                time.sleep_ms(20)
                d = i2c.readfrom(SHT, 6)
            except OSError:
                return None
            return -45 + 175 * ((d[0] << 8) | d[1]) / 65535

        go("IDLE")
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_read) >= 5000:
                last_read = now
                t = read_temperature()
                if t is not None:
                    room_temp, last_good = t, now
            fresh = time.ticks_diff(now, last_good) < STALE_MS
            held = time.ticks_diff(now, entered_at)
            if state == "IDLE":
                if not fresh: go("NO_SENSOR")
                elif room_temp is not None and room_temp < setpoint - HYST: go("HEATING")
            elif state == "HEATING":
                if not fresh: go("NO_SENSOR")
                elif room_temp > setpoint + HYST or held > MAX_ON_MS: go("RESTING")
            elif state == "RESTING":
                if held >= MIN_OFF_MS: go("IDLE")
            elif state == "NO_SENSOR":
                if fresh: go("IDLE")
            time.sleep_ms(50)
      `,
      output: `
        state 0, room nan, setpoint 20.0
        state 1, room 18.9, setpoint 20.0
        state 2, room 20.6, setpoint 20.0
        state 0, room 20.1, setpoint 20.0
      `,
      notes: ['The relay line is inverted and floats while the chip resets: the first statement of the program drives it high, and a pull-up on the board is better still.', 'The reading is a number in HEATING only after a good read, so the comparison there is safe; in IDLE the Python version checks for a missing reading first.', 'Heating that never reaches the setpoint stops at four hours and rests: that is the limit doing its job, and something worth an alarm.']
    },
    {
      title: 'The touch screen in LVGL 9',
      about: 'A large room temperature, the setpoint, the heating state and two buttons that change the setpoint by half a degree. It builds on the control core above and on the maker\'s display and touch set-up.',
      needs: 'The ESP32-4848S040 with LVGL 9 and the maker\'s board-support code (RGB panel, GT911 touch, `lv_display` and `lv_indev` set-up); call `buildThermostatScreen()` after them and keep `lv_timer_handler()` in `loop()`. Enable the 48-point font in `lv_conf.h`.',
      libs: ['lvgl'],
      blocks: `
        when started
          create label [room] at x (150) y (50) :: display
          create label [setpoint] at x (150) y (240) :: display
          create button [-] at x (40) y (380) :: display
          create button [+] at x (300) y (380) :: display

        when button [-] touched
          change [setpoint v] by (-0.5)

        when button [+] touched
          change [setpoint v] by (0.5)

        every (1) seconds
          show (join (round (room)) [ C]) at x (150) y (50)
          show (join [set ] (setpoint) [ C]) at x (150) y (240)
      `,
      cpp: String.raw`
        #include <lvgl.h>

        extern float setpoint, roomTemp;           // from the control core
        void adjustSetpoint(float delta);
        bool isHeating();

        static lv_obj_t *roomLabel, *setLabel, *stateLabel;

        static void onStep(lv_event_t *e) {
          int tenths = (int)(intptr_t)lv_event_get_user_data(e);   // +5 or -5: half a degree
          adjustSetpoint(tenths / 10.0f);
        }

        static void makeButton(const char *text, lv_align_t where, int dx, int tenths) {
          lv_obj_t *btn = lv_button_create(lv_screen_active());
          lv_obj_set_size(btn, 140, 90);
          lv_obj_align(btn, where, dx, -30);
          lv_obj_t *label = lv_label_create(btn);
          lv_label_set_text(label, text);
          lv_obj_center(label);
          lv_obj_add_event_cb(btn, onStep, LV_EVENT_CLICKED, (void *)(intptr_t)tenths);
        }

        static void refresh(lv_timer_t *timer) {
          char buf[32];
          snprintf(buf, sizeof(buf), "%.1f C", roomTemp);
          lv_label_set_text(roomLabel, buf);
          snprintf(buf, sizeof(buf), "set %.1f C", setpoint);
          lv_label_set_text(setLabel, buf);
          lv_label_set_text(stateLabel, isHeating() ? "heating" : "idle");
        }

        void buildThermostatScreen() {
          lv_obj_t *screen = lv_screen_active();
          roomLabel = lv_label_create(screen);
          lv_obj_set_style_text_font(roomLabel, &lv_font_montserrat_48, 0);
          lv_obj_align(roomLabel, LV_ALIGN_TOP_MID, 0, 50);
          setLabel = lv_label_create(screen);
          lv_obj_align(setLabel, LV_ALIGN_CENTER, 0, 20);
          stateLabel = lv_label_create(screen);
          lv_obj_align(stateLabel, LV_ALIGN_CENTER, 0, 60);
          makeButton("-", LV_ALIGN_BOTTOM_LEFT, 40, -5);
          makeButton("+", LV_ALIGN_BOTTOM_RIGHT, -40, -5);
          lv_timer_create(refresh, 1000, nullptr);      // redraw the numbers once a second
        }
      `,
      na: { py: 'LVGL is not in the official MicroPython builds: it needs a custom firmware (the lv_micropython project) with a driver for this panel. The control core above runs in MicroPython unchanged.' },
      notes: ['The large figures use the 48-point Montserrat font, which LVGL builds only when lv_conf.h says `#define LV_FONT_MONTSERRAT_48 1` (only the 14-point font is on by default).', 'Labels are updated from a timer, not from the control loop: the screen never holds up the relay logic ([[tasks]]).', 'A touch on the screen changes the setpoint in memory only; saving it to flash on every touch would wear it, so save a moment after the last touch ([[flash-wear]]).']
    }
  ],
  quiz: [
    { q: 'The setpoint is 20 °C and the band is ±0.5 °C. The machine is IDLE and the room reads 19.4 °C. What happens, and what would happen if the machine were RESTING?', choices: ['Heating starts in both cases', 'Heating starts from IDLE; RESTING first waits out its three minutes', 'Nothing happens in either case', 'The relay closes from RESTING at once'], a: 1, why: '19.4 °C is below 20 − 0.5 = 19.5 °C, so IDLE starts the heating. RESTING takes no notice of the reading until its three-minute rest is over, whatever the room does.' },
    { q: 'Why is there a band rather than a single threshold?', choices: ['To save memory', 'So that noise around the threshold cannot chatter the relay', 'Because relays need two signals', 'To make the display look steadier'], a: 1, why: 'With one threshold, a reading that jitters by 0.1 °C would toggle the relay many times a minute. A band of a degree needs a real change to switch.' },
    { q: 'The temperature sensor cable is cut. What should the thermostat do, and in which state?', choices: ['Keep the last relay state until the cable is fixed', 'Open the relay and raise an alarm, in a state of its own', 'Close the relay to be safe from frost', 'Restart every minute'], a: 1, why: 'Acting on a reading that no longer exists is acting blindly. The fail-safe state is open, with an alarm; a frost guard is a separate, deliberate feature.' },
    { q: 'The relay line of the panel is inverted and floats during reset. What is the first statement of the program, and why?', choices: ['Start the display', 'Drive the pin high so that the relay is open', 'Connect to Wi-Fi', 'Read the sensor'], a: 1, why: 'A floating inverted line may be read as "on". Driving it to the open level as early as possible keeps the heating from clicking at every start.' }
  ],
  applications: [
    'Wall thermostats for boilers, heat pumps and electric heaters that expose a volt-free input.',
    'The same machine controls a fridge, a terrarium or a brewing vessel: only the band, the rest and the limit change.',
    'Home panels such as the ESP32-4848S040 are sold as light switches and run ESPHome or openHASP with the same relay.',
    'Industrial controllers use the same protections under other names: minimum off time, maximum run time, sensor fault.'
  ],
  sources: [
    'Espressif, *ESP32-S3 Series Datasheet*: the LCD interface, the external PSRAM and its temperature rating.',
    'LVGL documentation, version 9: widgets, events and timers.',
    'Sensirion, *SHT3x-DIS datasheet*: the I2C commands and the temperature formula.'
  ],
  sim: 'wp-thermostat'
},
/* ================================================================ project-plant-watering */
{
  id: 'project-plant-watering',
  parent: 'worked-projects',
  title: 'An automatic plant waterer',
  level: 2,
  short: 'A soil probe, a small pump and a battery. Making the pump run is trivial; making sure it can never run too long, whatever breaks, is the project.',
  keywords: ['plant waterer', 'soil moisture', 'capacitive probe', 'pump', 'MOSFET', 'flyback diode', 'time-out', 'float switch', 'watchdog', 'ESP32-C3', 'deep sleep', 'irrigation', 'worked project', 'fail safe'],
  prereq: ['soil-and-water-sensors', 'mosfets-for-loads', 'deep-sleep', 'timeouts-and-timed-states'],
  related: ['switching-dc-loads', 'analog-input', 'adc-attenuation-and-calibration', 'safety-in-control', 'error-states-and-recovery', 'rtc-memory', 'battery-life-budget', 'watchdogs', 'sensor-calibration', 'project-weather-station'],
  body: `A plant waterer looks like a sensor and a switch, and it is. But the switch moves water, and water goes wrong in expensive ways: a stuck probe that reads "dry" for ever floods a shelf; a pump that keeps running after the program has crashed empties the tank onto a carpet. So the design starts at the failures. The same seven parts as every project follow.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Keeps | the soil of one pot above 30 % moisture (probe calibration, not a laboratory number) |
| Checks | every 30 minutes, with the probe powered for 0.3 s only |
| Waters | in pulses of 6 s, then waits 10 minutes for the water to spread, then measures again |
| Limits | 3 pulses a day; never more than 6 s at a time, even if the program hangs |
| Stops and alarms | when the tank is empty, the probe is unplugged or out of range, or three pulses did not help |
| Runs on | one 18650 cell for more than a year, with Wi-Fi used rarely |

### 2. The chip, and why

Asked for Wi-Fi, an analogue input and a battery, [the project advisor](#/tools/advisor) ranks the **ESP32-C3** first (94; its ADC is flagged: six channels, five usable), the ESP32-S3 second (93), the C6 (91) and the ESP32 (90). Asked *also* for "motors" the order changes: the S3 leads at 94. That is the advisor taking "motor" to mean motor-control peripherals, which a pump does not need: it needs one pin, a MOSFET and a diode. Reading the advice rather than the ranking: any of them works; the C3 on a small board is the cheapest that sleeps well. The board is the **Seeed Studio XIAO ESP32C3**.

### 3. The circuit

Pins from [the pin planner](#/tools/pinout/plan), checked against the chip's rules: the pump gate on a pin without power-up glitches, the probe on an ADC1 channel.

| Part | Board pin | GPIO | Note |
|---|---|---|---|
| Probe output | D2 | 4 | ADC1 channel 4 |
| Probe power | D10 | 10 | the probe takes about 5 mA: well within the pin's 20 mA drive; off between readings |
| Pump MOSFET gate | D1 | 3 | logic-level N-channel MOSFET, 100 Ω in series, 100 kΩ gate to ground |
| Float switch | D3 | 5 | to ground; internal pull-up; high means an empty tank |

The pump sits between the cell's + and the MOSFET's drain, with a diode across it (cathode to +) to catch the spike when the coil is switched off ([[mosfets-for-loads]], [[switching-dc-loads]]). The 100 kΩ pull-down is the first hardware safety: when the chip resets, its pins float and the pump goes off. On the C3 the ADC at the highest attenuation reads 0–2.5 V, so a probe that reads more than about 2.4 V in air needs a divider.

### 4. The behaviour as a state machine

**SLEEPING**, **MEASURING**, **WATERING**, **SOAKING** and **FAULT**. MEASURING classifies the reading: wet goes back to sleep, dry starts a pulse (while pulses are left), and no decision within three seconds (an unplugged probe, or a limit reached) is a fault. WATERING ends after six seconds, or at once when the float says the tank is empty. SOAKING is a sleep of ten minutes. FAULT is *latched*: the pump stays off until someone refills or resets. Operate it in the simulation: dry the soil, empty the tank, unplug the probe. See [[timeouts-and-timed-states]] and [[error-states-and-recovery]]. The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The program

The program has no Wi-Fi: every wake-up is a decision. The counters live in RTC memory, so they survive sleep and are cleared by a power cycle ([[rtc-memory]]). Probe calibration is two numbers, the millivolts in air and in water, which you measure ([[sensor-calibration]]). The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power budget

Waking every 30 minutes without the radio averages about 0.05 mA; a watering every second day adds 0.02 mA; a Wi-Fi report every six hours adds 0.02 mA: **0.085 mA, about 590 days** on a 3000 mAh cell (usable 80 %, 2 % self-discharge a month). Connect to Wi-Fi at *every* wake-up and it is 0.29 mA, 266 days. A pulse costs 6 s × 250 mA = 0.4 mAh: nothing, next to the radio ([[battery-life-budget]]).

### 7. What to test, what goes wrong first, how to extend

Test with a cup, not a plant: time one pulse and measure the volume; put the probe in air and in water for the two calibration numbers; pull the probe's cable out and the float up and down, and watch FAULT. What goes wrong first: the pump loses its prime or the tube kinks, the probe corrodes (a *capacitive* probe does not, a resistive one does within weeks), and the pump's start-up current drags a small cell below 3 V. Extend with the weather station's Wi-Fi report ([[project-weather-station]]), a push notification on FAULT, a second probe, or a water-use counter.

> [!key] A waterer is a pump with four independent ways of being stopped: a time limit per pulse, a limit per day, a tank sensor and a pull-down that makes a crash look like "off". Write the failures as states first; the happy path is the short part.`,
  ideas: [
    'The pump has four independent stops: the 6 s pulse limit, the daily limit, the float switch and the gate pull-down that turns a crash into "off".',
    'Water in pulses and wait between them: soil needs minutes before the probe sees what the pump delivered.',
    'A capacitive probe has no exposed metal to corrode; power it only while measuring.',
    'A latched fault, with an alarm, is better than a clever recovery that waters on a lie.'
  ],
  pitfalls: [
    'Watering until the probe reads wet is the obvious loop — The water takes minutes to reach the probe, so the loop overshoots and floods. Pulse, soak, measure.',
    'The program has a time-out, so the pump is safe — If the program itself hangs or crashes, no time-out runs. Only a pull-down on the gate, which makes a reset look like "off", is independent of the code.',
    'The pump runs from the 3.3 V rail like everything else — It takes the cell\'s voltage (3 to 4.2 V) through the MOSFET, and the chip pin only switches the gate. A pump drawn from a pin would pull the chip down at start-up.'
  ],
  terms: [
    { term: 'Capacitive soil probe', also: ['soil moisture sensor'], def: 'A probe that measures how water changes the capacitance of two plates buried in the soil, and returns it as an analogue voltage. Having no bare metal in the soil, it does not corrode as a resistive probe does.' },
    { term: 'Flyback diode', also: ['freewheel diode', 'snubber diode'], def: 'A diode across a motor or relay coil that gives the current a path when the switch opens, so that the inductive voltage spike does not destroy the transistor.' },
    { term: 'Latched fault', also: ['fault latch'], def: 'A fault state that stays until a person clears it. It prevents a device from retrying a dangerous action on its own.' },
    { term: 'Pull-down resistor on a gate', also: ['gate pull-down'], def: 'A resistor from a MOSFET gate to ground that holds it off whenever the driving pin is not driving: while the chip resets, boots or crashes.' }
  ],
  choose: {
    good: ['One or two pots, indoors, with a tank you can see', 'A first project on safe switching, calibration and fault states', 'A battery device that wakes twice an hour and almost never uses Wi-Fi'],
    avoid: ['Watering from the mains tap with no mechanical limit: a valve that sticks open floods the house', 'A resistive probe that corrodes within weeks', 'Trusting one reading: noise, a loose cable or a dry spot can fool it'],
    check: ['The volume of one pulse, measured', 'The probe\'s voltage in air against the ADC range of the chip', 'What the pump pin does while the chip resets']
  },
  code: [
    {
      title: 'Measure, pulse, soak, with every limit in place',
      about: 'Each wake-up powers the probe, measures, and decides. A dry reading starts one 6 s pulse and a ten-minute soak, up to three pulses a day; an empty tank, an out-of-range probe or a reached limit latches a fault and the pump stays off.',
      needs: 'A XIAO ESP32C3, a capacitive soil probe, a logic-level N-channel MOSFET with a flyback diode, a 3–6 V pump from the cell, a float switch and a 100 kΩ gate pull-down. Calibrate `DRY_MV` and `WET_MV` for your own probe.',
      wiring: [['GPIO4 (D2)', 'probe output', 'ADC1'], ['GPIO10 (D10)', 'probe power', 'off between readings'], ['GPIO3 (D1)', 'MOSFET gate', '100 Ω in series, 100 kΩ to GND'], ['GPIO5 (D3)', 'float switch to GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (3) as [output v]
          set pin (3) to [LOW v]
          set pin (10) as [output v]
          set pin (5) as [input with pull-up v]
          change [wakes v] by (1)
          if <(wakes) > (48)> then
            set [wakes v] to (1)
            set [pulses v] to (0)
          end
          set pin (10) to [HIGH v]
          wait (0.3) seconds
          set [mv v] to (analog read pin (4) in millivolts)
          set pin (10) to [LOW v]
          set [moisture v] to (map (mv) from (2300) (1100) to (0) (100))
          if <<(mv) < (300)> or <(mv) > (2450)>> then
            set [faulted v] to <true>
            deep sleep for (1800) seconds
          end
          if <(moisture) < (30)> then
            if <<(pulses) ≥ (3)> or <(read pin (5)) = [HIGH v]>> then
              set [faulted v] to <true>
              deep sleep for (1800) seconds
            end
            set pin (3) to [HIGH v]
            set [t0 v] to (milliseconds since start)
            repeat until <<((milliseconds since start) - (t0)) > (6000)> or <(read pin (5)) = [HIGH v]>>
              wait (0.02) seconds
            end
            set pin (3) to [LOW v]
            change [pulses v] by (1)
            deep sleep for (600) seconds
          end
          deep sleep for (1800) seconds
      `,
      cpp: String.raw`
        #include <esp_sleep.h>

        const int PIN_PROBE = 4, PIN_PROBE_POWER = 10, PIN_PUMP = 3, PIN_FLOAT = 5;   // from the pin planner, XIAO ESP32C3
        const int DRY_MV = 2300, WET_MV = 1100;          // probe in air, probe in water: measure yours
        const int DRY_BELOW = 30;                        // water when moisture is below 30 %
        const uint32_t PULSE_MS = 6000;                  // the pump never runs longer than this
        const uint64_t WAKE_US = 30ULL * 60 * 1000000, SOAK_US = 10ULL * 60 * 1000000;
        const int MAX_PULSES = 3, WAKES_PER_DAY = 48;

        RTC_DATA_ATTR uint8_t pulses = 0, wakes = 0;     // survive deep sleep, cleared by a power cycle
        RTC_DATA_ATTR bool faulted = false;

        void sleepFor(uint64_t us) {
          esp_sleep_enable_timer_wakeup(us);
          esp_deep_sleep_start();
        }

        int readMoisture() {                             // percent, or -1 when the probe is out of range
          digitalWrite(PIN_PROBE_POWER, HIGH);           // the probe is powered only while measuring
          delay(300);
          int mv = analogReadMilliVolts(PIN_PROBE);
          digitalWrite(PIN_PROBE_POWER, LOW);
          if (mv < 300 || mv > 2450) return -1;          // unplugged or shorted
          return constrain(map(mv, DRY_MV, WET_MV, 0, 100), 0, 100);
        }

        void setup() {
          pinMode(PIN_PUMP, OUTPUT);
          digitalWrite(PIN_PUMP, LOW);                   // first thing: pump off
          pinMode(PIN_PROBE_POWER, OUTPUT);
          pinMode(PIN_FLOAT, INPUT_PULLUP);              // low = water in the tank
          if (++wakes > WAKES_PER_DAY) { wakes = 1; pulses = 0; }   // about one day has passed
          bool tankOk = digitalRead(PIN_FLOAT) == LOW;
          if (faulted && tankOk) faulted = false;        // a refill clears the fault
          if (faulted) sleepFor(WAKE_US);                // latched: stay off
          int moisture = readMoisture();
          if (moisture < 0) { faulted = true; sleepFor(WAKE_US); }
          if (moisture < DRY_BELOW) {
            if (pulses >= MAX_PULSES || !tankOk) { faulted = true; sleepFor(WAKE_US); }
            digitalWrite(PIN_PUMP, HIGH);
            uint32_t t0 = millis();
            while (millis() - t0 < PULSE_MS && digitalRead(PIN_FLOAT) == LOW) delay(20);
            digitalWrite(PIN_PUMP, LOW);
            pulses++;
            sleepFor(SOAK_US);                           // let the water spread, then measure again
          }
          sleepFor(WAKE_US);
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, time
        from machine import Pin, ADC

        PIN_PROBE, PIN_PROBE_POWER, PIN_PUMP, PIN_FLOAT = 4, 10, 3, 5   # from the pin planner, XIAO ESP32C3
        DRY_MV, WET_MV = 2300, 1100          # probe in air, probe in water: measure yours
        DRY_BELOW = 30                       # water when moisture is below 30 %
        PULSE_MS = 6000                      # the pump never runs longer than this
        WAKE_MS, SOAK_MS = 30 * 60_000, 10 * 60_000
        MAX_PULSES, WAKES_PER_DAY = 3, 48

        pump = Pin(PIN_PUMP, Pin.OUT, value=0)               # first thing: pump off
        probe_power = Pin(PIN_PROBE_POWER, Pin.OUT, value=0)
        tank = Pin(PIN_FLOAT, Pin.IN, Pin.PULL_UP)           # low = water in the tank

        rtc = machine.RTC()
        mem = rtc.memory()                                   # survives deep sleep, cleared by a power cycle
        pulses, wakes, faulted = (mem[0], mem[1], mem[2]) if len(mem) == 3 else (0, 0, 0)

        def sleep_for(ms):
            rtc.memory(bytes([pulses, wakes, faulted]))
            machine.deepsleep(ms)

        def read_moisture():                                 # percent, or -1 when the probe is out of range
            probe_power.value(1)                             # powered only while measuring
            time.sleep_ms(300)
            mv = ADC(Pin(PIN_PROBE), atten=ADC.ATTN_11DB).read_uv() // 1000
            probe_power.value(0)
            if mv < 300 or mv > 2450:
                return -1                                    # unplugged or shorted
            return max(0, min(100, (mv - DRY_MV) * 100 // (WET_MV - DRY_MV)))

        wakes += 1
        if wakes > WAKES_PER_DAY:
            wakes, pulses = 1, 0                             # about one day has passed
        tank_ok = tank.value() == 0
        if faulted and tank_ok:
            faulted = 0                                      # a refill clears the fault
        if faulted:
            sleep_for(WAKE_MS)                               # latched: stay off
        moisture = read_moisture()
        if moisture < 0:
            faulted = 1
            sleep_for(WAKE_MS)
        if moisture < DRY_BELOW:
            if pulses >= MAX_PULSES or not tank_ok:
                faulted = 1
                sleep_for(WAKE_MS)
            pump.value(1)
            t0 = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), t0) < PULSE_MS and tank.value() == 0:
                time.sleep_ms(20)
            pump.value(0)
            pulses += 1
            sleep_for(SOAK_MS)                               # let the water spread, then measure again
        sleep_for(WAKE_MS)
      `,
      output: `
        moisture 22 %, pulses today 0   (then: pump 6 s, soak 10 min)
        moisture 41 %                   (then: sleep 30 min)
      `,
      notes: ['The counters count wake-ups, not clock time: 48 wake-ups of 30 minutes are about a day, a soak wake-up included. That avoids needing a clock; use real time (network time) if you need exactness.', 'There is no alarm in this program: it stops safely, and says so only on the serial port. The first thing to add is a buzzer or a push message.', 'The block version waits with a timer; Arduino and MicroPython use the millisecond clock, the same loop as in [[non-blocking-timing]].']
    }
  ],
  quiz: [
    { q: 'The program crashes while the pump is on. What turns the pump off?', choices: ['The 6 s time-out in the program', 'The 100 kΩ pull-down on the MOSFET gate, once the reset makes the pin float', 'The float switch', 'Nothing: it runs until the battery is flat'], a: 1, why: 'A time-out in code cannot run if the code has stopped. When the chip resets, its pins float, and only the pull-down then holds the gate low and the pump off.' },
    { q: 'Why does the program wait ten minutes between a pulse and the next measurement?', choices: ['To save power only', 'Water takes time to spread to the probe, so an early reading would call a wet pot dry and add more water', 'The probe needs ten minutes to warm up', 'MicroPython needs it'], a: 1, why: 'The probe sees the water only after it has spread. Measuring at once would overshoot and flood the pot.' },
    { q: 'The probe cable comes loose and the reading falls to 0 mV. What does the program do?', choices: ['Waters, because 0 is dry', 'Latches a fault and keeps the pump off, because the reading is out of range', 'Waters three times and stops', 'Restarts'], a: 1, why: 'A reading outside what the probe can produce means the probe, not the soil, is at fault. Treating it as "very dry" would pump until a limit stopped it.' },
    { q: 'Why is the probe powered from a pin instead of the 3.3 V rail?', choices: ['A pin gives a steadier voltage', 'So that it draws nothing between readings', 'Because the rail cannot supply 5 mA', 'It is the only way to read the ADC'], a: 1, why: 'About 5 mA, always on, would be a hundred times the chip\'s sleep current. Powering it from a pin for 0.3 s every 30 minutes costs almost nothing.' }
  ],
  applications: [
    'Indoor plants, herb pots and seedling trays on a battery or a USB supply.',
    'Greenhouse benches with one probe and one valve per zone, with the same limits on each.',
    'The same loop with a heater, a fan or a mister: measure, act in a bounded pulse, wait, measure.',
    'A model for any actuator that can cause damage: independent limits, a latched fault and a safe default when the controller is gone.'
  ],
  sources: [
    'Espressif, *ESP32-C3 Series Datasheet*: the ADC (channels and ranges), the pin table and the strapping pins.',
    'Espressif, *ESP-IDF Programming Guide*, ADC and sleep modes: ADC2 on the ESP32-C3 and the wake-up sources.',
    'The datasheet of the MOSFET you choose: its gate threshold voltage at 3.3 V drive, and its on-resistance.'
  ],
  sim: 'wp-plant'
},
/* ================================================================ project-doorbell-camera */
{
  id: 'project-doorbell-camera',
  parent: 'worked-projects',
  title: 'A doorbell with a camera',
  level: 3,
  short: 'A button, a chime and a camera board that sleeps until someone presses: it rings, takes one photograph, sends it to your own server and goes back to sleep. The hard parts are the power, the network and the people in the picture.',
  keywords: ['doorbell', 'camera', 'ESP32-S3', 'XIAO ESP32S3 Sense', 'OV2640', 'OV3660', 'JPEG', 'deep sleep', 'ext0 wake-up', 'HTTP POST', 'privacy', 'consent', 'worked project', 'esp_camera'],
  prereq: ['the-esp32-camera-driver', 'deep-sleep', 'wake-up-sources', 'http-client'],
  related: ['cameras-and-the-law', 'photos-and-time-lapse', 'camera-interfaces', 'camera-sensors', 'using-psram', 'buzzers-and-tones', 'https-and-tls', 'credentials-handling', 'motion-detection', 'battery-life-budget', 'timeouts-and-timed-states', 'project-weather-station'],
  body: `A doorbell camera is a doorbell first: the button must always work, the chime must come at once, and nothing about the camera may delay or block it. The photograph is the extra. It is also the part that records people, which is why the law and a short list of habits belong in the design, not in an afterthought.

> [!warn] A camera records people: your visitors, the postman and passers-by. What may be recorded, where it may point, how long pictures may be kept, and whether sound may be recorded differ from country to country, and often depend on whether a public pavement or a neighbour's door is in the frame. Check your local law and any rules of your building; tell visitors with a sign; keep pictures only as long as you need them. This design has no microphone on purpose, because recording sound is usually treated more strictly than recording pictures.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Chime | starts within half a second of the press, with or without a network |
| Picture | one JPEG of 800 × 600, taken during the chime, uploaded within 15 s |
| Cooldown | 20 s: a press during it chimes but takes no picture |
| Keeps | nothing on the device; pictures go to a server of your own, with a retention period you choose |
| Power | a 5 V USB supply; on a cell only if presses are rare (see the budget) |

### 2. The chip, and why

Asked for Wi-Fi, a camera and plenty of memory, [the project advisor](#/tools/advisor) ranks the **ESP32-S3** first (95), the ESP32 second (91, the chip of the ESP32-CAM boards) and the ESP32-S2 third (89). It rules out the C2, C3, C5, C6, C61, H2, H4, H21 and the ESP8266, none of which has a camera interface, and the P4, which has a camera interface but no radio. The S3 has the 8–16 bit parallel camera interface and the PSRAM that holds a frame. The board is the advisor's first suggestion for the S3 that is tiny and cheap: the **Seeed Studio XIAO ESP32S3 Sense**, with an OV3660 camera (earlier boards an OV2640), 8 MB of flash and 8 MB of PSRAM.

### 3. The circuit

The camera is on the board; only the button and the chime are yours. The pin planner chose a pin that can wake the chip for the button, and a plain pin for the buzzer.

| Part | Board pin | GPIO | Note |
|---|---|---|---|
| Doorbell button | D3 | 4 | to ground; a pin of the RTC domain, so it can wake the chip from deep sleep |
| Buzzer (piezo) | D0 | 1 | driven with a tone from a PWM channel |
| Camera data D0–D7 | on the board | 15, 17, 18, 16, 14, 12, 11, 48 | not available for anything else |
| Camera clock, sync, pixel clock | on the board | 10, 38, 47, 13 | XCLK, VSYNC, HREF, PCLK |
| Camera control (SCCB) | on the board | SDA 40, SCL 39 | a two-wire bus of its own |

The microphone (GPIO41, 42) and the SD slot (chip select GPIO21) stay unused. The camera takes a large share of the pins; the catalogue notes that it heats and that its current peaks at about 350 mA when capturing, so the supply must be able to give it.

### 4. The behaviour as a state machine

**ASLEEP** until the button wakes the chip; **RINGING** (the chime, 1.5 s); **CAPTURING** (grab one frame; give up after 4 s); **UPLOADING** (Wi-Fi, one HTTP POST; give up after 15 s); **COOLDOWN** (20 s, in which a press only chimes). In the program the cooldown is a timestamp kept across sleeps, so the machine and the code agree even though the chip is asleep. In the simulation the events are buttons, or play by themselves; break the network to see UPLOADING time out. The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The program

Arduino C++ only. The camera driver is a component of the core and the official MicroPython builds do not include one; community builds do, with their own function names ([[the-esp32-camera-driver]]). The picture is sent with a plain HTTP POST of the JPEG bytes ([[http-client]]): on a home network that is acceptable for a test, but anyone on it could also post pictures, so move to HTTPS with a token before the doorbell is real ([[https-and-tls]], [[credentials-handling]]). The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power budget

On a 3000 mAh cell (80 % usable, 2 % self-discharge a month), with three presses a day of 8 s at about 220 mA: if the whole board sleeps at 0.1 mA the life is about 409 days; at 0.5 mA (the camera and microphone stay powered on this board: measure yours) 155 days; at 2 mA only 47 days. Live viewing is another thing: an always-connected camera draws about 80 mA, which empties the cell in a day and a quarter. A battery doorbell therefore only works as "press, one photo, sleep", and the *sleep* current of the camera board decides it ([[battery-life-budget]]).

### 7. What to test, what goes wrong first, how to extend

Test with the camera covered, to hear the chime; then with the router off, to see the time-out and the chime still sounding. What goes wrong first: the button is still held when the chip goes to sleep, so it wakes again at once (the program waits for the release first); the picture is dark at night; the router's channel or password changed; the supply sags under the camera's current. Extend with an infrared light or a camera with an IR filter that switches, a retry from the SD card for pictures that failed to upload, a push notification, and a motion trigger ([[motion-detection]]); keep the retention period and the sign.

> [!key] A doorbell camera is a doorbell with an optional picture: ring first, photograph second, upload last, and give up at each step instead of blocking the next. The camera's sleep current decides the battery; the people in the picture decide the law.`,
  ideas: [
    'Ring first: the chime must not wait for the camera or the network; each later step has its own time-out.',
    'A camera board sleeps on a single wake pin: the button wakes the chip, and the program waits for its release before it sleeps again.',
    'On a battery the camera board\'s sleep current, not its capture current, decides the life; live video needs mains.',
    'The picture goes to a server of your own with a retention period, and a camera at a door needs a sign and an eye on the local law.'
  ],
  pitfalls: [
    'A battery doorbell can stream video — A camera and Wi-Fi draw about 80 mA when connected, which empties a 3000 mAh cell in a day and a quarter. Only "press, one photo, sleep" fits a battery.',
    'The ESP32-C3 is cheaper, so it will do — It has no camera interface at all. Only the ESP32, S2, S3 (and the S31) have one.',
    'It is my door, so I may record anything — The frame may include a public pavement, a neighbour\'s property or visitors who must be told; sound is treated more strictly than pictures. Check your local law.'
  ],
  terms: [
    { term: 'Frame buffer', also: ['fb', 'camera_fb_t'], def: 'A block of memory that holds one captured picture. The camera driver fills it, your code reads it (here as a JPEG), and returns it to the driver; PSRAM holds it on the S3.' },
    { term: 'ext0 wake-up', also: ['external wake-up'], def: 'A deep-sleep wake-up source: one pin of the RTC domain, with a chosen level, that wakes the chip when it reaches that level. Available on the ESP32, S2 and S3.' },
    { term: 'Cooldown', also: ['lock-out time', 'debounce at the system level'], def: 'A period after an action in which the same trigger is only half obeyed: here a second press chimes but takes no picture, so that a child pressing the button does not flood the server.' },
    { term: 'Retention period', also: ['data retention'], def: 'How long recorded data is kept before it is deleted. Choose it, and enforce it on the server; the shorter it is, the less there is to lose or to explain.' }
  ],
  choose: {
    good: ['A door with a USB supply nearby and a home server for the pictures', 'A "press, one photo, sleep" design on a cell, with rare presses', 'A way to learn the camera driver, deep-sleep wake-up and an HTTP upload together'],
    avoid: ['Live video on a battery', 'A frame that takes in a public place or a neighbour without checking the law', 'Uploading pictures over plain HTTP across the internet'],
    check: ['The sleep current of the whole board with the camera fitted', 'What the local rules say about cameras, signs, sound and retention', 'The chime path when the network is down']
  },
  code: [
    {
      title: 'Ring, photograph, upload, sleep',
      about: 'Woken by the button, the chip sounds the buzzer for 1.5 s, takes one 800 × 600 JPEG, joins Wi-Fi and posts the picture, then waits for the button to be released and sleeps. A timestamp kept across sleeps gives the 20 s cooldown.',
      needs: 'A XIAO ESP32S3 Sense with its camera, a push button from D3 to ground, a piezo buzzer on D0, and a home server that accepts a POST of image/jpeg. In the Arduino IDE choose OPI PSRAM for this board. Never leave real credentials in shared code.',
      wiring: [['GPIO4 (D3)', 'doorbell button to GND', 'wakes the chip, RTC pin with pull-up'], ['GPIO1 (D0)', 'piezo buzzer', 'tone from a PWM channel'], ['camera pins', 'on the board', 'see the table']],
      blocks: `
        when woken by pin (4) going [low v]
          set [now v] to (current time)
          play tone (880) Hz on pin (1) for (1.5) seconds
          if <((now) - (lastPhoto)) > (20)> then
            take a photo :: sensing
            if <photo ready?> then
              connect to Wi-Fi [your-ssid] password [your-password]
              wait until <Wi-Fi connected?> for at most (10) seconds
              http post (photo) to [http://192.168.1.10:8080/doorbell]
              if <(last http status) = (200)> then
                set [lastPhoto v] to (now)
              end
            end
          end
          wait until <(read pin (4)) = [HIGH v]>
          enable wake on pin (4)
          deep sleep
      `,
      cpp: String.raw`
        #include "esp_camera.h"
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include "driver/rtc_io.h"
        #include <esp_sleep.h>

        const char *SSID = "your-ssid", *PASS = "your-password";
        const char *URL = "http://192.168.1.10:8080/doorbell";    // your own server, accepting image/jpeg
        const int PIN_BUTTON = 4, PIN_CHIME = 1;                  // from the pin planner, XIAO ESP32S3 Sense
        const time_t COOLDOWN_S = 20;
        RTC_DATA_ATTR time_t lastPhoto = 0;                       // survives deep sleep; the clock keeps running

        bool startCamera() {
          camera_config_t cfg = {};
          cfg.ledc_channel = LEDC_CHANNEL_0;  cfg.ledc_timer = LEDC_TIMER_0;
          cfg.pin_d0 = 15; cfg.pin_d1 = 17; cfg.pin_d2 = 18; cfg.pin_d3 = 16;
          cfg.pin_d4 = 14; cfg.pin_d5 = 12; cfg.pin_d6 = 11; cfg.pin_d7 = 48;
          cfg.pin_xclk = 10; cfg.pin_pclk = 13; cfg.pin_vsync = 38; cfg.pin_href = 47;
          cfg.pin_sccb_sda = 40; cfg.pin_sccb_scl = 39; cfg.pin_pwdn = -1; cfg.pin_reset = -1;
          cfg.xclk_freq_hz = 20000000;
          cfg.pixel_format = PIXFORMAT_JPEG;  cfg.frame_size = FRAMESIZE_SVGA;   // 800 x 600
          cfg.jpeg_quality = 12;  cfg.fb_count = 1;
          cfg.fb_location = CAMERA_FB_IN_PSRAM;  cfg.grab_mode = CAMERA_GRAB_LATEST;
          return esp_camera_init(&cfg) == ESP_OK;
        }

        bool uploadPhoto() {
          camera_fb_t *fb = esp_camera_fb_get();
          if (!fb) return false;
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 10000) delay(50);
          bool ok = false;
          if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            http.begin(URL);
            http.addHeader("Content-Type", "image/jpeg");
            int code = http.POST(fb->buf, fb->len);
            ok = code >= 200 && code < 300;
            http.end();
          }
          esp_camera_fb_return(fb);
          return ok;
        }

        void setup() {
          pinMode(PIN_BUTTON, INPUT_PULLUP);
          ledcAttach(PIN_CHIME, 2000, 10);
          ledcWriteTone(PIN_CHIME, 880);                          // the chime comes first
          delay(1500);
          ledcWriteTone(PIN_CHIME, 0);
          ledcDetach(PIN_CHIME);
          time_t now = time(nullptr);
          if (now - lastPhoto > COOLDOWN_S && startCamera()) {
            if (uploadPhoto()) lastPhoto = now;
            esp_camera_deinit();
          }
          while (digitalRead(PIN_BUTTON) == LOW) delay(10);       // wait for the release, or it wakes again at once
          rtc_gpio_pullup_en((gpio_num_t)PIN_BUTTON);
          rtc_gpio_pulldown_dis((gpio_num_t)PIN_BUTTON);
          esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_BUTTON, 0);   // wake when the pin goes low
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      na: { py: 'The official MicroPython builds have no camera driver. Community firmware adds a camera module whose function names differ between builds; the C++ version above is the reference.' },
      notes: ['The first press after power-up always takes a picture: the stored timestamp starts at zero.', 'The upload is plain HTTP for a home test. Before the doorbell is real, use HTTPS and a token, and give the server a retention rule.', 'The camera pins are those of the XIAO ESP32S3 Sense in the catalogue; another camera board needs its own pin set, which its maker publishes.']
    }
  ],
  examples: [
    {
      title: 'Which battery for a doorbell?',
      q: 'A doorbell is pressed 3 times a day. Each press keeps the board awake 8 s at an average of 220 mA. Compare a board that sleeps at 0.1 mA with one that sleeps at 2 mA.',
      steps: ['Presses: $3 \\times 8 \\times 220 / 86400 = 0.061$ mA averaged over the day.', 'Total: 0.161 mA (sleeps at 0.1) and 2.061 mA (sleeps at 2).', 'On 2400 mAh usable with 0.083 mA of self-discharge: $2400 / 0.244 = 9800$ h, 409 days; and $2400 / 2.144 = 1120$ h, 47 days.'],
      a: 'Roughly 13 months against 7 weeks: the sleeping current, not the presses, decides how long the cell lasts.'
    }
  ],
  quiz: [
    { q: 'Why does the program wait for the button to be released before going to sleep?', choices: ['To save power', 'A button still held at ground would wake the chip again at once', 'The camera needs it', 'To debounce Wi-Fi'], a: 1, why: 'The wake-up source fires while the pin is at its trigger level. A button still pressed would restart the chip immediately, in a loop.' },
    { q: 'A neighbour presses the button five times in ten seconds. What happens?', choices: ['Five pictures are uploaded', 'Each press chimes, but only the first takes a picture within the 20 s cooldown', 'Only the first chimes', 'The chip resets'], a: 1, why: 'The chime always sounds; the stored time of the last photo suppresses new pictures for 20 s.' },
    { q: 'Which of these chips can run this project?', choices: ['ESP32-C3', 'ESP32-C6', 'ESP32-S3', 'ESP32-H2'], a: 2, why: 'Only the ESP32, S2 and S3 (and the S31) have a camera interface. The C3, C6 and H2 have none, and the H2 has no Wi-Fi either.' },
    { q: 'The router is switched off. What should the doorbell still do?', choices: ['Nothing: it needs the network', 'Chime, try to take the picture, give up after the Wi-Fi time-out, and sleep', 'Chime for 15 s', 'Wait for the router'], a: 1, why: 'The chime must not depend on the network. Each later step has its own time-out, so a dead router costs ten seconds of battery, not the doorbell.' }
  ],
  applications: [
    'Door and gate cameras that send one photograph to a home server or a phone.',
    'Wildlife and parcel-box cameras that wake on a trigger and upload one picture.',
    'The same wake, capture and upload pattern with a motion sensor instead of the button.',
    'Camera boards sold for the purpose: the XIAO ESP32S3 Sense, the ESP32-S3-EYE and several others in the board catalogue.'
  ],
  sources: [
    'Espressif, the *esp32-camera* component documentation: the camera configuration and the frame buffer.',
    'Espressif, *ESP32-S3 Series Datasheet*: the camera (DVP) interface.',
    'Seeed Studio, the XIAO ESP32S3 Sense wiki: the camera, microphone and SD pin assignments.'
  ],
  sim: 'wp-doorbell'
},
/* ================================================================ project-esp-now-sensors */
{
  id: 'project-esp-now-sensors',
  parent: 'worked-projects',
  title: 'Battery sensors with ESP-NOW',
  level: 3,
  short: 'Temperature nodes in several rooms that never join the Wi-Fi: each wakes, sends six bytes to a gateway and sleeps again. The gateway sits on the router and passes the readings to MQTT. The one rule that must hold is the channel.',
  keywords: ['ESP-NOW', 'sensor nodes', 'gateway', 'router channel', 'battery', 'acknowledgement', 'retry', 'NTC', 'ESP32-C3', 'deep sleep', 'MQTT', 'worked project', 'peer', 'sequence number'],
  prereq: ['esp-now', 'esp-now-gateway', 'esp-now-with-wifi', 'deep-sleep'],
  related: ['esp-now-peers-and-addresses', 'esp-now-topologies', 'esp-now-encryption', 'reliability-acks-and-retries', 'thermistors-and-ldrs', 'adc-attenuation-and-calibration', 'mqtt', 'battery-life-budget', 'aa-cells-and-coin-cells', 'project-weather-station', 'project-thermostat'],
  body: `The weather station of the earlier page spent most of its charge joining the Wi-Fi: three and a half seconds of scanning, association and DHCP for one second of useful work. ESP-NOW removes that. A node wakes, measures, sends a frame of a few bytes straight to a known address and sleeps; no access point, no password, no IP address. A gateway that *is* on the home network turns the frames into MQTT. The same temperature, twice as often, costs about an eighth of the charge.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Nodes | up to eight, one per room, each measuring a temperature (±0.5 °C) |
| Reports | every 5 minutes, six bytes each: node, sequence number, temperature in tenths of a degree, tries used |
| Delivery | acknowledged by the gateway; up to three tries within about half a second, then wait for the next period |
| Battery | three AA cells, at least two years |
| Gateway | on mains, on the home Wi-Fi, forwarding each report to MQTT within a second |
| Channel | every node transmits on the channel the router uses, and the router's channel is fixed |

### 2. The chips, and why

For a node, asked for ESP-NOW, a battery and an analogue input, [the project advisor](#/tools/advisor) ranks the **ESP32-C3** first (94; its analogue inputs are flagged: six channels, five usable), the S3 (93), the C6 (91) and the ESP32 (90). It rules out the H2, H4, H21 and P4: ESP-NOW needs the Wi-Fi radio. For the gateway, asked for ESP-NOW and Wi-Fi, four chips tie within two points: C3 99, ESP32 98, C6 98, S3 97. The gateway has a mains supply and keeps growing (TLS, a web page), so take the one with room to spare: the **ESP32-DevKitC V4** with an ESP32. Nodes are the **XIAO ESP32C3**.

### 3. The circuit

A node needs a thermistor and a way to power it only while measuring (a divider that always conducts, 3.3 V across 20 kΩ, would draw 165 µA, thirty times the sleep current). Pins from [the pin planner](#/tools/pinout/plan):

| Part | Board pin | GPIO | Note |
|---|---|---|---|
| NTC 10 kΩ, middle of the divider | D2 | 4 | ADC1 channel 4; 10 kΩ NTC from the power pin, 10 kΩ to ground |
| Divider supply | D1 | 3 | an output, high only while measuring |
| Gateway status LED (gateway board) | | 18 | 330 Ω to ground; flashes for each forwarded report |
| Supply | 5V pin | | three AA cells (4.5 V) into the board's regulator: two AA would fall below the chip's 3.0 V minimum before they were used up |

### 4. The behaviour as a state machine

The node is **SLEEPING**, **MEASURING**, **SENDING** and **BACKOFF**. SENDING waits for the delivery report of the radio: *delivered* means the gateway acknowledged, *not delivered* means no acknowledgement came. With tries left the node backs off for a moment and sends again; with none left it counts the failure and sleeps. The gateway has no state worth drawing: it receives, queues and forwards. In the simulation, move the router's channel away from the node's and watch every send fail: that is the failure you will meet first. The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The programs

Two programs, node and gateway, each in three languages. The frame is a packed six-byte structure; C++ and Python pack it the same way, little-endian ([[bits-and-bytes]]). The callbacks of core 3.3 have the new signatures ([[esp-now]]). The gateway callback only queues the frame: the work happens in the loop, not in the radio's task ([[queues]]). Both ends are built from [[esp-now-gateway]]. The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power budget

Phases of one wake-up (assumptions: measure yours): boot 0.2 s at 35 mA, thermistor and ADC 0.03 s at 25 mA, send 0.05 s at 120 mA, wait for the acknowledgement 0.03 s at 90 mA, shut down 0.05 s at 35 mA, asleep at 30 µA. That averages **0.09 mA**; on three AA cells (2500 mAh, 80 % usable) about **850 days**, 2.3 years. A frame is on the air for about 0.6 ms; the boot and the sleeping are most of the bill. Reporting every minute instead cuts the life to about 245 days. Compare the weather station: Wi-Fi and MQTT every ten minutes averaged 0.71 mA ([[battery-life-budget]]).

### 7. What to test, what goes wrong first, how to extend

Print the gateway's address and channel on the gateway, and copy both into the node. Walk a node out of range, and watch the *tries* field rise before reports are lost. What goes wrong first: the router changes channel (many routers choose it themselves: fix it); a node's address is mistyped; the gateway reboots and forgets nothing (it has no state) but misses reports meanwhile. Security: ESP-NOW frames are unauthenticated unless you use encryption, and the chip supports only six encrypted peers, so eight nodes need application-level protection too (a key in the frame, the sequence number checked against replays; [[esp-now-encryption]]). Extend with a battery reading, a door contact that wakes the chip, a channel scan after repeated failures, and a second gateway.

> [!key] ESP-NOW nodes trade the Wi-Fi connect for six bytes and an acknowledgement, which is why they last years on three cells. Keep the node's channel equal to the router's, count the tries, and let the gateway be the only thing that knows about the network.`,
  ideas: [
    'A node needs no access point: it sends a frame to a known address, waits for the delivery report and sleeps; the Wi-Fi connect it skips is most of the saving.',
    'The gateway joins the router and so sits on the router\'s channel; every node must transmit on the same channel, which is why the router\'s channel is fixed.',
    'A sequence number and a tries count in each frame make loss and range visible at the gateway.',
    'The chip supports only six encrypted peers, so a larger network needs checks in the payload as well.'
  ],
  pitfalls: [
    'ESP-NOW works at any distance and on any channel — Both ends must be on the same channel, and the range is that of the radio, with walls and bodies in the way.',
    'The send function returning OK means it arrived — It means the frame was queued. The delivery report, or the acknowledgement in MicroPython, says whether the peer received it.',
    'Two AA cells make 3 V, which suits a 3.3 V chip — The chip needs 3.0 V at least, and alkaline cells fall through that line with more than half their charge left. Use three cells and a regulator, or a lithium cell.'
  ],
  terms: [
    { term: 'Delivery report', also: ['send callback', 'send status'], def: 'The result ESP-NOW gives after each unicast send: delivered, if the peer acknowledged the frame at the radio level, or not delivered. It is not an application-level reply.' },
    { term: 'Sequence number', also: ['counter', 'seq'], def: 'A number a sender increases in every message so that the receiver can see gaps (lost messages) and repeats (replayed or duplicated ones).' },
    { term: 'Gateway', also: ['bridge', 'forwarder'], def: 'A device that joins two kinds of network. Here it hears ESP-NOW frames on one side and publishes MQTT messages on the Wi-Fi side.' },
    { term: 'Back-off', also: ['retry delay'], def: 'A short wait, often longer after each failure, before trying again, so that two senders that collided do not collide again.' }
  ],
  choose: {
    good: ['Many small battery nodes in one building, one gateway', 'Readings of a few bytes every minute or so', 'A network that must not depend on the router\'s password or DHCP'],
    avoid: ['Nodes far beyond the gateway\'s reach with no relay: use LoRa', 'A router that changes its own channel without telling anyone', 'Eight or more encrypted nodes: the chip limits encrypted peers to six'],
    check: ['The router\'s channel, and that it is fixed', 'The tries used per report at the node\'s real position', 'The supply voltage of the node at the end of the battery\'s life']
  },
  code: [
    {
      title: 'The node: measure, send with retries, sleep',
      about: 'Wakes every five minutes, powers a thermistor divider for a moment, sends a six-byte report to the gateway on the router\'s channel, retries up to three times with a short back-off, and sleeps.',
      needs: 'A XIAO ESP32C3 with a 10 kΩ NTC (beta 3950) and a 10 kΩ resistor, three AA cells, and the gateway\'s station address (print it on the gateway). Set `CHANNEL` to your router\'s channel.',
      wiring: [['GPIO4 (D2)', 'middle of NTC and 10 kΩ', 'ADC1'], ['GPIO3 (D1)', 'top of the NTC', 'powered only while measuring'], ['5V pin', 'three AA cells', '4.5 V']],
      blocks: `
        when started
          set pin (3) as [output v]
          set [temp v] to (read the NTC on pin (4) powered from pin (3) :: my)
          start ESP-NOW on channel (6) :: radio
          add peer [24:6F:28:AA:BB:CC] :: radio
          set [tries v] to (0)
          repeat until <<(delivered) = <true>> or <(tries) = (3)>>
            change [tries v] by (1)
            send (join (node) (seq) (round ((temp) * (10))) (tries)) to peer [24:6F:28:AA:BB:CC] :: radio
            wait until <delivery report arrived?> for at most (0.1) seconds
            if <not <delivered>> then
              wait ((20) + ((40) * (tries))) milliseconds
            end
          end
          deep sleep for (300) seconds
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>
        #include <esp_sleep.h>

        uint8_t GATEWAY[6] = {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0xCC};   // the gateway's station address
        const int CHANNEL = 6;                                       // the router's channel
        const int NODE_ID = 1, PIN_NTC = 4, PIN_NTC_POWER = 3;       // from the pin planner, XIAO ESP32C3
        const uint64_t SLEEP_US = 300ULL * 1000000ULL;               // five minutes

        typedef struct __attribute__((packed)) { uint8_t node; uint16_t seq; int16_t tempC10; uint8_t tries; } Report;
        RTC_DATA_ATTR uint16_t seq = 0;                              // survives deep sleep
        volatile int result = -1;                                    // -1 waiting, 1 delivered, 0 not delivered

        void onSent(const esp_now_send_info_t *info, esp_now_send_status_t status) {    // core 3.3 (IDF 5.5) form
          result = (status == ESP_NOW_SEND_SUCCESS) ? 1 : 0;
        }

        float readTemperature() {                                    // NTC from the powered pin, 10 k to ground
          digitalWrite(PIN_NTC_POWER, HIGH);
          delay(5);
          float v = max(analogReadMilliVolts(PIN_NTC) / 1000.0f, 0.01f);
          digitalWrite(PIN_NTC_POWER, LOW);
          float r = 10000.0f * (3.3f / v - 1.0f);                    // the NTC's resistance
          return 1.0f / (1.0f / 298.15f + log(r / 10000.0f) / 3950.0f) - 273.15f;
        }

        void setup() {
          pinMode(PIN_NTC_POWER, OUTPUT);
          float temp = readTemperature();
          WiFi.mode(WIFI_STA);
          WiFi.setChannel(CHANNEL);
          while (!WiFi.STA.started()) delay(10);
          if (esp_now_init() == ESP_OK) {
            esp_now_register_send_cb(onSent);
            esp_now_peer_info_t peer = {};
            memcpy(peer.peer_addr, GATEWAY, 6);
            peer.channel = 0;                                        // 0 = the channel the radio is on
            esp_now_add_peer(&peer);
            Report r = {NODE_ID, ++seq, (int16_t)lround(temp * 10), 0};
            for (int tries = 1; tries <= 3 && result != 1; tries++) {
              r.tries = tries;
              result = -1;
              esp_now_send(GATEWAY, (uint8_t *)&r, sizeof(r));
              uint32_t t0 = millis();
              while (result < 0 && millis() - t0 < 100) delay(1);    // wait for the delivery report
              if (result != 1) delay(20 + 40 * tries);               // back off, then try again
            }
          }
          esp_sleep_enable_timer_wakeup(SLEEP_US);
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, network, espnow, math, struct, time
        from machine import Pin, ADC

        GATEWAY = b"\x24\x6f\x28\xaa\xbb\xcc"       # the gateway's station address
        CHANNEL = 6                                  # the router's channel
        NODE_ID, PIN_NTC, PIN_NTC_POWER = 1, 4, 3    # from the pin planner, XIAO ESP32C3
        SLEEP_MS = 300_000                           # five minutes

        rtc = machine.RTC()
        seq = (int.from_bytes(rtc.memory() or b"\x00\x00", "little") + 1) & 0xFFFF   # survives deep sleep
        rtc.memory(seq.to_bytes(2, "little"))

        def read_temperature():                      # NTC from the powered pin, 10 k to ground
            power = Pin(PIN_NTC_POWER, Pin.OUT, value=1)
            time.sleep_ms(5)
            v = max(ADC(Pin(PIN_NTC), atten=ADC.ATTN_11DB).read_uv() / 1_000_000, 0.01)
            power.value(0)
            r = 10000 * (3.3 / v - 1)                # the NTC's resistance
            return 1 / (1 / 298.15 + math.log(r / 10000) / 3950) - 273.15

        temp10 = round(read_temperature() * 10)
        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.config(channel=CHANNEL)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(GATEWAY)
        for tries in range(1, 4):
            msg = struct.pack("<BHhB", NODE_ID, seq, temp10, tries)
            if e.send(GATEWAY, msg):                 # True when the gateway acknowledged
                break
            time.sleep_ms(20 + 40 * tries)           # back off, then try again
        machine.deepsleep(SLEEP_MS)
      `,
      output: `
        (gateway log)
        home/node/1/temp {"t":21.4,"seq":812,"tries":1}
        home/node/1/temp {"t":21.3,"seq":813,"tries":2}
      `,
      notes: ['The six bytes are the same in both languages: node (1), sequence (2, little-endian), temperature in tenths (2, signed), tries (1).', 'The radio and the router must agree on the channel: if the router moves, every send ends as not delivered. Fix the channel in the router.', 'A 3 V supply from two AA cells falls below the chip\'s minimum long before the cells are used up; the three-cell pack goes through the board\'s regulator.']
    },
    {
      title: 'The gateway: ESP-NOW in, MQTT out',
      about: 'Joins the home Wi-Fi (so its radio sits on the router\'s channel), listens for reports, and publishes each as a retained MQTT message. The receive callback only queues the report; the loop does the network work.',
      needs: 'An ESP32-DevKitC V4 (or any ESP32-family board with Wi-Fi), a status LED with a resistor, a Wi-Fi network and an MQTT broker; the PubSubClient library for Arduino. The serial monitor prints the address to copy into the nodes.',
      wiring: [['GPIO18', 'LED through 330 Ω to GND', 'flashes for each report']],
      libs: ['PubSubClient'],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-secret]
          wait until <Wi-Fi connected?>
          print (join [gateway ] (MAC address) [ on channel ] (Wi-Fi channel))
          start ESP-NOW :: radio
          connect to MQTT broker [192.168.1.10]

        when data received from (sender) :: radio
          add (data) to [reports v]

        forever
          for each [r v] in (reports)
            publish (join [{"t":] ((temperature of (r)) / (10)) [}]) to topic (join [home/node/] (node of (r)) [/temp])
            toggle pin (18)
          end
          delete all of [reports v]
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid", *PASS = "your-password", *BROKER = "192.168.1.10";
        const int PIN_LED = 18;                                   // from the pin planner, ESP32-DevKitC V4

        typedef struct __attribute__((packed)) { uint8_t node; uint16_t seq; int16_t tempC10; uint8_t tries; } Report;
        QueueHandle_t reports;
        NetworkClient net;
        PubSubClient mqtt(net);

        void onReceive(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(Report)) return;                      // not ours
          Report r;
          memcpy(&r, data, sizeof(r));
          xQueueSend(reports, &r, 0);                             // no network work in the radio's callback
        }

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_LED, OUTPUT);
          reports = xQueueCreate(16, sizeof(Report));
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);                                 // the radio then sits on the router's channel
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.printf("gateway %s on channel %d\n", WiFi.macAddress().c_str(), WiFi.channel());
          esp_now_init();
          esp_now_register_recv_cb(onReceive);
          mqtt.setServer(BROKER, 1883);
        }

        void loop() {
          if (!mqtt.connected()) mqtt.connect("espnow-gateway");
          mqtt.loop();
          Report r;
          while (xQueueReceive(reports, &r, 0) == pdTRUE) {
            char topic[32], msg[64];
            snprintf(topic, sizeof(topic), "home/node/%u/temp", r.node);
            snprintf(msg, sizeof(msg), "{\"t\":%.1f,\"seq\":%u,\"tries\":%u}", r.tempC10 / 10.0, r.seq, r.tries);
            mqtt.publish(topic, msg, true);                       // retained
            digitalWrite(PIN_LED, HIGH); delay(30); digitalWrite(PIN_LED, LOW);
          }
        }
      `,
      py: String.raw`
        import network, espnow, struct, time
        from machine import Pin
        from umqtt.simple import MQTTClient

        SSID, PASS, BROKER = "your-ssid", "your-password", "192.168.1.10"
        PIN_LED = 18                                 # from the pin planner, ESP32-DevKitC V4
        led = Pin(PIN_LED, Pin.OUT)

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect(SSID, PASS)                      # the radio then sits on the router's channel
        while not sta.isconnected():
            time.sleep_ms(250)
        print("gateway", sta.config("mac").hex(":"), "on channel", sta.config("channel"))
        e = espnow.ESPNow()
        e.active(True)
        c = MQTTClient("espnow-gateway", BROKER, keepalive=60)
        c.connect()

        while True:
            mac, msg = e.recv(5000)                  # wait up to 5 s: (None, None) on time-out
            try:
                if msg is None:
                    c.ping()                         # keep the MQTT session alive
                    continue
                if len(msg) != 6:
                    continue                         # not ours
                node, seq, temp10, tries = struct.unpack("<BHhB", msg)
                topic = "home/node/%d/temp" % node
                body = '{"t":%.1f,"seq":%d,"tries":%d}' % (temp10 / 10, seq, tries)
                c.publish(topic.encode(), body.encode(), retain=True)
                led.value(1)
                time.sleep_ms(30)
                led.value(0)
            except OSError:
                c.connect()                          # the broker dropped us: reconnect
      `,
      output: `
        gateway 24:6f:28:aa:bb:cc on channel 6
      `,
      notes: ['Print the address and channel once, copy them into every node, and keep the router on that channel.', 'A frame from a stranger passes the length check. Add a key or a check value to the payload before the readings matter, and drop repeated sequence numbers ([[esp-now-encryption]]).', 'The retained message lets a dashboard that starts later show the last value of each room.']
    }
  ],
  quiz: [
    { q: 'All sends from the nodes suddenly end as "not delivered", although nothing changed on the nodes. What is the first thing to check?', choices: ['The node batteries', 'Whether the router moved to another channel', 'The MQTT broker', 'The thermistor'], a: 1, why: 'The gateway follows the router\'s channel; nodes transmit on a fixed one. If the router moves, the two no longer meet. The broker is behind the gateway and does not affect ESP-NOW.' },
    { q: 'Why is the divider that reads the thermistor powered from a pin?', choices: ['The ADC needs a pin supply', 'A divider on the rail would draw about 165 µA all the time, thirty times the sleep current', 'To read two thermistors', 'To protect the ADC'], a: 1, why: '3.3 V across 20 kΩ is 165 µA. Powered from a pin for 5 ms every five minutes, the divider costs almost nothing.' },
    { q: 'A report needs one retry. Which field shows it, and where?', choices: ['seq, on the node', 'tries, in the frame the gateway publishes', 'The gateway\'s LED', 'Nothing shows it'], a: 1, why: 'The node writes the number of the attempt into the frame. The frame that finally arrives says how hard it was to deliver it.' },
    { q: 'Eight nodes are to use encrypted ESP-NOW with one gateway. What is the catch?', choices: ['There is none', 'The chip supports only six encrypted peers at once', 'Encryption needs the Wi-Fi password', 'Encrypted frames cannot be acknowledged'], a: 1, why: 'ESP-NOW allows twenty peers in all, of which at most six may be encrypted. A larger network needs checks in the payload for the rest.' }
  ],
  applications: [
    'Room-temperature nodes that feed a thermostat ([[project-thermostat]]) or a heating dashboard.',
    'Door, window and leak sensors that must last for years on a small battery.',
    'Greenhouses and workshops without Wi-Fi coverage in every corner, with a gateway in the middle.',
    'A way to add many cheap sensors without adding devices to the router\'s client list.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "ESP-NOW": peers, channels, the send callback, the limits on encrypted peers.',
    'Arduino core for ESP32 documentation, the *ESP-NOW* and *WiFi* libraries (core 3.3).',
    'MicroPython documentation, the *espnow* module (version 1.29).'
  ],
  sim: 'wp-espnow'
},
/* ================================================================ project-ble-presence */
{
  id: 'project-ble-presence',
  parent: 'worked-projects',
  title: 'Who is home? A BLE presence sensor',
  level: 2,
  short: 'A board on the wall listens for the advertisements of a tag on your key ring and tells the house whether it is home. Listening is cheap to write and expensive to power; and the tag, not the phone, is the right thing to track.',
  keywords: ['presence detection', 'BLE beacon', 'scanning', 'RSSI', 'ESP32-C3', 'key tag', 'arrival and departure', 'MQTT', 'home automation', 'worked project', 'privacy', 'resolvable address', 'hysteresis', 'sighting'],
  prereq: ['ble-roles', 'ble-advertising', 'ble-beacons', 'rssi-and-signal-quality'],
  related: ['mqtt-topics-qos-retain', 'the-shared-radio', 'wifi-station', 'range-and-obstacles', 'sleepy-ble-zigbee-thread', 'ble-security', 'timeouts-and-timed-states', 'entry-exit-and-guards', 'home-assistant-integration', 'project-weather-station'],
  body: `The idea fits in a sentence: when the tag on my key ring is heard, I am home. The program is short. What takes thought is *when to believe it*: one stray advertisement through the wall is not an arrival, and one missed advertisement is not a departure. So the heart of this page is a small machine that waits for several sightings before it says "home", and for a long silence before it says "away".

> [!warn] Presence is personal data. Track a tag that belongs to you and that everyone in the house knows about. Do not use the addresses of visitors' phones or other people's devices to record when they come and go; depending on where you live that can be unlawful, and it is never courteous. Phones change their Bluetooth address every few minutes for exactly this reason.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Notices | a tag advertising once a second, with a fixed address, closer than about 7 m in the open (−80 dBm) |
| Arrives | "home" after 3 sightings within 20 s: a single stray advertisement is ignored |
| Leaves | "away" after 120 s without a sighting: a few missed advertisements are tolerated |
| Publishes | retained MQTT message \`home/presence/keys\`, so a dashboard that starts later knows at once |
| Powered | from USB: a continuously listening radio cannot live on a battery (see the budget) |

### 2. The chip, and why

Asked for Bluetooth LE and Wi-Fi, [the project advisor](#/tools/advisor) ranks the **ESP32-C3** first (99), then the ESP32 and the C6 (98 each) and the S3 (97). It rules out the S2 (no Bluetooth at all), the H2, H4, H21 and P4 (no Wi-Fi) and the ESP8266. The original ESP32 stops at Bluetooth 4.2, which does not matter for listening to ordinary advertisements. The board is the maker's reference board, the **ESP32-C3-DevKitM-1**, powered over its USB port. Both radios share one antenna and one radio: the scan window is therefore set to half of the interval, so that Wi-Fi still gets air time ([[the-shared-radio]]).

### 3. The circuit

Almost nothing: one LED on GPIO3 (the pin planner's choice: no strapping pin) with 330 Ω to ground, on when the machine says "home". The tag is a separate device: any beacon or an ESP32 programmed to advertise, with a **fixed** address (a *random static* address begins with the bits 11, so its first byte is C0 or above). Place the board centrally, away from metal and the router's antenna, with the PCB antenna free ([[antenna-placement-and-enclosures]]).

### 4. The behaviour as a state machine

**ABSENT**, **ARRIVING**, **PRESENT**. A sighting in ABSENT starts ARRIVING; in ARRIVING each sighting is counted (an *internal* transition: it acts and stays, so the 20-second clock keeps running) and the third makes the house "home". ARRIVING gives up after 20 s. In PRESENT every sighting restarts the 120-second silence timer, which is a transition from the state to itself, and when it runs out the machine says "away". The two timers are the *hysteresis in time*: arriving takes evidence, leaving takes silence. Move the tag in the simulation, add a wall, kill its battery, and watch the machine decide ([[entry-exit-and-guards]], [[timeouts-and-timed-states]]). The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The program

The scanner runs in five seconds or less per period: the Arduino version scans for four seconds and then looks at the list; MicroPython scans for ever and its handler remembers the strongest signal of the period. The decision logic is the same: the sighting must be the tag's address *and* stronger than the threshold, which is how a tag in the next room stays out ([[ble-beacons]], [[rssi-and-signal-quality]]). The result is one retained MQTT message ([[mqtt-topics-qos-retain]]). The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power budget

Listening means a receiving radio: the catalogue gives 87 mA for the C3. At that rate a 3000 mAh cell lasts about 27 hours, and even a 50 % window with Wi-Fi idle leaves it at a couple of days. This device lives on USB. The *tag* is where the battery belongs: a beacon that advertises once a second with an assumed 12 mA for 3 ms per event and 10 µA between averages 0.046 mA, and lasts about half a year on a coin cell; every two seconds, about a year ([[sleepy-ble-zigbee-thread]], [[battery-life-budget]]). Put the watching on the wall and the sleeping on the tag.

### 7. What to test, what goes wrong first, how to extend

Walk through the front door with the tag and watch the log; walk to the next room and back. What goes wrong first: the tag's battery dies and the house reports "away"; the tag is in a bag next to the body, which absorbs the signal; the threshold is too strict and the sofa is "away"; the tag changed to a random address. Extend with a second scanner in another room and a rule "the strongest one wins", with phone-based presence from the phone's own app instead of its address, or with the scanner as a Bluetooth proxy for your home-automation hub ([[home-assistant-integration]]).

> [!key] Presence is two timers around a threshold: evidence before "home", silence before "away". Listen with a mains-powered board, put the battery in the tag, and track only a tag that is yours.`,
  ideas: [
    'Arriving needs evidence (several sightings in a window) and leaving needs silence (a long timer): the two timers are hysteresis in time.',
    'A transition from a state to itself restarts the timer; an internal transition does not, which is why counting sightings in ARRIVING is internal.',
    'A listening radio draws receive current all the time, so the scanner needs mains power; the tag can sleep for a year.',
    'Track your own tag with a fixed address, not other people\'s phones, which change their addresses on purpose.'
  ],
  pitfalls: [
    'One advertisement heard means someone arrived — A single packet can leak through a wall or reflect off a car. Require several sightings within a short window, and a minimum signal strength.',
    'One minute without a packet means the person left — Packets are lost to collisions, to bodies and to scan gaps. Wait minutes, not seconds, before "away".',
    'Phones are the natural thing to track — Phones change their address every few minutes for privacy and only advertise when an app asks. A key-ring tag is stable, cheap and yours.'
  ],
  terms: [
    { term: 'Presence detection', also: ['occupancy sensing'], def: 'Deciding from indirect evidence, here a radio signal, whether a person or object is in a place. It is always a judgement over time, never a single reading.' },
    { term: 'Sighting', also: ['advertisement heard'], def: 'One reception of the tracked tag\'s advertisement, strong enough to count. The machine counts sightings rather than trusting one.' },
    { term: 'Random static address', also: ['static random address'], def: 'A fixed Bluetooth LE address that a device generates for itself and keeps; its two top bits are 1, so the first byte is C0 or above. It does not change like a phone\'s private address does.' },
    { term: 'Resolvable private address', also: ['RPA', 'address rotation'], def: 'A Bluetooth LE address that changes every few minutes; only a device that holds the shared key can recognise it. Phones use it so that strangers cannot track them.' }
  ],
  choose: {
    good: ['Knowing whether a key-ring tag or a specific beacon is at home', 'A mains-powered scanner, a coin-cell tag', 'Presence that feeds heating and lighting rules with a margin of minutes'],
    avoid: ['Tracking other people\'s phones by their Bluetooth address', 'A scanner on a battery', 'Treating a single packet as an arrival'],
    check: ['That the tag\'s address is fixed (watch it for a day)', 'The signal strength at the places that must count as "home"', 'That everyone who lives there knows what is being tracked']
  },
  code: [
    {
      title: 'Listen for the tag, decide, publish',
      about: 'Scans for the tag\'s address, counts sightings stronger than −80 dBm, and runs the ABSENT, ARRIVING, PRESENT machine: three sightings in 20 s mean home, 120 s of silence mean away. Each change is published as a retained MQTT message and shown on an LED.',
      needs: 'An ESP32-C3-DevKitM-1 on USB, an LED with a 330 Ω resistor, Wi-Fi, an MQTT broker (and the PubSubClient library for Arduino), and a BLE tag whose fixed address you know. Do not leave real credentials in shared code.',
      wiring: [['GPIO3', 'LED through 330 Ω to GND', 'on when "home"']],
      libs: ['PubSubClient'],
      blocks: `
        when started
          set pin (3) as [output v]
          connect to Wi-Fi [your-ssid] password [your-secret]
          connect to MQTT broker [192.168.1.10]
          start BLE scan :: ble
          set [state v] to [ABSENT]

        every (4) seconds
          set [heard v] to <tag [c3:00:11:22:33:44] heard stronger than (-80) dBm in the last (4) seconds? :: ble>
          if <heard> then
            set [lastSeen v] to (milliseconds since start)
            if <(state) = [ABSENT]> then
              set [state v] to [ARRIVING]
              set [sightings v] to (1)
              set [windowStart v] to (milliseconds since start)
            else if <(state) = [ARRIVING]> then
              change [sightings v] by (1)
              if <(sightings) ≥ (3)> then
                set [state v] to [PRESENT]
                publish [home] to topic [home/presence/keys] retained :: mqtt
                set pin (3) to [HIGH v]
              end
            end
          end
          if <<(state) = [ARRIVING]> and <((milliseconds since start) - (windowStart)) > (20000)>> then
            set [state v] to [ABSENT]
          end
          if <<(state) = [PRESENT]> and <((milliseconds since start) - (lastSeen)) > (120000)>> then
            set [state v] to [ABSENT]
            publish [away] to topic [home/presence/keys] retained :: mqtt
            set pin (3) to [LOW v]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <BLEDevice.h>
        #include <BLEScan.h>
        #include <BLEAdvertisedDevice.h>

        const char *SSID = "your-ssid", *PASS = "your-password", *BROKER = "192.168.1.10";
        const char *BEACON = "c3:00:11:22:33:44";                  // your own tag's fixed address, lower case
        const int RSSI_MIN = -80, PIN_LED = 3;                     // from the pin planner, ESP32-C3-DevKitM-1
        const uint32_t ARRIVE_WINDOW_MS = 20000, LEAVE_AFTER_MS = 120000;

        enum State { ABSENT, ARRIVING, PRESENT };
        State state = ABSENT;
        int sightings = 0;
        uint32_t windowStart = 0, lastSeen = 0;
        NetworkClient net;
        PubSubClient mqtt(net);
        BLEScan *scan;

        void setState(State s, const char *text) {
          state = s;
          mqtt.publish("home/presence/keys", text, true);          // retained
          digitalWrite(PIN_LED, state == PRESENT);
        }

        void onSighting(uint32_t now) {                            // the tag was heard, strongly enough
          lastSeen = now;
          if (state == ABSENT) { state = ARRIVING; sightings = 1; windowStart = now; }
          else if (state == ARRIVING && ++sightings >= 3) setState(PRESENT, "home");
        }

        void setup() {
          pinMode(PIN_LED, OUTPUT);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
          BLEDevice::init("");
          scan = BLEDevice::getScan();
          scan->setActiveScan(false);                              // the address is in every advertisement
          scan->setInterval(160);                                  // half of the time listening, so Wi-Fi gets air time
          scan->setWindow(80);
        }

        void loop() {
          if (!mqtt.connected()) mqtt.connect("presence-keys");
          mqtt.loop();
          BLEScanResults *found = scan->start(4, false);           // listen for 4 s
          for (int i = 0; i < found->getCount(); i++) {
            BLEAdvertisedDevice d = found->getDevice(i);
            if (strcmp(d.getAddress().toString().c_str(), BEACON) == 0 && d.getRSSI() >= RSSI_MIN) onSighting(millis());
          }
          scan->clearResults();                                    // free the list
          uint32_t now = millis();
          if (state == ARRIVING && now - windowStart > ARRIVE_WINDOW_MS) state = ABSENT;
          if (state == PRESENT && now - lastSeen > LEAVE_AFTER_MS) setState(ABSENT, "away");
        }
      `,
      py: String.raw`
        import bluetooth, network, time
        from machine import Pin
        from umqtt.simple import MQTTClient

        SSID, PASS, BROKER = "your-ssid", "your-password", "192.168.1.10"
        BEACON = bytes.fromhex("c30011223344")          # your own tag's fixed address
        RSSI_MIN, PIN_LED = -80, 3                      # from the pin planner, ESP32-C3-DevKitM-1
        ARRIVE_WINDOW_MS, LEAVE_AFTER_MS, PERIOD_MS = 20_000, 120_000, 4000
        ABSENT, ARRIVING, PRESENT = 0, 1, 2

        led = Pin(PIN_LED, Pin.OUT)
        state, sightings, window_start, last_seen = ABSENT, 0, 0, 0
        strongest = None                                # the strongest signal from the tag in this period

        def irq(event, data):                           # event 5 is a scan result
            global strongest
            if event == 5:
                addr_type, addr, adv_type, rssi, adv = data
                if bytes(addr) == BEACON and (strongest is None or rssi > strongest):
                    strongest = rssi

        def set_state(new_state, text):
            global state
            state = new_state
            mqtt.publish(b"home/presence/keys", text, retain=True)
            led.value(state == PRESENT)

        def on_sighting(now):                           # the tag was heard, strongly enough
            global state, sightings, window_start, last_seen
            last_seen = now
            if state == ABSENT:
                state, sightings, window_start = ARRIVING, 1, now
            elif state == ARRIVING:
                sightings += 1
                if sightings >= 3:
                    set_state(PRESENT, b"home")

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect(SSID, PASS)
        while not sta.isconnected():
            time.sleep_ms(250)
        mqtt = MQTTClient("presence-keys", BROKER, keepalive=60)
        mqtt.connect()
        ble = bluetooth.BLE()
        ble.active(True)
        ble.irq(irq)
        ble.gap_scan(0, 160_000, 80_000, False)         # for ever; half of the time listening; passive

        while True:
            time.sleep_ms(PERIOD_MS)
            now = time.ticks_ms()
            if strongest is not None and strongest >= RSSI_MIN:
                on_sighting(now)
            strongest = None
            if state == ARRIVING and time.ticks_diff(now, window_start) > ARRIVE_WINDOW_MS:
                state = ABSENT
            if state == PRESENT and time.ticks_diff(now, last_seen) > LEAVE_AFTER_MS:
                set_state(ABSENT, b"away")
            mqtt.ping()                                 # keep the MQTT session alive
      `,
      output: `
        home/presence/keys  home    (three sightings within 20 s)
        home/presence/keys  away    (120 s of silence)
      `,
      notes: ['The four-second period gives at most one sighting per period in both versions, so "three sightings" means about twelve seconds of the tag being heard.', 'In MicroPython the handler keeps only what it needs (a number) and does nothing slow: it is called for every packet in the air, and the buffers it receives are reused.', 'A tag with a changing address will never match. Check that the address stays the same for a day before you trust it.']
    }
  ],
  quiz: [
    { q: 'The tag is heard once, strongly, as someone passes in the street. What does the machine do?', choices: ['Says "home" at once', 'Moves to ARRIVING and gives up after 20 s unless two more sightings follow', 'Ignores it completely', 'Publishes "away"'], a: 1, why: 'One sighting only starts the evidence-gathering. Three within twenty seconds are needed for "home"; a lone packet times out.' },
    { q: 'Why does the program require both the tag\'s address and a signal stronger than −80 dBm?', choices: ['To save memory', 'The address picks the tag; the strength keeps a tag in the next room or the street from counting as "home"', 'RSSI is needed to decode the address', 'The library demands it'], a: 1, why: 'The address says which device; the signal strength is a rough measure of how near it is. A threshold is how "home" gets a shape.' },
    { q: 'Why is the departure timer 120 s but the arrival window 20 s?', choices: ['Arrivals are more urgent', 'Missing a few advertisements is common, so leaving needs long silence; arriving only needs a few close sightings', 'The clock is inaccurate', 'It is arbitrary'], a: 1, why: 'Packets are lost to bodies, walls and scan gaps; a short departure timer would flap. Arrival evidence comes quickly once the tag is near.' },
    { q: 'Where does the battery belong in this system?', choices: ['In the scanner, which must run for ever', 'In the tag, which can advertise once a second for months', 'In the broker', 'Nowhere: both need USB'], a: 1, why: 'A scanner keeps its radio receiving, about 87 mA on the C3, so a cell lasts about a day. A tag spends a few milliseconds a second transmitting and sleeps in between.' }
  ],
  applications: [
    'Switching the heating down when the last key tag leaves and up when the first arrives.',
    'Lighting and alarm rules in a home automation system, with a margin for missed packets.',
    'Detecting that a tool, a bag or a pet\'s collar tag is in its place, in a workshop or a hall.',
    'Room-by-room presence with several scanners reporting the strongest signal of the tag.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*: advertising, scanning, and the address types (public, random static, resolvable private).',
    'Arduino core for ESP32 documentation, the *BLE* library: scanning (core 3.3).',
    'MicroPython documentation, the *bluetooth* module: gap_scan and the scan-result event (version 1.29).'
  ],
  sim: 'wp-presence'
},
/* ================================================================ project-energy-monitor */
{
  id: 'project-energy-monitor',
  parent: 'worked-projects',
  title: 'A mains energy monitor',
  level: 3,
  short: 'An isolated metering module does the dangerous measuring; an ESP32 asks it over a serial port every ten seconds and publishes volts, amps, watts and kilowatt-hours. The ESP never touches the mains, and that is the whole design.',
  keywords: ['energy monitor', 'PZEM-004T', 'Modbus RTU', 'power meter', 'kWh', 'mains', 'isolation', 'UART', 'CRC16', 'MQTT', 'ESP32-C3', 'worked project', 'metering module', 'CT clamp', 'Home Assistant'],
  prereq: ['mains-energy-monitoring', 'modbus', 'uart-on-the-esp', 'mqtt'],
  related: ['isolation-and-long-cables', 'hall-current-sensors', 'measuring-current-with-shunts', 'switching-mains-safely', 'rs-485', 'home-assistant-integration', 'json-on-a-microcontroller', 'error-states-and-recovery', 'registers-and-datasheets', 'project-weather-station', 'project-thermostat'],
  body: `Measuring mains power from a microcontroller can be done in two ways. The first puts mains on your circuit board, with dividers, a transformer and a lot of luck. The second buys a small, finished metering module that has already solved isolation, calibration and the arithmetic, and talks to the microcontroller over a serial line. This page takes the second way. The ESP32 is then just a reader and a messenger, and the design is about asking politely, checking the answer, and noticing when the meter has gone quiet.

> [!warn] Mains voltage. The metering module's input terminals carry mains. Installing it is work for a qualified person: in a closed enclosure with the terminals covered, protected by a fuse or breaker rated for the wire, following your local wiring code. A bare module on a desk is not a product. Everything on the ESP side is low voltage and stays so; the module's optocouplers are what keep it that way. Reflashing or probing means opening the device: never while it is plugged in. If you are not trained, do not wire it: read a clip-on meter's display, or measure a DC or USB load with a low-voltage meter instead.

### 1. Requirements, with numbers

| What | Number |
|---|---|
| Measures | one circuit: voltage, current, active power, energy, frequency and power factor |
| Polls | the meter every 10 s; publishes each reading as one JSON message |
| Notices | a silent meter after 3 unanswered requests, and says "offline" (retained) |
| Isolation | no electrical connection between the mains and the ESP side; the module's optocouplers provide it |
| Accuracy | whatever the module delivers (of the order of one per cent for modules of this class); the ESP adds none |
| Power | the ESP from a 5 V supply; the monitor itself draws a fraction of a watt |

### 2. The chip, and why

The job needs Wi-Fi and one serial port, nothing more. [The project advisor](#/tools/advisor), given Wi-Fi and mains, ranks the **ESP32-C3** first (99), the ESP32 and C6 next (98 each) and the S3 (97): the "mains" need is about boards that carry relays, which this project does not use. Any of them works; the cheap one is enough. The board is the **XIAO ESP32C3** again, with a serial port on pins the pin planner chose. See [[modbus]] for the protocol the module speaks.

### 3. The circuit

A metering module of the PZEM-004T class has two sides: the mains side (live and neutral in, and a current input: a through hole, or a split-core clamp on higher-rated versions) and a low-voltage side with four pins: 5 V, ground, receive and transmit. Its serial port runs at 9600 baud, 8N1, and speaks Modbus RTU.

| Signal | Board pin | GPIO | Note |
|---|---|---|---|
| ESP transmit to the module's RX | D1 | 3 | pin planner |
| ESP receive from the module's TX | D10 | 10 | through a 10 kΩ and 20 kΩ divider to ground, unless your module's TX is 3.3 V |
| 5 V and ground | 5V, GND | | the module's low-voltage side needs 5 V |

Many modules of this class send on 5 V logic; the chip's pins take 3.6 V at most. The divider gives 5 × 20 / 30 = 3.3 V. Check your module's sheet ([[three-volt-logic]], [[level-shifters]], [[isolation-and-long-cables]]).

### 4. The behaviour as a state machine

**WAITING** for ten seconds; **ASKING**, where the request goes out and a reply is expected within half a second; **PUBLISHING**, where the numbers go to MQTT; and **NO_METER**, entered after three requests in a row went unanswered. In NO_METER the monitor publishes "offline" once, and every 30 seconds tries again. A meter that comes back is simply asked again. Operate it in the simulation: unplug the meter, take the broker down, and change the load. The same machine can be drawn, run and checked in [the state-machine lab](#/tools/fsmlab).

### 5. The program

The request is a Modbus frame of eight bytes: address 0xF8 (the module's universal address), function 4 (read input registers), start 0, count 10, and two bytes of CRC16 (here 0x64, 0x64, which the program computes anyway so that it can check the *reply*). The reply is 25 bytes: address, function, a byte count of 20, ten 16-bit registers, high byte first, and its CRC. Voltage is register 0 in tenths of a volt; current, power and energy are 32-bit values split over two registers, low half first: amps in thousandths, watts in tenths, energy in watt-hours; frequency in tenths of a hertz; power factor in hundredths. These are the module's register definitions; check yours ([[registers-and-datasheets]], [[json-on-a-microcontroller]]). The block version can be explored in [the block lab](#/tools/blocklab).

### 6. The power

The ESP32-C3 with Wi-Fi idle draws tens of milliamps: well under half a watt in all, about 4 kWh a year, more than a small load's own consumption, which is the irony of every energy monitor ([[wifi-power-save-and-dtim]]). Let the Wi-Fi sleep between polls, or measure several circuits with one board.

### 7. What to test, what goes wrong first, how to extend

Test the serial side before the mains side exists: connect a USB-serial adapter and answer the request by hand. Then test the module on a lamp of known power. What goes wrong first: the module's TX is 5 V and the pin is damaged; the CRC is sent high byte first; the module's address is not 0xF8; the energy counter wraps or is reset by the module's own command. Extend with several modules on one bus with their own addresses (an RS-485 adaptor, [[rs-485]]), daily totals in the broker, a cost per kilowatt-hour in the dashboard, and a "meter offline" notification ([[home-assistant-integration]]).

> [!key] Let a finished, isolated module touch the mains and keep the ESP on the safe side of its optocouplers. Ask for 25 bytes, check the CRC, count the misses, and give the silent meter a state of its own.`,
  ideas: [
    'The mains stays inside a finished, isolated module; the ESP only reads a serial port, so the dangerous part of the design is bought, not built.',
    'Modbus RTU is a request and a reply with a CRC: ask, wait a fixed time, check the checksum, and treat anything else as a miss.',
    'A meter that stops answering is a state, not an exception: count the misses, say "offline" once, and keep trying at a slow rate.',
    'The ESP\'s own consumption is a real part of the numbers it reports: a monitor should be frugal.'
  ],
  pitfalls: [
    'A voltage divider and a few resistors will measure mains — Wiring mains to your own board is dangerous and, without isolation and calibration, wrong. Use a finished isolated module or a clamp sensor.',
    'The module\'s serial pins are 3.3 V like the ESP\'s — Many modules transmit at 5 V. Check the sheet, and divide the line if in doubt: the chip\'s pins take 3.6 V at most.',
    'If the CRC is wrong, use the number anyway — A wrong checksum means a corrupted frame. A miss is cheap; a spike in the energy counter is not.'
  ],
  terms: [
    { term: 'Metering module', also: ['energy meter module', 'PZEM-004T'], def: 'A small board that measures mains voltage, current and energy with its own isolated front end, and reports them over a serial port. The microcontroller never touches the mains.' },
    { term: 'Modbus RTU', also: ['Modbus over serial'], def: 'A request and reply protocol over a serial line: a device address, a function code, data and a 16-bit CRC. Here the function reads a block of registers.' },
    { term: 'CRC16', also: ['cyclic redundancy check', 'checksum'], def: 'A 16-bit check value computed from the bytes of a frame. The receiver recomputes it; a mismatch means the frame was corrupted and must be dropped.' },
    { term: 'Power factor', also: ['PF', 'cos φ'], def: 'The ratio of the power doing work to the product of volts and amps. It is 1 for a resistive load and lower for motors and power supplies, whose current is out of step with the voltage.' }
  ],
  choose: {
    good: ['Measuring one circuit or one appliance with a ready-made isolated module', 'Home dashboards of consumption, with totals in kilowatt-hours', 'Learning Modbus on a cheap, well-documented device'],
    avoid: ['Building your own mains front end for a first project', 'Wiring a mains module without a qualified installer and an enclosure', 'Trusting a reading whose CRC failed'],
    check: ['The module\'s register map and address, from its own sheet', 'The logic level of its TX line', 'That the enclosure covers every mains terminal']
  },
  code: [
    {
      title: 'Ask the meter, check the answer, publish',
      about: 'Every ten seconds, sends the eight-byte Modbus request, reads the 25-byte reply, checks its CRC and publishes volts, amps, watts, kilowatt-hours, hertz and power factor as JSON. Three misses in a row publish "offline" (retained); the next good reply publishes "online".',
      needs: 'A XIAO ESP32C3 on 5 V, a PZEM-004T-class module installed by a qualified person (or, on the bench, a serial adapter that plays the meter), Wi-Fi and an MQTT broker; the PubSubClient library for Arduino. Never leave real credentials in shared code.',
      wiring: [['GPIO3 (D1)', 'module RX', 'ESP transmit'], ['GPIO10 (D10)', 'module TX through 10 kΩ and 20 kΩ to GND', 'ESP receive'], ['5V, GND', 'module low-voltage side', '']],
      libs: ['PubSubClient'],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on RX (10) TX (3)
          connect to Wi-Fi [your-ssid] password [your-secret]
          connect to MQTT broker [192.168.1.10]
          set [misses v] to (0)

        every (10) seconds
          UART write (F8 04 00 00 00 0A 64 64) :: bus
          set [reply v] to (UART read (25) bytes within (0.3) seconds :: bus)
          if <<(length of (reply)) = (25)> and <CRC16 of (reply) is valid :: bus>> then
            set [volts v] to ((word (1) of (reply)) / (10))
            set [watts v] to ((32-bit value of words (4) (5) of (reply)) / (10))
            publish (join [{"v":] (volts) [,"w":] (watts) [}]) to topic [home/energy/main]
            if <(misses) ≥ (3)> then
              publish [online] to topic [home/energy/main/status] retained :: mqtt
            end
            set [misses v] to (0)
          else
            change [misses v] by (1)
            if <(misses) = (3)> then
              publish [offline] to topic [home/energy/main/status] retained :: mqtt
            end
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid", *PASS = "your-password", *BROKER = "192.168.1.10";
        const int PIN_TX = 3, PIN_RX = 10;                         // from the pin planner, XIAO ESP32C3
        const uint8_t REQUEST[8] = {0xF8, 0x04, 0x00, 0x00, 0x00, 0x0A, 0x64, 0x64};   // read 10 input registers; CRC last

        NetworkClient net;
        PubSubClient mqtt(net);
        int misses = 0;

        uint16_t crc16(const uint8_t *p, int n) {                  // Modbus CRC: low byte goes first on the wire
          uint16_t crc = 0xFFFF;
          for (int i = 0; i < n; i++) {
            crc ^= p[i];
            for (int b = 0; b < 8; b++) crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : crc >> 1;
          }
          return crc;
        }

        bool readMeter(float &volts, float &amps, float &watts, float &kwh, float &hz, float &pf) {
          uint8_t buf[25];
          while (Serial1.available()) Serial1.read();              // drop stale bytes
          Serial1.write(REQUEST, sizeof(REQUEST));
          if (Serial1.readBytes(buf, 25) != 25) return false;      // time-out: no reply
          if (crc16(buf, 23) != (uint16_t)(buf[23] | (buf[24] << 8))) return false;
          auto reg = [&](int i) { return (uint32_t)((buf[3 + 2 * i] << 8) | buf[4 + 2 * i]); };
          volts = reg(0) / 10.0;
          amps = ((reg(2) << 16) | reg(1)) / 1000.0;               // 32 bits over two registers, low half first
          watts = ((reg(4) << 16) | reg(3)) / 10.0;
          kwh = ((reg(6) << 16) | reg(5)) / 1000.0;                // the module counts watt-hours
          hz = reg(7) / 10.0;
          pf = reg(8) / 100.0;
          return true;
        }

        void setup() {
          Serial1.begin(9600, SERIAL_8N1, PIN_RX, PIN_TX);
          Serial1.setTimeout(300);                                 // wait up to 300 ms for the reply
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
        }

        void loop() {
          if (!mqtt.connected()) mqtt.connect("energy-monitor");
          mqtt.loop();
          static uint32_t last = 0;
          if (millis() - last < 10000) return;
          last = millis();
          float v, a, w, kwh, hz, pf;
          if (!readMeter(v, a, w, kwh, hz, pf)) {
            if (++misses == 3) mqtt.publish("home/energy/main/status", "offline", true);
            return;
          }
          if (misses >= 3) mqtt.publish("home/energy/main/status", "online", true);
          misses = 0;
          char msg[128];
          snprintf(msg, sizeof(msg), "{\"v\":%.1f,\"a\":%.3f,\"w\":%.1f,\"kwh\":%.3f,\"hz\":%.1f,\"pf\":%.2f}", v, a, w, kwh, hz, pf);
          mqtt.publish("home/energy/main", msg);
        }
      `,
      py: String.raw`
        import network, struct, time
        from machine import UART
        from umqtt.simple import MQTTClient

        SSID, PASS, BROKER = "your-ssid", "your-password", "192.168.1.10"
        PIN_TX, PIN_RX = 3, 10                       # from the pin planner, XIAO ESP32C3
        REQUEST = bytes([0xF8, 0x04, 0x00, 0x00, 0x00, 0x0A, 0x64, 0x64])   # read 10 input registers; CRC last

        def crc16(data):                             # Modbus CRC: low byte goes first on the wire
            crc = 0xFFFF
            for byte in data:
                crc ^= byte
                for _ in range(8):
                    crc = (crc >> 1) ^ 0xA001 if crc & 1 else crc >> 1
            return crc

        def read_meter(uart):
            while uart.any():
                uart.read()                          # drop stale bytes
            uart.write(REQUEST)
            buf = uart.read(25)                      # waits up to the 300 ms time-out
            if buf is None or len(buf) != 25:
                return None                          # no reply
            if crc16(buf[:23]) != buf[23] | (buf[24] << 8):
                return None
            r = struct.unpack(">10H", buf[3:23])     # ten registers, high byte first
            return {"v": r[0] / 10, "a": ((r[2] << 16) | r[1]) / 1000,      # 32 bits over two registers, low half first
                    "w": ((r[4] << 16) | r[3]) / 10, "kwh": ((r[6] << 16) | r[5]) / 1000,
                    "hz": r[7] / 10, "pf": r[8] / 100}

        uart = UART(1, baudrate=9600, tx=PIN_TX, rx=PIN_RX, timeout=300)
        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect(SSID, PASS)
        while not sta.isconnected():
            time.sleep_ms(250)
        mqtt = MQTTClient("energy-monitor", BROKER, keepalive=60)
        mqtt.connect()
        misses = 0

        while True:
            m = read_meter(uart)
            if m is None:
                misses += 1
                if misses == 3:
                    mqtt.publish(b"home/energy/main/status", b"offline", retain=True)
            else:
                if misses >= 3:
                    mqtt.publish(b"home/energy/main/status", b"online", retain=True)
                misses = 0
                body = '{"v":%.1f,"a":%.3f,"w":%.1f,"kwh":%.3f,"hz":%.1f,"pf":%.2f}' % (m["v"], m["a"], m["w"], m["kwh"], m["hz"], m["pf"])
                mqtt.publish(b"home/energy/main", body.encode())
            time.sleep(10)
      `,
      output: `
        home/energy/main  {"v":231.4,"a":1.482,"w":322.5,"kwh":18.274,"hz":50.0,"pf":0.94}
        home/energy/main/status  offline    (after three silent polls)
      `,
      notes: ['If the divider is left out and the module\'s TX is 5 V, the receive pin is stressed beyond its rating: check the module\'s sheet before wiring.', 'The request is a constant, its CRC included. The program computes a CRC only to verify the reply; a bench test with a serial adapter plays the meter by sending a valid 25-byte frame.', 'A published reading is not retained, since an old power value is a lie; the status topic is retained, since "offline" must be seen by a dashboard that starts later.']
    }
  ],
  examples: [
    {
      title: 'Decode a reply by hand',
      q: 'The registers read 2314, 1482, 0, 3225, 0, 18274, 0, 500, 94 and 0. What does the meter say?',
      steps: ['Voltage: $2314 / 10 = 231.4$ V.', 'Current: low half 1482, high half 0: $1482 / 1000 = 1.482$ A.', 'Power: 3225 in tenths: 322.5 W; check: $231.4 \\times 1.482 \\times 0.94 = 322$ W.', 'Energy: 18274 Wh = 18.274 kWh; frequency 500 / 10 = 50.0 Hz; power factor 94 / 100 = 0.94.'],
      a: '231.4 V, 1.482 A, 322.5 W, 18.274 kWh, 50.0 Hz, power factor 0.94. The power agrees with volts times amps times power factor.'
    }
  ],
  quiz: [
    { q: 'Why is the module a better idea than a divider and the ESP\'s ADC for mains?', choices: ['It is cheaper', 'It is isolated from the mains and calibrated, so the ESP never touches a dangerous voltage', 'ADCs cannot read 50 Hz', 'Dividers need a battery'], a: 1, why: 'A divider would put mains on your board and, without isolation, in your hand. The module\'s optocouplers keep the ESP side at low voltage, and it comes calibrated.' },
    { q: 'The reply is 25 bytes but its CRC does not match. What should the program do?', choices: ['Publish it anyway', 'Count a miss and drop the frame', 'Restart the ESP', 'Swap the byte order of the numbers'], a: 1, why: 'A wrong CRC means the frame was corrupted. Using it could publish a nonsense power or energy value; dropping it costs only one reading.' },
    { q: 'The register for power is split over two 16-bit registers. Which half comes first, and what is the unit?', choices: ['High half first, in watts', 'Low half first, in tenths of a watt', 'Low half first, in kilowatts', 'High half first, in tenths of a watt'], a: 1, why: 'The module sends the low half of each 32-bit value first; power is in tenths of a watt, current in thousandths of an amp, energy in watt-hours.' },
    { q: 'Why is the status message retained but the power reading not?', choices: ['To save memory', 'A late dashboard must see "offline", but an old power value would be a lie', 'Because MQTT forbids retaining numbers', 'No reason'], a: 1, why: 'A retained status describes a lasting condition. A retained power reading would present an old measurement as the present one.' }
  ],
  applications: [
    'Whole-house or sub-circuit consumption in a home dashboard, with daily and monthly totals.',
    'Monitoring the electricity use of a freezer, a workshop machine or a pump to spot faults early.',
    'Checking what a standby load really costs, with the numbers in kilowatt-hours.',
    'The same read-a-register pattern with any Modbus meter, over RS-485 for many devices on one cable.'
  ],
  sources: [
    'Modbus Organization, *Modbus Application Protocol Specification* and *Modbus over Serial Line*: function 4, the CRC and the framing.',
    'The datasheet of the metering module you buy: its register map, default address, baud rate and logic level.',
    'Espressif, *ESP-IDF Programming Guide*, UART: pins and timing on the ESP32-C3.'
  ],
  sim: 'wp-energy'
}
);
