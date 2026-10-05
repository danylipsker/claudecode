/* HYPER-ESP32 · content/maker-board-families.js
 *
 * Topic "Maker board families" (parent: boards-and-makers). Board facts come from the catalogue (Hyper.esp.BOARDS):
 * Adafruit, SparkFun, Arduino, LOLIN (WEMOS), the generic NodeMCU / DOIT / D1 mini clones, Unexpected Maker, DFRobot, Olimex.
 * Simulations: sims/maker-board-families.js (ids mb-*).
 */
Hyper.add(
/* ================================================================ form factors */
{
  id: 'form-factors',
  parent: 'maker-board-families',
  title: 'Form factors: Feather, D1 mini, Nano, Uno, XIAO',
  level: 1,
  short: 'A form factor is a promise about the outline, the pin order and what plugs on top. Keep the promise and a whole family of boards, shields and wings fits together; break it and you are back to wiring by hand.',
  keywords: ['form factor', 'Feather', 'FeatherWing', 'D1 mini shield', 'Nano', 'UNO shield', 'MKR', 'XIAO', 'QT Py', 'Thing Plus', 'footprint', '2.54 mm', '0.1 inch', 'pitch', 'shield', 'wing', 'compatible'],
  prereq: ['chip-module-board', 'anatomy-of-a-dev-board', 'reading-a-pinout'],
  related: ['the-xiao-form-factor', 'adafruit-feather-boards', 'lolin-d1-mini-family', 'arduino-nano-esp32', 'gpio-numbers-and-board-labels', 'choosing-a-board'],
  body: `A development board is a chip with some helpers. A **form factor** is an agreement made above that: *this* outline, *these* rows of holes at *this* spacing, *this* order of signals, so that something else can be built to fit. A display that stacks on top, an enclosure that drops over the lot. One maker proposes the shape, others copy it, and a board you have never seen becomes a drop-in.

### What each outline promises

| Form factor | Size | What it promises |
|---|---|---|
| Feather (Adafruit) | about 23 × 51–52 mm | Two rows of holes at 0.1 inch in a fixed order, a connector and charger for one LiPo cell, and *FeatherWings* that stack on top |
| Thing Plus (SparkFun) | 22.9 × 64.8 mm | The Feather hole pattern on a longer board, with room for a microSD slot and a Qwiic connector |
| D1 mini (LOLIN) | 25.6 × 34.2 mm | Two rows of eight pins and a large family of shields that stack on top; the S2, S3 and C3 minis copy the outline |
| Arduino Nano | 18 × 45 mm | A narrow board with two rows of 15 pins that plugs into a socket or a breadboard |
| Arduino UNO | about 69 × 53 mm | The big shield header; ESP boards in this shape run at 3.3 V while many shields were made for 5 V |
| Arduino MKR | about 62 × 25 mm | A narrow board with a header down each side |
| XIAO and QT Py | 17.8 × 21–22 mm | Thumb-sized, seven pads down each side |

(The UNO and MKR sizes are the makers' round figures; the rest are catalogue values.)

### The promise has layers

The outline is the first layer, the **pin order** the second, the **voltage** the third. An UNO shield may assume 5 V, while an ESP32 board in the UNO shape, such as SparkFun's IoT RedBoard ESP32, is still a 3.3 V board.

The pin *order* is kept by the family, but the GPIO behind each label is not. On a LOLIN D1 mini (ESP8266) the label D2 is GPIO4; on the ESP32 board sold as a D1 mini clone it is GPIO21. The shield fits both and talks to the wrong pin on one of them: see [[gpio-numbers-and-board-labels]] and the translator under [[nodemcu-and-doit-boards]].

### Connectors are a separate promise

Qwiic and STEMMA QT are one four-wire I2C cable (3.3 V, ground, data, clock) with a small polarised plug; Grove and LOLIN's I2C port are their makers' versions of the same idea. They standardise the *cable*, not the board, so any outline can carry one. See [[qt-py-and-stemma-qt]], [[sparkfun-thing-plus-and-qwiic]], [[grove-system]].

### When a clone bends the rule

The board sold as WEMOS D1 mini ESP32 is 31 × 39 mm with 40 pins, so it overhangs a real D1 mini shield, and LOLIN never made it. "Compatible" on a listing usually means that the holes line up. Before buying a stack check the pin count, the header height and the voltage.

> [!key] A form factor fixes the outline and pin order so that shields, wings and cases fit boards with different chips. It does not fix the GPIO behind each label or the voltage a shield expects: check both, and use the names the board package defines instead of raw numbers.`,
  ideas: [
    'A form factor fixes the outline, the pin order and what stacks on top, so that shields, wings and enclosures fit boards with different chips.',
    'The same hole pattern can carry an ESP8266, an ESP32 or an ESP32-S3; what changes is the GPIO behind each label.',
    'Connectors such as Qwiic and STEMMA QT standardise a cable, not a board outline.',
    'Clones often keep the holes and change the size, the voltage or the labels.'
  ],
  pitfalls: [
    'A shield for the D1 mini fits any board called D1 mini — Only the holes are promised. The ESP32 clone with that name is wider, and the label D2 reaches a different GPIO on it.',
    'The same outline means the same pins — The order of the labels is kept; the GPIO numbers behind them follow the chip. Code written with raw GPIO numbers breaks when the chip changes.',
    'Qwiic is a size of board — It is a connector and cable standard. Feathers, Thing Plus boards, QT Py and many others all carry it.'
  ],
  terms: [
    { term: 'Form factor', also: ['board format', 'footprint family'], def: 'An agreed outline, hole pattern and pin order for a board, so that shields, wings and cases built for one board fit every other board that keeps the agreement.' },
    { term: 'Shield', also: ['wing', 'FeatherWing', 'hat'], def: 'A small board that stacks on a development board through its headers and adds one function, such as a relay, a display or a charger. Wings are the Feather name for the same idea.' },
    { term: 'Pitch', also: ['2.54 mm', '0.1 inch'], def: 'The distance between neighbouring pins or holes. The standard header pitch of maker boards is 0.1 inch, which is 2.54 mm and fits a breadboard.' },
    { term: 'Castellated pad', also: ['castellation', 'half-hole'], def: 'A half-hole cut into the edge of a small board, so that it can be soldered flat onto another board or fitted with pins. Thumb-sized boards use them.' }
  ],
  choose: {
    good: ['A shape you can buy shields and cases for in years to come: Feather, D1 mini, Nano, XIAO', 'A stack that must be assembled without soldering: a Feather with wings, or Qwiic cables', 'Changing the chip later while keeping the hardware around it'],
    avoid: ['Buying "compatible" boards without checking size, pitch and voltage', 'Shields made for 5 V logic, unless you add level shifting', 'A clone with no maker documentation for its pin order'],
    check: ['The pin count and header spacing against your shield', 'Which GPIO each label reaches on your chip', 'Whether the board has a charger and a 3.3 V supply big enough for the whole stack']
  },
  code: [
    {
      title: 'Write the pin map once',
      about: 'Prints the pins this board package defines and opens the I2C bus on them. The sketch names SDA and SCL instead of numbers, so it moves between boards of one family unchanged. MicroPython has no board package: there the pins live in one table at the top, which is the only thing to edit.',
      needs: 'A LOLIN D32, or any classic ESP32 board; the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [SDA is GPIO ] (SDA pin of this board))
          print (join [SCL is GPIO ] (SCL pin of this board))
          start I2C on SDA (SDA pin of this board) SCL (SCL pin of this board)
      `,
      cpp: String.raw`
        #include <Wire.h>

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("SDA is GPIO%d, SCL is GPIO%d\n", SDA, SCL);          // names from the board package
          Serial.printf("SPI: SCK %d, MISO %d, MOSI %d, SS %d\n", SCK, MISO, MOSI, SS);
        #ifdef LED_BUILTIN
          Serial.printf("LED_BUILTIN is GPIO%d\n", LED_BUILTIN);
        #else
          Serial.println("this board package defines no LED_BUILTIN");
        #endif
          Wire.begin();                                                      // uses SDA and SCL of the selected board
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin, I2C

        # MicroPython has no board package: write the board's pins once, here.
        PINS = {"sda": 21, "scl": 22, "sck": 18, "miso": 19, "mosi": 23, "ss": 5, "led": 5}

        print("SDA is GPIO%d, SCL is GPIO%d" % (PINS["sda"], PINS["scl"]))
        print("SPI: SCK %d, MISO %d, MOSI %d, SS %d" % (PINS["sck"], PINS["miso"], PINS["mosi"], PINS["ss"]))
        print("LED_BUILTIN is GPIO%d" % PINS["led"])
        i2c = I2C(0, scl=Pin(PINS["scl"]), sda=Pin(PINS["sda"]), freq=400000)
      `,
      output: `
        SDA is GPIO21, SCL is GPIO22
        SPI: SCK 18, MISO 19, MOSI 23, SS 5
        LED_BUILTIN is GPIO5
      `,
      notes: ['The numbers shown are those of the LOLIN D32 in the board catalogue. Select a Feather or a D1 mini in the board menu and the Arduino version prints that board\'s own numbers.', 'Many classic ESP32 boards use 21 and 22 for I2C, but not all: the Adafruit HUZZAH32 uses 23 and 22. Names in the code are safer than numbers.']
    }
  ],
  quiz: [
    { q: 'A relay shield made for the ESP8266 D1 mini is stacked on the ESP32 board sold as "WEMOS D1 mini ESP32". The sketch drives the relay with pin number 5, the GPIO behind D1 on the ESP8266 board. What happens?', choices: ['It works: D1 is the same pin on every board', 'It drives whatever the clone has on GPIO5, which is the label D8, not the relay', 'It cannot compile', 'The shield burns out at once'], a: 1, why: 'On the ESP8266 D1 mini the label D1 is GPIO5. On the ESP32 clone D1 is GPIO22 and GPIO5 is D8. The shield fits and the sketch talks to the wrong pin. Use the label names the board package defines.' },
    { q: 'Which board keeps the Feather hole pattern but is longer, at 64.8 mm?', choices: ['The LOLIN D1 mini', 'SparkFun\'s Thing Plus', 'The Arduino Nano ESP32', 'The XIAO'], a: 1, why: 'The Thing Plus family copies the Feather header and adds room for a microSD slot and a Qwiic connector. The Feather itself is about 51–52 mm long.' },
    { q: 'A Qwiic or STEMMA QT connector defines the outline of a board.', a: false, why: 'It standardises a four-wire 3.3 V I2C cable and plug. Boards of any size carry it, which is why it appears on Feathers, Thing Plus boards and thumb-sized QT Py boards alike.' },
    { q: 'You have a shield built for the 5 V logic of a classic UNO. Why is an ESP32 board in the UNO shape not automatically safe for it?', choices: ['It has fewer pins', 'The ESP32 pins are 3.3 V devices, so 5 V signals from the shield can damage them', 'It cannot run Arduino code', 'The headers are a different pitch'], a: 1, why: 'The fit says nothing about voltage. The ESP32 family runs at 3.3 V, and its pins are not 5 V tolerant, so a shield that drives 5 V signals needs level shifting or a 3.3 V version.' }
  ],
  applications: [
    'Stacking a display, a motor driver and a battery wing on one Feather with no wiring at all.',
    'Moving a project from an ESP8266 D1 mini to a C3 or S3 mini and keeping the shields and the case.',
    'Reusing an Arduino shield on an ESP32 board in the UNO shape, after checking the voltage.',
    'Printing one enclosure for a whole family of thumb-sized boards.'
  ],
  sources: [
    'Adafruit Learning System, the Feather specification and the FeatherWing guidelines.',
    'LOLIN (WEMOS) documentation, the D1 mini and D1 mini shield pages.',
    'Arduino documentation, the hardware pages of the Nano ESP32, UNO R4 WiFi and MKR WiFi 1010.'
  ],
  sim: 'mb-form-factors'
},

/* ================================================================ Adafruit Feather */
{
  id: 'adafruit-feather-boards',
  parent: 'maker-board-families',
  title: 'Adafruit Feather ESP32 boards',
  level: 1,
  short: 'The Feather is a 23 × 51 mm board with a LiPo charger, a fixed header and stackable wings. Adafruit makes one for every ESP32-family chip that matters, with STEMMA QT, a NeoPixel and CircuitPython on top.',
  keywords: ['Adafruit', 'Feather', 'HUZZAH32', 'ESP32 Feather V2', 'ESP32-S2 Feather', 'ESP32-S3 Feather', 'ESP32-C6 Feather', 'FeatherWing', 'STEMMA QT', 'NeoPixel', 'LiPoly', 'MAX17048', 'CircuitPython', 'WipperSnapper', 'reverse TFT'],
  prereq: ['form-factors', 'anatomy-of-a-dev-board', 'lithium-cells'],
  related: ['qt-py-and-stemma-qt', 'sparkfun-thing-plus-and-qwiic', 'esp-as-a-co-processor', 'measuring-battery-level', 'choosing-a-board', 'circuitpython-on-esp'],
  body: `Adafruit's **Feather** is the best-known board shape in the maker world: 23 mm wide and about 51 mm long, two rows of holes at 0.1 inch, a connector for a single lithium-polymer cell with a charger beside it, and a promise that any *FeatherWing* will stack on top. The catalogue holds a Feather for every ESP32-family chip that matters.

### The ESP32 Feathers

| Board | Chip | Memory | Distinctive |
|---|---|---|---|
| HUZZAH32 | ESP32 (WROOM-32) | 4 MB flash | The first ESP32 Feather, with Micro-B USB |
| ESP32 Feather V2 | ESP32 (PICO module) | 8 MB flash, 2 MB PSRAM | USB-C, STEMMA QT, NeoPixel; about 70 µA asleep from a LiPoly, says Adafruit |
| ESP32-S2 Feather, with TFT versions | ESP32-S2 | 4 MB flash, 2 MB PSRAM | Native USB; the TFT versions carry a 1.14 inch 240 × 135 display |
| ESP32-S3 Feather | ESP32-S3 | 4 MB + 2 MB PSRAM, or 8 MB and no PSRAM | Native USB; TFT versions too |
| ESP32-C6 Feather | ESP32-C6 | 4 MB flash | Wi-Fi 6, Thread and Zigbee; USB Serial/JTAG only |

### What Adafruit builds around the chip

**Charging and a gauge.** The newer boards charge a cell from USB-C. The S3 and C6 Feathers add a MAX17048 fuel gauge on I2C and the S2 TFT an LC709203, so the sketch can ask for a percentage. The HUZZAH32 and the V2 give only a voltage: on the V2 it reaches GPIO35 through two 200 kΩ resistors, so the pin sees half of the cell voltage.

**A switched power pin.** To sleep with almost nothing on, the boards cut the 3.3 V of the NeoPixel and the STEMMA QT port. On the V2 that pin is GPIO2; on the S3 Feather the NeoPixel has its own (GPIO21) and the STEMMA QT port another (GPIO7). If the sketch forgets to drive it high, the LED stays dark and the sensor port is dead.

**STEMMA QT and CircuitPython.** The small four-wire connector is Qwiic compatible. Software support is wide: Arduino, ESP-IDF, CircuitPython, community MicroPython and WipperSnapper.

### The same label, a different GPIO

The Feather promises the *order* of the holes, not the GPIO behind them. I2C data is GPIO23 on the HUZZAH32, 22 on the V2, 3 on the S3 and 19 on the C6. A sketch with \`Wire.begin(23, 22)\` is right for one board and silently wrong on the next; one that calls \`Wire.begin()\` and relies on the SDA and SCL names of the board package moves with the board. The simulation below puts the pin maps side by side.

### Traps

- On the classic ESP32 Feathers the ADC2 pins (A0, A1 and A5 on the V2) cannot be read while Wi-Fi is on, and GPIO12 is a [[strapping-pins|strapping pin]] that must be low at reset.
- The C6 Feather has its boot button and its NeoPixel on the same GPIO9, and no native USB: it cannot act as a keyboard or a disk.

> [!key] The Feather gives you a charger, a fixed header and stackable wings on every ESP32-family chip, but the GPIO behind each hole changes with the chip. Switch on the board's power pin for the NeoPixel and the STEMMA QT port, and use names instead of numbers.`,
  ideas: [
    'Every Feather has a LiPo connector and charger, a fixed header order and a place for wings; the chip behind it changes.',
    'The NeoPixel and STEMMA QT port sit behind a switched power pin that the sketch must turn on.',
    'The same label lands on a different GPIO on each Feather: use names such as SDA and SCL, not numbers.',
    'Some Feathers measure the cell through a resistor divider, some with an I2C fuel gauge.'
  ],
  pitfalls: [
    'The NeoPixel does not light, so the board is dead — On the V2 its 3.3 V is switched by GPIO2 and on the S3 by GPIO21. Drive that pin high first.',
    'All Feathers have the same pins — Only the order of the holes is shared. The I2C data pin is GPIO23, 22, 3 or 19 on four of them.',
    'The battery pin reads the cell voltage — On the V2 the pin sees half of it through two equal resistors. Double the reading.'
  ],
  terms: [
    { term: 'Feather', also: ['Feather form factor'], def: 'Adafruit\'s board format: about 23 × 51 mm, two rows of 0.1 inch holes in a fixed order, a LiPo connector with a charger, and a reset pin, so that FeatherWings stack on it.' },
    { term: 'FeatherWing', also: ['wing'], def: 'A board that stacks on a Feather\'s header and adds one function, such as a display, a motor driver, a radio or an extra Wi-Fi chip.' },
    { term: 'STEMMA QT', also: ['Qwiic-compatible connector'], def: 'Adafruit\'s four-pin 3.3 V I2C connector. It uses the same plug and wiring as SparkFun\'s Qwiic, so cables and boards of the two makers connect.' },
    { term: 'Fuel gauge', also: ['battery gauge', 'MAX17048'], def: 'A small chip that estimates a lithium cell\'s remaining charge from its voltage and reports it over I2C as a percentage. It is more reliable than reading the voltage through the ADC.' },
    { term: 'Switched power pin', also: ['NEOPIXEL_I2C_POWER', 'peripheral power'], def: 'A GPIO that turns a board\'s peripheral supply on and off, so that the LED and the sensor port draw nothing while the chip sleeps. The sketch must switch it on before using them.' }
  ],
  choose: {
    good: ['Battery projects that want a charger, a gauge and wings without soldering', 'CircuitPython or WipperSnapper work, where Adafruit supplies the board definition', 'A project that will stack a display, a radio or a motor wing on the board'],
    avoid: ['The original HUZZAH32 for a new design: the V2 has more memory, USB-C and STEMMA QT', 'The C6 Feather as a USB keyboard or disk: it has no native USB', 'Counting on every pin of the header being free: some are taken by the NeoPixel, the buttons or the gauge'],
    check: ['Which GPIO is the I2C bus on your chip, and which is the switched power pin', 'Whether the board has a gauge chip or only a voltage to read', 'That the wing you want expects the signals your Feather puts on those holes']
  },
  code: [
    {
      title: 'Light the NeoPixel of a Feather ESP32 V2',
      about: 'Turns on the switched power of the NeoPixel and the STEMMA QT port, then cycles green, blue and off. Without the power pin the LED never lights.',
      needs: 'An Adafruit ESP32 Feather V2 and a USB-C data cable.',
      wiring: [['GPIO2', 'switched 3.3 V for the NeoPixel and STEMMA QT port', 'on the board'], ['GPIO0', 'NeoPixel data', 'on the board']],
      blocks: `
        when started
          set pin (2) as [output v]
          set pin (2) to [HIGH v]
          set up (1) pixel on pin (0)
        forever
          set pixel (0) to colour (0) (40) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (40)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (0)
          show pixels
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int NEOPIXEL_PIN = 0;      // data pin of the NeoPixel on the Feather ESP32 V2
        const int NEOPIXEL_POWER = 2;    // switches 3.3 V to the NeoPixel and the STEMMA QT port

        void setup() {
          pinMode(NEOPIXEL_POWER, OUTPUT);
          digitalWrite(NEOPIXEL_POWER, HIGH);          // without this the LED stays dark
        }

        void loop() {
          rgbLedWrite(NEOPIXEL_PIN, 0, 40, 0);         // green
          delay(500);
          rgbLedWrite(NEOPIXEL_PIN, 0, 0, 40);         // blue
          delay(500);
          rgbLedWrite(NEOPIXEL_PIN, 0, 0, 0);          // off
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        NEOPIXEL_PIN = 0       # data pin of the NeoPixel on the Feather ESP32 V2
        NEOPIXEL_POWER = 2     # switches 3.3 V to the NeoPixel and the STEMMA QT port

        power = Pin(NEOPIXEL_POWER, Pin.OUT)
        power.value(1)                          # without this the LED stays dark
        np = NeoPixel(Pin(NEOPIXEL_PIN), 1)

        while True:
            for colour in ((0, 40, 0), (0, 0, 40), (0, 0, 0)):    # green, blue, off
                np[0] = colour
                np.write()
                time.sleep_ms(500)
      `,
      notes: ['On the S3 Feather the NeoPixel is on GPIO33 with its power on GPIO21; on the C6 Feather the pixel is on GPIO9 with its power on GPIO20. Take the numbers from your board\'s page in the catalogue.', 'GPIO0 is also the boot pin: leave the BOOT button alone while the board resets.']
    },
    {
      title: 'Read the LiPoly voltage',
      about: 'The Feather ESP32 V2 feeds the battery through two equal 200 kΩ resistors to GPIO35, so the pin sees half of the cell voltage. The program doubles the reading.',
      needs: 'An Adafruit ESP32 Feather V2 with a LiPoly cell on its JST connector (or just USB: then it shows the charger\'s voltage).',
      wiring: [['GPIO35', 'battery voltage ÷ 2', 'two 200 kΩ resistors, on the board']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [mv v] to ((analog read pin (35) in millivolts) * (2))
          print (join [battery: ] (mv))
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int BATTERY_PIN = 35;      // battery voltage through two equal resistors (halved)

        void setup() {
          Serial.begin(115200);
          delay(1000);
        }

        void loop() {
          uint32_t mv = analogReadMilliVolts(BATTERY_PIN) * 2;    // undo the divider
          Serial.printf("battery: %u mV\n", (unsigned)mv);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        BATTERY_PIN = 35        # battery voltage through two equal resistors (halved)
        adc = ADC(Pin(BATTERY_PIN), atten=ADC.ATTN_11DB)

        while True:
            mv = int(adc.read_uv() / 1000 * 2)       # undo the divider
            print("battery: %d mV" % mv)
            time.sleep_ms(2000)
      `,
      output: `
        battery: 3987 mV
        battery: 3985 mV
      `,
      notes: ['The ADC is not perfectly linear, so treat the reading as good to a few per cent; the S3 and C6 Feathers have a fuel gauge for a better figure.', 'Charge a LiPo cell only through the board\'s own charger. Never feed a bare cell from a GPIO or a lab supply: a swollen, punctured or shorted cell burns.']
    }
  ],
  quiz: [
    { q: 'A Feather ESP32 V2 runs a correct NeoPixel program, but the LED stays dark. What is the most likely missing step?', choices: ['A pull-up resistor on GPIO0', 'Driving the switched power pin (GPIO2) high', 'A USB data cable', 'Enabling Wi-Fi'], a: 1, why: 'The V2 cuts the 3.3 V of the NeoPixel and the STEMMA QT port to save current in sleep. Until GPIO2 is driven high the LED has no supply.' },
    { q: 'A sketch calls Wire.begin(23, 22), correct for the HUZZAH32, and is uploaded unchanged to an ESP32 Feather V2. What do you see?', choices: ['It works: both are Feathers', 'The I2C bus is on other pins, so a scan finds nothing', 'It will not compile', 'The board resets'], a: 1, why: 'On the V2 the I2C data pin is GPIO22 and the clock GPIO20, as the catalogue lists. The code drives GPIO23 and GPIO22, so the sensor never answers. Wire.begin() with no arguments uses the board package\'s names and avoids the problem.' },
    { q: 'On the Feather ESP32 V2, analogReadMilliVolts(35) returns 1950. What is the cell voltage?', choices: ['1.95 V', '3.9 V', '3.3 V', '4.2 V'], a: 1, why: 'The pin sees half the cell voltage through two equal 200 kΩ resistors, so the cell is at 1.95 V × 2 = 3.9 V.' },
    { q: 'Every ESP32-family Feather can act as a USB keyboard.', a: false, why: 'The C6 Feather has only USB Serial/JTAG, and the classic ESP32 Feathers reach USB through a serial chip. The S2 and S3 Feathers have native USB and can.' }
  ],
  applications: [
    'Battery-powered sensors that report over Wi-Fi, with the charger and gauge already on the board.',
    'Pocket gadgets that stack a display or a radio FeatherWing under a TFT Feather.',
    'CircuitPython teaching boards, where the USB drive appears when the board is plugged in.',
    'Adding Wi-Fi to a Feather that has none, with an AirLift FeatherWing ([[esp-as-a-co-processor]]).'
  ],
  sources: [
    'Adafruit Learning System, product guides of the ESP32 Feather V2, the ESP32-S3 Feather and the ESP32-C6 Feather.',
    'Espressif, datasheets of the ESP32, ESP32-S2, ESP32-S3 and ESP32-C6.',
    'Adafruit, the Feather specification and STEMMA QT documentation.'
  ],
  sim: { id: 'mb-feather-pins', params: { set: 'feather' } }
},

/* ================================================================ SparkFun Thing Plus and Qwiic */
{
  id: 'sparkfun-thing-plus-and-qwiic',
  parent: 'maker-board-families',
  title: 'SparkFun Thing Plus and Qwiic',
  level: 1,
  short: 'SparkFun keeps the Feather hole pattern, stretches the board to fit a microSD slot and a Qwiic connector, and makes one for the ESP32, S2, S3, C5 and C6. Qwiic is the four-wire cable that makes sensors a matter of plugging in.',
  keywords: ['SparkFun', 'Thing Plus', 'Qwiic', 'STEMMA QT', 'IoT RedBoard', 'MicroMod', 'Qwiic Pocket', 'Pro Micro', 'DataLogger IoT', 'microSD', 'MAX17048', 'daisy chain', 'I2C', 'fuel gauge'],
  prereq: ['form-factors', 'i2c', 'anatomy-of-a-dev-board'],
  related: ['adafruit-feather-boards', 'qt-py-and-stemma-qt', 'i2c-addresses-and-scanning', 'i2c-pull-ups-and-bus-problems', 'sd-cards', 'choosing-a-board'],
  body: `SparkFun's **Thing Plus** keeps the Feather's hole pattern and stretches the board to 64.8 mm, which buys room for a microSD slot, a Qwiic connector and a fuel gauge. There is one for the classic ESP32, the S2, S3, C5 and C6. Around them sits SparkFun's other big idea, **Qwiic**.

### Qwiic in one paragraph

Qwiic is a small polarised plug with four wires: 3.3 V, ground, SDA and SCL. Nothing more than I2C, but with no soldering: a chain of sensors is one cable after another. Adafruit's STEMMA QT uses the same plug and wiring, and the two mix freely. The limits are those of I2C itself: two sensors with the same address clash, every board adds some wire capacitance and often its own pull-up resistors (they add in parallel as the chain grows), and everything on the cable is a 3.3 V device ([[i2c-addresses-and-scanning]], [[i2c-pull-ups-and-bus-problems]]).

### The Thing Plus boards

| Board | Chip and memory | On the board |
|---|---|---|
| Thing Plus ESP32 WROOM (USB-C or Micro-B) | ESP32-WROOM-32E, 16 MB flash | microSD (chip select GPIO5), Qwiic, MAX17048 gauge; the USB-C version adds a WS2812 LED on GPIO2 |
| Thing Plus ESP32-S2 WROOM | ESP32-S2, 4 MB flash | Qwiic, LiPo connector |
| Thing Plus ESP32-S3 | ESP32-S3-MINI-1-N4R2, 4 MB flash + 2 MB PSRAM | microSD on SDIO, native USB with OTG, Qwiic on IO8 and IO9 |
| Thing Plus ESP32-C6 | ESP32-C6-WROOM-1-N16, 16 MB flash | Wi-Fi 6, Thread and Zigbee, microSD, Qwiic |
| Thing Plus ESP32-C5 | 8 MB flash + 8 MB PSRAM | dual-band Wi-Fi, shipped with MicroPython; library support lags the older chips |

The same maker sells other shapes: the **IoT RedBoard ESP32** in the UNO footprint with microSD and Qwiic (3.3 V logic), the one-inch **Qwiic Pocket** ESP32-C6, a **Pro Micro** ESP32-C3, the **MicroMod** processor board for an M.2 carrier, and the **DataLogger IoT**, which logs Qwiic sensors to a card with no code.

### Details that bite

- **Qwiic power on GPIO0.** On the WROOM board the Qwiic 3.3 V is switched by GPIO0, so pressing BOOT (which pulls that pin low) momentarily cuts power to the sensors. Leave the pin alone.
- **The S3's second rail.** The Qwiic and I2C pins sit on a switchable peripheral rail from a second regulator whose enable is tied to IO45; a jumper decides whether it is always on. If sensors vanish while the chip sleeps, look there.
- **A pull-down on the status LED.** GPIO13 carries the blue status LED with a pull-down, and the JTAG pads include GPIO12, a [[strapping-pins|strapping pin]].

### Same holes, other pins

As on the Feather, the hole order is shared and the GPIO is not: the WROOM Thing Plus puts I2C on GPIO21 and 22, the S3 on GPIO8 and 9. The simulation compares the pin maps in the catalogue.

> [!key] A Thing Plus is a Feather-pattern board with a microSD slot and a Qwiic connector, and Qwiic is simply I2C on a four-wire plug. Mind the switched power rails and the address clashes, and expect the GPIO numbers to change with the chip.`,
  ideas: [
    'The Thing Plus is a Feather-pattern board that is 64.8 mm long, with a microSD slot, a gauge and a Qwiic connector.',
    'Qwiic and STEMMA QT are the same four-wire 3.3 V I2C cable, so SparkFun and Adafruit parts connect to each other.',
    'Every device on a Qwiic chain needs its own I2C address, and the pull-ups of all boards act in parallel.',
    'Some Thing Plus boards switch the Qwiic supply with a GPIO or a second regulator, so a sensor can vanish when that pin changes.'
  ],
  pitfalls: [
    'Qwiic sensors are plug and play, so they cannot clash — Two boards with the same I2C address answer together and corrupt each other\'s data. Check the addresses, and change one with its jumper or use a multiplexer.',
    'The BOOT button only affects boot — On the WROOM Thing Plus it also pulls the pin that switches Qwiic power, so holding it cuts the sensors off.',
    'A Thing Plus is a SparkFun Feather — Same holes, different pins. GPIO numbers and the fixed assignments for the card and LEDs differ from Adafruit\'s boards.'
  ],
  terms: [
    { term: 'Qwiic', also: ['Qwiic connector', 'Qwiic system'], def: 'SparkFun\'s four-wire connector for I2C with 3.3 V power, using a small polarised plug. Boards can be chained with one cable between each; Adafruit\'s STEMMA QT is compatible.' },
    { term: 'Thing Plus', also: ['SparkFun Thing Plus'], def: 'SparkFun\'s Feather-compatible board format: the 0.1 inch Feather holes on a longer board with a microSD slot, a Qwiic connector and a LiPo charger with a fuel gauge.' },
    { term: 'MicroMod', also: ['M.2 processor board'], def: 'A SparkFun system in which a processor board, here with an ESP32, plugs into an M.2 connector on a carrier board that provides the ports and the pins.' },
    { term: 'Daisy chain', also: ['chain'], def: 'Connecting devices one after another with a cable between each pair. On Qwiic every board has two sockets wired to the same I2C bus, so the order does not matter electrically.' }
  ],
  choose: {
    good: ['Sensor projects that should be assembled with cables rather than a soldering iron', 'Data logging to a microSD card with a gauge on the cell', 'A Feather-pattern board with more flash than most (16 MB on the WROOM and C6 boards)'],
    avoid: ['Many sensors with the same address on one chain, unless you add a multiplexer', 'Counting on the BOOT button and the Qwiic power at once on the WROOM board', 'The C5 board if you need mature libraries today'],
    check: ['The I2C address of every Qwiic board on the chain', 'Which rail the Qwiic socket is on, and whether it can be switched', 'That the chip you pick has the radio you need: the S2 has no Bluetooth']
  },
  code: [
    {
      title: 'Scan the Qwiic bus',
      about: 'Tries every I2C address from 1 to 126 and prints those that answer: the quickest way to learn whether a Qwiic cable and a sensor work, and what address the sensor really has.',
      needs: 'A SparkFun Thing Plus ESP32 WROOM and any Qwiic sensor on its Qwiic socket.',
      wiring: [['GPIO21 (SDA)', 'Qwiic data', 'on the board'], ['GPIO22 (SCL)', 'Qwiic clock', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          for each [address v] in (the numbers 1 to 126)
            if <I2C device answers at (address)> then
              print (join [found 0x] (hex (address)))
            end
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;     // the Qwiic bus of the Thing Plus ESP32 WROOM

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);   // (sda, scl, frequency)
          for (uint8_t address = 1; address < 127; address++) {
            Wire.beginTransmission(address);
            if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\n", address);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)    # the Qwiic bus of the Thing Plus ESP32 WROOM
        for address in i2c.scan():
            print("found 0x%02X" % address)
      `,
      output: `
        found 0x48
      `,
      notes: ['An empty result means no device answered: check the cable, that the sensor is 3.3 V, and (on the S3 board) the peripheral rail.', 'The Thing Plus S3 has its Qwiic socket on GPIO8 (SDA) and GPIO9 (SCL).']
    },
    {
      title: 'Read a Qwiic temperature sensor',
      about: 'Reads the temperature register of a TMP117 board (a Qwiic sensor at address 0x48): two bytes, a signed number, 0.0078125 °C per step.',
      needs: 'A SparkFun Thing Plus ESP32 WROOM and a TMP117 Qwiic temperature sensor.',
      wiring: [['Qwiic socket', 'TMP117 board', 'one Qwiic cable']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
        forever
          set [raw v] to (I2C read (2) bytes from address (0x48) register (0x00) as one signed number)
          set [celsius v] to ((raw) * (0.0078125))
          print (join (celsius) [ C])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t TMP117 = 0x48;       // default address of the Qwiic TMP117 board
        const uint8_t REG_TEMP = 0x00;     // temperature register: 16 bits, 0.0078125 degrees per step

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
        }

        void loop() {
          Wire.beginTransmission(TMP117);
          Wire.write(REG_TEMP);
          Wire.endTransmission(false);                 // repeated start
          Wire.requestFrom(TMP117, (size_t)2);
          if (Wire.available() >= 2) {
            uint8_t high = Wire.read();                // first byte is the high one
            uint8_t low = Wire.read();
            int16_t raw = (int16_t)((high << 8) | low);
            Serial.printf("%.2f C\n", raw * 0.0078125);
          } else {
            Serial.println("no answer: check the Qwiic cable");
          }
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        TMP117 = 0x48        # default address of the Qwiic TMP117 board
        REG_TEMP = 0x00      # temperature register: 16 bits, 0.0078125 degrees per step

        while True:
            try:
                data = i2c.readfrom_mem(TMP117, REG_TEMP, 2)
                raw = int.from_bytes(data, "big")                 # the first byte is the high one
                if raw & 0x8000:                                  # below zero: two's complement of 16 bits
                    raw -= 0x10000                                # (MicroPython's from_bytes has no signed option)
                print("%.2f C" % (raw * 0.0078125))
            except OSError:
                print("no answer: check the Qwiic cable")
            time.sleep_ms(1000)
      `,
      output: `
        23.41 C
        23.42 C
      `,
      notes: ['The address 0x48 is the board\'s default; the TMP117 can be set to 0x49, 0x4A or 0x4B, which is how two of them share one chain.']
    }
  ],
  quiz: [
    { q: 'Two Qwiic sensors with the same fixed I2C address are plugged into one chain. What happens?', choices: ['The second one is ignored', 'They answer together and corrupt each other\'s data', 'Nothing: Qwiic gives each board its own address', 'The chain refuses to power up'], a: 1, why: 'Qwiic is just I2C. Two devices that respond to one address both drive the data line, so the replies are garbled. Change one address, or put one behind a multiplexer.' },
    { q: 'On the Thing Plus ESP32 WROOM you hold BOOT while the program runs. What else happens, according to the catalogue?', choices: ['Nothing', 'The Qwiic sensors momentarily lose power', 'The microSD card is ejected', 'Wi-Fi restarts'], a: 1, why: 'GPIO0, the BOOT pin, also switches the Qwiic supply on this board, so pulling it low cuts power to the sensors for as long as the button is held.' },
    { q: 'Qwiic and STEMMA QT cables are not interchangeable because the plugs differ.', a: false, why: 'They use the same plug and the same four wires, 3.3 V, ground, SDA and SCL. Boards and cables of the two makers connect to each other.' },
    { q: 'A scan of the Qwiic bus on a Thing Plus finds nothing. Which check comes first?', choices: ['Re-flash the bootloader', 'The cable, the sensor\'s 3.3 V supply and the pins the sketch uses for SDA and SCL', 'Change the I2C speed to 1 MHz', 'Replace the ESP32'], a: 1, why: 'Most empty scans are wiring or pin mistakes. The WROOM board uses GPIO21 and 22, the S3 board GPIO8 and 9; a sketch written for the wrong board scans pins with nothing on them.' }
  ],
  applications: [
    'Environmental loggers: a Thing Plus, a few Qwiic sensors and a microSD card in a weatherproof box.',
    'Prototyping with sensors from both SparkFun and Adafruit, joined by Qwiic and STEMMA QT cables.',
    'Classroom kits where students must not solder: boards plug together and the scan program shows what is there.',
    'The DataLogger IoT as a ready-made recorder for Qwiic GNSS and environmental sensors.'
  ],
  sources: [
    'SparkFun, hookup guides of the Thing Plus ESP32 WROOM, ESP32-S3 and ESP32-C6 boards.',
    'SparkFun, the Qwiic system pages and the Qwiic Pocket and DataLogger IoT product guides.',
    'NXP, *I2C-bus specification and user manual* (UM10204): addressing and bus capacitance.'
  ],
  sim: { id: 'mb-feather-pins', params: { set: 'thing' } }
},

/* ================================================================ Arduino Nano ESP32 */
{
  id: 'arduino-nano-esp32',
  parent: 'maker-board-families',
  title: 'Arduino Nano ESP32',
  level: 1,
  short: 'An ESP32-S3 in the classic Nano outline, with Arduino\'s D and A pin names, native USB-C, 16 MB of flash and 8 MB of PSRAM. The one Arduino board where the ESP chip is the main microcontroller.',
  keywords: ['Arduino Nano ESP32', 'NORA-W106', 'u-blox', 'ESP32-S3', 'Nano', 'D2', 'A0', 'pin names', 'double-tap reset', 'bootloader', 'MicroPython', 'Arduino Cloud', 'USB-C', 'B0', 'B1'],
  prereq: ['form-factors', 'gpio-numbers-and-board-labels', 'soc-esp32-s3'],
  related: ['esp-as-a-co-processor', 'strapping-pins', 'safe-pins-s3-c3-c6', 'lolin-d1-mini-family', 'choosing-a-board'],
  body: `The **Arduino Nano ESP32** puts an ESP32-S3 into the 18 × 45 mm outline of the classic Arduino Nano, with the same two rows of 15 pins and Arduino's own pin names. Unlike the UNO R4 WiFi or the Nano 33 IoT, the ESP chip here is the main microcontroller: your sketch runs on it, and everything the S3 offers is yours ([[soc-esp32-s3]]).

### What is inside

The brain is a u-blox NORA-W106 module (an ESP32-S3 with its antenna and 8 MB of octal PSRAM inside), with 16 MB of flash on the board beside it. USB-C goes straight to the chip's native USB, so there is no bridge chip and the board can also act as a keyboard or a drive. A buck converter makes 3.3 V from VIN (6–21 V). The logic is 3.3 V, whatever the old Nano's 5 V habits. It runs Arduino sketches, official MicroPython, ESP-NOW and Arduino Cloud.

### D and A are not GPIO numbers

The silkscreen keeps the Nano's labels, D0 to D13 and A0 to A7. In Arduino code you write \`D2\` or \`A0\` and the board package translates; the chip's GPIO numbers are quite different:

- **D2 to D7** are GPIO5 to GPIO10; **D8** is GPIO17, **D9** 18, **D10** 21, **D11** 38, **D12** 47 and **D13**, the yellow LED and SPI clock, is GPIO48.
- **A0 to A3** are GPIO1 to GPIO4 and **A4 to A7** GPIO11 to GPIO14; A4 and A5 are also the default I2C data and clock.
- **D0 and D1** are the serial port, GPIO44 and GPIO43; D1 has a 499 Ω series resistor, so it cannot drive much.

MicroPython has no D-names for this board in our programs: use the GPIO numbers. The translator below does the lookup.

### The RGB LED and the boot pins

The RGB LED uses GPIO46 (red), GPIO0 (green) and GPIO45 (blue), the chip's three [[strapping-pins|strapping pins]], and the first batch has green and blue swapped. The board is designed with that in mind. The same pins are brought out as B0 (GPIO46) and B1 (GPIO0): do not hang a circuit on them that holds a level at reset, or the board starts in download mode or with the wrong flash voltage.

### Living with it

- **Rescue.** If a sketch takes over the USB port and the upload fails, double-tap RESET to enter the bootloader.
- **Current.** A GPIO sources up to 40 mA and sinks 28 mA: drive anything bigger through a transistor.
- **No battery.** There is no charger or battery connector on the Nano outline.
- **Look-alikes.** The Nano 33 IoT and the Nano RP2040 Connect share the outline but carry an ESP32 only as a radio: [[esp-as-a-co-processor]].

> [!key] The Arduino Nano ESP32 is an ESP32-S3 in the Nano outline with Arduino's D and A names, which are labels and not GPIO numbers. Use the names in Arduino code, leave B0 and B1 alone at reset, and double-tap RESET if USB gets stuck.`,
  ideas: [
    'The ESP32-S3 is the main microcontroller here: the sketch runs on it, with native USB-C and 16 MB of flash.',
    'D2 is GPIO5 and D13 is GPIO48: the Arduino names are labels, translated by the board package.',
    'The RGB LED sits on the three strapping pins, which are also exposed as B0 and B1: keep outside circuits off them at reset.',
    'Double-tapping RESET enters the bootloader when a sketch has locked the USB port.'
  ],
  pitfalls: [
    'D13 is GPIO13 — It is GPIO48. A sketch that writes the number 13 drives a different pin; write D13 or LED_BUILTIN.',
    'It is 5 V logic like the old Nano — The ESP32-S3 pins are 3.3 V, and a GPIO sources only 40 mA. 5 V parts need level shifting.',
    'Every Nano-shaped Arduino has an ESP32 inside — Only this one runs your sketch on it. The Nano 33 IoT and RP2040 Connect use an ESP32 module as a modem.'
  ],
  terms: [
    { term: 'NORA-W106', also: ['u-blox NORA-W106-10B'], def: 'The u-blox module on the Nano ESP32: an ESP32-S3 with its antenna, 8 MB of octal PSRAM and the support parts, supplied as one certified part.' },
    { term: 'Arduino pin name', also: ['D-label', 'A-label', 'D2', 'A0'], def: 'The label of an Arduino pin, such as D2 or A0. In code it is a constant the board package maps to a GPIO; the numbers in the name are not the GPIO numbers.' },
    { term: 'Double-tap reset', also: ['bootloader double tap'], def: 'Pressing the reset button twice quickly to make the board start its bootloader and wait for an upload, even when the running sketch has taken over the USB port.' },
    { term: 'Native USB', also: ['USB OTG', 'USB CDC'], def: 'A USB port driven by the chip itself, with no bridge chip. The board can then behave as a serial port, a keyboard, a drive or another USB device, depending on the program.' }
  ],
  choose: {
    good: ['Arduino users who want Wi-Fi, Bluetooth LE and native USB without leaving the Nano outline', 'Learning MicroPython on a board with official support', 'Arduino Cloud nodes and ESP-NOW projects on a breadboard'],
    avoid: ['Battery projects: no charger, and the board\'s regulator and LEDs draw more than the chip alone', '5 V sensors and shields without level shifting', 'Designs that need more than the 30 pins of the Nano header'],
    check: ['The GPIO behind each D and A label in the pinout table, not the number in the name', 'That nothing on B0 or B1 holds a level at reset', 'Which USB mode and port your upload tool expects']
  },
  code: [
    {
      title: 'Blink and read A0 by Arduino name',
      about: 'Blinks the yellow LED on D13 and prints the voltage on A0. The code uses the board\'s names, which the package maps to GPIO48 and GPIO1.',
      needs: 'An Arduino Nano ESP32 and a USB-C data cable; optionally a potentiometer between 3V3, A0 and GND.',
      wiring: [['A0 (GPIO1)', 'potentiometer wiper', 'optional'], ['D13 (GPIO48)', 'the yellow LED', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (48) as [output v]
        forever
          set pin (48) to [HIGH v]
          wait (0.25) seconds
          set pin (48) to [LOW v]
          wait (0.25) seconds
          print (join [A0 = ] (analog read pin (1) in millivolts))
        end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);
          pinMode(LED_BUILTIN, OUTPUT);         // D13: GPIO48 on this board
        }

        void loop() {
          digitalWrite(LED_BUILTIN, HIGH);
          delay(250);
          digitalWrite(LED_BUILTIN, LOW);
          delay(250);
          Serial.printf("A0 = %u mV\n", (unsigned)analogReadMilliVolts(A0));    // A0: GPIO1
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        led = Pin(48, Pin.OUT)                          # D13 is GPIO48 on this board
        a0 = ADC(Pin(1), atten=ADC.ATTN_11DB)           # A0 is GPIO1

        while True:
            led.value(1)
            time.sleep_ms(250)
            led.value(0)
            time.sleep_ms(250)
            print("A0 = %d mV" % (a0.read_uv() // 1000))
      `,
      output: `
        A0 = 1648 mV
        A0 = 1650 mV
      `,
      notes: ['In MicroPython use the GPIO numbers; the Arduino names D13 and A0 exist only in the Arduino board package.', 'The ADC1 pins (A0 to A3 and A4 to A7 here) are the ones to use if Wi-Fi is on.']
    },
    {
      title: 'Scan the I2C bus on A4 and A5',
      about: 'The default I2C pins of the Nano ESP32 are A4 (data) and A5 (clock), GPIO11 and GPIO12. Prints every address that answers.',
      needs: 'An Arduino Nano ESP32 and an I2C sensor with its own pull-ups, wired to A4 and A5.',
      wiring: [['A4 (GPIO11)', 'sensor SDA'], ['A5 (GPIO12)', 'sensor SCL'], ['3V3 and GND', 'sensor power']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (11) SCL (12)
          for each [address v] in (the numbers 1 to 126)
            if <I2C device answers at (address)> then
              print (join [found 0x] (hex (address)))
            end
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Wire.begin();                          // default pins of the board package: A4 = SDA, A5 = SCL
          for (uint8_t address = 1; address < 127; address++) {
            Wire.beginTransmission(address);
            if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\n", address);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(12), sda=Pin(11), freq=400000)    # A5 is GPIO12, A4 is GPIO11
        for address in i2c.scan():
            print("found 0x%02X" % address)
      `,
      output: `
        found 0x3C
      `,
      notes: ['0x3C is typical for an SSD1306 OLED. The sensor board must supply its own pull-up resistors or you must add 4.7 kΩ to 3V3 on each line.']
    }
  ],
  quiz: [
    { q: 'On the Arduino Nano ESP32 a sketch uses pinMode(D2, OUTPUT). Which GPIO of the chip is that?', choices: ['GPIO2', 'GPIO5', 'GPIO17', 'GPIO21'], a: 1, why: 'D2 to D7 are GPIO5 to GPIO10 in the board\'s pin table. The number in the Arduino name is not the GPIO number.' },
    { q: 'You wire a switch to B1 (GPIO0) that rests low. After a reset the board does not run your sketch. Why?', choices: ['B1 is an input only', 'GPIO0 low at reset selects download mode', 'The switch draws too much current', 'USB is disabled'], a: 1, why: 'GPIO0 is the boot pin. Held low as reset ends, the chip waits for an upload instead of running the program. B0 and B1 are strapping pins and need care at power-up.' },
    { q: 'On the Nano ESP32 the label D13 is GPIO13.', a: false, why: 'D13, the LED and SPI clock, is GPIO48. Writing the number 13 in code drives another pin.' },
    { q: 'A sketch has made the USB port unusable and uploads now fail. What does the catalogue say to do?', choices: ['Solder a wire to GPIO0', 'Double-tap RESET to enter the bootloader', 'Wait ten minutes', 'The board is lost'], a: 1, why: 'A quick double tap on RESET starts the bootloader and waits for an upload, even if the running sketch has taken over the native USB port.' }
  ],
  applications: [
    'Arduino users moving up from a Nano to Wi-Fi and Bluetooth LE without changing the footprint.',
    'Classroom MicroPython on a board with official support and a USB-C cable.',
    'Arduino Cloud nodes: a sensor, the board and a dashboard.',
    'Breadboard prototypes that need native USB, for example a small keyboard or a MIDI device.'
  ],
  sources: [
    'Arduino documentation, the Nano ESP32 hardware page, datasheet and pinout.',
    'u-blox, NORA-W10 series data sheet.',
    'Espressif, *ESP32-S3 Series Datasheet*: strapping pins and ADC channels.'
  ],
  sim: { id: 'mb-label-translator', params: { board: 'arduino-nano-esp32' } }
},

/* ================================================================ the ESP as a radio co-processor */
{
  id: 'esp-as-a-co-processor',
  parent: 'maker-board-families',
  title: 'The ESP as a radio co-processor',
  level: 2,
  short: 'Several well-known boards carry an ESP chip that never runs your sketch: it is a Wi-Fi and Bluetooth modem next to the real microcontroller. The Arduino UNO R4 WiFi, Nano 33 IoT, MKR WiFi 1010 and Adafruit AirLift all work this way.',
  keywords: ['co-processor', 'NINA-W102', 'WiFiNINA', 'AirLift', 'UNO R4 WiFi', 'Nano 33 IoT', 'MKR WiFi 1010', 'Nano RP2040 Connect', 'Portenta C33', 'ESP-AT', 'ESP-Hosted', 'radio module', 'SPI', 'main microcontroller'],
  prereq: ['chip-module-board', 'form-factors', 'serial-communication-basics'],
  related: ['arduino-nano-esp32', 'adafruit-feather-boards', 'esp-at-and-esp-hosted', 'u-blox-nina-and-nora', 'module-certification', 'choosing-a-board'],
  body: `Some boards carry an ESP chip and never run your sketch on it. The main microcontroller, a SAMD21, an RP2040 or a Renesas RA4M1, runs the program, and the ESP sits beside it as a **radio co-processor**: a Wi-Fi and Bluetooth modem commanded over a serial link. The catalogue marks these boards so that nobody mistakes an UNO R4 WiFi for an ESP32 board.

### Who does what

| Board | Main chip (runs your sketch) | ESP chip (the radio) |
|---|---|---|
| Arduino UNO R4 WiFi | Renesas RA4M1, Cortex-M4, 48 MHz, 5 V | ESP32-S3 (MINI-1-N8), which is also the USB bridge by default |
| Arduino UNO WiFi Rev2 | ATmega4809, 8-bit | NINA-W102 (ESP32) |
| Arduino Nano 33 IoT | SAMD21, Cortex-M0+, 48 MHz | NINA-W102 |
| Arduino MKR WiFi 1010 | SAMD21 | NINA-W102 |
| Arduino Nano RP2040 Connect | RP2040 | NINA-W102, which also drives A4 to A7 and the RGB LED |
| Arduino Portenta C33 | Renesas RA6M5, Cortex-M33, 200 MHz | ESP32-C3-MINI-1U |
| Adafruit AirLift, PyPortal, Matrix Portal M4 | any host, or an ATSAMD51 | an ESP32 on SPI |

NINA is the name of u-blox's module family with an ESP32 inside ([[u-blox-nina-and-nora]]).

### How one Wi-Fi call travels

Your sketch calls \`WiFi.begin()\`. A library packs the request into a command, sends it over the link, and the ESP's own firmware does the real work: the Wi-Fi driver, the TCP/IP stack and the TLS. Your sketch gets back a socket that behaves like any other, while the network lives in the other chip. That has consequences:

- **Only what the firmware offers.** ESP-NOW, the ESP's own pins and its second core are out of reach unless the radio is re-flashed. Adafruit notes that enterprise Wi-Fi is not supported on an AirLift.
- **Two versions.** The radio has its own firmware version, updated separately from the sketch (the library can report it).
- **Certification.** Reprogramming the NINA firmware voids the radio certification, says the catalogue ([[module-certification]]).

### The link

On an AirLift the link is SPI plus a chip select, a busy line and a reset line, which is why it fits any Feather or UNO shield. On the UNO R4 WiFi the two chips talk over a serial link, and a six-pin header next to RESET (IO42, IO41, TXD0, DOWNLOAD, RXD0, GND) lets you re-flash the ESP.

### Doing it yourself

The same architecture is available for any project: **ESP-AT** is Espressif's firmware that turns an ESP into a modem driven by AT commands over a serial port, and **ESP-Hosted** gives a host chip the ESP's Wi-Fi and Bluetooth, as the radio-less ESP32-P4 uses ([[esp-at-and-esp-hosted]]). When the ESP is the main chip (a Feather, the [[arduino-nano-esp32|Nano ESP32]]) you have the whole chip instead.

> [!key] On these boards the ESP is a modem: the sketch runs on another microcontroller and asks the ESP for Wi-Fi and Bluetooth over SPI or serial. You get a familiar WiFi library and a certified radio, but not ESP-NOW, the ESP's pins or its cores.`,
  ideas: [
    'On co-processor boards the sketch runs on the main microcontroller; the ESP only does Wi-Fi and Bluetooth for it.',
    'The ESP\'s firmware runs the network stack, so the main chip sees ready-made sockets, within what that firmware offers.',
    'The radio firmware has its own version and certification; reprogramming it can void the board\'s radio approval.',
    'You can build the same arrangement yourself with ESP-AT or ESP-Hosted.'
  ],
  pitfalls: [
    'An Arduino UNO R4 WiFi is an ESP32 board — The sketch runs on the Renesas RA4M1. The ESP32-S3 is the radio and the USB bridge.',
    'I can use ESP-NOW on any board with an ESP chip — Only when your own code runs on the ESP. A co-processor runs the maker\'s firmware, which offers the Wi-Fi library only.',
    'More radio means more memory — The main microcontroller keeps its own small RAM; large network buffers still have to fit there.'
  ],
  terms: [
    { term: 'Radio co-processor', also: ['Wi-Fi co-processor', 'network co-processor', 'radio module'], def: 'A chip, here an ESP, that handles Wi-Fi and Bluetooth for a main microcontroller. The main chip sends it commands over SPI or serial and receives data from it; the sketch does not run on the ESP.' },
    { term: 'NINA-W102', also: ['NINA module', 'NINA-W10'], def: 'A u-blox radio module that contains an ESP32. Arduino\'s boards use it as the Wi-Fi and Bluetooth co-processor, running Arduino\'s firmware.' },
    { term: 'AirLift', also: ['Adafruit AirLift'], def: 'Adafruit\'s family of boards (FeatherWing, shield, breakout) that add Wi-Fi to a microcontroller through an ESP32 on SPI.' },
    { term: 'WiFiNINA', also: ['WiFiNINA library'], def: 'The Arduino library through which a sketch uses the NINA radio. It looks like the usual WiFi library but sends every call as a command to the ESP32.' }
  ],
  choose: {
    good: ['Learning IoT inside the Arduino ecosystem, with a certified radio and a familiar library', 'Adding Wi-Fi to a microcontroller that has none, with a FeatherWing or shield', 'A product where the radio certification of the module matters'],
    avoid: ['ESP-NOW, ESP-IDF features or the ESP\'s own pins and cores: choose a board where the ESP is the main chip', 'Large buffers on a small main chip', 'Anything that needs enterprise Wi-Fi on an AirLift'],
    check: ['Which chip runs your sketch, and how much RAM it has', 'The radio firmware version and how it is updated', 'The link type and the pins it uses on the host']
  },
  code: [
    {
      title: 'Connect through the NINA radio',
      about: 'Checks that the radio chip answers, prints its firmware version, joins a Wi-Fi network and prints the address. The WiFiNINA library hides the link, so the code reads like any Wi-Fi sketch.',
      needs: 'An Arduino Nano 33 IoT or MKR WiFi 1010 (or a Nano RP2040 Connect), the WiFiNINA library, and the serial monitor.',
      libs: ['WiFiNINA'],
      blocks: `
        when started
          start serial at (115200) baud
          print (join [radio firmware: ] (radio firmware version))
          connect to Wi-Fi [your-ssid] password [your-password]
          repeat until <Wi-Fi connected?>
            wait (1) seconds
          end
          print (join [IP address: ] (IP address))
      `,
      cpp: String.raw`
        #include <WiFiNINA.h>

        const char SSID[] = "your-ssid";
        const char PASS[] = "your-password";    // do not leave real credentials in shared code

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (WiFi.status() == WL_NO_MODULE) {            // the main chip cannot reach the radio chip
            Serial.println("no radio module found");
            while (true) {}
          }
          Serial.print("radio firmware: ");
          Serial.println(WiFi.firmwareVersion());          // the ESP's program, not your sketch
          int status = WL_IDLE_STATUS;
          while (status != WL_CONNECTED) {
            status = WiFi.begin(SSID, PASS);
            delay(5000);
          }
          Serial.print("IP address: ");
          Serial.println(WiFi.localIP());
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time

        wlan = network.WLAN(network.STA_IF)          # on the Nano RP2040 Connect this talks to the NINA radio
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")   # do not leave real credentials in shared code
        while not wlan.isconnected():
            time.sleep_ms(1000)
        print("IP address:", wlan.ifconfig()[0])
      `,
      output: `
        radio firmware: 1.5.0
        IP address: 192.168.1.57
      `,
      notes: ['The MicroPython version applies to the Nano RP2040 Connect, whose MicroPython build includes a network driver for the NINA module. The radio firmware version is a C++ call only. Check the version of your build.', 'The UNO R4 WiFi uses the WiFiS3 library, which keeps the same begin, status and localIP calls.']
    }
  ],
  quiz: [
    { q: 'A sketch on an Arduino Nano 33 IoT calls WiFi.begin(). Which chip runs the TCP/IP stack and the Wi-Fi driver?', choices: ['The SAMD21 that runs the sketch', 'The NINA-W102 (an ESP32) beside it', 'The USB chip', 'Both, in turn'], a: 1, why: 'The SAMD21 sends commands. The ESP32 inside the NINA module, with Arduino\'s firmware, does the Wi-Fi, the TCP/IP and the TLS.' },
    { q: 'You want ESP-NOW between boards. Which of these can use it without changing the radio firmware?', choices: ['Arduino Nano 33 IoT', 'Arduino UNO R4 WiFi', 'Arduino Nano ESP32', 'An Adafruit AirLift on a Feather'], a: 2, why: 'On the Nano ESP32 your own sketch runs on the ESP32-S3 and can use ESP-NOW. On the others the ESP runs the maker\'s firmware, which offers only the Wi-Fi library unless it is re-flashed.' },
    { q: 'Reprogramming the radio firmware of a NINA board has no consequences for the board\'s approval.', a: false, why: 'The catalogue notes that reprogramming the NINA firmware voids the radio certification. The certified module runs the firmware it was approved with.' },
    { q: 'WiFi.status() returns WL_NO_MODULE on a board with a NINA radio. What does that mean?', choices: ['The Wi-Fi network is missing', 'The main chip cannot communicate with the radio chip', 'The password is wrong', 'The router is out of range'], a: 1, why: 'The status refers to the module, not the network. It appears when the main microcontroller gets no answer over the link, for example because of a firmware or wiring problem.' }
  ],
  applications: [
    'Arduino IoT learning kits: an UNO R4 WiFi or Nano 33 IoT sending sensor data to Arduino Cloud.',
    'Adding Wi-Fi to a Feather or a Metro that has no radio, with an AirLift.',
    'Internet-connected CircuitPython displays such as the PyPortal.',
    'Products where the main chip must be a particular Renesas or SAMD part and the radio comes as a certified module.'
  ],
  sources: [
    'Arduino documentation, hardware pages of the UNO R4 WiFi, Nano 33 IoT, MKR WiFi 1010, Nano RP2040 Connect and Portenta C33; the WiFiNINA library reference.',
    'Adafruit Learning System, the AirLift product guides.',
    'u-blox, NINA-W10 series data sheet.'
  ],
  sim: 'mb-main-vs-radio'
},

/* ================================================================ LOLIN minis */
{
  id: 'lolin-d1-mini-family',
  parent: 'maker-board-families',
  title: 'LOLIN: D1 mini, S2 mini, S3 mini, C3 mini',
  level: 1,
  short: 'LOLIN\'s D1 mini made the ESP8266 a thumb-sized module with stackable shields. The S2, S3 and C3 minis keep the outline and the shields and move to newer chips, and the labels stay while the GPIOs change.',
  keywords: ['LOLIN', 'WEMOS', 'D1 mini', 'D1 mini Pro', 'D1 mini Lite', 'S2 mini', 'S3 mini', 'C3 mini', 'C3 pico', 'D32', 'ESP8266', 'ESP8285', 'shield', 'A0', 'LOLIN I2C port', 'D4', 'D0'],
  prereq: ['form-factors', 'gpio-numbers-and-board-labels', 'soc-esp8266'],
  related: ['nodemcu-and-doit-boards', 'strapping-pins', 'adc1-adc2-and-wifi', 'voltage-dividers-for-inputs', 'esp-01-and-esp-12', 'choosing-a-board'],
  body: `LOLIN (formerly WEMOS) made the **D1 mini** famous: an ESP8266 on a 25.6 × 34.2 mm board with two rows of eight pins, a USB bridge, and a family of shields (relay, OLED, SD card, sensors) that stack on top. The maker then carried the outline to newer chips.

### The family in the catalogue

| Board | Chip | Memory | Notes |
|---|---|---|---|
| D1 mini | ESP8266EX | 4 MB flash | CH340 bridge; V4.0.0 has USB-C and a LOLIN I2C port, V3.x micro-USB |
| D1 mini Lite | ESP8285 | 1 MB, inside the chip | Too small for over-the-air updates of a big sketch |
| D1 mini Pro | ESP8266EX | 16 MB flash | PCB antenna plus a switchable external connector; 48 mm long |
| S2 mini | ESP32-S2FN4R2 | 4 MB flash, 2 MB PSRAM | Native USB, 27 IO, LED on GPIO15, no Bluetooth |
| S3 mini | ESP32-S3FH4R2 | 4 MB flash, 2 MB PSRAM | RGB LED on IO47, no battery connector |
| C3 mini | ESP32-C3FH4 | 4 MB flash | WS2812 on GPIO7, 12 IO, USB Serial/JTAG |
| C3 pico | ESP32-C3FH4 | 4 MB flash | 25.4 mm square, battery port with a 500 mA charger |

The D32 and D32 Pro are real LOLIN ESP32 boards with LiPo chargers. The "WEMOS D1 mini ESP32" is not one: LOLIN never made it ([[form-factors]]).

### The D1 mini's pins

The labels D0 to D8 are GPIO16, 5, 4, 0, 2, 14, 12, 13 and 15. D3, D4 and D8 are boot-strapping pins, and D4 (GPIO2) is also the LED, lit when the pin is **low**. D0 (GPIO16) has no PWM, no interrupt and no I2C; its virtue is that it can wake the chip from deep sleep. There is a single analogue input, A0.

### A0 and the divider on the board

The ESP8266's converter reads 0 to 1 V. The D1 mini puts a 220 kΩ and a 100 kΩ resistor in front of it, so that A0 accepts up to 3.2 V and a reading of 1023 means 3.2 V. The calculator below does the sum; see [[voltage-dividers-for-inputs]] for the general case.

### The ESP32 minis: shield compatible, not code compatible

The S2, S3 and C3 minis copy the outline (on the S2 mini the 16 outer pins match the shield footprint), so D1 mini shields still stack. The GPIO behind each hole follows the chip, though. The D1 mini's I2C is GPIO4 and GPIO5; the C3 mini's default is GPIO8 and GPIO10, the S2 mini's GPIO33 and GPIO35, the S3 mini's GPIO35 and GPIO36. An OLED shield on any of them needs \`Wire.begin\` with the right pins, or the board package's names. Radios differ too: the ESP8266 and the S2 have no Bluetooth.

> [!key] LOLIN's minis share an outline and shields from the ESP8266 D1 mini to the C3 mini, but the GPIO behind each label changes with the chip. The D1 mini's A0 reads up to 3.2 V through an on-board divider; D3, D4 and D8 are boot pins.`,
  ideas: [
    'The D1 mini is an ESP8266 board; the S2, S3 and C3 minis keep its outline and shields with newer chips.',
    'D3, D4 and D8 are boot-strapping pins on the D1 mini, and D4 is the LED, lit when the pin is low.',
    'A0 has a divider in front of the converter, so it reads 0 to 3.2 V as 0 to 1023.',
    'A shield fits all of them, but the I2C and SPI pins move with the chip: use the board package\'s names.'
  ],
  pitfalls: [
    'A D1 mini sketch runs unchanged on the C3 mini — The outline matches, the GPIO numbers do not. Code with raw numbers drives the wrong pins.',
    'A0 reads 0 to 3.3 V — On the D1 mini it reads 0 to 3.2 V through the on-board divider, and a bare ESP8266 would saturate at 1 V.',
    'The S2 mini has Bluetooth like other ESP32 boards — The ESP32-S2 has Wi-Fi only.'
  ],
  terms: [
    { term: 'D1 mini', also: ['WEMOS D1 mini', 'LOLIN D1 mini'], def: 'LOLIN\'s ESP8266 board of 25.6 × 34.2 mm with two rows of eight pins. Its outline and pin order are the basis of the D1 mini shield family and are copied by newer LOLIN boards.' },
    { term: 'ESP8285', also: ['ESP8285 module'], def: 'An ESP8266 with 1 MB of flash inside the chip. It runs the same programs as the ESP8266 but has no room for large sketches or over-the-air updates of them.' },
    { term: 'LOLIN I2C port', also: ['LOLIN connector'], def: 'A small four-pin I2C socket (3.3 V, GND, SDA, SCL) on some LOLIN boards, used with LOLIN\'s sensor and display boards.' }
  ],
  formulas: [
    {
      name: 'The divider in front of A0 on the D1 mini',
      expr: 'Vadc = Vin*R2/(R1 + R2)',
      tex: 'V_{\\mathrm{adc}} = V_{\\mathrm{in}}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vadc: { name: 'voltage at the converter', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{adc}}' },
        Vin: { name: 'voltage on the A0 pin', q: 'voltage', unit: 'V', value: 3.2, tex: 'V_{\\mathrm{in}}' },
        R1: { name: 'series resistor', q: 'resistance', unit: 'kΩ', value: 220, tex: 'R_1' },
        R2: { name: 'resistor to ground', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      solveFor: 'Vadc',
      note: 'The ESP8266 converter reads 0 to 1 V. With 220 kΩ and 100 kΩ the full scale at the pin is 1 V × 320 / 100 = 3.2 V, the figure in the catalogue. Boards of other makers use other values.',
      stories: { Vadc: 'A sensor puts {Vin} on A0 of a D1 mini, behind {R1} and {R2}. What voltage does the converter see?' },
      practice: { unknowns: ['Vadc', 'Vin'] }
    }
  ],
  examples: [
    {
      title: 'What does analogRead return for 2.4 V?',
      q: 'A sensor outputs 2.4 V into A0 of a D1 mini, behind the 220 kΩ and 100 kΩ divider. The converter reads 0 to 1 V as 0 to 1023.',
      steps: [{ text: 'The converter sees', tex: 'V_{\\mathrm{adc}} = 2.4\\,\\mathrm{V}\\cdot\\frac{100}{220+100} = 0.75\\,\\mathrm{V}' }, { text: 'That is three quarters of full scale, so the reading is', tex: '0.75 \\times 1023 \\approx 767' }, 'To turn a reading back into volts: volts = reading ÷ 1023 × 3.2.'],
      a: 'About 767. Multiply a reading by 3.2 / 1023 to get the pin voltage.'
    }
  ],
  choose: {
    good: ['Cheap Wi-Fi nodes and relays on the shield ecosystem (ESPHome and Tasmota run on the D1 mini)', 'An upgrade path from ESP8266 to a C3 or S3 mini without changing shields or case', 'Native USB (S2 and S3 minis) in a 25 × 34 mm outline'],
    avoid: ['The D1 mini (ESP8266) for anything needing Bluetooth or native USB', 'Counting on every pin: the minis have 11 to 27 usable IO', 'Mixing up the real LOLIN boards with look-alike clones when you need the documented pin map'],
    check: ['The hardware revision of the D1 mini: V4.0.0 has USB-C, earlier ones micro-USB', 'The I2C and SPI pins of the chip on the mini you chose', 'That A0 stays inside 3.2 V']
  },
  code: [
    {
      title: 'Blink the LED of any LOLIN mini',
      about: 'The family does not share one LED: a plain active-low LED on the D1 mini, a plain LED on the S2 mini, an RGB LED on the S3 and C3 minis. The program picks the LED from the chip.',
      needs: 'A LOLIN D1 mini, S2 mini, S3 mini or C3 mini.',
      blocks: `
        when started
          set [chip v] to (chip model)
        forever
          turn the board's LED on    // plain LED (low on the D1 mini), or the RGB LED at low brightness :: my
          wait (0.5) seconds
          turn the board's LED off :: my
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        // The LED differs across the family, so the sketch picks it by chip.
        #if defined(ESP8266)
          const int LED_PIN = LED_BUILTIN;      // D1 mini: GPIO2 (D4), lit when the pin is LOW
          const bool ACTIVE_LOW = true;
        #elif CONFIG_IDF_TARGET_ESP32S2
          const int LED_PIN = 15;               // S2 mini: a blue LED on GPIO15
          const bool ACTIVE_LOW = false;
        #elif CONFIG_IDF_TARGET_ESP32S3
          const int LED_PIN = 47;               // S3 mini: an RGB LED on IO47
          const bool ACTIVE_LOW = false;
        #else
          const int LED_PIN = 7;                // C3 mini: a WS2812 on GPIO7
          const bool ACTIVE_LOW = false;
        #endif

        void ledSet(bool on) {
        #if defined(ESP8266) || CONFIG_IDF_TARGET_ESP32S2
          digitalWrite(LED_PIN, (on != ACTIVE_LOW) ? HIGH : LOW);
        #else
          uint8_t level = on ? 32 : 0;
          rgbLedWrite(LED_PIN, level, level, level);   // an addressable LED needs a data frame
        #endif
        }

        void setup() {
        #if defined(ESP8266) || CONFIG_IDF_TARGET_ESP32S2
          pinMode(LED_PIN, OUTPUT);
        #endif
        }

        void loop() {
          ledSet(true);
          delay(500);
          ledSet(false);
          delay(500);
        }
      `,
      py: String.raw`
        import sys, time
        from machine import Pin

        chip = sys.implementation._machine.upper().replace("-", "")    # the name of the chip is in this text

        if "ESP8266" in chip:
            LED_PIN, ACTIVE_LOW, RGB = 2, True, False      # D1 mini: GPIO2 (D4), lit when the pin is low
        elif "ESP32S2" in chip:
            LED_PIN, ACTIVE_LOW, RGB = 15, False, False    # S2 mini: a blue LED on GPIO15
        elif "ESP32S3" in chip:
            LED_PIN, ACTIVE_LOW, RGB = 47, False, True     # S3 mini: an RGB LED on IO47
        else:
            LED_PIN, ACTIVE_LOW, RGB = 7, False, True      # C3 mini: a WS2812 on GPIO7

        if RGB:
            from neopixel import NeoPixel
            pixel = NeoPixel(Pin(LED_PIN), 1)
        else:
            led = Pin(LED_PIN, Pin.OUT)

        def led_set(on):
            if RGB:
                pixel[0] = (32, 32, 32) if on else (0, 0, 0)
                pixel.write()
            else:
                led.value(1 if on != ACTIVE_LOW else 0)

        while True:
            led_set(True)
            time.sleep_ms(500)
            led_set(False)
            time.sleep_ms(500)
      `,
      notes: ['If the chip is not recognised, set LED_PIN by hand from your board\'s page in the board catalogue.', 'The S3 mini\'s LED is on IO47 and the C3 mini\'s on GPIO7 in the catalogue; revisions of a board may differ.']
    },
    {
      title: 'Read A0 of a D1 mini in volts',
      about: 'Turns the 0 to 1023 reading into the voltage on the pin, using the 3.2 V full scale that the on-board divider gives.',
      needs: 'A LOLIN D1 mini (ESP8266) and a potentiometer between 3V3, A0 and GND, or a sensor with an output up to 3.2 V.',
      wiring: [['A0', 'potentiometer wiper', 'never above 3.2 V'], ['3V3 and GND', 'potentiometer ends']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [raw v] to (analog read pin (A0))
          print (join (raw) [ = ] ((raw) / (1023) * (3.2)) [ V])
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const float FULL_SCALE_V = 3.2;    // the D1 mini's divider maps 0..3.2 V at A0 to the converter's 0..1 V

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int raw = analogRead(A0);                         // 0..1023
          float volts = raw / 1023.0 * FULL_SCALE_V;
          Serial.printf("A0: %d = %.2f V\n", raw, volts);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC
        import time

        FULL_SCALE_V = 3.2         # the D1 mini's divider maps 0..3.2 V at A0 to the converter's 0..1 V
        adc = ADC(0)

        while True:
            raw = adc.read()                       # 0..1023
            print("A0: %d = %.2f V" % (raw, raw / 1023 * FULL_SCALE_V))
            time.sleep_ms(500)
      `,
      output: `
        A0: 512 = 1.60 V
        A0: 513 = 1.60 V
      `,
      notes: ['The ESP8266 has one converter and no calibration data: expect an error of a few per cent. Boards of other makers (a bare NodeMCU, for instance) use other divider values.']
    }
  ],
  quiz: [
    { q: 'On a D1 mini, analogRead(A0) returns 512. What is the voltage on the pin?', choices: ['About 0.5 V', 'About 1.6 V', 'About 2.5 V', 'About 3.2 V'], a: 1, why: 'Half scale is half of 3.2 V, because the on-board divider maps 0 to 3.2 V at the pin onto the converter\'s 0 to 1 V.' },
    { q: 'A D1 mini OLED shield is stacked on a LOLIN C3 mini. The sketch calls Wire.begin(4, 5), correct on the D1 mini. What happens?', choices: ['It works, the pins are the same', 'The bus runs on other GPIOs than the shield uses, so nothing answers', 'The board resets', 'It will not compile'], a: 1, why: 'The C3 mini\'s default I2C pins are GPIO8 and GPIO10. GPIO4 and GPIO5 are other pins there, so the shield and the code disagree. Use Wire.begin() and the board package\'s names.' },
    { q: 'The LOLIN S2 mini, built on an ESP32-S2, supports Bluetooth LE.', a: false, why: 'The ESP32-S2 has Wi-Fi only. For Bluetooth LE with the same outline choose the S3 mini or the C3 mini.' },
    { q: 'Why is D4 a poor choice for a sensor input on a D1 mini?', choices: ['It cannot be an input', 'It is GPIO2: a boot-strapping pin that also drives the on-board LED', 'It is shared with A0', 'It is the USB pin'], a: 1, why: 'D4 is GPIO2. It must be high at reset, it carries the active-low LED, and a part that pulls it low can stop the board from booting.' }
  ],
  applications: [
    'ESPHome and Tasmota nodes: a D1 mini with a relay shield or a sensor shield.',
    'Small OLED weather displays on a D1 mini or a C3 mini.',
    'Upgrading an ESP8266 project to a C3 or S3 mini while keeping the shield and the enclosure.',
    'A battery sensor on the C3 pico, with its charger on the board.'
  ],
  sources: [
    'LOLIN (WEMOS) documentation, the D1 mini, D1 mini Pro, S2 mini, S3 mini, C3 mini and C3 pico pages.',
    'Espressif, *ESP8266EX Datasheet*: the analogue input range.',
    'Espressif, *ESP32-S2 Series Datasheet*: no Bluetooth.'
  ],
  sim: { id: 'mb-label-translator', params: { board: 'lolin-d1-mini' } }
},

/* ================================================================ NodeMCU and DOIT */
{
  id: 'nodemcu-and-doit-boards',
  parent: 'maker-board-families',
  title: 'NodeMCU and DOIT DevKit V1',
  level: 1,
  short: 'The two most copied breadboard boards: the NodeMCU for the ESP8266 and the DOIT DevKit V1 for the ESP32. Cheap, everywhere and covered by a thousand tutorials, with a pin order that no single maker guarantees.',
  keywords: ['NodeMCU', 'DOIT', 'DevKit V1', 'ESP-12E', 'Amica', 'LoLin V3', 'CP2102', 'CH340', '30-pin', '36-pin', '38-pin', 'clone', 'D0', 'D1', 'D8', 'GPIO16', 'FLASH button', 'input only'],
  prereq: ['form-factors', 'gpio-numbers-and-board-labels', 'strapping-pins'],
  related: ['lolin-d1-mini-family', 'esp32-devkitc', 'clones-and-counterfeits', 'safe-pins-esp32', 'adc1-adc2-and-wifi', 'choosing-a-board'],
  body: `**NodeMCU** began as a Lua firmware for the ESP8266 and became the name of a board: an ESP-12E module on a breadboard-friendly carrier with a USB bridge, a FLASH button and a reset button. Everybody copied it: the "Amica" boards with a CP2102 bridge, the wider "LoLin V3" with a CH340G. Its ESP32 counterpart is the **DOIT ESP32 DEVKIT V1** and the 38-pin DevKitC-style clones. They are generic in the best and worst sense: cheap, everywhere, documented by hundreds of tutorials, and with no maker standing behind the pin order.

### The boards

| Board | Chip | Notes |
|---|---|---|
| NodeMCU DevKit V1.0 (Amica) | ESP-12E (ESP8266EX), 4 MB | CP2102, 25.5 × 49 mm, 30 pins; blue LED on GPIO2, active low |
| NodeMCU V3 (LoLin) | the same ESP-12E | CH340G, too wide to leave free breadboard rows; "V3" is a LoLin name, not a third official generation |
| DOIT ESP32 DEVKIT V1 | ESP32-WROOM-32, 4 MB | 28.3 × 51.5 mm; CP2102 on the original, CH340 on many clones; 30-pin and 36-pin versions |
| 38-pin DevKitC-style clones | ESP32-WROOM-32D or 32E | Follow Espressif's DevKitC header; clone pin order is not guaranteed |

### NodeMCU: the labels and the traps

D0 to D8 are GPIO16, 5, 4, 0, 2, 14, 12, 13 and 15; D9 and D10 are the serial pins GPIO3 and GPIO1. The simulation below does the lookup. The traps are the ESP8266's own:

- **D3 (GPIO0)** is the FLASH button, and low at reset means download mode. **D4 (GPIO2)** is the LED and must be high at reset. **D8 (GPIO15)** must be low. Anything wired to those can stop the board booting.
- **D0 (GPIO16)** has no PWM, no interrupt and no I2C, but it can wake the chip from deep sleep.
- **A0** is the only analogue input, behind the board's divider.
- **SD0 to SD3, CMD and CLK** are the flash chip's bus. Leave them alone.

The ordinary free pins are D1 and D2 (the usual I2C), D5 to D7 (SPI) and D6 as a plain button input.

### DOIT DevKit V1: GPIO numbers, no D-labels

The ESP32 version is labelled with GPIO numbers (and VP and VN). The traps: pin **order differs between makers**, so read the silkscreen and trust the GPIO numbers; GPIO34 to 39 are input only; ADC2 pins cannot be read while Wi-Fi is on; GPIO12 high at reset can stop the boot ([[strapping-pins]]); GPIO6 to 11 are the flash. The 30-pin version leaves GPIO0 and the flash pins off the header, so use the BOOT button; the 36-pin version brings them out.

### Clones: the honest part

A board of this kind costs little and the variation is large: CP2102 or CH340 (the second needs its own driver on some systems), flash that is often 4 MB, and quality from fine to poor. The listing is not a datasheet. Print what the chip says about itself ([[choosing-a-board]]) and read [[clones-and-counterfeits]].

> [!key] The NodeMCU and the DOIT DevKit V1 are the generic breadboard boards of the ESP8266 and the ESP32. Learn their labels and boot traps (D3, D4, D8 on the NodeMCU; GPIO12 and the flash pins on the DOIT), and trust the GPIO numbers, not the pin order.`,
  ideas: [
    'The NodeMCU is an ESP8266 board with D0 to D8 labels that are not the GPIO numbers; the DOIT DevKit V1 is an ESP32 board labelled by GPIO.',
    'D3, D4 and D8 on the NodeMCU are boot pins; D0 lacks PWM, interrupts and I2C.',
    'No maker guarantees the pin order of clones: read the silkscreen and trust GPIO numbers.',
    'On a classic ESP32 board, GPIO6 to 11 are the flash, GPIO34 to 39 are inputs only and ADC2 stops while Wi-Fi runs.'
  ],
  pitfalls: [
    'D4 is GPIO4 — It is GPIO2, the LED pin, which also sets the boot mode. D2 is GPIO4.',
    'NodeMCU V3 is the third official version — "V3" is LoLin\'s own name for its wider board. There is no official third generation.',
    'All 30-pin ESP32 boards have the same pin order — The DOIT V1 and its clones differ; the header can omit GPIO0 and the flash pins. Match GPIO numbers to the silkscreen.'
  ],
  terms: [
    { term: 'NodeMCU', also: ['NodeMCU DevKit', 'NodeMCU V1.0'], def: 'Originally a Lua firmware for the ESP8266, now also the common name for the breadboard board built around an ESP-12E module, with a USB bridge, a FLASH button and a reset button.' },
    { term: 'ESP-12E', also: ['ESP-12', 'ESP-12F'], def: 'A small module that carries an ESP8266EX, 4 MB of flash and a PCB antenna on castellated edges. NodeMCU boards are built around it.' },
    { term: 'USB-serial bridge', also: ['CP2102', 'CH340', 'CH340G'], def: 'A chip that turns the USB port into a serial port for programming and the serial monitor. CP2102 and CH340 are the two common ones; the second often needs a driver.' },
    { term: 'Input-only pin', also: ['GPIO34 to 39'], def: 'A GPIO that can read but not drive: GPIO34 to 39 on the classic ESP32. It has no internal pull-up or pull-down either.' }
  ],
  choose: {
    good: ['Cheap breadboard prototypes and tutorials: nearly every ESP32 and ESP8266 guide assumes one of these boards', 'ESPHome or Tasmota nodes on the ESP8266 NodeMCU', 'A first board when a few spoiled units do not matter'],
    avoid: ['A product or a shared design: no maker guarantees the board', 'The wide LoLin V3 if you want free breadboard rows beside it', 'Battery projects: the bridge chip and regulator draw far more than the chip asleep'],
    check: ['Which bridge chip it has and whether your system has the driver', 'The silkscreen against the GPIO numbers in your sketch', 'The flash size and chip model by asking the board, not the listing']
  },
  code: [
    {
      title: 'Which GPIO is D4?',
      about: 'Prints the GPIO number behind each D-label of a NodeMCU. The labels are macros of the Arduino core and exist nowhere else, so MicroPython has to carry the table itself.',
      needs: 'A NodeMCU DevKit V1.0 (ESP8266) or a D1 mini, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [n v] in (the numbers 0 to 8)
            print (join [D] (n) [ = GPIO] (GPIO number behind label D(n)))
          end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(500);
          const int labels[] = {D0, D1, D2, D3, D4, D5, D6, D7, D8};      // macros of the board package
          for (int n = 0; n < 9; n++) Serial.printf("D%d = GPIO%d\n", n, labels[n]);
        }

        void loop() {}
      `,
      py: String.raw`
        # MicroPython has no D-labels: this table is the silkscreen of the NodeMCU, copied from its pinout.
        D = (16, 5, 4, 0, 2, 14, 12, 13, 15)

        for n, gpio in enumerate(D):
            print("D%d = GPIO%d" % (n, gpio))
      `,
      output: `
        D0 = GPIO16
        D1 = GPIO5
        D2 = GPIO4
        D3 = GPIO0
        D4 = GPIO2
        D5 = GPIO14
        D6 = GPIO12
        D7 = GPIO13
        D8 = GPIO15
      `,
      notes: ['The same sketch on an ESP32 D1 mini clone prints different numbers (D0 is GPIO26 there): a good test of which board you really have.']
    },
    {
      title: 'Check a pin before you use it',
      about: 'A small guard for a classic ESP32 board such as the DOIT DevKit V1. It says whether a GPIO is a sensible output: not a flash pin, not input only, not missing, and whether it is a strapping pin.',
      needs: 'A DOIT ESP32 DevKit V1 (or any classic ESP32 board) and the serial monitor.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [pin v] in (the list 4, 12, 6, 34, 23)
            print (join [GPIO] (pin) [: ] (verdict for the pin))    // flash pin, input only, strapping pin or ok
          end
      `,
      cpp: String.raw`
        // Is this GPIO a sensible output on a classic ESP32 board such as the DOIT DevKit V1?
        bool usableOutput(int pin) {
          if (pin >= 6 && pin <= 11) return false;                        // wired to the flash chip
          if (pin >= 34 && pin <= 39) return false;                       // input only
          if (pin == 20 || pin == 24 || (pin >= 28 && pin <= 31)) return false;   // no such pin on common modules
          return pin >= 0 && pin <= 33;
        }

        bool isStrapping(int pin) {                                       // read at reset: mind what is wired to them
          return pin == 0 || pin == 2 || pin == 5 || pin == 12 || pin == 15;
        }

        void check(int pin) {
          if (!usableOutput(pin)) Serial.printf("GPIO%d: do not use as an output\n", pin);
          else if (isStrapping(pin)) Serial.printf("GPIO%d: usable, but a strapping pin: mind what is wired to it\n", pin);
          else Serial.printf("GPIO%d: ok\n", pin);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          const int wanted[] = {4, 12, 6, 34, 23};
          for (int pin : wanted) check(pin);
        }

        void loop() {}
      `,
      py: String.raw`
        # Is this GPIO a sensible output on a classic ESP32 board such as the DOIT DevKit V1?
        def usable_output(pin):
            if 6 <= pin <= 11:
                return False                           # wired to the flash chip
            if 34 <= pin <= 39:
                return False                           # input only
            if pin in (20, 24, 28, 29, 30, 31):
                return False                           # no such pin on common modules
            return 0 <= pin <= 33

        def is_strapping(pin):                         # read at reset: mind what is wired to them
            return pin in (0, 2, 5, 12, 15)

        def check(pin):
            if not usable_output(pin):
                print("GPIO%d: do not use as an output" % pin)
            elif is_strapping(pin):
                print("GPIO%d: usable, but a strapping pin: mind what is wired to it" % pin)
            else:
                print("GPIO%d: ok" % pin)

        for pin in (4, 12, 6, 34, 23):
            check(pin)
      `,
      output: `
        GPIO4: ok
        GPIO12: usable, but a strapping pin: mind what is wired to it
        GPIO6: do not use as an output
        GPIO34: do not use as an output
        GPIO23: ok
      `,
      notes: ['The lists come from the ESP32 rows of the pin catalogue. Other chips have other lists: the pinout explorer shows them.', 'Passing this guard does not make a pin free: GPIO16 and 17 belong to the PSRAM on WROVER modules, and ADC2 pins stop working for analogue input while Wi-Fi is on.']
    }
  ],
  quiz: [
    { q: 'A switch that rests closed to ground is wired to D3 of a NodeMCU. After a reset the board does not run the sketch. Why?', choices: ['D3 is input only', 'D3 is GPIO0: held low at reset it selects download mode', 'The switch is too slow', 'D3 is the serial pin'], a: 1, why: 'D3 is GPIO0, the boot pin. Low as reset ends means "wait for an upload". The FLASH button on the board does that on purpose.' },
    { q: 'Which GPIO is D4 on a NodeMCU?', choices: ['GPIO4', 'GPIO2', 'GPIO14', 'GPIO12'], a: 1, why: 'D4 is GPIO2, the pin of the blue LED. D2 is GPIO4: the numbers in the labels are not the GPIO numbers.' },
    { q: 'The NodeMCU "V3" is the third official generation of the board.', a: false, why: '"V3" is LoLin\'s name for its wider board. The catalogue notes that there is no official third NodeMCU generation.' },
    { q: 'The 30-pin DOIT ESP32 DevKit V1 header does not bring out GPIO0. How do you put the board into download mode?', choices: ['It cannot be done', 'Use the BOOT button on the board', 'Hold GPIO2 high', 'Remove the USB bridge'], a: 1, why: 'The 30-pin version leaves GPIO0 and the flash pins off the header. The BOOT button on the board is wired to GPIO0.' }
  ],
  applications: [
    'The board in most online ESP8266 and ESP32 tutorials: breadboard, a sensor and a serial monitor.',
    'ESPHome and Tasmota nodes where a loose breadboard board is good enough.',
    'Teaching labs that buy many identical boards and re-flash them every term.',
    'Quick checks: any sketch can be tried on a NodeMCU or DOIT DevKit before a better board is chosen.'
  ],
  sources: [
    'NodeMCU project, the DevKit V1.0 repository and pin map.',
    'Espressif, *ESP8266EX Datasheet* and *ESP32 Series Datasheet*: strapping pins and flash pins.',
    'Arduino core for ESP8266 documentation, the NodeMCU board and its pin definitions.'
  ],
  sim: { id: 'mb-label-translator', params: { board: 'nodemcu-devkit-v1-amica' } }
},

/* ================================================================ Unexpected Maker */
{
  id: 'unexpected-maker-boards',
  parent: 'maker-board-families',
  title: 'Unexpected Maker: TinyPICO to TinyS3',
  level: 2,
  short: 'Small, carefully engineered boards with a second regulator the sketch can switch, battery and USB sense pins, a choice of antenna and a very low sleep current. From the 18 × 32 mm TinyPICO to the FeatherS3 and the [D] series.',
  keywords: ['Unexpected Maker', 'TinyPICO', 'TinyS3', 'FeatherS3', 'ProS3', 'NanoS3', 'OMGS3', 'TinyC6', 'Series[D]', 'LDO2', 'VBAT sense', 'u.FL', 'back-feed', 'MAX17048', 'EdgeS3', 'CircuitPython'],
  prereq: ['form-factors', 'adafruit-feather-boards', 'regulators-ldo-and-buck'],
  related: ['the-board-is-not-the-chip', 'deep-sleep', 'measuring-battery-level', 'lithium-cells', 'pcb-antenna-or-connector', 'choosing-a-board'],
  body: `Unexpected Maker (UM), from Australia, makes small, carefully engineered ESP32 boards with a recognisable personality: tiny outlines, two regulators instead of one, pins that report the battery and the USB supply, a choice between an on-board antenna and a connector, and a deep-sleep current of a few tens of microamps. Boards come with MicroPython or CircuitPython definitions and Arduino variants such as "UM TinyS3".

### The boards

| Board | Chip | Memory | Distinctive |
|---|---|---|---|
| TinyPICO | ESP32-PICO-D4 | 4 MB flash + 4 MB PSRAM | 18 × 32 mm, 14 GPIO, APA102 LED; about 18 to 20 µA asleep |
| TinyS3 | ESP32-S3FN8 | 8 MB flash + 8 MB PSRAM | 17.8 × 35 mm, native USB, 17 GPIO |
| FeatherS3 | ESP32-S3 | 16 MB flash + 8 MB PSRAM | Feather format, two STEMMA QT ports on separate I2C buses |
| ProS3 | ESP32-S3 | 16 MB flash + 8 MB PSRAM | 27 GPIO, USB ESD protection |
| NanoS3, OMGS3 | ESP32-S3 | 8 MB flash, 8 or 2 MB PSRAM | Modules with no USB connector, 12.7 × 28 and 10 × 25 mm |
| TinyC6 | ESP32-C6 | 8 MB flash | Wi-Fi 6 and 802.15.4; the catalogue lists it as discontinued or superseded |

The [D] versions (FeatherS3[D], ProS3[D], EdgeS3[D], among others) add a fuel gauge and, on some, an ambient-light sensor and an RF switch.

### Two regulators, one switch

Most UM S3 boards carry two 700 mA 3.3 V regulators. The second, **LDO2**, is under software control (GPIO39 on the FeatherS3, GPIO17 on the TinyS3 and ProS3) and is off in deep sleep. It powers the RGB LED and whatever you wire to it, which is why the LED needs the pin set high first (data on GPIO40 on the FeatherS3, 18 on the TinyS3). The reason is sleep: an addressable LED draws current even when dark, so cutting its supply lets the whole board sleep near the chip's own figure.

### Measuring the battery and the USB supply

Each board has a battery sense pin (GPIO10 on the TinyS3, GPIO2 on the FeatherS3) and a USB sense pin (GPIO33 and GPIO34). The first generation has no fuel gauge, so the percentage comes from the ADC and a voltage curve; the [D] versions add a MAX17048 on I2C. Read the schematic for the divider ratio of your revision. On the USB side the USB-C socket has back-feed protection, so a cell cannot push current into a USB port.

### Antennas and traps

Several boards come with a 3D antenna or a u.FL connector, and the FeatherS3 lets you choose. Revisions differ: the TinyPICO V3 has a CH9102F bridge where earlier ones had a CP2104, so a driver may be needed. The default SPI pins 35, 36 and 37 clash with octal PSRAM on some 8 MB units of the EdgeS3[D]. The classic-ESP32 TinyPICO has no native USB and only 14 GPIO.

> [!key] Unexpected Maker's boards are small and built for batteries: a second regulator that the sketch switches, sense pins for the cell and USB, and a choice of antenna. Switch LDO2 on before using the LED, read the schematic for the battery divider, and mind the revision of your board.`,
  ideas: [
    'UM boards carry a second 3.3 V regulator that the sketch can switch, so the LED and extras draw nothing in deep sleep.',
    'Battery and USB sense pins let the sketch know what powers it; only the [D] versions add a fuel gauge.',
    'Several boards offer a 3D antenna or a u.FL connector, and revisions change bridge chips and pins.',
    'The NanoS3 and OMGS3 are modules without a USB connector, made to be soldered into your own board.'
  ],
  pitfalls: [
    'The RGB LED is broken — Its supply is LDO2, which the sketch must switch on first (GPIO17 on the TinyS3, GPIO39 on the FeatherS3).',
    'All TinyPICO boards use the same USB driver — The V3 has a CH9102F bridge; V1 and V2 have a CP2104.',
    'The battery pin gives volts directly — It sees a fraction of the cell voltage through a divider, and the ratio depends on the revision.'
  ],
  terms: [
    { term: 'LDO2', also: ['second regulator', 'peripheral rail'], def: 'The second low-dropout regulator on many Unexpected Maker boards. A GPIO switches it, it powers the LED and user circuits, and it is off in deep sleep.' },
    { term: 'VBUS sense', also: ['USB detect'], def: 'A pin that tells the program whether USB power is present, for example to choose between charging and running from the battery.' },
    { term: 'Back-feed protection', also: ['power path'], def: 'A circuit that stops a battery or another supply from pushing current back into the USB port when the cable is plugged in at the wrong time.' },
    { term: 'Series[D]', also: ['[D] boards', 'FeatherS3[D]'], def: 'Unexpected Maker\'s later board generation with a MAX17048 fuel gauge, an RF switch for choosing the antenna and, on some boards, extra sensors.' }
  ],
  choose: {
    good: ['Battery projects where the deep-sleep current matters and the board must be small', 'MicroPython or CircuitPython on a board with an official definition and a lot of PSRAM', 'Designs that will embed a module: the NanoS3 and OMGS3 fit the TinyPICO Nano footprint'],
    avoid: ['A first board on a tight budget: these boards cost more than generic ones', 'Needing a fuel gauge on the first-generation boards: only the [D] series has one', 'Projects that need many pins at once on the 14-pin TinyPICO'],
    check: ['The revision of the board and its bridge chip', 'Which GPIO switches LDO2 and which carries the LED data', 'The divider ratio on the battery sense pin, in the schematic']
  },
  code: [
    {
      title: 'Light the RGB LED of a TinyS3',
      about: 'Switches on the second regulator that powers the LED, then shows red, green and blue in turn. Without the power pin the LED stays dark.',
      needs: 'An Unexpected Maker TinyS3.',
      wiring: [['GPIO17', 'LDO2 enable: powers the LED', 'on the board'], ['GPIO18', 'RGB LED data', 'on the board']],
      blocks: `
        when started
          set pin (17) as [output v]
          set pin (17) to [HIGH v]
          set up (1) pixel on pin (18)
        forever
          set pixel (0) to colour (40) (0) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (40) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (40)
          show pixels
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int RGB_POWER = 17;     // TinyS3: switches the second regulator (LDO2) that powers the LED
        const int RGB_DATA = 18;      // TinyS3: the LED's data pin

        void setup() {
          pinMode(RGB_POWER, OUTPUT);
          digitalWrite(RGB_POWER, HIGH);       // without this the LED has no supply
          delay(10);                           // let the rail settle
        }

        void loop() {
          rgbLedWrite(RGB_DATA, 40, 0, 0);     // red
          delay(500);
          rgbLedWrite(RGB_DATA, 0, 40, 0);     // green
          delay(500);
          rgbLedWrite(RGB_DATA, 0, 0, 40);     // blue
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        RGB_POWER = 17      # TinyS3: switches the second regulator (LDO2) that powers the LED
        RGB_DATA = 18       # TinyS3: the LED's data pin

        Pin(RGB_POWER, Pin.OUT).value(1)         # without this the LED has no supply
        time.sleep_ms(10)                        # let the rail settle
        np = NeoPixel(Pin(RGB_DATA), 1)

        while True:
            for colour in ((40, 0, 0), (0, 40, 0), (0, 0, 40)):     # red, green, blue
                np[0] = colour
                np.write()
                time.sleep_ms(500)
      `,
      notes: ['On the FeatherS3 the power pin is GPIO39 and the data pin GPIO40; on the ProS3 the pins are the same as on the TinyS3. Check the page of your board.', 'LDO2 is switched off in deep sleep, so the LED needs the power pin set again after every wake.']
    },
    {
      title: 'Report the battery and the USB supply',
      about: 'Reads the battery sense pin of a TinyS3 and the USB sense pin, once every two seconds. The divider ratio is an assumption written at the top: confirm it in the schematic of your board.',
      needs: 'An Unexpected Maker TinyS3 with a LiPo cell on its battery pads, or USB only.',
      wiring: [['GPIO10', 'battery voltage through a divider', 'on the board'], ['GPIO33', 'USB present sense', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (33) as [input v]
        forever
          set [volts v] to (((analog read pin (10) in millivolts) * (DIVIDER)) / (1000))
          print (join [USB: ] (read pin (33)) [, battery: ] (volts) [ V])
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int VBAT_SENSE = 10;     // TinyS3: battery voltage through a divider
        const int VBUS_SENSE = 33;     // TinyS3: reads high when USB power is present
        const float DIVIDER = 2.0;     // assumed 1:2 divider: confirm it in your board's schematic

        void setup() {
          Serial.begin(115200);
          delay(1000);
          pinMode(VBUS_SENSE, INPUT);
        }

        void loop() {
          float volts = analogReadMilliVolts(VBAT_SENSE) * DIVIDER / 1000.0;
          Serial.printf("USB: %s, battery: %.2f V\n", digitalRead(VBUS_SENSE) ? "yes" : "no", volts);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        VBAT_SENSE = 10        # TinyS3: battery voltage through a divider
        VBUS_SENSE = 33        # TinyS3: reads high when USB power is present
        DIVIDER = 2.0          # assumed 1:2 divider: confirm it in your board's schematic

        vbat = ADC(Pin(VBAT_SENSE), atten=ADC.ATTN_11DB)
        vbus = Pin(VBUS_SENSE, Pin.IN)

        while True:
            volts = vbat.read_uv() / 1000000 * DIVIDER
            print("USB: %s, battery: %.2f V" % ("yes" if vbus.value() else "no", volts))
            time.sleep_ms(2000)
      `,
      output: `
        USB: yes, battery: 4.05 V
        USB: no, battery: 3.97 V
      `,
      notes: ['The catalogue gives the pins but not the divider ratio or the polarity of the USB sense pin. Check both against the schematic of your revision before trusting the numbers.', 'A bare lithium cell must only be charged through the board\'s charger. Never feed it from a GPIO or a bench supply.']
    }
  ],
  quiz: [
    { q: 'The RGB LED of a TinyS3 stays dark although the program drives its data pin (GPIO18) correctly. What is missing?', choices: ['A pull-up on GPIO18', 'Setting GPIO17 high to switch on LDO2, the LED\'s supply', 'A USB data cable', 'A 5 V supply'], a: 1, why: 'The LED is powered from the second regulator, which a GPIO switches. With LDO2 off the LED has no supply, whatever the data pin does.' },
    { q: 'Why do Unexpected Maker boards put the RGB LED on a switchable regulator?', choices: ['To make the LED brighter', 'An addressable LED draws current even when dark, so switching it off lets the board sleep at a very low current', 'To share the USB data lines', 'To protect the LED from static'], a: 1, why: 'The controller inside an addressable LED draws a small constant current. Cutting its supply in deep sleep removes that from the sleep budget.' },
    { q: 'A TinyPICO V3 uses the same USB-serial chip, and the same driver, as the V1.', a: false, why: 'The V1 and V2 have a CP2104; the V3 has a CH9102F. A driver may need installing on some systems after a change of revision.' },
    { q: 'Which Unexpected Maker boards are modules with no USB connector?', choices: ['TinyS3 and FeatherS3', 'NanoS3 and OMGS3', 'TinyPICO and ProS3', 'TinyC6 and BLING!'], a: 1, why: 'The NanoS3 and OMGS3 expose the USB data pins as pads, for your own connector, and are meant to be soldered into another board.' }
  ],
  applications: [
    'Battery-powered MicroPython sensors that must sleep at tens of microamps.',
    'Wearables and badges in the TinyPICO and TinyS3 outline.',
    'Products that embed a NanoS3 or OMGS3 module on their own board.',
    'Projects with two I2C buses on one Feather-format board (FeatherS3).'
  ],
  sources: [
    'Unexpected Maker, product pages and schematics of the TinyPICO, TinyS3, FeatherS3, ProS3 and the Series[D] boards.',
    'Espressif, *ESP32-S3 Series Datasheet*: deep-sleep current and the ADC1 pins.',
    'MicroPython and CircuitPython board pages for the UM boards.'
  ],
  sim: { id: 'mb-sleep-life', params: { group: 'um' } }
},

/* ================================================================ DFRobot FireBeetle and Beetle */
{
  id: 'dfrobot-firebeetle',
  parent: 'maker-board-families',
  title: 'DFRobot FireBeetle and Beetle',
  level: 2,
  short: 'DFRobot\'s FireBeetle boards are low-power ESP32 boards in a 25.4 × 60 mm outline with a LiPo charger, an 18-pin display connector and, on some, a solar input; the Beetle is the thumb-sized version. Sleep figures depend on the revision.',
  keywords: ['DFRobot', 'FireBeetle', 'FireBeetle 2', 'Beetle', 'Romeo', 'UNIHIKER K10', 'GDI', 'low-power jumper', 'solar', 'CN3165', 'DFR0654', 'DFR1075', 'ESP32-E', 'deep sleep'],
  prereq: ['form-factors', 'adafruit-feather-boards', 'deep-sleep'],
  related: ['unexpected-maker-boards', 'wake-up-sources', 'the-board-is-not-the-chip', 'solar-power', 'battery-chargers', 'choosing-a-board'],
  body: `DFRobot, from Shanghai, sells a long line of ESP32 boards: the small **Beetle**, the **FireBeetle** low-power family, and kits built on them, such as the Romeo motor-and-servo boards, the UNIHIKER K10 learning computer, LoRaWAN boards and industrial controllers. Its trademark is the FireBeetle: 25.4 × 60 mm, a LiPo charger, a solar input on some, a design aimed at long sleep, and an 18-pin connector for the maker's own displays.

### The FireBeetle 2 family

| Board | Chip and memory | Distinctive |
|---|---|---|
| FireBeetle 2 ESP32-E | ESP32-WROOM-32E, 4 MB | WS2812 on GPIO5 (D8), LED GPIO2 (D9), user button GPIO27 (D4) |
| ESP32-E N16R8, ESP32-UE N16R2 | 16 MB flash, 2 MB PSRAM | Same layout with more memory; the title N16R8 is misleading, the module is N16R2; the UE has a u.FL antenna connector |
| ESP32-S3 N4 | 4 MB flash | LED GPIO21, user key GPIO47, native USB |
| ESP32-S3 AI board | 16 MB flash, 8 MB PSRAM | Camera, for vision work |
| ESP32-C6 | ESP32-C6FH4, 4 MB | LED GPIO15, BOOT GPIO9, battery sense GPIO0, solar input to VIN |
| ESP32-C5 | ESP32-C5 | Dual-band Wi-Fi; DFRobot quotes 21 µA deep sleep |

The first FireBeetle ESP32 (DFR0478) had a one-key download circuit and CH340 bridge and has been superseded. The **Beetle** boards are tiny: the Beetle ESP32-C3 is 20.5 × 25 mm with USB-C, 13 usable I/O and a charger of up to 400 mA. Others in the line: the **Romeo ESP32-S3** (two 2.5 A DC motor channels, 7 to 24 V input, microSD and a camera connector) and the **UNIHIKER K10**.

### What runs through the family

- **Low power with a jumper.** On the FireBeetle 2 ESP32-E a low-power solder jumper is connected by default; cutting it means the RGB LED works only on USB power.
- **A sleep figure belongs to a revision.** The C6 board draws 16 µA asleep on V1.0 and 36 µA on V1.2, the Beetle C6 14 µA on V1.0 and 37 µA on V1.1: the regulator changed. Ask which revision you hold ([[the-board-is-not-the-chip]]).
- **GDI.** An 18-pin flat connector for DFRobot's TFT and OLED displays: a display that plugs in, with its pins fixed.
- **Arduino-style names.** The ESP32-E labels D2 to D9 (D2 is GPIO25, D5 GPIO0, D9 GPIO2): labels again, not GPIO numbers.
- **Documentation errors.** The Beetle ESP32-C3's display table names a GPIO22 that the C3 does not have, and its pinout picture shows I2C on 8 and 9. Trust the chip and test.
- **Pins in use.** On the FireBeetle 2 ESP32-E, GPIO0, 1 and 3 belong to the USB-serial path: avoid them while the cable is plugged in.

### Where it fits

Battery and solar nodes, GDI displays, robots on a Romeo, smart-home nodes on the C6. Many boards in the line have only 4 MB of flash and no PSRAM unless the name carries N16.

> [!key] The FireBeetle family is DFRobot's battery-minded ESP32 line with a charger, a display connector and sometimes a solar input. Its quoted sleep current changes with the revision, its labels are not GPIO numbers, and its tables sometimes contain errors: check your revision and test.`,
  ideas: [
    'FireBeetle 2 boards are 25.4 × 60 mm, with a LiPo charger and an 18-pin GDI connector for DFRobot displays.',
    'The published deep-sleep current differs between hardware revisions of the same board, such as 16 µA and 36 µA on the C6.',
    'The Beetle boards are tiny (20.5 × 25 mm), and the Romeo and UNIHIKER lines add motors and a learning computer.',
    'The labels (D2, D9) are not GPIO numbers, and maker pin tables can contain mistakes: check against the chip.'
  ],
  pitfalls: [
    'Deep sleep takes 16 µA on this board — That is the figure for one revision. The V1.2 draws 36 µA, and a battery pack, LED and regulator add to it.',
    'Cutting the low-power jumper saves current and changes nothing else — On the ESP32-E the RGB LED then works only on USB power.',
    'The pin table is the truth — Maker tables can disagree with the chip: the Beetle C3\'s GDI table names a GPIO22 that the C3 does not have.'
  ],
  terms: [
    { term: 'FireBeetle', also: ['FireBeetle 2'], def: 'DFRobot\'s low-power ESP32 board family: 25.4 × 60 mm with a LiPo charger, an 18-pin display connector and, on some versions, a solar input.' },
    { term: 'GDI', also: ['Gravity Display Interface', 'GDI connector'], def: 'DFRobot\'s 18-pin flat-cable connector for its TFT and OLED displays, which carries the display\'s bus, power and touch lines.' },
    { term: 'Low-power jumper', also: ['solder jumper'], def: 'A small solder bridge on a board that connects or disconnects a part that wastes current. Cutting it lowers the sleep current at the price of that part\'s function.' },
    { term: 'Hardware revision', also: ['board revision', 'V1.0', 'V1.2'], def: 'A numbered version of a board\'s design. Components and pins can change between revisions, so figures such as sleep current belong to one revision.' }
  ],
  choose: {
    good: ['Battery and solar nodes that need a charger and a low sleep current on a small board', 'Projects with a DFRobot display through the GDI connector', 'Robots on a Romeo with motor drivers and a camera connector'],
    avoid: ['Relying on a quoted sleep figure without measuring your revision', 'The 4 MB boards for camera, large buffers or voice work', 'Trusting a pin table that conflicts with the chip\'s datasheet'],
    check: ['The hardware revision and its published sleep current', 'Whether the low-power jumper is in its default state', 'Which pins the USB-serial path and the display connector take']
  },
  code: [
    {
      title: 'Sleep, wake on a button or after a minute',
      about: 'Counts wake-ups in memory that survives deep sleep, says what woke the chip, then sleeps again. A push button on D2 (GPIO25) wakes it at once; otherwise a timer wakes it after a minute. The button has an external 10 kΩ pull-up so that the pin stays high while the chip sleeps.',
      needs: 'A FireBeetle 2 ESP32-E, a push button and a 10 kΩ resistor.',
      wiring: [['D2 (GPIO25)', 'button → GND'], ['D2 (GPIO25)', '10 kΩ → 3V3', 'keeps the pin high in deep sleep']],
      blocks: `
        when started
          start serial at (115200) baud
          change [wakeCount v] by (1)    // kept in RTC memory through deep sleep :: my
          print (join [wake #] (wakeCount) [, cause: ] (wake-up cause))
          enable wake on pin (25)
          deep sleep for (60) seconds
      `,
      cpp: String.raw`
        RTC_DATA_ATTR int wakeCount = 0;                 // survives deep sleep, lost on power-off
        const gpio_num_t BUTTON = GPIO_NUM_25;           // D2 on the FireBeetle 2 ESP32-E: an RTC pin

        const char *wakeName() {
          switch (esp_sleep_get_wakeup_cause()) {
            case ESP_SLEEP_WAKEUP_TIMER: return "timer";
            case ESP_SLEEP_WAKEUP_EXT0:  return "button";
            default:                     return "power-on or reset";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(500);
          wakeCount++;
          Serial.printf("wake #%d, cause: %s\n", wakeCount, wakeName());
          esp_sleep_enable_ext0_wakeup(BUTTON, 0);                  // wake when the pin is pulled low
          esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);        // or after a minute
          Serial.flush();
          esp_deep_sleep_start();                                   // never returns
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, esp32
        from machine import Pin, RTC

        rtc = RTC()
        count = int.from_bytes(rtc.memory() or b"\x00", "little") + 1      # kept through deep sleep
        rtc.memory(count.to_bytes(2, "little"))

        reason = machine.wake_reason()
        if reason == machine.TIMER_WAKE:
            cause = "timer"
        elif reason in (machine.PIN_WAKE, machine.EXT0_WAKE):
            cause = "button"
        else:
            cause = "power-on or reset"
        print("wake #%d, cause: %s" % (count, cause))

        esp32.wake_on_ext0(pin=Pin(25, Pin.IN), level=esp32.WAKEUP_ALL_LOW)   # D2: wake when pulled low
        machine.deepsleep(60000)                                              # or after a minute (milliseconds)
      `,
      output: `
        wake #1, cause: power-on or reset
        wake #2, cause: timer
        wake #3, cause: button
      `,
      notes: ['Deep sleep restarts the program, so setup() runs again at every wake; only the counter in RTC memory survives. Wi-Fi must be reconnected each time.', 'GPIO25 is an RTC pin on the ESP32 and so can wake the chip. The external resistor is needed because the internal pull-ups are off in deep sleep unless the RTC domain keeps them.']
    }
  ],
  quiz: [
    { q: 'The FireBeetle 2 ESP32-C6 is listed at 16 µA in deep sleep on V1.0 and 36 µA on V1.2. What follows?', choices: ['One of the figures is wrong', 'The figure belongs to a hardware revision, so check yours before planning a battery life', 'The chip changed', 'Both include the display'], a: 1, why: 'Parts such as the regulator changed between revisions, and the board\'s sleep current changed with them. A figure is only valid for the version it was measured on.' },
    { q: 'You cut the low-power solder jumper on a FireBeetle 2 ESP32-E. What does the catalogue say changes?', choices: ['The charger stops', 'The RGB LED works only on USB power', 'The ESP32 loses Wi-Fi', 'The board needs 5 V'], a: 1, why: 'The jumper is connected by default. Cutting it lowers the sleep current by taking the LED off the battery, so the LED then runs only on USB power.' },
    { q: 'GDI is a USB mode of the FireBeetle boards.', a: false, why: 'It is DFRobot\'s 18-pin flat-cable connector for its TFT and OLED displays.' },
    { q: 'Which DFRobot board has a two-channel 2.5 A motor driver and takes 7 to 24 V in?', choices: ['Beetle ESP32-C3', 'Romeo ESP32-S3', 'FireBeetle 2 ESP32-E', 'UNIHIKER K10'], a: 1, why: 'The Romeo is DFRobot\'s robot board: DC motor drivers, a wide-range power input, a microSD slot and a camera connector, around an ESP32-S3.' }
  ],
  applications: [
    'Solar-powered garden or weather nodes on a FireBeetle 2 ESP32-C6.',
    'Pocket gadgets with a DFRobot display plugged into the GDI connector.',
    'Wi-Fi 6, Zigbee and Thread nodes for a smart home on the C6.',
    'Camera and motor robots on a Romeo ESP32-S3.'
  ],
  sources: [
    'DFRobot Wiki, the FireBeetle 2 ESP32-E, ESP32-C6, ESP32-S3 and Beetle ESP32-C3 pages.',
    'Espressif, *ESP32 Series Datasheet*: RTC GPIOs and deep-sleep current.',
    'Espressif, *ESP-IDF Programming Guide*, sleep modes: ext0 wake-up.'
  ],
  sim: { id: 'mb-sleep-life', params: { group: 'df' } }
},

/* ================================================================ Olimex */
{
  id: 'olimex-industrial-boards',
  parent: 'maker-board-families',
  title: 'Olimex: Ethernet, PoE and open hardware',
  level: 2,
  short: 'Olimex builds open-hardware ESP32 boards for jobs that begin where the DevKit stops: wired Ethernet, power over the network cable, relays, LiPo charging and industrial temperature. The cost is a few traps in the pins.',
  keywords: ['Olimex', 'ESP32-POE', 'ESP32-POE-ISO', 'ESP32-POE2', 'ESP32-EVB', 'ESP32-GATEWAY', 'DevKit-LiPo', 'UEXT', 'Ethernet', 'LAN8710A', 'PoE', '802.3af', 'relay', 'open hardware', 'ETH_CLOCK', 'galvanic isolation'],
  prereq: ['form-factors', 'strapping-pins', 'usb-power'],
  related: ['ethernet-and-poe-boards', 'ethernet', 'relay-and-industrial-boards', 'switching-mains-safely', 'safe-pins-esp32', 'choosing-a-board'],
  body: `Olimex, from Bulgaria, publishes the schematics of its boards and sells variants for industrial temperature. Its ESP32 line serves jobs that begin where a DevKit stops: wired Ethernet, power over the network cable, relays, a LiPo charger, and a **UEXT** socket that puts power, serial, I2C and SPI on one plug.

### The families

| Board | What it adds |
|---|---|
| ESP32-POE | 100 Mbit Ethernet with a LAN8710A, 802.3af PoE input, microSD, UEXT, LiPo charger; about 200 µA asleep |
| ESP32-POE-ISO | The same with 3000 V galvanic isolation; its 5 V converter delivers 400 mA, which is 2 W |
| ESP32-POE2 | 802.3at PoE, up to 25 W in total, rails of 0.75 A at 24 V or 1.5 A at 12 V (by jumper), 1.5 A at 5 V and 1 A at 3.3 V; WROVER-E with 8 MB PSRAM |
| ESP32-EVB | Ethernet, two relays rated 10 A at 250 VAC on GPIO32 and 33, a CAN transceiver, an infrared receiver and transmitter, a 5 V jack |
| ESP32-GATEWAY | 50 × 62 mm, USB-C, Ethernet, microSD and a 20-pin connector |
| ESP32-C6-EVB | Four relays, four opto-isolated inputs (5 to 30 V), a power jack of 8 to 50 V; wireless only |
| ESP32-C5-EVB | Two relays and two opto-isolated mains inputs (110 to 240 V AC), dual-band Wi-Fi 6, Zigbee and Thread |
| DevKit-LiPo (ESP32, S2, S3, C3, C5, C6, H2) | DevKitC-compatible breadboard boards with a LiPo charger; about 10 µA asleep on the ESP32 and H2 versions |

> [!warn] The EVB boards switch mains voltage. Mains wiring is work for a qualified person, behind isolation and in an enclosure that follows the local wiring code. A bare relay board on a desk is not a product, and reflashing a mains device means opening it: never while it is plugged in.

### Ethernet on an ESP32: three traps

The ESP32's Ethernet needs a PHY chip, a fixed set of pins and a 50 MHz reference clock. Boards differ in where that clock comes from.

1. **The clock depends on PSRAM.** On the WROOM versions of the POE boards the ESP32 makes the clock on GPIO17. On WROVER and PSRAM versions GPIO16 and 17 belong to the memory, so the clock must come out of GPIO0. The wrong mode means no link. The EVB takes its clock from an external oscillator into GPIO0.
2. **PHY power on a strapping pin.** GPIO12 switches the PHY's power and is also the flash-voltage strapping pin. Olimex advises a delay after reset when Ethernet reports "init phy failed".
3. **Isolation.** The plain POE board is not isolated: disconnect Ethernet before you plug USB into a computer, or use the ISO version.

Smaller things: the EVB has no BOOT button by default (a solder change adds one), and the POE-ISO's converter is only 2 W, so loads need their own supply. The simulation below does the power sums.

> [!key] Olimex's boards bring Ethernet, PoE, relays and charging to the ESP32, with open schematics. Set the Ethernet clock mode to match PSRAM, mind GPIO12, keep Ethernet unplugged when connecting USB to a non-isolated board, and leave mains to a qualified person.`,
  ideas: [
    'Olimex boards add Ethernet, PoE, relays and LiPo charging to the ESP32 and publish their schematics.',
    'The Ethernet clock pin depends on whether the module has PSRAM: GPIO17 out on WROOM, GPIO0 out on WROVER.',
    'The plain ESP32-POE is not galvanically isolated: use the ISO board, or unplug Ethernet before USB.',
    'A PoE converter has a power budget: 2 W on the POE-ISO, up to 25 W on the POE2.'
  ],
  pitfalls: [
    'All ESP32 Ethernet boards use the same settings — The clock pin and mode, the PHY power pin and the pins differ; a WROVER board needs the GPIO0 clock mode.',
    'PoE can power anything I plug in — The POE-ISO delivers 400 mA at 5 V in total. A motor or a strip of LEDs needs its own supply.',
    'It is safe to plug USB into a board that is on PoE — The plain POE board is not isolated: unplug the network cable first, or use the ISO version.'
  ],
  terms: [
    { term: 'PoE', also: ['Power over Ethernet', 'IEEE 802.3af', 'IEEE 802.3at'], def: 'A way to power a device through the same cable as its Ethernet data. A switch or injector supplies the power, and the board converts it down to its own rails.' },
    { term: 'UEXT', also: ['pUEXT'], def: 'Olimex\'s 10-pin connector that carries 3.3 V, ground, a UART, I2C and SPI on one plug, so that modules can be attached with a ribbon cable.' },
    { term: 'Galvanic isolation', also: ['isolated PoE'], def: 'Separation of two circuits so that no direct electrical path joins them. An isolated PoE board survives a ground difference between the network and the USB computer.' },
    { term: 'PHY', also: ['Ethernet PHY', 'LAN8710A', 'LAN8720'], def: 'The chip that drives the Ethernet cable electrically. The ESP32 contains the MAC and talks to an external PHY over the RMII pins.' }
  ],
  choose: {
    good: ['A node powered and networked by one cable', 'Wired gateways and bridges to Home Assistant or MQTT', 'Open-source hardware that can be modified, with industrial-temperature variants'],
    avoid: ['The plain POE board where a computer will be plugged in while Ethernet is connected', 'Loads above the converter\'s budget from the PoE rails', 'Mains wiring by anyone but a qualified person'],
    check: ['PSRAM or not, which sets the Ethernet clock mode', 'The 802.3af or 802.3at class your switch supplies', 'Whether the BOOT button exists on your board']
  },
  code: [
    {
      title: 'Bring up Ethernet on an ESP32-POE',
      about: 'Starts the Ethernet interface with the settings of the ESP32-POE (WROOM version), waits for the link and prints the address. For a WROVER version change the clock mode.',
      needs: 'An Olimex ESP32-POE (WROOM version), an Ethernet cable to a router with DHCP, and the serial monitor.',
      wiring: [['RJ45 socket', 'Ethernet cable', 'on the board'], ['GPIO12', 'PHY power', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          start Ethernet with PHY [LAN8720 v] power pin (12) clock [GPIO17 output v] :: net
          wait (3) seconds
          if <Ethernet connected?> then
            print (join [IP address: ] (IP address))
          else
            print [no link: check the cable and the clock mode]
          end
      `,
      cpp: String.raw`
        #include <ETH.h>

        const int PHY_ADDR = 0;
        const int PHY_MDC = 23;
        const int PHY_MDIO = 18;
        const int PHY_POWER = 12;      // GPIO12 switches the PHY's power (it is also a strapping pin)

        void setup() {
          Serial.begin(115200);
          delay(1000);
          // The LAN8710A is driven with the LAN8720 settings. WROOM boards: the ESP32 makes the clock on GPIO17.
          // WROVER (PSRAM) versions need ETH_CLOCK_GPIO0_OUT, because GPIO16 and 17 belong to the PSRAM.
          ETH.begin(ETH_PHY_LAN8720, PHY_ADDR, PHY_MDC, PHY_MDIO, PHY_POWER, ETH_CLOCK_GPIO17_OUT);
          uint32_t t0 = millis();
          while (!ETH.linkUp() && millis() - t0 < 10000) delay(100);
          if (ETH.linkUp()) {
            delay(2000);                                   // let DHCP finish
            Serial.print("IP address: ");
            Serial.println(ETH.localIP());
          } else {
            Serial.println("no link: check the cable and the clock mode");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time
        from machine import Pin

        # The LAN8710A is driven with the LAN8720 settings. WROOM boards: the ESP32 makes the clock on GPIO17.
        lan = network.LAN(mdc=Pin(23), mdio=Pin(18), power=Pin(12), phy_type=network.PHY_LAN8720, phy_addr=0,
                          ref_clk=Pin(17), ref_clk_mode=Pin.OUT)
        lan.active(True)
        t0 = time.ticks_ms()
        while not lan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 12000:
            time.sleep_ms(100)
        if lan.isconnected():
            print("IP address:", lan.ipconfig("addr4")[0])
        else:
            print("no link: check the cable and the clock mode")
      `,
      output: `
        IP address: 192.168.1.60
      `,
      notes: ['The MDC and MDIO pins and the PHY address are those of the Olimex ESP32-POE; the clock and power facts come from the board\'s record in the catalogue. Check the schematic of your revision.', 'With the wrong clock mode there is no link and no error: that is the first thing to try.']
    },
    {
      title: 'Click a relay of the ESP32-EVB',
      about: 'Closes relay 1 for five seconds, opens it for five, over and over. Try it with a low-voltage test load (a 12 V lamp or a multimeter on the contacts), never with mains.',
      needs: 'An Olimex ESP32-EVB and a low-voltage test load on the relay contacts.',
      wiring: [['GPIO32', 'relay 1', 'on the board'], ['relay contacts', 'a 12 V lamp and its supply', 'low voltage only']],
      blocks: `
        when started
          set pin (32) as [output v]
        forever
          set pin (32) to [HIGH v]
          wait (5) seconds
          set pin (32) to [LOW v]
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        const int RELAY1 = 32;      // ESP32-EVB: relay 1

        void setup() {
          pinMode(RELAY1, OUTPUT);
        }

        void loop() {
          digitalWrite(RELAY1, HIGH);     // the coil is energised: the contacts close and the relay clicks
          delay(5000);
          digitalWrite(RELAY1, LOW);
          delay(5000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        relay1 = Pin(32, Pin.OUT)       # ESP32-EVB: relay 1

        while True:
            relay1.value(1)             # the coil is energised: the contacts close and the relay clicks
            time.sleep_ms(5000)
            relay1.value(0)
            time.sleep_ms(5000)
      `,
      notes: ['Relay 2 is on GPIO33. If the relay is closed when the program says open, the logic of your revision is inverted: check the schematic.', 'The relay contacts are rated 10 A at 250 VAC. Switching mains with them is for a qualified person, in an enclosure.']
    }
  ],
  quiz: [
    { q: 'An Olimex ESP32-POE with a WROVER-E module shows no Ethernet link. The sketch uses the clock mode GPIO17 out. What is the likely cause?', choices: ['The cable is too long', 'GPIO16 and 17 belong to the PSRAM on a WROVER, so the clock must be GPIO0 out', 'The router has no DHCP', 'The PHY needs 5 V'], a: 1, why: 'On WROVER and PSRAM versions the pins GPIO16 and 17 are the memory\'s, so the 50 MHz clock has to come out of GPIO0. With the wrong mode the link never comes up.' },
    { q: 'Why can plugging USB into a plain ESP32-POE while it is connected to the network cause trouble?', choices: ['USB switches off PoE', 'The board is not galvanically isolated, so the ground of the network and the computer meet', 'USB needs a PHY', 'The charger overheats'], a: 1, why: 'The plain POE has no isolation between the PoE supply and the rest of the board. The POE-ISO has 3000 V isolation; with the plain board unplug Ethernet before connecting USB.' },
    { q: 'The ESP32-POE-ISO\'s 5 V converter can supply a 1 A motor in addition to the board.', a: false, why: 'The converter delivers 5 V at 400 mA, which is 2 W, and the board itself uses part of that. Loads like a motor need their own supply.' },
    { q: 'GPIO12 switches the PHY power on these boards. What is special about GPIO12?', choices: ['It is the only output pin', 'It is the ESP32 strapping pin that selects the flash voltage', 'It is shared with USB', 'It is an input-only pin'], a: 1, why: 'GPIO12 is read at reset to select the flash voltage. Olimex advises a delay after reset when Ethernet starts too early and the PHY does not initialise.' }
  ],
  applications: [
    'Wired sensor and gateway nodes in buildings, powered by the same cable as their data.',
    'Zigbee or BLE to Ethernet bridges on the ESP32-GATEWAY.',
    'Relay controllers for lights and pumps, installed by a qualified person.',
    'Breadboard prototypes with a LiPo charger on the DevKit-LiPo boards.'
  ],
  sources: [
    'Olimex, hardware pages, schematics and user manuals of the ESP32-POE, ESP32-POE-ISO, ESP32-POE2, ESP32-EVB and ESP32-GATEWAY.',
    'Espressif, *ESP-IDF Programming Guide*, Ethernet: the ESP32 RMII interface and the reference clock.',
    'IEEE 802.3af and 802.3at, Power over Ethernet.'
  ],
  sim: 'mb-poe-budget'
},

/* ================================================================ choosing a board */
{
  id: 'choosing-a-board',
  parent: 'maker-board-families',
  title: 'Choosing a board',
  level: 1,
  short: 'The chip decides what is possible; the board decides what is convenient, safe and repeatable. Start from the job, then the chip, then the physical details: power, connectors, outline, support and the maker behind it.',
  keywords: ['choosing a board', 'board selection', 'which board', 'feather', 'thing plus', 'DevKit', 'clone', 'sleep current', 'native USB', 'board catalogue', 'advisor', 'revision', 'shield', 'battery'],
  prereq: ['choosing-a-chip', 'form-factors', 'chip-module-board'],
  related: ['adafruit-feather-boards', 'unexpected-maker-boards', 'lolin-d1-mini-family', 'olimex-industrial-boards', 'esp-as-a-co-processor', 'clones-and-counterfeits'],
  body: `Choosing a board is choosing which problems you want solved for you. The chip decides what is possible ([[choosing-a-chip]]); the board decides what is convenient, safe and cheap to repeat. A method that works:

1. **Start from the job, not the board.** Write down how it is powered (USB, battery, mains supply, PoE), how big it may be, what must plug in (Ethernet, Qwiic, a display, an SD card) and what it must speak (Wi-Fi, Bluetooth LE, Zigbee).
2. **Pick the chip** that does the job: [the project advisor](#/tools/advisor) and [the chip explorer](#/tools/chips) do this from a description.
3. **Pick the form factor** that fits what you will stack on it ([[form-factors]]).
4. **Then the details:** flash and PSRAM, charger and gauge, USB type, antenna, the sleep current *of your revision*, the board package or MicroPython and CircuitPython definition, and whether the maker publishes schematics.

### If you need this, look at that

| You need | Look at | Why |
|---|---|---|
| A long battery life | Unexpected Maker, DFRobot FireBeetle 2, Olimex DevKit-LiPo | Published deep-sleep figures from 10 to about 40 µA, against about 70 to 100 µA for some Feathers (the makers' claims) |
| Sensors with no soldering | Adafruit Feather and QT Py, SparkFun Thing Plus | STEMMA QT and Qwiic ports on the board |
| To keep D1 mini shields | LOLIN S2, S3 and C3 mini | Same outline, newer chip |
| To keep UNO shields | SparkFun IoT RedBoard ESP32, Adafruit Metro S2 and S3 | UNO shape, 3.3 V logic |
| Wired network on one cable | Olimex ESP32-POE family | Ethernet and PoE; choose ISO if USB will be plugged in |
| A USB keyboard or drive | Boards with an S2 or S3: S2 mini, S3 mini, Nano ESP32, TinyS3 | Native USB; the C3 and C6 have only serial and debug |
| The Arduino ecosystem | Arduino Nano ESP32 | Official MicroPython, Arduino Cloud; mind that the UNO R4 WiFi runs your sketch on another chip |
| A cheap board to break | NodeMCU, DOIT DevKit V1, SuperMini | Everywhere, with no maker to ask |

### Habits that save money

- **Ask the board what it is.** Run a short program that prints the chip, the flash and the PSRAM, and compare with the listing. PSRAM reported as zero may only mean that it is switched off in the board menu.
- **Keep your own pin table.** Names such as D2 are labels; write down the GPIO behind each on the board you use ([[gpio-numbers-and-board-labels]]).
- **Measure the sleep current** with your real battery and your real sensors. The chip's figure is the floor, never the answer.
- **Buy two.** One to build with, one that stays untouched so that a fault can be compared against it.

The simulation below filters the board catalogue by what you need; [the board catalogue](#/tools/boards) holds the rest.

> [!key] Choose the job, then the chip, then the form factor, then the details that decide whether the board is convenient: power, connectors, sleep current, support. Verify what you bought with a short program, and keep your own pin table.`,
  ideas: [
    'Choose in this order: the job, the chip, the form factor, then the details of power, connectors and support.',
    'Sleep current, charger and connectors belong to the board and revision, not to the chip.',
    'Native USB needs an S2, S3 or P4; the C3 and C6 have serial and debug only.',
    'Ask the board what it really is, and keep your own pin table.'
  ],
  pitfalls: [
    'The chip\'s datasheet gives the battery life — It gives the floor. The regulator, the USB bridge and the LEDs of the board set the real figure, often tens of times higher.',
    'Any board with the same chip can replace another — Pins, connectors, memory and USB differ; the code and the case may not carry over.',
    'The listing is the datasheet — Flash size, chip revision and sometimes the chip itself can differ from the listing on clones.'
  ],
  terms: [
    { term: 'Board package', also: ['board support package', 'variant'], def: 'The files that tell a programming tool about one board: its pin names, its default pins, its memory and its LED. Selecting the right one in the board menu makes a sketch use the right pins.' },
    { term: 'Hardware revision', also: ['board revision'], def: 'A numbered version of a board\'s design. Sleep current, connectors and pins can change between revisions of the same board.' },
    { term: 'Native USB', also: ['USB OTG', 'USB Serial/JTAG'], def: 'USB handled by the chip itself. Full native USB lets the board act as a keyboard, a drive or a serial port; the USB Serial/JTAG of the C3 and C6 offers only a serial port and a debugger.' }
  ],
  choose: {
    good: ['Starting from the job and a written list of needs', 'Choosing a board whose maker publishes schematics and pin tables', 'Verifying the board with a short self-report program'],
    avoid: ['Choosing by price or looks before the chip is known', 'Trusting a sleep or flash figure without measuring your revision', 'Assuming two boards with one chip share pins or code'],
    check: ['Power: charger, regulator current, sleep current of the board', 'Connectors and what you will stack on it', 'Board package and MicroPython or CircuitPython support']
  },
  code: [
    {
      title: 'What did I really buy?',
      about: 'Prints the board name, the chip, the clock, the flash and the PSRAM, so that you can compare them with the listing and with the board catalogue.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Board: ] (board name))
          print (join [Chip: ] (chip model))
          print (join [Clock in MHz: ] (CPU frequency))
          print (join [Flash in MB: ] (flash size))
          print (join [PSRAM in KB: ] (PSRAM size))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Board:  %s\n", ARDUINO_BOARD);
          Serial.printf("Chip:   %s rev %d, %d core(s)\n", ESP.getChipModel(), ESP.getChipRevision(), ESP.getChipCores());
          Serial.printf("Clock:  %lu MHz\n", (unsigned long)ESP.getCpuFreqMHz());
          Serial.printf("Flash:  %lu MB\n", (unsigned long)(ESP.getFlashChipSize() / (1024 * 1024)));
          Serial.printf("PSRAM:  %lu KB\n", (unsigned long)(ESP.getPsramSize() / 1024));    // 0 can also mean: disabled in the board menu
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, machine, esp, gc

        print("Board:  ", sys.implementation._machine)
        print("Clock:  ", machine.freq() // 1000000, "MHz")
        print("Flash:  ", esp.flash_size() // (1024 * 1024), "MB")
        gc.collect()
        print("Free heap:", gc.mem_free() // 1024, "KB")      # megabytes here mean that PSRAM is in use
      `,
      output: `
        Board:  LOLIN_S3_MINI
        Chip:   ESP32-S3 rev 2, 2 core(s)
        Clock:  240 MHz
        Flash:  4 MB
        PSRAM:  2048 KB
      `,
      notes: ['The sample is what a LOLIN S3 mini might print; yours will show your board. A flash size smaller than the listing is the commonest sign of a relabelled board.', 'MicroPython shows the board string and a free heap, but not the PSRAM size by name: a heap of megabytes means PSRAM is present.']
    }
  ],
  quiz: [
    { q: 'A battery sensor sleeps for ten minutes between readings. The ESP32\'s datasheet says 10 µA in deep sleep, but the finished board draws 200 µA while asleep. Which number sets the battery life?', choices: ['The chip\'s 10 µA', 'The board\'s 200 µA', 'The average of the two', 'Neither: only the Wi-Fi current counts'], a: 1, why: 'The battery sees the whole board. The regulator, the USB bridge, the LEDs and the charger set the floor. The chip\'s figure is only a part of it, so measure the board.' },
    { q: 'You want your board to appear as a USB keyboard. Which of these can do it?', choices: ['LOLIN C3 mini', 'LOLIN S3 mini', 'Adafruit ESP32-C6 Feather', 'Original ESP32 Feather'], a: 1, why: 'The S3 has native USB and can be a keyboard. The C3 and C6 have only USB Serial/JTAG, and the original ESP32 reaches USB through a serial chip.' },
    { q: 'A listing says 16 MB of flash, but the board reports 4 MB. What do you trust?', choices: ['The listing', 'The board\'s own report', 'Whichever is larger', 'The colour of the PCB'], a: 1, why: 'The chip reports what it is really connected to. A smaller figure than the listing is the commonest sign of a relabelled or counterfeit board.' },
    { q: 'Two boards with the same ESP32-S3 chip are interchangeable in a finished design.', a: false, why: 'Their pins, connectors, memory, USB and sleep currents can all differ. The code and the case usually have to change.' }
  ],
  applications: [
    'A project plan that lists needs first and lets the board follow.',
    'Teaching labs choosing one board type for a whole class.',
    'Buying for a product prototype: a board with published schematics and an open board definition.',
    'Checking a delivery: the self-report program shows a wrong chip or a smaller flash at once.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheets* and the hardware reference of each development kit.',
    'The makers\' product pages for the boards named: Adafruit, SparkFun, Arduino, LOLIN, Unexpected Maker, DFRobot, Olimex.',
    'Arduino core for ESP32 documentation, the board menu and the ESP class.'
  ],
  sim: 'mb-chooser'
}
);
