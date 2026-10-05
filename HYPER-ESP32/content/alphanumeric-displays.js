/* HYPER-ESP32 · content/alphanumeric-displays.js
 *
 * Topic: LEDs, digits and letters (topic code ad).
 * Choosing a display, indicator LEDs and bar graphs, seven-segment digits, the TM1637 and MAX7219 driver chips,
 * the HD44780 character LCD and its I2C backpack, custom characters, formatting numbers, menus on two lines,
 * LED matrices and scrolling text.
 */
Hyper.add(
/* ================================================================ choosing-a-display */
{
  id: 'choosing-a-display',
  parent: 'alphanumeric-displays',
  title: 'Choosing a display',
  level: 1,
  short: 'A display is chosen by what it must show, who reads it and from how far, in what light, and how many pins and milliamps can be spared. Most projects need far less screen than they think.',
  keywords: ['display', 'choosing a display', 'which display', 'LCD', 'OLED', 'seven segment', 'LED matrix', 'e-paper', 'TFT', 'pins', 'readability', 'sunlight', 'viewing distance', 'backlight', 'battery'],
  prereq: ['pin-current-limits', 'three-volt-logic', 'choosing-a-bus'],
  related: ['indicator-leds-and-bar-graphs', 'character-lcd', 'oled-ssd1306', 'e-paper', 'hmi-design-rules', 'web-ui-as-a-display'],
  body: `Every project that talks to a person needs somewhere to say it, and the temptation is to reach for the biggest, brightest screen in the drawer. The better question is smaller: *what must it say, to whom, from how far away, and at what price in pins, current and code?* A greenhouse thermometer read from across a room needs four big digits. A settings menu needs two lines of text. A weather station wants pictures. Each step up in what a display can show costs more pins, more memory, more current and more software.

### The ladder

| Display | What it shows | Pins on the ESP | Where it fits |
|---|---|---|---|
| An LED, or a row of them | on, off, a level | one each, or 3 through a shift register | status, alarms, bar graphs |
| Seven-segment digits | numbers and a few letters | 2 or 3 with a driver chip | clocks, counters, meters |
| Character LCD, 16 × 2 or 20 × 4 | letters and digits from a fixed font, eight symbols of your own | 2 (I2C backpack) or 6 | readouts and menus |
| LED matrix, 8 × 8 and chains | dots: scrolling text, simple shapes | 3 | signs, big clocks |
| Monochrome OLED, 128 × 64 | any pattern of pixels | 2 (I2C) | text, small graphs, icons |
| Colour TFT, 240 × 320 and up | pictures, colour, touch | 5 to 6 (SPI) | dashboards, interfaces |
| E-paper | pixels, held with no power | about 6 | data that changes slowly |

This topic covers the first four rows; [[pixels-and-framebuffers|the topic on graphic displays]] starts where they end.

### The questions that decide

- **What changes, and how often?** A number once a second suits anything. A picture thirty times a second needs a fast bus and memory. A value that changes once an hour belongs on e-paper.
- **Who reads it, from where?** Digit height sets the distance: small digits for a desk, big ones for a room. Someone who walks past once a day needs a light, not a screen.
- **In what light?** LEDs and OLEDs make their own light and lose to direct sun. A reflective LCD or e-paper shows an image by reflecting the light around it: perfect in sunshine, blank in the dark.
- **How many pins, how many milliamps?** Two I2C pins can be shared with sensors; a parallel LCD takes six. A backlight alone draws tens of milliamps, which flattens a battery in days ([[battery-life-budget]]).
- **Which voltage?** Many character LCDs and LED drivers are 5 V parts ([[three-volt-logic]]); OLEDs and TFTs run on 3.3 V.

### Less is often enough

Start from the information, not the screen. If the reader only needs *yes or no*, a light is the display. If they change a setting once a year, a web page served by the board ([[web-ui-as-a-display]]) is a display that costs no pins at all. Where a number must be read at a glance, large digits beat a small screen showing the same number in tiny type.

> [!key] Pick the smallest display that says what the reader must know, at the distance and in the light where they will read it. Each step up the ladder costs pins, current, memory and code.`,
  ideas: [
    'Choose the display from the information: what must be said, to whom, from how far, in what light.',
    'Each step up the ladder — light, digits, characters, dots, pixels — adds pins, memory, current and code.',
    'Reflective displays (e-paper, LCDs without a backlight) are best in sunshine; emissive ones (LEDs, OLEDs) in the dark.',
    'On an LCD the backlight usually draws far more than the glass and the controller together, so on a battery it is the first thing to switch off.'
  ],
  pitfalls: [
    'More pixels is always better — A bigger or sharper screen costs pins, a frame buffer, current and code, and is often harder to read than four large digits. Match the display to the message.',
    'Any display that works at 5 V works on an ESP — The pins of an ESP32 are 3.3 V and not 5 V tolerant. Many character LCDs, LED drivers and their I2C backpacks are 5 V parts and need level care ([[level-shifters]]).',
    'A screen that is bright enough indoors is bright enough outside — Backlit LCDs and OLEDs wash out in direct sunlight. Test in the light where the device will live.'
  ],
  terms: [
    { term: 'Character display', also: ['alphanumeric display', 'text display', 'character LCD'], def: 'A display that shows characters from a fixed set stored in its controller, in a grid of cells such as 16 × 2 or 20 × 4, instead of pixels that your program sets one by one.' },
    { term: 'Emissive display', also: ['self-lit display'], def: 'A display whose elements make their own light: LEDs, seven-segment digits, LED matrices and OLEDs. Easy to read in the dark, washed out by direct sunlight.' },
    { term: 'Reflective display', also: ['reflective LCD'], def: 'A display that forms its picture by reflecting ambient light instead of producing its own: e-paper and LCDs without a backlight. Readable in sunshine, invisible in the dark unless a light is added.' },
    { term: 'Backlight', also: ['LCD backlight', 'BL'], def: 'A light behind a transmissive LCD that makes its picture visible. On a character LCD it is a row of LEDs that draws more current than the rest of the module, and it can be switched off or dimmed with PWM.' }
  ],
  choose: {
    good: ['One light or a row of lights for state and level', 'Seven-segment digits for numbers read at a distance', 'A character LCD or a small OLED for short text and menus'],
    avoid: ['A backlit display on a battery that must last months, unless it lights only on demand', 'A 5 V module wired straight to ESP pins', 'A screen where a light or a web page would say the same thing'],
    check: ['The light the display will really sit in', 'How far away the reader stands', 'The supply voltage and the logic level of the module', 'How many pins are left after the sensors']
  },
  examples: [
    {
      title: 'A thermometer on two AA cells',
      q: 'A battery thermometer has a 16 × 2 character LCD whose backlight draws about 25 mA (a typical figure; check your module). The two cells hold 2000 mAh. How long does the backlight alone last if it is always on, and if it lights for 10 seconds at each of 20 looks a day?',
      steps: ['Always on: $2000 / 25 = 80$ hours, a little over three days.', 'On demand: $20 \\times 10 = 200$ seconds a day, which is $200 / 3600 = 0.056$ hours, so $0.056 \\times 25 = 1.4$ mAh a day.', 'The backlight now needs $2000 / 1.4 \\approx 1400$ days. The board in deep sleep and the cells\' own self-discharge decide the real life, not the display.'],
      a: 'Three days always on; years when lit only on demand. The choice that saves the battery is when the display is lit, not which display it is.'
    }
  ],
  quiz: [
    { q: 'Which of these keeps showing its picture after the power is disconnected?', choices: ['An OLED', 'E-paper', 'A character LCD with its backlight off', 'A MAX7219 matrix'], a: 1, why: 'E-paper needs power only to change the picture. The other three show nothing the moment the supply goes.' },
    { q: 'A backlight draws 25 mA and the battery holds 2000 mAh. About how long does it last with the backlight always on?', choices: ['Three days', 'Three months', 'Three years', 'It never runs out'], a: 0, why: '2000 mAh divided by 25 mA is 80 hours, a little over three days. Lighting the display only on demand is what stretches it to months or years.' },
    { q: 'A device sits on a sunny windowsill and is read in daylight. Which display suffers most?', choices: ['E-paper', 'A reflective LCD with no backlight', 'A dim backlit LCD or OLED', 'None of them'], a: 2, why: 'Displays that make their own light compete with the sun and lose. Reflective types use the sun as their light and get better as it grows brighter.' },
    { q: 'A display with more pixels is always the better choice.', a: false, why: 'More pixels cost pins, memory, current and code, and a few large digits are often easier to read than a small screen. The best display is the smallest one that says what the reader needs.' }
  ],
  applications: [
    'The seven-segment panel of a bench supply or an energy meter.',
    'The character LCD of a 3D printer controller or a water-bath thermostat.',
    'A row of status LEDs on a router, a charger or a sensor node.',
    'A shelf-edge price tag, where e-paper shows a price for years on one battery.'
  ],
  sources: [
    'Manufacturer datasheets of the display controllers named in this topic: HD44780U, TM1637, MAX7219/MAX7221, SSD1306.',
    'Espressif, *ESP32 Series Datasheet*: electrical characteristics of the GPIO pins.',
    'NXP, *UM10204 I2C-bus specification and user manual*, for the two-wire displays.'
  ],
  sim: 'ad-chooser'
},

/* ================================================================ indicator-leds-and-bar-graphs */
{
  id: 'indicator-leds-and-bar-graphs',
  parent: 'alphanumeric-displays',
  title: 'Indicator LEDs and bar graphs',
  level: 1,
  short: 'A single LED is already a display: on, off, blinking, a colour. A row of them is a bar graph. The price is one pin each, until a shift register or a driver chip carries the signals.',
  keywords: ['indicator LED', 'status LED', 'bar graph', 'level indicator', 'blink code', 'charlieplexing', 'shift register', '74HC595', 'LED row', 'dot mode', 'bar mode', 'colour blind', 'status light'],
  prereq: ['leds', 'pin-current-limits', 'digital-output'],
  related: ['driving-leds-with-pwm', 'io-expanders-and-shift-registers', 'rgb-leds', 'addressable-leds', 'choosing-a-display'],
  body: `The cheapest display is a light. One LED says *on* or *off*; blinking says *busy* or *fault*; three of different colours say *fine, watch, act* across a room. Before reaching for a screen, ask whether a light would do: it is the one display that needs no library, no font and almost no memory. The resistor and the wiring are on the [[leds]] page. This page is about using lights to *say* something.

### What a light can say

- **State by colour.** Green for healthy, amber for watch, red for act. Colour must never be the only signal: roughly one man in twelve has some colour-vision deficiency. Keep each light in a fixed place, or label it, as well.
- **State by rhythm.** Steady, slow blink, fast blink, double flash. A rhythm is read from a distance and needs one LED. A **blink code** (n flashes, a pause, repeat) can name a dozen faults; print the table on the product.
- **Level by position.** A row of LEDs lit up to a point, a **bar graph**, shows how much. One lit LED travelling along the row, *dot mode*, shows where. Ten LEDs give about ten steps: coarse, but unbeatable for "is the battery nearly empty".
- **Brightness.** PWM fades a light ([[driving-leds-with-pwm]]); the eye judges brightness roughly logarithmically, so a fade that looks even needs a correction curve.

### Getting enough pins

A ten-LED bar graph wants ten outputs. The ways round that:

1. **One pin each**, for three to five lights, each with its own resistor.
2. **A shift register** such as the 74HC595: three pins (data, clock, latch) give eight outputs, and chips chain ([[io-expanders-and-shift-registers]]).
3. **A driver with memory** (TM1637, MAX7219; the next pages) which also dims.
4. **Charlieplexing**: $n$ pins drive $n(n-1)$ LEDs by using the high-impedance state of the pins, so 4 pins give 12 LEDs. Only one LED is lit at a time, so it must be scanned, and the wiring is tricky. Worth knowing, rarely worth building.
5. **Addressable LEDs** (WS2812): one pin for any number of lights, in colour ([[addressable-leds]]).

### Count the current

Ten LEDs at 5 mA are 50 mA when all are lit, far more than a pin should give, and several pins together make it worse ([[pin-current-limits]]). Lit LEDs at the top of a bar graph are the worst case, so work that out first. A shift register or a transistor array carries the load instead of the ESP's pins; check the total the chip is rated for, not only each output.

> [!key] Lights are the cheapest display: colour, rhythm and position carry information with no screen. Count the pins and the current for the worst case, and use a shift register or a driver chip when one pin per LED runs out.`,
  ideas: [
    'A light says state by colour and rhythm, and level by position; it needs no library and almost no memory.',
    'Never rely on colour alone: keep lights in fixed places, labelled, or distinguish them by rhythm.',
    'One pin per LED runs out quickly; shift registers and driver chips turn three pins into eight outputs or more.',
    'Add up the current for the case with every LED lit before choosing the driver.'
  ],
  pitfalls: [
    'A bar graph of ten LEDs needs a ten-pin port — Three pins and a shift register do it, or one pin with addressable LEDs. Pins are the scarce thing, not LEDs.',
    'A red/green pair is enough for everyone — Many people cannot tell them apart. Give the two lights different positions or rhythms, and label them.',
    'Each LED only takes its own few milliamps, so the load does not matter — The worst case lights them all at once, and a pin or a shift register has a limit for the total as well as for each output.'
  ],
  terms: [
    { term: 'Bar graph', also: ['bargraph', 'level indicator', 'LED bar'], def: 'A row of LEDs lit from one end up to a point that stands for a value. In dot mode only the LED at that point is lit.' },
    { term: 'Blink code', also: ['flash code', 'status code'], def: 'A fault or state reported by the number of flashes of one LED: for example three flashes, a pause, three flashes again.' },
    { term: 'Charlieplexing', also: ['Charlie plexing'], def: 'A way of driving n(n−1) LEDs from n pins by letting each pin be high, low or disconnected. Only one LED is lit at a time, so the pattern must be scanned.' },
    { term: 'Status LED', also: ['indicator LED', 'pilot light'], def: 'An LED whose only job is to tell the user what the device is doing: power, network, error.' }
  ],
  choose: {
    good: ['State and alarms that must be seen from across a room', 'A coarse level (battery, signal, tank) in five to ten steps', 'Devices with no room, no budget or no pins for a screen'],
    avoid: ['Exact values: a bar graph shows "about three quarters", not 73', 'Colour as the only way to tell two states apart', 'Ten LEDs driven straight from ten pins on a pin-starved board'],
    check: ['The current of the case with every LED lit', 'Whether the lights can be told apart without colour', 'How bright the LEDs are in the room where they are used']
  },
  code: [
    {
      title: 'A five-LED bar graph from a potentiometer',
      about: 'The potentiometer stands in for any value: a tank level, a battery voltage, a signal strength. The program lights as many LEDs as the value deserves, in equal steps.',
      needs: 'An ESP32 DevKit, five LEDs with a 330 Ω resistor each, and a 10 kΩ potentiometer.',
      wiring: [['GPIO25, 26, 27, 32, 33', 'each through 330 Ω to an LED to GND', 'five LEDs, level 1 to 5'], ['GPIO34', 'wiper of the potentiometer; its ends to 3V3 and GND', 'ADC1 input, safe with Wi-Fi']],
      blocks: `
        when started
          for each [p v] in (the five LED pins)
            set pin (p) as [output v]
          end
        forever
          set [level v] to (((analog read pin (34)) * (6)) / (4096))
          for each [i v] in (0 to 4)
            set pin (item (i) of [led pins v]) to <(i) < (level)>
          end
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PINS[] = {25, 26, 27, 32, 33};   // lowest level first
        const int N = 5;
        const int POT = 34;                            // ADC1, input only

        void setup() {
          for (int i = 0; i < N; i++) pinMode(LED_PINS[i], OUTPUT);
        }

        void loop() {
          int level = analogRead(POT) * (N + 1) / 4096;    // 0 to 5 LEDs lit, in equal steps
          for (int i = 0; i < N; i++) digitalWrite(LED_PINS[i], i < level);
          delay(20);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        LED_PINS = [25, 26, 27, 32, 33]                 # lowest level first
        leds = [Pin(p, Pin.OUT) for p in LED_PINS]
        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)         # ADC1, input only

        while True:
            level = pot.read_u16() * (len(leds) + 1) // 65536    # 0 to 5 LEDs lit, in equal steps
            for i, led in enumerate(leds):
                led.value(1 if i < level else 0)
            time.sleep_ms(20)
      `,
      notes: ['At the top attenuation the ESP32 ADC saturates a little below 3.3 V, so the last stretch of the knob\'s travel all lights five LEDs. See [[adc-attenuation-and-calibration]].', 'Dot mode is one change: light only the LED where `i == level - 1`.', 'A reading that wobbles makes the top LED flicker; average it first ([[filtering-sensor-data]]).']
    },
    {
      title: 'A blink code that never stops the program',
      about: 'One status LED reports a fault number: 0 is healthy and steady, 1 to 9 flashes that many times, then pauses. The LED level is worked out from the clock, so nothing in the program waits.',
      needs: 'An ESP32 DevKit with its LED on GPIO2 (or an LED and a 330 Ω resistor on GPIO2).',
      wiring: [['GPIO2', 'on-board LED, or 330 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          set [code v] to (3)
        forever
          set [t v] to ((milliseconds since start) mod (((code) * (400)) + (1600)))
          if <(code) = (0)> then
            set pin (2) to [HIGH v]
          else if <(t) < ((code) * (400))> then
            set pin (2) to (((t) mod (400)) < (150))
          else
            set pin (2) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int LED = 2;
        int faultCode = 3;            // 0 = healthy (steady), 1 to 9 = that many flashes, then a pause

        void setup() {
          pinMode(LED, OUTPUT);
        }

        void loop() {
          unsigned long cycle = faultCode * 400UL + 1600UL;   // the flashes, then a pause
          unsigned long t = millis() % cycle;
          bool on = (faultCode == 0) || (t < faultCode * 400UL && t % 400 < 150);   // 150 ms on, 250 ms off
          digitalWrite(LED, on);
          // the rest of the program runs here and is never held up
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)
        fault_code = 3                # 0 = healthy (steady), 1 to 9 = that many flashes, then a pause

        while True:
            cycle = fault_code * 400 + 1600               # the flashes, then a pause
            t = time.ticks_ms() % cycle
            on = fault_code == 0 or (t < fault_code * 400 and t % 400 < 150)   # 150 ms on, 250 ms off
            led.value(on)
            # the rest of the program runs here and is never held up
      `,
      notes: ['The LED state is a pure function of the time, so no variable has to remember where in the pattern it is.', 'When the clock wraps (after 49.7 days in C++) one cycle comes out odd; for a blink code that does not matter.']
    }
  ],
  examples: [
    {
      title: 'Pins for a ten-segment bar graph',
      q: 'How many ESP32 pins does a ten-LED bar graph need if wired directly, through two chained 74HC595 shift registers, and through charlieplexing?',
      steps: ['Direct: one pin per LED, so 10 pins.', 'Two chained 74HC595: data, clock and latch, so 3 pins for up to 16 outputs.', 'Charlieplexing: $n(n-1) \\ge 10$ is first true for $n = 4$ (12 LEDs), so 4 pins, with the LEDs scanned one at a time.'],
      a: '10, 3 or 4 pins. The shift register saves the most pins for the least trouble; charlieplexing saves a pin more but needs scanning code and dimmer LEDs.'
    }
  ],
  quiz: [
    { q: 'How many LEDs can 5 pins drive by charlieplexing?', choices: ['5', '10', '20', '25'], a: 2, why: 'n pins drive n(n−1) LEDs: 5 × 4 = 20. Only one is lit at a time, so the display must be scanned quickly.' },
    { q: 'Ten LEDs at 5 mA each make a bar graph. What current does the whole bar draw when it is full?', choices: ['5 mA', '10 mA', '50 mA', '500 mA'], a: 2, why: 'All ten are lit at the top of the scale: 10 × 5 mA = 50 mA. That worst case, not the single LED, decides which pins or driver can carry it.' },
    { q: 'Which is the best way to show "fault" and "healthy" to a person who cannot tell red from green?', choices: ['A brighter red LED', 'Different rhythms or positions as well as colours', 'A bigger LED', 'Blue instead of green'], a: 1, why: 'Colour alone fails for about one person in twelve. A blink pattern or a fixed, labelled position works for everyone.' },
    { q: 'A blink code needs one LED per fault number.', a: false, why: 'The number of flashes carries the code, so one LED can name many faults. The price is that the reader must count and know the table.' }
  ],
  applications: [
    'The charge and status lights of a battery charger or a power bank.',
    'A signal-strength or battery gauge of five to ten LEDs on a portable device.',
    'The heartbeat and error LEDs on a controller board.',
    'The sound-level meters of audio equipment, in bar or dot mode.'
  ],
  sources: [
    'Texas Instruments, *SN74HC595 datasheet*: outputs, current limits and daisy-chaining.',
    'The datasheet of the LED you use: forward voltage and continuous current.',
    'Arduino-ESP32 documentation, GPIO API (digitalWrite, pinMode).'
  ]
},

/* ================================================================ seven-segment-displays */
{
  id: 'seven-segment-displays',
  parent: 'alphanumeric-displays',
  title: 'Seven-segment displays',
  level: 1,
  short: 'Seven bars and a dot make every digit and a few letters. One byte describes a digit, many digits share their wires by taking turns, and the whole display looks lit because the eye cannot keep up.',
  keywords: ['seven segment', '7-segment', 'LED digit', 'segment', 'common cathode', 'common anode', 'multiplexing', 'persistence of vision', 'digit', 'decimal point', 'segment byte', 'refresh rate', 'scanning', 'ghosting'],
  prereq: ['indicator-leds-and-bar-graphs', 'digital-output', 'bits-and-bytes'],
  related: ['tm1637-and-max7219', 'keypads-and-matrices', 'io-expanders-and-shift-registers', 'formatting-numbers', 'non-blocking-timing'],
  body: `A seven-segment digit is seven bars of LED labelled a to g, clockwise from the top (a top, b upper right, c lower right, d bottom, e lower left, f upper left, g middle), plus a decimal point, dp. Lighting some of the eight draws every digit and a few letters. It is crude and it is the clearest, brightest, cheapest way to show a number from across a room.

### One byte per digit

Treat the eight segments as the bits of a byte. In the order most tables use, bit 0 is a, bit 1 is b, up to bit 6 for g and bit 7 for dp:

| Digit | Segments lit | Byte |
|---|---|---|
| 0 | a b c d e f | 0x3F |
| 1 | b c | 0x06 |
| 2 | a b d e g | 0x5B |
| 3 | a b c d g | 0x4F |
| 4 | b c f g | 0x66 |
| 5 | a c d f g | 0x6D |
| 6 | a c d e f g | 0x7D |
| 7 | a b c | 0x07 |
| 8 | all seven | 0x7F |
| 9 | a b c d f g | 0x6F |

Chips disagree about the bit order: the TM1637 uses the one above, while the MAX7219 in its raw mode puts the decimal point in bit 7 but a in bit 6 and g in bit 0. A library hides this; a table you copy from the web does not.

### Common cathode, common anode

The eight LEDs of a digit share one terminal. With a **common cathode** the shared pin goes to ground and a segment lights when its pin is *high*. With a **common anode** it goes to the supply and a segment lights when its pin is *low*, so the byte must be inverted. Every segment needs its own resistor, 220 Ω to 470 Ω from 3.3 V for red: one resistor on the common pin would make a 1 glare and an 8 look dim.

### Many digits: take turns

Four separate digits would take 32 pins. Instead all digits share the eight segment lines and each has its own common pin, 12 pins in all. The program lights **one digit at a time**: put its pattern on the segment lines, switch that digit on, wait a few milliseconds, move to the next. Run through all digits more than about a hundred times a second and persistence of vision shows them all lit. This is **multiplexing**.

It costs two things. Each digit is lit only 1/n of the time, so for the same brightness the segments must be pulsed n times harder: 20 mA instead of 5 mA. And the digit's common pin now carries all eight segments, 160 mA, which no pin can give, so it needs a transistor. Multiplexing saves pins, not power.

Worse, the loop that scans must never stop: a \`delay()\` elsewhere freezes the scan with one digit lit, glaring, and the others dark. The simulation shows it. Driver chips ([[tm1637-and-max7219]]) scan on their own.

> [!key] A digit is a byte of segment bits; common-anode parts need it inverted. Several digits share their segment wires and take turns faster than the eye can follow, which needs transistors, a loop that never stops, and bigger pulses for the same brightness.`,
  ideas: [
    'Each digit is a byte: one bit per segment a to g, plus the decimal point.',
    'Common-cathode digits light on a high pin, common-anode digits on a low one, so the byte is inverted for the latter.',
    'Multiplexing shares the segment lines between digits and lights one at a time, faster than the eye resolves.',
    'A multiplexed display saves pins, not power, and stops working properly the moment the scanning loop is blocked.'
  ],
  pitfalls: [
    'Each digit of a four-digit display needs eight pins of its own — Multiplexing shares the eight segment lines among all digits and adds one line per digit: 12 pins for four digits, or 2 or 3 with a driver chip.',
    'One resistor on the common pin is enough — Then the brightness depends on how many segments are lit: a 1 glares, an 8 is dim. Each segment gets its own resistor.',
    'A multiplexed display can sit through a long delay() — The scan stops with one digit lit at full pulse current while the rest go dark. Keep the loop spinning, or let a driver chip scan.'
  ],
  terms: [
    { term: 'Seven-segment display', also: ['7-segment display', 'LED digit'], def: 'A digit made of seven LED bars, a to g, and usually a decimal point. Lighting different bars draws the digits 0 to 9 and some letters.' },
    { term: 'Common cathode / common anode', also: ['common-cathode display', 'common-anode display'], def: 'How the LEDs of a digit share a pin. Common cathode: the shared pin goes to ground and a high level lights a segment. Common anode: it goes to the supply and a low level lights it.' },
    { term: 'Segment byte', also: ['segment mask', 'font table'], def: 'A number whose bits say which segments of a digit are lit, for example 0x06 for the digit 1. The bit order depends on the chip or library.' },
    { term: 'Multiplexing', also: ['scanning', 'strobing'], def: 'Lighting the digits of a display one at a time in rapid turn, so that they share their segment wires and look lit together.' },
    { term: 'Persistence of vision', also: ['flicker fusion'], def: 'The eye keeps an image for a fraction of a second, so lights switched on and off faster than about 60 to 100 times a second look steady.' }
  ],
  choose: {
    good: ['Clocks, counters and meters read from a metre or more', 'Numbers that must be read at a glance in poor light', 'Cheap, bright, rugged output with no library'],
    avoid: ['Text: letters like K, M, W and X cannot be drawn', 'Direct multiplexing from the ESP itself in a program that also does slow work', 'Blue or white digits on 3.3 V without checking their forward voltage'],
    check: ['Common cathode or common anode', 'The digit height for the viewing distance', 'The segment current rating, continuous and pulsed', 'Whether a driver chip is built into the module']
  },
  code: [
    {
      title: 'One digit counting from 0 to 9',
      about: 'The digits come from a table of segment bytes, written to eight pins. Set the constant if your digit is common anode.',
      needs: 'An ESP32 DevKit and one common-cathode seven-segment digit.',
      wiring: [['GPIO18, 19, 21, 22', 'segments a, b, c, d', 'each through 330 Ω'], ['GPIO23, 25, 26, 27', 'segments e, f, g, dp', 'each through 330 Ω'], ['GND', 'the digit\'s common cathode pin']],
      blocks: `
        when started
          for each [p v] in (the eight segment pins)
            set pin (p) as [output v]
          end
        forever
          for each [d v] in (0 to 9)
            show (item (d) of [segment bytes v]) :: my
            wait (0.5) seconds
          end
        end

        define show (mask)
          // bit 0 = a ... bit 6 = g, bit 7 = dp: each pin gets its own bit
          for each [i v] in (0 to 7)
            set pin (item (i) of [segment pins v]) to (bit (i) of (mask))
          end
      `,
      cpp: String.raw`
        const int SEG_PINS[8] = {18, 19, 21, 22, 23, 25, 26, 27};   // a, b, c, d, e, f, g, dp
        const uint8_t DIGITS[10] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F};
        const bool COMMON_ANODE = false;     // true: a segment lights when its pin is LOW

        void show(uint8_t mask) {            // bit 0 = a ... bit 6 = g, bit 7 = dp
          if (COMMON_ANODE) mask = ~mask;
          for (int i = 0; i < 8; i++) digitalWrite(SEG_PINS[i], (mask >> i) & 1);
        }

        void setup() {
          for (int i = 0; i < 8; i++) pinMode(SEG_PINS[i], OUTPUT);
        }

        void loop() {
          for (int d = 0; d < 10; d++) {
            show(DIGITS[d]);
            delay(500);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SEG_PINS = [18, 19, 21, 22, 23, 25, 26, 27]    # a, b, c, d, e, f, g, dp
        DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F]
        COMMON_ANODE = False                           # True: a segment lights when its pin is LOW

        segs = [Pin(p, Pin.OUT) for p in SEG_PINS]

        def show(mask):                                # bit 0 = a ... bit 6 = g, bit 7 = dp
            if COMMON_ANODE:
                mask = ~mask & 0xFF
            for i, seg in enumerate(segs):
                seg.value((mask >> i) & 1)

        while True:
            for d in DIGITS:
                show(d)
                time.sleep_ms(500)
      `,
      notes: ['Add 0x80 to a byte to light the decimal point: 0x7F | 0x80 shows "8."', 'With 330 Ω each lit segment takes about 4 mA from 3.3 V; a green or blue digit needs a smaller resistor or 5 V.']
    },
    {
      title: 'Two digits by multiplexing, counting 00 to 99',
      about: 'Both digits share the eight segment pins. Every 4 ms the program switches to the other digit, so each is refreshed 125 times a second. The count advances once a second without ever stopping the scan.',
      needs: 'An ESP32 DevKit, two common-cathode digits, two NPN transistors (2N3904 or similar) with 1 kΩ base resistors.',
      wiring: [['GPIO18, 19, 21, 22, 23, 25, 26, 27', 'segments a to dp of both digits', 'each through 330 Ω'], ['GPIO32', '1 kΩ → base of an NPN whose collector is the tens digit\'s common cathode, emitter to GND'], ['GPIO33', 'the same for the ones digit']],
      blocks: `
        when started
          set [number v] to (0)
          set [active v] to (0)
          set [last scan v] to (milliseconds since start)
          set [last count v] to (milliseconds since start)
        forever
          if <((milliseconds since start) - (last scan)) ≥ (4)> then
            set [last scan v] to (milliseconds since start)
            set [active v] to ((1) - (active))
            show digit (active) of (number) :: my
          end
          if <((milliseconds since start) - (last count)) ≥ (1000)> then
            change [last count v] by (1000)
            set [number v] to (((number) + (1)) mod (100))
          end
        end

        define show digit (which) of (n)
          // all digits off first, then the pattern, then the one digit on
          set pin (32) to [LOW v]
          set pin (33) to [LOW v]
          put the segment byte of the right digit of (n) on the eight segment pins
          set pin (item (which) of [digit pins v]) to [HIGH v]
      `,
      cpp: String.raw`
        const int SEG_PINS[8] = {18, 19, 21, 22, 23, 25, 26, 27};   // a to g, dp: shared by both digits
        const int DIGIT_PINS[2] = {32, 33};                          // each switches one digit's common pin
        const uint8_t DIGITS[10] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F};

        int number = 0;                       // 0 to 99
        int active = 0;                       // which digit is lit now
        uint32_t lastScan = 0, lastCount = 0;

        void showDigit(int which, uint8_t mask) {
          digitalWrite(DIGIT_PINS[0], LOW);   // all digits off first: no ghosting
          digitalWrite(DIGIT_PINS[1], LOW);
          for (int i = 0; i < 8; i++) digitalWrite(SEG_PINS[i], (mask >> i) & 1);
          digitalWrite(DIGIT_PINS[which], HIGH);
        }

        void setup() {
          for (int i = 0; i < 8; i++) pinMode(SEG_PINS[i], OUTPUT);
          for (int i = 0; i < 2; i++) pinMode(DIGIT_PINS[i], OUTPUT);
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastScan >= 4) {          // 4 ms per digit: 125 full refreshes a second
            lastScan = now;
            active = 1 - active;
            int value = (active == 0) ? number / 10 : number % 10;
            showDigit(active, DIGITS[value]);
          }
          if (now - lastCount >= 1000) {      // the count never blocks the scan
            lastCount += 1000;
            number = (number + 1) % 100;
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SEG_PINS = [18, 19, 21, 22, 23, 25, 26, 27]    # a to g, dp: shared by both digits
        DIGIT_PINS = [32, 33]                          # each switches one digit's common pin
        DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F]

        segs = [Pin(p, Pin.OUT) for p in SEG_PINS]
        digits = [Pin(p, Pin.OUT) for p in DIGIT_PINS]

        number = 0                                     # 0 to 99
        active = 0                                     # which digit is lit now
        last_scan = last_count = time.ticks_ms()

        def show_digit(which, mask):
            for d in digits:
                d.value(0)                             # all digits off first: no ghosting
            for i, seg in enumerate(segs):
                seg.value((mask >> i) & 1)
            digits[which].value(1)

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_scan) >= 4:   # 4 ms per digit: 125 full refreshes a second
                last_scan = now
                active = 1 - active
                value = number // 10 if active == 0 else number % 10
                show_digit(active, DIGITS[value])
            if time.ticks_diff(now, last_count) >= 1000:   # the count never blocks the scan
                last_count = time.ticks_add(last_count, 1000)
                number = (number + 1) % 100
      `,
      notes: ['Each digit is lit half the time, so it looks about half as bright as in the one-digit program; lower the resistors, within the segment\'s pulsed rating, to compensate.', 'MicroPython is slower and its timing less even: with Wi-Fi running the scan may stutter. A driver chip does not have that problem ([[tm1637-and-max7219]]).', 'Add a `delay(300)` anywhere in `loop()` and watch one digit freeze lit while the other goes dark.']
    }
  ],
  examples: [
    {
      title: 'The current of a multiplexed display',
      q: 'Four digits are multiplexed with each segment pulsed at 20 mA. What is the average current of one segment, and what does the supply deliver while "8.8.8.8." is shown?',
      steps: ['Each digit is lit one slot in four, so a segment\'s average is $20 \\times \\tfrac{1}{4} = 5$ mA: as bright as a steady 5 mA.', 'At any instant exactly one digit is lit, with eight segments at 20 mA: $8 \\times 20 = 160$ mA.', 'There is always one digit lit, so the supply sees a steady 160 mA. Wiring four digits directly at 5 mA a segment would also draw $4 \\times 8 \\times 5 = 160$ mA.'],
      a: 'Five milliamps on average per segment and 160 mA from the supply, in 20 mA pulses. Multiplexing saves pins, not power.'
    }
  ],
  quiz: [
    { q: 'Which byte lights the digit 7 (segments a, b and c) when bit 0 is a?', choices: ['0x07', '0x70', '0x3F', '0x7F'], a: 0, why: 'Segments a, b and c are bits 0, 1 and 2: 1 + 2 + 4 = 7. 0x3F is the digit 0 and 0x7F is 8.' },
    { q: 'On a common-anode digit, a segment lights when its pin is…', choices: ['high', 'low', 'floating', 'pulled to 5 V through the resistor'], a: 1, why: 'The shared anode sits at the supply, so the current flows through the LED into a pin that is pulled low. The segment byte must be inverted.' },
    { q: 'Four digits are scanned with 2 ms each. How many times a second is each digit refreshed?', choices: ['125', '250', '500', '8'], a: 0, why: 'One full scan takes 4 × 2 = 8 ms, so each digit comes round 1000 / 8 = 125 times a second, well above the flicker limit.' },
    { q: 'To look as bright as a steady 10 mA segment, a segment on a four-digit multiplexed display must be pulsed at about…', choices: ['10 mA', '20 mA', '40 mA', '160 mA'], a: 2, why: 'Each digit is lit a quarter of the time, so the pulse must be four times higher: 40 mA, which is why the pins need transistors and the pulsed rating of the LED matters.' },
    { q: 'While the program is stuck in delay(), a display multiplexed by the ESP keeps showing all its digits.', a: false, why: 'The scan stops where it was, so one digit stays lit and the others are dark. A driver chip with its own scanner keeps the display steady.' }
  ],
  applications: [
    'Digital clocks, kitchen timers and oven displays.',
    'The panel meters of bench supplies, multimeters and energy meters.',
    'Scoreboards and counters, where the digits are large and wired through driver chips.',
    'Petrol pumps, scales and lift indicators, as numbers readable from a distance.'
  ],
  sources: [
    'Manufacturers\' datasheets for LED seven-segment displays: forward voltage, continuous and peak current, common-anode and common-cathode types.',
    'Analog Devices (Maxim), *MAX7219/MAX7221 datasheet*: multiplexed display drive and segment data format.',
    'Titan Micro Electronics, *TM1637 datasheet*: display register and segment order.'
  ],
  sim: ['ad-seg', 'ad-mux']
},

/* ================================================================ tm1637-and-max7219 */
{
  id: 'tm1637-and-max7219',
  parent: 'alphanumeric-displays',
  title: 'TM1637 and MAX7219',
  level: 2,
  short: 'Two cheap driver chips scan the digits for you: the TM1637 gives four digits and a colon on two wires, the MAX7219 gives eight digits or an 8 × 8 matrix on three, and both keep displaying while your program does something else.',
  keywords: ['TM1637', 'MAX7219', 'MAX7221', 'driver chip', 'seven segment driver', 'LedControl', 'TM1637Display', 'decode mode', 'code B', 'intensity', 'RSET', 'daisy chain', 'DIN', 'CLK', 'LOAD', 'two-wire', 'brightness'],
  prereq: ['seven-segment-displays', 'libraries-and-imports', 'spi'],
  related: ['led-matrices', 'level-shifters', 'three-volt-logic', 'formatting-numbers', 'io-expanders-and-shift-registers'],
  body: `Lighting digits yourself works for one or two, and wastes pins and processor time after that. A driver chip takes the job: you tell it *what to show* and it keeps scanning the digits at a steady rate, whatever your program is doing. Two cheap chips cover most projects.

### TM1637: four digits on two wires

The usual module has four digits and a colon with a TM1637 on the back. It is driven by **two wires, CLK and DIO**, using start and stop conditions and an acknowledge much like I2C, but it has no address: it is not an I2C device and cannot share an I2C bus. The chip stores one byte per digit, scans them itself, and dims in eight steps. On clock modules the colon is the decimal point of the second digit, bit 7 of that byte. The chip can also scan a few keys, though most modules do not wire them. It runs from 3.3 V as well as from 5 V.

### MAX7219: eight digits or a matrix on three wires

The MAX7219 (and the nearly identical MAX7221) drives eight digits of seven segments or an 8 × 8 matrix of 64 LEDs. Think of a shift register that remembers. A **16-bit word**, a 4-bit register address followed by 8 bits of data, is clocked in on DIN, and raising LOAD (CS) latches it. The registers are one per digit, **decode mode** (the chip turns 0 to 9 and a few characters into segments itself, so you send the digit, not the segment byte), **intensity** (16 steps), **scan limit** (how many digits), **shutdown** and **display test**. One resistor, RSET, sets the segment current; the intensity register only dims below it. The chip powers up *in shutdown*, which is why a fresh project shows nothing until it is woken.

Chips chain: DOUT of one goes to DIN of the next, all sharing CLK and LOAD. The words ripple through, so to write one chip of four you send four words (three of them a harmless no-op) and latch once. A 32 × 8 sign is four 8 × 8 modules made this way.

### Mind the voltage

The MAX7219 is specified for 4.0 to 5.5 V, and its datasheet asks for a logic high of at least 3.5 V when it runs from 5 V. A 3.3 V ESP32 is below that. Many modules work anyway; some work only warm, or not at all. A level shifter or a 74HCT buffer on the three lines makes the design sound ([[level-shifters]]), and a 5 V supply that can carry the display's current belongs beside it.

### Libraries and drivers

For the TM1637 the usual Arduino library is TM1637Display (\`showNumberDec\`, \`showNumberDecEx\`, \`setSegments\`, \`setBrightness\`). For the MAX7219, LedControl handles digits and single LEDs; MD_MAX72XX and MD_Parola handle matrices and text ([[led-matrices]]). MicroPython has no built-in driver for either. The MAX7219 is easy to drive directly, as the second program shows; the TM1637 needs a small driver file copied to the board.

> [!key] Driver chips scan the digits for you: the TM1637 on two wires, the MAX7219 on three, with chaining, decode mode and 16 brightness steps. Both keep displaying while your program does something else. Check the MAX7219's logic level on a 3.3 V ESP.`,
  ideas: [
    'The TM1637 uses two wires with an I2C-like protocol but has no address; the MAX7219 takes 16-bit words on three wires.',
    'Both chips scan the digits themselves, so the display stays steady whatever the program is doing.',
    'The MAX7219 starts in shutdown; decode mode, intensity and scan limit are registers you set once.',
    'MAX7219 chips chain by wiring DOUT to the next DIN, and one latch writes them all.'
  ],
  pitfalls: [
    'The TM1637 is an I2C device and can share the I2C bus — It uses two wires that look like I2C but has no address. Give it two ordinary GPIO pins of its own.',
    'A new MAX7219 shows nothing, so the module is dead — The chip powers up in shutdown with a scan limit of one digit. Write the shutdown, scan limit and intensity registers first.',
    'The RSET resistor sets the brightness in software — It sets the maximum segment current in hardware. The intensity register only dims below that limit.'
  ],
  terms: [
    { term: 'TM1637', also: ['TM1637 module'], def: 'A driver chip for up to six digits of seven segments, with a two-wire interface (CLK and DIO), eight brightness steps and optional key scanning. Four-digit clock modules are built on it.' },
    { term: 'MAX7219', also: ['MAX7221'], def: 'A driver chip for eight digits of seven segments or an 8 × 8 LED matrix, fed 16-bit words over three wires. It scans the LEDs itself, has 16 brightness steps and can be chained.' },
    { term: 'Decode mode', also: ['code B', 'BCD decode'], def: 'A MAX7219 setting in which the chip converts the numbers 0 to 9 and a few characters into segment patterns itself. Switched off, each byte you write is the raw pattern of dots or segments.' },
    { term: 'Daisy chain', also: ['cascade'], def: 'Several driver chips wired in a line, the data output of one feeding the data input of the next, so that one set of control wires drives them all.' },
    { term: 'RSET', also: ['segment current resistor'], def: 'The resistor on a MAX7219 that sets the peak current of every segment. A smaller value gives a brighter, hungrier display.' }
  ],
  choose: {
    good: ['Clocks, counters and meters of four to eight digits from two or three pins', 'Chained 8 × 8 matrices for signs', 'Programs that block or sleep while the display must stay lit'],
    avoid: ['Letters outside the seven-segment alphabet', 'A MAX7219 on 3.3 V logic without checking it works on your board', 'Full brightness on a battery: the chips and the LEDs draw hundreds of milliamps'],
    check: ['The module\'s supply voltage and its logic-level tolerance', 'Whether the digits are common cathode or anode (the chip is built for one)', 'The library\'s support for your core version']
  },
  code: [
    {
      title: 'A minutes-and-seconds counter on a TM1637',
      about: 'The seconds count up from zero and the colon blinks once a second. The chip does the scanning; the loop only sends a number twice a second.',
      needs: 'An ESP32 DevKit and a four-digit TM1637 clock module.',
      wiring: [['GPIO18', 'CLK'], ['GPIO19', 'DIO'], ['3V3', 'VCC', 'the module accepts 3.3 V'], ['GND', 'GND']],
      libs: ['TM1637 (TM1637Display, by Avishay Orpaz)'],
      blocks: `
        when started
          start display [TM1637 4 digits v] clock pin (18) data pin (19)
          set display brightness (3)
          set [seconds v] to (0)
          set [colon v] to <true>

        every (0.5) seconds
          set [colon v] to <not <colon>>
          if <not <colon>> then
            set [seconds v] to (((seconds) + (1)) mod (6000))
          end
          show number (((round down ((seconds) / (60))) * (100)) + ((seconds) mod (60))) with colon <colon> :: display
      `,
      cpp: String.raw`
        #include <TM1637Display.h>

        const int CLK_PIN = 18;
        const int DIO_PIN = 19;
        TM1637Display display(CLK_PIN, DIO_PIN);

        uint32_t lastTick = 0;
        int seconds = 0;
        bool colon = true;

        void setup() {
          display.setBrightness(3);           // 0 (dim) to 7 (bright)
        }

        void loop() {
          if (millis() - lastTick >= 500) {   // twice a second: the colon blinks, the seconds count
            lastTick += 500;
            colon = !colon;
            if (!colon) seconds = (seconds + 1) % 6000;      // up to 99 min 59 s, then back to zero
            int shown = (seconds / 60) * 100 + seconds % 60; // mm:ss as one number: 12:34 is 1234
            display.showNumberDecEx(shown, colon ? 0b01000000 : 0, true);   // leading zeros, colon bit
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import tm1637                      # add-on driver: copy tm1637.py to the board (micropython-tm1637)
        import time

        display = tm1637.TM1637(clk=Pin(18), dio=Pin(19))
        display.brightness(3)              # 0 (dim) to 7 (bright)

        seconds = 0
        colon = True
        last_tick = time.ticks_ms()

        while True:
            if time.ticks_diff(time.ticks_ms(), last_tick) >= 500:   # twice a second
                last_tick = time.ticks_add(last_tick, 500)
                colon = not colon
                if not colon:
                    seconds = (seconds + 1) % 6000                   # up to 99 min 59 s, then back to zero
                display.numbers(seconds // 60, seconds % 60, colon)  # mm and ss, with the colon
      `,
      notes: ['MicroPython has no built-in TM1637 driver: the program needs the add-on file `tm1637.py` on the board, for example copied with mpremote ([[flashing-and-esptool]]).', 'In the C++ version the colon is bit 6 of the `dots` argument, 0b01000000; other modules without a colon ignore it.', 'Modules differ: some put the colon on a different digit or have no colon at all. Check yours before blaming the code.']
    },
    {
      title: 'An eight-digit MAX7219 counter',
      about: 'A number counts up ten times a second on an eight-digit module. Leading zeros are blanked. The Arduino version uses the LedControl library; the MicroPython version writes the 16-bit words itself, which shows what the library does.',
      needs: 'An ESP32 DevKit, an eight-digit MAX7219 seven-segment module and a 5 V supply for it (a level shifter on the three signal lines is the sound design).',
      wiring: [['GPIO23', 'DIN'], ['GPIO18', 'CLK'], ['GPIO27', 'CS (LOAD)'], ['5V', 'VCC', 'the display\'s own supply, ground shared with the ESP'], ['GND', 'GND']],
      libs: ['LedControl (by Eberhard Fahle)'],
      blocks: `
        when started
          start SPI on SCK (18) MOSI (23) chip select (27)
          write register (0x0C) value (1) :: bus
          write register (0x0B) value (7) :: bus
          write register (0x09) value (255) :: bus
          write register (0x0A) value (8) :: bus
          set [count v] to (0)
        forever
          set [n v] to (count)
          for each [digit v] in (0 to 7)
            if <<(n) = (0)> and <(digit) > (0)>> then
              write register ((digit) + (1)) value (15) :: bus
            else
              write register ((digit) + (1)) value ((n) mod (10)) :: bus
            end
            set [n v] to (round down ((n) / (10)))
          end
          change [count v] by (1)
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include <LedControl.h>

        const int DIN_PIN = 23, CLK_PIN = 18, CS_PIN = 27;
        LedControl lc(DIN_PIN, CLK_PIN, CS_PIN, 1);     // one MAX7219 chip

        uint32_t count = 0;

        void setup() {
          lc.shutdown(0, false);              // wake the chip: it starts in shutdown
          lc.setIntensity(0, 8);              // 0 to 15
          lc.clearDisplay(0);
        }

        void loop() {
          uint32_t n = count;
          for (int digit = 0; digit < 8; digit++) {          // digit 0 is the rightmost
            if (n == 0 && digit > 0) lc.setChar(0, digit, ' ', false);   // blank leading zeros
            else lc.setDigit(0, digit, n % 10, false);
            n /= 10;
          }
          count++;
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import time

        cs = Pin(27, Pin.OUT, value=1)
        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))

        def write(register, value):          # one 16-bit word: register address, then data
            cs(0)
            spi.write(bytes([register, value]))
            cs(1)

        write(0x0C, 1)                       # shutdown register: 1 = normal operation
        write(0x0B, 7)                       # scan limit: all eight digits
        write(0x09, 0xFF)                    # decode mode: numbers on all eight digits
        write(0x0A, 8)                       # intensity, 0 to 15
        write(0x0F, 0)                       # display test off

        count = 0
        while True:
            n = count
            for digit in range(8):           # register 1 is the rightmost digit
                if n == 0 and digit > 0:
                    write(digit + 1, 0x0F)   # decode mode: 0x0F is blank
                else:
                    write(digit + 1, n % 10)
                n //= 10
            count += 1
            time.sleep_ms(100)
      `,
      notes: ['The module runs from 5 V. The MAX7219 asks for a logic high of 3.5 V at that supply, so 3.3 V signals from an ESP32 are out of specification even when they appear to work.', 'The Arduino version uses a table of its own and writes raw segments; the MicroPython version uses the chip\'s decode mode. The picture is the same.']
    }
  ],
  examples: [
    {
      title: 'Writing one chip of a chain of four',
      q: 'Four MAX7219 modules are chained. You want one digit on the second module to show a 5 and the other three modules left alone. What goes on the wire?',
      steps: ['Each chip holds a 16-bit shift register and passes the bits it pushes out on to the next, so the first word you send ends up in the *last* chip.', 'Send four 16-bit words in turn, every chip getting one. Words meant for the chips you leave alone are the no-op register, address 0, with data 0.', 'Only then raise LOAD: all four chips latch at the same moment, and only the chip that received a real register word changes.'],
      a: 'Four words (64 clock bits), one of them the real write, then one pulse on LOAD. Libraries for chains do this bookkeeping for you.'
    }
  ],
  quiz: [
    { q: 'The TM1637 uses a two-wire protocol. Can it share an I2C bus with a sensor?', choices: ['Yes, it has the address 0x24', 'No: it has no address, so give it two pins of its own', 'Yes, if the pull-ups are removed', 'Only at 100 kHz'], a: 1, why: 'The protocol resembles I2C but has no addressing, so every listener would obey every message. Use two separate GPIO pins.' },
    { q: 'Four MAX7219 chips are chained. How many 16-bit words are shifted in before one pulse on LOAD updates a register in just one of them?', choices: ['1', '2', '4', '16'], a: 2, why: 'Every chip in the chain holds one word at the latch, so you send four: the real one and three no-ops. Fewer words would leave some chips holding a half-shifted word.' },
    { q: 'A TM1637 module is showing a number and the program then runs a one-second delay(). What does the display do?', choices: ['Freezes with one digit lit', 'Goes dark', 'Keeps showing the number', 'Flickers'], a: 2, why: 'The chip stores the digits and scans them itself. Only a display scanned by the ESP stops when the program does.' },
    { q: 'Lowering the intensity register of a MAX7219 is the same as changing RSET.', a: false, why: 'RSET sets the maximum segment current in hardware. The intensity register only dims below that limit by shortening the lit time of each scan.' }
  ],
  applications: [
    'Cheap four-digit clocks and thermometers, which are nearly all TM1637 modules.',
    'Eight-digit counters, frequency meters and calculators built on the MAX7219.',
    'Chained 8 × 8 modules as scrolling signs and big clocks.',
    'Score and timer displays that must stay lit while the program does other work.'
  ],
  sources: [
    'Titan Micro Electronics, *TM1637 datasheet*: command set, display register, timing.',
    'Analog Devices (Maxim Integrated), *MAX7219/MAX7221 datasheet*: register map, serial interface, RSET table.',
    'The README files of the LedControl and TM1637Display Arduino libraries.'
  ],
  sim: { id: 'ad-mux', params: { scanner: 'chip' } }
},

/* ================================================================ character-lcd */
{
  id: 'character-lcd',
  parent: 'alphanumeric-displays',
  title: 'The character LCD',
  level: 1,
  short: 'The 16 × 2 and 20 × 4 text display is one controller, the HD44780, behind a grid of cells. You say which letter goes at which column and row; it draws the dots. Contrast, 5 V and the order of its memory are what catch people out.',
  keywords: ['character LCD', 'HD44780', '1602', '2004', '16x2', '20x4', 'LiquidCrystal', 'DDRAM', 'contrast', 'V0', 'backlight', '4-bit mode', 'RS', 'enable', 'cursor', 'clear', 'lcd.print', 'setCursor'],
  prereq: ['choosing-a-display', 'digital-output', 'strings-and-text'],
  related: ['lcd-i2c-backpack', 'custom-characters', 'formatting-numbers', 'menus-on-small-displays', 'three-volt-logic'],
  body: `The character LCD is the display of printers, coffee machines and lab instruments, and it is nearly all one chip: the **HD44780**, designed by Hitachi in the 1980s and copied by everyone since. A 16 × 2 module shows 16 characters on 2 rows, a 20 × 4 shows 80. Each character is a cell of 5 × 8 dots drawn by the controller from a font in its ROM. You never draw dots; you say *put the letter A at column 3 of row 1*.

### What the controller holds

- **Display memory (DDRAM)**: 80 characters of text, however many the glass shows. Row 1 starts at address 0x00 and row 2 at 0x40. On a 20 × 4, rows 3 and 4 **continue** rows 1 and 2, at 0x14 and 0x54. That odd layout is why a long string printed on a 20 × 4 runs from row 1 into row 3. Libraries hide it as long as you use \`setCursor(column, row)\`.
- **Character ROM**: letters, digits and punctuation, plus symbols. The common ROM variant carries Japanese katakana where a European one has é and ü, so an accented letter may show as something strange: test yours.
- **Character RAM**: room for eight characters of your own ([[custom-characters]]).
- The **cursor**: where the next character lands. It can be shown as an underline or a blinking block.

### Wiring: four data lines are enough

The controller accepts a byte as eight bits at once or as two 4-bit halves. With RS (command or data), E (an enable strobe) and RW tied to ground because you never read back, **4-bit mode needs six pins**: RS, E and D4 to D7. An I2C backpack cuts that to two ([[lcd-i2c-backpack]]). The module also has VDD (5 V), VSS (ground), V0 for contrast, and A and K for the backlight.

### Three reasons a new display looks dead

1. **Contrast.** V0 sets how dark the dots are. Too low and nothing shows; too high and you see a row of solid blocks. A 10 kΩ trimmer between ground and V0 lets you turn it slowly until the text appears.
2. **Initialisation.** Until the library has set it up, the controller shows a row of blocks on line 1. The sequence is part of \`begin()\`.
3. **Power.** The module is a 5 V part. Its inputs accept the 3.3 V highs of an ESP32 when only *writing*, with RW grounded; reading back would put 5 V on ESP pins, which is why RW stays at ground.

### Speed and flicker

A character takes tens of microseconds to write, but *clear* and *home* take about 1.5 ms and blank the screen. A loop that calls \`clear()\` on every pass makes the display flash. Overwrite instead: write the same text again, padded with spaces to the old width ([[formatting-numbers]]).

> [!key] A character LCD is an HD44780 with 80 characters of memory: six pins in 4-bit mode, 5 V, and a contrast trimmer that makes a good display look dead. Position with setCursor, overwrite instead of clearing, and remember that rows 3 and 4 of a 20 × 4 continue rows 1 and 2.`,
  ideas: [
    'The HD44780 holds characters, not pixels: you place letters by column and row and it draws the dots.',
    'In 4-bit mode six pins are enough: RS, E and D4 to D7, with RW tied to ground.',
    'Contrast is set by the voltage on V0; a wrong setting shows nothing or a row of blocks.',
    'Clear and home take about 1.5 ms and blank the screen, so overwrite instead of clearing in a loop.'
  ],
  pitfalls: [
    'A blank display means the code or the wiring is wrong — Turn the contrast trimmer first. At the wrong setting a perfectly good display shows nothing or only solid blocks on the first row.',
    'Rows 2 and 3 of a 20 × 4 follow each other in memory — Row 1 is followed by row 3 and row 2 by row 4. A string printed past the end of row 1 appears on row 3. Use setCursor for every row.',
    'Calling lcd.clear() at the top of loop() keeps the display tidy — It takes about 1.5 ms and blanks the screen each time, which shows as flicker. Overwrite with padded text instead.'
  ],
  terms: [
    { term: 'HD44780', also: ['HD44780-compatible', 'Hitachi controller'], def: 'The display controller from Hitachi that sits behind nearly every 16 × 2 and 20 × 4 character LCD. Its instruction set and memory layout are the same on every compatible module.' },
    { term: 'DDRAM', also: ['display data RAM', 'display memory'], def: 'The 80 bytes of the HD44780 that hold the characters shown. Each address belongs to one cell of the glass, but rows 3 and 4 of a 20 × 4 continue rows 1 and 2.' },
    { term: 'Contrast voltage', also: ['V0', 'VEE', 'contrast trimmer'], def: 'The voltage on the V0 pin, usually set by a trimmer potentiometer, which decides how dark the dots are. A wrong setting makes a working display look blank or filled with blocks.' },
    { term: '4-bit mode', also: ['4-bit interface'], def: 'A way of writing the HD44780 in two halves of four bits on D4 to D7, so that six pins (RS, E and four data lines) are enough.' },
    { term: 'Character ROM', also: ['font ROM', 'A00', 'A02'], def: 'The built-in font of the controller. Variants differ in the upper half of the table: one has katakana, another European accented letters.' }
  ],
  choose: {
    good: ['Readouts and short menus of text and digits', 'Parts that must survive years and cost little', 'Projects that already have a 5 V supply'],
    avoid: ['Pictures, graphs and fonts other than the built-in one', 'Battery use with the backlight always on', '3.3 V-only designs where the 5 V module needs level shifting'],
    check: ['16 × 2 or 20 × 4, and the character ROM variant', 'The backlight colour and its current', 'Parallel pins or an I2C backpack', 'How cold it gets: the glass slows down and fades near freezing']
  },
  code: [
    {
      title: 'Two lines of text and an uptime counter',
      about: 'The first row says hello once; the second row is rewritten every 200 ms with the time since start. The trailing spaces wipe the digits that a longer number would have left.',
      needs: 'An ESP32 DevKit and a 16 × 2 HD44780 module on 5 V with a 10 kΩ contrast trimmer.',
      wiring: [['GPIO18', 'RS'], ['GPIO19', 'E'], ['GPIO21, 22, 23, 25', 'D4, D5, D6, D7'], ['GND', 'RW, VSS, K'], ['5V', 'VDD, and A through the module\'s backlight resistor'], ['trimmer wiper', 'V0', 'the trimmer\'s ends to 5V and GND']],
      libs: ['LiquidCrystal (by Arduino, Adafruit)'],
      blocks: `
        when started
          start display [LCD 16×2, 4-bit v] RS (18) E (19) D4 (21) D5 (22) D6 (23) D7 (25)
          set cursor column (0) row (0)
          print [Hello, ESP32] on display :: display
        forever
          set cursor column (0) row (1)
          print [Uptime ] on display :: display
          print (round down ((milliseconds since start) / (1000))) on display :: display
          print [ s   ] on display :: display
          wait (0.2) seconds
        end
      `,
      cpp: String.raw`
        #include <LiquidCrystal.h>

        LiquidCrystal lcd(18, 19, 21, 22, 23, 25);   // RS, E, D4, D5, D6, D7

        void setup() {
          lcd.begin(16, 2);                  // columns, rows
          lcd.setCursor(0, 0);               // column 0, row 0
          lcd.print("Hello, ESP32");
        }

        void loop() {
          lcd.setCursor(0, 1);               // second row: overwrite, never clear
          lcd.print("Uptime ");
          lcd.print(millis() / 1000);
          lcd.print(" s   ");                // spaces wipe what a longer number left behind
          delay(200);
        }
      `,
      py: String.raw`
        from machine import Pin
        from gpio_lcd import GpioLcd       # add-on driver: copy lcd_api.py and gpio_lcd.py to the board
        import time

        lcd = GpioLcd(rs_pin=Pin(18), enable_pin=Pin(19),
                      d4_pin=Pin(21), d5_pin=Pin(22), d6_pin=Pin(23), d7_pin=Pin(25),
                      num_lines=2, num_columns=16)

        lcd.move_to(0, 0)                  # column 0, row 0
        lcd.putstr("Hello, ESP32")

        while True:
            lcd.move_to(0, 1)              # second row: overwrite, never clear
            lcd.putstr("Uptime {} s   ".format(time.ticks_ms() // 1000))   # spaces wipe what a longer number left behind
            time.sleep_ms(200)
      `,
      output: `
        Hello, ESP32
        Uptime 42 s
      `,
      notes: ['MicroPython has no built-in LCD driver: copy `lcd_api.py` and `gpio_lcd.py` (the micropython-lcd drivers) to the board.', 'If the backlight is on and nothing shows, turn the contrast trimmer slowly through its whole range before touching the code.', 'The ESP32 writes 3.3 V highs into a 5 V module; that works because RW is grounded and the module never drives a pin of the ESP.']
    }
  ],
  examples: [
    {
      title: 'Where does the long string go?',
      q: 'On a 20 × 4 module a program prints a 30-character string after setCursor(0, 0), with no other positioning. Where do the characters appear?',
      steps: ['Row 1 holds addresses 0x00 to 0x13: the first 20 characters.', 'The next address is 0x14, which is the start of row 3, not row 2.', 'So characters 21 to 30 appear at the left of row 3. Row 2 is untouched.'],
      a: 'Twenty characters on row 1 and ten on row 3. Position each row yourself with setCursor, or the order of the memory will surprise you.'
    }
  ],
  quiz: [
    { q: 'Which command is slow enough to make the screen flash if it is called on every pass of loop()?', choices: ['setCursor', 'print', 'clear', 'write'], a: 2, why: 'Clear takes about 1.5 ms and blanks the whole display; the others take tens of microseconds.' },
    { q: 'On a 20 × 4 module, at which DDRAM address does row 3 start?', choices: ['0x28', '0x14', '0x40', '0x54'], a: 1, why: 'Row 1 occupies 0x00 to 0x13 and row 3 continues right after it at 0x14. Row 2 starts at 0x40 and row 4 at 0x54.' },
    { q: 'A new 16 × 2 module lights its backlight but shows only a row of solid blocks or nothing. What do you try first?', choices: ['A different library', 'Turning the contrast trimmer', 'A faster I2C clock', 'More pull-up resistors'], a: 1, why: 'Contrast is the commonest reason a good display looks dead. Turn it slowly through its whole range with the program running.' },
    { q: 'Six ESP pins are enough to drive an HD44780 in 4-bit mode: RS, E and D4 to D7.', a: true, why: 'RW can be tied to ground when you never read back, so only the register select, the enable strobe and four data lines need pins.' }
  ],
  applications: [
    'The control panel of a 3D printer or a laser engraver.',
    'Thermostats, aquarium controllers and water-bath heaters.',
    'Lab instruments and bench meters that must be read at a glance.',
    'Menus of small appliances, with three buttons and two lines of text.'
  ],
  sources: [
    'Hitachi, *HD44780U (LCD-II) datasheet*: instruction set, DDRAM addresses, timing, 4-bit interface and initialisation.',
    'Arduino, *LiquidCrystal library reference*: begin, setCursor, print, clear.',
    'The datasheet of your module (for example a 1602A or 2004A): pinout, supply voltage and backlight.'
  ],
  sim: 'ad-lcd'
},

/* ================================================================ lcd-i2c-backpack */
{
  id: 'lcd-i2c-backpack',
  parent: 'alphanumeric-displays',
  title: 'The I2C backpack',
  level: 1,
  short: 'A small board on the back of the LCD turns six pins into two: a PCF8574 port expander is written over I2C and wiggles the display\'s lines. It is cheap and it works, but it is a 5 V part with pull-ups to match.',
  keywords: ['I2C LCD', 'PCF8574', 'PCF8574A', 'backpack', 'LiquidCrystal_I2C', 'hd44780 library', '0x27', '0x3F', 'I2C address', 'LCM1602', 'level shifter', 'pull-ups', 'port expander', 'nibble'],
  prereq: ['character-lcd', 'i2c', 'i2c-addresses-and-scanning'],
  related: ['i2c-pull-ups-and-bus-problems', 'level-shifters', 'io-expanders-and-shift-registers', 'three-volt-logic', 'custom-characters'],
  body: `Six pins is a lot on a small board. A little PCB soldered to the back of the LCD cuts it to two: a **PCF8574** I2C port expander, eight output pins that you set by writing one byte to an I2C address, wired to the LCD's lines. The ESP talks I2C (SDA and SCL) to the expander, and the expander talks 4-bit parallel to the controller.

### What is on the backpack

- The PCF8574 (or its PCF8574A cousin), pins P0 to P7. On the common board: P0 is RS, P1 is RW, P2 is E, P3 switches the backlight through a transistor, and P4 to P7 are D4 to D7. Other makers wire them in another order; if the backlight switches but the text is garbage, try another constructor or a library that detects the wiring.
- A trimmer for **contrast**, a jumper that cuts the backlight, and pull-up resistors on SDA and SCL.
- Solder jumpers A0, A1 and A2 that change the **address**: 0x20 to 0x27 for the PCF8574, 0x38 to 0x3F for the A version. Most boards arrive as 0x27 or 0x3F. If you do not know which, scan the bus ([[i2c-addresses-and-scanning]]).

### The cost: speed

The controller wants two 4-bit transfers per byte, and each half is latched by pulsing E high and then low. That is **four I2C writes per character**, each an address byte and a data byte: about 0.8 ms per character at 100 kHz, so a full 16 × 2 screen takes about 25 ms, and about 6 ms at 400 kHz. Fast enough for readouts, too slow for animation. The simulation shows the four bytes and the wire.

### The 5 V problem

The LCD wants 5 V, and the backpack, powered from the same 5 V, has pull-ups on SDA and SCL that go to that rail. The I2C lines then idle at 5 V, above what an ESP32 pin tolerates. And the PCF8574 at 5 V reads a high only above 0.7 × 5 V = 3.5 V, which a 3.3 V ESP32 does not quite reach. Sound ways out are a bidirectional **level shifter** between the ESP and the backpack ([[level-shifters]]), or a 3.3 V version of the display. Many projects connect it directly and it seems to work; that is luck with one specimen, not a design.

### Libraries

Several forks are called LiquidCrystal_I2C. They declare the AVR architecture and the IDE warns, but they normally compile for the ESP32. The \`hd44780\` library with its I2C expander class is more robust: it finds the address and the pin mapping itself. Either way the calls are the ones of [[character-lcd]]: \`setCursor\`, \`print\`, \`createChar\`, plus \`backlight()\`.

> [!key] The backpack turns an HD44780 into a two-wire I2C device through a PCF8574: four writes per character, address 0x27 or 0x3F, a contrast trimmer on the board. It is a 5 V design, so protect the ESP32's I2C pins with a level shifter.`,
  ideas: [
    'A PCF8574 on the back of the module drives RS, E, the backlight and four data lines from one I2C byte.',
    'Each character needs four expander writes, so a whole 16 × 2 screen takes about 25 ms at 100 kHz.',
    'The address is 0x20 to 0x27 or 0x38 to 0x3F and is set by solder jumpers; scan to find it.',
    'Powered from 5 V, the backpack puts 5 V pull-ups on the ESP32\'s I2C lines: use a level shifter.'
  ],
  pitfalls: [
    'The address is always 0x27 — It is 0x27 on many boards, 0x3F on others, and the jumpers A0 to A2 change it. Scan the bus and use what is found.',
    'The backpack works at 3.3 V logic because the display lights — The pull-ups to 5 V can push 5 V into the ESP, and the expander\'s input threshold at 5 V is 3.5 V. It may work and still be out of specification.',
    'A backlight that switches but garbled text means a bad library — Often the backpack is wired in a different order (P0 to P7). Try the other constructor, or the hd44780 library, which detects it.'
  ],
  terms: [
    { term: 'PCF8574', also: ['PCF8574A', 'I2C port expander'], def: 'An 8-bit I2C input/output expander: one byte written to its address sets its eight pins. The A version has a different address range. The standard LCD backpack is built around it.' },
    { term: 'Backpack', also: ['I2C adapter', 'LCM1602', 'serial LCD adapter'], def: 'A small board soldered to the back of a character LCD that carries a port expander, a contrast trimmer and the backlight switch, so that the display needs only two I2C wires.' },
    { term: 'Nibble', also: ['half-byte', 'four bits'], def: 'Four bits, half a byte. An HD44780 in 4-bit mode is written one nibble at a time, high half first.' },
    { term: 'Enable pulse', also: ['E strobe', 'E line'], def: 'The brief rise and fall of the E line of the HD44780. The controller latches the data lines on the falling edge, so every nibble needs the pulse.' }
  ],
  choose: {
    good: ['Any ESP project that needs a text display and has only a few pins free', 'A shared I2C bus with a sensor, using different addresses', 'Menus and readouts that change a few times a second'],
    avoid: ['A 5 V backpack wired straight to the ESP32 and left unchecked', 'Rapid animation: it is slow', 'A bus that already carries a device at 0x27'],
    check: ['The address, by scanning', 'The supply of the backpack and where its pull-ups go', 'The order of the expander pins, if the text is garbled']
  },
  code: [
    {
      title: 'Hello on a backpack LCD',
      about: 'Prints two lines on a 16 × 2 LCD with an I2C backpack. Change the address if your scan found 0x3F.',
      needs: 'An ESP32 DevKit and a 16 × 2 LCD with a PCF8574 backpack, level-shifted or on a 3.3 V display.',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL'], ['5V', 'VCC', 'or 3V3 for a 3.3 V display'], ['GND', 'GND']],
      libs: ['LiquidCrystal_I2C'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [LCD 16×2 I2C v] at address (0x27)
          turn the backlight [on v] :: display
          set cursor column (0) row (0)
          print [Hello, ESP32] on display :: display
          set cursor column (0) row (1)
          print [I2C 0x27] on display :: display
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <LiquidCrystal_I2C.h>

        LiquidCrystal_I2C lcd(0x27, 16, 2);   // address (0x27 or 0x3F), columns, rows

        void setup() {
          Wire.begin(21, 22);                 // SDA, SCL
          lcd.init();
          lcd.backlight();
          lcd.setCursor(0, 0);
          lcd.print("Hello, ESP32");
          lcd.setCursor(0, 1);
          lcd.print("I2C 0x27");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin
        from i2c_lcd import I2cLcd          # add-on drivers: copy lcd_api.py and i2c_lcd.py to the board

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        lcd = I2cLcd(i2c, 0x27, 2, 16)      # bus, address (0x27 or 0x3F), rows, columns

        lcd.move_to(0, 0)
        lcd.putstr("Hello, ESP32")
        lcd.move_to(0, 1)
        lcd.putstr("I2C 0x27")
      `,
      output: `
        Hello, ESP32
        I2C 0x27
      `,
      notes: ['The Arduino constructor takes columns then rows; the MicroPython driver takes rows then columns. It is an easy swap to miss.', 'MicroPython has no built-in LCD driver: copy `lcd_api.py` and `i2c_lcd.py` to the board.', 'If a scan shows nothing, check SDA and SCL, the power, and the contrast trimmer before the address ([[i2c-pull-ups-and-bus-problems]]).']
    },
    {
      title: 'What the library does: one word without a library',
      about: 'This writes "Hello" to the LCD with no LCD library at all: raw bytes to the expander, two nibbles per byte, E pulsed high and low, after the start-up sequence from the HD44780 datasheet. It is the whole job of a library, in thirty lines.',
      needs: 'The same LCD with the standard backpack wiring (P0 = RS, P2 = E, P3 = backlight, P4 to P7 = D4 to D7).',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL'], ['5V', 'VCC', 'level-shifted as above'], ['GND', 'GND']],
      blocks: `
        define send nibble (n) with RS (rs)
          // data in P4 to P7, backlight P3, E is bit 2 (4), RS is bit 0
          I2C write (n × 16 + 8 + RS (rs) + 4) to address (0x27) :: bus
          I2C write (n × 16 + 8 + RS (rs)) to address (0x27) :: bus

        define send byte (value) with RS (rs)
          send nibble (the high half of (value)) with RS (rs) :: my
          send nibble (the low half of (value)) with RS (rs) :: my

        when started
          start I2C on SDA (21) SCL (22)
          wait (0.05) seconds
          send nibble (3) with RS (0) :: my
          wait (0.005) seconds
          send nibble (3) with RS (0) :: my
          wait (0.001) seconds
          send nibble (3) with RS (0) :: my
          send nibble (2) with RS (0) :: my
          send byte (0x28) with RS (0) :: my
          send byte (0x0C) with RS (0) :: my
          send byte (0x01) with RS (0) :: my
          wait (0.002) seconds
          send byte (0x06) with RS (0) :: my
          for each [c v] in (the letters of [Hello])
            send byte (code of (c)) with RS (1) :: my
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t ADDR = 0x27;           // PCF8574 address: 0x27 or 0x3F
        const uint8_t RS = 0x01, EN = 0x04, BL = 0x08;    // P0, P2, P3; the data nibble sits in P4 to P7

        void expander(uint8_t value) {       // one I2C write sets all eight pins
          Wire.beginTransmission(ADDR);
          Wire.write(value);
          Wire.endTransmission();
        }

        void nibble(uint8_t n, uint8_t rs) {
          uint8_t v = (n << 4) | BL | rs;
          expander(v | EN);                  // E high
          expander(v);                       // E low: the controller latches the nibble on this falling edge
        }

        void send(uint8_t value, uint8_t rs) {   // rs = 0 for a command, RS for data
          nibble(value >> 4, rs);
          nibble(value & 0x0F, rs);
        }

        void setup() {
          Wire.begin(21, 22);
          delay(50);
          nibble(0x3, 0); delay(5);          // the wake-up sequence from the datasheet
          nibble(0x3, 0); delay(1);
          nibble(0x3, 0);
          nibble(0x2, 0);                    // switch to 4-bit mode
          send(0x28, 0);                     // function set: 4 bits, two rows, 5 x 8 dots
          send(0x0C, 0);                     // display on, no cursor
          send(0x01, 0); delay(2);           // clear (takes 1.5 ms)
          send(0x06, 0);                     // entry mode: the cursor moves right
          for (const char *p = "Hello"; *p; p++) send(*p, RS);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        ADDR = 0x27                          # PCF8574 address: 0x27 or 0x3F
        RS, EN, BL = 0x01, 0x04, 0x08        # P0, P2, P3; the data nibble sits in P4 to P7

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)

        def expander(value):                 # one I2C write sets all eight pins
            i2c.writeto(ADDR, bytes([value]))

        def nibble(n, rs):
            v = (n << 4) | BL | rs
            expander(v | EN)                 # E high
            expander(v)                      # E low: the controller latches the nibble on this falling edge

        def send(value, rs=0):               # rs = 0 for a command, RS for data
            nibble(value >> 4, rs)
            nibble(value & 0x0F, rs)

        time.sleep_ms(50)
        nibble(0x3, 0); time.sleep_ms(5)     # the wake-up sequence from the datasheet
        nibble(0x3, 0); time.sleep_ms(1)
        nibble(0x3, 0)
        nibble(0x2, 0)                       # switch to 4-bit mode
        send(0x28)                           # function set: 4 bits, two rows, 5 x 8 dots
        send(0x0C)                           # display on, no cursor
        send(0x01); time.sleep_ms(2)         # clear (takes 1.5 ms)
        send(0x06)                           # entry mode: the cursor moves right
        for ch in "Hello":
            send(ord(ch), RS)
      `,
      notes: ['This is the usual pin order. If your backpack differs, only the three constants and the shift by four change.', 'Real libraries add delays, a second command path for custom characters and a cache of the backlight bit; the idea is the same.']
    }
  ],
  examples: [
    {
      title: 'How long does one screen take?',
      q: 'One I2C write of an address and a data byte takes about 197 µs at 100 kHz. How long does a library need to rewrite all 32 characters of a 16 × 2 screen, and what changes at 400 kHz?',
      steps: ['A character is four writes: $4 \\times 197\\ \\mu\\text{s} = 0.79$ ms.', 'Thirty-two characters take $32 \\times 0.79 = 25$ ms, so about 40 whole screens a second at best.', 'At 400 kHz a write takes about 49 µs, so the screen takes about 6 ms. Library delays and the controller\'s own 37 µs per byte come on top.'],
      a: 'About 25 ms at 100 kHz and 6 ms at 400 kHz. Rewrite only the characters that changed.'
    }
  ],
  quiz: [
    { q: 'On the common backpack, which expander pin drives the LCD\'s E (enable) line?', choices: ['P0', 'P1', 'P2', 'P3'], a: 2, why: 'P0 is RS, P1 is RW, P2 is E and P3 switches the backlight; P4 to P7 carry D4 to D7.' },
    { q: 'About how many I2C writes does it take to send one character to the LCD through the backpack?', choices: ['One', 'Two', 'Four', 'Sixteen'], a: 2, why: 'Two nibbles, and each is written twice: once with E high and once with E low, so the controller sees the falling edge.' },
    { q: 'The backpack is powered from 5 V and has pull-ups on SDA and SCL. Why is that a problem for the ESP32?', choices: ['I2C needs 3.3 V pull-ups to work at all', 'The lines idle at 5 V, above what the ESP32 pins tolerate', 'The pull-ups are too weak', 'The expander cannot be addressed'], a: 1, why: 'The pull-ups go to the 5 V rail, so SDA and SCL rest at 5 V. A level shifter between the ESP32 and the backpack, or a 3.3 V display, removes the risk.' },
    { q: 'The address 0x27 is built into the PCF8574 and cannot be changed.', a: false, why: 'The jumpers A0 to A2 set the low three bits, and the A version of the chip uses 0x38 to 0x3F. Scan the bus to find out what yours uses.' }
  ],
  applications: [
    'Almost every cheap 1602 and 2004 module sold for maker projects comes with this backpack.',
    'Sharing one I2C bus between a sensor and a text display on a small board.',
    'Retrofitting an old parallel LCD to a project that has run out of pins.',
    'Instrument panels where the display is wired at the end of a short cable.'
  ],
  sources: [
    'NXP, *PCF8574/PCF8574A datasheet*: remote 8-bit I/O expander for the I2C bus, address table, quasi-bidirectional outputs.',
    'NXP, *UM10204 I2C-bus specification and user manual*: levels, rise times and pull-ups.',
    'Hitachi, *HD44780U datasheet*: 4-bit interface and the initialisation sequence.'
  ],
  sim: 'ad-backpack'
},

/* ================================================================ custom-characters */
{
  id: 'custom-characters',
  parent: 'alphanumeric-displays',
  title: 'Custom characters',
  level: 2,
  short: 'The HD44780 has room for eight characters you draw yourself, each a 5 × 8 grid stored as eight bytes. They give you a reliable degree sign, battery icons, a progress bar with 80 steps and a tiny graph.',
  keywords: ['custom character', 'createChar', 'CGRAM', 'user character', 'glyph', 'progress bar', 'sparkline', 'degree sign', 'battery icon', 'big digits', 'LCD symbol', 'custom_char', 'lcd.write'],
  prereq: ['character-lcd', 'bits-and-bytes', 'arrays-and-lists'],
  related: ['formatting-numbers', 'menus-on-small-displays', 'presenting-data', 'lcd-i2c-backpack'],
  body: `The controller's font has letters, digits and a few symbols, and never quite the one you want: a degree sign you can trust, a battery, a heart, a fat progress bar, an arrow. The HD44780 keeps room for **eight characters that you draw yourself** in a small memory called CGRAM. Each is a grid of 5 × 8 dots stored as eight bytes, one per row, with the five low bits of a byte being the five dots.

### Drawing one

Write the rows from the top, a 1 for a dark dot:

~~~cpp
uint8_t heart[8] = {
  0b00000,   //  .....
  0b01010,   //  .#.#.
  0b11111,   //  #####
  0b11111,   //  #####
  0b11111,   //  #####
  0b01110,   //  .###.
  0b00100,   //  ..#..
  0b00000    //  .....
};
lcd.createChar(0, heart);   // once, after the display is started: slots 0 to 7
lcd.setCursor(0, 0);
lcd.write((uint8_t)0);      // show slot 0: write, not print
~~~

Use \`write\`, not \`print\`: \`print(0)\` would print the digit zero. The bottom row is shared with the cursor underline, so leave it empty unless you want a mark there.

### Four catches

- **Only eight, shared by the whole screen.** A cell shows a slot; it does not keep a copy. Redefine slot 2 and every cell that shows it changes at once. A menu that needs more than eight symbols redefines slots as the screens change.
- **Set the cursor afterwards.** \`createChar\` leaves the controller's address pointing into character memory. Call \`setCursor\` or \`clear\` before printing, or the next text is written into your symbols.
- **Fonts differ, yours do not.** The degree sign, the micro sign and accented letters depend on the module's ROM. A character you define looks the same on every module.
- **Cells touch.** The five columns leave no gap, so a symbol that fills its cell runs into its neighbour.

### What eight characters can do

1. **A smooth progress bar.** Five characters with 1, 2, 3, 4 and 5 columns filled give every cell five steps: 16 cells × 5 are 80 steps instead of 16.
2. **A sparkline.** Eight characters of bars 1 to 8 dots tall show the last 16 readings as a small graph in a single row.
3. **Big digits.** Digits two or three cells tall are built from a handful of shapes: bars, corners, a half block.
4. **Icons.** Battery levels, a bell, a lock, a Wi-Fi sign, an arrow for rising and falling.

The simulation lets you draw a character, see its eight bytes and watch several cells change at once when a slot is redefined.

> [!key] Eight user characters of 5 × 8 dots live in CGRAM; draw them as eight bytes, define them once with createChar, show them with write, and set the cursor afterwards. They are shared by the whole screen, so every cell that shows a slot changes when it is redefined.`,
  ideas: [
    'A custom character is eight bytes, one per row, with the five low bits as dots; there are eight slots, 0 to 7.',
    'Show a slot with write, never print, and set the cursor after createChar.',
    'Slots are shared: redefining one changes every cell that displays it.',
    'Partly filled cells turn 16 cells into 80 progress steps; bars of eight heights make a sparkline.'
  ],
  pitfalls: [
    'lcd.print(0) shows my first custom character — print converts the number to the text "0". Use write with the slot number to send the character code itself.',
    'After createChar the next text prints as usual — The address counter is left in character memory, so the text overwrites your symbols. Call setCursor or clear first.',
    'Eight characters per screen is the limit of a message — It is the limit of the symbols on the screen at once. Redefine slots when the screen changes, as menus do.'
  ],
  terms: [
    { term: 'CGRAM', also: ['character generator RAM', 'user character memory'], def: 'The memory of the HD44780 that holds the eight user-defined characters, eight bytes each. Slots 0 to 7 are shown with character codes 0 to 7.' },
    { term: 'Custom character', also: ['user-defined character', 'createChar'], def: 'A symbol you define as a 5 × 8 pattern of dots and store in CGRAM, so that it can be printed like any letter.' },
    { term: 'Glyph', also: ['character cell', 'dot pattern'], def: 'The pattern of dots that draws one character. On a character LCD it fills a cell of 5 columns by 8 rows.' }
  ],
  choose: {
    good: ['A progress bar or level gauge on a text display', 'A degree sign or battery icon that must look the same on every module', 'Small animations of one or two cells, such as a spinner'],
    avoid: ['More than eight different symbols on one screen', 'Pictures: use a graphic display ([[oled-ssd1306]])', 'Redefining slots every few milliseconds, which is slow over I2C'],
    check: ['That the cursor is set after defining characters', 'Whether the library takes a const array (some old ones do not)', 'How the symbols look side by side without a gap']
  },
  code: [
    {
      title: 'A progress bar with 80 steps',
      about: 'Five custom characters, with one to five columns filled, let each of the 16 cells show five steps. The bar fills from 0 to 100 per cent, then starts again.',
      needs: 'An ESP32 DevKit and a 16 × 2 LCD with an I2C backpack.',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL'], ['5V', 'VCC', 'level-shifted ([[lcd-i2c-backpack]])'], ['GND', 'GND']],
      libs: ['LiquidCrystal_I2C'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [LCD 16×2 I2C v] at address (0x27)
          for each [k v] in (0 to 4)
            create custom character (k) as a cell with (k + 1) columns filled :: display
          end
          set cursor column (0) row (0)
          print [Progress] on display :: display
        forever
          for each [percent v] in (0 to 100)
            set [dots v] to (round down (((percent) * (80)) / (100)))
            set cursor column (0) row (1)
            for each [cell v] in (0 to 15)
              set [here v] to ((dots) - ((cell) * (5)))
              if <(here) ≥ (5)> then
                show custom character (4) :: display
              else if <(here) > (0)> then
                show custom character ((here) - (1)) :: display
              else
                print [ ] on display :: display
              end
            end
            wait (0.06) seconds
          end
        end
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <LiquidCrystal_I2C.h>

        LiquidCrystal_I2C lcd(0x27, 16, 2);
        uint8_t bars[5][8];                   // slot k holds a cell with k + 1 columns filled

        void setup() {
          Wire.begin(21, 22);
          lcd.init();
          lcd.backlight();
          for (int k = 0; k < 5; k++) {
            uint8_t columns = (0x1F << (4 - k)) & 0x1F;   // k = 0: 10000, k = 4: 11111
            for (int row = 0; row < 8; row++) bars[k][row] = columns;
            lcd.createChar(k, bars[k]);
          }
          lcd.setCursor(0, 0);                // after createChar: set the cursor before printing
          lcd.print("Progress");
        }

        void loop() {
          for (int percent = 0; percent <= 100; percent++) {
            int dots = percent * 80 / 100;                // 16 cells x 5 columns = 80 steps
            lcd.setCursor(0, 1);
            for (int cell = 0; cell < 16; cell++) {
              int here = dots - cell * 5;                 // columns left to draw in this cell
              if (here >= 5) lcd.write((uint8_t)4);       // a full cell
              else if (here > 0) lcd.write((uint8_t)(here - 1));
              else lcd.print(' ');
            }
            delay(60);
          }
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        from i2c_lcd import I2cLcd          # add-on drivers: copy lcd_api.py and i2c_lcd.py to the board
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        lcd = I2cLcd(i2c, 0x27, 2, 16)      # bus, address, rows, columns

        for k in range(5):                  # slot k holds a cell with k + 1 columns filled
            columns = (0x1F << (4 - k)) & 0x1F       # k = 0: 10000, k = 4: 11111
            lcd.custom_char(k, bytearray([columns] * 8))

        lcd.move_to(0, 0)
        lcd.putstr("Progress")
        while True:
            for percent in range(101):
                dots = percent * 80 // 100           # 16 cells x 5 columns = 80 steps
                lcd.move_to(0, 1)
                for cell in range(16):
                    here = dots - cell * 5           # columns left to draw in this cell
                    if here >= 5:
                        lcd.putchar(chr(4))          # a full cell
                    elif here > 0:
                        lcd.putchar(chr(here - 1))
                    else:
                        lcd.putchar(' ')
                time.sleep_ms(60)
      `,
      output: `
        Progress
        █████████▌
      `,
      notes: ['The Arduino array is not `const` because some LiquidCrystal_I2C forks take a plain `uint8_t[]`; the hd44780 library accepts both.', 'In MicroPython `custom_char` stores the pattern and returns the cursor to where it was; `putchar(chr(k))` shows slot k.', 'Replace the cell logic with eight bar heights and the last 16 readings of a sensor to get a sparkline.']
    }
  ],
  examples: [
    {
      title: 'Drawing 37 per cent',
      q: 'Which characters does the 16-cell progress bar print for 37 per cent?',
      steps: ['The bar has $16 \\times 5 = 80$ steps, so 37 per cent is $37 \\times 80 / 100 = 29.6$, which rounds down to 29 columns.', 'Five full cells use 25 columns. The sixth cell has $29 - 25 = 4$ columns, which is slot 3.', 'The remaining ten cells are blank.'],
      a: 'Five full cells (slot 4), one cell of slot 3, then ten spaces.'
    }
  ],
  quiz: [
    { q: 'How many custom characters can an HD44780 hold at the same time?', choices: ['4', '8', '16', '64'], a: 1, why: 'CGRAM has room for eight 5 × 8 characters, slots 0 to 7.' },
    { q: 'Why does lcd.print(0) not show custom character 0?', choices: ['Slot 0 is reserved', 'print sends the text "0", not the character code 0', 'The cursor was not set', 'print is too slow'], a: 1, why: 'print turns a number into its digits. write sends the byte itself, which the controller shows as the character in that slot.' },
    { q: 'Slot 3 holds a battery icon that is shown in three places. You redefine slot 3 as a plug. What does the screen show?', choices: ['The plug in one place, the battery in two', 'The plug in all three places at once', 'The battery until the next clear()', 'Nothing until the screen is redrawn'], a: 1, why: 'A cell holds the slot number, not a copy of the dots, so every cell showing slot 3 draws the new pattern immediately.' },
    { q: 'Immediately after createChar, the next print() writes to the screen as usual.', a: false, why: 'The controller\'s address counter points into character memory afterwards. Call setCursor or clear first, or the text lands in the symbols.' }
  ],
  applications: [
    'Progress and level bars on 3D printers, chargers and brewing controllers.',
    'Degree, micro and ohm signs that do not depend on the module\'s ROM.',
    'Battery, signal and lock icons in menus.',
    'Tiny sparklines of the last few readings on a two-line gauge.'
  ],
  sources: [
    'Hitachi, *HD44780U datasheet*: CGRAM, the character code table and the cursor row.',
    'Arduino, *LiquidCrystal library reference*: createChar() and write().',
    'The README of the LiquidCrystal_I2C or hd44780 library you use, for the exact createChar signature.'
  ],
  sim: 'ad-chars'
},

/* ================================================================ formatting-numbers */
{
  id: 'formatting-numbers',
  parent: 'alphanumeric-displays',
  title: 'Formatting numbers for a display',
  level: 2,
  short: 'A number has no fixed width and a display does. Printing it naively leaves stale digits, makes the columns jump and flickers. Fixed-width formats, padding and a little rounding care fix all three.',
  keywords: ['snprintf', 'printf', 'format', 'field width', 'padding', 'leading zeros', 'stale digits', 'negative zero', 'decimal places', 'rounding', 'right align', 'dtostrf', 'f-string', 'str.format', 'jumping digits', 'flicker'],
  prereq: ['character-lcd', 'seven-segment-displays', 'strings-and-text'],
  related: ['custom-characters', 'non-blocking-timing', 'filtering-sensor-data', 'presenting-data', 'menus-on-small-displays'],
  body: `A number has no fixed width: 9 is one character, 10 is two, −9.5 is four, 1234567 is seven. A display is a fixed grid. A program that simply prints each new number into it meets three classic faults: stale digits, jumping columns and flicker.

### Stale digits

Characters are written one by one over what was there. Print 100.0, then 99.5 at the same place: the new text covers four characters and the old last 0 stays, so the screen reads **99.50**, a hundred times too big. There are two cures. Write the same width every time, padding with spaces. Or clear first, but clearing an LCD takes about 1.5 ms and blanks the screen, so at dozens of updates a second it flashes. Pad instead.

### Fixed width

The C format \`%6.1f\` means a field at least 6 characters wide with one decimal; shorter results get spaces on the left, so the digits and the point stay in the same columns. Use \`snprintf(buf, size, "%6.1f", value)\` and print the buffer. Other useful ones: \`%4d\` an integer in 4 columns, \`%02d\` with a leading zero (clocks), \`%-8s\` text padded on the right, \`%%\` a percent sign. MicroPython does the same with \`"{:6.1f}".format(v)\` or an f-string \`f"{v:6.1f}"\`.

| Format | 3.14159 | −12.5 | 1234.56 |
|---|---|---|---|
| %.1f | 3.1 | -12.5 | 1234.6 |
| %6.1f | "   3.1" | " -12.5" | "1234.6" |
| %6.2f | "  3.14" | "-12.50" | "1234.56" (7 characters) |

The last cell is the catch: the width is a *minimum*. A value that needs more spills into the next cell. Decide the largest and smallest values the display must show and reserve room for both, with the sign. Beyond that range show \`---\` or \`>999\`, not a wrapped number.

### Rounding surprises

- 9.96 with one decimal becomes **10.0**, one character wider than 9.9.
- −0.04 with one decimal prints **-0.0**. Round first, and test the rounded value, or force near-zero values to 0.
- Never show more digits than the sensor knows. A temperature good to ±0.5 °C printed to 0.01 °C is noise dressed as precision, and its last digit flickers. Average ([[filtering-sensor-data]]) and update two to four times a second, which is the rate people can read.

### On digit displays

Right-align a number and leave the leading digits *blank*, not zero, except for clocks and codes. The decimal point lights with its digit. With the TM1637 library, \`showNumberDec(value, false)\` blanks leading zeros and \`true\` shows them.

> [!key] Print numbers into a fixed-width field with snprintf or format, so that nothing stale is left and the columns hold still. The width is a minimum, so size it for the extremes, round before testing the sign, and update at a readable rate rather than as fast as the sensor.`,
  ideas: [
    'Writing a shorter number over a longer one leaves the old tail visible: pad to a fixed width or rewrite the whole field.',
    'A format such as %6.1f fixes the width and the decimals, so columns and decimal points stay put.',
    'The field width is a minimum: reserve room for the largest value and the sign, and decide what to show out of range.',
    'Round before you test: 9.96 becomes 10.0 and −0.04 prints as -0.0.'
  ],
  pitfalls: [
    'lcd.clear() before every update is the safe way to avoid stale digits — It takes about 1.5 ms and blanks the whole screen each time, which flickers. Padded, same-width text avoids stale digits without it.',
    'A format width truncates a number that is too long — %6.2f gives at least six characters and never cuts: 1234.56 prints in full, seven characters, and pushes the neighbouring text along.',
    'More decimals mean a better display — Digits beyond what the sensor measures only flicker. Show what is known and update at two to four times a second.'
  ],
  terms: [
    { term: 'Format specifier', also: ['printf format', 'format string', '%d', '%f'], def: 'A code such as %6.1f in a format string that says how to turn a value into text: its kind (integer, float, text), its minimum width and its decimals.' },
    { term: 'Field width', also: ['minimum width'], def: 'The least number of characters a formatted value occupies. Shorter values are padded; longer ones are printed in full and spill over.' },
    { term: 'Padding', also: ['space padding', 'right alignment'], def: 'Spaces (or zeros) added to a value so that it always fills the same number of characters. Padding on the left right-aligns a number.' },
    { term: 'Leading zeros', also: ['zero padding', '%02d'], def: 'Zeros written before the first significant digit, as in 07 minutes. They suit clocks and codes, not ordinary numbers.' }
  ],
  choose: {
    good: ['snprintf with a fixed width for every number on a character display', 'Padding on the left for numbers, on the right for text', 'Updating the screen two to four times a second'],
    avoid: ['print() of a bare number into a field that has shown a longer one', 'clear() on every update', 'sprintf without a size: a long value overruns the buffer'],
    check: ['The largest and smallest value the field must hold, with the sign', 'What the display shows when the value is out of range', 'That float formatting works in your library (some very small cores lack it)']
  },
  code: [
    {
      title: 'A readout that never jumps',
      about: 'A potentiometer stands in for a sensor and is scaled to −20.0 to 120.0. Both rows are always exactly 16 characters, so nothing stale remains and the decimal points stay in their columns.',
      needs: 'An ESP32 DevKit, a 16 × 2 I2C LCD and a 10 kΩ potentiometer.',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL'], ['GPIO34', 'potentiometer wiper', 'its ends to 3V3 and GND'], ['5V', 'LCD backpack', 'level-shifted ([[lcd-i2c-backpack]])']],
      libs: ['LiquidCrystal_I2C'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [LCD 16×2 I2C v] at address (0x27)
          turn the backlight [on v] :: display

        every (0.25) seconds
          set [raw v] to (analog read pin (34))
          set [value v] to ((-20) + (((raw) * (140)) / (4095)))
          if <<(value) > (-0.05)> and <(value) < (0.05)>> then
            set [value v] to (0)
          end
          set cursor column (0) row (0)
          print (format [Temp %6.1f C   ] (value)) on display :: display
          set cursor column (0) row (1)
          print (format [Raw %4d  %3d%%  ] (raw) (percent of (raw) out of 4095)) on display :: display
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <LiquidCrystal_I2C.h>

        LiquidCrystal_I2C lcd(0x27, 16, 2);
        const int POT = 34;                          // stands in for a sensor: ADC1, input only

        void setup() {
          Wire.begin(21, 22);
          lcd.init();
          lcd.backlight();
        }

        void loop() {
          int raw = analogRead(POT);
          float value = -20.0 + raw * 140.0 / 4095.0;           // -20.0 to 120.0
          if (value > -0.05 && value < 0.05) value = 0.0;       // never show -0.0
          char line[17];                                        // 16 characters and the end marker
          snprintf(line, sizeof(line), "Temp %6.1f C   ", value);
          lcd.setCursor(0, 0);
          lcd.print(line);                                      // the same width every time: nothing stale
          snprintf(line, sizeof(line), "Raw %4d  %3d%%  ", raw, raw * 100 / 4095);
          lcd.setCursor(0, 1);
          lcd.print(line);
          delay(250);                                           // four updates a second
        }
      `,
      py: String.raw`
        from machine import I2C, Pin, ADC
        from i2c_lcd import I2cLcd          # add-on drivers: copy lcd_api.py and i2c_lcd.py to the board
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        lcd = I2cLcd(i2c, 0x27, 2, 16)
        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)      # stands in for a sensor: ADC1, input only

        while True:
            raw = pot.read_u16() >> 4                # 12 bits, 0 to 4095
            value = -20.0 + raw * 140.0 / 4095       # -20.0 to 120.0
            if -0.05 < value < 0.05:
                value = 0.0                          # never show -0.0
            lcd.move_to(0, 0)
            lcd.putstr("Temp {:6.1f} C   ".format(value))   # the same width every time: nothing stale
            lcd.move_to(0, 1)
            lcd.putstr("Raw {:4d}  {:3d}%  ".format(raw, raw * 100 // 4095))
            time.sleep_ms(250)                       # four updates a second
      `,
      output: `
        Temp   20.9 C
        Raw 1196   29%
      `,
      notes: ['ESP32 builds of the Arduino core print floats with snprintf; some very small AVR-class cores do not, and use dtostrf instead.', 'The potentiometer saturates a little below 3.3 V at the top attenuation, so the last stretch of its travel reads the same.', 'The trailing spaces in the format make each row exactly 16 characters.']
    }
  ],
  examples: [
    {
      title: 'How wide must the field be?',
      q: 'A thermometer must show −40.0 to 125.0 °C with one decimal and the unit. What format and how many columns does it need?',
      steps: ['The longest values are "-40.0" and "125.0": five characters each, so the field is `%5.1f`.', 'Add a space and the unit: "125.0 C" is 7 characters, so 7 columns of a 16-column row are used, with room for a label.', 'Check the rounding: 9.96 becomes "10.0", still 4 characters inside a 5-character field, so nothing spills.'],
      a: '%5.1f, seven columns with the unit. Reserve the width for the extremes, not for the typical value.'
    }
  ],
  quiz: [
    { q: 'A display shows "100.0" and the program then prints "99.5" at the same place without clearing or padding. What does it show?', choices: ['99.5', '99.50', '100.5', '9.50'], a: 1, why: 'Four new characters cover the first four old ones and the old final 0 stays: 99.50.' },
    { q: 'What does the format %6.2f print for 1234.56?', choices: ['1234.5', '1234.56 (seven characters, wider than the field)', '######', '1235'], a: 1, why: 'A width is a minimum. printf never cuts a number, so the text is one character wider than the field.' },
    { q: 'What does printf("%.1f", -0.04) print?', choices: ['0.0', '-0.0', '-0.04', '-0.1'], a: 1, why: 'The value is negative, so the sign is printed even though the rounded digits are zero. Round first and test the rounded value.' },
    { q: 'Calling lcd.clear() before each update is the best way to avoid stale digits.', a: false, why: 'Clearing takes about 1.5 ms and blanks the screen, which flickers at fast update rates. Fixed-width, padded text rewrites every character and needs no clear.' }
  ],
  applications: [
    'Temperature, voltage and power readouts that must stay put on a character LCD.',
    'Clocks and timers with leading zeros on seven-segment displays.',
    'Counters and totals that grow by a digit now and then.',
    'Data logger screens that show the same fields for hours.'
  ],
  sources: [
    'The C standard library: formatted output (snprintf) and its conversion specifiers.',
    'Python documentation, *Format Specification Mini-Language*.',
    'Hitachi, *HD44780U datasheet*: execution time of the clear and return-home instructions.'
  ],
  sim: 'ad-format'
},

/* ================================================================ menus-on-small-displays */
{
  id: 'menus-on-small-displays',
  parent: 'alphanumeric-displays',
  title: 'Menus on two lines',
  level: 2,
  short: 'Two lines, three buttons and a handful of settings make a complete interface when it is built as a small state machine: a home screen, a menu, an edit screen, and rules that never change from screen to screen.',
  keywords: ['menu', 'LCD menu', 'state machine', 'three buttons', 'up down ok', 'edit mode', 'idle timeout', 'dirty flag', 'settings', 'user interface', 'encoder', 'navigation', 'home screen', 'redraw'],
  prereq: ['character-lcd', 'buttons-and-switches', 'state-machine-in-code'],
  related: ['debouncing', 'long-press-double-click', 'rotary-encoders', 'encoder-and-button-navigation', 'nvs-and-preferences', 'non-blocking-timing'],
  body: `A two-line display, three buttons (UP, DOWN, OK) and a handful of settings is enough for a complete interface, if it is designed as one rather than grown inside loop(). Settings menus are famous for turning into a thicket of nested ifs, because what a button means depends on where you are. That is exactly the problem a state machine solves ([[state-machine-in-code]]).

### Screens are states

Three screens are three states. **HOME** shows what the user wants all day. **MENU** lets them choose a setting. **EDIT** changes one value. Each button press is an event, and what an event does depends on the state:

- in HOME, OK opens the menu;
- in MENU, UP and DOWN move the selection, OK enters EDIT (or leaves, on the last line);
- in EDIT, UP and DOWN change the value, OK keeps it;
- in MENU or EDIT, ten seconds without a press go back to HOME and drop an unsaved edit.

Draw it as three circles and a few arrows ([[drawing-a-state-diagram]]) before writing any code; the simulation is exactly this picture with the buttons attached.

### Rules that make it pleasant

- **Same button, same meaning.** OK always confirms; going back always means the same thing.
- **Show where you are.** A marker on the selected line; two lines as a window sliding over a longer list.
- **Edit the value, then confirm.** Changes show at once, OK keeps them, idle time cancels.
- **Let a held button repeat**, slowly and then fast ([[long-press-double-click]]).
- **Describe the menu as data.** A table of label, value, minimum and maximum means a new setting is one line, not a new screen.
- **Save on confirm only.** Writing flash on every press wears it out ([[nvs-and-preferences]]).
- **Redraw only when something changed.** A *dirty* flag saves bus time and flicker.
- **Never block.** No delay() in the user-interface path; read the buttons every pass and debounce them ([[debouncing]], [[non-blocking-timing]]).

### Fewer buttons

A rotary encoder gives UP and DOWN by turning and OK by pushing, three buttons in one part ([[rotary-encoders]]). Two buttons force short and long presses. One button is for something very simple.

> [!key] Treat each screen as a state and each press as an event, keep the rules the same on every screen, describe the menu as data, redraw only on change, and save on confirm. Then three buttons and two lines are a real interface.`,
  ideas: [
    'Screens are states and button presses are events; what a press does depends only on the state.',
    'Keep the meaning of OK and back the same on every screen, and show the reader where they are.',
    'Describe the menu as a table of items, and save to flash only when the user confirms.',
    'Redraw only when something changed, and never block the loop while waiting for a button.'
  ],
  pitfalls: [
    'A menu is a pile of if statements per button — That grows without end. A state variable plus a small table of what each event does in each state stays readable and testable.',
    'Save every change to flash as the user edits it — Each press writes flash, which wears out. Keep the edit in RAM and write once when the user confirms.',
    'Redraw the whole screen every pass of loop() — It floods the bus and flickers. Set a dirty flag when state changes and redraw only then.'
  ],
  terms: [
    { term: 'Dirty flag', also: ['redraw flag', 'needs redraw'], def: 'A variable that is set whenever what the screen should show has changed. The loop redraws only when it is set, then clears it.' },
    { term: 'Idle timeout', also: ['inactivity timeout'], def: 'A return to the home screen after a set time with no button press, which also restarts the menu next time from a known place.' },
    { term: 'Edit mode', also: ['value entry'], def: 'The state in which UP and DOWN change a setting\'s value instead of moving between settings. OK keeps the value; leaving by timeout drops it.' }
  ],
  choose: {
    good: ['Settings and readouts on a device with three buttons or an encoder', 'A table-driven menu where settings are added often', 'Any interface that must also be tested without hardware'],
    avoid: ['Deep trees of menus on two lines: three levels is the limit of patience', 'A single button for more than one or two actions', 'Blocking waits for a key in the middle of the loop'],
    check: ['That every state has a way out (back, OK or the timeout)', 'The idle timeout: long enough to read, short enough to be useful', 'That values are written to flash only when confirmed']
  },
  code: [
    {
      title: 'A three-button menu on a 16 × 2 display',
      about: 'HOME shows a set point; OK opens a menu of three settings and Exit; UP and DOWN move or change a value; OK enters, keeps or leaves; ten seconds idle return to HOME. Buttons are debounced, nothing blocks, and the screen is redrawn only when something changed.',
      needs: 'An ESP32 DevKit, a 16 × 2 I2C LCD and three push buttons.',
      wiring: [['GPIO32', 'UP button to GND', 'internal pull-up'], ['GPIO33', 'DOWN button to GND', 'internal pull-up'], ['GPIO25', 'OK button to GND', 'internal pull-up'], ['GPIO21, GPIO22', 'SDA, SCL of the LCD backpack']],
      libs: ['LiquidCrystal_I2C'],
      blocks: `
        when started
          go to state [HOME v] :: state

        when entering state [HOME v]
          show the set point and [OK = menu] on the two lines :: display

        when event [OK v] in state [HOME v]
          set [selected v] to (0)
          go to state [MENU v]

        when entering state [MENU v]
          show (the selected item) on line 1 and (the next item) on line 2 :: display

        when event [UP v] in state [MENU v]
          change [selected v] by (-1)
          go to state [MENU v]

        when event [DOWN v] in state [MENU v]
          change [selected v] by (1)
          go to state [MENU v]

        when event [OK v] in state [MENU v]
          set [edited v] to (the value of the selected item)
          go to state [EDIT v]

        when event [UP v] in state [EDIT v]
          change [edited v] by (1)
          go to state [EDIT v]

        when event [OK v] in state [EDIT v]
          save (edited) as the value of the selected item
          go to state [MENU v]

        when (10) seconds in state [MENU v]
          go to state [HOME v]
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <LiquidCrystal_I2C.h>

        LiquidCrystal_I2C lcd(0x27, 16, 2);

        struct Item { const char *label; int value, lo, hi; };
        Item items[] = {{"Set point", 22, 10, 30}, {"Hysteresis", 1, 0, 5}, {"Brightness", 5, 0, 9}};
        const int N = 3;                    // N settings, and a last line "Exit"

        struct Button { int pin; bool last; uint32_t changed; };
        Button buttons[3] = {{32, HIGH, 0}, {33, HIGH, 0}, {25, HIGH, 0}};   // UP, DOWN, OK: each to GND

        enum Mode { HOME, MENU, EDIT };
        Mode mode = HOME;
        int sel = 0, edited = 0;
        uint32_t lastPress = 0;
        bool dirty = true;                  // redraw only when something changed

        bool pressedOnce(Button &b) {       // true once per press; bounces under 30 ms are ignored
          bool level = digitalRead(b.pin);
          if (level != b.last && millis() - b.changed > 30) {
            b.last = level;
            b.changed = millis();
            return level == LOW;
          }
          return false;
        }

        void line(int row, const char *text) {      // always 16 characters wide: nothing stale is left
          char buf[17];
          snprintf(buf, sizeof(buf), "%-16s", text);
          lcd.setCursor(0, row);
          lcd.print(buf);
        }

        void draw() {
          char t[24];
          if (mode == HOME) {
            snprintf(t, sizeof(t), "Set point %d C", items[0].value);
            line(0, t);
            line(1, "OK = menu");
          } else if (mode == MENU) {
            snprintf(t, sizeof(t), "> %s", sel < N ? items[sel].label : "Exit");
            line(0, t);
            snprintf(t, sizeof(t), "  %s", sel + 1 < N ? items[sel + 1].label : (sel + 1 == N ? "Exit" : ""));
            line(1, t);
          } else {
            line(0, items[sel].label);
            snprintf(t, sizeof(t), "< %d >  OK saves", edited);
            line(1, t);
          }
        }

        void handle(bool up, bool down, bool ok) {
          if (!(up || down || ok)) return;
          lastPress = millis();             // any press restarts the idle timer
          dirty = true;
          if (mode == HOME) {
            if (ok) { mode = MENU; sel = 0; }
          } else if (mode == MENU) {
            if (up && sel > 0) sel--;
            if (down && sel < N) sel++;
            if (ok) {
              if (sel == N) mode = HOME;
              else { mode = EDIT; edited = items[sel].value; }
            }
          } else {                          // EDIT
            if (up && edited < items[sel].hi) edited++;
            if (down && edited > items[sel].lo) edited--;
            if (ok) { items[sel].value = edited; mode = MENU; }   // OK keeps the value
          }
        }

        void setup() {
          Wire.begin(21, 22);
          lcd.init();
          lcd.backlight();
          for (Button &b : buttons) pinMode(b.pin, INPUT_PULLUP);
        }

        void loop() {
          bool up = pressedOnce(buttons[0]), down = pressedOnce(buttons[1]), ok = pressedOnce(buttons[2]);
          handle(up, down, ok);
          if (mode != HOME && millis() - lastPress > 10000) { mode = HOME; dirty = true; }   // idle: leave, dropping an edit
          if (dirty) { draw(); dirty = false; }
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        from i2c_lcd import I2cLcd          # add-on drivers: copy lcd_api.py and i2c_lcd.py to the board
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        lcd = I2cLcd(i2c, 0x27, 2, 16)

        items = [["Set point", 22, 10, 30], ["Hysteresis", 1, 0, 5], ["Brightness", 5, 0, 9]]   # label, value, low, high
        N = len(items)                      # N settings, and a last line "Exit"
        pins = [Pin(p, Pin.IN, Pin.PULL_UP) for p in (32, 33, 25)]   # UP, DOWN, OK: each to GND
        last = [1, 1, 1]
        changed = [0, 0, 0]

        HOME, MENU, EDIT = 0, 1, 2
        mode, sel, edited = HOME, 0, 0
        last_press = time.ticks_ms()
        dirty = True                        # redraw only when something changed

        def pressed_once(i):                # True once per press; bounces under 30 ms are ignored
            level = pins[i].value()
            if level != last[i] and time.ticks_diff(time.ticks_ms(), changed[i]) > 30:
                last[i] = level
                changed[i] = time.ticks_ms()
                return level == 0
            return False

        def line(row, text):                # always 16 characters wide: nothing stale is left
            lcd.move_to(0, row)
            lcd.putstr("{:<16}".format(text)[:16])

        def draw():
            if mode == HOME:
                line(0, "Set point {} C".format(items[0][1]))
                line(1, "OK = menu")
            elif mode == MENU:
                names = [it[0] for it in items] + ["Exit"]
                line(0, "> " + names[sel])
                line(1, "  " + (names[sel + 1] if sel + 1 <= N else ""))
            else:
                line(0, items[sel][0])
                line(1, "< {} >  OK saves".format(edited))

        while True:
            up, down, ok = pressed_once(0), pressed_once(1), pressed_once(2)
            if up or down or ok:
                last_press = time.ticks_ms()    # any press restarts the idle timer
                dirty = True
                if mode == HOME:
                    if ok:
                        mode, sel = MENU, 0
                elif mode == MENU:
                    if up and sel > 0:
                        sel -= 1
                    if down and sel < N:
                        sel += 1
                    if ok:
                        if sel == N:
                            mode = HOME
                        else:
                            mode, edited = EDIT, items[sel][1]
                else:                           # EDIT
                    if up and edited < items[sel][3]:
                        edited += 1
                    if down and edited > items[sel][2]:
                        edited -= 1
                    if ok:
                        items[sel][1] = edited  # OK keeps the value
                        mode = MENU
            if mode != HOME and time.ticks_diff(time.ticks_ms(), last_press) > 10000:
                mode, dirty = HOME, True        # idle: leave, dropping an edit
            if dirty:
                draw()
                dirty = False
            time.sleep_ms(5)
      `,
      notes: ['The blocks show the same machine as a list of events per state; the idle timeout is the last rule.', 'To keep the settings after a restart, write `items` to flash in the OK branch of EDIT only ([[nvs-and-preferences]]).', 'Replace UP and DOWN by the two directions of a rotary encoder and OK by its push button, and nothing else changes.']
    }
  ],
  examples: [
    {
      title: 'Counting the states and the arrows',
      q: 'The menu above has three states. List what OK does in each, and say what would be wrong with a version in which OK did the same thing everywhere.',
      steps: ['HOME: OK opens the MENU.', 'MENU: OK enters EDIT for the selected setting, or goes back to HOME if the line is Exit.', 'EDIT: OK keeps the value and returns to MENU.', 'If OK always did the same thing there would be no way to enter a setting, keep a value and leave in a consistent way: the meaning of a button has to follow the state.'],
      a: 'OK opens, enters or keeps, depending on the state. That is why the state, not the button, is the first thing the program looks at.'
    }
  ],
  quiz: [
    { q: 'In which state should UP change a number?', choices: ['HOME', 'MENU', 'EDIT', 'Every state'], a: 2, why: 'In EDIT, UP and DOWN change the value. In MENU they move the selection, and in HOME they do nothing.' },
    { q: 'Why does the program redraw only when a "dirty" flag is set?', choices: ['The LCD cannot be written twice', 'It saves bus time and avoids flicker', 'The library requires it', 'It makes the buttons faster'], a: 1, why: 'Writing 32 characters over I2C costs about 25 ms. Redrawing only after a change keeps the loop fast and the screen steady.' },
    { q: 'When should a changed set point be written to flash?', choices: ['On every press of UP or DOWN', 'When the user confirms with OK', 'Every second', 'At every start'], a: 1, why: 'Flash wears with each write. Keep the edit in RAM and write once, on confirmation.' },
    { q: 'A rotary encoder with a push button can replace the three buttons of this menu.', a: true, why: 'Turning one way is UP, the other way is DOWN, pushing is OK. The states and events are unchanged; only the source of the events differs.' }
  ],
  applications: [
    'The settings menu of a thermostat, a timer or a charger.',
    'Calibration screens on instruments, where a value is edited and confirmed.',
    'The control panel of a 3D printer or a CNC pendant.',
    'Any small appliance with a display and three buttons.'
  ],
  sources: [
    'Arduino, *LiquidCrystal library reference* (the display calls used here).',
    'Arduino-ESP32 documentation, *Preferences* library: saving settings to flash.',
    'David Harel, *Statecharts: a visual formalism for complex systems* (1987), for the state-machine idea.'
  ],
  sim: 'ad-menu'
},

/* ================================================================ led-matrices */
{
  id: 'led-matrices',
  parent: 'alphanumeric-displays',
  title: 'LED matrices and scrolling text',
  level: 2,
  short: 'An 8 × 8 matrix is 64 dots you can switch; four in a row make a 32 × 8 sign. A MAX7219 per module scans them, text is a font shifted one column at a time, and the supply and the orientation are what go wrong.',
  keywords: ['LED matrix', 'dot matrix', '8x8', 'MAX7219', 'FC-16', 'scrolling text', 'marquee', 'MD_Parola', 'MD_MAX72XX', 'LedControl', 'intensity', 'sign', 'daisy chain', 'font', 'mirrored text', 'WS2812 matrix'],
  prereq: ['tm1637-and-max7219', 'bits-and-bytes', 'spi'],
  related: ['addressable-leds', 'hub75-panels', 'project-matrix-clock', 'pixels-and-framebuffers', 'fonts'],
  body: `An LED matrix is a grid of LEDs, usually 8 × 8, in which every LED is a *dot* you can switch. Put four modules in a row and you have a 32 × 8 sign: scrolling text, a big clock, a level meter, a small animation. The usual module is an 8 × 8 matrix with a MAX7219 behind it, and a chain of four on one board is the "FC-16" module sold everywhere.

### How it is driven

Sixty-four LEDs wired as 8 rows by 8 columns need 16 lines, and the MAX7219 scans them for you: one row at a time, about 800 times a second, from a memory of eight bytes, one per row. You send three signals (DIN, CLK, CS) and write the bytes; the chip does the rest, as in [[tm1637-and-max7219]]. Modules chain by wiring DOUT to the next DIN, and writing a row of a chain means sending one word per chip.

### Text is a font shifted sideways

A classic font is 5 columns wide plus one blank column between letters: **6 columns per character**, so a 32-column sign holds five letters at once. To scroll, shift the picture one column left at each step and add the next column of the message on the right. The speed is columns per second. A 20-character message is 120 columns; at 40 ms per column it takes 4.8 s to pass.

A byte per row is also a drawing: eight bytes are a picture, a smiley or an icon. In LedControl's convention the most significant bit of a row is the leftmost column.

### Brightness and current

The MAX7219 sets the current of each LED with RSET and dims by changing how long each row is lit: 16 steps from 1/32 to 31/32. One module with all 64 LEDs lit at full intensity can draw about 300 mA, so four modules want over an ampere. Feed them from a proper 5 V supply with the ground shared with the ESP, not from the ESP board's regulator. Intensity 4 of 15 is bright indoors at a fraction of the current.

### Mirrored, rotated, upside down

Makers wire the matrix to the chip in different orientations, so text appears mirrored or rotated until the library is told the hardware type (MD_MAX72XX knows FC-16, Parola, generic and others). Pick it first, then fix anything left in software.

### Other matrices

Addressable RGB matrices (WS2812) use one data pin and full colour but 60 mA per LED at white, and their rows run back and forth in a zigzag ([[addressable-leds]]). I2C 8 × 8 backpacks need two pins. Big HUB75 panels are another world ([[hub75-panels]]).

> [!key] An 8 × 8 module is eight bytes scanned by a MAX7219; chains make a sign, and text is a six-column-per-letter font shifted a column at a time. Give it a real 5 V supply, keep the intensity modest, and set the hardware type before debugging mirrored text.`,
  ideas: [
    'A MAX7219 module scans an 8 × 8 matrix from eight row bytes; chains of modules make 32 × 8 signs and wider.',
    'Scrolling text shifts the picture one column at a time; a letter takes six columns of a 5 × 7 font.',
    'A full module can draw about 300 mA, so chains need their own 5 V supply and a modest intensity.',
    'Mirrored or rotated output is a wiring difference between module makers; set the hardware type in the library.'
  ],
  pitfalls: [
    'The ESP32\'s 3.3 V pin can feed four modules — A chain at full brightness takes over an ampere. Use a separate 5 V supply with the ground joined to the ESP.',
    'Text that appears mirrored is a bug in my code — Module makers wire the matrix differently. Choose the right hardware type in the library before touching the code.',
    'All 64 LEDs are lit at once — The chip lights one row at a time about 800 times a second; persistence of vision does the rest. That is also why the current is lower than 64 LEDs\' worth.'
  ],
  terms: [
    { term: 'LED matrix', also: ['dot matrix', '8 × 8 matrix'], def: 'A grid of LEDs, usually 8 rows by 8 columns, wired so that each LED can be switched on its own. Chains of them make signs and big clocks.' },
    { term: 'Scrolling', also: ['marquee', 'ticker'], def: 'Moving a message across a display by shifting the picture one column at a time and adding the next column of the text at the edge.' },
    { term: 'FC-16 module', also: ['MAX7219 matrix module', '4-in-1 matrix module'], def: 'The common board of four 8 × 8 matrices with a MAX7219 each, wired in a chain with one set of connections. Its orientation differs from some other makers\' boards.' },
    { term: 'Row scan', also: ['scan rate'], def: 'The way the MAX7219 lights one row of LEDs at a time, in rapid turn, so that the matrix looks lit all over and draws the current of one row.' }
  ],
  choose: {
    good: ['Scrolling signs, big clocks and level meters', 'Visible-from-afar information with simple shapes', 'Chains of identical modules'],
    avoid: ['Detailed images: eight rows are very few', 'Running chains from the ESP board\'s own regulator', 'Battery use at high intensity'],
    check: ['The module\'s hardware type (FC-16, Parola, generic)', 'The 5 V supply current for the whole chain', 'Whether 3.3 V logic from the ESP is accepted by your modules']
  },
  code: [
    {
      title: 'Scrolling text across four modules',
      about: 'A message scrolls right to left across a chain of four 8 × 8 modules, once after another. The Arduino version uses MD_Parola, which includes a font; the MicroPython version shifts the built-in 8 × 8 font itself.',
      needs: 'An ESP32 DevKit and a 4-in-1 MAX7219 matrix module (FC-16) on its own 5 V supply.',
      wiring: [['GPIO23', 'DIN', 'the default SPI MOSI'], ['GPIO18', 'CLK', 'the default SPI clock'], ['GPIO27', 'CS'], ['5V', 'VCC', 'a supply of at least 1 A, ground shared with the ESP'], ['GND', 'GND']],
      libs: ['MD_Parola', 'MD_MAX72XX'],
      blocks: `
        when started
          start display [MAX7219 matrix, 4 modules v] chip select (27)
          set display brightness (4)
          set [x v] to (32)
        forever
          clear display
          show [Hello, ESP32   ] at x (x) y (0)
          update display
          change [x v] by (-1)
          if <(x) < (-120)> then
            set [x v] to (32)
          end
          wait (0.04) seconds
        end
      `,
      cpp: String.raw`
        #include <MD_Parola.h>
        #include <MD_MAX72xx.h>
        #include <SPI.h>

        const uint8_t MODULES = 4;
        const uint8_t CS_PIN = 27;           // DIN is GPIO23 and CLK is GPIO18: the default SPI pins
        MD_Parola matrix = MD_Parola(MD_MAX72XX::FC16_HW, CS_PIN, MODULES);

        void setup() {
          matrix.begin();
          matrix.setIntensity(4);            // 0 to 15
          matrix.displayScroll("Hello, ESP32   ", PA_LEFT, PA_SCROLL_LEFT, 40);   // text, align, effect, ms per step
        }

        void loop() {
          if (matrix.displayAnimate()) matrix.displayReset();     // true when the text has gone by: start again
        }
      `,
      py: String.raw`
        from machine import Pin, SPI
        import max7219                    # add-on driver: copy max7219.py to the board (micropython-max7219)
        import time

        spi = SPI(2, baudrate=10_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        matrix = max7219.Matrix8x8(spi, Pin(27), 4)      # bus, chip select, number of modules
        matrix.brightness(4)                             # 0 to 15

        text = "Hello, ESP32   "
        width = len(text) * 8                            # the built-in font is 8 dots per character
        while True:
            for x in range(32, -width, -1):              # slide left, one column at a time
                matrix.fill(0)
                matrix.text(text, x, 0, 1)
                matrix.show()
                time.sleep_ms(40)
      `,
      notes: ['MicroPython has no built-in MAX7219 matrix driver: copy `max7219.py` to the board.', 'The two versions use different fonts, so the letters differ slightly in width, but both shift one column every 40 ms.', 'If the text is mirrored or upside down, change the hardware type (`FC16_HW` for Parola, GENERIC_HW and others exist) before anything else.']
    },
    {
      title: 'Drawing one picture: a smiley',
      about: 'Eight bytes, one per row, are a picture. The Arduino version uses LedControl; the MicroPython version writes the 16-bit words itself. The leftmost column is the most significant bit.',
      needs: 'One 8 × 8 MAX7219 matrix module.',
      wiring: [['GPIO23', 'DIN'], ['GPIO18', 'CLK'], ['GPIO27', 'CS'], ['5V', 'VCC'], ['GND', 'GND']],
      libs: ['LedControl (by Eberhard Fahle)'],
      blocks: `
        when started
          start SPI on SCK (18) MOSI (23) chip select (27)
          write register (0x0C) value (1) :: bus
          write register (0x09) value (0) :: bus
          write register (0x0B) value (7) :: bus
          write register (0x0A) value (4) :: bus
          for each [row v] in (0 to 7)
            write register ((row) + (1)) value (item (row) of [smiley bytes v]) :: bus
          end
      `,
      cpp: String.raw`
        #include <LedControl.h>

        LedControl lc(23, 18, 27, 1);        // DIN, CLK, CS, number of modules

        const uint8_t SMILEY[8] = {          // one byte per row, leftmost column = most significant bit
          0b00111100,
          0b01000010,
          0b10100101,
          0b10000001,
          0b10100101,
          0b10011001,
          0b01000010,
          0b00111100
        };

        void setup() {
          lc.shutdown(0, false);             // wake the chip
          lc.setIntensity(0, 4);             // 0 to 15
          lc.clearDisplay(0);
          for (int row = 0; row < 8; row++) lc.setRow(0, row, SMILEY[row]);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin, SPI

        cs = Pin(27, Pin.OUT, value=1)
        spi = SPI(2, baudrate=1_000_000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23), miso=Pin(19))

        def write(register, value):          # one 16-bit word: register address, then data
            cs(0)
            spi.write(bytes([register, value]))
            cs(1)

        SMILEY = [0b00111100, 0b01000010, 0b10100101, 0b10000001,   # one byte per row,
                  0b10100101, 0b10011001, 0b01000010, 0b00111100]   # leftmost column = most significant bit

        write(0x0C, 1)                       # normal operation (the chip powers up in shutdown)
        write(0x09, 0)                       # no decode: each byte is a row of raw dots
        write(0x0B, 7)                       # scan all eight rows
        write(0x0A, 4)                       # intensity, 0 to 15
        write(0x0F, 0)                       # display test off
        for row, bits in enumerate(SMILEY):
            write(row + 1, bits)             # registers 1 to 8 are the rows
      `,
      notes: ['Some modules are mirrored: the picture then comes out reversed left to right. Reverse the bits of each byte, or use the library\'s hardware type.', 'To animate, keep a list of pictures and write one every 200 ms with a non-blocking timer.']
    }
  ],
  examples: [
    {
      title: 'How long does a message take to pass?',
      q: 'A 20-character message in a 5 × 7 font (6 columns per letter) scrolls at 50 ms per column. How long does it take to scroll its whole length past a point?',
      steps: ['The message is $20 \\times 6 = 120$ columns long.', 'At 50 ms per column that is $120 \\times 0.05 = 6$ s.', 'To pass completely across a 32-column sign add another $32 \\times 0.05 = 1.6$ s for the sign\'s own width.'],
      a: 'Six seconds for the message to go by one point, about 7.6 s to clear a 32-column sign. A faster scroll is harder to read.'
    }
  ],
  quiz: [
    { q: 'A 20-character message in a 5 × 7 font (6 columns per character) scrolls at 50 ms per column. How long is the message in time?', choices: ['1 s', '6 s', '12 s', '60 s'], a: 1, why: '20 × 6 = 120 columns, and 120 × 50 ms = 6 s.' },
    { q: 'Four 8 × 8 modules at full brightness can need over an ampere. Where should they get their power?', choices: ['The ESP board\'s 3.3 V pin', 'A separate 5 V supply with the ground joined to the ESP', 'The GPIO pins', 'A coin cell'], a: 1, why: 'The ESP board\'s regulator and pins cannot give an ampere. Give the chain its own 5 V supply and tie the grounds together so the signals have a common reference.' },
    { q: 'Text appears mirrored on a new module. What is the likeliest cause?', choices: ['A broken matrix', 'The module wires the matrix in a different orientation from the one the library assumes', 'The scroll is too fast', 'The supply is too low'], a: 1, why: 'Makers wire the LEDs to the chip in different orders. Choose the library\'s hardware type that matches the module.' },
    { q: 'The MAX7219 lights all 64 LEDs of a module at the same instant.', a: false, why: 'It lights one row at a time, about 800 times a second. Persistence of vision shows all rows, and the current is that of one row at a time.' }
  ],
  applications: [
    'Scrolling message signs and shop displays built from chained modules.',
    'Big clocks and temperature displays with 8-pixel-high digits.',
    'Level meters and spectrum displays on audio projects.',
    'Retro-style game and animation displays on small desks and badges.'
  ],
  sources: [
    'Analog Devices (Maxim Integrated), *MAX7219/MAX7221 datasheet*: scan rate, intensity steps, RSET and the matrix data format.',
    'The documentation of the MD_MAX72XX and MD_Parola Arduino libraries: hardware types and text effects.',
    'The README of the LedControl library: setRow, setLed and the column order.'
  ],
  sim: 'ad-matrix'
}
);
