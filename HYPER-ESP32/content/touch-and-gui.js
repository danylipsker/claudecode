/* HYPER-ESP32 · content/touch-and-gui.js
 *
 * Topic "Touch and GUIs" (branch Displays and GUIs): how a finger becomes a coordinate (resistive and capacitive
 * panels, calibration, rotation), the ideas every GUI shares (widgets, events, screens), LVGL 9 from its drivers to
 * widgets, styles, events and screens, GUI designers, GUIs in MicroPython, presenting data on a screen, the rules of a
 * usable panel, the phone as the display, and navigating without touch. Every page has a small interface to operate in
 * a simulation (a thermostat, a calibration, the LVGL loop, screens, a virtual encoder) and a program in blocks,
 * Arduino C++ and MicroPython where the language can do it.
 */
Hyper.add(
/* ================================================================ resistive touch */
{
  id: 'resistive-touch',
  parent: 'touch-and-gui',
  title: 'Resistive touch',
  level: 1,
  short: 'Two transparent resistive sheets pressed together: where they meet, a voltage says where. Cheap, works with gloves and pens, sees one point, and returns raw numbers that still have to become pixels.',
  keywords: ['resistive touch', 'touch screen', 'XPT2046', 'ADS7843', 'TSC2046', 'four-wire', '4-wire', 'T_IRQ', 'PENIRQ', 'raw touch', 'stylus', 'pressure', 'touch controller', 'CYD', 'Cheap Yellow Display'],
  prereq: ['colour-tft-displays', 'spi', 'electronics:voltage-divider'],
  related: ['capacitive-touch-screens', 'touch-calibration-and-rotation', 'cheap-yellow-display', 'touch-display-boards', 'spi-modes-and-speed', 'the-esp-adc'],
  body: `A resistive touch screen is a sandwich. A rigid base and a flexible, transparent top sheet are each coated on the inside with a thin conductive film, and a scatter of tiny insulating dots keeps the two apart. Press with a finger, a fingernail or a pen and the top sheet bends until the coatings touch. That contact is a switch — and, cleverly, a position sensor as well.

### How a position becomes a voltage

Think of one coated sheet as a flat resistor with an electrode along two opposite edges. Put 3.3 V on one edge and 0 V on the other and the voltage falls evenly across the sheet: a [[electronics:voltage-divider|voltage divider]] the size of the screen. The other sheet is now a probe. Where you press, it touches the first sheet and picks up the voltage at that spot — the same fraction of the supply as the fraction of the way across. An ADC turns that into a number.

For the second coordinate the roles swap: the gradient is put across the other sheet and the first one becomes the probe. A third measurement, between the two sheets, gives the **pressure**: the harder you press, the lower the resistance of the contact. This is the **four-wire** panel, two wires per sheet, found on nearly every low-cost ESP32 display module ([[cheap-yellow-display]], [[touch-display-boards]]).

### The controller

The modules carry a touch controller rather than leaving the ESP32's ADC to do it — almost always the **XPT2046**, which speaks the same commands as TI's ADS7843 family. It has a 12-bit converter, an SPI interface and a *pen interrupt* output that falls when a touch begins. Each reading is a number from 0 to 4095. It is **not** a pixel: the film has dead margins and the electrodes are never perfectly aligned with the picture, so the raw values of a real panel run from roughly 200 to 3900. Turning them into coordinates is [[touch-calibration-and-rotation|calibration]].

The controller's clock is slow, about 2 MHz at most, while the display next to it runs at tens of megahertz. They usually share one SPI bus with separate chip-select lines, and the library changes the clock for each ([[spi-modes-and-speed]]). Read two or three times and keep the result when they agree: the first milliseconds after the sheets meet are noisy.

### Character

- **For:** the cheapest touch there is; works with a glove, a stylus, a pen; unaffected by water or electrical noise.
- **Against:** it needs a real press; the film makes the picture a little dimmer and softer; it wears — makers specify it in the order of a million touches; and it sees exactly **one** point. Two fingers read as a point between them, so there is no pinch and no two-finger gesture.

> [!key] A resistive panel is two resistive sheets pressed together: each coordinate is the voltage of a divider that the finger creates, read as a 12-bit number by a controller on SPI. It works with anything that presses, but sees one point, needs a firm touch and reports raw numbers that must be calibrated.`,
  ideas: [
    'Pressing joins two resistive sheets; the contact point sets a voltage on one sheet that is proportional to where you pressed.',
    'The controller measures X, then Y, then pressure, and reports 12-bit raw numbers over SPI; a pen-interrupt pin says when a touch is there.',
    'Raw numbers are not pixels: the panel has margins and offsets, so every panel needs calibration.',
    'It works with gloves and pens and ignores water, but it sees only one point and needs pressure.'
  ],
  pitfalls: [
    'A resistive panel can do pinch-to-zoom if the library supports it — It cannot. Two touches short the sheets in two places and the controller reports one point somewhere between them.',
    'The touch controller must be on its own SPI bus — It can share the display\'s bus. What it needs is its own chip select and a slow clock while it is selected.',
    'A reading of 0 to 4095 means the touch is somewhere from the left edge to the right edge — The usable range is narrower (about 200 to 3900 is typical), and each panel is different. Calibrate it.'
  ],
  terms: [
    { term: 'Resistive touch screen', also: ['resistive panel'], def: 'Two transparent conductive sheets held apart by tiny spacers. Pressing makes them touch, and the point of contact sets a voltage that is measured to find where. It senses pressure from any object, but only one point at a time.' },
    { term: 'Four-wire panel', also: ['4-wire resistive'], def: 'The common kind of resistive panel: one sheet carries the voltage gradient for X and the other for Y, with two wires each. A reading drives one sheet and probes with the other, then the roles swap.' },
    { term: 'Touch controller', also: ['XPT2046', 'ADS7843', 'TSC2046'], def: 'A small chip that drives the panel, measures it with a 12-bit converter and reports the numbers over SPI. Display modules with resistive touch almost always carry an XPT2046.' },
    { term: 'Raw reading', also: ['raw counts', 'raw touch'], def: 'The number, 0 to 4095 for a 12-bit converter, that the controller reports for one axis. It is proportional to where the finger is, but it is not yet a pixel.' },
    { term: 'Pen interrupt', also: ['PENIRQ', 'T_IRQ'], def: 'An output of the touch controller that goes low while the panel is pressed, so the program can wait for a touch instead of reading all the time.' }
  ],
  choose: {
    good: ['Panels used with gloves, a stylus or a pen', 'A wet, dirty or electrically noisy place', 'The lowest cost, and one finger is enough', 'A fixed panel where calibration once at the factory is fine'],
    avoid: ['Anything that needs pinch, rotate or two-finger scroll', 'A picture that must look bright and sharp through the cover', 'A product that is touched thousands of times a day in the same spot'],
    check: ['Is the controller an XPT2046-class chip with a library for your board?', 'Where does calibration get stored, and how does the user redo it?', 'Is the touch chip-select separate from the display\'s and the clock set for it?']
  },
  formulas: [
    {
      name: 'Where a raw reading is on the glass',
      expr: 'N = 4095 * x / L',
      tex: 'N = 4095\\,\\frac{x}{L}',
      vars: {
        N: { name: 'raw reading', q: 'count', value: 2048, min: 0, max: 4095, tex: 'N' },
        x: { name: 'distance of the finger from the grounded edge', q: 'length', unit: 'mm', value: 28, tex: 'x' },
        L: { name: 'length of the sheet along this axis', q: 'length', unit: 'mm', value: 57, min: 1, tex: 'L' }
      },
      solveFor: 'x',
      note: 'The divider is linear, so a 12-bit reading is proportional to position. The dead margins of a real film are ignored here, which is why a real panel needs calibration. Solve for N to see what the controller should report at a given spot.',
      stories: { x: 'A 2.8 inch panel is {L} long along X, and the controller reports {N} for a touch. How far from the grounded edge is the finger?', N: 'A finger touches {x} from the grounded edge of a {L} sheet. What does a 12-bit controller report?' },
      practice: { unknowns: ['x', 'N'] }
    }
  ],
  examples: [
    {
      title: 'Counts per pixel',
      q: 'A resistive panel reports raw X from 200 to 3900 across a picture 320 pixels wide. How many counts is one pixel, and what does a noise of ±20 counts do to the position?',
      steps: ['The usable range is $3900 - 200 = 3700$ counts for 320 pixels: $3700 / 320 \\approx 11.6$ counts per pixel.', 'A noise of ±20 counts is $20 / 11.6 \\approx 1.7$ pixels either way.', 'So the converter is far finer than the picture — the limit is noise and the finger, not the 12 bits. Averaging three or four readings brings the jitter well under a pixel.'],
      a: 'About 11.6 counts per pixel; ±20 counts of noise moves the point by about ±1.7 pixels until it is averaged.'
    }
  ],
  quiz: [
    { q: 'Two fingers press a resistive panel at the same time, at opposite corners. What does the controller report?', choices: ['Both points', 'One point somewhere between them', 'Nothing at all', 'Only the harder press'], a: 1, why: 'Each contact joins the two sheets, and the probe sheet sees a voltage that mixes the two. The result is a single reading roughly between the touches.' },
    { q: 'A raw X reading from a 12-bit controller is 2048. Where is the finger?', choices: ['At the left edge', 'At the right edge', 'About halfway across the usable area', 'It cannot be told without a pen'], a: 2, why: '2048 is half of 4095, and the reading is proportional to position, so the touch is about halfway — give or take the margins of that particular panel.' },
    { q: 'Which of these works on a resistive panel but not on an ordinary capacitive one?', choices: ['A swipe', 'Pressing with a plastic pen', 'A tap with a bare finger', 'Two-finger pinch'], a: 1, why: 'A resistive panel only needs pressure, so any object works. A capacitive panel needs something conductive near the electrodes, so a plastic pen does nothing.' },
    { q: 'The touch controller and the display cannot share one SPI bus.', a: false, why: 'They can. Each has its own chip-select line, and the library sets the slow clock the XPT2046 needs while it is selected and the fast clock for the display.' }
  ],
  applications: [
    'Low-cost 2.4 to 3.5 inch display modules, including the Cheap Yellow Display, where the touch layer is an XPT2046 on the SPI bus.',
    'Industrial and workshop panels that are used with gloves or a pen.',
    'Test equipment and 3D-printer screens, where cost and robustness matter more than looks.',
    'Outdoor kiosks, where rain makes a capacitive panel see false touches.'
  ],
  sources: [
    'Shenzhen XPTEK, XPT2046 touch screen controller data sheet; Texas Instruments, ADS7843 and TSC2046 data sheets (the same command set).',
    'XPT2046_Touchscreen library documentation (Paul Stoffregen) and the TFT_eSPI touch examples.',
    'The board pages of the catalogue for the ESP32-2432S028R, the CrowPanel HMI displays and the LilyGO T-HMI.'
  ],
  code: [
    {
      title: 'Read the raw touch',
      about: 'Print the raw X, Y and pressure of every touch, about twenty times a second. Touch the corners and the middle and watch which way the numbers move: this is what calibration works from.',
      needs: 'An ESP32 and a display module with a resistive XPT2046 touch layer on the default SPI bus.',
      wiring: [['GPIO18 / GPIO23 / GPIO19', 'T_CLK / T_DIN / T_DO', 'the SPI bus, shared with the display'], ['GPIO33', 'T_CS'], ['GPIO36', 'T_IRQ', 'low while touched; an input-only pin is fine']],
      libs: ['XPT2046_Touchscreen (Paul Stoffregen)'],
      blocks: `
        when started
          start touch [XPT2046 v] :: display
        forever
          if <screen touched?> then
            print (join [raw x ] (join (raw touch [x v]) (join [  y ] (raw touch [y v]))))
          end
          wait (0.05) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <XPT2046_Touchscreen.h>

        const int T_CS = 33;     // chip select of the touch controller
        const int T_IRQ = 36;    // pen interrupt: low while touched

        XPT2046_Touchscreen ts(T_CS, T_IRQ);

        void setup() {
          Serial.begin(115200);
          ts.begin();            // the default SPI bus: SCK 18, MISO 19, MOSI 23
        }

        void loop() {
          if (ts.touched()) {
            TS_Point p = ts.getPoint();    // raw readings 0 to 4095, and the pressure in z
            Serial.printf("raw x %d  y %d  pressure %d\n", p.x, p.y, p.z);
          }
          delay(50);
        }
      `,
      py: String.raw`
        from machine import SPI, Pin
        import time

        spi = SPI(2, baudrate=1000000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))   # the XPT2046 wants 2 MHz or less
        cs = Pin(33, Pin.OUT, value=1)    # chip select of the touch controller
        irq = Pin(36, Pin.IN)             # pen interrupt: low while touched

        def read(cmd):
            # one 12-bit reading: 0xD0 measures X, 0x90 measures Y
            buf = bytearray(3)
            cs(0)
            spi.write_readinto(bytes([cmd, 0, 0]), buf)
            cs(1)
            return ((buf[1] << 8) | buf[2]) >> 3

        while True:
            if irq.value() == 0:
                print("raw x", read(0xD0), " y", read(0x90))
            time.sleep_ms(50)
      `,
      output: `raw x 2011  y 1930  pressure 640
raw x 2015  y 1927  pressure 655`,
      notes: ['The MicroPython version has no pressure value: the controller\'s pressure commands are 0xB0 and 0xC0, and the contact resistance follows from the two readings.', 'Wired on the same bus as the display, the display\'s chip select must be high while the touch is read. Libraries such as TFT_eSPI handle this for you.', 'On an ESP32-S3 or C3 choose the SPI bus number and the pins to suit your board.', 'The [touch tab of the display lab](#/tools/displaylab/touch) draws raw readings against pixels for a virtual panel and writes this program with your numbers.']
    }
  ],
  sim: 'tg-resistive'
},

/* ================================================================ capacitive touch screens */
{
  id: 'capacitive-touch-screens',
  parent: 'touch-and-gui',
  title: 'Capacitive touch screens',
  level: 1,
  short: 'A grid of transparent electrodes under glass feels the field change where a finger is. A controller chip finds the centres of the touches and reports pixels over I2C, with several fingers and no calibration of scale.',
  keywords: ['capacitive touch', 'projected capacitive', 'PCAP', 'mutual capacitance', 'FT6336', 'FT6236', 'FT6206', 'GT911', 'CST816S', 'CST820', 'multi-touch', 'gesture', 'INT pin', 'ghost touch', 'touch controller'],
  prereq: ['resistive-touch', 'i2c', 'electronics:capacitors'],
  related: ['touch-calibration-and-rotation', 'touch-pins', 'touch-display-boards', 'lvgl-display-and-input-drivers', 'i2c-addresses-and-scanning', 'm5-core-controllers'],
  body: `Every phone screen works because you are, electrically, a large grounded bag of salty water. A finger near a conductive electrode changes the **capacitance** there: the electric field between two electrodes leaks into the finger instead of crossing the gap, and a chip measures the drop. Nothing has to bend or be pressed. That is why a feather-light touch works, and a plastic pen does nothing.

### The grid

A **projected-capacitive** screen has transparent electrodes under a glass cover: rows on one layer, columns on another, an insulator between. The controller sends a pulse down one row and measures what arrives on every column, then does the next row. Each crossing is one **mutual-capacitance** measurement; a screen with 15 rows and 25 columns has 375 of them, scanned dozens of times a second. A fingertip over a crossing steals some of the coupling there. The controller keeps a map of the changes, finds the peaks, and works out the centre of each peak by weighing the neighbouring crossings. That interpolation is why electrodes about 5 mm apart can report a position to a fraction of a millimetre, as a pixel coordinate of the panel's own.

### What the ESP sees

The controller does all of that and talks **I2C**, with two extra wires: **INT**, which it pulls low when a new report is ready, and **RST**, which the ESP uses to reset it (on some chips the levels at reset also choose the I2C address). The usual chips on ESP32 boards, from the [board catalogue](#/tools/boards):

| Controller | Address | Points | Found on |
|---|---|---|---|
| FT6336U (also FT6236, FT6206) | 0x38 | 2 | M5Stack Core2 and CoreS3, WT32-SC01 |
| GT911 | 0x5D or 0x14 | up to 5 | Elecrow CrowPanel 5 and 7 inch, large P4 panels |
| CST816S (and the compatible CST820) | 0x15 | 1, plus gestures | Guition JC2432W328, round LilyGO displays |

A report is a handful of bytes: how many touches, and for each an X and a Y. The CST816S also reports a gesture — swipe, single or double tap, long press — decided inside the chip. There is **no scale calibration**: the numbers are the panel's own pixels. You only fix the *orientation* when the picture is rotated ([[touch-calibration-and-rotation]]).

### Limits

- **Water.** Drops and a wet screen change the capacitance too; controllers filter them, and a wet screen can still produce false touches.
- **Gloves.** A thin glove works, a thick one keeps the finger too far from the electrodes unless the chip is tuned for it.
- **Noise.** A noisy charger or an unfiltered supply can add ghost touches; a thick cover glass lowers the sensitivity.
- **Two fingers close together** merge into one blob, which is why pinch needs the fingers apart.

> [!key] A capacitive touch screen scans a grid of electrodes, finds the centre of each finger from the way it weakens the coupling, and reports pixel coordinates over I2C with an INT line. It needs a conductive touch and a clean supply, but it handles several fingers and needs no scale calibration.`,
  ideas: [
    'A finger changes the capacitance between electrodes under the glass; the controller scans every crossing and interpolates the centre of each touch.',
    'The controller reports pixels over I2C and pulls INT low when a report is ready; RST resets it, and for some chips sets its address.',
    'No scale calibration is needed, only the right orientation when the picture is rotated.',
    'Water, thick gloves, supply noise and fingers that are too close are what trouble it.'
  ],
  pitfalls: [
    'Capacitive and resistive screens are two ways of reading the same thing — They sense different physical effects. A capacitive panel feels conductive objects near it and takes no pressure; a resistive one feels pressure from anything.',
    'A capacitive controller reports raw voltages that need calibration — It reports finished pixel coordinates of its own panel. Only the swap and mirror for a rotated picture are needed.',
    'If the I2C scan finds nothing, the wiring is wrong — Many controllers stay silent until the reset pin has been pulsed, and a GT911 answers at 0x5D or 0x14 depending on how INT was held during reset.'
  ],
  terms: [
    { term: 'Projected capacitive touch', also: ['PCAP', 'capacitive touch screen'], def: 'A touch layer made of a grid of transparent electrodes under glass. A conductive object near the surface changes the capacitance there, and a controller chip works out where, from the change at the neighbouring crossings.' },
    { term: 'Mutual capacitance', def: 'The capacitance between a row electrode and a column electrode at a crossing. A finger takes some of the field and lowers it; scanning every crossing gives a map of where the finger is.' },
    { term: 'Multi-touch', also: ['multi-finger touch'], def: 'Reporting several simultaneous touches. Capacitive controllers do it, with a limit of two, five or ten points depending on the chip; resistive panels cannot.' },
    { term: 'INT line', also: ['touch interrupt', 'interrupt pin'], def: 'A wire from the touch controller to the ESP that goes low when a new touch report is ready, so the program reads over I2C only when there is something to read.' },
    { term: 'Gesture', also: ['hardware gesture'], def: 'A swipe, a double tap or a long press recognised by the touch controller itself and reported as a code, rather than worked out by the program from a series of points.' },
    { term: 'Ghost touch', also: ['false touch'], def: 'A touch report with no finger: from water on the glass, a noisy supply or a poorly grounded panel.' }
  ],
  choose: {
    good: ['Anything the public will use: it feels like a phone', 'A bright, sharp picture behind glass', 'Gestures and two-finger zoom', 'A sealed front with no moving layer'],
    avoid: ['Thick gloves or a plastic stylus', 'Rain and splashes without a controller tuned for water', 'A noisy supply or a cheap charger you cannot improve'],
    check: ['Which controller is it, and is there a library for your chip and core?', 'How many touch points and which gestures does the chip give?', 'Are INT and RST wired to pins you can use, and does the board reset the chip at power-up?']
  },
  examples: [
    {
      title: 'How many measurements per second?',
      q: 'A panel has 12 row and 20 column electrodes and is scanned 100 times a second. How many mutual-capacitance measurements is that?',
      steps: ['One scan visits every crossing: $12 \\times 20 = 240$ measurements.', 'At 100 scans a second: $240 \\times 100 = 24\\,000$ measurements a second.', 'The controller then does the peak finding and the interpolation by itself; the ESP32 reads only the finished coordinates, a few bytes at a time.'],
      a: '240 per scan, 24 000 per second, all done inside the controller.'
    }
  ],
  quiz: [
    { q: 'A thermostat panel must work with thick work gloves and in the rain. Which technology is the better place to start?', choices: ['Resistive', 'Projected capacitive', 'Either, they are equal', 'Neither can work'], a: 0, why: 'A resistive panel needs only pressure, so it ignores gloves and water. A capacitive panel needs a conductive finger close to the electrodes and is easily confused by water.' },
    { q: 'Which touch controller reports gestures such as a swipe by itself?', choices: ['XPT2046', 'FT6336U', 'CST816S', 'GT911 with a stylus'], a: 2, why: 'The CST816S recognises swipes, taps and long presses inside the chip and reports a gesture code. The XPT2046 is resistive and gives raw numbers only.' },
    { q: 'A capacitive controller needs the same four-number scale calibration as a resistive one.', a: false, why: 'It reports the panel\'s own pixel coordinates. You only swap or mirror the axes when the picture is rotated.' },
    { q: 'What is the INT line for?', choices: ['It powers the panel', 'It tells the ESP that a new touch report is ready', 'It sets the I2C speed', 'It switches the backlight'], a: 1, why: 'INT goes low when the controller has something to report, so the program (or an interrupt handler) reads over I2C only then.' }
  ],
  applications: [
    'Phones, tablets and the screens of smart-home panels: everything where the screen should feel like a phone.',
    'ESP32 touch computers such as the M5Stack Core2 and CoreS3 and the WT32-SC01 family.',
    'Round smartwatch-style displays with a CST816-type chip, using swipes to move between pages.',
    'Large 5 to 10 inch HMI panels on the ESP32-S3 and ESP32-P4 with a GT911.'
  ],
  sources: [
    'FocalTech FT6x36 and Goodix GT911 programming guides; Hynitron CST816S data sheet (register maps and addresses).',
    'The board pages of the catalogue: M5Stack Core2, WT32-SC01, Elecrow CrowPanel, Guition JC2432W328.',
    'Arduino core documentation for the Wire library (core 3.3) and the MicroPython documentation of machine.I2C.'
  ],
  code: [
    {
      title: 'Read a capacitive touch controller',
      about: 'Read the touch count and the first point from an FT6336-type controller, directly over I2C, and print them. The numbers are pixels of the panel in its own orientation.',
      needs: 'An ESP32 and a display with an FT6206, FT6236 or FT6336 touch controller on I2C.',
      wiring: [['GPIO21', 'touch SDA'], ['GPIO22', 'touch SCL'], ['GPIO4', 'touch RST', 'reset line; INT is not used here']],
      blocks: `
        when started
          set pin (4) as [output v]
          set pin (4) to [LOW v]
          wait (0.01) seconds
          set pin (4) to [HIGH v]
          wait (0.1) seconds
          start I2C on SDA (21) SCL (22)
        forever
          set [data v] to (I2C read (5) bytes from address (0x38) register (0x02))
          set [n v] to ((item (1) of [data v]) mod (16))
          if <(n) > (0)> then
            set [x v] to ((((item (2) of [data v]) mod (16)) * (256)) + (item (3) of [data v]))
            set [y v] to ((((item (4) of [data v]) mod (16)) * (256)) + (item (5) of [data v]))
            print (join [touches ] (join (n) (join [  x ] (join (x) (join [  y ] (y))))))
          end
          wait (0.05) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;   // I2C
        const int RST_PIN = 4;                  // reset line of the touch controller
        const int FT6X36 = 0x38;                // FT6206, FT6236 and FT6336 answer at 0x38

        void setup() {
          Serial.begin(115200);
          pinMode(RST_PIN, OUTPUT);
          digitalWrite(RST_PIN, LOW);           // a short reset pulse wakes the controller
          delay(10);
          digitalWrite(RST_PIN, HIGH);
          delay(100);
          Wire.begin(SDA_PIN, SCL_PIN);
        }

        void loop() {
          Wire.beginTransmission(FT6X36);
          Wire.write(0x02);                     // from register 2: touch count, X high, X low, Y high, Y low
          Wire.endTransmission(false);
          if (Wire.requestFrom(FT6X36, 5) == 5) {
            uint8_t n = Wire.read() & 0x0F;
            uint8_t xh = Wire.read(), xl = Wire.read(), yh = Wire.read(), yl = Wire.read();
            if (n > 0) {
              int x = ((xh & 0x0F) << 8) | xl;
              int y = ((yh & 0x0F) << 8) | yl;
              Serial.printf("touches %d  x %d  y %d\n", n, x, y);
            }
          }
          delay(50);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)   # I2C
        rst = Pin(4, Pin.OUT, value=0)       # reset line of the touch controller
        time.sleep_ms(10)                    # a short reset pulse wakes the controller
        rst.value(1)
        time.sleep_ms(100)
        FT6X36 = 0x38                        # FT6206, FT6236 and FT6336 answer at 0x38

        while True:
            d = i2c.readfrom_mem(FT6X36, 0x02, 5)   # touch count, X high, X low, Y high, Y low
            n = d[0] & 0x0F
            if n:
                x = ((d[1] & 0x0F) << 8) | d[2]
                y = ((d[3] & 0x0F) << 8) | d[4]
                print("touches", n, " x", x, " y", y)
            time.sleep_ms(50)
      `,
      output: `touches 1  x 118  y 204
touches 1  x 121  y 207`,
      notes: ['A GT911 has 16-bit registers and its own address (0x5D or 0x14): use a library for it. A CST816S answers at 0x15 and is read from register 0x01.', 'Polling every 50 ms works for a test. A real program wires INT to a pin and reads only when it falls ([[interrupts]]).', 'If an I2C scan finds nothing, check the reset pulse first ([[i2c-addresses-and-scanning]]).', 'The [display lab](#/tools/displaylab/touch) shows what a capacitive panel reports compared with a resistive one, and how rotation changes it.']
    }
  ],
  sim: 'tg-capacitive'
},

/* ================================================================ calibration and rotation */
{
  id: 'touch-calibration-and-rotation',
  parent: 'touch-and-gui',
  title: 'Calibration and rotation',
  level: 2,
  short: 'Raw touch numbers become pixels through a simple linear map found by touching known points. Rotating the picture changes the map, so every orientation needs its own swap, mirror and calibration.',
  keywords: ['touch calibration', 'calibrate', 'rotation', 'setRotation', 'swap xy', 'mirror', 'flip', 'offset', 'affine', 'raw to pixel', 'touch is mirrored', 'touch is offset', 'calData', 'least squares'],
  prereq: ['resistive-touch', 'capacitive-touch-screens', 'drawing-primitives'],
  related: ['lvgl-display-and-input-drivers', 'nvs-and-preferences', 'hmi-design-rules', 'touch-display-boards', 'colour-tft-displays'],
  body: `You touch the top-left corner and the cursor lands bottom-right. You touch the middle and it lands in the right place, but a little low. Both are the same problem: the numbers the touch layer reports are in the touch layer's world, and the picture is in another. **Calibration** is the map between them.

### The map

For a resistive panel the relation is almost perfectly linear on each axis. Touch two known points — say 20 pixels in from the top-left and bottom-right corners — note the raw readings $r_0$ and $r_1$, and every other touch follows:

$$p = p_0 + (r - r_0)\\,\\frac{p_1 - p_0}{r_1 - r_0}$$

If the raw numbers fall as the finger moves right, $r_1 - r_0$ is negative and the formula mirrors the axis by itself. Do it for X and for Y and you are done — provided the axes are not swapped. The touch sheet and the display are separate parts glued together and they may not even agree on which axis is which. Three or more points, fitted by least squares, also cure a layer that sits slightly tilted. Put targets about a tenth in from the edges; at the very edge the film is least linear and a finger cannot reach exactly.

### Rotation

\`setRotation(1)\` and its equivalents turn the *picture*: the display controller is told to write its memory in another order. The touch layer is glued to the glass and does not move. After a quarter turn the picture's X is the touch layer's Y, and one axis runs backwards. So there are four combinations of **swap** and **mirror**, and a calibration made in one rotation is wrong in the others. A product that lets the user flip the screen — or a stand that can be mounted either way — has to store a calibration per rotation, or recompute from a swap flag and the two corner readings.

A capacitive panel reports pixels of its native orientation already, so it needs no scale — only the same swap and mirror flags for the chosen rotation.

### Doing it in a product

1. Calibrate on first start, or when the stored values are missing: draw a target, wait for a firm press, average several readings, wait for the finger to lift, repeat.
2. Store the numbers in non-volatile memory ([[nvs-and-preferences]]) with the rotation they belong to.
3. Offer a way to redo it — a long press in a corner, a settings entry — because panels age and users swap displays.
4. Check the result: draw a cross where the map says the touch is. If it is off by more than a few pixels, calibrate again with a stylus.

[The touch tab of the display lab](#/tools/displaylab/touch) lets you try raw readings, rotation and calibration on a virtual panel.

> [!key] Calibration maps raw touch numbers to pixels with a line per axis, found by touching known points. Rotating the picture swaps and mirrors the axes, so a calibration belongs to one rotation — store it with the rotation, and let the user redo it.`,
  ideas: [
    'Each axis of a resistive panel maps linearly from raw to pixels; two known touches fix the line, and a negative slope mirrors the axis.',
    'Rotation turns the picture, not the touch layer, so each quarter turn swaps the axes and mirrors one of them.',
    'Capacitive panels need no scale, only the swap and mirror flags for the chosen rotation.',
    'Store the calibration with its rotation in non-volatile memory, and give the user a way to redo it.'
  ],
  pitfalls: [
    'Calibrate once and the numbers hold for ever — They hold for one panel in one rotation. A new display, a different rotation or a worn film needs another calibration.',
    'If the touch is mirrored, flip the picture — Flip the touch map instead. The picture is right; it is the swap or mirror of the touch axes that is wrong.',
    'Put the calibration targets in the very corners — Corners are where the film is least linear and where a finger cannot land exactly. Use targets a tenth of the way in.'
  ],
  terms: [
    { term: 'Touch calibration', also: ['calibrate the touch'], def: 'Finding the numbers that turn the touch controller\'s raw coordinates into pixel coordinates, by touching targets whose pixel positions are known.' },
    { term: 'Axis swap', also: ['swap XY', 'transpose'], def: 'Exchanging the touch X and Y readings, needed when the touch layer\'s horizontal axis is the picture\'s vertical one, as after a quarter-turn rotation.' },
    { term: 'Mirror', also: ['flip', 'invert axis'], def: 'Reversing one axis so that a touch at the left lands at the right, or top for bottom. A negative slope in the calibration map does the same thing.' },
    { term: 'Affine transform', def: 'A map made of a scale, a rotation or tilt, and an offset: x and y each become a weighted sum of the raw x and y plus a constant. Fitting one from three or more touches also corrects a tilted touch layer.' },
    { term: 'Native orientation', def: 'The way round the display controller and the touch controller see the panel before any software rotation. Pictures and touches are both reported in it.' }
  ],
  formulas: [
    {
      name: 'Raw reading to pixel',
      expr: 'p = p0 + (r - r0) * (p1 - p0) / (r1 - r0)',
      tex: 'p = p_0 + (r - r_0)\\,\\frac{p_1 - p_0}{r_1 - r_0}',
      vars: {
        p: { name: 'pixel position', q: 'count', tex: 'p' },
        p0: { name: 'pixel of the first target', q: 'count', value: 20, tex: 'p_0' },
        p1: { name: 'pixel of the second target', q: 'count', value: 300, tex: 'p_1' },
        r: { name: 'raw reading of this touch', q: 'count', value: 2000, signed: true, tex: 'r' },
        r0: { name: 'raw reading at the first target', q: 'count', value: 3600, signed: true, tex: 'r_0' },
        r1: { name: 'raw reading at the second target', q: 'count', value: 450, signed: true, tex: 'r_1' }
      },
      solveFor: 'p',
      note: 'One axis. The example numbers run backwards (the raw value falls as the pixel rises), so the slope is negative and the axis is mirrored without any extra flag. Solve for r to see what the controller reports for a given pixel.',
      stories: { p: 'The first target at pixel {p0} reads {r0} and the second, at pixel {p1}, reads {r1}. A touch reads {r}. Which pixel is that?', r: 'With targets {p0} and {p1} reading {r0} and {r1}, what raw reading does pixel {p} give?' },
      practice: { unknowns: ['p', 'r'] }
    }
  ],
  examples: [
    {
      title: 'A calibration by hand',
      q: 'Targets at X pixels 20 and 300 give raw readings 3600 and 450. A touch reads 2000. Where is it, and is the axis mirrored?',
      steps: ['The raw readings fall as the pixels rise, so the slope is negative: $(300 - 20)/(450 - 3600) = -0.0889$ pixel per count.', 'The touch is $2000 - 3600 = -1600$ counts from the first target: $20 + (-1600)(-0.0889) \\approx 162$.', 'The slope is negative, so the raw axis runs the other way: the formula has mirrored it already, no flag is needed.'],
      a: 'About pixel 162; the raw axis is mirrored, and the formula handles it by itself.'
    }
  ],
  quiz: [
    { q: 'After setRotation(1) the touch lands in the wrong place, as if X and Y had been exchanged. What is the likely cause?', choices: ['The film has worn out', 'The touch axes still use the old swap and mirror', 'The SPI clock is too fast', 'The picture needs a gamma table'], a: 1, why: 'The picture turned, the touch layer did not. The old swap and mirror flags no longer match, so X and Y are exchanged (and one is mirrored).' },
    { q: 'A raw X reading falls from 3600 to 450 as you touch from the left to the right of the picture. What does that tell you?', choices: ['The panel is faulty', 'The raw axis runs the opposite way, so the slope is negative', 'The calibration is impossible', 'The panel is capacitive'], a: 1, why: 'Many panels read high at the left and low at the right. A calibration formula with two points handles this: the slope comes out negative and mirrors the axis.' },
    { q: 'A capacitive panel needs the four-number scale calibration of a resistive one.', a: false, why: 'It reports pixels of its own orientation. Only swap and mirror flags for the rotation are needed.' },
    { q: 'Why put calibration targets a tenth of the way in from the edges?', choices: ['The display is dark at the edges', 'The film is least linear at the edge and a finger cannot hit it exactly', 'Libraries refuse corner points', 'Capacitive panels need it'], a: 1, why: 'Edge effects of the film and the finger\'s size make the very corners the least reliable points; targets slightly inside give a better line across the whole area.' }
  ],
  applications: [
    'Every resistive touch product: a factory or first-start calibration, stored in flash.',
    'Devices with a flip-the-screen setting or a wall-or-desk stand, which need a map for each rotation.',
    'Replacing a display with a similar one: a recalibration saves a call to support.',
    'Touch drawing pads and signature capture, where a few pixels of error are visible.'
  ],
  sources: [
    'TFT_eSPI, the Touch_calibrate example and the setTouch and getTouch functions; the XPT2046_Touchscreen library.',
    'LVGL documentation: input devices, pointer type, and the rotation of a display (version 9).',
    'Any numerical-methods text on least-squares fitting, for the three-point and affine versions.'
  ],
  code: [
    {
      title: 'Calibrate with two touches and keep the result',
      about: 'On first start the program asks for a touch near the top-left and one near the bottom-right of the picture, averages eight readings of each, and stores the four raw numbers. Every later touch is printed as a pixel.',
      needs: 'An ESP32 and a display module with a resistive XPT2046 touch layer (the picture is 320 × 240 and the touch axes are not swapped).',
      wiring: [['GPIO18 / GPIO23 / GPIO19', 'T_CLK / T_DIN / T_DO'], ['GPIO33', 'T_CS'], ['GPIO36', 'T_IRQ']],
      libs: ['XPT2046_Touchscreen (Paul Stoffregen)'],
      blocks: `
        when started
          start touch [XPT2046 v] :: display
          set [r0x v] to (load [r0x])
          if <(r0x) = (0)> then
            print [touch near the top-left target, then lift]
            wait for touch and average (8) readings into [r0x v] [r0y v] :: display
            print [touch near the bottom-right target, then lift]
            wait for touch and average (8) readings into [r1x v] [r1y v] :: display
            save (r0x) as [r0x]
          end
        forever
          if <screen touched?> then
            set [x v] to ((20) + (((raw touch [x v]) - (r0x)) * ((280) / ((r1x) - (r0x)))))
            print (join [pixel x ] (round (x)))
          end
        end
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <XPT2046_Touchscreen.h>
        #include <Preferences.h>

        const int T_CS = 33, T_IRQ = 36;
        const int W = 320, H = 240;       // the picture, after rotation
        const int INSET = 20;             // the two targets sit 20 px inside the corners

        XPT2046_Touchscreen ts(T_CS, T_IRQ);
        Preferences prefs;
        int r0x, r0y, r1x, r1y;           // raw readings at the top-left and bottom-right targets

        void waitTouch(int &rx, int &ry) {          // average of eight readings of one touch
          while (!ts.touched()) delay(10);
          long sx = 0, sy = 0;
          for (int i = 0; i < 8; i++) { TS_Point p = ts.getPoint(); sx += p.x; sy += p.y; delay(10); }
          rx = sx / 8; ry = sy / 8;
          while (ts.touched()) delay(10);           // wait for the finger to lift
        }

        void setup() {
          Serial.begin(115200);
          ts.begin();
          prefs.begin("touch", false);
          r0x = prefs.getInt("r0x", 0);
          if (r0x == 0) {                           // nothing stored yet: calibrate
            Serial.println("Touch the top-left target"); waitTouch(r0x, r0y);
            Serial.println("Touch the bottom-right target"); waitTouch(r1x, r1y);
            prefs.putInt("r0x", r0x); prefs.putInt("r0y", r0y);
            prefs.putInt("r1x", r1x); prefs.putInt("r1y", r1y);
          } else {
            r0y = prefs.getInt("r0y", 0); r1x = prefs.getInt("r1x", 0); r1y = prefs.getInt("r1y", 0);
          }
        }

        void loop() {
          if (ts.touched()) {
            TS_Point p = ts.getPoint();
            // a negative slope mirrors the axis by itself
            int x = INSET + (p.x - r0x) * (W - 2 * INSET) / (r1x - r0x);
            int y = INSET + (p.y - r0y) * (H - 2 * INSET) / (r1y - r0y);
            Serial.printf("pixel x %d  y %d\n", constrain(x, 0, W - 1), constrain(y, 0, H - 1));
          }
          delay(50);
        }
      `,
      py: String.raw`
        from machine import SPI, Pin
        import time, json

        W, H = 320, 240                   # the picture, after rotation
        INSET = 20                        # the two targets sit 20 px inside the corners
        spi = SPI(2, baudrate=1000000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        cs = Pin(33, Pin.OUT, value=1)
        irq = Pin(36, Pin.IN)

        def read(cmd):
            buf = bytearray(3)
            cs(0)
            spi.write_readinto(bytes([cmd, 0, 0]), buf)
            cs(1)
            return ((buf[1] << 8) | buf[2]) >> 3

        def wait_touch():                 # average of eight readings of one touch
            while irq.value():
                time.sleep_ms(10)
            sx = sy = 0
            for _ in range(8):
                sx += read(0xD0); sy += read(0x90)
                time.sleep_ms(10)
            while irq.value() == 0:       # wait for the finger to lift
                time.sleep_ms(10)
            return sx // 8, sy // 8

        try:
            with open("touch.json") as f:
                r0x, r0y, r1x, r1y = json.load(f)
        except OSError:                   # nothing stored yet: calibrate
            print("Touch the top-left target"); r0x, r0y = wait_touch()
            print("Touch the bottom-right target"); r1x, r1y = wait_touch()
            with open("touch.json", "w") as f:
                json.dump([r0x, r0y, r1x, r1y], f)

        while True:
            if irq.value() == 0:
                # a negative slope mirrors the axis by itself
                x = INSET + (read(0xD0) - r0x) * (W - 2 * INSET) // (r1x - r0x)
                y = INSET + (read(0x90) - r0y) * (H - 2 * INSET) // (r1y - r0y)
                print("pixel x", min(W - 1, max(0, x)), " y", min(H - 1, max(0, y)))
            time.sleep_ms(50)
      `,
      output: `Touch the top-left target
Touch the bottom-right target
pixel x 161  y 118`,
      notes: ['The program assumes the touch axes are not swapped. If touching along the picture\'s width changes the raw Y, swap the two readings before mapping.', 'To recalibrate, erase the stored values (a long press, a settings entry, or `prefs.clear()` / deleting touch.json).', 'The block `wait for touch and average …` stands for the waitTouch function of the C++ version.']
    }
  ],
  sim: 'tg-calibration'
},

/* ================================================================ widgets, events, screens */
{
  id: 'gui-concepts',
  parent: 'touch-and-gui',
  title: 'Widgets, events, screens',
  level: 1,
  short: 'Every GUI, from a hand-drawn menu to LVGL, is built from widgets that show and take touches, events that report what happened, a model that holds the truth, and screens that group it all.',
  keywords: ['GUI', 'widget', 'event', 'screen', 'hit test', 'callback', 'immediate mode', 'retained mode', 'dirty rectangle', 'invalidate', 'model view', 'click', 'press', 'release', 'touch handling'],
  prereq: ['resistive-touch', 'capacitive-touch-screens', 'drawing-primitives'],
  related: ['lvgl', 'state-machines', 'hmi-design-rules', 'graphics-libraries', 'delays-and-yielding', 'project-thermostat'],
  body: `Strip away the colours and every interface — a phone app, a washing-machine panel, a game menu — is built from the same four things: **widgets** to show and to touch, **events** that say what happened, a **model** of what the program knows, and **screens** that group widgets. Learn them once and any library, from a hand-written drawing routine to LVGL, is a different spelling of the same ideas.

### Widgets are rectangles with behaviour

A widget is a rectangle on the screen plus a little state — a value, a text, pressed or not, enabled or not — and the code that draws it. A button is a rounded rectangle with a label that looks different while pressed. A slider is a rectangle with a value between two limits. Widgets live in a **tree**: a screen holds a panel, the panel holds a label and two buttons. Move the panel and its children move; hide it and they vanish.

### Events and the hit test

When a finger lands, the library does a **hit test**: which widget is on top at that point? It then reports a short story as events. *Pressed* when the finger lands, *released* when it lifts, *clicked* when it lifted on the same widget it landed on, *value changed* when a slider moved. Your code never asks where the finger is; it says "when this button is clicked, do that". A rotary encoder fits the same model: the focused widget receives "pressed" ([[encoder-and-button-navigation]]).

### Two ways to build it

- **Immediate mode** (the Adafruit GFX style): you draw everything yourself whenever something changes and test touches against rectangles in your own code. Tiny and fine for three buttons — the program below does exactly this.
- **Retained mode** (LVGL and most GUI libraries): you create the widgets once; the library remembers them, redraws only the **dirty rectangles** that changed, and calls your callbacks. It costs memory and pays back in far less code once a screen has a dozen parts.

### Keep the model apart

A common mistake is to let the callback be the program's memory, so that the setpoint of a thermostat exists only as text in a label. Keep values in ordinary variables — the **model**. A callback changes the model; one function refreshes the widgets from it. Then a network message, a sensor and a touch can all change the same value and the screen cannot disagree with the device.

### Rules that bite

- Callbacks run inside the interface's loop: never block in one ([[delays-and-yielding]]).
- Draw only what changed. Pushing the full screen thirty times a second over SPI is the quickest way to a slow device ([[frame-rate-and-bus-speed]]).
- The screens of an interface and the moves between them are a [[state-machines|state machine]]: sketch it on paper first.

> [!key] An interface is a tree of widgets, a hit test that turns a touch into events on the widget under the finger, a model that holds the real values, and screens to group them. Keep the model separate, never block in a callback, and redraw only what changed.`,
  ideas: [
    'A widget is a rectangle with state and a way to draw itself; widgets are arranged in a tree under a screen.',
    'A touch is turned into events by a hit test: pressed, released, clicked, value changed. Your code reacts to events, not to coordinates.',
    'Immediate mode redraws everything by hand; retained mode keeps the widgets and redraws only the dirty rectangles.',
    'Keep the real values in a model and refresh the widgets from it; never block inside a callback.'
  ],
  pitfalls: [
    'Clicked and released mean the same thing — A click needs the press and the release on the same widget. Slide off the button before lifting and it is only a release (LVGL calls the loss of the press PRESS_LOST).',
    'The label of the thermostat is where the setpoint is kept — Then nothing else can change it safely. Store the value in a variable and update the label from it.',
    'A callback may take as long as it likes — The interface does not redraw or read touches while your callback runs. A long job belongs in another task, with the callback only starting it.'
  ],
  terms: [
    { term: 'Widget', also: ['control', 'GUI element', 'object'], def: 'A rectangle on the screen with state and a way to draw itself: a button, label, slider, switch, chart. Widgets are arranged in a tree under a screen.' },
    { term: 'Event', also: ['callback', 'signal'], def: 'A report that something happened to a widget — pressed, released, clicked, value changed — delivered to a function you registered for it.' },
    { term: 'Hit test', also: ['hit testing'], def: 'Finding which widget lies under a point, normally the topmost one. It is how a touch coordinate becomes an event on a widget.' },
    { term: 'Immediate-mode GUI', def: 'An approach with no stored widgets: the program draws everything each time and tests touches against rectangles itself. Simple and small, and the program owns all the logic.' },
    { term: 'Retained-mode GUI', def: 'An approach where widgets are created once and kept by the library, which redraws what changed and calls your callbacks. LVGL works this way.' },
    { term: 'Dirty rectangle', also: ['invalidated area'], def: 'The part of the screen that has changed since it was last drawn. A retained-mode library redraws and sends only the dirty rectangles.' }
  ],
  choose: {
    good: ['Immediate mode for a few fixed buttons on a small screen', 'Retained mode when a screen has many parts, styles or several screens', 'A model plus a refresh function for anything the network can also change'],
    avoid: ['Keeping values only in widgets', 'Long jobs or delay() inside a callback', 'Redrawing the whole screen when one number changed'],
    check: ['Can you sketch the screens and the moves between them on one sheet?', 'Where does each value live, and who may change it?', 'What is the slowest thing a callback does?']
  },
  examples: [
    {
      title: 'Which button gets the click?',
      q: 'Three buttons are 80 pixels wide, with 20-pixel gaps: minus at x 20 to 99, ok at 120 to 199, plus at 220 to 299. A finger lands at x 130, slides to x 235 and lifts there. What events are delivered?',
      steps: ['The hit test at the landing point (x 130) finds ok: it receives PRESSED.', 'The finger moves away; when it lifts at x 235 the hit test finds plus. ok was pressed but is no longer under the finger.', 'A click needs the press and the release on the same widget, so ok gets PRESS_LOST. plus was never pressed, so it gets nothing.'],
      a: 'ok is pressed and then loses the press; nothing is clicked. A slide off a button cancels it.'
    }
  ],
  quiz: [
    { q: 'A finger lands on button A, slides onto button B and lifts there. Which button is clicked?', choices: ['A', 'B', 'Both', 'Neither'], a: 3, why: 'A click needs the press and the release on the same widget. A lost its press when the finger left it, and B was never pressed.' },
    { q: 'Why does a retained-mode library suit a screen of a dozen widgets better than drawing everything by hand?', choices: ['It needs less RAM', 'It remembers the widgets and redraws only the parts that changed', 'It does not need a display driver', 'It works without a clock'], a: 1, why: 'The library keeps the widgets, notices which rectangles changed and draws only those, and it delivers the events. You pay in RAM, and save a lot of code.' },
    { q: 'The setpoint of a thermostat is best kept only in the text of the label that shows it.', a: false, why: 'Then a network message or a sensor cannot change it safely. Keep the value in a variable (the model) and refresh the label from it.' },
    { q: 'A button callback must fetch a web page, which takes three seconds. What is the right design?', choices: ['Do it in the callback; it is simple', 'Make the callback only start the job in another task or set a flag', 'Call delay() so the user sees a pause', 'Disable the screen during the fetch'], a: 1, why: 'The interface does not read the touch or redraw while a callback runs. The callback should hand the job to another task and return at once.' }
  ],
  applications: [
    'Thermostat and heating panels: a setpoint, a current value and a mode, on one or two screens.',
    'Appliance and 3D-printer front panels, where a few large buttons trigger actions.',
    'Handheld instruments and meters with a settings menu and a live display.',
    'Smart-home wall panels that show the state of the house and send commands.'
  ],
  sources: [
    'LVGL documentation: Overview, Widgets and Events (version 9).',
    'Adafruit GFX Library documentation, for the immediate-mode drawing style.',
    'Any UI-toolkit documentation of the event model: the ideas are the same from a phone to an embedded panel.'
  ],
  code: [
    {
      title: 'Widgets as rectangles: press, click and press lost',
      about: 'Three buttons are only a table of rectangles. The program finds the one under the finger, reports PRESSED when the finger lands, and CLICKED or PRESS_LOST when it lifts. No drawing library is needed to see how events work.',
      needs: 'An ESP32 and a resistive XPT2046 display module. The calibration numbers come from the page on calibration.',
      wiring: [['GPIO18 / GPIO23 / GPIO19', 'T_CLK / T_DIN / T_DO'], ['GPIO33', 'T_CS'], ['GPIO36', 'T_IRQ']],
      libs: ['XPT2046_Touchscreen (Paul Stoffregen)'],
      blocks: `
        when started
          start touch [XPT2046 v] :: display
          set [pressed v] to [none]
        forever
          if <screen touched?> then
            set [x v] to (touch x :: display)
            set [y v] to (touch y :: display)
            if <(pressed) = [none]> then
              set [pressed v] to (widget at x (x) y (y) :: display)
              if <not <(pressed) = [none]>> then
                print (join [PRESSED ] (pressed))
              end
            end
          else
            if <not <(pressed) = [none]>> then
              if <(widget at x (x) y (y) :: display) = (pressed)> then
                print (join [CLICKED ] (pressed))
              else
                print (join [PRESS_LOST ] (pressed))
              end
              set [pressed v] to [none]
            end
          end
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <XPT2046_Touchscreen.h>

        const int T_CS = 33, T_IRQ = 36;
        const int W = 320, H = 240;
        const int X_MIN = 3600, X_MAX = 450, Y_MIN = 3500, Y_MAX = 400;   // your calibration

        struct Widget { const char *name; int x, y, w, h; };
        Widget widgets[] = {                // a button is a name and a rectangle
          { "minus",  20, 100, 80, 60 },
          { "ok",    120, 100, 80, 60 },
          { "plus",  220, 100, 80, 60 },
        };
        const int N = sizeof(widgets) / sizeof(widgets[0]);

        XPT2046_Touchscreen ts(T_CS, T_IRQ);
        int pressed = -1;                   // the widget the finger went down on, or -1
        int lastX = 0, lastY = 0;

        int hit(int x, int y) {             // the widget under a point, or -1
          for (int i = N - 1; i >= 0; i--) {          // the last one is on top
            const Widget &w = widgets[i];
            if (x >= w.x && x < w.x + w.w && y >= w.y && y < w.y + w.h) return i;
          }
          return -1;
        }

        void setup() {
          Serial.begin(115200);
          ts.begin();
        }

        void loop() {
          if (ts.touched()) {
            TS_Point p = ts.getPoint();
            lastX = constrain(map(p.x, X_MIN, X_MAX, 0, W - 1), 0, W - 1);
            lastY = constrain(map(p.y, Y_MIN, Y_MAX, 0, H - 1), 0, H - 1);
            if (pressed == -1) {
              pressed = hit(lastX, lastY);
              if (pressed >= 0) Serial.printf("PRESSED %s\n", widgets[pressed].name);
            }
          } else if (pressed != -1) {       // the finger has lifted
            if (hit(lastX, lastY) == pressed) Serial.printf("CLICKED %s\n", widgets[pressed].name);
            else Serial.printf("PRESS_LOST %s\n", widgets[pressed].name);
            pressed = -1;
          }
          delay(20);
        }
      `,
      py: String.raw`
        from machine import SPI, Pin
        import time

        W, H = 320, 240
        X_MIN, X_MAX, Y_MIN, Y_MAX = 3600, 450, 3500, 400     # your calibration
        spi = SPI(2, baudrate=1000000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
        cs = Pin(33, Pin.OUT, value=1)
        irq = Pin(36, Pin.IN)

        widgets = [                         # a button is a name and a rectangle
            ("minus", 20, 100, 80, 60),
            ("ok", 120, 100, 80, 60),
            ("plus", 220, 100, 80, 60),
        ]

        def read(cmd):
            buf = bytearray(3)
            cs(0)
            spi.write_readinto(bytes([cmd, 0, 0]), buf)
            cs(1)
            return ((buf[1] << 8) | buf[2]) >> 3

        def scale(v, a, b, n):
            return min(n - 1, max(0, (v - a) * (n - 1) // (b - a)))

        def hit(x, y):                      # the widget under a point, or None
            for name, wx, wy, ww, wh in reversed(widgets):   # the last one is on top
                if wx <= x < wx + ww and wy <= y < wy + wh:
                    return name
            return None

        pressed = None                      # the widget the finger went down on
        last_x = last_y = 0
        while True:
            if irq.value() == 0:
                last_x = scale(read(0xD0), X_MIN, X_MAX, W)
                last_y = scale(read(0x90), Y_MIN, Y_MAX, H)
                if pressed is None:
                    pressed = hit(last_x, last_y)
                    if pressed:
                        print("PRESSED", pressed)
            elif pressed:                   # the finger has lifted
                print("CLICKED" if hit(last_x, last_y) == pressed else "PRESS_LOST", pressed)
                pressed = None
            time.sleep_ms(20)
      `,
      output: `PRESSED ok
CLICKED ok
PRESSED plus
PRESS_LOST plus`,
      notes: ['There is no drawing here on purpose: the logic is the lesson. The same table can drive a drawing routine that paints each rectangle.', 'A real handler also needs a short debounce and the pressure check of [[resistive-touch]]; libraries do both for you.', 'LVGL does this for a whole tree of widgets, with parents, scrolling and long presses ([[lvgl-events-and-screens]]).', 'Draw the same three buttons by hand in the [drawing tab of the display lab](#/tools/displaylab/draw), or place them in the [GUI designer](#/tools/displaylab/gui) and read the LVGL it writes.']
    }
  ],
  sim: 'tg-thermostat'
},

/* ================================================================ LVGL */
{
  id: 'lvgl',
  parent: 'touch-and-gui',
  title: 'LVGL',
  level: 2,
  short: 'LVGL is the open-source graphics library behind most ESP32 touch interfaces: a tree of widgets, styles, events and animations, drawn into a small buffer and sent to any display. This page is its map; version 9 is the one to learn.',
  keywords: ['LVGL', 'lv_init', 'lv_conf.h', 'lv_timer_handler', 'lv_tick_set_cb', 'lv_display_create', 'lv_screen_active', 'LVGL 9', 'LVGL 8', 'widgets', 'object tree', 'embedded GUI', 'esp_lvgl_port', 'Light and Versatile Graphics Library'],
  prereq: ['gui-concepts', 'graphics-libraries', 'pixels-and-framebuffers'],
  related: ['lvgl-display-and-input-drivers', 'lvgl-widgets', 'lvgl-styles-and-layouts', 'lvgl-events-and-screens', 'gui-designers', 'gui-in-micropython', 'using-psram'],
  body: `LVGL (the Light and Versatile Graphics Library) is a free, open-source GUI library in C, under the MIT licence, that runs on anything from a small microcontroller to a PC. On an ESP32 it is the usual answer to "I want a touch interface that looks like a phone's": buttons, sliders, switches, charts, lists, tab pages, with themes, animations and anti-aliased fonts. It does not know your display or touch controller: you connect them with two small callbacks.

### What you give it, and what it does

LVGL needs four things from your program, each a few lines ([[lvgl-display-and-input-drivers]]):

1. **A display**: its size and a *flush callback* that copies a rectangle of finished pixels to the panel.
2. **A draw buffer**: memory LVGL draws into. It can be a small fraction of the screen.
3. **An input device**: a callback that reports whether, and where, the screen is touched.
4. **A clock**, and a call to \`lv_timer_handler()\` every few milliseconds from the main loop.

The rest happens inside that call: it reads the touch, turns it into events, runs animations and timers, works out which rectangles changed, draws only those into the buffer, and flushes them.

### The object tree

You build the screen as a tree. \`lv_screen_active()\` is the root; \`lv_button_create(parent)\` makes a button inside a parent; \`lv_label_create(button)\` puts a label on it. A style and a layout can be set on any object and are inherited sensibly by its children. This is the retained-mode model of [[gui-concepts]].

### Version 9, and why it matters

Most tutorials still show LVGL 8, and the two do not mix: version 9 replaced the driver structures with display and input *objects* (\`lv_display_create\`, \`lv_indev_create\`) and renamed many functions (\`lv_btn_create\` became \`lv_button_create\`, \`lv_scr_act\` became \`lv_screen_active\`). Code with the old names compiles only against compatibility aliases that the next major version removes. At the time of writing (October 2026) the current release is 9.6, announced as the last of the 9 line, with version 10 in development. Every program in this app uses the 9 names.

### Costs

- **RAM.** LVGL needs tens of kilobytes for its own heap, plus the draw buffer, which is the big item: a tenth of a 320 × 240 screen in RGB565 is 15 KB ([[lvgl-display-and-input-drivers]]). A full frame buffer wants PSRAM ([[using-psram]]).
- **Speed.** The ESP32 draws in software. Pushing a whole 320 × 240 frame over a 40 MHz SPI bus takes about 31 ms at best, so LVGL's habit of sending only what changed is what makes it fast enough.
- **Setup.** \`lv_conf.h\` selects widgets, fonts and memory; the library ships a template; the 14-pixel font is on by default, larger ones must be enabled.

> [!key] LVGL keeps a tree of widgets, redraws only what changed into a small buffer, and sends it through a flush callback you write; touch comes in through a read callback, and one call to lv_timer_handler in the loop drives everything. Use version 9 names throughout.`,
  ideas: [
    'LVGL needs four things from you: a display with a flush callback, a draw buffer, an input callback, and a clock plus a regular call to the timer handler.',
    'You build the screen as a tree of widgets created inside parents; the library handles redrawing and events.',
    'Version 9 replaced the driver structs with display and input objects and renamed many functions; do not mix it with version 8 examples.',
    'The costs are RAM (heap and draw buffer), bus time for each flush, and the settings in lv_conf.h.'
  ],
  pitfalls: [
    'A tutorial that compiles in 2022 will compile now — LVGL 8 code uses driver structs and function names that LVGL 9 renamed or removed. Look for lv_display_create and lv_button_create to know you are reading version 9.',
    'LVGL needs a full-screen frame buffer — It draws into a partial buffer, a tenth of the screen is typical, and sends the finished pieces. A full buffer is an option, for boards with PSRAM.',
    'Call LVGL from any task you like — Its functions are not thread-safe. Use one task for all LVGL calls, or guard every call with a mutex.'
  ],
  terms: [
    { term: 'LVGL', also: ['Light and Versatile Graphics Library'], def: 'A free, open-source embedded GUI library in C. It provides widgets, styles, layouts, events and animations, and draws them into a buffer that your code sends to the display.' },
    { term: 'lv_conf.h', also: ['LVGL configuration'], def: 'The header file that selects LVGL\'s features: which widgets, fonts and drawing options are compiled in, and how much memory it may use. A template ships with the library.' },
    { term: 'Object tree', also: ['widget tree'], def: 'The parent-and-child structure of an LVGL screen: every widget is created inside a parent, inherits some of its styling, and moves and hides with it.' },
    { term: 'Tick', also: ['lv_tick_set_cb'], def: 'LVGL\'s clock: a function that returns milliseconds, which it uses for animations, long-press timing and refresh periods.' },
    { term: 'Timer handler', also: ['lv_timer_handler'], def: 'The one function that does LVGL\'s work: it reads input, runs timers and animations, redraws what changed and flushes it. Call it every few milliseconds, from one task.' },
    { term: 'Display (LVGL)', also: ['lv_display_t'], def: 'LVGL\'s object for a screen: its resolution, colour format, draw buffers and flush callback. Version 9 creates it with lv_display_create.' }
  ],
  choose: {
    good: ['A touch interface with several screens, styles and animations', 'A colour display of 240 × 240 or more, on an ESP32 with enough RAM', 'A product screen that will be redesigned many times'],
    avoid: ['A two-line text readout, where a drawing library or character LCD is plenty', 'A board with very little free RAM', 'Mixing LVGL 8 and 9 code'],
    check: ['Which LVGL major version is the library and are your examples written for it?', 'How big is the draw buffer, and does the RAM allow it?', 'Who calls lv_timer_handler, and from which task?']
  },
  examples: [
    {
      title: 'Will LVGL fit?',
      q: 'A 320 × 240 RGB565 interface uses a draw buffer of a tenth of the screen on a plain ESP32 with 520 KB of SRAM. How big is the buffer, and how much of the SRAM is it?',
      steps: ['A tenth of 240 lines is 24 lines: $320 \\times 24 \\times 2 = 15\\,360$ bytes.', 'That is $15\\,360 / 532\\,480$ of 520 KB, under 3 %.', 'The buffer is small; the LVGL heap (set in the configuration) and the fonts and images in flash are the larger costs, and Wi-Fi needs its share of the RAM too.'],
      a: 'About 15 KB, under 3 % of the SRAM. A full frame buffer (150 KB) would be nearly 30 %.'
    }
  ],
  quiz: [
    { q: 'Which pair of names tells you the code is written for LVGL 9?', choices: ['lv_disp_drv_t and lv_btn_create', 'lv_display_create and lv_button_create', 'lv_scr_act and lv_disp_flush_ready', 'lv_task_handler and lv_tick_inc only'], a: 1, why: 'Version 9 uses display and input objects (lv_display_create) and renamed lv_btn_create to lv_button_create. The other pairs are version 8 names.' },
    { q: 'What does lv_timer_handler do?', choices: ['It only reads the touch', 'It does all of LVGL\'s work: input, events, animations, redraw and flush', 'It starts the Wi-Fi', 'It sets the display brightness'], a: 1, why: 'All of LVGL\'s periodic work happens inside that one call, which is why it has to be called every few milliseconds and from one task.' },
    { q: 'LVGL needs a full-screen frame buffer in RAM.', a: false, why: 'In partial mode it draws into a strip, often a tenth of the screen, and flushes it. A full buffer is an option, usually in PSRAM.' },
    { q: 'Two tasks both call LVGL functions without any lock. What is the risk?', choices: ['None, LVGL is thread-safe', 'Corrupted widget data and crashes that appear at random', 'The display runs faster', 'Only a slower redraw'], a: 1, why: 'LVGL keeps its object tree in shared data structures with no internal locking. Use one task for all calls, or a mutex.' }
  ],
  applications: [
    'Touch interfaces on the Cheap Yellow Display, the M5Stack Core2 and CoreS3, and the LilyGO and Elecrow panels.',
    'Smart-home wall panels and appliance interfaces that need styles, animations and several screens.',
    'Round smartwatch-style interfaces with swipes between pages.',
    'Large HMI panels on the ESP32-S3 and ESP32-P4, drawn from PSRAM.'
  ],
  sources: [
    'LVGL documentation and the LVGL 9 migration guides (the 9.6 release notes mention the removal of the version-8 names in version 10).',
    'Espressif, esp_lvgl_port component documentation.',
    'The LVGL repository: lv_conf template and the Arduino examples.'
  ],
  code: [
    {
      title: 'The smallest LVGL screen: a button that counts',
      about: 'One button with a label in the middle of the screen. Each click raises a counter and rewrites the label. The display, touch and clock are set up by the function of the next page.',
      needs: 'An ESP32 with a TFT and touch (for example an ESP32-2432S028R), the LVGL library 9.x and the display set-up of the next page.',
      libs: ['lvgl (LVGL 9)'],
      blocks: `
        when started
          start LVGL display and touch :: display
          create button [Click me] at x (80) y (95) :: display
        when button [Click me] touched
          change [clicks v] by (1)
          set label of [Click me] to (join [Clicked ] (join (clicks) [ times])) :: display
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>

        void start_display();               // display, touch and tick: the set-up of the next page

        static int clicks = 0;
        static lv_obj_t *label;

        static void on_click(lv_event_t *e) {
          clicks++;
          lv_label_set_text_fmt(label, "Clicked %d times", clicks);
        }

        void setup() {
          start_display();
          lv_obj_t *btn = lv_button_create(lv_screen_active());   // a widget is created inside a parent
          lv_obj_set_size(btn, 160, 50);
          lv_obj_center(btn);
          lv_obj_add_event_cb(btn, on_click, LV_EVENT_CLICKED, nullptr);
          label = lv_label_create(btn);
          lv_label_set_text(label, "Click me");
          lv_obj_center(label);
        }

        void loop() {
          lv_timer_handler();               // LVGL does everything else
          delay(5);
        }
      `,
      py: String.raw`
        import lvgl as lv
        import time

        lv.init()
        # the display and the touch are created here with the drivers of your LVGL firmware build

        clicks = 0

        def on_click(e):
            global clicks
            clicks += 1
            label.set_text("Clicked %d times" % clicks)

        btn = lv.button(lv.screen_active())        # a widget is created inside a parent
        btn.set_size(160, 50)
        btn.center()
        btn.add_event_cb(on_click, lv.EVENT.CLICKED, None)
        label = lv.label(btn)
        label.set_text("Click me")
        label.center()

        while True:
            lv.timer_handler()                     # LVGL does everything else
            time.sleep_ms(5)
      `,
      notes: ['MicroPython: LVGL is not part of the official firmware. It needs a build with the LVGL binding, whose drivers create the display and the touch ([[gui-in-micropython]]).', 'The function start_display is written out on [[lvgl-display-and-input-drivers]].', 'Everything that touches LVGL, including the event callback, must run in the same task that calls lv_timer_handler.']
    }
  ],
  sim: 'tg-lvgl-loop'
},

/* ================================================================ LVGL: display and input drivers */
{
  id: 'lvgl-display-and-input-drivers',
  parent: 'touch-and-gui',
  title: 'LVGL: connecting the display and the touch',
  level: 3,
  short: 'The two callbacks that join LVGL to your hardware: a flush callback that copies finished pixels to the panel, and a read callback that reports the touch. Plus the draw buffer between them, and how big it should be.',
  keywords: ['lv_display_set_flush_cb', 'lv_display_flush_ready', 'lv_display_set_buffers', 'LV_DISPLAY_RENDER_MODE_PARTIAL', 'lv_indev_create', 'lv_indev_set_read_cb', 'lv_tick_set_cb', 'draw buffer', 'flush callback', 'byte swap', 'RGB565', 'TFT_eSPI', 'DMA', 'partial buffer'],
  prereq: ['lvgl', 'colour-tft-displays', 'display-interfaces'],
  related: ['frame-rate-and-bus-speed', 'using-psram', 'mutexes-and-semaphores', 'touch-calibration-and-rotation', 'graphics-libraries', 'gui-in-micropython'],
  body: `LVGL does not know your display. It draws into memory and, when a piece is finished, calls a function **you** wrote and says "put these pixels in this rectangle". The same goes for the touch: every few tens of milliseconds it calls a function of yours and asks "is the screen touched, and where?". Those two callbacks are all the drivers it has.

### The flush callback

\`lv_display_create(w, h)\` makes the display object, \`lv_display_set_color_format\` says the pixels are RGB565 (two bytes), and \`lv_display_set_flush_cb\` names your callback. The callback receives the area (\`x1\`, \`y1\`, \`x2\`, \`y2\`) and \`px_map\`, the pixels. It sets the panel's address window, writes the pixels, and then **must** call \`lv_display_flush_ready(disp)\` — until it does, LVGL does not touch the buffer. With a plain blocking write you call it at the end; with DMA you call it from the "transfer complete" handler, and LVGL draws the next piece while the last one is still on the wire. SPI panels want the two bytes of each pixel swapped: the TFT library's push call can do it, or the callback does.

### The draw buffer

\`lv_display_set_buffers(disp, buf1, buf2, size, mode)\` hands LVGL its working memory. In **partial** mode (\`LV_DISPLAY_RENDER_MODE_PARTIAL\`) the buffer is a strip — typically a tenth of the screen — and a redraw of the whole screen is done in ten flushes. A second buffer lets drawing and sending overlap. **Full** and **direct** modes need a whole-screen buffer, which on the ESP32 means PSRAM ([[using-psram]]) and is how RGB-interface panels are driven. The bigger the buffer, the fewer flushes and the faster the redraw — and the more RAM it takes.

### The input callback and the clock

\`lv_indev_create()\`, then \`lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER)\` and \`lv_indev_set_read_cb\`. Your callback fills \`data->state\` with \`LV_INDEV_STATE_PRESSED\` or \`LV_INDEV_STATE_RELEASED\` and, when pressed, \`data->point.x\` and \`.y\` in screen pixels — the calibrated, rotated coordinates of [[touch-calibration-and-rotation]]. \`lv_tick_set_cb\` gets a function that returns \`millis()\`.

### Threads

LVGL's functions are not thread-safe. Call them all from the one task that runs \`lv_timer_handler()\`, or take a mutex around every call ([[mutexes-and-semaphores]]) — the usual source of a GUI that freezes after an hour.

> [!key] Two callbacks join LVGL to the hardware: the flush callback copies a finished rectangle to the panel and then calls lv_display_flush_ready; the read callback reports pressed or released and the pixel position. Between them sits a draw buffer, often a tenth of the screen, whose size trades RAM against redraw speed.`,
  ideas: [
    'The flush callback receives an area and its pixels, writes them to the panel and must then call lv_display_flush_ready.',
    'The draw buffer is usually a strip of about a tenth of the screen; a redraw takes one flush per strip, and two buffers let drawing overlap sending.',
    'The input callback reports pressed or released and a pixel position that is already calibrated and rotated.',
    'All LVGL calls belong to one task, or behind a mutex.'
  ],
  pitfalls: [
    'The flush callback can return and let LVGL carry on — Only after lv_display_flush_ready. Without it LVGL waits for ever, and the screen shows one strip.',
    'The colours come out wrong, as if red and blue were mixed up, so the display must be broken — It is usually the byte order. RGB565 over SPI wants the two bytes swapped, either by the TFT library or in the flush callback.',
    'A bigger buffer is always better — It is faster up to a point, but RAM is shared with Wi-Fi and everything else; a tenth of the screen is a common balance.'
  ],
  terms: [
    { term: 'Flush callback', also: ['lv_display_set_flush_cb', 'flush_cb'], def: 'The function you give LVGL to copy a finished rectangle of pixels to the display. It must call lv_display_flush_ready when the copy is done.' },
    { term: 'Draw buffer', also: ['render buffer', 'lv_display_set_buffers'], def: 'The memory LVGL draws into before sending. It may be a strip of the screen (partial mode) or the whole screen (full or direct mode).' },
    { term: 'Partial render mode', also: ['LV_DISPLAY_RENDER_MODE_PARTIAL'], def: 'The mode in which LVGL draws into a buffer smaller than the screen and flushes it piece by piece. It saves RAM at the cost of several flushes per redraw.' },
    { term: 'Input device', also: ['indev', 'lv_indev_t'], def: 'LVGL\'s object for a touch screen, a mouse, a keypad or an encoder. A pointer device has a read callback that reports pressed or released and a position.' },
    { term: 'Byte swap', also: ['RGB565 swap'], def: 'Exchanging the two bytes of each 16-bit pixel. A SPI panel expects the high byte first, while the ESP32 stores the low byte first, so one side has to swap.' },
    { term: 'Refresh period', also: ['LV_DEF_REFR_PERIOD'], def: 'How often LVGL redraws what changed: about 33 ms by default, roughly 30 frames a second at most.' }
  ],
  formulas: [
    {
      name: 'Size of the draw buffer',
      expr: 'B = w * lines * bpp / 8',
      tex: 'B = \\frac{w \\cdot \\mathrm{lines} \\cdot \\mathrm{bpp}}{8}',
      vars: {
        B: { name: 'draw buffer', q: 'count', tex: 'B' },
        w: { name: 'width of the screen in pixels', q: 'count', value: 320, min: 1, tex: 'w' },
        lines: { name: 'lines in the buffer', q: 'count', value: 24, min: 1, tex: '\\mathrm{lines}' },
        bpp: { name: 'bits per pixel', q: 'count', value: 16, min: 1, tex: '\\mathrm{bpp}' }
      },
      solveFor: 'B',
      note: 'B is in bytes. A tenth of a 240-line screen is 24 lines. Solve for lines to see how many strips a given amount of RAM buys.',
      stories: { B: 'A {w}-pixel-wide RGB565 screen draws {lines} lines at a time. How many bytes is the buffer?', lines: 'You can spare {B} bytes for the draw buffer of a {w}-pixel-wide screen at {bpp} bits per pixel. How many lines is that?' },
      practice: { unknowns: ['B', 'lines'] }
    },
    {
      name: 'Time to send the whole screen',
      expr: 't = w * h * bpp / f',
      tex: 't = \\frac{w \\cdot h \\cdot \\mathrm{bpp}}{f}',
      vars: {
        t: { name: 'time for one full-screen transfer', q: 'time', unit: 'ms', tex: 't' },
        w: { name: 'width in pixels', q: 'count', value: 320, min: 1, tex: 'w' },
        h: { name: 'height in pixels', q: 'count', value: 240, min: 1, tex: 'h' },
        bpp: { name: 'bits per pixel', q: 'count', value: 16, min: 1, tex: '\\mathrm{bpp}' },
        f: { name: 'SPI clock', q: 'frequency', unit: 'MHz', value: 40, min: 0.001, tex: 'f' }
      },
      solveFor: 't',
      note: 'The best case, with no gaps between bytes and no command overhead. It is the ceiling on the frame rate if the whole screen changes; LVGL sends only the dirty rectangles, which is why it can go much faster on a mostly still screen.',
      stories: { t: 'A {w} × {h} screen at {bpp} bits per pixel is sent over SPI at {f}. How long does a full transfer take?' },
      practice: { unknowns: ['t'] }
    }
  ],
  examples: [
    {
      title: 'How much RAM, how fast?',
      q: 'A 320 × 240 RGB565 screen on an ESP32 with a 40 MHz SPI display. What is a tenth-of-the-screen buffer, and the fastest full redraw?',
      steps: ['A tenth of 240 lines is 24 lines: $320 \\times 24 \\times 2 = 15\\,360$ bytes, about 15 KB — and a second buffer doubles it.', 'The whole frame is $320 \\times 240 \\times 16 = 1\\,228\\,800$ bits; at 40 MHz that is $1\\,228\\,800 / 40\\,000\\,000 \\approx 30.7$ ms.', 'So a full redraw cannot beat about 32 frames a second; a small change (a counter, a needle) sends a few kilobytes and takes a millisecond or two.'],
      a: 'About 15 KB for the buffer; at best 30.7 ms for a whole frame, so roughly 32 full frames a second.'
    }
  ],
  quiz: [
    { q: 'What happens if the flush callback never calls lv_display_flush_ready?', choices: ['LVGL flushes twice', 'LVGL keeps waiting and stops drawing new pieces', 'The display turns off', 'Nothing, it is optional'], a: 1, why: 'LVGL treats the buffer as still in use until it is told the flush is over, so it will not draw the next strip. The screen freezes.' },
    { q: 'A screen shows the right shapes but red and blue are swapped. What is the most likely cause?', choices: ['A broken backlight', 'The RGB565 bytes are in the wrong order for the panel', 'The touch is mirrored', 'The buffer is too small'], a: 1, why: 'Over SPI the high byte of each pixel goes first. If the bytes are not swapped somewhere (TFT library or flush callback) the colour fields are scrambled.' },
    { q: 'Using a draw buffer of a tenth of the screen means a full redraw is sent in ten flushes.', a: true, why: 'In partial mode LVGL draws and flushes one strip at a time. A change of a few widgets touches only the strips (or smaller areas) that contain them.' },
    { q: 'You may call lv_label_set_text from a Wi-Fi callback running in another task.', a: false, why: 'LVGL is not thread-safe. Take a mutex around the call, or send the value to the task that owns LVGL.' }
  ],
  applications: [
    'Any ESP32 touch panel that runs LVGL, with the display and touch drivers you already have.',
    'Boards with PSRAM and an RGB or MIPI panel, using a full-frame buffer and direct mode.',
    'Prototype screens where a fraction-of-the-screen buffer keeps RAM free for Wi-Fi and TLS.',
    'Porting an interface from one panel to another by changing only the two callbacks.'
  ],
  sources: [
    'LVGL documentation: Display, Input devices and Tick interface (version 9).',
    'TFT_eSPI and LovyanGFX documentation for the panel set-up and DMA push functions.',
    'Espressif, esp_lcd and esp_lvgl_port component documentation (for the ESP-IDF route).'
  ],
  code: [
    {
      title: 'LVGL 9 on a TFT with touch, the whole set-up',
      about: 'The smallest complete connection of LVGL to a TFT_eSPI display and its touch layer: tick, display with a 20-line partial buffer, flush callback, input callback, and one button to prove it works.',
      needs: 'An ESP32 and a 320 × 240 ILI9341 display with an XPT2046 touch layer; pins and driver chosen in the TFT_eSPI setup file.',
      libs: ['lvgl (LVGL 9)', 'TFT_eSPI (Bodmer)'],
      blocks: `
        when started
          start display [ILI9341 v] :: display
          start touch [XPT2046 v] :: display
          start LVGL with a partial buffer of (20) lines :: display
          create button [Click me] at x (80) y (95) :: display
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>                           // needs lv_conf.h next to the libraries folder
        #include <TFT_eSPI.h>                       // pins and panel are set in its User_Setup, not here

        static const uint16_t W = 320, H = 240;
        static uint8_t buf[W * 20 * 2];             // RGB565 draw buffer: 20 lines, 2 bytes per pixel
        TFT_eSPI tft;

        static uint32_t my_tick() { return millis(); }

        static void flush_cb(lv_display_t *disp, const lv_area_t *area, uint8_t *px_map) {
          uint32_t w = lv_area_get_width(area), h = lv_area_get_height(area);
          tft.startWrite();
          tft.setAddrWindow(area->x1, area->y1, w, h);
          tft.pushColors((uint16_t *)px_map, w * h, true);   // true: swap the bytes for the SPI panel
          tft.endWrite();
          lv_display_flush_ready(disp);                      // tell LVGL the buffer is free again
        }

        static void touch_cb(lv_indev_t *indev, lv_indev_data_t *data) {
          uint16_t x, y;
          if (tft.getTouch(&x, &y)) { data->state = LV_INDEV_STATE_PRESSED; data->point.x = x; data->point.y = y; }
          else data->state = LV_INDEV_STATE_RELEASED;
        }

        static void on_click(lv_event_t *e) { Serial.println("clicked"); }

        void setup() {
          Serial.begin(115200);
          tft.init();
          tft.setRotation(1);
          uint16_t calData[5] = { 275, 3620, 264, 3532, 1 };   // your numbers, from tft.calibrateTouch()
          tft.setTouch(calData);
          lv_init();
          lv_tick_set_cb(my_tick);
          lv_display_t *disp = lv_display_create(W, H);
          lv_display_set_color_format(disp, LV_COLOR_FORMAT_RGB565);
          lv_display_set_flush_cb(disp, flush_cb);
          lv_display_set_buffers(disp, buf, nullptr, sizeof(buf), LV_DISPLAY_RENDER_MODE_PARTIAL);
          lv_indev_t *indev = lv_indev_create();
          lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER);
          lv_indev_set_read_cb(indev, touch_cb);

          lv_obj_t *btn = lv_button_create(lv_screen_active());
          lv_obj_t *lbl = lv_label_create(btn);
          lv_label_set_text(lbl, "Click me");
          lv_obj_center(btn);
          lv_obj_add_event_cb(btn, on_click, LV_EVENT_CLICKED, nullptr);
        }

        void loop() {
          lv_timer_handler();                       // call every few milliseconds
          delay(5);
        }
      `,
      na: { py: 'MicroPython has no LVGL in its official firmware. With a custom LVGL build the display and touch are created by the build\'s own driver modules, which differ by board: see the page on GUIs in MicroPython for what that looks like.' },
      output: `clicked`,
      notes: ['The touch calls of TFT_eSPI (getTouch, setTouch) exist only when its User_Setup.h defines TOUCH_CS, the chip-select pin of the XPT2046; without that line the sketch does not compile.', 'The numbers in calData are placeholders: run the Touch_calibrate example of TFT_eSPI once and paste its five numbers. The state of TFT_eSPI with newer chips and core 3.x changes: check its issues before you start a project on an ESP32-C6 or P4.', 'The size of the buffer is a trade: 20 lines is about 12.8 KB here; more lines mean fewer flushes per redraw.', 'The ESP-IDF route uses esp_lcd and a port component instead of TFT_eSPI; the two callbacks stay the same.']
    }
  ],
  sim: 'tg-buffers'
},

/* ================================================================ LVGL widgets */
{
  id: 'lvgl-widgets',
  parent: 'touch-and-gui',
  title: 'LVGL widgets',
  level: 2,
  short: 'The widgets that make most panels: label, button, slider, switch, bar, arc, chart and list. What each is for, what it reports, and how an arc becomes a gauge.',
  keywords: ['lv_label_create', 'lv_button_create', 'lv_slider_create', 'lv_arc_create', 'lv_bar_create', 'lv_switch_create', 'lv_checkbox_create', 'lv_chart_create', 'lv_list_create', 'gauge', 'LV_PART_KNOB', 'LV_STATE_CHECKED', 'LV_SYMBOL', 'widget parts', 'widget states'],
  prereq: ['lvgl', 'lvgl-display-and-input-drivers', 'gui-concepts'],
  related: ['lvgl-styles-and-layouts', 'lvgl-events-and-screens', 'presenting-data', 'gui-designers', 'hmi-design-rules'],
  body: `An LVGL screen is made from a handful of widgets, each created with \`lv_xxx_create(parent)\`. Choosing the right one for each value is most of the design; [[presenting-data]] says how to choose, this page says what exists.

### The everyday set

| For | Widget | Created with | Reports |
|---|---|---|---|
| Text, numbers, units | label | \`lv_label_create\` | nothing |
| An action | button | \`lv_button_create\` | CLICKED |
| A value in a range, set by touch | slider | \`lv_slider_create\` | VALUE_CHANGED |
| A value as a dial, or set by a circular drag | arc | \`lv_arc_create\` | VALUE_CHANGED |
| Progress or a level | bar | \`lv_bar_create\` | nothing |
| On or off | switch, checkbox | \`lv_switch_create\`, \`lv_checkbox_create\` | VALUE_CHANGED |
| A trend over time | chart | \`lv_chart_create\` | nothing |
| A menu | list | \`lv_list_create\` and \`lv_list_add_button\` | CLICKED on each entry |

Others exist: drop-down, roller, text area, on-screen keyboard, table, tab view, spinner, LED, image, canvas and scale. A button has no text of its own: you put a label inside it. Version 9 has no separate meter widget; a gauge is an arc (or a scale) with a label.

### Parts and states

A widget is drawn in **parts**. A slider has a main part (the track), an indicator (the filled portion) and a knob: \`LV_PART_MAIN\`, \`LV_PART_INDICATOR\`, \`LV_PART_KNOB\`. Styles are applied to a part ([[lvgl-styles-and-layouts]]). A widget also has **states**: \`LV_STATE_PRESSED\` while a finger is on it, \`LV_STATE_CHECKED\` for a switch that is on, \`LV_STATE_DISABLED\`, \`LV_STATE_FOCUSED\`. The look changes with the state without any code of yours: that is the feedback a press needs ([[hmi-design-rules]]).

### Three recipes

- **A gauge:** make an arc, set its range and value, remove its knob (\`lv_obj_remove_style(arc, NULL, LV_PART_KNOB)\`) and its clickable flag, and put a label in the middle.
- **A trend chart:** \`lv_chart_set_type(chart, LV_CHART_TYPE_LINE)\`, \`lv_chart_set_point_count\`, add a series, then push one value per sample with \`lv_chart_set_next_value\`. The default vertical range is 0 to 100, so scale a raw reading into it first.
- **An icon:** built-in symbols are text. \`LV_SYMBOL_WIFI\` in a label draws the Wi-Fi icon, in the label's colour and size.

### Reading values

A callback for VALUE_CHANGED asks the widget: \`lv_slider_get_value(slider)\`, \`lv_obj_has_state(sw, LV_STATE_CHECKED)\`. Setting a value from the program also raises the event, so a callback that sets the same widget back can loop for ever.

> [!key] Pick the widget for the job: label for text, button for actions, slider or arc to set a value, bar or arc to show one, switch for on and off, chart for a trend, list for a menu. A widget is drawn in parts and changes look with its states, and an arc without its knob is a gauge.`,
  ideas: [
    'Each widget is created inside a parent with lv_xxx_create; a button needs a label inside it for its text.',
    'Sliders, arcs and switches report VALUE_CHANGED; buttons report CLICKED; labels, bars and charts only show.',
    'A widget is drawn in parts (main, indicator, knob) and has states (pressed, checked, disabled, focused) that change its look without code.',
    'An arc with no knob that takes no touch is a gauge; a chart takes one value per sample and defaults to a 0 to 100 range.'
  ],
  pitfalls: [
    'A button has a text property — A button is a plain rectangle. Create a label inside it and set the label\'s text.',
    'A chart plots whatever number you give it — Its default range is 0 to 100. A raw 12-bit reading goes off the top; scale it or set the chart\'s range.',
    'Setting a slider from the program is silent — It raises VALUE_CHANGED like a touch does. A callback that moves another widget which moves the first can loop.'
  ],
  terms: [
    { term: 'Widget part', also: ['LV_PART_MAIN', 'LV_PART_INDICATOR', 'LV_PART_KNOB'], def: 'One of the pieces a widget is drawn from, such as the track, the filled indicator and the knob of a slider. Styles can be set per part.' },
    { term: 'Widget state', also: ['LV_STATE_PRESSED', 'LV_STATE_CHECKED'], def: 'A condition of a widget that changes how it is drawn: pressed, checked, disabled, focused. Styles can be set per state, which gives press feedback for free.' },
    { term: 'Arc', also: ['lv_arc'], def: 'A curved bar with a range and a value. With its knob removed and its touch switched off it is a gauge; with the knob it is a circular slider.' },
    { term: 'Chart series', also: ['lv_chart_add_series'], def: 'One line (or set of bars) on a chart, with a colour. You push values into it, and the chart keeps the last N points.' },
    { term: 'Symbol', also: ['LV_SYMBOL', 'icon font'], def: 'A built-in icon, such as LV_SYMBOL_WIFI, that is drawn as a text character from the symbol font. It takes the colour and size of the label it is in.' }
  ],
  choose: {
    good: ['A slider to set a value by touch, an arc to show one as a dial', 'A switch for two states, a checkbox in a list of options', 'A chart for the last minutes of a reading, a bar for a level'],
    avoid: ['A slider for a value that must be exact: use + and − buttons', 'An arc you can drag by accident when it is only meant to show', 'A chart with no scale or time axis labelled'],
    check: ['Does the value need to be set, or only shown?', 'Is the finger big enough for the slider\'s knob?', 'What range does the chart or bar need, and in which units?']
  },
  examples: [
    {
      title: 'Putting a raw reading on a chart',
      q: 'A chart has its default range of 0 to 100, and you want to plot a 12-bit ADC reading from a light sensor (0 to 4095). What value do you push for a reading of 1024?',
      steps: ['Scale the reading into the range of the chart: $100 \\times 1024 / 4095 \\approx 25$.', 'Push 25 with lv_chart_set_next_value. The chart then draws the point a quarter of the way up.', 'Alternatively set the chart\'s range to 0 to 4095 and push the raw value; the axis labels then show raw counts, which means little to a user. Scaled values in real units are usually better.'],
      a: 'About 25. Scale first, or set a range that matches the data.'
    }
  ],
  quiz: [
    { q: 'You want a speedometer-style dial that only shows a value. Which widget, and what do you change?', choices: ['A button, hide its label', 'An arc, with its knob removed and its touch switched off', 'A bar rotated by 90 degrees', 'A switch'], a: 1, why: 'An arc has a range and a value and is drawn as a curved bar. Removing the knob style and the clickable flag leaves a read-only gauge.' },
    { q: 'Which event does a slider report while it moves?', choices: ['LV_EVENT_CLICKED', 'LV_EVENT_VALUE_CHANGED', 'LV_EVENT_LONG_PRESSED', 'LV_EVENT_SCREEN_LOADED'], a: 1, why: 'Sliders, arcs, switches, checkboxes and lists report a changed value. Buttons report clicks.' },
    { q: 'A button widget has a text property you set directly.', a: false, why: 'A button is just a rectangle. You create a label inside it and set the label\'s text.' },
    { q: 'Which state makes a switch look "on"?', choices: ['LV_STATE_PRESSED', 'LV_STATE_FOCUSED', 'LV_STATE_CHECKED', 'LV_STATE_DISABLED'], a: 2, why: 'A switch (and a checkbox) is on when it has the checked state. Ask with lv_obj_has_state(obj, LV_STATE_CHECKED).' }
  ],
  applications: [
    'Control panels with sliders for brightness, volume or speed and switches for modes.',
    'Dashboards with arc gauges and trend charts for sensor values.',
    'Settings screens made of lists, switches and checkboxes.',
    'Status bars made of labels with built-in symbols for Wi-Fi, battery and alarms.'
  ],
  sources: [
    'LVGL documentation: the widgets section (label, button, slider, arc, bar, switch, checkbox, chart, list), version 9.',
    'LVGL documentation: the Styles overview, parts and states.',
    'LVGL documentation: fonts and the built-in symbols.'
  ],
  code: [
    {
      title: 'A slider that drives a gauge, a label and a chart',
      about: 'Move the slider: the arc gauge and the label follow. Once a second the slider\'s value is added to a line chart. It shows the creating calls, the events and the parts in one screen.',
      needs: 'An ESP32 with a TFT and touch, LVGL 9, and the display set-up of the drivers page.',
      libs: ['lvgl (LVGL 9)'],
      blocks: `
        when started
          start LVGL display and touch :: display
          create slider [level] at x (60) y (200) width (200) range (0) (100) :: display
          create gauge [dial] at x (20) y (20) size (110) range (0) (100) :: display
          create chart [trend] at x (150) y (20) points (30) :: display
        when value written
          set gauge [dial] to (slider [level]) :: display
        every (1) seconds
          add (slider [level]) to chart [trend] :: display
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>

        void start_display();                     // display, touch and tick: see the drivers page

        static lv_obj_t *slider, *arc, *label, *chart;
        static lv_chart_series_t *series;

        static void on_slider(lv_event_t *e) {
          int32_t v = lv_slider_get_value(lv_event_get_target_obj(e));   // 0 to 100
          lv_arc_set_value(arc, v);
          lv_label_set_text_fmt(label, "%d %%", (int)v);
        }

        void setup() {
          start_display();
          lv_obj_t *scr = lv_screen_active();

          slider = lv_slider_create(scr);
          lv_obj_set_size(slider, 200, 16);
          lv_obj_align(slider, LV_ALIGN_BOTTOM_MID, 0, -20);
          lv_obj_add_event_cb(slider, on_slider, LV_EVENT_VALUE_CHANGED, nullptr);

          arc = lv_arc_create(scr);               // used as a gauge: no knob, takes no touch
          lv_obj_set_size(arc, 110, 110);
          lv_arc_set_range(arc, 0, 100);
          lv_obj_remove_style(arc, NULL, LV_PART_KNOB);
          lv_obj_remove_flag(arc, LV_OBJ_FLAG_CLICKABLE);
          lv_obj_align(arc, LV_ALIGN_TOP_LEFT, 20, 20);
          label = lv_label_create(arc);
          lv_label_set_text(label, "0 %");
          lv_obj_center(label);

          chart = lv_chart_create(scr);
          lv_obj_set_size(chart, 150, 100);
          lv_obj_align(chart, LV_ALIGN_TOP_RIGHT, -20, 20);
          lv_chart_set_type(chart, LV_CHART_TYPE_LINE);
          lv_chart_set_point_count(chart, 30);
          series = lv_chart_add_series(chart, lv_color_hex(0x3080FF), LV_CHART_AXIS_PRIMARY_Y);
        }

        void loop() {
          static uint32_t last = 0;
          if (millis() - last >= 1000) {          // once a second: one point on the chart
            last = millis();
            lv_chart_set_next_value(chart, series, lv_slider_get_value(slider));
          }
          lv_timer_handler();
          delay(5);
        }
      `,
      py: String.raw`
        import lvgl as lv
        import time

        lv.init()
        # the display and the touch are created here with the drivers of your LVGL firmware build

        def on_slider(e):
            v = slider.get_value()                # 0 to 100
            arc.set_value(v)
            label.set_text("%d %%" % v)

        scr = lv.screen_active()

        slider = lv.slider(scr)
        slider.set_size(200, 16)
        slider.align(lv.ALIGN.BOTTOM_MID, 0, -20)
        slider.add_event_cb(on_slider, lv.EVENT.VALUE_CHANGED, None)

        arc = lv.arc(scr)                         # used as a gauge: no knob, takes no touch
        arc.set_size(110, 110)
        arc.set_range(0, 100)
        arc.remove_style(None, lv.PART.KNOB)
        arc.remove_flag(lv.obj.FLAG.CLICKABLE)
        arc.align(lv.ALIGN.TOP_LEFT, 20, 20)
        label = lv.label(arc)
        label.set_text("0 %")
        label.center()

        chart = lv.chart(scr)
        chart.set_size(150, 100)
        chart.align(lv.ALIGN.TOP_RIGHT, -20, 20)
        chart.set_type(lv.chart.TYPE.LINE)
        chart.set_point_count(30)
        series = chart.add_series(lv.color_hex(0x3080FF), lv.chart.AXIS.PRIMARY_Y)

        last = time.ticks_ms()
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 1000:   # once a second: one point on the chart
                last = time.ticks_ms()
                chart.set_next_value(series, slider.get_value())
            lv.timer_handler()
            time.sleep_ms(5)
      `,
      notes: ['The chart\'s default range is 0 to 100; with a different range scale the value before it is pushed.', 'MicroPython: needs a firmware built with the LVGL binding ([[gui-in-micropython]]); the enum names follow the C names (lv.PART.KNOB for LV_PART_KNOB).', 'The block names are our teaching notation, not those of one tool.']
    }
  ],
  sim: 'tg-widgets'
},

/* ================================================================ LVGL styles and layouts */
{
  id: 'lvgl-styles-and-layouts',
  parent: 'touch-and-gui',
  title: 'LVGL styles and layouts',
  level: 3,
  short: 'A style is a set of properties you attach to a widget part and state; a layout (flex or grid) places children by rule instead of by pixel. Together they make one interface fit several screens and look the same everywhere.',
  keywords: ['lv_style_t', 'lv_style_init', 'lv_style_set_bg_color', 'lv_obj_add_style', 'LV_STATE_PRESSED', 'selector', 'theme', 'flex', 'lv_obj_set_flex_flow', 'lv_obj_set_flex_align', 'flex grow', 'grid', 'LV_GRID_FR', 'LV_PCT', 'padding', 'radius'],
  prereq: ['lvgl-widgets', 'gui-concepts'],
  related: ['lvgl-events-and-screens', 'gui-designers', 'hmi-design-rules', 'presenting-data'],
  body: `Two things decide how a LVGL interface looks and survives a change of screen: its **styles** and its **layout**. Both are rules instead of numbers, which is the point of them.

### Styles

A style is a bundle of properties — background colour, radius, border, padding, text colour, shadow — held in an \`lv_style_t\`. You initialise it with \`lv_style_init\`, fill it with calls such as \`lv_style_set_bg_color\` and \`lv_style_set_radius\`, and attach it with \`lv_obj_add_style(obj, &style, selector)\`. One style can serve fifty widgets, and changing it changes them all.

The **selector** says where it applies: a part (\`LV_PART_MAIN\`, \`LV_PART_INDICATOR\`), a state (\`LV_STATE_PRESSED\`), or both joined with \`|\`. Attach a darker background with \`LV_STATE_PRESSED\` and a button darkens under the finger; add a style for \`LV_STATE_DISABLED\` and it greys out. When several styles set the same property the more specific selector, and the style added later, wins. A one-off change skips the style object: \`lv_obj_set_style_bg_color(obj, color, selector)\`, a *local style*.

Two traps. LVGL keeps a **pointer** to the style, so an \`lv_style_t\` must be static or global — never a local variable of a function that returns. And colours should come from one place, a handful of styles or a theme, so that a redesign is a five-line change. The built-in **theme** gives every new widget a sensible default look, with a dark variant chosen in the configuration.

### Layouts

Setting each widget with \`lv_obj_set_pos\` works until the next display is a different size. A **flex** layout places the children of a container in a row or column, like a web page:

- \`lv_obj_set_flex_flow(cont, LV_FLEX_FLOW_ROW)\`, or \`LV_FLEX_FLOW_COLUMN\`, or a \`_WRAP\` version that starts a new line when full;
- \`lv_obj_set_flex_align(cont, main, cross, track)\` with \`LV_FLEX_ALIGN_START\`, \`_CENTER\`, \`_END\`, \`_SPACE_BETWEEN\`, \`_SPACE_AROUND\` or \`_SPACE_EVENLY\`;
- \`lv_obj_set_flex_grow(child, 1)\` makes a child take the leftover space; the gap is the container's row and column padding.

A **grid** layout fixes columns and rows: \`lv_obj_set_grid_dsc_array\` with sizes such as \`LV_GRID_FR(1)\` (a share of the free space) or \`LV_GRID_CONTENT\`, then \`lv_obj_set_grid_cell\` per child. Sizes can be percentages (\`LV_PCT(100)\`) or \`LV_SIZE_CONTENT\`, so a card is as wide as its parent and as tall as its text.

> [!key] A style is a set of properties attached to a part and a state; it must outlive the widget and is shared by many. A flex or grid layout places children by rule, with percentages and grow instead of pixels, so one interface fits several screens.`,
  ideas: [
    'A style is a reusable bundle of properties added to a widget with a selector: a part, a state, or both.',
    'A style for LV_STATE_PRESSED gives press feedback with no code; later and more specific styles win.',
    'LVGL keeps a pointer to each style, so it must be static or global.',
    'Flex places children in a row or column with alignment and grow; grid fixes columns and rows; percentages and content sizes make the layout adapt.'
  ],
  pitfalls: [
    'A style may be a local variable of the function that builds the screen — LVGL stores a pointer to it, and after the function returns it points at garbage. Make it static or global.',
    'Absolute positions are the simplest layout — They are, until the display changes size or a text gets longer. Percentages, flex and grid survive both.',
    'A flex row will shrink its children to fit — It will not; children keep their size unless you give one a grow factor. Wrap, or give the main item grow 1.'
  ],
  terms: [
    { term: 'Style', also: ['lv_style_t'], def: 'A set of look properties — colours, radius, border, padding, text — that can be attached to many widgets. LVGL stores a pointer to it, so it must outlive them.' },
    { term: 'Selector', also: ['style selector'], def: 'The part and state a style applies to, such as LV_PART_INDICATOR or LV_STATE_PRESSED, combined with |. It decides where and when the style takes effect.' },
    { term: 'Flex layout', also: ['flexbox'], def: 'A layout that places an object\'s children in a row or column, with alignment, wrapping and a grow factor for children that should take the leftover space.' },
    { term: 'Grid layout', def: 'A layout with fixed columns and rows, sized in pixels, in content, or as fractions of the free space, and children placed in cells.' },
    { term: 'Theme', also: ['default theme'], def: 'A built-in set of styles that gives every new widget a consistent default look. LVGL has a light and a dark variant, and you may add your own styles on top.' },
    { term: 'Local style', def: 'A property set directly on one widget with lv_obj_set_style_..., without a style object. Handy for a one-off change.' }
  ],
  examples: [
    {
      title: 'How wide does the grown item get?',
      q: 'A flex row is 300 pixels wide with no padding and a 10 pixel gap. It holds a button 80 wide, a slider with grow 1, and a second button 80 wide. How wide is the slider?',
      steps: ['The fixed items take $80 + 80 = 160$ px, and the two gaps between three items take $2 \\times 10 = 20$ px.', 'What is left is $300 - 160 - 20 = 120$ px.', 'The one item with a grow factor takes all of it. With two growing items of equal factor they would share it equally.'],
      a: '120 pixels.'
    }
  ],
  quiz: [
    { q: 'Why must an lv_style_t be static or global?', choices: ['It is faster', 'LVGL keeps a pointer to it', 'The compiler requires it', 'Styles cannot be changed otherwise'], a: 1, why: 'The widget refers to the style, it does not copy it. If the style lived on the stack of a function that returned, the pointer would dangle.' },
    { q: 'Which style selector makes a button look different only while it is touched?', choices: ['LV_PART_KNOB', 'LV_STATE_PRESSED', 'LV_STATE_CHECKED', 'LV_PART_MAIN alone'], a: 1, why: 'LV_STATE_PRESSED applies while a finger is on the widget. LV_PART_MAIN alone applies in every state.' },
    { q: 'A layout of pixel positions made for a 320 × 240 panel will adapt itself to a 480 × 320 panel.', a: false, why: 'Absolute positions stay where they are. Percentages, flex and grid let the layout follow the size of the screen.' },
    { q: 'Three buttons should be spread evenly with equal space around each, ends included. Which flex alignment?', choices: ['LV_FLEX_ALIGN_START', 'LV_FLEX_ALIGN_CENTER', 'LV_FLEX_ALIGN_SPACE_EVENLY', 'LV_FLEX_ALIGN_END'], a: 2, why: 'SPACE_EVENLY divides the free space into equal gaps, including those before the first and after the last item.' }
  ],
  applications: [
    'A consistent look for a whole product: cards, buttons and text styles defined once.',
    'Press feedback on every button with one style for the pressed state.',
    'The same interface on a 240 × 320 and a 480 × 320 panel, with percentages and flex.',
    'A dark theme for a bedside display and a light one for a workshop, by switching styles.'
  ],
  sources: [
    'LVGL documentation: Styles, Flex layout, Grid layout and Themes (version 9).',
    'The CSS Flexible Box Layout specification, whose model LVGL\'s flex layout follows.',
    'LVGL example programs for styles and layouts, in the library repository.'
  ],
  code: [
    {
      title: 'Cards in a column with one shared style',
      about: 'Three room cards in a flex column. One style gives every card its colour, corners and padding; each card is a flex row with the name on the left and the value on the right.',
      needs: 'An ESP32 with a TFT and touch, LVGL 9, and the display set-up of the drivers page.',
      libs: ['lvgl (LVGL 9)'],
      blocks: `
        when started
          start LVGL display and touch :: display
          define card style [dark panel, radius 10, padding 10] :: display
          create column container [rooms] with gap (8) :: display
          for each [room v] in (list [Living room] [Kitchen] [Bedroom])
            create card row in [rooms] with style [card] :: display
            add label (room) at left and value at right :: display
          end
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>

        void start_display();                    // display, touch and tick: see the drivers page

        static lv_style_t card;                  // a style must outlive the widgets: static or global

        void setup() {
          start_display();

          lv_style_init(&card);
          lv_style_set_bg_color(&card, lv_color_hex(0x1B2434));
          lv_style_set_radius(&card, 10);
          lv_style_set_border_width(&card, 0);
          lv_style_set_pad_all(&card, 10);

          lv_obj_t *col = lv_obj_create(lv_screen_active());    // a plain container
          lv_obj_set_size(col, LV_PCT(100), LV_PCT(100));
          lv_obj_set_flex_flow(col, LV_FLEX_FLOW_COLUMN);
          lv_obj_set_flex_align(col, LV_FLEX_ALIGN_START, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);
          lv_obj_set_style_pad_row(col, 8, 0);                  // the gap between the cards

          const char *names[] = { "Living room", "Kitchen", "Bedroom" };
          const char *values[] = { "21.5 C", "22.0 C", "19.5 C" };
          for (int i = 0; i < 3; i++) {
            lv_obj_t *row = lv_obj_create(col);
            lv_obj_add_style(row, &card, 0);
            lv_obj_set_size(row, LV_PCT(100), LV_SIZE_CONTENT);
            lv_obj_set_flex_flow(row, LV_FLEX_FLOW_ROW);
            lv_obj_set_flex_align(row, LV_FLEX_ALIGN_SPACE_BETWEEN, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);
            lv_label_set_text(lv_label_create(row), names[i]);
            lv_label_set_text(lv_label_create(row), values[i]);
          }
        }

        void loop() {
          lv_timer_handler();
          delay(5);
        }
      `,
      py: String.raw`
        import lvgl as lv
        import time

        lv.init()
        # the display and the touch are created here with the drivers of your LVGL firmware build

        card = lv.style_t()                      # a style must outlive the widgets: keep it in a variable
        card.init()
        card.set_bg_color(lv.color_hex(0x1B2434))
        card.set_radius(10)
        card.set_border_width(0)
        card.set_pad_all(10)

        col = lv.obj(lv.screen_active())         # a plain container
        col.set_size(lv.pct(100), lv.pct(100))
        col.set_flex_flow(lv.FLEX_FLOW.COLUMN)
        col.set_flex_align(lv.FLEX_ALIGN.START, lv.FLEX_ALIGN.CENTER, lv.FLEX_ALIGN.CENTER)
        col.set_style_pad_row(8, 0)              # the gap between the cards

        names = ("Living room", "Kitchen", "Bedroom")
        values = ("21.5 C", "22.0 C", "19.5 C")
        for name, value in zip(names, values):
            row = lv.obj(col)
            row.add_style(card, 0)
            row.set_size(lv.pct(100), lv.SIZE_CONTENT)
            row.set_flex_flow(lv.FLEX_FLOW.ROW)
            row.set_flex_align(lv.FLEX_ALIGN.SPACE_BETWEEN, lv.FLEX_ALIGN.CENTER, lv.FLEX_ALIGN.CENTER)
            lv.label(row).set_text(name)
            lv.label(row).set_text(value)

        while True:
            lv.timer_handler()
            time.sleep_ms(5)
      `,
      notes: ['The default font has no characters beyond ASCII, the degree sign and the built-in symbols; write "C" or add a font that has what you need ([[fonts]]).', 'Try LV_FLEX_ALIGN_CENTER for the main axis, or flex grow on a label, to see how the rows re-flow.', 'MicroPython: needs a firmware built with the LVGL binding ([[gui-in-micropython]]).']
    }
  ],
  sim: 'tg-layout'
},

/* ================================================================ LVGL events and screens */
{
  id: 'lvgl-events-and-screens',
  parent: 'touch-and-gui',
  title: 'LVGL events and screens',
  level: 3,
  short: 'A touch becomes a short story of events — pressed, released, clicked, long-pressed, value changed — delivered to callbacks; a product is a handful of screens loaded and left. How both work in LVGL 9, and what a callback must never do.',
  keywords: ['lv_obj_add_event_cb', 'lv_event_get_code', 'lv_event_get_target_obj', 'lv_event_get_user_data', 'LV_EVENT_CLICKED', 'LV_EVENT_PRESSED', 'LV_EVENT_LONG_PRESSED', 'LV_EVENT_PRESS_LOST', 'LV_EVENT_VALUE_CHANGED', 'event bubbling', 'lv_screen_load', 'lv_screen_load_anim', 'screens', 'navigation', 'back button'],
  prereq: ['lvgl-widgets', 'gui-concepts', 'state-machines'],
  related: ['lvgl-styles-and-layouts', 'encoder-and-button-navigation', 'hmi-design-rules', 'mutexes-and-semaphores', 'gui-designers'],
  body: `Every widget can tell you what happened to it. You register a function with \`lv_obj_add_event_cb(obj, callback, code, user_data)\`, and LVGL calls it when that kind of event reaches the widget. The callback receives an \`lv_event_t\`, and from it \`lv_event_get_code(e)\` (what happened), \`lv_event_get_target_obj(e)\` (to which widget) and \`lv_event_get_user_data(e)\` (whatever you handed over when registering — a screen, a name, a struct).

### The events of a finger

A touch produces a sequence you can follow in the simulation below:

| Event | When |
|---|---|
| \`LV_EVENT_PRESSED\` | the finger lands on the widget |
| \`LV_EVENT_LONG_PRESSED\` | still down after 400 ms by default, without moving |
| \`LV_EVENT_RELEASED\` | the finger lifts |
| \`LV_EVENT_CLICKED\` | lifted on the widget it landed on, without a drag |
| \`LV_EVENT_PRESS_LOST\` | the finger slid off before lifting |
| \`LV_EVENT_VALUE_CHANGED\` | a slider, switch, arc or list changed its value |

Moving more than about 10 pixels is a drag: it scrolls a scrollable container and cancels the click. \`LV_EVENT_FOCUSED\` and its pair belong to keypads and encoders ([[encoder-and-button-navigation]]). If a child does not handle an event you can let its parent see it with the flag \`LV_OBJ_FLAG_EVENT_BUBBLE\`: one callback on a row of buttons serves them all. The program can raise an event itself with \`lv_obj_send_event\`.

### The one rule

A callback runs inside \`lv_timer_handler()\`. While it runs LVGL reads no touch and draws nothing. Change the model, change some widgets, return. A request that takes a second belongs to another task, which hands the result back through a queue to the task that owns LVGL ([[mutexes-and-semaphores]]).

### Screens

A screen is an object with no parent: \`lv_obj_create(NULL)\`. \`lv_screen_active()\` is the one showing; \`lv_screen_load(screen)\` switches to another, and \`lv_screen_load_anim\` does it with a slide or a fade. Screens raise load and unload events, which is the place to start and stop a chart's data or a camera preview.

Two ways to manage them. **Create once, keep:** all screens are built at start-up and loaded by pointer — fast and simple, but every screen stays in RAM. **Create on demand:** build a screen when it is opened and delete it (\`lv_obj_delete\`, or the auto-delete option of the animated load) when it is left — slower to open, much less RAM. Screens and the moves between them are a small state machine ([[state-machines]]): a *Back* button needs a stack, or a parent for each screen.

> [!key] A touch arrives as pressed, long-pressed, released, clicked or press-lost, and a changed value as value-changed; register callbacks with lv_obj_add_event_cb and pass what they need as user data. Never block in a callback. Screens are parentless objects switched with lv_screen_load; keep them or build them on demand.`,
  ideas: [
    'A callback is registered per widget and event code, and receives the code, the target widget and your user data.',
    'A click is pressed and released on the same widget without a drag; sliding off gives press-lost, holding 400 ms gives long-pressed.',
    'A callback runs inside the timer handler, so it must be short; long work goes to another task.',
    'Screens are parentless objects loaded with lv_screen_load; keep them all, or create and delete them as they are used.'
  ],
  pitfalls: [
    'Use PRESSED for a button, it is quicker — The control then fires on a touch the user may be about to cancel. Use CLICKED for actions; the user can slide off to abort.',
    'A callback can do a quick HTTP request — Nothing is read or drawn until it returns. Hand the job to another task and return at once.',
    'A screen is deleted when I load another — It is not, unless you ask. Screens you never delete stay in RAM; delete them or choose the auto-delete option for on-demand screens.'
  ],
  terms: [
    { term: 'Event callback', also: ['lv_obj_add_event_cb', 'event handler'], def: 'A function registered for a widget and an event code. LVGL calls it, with an event object, when that event reaches the widget.' },
    { term: 'Event bubbling', also: ['LV_OBJ_FLAG_EVENT_BUBBLE'], def: 'Passing an event on to the parent widget when the child does not consume it, so one callback on a container can handle all its children.' },
    { term: 'User data', also: ['lv_event_get_user_data'], def: 'A pointer you give when registering a callback and get back inside it: a screen to load, a name, a struct. It lets one function serve many widgets.' },
    { term: 'Screen', also: ['lv_screen_load', 'page'], def: 'A top-level object with no parent that holds a whole page of widgets. One screen is active at a time, and lv_screen_load makes another the active one.' },
    { term: 'Long press', also: ['LV_EVENT_LONG_PRESSED'], def: 'A touch that stays on a widget, without moving, longer than a set time (400 ms by default). Often used for a secondary action or for confirmation.' }
  ],
  examples: [
    {
      title: 'What does the log say?',
      q: 'A finger lands on the Settings button, stays 0.6 s, and lifts without moving. Which events does the button get, in order?',
      steps: ['The landing gives PRESSED.', 'At 0.4 s, still down and not moving, LONG_PRESSED is raised.', 'On lifting: RELEASED, and then CLICKED, because the release is on the same widget and there was no drag.'],
      a: 'PRESSED, LONG_PRESSED, RELEASED, CLICKED. If the action should not fire after a long press, check for LONG_PRESSED first.'
    }
  ],
  quiz: [
    { q: 'A finger lands on a button, slides off it and lifts elsewhere. Which event does the button get at the end?', choices: ['CLICKED', 'PRESS_LOST', 'VALUE_CHANGED', 'Nothing'], a: 1, why: 'The press was lost when the finger left the widget; a click needs the release on the same widget.' },
    { q: 'Why should a callback be short?', choices: ['The compiler limits its size', 'LVGL reads no touch and draws nothing while a callback runs', 'Callbacks use the display bus', 'Short code uses less flash'], a: 1, why: 'Callbacks are called from lv_timer_handler. Anything slow inside one freezes the interface for as long as it takes.' },
    { q: 'lv_screen_load deletes the screen that was showing.', a: false, why: 'The old screen stays in memory. Delete it yourself, or load with the animated call and its auto-delete option, if you build screens on demand.' },
    { q: 'You want one callback for ten buttons that each load a different screen. How?', choices: ['Write ten callbacks', 'Pass the screen as user data and read it with lv_event_get_user_data', 'Use global variables only', 'It is not possible'], a: 1, why: 'User data lets one function serve many widgets: each button is registered with its own target screen as the pointer.' }
  ],
  applications: [
    'Settings and menu structures with a Back button, built as a handful of screens.',
    'A press-and-hold to confirm a destructive action such as erasing a log.',
    'Widgets that start and stop a data feed when their screen is shown and left.',
    'One callback on a container that handles every button of a keypad.'
  ],
  sources: [
    'LVGL documentation: Events, Screens and Input devices (version 9).',
    'LVGL migration guide from 8 to 9, for the renamed event and screen functions.',
    'Your own state diagram: the screens of a product are a state machine.'
  ],
  code: [
    {
      title: 'Two screens and a switch',
      about: 'A home screen with a button that opens the settings screen, and a settings screen with a Wi-Fi switch and a Back button. One callback serves both buttons: the screen to load travels as user data.',
      needs: 'An ESP32 with a TFT and touch, LVGL 9, and the display set-up of the drivers page.',
      libs: ['lvgl (LVGL 9)'],
      blocks: `
        when started
          start LVGL display and touch :: display
          create screen [home] and screen [settings] :: display
          create button [Settings] on [home] that loads [settings] :: display
          create switch [Wi-Fi] on [settings] :: display
          create button [Back] on [settings] that loads [home] :: display
        when value written
          print (join [wifi ] (switch [Wi-Fi])) :: display
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>

        void start_display();                    // display, touch and tick: see the drivers page

        static lv_obj_t *home, *settings;

        static void go(lv_event_t *e) {
          lv_screen_load((lv_obj_t *)lv_event_get_user_data(e));   // the target travels as user data
        }

        static lv_obj_t *add_button(lv_obj_t *parent, const char *text, lv_obj_t *target) {
          lv_obj_t *b = lv_button_create(parent);
          lv_label_set_text(lv_label_create(b), text);
          lv_obj_add_event_cb(b, go, LV_EVENT_CLICKED, target);
          return b;
        }

        static void on_switch(lv_event_t *e) {
          lv_obj_t *sw = lv_event_get_target_obj(e);
          Serial.println(lv_obj_has_state(sw, LV_STATE_CHECKED) ? "wifi on" : "wifi off");
        }

        void setup() {
          Serial.begin(115200);
          start_display();
          home = lv_screen_active();
          settings = lv_obj_create(NULL);                 // a screen has no parent

          lv_obj_center(add_button(home, "Settings", settings));

          lv_obj_t *sw = lv_switch_create(settings);
          lv_obj_center(sw);
          lv_obj_add_event_cb(sw, on_switch, LV_EVENT_VALUE_CHANGED, nullptr);
          lv_obj_align(add_button(settings, "Back", home), LV_ALIGN_BOTTOM_LEFT, 10, -10);
        }

        void loop() {
          lv_timer_handler();
          delay(5);
        }
      `,
      py: String.raw`
        import lvgl as lv
        import time

        lv.init()
        # the display and the touch are created here with the drivers of your LVGL firmware build

        home = lv.screen_active()
        settings = lv.obj()                              # a screen has no parent

        def add_button(parent, text, target):
            b = lv.button(parent)
            lv.label(b).set_text(text)
            b.add_event_cb(lambda e: lv.screen_load(target), lv.EVENT.CLICKED, None)   # the target is captured by the lambda
            return b

        def on_switch(e):
            print("wifi on" if sw.has_state(lv.STATE.CHECKED) else "wifi off")

        add_button(home, "Settings", settings).center()

        sw = lv.switch(settings)
        sw.center()
        sw.add_event_cb(on_switch, lv.EVENT.VALUE_CHANGED, None)
        add_button(settings, "Back", home).align(lv.ALIGN.BOTTOM_LEFT, 10, -10)

        while True:
            lv.timer_handler()
            time.sleep_ms(5)
      `,
      output: `wifi on
wifi off`,
      notes: ['Both screens are created once and kept; the next step for a bigger product is to create the heavy ones on demand and delete them when left.', 'In MicroPython a closure or lambda replaces the user-data pointer; it needs a firmware built with the LVGL binding ([[gui-in-micropython]]).', 'Keep the real Wi-Fi state in a variable (the model) and have the switch show it, not own it.']
    }
  ],
  sim: 'tg-screens'
},

/* ================================================================ GUI designers */
{
  id: 'gui-designers',
  parent: 'touch-and-gui',
  title: 'GUI designers',
  level: 2,
  short: 'Drag widgets into place, set their properties, preview the result and export code. What SquareLine Studio, EEZ Studio and the others do for an LVGL project, what they do not, and how to keep generated code from eating your own.',
  keywords: ['GUI designer', 'SquareLine Studio', 'EEZ Studio', 'LVGL editor', 'GUI Guider', 'generated code', 'UI editor', 'PC simulator', 'SDL simulator', 'lv_font_conv', 'image converter', 'assets', 'XML', 'drag and drop'],
  prereq: ['lvgl-widgets', 'lvgl-styles-and-layouts', 'lvgl-events-and-screens'],
  related: ['gui-concepts', 'lvgl', 'hmi-design-rules', 'images-and-icons', 'fonts', 'unit-testing'],
  body: `Writing \`lv_obj_set_pos\` and \`lv_label_set_text\` by hand is fine for one screen. By the fifth screen, with fonts, images and a designer who wants everything ten pixels to the left, you want to *see* what you are building. A **GUI designer** is a drawing program for interfaces: you drag widgets onto a canvas the size of your panel, set their text, colours, sizes and layouts in a property panel, link events to named functions, preview the result on the PC, and press *export*.

### What is out there

- **SquareLine Studio**, made by the people behind LVGL: drag and drop, several screens, animations, a project per LVGL version, exports C code. It is a commercial product with a free tier; check its current terms.
- **EEZ Studio**, open source, which designs the *flow* of an interface — pages, actions, variables — as well as its look, and generates LVGL code.
- **LVGL's own editor**, which at the time of writing describes screens in a text format (XML) that is kept with the project; check its state before relying on it.
- **Vendor tools** for one family of chips, and the [display and GUI lab](#/tools/displaylab/gui) in this app, which designs a screen, lets you try it, and writes LVGL 9 for you.

### What comes out

C source files: a function that builds each screen, a variable for each widget, and *stubs* for the events you named. Images become C arrays (or files), fonts are converted to LVGL's format by a font converter that keeps only the characters you use. Match the **target version**: a project set to LVGL 8 produces code that will not compile against 9.

### The one rule: never edit generated files

The next export overwrites them. Keep the divide clean: the designer owns \`ui/\`, you own \`app/\`. The designer calls your function by name when a button is clicked; your code reads and sets widgets through the variables the designer exported; and the real values live in your model ([[gui-concepts]]), not in the widgets.

### Preview is not the device

The designer shows a clean PC rendering. On the panel the colours are different (an RGB565 panel has 5-6-5 bits, so gradients band), the font looks heavier, and an RGB panel is brighter than a monitor. LVGL's **PC simulator** compiles the same interface for the computer with a window and mouse — the quickest way to iterate — but only the panel decides whether the text is legible ([[hmi-design-rules]]). Fonts and images eat flash: a large image as a C array can be hundreds of kilobytes.

### When not to use one

A screen built from a table or a loop — twenty settings rows of the same kind — is shorter as code, as the program below shows. Designers shine for varied, graphic screens that a designer or customer must approve.

> [!key] A GUI designer lets you place widgets, preview them and export LVGL code, with images and fonts converted for you. Match its LVGL version, never edit the generated files, keep your logic and your values outside them, and test on the real panel.`,
  ideas: [
    'A GUI designer is a drawing program for interfaces: place widgets, set properties, link events to function names, preview, export code.',
    'SquareLine Studio, EEZ Studio, LVGL\'s own editor and vendor tools all export for a chosen LVGL version, which must match your library.',
    'Generated files are overwritten on every export: keep your logic in separate files that the generated code calls.',
    'The preview is not the panel: check colours, fonts and flash use on the real hardware, and iterate quickly with the PC simulator.'
  ],
  pitfalls: [
    'I will fix this one thing in the generated file — It is gone at the next export. Change it in the designer, or move the logic into your own file that the generated code calls.',
    'If it looks right in the designer it will look right on the panel — The panel has fewer colours, different brightness and a different font rendering. Test on the hardware.',
    'A designer replaces all hand-written LVGL — Repetitive screens built from a table or loop are shorter as code, and the two methods mix well.'
  ],
  terms: [
    { term: 'GUI designer', also: ['UI editor', 'screen designer'], def: 'A drawing program for interfaces. You place widgets on a canvas the size of the panel, set their properties and events, and export source code for a GUI library such as LVGL.' },
    { term: 'Generated code', also: ['exported code'], def: 'The source files a designer writes. They are overwritten at every export, so your own logic must live in separate files.' },
    { term: 'PC simulator', also: ['SDL simulator'], def: 'A build of an LVGL interface that runs on the computer in a window with the mouse as the touch screen. It makes layout work quick, since nothing is flashed.' },
    { term: 'Font converter', also: ['lv_font_conv'], def: 'A tool that turns a font file into LVGL\'s format at chosen sizes and for chosen characters only, so the font occupies as little flash as possible.' },
    { term: 'Asset', also: ['image asset', 'resource'], def: 'An image, font or icon that is part of the interface. Assets are converted and compiled into flash, or kept as files on a file system or SD card.' }
  ],
  choose: {
    good: ['Several screens with varied, graphic layout that someone else must approve', 'A team where a designer and a programmer work apart', 'Quick previews and animations before any hardware exists'],
    avoid: ['A screen of twenty alike rows: a loop is shorter', 'Editing generated files by hand', 'Choosing a tool before checking its LVGL version and its licence terms'],
    check: ['Which LVGL version does the project target, and is it the library\'s?', 'Where does your logic live, outside the generated folder?', 'How much flash do the converted images and fonts take?']
  },
  quiz: [
    { q: 'Why should you never edit the files a GUI designer generates?', choices: ['They are read-only', 'The next export overwrites your changes', 'They are encrypted', 'The compiler ignores them'], a: 1, why: 'The designer rewrites its output at every export. Keep your own logic in separate files that the generated code calls, and change the look in the designer.' },
    { q: 'A designer project is set to LVGL 8 but your library is LVGL 9. What happens?', choices: ['It works unchanged', 'The exported code uses names that LVGL 9 renamed, so it will not compile', 'Only the colours change', 'The display runs slower'], a: 1, why: 'The exported code follows the version chosen in the project. Set the target to the version of the library you build with.' },
    { q: 'If a screen looks right in the designer\'s preview, it will look the same on the panel.', a: false, why: 'The panel has fewer colour bits, a different brightness and its own font rendering. Always check on the hardware.' },
    { q: 'You want to try ten layouts a day without flashing the board. What helps most?', choices: ['A bigger SPI clock', 'The PC simulator, which runs the interface in a window', 'A second display', 'More PSRAM'], a: 1, why: 'LVGL can be built for the computer with a window and the mouse as the touch screen. Layout and flow can be tried there; only legibility needs the real panel.' }
  ],
  applications: [
    'Product screens with a designer\'s artwork: icons, custom fonts and several approved layouts.',
    'Teams where a UI designer works in a tool and a firmware engineer writes the logic.',
    'Prototypes shown to customers before the hardware exists, using the PC preview.',
    'Rows of alike widgets, such as settings lists, built from a data table instead.'
  ],
  sources: [
    'The documentation of SquareLine Studio and EEZ Studio (project settings, export, target LVGL version).',
    'LVGL documentation: the PC simulator, the image converter and the font converter.',
    'This app\'s own display and GUI lab, which writes LVGL 9 for the screens you design in it.'
  ],
  code: [
    {
      title: 'A screen built from a table',
      about: 'Three settings, each a name, a range and a value, become three rows of a label and a slider. One callback serves every slider, because the row\'s data travels as user data. This is the other way to build many alike widgets, without a designer.',
      needs: 'An ESP32 with a TFT and touch, LVGL 9, and the display set-up of the drivers page.',
      libs: ['lvgl (LVGL 9)'],
      blocks: `
        when started
          start LVGL display and touch :: display
          create column container [rows] :: display
          for each [row v] in (settings table)
            create label (name of row) in [rows] :: display
            create slider range (min of row) (max of row) value (value of row) in [rows] :: display
          end
        when value written
          print (join (name of row) (join [ = ] (value of row)))
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>

        void start_display();                    // display, touch and tick: see the drivers page

        struct Setting { const char *name; int min, max, value; };
        static Setting settings[] = {            // the interface is data
          { "Brightness", 0, 100, 70 },
          { "Volume", 0, 100, 40 },
          { "Contrast", 0, 100, 55 },
        };

        static void on_slider(lv_event_t *e) {
          Setting *s = (Setting *)lv_event_get_user_data(e);        // the row's data
          s->value = lv_slider_get_value(lv_event_get_target_obj(e));
          Serial.printf("%s = %d\n", s->name, s->value);
        }

        void setup() {
          Serial.begin(115200);
          start_display();
          lv_obj_t *col = lv_obj_create(lv_screen_active());
          lv_obj_set_size(col, LV_PCT(100), LV_PCT(100));
          lv_obj_set_flex_flow(col, LV_FLEX_FLOW_COLUMN);
          for (Setting &s : settings) {
            lv_label_set_text(lv_label_create(col), s.name);
            lv_obj_t *slider = lv_slider_create(col);
            lv_obj_set_width(slider, LV_PCT(90));
            lv_slider_set_range(slider, s.min, s.max);
            lv_slider_set_value(slider, s.value, LV_ANIM_OFF);
            lv_obj_add_event_cb(slider, on_slider, LV_EVENT_VALUE_CHANGED, &s);
          }
        }

        void loop() {
          lv_timer_handler();
          delay(5);
        }
      `,
      py: String.raw`
        import lvgl as lv
        import time

        lv.init()
        # the display and the touch are created here with the drivers of your LVGL firmware build

        settings = [                              # the interface is data
            {"name": "Brightness", "min": 0, "max": 100, "value": 70},
            {"name": "Volume", "min": 0, "max": 100, "value": 40},
            {"name": "Contrast", "min": 0, "max": 100, "value": 55},
        ]

        def make_callback(s):                     # one callback per row, carrying the row's data
            def on_slider(e):
                s["value"] = e.get_target_obj().get_value()
                print(s["name"], "=", s["value"])
            return on_slider

        col = lv.obj(lv.screen_active())
        col.set_size(lv.pct(100), lv.pct(100))
        col.set_flex_flow(lv.FLEX_FLOW.COLUMN)
        for s in settings:
            lv.label(col).set_text(s["name"])
            slider = lv.slider(col)
            slider.set_width(lv.pct(90))
            slider.set_range(s["min"], s["max"])
            slider.set_value(s["value"], lv.ANIM.OFF)
            slider.add_event_cb(make_callback(s), lv.EVENT.VALUE_CHANGED, None)

        while True:
            lv.timer_handler()
            time.sleep_ms(5)
      `,
      output: `Volume = 52
Volume = 53`,
      notes: ['A designer would generate the same widgets; the difference is that here adding a fourth setting is one more line of data.', 'MicroPython: needs a firmware built with the LVGL binding ([[gui-in-micropython]]).', 'The settings array lives for the whole program, so passing a pointer to a row as user data is safe.']
    }
  ],
  sim: 'tg-designer'
},

/* ================================================================ GUIs in MicroPython */
{
  id: 'gui-in-micropython',
  parent: 'touch-and-gui',
  title: 'GUIs in MicroPython',
  level: 2,
  short: 'MicroPython can draw a good interface, but the official firmware has no LVGL. The routes are the built-in frame buffer with a driver, an LVGL firmware build, pure-Python GUI libraries — and the limits are memory, speed and the garbage collector.',
  keywords: ['MicroPython GUI', 'framebuf', 'FrameBuffer', 'ssd1306', 'st7789', 'lv_binding_micropython', 'LVGL MicroPython', 'custom firmware', 'micro-gui', 'micropython-touch', 'garbage collector', 'frozen module', 'UIFlow', 'CircuitPython displayio'],
  prereq: ['micropython-setup', 'graphics-libraries', 'lvgl'],
  related: ['lvgl-display-and-input-drivers', 'uiflow', 'circuitpython-on-esp', 'using-psram', 'oled-ssd1306', 'presenting-data'],
  body: `MicroPython is the language of choice for many first projects, and sooner or later someone asks for a screen. The honest answer has three routes and one catch.

### Three routes

| Route | What it is | Needs | Good for |
|---|---|---|---|
| **framebuf and a driver** | the built-in FrameBuffer class draws into memory; a driver file sends it to the panel | official firmware, a driver file (the SSD1306 one installs with mip) | text, bars and shapes on small OLED and TFT displays |
| **LVGL binding** | the real LVGL, called from Python | a firmware you build yourself (\`lv_binding_micropython\`) | touch interfaces with the widgets of the C pages |
| **A pure-Python GUI library** | widgets written in Python, such as Peter Hinch's micro-gui and micropython-touch | official firmware plus a display driver | modest widget sets on small memory |

M5Stack's UIFlow is a MicroPython-based environment for M5 hardware ([[uiflow]]); CircuitPython has its own display system, *displayio* ([[circuitpython-on-esp]]). Neither is the official MicroPython.

### The catch: LVGL is not in the download

Every official ESP32 build lacks LVGL. To use it you compile MicroPython with the binding — a toolchain, a configuration file and a driver for your display and touch chip. The binding's README lists ILI9341, XPT2046 and FT6X36 drivers for the ESP32. Once it runs, the code is the C code with Python punctuation: \`lv.button(parent)\`, \`btn.add_event_cb(cb, lv.EVENT.CLICKED, None)\`. Plan for the build as part of the project, and for rebuilding when MicroPython or LVGL moves on.

### The limits

- **Memory.** A 320 × 240 RGB565 frame is 150 KB, more than the free heap of a board without PSRAM; print \`gc.mem_free()\` to see yours. Draw into a small buffer and send it in strips, or use a board with PSRAM ([[using-psram]]). The simulation shows the sums.
- **Speed.** Python loops over pixels are far too slow. Use the C-implemented FrameBuffer calls (\`fill_rect\`, \`line\`, \`text\`, \`blit\`) and redraw only what changed.
- **The garbage collector.** Creating objects in a loop leads to a collection pause now and then — a visible stutter. Reuse buffers, avoid building strings every frame, call \`gc.collect()\` at a calm moment.
- **Fonts.** The built-in text is 8 × 8 pixels and cannot be enlarged. Bigger text needs a font module and a writer routine.

> [!key] On MicroPython draw with the built-in FrameBuffer and a driver file, or build a firmware with the LVGL binding for full touch interfaces — LVGL is not in the official download. Mind the memory of a full frame, redraw only what changed, and avoid creating objects every frame.`,
  ideas: [
    'There are three routes: FrameBuffer with a driver, an LVGL firmware build, and pure-Python GUI libraries.',
    'The official MicroPython builds have no LVGL; a custom build with the binding and display and touch drivers is needed.',
    'A full colour frame is more than a small board can hold: draw into strips, or use PSRAM.',
    'Speed and smoothness come from the C-implemented drawing calls, redrawing only changes, and not allocating objects in the loop.'
  ],
  pitfalls: [
    'I can pip-install LVGL for MicroPython — LVGL is part of a firmware you flash, not a module you copy. The official downloads do not contain it.',
    'framebuf.text can draw big text — Its font is 8 × 8 pixels and cannot be scaled. Use a bitmap-font module and its writer for larger characters.',
    'MicroPython will keep up with any frame rate — Pixel loops in Python are slow, and the garbage collector pauses the program now and then. Use the built-in drawing calls, update small areas, and reuse objects.'
  ],
  terms: [
    { term: 'FrameBuffer', also: ['framebuf', 'framebuf.FrameBuffer'], def: 'MicroPython\'s built-in class for a bitmap in memory, with fast drawing calls: fill, pixel, line, rect, fill_rect, text, scroll, blit. A display driver sends its contents to the panel.' },
    { term: 'LVGL binding', also: ['lv_binding_micropython', 'lv_micropython'], def: 'The project that wraps LVGL for MicroPython. It must be compiled into a firmware together with display and touch drivers; it is not in the official downloads.' },
    { term: 'Frozen module', def: 'Python code compiled into the firmware itself, so it is available without copying a file and uses flash instead of RAM. Some drivers and libraries come that way.' },
    { term: 'Custom firmware build', also: ['own MicroPython build'], def: 'A MicroPython image you compile with extra modules, such as LVGL or a fast display driver, and flash in place of the official download.' },
    { term: 'Garbage collection', also: ['GC'], def: 'MicroPython\'s automatic freeing of unused objects. A collection pauses the program for a moment, which shows as a stutter in an animation.' }
  ],
  choose: {
    good: ['framebuf and a driver for text, bars and icons on an OLED or small TFT', 'An LVGL build when the product needs a touch interface and the team can maintain a firmware', 'A pure-Python GUI library for a few widgets on a small memory'],
    avoid: ['Pixel-by-pixel loops in Python', 'A full frame buffer on a board without PSRAM', 'Counting on the official firmware to include LVGL'],
    check: ['Is there a driver for your display and touch chip in the route you choose?', 'How much does gc.mem_free() report after boot?', 'Who builds and updates the firmware if you choose LVGL?']
  },
  examples: [
    {
      title: 'How much memory is a frame?',
      q: 'How many bytes does a 128 × 64 monochrome FrameBuffer take, and a 240 × 240 RGB565 one?',
      steps: ['Monochrome is one bit per pixel: $128 \\times 64 / 8 = 1024$ bytes, a kilobyte.', 'RGB565 is two bytes per pixel: $240 \\times 240 \\times 2 = 115\\,200$ bytes, about 113 KB.', 'The OLED is trivial; the round colour display eats most of the free heap of a board without PSRAM, so such a program draws in strips or needs PSRAM.'],
      a: '1024 bytes, and 115 200 bytes.'
    }
  ],
  quiz: [
    { q: 'Which official MicroPython download for the ESP32 includes LVGL?', choices: ['The standard one', 'The SPIRAM one', 'None: it needs a custom build with the binding', 'The one for the ESP32-S3 only'], a: 2, why: 'LVGL is not in any official download. You compile MicroPython with the lv_binding_micropython module and the drivers for your display.' },
    { q: 'A 320 × 240 RGB565 FrameBuffer is about how big?', choices: ['15 KB', '75 KB', '150 KB', '1.5 MB'], a: 2, why: '320 × 240 × 2 bytes = 153 600 bytes, about 150 KB.' },
    { q: 'framebuf.text can draw text at any size.', a: false, why: 'Its font is 8 × 8 pixels. Bigger text needs a font module and a routine that draws it.' },
    { q: 'An animation stutters now and then although the loop is simple. What is a likely cause?', choices: ['The SPI clock is wrong', 'The garbage collector pausing the program after many small allocations', 'The touch controller', 'A short USB cable'], a: 1, why: 'Building strings and lists every frame fills the heap, and a collection pause follows. Reuse buffers and allocate outside the loop.' }
  ],
  applications: [
    'Status screens on SSD1306 OLEDs in MicroPython projects, drawn with framebuf.',
    'Teaching and prototyping: a touch interface in Python on a board with a custom LVGL build.',
    'Pure-Python interfaces on small memory, with a few buttons and sliders.',
    'M5Stack devices programmed with UIFlow, which are MicroPython-based.'
  ],
  sources: [
    'MicroPython documentation: the framebuf module and the ESP32 quick reference (version 1.29).',
    'The lv_binding_micropython repository: build instructions and the supported display and touch drivers.',
    'micropython-lib: the ssd1306 driver, installable with mip.'
  ],
  code: [
    {
      title: 'Widgets as functions on an OLED',
      about: 'A title bar, a number and a progress bar, each one a small drawing function, redrawn from a potentiometer reading ten times a second. This is the framebuf route: no widget library, only drawing calls.',
      needs: 'An ESP32, a 128 × 64 SSD1306 OLED on I2C and a potentiometer.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL'], ['GPIO34', 'potentiometer wiper', 'the ends go to 3V3 and GND; GPIO34 is an ADC1 pin']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
        define title (text)
          draw filled rectangle x (0) y (0) width (128) height (10)
          show (text) at x (2) y (1) in black
        define bar (x) (y) (w) (h) (frac)
          draw rectangle x (x) y (y) width (w) height (h)
          draw filled rectangle x ((x) + (2)) y ((y) + (2)) width (round (((w) - (4)) * (frac))) height ((h) - (4))
        forever
          set [frac v] to ((analog read pin (34)) / (4095))
          clear display
          title [Level] :: my
          show (join (round ((frac) * (100))) [ %]) at x (40) y (24)
          bar (4) (44) (120) (12) (frac) :: my
          update display
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 oled(128, 64, &Wire, -1);
        const int POT = 34;                          // a potentiometer stands in for a sensor

        void title(const char *text) {               // widget 1: a title bar
          oled.fillRect(0, 0, 128, 10, SSD1306_WHITE);
          oled.setTextColor(SSD1306_BLACK);
          oled.setCursor(2, 1);
          oled.print(text);
        }

        void bar(int x, int y, int w, int h, float frac) {   // widget 2: a progress bar
          oled.drawRect(x, y, w, h, SSD1306_WHITE);
          oled.fillRect(x + 2, y + 2, (int)((w - 4) * frac), h - 4, SSD1306_WHITE);
        }

        void setup() {
          Wire.begin(21, 22);
          oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
        }

        void loop() {
          float frac = analogRead(POT) / 4095.0;
          oled.clearDisplay();
          title("Level");
          oled.setTextColor(SSD1306_WHITE);
          oled.setCursor(40, 24);
          oled.printf("%3d %%", (int)(frac * 100 + 0.5));
          bar(4, 44, 120, 12, frac);
          oled.display();                            // nothing shows until display()
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin, I2C, ADC
        import ssd1306
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21))
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)     # ssd1306.py: mip.install("ssd1306") once
        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)      # a potentiometer stands in for a sensor

        def title(text):                             # widget 1: a title bar
            oled.fill_rect(0, 0, 128, 10, 1)
            oled.text(text, 2, 1, 0)

        def bar(x, y, w, h, frac):                   # widget 2: a progress bar
            oled.rect(x, y, w, h, 1)
            oled.fill_rect(x + 2, y + 2, int((w - 4) * frac), h - 4, 1)

        while True:
            frac = pot.read_u16() / 65535
            oled.fill(0)
            title("Level")
            oled.text("%3d %%" % round(frac * 100), 40, 24)
            bar(4, 44, 120, 12, frac)
            oled.show()                              # nothing shows until show()
            time.sleep_ms(100)
      `,
      notes: ['The ssd1306 module is not in the official firmware: copy it with mip (mip.install("ssd1306")) while the board is on Wi-Fi.', 'Adafruit GFX can enlarge text with setTextSize; the framebuf font is fixed at 8 × 8, so the MicroPython version keeps the number small.', 'The loop allocates almost nothing, which keeps the garbage collector quiet.']
    }
  ],
  sim: { id: 'tg-buffers', params: { mode: 'micropython' } }
},

/* ================================================================ presenting data */
{
  id: 'presenting-data',
  parent: 'touch-and-gui',
  title: 'Presenting data: gauges, charts, trends',
  level: 2,
  short: 'A number, a bar, a gauge and a chart answer different questions. How to pick the form, show units and honest precision, update at a readable rate, mark limits without relying on colour, and never show an old value as if it were new.',
  keywords: ['presenting data', 'dashboard', 'gauge', 'chart', 'sparkline', 'trend', 'bar graph', 'units', 'update rate', 'stale data', 'smoothing', 'thresholds', 'colour blindness', 'auto scaling', 'e-paper update time'],
  prereq: ['gui-concepts', 'lvgl-widgets', 'filtering-sensor-data'],
  related: ['hmi-design-rules', 'presenting-live-data', 'dashboards', 'oled-ssd1306', 'e-paper', 'formatting-numbers', 'time-series-data'],
  body: `The same temperature can be shown as a number, a bar, a dial or a line. None of them is better: each answers a different question, and a good panel uses the one that answers the question the reader is asking.

