/* HYPER-ESP32 · content/gpio-and-pinouts.js
 *
 * Topic "GPIO and pinouts" (branch Pins and Power). Eleven pages; the twelfth, strapping-pins, is in content/reference.js.
 * Every statement about a pin comes from the pin tables of the catalogue (the pinout explorer shows the same facts).
 * Simulations: sims/gpio-and-pinouts.js (topic code gp).
 */
Hyper.add(
/* ================================================================ reading-a-pinout */
{
  id: 'reading-a-pinout',
  parent: 'gpio-and-pinouts',
  title: 'Reading a pinout diagram',
  level: 1,
  short: 'A pinout is the map of a board: for every pad its label, its GPIO number, what else the pin can do, and what to beware of. Learn to read one before you wire anything.',
  keywords: ['pinout', 'pin diagram', 'pin map', 'header', 'GPIO', 'pin label', 'silkscreen', 'ADC channel', 'touch', 'RTC_GPIO', 'VP', 'VN', '3V3', 'EN', 'GND', 'J2', 'J3'],
  prereq: ['chip-module-board', 'anatomy-of-a-dev-board'],
  related: ['gpio-numbers-and-board-labels', 'strapping-pins', 'input-only-and-special-pins', 'safe-pins-esp32', 'safe-pins-s3-c3-c6', 'planning-pins', 'gpio-matrix-and-io-mux'],
  body: `A pinout is a map. The board in front of you has two rows of holes and a few dozen tiny labels; the pinout says what every hole is wired to and what that wire can do. Without it you are guessing, and on an ESP32 a wrong guess is expensive: a board that no longer boots ([[strapping-pins|strapping pins]]), an analogue input that dies when Wi-Fi starts ([[adc1-adc2-and-wifi]]), a pad wired to the flash memory.

### What a pinout tells you about each pin

- **The label** printed beside the pad: \`23\`, \`D5\`, \`TX\`, \`VP\`, \`3V3\`.
- **The GPIO number**: the chip's own name for the pin, and the only name a program understands ([[gpio-numbers-and-board-labels]]). On the ESP32-DevKitC V4 the pad labelled VP is GPIO36 and the pad labelled TX is GPIO1.
- **What else the pin can do**: an analogue channel, a touch channel, wake-up from deep sleep, a default role in I2C or SPI.
- **What to beware of**: strapping, flash, USB, serial console, input only.

The tags use a small, fixed vocabulary:

| Tag | Meaning |
|---|---|
| \`ADC1_CH6\`, \`ADC2_CH5\` | analogue input: converter 1 or 2, channel number |
| \`TOUCH5\` | a capacitive touch channel |
| \`RTC_GPIO15\` | in the always-on part of the chip: can wake it from deep sleep |
| \`DAC_1\` | an 8-bit analogue output (ESP32 and ESP32-S2 only) |
| \`MTDI\`, \`MTCK\`, \`MTMS\`, \`MTDO\` | the JTAG debug signals; ordinary pins unless a debugger is attached |
| \`VP\`, \`VN\` | old names of GPIO36 and GPIO39 (original ESP32) |
| \`EN\` or \`RST\` | the reset line: pulled low, it restarts the chip |
| \`D0\`–\`D3\`, \`CMD\`, \`CLK\` | on the ESP32-DevKitC V4 header these are GPIO7, 8, 9, 10, 11 and 6: the flash memory |

### Reading two lines

GPIO34 on that board carries *ADC1_CH6 · RTC_GPIO4 · input only*. It can measure a voltage on converter 1, so it keeps working while Wi-Fi is on; it can wake the chip from deep sleep; and it can only be an input, with no internal pull resistors. An excellent pin for a sensor, a useless one for an LED.

GPIO12 on the same board carries *ADC2_CH5 · TOUCH5 · JTAG MTDI · strapping*. It looks generous, but the last tag says the chip samples its level at reset to choose the flash voltage, so whatever you attach must leave it low.

### A routine for a new board

1. **Find the board's own diagram**, not only the chip's: boards of one chip are wired differently.
2. **Find power first**: 3V3 and GND, then 5V or VIN, then EN or RST.
3. **Find your pins by GPIO number** and read their tags.
4. **Look for the red flags**: flash pins, USB pins, console pins, strapping pins.
5. **Write the choices down** at the top of the program, one comment per pin.

[The pinout explorer](#/tools/pinout) shows every chip and board this way; the simulation below lets you read the pins of a real board.

> [!key] A pinout gives each pad a label, a GPIO number, the other jobs the pin can do and its warnings. Read the diagram of your own board, find power first, then check every pin you plan to use for flash, USB, console and strapping duties.`,
  ideas: [
    'A pinout maps each pad of a board to a label, a GPIO number, extra functions and warnings.',
    'A program uses the GPIO number; the label on the board is the maker\'s own choice.',
    'Tags such as ADC1_CH6, TOUCH5 and RTC_GPIO15 say what else a pin can do.',
    'Find power and ground first, then check every pin you plan to use for flash, USB, console and strapping duties.'
  ],
  pitfalls: [
    'A pinout of my chip is a pinout of my board — The chip\'s pin table says what the silicon can do. The board decides which pads are wired out, what they are called and what is attached to them. Read the diagram of your own board.',
    'If a pad is on the header, I can use it — Headers expose pins that are wired to the flash memory (D0 to D3, CMD and CLK on some ESP32 boards), to USB or to the serial console. The tags tell you which.',
    'All GPIO pins are equal — Each has its own abilities and limits: input-only pins, analogue pins, wake-up pins, strapping pins.'
  ],
  terms: [
    { term: 'Pinout', also: ['pin diagram', 'pin map', 'pin layout'], def: 'A diagram or table that names every pin of a chip or board and says what it connects to, what else it can do and what to beware of.' },
    { term: 'GPIO', also: ['general-purpose input/output', 'GPIO number', 'IO'], def: 'A pin whose job the program chooses: input, output, or a connection to a peripheral. The GPIO number is the chip\'s own name for it, such as GPIO4.' },
    { term: 'Header', also: ['pin header', 'headers'], def: 'The row of holes or pins along a board\'s edge to which wires and shields are connected. Dev boards have two, left and right.' },
    { term: 'Silkscreen', also: ['board labels', 'legend'], def: 'The white printing on a board. Its pin names are the maker\'s own and need not match the GPIO numbers.' },
    { term: 'RTC GPIO', also: ['RTC IO', 'LP GPIO', 'wake-up pin'], def: 'A pin in the chip\'s always-on domain. Only these pins can wake the chip from deep sleep; on the ESP32 they are GPIO0, 2, 4, 12–15, 25–27 and 32–39.' }
  ],
  examples: [
    {
      title: 'Is this pad free?',
      q: 'On an ESP32-DevKitC V4 you want one more output for an LED and you see a pad labelled D2 close to the others. Is it a good choice?',
      steps: ['Translate the label: on this board D2 is GPIO9.', 'Look the pin up: GPIO9 is one of the SPI flash data lines (GPIO6 to 11) on every common module.', 'Driving it would interfere with the memory the program is running from.'],
      a: 'No. D2 here is a flash pin. Choose a GPIO whose tags carry no warning, such as GPIO21 or GPIO27.'
    }
  ],
  quiz: [
    { q: 'A pinout shows GPIO34 as "ADC1_CH6 · input only". Which job is it good for?', choices: ['Reading an analogue sensor', 'Driving an LED', 'Driving a relay', 'Being the SCL line of an I2C bus'], a: 0, why: 'An input-only pin has no output driver, so it cannot light an LED, switch a relay or drive a bus clock. As an ADC1 pin it reads analogue voltages, and keeps doing so with Wi-Fi on.' },
    { q: 'The label printed beside a pad always equals its GPIO number.', a: false, why: 'Labels are the maker\'s own: 23 may well be GPIO23, but D2, A0, VP and TX are not. Translate each label to its GPIO number before looking the pin up.' },
    { q: 'On an ESP32-DevKitC V4, what is the pad labelled D2?', choices: ['GPIO2', 'GPIO9, one of the flash pins', 'The second digital pin of the Arduino core', 'GPIO4'], a: 1, why: 'The D0 to D3, CMD and CLK pads of this header are GPIO7, 8, 9, 10, 11 and 6, wired to the flash memory. They look like ordinary pads and are not.' },
    { q: 'You have a new board. What is the first thing to look for on its pinout?', choices: ['The fastest pin', 'The power pads (3V3, GND, 5V) and the reset pad', 'The pin with the most functions', 'The LED pin'], a: 1, why: 'Power and ground first: a wrong connection there damages the board. Only then choose signal pins, one by one, against their tags.' }
  ],
  applications: [
    'Choosing pins for a new project: the pinout is the first document opened.',
    'Fault-finding: "it boots only when the sensor is unplugged" is solved by reading the tags of the pin it is on.',
    'Moving a design to another board of the same chip, where the pads sit in a different order.',
    'Drawing the wiring diagram of a project, with the GPIO numbers that will appear in the program.'
  ],
  sources: [
    'Espressif, *ESP32-DevKitC V4 Getting Started Guide*: the header block descriptions (J2 and J3).',
    'Espressif, *ESP32 Series Datasheet*, the pin overview and the IO MUX and GPIO tables; the same sections of the ESP32-S3, ESP32-C3 and ESP32-C6 datasheets.',
    'Makers\' own pinout pages for their boards (Espressif, Seeed Studio, Adafruit, Arduino).'
  ],
  sim: 'gp-pinout-reader'
},

/* ================================================================ gpio-numbers-and-board-labels */
{
  id: 'gpio-numbers-and-board-labels',
  parent: 'gpio-and-pinouts',
  title: 'GPIO numbers and board labels',
  level: 1,
  short: 'A program speaks GPIO numbers; a board is printed with the maker\'s own labels, and the same label such as D2 is a different pin on every board. Always translate the label to a GPIO number first.',
  keywords: ['GPIO number', 'board label', 'D0', 'D1', 'D2', 'A0', 'pin name', 'pins_arduino.h', 'board variant', 'silkscreen', 'NodeMCU', 'XIAO', 'D-labels', 'pin numbering', 'package pin'],
  prereq: ['reading-a-pinout', 'choosing-a-framework'],
  related: ['anatomy-of-a-dev-board', 'the-xiao-form-factor', 'nodemcu-and-doit-boards', 'arduino-nano-esp32', 'safe-pins-esp32', 'digital-output'],
  body: `Ask three people what "pin 4" is and you may get three answers: the fourth pad on the left row of the board, GPIO4 of the chip, or the pad printed D4 on the silkscreen. A program understands only one of them.

### Three kinds of number

- **The package pin**: the leg or pad of the chip's own package, 1 to 48 or so. It matters only to someone designing a board and never appears in a program.
- **The GPIO number**: the chip's name for the pin, such as GPIO4. This is what \`pinMode(4, OUTPUT)\` and MicroPython's \`Pin(4)\` mean, and what ESP-IDF calls \`GPIO_NUM_4\`.
- **The board label**: whatever the maker printed. Often the GPIO number (23, 22), sometimes a role (TX, RX, SDA), sometimes a made-up sequence: D0, D1, D2 … or A0, A1 ….

### The same label, a different pin

The D-labels come from Arduino boards and from the ESP8266 NodeMCU, where D2 is GPIO4. Later makers kept the style but chose their own order. The pad called D2:

| Board | D2 is | Verdict from the pin table |
|---|---|---|
| NodeMCU V1.0 and LOLIN D1 mini (ESP8266) | GPIO4 | free to use |
| XIAO ESP32C3 | GPIO4 | with care: a JTAG pad, free by default |
| XIAO ESP32C6 | GPIO2 | free to use |
| XIAO ESP32S3 | GPIO3 | with care: a strapping pin |
| Arduino Nano ESP32 | GPIO5 | free to use |
| ESP32-DevKitC V4 | GPIO9 | **do not use**: it is a flash pin |

Move a sketch from one board to another using D2 and it will compile, run, and drive a different pin, or one that must never be driven.

### What each tool wants

- **Arduino core.** A number is a GPIO number. Some board variants also define names such as \`D2\`, \`A0\` or \`LED_BUILTIN\`; code using them works on that family only, while code using GPIO numbers works on every board of the chip.
- **MicroPython.** \`Pin(n)\` always takes the GPIO number. Generic builds know no D-labels.
- **ESP-IDF.** \`GPIO_NUM_n\`, the GPIO number again.

### A habit that saves hours

Write the GPIO number in the code and the label in a comment: \`const int LED_PIN = 10; // D10 on the XIAO ESP32C3\`. Look the pin up in a pin table by GPIO number: every table in this app, the pinout explorer included, is in GPIO numbers. When two diagrams disagree, believe the one in GPIO numbers and check it against the silkscreen of your own board.

> [!key] Programs speak GPIO numbers. A label such as D2 is the maker's own and is a different GPIO on every board, once even a flash pin. Translate every label to its GPIO number before you look the pin up, and keep both in the code.`,
  ideas: [
    'Three numbers name a pin: the package pin, the GPIO number and the board label; only the GPIO number goes into a program.',
    'The same label (D2) is a different GPIO on different boards.',
    'Arduino code written with D-labels runs on one board family only; code with GPIO numbers runs on any board of the chip.',
    'Keep the GPIO number in the code and the label in the comment.'
  ],
  pitfalls: [
    'D2 is GPIO2 — Only by coincidence. On the boards in the table above D2 is GPIO4, 2, 3, 5 or 9.',
    'A sketch that compiles for another board uses the same pins — A label constant such as D2 compiles on any board that defines it and silently means a different GPIO there.',
    'The number printed on the pad is the pin number of the chip — The package pin number is never used in code. A label that is a plain number is usually, but not always, the GPIO number: check the board\'s guide.'
  ],
  terms: [
    { term: 'GPIO number', also: ['IO number', 'GPIOn'], def: 'The chip\'s own number for a pin. It is the number programs use in every framework: Arduino pinMode(4, …), MicroPython Pin(4), ESP-IDF GPIO_NUM_4.' },
    { term: 'Board label', also: ['pin label', 'silkscreen name', 'D-label'], def: 'The name a maker prints beside a pad of a board: a GPIO number, a role such as TX, or a sequence such as D0 to D10. It differs from board to board.' },
    { term: 'Package pin', also: ['pad number', 'chip pin'], def: 'The numbered leg or pad of the chip\'s package. It matters when designing a board and never appears in a program.' },
    { term: 'Board variant', also: ['pins_arduino.h', 'variant'], def: 'The Arduino core\'s description of one board: its pin names (D0, A0, LED_BUILTIN, SDA …) and defaults. Choosing the right board in the IDE selects the right variant.' }
  ],
  code: [
    {
      title: 'Blink the pad labelled D10 on a XIAO ESP32C3',
      about: 'The program names the pin by its GPIO number and keeps the label in a comment, so that it still means the same pin on any other board of the chip.',
      needs: 'A Seeed Studio XIAO ESP32C3 and an LED with a resistor.',
      wiring: [['GPIO10 (pad D10)', '330 Ω → LED → GND', 'the long leg of the LED towards the resistor']],
      blocks: `
        when started
          set pin (10) as [output v]    // D10 on the XIAO ESP32C3
        forever
          set pin (10) to [HIGH v]
          wait (0.5) seconds
          set pin (10) to [LOW v]
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 10;          // the GPIO number; D10 on the XIAO ESP32C3 (this core also accepts D10)

        void setup() {
          pinMode(LED_PIN, OUTPUT);
        }

        void loop() {
          digitalWrite(LED_PIN, HIGH);
          delay(500);
          digitalWrite(LED_PIN, LOW);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LED_PIN = 10                     # the GPIO number; D10 on the XIAO ESP32C3 (MicroPython has no D10)
        led = Pin(LED_PIN, Pin.OUT)

        while True:
            led.value(1)
            time.sleep_ms(500)
            led.value(0)
            time.sleep_ms(500)
      `,
      notes: ['With a 330 Ω resistor a red LED draws about 4 mA: see [[pin-current-limits]].', 'On another board of the same chip, such as an ESP32-C3-DevKitM-1, GPIO10 is on the header with its own label: look the board up before you copy the number.']
    }
  ],
  choose: {
    good: ['GPIO numbers in the code, labels in comments: the code survives a change of board', 'D-labels for a first sketch on one named board whose guide uses them', 'The same GPIO number in all three languages of a project'],
    avoid: ['Using a D-label constant in code meant for several boards', 'Copying a pin number from a tutorial written for another board', 'Trusting the label without looking at the pin table'],
    check: ['The label-to-GPIO table in your board\'s own guide', 'The pin\'s verdict in the pinout explorer once you know its GPIO number', 'Whether the Arduino variant you selected defines the names you use']
  },
  examples: [
    {
      title: 'The tutorial that does not work',
      q: 'A tutorial for the NodeMCU says "connect the relay to D2". You build the same project on an ESP32-DevKitC V4 and connect it to the pad labelled D2. What goes wrong?',
      steps: ['On the NodeMCU D2 is GPIO4.', 'On the DevKitC V4 the pad D2 is GPIO9, a flash data line.', 'The program, which uses GPIO4, drives a different, unconnected pin; wired to GPIO9 the relay would disturb the flash.'],
      a: 'Translate to GPIO numbers: use GPIO4 in the program and wire the relay to the pad labelled 4 on the DevKitC V4 — GPIO4 is a free pin on that board.'
    }
  ],
  quiz: [
    { q: 'In a MicroPython program, what does Pin(5) mean?', choices: ['The pad labelled D5', 'The fifth pin of the header', 'GPIO5', 'Package pin 5'], a: 2, why: 'MicroPython always takes the GPIO number. It knows no D-labels on a generic build.' },
    { q: 'A sketch using D2 compiles for an XIAO ESP32C3 and for an XIAO ESP32S3. It drives the same pin on both.', a: false, why: 'D2 is GPIO4 on the XIAO ESP32C3 and GPIO3 on the XIAO ESP32S3. The same label is a different GPIO on each board.' },
    { q: 'Which habit makes code survive a change of board best?', choices: ['Using the D-labels of the first board', 'Using GPIO numbers, with the label in a comment', 'Using the package pin numbers', 'Using the order of the pads on the header'], a: 1, why: 'GPIO numbers mean the same in every framework and on every board of the chip; the comment records which pad it was.' },
    { q: 'On an ESP32-DevKitC V4 you connect an LED to the pad labelled D1. What have you connected it to?', choices: ['GPIO1, the serial console TX', 'GPIO8, a flash pin', 'GPIO4, a free pin', 'The first digital pin of the Arduino core'], a: 1, why: 'The D0 to D3 pads of that header are GPIO7, 8, 9, 10 (CMD is 11, CLK is 6): D1 is GPIO8, wired to the flash memory.' }
  ],
  applications: [
    'Porting a tutorial from one board to another: every pin has to be translated through its GPIO number.',
    'Boards sold in several versions (XIAO, QT Py, Feather) where the same label sits on a different GPIO on each chip.',
    'Documenting a project: a wiring table with the GPIO number, the board label and the job of each pin.',
    'Reading other people\'s code, where a bare D5 or A0 means nothing without the board it was written for.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, board variants (pins_arduino.h) and the GPIO API.',
    'MicroPython documentation, *Quick reference for the ESP32*: Pins and GPIO (pin numbers are GPIO numbers).',
    'The makers\' pinout pages: Seeed Studio XIAO ESP32C3, C6 and S3, Arduino Nano ESP32, NodeMCU, Espressif DevKit user guides.'
  ],
  sim: 'gp-label-match'
},

/* ================================================================ three-volt-logic */
{
  id: 'three-volt-logic',
  parent: 'gpio-and-pinouts',
  title: '3.3 V logic and why 5 V hurts',
  level: 1,
  short: 'The ESP32 family runs its pins at 3.3 V and they are not 5 V tolerant. Over-voltage turns on a protection diode that pours current into the supply rail. A divider or a level shifter is the cure.',
  keywords: ['3.3 V', '5 V', 'logic level', 'level shifter', 'voltage divider', '5 V tolerant', 'clamp diode', 'protection diode', 'over-voltage', 'HC-SR04', 'echo', 'burnt GPIO', 'TTL', 'CMOS threshold'],
  prereq: ['reading-a-pinout', 'electronics:voltage-divider'],
  related: ['level-shifters', 'voltage-dividers-for-inputs', 'protection-parts', 'the-3v3-rail', 'i2c-pull-ups-and-bus-problems', 'pin-current-limits', 'optocouplers'],
  body: `The ESP32 family runs on 3.3 V: the supply may be anything from 3.0 to 3.6 V, a pin's "high" is the supply voltage and its "low" is zero. The pins put out 3.3 V and are built to receive 3.3 V. They are **not 5 V tolerant.** Plenty of parts still speak 5 V (an Arduino shield, an ultrasonic module, a "5 V sensor" whose output follows its supply), and joining them without thought is among the commonest ways to kill a board.

### What 5 V does to a pin

Behind every pin sit protection diodes, one to ground and one to the supply rail, meant to absorb a brief spark of static. When a signal rises above the rail by more than a diode drop, the upper diode conducts and pushes current into the 3.3 V supply. Nothing limits that current except the source and whatever resistance lies between, so a 5 V logic output can force tens of milliamps through a structure never specified for a continuous current. What follows depends on luck and time: a pin that dies at once, a pin that works for a month, a chip that is warm for no reason. The datasheets allow a pin to rise only a few tenths of a volt above its supply. That a board survived your test is not a rating.

### Where 5 V sneaks in

- **Modules powered from 5 V whose outputs follow it:** the echo pin of an HC-SR04 ultrasonic sensor is the classic.
- **I2C breakouts with pull-ups to their own supply:** run the breakout from 5 V and SDA and SCL idle at 5 V ([[i2c-pull-ups-and-bus-problems]]).
- **A serial line from a 5 V device** and any cable from an Arduino shield.
- **The 5V pad of a dev board:** that is the USB supply; never connect it to a GPIO.

### The fixes

| Situation | What to do |
|---|---|
| A slow 5 V signal into an input (a pulse, a switch, a flag) | A voltage divider: 1.8 kΩ over 3.3 kΩ turns 5 V into 3.2 V ([[voltage-dividers-for-inputs]]) |
| A bus or a fast signal (I2C, SPI, UART) | A level shifter made for the job ([[level-shifters]]); a divider cannot carry a bidirectional bus |
| An ESP output into a 5 V part | Many 5 V parts read 3.3 V as high; some, powered at 5 V, need about 3.5 V: check the part's minimum high level, else shift up |
| Noisy, long or differently grounded wiring | An optocoupler ([[optocouplers]]) |

A series resistor of a kilohm or so limits the clamp current, but the pin still sits above its rating; treat it as a rescue, never a design. And before wiring anything, measure the signal with a multimeter: a "5 V" line may sit above 5 V.

> [!key] ESP32 pins are 3.3 V devices and not 5 V tolerant: over-voltage switches on a clamp diode that pushes current into the supply. Divide slow 5 V signals down, shift buses with a proper level shifter, and never rely on a series resistor as the fix.`,
  ideas: [
    'The ESP32 family runs on 3.3 V (supply 3.0 to 3.6 V); a pin\'s high level is the supply voltage.',
    'The pins are not 5 V tolerant: above the rail a protection diode conducts into the supply.',
    'A voltage divider fixes slow signals; a level shifter fixes buses; a series resistor is only a rescue.',
    '5 V arrives through sensor outputs, breakouts with pull-ups to 5 V, serial lines from older boards and the USB 5 V pad.'
  ],
  pitfalls: [
    'It worked on the bench, so it is safe — Over-voltage damage is cumulative and may show only weeks later. A datasheet rating is a promise; one survival is not.',
    'A series resistor makes 5 V safe — It limits the clamp current, yet the pin still sits above its rating, and the rail is still pushed up. Use a divider or a level shifter.',
    'A voltage divider works for I2C — I2C lines are bidirectional and open-drain: a divider breaks the bus. Use a bidirectional level shifter.'
  ],
  terms: [
    { term: '3.3 V logic', also: ['3V3 logic', 'LVCMOS33'], def: 'Digital signals whose high level is about 3.3 V and low level about 0 V. All the chips of the ESP32 family use it, with a supply of 3.0 to 3.6 V.' },
    { term: '5 V tolerant', also: ['5 V-tolerant input'], def: 'Said of an input that is specified to survive 5 V although the chip runs at 3.3 V. The ESP32 pins are not 5 V tolerant.' },
    { term: 'Clamp diode', also: ['protection diode', 'ESD diode'], def: 'A diode inside a pin, to the supply rail or to ground, that conducts when the voltage leaves the supply range and so protects the chip against static. It is not built to carry a continuous current.' },
    { term: 'Level shifter', also: ['level translator', 'logic-level converter'], def: 'A circuit or chip that carries a logic signal between two supply voltages, such as 3.3 V and 5 V. Bidirectional versions exist for I2C.' },
    { term: 'Logic level', also: ['VIH', 'VIL', 'high level', 'low level'], def: 'The voltage range an input reads as "high" or "low". Between the two ranges the reading is undefined.' }
  ],
  formulas: [
    {
      name: 'Voltage divider to bring 5 V down to 3.3 V',
      expr: 'Vout = Vin*R2/(R1 + R2)', tex: 'V_{\\text{out}} = V_{\\text{in}}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vout: { name: 'voltage at the ESP pin', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: '5 V signal', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{in}}' },
        R1: { name: 'upper resistor (towards the signal)', q: 'resistance', unit: 'kΩ', value: 1.8, tex: 'R_1' },
        R2: { name: 'lower resistor (towards ground)', q: 'resistance', unit: 'kΩ', value: 3.3, tex: 'R_2' }
      },
      solveFor: 'Vout',
      note: 'For slow signals only. The pin input is almost open, so the divider is not loaded; at high speed the resistors and the pin capacitance round the edges.',
      stories: {
        Vout: 'A 5 V echo line goes through {R1} and {R2} to an ESP32 pin. What voltage reaches the pin?',
        R1: 'You want {Vout} at the pin from a {Vin} signal, with {R2} to ground. What upper resistor do you need?'
      }
    }
  ],
  examples: [
    {
      title: 'Echo pin of an ultrasonic sensor',
      q: 'An ultrasonic module powered from 5 V has a 5 V echo output. You have 1.8 kΩ and 3.3 kΩ resistors. What does the ESP32 pin see, and how much current flows in the divider?',
      steps: [{ text: 'The divider output is', tex: 'V = 5\\,\\mathrm{V}\\cdot\\frac{3.3}{1.8+3.3} = 3.24\\,\\mathrm{V}' }, 'That is under the 3.6 V limit and above the high threshold of the input, so it reads as high.', { text: 'The current through the pair is', tex: 'I = \\frac{5\\,\\mathrm{V}}{5.1\\,\\mathrm{k\\Omega}} \\approx 1\\,\\mathrm{mA}' }, 'Only while the echo is high, and the module can supply that.'],
      a: 'About 3.24 V at the pin, about 1 mA in the divider: a safe interface for a slow echo pulse.'
    }
  ],
  choose: {
    good: ['A divider for a slow one-way signal from a 5 V part into an ESP input', 'A bidirectional level shifter for I2C', 'A level shifter chip for SPI, UART and fast edges', 'An optocoupler where grounds differ or wires are long'],
    avoid: ['A bare 5 V output wired to a GPIO', 'A series resistor as the only protection', 'A divider on an I2C or other bidirectional line', 'Assuming that "it did not burn out" proves tolerance'],
    check: ['The real voltage of the signal with a multimeter', 'Whether the breakout board pulls its lines up to its own supply', 'The minimum high-level voltage of the 5 V part you are driving', 'That every board shares a common ground']
  },
  quiz: [
    { q: 'An HC-SR04 sensor is powered from 5 V and its echo pin outputs 5 V pulses. What is the right way to connect it to an ESP32 input?', choices: ['Straight to the GPIO, the pin will cope', 'Through a voltage divider (for example 1.8 kΩ and 3.3 kΩ)', 'Through a pull-down resistor only', 'Through a 100 Ω series resistor only'], a: 1, why: 'A divider brings 5 V down to about 3.2 V. A pull-down does not limit the voltage and a small series resistor leaves the pin far above its rating.' },
    { q: 'A 1 kΩ series resistor makes a 5 V signal safe for an ESP32 pin.', a: false, why: 'It limits the current into the clamp diode, but the pin still sits above its rating (the diode holds it about a diode drop above the rail) and the rail is still being pushed up. It is a rescue, not a design.' },
    { q: 'What does a pin\'s protection diode do when a 5 V signal is applied to a 3.3 V pin?', choices: ['Blocks the signal', 'Conducts and pushes current into the 3.3 V supply', 'Lowers the signal to 3.3 V safely and without limit', 'Switches the pin to input-only'], a: 1, why: 'The diode to the supply rail turns on once the pin is a diode drop above the rail. It was designed for brief spikes, not for a continuous current.' },
    { q: 'Which connection needs a bidirectional level shifter rather than a divider?', choices: ['A button to ground', 'A 5 V I2C bus', 'An echo pin', 'A 5 V enable line into the ESP'], a: 1, why: 'On I2C the data line is driven by both sides, so a divider (one way only) breaks it. The other three carry a signal in one direction.' }
  ],
  applications: [
    'Reading 5 V sensor outputs: ultrasonic echo, older gas sensors, some flow meters.',
    'Joining an ESP32 to Arduino-era shields and 5 V LCD backpacks.',
    'Driving 5 V LED strips whose data input wants a higher high level than 3.3 V.',
    'Talking to 5 V industrial or automotive electronics, usually through an optocoupler.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: recommended operating conditions (supply 3.0 to 3.6 V) and DC characteristics; the same sections of the ESP32-S3, ESP32-C3 and ESP32-C6 datasheets.',
    'NXP, *UM10204 I2C-bus specification and user manual*: level shifting between bus voltages.',
    'Espressif, *Hardware Design Guidelines* for the ESP32 family: power supply and I/O.'
  ],
  sim: 'gp-five-volt'
},

