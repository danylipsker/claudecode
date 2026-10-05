/* HYPER-ESP32 · content/reference.js
 *
 * The three reference pages. Writers: read them before writing — they set the depth, the tone and the layout.
 *
 *   first-program-blink   a programming page: the idea, two programs in three languages, a simulation
 *   strapping-pins        a hardware page: what the pins do, a table of verified facts, a simulation on a board
 *   soc-esp32-c3          a chip page: what it is for, its numbers (the same as the Chips tool shows), when to choose it
 */
Hyper.add(
/* ================================================================ a programming page */
{
  id: 'first-program-blink',
  parent: 'toolchains-and-setup',
  title: 'The first program: blink',
  level: 1,
  short: 'Make an LED blink. It is the smallest program that proves everything works — the board, the cable, the tools, the upload — and it already contains the shape of every program you will write.',
  keywords: ['blink', 'hello world', 'first sketch', 'LED_BUILTIN', 'pinMode', 'digitalWrite', 'delay', 'millis', 'Pin', 'sleep_ms', 'ticks_ms', 'built-in LED', 'RGB LED', 'active low'],
  prereq: ['choosing-a-framework', 'chip-module-board'],
  related: ['non-blocking-timing', 'digital-output', 'setup-loop-and-main', 'upload-problems', 'leds'],
  body: `Nobody's first program reads a sensor or joins a network. It turns a light on and off, because that one act proves a long chain: the board is powered, the computer sees it, the tools are installed, the program was translated, uploaded and started, and a pin of the chip really changed voltage. When the LED blinks, everything between your keyboard and that pin works. When it does not, you have exactly one thing to debug.

### What the program does

Every version below does the same four things, and nearly every program you will ever write for a microcontroller has the same shape:

1. **Once, at the start:** tell the chip that a pin is an *output* — a pin the program drives, rather than one it listens to.
2. **Forever after:** drive the pin *high* (3.3 V), so current flows through the LED;
3. wait half a second;
4. drive it *low* (0 V), wait again, and go round.

In Arduino C++ the "once" part is \`setup()\` and the "forever" part is \`loop()\`. In MicroPython you write the \`while True:\` loop yourself. In blocks it is a *when started* hat with a *forever* block under it. Open [the program](#/c/first-program-blink?s=code) below and switch between the three: the structure is identical, only the spelling changes.

### Which pin is the LED?

That depends on the board, and it is the first thing that goes wrong:

| Board | Its LED | Note |
|---|---|---|
| ESP32 DevKitC and most 30- or 38-pin ESP32 boards | GPIO2 (some have only a power LED) | The generic board definition names no built-in LED: define it yourself |
| ESP32-S3-DevKitC-1 | an RGB LED on GPIO48 (GPIO38 on board version 1.1) | Not a plain LED: it needs a data signal |
| ESP32-C3 and ESP32-C6 DevKits | an RGB LED on GPIO8 | The same |
| NodeMCU and D1 mini (ESP8266) | GPIO2, **on when the pin is low** | An *active-low* LED |
| Many thumb-sized boards | none, or one on an unusual pin | Check the board's page in [the board catalogue](#/tools/boards) |

On the boards with an RGB LED the Arduino core helps: writing \`digitalWrite(LED_BUILTIN, HIGH)\` sends the little data frame that lights it white. If your board has no LED you can reach, wire one: GPIO → 220 Ω resistor → LED → ground, the long leg of the LED towards the pin (see [[leds]]).

### The catch in "wait"

\`delay(500)\` and \`time.sleep_ms(500)\` are honest about what they do: for half a second **this program does nothing else**. It cannot notice a button, read a sensor or answer the network. For a blinking light that is fine. For anything real it is the first habit to unlearn, and the second program below shows the alternative: look at the clock each time round the loop, and act only when enough time has passed. The loop then spins thousands of times a second and can do other work in between. This is the subject of [[non-blocking-timing]], and later of [[state-machines|state machines]] and [[tasks]].

Try both in the simulation: add "other work" to the loop and watch what happens to the blink.

### When nothing blinks

- **The upload failed.** Read the last lines of the output. "Failed to connect" usually means the chip was not in download mode: hold BOOT, tap RESET, release BOOT, upload again ([[upload-problems]]).
- **Wrong pin.** Change the number; try 2, 8, 48 — or look the board up.
- **Active-low LED.** The LED is on when you wrote "off": it works, the logic is inverted.
- **Wrong board selected.** A program built for an ESP32 does not start on an ESP32-C3.
- **A charge-only USB cable.** No data wires, no upload. It catches everyone once.

> [!key] Blink proves the whole toolchain and shows the shape of every program: set up once, then loop. The \`delay\` version stops the world while it waits; the clock-watching version does not, and that difference is where real programs begin.`,
  ideas: [
    'A program for a microcontroller is "set up once, then repeat for ever"; the three languages spell that differently and mean the same.',
    'A pin must be made an output before it can drive anything; high is 3.3 V, low is 0 V.',
    'Which pin carries the LED depends on the board, and some LEDs are on when the pin is low.',
    'delay() stops the whole loop; comparing the clock with a saved time lets the loop keep running.'
  ],
  pitfalls: [
    'If the program compiled, the LED will blink — Compiling proves the text is valid; the upload, the board choice and the pin number can each still be wrong.',
    'The LED pin is always 2 (or always 13, as on an Arduino Uno) — It differs between boards; several ESP boards have an RGB LED that needs a data signal, or no user LED at all.',
    'delay(500) is the way to do something every half second — Only if the program has nothing else to do. A loop that sleeps cannot react to anything while it sleeps.'
  ],
  terms: [
    { term: 'Sketch', also: ['.ino'], def: 'The Arduino word for a program: a file with a setup() function that runs once and a loop() function that runs for ever.' },
    { term: 'Built-in LED', also: ['LED_BUILTIN', 'on-board LED'], def: 'An LED soldered on the board and wired to one GPIO. Its pin, and whether it lights on high or on low, depend on the board.' },
    { term: 'Active low', also: ['inverted logic'], def: 'Wired so that the low level switches the thing on. An active-low LED sits between the supply and the pin, and lights when the pin pulls to 0 V.' },
    { term: 'Blocking', also: ['blocking call'], def: 'Said of a function that does not return until its job is done. delay() blocks: nothing else in the loop runs while it waits.' },
    { term: 'Upload', also: ['flash', 'flashing'], def: 'Writing the translated program into the chip\'s flash memory over USB or serial, after which the chip restarts and runs it.' }
  ],
  code: [
    {
      title: 'Blink, the simple way',
      about: 'Half a second on, half a second off. Change the pin number to your board\'s LED.',
      needs: 'Any ESP board with an LED, and a USB data cable.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND'], ['USB', 'computer']],
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
        #ifndef LED_BUILTIN
        #define LED_BUILTIN 2            // the generic ESP32 board names no LED: GPIO2 on many DevKits
        #endif

        void setup() {
          pinMode(LED_BUILTIN, OUTPUT);  // once: this pin drives something
        }

        void loop() {                    // for ever:
          digitalWrite(LED_BUILTIN, HIGH);
          delay(500);                    // milliseconds
          digitalWrite(LED_BUILTIN, LOW);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)            # once: this pin drives something

        while True:                      # for ever:
            led.value(1)
            time.sleep_ms(500)
            led.value(0)
            time.sleep_ms(500)
      `,
      notes: ['On an ESP32-S3, C3 or C6 DevKit the Arduino version lights the RGB LED white; in MicroPython drive it with the `neopixel` module instead.', 'An active-low LED (NodeMCU, D1 mini) is on while the pin is low: swap the two levels if the timing matters.']
    },
    {
      title: 'Blink without stopping the program',
      about: 'The loop never waits. Each time round it asks the clock whether half a second has passed since the last change; if so it flips the LED. Whatever else is in the loop keeps running.',
      needs: 'The same board.',
      blocks: `
        when started
          set pin (2) as [output v]
          set [last v] to (milliseconds since start)
          set [on v] to <false>
        forever
          if <((milliseconds since start) - (last)) ≥ (500)> then
            change [last v] by (500)
            set [on v] to <not <on>>
            set pin (2) to (on)
          end
          do the other work    // runs thousands of times a second :: my
        end
      `,
      cpp: String.raw`
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
          if (now - lastToggle >= INTERVAL_MS) {   // unsigned subtraction stays right when millis() wraps
            lastToggle += INTERVAL_MS;             // not "= now": keeps the average period exact
            ledOn = !ledOn;
            digitalWrite(LED_BUILTIN, ledOn);
          }
          // other work goes here and is never held up
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)
        INTERVAL = 500
        last = time.ticks_ms()

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) >= INTERVAL:   # ticks wrap: always compare with ticks_diff
                last = time.ticks_add(last, INTERVAL)
                led.toggle()
            # other work goes here and is never held up
      `,
      notes: ['`millis()` counts milliseconds since start and wraps after 49.7 days; subtracting two unsigned values gives the right interval across the wrap.', 'In MicroPython the tick counter wraps much sooner: never subtract ticks by hand, use `time.ticks_diff()`.']
    }
  ],
  examples: [
    {
      title: 'What does the loop cost?',
      q: 'A loop blinks an LED with two `delay(500)` calls, and also reads a sensor, which takes 120 ms. How long is one full blink, and how often is the sensor read?',
      steps: ['Add what happens in one pass of the loop: on for 500 ms, off for 500 ms, sensor 120 ms.', 'One pass takes $500 + 500 + 120 = 1120$ ms: the LED is no longer on a one-second rhythm.', 'The sensor is read once per pass: every 1.12 s, and a button pressed for half a second in between may never be seen.'],
      a: 'The blink stretches to 1.12 s and the sensor is read only once in that time. With the clock-watching version the blink stays at exactly 1 s and the sensor can be read whenever its own interval says so.'
    }
  ],
  quiz: [
    { q: 'A sketch compiles and uploads without error, but the LED stays dark on an ESP32-S3-DevKitC-1. The sketch writes GPIO2. What is the most likely reason?', choices: ['The board is broken', 'This board\'s LED is an RGB LED on another pin', 'GPIO2 cannot be an output', 'The delay is too short to see'], a: 1, why: 'The S3 DevKit carries an addressable RGB LED on GPIO48 (GPIO38 on version 1.1), not a plain LED on GPIO2. GPIO2 is toggling correctly — there is just nothing on it.' },
    { q: 'While `delay(500)` is running, the loop can still read a button.', a: false, why: 'delay() does not return until the time is over; nothing after it in the loop runs meanwhile. (Other tasks of the system, such as Wi-Fi, do keep running — but not your loop.)' },
    { q: 'In the non-blocking version, why is `lastToggle += INTERVAL_MS` better than `lastToggle = now`?', choices: ['It uses less memory', 'It keeps the long-term rhythm exact even when one pass of the loop was late', 'It avoids the 49-day overflow', 'There is no difference'], a: 1, why: 'If a pass is 7 ms late, "= now" carries those 7 ms into every later blink and the errors add up. Adding the interval to the previous deadline keeps the average period exactly 500 ms.' },
    { q: 'On a NodeMCU the on-board LED lights when the program writes LOW. What is that called?', choices: ['Open drain', 'Active low', 'Pull-down', 'A strapping pin'], a: 1, why: 'The LED is wired between 3.3 V and the pin, so it conducts when the pin is at 0 V: active low.' }
  ],
  applications: [
    'A heartbeat LED that blinks from the main loop shows at a glance that a device has not frozen.',
    'Blink codes — two flashes for "no Wi-Fi", three for "sensor missing" — are the cheapest display there is.',
    'Uploading blink is the standard first test of a new board, a new cable or a freshly installed toolchain.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *GPIO* API and the Blink and BlinkRGB examples (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*: pins and timing (version 1.29).',
    'Espressif, user guides of the ESP32-DevKitC and ESP32-S3-DevKitC-1 boards (the LED pins).'
  ],
  sim: 'ref-blink'
},

/* ================================================================ a hardware page */
{
  id: 'strapping-pins',
  parent: 'gpio-and-pinouts',
  title: 'Strapping pins',
  level: 2,
  short: 'A few pins are read once, at the instant the chip leaves reset, to decide how it starts. Afterwards they are ordinary pins — but whatever is wired to them must not hold them at the wrong level at power-up.',
  keywords: ['strapping', 'boot pin', 'GPIO0', 'GPIO12', 'GPIO9', 'GPIO46', 'download mode', 'boot button', 'MTDI', 'flash voltage', 'boot loop', 'will not boot', 'bootstrap'],
  prereq: ['reading-a-pinout', 'pull-ups-and-pull-downs'],
  related: ['boot-modes-and-download-mode', 'pins-at-boot', 'upload-problems', 'input-only-and-special-pins', 'planning-pins'],
  body: `A chip that has just been powered has no program running yet, so it cannot be *told* how to start. Instead it looks at the voltage on a few of its own pins, at the moment the reset line is released, and takes its orders from them: start the program in flash, or wait for a new program over the serial port; give the flash memory 3.3 V or 1.8 V; print boot messages or keep quiet. These are the **strapping pins**. A few milliseconds later the levels have been latched and the same pins become ordinary GPIOs.

