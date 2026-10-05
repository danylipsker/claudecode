/* HYPER-ESP32 · content/the-soc-series.js
 *
 * The chips, one by one: the family at a glance, then one page for every chip, built like soc-esp32-c3 (in reference.js).
 * Every number and every virtue or limit comes from the chip catalogue (October 2026), not from memory.
 * Chips whose figures Espressif has not published (H4, H21, E22) say "not published at the time of writing".
 */
Hyper.add(
/* ================================================================ the overview */
{
  id: 'the-family-at-a-glance',
  parent: 'the-soc-series',
  title: 'The family at a glance',
  level: 1,
  short: `Fifteen chips carry the ESP name by October 2026. They differ in cores, radios, pins and price class — and these differences, not the logo, decide which one a project needs. One table, one filter and one family tree.`,
  keywords: ['ESP32 family', 'chip comparison', 'which ESP32', 'ESP32 variants', 'S series', 'C series', 'H series', 'P4', 'compare chips', 'Wi-Fi 6', 'Bluetooth Classic', 'Zigbee', 'family tree', 'ESP8266 successor'],
  prereq: ['reading-the-family-names', 'chip-module-board'],
  related: ['choosing-a-chip', 'soc-esp32-c3', 'soc-esp32-s3', 'soc-esp32-c6', 'the-newest-chips', 'product-lifecycle-and-longevity'],
  body: `"ESP32" is a family name, not one chip. By October 2026 Espressif has put fifteen chips under it, and they differ in ways that decide a project: how many processor cores, which radios, how many pins, whether the chip can pose as a USB keyboard, hold a camera picture in memory or run a year on a coin cell. This page is the map. Each chip has a page of its own; [the chip explorer](#/tools/chips) puts any two side by side, number by number.

### The family in one table

| Chip | Year | Processor | Radios | GPIOs | Choose it for |
|---|---|---|---|---|---|
| [[soc-esp8266|ESP8266]] | 2014 | 1 × 160 MHz | Wi-Fi 4 | 17 | repairing old designs — not for new ones |
| [[soc-esp32|ESP32]] | 2016 | 2 × 240 MHz | Wi-Fi 4, Bluetooth Classic + LE 4.2 | 34 | Bluetooth audio; the biggest software base |
| [[soc-esp32-s2|ESP32-S2]] | 2019 | 1 × 240 MHz | Wi-Fi 4 | 43 | Wi-Fi with native USB and two DACs |
| [[soc-esp32-s3|ESP32-S3]] | 2020 | 2 × 240 MHz | Wi-Fi 4, LE 5 | 45 | cameras, displays, AI, USB |
| [[soc-esp32-c3|ESP32-C3]] | 2020 | 1 × 160 MHz | Wi-Fi 4, LE 5 | 22 | cheap Wi-Fi and BLE sensors and switches |
| [[soc-esp32-c6|ESP32-C6]] | 2021 | 1 × 160 MHz | Wi-Fi 6, LE 5.3, Zigbee, Thread | 30 | smart home and Matter |
| [[soc-esp32-h2|ESP32-H2]] | 2021 | 1 × 96 MHz | LE 5.3, Zigbee, Thread | 19 | mesh nodes on coin cells |
| [[soc-esp32-c2|ESP32-C2]] | 2022 | 1 × 120 MHz | Wi-Fi 4, LE 5.3 | 14 | the smallest and cheapest, in volume |
| [[soc-esp32-p4|ESP32-P4]] | 2023 | 2 × 400 MHz | none | 55 | screens, cameras and video |
| [[soc-esp32-c5|ESP32-C5]] | 2025 | 1 × 240 MHz | Wi-Fi 6 on 2.4 and 5 GHz, LE 6.0, Zigbee, Thread | 29 | getting out of the crowded 2.4 GHz band |
| [[soc-esp32-c61|ESP32-C61]] | 2025 | 1 × 160 MHz | Wi-Fi 6, LE 6.0 | 30 | low-cost Wi-Fi 6 with PSRAM |
| [[the-newest-chips|ESP32-S31]] | 2026 | 2 × 320 MHz | Wi-Fi 6, Classic + LE 5.4, Zigbee, Thread | 60 | every radio at once (software in preview) |

The ESP32-H4, ESP32-H21 and ESP32-E22 are still sampling or only announced; [[the-newest-chips|their page]] covers them.

### Four families inside the family

The **S series** (Xtensa cores) are the big all-rounders with plenty of pins and peripherals. The **C series** (RISC-V) are the cost-conscious Wi-Fi and Bluetooth chips. The **H series** drop Wi-Fi to run Zigbee and Thread on very little current. The **P series** is a fast processor with no radio at all.

### Five questions that narrow it down

1. **Bluetooth audio or classic serial Bluetooth?** Only the ESP32 has Bluetooth Classic.
2. **Zigbee, Thread or Matter over Thread?** The C6, C5 or H2 (the H2 has no Wi-Fi).
3. **5 GHz Wi-Fi?** The C5 is the one in mass production.
4. **A camera, a big display, USB devices or machine learning?** The S3 — or the P4 where video and a MIPI display matter and a radio can come from a companion chip.
5. **Just cheap Wi-Fi?** The C3, or the C2 where size and cost count more than pins.

> [!key] The family splits by radio and by muscle: S for pins and peripherals, C for low cost, H for mesh without Wi-Fi, P for screens and cameras. Start from the one thing the project cannot do without, and the list of chips usually shrinks to two.`,
  ideas: [
    `The name "ESP32" covers fifteen different chips with different cores, radios and pin counts.`,
    `The letter says the family: S for the big all-rounders, C for low cost, H for Zigbee and Thread without Wi-Fi, P for processing without a radio.`,
    `Only the original ESP32 (and the new S31) has Bluetooth Classic; only the C5 has 5 GHz Wi-Fi in mass production.`,
    `Product status matters: a chip may be in mass production, sampling, merely announced, or retired for new designs.`
  ],
  pitfalls: [
    `A newer chip is better than an older one — Each chip is built for a job. The C3 is newer than the ESP32 and cannot stream Bluetooth audio; the H2 has no Wi-Fi at all; the S2 has no Bluetooth.`,
    `All ESP32 chips run the same programs — The source code is often portable, but a program that uses the second core, the DAC, Bluetooth Classic or a camera needs a chip that has them.`,
    `The most powerful chip is the safe choice — The P4 is the fastest and has no radio; the S31 has every radio and only preview software. "Safe" means the one whose software and boards are mature for your job.`
  ],
  terms: [
    { term: `Product status`, also: [`mass production`, `announced`], def: `Where a chip is in its life: announced, sampling, in mass production, or retired for new designs, after which it is still sold but no new product should start with it.` },
    { term: `Sampling`, also: [`engineering samples`], def: `The stage when a chip is made in small numbers for customers to try. It may have no public datasheet, and its software support can still change.` },
    { term: `Co-processor`, also: [`connectivity co-processor`, `radio co-processor`], def: `A chip that does one job for another processor, typically the whole Wi-Fi and Bluetooth stack for a host that has no radio of its own.` }
  ],
  choose: {
    good: [`Starting a project and wanting the short list before reading datasheets`, `Comparing a chip you know with the one a board listing names`, `Finding which chips have a feature at all — then reading their pages`],
    avoid: [`Choosing on release year or on clock speed alone`, `Starting a first project on a chip whose software is still in preview`, `Assuming a feature exists because a neighbouring chip has it`],
    check: [`The status of the chip: mass production, sampling or announced`, `That your framework (Arduino, MicroPython, ESP-IDF) supports the chip`, `The pins and radios you really need, in the table of the chip's own page`]
  },
  examples: [
    {
      title: `Four ideas, four chips`,
      q: `Pick a chip for each idea: (a) a temperature sensor on a coin cell reporting to a Thread network, (b) a speaker that plays music from a phone, (c) a touch-screen thermostat with a camera for presence, (d) a cheap Wi-Fi plug.`,
      steps: [`(a) needs Thread and very low current: the ESP32-H2 (no Wi-Fi needed; a border router bridges to the network).`, `(b) streaming from a phone uses Bluetooth Classic: only the original ESP32 has it.`, `(c) a camera and a display need PSRAM and the camera and LCD interfaces: the ESP32-S3.`, `(d) Wi-Fi, a relay and little else: the ESP32-C3 — or the C2 where the last cent counts.`],
      a: `H2, ESP32, S3, C3 — four different answers, and each follows from one feature the idea cannot do without.`
    }
  ],
  quiz: [
    { q: `A project must stream music from a phone to a speaker. Which chip family member can do it?`, choices: [`ESP32-C3`, `ESP32-S3`, `The original ESP32`, `ESP32-H2`], a: 2, why: `Music streaming (A2DP) is a Bluetooth Classic profile, and of the chips in mass production only the original ESP32 has Bluetooth Classic. The newest S31 has it too but its software is still in preview.` },
    { q: `Why would anyone choose the ESP32-H2, which has no Wi-Fi?`, choices: [`It is faster than the C6`, `Without a Wi-Fi radio it draws far less current and suits Zigbee and Thread nodes on small batteries`, `It has more pins than the S3`, `It supports Bluetooth Classic`], a: 1, why: `The H2 receives at about 25 mA instead of 80 mA or more, and its job is Zigbee, Thread and Bluetooth LE. A border router or hub carries the data to the network.` },
    { q: `The ESP32-P4 can join a Wi-Fi network without any other chip.`, a: false, why: `The P4 has no radio. Boards that give it wireless add a companion chip, usually an ESP32-C6.` },
    { q: `Which is the only chip of the family in mass production with 5 GHz Wi-Fi?`, choices: [`ESP32-C6`, `ESP32-C5`, `ESP32-S3`, `ESP32-C61`], a: 1, why: `The C5 is the dual-band Wi-Fi 6 chip. The C6 and C61 are Wi-Fi 6 on 2.4 GHz only; the E22 has more bands but is a co-processor still in sampling.` }
  ],
  applications: [
    `Choosing the chip at the start of a product, before boards and parts are picked.`,
    `Reading a board listing: the chip named in it tells you more than its price or its colour.`,
    `Planning a family of products that share firmware but differ in radios or pins.`,
    `Teaching: the table is the quickest way to see what each generation added.`
  ],
  history: `The family began with the ESP8266 in 2014, grew into the ESP32 in 2016, and from 2019 split into series: S for the Xtensa all-rounders, C for low-cost RISC-V, H for 802.15.4-only parts, P for the processor with no radio.`,
  sources: [
    `Espressif, product pages and datasheets of each chip in the family, as listed in the chip explorer (compiled October 2026).`,
    `Espressif, *ESP-IDF Programming Guide*, the versions page with its table of supported chips and their status.`,
    `Espressif, *ESP32 Series Datasheet* and the datasheets of the S2, S3, C-series, H-series and P4 chips.`
  ],
  sim: ['so-family-grid', 'so-family-tree', 'so-family-bars']
},

/* ================================================================ ESP8266 */
{
  id: 'soc-esp8266',
  parent: 'the-soc-series',
  title: `ESP8266: where it began`,
  level: 1,
  short: `The low-cost Wi-Fi chip of 2014 that started everything: 160 MHz, Wi-Fi 4 only, no Bluetooth, no hardware security, one analogue pin. Not recommended for new designs since November 2025 — yet millions of devices and a mountain of tutorials still rely on it.`,
  keywords: ['ESP8266', 'ESP8285', 'ESP-01', 'ESP-12', 'NodeMCU', 'D1 mini', 'Wemos', 'LOLIN', 'Tensilica L106', 'NRND', 'not recommended for new designs', 'esp8266 arduino core', 'Tasmota', 'first ESP'],
  prereq: ['espressif-and-its-history', 'chip-module-board'],
  related: ['soc-esp32-c2', 'soc-esp32-c3', 'nodemcu-and-doit-boards', 'lolin-d1-mini-family', 'esp-01-and-esp-12', 'shelly-sonoff-and-smart-plugs', 'product-lifecycle-and-longevity'],
  body: `In 2014 a Shanghai company sold a Wi-Fi module so cheap that hobbyists bought it by the dozen, and they discovered that the little chip on it was a complete computer: a 32-bit processor at 80 MHz (160 MHz when asked), Wi-Fi, a handful of pins and enough memory to run a web server. The **ESP8266** made cheap Internet-connected gadgets possible, and nearly everything in this family descends from it. Since the datasheet of November 2025 Espressif calls it *not recommended for new designs* and points to the ESP32-C2.

### What it gives

| | ESP8266 |
|---|---|
| Processor | 1 × Tensilica L106 at 160 MHz, no floating-point unit |
| Memory | 160 KB RAM, under 50 KB of it left for your program when Wi-Fi is on; no flash inside the plain chip |
| Radio | Wi-Fi 4 (802.11 b/g/n), 2.4 GHz, 20 MHz channels, up to 72.2 Mbit/s · no Bluetooth |
| Pins | 17 GPIOs · strapping: GPIO0, 2, 15 · GPIO6–11 are the flash |
| Analogue | one 10-bit ADC on a dedicated pin, 0–1.0 V on the bare chip · no DAC · no touch |
| Buses | 2 UART (UART1 sends only) · I2C and PWM done in software · 2 SPI (one serves the flash) · 1 I2S |
| Power | 2.5–3.6 V · about 20 µA in deep sleep · 56 mA receiving · 170 mA transmitting at +20 dBm |
| Security | none in hardware: no secure boot, no flash encryption, no crypto accelerators |

The **ESP8285** is the same chip with 1 or 2 MB of flash in the package — it is what hides inside many smart plugs and bulbs.

### What makes it pleasant

**It is everywhere.** The NodeMCU, the LOLIN (Wemos) D1 mini and the ESP-01 made it the first ESP most people held, so almost any problem has been solved in a forum post. It also handles Wi-Fi well, sleeps at 20 µA, and works from −40 to 125 °C — a wider range than most of its successors.

### What it lacks

No Bluetooth and only 72.2 Mbit/s of Wi-Fi 4. Under 50 KB of working memory once the network is up, a single analogue input that tops out at 1 V, I2C and PWM that cost processor time, and no hardware security whatever. The chip is **not supported by ESP-IDF or the main Arduino core**: it has its own Arduino core (esp8266/Arduino), its own SDK and a MicroPython build, so a program written for an ESP32 does not simply recompile. GPIO16 is the only pin that can wake it from deep sleep, and that pin cannot raise interrupts.

### Where it sits in the family

Below it there is nothing; above it, the [[soc-esp32-c2|ESP32-C2]] is the named upgrade (the same class of price, more modern radio, hardware security), and the [[soc-esp32-c3|ESP32-C3]] is what most new projects use instead. Keep the ESP8266 for what already exists: repairing a plug, extending a project that works, or a tutorial that is written for it.

> [!key] The ESP8266 started the family and is now a legacy part: Wi-Fi only, no Bluetooth, no hardware security, a separate software world. Learn from its tutorials, but start new designs on a C3 or C2.`,
  ideas: [
    `The ESP8266 is a complete Wi-Fi microcontroller at 160 MHz with 17 pins, and it started the whole family in 2014.`,
    `It has no Bluetooth, no hardware security, one 10-bit analogue input and software-only I2C and PWM.`,
    `Since November 2025 it is not recommended for new designs; Espressif names the ESP32-C2 as its upgrade.`,
    `It runs on its own SDK and Arduino core, not on ESP-IDF or the ESP32 core.`
  ],
  pitfalls: [
    `The ESP8266 is just a slower ESP32 and runs the same code — It is a different processor with a different SDK and a separate Arduino core. Libraries and sketches often need changes, and some ESP32 features (Bluetooth, LEDC, touch, DAC) do not exist.`,
    `The analogue pin reads 0 to 3.3 V — The bare chip's ADC reads 0–1.0 V. Many boards add a divider (the D1 mini accepts about 3.2 V), but a bare module needs one of your own.`,
    `Any pin can wake it from deep sleep — Only GPIO16, wired to the reset pin; the other pins cannot.`
  ],
  terms: [
    { term: `ESP8285`, also: [`ESP8285H16`], def: `The ESP8266 with 1 or 2 MB of flash memory built into the package, so a module needs no separate flash chip. It is found inside many low-cost smart plugs and bulbs.` },
    { term: `Not recommended for new designs`, also: [`NRND`], def: `A manufacturer's notice that a part is still sold but should not start a new product, because a better part replaces it and its availability may end.` },
    { term: `ESP8266 Arduino core`, also: [`esp8266/Arduino`], def: `The community-run Arduino support for the ESP8266. It is separate from the ESP32 core, so board packages, libraries and a few function names differ between the two.` },
    { term: `Deep-sleep wake pin`, also: [`GPIO16`, `XPD_DCDC`], def: `On the ESP8266 the only pin that can wake the chip from deep sleep. It must be connected to the reset pin for a timed wake-up to work.` }
  ],
  choose: {
    good: [`Keeping a working ESP8266 product or repair alive`, `Following a tutorial or running ESPHome or Tasmota on an existing device`, `A throw-away Wi-Fi gadget where an old D1 mini is already on the shelf`],
    avoid: [`Any new product: choose the ESP32-C2 or C3`, `Bluetooth, USB, touch, a DAC or an Ethernet MAC: it has none`, `Anything that needs security features, secure boot or encrypted flash`],
    check: [`That your library supports the ESP8266 core, not only the ESP32 one`, `The 1 V limit of the analogue input and whether your board divides it`, `Which of GPIO0, 2 and 15 your board's circuit holds at power-up`]
  },
  code: [
    {
      title: `Blink with an active-low LED`,
      about: `The on-board LED of a D1 mini or a NodeMCU lights when the pin is **low**. This blinks it once a second; note that the levels are the opposite of what you might expect.`,
      needs: `An ESP8266 board with its LED on GPIO2 (LOLIN D1 mini; many NodeMCU boards have one there too, the Amica NodeMCU also one on GPIO16). Arduino: the ESP8266 core, not the ESP32 core.`,
      wiring: [[`GPIO2`, `the on-board LED, between 3.3 V and the pin`, `lit when the pin is LOW`], [`USB`, `computer`]],
      blocks: `
        when started
          set pin (2) as [output v]
        forever
          set pin (2) to [LOW v]      // active low: LOW switches the LED on
          wait (0.2) seconds
          set pin (2) to [HIGH v]     // HIGH switches it off
          wait (0.8) seconds
        end
      `,
      cpp: String.raw`
        const int LED = 2;               // GPIO2 (D4 on the D1 mini)

        void setup() {
          pinMode(LED, OUTPUT);
        }

        void loop() {
          digitalWrite(LED, LOW);        // active low: LOW switches the LED on
          delay(200);
          digitalWrite(LED, HIGH);       // HIGH switches it off
          delay(800);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)            # GPIO2 (D4 on the D1 mini)

        while True:
            led.value(0)                 # active low: 0 switches the LED on
            time.sleep_ms(200)
            led.value(1)                 # 1 switches it off
            time.sleep_ms(800)
      `,
      notes: [`GPIO2 is a strapping pin that must be high at reset: that is why the LED, wired to 3.3 V, is harmless there.`, `Install the "ESP8266" board package from the ESP8266 community, not the Espressif ESP32 one; in MicroPython use the ESP8266 firmware image.`]
    }
  ],
  quiz: [
    { q: `A designer starts a new battery-powered Wi-Fi sensor. What does the ESP8266 datasheet itself recommend?`, choices: [`Use the ESP8266 with a bigger battery`, `Use the ESP32-C2 (ESP8684) instead`, `Add Bluetooth with an external chip`, `Wait for a newer ESP8266 revision`], a: 1, why: `Since the November 2025 datasheet the ESP8266 is marked not recommended for new designs, and Espressif names the ESP32-C2 as the upgrade.` },
    { q: `An ESP8266 module's analogue input is wired straight to a 3.3 V sensor. What is the risk?`, choices: [`None: the pin accepts 3.3 V`, `The reading saturates and the pin may be stressed: the bare chip reads only 0–1.0 V`, `The sensor draws too much current`, `The Wi-Fi stops`], a: 1, why: `The ADC pin of the bare ESP8266 has a 1.0 V range. Boards like the D1 mini add a divider; a bare module needs one.` },
    { q: `The ESP8266 can be programmed with ESP-IDF.`, a: false, why: `It is not supported by ESP-IDF or by the standard Arduino-ESP32 core. It uses its own SDK and a separate Arduino core.` },
    { q: `On a D1 mini the LED is on GPIO2 and lights when the pin is low. What does digitalWrite(2, HIGH) do?`, choices: [`Switches the LED on`, `Switches the LED off`, `Resets the chip`, `Nothing: GPIO2 is input-only`], a: 1, why: `The LED sits between 3.3 V and the pin; with the pin high there is no voltage across it, so it is off.` }
  ],
  applications: [
    `NodeMCU and D1 mini boards, the first ESP that millions of makers used.`,
    `Smart plugs, bulbs and switches of the late 2010s, often with an ESP8285 inside.`,
    `ESP-01 modules adding Wi-Fi to an Arduino Uno through AT commands.`,
    `Hobby firmware such as Tasmota and ESPEasy running on old hardware.`
  ],
  history: `Released in 2014 as a Wi-Fi serial adapter, it was adopted by makers within months, who found that it could run programs of their own; a community-built Arduino core followed. Its successor, the ESP32, came in 2016; the November 2025 datasheet marks it as not recommended for new designs.`,
  sources: [
    `Espressif, *ESP8266EX Datasheet* (the November 2025 version marks it not recommended for new designs).`,
    `ESP8266 Arduino core documentation (the esp8266/Arduino project), pin and GPIO notes.`,
    `MicroPython documentation, *Quick reference for the ESP8266*.`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp8266' } }, { id: 'so-migrate', params: { from: 'esp8266', to: 'esp32-c2' } }]
},

/* ================================================================ ESP32 */
{
  id: 'soc-esp32',
  parent: 'the-soc-series',
  title: `ESP32: the classic`,
  level: 1,
  short: `Two cores at 240 MHz, Wi-Fi 4, and the only widely available chip with Bluetooth Classic as well as Low Energy. Two real DACs, Ethernet, CAN and 34 pins: the chip that made the family famous and still has the most software.`,
  keywords: ['ESP32', 'WROOM', 'WROVER', 'Xtensa LX6', 'Bluetooth Classic', 'A2DP', 'SPP', 'DAC', 'dual core', 'ESP32-D0WD', 'ESP32-U4WDH', 'DevKitC', 'original ESP32', 'classic ESP32'],
  prereq: ['reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp32-s3', 'soc-esp32-s2', 'esp32-devkitc', 'safe-pins-esp32', 'bluetooth-classic-spp-and-a2dp', 'dac-output', 'adc1-adc2-and-wifi', 'can-bus-twai', 'ethernet'],
  body: `The ESP32 of 2016 is the chip that most tutorials and libraries were written around. It has two processor cores at 240 MHz, 520 KB of RAM, Wi-Fi 4 and — alone among the chips in common use — **both kinds of Bluetooth**: Low Energy and Bluetooth Classic. If a project streams music to a phone speaker or talks to an old serial Bluetooth device, it starts here.

### What it gives

| | ESP32 |
|---|---|
| Processor | 2 × Xtensa LX6 at 240 MHz with a floating-point unit · a small ULP coprocessor for sleep |
| Memory | 520 KB RAM, 448 KB ROM, 16 KB that survives deep sleep · flash and PSRAM on the module (some chips hold 4 MB flash or 2 MB PSRAM inside) |
| Radio | Wi-Fi 4 (20 or 40 MHz channels, up to 150 Mbit/s) · Bluetooth Classic and Bluetooth LE 4.2 |
| Pins | 34 GPIOs · strapping: GPIO0, 2, 5, 12, 15 · GPIO34–39 input only · GPIO6–11 are the flash |
| Analogue | 18 ADC channels, 12 bit · 2 DACs, 8 bit (GPIO25, GPIO26) · 10 touch pins |
| Buses | 3 UART · 2 I2C · 2 SPI for you · 2 I2S · 1 CAN (TWAI) · 8 RMT · 16 PWM · 2 motor PWM · 8 pulse counters |
| Also | Ethernet MAC (RMII) · SD/MMC host and slave · camera interface through I2S |
| Power | 3.0–3.6 V · about 10 µA in deep sleep · up to 240 mA transmitting |
| Security | secure boot (version 2 from chip revision 3), AES-256 flash encryption, AES, SHA, RSA and random-number hardware |

### What makes it pleasant

**Bluetooth Classic.** A2DP audio, the serial profile (SPP) and hands-free all work, on a chip that costs little.

**A huge ecosystem.** More tutorials, libraries and examples have been written for the original ESP32 than for any other chip of the family, so a problem has nearly always been met before.

**Real peripherals.** Two true 8-bit DACs, 18 analogue channels, an Ethernet MAC, a CAN controller and two cores at 240 MHz with a floating-point unit are generous for the price.

### What it lacks

Its Bluetooth is version 4.2: no 2 Mbit/s mode, no long-range coded mode, no extended advertising. **ADC2 cannot be read while Wi-Fi runs**, and the converter is nonlinear. There is **no native USB**, so every board needs a USB-to-serial bridge chip. It has no Wi-Fi 6, no 5 GHz and no 802.15.4. Security is weaker than on later chips: no Digital Signature, no HMAC peripheral, and Secure Boot V2 only from chip revision 3. The Hall sensor and temperature sensor are no longer specified.

The pins ask for care: GPIO12 is a flash-voltage strapping pin that bites often ([[strapping-pins|strapping pins]]), GPIO34–39 have no output and no pull resistors, and GPIO6–11 belong to the flash.

### Where it sits in the family

The [[soc-esp32-s3|ESP32-S3]] is its successor for new work — two cores again, Bluetooth LE 5, USB, PSRAM — but gives up Classic Bluetooth, the DAC and the Ethernet MAC. The [[soc-esp32-c3|ESP32-C3]] is cheaper and sleeps deeper but is a smaller chip in every way. Only the new ESP32-S31 shares its Bluetooth Classic.

> [!key] The ESP32 is the mature, generous, well-documented chip, and the only common one with Bluetooth Classic and a DAC. Choose it for Bluetooth audio, a CAN or Ethernet project, or when a library or board exists only for it; otherwise the S3 or a C-series chip is the modern pick.`,
  ideas: [
    `Two 240 MHz cores, 520 KB of RAM and Wi-Fi 4: the chip that made the family famous.`,
    `It is the only common chip with Bluetooth Classic (audio, serial) besides Low Energy 4.2.`,
    `Two 8-bit DACs, 18 ADC channels, Ethernet and CAN come built in; native USB and Wi-Fi 6 do not.`,
    `ADC2 shares hardware with Wi-Fi, and GPIO12 and GPIO34–39 need special care.`
  ],
  pitfalls: [
    `Newer ESP32 chips do everything the original does — Only the ESP32 has Bluetooth Classic, an Ethernet MAC and a DAC together; the S3 has none of them, the C3 none either.`,
    `All 18 analogue pins work with Wi-Fi on — Ten of them are on ADC2, which the Wi-Fi driver takes. Use ADC1 (GPIO32–39) when the radio is on.`,
    `GPIO34–39 are ordinary pins — They are input only, with no pull-up or pull-down. Do not plan an output, an LED or a button with internal pull-up there.`
  ],
  terms: [
    { term: `Bluetooth Classic`, also: [`BR/EDR`, `A2DP`, `SPP`, `HFP`], def: `The older, higher-rate form of Bluetooth used for audio streaming (A2DP), serial links (SPP) and hands-free calls (HFP). Distinct from Bluetooth Low Energy and not interoperable with it. Of the chips in mass production only the ESP32 has it.` },
    { term: `DAC`, also: [`digital-to-analogue converter`], def: `A circuit that turns a number into a voltage. The ESP32 has two 8-bit DACs on GPIO25 and GPIO26 that give 0 to about 3.3 V in 256 steps.` },
    { term: `TWAI`, also: [`CAN`, `Two-Wire Automotive Interface`], def: `Espressif's name for its CAN controller, the bus of cars and machines. It needs an external transceiver chip to drive the bus wires.` },
    { term: `ADC2 and Wi-Fi`, also: [`ADC2 conflict`], def: `On the original ESP32 the second analogue converter (ADC2) is also used by the Wi-Fi radio, so its channels cannot be read while Wi-Fi is on. On the S2 and S3 such reads can time out in the same way; the newer C, H and P chips have no such conflict.` }
  ],
  choose: {
    good: [`Bluetooth audio, serial Bluetooth or hands-free: only the ESP32 has Classic`, `Projects that need CAN, Ethernet, a DAC or an SD card on one chip`, `Following a tutorial or using a library written and tested on the ESP32`, `Two cores for a busy program at low cost`],
    avoid: [`USB devices (keyboard, mouse, drive): choose the S2 or S3`, `Wi-Fi 6, 5 GHz, Zigbee or Thread: choose the C6, C5 or H2`, `Bluetooth LE 5 features: the ESP32 stops at 4.2`, `Battery designs that must idle at a few microamps, where a C3 or C6 does better`],
    check: [`That analogue sensors sit on ADC1 pins if Wi-Fi is used`, `Which module you have: flash size, PSRAM and which pins they take`, `The chip revision for Secure Boot V2 (revision 3 or later)`, `What is wired to GPIO0, 2, 5, 12 and 15 at power-up`]
  },
  code: [
    {
      title: `A sawtooth from the DAC`,
      about: `The two DAC pins give a true analogue voltage, not PWM. This ramps GPIO25 from 0 V up to about 3.3 V in 256 steps, again and again, and so draws a sawtooth of roughly 20 Hz that an oscilloscope or a headphone amplifier will show.`,
      needs: `An ESP32 DevKit (GPIO25 is DAC channel 1). An oscilloscope or logic probe is useful; a meter will show a flickering average.`,
      wiring: [[`GPIO25`, `oscilloscope probe tip, or a headphone amplifier input`, `DAC channel 1`], [`GND`, `probe ground`]],
      blocks: `
        when started
          set [v v] to (0)
        forever
          set DAC pin (25) to (v)
          change [v v] by (1)
          if <(v) > (255)> then
            set [v v] to (0)
          end
          wait (0.0002) seconds
        end
      `,
      cpp: String.raw`
        const int DAC_PIN = 25;               // DAC channel 1 (GPIO26 is channel 2)

        void setup() {}

        void loop() {
          for (int v = 0; v <= 255; v++) {    // 0 .. 255 gives 0 V .. about 3.3 V
            dacWrite(DAC_PIN, v);
            delayMicroseconds(200);
          }
        }
      `,
      py: String.raw`
        from machine import DAC, Pin
        import time

        dac = DAC(Pin(25))                    # DAC channel 1 (pin 26 is channel 2)

        while True:
            for v in range(256):              # 0 .. 255 gives 0 V .. about 3.3 V
                dac.write(v)
                time.sleep_us(200)
      `,
      notes: [`Only the ESP32 and the ESP32-S2 have a DAC (the S2 on GPIO17 and GPIO18). On every other chip use PWM with an RC filter, or an external DAC such as the MCP4725.`, `The steps are 8 bits wide: about 13 mV each. The real period is a little longer than 51 ms because of the loop overhead.`]
    }
  ],
  quiz: [
    { q: `A speaker project streams music from a phone over Bluetooth (A2DP). Which of these chips can do it?`, choices: [`ESP32-S3`, `ESP32-C3`, `The original ESP32`, `ESP32-S2`], a: 2, why: `A2DP is a Bluetooth Classic profile. Of the chips in mass production only the original ESP32 has Classic; the S3 and C3 are LE only and the S2 has no Bluetooth.` },
    { q: `An ESP32 reads a potentiometer on GPIO4 (ADC2) correctly until the program connects to Wi-Fi, after which readings fail. Why?`, choices: [`The potentiometer is faulty`, `ADC2 is shared with the Wi-Fi radio on the ESP32`, `GPIO4 is a strapping pin`, `The DAC is interfering`], a: 1, why: `On the original ESP32 the Wi-Fi driver takes ADC2. Move the sensor to an ADC1 pin (GPIO32–39).` },
    { q: `GPIO34 on an ESP32 can drive an LED.`, a: false, why: `GPIO34–39 are input-only pins. They cannot be outputs and have no internal pull resistors.` },
    { q: `Why does every ESP32 board need a USB-to-serial bridge chip, unlike many C3 boards?`, choices: [`The ESP32 has no USB hardware`, `The ESP32 uses a different connector`, `The bridge improves Wi-Fi range`, `Bridges are needed only for Bluetooth`], a: 0, why: `The ESP32 has no native USB. The USB connector goes to a CP210x or CH340-type bridge that talks serial to the chip; the C3 has a USB Serial/JTAG function built in.` }
  ],
  applications: [
    `Bluetooth speakers and receivers, and projects that bridge a classic serial Bluetooth device.`,
    `ESP32-DevKitC and its many clones, the reference board of countless tutorials.`,
    `Industrial gateways using CAN, Ethernet and a Wi-Fi back-up on one chip.`,
    `Sound-making projects that use the DAC: simple tone generators and signal sources.`
  ],
  history: `Announced in 2015 and in volume in 2016 as the successor to the ESP8266, with two cores and Bluetooth. Later chip revisions (version 3) added Secure Boot V2; the family around it has grown by series ever since.`,
  sources: [
    `Espressif, *ESP32 Series Datasheet*: features, pin table, strapping pins, electrical characteristics.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32: ADC reference (the ADC2 and Wi-Fi limitation) and Bluetooth Classic.`,
    `Arduino core for ESP32 documentation, *DAC* API (core 3.3); MicroPython documentation, *Quick reference for the ESP32*.`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32' } }, { id: 'so-pin-budget', params: { chip: 'esp32' } }]
},

/* ================================================================ ESP32-S2 */
{
  id: 'soc-esp32-s2',
  parent: 'the-soc-series',
  title: `ESP32-S2: Wi-Fi and USB`,
  level: 1,
  short: `One core at 240 MHz, Wi-Fi 4 and no Bluetooth at all — but the first chip with native USB, 43 pins, two DACs, 14 touch pins and strong security. Today mostly chosen for price, or when a USB gadget needs Wi-Fi and no Bluetooth.`,
  keywords: ['ESP32-S2', 'S2', 'native USB', 'USB OTG', 'TinyUSB', 'HID keyboard', 'DAC', 'LOLIN S2 mini', 'S2-Saola', 'no Bluetooth', 'ULP RISC-V', 'Wi-Fi only'],
  prereq: ['reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp32-s3', 'soc-esp32', 'usb-on-the-esp', 'usb-device-hid-cdc-msc', 'lolin-d1-mini-family', 'dac-output', 'touch-pins'],
  body: `The ESP32-S2 of 2019 was Espressif's second-generation chip and the first to talk USB directly. It trades away a core and all of Bluetooth for something the original ESP32 never had: a **USB OTG** controller, so a board can be a keyboard, a mouse or a memory stick, or read one, with no bridge chip in between. It also has 43 pins, two real DACs, fourteen touch pads and the strong security block of the S series.

### What it gives

| | ESP32-S2 |
|---|---|
| Processor | 1 × Xtensa LX7 at 240 MHz, no floating-point unit · two ULP coprocessors (a state machine and a RISC-V) |
| Memory | 320 KB RAM, 128 KB ROM, 16 KB that survives deep sleep · 4 MB flash and 2 MB PSRAM inside some versions; more PSRAM outside |
| Radio | Wi-Fi 4 (20 or 40 MHz channels, up to 150 Mbit/s) · **no Bluetooth** |
| Pins | 43 GPIOs (0–21 and 26–46) · strapping: GPIO0, 45, 46 · GPIO46 input only · GPIO26–32 serve flash and PSRAM |
| Analogue | 20 ADC channels, 12 bit · 2 DACs, 8 bit (GPIO17, GPIO18) · 14 touch pins (GPIO1–14) |
| Buses | 2 UART · 2 I2C · 2 SPI · 1 I2S · 1 CAN (TWAI) · 4 RMT · 8 PWM · 4 pulse counters |
| Also | parallel LCD interface and 8/16-bit camera input, built from I2S and SPI blocks |
| USB | full-speed OTG (device and host) on GPIO19 and GPIO20 · no USB Serial/JTAG |
| Power | 3.0–3.6 V · about 25 µA in deep sleep · up to 310 mA transmitting |
| Security | Secure Boot V2 (RSA-3072), XTS-AES encryption of flash and RAM, HMAC and Digital Signature peripherals, memory permission control |

### What makes it pleasant

**USB that is a real USB device.** With the TinyUSB stack the S2 becomes a keyboard, a mouse, a MIDI instrument, a serial port or a memory drive — Wi-Fi added to a USB gadget in one chip.

**Plenty of pins and analogue.** 43 GPIOs, 20 ADC channels, fourteen touch pads and two DACs are more than any C-series chip offers, at a low price.

**Serious security.** Secure boot, encrypted flash and external RAM, and a signature peripheral make it a sound base for a product that must resist copying.

### What it lacks

**No Bluetooth, not even Low Energy** — it cannot be commissioned from a phone over BLE. One core without a floating-point unit, 320 KB of RAM and at most 2 MB of PSRAM inside. No SD host, no Ethernet MAC, no motor PWM, one I2S and two UARTs. ADC2 is shared with Wi-Fi, and only four RMT channels exist. The USB is **full speed** (12 Mbit/s).

Boards usually add a bridge chip and a second USB socket anyway (the S2-DevKitC-1 carries two): the native USB pins are in use by your program, so uploading often needs the serial route or download mode.

### Where it sits in the family

The [[soc-esp32-s3|ESP32-S3]] does everything the S2 does and adds a second core, Bluetooth LE 5 and more memory, which is why the S2 is now chosen mostly for its price. Choose the S2 when the price is the point, when two DACs are needed, or when a USB gadget needs Wi-Fi and not Bluetooth.

> [!key] The ESP32-S2 is the Wi-Fi-only chip with native USB, 43 pins and two DACs, and no Bluetooth. Choose it for a USB gadget with Wi-Fi at low cost; choose the S3 whenever Bluetooth, a second core or more memory is in the picture.`,
  ideas: [
    `The S2 was the first chip with native USB OTG: it can be a USB keyboard, mouse, drive or serial port, or a USB host.`,
    `It has no Bluetooth of any kind, one core, 320 KB of RAM and Wi-Fi 4 only.`,
    `It offers 43 pins, 20 ADC channels, 14 touch pads and two 8-bit DACs, with secure boot and encrypted flash and RAM.`,
    `The ESP32-S3 supersedes it wherever a second core, Bluetooth LE or more memory matters.`
  ],
  pitfalls: [
    `The S2 is an S3 without PSRAM — It lacks much more: the second core, the floating-point unit, all Bluetooth, and the SD host. It is a different, smaller chip.`,
    `Its USB works like the C3's — The C3 has a fixed USB serial and debug function. The S2 has a full USB OTG controller (device or host), with no built-in serial and debug function.`,
    `A sketch can switch between being a USB keyboard and printing to the Serial Monitor freely — In keyboard mode the same USB pins carry the keyboard, so the console moves to another port, and a new upload may need download mode (hold BOOT, tap RESET).`
  ],
  terms: [
    { term: `USB OTG`, also: [`On-The-Go`, `native USB`, `USB device mode`, `USB host`], def: `A USB controller that can act as a device (a keyboard, a drive, a serial port) or as a host that reads other devices. The ESP32-S2, S3 and P4 have one.` },
    { term: `HID`, also: [`human interface device`, `USB HID`], def: `The USB class for keyboards, mice and game controllers. A computer needs no driver for it, which is why a board can type or point as soon as it is plugged in.` },
    { term: `TinyUSB`, def: `The small open-source USB stack that the ESP-IDF and Arduino core use to turn an OTG-capable chip into a keyboard, mouse, MIDI device, serial port or drive.` },
    { term: `ULP coprocessor`, also: [`ULP`, `ultra-low-power coprocessor`], def: `A tiny processor that keeps running while the main cores sleep, reading a sensor or watching a pin for a few microamps. The S2 has two kinds: a state machine and a small RISC-V core.` }
  ],
  choose: {
    good: [`A USB keyboard, mouse, MIDI or storage gadget that also needs Wi-Fi`, `Many pins and analogue channels on one low-cost chip`, `Products that need secure boot and encrypted flash without Bluetooth`, `Two DACs for audio or signal generation`],
    avoid: [`Anything needing Bluetooth, phone commissioning included`, `Two-core workloads, machine learning, cameras: choose the S3`, `A new battery sensor, where a C3 or C6 sleeps and connects better`, `Ethernet or an SD card on the chip itself`],
    check: [`Whether the board has its own serial bridge as well as the native USB socket`, `Which Tools menu USB mode your sketch needs`, `That the USB pins GPIO19 and GPIO20 are not wanted for anything else`, `Module memory: many S2 boards have 2 MB PSRAM or none`]
  },
  code: [
    {
      title: `A USB keyboard that types on a button press`,
      about: `Each press of the BOOT button makes the board type one line into whatever program has the keyboard focus. It shows what only the chips with USB OTG do: be a USB device with no bridge chip.`,
      needs: `An ESP32-S2 board with its native USB socket connected to a computer. In the Arduino IDE choose Tools > USB Mode > USB-OTG (TinyUSB). The BOOT button on GPIO0 is the trigger.`,
      wiring: [[`GPIO0`, `the BOOT button to GND`, `already on the board`], [`USB`, `computer, native USB socket`]],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          start the USB keyboard :: bus
        forever
          if <(read pin (0)) = [LOW v]> then
            type [Hello from the ESP32-S2] on the USB keyboard :: bus
            wait (1) seconds
          end
        end
      `,
      cpp: String.raw`
        #include "USB.h"
        #include "USBHIDKeyboard.h"

        #ifndef ARDUINO_USB_MODE
        #error This chip has no native USB (OTG) interface
        #elif ARDUINO_USB_MODE == 1
        #error Select Tools > USB Mode > USB-OTG (TinyUSB)
        #endif

        USBHIDKeyboard Keyboard;
        const int BUTTON = 0;                 // the BOOT button

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          Keyboard.begin();
          USB.begin();                        // start the USB stack after the classes are added
        }

        void loop() {
          if (digitalRead(BUTTON) == LOW) {
            Keyboard.print("Hello from the ESP32-S2\n");
            delay(1000);                      // one line per press, not a flood
          }
        }
      `,
      na: { py: `MicroPython can make an S2 a USB device (machine.USBDevice, since version 1.25), but the ready-made keyboard classes come from separate libraries that this page has not checked, so it prints no MicroPython program rather than guess.` },
      notes: [`The board types into whichever window has the focus: click into a text editor first. If it misbehaves, unplug it — or hold BOOT while resetting to get back to download mode.`, `The S3 and P4 also have USB OTG; the C3, C6, C5, C61 and H2 do not and cannot do this.`]
    }
  ],
  quiz: [
    { q: `A gadget must appear as a USB keyboard to a PC and also send data over Wi-Fi. Which chip suits it at the lowest cost?`, choices: [`ESP32-C3`, `ESP32-S2`, `ESP32 (original)`, `ESP32-H2`], a: 1, why: `The S2 has USB OTG and Wi-Fi at a low price. The C3 and H2 have only a fixed USB serial function, and the original ESP32 has no USB.` },
    { q: `A phone app must find an ESP32-S2 over Bluetooth Low Energy. What can be done?`, choices: [`Enable BLE in the Arduino Tools menu`, `Nothing: the S2 has no Bluetooth; use the S3 or another chip`, `Add PSRAM`, `Use the USB port`], a: 1, why: `The S2 has no Bluetooth radio of any kind. The S3 is its Bluetooth LE sibling.` },
    { q: `The ESP32-S2 has two 8-bit DACs.`, a: true, why: `They are on GPIO17 and GPIO18. Among the chips in common use only the S2 and the original ESP32 have a DAC.` },
    { q: `Why does the S2-DevKitC-1 carry two USB sockets?`, choices: [`For charging two batteries`, `One goes to a serial bridge chip and one to the chip's native USB`, `The second is for Ethernet`, `One is for Wi-Fi`], a: 1, why: `The bridge socket serves the serial console and uploads; the native one is the USB device or host that the program uses.` }
  ],
  applications: [
    `Wi-Fi-enabled USB gadgets: macro keypads, MIDI controllers, and remote-controlled keyboards.`,
    `LOLIN S2 mini and similar small boards, popular for CircuitPython, whose S2 support is stable.`,
    `Low-cost smart devices that need many pins and secure boot but no Bluetooth.`,
    `Audio and signal projects that use the two DACs.`
  ],
  history: `Announced in 2019 as the next step after the ESP32: a single-core, Wi-Fi-only chip with native USB and a strong security block. The ESP32-S3 followed in 2020 and added the second core and Bluetooth LE.`,
  sources: [
    `Espressif, *ESP32-S2 Series Datasheet*: features, pin table, USB, strapping pins.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-S2: USB device stack (TinyUSB) and the ADC reference.`,
    `Arduino core for ESP32 documentation, *USB* API, device classes and the USB Mode menu (core 3.3).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-s2', compare: 'esp32-s3' } }, { id: 'so-migrate', params: { from: 'esp32-s2', to: 'esp32-s3' } }]
},

/* ================================================================ ESP32-S3 */
{
  id: 'soc-esp32-s3',
  parent: 'the-soc-series',
  title: `ESP32-S3: the all-rounder`,
  level: 1,
  short: `Two cores with vector instructions for neural networks, native USB, Bluetooth LE 5 and room for megabytes of PSRAM: the chip for cameras, displays, voice and AI, and the natural successor of the original ESP32 for new work.`,
  keywords: ['ESP32-S3', 'S3', 'PSRAM', 'octal PSRAM', 'N16R8', 'USB OTG', 'camera', 'LCD', 'machine learning', 'ESP-DL', 'dual core', 'XIAO ESP32S3', 'DevKitC-1', 'BLE 5'],
  prereq: ['reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp32', 'soc-esp32-s2', 'esp32-s3-devkitc', 'xiao-esp32s3-and-sense', 'safe-pins-s3-c3-c6', 'ai-accelerators-s3-and-p4', 'camera-interfaces', 'using-psram', 'usb-on-the-esp'],
  body: `If one chip had to be recommended to a newcomer with a camera, a display or a voice-controlled idea, it would be the **ESP32-S3**. It keeps the two 240 MHz cores of the original ESP32, adds vector instructions that speed up neural networks and signal processing, gives native USB, Bluetooth LE 5 and room for up to 32 MB of PSRAM, and has 45 pins. What it gives up is Bluetooth Classic, the DAC and the Ethernet MAC.

### What it gives

| | ESP32-S3 |
|---|---|
| Processor | 2 × Xtensa LX7 at 240 MHz with floating-point unit and 128-bit vector (SIMD) instructions · two ULP coprocessors |
| Memory | 512 KB RAM, 384 KB ROM, 16 KB that survives deep sleep · flash up to 8 MB and PSRAM 2, 8 or 16 MB inside some versions; up to 32 MB mapped |
| Radio | Wi-Fi 4 (20 or 40 MHz, up to 150 Mbit/s) · Bluetooth LE 5: 2 Mbit/s, coded long range, extended advertising, mesh · no Classic |
| Pins | 45 GPIOs (0–21 and 26–48), none input only · strapping: GPIO0, 3, 45, 46 · GPIO26–32 serve flash and PSRAM |
| Analogue | 20 ADC channels, 12 bit · 14 touch pins · no DAC |
| Buses | 3 UART · 2 I2C · 2 SPI · 2 I2S · 1 CAN · RMT 4 + 4 · 8 PWM · 2 motor PWM · 4 pulse counters |
| Interfaces | SD/MMC host · parallel camera input (8–16 bit) · LCD: SPI, i80 and 16-bit RGB |
| USB | full-speed OTG and USB Serial/JTAG, sharing GPIO19 and GPIO20 |
| Power | 3.0–3.6 V · about 7 µA in deep sleep · up to 340 mA transmitting |
| Security | Secure Boot V2 (RSA-3072), automatic XTS-AES encryption of flash and RAM, HMAC and Digital Signature, memory permission control |

### What makes it pleasant

**Memory and muscle for pictures and AI.** The vector instructions speed up neural-network code (face and voice recognition, TensorFlow Lite Micro), and octal PSRAM of 8 or 16 MB holds camera frames and display buffers. Cameras, parallel and RGB displays and an SD card connect directly.

**USB with no bridge.** The chip can flash and print over its USB Serial/JTAG function, or act as a USB device or host through OTG.

**A modern Bluetooth.** LE 5 with the coded long-range mode and a +20 dBm high-power setting reaches much further than the original ESP32's 4.2.

### What it lacks

No Bluetooth Classic (so no A2DP audio and no old serial Bluetooth), no DAC and no Ethernet MAC (add an SPI Ethernet chip). Wi-Fi is 4 on 2.4 GHz only, and there is no 802.15.4 radio. ADC2 is shared with the Wi-Fi driver, so analogue inputs belong on ADC1 (GPIO1–10) while Wi-Fi runs. The USB is full speed (12 Mbit/s), and **USB Serial/JTAG and OTG share one PHY and the same two pins**, so they cannot run at once. Boards with octal PSRAM lose more pins: GPIO33–37 are taken, and on common N16R8 modules GPIO35–37 are blocked. Octal-PSRAM versions are rated only to 65 °C ambient, and the chip draws more current than a C-series one.

### Where it sits in the family

Against the [[soc-esp32|ESP32]] it is the modern successor, less one radio and one DAC. Against the [[soc-esp32-s2|ESP32-S2]] it adds a core, Bluetooth and memory. The [[soc-esp32-p4|ESP32-P4]] is faster still, but has no radio.

> [!key] The ESP32-S3 is the all-rounder: two cores with AI-friendly vector instructions, up to 32 MB of PSRAM, USB, Bluetooth LE 5, cameras and displays. Choose it for anything with pictures, sound or a screen; skip it if you need Bluetooth Classic or a DAC.`,
  ideas: [
    `Two 240 MHz cores plus vector instructions make the S3 the chip for neural networks, cameras and voice.`,
    `Octal PSRAM of up to 16 MB inside the package (32 MB mapped) holds frames and display buffers.`,
    `It has native USB and Bluetooth LE 5, but no Bluetooth Classic, no DAC and no Ethernet MAC.`,
    `USB Serial/JTAG and USB OTG share one PHY on GPIO19 and GPIO20, and octal PSRAM takes GPIO33–37.`
  ],
  pitfalls: [
    `The S3 can do everything the ESP32 did — It lacks Bluetooth Classic, the DAC and the Ethernet MAC. A Bluetooth speaker project cannot move to it.`,
    `Every S3 pin is free to use — GPIO26–32 serve the flash and PSRAM, GPIO33–37 are also taken on octal-PSRAM versions, and GPIO19 and GPIO20 are the USB pins.`,
    `USB serial and a USB keyboard work together on the same port — The two USB blocks share one PHY: you pick Hardware CDC and JTAG or USB-OTG (TinyUSB) in the Tools menu.`
  ],
  terms: [
    { term: `Vector instructions`, also: [`SIMD`, `PIE`, `128-bit vector`], def: `Processor instructions that apply one operation to several numbers at once. The S3's 128-bit set lets a core do the multiply-adds of a neural network in far fewer steps.` },
    { term: `Octal PSRAM`, also: [`OPI PSRAM`, `octal SPI`], def: `External RAM connected by eight data lines instead of four, so it is faster. It takes extra pins (GPIO33–37 on the S3) and has a lower temperature rating than the plain chip.` },
    { term: `Coded PHY`, also: [`Bluetooth long range`, `LE Coded`], def: `A Bluetooth LE radio mode that spends extra bits on error correction to reach about four times as far at a lower data rate. Chips with Bluetooth 5 have it.` },
    { term: `Addressable RGB LED`, also: [`WS2812`, `NeoPixel`, `smart LED`], def: `An LED with a tiny controller inside that takes colour values over a single data pin. The DevKit's RGB LED is one, which is why it is driven by data, not by a plain high or low level.` }
  ],
  choose: {
    good: [`Cameras, parallel or RGB displays and anything with a lot of pixels`, `Voice, face or gesture recognition and other small neural networks`, `USB keyboards, drives or host work on a Wi-Fi and Bluetooth LE chip`, `A first board with a lot of room: many pins, memory and tutorials`],
    avoid: [`Bluetooth audio or classic serial Bluetooth: the ESP32 only`, `A DAC or an Ethernet MAC on the chip itself`, `Zigbee, Thread, Wi-Fi 6 or 5 GHz: the C6, C5 or H2`, `The cheapest, smallest sensor: a C3 or C2 is cheaper and thriftier`],
    check: [`The module's memory type: quad or octal PSRAM, and which pins it blocks`, `Whether the board's USB goes to the OTG or the Serial/JTAG function`, `Operating temperature of octal-PSRAM versions (65 °C ambient)`, `That your framework has a driver for your camera or display`]
  },
  code: [
    {
      title: `Colour on the DevKit's RGB LED`,
      about: `The S3 DevKit's only LED is an addressable RGB LED on a single data pin, not a plain LED. This shows red, green, blue and off in turn, using the core's helper for it.`,
      needs: `An ESP32-S3-DevKitC-1 or any board with an addressable RGB LED. Its pin is GPIO48 on version 1.0 and GPIO38 on version 1.1: change the number to match your board.`,
      wiring: [[`GPIO48`, `the on-board addressable RGB LED`, `GPIO38 on DevKitC-1 version 1.1`], [`USB`, `computer`]],
      blocks: `
        when started
          set [level v] to (32)
        forever
          set pixel (0) to colour (level) (0) (0)     // red
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (level) (0)     // green
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (level)     // blue
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (0)         // off
          show pixels
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #ifndef RGB_BUILTIN
        #define RGB_BUILTIN 48                // GPIO38 on DevKitC-1 version 1.1
        #endif

        const uint8_t LEVEL = 32;             // 0..255: the LED is bright, so keep it low

        void setup() {}

        void loop() {
          rgbLedWrite(RGB_BUILTIN, LEVEL, 0, 0);   // red
          delay(500);
          rgbLedWrite(RGB_BUILTIN, 0, LEVEL, 0);   // green
          delay(500);
          rgbLedWrite(RGB_BUILTIN, 0, 0, LEVEL);   // blue
          delay(500);
          rgbLedWrite(RGB_BUILTIN, 0, 0, 0);       // off
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LEVEL = 32                                # 0..255: the LED is bright, so keep it low
        np = NeoPixel(Pin(48), 1)                 # GPIO38 on DevKitC-1 version 1.1

        while True:
            for colour in ((LEVEL, 0, 0), (0, LEVEL, 0), (0, 0, LEVEL), (0, 0, 0)):
                np[0] = colour                    # (red, green, blue)
                np.write()                        # nothing is sent until write()
                time.sleep_ms(500)
      `,
      notes: [`The helper drives one pixel and needs core 3.0.5 or later; older cores call it neopixelWrite. After using it, the pin cannot serve as a plain GPIO.`, `The C3 and C6 DevKits have the same kind of LED on GPIO8, so the same program works there with the pin changed.`]
    }
  ],
  quiz: [
    { q: `A project needs to recognise faces from a camera and show the result on a colour display. Which chip family member fits best?`, choices: [`ESP32-C3`, `ESP32-S3`, `ESP32-H2`, `ESP8266`], a: 1, why: `The S3 has the vector instructions for neural networks, PSRAM for frames and buffers, and the camera and display interfaces. The C3 has no PSRAM; the H2 and ESP8266 are far too small.` },
    { q: `On an ESP32-S3-WROOM module sold as N16R8, GPIO35, 36 and 37 are unusable. Why?`, choices: [`They are strapping pins`, `The octal PSRAM uses them`, `They are the USB pins`, `They are input only`], a: 1, why: `N16R8 means 16 MB flash and 8 MB octal PSRAM; octal PSRAM takes data lines that appear on GPIO33–37, and on these modules GPIO35–37 are blocked.` },
    { q: `An ESP32-S3 can be both a USB OTG keyboard and a USB Serial/JTAG console on the same connector at the same moment.`, a: false, why: `The two USB blocks share one PHY and the pins GPIO19 and GPIO20. You choose one in the Tools menu (a TinyUSB CDC serial port is still available when OTG is selected).` },
    { q: `Which of these does the ESP32-S3 lack compared with the original ESP32?`, choices: [`Two cores`, `Bluetooth Classic`, `Wi-Fi`, `Bluetooth LE`], a: 1, why: `The S3 has two cores, Wi-Fi and Bluetooth LE 5, but no Bluetooth Classic, no DAC and no Ethernet MAC.` }
  ],
  applications: [
    `ESP32-S3-DevKitC-1, XIAO ESP32S3 Sense and many camera and display boards use it.`,
    `Voice assistants and wake-word devices, such as the ESP32-S3-BOX line.`,
    `AI cameras: face detection, QR-code reading and image classification at the edge.`,
    `USB keyboards, macro pads and USB host adapters with Wi-Fi on board.`
  ],
  history: `Announced in 2020 as the successor of the original ESP32 for AI and display work, with the vector instructions added for machine learning. Boards from nearly every maker carry it.`,
  sources: [
    `Espressif, *ESP32-S3 Series Datasheet*: features, pin table, strapping pins, electrical characteristics, module pin restrictions.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-S3: USB, PSRAM and the ADC reference.`,
    `Arduino core for ESP32 documentation, *USB* and *Tools menu* pages (USB Mode, CDC On Boot).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-s3', compare: 'esp32' } }, { id: 'so-pin-budget', params: { chip: 'esp32-s3' } }]
},

/* ================================================================ ESP32-C2 */
{
  id: 'soc-esp32-c2',
  parent: 'the-soc-series',
  title: `ESP32-C2: the smallest`,
  level: 2,
  short: `Wi-Fi 4 and Bluetooth LE 5.3 in a 4 × 4 mm package, with 2 or 4 MB of flash inside, 14 pins and no USB. Sold as the ESP8684: the cheapest way to put Espressif's radio in a product — and the chip Espressif names to replace the ESP8266.`,
  keywords: ['ESP32-C2', 'ESP8684', 'C2', 'smallest', 'low cost', 'RISC-V', 'ESP8684-MINI-1', 'ESP8266 replacement', 'volume products', 'BLE 5.3', 'QFN24'],
  prereq: ['reading-the-family-names', 'chip-module-board', 'soc-esp8266'],
  related: ['soc-esp32-c3', 'soc-esp8266', 'living-with-few-pins', 'esp-idf-basics', 'choosing-a-chip', 'bill-of-materials-and-cost'],
  body: `The **ESP32-C2**, sold under the part number **ESP8684**, is the family's least. It is the smallest chip with Espressif's Wi-Fi and Bluetooth: a 4 × 4 mm package with 2 or 4 MB of flash already inside, one RISC-V core at 120 MHz and only fourteen pins. It is made for products built in the hundreds of thousands — a lamp, a plug, a sensor — where every cent and every square millimetre counts, and not for a first experiment.

### What it gives

| | ESP32-C2 (ESP8684) |
|---|---|
| Processor | 1 × RISC-V (RV32IMC) at 120 MHz, no floating-point unit |
| Memory | 272 KB RAM, 576 KB ROM (code in ROM leaves more RAM for you) · 2 or 4 MB flash always inside · no PSRAM |
| Radio | Wi-Fi 4 (20 MHz channels only, 72.2 Mbit/s) · Bluetooth LE 5.3: 2 Mbit/s, coded long range, extended advertising |
| Pins | 14 GPIOs (GPIO0–10 and 18–20) · strapping: GPIO8 and GPIO9 only |
| Analogue | 5 ADC channels, 12 bit (GPIO0–4) · no DAC · no touch |
| Buses | 2 UART · 1 I2C · 1 SPI · 6 PWM channels · no I2S, CAN, RMT, pulse counter or motor PWM |
| USB | none, not even USB Serial/JTAG |
| Power | 3.0–3.6 V · about 5 µA in deep sleep · up to 370 mA transmitting |
| Security | Secure Boot V2 (ECDSA-256), XTS-AES-128 flash encryption, ECC and SHA accelerators · no AES, RSA, HMAC or Digital Signature hardware |

### What makes it pleasant

**Small and inexpensive.** It is the lowest-cost Espressif chip with Wi-Fi and Bluetooth LE 5.3, certified for Bluetooth 5.3 with the coded long-range mode, in a package about two-thirds the area of a C3's (4 × 4 mm against 5 × 5 mm).

**A thrifty design.** Five microamps in deep sleep and 9–15 mA in modem sleep, and because a large part of the code lives in ROM, 272 KB of RAM goes further than the number suggests.

**A clear upgrade path.** Espressif itself names it as the replacement for the ESP8266.

### What it lacks

One core at 120 MHz, no floating-point unit and a small memory. Wi-Fi is limited to 20 MHz channels. With **14 pins**, five ADC channels, one I2C and one SPI, and no I2S, CAN, RMT or pulse counter, the list of things it can connect is short. **No USB at all**, so a board needs a USB-to-serial bridge or a header for a programmer. Software is thinner too: the stable Arduino board package does not list it (it is used as an ESP-IDF component), ESPHome does not target it, and CircuitPython support is alpha — while official MicroPython images and ESP-IDF do support it. Its default SPI and I2C pins fall on JTAG and strapping pins.

### Where it sits in the family

Beside the [[soc-esp32-c3|ESP32-C3]], the C2 is smaller and cheaper with less of everything: no USB, half the SPI, no I2S, no CAN. Choose it when a product's needs are met by Wi-Fi, BLE and a few pins and the bill of materials is what counts. For learning, a C3 board is kinder.

> [!key] The ESP32-C2 (ESP8684) is the smallest, cheapest Wi-Fi and Bluetooth LE 5.3 chip of the family: 14 pins, no USB, thin software support. It is the right choice for a simple product in volume and the wrong one for a first project.`,
  ideas: [
    `The C2 is a 4 × 4 mm chip with Wi-Fi 4, Bluetooth LE 5.3 and 2 or 4 MB of flash inside, sold as the ESP8684.`,
    `It has 14 pins, 5 ADC channels and a short list of peripherals, and no USB of any kind.`,
    `Espressif names it as the upgrade from the ESP8266; the C3 is the more capable choice for most new designs.`,
    `Software support is thinner: ESP-IDF and MicroPython, but not the stable Arduino package or ESPHome.`
  ],
  pitfalls: [
    `The C2 is a smaller C3 for beginners — It is meant for volume products, with fewer pins, no USB and thinner software support. A first project is easier on a C3.`,
    `A C2 board shows the serial monitor over USB, like a C3 — The C2 has no USB peripheral. Boards use a USB-to-serial bridge chip.`,
    `Fourteen GPIOs means fourteen free pins — Two are strapping pins, some are the JTAG pins that Arduino's default SPI uses, and GPIO8 and 9 are the default I2C. Plan the pins before choosing.`
  ],
  terms: [
    { term: `ESP8684`, also: [`ESP8684H2X`, `ESP8684H4X`, `ESP8684-MINI-1`], def: `The part number under which the ESP32-C2 is sold, with 2 MB (H2X) or 4 MB (H4X) of flash in the package. Modules such as the ESP8684-MINI-1 carry it.` },
    { term: `ROM code`, also: [`code in ROM`, `ROM-resident libraries`], def: `Program code stored permanently in the chip at manufacture. The C2 keeps much of its Wi-Fi and Bluetooth software there, which leaves more of its RAM free for the application.` },
    { term: `System in package`, also: [`SiP`, `in-package flash`], def: `A chip and its flash memory sealed in one package. Every C2 has its flash inside, so no flash pins are exposed and board design is simpler.` }
  ],
  choose: {
    good: [`Simple Wi-Fi or BLE products built in volume where cost and size decide`, `A one-job device: a switch, a plug, a light, a sensor`, `Designs that fit in 14 pins and one I2C and SPI`, `Replacing an ESP8266 in a product that is being redesigned`],
    avoid: [`A first project or a learning board: use the C3`, `USB devices or anything that needs USB Serial/JTAG on the chip`, `Audio (no I2S), CAN, or many sensors on separate buses`, `Frameworks the C2 does not support, such as ESPHome or the stable Arduino package`],
    check: [`That your framework (ESP-IDF, MicroPython) supports the C2 in the version you use`, `The pins you need against GPIO0–10 and 18–20`, `How the board gets programmed, since the chip has no USB`, `RAM left once Wi-Fi and Bluetooth run`]
  },
  code: [
    {
      title: `Ask the chip who it is, and how much memory is left`,
      about: `Prints the chip's name, clock speed and free memory. On a C2 the last number shows how little there is to spare — the first thing to check when a program grows.`,
      needs: `An ESP32-C2 board such as the ESP8684-DevKitC-02, a serial connection at 115200 baud. The ESP-IDF version needs an ESP-IDF project; the MicroPython version needs the ESP32-C2 image.`,
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Clock in MHz: ] (CPU frequency))
          print (join [Free memory in bytes: ] (free memory))
      `,
      na: { cpp: `The stable Arduino board package for ESP32 does not list the ESP32-C2; it is used as an ESP-IDF component instead, so this program is given for ESP-IDF and MicroPython.` },
      idf: String.raw`
        #include <stdio.h>
        #include "sdkconfig.h"
        #include "esp_system.h"

        void app_main(void)
        {
            printf("Chip:       %s\n", CONFIG_IDF_TARGET);
            printf("Clock:      %d MHz\n", CONFIG_ESP_DEFAULT_CPU_FREQ_MHZ);
            printf("Free heap:  %lu bytes\n", (unsigned long)esp_get_free_heap_size());
        }
      `,
      py: String.raw`
        import sys, machine, gc

        print("Chip:      ", sys.implementation._machine)
        print("Clock:     ", machine.freq() // 1_000_000, "MHz")
        gc.collect()
        print("Free heap: ", gc.mem_free(), "bytes")
      `,
      output: `
        Chip:       esp32c2
        Clock:      120 MHz
        Free heap:  (a few hundred kilobytes less than the RAM figure; yours will differ)
      `,
      notes: [`The MicroPython figure is MicroPython's own heap and differs from the ESP-IDF heap; neither equals the 272 KB of the datasheet, since the system uses part of it.`, `The same program runs on any ESP32-family chip with the right target selected.`]
    }
  ],
  quiz: [
    { q: `Which chip does Espressif name as the upgrade for the ESP8266?`, choices: [`ESP32-S3`, `ESP32-C2 (ESP8684)`, `ESP32-P4`, `ESP32-H2`], a: 1, why: `The ESP8266 datasheet marks it not recommended for new designs and recommends the ESP8684, which is the ESP32-C2.` },
    { q: `A C2 board has no USB-to-serial bridge chip and no header. How would you program it?`, choices: [`Over the chip's USB port`, `You cannot: the C2 has no USB, so some serial route (a bridge, a programmer) is always needed`, `Over Bluetooth`, `With a USB-C cable only`], a: 1, why: `The C2 has no USB peripheral of any kind. A board without a bridge must bring the UART pins out to a programming header.` },
    { q: `The ESP32-C2 has 14 usable GPIOs.`, a: true, why: `GPIO0–10 and GPIO18–20; the in-package flash uses the other pins. Two of them (GPIO8 and GPIO9) are strapping pins.` },
    { q: `What is the best reason to choose a C3 over a C2 for a first project?`, choices: [`The C3 has Bluetooth Classic`, `The C3 has USB Serial/JTAG, more pins and broader software support`, `The C3 has two cores`, `The C3 has a DAC`], a: 1, why: `The C3 adds a built-in USB serial and debug port, 22 pins instead of 14 and 400 KB of RAM, and the stable Arduino package supports it. It has neither a second core nor a DAC nor Classic.` }
  ],
  applications: [
    `Smart plugs, bulbs and switches built in large numbers, as a modern ESP8266 replacement.`,
    `Small battery sensors reporting over Wi-Fi or Bluetooth LE.`,
    `Wi-Fi and Bluetooth modules of the ESP8684-MINI-1 type inside appliances.`,
    `Cost-reduced redesigns of products first built on the ESP8266.`
  ],
  history: `Announced in 2022 under the part number ESP8684, as a low-cost RISC-V chip for volume products. Espressif's datasheets for the ESP8266 now name it as the replacement.`,
  sources: [
    `Espressif, *ESP8684 Series Datasheet* (the ESP32-C2): features, pin table, strapping pins.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-C2: supported features and the ADC reference.`,
    `MicroPython documentation, *ESP32 port*: the list of supported chips (version 1.29).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-c2', compare: 'esp32-c3' } }, { id: 'so-pin-budget', params: { chip: 'esp32-c2' } }]
},

/* ================================================================ ESP32-C6 */
{
  id: 'soc-esp32-c6',
  parent: 'the-soc-series',
  title: `ESP32-C6: Wi-Fi 6, Zigbee and Thread`,
  level: 1,
  short: `Wi-Fi 6 with target wake time, Bluetooth LE 5.3 and an 802.15.4 radio for Zigbee and Thread, on one RISC-V chip with a second, tiny low-power core. The smart-home chip: everything Matter needs, over Wi-Fi or over Thread.`,
  keywords: ['ESP32-C6', 'C6', 'Wi-Fi 6', 'Zigbee', 'Thread', 'Matter', '802.15.4', 'target wake time', 'TWT', 'LP core', 'XIAO ESP32C6', 'DevKitC-1', 'smart home', 'border router'],
  prereq: ['reading-the-family-names', 'chip-module-board', 'soc-esp32-c3'],
  related: ['soc-esp32-c3', 'soc-esp32-c5', 'soc-esp32-h2', 'wifi-6-on-esp', 'zigbee-on-esp', 'matter-on-esp', 'thread-border-router', 'ulp-and-lp-coprocessors', 'c-series-devkits', 'xiao-esp32c6-and-c5', 'choosing-a-smart-home-radio'],
  body: `Most smart-home products need more than one language: Wi-Fi to reach the router, Bluetooth LE to be set up from a phone, and often Zigbee or Thread to join a low-power mesh. The **ESP32-C6** speaks all of them from one chip. It is a single RISC-V core at 160 MHz with Wi-Fi 6 and its battery-saving *target wake time*, Bluetooth LE 5.3, and a separate IEEE 802.15.4 radio for **Zigbee 3.0 and Thread 1.3** — which makes it the usual Matter device, over Wi-Fi or over Thread.

### What it gives

| | ESP32-C6 |
|---|---|
| Processor | 1 × RISC-V (RV32IMAC) at 160 MHz, no floating-point unit · plus a 20 MHz low-power core with its own UART and I2C |
| Memory | 512 KB RAM, 320 KB ROM, 16 KB that survives deep sleep · flash none (QFN40) or 4 or 8 MB inside (QFN32) · no PSRAM |
| Radio | Wi-Fi 6 on 2.4 GHz: target wake time, OFDMA, downlink MU-MIMO, 150 Mbit/s at most · Bluetooth LE 5.3 · 802.15.4: Zigbee 3.0 and Thread 1.3 |
| Pins | 30 GPIOs in the larger package (22 in the QFN32 with flash inside) · strapping: GPIO4, 5, 8, 9, 15 |
| Analogue | 7 ADC channels, 12 bit (GPIO0–6), no ADC2 and so no Wi-Fi conflict · no DAC · no touch |
| Buses | 2 UART (and a low-power one) · 1 I2C (and a low-power one) · 1 SPI · 1 I2S · 2 CAN · RMT 2 + 2 · 6 PWM · 1 motor PWM · 4 pulse counters · SDIO slave |
| USB | USB Serial/JTAG only (GPIO12, GPIO13) |
| Power | 3.0–3.6 V · about 7 µA in deep sleep · up to 354 mA transmitting |
| Security | Secure Boot V2 (RSA-3072 or ECDSA), XTS-AES flash encryption, Digital Signature, HMAC, trusted-execution controller |

### What makes it pleasant

**Three radios, one price class.** Wi-Fi 6, Bluetooth LE and 802.15.4 for roughly the cost of a C3 make it the chip for Matter devices, which commission over Bluetooth LE and then live on Wi-Fi or Thread.

**Wi-Fi that sleeps.** Target wake time lets a battery device agree with a Wi-Fi 6 router when it will next wake, so it can stay asleep between slots; deep sleep is 7 µA.

**A second, tiny core.** The low-power core, with its own UART and I2C, can watch a sensor or a pin while the main core sleeps.

**Good software.** The Arduino core ships Zigbee, Matter and OpenThread libraries for it; ESP-IDF, MicroPython, ESPHome and Rust support it too.

### What it lacks

One 160 MHz core with no floating-point unit and **no PSRAM**. Wi-Fi 6 stays on 2.4 GHz and 20 MHz channels. The **radio is shared**: Wi-Fi, Bluetooth and 802.15.4 take turns on one antenna, which limits what can run at full speed together. No USB OTG, no Ethernet, no camera or display interface, no DAC, only seven ADC channels, one I2S and one general SPI. ECDSA secure-boot verification is slower (about 84 ms) than RSA (about 10 ms).

### Where it sits in the family

The [[soc-esp32-c3|ESP32-C3]] is cheaper and plain; the C6 adds Wi-Fi 6, 802.15.4 and the low-power core. The [[soc-esp32-c5|ESP32-C5]] adds 5 GHz and speed. The [[soc-esp32-c61|ESP32-C61]] is the cost-reduced Wi-Fi 6 sibling without 802.15.4. The [[soc-esp32-h2|ESP32-H2]] keeps only the Zigbee, Thread and Bluetooth side. And the C6 is the usual radio companion of the [[soc-esp32-p4|ESP32-P4]].

> [!key] The ESP32-C6 is the smart-home chip: Wi-Fi 6, Bluetooth LE 5.3, Zigbee and Thread on one RISC-V core with a low-power helper. Choose it for Matter, Zigbee or Thread devices and efficient Wi-Fi 6 batteries; skip it for big memory, USB devices or 5 GHz.`,
  ideas: [
    `The C6 combines Wi-Fi 6, Bluetooth LE 5.3 and a 802.15.4 radio (Zigbee 3.0, Thread 1.3) on one RISC-V core at 160 MHz.`,
    `Target wake time and 7 µA deep sleep let a Wi-Fi 6 device wake only at agreed moments.`,
    `A 20 MHz low-power core with its own UART and I2C can work while the main core sleeps.`,
    `It has no PSRAM, no USB OTG, no 5 GHz, and one radio shared by three protocols.`
  ],
  pitfalls: [
    `Wi-Fi 6 on the C6 means gigabit speeds — The C6's Wi-Fi 6 uses 20 MHz channels, one stream, at most 150 Mbit/s. The point is power saving and efficiency, not speed.`,
    `All three radios work at full speed at once — They share one radio and antenna and take turns, so heavy Wi-Fi traffic slows Thread or BLE, and the other way round.`,
    `Zigbee on the C6 is an add-on library you install — It is part of the Arduino core for this chip (and ESP-IDF), selected in the Tools menu, with its own partition scheme.`
  ],
  terms: [
    { term: `Target wake time`, also: [`TWT`], def: `A Wi-Fi 6 feature: a device and the router agree when the device will next wake, so it can sleep through the time between and save battery. It needs a Wi-Fi 6 router that supports it.` },
    { term: `LP core`, also: [`low-power core`, `LP RISC-V`], def: `A small second processor that keeps running while the main core sleeps. On the C6 it runs at 20 MHz with its own UART and I2C and can watch sensors for very little current.` },
    { term: `Radio coexistence`, also: [`coex`], def: `The arbitration that lets Wi-Fi, Bluetooth and 802.15.4 share one radio and antenna by taking turns. It works well but caps what can run at full speed together.` },
    { term: `Zigbee end device`, also: [`ZED`, `Zigbee router`, `Zigbee coordinator`], def: `A Zigbee node that does not forward other nodes' messages and may sleep. Routers forward traffic and stay awake; the coordinator forms the network. The C6 can be any of the three.` }
  ],
  choose: {
    good: [`Matter devices over Wi-Fi or Thread, commissioned from a phone over Bluetooth LE`, `Zigbee and Thread nodes, routers and gateways`, `Battery Wi-Fi sensors on a Wi-Fi 6 router that supports target wake time`, `A C3-class project that needs a few more pins and the newer radios`],
    avoid: [`Cameras, large displays, big buffers: no PSRAM`, `USB devices and Bluetooth audio: choose the S3 or the original ESP32`, `5 GHz Wi-Fi: choose the C5`, `Heavy simultaneous Wi-Fi, Bluetooth and Thread traffic`],
    check: [`That your hub or router supports target wake time before counting on it`, `Which package your board uses: 30 pins or 22`, `That the library you need supports the C6 in the version you have`, `The Tools menu: Zigbee mode and partition scheme for Zigbee sketches`]
  },
  code: [
    {
      title: `A Zigbee light that a hub can switch`,
      about: `The C6 joins a Zigbee network as an on/off light. When the hub (or an app) switches it, the on-board RGB LED goes on or off. It is the shortest program that shows what a chip with an 802.15.4 radio can do and the C3 and S3 cannot.`,
      needs: `An ESP32-C6 DevKit (the RGB LED is on GPIO8) and a Zigbee hub such as one running Zigbee2MQTT or ZHA in pairing mode. In the Arduino IDE choose Tools > Zigbee Mode > Zigbee ED (end device) and a Zigbee partition scheme.`,
      wiring: [[`GPIO8`, `the on-board RGB LED`, `lights white when driven high`], [`USB`, `computer`]],
      blocks: `
        when started
          join the Zigbee network as an on/off light :: radio
          wait until <Zigbee connected?> :: radio

        when the hub switches the light (state) :: radio
          set the on-board LED to (state) :: light
      `,
      cpp: String.raw`
        #include <Arduino.h>
        #ifndef ZIGBEE_MODE_ED
        #error "Select Tools > Zigbee Mode > Zigbee ED (end device)"
        #endif
        #include "Zigbee.h"

        #define ZIGBEE_LIGHT_ENDPOINT 10
        ZigbeeLight zbLight(ZIGBEE_LIGHT_ENDPOINT);

        void setLED(bool on) {
          digitalWrite(RGB_BUILTIN, on);                   // the on-board RGB LED lights white
        }

        void setup() {
          Serial.begin(115200);
          pinMode(RGB_BUILTIN, OUTPUT);
          zbLight.setManufacturerAndModel("Espressif", "ZBLightBulb");
          zbLight.onLightChange(setLED);
          Zigbee.addEndpoint(&zbLight);                    // add endpoints BEFORE begin()
          if (!Zigbee.begin()) {
            Serial.println("Zigbee failed to start");
            ESP.restart();
          }
          while (!Zigbee.connected()) delay(100);          // waits until the hub lets it join
          Serial.println("Joined the Zigbee network");
        }

        void loop() { delay(100); }
      `,
      na: { py: `The official MicroPython builds have no Zigbee support, so there is no MicroPython version of this program. Zigbee on the C6 is a C++ (Arduino or ESP-IDF) feature.` },
      output: `
        Joined the Zigbee network
      `,
      notes: [`Put the hub in pairing mode first. To forget the network and join another, call Zigbee.factoryReset().`, `Zigbee, Matter and Thread sketches need the matching option in the Tools menu or they stop with the #error above. The Arduino core 4.0 release candidate moves Zigbee to a new SDK, so a sketch may need small changes there.`]
    }
  ],
  quiz: [
    { q: `Which chip adds Zigbee and Thread to what the ESP32-C3 offers, while also gaining Wi-Fi 6?`, choices: [`ESP32-S3`, `ESP32-C6`, `ESP32-C2`, `ESP32-S2`], a: 1, why: `The C6 adds Wi-Fi 6 and an 802.15.4 radio (Zigbee 3.0 and Thread 1.3) to the C3's Wi-Fi 4 and Bluetooth LE. The S3, C2 and S2 have no 802.15.4.` },
    { q: `A battery sensor uses the C6 on a home router that supports only Wi-Fi 4. What happens to the target-wake-time saving?`, choices: [`It still works`, `It is unavailable: TWT needs a Wi-Fi 6 router that supports it`, `The C6 converts the router to Wi-Fi 6`, `It works only on 5 GHz`], a: 1, why: `Target wake time is an agreement between the device and a Wi-Fi 6 access point. Without one, the C6 uses ordinary power save, which still works but saves less.` },
    { q: `The ESP32-C6 supports 5 GHz Wi-Fi.`, a: false, why: `Its Wi-Fi 6 is on 2.4 GHz only. The ESP32-C5 is the dual-band chip.` },
    { q: `Why can heavy Wi-Fi traffic slow a Zigbee or Thread device running on the same C6?`, choices: [`Zigbee needs Wi-Fi to work`, `The radios share one front end and antenna and take turns`, `The C6 has one CPU core, which can only do one protocol`, `Thread uses the Wi-Fi channel`], a: 1, why: `Wi-Fi, Bluetooth and 802.15.4 share the radio hardware and antenna. The coexistence scheduler gives each its time slots, so a busy Wi-Fi link leaves less air time for the others.` }
  ],
  applications: [
    `Matter lights, plugs and sensors, over Wi-Fi or over Thread, set up from a phone by Bluetooth LE.`,
    `Zigbee end devices and routers: switches, bulbs and range extenders.`,
    `Battery-powered Wi-Fi 6 sensors using target wake time.`,
    `The radio companion of an ESP32-P4 board, giving it Wi-Fi 6 and Bluetooth.`
  ],
  history: `Announced in 2021 as Espressif's first chip with Wi-Fi 6, and the first to combine it with 802.15.4 for Thread and Zigbee. It became the reference chip for Matter on ESP32.`,
  sources: [
    `Espressif, *ESP32-C6 Series Datasheet*: features, pin table, strapping pins, electrical characteristics.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-C6: Wi-Fi, 802.15.4, Zigbee and OpenThread.`,
    `Arduino core for ESP32 documentation, *Zigbee* library and its On/Off Light example (core 3.3).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-c6', compare: 'esp32-c3' } }, { id: 'so-pin-budget', params: { chip: 'esp32-c6' } }]
},

/* ================================================================ ESP32-C5 */
{
  id: 'soc-esp32-c5',
  parent: 'the-soc-series',
  title: `ESP32-C5: dual-band Wi-Fi 6`,
  level: 2,
  short: `The first member to leave the crowded 2.4 GHz band: Wi-Fi 6 on 2.4 and 5 GHz, Bluetooth LE certified to Core 6.0, Zigbee and Thread, a 240 MHz core and PSRAM. In mass production since 2025.`,
  keywords: ['ESP32-C5', 'C5', '5 GHz', 'dual-band', 'Wi-Fi 6', 'Bluetooth 6', 'CAN FD', 'XIAO ESP32C5', 'DevKitC-1', 'PSRAM', '802.11ax', 'channel 36', 'crowded 2.4 GHz'],
  prereq: ['soc-esp32-c6', 'reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp32-c6', 'soc-esp32-c61', 'five-ghz-and-six-ghz', 'wifi-6-on-esp', 'wifi-scanning', 'xiao-esp32c6-and-c5', 'c-series-devkits', 'interference-and-channels'],
  body: `2.4 GHz is crowded: every router, microwave oven, baby monitor and Bluetooth speaker in the building shares it, and walls of apartment blocks hold dozens of networks on three useful channels. The **ESP32-C5** is the first chip of the family that can also use **5 GHz**. It is dual-band Wi-Fi 6 on 2.4 and 5 GHz, with Bluetooth LE certified to Core 6.0 and a Zigbee and Thread radio, on a 240 MHz RISC-V core with room for PSRAM. Announced in 2022 and in mass production since 2025, it is a C6 that has grown up.

### What it gives

| | ESP32-C5 |
|---|---|
| Processor | 1 × RISC-V at 240 MHz, no floating-point unit · plus a 48 MHz low-power core with its own UART and I2C |
| Memory | 384 KB RAM, 320 KB ROM, 16 KB that survives deep sleep · 4 MB flash inside some versions · PSRAM 2 or 8 MB inside, up to 32 MB |
| Radio | Wi-Fi 6 on 2.4 and 5 GHz (TWT, OFDMA, downlink MU-MIMO, 150 Mbit/s at most) · Bluetooth LE certified to Core 6.0 · Zigbee 3.0 and Thread 1.4 |
| Pins | 29 GPIOs (0–28) · strapping: GPIO2, 3, 7 and 25–28 · GPIO15–22 serve flash and PSRAM |
| Analogue | 6 ADC channels, 12 bit (GPIO1–6), no ADC2 · no DAC · no touch |
| Buses | 2 UART (and a low-power one) · 1 I2C (and a low-power one) · 1 SPI · 1 I2S · 2 CAN FD · RMT 2 + 2 · 6 PWM · 1 motor PWM · 4 pulse counters · SDIO slave |
| USB | USB Serial/JTAG only |
| Power | 3.0–3.6 V · about 12 µA in deep sleep · 110 mA receiving · up to 408 mA transmitting |
| Security | Secure Boot V2 (RSA-3072 or ECDSA up to P-384), XTS-AES encryption of flash and PSRAM, RSA and ECDSA Digital Signature, HMAC, trusted-execution controller, key manager from chip revision 1.2 |

### What makes it pleasant

**5 GHz.** The band has many more channels, far less interference and no Bluetooth or microwave oven in it. In a crowded building a 5 GHz link can be steadier than a 2.4 GHz one with a better signal.

**Everything in one.** Wi-Fi 6, a Core 6.0 Bluetooth radio, Zigbee and Thread on a 240 MHz core with PSRAM support, plus two CAN FD controllers: one chip for a gateway or a Matter device that wants to leave 2.4 GHz.

**Strong security.** ECDSA and RSA secure boot including P-384, two digital-signature peripherals and a key manager are more than the C6 carries.

### What it lacks

A single core with no floating-point unit. Its Wi-Fi 6 uses 20 MHz channels, so speed does not rise with 5 GHz. The 5 GHz radio draws much more: 110 mA receiving and a 408 mA peak while transmitting, so battery life is shorter than a C6's. Walls absorb 5 GHz more than 2.4 GHz, so **range is shorter**. There is no USB OTG, no Ethernet, no camera or display interface, no touch, no DAC, only six ADC channels, one I2S and one general SPI. The SDIO slave and key manager need chip revision 1.2 or newer, so check what you have. Software is younger than the C6's, though Arduino, ESP-IDF and MicroPython already support it.

### Where it sits in the family

The [[soc-esp32-c6|ESP32-C6]] is the same idea without 5 GHz and cheaper to run on a battery. The [[soc-esp32-c61|ESP32-C61]] gives Wi-Fi 6 at lower cost without 802.15.4. The [[soc-esp32-p4|ESP32-P4]] has a C5 version of its function board for dual-band wireless.

> [!key] The ESP32-C5 is the dual-band Wi-Fi 6 chip: 2.4 and 5 GHz, Bluetooth LE 6.0, Zigbee, Thread, a 240 MHz core and PSRAM. Choose it where the 2.4 GHz band is congested; accept the higher radio current and the shorter 5 GHz range.`,
  ideas: [
    `The C5 is the first chip of the family with 5 GHz: Wi-Fi 6 on both 2.4 and 5 GHz.`,
    `It adds Bluetooth LE certified to Core 6.0, Zigbee and Thread, a 240 MHz core and PSRAM support.`,
    `The 5 GHz radio draws more (110 mA receiving, 408 mA peak transmitting) and reaches less far through walls.`,
    `Its Wi-Fi 6 still uses 20 MHz channels: the gain from 5 GHz is cleaner air, not speed.`
  ],
  pitfalls: [
    `5 GHz Wi-Fi always works better than 2.4 GHz — It is quieter, but it reaches less far and passes walls poorly. Often the C5 falls back to 2.4 GHz at the far end of a house.`,
    `Dual-band means the chip joins both bands at once — It connects to one network on one band at a time, like any Wi-Fi device; it scans both bands and picks.`,
    `A 5 GHz chip gives 5 GHz speeds — The C5's channels are 20 MHz wide: the headline rate is still at most 150 Mbit/s.`
  ],
  terms: [
    { term: `Dual-band`, also: [`2.4 and 5 GHz`, `5 GHz Wi-Fi`], def: `Able to use both the 2.4 GHz and the 5 GHz Wi-Fi bands. 5 GHz has more channels and less interference but reaches less far through walls.` },
    { term: `CAN FD`, also: [`flexible data-rate CAN`], def: `A faster form of the CAN bus that sends longer frames and switches to a higher bit rate for the data part. The C5 has two such controllers.` },
    { term: `Wi-Fi channel number`, also: [`channel 36`, `channel 149`], def: `The index of a Wi-Fi channel. Numbers 1 to 14 are 2.4 GHz; numbers from 36 upwards (36, 40, 44 …) are 5 GHz, which is how a scan tells the bands apart.` },
    { term: `Chip revision`, also: [`silicon revision`, `v1.2`], def: `The version of the silicon itself, which fixes errata and sometimes adds features. On the C5 the SDIO slave and the key manager need revision 1.2 or later.` }
  ],
  choose: {
    good: [`Apartment-block and office Wi-Fi where 2.4 GHz is full`, `Gateways and Matter devices that want Wi-Fi 6, Thread and Bluetooth LE together`, `Designs needing CAN FD and a faster core without leaving the C-series`, `Companion radio for an ESP32-P4 where dual-band matters`],
    avoid: [`Long battery life on Wi-Fi: the 5 GHz radio is thirsty`, `Long range through walls: 2.4 GHz does better`, `USB devices, cameras, big displays or Bluetooth audio`, `A first board: software and boards are younger than for the C3 or C6`],
    check: [`Your router's 5 GHz channels and whether the chip's channels are allowed in your country`, `The chip revision, for SDIO slave and key manager`, `Your library's support for the C5 in the version you use`, `Peak current: size the supply for 408 mA bursts`]
  },
  code: [
    {
      title: `Scan for 5 GHz networks`,
      about: `Lists the networks the chip hears, with channel and signal strength, and counts how many are on 5 GHz. A channel number above 14 means 5 GHz. It only listens to the beacons that routers broadcast anyway.`,
      needs: `An ESP32-C5 board and the serial monitor at 115200 baud. Other chips list only 2.4 GHz networks, which makes a pleasing comparison.`,
      blocks: `
        when started
          start serial at (115200) baud
          set Wi-Fi mode to [station v] :: wifi
        forever
          set [networks v] to (scan for Wi-Fi networks) :: wifi
          set [five v] to (0)
          for each [n v] in (networks)
            if <(channel of (n)) > (14)> then
              change [five v] by (1)
            end
            print (join (channel of (n)) (join [ ] (name of (n))))
          end
          print (join (five) [ networks on 5 GHz])
          wait (10) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.disconnect();
          delay(100);
        }

        void loop() {
          int n = WiFi.scanNetworks();                   // takes a few seconds
          int five = 0;
          Serial.printf("%d networks found\n", n);
          for (int i = 0; i < n; i++) {
            int ch = WiFi.channel(i);
            bool is5 = ch > 14;                          // channels 1-14: 2.4 GHz, 36 and up: 5 GHz
            if (is5) five++;
            Serial.printf("%2d  ch %3d  %s  %4d dBm  %s\n", i + 1, ch, is5 ? "5 GHz  " : "2.4 GHz", WiFi.RSSI(i), WiFi.SSID(i).c_str());
          }
          Serial.printf("%d of them on 5 GHz\n\n", five);
          WiFi.scanDelete();                             // free the result list
          delay(10000);
        }
      `,
      py: String.raw`
        import network
        import time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)

        while True:
            nets = wlan.scan()                           # (ssid, bssid, channel, RSSI, authmode, hidden)
            five = 0
            print(len(nets), "networks found")
            for i, (ssid, bssid, ch, rssi, auth, hidden) in enumerate(nets, 1):
                is5 = ch > 14                            # channels 1-14: 2.4 GHz, 36 and up: 5 GHz
                if is5:
                    five += 1
                print("%2d  ch %3d  %s  %4d dBm  %s" % (i, ch, "5 GHz  " if is5 else "2.4 GHz", rssi, ssid.decode("utf-8", "ignore")))
            print(five, "of them on 5 GHz")
            print()
            time.sleep(10)
      `,
      output: `
        12 networks found
         1  ch   6  2.4 GHz   -48 dBm  HomeNet
         2  ch  36  5 GHz     -55 dBm  HomeNet-5G
         ...
        4 of them on 5 GHz
      `,
      notes: [`The list is an example; yours shows your neighbourhood. By default the C5 scans both bands.`, `Which 5 GHz channels are allowed depends on your country (some need radar detection): check your country's rules before setting a channel by hand.`]
    }
  ],
  quiz: [
    { q: `A scan on an ESP32-C5 shows a network on channel 44. Which band is it?`, choices: [`2.4 GHz`, `5 GHz`, `Bluetooth`, `Zigbee`], a: 1, why: `Wi-Fi channel numbers 1–14 are in the 2.4 GHz band; numbers from 36 upwards belong to 5 GHz.` },
    { q: `Why might a C5 battery sensor last less long on 5 GHz than on 2.4 GHz?`, choices: [`5 GHz uses a thicker antenna`, `The 5 GHz radio draws more current: 110 mA receiving and a 408 mA peak transmitting`, `The chip sleeps less`, `5 GHz needs a second core`], a: 1, why: `The C5's 5 GHz radio has a much higher supply current than a 2.4 GHz-only chip's, so each connection costs more charge.` },
    { q: `The ESP32-C5's Wi-Fi 6 reaches much higher speeds than the C6's because it uses 5 GHz.`, a: false, why: `Both use 20 MHz channels and one stream: at most 150 Mbit/s. 5 GHz brings cleaner air, not speed, on this chip.` },
    { q: `Which pair of chips is a Wi-Fi 6 pair with PSRAM support, both in mass production?`, choices: [`ESP32-C6 and ESP32-C3`, `ESP32-C5 and ESP32-C61`, `ESP32-S2 and ESP32-S3`, `ESP32-H2 and ESP32-C2`], a: 1, why: `The C5 and C61 support PSRAM; the C6 and C3 do not. The S2 and S3 support PSRAM but have Wi-Fi 4.` }
  ],
  applications: [
    `Gateways and hubs in apartment blocks and offices where 2.4 GHz is congested.`,
    `Matter and Thread devices that also want a 5 GHz uplink.`,
    `Boards such as the XIAO ESP32C5 and the ESP32-C5-DevKitC-1.`,
    `Companion Wi-Fi chip for an ESP32-P4 board that needs dual-band wireless.`
  ],
  history: `Announced in 2022 as the dual-band successor to the C6, and in mass production since 2025. Its Bluetooth radio is certified to Core 6.0, the newest in the family at the time of writing.`,
  sources: [
    `Espressif, *ESP32-C5 Series Datasheet*: features, pin table, strapping pins, chip revisions.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-C5: Wi-Fi bands and the security features.`,
    `Arduino core for ESP32 documentation, *Wi-Fi* API, scanning (core 3.3).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-c5', compare: 'esp32-c6' } }, { id: 'so-migrate', params: { from: 'esp32-c6', to: 'esp32-c5' } }]
},

/* ================================================================ ESP32-C61 */
{
  id: 'soc-esp32-c61',
  parent: 'the-soc-series',
  title: `ESP32-C61: Wi-Fi 6 at low cost`,
  level: 2,
  short: `Wi-Fi 6 and Bluetooth LE certified to Core 6.0 with PSRAM support, no Zigbee or Thread and no low-power core. The cost-reduced way to Wi-Fi 6 and the next step after the C3 — with software support still catching up.`,
  keywords: ['ESP32-C61', 'C61', 'Wi-Fi 6', 'PSRAM', 'low cost', 'ESP-Hosted', 'ESP-AT', 'co-processor', 'Bluetooth 6', 'ESP32-C61-DevKitC-1', 'successor of C3'],
  prereq: ['soc-esp32-c3', 'soc-esp32-c6', 'reading-the-family-names'],
  related: ['soc-esp32-c3', 'soc-esp32-c6', 'soc-esp32-c5', 'wifi-6-on-esp', 'esp-at-and-esp-hosted', 'c-series-devkits', 'using-psram'],
  body: `The **ESP32-C61** is a cost-reduced sibling of the C6. It keeps Wi-Fi 6 and a Bluetooth LE radio certified to Core 6.0, drops the 802.15.4 radio (so no Zigbee or Thread) and the low-power core, and adds something neither the C3 nor the C6 has: **support for PSRAM**, 2 or 8 MB inside the package or up to 32 MB outside. It is positioned as the next step after the ESP32-C3 for Wi-Fi 6 designs. At the time of writing its software support is still catching up, and only a couple of boards carry it.

### What it gives

| | ESP32-C61 |
|---|---|
| Processor | 1 × RISC-V (RV32IMAC) at 160 MHz, no floating-point unit, no low-power core · a fast five-stage core (about 554 CoreMark) |
| Memory | 320 KB RAM, 256 KB ROM · 4 MB flash inside · PSRAM 2 or 8 MB inside, up to 32 MB |
| Radio | Wi-Fi 6 on 2.4 GHz (TWT, OFDMA, downlink MU-MIMO) · Bluetooth LE certified to Core 6.0 · **no 802.15.4** |
| Pins | 30 GPIOs (0–29) · strapping: GPIO3, 4, 7, 8, 9 · GPIO14–21 serve flash and PSRAM · modules expose at most 23 |
| Analogue | 4 ADC channels, 12 bit (GPIO1, 3, 4, 5) · no DAC · no touch |
| Buses | 3 UART · 1 I2C · 1 SPI · 1 I2S · 6 PWM · SDIO 2.0 slave · no CAN, RMT, pulse counter or motor PWM |
| USB | USB Serial/JTAG only |
| Power | 3.0–3.6 V · about 10 µA in deep sleep · up to 360 mA transmitting |
| Security | Secure Boot V2 (ECDSA-256 only), XTS-AES flash and PSRAM encryption, ECDSA Digital Signature, permission control, power-glitch detector |

### What makes it pleasant

**Wi-Fi 6 at the lowest cost** of any chip of the family, with the target wake time that lets a battery device sleep between agreed moments.

**PSRAM at last in the C line.** A C3 or C6 cannot hold a camera frame or a big buffer; the C61 can, which opens larger displays and data buffers.

**Security without extra cost.** ECDSA secure boot, a signature peripheral, memory protection and encrypted flash and PSRAM come with it.

**A radio co-processor.** The SDIO 2.0 slave lets it serve as a Wi-Fi 6 radio for a host that has none, through ESP-Hosted or ESP-AT.

### What it lacks

No Zigbee or Thread, no Bluetooth Classic, one core with no floating-point unit and no low-power core. Few peripherals: four ADC channels, one I2C, one I2S, one general SPI, and none of CAN, RMT, pulse counting or motor PWM. Secure boot is ECDSA-256 only, with no RSA. The software is the main caution: the stable Arduino board package does not list it (it is used as an ESP-IDF component) and there is no MicroPython build.

### Where it sits in the family

Against the [[soc-esp32-c3|ESP32-C3]] it adds Wi-Fi 6, PSRAM and Bluetooth 6.0 but has fewer peripherals and less software. Against the [[soc-esp32-c6|ESP32-C6]] it is cheaper and has PSRAM, but no 802.15.4 and no low-power core. The [[soc-esp32-c5|ESP32-C5]] adds 5 GHz.

> [!key] The ESP32-C61 is the cheap route to Wi-Fi 6 with PSRAM: no Zigbee, Thread or low-power core, few peripherals, and software still catching up. Choose it for a Wi-Fi 6 product that needs memory; start a first project on a C3 or C6.`,
  ideas: [
    `The C61 offers Wi-Fi 6 and Bluetooth LE certified to Core 6.0 at the lowest cost, with PSRAM support that the C3 and C6 lack.`,
    `It drops 802.15.4 (Zigbee, Thread) and the low-power core of the C6.`,
    `Its peripherals are few: 4 ADC channels, one I2C, one I2S, one SPI, and no CAN, RMT or pulse counter.`,
    `Software support is still catching up: ESP-IDF yes, stable Arduino package and MicroPython not yet.`
  ],
  pitfalls: [
    `The C61 is a cheaper C6 with the same features — It lacks Zigbee, Thread and the low-power core, and has far fewer peripherals; it gains PSRAM. A Matter-over-Thread design cannot use it.`,
    `Any Arduino or MicroPython tutorial for the C6 will run on the C61 — The C61 is not in the stable Arduino board package and has no MicroPython build; it is used through ESP-IDF.`,
    `Four ADC channels are the first four pins — They are GPIO1, 3, 4 and 5: neither GPIO0 nor GPIO2 has an ADC.`
  ],
  terms: [
    { term: `ESP-Hosted`, also: [`Wi-Fi co-processor firmware`], def: `Espressif firmware that makes an ESP chip serve as the Wi-Fi and Bluetooth adapter of another processor, linked by SDIO, SPI or UART. The ESP32-P4 uses it to get wireless from a C6, C5 or C61.` },
    { term: `ESP-AT`, also: [`AT firmware`], def: `Firmware that lets a host control an ESP chip's Wi-Fi and Bluetooth with AT commands over a serial line, as it would a modem.` },
    { term: `SDIO slave`, also: [`SDIO 2.0`], def: `A mode in which the chip appears to a host processor as an SDIO card, giving fast communication. It lets the chip act as a Wi-Fi co-processor.` }
  ],
  choose: {
    good: [`A Wi-Fi 6 product at low cost that needs PSRAM`, `A Wi-Fi 6 radio for a host processor with no wireless (through ESP-Hosted)`, `Secure designs on a C-series budget`, `A project already built on ESP-IDF`],
    avoid: [`Zigbee, Thread or Matter over Thread: choose the C6`, `Arduino or MicroPython work today: use the C6 or C3`, `Many buses, CAN or motor control: the peripheral list is short`, `A first board: only a couple of boards carry it`],
    check: [`The status of Arduino and MicroPython support for the C61 at the time you build`, `Pins left after the PSRAM and flash take theirs (modules expose 23 at most)`, `That RSA is not needed: secure boot is ECDSA-256 only`, `Which boards exist: the choice is small`]
  },
  code: [
    {
      title: `Ask the chip who it is, and what memory it has`,
      about: `Prints the chip's name, clock, free memory and PSRAM size: the memory report that is the C61's reason to exist, and the first check on a new board. It is an ESP-IDF program because that is the C61's tool today.`,
      needs: `An ESP32-C61 board such as the ESP32-C61-DevKitC-1 and an ESP-IDF project (for C61 support, use a current ESP-IDF 5.5 release or later). PSRAM must be enabled in menuconfig for it to be counted.`,
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Clock in MHz: ] (CPU frequency))
          print (join [Free memory in bytes: ] (free memory))
          print (join [PSRAM in bytes: ] (PSRAM size))
      `,
      na: {
        cpp: `The stable Arduino board package for ESP32 does not list the ESP32-C61; it is used as an ESP-IDF component, so this program is given for ESP-IDF.`,
        py: `There is no official MicroPython build for the ESP32-C61 in version 1.29.`
      },
      idf: String.raw`
        #include <stdio.h>
        #include "sdkconfig.h"
        #include "esp_system.h"
        #include "esp_heap_caps.h"

        void app_main(void)
        {
            printf("Chip:       %s\n", CONFIG_IDF_TARGET);
            printf("Clock:      %d MHz\n", CONFIG_ESP_DEFAULT_CPU_FREQ_MHZ);
            printf("Free heap:  %lu bytes\n", (unsigned long)esp_get_free_heap_size());
            printf("PSRAM:      %lu bytes\n", (unsigned long)heap_caps_get_total_size(MALLOC_CAP_SPIRAM));   // 0 if none or not enabled
        }
      `,
      output: `
        Chip:       esp32c61
        Clock:      160 MHz
        Free heap:  (a few hundred kilobytes; yours will differ)
        PSRAM:      8388608 bytes        (0 if the module has none, or PSRAM is not enabled)
      `,
      notes: [`If PSRAM shows 0 on a board that has it, enable it in menuconfig (Component config, ESP PSRAM).`]
    }
  ],
  quiz: [
    { q: `Which feature does the ESP32-C61 have that the ESP32-C6 lacks?`, choices: [`Zigbee`, `PSRAM support`, `A low-power core`, `Two CAN controllers`], a: 1, why: `The C61 can use PSRAM (2 or 8 MB inside, up to 32 MB outside). The C6 has no PSRAM; the C6 also has Zigbee, a low-power core and two CAN controllers, which the C61 lacks.` },
    { q: `A smart-home maker wants a Matter device over Thread. Can the C61 do it?`, choices: [`Yes: it has Thread`, `No: it has no 802.15.4 radio; use a C6 or H2`, `Yes, with a firmware update`, `Only with PSRAM`], a: 1, why: `The C61 has no 802.15.4 radio, so no Thread and no Zigbee. Matter over Wi-Fi works; Matter over Thread needs the C6, C5 or H2.` },
    { q: `The ESP32-C61 can be programmed from the stable Arduino board package.`, a: false, why: `At the time of writing the C61 is not in the stable Arduino board package; it is used as an ESP-IDF component, and there is no official MicroPython build.` },
    { q: `Which ESP-Hosted-style use suits the C61 best?`, choices: [`A Wi-Fi 6 radio for a processor with no wireless, over SDIO`, `A camera sensor`, `A motor driver`, `A battery charger`], a: 0, why: `Its SDIO 2.0 slave lets it act as the wireless adapter of a host that has none.` }
  ],
  applications: [
    `Wi-Fi 6 products that need more memory than a C3 or C6 can give.`,
    `A Wi-Fi 6 co-processor beside a host processor, through ESP-Hosted or ESP-AT.`,
    `Low-cost secure Wi-Fi devices built with ESP-IDF.`,
    `The M5Stack CardKB2 keyboard unit and the ESP32-C61-DevKitC-1 kit.`
  ],
  history: `Announced and brought to mass production in 2025 as the low-cost Wi-Fi 6 chip of the C series, later than the C6 and C5. Software support for it grows with each ESP-IDF release.`,
  sources: [
    `Espressif, *ESP32-C61 Series Datasheet*: features, pin table, strapping pins, electrical characteristics.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-C61: supported features, PSRAM and security.`,
    `Espressif, *ESP-Hosted* and *ESP-AT* documentation (the co-processor roles).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-c61', compare: 'esp32-c6' } }, { id: 'so-pin-budget', params: { chip: 'esp32-c61' } }]
},

/* ================================================================ ESP32-H2 */
{
  id: 'soc-esp32-h2',
  parent: 'the-soc-series',
  title: `ESP32-H2: Zigbee and Thread without Wi-Fi`,
  level: 2,
  short: `Bluetooth LE 5.3, Zigbee and Thread — and no Wi-Fi at all. That is the point: without a Wi-Fi radio the receiver draws about 25 mA, not 80, and the chip suits mesh nodes on small batteries.`,
  keywords: ['ESP32-H2', 'H2', 'Zigbee', 'Thread', 'Matter over Thread', '802.15.4', 'no Wi-Fi', 'low power', 'sleepy end device', 'border router', 'RCP', 'BLE 5.3', 'ESP32-H2-DevKitM-1'],
  prereq: ['soc-esp32-c6', 'reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp32-c6', 'the-newest-chips', 'ieee-802-15-4', 'zigbee-on-esp', 'openthread-on-esp', 'thread-border-router', 'zigbee-and-thread-boards', 'esp32-h2-devkit', 'sleepy-ble-zigbee-thread', 'ble-advertising'],
  body: `Wi-Fi is the thirstiest part of a small radio chip: a receiver listening for Wi-Fi draws 80 mA or more, and a coin-sized battery cannot do that for long. The **ESP32-H2** simply leaves it out. It keeps Bluetooth LE 5.3 and the IEEE 802.15.4 radio of **Zigbee and Thread**, on a small RISC-V core at 96 MHz, and its receiver draws about 25 mA. It is the end device of a smart-home mesh, or the 802.15.4 half of a Thread border router, paired with a Wi-Fi chip.

### What it gives

| | ESP32-H2 |
|---|---|
| Processor | 1 × RISC-V (RV32IMAC) at 96 MHz, no floating-point unit, no low-power core (4 KB of low-power memory) |
| Memory | 320 KB RAM, 128 KB ROM · 2 or 4 MB flash inside · no PSRAM |
| Radio | **no Wi-Fi** · Bluetooth LE 5.3 (2 Mbit/s, coded range, extended advertising, mesh) · 802.15.4: Zigbee 3.0 and Thread 1.4 |
| Pins | 19 GPIOs (0–5, 8–14, 22–27) · strapping: GPIO8, 9, 25 |
| Analogue | 5 ADC channels, 12 bit (GPIO1–5) · no DAC · no touch |
| Buses | 2 UART · 2 I2C · 1 SPI · 1 I2S · 1 CAN · RMT 2 + 2 · 6 PWM · 1 motor PWM · 4 pulse counters |
| USB | USB Serial/JTAG only (GPIO26, GPIO27) |
| Power | 3.0–3.6 V · about 7 µA in deep sleep · 85 µA in light sleep · about 25 mA receiving · up to 140 mA transmitting |
| Security | Secure Boot V2 (RSA-3072 or ECDSA-256), XTS-AES flash encryption, RSA and ECDSA Digital Signature, HMAC, permission controller |
| Package | QFN32, 4 × 4 mm |

### What makes it pleasant

**Low current where it counts.** About 25 mA receiving and 140 mA transmitting, against 82 and 354 mA on the C6, and 7 µA asleep: Zigbee and Thread end devices spend nearly all their time in sleep and wake briefly to poll, so the battery life can run to years.

**A smaller, cheaper radio.** With no Wi-Fi front end the chip is a 4 × 4 mm part, and the radio design is simpler.

**A full security block** (secure boot with RSA or ECDSA, two signature peripherals, HMAC) and surprisingly many peripherals for the size: CAN, motor PWM, pulse counter, RMT.

### What it lacks

**No Wi-Fi**, so an H2 reaches the Internet only through a gateway: a Thread border router or a Zigbee hub. A 96 MHz core, 320 KB of RAM and no PSRAM or floating-point unit. No low-power coprocessor, no LP UART or I2C. 19 pins, five ADC channels and one I2S. No USB OTG, no Ethernet, no SDIO. Bluetooth is version 5.3, without LE Audio. Only pins GPIO8–14 can wake the chip from deep sleep.

### Where it sits in the family

The [[soc-esp32-c6|ESP32-C6]] is the H2 plus Wi-Fi 6 and a low-power core — and more current. Newer H-series chips are on the way: the H4 (two cores, LE Audio, sampling) and the H21 (a DC-DC converter for coin cells, announced) — see [[the-newest-chips|the newest chips]].

> [!key] The ESP32-H2 is the mesh chip: Zigbee, Thread and Bluetooth LE at very low current, and no Wi-Fi. Choose it for battery nodes of a Zigbee or Thread network; pair it with a Wi-Fi chip whenever the device must reach the Internet itself.`,
  ideas: [
    `The H2 has no Wi-Fi: only Bluetooth LE 5.3 and the 802.15.4 radio for Zigbee and Thread.`,
    `Without Wi-Fi its receiver draws about 25 mA instead of 80, and 7 µA in deep sleep suits battery nodes.`,
    `It reaches the Internet only through a gateway: a Thread border router or a Zigbee hub.`,
    `It is a small chip: 96 MHz, 320 KB of RAM, 19 pins, and no PSRAM or low-power core.`
  ],
  pitfalls: [
    `A Thread or Zigbee device needs no other equipment — It needs a border router or hub to reach the Internet. The H2 is the end device; something with Wi-Fi or Ethernet must carry its data out.`,
    `The H2 is a C6 without Wi-Fi at a lower price — It also lacks the low-power core, runs at 96 MHz not 160, and has fewer pins. It is a different tool for a different job.`,
    `Any pin can wake the H2 from deep sleep — Only GPIO8–14 (the low-power pins) can. The others do not work in deep sleep at all.`
  ],
  terms: [
    { term: `Thread border router`, also: [`border router`, `OTBR`], def: `A device that connects a Thread mesh to Wi-Fi or Ethernet, so that its nodes can be reached from the network. It is often an ESP32 with Wi-Fi paired with an H2 or C6 for the 802.15.4 side.` },
    { term: `Sleepy end device`, also: [`SED`, `Zigbee end device`], def: `A mesh node that sleeps most of the time and wakes briefly to ask its parent for messages, which is what lets it live on a small battery.` },
    { term: `Radio co-processor`, also: [`RCP`], def: `A chip that runs only the 802.15.4 radio layer for a host that runs the rest of Thread. It is how an H2 serves a border router.` },
    { term: `BLE advertising`, also: [`advertisement`, `advertising packet`], def: `A short packet a Bluetooth LE device broadcasts at regular intervals so that others can see it, with its name and what it offers. A phone's scanner app lists them.` }
  ],
  choose: {
    good: [`Battery-powered Zigbee or Thread end devices: sensors, switches, buttons`, `The 802.15.4 half of a Thread border router or Zigbee coordinator`, `Bluetooth LE devices that need years from a small cell`, `Matter-over-Thread devices that need no Wi-Fi`],
    avoid: [`Anything that must reach the Internet on its own`, `Heavy processing, memory or display work`, `Many pins or buses: 19 pins and one I2S`, `Wi-Fi provisioning or OTA over Wi-Fi: only over Thread or Bluetooth`],
    check: [`That a border router or hub exists in the final installation`, `How updates reach the device: over Thread, Zigbee or Bluetooth LE`, `That your wake-up pin is one of GPIO8–14`, `The software route: Arduino, MicroPython and ESP-IDF all support the H2`]
  },
  code: [
    {
      title: `A Bluetooth LE advertiser`,
      about: `The H2 has no Wi-Fi, so Bluetooth is the way to see it from a phone. This makes it advertise a name; a scanner app on a phone lists it, and you can watch the signal strength change as you walk away.`,
      needs: `An ESP32-H2 board such as the ESP32-H2-DevKitM-1 and a BLE scanner app on a phone (nRF Connect, for example).`,
      blocks: `
        when started
          start BLE as [H2-beacon] :: ble
          start advertising :: ble
        forever
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEUtils.h>
        #include <BLEServer.h>

        #define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

        void setup() {
          Serial.begin(115200);
          if (!BLEDevice::init("H2-beacon")) {              // the name a phone's scanner shows
            Serial.println("BLE failed to start");
            return;
          }
          BLEServer *server = BLEDevice::createServer();
          BLEService *service = server->createService(SERVICE_UUID);
          service->start();
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(SERVICE_UUID);
          adv->setScanResponse(true);
          BLEDevice::startAdvertising();
          Serial.println("Advertising as H2-beacon");
        }

        void loop() {
          delay(1000);
        }
      `,
      py: String.raw`
        import bluetooth
        import time

        ble = bluetooth.BLE()
        ble.active(True)

        name = b"H2-beacon"                                  # the name a phone's scanner shows
        adv = b"\x02\x01\x06" + bytes((len(name) + 1, 0x09)) + name   # flags + complete local name
        ble.gap_advertise(100_000, adv_data=adv)             # interval in microseconds
        print("Advertising as H2-beacon")

        while True:
            time.sleep(1)
      `,
      output: `
        Advertising as H2-beacon
      `,
      notes: [`The C++ version also advertises a service identifier; the MicroPython one broadcasts the name only. Both are found by name.`, `An advertiser is a beacon, not yet a conversation: to exchange data, the program adds a characteristic (see the pages on GATT).`]
    }
  ],
  quiz: [
    { q: `Why can an ESP32-H2 receive at about 25 mA when the ESP32-C6 needs about 82 mA?`, choices: [`The H2 runs at a lower voltage`, `The H2 has no Wi-Fi radio; its receivers for Bluetooth LE and 802.15.4 are far less hungry`, `The H2 has two cores`, `The H2 sleeps between bits`], a: 1, why: `A Wi-Fi receiver is the large consumer. The H2 carries only Bluetooth LE and 802.15.4, whose narrow-band receivers draw much less.` },
    { q: `An H2 sensor must publish data to a cloud service. What does the installation need?`, choices: [`Nothing: the H2 has Wi-Fi`, `A border router or Zigbee hub that bridges to the IP network`, `A second H2 as a repeater`, `A USB cable`], a: 1, why: `The H2 reaches the Internet only through a gateway: a Thread border router (with Wi-Fi or Ethernet) or a Zigbee hub.` },
    { q: `A push button on GPIO3 should wake an H2 from deep sleep.`, a: false, why: `Only GPIO8–14 (the low-power pins) can wake the chip from deep sleep; GPIO0–5 and GPIO22–27 do not work in deep sleep.` },
    { q: `Which describes the ESP32-H4, the H2's announced relative?`, choices: [`Wi-Fi 6 with Zigbee`, `Dual core, LE Audio, Zigbee and Thread, still sampling`, `A 5 GHz chip`, `A chip with Ethernet`], a: 1, why: `The H4 is a dual-core H-series chip with LE Audio, 802.15.4 and USB, in sampling at the time of writing, with no public datasheet.` }
  ],
  applications: [
    `Zigbee and Thread door sensors, buttons and thermostats powered by small cells.`,
    `The 802.15.4 radio of a Thread border router, beside a Wi-Fi chip.`,
    `Bluetooth LE beacons and trackers that must last for years.`,
    `Matter-over-Thread devices for smart homes, from boards such as the ESP32-H2-DevKitM-1.`
  ],
  history: `Announced in 2021 as Espressif's first chip without Wi-Fi: a Thread, Zigbee and Bluetooth LE part for battery devices. The H4 (dual-core) and H21 (with a DC-DC converter) continue the line.`,
  sources: [
    `Espressif, *ESP32-H2 Series Datasheet*: features, pin table, strapping pins, electrical characteristics.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-H2: 802.15.4, Zigbee, OpenThread and the sleep modes.`,
    `Arduino core for ESP32 documentation, *BLE* library; MicroPython documentation, *bluetooth* module (version 1.29).`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-h2', compare: 'esp32-c6' } }, { id: 'so-battery-life', params: { chip: 'esp32-h2', compare: 'esp32-c6', awake: 40 } }]
},

/* ================================================================ ESP32-P4 */
{
  id: 'soc-esp32-p4',
  parent: 'the-soc-series',
  title: `ESP32-P4: the powerhouse with no radio`,
  level: 2,
  short: `Two RISC-V cores at 400 MHz, up to 32 MB of PSRAM inside, MIPI display and camera, an H.264 encoder, high-speed USB and Ethernet — and no Wi-Fi or Bluetooth. A different kind of member: built for screens and video, with a companion chip for the radio.`,
  keywords: ['ESP32-P4', 'P4', 'MIPI-DSI', 'MIPI-CSI', 'H.264', 'JPEG', 'HMI', 'Tab5', 'Function-EV-Board', 'ESP-Hosted', 'no Wi-Fi', '400 MHz', 'USB high-speed', 'PPA'],
  prereq: ['soc-esp32-s3', 'reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp32-s3', 'soc-esp32-c6', 'esp32-p4-function-ev-board', 'm5-tab5-and-p4', 'esp-at-and-esp-hosted', 'display-interfaces', 'camera-interfaces', 'ai-accelerators-s3-and-p4', 'lcd-evaluation-boards'],
  body: `Everything else in the family is a radio chip that also computes. The **ESP32-P4** is the other way round: a fast processor that has no radio at all. Two RISC-V cores at 400 MHz with a floating-point unit and vector instructions, 768 KB of RAM and 16 or 32 MB of PSRAM *inside the package*, a MIPI display interface, a MIPI camera interface with an image processor, an H.264 video encoder and a JPEG codec, high-speed USB, Ethernet and 55 pins. It is made for screens, cameras and anything that moves pixels. Wireless comes from a companion chip — usually an ESP32-C6, sometimes a C5 or C61 — on the same board.

### What it gives

| | ESP32-P4 |
|---|---|
| Processor | 2 × RISC-V at 400 MHz with floating-point unit and 128-bit vector instructions · plus a 40 MHz low-power core with its own UART, I2C, SPI and I2S |
| Memory | 768 KB RAM, 128 KB ROM, 32 KB that survives deep sleep · 16 or 32 MB PSRAM inside · **no flash inside**: external flash, up to 64 MB, is required |
| Radio | **none**: no Wi-Fi, no Bluetooth, no 802.15.4 |
| Pins | 55 GPIOs (0–54), none lost to flash or PSRAM · strapping: GPIO34–38 |
| Analogue | 14 ADC channels, 12 bit · 14 touch pins · no DAC |
| Buses | 5 UART · 2 I2C (and I3C) · 2 SPI · 3 I2S · 3 CAN · RMT 4 + 4 · 8 PWM · 2 motor PWM groups · 4 pulse counters |
| Display and camera | MIPI-DSI display · RGB, i80 and SPI displays · MIPI-CSI camera with image signal processor · parallel camera · H.264 encoder (1080p at 30 frames a second) · JPEG codec · pixel-processing accelerator |
| Also | USB high-speed OTG and full-speed OTG and USB Serial/JTAG · 10/100 Ethernet MAC · SD/MMC host |
| Power | 3.0–3.6 V plus several domains (1.8 V I/O among them) · about 12 µA in deep sleep · about 97 mA with both cores at 400 MHz · −40 to 85 °C |
| Security | Key Manager with a hardware-unique key, RSA and ECDSA Digital Signature, HMAC, secure boot (RSA or ECDSA), memory encryption, trusted-execution controller |
| Package | QFN104, 10 × 10 mm |

### What makes it pleasant

**The whole pixel pipeline.** A camera feeds the image processor and the H.264 or JPEG encoder, a pixel accelerator scales and converts, and a MIPI-DSI display shows the result — without the processor touching every pixel. That is what lets a microcontroller drive a big touch panel or record video.

**Room.** 768 KB of RAM and 16 or 32 MB of PSRAM in the package, two fast cores and 55 free pins, with USB 2.0 high-speed, Ethernet and an SD host.

**A top-of-the-line security block**, with a key manager that derives keys from the chip itself.

### What it lacks

**No radio**: the P4 needs a companion chip (ESP32-C6, C5, C61, or the co-processor E22) linked by SDIO or SPI, running ESP-Hosted. **No flash inside**, so a board must add one. The chip needs several supply rails, including 1.8 V domains, and only works to 85 °C. It draws much more than a C or S chip when busy, comes in a large 104-pin package, has no DAC, and its datasheet on Espressif's site was still marked pre-release when the catalogue was compiled.

### Where it sits in the family

Against the [[soc-esp32-s3|ESP32-S3]], the P4 is far stronger on display, camera and speed but has no radio; the S3 remains the choice when one chip must carry Wi-Fi and Bluetooth and be easy to power. Boards pair the P4 with a C6 for wireless: the ESP32-P4-Function-EV-Board, the M5Stack Tab5 and many HMI panels.

> [!key] The ESP32-P4 is a screen-and-camera processor with no radio: 400 MHz, MIPI display and camera, H.264, up to 32 MB of PSRAM, USB high-speed and Ethernet. Choose it for panels and video; add a C6 for wireless, and plan the power and the flash.`,
  ideas: [
    `The P4 has two 400 MHz RISC-V cores, 768 KB of RAM and 16 or 32 MB of PSRAM in the package, and no radio.`,
    `It carries the pixel pipeline: MIPI-DSI display, MIPI-CSI camera with image processor, H.264 encoder, JPEG codec.`,
    `Wireless comes from a companion chip, usually an ESP32-C6, linked by SDIO and run by ESP-Hosted.`,
    `It has no flash inside, needs several supply rails, and works only between −40 and 85 °C.`
  ],
  pitfalls: [
    `The P4 is an S3 with more speed — It has no Wi-Fi, no Bluetooth and no flash inside; it needs a companion chip and a more careful power design. The S3 is still easier to use for radio projects.`,
    `A P4 board connects to Wi-Fi like any ESP32 — The Wi-Fi belongs to a separate chip on the board, and the P4 talks to it through ESP-Hosted. The software model differs from a normal ESP32's.`,
    `55 pins means 55 free pins on one 3.3 V rail — Pins sit in groups with their own supply voltages (1.65–3.6 V), each supply pin limited to 100 mA.`
  ],
  terms: [
    { term: `MIPI-DSI`, also: [`DSI`, `MIPI display interface`], def: `The high-speed serial interface of phone-style displays: few wires carry a very high pixel rate. The P4 is the only chip of the family with it.` },
    { term: `MIPI-CSI`, also: [`CSI`, `MIPI camera interface`], def: `The high-speed serial interface of camera sensors. With the P4's image signal processor it carries high-resolution video that the older parallel camera interface could not.` },
    { term: `H.264 encoder`, also: [`hardware video encoder`], def: `A circuit that compresses video into the H.264 format without using the processor. The P4's does 1080p at 30 frames a second.` },
    { term: `HMI`, also: [`human-machine interface`, `touch panel`], def: `The screen and controls through which a person operates a machine. HMI panels are the P4's home ground.` }
  ],
  choose: {
    good: [`Big touch displays with MIPI-DSI and smooth graphics`, `Cameras with MIPI-CSI, video recording and H.264 streaming`, `Heavy local processing: speech, vision, many buffers`, `USB high-speed host or device work, with Ethernet, in one chip`],
    avoid: [`Anything that needs Wi-Fi or Bluetooth without a companion chip`, `Battery devices or first experiments: it is thirsty and awkward to power`, `Hot environments: the rating is 85 °C`, `Simple sensors and switches: a C-series chip does them for far less`],
    check: [`Which companion radio the board carries, and how it is connected`, `The supply design: the P4 needs several rails`, `Whether your display and camera use MIPI or the older interfaces`, `The state of the datasheet and software for the chip revision you have`]
  },
  code: [
    {
      title: `Who is the P4, and how fast is it?`,
      about: `The P4's showpieces — a MIPI display, a camera, H.264 video — are too long for a snippet and depend on the board in front of you, so this prints what any board can show: the chip's name, cores, clock and PSRAM, and then times one million floating-point multiply-adds. Run the same program on a C3 and compare.`,
      needs: `An ESP32-P4 board (for example the ESP32-P4-Function-EV-Board) and the serial monitor at 115200 baud.`,
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Clock in MHz: ] (CPU frequency))
          set [x v] to (1)
          set [t0 v] to (microseconds since start)
          repeat (1000000)
            set [x v] to (((x) * (1.0000001)) + (0.5))
          end
          print (join [Time for a million multiply-adds, in microseconds: ] (((microseconds since start)) - (t0)))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                   // give the monitor time to open
          Serial.printf("Chip:   %s rev %d\n", ESP.getChipModel(), ESP.getChipRevision());
          Serial.printf("Cores:  %d\n", ESP.getChipCores());
          Serial.printf("Clock:  %lu MHz\n", (unsigned long)ESP.getCpuFreqMHz());
          Serial.printf("PSRAM:  %lu MB\n", (unsigned long)(ESP.getPsramSize() / (1024 * 1024)));

          volatile float x = 1.0f;                       // volatile: keeps the compiler from removing the loop
          uint32_t t0 = micros();
          for (int i = 0; i < 1000000; i++) {
            x = x * 1.0000001f + 0.5f;
          }
          uint32_t dt = micros() - t0;
          Serial.printf("A million multiply-adds: %lu us\n", (unsigned long)dt);
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, machine, time

        print("Chip:  ", sys.implementation._machine)
        print("Clock: ", machine.freq() // 1_000_000, "MHz")

        x = 1.0
        t0 = time.ticks_us()
        for i in range(1000000):
            x = x * 1.0000001 + 0.5
        dt = time.ticks_diff(time.ticks_us(), t0)
        print("A million multiply-adds:", dt, "us")
      `,
      output: `
        Chip:   ESP32-P4 rev 1
        Cores:  2
        Clock:  400 MHz
        PSRAM:  32 MB
        A million multiply-adds: (a few tens of milliseconds in C++; seconds in MicroPython)
      `,
      notes: [`The C++ times are an order of magnitude only: run it on your board. MicroPython is an interpreter and is far slower for the same loop; that is the price of its convenience.`, `MicroPython does not print the core count or the PSRAM size in one call.`]
    }
  ],
  quiz: [
    { q: `A product needs a 7-inch display on a MIPI-DSI connector and a camera with H.264 recording. Which chip?`, choices: [`ESP32-S3`, `ESP32-C6`, `ESP32-P4`, `ESP32-H2`], a: 2, why: `Only the P4 has MIPI-DSI, MIPI-CSI with an image processor and an H.264 encoder. The S3 has parallel RGB and DVP interfaces, not MIPI.` },
    { q: `How does a board with an ESP32-P4 get Wi-Fi?`, choices: [`The P4 has Wi-Fi 6 inside`, `From a companion chip, usually an ESP32-C6, linked by SDIO and run by ESP-Hosted`, `Through USB only`, `It cannot`], a: 1, why: `The P4 has no radio. Boards such as the ESP32-P4-Function-EV-Board carry a C6 that the P4 uses as its Wi-Fi and Bluetooth adapter.` },
    { q: `The ESP32-P4 has flash memory built into the package, like the C3's common versions.`, a: false, why: `The P4 has PSRAM in the package (16 or 32 MB) but no flash: external flash of up to 64 MB is required.` },
    { q: `Why is the P4 a poor choice for a battery-powered sensor?`, choices: [`It has no ADC`, `It draws far more current when busy (about 97 mA for two cores at 400 MHz) and needs several supply rails`, `It lacks a temperature rating`, `It cannot sleep`], a: 1, why: `It does sleep (about 12 µA), but its active current, supply complexity and size suit a mains-powered panel, not a coin cell.` }
  ],
  applications: [
    `Touch panels and HMI boards such as the M5Stack Tab5 and the CrowPanel Advanced 7- and 10.1-inch displays.`,
    `The ESP32-P4-Function-EV-Board, the reference platform with a C6 for wireless.`,
    `Video doorbells, cameras and video intercoms that need H.264.`,
    `Edge AI and vision boards, such as the ESP32-P4-EYE.`
  ],
  history: `Announced in 2023 as Espressif's first chip without a radio, aimed at displays, cameras and heavier processing. Its datasheet and chip revisions were still maturing at the time of writing; revision 3 added features.`,
  sources: [
    `Espressif, *ESP32-P4 Datasheet* (pre-release at the time of the catalogue): features, pins, power domains, strapping pins.`,
    `Espressif, *ESP-IDF Programming Guide* for the ESP32-P4: MIPI-DSI and MIPI-CSI, the video pipeline, USB.`,
    `Espressif, *ESP-Hosted* documentation: using a companion chip for Wi-Fi and Bluetooth.`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-p4', compare: 'esp32-s3' } }, { id: 'so-pin-budget', params: { chip: 'esp32-p4' } }]
},

/* ================================================================ the newest chips */
{
  id: 'the-newest-chips',
  parent: 'the-soc-series',
  title: `The newest: ESP32-S31, H4, H21 and E22`,
  level: 2,
  short: `Four chips of 2024–2026 that are not yet the safe choice: the S31 (every radio, in production, preview software), the H4 (sampling), the H21 (announced) and the E22, a Wi-Fi 6E co-processor that is not a microcontroller. Their numbers come from Espressif's announcements; much is not published.`,
  keywords: ['ESP32-S31', 'S31', 'ESP32-H4', 'H4', 'ESP32-H21', 'H21', 'ESP32-E22', 'E22', 'Wi-Fi 6E', 'LE Audio', 'Bluetooth Classic', 'gigabit Ethernet', 'sampling', 'announced', 'preview'],
  prereq: ['the-family-at-a-glance', 'soc-esp32-s3', 'soc-esp32-h2'],
  related: ['soc-esp32-h2', 'soc-esp32-p4', 'soc-esp32', 'product-lifecycle-and-longevity', 'esp-as-a-co-processor', 'ble-mesh-and-le-audio'],
  body: `A chip is not ready when it is announced. It goes through *announced*, *sampling* (a few made for testing), and *mass production*, and its software lags behind each step. Four newcomers sit at different points on that road. This page describes them from Espressif's announcements and early datasheets, and **says "not published at the time of writing" where there is nothing to quote**.

| | ESP32-S31 | ESP32-H4 | ESP32-H21 | ESP32-E22 |
|---|---|---|---|---|
| Status | in mass production since mid-2026, software in preview | sampling | announced | sampling |
| Processor | 2 × RISC-V at 320 MHz, FPU, vector instructions | 2 × RISC-V at 96 MHz, FPU | 1 × RISC-V at 96 MHz | 2 × RISC-V at 500 MHz |
| Memory | 512 KB RAM, 16 or 32 MB PSRAM inside, no flash inside | 384 KB RAM, 4 MB flash or 2 MB PSRAM options | 320 KB RAM, 4 MB flash | 1 MB RAM |
| Radios | Wi-Fi 6 (2.4 GHz), Bluetooth Classic and LE 5.4, Zigbee, Thread | Bluetooth LE 5.4 with LE Audio, Zigbee, Thread | Bluetooth LE (version not published), Zigbee, Thread | Wi-Fi 6E on 2.4, 5 and 6 GHz, Bluetooth Classic and LE 5.4 |
| Pins | 60 GPIOs | 40 GPIOs | 19 GPIOs | 41 GPIOs, as a co-processor |
| Software | ESP-IDF preview only | ESP-IDF preview only | ESP-IDF preview only | Linux host drivers, early |

### ESP32-S31: every radio at once

The most complete radio chip of the family. Two RISC-V cores at 320 MHz with vector instructions, 512 KB of RAM, 16 or 32 MB of PSRAM in the package, **Wi-Fi 6, Bluetooth Classic and LE with LE Audio, Zigbee and Thread**, gigabit Ethernet, high-speed USB, two DACs and fourteen touch pins. It is the only chip since the original ESP32 with Bluetooth Classic. The cautions: the datasheet was still a pre-release; ESP-IDF supports it as a preview; Arduino, MicroPython and the rest not yet; Wi-Fi is 2.4 GHz and 20 MHz only; there is no flash inside; the rating is 85 °C. It is a chip to watch, not to start with.

### ESP32-H4: the dual-core H

A successor line to the [[soc-esp32-h2|H2]] for wearables and audio: two 96 MHz cores with a floating-point unit, Bluetooth 5.4 LE with LE Audio and direction finding, Zigbee and Thread, an on-chip DC-DC converter, touch pins and USB. It samples only: no public datasheet, and its current, RF power and temperature range are **not published at the time of writing**.

### ESP32-H21: coin cells in mind

An update of the H2 with an on-chip DC-DC converter, which brings the receive current to about 8 mA, light sleep to 9 µA and deep sleep to 5 µA, in a 4 × 4 mm package with 4 MB of flash. Announced only: **its Bluetooth version and most electrical figures are not published**.

### ESP32-E22: not a microcontroller

A connectivity co-processor for Linux hosts: tri-band Wi-Fi 6E (2.4, 5 and 6 GHz, 2 × 2 streams, 160 MHz channels, up to 2.4 Gbit/s at the radio) and dual-mode Bluetooth, run by a 500 MHz dual core, linked to the host over PCIe, SDIO or USB, in an M.2 2230 module. Its early Linux driver supports station mode over PCIe only. It is listed so the name is not a mystery: you do not write programs for it.

> [!key] The S31, H4, H21 and E22 show where the family is going — every radio on one chip, dual-core mesh chips, coin-cell mesh, Wi-Fi 6E — but today none is a safe base for a product. Read each one's status and software before you read its feature list.`,
  ideas: [
    `Announced, sampling, mass production: a chip's status, and the maturity of its software, decide whether it is usable.`,
    `The S31 has every radio, including Bluetooth Classic and Wi-Fi 6, but only preview software.`,
    `The H4 (dual-core) and H21 (DC-DC, coin cells) extend the H2 line, with most figures unpublished.`,
    `The E22 is a Wi-Fi 6E co-processor for Linux hosts, not a microcontroller.`
  ],
  pitfalls: [
    `A chip in mass production is ready to design with — The S31 is in production, but ESP-IDF supports it only as a preview and Arduino and MicroPython do not support it yet. Production is the chip; ready is the software.`,
    `The E22 is an ESP32 for sensors and gadgets — It is a radio co-processor that needs a Linux host. You cannot flash a sketch to it.`,
    `Feature lists on a product page are specifications — For the H4, H21 and E22 there is no public datasheet: figures such as current and RF power are not published, and may change.`
  ],
  terms: [
    { term: `LE Audio`, also: [`LC3`, `Auracast`], def: `The newer Bluetooth audio system on Low Energy radios, with a new codec (LC3) and broadcast audio. It is different from the Classic A2DP audio of the original ESP32.` },
    { term: `Wi-Fi 6E`, also: [`6 GHz Wi-Fi`], def: `Wi-Fi 6 extended to the 6 GHz band, which has many wide, uncrowded channels. The E22 is the first Espressif chip with it.` },
    { term: `Preview support`, also: [`preview target`, `early software`], def: `Software that works for a chip but is not yet a supported release: parts may be missing or change. ESP-IDF supports the S31 only as a preview, and other frameworks not at all.` },
    { term: `DC-DC converter`, also: [`buck converter`, `on-chip DC-DC`], def: `A switching power converter that makes a lower voltage from the supply with little loss, unlike a linear regulator that burns the difference as heat. Inside a chip it lowers the current drawn from the battery.` }
  ],
  choose: {
    good: [`Learning what the family will offer next`, `Products planned for 2027 and later, with a fall-back chip`, `The S31 for early evaluation of Wi-Fi 6 with Bluetooth Classic`, `The E22 for Linux boxes that need Wi-Fi 6E`],
    avoid: [`Starting a product on a chip in sampling or announced`, `Arduino or MicroPython work on the S31, H4 or H21 today`, `Counting on unpublished figures: current, range, temperature`, `Any microcontroller project on the E22`],
    check: [`The chip's status and datasheet version before design-in`, `Software support in your framework, not only in ESP-IDF`, `Which boards exist: very few carry these chips`, `The Bluetooth version and the power figures once they are published`]
  },
  quiz: [
    { q: `The ESP32-S31 is in mass production. Is it a safe base for a new Arduino-based product today?`, choices: [`Yes: production means ready`, `No: Arduino-ESP32 does not support it yet, and ESP-IDF support is a preview`, `Yes, through MicroPython`, `Only without Wi-Fi`], a: 1, why: `The chip is in production, but its software is in preview: ESP-IDF only, with Arduino, MicroPython and others not supported yet.` },
    { q: `Which new chip is not a microcontroller at all?`, choices: [`ESP32-S31`, `ESP32-H4`, `ESP32-H21`, `ESP32-E22`], a: 3, why: `The E22 is a Wi-Fi 6E and Bluetooth co-processor for a Linux host, connected by PCIe, SDIO or USB.` },
    { q: `Among the microcontrollers of the family, only the original ESP32 and the ESP32-S31 have Bluetooth Classic.`, a: true, why: `Every other microcontroller with a radio is Bluetooth LE only. (The E22 co-processor also has dual-mode Bluetooth.)` },
    { q: `What does "not published at the time of writing" mean for the H4's power figures?`, choices: [`They are zero`, `Espressif has not released them, so a design cannot rely on any number`, `They equal the H2's`, `They are published in the Arduino core`], a: 1, why: `There is no public datasheet yet. Any number you see is a marketing figure at best, and may change.` }
  ],
  applications: [
    `Evaluation boards for the S31: the ESP32-S31-Function-CoreBoard-1, ESP32-S31-Korvo-1 and ESP-Mosaico.`,
    `Planning wearables and LE Audio products around the H4.`,
    `Choosing a coin-cell Thread design with an eye on the H21.`,
    `Embedded Linux gateways and PCs that want a Wi-Fi 6E module in an M.2 slot.`
  ],
  history: `The H4 was first shown in 2024; the S31, H21 and E22 followed in 2026. Of the four only the S31 is in mass production, since mid-2026, and its software is still preview.`,
  sources: [
    `Espressif, ESP32-S31 pre-release datasheet and product page (S31 figures as published in 2026).`,
    `Espressif, product pages of the ESP32-H4, ESP32-H21 and ESP32-E22 (status as of October 2026).`,
    `Espressif, *ESP-IDF Programming Guide*, the versions page with its table of chip support status.`
  ],
  sim: [{ id: 'ref-chip', params: { chip: 'esp32-s31', compare: 'esp32-s3' } }, 'so-family-tree']
}
);