/* ================================================================ pin-current-limits */
{
  id: 'pin-current-limits',
  parent: 'gpio-and-pinouts',
  title: 'How much current a pin can give',
  level: 1,
  short: 'A pin drives a signal, not a load: a few milliamps through an LED resistor, microamps into another chip. Relays, motors, strips and fans are switched by a transistor that the pin controls.',
  keywords: ['pin current', 'drive strength', 'source current', 'sink current', 'mA per pin', 'LED resistor', 'overload', 'relay direct', 'motor from GPIO', 'MOSFET', 'total current', 'output current', 'GPIO limit'],
  prereq: ['reading-a-pinout', 'three-volt-logic', 'electronics:resistance-ohms-law'],
  related: ['leds', 'transistor-as-a-switch', 'mosfets-for-loads', 'switching-dc-loads', 'powering-led-strips', 'relays', 'digital-output'],
  body: `A pin is a signal driver, not a power supply. It can switch a wire between 3.3 V and 0 V and push a little current while it does, enough to light an LED or charge the input of another chip, and nowhere near enough to run a motor, a relay or a strip of LEDs. The habit to learn is one sentence: **a pin drives a signal, a transistor drives a load.**

### What the datasheets say

The figure to look for is a pad's *drive strength*: the current it is built to source or sink at its normal setting. Our catalogue holds it for two chips:

| Chip | Default drive strength |
|---|---|
| ESP32-C3 | 10 mA on GPIO2 to 5; 20 mA on all other pins; 40 mA on the USB pins GPIO18 and GPIO19 |
| ESP32-C6 | 20 mA on all pins; 40 mA on the USB pins GPIO12 and GPIO13 |

For the original ESP32 and the S3, take the figure from the datasheet. The rule is the same everywhere: a few tens of milliamps per pin at most, far less for all pins together. And drive strength is what a pad *can* give, not a target: near it the output voltage sags by tenths of a volt and the chip warms. Design for a small fraction of it.

### Sourcing and sinking

A pin that is high *sources* current out of the chip (pin to load to ground); a pin that is low *sinks* current into it (3.3 V to load to pin). Both count against the same limits.

### The one load a pin may drive: an LED

Ohm's law sizes the resistor: $R = (V_{CC} - V_f)/I$. From 3.3 V, a red LED with a forward voltage near 2 V and 5 mA needs 260 Ω; the nearest standard value, 270 Ω, gives 4.8 mA, and 330 Ω gives 3.9 mA. Modern LEDs are bright at a few milliamps. An LED with no resistor is the commonest way to overload a pin.

### Everything else needs a driver

| Load | Typical current | Drive it with |
|---|---|---|
| LED with series resistor | 2 to 10 mA | the pin |
| Input of another chip, a MOSFET gate | microamps | the pin |
| Small 5 V relay coil | about 70 mA | a transistor and a flyback diode ([[relays]]) |
| Small motor, pump, fan | hundreds of mA | a MOSFET and a diode ([[switching-dc-loads]]) |
| LED strip | amperes | a MOSFET, or the strip's own supply ([[powering-led-strips]]) |
| Servo | signal: microamps | the pin gives the signal; the servo has its own supply |

Never join two output pins, and never connect an output straight to the opposite rail.

> [!key] A pin drives a signal, not a load: a few milliamps for an LED through a resistor, microamps for another chip. Anything bigger is switched by a transistor that the pin controls.`,
  ideas: [
    'A pin can source or sink a limited current; the datasheet\'s drive strength is a ceiling, not a target.',
    'Design a pin for a few milliamps: an LED through a resistor, or the input of another chip.',
    'A relay, a motor, a fan or a strip is switched by a transistor or MOSFET, with the pin on its base or gate.',
    'The total of all pins is limited too, and the regulator behind them.'
  ],
  pitfalls: [
    'The datasheet says 20 mA, so I can run an LED at 20 mA — That figure is what the pad can deliver at a sagging voltage, and the whole chip has a budget. Run LEDs at a few milliamps.',
    'A relay board has its own power, so it is safe on a pin — Many relay boards have a driver stage and are fine; a bare relay coil is tens of milliamps plus an inductive kick. Know which you hold.',
    'Two pins in parallel give twice the current — Two outputs never switch at exactly the same instant, so one briefly drives against the other. Use a transistor.'
  ],
  terms: [
    { term: 'Drive strength', also: ['drive capability', 'pad drive'], def: 'How much current an output pad is built to source or sink at its normal setting. Some chips let software choose a weaker or stronger setting.' },
    { term: 'Source current', also: ['sourcing', 'high-side drive'], def: 'Current flowing out of a pin that is driven high, through the load to ground.' },
    { term: 'Sink current', also: ['sinking', 'low-side drive'], def: 'Current flowing into a pin that is driven low, from the supply through the load.' },
    { term: 'Current-limiting resistor', also: ['series resistor', 'LED resistor'], def: 'A resistor in series with an LED or other load that fixes the current at (supply minus load voltage) divided by the resistance.' }
  ],
  formulas: [
    {
      name: 'Series resistor for an LED on a pin',
      expr: 'R = (Vcc - Vf)/I', tex: 'R = \\frac{V_{\\text{CC}} - V_f}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', tex: 'R' },
        Vcc: { name: 'pin voltage when high', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{CC}}' },
        Vf: { name: 'LED forward voltage', q: 'voltage', unit: 'V', value: 2, tex: 'V_f' },
        I: { name: 'LED current', q: 'current', unit: 'mA', value: 5, tex: 'I' }
      },
      solveFor: 'R',
      note: 'The forward voltage depends on the colour: roughly 2 V for red, higher for blue and white. Check the LED\'s datasheet.',
      stories: {
        R: 'A red LED (forward voltage {Vf}) is lit from a {Vcc} pin at {I}. What series resistor do you need?',
        I: 'A {Vf} LED sits behind {R} on a {Vcc} pin. What current flows?'
      }
    }
  ],
  examples: [
    {
      title: 'Choosing the resistor for a status LED',
      q: 'A red LED (about 2.0 V) is wired from a 3.3 V pin to ground. You want it clearly visible but gentle on the pin, about 5 mA. Which E12 resistor, and what current does it give?',
      steps: [{ text: 'Ohm\'s law for the resistor:', tex: 'R = \\frac{3.3 - 2.0}{0.005} = 260\\,\\Omega' }, 'The nearest E12 values are 270 Ω and 220 Ω.', { text: 'With 270 Ω:', tex: 'I = \\frac{1.3}{270} = 4.8\\,\\mathrm{mA}' }],
      a: 'A 270 Ω resistor: 4.8 mA, about half of the weakest default drive strength in our tables (10 mA) and bright enough for an indicator.'
    }
  ],
  choose: {
    good: ['An LED through a series resistor, at a few milliamps', 'The input of another chip, a logic gate or a transistor gate', 'The control line of a servo or an addressable LED: the data wire, not its power'],
    avoid: ['A relay coil, motor, pump or fan wired straight to a pin', 'An LED with no resistor', 'A buzzer or speaker that draws tens of milliamps', 'Two output pins joined to share a load'],
    check: ['The drive strength of the pin in the datasheet', 'The load current from Ohm\'s law at 3.3 V', 'The total current of all pins together and of the 3.3 V regulator']
  },
  code: [
    {
      title: 'Switch a fan that is too big for a pin',
      about: 'The pin does not carry the fan\'s current: it only charges the gate of a MOSFET, and the fan runs from its own 12 V supply through the MOSFET. The program switches it on for two seconds and off for two seconds.',
      needs: 'An ESP32 DevKit, a logic-level N-channel MOSFET (one whose gate threshold is well below 3.3 V), a 12 V DC fan with its supply, a diode across the fan, and the resistors listed.',
      wiring: [['GPIO18', '100 Ω → gate of the MOSFET', 'and 100 kΩ from the gate to GND: the fan stays off while the chip boots'], ['MOSFET source', 'GND of the ESP32 and of the fan supply', 'all grounds joined'], ['MOSFET drain', 'fan minus', 'a diode across the fan, stripe towards plus'], ['fan plus', '12 V supply plus', 'never from the ESP32']],
      blocks: `
        when started
          set pin (18) as [output v]
        forever
          set pin (18) to [HIGH v]     // MOSFET on: the fan runs
          wait (2) seconds
          set pin (18) to [LOW v]      // MOSFET off
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int FAN_GATE = 18;         // to the MOSFET gate through 100 ohm

        void setup() {
          pinMode(FAN_GATE, OUTPUT);
        }

        void loop() {
          digitalWrite(FAN_GATE, HIGH);  // MOSFET on: the fan runs
          delay(2000);
          digitalWrite(FAN_GATE, LOW);   // MOSFET off
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        FAN_GATE = 18                    # to the MOSFET gate through 100 ohm
        gate = Pin(FAN_GATE, Pin.OUT)

        while True:
            gate.value(1)                # MOSFET on: the fan runs
            time.sleep(2)
            gate.value(0)                # MOSFET off
            time.sleep(2)
      `,
      notes: ['The diode across the fan absorbs the voltage spike a motor makes when it is switched off; without it the MOSFET and eventually the pin are at risk.', 'The ground of the 12 V supply and the ground of the ESP32 must be joined, or the gate has no reference.', 'Details of choosing the MOSFET are in [[mosfets-for-loads]].']
    }
  ],
  quiz: [
    { q: 'How should a 12 V fan be switched from an ESP32 pin?', choices: ['Wire it straight to the pin', 'Through a series resistor', 'With a MOSFET whose gate the pin drives, the fan on its own supply', 'Two pins in parallel'], a: 2, why: 'The pin only has to charge the gate; the fan current flows from the 12 V supply through the MOSFET. A resistor cannot help a 12 V load, and paralleled outputs fight each other.' },
    { q: 'An LED with no series resistor is connected to a 3.3 V pin. What limits the current?', choices: ['The pin always limits it to a safe value', 'Almost nothing sensible: the LED and the pin overheat', 'The USB cable', 'The program, through digitalWrite'], a: 1, why: 'An LED has a small resistance once it conducts. Without a resistor the current is set only by the LED\'s steep curve and the pad\'s own resistance, and one of them gives way.' },
    { q: 'The datasheet figure for a pin\'s drive strength is the current you should aim for.', a: false, why: 'It is the most the pad is built to deliver, at a voltage that already sags. Aim at a small fraction of it, and remember the limit on all pins together.' },
    { q: 'What series resistor gives a red LED (2.0 V forward voltage) about 5 mA from a 3.3 V pin?', answer: 260, unit: 'Ω', why: 'R = (3.3 − 2.0) / 0.005 = 260 Ω. In practice you take the nearest standard value, 270 Ω.' }
  ],
  applications: [
    'Status and heartbeat LEDs on every board, driven through a resistor.',
    'Fans, pumps and valves switched by a MOSFET controlled from a pin.',
    'Relay modules, which carry the driver stage that the bare coil needs.',
    'LED strips and servos, where the pin carries only the control signal.'
  ],
  sources: [
    'Espressif, *ESP32-C3 Series Datasheet* and *ESP32-C6 Series Datasheet*: the GPIO notes on default drive strength; the DC characteristics of each chip for output currents.',
    'Espressif, *ESP-IDF Programming Guide*, GPIO reference: drive capability of a pad.',
    'Horowitz and Hill, *The Art of Electronics*: LED drive and transistor switching.'
  ],
  sim: 'gp-pin-load'
},