That double life is the trap. A relay module that pulls its input low, an LED to ground, a sensor that drives its output before the chip is awake — on any other pin they are harmless. On a strapping pin they can change the answer the chip reads at power-up, and the board appears dead, or boots only when you unplug the part.

### Which pins, and what each decides

The pins differ from chip to chip. These are the common ones, from the datasheets ([the pinout explorer](#/tools/pinout/boot) has every chip):

| Chip | Pin | Decides | For a normal start | Inside the chip |
|---|---|---|---|---|
| ESP32 | GPIO0 | run the program, or download mode | high | pull-up |
| ESP32 | GPIO2 | must be low or floating to *enter* download mode | any | pull-down |
| ESP32 | GPIO12 | flash supply: 3.3 V or 1.8 V | **low** | pull-down |
| ESP32 | GPIO15 | boot messages on or off | high (messages on) | pull-up |
| ESP32 | GPIO5 | timing of the SDIO slave interface | high | pull-up |
| ESP32-S3 | GPIO0 | run the program, or download mode | high | pull-up |
| ESP32-S3 | GPIO45 | flash supply: 3.3 V or 1.8 V | low | pull-down |
| ESP32-S3 | GPIO46 | download mode and boot messages | low | pull-down |
| ESP32-S3 | GPIO3 | which pins carry JTAG (only if an eFuse says to look) | any | floating |
| ESP32-C3 | GPIO9 | run the program, or download mode | high | pull-up |
| ESP32-C3 | GPIO8 | must be high to *enter* download mode | high is safest | floating |
| ESP32-C3 | GPIO2 | must be high for either start | **high** | floating |
| ESP32-C6 | GPIO9, GPIO8 | as on the C3 | high | GPIO9 pull-up |
| ESP32-C6 | GPIO15, GPIO4, GPIO5 | JTAG pins; SDIO timing | any | — |

Two of these cause most of the grief:

- **GPIO12 on the ESP32.** High at reset tells the chip that its flash memory wants 1.8 V. Nearly every module has 3.3 V flash, which then cannot be read: the board resets for ever, printing nothing useful. Anything that idles high — an SD card data line, a sensor with its own pull-up — does this.
- **The boot pin** (GPIO0 on the ESP32 and S3, GPIO9 on the C3 and C6). Low at reset means "do not run the program: wait for an upload". That is what the BOOT button does on purpose. A button to ground, an LED to ground with a small resistor, or an encoder that happens to rest low does it by accident.

### Living with them

- **Use other pins first.** A project with pins to spare should simply leave the strapping pins alone; [the pin planner](#/tools/pinout/plan) keeps them for last.
- **If you must use one, respect its resting level.** A pin that needs to be high at reset can carry anything that idles high or floats: I2C lines with their pull-ups are a classic good fit for GPIO8 and GPIO9 on a C3. A pin that needs to be low can drive the gate of a MOSFET that has its own pull-down.
- **Outputs are easier than inputs.** A strapping pin used as an output is driven by nothing at reset (the chip's own pull resistor wins) unless the load itself pulls hard.
- **The pull resistors are weak** — tens of kilohms. Any real load beats them.
- **Bare chips need more care than modules.** On the ESP32-C3, GPIO2 and GPIO8 have no pull resistor inside: a board must add them. Modules and DevKits already have.

After the start the pin's past is forgotten: \`pinMode\`, \`digitalRead\` and the rest work as on any pin. Even the boot button can be read as an ordinary button by the running program — the simulation below shows both moments.

> [!key] Strapping pins are sampled once, at reset, to choose how the chip boots; afterwards they are normal pins. Never let an external part hold one at the wrong level during power-up — above all GPIO12 on an ESP32 and the boot pin on any chip.`,
  ideas: [
    'The chip reads a few pins at the instant reset is released and latches the result; the program has no say in it.',
    'After that instant the pins are ordinary GPIOs.',
    'Each chip has its own set: GPIO0, 2, 5, 12, 15 on the ESP32; GPIO0, 3, 45, 46 on the S3; GPIO2, 8, 9 on the C3.',
    'A part that holds a strapping pin at the wrong level at power-up stops the board booting, or changes how it boots.'
  ],
  pitfalls: [
    'Strapping pins cannot be used for anything — They can: they are normal GPIOs once the chip has started. What matters is only the level they see at reset.',
    'My program sets the pin correctly at the start of setup(), so it is safe — The level was read long before setup() ran. Only the circuit decides it.',
    'The internal pull-up will keep it high — It is tens of kilohms. An LED with a resistor to ground, a relay board or a sensor output overrides it easily.'
  ],
  terms: [
    { term: 'Strapping pin', also: ['bootstrap pin', 'boot strap'], def: 'A pin whose voltage the chip samples once, as reset is released, to choose a start-up option. It becomes a normal GPIO afterwards.' },
    { term: 'Download mode', also: ['bootloader mode', 'flash mode', 'UART download'], def: 'The state in which the chip\'s boot ROM waits for a program over the serial port or USB instead of running the one in flash. Entered by holding the boot pin low at reset.' },
    { term: 'Latch', also: ['latched'], def: 'To capture a value at one instant and hold it. The strapping levels are latched at reset and do not change when the pins later change.' },
    { term: 'Boot pin', also: ['BOOT button', 'GPIO0', 'GPIO9'], def: 'The strapping pin that selects between running the program and download mode: GPIO0 on the ESP32, S2 and S3; GPIO9 on the C3, C6 and C2; GPIO28 on the C5.' },
    { term: 'VDD_SDIO', also: ['VDD_SPI', 'flash voltage'], def: 'The supply pin of the chip that powers the flash memory. A strapping pin (GPIO12 on the ESP32, GPIO45 on the S3) selects 3.3 V or 1.8 V for it.' }
  ],
  choose: {
    good: ['I2C lines on pins that must be high at reset: their pull-ups hold the right level', 'Outputs to high-impedance inputs (a MOSFET gate, a logic input) that do not pull the pin', 'Signals from parts that are powered up only after the chip has started'],
    avoid: ['Buttons to ground on a pin that must be high at reset (unless it is meant to be the boot button)', 'LEDs, relay modules and optocoupler inputs that pull the pin at power-up', 'Anything that idles high on GPIO12 of an ESP32'],
    check: ['The strapping pins of your exact chip, in its datasheet or in the pinout explorer', 'What every part connected to them does while the chip is in reset', 'That the board still boots and still uploads with everything plugged in']
  },
  code: [
    {
      title: 'The boot button as an ordinary button',
      about: 'Once the program is running, the BOOT button is just a button on a pin with a pull-up. This reads it and lights the LED while it is held. (Holding it *during* reset is what selects download mode.)',
      needs: 'An ESP32 DevKit: the BOOT button is on GPIO0. On a C3 or C6 board use GPIO9.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'LED']],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          set pin (2) as [output v]
        forever
          if <(read pin (0)) = [LOW v]> then    // pressed: the button connects the pin to ground
            set pin (2) to [HIGH v]
          else
            set pin (2) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int BOOT_BUTTON = 0;       // GPIO9 on ESP32-C3 and C6 boards
        const int LED = 2;

        void setup() {
          pinMode(BOOT_BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool pressed = digitalRead(BOOT_BUTTON) == LOW;   // the button pulls the pin to ground
          digitalWrite(LED, pressed);
        }
      `,
      py: String.raw`
        from machine import Pin

        button = Pin(0, Pin.IN, Pin.PULL_UP)   # GPIO9 on ESP32-C3 and C6 boards
        led = Pin(2, Pin.OUT)

        while True:
            pressed = button.value() == 0      # the button pulls the pin to ground
            led.value(pressed)
      `,
      notes: ['Do not hold the button while you reset or power the board, or it will wait for an upload instead of running this.']
    }
  ],
  examples: [
    {
      title: 'The board that boots only when the SD card is unplugged',
      q: 'An ESP32 project uses an SD card in 4-bit mode; one of its data lines is on GPIO12. With the card inserted the board never starts. Why, and what are the cures?',
      steps: ['SD card data lines have pull-up resistors, so GPIO12 is high at power-up.', 'On the ESP32, GPIO12 high at reset selects 1.8 V for the flash supply. The module\'s flash needs 3.3 V, so it cannot be read and the boot fails.', 'Cure one: do not use GPIO12 — run the card over SPI on other pins.', 'Cure two, permanent: burn the eFuse that fixes the flash voltage at 3.3 V, so the chip stops looking at GPIO12. This cannot be undone.'],
      a: 'The card\'s pull-up straps the flash voltage to 1.8 V. Move the signal to another pin, or fix the voltage with an eFuse.'
    }
  ],
  quiz: [
    { q: 'An ESP32 board works on the bench. After a relay module is connected to GPIO12 it never starts again, even with the same program. What happened?', choices: ['The relay draws too much current', 'The relay module holds GPIO12 high at reset, selecting 1.8 V for the flash', 'GPIO12 cannot be an output', 'The program was erased'], a: 1, why: 'GPIO12 is the ESP32\'s flash-voltage strapping pin and must be low at reset. Many relay boards pull their input high. Moving the relay to another pin cures it.' },
    { q: 'A strapping pin can be used as a normal output after the chip has started.', a: true, why: 'The level is sampled once at reset and latched. From then on the pin behaves like any other GPIO.' },
    { q: 'Which pin puts an ESP32-C3 into download mode when held low during reset?', choices: ['GPIO0', 'GPIO2', 'GPIO9', 'GPIO12'], a: 2, why: 'On the C3 (and C6) the boot pin is GPIO9. GPIO0 is the boot pin of the ESP32, S2 and S3.' },
    { q: 'Why does setting a strapping pin with `pinMode` at the top of `setup()` not prevent a boot problem?', choices: ['pinMode is too slow', 'The chip sampled the pin before any program ran', 'Strapping pins ignore pinMode', 'setup() runs only once'], a: 1, why: 'Strapping happens in the first microseconds after reset, in the chip\'s own hardware and boot ROM. By the time your program runs, the decision is long made.' }
  ],
  applications: [
    'The BOOT button of every development board: a switch from the boot pin to ground.',
    'The auto-reset circuit that lets a computer put the chip into download mode by itself, with two transistors on the boot pin and the reset pin.',
    'Production test fixtures, which hold the boot pin low with a probe to program blank boards.',
    'Fault-finding: "it boots only with the sensor unplugged" is nearly always a strapping pin.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*, section "Strapping Pins"; the same section of the ESP32-S3, ESP32-C3 and ESP32-C6 datasheets.',
    'Espressif, *esptool documentation*, "Boot Mode Selection" (one page per chip).',
    'Espressif, *ESP-IDF Programming Guide*, GPIO reference: the table of pins and their restrictions for each chip.'
  ],
  sim: 'ref-strapping'
},

/* ================================================================ a chip page */
{
  id: 'soc-esp32-c3',
  parent: 'the-soc-series',
  title: 'ESP32-C3: small and cheap',
  level: 1,
  short: 'One RISC-V core, Wi-Fi 4 and Bluetooth LE 5, USB for flashing with no extra chip, 5 µA asleep. The modern low-cost workhorse — the chip that took over the jobs of the ESP8266.',
  keywords: ['ESP32-C3', 'C3', 'RISC-V', 'ESP8685', 'C3FH4', 'XIAO ESP32C3', 'SuperMini', 'low cost', 'USB Serial/JTAG', 'BLE 5', 'successor of ESP8266'],
  prereq: ['reading-the-family-names', 'chip-module-board'],
  related: ['soc-esp8266', 'soc-esp32-c2', 'soc-esp32-c6', 'xiao-esp32c3', 'supermini-and-zero-boards', 'choosing-a-chip'],
  body: `When a project needs a radio, a dozen pins and not much else, this is the chip. The ESP32-C3 was Espressif's first microcontroller on the open **RISC-V** instruction set: a single core at 160 MHz, 400 KB of RAM, Wi-Fi 4 and Bluetooth LE 5 on the usual 2.4 GHz radio, in a 5 × 5 mm package that often has 4 MB of flash inside it. It costs little more than the ESP8266 did and replaces it in almost every way.

### What it gives

| | ESP32-C3 |
|---|---|
| Processor | 1 × RISC-V at 160 MHz, no floating-point unit |
| Memory | 400 KB RAM, 384 KB ROM; 4 or 8 MB flash in the package on most versions; no PSRAM |
| Radio | Wi-Fi 4 (802.11 b/g/n, 2.4 GHz) · Bluetooth LE 5: 2 Mbit/s, long range, extended advertising, mesh |
| Pins | 22 GPIOs (16 on the newest versions; fewer on small boards) · strapping: GPIO2, 8, 9 |
| Analogue | 6 ADC channels, 12 bit — five usable in practice · no DAC · no touch pins |
| Buses | 2 UART · 1 I2C · 1 SPI for you · 1 I2S · 1 CAN (TWAI) · RMT 2 + 2 · 6 PWM channels |
| USB | a built-in serial port and JTAG debugger — not a keyboard or drive |
| Power | 3.0–3.6 V · about 5 µA in deep sleep · up to 335 mA while transmitting |
| Security | secure boot, flash encryption, digital-signature and HMAC peripherals |

(The same numbers, side by side with every other chip, are in [the chip explorer](#/tools/chips?c=esp32-c3).)

### What makes it pleasant

**USB without a bridge.** Two pins of the chip (GPIO18 and GPIO19) are a fixed USB serial port and JTAG debugger. A board needs only a connector: no CP2102 or CH340, fewer parts, and step-by-step debugging over the same cable.

**Real sleep.** Five microamps in deep sleep is a quarter of the ESP8266's figure, and with one core and a modern radio it wakes, sends and sleeps again quickly. It is the usual heart of battery sensors on Wi-Fi or Bluetooth.

**A grown-up toolbox.** Arduino, ESP-IDF, MicroPython, ESPHome and Rust all support it well, and because it is RISC-V, ordinary open tools work with it.

### What it lacks

One core means the radio's housekeeping and your program share it — fine for sensors and switches, tight for audio. There is **no Bluetooth Classic** (no audio streaming, no old serial Bluetooth), **no PSRAM** (so no camera and no large displays), no DAC, no touch sensing, and the USB cannot pretend to be a keyboard. Only one I2C and one free SPI bus exist. Of its six ADC channels the one on ADC2 is unusable for single readings because of a hardware limitation, leaving five.

And the pins need a moment's thought: of 22, six go to the flash on most versions, two are USB, two the serial console and three are [[strapping-pins|strapping pins]] — which is why thumb-sized C3 boards offer only about eleven.

### Where it sits in the family

Below it, the [[soc-esp32-c2|ESP32-C2]] is smaller and cheaper still, with less of everything. Beside it, the [[soc-esp32-c6|ESP32-C6]] adds Wi-Fi 6, Zigbee and Thread for a little more. Above it, the [[soc-esp32-s3|ESP32-S3]] has two cores, PSRAM and real USB. If the project is "measure something, report it, sleep" or "switch something from a phone", the C3 is enough — and being enough is its virtue.

> [!key] The ESP32-C3 is the simple, cheap, low-power choice: Wi-Fi and Bluetooth LE, one RISC-V core, USB flashing built in. Choose it unless you need Bluetooth audio, many pins, a camera or display memory, or the newer radios.`,
  ideas: [
    'One RISC-V core at 160 MHz with Wi-Fi 4 and Bluetooth LE 5: the modern replacement for the ESP8266.',
    'A USB serial port and debugger are built into the chip, so boards need no bridge.',
    'About 5 µA in deep sleep makes it a natural battery sensor.',
    'It has no Bluetooth Classic, no PSRAM, no DAC, no touch pins and few GPIOs.'
  ],
  pitfalls: [
    'The C3 is a cheaper ESP32 with the same abilities — It is a different chip: one core instead of two, no Bluetooth Classic, no DAC or touch, far fewer pins. Programs and libraries written for the ESP32\'s second core, DAC or Classic Bluetooth do not carry over.',
    'Its USB port makes it a USB device like the S3 — The C3\'s USB is a fixed serial-and-debug function. It cannot be a keyboard, mouse or drive; that needs the USB OTG of the S2, S3 or P4.',
    'Six ADC channels means six analogue inputs — Five: the single ADC2 channel cannot be used for ordinary readings.'
  ],
  terms: [
    { term: 'RISC-V', also: ['RV32IMC'], def: 'An open, royalty-free processor instruction set. The C, H and P series of the ESP32 family use 32-bit RISC-V cores; the original ESP32 and the S series use Xtensa cores.' },
    { term: 'USB Serial/JTAG', also: ['USB-JTAG', 'built-in USB'], def: 'A fixed USB function inside the chip that appears to a computer as a serial port and a JTAG debugger. It needs no bridge chip and cannot act as any other USB device.' },
    { term: 'ESP8685', also: ['ESP8685H4'], def: 'A member of the ESP32-C3 group in a smaller 4 × 4 mm package with 4 MB of flash, sold mainly for volume products.' },
    { term: 'Deep-sleep current', also: [], def: 'What the chip draws with everything off except a timer and a little memory: about 5 µA for the ESP32-C3. A board adds the current of its regulator and LEDs, often far more.' }
  ],
  choose: {
    good: ['Battery sensors that wake, report over Wi-Fi or Bluetooth LE, and sleep', 'Smart switches, plugs and lamps; anything commissioned from a phone over Bluetooth LE', 'Small products where cost and size matter and a dozen pins are enough', 'A first board that needs no USB bridge and no drivers'],
    avoid: ['Bluetooth audio or old serial Bluetooth: only the original ESP32 has Bluetooth Classic', 'Cameras, large displays, big buffers: there is no PSRAM', 'USB keyboards, mice and MIDI devices: choose the ESP32-S3', 'Zigbee, Thread or Wi-Fi 6: choose the ESP32-C6'],
    check: ['How many pins your board really exposes — often eleven', 'That analogue inputs fit in five channels (GPIO0–4)', 'What is wired to GPIO2, 8 and 9 at power-up', 'The board\'s own sleep current, not the chip\'s']
  },
  code: [
    {
      title: 'Ask the chip who it is',
      about: 'Prints the chip\'s model, revision, clock, flash size and unique address — the first thing to run on a board of uncertain origin.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Cores: ] (number of cores))
          print (join [Clock in MHz: ] (CPU frequency))
          print (join [Flash in MB: ] (flash size))
          print (join [MAC: ] (MAC address))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                   // give the monitor time to open
          Serial.printf("Chip:   %s rev %d\n", ESP.getChipModel(), ESP.getChipRevision());
          Serial.printf("Cores:  %d\n", ESP.getChipCores());
          Serial.printf("Clock:  %lu MHz\n", (unsigned long)ESP.getCpuFreqMHz());
          Serial.printf("Flash:  %lu MB\n", (unsigned long)(ESP.getFlashChipSize() / (1024 * 1024)));
          uint64_t mac = ESP.getEfuseMac();              // the factory address, lowest byte first
          Serial.printf("MAC:    %012llX\n", (unsigned long long)mac);
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, machine, esp, binascii

        print("Chip:  ", sys.implementation._machine)
        print("Clock: ", machine.freq() // 1_000_000, "MHz")
        print("Flash: ", esp.flash_size() // (1024 * 1024), "MB")
        print("ID:    ", binascii.hexlify(machine.unique_id(), ":").decode())
      `,
      output: `
        Chip:   ESP32-C3 rev 4
        Cores:  1
        Clock:  160 MHz
        Flash:  4 MB
        MAC:    7CDFA1B2C3D4
      `,
      notes: ['A flash size that disagrees with the listing you bought from is the commonest sign of a relabelled board.', 'MicroPython does not report the core count; the chip name it prints tells you.']
    }
  ],
  quiz: [
    { q: 'A project streams music from a phone to a speaker over Bluetooth. Is the ESP32-C3 suitable?', choices: ['Yes, it has Bluetooth 5', 'No: music streaming uses Bluetooth Classic, which the C3 lacks', 'Yes, with PSRAM added', 'Only at 2 Mbit/s'], a: 1, why: 'Phone-to-speaker audio (A2DP) is a Bluetooth Classic profile. The C3 has Bluetooth Low Energy only; among the common chips only the original ESP32 has Classic.' },
    { q: 'Why can a C3 board do without a USB-to-serial bridge chip?', choices: ['It is programmed over Wi-Fi only', 'The chip contains a fixed USB serial and JTAG function on two of its pins', 'RISC-V chips need no programming port', 'It uses the ESP8266 bootloader'], a: 1, why: 'GPIO18 and GPIO19 are a built-in USB Serial/JTAG controller, so the USB connector can be wired straight to the chip.' },
    { q: 'The ESP32-C3 supports external PSRAM for large frame buffers.', a: false, why: 'It has no PSRAM interface. Chips that do include the ESP32, S2, S3, C5, C61 and P4.' },
    { q: 'Which is the best reason to choose an ESP32-C6 over a C3?', choices: ['It has two cores', 'It adds Zigbee, Thread and Wi-Fi 6', 'It has Bluetooth Classic', 'It has a camera interface'], a: 1, why: 'The C6 keeps the single RISC-V core and adds an 802.15.4 radio (Zigbee, Thread) and Wi-Fi 6. It has neither a second core nor Bluetooth Classic.' }
  ],
  applications: [
    'Thumb-sized boards — XIAO ESP32C3, QT Py ESP32-C3, the many "SuperMini" boards — are built on it.',
    'Smart plugs, bulbs and relays, where it has largely replaced the ESP8266.',
    'Battery-powered temperature and door sensors reporting over Wi-Fi, Bluetooth LE or ESP-NOW.',
    'A radio co-processor beside a larger microcontroller, as on the Arduino Portenta C33.'
  ],
  history: 'Announced at the end of 2020 as Espressif\'s first RISC-V system-on-chip, after years of Xtensa cores licensed from Cadence. It reached volume the following year and set the pattern for the C and H series that followed.',
  sources: [
    'Espressif, *ESP32-C3 Series Datasheet* (version 2.4): features, pin table, electrical characteristics, strapping pins.',
    'Espressif, *ESP-IDF Programming Guide* for the ESP32-C3: ADC reference (the ADC2 limitation) and USB Serial/JTAG.',
    'Espressif, *ESP8685 Datasheet* (the 4 × 4 mm member of the group).'
  ],
  sim: { id: 'ref-chip', params: { chip: 'esp32-c3' } }
}
);