### Pick the form by the question

| The reader wants to know | Show | Why |
|---|---|---|
| the exact value: a setpoint, a voltage | a **number** with its unit | precise, but slow to judge |
| is it normal, and how near is the limit | a **bar or gauge** with the limits marked | imprecise, but understood at a glance |
| where is it heading | a **chart** or a small sparkline of the last minutes | shows direction and speed |
| something needs attention | **colour and a word or icon** | colour alone fails some readers |

### Numbers

Always give the **unit**. Show only the digits the sensor deserves: a sensor good to ±0.5 °C shown as 21.37 invites trust it has not earned. Use a fixed number of decimals and right-align, so the digits do not jump about. Update at a rate people can read: a number that changes twenty times a second is a blur, two to four times a second is comfortable. **Smooth** the value — an exponential average, as in [[filtering-sensor-data]] — so noise does not make the last digit flicker.

### Ranges and colours

A bar or gauge needs a **meaningful scale**: the sensor's useful range, not 0 to 4095. Mark the normal band and the limits. Use colour for thresholds — green, amber, red — but remember that about one man in twelve cannot tell red from green reliably: back it with a word, an icon, a position, a shape. The simulation has a switch that shows what such a reader sees.

### Trends

A chart needs a labelled time axis ("last 10 minutes") and a sensible scale. *Auto-scaling* makes noise look like drama: a tiny wobble fills the screen. Fix the range, or limit how far the scale may shrink. Draw missing data as a gap, not as a straight line through it. On a small display a **sparkline** — a line with no axes, next to the number — says whether it is rising or falling.