/* ================================================================ pull-ups-and-pull-downs */
{
  id: 'pull-ups-and-pull-downs',
  parent: 'gpio-and-pinouts',
  title: 'Pull-ups and pull-downs',
  level: 1,
  short: 'An input with nothing attached floats and reads noise. A pull resistor to 3.3 V or to ground gives it a default level that a switch can override. Most pins have one built in; a few do not.',
  keywords: ['pull-up', 'pull-down', 'floating input', 'INPUT_PULLUP', 'INPUT_PULLDOWN', 'PULL_UP', 'active low', 'button wiring', 'internal pull-up', 'external resistor', '10k', 'GPIO34 no pull-up', 'open input'],
  prereq: ['reading-a-pinout', 'electronics:pull-resistors'],
  related: ['strapping-pins', 'input-only-and-special-pins', 'buttons-and-switches', 'debouncing', 'digital-input', 'i2c-pull-ups-and-bus-problems', 'resistors-in-esp-circuits'],
  body: `A digital input must always see a definite level. If nothing drives it, it **floats**: it picks up whatever is near (a hand, a mains cable, a neighbouring signal) and the program reads a stream of random highs and lows. A **pull resistor** cures it: a resistor to 3.3 V (pull-up) or to ground (pull-down) that gives the pin a default level, which a switch or a driving chip can override.

### The two wirings

- **Pull-up, switch to ground.** The resistor holds the pin high; pressing the button connects the pin to ground and wins, so the pin reads **low when pressed** (active low).
- **Pull-down, switch to 3.3 V.** The resistor holds the pin low; pressing the button connects it to 3.3 V, so it reads high when pressed.

The first is the habit of most boards: the BOOT button of a dev board is wired that way.

### The resistor you already have

Nearly every pin has an internal pull-up and pull-down of about 45 kΩ, switched on in software: \`INPUT_PULLUP\` or \`INPUT_PULLDOWN\` in Arduino, \`Pin.PULL_UP\` or \`Pin.PULL_DOWN\` in MicroPython. A button then needs no extra part. The exceptions are the **input-only pins GPIO34 to 39 of the original ESP32, which have no internal pull resistors at all**: the request is ignored and the pin floats, so they need an external resistor ([[input-only-and-special-pins]]).

### When to add an outside one

- **Long wires or noisy places:** a stronger pull (10 kΩ or less) resists more interference.
- **A level needed before the program runs:** while the chip resets and boots, only the pin's reset-state pull applies ([[pins-at-boot]]); strapping pins often want a resistor of their own ([[strapping-pins]]).
- **Wake-up from deep sleep:** on the ESP32 the internal pulls do not work while the RTC domain is off.
- **I2C:** always external, typically 4.7 kΩ ([[i2c-pull-ups-and-bus-problems]]).

### The price

A closed switch across a pull resistor passes $I = V/R$: 73 µA through 45 kΩ, 0.33 mA through 10 kΩ. Trivial for a button pressed a second a day, large for a coin-cell sensor whose door contact stays closed for months. A bigger resistor saves current and listens to more noise; a smaller one the reverse.

Bouncing contacts are a separate problem: see [[debouncing]].

> [!key] A floating input reads noise. Use a pull-up when the switch goes to ground (reads low when pressed), a pull-down when it goes to 3.3 V. Ordinary pins have an internal 45 kΩ pull; the input-only pins GPIO34 to 39 of the ESP32 do not.`,
  ideas: [
    'An input with nothing attached floats and reads random levels.',
    'A pull-up to 3.3 V with a switch to ground reads low when pressed; a pull-down with a switch to 3.3 V reads high when pressed.',
    'Most pins have an internal pull of about 45 kΩ; GPIO34 to 39 of the ESP32 have none.',
    'The pull is weak on purpose: a real load or a closed switch overrides it, at a current of V divided by R.'
  ],
  pitfalls: [
    'I can leave an unused input unconnected — A floating input reads random levels, may flicker, and in some conditions draws extra current. Give it a pull or set it as an output.',
    'INPUT_PULLUP works on every pin — It does nothing on the ESP32\'s input-only pins GPIO34 to 39: they have no internal resistor, and the pin floats.',
    'A pull-up makes a pin read high when the button is pressed — With the switch to ground it is the other way round: high when released, low when pressed.'
  ],
  terms: [
    { term: 'Floating input', also: ['open input', 'undefined input'], def: 'An input connected to nothing. Its voltage drifts with static and interference, so the program reads unpredictable levels.' },
    { term: 'Pull-up resistor', also: ['pull-up', 'INPUT_PULLUP'], def: 'A resistor from a pin to the supply that holds it high until a switch or a driver pulls it low.' },
    { term: 'Pull-down resistor', also: ['pull-down', 'INPUT_PULLDOWN'], def: 'A resistor from a pin to ground that holds it low until a switch or a driver pulls it high.' },
    { term: 'Internal pull resistor', also: ['internal pull-up', 'weak pull'], def: 'A resistor of about 45 kΩ built into most GPIO pins and switched in by software. The input-only pins GPIO34 to 39 of the ESP32 have none.' }
  ],
  formulas: [
    {
      name: 'Current through a pull resistor while the switch is closed',
      expr: 'I = Vcc/R', tex: 'I = \\frac{V_{\\text{CC}}}{R}',
      vars: {
        I: { name: 'current while the switch is closed', q: 'current', unit: 'mA', tex: 'I' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{CC}}' },
        R: { name: 'pull resistor', q: 'resistance', unit: 'kΩ', value: 45, tex: 'R' }
      },
      solveFor: 'I',
      note: 'About 45 kΩ is the internal pull-up; 10 kΩ is a common external one.',
      stories: {
        I: 'A door contact stays closed across a {R} pull-up on a {Vcc} supply. What current does it waste?',
        R: 'You want the pull-up to waste no more than {I} from {Vcc}. What resistor do you need at least?'
      }
    }
  ],
  choose: {
    good: ['The internal pull-up for a button on an ordinary pin: no extra part', 'An external 10 kΩ on a pin that must have a level while the chip boots', 'An external pull on the input-only pins GPIO34 to 39', 'A larger external resistor (100 kΩ or more) when a switch stays closed on a battery'],
    avoid: ['An unconnected input with no pull', 'Relying on INPUT_PULLUP on GPIO34 to 39', 'A pull that fights the strapping level of the pin at reset', 'A very small pull resistor on a battery-powered switch'],
    check: ['Whether the pin has an internal pull at all', 'The level the pin has at reset (pins at boot)', 'Whether a switch can stay closed for long and what that costs in current']
  },
  code: [
    {
      title: 'Read a button with the internal pull-up',
      about: 'The button connects the pin to ground. The internal pull-up holds the pin high until it is pressed, so a low reading means "pressed". The LED follows the button.',
      needs: 'An ESP32 DevKit, a push button and an LED with a 330 Ω resistor.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up'], ['GPIO18', '330 Ω → LED → GND']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (18) as [output v]
        forever
          if <(read pin (4)) = [LOW v]> then    // pressed: the button ties the pin to ground
            set pin (18) to [HIGH v]
          else
            set pin (18) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;            // button to GND, internal pull-up
        const int LED = 18;              // 330 ohm and an LED to GND

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;   // low means pressed
          digitalWrite(LED, pressed);
        }
      `,
      py: String.raw`
        from machine import Pin

        BUTTON = 4                       # button to GND, internal pull-up
        LED = 18                         # 330 ohm and an LED to GND

        button = Pin(BUTTON, Pin.IN, Pin.PULL_UP)
        led = Pin(LED, Pin.OUT)

        while True:
            pressed = button.value() == 0   # low means pressed
            led.value(pressed)
      `,
      notes: ['A real button bounces for a few milliseconds; for counting presses see [[debouncing]].']
    },
    {
      title: 'A switch to 3.3 V with the internal pull-down',
      about: 'The mirror image: the internal pull-down holds the pin low until the switch connects it to 3.3 V, so a high reading means "on".',
      needs: 'An ESP32 DevKit, a toggle switch and an LED with a 330 Ω resistor.',
      wiring: [['GPIO27', 'switch → 3V3', 'internal pull-down'], ['GPIO18', '330 Ω → LED → GND']],
      blocks: `
        when started
          set pin (27) as [input with pull-down v]
          set pin (18) as [output v]
        forever
          if <(read pin (27)) = [HIGH v]> then   // on: the switch ties the pin to 3.3 V
            set pin (18) to [HIGH v]
          else
            set pin (18) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int SWITCH_PIN = 27;       // switch to 3V3, internal pull-down
        const int LED = 18;

        void setup() {
          pinMode(SWITCH_PIN, INPUT_PULLDOWN);
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool on = digitalRead(SWITCH_PIN) == HIGH;   // high means on
          digitalWrite(LED, on);
        }
      `,
      py: String.raw`
        from machine import Pin

        SWITCH_PIN = 27                  # switch to 3V3, internal pull-down
        LED = 18

        switch = Pin(SWITCH_PIN, Pin.IN, Pin.PULL_DOWN)
        led = Pin(LED, Pin.OUT)

        while True:
            on = switch.value() == 1     # high means on
            led.value(on)
      `,
      notes: ['This does not work on GPIO34 to 39 of the ESP32: they have no internal pull-down. Use another pin or add a 10 kΩ resistor to ground.']
    }
  ],
  quiz: [
    { q: 'A button connects GPIO4 to ground and the pin uses its internal pull-up. What does digitalRead return while the button is held?', choices: ['HIGH', 'LOW', 'Random values', 'It depends on the pull-up value'], a: 1, why: 'Pressing the button ties the pin to ground, which overpowers the weak pull-up: the pin reads LOW. Released, the pull-up gives HIGH.' },
    { q: 'A button is wired to GPIO34 of an ESP32 with pinMode(34, INPUT_PULLUP). It reads random values. Why?', choices: ['The button is broken', 'GPIO34 has no internal pull resistors, so the pin floats', 'INPUT_PULLUP only works on output pins', 'GPIO34 is a strapping pin'], a: 1, why: 'GPIOs 34 to 39 of the ESP32 are input-only pins without internal pulls: the request is ignored. Add an external 10 kΩ resistor to 3.3 V.' },
    { q: 'An unused input pin may be left unconnected without a pull resistor.', a: false, why: 'A floating pin picks up noise and can flicker; give it a pull resistor, or make it an output.' },
    { q: 'A switch stays closed for months across an external 10 kΩ pull-up on 3.3 V. About how much current does it waste?', choices: ['3.3 µA', '33 µA', '0.33 mA', '33 mA'], a: 2, why: 'I = 3.3 V / 10 kΩ = 0.33 mA, all the time the switch is closed. A coin cell would not enjoy that: use a larger resistor or a different circuit.' }
  ],
  applications: [
    'Every push button and toggle switch on a dev board or a product.',
    'Reed switches and door contacts on battery-powered alarm sensors.',
    'The I2C bus, which is built on external pull-ups.',
    'Unused inputs of logic chips and port expanders, tied to a defined level.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: the internal pull-up and pull-down resistors, and the pin table (GPIO34 to 39 are input-only without pulls).',
    'Arduino core for ESP32 documentation, GPIO API: pinMode modes INPUT_PULLUP and INPUT_PULLDOWN.',
    'MicroPython documentation, *machine.Pin*: the PULL_UP and PULL_DOWN arguments.'
  ],
  sim: 'gp-pull-resistors'
},

/* ================================================================ pins-at-boot */
{
  id: 'pins-at-boot',
  parent: 'gpio-and-pinouts',
  title: 'What pins do at power-up',
  level: 2,
  short: 'Before your first line of code runs, every pin already has a state: a weak pull, a brief glitch, the boot log on the console pin. A relay or a motor driver on the wrong pin can notice. Design the off state in.',
  keywords: ['power-up', 'boot', 'glitch', 'reset state', 'relay clicks at boot', 'pin state', 'high impedance', 'pull at reset', 'boot log', 'GPIO1 noisy', 'fail-safe', 'default off', 'floating at reset'],
  prereq: ['strapping-pins', 'pull-ups-and-pull-downs', 'pin-current-limits'],
  related: ['boot-modes-and-download-mode', 'reading-boot-messages', 'safe-pins-esp32', 'mosfets-for-loads', 'relays', 'deep-sleep', 'reset-reasons'],
  body: `Between the moment power arrives and the moment your program's first line runs, the chip spends time you never see, and the pins are not idle. A relay, a motor driver or a valve wired to the wrong pin can notice, and click, twitch or open at every power-up.

### The four moments

1. **Supply rising.** The chip is not awake yet; the pins are high-impedance.
2. **Reset.** Each pin takes its reset state: an input, some with a weak pull-up, some with a pull-down, some with nothing. The pin tables say which: GPIO12 and GPIO45 pull down, GPIO0 and GPIO9 pull up, GPIO34 to 39 on the ESP32 have nothing.
3. **ROM boot.** The strapping pins are read ([[strapping-pins]]) and the ROM prints its boot log on the console TX pin: GPIO1 on the ESP32, GPIO43 on the S3, GPIO21 on the C3, GPIO16 on the C6. That pin toggles.
4. **Your program.** \`setup()\` calls \`pinMode\`, and only now do the pins take the levels you ask for.

### Three kinds of surprise

- **Weak levels.** The reset pull is tens of kilohms, so anything wired to the pin beats it ([[pull-ups-and-pull-downs]]). A pin that "rests low" is only held low until a load pulls it elsewhere.
- **Glitches.** The S3's GPIO1 to 20 show a 60 µs low-level glitch at power-up, and GPIO18 to 20 a 60 µs high-level one. On the C3, GPIO6, 7, 10 and 20 show a 5 ns low glitch and GPIO18 a 50 µs high one. Too short for a relay, long enough for a counter, a latch or the clock of a shift register to catch.
- **Activity.** Besides the console pin, GPIO5 and GPIO14 of the ESP32 have been reported to output a PWM-like signal during boot (community reports, flagged as such in the pin table).

### Designing for a safe default

- **Make the off state the resting state.** An active-high driver (a MOSFET gate) gets a 100 kΩ resistor to ground, so it stays off while the pin is still high-impedance. An active-low relay module needs its input to rest high, so a pin that pulls down at reset would switch it on.
- **Pick quiet pins** for loads: the ones without a boot note in the pin table ([[safe-pins-esp32]]).
- **Check the load's own pull.** A module that pulls its input towards the wrong level is a strapping hazard too.
- **After deep sleep** pins are set up again unless the program holds them ([[deep-sleep]]).

The simulation draws the first moments of one pin from the pin table, with a wire of your choice on it.

> [!key] From power-up to the first pinMode, a pin has a state of its own: a weak pull, a short glitch, the boot log. Choose a pin whose resting level suits the load, and add the resistor that makes the off state the default.`,
  ideas: [
    'The pins have a state from power-up to the first pinMode: reset pulls, glitches, the console log.',
    'The reset pull-up or pull-down is only tens of kilohms; any attached part overrides it.',
    'The S3 and C3 pin tables list short power-up glitches; the ESP32 has reported noisy pins at boot.',
    'Safe design: a resistor that holds the driver off, and a quiet pin.'
  ],
  pitfalls: [
    'My setup() sets the pin low first, so it is low from the start — setup() runs after the ROM, the bootloader and the start of the system. The pin has been through reset and boot before that, and only the circuit controls it.',
    'A pin with a pull-down at reset keeps a relay off — Only if the relay input is active high and the pull is stronger than the module\'s own pull. An active-low module switches on when the pin is pulled low.',
    'A 60 µs glitch cannot matter — A relay cannot follow it, but a latch, a counter or a shift-register clock reacts in nanoseconds.'
  ],
  terms: [
    { term: 'Reset state', also: ['reset level', 'default pin state'], def: 'What a pin does while the chip is held in reset and until the program configures it: usually an input, with a pull-up, a pull-down or no pull.' },
    { term: 'High impedance', also: ['high-Z', 'Hi-Z', 'tri-state', 'floating'], def: 'The state of a pin that drives nothing: it neither sources nor sinks current and its voltage is set by whatever is attached.' },
    { term: 'Power-up glitch', also: ['boot glitch', 'startup pulse'], def: 'A brief unwanted pulse on a pin while the chip powers up, listed in the datasheet for some pins. It lasts microseconds or less.' },
    { term: 'Fail-safe state', also: ['safe default', 'default off'], def: 'The state a circuit takes when nothing controls it. A switched load should be off in that state.' }
  ],
  examples: [
    {
      title: 'The relay that clicks at every start',
      q: 'An active-low relay module (it energises when its input is low) is connected to GPIO12 of an ESP32. At each power-up the relay clicks on for a moment. What explains it, and what is the cure?',
      steps: ['At reset GPIO12 has a pull-down: it rests low.', 'For an active-low module a low input means "on", so the relay is energised until the program sets the pin high.', 'GPIO12 is also the flash-voltage strapping pin; a module that pulls it up can stop the boot altogether.', 'Move the relay to a quiet pin such as GPIO23 and add a resistor that makes its input rest at the off level of the relay (high, for an active-low module).'],
      a: 'The pin rests low and the module reads low as "on". Use a pin whose resting level is the relay\'s off level, and keep strapping pins out of it.'
    }
  ],
  quiz: [
    { q: 'Why does a 100 kΩ resistor from a MOSFET gate to ground make a switched load safer at power-up?', choices: ['It speeds up the switching', 'It holds the gate low (off) while the pin is still high-impedance', 'It lets the pin deliver more current', 'It protects the pin from 5 V'], a: 1, why: 'Until the program configures the pin it drives nothing, so the gate would float. The resistor gives it a defined low level, and the load is off.' },
    { q: 'The ESP32-S3 pin table lists a 60 µs low-level glitch on GPIO1 to 20 at power-up. Which device is most likely to be disturbed?', choices: ['A relay coil', 'A slow indicator LED', 'The clock input of a shift register or a counter', 'A push button'], a: 2, why: 'A relay and an LED are far too slow to follow 60 µs. A clocked logic input responds to edges in nanoseconds and may capture a false pulse.' },
    { q: 'Calling pinMode(pin, OUTPUT) and digitalWrite(pin, LOW) at the top of setup() keeps the pin low during the whole boot.', a: false, why: 'setup() runs only after the ROM boot code and the bootloader; the pin has been through reset and boot before that. Only the external circuit decides its level up to then.' },
    { q: 'On which ESP32 pin does the ROM print its boot log?', choices: ['GPIO1 (UART0 TX)', 'GPIO21', 'GPIO34', 'GPIO23'], a: 0, why: 'GPIO1 is the console TX pin of the original ESP32 and toggles during the boot log; avoid it for plain I/O.' }
  ],
  applications: [
    'Relay and valve controllers that must not fire at power-up.',
    'Motor drivers, whose enable pin must rest in the "off" state.',
    'Shift registers and latches clocked from pins that glitch at start.',
    'Fault-finding "it clicks at power-up" and "it only boots with that wire unplugged".'
  ],
  sources: [
    'Espressif, *ESP32-S3 Series Datasheet*, GPIO power-up glitch table, and *ESP32-C3 Series Datasheet*, the same section; *ESP32 Series Datasheet*, pin table and strapping pins.',
    'Espressif, *ESP-IDF Programming Guide*: boot process and the GPIO reference.',
    'Espressif, *Hardware Design Guidelines* for the ESP32 family: pin states and strapping.'
  ],
  sim: 'gp-power-up'
},

