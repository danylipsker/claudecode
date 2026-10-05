/* HYPER-ESP32 · content/seeed-and-small-boards.js
 *
 * Seeed and the thumb-sized boards (branch: Boards and Makers; simulation code: sx).
 *
 *   the-xiao-form-factor              XIAO: fourteen pads and a USB-C
 *   xiao-esp32c3                      XIAO ESP32C3
 *   xiao-esp32s3-and-sense            XIAO ESP32S3 and S3 Sense
 *   xiao-esp32c6-and-c5               XIAO ESP32C6 and C5
 *   grove-system                      Grove: sensors without soldering
 *   qt-py-and-stemma-qt               QT Py and STEMMA QT
 *   supermini-and-zero-boards         SuperMini and Zero boards
 *   sensecap-and-finished-seeed-devices   SenseCAP and Seeed's finished devices
 *   living-with-few-pins              Living with eleven pins
 *   battery-pads-and-tiny-antennas    Battery pads and tiny antennas
 *
 * Every board fact comes from the board catalogue (the makers' own pages, read on 2026-10-04).
 */
Hyper.add(
/* ================================================================ the form factor */
{
  id: 'the-xiao-form-factor',
  parent: 'seeed-and-small-boards',
  title: 'XIAO: fourteen pads and a USB-C',
  level: 1,
  short: 'XIAO is Seeed Studio\'s thumb-sized board: 17.8 × 21 mm, a USB-C socket, fourteen edge pads and eleven signal pins named D0 to D10. The names are the same on every ESP32 XIAO; the GPIOs behind them are not.',
  keywords: ['XIAO', 'Seeed Studio', 'D0', 'D10', 'castellated pads', 'thumb-sized', 'pin names', 'pin map', 'XIAO ESP32C3', 'XIAO ESP32S3', 'XIAO ESP32C6', 'XIAO ESP32C5', 'BAT pads', 'U.FL', '2 x 7 pads', 'form factor'],
  prereq: ['chip-module-board', 'gpio-numbers-and-board-labels'],
  related: ['xiao-esp32c3', 'xiao-esp32s3-and-sense', 'xiao-esp32c6-and-c5', 'qt-py-and-stemma-qt', 'form-factors', 'living-with-few-pins', 'reading-a-pinout'],
  body: `A XIAO is a whole ESP32 computer the size of a thumb joint. Seeed Studio designed the format around one idea: put everything a small project needs on one flat board, and bring out only as many pins as such a board can carry. The ESP32 members in the catalogue — the XIAO ESP32C3, ESP32S3 (with its Plus and Sense versions), ESP32C6 and ESP32C5 — all follow it, so a case, a socket or a carrier board made for one will often take another.

### What is on every board
All of them measure 17.8 mm by 21 mm (the Sense, with its camera board stacked on, is 15 mm thick). Walking from the USB-C socket:

- **USB-C** straight into the chip's own serial and debug port: no bridge chip.
- **Reset and boot buttons**, tiny ones.
- **A charge LED** and, under the board, **BAT pads** where you solder a single lithium cell; a charger chip then charges it from USB ([[battery-pads-and-tiny-antennas]]).
- **An antenna connector**: a U.FL socket on all four chips in the catalogue, and an antenna in the box. The C6 also carries an on-board antenna and a switch to choose between them.
- **Two rows of seven pads** at 2.54 mm pitch with half-holes at the edge. Solder pin headers on them for a breadboard, or solder the board down like a module. Three pads are power (3V3, GND, 5V); the other **eleven are signals**.

### Names the same, pins different
Seeed labels the signal pads D0 to D10 in the same places on every XIAO, and gives the same positions the same roles: D4 and D5 are the I2C data and clock, D6 and D7 the serial transmit and receive, D8, D9 and D10 the SPI clock, input and output. What differs is the GPIO the chip designer left free for each:

| Pad | Role | C3 | S3 | C6 | C5 |
|---|---|---|---|---|---|
| D0 | none fixed | GPIO2 | GPIO1 | GPIO0 | GPIO1 |
| D1 | none fixed | GPIO3 | GPIO2 | GPIO1 | GPIO0 |
| D2 | none fixed | GPIO4 | GPIO3 | GPIO2 | GPIO25 |
| D3 | none fixed | GPIO5 | GPIO4 | GPIO21 | GPIO7 |
| D4 | I2C data | GPIO6 | GPIO5 | GPIO22 | GPIO23 |
| D5 | I2C clock | GPIO7 | GPIO6 | GPIO23 | GPIO24 |
| D6 | serial TX | GPIO21 | GPIO43 | GPIO16 | GPIO11 |
| D7 | serial RX | GPIO20 | GPIO44 | GPIO17 | GPIO12 |
| D8 | SPI clock | GPIO8 | GPIO7 | GPIO19 | GPIO8 |
| D9 | SPI input | GPIO9 | GPIO8 | GPIO20 | GPIO9 |
| D10 | SPI output | GPIO10 | GPIO9 | GPIO18 | GPIO10 |

D0 to D3 have no fixed role; which of them can read an analogue voltage depends on the chip, and the page of each board says which. The simulation below draws the board and lets you switch chips; [the board catalogue](#/tools/boards?maker=Seeed%20Studio) lists every Seeed board, and [the pinout explorer](#/tools/pinout?board=seeed-xiao-esp32c3) draws each XIAO with what its pins can do.

The rule that follows: **a program written with the names D0 to D10 moves between XIAO boards; a program written with GPIO numbers does not.** In the Arduino core, choosing a XIAO board defines the names for you; in MicroPython you write the GPIO number, so keep the table above beside your code.

### What the format cannot give
Eleven pins are not many, and some of them are spoken for before you start: serial, SPI and I2C take seven, and on some chips several pads are strapping pins ([[living-with-few-pins]]). The roles are the same on every board, but whether a given pad can do a given job is a property of the chip: an analogue sensor wired to D3 works on the S3, is unreliable on the C3 (its ADC2), and cannot work on the C6 or C5, whose D3 pads have no ADC at all.

> [!key] A XIAO is a 17.8 × 21 mm board with eleven signal pads named D0 to D10 in the same places on every chip, USB-C, a lithium charger and an antenna connector. Write code with the D-names, then check the table: the GPIO behind each name, and what that pin can do, depends on the chip.`,
  ideas: [
    'One footprint, many chips: the pads D0–D10 sit in the same places on every ESP32 XIAO and have the same roles for I2C, serial and SPI.',
    'The GPIO behind a D-name is chosen per chip, so code written with D-names is portable and code written with GPIO numbers is not.',
    'Fourteen pads are three power pins and eleven signals; the lithium cell goes on pads under the board and is charged by a chip on the board.',
    'The same role does not mean the same ability: whether a pad has an ADC, a touch channel or a strapping function depends on the chip.'
  ],
  pitfalls: [
    'D4 is GPIO4 — It is GPIO4 on none of them. On the C3 it is GPIO6, on the S3 GPIO5, on the C6 GPIO22 and on the C5 GPIO23. The number in the name counts pads, not GPIOs.',
    'Any XIAO carrier board works with any XIAO chip — The pads line up and the roles match, but a job the carrier assumes (an analogue sensor on D3, a boot-sensitive device on D9) can fail on a chip whose pin behaves differently. Check the pad, not just the fit.',
    'A XIAO is a DevKit made smaller — It is a different trade: eleven signal pads instead of thirty or more, no spare room on the board, and strapping pins that are not always out of the way.'
  ],
  terms: [
    { term: 'XIAO', also: ['Seeed XIAO'], def: 'Seeed Studio\'s name for its thumb-sized development boards: 17.8 × 21 mm with a USB-C socket, two rows of seven edge pads and a charger for a lithium cell. The format is shared by boards with different chips.' },
    { term: 'Castellated pad', also: ['castellation', 'half-hole pad'], def: 'A pad cut in half along the edge of a board, so that it can be soldered down on a carrier board like a module, or have a pin header soldered through it.' },
    { term: 'Pin alias', also: ['D0', 'A0', 'board pin name'], def: 'A name a board gives to a pin so that code does not need the chip\'s GPIO number: D4 means whichever GPIO is wired to the pad printed D4. Aliases make a program portable across boards of one family.' },
    { term: 'BAT pads', also: ['battery pads'], def: 'Two solder pads, usually under a small board, for a single lithium cell. The board\'s charger and regulator work from them when USB is absent.' }
  ],
  choose: {
    good: ['Wearables, badges and sensor nodes where 17.8 × 21 mm matters', 'A module-like board you can first use on a breadboard and later solder down', 'A project that fits in about eleven pins and one lithium cell'],
    avoid: ['Projects that need twenty or more pins: choose a DevKit or a board with more pads', 'Designs that must move between boards by GPIO number', 'Anything that has to survive without a case: the board is small and bare'],
    check: ['The GPIO behind each pad you plan to use, in the table or the pinout explorer', 'Which pads are strapping pins on your chip', 'That the antenna is attached before you judge range']
  },
  code: [
    {
      title: 'Blink the user LED of a XIAO',
      about: 'The user LED is on a different GPIO on each board: GPIO15 on the C6, GPIO21 on the S3, GPIO27 on the C5. The C3 has none (only a charge LED). The program blinks it once a second; the catalogue gives the pin, not which level lights the LED, but a blink is symmetrical so it does not matter here.',
      needs: 'A XIAO ESP32C6 and a USB-C data cable. For an S3 change the pin to 21, for a C5 to 27.',
      wiring: [['USB-C', 'computer', 'no other parts needed']],
      blocks: `
        when started
          set pin (15) as [output v]
        forever
          set pin (15) to [HIGH v]
          wait (0.5) seconds
          set pin (15) to [LOW v]
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int LED = 15;              // XIAO ESP32C6; S3: 21, C5: 27 (the C3 has no user LED)

        void setup() {
          pinMode(LED, OUTPUT);
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

        led = Pin(15, Pin.OUT)           # XIAO ESP32C6; S3: 21, C5: 27 (the C3 has no user LED)

        while True:
            led.value(1)
            time.sleep_ms(500)
            led.value(0)
            time.sleep_ms(500)
      `,
      notes: ['If the LED seems to be on while the pin is low, it is wired active low: swap the two levels. For a plain blink it makes no difference.', 'The number in the program is the GPIO of the LED, not a D-name: the LED is not on any pad.']
    }
  ],
  examples: [
    {
      title: 'Moving a sketch from the C3 to the S3',
      q: 'A sketch reads a button on D1 and drives an LED on D10 and runs on a XIAO ESP32C3. Which GPIOs does it use on the C3, and on the S3, if it is written with the D-names?',
      steps: ['On the C3, D1 is GPIO3 and D10 is GPIO10 (from the table).', 'On the S3, D1 is GPIO2 and D10 is GPIO9.', 'The sketch contains only D1 and D10, so nothing changes: the same wires on the same pads work on both boards.', 'Had it said GPIO3 and GPIO10, then on the S3 it would read GPIO3, which is pad D2 (a strapping pin), and drive GPIO10, which is not on the header at all. The wiring would be right and the program would be looking at the wrong pins.'],
      a: 'With D-names the sketch runs unchanged; with GPIO numbers it would look at different pins on the S3.'
    }
  ],
  quiz: [
    { q: 'Which is true of pad D4 on the ESP32 XIAO boards?', choices: ['It is GPIO4 on every board', 'It is the I2C data pad on every board, with a different GPIO on each chip', 'It is an analogue pad on every board', 'It exists only on the ESP32S3'], a: 1, why: 'The names and roles are fixed by the format (D4 = I2C data, D5 = I2C clock); the GPIO is the chip\'s own: 6 on the C3, 5 on the S3, 22 on the C6, 23 on the C5.' },
    { q: 'A sensor with an analogue output is wired to D3. On which XIAO does that work reliably?', choices: ['All four boards', 'Only the ESP32S3: D3 is GPIO4, an ADC1 pin', 'Only the C6 and the C5', 'None of them'], a: 1, why: 'On the C3, D3 is GPIO5, the ADC2 channel the catalogue calls unreliable. On the C6 (GPIO21) and C5 (GPIO7) the pad has no ADC. On the S3, GPIO4 is ADC1 channel 3.' },
    { q: 'All ESP32 XIAO boards use the same GPIO for the BOOT button.', a: false, why: 'GPIO9 on the C3 and C6, GPIO0 on the S3 and GPIO28 on the C5. The button is on the board, not on a D-pad, so the name offers no help.' },
    { q: 'A XIAO has fourteen pads. How many of them are signal pins?', choices: ['Fourteen', 'Eleven', 'Seven', 'Ten'], a: 1, why: 'D0 to D10 are the eleven signals; the other three pads are 3V3, GND and 5V.' }
  ],
  applications: [
    'Wearables, badges and name tags where a whole Wi-Fi and Bluetooth LE computer must fit on a wrist or a lanyard.',
    'Sensor nodes inside small enclosures, soldered down on a carrier board with the sensor.',
    'Prototypes on a breadboard that become products by soldering the same board onto the final PCB.',
    'Compact USB gadgets — keyboards, macro pads, status lights — built on the S3\'s native USB.'
  ],
  sources: [
    'Seeed Studio wiki: the getting-started pages of the XIAO ESP32C3, ESP32S3, ESP32C6 and ESP32C5 (pin maps, battery pads, antenna).',
    'Espressif datasheets of the ESP32-C3, ESP32-S3, ESP32-C6 and ESP32-C5: GPIO tables and strapping pins.',
    'The arduino-esp32 repository: board variants for the XIAO boards (the pin names D0 to D10).'
  ],
  sim: 'sx-xiao-pins'
},

/* ================================================================ XIAO ESP32C3 */
{
  id: 'xiao-esp32c3',
  parent: 'seeed-and-small-boards',
  title: 'XIAO ESP32C3',
  level: 1,
  short: 'The cheapest XIAO: an ESP32-C3 with 4 MB of flash, a lithium charger and a U.FL antenna connector on 17.8 × 21 mm. Eleven pads, of which only a few are free of strings: know which before you wire.',
  keywords: ['XIAO ESP32C3', 'ESP32-C3', 'ETA4054', 'U.FL', 'battery pads', 'ADC', 'strapping', 'D9', 'GPIO9', 'deep sleep wake', 'RISC-V', 'cheapest XIAO'],
  prereq: ['the-xiao-form-factor', 'soc-esp32-c3', 'strapping-pins'],
  related: ['supermini-and-zero-boards', 'qt-py-and-stemma-qt', 'living-with-few-pins', 'battery-pads-and-tiny-antennas', 'adc1-adc2-and-wifi', 'safe-pins-s3-c3-c6'],
  body: `The XIAO ESP32C3 is where most people meet the format, and the catalogue calls it the cheapest XIAO ESP32. Inside is an [[soc-esp32-c3|ESP32-C3]]: one RISC-V core at 160 MHz, Wi-Fi 4 and Bluetooth LE 5, 400 KB of SRAM and 4 MB of flash, and no PSRAM. The USB-C socket goes to the chip's own serial and debug port. The chip alone sleeps at 5 µA; the catalogue holds no deep-sleep figure for the whole board, which also carries a charger and a regulator.

### On the board
- Reset and boot buttons, a charge LED and **no user LED**: to blink something you must wire an LED to a pad.
- **Battery pads** and a charger chip, the ETA4054S2F: about 380 mA of fast charge, then a 40 mA trickle.
- A **U.FL connector** for the antenna, and JTAG pads on the back.

The record is in [the board catalogue](#/tools/boards?b=seeed-xiao-esp32c3), and [the pinout explorer](#/tools/pinout?board=seeed-xiao-esp32c3) draws the board and says what every pin can do.

### The eleven pads, honestly
| Pad | GPIO | What the chip says |
|---|---|---|
| D0 | GPIO2 | analogue (ADC1), can wake deep sleep; **strapping pin** |
| D1 | GPIO3 | analogue, can wake deep sleep; a plain pin |
| D2 | GPIO4 | analogue, can wake deep sleep; JTAG pin, free while JTAG runs over USB |
| D3 | GPIO5 | can wake deep sleep; its ADC channel is on ADC2, unreliable on the C3 |
| D4 | GPIO6 | I2C data (SDA) |
| D5 | GPIO7 | I2C clock (SCL) |
| D6 | GPIO21 | serial TX (UART0): the ROM prints its boot log here at every reset |
| D7 | GPIO20 | serial RX (UART0) |
| D8 | GPIO8 | SPI clock; **strapping pin** |
| D9 | GPIO9 | SPI input (MISO) and the BOOT button; **strapping pin** |
| D10 | GPIO10 | SPI output (MOSI); a plain pin |

Three lessons come out of that table.

**Analogue: three pads, not four.** D0, D1 and D2 are dependable ADC inputs; D3 is the C3's single ADC2 channel, which the chip's notes call not dependable. And D0 is a strapping pin, so a sensor that pulls it low while the board powers up can disturb the start.

**D8 and D9 are SPI pins and strapping pins.** A display or SD card whose clock or data line idles low can keep the board from booting; D9 is also the BOOT button, so a device that pulls it low at reset sends the chip into download mode.

**D4 and D5 are the best pair on the board.** GPIO6 and GPIO7 are not strapping pins. Beware sketches written for other C3 boards, whose default I2C pins are GPIO8 and GPIO9: on this board give the pins explicitly or let its own variant choose them.

Deep-sleep wake-up works only on GPIO0–5, which on this board means D0 to D3: put the wake button there.

### When to choose it
It is the board for small, cheap Wi-Fi and Bluetooth LE devices that need a battery charger and not much else. It is the wrong board when you need more than eleven pins, any PSRAM, a second core, Zigbee or Thread (see the [[xiao-esp32c6-and-c5|C6]]), or a USB device other than a serial port.

> [!key] The XIAO ESP32C3 is a cheap, charger-equipped ESP32-C3 on eleven pads: three analogue pads you can trust (D0–D2), two plain pads (D1, D10), three strapping pads (D0, D8, D9) and the serial pair D6 and D7. Plan the pads before you solder; the board does the rest.`,
  ideas: [
    'The XIAO ESP32C3 has an ESP32-C3 with 4 MB of flash and no PSRAM, native USB, a lithium charger and a U.FL antenna connector.',
    'Of the eleven pads, three (D0, D8, D9) are strapping pins and two (D6, D7) are the serial console pair, which prints at boot.',
    'Only D0, D1 and D2 are dependable analogue inputs; D3 sits on the unreliable ADC2.',
    'Only D0–D3 can wake the chip from deep sleep, and D4/D5 (GPIO6/7) are the clean pair for I2C.'
  ],
  pitfalls: [
    'D0 to D3 are four analogue inputs — D3 (GPIO5) is on the C3\'s ADC2, whose readings are not dependable; plan on three, D0, D1 and D2.',
    'I2C on the C3 is always on GPIO8 and GPIO9 — That is the default of some other C3 boards. Here SDA is GPIO6 and SCL is GPIO7 (D4 and D5); GPIO8 and GPIO9 are strapping pins that also carry SPI.',
    'The board sleeps at 5 µA like the chip — 5 µA is the chip. The charger, the regulator and anything on the pads add to it; measure the board, not the datasheet.'
  ],
  terms: [
    { term: 'Strapping pad', also: ['boot-sensitive pad'], def: 'A board pad wired to a chip pin whose level is read once at reset to choose how the chip starts. On the XIAO ESP32C3 these are D0, D8 and D9.' },
    { term: 'ETA4054', also: ['ETA4054S2F', 'linear charger'], def: 'A small linear charger chip for one lithium cell. On the XIAO ESP32C3 it charges at up to 380 mA and tops up at 40 mA at the end of the charge.' },
    { term: 'ADC2 channel', also: ['ADC2'], def: 'The chip\'s second analogue-to-digital converter. On the ESP32-C3 it has a single channel (GPIO5), and a hardware limitation makes its readings unreliable, so it is better left unused.' },
    { term: 'USB CDC on boot', also: ['CDC On Boot'], def: 'An Arduino board option that sends Serial output through the chip\'s own USB port. On native-USB boards such as the XIAO it must be enabled to see Serial output in the monitor.' }
  ],
  choose: {
    good: ['Small Wi-Fi or Bluetooth LE nodes with a battery and charger, at the lowest price in the family', 'Sensors on I2C (D4, D5) plus a few plain inputs and outputs', 'Projects that sleep most of the time and wake from a button on D0–D3'],
    avoid: ['More than eleven pins, or more than three dependable analogue inputs', 'Big buffers, cameras, displays with frame memory: there is no PSRAM', 'Zigbee, Thread, Wi-Fi 6 or a USB keyboard: choose the C6 or the S3'],
    check: ['What is wired to D0, D8 and D9 at power-up', 'That USB CDC on boot is enabled before you wait for Serial output', 'The board\'s own sleep current, measured with your wiring', 'That the supplied antenna is attached']
  },
  code: [
    {
      title: 'Two analogue inputs in millivolts',
      about: 'Reads a potentiometer on D1 and a light sensor on D2 and prints both in millivolts. At the default setting the C3\'s converter reads about 0 to 2.5 V, so a potentiometer across 3V3 saturates near three quarters of its travel.',
      needs: 'A XIAO ESP32C3, a 10 kΩ potentiometer and a light-dependent resistor with a 10 kΩ resistor. In the Arduino IDE set Tools > USB CDC On Boot to Enabled.',
      wiring: [['D1 (GPIO3)', 'potentiometer wiper', 'its ends to 3V3 and GND'], ['D2 (GPIO4)', 'junction of the LDR and a 10 kΩ resistor', 'LDR to 3V3, resistor to GND']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          print (join [pot ] (analog read pin (3) in millivolts))
          print (join [ldr ] (analog read pin (4) in millivolts))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int POT = 3;               // D1 = GPIO3, ADC1 channel 3
        const int LDR = 4;               // D2 = GPIO4, ADC1 channel 4

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int mvPot = analogReadMilliVolts(POT);
          int mvLdr = analogReadMilliVolts(LDR);
          Serial.printf("pot %4d mV   ldr %4d mV\n", mvPot, mvLdr);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        pot = ADC(Pin(3), atten=ADC.ATTN_11DB)   # D1 = GPIO3
        ldr = ADC(Pin(4), atten=ADC.ATTN_11DB)   # D2 = GPIO4

        while True:
            mv_pot = pot.read_uv() // 1000       # calibrated microvolts -> millivolts
            mv_ldr = ldr.read_uv() // 1000
            print("pot", mv_pot, "mV   ldr", mv_ldr, "mV")
            time.sleep_ms(500)
      `,
      output: `
        pot  812 mV   ldr 1634 mV
        pot 1655 mV   ldr 1630 mV
        pot 2503 mV   ldr 1641 mV
      `,
      notes: ['Do not use D3 (GPIO5) for a third analogue input: it is the C3\'s ADC2 channel.', 'Wire the potentiometer\'s ends to 3V3 and GND, never to 5V: the pin must stay at or below 3.3 V.']
    }
  ],
  examples: [
    {
      title: 'Where does a 3.3 V sensor clip?',
      q: 'A sensor swings from 0 to 3.3 V into D1 while the converter reads 0 to 2.5 V. What share of its swing is lost, and what would bring it into range?',
      steps: ['The converter sees up to 2.5 V of 3.3 V: $2.5 / 3.3 = 0.76$, so the top quarter of the swing reads as full scale.', 'A divider that maps 3.3 V to about 2.4 V needs a ratio of 0.73. With 5.6 kΩ above and 15 kΩ below: $3.3 \\times 15 / (5.6 + 15) = 2.40$ V.', 'The divider\'s source resistance is about 4 kΩ, comfortably low for the converter.'],
      a: 'About a quarter of the swing is clipped. A 5.6 kΩ / 15 kΩ divider brings 3.3 V down to 2.4 V and keeps the whole range readable.'
    }
  ],
  quiz: [
    { q: 'Which pads of the XIAO ESP32C3 can wake the chip from deep sleep?', choices: ['Any of the eleven', 'D0 to D3, which are GPIO2 to GPIO5', 'Only D9, the BOOT pad', 'Only D6 and D7'], a: 1, why: 'Deep-sleep wake-up works on GPIO0–5 only; on this board those reach the pads as D0 to D3 (GPIO2 to GPIO5).' },
    { q: 'Why is D3 a poor choice for a third analogue input?', choices: ['It has no ADC at all', 'Its ADC channel is on ADC2, which is unreliable on the C3', 'It is a USB pin', 'It draws current from the charger'], a: 1, why: 'D3 is GPIO5, the single ADC2 channel of the ESP32-C3, and the chip\'s notes call ADC2 not dependable. D0 to D2 are on ADC1.' },
    { q: 'An SPI display\'s data line idles low and is wired to D9. The board stops starting normally. Why?', choices: ['The display draws too much current', 'D9 is GPIO9, the boot strapping pin, and low at reset requests download mode', 'SPI cannot use D9', 'The charger cut the supply'], a: 1, why: 'GPIO9 low at reset (with GPIO8 high) selects download boot. D9 is also the BOOT button. Keep the display\'s idle level high at power-up, or use another pad.' },
    { q: 'The XIAO ESP32C3 has a user LED on GPIO21.', a: false, why: 'It has only a charge LED. GPIO21 is D6, the serial TX pad. Of the XIAO ESP32 boards the C6 (GPIO15), S3 (GPIO21) and C5 (GPIO27) have a user LED.' }
  ],
  applications: [
    'Battery sensor nodes that wake on a timer or a button, read an I2C sensor on D4/D5 and report over Wi-Fi or Bluetooth LE.',
    'Wearable tags and badges built on one cell and the on-board charger.',
    'Cheap smart switches and indicators with a handful of plain pads.',
    'E-paper tags: the catalogue lists a XIAO ESP32C3 inside Seeed\'s 7.5 inch e-paper panel.'
  ],
  sources: [
    'Seeed Studio wiki, XIAO ESP32C3 getting started: pin map, battery pads, antenna.',
    'Espressif, ESP32-C3 Series Datasheet: pin table, strapping pins, ADC and deep-sleep wake-up.',
    'Espressif, ESP-IDF Programming Guide, ESP32-C3 ADC reference (the ADC2 limitation).'
  ],
  sim: { id: 'sx-xiao-pins', params: { chip: 'esp32-c3' } }
},

/* ================================================================ XIAO ESP32S3 and Sense */
{
  id: 'xiao-esp32s3-and-sense',
  parent: 'seeed-and-small-boards',
  title: 'XIAO ESP32S3 and S3 Sense',
  level: 1,
  short: 'The most capable XIAO: a dual-core ESP32-S3 with 8 MB of PSRAM and 8 MB of flash, native USB, nine analogue and touch pads — and a Sense version that adds a camera, a microphone and an SD slot.',
  keywords: ['XIAO ESP32S3', 'XIAO ESP32S3 Sense', 'XIAO ESP32S3 Plus', 'ESP32-S3R8', 'OV3660', 'OV2640', 'PDM microphone', 'microSD', 'B2B connector', 'touch', 'PSRAM', 'native USB', 'TinyML'],
  prereq: ['the-xiao-form-factor', 'soc-esp32-s3'],
  related: ['xiao-esp32c3', 'esp32-cam-boards', 'lora-boards', 'touch-pins', 'using-psram', 'camera-interfaces'],
  body: `The XIAO ESP32S3 is the board that makes the format feel generous. An [[soc-esp32-s3|ESP32-S3]] with two 240 MHz cores, 8 MB of octal PSRAM and 8 MB of flash (the S3R8 part), native USB for serial, debugging and USB device work, and a lithium charger of about 100 mA, on the same 17.8 × 21 mm as the C3. The catalogue gives 14 µA for deep sleep of the whole board; the bare chip is 7 µA.

### Three boards on one footprint
- **XIAO ESP32S3**, the base board: a user LED on GPIO21, a U.FL antenna connector, and under the board a B2B connector (two extra GPIOs on the base model) plus two bottom pads, A11 and A12, which are GPIO41 and GPIO42.
- **XIAO ESP32S3 Sense**: the same board with an expansion board plugged onto the B2B connector. It adds an **OV3660 camera** (earlier boards used an OV2640), a **digital PDM microphone** (clock GPIO42, data GPIO41) and a **microSD slot** for cards up to 32 GB (FAT; chip select GPIO21, clock GPIO7, MISO GPIO8, MOSI GPIO9). The pair is 15 mm thick.
- **XIAO ESP32S3 Plus**: 16 MB of flash and 18 GPIOs, the extra ones on pads on the back (named up to D19), two serial ports and two SPI buses. Its B2B connector fits the Wio-SX1262 LoRa board, not the Sense camera board; battery voltage is readable on GPIO10.

The catalogue holds [the S3](#/tools/boards?b=seeed-xiao-esp32s3), [the Sense](#/tools/boards?b=seeed-xiao-esp32s3-sense) and [the Plus](#/tools/boards?b=seeed-xiao-esp32s3-plus); [the pinout explorer](#/tools/pinout?board=seeed-xiao-esp32s3) draws the base board.

### What the pads can do
D0 to D5 and D8 to D10 are GPIO1 to GPIO9: every one is an ADC1 channel (so Wi-Fi does not disturb it) and a touch channel (TOUCH1 to TOUCH9), nine in all. D2 (GPIO3) is a strapping pin that picks the JTAG source; D6 and D7 (GPIO43, GPIO44) are the serial pair. The bottom pads A11 and A12 are **not** analogue despite their names. Of the four chips in the catalogue this one has by far the most analogue-capable pads.

### The traps the catalogue records
- **GPIO21 is two things on the Sense**: the user LED and the SD card's chip select. Lighting the LED while the card is in use disturbs the card.
- **The card sits on the SPI pads D8 to D10.** Another SPI device must share that bus and have its own chip select.
- **GPIO41 and GPIO42 belong to the microphone** on the Sense, so those extra pads are not free there.
- **The camera uses GPIO10 to 18, 38 to 40, 47 and 48** on the B2B connector — none of the eleven header pads. It peaks near 350 mA while capturing and the board warms up: feed it from a good USB port or a cell that can give the current.
- **Enable OPI PSRAM** in the Arduino board options for camera work; frames live there.

### When to choose it
Choose it for a tiny USB gadget that must behave as a keyboard or drive (the S3 has USB OTG), a small camera or microphone node, TinyML on 8 MB of PSRAM, or anything needing many analogue or touch pads. Choose the C3 when price and sleep current rule, and the [[xiao-esp32c6-and-c5|C6]] when Thread or Zigbee matter.

> [!key] The XIAO ESP32S3 packs two cores, 8 MB of PSRAM and 8 MB of flash, native USB and nine analogue-and-touch pads into the XIAO footprint; the Sense adds a camera, microphone and SD card, and in return takes GPIO21, GPIO41, GPIO42 and the SPI pads.`,
  ideas: [
    'The XIAO ESP32S3 has two cores, 8 MB of PSRAM and 8 MB of flash, native USB and a lithium charger; the Plus has 16 MB of flash and extra pads.',
    'Nine pads (D0–D5, D8–D10) are both ADC1 and touch channels, so analogue inputs work with Wi-Fi on.',
    'The Sense board adds a camera, a PDM microphone and an SD slot, and uses GPIO21, 41, 42 and the SPI pads for them.',
    'The camera peaks near 350 mA, so supply and heat matter; OPI PSRAM must be switched on in the board options.'
  ],
  pitfalls: [
    'A11 and A12 are two more analogue inputs — Their names say analogue but GPIO41 and GPIO42 have no ADC; on the Sense they are also the microphone\'s lines.',
    'The user LED on GPIO21 is always free to use — On the Sense GPIO21 is also the SD card\'s chip select: using the LED while reading the card corrupts the transfer.',
    'The camera on the Sense eats the header pads — It does not: the camera uses the B2B connector\'s own pins. What the Sense does take is D8 to D10 (the SD card), GPIO21 (the card\'s chip select) and the two bottom pads (the microphone).'
  ],
  terms: [
    { term: 'B2B connector', also: ['board-to-board connector'], def: 'A small stacking connector on the underside of the XIAO ESP32S3 that carries extra GPIOs to an expansion board: the Sense camera board, or a LoRa board on the Plus.' },
    { term: 'PDM microphone', also: ['PDM', 'pulse-density modulation'], def: 'A digital microphone that outputs a one-bit stream at a high clock rate; the chip filters it down to sound samples. On the Sense its clock is GPIO42 and its data GPIO41.' },
    { term: 'Octal PSRAM', also: ['OPI PSRAM'], def: 'External memory attached to the chip over eight data lines, giving 8 MB on the S3R8. Arduino must be told to use it (the OPI PSRAM board option) or the camera driver cannot allocate frames.' },
    { term: 'Touch channel', also: ['capacitive touch pad'], def: 'A pin the chip can use to sense a finger by the change in its capacitance. On the ESP32-S3 the reading goes up when touched, and GPIO1 to GPIO14 are touch channels.' }
  ],
  choose: {
    good: ['Tiny USB gadgets (keyboard, MIDI, drive) in 17.8 × 21 mm', 'A small Wi-Fi camera with a microphone and an SD card (the Sense)', 'TinyML and audio work that needs 8 MB of PSRAM', 'Many analogue or touch pads without a second chip'],
    avoid: ['Needing more than eleven pins on the plain board: the Plus adds pads only on its back', 'A camera on a weak USB port or a very small cell: it peaks near 350 mA', 'The lowest price or lowest sleep current: the C3 or C6 do better'],
    check: ['That OPI PSRAM is enabled in the board options for camera work', 'Which of GPIO21, 41 and 42 your accessory board already uses', 'That the antenna is attached before the camera streams over Wi-Fi']
  },
  code: [
    {
      title: 'A touch pad lights the user LED',
      about: 'Measures the untouched pad for a fraction of a second, then lights the user LED while a finger is on the pad. The S3\'s touch reading goes up when touched. Print the numbers first and adjust the margin for your wiring.',
      needs: 'A XIAO ESP32S3 (or Sense) with a wire or a metal pad on D0. In the Arduino IDE set USB CDC On Boot to Enabled to see the numbers.',
      wiring: [['D0 (GPIO1)', 'a wire or a metal pad', 'touch it with a finger'], ['GPIO21', 'the user LED', 'already on the board']],
      blocks: `
        when started
          set pin (21) as [output v]
          set [baseline v] to (0)
          repeat (20)
            change [baseline v] by (touch value of pin (1))
            wait (0.01) seconds
          end
          set [baseline v] to ((baseline) / (20))
        forever
          if <(touch value of pin (1)) > ((baseline) * (1.1))> then
            set pin (21) to [HIGH v]
          else
            set pin (21) to [LOW v]
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        const int TOUCH_PIN = 1;         // D0 = GPIO1 = touch channel 1
        const int LED = 21;              // the user LED

        uint32_t baseline = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          for (int i = 0; i < 20; i++) {          // average the untouched pad
            baseline += touchRead(TOUCH_PIN);
            delay(10);
          }
          baseline /= 20;
        }

        void loop() {
          uint32_t value = touchRead(TOUCH_PIN);
          bool touched = value > baseline + baseline / 10;   // on the S3 the reading rises when touched
          digitalWrite(LED, touched);
          Serial.printf("touch %lu   baseline %lu\n", (unsigned long)value, (unsigned long)baseline);
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin, TouchPad
        import time

        touch = TouchPad(Pin(1))         # D0 = GPIO1 = touch channel 1
        led = Pin(21, Pin.OUT)           # the user LED

        baseline = sum(touch.read() for _ in range(20)) // 20    # the untouched pad

        while True:
            value = touch.read()
            touched = value > baseline + baseline // 10          # on the S3 the reading rises when touched
            led.value(touched)
            print("touch", value, "baseline", baseline)
            time.sleep_ms(100)
      `,
      output: `
        touch 41230   baseline 41190
        touch 41244   baseline 41190
        touch 52871   baseline 41190
      `,
      notes: ['The catalogue gives the LED\'s pin, not its polarity: if the LED is lit while untouched, swap the two levels.', 'On the original ESP32 the reading falls when touched; code written for it has the comparison the other way round.', 'On the Sense, GPIO21 is also the SD card\'s chip select: do not run this while the card is in use.']
    }
  ],
  examples: [
    {
      title: 'How many pads does a camera project have left?',
      q: 'A project uses the Sense camera, the microphone and the SD card. Which of the eleven header pads are still free, and which were taken?',
      steps: ['The camera uses GPIO10 to 18, 38 to 40, 47 and 48 on the B2B connector: none of the header pads (GPIO1 to 9, 43, 44).', 'The SD card uses SCK GPIO7, MISO GPIO8, MOSI GPIO9 and chip select GPIO21: the first three are D8, D9 and D10.', 'The microphone uses GPIO41 and GPIO42, which are the bottom pads, not header pads.', 'That leaves D0 to D5 (GPIO1 to 6) free, and D6 and D7 if the serial pair is not needed.'],
      a: 'Six pads, D0 to D5, stay completely free; D8 to D10 are shared with the card and the LED pin is the card\'s chip select.'
    }
  ],
  quiz: [
    { q: 'On the Sense, what do the user LED and the SD card have in common?', choices: ['Both are on the B2B connector', 'Both use GPIO21', 'Both need OPI PSRAM', 'Both are on the bottom pads A11 and A12'], a: 1, why: 'GPIO21 is the yellow LED and also the SD slot\'s chip select. Toggling the LED while the card is being read disturbs the transfer.' },
    { q: 'The pads A11 and A12 (GPIO41, GPIO42) can be used as analogue inputs.', a: false, why: 'They are named like analogue pads, but the catalogue notes that GPIO41 and GPIO42 do not support the ADC. On the Sense they are the microphone\'s clock and data lines.' },
    { q: 'In the touch program, how does a touch show on the ESP32-S3?', choices: ['The reading falls, as on the original ESP32', 'The reading rises above its baseline', 'The reading becomes zero', 'The pin goes low'], a: 1, why: 'On the S2, S3 and P4 the touch value goes up when a finger is on the pad; on the original ESP32 it goes down. The program compares with a baseline plus a margin.' },
    { q: 'Which of the eleven header pads does the Sense camera use?', choices: ['D0 to D3', 'D8 to D10', 'None: it uses GPIO10–18, 38–40, 47 and 48 on the B2B connector', 'All of them'], a: 2, why: 'The camera lines are on the B2B connector. The header\'s GPIO1–9, 43 and 44 stay free of it, but the SD card on the same expansion board does share D8 to D10.' }
  ],
  applications: [
    'A tiny Wi-Fi camera for time-lapse, a doorbell or a bird feeder (the Sense), with the microphone and SD card for local recording.',
    'USB keyboards, macro pads and MIDI controllers: the S3 has USB OTG in a 17.8 × 21 mm board.',
    'Keyword spotting and other TinyML, with 8 MB of PSRAM for the model.',
    'LoRa and Meshtastic nodes: the catalogue lists a XIAO ESP32S3 and Wio-SX1262 kit.'
  ],
  sources: [
    'Seeed Studio wiki: XIAO ESP32S3 and XIAO ESP32S3 Sense getting-started pages (pin map, camera, microphone, SD card).',
    'Espressif, ESP32-S3 Series Datasheet: GPIO, ADC1, touch channels and strapping pins.',
    'Espressif, ESP32-S3 Technical Reference Manual: touch sensor and PSRAM chapters.'
  ],
  sim: { id: 'sx-xiao-pins', params: { chip: 'esp32-s3' } }
},

/* ================================================================ XIAO ESP32C6 and C5 */
{
  id: 'xiao-esp32c6-and-c5',
  parent: 'seeed-and-small-boards',
  title: 'XIAO ESP32C6 and C5',
  level: 2,
  short: 'The XIAO boards for the newer radios: the C6 adds Wi-Fi 6, Zigbee and Thread and an antenna switch you control; the C5 adds 5 GHz. Same footprint, new pin maps, and a few traps in the details.',
  keywords: ['XIAO ESP32C6', 'XIAO ESP32C5', 'ESP32-C6', 'ESP32-C5', 'Wi-Fi 6', '5 GHz', 'dual-band', 'Zigbee', 'Thread', 'Matter', 'antenna switch', 'RF switch', 'GPIO3', 'GPIO14', 'LP GPIO', 'ADC_BAT'],
  prereq: ['the-xiao-form-factor', 'soc-esp32-c6', 'soc-esp32-c5'],
  related: ['xiao-esp32c3', 'zigbee-and-thread-boards', 'matter', 'five-ghz-and-six-ghz', 'battery-pads-and-tiny-antennas', 'ieee-802-15-4'],
  body: `Two XIAO boards carry the newer radios. The **XIAO ESP32C6** has an [[soc-esp32-c6|ESP32-C6]]: one RISC-V core at 160 MHz, Wi-Fi 6, Bluetooth LE 5.3 and an 802.15.4 radio for Zigbee and Thread, with 512 KB of SRAM and 4 MB of flash. The **XIAO ESP32C5** has an [[soc-esp32-c5|ESP32-C5]]: a 240 MHz core, **dual-band Wi-Fi 6** on 2.4 and 5 GHz, Bluetooth LE, Zigbee and Thread, and on this board 8 MB of PSRAM and 8 MB of flash. Neither has a second core, and on both the USB port is the chip's serial and debug port.

### XIAO ESP32C6
It has a user LED on GPIO15, a charge LED, a charger and battery pads, and the catalogue gives 15 µA for the whole board in deep sleep (7 µA for the chip). See it in [the board catalogue](#/tools/boards?b=seeed-xiao-esp32c6) and [the pinout explorer](#/tools/pinout?board=seeed-xiao-esp32c6). Its virtue is the radio: a Matter-over-Thread or Zigbee end device, or a low-power Home Assistant sensor, on one cell.

The pads: D0 to D2 are GPIO0 to GPIO2, the analogue pads, and also LP pins, which the chip's low-power core can watch while the main core sleeps. D3 is GPIO21, plain digital with no ADC. D4 and D5 (GPIO22, GPIO23) are I2C, D6 and D7 (GPIO16, GPIO17) serial, D8 to D10 (GPIO19, GPIO20, GPIO18) SPI. **None of the eleven pads is a strapping pin**: the chip's strapping pins (GPIO4, 5, 8, 9 and 15) are the BOOT button on GPIO9, the user LED on GPIO15, and pins that are not on the header (GPIO4 and GPIO5 go to the JTAG pads on the back). That makes it the easiest XIAO to wire.

**The antenna switch.** The board carries an on-board antenna and a U.FL connector with a small switch between them. The catalogue records that **GPIO3 powers the switch and GPIO14 selects** the antenna, so the program chooses which antenna the radio uses and must drive GPIO3. The levels are the maker's to state; the program below uses the usual ones (GPIO3 low to enable the control, GPIO14 high for the U.FL connector), which you should confirm on the maker's wiki for your board.

### XIAO ESP32C5
It has a yellow user LED on GPIO27, a red charge LED, a charger ([the catalogue record](#/tools/boards?b=seeed-xiao-esp32c5), [the pinout](#/tools/pinout?board=seeed-xiao-esp32c5)), and the only battery-voltage path among the four boards: a gauge pin ADC_BAT on GPIO6, enabled through ADC_CTRL on GPIO26. The catalogue gives neither the divider ratio nor the enable level; read the schematic before relying on it.

Three things set it apart:
- **5 GHz is not free.** At the same distance, free-space loss at 5.5 GHz is about 7 dB higher than at 2.44 GHz, which roughly halves the range in open air, and walls hurt more. In return the band is quiet. The chip's own figures are 110 mA receiving and a 408 mA transmit peak, against 82 and 354 mA on the C6: size the supply for the burst.
- **More of the board is strapping.** The chip's strapping pins are GPIO25, 26, 27, 28 and 7 (plus the JTAG pads): on this board GPIO28 is the BOOT button, GPIO27 the user LED, GPIO26 the gauge enable, and pads D2 (GPIO25) and D3 (GPIO7) are strapping pads too.
- **Few analogue pads.** The record speaks of five ADC channels, but of the header pads only D0 (GPIO1) has one in the catalogue; the rest are probably on the JTAG pads on the back. Check the maker's pin table before counting on analogue inputs.

The C5 is new: the catalogue lists Arduino and ESP-IDF support and warns that library support may lag. MicroPython has an official C5 build; its first image goes to 0x2000, not 0.

> [!key] The C6 gives the XIAO Wi-Fi 6, Zigbee and Thread, an antenna switch under program control and a header with no strapping pads; the C5 gives 5 GHz at the price of a larger supply burst, shorter range and more pads with strings attached.`,
  ideas: [
    'The XIAO ESP32C6 has Wi-Fi 6, Bluetooth LE 5.3 and an 802.15.4 radio for Zigbee and Thread; the XIAO ESP32C5 adds the 5 GHz band.',
    'On the C6, GPIO3 powers an RF switch and GPIO14 chooses between the on-board antenna and the U.FL connector, so the program selects the antenna.',
    'No header pad of the C6 is a strapping pin; on the C5 two pads are (D2 and D3) and the BOOT button, user LED and gauge enable sit on strapping pins.',
    'At 5 GHz free-space loss is about 7 dB higher than at 2.4 GHz, and the C5 draws a bigger transmit burst.'
  ],
  pitfalls: [
    'The C6 antenna choice is automatic — The catalogue records two control pins: GPIO3 powers the switch and GPIO14 selects the antenna. Leave them undriven and you may get no antenna, or the wrong one.',
    'The XIAO C5 is a faster C6 — It adds 5 GHz and PSRAM but is a different pin map, with its boot button on GPIO28, a gauge on GPIO6 and only one analogue pad on the header.',
    'Dual-band means double the range or speed — 5 GHz reaches less far than 2.4 GHz (about 7 dB more path loss at the same distance) and the chip\'s Wi-Fi 6 is 20 MHz wide, so its gain is a quieter band, not speed.'
  ],
  terms: [
    { term: 'RF switch', also: ['antenna switch'], def: 'A small chip that connects the radio to one of two antennas. On the XIAO ESP32C6 it chooses between the on-board antenna and the U.FL connector, under the program\'s control through two GPIOs.' },
    { term: 'Dual-band Wi-Fi', also: ['2.4 and 5 GHz'], def: 'A radio that can join networks in both the 2.4 GHz and the 5 GHz band. The ESP32-C5 is the first Espressif chip to do so; 5 GHz is quieter but reaches less far.' },
    { term: 'LP GPIO', also: ['low-power pin', 'RTC pin'], def: 'A pin the chip\'s low-power domain can read while the main processor sleeps, and which can wake the chip. On the XIAO ESP32C6 these are D0 to D2.' },
    { term: 'End device', also: ['Matter end device', 'Zigbee end device'], def: 'A node on a Zigbee, Thread or Matter network that is a leaf: it reports or acts but does not route other nodes\' traffic, so it can sleep to save power.' }
  ],
  choose: {
    good: ['C6: Thread, Zigbee and Matter end devices and Home Assistant sensors on one cell', 'C6: a header with no strapping pads to worry about', 'C5: Wi-Fi in places where the 2.4 GHz band is crowded, with PSRAM for buffers'],
    avoid: ['More than eleven pins, a camera or a USB keyboard', 'Price first: the C3 costs less', 'C5: a weak supply or a tiny cell: the 5 GHz transmit peak is about 410 mA', 'C5: libraries that must be mature today; support may lag'],
    check: ['C6: which antenna is selected, and drive GPIO3 and GPIO14 deliberately', 'C5: the maker\'s schematic for ADC_BAT and ADC_CTRL levels and the real analogue pads', 'That your router offers 5 GHz and that your device is within its shorter range']
  },
  code: [
    {
      title: 'Choose the antenna of a XIAO ESP32C6 and scan',
      about: 'Drives the two RF switch pins to select the U.FL connector, then scans for Wi-Fi networks every three seconds and prints the strongest signal. Flip the GPIO14 level (or unplug the antenna) and compare the number to see what each antenna gives you.',
      needs: 'A XIAO ESP32C6 with its external antenna on the U.FL connector, and at least one Wi-Fi network in range.',
      wiring: [['U.FL connector', 'the external antenna', 'screw or press it on first'], ['GPIO3', 'RF switch power control', 'on the board'], ['GPIO14', 'RF switch antenna select', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (3) as [output v]
          set pin (3) to [LOW v]
          set pin (14) as [output v]
          set pin (14) to [HIGH v]
        forever
          set [best v] to (-127)
          for each [network v] in (scan for Wi-Fi networks)
            if <(signal strength of (network)) > (best)> then
              set [best v] to (signal strength of (network))
            end
          end
          print (join [strongest dBm: ] (best))
          wait (3) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const int RF_SWITCH_POWER = 3;   // GPIO3: powers the antenna switch control (low = enabled)
        const int RF_ANTENNA = 14;       // GPIO14: low = on-board antenna, high = U.FL connector

        void setup() {
          Serial.begin(115200);
          pinMode(RF_SWITCH_POWER, OUTPUT);
          digitalWrite(RF_SWITCH_POWER, LOW);
          pinMode(RF_ANTENNA, OUTPUT);
          digitalWrite(RF_ANTENNA, HIGH);
          WiFi.mode(WIFI_STA);
        }

        void loop() {
          int n = WiFi.scanNetworks();
          int best = -127;
          for (int i = 0; i < n; i++) {
            if (WiFi.RSSI(i) > best) best = WiFi.RSSI(i);
          }
          Serial.printf("%d networks, strongest %d dBm\n", n, best);
          delay(3000);
        }
      `,
      py: String.raw`
        import network
        import time
        from machine import Pin

        rf_power = Pin(3, Pin.OUT, value=0)      # GPIO3: powers the antenna switch control (low = enabled)
        rf_antenna = Pin(14, Pin.OUT, value=1)   # GPIO14: low = on-board antenna, high = U.FL connector

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)

        while True:
            found = wlan.scan()                  # tuples of (ssid, bssid, channel, RSSI, security, hidden)
            best = -127
            for ap in found:
                best = max(best, ap[3])
            print(len(found), "networks, strongest", best, "dBm")
            time.sleep(3)
      `,
      output: `
        7 networks, strongest -48 dBm
        8 networks, strongest -47 dBm
      `,
      notes: ['The catalogue records the roles of GPIO3 and GPIO14, not their levels: the ones used here are the usual ones, to be confirmed on the maker\'s wiki for your revision.', 'The scan is a measurement tool for your own surroundings. The router does not move, so compare the two antennas at the same spot and a few times: single readings jump by several dB.', 'This program is for the C6 only; the C5 record lists no antenna switch.']
    }
  ],
  examples: [
    {
      title: 'What does 5 GHz cost in range?',
      q: 'At 10 m in free space, how much more path loss does 5.5 GHz have than 2.44 GHz, and what does that do to the free-space range at the same link budget?',
      steps: ['Free-space loss grows with $20\\log_{10}(f)$, so the difference is $20\\log_{10}(5500 / 2442) \\approx 7.1$ dB at any distance.', 'In free space (exponent 2) every 6 dB doubles the distance, so 7.1 dB multiplies the range by $10^{-7.1/20} \\approx 0.44$.', 'Indoors the exponent is higher and the walls add loss, so the real penalty is usually larger.'],
      a: 'About 7 dB more loss, which cuts the open-air range to about 44 % (a little under half), more indoors.'
    }
  ],
  quiz: [
    { q: 'What does GPIO3 do on the XIAO ESP32C6?', choices: ['It is the user LED', 'It powers the RF switch that routes the radio to one of two antennas', 'It is the BOOT button', 'It is the pad D3'], a: 1, why: 'The catalogue records GPIO3 as the RF switch\'s power and GPIO14 as the antenna select. The user LED is GPIO15, BOOT is GPIO9, and D3 is GPIO21.' },
    { q: 'Compared with 2.4 GHz at the same distance in free space, a 5.5 GHz signal loses about', choices: ['the same', '3 dB more', '7 dB more', '20 dB more'], a: 2, why: 'Free-space loss depends on 20 log10 of the frequency: 20 log10(5500/2442) is about 7.1 dB, roughly 44 % of the range.' },
    { q: 'How many of the eleven header pads of the XIAO ESP32C6 are strapping pins?', choices: ['None', 'Two', 'Three', 'All of D0–D2'], a: 0, why: 'The chip\'s strapping pins are GPIO4, 5, 8, 9 and 15; on this board they are the BOOT button, the user LED, or not on the header. D0 and D1 (GPIO0, GPIO1) are only crystal pins if a crystal is fitted.' },
    { q: 'The XIAO ESP32C5 uses GPIO9 as its BOOT button, like the C3 and C6.', a: false, why: 'The C5 boot pin is GPIO28. GPIO9 on the C5 is the SPI input pad D9.' }
  ],
  applications: [
    'Matter-over-Thread sensors and switches on one lithium cell (C6).',
    'Zigbee end devices that report to a Home Assistant coordinator (C6).',
    'Wi-Fi nodes for flats and offices where the 2.4 GHz band is crowded (C5).',
    'Range experiments with the C6\'s two antennas, to see what a connector and a proper antenna buy.'
  ],
  sources: [
    'Seeed Studio wiki: XIAO ESP32C6 and XIAO ESP32C5 getting-started pages (pin maps, antenna switch, battery gauge).',
    'Espressif, ESP32-C6 and ESP32-C5 datasheets: strapping pins, current consumption, radios.',
    'IEEE 802.11ax (Wi-Fi 6) and IEEE 802.15.4 (Zigbee and Thread): the standards behind the radios.'
  ],
  sim: { id: 'sx-xiao-pins', params: { chip: 'esp32-c6' } }
},

/* ================================================================ Grove */
{
  id: 'grove-system',
  parent: 'seeed-and-small-boards',
  title: 'Grove: sensors without soldering',
  level: 1,
  short: 'Grove is Seeed Studio\'s four-pin plug-in system: a keyed 2.0 mm connector and a cable for hundreds of sensors and actuators. One plug, four electrical flavours — I2C, UART, digital and analogue — and a 3.3 or 5 V supply to watch.',
  keywords: ['Grove', 'Seeed Studio', 'Grove I2C', 'Grove UART', 'Grove cable', '2.0 mm', 'plug and play', 'Grove base', 'SenseCAP Indicator', 'level shifter', '5 V module', 'daisy chain'],
  prereq: ['the-xiao-form-factor', 'i2c', 'three-volt-logic'],
  related: ['qt-py-and-stemma-qt', 'm5-units-and-grove-ports', 'i2c-addresses-and-scanning', 'i2c-pull-ups-and-bus-problems', 'level-shifters', 'sensecap-and-finished-seeed-devices'],
  body: `Grove is Seeed Studio's answer to the breadboard. Each sensor, button, relay or display is a small board that ends in the same four-pin connector, and a cable clicks into it: no soldering, no loose jumper wires. The plug is 2.0 mm pitch and keyed, so it goes in only one way, and the cable carries four wires, normally black, red, white and yellow.

### One plug, four flavours
The plug fixes where power is, not what the signal wires mean:

| Flavour | Yellow | White | Red | Black |
|---|---|---|---|---|
| I2C | SCL (clock) | SDA (data) | supply | ground |
| Digital | the signal | a second signal, often unused | supply | ground |
| Analogue | the signal | a second signal, often unused | supply | ground |
| UART | one serial line | the other | supply | ground |

Black is always ground and red the supply. For a serial module the two lines must be crossed (one side's transmit to the other's receive) and the labels may be written from either side, so read the module's silkscreen. The simulation below draws each flavour and what each wire carries.

### The voltage catch
Grove modules run from 3.3 V or 5 V, many from either, some only 5 V. The ESP32's pins are 3.3 V devices and 5 V on them can damage them ([[three-volt-logic]]). On an I2C module the danger is the **pull-up resistors**: if the module pulls the clock and data lines up to a 5 V supply, the bus rises to 5 V. A 3.3 V board needs a module that runs on 3.3 V, or a level shifter ([[level-shifters]]). A 5 V module without pull-ups is safer, but its inputs read 3.3 V as high only marginally, since a 5 V CMOS input wants about 3.5 V.

### Getting a socket on an ESP32 board
The XIAO boards have no Grove socket. Seeed's carrier and expansion boards add them (they are not in our catalogue), or you cut a Grove cable and wire it to the pads: on a XIAO the white wire goes to D4 (SDA), the yellow to D5 (SCL), red to 3V3 and black to GND. The catalogue lists two Seeed ESP32 devices with Grove ports built in: the SenseCAP Indicator (two ports, analogue or I2C) and the SenseCAP Watcher (one I2C port) ([[sensecap-and-finished-seeed-devices]]; see [the Indicator](#/tools/boards?b=seeed-sensecap-indicator) and [the Watcher](#/tools/boards?b=seeed-sensecap-watcher) in the board catalogue). Other makers use similar four-pin plugs with different colours or pitch, for instance M5Stack ([[m5-units-and-grove-ports]]).

### Many modules on one port
Several I2C modules can share one Grove port through a hub or by chaining modules that have two sockets, as long as no two answer at the same address ([[i2c-addresses-and-scanning]]). A second simulation, on the next pages, adds sensors to a bus and shows the addresses and the pull-up arithmetic.

### What it is not
Grove has only four wires, so it suits single-signal sensors and I2C, not SPI displays or cameras. Its 2.0 mm pitch fits neither 2.54 mm jumper pins nor the 1.0 mm JST-SH of [[qt-py-and-stemma-qt|STEMMA QT and Qwiic]]: the plugs do not interchange.

> [!key] Grove is a keyed four-pin 2.0 mm plug with black ground, red supply and two signal wires (for I2C: yellow clock, white data). Check the module's supply before you plug it into a 3.3 V ESP, above all on I2C, where 5 V pull-ups push the bus too high.`,
  ideas: [
    'A Grove connector is a keyed four-pin 2.0 mm plug; black is ground, red the supply, and the other two wires carry I2C, serial, digital or analogue signals.',
    'For I2C the yellow wire is the clock (SCL) and the white wire the data (SDA).',
    'A module powered from 5 V can pull the I2C lines up to 5 V and damage a 3.3 V ESP32; use a 3.3 V module or a level shifter.',
    'XIAO boards have no Grove socket: use a carrier board or wire a cut cable to D4, D5, 3V3 and GND.'
  ],
  pitfalls: [
    'Grove is the same as Qwiic and STEMMA QT — Those are 1.0 mm JST-SH connectors with I2C only and a fixed 3.3 V. Grove is 2.0 mm, with four wire meanings and a 3.3 or 5 V supply. The plugs do not fit each other.',
    'If it plugs in, it is safe — The plug fixes the wires, not the voltage. A 5 V module on a 3.3 V board is the commonest way to harm a pin.',
    'Any two Grove sensors can share a port — Only I2C ones, and only with different addresses. Two modules of the same type clash unless one has an address option.'
  ],
  terms: [
    { term: 'Grove', also: ['Grove system', 'Grove module'], def: 'Seeed Studio\'s system of sensor and actuator boards that all use the same keyed four-pin 2.0 mm connector and cable, so that parts can be plugged together without soldering.' },
    { term: 'Keyed connector', also: ['polarised connector'], def: 'A plug and socket shaped so that they fit together in only one orientation, which prevents reversing the supply and ground.' },
    { term: 'Carrier board', also: ['expansion board', 'base board'], def: 'A board that a small module plugs or solders onto and that breaks its pads out to more convenient connectors, such as Grove sockets.' },
    { term: 'Daisy chain', also: ['daisy-chaining'], def: 'Connecting devices one after another on the same bus. For I2C every device sees the same two wires, so each needs its own address.' }
  ],
  choose: {
    good: ['Plug-in I2C and single-signal sensors for quick builds and classrooms', 'Projects where cables will be plugged and unplugged', 'Boards that already have Grove sockets (the SenseCAP devices)'],
    avoid: ['Fast or wide signals such as SPI displays and cameras: four wires are too few', 'A 5 V module on a 3.3 V board without a level shifter', 'Designs that must be vibration-proof: use a locking connector or solder'],
    check: ['The supply voltage and the pull-up voltage of each I2C module', 'The flavour printed on the socket: I2C, UART, digital or analogue', 'That no two I2C modules share an address']
  },
  code: [
    {
      title: 'Scan the Grove I2C bus',
      about: 'Starts I2C on the XIAO ESP32C3\'s D4 and D5 (GPIO6 and GPIO7), tries every address and prints those that answer, with a name for a few well-known parts. If nothing answers, check the wires: white to D4, yellow to D5.',
      needs: 'A XIAO ESP32C3 and a Grove I2C sensor that runs on 3.3 V, on a cut Grove cable or a carrier board.',
      wiring: [['D4 (GPIO6)', 'Grove white wire, SDA', ''], ['D5 (GPIO7)', 'Grove yellow wire, SCL', ''], ['3V3', 'Grove red wire, supply', '3.3 V only'], ['GND', 'Grove black wire', '']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (6) SCL (7)
          set [found v] to (0)
          for each [address v] in (the numbers 1 to 126)
            if <device answers at address (address)> then
              print (join [found 0x] (address in hexadecimal))
              change [found v] by (1)
            end
          end
          print (join [devices found: ] (found))
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 6;           // D4 on the XIAO ESP32C3: the Grove white wire
        const int SCL_PIN = 7;           // D5: the Grove yellow wire

        const char* nameOf(uint8_t a) {
          switch (a) {
            case 0x3C: return "SSD1306 OLED";
            case 0x38: return "AHT20 humidity";
            case 0x44: return "SHT3x humidity";
            case 0x76: return "BME280 / BMP280";
            case 0x77: return "BME280 (alternate address)";
            default:   return "unknown";
          }
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);
          delay(1000);
          int found = 0;
          for (uint8_t a = 1; a < 127; a++) {
            Wire.beginTransmission(a);
            if (Wire.endTransmission() == 0) {
              Serial.printf("found 0x%02X  %s\n", a, nameOf(a));
              found++;
            }
          }
          Serial.printf("devices found: %d\n", found);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        NAMES = {0x3C: "SSD1306 OLED", 0x38: "AHT20 humidity", 0x44: "SHT3x humidity",
                 0x76: "BME280 / BMP280", 0x77: "BME280 (alternate address)"}

        i2c = I2C(0, sda=Pin(6), scl=Pin(7), freq=100000)    # D4 = GPIO6 (white), D5 = GPIO7 (yellow)

        found = i2c.scan()
        for addr in found:
            print("found", hex(addr), NAMES.get(addr, "unknown"))
        print("devices found:", len(found))
      `,
      output: `
        found 0x38  AHT20 humidity
        found 0x77  BME280 (alternate address)
        devices found: 2
      `,
      notes: ['A scan only proves that something answers at an address. Reading the sensor needs its library or its datasheet.', 'Many modules have pull-ups of their own; with several on one bus they add up in parallel (see the bus simulation).', 'On other XIAO boards change the pins: D4 and D5 are GPIO5 and GPIO6 on the S3, GPIO22 and GPIO23 on the C6.']
    }
  ],
  examples: [
    {
      title: 'Will this 5 V Grove sensor hurt a XIAO?',
      q: 'A Grove I2C air sensor lists 5 V supply, and its datasheet says SDA and SCL are pulled up to the supply on the board. It is plugged into a XIAO ESP32C3. What happens, and what are the options?',
      steps: ['Powered from 5 V, the module\'s pull-ups lift SDA and SCL towards 5 V whenever nobody pulls them low.', 'The C3\'s pins are 3.3 V devices: 5 V on them is beyond their rating, so they can be damaged or fail intermittently.', 'Options: a 3.3 V version of the sensor; a bidirectional I2C level shifter between board and module; or removing the module\'s pull-up resistors and supplying 3.3 V pull-ups from the ESP side if the module accepts a 3.3 V supply.'],
      a: 'The bus is pulled to 5 V and can damage the C3. Use a 3.3 V module or a level shifter.'
    }
  ],
  quiz: [
    { q: 'On a Grove I2C cable, which wire carries the clock?', choices: ['Red', 'Black', 'White', 'Yellow'], a: 3, why: 'Yellow is SCL (clock), white is SDA (data), red is the supply and black is ground. Check the module\'s silkscreen if the cable colours are unusual.' },
    { q: 'A 5 V Grove I2C module whose pull-up resistors go to its 5 V supply is plugged into a 3.3 V ESP32. What is the risk?', choices: ['None: I2C is open-drain', 'The bus rises to 5 V and can damage the ESP32 pins', 'The clock is slower', 'The module will not power up'], a: 1, why: 'Open-drain lines are pulled up by resistors; if those go to 5 V the lines sit at 5 V, which a 3.3 V pin cannot tolerate. Use a 3.3 V module or a level shifter.' },
    { q: 'A Grove cable can be plugged into a Qwiic or STEMMA QT socket.', a: false, why: 'Grove is 2.0 mm pitch with four wire meanings; Qwiic and STEMMA QT are 1.0 mm JST-SH with I2C only. The plugs are different sizes.' },
    { q: 'Which Seeed ESP32 devices in the catalogue have Grove ports built in?', choices: ['The XIAO ESP32C3 and S3', 'The SenseCAP Indicator (two ports) and the SenseCAP Watcher (one I2C port)', 'The Wio-S3 module', 'None'], a: 1, why: 'The XIAO boards are bare modules with pads only. The SenseCAP Indicator has two Grove ports (analogue or I2C) and the Watcher a Grove I2C port.' }
  ],
  applications: [
    'Classroom and prototyping kits where students plug in sensors and displays without a soldering iron.',
    'Environmental dashboards: temperature, humidity, CO2 and particle sensors on one I2C Grove port.',
    'Quick test rigs: swap a sensor in seconds to compare parts.',
    'Seeed\'s own finished devices, which expose Grove ports for add-on sensors.'
  ],
  sources: [
    'Seeed Studio wiki: the Grove system overview and the pages on the Grove I2C and UART interfaces.',
    'Seeed Studio wiki: SenseCAP Indicator and SenseCAP Watcher hardware pages (Grove ports).',
    'NXP, I2C-bus specification and user manual (UM10204): pull-up resistors and voltage levels.'
  ],
  sim: { id: 'sx-connectors', params: { family: 'grove-i2c' } }
},

/* ================================================================ QT Py and STEMMA QT */
{
  id: 'qt-py-and-stemma-qt',
  parent: 'seeed-and-small-boards',
  title: 'QT Py and STEMMA QT',
  level: 1,
  short: 'Adafruit\'s answer to the XIAO and Grove: the QT Py board in the XIAO footprint, and STEMMA QT, a tiny I2C-only plug shared with SparkFun\'s Qwiic. The QT port is a second I2C bus — the classic reason a scan finds nothing.',
  keywords: ['QT Py', 'STEMMA QT', 'Qwiic', 'JST-SH', 'Adafruit QT Py ESP32-S3', 'QT Py ESP32-C3', 'QT Py ESP32-S2', 'QT Py ESP32 Pico', 'Wire1', 'NeoPixel', 'CircuitPython', 'I2C', '1.0 mm'],
  prereq: ['the-xiao-form-factor', 'i2c', 'grove-system'],
  related: ['adafruit-feather-boards', 'sparkfun-thing-plus-and-qwiic', 'i2c-addresses-and-scanning', 'circuitpython-on-esp', 'xiao-esp32s3-and-sense', 'form-factors'],
  body: `Adafruit's version of the same idea is two things. The **QT Py** is a thumb-sized board in the XIAO footprint: about 17.8 × 22 mm, two rows of seven castellated pads, USB-C. **STEMMA QT** is a tiny four-pin JST-SH plug at 1.0 mm pitch that carries **I2C and nothing else**, at 3.3 V. SparkFun's **Qwiic** is the same plug with the same wiring, so boards and cables of the two ecosystems mix freely.

### The connector
Along the plug the wires are GND (black), 3.3 V (red), SDA (blue) and SCL (yellow). Because it is I2C only and fixed at 3.3 V there is nothing to choose and nothing to damage on a 3.3 V ESP. Most sensor boards carry two sockets, so a chain of sensors runs off one cable, each with its own address ([[i2c-addresses-and-scanning]]).

### The QT Py ESP32 boards
| Board | Chip and memory | USB | NeoPixel | Second I2C (QT port) | Charger |
|---|---|---|---|---|---|
| QT Py ESP32 Pico | classic ESP32, 8 MB flash, 2 MB PSRAM | via a serial converter | GPIO5, power GPIO8 | SDA GPIO22, SCL GPIO19 | BAT pads; not stated |
| QT Py ESP32-C3 | ESP32-C3, 4 MB flash | built-in serial/JTAG | GPIO2, no power pin | one pair listed: SDA GPIO5, SCL GPIO6 | BAT pads |
| QT Py ESP32-S2 | ESP32-S2, 4 MB flash, 2 MB PSRAM | native | GPIO39, power GPIO38 | SDA GPIO41, SCL GPIO40 | none |
| QT Py ESP32-S3 | ESP32-S3, two variants: 4 MB flash with 2 MB PSRAM, or 8 MB flash with none | native | GPIO39, power GPIO38 | SDA GPIO41, SCL GPIO40 | none (BAT pads, diode protected) |

Note the two S3 variants share a name, so check the marking on the module. The Pico is the only one with Bluetooth Classic; the S2 has Wi-Fi only.

### How it differs from a XIAO
**Same pads, different pins.** The pad order matches the XIAO (the catalogue calls the S3 a XIAO-compatible footprint), and the roles line up: A0 to A3 for D0 to D3, then SDA, SCL, TX, RX, SCK, MISO, MOSI. But the QT Py S3's A0 is GPIO18 where the XIAO ESP32S3's D0 is GPIO1, so code written with GPIO numbers moves between them no better than between XIAO chips.

**Two I2C buses.** The pads marked SDA and SCL and the STEMMA QT port are different buses on the S2, S3 and Pico (in Arduino, \`Wire\` and \`Wire1\`). For the S3 the catalogue notes that the pad pair has no pull-ups of its own. A sensor plugged into the QT port is therefore invisible to a scan of the pad bus: the commonest reason an I2C scan finds nothing.

**The NeoPixel's power pin.** On the Pico, S2 and S3 an RGB LED sits on one pin with a separate power-control pin; drive that pin on first or the LED stays dark.

**No charger on the S2 and S3.** There are BAT pads, but the catalogue says no charging circuit: a cell needs an external charger there. The XIAOs charge on board.

Adafruit's home territory is CircuitPython ([[circuitpython-on-esp]]); the boards run Arduino and MicroPython equally. All the QT Py boards are in [the board catalogue](#/tools/boards?maker=Adafruit); [the pinout explorer](#/tools/pinout?board=adafruit-qt-py-esp32-s3-8mb-nopsram) draws the 8 MB S3 version.

> [!key] A QT Py is a XIAO-shaped board with a NeoPixel and a STEMMA QT port, a 1.0 mm I2C-only plug at 3.3 V that Qwiic shares. The QT port is its own I2C bus on most boards, so scan it with the second bus, not the pads.`,
  ideas: [
    'STEMMA QT and Qwiic are the same four-pin 1.0 mm JST-SH plug: ground, 3.3 V, SDA, SCL; I2C only and always 3.3 V.',
    'The QT Py has the XIAO\'s pad order and size, but its GPIOs differ, so code with GPIO numbers is not portable between them.',
    'On the QT Py ESP32-S2, S3 and Pico the STEMMA QT port is a second I2C bus (Wire1), separate from the SDA and SCL pads.',
    'The S2 and S3 QT Py have no battery charger, and the NeoPixel has a power pin to drive first on most of them.'
  ],
  pitfalls: [
    'My I2C scan on the QT Py finds nothing, so the sensor is dead — The sensor is probably on the QT port, which is another bus. Scan Wire1 on the port\'s pins (GPIO41 and GPIO40 on the S3) and the sensor will answer.',
    'All QT Py ESP32-S3 boards are the same — Two variants share the name: 4 MB flash with 2 MB PSRAM, or 8 MB flash with no PSRAM. Check the marking before using PSRAM.',
    'STEMMA QT gives me 5 V — It is fixed at 3.3 V; the plug has no 5 V pin. For a 5 V sensor use a different connector or a level-shifted adapter.'
  ],
  terms: [
    { term: 'STEMMA QT', also: ['QT connector'], def: 'Adafruit\'s four-pin JST-SH 1.0 mm connector for I2C sensors at 3.3 V. It has the same plug and wiring as SparkFun\'s Qwiic.' },
    { term: 'Qwiic', also: ['SparkFun Qwiic'], def: 'SparkFun\'s name for the same 1.0 mm, four-pin, 3.3 V I2C connector, compatible with STEMMA QT cables and boards.' },
    { term: 'JST-SH', also: ['SH connector'], def: 'A family of small wire-to-board connectors with 1.0 mm pitch. The four-pin version is the one STEMMA QT and Qwiic use.' },
    { term: 'Wire1', also: ['second I2C bus'], def: 'The Arduino name of the chip\'s second I2C controller. On the QT Py ESP32-S2, S3 and Pico the STEMMA QT port is wired to it, on pins different from the SDA and SCL pads.' }
  ],
  choose: {
    good: ['Plug-in I2C sensors at 3.3 V without a soldering iron', 'CircuitPython projects, and XIAO-footprint carrier boards', 'A tiny native-USB S2 or S3 board with a NeoPixel for status colours'],
    avoid: ['A battery product on the S2 or S3 without an external charger', 'Sensors that need SPI, analogue or 5 V on the connector', 'Boards where you will not check which memory variant you have'],
    check: ['Which I2C bus the QT port is on, and its pins', 'The variant marking of the S3 (4 MB with PSRAM, or 8 MB without)', 'That each sensor on a chain has its own address']
  },
  code: [
    {
      title: 'Scan the STEMMA QT port',
      about: 'The QT port of the QT Py ESP32-S3 is on pins GPIO41 (SDA) and GPIO40 (SCL), a different bus from the SDA and SCL pads. This starts that bus and prints every address that answers.',
      needs: 'An Adafruit QT Py ESP32-S3 and a STEMMA QT or Qwiic sensor on a cable.',
      wiring: [['STEMMA QT port', 'sensor board', 'JST-SH cable, any orientation of the cable ends'], ['GPIO41 / GPIO40', 'the port\'s SDA1 / SCL1', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (41) SCL (40)
          for each [address v] in (the numbers 1 to 126)
            if <device answers at address (address)> then
              print (join [found on the QT port: 0x] (address in hexadecimal))
            end
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA1_PIN = 41;         // the STEMMA QT port of the QT Py ESP32-S3
        const int SCL1_PIN = 40;

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Wire1.begin(SDA1_PIN, SCL1_PIN, 400000);     // the second bus, not Wire
          int found = 0;
          for (uint8_t a = 1; a < 127; a++) {
            Wire1.beginTransmission(a);
            if (Wire1.endTransmission() == 0) {
              Serial.printf("found on the QT port: 0x%02X\n", a);
              found++;
            }
          }
          if (found == 0) Serial.println("nothing on the QT port: check the cable and the bus");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(1, sda=Pin(41), scl=Pin(40), freq=400000)   # the STEMMA QT port: the second bus

        found = i2c.scan()
        for addr in found:
            print("found on the QT port:", hex(addr))
        if not found:
            print("nothing on the QT port: check the cable and the bus")
      `,
      output: `
        found on the QT port: 0x44
        found on the QT port: 0x77
      `,
      notes: ['If a sensor is plugged into the SDA and SCL pads instead, scan with Wire and the pads\' pins (GPIO7 and GPIO6 on the S3).', 'On the QT Py ESP32-C3 the catalogue lists a single pair of I2C pins (GPIO5, GPIO6): use those.', 'The QT Py ESP32-S3 variants need the matching board setting in the Arduino IDE.']
    }
  ],
  examples: [
    {
      title: 'Why does the scan find nothing?',
      q: 'A BME280 is plugged into the STEMMA QT port of a QT Py ESP32-S3. A sketch calls Wire.begin(7, 6) and scans, and finds no devices. Why?',
      steps: ['GPIO7 and GPIO6 are the SDA and SCL pads, the board\'s first bus.', 'The QT port is wired to GPIO41 and GPIO40, the second bus.', 'The sensor is alive on the other pair of wires and the scan is looking at the wrong ones.'],
      a: 'Scan Wire1 with SDA GPIO41 and SCL GPIO40.'
    }
  ],
  quiz: [
    { q: 'STEMMA QT cables and sensor boards can be used with SparkFun Qwiic boards.', a: true, why: 'They are the same four-pin 1.0 mm JST-SH plug with the same wiring: ground, 3.3 V, SDA, SCL.' },
    { q: 'An I2C scan of the SDA and SCL pads of a QT Py ESP32-S3 finds nothing, though a sensor is plugged into the QT port. What should you do?', choices: ['Replace the sensor', 'Scan the second bus, Wire1, on GPIO41 and GPIO40', 'Add a 5 V supply', 'Hold the BOOT button'], a: 1, why: 'On the S2, S3 and Pico the QT port is a separate bus from the pads. The pads\' bus does not see devices on the port.' },
    { q: 'The QT Py A0 pad is the same GPIO as the XIAO ESP32S3 D0 pad.', a: false, why: 'The pads are in the same place with the same role but not the same GPIO: A0 is GPIO18 on the QT Py S3, D0 is GPIO1 on the XIAO ESP32S3.' },
    { q: 'Which QT Py ESP32 boards in the catalogue have no battery charger?', choices: ['The C3 and Pico', 'The S2 and S3', 'All of them', 'None'], a: 1, why: 'The S2 is recorded as having no battery charger and the S3 variants as BAT pads with no charger. A cell needs an external charger on those boards.' }
  ],
  applications: [
    'Environmental sensing: temperature, humidity, air quality and light sensors chained on one cable.',
    'CircuitPython projects that read several I2C sensors without wiring.',
    'Small native-USB gadgets with a NeoPixel for status colours (S2, S3).',
    'Carrier boards and shields designed for the XIAO footprint, used with a QT Py S3.'
  ],
  sources: [
    'Adafruit Learning System: the guides of the QT Py ESP32-C3, ESP32-S2 and ESP32-S3 boards (pinouts, STEMMA QT port).',
    'SparkFun documentation: the Qwiic connector system (the same connector and wiring).',
    'NXP, I2C-bus specification and user manual (UM10204).'
  ],
  sim: [{ id: 'sx-i2c-daisy', params: { connector: 'stemma' } }, { id: 'sx-connectors', params: { family: 'stemma' } }]
},

/* ================================================================ SuperMini and Zero */
{
  id: 'supermini-and-zero-boards',
  parent: 'seeed-and-small-boards',
  title: 'SuperMini and Zero boards',
  level: 2,
  short: 'The cheapest tiny ESP32 boards: the unbranded SuperMini family and Waveshare\'s castellated Zero boards. Small, native USB, a ceramic antenna — and the variability that comes with a name that is not a maker.',
  keywords: ['SuperMini', 'ESP32-C3 SuperMini', 'ESP32-C6 SuperMini', 'ESP32-H2 SuperMini', 'ESP32-S3 SuperMini', 'Waveshare Zero', 'ESP32-S3-Zero', 'ESP32-C3-Zero', 'ESP32-C6-Zero', 'ESP32-H2-Zero', 'ESP32-C5-Zero', 'ceramic antenna', 'clone', 'native USB', 'GPIO8', 'castellated'],
  prereq: ['the-xiao-form-factor', 'xiao-esp32c3', 'strapping-pins'],
  related: ['clones-and-counterfeits', 'module-certification', 'battery-pads-and-tiny-antennas', 'lolin-d1-mini-family', 'usb-serial-bridges-and-auto-reset', 'boot-modes-and-download-mode'],
  body: `Search for a tiny ESP32 board by price and you meet two families that are neither Seeed's nor Adafruit's: the unbranded **SuperMini** boards and Waveshare's **Zero** boards. Both mount a chip with its flash memory inside the package, a ceramic chip antenna, a USB-C socket and a small regulator on a board of about 18 × 23 mm. They have no pin-naming standard like the XIAO's D-names and no ecosystem of carrier boards. They are the cheap, small and variable end of the market, and the variability is the thing to understand.

### SuperMini: a name, not a maker
Sellers use "SuperMini" for similar boards, so two boards with one name may differ in pinout, antenna and parts. The catalogue holds four:

| Board | Chip and memory | Size | LEDs and button | Battery |
|---|---|---|---|---|
| ESP32-C3 SuperMini | C3FH4, 4 MB in the package | 18 × 22.5 mm | blue LED on GPIO8 (active low), BOOT on GPIO9 | no charger on the common version |
| ESP32-C6 SuperMini | C6, 4 MB | 18 × 25.6 mm | WS2812 on GPIO8, user LED GPIO15, BOOT GPIO9 | BAT pads, LTH7R charger |
| ESP32-H2 SuperMini | H2, no Wi-Fi | 18.4 × 24 mm | WS2812 GPIO8, blue LED GPIO13, BOOT GPIO9 | BAT pads, charger |
| ESP32-S3 SuperMini | S3FH4R2: 4 MB flash, 2 MB PSRAM | 18 × 23.5 mm | WS2812 GPIO48, BOOT GPIO0 | BAT pads, charger about 100 mA |

The C3 board shows a typical trade. Its 16 header pins carry 13 GPIOs (0 to 10, 20, 21), but the LED and the button sit on GPIO8 and GPIO9, both strapping pins. An active-low LED hangs from the supply, so it does not pull GPIO8 down at reset; an LED to ground on that pin would, and could keep the board from starting normally.

### Waveshare Zero: castellated and mostly picture-documented
The Zero boards have half-hole pads along the edges, so they solder down like modules. The catalogue holds the C3, C5, C6, H2 and S3: the **C3-Zero** (WS2812 on GPIO10, BOOT on GPIO9, GPIO12 to 17 are the flash and not exposed), the **S3-Zero** (WS2812 on GPIO21, BOOT GPIO0, 4 MB flash and 2 MB PSRAM, a back row of pads, and a 5V pad the wiki says takes 3.7 to 6 V; there is also a -M version with a pre-soldered header), the **C6-Zero** (the -B version has 8 MB flash and a 5 to 36 V wide-voltage input), the **H2-Zero** and the **C5-Zero** (dual-band, with a switch between the on-board antenna and an external IPEX connector).

### The cautions the catalogue records
- **Antennas.** On the C3 SuperMini the antenna placement is critical and range is poor on many units; the records mention lowering the transmit power or adding a wire or external antenna. On some S3 SuperMini units the ceramic antenna is mounted the wrong way round; a 31 mm wire is the reported fix. (A quarter wave at 2.44 GHz is about 31 mm in free space: the wire is a proper antenna for the board.) Test range before you trust a board.
- **Pinouts differ between sellers**, and several different boards are sold as "S3 SuperMini": read the silkscreen and the module marking. For the Zero boards the pinouts are pictures on the maker's wiki, so for the C5-Zero our catalogue has no pin list at all.
- **No bridge chip.** The USB-C port is the chip's own USB. Enable "USB CDC on boot" to see Serial output, and if a program breaks USB, hold BOOT while plugging in to reach download mode ([[boot-modes-and-download-mode]]).
- **No certification is listed.** These are bare chips with an antenna, not certified modules: fine for hobby work, a different matter for a product you sell ([[module-certification]]).

The records are in [the board catalogue](#/tools/boards?b=esp32-c3-supermini) (and the C6, H2 and S3 versions, and the Waveshare Zero boards under their own names).

### When to choose them
For the smallest and cheapest radio and a few pins, and when you can test the board you actually receive. Not for a product, and not when a wrong pinout would cost you a day.

> [!key] SuperMini and Zero boards are the smallest, cheapest ESP32 boards, with native USB and a ceramic antenna. They vary between sellers, their antennas and pinouts need checking, and they are not certified modules: measure the board you get, read its silkscreen, and treat the catalogue's cautions as a test list.`,
  ideas: [
    'SuperMini is a name sellers use, not a maker, so boards of the same name differ; the catalogue holds C3, C6, H2 and S3 versions.',
    'Waveshare\'s Zero boards have castellated pads and native USB, and several come with a WS2812 RGB LED and a BOOT button.',
    'Antenna quality and mounting vary, so range must be tested; a quarter-wave wire of about 31 mm is a known fix.',
    'LEDs and buttons often sit on strapping pins (GPIO8 and GPIO9 on the C3 SuperMini): the wiring decides whether the board boots.'
  ],
  pitfalls: [
    'A SuperMini is a XIAO from another maker — It shares only the size class. The pad names, pin maps and carrier boards of the XIAO do not apply, and the pinout can differ between two sellers\' boards.',
    'If it has USB-C there is a serial chip — The SuperMini and Zero boards use the chip\'s own native USB: no bridge, so Serial needs the CDC-on-boot option, and BOOT may be needed to flash.',
    'Weak Wi-Fi means the router is far — On some units the antenna is poorly placed or mounted the wrong way round: test with an external wire or another board before blaming the network.'
  ],
  terms: [
    { term: 'SuperMini', also: ['Super Mini'], def: 'A name used by many sellers for small, cheap ESP32 boards (C3, C6, H2, S3) with a ceramic antenna and native USB. It denotes no single design or maker, so pinouts and quality vary.' },
    { term: 'Zero board', also: ['Waveshare Zero'], def: 'Waveshare\'s family of castellated mini boards for ESP32 chips: the chip with in-package flash, a ceramic antenna, a USB-C socket and edge pads that solder down like a module.' },
    { term: 'Ceramic chip antenna', also: ['chip antenna'], def: 'A small ceramic block soldered on the board that works as a 2.4 GHz antenna. It is tiny but sensitive to its position, the ground plane and nearby objects.' },
    { term: 'Native USB', also: ['USB Serial/JTAG', 'no bridge chip'], def: 'USB handled by the ESP32 chip itself rather than by a separate USB-to-serial chip. It needs no driver on most computers but means the serial port disappears if the program stops USB.' }
  ],
  choose: {
    good: ['The cheapest, smallest way to get a Wi-Fi or BLE chip on a breadboard', 'Throwaway prototypes and kits where a few boards can fail', 'Zero boards soldered onto a carrier board like a module'],
    avoid: ['Products you will sell or certify', 'Anything that must reach far with its on-board antenna, unless you tested that exact board', 'Projects that rely on a pin map you did not verify'],
    check: ['The silkscreen against the pinout you are following', 'The chip and flash marking, in case the board is not what the listing says', 'Wi-Fi signal at a known spot against another board', 'Which pins carry the LED and the button, and what they are wired to']
  },
  code: [
    {
      title: 'Heartbeat on the C3 SuperMini LED',
      about: 'The blue LED of the ESP32-C3 SuperMini is on GPIO8 and lights when the pin is low. This flashes it briefly once a second, which makes the inverted logic plain: LOW is on.',
      needs: 'An ESP32-C3 SuperMini. Seller variants may differ: check that the LED is on GPIO8.',
      wiring: [['USB-C', 'computer', 'the LED is on the board']],
      blocks: `
        when started
          set pin (8) as [output v]
        forever
          set pin (8) to [LOW v]
          wait (0.1) seconds
          set pin (8) to [HIGH v]
          wait (0.9) seconds
        end
      `,
      cpp: String.raw`
        const int LED = 8;               // ESP32-C3 SuperMini: blue LED, lit when the pin is LOW

        void setup() {
          pinMode(LED, OUTPUT);
        }

        void loop() {
          digitalWrite(LED, LOW);        // on
          delay(100);
          digitalWrite(LED, HIGH);       // off
          delay(900);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(8, Pin.OUT)            # ESP32-C3 SuperMini: blue LED, lit when the pin is low

        while True:
            led.value(0)                 # on
            time.sleep_ms(100)
            led.value(1)                 # off
            time.sleep_ms(900)
      `,
      notes: ['GPIO8 is a strapping pin, which is fine here: an active-low LED hangs from the supply side and does not pull the pin low at reset.', 'If the LED stays dark, the variant you hold may use another pin: look at the silkscreen and the seller\'s picture.']
    }
  ],
  examples: [
    {
      title: 'How long should the antenna wire be?',
      q: 'A seller says the S3 SuperMini needs a 31 mm wire soldered to the antenna pad for good range. Is that a sensible length?',
      steps: ['The wavelength at 2.44 GHz is $c / f = 299.8 / 2442 = 0.1228$ m.', 'A quarter wave is $0.1228 / 4 = 30.7$ mm in free space.', 'A wire a few per cent shorter (about 29 mm) is the usual figure once the insulation and the board\'s ground are counted, so 31 mm is within a millimetre or two of a quarter wave.'],
      a: 'Yes: 31 mm is a quarter wave at 2.44 GHz, the natural length for a simple wire antenna.'
    }
  ],
  quiz: [
    { q: 'The blue LED of the ESP32-C3 SuperMini is on GPIO8 and active low. What does digitalWrite(8, LOW) do?', choices: ['Turns it off', 'Turns it on', 'Nothing: GPIO8 is a strapping pin', 'Resets the board'], a: 1, why: 'Active low means the LED lights when the pin is low. GPIO8 is a strapping pin, but only the level at reset matters; afterwards it is an ordinary output.' },
    { q: 'Two boards sold as "ESP32-S3 SuperMini" can have different modules and pinouts.', a: true, why: 'SuperMini is a name used by many sellers, not a design. The catalogue notes that several different boards are sold under it and tells you to check the module marking.' },
    { q: 'A SuperMini has poor Wi-Fi range. According to the catalogue\'s records, which is a likely cause?', choices: ['The router uses channel 6', 'The ceramic antenna is poorly placed or mounted the wrong way round on some units', 'USB-C cannot power Wi-Fi', 'The flash is too small'], a: 1, why: 'Antenna placement is critical on the C3 version and some S3 units have the ceramic antenna reversed; a wire or external antenna, or lower transmit power, is what the records report.' },
    { q: 'Waveshare Zero boards have a USB-to-serial bridge chip.', a: false, why: 'The USB-C port is the chip\'s own native USB; the S3-Zero record notes that the first flash may need BOOT held while plugging in.' }
  ],
  applications: [
    'Cheap sensor nodes and indicator lamps where a few boards are expected to be sacrificed.',
    'Small USB gadgets on the S3\'s native USB: keyboards, macro pads, status lights.',
    'Zero boards soldered onto a custom carrier board for a one-off device.',
    'Zigbee and Thread experiments on the C6 and H2 versions at the lowest cost.'
  ],
  sources: [
    'The sellers\' and Waveshare\'s own pages for the boards (pin maps, LEDs, buttons), as read for the catalogue; community pinout pages for the SuperMini boards.',
    'Espressif datasheets of the ESP32-C3, S3, C6, H2 and C5: strapping pins, USB Serial/JTAG, GPIO.',
    'Espressif, ESP32 hardware design guidelines: antenna placement and keep-out areas.'
  ],
  sim: { id: 'sx-board-sizes', params: { group: 'thumb' } }
},

/* ================================================================ finished Seeed devices */
{
  id: 'sensecap-and-finished-seeed-devices',
  parent: 'seeed-and-small-boards',
  title: 'SenseCAP and Seeed\'s finished devices',
  level: 2,
  short: 'Seeed builds finished products around the ESP32-S3: the SenseCAP Indicator and Watcher, the reTerminal E e-paper panels, the reSpeaker voice boards and the Wio-S3 LoRa module — most with a second chip beside the ESP.',
  keywords: ['SenseCAP Indicator', 'SenseCAP Watcher', 'reTerminal E', 'reSpeaker', 'XVF3800', 'Wio-S3', 'Wio-SX1262', 'Meshtastic', 'e-paper', 'RP2040', 'Himax', 'ESPHome', 'LoRa', 'finished device'],
  prereq: ['the-xiao-form-factor', 'xiao-esp32s3-and-sense'],
  related: ['e-paper-boards', 'lora-boards', 'home-assistant-voice-hardware', 'esp-as-a-co-processor', 'io-expanders-and-shift-registers', 'm5stack-family'],
  body: `Seeed does not only sell bare boards. Around the ESP32-S3 it builds finished devices, and reading them shows a pattern: the ESP32 hosts the Wi-Fi, the screen and the cloud, and a **second chip** does the work the ESP is poor at. All the entries below come from the catalogue.

### A XIAO inside
Several products simply hold a [[xiao-esp32s3-and-sense|XIAO ESP32S3]]: the **reSpeaker Lite** and the **reSpeaker XVF3800** voice boards, where an XMOS audio processor does the microphone array, echo cancellation and beamforming and the ESP is the host for a Home Assistant voice satellite; the **XIAO ESP32S3 and Wio-SX1262 kit** for Meshtastic LoRa nodes; and, with a XIAO ESP32C3, the **XIAO 7.5 inch e-paper panel**. The **Wio-S3 Wireless Module** is the same idea as a bare 38-pad SMT module (ESP32-S3R8 with an SX1262 LoRa radio and a TCXO, 9.3 µA sleep); it needs your own carrier board.

### SenseCAP: two chips by design
- **SenseCAP Indicator** (variants D1, D1L, D1S, D1Pro): a 3.95 inch 480 × 480 touch screen, an ESP32-S3 with 8 MB of flash and octal PSRAM, and an **RP2040** that reads the sensors (a CO2 sensor and a tVOC sensor on some variants) and talks to the ESP over a serial link. LoRa (SX1262) is on the L and Pro variants; two Grove ports; no battery. Its LCD chip-select and touch reset are not on GPIOs but on a PCA9535 I/O expander, which is why the display firmware is not trivial.
- **SenseCAP Watcher**: a 1.45 inch touch display (412 × 412 pixels), an OV5647 camera and an ESP32-S3, with a **Himax HX6538** AI processor (Cortex-M55 with an Ethos-U55) that analyses the picture so the ESP does not have to. A scroll wheel, a microphone and speaker output, a 400 mAh backup battery and a Grove I2C port. The back USB-C is power only.

The lesson: when the vendor's firmware already splits the work between chips, your own project follows that split. Pins you want may be behind an expander or owned by the second chip ([[esp-as-a-co-processor]], [[io-expanders-and-shift-registers]]).

### reTerminal E: e-paper that lasts months
| Model | Display | Battery | Notes |
|---|---|---|---|
| E1001 | 7.5 inch, 800 × 480, mono, 4 grey levels | 2000 mAh | partial refresh in 2 to 5 s |
| E1002 | 7.3 inch, 800 × 480, full colour | 2000 mAh | full refresh 15 to 20 s, no partial refresh |
| E1003 | 10.3 inch, 1404 × 1872, 16 greys, touch | 3000 mAh | needs ESPHome 2026.7.0 or later |
| E1004 | 13.3 inch, 1200 × 1600, full colour | 5000 mAh | about 20 s refresh; ESPHome 2026.7.0 or later |

All have an ESP32-S3 with 32 MB of flash and 8 MB of PSRAM; the catalogue estimates about three months per charge for the first two and six months for the others, because e-paper draws nothing while it shows a picture ([[e-paper-boards]]).

The records are in [the board catalogue](#/tools/boards?b=seeed-sensecap-indicator): [the Indicator](#/tools/boards?b=seeed-sensecap-indicator), [the Watcher](#/tools/boards?b=seeed-sensecap-watcher), [the reTerminal E1001](#/tools/boards?b=seeed-reterminal-e1001) and [the Wio-S3 module](#/tools/boards?b=seeed-wio-s3-wireless-module).

### Cautions in the records
The Indicator is powered from USB only. **Do not flash Meshtastic onto a non-Meshtastic Indicator variant**: the record warns of hardware damage. The reSpeaker boards need the right firmware on the audio chip before the ESP can use them. The E1001 record notes that it sleeps deeply and that buttons must be held to wake it for flashing.

> [!key] Seeed's finished devices pair the ESP32-S3 with a specialist chip: RP2040 for sensors, Himax for vision, XMOS for audio, SX1262 for LoRa. Choose them for the finished function; if you reprogram them, learn which chip owns which pins first.`,
  ideas: [
    'Seeed\'s finished devices use the ESP32-S3 as the host for Wi-Fi, display and cloud, and a second chip for sensors, vision, audio or LoRa.',
    'The SenseCAP Indicator has an RP2040 beside the ESP32-S3 and an I/O expander for its display lines; the Watcher pairs the S3 with a Himax AI chip.',
    'The reTerminal E e-paper panels last months per charge because e-paper uses no power to hold a picture; colour panels refresh slowly.',
    'Wrong firmware can damage hardware: the Indicator record warns against flashing Meshtastic onto variants not made for it.'
  ],
  pitfalls: [
    'All the pins of a finished device are mine to use — Many sit behind an I/O expander or belong to the second chip, as the Indicator\'s display control and sensors do. Read the architecture before planning pins.',
    'E-paper is slow, so the board is slow — The panel refreshes in seconds (15 to 20 s for full colour) but the ESP32-S3 is fast; the slowness is the display, and it is why the battery lasts months.',
    'One firmware fits all SenseCAP Indicators — The variants differ (LoRa or not, sensors or not). Firmware for another variant may not work and, as the record warns, Meshtastic on the wrong one can damage it.'
  ],
  terms: [
    { term: 'SenseCAP', also: ['SenseCAP Indicator', 'SenseCAP Watcher'], def: 'Seeed Studio\'s family of sensing devices. The Indicator is a 3.95 inch touch dashboard with an ESP32-S3 and an RP2040; the Watcher is a small camera device with an ESP32-S3 and a Himax AI processor.' },
    { term: 'Co-processor', also: ['second MCU', 'companion chip'], def: 'A second processor that takes a job from the main chip: sensors on an RP2040, audio on an XMOS chip, vision on a Himax chip. The ESP32 usually talks to it over a serial link.' },
    { term: 'I/O expander', also: ['PCA9535', 'port expander'], def: 'A chip that adds input and output pins to a microcontroller over I2C. On the SenseCAP Indicator a PCA9535 holds the display chip select and touch reset lines.' },
    { term: 'Partial refresh', also: ['fast refresh'], def: 'Updating only part of an e-paper display, which is faster and flashes less than a full refresh but leaves faint ghosts of the old picture. Colour panels often cannot do it.' }
  ],
  choose: {
    good: ['A ready-made air-quality or sensor dashboard (SenseCAP Indicator)', 'An e-paper dashboard that runs for months on a charge (reTerminal E)', 'A Home Assistant voice satellite with a good microphone array (reSpeaker)'],
    avoid: ['Using one as a bare ESP32 board with free pins: the second chip owns many of them', 'Flashing firmware made for a different variant or board', 'Fast-changing displays on the e-paper models'],
    check: ['Which variant you have (D1, D1L, D1S, D1Pro; E1001 to E1004)', 'The firmware or ESPHome version the device needs', 'That the power source suits the device: the Indicator has no battery, the Watcher\'s is a backup']
  },
  examples: [
    {
      title: 'Is it big or small? The panels side by side',
      q: 'A XIAO is 17.8 × 21 mm and a reTerminal E1004 is 311 × 376 mm. How many times bigger in area is the panel?',
      steps: ['XIAO area: $17.8 \\times 21 = 374$ mm².', 'E1004 area: $311 \\times 376 = 116{,}936$ mm².', 'Ratio: $116936 / 374 \\approx 313$.'],
      a: 'About 310 times the area: the same family of chip, a very different object. The size simulation draws them to scale.'
    }
  ],
  quiz: [
    { q: 'Why does the SenseCAP Indicator have an RP2040 next to its ESP32-S3?', choices: ['The ESP32-S3 has no Wi-Fi', 'The RP2040 reads the sensors and talks to the ESP over a serial link', 'It replaces the USB port', 'It charges the battery'], a: 1, why: 'The catalogue records that the RP2040 reads the sensors and talks to the S3 over a serial link; the S3 handles Wi-Fi, the screen and the cloud.' },
    { q: 'The SenseCAP Indicator\'s LCD chip select and touch reset are on spare ESP32-S3 GPIOs.', a: false, why: 'They are on a PCA9535 I/O expander on the I2C bus, so the firmware must drive them through it.' },
    { q: 'What does the catalogue warn about flashing Meshtastic onto a SenseCAP Indicator?', choices: ['It voids the warranty only', 'Do not flash it on variants not made for it: hardware damage is possible', 'It needs a 16 MB flash', 'Nothing'], a: 1, why: 'The record warns that Meshtastic must not be flashed onto non-Meshtastic variants because of a risk of hardware damage.' },
    { q: 'Why can an e-paper reTerminal run for months on a charge?', choices: ['It has a very large processor', 'E-paper uses almost no power to hold a picture, and the device sleeps deeply between updates', 'It never uses Wi-Fi', 'It charges from light'], a: 1, why: 'The display keeps its image without power; the ESP32-S3 wakes, updates, and sleeps again. The catalogue estimates months per charge for the E1001 to E1004.' }
  ],
  applications: [
    'Indoor air-quality dashboards with CO2 and tVOC sensors on a wall (SenseCAP Indicator).',
    'A camera-and-AI watcher that reports unusual events (SenseCAP Watcher).',
    'Always-on calendars, weather boards and Home Assistant dashboards on e-paper (reTerminal E).',
    'Voice-assistant satellites around the house, and LoRa Meshtastic nodes built from a XIAO and a Wio-SX1262.'
  ],
  sources: [
    'Seeed Studio wiki: the pages of the SenseCAP Indicator and Watcher, the reTerminal E series, the reSpeaker boards and the Wio-S3 module.',
    'Seeed Studio wiki: the XIAO ESP32S3 and Wio-SX1262 kit (Meshtastic).',
    'ESPHome documentation: the e-paper and display components (version noted in the records).'
  ],
  sim: { id: 'sx-board-sizes', params: { group: 'seeed' } }
},

/* ================================================================ living with few pins */
{
  id: 'living-with-few-pins',
  parent: 'seeed-and-small-boards',
  title: 'Living with eleven pins',
  level: 2,
  short: 'A thumb-sized board gives eleven pads and a project wants twelve. Count the jobs, find the pads that are really free, then share: one I2C bus, one analogue pin for many buttons, one data line for many LEDs.',
  keywords: ['pin budget', 'few pins', 'eleven pins', 'I2C bus', 'port expander', 'MCP23017', 'shift register', '74HC595', 'resistor ladder', 'analogue buttons', 'WS2812', 'strapping pads', 'pin planner', 'multiplexer', 'TCA9548A'],
  prereq: ['the-xiao-form-factor', 'planning-pins', 'strapping-pins'],
  related: ['io-expanders-and-shift-registers', 'addressable-leds', 'i2c-addresses-and-scanning', 'buttons-and-switches', 'keypads-and-matrices', 'xiao-esp32c3', 'voltage-dividers-for-inputs'],
  body: `A XIAO gives you eleven signal pads, and a project always wants twelve. Living with few pins is a handful of habits: count first, find the pads that are truly free, then share: one bus, one analogue pin or one data line for many things.

### Count first
Every job has a price in pads:

| Job | Pads it costs |
|---|---|
| I2C, any number of devices | 2 |
| SPI | 3, plus one chip select per device |
| A second serial port | 2 |
| Each analogue input | 1 |
| Each button | 1, or none (below) |
| Each plain output | 1 |
| Addressable LEDs, any number | 1 |

Write the list before you choose the board. The pin planner in the simulation below does the sum and tells you when the pads run out; [the planner in the pinout explorer](#/tools/pinout/plan) does the same for any board.

### Which pads are really free
Some of the eleven are spoken for. The strapping pads among them, from the chips' tables: **C3**: D0, D8, D9; **S3**: D2; **C5**: D2 and D3; **C6**: none. D6 and D7 are the chip's serial pins, and the ROM prints its boot log on D6: fine for a second serial device, not for a quiet switch. And some functions cost no pad at all: once the program runs, the **BOOT button** is an ordinary input (GPIO9 on the C3 and C6, GPIO0 on the S3, GPIO28 on the C5) and a **user LED** is an ordinary output.

### Six ways to share
1. **One I2C bus for many parts.** Two pads reach up to 112 addresses (the 128 of the 7-bit space less the reserved ones). Two parts with one address clash: some have an address pin; otherwise a multiplexer such as the TCA9548A gives each part its own branch. Every extra board adds pull-ups and cable capacitance ([[i2c-pull-ups-and-bus-problems]]).
2. **A port expander.** An MCP23017 adds 16 pins over the same two wires, and eight of them can share the bus (addresses 0x20 to 0x27): 128 pins on two pads. They are slower than native pins and want an interrupt line to announce a change.
3. **A shift register.** A 74HC595 turns three pads into eight outputs, and chains ([[io-expanders-and-shift-registers]]).
4. **A resistor ladder.** One analogue pad reads several buttons: each button connects the pad to ground through a different resistor, so the voltage tells which one is down. It needs steps wider than the ADC's noise and reads one button at a time. The program below does it.
5. **One data line for many LEDs.** WS2812 LEDs chain on one pad ([[addressable-leds]]), but each draws up to 60 mA at full white: eight make nearly 0.5 A, too much to ask of a USB port on top of the board. Dim them or power them separately.
6. **Time-sharing.** A pad can be an output now and an input later. It works, but the wiring must tolerate both roles.

### A worked assignment
A project on the XIAO ESP32C3: an I2C display and sensor, two buttons, a relay, a soil-moisture sensor and an LED strip. The pin planner's answer:

| Job | Pad | GPIO | Why |
|---|---|---|---|
| Soil sensor, analogue | D1 | GPIO3 | ADC1, a plain pin |
| I2C data and clock | D4 and D5 | GPIO6 and GPIO7 | the board's own I2C pads, not strapping |
| LED strip data | D10 | GPIO10 | a plain output |
| Buttons | D3 and D2 | GPIO5 and GPIO4 | a digital input may use the analogue pads |
| Relay | D8 | GPIO8 | a strapping pin: the planner warns |

The spare pads are D0, D6, D7 and D9. The warning is worth heeding: a relay input that pulls GPIO8 low at power-up could stop the board from starting. You can do better: make the BOOT button the second button, put the relay on D2 (GPIO4, a JTAG pin that is free while debugging runs over USB), and leave D8 alone.

> [!key] Eleven pads go further than they look: count the jobs, spend strapping pads last, and share: two pads for any number of I2C parts, one analogue pad for a ladder of buttons, one pad for a chain of LEDs. The BOOT button and the user LED are free extras.`,
  ideas: [
    'Count the pads each job costs before choosing a board: I2C costs two for any number of devices, SPI three plus one per device.',
    'Strapping pads among the eleven: C3 D0, D8, D9; S3 D2; C5 D2, D3; C6 none. Spend them last.',
    'Sharing multiplies pins: an I2C bus (112 addresses), port expanders (16 pins each), shift registers, a resistor ladder, one data line for many LEDs.',
    'The BOOT button and the user LED are free once the program runs: they cost no pad.'
  ],
  pitfalls: [
    'I2C devices are unlimited — The 7-bit address space holds 112 usable addresses, two parts with one address clash, and every board adds pull-ups and capacitance that slow the bus.',
    'A resistor ladder reads all buttons at once — It reads one at a time: two buttons together give the voltage of two resistors in parallel, which may look like a third button.',
    'Sixty LEDs on one pin need no extra supply — Each pixel draws up to 60 mA at full white; sixty could take 3.6 A. Power strips from their own supply and dim them.'
  ],
  terms: [
    { term: 'Pin budget', also: ['pin count', 'pad budget'], def: 'The list of pins a project needs against the pins a board offers. Planning it first shows whether the idea fits, and which pins can be shared.' },
    { term: 'Port expander', also: ['I/O expander', 'MCP23017'], def: 'A chip that adds input and output pins to a microcontroller over a two-wire bus. The MCP23017 adds 16 pins per chip and can be addressed at eight different addresses.' },
    { term: 'Shift register', also: ['74HC595', 'serial-in parallel-out'], def: 'A chip that turns a serial stream of bits into several parallel outputs. Three pins of the microcontroller (data, clock and latch) can drive eight outputs, and registers can be chained.' },
    { term: 'Resistor ladder', also: ['analogue keypad', 'resistor-ladder buttons'], def: 'Several buttons on one analogue pin: each connects the pin to ground through its own resistor, so the divider voltage identifies the button that is pressed.' },
    { term: 'I2C multiplexer', also: ['TCA9548A'], def: 'A chip that connects one I2C bus to one of several branches, so that identical sensors with the same address can share a controller.' }
  ],
  choose: {
    good: ['Sharing one I2C bus for displays and sensors', 'A resistor ladder for four or five buttons that are pressed one at a time', 'WS2812 chains for any number of lights on one pad', 'Using the BOOT button and the user LED as free extras'],
    avoid: ['Putting a relay, LED to ground or other pulling device on a strapping pad', 'A ladder for chords or games where buttons are held together', 'Time-sharing a pin between roles whose wiring conflict'],
    check: ['The strapping pads of your chip and what is wired to them at power-up', 'That the I2C devices all have different addresses', 'The current of a pixel chain against the supply', 'That the ladder\'s voltage steps are wider than the ADC noise']
  },
  code: [
    {
      title: 'Four buttons on one analogue pin',
      about: 'A resistor ladder on D1 of a XIAO ESP32C3: a 10 kΩ pull-up holds the pad high, and each button connects it to ground through its own resistor. The program turns the voltage into a button letter and prints each new press.',
      needs: 'A XIAO ESP32C3, a 10 kΩ resistor, four push buttons, and resistors of 470 Ω, 2.2 kΩ, 6.8 kΩ and 15 kΩ. In the Arduino IDE enable USB CDC On Boot.',
      wiring: [['D1 (GPIO3)', 'junction of the pull-up and the four button resistors', ''], ['3V3', '10 kΩ pull-up resistor to D1', ''], ['button A', '470 Ω to GND', 'pad is about 0.15 V when pressed'], ['button B', '2.2 kΩ to GND', 'about 0.6 V'], ['button C', '6.8 kΩ to GND', 'about 1.3 V'], ['button D', '15 kΩ to GND', 'about 2.0 V']],
      blocks: `
        when started
          start serial at (115200) baud
          set [last v] to [none]
        forever
          set [mv v] to (analog read pin (3) in millivolts)
          if <(mv) < (370)> then
            set [button v] to [A]
          else if <(mv) < (965)> then
            set [button v] to [B]
          else if <(mv) < (1660)> then
            set [button v] to [C]
          else if <(mv) < (2240)> then
            set [button v] to [D]
          else
            set [button v] to [none]
          end
          if <(button) ≠ (last)> then
            set [last v] to (button)
            if <(button) ≠ [none]> then
              print (join [button ] (button))
            end
          end
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int LADDER = 3;            // D1 = GPIO3, ADC1

        char readButton() {
          uint32_t mv = analogReadMilliVolts(LADDER);
          if (mv < 370)  return 'A';     // 470 ohm,  about 0.15 V
          if (mv < 965)  return 'B';     // 2.2 k,    about 0.6 V
          if (mv < 1660) return 'C';     // 6.8 k,    about 1.3 V
          if (mv < 2240) return 'D';     // 15 k,     about 2.0 V
          return 0;                      // none: the pull-up holds the pad high
        }

        char last = 0;

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          char button = readButton();
          if (button != last) {
            last = button;
            if (button) Serial.printf("button %c\n", button);
          }
          delay(20);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        ladder = ADC(Pin(3), atten=ADC.ATTN_11DB)    # D1 = GPIO3, ADC1

        def read_button():
            mv = ladder.read_uv() // 1000
            if mv < 370:  return "A"                 # 470 ohm,  about 0.15 V
            if mv < 965:  return "B"                 # 2.2 k,    about 0.6 V
            if mv < 1660: return "C"                 # 6.8 k,    about 1.3 V
            if mv < 2240: return "D"                 # 15 k,     about 2.0 V
            return None                              # none: the pull-up holds the pad high

        last = None
        while True:
            button = read_button()
            if button != last:
                last = button
                if button:
                    print("button", button)
            time.sleep_ms(20)
      `,
      output: `
        button B
        button D
        button A
      `,
      notes: ['Press one button at a time: two together give the parallel resistance and a voltage that can read as a different button.', 'The thresholds are the midpoints between the expected voltages. Print the millivolts of each button first and adjust them to your resistors; an E24 tolerance of 5 % moves the steps a little.', 'At the C3\'s default range the pad cannot rise above about 2.5 V: the "none" level is clipped, which the last threshold allows for.']
    }
  ],
  formulas: [
    {
      name: 'One rung of a resistor ladder',
      expr: 'Vnode = Vcc*Rb/(Rp+Rb)',
      tex: 'V_{node} = V_{cc} \\cdot \\frac{R_b}{R_p + R_b}',
      vars: {
        Vnode: { name: 'voltage on the analogue pad', q: 'voltage', unit: 'V', tex: 'V_{node}' },
        Vcc: { name: 'supply', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{cc}' },
        Rb: { name: 'resistor of the pressed button', q: 'resistance', unit: 'kΩ', value: 2.2, tex: 'R_b' },
        Rp: { name: 'pull-up resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_p' }
      },
      solveFor: 'Vnode',
      note: 'A pull-up to the supply with the pressed button\'s resistor to ground is a voltage divider. The pad should stay below the ADC\'s full-scale voltage (about 2.5 V at the default range of the C3).',
      stories: { Vnode: 'A ladder button of {Rb} is pressed with a pull-up of {Rp} on a {Vcc} supply. What voltage does the analogue pad see?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the ladder\'s resistors',
      q: 'You have a 10 kΩ pull-up on a 3.3 V supply and want four buttons whose voltages are well separated on a pad that stops at 2.5 V. Show why 470 Ω, 2.2 kΩ, 6.8 kΩ and 15 kΩ work.',
      steps: ['Each pressed button forms a divider: $V = 3.3 \\cdot R_b / (10\\text{k} + R_b)$.', '470 Ω gives 0.15 V, 2.2 kΩ gives 0.60 V, 6.8 kΩ gives 1.34 V, 15 kΩ gives 1.98 V; with no button the pad would be at 3.3 V but is clipped near 2.5 V.', 'The gaps are 0.45, 0.74, 0.64 and about 0.5 V: each is far wider than the few tens of millivolts of ADC noise and tolerance, so mid-point thresholds are safe.'],
      a: 'The four levels sit about 0.5 V or more apart, well clear of ADC noise, with the "no button" level above all of them.'
    }
  ],
  quiz: [
    { q: 'How many I2C devices with different addresses can, in principle, share D4 and D5?', choices: ['2', '8', 'Up to 112', 'Exactly 127'], a: 2, why: 'The 7-bit address space has 128 values, 16 of them reserved: 112 usable. In practice cable capacitance and pull-ups limit a bus to far fewer.' },
    { q: 'Two buttons of a resistor ladder are pressed together. What does the program read?', choices: ['Both buttons', 'The voltage of the two resistors in parallel, which can look like another button or none', 'Always the lower button', 'An error'], a: 1, why: 'Two resistors to ground in parallel have a lower resistance, giving a lower voltage that may match another step. A ladder suits one button at a time.' },
    { q: 'Which pads of the XIAO ESP32C3 are strapping pads?', choices: ['D1 and D10', 'D0, D8 and D9', 'D4 and D5', 'D6 and D7'], a: 1, why: 'GPIO2, 8 and 9 are the C3\'s strapping pins, reaching the header as D0, D8 and D9. D6 and D7 are the serial pins.' },
    { q: 'Eight WS2812 LEDs at full white on one pad draw about', choices: ['60 mA', '150 mA', '0.5 A', '5 A'], a: 2, why: 'Each pixel takes up to 60 mA at full white plus a little in standby: eight come to nearly 0.5 A, which is why long chains need their own supply and dimming.' }
  ],
  applications: [
    'A control panel with four or five buttons on one analogue pin and the other pads free for sensors.',
    'A sensor hub with eight I2C sensors on two pads, using a multiplexer for twin parts.',
    'Relay and LED banks through shift registers or port expanders on a tiny board.',
    'A pixel display on one data pad, with a separate power supply for the LEDs.'
  ],
  sources: [
    'NXP, I2C-bus specification and user manual (UM10204): addressing and reserved addresses.',
    'Microchip, MCP23017 datasheet; Texas Instruments, TCA9548A datasheet; the 74HC595 datasheets of the major makers.',
    'Espressif datasheets of the ESP32-C3, S3, C5 and C6: strapping pins and GPIO tables.'
  ],
  sim: ['sx-pin-planner', 'sx-ladder']
},

/* ================================================================ battery pads and tiny antennas */
{
  id: 'battery-pads-and-tiny-antennas',
  parent: 'seeed-and-small-boards',
  title: 'Battery pads and tiny antennas',
  level: 2,
  short: 'Two details decide whether a thumb-sized board is a good product: whether a cell runs it for long enough, and whether its radio still reaches. Chargers and cells, a battery divider that does not drain the battery, and what a tiny antenna costs in range.',
  keywords: ['BAT pads', 'battery', 'LiPo', 'charger', 'divider', 'battery voltage', 'ADC_BAT', 'antenna', 'ceramic antenna', 'U.FL', 'detuning', 'EIRP', 'range', 'external antenna', 'link budget', 'C-rate'],
  prereq: ['the-xiao-form-factor', 'lithium-cells', 'link-budget'],
  related: ['measuring-battery-level', 'battery-chargers', 'pcb-antennas', 'external-antennas', 'antenna-placement-and-enclosures', 'transmit-power-and-regulations', 'the-board-is-not-the-chip', 'voltage-dividers-for-inputs'],
  body: `Whether a thumb-sized board makes a good product comes down to two details: does a small cell run it long enough, and does its radio still reach when it is boxed? Both depend on small features of the board.

### The battery pads and the charger
Every XIAO has two **BAT pads** under the board and a charger chip: an ETA4054S2F on the C3 (about 380 mA fast, 40 mA at the end of the charge) and an SGM40567 on the S3 (about 100 mA), the C6 and the C5. Solder a single lithium cell with its own protection circuit to the pads; the board then runs from USB when plugged in and from the cell when not, and charges the cell from USB. Among the other boards of this topic, the SuperMini C6, H2 and S3 have chargers (the S3 about 100 mA); the common C3 SuperMini and the QT Py S2 and S3 have none.

> [!warn] Lithium cells: use one cell with a protection circuit and connect it with the right polarity, since reversed it can ignite. Charge it only through the board's charger, never from a pin or a bare supply. Match cell and charger: 380 mA charges a 1000 mAh cell at 0.4 C, but a 100 mAh cell at 3.8 C, far too fast. A swollen, hot, punctured or shorted cell burns: take it out and do not charge it ([[lithium-cells]], [[battery-chargers]]).

### Reading the battery
Most of these boards cannot tell you the cell voltage. The catalogue records a gauge on two: the XIAO ESP32C5 (ADC_BAT on GPIO6, enabled through GPIO26) and the XIAO ESP32S3 Plus (battery voltage on GPIO10). Elsewhere you add a divider: two equal resistors from BAT+ to ground, the midpoint to an ADC1 pad, and 100 nF across the lower one. A cell runs from 4.2 V full to about 3.0 V empty, so the pad sees 2.1 V falling to 1.5 V, inside the C3's 0 to 2.5 V range.

The divider is a permanent load. At 4.2 V two 220 kΩ resistors draw 9.5 µA, about twice the chip's whole deep-sleep current of 5 µA, so the board's sleep draw nearly triples. Use 470 kΩ or 1 MΩ, or switch the divider with a transistor only while measuring. A high-resistance divider is a weak source for the ADC; the capacitor supplies the sampling charge, so wait a few time constants and average several readings.

Voltage is a rough fuel gauge: on a typical curve 3.7 V is about 42 % and 3.9 V about 76 %, and a Wi-Fi burst makes the voltage sag. Read it at rest. [The battery calculator](#/tools/espcalc/battery) turns a drain into days of life.

### The antenna on a tiny board
A quarter-wave antenna for 2.44 GHz is about 31 mm. The boards of this topic fold it into a few millimetres or hand it to you: XIAO boards have a U.FL connector and an antenna in the box (the C6 also an on-board antenna and a switch); QT Py boards a PCB antenna; SuperMini and Zero boards a ceramic chip antenna. The folding costs efficiency and bandwidth, and the board's own ground plane becomes part of the antenna.

**What it costs.** In round teaching numbers a small ceramic antenna is worth about −2 dBi and a plain external one about +2 dBi: a 4 dB difference. Range scales as $10^{G/(10n)}$: with an indoor exponent of 3, losing 4 dB leaves about 73 % of the range; in free space (n = 2) it leaves 63 %.

**Detuning.** A hand over the antenna, a metal case, a battery or a wire beside it shifts the antenna's resonance and absorbs power: several dB more, often half the range. Keep the antenna end at the board's edge and clear of metal, keep the cell and cables away from it, and test in the finished enclosure, not on the bench.

**Rules.** Power plus antenna gain is what the law limits. In Europe the limit on 2.4 GHz is 20 dBm EIRP: a 19.5 dBm radio with a +5 dBi antenna radiates 24.5 dBm, over the limit, so power must come down. Do not swap the antenna of a product you sell without checking its approval, and check your country's rules ([[transmit-power-and-regulations]]). [The link calculator](#/tools/espcalc/link) does the arithmetic.

> [!key] A XIAO's BAT pads and charger make it a battery device; add a high-resistance divider if you need the voltage and mind its drain against the chip's microamps. A small antenna costs a few dB against an external one, and a hand or a case costs several more: choose, place and test the antenna in its enclosure.`,
  ideas: [
    'The BAT pads take one protected lithium cell and a charger chip charges it from USB: about 380 mA on the C3 XIAO and about 100 mA on the S3.',
    'Match the cell to the charger: charge current divided by capacity (C-rate) must stay within what the cell allows.',
    'A battery divider is a permanent load: with 220 kΩ resistors it draws about twice the chip\'s deep-sleep current, so use larger resistors or switch it.',
    'A tiny antenna costs a few dB against an external one, and a hand or a metal case costs several more; legal EIRP limits cap the power plus gain.'
  ],
  pitfalls: [
    'Any lithium cell can go on the BAT pads — Only one cell with a protection circuit and the right polarity, sized for the charger. A small cell on a 380 mA charger is charged several times faster than it should be.',
    'A divider of 100 kΩ is fine for the battery pin — It draws about 21 µA at 4.2 V, several times the chip\'s deep-sleep current, and a higher resistance needs a capacitor for the ADC. Use a large resistance and a capacitor, or switch it.',
    'A bigger antenna gain is always better — The EU limits EIRP on 2.4 GHz to 20 dBm, and the board\'s power plus the antenna gain counts. A higher-gain antenna may need the transmit power reduced.'
  ],
  terms: [
    { term: 'C-rate', also: ['charge rate', '0.5 C'], def: 'A charge or discharge current expressed as a multiple of the cell\'s capacity: 1 C is the current that would empty the cell in an hour. 380 mA on a 1000 mAh cell is 0.38 C.' },
    { term: 'U.FL connector', also: ['IPEX', 'u.FL', 'MHF'], def: 'A tiny coaxial socket for a thin antenna cable. A pigtail connects it to an antenna; it is delicate and is meant for few plug-in cycles.' },
    { term: 'Detuning', also: ['antenna detuning'], def: 'The shift of an antenna\'s resonant frequency, and the loss of efficiency, when a hand, a metal case or a battery is near it. It makes the radio reach less far than on the bench.' },
    { term: 'EIRP', also: ['effective isotropic radiated power'], def: 'The transmit power plus the antenna gain, in dBm: the power an ideal all-direction antenna would need to radiate the same peak. Radio rules limit it, for 2.4 GHz Wi-Fi in Europe to 20 dBm.' }
  ],
  choose: {
    good: ['A battery sensor on a XIAO with its on-board charger and a high-resistance divider', 'An external antenna when range matters and the case is metal', 'Keeping the antenna end of the board free, at the edge of the enclosure'],
    avoid: ['A divider of 100 kΩ or less permanently on the cell', 'A cell much smaller than the charger expects', 'Putting the board in a metal box without moving the antenna outside', 'Raising antenna gain without checking the legal EIRP'],
    check: ['The charger current against the cell capacity (C-rate)', 'The divider\'s drain against the deep-sleep current', 'Range tested in the finished enclosure, with a hand near it', 'That the supplied antenna is attached and its connector seated']
  },
  code: [
    {
      title: 'Battery voltage through a divider',
      about: 'Reads the cell through two equal resistors on D1 of a XIAO ESP32C3 (GPIO3, ADC1), averages sixteen readings, doubles the result and prints volts and a rough percentage. The percentage is a straight-line guide only: the real curve is not linear.',
      needs: 'A XIAO ESP32C3 with a protected single lithium cell on the BAT pads, two 470 kΩ resistors and a 100 nF capacitor.',
      wiring: [['BAT+ pad', '470 kΩ to D1', 'the upper resistor'], ['D1 (GPIO3)', '470 kΩ to GND, and 100 nF to GND', 'the lower resistor and capacitor'], ['BAT− pad', 'cell negative and GND', 'check polarity twice']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (3) in millivolts)
            wait (0.002) seconds
          end
          set [volts v] to ((((sum) / (16)) * (2)) / (1000))
          set [percent v] to (map (volts) from (3.3) (4.2) to (0) (100))
          if <(percent) < (0)> then
            set [percent v] to (0)
          end
          if <(percent) > (100)> then
            set [percent v] to (100)
          end
          print (join [battery V: ] (volts))
          print (join [about percent: ] (round (percent)))
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        const int BAT_PIN = 3;           // D1 = GPIO3 on the XIAO ESP32C3, ADC1
        const float DIVIDER = 2.0;       // two equal resistors from BAT+ to GND, midpoint to D1

        float batteryVolts() {
          uint32_t sum = 0;
          for (int i = 0; i < 16; i++) {
            sum += analogReadMilliVolts(BAT_PIN);
            delay(2);
          }
          return sum / 16.0 * DIVIDER / 1000.0;
        }

        int percent(float v) {           // a rough guide: the real curve is not a straight line
          int p = (int)((v - 3.3) / (4.2 - 3.3) * 100);
          return p < 0 ? 0 : (p > 100 ? 100 : p);
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          float v = batteryVolts();
          Serial.printf("battery %.2f V  about %d %%\n", v, percent(v));
          delay(5000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(3), atten=ADC.ATTN_11DB)     # D1 = GPIO3 on the XIAO ESP32C3, ADC1
        DIVIDER = 2.0                              # two equal resistors from BAT+ to GND, midpoint to D1

        def battery_volts():
            total = 0
            for _ in range(16):
                total += adc.read_uv()
                time.sleep_ms(2)
            return total / 16 / 1_000_000 * DIVIDER

        def percent(v):                            # a rough guide: the real curve is not a straight line
            return max(0, min(100, int((v - 3.3) / (4.2 - 3.3) * 100)))

        while True:
            v = battery_volts()
            print("battery %.2f V  about %d %%" % (v, percent(v)))
            time.sleep(5)
      `,
      output: `
        battery 4.07 V  about 85 %
        battery 4.06 V  about 84 %
      `,
      notes: ['The 100 nF capacitor across the lower resistor feeds the ADC\'s sampling circuit; without it a divider of this resistance reads low and noisy.', 'USB powers the board while you test: with the charger active the pad voltage is the charger\'s, up to 4.2 V, not the cell\'s resting voltage.', 'The divider draws about 4.5 µA at 4.2 V; for the lowest sleep current switch it off with a transistor between measurements.']
    }
  ],
  formulas: [
    {
      name: 'Battery divider: the voltage at the pad',
      expr: 'Vpin = Vbat*R2/(R1+R2)',
      tex: 'V_{pin} = V_{bat} \\cdot \\frac{R_2}{R_1 + R_2}',
      vars: {
        Vpin: { name: 'voltage at the analogue pad', q: 'voltage', unit: 'V', tex: 'V_{pin}' },
        Vbat: { name: 'cell voltage', q: 'voltage', unit: 'V', value: 4.2, tex: 'V_{bat}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 470, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 470, tex: 'R_2' }
      },
      solveFor: 'Vpin',
      note: 'With equal resistors the pad sees half the cell voltage; keep it below the ADC\'s full-scale voltage for the chip and attenuation you use (about 2.5 V on the C3).',
      stories: { Vpin: 'A {Vbat} cell feeds a divider of {R1} and {R2}. What voltage reaches the ADC pad?' }
    },
    {
      name: 'Battery divider: the drain on the cell',
      expr: 'Id = Vbat/(R1+R2)',
      tex: 'I_d = \\frac{V_{bat}}{R_1 + R_2}',
      vars: {
        Id: { name: 'current drawn by the divider', q: 'current', unit: 'µA', tex: 'I_d' },
        Vbat: { name: 'cell voltage', q: 'voltage', unit: 'V', value: 4.2, tex: 'V_{bat}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 470, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 470, tex: 'R_2' }
      },
      solveFor: 'Id',
      note: 'Compare the result with the board\'s deep-sleep current: a drain as big as the sleep current doubles it.',
      stories: { Id: 'A divider of {R1} and {R2} sits across a {Vbat} cell all the time. How much current does it draw?' }
    },
    {
      name: 'Range change for a change of antenna gain',
      expr: 'k = 10^(G/(10*n))',
      tex: 'k = 10^{\\frac{G}{10\\,n}}',
      vars: {
        k: { name: 'new range divided by old range', q: 'ratio' },
        G: { name: 'change in antenna gain (negative = worse)', q: 'gain', unit: 'dB', value: -4, signed: true },
        n: { name: 'path-loss exponent (2 in free space, 2.7 to 3.5 indoors)', q: 'ratio', value: 3 }
      },
      solveFor: 'k',
      note: 'Valid for the same transmit power, receiver and environment: only the antenna changes. The loss is the same for every 6 dB in free space, which halves the distance.',
      stories: { k: 'Changing to an antenna {G} different, in surroundings with an exponent of {n}, what fraction of the old range remains?' }
    }
  ],
  examples: [
    {
      title: 'Does the divider spoil the sleep current?',
      q: 'A C3 sensor sleeps at 5 µA (chip). A battery divider of two 220 kΩ resistors sits across a 4.2 V cell. What does it add, and what do two 1 MΩ resistors give?',
      steps: ['220 kΩ pair: $4.2 / 440\\,000 = 9.5$ µA.', 'Total in sleep: 5 + 9.5 = 14.5 µA, nearly three times the chip alone.', '1 MΩ pair: $4.2 / 2\\,000\\,000 = 2.1$ µA, total 7.1 µA.', 'The 1 MΩ pair\'s midpoint has a 500 kΩ source resistance, which needs the 100 nF capacitor and a settling time of a few hundred milliseconds.'],
      a: 'The 220 kΩ pair almost triples the sleep current; two 1 MΩ resistors with a 100 nF capacitor add only 2.1 µA.'
    },
    {
      title: 'Is the antenna legal at full power?',
      q: 'A radio gives 19.5 dBm into a +5 dBi external antenna. Is that within a 20 dBm EIRP limit, and what power would satisfy it?',
      steps: ['EIRP = transmit power + antenna gain = 19.5 + 5 = 24.5 dBm.', 'That is 4.5 dB over the 20 dBm limit.', 'Reducing the transmit power by at least 4.5 dB, to 15 dBm or less, brings it to 20 dBm.'],
      a: '24.5 dBm EIRP is over the limit: lower the transmit power to 15 dBm or less.'
    }
  ],
  quiz: [
    { q: 'Two 220 kΩ resistors form a divider across a 4.2 V cell. How much current do they draw?', choices: ['0.95 µA', '9.5 µA', '95 µA', '950 µA'], a: 1, why: '$4.2 / (220 + 220)$ kΩ = 9.5 µA: about twice the chip\'s whole deep-sleep current of 5 µA.' },
    { q: 'Why is a capacitor put across the lower resistor of a high-value battery divider?', choices: ['To store energy for Wi-Fi', 'To supply the ADC\'s sampling charge and steady the reading', 'To cut the divider\'s current', 'To charge the cell'], a: 1, why: 'A divider of hundreds of kilohms is a weak source; the ADC\'s sampling circuit pulls it down at each sample. The capacitor holds the voltage and averages out noise.' },
    { q: 'A charger that supplies 380 mA is connected to a 100 mAh cell. What is the charge rate?', choices: ['0.38 C, which is fine', '3.8 C, which is far too fast', '38 C', '0.038 C'], a: 1, why: '380 mA divided by 100 mAh is 3.8 C. Most small cells allow about 1 C or less: this combination can overheat the cell.' },
    { q: 'A 19.5 dBm radio is fitted with a +5 dBi antenna in Europe, where the 2.4 GHz limit is 20 dBm EIRP. What is true?', choices: ['It is within the limit', 'EIRP is 24.5 dBm: transmit power must be reduced', 'Gain does not count towards the limit', 'The limit applies only to the radio, not the antenna'], a: 1, why: 'Radio rules count the transmit power and the antenna gain together: 19.5 + 5 = 24.5 dBm, over the limit, so the power has to come down by about 4.5 dB.' }
  ],
  applications: [
    'Battery-powered sensors that report cell voltage so that they can be replaced or recharged in time.',
    'Wearables and badges that run from a small cell charged over USB-C.',
    'Outdoor and enclosure designs where an external antenna on a U.FL pigtail replaces the on-board one.',
    'Range surveys that compare antennas and enclosures before a product is frozen.'
  ],
  sources: [
    'Seeed Studio wiki: XIAO ESP32C3, S3, C6 and C5 battery and antenna sections (chargers, gauge pins, connector).',
    'Espressif, ESP32 hardware design guidelines: antenna placement and the ADC reference of each chip.',
    'ETSI EN 300 328, wideband transmission systems in the 2.4 GHz band: the EIRP limit (check your country\'s rules).'
  ],
  sim: ['sx-battery', 'sx-antenna-range']
}
);