### Stale data

The worst display shows an old value with the confidence of a new one. A sensor fails, a network drops, a task hangs, and the screen goes on showing 21.5 °C. Record the time of the last good reading; when it is older than a few update periods, show dashes, grey the value, or say "updated 4 min ago". An e-paper display, which refreshes slowly and keeps its picture without power, should always show *when* it was drawn ([[e-paper]]).

> [!key] Choose the form by the question — number for the exact value, bar or gauge for the range, chart for the trend — with units, honest digits, a readable update rate and smoothing. Mark limits with more than colour, fix chart scales, and replace a value that has gone stale instead of showing it.`,
  ideas: [
    'A number is precise, a bar or gauge is instant, a chart shows direction: choose by the reader\'s question.',
    'Show units, only the digits the sensor deserves, a fixed number of decimals, and update two to four times a second at most.',
    'Mark limits on bars and gauges, and back colour with a word, icon or position because some readers cannot tell red from green.',
    'Show when data is stale instead of the last value; on e-paper show the time of the last refresh.'
  ],
  pitfalls: [
    'More decimals look more professional — They imply accuracy the sensor does not have, and they flicker. Show the digits that are real.',
    'Auto-scale every chart — Then the smallest noise fills the screen. A fixed or slow-moving range shows what matters.',
    'If the value is red, everyone sees the alarm — About one man in twelve confuses red and green. Add a word, an icon or a position.'
  ],
  terms: [
    { term: 'Sparkline', def: 'A small line chart with no axes or labels, drawn beside a number to show at a glance whether the value has been rising, falling or steady.' },
    { term: 'Stale data', also: ['old reading'], def: 'A value that is no longer current because its source stopped updating. A good display detects this and shows it, instead of presenting the old value as new.' },
    { term: 'Auto-scaling', also: ['auto-range'], def: 'Choosing a chart\'s vertical range from the data on screen. It keeps the line in view but magnifies noise when the data barely changes.' },
    { term: 'Smoothing', also: ['exponential moving average', 'EMA'], def: 'Replacing each new reading by a weighted average with the previous result, so that the displayed number moves steadily instead of jittering.' },
    { term: 'Gauge', also: ['dial'], def: 'A circular or arc-shaped display of a value within a range, usually with marked limits. It is read at a glance but only approximately.' }
  ],
  formulas: [
    {
      name: 'Smoothing factor from a time constant',
      expr: 'alpha = dt / (tau + dt)',
      tex: '\\alpha = \\frac{\\Delta t}{\\tau + \\Delta t}',
      vars: {
        alpha: { name: 'smoothing factor of the average', tex: '\\alpha' },
        dt: { name: 'time between readings', q: 'time', unit: 's', value: 0.1, min: 0, tex: '\\Delta t' },
        tau: { name: 'time constant of the smoothing', q: 'time', unit: 's', value: 1, min: 0, tex: '\\tau' }
      },
      solveFor: 'alpha',
      note: 'Use it as shown = shown + alpha × (reading − shown). A longer time constant gives a steadier number that follows a real change more slowly.',
      stories: { alpha: 'A sensor is read every {dt} and the shown value is smoothed with a time constant of {tau}. What factor goes in the average?' },
      practice: { unknowns: ['alpha'] }
    }
  ],
  examples: [
    {
      title: 'Smoothing a flickering number',
      q: 'A temperature is read ten times a second and shown to one decimal. The last digit jumps. You want the number to follow a real change in about a second. Which factor do you use?',
      steps: ['The readings are $\\Delta t = 0.1$ s apart and the wanted time constant is $\\tau = 1$ s.', '$\\alpha = 0.1 / (1 + 0.1) \\approx 0.09$.', 'Each reading moves the shown number by about 9 % of the difference: noise is averaged away, and a real step is mostly followed within a second or two.'],
      a: 'About 0.09, i.e. shown = shown + 0.09 × (reading − shown).'
    }
  ],
  quiz: [
    { q: 'An operator must see at a glance whether a tank level is in its normal band. Which form fits best?', choices: ['A number with four decimals', 'A bar with the normal band and the limits marked', 'A table of the last ten values', 'A scrolling text'], a: 1, why: 'A bar shows how full the tank is, and the marked band tells at once whether that is normal. A number must first be read and compared.' },
    { q: 'A temperature sensor stops responding and the display keeps showing 21.5 °C. What should a good display do?', choices: ['Nothing, the value is the last known', 'Show dashes or a stale mark and say how old the value is', 'Show 0', 'Restart the sensor silently'], a: 1, why: 'An old value that looks new is dangerous. Show that the data is stale, ideally with its age.' },
    { q: 'Auto-scaling is always the best choice for a trend chart.', a: false, why: 'It stretches a tiny wobble across the whole height and makes noise look like a trend. A fixed or slowly adapting range is usually clearer.' },
    { q: 'Why add an icon or a word to a red-amber-green indicator?', choices: ['It looks better', 'Some readers cannot tell red from green reliably', 'It saves memory', 'Red cannot be shown on small displays'], a: 1, why: 'Around one man in twelve has a red-green colour-vision deficiency. A second cue — word, icon, position — keeps the message for everyone.' }
  ],
  applications: [
    'Thermostat and weather-station panels: a big number, a trend arrow and a small history.',
    'Battery and tank levels as bars with a marked low-level band.',
    'Instrument panels with gauges for speed, pressure or current and alarms for limits.',
    'E-paper dashboards that show the time they were last refreshed.'
  ],
  sources: [
    'LVGL documentation: the chart, arc, bar and scale widgets (version 9).',
    'Tufte, E. R., The Visual Display of Quantitative Information (the case for sparklines and honest scales).',
    'The ergonomics of displays and controls: colour-vision deficiency and the readability of numbers.'
  ],
  code: [
    {
      title: 'A reading with a bar, a sparkline and a stale mark',
      about: 'A number, a level bar and a sparkline of the last 64 readings on an OLED. A new reading arrives once a second; hold the button to pretend the sensor was lost, and after five seconds the display shows dashes and STALE instead of the old number.',
      needs: 'An ESP32, a 128 × 64 SSD1306 OLED on I2C, a potentiometer and a push button.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL'], ['GPIO34', 'potentiometer wiper', 'an ADC1 pin'], ['GPIO4', 'push button → GND', 'internal pull-up; hold to simulate a lost sensor']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
          set pin (4) as [input with pull-up v]
          set [last good v] to (milliseconds since start)
        forever
          if <<(read pin (4)) = [HIGH v]> and <((milliseconds since start) - (last good)) ≥ (1000)>> then
            set [last good v] to (milliseconds since start)
            set [pct v] to (map (analog read pin (34)) from (0) (4095) to (0) (100))
            add (pct) to [history v]
          end
          set [stale v] to <((milliseconds since start) - (last good)) > (5000)>
          clear display
          if <stale> then
            show [-- STALE] at x (0) y (0)
          else
            show (join (pct) [ %]) at x (0) y (0)
            draw bar of (pct) at x (0) y (14) width (128) height (8)
          end
          draw sparkline of [history v] at y (34) height (30)
          update display
          wait (0.05) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 oled(128, 64, &Wire, -1);
        const int POT = 34, BTN = 4;               // the sensor stand-in and the "lose the sensor" button
        const int N = 64;                          // the sparkline holds the last 64 readings
        const uint32_t STALE_MS = 5000;            // a reading older than this is not trusted
        uint8_t history[N];                        // percent, newest at the end
        int count = 0;
        uint32_t lastGood = 0;

        void setup() {
          pinMode(BTN, INPUT_PULLUP);
          Wire.begin(21, 22);
          oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
        }

        void loop() {
          uint32_t now = millis();
          if (digitalRead(BTN) == HIGH && now - lastGood >= 1000) {   // a new reading once a second
            lastGood = now;
            memmove(history, history + 1, N - 1);                     // shift left, newest at the end
            history[N - 1] = analogRead(POT) * 100 / 4095;
            if (count < N) count++;
          }
          bool stale = (now - lastGood > STALE_MS) || count == 0;     // never show an old value as new

          oled.clearDisplay();
          oled.setTextColor(SSD1306_WHITE);
          oled.setCursor(0, 0);
          if (stale) oled.print("-- STALE");
          else oled.printf("%d %%", history[N - 1]);
          if (!stale) oled.drawRect(0, 14, 128, 8, SSD1306_WHITE);
          if (!stale) oled.fillRect(2, 16, history[N - 1] * 124 / 100, 4, SSD1306_WHITE);
          for (int i = N - count + 1; i < N; i++) {                    // the sparkline: no axes, just the shape
            oled.drawLine((i - 1) * 2, 63 - history[i - 1] * 28 / 100, i * 2, 63 - history[i] * 28 / 100, SSD1306_WHITE);
          }
          oled.display();
          delay(50);
        }
      `,
      py: String.raw`
        from machine import Pin, I2C, ADC
        import ssd1306
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21))
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)
        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)    # the sensor stand-in
        btn = Pin(4, Pin.IN, Pin.PULL_UP)          # hold it to pretend the sensor was lost
        N = 64                                     # the sparkline holds the last 64 readings
        STALE_MS = 5000                            # a reading older than this is not trusted
        history = []                               # percent, newest at the end
        last_good = time.ticks_ms()

        while True:
            now = time.ticks_ms()
            if btn.value() and time.ticks_diff(now, last_good) >= 1000:   # a new reading once a second
                last_good = now
                history.append(pot.read_u16() * 100 // 65535)
                history = history[-N:]
            stale = time.ticks_diff(now, last_good) > STALE_MS or not history   # never show an old value as new

            oled.fill(0)
            oled.text("-- STALE" if stale else "%d %%" % history[-1], 0, 0)
            if not stale:
                oled.rect(0, 14, 128, 8, 1)
                oled.fill_rect(2, 16, history[-1] * 124 // 100, 4, 1)
            first = N - len(history)
            for i in range(1, len(history)):       # the sparkline: no axes, just the shape
                oled.line((first + i - 1) * 2, 63 - history[i - 1] * 28 // 100, (first + i) * 2, 63 - history[i] * 28 // 100, 1)
            oled.show()
            time.sleep_ms(50)
      `,
      notes: ['Replace the potentiometer by a real sensor and keep the logic: the time of the last good reading decides what is shown.', 'For a number that is steadier on screen, smooth it before display with the factor of the formula above.', 'The python list slicing allocates a little each second; at one reading a second the garbage collector does not notice.']
    }
  ],
  sim: 'tg-present'
},

