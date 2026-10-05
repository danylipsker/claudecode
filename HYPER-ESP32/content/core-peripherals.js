/* HYPER-ESP32 · content/core-peripherals.js
 *
 * Topic "The core peripherals" (branch Programming): the hardware blocks every program ends up using — digital output
 * and input, interrupts, PWM with LEDC, the ADC, the DAC, hardware timers, the RMT, the pulse counter, MCPWM,
 * watchdogs, random numbers and chip identity, and the internal temperature sensor.
 * Simulations: sims/core-peripherals.js (ids cr-…).
 */
Hyper.add(
/* ================================================================ digital output */
{
  id: 'digital-output',
  parent: 'core-peripherals',
  title: 'Digital output',
  level: 1,
  short: 'A pin that the program sets to 3.3 V or to 0 V. It is the simplest peripheral and the one every other output stands on: LEDs, transistors, relays and chip-select lines all start here, and it has a few rules worth knowing — two output types, how much a pin may drive, and what a pin does before the program starts.',
  keywords: ['GPIO', 'output', 'pinMode', 'digitalWrite', 'OUTPUT', 'OUTPUT_OPEN_DRAIN', 'push-pull', 'open-drain', 'Pin.OUT', 'Pin.OPEN_DRAIN', 'drive strength', 'high', 'low', 'set pin', 'LED', 'binary counter'],
  prereq: ['reading-a-pinout', 'three-volt-logic', 'first-program-blink'],
  related: ['digital-input', 'pin-current-limits', 'pins-at-boot', 'gpio-matrix-and-io-mux', 'transistor-as-a-switch', 'mosfets-for-loads', 'leds', 'input-only-and-special-pins', 'electronics:push-pull'],
  body: `A digital output is the plainest thing a microcontroller does. The program writes a 1 or a 0 and a pin of the chip goes to the supply voltage, 3.3 V, or to ground. Everything an ESP32 does to the outside world — lighting an LED, clicking a relay, selecting a chip on a bus — starts with a pin doing exactly that, and the peripherals later in this topic (PWM, the RMT) are digital outputs driven by hardware instead of by your program.

### Push-pull and open-drain

Each pad has an output stage of two transistors, one towards the supply and one towards ground. In the usual **push-pull** mode the level you write switches one of them on: high connects the pad to 3.3 V, low connects it to ground, so the pin drives both ways. In **open-drain** mode only the lower transistor is used: low pulls the pad to ground, high simply lets go and the pad floats. Something outside, a pull-up resistor, must supply the high level. That is how several devices share one wire (I2C, 1-Wire): none can fight another for the line.

| What you want | Arduino C++ | MicroPython |
|---|---|---|
| Push-pull output | \`pinMode(pin, OUTPUT)\` | \`Pin(pin, Pin.OUT)\` |
| Open-drain output | \`pinMode(pin, OUTPUT_OPEN_DRAIN)\` | \`Pin(pin, Pin.OPEN_DRAIN)\` |
| Set the level | \`digitalWrite(pin, HIGH)\` | \`pin.value(1)\`, \`pin.on()\`, \`pin.off()\` |

### What a pin can drive

A pin is a signal source, not a power supply. A pad can source or sink a few tens of milliamps at the very most, the chip as a whole has a limit too, and each chip sets a default drive strength (on the ESP32-C3, 20 mA for most pins and 10 mA for GPIO2 to GPIO5). An LED with its resistor takes 5 to 10 mA and is fine; a relay coil, a motor or a strip of LEDs goes through a transistor ([[transistor-as-a-switch]], [[mosfets-for-loads]]), and [[pin-current-limits]] has the numbers. The pins are 3.3 V devices, not 5 V tolerant ([[three-volt-logic]]).

### Which pins, and the moment before your program

Most pins can be outputs. On the original ESP32 GPIO34 to GPIO39 are input-only, and the pins wired to the flash are off limits; on the S3 and C3 every pin is bidirectional ([[input-only-and-special-pins]]). A pin also has a past: at reset it is an input, your \`pinMode\` runs a fraction of a second later, and some pins glitch at power-up (on the S3, GPIO1 to GPIO20 pulse low for about 60 µs), so whatever a pin drives must cope with that ([[pins-at-boot]]). To avoid a wrong first level, MicroPython can give it in the constructor, \`Pin(2, Pin.OUT, value=1)\`; in Arduino write the level first and then make the pin an output, since the level is held in a register of its own.

A loop of \`digitalWrite\` calls is too coarse for patterns timed in microseconds: those belong to [[pwm-with-ledc|LEDC]] (PWM) and the [[the-rmt-peripheral|RMT]] (pulse trains).

> [!key] A digital output puts a pin at 3.3 V or 0 V: push-pull drives both levels, open-drain only pulls low and needs a pull-up. A pin carries signals, not power, so anything that draws more than a few milliamps is switched by a transistor.`,
  ideas: [
    'Writing 1 or 0 puts the pin at 3.3 V or 0 V; everything else an output does is built on that.',
    'Push-pull drives both levels; open-drain only pulls low and needs a pull-up to make the high level, which is what lets many devices share one wire.',
    'A pin carries a signal, not power: loads beyond a few milliamps go through a transistor.',
    'Before the program runs a pin is an input, and at power-up some pins glitch: whatever they drive must be safe in that moment.'
  ],
  pitfalls: [
    'An open-drain pin written HIGH outputs 3.3 V — It outputs nothing: it lets go of the line. Without a pull-up resistor the pin floats and reads whatever the surroundings put on it.',
    'A GPIO can power a small motor or a relay directly — A pin gives a few tens of milliamps at most, and a coil kicks back a voltage spike when switched off. Use a transistor or MOSFET with a flyback diode.',
    'Every GPIO number on the datasheet is free to use as an output — GPIO34 to GPIO39 of the ESP32 cannot be outputs, GPIO6 to GPIO11 belong to the flash, and strapping pins can stop the board booting when something holds them.'
  ],
  terms: [
    { term: 'GPIO', also: ['general-purpose input/output', 'pin'], def: 'A pin of the chip that the program can set as an input or an output and read or drive one bit at a time. Most pins of an ESP32 can also be handed to a peripheral such as a serial port.' },
    { term: 'Push-pull', also: ['totem-pole output'], def: 'An output stage that actively drives both levels: one transistor connects the pad to the supply for high, the other connects it to ground for low. It is the normal mode of a GPIO.' },
    { term: 'Open-drain', also: ['open-collector', 'OUTPUT_OPEN_DRAIN'], def: 'An output stage that can only pull the pad to ground. High is not driven: the pad floats, so an external pull-up resistor must provide the high level. Used for shared lines such as I2C.' },
    { term: 'Drive strength', also: ['drive capability', 'output current'], def: 'How much current a pad is built to source or sink while keeping its level. The ESP32 lets a program choose from a few settings; a higher setting gives faster edges and more current but more noise.' },
    { term: 'Active low', also: ['inverted logic'], def: 'Wired so that the low level means on. A relay board or LED connected between the supply and the pin lights when the pin is written low.' }
  ],
  code: [
    {
      title: 'Count in binary on four LEDs',
      about: 'Four pins are the four bits of a number that counts from 0 to 15 and starts again. Each pin drives one LED through its own resistor.',
      needs: 'An ESP32 DevKit, four LEDs and four 220 Ω resistors. (On other boards choose four free pins.)',
      wiring: [['GPIO18', '220 Ω → LED → GND', 'bit 0'], ['GPIO19', '220 Ω → LED → GND', 'bit 1'], ['GPIO21', '220 Ω → LED → GND', 'bit 2'], ['GPIO22', '220 Ω → LED → GND', 'bit 3']],
      blocks: `
        when started
          set pin (18) as [output v]
          set pin (19) as [output v]
          set pin (21) as [output v]
          set pin (22) as [output v]
          set [value v] to (0)
        forever
          show (value) on the four LEDs :: my
          wait (0.4) seconds
          change [value v] by (1)
          if <(value) = (16)> then
            set [value v] to (0)
          end
        end

        define show (n) on the four LEDs
          set pin (18) to (bit (0) of (n))
          set pin (19) to (bit (1) of (n))
          set pin (21) to (bit (2) of (n))
          set pin (22) to (bit (3) of (n))
      `,
      cpp: String.raw`
        const int LEDS[] = {18, 19, 21, 22};     // bit 0 … bit 3
        const int N = 4;

        void setup() {
          for (int i = 0; i < N; i++) {
            pinMode(LEDS[i], OUTPUT);            // once: these pins drive something
          }
        }

        void loop() {
          for (int value = 0; value < 16; value++) {
            for (int bit = 0; bit < N; bit++) {
              digitalWrite(LEDS[bit], (value >> bit) & 1);   // the bit picks HIGH or LOW
            }
            delay(400);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LEDS = [Pin(n, Pin.OUT) for n in (18, 19, 21, 22)]   # bit 0 … bit 3

        while True:
            for value in range(16):
                for bit, led in enumerate(LEDS):
                    led.value((value >> bit) & 1)             # the bit picks 1 or 0
                time.sleep_ms(400)
      `,
      notes: ['GPIO22 and GPIO21 are the default I2C pins of the Arduino core; if you add an I2C part later, move the LEDs.', 'Each LED takes about 5 mA here. Four lit at once is still well inside what the chip allows.']
    }
  ],
  quiz: [
    { q: 'A pin is set to open-drain and written HIGH. Nothing else is connected. What is its voltage?', choices: ['3.3 V', '0 V', 'Not defined: nothing drives the pin, so it floats', 'About 1.65 V, halfway'], a: 2, why: 'High on an open-drain output means the lower transistor is off and the pad is released. Without a pull-up the voltage is whatever stray charge and noise make it.' },
    { q: 'A 12 V relay coil draws 80 mA. How should an ESP32 switch it?', choices: ['Connect the coil between the pin and ground', 'Use a transistor or MOSFET driven by the pin, with a flyback diode across the coil', 'Connect the coil to the 3.3 V pin instead', 'Set the pin to its highest drive strength'], a: 1, why: 'A pin gives a few tens of milliamps at 3.3 V at most. The pin only switches the small control current of a transistor; the transistor carries the coil current from its own supply, and the diode absorbs the spike when the coil is released.' },
    { q: 'You use GPIO36 as an output on an ESP32 DevKit. What happens?', choices: ['It works like any other pin', 'It cannot drive anything: GPIO34 to GPIO39 are input-only', 'It works but only at 1.8 V', 'The board resets'], a: 1, why: 'GPIO34 to GPIO39 of the original ESP32 have no output stage. They are good analogue and digital inputs and nothing else.' },
    { q: 'Which MicroPython line makes a pin start HIGH, with no moment of LOW?', choices: ['pin = Pin(2, Pin.OUT); pin.value(1)', 'pin = Pin(2, Pin.OUT, value=1)', 'pin = Pin(2, Pin.IN); pin.value(1)', 'pin = Pin(2, Pin.OPEN_DRAIN, 0)'], a: 1, why: 'Giving value=1 in the constructor sets the level as the pin becomes an output. With two separate statements the pin has its old level for a short moment first.' }
  ],
  applications: [
    'Indicator LEDs and the heartbeat LED of a device.',
    'Gate drive for transistors and MOSFETs that switch relays, solenoids, pumps and lamps.',
    'Enable, reset and chip-select lines of other chips: a display, an SD card, a sensor.',
    'The data lines of simple parallel interfaces, such as the pins of a character LCD.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *GPIO* API: pinMode, digitalWrite and the pin modes (core 3.3).',
    'MicroPython documentation, *machine.Pin*: modes, values and the ESP32 quick reference (version 1.29).',
    'Espressif, *ESP32 Series Datasheet*, the GPIO and electrical characteristics sections; ESP-IDF Programming Guide, *GPIO and RTC GPIO*.'
  ]
},

/* ================================================================ digital input */
{
  id: 'digital-input',
  parent: 'core-peripherals',
  title: 'Digital input',
  level: 1,
  short: 'Reading a pin as high or low. The one rule is never to let an input float: it needs a pull-up or a pull-down. Touch pads, the capacitive cousins of the digital input, are on the same page.',
  keywords: ['digitalRead', 'INPUT_PULLUP', 'INPUT_PULLDOWN', 'Pin.IN', 'Pin.PULL_UP', 'pull-up', 'pull-down', 'floating input', 'button', 'switch', 'threshold', 'touchRead', 'TouchPad', 'capacitive touch', 'active low'],
  prereq: ['digital-output', 'pull-ups-and-pull-downs', 'three-volt-logic'],
  related: ['interrupts', 'debouncing', 'buttons-and-switches', 'touch-pins', 'input-only-and-special-pins', 'level-shifters', 'electronics:schmitt-trigger', 'electronics:pull-resistors'],
  body: `A digital input asks one question: is this pin high or low? The chip compares the voltage on the pad with two thresholds, roughly a quarter and three quarters of the supply, and reports 1 above the upper one and 0 below the lower one. Between them the answer is undefined, and that is the whole difficulty: an input that nobody drives is not "off", it is **floating**, and it reads whatever noise the room puts on it, including your hand.

### Pull-ups and pull-downs

An input therefore needs a resting level. A switch to ground leaves the pin hanging when it is open, so a **pull-up resistor** holds the pin high until the switch pulls it low. The ESP32 has these resistors built in, about 45 kΩ — weak enough for a switch, too weak for a long cable — and you switch them on with the pin mode. The reading is then **active low**: pressed is 0. One exception matters: GPIO34 to GPIO39 of the original ESP32 have no internal pull resistors at all, so a switch on one of them needs a real resistor ([[pull-ups-and-pull-downs]], [[input-only-and-special-pins]]).

| Mode | Arduino C++ | MicroPython |
|---|---|---|
| Plain input | \`INPUT\` | \`Pin.IN\` |
| With pull-up | \`INPUT_PULLUP\` | \`Pin.IN, Pin.PULL_UP\` |
| With pull-down | \`INPUT_PULLDOWN\` | \`Pin.IN, Pin.PULL_DOWN\` |

### Reading it

\`digitalRead(pin)\` and \`pin.value()\` return the level at this instant. Two things go wrong with a mechanical switch. It chatters for a few milliseconds when it closes ([[debouncing]]), and a loop that only looks now and then can miss a short press altogether; the cure for that is an [[interrupts|interrupt]]. A signal from another circuit must stay between 0 and 3.3 V: a 5 V signal needs a divider or a level shifter ([[level-shifters]]).

### Touch pads: an input that measures capacitance

Some pins can also sense a finger. Behind a touch pad is a small oscillator whose speed depends on the capacitance of the pad; a finger near the pad adds capacitance and changes the count. The original ESP32 has ten such pads, the S2, S3 and P4 fourteen, and the C-series none. The direction of the change differs: on the ESP32 the reading **falls** when touched, on the S2 and S3 it **rises**. Raw numbers depend on pad size, wire length and board, so a program measures the untouched value first and compares against that, never against a fixed number. The simulation shows a finger approaching; [[touch-pins]] covers touch buttons in depth.

> [!key] A digital input reads high or low, so it must never float: give it a pull-up or a pull-down, and remember that GPIO34 to GPIO39 of the ESP32 have none. A switch bounces and a poll can miss it; touch pads measure capacitance instead, and are read against their own untouched baseline.`,
  ideas: [
    'An input reads high above about three quarters of the supply and low below about a quarter; in between it is undefined.',
    'A pin nobody drives floats: use the internal pull-up or pull-down, or an external resistor where there is none.',
    'With a pull-up and a switch to ground the pin is active low: pressed reads 0.',
    'Touch pads read capacitance: the value falls on the ESP32 and rises on the S2 and S3, so compare with a measured baseline.'
  ],
  pitfalls: [
    'An unconnected input reads 0 — It reads random values that follow electrical noise and your hand. Always give an input a defined resting level.',
    'INPUT_PULLUP works on every pin — Not on GPIO34 to GPIO39 of the original ESP32: the call is accepted and nothing happens. Use an external 10 kΩ resistor.',
    'A touch value above 40 means touched on every chip — Only the ESP32 falls when touched, and its numbers differ from board to board. Print the values and compare with a baseline.'
  ],
  terms: [
    { term: 'Floating input', also: ['floating pin', 'high-impedance input'], def: 'An input connected to nothing, or to a switch that is open. Its voltage is set by stray charge and noise, so its reading is meaningless.' },
    { term: 'Pull-up resistor', also: ['pull-up', 'INPUT_PULLUP'], def: 'A resistor from a pin to the supply that holds the pin high when nothing else drives it. The ESP32 has one inside each pad, of about 45 kΩ, that a program can switch on.' },
    { term: 'Pull-down resistor', also: ['pull-down', 'INPUT_PULLDOWN'], def: 'A resistor from a pin to ground that holds the pin low when nothing else drives it. Used with a switch that connects the pin to 3.3 V.' },
    { term: 'Logic threshold', also: ['VIH', 'VIL', 'input threshold'], def: 'The voltage at which an input changes its answer. Below about a quarter of the supply it reads low, above about three quarters it reads high, and between the two the result is not guaranteed.' },
    { term: 'Capacitive touch', also: ['touch sensor', 'touch pad', 'touchRead'], def: 'Sensing a finger through the capacitance it adds to a metal pad. The ESP32 measures it by counting the cycles of an oscillator that the pad slows down.' }
  ],
  sim: 'cr-touch',
  code: [
    {
      title: 'Read a button with the internal pull-up',
      about: 'The LED follows the button, and the program reports each change on the serial port. The button connects the pin to ground, so pressed reads LOW.',
      needs: 'An ESP32 DevKit, a push button and an LED (the on-board one on GPIO2 will do).',
      wiring: [['GPIO18', 'button → GND', 'internal pull-up'], ['GPIO2', 'LED (on-board, or 220 Ω → LED → GND)']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (18) as [input with pull-up v]
          set pin (2) as [output v]
          set [was pressed v] to <false>
        forever
          set [pressed v] to <(read pin (18)) = [LOW v]>
          set pin (2) to (pressed)
          if <(pressed) ≠ (was pressed)> then
            set [was pressed v] to (pressed)
            if <pressed> then
              print [pressed]
            else
              print [released]
            end
          end
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int BUTTON = 18;                       // button between GPIO18 and GND
        const int LED = 2;
        bool wasPressed = false;

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);             // reads HIGH until the button pulls it to GND
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW; // active low: pressed = LOW
          digitalWrite(LED, pressed);
          if (pressed != wasPressed) {
            wasPressed = pressed;
            Serial.println(pressed ? "pressed" : "released");
          }
          delay(10);                                 // look every 10 ms: skips most of the bounce
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        button = Pin(18, Pin.IN, Pin.PULL_UP)        # reads 1 until the button pulls it to GND
        led = Pin(2, Pin.OUT)
        was_pressed = False

        while True:
            pressed = button.value() == 0            # active low: pressed = 0
            led.value(pressed)
            if pressed != was_pressed:
                was_pressed = pressed
                print("pressed" if pressed else "released")
            time.sleep_ms(10)                        # look every 10 ms: skips most of the bounce
      `,
      output: `
        pressed
        released
        pressed
        released
      `,
      notes: ['Looking only every 10 ms is a crude debounce and can miss a press shorter than that. [[debouncing]] has better ways, and [[interrupts]] catch presses that a busy loop would not see.']
    },
    {
      title: 'Read a touch pad against its own baseline',
      about: 'Remembers what the pad reads when untouched, then lights the LED whenever the reading differs from that by more than 10 %. Working against the baseline makes the program independent of the direction of the change: it falls on the ESP32 and rises on the S2 and S3.',
      needs: 'An ESP32, S2 or S3 board; a bare wire or a small piece of foil on GPIO4 is the pad. Keep your hand away from it while the board starts.',
      wiring: [['GPIO4', 'wire or foil pad', 'a touch pad on the ESP32, S2 and S3'], ['GPIO2', 'LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          wait (0.5) seconds
          set [baseline v] to (touch value of pin (4))
        forever
          set [value v] to (touch value of pin (4))
          set [touched v] to <(abs ((value) - (baseline))) > ((baseline) * (0.1))>
          set pin (2) to (touched)
          print (value)
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        const int TOUCH_PIN = 4;                     // TOUCH0 on the ESP32, TOUCH4 on the S2 and S3
        const int LED = 2;
        const int32_t MARGIN_PERCENT = 10;           // how far from the baseline counts as a touch
        uint32_t baseline = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          delay(500);
          baseline = touchRead(TOUCH_PIN);           // the untouched reading: remember it
          Serial.printf("baseline %lu\n", (unsigned long)baseline);
        }

        void loop() {
          uint32_t value = touchRead(TOUCH_PIN);     // falls when touched on the ESP32, rises on the S2 and S3
          int32_t change = (int32_t)value - (int32_t)baseline;
          bool touched = abs(change) * 100 > (int32_t)baseline * MARGIN_PERCENT;
          digitalWrite(LED, touched);
          Serial.printf("%lu %s\n", (unsigned long)value, touched ? "TOUCHED" : "");
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin, TouchPad
        import time

        touch = TouchPad(Pin(4))                     # TOUCH0 on the ESP32, TOUCH4 on the S2 and S3
        led = Pin(2, Pin.OUT)
        MARGIN_PERCENT = 10                          # how far from the baseline counts as a touch

        time.sleep_ms(500)
        baseline = touch.read()                      # the untouched reading: remember it
        print("baseline", baseline)

        while True:
            value = touch.read()                     # falls when touched on the ESP32, rises on the S2 and S3
            touched = abs(value - baseline) * 100 > baseline * MARGIN_PERCENT
            led.value(touched)
            print(value, "TOUCHED" if touched else "")
            time.sleep_ms(100)
      `,
      output: `
        baseline 71
        71
        69
        18 TOUCHED
        16 TOUCHED
        70
      `,
      notes: ['The numbers above are typical of a classic ESP32 with a bare wire; yours will differ with the pad and the board. On an S3 the change is much smaller in proportion: print the values, then set the margin from what you see.', 'Using a pin for touch takes it away from ordinary digital use until the board is reset.']
    }
  ],
  choose: {
    good: ['A touch pad for a sealed, button-free panel behind plastic or glass', 'The internal pull-up for a switch to ground on a short wire', 'Reading a level now and then, where a missed event would not matter'],
    avoid: ['The internal pull-up on a long cable or in a noisy place: use a stronger external resistor', 'A fixed touch threshold copied from a tutorial: it will not match your pad', 'Polling a pin for a short pulse in a loop that sometimes takes long: use an interrupt or a hardware counter'],
    check: ['That the pin has the pull resistor you rely on (not GPIO34 to GPIO39 of the ESP32)', 'That the voltage on the pin can never exceed 3.3 V', 'That the chip has touch pads at all: ESP32, S2, S3, P4 only']
  },
  examples: [
    {
      title: 'How strong is a pull-up against a leaky switch?',
      q: 'A switch line is wired to an input with the internal 45 kΩ pull-up. Dirt on the switch gives a leakage path of 200 kΩ to ground when it is open. What voltage does the pin see, and does it still read high?',
      steps: ['The pull-up and the leak form a voltage divider between 3.3 V and ground: $V = 3.3 \\cdot \\frac{200}{45 + 200}$.', 'That is $3.3 \\cdot 0.816 = 2.69$ V.', 'The high threshold is about three quarters of the supply, 2.5 V, so 2.69 V still reads high, but with little margin; a leak of 100 kΩ would give 2.28 V and read as undefined.'],
      a: 'About 2.7 V: still high, with little margin. A stronger external pull-up of 4.7 kΩ to 10 kΩ would restore it.'
    }
  ],
  quiz: [
    { q: 'An input pin has nothing connected. What does digitalRead return?', choices: ['Always 0', 'Always 1', 'An unpredictable mixture of 0 and 1', 'An error'], a: 2, why: 'A floating input picks up noise and stray charge, so its reading changes with the environment, even with the movement of your hand. It needs a pull-up or a pull-down.' },
    { q: 'A button connects GPIO34 of an ESP32 to ground when pressed. The sketch calls pinMode(34, INPUT_PULLUP). Does it work?', choices: ['Yes', 'No: GPIO34 has no internal pull-up, so the open button leaves the pin floating', 'Yes, but the logic is inverted', 'It works only if Wi-Fi is on'], a: 1, why: 'GPIO34 to GPIO39 are input-only pins without pull resistors. The call is accepted silently. An external 10 kΩ resistor to 3.3 V is needed.' },
    { q: 'The touch value of a pad is 70 untouched. A finger makes it read 15 on an ESP32. What would the same finger do on an ESP32-S3?', choices: ['Also make it fall to about 15', 'Make the value rise above its untouched value', 'Make no difference', 'Make the pin read high'], a: 1, why: 'The touch hardware of the S2 and S3 counts the other way round: the reading rises when touched, and by a smaller proportion. A program that compares with its own baseline handles both.' },
    { q: 'A switch wired with the internal pull-up reads LOW when pressed.', a: true, why: 'The switch connects the pin to ground, which overrides the weak pull-up. That is active-low wiring: pressed is 0.' }
  ],
  applications: [
    'Push buttons, limit switches and door contacts on a device.',
    'Reading the logic outputs of other circuits: comparators, sensors with a digital alarm, optocouplers.',
    'Touch buttons behind a plastic or glass front panel.',
    'Reading the BOOT button of a development board as a user button.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *GPIO* and *Touch* APIs (core 3.3).',
    'MicroPython documentation, *machine.Pin* and *machine.TouchPad*; quick reference for the ESP32 (version 1.29).',
    'Espressif, *ESP32 Series Datasheet*, the section on pins and electrical characteristics; ESP-IDF Programming Guide, *Touch Sensor*.'
  ]
},

/* ================================================================ interrupts */
{
  id: 'interrupts',
  parent: 'core-peripherals',
  title: 'Interrupts',
  level: 2,
  short: 'Instead of asking a pin again and again, ask the chip to stop what it is doing and run a short function when the pin changes. What may be done inside that function is strictly limited, and most interrupt bugs come from breaking those limits.',
  keywords: ['interrupt', 'ISR', 'attachInterrupt', 'IRAM_ATTR', 'volatile', 'FALLING', 'RISING', 'CHANGE', 'Pin.irq', 'IRQ_FALLING', 'soft IRQ', 'micropython.schedule', 'interrupt handler', 'debounce', 'flag', 'critical section', 'latency'],
  prereq: ['digital-input', 'non-blocking-timing', 'bits-and-bytes'],
  related: ['debouncing', 'from-interrupt-to-task', 'race-conditions', 'mutexes-and-semaphores', 'hardware-timers', 'watchdogs', 'rotary-encoders', 'pulse-counter-pcnt'],
  body: `A button press lasts a fraction of a second, and a loop that is busy for 100 ms can look at the pin and miss it. An **interrupt** turns the question round. Instead of asking the pin, you tell the chip: "when this pin falls, stop what you are doing, run this function, then carry on". The function is the **interrupt handler**, or ISR (interrupt service routine). The waiting is done in hardware, and the main program notices nothing except that its code paused for a few microseconds.

### What an ISR may do

An ISR runs in the middle of other code, possibly while the program holds a lock, so it lives under strict rules:

- **Keep it very short.** Set a flag, bump a counter, store a timestamp. The slow work happens in \`loop()\` when it next comes round, as in the program below.
- **Never call \`delay()\`, \`Serial.print()\`, allocate memory** (\`new\`, \`malloc\`, \`String\` concatenation) **or use I2C or SPI.** They wait, take locks or crash.
- **Mark the function \`IRAM_ATTR\`**, so that its code sits in RAM and still runs while the flash is busy (a write to NVS, LittleFS or an OTA update).
- **Share data through \`volatile\` variables.** \`volatile\` tells the compiler the value can change behind its back, so a flag set in the ISR is really read again in \`loop()\`. It does not make a multi-step update atomic: for more than one 32-bit value use a critical section or a queue ([[race-conditions]]).
- **From an ISR use only the \`...FromISR\` forms of RTOS calls.** Giving a semaphore with \`xSemaphoreGiveFromISR\` is the standard way to wake a task ([[from-interrupt-to-task]]).

### Attaching one

On the ESP32 every GPIO can raise an interrupt: on a rising edge, a falling edge, either (\`CHANGE\`) or while a level lasts. Arduino: \`attachInterrupt(pin, handler, FALLING)\`. MicroPython: \`pin.irq(handler=f, trigger=Pin.IRQ_FALLING)\`. Here the languages differ: the MicroPython port does not run your function inside the hardware interrupt but **schedules** it (a "soft" handler). It runs a moment later, between two bytecodes, with memory allocation allowed, but not instantly, and a storm of edges can overflow the small scheduling queue. There is no \`hard=\` argument on this port.

### Bounce

A mechanical contact closes with a burst of edges lasting 1 to 10 ms, and each edge is an interrupt: without care one press counts five times, and releasing the button bounces too. The program listens to every edge, counts a press only after a quiet time of 30 ms, and lets each edge restart the quiet time; [[debouncing]] has better methods, and the simulation lets you vary both.

### Two traps

An ISR that runs too long, or a floating input that storms, can trip the interrupt watchdog ([[watchdogs]]). For counting fast pulses use a hardware counter ([[pulse-counter-pcnt]]), not an ISR per edge.

> [!key] An interrupt runs a tiny function the moment a pin changes, whatever the main program is doing. The function only sets a flag or counts, marked IRAM_ATTR and sharing volatile data; everything slow is left to the loop.`,
  ideas: [
    'An interrupt makes the hardware watch the pin: the handler runs the moment the pin changes, even when the loop is busy.',
    'An ISR must be short and must not wait, print or allocate memory; set a flag and let the loop do the work.',
    'Mark the handler IRAM_ATTR and share data with volatile variables; bigger shared data needs a critical section or a queue.',
    'Contact bounce makes one press into many interrupts, so ignore edges that follow too soon after the last one.'
  ],
  pitfalls: [
    'I can print from the handler to see that it ran — Serial.print takes locks and can wait for a full buffer; inside an ISR it can crash the chip or trip the watchdog. Set a flag and print from the loop.',
    'volatile makes shared data safe — It only forces the value to be read again. A counter that is 64 bits wide, or two values that must change together, can still be read half-updated: protect them with a critical section.',
    'MicroPython handlers behave like Arduino ISRs — On the ESP32 port a Pin.irq handler is scheduled, not hard: it may run a little late and handlers can be dropped in a storm, but you may allocate memory and print in it.'
  ],
  terms: [
    { term: 'Interrupt', also: ['IRQ', 'interrupt request'], def: 'A signal from hardware that makes the processor pause the running code, run a handler function and then resume exactly where it was. The ESP32 can raise one from any GPIO, from timers and from most peripherals.' },
    { term: 'ISR', also: ['interrupt service routine', 'interrupt handler'], def: 'The function that runs when an interrupt fires. It must be short and must not block, print or allocate memory.' },
    { term: 'IRAM_ATTR', also: ['IRAM', 'ARDUINO_ISR_ATTR'], def: 'An attribute that places a function in the chip\'s internal instruction RAM. An interrupt handler needs it so that it can run even while the flash memory is busy being written.' },
    { term: 'volatile', also: ['volatile variable'], def: 'A C++ keyword telling the compiler that a variable can change at any time outside the normal flow of the code, such as in an interrupt, so it must be read from memory every time. It does not make multi-step updates atomic.' },
    { term: 'Critical section', also: ['portENTER_CRITICAL', 'atomic section'], def: 'A short stretch of code during which interrupts (and other cores) are kept out, so that it can update shared data without being interrupted halfway. It must be as brief as possible.' },
    { term: 'Soft IRQ', also: ['scheduled handler', 'micropython.schedule'], def: 'In MicroPython a handler that is queued by the interrupt and run a moment later by the interpreter, between bytecodes. It may allocate memory but is not instant. All pin and timer handlers on the ESP32 port are of this kind.' }
  ],
  sim: 'cr-interrupt',
  code: [
    {
      title: 'Count button presses with an interrupt',
      about: 'The handler runs at every edge of the button pin and only sets a flag; the loop does the printing. A press counts only if the pin is low and the previous edge was more than 30 ms ago; every edge restarts that quiet time, so the bounce of the press and of the release is ignored.',
      needs: 'An ESP32 DevKit. The BOOT button on GPIO0 will do; or wire any button between a free pin and GND.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board; internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (0) as [input with pull-up v]
          set [pressed v] to <false>
          set [count v] to (0)
        forever
          if <pressed> then
            set [pressed v] to <false>
            change [count v] by (1)
            print (join [press ] (count))
          end
        end

        when pin (0) changes    // the interrupt: keep it short
          if <<((milliseconds since start) - (last edge)) > (30)> and <(read pin (0)) = [LOW v]>> then
            set [pressed v] to <true>    // a press: the pin is low after a quiet time
          end
          set [last edge v] to (milliseconds since start)    // every edge restarts the quiet time
      `,
      cpp: String.raw`
        const int BUTTON = 0;                         // the BOOT button
        const uint32_t DEBOUNCE_MS = 30;

        volatile bool pressed = false;                // set by the interrupt, cleared by loop()
        volatile uint32_t lastEdgeMs = 0;
        uint32_t count = 0;

        void IRAM_ATTR onButton() {                   // runs at once, whatever loop() is doing
          uint32_t now = millis();
          if (now - lastEdgeMs > DEBOUNCE_MS && digitalRead(BUTTON) == LOW) {
            pressed = true;                           // a press: the pin is low after a quiet time
          }
          lastEdgeMs = now;                           // every edge restarts the quiet time, so the bounce is ignored
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          attachInterrupt(BUTTON, onButton, CHANGE);  // the pin number is the interrupt number
        }

        void loop() {
          if (pressed) {
            pressed = false;
            count++;
            Serial.printf("press %lu\n", (unsigned long)count);   // slow work belongs here, not in the handler
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = 0                                    # the BOOT button
        DEBOUNCE_MS = 30

        pressed = False                               # set by the handler, cleared by the main loop
        last_edge_ms = 0
        count = 0

        def on_button(pin):                           # exactly one argument: the Pin
            global pressed, last_edge_ms
            now = time.ticks_ms()
            if time.ticks_diff(now, last_edge_ms) > DEBOUNCE_MS and pin.value() == 0:
                pressed = True                        # a press: the pin is low after a quiet time
            last_edge_ms = now                        # every edge restarts the quiet time, so the bounce is ignored

        button = Pin(BUTTON, Pin.IN, Pin.PULL_UP)
        button.irq(handler=on_button, trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING)

        while True:
            if pressed:
                pressed = False
                count += 1
                print("press", count)                 # slow work belongs here, not in the handler
            time.sleep_ms(5)
      `,
      output: `
        press 1
        press 2
        press 3
      `,
      notes: ['In core 3.x the handler must be marked IRAM_ATTR; older tutorials use ICACHE_RAM_ATTR (ESP8266) or nothing at all.', 'The MicroPython handler is scheduled, not hard: it may run a little late, and it is the main loop here that does the printing only to keep the three versions alike.', 'To wake a task instead of setting a flag, give a semaphore from the handler with xSemaphoreGiveFromISR: see [[from-interrupt-to-task]].']
    }
  ],
  choose: {
    good: ['A short event that must not be missed: a button, a limit switch, a pulse from a sensor', 'Waking a task the moment something happens (with a semaphore or a notification)', 'Slow signals counted one edge at a time, up to a few kilohertz'],
    avoid: ['Counting fast pulse trains or encoder edges: use the hardware pulse counter', 'Long work inside the handler: set a flag and do it in the loop', 'Noisy or floating inputs, which cause interrupt storms'],
    check: ['That the handler is marked IRAM_ATTR and touches only volatile data', 'That nothing in it can wait, print or allocate memory', 'What happens if two edges arrive before the loop has dealt with the first']
  },
  examples: [
    {
      title: 'What does an interrupt cost?',
      q: 'A flow sensor pulses at 20 kHz. Each interrupt costs 6 µs of CPU time in all (entry, the handler, exit). How much of one core does counting the pulses with interrupts take?',
      steps: ['Pulses per second: 20 000, each costing 6 µs.', 'Time spent per second: $20\\,000 \\times 6\\,\\mu\\mathrm{s} = 0.12$ s.', 'That is 12 % of one core, before the rest of the program, the radio and the watchdog have taken theirs.'],
      a: 'About 12 % of a core: possible, but a pulse counter peripheral does the same job for nothing and does not lose pulses when the CPU is busy.'
    }
  ],
  quiz: [
    { q: 'Which of these is safe inside an interrupt handler?', choices: ['Serial.println("hit")', 'delay(10)', 'Setting a volatile flag', 'Building a String from the pin value'], a: 2, why: 'A flag is a single store to memory. Printing, delaying and building a String wait, take locks or allocate memory, none of which an ISR may do.' },
    { q: 'What does the keyword volatile do for a flag shared between an ISR and loop()?', choices: ['Makes every update atomic', 'Makes the compiler read it from memory each time, as it may change at any moment', 'Puts it in flash', 'Disables interrupts while it is read'], a: 1, why: 'Without volatile the compiler may keep the flag in a register and never see the ISR change it. It does not protect updates that take several steps.' },
    { q: 'In MicroPython on the ESP32, a Pin.irq handler runs inside the hardware interrupt, so it must not allocate memory.', a: false, why: 'The ESP32 port schedules the handler to run shortly afterwards, between bytecodes, so allocation is allowed — but it can run late and handlers can be lost in an edge storm.' },
    { q: 'One press of a button is counted five times. Which is the most likely cause?', choices: ['The handler is too short', 'Contact bounce makes several edges, each raising an interrupt', 'The pin is an input-only pin', 'volatile was left out'], a: 1, why: 'A switch contact chatters for several milliseconds, giving several falling edges. Ignore edges that follow too soon after the last accepted one, or debounce in hardware.' }
  ],
  applications: [
    'Waking a task the instant a button is pressed or a sensor raises its alarm line.',
    'Timestamping the edge of a signal, for example the pulse of a rain gauge or a flow sensor.',
    'Counting slow pulses: a water meter, a tipping-bucket rain gauge.',
    'Waking the chip from light sleep when a pin changes.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *GPIO* API: attachInterrupt and the interrupt modes; the GPIOInterrupt example (core 3.3).',
    'MicroPython documentation, *machine.Pin.irq* and *Writing interrupt handlers*; the ESP32 port notes (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, *GPIO and RTC GPIO* and *Interrupt allocation* (IRAM-safe handlers).'
  ]
},

/* ================================================================ PWM with LEDC */
{
  id: 'pwm-with-ledc',
  parent: 'core-peripherals',
  title: 'PWM with LEDC',
  level: 2,
  short: 'Switch a pin on and off fast and vary how long it stays on: the average power follows the duty cycle. The LEDC peripheral makes PWM in hardware, and frequency and resolution share one clock, so choosing one limits the other.',
  keywords: ['PWM', 'LEDC', 'ledcAttach', 'ledcWrite', 'ledcFade', 'ledcChangeFrequency', 'analogWrite', 'duty cycle', 'frequency', 'resolution', 'duty_u16', 'machine.PWM', 'dimming', 'gamma', 'fade', 'channels', 'timers'],
  prereq: ['digital-output', 'leds'],
  related: ['driving-leds-with-pwm', 'motor-pwm-frequency', 'fans-and-pwm-control', 'servos', 'buzzers-and-tones', 'mcpwm', 'dac-output', 'electronics:rc-low-pass', 'motors:pwm-speed-control'],
  body: `An ESP32 pin is either fully high or fully low, but an LED, a motor or a heater cannot tell the difference between "half on" and "fully on half of the time", as long as the switching is fast enough. **Pulse-width modulation** switches a pin on and off at a fixed frequency and varies the fraction of each period for which it is high, the **duty cycle**. At 25 % duty the average voltage is a quarter of 3.3 V. The LEDC peripheral (LED control, though it drives anything) makes the signal in hardware: once set up it needs no CPU time, whatever the program does.

### Frequency or resolution: you cannot have both

The LEDC counts a clock and drops the output when the count reaches the duty value. A finer duty needs more counts per period, so the frequency and the number of duty bits \`n\` share one clock: the highest frequency for \`n\` bits is the clock divided by 2 to the power \`n\`. With an 80 MHz clock, 5 kHz leaves 13 bits, 20 kHz leaves 11, and 1 MHz only 6. The timer is 20 bits wide on the ESP32, C5, C6, C61, H2 and P4 but only 14 on the S2, S3, C3 and C2, so a program meant for any chip stays at 14 bits or fewer; the simulation shows what happens when you ask for too much.

| Job | Usual frequency | Usual bits |
|---|---|---|
| Dimming an LED | 1 to 5 kHz | 8 to 10 |
| Motor or fan driver | 20 kHz, above hearing | 8 to 10 |
| Servo | 50 Hz | 12 to 14 |

Eight bits at 5 kHz is the usual LED choice because 256 levels are enough to look smooth and 5 kHz is far above visible flicker. A motor wants 20 kHz because the winding then no longer whines, while the switching losses of a MOSFET stay small.

### In a program

In Arduino core 3.x you call \`ledcAttach(pin, frequency, bits)\` once, then \`ledcWrite(pin, duty)\` with a duty from 0 up to 2^bits − 1: both calls take the **pin**, and the core picks the channel. In MicroPython \`PWM(Pin(n), freq=…, duty_u16=…)\` takes 0 to 65535 on every chip and scales it to the hardware. \`ledcFade(pin, start, target, ms)\` starts a hardware fade and returns at once; MicroPython has none.

### Channels, and sharing

There are 16 LEDC channels on the ESP32, 8 on the S2, S3 and P4, and 6 on the C2, C3, C5, C6, C61 and H2, drawn from four timers. Pins with the same frequency and resolution share a timer, so \`ledcChangeFrequency\` on one changes the others too. \`analogWrite\` uses the same hardware at 1 kHz: do not mix it with \`ledcAttach\` on one pin.

### The eye and gamma

An LED's light follows its average current, but the eye responds roughly to the square root of it, so a fade in equal duty steps looks too bright too soon. Use duty = level to the power 2.2 ([[driving-leds-with-pwm]]).

> [!warn] Tutorials from before 2024 use \`ledcSetup\`, \`ledcAttachPin\` and \`ledcWrite(channel, …)\`. That is core 2.x: it does not compile on core 3.x, where everything takes the pin.

> [!key] PWM varies the on-time of a fast square wave, and the LEDC makes it in hardware. Frequency and resolution share one clock — the maximum frequency is the clock divided by 2 to the power of the bits — so pick 5 kHz with 8 bits for LEDs and 20 kHz for motors.`,
  ideas: [
    'PWM switches a pin on and off at a fixed frequency; the average output follows the duty cycle, the fraction of the period that the pin is high.',
    'Frequency and resolution share one clock: the maximum frequency is the clock divided by 2 to the power of the bits.',
    'In core 3.x, ledcAttach(pin, freq, bits) then ledcWrite(pin, duty): both take the pin; MicroPython takes duty_u16 from 0 to 65535.',
    'Pins with the same frequency and resolution share a timer, and a fade of equal duty steps looks uneven to the eye without gamma correction.'
  ],
  pitfalls: [
    'More bits is always better — Every extra bit halves the highest frequency available. At 20 kHz on an 80 MHz clock you get 11 bits at most; asking for 13 makes ledcAttach fail.',
    'ledcWrite(0, duty) writes channel 0 — That was core 2.x. In core 3.x the first argument is the pin, and a number there is taken as a pin number.',
    'PWM gives a smooth voltage — It gives a fast square wave whose average is right. A motor or an LED integrates it; a sensor or an ADC input connected to it sees the ripple, unless an RC filter smooths it.'
  ],
  terms: [
    { term: 'PWM', also: ['pulse-width modulation', 'pulse width modulation'], def: 'Switching a signal fully on and fully off at a fixed frequency and varying the on-time, so that the average value follows the duty cycle. Loads that respond slowly, such as LEDs and motors, see the average.' },
    { term: 'Duty cycle', also: ['duty', 'duty ratio'], def: 'The fraction of each PWM period for which the signal is high, from 0 % (always low) to 100 % (always high). The average output voltage is the supply voltage times the duty cycle.' },
    { term: 'LEDC', also: ['LED PWM controller', 'LED control'], def: 'The ESP32 peripheral that generates PWM in hardware. It has 6 to 16 channels, depending on the chip, fed by four timers, and supports hardware fades.' },
    { term: 'PWM resolution', also: ['duty resolution', 'duty bits'], def: 'The number of bits of the duty value, so how many distinct duty steps one period has: 8 bits give 256 steps. It trades against frequency, since both are cut out of the same clock.' },
    { term: 'Gamma correction', also: ['gamma', 'perceptual dimming'], def: 'Raising the wanted brightness to a power of about 2.2 before using it as a duty value, because the eye perceives light roughly as its square root, so equal duty steps look uneven.' }
  ],
  sim: 'cr-pwm',
  formulas: [
    {
      name: 'Highest PWM frequency for a resolution',
      expr: 'fmax = fclk / 2^bits',
      tex: 'f_{\\mathrm{max}} = \\frac{f_{\\mathrm{clk}}}{2^{n}}',
      vars: {
        fmax: { name: 'highest frequency', q: 'frequency', unit: 'Hz', tex: 'f_{\\mathrm{max}}' },
        fclk: { name: 'LEDC clock', q: 'frequency', unit: 'MHz', value: 80, tex: 'f_{\\mathrm{clk}}' },
        bits: { name: 'duty resolution', q: 'count', value: 8, min: 1, max: 20, tex: 'n' }
      },
      solveFor: 'fmax',
      note: 'Solve for n to find the resolution a frequency allows, and round it down. The clock is 80 MHz (APB) on the original ESP32 and 40 MHz (crystal) where the Arduino core selects that source.',
      stories: { fmax: 'The LEDC runs from a {fclk} clock and you want {bits} duty bits. What is the highest PWM frequency?', bits: 'The LEDC runs from a {fclk} clock and you want a PWM of {fmax}. How many duty bits, at most?' }
    },
    {
      name: 'Average output voltage',
      expr: 'V = Vcc * duty / 2^bits',
      tex: 'V_{\\mathrm{avg}} = V_{\\mathrm{CC}} \\cdot \\frac{D}{2^{n}}',
      vars: {
        V: { name: 'average voltage', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{avg}}' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{CC}}' },
        duty: { name: 'duty value', q: 'count', value: 64, min: 0, tex: 'D' },
        bits: { name: 'duty resolution', q: 'count', value: 8, min: 1, max: 20, tex: 'n' }
      },
      solveFor: 'V',
      note: 'What a slow load, or an RC filter after the pin, sees. A duty value of 2 to the power n means always high.',
      stories: { V: 'A pin at {Vcc} is driven with duty {duty} out of {bits} bits. What is the average voltage?' }
    }
  ],
  code: [
    {
      title: 'Fade an LED up and down',
      about: 'The duty runs from 0 to 255 and back, brightening and dimming an LED at 5 kHz with 8 bits of resolution.',
      needs: 'An ESP32 DevKit, an LED and a 330 Ω resistor.',
      wiring: [['GPIO4', '330 Ω → LED → GND']],
      blocks: `
        when started
          set PWM on pin (4) frequency (5000) resolution (8)
          set [duty v] to (0)
        forever
          repeat (255)
            change [duty v] by (1)
            set PWM on pin (4) to (duty)
            wait (0.004) seconds
          end
          repeat (255)
            change [duty v] by (-1)
            set PWM on pin (4) to (duty)
            wait (0.004) seconds
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 4;
        const int FREQ = 5000;                  // Hz
        const int BITS = 8;                     // duty 0 … 255

        void setup() {
          ledcAttach(LED_PIN, FREQ, BITS);      // the core picks a channel and a timer
        }

        void loop() {
          for (int duty = 0; duty <= 255; duty++) { ledcWrite(LED_PIN, duty); delay(4); }
          for (int duty = 255; duty >= 0; duty--) { ledcWrite(LED_PIN, duty); delay(4); }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        pwm = PWM(Pin(4), freq=5000, duty_u16=0)   # duty 0 … 65535, the same on every chip

        while True:
            for duty in range(0, 256):
                pwm.duty_u16(duty * 257)           # 8-bit value scaled to 16 bits: 255 × 257 = 65535
                time.sleep_ms(4)
            for duty in range(255, -1, -1):
                pwm.duty_u16(duty * 257)
                time.sleep_ms(4)
      `,
      notes: ['Core 2.x wrote ledcSetup(0, 5000, 8); ledcAttachPin(4, 0); ledcWrite(0, duty). On core 3.x those calls are gone.', 'For a hardware fade that keeps going while the loop does other things, use ledcFade(pin, start, target, ms) in C++.']
    },
    {
      title: 'A fade that looks even: gamma correction',
      about: 'The same fade, but the duty is the wanted brightness raised to the power 2.2, so that equal steps of brightness look equal. Ten bits give the dim end enough steps.',
      needs: 'The same LED and resistor.',
      wiring: [['GPIO4', '330 Ω → LED → GND']],
      blocks: `
        when started
          set PWM on pin (4) frequency (5000) resolution (10)
        forever
          repeat for each [i v] in (list 0 to 100 and back)
            set PWM on pin (4) to (round (((i) / (100)) to the power (2.2)) * (1023))
            wait (0.02) seconds
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 4;
        const int BITS = 10;                            // 1024 steps: the dim end needs them
        const int MAX_DUTY = (1 << BITS) - 1;

        uint32_t dutyFor(float level) {                 // level 0.0 … 1.0 as the eye sees it
          return (uint32_t)(powf(level, 2.2f) * MAX_DUTY + 0.5f);
        }

        void setup() {
          ledcAttach(LED_PIN, 5000, BITS);
        }

        void loop() {
          for (int i = 0; i <= 100; i++) { ledcWrite(LED_PIN, dutyFor(i / 100.0f)); delay(20); }
          for (int i = 100; i >= 0; i--) { ledcWrite(LED_PIN, dutyFor(i / 100.0f)); delay(20); }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        pwm = PWM(Pin(4), freq=5000, duty_u16=0)

        def duty_for(level):                            # level 0.0 … 1.0 as the eye sees it
            return int(level ** 2.2 * 65535 + 0.5)

        while True:
            for i in range(0, 101):
                pwm.duty_u16(duty_for(i / 100))
                time.sleep_ms(20)
            for i in range(100, -1, -1):
                pwm.duty_u16(duty_for(i / 100))
                time.sleep_ms(20)
      `,
      notes: ['The core also has ledcFadeGamma() and a gamma table for hardware fades; the formula above works anywhere.']
    }
  ],
  choose: {
    good: ['LEDC for LED dimming, small motor and fan control, buzzers and servos: it is hardware, glitch-free and costs no CPU time', 'A higher frequency (20 kHz) for anything with a winding that could whine', 'More bits at lower frequencies for fine control, such as a servo at 50 Hz'],
    avoid: ['LEDC for complementary half-bridge signals with dead time: use MCPWM', 'analogWrite when you need to choose the frequency and the resolution separately', 'Software PWM from a timer interrupt: it jitters whenever the CPU is busy'],
    check: ['That frequency and bits fit together (the simulation shows the limit)', 'How many channels your chip has: 16, 8 or 6', 'That two pins that must differ in frequency do not share a timer']
  },
  examples: [
    {
      title: 'How many bits at 20 kHz?',
      q: 'A fan driver wants 20 kHz PWM. The LEDC clock is 80 MHz. What is the finest duty resolution, and what is one duty step in time?',
      steps: ['The limit is $2^n \\le f_{clk}/f = 80\\,000\\,000 / 20\\,000 = 4000$.', '$2^{11} = 2048$ fits and $2^{12} = 4096$ does not, so 11 bits is the most.', 'One period is 50 µs; with 11 bits a duty step is $50\\ \\mu s / 2048 \\approx 24$ ns.'],
      a: '11 bits at most; a step of about 24 ns. Asking for 12 bits at 20 kHz would make the setup fail.'
    }
  ],
  quiz: [
    { q: 'At 5 kHz and an 80 MHz LEDC clock, what is the most duty bits the LEDC can give?', choices: ['8', '11', '13', '20'], a: 2, why: '80 MHz / 5 kHz = 16 000, and 2 to the 13 is 8192 while 2 to the 14 is 16 384: so 13 bits fit and 14 do not. (Timer width is a second limit: 14 bits on the S2, S3, C3 and C2, 20 on the ESP32, C6 and others.)' },
    { q: 'In Arduino core 3.x, ledcWrite(1, 128) writes duty 128 to channel 1.', a: false, why: 'Since core 3.0 the first argument is the pin, not the channel; the core assigns channels itself. The old channel form is core 2.x code.' },
    { q: 'A pin at 3.3 V runs PWM with duty 64 out of 256 (8 bits). What is the average voltage?', choices: ['0.825 V', '1.65 V', '0.64 V', '3.3 V'], a: 0, why: '64/256 = 25 %, and 25 % of 3.3 V is 0.825 V.' },
    { q: 'Why is 20 kHz the usual PWM frequency for a small motor?', choices: ['The LEDC cannot go lower', 'It is above the range of hearing, so the winding does not whine, and still slow enough for low switching loss', 'Motors need exactly 20 kHz', 'It gives the most bits'], a: 1, why: 'Below about 15 kHz the vibration of the winding is audible. Far above 20 kHz the switching losses of the driver grow for no benefit.' }
  ],
  applications: [
    'Dimming LEDs and LED strips, and mixing the colours of an RGB LED.',
    'Speed control of small DC motors and fans through a transistor or an H-bridge.',
    'Driving servos with 50 Hz pulses of 1 to 2 ms.',
    'Making a rough analogue voltage with an RC filter on a chip with no DAC.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *LEDC* API and the migration guide from 2.x to 3.0 (core 3.3).',
    'MicroPython documentation, *machine.PWM* and the ESP32 quick reference, PWM section (version 1.29).',
    'Espressif, *ESP32 Technical Reference Manual*, the LED PWM controller chapter; ESP-IDF Programming Guide, *LED Control (LEDC)*.'
  ]
},

/* ================================================================ analogue input */
{
  id: 'analog-input',
  parent: 'core-peripherals',
  title: 'Analogue input',
  level: 2,
  short: 'Turn a voltage into a number. The ADC reads 0 to 4095, attenuation sets the range, and the original ESP32 needs care: its converter is not linear, so read millivolts, stay on ADC1 when Wi-Fi is on, and average.',
  keywords: ['ADC', 'analogRead', 'analogReadMilliVolts', 'analogReadResolution', 'analogSetPinAttenuation', 'ADC_11db', 'attenuation', 'ADC.read_u16', 'read_uv', 'ATTN_11DB', 'ADC1', 'ADC2', 'millivolts', 'averaging', 'potentiometer', 'dead zone', 'calibration', '12 bit'],
  prereq: ['digital-input', 'voltage-dividers-for-inputs', 'three-volt-logic'],
  related: ['the-esp-adc', 'adc-attenuation-and-calibration', 'adc1-adc2-and-wifi', 'oversampling-and-noise', 'measuring-voltage', 'potentiometers', 'thermistors-and-ldrs', 'external-adc-and-dac', 'electronics:voltage-divider'],
  body: `Most of the world is not a 0 or a 1. A potentiometer, a light sensor, a thermistor, a battery behind a divider each give a voltage somewhere in between. The **ADC** (analogue-to-digital converter) measures it and hands back a number. The converters of the ESP32 family are 12 bit, so a reading is a count from 0 to 4095, and one count stands for a voltage step of well under a millivolt.

### Range and attenuation

The converter itself can only take about 1 V. To measure up to 3.3 V an **attenuator** divides the input first, and you choose how much: 0, 2.5, 6 or 11 dB (the Arduino constants \`ADC_0db\` to \`ADC_11db\`, MicroPython's \`ADC.ATTN_0DB\` to \`ADC.ATTN_11DB\`). More attenuation means a wider range but coarser steps. The widest, 11 dB, is the default on every pin. The recommended ranges, in volts:

| Setting | ESP32 | ESP32-S2, C3 | ESP32-S3 | ESP32-C6, H2 |
|---|---|---|---|---|
| 0 dB | 0.10 to 0.95 | 0 to 0.75 | 0 to 0.95 | 0 to 1.0 |
| 2.5 dB | 0.10 to 1.25 | 0 to 1.05 | 0 to 1.25 | 0 to 1.3 |
| 6 dB | 0.15 to 1.75 | 0 to 1.30 | 0 to 1.75 | 0 to 1.9 |
| 11 dB | 0.15 to 2.45 | 0 to 2.5 | 0 to 3.1 | 0 to 3.3 |

(Documents disagree about the top of the original ESP32's range, 2.45 V or up to 3.1 V; the figure above is the cautious one.) The pin itself must never exceed 3.3 V, whatever the setting.

### Reading it

In Arduino, \`analogRead(pin)\` returns the raw count and \`analogReadMilliVolts(pin)\` returns calibrated millivolts, corrected with constants burned into the chip at the factory. MicroPython gives \`adc.read_u16()\`, the raw count scaled to 0 to 65535, and \`adc.read_uv()\`, calibrated microvolts. **Prefer the millivolt form**: scaling the raw count by hand assumes a perfect converter, and the original ESP32 is not one ([[adc-attenuation-and-calibration]]).

### Which pins

The original ESP32 has 18 channels in two units. **ADC2 cannot be read while Wi-Fi is on**, so with Wi-Fi use ADC1, GPIO32 to GPIO39 ([[adc1-adc2-and-wifi]]). The S3 has 20 channels (ADC1 on GPIO1 to GPIO10), the C3 only 6 (ADC1 on GPIO0 to GPIO4; the ADC2 channel is unreliable), the C6 7 and the C2 5. Chips without an ADC pin on your board simply cannot do this: check [[planning-pins]].

### Noise

A single reading wobbles by several counts, more with Wi-Fi active. Averaging n readings divides random noise by the square root of n, so 16 readings give four times less ([[oversampling-and-noise]]). A source with a high resistance, such as a long divider chain, charges the sampling capacitor slowly and reads low: add 100 nF from the pin to ground, or buffer it with an op-amp.

> [!key] The ADC turns 0 to about 3 V into a count of 0 to 4095, with attenuation choosing the range. Read millivolts rather than scaling the raw count, use ADC1 when Wi-Fi is on, and average several readings to calm the noise.`,
  ideas: [
    'A 12-bit ADC returns 0 to 4095; attenuation divides the input first, trading range against step size.',
    'Read millivolts (analogReadMilliVolts, read_uv) rather than scaling the raw count: the factory calibration corrects the ESP32\'s non-linear converter.',
    'On the original ESP32, ADC2 pins cannot be read while Wi-Fi is on: use ADC1, GPIO32 to GPIO39.',
    'Averaging n readings cuts random noise by the square root of n; a high-impedance source needs a capacitor at the pin.'
  ],
  pitfalls: [
    'An ADC reads 0 to 3.3 V as 0 to 4095 — Only roughly, and only on a perfect converter. On the ESP32 the bottom 0.1 V reads 0 and the top of each range flattens; the range also depends on the attenuation.',
    'Any pin that says ADC can be read with Wi-Fi on — On the original ESP32 the ADC2 channels fail while Wi-Fi runs, and on the S3 and C3 they are unreliable. Wire analogue sensors to ADC1 pins.',
    'A 5 V sensor can be wired straight to an ADC pin — The pin tolerates 3.3 V at most. A sensor that swings to 5 V needs a divider (and the divider\'s resistance must be low enough to read cleanly).'
  ],
  terms: [
    { term: 'ADC', also: ['analogue-to-digital converter', 'analog-to-digital converter'], def: 'A circuit that measures a voltage and returns it as a number. The ESP32 family has 12-bit converters: the count runs from 0 to 4095 over the chosen input range.' },
    { term: 'Attenuation', also: ['ADC_11db', 'ATTN_11DB', 'input attenuation'], def: 'A voltage divider in front of the ADC, selectable by the program (0, 2.5, 6 or 11 dB). More attenuation widens the range that can be measured and makes each count represent a larger voltage step.' },
    { term: 'ADC1 and ADC2', also: ['ADC unit', 'ADC channel'], def: 'The two converter units of most ESP32 chips. ADC2 is shared with the Wi-Fi hardware: on the original ESP32 it cannot be used while Wi-Fi is on, so analogue sensors belong on ADC1 pins.' },
    { term: 'LSB', also: ['least significant bit', 'count', 'step size'], def: 'The voltage represented by one count of the converter: the input range divided by the number of steps. At 11 dB on an S3 it is about 0.76 mV.' },
    { term: 'Oversampling', also: ['averaging', 'multisampling'], def: 'Taking many readings and averaging them to reduce random noise. The noise falls with the square root of the number of readings.' }
  ],
  sim: 'cr-adc',
  formulas: [
    {
      name: 'Counts from a voltage (ideal converter)',
      expr: 'N = Vin * (2^bits - 1) / Vfs',
      tex: 'N = \\frac{V_{\\mathrm{in}}}{V_{\\mathrm{fs}}}\\,(2^{n} - 1)',
      vars: {
        N: { name: 'reading', q: 'count', tex: 'N' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 1.2, tex: 'V_{\\mathrm{in}}' },
        Vfs: { name: 'full-scale voltage of the range', q: 'voltage', unit: 'V', value: 2.45, tex: 'V_{\\mathrm{fs}}' },
        bits: { name: 'converter bits', q: 'count', value: 12, min: 8, max: 16, int: true, tex: 'n' }
      },
      solveFor: 'N',
      note: 'An ideal converter. The real ESP32 deviates from it near both ends of the range; analogReadMilliVolts removes most of the error.',
      stories: { N: 'An input of {Vin} is read by a {bits}-bit converter whose range ends at {Vfs}. What count comes back?', Vin: 'A {bits}-bit converter with a range up to {Vfs} returns {N}. What was the input voltage?' }
    },
    {
      name: 'The voltage of one count',
      expr: 'lsb = Vfs / 2^bits',
      tex: 'V_{\\mathrm{LSB}} = \\frac{V_{\\mathrm{fs}}}{2^{n}}',
      vars: {
        lsb: { name: 'one count', q: 'voltage', unit: 'mV', tex: 'V_{\\mathrm{LSB}}' },
        Vfs: { name: 'full-scale voltage of the range', q: 'voltage', unit: 'V', value: 2.45, tex: 'V_{\\mathrm{fs}}' },
        bits: { name: 'converter bits', q: 'count', value: 12, min: 8, max: 16, int: true, tex: 'n' }
      },
      solveFor: 'lsb',
      note: 'The finest change in voltage the converter can tell apart, before noise.',
      stories: { lsb: 'A {bits}-bit converter measures up to {Vfs}. How large is one count?' }
    },
    {
      name: 'Noise after averaging',
      expr: 'sigN = sig1 / sqrt(n)',
      tex: '\\sigma_{N} = \\frac{\\sigma_{1}}{\\sqrt{N}}',
      vars: {
        sigN: { name: 'noise after averaging', q: 'count', tex: '\\sigma_{N}' },
        sig1: { name: 'noise of one reading', q: 'count', value: 6, tex: '\\sigma_{1}' },
        n: { name: 'readings averaged', q: 'count', value: 16, min: 1, int: true, tex: 'N' }
      },
      solveFor: 'sigN',
      note: 'For random noise that is independent between readings. A steady offset or a drift is not averaged away.',
      stories: { sigN: 'One reading of an ADC wobbles by {sig1} (in counts). What does the average of {n} readings wobble by?', n: 'One reading wobbles by {sig1} counts; you want it down to {sigN} counts. How many readings must be averaged?' }
    }
  ],
  code: [
    {
      title: 'Read a potentiometer in millivolts, with averaging',
      about: 'Prints the raw count, one reading in millivolts, and the average of 32 readings in millivolts. Turn the knob and watch how the averaged value steadies.',
      needs: 'An ESP32 DevKit and a 10 kΩ potentiometer. On an S3 use a pin from GPIO1 to GPIO10; on a C3 use GPIO0 to GPIO4.',
      wiring: [['GPIO34', 'potentiometer wiper', 'an ADC1 pin: works with Wi-Fi on'], ['3V3', 'potentiometer end'], ['GND', 'potentiometer other end']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [total v] to (0)
          repeat (32)
            change [total v] by (analog read pin (34) in millivolts)
            wait (0.0002) seconds
          end
          print (join [raw: ] (analog read pin (34)))
          print (join [average mV: ] ((total) / (32)))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int ADC_PIN = 34;                       // ESP32: an ADC1 pin (GPIO32 … 39)
        const int SAMPLES = 32;

        uint32_t averageMilliVolts(int pin, int n) {
          uint32_t sum = 0;
          for (int i = 0; i < n; i++) {
            sum += analogReadMilliVolts(pin);
            delayMicroseconds(200);                   // let the sampling capacitor recover
          }
          return sum / n;
        }

        void setup() {
          Serial.begin(115200);
          analogReadResolution(12);                   // 0 … 4095: the default
          analogSetPinAttenuation(ADC_PIN, ADC_11db); // the widest range: also the default
        }

        void loop() {
          int raw = analogRead(ADC_PIN);              // uncalibrated count, 0 … 4095
          uint32_t one = analogReadMilliVolts(ADC_PIN);
          uint32_t avg = averageMilliVolts(ADC_PIN, SAMPLES);
          Serial.printf("raw %d   one reading %u mV   average of %d: %u mV\n", raw, (unsigned)one, SAMPLES, (unsigned)avg);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)       # ESP32: an ADC1 pin (GPIO32 … 39); widest range
        SAMPLES = 32

        def average_mv(n):
            total = 0
            for _ in range(n):
                total += adc.read_uv()                # calibrated microvolts
                time.sleep_us(200)                    # let the sampling capacitor recover
            return total // n // 1000

        while True:
            raw = adc.read_u16()                      # raw count scaled to 0 … 65535 (16 times the 12-bit count)
            one = adc.read_uv() // 1000
            avg = average_mv(SAMPLES)
            print("raw", raw, "  one reading", one, "mV  average of", SAMPLES, ":", avg, "mV")
            time.sleep_ms(500)
      `,
      output: `
        raw 1998   one reading 1226 mV   average of 32: 1218 mV
        raw 2003   one reading 1209 mV   average of 32: 1219 mV
      `,
      notes: ['The C++ raw count is 12 bit (0 to 4095) and the MicroPython one is scaled to 16 bit (0 to 65535), so the two raw numbers differ by a factor of 16; the millivolts agree.', 'The old Arduino constant ADC_12db does not exist: the widest setting is ADC_11db.', 'Do not trust the last millivolt: the ESP32\'s calibration is good to a few percent at best. For precise measurements see [[the-esp-adc]] or use an external converter ([[external-adc-and-dac]]).']
    }
  ],
  choose: {
    good: ['The internal ADC for knobs, light, soil moisture, battery level and other readings that need a few percent', 'ADC1 pins for anything that must work with Wi-Fi on', 'analogReadMilliVolts or read_uv, which apply the factory calibration'],
    avoid: ['ADC2 pins on the original ESP32 when Wi-Fi is running', 'Scaling the raw count with 3.3/4095 on an original ESP32 and trusting the result', 'Inputs above 3.3 V or below 0 V, even for a moment'],
    check: ['That the sensor\'s output range fits inside the range of the attenuation you chose', 'That the source resistance is low enough, or that a capacitor is at the pin', 'Whether an external ADC (ADS1115 and similar) is worth it for 16 bits and accuracy']
  },
  examples: [
    {
      title: 'A battery behind a divider',
      q: 'A one-cell lithium battery gives 3.0 V to 4.2 V. You want to read it with an original ESP32 at 11 dB (usable range 0.15 V to 2.45 V). Two equal 100 kΩ resistors form the divider. Does it fit, and how fine is the reading in battery volts?',
      steps: ['Equal resistors halve the voltage: 4.2 V becomes 2.1 V and 3.0 V becomes 1.5 V at the pin. Both lie within 0.15 V to 2.45 V.', 'One count at the pin is about $2.45\\ \\mathrm{V} / 4096 \\approx 0.6$ mV, which is 1.2 mV on the battery side after the divider.', 'The two resistors put 50 kΩ in series with the pin: far too high for a clean fast reading, so add 100 nF from the pin to ground and average.'],
      a: 'It fits; the reading is fine to about 1 mV on the battery. Add a 100 nF capacitor at the pin because of the 50 kΩ source resistance.'
    }
  ],
  quiz: [
    { q: 'An original ESP32 reads a sensor while Wi-Fi is on. Which pin is the right choice?', choices: ['GPIO25 (ADC2)', 'GPIO34 (ADC1)', 'GPIO4 (ADC2)', 'GPIO12 (ADC2)'], a: 1, why: 'ADC2 is shared with the Wi-Fi hardware and cannot be read while Wi-Fi runs on the original ESP32. GPIO32 to GPIO39 are on ADC1.' },
    { q: 'Which is the better way to get volts from an original ESP32 ADC?', choices: ['raw × 3.3 / 4095', 'analogReadMilliVolts() or read_uv(), which use the factory calibration', 'raw × 3.3 / 4096', 'They are equally good'], a: 1, why: 'The ESP32\'s converter is not linear. The calibration constants burned in at the factory are applied by the millivolt functions; a straight scaling of the raw count carries the full error.' },
    { q: 'One reading wobbles by 8 counts. You average 16 readings. About how much does the average wobble?', choices: ['8 counts', '4 counts', '2 counts', '0.5 counts'], a: 2, why: 'Random noise falls with the square root of the number of readings: 8 / sqrt(16) = 8 / 4 = 2 counts.' },
    { q: 'Choosing a smaller attenuation (0 dB instead of 11 dB) gives finer steps but a narrower range.', a: true, why: 'Less attenuation lets less of the range into the converter: each count then stands for a smaller voltage, but the pin saturates at a much lower voltage.' }
  ],
  applications: [
    'Reading a knob or slider on a front panel.',
    'Measuring a battery voltage through a divider to show the charge left.',
    'Reading analogue sensors: light (LDR), soil moisture, thermistors, current-sense amplifiers.',
    'Sound level and simple audio envelopes from a microphone module.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *ADC* API (attenuation constants and ranges, core 3.3).',
    'MicroPython documentation, *machine.ADC* and the ESP32 quick reference, ADC section (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, *ADC Oneshot Mode Driver* and *ADC Calibration Driver*; the ESP32 Series Datasheet, ADC characteristics.'
  ]
},

/* ================================================================ the DAC */
{
  id: 'dac-output',
  parent: 'core-peripherals',
  title: 'The DAC',
  level: 2,
  short: 'A true analogue output, 8 bits, on only three chips of the family: the ESP32 and the S2 (and the S31 in preview). Everything else makes a voltage with PWM and a filter, or adds a converter chip.',
  keywords: ['DAC', 'dacWrite', 'DAC(Pin', 'analogue output', 'digital-to-analog', 'GPIO25', 'GPIO26', 'sine wave', 'waveform', 'staircase', 'RC filter', 'MCP4725', 'cosine generator', 'dacDisable'],
  prereq: ['analog-input', 'pwm-with-ledc'],
  related: ['external-adc-and-dac', 'rc-filters-and-debounce', 'i2s-amplifiers-and-dacs', 'esp-as-a-signal-generator', 'buzzers-and-tones', 'electronics:rc-low-pass'],
  body: `A **DAC** (digital-to-analogue converter) does the reverse of an ADC: a number goes in and a voltage comes out. It is a real, steady voltage, not a fast square wave that has to be averaged, and that makes it the right tool for a programmable reference, a bias voltage or a slow waveform. But only three chips of the family have one: the original ESP32 (two channels, on GPIO25 and GPIO26), the ESP32-S2 (two channels, on GPIO17 and GPIO18) and the ESP32-S31, which is in preview. The S3, the whole C-series, the H2 and the P4 have none.

### Using it

The converter is 8 bit: the program writes a value from 0 to 255, which gives 0 V to roughly the supply voltage, so a step is about 13 mV. In Arduino \`dacWrite(pin, value)\`; in MicroPython \`DAC(Pin(25)).write(value)\`. The pin stays a DAC until you release it (\`dacDisable(pin)\` in core 3.x). The output is weak: it can drive the input of an amplifier or a comparator, not a loudspeaker, an LED or a low-resistance load. Put an op-amp buffer after it for those.

### A waveform is a staircase

The output changes only when the program writes, and holds between writes, so a waveform is a **staircase**. To make a sine, compute a table of values once and write them one after the other, with a short wait between: the output frequency is one over the number of samples times the interval. A 32-point table written every 100 µs gives about 310 Hz. The loop's speed limits how high you can go, and a low-pass filter after the pin rounds off the steps. For audio and fast waveforms the hardware has a DMA mode and a cosine generator, but those exist only in ESP-IDF; the Arduino core has no wrapper for them.

### No DAC on your chip?

Three ways out ([[external-adc-and-dac]]):

- **PWM and an RC filter.** A fast PWM with a resistor and capacitor behind it gives a voltage that follows the duty cycle: the second program below makes 0 to 3.3 V this way. It is slow to settle and carries a little ripple, but costs two parts.
- **An external converter**, such as the 12-bit MCP4725 on I2C: more bits and a proper output stage.
- **I2S audio with a DAC chip** if the goal is sound ([[i2s-amplifiers-and-dacs]]).

### Traps

\`dacWrite\` does not exist for the S3 and the C-series; the code will not compile or will do nothing. The DAC pins are also ADC2 inputs, so they cannot be read back with Wi-Fi on (original ESP32).

> [!key] Only the ESP32, the S2 and the S31 have a DAC: 8 bits, a real analogue voltage, a weak output, a staircase when you write waveforms. On every other chip use PWM with an RC filter or an external converter.`,
  ideas: [
    'A DAC turns a number into a voltage; the ESP32 and S2 have two 8-bit channels, the S3 and C-series have none.',
    'One step is about 13 mV (3.3 V in 255 steps), and the output is weak: buffer it for anything but a high-impedance input.',
    'A waveform written sample by sample is a staircase; the frequency is one over samples times interval, and a filter rounds off the steps.',
    'Without a DAC, use PWM and an RC filter, or an external converter such as the MCP4725.'
  ],
  pitfalls: [
    'Every ESP32 has a DAC — Only the original ESP32, the S2 and the S31. dacWrite does not exist for the S3, C3, C6, H2 and P4: use PWM with an RC filter or an external converter.',
    'The DAC can drive a speaker or an LED directly — The output stage is weak. Feed an amplifier or an op-amp buffer, and use a transistor or amplifier for anything that draws current.',
    'PWM from a pin is as good as a DAC — It carries ripple at the PWM frequency and takes several time constants to settle after a change. Fine for a slow reference, poor for a clean signal or for audio.'
  ],
  terms: [
    { term: 'DAC', also: ['digital-to-analogue converter', 'digital-to-analog converter'], def: 'A circuit that converts a number into a voltage. The DAC of the ESP32 and S2 is 8 bit: values 0 to 255 give 0 V up to about the supply voltage.' },
    { term: 'Staircase waveform', also: ['stepped output', 'zero-order hold'], def: 'The shape of a waveform made of discrete samples when the output holds each value until the next one is written: a signal that moves in steps instead of smoothly.' },
    { term: 'RC low-pass filter', also: ['RC filter', 'smoothing filter'], def: 'A resistor in series and a capacitor to ground that smooth a fast signal. After a PWM pin it turns the duty cycle into a nearly steady voltage; it needs about five time constants to settle.' },
    { term: 'DAC resolution', also: ['8-bit DAC', 'LSB step'], def: 'The number of distinct output levels. An 8-bit DAC has 256 levels, so each step of 1 in the written value changes the output by about 13 mV on a 3.3 V supply.' }
  ],
  sim: 'cr-dac',
  formulas: [
    {
      name: 'DAC output voltage',
      expr: 'V = Vdd * code / 255',
      tex: 'V = V_{\\mathrm{DD}}\\,\\frac{\\mathrm{code}}{255}',
      vars: {
        V: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V' },
        Vdd: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\mathrm{DD}}' },
        code: { name: 'value written', q: 'count', value: 128, min: 0, max: 255, int: true, tex: '\\mathrm{code}' }
      },
      solveFor: 'V',
      note: 'The full-scale value 255 gives about the supply voltage; the output is also only as accurate as the supply.',
      stories: { V: 'dacWrite is given {code} on a {Vdd} supply. What voltage comes out?', code: 'You want {V} from a DAC on a {Vdd} supply. What value should you write?' }
    },
    {
      name: 'Frequency of a stepped sine',
      expr: 'f = 1 / (n * dt)',
      tex: 'f = \\frac{1}{n\\,\\Delta t}',
      vars: {
        f: { name: 'output frequency', q: 'frequency', unit: 'Hz', tex: 'f' },
        n: { name: 'samples per period', q: 'count', value: 32, min: 2, int: true, tex: 'n' },
        dt: { name: 'time between samples', q: 'time', unit: 'µs', value: 100, tex: '\\Delta t' }
      },
      solveFor: 'f',
      note: 'The loop overhead adds to the wait, so the real frequency is a little lower; MicroPython is slower still.',
      stories: { f: 'A {n}-point sine table is written once every {dt}. What is the frequency of the output?', dt: 'You want {f} from a {n}-point sine table. How long should the program wait between samples?' }
    }
  ],
  code: [
    {
      title: 'A 310 Hz sine wave, one step at a time',
      about: 'A table of 32 values describes one period of a sine. The program writes them to the DAC in a loop, one every 100 µs.',
      needs: 'An ESP32 (GPIO25) or an ESP32-S2 (use GPIO17), and an oscilloscope or the audio input of an amplifier.',
      wiring: [['GPIO25', 'DAC1 output', 'ESP32-S2: GPIO17'], ['GND', 'scope or amplifier ground']],
      blocks: `
        when started
          set [i v] to (0)
        forever
          set DAC pin (25) to (round ((127.5) + ((127.5) * (sin of ((i) * (11.25))))))
          change [i v] by (1)
          if <(i) = (32)> then
            set [i v] to (0)
          end
          wait (0.0001) seconds
        end
      `,
      cpp: String.raw`
        const int DAC_PIN = 25;                 // DAC1 on the ESP32; the ESP32-S2 uses GPIO17
        const int N = 32;                       // samples per period
        uint8_t table[N];

        void setup() {
          for (int i = 0; i < N; i++) {
            table[i] = (uint8_t)(127.5f + 127.5f * sinf(2 * PI * i / N));   // 0 … 255 around the middle
          }
        }

        void loop() {
          for (int i = 0; i < N; i++) {
            dacWrite(DAC_PIN, table[i]);
            delayMicroseconds(100);             // 32 × 100 µs = 3.2 ms: about 310 Hz
          }
        }
      `,
      py: String.raw`
        from machine import DAC, Pin
        import math
        import time

        dac = DAC(Pin(25))                      # ESP32 pins 25 or 26; ESP32-S2 pins 17 or 18
        N = 32                                  # samples per period
        table = [int(127.5 + 127.5 * math.sin(2 * math.pi * i / N)) for i in range(N)]

        while True:
            for value in table:
                dac.write(value)
                time.sleep_us(100)              # slower in practice: the loop itself takes time
      `,
      notes: ['The MicroPython loop adds its own overhead to every step, so its frequency comes out lower than the 310 Hz of the C++ version.', 'For a smoother sine put a small RC filter behind the pin, or use more points; the simulation shows both.']
    },
    {
      title: 'An analogue voltage from PWM and an RC filter',
      about: 'For chips with no DAC. A 20 kHz PWM drives a 4.7 kΩ resistor and a 1 µF capacitor; the voltage across the capacitor is the duty cycle times 3.3 V. The program steps through 0, 20, 40, 60, 80 and 100 % of the supply.',
      needs: 'Any ESP32-family board, a 4.7 kΩ resistor, a 1 µF capacitor and a multimeter.',
      wiring: [['GPIO4', '4.7 kΩ → output node', ''], ['output node', '1 µF → GND', 'measure the voltage here (the corner is about 34 Hz)']],
      blocks: `
        when started
          set PWM on pin (4) frequency (20000) resolution (8)
        forever
          for each [level v] in (list 0 51 102 153 204 255)
            set PWM on pin (4) to (level)
            wait (0.5) seconds
          end
        end
      `,
      cpp: String.raw`
        const int OUT_PIN = 4;                  // PWM pin → 4.7 kΩ → output node, 1 µF from the node to GND
        const int FREQ = 20000;                 // far above the filter's corner of about 34 Hz
        const int BITS = 8;

        void analogOut(int level) {             // level 0 … 255 gives about 0 … 3.3 V once filtered
          ledcWrite(OUT_PIN, level);
        }

        void setup() {
          ledcAttach(OUT_PIN, FREQ, BITS);
        }

        void loop() {
          for (int level = 0; level <= 255; level += 51) {   // 0, 20, 40, 60, 80, 100 % of the supply
            analogOut(level);
            delay(500);                         // the filter needs about 25 ms to settle: 5 × R × C
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        pwm = PWM(Pin(4), freq=20000, duty_u16=0)   # PWM pin → 4.7 kΩ → output node, 1 µF to GND

        def analog_out(level):                      # level 0 … 255 gives about 0 … 3.3 V once filtered
            pwm.duty_u16(level * 257)

        while True:
            for level in range(0, 256, 51):         # 0, 20, 40, 60, 80, 100 % of the supply
                analog_out(level)
                time.sleep_ms(500)                  # the filter needs about 25 ms to settle: 5 × R × C
      `,
      notes: ['Time constant R × C = 4.7 ms; five of them, 24 ms, bring the output within 1 % of its final value.', 'At 50 % duty the ripple at the capacitor is about 9 mV peak to peak, about three-quarters of one step of an 8-bit DAC. A load must not draw current from the node: the resistor is its source impedance.']
    }
  ],
  choose: {
    good: ['The built-in DAC (ESP32, S2) for a slow reference voltage, a bias or a simple waveform', 'PWM with an RC filter on any chip when a few millivolts of ripple and a slow response are acceptable', 'An external converter (MCP4725 and similar) for 12 bits or more, or a strong output'],
    avoid: ['Driving a speaker, an LED or a motor from the DAC pin', 'dacWrite on chips that have no DAC', 'PWM straight into a measurement circuit without a filter'],
    check: ['That your chip is the ESP32 or the S2, and which pins carry the DAC', 'How much current the load draws from the output', 'How fast the output must change: the RC filter limits it']
  },
  examples: [
    {
      title: 'Sample interval for 1 kHz',
      q: 'You want a 1 kHz sine from a 32-point table on the DAC. How long may each step take, and can a delayMicroseconds loop do it?',
      steps: ['One period is 1 ms, so each of the 32 steps takes $1\\ \\mathrm{ms} / 32 = 31.25$ µs.', 'A call to dacWrite takes a few microseconds, so a wait of about 25 µs after it gives roughly the right interval.', 'It works, but the timing wanders when interrupts and the radio take the CPU: for a clean tone use a hardware timer or the DMA mode of ESP-IDF.'],
      a: '31 µs per step. A delay loop can approach it, but a hardware timer makes the timing exact.'
    }
  ],
  quiz: [
    { q: 'On which of these can you use dacWrite?', choices: ['ESP32-S3', 'ESP32-C3', 'ESP32 (GPIO25)', 'ESP32-C6'], a: 2, why: 'Only the original ESP32 (GPIO25 and 26), the ESP32-S2 (GPIO17 and 18) and the S31 have a DAC. The S3, C3 and C6 do not.' },
    { q: 'A 32-point sine table is written to the DAC every 100 µs. What is the output frequency?', choices: ['3200 Hz', '312 Hz', '31 Hz', '100 kHz'], a: 1, why: 'One period takes 32 × 100 µs = 3.2 ms, which is 1 / 3.2 ms = 312 Hz.' },
    { q: 'An 8-bit DAC on a 3.3 V supply is given the value 128. The output is about…', choices: ['0.41 V', '1.65 V', '3.3 V', '0.128 V'], a: 1, why: '128 of 255 is about half of full scale: 3.3 × 128 / 255 = 1.66 V.' },
    { q: 'A PWM pin followed by an RC low-pass filter gives a steady voltage that follows the duty cycle.', a: true, why: 'The filter averages the fast square wave. Its corner must be far below the PWM frequency, and it needs about five time constants to settle after a change.' }
  ],
  applications: [
    'A programmable reference or bias voltage for an analogue circuit or sensor.',
    'Signal generators for testing: sine, triangle, ramp.',
    'Simple sound output, with an amplifier after the pin.',
    'Setting the threshold of a comparator, or a control voltage for a power supply.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *DAC* API (core 3.3).',
    'MicroPython documentation, *machine.DAC* and the ESP32 quick reference, DAC section (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, *Digital To Analog Converter (DAC)*: oneshot, continuous and cosine modes; the ESP32 Series Datasheet, DAC characteristics.'
  ]
},

/* ================================================================ hardware timers */
{
  id: 'hardware-timers',
  parent: 'core-peripherals',
  title: 'Hardware timers',
  level: 2,
  short: 'A counter in the chip that raises an alarm at an exact moment, whatever the program is doing. The tool for sampling at a fixed rate; for jobs measured in milliseconds, a software timer is usually the better choice.',
  keywords: ['hardware timer', 'hw_timer_t', 'timerBegin', 'timerAttachInterrupt', 'timerAlarm', 'timerWrite', 'Ticker', 'machine.Timer', 'Timer.PERIODIC', 'alarm', 'tick', 'esp_timer', 'periodic interrupt', 'sample rate', 'jitter', 'gptimer'],
  prereq: ['interrupts', 'non-blocking-timing'],
  related: ['software-timers', 'sample-time-and-jitter', 'delays-and-yielding', 'from-interrupt-to-task', 'crystals-and-clocks', 'watchdogs', 'pid-control'],
  body: `A microcontroller often has to do something at exact intervals: sample a sensor a thousand times a second, update a control loop, step a motor. \`delay()\` cannot do it. Every pass of the loop takes the delay *plus* whatever else the loop does — a print, a Wi-Fi call, a slow sensor — so the interval is always longer and never constant. A **hardware timer** is a counter inside the chip, clocked from a fixed source, that raises an **alarm** when it reaches a value you chose. The interrupt handler runs at that moment, and the timing is as good as the crystal, whatever the CPU is doing.

### Using one in core 3.x

\`timerBegin(frequency)\` creates a timer that counts at that frequency (1 000 000 gives a 1 µs tick) and starts it. \`timerAttachInterrupt(timer, handler)\` says what to run, and \`timerAlarm(timer, value, reload, count)\` sets the alarm at \`value\` ticks, repeating for ever when \`reload\` is true and \`count\` is 0. The value is the frequency times the period, so 10 000 ticks at 1 MHz is 10 ms. The handler is an interrupt handler with all the rules of [[interrupts]]: \`IRAM_ATTR\`, \`volatile\` data, no printing, no waiting. The ESP32, S2 and S3 have four hardware timers, the C3, C6 and H2 two.

MicroPython has \`machine.Timer(id)\` with \`period=\` in milliseconds or \`freq=\` in hertz. On the ESP32 its callback is *scheduled*, not run in the interrupt, and \`hard=True\` raises an error: it is good for millisecond-scale jobs and not for microsecond precision.

### Pick the right kind of timer

| | Where it runs | How exact | Use it for |
|---|---|---|---|
| \`delay()\` or a \`millis()\` check | the main loop | late by whatever the loop does | slow, loose timing |
| \`Ticker\`, \`esp_timer\`, FreeRTOS software timer | a system task | about a millisecond | blinking, polling, timeouts ([[software-timers]]) |
| Hardware timer | an interrupt | microseconds | fixed-rate sampling, control loops, exact pulses |

Use a hardware timer only where microseconds matter; for everything slower a software timer is easier and cannot upset the rest of the system.

### Old code

Core 2.x wrote \`timerBegin(0, 80, true)\`, \`timerAttachInterrupt(timer, fn, true)\`, \`timerAlarmWrite\` and \`timerAlarmEnable\`. None of these exist in core 3.x. If a tutorial prescales an 80 MHz clock by 80, it is core 2.

### Traps

An alarm that comes round faster than the handler can finish starves the program and trips the interrupt watchdog. Data shared with \`loop()\` must be \`volatile\`, and anything larger than one 32-bit value needs a critical section ([[race-conditions]]). To do real work at the alarm, give a semaphore from the handler and let a task wake up ([[from-interrupt-to-task]]).

> [!key] A hardware timer fires an alarm after an exact count, regardless of what the loop is doing: timerBegin(frequency), timerAttachInterrupt, timerAlarm. Use it for microsecond-exact sampling, and use a software timer for anything that only has to happen about every millisecond.`,
  ideas: [
    'A hardware timer counts a fixed clock and fires an alarm at a chosen count, so its period is exact whatever the loop does.',
    'In core 3.x: timerBegin(frequency), timerAttachInterrupt(timer, fn), timerAlarm(timer, value, reload, count); the value is frequency times period.',
    'The handler is an ISR: IRAM_ATTR, volatile data, nothing that waits.',
    'For millisecond jobs a software timer (Ticker, esp_timer, machine.Timer) is simpler and safer; MicroPython timers are scheduled, not hard.'
  ],
  pitfalls: [
    'delay(10) in a loop gives a 100 Hz rate — It gives a period of 10 ms plus everything else in the loop, so it is slower and drifts. Only a timer, or a deadline that is advanced by exactly the interval, keeps the rate exact.',
    'timerBegin(0, 80, true) is how you start a timer — That is core 2.x and does not compile on 3.x. Write timerBegin(frequency) and timerAlarm(...).',
    'A MicroPython Timer with hard=True gives a faster, safer handler — On the ESP32 it raises ValueError: hard timers are not implemented. Callbacks are scheduled and may run late.'
  ],
  terms: [
    { term: 'Hardware timer', also: ['hw_timer_t', 'general-purpose timer', 'GPTimer'], def: 'A counter inside the chip, driven by a fixed clock, that can raise an interrupt when it reaches a chosen value. The ESP32, S2 and S3 have four, the C3, C6 and H2 two.' },
    { term: 'Alarm', also: ['timer alarm', 'compare value'], def: 'The count at which a timer fires. In core 3.x it is set with timerAlarm(timer, value, reload, count); with reload it fires again at every multiple.' },
    { term: 'Tick', also: ['timer tick', 'timer resolution'], def: 'One count of a timer: the shortest interval it can measure. At a frequency of 1 MHz a tick is 1 µs.' },
    { term: 'Jitter', also: ['timing jitter'], def: 'The variation of the time between events that should be evenly spaced. A hardware timer has jitter of microseconds; a delay loop has jitter of milliseconds.' },
    { term: 'Software timer', also: ['Ticker', 'esp_timer', 'FreeRTOS timer'], def: 'A timer implemented by the operating system that calls your function from a system task, not from an interrupt. It is simpler and safer than a hardware timer and accurate to about a millisecond.' }
  ],
  sim: 'cr-timer',
  formulas: [
    {
      name: 'Alarm value for a period',
      expr: 'N = f * T',
      tex: 'N = f_{\\mathrm{tick}}\\,T',
      vars: {
        N: { name: 'alarm value', q: 'count', tex: 'N' },
        f: { name: 'timer tick frequency', q: 'frequency', unit: 'MHz', value: 1, tex: 'f_{\\mathrm{tick}}' },
        T: { name: 'period wanted', q: 'time', unit: 'ms', value: 10, tex: 'T' }
      },
      solveFor: 'N',
      note: 'The value passed to timerAlarm. It must be a whole number, so choose a tick frequency that divides the period exactly.',
      stories: { N: 'A timer counts at {f}. What alarm value gives a period of {T}?', T: 'A timer counts at {f} and the alarm value is {N}. What is the period?' }
    }
  ],
  code: [
    {
      title: 'A tick every 10 ms from a hardware timer',
      about: 'A timer counting at 1 MHz raises an alarm every 10 000 ticks. The handler only counts; the loop prints once per hundred alarms, which is once a second by the timer, and shows the system clock beside it.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [ticks v] to (0)
          set [reported v] to (0)
          start a hardware timer: (100) alarms a second :: tasks
        forever
          if <((ticks) - (reported)) ≥ (100)> then
            change [reported v] by (100)
            print (join (ticks) [ alarms, clock says ] (milliseconds since start) [ ms])
          end
        end

        when timer fires    // runs every 10 ms, exactly
          change [ticks v] by (1)
      `,
      cpp: String.raw`
        hw_timer_t *timer = nullptr;
        volatile uint32_t ticks = 0;               // counted by the timer interrupt

        void IRAM_ATTR onTimer() {                 // runs every 10 ms, exactly
          ticks++;
        }

        void setup() {
          Serial.begin(115200);
          timer = timerBegin(1000000);             // count at 1 MHz: one tick = 1 µs
          timerAttachInterrupt(timer, &onTimer);   // what to run at the alarm
          timerAlarm(timer, 10000, true, 0);       // alarm at 10 000 ticks = 10 ms, reload, repeat for ever
        }

        void loop() {
          static uint32_t reported = 0;
          uint32_t now = ticks;
          if (now - reported >= 100) {             // 100 alarms = one second
            reported += 100;
            Serial.printf("%lu alarms, millis() says %lu ms\n", (unsigned long)now, (unsigned long)millis());
          }
        }
      `,
      py: String.raw`
        from machine import Timer
        import time

        ticks = 0                                  # counted by the timer callback

        def on_timer(t):                           # every 10 ms: a scheduled callback, not a hardware interrupt
            global ticks
            ticks += 1

        timer = Timer(0)
        timer.init(freq=100, mode=Timer.PERIODIC, callback=on_timer)   # 100 Hz = every 10 ms

        reported = 0
        while True:
            if ticks - reported >= 100:            # 100 alarms = one second
                reported += 100
                print(ticks, "alarms, ticks_ms() says", time.ticks_ms(), "ms")
            time.sleep_ms(5)
      `,
      output: `
        100 alarms, millis() says 1013 ms
        200 alarms, millis() says 2013 ms
        300 alarms, millis() says 3013 ms
      `,
      notes: ['The two clocks stay a constant 13 ms apart: the timer never drifts against the crystal, and the printing delay does not accumulate.', 'In core 2.x the same program began timerBegin(0, 80, true) and used timerAlarmWrite and timerAlarmEnable.']
    },
    {
      title: 'Toggle an LED every 500 ms with a software timer',
      about: 'For a slow periodic job a software timer is enough: it calls the function from a system task, not from an interrupt, so the function may do ordinary things, and the main loop is left free.',
      needs: 'An ESP32 DevKit with an LED on GPIO2 (the on-board one on many boards).',
      wiring: [['GPIO2', 'LED (on-board, or 220 Ω → LED → GND)']],
      blocks: `
        when started
          set pin (2) as [output v]
          start a timer: (2) alarms a second :: tasks

        when timer fires
          toggle pin (2)
      `,
      cpp: String.raw`
        #include <Ticker.h>

        const int LED = 2;
        Ticker blinker;                            // a software timer: it runs your function from a system task

        void toggle() {
          digitalWrite(LED, !digitalRead(LED));
        }

        void setup() {
          pinMode(LED, OUTPUT);
          blinker.attach_ms(500, toggle);          // every 500 ms
        }

        void loop() {
          // the main loop is free for other work
        }
      `,
      py: String.raw`
        from machine import Pin, Timer

        led = Pin(2, Pin.OUT)

        def toggle(t):
            led.toggle()

        blinker = Timer(0)
        blinker.init(period=500, mode=Timer.PERIODIC, callback=toggle)   # every 500 ms
        # the main program is free for other work
      `,
      notes: ['Ticker also has once_ms() for a single shot and detach() to stop it; machine.Timer has Timer.ONE_SHOT and deinit().']
    }
  ],
  choose: {
    good: ['A hardware timer for sampling or control at a fixed rate, with the work done in a task or in the loop', 'A software timer (Ticker, machine.Timer) for blinking, polling and timeouts of a millisecond or more', 'A deadline in the loop (millis plus the interval) when a little jitter does not matter'],
    avoid: ['Doing the real work inside the timer handler', 'delay() loops for anything that has to keep an exact rate', 'Using up all four timers when one software timer would do'],
    check: ['That the handler finishes well before the next alarm', 'How many hardware timers your chip has (2 or 4) and what else uses them', 'That the shared data is volatile or protected']
  },
  examples: [
    {
      title: 'How far behind does a delay loop fall?',
      q: 'A loop does 1.2 ms of work and then calls delay(10), meaning to run at 100 Hz. How late is the 6000th pass compared with a hardware timer?',
      steps: ['Each pass takes $10 + 1.2 = 11.2$ ms.', 'The timer fires 6000 times in exactly 60 s. The loop needs $6000 \\times 11.2\\ \\mathrm{ms} = 67.2$ s for the same number of passes.', 'The difference is 7.2 s after one minute, and it grows without limit.'],
      a: 'The loop is 7.2 s late after a minute. The fix is a timer, or a deadline advanced by exactly 10 ms each pass.'
    }
  ],
  quiz: [
    { q: 'Which call arms the alarm of a hardware timer in Arduino core 3.x?', choices: ['timerAlarmEnable(timer)', 'timerAlarm(timer, value, reload, count)', 'timerBegin(0, 80, true)', 'timerSetAlarm(timer, value)'], a: 1, why: 'Core 3.x has timerBegin(frequency), timerAttachInterrupt(timer, fn) and timerAlarm(...). The other forms belong to core 2.x or do not exist.' },
    { q: 'A timer counts at 1 MHz. Which alarm value gives a 25 ms period?', choices: ['250', '2500', '25 000', '250 000'], a: 2, why: 'At 1 MHz there are 1 000 000 ticks per second, so 25 ms is 25 000 ticks.' },
    { q: 'In MicroPython on the ESP32, Timer(0, hard=True) is the way to get microsecond-exact callbacks.', a: false, why: 'Hard timers are not implemented on the ESP32 port and the call raises ValueError. Callbacks are scheduled and may run a little late.' },
    { q: 'You need to blink an LED twice a second while a web server runs. Which is the best tool?', choices: ['A hardware timer with the LED toggled in the ISR', 'A software timer such as Ticker, or a millis() check', 'delay(500) in loop()', 'A while loop that waits for 500 ms'], a: 1, why: 'A software timer is exact enough and cannot disturb the interrupts; delay() would stop the web server from being served for those 500 ms.' }
  ],
  applications: [
    'Sampling a sensor or a microphone at a fixed rate.',
    'The loop of a controller: a PID loop that must run every 10 ms.',
    'Generating a precise pulse or a software PWM on a pin.',
    'Measuring the time between two events with a microsecond counter.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *Timer* API and the RepeatTimer example; the migration guide from 2.x to 3.0 (core 3.3).',
    'MicroPython documentation, *machine.Timer* and the ESP32 quick reference, Timers section (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, *General Purpose Timer (GPTimer)* and *High Resolution Timer (esp_timer)*; the ESP32 Technical Reference Manual, timer group chapter.'
  ]
},

/* ================================================================ the RMT */
{
  id: 'the-rmt-peripheral',
  parent: 'core-peripherals',
  title: 'RMT: pulses to the microsecond',
  level: 3,
  short: 'A hardware engine that plays a list of "high for this long, low for that long" symbols out of a pin, and records them from one. It makes the 800 kHz data of addressable LEDs and the codes of infrared remotes without the CPU holding its breath.',
  keywords: ['RMT', 'remote control', 'rmtInit', 'rmtWrite', 'rmt_data_t', 'esp32.RMT', 'write_pulses', 'WS2812', 'NeoPixel', 'infrared', 'NEC', 'carrier', 'symbol', 'pulse train', 'rgbLedWrite', 'bitstream', 'tick'],
  prereq: ['digital-output', 'hardware-timers'],
  related: ['addressable-leds', 'infrared-remotes', 'infrared-transmitters', 'one-wire', 'bits-and-bytes', 'pwm-with-ledc', 'gpio-matrix-and-io-mux'],
  body: `The **RMT** (remote control) peripheral was built for infrared remote controls, hence the name, but it is really a general machine for sending and receiving trains of pulses with exact timing. You give it a list of **symbols**, each of the form "level, duration, level, duration", for example "high for 8 ticks, then low for 5 ticks", and it plays them out of a pin by itself. The tick is set by a divider on a fast clock, so 100 ns and 1 µs ticks are easy, and the timing does not depend on what the CPU or the Wi-Fi radio is doing.

### Why not just toggle a pin?

Take the WS2812, the addressable LED behind most "NeoPixel" strips. Its data is a stream at 800 kHz, one bit every 1.25 µs, where a 0 and a 1 differ only in how long the pin stays high, 0.4 µs against 0.8 µs, and each time must be right within about 150 ns. A program that toggles a pin cannot promise that while interrupts and the radio keep stealing the CPU. The RMT can: one symbol per bit, and the hardware does the timing.

| Bit | High | Low |
|---|---|---|
| 0 | 0.4 µs | 0.85 µs |
| 1 | 0.8 µs | 0.45 µs |
| Frame end | line low for more than 50 µs | |

### Symbols, memory and carriers

A symbol holds two halves, each with a level and a duration of up to 15 bits of ticks. Each channel has a block of memory for 48 or 64 symbols, and the drivers refill it for longer sequences. On transmit the RMT can also modulate a **carrier**, for example 38 kHz for infrared, in hardware; on receive it records the width of each pulse and can filter out glitches shorter than a chosen time. The same hardware therefore sends and decodes the codes of infrared remotes ([[infrared-remotes]], [[infrared-transmitters]]).

### Which chips

| Chip | Channels |
|---|---|
| ESP32 | 8, each transmit or receive |
| ESP32-S2 | 4, each transmit or receive |
| ESP32-S3, P4 | 4 transmit and 4 receive |
| ESP32-C3, C5, C6, H2 | 2 transmit and 2 receive |
| ESP32-C2, C61 | none |

### In a program

The Arduino core already uses it: \`rgbLedWrite\` lights the on-board RGB LED through the RMT, and so do the NeoPixel libraries and MicroPython's \`neopixel\` module (which reaches the RMT through \`machine.bitstream\`). To drive the RMT directly, Arduino core 3.x has \`rmtInit\` and \`rmtWrite\`, and MicroPython has the \`esp32.RMT\` class with \`write_pulses\`. The program below builds the 24 bits of one pixel symbol by symbol. The simulation shows what the pin does and why the tick must be fine enough: at 1 µs the WS2812 timing is out of specification.

> [!key] The RMT plays and records pulse trains from hardware, with ticks of tens of nanoseconds: it is how the ESP32 drives addressable LEDs and infrared remotes reliably. A symbol is two (level, duration) halves; the tick must be fine enough for the protocol, and the C2 and C61 have none.`,
  ideas: [
    'The RMT plays a list of (level, duration) symbols out of a pin, and records them from one, in hardware and with exact timing.',
    'It makes protocols whose timing a CPU cannot guarantee: WS2812 LEDs at 800 kHz, infrared remote codes, one-wire-like signals.',
    'The tick (resolution) must be fine enough for the protocol: for WS2812 a few hundred nanoseconds at most, 100 ns being the usual choice; a 1 µs tick is out of specification.',
    'The count of channels differs: 8 on the ESP32, 4 on the S2, 4 plus 4 on the S3 and P4, 2 plus 2 on the C3, C5, C6 and H2, none on the C2 and C61.'
  ],
  pitfalls: [
    'A fast loop of digitalWrite can drive a WS2812 strip — It works on a quiet bench and glitches the moment Wi-Fi or an interrupt takes the CPU, because the margin is 150 ns. Use the RMT, a library built on it, or SPI.',
    'Any ESP32 has an RMT — The ESP32-C2 and C61 have none. A strip on those chips needs the SPI trick or a bit-banged library with interrupts off.',
    'A 3.3 V data pin always drives a 5 V strip — Many pixels read 3.3 V as high only just; run the strip from 5 V with a short data wire, a 300 to 470 Ω series resistor and a common ground, or add a level shifter ([[addressable-leds]]).'
  ],
  terms: [
    { term: 'RMT', also: ['remote control peripheral', 'Remote Control Transceiver'], def: 'The ESP32 peripheral that transmits and receives pulse trains with exact timing, defined as lists of symbols. It was designed for infrared remotes and also drives addressable LEDs.' },
    { term: 'RMT symbol', also: ['rmt_data_t', 'pulse symbol'], def: 'One element of an RMT sequence: two consecutive levels with their durations in ticks, for example high for 8 ticks then low for 5 ticks. One WS2812 data bit is one symbol.' },
    { term: 'Tick', also: ['RMT resolution', 'clock divider'], def: 'The shortest time the RMT can measure or play, set by dividing its clock. Durations are whole numbers of ticks, so the tick must be fine enough for the protocol.' },
    { term: 'Carrier', also: ['carrier frequency', 'modulation'], def: 'A fast signal, such as 38 kHz for infrared remotes, that is switched on and off by the data. The RMT can add it on transmit and remove it on receive.' },
    { term: 'WS2812', also: ['NeoPixel', 'addressable LED'], def: 'A colour LED with its own driver chip, controlled by a single data wire at 800 kHz: 24 bits per LED, green, red and blue, passed on from pixel to pixel.' }
  ],
  sim: 'cr-rmt',
  formulas: [
    {
      name: 'Time to send a frame to a strip',
      expr: 'tf = n * 24 * tbit + treset',
      tex: 't_{\\mathrm{frame}} = n \\cdot 24 \\cdot t_{\\mathrm{bit}} + t_{\\mathrm{reset}}',
      vars: {
        tf: { name: 'time for one frame', q: 'time', unit: 'ms', tex: 't_{\\mathrm{frame}}' },
        n: { name: 'number of LEDs', q: 'count', value: 60, min: 1, int: true, tex: 'n' },
        tbit: { name: 'time of one bit', q: 'time', unit: 'µs', value: 1.25, tex: 't_{\\mathrm{bit}}' },
        treset: { name: 'reset gap', q: 'time', unit: 'µs', value: 50, tex: 't_{\\mathrm{reset}}' }
      },
      solveFor: 'tf',
      note: 'Each LED takes 24 bits. The limit on the refresh rate of a long strip is this time, not the program: the reciprocal is the highest frame rate.',
      stories: { tf: 'A strip of {n} WS2812 LEDs is driven at {tbit} per bit with a reset gap of {treset}. How long does one frame take?', n: 'One frame must take {tf} at {tbit} per bit with a reset gap of {treset}. How many LEDs fit?' }
    }
  ],
  code: [
    {
      title: 'One WS2812 pixel, symbol by symbol',
      about: 'Turns one addressable LED a dim red. Each of the 24 bits is one RMT symbol of two halves, with a tick of 100 ns: 0.8 µs high and 0.5 µs low for a 1, 0.4 µs high and 0.9 µs low for a 0. The bytes go out in the order green, red, blue.',
      needs: 'An ESP32 DevKit and one WS2812 pixel (or a strip) on a 5 V supply. Keep the data wire short and join the grounds.',
      wiring: [['GPIO18', '330 Ω → DIN of the pixel', 'a 3.3 V data signal'], ['5V', 'pixel V+', 'with a 100 µF capacitor across the supply'], ['GND', 'pixel GND and board GND']],
      blocks: `
        when started
          start RMT output on pin (18) with a tick of (100) ns :: light
          for each [byte v] in (list (0) (40) (0))    // green, red, blue
            for each [bit v] in (the 8 bits of (byte), most significant first)
              if <(bit) = (1)> then
                add a pulse: high (8) ticks, low (5) ticks :: light
              else
                add a pulse: high (4) ticks, low (9) ticks :: light
              end
            end
          end
          send the pulses and wait :: light
      `,
      cpp: String.raw`
        const int DATA_PIN = 18;                 // GPIO18 → 330 Ω → DIN of one WS2812
        const uint32_t TICK_HZ = 10000000;       // 10 MHz: one tick = 100 ns
        rmt_data_t symbols[24];                  // one RMT symbol per bit: two (level, duration) halves

        void encodeByte(uint8_t value, int first) {
          for (int bit = 0; bit < 8; bit++) {
            bool one = value & (0x80 >> bit);    // most significant bit first
            rmt_data_t &s = symbols[first + bit];
            s.level0 = 1; s.duration0 = one ? 8 : 4;   // high: 0.8 µs for a 1, 0.4 µs for a 0
            s.level1 = 0; s.duration1 = one ? 5 : 9;   // low:  0.5 µs for a 1, 0.9 µs for a 0
          }
        }

        void setup() {
          rmtInit(DATA_PIN, RMT_TX_MODE, RMT_MEM_NUM_BLOCKS_1, TICK_HZ);
          encodeByte(0, 0);                      // green
          encodeByte(40, 8);                     // red
          encodeByte(0, 16);                     // blue: the WS2812 wants the order G, R, B
          rmtWrite(DATA_PIN, symbols, 24, RMT_WAIT_FOR_EVER);   // plays the 24 symbols and waits
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32
        from machine import Pin

        DATA_PIN = 18                            # GPIO18 → 330 Ω → DIN of one WS2812
        rmt = esp32.RMT(0, pin=Pin(DATA_PIN), clock_div=8)   # 80 MHz / 8 = 10 MHz: one tick = 100 ns

        def encode_byte(value):
            pulses = []
            for bit in range(8):
                one = value & (0x80 >> bit)      # most significant bit first
                pulses += (8, 5) if one else (4, 9)   # high then low: 0.8 + 0.5 µs for a 1, 0.4 + 0.9 µs for a 0
            return pulses

        pulses = encode_byte(0) + encode_byte(40) + encode_byte(0)   # G, R, B
        rmt.write_pulses(pulses, 1)              # start with the line high; the level toggles after each duration
        rmt.wait_done()
      `,
      notes: ['The rmtInit and rmtWrite calls are the RMT API of Arduino core 3.x; check the RMT examples of your core version if a name differs.', 'MicroPython\'s source clock is 80 MHz on most chips: print rmt.source_freq() and choose clock_div to give 100 ns. For several pixels use the neopixel module, which does this for you.', 'For ordinary use prefer rgbLedWrite (the on-board LED) or a NeoPixel library: this program shows what they do underneath.']
    }
  ],
  choose: {
    good: ['The RMT, or a library built on it, for WS2812 and similar one-wire LED chains', 'Transmitting and decoding infrared remote codes, with the hardware carrier', 'Any pulse train whose exact widths matter and that is longer than a timer interrupt could handle'],
    avoid: ['The RMT for a steady PWM (use LEDC) or for clocked bus data (use SPI)', 'A tick coarser than the protocol needs', 'The RMT on the ESP32-C2 or C61: it is not there'],
    check: ['That your chip has a free RMT channel for the direction you need', 'That the longest frame fits the channel memory or that the driver streams it', 'The voltage level and the length of the data wire to the LEDs']
  },
  examples: [
    {
      title: 'How fast can a strip be refreshed?',
      q: 'A strip has 144 WS2812 LEDs. How long does one frame take, and what is the highest frame rate?',
      steps: ['Each LED needs 24 bits at 1.25 µs: $24 \\times 1.25 = 30$ µs.', '144 LEDs take $144 \\times 30 = 4320$ µs = 4.32 ms; the 50 µs reset gap brings it to about 4.37 ms.', 'The highest frame rate is $1 / 4.37\\ \\mathrm{ms} \\approx 229$ frames per second.'],
      a: 'About 4.4 ms per frame, so at most about 229 frames a second. A strip of 1000 LEDs would manage only about 33.'
    }
  ],
  quiz: [
    { q: 'What does one RMT symbol describe?', choices: ['One byte', 'Two consecutive levels, each with its duration in ticks', 'A complete frame', 'One clock edge'], a: 1, why: 'A symbol is "level, duration, level, duration". A longer pulse train is a list of such symbols; for WS2812 each data bit is one symbol.' },
    { q: 'Could a 1 µs RMT tick drive a WS2812 correctly?', choices: ['Yes, rounding all times to 1 µs is fine', 'No: the 0.4 µs and 0.45 µs times cannot be made, and the tolerance is only about 150 ns', 'Yes, but only at half the rate', 'Only on the ESP32-S3'], a: 1, why: 'With 1 µs ticks the shortest high time is 1 µs, far outside the 0.4 µs to 0.8 µs the LED expects. A 100 ns tick keeps all four times within tolerance.' },
    { q: 'Which of these chips has no RMT?', choices: ['ESP32-C3', 'ESP32-S3', 'ESP32-C2', 'ESP32'], a: 2, why: 'The ESP32-C2 and C61 have no RMT. The ESP32 has 8 channels, the C3 two transmit and two receive, the S3 four and four.' },
    { q: 'Because the RMT runs in hardware, Wi-Fi activity does not disturb the timing of a frame that fits in the channel memory.', a: true, why: 'Once started, the RMT clocks out its symbols by itself. Only the start of the frame and the refill of long sequences depend on the CPU.' }
  ],
  applications: [
    'Driving WS2812 and SK6812 LED strips, rings and matrices.',
    'Sending and receiving infrared remote-control codes.',
    'Reading simple pulse-coded sensors by recording the pulse widths.',
    'Generating a precise pulse train with a hardware carrier, for example a radio-control signal.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, the RMT API and its examples (core 3.3).',
    'MicroPython documentation, the *esp32* module: class RMT, and *machine.bitstream* (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, *Remote Control Transceiver (RMT)*; the WS2812B datasheet for the bit timings.'
  ]
},

/* ================================================================ the pulse counter */
{
  id: 'pulse-counter-pcnt',
  parent: 'core-peripherals',
  title: 'The pulse counter',
  level: 3,
  short: 'Hardware that counts the edges of a signal, up or down, without the CPU. It reads flow meters, tachometers and rotary encoders at speeds an interrupt per edge could not follow. The Arduino core has no wrapper: the program uses the ESP-IDF driver.',
  keywords: ['PCNT', 'pulse counter', 'pulse count controller', 'quadrature', 'rotary encoder', 'encoder', 'glitch filter', 'pulse_cnt.h', 'pcnt_new_unit', 'frequency counter', 'flow meter', 'tachometer', 'edge action', 'level action', 'watch point'],
  prereq: ['interrupts', 'digital-input'],
  related: ['rotary-encoders', 'encoders-and-speed', 'pulse-counting', 'measuring-frequency-and-time', 'esp-as-a-frequency-counter', 'hardware-timers', 'motors:incremental-encoders'],
  body: `The **pulse counter** (PCNT) is a counter that lives next to a pin: every edge of the signal on the pin adds one to a register, or takes one away, and the CPU is not involved at all. A program reads the register when it likes. That makes it the right tool for any signal that changes faster than an interrupt per edge can follow: a flow meter, a motor's tachometer, a rotary encoder spun by hand or by a motor, or an unknown frequency that you want to measure by counting for a second.

### What a unit does

A **unit** is one counter with a signed 16-bit register and two **channels**. A channel watches one signal for its **edges** and a second signal for its **level**, and each combination has an action: increase, decrease or hold. Count the rising edges of signal A and ignore the second signal: that is a frequency counter. Let the level of B decide whether an edge of A counts up or down, and a second channel do the same with the roles swapped: that is a **quadrature decoder**, which counts all four edges of each encoder cycle and knows the direction ([[rotary-encoders]]). A **glitch filter** of some hundred nanoseconds or microseconds ignores spikes. The unit can also raise an interrupt at chosen **watch points** and at its limits.

### Which chips

| Chip | PCNT units |
|---|---|
| ESP32 | 8 |
| ESP32-S2, S3, C5, C6, H2, P4 | 4 |
| ESP32-C2, C3, C61 | none |

The ESP32-C3 has no pulse counter, which surprises many: on that chip, and on the C2 and C61, counting means interrupts or another peripheral.

### In a program

The Arduino core has no PCNT API; the program includes the ESP-IDF driver (\`driver/pulse_cnt.h\`) and calls it from the sketch, as the program below does for an encoder: create a unit, add two channels, set their edge and level actions, enable and start. MicroPython has no counter class in the version this guide follows: a \`Pin.irq\` handler on both signals can decode a knob turned by hand, but it is scheduled, not instant, and will lose edges at speed.

### Limits and traps

- **The register is 16 bit.** At 100 kHz it overflows within about 0.3 s, so read it often, or use the limits and watch points, or let the driver accumulate beyond them.
- **A mechanical encoder bounces.** In quadrature decoding a bounce adds a count and takes it back, so the net count stays right; a plain edge counter would count the bounce as extra turns. The simulation compares the two.
- **Pull-ups.** A bare encoder needs pull-ups on both signals; the hardware does not add them.
- **To read speed**, count over a fixed interval (see the formula) or time the gap between edges.

> [!key] The pulse counter counts the edges of a signal in hardware, up or down, so it can follow signals far too fast for interrupts, and it decodes quadrature encoders including direction. It exists on all chips except the C2, C3 and C61, and the Arduino core makes you call the ESP-IDF driver.`,
  ideas: [
    'A PCNT unit counts edges in hardware: the CPU only reads the register, so it never loses a pulse.',
    'A channel combines the edges of one signal with the level of another: that gives a frequency counter or, with two channels, a quadrature decoder.',
    'The register is 16 bit and signed, so fast signals need frequent reads or the driver\'s accumulation.',
    'The C2, C3 and C61 have no pulse counter; the Arduino core has no wrapper and a sketch uses the ESP-IDF driver.'
  ],
  pitfalls: [
    'An interrupt on each edge counts a fast signal fine — It costs several microseconds an edge and loses counts when the CPU is busy. Above a few kilohertz, count in hardware.',
    'Counting the rising edges of A is enough for an encoder — That gives no direction and counts bounce as turns. Quadrature decoding reads both signals and cancels bounce.',
    'The ESP32-C3 can count pulses like the ESP32 — The C3 has no PCNT at all, and neither has the C2 or the C61.'
  ],
  terms: [
    { term: 'Pulse counter', also: ['PCNT', 'pulse count controller'], def: 'A hardware counter that adds or subtracts one for each edge of an input signal, with no CPU involvement. The ESP32 has 8 units, the S2, S3, C5, C6, H2 and P4 have 4, and the C2, C3 and C61 none.' },
    { term: 'Quadrature encoder', also: ['incremental encoder', 'rotary encoder', 'A/B encoder'], def: 'A sensor with two square-wave outputs, A and B, a quarter of a cycle apart. Which one leads tells the direction, and counting all four edges of a cycle gives four counts per step.' },
    { term: 'Edge action and level action', also: ['PCNT_CHANNEL_EDGE_ACTION', 'channel action'], def: 'The rules of a PCNT channel: what the counter does at a rising and a falling edge of one signal, and how the level of a second signal changes that (keep or invert the direction).' },
    { term: 'Glitch filter', also: ['input filter', 'max_glitch_ns'], def: 'A circuit that ignores pulses shorter than a set time, typically from some hundred nanoseconds up to a few microseconds, so that spikes do not count. It does not remove the bounce of a mechanical switch, which lasts milliseconds.' },
    { term: 'Watch point', also: ['PCNT limit', 'compare value'], def: 'A count at which the pulse counter raises an event or an interrupt, such as the upper limit, or zero. Used to extend the 16-bit count in software.' }
  ],
  sim: 'cr-pcnt',
  formulas: [
    {
      name: 'Shaft speed from a quadrature count',
      expr: 'w = n / (4 * ppr * dt)',
      tex: 'f_{\\mathrm{rev}} = \\frac{N}{4\\,\\mathrm{ppr}\\;\\Delta t}',
      vars: {
        w: { name: 'speed', q: 'frequency', unit: 'rpm', tex: 'f_{\\mathrm{rev}}' },
        n: { name: 'counts in the interval', q: 'count', value: 400, tex: 'N' },
        ppr: { name: 'pulses per revolution (one channel)', q: 'count', value: 20, min: 1, int: true, tex: '\\mathrm{ppr}' },
        dt: { name: 'interval between reads', q: 'time', unit: 's', value: 0.5, tex: '\\Delta t' }
      },
      solveFor: 'w',
      note: 'Quadrature decoding gives four counts per pulse of one channel. Set the unit to rpm to read revolutions per minute.',
      stories: { w: 'An encoder with {ppr} pulses per revolution gives {n} counts in {dt}. How fast does it turn?', n: 'An encoder with {ppr} pulses per revolution turns at {w}, read every {dt}. How many counts arrive per read?' }
    }
  ],
  code: [
    {
      title: 'Read a rotary encoder with the pulse counter',
      about: 'The two encoder signals feed two PCNT channels set up for quadrature decoding, so the count rises one way and falls the other, four counts per step, without any CPU involvement. The program prints the count five times a second. The MicroPython version decodes the same signals in scheduled pin handlers, which is fine for a knob turned by hand.',
      needs: 'An ESP32 (or S2, S3, C5, C6, H2, P4: not the C3) and a rotary encoder such as the common KY-040 or EC11 type.',
      wiring: [['GPIO32', 'encoder A (CLK)', 'internal pull-up'], ['GPIO33', 'encoder B (DT)', 'internal pull-up'], ['GND', 'encoder common']],
      blocks: `
        when started
          start serial at (115200) baud
          start pulse counter unit (0): channel A = pin (32), channel B = pin (33), count all four edges :: my
          set pull-ups on pins (32) and (33) :: pins
        forever
          print (join [count ] (pulse counter value) [  (] (round down ((pulse counter value) / (4))) [ steps)])
          wait (0.2) seconds
        end
      `,
      cpp: String.raw`
        #include "driver/pulse_cnt.h"
        #include "driver/gpio.h"

        const int PIN_A = 32;                    // encoder A and B to GPIO32 and GPIO33, common pin to GND
        const int PIN_B = 33;

        pcnt_unit_handle_t unit = nullptr;

        void setup() {
          Serial.begin(115200);

          pcnt_unit_config_t unitConfig = {};
          unitConfig.low_limit = -1000;          // the count stays within this range
          unitConfig.high_limit = 1000;
          pcnt_new_unit(&unitConfig, &unit);

          pcnt_glitch_filter_config_t filter = {};
          filter.max_glitch_ns = 1000;           // ignore pulses shorter than 1 µs
          pcnt_unit_set_glitch_filter(unit, &filter);

          pcnt_channel_handle_t chanA = nullptr, chanB = nullptr;
          pcnt_chan_config_t cfgA = {};
          cfgA.edge_gpio_num = PIN_A;            // channel A counts the edges of A, steered by the level of B
          cfgA.level_gpio_num = PIN_B;
          pcnt_chan_config_t cfgB = {};
          cfgB.edge_gpio_num = PIN_B;            // channel B counts the edges of B, steered by the level of A
          cfgB.level_gpio_num = PIN_A;
          pcnt_new_channel(unit, &cfgA, &chanA);
          pcnt_new_channel(unit, &cfgB, &chanB);

          // every edge of A and of B counts, up or down according to the level of the other signal
          pcnt_channel_set_edge_action(chanA, PCNT_CHANNEL_EDGE_ACTION_DECREASE, PCNT_CHANNEL_EDGE_ACTION_INCREASE);
          pcnt_channel_set_level_action(chanA, PCNT_CHANNEL_LEVEL_ACTION_KEEP, PCNT_CHANNEL_LEVEL_ACTION_INVERSE);
          pcnt_channel_set_edge_action(chanB, PCNT_CHANNEL_EDGE_ACTION_INCREASE, PCNT_CHANNEL_EDGE_ACTION_DECREASE);
          pcnt_channel_set_level_action(chanB, PCNT_CHANNEL_LEVEL_ACTION_KEEP, PCNT_CHANNEL_LEVEL_ACTION_INVERSE);

          gpio_set_pull_mode((gpio_num_t)PIN_A, GPIO_PULLUP_ONLY);   // a bare encoder needs pull-ups
          gpio_set_pull_mode((gpio_num_t)PIN_B, GPIO_PULLUP_ONLY);

          pcnt_unit_enable(unit);
          pcnt_unit_clear_count(unit);
          pcnt_unit_start(unit);
        }

        void loop() {
          int count = 0;
          pcnt_unit_get_count(unit, &count);
          Serial.printf("count %d  (%d steps)\n", count, count / 4);
          delay(200);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        PIN_A, PIN_B = 32, 33                    # encoder A and B, common pin to GND
        a = Pin(PIN_A, Pin.IN, Pin.PULL_UP)
        b = Pin(PIN_B, Pin.IN, Pin.PULL_UP)
        count = 0
        state = (a.value() << 1) | b.value()
        STEP = {(0b00, 0b10): 1, (0b10, 0b11): 1, (0b11, 0b01): 1, (0b01, 0b00): 1,        # A leads: counts up
                (0b10, 0b00): -1, (0b11, 0b10): -1, (0b01, 0b11): -1, (0b00, 0b01): -1}    # B leads: counts down

        def on_edge(pin):                        # a scheduled (soft) handler: fine by hand, too slow for a motor
            global count, state
            new = (a.value() << 1) | b.value()
            count += STEP.get((state, new), 0)
            state = new

        a.irq(handler=on_edge, trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING)
        b.irq(handler=on_edge, trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING)

        while True:
            print("count", count, " (", count // 4, "steps )")
            time.sleep_ms(200)
      `,
      output: `
        count 0  (0 steps)
        count 8  (2 steps)
        count 12  (3 steps)
        count -4  (-1 steps)
      `,
      notes: ['The ESP32 Arduino core has no PCNT wrapper: the C++ program calls the ESP-IDF driver from the sketch. The names are those of ESP-IDF 5.x and 6.x (the old driver/pcnt.h was removed in 6.0).', 'Which way is "up" depends on how the encoder is wired: swap the two pins to reverse it.', 'The MicroPython handlers run late, so they can miss edges when the knob turns fast; the pulse counter never does.']
    }
  ],
  choose: {
    good: ['The pulse counter for encoders, tachometers, flow meters and frequency counting of anything faster than a few kilohertz', 'Quadrature decoding in hardware for motor encoders', 'A library built on the PCNT when one exists for your core'],
    avoid: ['An interrupt per edge for fast signals', 'PCNT on the ESP32-C2, C3 and C61: it is not there', 'Trusting an edge count from a mechanical contact without filtering or quadrature decoding'],
    check: ['That your chip has a unit free (8 or 4)', 'That the count cannot overflow 16 bits between reads', 'That the signals have pull-ups and stay within 0 to 3.3 V']
  },
  examples: [
    {
      title: 'Speed of a motor from an encoder',
      q: 'A motor encoder gives 20 pulses per revolution on each channel. A pulse counter in quadrature mode counts 1600 in half a second. How fast does the shaft turn?',
      steps: ['Quadrature gives 4 counts per pulse, so 80 counts per revolution.', 'In half a second the shaft turned $1600 / 80 = 20$ revolutions.', 'That is 40 revolutions per second, or 2400 revolutions per minute.'],
      a: '2400 rpm. At that speed the count would reach 16-bit range in about a second, so read it at least every few tenths of a second.'
    }
  ],
  quiz: [
    { q: 'Which chip has no pulse counter?', choices: ['ESP32', 'ESP32-S3', 'ESP32-C3', 'ESP32-C6'], a: 2, why: 'The ESP32-C3 (and the C2 and C61) has no PCNT. The ESP32 has 8 units, the S3 and C6 have 4.' },
    { q: 'A quadrature decoder counts all four edges of each encoder cycle. An encoder with 24 cycles per revolution then gives…', choices: ['24 counts', '48 counts', '96 counts', '4 counts'], a: 2, why: 'Four counts per cycle, so 24 × 4 = 96 counts for each revolution.' },
    { q: 'A mechanical encoder chatters at each step. Quadrature decoding in hardware counts the extra edges as extra steps.', a: false, why: 'A bounce moves the signals forward and back across the same edge, which adds one count and takes one away, so the net count stays correct. A plain edge counter would be fooled.' },
    { q: 'The 16-bit signed register of a PCNT unit counts a 100 kHz signal. Roughly how soon does it overflow?', choices: ['After 0.33 s', 'After 3 s', 'After 33 s', 'Never'], a: 0, why: '32 767 counts at 100 000 counts a second is about 0.33 s. Read it often, or use the limits and watch points to extend it in software.' }
  ],
  applications: [
    'Rotary encoders for knobs and menus, and the position of a motor or a wheel.',
    'Flow meters and rain gauges whose pulses come too fast for comfortable interrupts.',
    'Measuring an unknown frequency by counting edges over a fixed gate time.',
    'Tachometers and anemometers.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, *Pulse Counter (PCNT)*: units, channels, edge and level actions, glitch filter, watch points; the rotary encoder example.',
    'Espressif, *ESP32 Technical Reference Manual*, the pulse count controller chapter; the datasheets for the number of units per chip.',
    'MicroPython documentation, *machine.Pin.irq* (the soft-handler fallback used in the MicroPython version above).'
  ]
},

/* ================================================================ MCPWM */
{
  id: 'mcpwm',
  parent: 'core-peripherals',
  title: 'MCPWM: PWM for motors and power',
  level: 3,
  short: 'A PWM peripheral built for power electronics: complementary outputs with dead time for half-bridges, synchronised timers, hardware fault shutdown, pulse capture. For ordinary dimming LEDC is simpler; MCPWM is for bridges and converters. The Arduino core has no wrapper.',
  keywords: ['MCPWM', 'motor control PWM', 'dead time', 'complementary PWM', 'half-bridge', 'H-bridge', 'shoot-through', 'mcpwm_prelude.h', 'BLDC', 'brushless', 'FOC', 'fault input', 'capture', 'operator', 'comparator', 'generator', 'synchronous buck'],
  prereq: ['pwm-with-ledc', 'dc-motors-and-h-bridges'],
  related: ['brushless-motors-and-escs', 'field-oriented-control', 'motor-pwm-frequency', 'mosfets-for-loads', 'servos', 'step-pulses-and-acceleration', 'motors:h-bridge', 'electronics:h-bridge'],
  body: `**MCPWM**, motor-control pulse-width modulation, is a second PWM peripheral with a different purpose from LEDC. LEDC makes simple PWM for LEDs, fans and servos. MCPWM is built for the transistors that switch motors and power converters, and its special abilities are exactly what those circuits need: pairs of **complementary** outputs with **dead time**, several PWM signals that stay in step, a hardware **fault input** that switches the outputs off within nanoseconds, and a **capture** input that timestamps pulses.

### Why dead time matters

Picture a half-bridge: two transistors in series between the supply and ground, with the motor at the midpoint. The upper one conducts for the "on" part of the PWM, the lower one for the "off" part. Real transistors take a few hundred nanoseconds to switch off, so if the lower one is told to turn on at the instant the upper one is told to turn off, both conduct together for a moment and short the supply through themselves. This **shoot-through** wastes power every cycle and can destroy the transistors. The cure is **dead time**: a short gap, a fraction of a microsecond, in which both are off. MCPWM inserts it in hardware, at its tick resolution, on every edge. The simulation shows the overlap and what a gap does to it.

> [!warn] A bridge without enough dead time shorts the supply on every edge. Test any new bridge circuit from a current-limited bench supply at low voltage first, never straight from a battery pack, and never from a lithium cell, which can deliver enough current to start a fire.

### What is inside

A unit has timers, operators and generators: a **timer** counts, an **operator** compares the count with values you set (comparators), and a **generator** turns the compare events into output edges, high at the start of the period and low at the compare value for plain PWM. Operators give two outputs each, A and B, and the dead-time block sits between a generator and the pin. Capture channels timestamp edges, which suits the Hall sensors of brushless motors.

### Which chips

| Chip | MCPWM units |
|---|---|
| ESP32, ESP32-S3, ESP32-P4 | 2 |
| ESP32-C5, C6, H2 | 1 |
| ESP32-S2, C3, C2, C61 | none |

### Using it from a program

The Arduino core has no MCPWM wrapper; the sketch calls the ESP-IDF driver (\`driver/mcpwm_prelude.h\`), as the program below does. The ESP32Servo library can use MCPWM channels on the S3 by itself. MicroPython has no MCPWM class: its \`PWM\` uses the LEDC.

Do you need it? Integrated motor driver chips such as the TB6612 and DRV8833 protect against shoot-through themselves, so LEDC is enough for them. MCPWM earns its place with discrete MOSFET half-bridges, brushless motors ([[field-oriented-control]]) and synchronous converters.

> [!key] MCPWM makes complementary PWM outputs with dead time in hardware, so the two switches of a half-bridge are never on together, and adds synchronisation, fault shutdown and capture. Use LEDC for LEDs and fans, MCPWM for bridges and brushless motors; the C3, S2, C2 and C61 do not have it.`,
  ideas: [
    'MCPWM is PWM for power electronics: complementary outputs, dead time, synchronised timers, a hardware fault input and pulse capture.',
    'Dead time keeps the two switches of a half-bridge from conducting together (shoot-through) while one turns off and the other on.',
    'A timer counts, comparators set the compare values, generators turn events into edges; dead time sits between a generator and the pin.',
    'The ESP32, S3 and P4 have two units, the C5, C6 and H2 one, the S2, C3, C2 and C61 none; the Arduino core has no wrapper, so a sketch uses the ESP-IDF driver.'
  ],
  pitfalls: [
    'Two LEDC channels, one inverted, make a half-bridge signal — With no dead time both outputs overlap or both gaps are unpredictable, and the switches conduct together. Use MCPWM or a driver with built-in dead time.',
    'MCPWM replaces LEDC everywhere — It is more complicated and exists on fewer chips. For LEDs, fans and servos LEDC is the simple, portable choice.',
    'Dead time can be left to the MOSFET driver and the software — Only if the driver chip documents built-in dead time. Check the datasheet: many bare gate drivers have none.'
  ],
  terms: [
    { term: 'MCPWM', also: ['motor control PWM'], def: 'The ESP32 peripheral for power electronics: complementary PWM with dead time, synchronised timers, fault inputs and capture. The ESP32, S3 and P4 have two units, the C5, C6 and H2 one.' },
    { term: 'Dead time', also: ['dead-band', 'deadtime'], def: 'A short gap after one switch of a half-bridge turns off and before the other turns on, in which both are off. It prevents shoot-through while the transistors are still switching.' },
    { term: 'Shoot-through', also: ['cross-conduction', 'bridge shoot-through'], def: 'The fault in which both transistors of a half-bridge conduct at once and short the supply through themselves. It wastes power and can destroy the transistors.' },
    { term: 'Complementary PWM', also: ['complementary outputs', 'half-bridge drive'], def: 'Two PWM outputs that are the inverse of each other, one for the upper and one for the lower switch of a half-bridge, with dead time between the transitions.' },
    { term: 'Fault input', also: ['trip zone', 'emergency stop input'], def: 'A pin that, when it goes active, forces the PWM outputs to a safe state within nanoseconds without any software, for instance when a current-sense comparator trips.' }
  ],
  sim: 'cr-mcpwm',
  formulas: [
    {
      name: 'Share of the period lost to dead time',
      expr: 'loss = 2 * td * f',
      tex: 'D_{\\mathrm{dead}} = 2\\,t_{d}\\,f',
      vars: {
        loss: { name: 'fraction of the period', q: 'ratio', tex: 'D_{\\mathrm{dead}}' },
        td: { name: 'dead time per edge', q: 'time', unit: 'ns', value: 500, tex: 't_{d}' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20, tex: 'f' }
      },
      solveFor: 'loss',
      note: 'Each period has two edges, each with its own gap. The duty cycle you ask for can only be reached within this much.',
      stories: { loss: 'A half-bridge runs at {f} with {td} of dead time on each edge. What fraction of every period is dead time?' }
    }
  ],
  code: [
    {
      title: 'A complementary PWM pair with dead time',
      about: 'Two pins carry a 20 kHz PWM at 30 % duty: the first drives the upper switch of a half-bridge, the second is its inverse for the lower switch, and both edges of each get 500 ns of dead time. A scope on the two pins shows a gap between the pulses.',
      needs: 'An ESP32, ESP32-S3, C5, C6, H2 or P4 (not the S2, C3, C2 or C61), an oscilloscope or logic analyser. No power stage is needed to see the signals: do not connect a motor or battery to a bridge until the signals are checked.',
      wiring: [['GPIO18', 'high-side gate driver input', 'or a scope probe'], ['GPIO19', 'low-side gate driver input', 'or a scope probe'], ['GND', 'scope ground']],
      blocks: `
        when started
          create an MCPWM timer: tick (100) ns, period (500) ticks :: my
          create a comparator with the value (150) ticks :: my
          make the first output high at the start of each period and low at the comparator :: my
          make the second output the inverse of the first :: my
          add dead time (5) ticks, 500 ns, to both edges :: my
          start the timer :: my
      `,
      cpp: String.raw`
        #include "driver/mcpwm_prelude.h"

        const int PIN_HIGH = 18;                 // upper switch
        const int PIN_LOW = 19;                  // lower switch: the inverse, with dead time
        const uint32_t RESOLUTION_HZ = 10000000; // timer tick = 100 ns
        const uint32_t PERIOD_TICKS = 500;       // 500 ticks = 50 µs = 20 kHz
        const uint32_t DUTY_TICKS = 150;         // 30 % duty
        const uint32_t DEAD_TICKS = 5;           // 500 ns of dead time on each edge

        void setup() {
          mcpwm_timer_handle_t timer = nullptr;
          mcpwm_timer_config_t timerCfg = {};
          timerCfg.group_id = 0;
          timerCfg.clk_src = MCPWM_TIMER_CLK_SRC_DEFAULT;
          timerCfg.resolution_hz = RESOLUTION_HZ;
          timerCfg.count_mode = MCPWM_TIMER_COUNT_MODE_UP;
          timerCfg.period_ticks = PERIOD_TICKS;
          mcpwm_new_timer(&timerCfg, &timer);

          mcpwm_oper_handle_t oper = nullptr;
          mcpwm_operator_config_t operCfg = {};
          operCfg.group_id = 0;
          mcpwm_new_operator(&operCfg, &oper);
          mcpwm_operator_connect_timer(oper, timer);

          mcpwm_cmpr_handle_t cmp = nullptr;
          mcpwm_comparator_config_t cmpCfg = {};
          cmpCfg.flags.update_cmp_on_tez = true;   // new compare values take effect at the start of a period
          mcpwm_new_comparator(oper, &cmpCfg, &cmp);
          mcpwm_comparator_set_compare_value(cmp, DUTY_TICKS);

          mcpwm_gen_handle_t genHigh = nullptr, genLow = nullptr;
          mcpwm_generator_config_t genCfg = {};
          genCfg.gen_gpio_num = PIN_HIGH;
          mcpwm_new_generator(oper, &genCfg, &genHigh);
          genCfg.gen_gpio_num = PIN_LOW;
          mcpwm_new_generator(oper, &genCfg, &genLow);

          // the first output: high when the period starts, low when the timer reaches the compare value
          mcpwm_gen_timer_event_action_t atStart = { MCPWM_TIMER_DIRECTION_UP, MCPWM_TIMER_EVENT_EMPTY, MCPWM_GEN_ACTION_HIGH };
          mcpwm_generator_set_action_on_timer_event(genHigh, atStart);
          mcpwm_gen_compare_event_action_t atCompare = { MCPWM_TIMER_DIRECTION_UP, cmp, MCPWM_GEN_ACTION_LOW };
          mcpwm_generator_set_action_on_compare_event(genHigh, atCompare);

          // dead time: delay the rising edge of the first output, and make the second the delayed inverse of it
          mcpwm_dead_time_config_t dt = {};
          dt.posedge_delay_ticks = DEAD_TICKS;
          dt.negedge_delay_ticks = 0;
          mcpwm_generator_set_dead_time(genHigh, genHigh, &dt);
          dt.posedge_delay_ticks = 0;
          dt.negedge_delay_ticks = DEAD_TICKS;
          dt.flags.invert_output = true;
          mcpwm_generator_set_dead_time(genHigh, genLow, &dt);

          mcpwm_timer_enable(timer);
          mcpwm_timer_start_stop(timer, MCPWM_TIMER_START_NO_STOP);
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no MCPWM class: machine.PWM is built on the LEDC, which has no dead time. Two LEDC pins, one inverted, would overlap or leave unpredictable gaps, so a half-bridge needs a driver with built-in dead time or C code.' },
      notes: ['The Arduino core has no MCPWM wrapper: the sketch calls the ESP-IDF driver. The names are those of ESP-IDF 5.x and 6.x (the old driver/mcpwm.h was removed in 6.0).', 'To change the duty while running, call mcpwm_comparator_set_compare_value() with a new value; with update_cmp_on_tez it takes effect at the next period start.', 'The two outputs here have to be level-shifted to the gate drivers you use, and the gate driver and the transistors must be sized for the supply: see [[mosfets-for-loads]] and [[dc-motors-and-h-bridges]].']
    }
  ],
  choose: {
    good: ['Discrete MOSFET half-bridges and full bridges where you must supply the dead time', 'Brushless motors (six-step, field-oriented control) and synchronous converters', 'Anything that needs several PWM signals locked in phase, or a hardware over-current shutdown'],
    avoid: ['MCPWM for LED dimming, fans, buzzers and servos: LEDC is simpler and exists on every chip', 'A bridge built from separate LEDC outputs without dead time', 'MCPWM on the ESP32-S2, C3, C2 and C61: it is not there'],
    check: ['That your chip has MCPWM and that the units are not taken', 'The turn-off delay of your transistors against the dead time you set', 'That a fault or over-current input is wired if the load could stall']
  },
  examples: [
    {
      title: 'What does dead time cost?',
      q: 'A half-bridge runs at 20 kHz with 500 ns of dead time on each edge. How much of each period is dead, and what is the largest duty cycle available if the gap must stay between the pulses?',
      steps: ['One period is 50 µs and has two edges, each with 500 ns of dead time: 1 µs in all.', 'The fraction is $1\\ \\mu s / 50\\ \\mu s = 2$ %.', 'The upper switch can therefore be on for at most 98 % of the period, less the gap after its own turn-off.'],
      a: '2 % of every period is dead time, so the duty cycle tops out at about 98 %. At 100 kHz the same dead time would cost 10 %.'
    }
  ],
  quiz: [
    { q: 'What problem does dead time solve?', choices: ['Noise on the motor supply', 'Both transistors of a half-bridge conducting at once while one turns off and the other on', 'The 16-bit limit of the timer', 'Contact bounce'], a: 1, why: 'Transistors switch off more slowly than a logic signal changes. A gap in which both are off guarantees they are never on together, which would short the supply.' },
    { q: 'Which chip has no MCPWM?', choices: ['ESP32', 'ESP32-S3', 'ESP32-C3', 'ESP32-C6'], a: 2, why: 'The ESP32-C3 (and the S2, C2 and C61) has no MCPWM. The ESP32 and S3 have two units, the C6 one.' },
    { q: 'You dim an LED strip. Which PWM peripheral should you use?', choices: ['MCPWM', 'LEDC', 'The RMT', 'The pulse counter'], a: 1, why: 'LEDC is the simple, portable PWM, present on every chip, and exactly meant for LEDs, fans and servos. MCPWM is for bridges and motor drives.' },
    { q: 'In MicroPython, two machine.PWM pins, one inverted, are a safe way to drive a half-bridge.', a: false, why: 'machine.PWM uses the LEDC, which has no dead time between complementary outputs. The two switches could conduct together and short the supply.' }
  ],
  applications: [
    'Brushless motor drives (six-step and field-oriented control).',
    'Discrete MOSFET H-bridges for large DC motors.',
    'Synchronous buck and boost converters, and solar or battery chargers.',
    'Measuring the pulse width of Hall sensors or servo signals with capture.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, *Motor Control Pulse Width Modulator (MCPWM)*: timers, operators, comparators, generators, dead time, fault and capture.',
    'Espressif, *ESP32 Technical Reference Manual*, the motor control PWM chapter.',
    'MicroPython documentation, *machine.PWM* (LEDC-based) and the ESP32 quick reference, for what MicroPython offers instead.'
  ]
},

/* ================================================================ watchdogs */
{
  id: 'watchdogs',
  parent: 'core-peripherals',
  title: 'Watchdogs',
  level: 2,
  short: 'A timer that resets the chip unless the program keeps telling it that all is well. The ESP32 has a task watchdog, an interrupt watchdog and an RTC watchdog. The skill is feeding the right one from the right place, and not switching it off when it bites.',
  keywords: ['watchdog', 'WDT', 'task watchdog', 'TWDT', 'interrupt watchdog', 'IWDT', 'RTC watchdog', 'esp_task_wdt_reset', 'esp_task_wdt_add', 'machine.WDT', 'feed', 'kick', 'reset reason', 'ESP_RST_TASK_WDT', 'WDT_RESET', 'hang', 'timeout'],
  prereq: ['interrupts', 'hardware-timers', 'reset-reasons'],
  related: ['watchdog-resets', 'guru-meditation-and-backtraces', 'tasks', 'priorities-and-scheduling', 'delays-and-yielding', 'reliability-in-the-field', 'brownout', 'fault-finding-method'],
  body: `A program that hangs, stuck in a loop, waiting for a part that never answers, deadlocked on a lock, does nothing at all, and a device in a ceiling or on a mast cannot be reset by hand. A **watchdog** is a timer that resets the chip unless the program keeps telling it that all is well. The program **feeds** the watchdog; if it fails to within the timeout, the dog bites and the chip restarts into a known state.

### The ESP32's three watchdogs

- **The task watchdog (TWDT)** watches tasks. The idle task of each core is subscribed to it from the start, so a task that hogs a core for several seconds (the default is 5 s), and starves the idle task, brings it down. The message names the tasks that did not report; you can subscribe your own.
- **The interrupt watchdog (IWDT)** checks that the system's heartbeat, the RTOS tick interrupt, keeps running. It fires, within a fraction of a second, when interrupts are blocked too long: an ISR that runs and runs, or a critical section that never ends.
- **The RTC watchdog (RWDT)** lives in the RTC domain, outside the main system, and is the last line of defence. The bootloader uses it so that a hang during start-up still ends in a reset.

### What a watchdog reset looks like

On the serial monitor, a task watchdog prints \`Task watchdog got triggered. The following tasks/users did not reset the watchdog in time:\`, lists the tasks, often with a register dump, and the chip reboots. An interrupt watchdog is a Guru Meditation error whose message says \`Interrupt wdt timeout\` ([[guru-meditation-and-backtraces]]). After the reboot the program can ask why: \`esp_reset_reason()\` returns \`ESP_RST_TASK_WDT\` or \`ESP_RST_INT_WDT\`, and MicroPython's \`machine.reset_cause()\` returns \`machine.WDT_RESET\`.

### Feed it properly

A watchdog is only worth something if it catches a real hang. Feed it from the place that proves the *work* is going on: at the end of the main loop pass, after the sensor was read and the message sent. Three habits defeat it:

1. **Feeding from a timer or a separate task.** It keeps feeding while the main logic is dead, so the dog never bites.
2. **A huge timeout**, so that the dog bites after the damage is done.
3. **Switching it off** because it bit. It bit because something hung; find that ([[watchdog-resets]]).

A long job that really takes seconds is fed in the middle of the job, or its task gets a longer timeout.

### In a program

In Arduino the task watchdog is already running; the first program below reconfigures it and subscribes the sketch's own task with the ESP-IDF calls \`esp_task_wdt_reconfigure\`, \`esp_task_wdt_add\` and \`esp_task_wdt_reset\`. In MicroPython, \`WDT(timeout=ms)\` starts one that cannot be stopped, and \`wdt.feed()\` feeds it. In the simulation you can hang a program and try each way of feeding.

> [!key] A watchdog resets the chip when the program stops feeding it. Feed it from the main loop, after the work is done, never from a timer; do not switch it off or lengthen it to hide a hang, and read the reset reason after the reboot.`,
  ideas: [
    'A watchdog resets the chip unless the program feeds it within the timeout, so a hung device recovers on its own.',
    'The task watchdog catches a task that hogs the CPU, the interrupt watchdog catches interrupts that stay blocked, the RTC watchdog backs up the boot.',
    'Feed it from the main loop after the work has been done; feeding from a timer or a second task defeats the purpose.',
    'After a reboot the program can read the reason: ESP_RST_TASK_WDT in C++, machine.WDT_RESET in MicroPython.'
  ],
  pitfalls: [
    'A timer that feeds the watchdog makes the device safe — It makes the watchdog useless: the timer keeps feeding while the program is hung. Feed from the work itself.',
    'The watchdog keeps resetting my board, so I will switch it off — It is telling you that a task hogs the CPU or an interrupt blocks. Find the busy loop, the missing delay or the long ISR; disabling it removes the symptom and keeps the fault.',
    'The interrupt watchdog and the task watchdog are the same thing — The task watchdog fires when a task starves the idle task for seconds; the interrupt watchdog fires when interrupts are blocked for a fraction of a second. Their messages and their causes differ.'
  ],
  terms: [
    { term: 'Watchdog', also: ['WDT', 'watchdog timer'], def: 'A timer that restarts the chip when the program does not feed it in time. It turns a hang that would otherwise last for ever into a reboot.' },
    { term: 'Task watchdog', also: ['TWDT', 'task_wdt'], def: 'The ESP-IDF watchdog that checks that subscribed tasks, by default the idle task of each core, report within a timeout of several seconds. Its message names the tasks that did not.' },
    { term: 'Interrupt watchdog', also: ['IWDT', 'Interrupt wdt timeout'], def: 'A watchdog fed by the RTOS tick interrupt. It resets the chip when interrupts are blocked for too long, for instance by a very long interrupt handler or critical section.' },
    { term: 'Feeding the watchdog', also: ['kicking', 'petting', 'esp_task_wdt_reset', 'wdt.feed()'], def: 'Telling the watchdog that the program is alive, which restarts its countdown. It should be done where the useful work is completed.' },
    { term: 'RTC watchdog', also: ['RWDT'], def: 'A watchdog in the RTC domain of the chip that works outside the main system. The bootloader uses it so that a hang during start-up ends in a reset.' }
  ],
  sim: 'cr-watchdog',
  code: [
    {
      title: 'Feed the watchdog from the loop (and starve it on purpose)',
      about: 'The sketch or script watches itself with a 3-second watchdog and feeds it once per pass. After the fifth pass it stops feeding on purpose, and three seconds later the chip resets, as it would for a real hang.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start watchdog with a timeout of (3) seconds, watching this program :: power
          set [pass v] to (0)
        forever
          change [pass v] by (1)
          print (join [pass ] (pass))
          wait (0.5) seconds
          if <(pass) < (6)> then
            feed the watchdog :: power
          end
        end
      `,
      cpp: String.raw`
        #include <esp_task_wdt.h>

        const uint32_t TIMEOUT_MS = 3000;

        void setup() {
          Serial.begin(115200);
          esp_task_wdt_config_t config = {};
          config.timeout_ms = TIMEOUT_MS;
          config.idle_core_mask = 0;               // leave the idle tasks out: watch only what is added below
          config.trigger_panic = true;             // reset the chip when the time is up
          if (esp_task_wdt_reconfigure(&config) != ESP_OK) {   // the core has started it already: change it
            esp_task_wdt_init(&config);                        // or start it, if it was not running
          }
          esp_task_wdt_add(NULL);                  // watch this task, the one that runs loop()
        }

        void loop() {
          static uint32_t pass = 0;
          pass++;
          Serial.printf("pass %lu\n", (unsigned long)pass);
          delay(500);                              // the real work goes here
          if (pass < 6) {
            esp_task_wdt_reset();                  // feed: I am still alive
          }                                        // after pass 5 we stop on purpose: the chip resets
        }
      `,
      py: String.raw`
        from machine import WDT
        import time

        wdt = WDT(timeout=3000)                    # 3 s; once started it cannot be stopped
        n = 0
        while True:
            n += 1
            print("pass", n)
            time.sleep_ms(500)                     # the real work goes here
            if n < 6:
                wdt.feed()                         # feed: I am still alive
                                                   # after pass 5 we stop on purpose: the chip resets
      `,
      output: `
        pass 4
        pass 5
        pass 6
        pass 7
        E (…) task_wdt: Task watchdog got triggered. The following tasks/users did not reset the watchdog in time:
        E (…) task_wdt:  - loopTask (CPU 1)
        …                       (a register dump, then the reboot)
      `,
      notes: ['The exact wording and the register dump differ between ESP-IDF versions; the line that starts task_wdt and names the task is the part to look for.', 'In a real program the feed goes at the end of a pass in which the work succeeded: for example after the sensor was read and the reply sent, not at the top of the loop.']
    },
    {
      title: 'Why did the chip restart?',
      about: 'Prints the reason for the last restart at start-up, so that a watchdog reset, a power cut, a crash or a wake from deep sleep can be told apart. Log it from every product that must run unattended.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          wait (0.5) seconds
          print (join [Last restart: ] (restart reason))
      `,
      cpp: String.raw`
        #include <esp_system.h>

        const char *reasonName(esp_reset_reason_t r) {
          switch (r) {
            case ESP_RST_POWERON:   return "power on";
            case ESP_RST_SW:        return "software restart";
            case ESP_RST_PANIC:     return "crash (panic)";
            case ESP_RST_INT_WDT:   return "interrupt watchdog";
            case ESP_RST_TASK_WDT:  return "task watchdog";
            case ESP_RST_WDT:       return "another watchdog";
            case ESP_RST_DEEPSLEEP: return "woke from deep sleep";
            case ESP_RST_BROWNOUT:  return "brown-out (the supply dipped)";
            default:                return "other";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(500);
          Serial.printf("Last restart: %s\n", reasonName(esp_reset_reason()));
        }

        void loop() {}
      `,
      py: String.raw`
        import machine
        import time

        time.sleep_ms(500)
        NAMES = {
            machine.PWRON_RESET: "power on",
            machine.HARD_RESET: "reset button or hardware reset",
            machine.WDT_RESET: "watchdog",
            machine.DEEPSLEEP_RESET: "woke from deep sleep",
            machine.SOFT_RESET: "software restart",
        }
        print("Last restart:", NAMES.get(machine.reset_cause(), "other"))
      `,
      output: `
        Last restart: task watchdog
      `,
      notes: ['MicroPython groups the causes more coarsely than ESP-IDF: it reports WDT_RESET for any watchdog, and has no separate brown-out or panic value.', 'Save the reason in NVS or send it with the next report, and count how often it happens: a watchdog that fires once a month is a bug to find, one that fires every hour is an emergency. See [[reset-reasons]].']
    }
  ],
  choose: {
    good: ['The task watchdog on your main task for any device that must run unattended', 'The default idle-task watching left on, to catch busy loops that starve the system', 'Logging the reset reason at every start-up'],
    avoid: ['Feeding from a timer, an interrupt or a task that does not do the real work', 'Disabling the watchdog, or setting a very long timeout, to silence a reset', 'Feeding at the top of a loop that can hang further down'],
    check: ['That every blocking call in the loop returns, or times out, within the watchdog time', 'That several tasks are each subscribed and each feeds', 'What the device does after a restart: that it comes up in a safe state']
  },
  examples: [
    {
      title: 'Setting the timeout',
      q: 'A loop reads a sensor over I2C and sends a message over Wi-Fi once every pass. A normal pass takes 0.4 s; a slow Wi-Fi reconnection can take up to 8 s, and you want a hang to be caught within a minute at the latest. What timeout would you choose?',
      steps: ['The timeout must be longer than the slowest normal pass, here 8 s, or the dog bites at every reconnection.', 'It must be short enough to meet the limit: a hang is caught after one timeout, so anything up to 60 s will do.', 'Choose 15 s: nearly twice the slowest normal pass, well inside a minute. A tighter loop can be given a shorter timeout by feeding at several places.'],
      a: 'About 15 seconds: longer than the slowest legitimate pass, shorter than the time you can tolerate a hang.'
    }
  ],
  quiz: [
    { q: 'loop() contains a bug that makes it wait for ever on a signal. Where must the watchdog be fed so that it catches this?', choices: ['In a timer interrupt every second', 'At the end of each pass of loop(), after the work', 'At the start of setup()', 'In a separate task that sleeps'], a: 1, why: 'The feed must depend on the work being done. A feed from a timer or a separate task carries on while loop() is stuck, so the watchdog never fires.' },
    { q: 'The watchdog is fed by a timer interrupt every second. The main program freezes. What happens?', choices: ['The chip resets after the timeout', 'Nothing: the timer keeps feeding it, so the freeze goes on for ever', 'The interrupt watchdog takes over', 'The program restarts itself'], a: 1, why: 'A feed that does not depend on the main program tells the watchdog that everything is fine, so it never bites. It is the commonest way to waste a watchdog.' },
    { q: 'An interrupt handler that runs for a long time is caught by the task watchdog.', a: false, why: 'The interrupt watchdog catches blocked interrupts, within a fraction of a second. The task watchdog fires when a task starves the idle task for several seconds.' },
    { q: 'After an unexplained restart, how does a program find out that a watchdog caused it?', choices: ['It cannot', 'esp_reset_reason() in C++, machine.reset_cause() in MicroPython', 'By reading the strapping pins', 'By counting millis()'], a: 1, why: 'The chip records why it reset. esp_reset_reason() gives ESP_RST_TASK_WDT or ESP_RST_INT_WDT; MicroPython gives machine.WDT_RESET.' }
  ],
  applications: [
    'Unattended sensors, gateways and controllers that nobody can reset by hand.',
    'Recovering from a hung I2C bus or a sensor that stops answering.',
    'Guarding an OTA update or a start-up phase that could hang.',
    'Keeping a record of how often a device in the field has had to restart.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, *Watchdogs*: the interrupt watchdog and the task watchdog, and the API for subscribing and feeding.',
    'MicroPython documentation, *machine.WDT* and *machine.reset_cause* (version 1.29).',
    'Espressif, *ESP32 Technical Reference Manual*, the chapters on the timer groups and the RTC watchdog; *ESP32 Series Datasheet*.'
  ]
},

/* ================================================================ random numbers and chip identity */
{
  id: 'random-numbers-and-chip-identity',
  parent: 'core-peripherals',
  title: 'Random numbers, MAC address, chip identity',
  level: 1,
  short: 'A hardware generator for numbers nobody can predict, and a factory-burned 48-bit address that names this one chip. Both are useful, and both come with a warning: the random numbers are only truly random with the radio running, and the address is a name, not a password.',
  keywords: ['random', 'esp_random', 'esp_fill_random', 'os.urandom', 'random()', 'RNG', 'true random', 'MAC address', 'getEfuseMac', 'unique_id', 'chip ID', 'device ID', 'chip model', 'getChipModel', 'eFuse', 'serial number', 'entropy'],
  prereq: ['chip-module-board', 'first-program-blink'],
  related: ['efuses', 'device-identity-and-provisioning', 'credentials-handling', 'esp-now-peers-and-addresses', 'clones-and-counterfeits', 'tls-on-esp', 'secure-provisioning'],
  body: `Two small things nearly every project needs and few think about until they matter: a number that nobody can predict, and a name that is unique to this one chip.

### Random numbers

The ESP32 has a hardware random number generator. In C++ \`esp_random()\` returns 32 random bits and \`esp_fill_random(buffer, n)\` fills a block of bytes; Arduino's \`random()\` draws on it too. In MicroPython \`os.urandom(n)\` returns n random bytes from the hardware, while the \`random\` module is an ordinary pseudo-random generator seeded from the hardware at start-up. That is perfect for dice, shuffles, retry delays with random back-off, and anything where nobody is trying to guess.

The warning: the hardware numbers are *truly* random only while an entropy source is running, which means the **radio** (Wi-Fi or Bluetooth switched on) or the ADC's noise source, or the bootloader's own early use of it. With the radio off the generator is weaker. For the keys, tokens and nonces of anything security-related, generate them while the radio is on, or let the TLS library draw its own randomness; never build keys from \`random()\` in MicroPython or from \`millis()\` ([[tls-on-esp]], [[secure-provisioning]]).

### Chip identity

Every chip leaves the factory with a **MAC address**, 48 bits burned into its eFuses ([[efuses]]), unique to the chip. In Arduino \`ESP.getEfuseMac()\` returns it as a 64-bit number whose lowest byte is the first byte of the address, so printing it as hex shows the bytes in reverse. MicroPython's \`machine.unique_id()\` returns the six bytes in the right order. From this base address the chip derives the addresses of its Wi-Fi station, its access point, Bluetooth and Ethernet.

The same API tells you the rest: \`ESP.getChipModel()\`, \`ESP.getChipRevision()\`, \`ESP.getChipCores()\`, \`ESP.getCpuFreqMHz()\` and \`ESP.getFlashChipSize()\`; in MicroPython \`sys.implementation._machine\`, \`machine.freq()\` and \`esp.flash_size()\`. Run them on any board of doubtful origin: a flash size that differs from the listing is the commonest sign of a relabelled part ([[clones-and-counterfeits]]).

### Using the address as a name

The last three bytes of the MAC make a good short, unique name: \`esp-3c71bf\` for the hostname, the MQTT client ID or the Bluetooth name. It is a **name, not a secret**: addresses are broadcast over the air in every Wi-Fi frame and can be copied, so a MAC address is never a password or proof of identity ([[device-identity-and-provisioning]], [[credentials-handling]]).

> [!key] \`esp_random()\` and \`os.urandom()\` give hardware random numbers, truly random only with the radio on, so build keys with the TLS library or while it runs. The MAC address, read from the eFuses, is a unique name for the chip, not a password.`,
  ideas: [
    'esp_random() and esp_fill_random() in C++ and os.urandom() in MicroPython read the hardware random number generator.',
    'The hardware numbers are truly random only while the radio, or another noise source, is running; keys and tokens need that.',
    'MicroPython\'s random module is pseudo-random, seeded from the hardware: fine for games, not for secrets.',
    'The factory MAC address is a unique name for the chip, good for hostnames and IDs, but never a secret.'
  ],
  pitfalls: [
    'random() gives secure random numbers — It is fine for dice and shuffles but not for keys or tokens, particularly in MicroPython where the random module is pseudo-random. Use os.urandom() or the TLS library with the radio on.',
    'Printing ESP.getEfuseMac() in hex shows the MAC address — It shows it with the bytes reversed, since the first byte of the address is the lowest byte of the number. Print the bytes one by one, from the lowest.',
    'A unique MAC address makes a good password — Addresses are public: every Wi-Fi frame carries them and they can be copied. Use the MAC as a name and give the device a separate secret.'
  ],
  terms: [
    { term: 'MAC address', also: ['base MAC', 'hardware address', 'unique_id'], def: 'A 48-bit address burned into the chip at the factory and unique to it. The Wi-Fi station, access point, Bluetooth and Ethernet addresses are derived from it. It names the chip; it does not prove who is using it.' },
    { term: 'Hardware random number generator', also: ['RNG', 'TRNG', 'esp_random'], def: 'A circuit that produces random bits from physical noise. On the ESP32 it is truly random only while the radio or another noise source is running; otherwise it is weaker.' },
    { term: 'Entropy', also: ['entropy source', 'randomness'], def: 'The unpredictability that a random number generator draws on: physical noise that nobody can know or repeat. Without enough entropy, numbers can be guessed.' },
    { term: 'Pseudo-random generator', also: ['PRNG', 'random module'], def: 'A formula that produces a long sequence of numbers that look random from a starting seed. The same seed gives the same sequence, so it must not be used for keys.' },
    { term: 'Chip revision', also: ['silicon revision', 'getChipRevision'], def: 'The version of the silicon die of a chip model. It changes when errors are fixed; some features and errata apply only to certain revisions.' }
  ],
  code: [
    {
      title: 'Identity and random numbers',
      about: 'Prints the chip model, its MAC address in the usual order, a hardware random number, a random 16-byte token and a dice roll.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [MAC: ] (MAC address))
          print (join [A hardware random number: ] (hardware random number))
          print (join [A random token: ] (16 random bytes as hex))
          print (join [A dice roll: ] (random (1) to (6)))
      `,
      cpp: String.raw`
        #include <esp_random.h>

        void setup() {
          Serial.begin(115200);
          delay(500);

          uint64_t mac = ESP.getEfuseMac();                  // the factory address: unique to this chip
          Serial.printf("Chip: %s, revision %d\n", ESP.getChipModel(), ESP.getChipRevision());
          Serial.print("MAC:  ");
          for (int i = 0; i < 6; i++) {
            Serial.printf("%02X%s", (uint8_t)(mac >> (8 * i)), i < 5 ? ":" : "\n");   // the first byte is the lowest
          }

          Serial.printf("A hardware random number: %lu\n", (unsigned long)esp_random());
          uint8_t token[16];
          esp_fill_random(token, sizeof(token));             // 16 random bytes for a token or a nonce
          Serial.print("A random token: ");
          for (int i = 0; i < 16; i++) Serial.printf("%02x", token[i]);
          Serial.println();
          Serial.printf("A dice roll: %ld\n", random(1, 7)); // 1 … 6
        }

        void loop() {}
      `,
      py: String.raw`
        import binascii
        import machine
        import os
        import random
        import sys

        print("Chip:", sys.implementation._machine)
        print("MAC: ", binascii.hexlify(machine.unique_id(), ":").decode())    # the factory address: unique to this chip
        print("A hardware random number:", int.from_bytes(os.urandom(4), "little"))
        print("A random token:", binascii.hexlify(os.urandom(16)).decode())    # 16 random bytes for a token or a nonce
        print("A dice roll:", random.randint(1, 6))                            # 1 … 6
      `,
      output: `
        Chip: ESP32-S3, revision 0
        MAC:  7C:DF:A1:B2:C3:D4
        A hardware random number: 2914883707
        A random token: 4c9e0b57d1a3f68a2e5b90c7413df852
        A dice roll: 4
      `,
      notes: ['The values will of course differ on your board and on each run.', 'For a keys-and-secrets purpose generate the bytes while Wi-Fi or Bluetooth is running, or use the library that wraps the hardware generator: see [[secure-provisioning]].', 'The dice roll comes from random() in C++ (backed by the hardware) and from the pseudo-random random module in MicroPython: both are fine for a game.']
    }
  ],
  examples: [
    {
      title: 'A name for the device',
      q: 'A board has the MAC address 7C:DF:A1:B2:C3:D4. Make a hostname and say what ESP.getEfuseMac() would print with %012llX.',
      steps: ['The last three bytes are B2:C3:D4, so a short, unique hostname is esp-b2c3d4.', 'getEfuseMac returns the first byte of the address in the lowest 8 bits of the number.', 'Printed as one hex number the bytes come out reversed: D4C3B2A1DF7C.'],
      a: 'Hostname esp-b2c3d4; the raw number prints as D4C3B2A1DF7C, the address backwards.'
    }
  ],
  quiz: [
    { q: 'You need a 16-byte secret for a device on a home network. Which of these is the right source?', choices: ['random.randint in MicroPython', 'os.urandom(16), with Wi-Fi on', 'millis() hashed twice', 'The MAC address'], a: 1, why: 'os.urandom reads the hardware generator, which is truly random while the radio runs. The random module is pseudo-random; millis() and the MAC address are guessable.' },
    { q: 'ESP.getEfuseMac() is printed with %012llX and shows D4C3B2A1DF7C. What is the MAC address?', choices: ['D4:C3:B2:A1:DF:7C', '7C:DF:A1:B2:C3:D4', 'D4C3B2A1DF7C is the address', 'It cannot be known'], a: 1, why: 'The first byte of the address is the lowest byte of the number, so the printed bytes come out reversed. The address is 7C:DF:A1:B2:C3:D4.' },
    { q: 'A MAC address is unique to the chip, so it is a good password.', a: false, why: 'The address is sent in clear in every Wi-Fi frame and can be copied. It names a device; it proves nothing about who is using it.' },
    { q: 'When is the ESP32\'s hardware random number generator truly random?', choices: ['Always', 'Only while Wi-Fi or Bluetooth (or another noise source) is running', 'Only in deep sleep', 'Never: it is pseudo-random'], a: 1, why: 'The generator relies on physical noise, which the radio provides. With the radio off its output has less entropy, so do not generate keys then.' }
  ],
  applications: [
    'Naming a device: hostname, MQTT client ID and Bluetooth name derived from the MAC address.',
    'Random back-off in retries so that many devices do not retry in step.',
    'Nonces, session tokens and keys generated on the device itself.',
    'Checking a board against its listing: model, revision, cores and flash size.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, *Random Number Generation* (esp_random, esp_fill_random) and *MAC Address Allocation*.',
    'Arduino core for ESP32 documentation, the *ESP* class: getChipModel, getEfuseMac and related functions (core 3.3).',
    'MicroPython documentation, *machine.unique_id*, *os.urandom* and the *esp* module (version 1.29).'
  ]
},

/* ================================================================ internal temperature sensor */
{
  id: 'internal-temperature-sensor',
  parent: 'core-peripherals',
  title: 'The internal temperature sensor',
  level: 1,
  short: 'A small sensor inside the chip that measures the temperature of the silicon, not of the room. It is for watching how hot the chip itself gets. The original ESP32 has no supported one.',
  keywords: ['temperature sensor', 'temperatureRead', 'mcu_temperature', 'die temperature', 'chip temperature', 'internal sensor', 'self-heating', 'thermal', 'overheating', 'temperature_sensor.h', 'junction temperature'],
  prereq: ['analog-input', 'chip-module-board'],
  related: ['temperature-sensors', 'thermal-design', 'thermistors-and-ldrs', 'sensor-calibration', 'power-modes', 'wifi-power-save-and-dtim', 'enclosures'],
  body: `Inside every ESP32-family chip except the original ESP32 sits a small temperature sensor. It measures the **die**, the silicon itself, which is not the same as the temperature of the room. The sensor is real and cheap, since it costs no pins and no parts, but it answers a particular question: how hot is the chip?

### What it is good for

The die is always warmer than its surroundings, and how much warmer depends on what the chip is doing. Idle, it is a little above the air around it; with Wi-Fi transmitting for long stretches, or both cores busy, it can be many degrees warmer, and more still inside a small sealed enclosure in the sun. That makes the sensor useful for:

- **Thermal protection**: slowing down, sleeping more or shutting a load off when the chip gets near its limit ([[thermal-design]]).
- **Seeing the effect of a design change**: does the new enclosure, the lower transmit power or the sleep schedule make the chip cooler?
- **A very rough hint** of the temperature inside a box.

It is **not** a room thermometer. The reading includes the chip's own heat, it is accurate to a degree or two at best and varies from chip to chip, and the accuracy depends on the measuring range that the driver is set to. For the air temperature use a real sensor ([[temperature-sensors]]) placed away from the heat.

### Which chips

All current chips have one except the original ESP32: Espressif no longer specifies the sensor of the ESP32, so anything it returns should not be trusted. The S2, S3, C2, C3, C5, C6, C61, H2, P4 and S31 have it. The chip's rated ambient range is wide, from −40 °C up to 85 °C on the P4 and S31, 105 °C on most others and 125 °C on the ESP32; the die runs warmer than that ambient.

### Reading it

In Arduino core 3.x, \`temperatureRead()\` returns degrees Celsius as a float. In MicroPython, \`esp32.mcu_temperature()\` does. In ESP-IDF the temperature sensor driver (\`driver/temperature_sensor.h\`) asks you to choose the expected measuring range, and its accuracy is best inside the range chosen. The Arduino and MicroPython calls hide that choice.

A few traps: the reading follows the load and lags it by seconds, so a drop in activity shows up slowly; it is the *die*, so switching a Wi-Fi power setting changes it; and averaging a few readings removes the quantisation steps.

> [!key] The internal sensor measures the chip's own die temperature, free of cost on every chip but the original ESP32. Use it to watch for overheating and to see the effect of load, not to measure the room.`,
  ideas: [
    'The internal sensor measures the temperature of the silicon die, which is warmer than the air and follows what the chip is doing.',
    'It is good for thermal protection and for seeing the effect of load and enclosure, and poor as a room thermometer.',
    'Every current chip has it except the original ESP32, whose sensor Espressif no longer specifies.',
    'temperatureRead() in Arduino and esp32.mcu_temperature() in MicroPython return degrees Celsius.'
  ],
  pitfalls: [
    'The internal sensor is a free room thermometer — It reads the die, which is warmed by the chip itself and by the radio, so it is always above the room and it moves with the load. Use a separate sensor away from the board for the air.',
    'Every ESP32 has one — The original ESP32 does not have a supported sensor. Code that relies on it should be tested on the chip you will really use.',
    'The reading is accurate to a tenth of a degree — The resolution looks fine, but the accuracy is a degree or two at best, and different chips of the same type differ.'
  ],
  terms: [
    { term: 'Die temperature', also: ['junction temperature', 'chip temperature'], def: 'The temperature of the silicon of the chip itself. It is higher than the surrounding air by an amount that depends on how much power the chip is using and how well the heat can leave.' },
    { term: 'Internal temperature sensor', also: ['on-chip temperature sensor', 'temperatureRead', 'mcu_temperature'], def: 'A sensor built into the chip that measures the die temperature without any external part. All ESP32-family chips have one except the original ESP32.' },
    { term: 'Thermal protection', also: ['thermal shutdown', 'thermal throttling'], def: 'Reducing the chip\'s activity, or switching off loads, when its temperature approaches a limit, so that heat does not damage it or shorten its life.' },
    { term: 'Self-heating', also: ['self heating'], def: 'The warming of a device, and of any sensor on it, by the power the device itself dissipates. It makes a sensor near a radio or a regulator read higher than the air.' }
  ],
  code: [
    {
      title: 'Print the chip temperature',
      about: 'Prints the temperature of the chip every two seconds. Hold a finger on the chip or start Wi-Fi in another sketch and watch the number rise.',
      needs: 'An ESP32-S2, S3, C3, C6 or any other chip with the sensor (not the original ESP32), and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
        forever
          print (join [Chip temperature: ] (chip temperature in °C) [ C])
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          float celsius = temperatureRead();       // the chip's own die temperature
          Serial.printf("Chip temperature: %.1f C\n", celsius);
          delay(2000);
        }
      `,
      py: String.raw`
        import esp32
        import time

        while True:
            celsius = esp32.mcu_temperature()      # the chip's own die temperature (not on the original ESP32)
            print("Chip temperature:", celsius, "C")
            time.sleep(2)
      `,
      output: `
        Chip temperature: 31.4 C
        Chip temperature: 31.8 C
        Chip temperature: 36.2 C
      `,
      notes: ['The values are the die temperature: expect them to sit above the room temperature.', 'The names temperatureRead and esp32.mcu_temperature are those of core 3.x and MicroPython 1.29; the original ESP32 does not have a supported sensor, so do not use them there for anything that matters.']
    }
  ],
  examples: [
    {
      title: 'Is 55 °C too hot?',
      q: 'A battery sensor in a sealed box reports 55 °C from temperatureRead() on an ESP32-C3 (rated ambient up to 105 °C). The room is 25 °C. Is anything wrong?',
      steps: ['The die is 30 °C above the room. That is plausible for a chip transmitting Wi-Fi inside a closed box.', 'The rating of 105 °C is for the ambient around the chip, so the chip is well within its limits at 55 °C.', 'What deserves attention is the battery and any sensor beside the chip: they are warmed by it and may read high or age faster.'],
      a: 'Nothing is wrong with the chip. The point is to keep temperature-sensitive parts, such as a lithium cell or a humidity sensor, away from it.'
    }
  ],
  quiz: [
    { q: 'You read 38 °C from the internal sensor of a board on a desk where the room is 24 °C. What does it tell you about the room?', choices: ['The room is 38 °C', 'Little: it is the die temperature, warmed by the chip itself', 'The room is 14 °C cooler than the chip, exactly', 'The sensor is broken'], a: 1, why: 'The sensor reads the silicon, which is above the air by an amount that depends on load. It is not a room thermometer.' },
    { q: 'Which chip has no supported internal temperature sensor?', choices: ['ESP32-S3', 'ESP32-C3', 'The original ESP32', 'ESP32-C6'], a: 2, why: 'Espressif no longer specifies the sensor of the original ESP32. The S2, S3, C-series, H2, P4 and S31 have one.' },
    { q: 'The internal sensor is a good way to measure the air temperature in an enclosure to within 0.1 °C.', a: false, why: 'The sensor measures the die, which is warmer than the air, and its accuracy is a degree or two. Use a separate sensor away from the heat for the air.' }
  ],
  applications: [
    'Slowing down or switching off loads when the chip gets hot.',
    'Logging chip temperature over days to judge an enclosure design.',
    'A diagnostic value to send with each report from a field device.',
    'Comparing the heating effect of Wi-Fi power settings and sleep schedules.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, *Temperature Sensor*: measuring range and accuracy.',
    'Arduino core for ESP32 documentation, temperatureRead (core 3.3); MicroPython documentation, the *esp32* module (version 1.29).',
    'Espressif datasheets of the ESP32-C3, ESP32-S3 and ESP32-C6: the temperature sensor and the operating temperature range.'
  ]
}
);