/* ================================================================ input-only-and-special-pins */
{
  id: 'input-only-and-special-pins',
  parent: 'gpio-and-pinouts',
  title: 'Input-only, flash and other special pins',
  level: 2,
  short: 'A handful of pins are not ordinary: the ESP32 has six that can only be inputs, and every chip has pins wired to its flash, to USB, to the serial console, to JTAG or to a crystal. Know them before you choose.',
  keywords: ['input-only', 'GPIO34', 'GPIO35', 'GPIO36', 'GPIO39', 'flash pins', 'GPIO6-11', 'PSRAM pins', 'octal PSRAM', 'USB pins', 'UART0', 'JTAG', '32 kHz crystal', 'VDD_SPI', '1.8 V pins', 'SPI flash'],
  prereq: ['reading-a-pinout', 'pull-ups-and-pull-downs'],
  related: ['strapping-pins', 'adc1-adc2-and-wifi', 'safe-pins-esp32', 'safe-pins-s3-c3-c6', 'flash-memory-on-modules', 'psram-on-modules', 'jtag-debugging', 'usb-on-the-esp'],
  body: `Most pins of an ESP32-family chip are interchangeable; a handful are not, and they explain why a pin that "should work" does not. Every one of them is flagged in the pin tables of this app.

### Input-only pins

The original ESP32 has six pins that can only be inputs: **GPIO34 to 39**. They have no output driver and no internal pull resistors. They suit what an input does: a sensor, a button with its own resistor, an analogue reading (all six belong to ADC1, the converter that keeps working with Wi-Fi on), a serial receive line. They cannot light an LED, drive a clock or carry I2C data. GPIO37 and 38 are often not on the header, and GPIO36 and 39 should not use their interrupt while the ADC, or Wi-Fi with Bluetooth sleep, is in use. The S3, C3 and C6 have no input-only pins.

### The other special pins

| | ESP32 | S3 | C3 | C6 |
|---|---|---|---|---|
| Flash and PSRAM | 6 to 11 (16 and 17 on WROVER modules) | 26 to 32; 33 to 37 with octal memory | 11 to 17 | 24 to 30 |
| USB | none | 19, 20 | 18, 19 | 12, 13 |
| Console (UART0) | 1 TX, 3 RX | 43 TX, 44 RX | 21 TX, 20 RX | 16 TX, 17 RX |
| JTAG | 12 to 15 | 39 to 42 | 4 to 7 | 4 to 7 |
| 32 kHz crystal | 32, 33 | 15, 16 | 0, 1 | 0, 1 |

What using one as a plain pin costs:

- **Flash and PSRAM pins** carry the memory the program runs from: driving them crashes the chip or stops it booting. They appear on headers as D0 to D3, CMD and CLK ([[gpio-numbers-and-board-labels]]). On an S3 module with octal memory, GPIO35 to 37 belong to the PSRAM, although the DevKitC-1 header shows them.
- **USB pins:** using them as GPIO switches off the built-in USB serial and debug port, so uploading and the serial monitor over USB stop.
- **Console pins:** busy at boot with the ROM log, and the serial monitor listens there.
- **JTAG pins:** ordinary pins unless a debugger is attached. On the S3, C3 and C6 JTAG runs over USB by default, so they are free; on the ESP32, GPIO12 and 15 are also strapping pins ([[strapping-pins]]).
- **32 kHz crystal pins:** free unless the board fits a crystal there.
- **1.8 V pins:** on S3 modules built on the R16V chip, GPIO47 and 48 run at 1.8 V, not 3.3 V.

On a bare C3 or C6 chip the flash pins are the ones the memory is wired to; on a module the maker has already wired them and brings out only the rest.

> [!key] The ESP32's GPIO34 to 39 are input-only without pull resistors; flash and PSRAM pins must never be used; USB, console, JTAG and crystal pins are usable only at a price. The pin tables flag them all, and so does the pinout explorer.`,
  ideas: [
    'GPIO34 to 39 of the ESP32 are input-only: no output, no internal pull resistors.',
    'Flash and PSRAM pins carry the memory the program runs from and are never usable.',
    'USB and console pins can be used as GPIO, but then USB uploads or the serial monitor stop.',
    'JTAG and crystal pins are free unless a debugger or a 32 kHz crystal is fitted.'
  ],
  pitfalls: [
    'Every pad on the header is a free GPIO — Some pads go to the flash (ESP32 D0 to D3, CMD, CLK) or to octal PSRAM (S3 GPIO35 to 37 on N16R8 boards). They sit on the header and are not available.',
    'Input-only pins are weaker versions of ordinary pins — They are the right pins for inputs and analogue readings. The mistake is giving them an output job or an internal pull.',
    'I can use the USB pins as GPIO and still upload — Not over USB: the controller that carries the upload and the console is on those pins. You would need the serial pins and a bridge.'
  ],
  terms: [
    { term: 'Input-only pin', also: ['input only', 'GPIO34 to 39'], def: 'A pin with no output driver, so it can read but never drive a level. On the ESP32 these are GPIO34 to 39, and they also lack internal pull resistors.' },
    { term: 'Flash pin', also: ['SPI flash pins', 'GPIO6 to 11'], def: 'A pin wired to the SPI flash memory of a module or package. The program is read through it, so it must not be used for anything else.' },
    { term: 'Octal PSRAM', also: ['OPI PSRAM', 'octal SPI'], def: 'RAM chips with eight data lines, used on ESP32-S3 R8 and R16V parts. Their data lines take GPIO33 to 37, so those pins are lost on such modules.' },
    { term: 'UART0', also: ['console UART', 'serial console'], def: 'The serial port on which the ROM boot log, the bootloader and the serial monitor talk. Its two pins differ per chip: GPIO1 and 3 on the ESP32.' },
    { term: 'JTAG pins', also: ['MTCK', 'MTDI', 'MTMS', 'MTDO'], def: 'Four pins that can carry a hardware debugger. Without a debugger on them they are ordinary GPIOs; on the S3, C3 and C6 the debugger normally uses USB instead.' }
  ],
  code: [
    {
      title: 'A button on an input-only pin',
      about: 'GPIO34 has no internal pull-up, so the 10 kΩ resistor to 3.3 V does the job that INPUT_PULLUP does on other pins. Pressing the button pulls the pin low and lights the LED.',
      needs: 'An ESP32 DevKit, a push button, a 10 kΩ resistor, and an LED with a 330 Ω resistor.',
      wiring: [['GPIO34', 'button → GND', 'and 10 kΩ from GPIO34 to 3V3: an external pull-up'], ['GPIO18', '330 Ω → LED → GND']],
      blocks: `
        when started
          set pin (34) as [input v]        // input-only pin: no internal pull-up
          set pin (18) as [output v]
        forever
          if <(read pin (34)) = [LOW v]> then   // pressed
            set pin (18) to [HIGH v]
          else
            set pin (18) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON = 34;           // input-only pin, external 10 k pull-up to 3V3
        const int LED = 18;

        void setup() {
          pinMode(BUTTON, INPUT);        // INPUT_PULLUP would be ignored here
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          digitalWrite(LED, pressed);
        }
      `,
      py: String.raw`
        from machine import Pin

        BUTTON = 34                      # input-only pin, external 10 k pull-up to 3V3
        LED = 18

        button = Pin(BUTTON, Pin.IN)     # Pin.PULL_UP would be ignored here
        led = Pin(LED, Pin.OUT)

        while True:
            pressed = button.value() == 0
            led.value(pressed)
      `,
      notes: ['Try removing the resistor: the pin floats and the LED flickers.', 'Only the original ESP32 has input-only pins. On an S3, C3 or C6 use any ordinary pin and the internal pull-up.']
    },
    {
      title: 'Which pins exist, and which can be outputs?',
      about: 'The chip knows its own pins. This sketch asks it, without touching a single pin, and prints one line per GPIO number that exists.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [n v] in (every GPIO number that exists on this chip)
            if <(GPIO (n) can be an output)> then
              print (join [GPIO] (n) [: input and output])
            else
              print (join [GPIO] (n) [: input only])
            end
          end
      `,
      cpp: String.raw`
        #include "driver/gpio.h"
        #include "soc/soc_caps.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);                                   // give the monitor time to open
          for (int n = 0; n < SOC_GPIO_PIN_COUNT; n++) {
            if (!GPIO_IS_VALID_GPIO(n)) continue;        // this number does not exist on the chip
            Serial.printf("GPIO%d: %s\n", n, GPIO_IS_VALID_OUTPUT_GPIO(n) ? "input and output" : "input only");
          }
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no call that asks whether a pin may be an output without trying it, and making a flash pin an output would crash the board. Use the pin tables of this app instead.' },
      output: `
        GPIO0: input and output
        GPIO1: input and output
        ...
        GPIO34: input only
        GPIO35: input only
        ...
      `,
      notes: ['This is the chip\'s view, not the board\'s: on an ESP32 GPIO6 to 11 report as valid outputs, because the silicon allows it, although the flash memory is wired to them.', 'The listing above is what an original ESP32 prints; an S3, C3 or C6 prints "input and output" for every line.']
    }
  ],
  quiz: [
    { q: 'Which job can GPIO34 of an original ESP32 do?', choices: ['Read an analogue sensor on ADC1', 'Drive an LED', 'Act as the SDA line of an I2C bus', 'Output a PWM signal'], a: 0, why: 'GPIO34 is input-only: it can read, and as an ADC1 pin it reads analogue voltages even with Wi-Fi on. It has no output driver, so the other three jobs are impossible.' },
    { q: 'On an ESP32-S3-DevKitC-1 with an N16R8 module, GPIO35, 36 and 37 appear on the header. May you use them?', choices: ['Yes, they are plain GPIOs', 'No: they belong to the octal PSRAM of that module', 'Only as inputs', 'Only with an external pull-up'], a: 1, why: 'The N16R8 has 8 MB of octal PSRAM, whose data lines use GPIO35 to 37. The header shows the chip\'s pins, not which of them the module has already taken.' },
    { q: 'The ESP32-C3 has input-only pins just like GPIO34 to 39 of the original ESP32.', a: false, why: 'All 22 GPIOs of the C3 can be outputs and have selectable pull resistors; input-only pins exist only on the original ESP32 (the S3 and C6 have none either).' },
    { q: 'What happens if you use GPIO19 of an ESP32-S3 as an ordinary output?', choices: ['Nothing special', 'The built-in USB serial and debug port stops working', 'The chip resets', 'The 3.3 V rail is shorted'], a: 1, why: 'GPIO19 and 20 are the D- and D+ wires of the USB Serial/JTAG controller. Reconfigured as plain GPIO they stop carrying USB, so uploading and the serial monitor over USB stop.' }
  ],
  applications: [
    'Analogue sensors on the ESP32 (potentiometers, light and temperature dividers) placed on the input-only ADC1 pins GPIO34 to 39.',
    'Reading a board that brings out the flash pins under D0 to D3, CMD and CLK, so that none of them is used by mistake.',
    'Using GPIO36 and 39 (the old VP and VN) for sensors, since they have no other job.',
    'Choosing pins on an S3 module with octal PSRAM, where GPIO33 to 37 are gone.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*, pin tables and GPIO notes: input-only GPIOs, flash pins, PSRAM pins.',
    'Espressif, *ESP32-S3 Series Datasheet* and *ESP32-S3-WROOM-1 Datasheet*: octal PSRAM and the pins it uses.',
    'Espressif, *ESP-IDF Programming Guide*, GPIO reference: the pin restrictions of each chip.'
  ],
  sim: { id: 'gp-pinout-reader', params: { board: 'esp32-devkitc-v4', colour: 'kind' } }
},