/* ================================================================ rules for a usable panel */
{
  id: 'hmi-design-rules',
  parent: 'touch-and-gui',
  title: 'Rules for a usable panel',
  level: 2,
  short: 'A panel that works on the bench can still fail in use. Touch targets of 7 to 10 mm, an answer to every press within a tenth of a second, text readable from where the user stands, errors that say what to do, and nothing destructive without a deliberate act.',
  keywords: ['HMI', 'usability', 'touch target size', 'Fitts', 'feedback', 'contrast', 'font size', 'viewing distance', 'visual angle', 'confirmation', 'long press', 'error states', 'emergency stop', 'response time', 'accessibility'],
  prereq: ['gui-concepts', 'presenting-data', 'touch-calibration-and-rotation'],
  related: ['lvgl-events-and-screens', 'encoder-and-button-navigation', 'ergonomics:hmi-screens', 'ergonomics:fitts-law', 'optics:colour-vision-deficiency', 'safety-in-control'],
  body: `A panel is used by a person with a thumb, in a poor light, in a hurry, while thinking about something else. The rules below are old and plain; they cost nothing but attention, and a product that follows them feels well made. More on the people side is in [[ergonomics:hmi-screens]] and [[ergonomics:fitts-law]].

### Size the targets for a finger

A fingertip is about 10 mm wide and a thumb wider. Phone makers' guidelines for a tappable target land between roughly 7 and 10 mm, with a few millimetres of gap between neighbours. A pixel count means nothing until you know the pixel pitch: a 2.8 inch 320 × 240 panel has about 143 pixels to the inch, so one millimetre is 5.6 pixels, and a 30-pixel button is only 5.3 mm — too small. Work in millimetres and convert with the formulas below. Place the common actions where the thumb rests, and put destructive ones away from them. The simulation lets you see how often a virtual finger misses.

### Answer every touch

Within about a tenth of a second something must change: the pressed state, a sound, a click of haptic. Beyond a second the user doubts the press; beyond ten they give up. If an action takes longer, show it is working. A press that does nothing visible gets pressed again, and the second press is often the harmful one.

### Make it readable from where it is used

Text size comes from the viewing distance, not the pixel count: a character about 20 minutes of arc tall is a comfortable reading size, which is 2.9 mm at half a metre and 12 mm at two metres. Keep strong contrast (dark on light or the reverse, never light grey on white), avoid thin fonts, and do not carry meaning by colour alone ([[presenting-data]]). Check the screen in the brightest light it will meet.

### Say what is wrong, and ask before harm

An error says what happened and what to do, in words — not a code and not silence. A destructive action — erase, factory reset, start the heater — needs a deliberate act: a confirmation, or better a press-and-hold with visible progress, and an undo where possible. Keep the layout steady: the same place for Back and Home, no menu deeper than three levels.

### The screen is not the safety system

An emergency stop, a door interlock or an over-temperature cut-out must work when the display is blank, frozen or dropped. Wire them in hardware, and let the screen show their state ([[safety-in-control]]).

> [!key] Size targets in millimetres (7 to 10), answer every press within a tenth of a second, size text from the viewing distance, give errors words and destructive actions a deliberate gesture, and keep safety functions off the screen.`,
  ideas: [
    'A touch target should be about 7 to 10 mm with a few millimetres between neighbours; convert pixels to millimetres with the panel size.',
    'Every press needs visible feedback within about 100 ms; longer jobs need a progress sign.',
    'Text size follows the viewing distance (about 20 minutes of arc), and contrast and colour-independent cues keep it readable.',
    'Errors say what to do, destructive actions need a deliberate gesture, and safety functions never depend on the screen.'
  ],
  pitfalls: [
    'A 30-pixel button is big enough — On a 2.8 inch 320 × 240 panel it is 5 mm. What matters is millimetres, which depend on the pixel pitch of the panel.',
    'If the screen is slow the user will wait — They press again. Give feedback at once, even if it is only a pressed colour, and show progress for anything longer.',
    'The emergency stop can be a button on the screen — A frozen or blank display cannot stop a machine. Safety functions are hard-wired; the screen only shows them.'
  ],
  terms: [
    { term: 'HMI', also: ['human-machine interface', 'operator panel'], def: 'The part of a device a person uses to read it and control it: a screen, buttons, a knob. The design of an HMI decides whether the device can be used without a manual.' },
    { term: 'Touch target', also: ['hit area', 'tap target'], def: 'The area of the screen that reacts to a touch for a given control. It should be about 7 to 10 mm across, however many pixels that is on the panel.' },
    { term: 'Fitts\'s law', def: 'The time to reach a target grows with the distance to it and shrinks with its size. It is why large, near targets are quick and small, distant ones slow and error-prone.' },
    { term: 'Visual angle', also: ['arc minute'], def: 'The angle an object covers in the eye of the viewer. Text should span about 20 minutes of arc (a third of a degree) to be comfortable, so its size in millimetres grows with the viewing distance.' },
    { term: 'Press-and-hold confirmation', also: ['hold to confirm'], def: 'Requiring a touch to stay for a set time before a dangerous action happens, usually with a progress ring. It is quicker than a dialogue and harder to trigger by accident.' }
  ],
  formulas: [
    {
      name: 'Pixels to millimetres on a panel',
      expr: 's = px * d / sqrt(w^2 + h^2)',
      tex: 's = \\frac{\\mathrm{px} \\cdot d}{\\sqrt{w^2 + h^2}}',
      vars: {
        s: { name: 'size on the glass', q: 'length', unit: 'mm', tex: 's' },
        px: { name: 'size in pixels', q: 'count', value: 30, min: 0, tex: '\\mathrm{px}' },
        d: { name: 'diagonal of the screen', q: 'length', unit: 'in', value: 2.8, min: 0.1, tex: 'd' },
        w: { name: 'width in pixels', q: 'count', value: 320, min: 1, tex: 'w' },
        h: { name: 'height in pixels', q: 'count', value: 240, min: 1, tex: 'h' }
      },
      solveFor: 's',
      note: 'The diagonal in pixels over the diagonal in length gives the pixel pitch. Solve for px to find how many pixels a 9 mm target needs on your panel.',
      stories: { s: 'A button is {px} on a {d} screen of {w} × {h} pixels. How big is it on the glass?', px: 'A button must be {s} on a {d} screen of {w} × {h} pixels. How many pixels is that?' },
      practice: { unknowns: ['s', 'px'] }
    },
    {
      name: 'Character height for a viewing distance',
      expr: 'hc = dist * tan(a)',
      tex: 'h = D \\tan\\alpha',
      vars: {
        hc: { name: 'height of a capital letter', q: 'length', unit: 'mm', tex: 'h' },
        dist: { name: 'viewing distance', q: 'length', unit: 'm', value: 0.5, min: 0, tex: 'D' },
        a: { name: 'visual angle of the character', q: 'angle', unit: '°', value: 0.333, min: 0, max: 5, tex: '\\alpha' }
      },
      solveFor: 'hc',
      note: 'A visual angle of about 20 minutes of arc, a third of a degree, is a comfortable reading size; the minimum is lower and a safety-critical read-out wants more. Give the answer in pixels with the pixel pitch of the formula above.',
      stories: { hc: 'A panel is read from {dist} away, and capitals should span {a}. How tall must they be?' },
      practice: { unknowns: ['hc'] }
    }
  ],
  examples: [
    {
      title: 'How big is a 9 mm button?',
      q: 'The Cheap Yellow Display has a 2.8 inch panel of 320 × 240 pixels. How many pixels make a 9 mm button?',
      steps: ['The diagonal is $\\sqrt{320^2 + 240^2} = 400$ pixels, over 2.8 inches: $400 / 2.8 = 143$ pixels per inch.', 'One millimetre is $143 / 25.4 = 5.6$ pixels, so 9 mm is $9 \\times 5.6 \\approx 51$ pixels.', 'A row of three buttons with 3 mm gaps needs $3 \\times 51 + 2 \\times 17 = 187$ pixels of the 320 available: it fits easily; a keypad of five columns does not.'],
      a: 'About 51 pixels square, plus a gap of about 17 pixels between buttons.'
    }
  ],
  quiz: [
    { q: 'A 30-pixel button on a 2.8 inch 320 × 240 panel is about how big on the glass?', choices: ['2 mm', '5 mm', '9 mm', '15 mm'], a: 1, why: 'The panel has about 5.6 pixels to the millimetre, so 30 pixels is 5.3 mm: smaller than a fingertip should be asked to hit.' },
    { q: 'How quickly should a touch produce a visible reaction?', choices: ['Within about 100 ms', 'Within 5 seconds', 'Only when the job is done', 'No reaction is needed for a button'], a: 0, why: 'Under a tenth of a second feels instant. Beyond a second the user doubts the press and repeats it.' },
    { q: 'A stop button drawn on a touch screen is acceptable as the emergency stop of a machine.', a: false, why: 'A blank, frozen or broken display cannot stop the machine. Emergency stops are hard-wired; the screen may show their state.' },
    { q: 'Which is best for erasing the data log?', choices: ['A single small button next to Save', 'A press-and-hold with visible progress, away from common buttons', 'A button that erases on touch-down', 'A blinking button'], a: 1, why: 'A deliberate gesture, away from the buttons used every day, makes an accident unlikely without the cost of a dialogue.' }
  ],
  applications: [
    'Thermostat and appliance panels used with a thumb, one-handed.',
    'Machine and test-equipment screens used with gloves in poor light.',
    'Kiosks and wall panels read from a distance of one to two metres.',
    'Any device where one wrong touch costs data, money or safety.'
  ],
  sources: [
    'ISO 9241 (ergonomics of human-system interaction), the parts on visual displays and on touch interaction.',
    'Platform guidelines for touch targets from the phone makers (a 44-point or 48-dp minimum) and the WCAG contrast rules.',
    'Hyper Ergonomics, the pages on screens and controls, and on Fitts\'s law.'
  ],
  code: [
    {
      title: 'A destructive button that needs a press-and-hold',
      about: 'A large red Erase button. A tap only says "Hold to erase"; holding the button erases and says so. While the finger is down the button changes colour, which is the feedback of the pressed state.',
      needs: 'An ESP32 with a TFT and touch, LVGL 9, and the display set-up of the drivers page.',
      libs: ['lvgl (LVGL 9)'],
      blocks: `
        when started
          start LVGL display and touch :: display
          create button [Erase] at x (90) y (90) width (140) height (56) :: display
          create label [status] at x (110) y (170) :: display
          set [held v] to <false>
        when button [Erase] touched
          set [held v] to <false>
        when button [Erase] held for (0.4) seconds :: display
          set [held v] to <true>
          print [log erased]
          set label [status] to [Erased] :: display
        when button [Erase] clicked :: display
          if <not <held>> then
            set label [status] to [Hold to erase] :: display
          end
        forever
          run LVGL handler :: display
          wait (0.005) seconds
        end
      `,
      cpp: String.raw`
        #include <lvgl.h>

        void start_display();                    // display, touch and tick: see the drivers page

        static lv_style_t pressed_style;         // a style must outlive the widgets
        static lv_obj_t *status;
        static bool held = false;                // true once the long press has fired

        static void on_press(lv_event_t *e) { held = false; }

        static void on_long_press(lv_event_t *e) {
          held = true;
          Serial.println("log erased");          // the destructive action, only after a deliberate hold
          lv_label_set_text(status, "Erased");
        }

        static void on_click(lv_event_t *e) {    // CLICKED also follows a long press: ignore that one
          if (!held) lv_label_set_text(status, "Hold to erase");
        }

        void setup() {
          Serial.begin(115200);
          start_display();
          lv_obj_t *scr = lv_screen_active();

          lv_style_init(&pressed_style);
          lv_style_set_bg_color(&pressed_style, lv_color_hex(0xA02020));   // feedback while the finger is down

          lv_obj_t *btn = lv_button_create(scr);
          lv_obj_set_size(btn, 140, 56);         // about 10 mm tall on a 2.8 inch 320 x 240 panel
          lv_obj_set_style_bg_color(btn, lv_color_hex(0xE04040), 0);
          lv_obj_add_style(btn, &pressed_style, LV_STATE_PRESSED);
          lv_label_set_text(lv_label_create(btn), "Erase");
          lv_obj_center(btn);
          lv_obj_add_event_cb(btn, on_press, LV_EVENT_PRESSED, nullptr);
          lv_obj_add_event_cb(btn, on_long_press, LV_EVENT_LONG_PRESSED, nullptr);
          lv_obj_add_event_cb(btn, on_click, LV_EVENT_CLICKED, nullptr);

          status = lv_label_create(scr);
          lv_label_set_text(status, "");
          lv_obj_align(status, LV_ALIGN_BOTTOM_MID, 0, -30);
        }

        void loop() {
          lv_timer_handler();
          delay(5);
        }
      `,
      py: String.raw`
        import lvgl as lv
        import time

        lv.init()
        # the display and the touch are created here with the drivers of your LVGL firmware build

        held = False                              # true once the long press has fired

        pressed_style = lv.style_t()              # a style must outlive the widgets
        pressed_style.init()
        pressed_style.set_bg_color(lv.color_hex(0xA02020))     # feedback while the finger is down

        def on_press(e):
            global held
            held = False

        def on_long_press(e):
            global held
            held = True
            print("log erased")                   # the destructive action, only after a deliberate hold
            status.set_text("Erased")

        def on_click(e):                          # CLICKED also follows a long press: ignore that one
            if not held:
                status.set_text("Hold to erase")

        scr = lv.screen_active()
        btn = lv.button(scr)
        btn.set_size(140, 56)                     # about 10 mm tall on a 2.8 inch 320 x 240 panel
        btn.set_style_bg_color(lv.color_hex(0xE04040), 0)
        btn.add_style(pressed_style, lv.STATE.PRESSED)
        lv.label(btn).set_text("Erase")
        btn.center()
        btn.add_event_cb(on_press, lv.EVENT.PRESSED, None)
        btn.add_event_cb(on_long_press, lv.EVENT.LONG_PRESSED, None)
        btn.add_event_cb(on_click, lv.EVENT.CLICKED, None)

        status = lv.label(scr)
        status.set_text("")
        status.align(lv.ALIGN.BOTTOM_MID, 0, -30)

        while True:
            lv.timer_handler()
            time.sleep_ms(5)
      `,
      output: `log erased`,
      notes: ['The default long-press time is 400 ms, short for a destructive action. It can be lengthened for the input device; look up the setting in your LVGL version.', 'A progress ring that fills while the finger stays down tells the user what the hold is for.', 'MicroPython: needs a firmware built with the LVGL binding ([[gui-in-micropython]]).']
    }
  ],
  sim: 'tg-targets'
},

