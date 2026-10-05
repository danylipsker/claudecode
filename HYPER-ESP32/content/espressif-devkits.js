/* HYPER-ESP32 · content/espressif-devkits.js
 *
 * Espressif's own boards: what every development board contains, the USB bridge and the auto-reset circuit, the
 * DevKitC and DevKitM families for each chip, the S3-BOX-3, the camera, audio and LCD kits, the ESP32-P4 board and the
 * debug adapters. Board facts come from the 66 Espressif records of the board catalogue (read 2026-10-04).
 */
Hyper.add(
/* ================================================================ 1. anatomy */
{
  id: 'anatomy-of-a-dev-board',
  parent: 'espressif-devkits',
  title: 'Anatomy of a development board',
  level: 1,
  short: 'A development board is a module plus everything needed to power it, program it and wire things to it: a 3.3 V regulator, a USB connector with a bridge chip or the chip\'s own USB, two buttons, a power LED and the pin headers.',
  keywords: ['development board', 'devkit', 'dev kit', 'DevKitC', 'DevKitM', 'regulator', 'LDO', 'USB bridge', 'EN button', 'BOOT button', 'power LED', 'header', 'J5 jumper', 'what is on the board'],
  prereq: ['chip-module-board', 'what-a-module-adds'],
  related: ['usb-serial-bridges-and-auto-reset', 'the-3v3-rail', 'regulators-ldo-and-buck', 'reading-a-pinout', 'the-board-is-not-the-chip'],
  body: `A bare ESP32 chip is a speck with dozens of tiny pads. A [[what-a-module-adds|module]] puts it on a small board with flash memory, a crystal and an antenna. A **development board** — a *DevKit* — puts the module on a larger board with everything a person needs in order to power it, program it and plug wires into it. Open one up (the simulation below does) and every board of the family turns out to hold the same few blocks.

### The blocks, in the order the current flows

1. **A USB connector.** It brings 5 V and, usually, data. Older boards have Micro-USB, newer ones USB-C; some have two connectors.
2. **A 3.3 V regulator.** The chip runs from about 3.0–3.6 V, so a *linear regulator* ([[regulators-ldo-and-buck|LDO]]) drops the 5 V. It also feeds the **3V3** pin of the header, but only with what the module leaves over.
3. **A way to talk to the computer.** Either a *bridge chip* that turns USB into the serial port the chip's boot ROM understands, or the chip's own built-in USB. See [[usb-serial-bridges-and-auto-reset]].
4. **Two buttons.** **EN** (marked RST on some boards) resets the chip; **BOOT** is held while resetting to ask for a new program.
5. **The module** itself, with its antenna at the end of the board — keep metal and the user's hand away from that end.
6. **LEDs.** Almost every board has a *power* LED; some add a user LED or an addressable RGB LED.
7. **Pin headers.** Two rows at 2.54 mm pitch that carry the GPIOs, power and ground to a breadboard.

### Five boards, five answers

| Board | Size | USB | LEDs | Notes |
|---|---|---|---|---|
| ESP32-DevKitC V4 | 27.9 × 54.4 mm | Micro-USB, bridge | 5 V power LED only | 38 header holes |
| ESP32-S3-DevKitC-1 v1.1 | 25.4 × 62.74 mm | bridge + the chip's own USB | RGB on GPIO38, 3.3 V power LED | RGB moved from GPIO48 in v1.0 |
| ESP32-C3-DevKitM-1 | 25.4 × 44.31 mm | Micro-USB, bridge | RGB on GPIO8, 5 V power LED | the chip's USB pins are on the header |
| ESP32-C6-DevKitC-1 | 25.5 × 51.8 mm | two USB-C: bridge + the chip's own USB | RGB (WS2812) on GPIO8 | J5 jumper for measuring current |
| ESP32-H2-DevKitM-1 | 25.4 × 48.26 mm | two USB-C: bridge + the chip's own USB | RGB on GPIO8 | J5 jumper; 32 kHz crystal option |

### What the board does *not* promise

- **The power LED shows 5 V, not 3.3 V.** On the DevKitC V4 and the C3-DevKitM-1 the LED sits on the 5 V rail, so it can glow while the regulator is dead.
- **The regulator is small.** The chip can draw about a quarter of an ampere while the radio transmits (the catalogue gives 240 mA for the ESP32, 335 mA for the C3). Add a sensor on the 3V3 pin and the margin shrinks — see [[current-peaks-and-capacitors]].
- **Deep sleep on the board is not deep sleep of the chip.** The bridge chip, the regulator and the LEDs keep drawing current, often a thousand times more than the chip's microamps ([[the-board-is-not-the-chip]]). The J5 jumper of the newer boards is there so that you can lift the module's supply and measure it alone.
- **Antenna end.** The module's antenna is wasted over a metal desk or inside a breadboard rail.

> [!key] Every DevKit is a module with a regulator, a USB path, EN and BOOT buttons, a power LED and headers. Know which USB path your board has and which pin its LED is on, and the rest of the family looks the same.`,
  ideas: [
    'A development board adds to a module the five things a person needs: power, a programming link, two buttons, a light and a row of pins.',
    'The 5 V from USB goes through a 3.3 V regulator; the 3V3 pin shares what the module does not use.',
    'The computer reaches the chip either through a bridge chip or through the chip\'s own USB, and newer boards often have both.',
    'EN resets, BOOT asks for a new program: together they make a board programmable by hand.'
  ],
  pitfalls: [
    'If the power LED is lit, the chip has 3.3 V — The LED is often wired to the 5 V rail. It proves USB is connected, not that the regulator works.',
    'A board that "needs" 7 µA in deep sleep will run for years on a battery — The chip draws 7 µA; the board adds a regulator, a bridge and LEDs that draw far more. Measure the board, not the datasheet.',
    'The two USB connectors on a DevKit do the same thing — One goes through the bridge chip to the serial port, the other to the chip\'s own USB pins. They appear as different ports and behave differently when the program restarts.'
  ],
  terms: [
    { term: 'Development board', also: ['devkit', 'dev kit', 'evaluation board'], def: 'A circuit board that carries a module or chip together with power regulation, a USB programming path, buttons, LEDs and pin headers, so that a person can program it and connect parts without designing a circuit.' },
    { term: 'LDO', also: ['low-dropout regulator', 'linear regulator'], def: 'A regulator that lowers a voltage by turning the difference into heat. A DevKit uses one to make 3.3 V from the 5 V of USB; the heat is (5 V − 3.3 V) times the current.' },
    { term: 'USB-to-UART bridge', also: ['bridge chip', 'USB-serial converter', 'CP2102N', 'CH340', 'CH9102'], def: 'A small chip on the board that appears to the computer as a serial port and talks UART to the ESP32. Its speed limit and its driver depend on the chip used.' },
    { term: 'EN', also: ['CHIP_PU', 'RST', 'reset button'], def: 'The enable pin of the chip. Pulling it low holds the chip in reset; releasing it starts the chip. The EN button, labelled RST on some boards, does exactly that.' },
    { term: 'Pin header', also: ['header', 'breadboard header'], def: 'The rows of 2.54 mm pins along the board\'s edges that carry GPIOs, 3V3, 5V and ground. The board catalogue lists them in order, left row and right row.' }
  ],
  choose: {
    good: ['Learning, prototyping and any first experiment with a chip: everything needed is on the board', 'Boards you can reset and re-flash by hand, with the datasheet and schematic published', 'Projects that stay on a breadboard or a desk'],
    avoid: ['Battery products that must sleep for months: the bridge, regulator and LEDs waste the budget', 'Products that must be small or certified: design with the module on your own board', 'Anything where you need to know what regulator is fitted, unless you have the schematic of that revision'],
    check: ['Which USB path the board has: bridge, native USB, or both', 'Whether the power LED sits on 5 V or on 3.3 V', 'Which pin the LED is on, and whether it is a plain LED or an addressable RGB one', 'The silkscreen against the pinout: clones reorder pins']
  },
  code: [
    {
      title: 'A heartbeat that shows the board is alive',
      about: 'Prints the uptime and the free memory once a second. Press the **EN** button and the uptime starts again from zero — the simplest way to see what EN does. Pressing BOOT alone changes nothing while the program runs.',
      needs: 'Any ESP32-family DevKit and a USB cable that carries data. Open the serial monitor at 115200 baud.',
      wiring: [['USB', 'computer', 'the port with the bridge, or the chip\'s own USB with CDC on boot enabled']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          print (join [uptime in seconds: ] ((milliseconds since start) / (1000)))
          print (join [free heap in bytes: ] (free memory))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          Serial.printf("uptime %lu s, free heap %lu bytes\n", millis() / 1000, (unsigned long)ESP.getFreeHeap());
          delay(1000);
        }
      `,
      py: String.raw`
        import gc
        import time

        start = time.ticks_ms()

        while True:
            up = time.ticks_diff(time.ticks_ms(), start) // 1000
            print("uptime", up, "s, free heap", gc.mem_free(), "bytes")
            time.sleep(1)
      `,
      output: `
        uptime 0 s, free heap 231884 bytes
        uptime 1 s, free heap 231884 bytes
        uptime 2 s, free heap 231884 bytes
      `,
      notes: ['The free-memory figures differ between the languages because they count different heaps: the Arduino core reports the chip\'s heap, MicroPython its own working heap.', 'On a chip with native USB (S3, C3, C6 and the others), nothing appears unless the monitor is on the right port and, in Arduino, "USB CDC On Boot" is enabled — see [[usb-serial-bridges-and-auto-reset]].']
    }
  ],
  examples: [
    {
      title: 'How warm does the regulator get?',
      q: 'A DevKit makes 3.3 V from the 5 V of USB with a linear regulator. The ESP32 transmits, drawing 240 mA (the catalogue figure). How much power does the regulator turn into heat, and what share of the power taken from USB is that?',
      steps: ['A linear regulator drops the difference between input and output: $5.0 - 3.3 = 1.7$ V.', 'The heat is that voltage times the current: $1.7 \\times 0.24 = 0.41$ W.', 'The power taken from the 5 V rail is $5.0 \\times 0.24 = 1.2$ W, so about a third of it ($1.7/5 = 34\\%$) is heat in the regulator.'],
      a: 'About 0.4 W of heat, a third of the supply power. A small regulator on a thin board gets warm during long transmissions — one reason battery products use a switching regulator instead.'
    }
  ],
  quiz: [
    { q: 'The power LED of a DevKit is lit, but the chip does not run. Which statement is true?', choices: ['The chip must be broken', 'The LED may be on the 5 V rail, so 3.3 V is not proven', 'USB is not connected', 'The program has crashed'], a: 1, why: 'On several boards the LED is wired to 5 V. It shows that USB power arrived; the regulator or the module could still be at fault.' },
    { q: 'What does the EN button do?', choices: ['Erases the flash', 'Pulls the enable pin low, which resets the chip', 'Puts the chip into deep sleep', 'Enables the Wi-Fi radio'], a: 1, why: 'EN is the chip\'s enable pin. Low holds the chip in reset, and releasing it restarts the program — the uptime in the heartbeat program starts from zero.' },
    { q: 'A DevKit\'s 3V3 pin can power any number of sensors.', a: false, why: 'It is the output of a small regulator that also feeds the module. During a Wi-Fi transmission the module takes a few hundred milliamperes, so the margin for external parts is limited.' },
    { q: 'Why can a board with a 7 µA chip drain a battery in weeks while asleep?', choices: ['The chip wakes more often than it should', 'The regulator, USB bridge and LEDs keep drawing current', 'Batteries lose capacity when the chip sleeps', 'Deep sleep does not exist on DevKits'], a: 1, why: 'The chip\'s figure applies to the chip alone. Everything else on a DevKit stays powered and usually draws far more than 7 µA.' }
  ],
  applications: [
    'The first board anyone buys: a DevKit on a breadboard is the standard way to try a sensor or a library.',
    'Reference designs: the circuit of a DevKit (regulator, buttons, auto-reset) is copied into many products.',
    'Test benches, where a DevKit acts as the controller of a rig.',
    'Teaching, because one board shows power, programming and pins in one place.'
  ],
  sources: [
    'Espressif, user guide of the ESP32-DevKitC V4 in the esp-dev-kits documentation: functional description, header tables, schematic.',
    'Espressif, user guides of the ESP32-S3-DevKitC-1, ESP32-C3-DevKitM-1, ESP32-C6-DevKitC-1 and ESP32-H2-DevKitM-1 (the esp-dev-kits documentation).',
    'Espressif, *ESP32 Hardware Design Guidelines*: the minimal system and the auto-reset circuit.'
  ],
  sim: 'dk-anatomy'
},

/* ================================================================ 2. USB bridges and auto-reset */
{
  id: 'usb-serial-bridges-and-auto-reset',
  parent: 'espressif-devkits',
  title: 'USB bridges, auto-reset and the two buttons',
  level: 2,
  short: 'How a computer reaches the chip over USB, and how two serial control lines and two transistors let a programming tool reset the chip and ask for download mode with no button pressed.',
  keywords: ['USB bridge', 'CP2102N', 'CP2102', 'CH340', 'CH9102', 'FT2232', 'auto-reset', 'DTR', 'RTS', 'EN', 'BOOT', 'download mode', 'USB Serial/JTAG', 'native USB', 'failed to connect', 'COM port', 'driver', 'esptool reset'],
  prereq: ['anatomy-of-a-dev-board', 'strapping-pins', 'boot-modes-and-download-mode'],
  related: ['flashing-and-esptool', 'drivers-and-serial-ports', 'upload-problems', 'usb-on-the-esp', 'the-serial-monitor', 'uart-on-the-esp'],
  body: `To put a new program into the chip, the computer needs a path to the chip's boot ROM, and the boot ROM speaks only a plain serial port (UART) — or, on newer chips, USB directly. A DevKit supplies that path in one of two ways, and the two behave differently.

### Path one: a bridge chip

A small chip on the board shows up on the computer as a serial port and talks UART to the ESP32. The records of the board catalogue name several: a **CP2102** (limit 1 Mbit/s) and a **CP2102N** (3 Mbit/s) on Espressif's own boards, and an **FTDI FT2232** with two channels (one UART, one JTAG) on the ESP-WROVER-KIT. Third-party boards often use a **CH340** or **CH9102**. The bridge needs a driver on some systems, and it keeps working while the program on the chip crashes or restarts, so the serial monitor stays connected.

### Path two: the chip's own USB

The ESP32-S3, C3, C6, C5, C61, H2 and P4 contain a *USB Serial/JTAG* block: a fixed USB function on two pins that looks to the computer like a serial port **and** a debugger, with no bridge at all. The S2, S3 and P4 also have a full USB controller for keyboards, drives and the like. Cheaper boards simply wire the connector to the chip. The price: when the program restarts or takes over the two USB pins, the port vanishes and comes back, and a program that reconfigures those pins as plain GPIO cuts its own cable. The classic ESP32 has no USB at all, so every ESP32 board needs a bridge.

Many DevKits give you **both**: the ESP32-S3-DevKitC-1, the C6, C5, C61 and H2 DevKits each carry a bridge on one connector and the chip's own USB on the other. Plug into the one you meant; the two appear as two different ports.

### The two buttons, and the trick behind them

To enter download mode by hand you hold **BOOT** (the boot strapping pin low, see [[strapping-pins]]) while tapping **EN** (reset). That is awkward, so a bridge board adds a circuit that does it from the computer. The bridge has two spare control lines, **DTR** and **RTS**. RTS is wired to EN and DTR to the boot pin, each through a transistor. Each transistor conducts only when its two inputs *differ*, so setting both lines at once — which is what a terminal program does when it opens the port — does nothing. The programming tool sets them in sequence: RTS pulls EN low to reset the chip, then DTR holds the boot pin low while EN rises again, and the chip starts in download mode. The simulation shows the traces.

| Chip | BOOT pin | Hold low at reset to… |
|---|---|---|
| ESP32, ESP32-S3 | GPIO0 | enter download mode |
| ESP32-C3, C6, C61, H2 | GPIO9 | enter download mode |
| ESP32-C5 | GPIO28 | enter download mode |
| ESP32-P4 | GPIO35 | enter download mode |

### When it does not work

- **"Failed to connect".** The circuit is missing or too slow (some clones lack parts), or the port is wrong. Hold BOOT, tap EN, release BOOT, and try again.
- **A charge-only cable.** No data wires, no port.
- **A native-USB board stuck in a crash loop.** Hold BOOT, press and release EN, then release BOOT to force download mode ([[upload-problems]]).
- **Two ports, wrong one.** Check which connector goes where.

> [!key] A bridge chip turns USB into a serial port, and two transistors turn its DTR and RTS lines into "reset" and "boot pin low", so the computer can program the chip hands-free. The chips with built-in USB do the same without a bridge, at the price of the port disappearing when the program restarts.`,
  ideas: [
    'The boot ROM listens on a serial port; a bridge chip, or the chip\'s own USB block, connects it to the computer.',
    'The classic ESP32 always needs a bridge. The S3, C3, C6, C5, C61, H2 and P4 can talk USB directly.',
    'RTS drives the EN pin and DTR the boot pin; two transistors make the circuit ignore both being set at once.',
    'Holding BOOT while tapping EN does by hand what the tool does by wire.'
  ],
  pitfalls: [
    'Any USB cable will do — Charge-only cables carry power but no data. The board powers up and no port appears.',
    'The port number never changes — A native-USB board disconnects and reconnects when it resets, and the operating system may give it a different number; a bridge keeps its port.',
    'Pressing BOOT at any time puts the board into download mode — BOOT matters only at the moment of reset. While the program is running, the same button is just a button on a pin that the program may read.'
  ],
  terms: [
    { term: 'DTR', also: ['Data Terminal Ready'], def: 'A serial control line of the bridge chip, not used for data. Programming tools use it to hold the boot pin low during a reset.' },
    { term: 'RTS', also: ['Request To Send'], def: 'Another control line of the bridge chip. On a DevKit it is wired through a transistor to the EN pin, so the tool can reset the chip.' },
    { term: 'Auto-reset', also: ['auto-programming circuit', 'automatic upload circuit'], def: 'The two-transistor circuit that turns DTR and RTS into EN and the boot pin, so that a program can be uploaded without pressing any button.' },
    { term: 'USB Serial/JTAG', also: ['built-in USB', 'native USB serial'], def: 'A USB function inside the ESP32-S3, C3, C6, C5, C61, H2 and P4 that appears to a computer as a serial port and a JTAG debugger, using two fixed pins and no bridge chip.' },
    { term: 'Download mode', also: ['bootloader mode', 'serial bootloader'], def: 'The state in which the chip\'s ROM waits for a new program over serial or USB. Entered by holding the boot pin low while the chip leaves reset.' },
    { term: 'Baud rate', also: ['baud', 'bit/s'], def: 'The speed of a serial link in bits per second. The monitor usually runs at 115200; upload tools switch to a faster rate, limited by the bridge chip.' }
  ],
  choose: {
    good: ['A board with a bridge chip when you often crash the program or switch it off and on: the port stays', 'A board with the chip\'s own USB when you want a debugger over the same cable, or a USB keyboard or drive', 'Both paths together (the S3, C6, C5, C61 and H2 DevKits) when you want to try either'],
    avoid: ['A cheap clone without the auto-reset parts, unless you are happy pressing both buttons each upload', 'A native-USB board in a project that uses GPIO19 and GPIO20 (S3) or GPIO18 and GPIO19 (C3) as normal pins', 'Charge-only cables'],
    check: ['Which port is which, in the device manager or the Arduino port list', 'The bridge speed limit if you flash large images (1 Mbit/s against 3 Mbit/s)', 'That the monitor is open on the port that carries the program\'s output']
  },
  code: [
    {
      title: 'Short press and long press on the BOOT button',
      about: 'After start-up the BOOT button is an ordinary button on a pin with a pull-up. This program times each press and tells a short one from a long one. (Holding it *during reset* is what asks for download mode — a different moment.)',
      needs: 'A DevKit with a BOOT button. The pin is GPIO0 on the ESP32, S2 and S3; GPIO9 on the C3, C6, C61 and H2; GPIO28 on the C5; GPIO35 on the P4.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board; change the pin number for your chip']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (0) as [input with pull-up v]
          set [down v] to <false>
          set [since v] to (0)
        forever
          if <<(read pin (0)) = [LOW v]> and <not <down>>> then
            set [down v] to <true>
            set [since v] to (milliseconds since start)
          end
          if <<(read pin (0)) = [HIGH v]> and <down>> then
            set [down v] to <false>
            set [held v] to ((milliseconds since start) - (since))
            print (join [released after ms: ] (held))
            if <(held) ≥ (1000)> then
              print [long press]
            else
              print [short press]
            end
          end
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int PIN_BOOT = 0;            // (BOOT_PIN is a name the core uses itself.) 9 on C3, C6, C61, H2; 28 on C5; 35 on P4
        const uint32_t LONG_MS = 1000;

        bool wasDown = false;
        uint32_t downSince = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_BOOT, INPUT_PULLUP);
        }

        void loop() {
          bool down = digitalRead(PIN_BOOT) == LOW;     // the button pulls the pin to ground
          if (down && !wasDown) downSince = millis();
          if (!down && wasDown) {
            uint32_t held = millis() - downSince;
            Serial.printf("released after %lu ms: %s press\n", (unsigned long)held, held >= LONG_MS ? "long" : "short");
          }
          wasDown = down;
          delay(10);                                    // also rides over contact bounce
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        PIN_BOOT = 0                       # 9 on C3, C6, C61, H2; 28 on C5; 35 on P4
        LONG_MS = 1000

        button = Pin(PIN_BOOT, Pin.IN, Pin.PULL_UP)
        was_down = False
        down_since = 0

        while True:
            down = button.value() == 0                  # the button pulls the pin to ground
            if down and not was_down:
                down_since = time.ticks_ms()
            if not down and was_down:
                held = time.ticks_diff(time.ticks_ms(), down_since)
                print("released after", held, "ms:", "long" if held >= LONG_MS else "short", "press")
            was_down = down
            time.sleep_ms(10)                           # also rides over contact bounce
      `,
      output: `
        released after 142 ms: short press
        released after 1310 ms: long press
      `,
      notes: ['Do not hold the button while you power or reset the board, or it waits for an upload instead of running this.', 'The same pattern gives a "hold three seconds to erase the Wi-Fi settings" feature — a common use of the BOOT button in products ([[long-press-double-click]]).']
    }
  ],
  quiz: [
    { q: 'A terminal program opens the serial port of a DevKit, which sets DTR and RTS at the same moment. Why does the chip not reset?', choices: ['The transistors conduct only when the two lines differ, and here they are equal', 'Terminals never touch DTR or RTS', 'EN ignores the bridge', 'The chip is already in download mode'], a: 0, why: 'Each transistor has one line on its base and the other on its emitter. With both lines at the same level neither conducts, so EN and the boot pin stay where they were.' },
    { q: 'You need the board to remain connected to the serial monitor while the program crashes and restarts repeatedly. Which path suits better?', choices: ['A bridge chip', 'The chip\'s own USB', 'Neither can do it', 'Wi-Fi only'], a: 0, why: 'A bridge chip is a separate part that keeps its USB connection when the ESP32 resets. With the chip\'s own USB the port disappears and returns at every restart.' },
    { q: 'The classic ESP32 can be connected straight to a USB connector, like the ESP32-C3.', a: false, why: 'The classic ESP32 has no USB hardware at all. Every classic-ESP32 board needs a bridge chip (or an external adapter) for programming.' },
    { q: 'Which pin do you hold low during reset to enter download mode on an ESP32-C6?', choices: ['GPIO0', 'GPIO9', 'GPIO28', 'GPIO35'], a: 1, why: 'GPIO9 is the boot pin of the C3, C6, C61 and H2. GPIO0 serves the ESP32 and S3, GPIO28 the C5 and GPIO35 the P4.' }
  ],
  applications: [
    'Every upload from the Arduino IDE, PlatformIO or esptool uses the auto-reset circuit without the user noticing.',
    'Production fixtures hold the boot pin low with a probe and reset the chip over a cable.',
    'Fault-finding "failed to connect": knowing the circuit tells you which line to look at with a multimeter.',
    'The BOOT button doubles as a user button in many finished products once the firmware is running.'
  ],
  sources: [
    'Espressif, *esptool documentation*: "Boot Mode Selection" and the serial-connection page (the reset sequences).',
    'Espressif, *ESP32 Hardware Design Guidelines*: the auto-download circuit of the minimal system.',
    'Espressif, *ESP-IDF Programming Guide*: the USB Serial/JTAG Controller console.'
  ],
  sim: 'dk-autoreset'
},

/* ================================================================ 3. ESP32-DevKitC */
{
  id: 'esp32-devkitc',
  parent: 'espressif-devkits',
  title: 'ESP32-DevKitC and its many clones',
  level: 1,
  short: 'The reference board of the original ESP32: a module, a bridge chip and 38 header holes, of which only a dozen are free of strings. The pattern that a hundred clones copy — not always faithfully.',
  keywords: ['ESP32-DevKitC', 'DevKitC V4', 'ESP32 DevKit', 'WROOM-32E', 'WROVER-E', 'ESP32-DevKitM-1', 'J2', 'J3', 'D0 D1 D2 D3 CMD CLK', 'flash pins', 'input-only', 'ESP32 DevKit V1', 'NodeMCU-32S', 'clone', '38 pin'],
  prereq: ['anatomy-of-a-dev-board', 'soc-esp32', 'reading-a-pinout'],
  related: ['strapping-pins', 'input-only-and-special-pins', 'adc1-adc2-and-wifi', 'safe-pins-esp32', 'nodemcu-and-doit-boards', 'esp32-s3-devkitc', 'planning-pins'],
  body: `When a tutorial says "an ESP32 board" it usually means this one or something shaped like it. The **ESP32-DevKitC V4** is Espressif's own board for the original ESP32: a module on a 27.9 × 54.4 mm board, a Micro-USB connector, a USB bridge chip (up to 3 Mbit/s), the EN and BOOT buttons, a power LED on the 5 V rail and two rows of 19 header holes. There is **no user LED** and no RGB LED: the first blink needs an LED you wire yourself.

### Which module is on it

The board is sold with a choice of modules: ESP32-WROOM-32E and -32UE, ESP32-WROVER-E and -IE, and the older -32D and -32U. A "U" or "IE" module has a connector for an external antenna; the others a printed antenna. The WROVER modules add PSRAM (the board catalogue lists 8 MB on the WROVER-E; the chip can map only 4 MB of it at a time). Flash is 4 MB in the base listing.

### Thirty-two pins, one dozen safe

The headers carry 32 GPIO numbers, and the catalogue shows what is wrong with most of them:

| Pins on the header | Why they are not simply "free" |
|---|---|
| D0, D1, D2, D3, CMD, CLK (GPIO7, 8, 9, 10, 11, 6) | Wired inside the module to the SPI flash. Never use them. |
| GPIO0, 2, 5, 12, 15 | [[strapping-pins|Strapping pins]]: their level at reset decides how the chip starts. GPIO12 must be low at reset. |
| GPIO1, 3 (TX, RX) | The bridge chip's serial port: the console and the uploads. |
| GPIO16, 17 | Free on WROOM modules, but taken by PSRAM on WROVER modules. |
| GPIO34, 35, 36 (VP), 39 (VN) | Input only, with no internal pull-up or pull-down. |
| GPIO13, 14 | Usable, but JTAG pins; GPIO14 has been reported to pulse at boot. |

What is left, marked safe in the catalogue, is **GPIO4, 18, 19, 21, 22, 23, 25, 26, 27, 32 and 33** — eleven pins. Twenty-five and 26 are the two 8-bit DACs. For analogue inputs while Wi-Fi is on, use the ADC1 pins GPIO32–39: the ADC2 pins cannot be read while the radio runs ([[adc1-adc2-and-wifi]]). The header rows are called **J2** and **J3** in Espressif's guide; there is no J1.

### The clones, and the narrower sibling

Dozens of boards copy the idea: some with 30 pins, some with 36 or 38, a different bridge chip (often the CH340), a user LED on GPIO2 and — the trap — **a different order of pins**. Compare the silkscreen with the pinout, not the board name ([[nodemcu-and-doit-boards]]). Espressif's own narrower variant is the **ESP32-DevKitM-1** (a MINI-1 module, 25.4 × 44.35 mm); the catalogue warns that DevKitM-1 boards made before 2021-12-02 carry a single-core module.

The [pinout explorer](#/tools/pinout?board=esp32-devkitc-v4) draws the V4 with every pin coloured by what the chip's datasheet says about it.

> [!key] The DevKitC V4 is the ESP32 reference board: 32 GPIO numbers on the headers, of which six go to the flash, five are strapping pins, two carry the console and four are input only. Eleven pins are free of strings; plan your wiring around those.`,
  ideas: [
    'The DevKitC V4 is Espressif\'s reference board for the original ESP32, with a bridge chip, two buttons and 38 header holes.',
    'Six header pins (D0–D3, CMD, CLK) are the flash memory\'s and must stay unconnected.',
    'The catalogue lists only eleven pins as free of restrictions; the others are strapping, serial, PSRAM, input-only or JTAG pins.',
    'Clones often reorder the pins, so trust the silkscreen of the board in your hand.'
  ],
  pitfalls: [
    'All 38 holes are GPIOs — Many are power, ground, EN or the flash pins. The header has 32 GPIO numbers, and six of them are the flash.',
    'GPIO34 to GPIO39 can drive an LED — They are input only. There is no output driver and no pull resistor on those pins.',
    'GPIO16 and GPIO17 are always available — Only on WROOM modules. A WROVER module uses them for its PSRAM.'
  ],
  terms: [
    { term: 'DevKitC', also: ['ESP32-DevKitC V4', 'DevKit-C'], def: 'Espressif\'s reference development board family: a module, a USB path, buttons and two rows of header pins. The C marks the wider board; the M boards are narrower.' },
    { term: 'D0–D3, CMD, CLK', also: ['flash pins', 'SD_DATA', 'SD_CMD'], def: 'Six header pins of the ESP32 DevKitC (GPIO7, 8, 9, 10, 11 and 6) that connect to the SPI flash inside the module. A program must not use them.' },
    { term: 'Input-only pin', also: ['GPIO34–39'], def: 'A pin that can be read but cannot drive an output, and has no internal pull-up or pull-down. The original ESP32 has four on this board: GPIO34, 35, 36 and 39.' },
    { term: 'WROOM and WROVER', also: ['ESP32-WROOM-32E', 'ESP32-WROVER-E'], def: 'Two module families of the original ESP32. WROVER modules add PSRAM, which takes GPIO16 and GPIO17.' }
  ],
  choose: {
    good: ['Learning the ESP32 with every official example behaving as documented', 'Projects that need the classic ESP32\'s second core, Bluetooth Classic or DAC', 'A prototype that will later move to a bare WROOM-32E module on your own board'],
    avoid: ['New designs that do not need Bluetooth Classic: the C3, C6 or S3 DevKits are newer and have native USB', 'Tight breadboards: at 27.9 mm it is wider than the 25.4 mm of the newer DevKits', 'Clones when you depend on the exact pinout of this page'],
    check: ['That your board is a V4 and not a clone with another pin order', 'Whether the module is WROOM or WROVER before using GPIO16 and GPIO17', 'The antenna type: a "U" module needs an antenna plugged in']
  },
  code: [
    {
      title: 'A button that toggles an LED, on pins that are safe',
      about: 'Each press of the button switches the LED over. Both pins are among the eleven the catalogue marks safe, so nothing here disturbs the boot.',
      needs: 'An ESP32-DevKitC V4, an LED, a 220 Ω resistor and a push button.',
      wiring: [['GPIO4', '220 Ω → LED → GND', 'the board has no LED of its own'], ['GPIO27', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (4) as [output v]
          set pin (27) as [input with pull-up v]
          set [on v] to <false>
          set [down v] to <false>
        forever
          if <<(read pin (27)) = [LOW v]> and <not <down>>> then
            set [on v] to <not <on>>
            set pin (4) to (on)
            wait (0.03) seconds
          end
          set [down v] to <(read pin (27)) = [LOW v]>
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 4;         // GPIO4 -> 220 ohm -> LED -> GND
        const int BUTTON_PIN = 27;     // button between GPIO27 and GND

        bool ledOn = false;
        bool wasDown = false;

        void setup() {
          pinMode(LED_PIN, OUTPUT);
          pinMode(BUTTON_PIN, INPUT_PULLUP);
        }

        void loop() {
          bool down = digitalRead(BUTTON_PIN) == LOW;
          if (down && !wasDown) {        // the moment of pressing
            ledOn = !ledOn;
            digitalWrite(LED_PIN, ledOn);
            delay(30);                   // let the contact settle
          }
          wasDown = down;
          delay(10);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(4, Pin.OUT)            # GPIO4 -> 220 ohm -> LED -> GND
        button = Pin(27, Pin.IN, Pin.PULL_UP)   # button between GPIO27 and GND
        was_down = False

        while True:
            down = button.value() == 0
            if down and not was_down:    # the moment of pressing
                led.toggle()
                time.sleep_ms(30)        # let the contact settle
            was_down = down
            time.sleep_ms(10)
      `,
      notes: ['GPIO27 could be any of the safe pins; avoid GPIO12 and GPIO15 for a button that idles low or high, because both are strapping pins.', 'The LED needs a series resistor; see [[leds]] for the value.']
    }
  ],
  examples: [
    {
      title: 'How many pins are really free?',
      q: 'The ESP32-DevKitC V4 headers carry 32 GPIO numbers. Starting from 32, take away the pins that cannot be used freely and say how many outputs remain.',
      steps: ['Six pins go to the flash (GPIO6–11): $32 - 6 = 26$.', 'GPIO1 and GPIO3 carry the console: $26 - 2 = 24$.', 'Five strapping pins (GPIO0, 2, 5, 12, 15): $24 - 5 = 19$.', 'GPIO16 and GPIO17 belong to the PSRAM on WROVER modules: $19 - 2 = 17$.', 'Four of the remaining 17 are input only (GPIO34, 35, 36, 39), so 13 can be outputs.', 'GPIO13 and GPIO14 carry JTAG and a boot-time glitch, which leaves 11 the catalogue calls safe.'],
      a: '17 pins remain after the obvious subtractions, 13 of them can be outputs and 11 are free of every caveat.'
    }
  ],
  quiz: [
    { q: 'You wire a relay board to GPIO12 of a DevKitC and the board stops booting. Which explanation fits?', choices: ['GPIO12 is a flash pin', 'GPIO12 is a strapping pin that must be low at reset, and the relay board holds it high', 'GPIO12 is input only', 'The relay draws too much current'], a: 1, why: 'GPIO12 chooses the flash voltage. High at reset selects 1.8 V, which a 3.3 V flash cannot be read at. Move the relay to a safe pin.' },
    { q: 'Which header labels are the flash pins on the DevKitC V4?', choices: ['TX and RX', 'D0, D1, D2, D3, CMD and CLK', 'VP and VN', 'EN and 3V3'], a: 1, why: 'D0–D3, CMD and CLK are GPIO7, 8, 9, 10, 11 and 6 and connect to the module\'s flash. Using them breaks the program, usually with a crash.' },
    { q: 'You want to read a sensor on an analogue pin while Wi-Fi is active. Which pins suit best on this board?', choices: ['GPIO25–27 (ADC2)', 'GPIO32–39 (ADC1)', 'GPIO0–2', 'GPIO6–11'], a: 1, why: 'On the original ESP32 the ADC2 pins cannot be read while the radio is on. ADC1 (GPIO32–39) works at all times.' },
    { q: 'GPIO16 and GPIO17 can be used on every DevKitC V4.', a: false, why: 'They are free on boards with a WROOM module only. A WROVER module uses them for its PSRAM.' }
  ],
  applications: [
    'The default hardware for tutorials, libraries and bug reports about the original ESP32.',
    'Prototypes of Wi-Fi sensors, relays and web servers before a custom board exists.',
    'Bluetooth Classic projects (serial links, audio), which only the original ESP32 supports.',
    'Teaching labs, where one board per student must survive being miswired.'
  ],
  sources: [
    'Espressif, *ESP32-DevKitC V4 Getting Started Guide*: pin tables for headers J2 and J3, module options.',
    'Espressif, *ESP32 Series Datasheet*: strapping pins and the pin table.',
    'Espressif, *ESP-IDF Programming Guide*, GPIO and ADC references for the ESP32: input-only pins and the ADC2 restriction.'
  ],
  sim: { id: 'dk-board-pair', params: { a: 'esp32-devkitc-v4', b: 'esp32-devkitm-1' } }
},

/* ================================================================ 4. ESP32-S3-DevKitC-1 */
{
  id: 'esp32-s3-devkitc',
  parent: 'espressif-devkits',
  title: 'ESP32-S3-DevKitC-1',
  level: 1,
  short: 'The S3 board with two USB connectors, 45 GPIOs, an RGB LED that moved between board versions, and modules whose octal PSRAM quietly takes three pins away.',
  keywords: ['ESP32-S3-DevKitC-1', 'S3 DevKit', 'N8R8', 'N16R8', 'N32R16V', 'WROOM-1', 'WROOM-2', 'RGB LED GPIO48', 'GPIO38', 'v1.0', 'v1.1', 'USB CDC On Boot', 'UART port', 'USB port', 'octal PSRAM', 'GPIO35 36 37'],
  prereq: ['anatomy-of-a-dev-board', 'usb-serial-bridges-and-auto-reset', 'soc-esp32-s3'],
  related: ['soc-esp32-s3', 'psram-on-modules', 'strapping-pins', 'usb-on-the-esp', 'the-serial-monitor', 'addressable-leds', 'safe-pins-s3-c3-c6'],
  body: `The **ESP32-S3-DevKitC-1** is the board to start with when a project needs two cores, lots of pins, USB or a camera or display — everything the [[soc-esp32-s3|S3]] is good at. It has 22 holes on each side and 36 GPIO numbers on them. Three things about it surprise people: the two USB connectors, the RGB LED that changed pins, and the modules whose PSRAM eats pins.

### Two connectors, two paths

One connector goes to a **bridge chip** (up to 3 Mbit/s) and from there to UART0 (GPIO43 and GPIO44). The other goes straight to the S3's own **USB** on GPIO19 and GPIO20. They show up as two different serial ports, and which one your program talks to depends on one menu setting:

| Connector | What the computer sees | What the program must do |
|---|---|---|
| UART (bridge) | a serial port, kept while the chip resets | nothing: the default \`Serial\` goes to UART0 |
| USB (native) | the chip's USB Serial/JTAG, which disappears at each reset | enable "USB CDC On Boot" in the Arduino IDE, so \`Serial\` uses it |

If the monitor stays silent, the commonest cause is that the cable is in one connector while \`Serial\` lives on the other. GPIO19 and GPIO20 are on the header, but using them as normal pins disables USB.

### One LED, two versions

The board carries an addressable RGB LED. On **version 1.0** it is on GPIO48; **version 1.1** moved it to GPIO38 (on v1.1 the header pin is marked "38 … RGB LED"). Both versions are on sale. Look at the silkscreen, or put the pin in a constant and change it in one place — as the program below does. The Arduino core's generic S3 board names GPIO48, so \`LED_BUILTIN\` on a v1.1 board lights nothing.

### The module decides the memory — and the pins

Modules are ESP32-S3-WROOM-1, -1U (connector antenna) and WROOM-2, in many memory sizes: flash up to 32 MB, PSRAM up to 16 MB. The ordering code tells which: **N8R8** is 8 MB flash and 8 MB octal PSRAM at 3.3 V; **N32R16V** (WROOM-2) is 32 MB and 16 MB at **1.8 V**. The catalogue lists the two consequences:

- With octal flash or PSRAM, **GPIO35, 36 and 37** are used inside the module. They stay on the header but are not available to you (they are free on N4 and N8 modules without octal PSRAM).
- On the 1.8 V parts, GPIO47 and GPIO48 run at 1.8 V, not 3.3 V.

The strapping pins are GPIO0 (the BOOT button), GPIO3, GPIO45 and GPIO46; GPIO45 high at reset selects 1.8 V for the flash supply. All 45 S3 GPIOs are bidirectional — there are no input-only pins. With Wi-Fi on, read analogue signals on GPIO1–10 (ADC1).

> [!key] The S3-DevKitC-1 has a bridge on one USB connector and the chip's own USB on the other; the RGB LED is on GPIO48 or GPIO38 depending on the version; and an octal-PSRAM module takes GPIO35–37 off your list. Check the version, the module and the connector before blaming the code.`,
  ideas: [
    'Two USB connectors: one through a bridge chip to UART0, one to the S3\'s own USB; the program\'s Serial lives on only one of them.',
    'The RGB LED is on GPIO48 on version 1.0 and GPIO38 on version 1.1.',
    'Octal flash or PSRAM modules use GPIO35, 36 and 37 internally.',
    'The ordering code (N8R8, N16R8, N32R16V) tells you the flash, the PSRAM and the voltage.'
  ],
  pitfalls: [
    'USB is USB, so either port will show my program\'s output — With "USB CDC On Boot" off the output goes to UART0, which only the bridge connector reaches. With it on, only the native connector shows it.',
    'GPIO35 to GPIO37 are free because they are on the header — On octal-PSRAM modules (N8R8, N16R8, N32R16V) they are wired inside the module and unusable.',
    'The RGB LED is on GPIO48 on this board — On version 1.1 it is on GPIO38. Check the board version before trusting a tutorial.'
  ],
  terms: [
    { term: 'N8R8', also: ['N16R8', 'N32R16V', 'N4', 'module ordering code'], def: 'The memory code of an ESP32-S3 module: N is the flash size in megabytes, R the PSRAM size. A V at the end means a 1.8 V part (for example N32R16V).' },
    { term: 'Octal PSRAM', also: ['OPI PSRAM', 'octal SPI', 'OT'], def: 'External RAM connected to the chip over eight data lines instead of four. It is faster than quad PSRAM and, on the S3, it occupies GPIO35, 36 and 37.' },
    { term: 'USB CDC On Boot', also: ['USB Mode', 'HWCDC'], def: 'An Arduino IDE board option that makes Serial use the chip\'s own USB serial port instead of UART0.' },
    { term: 'Board revision', also: ['v1.0', 'v1.1', 'PW number'], def: 'A version of the same board with small changes, often marked on the silkscreen. Pin assignments of on-board parts, such as an LED, may differ between revisions.' }
  ],
  choose: {
    good: ['Projects needing two cores, USB device or host, cameras, displays or machine learning on the chip', 'A first S3 board, with the whole pinout on headers and both USB paths on board', 'Prototypes that will move to a WROOM-1 module on a custom board'],
    avoid: ['Battery projects that must sleep for months (the bridge and LEDs draw current)', 'Projects that need Bluetooth Classic, Zigbee or Thread: the S3 has none of them', 'Using GPIO35–37 with an octal-PSRAM module'],
    check: ['The board version (v1.0 or v1.1) and so the RGB pin', 'The module ordering code and so the PSRAM type and the free pins', 'Which connector your Serial output goes to']
  },
  code: [
    {
      title: 'Cycle the RGB LED through red, green and blue',
      about: 'The on-board LED is an addressable RGB pixel, not a plain LED: it needs a data frame, not just high and low. The pin is in one constant, because it differs between board versions.',
      needs: 'An ESP32-S3-DevKitC-1. Set RGB_PIN to 38 for version 1.1 or to 48 for version 1.0.',
      wiring: [['GPIO38', 'the on-board RGB LED', 'GPIO48 on version 1.0']],
      blocks: `
        when started
          start pixels on pin (38) with (1) pixel
        forever
          set pixel (0) to colour (32) (0) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (32) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (32)
          show pixels
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int RGB_PIN = 38;          // 48 on board version 1.0
        const uint8_t LEVEL = 32;        // brightness 0..255: the LED is bright

        void setup() {
        }

        void loop() {
          rgbLedWrite(RGB_PIN, LEVEL, 0, 0);     // red
          delay(500);
          rgbLedWrite(RGB_PIN, 0, LEVEL, 0);     // green
          delay(500);
          rgbLedWrite(RGB_PIN, 0, 0, LEVEL);     // blue
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        RGB_PIN = 38                     # 48 on board version 1.0
        LEVEL = 32                       # brightness 0..255: the LED is bright

        pixel = NeoPixel(Pin(RGB_PIN), 1)

        while True:
            for colour in ((LEVEL, 0, 0), (0, LEVEL, 0), (0, 0, LEVEL)):    # red, green, blue
                pixel[0] = colour
                pixel.write()
                time.sleep_ms(500)
      `,
      notes: ['`rgbLedWrite` is the name in Arduino core 3.x; on cores before 3.0.5 it was `neopixelWrite`.', 'After the first call the pin belongs to the LED driver and cannot be used as a normal GPIO.', 'The LED is very bright at full level; 32 of 255 is plenty on a desk.']
    }
  ],
  quiz: [
    { q: 'A sketch built with the core\'s generic S3 board uses LED_BUILTIN on a board marked v1.1, and nothing lights. Why?', choices: ['The LED is broken', 'LED_BUILTIN names GPIO48, while v1.1 has the LED on GPIO38', 'The S3 has no RGB LED', 'RGB LEDs need a 5 V supply'], a: 1, why: 'Version 1.1 moved the RGB LED from GPIO48 to GPIO38. The core\'s generic S3 definition still names GPIO48.' },
    { q: 'You use an ESP32-S3-WROOM-1-N16R8 module and connect a sensor to GPIO36. It never works. What is the reason?', choices: ['GPIO36 is input only', 'The module\'s octal PSRAM uses GPIO35, 36 and 37 internally', 'GPIO36 is a strapping pin', 'Sensors need GPIO1–10'], a: 1, why: 'N8R8, N16R8 and N32R16V modules wire the octal PSRAM to GPIO35–37. The pins are on the header but not available to you.' },
    { q: 'The serial monitor shows nothing while the board is plugged into the connector that goes to the bridge, and the sketch was built with "USB CDC On Boot" enabled. What is wrong?', choices: ['The baud rate', 'Serial now uses the native USB, which the other connector reaches', 'The cable is charge-only', 'The program never started'], a: 1, why: 'With CDC on boot enabled, Serial is the chip\'s own USB port. The bridge connector carries UART0 and sees nothing, unless the program writes to Serial0.' },
    { q: 'The ESP32-S3 has some input-only pins, as the original ESP32 does.', a: false, why: 'All 45 GPIOs of the S3 are bidirectional. Some pins are lost to flash, PSRAM, USB or strapping, but none is input only.' }
  ],
  applications: [
    'Camera and display projects that need PSRAM and plenty of pins.',
    'USB devices: keyboards, MIDI and storage, through the native USB connector.',
    'Voice and machine-learning prototypes using the S3\'s vector instructions.',
    'The S3 firmware development of products that will later use a WROOM-1 module on their own board.'
  ],
  sources: [
    'Espressif, *ESP32-S3-DevKitC-1 User Guide*, versions 1.0 and 1.1: header tables, the RGB LED pin, ordering codes.',
    'Espressif, *ESP32-S3-WROOM-1 and ESP32-S3-WROOM-2 Datasheets*: module variants and the pins used by octal flash and PSRAM.',
    'Arduino core for ESP32 documentation: the Tools menu options "USB CDC On Boot" and "USB Mode".'
  ],
  sim: { id: 'dk-board-pair', params: { a: 'esp32-s3-devkitc-1-v1.0', b: 'esp32-s3-devkitc-1-v1.1' } }
},

/* ================================================================ 5. the C-series DevKits */
{
  id: 'c-series-devkits',
  parent: 'espressif-devkits',
  title: 'The C3, C6, C5 and C61 DevKits',
  level: 1,
  short: 'Four boards in one layout: the same two header rows and an RGB LED on a strapping pin, around four different chips — Wi-Fi 4, Wi-Fi 6, dual-band Wi-Fi 6 with Zigbee and Thread, and Wi-Fi 6 with PSRAM.',
  keywords: ['ESP32-C3-DevKitM-1', 'ESP32-C6-DevKitC-1', 'ESP32-C5-DevKitC-1', 'ESP32-C61-DevKitC-1', 'C-series', 'RGB LED GPIO8', 'GPIO27', 'J5 jumper', 'two USB-C', 'Wi-Fi 6', 'dual band', '5 GHz', 'PW number', 'board revision', 'ESP32-C3-DevKitC-02'],
  prereq: ['anatomy-of-a-dev-board', 'soc-esp32-c3', 'soc-esp32-c6'],
  related: ['soc-esp32-c5', 'soc-esp32-c61', 'esp32-h2-devkit', 'strapping-pins', 'addressable-leds', 'measuring-current', 'choosing-a-chip'],
  body: `The C series are Espressif's single-core RISC-V chips, and their DevKits form one family: two header rows of 15 or 16 holes, a BOOT and an EN button, a bridge chip and an addressable RGB LED. Pick the chip, and the board follows. The catalogue gives these:

| Board | Chip | Module | Flash / PSRAM | USB | RGB LED | Size (mm) |
|---|---|---|---|---|---|---|
| ESP32-C3-DevKitM-1 | C3 | MINI-1 / -1U | 4 MB / none | Micro-USB, bridge | GPIO8 | 25.4 × 44.31 |
| ESP32-C6-DevKitC-1 | C6 | WROOM-1 / -1U | 8 MB / none | two USB-C | GPIO8 | 25.5 × 51.8 |
| ESP32-C5-DevKitC-1 | C5 | WROOM-1 / -1U | 8 MB / 8 MB | two USB-C | GPIO27 | 25.4 × 51.8 |
| ESP32-C61-DevKitC-1 | C61 | WROOM-1 | 8 MB / 2 MB | two USB-C | GPIO8 | 25.4 × 51.8 |

The **C3-DevKitC-02** (a WROOM-02 module) is superseded, and the C6 also comes in a smaller **DevKitM-1** with 4 MB of flash.

### What the chip decides

- **C3:** Wi-Fi 4 and Bluetooth LE 5.0 at 160 MHz. The cheapest and the simplest; no 802.15.4. It has a bridge chip on its only connector, and the chip's own USB pins (GPIO18 and 19) are on the header.
- **C6:** Wi-Fi 6 (2.4 GHz), Bluetooth LE 5.3 and an 802.15.4 radio, so Zigbee, Thread and Matter over Thread. Usually the right choice for smart-home work.
- **C5:** adds the **5 GHz** band — the first chip of the family to have it — plus 802.15.4, at 240 MHz and with PSRAM support.
- **C61:** Wi-Fi 6 on 2.4 GHz only, without 802.15.4, with PSRAM support at a low cost.

The three newer boards have **two USB-C connectors**, one through the bridge and one to the chip's own USB, and a **J5 jumper** in the supply line: remove it and put a current meter in its place to measure the module alone.

### The LED sits on a strapping pin

On the C3, C6 and C61 the LED's data pin is GPIO8 — and GPIO8 is a [[strapping-pins|strapping pin]] on all three. On the C5 it is GPIO27, also a strapping pin. It works because an addressable LED's input is a high-impedance input: it does not pull the pin either way. The same lesson applies to your own wiring. The boot pin is GPIO9 on the C3, C6 and C61, and **GPIO28 on the C5**.

### Revisions matter

Espressif revised these boards after launch, and the guides say so: the C6-DevKitC-1 has a v1.2 with a curved J5 header and changed resistors in the LED circuit; the C5 board from PW-2025-04-0446 (v1.2) has different functions on its J1 and J3 headers; the C61 board from PW-2025-05-0781 (v2.0) uses header pins that were unconnected on v1.0. Check the date code printed on the board against the guide before you trust a pinout.

### Software

Arduino and ESP-IDF cover all four. MicroPython has official builds for the C3, C6 and C5, but at the time of writing (October 2026) none for the C61.

> [!key] The C-series DevKits share one layout around four chips: C3 for cheap Wi-Fi 4, C6 for Wi-Fi 6 with Zigbee and Thread, C5 for 5 GHz, C61 for low-cost Wi-Fi 6. The RGB LED is on GPIO8 (GPIO27 on the C5) and the newer boards carry a J5 jumper for measuring current.`,
  ideas: [
    'The four DevKits share a layout; the chip decides the radios: C3 Wi-Fi 4, C6 Wi-Fi 6 and 802.15.4, C5 adds 5 GHz, C61 is Wi-Fi 6 without 802.15.4.',
    'The RGB LED is on GPIO8 (GPIO27 on the C5), and those are strapping pins; an LED input does not disturb them.',
    'The C6, C5 and C61 boards have two USB-C connectors and a J5 jumper that lets you measure the module\'s current.',
    'Board revisions changed pin functions on the C5 and C61 DevKits, so check the date code against the guide.'
  ],
  pitfalls: [
    'The C-series chips are the same except for Wi-Fi — They differ in radios, memory, clock and pins: the C6 and C5 have an 802.15.4 radio, only the C5 does 5 GHz, and the C3 has neither Wi-Fi 6 nor 802.15.4.',
    'The BOOT button is on GPIO9 on every C board — It is GPIO9 on the C3, C6 and C61, but GPIO28 on the C5.',
    'Any pinout of "the C6 DevKit" is correct for my board — The guides list several revisions, and header functions changed on the C5 and C61 boards.'
  ],
  terms: [
    { term: 'Wi-Fi 6', also: ['802.11ax'], def: 'The generation of Wi-Fi after Wi-Fi 5. On the ESP32 family it brings target wake time, which lets a battery device sleep between scheduled contacts with the router.' },
    { term: 'Dual-band', also: ['2.4 GHz and 5 GHz', '5 GHz Wi-Fi'], def: 'A radio that can use both the 2.4 GHz and the 5 GHz Wi-Fi bands. The ESP32-C5 is the first ESP32 chip to do so.' },
    { term: 'J5 jumper', also: ['current measurement jumper', 'power jumper'], def: 'A two-pin link in the 3.3 V line to the module on the newer DevKits. Removing it and putting an ammeter across the pins measures the module alone.' },
    { term: 'PW number', also: ['date code', 'board revision code'], def: 'A code printed on Espressif boards that identifies the production batch and so the board revision. The user guides give the numbers at which pin functions or parts changed.' }
  ],
  choose: {
    good: ['C3: a cheap, small board for Wi-Fi and Bluetooth LE projects', 'C6: Zigbee, Thread and Matter, or Wi-Fi 6 with low power', 'C5: crowded 2.4 GHz networks, or a device that must use 5 GHz', 'C61: Wi-Fi 6 with external RAM at the lowest cost'],
    avoid: ['Any C board for Bluetooth Classic or a second core: choose the ESP32 or S3', 'The C3 for Zigbee or Thread: it has no 802.15.4 radio', 'The C61 with MicroPython: there is no official build as of October 2026'],
    check: ['The board\'s date code against the guide, for header functions', 'Which connector is the bridge and which the chip\'s own USB', 'That the LED pin in your sketch is the one on your chip']
  },
  code: [
    {
      title: 'A colour wheel on the on-board RGB LED',
      about: 'Walks the single addressable LED slowly round the colour wheel. The LED pin is one constant: 8 on the C3, C6 and C61, 27 on the C5.',
      needs: 'A C3, C6, C5 or C61 DevKit.',
      wiring: [['GPIO8', 'the on-board RGB LED', 'GPIO27 on the ESP32-C5']],
      blocks: `
        when started
          start pixels on pin (8) with (1) pixel
          set [position v] to (0)
        forever
          set pixel (0) to colour from wheel position (position) at brightness (32) :: light
          show pixels
          change [position v] by (1)
          if <(position) > (255)> then
            set [position v] to (0)
          end
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int RGB_PIN = 8;               // 27 on the ESP32-C5
        const uint8_t LEVEL = 32;            // brightness 0..255

        // 0..255 round the colour wheel: red -> green -> blue -> red
        void wheel(uint8_t pos, uint8_t &r, uint8_t &g, uint8_t &b) {
          if (pos < 85) { r = 255 - pos * 3; g = pos * 3; b = 0; }
          else if (pos < 170) { pos -= 85; r = 0; g = 255 - pos * 3; b = pos * 3; }
          else { pos -= 170; r = pos * 3; g = 0; b = 255 - pos * 3; }
        }

        uint8_t position = 0;

        void setup() {
        }

        void loop() {
          uint8_t r, g, b;
          wheel(position, r, g, b);
          rgbLedWrite(RGB_PIN, r * LEVEL / 255, g * LEVEL / 255, b * LEVEL / 255);
          position++;                        // wraps from 255 to 0 by itself
          delay(20);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        RGB_PIN = 8                          # 27 on the ESP32-C5
        LEVEL = 32                           # brightness 0..255

        pixel = NeoPixel(Pin(RGB_PIN), 1)

        def wheel(pos):                      # 0..255 round the colour wheel: red -> green -> blue -> red
            if pos < 85:
                return (255 - pos * 3, pos * 3, 0)
            if pos < 170:
                pos -= 85
                return (0, 255 - pos * 3, pos * 3)
            pos -= 170
            return (pos * 3, 0, 255 - pos * 3)

        position = 0

        while True:
            r, g, b = wheel(position)
            pixel[0] = (r * LEVEL // 255, g * LEVEL // 255, b * LEVEL // 255)
            pixel.write()
            position = (position + 1) % 256  # wraps from 255 to 0
            time.sleep_ms(20)
      `,
      notes: ['The block version names the wheel in words, because a block cannot show the arithmetic of the three colour ramps.', 'On the C5 and C61, check the Arduino board option for your chip: the C61 is newer than most tutorials.']
    }
  ],
  quiz: [
    { q: 'You need a device that works on a congested 2.4 GHz network by using 5 GHz. Which C-series chip?', choices: ['ESP32-C3', 'ESP32-C6', 'ESP32-C5', 'ESP32-C61'], a: 2, why: 'The C5 is the first ESP32 chip with dual-band Wi-Fi 6 (2.4 and 5 GHz). The C3, C6 and C61 use 2.4 GHz only.' },
    { q: 'Which statement about the BOOT pin is correct?', choices: ['GPIO9 on every C-series chip', 'GPIO0 on every C-series chip', 'GPIO9 on the C3, C6 and C61, GPIO28 on the C5', 'GPIO8 on the C5'], a: 2, why: 'The C5 moved the boot pin to GPIO28. The other three use GPIO9, like the C2 and H2.' },
    { q: 'What is the J5 jumper for?', choices: ['Selecting USB or battery power', 'Putting an ammeter in series with the module\'s supply', 'Choosing the antenna', 'Enabling the RGB LED'], a: 1, why: 'Removing J5 breaks the 3.3 V line to the module so that a current meter can be put in its place. That is the way to measure the chip\'s sleep current without the bridge and LEDs.' },
    { q: 'The ESP32-C3 has an 802.15.4 radio, so it can run Zigbee.', a: false, why: 'Only the C6, C5 and H2 have the 802.15.4 radio. The C3 has Wi-Fi 4 and Bluetooth LE only.' }
  ],
  applications: [
    'Smart-home nodes: Zigbee and Thread devices on the C6, Wi-Fi devices on the C3.',
    'Low-power sensors measured with the J5 jumper before the design is finished.',
    'Wi-Fi 6 and 5 GHz trials on the C5.',
    'Development of firmware that will later run on a C-series module inside a product.'
  ],
  sources: [
    'Espressif, user guides of the ESP32-C3-DevKitM-1, ESP32-C6-DevKitC-1, ESP32-C5-DevKitC-1 and ESP32-C61-DevKitC-1 in the esp-dev-kits documentation.',
    'Espressif, datasheets of the ESP32-C3, C6, C5 and C61: features, strapping pins, boot modes.',
    'MicroPython, download pages and the ports/esp32 boards directory (October 2026): the chips with official builds.'
  ],
  sim: [
    { id: 'dk-board-pair', params: { a: 'esp32-c3-devkitm-1', b: 'esp32-c6-devkitc-1' }, title: 'The C3 and C6 boards side by side' },
    { id: 'dk-kit-chooser', params: { chip: 'c' }, title: 'Which Espressif board' }
  ]
},

/* ================================================================ 6. ESP32-H2-DevKitM-1 */
{
  id: 'esp32-h2-devkit',
  parent: 'espressif-devkits',
  title: 'ESP32-H2-DevKitM-1',
  level: 2,
  short: 'The board without Wi-Fi: Bluetooth LE and the 802.15.4 radio of Zigbee and Thread, at very low current — a node for a mesh, not for the internet.',
  keywords: ['ESP32-H2-DevKitM-1', 'ESP32-H2', 'no Wi-Fi', 'Thread', 'Zigbee', 'Matter over Thread', '802.15.4', 'border router', 'RCP', 'J5 jumper', '32 kHz crystal', 'VBAT', 'BLE only'],
  prereq: ['c-series-devkits', 'soc-esp32-h2', 'ieee-802-15-4'],
  related: ['zigbee', 'thread', 'matter', 'thread-border-router-hardware', 'zigbee-and-thread-boards', 'sleepy-ble-zigbee-thread', 'measuring-current'],
  body: `The ESP32-H2 is the member of the family that **cannot join Wi-Fi at all**. It has Bluetooth LE 5.3 and the **802.15.4** radio that Zigbee and Thread are built on, a single 96 MHz RISC-V core and 320 KB of RAM — and it draws little: 140 mA transmitting, 25 mA receiving and about 7 µA in deep sleep (catalogue figures). Its DevKit, the **ESP32-H2-DevKitM-1**, is the board for building the small, mostly sleeping nodes of a Thread or Zigbee network.

### The board

A MINI-1 module with 4 MB of flash, **two USB-C connectors** (a bridge chip on one, the chip's own USB on the other), a BOOT and an EN button, an RGB LED on GPIO8, 25.4 × 48.26 mm, and 19 GPIOs — every one of the chip's usable pins — on two rows of 15 holes. Three details come from the catalogue:

- **J5 jumper** in the supply line, to measure the module's current alone. On a chip meant to sleep at microamps, that is the whole point of the board.
- **A 32.768 kHz crystal option.** Its two pads share GPIO13 and GPIO14: if you fit a crystal (a better clock for deep sleep), those two pins are no longer GPIOs.
- A **VBAT** pin on the header, besides 3V3 and 5V.

The strapping pins are only GPIO8, GPIO9 (BOOT) and GPIO25. GPIO26 and GPIO27 are the USB data pins: leave them alone if you want the built-in USB to work.

### What it talks to

With no Wi-Fi, the H2 reaches a phone over Bluetooth LE, and the rest of the world through a **gateway**: in a Thread network a *border router* connects the mesh to your Wi-Fi or Ethernet; in a Zigbee network a *coordinator* does. Espressif makes one: the **ESP Thread Border Router / Zigbee Gateway Board** pairs an ESP32-S3 (which has the Wi-Fi and Ethernet and runs the IP side) with an ESP32-H2 as a *radio co-processor* for 802.15.4. So the H2 is both the end node and the radio in that gateway — see [[thread-border-router-hardware]].

### Software, and what not to try

ESP-IDF supports Zigbee, Thread and Matter over Thread on the H2, and the Arduino core supports Zigbee and Thread on it; MicroPython has an official build, without Wi-Fi. Every tutorial that starts with \`WiFi.begin()\` or an HTTP request does not apply: you need a gateway, or a different chip such as the [[c-series-devkits|C6]], which has both radios.

> [!key] The H2-DevKitM-1 is a low-power Bluetooth LE and 802.15.4 board with no Wi-Fi: a Thread or Zigbee node that depends on a gateway for the internet. Use its J5 jumper to measure it, and leave GPIO13, 14, 26 and 27 alone if you need the crystal or the USB.`,
  ideas: [
    'The ESP32-H2 has Bluetooth LE and 802.15.4 (Zigbee, Thread) but no Wi-Fi.',
    'The DevKit has a J5 jumper for measuring the module\'s current and a 32.768 kHz crystal option that takes GPIO13 and GPIO14.',
    'To reach the internet, an H2 node needs a gateway: a Thread border router or a Zigbee coordinator.',
    'Espressif\'s Thread border router board uses an S3 for the IP side and an H2 as the 802.15.4 radio.'
  ],
  pitfalls: [
    'Any ESP32 Wi-Fi example will run on the H2 — The chip has no Wi-Fi, so those examples do not apply. Use Bluetooth LE, Thread or Zigbee, or choose a C6.',
    'A Thread device can reach the internet by itself — Thread is a local mesh with IPv6; a border router connects it to your network.',
    'All 19 GPIOs are free — GPIO13 and 14 become the crystal pins if a 32 kHz crystal is fitted, and GPIO26 and 27 are the USB pins.'
  ],
  terms: [
    { term: 'IEEE 802.15.4', also: ['802.15.4 radio'], def: 'A low-power radio standard at 2.4 GHz with small packets, the base of Zigbee and Thread. The H2, C6 and C5 have it.' },
    { term: 'Border router', also: ['Thread border router', 'OTBR'], def: 'A device that connects a Thread mesh to an ordinary IP network such as your Wi-Fi or Ethernet. Without one, Thread nodes can talk to one another but not to the internet.' },
    { term: 'RCP', also: ['radio co-processor'], def: 'A chip that provides only the 802.15.4 radio to a host processor, which runs the network software. In Espressif\'s border router board an ESP32-H2 is the RCP for an ESP32-S3.' },
    { term: 'End device', also: ['sleepy end device', 'SED'], def: 'A node of a Zigbee or Thread network that does not route traffic for others and may sleep most of the time. The H2 at 7 µA is built for this role.' }
  ],
  choose: {
    good: ['Battery-powered Thread or Zigbee sensors and switches', 'Bluetooth LE devices that need the lowest current of the family', 'Learning Matter over Thread on real hardware'],
    avoid: ['Anything that must connect to Wi-Fi: use the C6, C5 or C61', 'Bluetooth Classic, audio or displays: the H2 is a small, slow chip (96 MHz, 320 KB)', 'Use without a gateway if the project needs the internet'],
    check: ['That you have a border router (Thread) or coordinator (Zigbee) in the system', 'Whether you will fit the 32 kHz crystal and so lose GPIO13 and GPIO14', 'The current with J5 removed, not with the board as it comes']
  },
  code: [
    {
      title: 'Advertise a Bluetooth LE service from the H2',
      about: 'The H2 has no Wi-Fi, so a phone finds it over Bluetooth LE. This makes it visible as "H2-DevKit" with one readable value; read it with a generic BLE scanner app on a phone. It starts advertising again whenever a phone disconnects.',
      needs: 'An ESP32-H2-DevKitM-1 and a phone with a BLE scanner app.',
      blocks: `
        when started
          start BLE as [H2-DevKit]
          add service [4fafc201-1fb5-459e-8fcc-c5c9c331914b]
          add characteristic [beb5483e-36e1-4688-b7f5-ea07361b26a8] [read v]
          set value of characteristic to [Hello from the H2]
          start advertising

        when a phone disconnects :: ble
          start advertising
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEUtils.h>
        #include <BLEServer.h>

        #define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
        #define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

        void setup() {
          Serial.begin(115200);
          if (!BLEDevice::init("H2-DevKit")) {
            Serial.println("BLE init failed");
            return;
          }
          BLEServer *server = BLEDevice::createServer();
          server->advertiseOnDisconnect(true);          // advertise again when a phone leaves
          BLEService *service = server->createService(SERVICE_UUID);
          BLECharacteristic *value = service->createCharacteristic(CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ);
          value->setValue("Hello from the H2");
          service->start();
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(SERVICE_UUID);
          adv->setScanResponse(true);
          BLEDevice::startAdvertising();
          Serial.println("advertising as H2-DevKit");
        }

        void loop() {
          delay(2000);
        }
      `,
      py: String.raw`
        import bluetooth
        import time

        _IRQ_CENTRAL_DISCONNECT = 2

        ble = bluetooth.BLE()
        ble.active(True)
        ble.config(gap_name="H2-DevKit")

        SERVICE_UUID = bluetooth.UUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
        CHARACTERISTIC_UUID = bluetooth.UUID("beb5483e-36e1-4688-b7f5-ea07361b26a8")
        VALUE = (CHARACTERISTIC_UUID, bluetooth.FLAG_READ)
        ((value_handle,),) = ble.gatts_register_services(((SERVICE_UUID, (VALUE,)),))
        ble.gatts_write(value_handle, b"Hello from the H2")

        def advertise():
            name = b"H2-DevKit"
            payload = b"\x02\x01\x06" + bytes((len(name) + 1, 0x09)) + name    # flags + complete local name
            ble.gap_advertise(100_000, adv_data=payload)                       # interval in microseconds

        def on_event(event, data):
            if event == _IRQ_CENTRAL_DISCONNECT:
                advertise()                                                    # advertise again when a phone leaves

        ble.irq(on_event)
        advertise()
        print("advertising as H2-DevKit")

        while True:
            time.sleep(1)
      `,
      output: `
        advertising as H2-DevKit
      `,
      notes: ['The sketch uses the 3.x BLE API of the Arduino core; the 4.0 release candidate replaces it with a different one, see [[ble-stacks-nimble-bluedroid]].', 'In MicroPython the advertising payload is built by hand: a flags field and a name field.', 'This is a BLE peripheral, not a Thread or Zigbee node: those have their own stacks ([[thread]], [[zigbee]]).']
    }
  ],
  quiz: [
    { q: 'A tutorial connects an ESP32 to Wi-Fi and posts data to a web server. Can the H2-DevKitM-1 run it unchanged?', choices: ['Yes', 'No: the H2 has no Wi-Fi radio', 'Yes, over USB', 'Only with PSRAM'], a: 1, why: 'The ESP32-H2 offers Bluetooth LE and 802.15.4 only. For Wi-Fi choose the C6, C5, C61 or another chip.' },
    { q: 'What does a Thread border router do?', choices: ['Encrypts Bluetooth', 'Connects the Thread mesh to your IP network', 'Provides 5 GHz Wi-Fi', 'Programs the H2'], a: 1, why: 'Thread nodes form a local IPv6 mesh; the border router links it to Wi-Fi or Ethernet so that phones and the internet can reach the nodes.' },
    { q: 'You fit the 32.768 kHz crystal option on the DevKit. What do you lose?', choices: ['GPIO13 and GPIO14 as GPIOs', 'The USB connector', 'The BOOT button', 'Bluetooth'], a: 0, why: 'The crystal pads share GPIO13 and GPIO14 (the XTAL_32K pins). With a crystal fitted they cannot be used as GPIO.' },
    { q: 'Espressif\'s Thread border router board pairs an S3 with an H2. What is the H2\'s job there?', choices: ['Wi-Fi', 'Radio co-processor for 802.15.4', 'Ethernet', 'Display'], a: 1, why: 'The S3 runs the IP side and has Wi-Fi and Ethernet; the H2 only provides the 802.15.4 radio as a co-processor.' }
  ],
  applications: [
    'Battery-powered Thread sensors that report to a Matter or Home Assistant network through a border router.',
    'Zigbee switches and lamps with very low standby current.',
    'The radio co-processor of a Thread border router or Zigbee gateway.',
    'Bluetooth LE beacons and sensors that never need Wi-Fi.'
  ],
  sources: [
    'Espressif, *ESP32-H2-DevKitM-1 User Guide*: header tables, the J5 jumper, the 32 kHz crystal option.',
    'Espressif, *ESP32-H2 Series Datasheet*: radios, pins, strapping pins, current figures.',
    'Espressif, user guide of the ESP Thread Border Router / Zigbee Gateway Board.'
  ],
  sim: { id: 'dk-board-pair', params: { a: 'esp32-h2-devkitm-1', b: 'esp32-c6-devkitm-1' } }
},

/* ================================================================ 7. ESP32-P4-Function-EV-Board */
{
  id: 'esp32-p4-function-ev-board',
  parent: 'espressif-devkits',
  title: 'ESP32-P4-Function-EV-Board',
  level: 2,
  short: 'An evaluation board for a chip with no radio: 32 MB of PSRAM, a MIPI camera and display, Ethernet and audio, with an ESP32-C6 module on the board to give it Wi-Fi and Bluetooth.',
  keywords: ['ESP32-P4-Function-EV-Board', 'ESP32-P4X', 'P4 EV board', 'MIPI DSI', 'MIPI CSI', 'ESP32-C6-MINI-1', 'ESP-Hosted', 'Ethernet PHY', 'ES8311', 'chip revision', 'v3.x', 'LDO_VO3', 'ESP32-P4X-C5', 'evaluation board'],
  prereq: ['esp32-s3-devkitc', 'soc-esp32-p4', 'what-a-module-adds'],
  related: ['m5-tab5-and-p4', 'esp-as-a-co-processor', 'camera-interfaces', 'display-interfaces', 'ethernet', 'usb-on-the-esp', 'using-psram', 'ai-accelerators-s3-and-p4'],
  body: `The ESP32-P4 is the family's powerhouse: two cores at 400 MHz, 768 KB of RAM, 16 or 32 MB of PSRAM in the package, a MIPI camera port with an image signal processor, a MIPI display port, a hardware H.264 encoder and JPEG codec, USB 2.0 high-speed and Ethernet. It has **no radio** and no flash inside it. The **ESP32-P4-Function-EV-Board** puts all of that in reach on one 74 × 88 mm board — and shows how the missing radio is solved.

### What is on the board

| Part | What the catalogue records |
|---|---|
| Chip and memory | ESP32-P4, 16 MB SPI flash, 32 MB PSRAM |
| Radio | an **ESP32-C6-MINI-1** module for Wi-Fi and Bluetooth LE, with its own programming connector |
| Audio | ES8311 codec, NS4150B 3 W amplifier, speaker port, microphone |
| Ethernet | a PHY on the RMII bus, RJ45 10/100 |
| Camera and display | a MIPI CSI camera connector (15-pin FPC) and a MIPI DSI display connector |
| Storage | microSD slot, 4-bit |
| USB | three USB-C and one USB-A |
| Other | 40 MHz and 32.768 kHz crystals; header J1 with 40 pins |

### Where the Wi-Fi comes from

The P4 has no radio, so an ESP32-C6 module on the board *is* its radio, joined to it by an internal bus. To your program it looks almost like built-in Wi-Fi: Espressif's **ESP-Hosted** software carries the Wi-Fi and Bluetooth calls across to the C6. This is the model for any product that wants a P4's power and a radio: the P4 runs the application, a small radio chip supplies the wireless — [[esp-as-a-co-processor]]. A newer board, the ESP32-P4X-C5-Function-EV-Board, swaps in a C5 for 5 GHz Wi-Fi 6.

### Which version do you hold?

This guide's board is the one with a **pre-v3 chip revision** and the catalogue marks it superseded. The **ESP32-P4X-Function-EV-Board** carries the chip revision v3.x and has its own guide: the same features, an IP101GR Ethernet PHY and an optional 7-inch 1024 × 600 touch screen with a 2-megapixel camera. Its notes warn that chips of revision v3.1 do not support Secure Download, and that two on-board power domains (LDO_VO3 and LDO_VO4) must be configured by the application — leaving them enabled raises the sleep current. Software for the older and the v3 chips is built with different settings, so find your revision first (the program below prints it).

### What it is for

The board's own listing says it plainly: it is for **evaluating one interface with the official examples before you design a board of your own**. It is not small, not cheap to power, and not a product. Its job is to answer "does the P4 drive this screen, this camera, this much traffic?"

> [!key] The P4 board is an evaluation platform for a radio-less chip: big memory, MIPI camera and display, Ethernet and audio, with a C6 on the board supplying Wi-Fi and Bluetooth through ESP-Hosted. Know the chip revision (pre-v3 or v3.x), and treat the board as a way to test interfaces, not as a design.`,
  ideas: [
    'The ESP32-P4 has no radio; the board adds an ESP32-C6 module that provides Wi-Fi and Bluetooth LE.',
    'The board brings out MIPI camera and display connectors, Ethernet, audio, microSD and USB, for evaluating interfaces.',
    'There are two chip revisions (pre-v3 and v3.x) and boards for each, with separate guides.',
    'The 32 MB of PSRAM is what lets it hold the big frame buffers of its displays and cameras.'
  ],
  pitfalls: [
    'The P4 has Wi-Fi like the rest of the family — It has none. The board\'s C6 module supplies it, and the application reaches it through ESP-Hosted.',
    'All P4 boards are the same — The pre-v3 and v3.x chip revisions differ, and the guides list different notes (for example, v3.1 has no Secure Download).',
    'It is a development board for any project — It is an evaluation platform: large, with connectors you may not need. Use it to test an interface, then design the board you need.'
  ],
  terms: [
    { term: 'MIPI DSI', also: ['display serial interface'], def: 'A fast serial interface for driving a display panel, found on phones and tablets. The ESP32-P4 has one; the board brings it out to a connector.' },
    { term: 'MIPI CSI', also: ['camera serial interface'], def: 'A fast serial interface for camera sensors. The ESP32-P4 has one with an image signal processor to tidy the picture before the program sees it.' },
    { term: 'ESP-Hosted', also: ['Wi-Fi remote'], def: 'Espressif software that lets a host chip without a radio (such as the ESP32-P4) use the Wi-Fi and Bluetooth of a second chip as if they were its own.' },
    { term: 'Chip revision', also: ['silicon revision', 'v3.x'], def: 'The version of the chip itself, written v3.1 and so on. Different revisions can need different software settings and have different limitations.' }
  ],
  choose: {
    good: ['Trying the P4\'s MIPI display and camera, Ethernet or H.264 encoder with official examples', 'Developing firmware for a P4 product before its own board exists', 'Projects that need big RAM, USB high-speed and a screen, with a radio from the C6 module'],
    avoid: ['Small, battery or low-cost projects: the board is large and the P4 draws a lot', 'Anything that needs Wi-Fi directly from the P4: its radio is a separate chip', 'Choosing it without checking the chip revision of the board you can actually buy'],
    check: ['The board name and version: P4, P4X or P4X-C5', 'The chip revision, printed by the program below', 'The notes in the guide about the LDO power domains and Secure Download']
  },
  code: [
    {
      title: 'Which chip revision is this?',
      about: 'Prints the chip name, the number of cores, the chip revision and the memory sizes. The revision tells you whether the board has an older or a v3.x chip, which matters for the software settings.',
      needs: 'An ESP32-P4 board with the Arduino core for the P4, and the serial monitor at 115200 baud. Enable PSRAM in the Tools menu to see it.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Cores: ] (number of cores))
          print (join [Chip revision: ] (chip revision))
          print (join [Flash in MB: ] (flash size))
          print (join [PSRAM in MB: ] (PSRAM size))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                    // give the monitor time to open
          Serial.printf("Chip:     %s\n", ESP.getChipModel());
          Serial.printf("Cores:    %d\n", ESP.getChipCores());
          int rev = (int)ESP.getChipRevision();           // the format is major * 100 + minor: 301 is v3.1
          Serial.printf("Revision: v%d.%d\n", rev / 100, rev % 100);
          Serial.printf("Flash:    %lu MB\n", (unsigned long)(ESP.getFlashChipSize() / (1024 * 1024)));
          Serial.printf("PSRAM:    %lu MB\n", (unsigned long)(ESP.getPsramSize() / (1024 * 1024)));
        }

        void loop() {
        }
      `,
      na: { py: 'MicroPython has no call that reports the chip revision. The esptool program on the computer prints it when it connects to the chip.' },
      output: `
        Chip:     ESP32-P4
        Cores:    2
        Revision: v1.0
        Flash:    16 MB
        PSRAM:    32 MB
      `,
      notes: ['The revision shown above is an example for an older chip; a P4X board prints v3.x.', 'A PSRAM size of 0 means the option is off in the Tools menu, not that the memory is missing.']
    }
  ],
  examples: [
    {
      title: 'Can the chip\'s own RAM hold one frame of the 7-inch screen?',
      q: 'The optional display of the P4X board is 1024 × 600 pixels. At 16 bits (2 bytes) per pixel, how big is one frame, and does it fit in the ESP32-P4\'s 768 KB of internal RAM?',
      steps: ['Pixels: $1024 \\times 600 = 614\\,400$.', 'Bytes at 2 bytes per pixel: $614\\,400 \\times 2 = 1\\,228\\,800$ bytes, about 1.17 MB.', 'Internal RAM is $768 \\times 1024 = 786\\,432$ bytes.', 'One frame is larger than all the internal RAM, and a screen usually needs two or three buffers.'],
      a: 'One frame is about 1.2 MB — more than the whole 768 KB of internal RAM — so the buffers must live in the 32 MB of PSRAM.'
    }
  ],
  quiz: [
    { q: 'Where does the Wi-Fi of the ESP32-P4-Function-EV-Board come from?', choices: ['Inside the P4', 'An ESP32-C6 module on the board, reached through ESP-Hosted', 'The Ethernet PHY', 'A USB dongle'], a: 1, why: 'The P4 has no radio. An ESP32-C6-MINI-1 module on the board provides Wi-Fi and Bluetooth LE.' },
    { q: 'What does the program on this page tell you that helps choose software settings?', choices: ['The Wi-Fi password', 'The chip revision, such as v1.x or v3.x', 'The IP address', 'The battery level'], a: 1, why: 'The pre-v3 and v3.x chips are built with different settings and have different limitations, so you need to know which you have.' },
    { q: 'The ESP32-P4 has no built-in Bluetooth, so the board cannot offer any.', a: false, why: 'The P4 has no radio, but the ESP32-C6 module on the board supplies Wi-Fi and Bluetooth LE to it through ESP-Hosted.' },
    { q: 'Why does a 1024 × 600 screen need external RAM?', choices: ['The screen has its own memory', 'One frame at 16 bits is about 1.2 MB, more than the chip\'s 768 KB of RAM', 'PSRAM is faster than SRAM', 'The display uses Wi-Fi'], a: 1, why: '1024 × 600 × 2 bytes is 1 228 800 bytes. The internal RAM is 786 432 bytes, so the frame buffers go into PSRAM.' }
  ],
  applications: [
    'Trying MIPI displays and cameras before choosing the parts of a product.',
    'Video and HMI prototypes that use the H.264 encoder, the JPEG codec and big frame buffers.',
    'Ethernet gateways and audio devices that need the P4\'s speed and USB high-speed.',
    'Software bring-up for products built on the ESP32-P4 and a separate radio chip.'
  ],
  sources: [
    'Espressif, *ESP32-P4-Function-EV-Board User Guide* (board version 1.5.2) and the guide of the ESP32-P4X-Function-EV-Board.',
    'Espressif, *ESP32-P4 Series Datasheet*: features, interfaces and strapping pins.',
    'Espressif, ESP-Hosted documentation: using a second chip as the radio of a host.'
  ],
  sim: { id: 'dk-kit-map', params: { board: 'esp32-p4-function-ev-board' } }
},

/* ================================================================ 8. ESP32-S3-BOX-3 */
{
  id: 'esp32-s3-box',
  parent: 'espressif-devkits',
  title: 'ESP32-S3-BOX-3: a voice assistant kit',
  level: 1,
  short: 'A finished, enclosed ESP32-S3 with a touch screen, two microphones, a speaker and a motion sensor: the smallest way to try wake words and voice control, and a reference design for building your own.',
  keywords: ['ESP32-S3-BOX-3', 'ESP32-S3-BOX', 'BOX-3', 'voice assistant', 'wake word', 'ESP-SR', 'audio front end', 'dock', 'BOX-3-DOCK', 'touch screen', 'microphone', 'speaker', 'IMU', 'Espressif kit'],
  prereq: ['esp32-s3-devkitc', 'what-a-microcontroller-is'],
  related: ['wake-words-and-speech-commands', 'voice-assistants', 'home-assistant-voice-hardware', 'voice-assistant-firmware', 'i2s-microphones', 'audio-codecs', 'camera-and-audio-kits', 'lcd-evaluation-boards'],
  body: `The **ESP32-S3-BOX-3** is not a board you wire up: it is a small enclosed device, 48.9 × 57.8 mm, with a 2.4-inch 320 × 240 touch screen on the front. Inside are an ESP32-S3-WROOM-1 module (16 MB flash and, in the board catalogue, 8 MB PSRAM), **two digital microphones**, a speaker, and a motion sensor with a three-axis gyroscope and a three-axis accelerometer. One USB-C connector — the chip's own USB, no bridge — brings power, firmware and debugging. Espressif ships it with demonstration firmware, and publishes its design, so it is both a toy and a reference.

### How a voice assistant is split up

A voice device is a chain, and the chain is why the S3 suits it:

1. **Microphones** capture sound as digital samples.
2. An **audio front end** cleans it: it cancels the device's own speaker output (echo), reduces noise and decides whether anyone is speaking.
3. A **wake-word detector** runs all the time on the chip, looking for one phrase in the cleaned signal. Espressif's speech software (ESP-SR) does this on the S3 using its vector instructions; nothing leaves the device until the phrase is heard.
4. **Commands** are then either recognised on the device from a short fixed list, or the audio is sent to a service that understands free speech.
5. The **answer** comes back and the speaker plays it.

Steps 1–3 and a small part of 4 fit in a microcontroller; open-ended understanding does not, and normally lives on a server — which decides what leaves your house.

### The numbers

Audio is a stream of numbers, and the stream is bigger than it looks. Mono speech at 16 000 samples a second and 16 bits is 32 000 bytes a second; two microphones double it to 64 000. Ten seconds of two-channel audio is 640 KB — more than the S3's whole 512 KB of internal RAM. That is why the module carries PSRAM, and the simulation below lets you change the sample rate, bit depth and channels to see when the buffers outgrow each memory.

### The docks

The BOX-3 has a high-density connector on its back (the catalogue calls it PCIe-style) for **docks**. The BOX-3-DOCK adds two Pmod-compatible headers with 16 GPIOs, a USB-A host connector and a USB-C power input; a breadboard dock is also made. The box itself exposes no pins, so projects that read sensors or drive relays need a dock.

> [!warn] **Microphones listen to people.** A device that listens for a wake word is still a microphone in a room. Tell the people who live or work near it, and follow your country's rules on recording and on children's data. Prefer a design where nothing leaves the device until the wake word is heard.

> [!key] The S3-BOX-3 is a ready-made voice kit: two microphones, a speaker, a screen and an S3 that detects the wake word locally. Its audio streams are large enough to need PSRAM, and its pins are reached only through a dock.`,
  ideas: [
    'The BOX-3 is an enclosed ESP32-S3 device with a touch screen, two microphones, a speaker and a motion sensor.',
    'A voice assistant is a chain: microphones, audio clean-up, an always-on wake-word detector, commands, an answer.',
    'Wake-word detection runs on the chip; open-ended speech normally goes to a service.',
    'Audio streams are large (64 000 bytes a second for two channels at 16 kHz and 16 bits), which is why PSRAM is fitted.'
  ],
  pitfalls: [
    'A voice assistant needs the cloud for everything — The wake word and a list of simple commands can be recognised on the chip. Only free-form understanding normally needs a service.',
    'It is a DevKit with a screen — It is an enclosed product: the pins are not on headers, and you need a dock to reach them.',
    'The BOX-3 needs a USB bridge like other boards — It has none: the S3\'s own USB carries power, flashing and debugging, so it disappears and returns at each restart.'
  ],
  terms: [
    { term: 'Wake word', also: ['keyword spotting', 'hot word'], def: 'A short phrase that a device listens for continuously, and only after hearing it starts listening for a command. The detector is a small neural network that runs on the chip.' },
    { term: 'Audio front end', also: ['AFE', 'echo cancellation', 'noise suppression'], def: 'The first stage of voice processing: it removes the device\'s own sound from the microphone signal, reduces noise and detects speech, so the wake-word detector hears a clean signal.' },
    { term: 'ESP-SR', also: ['ESP-Skainet', 'WakeNet', 'MultiNet'], def: 'Espressif\'s speech recognition software for its chips: wake-word detection, a limited offline command recogniser and the audio front end.' },
    { term: 'Dock', also: ['BOX-3-DOCK', 'expansion dock'], def: 'A board that plugs into the BOX-3\'s back connector and brings out headers, a USB host connector or a breadboard area, since the box itself has no pins.' },
    { term: 'Sample rate', also: ['sampling frequency'], def: 'How many audio samples per second are captured. Speech recognition commonly uses 16 000 a second; music uses 44 100 or 48 000.' }
  ],
  choose: {
    good: ['Trying wake words and voice commands without building any hardware', 'A reference design to copy: microphones, speaker, screen and chip already working together', 'A desk device for a home-automation voice interface'],
    avoid: ['Projects that need pins, relays or sensors, unless you add a dock', 'Battery products: it is a mains- or USB-powered desk device', 'Anywhere recording people without their knowledge is a risk'],
    check: ['The PSRAM size: the catalogue says 8 MB, but Espressif\'s own text calls it 16 MB octal; check yours', 'Which dock you need for the pins you want', 'The firmware: what stays on the device and what is sent to a service']
  },
  examples: [
    {
      title: 'How much memory does a recording take?',
      q: 'Two microphones are recorded at 16 000 samples a second, 16 bits each. How many bytes per second is that, and how long a recording fits in the S3\'s 512 KB of internal RAM?',
      steps: ['Bytes per sample: $16/8 = 2$. Channels: 2. Rate: 16 000.', 'Bytes per second: $16\\,000 \\times 2 \\times 2 = 64\\,000$.', 'Internal RAM: $512 \\times 1024 = 524\\,288$ bytes.', 'Time: $524\\,288 / 64\\,000 \\approx 8.2$ s, and that would use all of it with nothing left for the program.'],
      a: '64 000 bytes a second. Even if nothing else used the memory, about 8 seconds would fill the internal RAM — recordings belong in PSRAM.'
    }
  ],
  quiz: [
    { q: 'What runs on the BOX-3\'s chip all the time while it waits for a command?', choices: ['A cloud connection', 'The wake-word detector', 'The speaker', 'The dock'], a: 1, why: 'The wake-word detector listens continuously on the chip. Only after it hears the phrase does the device record a command or contact a service.' },
    { q: 'Two channels at 16 kHz and 16 bits: how many bytes per second?', answer: 64000, unit: 'B/s', why: 'Rate 16 000 times 2 bytes per sample times 2 channels is 64 000 bytes per second.' },
    { q: 'You want to read a temperature sensor with a BOX-3. What do you need?', choices: ['Nothing: pins are on the sides', 'A dock, which brings out headers', 'A USB bridge', 'Wi-Fi'], a: 1, why: 'The box has no header pins. The BOX-3-DOCK brings out Pmod-compatible headers with 16 GPIOs.' },
    { q: 'Since the BOX-3 detects the wake word on its own chip, nothing it hears ever leaves the device.', a: false, why: 'Only the wake-word stage is local. Once it is triggered, the audio of a command may be sent to a service, depending on the firmware you run.' }
  ],
  applications: [
    'A desk voice interface for home automation, as a satellite for a voice assistant.',
    'A demonstration of on-device wake-word detection for a product team.',
    'A reference design to copy for a product with a screen, two microphones and a speaker.',
    'A teaching kit for speech recognition and audio processing without soldering.'
  ],
  sources: [
    'Espressif, ESP32-S3-BOX hardware overview and the esp-box repository documentation (BOX-3 pages).',
    'Espressif, ESP-SR documentation: audio front end, WakeNet and MultiNet.',
    'Espressif, *ESP32-S3 Series Datasheet*: memory and the vector instructions.'
  ],
  sim: [
    { id: 'dk-memory-budget', params: { mode: 'audio', board: 'esp32-s3-box-3' }, title: 'Audio buffers against memory' },
    { id: 'dk-kit-map', params: { board: 'esp32-s3-box-3' }, title: 'What is inside the box' }
  ]
},

/* ================================================================ 9. camera and audio kits */
{
  id: 'camera-and-audio-kits',
  parent: 'espressif-devkits',
  title: 'ESP-EYE, S3-EYE, Korvo and LyraT',
  level: 2,
  short: 'Espressif\'s camera and sound boards: the parts and the memory a camera or a microphone array needs, wired the way the chip likes — and the reasons they are not breadboard boards.',
  keywords: ['ESP-EYE', 'ESP32-S3-EYE', 'ESP32-S3-Korvo-1', 'ESP32-S3-Korvo-2', 'ESP32-LyraT', 'ESP32-LyraT-Mini', 'OV2640', 'audio codec', 'ES8311', 'ES7210', 'ES8388', 'microphone array', 'PSRAM', 'face detection', 'ESP-WHO', 'ESP-ADF', 'camera board'],
  prereq: ['esp32-s3-box', 'anatomy-of-a-dev-board'],
  related: ['camera-interfaces', 'camera-sensors', 'the-esp32-camera-driver', 'audio-codecs', 'i2s-microphones', 'psram-on-modules', 'using-psram', 'cameras-and-the-law', 'wake-words-and-speech-commands'],
  body: `A camera or a microphone array is hard to wire on a breadboard: a camera needs a dozen fast signals and its own clean supplies; microphones pick up every bit of noise on their wires; and the data arrives in volumes that need external RAM. Espressif therefore sells **reference boards** where all that is already done, built for its two software families: **ESP-WHO** (face and object detection) and **ESP-ADF** (audio). The records in the board catalogue:

| Board | Chip | Flash / PSRAM | What it adds | Status |
|---|---|---|---|---|
| ESP-EYE | ESP32 | 4 MB / 8 MB | 2-megapixel camera, one digital microphone, CP2102 bridge | end of life |
| ESP32-S3-EYE | S3 | 8 MB / 8 MB octal | OV2640 camera, 1.3" LCD, I2S microphone, microSD, accelerometer, Li-ion charger | current |
| ESP32-S3-Korvo-1 | S3 | 16 MB / 8 MB | ES8311 codec, ES7210 4-channel ADC, 3 W amplifier, three analogue microphones | superseded |
| ESP32-S3-Korvo-2 | S3 | 16 MB / 8 MB | the same codec and ADC, two microphones, camera and LCD connectors, microSD | current |
| ESP32-LyraT (v4.3) | ESP32 | 4 MB / 8 MB | ES8388 stereo codec, two speaker outputs, two microphones, microSD, Li-ion charger | superseded |
| ESP32-LyraT-Mini (v1.2) | ESP32 | 8 MB / 8 MB | ES8311 codec, ES7243 ADC, amplifier, headphone socket, auto-upload circuit | current |

### Why a codec

A microphone makes a tiny analogue voltage; a speaker needs a lot of current. An **audio codec** (ES8311, ES8388 and others) is the chip in between: converters in both directions, amplifiers and volume control, joined to the ESP32 by the I2S bus ([[audio-codecs]]). The Korvo boards add an ES7210, a four-channel converter, so that more than two microphones — or the speaker signal, as a reference for cancelling echo — can be captured at once.

### Why so much memory

The S3-EYE's sensor delivers up to 1600 × 1200 pixels. One such frame at 16 bits per pixel is about 3.84 MB; two of them are 7.7 MB — nearly all of the 8 MB of PSRAM. This is why camera boards carry PSRAM, and why they ask the sensor for **JPEG**, which the OV2640 can compress itself, instead of raw pixels. The simulation below does the sums for your choice of size and format. On the classic ESP32 only 4 MB of PSRAM can be mapped at a time.

### What is not free

- **Pins.** On the S3-EYE every GPIO except GPIO3 is already allocated to an on-board part. These boards are for running examples and copying circuits, not for adding wires.
- **No bridge on the S3-EYE.** It uses the chip's own USB. If the program keeps rebooting, hold BOOT, press RST, release RST and then BOOT to enter download mode.
- **Shared pins on the LyraT.** GPIO12–15 serve both the microSD card and JTAG, selected by DIP switches: with all of them off, the card runs in 1-wire mode and JTAG is unavailable. Plugging an audio signal into the AUX input at power-up may stop the ESP32 booting.
- **Language and software.** The Korvo-1's default firmware recognises only a Chinese wake word and commands.

> [!warn] **Cameras and microphones record people.** Consent and local law apply to what you record, keep and send, in a home as much as in a shop or office. Do not point a camera at places where people expect privacy, and say clearly when a device listens or watches.

> [!key] Espressif's camera and audio boards are reference designs: a sensor or microphones, a codec, PSRAM and amplifiers wired correctly, with almost no pins left over. They are for trying ESP-WHO and ESP-ADF examples and for copying circuits, not for breadboarding.`,
  ideas: [
    'Camera and audio boards are reference designs with the sensor, codec, PSRAM and amplifier already wired.',
    'An audio codec contains the converters and amplifiers between the I2S bus and the microphones and speakers.',
    'A 1600 × 1200 frame at 16 bits is about 3.84 MB, which is why camera boards carry PSRAM and use JPEG.',
    'These boards have almost no spare pins, and some share pins between functions through DIP switches.'
  ],
  pitfalls: [
    'A camera board is a DevKit plus a camera — The pins are used up by the camera, screen and audio parts. On the S3-EYE only GPIO3 is left.',
    'Every frame is small enough for RAM — A full-size raw frame is several megabytes. Camera projects need PSRAM and usually JPEG output.',
    'Any microphone board listens to a room, so it is just a sensor — It records people. Consent and local law apply.'
  ],
  terms: [
    { term: 'Audio codec', also: ['codec chip', 'ES8311', 'ES8388', 'ES7210'], def: 'A chip with converters in both directions (microphone to digital, digital to speaker), amplifiers and volume control, connected to the ESP32 over the I2S bus.' },
    { term: 'DVP', also: ['digital video port', 'parallel camera interface'], def: 'A camera interface with a pixel clock and eight or more parallel data lines, used by sensors such as the OV2640. The ESP32-S3 has it directly; the original ESP32 reaches it through its I2S block.' },
    { term: 'Frame buffer', also: ['image buffer'], def: 'A block of memory holding one picture. Its size is width times height times bytes per pixel, which for a megapixel camera means megabytes.' },
    { term: 'Echo cancellation', also: ['AEC'], def: 'Removing the device\'s own loudspeaker sound from the microphone signal, so that a speaker playing music does not drown out the wake word. It needs a copy of the speaker signal as a reference.' }
  ],
  choose: {
    good: ['Trying face detection or a microphone array with Espressif\'s own examples', 'Copying a working camera or codec circuit into your own design', 'The S3-EYE for a small camera board with a screen and microSD'],
    avoid: ['Projects that need many free pins: they are used by the on-board parts', 'The superseded and end-of-life boards (ESP-EYE, Korvo-1, LyraT) for new work', 'Any use that records people without their knowledge'],
    check: ['The status of the board: current, superseded or end of life', 'Which software family (ESP-WHO or ESP-ADF) the examples belong to', 'The PSRAM size against the frame size and format you want']
  },
  examples: [
    {
      title: 'One full frame from the S3-EYE',
      q: 'The OV2640 on the S3-EYE gives up to 1600 × 1200 pixels. How many bytes is one raw frame at 16 bits per pixel, and how many fit in 8 MB of PSRAM?',
      steps: ['Pixels: $1600 \\times 1200 = 1\\,920\\,000$.', 'Bytes at 2 bytes per pixel: $3\\,840\\,000$, about 3.66 MiB.', 'PSRAM: $8 \\times 1024 \\times 1024 = 8\\,388\\,608$ bytes.', 'Frames: $8\\,388\\,608 / 3\\,840\\,000 \\approx 2.2$, so two frames and almost nothing else.'],
      a: 'About 3.84 million bytes a frame; two frames fill nearly all the PSRAM. Ask for JPEG, or a smaller frame.'
    }
  ],
  quiz: [
    { q: 'Why does the S3-EYE have PSRAM?', choices: ['To run Wi-Fi faster', 'A full camera frame is megabytes, far beyond the chip\'s internal RAM', 'To store the bootloader', 'The camera needs it for power'], a: 1, why: 'A 1600 × 1200 frame at 16 bits is about 3.84 MB. The internal RAM is 512 KB, so frame buffers live in PSRAM.' },
    { q: 'What is the job of an audio codec such as the ES8311?', choices: ['It programs the flash', 'It converts between analogue and digital sound and amplifies it, talking to the chip over I2S', 'It provides Wi-Fi', 'It charges the battery'], a: 1, why: 'The codec holds the converters and amplifiers between the microphones, the speaker and the I2S bus.' },
    { q: 'You want to add a sensor to an ESP32-S3-EYE with a jumper wire. What is the problem?', choices: ['There is no USB', 'Every GPIO except GPIO3 is already used by an on-board part', 'The board has no flash', 'The S3 has too few pins'], a: 1, why: 'The catalogue notes that all GPIOs of the module except GPIO3 are allocated to on-board components.' },
    { q: 'The OV2640 can compress pictures to JPEG itself, which reduces the memory needed.', a: true, why: 'Asking the sensor for JPEG output replaces megabyte frames by files of tens or hundreds of kilobytes, at the cost of detail you cannot recover.' }
  ],
  applications: [
    'Face and object detection prototypes with ESP-WHO on the S3-EYE.',
    'Far-field voice capture with a microphone array on the Korvo boards.',
    'Internet radios, players and speakers on the LyraT boards.',
    'Reference circuits for camera and codec wiring in a custom design.'
  ],
  sources: [
    'Espressif, getting-started guides of the ESP-EYE and ESP32-S3-EYE (the ESP-WHO documentation).',
    'Espressif, user guides of the ESP32-S3-Korvo-1 and Korvo-2, ESP32-LyraT and ESP32-LyraT-Mini (the ESP-ADF documentation).',
    'OmniVision, OV2640 datasheet: output formats and the JPEG compressor.'
  ],
  sim: [
    { id: 'dk-memory-budget', params: { mode: 'camera', board: 'esp32-s3-eye' }, title: 'Camera frames against memory' },
    { id: 'dk-kit-map', params: { board: 'esp32-s3-eye', boards: ['esp-eye', 'esp32-s3-eye', 'esp32-s3-korvo-1', 'esp32-s3-korvo-2', 'esp32-lyrat', 'esp32-lyrat-mini'] }, title: 'What each kit carries' }
  ]
},

/* ================================================================ 10. LCD evaluation boards */
{
  id: 'lcd-evaluation-boards',
  parent: 'espressif-devkits',
  title: 'The LCD evaluation boards',
  level: 2,
  short: 'Boards that exist to answer one question — will this screen run well on this chip? — with the panel, the touch layer and the pin budget already worked out.',
  keywords: ['ESP32-C3-LCDkit', 'ESP32-S3-LCD-EV-Board', 'ESP32-LCDKit', 'LCD evaluation', 'SPI display', 'RGB interface', 'I80', 'I/O expander', 'TCA9554', 'sub board', 'LVGL', 'frame buffer', 'frame rate', 'rotary encoder', 'pin budget'],
  prereq: ['esp32-s3-devkitc', 'c-series-devkits'],
  related: ['display-interfaces', 'colour-tft-displays', 'lvgl', 'lvgl-display-and-input-drivers', 'frame-rate-and-bus-speed', 'io-expanders-and-shift-registers', 'capacitive-touch-screens', 'cheap-yellow-display'],
  body: `A display costs three things: **pins**, **bandwidth** and **memory**. A small round LCD may need only four wires; a bright 800 × 480 panel needs sixteen data lines, four timing signals and a megabyte of RAM. Before designing a product around one, you want to see it run. That is the purpose of Espressif's LCD evaluation boards: the panel, its touch layer and the wiring have been worked out, and the examples use the official LCD drivers and LVGL ([[lvgl]]).

### Four ways to drive a panel

The chips differ in what they can do; the catalogue lists the display interfaces of each:

| Interface | Wires | Speed | Chips (from the catalogue) |
|---|---|---|---|
| SPI | 4–6: clock, data, chip select, data/command, reset | the slowest, the simplest | all |
| I80 (parallel, 8 or 16 bit) | 10–20 | several times SPI | ESP32 (through its I2S block), S3 |
| RGB (16-bit parallel plus sync signals) | 20 or more | continuous: the panel is refreshed from a full frame buffer all the time | S3, P4 |
| MIPI DSI | 2 fast lanes | highest | P4 |

A panel with a controller and its own memory takes updates of just the changed region over SPI. A raw RGB panel has no memory and must be fed every pixel every refresh, which is why it needs the full frame in RAM and cannot be run casually from a small chip.

### The boards

- **ESP32-C3-LCDkit.** A 1.28-inch 240 × 240 SPI display on a sub-board, a rotary encoder with a push switch, a speaker with an amplifier, infrared receive and transmit (jumper-selectable), an RGB LED and an expansion header. It is a complete small interface in 54.2 × 66.2 mm, run by a C3 with no PSRAM.
- **ESP32-S3-LCD-EV-Board.** An S3 module with 16 MB of flash and 16 MB of PSRAM, an **I/O expander** (TCA9554), an audio codec, a four-channel audio converter, two microphones, a speaker amplifier, and a board connector for **interchangeable LCD sub-boards**: the catalogue lists a 0.96-inch 128 × 64 I2C panel and a 2.4-inch 320 × 240 SPI panel with touch, among others. It has both a bridge and the chip's own USB. Its guide asks for ESP-IDF v5.1.2, and boards of version 1.5 and of 1.4 or below have separate guides — read the version marked on the back.
- **ESP32-S3-LCD-EV-Board-2** is a related board; the catalogue holds little about it.
- **ESP32-LCDKit.** A modular set: a display connection module for serial or 8- or 16-bit parallel panels, an SD slot and an audio module, around a DevKitC that you plug in.

### Two lessons from the pin budget

On the C3-LCDkit, the LCD takes GPIO0, 1, 2, 5 and 7, the speaker amplifier GPIO3, the infrared pair GPIO4 and the LED GPIO8. Look at which of these are [[strapping-pins|strapping pins]]: GPIO2 (the LCD's data/command line) and GPIO8 (the LED's data). Both are *outputs into a part that does not pull them*, which is the safe way to use a strapping pin. And the S3 board shows the other answer when pins run out: an **I/O expander** on I2C supplies the slow control lines (resets, enables) so the fast ones keep the chip's pins.

### What the numbers say

A 240 × 240 frame at 16 bits is 115 200 bytes and, at a 40 MHz SPI clock, about 41 full frames a second at best. A 320 × 240 frame is 153 600 bytes and about 31. The simulation below shows how clock, width and colour depth trade against the memory you have.

> [!key] The LCD evaluation boards let you test a panel, its touch layer and its pin budget before designing around it. Bandwidth decides the interface (SPI, parallel, RGB, MIPI), memory decides the buffering, and an I/O expander is the usual answer when pins run out.`,
  ideas: [
    'A display costs pins, bandwidth and memory; evaluation boards let you measure all three before designing a product.',
    'SPI is simplest and slowest, parallel and RGB faster, MIPI DSI fastest and only on the P4; an RGB panel needs a full frame buffer in RAM.',
    'The C3-LCDkit shows a complete small interface; the S3-LCD-EV-Board shows interchangeable panels and an I/O expander.',
    'Check the board version marked on the back: guides differ between versions.'
  ],
  pitfalls: [
    'Any display works on any ESP32 — The interface must exist on the chip: an RGB panel needs the S3 or P4, a MIPI panel the P4, and a C3 can do SPI only.',
    'SPI at 40 MHz means 40 frames a second — That is for a small 240 × 240 frame at best. A 320 × 240 frame already drops to about 31, and a bigger panel to a few.',
    'Strapping pins cannot be used for a display — They can, as outputs into parts that do not pull them. The C3-LCDkit does so with GPIO2 and GPIO8.'
  ],
  terms: [
    { term: 'SPI display', also: ['serial display', 'ST7789', 'ILI9341'], def: 'A display whose controller is fed over the SPI bus: a clock, data, chip select and a data/command line. Simple on pins, limited in bandwidth.' },
    { term: 'I80 interface', also: ['8080 bus', 'parallel LCD', 'i8080'], def: 'A parallel display bus of eight or sixteen data lines and a write strobe. It moves pixels several times faster than SPI, at the cost of many pins.' },
    { term: 'RGB interface', also: ['parallel RGB', 'RGB panel'], def: 'A display bus of sixteen or more colour lines plus clock and sync signals, where the chip streams a whole frame continuously. The panel has no memory, so a full frame buffer is needed.' },
    { term: 'I/O expander', also: ['TCA9554', 'PCF8574', 'port expander'], def: 'A small chip on I2C that provides extra GPIO pins. Boards use it for slow control signals, such as panel reset or enable, to save the ESP32\'s own pins.' },
    { term: 'Sub board', also: ['daughter board', 'LCD sub-board'], def: 'A small board that plugs into a larger one, here carrying a particular LCD panel so that the main board can be tried with several panels.' }
  ],
  choose: {
    good: ['Trying a panel, a touch layer and LVGL with the maker\'s own drivers before choosing parts', 'Copying a proven display wiring and pin budget into your own board', 'The C3-LCDkit for a small round or square interface with an encoder; the S3 board for bigger and varied panels'],
    avoid: ['Choosing a panel from the boards: the same driver may not suit your size or interface', 'Building a product on a board whose guide you have not matched to its version', 'Expecting the kit\'s pins to stay free: the display, audio and encoder take most of them'],
    check: ['The version on the back of the board, against the guide you follow', 'That the chip has the interface your panel needs', 'The memory for the frame buffers, in internal RAM or PSRAM']
  },
  examples: [
    {
      title: 'How fast can an SPI panel refresh?',
      q: 'A 320 × 240 panel at 16 bits per pixel is driven over SPI at 40 MHz (one data line). Allowing 5 % for command overhead, what is the best frame rate?',
      steps: ['Bits per frame: $320 \\times 240 \\times 16 = 1\\,228\\,800$.', 'With 5 % overhead: $1\\,228\\,800 \\times 1.05 = 1\\,290\\,240$ bits.', 'Frames per second: $40\\,000\\,000 / 1\\,290\\,240 \\approx 31$.'],
      a: 'About 31 frames a second at best. Updating only the part of the screen that changed, which is what GUIs do, gives far more in practice.'
    }
  ],
  quiz: [
    { q: 'Which interface needs a complete frame buffer in RAM at all times?', choices: ['SPI to a panel with its own memory', 'I2C', 'The RGB interface', 'UART'], a: 2, why: 'A raw RGB panel has no memory of its own; the chip streams the whole frame again and again, so the full frame must be held in RAM.' },
    { q: 'Why does the S3-LCD-EV-Board carry an I/O expander?', choices: ['To make the display brighter', 'To supply slow control lines without using the chip\'s own pins', 'To speed up SPI', 'To power the speaker'], a: 1, why: 'Panels need resets, enables and similar signals. An expander on I2C provides them and leaves the chip\'s pins for the fast display and audio buses.' },
    { q: 'An ESP32-C3 can drive an 800 × 480 RGB panel directly.', a: false, why: 'The C3 has SPI display support only. RGB panels need the S3 or P4, and MIPI DSI panels the P4.' },
    { q: 'The C3-LCDkit puts the LCD\'s data/command line on GPIO2. Why is that acceptable?', choices: ['GPIO2 is not a strapping pin', 'GPIO2 is an output into a part that does not pull the pin at reset', 'The pin is unused at reset', 'GPIO2 is the flash pin'], a: 1, why: 'GPIO2 is a strapping pin on the C3. An output wired to a high-impedance input does not disturb the level the chip reads at reset.' }
  ],
  applications: [
    'Trying LVGL interfaces on a real panel before hardware design starts.',
    'Choosing between an SPI panel and an RGB panel by measuring frame rate and memory.',
    'Smart-knob and thermostat prototypes on the C3-LCDkit, with its encoder and display.',
    'Copying the wiring of a codec, expander and display into a product board.'
  ],
  sources: [
    'Espressif, user guides of the ESP32-C3-LCDkit, ESP32-S3-LCD-EV-Board and ESP32-LCDKit in the esp-dev-kits documentation.',
    'Espressif, ESP-IDF Programming Guide, LCD API: panel IO (SPI, I80), RGB and MIPI DSI panels.',
    'LVGL documentation, display and input driver interfaces.'
  ],
  sim: [
    { id: 'dk-lcdkit-pins', params: {}, title: 'The C3-LCDkit pin budget' },
    { id: 'dk-memory-budget', params: { mode: 'lcd', board: 'esp32-c3-lcdkit' }, title: 'Frame buffer and frame rate' }
  ]
},

/* ================================================================ 11. ESP-Prog and the debug tools */
{
  id: 'esp-prog-and-debug-tools',
  parent: 'espressif-devkits',
  title: 'ESP-Prog and the debug adapters',
  level: 2,
  short: 'How to program a chip that has no USB of its own, and how to stop a running program, step through it and look at its variables: JTAG, OpenOCD, the ESP-Prog family and the debugger built into newer chips.',
  keywords: ['ESP-Prog', 'ESP-Prog-2', 'JTAG', 'OpenOCD', 'GDB', 'debug adapter', 'FT2232', 'ESP-WROVER-KIT', 'USB Serial/JTAG', 'MTDI', 'GPIO12', 'PWR SEL', 'breakpoint', 'programmer', 'debugger'],
  prereq: ['usb-serial-bridges-and-auto-reset', 'anatomy-of-a-dev-board'],
  related: ['jtag-debugging', 'flashing-and-esptool', 'factory-programming', 'production-testing', 'strapping-pins', 'efuses', 'disabling-debug-interfaces', 'print-debugging-and-log-levels'],
  body: `Printing messages finds many bugs; some it cannot find: a program that hangs before it prints, a crash in an interrupt, a value that changes when nobody writes it. For those you want to **stop the chip, step through the program and look at memory** — a debugger. A debug adapter is the hardware that connects one to the chip, and the same adapter usually also programs it.

### Two jobs, two sets of wires

- **Programming** needs the serial lines (TX and RX) and control of the **EN** and **boot** pins — the same wires the DevKit's auto-reset circuit uses ([[usb-serial-bridges-and-auto-reset]]).
- **Debugging** uses **JTAG**: four signals — TMS, TCK, TDI and TDO — plus ground. On the computer, **OpenOCD** talks to the adapter and **GDB** talks to OpenOCD, which is how ESP-IDF's debugging works: \`idf.py openocd\` in one terminal and \`idf.py gdb\` in another.

### Three ways to get an adapter

1. **Your chip's own USB.** The ESP32-S3, C3, C6, C5, C61, H2 and P4 contain a JTAG controller behind their USB Serial/JTAG block, so one USB cable programs *and* debugs, with no adapter. Light and deep sleep stop the USB, so a sleeping chip cannot be debugged this way.
2. **A board with the adapter on it.** The ESP-WROVER-KIT carries an **FTDI FT2232HL**, a two-channel chip whose channels give a serial port and a JTAG port over one Micro-USB; the ESP32-Ethernet-Kit does the same, and the S2-Kaluga-1 has a separate FT2232 adapter board. The classic ESP32 and the S2 have no built-in JTAG over USB, so they depend on this.
3. **A separate adapter.** The **ESP-Prog** is the original: a small board with a programming interface and a JTAG interface (the catalogue marks it superseded). The current **ESP-Prog-2** is itself an ESP32-S3-MINI-1 with a USB-C connector acting as programmer and debugger, with the programming and the JTAG interfaces each on a 2.54 mm and a 1.27 mm header, an extension connector, **PWR SEL** jumpers for 3.3 V or 5 V, and a red, green and blue status LED. It is a tool, not a target board.

You meet the adapters on other boards too: the ESP32-P4-Function-EV-Board has a connector for an ESP-Prog to program its C6 radio module.

### The pins, and a trap

On a chip with built-in USB the JTAG pins stay free for your use. Without it, the JTAG pins are real GPIOs wired to the adapter: on the **ESP32** they are GPIO12 (TDI), GPIO13 (TCK), GPIO14 (TMS) and GPIO15 (TDO). Two of those are [[strapping-pins|strapping pins]]. GPIO12 chooses the flash voltage, so an adapter that holds TDI high while the chip resets could make a 3.3 V flash unreadable; GPIO15 controls the boot messages. The simulation shows the pad pins of each chip and what the datasheet says about each.

### Using one safely

- Set **PWR SEL** (or the equivalent) to the target's voltage. Never power the same 3.3 V rail from the adapter and from the board's own USB at once.
- Keep the wires short: JTAG is a fast clocked bus.
- A product can **disable** JTAG with an eFuse; do so before shipping ([[disabling-debug-interfaces]]), and expect that board to be unreachable by debugger afterwards.

> [!key] A debug adapter gives a program and a debug path: serial plus EN and boot control for uploads, JTAG for stopping and stepping. Newer chips carry it inside their USB; the classic ESP32 needs an FT2232 board or an ESP-Prog, and its JTAG pins include the GPIO12 strapping pin.`,
  ideas: [
    'A debugger lets you stop the chip, step through the program and read memory; JTAG with OpenOCD and GDB provides it.',
    'The ESP32-S3, C3, C6, C5, C61, H2 and P4 have JTAG built into their USB, so they need no adapter.',
    'The classic ESP32 and S2 need an adapter: an FT2232-based board, an ESP-Prog or an ESP-Prog-2.',
    'On the ESP32 the JTAG pins are GPIO12, 13, 14 and 15, and two of them are strapping pins.'
  ],
  pitfalls: [
    'Every ESP32 can be debugged over its USB cable — Only the chips with the USB Serial/JTAG block can. The classic ESP32 and the S2 need an adapter.',
    'JTAG pins are special pins that no program can use — On the pad-JTAG chips they are normal GPIOs when the debugger is not used; they only have to be left alone while debugging.',
    'The adapter is just a cable — It has a supply selector and its own logic levels. A wrong PWR SEL setting, or two supplies on one rail, can damage the board.'
  ],
  terms: [
    { term: 'JTAG', also: ['IEEE 1149.1', 'TMS TCK TDI TDO'], def: 'A four-signal debug and test interface: test mode select, clock, data in and data out. A debugger uses it to halt the processor, set breakpoints and read and write memory.' },
    { term: 'OpenOCD', also: ['Open On-Chip Debugger'], def: 'A program that runs on the computer, talks to the JTAG adapter and offers a connection that GDB can use to debug the chip.' },
    { term: 'Debug adapter', also: ['programmer', 'ESP-Prog', 'probe'], def: 'The hardware that joins the computer to the chip\'s serial and JTAG pins: it uploads firmware and carries debugger traffic.' },
    { term: 'Breakpoint', also: ['watchpoint'], def: 'A place in the program where the debugger stops the chip, so that you can look at variables and step on, line by line. A watchpoint stops when a chosen memory address is read or written.' }
  ],
  choose: {
    good: ['Built-in USB debugging for the S3, C3, C6 and the newer chips: no extra hardware', 'An FT2232 board or an ESP-Prog for the classic ESP32 and the S2', 'An ESP-Prog-2 as a bench tool for programming and debugging several boards'],
    avoid: ['Debugging a chip that sleeps over its own USB: the USB stops in sleep', 'Leaving JTAG enabled in a shipped product', 'Wiring an adapter to the ESP32\'s GPIO12 without checking that it does not drive it high at reset'],
    check: ['The adapter\'s supply setting against the target\'s voltage', 'Which pins carry JTAG on your chip, in the pinout explorer', 'That the debug interface is not disabled by an eFuse on the board you hold']
  },
  quiz: [
    { q: 'Which chip can be debugged over its ordinary USB cable with no adapter?', choices: ['ESP32', 'ESP32-S2', 'ESP32-C3', 'ESP8266'], a: 2, why: 'The C3 has a USB Serial/JTAG block that provides both a serial port and a JTAG debugger. The classic ESP32 and the S2 do not.' },
    { q: 'Why is the ESP32\'s JTAG pin GPIO12 awkward?', choices: ['It is input only', 'It is the flash-voltage strapping pin: high at reset selects 1.8 V', 'It carries the UART', 'It is used for the antenna'], a: 1, why: 'GPIO12 (MTDI) is a strapping pin. If the adapter drives it high at reset, a 3.3 V flash cannot be read.' },
    { q: 'Which tool runs on the computer and connects GDB to the JTAG adapter?', choices: ['esptool', 'OpenOCD', 'Thonny', 'ESP-NOW'], a: 1, why: 'OpenOCD speaks JTAG to the adapter and gives GDB a server to connect to.' },
    { q: 'A chip in deep sleep can still be debugged over its built-in USB.', a: false, why: 'The USB block stops in light and deep sleep, so the debugger loses the chip. Debug sleep behaviour with an external adapter or with logging.' }
  ],
  applications: [
    'Finding a crash in an interrupt or a task that print statements cannot show.',
    'Programming bare boards in production through test pads with an ESP-Prog-style adapter.',
    'Debugging the classic ESP32 on the ESP-WROVER-KIT, which has the adapter built in.',
    'Reading and writing memory on a hung device to see why it stopped.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "JTAG Debugging": the adapter options, OpenOCD and GDB.',
    'Espressif, user guides of the ESP-Prog-2 and the ESP-WROVER-KIT in the esp-dev-kits documentation.',
    'Espressif, datasheets of the ESP32 and the ESP32-S3: the JTAG pin tables and the strapping pins.'
  ],
  sim: { id: 'dk-jtag-pins', params: {} }
}
);