/* ================================================================ adc1-adc2-and-wifi */
{
  id: 'adc1-adc2-and-wifi',
  parent: 'gpio-and-pinouts',
  title: 'ADC1, ADC2 and Wi-Fi',
  level: 2,
  short: 'On the original ESP32 the second analogue converter cannot be read while Wi-Fi is on. The S2 and S3 share it with Wi-Fi and a read may fail; the C3\'s single ADC2 channel is unusable; the C6 has no ADC2 at all.',
  keywords: ['ADC2 Wi-Fi', 'ADC1', 'ADC2', 'analogRead fails', 'analogRead returns 0', 'ADC channel', 'GPIO34', 'GPIO32', 'ESP_ERR_TIMEOUT', 'analog pins with WiFi', 'one-shot', 'ADC2 unusable', 'sensor stops working'],
  prereq: ['reading-a-pinout', 'input-only-and-special-pins', 'wifi-basics'],
  related: ['the-esp-adc', 'adc-attenuation-and-calibration', 'analog-input', 'external-adc-and-dac', 'analog-multiplexers', 'safe-pins-esp32', 'planning-pins'],
  body: `A sensor that reads perfectly in a test sketch can start returning zeros the moment Wi-Fi joins the sketch. It is the best-known trap of the original ESP32, and it comes from how the analogue converters are built: **the second converter, ADC2, is also used by the Wi-Fi driver.**

### Two converters, fixed pins

Each ESP32-family chip with analogue inputs has one or two 12-bit converters, and the pins of each are fixed:

| Chip | ADC1 | ADC2 | While Wi-Fi is on |
|---|---|---|---|
| ESP32 | GPIO32 to 39 | GPIO0, 2, 4, 12 to 15, 25 to 27 | ADC1 works; **ADC2 cannot be read** |
| ESP32-S2, S3 | GPIO1 to 10 | GPIO11 to 20 | ADC1 works; ADC2 is arbitrated and a read may time out |
| ESP32-C3 | GPIO0 to 4 | GPIO5 | ADC1 works; GPIO5 is not dependable at all |
| ESP32-C6 | GPIO0 to 6 | none | no restriction |
| ESP32-H2, C2, C5, C61 | a single converter | none | no restriction (the H2 has no Wi-Fi) |

### What goes wrong

- **ESP32.** While Wi-Fi is running, the reading of an ADC2 pin is not valid. MicroPython's documentation says the read raises an exception. The sensor and wiring are fine.
- **S2 and S3.** The driver arbitrates between the Wi-Fi and your read, so nothing crashes, but a read may time out and return an error with an invalid value. Check the return code, or stay on ADC1.
- **C3.** The datasheet says ADC2 of some chip revisions does not operate, and ESP-IDF no longer supports its one-shot mode by default. Count five channels, GPIO0 to 4.
- **C6 and newer.** One converter, so there is no conflict.

The rule only bites while Wi-Fi is switched on: a program that reads an ADC2 pin and then connects is fine until it does.

### What to do

- **Choose ADC1 pins for anything analogue**, even if Wi-Fi is not planned yet: ADC2 pins are the first thing a later feature takes away. On the ESP32 the input-only pins GPIO34 to 39 are the natural homes; GPIO32 and 33 double as 32 kHz crystal pins on boards that fit one.
- **Need more channels than ADC1 has?** Add an external converter on I2C or SPI ([[external-adc-and-dac]]), or an analogue multiplexer ([[analog-multiplexers]]).
- **On the ESP32-DevKitC, avoid GPIO0** for analogue reads: the board's auto-flash circuit uses it.

> [!key] Use ADC1 pins for analogue input whenever Wi-Fi may be on. On the ESP32 that means GPIO32 to 39; ADC2 cannot be read at all while Wi-Fi runs. The S2 and S3 arbitrate and may fail, the C3's ADC2 pin is unusable, and the C6 has no ADC2.`,
  ideas: [
    'The ESP32 has two converters; ADC2 is shared with the Wi-Fi driver and cannot be read while Wi-Fi is on.',
    'On the S2 and S3 an ADC2 read is arbitrated and may time out; on the C3 the single ADC2 pin is unusable.',
    'The C6, H2, C5, C61 and C2 have one converter and no restriction.',
    'Plan analogue inputs on ADC1 pins from the start.'
  ],
  pitfalls: [
    'My analogue sensor is broken, it reads zero — On an ESP32 on an ADC2 pin with Wi-Fi on, the reading is invalid, however good the sensor. Move it to an ADC1 pin, or read it before Wi-Fi starts.',
    'The ADC2 rule applies to every ESP32 chip — It is a hard rule only on the original ESP32. S2 and S3 arbitrate, the C3 simply does not offer a usable ADC2 channel, and the C6 has none.',
    'Any pin that says ADC works with Wi-Fi — Only ADC1 pins are safe on the ESP32, S2 and S3. Check the tag: ADC1_CH6 yes, ADC2_CH5 no.'
  ],
  terms: [
    { term: 'ADC unit', also: ['ADC1', 'ADC2', 'SAR ADC'], def: 'One analogue-to-digital converter of the chip, with its own set of input pins. The original ESP32, S2 and S3 have two; the C3 has two but one is unusable; the C6 has one.' },
    { term: 'ADC channel', also: ['ADC1_CH6', 'ADC2_CH5'], def: 'One input of an ADC unit, tied to one GPIO pin. ADC1_CH6 is channel 6 of unit 1, which on the ESP32 is GPIO34.' },
    { term: 'Arbitration', also: ['shared resource', 'bus arbitration'], def: 'The rule by which a shared resource decides who may use it. For ADC2 the driver lets Wi-Fi or your read in, not both, so a read may have to wait or time out.' },
    { term: 'One-shot read', also: ['oneshot', 'analogRead'], def: 'The simple way to read an ADC: ask for one value, wait, get it. It is what analogRead does, as opposed to continuous sampling.' }
  ],
  code: [
    {
      title: 'Read an ADC1 pin while Wi-Fi is running',
      about: 'The sketch joins Wi-Fi and then prints the voltage on an ADC1 pin once a second. Because the pin is on ADC1, the reading stays valid with Wi-Fi on.',
      needs: 'An ESP32 DevKit and a potentiometer (its ends to 3V3 and GND, the wiper to GPIO34). On an ESP32-S3 use GPIO1, on a C3 GPIO3.',
      wiring: [['GPIO34', 'potentiometer wiper', 'ADC1_CH6; the outer legs to 3V3 and GND']],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          repeat until <Wi-Fi connected?>
            wait (0.25) seconds
          end
        forever
          print (join [mV: ] (analog read pin (34) in millivolts))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const int SENSOR_PIN = 34;       // ADC1_CH6; GPIO1 on an S3, GPIO3 on a C3

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) delay(250);
          Serial.println(WiFi.status() == WL_CONNECTED ? "Wi-Fi connected" : "no Wi-Fi");
        }

        void loop() {
          uint32_t mv = analogReadMilliVolts(SENSOR_PIN);   // calibrated millivolts
          Serial.printf("GPIO%d: %lu mV\n", SENSOR_PIN, (unsigned long)mv);
          delay(1000);
        }
      `,
      py: String.raw`
        import network, time
        from machine import ADC, Pin

        SENSOR_PIN = 34                  # ADC1_CH6; GPIO1 on an S3, GPIO3 on a C3

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        t0 = time.ticks_ms()
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 15000:
            time.sleep_ms(250)
        print("Wi-Fi connected" if wlan.isconnected() else "no Wi-Fi")

        adc = ADC(Pin(SENSOR_PIN), atten=ADC.ATTN_11DB)

        while True:
            uv = adc.read_uv()           # calibrated microvolts
            print("GPIO%d: %d mV" % (SENSOR_PIN, uv // 1000))
            time.sleep(1)
      `,
      output: `
        Wi-Fi connected
        GPIO34: 1648 mV
        GPIO34: 1651 mV
        GPIO34: 2204 mV
      `,
      notes: ['Replace the credentials with your own and do not leave them in code you share ([[credentials-handling]]).', 'To see the rule, move the wire to GPIO4 (ADC2) on an original ESP32: the reading is good until Wi-Fi connects and is not valid afterwards.', 'The attenuation setting that chooses the voltage range is the subject of [[adc-attenuation-and-calibration]].']
    }
  ],
  quiz: [
    { q: 'An ESP32 sketch reads GPIO4 correctly, then returns invalid values after WiFi.begin(). What is the cause?', choices: ['The sensor is faulty', 'GPIO4 is on ADC2, which the Wi-Fi driver uses', 'GPIO4 is a strapping pin', 'analogRead and Serial cannot be used together'], a: 1, why: 'GPIO4 is ADC2_CH0. On the original ESP32 ADC2 cannot be read while Wi-Fi is running. An ADC1 pin (GPIO32 to 39) would not be affected.' },
    { q: 'Which pins of an original ESP32 may be read as analogue inputs while Wi-Fi is on?', choices: ['GPIO32 to 39', 'GPIO0, 2, 4, 12 to 15, 25 to 27', 'GPIO6 to 11', 'Any pin'], a: 0, why: 'GPIO32 to 39 are ADC1. The second list is ADC2, which Wi-Fi occupies; GPIO6 to 11 are the flash pins.' },
    { q: 'The same hard rule, "ADC2 cannot be read with Wi-Fi", applies unchanged to the ESP32-C6.', a: false, why: 'The C6 has a single converter (ADC1, GPIO0 to 6) and no ADC2, so there is no conflict. The hard rule belongs to the original ESP32; S2 and S3 arbitrate, and the C3\'s ADC2 pin is unusable.' },
    { q: 'How many analogue channels of an ESP32-C3 can be used for ordinary readings?', choices: ['6', '5', '2', '1'], a: 1, why: 'GPIO0 to 4 are ADC1 and dependable. The sixth channel, ADC2 on GPIO5, is not usable for ordinary readings because of a hardware limitation.' }
  ],
  applications: [
    'Battery-voltage monitors in Wi-Fi sensors: the divider goes to an ADC1 pin.',
    'Soil-moisture and light sensors in connected gardens and weather stations.',
    'Analogue joysticks and potentiometers in Wi-Fi remote controls.',
    'Porting a sensor project from an Arduino or an ESP8266 to an ESP32, where the analogue pin has to move.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ADC oneshot mode driver: the notes on ADC2 and Wi-Fi for the ESP32, ESP32-S2 and ESP32-S3.',
    'Espressif, *ESP32-C3 Series Datasheet*: the note on ADC2, and the ADC pin table; the ADC sections of the ESP32 and ESP32-C6 datasheets.',
    'MicroPython documentation, *Quick reference for the ESP32*: ADC, with the note on ADC block 2 and Wi-Fi.'
  ],
  sim: 'gp-adc-wifi'
},

/* ================================================================ safe-pins-esp32 */
{
  id: 'safe-pins-esp32',
  parent: 'gpio-and-pinouts',
  title: 'Which pins to use on an ESP32',
  level: 1,
  short: 'The bookmark page for the original ESP32: every GPIO sorted into use freely, use with care (and why), and leave alone, with the differences between a bare chip and a module.',
  keywords: ['safe pins', 'which pins', 'ESP32 pinout', 'GPIO list', 'good pins', 'bad pins', 'ESP32 DevKit pins', 'WROOM', 'WROVER', 'GPIO16 GPIO17', 'GPIO6-11', 'GPIO12', 'VSPI', 'free pins'],
  prereq: ['reading-a-pinout', 'strapping-pins', 'input-only-and-special-pins'],
  related: ['safe-pins-s3-c3-c6', 'planning-pins', 'pins-at-boot', 'adc1-adc2-and-wifi', 'soc-esp32', 'esp32-devkitc', 'wroom-wrover-mini-pico'],
  body: `For every pin of the original ESP32: use it freely, use it with care (and why), or leave it alone. The verdicts are the ones the pinout explorer shows ([the explorer](#/tools/pinout)), taken from Espressif's datasheet. The chip has 34 GPIOs; GPIO20, 24 and 28 to 31 do not exist.

### Use freely: 11 pins

| GPIO | What else it is |
|---|---|
| 4 | ADC2, touch, wake-up; rests low at reset |
| 18, 19, 23 | the VSPI bus: SCK, MISO, MOSI |
| 21, 22 | the default I2C: SDA, SCL |
| 25, 26 | the two 8-bit DAC outputs; ADC2 |
| 27 | ADC2, touch, wake-up |
| 32, 33 | ADC1, touch, wake-up; the 32 kHz crystal pins if one is fitted |

(Of these, 4, 25, 26 and 27 are ADC2 pins: not for analogue input while Wi-Fi is on.)

### Use with care

| GPIO | Why |
|---|---|
| 0 | strapping, the BOOT button: low at reset means download mode |
| 2 | strapping, the on-board LED of many boards |
| 5 | strapping; reported to emit a PWM-like signal at boot |
| 12 | strapping: high at reset selects 1.8 V flash and the board will not boot |
| 15 | strapping; low silences the boot log |
| 13, 14 | JTAG pins; 14 reported to output PWM at boot |
| 1, 3 | UART0: the serial console and the boot log |
| 16, 17 | PSRAM on WROVER modules; free on a plain WROOM-32 |
| 34 to 39 | input-only, no pull resistors; the right pins for analogue inputs |

### Leave alone

**GPIO6 to 11** are wired to the flash memory on all common modules. Some headers label them D0 to D3, CMD and CLK.

### Bare chip or module

The table describes the chip. A module spends pins of its own: the flash on GPIO6 to 11, the PSRAM on 16 and 17 for WROVER and for chips with memory in the package, and a board adds an LED, a BOOT button, a USB bridge on GPIO1 and 3. GPIO37 and 38 are usually not on the header.

> [!key] On an ESP32 build around 4, 18, 19, 21, 22, 23, 25 to 27, 32 and 33; keep 34 to 39 for inputs; treat 0, 2, 5, 12, 15 as strapping pins and never touch 6 to 11. The Arduino core's default chip-select, GPIO5, is a strapping pin: move it.`,
  ideas: [
    'Eleven ESP32 pins carry no warning: 4, 18, 19, 21, 22, 23, 25, 26, 27, 32 and 33.',
    'The with-care pins are strapping (0, 2, 5, 12, 15), JTAG (13, 14), console (1, 3), PSRAM (16, 17) and input-only (34 to 39).',
    'GPIO6 to 11 belong to the flash and are never usable.',
    'A module and a board spend pins of their own; the chip table is where you start.'
  ],
  pitfalls: [
    'GPIO2 and GPIO0 cannot be used at all — They are normal pins once the chip has started; only their level at reset matters. Check what is wired to them.',
    'GPIO16 and 17 are free on every ESP32 board — Only on modules without PSRAM. On a WROVER they go to the PSRAM and are not even brought out.',
    'The Arduino default SS pin, GPIO5, is a plain pin — It is a strapping pin that also glitches at boot. Choose another chip-select.'
  ],
  terms: [
    { term: 'Safe pin', also: ['free pin', 'use freely'], def: 'A pin that carries no warning in the datasheet\'s pin table: no strapping role, no flash, USB or console duty. Ordinary input and output work on it without surprises.' },
    { term: 'WROVER', also: ['ESP32-WROVER', 'PSRAM module'], def: 'A family of ESP32 modules with PSRAM next to the chip. The PSRAM uses GPIO16 and 17, so those pins are lost.' },
    { term: 'VSPI', also: ['SPI3', 'default SPI bus'], def: 'The ESP32\'s default SPI bus in the Arduino core: SCK on GPIO18, MISO on GPIO19, MOSI on GPIO23, chip select on GPIO5.' },
    { term: 'Bare chip', also: ['bare SoC', 'chip pinout'], def: 'The chip as the datasheet describes it, before a module or board has used any of its pins for flash, PSRAM, LEDs or buttons.' }
  ],
  code: [
    {
      title: 'A starting pin map for an ESP32',
      about: 'The pin map sits at the top, with pins taken from the "use freely" list: a button with the internal pull-up, an LED, and an analogue input on an input-only ADC1 pin. Holding the button lights the LED and prints the sensor voltage.',
      needs: 'An ESP32 DevKit, a button, an LED with a 330 Ω resistor and a potentiometer for the sensor.',
      wiring: [['GPIO27', 'button → GND', 'internal pull-up'], ['GPIO25', '330 Ω → LED → GND'], ['GPIO34', 'potentiometer wiper', 'ADC1_CH6: input-only, which is exactly its job']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input with pull-up v]    // button
          set pin (25) as [output v]                // LED
        forever
          if <(read pin (27)) = [LOW v]> then       // button held
            set pin (25) to [HIGH v]
            print (join [sensor mV: ] (analog read pin (34) in millivolts))
          else
            set pin (25) to [LOW v]
          end
          wait (0.2) seconds
        end
      `,
      cpp: String.raw`
        const int PIN_BUTTON = 27;       // button to GND, internal pull-up
        const int PIN_LED    = 25;       // 330 ohm and an LED to GND
        const int PIN_SENSOR = 34;       // ADC1_CH6, input-only: valid with Wi-Fi on

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_BUTTON, INPUT_PULLUP);
          pinMode(PIN_LED, OUTPUT);
        }

        void loop() {
          bool held = digitalRead(PIN_BUTTON) == LOW;
          digitalWrite(PIN_LED, held);
          if (held) Serial.printf("sensor mV: %lu\n", (unsigned long)analogReadMilliVolts(PIN_SENSOR));
          delay(200);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        PIN_BUTTON = 27                  # button to GND, internal pull-up
        PIN_LED = 25                     # 330 ohm and an LED to GND
        PIN_SENSOR = 34                  # ADC1_CH6, input-only: valid with Wi-Fi on

        button = Pin(PIN_BUTTON, Pin.IN, Pin.PULL_UP)
        led = Pin(PIN_LED, Pin.OUT)
        sensor = ADC(Pin(PIN_SENSOR), atten=ADC.ATTN_11DB)

        while True:
            held = button.value() == 0
            led.value(held)
            if held:
                print("sensor mV:", sensor.read_uv() // 1000)
            time.sleep_ms(200)
      `,
      notes: ['GPIO25 is also a DAC pin; using it as a plain output is fine, but keep the DAC pins free if you will need an analogue output.']
    }
  ],
  quiz: [
    { q: 'Which of these ESP32 pins carries no warning in the pin table?', choices: ['GPIO12', 'GPIO21', 'GPIO6', 'GPIO34'], a: 1, why: 'GPIO21 is the default I2C SDA pin with no restriction. GPIO12 is a strapping pin, GPIO6 is a flash pin, and GPIO34 is input-only (fine for inputs, not a general pin).' },
    { q: 'Why is GPIO16 usable on an ESP32-WROOM-32 but not on an ESP32-WROVER?', choices: ['The WROVER has no GPIO16 inside', 'The WROVER connects its PSRAM to GPIO16 and 17', 'GPIO16 is a strapping pin on the WROVER', 'GPIO16 is input-only on the WROVER'], a: 1, why: 'A WROVER module carries PSRAM, which uses GPIO16 and 17. A plain WROOM-32 has no PSRAM, so those pins are free.' },
    { q: 'GPIO2 can never be used, because it is a strapping pin.', a: false, why: 'The level of a strapping pin matters only at reset. After the start GPIO2 is an ordinary pin, and on many boards it carries the on-board LED. Just do not let a part hold it at the wrong level at power-up.' },
    { q: 'You want an output for a relay driver on an ESP32 DevKit. Which pin is the best choice?', choices: ['GPIO12', 'GPIO23', 'GPIO6', 'GPIO1'], a: 1, why: 'GPIO23 (VSPI MOSI) has no warning. GPIO12 can stop the boot, GPIO6 is a flash pin and GPIO1 is the noisy console TX.' }
  ],
  applications: [
    'The first pin plan for almost every ESP32 DevKit project.',
    'Choosing a replacement pin when a tutorial uses GPIO12, GPIO5 or a flash pin by mistake.',
    'Checking a PCB design: which header pins may be wired to loads and which carry strapping.',
    'Teaching beginners why "any pin will do" is nearly, but not quite, true.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: pin overview, GPIO and RTC GPIO tables, strapping pins.',
    'Espressif, *ESP32-WROOM-32* and *ESP32-WROVER* module datasheets: which pins the flash and PSRAM use.',
    'Espressif, *ESP-IDF Programming Guide*, GPIO reference for the ESP32: the pin restrictions listed there.'
  ],
  sim: { id: 'gp-pinout-reader', params: { board: 'esp32-devkitc-v4', colour: 'verdict' } }
},

/* ================================================================ safe-pins-s3-c3-c6 */
{
  id: 'safe-pins-s3-c3-c6',
  parent: 'gpio-and-pinouts',
  title: 'Which pins to use on the S3, C3 and C6',
  level: 1,
  short: 'The bookmark page for the ESP32-S3, C3 and C6: which GPIOs to use freely, which with care and which to leave alone, and how bare chips differ from modules (octal PSRAM, flash pins).',
  keywords: ['safe pins S3', 'safe pins C3', 'safe pins C6', 'ESP32-S3 pinout', 'ESP32-C3 pinout', 'ESP32-C6 pinout', 'GPIO35 GPIO36 GPIO37', 'octal PSRAM', 'N16R8', 'XIAO pins', 'GPIO3 GPIO10 C3', 'USB pins'],
  prereq: ['safe-pins-esp32', 'strapping-pins', 'input-only-and-special-pins'],
  related: ['planning-pins', 'adc1-adc2-and-wifi', 'soc-esp32-s3', 'soc-esp32-c3', 'soc-esp32-c6', 'living-with-few-pins', 'psram-on-modules'],
  body: `These chips have fewer traps than the original ESP32 and no input-only pins, but each has its own. The verdicts match [the pinout explorer](#/tools/pinout).

### ESP32-S3 (45 GPIOs: 0 to 21 and 26 to 48)

- **Use freely:** GPIO1, 2, 4 to 14, 17, 18, 21 and 38. GPIO1 to 20 show a 60 µs glitch at power-up; GPIO11 to 18 are ADC2 pins, unreliable with Wi-Fi; GPIO38 is the RGB LED on some DevKitC-1 boards.
- **With care:** 0 (BOOT), 3, 45 and 46 (strapping); 19 and 20 (USB); 43 and 44 (console); 39 to 42 (JTAG, free by default); 15 and 16 (32 kHz crystal, if fitted); 47 and 48 (1.8 V on R16V modules).
- **Leave alone:** 26 to 32 (flash and PSRAM); 33 to 37 (octal PSRAM). On modules with octal PSRAM such as the N16R8, GPIO35 to 37 are taken, though the DevKitC-1 header shows them; on N8 and N4 modules they are free, and 33 and 34 are not brought out.

### ESP32-C3 (22 GPIOs: 0 to 21)

Only **GPIO3 and GPIO10** carry no warning, yet boards offer a dozen pins, because most of the "with care" pins are mild.

- **Mild care:** 0 and 1 (free unless a 32 kHz crystal is fitted); 4 to 7 (JTAG pads, free as JTAG runs over USB; GPIO5 is the unusable ADC2 pin).
- **Real care:** 2, 8 and 9 (strapping; 9 is BOOT; the RGB LED and the Arduino SDA sit on 8); 18 and 19 (USB); 20 and 21 (console).
- **Leave alone:** 11 (flash supply) and 12 to 17 (flash). Some versions do not bring out 12 to 17 at all.

### ESP32-C6 (up to 30 GPIOs)

- **Use freely:** 2, 3, 10, 11, 14 and 18 to 23. GPIO10 and 11 exist only on the 40-pin package, GPIO14 only on the 32-pin one; 18 to 23 are SDIO pins, free unless the SDIO slave is used.
- **With care:** 0 and 1 (crystal); 4, 5, 8, 9 and 15 (strapping, though only GPIO9 matters for a normal boot); 6 and 7 (JTAG pads); 12 and 13 (USB); 16 and 17 (console).
- **Leave alone:** 24 to 30 (flash on the 40-pin chip; 27 is its supply).

### Chip or module

The tables describe the chip. A thumb-sized board such as the XIAO ESP32C3 brings out only 11 pins, and a module takes the memory pins for itself. Look up the board's header in the explorer, not only the chip.

> [!key] S3: 17 free pins, but never 26 to 37 on an octal-PSRAM module. C3: just GPIO3 and 10 are free, the JTAG pads 4 to 7 are mild. C6: 2, 3, 18 to 23 are free, and only GPIO9 matters at boot.`,
  ideas: [
    'The S3 has 17 free pins; GPIO26 to 37 belong to flash and octal PSRAM and GPIO19 and 20 to USB.',
    'The C3 has only two pins with no warning (GPIO3, GPIO10), but the JTAG pads 4 to 7 and the crystal pins 0 and 1 are mild exceptions.',
    'The C6 has free pins 2, 3, 10, 11, 14 and 18 to 23; of its five strapping pins only GPIO9 matters for a normal boot.',
    'A bare chip and a module differ: octal PSRAM, in-package flash and thumb-sized boards remove pins.'
  ],
  pitfalls: [
    'All 45 GPIOs of the S3 are usable — GPIO26 to 32 are always memory pins, GPIO33 to 37 on octal-PSRAM modules, GPIO19 and 20 carry USB. Roughly 17 are free.',
    'The C3 has only two usable pins — It has about a dozen once the mild exceptions (JTAG pads, crystal pins) are accepted; the "with care" verdict is graded, not a ban.',
    'A C6 pin number from one board works on another — GPIO10 and 11 exist only on the 40-pin package and GPIO14 only on the 32-pin one: check the package of your module.'
  ],
  terms: [
    { term: 'Octal PSRAM', also: ['OPI PSRAM', 'octal SPI RAM'], def: 'External RAM with eight data lines, used on ESP32-S3 R8 and R16V parts. It occupies GPIO33 to 37 (GPIO35 to 37 on modules such as the N16R8).' },
    { term: 'QFN40 and QFN32', also: ['package variant', '40-pin package'], def: 'The two packages of the ESP32-C6. The 40-pin chip has GPIO10 and 11 and external flash on GPIO24 to 30; the 32-pin chip has GPIO14 and its flash inside.' },
    { term: 'LP GPIO', also: ['LP IO', 'RTC IO'], def: 'A pin that stays usable while the main system sleeps. On the C6 these are GPIO0 to 7; they can wake the chip from deep sleep.' }
  ],
  code: [
    {
      title: 'One sketch, three pin maps',
      about: 'The same program for an ESP32-S3, C3 or C6. Each chip has its own set of "use freely" pins at the top; everything below is identical. Holding the button lights the LED and prints the sensor voltage.',
      needs: 'An ESP32-S3, C3 or C6 board, a button, an LED with a 330 Ω resistor, and a potentiometer.',
      wiring: [['button', 'to GND', 'S3: GPIO4 · C3: GPIO10 · C6: GPIO3; internal pull-up'], ['LED', '330 Ω → LED → GND', 'S3: GPIO5 · C3: GPIO4 · C6: GPIO18'], ['sensor', 'potentiometer wiper', 'S3: GPIO1 · C3: GPIO3 · C6: GPIO2 (all ADC1)']],
      blocks: `
        when started
          start serial at (115200) baud
          pick the pin map for this chip :: my           // S3: 4, 5, 1 · C3: 10, 4, 3 · C6: 3, 18, 2 (button, LED, sensor)
          set pin (button) as [input with pull-up v]
          set pin (led) as [output v]
        forever
          if <(read pin (button)) = [LOW v]> then
            set pin (led) to [HIGH v]
            print (join [sensor mV: ] (analog read pin (sensor) in millivolts))
          else
            set pin (led) to [LOW v]
          end
          wait (0.2) seconds
        end
      `,
      cpp: String.raw`
        #if CONFIG_IDF_TARGET_ESP32S3
          const int PIN_BUTTON = 4, PIN_LED = 5, PIN_SENSOR = 1;
        #elif CONFIG_IDF_TARGET_ESP32C3
          const int PIN_BUTTON = 10, PIN_LED = 4, PIN_SENSOR = 3;    // GPIO4: a JTAG pad, free by default
        #elif CONFIG_IDF_TARGET_ESP32C6
          const int PIN_BUTTON = 3, PIN_LED = 18, PIN_SENSOR = 2;
        #else
          #error "Add a pin map for this chip"
        #endif

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_BUTTON, INPUT_PULLUP);
          pinMode(PIN_LED, OUTPUT);
        }

        void loop() {
          bool held = digitalRead(PIN_BUTTON) == LOW;
          digitalWrite(PIN_LED, held);
          if (held) Serial.printf("sensor mV: %lu\n", (unsigned long)analogReadMilliVolts(PIN_SENSOR));
          delay(200);
        }
      `,
      py: String.raw`
        import sys
        from machine import Pin, ADC
        import time

        chip = sys.implementation._machine       # the name ends with the chip, such as ESP32C3
        if "ESP32S3" in chip:
            PIN_BUTTON, PIN_LED, PIN_SENSOR = 4, 5, 1
        elif "ESP32C3" in chip:
            PIN_BUTTON, PIN_LED, PIN_SENSOR = 10, 4, 3     # GPIO4: a JTAG pad, free by default
        elif "ESP32C6" in chip:
            PIN_BUTTON, PIN_LED, PIN_SENSOR = 3, 18, 2
        else:
            raise RuntimeError("Add a pin map for " + chip)

        button = Pin(PIN_BUTTON, Pin.IN, Pin.PULL_UP)
        led = Pin(PIN_LED, Pin.OUT)
        sensor = ADC(Pin(PIN_SENSOR), atten=ADC.ATTN_11DB)

        while True:
            held = button.value() == 0
            led.value(held)
            if held:
                print("sensor mV:", sensor.read_uv() // 1000)
            time.sleep_ms(200)
      `,
      notes: ['On a thumb-sized board only some of these pins are brought out: check your board\'s header in the pinout explorer and move a pin if it is missing.', 'The C3\'s LED pin, GPIO4, is a JTAG pad that is free by default; the only other pin of the C3 with no warning is GPIO3, which the sensor uses.']
    }
  ],
  quiz: [
    { q: 'Which two pins of the ESP32-C3 carry no warning in the pin table?', choices: ['GPIO3 and GPIO10', 'GPIO2 and GPIO8', 'GPIO18 and GPIO19', 'GPIO20 and GPIO21'], a: 0, why: 'GPIO2 and 8 are strapping pins, 18 and 19 carry USB, 20 and 21 are the console. GPIO3 and 10 are the two plain pins.' },
    { q: 'Which pins are unavailable on an ESP32-S3 module with octal PSRAM, such as the N16R8?', choices: ['GPIO35 to 37, besides the flash pins GPIO26 to 32', 'GPIO1 to 10', 'GPIO45 and 46 only', 'GPIO43 and 44 only'], a: 0, why: 'The octal PSRAM uses GPIO33 to 37; on the N16R8 module GPIO35 to 37 are blocked, and GPIO26 to 32 are always the flash and PSRAM bus.' },
    { q: 'On the ESP32-C6, all of GPIO24 to 30 may be used on a board with external flash.', a: false, why: 'GPIO24 to 30 are the SPI flash pins on the 40-pin chip (27 is the flash supply). On a board with external flash they must stay untouched.' },
    { q: 'Of the five strapping pins of the ESP32-C6, which is the only one that matters for a normal boot?', choices: ['GPIO4', 'GPIO8', 'GPIO9', 'GPIO15'], a: 2, why: 'GPIO9 selects between running the program (high) and download mode (low). The others are ignored in a normal boot, but GPIO8 must be high or floating for download mode.' }
  ],
  applications: [
    'Choosing pins on XIAO ESP32C3, C6 and S3 boards, which expose only about eleven GPIOs.',
    'Porting a project between chips: the pin map changes while the program stays.',
    'S3 projects with a camera or display, where PSRAM and many pins compete.',
    'Low-power C6 and C3 sensors, whose wake-up pins must be among the RTC GPIOs.'
  ],
  sources: [
    'Espressif, *ESP32-S3 Series Datasheet*, *ESP32-C3 Series Datasheet* and *ESP32-C6 Series Datasheet*: pin overview, IO MUX and GPIO tables, strapping pins.',
    'Espressif, *ESP32-S3-WROOM-1 Datasheet*: pins used by octal flash and PSRAM on the R8 variants.',
    'Espressif, *ESP-IDF Programming Guide*, GPIO reference for the ESP32-S3, C3 and C6.'
  ],
  sim: { id: 'gp-pinout-reader', params: { board: 'esp32-s3-devkitc-1-v1.1', colour: 'verdict' } }
},

/* ================================================================ planning-pins */
{
  id: 'planning-pins',
  parent: 'gpio-and-pinouts',
  title: 'Planning the pins of a project',
  level: 2,
  short: 'Spend ten minutes choosing pins before you wire: list the jobs, remove what is taken, place the picky jobs first, then buses, then simple pins, and keep a few spare. The pin planner does the first draft.',
  keywords: ['pin planning', 'pin assignment', 'pin map', 'pin budget', 'which pin for', 'planner', 'GPIO matrix', 'IO MUX', 'spare pins', 'wiring plan', 'pin conflicts', 'project pins'],
  prereq: ['safe-pins-esp32', 'adc1-adc2-and-wifi', 'strapping-pins'],
  related: ['safe-pins-s3-c3-c6', 'input-only-and-special-pins', 'gpio-matrix-and-io-mux', 'io-expanders-and-shift-registers', 'block-diagrams', 'choosing-a-board', 'living-with-few-pins'],
  body: `A project of ten wires goes smoothly when you choose its pins first, and badly when every part takes "the next free pin". Planning is a short list and a few rules.

### The method

1. **List the jobs:** every sensor, button, LED, bus and display. Mark which are analogue, which must wake the chip from sleep, which are fast.
2. **Remove what is taken:** flash and PSRAM pins, USB pins if you want USB, the console pins if you want the serial monitor, and whatever the board itself uses (its LED, buttons, display, SD slot).
3. **Place the picky jobs first:** analogue inputs (ADC1 pins when Wi-Fi is used), the DAC, touch pads, wake-up pins. Few pins can do them.
4. **Then the buses.** Since the GPIO matrix routes most peripherals to any output-capable pin, I2C, SPI, UART, PWM and RMT can go almost anywhere; the direct IO MUX pins give the highest speed.
5. **Last the simple pins** (LEDs, buttons, relays) on "use freely" pins. Strapping and "with care" pins come at the very end, with the resting level checked ([[pins-at-boot]]).
6. **Keep two or three pins spare** for the thing you forget.
7. **Write it down** as a table, and as constants at the top of the program.

### Which jobs are picky

| Job | What it needs |
|---|---|
| Analogue input | an ADC pin; with Wi-Fi on the ESP32, S2 and S3, an ADC1 pin ([[adc1-adc2-and-wifi]]) |
| Analogue output | a DAC: GPIO25 and 26 on the ESP32, GPIO17 and 18 on the S2 |
| Touch | ESP32: GPIO4, 0, 2, 15, 13, 12, 14, 27, 33, 32 (ten pads); S3: GPIO1 to 14 |
| Wake from deep sleep | an RTC pin: ESP32 0, 2, 4, 12 to 15, 25 to 27, 32 to 39; S3 0 to 21; C3 0 to 5; C6 0 to 7 |
| Input only | the ESP32's GPIO34 to 39 are fine for inputs, useless for outputs |

### The planner

[The pin planner](#/tools/pinout/plan) does steps 3 to 6: pick a board, list the jobs, and it returns an assignment with the reasons and warnings, as constants for C++ and Python. Treat the result as a first draft and check each pin against its verdict ([[safe-pins-esp32]], [[safe-pins-s3-c3-c6]]): the planner knows the board's header, but you know the part that will sit on it.

### Plan the wires too

Group the pins of one part so that its wires leave side by side, keep signal pins away from the power pad of a noisy part, and choose a board with a few more pins than you need. Running short is solved by [[io-expanders-and-shift-registers|port expanders]], not by strapping pins.

> [!key] List the jobs, remove what is taken, place the picky jobs (analogue, DAC, touch, wake-up) first, then the buses, then the simple pins; keep spare pins, and write the map down. A planner can draft it; you check it.`,
  ideas: [
    'Choosing the pins first is a short list: jobs, taken pins, picky jobs, buses, simple pins, spares.',
    'Analogue, DAC, touch and wake-up pins are fixed in hardware; most digital peripherals go to any output-capable pin.',
    'The pin planner gives a first draft with reasons and warnings; the final check is yours.',
    'Keep two or three pins spare and write the pin map down.'
  ],
  pitfalls: [
    'Any pin can do anything — Most digital peripherals are routed freely by the GPIO matrix, but analogue inputs, the DAC, touch pads and wake-up pins sit on fixed pins.',
    'I will decide the pins as I wire — The picky jobs then find their pins taken. Place analogue, DAC, touch and wake-up first.',
    'The planner\'s answer is final — It knows the pin tables and the board\'s header, not your parts. Check every pin against its verdict.'
  ],
  terms: [
    { term: 'Pin map', also: ['pin assignment', 'pin plan'], def: 'The table of which pin does which job in a project, kept in the documentation and as constants at the top of the program.' },
    { term: 'Pin budget', also: ['pin count', 'free pins'], def: 'The number of pins a project needs against the number the board offers after the taken ones (flash, USB, console, on-board parts) are removed.' },
    { term: 'Dedicated pin', also: ['fixed-function pin', 'analogue pin'], def: 'A pin whose function is fixed in hardware, such as an ADC channel, a DAC output, a touch pad or a wake-up GPIO. Digital peripherals, in contrast, can usually be routed to any pin.' }
  ],
  code: [
    {
      title: 'The pin map of a small project, in one place',
      about: 'A plant-watering monitor: a sensor on an ADC1 pin, a button, a status LED and a pump driven through a MOSFET. All the pins sit in one block at the top. While the button is held the pump runs and the sensor reading is printed.',
      needs: 'An ESP32 DevKit, a soil sensor with a 0 to 3.3 V output, a button, an LED with 330 Ω, and a MOSFET stage for the pump as in [[pin-current-limits]].',
      wiring: [['GPIO34', 'soil sensor output', 'ADC1_CH6, input-only'], ['GPIO4', 'button → GND', 'internal pull-up'], ['GPIO18', '100 Ω → MOSFET gate', 'with 100 kΩ gate-to-ground'], ['GPIO27', '330 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [input with pull-up v]      // button
          set pin (18) as [output v]                 // pump gate
          set pin (27) as [output v]                 // status LED
        forever
          if <(read pin (4)) = [LOW v]> then         // button held: run the pump
            set pin (18) to [HIGH v]
            set pin (27) to [HIGH v]
          else
            set pin (18) to [LOW v]
            set pin (27) to [LOW v]
          end
          print (join [soil mV: ] (analog read pin (34) in millivolts))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        // the pin map: one place to change a pin
        const int PIN_SENSOR = 34;       // soil sensor: ADC1_CH6, input-only, valid with Wi-Fi on
        const int PIN_BUTTON = 4;        // manual pump button to GND, internal pull-up
        const int PIN_PUMP   = 18;       // 100 ohm to the gate of the MOSFET that switches the pump
        const int PIN_LED    = 27;       // status LED, 330 ohm to GND

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_BUTTON, INPUT_PULLUP);
          pinMode(PIN_PUMP, OUTPUT);
          pinMode(PIN_LED, OUTPUT);
        }

        void loop() {
          bool run = digitalRead(PIN_BUTTON) == LOW;   // the pump runs while the button is held
          digitalWrite(PIN_PUMP, run);
          digitalWrite(PIN_LED, run);
          Serial.printf("soil mV: %lu\n", (unsigned long)analogReadMilliVolts(PIN_SENSOR));
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        # the pin map: one place to change a pin
        PIN_SENSOR = 34                  # soil sensor: ADC1_CH6, input-only, valid with Wi-Fi on
        PIN_BUTTON = 4                   # manual pump button to GND, internal pull-up
        PIN_PUMP = 18                    # 100 ohm to the gate of the MOSFET that switches the pump
        PIN_LED = 27                     # status LED, 330 ohm to GND

        sensor = ADC(Pin(PIN_SENSOR), atten=ADC.ATTN_11DB)
        button = Pin(PIN_BUTTON, Pin.IN, Pin.PULL_UP)
        pump = Pin(PIN_PUMP, Pin.OUT)
        led = Pin(PIN_LED, Pin.OUT)

        while True:
            run = button.value() == 0    # the pump runs while the button is held
            pump.value(run)
            led.value(run)
            print("soil mV:", sensor.read_uv() // 1000)
            time.sleep_ms(500)
      `,
      notes: ['The pump stage needs a gate pull-down and a flyback diode: see the fan example in [[pin-current-limits]].', 'Every pin here is a "use freely" pin, except GPIO34, which is input-only and used for exactly what it is for.']
    }
  ],
  quiz: [
    { q: 'In which order should the pins of a project be placed?', choices: ['The LEDs and buttons first, then the analogue inputs', 'The picky jobs (analogue, DAC, touch, wake-up) first, then buses, then simple pins', 'In the order of the header', 'Alphabetically by part name'], a: 1, why: 'Analogue, DAC, touch and wake-up pins are fixed in hardware and few; if ordinary jobs take them first, the picky jobs have nowhere to go. Digital buses and simple pins are flexible and fill the rest.' },
    { q: 'An original ESP32 project needs five analogue inputs and uses Wi-Fi. Where should they go?', choices: ['GPIO32 to 39 (ADC1)', 'GPIO0, 2, 4, 12 to 15, 25 to 27 (ADC2)', 'GPIO6 to 11', 'Any pin the board labels A'], a: 0, why: 'ADC1 has eight pins (GPIO32 to 39) that keep working while Wi-Fi runs; the ADC2 pins cannot be read then.' },
    { q: 'The pin planner\'s result needs no checking.', a: false, why: 'The planner knows the pin tables and the board\'s header but not the parts you will connect. Check each pin against its verdict and against what the part does at power-up.' },
    { q: 'Why keep two or three pins spare?', choices: ['The chip needs them for itself', 'A late feature will want a pin, and rewiring a finished board is costly', 'Unused pins save power', 'The program refuses to compile otherwise'], a: 1, why: 'Every project grows a sensor or an LED late. A spare pin makes that a one-line change instead of a rewiring job.' }
  ],
  applications: [
    'Designing a PCB around an ESP module, where pins are fixed once the board is made.',
    'Wiring a prototype on a breadboard so that sensors, display and buttons stay on separate, tidy pins.',
    'Moving a project to a smaller board with fewer pins, and finding what must move.',
    'Documenting a product so that a colleague can see which pin does what.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* and the datasheets of the ESP32-S3, C3 and C6: pin tables, IO MUX and GPIO matrix, RTC GPIOs.',
    'Espressif, *ESP-IDF Programming Guide*: the GPIO and peripheral pin restrictions of each chip.',
    'Espressif, *Hardware Design Guidelines*: pin and strapping considerations for a board design.'
  ],
  sim: 'gp-pin-planner'
}
);