/* ================================================================ the phone as the display */
{
  id: 'web-ui-as-a-display',
  parent: 'touch-and-gui',
  title: 'The phone as the display',
  level: 2,
  short: 'No screen, no touch controller: the ESP serves a web page and the phone\'s browser is the interface. What it takes, how the page gets live data by polling or by push, and when a real display is still the better answer.',
  keywords: ['web UI', 'web interface', 'browser as display', 'WebServer', 'ESPAsyncWebServer', 'WebSocket', 'server-sent events', 'polling', 'fetch', 'mDNS', 'soft AP', 'captive portal', 'dashboard on phone', 'LittleFS', 'PWA'],
  prereq: ['gui-concepts', 'web-server-on-esp', 'wifi-station'],
  related: ['websockets', 'soft-ap-and-captive-portal', 'mdns', 'web-interface-security', 'embedding-files-and-web-pages', 'rest-apis-and-json', 'project-thermostat'],
  body: `The cheapest display is the one you already own. If a device has Wi-Fi it can serve a **web page**, and any phone, tablet or laptop becomes its screen and touch panel — with real fonts, colour, charts and a keyboard, and no display hardware on the board at all. This is how most smart plugs, routers and 3D-printer controllers are set up.

### How it works

The ESP runs a small web server ([[web-server-on-esp]]). It sends one HTML page, with its style and a few lines of JavaScript, stored in flash as a string or a file on LittleFS ([[embedding-files-and-web-pages]]). The script asks the ESP for data — \`fetch('/data')\` returns a few bytes of JSON — and updates the page; a slider or button sends \`/set?sp=21.5\` the other way. The ESP does not draw anything: the browser does, which is why it can look so good on a chip with no graphics at all.

### Getting live data to the page

- **Polling:** the page asks every second or two. Simple and robust; each request carries a few hundred bytes of headers, and a change is seen on average half a polling period late.
- **Server-sent events:** the page opens one long connection and the ESP writes lines to it as data changes; one-way and simple.
- **WebSocket:** one connection, both directions, tiny frames, instant ([[websockets]]). It needs a library on the ESP and a little more care about several clients.

The simulation compares the traffic and the delay.

### Finding it and reaching it

On your own Wi-Fi the page is at the ESP's IP address, or at a name such as \`esp32.local\` if it announces itself with mDNS ([[mdns]]). With no router — a field device, a first set-up — the ESP can be its own access point and show the page at its fixed address, often with a captive portal that opens it by itself ([[soft-ap-and-captive-portal]]).

### What it costs

- **Someone needs a phone** within Wi-Fi range, and the device needs Wi-Fi switched on, which costs power: not for a coin-cell display.
- **Security is yours.** Anyone on the network can open the page. Add a password, never expose it to the internet, and treat every request as untrusted ([[web-interface-security]]).
- **A single-core server** serves one or two clients; a page with many files or images is slow.
- **No glance value:** a wall display answers in a second without picking anything up; a web page needs a phone, a browser, a tap.

> [!key] A web page served by the ESP makes any phone its display and touch screen with no display hardware. Poll for simplicity or push over a WebSocket for speed, make the page findable by name or access point, and secure it — but keep a real display where the answer must be a glance away.`,
  ideas: [
    'The ESP serves an HTML page and a small JSON endpoint; the browser draws the interface and sends settings back with simple requests.',
    'Polling is simple but late by half a period on average and costs a request each time; push over a WebSocket or server-sent events is immediate and lighter.',
    'The page is found by IP address, an mDNS name, or the ESP\'s own access point when there is no router.',
    'Anyone on the network can open it: protect it, and keep a real display where a glance matters.'
  ],
  pitfalls: [
    'A web UI is secure because it is only on my home network — Anything on that network, including a compromised device, can reach it. Add a password and keep it off the internet.',
    'Poll as fast as possible for the freshest data — Each poll costs a request, and a single-core server falls behind. A second or two is usually right, or push when the value changes.',
    'The page can sit in a String in RAM — Large pages exhaust the heap. Keep the page in flash (a raw string in program memory, or LittleFS).'
  ],
  terms: [
    { term: 'Web UI', also: ['web interface', 'embedded web page'], def: 'An interface served by the device itself as a web page, so that any browser on the network is its screen and touch panel.' },
    { term: 'Polling', def: 'Asking for data at regular intervals whether or not it has changed. Simple, but a change is noticed on average half a period late and every request costs bytes and time.' },
    { term: 'WebSocket', def: 'A single long-lived connection between browser and server over which both sides send small messages at any moment. Data can be pushed as soon as it changes.' },
    { term: 'Server-sent events', also: ['SSE', 'EventSource'], def: 'A browser feature in which one HTTP connection stays open and the server writes lines to it whenever there is news. It is one-way: from the device to the page.' },
    { term: 'mDNS name', also: ['esp32.local', 'Bonjour name'], def: 'A name that a device announces on the local network so that it can be reached without knowing its IP address, such as esp32.local.' }
  ],
  choose: {
    good: ['A device with Wi-Fi and no screen, set or read now and then', 'Settings and logs that need a keyboard, long text or file upload', 'A first-time set-up through the ESP\'s own access point'],
    avoid: ['A device that must show a state at a glance without a phone', 'A battery device that cannot keep Wi-Fi on', 'Exposing the page to the internet without proper security'],
    check: ['How will the user find the page: an IP, a name, an access point?', 'Is it polled or pushed, and how often?', 'What protects it, and what happens when two people open it?']
  },
  formulas: [
    {
      name: 'Data used by polling',
      expr: 'B = 60 * (hdr + pay) / T',
      tex: 'B = \\frac{60\\,(H + P)}{T}',
      vars: {
        B: { name: 'bytes per minute', q: 'count', tex: 'B' },
        hdr: { name: 'bytes of HTTP headers, both ways', q: 'count', value: 500, min: 0, tex: 'H' },
        pay: { name: 'bytes of the JSON payload', q: 'count', value: 40, min: 0, tex: 'P' },
        T: { name: 'polling period', q: 'time', unit: 's', value: 1, min: 0.01, tex: 'T' }
      },
      solveFor: 'B',
      note: 'The header size is an assumption of a few hundred bytes for a typical request and response, not a measurement of one server. A WebSocket frame adds only a few bytes to the payload.',
      stories: { B: 'A page polls every {T} for {pay} of JSON, with {hdr} of headers each time. How many bytes a minute is that?' },
      practice: { unknowns: ['B'] }
    }
  ],
  quiz: [
    { q: 'A page polls every 2 seconds. A value changes at a random moment. How late does the page show it on average?', choices: ['0 s', 'About 1 s (half a period) plus the network delay', 'Exactly 2 s', 'About 4 s'], a: 1, why: 'The change falls at a random point in the 2-second cycle, so it waits half a period on average for the next request — plus the time the request and answer take.' },
    { q: 'Which approach pushes a change to the page the moment it happens?', choices: ['Polling every second', 'A WebSocket or server-sent events', 'Reloading the page', 'A longer polling period'], a: 1, why: 'Both keep a connection open and let the server write when there is news. Polling can only ask.' },
    { q: 'Keeping the device on a private Wi-Fi network is enough protection for its web page.', a: false, why: 'Every device on that network can open the page. Use a password, keep it off the internet, and validate every request.' },
    { q: 'A thermostat is controlled by a web page with no router in the house. What helps?', choices: ['Nothing, it needs a router', 'The ESP running its own access point and serving the page', 'Bluetooth Classic', 'A bigger antenna'], a: 1, why: 'In access-point mode the ESP makes its own network; the phone joins it and opens the page at the ESP\'s fixed address.' }
  ],
  applications: [
    'Settings and status pages of smart plugs, routers and sensors.',
    'A control page for a 3D printer, a garage door or a grow-light timer, opened on a phone.',
    'First-time set-up through the ESP\'s own access point with a captive portal.',
    'Live dashboards of a sensor on a laptop, with charts drawn by the browser.'
  ],
  sources: [
    'Arduino core for ESP32, the WebServer and WiFi libraries (core 3.3), and the ESPAsyncWebServer documentation.',
    'MDN Web Docs, fetch, WebSocket and EventSource (server-sent events).',
    'RFC 6455, The WebSocket Protocol.'
  ],
  code: [
    {
      title: 'A thermostat page on the phone',
      about: 'The ESP serves a page that shows the temperature and a setpoint slider. The page polls /data once a second; moving the slider sends /set. An LED on GPIO2 lights while the temperature is below the setpoint. A potentiometer stands in for the sensor.',
      needs: 'An ESP32 on your Wi-Fi network, a potentiometer on GPIO34 and the on-board or an external LED on GPIO2.',
      wiring: [['GPIO34', 'potentiometer wiper', 'an ADC1 pin; the ends go to 3V3 and GND'], ['GPIO2', 'LED', 'the heating indicator']],
      blocks: `
        when started
          set pin (2) as [output v]
          set [setpoint v] to (21)
          connect to Wi-Fi [your-ssid] password [your-password]
          start web server on port (80)
        when request for [/] arrives
          send page [thermostat page]
        when request for [/data] arrives
          set [temp v] to ((10) + (((analog read pin (34)) * (20)) / (4095)))
          set pin (2) to (<(temp) < (setpoint)>)
          send (join [{"temp":] (join (temp) (join [,"sp":] (join (setpoint) [}])))) as [json]
        when request for [/set] arrives
          set [setpoint v] to (value of [sp] in the request)
          send [ok]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>

        const char *SSID = "your-ssid";          // do not leave real credentials in shared code
        const char *PASS = "your-password";
        const int POT = 34, LED = 2;
        float setpoint = 21.0;
        WebServer server(80);

        const char PAGE[] PROGMEM = R"rawliteral(
        <!doctype html><meta name=viewport content="width=device-width,initial-scale=1">
        <h1><span id=t>--</span> &deg;C</h1><p>Setpoint <span id=sp>--</span> &deg;C</p>
        <input id=s type=range min=10 max=30 step=0.5 style="width:100%">
        <script>
        async function tick() {
          const r = await fetch('/data'); const d = await r.json();
          document.getElementById('t').textContent = d.temp.toFixed(1);
          document.getElementById('sp').textContent = d.sp.toFixed(1);
        }
        document.getElementById('s').oninput = e => fetch('/set?sp=' + e.target.value);
        setInterval(tick, 1000); tick();
        </script>
        )rawliteral";

        void handleData() {
          float t = 10 + analogRead(POT) * 20.0 / 4095;       // 10 to 30 degrees from the potentiometer
          digitalWrite(LED, t < setpoint);                    // the heating indicator
          server.send(200, "application/json", "{\"temp\":" + String(t, 1) + ",\"sp\":" + String(setpoint, 1) + "}");
        }

        void handleSet() {
          setpoint = constrain(server.arg("sp").toFloat(), 10.0, 30.0);
          server.send(200, "text/plain", "ok");
        }

        void setup() {
          pinMode(LED, OUTPUT);
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());                     // open this address on the phone
          server.on("/", []() { server.send_P(200, "text/html", PAGE); });
          server.on("/data", handleData);
          server.on("/set", handleSet);
          server.begin();
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import network, asyncio, json, time
        from machine import Pin, ADC

        SSID = "your-ssid"                       # do not leave real credentials in shared code
        PASS = "your-password"
        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)
        led = Pin(2, Pin.OUT)
        setpoint = 21.0

        PAGE = """<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">
        <h1><span id=t>--</span> &deg;C</h1><p>Setpoint <span id=sp>--</span> &deg;C</p>
        <input id=s type=range min=10 max=30 step=0.5 style="width:100%">
        <script>
        async function tick() {
          const r = await fetch('/data'); const d = await r.json();
          document.getElementById('t').textContent = d.temp.toFixed(1);
          document.getElementById('sp').textContent = d.sp.toFixed(1);
        }
        document.getElementById('s').oninput = e => fetch('/set?sp=' + e.target.value);
        setInterval(tick, 1000); tick();
        </script>"""

        async def handle(reader, writer):
            global setpoint
            line = (await reader.readline()).decode()            # for example "GET /data HTTP/1.1"
            while (await reader.readline()) != b"\r\n":          # skip the headers
                pass
            path = line.split(" ")[1]
            if path.startswith("/data"):
                t = 10 + pot.read_u16() * 20 / 65535             # 10 to 30 degrees from the potentiometer
                led.value(t < setpoint)                          # the heating indicator
                body, kind = json.dumps({"temp": round(t, 1), "sp": setpoint}), "application/json"
            elif path.startswith("/set"):
                setpoint = min(30.0, max(10.0, float(path.split("sp=")[1])))
                body, kind = "ok", "text/plain"
            else:
                body, kind = PAGE, "text/html"
            writer.write(("HTTP/1.0 200 OK\r\nContent-Type: " + kind + "\r\n\r\n" + body).encode())
            await writer.drain()
            writer.close()
            await writer.wait_closed()

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        while not wlan.isconnected():
            time.sleep_ms(250)
        print(wlan.ipconfig("addr4"))                            # open this address on the phone

        async def main():
            await asyncio.start_server(handle, "0.0.0.0", 80)
            while True:
                await asyncio.sleep(3600)

        asyncio.run(main())
      `,
      output: `192.168.1.57`,
      notes: ['Open the address printed on the serial monitor in a phone browser on the same Wi-Fi network. Never leave real credentials in shared code ([[credentials-handling]]).', 'Anyone on the network can move the slider: add a password before the device does anything that matters ([[web-interface-security]]).', 'With a WebSocket library the page would receive each new value as it happens, with no polling.']
    }
  ],
  sim: 'tg-webui'
},

