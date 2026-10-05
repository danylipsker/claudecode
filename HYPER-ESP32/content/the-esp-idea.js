/* HYPER-ESP32 · content/the-esp-idea.js
 *
 * Topic "Microcontrollers and the ESP idea" (branch: The ESP Family). The opening pages of the app:
 *   what-a-microcontroller-is · why-the-esp32-took-over · chip-module-board · espressif-and-its-history
 *   reading-the-family-names · xtensa-and-risc-v · how-to-read-a-datasheet · esp-versus-other-microcontrollers
 *   choosing-a-chip · product-lifecycle-and-longevity · the-open-ecosystem
 * Simulations: sims/the-esp-idea.js (ids start with "ei-").
 */
Hyper.add(
/* ================================================================ 1 */
{
  id: 'what-a-microcontroller-is',
  parent: 'the-esp-idea',
  title: 'What a microcontroller is',
  level: 1,
  short: 'A whole small computer on one chip: a processor, memory and a set of ready-made circuits for working the pins. It runs one program from the moment power arrives, and its job is to sense, decide and act.',
  keywords: ['microcontroller', 'MCU', 'embedded system', 'processor', 'CPU', 'RAM', 'flash', 'peripheral', 'firmware', 'clock', 'pins', 'GPIO', 'single-board computer', 'Raspberry Pi difference', 'real time'],
  prereq: ['electronics:logic-basics', 'electronics:voltage'],
  related: ['why-the-esp32-took-over', 'chip-module-board', 'peripherals-overview', 'cpu-cores-and-clocks', 'memory-map', 'first-program-blink', 'electronics:microcontrollers'],
  body: `A microcontroller is a complete little computer squeezed onto one piece of silicon, built for one kind of job: watch some wires, make a decision, drive some other wires. A laptop spreads its ingredients over a whole board, with a separate chip behind each port. A microcontroller keeps them all inside one package a few millimetres across, with the pins you solder to along its edge. Give it power and a few milliseconds later it starts running the one program stored in it, for as long as the power lasts. There is no login, no desktop and no shutting down.

### What is inside

- **A processor** (the CPU) that carries out instructions one after another, paced by a clock that ticks millions of times a second.
- **Two kinds of memory.** [[memory-map|RAM]] is fast working space for variables, and it forgets everything when the power goes. **Flash** keeps the program (and any settings) with the power off, but is slow to write and wears out if rewritten too often.
- **Peripherals**: small dedicated circuits beside the processor, each good at one job: reading or driving a pin, converting a voltage to a number, counting pulses, making a steady PWM wave, speaking a serial protocol such as UART, I2C or SPI. Hand a peripheral its job and it carries on by itself while the processor does something else. [[peripherals-overview]] maps them all.
- **Pins** that tie the silicon to the outside world. Everything useful about a microcontroller happens at its pins.

### Sense, decide, act

Every microcontroller program, however large, is built on one rhythm. It *senses* (a pin goes low because a button was pressed, a converter reports 1.2 V from a sensor), it *decides* (compare, count, remember, follow a rule) and it *acts* (switch a pin, send a byte, start a motor). Then it goes round again, thousands of times a second. The simulation below lights each part of the chip as a small program touches it.

### Not a small PC

A microcontroller trades size for predictability. It has kilobytes to a few megabytes of memory where a computer has gigabytes. But it starts in milliseconds, it can sleep on microamps, and when a pin must change within microseconds of an event, nothing else is scheduled in the way. A Linux board such as a Raspberry Pi is the opposite: far more computing, a slow start, and no promise that it is free at the instant your signal arrives. Many products use both.

### How fast is "fast"?

A chip at 240 MHz ticks 240 million times a second, about 4.2 ns a tick. A button press lasts perhaps 50 ms, twelve million ticks. One character at 115200 baud takes 87 µs, about 21,000 ticks. Against the outside world a microcontroller is extremely fast and mostly waiting, which is why it can [[deep-sleep|sleep]] most of the day and still do its job.

> [!key] A microcontroller is a processor, memory and ready-made peripherals on one chip, running one program from power-up: sense, decide, act. It is fast compared with the world around it and small compared with a computer, and its pins are what make it useful.`,
  ideas: [
    'A microcontroller puts the processor, the memory and the circuits for talking to pins on a single chip, so that one part can run a whole device.',
    'RAM holds variables and is lost without power; flash holds the program and keeps it.',
    'Peripherals do their jobs beside the processor, which is why a chip can count pulses, make PWM and talk serial all at once.',
    'Every program is a loop of sensing, deciding and acting; the chip is idle most of the time, and that idle time is what sleep modes save.'
  ],
  pitfalls: [
    'A microcontroller is just a slow computer — Against a phone processor it is slow, but against the world it is fast: 240 million ticks a second is millions of steps between two key presses. What it gives up in raw power it gains in timing you can predict.',
    'The program is kept in RAM — Variables live in RAM and vanish at power-off. The program itself is stored in flash and survives, which is why the device starts again by itself.',
    'More megahertz means a better microcontroller — The clock is one number. How much the peripherals do without the processor, how much memory there is, and what it draws asleep decide most projects.'
  ],
  terms: [
    { term: 'Microcontroller', also: ['MCU', 'µC', 'microcontroller unit'], def: 'A single chip that holds a processor, memory and peripherals, and runs one program from power-up to control something in the physical world.' },
    { term: 'Peripheral', also: ['on-chip peripheral', 'hardware block'], def: 'A circuit inside the chip, apart from the processor, that does one job by itself: reading a pin, converting a voltage, counting pulses, generating PWM or speaking a serial protocol.' },
    { term: 'Firmware', also: ['embedded software', 'the program'], def: 'The program stored in a device\'s flash memory. It is called firmware because it lives in the product rather than on a computer you operate.' },
    { term: 'Clock frequency', also: ['clock speed', 'CPU frequency', 'MHz'], def: 'How many times a second the processor\'s clock ticks, which sets the pace at which instructions are carried out. The original ESP32 runs at up to 240 MHz.' },
    { term: 'Embedded system', also: ['embedded device'], def: 'A computer built into a product to do one job (a thermostat, a washing machine, a smart plug), not used as a general computer.' }
  ],
  formulas: [
    {
      name: 'Clock cycles between two events',
      expr: 'N = f*t',
      tex: 'N = f \\, t',
      vars: {
        N: { name: 'clock cycles available', q: 'count' },
        f: { name: 'clock frequency', q: 'frequency', unit: 'MHz', value: 240 },
        t: { name: 'time between the events', q: 'time', unit: 'ms', value: 1 }
      },
      solveFor: 'N',
      note: 'An upper bound on the work the processor can do between two events. One instruction usually takes one or a few cycles, so the real number of instructions is smaller; memory waits and interrupts cost more.',
      stories: { N: 'A chip runs at {f}. How many clock cycles pass in {t}?' }
    }
  ],
  examples: [
    {
      title: 'How much waiting is that?',
      q: 'A sketch runs on an ESP32 at 240 MHz. A button press lasts about 50 ms. How many clock cycles go by during one press, and what does that say about a 20 ms pause in the loop?',
      steps: ['The cycles in a time are the frequency times the time: $N = 240\\,000\\,000 \\times 0.050 = 12\\,000\\,000$.', 'A 20 ms pause is $240\\,000\\,000 \\times 0.020 = 4\\,800\\,000$ cycles, spent doing nothing.', 'The pause is short enough to catch every press (50 ms is longer than 20 ms), but millions of possible steps are thrown away each time round.'],
      a: 'About twelve million cycles per press. A short pause costs nothing the reader of a button will notice, and costs millions of cycles the program could have used.'
    }
  ],
  quiz: [
    { q: 'Which part of a microcontroller keeps your program when the power is switched off?', choices: ['RAM', 'The flash memory', 'The peripherals', 'The clock'], a: 1, why: 'Flash is non-volatile: it holds the program and settings without power. RAM holds variables only while powered, and the peripherals and the clock store nothing.' },
    { q: 'A character arrives over a 115200-baud serial line every 87 µs. About how many cycles does a 240 MHz processor have between two characters?', choices: ['About 240', 'About 2,100', 'About 21,000', 'About 21 million'], a: 2, why: 'The cycles are the frequency times the time: 240 000 000 × 0.000087 ≈ 20,900. The processor is far faster than the line, which is why it can do other work between bytes.' },
    { q: 'A microcontroller can only do one thing at a time, because it has only one processor.', a: false, why: 'Peripherals work beside the processor: a timer counts, a serial port shifts bits out and a converter measures while the program does something else. Many ESP32 chips also have two cores, and a small operating system shares the time between tasks.' },
    { q: 'A product must switch a valve within 100 µs of a sensor pulse, every time. Why is a microcontroller a better fit than a small Linux computer?', choices: ['It is faster at arithmetic', 'Its timing is predictable: nothing else can be scheduled ahead of the response', 'It has more memory', 'A Linux board cannot read pins'], a: 1, why: 'A Linux board has more computing power, but its scheduler may be busy with something else when the pulse arrives. A microcontroller can be made to answer within a bounded, repeatable time.' }
  ],
  applications: [
    'The controller inside a washing machine, a microwave oven, a toothbrush or a car window: one chip running one program for years.',
    'Thermostats, smart plugs, doorbells and sensors that report over Wi-Fi, where the microcontroller also carries the radio.',
    'The mainboard of a 3-D printer, which times the stepper pulses while heaters and sensors are watched.',
    'Hobby boards such as the Arduino Uno, the Raspberry Pi Pico and the ESP32 DevKit, where these ideas are first learned.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: the sections that list the processor, the memory and the peripherals of one chip.',
    'Espressif, *ESP32 Technical Reference Manual*: the chapters on the processors, the memories and every peripheral.',
    'Espressif, *ESP-IDF Programming Guide*, API reference for peripherals: one page for each peripheral a driver exists for.'
  ],
  code: [
    {
      title: 'Sense, decide, act',
      about: 'Counts button presses. The pin is **sensed**, a variable in RAM is **updated** by a rule (only the moment of pressing counts), and the LED pin and the serial port **act**. Everything a microcontroller does is a bigger version of this loop.',
      needs: 'An ESP32 DevKit, a push button and an LED with a 220 Ω resistor.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO18', '220 Ω → LED → GND', 'the long leg of the LED towards the resistor']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [input with pull-up v]
          set pin (18) as [output v]
          set [count v] to (0)
          set [was_down v] to <false>
        forever
          set [down v] to <(read pin (4)) = [LOW v]>     // sense: pressed pulls the pin to ground
          if <<down> and <not <was_down>>> then          // decide: only the moment of pressing counts
            change [count v] by (1)
            print (join [Pressed: ] (count))
          end
          set pin (18) to (down)                         // act
          set [was_down v] to (down)
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;                  // push button to GND
        const int LED = 18;                    // LED and 220 ohm resistor to GND
        int count = 0;                         // lives in RAM
        bool was_down = false;

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);       // a pin we listen to
          pinMode(LED, OUTPUT);                // a pin we drive
        }

        void loop() {
          bool down = digitalRead(BUTTON) == LOW;   // sense: pressed pulls the pin to ground
          if (down && !was_down) {                  // decide: only the moment of pressing counts
            count++;
            Serial.printf("Pressed: %d\n", count);
          }
          digitalWrite(LED, down);                  // act
          was_down = down;
          delay(20);                                // a short pause that also hides most contact bounce
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        button = Pin(4, Pin.IN, Pin.PULL_UP)   # a pin we listen to
        led = Pin(18, Pin.OUT)                 # a pin we drive
        count = 0                              # lives in RAM
        was_down = False

        while True:
            down = button.value() == 0         # sense: pressed pulls the pin to ground
            if down and not was_down:          # decide: only the moment of pressing counts
                count += 1
                print("Pressed:", count)
            led.value(down)                    # act
            was_down = down
            time.sleep_ms(20)                  # a short pause that also hides most contact bounce
      `,
      output: `
        Pressed: 1
        Pressed: 2
        Pressed: 3
      `,
      notes: ['A real button needs proper [[debouncing]]: the short pause only hides the worst of the bounce.', 'GPIO4 and GPIO18 are free, ordinary pins on a classic ESP32 DevKit; on other chips check your board\'s pinout first.']
    }
  ],
  sim: 'ei-inside-mcu'
},

/* ================================================================ 2 */
{
  id: 'why-the-esp32-took-over',
  parent: 'the-esp-idea',
  title: 'Why the ESP32 took over',
  level: 1,
  short: 'Wi-Fi and Bluetooth on the same chip as the processor, at a price makers could not ignore, on certified modules anyone can buy, with open tools and a community that wrote the rest. No single feature did it; the combination did.',
  keywords: ['why ESP32', 'popular', 'ESP8266', 'Wi-Fi chip', 'maker', 'IoT', 'Arduino', 'cheap', 'module', 'AT commands', 'open source', 'community', 'smart home'],
  prereq: ['what-a-microcontroller-is'],
  related: ['espressif-and-its-history', 'chip-module-board', 'the-open-ecosystem', 'esp-versus-other-microcontrollers', 'wifi-station', 'module-certification'],
  body: `Before the ESP8266 appeared, giving a small device a network connection was a project in itself. You bought a microcontroller, then a separate Wi-Fi module with its own firmware, then wired the two together and talked to the module in short text commands (the so-called **AT commands**). Two parts, two sets of software, a lot of wire. The ESP chips changed that by putting the radio and a programmable processor in one place, and by letting anybody run their own program on it.

### The reasons, one by one

- **The radio is on the chip.** Nothing separate to buy, power or wire: a 3.3 V supply, an antenna and you have Wi-Fi. Nearly every chip of the family has Wi-Fi; the exceptions are the H series (Bluetooth LE and 802.15.4 only) and the ESP32-P4 (no radio at all).
- **There is enough computer.** The classic 8-bit Arduino Uno has 2 KB of RAM and runs at 16 MHz. The ESP32 has two cores at up to 240 MHz and 520 KB of RAM, the ESP32-C3 one core at 160 MHz and 400 KB, and even the old ESP8266 had 160 KB at 160 MHz (all figures from the chip catalogue). That is room for a web server, a secure connection and a program as well.
- **It is cheap.** Among the least expensive ways to put a device on a network. Prices move, so no figure is given here, but a connected sensor stopped being a luxury.
- **It comes on modules and boards.** Espressif sells the chip already mounted with flash and an antenna on a small certified module ([[what-a-module-adds]]), and board makers add a USB socket and pin headers ([[chip-module-board]]). A first project is "plug it in".
- **The tools are open.** The Arduino core, Espressif's own ESP-IDF, MicroPython, ESPHome and more all work on Windows, macOS and Linux, and most are free to use and modify ([[the-open-ecosystem]]).
- **The family stayed compatible.** The ideas, and often the code, carry from chip to chip, from the ESP8266 to a dual-core ESP32-S3 or a RISC-V ESP32-C6.

### What it costs you

A radio is power-hungry: the ESP32 draws about 100 mA receiving and up to 240 mA transmitting, so a battery product must sleep most of the time ([[deep-sleep]]). The analogue-to-digital converter is modest ([[the-esp-adc]]). Wi-Fi and Bluetooth share one radio and take turns. Security is available but is something you must switch on ([[secure-boot]], [[flash-encryption]]). And because the chips are everywhere, so are poor clones of boards ([[clones-and-counterfeits]]).

> [!key] The ESP chips won because one cheap part gave makers a processor, Wi-Fi and Bluetooth together, sold on ready-made modules and boards with open tools. It does not do everything best, but it does the thing most projects now need.`,
  ideas: [
    'Before the ESP8266, a network connection meant a separate Wi-Fi module and a second set of software.',
    'The family joins a processor and a radio on one chip, so the only extra parts are a supply and an antenna.',
    'Certified modules, USB boards and open tools made a first project a matter of plugging in.',
    'The costs are real: radio current peaks, a modest ADC, one radio shared by several protocols and security that must be switched on.'
  ],
  pitfalls: [
    'The ESP32 is popular because it is the most powerful microcontroller — It is not; plenty of microcontrollers are faster, lower in power or better in industrial peripherals. It is popular for the combination of radio, price, modules and tools.',
    'Every ESP has Wi-Fi — The H-series chips (ESP32-H2, H4, H21) have no Wi-Fi, only Bluetooth LE and 802.15.4, and the ESP32-P4 has no radio at all. Check the chip, not just the family name.',
    'A cheap connected device is secure because it uses a well-known chip — The chip offers the tools; the product must use them. A device with default passwords or unsigned updates is open however good the silicon.'
  ],
  terms: [
    { term: 'AT commands', also: ['Hayes commands', 'AT firmware'], def: 'Short text commands, each starting with AT, sent over a serial line to a separate Wi-Fi or modem module that does the networking for a host microcontroller. An ESP can run such firmware ([[esp-at-and-esp-hosted]]), but most projects run their own program on it instead.' },
    { term: 'Internet of Things', also: ['IoT', 'connected device'], def: 'Everyday objects and sensors that carry a small computer and a network connection, so that they report what they measure or can be controlled from afar.' },
    { term: 'Open source', also: ['open-source software'], def: 'Software whose source code is published under a licence that lets anyone read, change and share it. Most ESP software (ESP-IDF, the Arduino core, MicroPython) is open source, under licences with different conditions ([[open-source-licences]]).' }
  ],
  examples: [
    {
      title: 'Parts for a Wi-Fi sensor, before and after',
      q: 'List what a Wi-Fi temperature sensor needs with an 8-bit board and a separate Wi-Fi module, and what it needs on an ESP32.',
      steps: ['With a separate module: a microcontroller board, a Wi-Fi module, a level or supply adaptation if their voltages differ, the wires between them, and two programs (one for each part, plus the AT-command conversation).', 'On an ESP32: the board (the chip, flash, antenna and USB are already on it) and the sensor. One program does both the reading and the networking.'],
      a: 'Two programmed parts and a wiring job become one board and one program, which is much of why the family spread.'
    }
  ],
  quiz: [
    { q: 'What was the practical change that the ESP8266 brought to makers?', choices: ['The fastest processor of its time', 'A Wi-Fi radio on a cheap chip that anyone could program directly', 'Bluetooth audio', 'Built-in USB'], a: 1, why: 'Wi-Fi modules existed before, but they were driven from a separate microcontroller by text commands. The ESP8266 let the program run on the module\'s own processor, so one cheap part did both jobs.' },
    { q: 'An ESP32 can join a Wi-Fi network with no extra radio hardware beyond an antenna.', a: true, why: 'The radio is inside the chip. A module or board supplies the antenna, and the program supplies the network name and password.' },
    { q: 'Why does building a product on a certified module make it easier to bring to market?', choices: ['The module is faster than the bare chip', 'The module\'s radio has already passed the tests, so those tests need not be repeated in full for your product', 'A module needs no antenna', 'Modules are exempt from radio law'], a: 1, why: 'The module\'s maker did the radio testing. Your product must still meet the rules as a whole, and changing the antenna of the module can void its approval, but the hardest part is already done.' },
    { q: 'Which is a genuine drawback of the ESP32 for a product that must run for a year on a small battery?', choices: ['It has no sleep mode', 'The radio draws a large current while it transmits, so it must sleep nearly all the time', 'It cannot be programmed in C++', 'It has no memory'], a: 1, why: 'The chip does have deep sleep (microamps), but the original ESP32 draws 240 mA while transmitting. A battery design lives on a short wake-up and a long sleep.' }
  ],
  choose: {
    good: ['A device that must reach a network, a phone or a home-automation system without a separate radio', 'A prototype that may later become a product on the same chip through a certified module', 'A project where examples, libraries and answers from other makers matter'],
    avoid: ['A design that must run for years on a coin cell with almost no sleep budget: look at the low-power parts of the family and at dedicated Bluetooth chips', 'Safety-critical control with hard timing guarantees and a certified processor', 'A task that needs several analogue measurements of laboratory quality'],
    check: ['Which radios your project needs, and which chip has exactly those', 'The current the radio draws while transmitting, and whether your supply can give it', 'How your product will be updated and kept secure for its whole life']
  },
  code: [
    {
      title: 'A Wi-Fi connection in a dozen lines',
      about: 'The whole point of the family, in one small program: join your Wi-Fi network and report the address and signal strength. No extra hardware is involved beyond the board itself.',
      needs: 'Any ESP32-family board with Wi-Fi (not an H-series chip or the ESP32-P4) and a 2.4 GHz Wi-Fi network.',
      wiring: [['USB', 'computer', 'for power and the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          set [t0 v] to (milliseconds since start)
          repeat until <<Wi-Fi connected?> or <((milliseconds since start) - (t0)) > (15000)>>
            wait (0.25) seconds
            print [.]
          end
          if <Wi-Fi connected?> then
            print (join [connected, IP ] (IP address))
            print (join [signal, dBm: ] (signal strength))
          else
            print [no connection]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";          // never leave real credentials in code you share
        const char *PASS = "your-password";

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);                   // act as a station: join an existing network
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) {
            delay(250);
            Serial.print('.');
          }
          if (WiFi.status() == WL_CONNECTED) {
            Serial.printf("\nconnected, IP %s, signal %d dBm\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());
          } else {
            Serial.println("\nno connection");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time

        wlan = network.WLAN(network.WLAN.IF_STA)     # act as a station: join an existing network
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")   # never leave real credentials in code you share
        t0 = time.ticks_ms()
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 15000:
            time.sleep_ms(250)
            print(".", end="")
        if wlan.isconnected():
            print("\nconnected, IP %s, signal %d dBm" % (wlan.ipconfig("addr4")[0], wlan.status("rssi")))
        else:
            print("\nno connection")
      `,
      output: `
        .....
        connected, IP 192.168.1.42, signal -58 dBm
      `,
      notes: ['Credentials in source code end up in backups and repositories: see [[credentials-handling]] for where they should live.', 'The chip joins only 2.4 GHz networks, except the ESP32-C5, which also joins 5 GHz.']
    }
  ],
  applications: [
    'Smart plugs, bulbs and sensors sold under many brand names have an ESP chip inside ([[shelly-sonoff-and-smart-plugs]]).',
    'Weather stations, robots and 3-D printer add-ons built by makers who needed only Wi-Fi and a few pins.',
    'Classrooms that build a connected sensor in an afternoon, because the board, the cable and the free tools are all there is.',
    'Prototypes that become products: the same chip on a certified module goes from a workshop into a box.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* and *ESP8266EX Datasheet*: the feature lists and the memory and clock figures.',
    'Arduino core for ESP32 documentation: *Getting Started* and the WiFi library reference (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*: the network section (version 1.29).'
  ]
},

