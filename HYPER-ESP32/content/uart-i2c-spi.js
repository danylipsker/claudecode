/* HYPER-ESP32 · content/uart-i2c-spi.js
 *
 * Wired Communication → "UART, I2C and SPI": bits on a wire; UART and the UARTs of an ESP; I2C, its addresses, pull-ups
 * and stuck buses; SPI, its modes and sharing a bus; 1-Wire; choosing a bus; and talking to a chip from its register map.
 * Simulations: sims/uart-i2c-spi.js (ids start with "ub-").
 */
Hyper.add(
/* ================================================================ serial-communication-basics */
{
  id: 'serial-communication-basics',
  parent: 'uart-i2c-spi',
  title: 'Serial communication: bits on a wire',
  level: 1,
  short: 'A sensor, a display or another controller is reached through two to four wires, one bit after another. The only questions are when to look at the wire, who may speak, and how a pin drives the line — and the four buses of this topic answer them differently.',
  keywords: ['serial', 'parallel', 'synchronous', 'asynchronous', 'clock', 'bit', 'byte', 'baud', 'controller', 'peripheral', 'master', 'slave', 'push-pull', 'open-drain', 'common ground', 'bus'],
  prereq: ['bits-and-bytes', 'three-volt-logic', 'peripherals-overview'],
  related: ['uart', 'i2c', 'spi', 'one-wire', 'choosing-a-bus', 'the-logic-analyser', 'gpio-matrix-and-io-mux', 'electronics:serial-buses'],
  body: `A microcontroller has a few dozen pins, but a sensor, a display, a memory card or a GPS receiver would need a pin for every signal if the parts spoke in parallel. So they send data **serially**: one bit after another along a single wire, each bit lasting a short, fixed time. Eight bits make a byte — a letter, a register number, half of a temperature reading. Two to four wires carry everything.

### The problem of "when"

Put a byte on a wire as eight voltage levels in a row and the receiver faces one question: *when do I look?* Look a little early or late and it reads the neighbouring bit. Two answers:

- **A clock wire (synchronous).** The sender toggles a second wire and the receiver reads the data wire at every tick, so the two cannot drift apart: I2C (clock line SCL) and SPI (SCK).
- **An agreed speed (asynchronous).** No clock wire. Both ends know the bit time, a start mark shows where a byte begins, and each end counts time with its own oscillator: UART and 1-Wire.

### Four buses at a glance

| | Signal wires | Who may speak | Devices | Typical speed |
|---|---|---|---|---|
| [[uart\|UART]] | 2: TX and RX | either end, any time | 2, a pair | 9 600 to 921 600 baud |
| [[i2c\|I2C]] | 2: SDA and SCL, shared | the controller starts every exchange | up to 112 addresses | 100 kHz or 400 kHz |
| [[spi\|SPI]] | 3 shared, plus 1 chip select per device | the controller | one chip select each | 1 MHz to tens of MHz |
| [[one-wire\|1-Wire]] | 1: data, shared | the controller starts every bit | many, each with a 64-bit ID | about 15 kbit/s |

All of them need a **common ground**: a voltage means something only against a reference, so two boards that talk must share the ground wire.

### Roles, and how a pin drives the wire

I2C and SPI have a **controller** that starts every exchange and **peripherals** that answer (older datasheets say *master* and *slave*). UART has no roles: both ends transmit when they like.

How a pin drives the wire decides whether many parts may share it. A **push-pull** output pulls the line both high and low, so two of them on one wire would fight. An **open-drain** output can only pull low; a resistor pulls the line back high. Many open-drain outputs share a line safely — if any one pulls low, it is low — which is why I2C and 1-Wire hang a dozen parts on one wire, and why they need a pull-up resistor ([[pull-ups-and-pull-downs]]).

### What the ESP does for you

The chip has UART, I2C and SPI controllers in hardware: they shift and time the bits while your program runs, and the [[gpio-matrix-and-io-mux|GPIO matrix]] lets most of them use almost any pins. [The signal lab](#/tools/signals) draws each bus as a logic analyser would.

> [!key] Serial means bits one after another on few wires. What differs between the buses is when the receiver looks (a clock wire or an agreed speed), who may talk (roles, addresses or chip selects) and whether pins push-pull or open-drain — the rest of this topic is those answers, four times.`,
  ideas: [
    'Serial communication sends the bits of a byte one after another on one wire, so a whole conversation needs only two to four wires.',
    'The receiver must know when to read each bit: from a clock wire (I2C, SPI) or from an agreed speed and a start mark (UART, 1-Wire).',
    'I2C and SPI have a controller and peripherals; UART has no roles. Open-drain outputs may share a wire, push-pull outputs may not.',
    'Every bus needs a common ground, and the ESP\'s hardware controllers do the bit timing while the program does other work.'
  ],
  pitfalls: [
    'Parallel is always faster than serial — A single serial line can be clocked much faster than a wide bus whose wires arrive at slightly different times. Serial links are the fast ones in modern computers; for sensors speed is rarely the point anyway.',
    'Two parts that both say "serial" can talk if the wires reach — They must also use the same protocol, the same voltage levels and the same settings, and share a ground wire. A UART cannot talk to an I2C part, whatever the number of wires.',
    '"Master and slave" means the same on every bus — UART has no master; I2C has a controller that starts each transfer; SPI has a controller that picks a peripheral with a chip-select wire. The words describe who starts an exchange, not who is in charge of the circuit.'
  ],
  terms: [
    { term: 'Serial communication', also: ['serial bus', 'serial link'], def: 'Sending the bits of data one after another over a single wire, each for a fixed time, instead of side by side over many wires. UART, I2C, SPI and 1-Wire are all serial.' },
    { term: 'Synchronous and asynchronous', also: ['clocked', 'clockless'], def: 'A synchronous link carries a clock wire that tells the receiver when to read each bit (I2C, SPI). An asynchronous link has none: both ends agree the speed beforehand and mark each byte with a start bit (UART).' },
    { term: 'Controller and peripheral', also: ['master and slave', 'main and sub', 'host and device'], def: 'The controller starts every exchange and generates the clock on I2C and SPI; the peripheral answers when addressed or selected. The older names master and slave are still printed on many datasheets.' },
    { term: 'Open-drain', also: ['open collector', 'wired-AND'], def: 'An output that can only pull its wire low or let go. A pull-up resistor lifts the wire high when nobody pulls. Several open-drain outputs can share one wire, as on I2C and 1-Wire.' },
    { term: 'Push-pull', also: ['totem-pole output'], def: 'An output that drives its wire actively both high and low, as an ordinary GPIO does. Two push-pull outputs tied together fight each other whenever they disagree.' }
  ],
  choose: {
    good: ['Serial buses for anything that needs a few wires and a modest speed: sensors, displays, memory cards, GPS receivers', 'A clocked bus (I2C, SPI) when the parts are close together and the clock speed should be exact', 'An asynchronous link (UART, 1-Wire) when the parts are far apart or have no clock wire to spare'],
    avoid: ['Joining the outputs of two push-pull pins on one wire', 'Assuming two serial devices are compatible because both have a TX and an RX', 'Leaving out the ground wire between two boards'],
    check: ['The logic voltage of both ends before connecting them ([[three-volt-logic]])', 'Which protocol, speed and settings the part\'s datasheet asks for', 'Whether the bus needs pull-up resistors, and whether the board already has them']
  },
  code: [
    {
      title: 'The bits of a byte in wire order',
      about: 'A UART sends the **least significant bit first**; SPI usually sends the **most significant bit first**. This program prints the letter "A" both ways, so you can compare it with the traces in the simulation.',
      needs: 'Any ESP board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [value v] to (0x41)        // the letter A
          set [bits v] to []
          for each [i v] in (numbers from (0) to (7))
            set [bits v] to (join (bits) ((floor of ((value) / ((2) ^ (i)))) mod (2)))
          end
          print (join [UART, least significant bit first: ] (bits))
          set [bits v] to []
          for each [i v] in (numbers from (7) down to (0))
            set [bits v] to (join (bits) ((floor of ((value) / ((2) ^ (i)))) mod (2)))
          end
          print (join [SPI, most significant bit first:   ] (bits))
      `,
      cpp: String.raw`
        const uint8_t value = 0x41;                  // the letter 'A'

        void setup() {
          Serial.begin(115200);
          delay(1000);                               // give the monitor time to open
          Serial.print("UART, least significant bit first: ");
          for (int i = 0; i < 8; i++) Serial.print((value >> i) & 1);
          Serial.println();
          Serial.print("SPI, most significant bit first:   ");
          for (int i = 7; i >= 0; i--) Serial.print((value >> i) & 1);
          Serial.println();
        }

        void loop() {}
      `,
      py: String.raw`
        value = 0x41                                 # the letter 'A'

        lsb_first = "".join(str((value >> i) & 1) for i in range(8))
        msb_first = "".join(str((value >> i) & 1) for i in range(7, -1, -1))
        print("UART, least significant bit first:", lsb_first)
        print("SPI, most significant bit first:  ", msb_first)
      `,
      output: `
        UART, least significant bit first: 10000010
        SPI, most significant bit first:   01000001
      `,
      notes: ['On an ESP32-S3, C3 or C6 board whose USB port is the chip\'s own, nothing appears in the monitor unless Tools → USB CDC On Boot is enabled ([[uart-on-the-esp]]).']
    }
  ],
  examples: [
    {
      title: 'Counting pins',
      q: 'A small board offers eleven usable pins. The project needs an OLED display, a temperature and humidity sensor, a GPS receiver and an SD card. How many pins does each choice of bus cost?',
      steps: ['The OLED and the sensor can both be I2C parts: they share two pins (SDA, SCL), whatever their number.', 'The GPS receiver speaks UART: two pins (TX, RX), and it cannot share them.', 'The SD card on SPI needs three shared wires plus one chip select: four pins.', 'Total: 2 + 2 + 4 = 8 pins, leaving three free. Had the display used SPI as well, it would add only a chip-select pin, since the three data wires are shared with the card.'],
      a: 'Eight pins for the four parts — the shared buses are what keep the count low.'
    }
  ],
  quiz: [
    { q: 'Which of these links has no clock wire?', choices: ['SPI', 'I2C', 'UART', 'None of them: every bus needs a clock wire'], a: 2, why: 'A UART is asynchronous: the two ends agree the bit time beforehand and the start bit marks each byte. SPI (SCK) and I2C (SCL) both carry a clock.' },
    { q: 'Why can a dozen I2C parts share one data wire, while two ordinary GPIO outputs cannot share a wire safely?', choices: ['I2C is much slower', 'I2C outputs are open-drain: they only pull the line low, and a resistor pulls it high', 'I2C parts take turns by themselves', 'GPIO outputs are weaker'], a: 1, why: 'A push-pull output drives both levels, so two of them disagreeing short-circuit each other. An open-drain output never drives high, so any number can share the wire — the line is low if any one of them pulls low.' },
    { q: 'Two boards are joined by a TX–RX pair in each direction and nothing else. It is enough for a reliable link.', a: false, why: 'Without a shared ground wire the receiver has no reference for what counts as low and high. The link may work by luck, for instance when both boards are earthed through the same computer, and fail otherwise.' },
    { q: 'What tells the receiver of an asynchronous serial link where a byte begins?', choices: ['A pulse on a separate wire', 'The start bit: a falling edge from the resting high level', 'The address in the previous byte', 'The chip-select wire going low'], a: 1, why: 'The line rests high; the transmitter pulls it low for one bit time at the start of every character, and the receiver starts its bit timer on that falling edge.' }
  ],
  applications: [
    'A weather station: an I2C pressure and humidity sensor, a UART GPS receiver and an SPI memory card on the same board.',
    'The USB-to-serial bridge on every development board, which turns USB into the UART the chip is flashed and monitored through.',
    'Adding more inputs and outputs with a shift register or an I2C expander when a board runs out of pins ([[io-expanders-and-shift-registers]]).',
    'Reading a logic-analyser trace to find out why two parts will not talk.'
  ],
  sources: [
    'NXP, *UM10204: I2C-bus specification and user manual* (the definitions of controller, target, open-drain signalling and the bus conditions).',
    'Espressif, *ESP32 Technical Reference Manual*: the chapters on the UART, I2C and SPI controllers.',
    'Espressif, *ESP-IDF Programming Guide*, Peripherals API: UART, I2C and SPI driver references.'
  ],
  sim: 'ub-frame'
},

/* ================================================================ uart */
{
  id: 'uart',
  parent: 'uart-i2c-spi',
  title: 'UART',
  level: 1,
  short: 'Two wires, no clock: each end sends bytes as a start bit, eight data bits and a stop bit at an agreed speed. The oldest serial link is still how your computer, a GPS module, a modem and the chip\'s own console talk.',
  keywords: ['UART', 'serial', 'baud', 'baud rate', '8N1', 'start bit', 'stop bit', 'parity', 'framing error', 'TX', 'RX', 'RS-232', 'flow control', 'RTS', 'CTS', 'Serial.begin', 'bit time'],
  prereq: ['serial-communication-basics', 'bits-and-bytes'],
  related: ['uart-on-the-esp', 'rs-485', 'level-shifters', 'usb-serial-bridges-and-auto-reset', 'the-serial-monitor', 'modbus', 'bluetooth-classic-spp-and-a2dp'],
  body: `**UART** — universal asynchronous receiver-transmitter — is the oldest and simplest way for two devices to talk. Each side has a transmit pin (**TX**) and a receive pin (**RX**). Connect **TX to the other side's RX and RX to its TX**, add ground, and either side may speak whenever it likes. The serial monitor, GPS receivers, modems and the bridge chip of every development board use it.

### One character on the wire

The line rests **high**. To send a byte the transmitter pulls it low for one bit time — the **start bit** — then puts out the data bits, **least significant first**, and finally drives the line high for one or two **stop bits**. The falling edge of the start bit is the only synchronisation the receiver gets: it starts a timer and reads each following bit in the middle of its slot. The letter "A" (0x41) at the usual setting, **8N1** — eight data bits, no parity, one stop bit — is ten bits. [The signal lab](#/tools/signals/uart) shows any byte you type.

### Baud: how fast

The **baud rate** is the number of bits per second (on a UART baud and bit/s are the same number); the bit time is its inverse. Since every character costs ten bits, a UART moves one tenth of its baud rate in characters:

| Baud | Bit time | Characters per second (8N1) |
|---|---|---|
| 9 600 | 104 µs | 960 |
| 115 200 | 8.7 µs | 11 520 |
| 921 600 | 1.09 µs | 92 160 |

### Both ends must agree — to a few per cent

With no clock wire each end counts time with its own oscillator. The receiver reads in the middle of each bit, and a difference in speed adds up along the frame: by the last bit the error must stay under half a bit, which allows about 5 % in total; design for under 2 to 3 %. Crystal-driven chips are far inside that, loose internal oscillators are not, and an 8-bit AVR at 16 MHz asked for 115 200 baud runs 2.1 % off. Detune the receiver in the simulation and watch the sample points slide.

### Settings, errors and flow control

- **Parity** adds one bit that makes the count of ones even or odd, catching a single flipped bit. It is rare now; Modbus RTU uses 8E1.
- A **framing error** means the stop bit was not high where it should be — nearly always a wrong baud rate. A **parity error** means the check failed; an **overrun** means bytes arrived faster than they were read.
- **Flow control** (RTS and CTS wires, or XON/XOFF characters) lets a slow receiver tell the sender to pause. Most sensors do without it.

> [!warn] An ESP pin is 3.3 V logic. An old computer's serial port (RS-232) swings between about −12 V and +12 V and destroys a pin; a 5 V board's TX can overstress an ESP RX. Use a level shifter or an RS-232 driver chip ([[level-shifters]]), and [[rs-485]] for long cables.

> [!key] A UART sends each byte as a start bit, data bits, optional parity and stop bit at a speed both ends know, with no clock wire. Match the baud rate within a few per cent, cross TX to RX, share the ground, and keep the voltage levels compatible.`,
  ideas: [
    'A UART frame is a start bit (low), the data bits least significant first, an optional parity bit and one or two stop bits (high): 8N1 is ten bits per character.',
    'The baud rate is bits per second; characters per second is about a tenth of it.',
    'There is no clock wire, so both ends must agree on the speed to within a few per cent — the error adds up over the frame.',
    'TX goes to the other side\'s RX; the two ends share a ground; levels must match (3.3 V, not RS-232).'
  ],
  pitfalls: [
    'TX goes to TX and RX to RX — Each output must meet the other end\'s input: cross them. Many boards print "TX" and "RX" from the board\'s own point of view, so the wire from a module\'s TX label goes to your RX pin.',
    'If the text is garbage, the data is corrupted — Nearly always it is just the wrong baud rate (or format): the bytes arrive intact and are read at the wrong speed. Try the other common rates before suspecting the wiring.',
    'A UART is a fast, long-distance link — At logic level it is good for a metre or two at most. For distance the signal is turned into RS-232 or RS-485 levels; speed falls as the cable grows.'
  ],
  terms: [
    { term: 'UART', also: ['serial port', 'universal asynchronous receiver-transmitter', 'USART'], def: 'A circuit that turns bytes into a stream of start, data and stop bits on a TX wire and back again from an RX wire, at an agreed speed and with no clock wire.' },
    { term: 'Baud rate', also: ['baud', 'bit rate'], def: 'The number of bits per second on a serial line. On a UART each character takes ten bits at 8N1, so 115 200 baud carries 11 520 characters a second.' },
    { term: '8N1', also: ['8E1', '8N2', 'frame format', 'serial format'], def: 'Shorthand for the frame: 8 data bits, N (no) parity, 1 stop bit. 8E1 has even parity; 8N2 has two stop bits. Both ends must use the same one.' },
    { term: 'Start bit and stop bit', also: ['framing'], def: 'The start bit is one low bit time that begins every character and starts the receiver\'s timer. The stop bit is a high level after the data that returns the line to rest and lets the receiver check the frame.' },
    { term: 'Framing error', also: ['parity error', 'overrun'], def: 'The receiver reports that the stop bit was not high where expected, usually because the baud rate or format differs. A parity error is a failed parity check; an overrun is data lost because it was not read in time.' }
  ],
  choose: {
    good: ['Talking to a GPS receiver, modem, fingerprint reader or another microcontroller over a few wires', 'A console and a way to upload and debug: every board has one', 'Links that run at an easy speed with only two ends'],
    avoid: ['Many devices on one pair of wires without RS-485 or another bus', 'Long cables at logic level', 'Fast streams of data when the receiving side reads rarely: the buffer overflows'],
    check: ['The baud rate and the frame format in the module\'s datasheet', 'That TX is crossed to RX and the grounds are joined', 'That both ends use 3.3 V logic, or that a level shifter sits between']
  },
  code: [
    {
      title: 'Loopback: talk to yourself',
      about: 'Join the TX pin to the RX pin with one wire. Whatever the board sends comes straight back, which proves that the pins, the baud rate and the code are right before a real device is involved.',
      needs: 'An ESP32 DevKit and a jumper wire between GPIO25 and GPIO26. On another chip use any two free GPIOs.',
      wiring: [['GPIO25', 'GPIO26', 'TX to RX with one jumper wire']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on TX (25) RX (26)
        forever
          send [hello] on UART (1)
          wait (0.2) seconds
          print (join [received: ] (read all from UART (1)))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int TX_PIN = 25;
        const int RX_PIN = 26;                       // jumper wire from GPIO25 to GPIO26

        void setup() {
          Serial.begin(115200);                      // the console
          Serial1.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);   // baud, format, RX pin, TX pin
        }

        void loop() {
          Serial1.print("hello");
          delay(200);                                // 5 characters take about 5 ms at 9600 baud
          String back = "";
          while (Serial1.available()) back += (char)Serial1.read();
          Serial.println("received: " + back);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        TX_PIN = 25
        RX_PIN = 26                                  # jumper wire from GPIO25 to GPIO26

        uart = UART(1, baudrate=9600, tx=TX_PIN, rx=RX_PIN)   # 8 data bits, no parity, 1 stop bit are the defaults

        while True:
            uart.write(b"hello")
            time.sleep_ms(200)                       # 5 characters take about 5 ms at 9600 baud
            back = uart.read()                       # bytes, or None when nothing has arrived
            print("received:", back)
            time.sleep(1)
      `,
      output: `
        received: hello
      `,
      notes: ['MicroPython prints the bytes object, so its line reads received: b\'hello\'. Take the jumper away and the received text is empty.', 'Pins 16 and 17 are the conventional pair on the ESP32, but a WROVER module uses them for its PSRAM; GPIO25 and GPIO26 are free on every DevKit.']
    },
    {
      title: 'Read lines from a serial device',
      about: 'Many sensors print a line of text such as `T=23.5` every second. This reads one line at a time, splits it at the equals sign and turns the number into a value.',
      needs: 'An ESP32 DevKit and a device that sends text lines at 9600 baud: its TX to GPIO26, its RX to GPIO25, grounds joined.',
      wiring: [['GPIO26 (RX)', 'device TX', '3.3 V logic only'], ['GPIO25 (TX)', 'device RX'], ['GND', 'device GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on TX (25) RX (26)
        forever
          if <data available on UART (1)> then
            set [line v] to (read line from UART (1))
            if <(line) contains [=]> then
              set [value v] to (number from (text after [=] in (line)))
              print (join (text before [=] in (line)) [ is ] (value))
            end
          end
        end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          Serial1.begin(9600, SERIAL_8N1, 26, 25);   // RX = GPIO26, TX = GPIO25
        }

        void loop() {
          if (Serial1.available()) {
            String line = Serial1.readStringUntil('\n');   // waits up to one second for the newline
            line.trim();                             // drops the carriage return
            int eq = line.indexOf('=');
            if (eq > 0) {
              float value = line.substring(eq + 1).toFloat();
              Serial.printf("%s is %.1f\n", line.substring(0, eq).c_str(), value);
            }
          }
        }
      `,
      py: String.raw`
        from machine import UART

        uart = UART(1, baudrate=9600, tx=25, rx=26, timeout=1000)   # timeout: how long readline() waits, in ms

        while True:
            if uart.any():
                line = uart.readline()               # bytes up to the newline, or None
                if line:
                    text = line.decode().strip()
                    name, sep, number = text.partition("=")
                    if sep:
                        print(name, "is", float(number))
      `,
      output: `
        T is 23.5
        T is 23.6
      `,
      notes: ['A line that is not a number makes float() raise an error in MicroPython; wrap it in try/except when the sender is not under your control.', 'If garbage appears, try 115200 or 4800 before changing the wiring: a wrong baud rate is the usual cause.']
    }
  ],
  formulas: [
    {
      name: 'Time to send a message',
      expr: 't = n*b/B',
      tex: 't = \\frac{n \\, b}{B}',
      vars: {
        t: { name: 'time on the wire', q: 'time', unit: 'ms' },
        n: { name: 'number of characters', value: 82, min: 1, int: true },
        b: { name: 'bits per character (8N1: 10)', value: 10, min: 7, max: 13 },
        B: { name: 'baud rate', q: 'datarate', unit: 'baud', value: 9600 }
      },
      solveFor: 't',
      note: 'Bits per character = 1 start + data bits + parity + stop bits: 10 for 8N1 and 11 for 8E1 or 8N2. Gaps between characters add to it; the line is busy only while bits are going out.',
      stories: { t: 'A GPS receiver at {B} prints a sentence of {n} characters, {b} bits each. How long does the sentence occupy the wire?' },
      practice: { unknowns: ['t', 'B'] }
    }
  ],
  examples: [
    {
      title: 'A GPS sentence at two speeds',
      q: 'A GPS receiver prints one 82-character sentence. How long does it occupy the line at 9600 baud, and at 115 200 baud? Could a loop that prints once a second keep up at the lower speed?',
      steps: ['Ten bits per character at 8N1: $82 \\times 10 = 820$ bits.', 'At 9600 baud: $820 / 9600 = 85.4$ ms. At 115 200 baud: $820 / 115\\,200 = 7.1$ ms.', 'A single sentence per second uses 8.5 % of the line at 9600 baud, so one sentence a second is easy. A receiver that prints ten different sentences a second would need 854 ms of the second — almost all of it.'],
      a: '85 ms at 9600 baud and 7 ms at 115 200 baud. One sentence a second fits easily; a dozen sentences a second at 9600 baud does not.'
    }
  ],
  quiz: [
    { q: 'How many bits does the letter "A" occupy on a UART set to 8N1?', choices: ['8', '9', '10', '12'], a: 2, why: 'One start bit, eight data bits, no parity and one stop bit make ten bits, which is why characters per second is about a tenth of the baud rate.' },
    { q: 'A sensor at 9600 baud and an ESP set to 115 200 baud are wired correctly, TX to RX and ground to ground. What does the ESP receive?', choices: ['Nothing at all, because the voltages differ', 'Garbage or nothing: the bits arrive, but are read at the wrong speed', 'The right text, a little slower', 'Only the first character'], a: 1, why: 'The wires and levels are fine; the ESP samples far too early for the sensor\'s long bits and sees a jumble of ones and zeros that does not form valid frames. The cure is the same baud rate, not different wiring.' },
    { q: 'Roughly how far apart can the two ends\' baud rates be before a frame of ten bits is read wrongly?', choices: ['About 0.1 %', 'About 5 %', 'About 25 %', 'There is no limit'], a: 1, why: 'The receiver samples mid-bit; by the tenth bit the error must be under half a bit, and 0.5 bit in 9.5 is about 5 %. Allow a margin: 2 to 3 % is a safe design limit.' },
    { q: 'The data bits of a UART frame are sent most significant bit first.', a: false, why: 'A UART sends the least significant bit first. (SPI usually sends the most significant first, which is a classic source of confusion when the two are compared.)' }
  ],
  applications: [
    'The console: boot messages, log output and the serial monitor all travel over UART0, and so does flashing a new program on most boards.',
    'GPS receivers, fingerprint readers, mmWave radar sensors, cellular modems and Bluetooth modules.',
    'Linking two microcontrollers, for instance an ESP32 with a co-processor that handles the display or the motors.',
    'Industrial links: the same frames, turned into RS-485 levels, carry Modbus RTU over hundreds of metres.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: UART API reference (frame format, baud rate, flow control, error events).',
    'Arduino core for ESP32 documentation: *Serial* (HardwareSerial) API, core 3.3.',
    'MicroPython documentation: class *machine.UART*, version 1.29.'
  ],
  sim: 'ub-uart'
},

/* ================================================================ uart-on-the-esp */
{
  id: 'uart-on-the-esp',
  parent: 'uart-i2c-spi',
  title: 'The UARTs of an ESP',
  level: 2,
  short: 'UART0 is the console and the upload port; the others may be put on almost any pins. On the original ESP32 the default pins of UART1 are flash pins and must be moved, and on chips with built-in USB the word "Serial" may mean the USB port instead.',
  keywords: ['UART0', 'UART1', 'UART2', 'Serial', 'Serial0', 'Serial1', 'Serial2', 'HardwareSerial', 'USB CDC On Boot', 'HWCDC', 'console', 'GPIO1', 'GPIO3', 'TX', 'RX', 'setRxBufferSize', 'pass-through', 'LP UART'],
  prereq: ['uart', 'gpio-matrix-and-io-mux'],
  related: ['the-serial-monitor', 'usb-serial-bridges-and-auto-reset', 'usb-on-the-esp', 'board-menu-options', 'strapping-pins', 'pins-at-boot', 'drivers-and-serial-ports', 'level-shifters', 'esp-at-and-esp-hosted'],
  body: `Every ESP has several UARTs, and they are not equal. One of them, **UART0**, has a job before your program starts: it is the **console**. The boot ROM prints its first messages on it, the upload tool flashes the chip through it, and on a development board the USB-to-serial bridge is soldered to its two pins. The others are yours.

### How many, and where the console is

| Chip | UARTs | UART0 console TX / RX |
|---|---|---|
| ESP32 | 3 | GPIO1 / GPIO3 |
| ESP32-S2 | 2 | GPIO43 / GPIO44 |
| ESP32-S3 | 3 | GPIO43 / GPIO44 |
| ESP32-C3 | 2 | GPIO21 / GPIO20 |
| ESP32-C6 | 2 | GPIO16 / GPIO17 |
| ESP32-C5 | 2 | GPIO11 / GPIO12 |
| ESP32-C61 | 3 | GPIO11 / GPIO10 |
| ESP32-C2 | 2 | GPIO20 / GPIO19 |
| ESP32-H2 | 2 | GPIO24 / GPIO23 |
| ESP32-P4 | 5 | GPIO37 / GPIO38 |

(The C5, C6 and P4 also have a **low-power UART** for the low-power core, on fixed pins.) Anything else wired to the console pins fights the bridge: uploads fail and the monitor fills with noise. On the original ESP32 GPIO1 also prints the boot log, which is why it is a poor pin for anything else ([[pins-at-boot]]).

### The other UARTs, on pins you choose

Through the [[gpio-matrix-and-io-mux|GPIO matrix]] the other UARTs can be routed to almost any pins that can output (on the original ESP32 the input-only GPIO34 to GPIO39 can serve as RX only). The "default" pins of UART1 and UART2 differ between Arduino core versions and MicroPython, and on a classic ESP32 UART1's old defaults, GPIO9 and GPIO10, are the flash pins. So: **always pass TX and RX explicitly**. In Arduino the order is baud, format, **RX**, TX; MicroPython names them \`tx=\` and \`rx=\`.

### Which "Serial" is it?

Chips with a built-in USB serial port (the S3, C3, C6 and H2, among others) wire the USB connector of a board to the chip itself, not to UART0. What \`Serial\` means then depends on the Tools menu option **USB CDC On Boot**: *Disabled* makes \`Serial\` the UART0 pins; *Enabled* makes it the USB port. \`Serial0\` always means UART0. Many "nothing appears in the serial monitor" questions on an S3, C3 or C6 board are this one setting ([[board-menu-options]]). A USB serial port has no real baud rate: the number you pass is ignored, and data moves at USB speed.

### Buffers, and what printing costs

The Arduino driver keeps a 256-byte receive buffer by default; \`setRxBufferSize()\` before \`begin()\` makes it larger. At 115 200 baud 256 bytes arrive in 22 ms, so a loop that pauses for a second between reads loses data. Printing has a price too: 80 characters at 115 200 baud take 7 ms once the transmit buffer is full, and 83 ms at 9600 baud. Logging inside a fast loop can dominate it, and printing from an interrupt handler is never allowed.

> [!key] UART0 is the console and the upload port; the others go on any pins, which you should always name. On chips with built-in USB, check what "Serial" means (USB CDC On Boot), keep every line at 3.3 V, and read often enough that the buffer does not overflow.`,
  ideas: [
    'UART0 is the console: boot messages, uploads and the board\'s USB bridge all use its pins, so leave them alone.',
    'The other UARTs can be routed to almost any pins; always pass TX and RX explicitly, because the defaults differ between versions and the old ESP32 default for UART1 is the flash.',
    'On chips with built-in USB, `Serial` means the USB port or UART0 depending on USB CDC On Boot; `Serial0` is always UART0.',
    'The receive buffer is small by default and printing takes real time: at 115 200 baud a character costs 87 µs.'
  ],
  pitfalls: [
    'UART1 and UART2 have fixed pins — They can be put on almost any pins through the GPIO matrix. The ESP32 simply has default pins, and the default pins of UART1 are the flash pins, so a program that relies on them crashes or hangs.',
    'Nothing appears in the serial monitor, so the program is not running — On boards whose USB goes to the chip\'s own USB port, `Serial` may be the UART0 pins until USB CDC On Boot is enabled. The program runs; it is printing where nobody listens.',
    'Serial.begin(9600) on a USB port sets the speed — A USB serial port ignores the baud rate. It matters only for a real UART, the one on the other side of a bridge chip or a module.'
  ],
  terms: [
    { term: 'UART0', also: ['console UART', 'Serial0'], def: 'The UART whose pins are the chip\'s console: the boot ROM prints on it, the upload tool uses it and a board\'s USB-serial bridge is wired to it. Arduino calls it Serial0.' },
    { term: 'USB CDC On Boot', also: ['CDC on boot', 'USB Serial/JTAG', 'HWCDC'], def: 'A Tools menu option for chips with built-in USB. Enabled, the name Serial refers to the USB serial port; disabled, it refers to UART0. USB Serial/JTAG is the chip\'s fixed serial-and-debug USB function.' },
    { term: 'RX buffer', also: ['FIFO', 'ring buffer', 'setRxBufferSize'], def: 'Memory in which received bytes wait until the program reads them. A small hardware FIFO sits in the UART; the Arduino driver adds a ring buffer of 256 bytes by default. If it fills, new bytes are lost.' },
    { term: 'Pass-through', also: ['serial bridge', 'passthrough'], def: 'A program that copies every byte arriving on one serial port to another, in both directions, so a computer can talk through the ESP to a module such as a GPS receiver or a modem.' }
  ],
  code: [
    {
      title: 'UART1 on pins of your choice: show the bytes as hex',
      about: 'Names the pins explicitly, makes the receive buffer larger and prints every byte that arrives as two hex digits — the quickest way to see what a mystery serial device sends.',
      needs: 'An ESP32 DevKit and a serial device at 9600 baud: its TX to GPIO26, its RX to GPIO25, grounds joined, 3.3 V logic.',
      wiring: [['GPIO26 (RX)', 'device TX'], ['GPIO25 (TX)', 'device RX'], ['GND', 'device GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on RX (26) TX (25) buffer (1024)
        forever
          if <data available on UART (1)> then
            print (hex of (read byte from UART (1)))
          end
        end
      `,
      cpp: String.raw`
        const int RX_PIN = 26;                       // the device's TX goes here
        const int TX_PIN = 25;                       // the device's RX goes here

        void setup() {
          Serial.begin(115200);                      // the console
          Serial1.setRxBufferSize(1024);             // before begin(): room for bursts
          Serial1.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);   // order: baud, format, RX pin, TX pin
        }

        void loop() {
          while (Serial1.available()) {
            int b = Serial1.read();
            Serial.printf("%02X ", b);
          }
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        RX_PIN = 26                                  # the device's TX goes here
        TX_PIN = 25                                  # the device's RX goes here

        uart = UART(1, baudrate=9600, tx=TX_PIN, rx=RX_PIN, rxbuf=1024)   # rxbuf: room for bursts

        while True:
            data = uart.read()
            if data:
                print(" ".join("%02X" % b for b in data))
            time.sleep_ms(20)
      `,
      output: `
        24 47 50 47 47 41 2C 31 32 33 35 31 39 2C
      `,
      notes: ['On an ESP32-C3 or C6, which have only UART0 and UART1, the code is unchanged: it already uses Serial1 and UART id 1.', 'The same program shows whether a module that "does not answer" is sending anything at all: if nothing prints, check the TX/RX crossing and the ground first.']
    },
    {
      title: 'A pass-through between the computer and a module',
      about: 'Copies bytes from the console to the module and back, so you can type commands (for instance AT commands for a modem or a GPS configuration) from the serial monitor or a terminal program.',
      needs: 'An ESP32 DevKit and a serial module at 9600 baud on GPIO26 (RX) and GPIO25 (TX). Use a terminal program rather than an IDE shell in MicroPython: the REPL shares the same USB port.',
      wiring: [['GPIO26 (RX)', 'module TX'], ['GPIO25 (TX)', 'module RX'], ['GND', 'module GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud on RX (26) TX (25)
        forever
          if <data available on serial> then
            send (read serial byte) on UART (1)
          end
          if <data available on UART (1)> then
            write (read byte from UART (1)) to serial
          end
        end
      `,
      cpp: String.raw`
        const int RX_PIN = 26, TX_PIN = 25;

        void setup() {
          Serial.begin(115200);                      // to the computer
          Serial1.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);   // to the module
        }

        void loop() {
          while (Serial.available())  Serial1.write(Serial.read());    // computer -> module
          while (Serial1.available()) Serial.write(Serial1.read());    // module -> computer
        }
      `,
      py: String.raw`
        import sys, select
        from machine import UART

        uart = UART(1, baudrate=9600, tx=25, rx=26)  # to the module
        console = select.poll()
        console.register(sys.stdin, select.POLLIN)   # to the computer: the USB console

        while True:
            if console.poll(0):                      # a character was typed
                uart.write(sys.stdin.buffer.read(1))
            data = uart.read()
            if data:
                sys.stdout.buffer.write(data)
      `,
      notes: ['This is how a computer is made to talk to a module whose own pins are not broken out to USB; it also works in reverse for sniffing what a module says.', 'On an ESP32-S3, C3 or C6 whose USB port is the chip\'s own, enable USB CDC On Boot so that Serial is the USB port.']
    }
  ],
  examples: [
    {
      title: 'Will the buffer overflow?',
      q: 'A sensor streams 115 200-baud data continuously while a sketch spends 40 ms in each pass of loop(). Does the default 256-byte buffer survive, and how large must it be?',
      steps: ['Ten bits per character: $115\\,200 / 10 = 11\\,520$ characters a second.', 'In 40 ms that is $11\\,520 \\times 0.040 = 461$ bytes.', 'The 256-byte buffer holds only 22 ms of data, so about 200 bytes are lost on every pass. A buffer of 1024 bytes holds 89 ms, which covers a 40 ms pass with room to spare.'],
      a: 'No: 461 bytes arrive per pass. Enlarge the buffer to 1024 bytes before begin(), or read more often.'
    }
  ],
  quiz: [
    { q: 'A program on an ESP32-S3 DevKit runs (an LED blinks) but Serial.println prints nothing in the Arduino serial monitor. The most likely reason?', choices: ['The baud rate is wrong', 'USB CDC On Boot is disabled, so Serial is UART0 while the USB cable goes to the chip\'s own USB port', 'The S3 has no UART', 'println does not work on the S3'], a: 1, why: 'On boards whose USB connector goes straight to the chip, Serial is the USB port only when USB CDC On Boot is enabled. Otherwise it is UART0, whose pins nobody is listening to.' },
    { q: 'On a classic ESP32, why is it unwise to rely on the default pins of UART1?', choices: ['They are the flash pins on most modules', 'UART1 has no default pins', 'They are input-only', 'UART1 can only run at 9600 baud'], a: 0, why: 'The old defaults for UART1, GPIO9 and GPIO10, connect to the flash memory (the pins are marked do not use). Always pass explicit TX and RX pins.' },
    { q: 'A USB serial port on an ESP32-C3 runs at the baud rate given to Serial.begin().', a: false, why: 'The speed is ignored on a USB serial port; data moves at USB speed. The baud rate matters only for a real UART, such as the one beyond a bridge chip or on a module.' },
    { q: 'In the Arduino call Serial1.begin(9600, SERIAL_8N1, 26, 25), which number is the RX pin?', choices: ['26', '25', 'Neither: pins are set elsewhere', 'Either; the order does not matter'], a: 0, why: 'The order is baud, format, RX pin, TX pin. Swapping them is a common mistake that gives silence.' }
  ],
  applications: [
    'Talking to a GPS receiver, a cellular modem or a mmWave sensor on a spare UART while the console stays free for debugging.',
    'Using the ESP as a serial pass-through to configure a module whose pins are not broken out to USB.',
    'An ESP32 used as a Wi-Fi co-processor for another microcontroller, which talks to it over a UART with a simple command set ([[esp-at-and-esp-hosted]]).',
    'Reading the boot messages of a board that keeps restarting, from a USB-serial adapter on the console pins ([[reading-boot-messages]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: UART API reference; the ESP32, S3 and C3 datasheets for the number of UARTs and the console pins.',
    'Arduino core for ESP32 documentation: *Serial* API and the guide to the Tools menu (USB CDC On Boot), core 3.3.',
    'MicroPython documentation, *Quick reference for the ESP32*: UART (version 1.29).'
  ],
  sim: 'ub-link'
},

/* ================================================================ i2c */
{
  id: 'i2c',
  parent: 'uart-i2c-spi',
  title: 'I2C',
  level: 1,
  short: 'Two shared wires, SDA and SCL, and a 7-bit address for every part. The controller calls an address, the part answers with an acknowledge, and data follows byte by byte. The bus of most sensors, small displays and clock chips.',
  keywords: ['I2C', 'IIC', 'I²C', 'TWI', 'SDA', 'SCL', 'address', 'ACK', 'NACK', 'START', 'STOP', 'repeated start', 'Wire', 'Wire.begin', 'clock stretching', 'controller', 'target', 'register read', 'open-drain', 'Qwiic', 'STEMMA QT'],
  prereq: ['serial-communication-basics', 'pull-ups-and-pull-downs'],
  related: ['i2c-addresses-and-scanning', 'i2c-pull-ups-and-bus-problems', 'registers-and-datasheets', 'temperature-sensors', 'level-shifters', 'qt-py-and-stemma-qt', 'electronics:serial-buses', 'electronics:pull-resistors'],
  body: `**I2C** (say "I-squared-C", written I²C and also called TWI) puts any number of parts on **two shared wires**: **SDA** for data and **SCL** for the clock. Every part has a 7-bit **address**, and the controller — your ESP — starts each exchange by calling one. Temperature, pressure, light and motion sensors, small OLED displays, clock chips, EEPROMs and pin expanders are mostly I2C, which is why it is the bus most projects start with.

### One transfer, step by step

1. **START.** With SCL high, the controller pulls SDA low. Every part listens.
2. **Address and direction.** Seven address bits, most significant first, then one bit: 0 means the controller will write, 1 that it wants to read. SDA changes only while SCL is low and is read while SCL is high.
3. **ACK.** On the ninth clock the part that owns the address pulls SDA low: *acknowledge*. If SDA stays high (**NACK**), nobody is home.
4. **Data bytes**, each followed by an acknowledge from the receiver. When the controller reads, it acknowledges every byte but the last; the NACK after the last byte means "enough".
5. **STOP.** With SCL high, SDA rises; the bus is free.

Each byte costs nine clocks, so at 400 kHz the bus moves at most about 44 000 bytes a second, less with addressing. [The signal lab](#/tools/signals/i2c) decodes any transfer.

### The register idiom

Most parts are banks of numbered registers ([[registers-and-datasheets]]). To read one you *write* its number, then send a **repeated START** (a START without a STOP, so nobody else can interrupt) with the read bit, and read the bytes. To write: address with the write bit, register number, data.

### Wires, speeds and pins

Both lines are open-drain with **pull-up resistors** ([[i2c-pull-ups-and-bus-problems]]). Speeds are 100 kHz (standard), 400 kHz (fast) and 1 MHz (fast-mode plus, only for parts that say so). A slow part may hold SCL low to make the controller wait: *clock stretching*. The ESP routes its controllers to any pins; these are the Arduino defaults:

| Chip | I2C controllers | SDA | SCL |
|---|---|---|---|
| ESP32 | 2 | GPIO21 | GPIO22 |
| ESP32-S3 | 2 | GPIO8 | GPIO9 |
| ESP32-C3 | 1 | GPIO8 | GPIO9 |
| ESP32-C6 | 1 | GPIO23 | GPIO22 |
| ESP32-H2 | 2 | GPIO12 | GPIO22 |
| ESP32-P4 | 2 | GPIO7 | GPIO8 |

> [!key] I2C is two shared open-drain wires: the controller sends a START, an address and a direction bit; the part acknowledges by pulling SDA low; data bytes follow, each acknowledged, and a STOP ends it. A NACK on the address means nobody answered.`,
  ideas: [
    'I2C needs two shared wires, SDA and SCL, and gives every part a 7-bit address that the controller calls at the start of each transfer.',
    'Every byte is followed by a ninth clock in which the receiver pulls SDA low to acknowledge; a high level there is a NACK — nobody home, or no more room.',
    'To read a register: write its number, send a repeated START, then read. Each byte costs nine clocks, so 400 kHz gives at most about 44 kB/s.',
    'Both lines are open-drain with pull-up resistors; speeds are 100 kHz, 400 kHz and, for parts that allow it, 1 MHz.'
  ],
  pitfalls: [
    'An acknowledge means the part understood the command — It means only that a part with that address received the byte. It does not say the command was valid, the sensor is ready or the data is fresh.',
    'Wire.begin(0x48) starts the bus for the device at 0x48 — With one argument it makes the ESP itself a target with that address. To use pins write Wire.begin(sda, scl).',
    'I2C is fast enough for anything on the bus — About 44 kB/s at best: fine for sensors, hopeless for a colour display or an SD card. Those belong on SPI.'
  ],
  terms: [
    { term: 'I2C', also: ['I²C', 'IIC', 'TWI', 'two-wire interface'], def: 'A two-wire serial bus, invented by Philips, in which many parts share a data line (SDA) and a clock line (SCL) and are told apart by 7-bit addresses. The controller generates the clock and starts every transfer.' },
    { term: 'I2C address', also: ['7-bit address', 'target address', 'slave address'], def: 'The 7-bit number a part answers to. The controller sends it with a read or write bit as the first byte of every transfer. Usable values run from 0x08 to 0x77.' },
    { term: 'ACK and NACK', also: ['acknowledge'], def: 'The ninth clock of every byte: the receiver pulls SDA low to acknowledge (ACK) or leaves it high (NACK). A NACK to an address means no such part is present; a NACK after the last byte of a read means "that is enough".' },
    { term: 'START and STOP condition', also: ['S and P', 'start condition'], def: 'A START is SDA falling while SCL is high; it begins a transfer. A STOP is SDA rising while SCL is high; it ends it. Data lines may change only while SCL is low, so these two are unmistakable.' },
    { term: 'Repeated START', also: ['restart', 'Sr'], def: 'A START sent without a STOP in between, used to turn a register write into a read without giving up the bus.' },
    { term: 'Clock stretching', also: ['SCL stretching'], def: 'A part holds SCL low after a clock pulse to make the controller wait until it is ready. The controller must notice that the line stays low and wait, up to a time-out.' }
  ],
  choose: {
    good: ['Several slow sensors and a small display sharing two pins', 'Parts that come on Qwiic, STEMMA QT or Grove cables, which carry I2C', 'A bus that must fit in a board with few free pins'],
    avoid: ['Colour displays, SD cards and anything that needs more than about 40 kB/s: use SPI', 'Cables longer than a metre or so without care for pull-ups and capacitance', 'Two parts with the same fixed address on one bus without a multiplexer'],
    check: ['That all parts on the bus have different addresses ([[i2c-addresses-and-scanning]])', 'That the pull-up resistors exist and their combined value is sensible', 'That every part runs at 3.3 V, or that a level shifter protects the ESP']
  },
  code: [
    {
      title: 'Read a temperature from a TMP102',
      about: 'The register idiom in full: write the register number, restart, read two bytes, and turn the 12 left-justified bits of the answer into degrees Celsius (0.0625 °C per step).',
      needs: 'An ESP32 DevKit and a TMP102 board (3.3 V). On an S3 or C3 change the pins to 8 and 9.',
      wiring: [['GPIO21', 'TMP102 SDA', 'the board usually has pull-ups'], ['GPIO22', 'TMP102 SCL'], ['3V3', 'VCC'], ['GND', 'GND and ADD0', 'ADD0 to ground gives address 0x48']],
      libs: [],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz
        forever
          set [data v] to (I2C read (2) bytes from address (0x48) register (0x00))
          set [raw v] to (floor of ((((item (1) of (data)) * (256)) + (item (2) of (data))) / (16)))
          if <(raw) ≥ (2048)> then
            change [raw v] by (-4096)        // bit 11 is the sign: two's complement
          end
          print (join ((raw) * (0.0625)) [ C])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;        // ESP32 defaults; the S3 and C3 use 8 and 9
        const uint8_t TMP102 = 0x48;                 // ADD0 to ground
        const uint8_t TEMPERATURE_REGISTER = 0x00;

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);      // (sda, scl, clock in Hz)
        }

        void loop() {
          Wire.beginTransmission(TMP102);
          Wire.write(TEMPERATURE_REGISTER);          // point at the register to read
          if (Wire.endTransmission(false) != 0) {    // false: repeated START; 0 means acknowledged
            Serial.println("TMP102 did not answer");
            delay(1000);
            return;
          }
          Wire.requestFrom(TMP102, (size_t)2);       // read two bytes
          uint8_t hi = Wire.read();
          uint8_t lo = Wire.read();
          int16_t raw = (int16_t)((hi << 8) | lo) >> 4;   // 12 data bits in the top of 16; the shift keeps the sign
          Serial.printf("%.4f C\n", raw * 0.0625f);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)   # ESP32 pins; the S3 and C3 use 8 and 9
        TMP102 = 0x48                                # ADD0 to ground
        TEMPERATURE_REGISTER = 0x00

        while True:
            try:
                data = i2c.readfrom_mem(TMP102, TEMPERATURE_REGISTER, 2)   # register number, then two bytes
            except OSError:                          # nobody acknowledged
                print("TMP102 did not answer")
                time.sleep(1)
                continue
            raw = ((data[0] << 8) | data[1]) >> 4    # 12 data bits in the top of 16
            if raw & 0x800:                          # bit 11 is the sign: two's complement
                raw -= 0x1000
            print("%.4f C" % (raw * 0.0625))
            time.sleep(1)
      `,
      output: `
        23.1875 C
        23.2500 C
      `,
      notes: ['The two reads in the C++ version are separate statements on purpose: C++ does not say in which order the two Wire.read() calls inside one expression run.', 'The TMP102 has four addresses (0x48 to 0x4B) chosen by where its ADD0 pin is tied: ground, V+, SDA or SCL.']
    }
  ],
  examples: [
    {
      title: 'Reading an address off a logic analyser',
      q: 'A logic analyser shows the first byte of a transfer as 0x91. Which part is called, and does the controller read or write?',
      steps: ['The low bit of the first byte is the direction: 0x91 is binary 1001 0001, so the low bit is 1 — a **read**.', 'The other seven bits are the address: shift right once, $\\texttt{0x91} \\gg 1 = \\texttt{0x48}$.', 'Address 0x48 is where a TMP102 (or an ADS1115 or LM75) sits.'],
      a: 'A read from address 0x48. The matching write byte would be 0x90; Arduino and MicroPython always use the 7-bit form, 0x48.'
    }
  ],
  quiz: [
    { q: 'During the ninth clock pulse of the address byte, SDA stays high. What does that tell the controller?', choices: ['The part is busy', 'Nobody acknowledged: no part with that address answered', 'The part is asleep but will answer later', 'The clock is too fast'], a: 1, why: 'The acknowledge is a part pulling SDA low. A high level — NACK — on the address byte means no part owns that address (or it is not powered or not connected).' },
    { q: 'A controller reads three bytes from a part. Which acknowledge pattern does it send after them?', choices: ['ACK, ACK, ACK', 'NACK, NACK, NACK', 'ACK, ACK, NACK', 'NACK, ACK, ACK'], a: 2, why: 'The controller acknowledges every byte it wants more of; the NACK after the last byte tells the part to stop sending, so it releases SDA for the STOP.' },
    { q: 'Wire.begin(0x48) on an ESP32 sets the sensor address to use.', a: false, why: 'With a single argument Wire.begin makes the ESP itself a target (a peripheral) answering to that address. To use pins write Wire.begin(sda, scl); the sensor\'s address goes in beginTransmission().' },
    { q: 'How many SCL clock pulses does one data byte and its acknowledge take?', choices: ['8', '9', '10', '16'], a: 1, why: 'Eight clocks for the bits and a ninth for the acknowledge — which is why the ceiling at 400 kHz is about 44 000 bytes a second.' }
  ],
  applications: [
    'Environmental sensors — temperature, humidity, pressure, air quality — on one pair of wires.',
    'Small OLED displays at 128 × 64 pixels, character LCDs with an I2C backpack and real-time clock chips.',
    'Motion sensors: accelerometers, gyroscopes and magnetometers on breakout boards.',
    'Touch-screen controllers, fuel gauges and port expanders inside finished products.'
  ],
  sources: [
    'NXP, *UM10204: I2C-bus specification and user manual*: bus conditions, timing and the 7-bit address space.',
    'Espressif, *ESP-IDF Programming Guide*: I2C API reference; Arduino core for ESP32 documentation, *Wire* (I2C), core 3.3.',
    'Texas Instruments, *TMP102 datasheet*: the pointer and temperature registers, addresses.'
  ],
  sim: 'ub-i2c'
},

/* ================================================================ i2c-addresses-and-scanning */
{
  id: 'i2c-addresses-and-scanning',
  parent: 'uart-i2c-spi',
  title: 'I2C addresses and scanning',
  level: 2,
  short: 'Every part answers to one 7-bit address, and a scan asks all 112 of them who is there. Datasheets write the address two ways, popular parts share addresses, and two identical sensors need an address pin, a second bus or a multiplexer.',
  keywords: ['I2C scan', 'address', '0x3C', '0x68', '0x76', 'address conflict', 'TCA9548A', 'multiplexer', 'AD0', 'ADDR', '7-bit', '8-bit address', 'Wire1', 'SoftI2C', 'i2c.scan', 'i2cdetect', 'two sensors same address'],
  prereq: ['i2c'],
  related: ['i2c-pull-ups-and-bus-problems', 'registers-and-datasheets', 'oled-ssd1306', 'lcd-i2c-backpack', 'io-expanders-and-shift-registers', 'grove-system', 'sparkfun-thing-plus-and-qwiic', 'reading-sensors-reliably'],
  body: `Every I2C part answers to one **7-bit address**. Seven bits give 128 values, but a few at each end are reserved (the general call and some special modes), which leaves **112 usable addresses, 0x08 to 0x77**. The address is a name, not a place: any part may sit anywhere on the bus, and the controller finds it by calling that name.

### Two ways to write the same address

Datasheets often print the address *as the first byte on the wire*, with the read/write bit included: 0x78 to write and 0x79 to read for the OLED that Arduino and MicroPython call 0x3C. Libraries want the **7-bit form**. If a datasheet lists a write address and a read address that differ by one, shift right by one bit.

### Where the address comes from

A part has a fixed base address and one to three pins that choose among two to eight values: AD0, ADDR, SA0, A0 to A2. A typical page of popular parts:

| Address | Usual parts | Notes |
|---|---|---|
| 0x23 or 0x5C | BH1750 light sensor | ADDR pin |
| 0x29 | VL53L0X, VL53L1X distance sensors; TSL2591 light | the distance sensors can be re-addressed |
| 0x3C or 0x3D | SSD1306 or SH1106 OLED | a solder jumper |
| 0x40 | INA219, INA226 current monitors; PCA9685 PWM; HTU21D, SHT21, Si7021 humidity | many parts share it |
| 0x48 to 0x4B | ADS1115 ADC; TMP102, LM75 temperature | ADDR or ADD0 pin |
| 0x50 to 0x57 | AT24C EEPROMs | A0 to A2 pins |
| 0x68 or 0x69 | MPU6050, MPU9250, ICM-20948 motion; DS3231, DS1307 clocks | **clash**: the clocks do not move |
| 0x70 to 0x77 | TCA9548A multiplexer; HT16K33 LED driver | A0 to A2 pins |
| 0x76 or 0x77 | BME280, BMP280, BME680; BMP180, BMP388 | SDO pin |

Clones and revisions differ: believe the scan and the datasheet of your board, not the table.

### Scanning

A scan sends a START, each address with the write bit, and notes which ones acknowledge; at 100 kHz all 112 take about 12 ms. It shows that *something* answers at an address, not what it is: compare with the table. If it finds nothing, check power, ground, whether SDA and SCL are swapped, that the pins in the program are the pins on the board, and the pull-ups ([[i2c-pull-ups-and-bus-problems]]).

### Two parts, one address

If two parts answer the same address, both reply and the bus carries a mixture. In order of preference: **move one** with its address pin or jumper; put one on a **second bus** (the ESP32, S2, S3, H2 and P4 have two I2C controllers, the C3, C6, C5, C61 and C2 only one); use a **multiplexer** such as the TCA9548A, which connects one of eight downstream buses when you write it a single byte with bit n set; choose a part whose address can be changed in software; or run MicroPython's software I2C on other pins.

> [!key] A part answers to a 7-bit address, 0x08 to 0x77; datasheets sometimes print it shifted left by one. A scan lists who answers; when two parts share an address, move one with its pin, use a second bus or switch between them with a multiplexer.`,
  ideas: [
    'There are 112 usable 7-bit addresses (0x08 to 0x77); Arduino and MicroPython take the 7-bit form, which is half of the "write address" some datasheets print.',
    'Popular parts have a base address and one to three pins that select among a few: an OLED at 0x3C or 0x3D, an IMU at 0x68 or 0x69, a BME280 at 0x76 or 0x77.',
    'A scan acknowledges each address and shows which answer; it tells you where something is, not what.',
    'Clashing addresses are cured with an address pin, a second bus, a multiplexer, or a part whose address can be changed.'
  ],
  pitfalls: [
    'The datasheet says 0x78, so the library address is 0x78 — Many datasheets include the read/write bit in the printed address. Shift it right by one: the OLED that prints 0x78 is at 0x3C.',
    'A scan that lists an address proves the part works — It proves that something acknowledged. The part may be the wrong one, in a wrong mode or half broken; reading its ID register is the real test ([[registers-and-datasheets]]).',
    'Two sensors of the same type simply share the bus — Unless their address pins differ they answer together and corrupt each other\'s replies. Two MPU6050 boards with AD0 both low are exactly that.'
  ],
  terms: [
    { term: 'I2C scan', also: ['bus scan', 'i2cdetect', 'address scan'], def: 'A program that calls every address from 0x08 to 0x77 with an empty write and prints the ones that acknowledge: a quick map of what is connected.' },
    { term: 'Address pin', also: ['AD0', 'ADDR', 'SA0', 'A0 to A2'], def: 'A pin of an I2C part that chooses one of a few addresses depending on whether it is tied to ground, to the supply or to a data line.' },
    { term: 'Address conflict', also: ['address clash'], def: 'Two parts on one bus that answer the same address. Both reply at once and the controller reads a corrupted mixture, or a transfer fails.' },
    { term: 'I2C multiplexer', also: ['TCA9548A', 'bus switch'], def: 'A part that connects the main bus to one or more of several downstream buses, chosen by a control byte. It lets identical parts share an address by living on different channels.' }
  ],
  code: [
    {
      title: 'Scan the bus',
      about: 'Calls every address and prints the ones that answer. It is the first program to run on any new I2C wiring.',
      needs: 'An ESP32 DevKit and any I2C part. On an S3 or C3 change the pins to 8 and 9.',
      wiring: [['GPIO21', 'SDA of the part'], ['GPIO22', 'SCL of the part'], ['3V3', 'VCC'], ['GND', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (100000) Hz
          set [found v] to (0)
          for each [address v] in (numbers from (8) to (119))
            if <I2C device at address (address) answers> then
              print (join [found 0x] (hex of (address)))
              change [found v] by (1)
            end
          end
          print (join (found) [ device(s) found])
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);
          delay(1000);
          int found = 0;
          for (uint8_t address = 0x08; address <= 0x77; address++) {
            Wire.beginTransmission(address);
            if (Wire.endTransmission() == 0) {       // 0: somebody acknowledged
              Serial.printf("found 0x%02X\n", address);
              found++;
            }
          }
          Serial.printf("%d device(s) found\n", found);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        found = i2c.scan()                           # the addresses from 0x08 to 0x77 that acknowledged
        for address in found:
            print("found 0x%02X" % address)
        print(len(found), "device(s) found")
      `,
      output: `
        found 0x3C
        found 0x68
        found 0x76
        3 device(s) found
      `,
      notes: ['Run it with only one part connected at first: a lone address is easy to identify, and a part that seems to answer at two addresses is two parts.', 'Nothing found? Check the supply and ground, whether SDA and SCL are swapped, and that the pin numbers in the code are the pins on your board.']
    },
    {
      title: 'Scan behind a multiplexer',
      about: 'A TCA9548A at 0x70 connects one of eight downstream buses when it receives one byte. This opens each channel in turn and scans it, so two identical sensors on different channels can be told apart.',
      needs: 'An ESP32 DevKit, a TCA9548A board (A0, A1, A2 to ground) and one or more I2C parts on its channels.',
      wiring: [['GPIO21', 'TCA9548A SDA'], ['GPIO22', 'TCA9548A SCL'], ['3V3', 'VIN'], ['GND', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (100000) Hz
          for each [channel v] in (numbers from (0) to (7))
            I2C write ((2) ^ (channel)) to address (0x70)        // bit n set connects channel n
            for each [address v] in (numbers from (8) to (119))
              if <<I2C device at address (address) answers> and <(address) ≠ (112)>> then
                print (join [channel ] (channel) [: 0x] (hex of (address)))
              end
            end
          end
          I2C write (0) to address (0x70)
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t MUX = 0x70;                    // TCA9548A with A0, A1, A2 to ground

        void selectChannel(uint8_t channel) {
          Wire.beginTransmission(MUX);
          Wire.write((uint8_t)(1 << channel));       // one byte: bit n set connects channel n
          Wire.endTransmission();
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);
          delay(1000);
          for (uint8_t channel = 0; channel < 8; channel++) {
            selectChannel(channel);
            for (uint8_t address = 0x08; address <= 0x77; address++) {
              if (address == MUX) continue;
              Wire.beginTransmission(address);
              if (Wire.endTransmission() == 0) Serial.printf("channel %d: 0x%02X\n", channel, address);
            }
          }
          Wire.beginTransmission(MUX);
          Wire.write((uint8_t)0);                    // disconnect every channel
          Wire.endTransmission();
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        MUX = 0x70                                   # TCA9548A with A0, A1, A2 to ground

        for channel in range(8):
            i2c.writeto(MUX, bytes([1 << channel]))  # one byte: bit n set connects channel n
            for address in i2c.scan():
                if address != MUX:
                    print("channel", channel, "found 0x%02X" % address)
        i2c.writeto(MUX, b"\x00")                    # disconnect every channel
      `,
      output: `
        channel 0: 0x68
        channel 1: 0x68
      `,
      notes: ['Two identical MPU6050 boards on channels 0 and 1 both show as 0x68 — and now each can be reached by selecting its channel first.', 'Select the channel before every use of a part behind the multiplexer; the choice stays until the next control byte.']
    }
  ],
  examples: [
    {
      title: 'A clock and an IMU on one bus',
      q: 'A project has an MPU6050 motion sensor and a DS3231 clock board, both at 0x68, on one I2C bus of an ESP32-C3. What are the ways out?',
      steps: ['The MPU6050 breakout has an AD0 pin: tied high, it moves the sensor to 0x69. That is the cheapest cure — one wire or a solder jumper.', 'The DS3231 has no address pin, so the clock cannot move.', 'A second bus is not available: the C3 has one I2C controller (the same trick would work on an ESP32 or S3, which have two).', 'A TCA9548A multiplexer would also work, costing a part and a channel-select call before every use.'],
      a: 'Tie the MPU6050\'s AD0 high so it answers at 0x69; the clock stays at 0x68.'
    }
  ],
  quiz: [
    { q: 'How many usable 7-bit I2C addresses are there, without the reserved ones?', choices: ['127', '112', '128', '256'], a: 1, why: 'Seven bits give 128 values, but 0x00 to 0x07 and 0x78 to 0x7F are reserved, leaving 0x08 to 0x77: 112.' },
    { q: 'A datasheet gives the OLED\'s write address as 0x78 and its read address as 0x79. Which address does the scan print and the library use?', choices: ['0x78', '0x79', '0x3C', '0x3D'], a: 2, why: 'The printed values include the read/write bit; shifted right by one, both become 0x3C, which is the 7-bit address that Arduino and MicroPython use.' },
    { q: 'Two MPU6050 boards, both with AD0 low, are on one bus. What happens?', choices: ['The scan shows two addresses', 'Both answer at 0x68 and their replies collide', 'The second board is ignored', 'The ESP chooses automatically'], a: 1, why: 'Addresses are not assigned by the bus: two parts with the same address both answer, so the controller reads a corrupted mixture. Move one with its address pin or use a multiplexer.' },
    { q: 'A scan finds nothing at all. Which is the least useful first check?', choices: ['Power and ground of the part', 'Whether SDA and SCL are swapped', 'Rewriting the sensor library', 'That the pin numbers in the code match the wiring'], a: 2, why: 'A scan does not use a sensor library: it only needs the bus to work. A dead scan is a wiring, power, pin or pull-up problem.' }
  ],
  applications: [
    'The first test of any new breakout board: plug it in, scan, compare with the datasheet.',
    'Putting several identical sensors — soil moisture probes, distance sensors, IMUs — on one ESP through a TCA9548A.',
    'Finding out which of two OLED variants (0x3C or 0x3D) a cheap board really is.',
    'Debugging a product that works on the bench and not in the field: the scan shows which part has dropped out.'
  ],
  sources: [
    'NXP, *UM10204: I2C-bus specification and user manual*: addressing and the reserved addresses.',
    'Texas Instruments, *TCA9548A datasheet*: the control register and address selection.',
    'MicroPython documentation: class *machine.I2C* (scan, writeto, readfrom_mem), version 1.29; Arduino core *Wire* documentation, core 3.3.'
  ],
  sim: { id: 'ub-i2c', params: { mode: 'nack', addr: 0x3D } }
},

/* ================================================================ i2c-pull-ups-and-bus-problems */
{
  id: 'i2c-pull-ups-and-bus-problems',
  parent: 'uart-i2c-spi',
  title: 'I2C pull-ups and bus problems',
  level: 2,
  short: 'The pull-up resistor and the wire capacitance set how fast an I2C line rises. Too weak and the bus fails at speed, too strong and parts cannot pull low; add a 5 V module, a long cable or a reset in mid-transfer and the bus can hang.',
  keywords: ['pull-up', 'pull-up resistor', 'rise time', 'bus capacitance', '4.7k', '2.2k', '10k', 'stuck bus', 'SDA low', 'bus recovery', 'nine clock pulses', 'level shifter', 'long wires', 'I2C not working', 'timeout', 'internal pull-up'],
  prereq: ['i2c', 'pull-ups-and-pull-downs', 'electronics:rc-transient'],
  related: ['i2c-addresses-and-scanning', 'level-shifters', 'three-volt-logic', 'isolation-and-long-cables', 'the-oscilloscope', 'the-logic-analyser', 'fault-finding-method', 'electronics:pull-resistors'],
  body: `I2C lines are open-drain: a part can pull SDA or SCL low, but nothing drives them high — a **pull-up resistor** does, and that resistor, with the capacitance of wires and pins, decides how fast the line rises. Too weak and the edges are slow and rounded, so the bus fails at higher speeds or with longer wires. Too strong and the parts cannot pull the line low. Most "I2C does not work" stories are one of these.

### The window for the resistor

The line charges through R into the bus capacitance C, and the 30 %-to-70 % rise takes **0.8473 × R × C**. The specification allows 1000 ns at 100 kHz, 300 ns at 400 kHz and 120 ns at 1 MHz, and at most 400 pF of bus capacitance. At the other end a part must pull the line below 0.4 V with 3 mA, so R must be at least (3.3 V − 0.4 V) / 3 mA = 967 Ω (1.53 kΩ at 5 V). The largest R at 3.3 V:

| Bus capacitance | at 100 kHz | at 400 kHz |
|---|---|---|
| 50 pF | 23.6 kΩ | 7.1 kΩ |
| 100 pF | 11.8 kΩ | 3.5 kΩ |
| 200 pF | 5.9 kΩ | 1.8 kΩ |
| 400 pF | 2.9 kΩ | 0.9 kΩ — below the minimum: slow down |

So 4.7 kΩ suits 100 kHz on a short bus, and 2.2 kΩ to 3.3 kΩ suits 400 kHz. [The signal lab](#/tools/signals/i2c) and the simulation show the rounded edge.

### Who provides the resistors

- **Breakout boards** often carry their own pull-ups, typically 4.7 kΩ or 10 kΩ, and they all end up in parallel: four boards with 4.7 kΩ make 1.2 kΩ; ten make 470 Ω, under the minimum. Remove the extras (usually a solder jumper).
- **The ESP's internal pull-up** is some 45 kΩ: a short bus with one part may work at 100 kHz on the bench and fail with another board or a longer wire. Do not rely on it.

### 5 V parts on a 3.3 V bus

Many breakouts have a 5 V regulator and pull-ups to 5 V. The lines then idle at 5 V, above what ESP pins tolerate ([[three-volt-logic]]). Power the board from 3.3 V (most accept 3 to 5 V), remove pull-ups tied to 5 V, or put a bidirectional level shifter between the two sides ([[level-shifters]]).

### Long wires and a stuck bus

Cable capacitance (roughly 50 to 100 pF a metre) uses up the budget: keep I2C inside the box, slow the clock and stiffen the pull-ups for longer runs, and use [[rs-485]] or CAN beyond a metre or two. If the ESP resets in the middle of a transfer, a part may be left holding SDA low, waiting for clocks; every call then times out. **Nine clock pulses on SCL, then a STOP,** frees it — the program below does exactly that — or switch the part's power.

> [!key] The pull-up must be strong enough to meet the rise time for your speed and capacitance, and weak enough for the parts to pull the line below 0.4 V: roughly 1 kΩ to 5 kΩ for 3.3 V. Count the pull-ups on every board, keep 5 V off the ESP's pins, and clock a stuck bus free with nine pulses.`,
  ideas: [
    'The pull-up and the bus capacitance set the rise time, tr = 0.8473 R C; it must stay under 1000 ns at 100 kHz and 300 ns at 400 kHz.',
    'The resistor has a floor as well as a ceiling: parts must pull the line below 0.4 V with 3 mA, so R is at least about 1 kΩ at 3.3 V.',
    'Pull-ups on several breakout boards are in parallel; too many make the bus too strong, and the ESP\'s internal pull-up (about 45 kΩ) is too weak to rely on.',
    'A 5 V pull-up puts 5 V on ESP pins; a part left holding SDA low after a reset is freed with nine clock pulses and a STOP.'
  ],
  pitfalls: [
    'More pull-ups make the bus more reliable — Each board\'s resistor is in parallel with the rest. Ten boards with 4.7 kΩ pull-ups are 470 Ω, which the parts cannot pull below the low threshold. Fit one or two sets.',
    'The ESP\'s internal pull-ups are enough — At roughly 45 kΩ they give a 3.8 µs rise on 100 pF — four times too slow even for 100 kHz. A single sensor an inch away may work; the bus will not survive growth.',
    'It worked yesterday, so the bus is fine — An intermittent fault is often a part left holding SDA low by a reset, or a loose wire. A bus that hangs only sometimes needs recovery code and a look at the wiring, not another delay.'
  ],
  terms: [
    { term: 'Pull-up resistor', also: ['pull-up'], def: 'A resistor from a line to the supply that holds it high when no output pulls it low. I2C needs one on each of SDA and SCL, typically 2.2 kΩ to 10 kΩ.' },
    { term: 'Rise time', also: ['tr', '30 %–70 % rise time'], def: 'The time a line takes to rise from 30 % to 70 % of the supply. On I2C it is 0.8473 times the pull-up resistance times the bus capacitance, and the specification caps it at 1000 ns, 300 ns or 120 ns by speed.' },
    { term: 'Bus capacitance', also: ['line capacitance'], def: 'The total capacitance on SDA or SCL: pins of every part, the tracks and the wires, roughly 50 to 100 pF a metre of cable. The standard and fast modes allow up to 400 pF.' },
    { term: 'Stuck bus', also: ['bus hang', 'SDA stuck low', 'bus lock-up'], def: 'An I2C bus on which a part holds SDA (or SCL) low, usually after the controller reset in mid-transfer. No transfer can start until it is released.' },
    { term: 'Bus recovery', also: ['nine-clock recovery'], def: 'Toggling SCL up to nine times while watching SDA until the part lets go, then sending a STOP. It completes the byte the part thought was still in progress.' }
  ],
  choose: {
    good: ['2.2 kΩ to 3.3 kΩ pull-ups for a 400 kHz bus a few centimetres long', '4.7 kΩ for a 100 kHz bus with a handful of parts', 'One set of pull-ups for the whole bus, on the controller board or one breakout'],
    avoid: ['Relying on the ESP\'s internal pull-ups', 'Leaving the pull-ups of ten breakout boards in parallel', 'Pull-ups to 5 V on a bus connected to ESP pins', 'Several metres of jumper wire at 400 kHz'],
    check: ['The combined pull-up (resistors in parallel) against the 967 Ω minimum', 'The rise time on an oscilloscope or logic analyser if the bus is flaky', 'That a reset in mid-transfer is survived: recover the bus at start-up']
  },
  code: [
    {
      title: 'Free a stuck bus',
      about: 'If a part holds SDA low after a reset, the bus is dead until it is freed. This sends up to nine clock pulses on SCL until SDA is released, then a STOP, and then starts the normal bus. Run it at the start of every program that talks to I2C parts.',
      needs: 'An ESP32 DevKit and an I2C part with proper pull-ups. On an S3 or C3 change the pins to 8 and 9.',
      wiring: [['GPIO21', 'SDA, with a pull-up to 3V3'], ['GPIO22', 'SCL, with a pull-up to 3V3']],
      blocks: `
        define free the bus
          set pin (21) as [input with pull-up v]
          set pin (22) as [open-drain output v]
          set pin (22) to [HIGH v]
          set [pulses v] to (0)
          repeat until <<(read pin (21)) = [HIGH v]> or <(pulses) = (9)>>
            set pin (22) to [LOW v]
            wait (0.00001) seconds
            set pin (22) to [HIGH v]
            wait (0.00001) seconds
            change [pulses v] by (1)
          end
          make an I2C STOP on SDA (21) and SCL (22) :: bus

        when started
          start serial at (115200) baud
          free the bus :: my
          start I2C on SDA (21) SCL (22) at (100000) Hz
          print [bus is ready]
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;

        // Up to nine clock pulses while SDA is held low, then a STOP. True when SDA ends up high.
        bool freeI2cBus() {
          pinMode(SDA_PIN, INPUT_PULLUP);            // let go of SDA; the pull-up lifts it
          pinMode(SCL_PIN, OUTPUT_OPEN_DRAIN);       // pull SCL low, or let it float high
          digitalWrite(SCL_PIN, HIGH);
          delayMicroseconds(10);
          for (int i = 0; i < 9 && digitalRead(SDA_PIN) == LOW; i++) {
            digitalWrite(SCL_PIN, LOW);  delayMicroseconds(10);
            digitalWrite(SCL_PIN, HIGH); delayMicroseconds(10);
          }
          digitalWrite(SCL_PIN, LOW);    delayMicroseconds(10);   // a STOP: SDA rises while SCL is high
          pinMode(SDA_PIN, OUTPUT_OPEN_DRAIN);
          digitalWrite(SDA_PIN, LOW);    delayMicroseconds(10);
          digitalWrite(SCL_PIN, HIGH);   delayMicroseconds(10);
          digitalWrite(SDA_PIN, HIGH);   delayMicroseconds(10);
          pinMode(SDA_PIN, INPUT_PULLUP);
          return digitalRead(SDA_PIN) == HIGH;
        }

        void setup() {
          Serial.begin(115200);
          Serial.println(freeI2cBus() ? "bus is free" : "SDA is still low: switch the part's power off and on");
          Wire.begin(SDA_PIN, SCL_PIN, 100000);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        SDA_PIN, SCL_PIN = 21, 22

        def free_i2c_bus():
            """Up to nine clock pulses while SDA is held low, then a STOP. True when SDA ends up high."""
            sda = Pin(SDA_PIN, Pin.OPEN_DRAIN, Pin.PULL_UP, value=1)   # let go of SDA
            scl = Pin(SCL_PIN, Pin.OPEN_DRAIN, value=1)                # 0 pulls low, 1 lets it float high
            time.sleep_us(10)
            for _ in range(9):
                if sda.value():
                    break
                scl.value(0)
                time.sleep_us(10)
                scl.value(1)
                time.sleep_us(10)
            scl.value(0)                             # a STOP: SDA rises while SCL is high
            time.sleep_us(10)
            sda.value(0)
            time.sleep_us(10)
            scl.value(1)
            time.sleep_us(10)
            sda.value(1)
            time.sleep_us(10)
            return sda.value() == 1

        print("bus is free" if free_i2c_bus() else "SDA is still low: switch the part's power off and on")
        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=100000)
      `,
      output: `
        bus is free
      `,
      notes: ['If SDA is still low after nine pulses the part has locked up for good; only cutting its power helps. A GPIO that switches the part\'s supply through a MOSFET makes that possible in software.', 'The open-drain output mode lets a pin pull low or float; the external pull-up supplies the high level, exactly as a part on the bus would.']
    }
  ],
  formulas: [
    {
      name: 'Rise time of an I2C line',
      expr: 'tr = 0.8473*R*C',
      tex: 't_r = 0.8473 \\, R \\, C',
      vars: {
        tr: { name: 'rise time (30 % to 70 %)', tex: 't_r', q: 'time', unit: 'ns' },
        R: { name: 'pull-up resistance', q: 'resistance', unit: 'kΩ', value: 4.7 },
        C: { name: 'bus capacitance', q: 'capacitance', unit: 'pF', value: 100 }
      },
      solveFor: 'tr',
      note: 'The limits are 1000 ns at 100 kHz, 300 ns at 400 kHz and 120 ns at 1 MHz. Solve for R to find the largest pull-up a given capacitance allows.',
      stories: { tr: 'A bus with a {R} pull-up and {C} of capacitance. How long does the line take to rise from 30 % to 70 %?', R: 'The rise time must be at most {tr} with {C} on the bus. How large may the pull-up be?' },
      practice: { unknowns: ['tr', 'R'] }
    },
    {
      name: 'Smallest pull-up the parts can pull down',
      expr: 'Rmin = (Vs - Vol)/Iol',
      tex: 'R_{\\mathrm{min}} = \\frac{V_s - V_{OL}}{I_{OL}}',
      vars: {
        Rmin: { name: 'smallest pull-up', tex: 'R_{\\mathrm{min}}', q: 'resistance', unit: 'Ω' },
        Vs: { name: 'bus supply', tex: 'V_s', q: 'voltage', unit: 'V', value: 3.3 },
        Vol: { name: 'low level the part must reach', tex: 'V_{OL}', q: 'voltage', unit: 'V', value: 0.4 },
        Iol: { name: 'current a part can sink', tex: 'I_{OL}', q: 'current', unit: 'mA', value: 3 }
      },
      solveFor: 'Rmin',
      note: 'The I2C specification asks that a part pulls the line to 0.4 V or less while sinking 3 mA (more for fast-mode plus). Parallel pull-ups on several boards must not go below this value.',
      stories: { Rmin: 'A bus runs at {Vs}. Parts must reach {Vol} while sinking {Iol}. What is the smallest total pull-up?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the resistor',
      q: 'A 3.3 V bus runs at 400 kHz and measures 150 pF. Choose a pull-up from the E12 series.',
      steps: ['Smallest allowed: $(3.3 - 0.4) / 0.003 = 967\\ \\Omega$.', 'Largest allowed: $t_r / (0.8473 \\, C) = 300\\ \\text{ns} / (0.8473 \\times 150\\ \\text{pF}) = 2.36\\ \\text{k}\\Omega$.', 'E12 values inside 0.97 kΩ to 2.36 kΩ are 1.0, 1.2, 1.5, 1.8 and 2.2 kΩ. Take 1.8 kΩ: the rise time is $0.8473 \\times 1800 \\times 150\\ \\text{pF} = 229$ ns, comfortably under 300 ns, and the current when low is 1.8 mA.'],
      a: 'About 1.8 kΩ in total, counting every board\'s own pull-ups in parallel.'
    }
  ],
  quiz: [
    { q: 'A 3.3 V bus of 100 pF runs at 400 kHz. Which single pull-up value meets the 300 ns rise time?', choices: ['47 kΩ', '10 kΩ', '4.7 kΩ', '2.2 kΩ'], a: 3, why: 'The rise time is 0.8473 R C. With 100 pF, 4.7 kΩ gives 398 ns (too slow), 10 kΩ gives 847 ns; only 2.2 kΩ (186 ns) is under 300 ns.' },
    { q: 'Ten breakout boards, each with its own 4.7 kΩ pull-ups, share a bus. Why may the bus fail?', choices: ['The pull-ups together are too weak', 'The pull-ups in parallel make about 470 Ω, below what the parts can pull low', 'Ten boards exceed the address space', 'The resistors overheat'], a: 1, why: 'Resistors in parallel divide: 4.7 kΩ / 10 = 470 Ω, under the 967 Ω minimum at 3.3 V. The parts can no longer pull the line below 0.4 V. Remove all but one or two sets.' },
    { q: 'A breakout board with pull-ups to its own 5 V supply is safe to connect to ESP32 SDA and SCL.', a: false, why: 'The pull-ups hold both lines at 5 V when idle, above the ESP pins\' limit. Power the board from 3.3 V, remove those pull-ups or use a level shifter.' },
    { q: 'After a watchdog reset in the middle of a transfer, every I2C call times out and SDA reads low. What is the standard cure?', choices: ['Increase the clock speed', 'Send up to nine clock pulses on SCL, then a STOP', 'Add a longer delay before each call', 'Change the sensor\'s address'], a: 1, why: 'A part that was sending a byte keeps SDA low until it has had its clocks. Nine pulses finish any byte, the part releases SDA and a STOP returns the bus to idle.' }
  ],
  applications: [
    'Getting a bus with a dozen sensors and a display to run at 400 kHz without errors.',
    'Fixing the board that works with one sensor and fails when a second breakout is plugged in.',
    'Making a battery-powered logger recover on its own after a brownout reset in the middle of a transfer.',
    'Choosing pull-ups for a custom PCB before the first prototype is built.'
  ],
  sources: [
    'NXP, *UM10204: I2C-bus specification and user manual*: electrical characteristics, rise time limits, the bus capacitance limit and the pull-up calculation.',
    'Texas Instruments, application notes on the I2C bus and on calculating its pull-up resistors (a worked version of the same formulas).',
    'Espressif, *ESP-IDF Programming Guide*: I2C API reference, notes on pull-ups and bus recovery.'
  ],
  sim: 'ub-pullup'
},

/* ================================================================ spi */
{
  id: 'spi',
  parent: 'uart-i2c-spi',
  title: 'SPI',
  level: 1,
  short: 'Four wires and a clock that can run at tens of megahertz: every pulse shifts one bit out and one bit in, and a chip-select wire picks the peripheral. The bus of displays, SD cards, flash chips and fast converters.',
  keywords: ['SPI', 'MOSI', 'MISO', 'SCK', 'CS', 'SS', 'chip select', 'COPI', 'CIPO', 'full duplex', 'shift register', 'SPI.begin', 'SPI.transfer', 'beginTransaction', 'HSPI', 'VSPI', 'FSPI', 'dummy byte', 'JEDEC ID'],
  prereq: ['serial-communication-basics', 'digital-output'],
  related: ['spi-modes-and-speed', 'sd-cards', 'display-interfaces', 'colour-tft-displays', 'oled-ssd1306', 'e-paper', 'io-expanders-and-shift-registers', 'electronics:serial-buses', 'electronics:shift-registers'],
  body: `**SPI** (serial peripheral interface) is the bus you reach for when speed matters. Between a controller and a peripheral it uses a clock, **SCK**; a data line out, **MOSI**; a data line in, **MISO**; and a **chip select**, **CS** (also called SS), that says "you, now". There are no addresses and no acknowledgements: just bits shifted at the pace of the clock, from kilohertz to tens of megahertz. Displays, SD cards, flash chips, fast converters and radios use it.

### An exchange of bytes

Picture an 8-bit shift register in each device, joined in a ring: MOSI carries the controller's output into the peripheral, MISO the peripheral's output back. Each clock pulse moves every bit along by one place. After eight pulses the two registers have swapped contents, so **every SPI transfer is an exchange**: to read a byte you must send one (a *dummy byte*, often 0x00 or 0xFF), and when you write you receive a byte that you may ignore. [The signal lab](#/tools/signals/spi) shows the four wires.

### Chip select, and commands

The controller pulls a peripheral's CS **low** to select it, usually for one whole *transaction* of several bytes, and raises it when done. A deselected peripheral ignores the clock and lets go of MISO. One CS wire per peripheral is the price of having no addresses. SPI defines only wires and timing, not the meaning of the bytes: the first byte is normally a command, and its code belongs to the chip. A flash chip asked 0x9F answers with three ID bytes; an accelerometer asked for register 0x00 returns its ID.

### Speed and pins

The bus moves one byte per eight clocks, so 1 MHz carries 125 kB/s, 10 MHz 1.25 MB/s and 40 MHz 5 MB/s — far beyond I2C. An SD card runs up to 25 MHz, flash chips faster, colour displays at 20 to 40 MHz, sensors at 1 to 10 MHz; the ESP's own limit is 80 MHz on the dedicated pins and 40 MHz when routed through the GPIO matrix. These are the Arduino default pins:

| Chip | SPI buses | MOSI | MISO | SCK | CS |
|---|---|---|---|---|---|
| ESP32 | 2 | GPIO23 | GPIO19 | GPIO18 | GPIO5 |
| ESP32-S2 | 2 | GPIO35 | GPIO37 | GPIO36 | GPIO34 |
| ESP32-S3 | 2 | GPIO11 | GPIO13 | GPIO12 | GPIO10 |
| ESP32-C3 | 1 | GPIO6 | GPIO5 | GPIO4 | GPIO7 |
| ESP32-C6 | 1 | GPIO19 | GPIO20 | GPIO21 | GPIO18 |

On the original ESP32 GPIO6 to GPIO11 are the flash chip's own SPI wires: never use them. Bus names (HSPI, VSPI, FSPI) differ by chip; \`SPI\` means the default one.

### Wiring

Unlike a UART, SPI is **not crossed**: MOSI goes to the peripheral's input (labelled MOSI, SDI, DIN or COPI) and MISO to its output (MISO, SDO, DOUT or CIPO). Keep the wires short, share the ground, and keep unused CS lines high. No pull-ups are needed.

> [!key] SPI shifts bits out on MOSI and in on MISO with every clock pulse, so every transfer is an exchange; a chip-select wire for each peripheral replaces addresses. It is the fast bus: at 10 MHz it moves some thirty times the data of I2C at 400 kHz, which is why displays and memory cards depend on it.`,
  ideas: [
    'SPI uses a clock (SCK), a data line each way (MOSI, MISO) and one chip-select wire per peripheral; there are no addresses and no acknowledgements.',
    'Every clock pulse shifts a bit out and a bit in, so a transfer is always an exchange: to read you send a dummy byte.',
    'The controller pulls CS low to select a peripheral for a transaction; a deselected peripheral ignores the clock and releases MISO.',
    'SPI defines only wires and timing; the commands are the chip\'s. Clocks run from 1 to 80 MHz: at 10 MHz it moves some 30 times the data of I2C at 400 kHz.'
  ],
  pitfalls: [
    'MOSI crosses over to MISO like TX and RX — MOSI means "controller out, peripheral in": it goes straight to the peripheral pin that takes data (MOSI, SDI, DIN, COPI). MISO goes straight to the peripheral\'s output. Only the loopback test joins them.',
    'SPI reports an error when the chip is missing — It does not. A missing, unpowered or wrongly wired chip reads back as all 0xFF or all 0x00 with no complaint; read an ID register first to prove the chip is there.',
    'CS can be tied low to save a pin — Some simple parts allow it, but flash chips, SD cards, displays and most sensors use the falling and rising edges of CS to frame each command. Leave it to the program.'
  ],
  terms: [
    { term: 'SPI', also: ['serial peripheral interface', 'four-wire bus'], def: 'A clocked serial bus with a data line each way and one chip select per peripheral, in which the controller shifts bits out and in at the same time on every clock pulse.' },
    { term: 'Chip select', also: ['CS', 'SS', 'nCS', 'slave select'], def: 'The wire, normally active low, with which the controller selects one peripheral for a transaction. A peripheral that is not selected ignores the clock and releases the data-out line.' },
    { term: 'MOSI and MISO', also: ['COPI and CIPO', 'SDI and SDO', 'DIN and DOUT'], def: 'MOSI carries data from controller to peripheral, MISO from peripheral to controller. Data-in and data-out labels on a peripheral are written from its own point of view.' },
    { term: 'Full duplex', also: [], def: 'Sending and receiving at the same time. SPI is full duplex: each clock pulse moves one bit each way, so a transfer is an exchange of two bytes.' },
    { term: 'Dummy byte', also: ['filler byte'], def: 'A byte sent only to produce clock pulses so that the peripheral can answer, since SPI cannot read without also writing. Often 0x00 or 0xFF.' }
  ],
  choose: {
    good: ['Colour displays, e-paper, SD cards and flash memory: anything that moves kilobytes', 'Fast sensors and converters sampled many thousands of times a second', 'Radio modules (LoRa, nRF24L01, CC1101) and Ethernet chips'],
    avoid: ['A large number of slow sensors on a board short of pins: each costs a chip-select wire (I2C is better)', 'Long cables: SPI is for board-sized distances unless slowed right down', 'Assuming that no data means no chip: SPI never says so'],
    check: ['The clock mode and the top clock speed in the peripheral\'s datasheet ([[spi-modes-and-speed]])', 'That MOSI and MISO are joined straight, not crossed', 'That a deselected peripheral releases MISO if the bus is shared']
  },
  code: [
    {
      title: 'Loopback: an exchange with yourself',
      about: 'Join MOSI to MISO with one wire and every byte sent comes straight back: the shortest proof that the bus and the pins are right, and a clear picture of "every transfer is an exchange".',
      needs: 'An ESP32 DevKit and a jumper wire between GPIO23 (MOSI) and GPIO19 (MISO). On an S3 use 11 and 13, on a C3 6 and 5.',
      wiring: [['GPIO23', 'GPIO19', 'MOSI to MISO with one jumper wire'], ['GPIO18', 'nothing', 'SCK is only a clock here'], ['GPIO5', 'nothing', 'chip select, driven by the program']],
      blocks: `
        when started
          start serial at (115200) baud
          start SPI on SCK (18) MISO (19) MOSI (23)
          set pin (5) as [output v]
          set pin (5) to [HIGH v]            // not selected
        forever
          set pin (5) to [LOW v]
          set [answer v] to (SPI transfer (0xA5) at (1000000) Hz mode (0))
          set pin (5) to [HIGH v]
          print (join [sent A5, received ] (hex of (answer)))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>

        const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23;   // jumper wire from GPIO23 (MOSI) to GPIO19 (MISO)
        const int PIN_CS = 5;

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_CS, OUTPUT);
          digitalWrite(PIN_CS, HIGH);                // not selected
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
        }

        void loop() {
          SPI.beginTransaction(SPISettings(1000000, MSBFIRST, SPI_MODE0));
          digitalWrite(PIN_CS, LOW);
          uint8_t answer = SPI.transfer(0xA5);       // every transfer is an exchange
          digitalWrite(PIN_CS, HIGH);
          SPI.endTransaction();
          Serial.printf("sent A5, received %02X\n", answer);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import time

        cs = Pin(5, Pin.OUT, value=1)                # not selected
        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        out = bytearray(b"\xa5")
        back = bytearray(1)

        while True:
            cs(0)
            spi.write_readinto(out, back)            # every transfer is an exchange
            cs(1)
            print("sent A5, received %02X" % back[0])
            time.sleep(1)
      `,
      output: `
        sent A5, received A5
      `,
      notes: ['Pull the jumper away and the answer is usually 00 or FF (or noise): that is what a missing chip looks like on SPI.', 'In MicroPython the bus number differs between chips: SPI(2) is the VSPI bus of the ESP32; on an S3 the user buses are SPI(1) and SPI(2) too, but on a C3 only SPI(1) exists.']
    },
    {
      title: 'Ask a flash chip who it is',
      about: 'Every SPI flash chip answers the command 0x9F with three bytes: the maker, the type and the size. It proves the wiring and the mode on a real part before any data is written.',
      needs: 'An ESP32 DevKit and an SPI flash module such as a Winbond W25Q32 (3.3 V): MOSI, MISO, SCK and CS to the default pins.',
      wiring: [['GPIO23', 'flash DI (MOSI)'], ['GPIO19', 'flash DO (MISO)'], ['GPIO18', 'flash CLK'], ['GPIO5', 'flash CS'], ['3V3 and GND', 'power']],
      blocks: `
        when started
          start serial at (115200) baud
          start SPI on SCK (18) MISO (19) MOSI (23)
        forever
          set [id v] to (SPI read (3) bytes after command (0x9F) on chip select (5) at (1000000) Hz mode (0))
          print (join [manufacturer, type, capacity: ] (hex of (id)))
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>

        const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23, PIN_CS = 5;

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_CS, OUTPUT);
          digitalWrite(PIN_CS, HIGH);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
        }

        void loop() {
          SPI.beginTransaction(SPISettings(1000000, MSBFIRST, SPI_MODE0));
          digitalWrite(PIN_CS, LOW);
          SPI.transfer(0x9F);                        // command: read the JEDEC ID
          uint8_t manufacturer = SPI.transfer(0);    // dummy bytes out, the answer comes in
          uint8_t type = SPI.transfer(0);
          uint8_t capacity = SPI.transfer(0);
          digitalWrite(PIN_CS, HIGH);
          SPI.endTransaction();
          Serial.printf("manufacturer %02X, type %02X, capacity %02X\n", manufacturer, type, capacity);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import time

        cs = Pin(5, Pin.OUT, value=1)
        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))

        while True:
            cs(0)
            spi.write(b"\x9f")                       # command: read the JEDEC ID
            manufacturer, kind, capacity = spi.read(3)   # sends dummy bytes while it reads
            cs(1)
            print("manufacturer %02X, type %02X, capacity %02X" % (manufacturer, kind, capacity))
            time.sleep(2)
      `,
      output: `
        manufacturer EF, type 40, capacity 16
      `,
      notes: ['EF is Winbond; a W25Q32 reports 40 and 16 (the capacity byte is the base-2 logarithm of the size in bytes: 2^22 is 4 MB). All 00 or all FF means no chip answers.', 'Do not connect the flash chip of your own board this way: GPIO6 to GPIO11 belong to it. This is for a separate flash module.']
    }
  ],
  examples: [
    {
      title: 'A frame for a small display',
      q: 'A 128 × 64 monochrome display needs 1024 bytes per full frame. How long does the transfer take over SPI at 8 MHz, and over I2C at 400 kHz?',
      steps: ['SPI: $1024 \\times 8 = 8192$ bits at 8 MHz is $8192 / 8\\,000\\,000 = 1.0$ ms.', 'I2C: nine clocks a byte, $1024 \\times 9 = 9216$ clocks at 400 kHz is $23$ ms (plus a little addressing).', 'So the same frame is twenty times faster over SPI; at 23 ms the I2C display tops out near 40 frames a second, with nothing left for the program.'],
      a: 'About 1 ms over SPI and 23 ms over I2C.'
    }
  ],
  quiz: [
    { q: 'You want to read one byte from an SPI peripheral. What must the controller do?', choices: ['Only listen on MISO', 'Send a byte (often a dummy) so that clock pulses are generated while MISO is read', 'Pulse CS twice', 'Send the peripheral\'s address first'], a: 1, why: 'The clock exists only while the controller shifts a byte out, and the peripheral\'s byte comes back on those same eight pulses. To read you must write something; the dummy value is usually ignored.' },
    { q: 'Which wiring is right for the data lines between an ESP and an SPI peripheral?', choices: ['MOSI to MISO and MISO to MOSI, crossed like a UART', 'MOSI to the peripheral\'s data input and MISO to its data output, straight through', 'Both data lines to one wire', 'Only MOSI is needed'], a: 1, why: 'The names are chosen from the controller\'s point of view, so MOSI meets the pin that takes data in (MOSI, SDI, DIN, COPI) and MISO the pin that sends data out. Nothing is crossed.' },
    { q: 'An SPI peripheral is not connected at all. The program reads 0xFF every time and reports no error.', a: true, why: 'SPI has no acknowledgement. A floating or pulled-up MISO reads as ones (or zeros); only a known ID register read-back proves that a chip is present.' },
    { q: 'About how many bytes per second can SPI move at a 10 MHz clock, ignoring gaps?', choices: ['125 kB/s', '1.25 MB/s', '10 MB/s', '80 kB/s'], a: 1, why: 'Eight clock pulses make a byte: 10 million / 8 = 1.25 million bytes a second.' }
  ],
  applications: [
    'Colour TFT and e-paper displays, which need hundreds of kilobytes per refresh.',
    'SD cards in SPI mode for data logging and audio playback.',
    'External flash and FRAM memory, and the LoRa, Ethernet and nRF24L01 radio modules.',
    'Fast accelerometers, thermocouple converters and external ADCs.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: SPI master driver reference; *ESP32 Technical Reference Manual*, the SPI controller chapter.',
    'Arduino core for ESP32 documentation: *SPI* API, core 3.3; MicroPython documentation: class *machine.SPI*, version 1.29.',
    'Winbond, *W25Q32 datasheet*: the JEDEC ID command and the instruction set.'
  ],
  sim: { id: 'ub-spi', params: { view: 'duplex' } }
},

/* ================================================================ spi-modes-and-speed */
{
  id: 'spi-modes-and-speed',
  parent: 'uart-i2c-spi',
  title: 'SPI modes, speed and sharing a bus',
  level: 2,
  short: 'Clock polarity and phase give four SPI modes, and a peripheral works only in the one its datasheet names. How fast the clock may run depends on the chip, the wires and the ESP; several peripherals can share a bus if each has its own chip select and settings.',
  keywords: ['SPI mode', 'CPOL', 'CPHA', 'clock polarity', 'clock phase', 'SPI_MODE0', 'SPI_MODE3', 'sampling edge', 'SPISettings', 'beginTransaction', 'shared bus', 'tri-state', 'MISO', 'DMA', 'clock speed', 'signal integrity', 'display and SD card'],
  prereq: ['spi'],
  related: ['sd-cards', 'display-interfaces', 'frame-rate-and-bus-speed', 'isolation-and-long-cables', 'gpio-matrix-and-io-mux', 'the-logic-analyser', 'io-expanders-and-shift-registers'],
  body: `SPI says nothing about which clock edge carries data, and chips differ. Two settings decide it: **clock polarity (CPOL)**, the level SCK rests at, and **clock phase (CPHA)**, whether data is read on the first or the second edge of each pulse. Together they make four **modes**:

| Mode | CPOL | CPHA | SCK rests | Data is read on |
|---|---|---|---|---|
| 0 | 0 | 0 | low | the rising edge |
| 1 | 0 | 1 | low | the falling edge |
| 2 | 1 | 0 | high | the falling edge |
| 3 | 1 | 1 | high | the rising edge |

The sender changes its data on the *other* edge, half a clock earlier, so the value is steady when it is read. The datasheet names the mode ("CPOL = 0, CPHA = 0", or "SPI mode 3", or "modes 0 and 3"). Modes 0 and 3 both read on the rising edge and differ only in the resting level, so many parts accept both. A wrong mode gives no error: you read constant bytes, or values shifted by one bit. The simulation shows the reading edge for each mode.

### How fast

The clock may be as fast as the slowest of four limits: the peripheral's maximum (a few MHz for a sensor, 25 MHz for an SD card, 20 to 40 MHz for a display), the ESP's own (80 MHz on the dedicated pins, 40 MHz through the GPIO matrix), the **wires**, and the round trip: the peripheral's answer arrives on MISO a little after the clock edge that asked for it, and must be steady before the next, which hurts reads more than writes. Jumper wires and breadboards ring and slow the edges long before 40 MHz; short wires, a ground close to every signal and a 33 to 100 Ω series resistor in the clock line help. For a rough time use t = 8n / f: a full 240 × 320 colour screen (153 600 bytes) at 40 MHz takes 31 ms. The ESP can also move a buffer with **DMA**, a block copy that runs without the processor, which is how display libraries keep the program free.

### Sharing a bus

SCK, MOSI and MISO are shared; each peripheral has its own CS, and only one may be low at a time. Three rules:

1. **Settings per peripheral.** Wrap each use in a *transaction* that sets that part's speed and mode (\`beginTransaction\` in Arduino, \`init\` in MicroPython), because a display at 40 MHz mode 0 and an accelerometer at 1 MHz mode 3 want different things.
2. **Release MISO.** A deselected part must tri-state its output. Some cheap SD card modules keep driving it, and the symptom is a second device that works only when the card is out; give the card its own bus.
3. **Mind the SD card's start.** It must be started at 400 kHz or less before the clock is raised.

> [!key] A peripheral reads data on one clock edge, set by the mode in its datasheet: a wrong mode gives constant or shifted bytes with no error. Speed is limited by the chip, the ESP and above all the wiring; on a shared bus use one chip select per part and set the speed and mode for every transaction.`,
  ideas: [
    'Clock polarity (rest level of SCK) and clock phase (first or second edge) give four modes; modes 0 and 3 read on the rising edge, 1 and 2 on the falling edge.',
    'The peripheral\'s datasheet names its mode; a wrong mode gives constant or shifted bytes and no error message.',
    'The usable clock is set by the peripheral, the ESP, the wires and the round-trip delay of the answer on MISO; short wires and series resistors help.',
    'Peripherals can share SCK, MOSI and MISO with one CS each, if every transaction sets that part\'s speed and mode and deselected parts release MISO.'
  ],
  pitfalls: [
    'If the bytes come back wrong the wiring must be wrong — With a mode mismatch the wiring may be perfect and the bytes still wrong: constant 0xFF or 0x00, or values shifted by one bit. Compare the mode with the datasheet before moving wires.',
    'A higher clock is always better — The peripheral, the wires and the answer\'s round trip all set a ceiling. A breadboard that carries 4 MHz fine fails at 20 MHz; the symptom is occasional wrong bytes, not silence.',
    'Two chip selects low at once saves time — Both peripherals then listen and both may drive MISO, which damages or corrupts the data. Exactly one CS is low at any time.'
  ],
  terms: [
    { term: 'Clock polarity (CPOL)', also: ['CPOL', 'idle level'], def: 'The level the SCK line rests at between transfers: 0 for low, 1 for high.' },
    { term: 'Clock phase (CPHA)', also: ['CPHA'], def: 'Whether data is read on the first edge of each clock pulse (CPHA 0) or on the second (CPHA 1); the sender changes its data on the other edge.' },
    { term: 'SPI mode', also: ['SPI_MODE0', 'mode 0', 'mode 3'], def: 'The pair of CPOL and CPHA numbered 0 to 3: mode 0 is (0, 0), mode 1 (0, 1), mode 2 (1, 0), mode 3 (1, 1). The controller must use the mode the peripheral expects.' },
    { term: 'Tri-state output', also: ['high impedance', 'Hi-Z', 'released output'], def: 'An output that is neither driving high nor low: effectively disconnected. A deselected SPI peripheral must tri-state MISO so that another can use the wire.' },
    { term: 'DMA', also: ['direct memory access'], def: 'Hardware that copies a block of memory to or from a peripheral without the processor handling each byte. SPI drivers use it to send display buffers while the program runs on.' }
  ],
  choose: {
    good: ['Mode 0 where the datasheet allows several: it is the most common and the best supported', 'Short wires, a close ground and a series resistor in SCK for clocks above 10 MHz', 'Separate buses for a fast display and a slow SD card when pins allow'],
    avoid: ['Guessing the mode: read it in the datasheet', 'Jumper wires over 10 cm at tens of megahertz', 'Two parts that disagree on speed, mode and bit order without a new transaction for each'],
    check: ['The mode, the maximum clock and the bit order of every peripheral on the bus', 'That deselected parts release MISO', 'Which pins the bus uses: the dedicated pins reach 80 MHz, the matrix 40 MHz']
  },
  code: [
    {
      title: 'Two peripherals on one bus, with their own modes',
      about: 'A flash chip (mode 0, 10 MHz) and an ADXL345 accelerometer (mode 3, at most 5 MHz) share SCK, MOSI and MISO. Each has its own chip select and its own settings in every transaction, and each is identified by its ID register.',
      needs: 'An ESP32 DevKit, a W25Q flash module on chip select GPIO5 and an ADXL345 board (SPI wired) on chip select GPIO4, both on GPIO18, GPIO19 and GPIO23.',
      wiring: [['GPIO18', 'SCK of both'], ['GPIO23', 'MOSI (DI, SDI) of both'], ['GPIO19', 'MISO (DO, SDO) of both'], ['GPIO5', 'flash CS'], ['GPIO4', 'ADXL345 CS']],
      blocks: `
        when started
          start serial at (115200) baud
          start SPI on SCK (18) MISO (19) MOSI (23)
        forever
          set [flash v] to (SPI read (3) bytes after command (0x9F) on chip select (5) at (10000000) Hz mode (0))
          set [accel v] to (SPI read (1) byte after command (0x80) on chip select (4) at (1000000) Hz mode (3))
          print (join [flash id ] (hex of (flash)) [, accelerometer id ] (hex of (accel)))
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>

        const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23;
        const int CS_FLASH = 5;                      // a W25Q flash chip: mode 0
        const int CS_ACCEL = 4;                      // an ADXL345: mode 3, at most 5 MHz

        const SPISettings FLASH_SETTINGS(10000000, MSBFIRST, SPI_MODE0);
        const SPISettings ACCEL_SETTINGS(1000000, MSBFIRST, SPI_MODE3);

        uint32_t readFlashId() {
          SPI.beginTransaction(FLASH_SETTINGS);      // this device's speed and mode
          digitalWrite(CS_FLASH, LOW);
          SPI.transfer(0x9F);                        // the JEDEC ID command
          uint32_t id = 0;
          for (int i = 0; i < 3; i++) id = (id << 8) | SPI.transfer(0);
          digitalWrite(CS_FLASH, HIGH);
          SPI.endTransaction();
          return id;
        }

        uint8_t readAccelId() {
          SPI.beginTransaction(ACCEL_SETTINGS);
          digitalWrite(CS_ACCEL, LOW);
          SPI.transfer(0x80 | 0x00);                 // bit 7 set means read; register 0x00 is DEVID
          uint8_t id = SPI.transfer(0);
          digitalWrite(CS_ACCEL, HIGH);
          SPI.endTransaction();
          return id;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(CS_FLASH, OUTPUT);
          digitalWrite(CS_FLASH, HIGH);              // deselect both before starting the bus
          pinMode(CS_ACCEL, OUTPUT);
          digitalWrite(CS_ACCEL, HIGH);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI);
        }

        void loop() {
          Serial.printf("flash id %06X, accelerometer id %02X\n", (unsigned int)readFlashId(), readAccelId());
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import time

        cs_flash = Pin(5, Pin.OUT, value=1)          # a W25Q flash chip: mode 0
        cs_accel = Pin(4, Pin.OUT, value=1)          # an ADXL345: mode 3, at most 5 MHz
        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))

        def read_flash_id():
            spi.init(baudrate=10_000_000, polarity=0, phase=0)   # this device's speed and mode
            cs_flash(0)
            spi.write(b"\x9f")                       # the JEDEC ID command
            ident = spi.read(3)
            cs_flash(1)
            return "".join("%02X" % b for b in ident)

        def read_accel_id():
            spi.init(baudrate=1_000_000, polarity=1, phase=1)
            cs_accel(0)
            spi.write(b"\x80")                       # bit 7 set means read; register 0x00 is DEVID
            ident = spi.read(1)
            cs_accel(1)
            return ident[0]

        while True:
            print("flash id %s, accelerometer id %02X" % (read_flash_id(), read_accel_id()))
            time.sleep(2)
      `,
      output: `
        flash id EF4016, accelerometer id E5
      `,
      notes: ['The accelerometer\'s ID register reads E5 (the ADXL345\'s fixed value). If the first line is right and the second constant, check the mode: this part wants mode 3.', 'Both chip selects are driven high before the bus starts, so neither part listens while the pins settle.', 'SPI(2) is the ESP32\'s VSPI bus; the bus numbers differ on other chips ([[spi]]).']
    }
  ],
  formulas: [
    {
      name: 'Time to move a block over SPI',
      expr: 't = 8*n/f',
      tex: 't = \\frac{8 \\, n}{f}',
      vars: {
        t: { name: 'time', q: 'time', unit: 'ms' },
        n: { name: 'number of bytes', value: 153600, min: 1, int: true },
        f: { name: 'SPI clock', q: 'frequency', unit: 'MHz', value: 40 }
      },
      solveFor: 't',
      note: 'Eight clock pulses per byte, ignoring the pauses between transactions, which add some. A 240 × 320 screen at 16 bits per pixel is 153 600 bytes.',
      stories: { t: 'A display needs {n} bytes per frame over an SPI clock of {f}. How long does one frame take?', f: 'A frame of {n} bytes must be sent in {t}. What clock does that need?' },
      practice: { unknowns: ['t', 'f'] }
    }
  ],
  examples: [
    {
      title: 'How many frames a second?',
      q: 'A 240 × 320 display takes 16 bits per pixel over SPI at 40 MHz. What frame rate can the bus support if the whole screen is redrawn every time?',
      steps: ['Bytes per frame: $240 \\times 320 \\times 2 = 153\\,600$.', 'Time per frame: $8 \\times 153\\,600 / 40\\,000\\,000 = 30.7$ ms.', 'Frame rate: $1 / 0.0307 = 32.6$ frames per second at best, before any pauses or drawing time.'],
      a: 'About 32 frames per second at best; redrawing only the changed part of the screen is the way to go faster.'
    }
  ],
  quiz: [
    { q: 'Which SPI mode rests SCK high and reads data on the rising edge?', choices: ['Mode 0', 'Mode 1', 'Mode 2', 'Mode 3'], a: 3, why: 'Mode 3 is CPOL 1, CPHA 1: SCK rests high, the first (falling) edge moves the data and the second (rising) edge is where it is read. Mode 0 reads on the rising edge as well, but rests low.' },
    { q: 'A sensor needs SPI mode 3 and the ESP is set to mode 0. What do you see?', choices: ['An error code from SPI.transfer', 'Constant or shifted bytes with no error', 'The ESP resets', 'Nothing at all is ever sent'], a: 1, why: 'The bits still travel and the clock still ticks; the controller just reads them on the wrong edge. SPI cannot report the mismatch, so the data looks like 0xFF, 0x00 or a bit-shifted copy of the truth.' },
    { q: 'Two peripherals on one SPI bus may both have their chip select low at once, if both are only being written to.', a: false, why: 'Both would then take in every byte as a command for themselves, and each may drive MISO. Use one CS low at a time, with a transaction per device.' },
    { q: 'A display works at 8 MHz on jumper wires but shows noise at 40 MHz. Which is the best first fix?', choices: ['Lower the clock or shorten the wires and add a series resistor in SCK', 'Use SPI mode 1', 'Add pull-ups to MOSI', 'Increase the supply voltage'], a: 0, why: 'At tens of megahertz the wires ring and the edges smear; a lower clock or short wires, a close ground and a 33 to 100 Ω resistor in the clock line fix that. The mode would give wrong data at every speed, not only the fast ones.' }
  ],
  applications: [
    'A TFT display and an SD card on the same ESP32: two chip selects, two sets of settings, possibly two buses.',
    'Reading an accelerometer at 4 kHz while the flash log is written: both on the bus, each in its own transaction.',
    'Working out whether a given screen can be redrawn at 30 frames a second over SPI, before buying it.',
    'Debugging a sensor that returns a constant byte: the first suspects are the mode and the chip select.'
  ],
  sources: [
    'Analog Devices, *ADXL345 datasheet*: SPI mode 3 and the register read protocol.',
    'Espressif, *ESP-IDF Programming Guide*: SPI master driver, clock speed limits, DMA and bus sharing; *ESP32 Technical Reference Manual*, the SPI chapter.',
    'SD Association, *Physical Layer Simplified Specification*: SPI mode and the initialisation clock.'
  ],
  sim: ['ub-spi', 'ub-spibus']
},

/* ================================================================ one-wire */
{
  id: 'one-wire',
  parent: 'uart-i2c-spi',
  title: '1-Wire',
  level: 2,
  short: 'One data wire and a ground carry both power-free signalling and a 64-bit identity for every part, so a dozen DS18B20 temperature sensors can hang on one cable. Every bit is a time slot started by the controller, and the timing is the whole protocol.',
  keywords: ['1-Wire', 'one wire', 'OneWire', 'DS18B20', 'ROM code', 'presence pulse', 'reset pulse', 'time slot', 'parasitic power', 'DallasTemperature', 'onewire', 'ds18x20', '85 °C', '-127', 'CRC', 'iButton', 'DHT22', 'search ROM'],
  prereq: ['serial-communication-basics', 'pull-ups-and-pull-downs'],
  related: ['temperature-sensors', 'reading-sensors-reliably', 'the-rmt-peripheral', 'rfid-and-nfc', 'choosing-a-bus', 'isolation-and-long-cables', 'electronics:serial-buses'],
  body: `**1-Wire** puts a conversation on a single data wire plus ground. Everything depends on timing: the controller starts every bit by pulling the line low, and how long it holds it decides what the bit means. The line is open-drain with one pull-up resistor (4.7 kΩ at 3.3 V), so any number of parts can share it, and each has its own factory-set 64-bit identity. The part everyone meets is the **DS18B20** temperature sensor: waterproof probes with three wires, dozens to a cable.

### Reset, presence, bits

Every exchange begins with a **reset pulse**: the controller holds the line low for at least 480 µs and lets go. Within 15 to 60 µs every part on the wire pulls the line low for 60 to 240 µs — the **presence pulse**, "somebody is here". Then come bit **time slots** of about 60 to 120 µs, each started by a falling edge from the controller: for a 1 it lets go again within 15 µs; for a 0 it holds low for 60 µs or more. To read, the controller pulls low for a microsecond and releases; a part sending a 0 holds the line low a while longer, and the controller reads the level 15 µs after the edge. Bytes go **least significant bit first**. At 70 µs a bit a byte takes 560 µs: about 15 kbit/s. [The signal lab](#/tools/signals/onewire) shows the slots.

### Telling parts apart

Each part carries a **ROM code** of 64 bits: an 8-bit family code (0x28 for the DS18B20), a 48-bit serial number and an 8-bit CRC. A search command (0xF0) lets the controller discover every code on the wire, one bit at a time; then **Match ROM** (0x55) plus a code addresses one part, **Skip ROM** (0xCC) addresses all at once, and **Read ROM** (0x33) asks a lone part for its code.

### The DS18B20

It measures −55 to +125 °C, to ±0.5 °C between −10 and +85 °C, at 9 to 12 bits (0.5 °C down to 0.0625 °C). The controller sends Skip ROM and **Convert T** (0x44); the part takes up to **750 ms** at 12 bits (93.75 ms at 9 bits), and a **Read Scratchpad** (0xBE) returns nine bytes, the first two the temperature and the last a CRC. It can draw its power from the data line (*parasitic power*), but that needs a strong pull-up during the conversion; with an ESP use three wires.

### Traps

- **85.0 °C** is the power-on value: you read before a conversion finished. A library returns **−127** (DEVICE_DISCONNECTED_C) when nothing answers.
- A **DHT11 or DHT22** also uses one data wire but speaks a different protocol; it cannot share the bus.
- The ESP times the bits in software with interrupts briefly off, so Wi-Fi activity can corrupt a bit: check the CRC and retry. The RMT peripheral ([[the-rmt-peripheral]]) can do the timing in hardware. Cables of tens of metres work with care.

> [!key] 1-Wire is one open-drain wire with a pull-up: the controller starts every bit with a falling edge and its length says 0 or 1. Each part has a 64-bit ROM code, so many share one wire; check the CRC, and remember 85.0 °C means "not converted yet".`,
  ideas: [
    'The controller starts every bit by pulling the line low; a short pulse is a 1 and a long one (60 µs or more) is a 0. A reset pulse of 480 µs or more is answered by every part with a presence pulse.',
    'Every part has a unique 64-bit ROM code (family, 48-bit serial, CRC), so a search finds all parts on the wire and Match ROM addresses one of them.',
    'A DS18B20 converts for up to 750 ms at 12 bits; a read before that returns 85.0 °C, and a library returns −127 when nothing answers.',
    'The bus is slow (about 15 kbit/s) but long, cheap and needs one pin, one pull-up and one wire for many sensors.'
  ],
  pitfalls: [
    'A DHT22 can share the bus with DS18B20 sensors because both use one wire — The DHT parts have their own protocol with different timing. They need a pin of their own.',
    'A reading of 85.0 or −127 is a temperature — 85.0 °C is what the DS18B20 holds at power-up, so you read before it had converted (or it lost power); −127 is the library\'s code for "nothing answered". Neither is a measurement.',
    'Parasitic power saves a wire at no cost — The part runs on the data line only if the pull-up supplies a strong current during the 750 ms conversion; with a 4.7 kΩ resistor and several sensors it does not. Use the three-wire connection.'
  ],
  terms: [
    { term: '1-Wire', also: ['one-wire', 'OneWire', '1Wire'], def: 'A bus from Dallas Semiconductor (now Analog Devices) with a single open-drain data line shared by many parts. The controller starts every bit with a falling edge, and each part has a unique 64-bit address.' },
    { term: 'ROM code', also: ['64-bit ID', '1-Wire address', 'serial code'], def: 'The 64-bit number laser-written in every 1-Wire part: an 8-bit family code (0x28 for the DS18B20), a 48-bit serial number and an 8-bit CRC.' },
    { term: 'Reset and presence pulse', also: ['presence detect'], def: 'The opening of every 1-Wire exchange: the controller pulls the line low for at least 480 µs, and the parts answer by pulling it low for 60 to 240 µs.' },
    { term: 'Time slot', also: ['bit slot'], def: 'The 60 to 120 µs window in which one bit is sent or read on 1-Wire. The controller starts it with a falling edge; how long the line stays low says whether the bit is 0 or 1.' },
    { term: 'Parasitic power', also: ['parasite power'], def: 'Powering a 1-Wire part from the data line through the pull-up resistor, with no separate supply wire. It needs a strong pull-up during the part\'s conversions and is best avoided with an ESP.' }
  ],
  choose: {
    good: ['Several temperature probes on one cable, in a room, a tank or a greenhouse', 'Long, thin cable runs where one wire per sensor would be too much', 'Parts that need an identity: iButtons and DS18B20 probes'],
    avoid: ['Anything fast: a reading takes about a second including the conversion', 'Sharing the pin with a DHT sensor', 'Parasitic power with many sensors or on a long cable'],
    check: ['That a 4.7 kΩ pull-up is on the data wire, at the ESP end', 'The CRC of every reading, with a retry when it fails', 'That the library knows the sensor family (DS18B20, DS18S20, DS1822)']
  },
  code: [
    {
      title: 'Read a DS18B20 temperature',
      about: 'Starts a conversion, waits for it and reads the temperature. A reading of −127 (C++) or an empty list (MicroPython) means no sensor answered.',
      needs: 'An ESP32 DevKit and a DS18B20 probe: data to GPIO4 with a 4.7 kΩ pull-up to 3V3, red to 3V3, black to GND.',
      wiring: [['GPIO4', 'DS18B20 data (yellow)', 'with 4.7 kΩ to 3V3'], ['3V3', 'DS18B20 VDD (red)'], ['GND', 'DS18B20 GND (black)']],
      libs: ['OneWire', 'DallasTemperature'],
      blocks: `
        when started
          start serial at (115200) baud
          start 1-Wire on pin (4)
          print (join (number of 1-Wire devices) [ sensor(s) on the bus])
        forever
          start temperature conversion on all 1-Wire sensors
          wait (0.75) seconds
          print (join (temperature of 1-Wire sensor (1)) [ C])
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        #include <OneWire.h>
        #include <DallasTemperature.h>

        const int ONE_WIRE_PIN = 4;                  // data wire with a 4.7 kOhm pull-up to 3V3

        OneWire oneWire(ONE_WIRE_PIN);
        DallasTemperature sensors(&oneWire);

        void setup() {
          Serial.begin(115200);
          sensors.begin();
          Serial.printf("%d sensor(s) on the bus\n", sensors.getDeviceCount());
        }

        void loop() {
          sensors.requestTemperatures();             // starts a conversion and waits (about 750 ms at 12 bits)
          float celsius = sensors.getTempCByIndex(0);
          if (celsius == DEVICE_DISCONNECTED_C) Serial.println("no sensor answered");
          else Serial.printf("%.2f C\n", celsius);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import onewire, ds18x20, time

        ow = onewire.OneWire(Pin(4))                 # data wire with a 4.7 kOhm pull-up to 3V3
        ds = ds18x20.DS18X20(ow)
        roms = ds.scan()                             # a list of 8-byte ROM codes
        print(len(roms), "sensor(s) on the bus")

        while True:
            ds.convert_temp()                        # start a conversion on every sensor
            time.sleep_ms(750)                       # a 12-bit conversion takes up to 750 ms
            for rom in roms:
                print("%.2f C" % ds.read_temp(rom))
            time.sleep(2)
      `,
      output: `
        1 sensor(s) on the bus
        23.19 C
        23.25 C
      `,
      notes: ['In MicroPython the onewire and ds18x20 modules are built into the official ESP32 firmware; in Arduino install the OneWire and DallasTemperature libraries.', 'The Arduino library waits for the conversion by default; call setWaitForConversion(false) to read after 750 ms without blocking.']
    },
    {
      title: 'List every part on the wire',
      about: 'Runs the ROM search and prints each 64-bit code with a check of its CRC, so you know how many sensors the wire really carries and which family they belong to.',
      needs: 'The same board, with one or more DS18B20 probes on GPIO4.',
      wiring: [['GPIO4', 'data wire of all probes', 'with 4.7 kΩ to 3V3']],
      libs: ['OneWire'],
      blocks: `
        when started
          start serial at (115200) baud
          start 1-Wire on pin (4)
          for each [rom v] in (all 1-Wire ROM codes found)
            print (join (hex of (rom)) [  family 0x] (hex of (item (1) of (rom))))
          end
          print [search finished]
      `,
      cpp: String.raw`
        #include <OneWire.h>

        OneWire oneWire(4);                          // data wire on GPIO4

        void setup() {
          Serial.begin(115200);
          delay(1000);
          uint8_t rom[8];
          oneWire.reset_search();
          while (oneWire.search(rom)) {              // finds the parts one by one
            for (int i = 0; i < 8; i++) Serial.printf("%02X ", rom[i]);
            Serial.println(OneWire::crc8(rom, 7) == rom[7] ? " crc ok" : " crc BAD");
          }
          Serial.println("search finished");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin
        import onewire

        ow = onewire.OneWire(Pin(4))                 # data wire on GPIO4
        for rom in ow.scan():                        # each rom is 8 bytes: family, 6-byte serial, CRC
            print(" ".join("%02X" % b for b in rom), " family 0x%02X" % rom[0])
        print("search finished")
      `,
      output: `
        28 FF 1A 2B 3C 04 00 33  crc ok
        search finished
      `,
      notes: ['A family code of 0x28 is a DS18B20, 0x10 a DS18S20, 0x22 a DS1822. The serial number in the middle is unique to each probe.', 'The MicroPython scan already checks the CRC and leaves a damaged code out; the Arduino loop shows it so you can see a bad wire.']
    }
  ],
  examples: [
    {
      title: 'Ten sensors on one wire',
      q: 'Ten DS18B20 probes share a wire. How long does one complete reading of all ten take, if all are converted together and the controller then reads each one with Match ROM, taking nine bytes of scratchpad?',
      steps: ['Convert all at once: Skip ROM and Convert T, then wait: about 750 ms for 12 bits.', 'Reading one probe: reset 0.96 ms, then 1 byte Match ROM + 8 bytes of ROM code + 1 byte Read Scratchpad + 9 bytes read = 19 bytes at 560 µs = 10.6 ms. Together 11.6 ms.', 'Ten probes: $10 \\times 11.6 = 116$ ms. Total: $750 + 116 \\approx 0.87$ s.'],
      a: 'About 0.87 seconds; the conversion dominates, and reading all ten is only 116 ms.'
    }
  ],
  quiz: [
    { q: 'How can twelve DS18B20 sensors share one wire and still be read individually?', choices: ['Each has a different clock', 'Each has a unique 64-bit ROM code that the controller can search for and address', 'They take turns by themselves', 'They cannot: one wire is one sensor'], a: 1, why: 'The factory-written ROM code makes every part unique. A search finds the codes, and Match ROM followed by a code makes one part listen while the others stay quiet.' },
    { q: 'A freshly powered DS18B20 is read at once and shows 85.0 °C. What does it mean?', choices: ['The room is hot', 'The sensor has not converted yet: 85 °C is its power-on value', 'The sensor is broken', 'The reading is in Fahrenheit'], a: 1, why: 'The scratchpad holds 85 °C until the first conversion has run. Start a conversion with 0x44 and wait up to 750 ms (at 12 bits) before reading.' },
    { q: 'A DHT22 temperature sensor can be connected to the same wire as DS18B20 probes, since both use one wire.', a: false, why: 'The DHT22 speaks its own protocol with different timing. It needs its own pin; to the 1-Wire probes its pulses are noise.' },
    { q: 'How does the controller send a 0 on 1-Wire?', choices: ['It holds the line low for 60 µs or more in the slot', 'It sends a short pulse of 1 µs', 'It raises the line for 15 µs', 'It stops the clock'], a: 0, why: 'A 0 is a long low pulse (at least 60 µs); a 1 is a short low pulse of 1 to 15 µs after which the line is released. Both start with a falling edge from the controller.' }
  ],
  applications: [
    'Waterproof DS18B20 probes in a fish tank, a compost heap, a greenhouse or a heating pipe.',
    'Several rooms\' temperatures on one cable run, each probe found by its ROM code.',
    'iButton keys and other identity tokens read by touch.',
    'Cheap authentication: some battery packs and accessories carry a 1-Wire identity chip.'
  ],
  sources: [
    'Analog Devices (formerly Maxim Integrated), *DS18B20 datasheet*: ROM and function commands, scratchpad, timing, power-up value.',
    'Analog Devices (Maxim) application notes on the 1-Wire bus: time slots, CRC and the search algorithm.',
    'Documentation of the Arduino OneWire and DallasTemperature libraries, and of the MicroPython onewire and ds18x20 modules (version 1.29).'
  ],
  sim: 'ub-onewire'
},

/* ================================================================ choosing-a-bus */
{
  id: 'choosing-a-bus',
  parent: 'uart-i2c-spi',
  title: 'Choosing a bus',
  level: 1,
  short: 'The part usually chooses its bus for you; the choice is yours when a part offers two, when pins run short, or when two controllers must talk. Wires, speed, distance and the number of devices decide — here side by side.',
  keywords: ['choose a bus', 'I2C or SPI', 'UART or I2C', 'bus comparison', 'pins', 'speed', 'distance', 'number of devices', 'BME280 SPI or I2C', 'bus speed', 'throughput', 'overhead', 'RS-485', 'CAN'],
  prereq: ['uart', 'i2c', 'spi', 'one-wire'],
  related: ['living-with-few-pins', 'io-expanders-and-shift-registers', 'can-bus-twai', 'rs-485', 'isolation-and-long-cables', 'choosing-a-sensor', 'display-interfaces', 'esp-as-a-co-processor', 'electronics:serial-buses'],
  body: `You seldom choose a bus from nothing: the part chooses for you. A GPS receiver speaks UART, a DS18B20 speaks 1-Wire, an SD card is happiest on SPI. The choice is yours when a part offers two interfaces (a BME280, most IMUs and many small displays can be wired as I2C or SPI), when pins run short, or when two controllers must talk.

| | UART | I2C | SPI | 1-Wire |
|---|---|---|---|---|
| Signal wires | 2 per link | 2, shared by all | 3 shared, 1 more per device | 1, shared |
| Clock | agreed speed | from the controller | from the controller | timed by the controller |
| Typical speed | 9 600 to 921 600 baud | 100 or 400 kHz | 1 to 40 MHz | about 15 kbit/s |
| Data per second | 11 520 B at 115 200 | at most about 44 kB at 400 kHz | 125 kB per MHz of clock | about 1.8 kB |
| Devices | 2 | up to 112 addresses | one chip select each | many, by 64-bit ID |
| Distance | a metre or two | inside a box | board-sized | tens of metres |
| Suits | modules with their own firmware: GPS, modems, other chips | sensors, small displays, clocks, expanders | displays, SD cards, flash, fast converters, radios | temperature probes, ID keys |

### How the choice usually goes

- **Few pins, modest data: I2C.** Five sensors and an OLED sit on two pins, if their addresses differ ([[i2c-addresses-and-scanning]]).
- **A lot of data, or speed: SPI.** Anything that moves more than about 20 kB/s — colour screens, memory cards, audio converters — belongs here. The price is one pin per device.
- **A module with its own brain: UART.** GPS receivers, modems, mmWave radar and another microcontroller send text or packets whenever they like.
- **Many probes on a long, thin cable: 1-Wire.** Slow, but one wire carries a dozen sensors.

### The same part on two buses

A BME280 reads at most a few hundred times a second, so I2C is enough, takes two pins shared with everything else, and is the usual choice. SPI would add a pin and a speed it never uses. A small OLED is the opposite: over I2C a full 1024-byte frame takes 23 ms, over SPI 1 ms. For sensors read a few times a second, pin count wins; for anything that streams, speed does.

### Overhead is real

Addressing costs bits. Reading six bytes from an I2C IMU takes START, address, register, restart, address, six data bytes and STOP: 84 clock periods, 210 µs at 400 kHz — 21 % of the bus at 1 kHz sampling, 84 % at 100 kHz.

### Beyond the four

Far or noisy: [[rs-485]] and [[can-bus-twai|CAN]]. Audio: [[i2s]]. Fast cards and wide buses: [[sdio-and-sdmmc|SDIO]]. All of these are used at once on one ESP: each has its own hardware.

> [!key] The part usually decides; when it does not, use I2C for slow sensors on few pins, SPI for anything that streams, UART for modules with their own firmware and 1-Wire for probes on long cables. Count pins and bytes per second, including the addressing overhead, before deciding.`,
  ideas: [
    'The part usually decides the bus; the choice is yours when a part offers two interfaces, when pins are short or when two controllers must talk.',
    'I2C costs two shared pins and moves up to about 44 kB/s; SPI costs a pin per device and moves 125 kB/s for every MHz; UART links two ends; 1-Wire is slow but long.',
    'Overhead counts: an I2C register read of six bytes takes 84 clock periods, not 48, and a bus at 400 kHz is nearly a fifth full at one such read per millisecond.',
    'Mixing buses on one ESP is normal; each has its own hardware, and the pin count is the sum.'
  ],
  pitfalls: [
    'The fastest bus is always the best — A sensor read twice a second needs no 40 MHz. The cheapest in pins and wires wins for slow parts; speed matters only for streams.',
    'Any part works on any bus if I wire it that way — Many parts offer both I2C and SPI but choose with a pin at power-up, or support only one; a few breakout boards wire the choice permanently. Read the datasheet and the board\'s own notes.',
    'A bus that works on the bench will work in the machine — I2C, SPI and logic-level UART are for short, quiet wiring. Across metres, motors and mains-switching, use RS-485 or CAN with isolation ([[isolation-and-long-cables]]).'
  ],
  terms: [
    { term: 'Bus', also: ['shared bus', 'multi-drop'], def: 'A set of wires that several devices share, each told apart by an address or a chip select. I2C and SPI are buses; a UART link has only two ends.' },
    { term: 'Throughput', also: ['data rate', 'bandwidth', 'bytes per second'], def: 'How many bytes of data a link actually moves per second, after the bits spent on start bits, addresses, acknowledgements and pauses. Always lower than the raw clock rate suggests.' },
    { term: 'Protocol overhead', also: ['framing overhead'], def: 'The bits on a link that carry no data: start and stop bits on a UART, the address and acknowledge bits on I2C, the chip-select set-up on SPI.' },
    { term: 'Pin budget', also: ['pin count'], def: 'The number of GPIO pins a design needs, summed over all its buses and parts. A shared bus keeps it low; a chip select per device or a UART per module raises it.' }
  ],
  choose: {
    good: ['I2C for sensors, clocks and small displays that must share two pins', 'SPI for displays, SD cards, flash memory and anything that streams data', 'UART for modules with their own firmware: GPS, modems, another microcontroller', '1-Wire for temperature probes on a long cable'],
    avoid: ['I2C for colour displays or memory cards: too slow', 'SPI for a dozen slow sensors when pins are scarce', 'Logic-level UART, I2C or SPI over several metres in a noisy machine', 'Choosing on speed alone for a part read a few times a second'],
    check: ['Which interfaces the part offers and which one its library supports', 'How many pins, addresses and chip selects are free', 'Bytes per second needed, with the overhead, against what the bus carries', 'Cable length and electrical noise where the device will be used']
  },
  examples: [
    {
      title: 'How full is the bus?',
      q: 'An IMU is read 1000 times a second: each read is a register write (the register number), a restart and six data bytes over I2C. What fraction of a 400 kHz bus and of a 100 kHz bus does it use?',
      steps: ['Count the clock periods: START (1) + address and write bit with acknowledge (9) + register number (9) + restart (1) + address and read bit (9) + six data bytes (54) + STOP (1) = 84.', 'At 400 kHz one transfer takes $84 / 400\\,000 = 210$ µs, so a thousand a second use 21 % of the bus.', 'At 100 kHz it takes 840 µs: 84 %, which leaves no room for other parts. Use 400 kHz, or put the IMU on SPI.'],
      a: '21 % at 400 kHz and 84 % at 100 kHz.'
    }
  ],
  quiz: [
    { q: 'A colour screen needs 153 600 bytes per frame at 30 frames per second, about 4.6 MB/s. Which bus can carry it?', choices: ['UART at 921 600 baud', 'I2C at 400 kHz', 'SPI at 40 MHz', '1-Wire'], a: 2, why: 'SPI at 40 MHz moves 5 MB/s; the others are one or two orders of magnitude too slow: a UART manages about 92 kB/s, I2C about 44 kB/s and 1-Wire less than 2 kB/s.' },
    { q: 'You have two free pins and five sensors, each at a different I2C address, each read once a second. Which bus?', choices: ['SPI: five chip selects and three more pins', 'I2C: all five share two wires', 'UART: one per sensor', '1-Wire'], a: 1, why: 'Slow sensors with distinct addresses are exactly what I2C is for: two shared pins carry them all.' },
    { q: '1-Wire is the fastest of the four buses.', a: false, why: 'It is the slowest, about 15 kbit/s. Its virtues are one wire, many parts with unique IDs and long cables.' },
    { q: 'A GPS module prints text sentences every second. Which bus does it normally use?', choices: ['SPI', 'I2C', 'UART', '1-Wire'], a: 2, why: 'GPS receivers have their own firmware that sends text (NMEA) sentences at their own pace, which suits a UART. Some also offer I2C or SPI, but the serial port is the default.' }
  ],
  applications: [
    'Planning the pins of a weather station: I2C sensors and display, SPI memory card, UART GPS, 1-Wire soil probes.',
    'Deciding whether a project needs the larger board when pins run short, or an I2C expander instead ([[io-expanders-and-shift-registers]]).',
    'Choosing between the I2C and SPI version of a display or an IMU before laying out a circuit board.',
    'Picking a link between an ESP and another microcontroller: UART for simplicity, SPI for speed.'
  ],
  sources: [
    'NXP, *UM10204: I2C-bus specification and user manual*, for the I2C speeds and capacitance limits.',
    'Espressif, *ESP32 Technical Reference Manual* and the datasheets of the individual chips: how many UART, I2C and SPI controllers each has.',
    'The datasheets of the parts themselves: the interfaces a part offers and how it chooses between them.'
  ],
  sim: { id: 'ub-frame', params: { payload: 1024 } }
},

/* ================================================================ registers-and-datasheets */
{
  id: 'registers-and-datasheets',
  parent: 'uart-i2c-spi',
  title: 'Registers: talking to a chip from its datasheet',
  level: 2,
  short: 'A sensor or display chip is a bank of numbered registers. Find the address, read an ID register, wake the chip, set bit fields, read two bytes, make them a signed number and scale it to units — the skill that unlocks every chip, with or without a library.',
  keywords: ['register', 'register map', 'datasheet', 'WHO_AM_I', 'bit field', 'mask', 'read-modify-write', 'two\'s complement', 'signed 16-bit', 'big-endian', 'little-endian', 'MPU6050', 'TMP102', 'burst read', 'sensitivity', 'LSB per g', 'writeto_mem', 'readfrom_mem'],
  prereq: ['i2c', 'spi', 'bits-and-bytes'],
  related: ['how-to-read-a-datasheet', 'reading-sensors-reliably', 'motion-sensors-imu', 'sensor-calibration', 'structs-and-classes', 'i2c-addresses-and-scanning', 'temperature-sensors'],
  body: `Almost every sensor, display controller and radio chip is, from outside, a bank of numbered **registers**: bytes you can read and write over I2C or SPI. Writing a register sets up the chip; reading one fetches a measurement. "Talking to the chip" means exactly that, and the **register map** in its datasheet is the manual. Learn to read one and you can drive any chip, with or without a library.

### What the datasheet gives you

The **address** (or SPI mode and chip select), with the pins that change it; the **register map**, a table of addresses, names, read/write access and reset values; a **bit-field table** for each register; the **timing** (start-up time, conversion time); and an **example sequence**. Read the sequence first.

### A worked example: the MPU6050

This six-axis motion sensor sits at I2C address 0x68 (0x69 with AD0 high). Four registers do the job:

| Register | Address | What it holds |
|---|---|---|
| WHO_AM_I | 0x75 | an ID: reads 0x68 |
| PWR_MGMT_1 | 0x6B | bit 6 SLEEP; the chip **powers up asleep** (0x40) |
| ACCEL_CONFIG | 0x1C | bits 4:3 choose the range: 0 to 3 for ±2, ±4, ±8, ±16 g |
| ACCEL_XOUT_H … ZOUT_L | 0x3B to 0x40 | X, Y, Z as 16-bit numbers, high byte first |

The routine every chip gets: **1.** read WHO_AM_I and compare — this proves the address, the wiring and the part before anything else (clones and other family members answer other values); **2.** wake it by writing 0x00 to PWR_MGMT_1; **3.** choose a range; **4.** read the six data bytes in one go, so all three axes come from the same instant; **5.** turn each pair into a number and scale it: at ±2 g the sensor gives 16 384 counts per g.

### Bits and fields

A register packs several settings. A field is a mask and a shift: range = (value >> 3) & 3. To change one field, **read the register, change only those bits, write it back** — read-modify-write — because other bits may hold trim values you must not disturb. A reserved bit is written as the datasheet says, usually 0.

### Bytes, signs and units

Two bytes become one number as (high << 8) | low — or low first on chips that say so (the calibration words of many Bosch sensors do). A signed reading uses **two's complement**: 0xFFFE is −2, so subtract 65 536 when the top bit is set. Some chips left-justify a short result: the TMP102 puts 12 bits in the top of 16, so shift right by four. Then scale: divide by the sensitivity, in counts per unit. [The signal lab](#/tools/signals/i2c) shows the bytes on the wire.

> [!key] A chip is its registers: find the address, read the ID register to prove the wiring, wake it, change bit fields by read-modify-write, read the data bytes in one burst, make them a signed number and divide by the sensitivity. Every datasheet is the same recipe with different numbers.`,
  ideas: [
    'A chip is a bank of numbered registers; reading and writing them over I2C or SPI is all there is to using it.',
    'The ID register (WHO_AM_I) proves that the address, wiring and part are right; a chip that powers up asleep needs one register write to wake.',
    'Change one bit field with read-modify-write: read the register, replace only the bits of the mask, write it back.',
    'Combine two bytes as (high << 8) | low, correct for sign (two\'s complement) and divide by the sensitivity to get units.'
  ],
  pitfalls: [
    'To change one setting, write a byte with just that bit set — That also clears every other bit, including calibration or mode bits you did not mean to touch. Read first, change the bits of the mask, write back.',
    'The raw number is the measurement — It is a count; the unit comes from dividing by the sensitivity, which depends on the range you set, and the count is signed. An unsigned variable shows −400 as 65 136.',
    'A library means I never need the register map — Libraries reject chips whose ID differs (clones), miss options and have bugs. With the datasheet you can still use the chip and see why the library fails.'
  ],
  terms: [
    { term: 'Register', also: ['register map', 'control register', 'data register'], def: 'A byte of storage inside a chip with a numbered address, which the controller reads or writes over I2C or SPI. The register map lists them all.' },
    { term: 'Bit field', also: ['mask and shift', 'bit mask'], def: 'A group of bits inside a register with one meaning, such as the two bits that choose a measuring range. It is read with a mask and a shift and changed with read-modify-write.' },
    { term: 'Read-modify-write', also: ['RMW', 'update bits'], def: 'Changing some bits of a register without disturbing the others: read the byte, clear the bits of the field, set the new value, write the byte back.' },
    { term: 'Two\'s complement', also: ['signed integer', 'signed 16-bit'], def: 'The way chips store negative numbers: a 16-bit value with the top bit set is the number minus 65 536, so 0xFFFE means −2.' },
    { term: 'Endianness', also: ['big-endian', 'little-endian', 'byte order'], def: 'The order of the bytes of a multi-byte number: big-endian sends the high byte first, little-endian the low byte first. The datasheet says which a chip uses.' },
    { term: 'WHO_AM_I', also: ['chip ID register', 'device ID'], def: 'A read-only register present in many chips holding a fixed identifying value. Reading it back is the first test that the address, wiring and part are right.' }
  ],
  code: [
    {
      title: 'Wake an MPU6050 and read its acceleration',
      about: 'The whole recipe: read WHO_AM_I, clear the SLEEP bit, then read six bytes in one burst and turn each pair into a signed number scaled in g (16 384 counts per g at the default ±2 g range).',
      needs: 'An ESP32 DevKit and an MPU6050 board (GY-521 or similar), AD0 to ground. On an S3 or C3 change the pins to 8 and 9.',
      wiring: [['GPIO21', 'SDA', 'the board usually carries pull-ups'], ['GPIO22', 'SCL'], ['3V3', 'VCC'], ['GND', 'GND and AD0']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz
          print (join [WHO_AM_I = 0x] (hex of (I2C read (1) bytes from address (0x68) register (0x75))))
          I2C write (0) to address (0x68) register (0x6B)        // clear the SLEEP bit: wake up
        forever
          set [data v] to (I2C read (6) bytes from address (0x68) register (0x3B))
          set [x v] to ((signed 16-bit value of high byte (item (1) of (data)) low byte (item (2) of (data))) / (16384))
          set [y v] to ((signed 16-bit value of high byte (item (3) of (data)) low byte (item (4) of (data))) / (16384))
          set [z v] to ((signed 16-bit value of high byte (item (5) of (data)) low byte (item (6) of (data))) / (16384))
          print (join [x ] (x) [ g   y ] (y) [ g   z ] (z) [ g])
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t MPU = 0x68;                    // AD0 to ground
        const uint8_t WHO_AM_I = 0x75, PWR_MGMT_1 = 0x6B, ACCEL_XOUT_H = 0x3B;

        uint8_t readRegister(uint8_t reg) {
          Wire.beginTransmission(MPU);
          Wire.write(reg);
          Wire.endTransmission(false);               // repeated START
          Wire.requestFrom(MPU, (size_t)1);
          return Wire.read();
        }

        void writeRegister(uint8_t reg, uint8_t value) {
          Wire.beginTransmission(MPU);
          Wire.write(reg);
          Wire.write(value);
          Wire.endTransmission();
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
          Serial.printf("WHO_AM_I = 0x%02X (expected 0x68)\n", readRegister(WHO_AM_I));
          writeRegister(PWR_MGMT_1, 0x00);           // clear the SLEEP bit: wake up
        }

        void loop() {
          Wire.beginTransmission(MPU);
          Wire.write(ACCEL_XOUT_H);
          Wire.endTransmission(false);
          Wire.requestFrom(MPU, (size_t)6);          // X, Y, Z, high byte first
          int16_t raw[3];
          for (int i = 0; i < 3; i++) {
            uint8_t hi = Wire.read();
            uint8_t lo = Wire.read();
            raw[i] = (int16_t)((hi << 8) | lo);      // two's complement, 16 bits
          }
          Serial.printf("x %.3f g   y %.3f g   z %.3f g\n", raw[0] / 16384.0, raw[1] / 16384.0, raw[2] / 16384.0);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import struct, time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)   # ESP32 pins; the S3 and C3 use 8 and 9
        MPU = 0x68                                   # AD0 to ground
        WHO_AM_I, PWR_MGMT_1, ACCEL_XOUT_H = 0x75, 0x6B, 0x3B

        print("WHO_AM_I = 0x%02X (expected 0x68)" % i2c.readfrom_mem(MPU, WHO_AM_I, 1)[0])
        i2c.writeto_mem(MPU, PWR_MGMT_1, b"\x00")    # clear the SLEEP bit: wake up

        while True:
            data = i2c.readfrom_mem(MPU, ACCEL_XOUT_H, 6)   # X, Y, Z, high byte first
            x, y, z = struct.unpack(">hhh", data)    # three big-endian signed 16-bit numbers
            print("x %.3f g   y %.3f g   z %.3f g" % (x / 16384, y / 16384, z / 16384))
            time.sleep_ms(500)
      `,
      output: `
        WHO_AM_I = 0x68 (expected 0x68)
        x 0.012 g   y -0.008 g   z 1.001 g
      `,
      notes: ['Lying flat the Z axis reads about +1 g: gravity, the one acceleration that never stops.', 'If WHO_AM_I prints something else (0x70, 0x72 and other values appear on look-alike boards) the chip is a different part or a clone: do not trust the register map until you have found the right datasheet.']
    },
    {
      title: 'Change only some bits: read, modify, write',
      about: 'Selects the ±4 g range by changing bits 4 and 3 of ACCEL_CONFIG without touching the others, then reads the register back to prove that it took (0x08).',
      needs: 'The same board and MPU6050.',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL']],
      blocks: `
        define update bits (register) (mask) (value)
          set [current v] to (I2C read (1) bytes from address (0x68) register (register))
          I2C write (((current) AND (NOT (mask))) OR ((value) AND (mask))) to address (0x68) register (register)

        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22) at (400000) Hz
          I2C write (0) to address (0x68) register (0x6B)         // wake up
          update bits (0x1C) (0x18) (0x08) :: my                  // bits 4:3 = 1 means +-4 g
          print (join [ACCEL_CONFIG reads back 0x] (hex of (I2C read (1) bytes from address (0x68) register (0x1C))))
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t MPU = 0x68;
        const uint8_t ACCEL_CONFIG = 0x1C;
        const uint8_t AFS_SEL_MASK = 0b00011000;     // bits 4:3 pick the range: 0 is +-2 g ... 3 is +-16 g

        uint8_t readRegister(uint8_t reg) {
          Wire.beginTransmission(MPU);
          Wire.write(reg);
          Wire.endTransmission(false);
          Wire.requestFrom(MPU, (size_t)1);
          return Wire.read();
        }

        void writeRegister(uint8_t reg, uint8_t value) {
          Wire.beginTransmission(MPU);
          Wire.write(reg);
          Wire.write(value);
          Wire.endTransmission();
        }

        // Change only the bits in mask; every other bit keeps its value.
        void updateBits(uint8_t reg, uint8_t mask, uint8_t value) {
          uint8_t current = readRegister(reg);
          writeRegister(reg, (current & ~mask) | (value & mask));
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22, 400000);
          writeRegister(0x6B, 0x00);                 // wake up
          updateBits(ACCEL_CONFIG, AFS_SEL_MASK, 1 << 3);   // range 1: +-4 g, 8192 counts per g
          Serial.printf("ACCEL_CONFIG reads back 0x%02X\n", readRegister(ACCEL_CONFIG));   // expect 0x08
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        MPU = 0x68
        ACCEL_CONFIG = 0x1C
        AFS_SEL_MASK = 0b00011000                    # bits 4:3 pick the range: 0 is +-2 g ... 3 is +-16 g

        def update_bits(reg, mask, value):
            """Change only the bits in mask; every other bit keeps its value."""
            current = i2c.readfrom_mem(MPU, reg, 1)[0]
            i2c.writeto_mem(MPU, reg, bytes([(current & ~mask & 0xFF) | (value & mask)]))

        i2c.writeto_mem(MPU, 0x6B, b"\x00")          # wake up
        update_bits(ACCEL_CONFIG, AFS_SEL_MASK, 1 << 3)   # range 1: +-4 g, 8192 counts per g
        print("ACCEL_CONFIG reads back 0x%02X" % i2c.readfrom_mem(MPU, ACCEL_CONFIG, 1)[0])   # expect 0x08
      `,
      output: `
        ACCEL_CONFIG reads back 0x08
      `,
      notes: ['From now on divide the readings by 8192, not 16 384: the range and the scale factor change together, and forgetting that is a classic mistake.', 'Some registers are write-only or clear themselves (a RESET bit): reading them back does not show what you wrote. The datasheet says which.']
    }
  ],
  formulas: [
    {
      name: 'From raw counts to units',
      expr: 'a = raw/S',
      tex: 'a = \\frac{\\mathrm{raw}}{S}',
      vars: {
        a: { name: 'acceleration', unit: 'g', signed: true },
        raw: { name: 'raw reading (signed)', tex: '\\mathrm{raw}', value: -400, signed: true, int: true },
        S: { name: 'sensitivity (counts per g)', value: 16384, min: 1 }
      },
      solveFor: 'a',
      note: 'The sensitivity depends on the range register: for an MPU6050, 16 384 counts per g at ±2 g, 8192 at ±4 g, 4096 at ±8 g and 2048 at ±16 g. Combine the two bytes into a signed number first.',
      stories: { a: 'A sensor reads {raw} counts with a sensitivity of {S} counts per g. What is the acceleration?' }
    }
  ],
  examples: [
    {
      title: 'Two bytes from the wire',
      q: 'An MPU6050 at its default ±2 g range returns 0xFE 0x70 for the X acceleration. How large is it?',
      steps: ['Combine: $(0\\text{xFE} \\ll 8) \\mid 0\\text{x70} = 0\\text{xFE70} = 65\\,136$.', 'The top bit is set, so the number is negative: $65\\,136 - 65\\,536 = -400$.', 'Scale at 16 384 counts per g: $-400 / 16\\,384 = -0.0244$ g.'],
      a: 'About −0.024 g: the sensor is nearly level along X, tilted a hair the other way.'
    }
  ],
  quiz: [
    { q: 'The two bytes 0xFE and 0x70 are the X acceleration of a sensor at ±2 g (16 384 counts per g). What is the value?', choices: ['+0.024 g', '−0.024 g', '−1.0 g', '65 136 g'], a: 1, why: '0xFE70 is 65 136 unsigned; with the top bit set it is 65 136 − 65 536 = −400 as a signed 16-bit number, and −400 / 16 384 is −0.0244 g.' },
    { q: 'Why do you read the WHO_AM_I register before anything else?', choices: ['It sets the range', 'A correct answer proves the address, the wiring and the chip type', 'It wakes the chip', 'It resets the registers'], a: 1, why: 'A successful read of a fixed, known value shows that bus, address and part are right. If it fails or differs, everything after it would be unreliable.' },
    { q: 'To change one bit of a configuration register without disturbing the others, you should write a byte that has only that bit set.', a: false, why: 'That would clear all the other bits. Read the register, change the bits of the field, and write the result back: read-modify-write.' },
    { q: 'A TMP102 sends 0x19 0x00 for the temperature. Its 12 bits sit in the top of the 16 and one step is 0.0625 °C. What is the temperature?', choices: ['25.0 °C', '100 °C', '1.6 °C', '400 °C'], a: 0, why: '0x1900 shifted right by four is 0x190 = 400 steps; 400 × 0.0625 °C = 25.0 °C. Forgetting the shift gives 6400 steps, which is nonsense.' }
  ],
  applications: [
    'Bringing up a sensor that has no library for your platform, from its datasheet alone.',
    'Finding out why a library rejects a board: the ID register of a clone differs from the original.',
    'Setting up radio chips, display controllers and ADCs, which have dozens of registers and a long initialisation sequence.',
    'Changing a sensor\'s range, rate and filter at run time without reloading a library.'
  ],
  sources: [
    'InvenSense (TDK), *MPU-6000 and MPU-6050 Register Map and Descriptions*: WHO_AM_I, PWR_MGMT_1, ACCEL_CONFIG and the data registers.',
    'Texas Instruments, *TMP102 datasheet*: the temperature register format.',
    'Espressif, *ESP-IDF Programming Guide* and the Arduino *Wire* documentation (core 3.3): register reads and writes over I2C; MicroPython documentation: *machine.I2C* readfrom_mem and writeto_mem.'
  ],
  sim: 'ub-register'
}
);