/* ================================================================ encoder and button navigation */
{
  id: 'encoder-and-button-navigation',
  parent: 'touch-and-gui',
  title: 'Navigating without touch',
  level: 2,
  short: 'A rotary encoder with a push switch, or three buttons, can steer a whole interface: turn to move the focus, press to activate, press again to edit and turn to change. How focus works, how to read the knob, and how LVGL does it with a group.',
  keywords: ['rotary encoder', 'focus', 'focus group', 'lv_group_create', 'lv_group_add_obj', 'lv_indev_set_group', 'LV_INDEV_TYPE_ENCODER', 'LV_INDEV_TYPE_KEYPAD', 'enc_diff', 'edit mode', 'quadrature', 'detent', 'menu', 'knob', 'buttons only'],
  prereq: ['gui-concepts', 'rotary-encoders', 'lvgl-events-and-screens'],
  related: ['buttons-and-switches', 'long-press-double-click', 'menus-on-small-displays', 'pulse-counter-pcnt', 'hmi-design-rules', 'encoders-and-speed'],
  body: `Touch is not always the right input. Gloves, grease and wet hands, a bumpy vehicle, a tiny screen, a panel behind a window, a knob that must be found by feel: a **rotary encoder** with a push switch, or three buttons — up, down, OK — steers a whole interface, and it is why so many printers, bench supplies and car radios have a knob.

### Focus instead of pointing

With a finger you point at a widget. With a knob you move a **focus**: exactly one widget is highlighted at a time. Turning one way moves to the next widget, the other way to the previous, and pressing *activates* the focused one. The order is a **tab order** you design: top to bottom, left to right, skipping what is decorative. Make the focus unmistakable — a thick ring or a colour change, not a subtle shade.

### Editing: two modes

Pressing a button activates it; pressing a slider cannot, because the same knob would have to move the focus and change the value. The common answer is two modes. In **navigate** mode turning moves the focus. Pressing on a slider or number box enters **edit** mode — the highlight changes, perhaps to brackets — where turning changes the value, and a press or a long press leaves it. Try it in the simulation.

### Reading the knob

An encoder is two switches, A and B, that open and close 90° apart, the *quadrature* signal. Which one changes first tells the direction; the transitions tell how far. Most knobs click: one **detent** is usually four transitions of the pair. A table of valid transitions, as in the program below, counts the right way and ignores contact bounce, because bounce makes invalid transitions. Fast turning at 3 turns a second is over 200 transitions a second, so a loop that also redraws an OLED will miss some: read the knob with interrupts or the pulse counter ([[rotary-encoders]], [[pulse-counter-pcnt]]).

### In LVGL

LVGL keeps the focus in a **group**. Create one with \`lv_group_create()\`, add the widgets in tab order with \`lv_group_add_obj\`, and create the input device with type \`LV_INDEV_TYPE_ENCODER\`, linked by \`lv_indev_set_group\`. The read callback reports \`enc_diff\`, the steps since last time, and whether the switch is pressed. For up, down and OK buttons use \`LV_INDEV_TYPE_KEYPAD\` and report the keys \`LV_KEY_PREV\`, \`LV_KEY_NEXT\` and \`LV_KEY_ENTER\`. The focused widget is drawn in its \`LV_STATE_FOCUSED\` state, so a style on that state makes the ring.

### Design rules

Let the list wrap round at its ends when it is long. Accelerate: a quick turn takes bigger steps, so 0–1000 is reachable. A long press means *back*, and a timeout returns to the home screen. Give a click or a beep per detent. Where the device also has touch, support both.

> [!key] Navigate with a focus that one widget owns: turn to move it, press to activate, press on a slider to edit and turn to change. Decode the encoder with a transition table (or interrupts), put widgets in a group in tab order, and make the focus impossible to miss.`,
  ideas: [
    'A knob moves a focus from widget to widget in a designed tab order; a press activates the focused widget.',
    'Sliders and number boxes need an edit mode so the same knob can change the value; a press leaves it.',
    'An encoder is two switches in quadrature; a table of valid transitions counts the steps and ignores bounce, and fast turning needs interrupts or the pulse counter.',
    'LVGL does it with a group and an encoder or keypad input device; the focused state is styled for the ring.'
  ],
  pitfalls: [
    'One turn of the knob is one count — Most knobs give four transitions per click, and some two. Decode per detent, not per transition.',
    'Polling the knob in a loop that also redraws the screen is fine — A fast turn produces hundreds of transitions a second, and a redraw of tens of milliseconds misses them. Use interrupts or the pulse counter.',
    'A subtle focus colour is enough — On a bright or small screen it vanishes. Make the focus a ring or a strong colour change.'
  ],
  terms: [
    { term: 'Rotary encoder', also: ['rotary knob', 'incremental encoder'], def: 'A knob that gives pulses as it turns, from two switches A and B that open and close 90° apart. Most have a click at each step and a push switch on the shaft.' },
    { term: 'Quadrature', also: ['Gray code', 'A/B signals'], def: 'The two-signal pattern of an encoder: A and B change one after the other, and which leads says the direction while the number of changes says how far.' },
    { term: 'Detent', also: ['click'], def: 'One mechanical click of a rotary encoder. It is usually four transitions of the A and B pair, so the program counts per four, not per transition.' },
    { term: 'Focus', also: ['focused widget'], def: 'The one widget that currently receives key and knob input and is drawn highlighted. Turning moves it to the next widget; pressing activates it.' },
    { term: 'Group (LVGL)', also: ['lv_group_t', 'focus group'], def: 'An LVGL object that holds widgets in tab order and tracks which one is focused. An encoder or keypad input device is linked to a group.' },
    { term: 'Edit mode', def: 'A state in which turning the knob changes the focused widget\'s value instead of moving the focus. A press enters it on a slider and a press (or long press) leaves it.' }
  ],
  examples: [
    {
      title: 'Can a polling loop keep up?',
      q: 'A 20-detent encoder is turned at 3 revolutions a second. How many transitions of the A and B pair is that per second, and how long between them? Can a loop that redraws an OLED for 25 ms read it?',
      steps: ['Detents per second: $20 \\times 3 = 60$. At four transitions per detent that is $60 \\times 4 = 240$ transitions per second.', 'The time between transitions is $1 / 240 \\approx 4.2$ ms.', 'A loop that is away for 25 ms drawing the screen sees six or more transitions at once and misses steps. Read the knob in an interrupt or with the pulse counter, and draw separately.'],
      a: '240 transitions a second, one every 4.2 ms; a 25 ms redraw in the loop would miss steps.'
    }
  ],
  quiz: [
    { q: 'In an encoder-driven interface, how can the same knob both move between widgets and change a slider\'s value?', choices: ['It cannot', 'With two modes: navigate and edit, switched by a press', 'By turning faster', 'By using two knobs'], a: 1, why: 'A press on the slider enters edit mode, where turning changes the value; a press leaves it, and turning moves the focus again.' },
    { q: 'Which LVGL object keeps the order of the focusable widgets?', choices: ['A screen', 'A group', 'A style', 'A chart'], a: 1, why: 'Widgets are added to a group in tab order, and the encoder or keypad input device is linked to that group.' },
    { q: 'An encoder gives exactly one transition per click.', a: false, why: 'Most encoders give four transitions of the A and B pair per click (some two). Count per detent.' },
    { q: 'Why does a table of valid transitions help decode an encoder?', choices: ['It makes the knob faster', 'Invalid transitions, as contact bounce makes, add nothing to the count', 'It removes the push switch', 'It needs no pull-ups'], a: 1, why: 'Only the sequences that follow the Gray code add or subtract one step. Chatter produces impossible jumps that the table scores as zero.' }
  ],
  applications: [
    'Menus of 3D printers, bench power supplies and test instruments, with a knob and a push switch.',
    'Car and audio panels, where the knob is found by feel and used without looking.',
    'Round smart knobs such as the Elecrow CrowPanel rotary display and the LilyGO T-Encoder-Pro.',
    'Devices with a small OLED and three buttons: up, down and OK.'
  ],
  sources: [
    'LVGL documentation: Input devices (encoder and keypad types) and Groups (version 9).',
    'The data sheet of a mechanical encoder such as the Bourns PEC11 or the ALPS EC11: the quadrature timing and detent counts.',
    'Arduino core documentation for pinMode and the ESP32 GPIO functions (core 3.3), and the MicroPython machine.Pin documentation.'
  ],
  code: [
    {
      title: 'An encoder menu on an OLED',
      about: 'Three settings on an OLED. Turning the knob moves the marker; a press puts the selected setting in edit mode, shown in brackets, where turning changes its value; another press leaves it. The knob is decoded with a table of valid transitions.',
      needs: 'An ESP32, a 128 × 64 SSD1306 OLED on I2C and a rotary encoder with a push switch.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL'], ['GPIO32', 'encoder A', 'internal pull-up; the common pin to GND'], ['GPIO33', 'encoder B', 'internal pull-up'], ['GPIO25', 'encoder switch → GND', 'internal pull-up']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX'],
      blocks: `
        when started
          set [selected v] to (0)
          set [editing v] to <false>
          start display [SSD1306 128×64 v]
          show the menu :: my
        when encoder turned by (turn)
          if <editing> then
            set item (selected) of [values v] to (constrain ((item (selected) of [values v]) + ((5) * (turn))) from (0) to (100))
          else
            set [selected v] to (((selected) + (turn)) mod (3))
          end
          show the menu :: my
        when encoder switch pressed
          set [editing v] to <not <editing>>
          show the menu :: my
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 oled(128, 64, &Wire, -1);
        const int PIN_A = 32, PIN_B = 33, PIN_SW = 25;     // encoder A, B and the push switch, all to GND

        const char *names[] = { "Brightness", "Volume", "Contrast" };
        int values[] = { 70, 40, 55 };
        const int N = 3;
        int selected = 0;
        bool editing = false;

        // the change for each (previous, now) pair of A and B: valid Gray-code steps only
        const int8_t STEP[16] = { 0, 1, -1, 0, -1, 0, 0, 1, 1, 0, 0, -1, 0, -1, 1, 0 };
        uint8_t prevState;
        int acc = 0;                                       // four transitions make one click
        bool lastSw = HIGH;

        void draw() {
          oled.clearDisplay();
          oled.setTextColor(SSD1306_WHITE);
          for (int i = 0; i < N; i++) {
            oled.setCursor(0, 4 + i * 16);
            oled.print(i == selected ? (editing ? "[" : ">") : " ");
            oled.printf("%-10s %3d", names[i], values[i]);
            if (i == selected && editing) oled.print("]");
          }
          oled.display();
        }

        void setup() {
          pinMode(PIN_A, INPUT_PULLUP);
          pinMode(PIN_B, INPUT_PULLUP);
          pinMode(PIN_SW, INPUT_PULLUP);
          Wire.begin(21, 22);
          oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
          prevState = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          draw();
        }

        void loop() {
          uint8_t state = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          if (state != prevState) {
            acc += STEP[(prevState << 2) | state];
            prevState = state;
            int turn = 0;
            if (acc >= 4) { turn = 1; acc = 0; }
            else if (acc <= -4) { turn = -1; acc = 0; }
            if (turn) {
              if (editing) values[selected] = constrain(values[selected] + 5 * turn, 0, 100);
              else selected = (selected + turn + N) % N;
              draw();
            }
          }
          bool sw = digitalRead(PIN_SW);
          if (lastSw == HIGH && sw == LOW) {               // a press toggles edit mode
            editing = !editing;
            draw();
            delay(20);                                     // a crude debounce
          }
          lastSw = sw;
        }
      `,
      py: String.raw`
        from machine import Pin, I2C
        import ssd1306
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21))
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)
        pin_a = Pin(32, Pin.IN, Pin.PULL_UP)               # encoder A, B and the push switch, all to GND
        pin_b = Pin(33, Pin.IN, Pin.PULL_UP)
        sw = Pin(25, Pin.IN, Pin.PULL_UP)

        names = ["Brightness", "Volume", "Contrast"]
        values = [70, 40, 55]
        N = 3
        selected = 0
        editing = False

        # the change for each (previous, now) pair of A and B: valid Gray-code steps only
        STEP = (0, 1, -1, 0, -1, 0, 0, 1, 1, 0, 0, -1, 0, -1, 1, 0)
        prev_state = (pin_a.value() << 1) | pin_b.value()
        acc = 0                                            # four transitions make one click
        last_sw = 1

        def draw():
            oled.fill(0)
            for i in range(N):
                mark = ("[" if editing else ">") if i == selected else " "
                end = "]" if i == selected and editing else ""
                oled.text("%s%-10s %3d%s" % (mark, names[i], values[i], end), 0, 4 + i * 16)
            oled.show()

        draw()
        while True:
            state = (pin_a.value() << 1) | pin_b.value()
            if state != prev_state:
                acc += STEP[(prev_state << 2) | state]
                prev_state = state
                turn = 0
                if acc >= 4:
                    turn, acc = 1, 0
                elif acc <= -4:
                    turn, acc = -1, 0
                if turn:
                    if editing:
                        values[selected] = min(100, max(0, values[selected] + 5 * turn))
                    else:
                        selected = (selected + turn) % N
                    draw()
            s = sw.value()
            if last_sw == 1 and s == 0:                    # a press toggles edit mode
                editing = not editing
                draw()
                time.sleep_ms(20)                          # a crude debounce
            last_sw = s
      `,
      output: `(the OLED shows:)
>Brightness  70
 Volume      40
 Contrast    55`,
      notes: ['Polling is fine for slow turning. Fast turning needs the knob read by interrupts or the pulse counter, and the screen redrawn separately ([[rotary-encoders]]).', 'The direction depends on how A and B are wired: swap the two pins, or the sign of the step, if clockwise goes the wrong way.', 'Encoders with two transitions per click need the threshold changed from 4 to 2.']
    }
  ],
  sim: 'tg-encoder'
}
);