/* ================================================================ 3 */
{
  id: 'chip-module-board',
  parent: 'the-esp-idea',
  title: 'Chip, module, board: three things called "an ESP32"',
  level: 1,
  short: 'People say "an ESP32" for three different objects: a silicon chip, a module that adds flash, a crystal and an antenna under a metal can, and a development board that adds a USB socket, a regulator and pins you can reach.',
  keywords: ['chip', 'module', 'board', 'development board', 'DevKit', 'WROOM', 'system on chip', 'SoC', 'QFN', 'castellated', 'certified module', 'bare chip', 'which ESP32 do I have'],
  prereq: ['what-a-microcontroller-is', 'why-the-esp32-took-over'],
  related: ['what-a-module-adds', 'wroom-wrover-mini-pico', 'anatomy-of-a-dev-board', 'designing-with-the-bare-chip', 'reading-the-family-names', 'choosing-a-board'],
  body: `"I bought an ESP32" can mean three different things, and mixing them up causes most beginner confusion. They nest like layers: the chip is at the centre, the module is the chip made ready to build in, and the board is the module made ready to plug in.

### The chip

The **chip** (system-on-chip, SoC) is the silicon itself in a package a few millimetres wide: the ESP32 in a 5 × 5 mm QFN48, the ESP32-S3 in a 7 × 7 mm QFN56 (from the catalogue). It holds the processors, the memory, the peripherals and the radio, but not everything needed to run them. A bare chip still wants a 40 MHz crystal, usually an external flash chip for the program (a few chips have flash inside the package), the small parts that tune the radio, and an antenna. Designing that is a skilled job, and the finished product must be tested as a radio.

### The module

A **module** is a small printed board carrying the chip *and* the parts it needs: the flash memory, sometimes PSRAM, the crystal, the radio matching network and the antenna, all under a metal shield. The ESP32-WROOM-32E, for example, is 18 × 25.5 × 3.1 mm with 38 pads. It is made to be soldered flat onto your own board, and it has already passed radio testing, which is why products are built on modules ([[module-certification]]). Names such as WROOM, WROVER and MINI say which family the module belongs to ([[wroom-wrover-mini-pico]]).

### The board

A **development board** puts a module on a larger board with what a person needs to use it: a USB socket (and, on many boards, a USB-to-serial chip so the computer can talk to it), a 3.3 V regulator that makes the supply from USB's 5 V, EN and BOOT buttons, a power LED, and the pins brought out to headers you can push a wire into. The ESP32-DevKitC V4 is a module on a 27.9 × 54.4 mm board; the Seeed XIAO ESP32C3 is a chip with its flash on a thumb-sized board of 17.8 × 21 mm whose USB goes straight to the chip. The board catalogue lists 583 boards from 17 makers, most of them one of a dozen chips on a different carrier.

### Why it matters

| You want | You hold | Because |
|---|---|---|
| To learn, or build one or a few | a board | USB, power and pins are done |
| A product in small or medium numbers | a module on your own board | the radio is already certified |
| A very large run | the bare chip | the saving pays for the design and the radio approval |

Facts about the *chip* (its pins, its strapping rules, how many cores) follow it onto every module and board. Facts about the *board* (which pin has the LED, where the antenna is, whether the USB chip is there) do not: check the board's own page.

> [!key] The chip is the silicon, the module is the chip made ready to build into a product, the board is the module made ready to plug in. Choose by what you are making, and remember that the chip's limits come with every one of them.`,
  ideas: [
    'The chip is the silicon; it still needs flash, a crystal, radio matching and an antenna before it works.',
    'A module adds those parts under a shield and has passed radio testing, so it can be soldered into a product.',
    'A development board adds USB, a regulator, buttons and pin headers so that a person can use the module directly.',
    'Chip facts follow onto every module and board; board facts (LED pin, antenna, USB chip) belong to the board alone.'
  ],
  pitfalls: [
    'An "ESP32-S3 board" and the ESP32-S3 chip are the same thing — The board is a carrier for a module that holds the chip. The chip decides cores, radios and peripherals; the board decides USB, pin access, battery charging and size.',
    'A module is just a small board — A certified module carries a radio approval that a board of your own design does not, and that approval can be lost if the antenna or the shield is changed.',
    'The pins printed on the board are the pins of the chip — The board labels may be pin numbers of the connector, not GPIO numbers; and some chip pins (the flash pins) are not brought out at all.'
  ],
  terms: [
    { term: 'System on chip', also: ['SoC', 'chip'], def: 'A single chip that holds a processor, memory, peripherals and (in the ESP family) the radio. The ESP32-C3 and the ESP32-S3 are SoCs.' },
    { term: 'Module', also: ['radio module', 'SoM'], def: 'A small board with an ESP chip, its flash memory, a crystal, the radio matching and an antenna under a metal shield, made to be soldered onto a product board. Many modules carry a ready radio approval.' },
    { term: 'Development board', also: ['dev board', 'devkit', 'DevKit'], def: 'A module on a larger board with a USB socket, a regulator, buttons and pin headers, made for learning and prototyping.' },
    { term: 'QFN', also: ['quad flat no-lead'], def: 'A chip package with flat pads under and around its edges, no leads. Most ESP chips come in QFN packages 4 to 10 mm wide, which are soldered by machine.' },
    { term: 'Castellated pads', also: ['castellations', 'edge pads'], def: 'Half-round plated notches along a module\'s edge. They let the module be soldered flat onto another board, with the joint visible from the side.' }
  ],
  quiz: [
    { q: 'You buy an "ESP32-WROOM-32E". What is it?', choices: ['A bare chip', 'A module built around the ESP32 chip', 'A development board with USB', 'A programming adapter'], a: 1, why: 'WROOM names a module family. The chip inside is the ESP32. A board such as the ESP32-DevKitC then carries a WROOM module on a larger board with USB and pin headers.' },
    { q: 'A product will be made in a few hundred units and must pass radio approval quickly. What is the usual choice?', choices: ['A development board glued into the case', 'A certified module soldered to your own board', 'The bare chip with a hand-drawn antenna', 'A bare chip on a breadboard'], a: 1, why: 'The module\'s radio is already approved, so it saves the layout and the testing that a bare chip needs. A development board is not designed for products, and the bare chip pays off only in very large runs.' },
    { q: 'The pins of a board are the pins of the chip, one for one.', a: false, why: 'A module and a board bring out only some pins (the flash pins are used inside), and board labels can follow the connector rather than the GPIO numbers. Use the board\'s pinout, then the chip\'s rules.' },
    { q: 'Which fact is a property of the chip and will therefore be the same on every board that carries it?', choices: ['Which pin the LED is on', 'Whether the board has a USB-to-serial chip', 'How many CPU cores there are', 'Where the antenna sits'], a: 2, why: 'Cores, radios, peripherals and strapping rules belong to the chip. The LED, the USB chip and the antenna are decided by the board.' }
  ],
  choose: {
    good: ['Board: learning, experiments, a single device or a few, anything where USB and pin headers save time', 'Module: a product in small or medium numbers that needs a certified radio', 'Bare chip: very large volumes, with a team that can design and certify the radio part'],
    avoid: ['A development board inside a product you sell: its radio is not certified for your design, and its connectors and USB chip are not built for years of use', 'A bare chip for a first design: the radio layout is unforgiving', 'A module you cannot name: unmarked modules may carry relabelled chips'],
    check: ['The marking on the metal can (module name) and on the chip or board (the chip it really carries)', 'Whether the board has a USB-to-serial chip or uses the chip\'s own USB', 'How much flash and PSRAM the module has, which differs between versions of the same name']
  },
  code: [
    {
      title: 'What did I buy?',
      about: 'Prints what the running program can learn about the chip, the flash memory and the free memory. Compare it with the listing you bought from: a flash size that disagrees is the most common sign of a relabelled board.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Flash in MB: ] (flash size))
          print (join [Free memory in KB: ] (free memory))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                               // give the monitor time to open
          Serial.printf("Chip:   %s\n", ESP.getChipModel());         // the chip, not the board
          Serial.printf("Flash:  %lu MB\n", (unsigned long)(ESP.getFlashChipSize() / (1024 * 1024)));
          Serial.printf("Free:   %lu KB\n", (unsigned long)(ESP.getFreeHeap() / 1024));
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, gc, esp

        print("Chip:  ", sys.implementation._machine)               # board name, then "with" the chip
        print("Flash: ", esp.flash_size() // (1024 * 1024), "MB")
        print("Free:  ", gc.mem_free() // 1024, "KB")
      `,
      output: `
        Chip:   ESP32-S3
        Flash:  8 MB
        Free:   301 KB
      `,
      notes: ['The free-memory numbers differ between the languages because they count different heaps: MicroPython reports its own working heap, the Arduino call the whole system heap.', 'On a board with PSRAM, the Arduino call ESP.getPsramSize() reports its size; a size of 0 on a board sold "with PSRAM" means it is missing or turned off.', 'The Arduino call names the chip, which on the original ESP32 may be a package name such as ESP32-D0WD-V3; a MicroPython name starts with the board.']
    }
  ],
  applications: [
    'Reading a listing: "ESP32-WROOM-32E" names a module around the ESP32 chip, while "ESP32-DevKitC" names a board.',
    'Moving from a prototype board to a product: the same module goes onto your own printed board.',
    'Designing a thumb-sized sensor on a bare chip when millions will be made.',
    'Teaching: giving a class boards, so that the cable and the free tools are all they need.'
  ],
  sources: [
    'Espressif, *ESP32-WROOM-32E Datasheet*: the module and its dimensions, pins and flash options.',
    'Espressif, *ESP32-DevKitC V4 Getting Started Guide* and *User Guide*: what the board adds to the module.',
    'Espressif, *ESP32 Series Datasheet*: the packages of the chip.'
  ],
  sim: 'ei-chip-module-board'
},

/* ================================================================ 4 */
{
  id: 'espressif-and-its-history',
  parent: 'the-esp-idea',
  title: 'Espressif and the road from the ESP8266',
  level: 1,
  short: 'A chip company in Shanghai, the ESP8266 of 2014 that makers adopted through a tiny module, the ESP32 of 2016, the S, C, H and P series and the first RISC-V chip announced at the end of 2020. The history explains the names, the two Arduino cores and the old tutorials.',
  keywords: ['Espressif', 'history', 'ESP8266', 'ESP-01', 'NodeMCU', 'ESP32 release', 'RISC-V', 'timeline', 'ESP8684', 'not recommended for new designs', 'why so many chips', 'Shanghai'],
  prereq: ['why-the-esp32-took-over'],
  related: ['reading-the-family-names', 'xtensa-and-risc-v', 'product-lifecycle-and-longevity', 'soc-esp8266', 'soc-esp32', 'the-family-at-a-glance'],
  body: `Espressif Systems is a chip company based in Shanghai. The story of its microcontrollers is short, and it explains much of what you meet today: why old tutorials show a chip you should no longer choose, why there are two Arduino cores, and why the names carry so many letters.

### 2014: the ESP8266 and the ESP-01

The ESP8266 appeared in 2014 as a Wi-Fi chip meant to be added to other microcontrollers. It reached makers on a tiny module, the **ESP-01**, sold with firmware that took AT commands over a serial line. Makers soon saw that the chip had a 32-bit processor of its own and found ways to run their own programs on it. Early on, much of the software that made it usable was written by makers rather than by the company. Within a few years it sat alone in plugs, sensors and boards such as the NodeMCU ([[esp-01-and-esp-12]]).

### 2016: the ESP32

The ESP32 was released in 2016: two cores, far more memory, Bluetooth (Classic and Low Energy) beside Wi-Fi, touch inputs, converters and an Ethernet controller. It became the reference chip. Most tutorials, libraries and boards that exist today were first written for it.

### 2019 to 2021: the family branches

| Year | Chip | What was new |
|---|---|---|
| 2019 | ESP32-S2 | Built-in USB, Wi-Fi only, one core |
| 2020 | ESP32-S3 | Two cores with vector instructions for machine learning, Bluetooth LE 5 |
| 2020 | ESP32-C3 | Announced at the end of the year: the first RISC-V chip, small and cheap |
| 2021 | ESP32-C6, ESP32-H2 | Wi-Fi 6 and 802.15.4 (Zigbee, Thread); a chip with no Wi-Fi at all |

### 2022 to 2026: more radios, and chips with none

The ESP32-C2 (sold as the ESP8684) came in 2022, the radio-less ESP32-P4 in 2023, and the dual-band ESP32-C5 and the low-cost Wi-Fi 6 ESP32-C61 in 2025. The ESP32-S31, the H21 and the E22 co-processor belong to 2026, and the H4 is still in sampling. In November 2025 Espressif marked the ESP8266 *not recommended for new designs* and named the ESP32-C2 as its upgrade. (The years are those in the chip catalogue, dated October 2026: the year a chip appeared. Announcement, samples and mass production often lie a year apart.)

### What the pattern shows

- **One chip became a family of specialists:** one for USB and screens, one for cost, one for mesh radios, one for speed ([[reading-the-family-names]]).
- **Xtensa gave way to RISC-V** for most new designs ([[xtensa-and-risc-v]]).
- **Software trails the silicon.** A chip may be on sale a year before every library supports it ([[product-lifecycle-and-longevity]]).
- **The ideas stay compatible.** A blink sketch for an ESP8266 needs little change on a C6.

> [!key] The ESP8266 (2014) brought Wi-Fi to makers, the ESP32 (2016) made the family a standard, and the series that followed split it into specialists with RISC-V cores from the end of 2020. Dates matter: they tell you whether a tutorial, a library or a chip is still a good starting point.`,
  ideas: [
    'The ESP8266 appeared in 2014 and reached makers on the ESP-01 module; the ESP32 followed in 2016.',
    'The first RISC-V chip, the ESP32-C3, was announced at the end of 2020; since then most new chips have RISC-V cores.',
    'The family has split into series for USB and screens (S), low cost (C), no-Wi-Fi mesh radios (H) and speed without a radio (P).',
    'The ESP8266 has been marked not recommended for new designs since November 2025, with the ESP32-C2 as its successor.'
  ],
  pitfalls: [
    'The ESP8266 and the ESP32 are one chip at two prices — They are different chips with different processors, memory, tools and Arduino cores. Code and libraries do not carry over unchanged.',
    'A new chip is on sale as soon as it is announced — Announcement, engineering samples and mass production are separate stages, and software support often arrives later still. The ESP32-S31 is a case in point.',
    'An old tutorial is wrong because it is old — Many are still right in idea. Check the chip it names and the library versions: the code may use forms that newer cores have removed.'
  ],
  terms: [
    { term: 'Espressif Systems', also: ['Espressif'], def: 'The chip company, based in Shanghai, that designs the ESP8266, the ESP32 and the later chips, and publishes ESP-IDF, its own software framework.' },
    { term: 'ESP-01', also: ['ESP-01 module'], def: 'The tiny first module built around the ESP8266, with eight pins, a PCB antenna and AT-command firmware. Makers adopted it, and with it the chip.' },
    { term: 'ESP8684', also: ['ESP32-C2'], def: 'The sales name of the ESP32-C2: a small, low-cost RISC-V chip with Wi-Fi 4 and Bluetooth LE 5.3, named by Espressif as the upgrade from the ESP8266.' },
    { term: 'Product status', also: ['lifecycle stage', 'mass production', 'sampling'], def: 'Where a chip or module is in its life: announced, sampling, mass production, not recommended for new designs, end of life ([[product-lifecycle-and-longevity]]).' }
  ],
  quiz: [
    { q: 'Which chip did makers first adopt through a small module called the ESP-01?', choices: ['ESP32', 'ESP8266', 'ESP32-C3', 'ESP32-S2'], a: 1, why: 'The ESP-01 carried the ESP8266 and shipped with AT-command firmware. Makers then ran their own programs on the chip, which began the whole family\'s popularity.' },
    { q: 'Which statement about the ESP32-C3 is correct?', choices: ['It was the first chip of the family with Bluetooth', 'It was announced at the end of 2020 as Espressif\'s first RISC-V chip', 'It is the successor of the ESP32-P4', 'It has two Xtensa cores'], a: 1, why: 'The C3 is a single RISC-V core with Wi-Fi 4 and Bluetooth LE 5. Earlier chips used Xtensa cores.' },
    { q: 'The ESP8266 is still the recommended chip for new Wi-Fi designs from Espressif.', a: false, why: 'Since November 2025 it is marked not recommended for new designs, and Espressif points to the ESP32-C2 as the upgrade. Millions of devices and many tutorials still use it.' },
    { q: 'A chip appears in the catalogue with the status "sampling". What should a product designer conclude?', choices: ['It is ready for a volume product', 'Samples exist, but data and software may still change: watch it, do not design it in yet', 'It has been withdrawn', 'It works only on boards from Espressif'], a: 1, why: 'Sampling comes before mass production. The datasheet may be missing, and libraries may not support it yet.' }
  ],
  applications: [
    'Reading an old tutorial: the chip it names (ESP8266 or ESP32) tells you which Arduino core and which functions apply.',
    'Deciding whether to redesign a product that uses an ESP8266: the not-recommended status says to plan a move, for instance to the ESP32-C2 or the ESP32-C3.',
    'Judging a chip announcement: sampling is not mass production, and software support follows later.',
    'Understanding why a library lists "ESP32, S2, S3, C3" and not the newest chips.'
  ],
  sources: [
    'Espressif, *ESP8266EX Datasheet*: the first chip of the line.',
    'Espressif, the datasheets of the ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C6, ESP32-H2 and ESP32-P4: the introduction of each names what the chip is for.',
    'Espressif, *ESP Product Selector* and its product status notes: the stages of each chip.'
  ],
  sim: { id: 'ei-family-chart', params: { y: 'cpu', color: 'radio' } }
},

/* ================================================================ 5 */
{
  id: 'reading-the-family-names',
  parent: 'the-esp-idea',
  title: 'Reading the names: the S, C, H and P series',
  level: 1,
  short: 'The family has one brand and many letters. "ESP32" alone is the original chip; ESP32-S, -C, -H and -P are series; the digit after the letter is only a label inside the series. Learn the letters once and a listing tells you most of what you need.',
  keywords: ['ESP32-S3', 'ESP32-C3', 'ESP32-H2', 'ESP32-P4', 'series', 'names', 'S series', 'C series', 'H series', 'P series', 'ESP8684', 'which letter', 'naming scheme', 'chip target', 'ESP32-E22'],
  prereq: ['chip-module-board', 'espressif-and-its-history'],
  related: ['xtensa-and-risc-v', 'the-family-at-a-glance', 'choosing-a-chip', 'soc-esp32-c3', 'reading-a-module-part-number'],
  body: `A shop listing says "ESP32-S3", another "ESP32-C6", a third just "ESP32". The names look like a code, and they nearly are. Read from left to right, a chip name has a brand, usually a letter that names the **series**, and a number.

### The brand, the letter and the number

- **ESP32** is the brand of the whole line, and also the name of the first chip, which has no letter. So "an ESP32" can mean the original chip or any member of the family. The context decides ([[chip-module-board]]).
- **The letter** names a series. The letters are a loose grouping, not a specification, so read them as groups, not guarantees.
- **The digit** is a label inside the series. It is not a grade and not a strict order: the C6 reached customers before the C5, and a two-digit name such as C61 is simply another chip, a cost-reduced sibling of the C6.

### What the series are

| Series | Chips | Processor | Radios | In one line |
|---|---|---|---|---|
| (none) | ESP32 | Xtensa, 2 cores | Wi-Fi 4, Bluetooth Classic and LE | The original, still the best supported |
| S | S2, S3, S31 | S2 and S3 Xtensa; the new S31 RISC-V | S2 Wi-Fi only; S3 adds LE; S31 has them all | Performance and peripherals: USB, cameras, displays, AI |
| C | C2, C3, C5, C6, C61 | RISC-V, one core | Wi-Fi 4 or 6 and Bluetooth LE; C5 and C6 add 802.15.4 | Low cost and low power with Wi-Fi |
| H | H2, H4, H21 | RISC-V | Bluetooth LE and 802.15.4, no Wi-Fi | Mesh radios and tiny batteries |
| P | P4 | RISC-V, 2 cores at 400 MHz | none | Speed for screens and cameras, wireless from a companion chip |
| E | E22 | RISC-V | Wi-Fi 6E and Bluetooth | A connectivity co-processor for other processors, not a chip to program |

(Facts from the chip catalogue, October 2026.) Two more names to know: **ESP8266** is the older generation, no letter, and **ESP8684** is the sales name of the ESP32-C2.

### Exceptions to remember

- The letter does not give the processor type. S usually means Xtensa, but the S31 is RISC-V ([[xtensa-and-risc-v]]).
- The letter does not promise a radio: the P4 has none, and the H series have no Wi-Fi.
- The digit does not rank: a C6 is not "better" than a C3, only different, and it costs more.

### The name inside a program

A program is built for one **chip target**, named in lower case without the hyphens: "esp32", "esp32s3", "esp32c6". The tools you choose in [[arduino-ide-and-the-esp32-core]] set it, and the program below reads it back.

> [!key] The letter after "ESP32-" names a series: S for performance and peripherals, C for low-cost RISC-V with Wi-Fi, H for Bluetooth and 802.15.4 without Wi-Fi, P for speed with no radio. The digit only tells chips of one series apart; always look the exact chip up.`,
  ideas: [
    'A chip name is a brand, a series letter and a number: ESP32 + S + 3.',
    'The series letters group chips by purpose: S for performance and peripherals, C for low-cost RISC-V with Wi-Fi, H for Bluetooth and 802.15.4 without Wi-Fi, P for speed with no radio.',
    'The digit labels chips inside a series; it is not a grade and not strictly a release order.',
    'The letter does not guarantee a processor type or a radio: look the exact chip up.'
  ],
  pitfalls: [
    'A higher number is a better chip — The digit only separates chips of one series. The C6 is not simply better than the C3; it adds radios and costs more, and the C3 is the right answer for many projects.',
    'Every S chip is Xtensa and every C chip RISC-V — The rule fits the older chips, but the newest S-series chip, the ESP32-S31, is RISC-V. Check the catalogue entry.',
    '"ESP32" always means the original chip — Often it means the whole family. A library that says "supports ESP32" may mean the original chip only; look at which chips it lists.'
  ],
  terms: [
    { term: 'Chip series', also: ['series', 'S series', 'C series', 'H series', 'P series'], def: 'A group of chips named by the letter after ESP32-: S for performance and peripherals, C for low cost with Wi-Fi, H for Bluetooth LE and 802.15.4 without Wi-Fi, P for high performance with no radio.' },
    { term: 'Chip target', also: ['IDF target', 'target'], def: 'The chip a program is built for, written in lower case without hyphens, such as esp32, esp32s3 or esp32c6. A program built for one target does not run on another.' },
    { term: 'ESP32-E22', also: ['E22'], def: 'A connectivity co-processor with Wi-Fi 6E and Bluetooth for other processors to use. It is not a microcontroller for ordinary projects, and it was in sampling in October 2026.' }
  ],
  quiz: [
    { q: 'Which chip of the family has no radio at all?', choices: ['ESP32-H2', 'ESP32-P4', 'ESP32-C2', 'ESP32-S2'], a: 1, why: 'The P4 is a fast dual-core chip for screens and cameras. Wireless comes from a companion chip. The H2 has Bluetooth LE and 802.15.4, the C2 Wi-Fi and Bluetooth LE, the S2 Wi-Fi.' },
    { q: 'The ESP32-C5 was released after the ESP32-C6 although its number is smaller. What does the digit tell you?', choices: ['The release order', 'The chip\'s rank', 'Only a label that tells chips of one series apart', 'The number of cores'], a: 2, why: 'The digit is an identifier inside the series. It is not a grade and not a release order.' },
    { q: 'Every chip whose name starts with ESP32-S has an Xtensa core.', a: false, why: 'The S2 and S3 are Xtensa, but the ESP32-S31, introduced in 2026, is a RISC-V chip.' },
    { q: 'You need Zigbee on a coin cell and have no use for Wi-Fi. Which series fits best?', choices: ['S', 'C', 'H', 'P'], a: 2, why: 'The H series has 802.15.4 (Zigbee, Thread) and Bluetooth LE but no Wi-Fi. Without Wi-Fi the receive current is much lower: the catalogue gives 25 mA for the H2 against 82 mA for the C6.' }
  ],
  applications: [
    'Reading a shop listing or a board name to see at once which chip family it carries.',
    'Choosing the board in the Arduino IDE or the target in ESP-IDF, where the chip is named in lower case.',
    'Checking whether a library supports your chip: library pages list chips by these names.',
    'Understanding a message from the flashing tool, which names the chip it found.'
  ],
  sources: [
    'Espressif, *ESP Product Selector*: every chip with its series and features side by side.',
    'Espressif, *ESP-IDF Programming Guide*, "Get Started": the chip targets (esp32, esp32s3, esp32c6 …).',
    'Espressif, the datasheets of each series, whose first page names what the series is for.'
  ],
  code: [
    {
      title: 'Which series am I?',
      about: 'Reads the chip target the program was built for and prints its series, using the rules of this page. In C++ the target is fixed when the program is built; MicroPython asks the running firmware.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [chip v] to (chip target in lower case)         // for example esp32s3
          set [letter v] to (the character after [esp32] in (chip))
          print (join [Chip: ] (chip))
          if <(letter) = [s]> then
            print [S series: performance and peripherals]
          else if <(letter) = [c]> then
            print [C series: low cost, RISC-V, Wi-Fi]
          else if <(letter) = [h]> then
            print [H series: no Wi-Fi, 802.15.4 and Bluetooth LE]
          else if <(letter) = [p]> then
            print [P series: high performance, no radio]
          else
            print [the original ESP32]
          end
      `,
      cpp: String.raw`
        const char *describe(char letter) {
          switch (letter) {
            case 's': return "S series: performance and peripherals";
            case 'c': return "C series: low cost, RISC-V, Wi-Fi";
            case 'h': return "H series: no Wi-Fi, 802.15.4 and Bluetooth LE";
            case 'p': return "P series: high performance, no radio";
            default:  return "the original ESP32";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          const char *chip = CONFIG_IDF_TARGET;     // "esp32", "esp32s3", "esp32c6" ... fixed when built
          char letter = chip[5];                    // the character after "esp32"
          Serial.printf("Chip: %s\n", chip);
          Serial.println(describe(letter));
        }

        void loop() {}
      `,
      py: String.raw`
        import sys

        def describe(letter):
            names = {
                "s": "S series: performance and peripherals",
                "c": "C series: low cost, RISC-V, Wi-Fi",
                "h": "H series: no Wi-Fi, 802.15.4 and Bluetooth LE",
                "p": "P series: high performance, no radio",
            }
            return names.get(letter, "the original ESP32")

        # the board name, then "with" the chip: "ESP32S3 module with ESP32S3"
        chip = sys.implementation._machine.split(" with ")[-1].lower().replace("-", "").replace(" ", "")
        letter = chip[5:6]                          # the character after "esp32"
        print("Chip:", chip)
        print(describe(letter))
      `,
      output: `
        Chip: esp32s3
        S series: performance and peripherals
      `,
      notes: ['A vendor\'s board may name the chip in its own way; if the MicroPython line looks wrong, print sys.implementation._machine and read it.', 'The Arduino and MicroPython tools know only the chips they support: the ESP32-S31, H4 and H21 are not among them yet.']
    }
  ],
  sim: ['ei-name-decoder', { id: 'ei-family-chart', params: { y: 'ram', color: 'series' } }]
},

/* ================================================================ 6 */
{
  id: 'xtensa-and-risc-v',
  parent: 'the-esp-idea',
  title: 'Xtensa and RISC-V: the two processor lines',
  level: 2,
  short: 'Two processor designs run the family: Xtensa in the ESP32, S2 and S3, and RISC-V in the C, H and P series and the new S31. For the programmer the difference is nearly invisible. For the chip it changes licensing, tools and the future.',
  keywords: ['Xtensa', 'RISC-V', 'instruction set', 'architecture', 'LX6', 'LX7', 'RV32IMC', 'RV32IMAC', 'Tensilica', 'Cadence', 'FPU', 'compiler', 'toolchain', 'register dump'],
  prereq: ['what-a-microcontroller-is', 'reading-the-family-names'],
  related: ['cpu-cores-and-clocks', 'espressif-and-its-history', 'guru-meditation-and-backtraces', 'rtc-domain-and-lp-core', 'soc-esp32-c3', 'soc-esp32-s3'],
  body: `A processor understands only its own small vocabulary of instructions: add two registers, load a word from memory, jump if zero. That vocabulary is its **instruction set**. A compiler turns your C++ into the instructions of one set, so a program built for one kind of processor is noise to another. Two instruction sets run the ESP family.

### Xtensa

**Xtensa** comes from Tensilica, a company now owned by Cadence. Its distinguishing idea is that a customer can configure the core and add instructions of its own. The ESP8266 uses an Xtensa-family core (the catalogue calls it the L106), the original ESP32 uses two LX6 cores, and the ESP32-S2 and S3 use LX7 cores. The S3's vector instructions for machine learning are such an extension ([[soc-esp32-s3]]).

### RISC-V

**RISC-V** is an open instruction set: anyone may build a core for it without paying for the instruction set itself, and the specification is published. The ESP32-C3, announced at the end of 2020, was Espressif's first. Since then the C, H and P series and the S31 use RISC-V cores. The name after it says which variant: RV32IMC on the C3 and C2, RV32IMAC on the C6, C61 and H2. The letters list the ingredients: 32-bit, **I**nteger, **M**ultiply and divide, **A**tomic operations, **C**ompressed (short) instructions.

| Processor | Chips | Notes |
|---|---|---|
| Xtensa L106 | ESP8266 | 1 core, 160 MHz, no floating-point unit |
| Xtensa LX6 | ESP32 | 2 cores, 240 MHz, floating-point unit |
| Xtensa LX7 | ESP32-S2, S3 | S2: 1 core, no FPU; S3: 2 cores, FPU, vector instructions |
| RISC-V | C2, C3, C5, C6, C61, H2, H21 | 1 core, 96 to 240 MHz |
| RISC-V | H4, S31, P4 | 2 cores; the P4 runs at 400 MHz |

### What you notice, and what you do not

For almost all programs, nothing. The same source, the same Arduino calls and the same libraries work on both, and speed depends far more on clock, cores and memory than on the instruction set. You *do* notice it in four places: assembly code and libraries that contain it, the crash report (the register names differ), which tools support a chip, and the fact that a program must be built again for each chip, because a file made for an ESP32 means nothing to a C3.

Two surprises. The instruction set does not decide the number of cores: there are single-core Xtensa chips and dual-core RISC-V chips. And one chip can have both: the ESP32-S3's main cores are Xtensa, but its small ultra-low-power coprocessor is RISC-V ([[rtc-domain-and-lp-core]]).

### Floating point

Arithmetic on decimal numbers is fast only with a floating-point unit. The ESP32, S3, P4, H4 and S31 have one; the S2, the C-series chips and the H2 do not, so \`float\` maths is done in software, much more slowly. It rarely matters until you filter audio or run a model.

> [!key] Xtensa (ESP32, S2, S3) and RISC-V (C, H, P series, S31) are two instruction sets, so a program must be built for the chip it will run on. Your source code is the same either way; you meet the difference in crash dumps, assembly and tool support, and in whether the chip has a floating-point unit.`,
  ideas: [
    'An instruction set is the vocabulary of a processor; a compiled program works only on the instruction set it was built for.',
    'Xtensa is a configurable core licensed from Cadence: the ESP8266, the ESP32, the S2 and the S3 use it.',
    'RISC-V is an open instruction set: Espressif has used it since the C3 of 2020 for the C, H and P series and the S31.',
    'Source code is the same on both; the differences show in crash dumps, assembly code, tool support and the floating-point unit.'
  ],
  pitfalls: [
    'RISC-V chips are faster (or slower) than Xtensa chips — The instruction set does not set the speed. Clock, number of cores, memory and the floating-point unit do: the 160 MHz C3 is slower than a 240 MHz S3, and the 400 MHz RISC-V P4 is faster than both.',
    'I must rewrite my program for RISC-V — The source is the same. It must be built again for the new chip, which the tools do when you select the board, but code that contains assembly, or a library with hand-written assembly for one core, will not.',
    'A chip is either Xtensa or RISC-V — The ESP32-S3 has Xtensa main cores and a small RISC-V coprocessor. A chip can contain both.'
  ],
  terms: [
    { term: 'Instruction set', also: ['ISA', 'instruction set architecture', 'architecture'], def: 'The vocabulary of a processor: the instructions it can carry out and the registers it has. A program is compiled for one instruction set and runs on no other.' },
    { term: 'Xtensa', also: ['Tensilica Xtensa', 'LX6', 'LX7'], def: 'A configurable processor design from Tensilica (now Cadence). The ESP32 uses two LX6 cores and the ESP32-S2 and S3 use LX7 cores.' },
    { term: 'RV32IMAC', also: ['RV32IMC', 'RISC-V ISA string'], def: 'The name of a RISC-V variant: 32-bit, with the Integer base, Multiply and divide, Atomic and Compressed extensions. The ESP32-C6 is RV32IMAC and the C3 is RV32IMC (no atomics).' },
    { term: 'Floating-point unit', also: ['FPU', 'floating point'], def: 'Hardware that does arithmetic on decimal (float) numbers. Without it the compiler does the maths in software, which is much slower.' },
    { term: 'Toolchain', also: ['cross-compiler', 'compiler'], def: 'The programs that turn source code into a binary for a chip: compiler, assembler and linker. A chip needs a toolchain for its instruction set.' }
  ],
  quiz: [
    { q: 'A program built for the ESP32 (Xtensa) is copied onto an ESP32-C3 (RISC-V). Will it run?', choices: ['Yes, all ESP chips share their instructions', 'No: the instruction sets differ, so it must be built again for the C3', 'Yes, but more slowly', 'Only if it is written in MicroPython'], a: 1, why: 'Compiled code is instructions of one set. The same source builds for both chips, but the binary is different for each. (A MicroPython script is source, but it runs on a different firmware on each chip.)' },
    { q: 'Which statement is true of the ESP32-S3?', choices: ['It is a RISC-V chip', 'Its main cores are Xtensa, and it also has a small RISC-V coprocessor', 'It has only one core', 'It has no floating-point unit'], a: 1, why: 'Two Xtensa LX7 cores with an FPU and vector instructions, plus an ultra-low-power coprocessor that is RISC-V.' },
    { q: 'The instruction set decides how many cores a chip has.', a: false, why: 'Cores are a design choice. The ESP32 and S3 are dual-core Xtensa, the S2 single-core Xtensa, the C3 single-core RISC-V and the P4 dual-core RISC-V.' },
    { q: 'Where is the difference between Xtensa and RISC-V most likely to show in a project?', choices: ['In every if-statement', 'In a crash report, in hand-written assembly, and in which tools support the chip', 'In the Wi-Fi password length', 'In the numbering of the pins'], a: 1, why: 'Source code is the same, but a crash report lists registers by the names of the instruction set, and assembly is specific to it.' }
  ],
  applications: [
    'Reading a crash report: an Xtensa dump lists registers named PC and A0, a RISC-V dump MEPC and RA, and the debugging pages explain each ([[guru-meditation-and-backtraces]]).',
    'Choosing between the ESP32-S3 and a C-series chip for signal processing or machine learning, where the S3\'s vector instructions and FPU help.',
    'Porting a library that contains hand-written assembly: it must be rewritten or replaced for the other instruction set.',
    'Following the RISC-V ecosystem: open specifications mean many tools and several makers of cores.'
  ],
  sources: [
    'RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged ISA*: the base integer set and the M, A and C extensions.',
    'Cadence, *Xtensa Instruction Set Architecture (ISA) Reference Manual*.',
    'Espressif, *ESP32-C3 Technical Reference Manual*: the chapter on the RISC-V CPU; and the ESP32 Technical Reference Manual: the Xtensa cores.'
  ],
  code: [
    {
      title: 'The same source on two processors',
      about: 'Times a fixed amount of integer work and prints the chip and the result. The source is identical on every ESP chip, whatever its instruction set; the time is what changes with the clock, the core and the compiler.',
      needs: 'Any ESP32-family board (try an ESP32 or S3, and a C3 or C6) and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [t0 v] to (microseconds since start)
          set [sum v] to (0)
          set [i v] to (0)
          repeat (100000)
            change [i v] by (1)
            set [sum v] to ((((sum) * (31)) + (i)) mod (4294967296))     // keep to 32 bits
          end
          print (join [Chip: ] (chip model))
          print (join [100000 steps took ms: ] (((microseconds since start) - (t0)) / (1000)))
      `,
      cpp: String.raw`
        volatile uint32_t sink;                      // makes sure the compiler keeps the loop

        void setup() {
          Serial.begin(115200);
          delay(1000);
          uint32_t t0 = micros();
          uint32_t sum = 0;
          for (uint32_t i = 1; i <= 100000; i++) {
            sum = sum * 31 + i;                      // wraps at 32 bits
          }
          sink = sum;
          uint32_t us = micros() - t0;
          Serial.printf("Chip: %s at %lu MHz\n", ESP.getChipModel(), (unsigned long)ESP.getCpuFreqMHz());
          Serial.printf("100000 steps took %lu us\n", (unsigned long)us);
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, time, machine

        t0 = time.ticks_us()
        total = 0
        for i in range(1, 100001):
            total = (total * 31 + i) & 0xFFFFFFFF    # wraps at 32 bits
        us = time.ticks_diff(time.ticks_us(), t0)
        print("Chip:", sys.implementation._machine, "at", machine.freq() // 1_000_000, "MHz")
        print("100000 steps took", us, "us")
      `,
      output: `
        Chip: ESP32-C3 at 160 MHz
        100000 steps took 2600 us
      `,
      notes: ['The figure shown is illustrative; yours will differ.', 'The time depends on the chip, its clock, the compiler settings and, in MicroPython, on the interpreter, which is slower than compiled C++ by a large factor. Compare chips within one language, not across.', 'To learn the instruction set from C++, test the compiler\'s own macros: __XTENSA__ is defined when building for an Xtensa chip and __riscv for a RISC-V chip.']
    }
  ],
  sim: { id: 'ei-family-chart', params: { y: 'cpu', color: 'arch' } }
},

/* ================================================================ 7 */
{
  id: 'how-to-read-a-datasheet',
  parent: 'the-esp-idea',
  title: 'How to read a datasheet',
  level: 2,
  short: 'A datasheet is a promise with conditions. Read the front for what the chip is, the pin table for what each pin can do, the electrical tables for what is guaranteed, and the footnotes for everything that bites. Typical is not guaranteed.',
  keywords: ['datasheet', 'technical reference manual', 'errata', 'absolute maximum ratings', 'recommended operating conditions', 'typ', 'min', 'max', 'electrical characteristics', 'hardware design guidelines', 'module datasheet', 'footnote', 'chip revision'],
  prereq: ['chip-module-board', 'reading-the-family-names'],
  related: ['registers-and-datasheets', 'strapping-pins', 'reading-a-pinout', 'product-lifecycle-and-longevity', 'the-board-is-not-the-chip', 'battery-life-budget'],
  body: `A datasheet is a promise with conditions. The maker states what the part will do, over what range of supply voltage and temperature, and where it will not. Reading one is a skill with a few fixed moves, and it separates a design that works on the bench from one that works in a thousand homes.

### The documents of one chip

- The **datasheet** says what the chip is: features, pins, electrical limits, package.
- The **technical reference manual** says how each peripheral works, register by register.
- The **hardware design guidelines** say how to build a circuit and a board around it.
- The **errata** list known faults of the silicon, revision by revision.
- The **programming guide** (for Espressif, the ESP-IDF Programming Guide) covers the software.

A module has a datasheet of its own, and it can differ from the chip's.

### Where to look

A datasheet follows a standard order. The *overview* says what the chip is. The *pin definitions* give each pin's functions, its state at reset and its strapping role ([[strapping-pins]]). The *functional description* covers the CPU, memory, peripherals and radio. The *electrical characteristics* hold the numbers you design with. Last come the package, the ordering code and the revision history.

### Min, typ, max and the conditions

An electrical row gives a minimum, a typical and a maximum value, a unit and the conditions. The minimum and the maximum are **guaranteed** under those conditions. The typical value is what a typical part does, at the usual temperature and supply, and it is *not* guaranteed. A deep-sleep current of 5 µA typical (the catalogue's figure for the ESP32-C3) means a normal chip with only the timer running, at room temperature. A hot chip, another mode or a poor sample may draw more. Size the supply for the maximum; make a battery estimate from the typical value and leave a margin.

### Two tables not to confuse

- **Absolute maximum ratings** are limits beyond which damage may occur. They are never an operating point.
- **Recommended operating conditions** are where the guarantees apply. For most ESP chips the supply is 3.0 to 3.6 V (2.5 to 3.6 V for the ESP8266, from the catalogue).

### Chip against module

A module's datasheet can be stricter than the chip's. The ESP32-S3 chip is rated for -40 to 105 °C, but modules with octal PSRAM only to 65 °C ambient (85 °C with the PSRAM's error correction on). Read the table of the exact part you will buy.

### Three habits

Find your exact variant by its part number. Read the footnotes under every table. And check both the revision of the document and the revision of the chip ([[product-lifecycle-and-longevity]]).

> [!key] Design to the guaranteed columns, not to the typical one; keep the absolute maximums out of reach; read the table of your exact variant and its footnotes. The datasheet says what the chip does, the reference manual says how, and the errata say where it does not.`,
  ideas: [
    'Each chip has several documents: datasheet, technical reference manual, hardware design guidelines, errata and a programming guide.',
    'Minimum and maximum are guaranteed under stated conditions; the typical value is not.',
    'Absolute maximum ratings mark the edge of damage, and recommended operating conditions mark where the guarantees hold.',
    'A module can be rated more narrowly than its chip: read the table for the exact part and its footnotes.'
  ],
  pitfalls: [
    'The typical value is what I will get — It is what a typical part does under the stated conditions. Your part, at your temperature, in your mode, can draw more. Use the maximum for the supply and a margin for the battery.',
    'The absolute maximum is the limit I may design to — It is the point where damage may begin, not a working range. Stay inside the recommended operating conditions.',
    'The chip datasheet covers my board — The module and the board add parts and limits. The module datasheet, and the board\'s own page, hold the facts for what you bought.'
  ],
  terms: [
    { term: 'Datasheet', also: ['data sheet'], def: 'The maker\'s document that says what a chip or module is and promises: features, pins, electrical limits, package and ordering codes.' },
    { term: 'Technical reference manual', also: ['TRM', 'reference manual'], def: 'The long document that explains how each peripheral of a chip works, with its registers. It is the book to read when a driver is not enough.' },
    { term: 'Errata', also: ['silicon errata', 'chip bugs'], def: 'The list of known faults in a chip, each with the chip revisions it affects and a workaround or a note that it is fixed.' },
    { term: 'Absolute maximum rating', also: ['abs max', 'absolute maximum ratings'], def: 'A limit that must never be exceeded, even briefly: beyond it the part may be damaged. It is not a working condition.' },
    { term: 'Typical value', also: ['typ', 'typical'], def: 'What a typical part does under the stated conditions. It is the middle of the spread and not a guarantee; the minimum and maximum are the guaranteed limits.' },
    { term: 'Recommended operating conditions', also: ['operating range'], def: 'The ranges of supply voltage and temperature within which the datasheet\'s guarantees hold.' }
  ],
  examples: [
    {
      title: 'Typical or worst case?',
      q: 'Suppose a datasheet gives the sleep current as 5 µA typical and 20 µA maximum. A 220 mAh cell powers a sensor that does nothing but sleep. How long does it last on the typical and on the maximum value?',
      steps: ['Time = capacity divided by current. With 5 µA $= 0.005$ mA: $220 / 0.005 = 44\\,000$ h, about 5.0 years.', 'With 20 µA $= 0.020$ mA: $220 / 0.020 = 11\\,000$ h, about 1.3 years.', 'The spread is a factor of four before the sensor does any work, and the cell\'s own self-discharge is not even counted.'],
      a: 'About 5 years on the typical figure and 1.3 years on the maximum. Budget with margin, and measure the real sleep current of your own board.'
    }
  ],
  quiz: [
    { q: 'A datasheet lists deep-sleep current as "10 µA typ". Which assumption is safest for a battery estimate?', choices: ['Exactly 10 µA in every device', 'About 10 µA, but allow margin for temperature, spread and what else is on the board', 'At most 10 µA', 'At least 10 µA'], a: 1, why: 'The typical value is not a limit. Parts, temperatures and board circuits vary, so the maximum column or a margin belongs in the design.' },
    { q: 'What is the difference between "absolute maximum ratings" and "recommended operating conditions"?', choices: ['They are the same table', 'Absolute maximums are limits beyond which damage may occur; recommended conditions are where the guarantees hold', 'Recommended conditions are looser than the absolute maximums', 'Absolute maximums apply only to modules'], a: 1, why: 'Operate inside the recommended conditions, with a safety distance to the absolute maximums. Exceeding the latter, even briefly, may damage the part.' },
    { q: 'A module made around a chip always has the same temperature rating as the chip.', a: false, why: 'The module adds memory and other parts with limits of their own. The ESP32-S3 chip is rated to 105 °C, but modules with octal PSRAM only to 65 °C ambient (85 °C with the PSRAM\'s error correction on).' },
    { q: 'Where do you look to learn about a bug in one revision of a chip?', choices: ['The datasheet\'s title page', 'The errata', 'The module\'s silkscreen', 'The Arduino library'], a: 1, why: 'The errata document lists faults by chip revision, with workarounds. Check it against the revision you actually receive.' }
  ],
  applications: [
    'Choosing a supply for a design: the maximum current from the tables, not the typical one, sets the regulator.',
    'Checking whether a pin is free: the pin table shows its functions and its role at reset.',
    'Writing a battery budget from the current-consumption table, with the right conditions.',
    'Qualifying a module for a hot enclosure: the module datasheet\'s temperature note decides.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* (and the ESP32-S3 and ESP32-C3 series datasheets): the sections on pin definitions, electrical characteristics and current consumption.',
    'Espressif, *ESP32 Series SoC Errata*: the list of known chip faults by revision.',
    'Espressif, *ESP32 Hardware Design Guidelines*: the circuit and layout rules beside the datasheet.'
  ],
  sim: 'ei-datasheet-reader'
},

/* ================================================================ 8 */
{
  id: 'esp-versus-other-microcontrollers',
  parent: 'the-esp-idea',
  title: 'ESP32 against Arduino, Pico, STM32 and nRF',
  level: 2,
  short: 'Compared fairly: the ESP wins on built-in Wi-Fi and Bluetooth, on memory for the cost and on its ecosystem. The others win on 5 V simplicity (AVR), programmable I/O and price (Pico), industrial peripherals and supply guarantees (STM32) and the lowest-power Bluetooth (nRF).',
  keywords: ['Arduino Uno', 'ATmega328P', 'Raspberry Pi Pico', 'RP2040', 'RP2350', 'PIO', 'STM32', 'nRF52', 'nRF54', 'Nordic', 'comparison', 'AVR', 'Cortex-M', 'alternatives', 'Pico W'],
  prereq: ['what-a-microcontroller-is', 'why-the-esp32-took-over'],
  related: ['choosing-a-chip', 'three-volt-logic', 'level-shifters', 'esp-as-a-co-processor', 'arduino-nano-esp32', 'choosing-a-framework'],
  body: `No chip is best at everything, and the ESP is not the answer to every question. Here it is set beside four families that makers and engineers really weigh against it. The figures for the ESP chips come from the chip catalogue; the others are typical, well-known figures for popular parts, and each family sells many variants, so the datasheet of your exact part decides.

| Part | Core | Clock | RAM | Radio on the chip |
|---|---|---|---|---|
| Arduino Uno (ATmega328P) | 8-bit AVR | 16 MHz | 2 KB | none |
| Raspberry Pi Pico (RP2040) | 2 × Cortex-M0+ | up to 133 MHz | 264 KB | none (Pico W adds Wi-Fi 4 and Bluetooth on a separate chip) |
| Raspberry Pi Pico 2 (RP2350) | 2 × Cortex-M33 or RISC-V | 150 MHz | 520 KB | none |
| STM32F411 to STM32H743 | Cortex-M4F to M7 | 100 to 480 MHz | 128 KB to about 1 MB | none (the WB and WL lines add Bluetooth LE or LoRa) |
| nRF52840 | Cortex-M4F | 64 MHz | 256 KB | Bluetooth LE, 802.15.4 |
| ESP32 | 2 × Xtensa LX6 | 240 MHz | 520 KB | Wi-Fi 4, Bluetooth Classic and LE |
| ESP32-C3 | 1 × RISC-V | 160 MHz | 400 KB | Wi-Fi 4, Bluetooth LE |

### Where the ESP is the better choice

When the device must talk to a network or a phone, the ESP puts Wi-Fi and Bluetooth on the chip, where the others need a second part. It offers more memory and speed for the cost than an AVR, and a very large body of examples ([[the-open-ecosystem]]).

### Where the others are

- **AVR (Arduino Uno): 5 V simplicity.** Its pins run at 5 V, drive many parts directly and forgive a lot, and there is no radio stack to surprise you. Its deepest sleep takes well under a microamp (typical, chip alone). But never wire its 5 V outputs to an ESP input, which is not 5 V tolerant ([[three-volt-logic]], [[level-shifters]]).
- **Raspberry Pi Pico: programmable I/O and price.** The RP2040's **PIO** is a set of small programmable state machines that make custom signals (video, LED strips, odd protocols) with exact timing and no processor load. It is very cheap and well documented.
- **STM32: industrial peripherals and long supply.** A family of hundreds of chips with CAN FD, high-resolution converters, motor-control timers and many USB and Ethernet options, and with published availability commitments of ten years or more on many lines. Tools are steeper; radios are mostly absent.
- **Nordic nRF52 and nRF54: the lowest-power Bluetooth.** Built around radio, with a mature Bluetooth LE stack, sleep currents of a few microamps with memory kept, and Thread, Zigbee and NFC on some parts. There is no Wi-Fi.

### Often together

The ESP is often used as a radio co-processor beside a faster or more specialised chip ([[esp-as-a-co-processor]]), as on the Arduino Portenta C33.

> [!key] Choose the ESP when the project needs Wi-Fi and Bluetooth in one cheap part with plenty of memory and support. Choose an AVR for 5 V simplicity, a Pico for PIO and price, an STM32 for industrial interfaces and long supply, an nRF for the longest battery life on Bluetooth alone.`,
  ideas: [
    'The ESP family is best when a device needs Wi-Fi and Bluetooth in one cheap part with plenty of memory and support.',
    'An AVR Uno wins on 5 V simplicity; the Pico family on PIO and price; STM32 on industrial peripherals and long supply; nRF on the lowest-power Bluetooth.',
    'Figures for the others are typical: the part\'s own datasheet decides.',
    'Families work together: an ESP often serves as the radio beside another processor.'
  ],
  pitfalls: [
    'The ESP32 is better than all the others — It is better at Wi-Fi plus Bluetooth for the price. It is not the best at 5 V simplicity, deterministic timing, industrial peripherals or Bluetooth battery life.',
    'The Arduino Uno and the ESP32 are interchangeable — Their pins run at 5 V and 3.3 V, and an Uno\'s 5 V output can damage an ESP input. Libraries and sketches also differ.',
    'A Pico W is an ESP32 at another price — It has a separate radio chip and different strengths (PIO, two identical cores), and it has no Zigbee or Thread and usually sleeps less deeply.'
  ],
  terms: [
    { term: 'PIO', also: ['programmable I/O', 'Programmable Input Output'], def: 'Small programmable state machines on the RP2040 and RP2350 that run short programs of their own on the pins, producing or reading custom signals with exact timing and no processor load.' },
    { term: 'AVR', also: ['ATmega328P', '8-bit AVR'], def: 'A family of 8-bit microcontrollers, with a small RAM and a 5 V supply on most Arduino boards. The ATmega328P is the chip of the Arduino Uno.' },
    { term: 'Cortex-M', also: ['Arm Cortex-M', 'M0+', 'M4', 'M33'], def: 'A series of 32-bit processor designs from Arm, used by the Raspberry Pi Pico (M0+, M33), STM32 and the Nordic nRF chips (M4F, M33).' },
    { term: 'Radio co-processor', also: ['wireless co-processor', 'connectivity module'], def: 'A chip that does only the wireless networking for another processor, which talks to it over a serial link. An ESP can serve as one.' }
  ],
  choose: {
    good: ['ESP32 family: a connected device that needs Wi-Fi and Bluetooth with a lot of memory and examples', 'Arduino Uno: learning the basics at 5 V with robust pins and no radio to manage', 'Raspberry Pi Pico: precise custom signals with PIO, or a very cheap general board', 'STM32: industrial interfaces, motor control and long availability', 'nRF52 or nRF54: Bluetooth devices that must run for years on a small cell'],
    avoid: ['An ESP on a 5 V bus without level shifting', 'An AVR or Pico on its own for a Wi-Fi product, where the extra radio part costs more than an ESP', 'An ESP where a microsecond-exact signal must be made without the CPU, and a Pico\'s PIO would do it easily', 'A hobby board in a product that needs a ten-year supply guarantee'],
    check: ['The logic voltage of every part you join: 5 V against 3.3 V', 'Which radios the project needs, and which families have exactly those', 'Sleep current of the whole board, not only of the chip', 'How long the maker promises to sell the part']
  },
  quiz: [
    { q: 'A sensor must advertise over Bluetooth LE for two years on a coin cell and needs nothing else. Which family deserves the first look?', choices: ['The classic ESP32', 'A Nordic nRF52 or nRF54, built around low-power Bluetooth LE', 'An Arduino Uno', 'An STM32H7'], a: 1, why: 'Nordic\'s chips are designed around very low-power Bluetooth LE. An ESP32-C3 or H2 may also do it, but compare the whole-board current budget.' },
    { q: 'A design must produce an unusual serial waveform with exact timing and no load on the processor. Which part has hardware made for this?', choices: ['The Arduino Uno', 'The Raspberry Pi Pico\'s PIO', 'The ESP32\'s ADC', 'Nothing does'], a: 1, why: 'PIO runs small programs on the pins by itself. (The ESP has the RMT and I2S peripherals for some signals, but nothing as general.)' },
    { q: 'You may connect an Arduino Uno\'s 5 V outputs directly to the pins of an ESP32.', a: false, why: 'ESP pins are 3.3 V and not 5 V tolerant. Use a level shifter or a divider, or a 3.3 V board.' },
    { q: 'Why might an industrial equipment maker choose an STM32 over an ESP32?', choices: ['It has Wi-Fi built in', 'Long published availability, CAN FD and advanced motor-control timers', 'It is always cheaper', 'It runs MicroPython only'], a: 1, why: 'STM32 lines offer industrial peripherals and long availability commitments. If the product needs Wi-Fi as well, an ESP is often added as a co-processor.' }
  ],
  applications: [
    'Choosing a chip for a connected product: the comparison shows when the ESP is the shortest path and when a specialist is better.',
    'Reading product teardowns: smart home devices carry ESP chips, industrial drives STM32, Bluetooth trackers Nordic chips.',
    'Pairing: the Arduino Portenta C33 and the Nano ESP32 combine a main processor and an ESP.',
    'Deciding whether to port a project from an Uno, a Pico or an STM32 to an ESP, and what changes: voltage, libraries and radio.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* and the ESP32-C3 datasheet: the ESP figures used here.',
    'Raspberry Pi, *RP2040 Datasheet* and *RP2350 Datasheet*: the cores, memory and PIO.',
    'Microchip, *ATmega328P Datasheet*; STMicroelectronics STM32 datasheets; Nordic Semiconductor, *nRF52840 Product Specification*.'
  ],
  sim: 'ei-compare-mcus'
},

/* ================================================================ 9 */
{
  id: 'choosing-a-chip',
  parent: 'the-esp-idea',
  title: 'Choosing a chip for a project',
  level: 2,
  short: 'Choosing is elimination, not shopping. Write down what the project must do, strike off every chip that cannot, and take the simplest that is left, in an order where each step removes more chips than the next: radios, then interfaces, then memory, power and software.',
  keywords: ['choose a chip', 'which ESP32', 'selection', 'requirements', 'radios', 'PSRAM', 'USB', 'camera', 'battery', 'ESP32-C3 or ESP32-S3', 'project advisor', 'chip explorer', 'recommendation'],
  prereq: ['reading-the-family-names', 'esp-versus-other-microcontrollers'],
  related: ['the-family-at-a-glance', 'choosing-a-board', 'product-lifecycle-and-longevity', 'from-idea-to-requirements', 'choosing-a-smart-home-radio'],
  body: `Choosing a chip is elimination, not shopping. Write down what the project must do, strike off every chip that cannot do it, and take the simplest of those left. The order matters, because the first questions remove the most chips.

1. **Say the job in one sentence.** "Measure soil moisture every ten minutes and tell my phone." What does it sense, decide and act on?
2. **Radios first.** Wi-Fi or none? Wi-Fi 4 or 6, 2.4 GHz or 5 GHz? Bluetooth LE or Classic? Zigbee or Thread? Only the original ESP32 and the S31 have Bluetooth Classic; Zigbee and Thread need an 802.15.4 radio (C6, C5, H2 and the new S31); only the C5 reaches 5 GHz; Wi-Fi 6 is on the C6, C5, C61 and S31; the H series and the P4 have no Wi-Fi.
3. **Special interfaces.** A USB keyboard, drive or MIDI device needs USB OTG: S2, S3, P4 or S31. A camera or a large display points to the S3 (parallel interfaces) or the P4 (MIPI). A true analogue output (DAC) exists on the ESP32, S2 and S31. A wired Ethernet controller is on the ESP32, P4 and S31.
4. **Pins and memory.** Count the pins you really need, because boards offer fewer than the chip: the catalogue runs from 14 GPIOs (C2) to 60 (S31). Images, audio buffers and big web pages want PSRAM, which the S3 takes up to 32 MB of and the C3 and C6 do not support at all.
5. **Power.** Deep sleep runs from 5 µA (C2, C3) to 25 µA (S2) on the chip alone ([[the-board-is-not-the-chip]]). Without Wi-Fi, the H2 receives at about a third of the current of a C6.
6. **Speed.** Nearly every project needs less than the slowest chip offers. Choose speed only for audio, vision and machine learning (S3, P4).
7. **Support and status.** Prefer chips in mass production with mature Arduino and MicroPython support (ESP32, S3, C3). Avoid chips in sampling or preview, and the ESP8266 for new work ([[product-lifecycle-and-longevity]]).

### If you need a default

| The project | Start with |
|---|---|
| A connected sensor, switch or small product | ESP32-C3 |
| A display, a camera, USB or machine learning | ESP32-S3 |
| Smart home with Thread, Zigbee or Matter | ESP32-C6 |
| Bluetooth audio, Ethernet, or a tutorial written for it | The original ESP32 |
| Cost and size first, in volume | ESP32-C2 |
| Screens and cameras that need a lot of computing | ESP32-P4 with a radio companion |

These are starting points, not verdicts; the simulation below does the elimination for you from the catalogue. For a described idea, [the project advisor](#/tools/advisor) ranks the chips with its reasons, and [the chip explorer](#/tools/chips) puts any two side by side. Once the chip is fixed, the next choice is the board ([[choosing-a-board]]).

> [!key] List the needs, then eliminate in order: radios, interfaces, memory and pins, power, speed, support. Take the simplest chip that is left, and look at its status before you fall for it.`,
  ideas: [
    'Choose by elimination: list the needs, strike off the chips that lack any, and take the simplest that remains.',
    'Start with the radios: Bluetooth Classic, Zigbee and Thread, 5 GHz and Wi-Fi 6 each exist on only a few chips.',
    'Then interfaces (USB device, camera, display, DAC, Ethernet), pins and memory, and last power and speed.',
    'Check the status: pick chips in mass production with mature software, not sampling parts or the ESP8266.'
  ],
  pitfalls: [
    'The newest or fastest chip is the safe choice — A faster chip costs more, may draw more and may have thin software support. Most projects are served by the simplest chip that has the radios and pins they need.',
    'The number of GPIOs on the chip is the number of pins I can use — Boards expose fewer, and strapping, flash, USB and PSRAM take some of them. Count what the board gives.',
    'A single data-sheet figure, such as the sleep current, decides the battery life — The whole board, the radio and the duty cycle decide. Compare designs by a battery budget, not by one number.'
  ],
  terms: [
    { term: 'Requirements', also: ['needs', 'specification'], def: 'The written list of what a project must do (radios, interfaces, pins, memory, battery life, size, cost). Chips are judged against it, and not the other way round.' },
    { term: 'Elimination', also: ['selection by elimination'], def: 'Choosing by striking off every option that fails a need, starting with the needs that remove the most options, and taking the simplest that remains.' },
    { term: 'Project advisor', also: ['advisor'], def: 'The tool in this app that turns a description of a project into a list of needs and ranks the chips, each with its reasons.' }
  ],
  examples: [
    {
      title: 'A greenhouse sensor',
      q: 'A battery sensor sends the temperature and humidity of a greenhouse every ten minutes over Wi-Fi, and has to run for a season on a cell. Which chip?',
      steps: ['Radios: Wi-Fi 4 is enough, and no Bluetooth is needed. Interfaces: one I2C sensor. Memory: tiny. Pins: four.', 'That leaves almost every chip. Power then decides: the ESP32-C3 and C2 sleep on 5 µA, the ESP32 on 10 µA, the S2 on 25 µA.', 'Status and support: the C3 is in mass production with Arduino and MicroPython support. The C2 is smaller and cheaper, but its Arduino support is only as an ESP-IDF component.'],
      a: 'The ESP32-C3: it meets every need, sleeps on 5 µA, and is the simplest chip with the best support. Budget the whole board next.'
    },
    {
      title: 'A touch-screen thermostat',
      q: 'A wall thermostat has a 3.5-inch colour touch screen, Wi-Fi and Bluetooth LE for set-up, and runs from mains power.',
      steps: ['Interfaces: a colour display with a touch controller and a frame buffer. Memory: PSRAM is wanted.', 'Chips with PSRAM and a parallel or RGB display interface: the original ESP32 (limited), the S3, the P4 (no radio).', 'Radios: Wi-Fi and LE on the same chip excludes the P4. Mains power makes sleep current irrelevant.'],
      a: 'The ESP32-S3: Wi-Fi and Bluetooth LE, PSRAM up to 32 MB, a parallel display interface and mature software.'
    }
  ],
  quiz: [
    { q: 'A project streams music from a phone to a speaker over Bluetooth. Which chip is the right start?', choices: ['ESP32-C3', 'ESP32-S3', 'The original ESP32', 'ESP32-H2'], a: 2, why: 'Phone-to-speaker audio uses Bluetooth Classic. Among the common chips only the original ESP32 has it (the S31 too, but its software is still in preview).' },
    { q: 'A project needs a camera and a 7-inch display. Which check comes first?', choices: ['The clock speed', 'The memory and interfaces: PSRAM, and a camera and display interface on the chip', 'The number of ADC channels', 'The antenna type'], a: 1, why: 'Images and frame buffers need PSRAM, and the chip must have the interfaces for the camera and display. That points to the S3 or the P4.' },
    { q: 'The ESP32-C6 is a better choice than the ESP32-C3 for every project because it is newer.', a: false, why: 'The C6 adds Wi-Fi 6 and 802.15.4 but costs more, and many projects need none of that. The best chip is the simplest one that meets the needs.' },
    { q: 'Why does choosing by clock speed alone mislead?', choices: ['Clock speed is not published', 'Most projects need far less speed than any ESP offers, and the radios, interfaces, memory and power decide fit', 'Faster chips are always cheaper', 'Slower chips have more pins'], a: 1, why: 'Speed rarely limits a project. A missing radio, a missing interface, too little memory or too high a sleep current usually does.' }
  ],
  applications: [
    'Starting any new project: listing the needs and striking chips off before buying a board.',
    'Moving a prototype to a product: re-checking the choice against cost, supply and status.',
    'Teaching: giving a class a simple rule ("C3 for simple, S3 for screens") and showing when to break it.',
    'Reviewing a design: asking which need justified a more expensive chip.'
  ],
  sources: [
    'Espressif, *ESP Product Selector*: every chip with its radios, memory, pins and status in one table.',
    'Espressif, the datasheets of the chips compared: radios, GPIO counts, PSRAM support and sleep currents.',
    'Espressif, *ESP-IDF Programming Guide*: the list of chips each feature and driver supports.'
  ],
  sim: 'ei-chip-filter'
},

/* ================================================================ 10 */
{
  id: 'product-lifecycle-and-longevity',
  parent: 'the-esp-idea',
  title: 'Product status, longevity and chip revisions',
  level: 2,
  short: 'Chips have a life: announced, sampling, mass production, not recommended for new designs, end of life. Each chip also has revisions that fix faults and change behaviour. Before you design one in, check where it stands and which revision you will really receive.',
  keywords: ['NRND', 'not recommended for new designs', 'end of life', 'EOL', 'mass production', 'sampling', 'chip revision', 'silicon revision', 'errata', 'PCN', 'last-time buy', 'longevity', 'ESP32-WROOM-32E', 'ESP8266'],
  prereq: ['espressif-and-its-history', 'how-to-read-a-datasheet'],
  related: ['choosing-a-chip', 'clones-and-counterfeits', 'reliability-in-the-field', 'versioning-and-releases', 'secure-boot', 'the-newest-chips'],
  body: `A chip is a product with a life, and where it stands in that life decides whether you should design it in. Two things change with time: the chip's **status**, and its **revision**.

### The stages

| Status | Meaning | In the catalogue (October 2026) |
|---|---|---|
| Announced | Exists on paper; no datasheet yet | ESP32-H21 |
| Sampling | Engineering samples; data and software may change | ESP32-H4, ESP32-E22 |
| Mass production | Normal supply; safe to design in | ESP32, S2, S3, C3, C6, C5, C2, C61, H2, P4 |
| Not recommended for new designs | Still sold, but the maker advises a successor | ESP8266 (since November 2025); the ESP32-WROOM-32, -32D and -32U modules |
| End of life | No longer made: last chance to buy | The ESP32-WROOM-32SE module |

The status of the silicon is not the status of the software. The ESP32-S31 has been in mass production since mid-2026, yet ESP-IDF supports it only as a preview and Arduino and MicroPython not at all. A chip can be on sale and still unready to start a project on.

### Modules age before chips do

The ESP32 chip is in mass production, but three of its early modules are not: the ESP32-WROOM-32E replaced the -32 and -32D. Same chip, new module, and not identical: the -32E leaves the old flash pads, pins 17 to 22, unconnected. A design that reuses a footprint must read the module's own datasheet.

### Revisions

Every chip is made in revisions. A new silicon revision fixes errata and sometimes adds a feature. On the original ESP32, Secure Boot V2 needs revision v3.0 or later (from the catalogue), and a name ending in -V3 marks revision-3 silicon. Revisions are mostly compatible, but a behaviour can change, so record the revision your firmware was tested on, and test each new batch.

### Longevity

How long will a part be sold? Look for the maker's own availability statement, and for a product meant to live ten years, choose established chips. Subscribe to the maker's product change notifications, and when an end-of-life notice arrives, plan a last-time buy or a move. Hobby boards from clone makers promise nothing: the "same" board may carry another flash chip, or another chip, in the next batch ([[clones-and-counterfeits]]).

Frameworks age too. Each ESP-IDF version is supported for a limited time, and at the time of writing the Arduino core 3.3 rests on ESP-IDF 5.5 while a 4.0 pre-release rests on 6.1. Pin the versions a product is built with ([[versioning-and-releases]]).

> [!key] Check a chip's status and its software support before you design it in, prefer parts in mass production, and note the chip revision your firmware runs on. Modules, boards and frameworks have lives of their own.`,
  ideas: [
    'A chip passes from announced through sampling and mass production to not recommended for new designs and end of life.',
    'The status of the silicon and the status of its software can differ: the ESP32-S31 is in production but its software is a preview.',
    'Modules are replaced before their chips: the ESP32-WROOM-32E succeeded the -32 and -32D, with differences in the pins.',
    'Silicon revisions fix errata and can change behaviour: record the revision you tested on.'
  ],
  pitfalls: [
    'If it is on sale, it is fine to design in — NRND parts are still sold. The maker has already advised a successor, and an end-of-life notice follows. Check the status first.',
    'A new revision of a chip behaves exactly like the old one — Mostly, but not always: a revision can fix a fault your design works around, or add a feature. Read the errata and re-test.',
    'A board with the same name always carries the same parts — Clone and low-cost boards change flash, chips and layout between batches. Test every batch and keep a note of what is on it.'
  ],
  terms: [
    { term: 'NRND', also: ['not recommended for new designs'], def: 'A status meaning the part is still sold, for existing products, but the maker advises that new designs use a successor. The ESP8266 has been NRND since November 2025.' },
    { term: 'End of life', also: ['EOL', 'last-time buy'], def: 'The stage at which a part is no longer made. Makers announce it in advance so customers can place a last-time buy of the stock they will need.' },
    { term: 'Chip revision', also: ['silicon revision', 'stepping', 'ECO'], def: 'A version of the chip\'s silicon. A new revision fixes known faults and may add features, and is named by a version such as v3.1; the datasheet\'s errata list what each revision fixes.' },
    { term: 'Product change notification', also: ['PCN', 'change notice'], def: 'A notice from a maker that a part, a package, a process or a module is changing. Anyone shipping a product built on it should subscribe.' }
  ],
  quiz: [
    { q: 'A module is marked NRND while its successor is in mass production. What should a new design do?', choices: ['Use the NRND module, since it is cheaper', 'Use the successor, reading its datasheet for differences in the pins', 'Wait until the NRND module is end of life', 'Use a clone of the NRND module'], a: 1, why: 'NRND says "do not start a new design with this". Use the successor, and read its datasheet: the ESP32-WROOM-32E, for example, leaves pins 17 to 22 unconnected.' },
    { q: 'A chip is listed as "sampling". What does that mean for a product schedule?', choices: ['It is ready for volume orders', 'Samples exist, but the datasheet and software may still change: watch it, do not design it in yet', 'It has been withdrawn', 'It works only on Espressif boards'], a: 1, why: 'Sampling comes before mass production. Data can be missing, and libraries may not support it.' },
    { q: 'A new silicon revision of a chip is always identical in behaviour to the old one.', a: false, why: 'A revision fixes errata and may add features, so behaviour can change. On the original ESP32, Secure Boot V2 is available only from revision v3.0.' },
    { q: 'The ESP32-S31 has been in mass production since mid-2026. Why is it still a poor choice for starting a project at the time of writing?', choices: ['It has no Wi-Fi', 'ESP-IDF supports it only as a preview, and Arduino and MicroPython do not support it', 'It is end of life', 'It has no flash'], a: 1, why: 'The status of the chip is mass production, but the status of its software is a preview. A project starts where the tools and libraries are mature.' }
  ],
  applications: [
    'Deciding whether to design in a chip or a module: status first, then software support.',
    'Planning the end of a product that uses an NRND part: schedule the move to the successor.',
    'Reproducing a field fault: knowing which chip revision and module version the unit has.',
    'Buying boards in volume: testing each batch for the flash, the chip revision and the pin behaviour.'
  ],
  sources: [
    'Espressif, *ESP Product Selector*: the product status of every chip and module.',
    'Espressif, *ESP32 Series SoC Errata*: faults and their fixes by chip revision.',
    'Espressif, *ESP-IDF Programming Guide*, "Versions": release and support periods.'
  ],
  code: [
    {
      title: 'Which revision do I have?',
      about: 'Prints the chip and its silicon revision, the number to note in your test records. The same value appears in the flashing tool\'s output when it connects.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Revision: ] (chip revision))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Chip:     %s\n", ESP.getChipModel());
          Serial.printf("Revision: %lu\n", (unsigned long)ESP.getChipRevision());
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no call that reports the silicon revision. Run the flashing tool\'s chip-id command (esptool) from the computer instead: it prints the revision while it connects.' },
      output: `
        Chip:     ESP32-D0WD-V3
        Revision: 301
      `,
      notes: ['In current cores the number is major × 100 + minor, so 301 means revision v3.1 and 4 means v0.4. Check it against what esptool prints.', 'The name of an ESP32 chip with a -V3 suffix says the silicon is revision 3.']
    }
  ],
  sim: { id: 'ei-family-chart', params: { y: 'cpu', color: 'status' } }
},

/* ================================================================ 11 */
{
  id: 'the-open-ecosystem',
  parent: 'the-esp-idea',
  title: 'The ecosystem: frameworks, libraries, communities',
  level: 1,
  short: 'An ESP chip is only as useful as the software around it. Espressif\'s own framework, ESP-IDF, sits under almost everything: the Arduino core, MicroPython, ESPHome and Rust come on top of it or beside it, with libraries, forums and ready-made firmware around them.',
  keywords: ['ESP-IDF', 'Arduino core', 'MicroPython', 'CircuitPython', 'ESPHome', 'Tasmota', 'WLED', 'Rust', 'Zephyr', 'PlatformIO', 'libraries', 'community', 'open source', 'framework', 'component registry', 'licence'],
  prereq: ['why-the-esp32-took-over', 'espressif-and-its-history'],
  related: ['choosing-a-framework', 'esp-idf-basics', 'arduino-ide-and-the-esp32-core', 'micropython-setup', 'esphome', 'open-source-licences', 'build-or-use'],
  body: `An ESP chip is only as useful as the software around it. The ecosystem is layered, and every layer is open for you to use or to look inside.

### The layers

1. **The hardware and its boot ROM.** The chip starts here and loads your program from flash ([[the-rom-bootloader]]).
2. **ESP-IDF**, Espressif's own framework, written in C. It holds the operating system (FreeRTOS), a driver for every peripheral, the Wi-Fi and Bluetooth stacks, TCP/IP, TLS, secure boot and updates over the air. Almost everything else sits on it or beside it.
3. **Friendlier layers.** The **Arduino core** (C++ sketches and thousands of libraries) is built on ESP-IDF. **MicroPython** and **CircuitPython** are Python interpreters running on it. **ESPHome** turns a description in YAML into firmware. **Tasmota** and **WLED** are finished firmware you only configure. **Rust** has an operating-system-free library (esp-hal) and a version on top of ESP-IDF, and a **Zephyr** port exists too.
4. **Tools.** The Arduino IDE, PlatformIO, the ESP-IDF extension for VS Code, Thonny for MicroPython, and the flashing tool esptool.

Which layer to start on is a question of how much you want to see and control ([[choosing-a-framework]]).

### Which chips each supports

| Chip | ESP-IDF, first version | Arduino core | MicroPython | ESPHome |
|---|---|---|---|---|
| ESP32 | 1.0 | yes | yes | yes |
| ESP32-S2 | 4.2 | yes | yes | yes |
| ESP32-S3 | 4.4 | yes | yes | yes |
| ESP32-C3 | 4.3 | yes | yes | yes |
| ESP32-C6, ESP32-H2 | 5.1 | yes | yes | yes |
| ESP32-P4 | 5.3 | yes | yes | yes |
| ESP32-C5 | 5.5 | yes | yes | yes |
| ESP32-C2 | 5.0 | as an IDF component only | yes | no |
| ESP32-C61 | 5.5 | as an IDF component only | no | no |
| ESP32-S31, H4, H21 | preview only | no | no | no |
| ESP8266 | its own SDK | a separate core | yes | yes |

(From the catalogue, October 2026. Support moves quickly: check the project's own page.)

### Libraries and communities

Libraries come from the Arduino Library Manager, the PlatformIO registry, the ESP Component Registry for ESP-IDF, and the modules built into MicroPython. Thousands of people write them, so quality varies: look at the last update and at which chips it names. Help comes from Espressif's forum, the issue trackers of each project (where faults really get fixed), the Home Assistant community for ESPHome, and the maker forums.

### Licences

ESP-IDF is under the Apache 2.0 licence, the Arduino core for ESP32 under the LGPL, MicroPython under the MIT licence. They differ in what you must publish if you sell a product ([[open-source-licences]]).

> [!key] ESP-IDF is the base; the Arduino core, MicroPython, ESPHome and Rust are ways in at different heights. Choose the layer you can work in, check that it supports your chip, and treat the libraries, like any open source, as work by volunteers to be checked before use.`,
  ideas: [
    'ESP-IDF, Espressif\'s own C framework with FreeRTOS, drivers and the radio stacks, is the base of almost everything else.',
    'The Arduino core, MicroPython and ESPHome sit on ESP-IDF at different heights; Rust has its own libraries beside it.',
    'Each chip is supported by a different set of layers, and support for the newest chips arrives later.',
    'Libraries and licences differ in quality and in what they ask of a product: check before you rely on them.'
  ],
  pitfalls: [
    'Arduino, MicroPython and ESP-IDF are three separate systems — The first two run on ESP-IDF, which underlies almost everything. Knowing that explains why they share features, and why a limit of ESP-IDF shows up in all of them.',
    'A library that works on the ESP32 works on every ESP chip — Chips differ: a library for the DAC, the touch pins or Bluetooth Classic fails on chips without them, and one with assembly may fail on RISC-V. Check the chips it lists.',
    'Open source means free of obligations — It means free to use and change, under a licence with conditions. Some require you to publish changes or give the user the code of a product that contains them.'
  ],
  terms: [
    { term: 'ESP-IDF', also: ['Espressif IoT Development Framework', 'IDF'], def: 'Espressif\'s own software framework, written in C, that holds the operating system (FreeRTOS), the drivers, the Wi-Fi and Bluetooth stacks and the security features. The Arduino core and MicroPython are built on it.' },
    { term: 'Arduino core', also: ['arduino-esp32', 'Arduino-ESP32'], def: 'The software that makes the Arduino way of writing programs (setup, loop and the Arduino libraries) work on ESP chips. It is built on ESP-IDF.' },
    { term: 'Framework', also: ['SDK', 'software framework'], def: 'A ready-made body of code and conventions that a program is built on, so that it need not drive the chip\'s hardware directly. ESP-IDF, the Arduino core and MicroPython are frameworks.' },
    { term: 'ESP Component Registry', also: ['component manager', 'IDF component registry'], def: 'The online collection of ready-made components (libraries) for ESP-IDF, installed by name with the build tools.' },
    { term: 'Frozen module', also: ['built-in module'], def: 'A MicroPython library compiled into the firmware image itself, so that it is present without being copied to the board. The HTTP requests module of the ESP32 build is an example.' }
  ],
  quiz: [
    { q: 'How does the Arduino core for ESP32 relate to ESP-IDF?', choices: ['They are unrelated systems', 'The Arduino core is built on top of ESP-IDF', 'ESP-IDF is built on the Arduino core', 'ESP-IDF is only for the ESP8266'], a: 1, why: 'The Arduino core uses ESP-IDF underneath for the operating system, the drivers and the radio stacks. MicroPython does the same.' },
    { q: 'You want a sensor to report to Home Assistant without writing any code. What suits best?', choices: ['A C++ sketch written from scratch', 'ESPHome, which builds the firmware from a description of the device', 'ESP-IDF from the command line', 'A bare chip'], a: 1, why: 'ESPHome turns a YAML description into firmware and joins Home Assistant by itself. Tasmota is another ready-made option.' },
    { q: 'A library that works on an original ESP32 will work unchanged on every other ESP chip.', a: false, why: 'Chips differ. A library that uses the DAC, the touch pins, Bluetooth Classic or hand-written assembly can fail on chips that lack them or have another processor.' },
    { q: 'Which chip, according to the catalogue, has Arduino support only as an ESP-IDF component and no MicroPython build?', choices: ['ESP32-S3', 'ESP32-C3', 'ESP32-C61', 'ESP32-H2'], a: 2, why: 'The C61 is supported by ESP-IDF 5.5 and, in Arduino, only as an IDF component. The S3, C3 and H2 are fully supported by both.' }
  ],
  applications: [
    'Choosing the layer a project is written on: quick to start on Arduino or MicroPython, full control on ESP-IDF.',
    'Finding a library, and judging whether it supports your chip and is maintained.',
    'Getting help: knowing which project\'s tracker to search for a fault.',
    'Using ready-made firmware (ESPHome, Tasmota, WLED) where no code is needed.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: "Overview" and the page on the supported chips.',
    'Arduino core for ESP32 documentation: "Introduction" and the list of supported chips.',
    'MicroPython documentation, *MicroPython on the ESP32*: the firmware images and supported chips (version 1.29).'
  ],
  code: [
    {
      title: 'One blink, three layers',
      about: 'The same blink as [[first-program-blink]], written at three heights. The Arduino call and the MicroPython call both end in the same ESP-IDF function that sets the pin. Compare how much each layer hides.',
      needs: 'Any ESP board with an LED on GPIO2, or an LED with a 220 Ω resistor on a free pin.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
        forever
          set pin (2) to [HIGH v]
          wait (0.5) seconds
          set pin (2) to [LOW v]
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int LED = 2;                 // your board's LED pin

        void setup() {
          pinMode(LED, OUTPUT);            // Arduino core: hides ESP-IDF's gpio driver
        }

        void loop() {
          digitalWrite(LED, HIGH);
          delay(500);
          digitalWrite(LED, LOW);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)              # your board's LED pin
        while True:
            led.value(1)                   # MicroPython: hides ESP-IDF's gpio driver
            time.sleep_ms(500)
            led.value(0)
            time.sleep_ms(500)
      `,
      idf: String.raw`
        #include "driver/gpio.h"
        #include "freertos/FreeRTOS.h"
        #include "freertos/task.h"

        #define LED_GPIO GPIO_NUM_2                      // your board's LED pin

        void app_main(void)
        {
            gpio_reset_pin(LED_GPIO);
            gpio_set_direction(LED_GPIO, GPIO_MODE_OUTPUT);   // once: this pin drives something
            while (1) {
                gpio_set_level(LED_GPIO, 1);
                vTaskDelay(pdMS_TO_TICKS(500));               // FreeRTOS: the task sleeps, others run
                gpio_set_level(LED_GPIO, 0);
                vTaskDelay(pdMS_TO_TICKS(500));
            }
        }
      `,
      notes: ['On boards whose LED is an RGB LED, GPIO2 drives nothing; see [[first-program-blink]] for the pins by board.', 'In ESP-IDF there is no setup() or loop(): execution starts in app_main(), and the delay is a FreeRTOS call.']
    }
  ]
},
);
