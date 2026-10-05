/* HYPER-ESP32 · content/m5stack-family.js
 *
 * The M5Stack family: finished, enclosed ESP32 controllers. Product facts come from the board catalogue (68 M5Stack
 * records read from docs.m5stack.com on 2026-10-04); programs follow API-CRIB.md where it speaks, and say so where the
 * calls come from M5Stack's own libraries (M5Unified, UIFlow).
 */
Hyper.add(
/* ================================================================ the idea */
{
  id: 'the-m5stack-idea',
  parent: 'm5stack-family',
  title: 'The M5Stack idea: a finished brick',
  level: 1,
  short: 'M5Stack sells ESP32 controllers that arrive finished: a case, a screen, a battery, buttons, sensors and a standard connector. The chip is Espressif\'s; the product around it is M5Stack\'s, and that is the whole idea.',
  keywords: ['M5Stack', 'M5', 'Core', 'Core2', 'CoreS3', 'Stick', 'Atom', 'Stamp', 'Cardputer', 'Dial', 'Tab5', 'finished product', 'enclosed controller', 'stackable', 'Grove', 'UIFlow', 'Shenzhen', 'development board versus product'],
  prereq: ['chip-module-board', 'anatomy-of-a-dev-board', 'choosing-a-framework'],
  related: ['m5-core-controllers', 'm5-units-and-grove-ports', 'uiflow', 'm5unified-and-m5gfx', 'choosing-a-board', 'esp32-devkitc'],
  body: `A development board is a part. You still have to find a screen, a battery, a case, something to press and a way to plug a sensor in. An M5Stack controller is the finished object: switch it on and it already has a display, buttons, a speaker or a microphone, a rechargeable cell, a motion sensor, a microSD slot, a case that fits a hand or a DIN rail, and a standard four-wire socket for adding sensors. Inside, the processor is an ordinary ESP32. M5Stack is one of the companies that build on Espressif's chips and sell the result under their own name.

### What the catalogue holds

[The board catalogue](#/tools/boards?maker=M5Stack) lists 68 M5Stack products, read from M5Stack's own documentation on 2026-10-04. By chip: 32 carry an [[soc-esp32-s3|ESP32-S3]], 24 the original [[soc-esp32|ESP32]], four an [[soc-esp32-c6|ESP32-C6]], three an [[soc-esp32-p4|ESP32-P4]], two an [[soc-esp32-c3|ESP32-C3]], and one each an ESP32-C5, an ESP32-C61 and an [[soc-esp32-h2|ESP32-H2]]. Forty-one list a display and 39 a battery built in. To filter them by need, use the chooser on [[m5-cardputer-and-specials|the specials page]].

### The product lines

| Line | What it is | Chip in the catalogue |
|---|---|---|
| Core, Core2, CoreS3 | 54 mm cubes: 2″ 320 × 240 screen, keys or touch, speaker, battery, the 30-pin M-Bus. Core also holds Fire, Gray, Tough, CoreInk | ESP32; CoreS3 ESP32-S3 |
| Stick | pocket sticks, 24 × 48 mm on the StickC-Plus2: a small screen, IR, buzzer | ESP32; StickS3 ESP32-S3 |
| Atom, AtomS3 | 24 mm cubes with a button and an LED; some add a screen, a camera or a voice | ESP32; AtomS3 ESP32-S3 |
| Stamp | castellated modules to solder into your own board | ESP32, S3, C3, C5, C6, P4 |
| Cardputer, Dial, DinMeter, Paper | a keyboard computer, knob controllers, e-paper | ESP32-S3 (Paper v1.1: ESP32) |
| Tab5 | a 5″ 1280 × 720 touch panel | ESP32-P4 |
| Units, cameras, stations | Grove modules (a few are full ESP32 boards), cameras, Grove hubs | mixed |

### How you program them

Three ways: [[uiflow|UIFlow]], blocks that become MicroPython; plain [[micropython-setup|MicroPython]]; and Arduino C++ with the [[m5unified-and-m5gfx|M5Unified]] library. The catalogue lists what each board supports: older ones say UIFlow, newer ones UIFlow2, and Arduino and ESP-IDF work as for any ESP32.

### What you give up

- **Pins.** The parts take many, and the case exposes few. On a Core2 the screen, touch, motion sensor, clock and power chip use pins you did not pick.
- **Battery.** The cells are small: 110 mAh in the Core Basic, 500 mAh in the Core2, 95 to 250 mAh in the Sticks.
- **A stable name.** One name can hide revisions with different parts: the Core2 has three, and code must tell them apart.

> [!key] An M5Stack controller is an ESP32 made into a finished, enclosed product with a screen, a battery and a standard connector. You give up freedom of pins and a large battery; you gain the afternoon you would have spent on the case, the wiring and the drivers.`,
  ideas: [
    'Every M5Stack product in the catalogue has an Espressif chip inside; the product is the case, the parts and the software around it.',
    'The lines differ by form factor: Core cubes, Stick and Atom pockets, Stamp modules, and specials such as the Cardputer, the Dial and the Tab5.',
    'Forty-one of the 68 catalogued products have a screen and 39 a battery, so "an M5Stack" does not promise either.',
    'You choose one by the chip inside, the screen, the battery and the connectors, not by the colour of the case.'
  ],
  pitfalls: [
    'M5Stack is a different kind of microcontroller — It is a seller of finished products. The chip is an ESP32, S3, C6 or P4 from Espressif, and the usual limits and libraries of that chip apply.',
    'All M5Stack products run the same code — The library hides pins and parts, but a Core2 and a CoreS3 differ in chip, power chip and camera, and revisions of one name differ again.',
    'The case exposes everything the chip can do — Most pins are taken by the parts or sealed in the case; what is left comes out on the M-Bus, the header pads and the Grove ports.'
  ],
  terms: [
    { term: 'M5Stack', also: ['M5'], def: 'A company in Shenzhen that builds finished, enclosed controllers around Espressif chips and sells them with screens, batteries, sensors and a standard connector.' },
    { term: 'Core', also: ['M5Stack Core'], def: 'The classic M5Stack form: a 54 mm cube with a 2″ screen, three keys or touch zones, a speaker, a battery and the M-Bus connector. Basic, Gray, Fire, Core2 and CoreS3 are cores.' },
    { term: 'Form factor', also: ['product line'], def: 'The size, shape and connectors of a board, which decide what cases and accessories fit it. M5Stack names its products by form factor: Core, Stick, Atom, Stamp.' }
  ],
  choose: {
    good: ['A working gadget in an afternoon: screen, battery and sensors are already integrated', 'Teaching and demonstrations: one cable, blocks or Python, nothing to solder', 'One-off tools and prototypes that must look finished', 'Sensors added through a standard connector instead of wiring'],
    avoid: ['Pin-hungry projects: the case exposes few GPIOs', 'A product to be built in thousands: choose a Stamp or a bare module and design your own board', 'Weeks on a battery without a low-power plan: the cells are small'],
    check: ['Which chip is inside: an ESP32 and an ESP32-S3 differ in USB, PSRAM and libraries', 'Which hardware revision you are buying: parts change under one name', 'That your library version knows your revision (newer screens need a current library)']
  },
  quiz: [
    { q: 'Which description fits an M5Stack Core2 best?', choices: ['A new processor designed by M5Stack', 'An ESP32 in a case with a touch screen, battery, sensors and connectors', 'A bare module for soldering into a product', 'A shield that plugs onto an Arduino Uno'], a: 1, why: 'The processor is Espressif\'s ESP32. What M5Stack adds is the finished product: case, 2″ touch screen, battery, motion sensor, clock, speaker and connectors.' },
    { q: 'A Core2 and a CoreS3 look almost the same. What is the biggest difference inside?', choices: ['The CoreS3 has no screen', 'The CoreS3 has an ESP32-S3 with native USB (and a camera); the Core2 has the original ESP32', 'The Core2 has no battery', 'They contain the same chip with different firmware'], a: 1, why: 'The Core2 is built on the original ESP32 with a USB bridge chip; the CoreS3 uses an ESP32-S3 with native USB, and adds a 0.3 MP camera and more sensors.' },
    { q: 'Every M5Stack product in the catalogue has a screen.', a: false, why: 'Forty-one of the 68 have one. Atom Lite, Stamp modules, the Unit PoE-P4 and the TimerCamera have none.' },
    { q: 'A project needs twenty free GPIOs and a month on one charge. What is the honest verdict on a Core-class controller?', choices: ['Ideal: that is what they are for', 'A poor fit: the case exposes few pins and the cells are small, so a Stamp or a bare module with your own power design suits better', 'Impossible with any ESP32', 'Fine as long as UIFlow is used'], a: 1, why: 'A Core spends many pins on its own parts and carries 110 to 500 mAh. A month on a charge needs deep sleep and a larger cell, and twenty GPIOs need a module you wire yourself.' }
  ],
  applications: [
    'Classroom and workshop kits: one cable, blocks or Python, nothing to solder.',
    'Handheld tools and test gadgets: a Core2 or a Stick with its own screen and battery.',
    'Control panels: the DinMeter on a DIN rail, the Tough with RS485, the Tab5 with a 5″ screen.',
    'Prototypes that must look finished at a demonstration.'
  ],
  sources: [
    'M5Stack documentation (docs.m5stack.com): the product page of each controller, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*: the chips inside the products.',
    'M5Stack\'s public repositories for M5Unified, M5GFX and the UIFlow 2 firmware: the libraries and firmware that make the products usable.'
  ],
  sim: 'm5-family-chart'
},

/* ================================================================ Core */
{
  id: 'm5-core-controllers',
  parent: 'm5stack-family',
  title: 'Core: Basic, Core2, CoreS3',
  level: 1,
  short: 'The 54 mm cube with a 2″ screen, three keys, a speaker, a battery and the M-Bus underneath. Three generations: the Basic on an ESP32, the Core2 with touch and a power chip, the CoreS3 on an ESP32-S3 with a camera.',
  keywords: ['Core', 'Core Basic', 'M5Stack Basic', 'Core2', 'CoreS3', 'Fire', 'Gray', 'Tough', 'AXP192', 'AXP2101', 'IP5306', 'ILI9342C', 'FT6336U', 'M-Bus', 'CoreInk', 'touch screen', 'IMU'],
  prereq: ['the-m5stack-idea', 'soc-esp32', 'soc-esp32-s3'],
  related: ['m5-bus-and-modules', 'm5-units-and-grove-ports', 'm5unified-and-m5gfx', 'uiflow', 'm5-cardputer-and-specials', 'lithium-cells', 'capacitive-touch-screens'],
  body: `The Core is the shape most people mean by "an M5Stack": a 54 mm cube with a 2″ 320 × 240 colour screen on top, three keys or touch zones below it, a speaker, a battery in the base, and a 30-pin connector underneath for [[m5-bus-and-modules|stacking modules]]. Three generations share the idea and differ inside.

### The three generations

| | [Core Basic v2.7](#/tools/boards?b=m5stack-core-basic-v2-7) | [Core2](#/tools/boards?b=m5stack-core2) | [CoreS3](#/tools/boards?b=m5stack-cores3) |
|---|---|---|---|
| Chip | [[soc-esp32|ESP32]] | the same | [[soc-esp32-s3|ESP32-S3]] |
| Flash / PSRAM | 16 MB / none | 16 MB / 8 MB quad | 16 MB / 8 MB quad |
| Screen | ILI9342C over SPI | the same, plus capacitive touch (FT6336U) | the same, plus touch |
| Battery, power chip | 110 mAh, IP5306 | 500 mAh, AXP192 | 500 mAh (listed in the DinBase), AXP2101 |
| Sensors | none | motion sensor, clock, microphone | camera 0.3 MP, proximity, IMU and magnetometer, clock, two microphones |
| USB | bridge chip | bridge chip | native USB |

Around them: the **Gray** adds a motion sensor and a magnetometer; the **Fire** has 8 MB of PSRAM, ten RGB LEDs and an analogue microphone in a 28.6 mm base; the **Tough** is the industrial one, with RS485, a 6 to 24 V input and a UV-resistant case. Later revisions change parts: the Core2 v1.1 has an AXP2101 power chip with a current monitor, the v1.3 another motion sensor. The CoreS3 has a Lite (200 mAh, plain back), an SE (no camera, proximity sensor, IMU or battery) and a Thread border router variant that adds an ESP32-H2 as radio co-processor.

### What the catalogue warns about

M5Stack writes GPIO21 as G21, and so do these pages.

- **Core2:** the screen's reset, its backlight and the speaker's enable go through the AXP192 power chip, not through GPIOs. The inside I2C bus (G21, G22) carries touch, motion sensor, clock and power chip together.
- **CoreS3:** reset lines of the screen, the touch controller and the amplifier sit on an I2C pin expander; G35, G36 and G37 are shared by the screen and the microSD slot.
- **Core Basic:** the screen uses a single data line on G23; the speaker is on G25 (a DAC pin), shared with an M-Bus pin; the microSD slot shares G18, G23 and G19.
- **Fire:** G16 and G17 are wired to its PSRAM, and Port C uses them: avoid both when stacking modules.

This is why the Core is programmed through a library: backlight and reset are not pins you can write. See [[m5unified-and-m5gfx]].

> [!warn] These controllers contain a lithium cell charged by the board's own circuit. Never charge it from a GPIO or a bare supply, do not puncture it, and stop using a unit whose case has begun to bulge. See [[lithium-cells]].

> [!key] A Core is a screen, a battery and an ESP32 in a 54 mm cube. Choose the Core2 for touch and a better battery, the CoreS3 for native USB, PSRAM and a camera, the Basic for the simplest and smallest cell; the pins that matter are hidden behind power chips, so use the library.`,
  ideas: [
    'Core Basic and Core2 use the original ESP32; the CoreS3 uses the ESP32-S3 with native USB, a camera and more sensors.',
    'On the Core2 and CoreS3 the screen reset, backlight and speaker enable are controlled through a power chip or pin expander, not through GPIOs.',
    'Hardware revisions of one name change the power chip or the motion sensor, so libraries must detect the revision.',
    'The three keys of a Core2 are touch zones under the screen; the Basic has real keys.'
  ],
  pitfalls: [
    'I can switch the Core2 backlight with digitalWrite — The backlight goes through the AXP192 power chip. A program that writes a GPIO changes nothing; use the library, which talks to the chip.',
    'The Core2 and Core2 v1.1 are the same board for software — The power chip changed from AXP192 to AXP2101 and its registers differ; code that talks to the chip directly breaks.',
    'A bigger battery number means a longer run — The cells are 110 to 500 mAh and the screen alone can use a large part of what the board draws.'
  ],
  terms: [
    { term: 'PMIC', also: ['power management IC', 'AXP192', 'AXP2101'], def: 'A chip that charges the battery, makes the supply voltages and switches parts on and off. The Core2 and CoreS3 control their backlight, speaker and reset lines through one, over I2C.' },
    { term: 'IO expander', also: ['pin expander', 'AW9523B'], def: 'A chip that adds extra input and output pins to a controller over I2C. The CoreS3 uses one for screen, touch and amplifier resets.' },
    { term: 'Hardware revision', also: ['board revision', 'v1.1', 'v1.3'], def: 'A later version of a board sold under the same name, with some parts changed. Core2 v1.0, v1.1 and v1.3 differ in the power chip and the motion sensor.' }
  ],
  choose: {
    good: ['A touch interface with its own battery, clock and haptics in a 54 mm cube (Core2)', 'Camera, microphones and native USB in one unit (CoreS3)', 'The simplest, smallest-battery unit for teaching with UIFlow or Arduino (Basic)', 'Industrial panels with RS485 and a wide supply input (Tough)'],
    avoid: ['Weeks of battery life: the cells are 110 to 500 mAh', 'Projects that need pins freely: most are taken by the screen, speaker and sensors', 'A strong magnet nearby, with the magnetometer variants'],
    check: ['The hardware revision on the label, and that your library knows it', 'Whether you need PSRAM (not on the Basic) or native USB (only on the CoreS3)', 'Which pins your stacked modules claim on the M-Bus']
  },
  formulas: [
    {
      name: 'Battery run time',
      expr: 't = C*u/I',
      tex: 't = \\frac{C\\,u}{I}',
      vars: {
        t: { name: 'run time', q: 'time', unit: 'h', tex: 't' },
        C: { name: 'battery capacity', q: 'charge', unit: 'mA·h', value: 500, tex: 'C' },
        u: { name: 'usable fraction', q: 'ratio', value: 0.8, min: 0.1, max: 1, tex: 'u' },
        I: { name: 'average current', q: 'current', unit: 'mA', value: 100, tex: 'I' }
      },
      note: 'The catalogue gives capacities, not currents: measure your own program with the screen on. About 80 % of a small cell is usable before the board cuts out.',
      stories: { t: 'A Core2 with a {C} cell, of which {u} is usable, draws {I} on average with its screen lit. How long does it run?' },
      practice: { unknowns: ['t', 'I'] }
    }
  ],
  examples: [
    {
      title: 'Which Core for a handheld meter?',
      q: 'A handheld meter must show a graph, take presses on the screen, log to a microSD card, and survive a day on its battery drawing about 60 mA. Which Core suits, and how long does its battery last?',
      steps: ['Touch and a battery of useful size point to the Core2 (500 mAh); the Basic has keys only and a 110 mAh cell.', 'A microSD slot is listed on the Core2.', 'Run time $t = C\\,u/I = 500 \\times 0.8 / 60 \\approx 6.7$ hours with 80 % of the cell usable.'],
      a: 'A Core2: about 6.7 hours at 60 mA. A day needs a lower average current (sleep between samples), a bigger cell through a base, or a charger in the loop.'
    }
  ],
  quiz: [
    { q: 'A program writes a GPIO to switch on the Core2\'s screen backlight and nothing happens. Why?', choices: ['The ESP32 has no output pins', 'The backlight is always on', 'The backlight is switched by the AXP192 power chip over I2C, not by a GPIO', 'GPIO writes are blocked by UIFlow'], a: 2, why: 'On the Core2 the backlight, the screen reset and the speaker enable go through the power chip. The library talks to the chip; a bare GPIO write reaches nothing.' },
    { q: 'Which Core has native USB, a camera and PSRAM?', choices: ['Core Basic', 'Core2', 'CoreS3', 'All three'], a: 2, why: 'The CoreS3 is built on the ESP32-S3 (native USB, 8 MB quad PSRAM) with a GC0308 camera. The Basic and Core2 use the original ESP32 with a USB bridge chip.' },
    { q: 'On a Core2 the screen backlight is switched by the power chip rather than by a GPIO, and a Core2 v1.1 carries a different power chip from the v1.0.', a: true, why: 'The catalogue records the backlight, reset and speaker enable on the AXP192, and the v1.1 swaps it for an AXP2101 whose registers differ, so a library must detect which one it is on.' },
    { q: 'A Core2 draws an average of 100 mA from its 500 mAh cell, of which 80 % is usable. How long does it run?', choices: ['About 5 hours', 'About 8 hours', 'About 40 minutes', 'About 4 hours'], a: 3, why: '500 mAh × 0.8 / 100 mA = 4 hours. Using the full 500 mAh would give 5 hours, which the board never reaches because it cuts out before the cell is empty.' }
  ],
  applications: [
    'Handheld meters and testers with a graph, a battery and a microSD log.',
    'Touch control panels in workshops and on test benches.',
    'Teaching controllers: one object with screen, buttons and sound.',
    'Industrial panels on RS485 using the Tough.'
  ],
  sources: [
    'M5Stack documentation: product pages of the Core (Basic v2.7), Core2, CoreS3 and Tough, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*.',
    'X-Powers, AXP192 and AXP2101 datasheets (the power chips of the Core2 and CoreS3).'
  ],
  code: [
    {
      title: 'Three keys and the battery',
      about: 'The three keys paint the screen red, green or blue, and the battery level is shown and refreshed every second. The same calls work on a Basic, a Core2 and a CoreS3.',
      needs: 'An M5Stack Core2 (or Basic, or CoreS3) and the M5Unified library.',
      libs: ['M5Unified'],
      blocks: `
        define show battery
          show (join [Battery ] (battery level in percent)) at x (10) y (10) :: display

        when started
          start display :: display
          show battery :: my

        when button [A v] pressed
          fill screen [red v] :: display
          show battery :: my

        when button [B v] pressed
          fill screen [green v] :: display
          show battery :: my

        when button [C v] pressed
          fill screen [blue v] :: display
          show battery :: my

        every (1) seconds
          show battery :: my
      `,
      cpp: String.raw`
        #include <M5Unified.h>

        uint32_t lastShown = 0;

        void showBattery() {
          M5.Display.setCursor(10, 10);
          M5.Display.printf("Battery %d %%  ", (int)M5.Power.getBatteryLevel());
        }

        void setup() {
          auto cfg = M5.config();
          M5.begin(cfg);                  // finds out which board this is and sets it up
          M5.Display.setTextSize(2);
          M5.Display.setTextColor(TFT_WHITE, TFT_BLACK);
          showBattery();
        }

        void loop() {
          M5.update();                    // reads keys, touch and power: call it every pass
          if (M5.BtnA.wasPressed()) { M5.Display.fillScreen(TFT_RED);   showBattery(); }
          if (M5.BtnB.wasPressed()) { M5.Display.fillScreen(TFT_GREEN); showBattery(); }
          if (M5.BtnC.wasPressed()) { M5.Display.fillScreen(TFT_BLUE);  showBattery(); }
          if (millis() - lastShown >= 1000) {
            lastShown = millis();
            showBattery();
          }
        }
      `,
      py: String.raw`
        # UIFlow 2 firmware: runs on M5Stack's UIFlow MicroPython, not on stock MicroPython
        import M5
        from M5 import *
        import time

        last_shown = 0
        label = None

        def show_battery():
            label.setText("Battery " + str(Power.getBatteryLevel()) + " %")

        def setup():
            global label
            M5.begin()                    # finds out which board this is and sets it up
            Widgets.fillScreen(0x000000)
            label = Widgets.Label("", 10, 10, 1.0, 0xFFFFFF, 0x000000, Widgets.FONTS.DejaVu18)
            show_battery()

        def loop():
            global last_shown
            M5.update()                   # reads keys, touch and power: call it every pass
            if BtnA.wasPressed():
                Widgets.fillScreen(0xFF0000)
                show_battery()
            if BtnB.wasPressed():
                Widgets.fillScreen(0x00FF00)
                show_battery()
            if BtnC.wasPressed():
                Widgets.fillScreen(0x0000FF)
                show_battery()
            if time.ticks_diff(time.ticks_ms(), last_shown) >= 1000:
                last_shown = time.ticks_ms()
                show_battery()

        setup()
        while True:
            loop()
      `,
      notes: ['On a Core2 the three "keys" are touch zones under the screen; on a Basic they are real keys. The program does not care.', 'The MicroPython version uses names from M5Stack\'s UIFlow 2 firmware (2.5.3 at the time of writing); check them against the firmware on your device.', 'The Basic reports its battery in coarse steps of 25 % (the catalogue\'s note on its IP5306 power chip), so do not expect a smooth percentage.']
    }
  ],
  sim: 'm5-core-layers'
},

/* ================================================================ Stick */
{
  id: 'm5-stick-controllers',
  parent: 'm5stack-family',
  title: 'Stick: StickC Plus2 and StickS3',
  level: 1,
  short: 'A pocket stick 24 mm wide with a small screen, two or three keys, a motion sensor, a buzzer and an IR LED. The StickC-Plus2 holds its own power on and has no power chip; the StickS3 moves to an ESP32-S3 and a codec.',
  keywords: ['Stick', 'StickC', 'StickC-Plus', 'StickC-Plus2', 'StickS3', 'StickT2', 'M5PM1', 'AXP192', 'HOLD', 'GPIO4', 'IR', 'HAT', 'MPU6886', 'buzzer', 'power hold'],
  prereq: ['the-m5stack-idea', 'soc-esp32', 'digital-output'],
  related: ['m5-atom-controllers', 'm5-units-and-grove-ports', 'm5unified-and-m5gfx', 'infrared-transmitters', 'buzzers-and-tones', 'measuring-battery-level'],
  body: `The Stick is the pocket member of the family: a case about 24 mm wide and 48 mm tall on the StickC-Plus2, a small colour screen, two or three keys, a buzzer or speaker, an infrared LED and a motion sensor. It is the usual choice for a remote control, a tilt sensor, a badge or a data logger that fits in a shirt pocket.

### The generations

| | [StickC](#/tools/boards?b=m5stack-m5stickc) | [StickC-Plus](#/tools/boards?b=m5stack-stickc-plus) / [Plus2](#/tools/boards?b=m5stack-stickc-plus2) | [StickS3](#/tools/boards?b=m5stack-sticks3) |
|---|---|---|---|
| Chip | ESP32-PICO-D4 | ESP32-PICO-D4; the Plus2 an ESP32-PICO-V3-02 | ESP32-S3-PICO-1-N8R8 |
| Memory | 4 MB flash | 4 MB flash; Plus2: 8 MB flash and 2 MB PSRAM | 8 MB flash, 8 MB octal PSRAM |
| Screen | 0.96″ 80 × 160 | 1.14″ 135 × 240 | 1.14″ 135 × 240 |
| Battery | 95 mAh, AXP192 | 120 mAh, AXP192; Plus2: 200 mAh, no power chip | 250 mAh, M5PM1 power chip |
| Extras | IMU, clock, microphone, IR, red LED | the same, plus a buzzer | codec, microphone, speaker, IR transmitter and receiver, IMU |

The family also holds the **StickC-Plus SE** (cheaper, no motion sensor, an 8-pin Hat bus) and the **StickT2**, which carries a thermal camera (160 × 120, about 8.7 frames a second).

### The one that surprises: power hold

The StickC-Plus2 dropped the AXP192 power chip. Power is now latched by a pin: the program must drive **GPIO4 high** early, or the unit switches itself off when the power button is released. Battery voltage is read on GPIO38 through a divider; the catalogue gives no ratio, so a library does the conversion. Also on the Plus2, the infrared emitter and the red LED share GPIO19, so one cannot be used without the other, and the buttons sit on GPIO37, 39 and 35 (input-only pins).

### The others to know

- **StickC-Plus:** G36 and G25 share one pad on the Hat header; set the unused one as a floating input.
- **StickS3:** the 5 V supply for the Grove port, the Hat and the IR LED is **off by default** in M5Unified; switch it on with \`M5.Power.setExtOutput(true)\` before using them. Not every older Hat fits mechanically.
- Cells of 95 to 250 mAh are small; the screen and the radio can empty one in an hour or two.

> [!warn] The cell is a lithium cell charged by the unit's own circuit. Do not charge it any other way, and do not use a unit whose case swells.

> [!key] A Stick is a pocket ESP32 with a screen, a motion sensor, a buzzer and an IR LED. On a StickC-Plus2 your program must hold GPIO4 high to stay powered; on a StickS3 you must enable the external 5 V before the Grove port has power.`,
  ideas: [
    'The Stick is the pocket form: about 24 mm wide, a small screen, two or three keys, a buzzer and an IR LED, with a battery of 95 to 250 mAh.',
    'The StickC-Plus2 has no power chip: a program must drive GPIO4 high to keep the unit on.',
    'The StickS3 is an ESP32-S3 with a codec, microphone, speaker and IR receiver; its external 5 V is off until the library switches it on.',
    'Shared pins matter: on the Plus2 the IR LED and the red LED share GPIO19; on the StickC-Plus two Hat pins share one pad.'
  ],
  pitfalls: [
    'A StickC-Plus2 that switches off after boot is broken — It is waiting for GPIO4 to be driven high; the library does this for you, a bare program must do it first.',
    'The IR LED and the red LED are two separate outputs on the Plus2 — They share GPIO19: sending infrared flashes the red LED.',
    'The StickS3 Grove port is powered whenever the stick is on — The external 5 V is off by default in the library: enable it before plugging a unit and expecting it to work.'
  ],
  terms: [
    { term: 'Power hold', also: ['HOLD pin', 'power latch'], def: 'A pin the program drives high to keep the board powered after the power button is released. The StickC-Plus2 uses GPIO4, CoreInk GPIO12.' },
    { term: 'Hat', also: ['HAT', 'Hat-Bus'], def: 'A small add-on board that plugs onto the pins of a Stick: a joystick, a sensor, a speaker or a battery.' },
    { term: 'Passive buzzer', also: ['piezo buzzer'], def: 'A buzzer with no oscillator of its own: it makes sound only while the program feeds it a square wave of the pitch it should play.' },
    { term: 'External 5 V', also: ['EXT_5V', 'setExtOutput'], def: 'The switched 5 V supply to the Grove port and Hat pins of the StickS3. It is off until the program (or library) turns it on.' }
  ],
  choose: {
    good: ['Pocket remotes, tilt sensors and badges with a screen and a buzzer', 'Infrared remote experiments: an IR LED is built in (and, on the StickS3, a receiver)', 'A cheap ESP32 with some PSRAM (Plus2) or a lot (StickS3)'],
    avoid: ['Anything lasting a day on its cell with the screen lit', 'Projects needing many pins: the Hat header offers a handful', 'Code that expects the AXP192 power chip on a Plus2 or a StickS3'],
    check: ['Which StickC you hold: the screen and the power chip differ', 'That the program holds GPIO4 high (Plus2) or enables the 5 V (StickS3)', 'Which Hats fit your stick mechanically']
  },
  quiz: [
    { q: 'A StickC-Plus2 runs your program for a moment and then switches off when you release the power button. What is the likely cause?', choices: ['The battery is empty', 'The program never drove GPIO4 high, so the power latch was released', 'The screen needs the AXP192 power chip', 'The ESP32 overheated'], a: 1, why: 'The Plus2 has no power chip: GPIO4 latches the power on and the program must set it high early. Libraries do it for you; a bare program must.' },
    { q: 'A Grove sensor on a StickS3 stays dead although the wiring is right. What does the catalogue say to check first?', choices: ['That UIFlow is installed', 'That the external 5 V output has been switched on', 'That GPIO4 is held high', 'That the Grove port is set to input'], a: 1, why: 'On the StickS3 the 5 V for the Grove port, the Hat and the IR LED is off by default in M5Unified; the program must enable it (the library call is setExtOutput).' },
    { q: 'On a StickC-Plus2 the infrared emitter and the red LED are driven by the same GPIO, so blinking one blinks the other.', a: true, why: 'The catalogue lists both on GPIO19. A program that blinks the red LED also sends infrared pulses, and the other way round.' },
    { q: 'Why does a passive buzzer need PWM or a tone call rather than digitalWrite(HIGH)?', choices: ['It runs on 5 V', 'digitalWrite is too slow for a buzzer', 'It has no oscillator inside: a steady level gives a click, only a square wave of the right pitch gives a note', 'It sits on an input-only pin'], a: 2, why: 'A passive buzzer is a transducer that moves with the signal. A constant high only pushes it once; the pitch is the frequency of the square wave you feed it.' }
  ],
  applications: [
    'Pocket infrared remotes, using the built-in IR LED (and the IR receiver on the StickS3).',
    'Tilt, gesture and step-counting gadgets built on the motion sensor.',
    'Badges and name tags with a small screen and a battery.',
    'Pocket data loggers that wake, sample and sleep.'
  ],
  sources: [
    'M5Stack documentation: product pages of the StickC-Plus2, StickC-Plus, StickS3 and StickT2, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32 Series Datasheet*: GPIO 34 to 39 are input-only.',
    'Arduino core for ESP32 documentation, *LEDC* API (ledcAttach, ledcWriteTone), core 3.3.'
  ],
  code: [
    {
      title: 'Hold the power, beep, read the battery pin',
      about: 'What a library does for you on a StickC-Plus2, done by hand: latch the power on with GPIO4, sound the passive buzzer on GPIO2 for a fifth of a second, then print the voltage seen on the battery pin once a second.',
      needs: 'An M5StickC-Plus2 (ESP32-PICO-V3-02). Pins as listed in the board catalogue.',
      wiring: [['GPIO4', 'power hold (on the board)', 'drive high first'], ['GPIO2', 'passive buzzer (on the board)'], ['GPIO38', 'battery voltage through a divider (on the board)', 'input-only, ADC1']],
      blocks: `
        when started
          set pin (4) as [output v]
          set pin (4) to [HIGH v]            // latch the power on first
          start serial at (115200) baud
          play tone (880) Hz on pin (2) for (0.2) seconds
        forever
          print (join [pin G38: ] (analog read pin (38) in millivolts))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int POWER_HOLD = 4;     // StickC-Plus2: this pin latches the power on
        const int BUZZER = 2;         // passive buzzer
        const int BATTERY_ADC = 38;   // battery voltage through a divider

        void setup() {
          pinMode(POWER_HOLD, OUTPUT);
          digitalWrite(POWER_HOLD, HIGH);       // first of all: without this the unit turns off
          Serial.begin(115200);
          ledcAttach(BUZZER, 2000, 8);
          ledcWriteTone(BUZZER, 880);           // a passive buzzer needs a square wave: 880 Hz
          delay(200);
          ledcWriteTone(BUZZER, 0);             // silence
        }

        void loop() {
          Serial.printf("pin G38: %u mV\n", analogReadMilliVolts(BATTERY_ADC));
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM, ADC
        import time

        POWER_HOLD = 4      # StickC-Plus2: this pin latches the power on
        BUZZER = 2          # passive buzzer
        BATTERY_ADC = 38    # battery voltage through a divider

        hold = Pin(POWER_HOLD, Pin.OUT)
        hold.value(1)                           # first of all: without this the unit turns off

        buzzer = PWM(Pin(BUZZER), freq=880, duty_u16=32768)   # a passive buzzer needs a square wave: 880 Hz
        time.sleep_ms(200)
        buzzer.duty_u16(0)                      # silence

        adc = ADC(Pin(BATTERY_ADC), atten=ADC.ATTN_11DB)
        while True:
            print("pin G38:", adc.read_uv() // 1000, "mV")
            time.sleep(1)
      `,
      output: `
        pin G38: 1930 mV
        pin G38: 1928 mV
      `,
      notes: ['The reading is the voltage at the pin, after the board\'s divider. The catalogue gives no divider ratio, so convert with the ratio from the board\'s schematic or use a library.', 'A lithium cell is charged by the unit\'s own circuit, never from a pin.']
    }
  ]
},

/* ================================================================ Atom */
{
  id: 'm5-atom-controllers',
  parent: 'm5stack-family',
  title: 'Atom: Lite, Matrix, AtomS3',
  level: 1,
  short: 'An ESP32 in a 24 mm cube with a button, an LED, USB-C and a Grove port, and little else. The ESP32 Atoms (Lite, Matrix, Echo) and the ESP32-S3 AtomS3 family add a screen, a camera or a voice.',
  keywords: ['Atom', 'Atom Lite', 'Atom Matrix', 'Atom Echo', 'Atom Voice', 'AtomS3', 'AtomS3 Lite', 'AtomS3R', 'AtomS3U', 'SK6812', 'WS2812C', 'IR transmitter', 'MPU6886', 'BMI270', 'AtomS3R-CAM'],
  prereq: ['the-m5stack-idea', 'soc-esp32', 'soc-esp32-s3'],
  related: ['m5-stick-controllers', 'm5-stamp-modules', 'm5-units-and-grove-ports', 'addressable-leds', 'rgb-leds', 'motion-sensors-imu'],
  body: `An Atom is an ESP32 in a 24 mm cube. The smaller ones have a button, an LED, a USB-C socket and a Grove port, and almost nothing else, which is the point: it is among the cheapest ways to put a radio and a plug-in sensor in a small box.

### Two families

| | Atom (ESP32) | AtomS3 (ESP32-S3) |
|---|---|---|
| Members | Lite, Matrix, Echo | S3, S3 Lite, S3R, S3R-CAM, S3R-M12, S3R-Ext, S3U, Voice S3R |
| Chip | ESP32-PICO-D4, 4 MB flash | ESP32-S3FN8 with 8 MB flash; the "R" family ESP32-S3-PICO-1-N8R8 with 8 MB flash and 8 MB octal PSRAM |
| USB | USB-C through a bridge chip | native USB |
| Grove | G26 and G32 | G2 and G1 |

### The Atoms

- **[Atom Lite](#/tools/boards?b=m5stack-atom-lite):** one SK6812 RGB LED on G27, a button on G39, an infrared transmitter on G12, six header pads (G19, G21, G22, G23, G25, G33) plus 5 V, 3.3 V and ground. G39 is an input-only pin.
- **[Atom Matrix](#/tools/boards?b=m5stack-atom-matrix):** twenty-five WS2812C LEDs in a 5 × 5 grid on the same G27, and a motion sensor on I2C (SCL G21, SDA G25). The v1.1 swaps the MPU6886 for a BMI270, so code for v1.0 needs a new driver. M5Stack advises a FastLED brightness of about 20: the LEDs and the acrylic can be damaged.
- **Atom Echo** (now documented as Atom Voice): a speaker amplifier and a PDM microphone; G33 serves as the amplifier's word clock *and* the microphone's clock.

### The AtomS3 family

- **[AtomS3](#/tools/boards?b=m5stack-atoms3):** a 0.85″ 128 × 128 screen, a motion sensor on G38 and G39 (which are also two of the six pins on the back), a Grove port on G2 and G1, no PSRAM, backlight best driven at about 500 Hz.
- **AtomS3 Lite:** an RGB LED and a button; no screen, no IMU. **AtomS3U:** a USB-stick shape with a Type-A plug, a microphone and an LED.
- **AtomS3R:** PSRAM, an IMU with a magnetometer, a faster IR LED. Its screen driver changed from GC9107 to ST7735 on 2026-05-14: use a current M5GFX. **-CAM** adds a 0.3 MP camera (GPIO18 low powers it), **-M12** a 3 MP camera with a swappable lens, **-Ext** a small proto board on a ribbon cable with 14 GPIOs.
- **Voice S3R:** an audio codec, a microphone and an 8 Ω 1 W speaker; amplifier enable on G18.

### Living with six pins

An Atom Lite offers six header pins and the Grove pair. On a Matrix two of those six are already the motion sensor's bus: anything you add on G21 and G25 joins that bus and must not share the sensor's address (0x68). On an AtomS3 the same happens on G38 and G39. Check the board's pin table before you solder to the back.

> [!key] An Atom is the smallest ready-made ESP32: a button, an LED and a Grove port in 24 mm. Pick an ESP32 Atom for the lowest cost, an AtomS3 for native USB, a screen or a camera, and remember that the few free pins may already carry the motion sensor.`,
  ideas: [
    'Atoms are 24 mm cubes: a button, an LED, USB-C, a Grove port and about six free pins.',
    'The ESP32 Atoms (Lite, Matrix, Echo) use a bridge chip for USB; the AtomS3 family uses the ESP32-S3 with native USB.',
    'Atom Lite and Matrix drive their LEDs from G27, and their button is on G39, an input-only pin.',
    'Free pins may be shared with the motion sensor: on the Matrix G21 and G25, on an AtomS3 G38 and G39.'
  ],
  pitfalls: [
    'The Atom Matrix can run its LEDs at full brightness — M5Stack advises a FastLED brightness of about 20; at full power the LEDs and the acrylic can be damaged.',
    'Every Atom Matrix has the same motion sensor — The v1.1 uses a BMI270 instead of the MPU6886; code written for the older sensor needs a driver change.',
    'The six back pins of an AtomS3 are all free — G38 and G39 are the motion sensor\'s I2C bus; a second device there joins that bus.'
  ],
  terms: [
    { term: 'Atom', also: ['M5Atom', 'AtomS3'], def: 'M5Stack\'s 24 mm cube controller: a button, an LED, USB-C and a Grove port. The Atom is built on an ESP32, the AtomS3 on an ESP32-S3.' },
    { term: 'Addressable LED', also: ['SK6812', 'WS2812', 'NeoPixel'], def: 'An RGB LED with a small controller inside, set through one data wire that passes colour data from LED to LED. The Atom Lite has one on G27, the Matrix twenty-five.' },
    { term: 'Octal PSRAM', also: ['8-line PSRAM'], def: 'External RAM connected over eight data lines, faster than the quad (four-line) kind. The AtomS3R family has 8 MB of it inside the chip package.' },
    { term: 'Bridge chip', also: ['USB-to-serial bridge', 'CH9102'], def: 'A small chip that turns the computer\'s USB into the serial port the ESP32 reads. The ESP32 Atoms need one; the ESP32-S3 has USB built in.' }
  ],
  choose: {
    good: ['The cheapest ESP32 node with USB-C and a Grove port (Lite)', 'A tilt toy or orientation indicator with a 5 × 5 display (Matrix)', 'Native USB gadgets, a tiny screen or a tiny camera (AtomS3 family)', 'A voice or speaker node (Echo, Voice S3R)'],
    avoid: ['Projects that need more than about six free pins', 'The Matrix at full brightness', 'Battery projects: the Atom has no battery of its own'],
    check: ['Which Atom: the chip, the sensor and the screen driver differ between versions', 'What the free pins already carry (motion sensor, microphone clock)', 'That your M5GFX is current if the screen is new']
  },
  code: [
    {
      title: 'The button steps through the colours',
      about: 'The front button steps the Atom\'s LED through off, red, green and blue. The values are kept low on purpose: M5Stack advises a low brightness on the Matrix, and a single LED is bright enough at 24.',
      needs: 'An M5Stack Atom Lite (an ESP32; the same pins on the Matrix light only its first LED).',
      wiring: [['GPIO27', 'RGB LED (on the board)'], ['GPIO39', 'button (on the board)', 'input-only pin']],
      blocks: `
        when started
          set [shade v] to (0)
          set [wasDown v] to <false>
        forever
          if <<(read pin (39)) = [LOW v]> and <not <wasDown>>> then
            set [shade v] to (((shade) + (1)) mod (4))
            set pixel (0) on pin (27) to colour (shade) :: light
          end
          set [wasDown v] to <(read pin (39)) = [LOW v]>
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 27;     // Atom Lite: one SK6812 on G27
        const int BUTTON = 39;      // the front button (input-only pin)
        const uint8_t COLOURS[4][3] = { {0, 0, 0}, {24, 0, 0}, {0, 24, 0}, {0, 0, 24} };   // off, red, green, blue

        int shade = 0;
        bool wasDown = false;

        void setup() {
          pinMode(BUTTON, INPUT);                       // G39 has no internal pull resistor
        }

        void loop() {
          bool down = digitalRead(BUTTON) == LOW;       // pressed pulls the pin low
          if (down && !wasDown) {                       // a new press
            shade = (shade + 1) % 4;
            rgbLedWrite(LED_PIN, COLOURS[shade][0], COLOURS[shade][1], COLOURS[shade][2]);
          }
          wasDown = down;
          delay(10);                                    // a crude debounce
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 27        # Atom Lite: one SK6812 on G27
        BUTTON = 39         # the front button (input-only pin)
        COLOURS = [(0, 0, 0), (24, 0, 0), (0, 24, 0), (0, 0, 24)]   # off, red, green, blue

        led = NeoPixel(Pin(LED_PIN), 1)
        button = Pin(BUTTON, Pin.IN)                # G39 has no internal pull resistor

        shade = 0
        was_down = False

        while True:
            down = button.value() == 0              # pressed pulls the pin low
            if down and not was_down:               # a new press
                shade = (shade + 1) % 4
                led[0] = COLOURS[shade]
                led.write()
            was_down = down
            time.sleep_ms(10)                       # a crude debounce
      `,
      notes: ['The button is read as low when pressed. If nothing changes, print the pin once pressed and once released to check your unit.', 'The Matrix has 25 LEDs on the same pin: use a strip library (Adafruit NeoPixel, FastLED) and keep the brightness low.', 'Pins G27 and G39 come from the board catalogue; on an AtomS3 the pins are different (button G41).']
    }
  ],
  quiz: [
    { q: 'An Atom Matrix\'s header pins G21 and G25 are already the bus of its motion sensor. What follows if you add an I2C sensor there?', choices: ['Nothing: the header bus is separate from the sensor', 'The motion sensor switches off', 'The sensor needs a Grove cable', 'It joins the same bus, so its address must differ from the motion sensor\'s (0x68)'], a: 3, why: 'I2C is a shared bus. A second device on G21 and G25 sits next to the IMU, and two devices with one address cannot both answer.' },
    { q: 'Which Atoms have native USB?', choices: ['Lite and Matrix', 'The AtomS3 family on the ESP32-S3', 'Only the Echo', 'None of them'], a: 1, why: 'The Lite, Matrix and Echo use the original ESP32 with a USB bridge chip. The AtomS3 family uses the ESP32-S3, which has USB built in.' },
    { q: 'The Atom Matrix\'s 25 LEDs may be run at full brightness.', a: false, why: 'M5Stack advises a brightness around 20 (of 255) in FastLED: full brightness can damage the LEDs and the acrylic cover.' },
    { q: 'Which pin drives the RGB LED of an Atom Lite?', choices: ['G39', 'G27', 'G12', 'G26'], a: 1, why: 'G27 carries the SK6812 data line. G39 is the button, G12 the infrared transmitter and G26 one of the two Grove pins.' }
  ],
  applications: [
    'Tiny status lights and sensor nodes reporting over Wi-Fi, Bluetooth LE or ESP-NOW.',
    'Tilt toys and orientation indicators on the Matrix.',
    'Voice-command and speaker nodes on the Echo and the Voice S3R.',
    'Small cameras and USB gadgets on the AtomS3R-CAM and AtomS3U.'
  ],
  sources: [
    'M5Stack documentation: product pages of the Atom Lite, Matrix, Echo and the AtomS3 family, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*: input-only pins and USB.',
    'Arduino core for ESP32 documentation, *GPIO* API and the BlinkRGB example (rgbLedWrite), core 3.3.'
  ]
},

/* ================================================================ Stamp */
{
  id: 'm5-stamp-modules',
  parent: 'm5stack-family',
  title: 'Stamp: modules to solder down',
  level: 2,
  short: 'A Stamp is a part, not a product: a very small ESP board with solder pads along its edge, made for your own circuit board. M5Stack makes them for the ESP32, S3, C3, C5, C6 (with LoRa) and P4, and builds some of its own products on them.',
  keywords: ['Stamp', 'Stamp S3', 'Stamp S3A', 'Stamp C3', 'Stamp C3U', 'Stamp C5', 'Stamp C6LoRa', 'Stamp P4', 'Stamp Pico', 'S3Bat', 'castellated', 'module', 'M5PM1', 'breadboard', 'solder'],
  prereq: ['the-m5stack-idea', 'chip-module-board', 'what-a-module-adds'],
  related: ['m5-cardputer-and-specials', 'm5-tab5-and-p4', 'module-footprints-and-soldering', 'designing-with-the-bare-chip', 'living-with-few-pins', 'lora-boards'],
  body: `A Stamp is not a product but a part. It is a very small ESP board with solder pads, castellated half-holes, along its edge, made to be soldered flat onto your own circuit board or, in the breadboard variant, pushed into a breadboard. It is the step between a finished M5Stack and a design of your own: the chip, the flash, the radio part and the regulator are done; the rest of the board is yours. M5Stack also builds its own products on Stamps: the Cardputer carries a Stamp-S3 (later the S3A), and the StamPLC is built around an S3A.

### The Stamps in the catalogue

([All records](#/tools/boards?maker=M5Stack), with their pads.)

| Stamp | Chip | Memory | Pins | Notes |
|---|---|---|---|---|
| Pico | ESP32-PICO-D4 | 4 MB flash | 12 GPIOs | RGB LED G27, button G39; no USB connector: flash through serial |
| C3 | ESP32-C3 | 4 MB flash | 13 GPIOs | RGB LED G2, button G3; a CH9102 USB-serial chip |
| C3U | ESP32-C3 | 4 MB flash | 14 GPIOs | native USB; the button is on G9, a strapping pin |
| S3, S3A | ESP32-S3FN8 | 8 MB flash | 23 GPIOs | no PSRAM; the S3A has lower sleep current and a switched LED supply |
| S3Bat | ESP32-S3-PICO-1-N8R8 | 8 MB flash, 8 MB octal PSRAM | 11 pads, 19 on a board connector | battery charger through the M5PM1 power chip |
| C5 | ESP32-C5 | 4 MB flash | 11 pads plus a flat-cable connector | dual-band, charger of about 200 mA; toolchain support is newer |
| C6LoRa | ESP32-C6 and SX1262 | 16 MB flash | 16 GPIOs, 5 on an expander | LoRa 850 to 960 MHz, +22 dBm; antenna on an IPEX-4 connector |
| P4 | ESP32-P4 | 16 MB flash, 32 MB octal PSRAM | 44 GPIOs | MIPI DSI and CSI; no radio (see [[m5-tab5-and-p4]]) |

### What to read in the pad list

Pads are not all equal. Of the 23 GPIO pads of a Stamp S3, the pin database marks 13 as plain-safe (G1, G2, G4 to G14); the other ten carry a note: the strapping pins G0, G3 and G46, the console pair G43 and G44, the JTAG pins G39 to G42, and G15. The catalogue warns that G46 is pulled low by default on the S3 Stamps. A design that puts a relay or an LED on those pads meets [[strapping-pins]] on its first power-up.

### The small print

- **Switched LED supply:** on the S3A the RGB LED's supply has its own switch and must be enabled in software before the LED lights.
- **Radio rules:** the C6LoRa transmits at +22 dBm in a sub-GHz band: check your country's rules for band, power and duty cycle, and do not swap its antenna for another.
- **New chips:** the C5 is one of the first boards on that chip; check that your toolchain supports it.
- **No battery, no case:** a Stamp is bare. Power, protection and the case are your design.

> [!key] A Stamp is an ESP chip on a tiny solderable board: you get the radio, flash and regulator done and design everything else. Use it to turn a prototype into your own product; use a finished Core or Atom when you need the object itself.`,
  ideas: [
    'A Stamp is a castellated module: solder it to your own board, or use the breadboard variant.',
    'The family covers the ESP32, S3, C3, C5, C6 (with a LoRa radio) and P4, so the chip is chosen by the same logic as for any ESP32 project.',
    'M5Stack builds products on Stamps (the Cardputer, the StamPLC), so a project moved from a Cardputer to a Stamp keeps its chip.',
    'The pad list needs reading: some pads are strapping, console or JTAG pins that bite at power-up.'
  ],
  pitfalls: [
    'A Stamp is a small M5Stack with its own battery and case — It is a bare module with pads. The battery connector exists only on some, and the case, the power input and the protection are yours.',
    'All 23 pads of a Stamp S3 are free GPIOs — Ten of them carry a note: boot, JTAG-source and console pins among them. Check each before wiring a load.',
    'The C6LoRa can use any antenna — Swapping the antenna of a radio module can break its approval, and LoRa power and duty cycle are regulated by country.'
  ],
  terms: [
    { term: 'Castellated pad', also: ['castellation', 'half-hole'], def: 'A solder pad cut in half at the edge of a module so that it can be soldered flat onto another board from the side, with no connector.' },
    { term: 'Stamp', also: ['M5Stamp', 'Stamp module'], def: 'M5Stack\'s castellated ESP module family: a chip, flash, regulator and a few extras on a board of about a thumbnail\'s size.' },
    { term: 'Board-to-board connector', also: ['BTB'], def: 'A small flat connector joining two boards face to face. The Stamp S3Bat and Stamp P4 use one to bring out extra signals and to take add-on boards.' },
    { term: 'LoRa', also: ['SX1262'], def: 'A long-range, low-rate sub-GHz radio. The Stamp C6LoRa pairs an ESP32-C6 with an SX1262 LoRa transceiver.' }
  ],
  choose: {
    good: ['Turning a working prototype into your own small board without designing RF', 'Breadboard prototypes on a current ESP32-S3, C3, C5 or C6', 'Battery products where the S3Bat or C5 charger helps', 'A LoRa plus Wi-Fi node in 18 × 15 mm (C6LoRa)'],
    avoid: ['A finished object with screen and case: use a Core, an Atom or a Cardputer', 'Production in the thousands without a plan for approval and supply', 'Pads that carry boot-time functions, for loads that pull at reset'],
    check: ['The pad table for your Stamp, against the strapping pins of its chip', 'Whether the module carries USB, a charger or only a regulator', 'The radio rules and antenna for the C6LoRa']
  },
  code: [
    {
      title: 'A Stamp C3\'s first light: a slow breath',
      about: 'The RGB LED of a Stamp C3 rises and falls once every two seconds. It needs no button and no wiring, so it is the first test that a freshly soldered or plugged-in Stamp works. The colour is purple and kept dim.',
      needs: 'An M5Stamp C3 on its USB-serial board, or breadboard variant, and a USB cable.',
      wiring: [['GPIO2', 'RGB LED (on the Stamp)', 'a strapping pin on the C3: the board is designed for it']],
      blocks: `
        when started
          set [period v] to (2000)
        forever
          set [phase v] to ((milliseconds since start) mod (period))
          if <(phase) < ((period) / (2))> then
            set [level v] to (((phase) * (24)) / ((period) / (2)))     // rising
          else
            set [level v] to (((((period) - (phase))) * (24)) / ((period) / (2)))     // falling
          end
          set pixel (0) on pin (2) to colour (level) (0) ((level) / (2)) :: light
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;          // Stamp C3: the RGB LED (SK6812) on G2
        const int PERIOD_MS = 2000;     // one breath
        const int MAX_LEVEL = 24;       // keep it dim

        void setup() {}

        void loop() {
          uint32_t phase = millis() % PERIOD_MS;                      // 0 to 1999
          uint32_t half = (phase < PERIOD_MS / 2) ? phase : PERIOD_MS - phase;   // up, then down
          int level = half * MAX_LEVEL / (PERIOD_MS / 2);
          rgbLedWrite(LED_PIN, level, 0, level / 2);                  // purple
          delay(20);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 2             # Stamp C3: the RGB LED (SK6812) on G2
        PERIOD_MS = 2000        # one breath
        MAX_LEVEL = 24          # keep it dim

        led = NeoPixel(Pin(LED_PIN), 1)
        start = time.ticks_ms()

        while True:
            phase = time.ticks_diff(time.ticks_ms(), start) % PERIOD_MS     # 0 to 1999
            half = phase if phase < PERIOD_MS // 2 else PERIOD_MS - phase   # up, then down
            level = half * MAX_LEVEL // (PERIOD_MS // 2)
            led[0] = (level, 0, level // 2)                                 # purple
            led.write()
            time.sleep_ms(20)
      `,
      notes: ['On the ESP32-C3 GPIO2 is a strapping pin that must be high at reset: M5Stack has designed the Stamp for it, but remember it if you add hardware to that pad.', 'The Arduino code uses the Arduino-ESP32 core 3.x; select the ESP32C3 Dev Module and enable USB CDC on boot only on the C3U.']
    }
  ],
  quiz: [
    { q: 'What is the main difference between an M5Stack Atom and an M5Stack Stamp?', choices: ['The Stamp has no ESP chip', 'The Atom cannot be programmed in Arduino', 'The Atom is a finished product in a case; the Stamp is a bare module with solder pads for your own board', 'The Stamp is larger'], a: 2, why: 'A Stamp is a castellated module meant for soldering into a design of your own. An Atom is a complete object with a case, a button and a Grove port.' },
    { q: 'A Stamp S3\'s pad G46 has a relay board wired to it. The Stamp will not start with it connected. Why?', choices: ['The relay needs 5 V', 'G46 is the USB pin', 'The Stamp S3 has no GPIOs', 'G46 is a strapping pin, pulled low by default, and the relay board pulls it the other way at reset'], a: 3, why: 'G46 selects boot options as reset is released. The Stamp\'s own pull-down expects it low, and a load that pulls it high changes the answer: see strapping pins.' },
    { q: 'The Stamp C6LoRa may be fitted with any 868 MHz antenna without consequences.', a: false, why: 'Replacing the antenna of a certified radio module can void its approval, and LoRa power, band and duty cycle are regulated by country. Check your country\'s rules.' },
    { q: 'Which Stamp has no radio at all?', choices: ['Stamp C5', 'Stamp P4', 'Stamp S3A', 'Stamp C6LoRa'], a: 1, why: 'The ESP32-P4 has no Wi-Fi or Bluetooth; radio comes from a separate ESP32-C6 add-on board. The others all carry radios on their chips.' }
  ],
  applications: [
    'The Cardputer and the StamPLC, built around a Stamp-S3 or S3A.',
    'A first small product: a sensor board with a Stamp soldered on.',
    'Breadboard prototypes on the current chips (S3, C3, C5, C6).',
    'A LoRa node with Wi-Fi and Thread on one tiny board (C6LoRa).'
  ],
  sources: [
    'M5Stack documentation: the Stamp product pages (S3, S3A, S3Bat, C3, C3U, C5, C6LoRa, P4, Pico), as read for the board catalogue on 2026-10-04.',
    'Espressif, datasheets of the ESP32-S3, ESP32-C3, ESP32-C5, ESP32-C6 and ESP32-P4: strapping pins and GPIO tables.',
    'Semtech, *SX1261/2 Datasheet* (the LoRa transceiver of the C6LoRa).'
  ]
},

/* ================================================================ Cardputer and the specials */
{
  id: 'm5-cardputer-and-specials',
  parent: 'm5stack-family',
  title: 'Cardputer, Dial, Paper and Tough',
  level: 2,
  short: 'The products built for a job: a pocket keyboard computer, knob controllers for a wall or a DIN rail, e-paper that keeps its picture, and industrial panels with RS485 and a wide supply input.',
  keywords: ['Cardputer', 'Cardputer-Adv', 'Dial', 'DinMeter', 'Paper', 'PaperS3', 'PaperMono', 'CoreInk', 'Tough', 'StamPLC', 'Station', 'AirQ', 'Capsule', 'StopWatch', 'e-paper', 'rotary encoder', 'RS485', 'PLC'],
  prereq: ['the-m5stack-idea', 'm5-core-controllers', 'm5-stamp-modules'],
  related: ['m5-tab5-and-p4', 'e-paper-boards', 'rotary-encoders', 'keypads-and-matrices', 'rs-485', 'relay-and-industrial-boards', 'wearables-and-handhelds'],
  body: `Beyond the Core, Stick and Atom, M5Stack makes products that start from a job. All are in [the catalogue](#/tools/boards?maker=M5Stack) with the chip, the screen and the pins that matter.

### Cardputer: a pocket keyboard computer

A 56-key keyboard under a 1.14″ 240 × 135 screen, an ESP32-S3 on a Stamp-S3 (v1.0, now superseded) or Stamp-S3A (v1.1), a microphone, a speaker, an infrared transmitter, a microSD slot and a Grove port. The **Cardputer-Adv** has a 1750 mAh cell, an IMU, an audio codec and a 14-pin extension header, and scans its keys through an I2C key controller instead of the 74HC138 matrix of v1.0 and v1.1, so key-scanning code differs. Mind the notes: the speaker and the microphone share G43 on v1.x; the headphone jack of the Adv mutes the speaker; its side power switch must be on for charging.

### Dial and DinMeter: a knob and a screen

The **Dial** has a 1.28″ round 240 × 240 screen with touch, a 16-detent rotary encoder (64 pulses per turn), an RFID reader, a clock, a buzzer and a 6 to 36 V terminal on the back. The **DinMeter** puts a 1.14″ screen and an encoder in a 1/32 DIN-rail housing with the same 6 to 36 V input and a socket for a battery (no cell included). On the Dial the touch controller, clock and RFID reader share one I2C bus.

### Paper and the e-paper family

E-paper keeps its picture with no power and refreshes slowly. **PaperS3** has a 4.7″ 960 × 540 screen with 16 grey levels, touch and an 1800 mAh cell; **Paper v1.1** is the older ESP32 version; **PaperMono** has a 3.97″ screen with 4 grey levels, a front light, NFC and LoRa (868 to 923 MHz: check your country's rules); **PaperColor** a 4″ colour panel without touch. **CoreInk** (1.54″, black and white) and **AirQ** (an air-quality monitor with a 1.54″ screen) are smaller. On CoreInk the power is latched by GPIO12, which the firmware must set. Design for infrequent updates.

### Tough, StamPLC and the stations

The **Tough** is a Core2-class touch controller in a UV-resistant case with RS485 and a 6 to 24 V input. The **StamPLC** is a DIN-rail controller with eight isolated 5 to 36 V inputs, four 5 A relays, CAN and RS485. The **Station-485** and **Station-Bat** are Grove hubs with six ports, RS485 or two 18650 cells. **Capsule** and **StopWatch** are pocket and wrist forms; **StopWatch** has a 1.75″ round AMOLED.

> [!warn] The StamPLC relays are rated for 250 V AC, but mains wiring is work for a qualified person, inside an enclosure, following your local wiring code. A bare module on a desk is not a product, and reflashing a mains device means opening it, never while it is plugged in.

> [!key] These products solve a job — typing, turning a knob, holding a picture without power, running on an industrial supply. Choose by that job, then check the screen, the battery and which pins are shared; the chooser below filters the whole catalogue by what you need.`,
  ideas: [
    'The Cardputer is a keyboard computer on an ESP32-S3; v1.x scans a key matrix, the Adv uses an I2C key controller, so key code differs.',
    'The Dial and DinMeter add a rotary encoder and a 6 to 36 V input for walls and DIN rails.',
    'E-paper (Paper, CoreInk, AirQ) keeps its picture with no power but refreshes slowly: design for rare updates.',
    'Industrial members (Tough, StamPLC, Stations) offer RS485, CAN, isolated inputs or relays; mains work needs a qualified person.'
  ],
  pitfalls: [
    'Every Cardputer reads its keyboard the same way — v1.0 and v1.1 scan a matrix through a 74HC138; the Adv uses a TCA8418 over I2C. A key-scanning program for one does not run on the other.',
    'E-paper can show a live graph — A full refresh takes a second or so and partial refreshes leave ghosts; update it in seconds or minutes, not at 30 frames a second.',
    'The StamPLC is a mains controller by design — Its relays are rated for 250 V AC, but wiring them to the mains is for a qualified person, behind isolation and in an enclosure.'
  ],
  terms: [
    { term: 'Rotary encoder', also: ['encoder', 'knob'], def: 'A knob that sends a train of pulses as it turns. The Dial\'s gives 64 pulses per revolution in 16 detents, and has a push button.' },
    { term: 'E-paper', also: ['e-ink', 'EPD'], def: 'A reflective display that holds its picture with no power and uses energy only when it changes. Refresh takes a fraction of a second to a few seconds.' },
    { term: 'DIN rail', also: ['DIN-rail housing', '1/32 DIN'], def: 'A standard metal rail in electrical cabinets onto which controllers clip. The DinMeter and StamPLC have DIN-rail housings.' },
    { term: 'RS485', also: ['RS-485'], def: 'A differential serial bus for long cables and noisy places, common in industrial equipment. Tough, StamPLC and the Station-485 have it.' }
  ],
  choose: {
    good: ['A wall or panel controller with a knob and screen (Dial, DinMeter)', 'A pocket keyboard terminal (Cardputer)', 'A low-power display with weeks on a charge (Paper, CoreInk, AirQ)', 'An industrial HMI or PLC-style unit (Tough, StamPLC)'],
    avoid: ['Fast graphics on e-paper', 'Bare mains wiring without a qualified person and an enclosure', 'Assuming that keyboard code carries over between Cardputer versions'],
    check: ['The revision (Dial v1.1, Cardputer v1.0 against v1.1 against Adv)', 'The supply range: 6 to 36 V on the Dial and DinMeter, 6 to 24 V on the Tough', 'Radio rules for the LoRa variants']
  },
  quiz: [
    { q: 'A key-scanning program written for the Cardputer v1.1 finds no keys on the Cardputer-Adv. Why?', choices: ['The Adv has no keyboard', 'The Adv uses a different chip family', 'The Adv scans keys through an I2C key controller, not the 74HC138 matrix', 'The keys are only active in UIFlow'], a: 2, why: 'v1.0 and v1.1 scan a 4 × 14 matrix through a 74HC138; the Adv uses a TCA8418 over I2C, so the pins and the protocol differ.' },
    { q: 'Why is a 30 frames a second animation a poor fit for a PaperS3?', choices: ['It has too few pixels', 'It has no touch', 'The ESP32-S3 is too slow', 'E-paper refreshes in a fraction of a second to seconds and ghosts on partial updates'], a: 3, why: 'E-paper is a slow display by design. It shines where the picture changes rarely and must survive with no power.' },
    { q: 'The StamPLC\'s relay outputs may be connected to the mains by anyone who reads the rating.', a: false, why: 'The rating says the contacts can switch it. Mains wiring is work for a qualified person, behind isolation and in an enclosure, to the local code.' },
    { q: 'Which supply range does the M5Dial\'s rear terminal accept, according to the catalogue?', choices: ['3.3 V only', '6 to 36 V', '110 to 230 V AC', '5 V USB only'], a: 1, why: 'The Dial and DinMeter take 6 to 36 V DC on the terminal, which suits in-wall and DIN-rail installations. Never connect mains to them.' }
  ],
  applications: [
    'Pocket terminals and tools on the Cardputer: terminal, scripts, infrared remote.',
    'In-wall smart-home dials and panel knobs (Dial, DinMeter).',
    'E-paper dashboards, badges and air-quality monitors that run for weeks.',
    'Industrial HMIs and small PLCs over RS485 and CAN (Tough, StamPLC).'
  ],
  sources: [
    'M5Stack documentation: product pages of the Cardputer, Cardputer-Adv, Dial, DinMeter, PaperS3, PaperMono, CoreInk, Tough, StamPLC and Station, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32-S3 Series Datasheet* and *ESP32 Series Datasheet*.',
    'TIA/EIA-485-A, the standard of the RS485 interface.'
  ],
  sim: 'm5-chooser'
},

/* ================================================================ Tab5 and the P4 */
{
  id: 'm5-tab5-and-p4',
  parent: 'm5stack-family',
  title: 'Tab5 and the ESP32-P4 boards',
  level: 2,
  short: 'The Tab5 is a 5″ 1280 × 720 touch panel on the ESP32-P4, a processor for screens and cameras with no radio of its own. Its Wi-Fi and Bluetooth come from a second chip, an ESP32-C6, on the same board.',
  keywords: ['Tab5', 'ESP32-P4', 'Stamp P4', 'Unit PoE-P4', 'ESP32-C6', 'ESP-Hosted', 'MIPI-DSI', 'MIPI-CSI', 'radio co-processor', 'PoE', 'NP-F550', 'RS485', '1280x720', 'ST7123', 'ST7121'],
  prereq: ['m5-core-controllers', 'soc-esp32-p4', 'm5-stamp-modules'],
  related: ['esp-at-and-esp-hosted', 'esp-as-a-co-processor', 'esp32-p4-function-ev-board', 'lvgl', 'ethernet-and-poe-boards', 'ai-accelerators-s3-and-p4'],
  body: `The [Tab5](#/tools/boards?b=m5stack-tab5) is M5Stack's first controller around the [[soc-esp32-p4|ESP32-P4]]: a 5″ 1280 × 720 touch panel with a camera, an audio codec, a 2000 mAh battery and room for a second, removable one. It differs from the other products in one way that matters to the programmer: the P4 is a processor built for screens and cameras and it has **no radio of its own**.

### Two chips on one board

The main chip is an ESP32-P4NRW32, with 16 MB of flash and 32 MB of octal PSRAM, and the interfaces for a MIPI-DSI display and a MIPI-CSI camera. Wi-Fi and Bluetooth LE come from a separate **ESP32-C6-MINI-1U** module on the same board. Your program runs on the P4 and reaches the radio through a link to the C6, a method the Arduino core calls ESP-Hosted ([[esp-at-and-esp-hosted]]). The simulation draws all three P4 products.

### What the Tab5 holds

| Part | Detail from the catalogue |
|---|---|
| Screen | 5″ IPS, 1280 × 720, MIPI-DSI; the touch controller is integrated with the display driver |
| Camera | SC2356, 2 MP, MIPI-CSI |
| Audio | ES8388 codec, ES7210 echo-cancelling front end, two microphones, a 1 W speaker, a 3.5 mm headphone jack |
| Sensors | BMI270 motion sensor, RX8130CE clock, INA226 power monitor |
| Power | 2000 mAh inside plus a removable NP-F550 pack (7.4 V); charger IP2326 |
| Connections | RS485, microSD, a Grove port, the M-Bus, a GPIO header, Stamp pads for a cellular or LoRaWAN module, USB Type-C (OTG) and a Type-A host port |

Released on 2025-05-09, its screen driver has changed twice: from ILI9881C with a GT911 touch chip to ST7123 on 2025-10-14, then to ST7121 on 2026-04-28. Units bought at different times can differ, so keep the firmware and the library current.

### The other two P4 products

- **[Stamp P4](#/tools/boards?b=m5stack-stamp-p4):** a bare module with 44 GPIOs, MIPI DSI and CSI and SDIO on a board-to-board connector. It has no Wi-Fi or Bluetooth: pair it with the **Stamp-AddOn C6**, a separate board carrying an ESP32-C6.
- **[Unit PoE-P4](#/tools/boards?b=m5stack-unit-poe-p4):** wired, with a 10/100 Ethernet port that also powers the unit (IEEE 802.3at, 6 W), MIPI DSI up to 1920 × 1080, a MIPI CSI camera connector and an IR transmitter. It has no radio.

### What it asks of you

A full 1280 × 720 frame at 16 bits per pixel is 1.8 MB, which is why these products have 32 MB of PSRAM, and why a graphics library ([[lvgl]]) and partial updates still matter. Tools for the P4 are newer than those for the S3: check the Arduino core and MicroPython support for your chip revision. The catalogue gives the P4 clock as 400 MHz in the chip record but 360 MHz in the Stamp P4's: check the datasheet for your revision.

> [!key] The P4 products are screen-and-camera processors with no radio of their own: the Tab5 gets Wi-Fi and Bluetooth LE from an ESP32-C6 beside it, the Stamp P4 needs an add-on, and the Unit PoE-P4 uses Ethernet. Plan for the second chip, and for a screen controller that has changed between batches.`,
  ideas: [
    'The ESP32-P4 has no Wi-Fi and no Bluetooth; the Tab5 adds them with a separate ESP32-C6 module on the board.',
    'The Tab5 carries a 5″ 1280 × 720 touch screen, a 2 MP camera, an audio codec, RS485, a 2000 mAh cell and a removable NP-F550 pack.',
    'The Stamp P4 is a bare module that needs the Stamp-AddOn C6 for radio; the Unit PoE-P4 is wired with Ethernet and power over Ethernet.',
    'The Tab5\'s display and touch controller have changed twice since release, so firmware and libraries must be current.'
  ],
  pitfalls: [
    'The ESP32-P4 has Wi-Fi like any other ESP32 — It has none. The Tab5 has Wi-Fi only because a separate ESP32-C6 sits beside it, reached over a link.',
    'A Tab5 bought last year behaves like one bought today — The screen driver changed on 2025-10-14 and on 2026-04-28; old firmware and old libraries may not drive the new panel.',
    'More PSRAM makes graphics free — A 1280 × 720 frame at 16 bits is 1.8 MB; copying whole frames is still slow, so update only what changed.'
  ],
  terms: [
    { term: 'Radio co-processor', also: ['wireless co-processor', 'ESP-Hosted'], def: 'A separate chip that provides the Wi-Fi and Bluetooth for a processor that has none. The program on the main chip reaches it over a fast link such as SDIO or SPI.' },
    { term: 'MIPI-DSI', also: ['DSI'], def: 'A high-speed serial interface from the mobile-phone world that drives a display with a few differential lanes. Among ESP chips only the ESP32-P4 has it.' },
    { term: 'MIPI-CSI', also: ['CSI'], def: 'The camera counterpart of DSI: a few differential lanes bring the image from a camera sensor into the processor.' },
    { term: 'PoE', also: ['power over Ethernet', 'IEEE 802.3at'], def: 'Power delivered to a device over the same Ethernet cable that carries its data. The Unit PoE-P4 takes up to 6 W this way.' }
  ],
  choose: {
    good: ['A 5″ 720p touch panel or control panel with a camera and microphones (Tab5)', 'On-device vision or voice that needs a lot of memory (32 MB PSRAM)', 'An RS485 gateway with a screen', 'A wired camera or display node powered over the network cable (Unit PoE-P4)'],
    avoid: ['Cheap, small, low-power nodes: the P4 products are big and hungry', 'Assuming that Wi-Fi works in your toolchain without the second chip set up', 'Software that must use a mature, fully supported toolchain: P4 support is newer'],
    check: ['Which display revision you hold, and the firmware that matches it', 'How the Wi-Fi link to the C6 is configured in your toolchain', 'That a Stamp P4 has its Stamp-AddOn C6 if you need wireless']
  },
  quiz: [
    { q: 'The Tab5 joins Wi-Fi although the ESP32-P4 has no Wi-Fi. How?', choices: ['The P4 has a hidden radio that M5Stack enabled', 'Through the USB cable', 'A separate ESP32-C6 module on the board provides Wi-Fi and Bluetooth LE', 'It cannot join Wi-Fi'], a: 2, why: 'The Tab5 carries an ESP32-C6-MINI-1U beside the P4. The P4 program reaches the radio through a link to the C6.' },
    { q: 'Which statement about the Unit PoE-P4 is right?', choices: ['It joins Wi-Fi through an on-board ESP32-C6', 'It is a wired node: Ethernet with power over the same cable, and no radio on the board', 'It has an LTE modem', 'It does not contain an ESP32-P4'], a: 1, why: 'The Unit PoE-P4 pairs the P4 with a 10/100 Ethernet port and IEEE 802.3at power (6 W); the catalogue notes that the P4 gives it no Wi-Fi or Bluetooth.' },
    { q: 'The Tab5\'s Wi-Fi hardware is not part of its ESP32-P4, and its screen controller has been changed twice since release.', a: true, why: 'The radio is a separate ESP32-C6 module. The catalogue records the display change from ILI9881C with GT911 to ST7123 (2025-10-14) and then to ST7121 (2026-04-28).' },
    { q: 'About how much memory does one 1280 × 720 frame at 16 bits per pixel need?', choices: ['180 KB', '18 MB', '460 KB', '1.8 MB'], a: 3, why: '1280 × 720 × 2 bytes = 1 843 200 bytes, about 1.8 MB.' }
  ],
  applications: [
    'A 5″ control panel with RS485 for a workshop or a small installation.',
    'On-device vision and voice assistants with a camera and two microphones.',
    'A PoE-powered camera or display node on a wired network.',
    'A prototype board for P4 designs: the Stamp P4 with its add-on.'
  ],
  sources: [
    'M5Stack documentation: product pages of the Tab5, Stamp P4, Stamp-AddOn C6 and Unit PoE-P4, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32-P4 Series Datasheet*: no radio, MIPI-DSI and MIPI-CSI, up to 32 MB PSRAM in the package.',
    'Espressif, ESP-Hosted documentation: running Wi-Fi and Bluetooth on a host that has none.'
  ],
  sim: 'm5-p4-blocks'
},

/* ================================================================ Units and Grove ports */
{
  id: 'm5-units-and-grove-ports',
  parent: 'm5stack-family',
  title: 'Units and the red, black and blue ports',
  level: 1,
  short: 'Almost every M5Stack carries the same four-wire Grove-style socket: ground, 5 V and two signal wires. M5Stack colours the port by use: red for I2C, black for plain GPIO and analogue, blue for a serial UART.',
  keywords: ['Unit', 'Grove', 'HY2.0-4P', 'Port A', 'Port B', 'Port C', 'red port', 'black port', 'blue port', 'I2C', 'UART', 'HY2.0', '5 V', 'level shifting', 'I2C scan'],
  prereq: ['the-m5stack-idea', 'i2c', 'three-volt-logic'],
  related: ['m5-core-controllers', 'm5-bus-and-modules', 'grove-system', 'i2c-addresses-and-scanning', 'level-shifters', 'planning-pins', 'electronics:voltage-divider'],
  body: `Every M5Stack controller wants to be extended without a soldering iron, so most carry the same small socket, an HY2.0-4P: the Grove-compatible connector with four wires, **ground, 5 V and two signal wires**. Push a **Unit**, a sensor, a relay, a keypad or a light, into it with the matching cable and it works. (The Grove idea itself is on its own page, [[grove-system]].)

### Red, black and blue

M5Stack colours the sockets by what the two signal wires do:

| Port | Colour | The two wires | For |
|---|---|---|---|
| A | red | I2C: SDA and SCL | sensors and displays on an I2C bus |
| B | black | two plain GPIOs, analogue where the pins allow | buttons, relays, analogue sensors |
| C | blue | UART: TX and RX | serial modules such as GPS receivers |

Not every controller has all three. A Core has three, an Atom or a Stick one, and the Station-Bat six. The pins come from the catalogue (G21 means GPIO21):

| Controller | Port A | Port B | Port C |
|---|---|---|---|
| [Core Basic](#/tools/boards?b=m5stack-core-basic-v2-7) | G21, G22 | G26, G36 | G17, G16 |
| [Core2](#/tools/boards?b=m5stack-core2) | G32, G33 | G26, G36 | G13, G14 |
| [CoreS3](#/tools/boards?b=m5stack-cores3) | G2, G1 | G9, G8 | G17, G18 |
| [Dial](#/tools/boards?b=m5stack-dial), DinMeter | G13, G15 | G2, G1 | none |
| AtomS3 | G2, G1 (its only port) | | |
| Atom Lite | G26, G32 (its only port) | | |

### The pins decide what a port can do

The colour is a convention; the pins are what they are. On the Core's black port G36 is an **input-only** ESP32 pin (no output driver, no internal pull): it can read a button, an analogue sensor or a UART receive line, but it cannot be an I2C clock or drive a servo. G26 is a DAC pin on ADC2, which Wi-Fi disturbs. The Core2's red port (G32, G33) is on ADC1 and works for analogue too. The simulation below checks a unit type against a controller's three ports from the pin database.

### 5 V on the connector

The red wire carries **5 V** to power the unit, but the signal wires are **3.3 V** logic, the ESP's own level. A unit that drives 5 V on a wire into the controller can damage the pin ([[three-volt-logic]]). For a one-way signal a resistor divider suffices; I2C needs a proper level shifter. On the StickS3 the external 5 V is switched off until the program enables it.

### The scan that finds a unit

Plug a unit into Port A and scan the bus: the program below lists every address that answers. A Core Basic may also answer at 0x75 itself, which the catalogue lists as its power chip; on a Core2 the inside bus (G21, G22) is separate from Port A (G32, G33).

> [!key] The red, black and blue ports are I2C, GPIO and UART on a four-wire Grove-style socket with 5 V power and 3.3 V signals. Read the pins, not the colour: input-only pins cannot clock a bus, and 5 V signals need a divider or a level shifter.`,
  ideas: [
    'The HY2.0-4P socket carries ground, 5 V and two signal wires; M5Stack colours it red (I2C), black (GPIO and analogue) or blue (UART).',
    'The pins behind each colour differ from controller to controller; the catalogue lists them.',
    'An input-only pin such as G36 can read a signal but cannot drive a clock or a data line.',
    'The connector supplies 5 V but its signals are 3.3 V: a 5 V signal into the ESP needs a divider or a level shifter.'
  ],
  pitfalls: [
    'Port A is the same pair of pins on every M5Stack — It is G21 and G22 on a Core Basic, G32 and G33 on a Core2, G2 and G1 on a CoreS3. Programs must take the pins from the board.',
    'The signal wires are 5 V because the connector is 5 V — Only the supply is 5 V. The signal wires are at the controller\'s 3.3 V, and a unit that drives 5 V on one is a hazard to the pin.',
    'Any port can be used for anything, so Port B can host an I2C unit — Not on a Core: G36 is input-only and cannot drive the I2C lines.'
  ],
  terms: [
    { term: 'Grove', also: ['HY2.0-4P', 'Grove-compatible'], def: 'A four-wire plug-in connector system: ground, supply and two signal wires, with a 2 mm pitch connector. M5Stack\'s HY2.0-4P port is Grove-compatible.' },
    { term: 'Unit', also: ['M5 Unit'], def: 'M5Stack\'s name for a module that plugs into a Grove port: a sensor, relay, keypad, light or small controller.' },
    { term: 'Port A, B, C', also: ['red port', 'black port', 'blue port'], def: 'M5Stack\'s colour convention for the Grove-style ports of a Core: A (red) is I2C, B (black) is GPIO or analogue, C (blue) is a UART.' },
    { term: 'Input-only pin', also: ['GPIO34-39'], def: 'A pin of the original ESP32 (GPIO34 to 39) that can read but not drive a signal, and has no internal pull-up or pull-down. G36 on a Core\'s Port B is one.' }
  ],
  choose: {
    good: ['I2C units on Port A (red) of any controller', 'Buttons, relays and analogue sensors on Port B (black)', 'Serial units such as GPS receivers on Port C (blue)', 'Adding sensors in seconds, with no wiring mistakes'],
    avoid: ['Putting I2C on a port that has an input-only pin', 'Driving a 3.3 V pin from a unit that outputs 5 V', 'Analogue readings on ADC2 pins while Wi-Fi is on'],
    check: ['The pins of the port on your controller, from its pin table', 'The unit\'s signal level (3.3 V or 5 V)', 'The address of the unit against the others on the bus']
  },
  formulas: [
    {
      name: 'Divider for a 5 V signal into a 3.3 V pin',
      expr: 'Vout = Vin*R2/(R1 + R2)',
      tex: 'V_{\\text{out}} = V_{\\text{in}}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vout: { name: 'voltage at the ESP32 pin', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'unit\'s signal voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{in}}' },
        R1: { name: 'series resistor from the unit', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' },
        R2: { name: 'resistor to ground', q: 'resistance', unit: 'kΩ', value: 2, tex: 'R_2' }
      },
      note: 'Only for a one-way signal from the unit into the controller, such as a unit\'s TX into the controller\'s RX. A bus such as I2C, where either side drives the wire, needs a level shifter.',
      stories: { Vout: 'A unit drives {Vin} on its serial TX wire. A divider of {R1} in series and {R2} to ground feeds the ESP32 receive pin. What voltage reaches it?' },
      practice: { unknowns: ['Vout', 'R1'] }
    }
  ],
  examples: [
    {
      title: 'A 5 V serial unit on Port C',
      q: 'A serial unit drives its TX wire between 0 and 5 V. It is plugged into a Core\'s blue Port C, whose receive pin is a 3.3 V ESP32 input. Design a divider from 1 kΩ and 2 kΩ resistors and check what it draws.',
      steps: ['Put the 1 kΩ in series with the unit\'s TX wire and the 2 kΩ from the receive pin to ground.', 'Divider: $V_{out} = 5 \\times 2 / (1 + 2) = 3.33$ V at the pin, a safe high level for a 3.3 V input.', 'Current while the line is high: $5 / 3000 \\approx 1.7$ mA: negligible for a signal.', 'The divider works only one way. The controller\'s own TX wire to the unit needs no divider, because 3.3 V is a valid high for most 5 V inputs; check the unit.'],
      a: '3.33 V at the receive pin and 1.7 mA in the divider. Use it for a unit\'s TX into the controller; never for I2C.'
    }
  ],
  code: [
    {
      title: 'Scan Port A for units',
      about: 'Starts the I2C bus on the red Port A and prints the address of every unit that answers. Use it first whenever a new unit does nothing.',
      needs: 'An M5Stack Core Basic v2.7 and an I2C unit on its red port. On a Core2 use SDA G32, SCL G33; on a CoreS3 SDA G2, SCL G1.',
      wiring: [['G21', 'Port A, SDA (Core Basic)'], ['G22', 'Port A, SCL (Core Basic)']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          set [address v] to (1)
          set [found v] to (0)
          repeat until <(address) > (126)>
            if <(I2C device (address) answers)> then
              print (join [found 0x] (hex (address)))
              change [found v] by (1)
            end
            change [address v] by (1)
          end
          print (join (found) [ device(s) on Port A])
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21;     // Core Basic: Port A (red) is G21 and G22
        const int SCL_PIN = 22;

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);
          int found = 0;
          for (uint8_t address = 1; address < 127; address++) {
            Wire.beginTransmission(address);
            if (Wire.endTransmission() == 0) {          // 0 means someone answered
              Serial.printf("found 0x%02X\n", address);
              found++;
            }
          }
          Serial.printf("%d device(s) on Port A\n", found);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        SDA_PIN = 21     # Core Basic: Port A (red) is G21 and G22
        SCL_PIN = 22

        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=100000)
        found = i2c.scan()                       # the addresses that answered
        for address in found:
            print("found 0x%02X" % address)
        print(len(found), "device(s) on Port A")
      `,
      output: `
        found 0x44
        1 device(s) on Port A
      `,
      notes: ['The address in the sample is that of a temperature-and-humidity unit; yours depends on the unit. A list of common addresses is in [[i2c-addresses-and-scanning]].', 'On a Core Basic you may also see 0x75: the catalogue lists its IP5306 power chip there.', 'If nothing is found: check the cable, the unit\'s own page for its address, and that the I2C pull-up resistors are present (units usually carry them).']
    }
  ],
  quiz: [
    { q: 'Which colour of M5Stack port carries I2C?', choices: ['Red (Port A)', 'Black (Port B)', 'Blue (Port C)', 'They all do'], a: 0, why: 'Port A, red, is the I2C port. Port B (black) is two plain GPIO or analogue wires, and Port C (blue) is a UART.' },
    { q: 'On a Core\'s Port B (G26 and G36), why can an I2C unit not be driven by software?', choices: ['I2C needs 5 V pins', 'G36 is input-only on the ESP32, so it cannot drive the clock or data line', 'Port B is reserved for UIFlow', 'The ESP32 cannot do I2C on G26'], a: 1, why: 'GPIO34 to 39 on the original ESP32 can only read. Both I2C lines must be driven low by the master, so G36 cannot be one of them.' },
    { q: 'The signal wires on a Grove-style port can safely take a 5 V logic output from a unit.', a: false, why: 'The connector supplies 5 V as power, but the ESP32 pins are 3.3 V devices. A 5 V output into them can damage the pin; use a divider (one-way) or a level shifter (a bus).' },
    { q: 'A unit outputs 5 V on its TX line. With 1 kΩ in series and 2 kΩ to ground, what reaches the ESP32 receive pin?', choices: ['1.67 V', '2.5 V', '3.33 V', '5 V'], a: 2, why: '5 V × 2 kΩ / (1 kΩ + 2 kΩ) = 3.33 V, a safe 3.3 V level.' }
  ],
  applications: [
    'Adding an environmental, distance or colour sensor to a Core in seconds.',
    'Reading buttons, relays and analogue sensors on Port B.',
    'Connecting a GPS receiver or other serial module on Port C.',
    'A teaching setup where pupils change sensors without wiring them.'
  ],
  sources: [
    'M5Stack documentation: the Core, Core2, CoreS3, Dial and AtomS3 product pages (Ports A, B and C and their pins), as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32 Series Datasheet*: GPIO34 to 39 are input-only; ADC1 and ADC2 channels.',
    'NXP, *I2C-bus specification and user manual* (UM10204).'
  ],
  sim: 'm5-grove-ports'
},

/* ================================================================ M-Bus */
{
  id: 'm5-bus-and-modules',
  parent: 'm5stack-family',
  title: 'M-Bus, modules and bases',
  level: 2,
  short: 'The 30-pin M-Bus under a Core carries power, SPI, I2C, serial, DAC and GPIO pins to stacked modules and bases. The pins are the Core\'s own, so what the Core already uses on them decides what a module can do.',
  keywords: ['M-Bus', 'module', 'base', 'stacking', 'bottom', 'DinBase', 'M5GO Bottom', 'HPWR', 'HVIN', '30-pin', 'pin conflict', 'shared SPI', 'Core2', 'Fire', 'Tough'],
  prereq: ['m5-core-controllers', 'm5-units-and-grove-ports', 'spi'],
  related: ['planning-pins', 'pins-at-boot', 'input-only-and-special-pins', 'spi-modes-and-speed', 'i2c-addresses-and-scanning', 'm5-tab5-and-p4'],
  body: `Under every Core, and on a few other M5Stack products such as the Tab5, sits a **30-pin bus**, the M-Bus. It is how modules plug into a Core: the module's connector meets the Core's, the pins line up, and the module reaches power, SPI, I2C, serial, DAC and GPIO signals with no wire.

### The 30 pins

[The catalogue](#/tools/boards?maker=M5Stack) draws the pins as two columns of fifteen; row *n* holds pins 2n − 1 and 2n.

| Row | Core Basic | Core2 | CoreS3 |
|---|---|---|---|
| 1 | GND / 35 | GND / 35 | GND / 10 |
| 2 | GND / 36 | GND / 36 | GND / 8 |
| 3 | GND / RST | GND / RST | GND / RST |
| 4 | MOSI 23 / DAC 25 | MOSI 23 / DAC 25 | MOSI 37 / 5 |
| 5 | MISO 19 / DAC 26 | MISO 38 / DAC 26 | MISO 35 / 9 |
| 6 | SCK 18 / 3V3 | SCK 18 / 3V3 | SCK 36 / 3V3 |
| 7 | 3 / 1 | 3 / 1 | 44 / 43 |
| 8 | 16 / 17 | 13 / 14 | 18 / 17 |
| 9 | 21 / 22 | 21 / 22 | 12 / 11 |
| 10 | 2 / 5 | 32 / 33 | 2 / 1 |
| 11 | 12 / 13 | 27 / 19 | 6 / 7 |
| 12 | 15 / 0 | 2 / 0 | 13 / 0 |
| 13 | HPWR / 34 | NC / 34 | HVIN / 14 |
| 14 | HPWR / 5V | NC / 5V | HVIN / 5V |
| 15 | HPWR / BAT | NC / BAT | HVIN / BAT |

Common to the three: **ground** on three pins, **5 V**, **3.3 V**, the **battery** and **reset**; the **SPI** trio (rows 4 to 6); the console serial pair (row 7); the **I2C** pair (row 9); and two analogue inputs (rows 1 and 2, right). The ESP32 Cores add two DAC pins (rows 4 and 5, right). What differs is the rest: a module made for one generation may find a different signal on a pin of the next, and the three bottom-left pins are HPWR on the Basic, unconnected on the Core2 and HVIN on the CoreS3.

### Modules and bases

A **module** adds a function; a **base** adds power or mounting. The catalogue names a DinBase for the CoreS3 (a 9 to 24 V input), the M5GO-Bottom base of the Core2 for AWS (battery, ten LEDs and two ports) and the thick battery base of the Fire (28.6 mm). Two cautions from the catalogue: on a Core2 v1.3 the battery bottom must be removed to stack modules, and its vibration motor clashes mechanically with the Base-series bases.

### Pin conflicts

The M-Bus pins are the Core's own pins brought out, not extra ones. So a module competes with whatever the Core already does on them:

- **Core Basic:** the speaker is on G25, also M-Bus pin 8; the microSD slot shares G18, G23 and G19 with the screen.
- **Core2:** the speaker and microphone use G0, G2 and G12; the SPI pins belong to the screen and microSD slot.
- **Fire:** G16 and G17 reach its PSRAM, and Port C uses them too.
- **Tough:** its RS485 interface uses G27 and G19, which are M-Bus pins.

Before stacking, list what each module claims and what the Core claims; the simulation below shows, for four Cores, who already uses each pin.

> [!key] The M-Bus is the Core's own pins on a 30-pin connector, shared with its screen, card and audio. Stacking works when each module has its own chip-select and its own pins; it fails when two things drive one wire, so read the Core's pin table first.`,
  ideas: [
    'The M-Bus carries power, ground, reset, SPI, I2C, console serial, DAC and GPIO pins to stacked modules and bases.',
    'Its pins are the Core\'s own, shared with the screen, microSD slot, speaker and microphone.',
    'The three Core generations differ in which GPIO sits on several pins, so modules are made for particular Cores.',
    'Mechanical limits matter too: bases, the battery bottom and the Core2 v1.3\'s vibration motor decide what stacks.'
  ],
  pitfalls: [
    'The M-Bus is a clean bus that all modules can share freely — Its SPI pins are already used by the Core\'s screen and card slot; a module needs its own chip-select and must not clash on the others.',
    'A module that worked on a Core Basic works on a CoreS3 — The same pin carries a different signal on the CoreS3 (rows 4 to 12 differ); a module is built for one generation.',
    'Pins 8, 10 and 12 are free GPIOs on every Core — On a Core Basic one of them is the speaker\'s DAC pin and on a Core2 two carry audio.'
  ],
  terms: [
    { term: 'M-Bus', also: ['M5 bus', '30-pin bus'], def: 'The 30-pin connector under a Core: ground, power, reset, SPI, I2C, serial, DAC, ADC and GPIO pins that stacked modules and bases connect to.' },
    { term: 'Module', also: ['M5 Module', 'stackable module'], def: 'An M5Stack add-on board with an M-Bus connector that stacks under a Core and adds a function such as communication, sensing or an interface.' },
    { term: 'Base', also: ['bottom', 'DinBase'], def: 'A stackable part that adds power, a battery or a mounting method rather than a function: a DIN-rail base with a wide supply input, or a battery bottom.' },
    { term: 'Chip select', also: ['CS', 'SS'], def: 'The pin that tells one device on a shared SPI bus that it is being addressed. Each device on the bus needs its own.' }
  ],
  choose: {
    good: ['Adding a communication or sensing function to a Core in one click-in', 'A DIN-rail installation of a CoreS3 on its base', 'A tidy stack with no wiring, for a bench tool'],
    avoid: ['Stacking several modules without checking their pins', 'Hot-plugging modules on a powered Core', 'Assuming one module fits every Core generation'],
    check: ['The pin table of your Core against each module\'s claims', 'The thickness and mechanics: bases, battery bottom, motor', 'Whether a module needs the 5 V, the battery or the HPWR or HVIN pins']
  },
  quiz: [
    { q: 'Two stacked modules both use the same M-Bus pin as a chip-select. What happens?', choices: ['Both drive one wire and neither works reliably: one must move to another pin or be removed', 'The bus arbitrates automatically', 'The Core picks the faster module', 'Nothing: M-Bus pins are duplicated'], a: 0, why: 'A pin is one wire. Two devices driving or listening on it at once disturb each other, so the claims of the modules and of the Core must not overlap.' },
    { q: 'Why are the SPI pins of a Core2\'s M-Bus not simply free for a module?', choices: ['SPI does not work on the M-Bus', 'They are 5 V pins', 'Modules may only use I2C', 'The Core\'s own screen and microSD slot already use them'], a: 3, why: 'The screen and the card slot share the SPI bus with the module. A module can join it only with its own chip-select and without changing the bus settings.' },
    { q: 'The same row of the M-Bus can carry a different GPIO on a Core Basic and on a Core2.', a: true, why: 'Several rows differ: MISO is G19 on the Basic and G38 on the Core2; row 8 is G16 and G17 against G13 and G14; row 10 differs again.' },
    { q: 'On a Core Basic, what else uses the GPIO that sits on M-Bus pin 8 (G25)?', choices: ['The microSD chip-select', 'The speaker, on its DAC', 'The USB bridge', 'Nothing'], a: 1, why: 'The catalogue notes that the Basic\'s speaker is on G25 (DAC1), shared with M-Bus pin 8, so a module on that pin competes with the speaker.' }
  ],
  applications: [
    'Adding communication or interface modules to a Core on a bench tool.',
    'A CoreS3 on a DIN-rail base for 9 to 24 V installations.',
    'The Core2 for AWS kit: a Core2 on a base with a secure element and LEDs.',
    'Stacked prototypes that turn into a fixed installation without rewiring.'
  ],
  sources: [
    'M5Stack documentation: the Core (Basic v2.7), Core2, CoreS3, Fire and Tough product pages, with their M-Bus pin tables, as read for the board catalogue on 2026-10-04.',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*: pin functions and restrictions.',
    'Motorola, *SPI Block Guide*, the origin of the SPI bus and its chip-select convention.'
  ],
  sim: 'm5-mbus-pins'
},

/* ================================================================ UIFlow */
{
  id: 'uiflow',
  parent: 'm5stack-family',
  title: 'UIFlow: blocks and MicroPython',
  level: 1,
  short: 'UIFlow is M5Stack\'s block editor. The blocks turn into MicroPython that runs on the device, on firmware that is MicroPython plus M5Stack\'s modules for the screen, keys, sound, sensors and units.',
  keywords: ['UIFlow', 'UIFlow 2', 'UIFlow2', 'blocks', 'MicroPython', 'M5 firmware', 'Widgets', 'BtnA', 'M5.begin', 'Blockly', 'block programming', 'no-code', 'M5Burner'],
  prereq: ['the-m5stack-idea', 'block-programming-tools', 'micropython-setup'],
  related: ['m5unified-and-m5gfx', 'm5-core-controllers', 'choosing-a-framework', 'first-program-blink', 'circuitpython-on-esp'],
  body: `UIFlow is M5Stack's way of programming without typing code. You assemble a program from blocks in a browser, such as "when button A is pressed", "show text", "wait", and the editor turns them into **MicroPython**, which runs on the device. UIFlow 2, the current generation (firmware 2.5.3 as of October 2026), is built on that fact: blocks and Python are two views of one program.

### Three layers

| Layer | What it is |
|---|---|
| Blocks | the editor's pictures: events, loops, conditions, widgets and units |
| MicroPython | the program the blocks make: ordinary Python text that you can read, and edit |
| Firmware | UIFlow's build of MicroPython on the device: MicroPython plus M5Stack's modules for the screen, keys, speaker, motion sensor, power chip and units |

Because the firmware is a fork of MicroPython, ordinary MicroPython code (\`machine\`, \`time\`, \`network\`) generally runs on it too. The reverse does not hold: a program written for M5Stack's modules (names such as \`M5\`, \`Widgets\` and \`BtnA\`) needs UIFlow firmware and will not run on stock MicroPython.

### What it is good for

- **First contact.** Block programs need no installation of a compiler or an IDE beyond the browser, so a class can start in minutes. A simple button, screen and sound project is a handful of blocks.
- **Teaching the structure.** The shape of a program, the events, the loop, the variable, is visible. The block notation used in this app is a teaching notation of the same kind ([the block lab](#/tools/blocklab) lets you build programs in it, and [[block-programming-tools]] compares the block environments). UIFlow's own blocks have other names and colours, but the structure is the same.
- **A path to code.** Switch to the Python view and the program is text; keep going in Python when the blocks become clumsy.

### Where it stops

MicroPython is interpreted: quick to write and slower to run than C++, and an ESP32 without PSRAM has little memory for it. Libraries that exist only for Arduino (many display and sensor drivers) are not available. The catalogue lists the support board by board: the older products show UIFlow, the newer ones UIFlow2 (the Core2 lists UIFlow; the AtomS3, Cardputer-Adv and Tab5 list UIFlow2). Check which your controller supports before you start, and the device must first carry the matching firmware; see M5Stack's UIFlow documentation for the current steps.

### The program below

The same counter in three forms: blocks, C++ with [[m5unified-and-m5gfx|M5Unified]], and Python as UIFlow writes it, with its \`setup\` and \`loop\` functions and a guard that prints errors on the screen.

> [!key] UIFlow turns blocks into MicroPython on M5Stack's own firmware, so blocks, Python and device are one chain. It is the quickest start and a good classroom tool; move to Arduino and M5Unified when you need speed, memory or Arduino-only libraries.`,
  ideas: [
    'UIFlow is a block editor whose blocks become MicroPython that runs on the device.',
    'The device carries UIFlow firmware: MicroPython plus M5Stack\'s modules for the screen, keys, sound, sensors and units.',
    'UIFlow code needs that firmware; plain MicroPython code generally runs on it, but not the other way round.',
    'It is the quickest start for beginners and classes, and the Python view is the path on to code.'
  ],
  pitfalls: [
    'A UIFlow program will run on any MicroPython board — It uses M5Stack\'s own modules (M5, Widgets, BtnA …) that exist only in UIFlow firmware.',
    'UIFlow 1 and UIFlow 2 are the same thing — UIFlow 2 is the current generation with its own firmware and editor; the catalogue marks which controllers support which.',
    'Blocks can only make small programs — They can make large ones, but a long block program gets hard to read; the Python view exists for the moment the blocks become clumsy.'
  ],
  terms: [
    { term: 'UIFlow', also: ['UIFlow 2', 'UIFlow2'], def: 'M5Stack\'s block programming environment for its controllers. Blocks are turned into MicroPython that runs on the device; UIFlow 2 is the current generation.' },
    { term: 'UIFlow firmware', also: ['M5 MicroPython firmware'], def: 'The firmware that must be on the device to run UIFlow programs: MicroPython plus M5Stack\'s modules for the display, buttons, sound, sensors and units.' },
    { term: 'Widget', also: ['Widgets', 'label', 'UI element'], def: 'A screen element a UIFlow program creates and updates: a label, an image, a progress bar, a button drawn on the display.' },
    { term: 'Block editor', also: ['block programming', 'Blockly'], def: 'A program editor in which statements are coloured blocks that snap together, so that structure is visible and syntax errors cannot occur.' }
  ],
  choose: {
    good: ['A first project, a class or a workshop with M5Stack controllers', 'Quick interface demos: screen, buttons, sound', 'A path from blocks to Python for beginners'],
    avoid: ['Speed-critical code, large programs or Arduino-only libraries', 'Boards that list no UIFlow support', 'Production firmware that must be reviewed like code'],
    check: ['That your controller supports UIFlow or UIFlow2 in the catalogue', 'The firmware version on the device against the editor', 'Whether you will want Python or C++ soon']
  },
  code: [
    {
      title: 'A counter on the screen, the same in three forms',
      about: 'Key A counts down, key B resets, key C counts up, and the count is shown large on the screen. The C++ version uses M5Unified; the Python version is written the way UIFlow 2 generates programs and runs on UIFlow firmware only.',
      needs: 'An M5Stack Core2 (or any controller with three keys and a screen) with UIFlow firmware for the Python version, or M5Unified for the C++ one.',
      libs: ['M5Unified'],
      blocks: `
        define show count
          show (count) at x (10) y (10) :: display

        when started
          set [count v] to (0)
          show count :: my

        when button [A v] pressed
          change [count v] by (-1)
          show count :: my

        when button [B v] pressed
          set [count v] to (0)
          show count :: my

        when button [C v] pressed
          change [count v] by (1)
          show count :: my
      `,
      cpp: String.raw`
        #include <M5Unified.h>

        int count = 0;

        void showCount() {
          M5.Display.setCursor(10, 10);
          M5.Display.printf("%5d", count);
        }

        void setup() {
          auto cfg = M5.config();
          M5.begin(cfg);
          M5.Display.setTextSize(4);
          M5.Display.setTextColor(TFT_WHITE, TFT_BLACK);
          showCount();
        }

        void loop() {
          M5.update();
          if (M5.BtnA.wasPressed()) { count--;    showCount(); }
          if (M5.BtnB.wasPressed()) { count = 0;  showCount(); }
          if (M5.BtnC.wasPressed()) { count++;    showCount(); }
        }
      `,
      py: String.raw`
        # UIFlow 2 firmware: runs on M5Stack's UIFlow MicroPython, not on stock MicroPython
        import os, sys, io
        import M5
        from M5 import *

        label0 = None
        count = 0

        def show_count():
            label0.setText("%5d" % count)

        def setup():
            global label0
            M5.begin()
            Widgets.fillScreen(0x000000)
            label0 = Widgets.Label("", 10, 10, 1.0, 0xFFFFFF, 0x000000, Widgets.FONTS.DejaVu40)
            show_count()

        def loop():
            global count
            M5.update()
            if BtnA.wasPressed():
                count = count - 1
                show_count()
            if BtnB.wasPressed():
                count = 0
                show_count()
            if BtnC.wasPressed():
                count = count + 1
                show_count()

        if __name__ == '__main__':
            try:
                setup()
                while True:
                    loop()
            except (Exception, KeyboardInterrupt) as e:
                try:
                    from utility import print_error_msg
                    print_error_msg(e)
                except ImportError:
                    print("please update to latest firmware")
      `,
      notes: ['The structure of the Python version (setup, loop, an error guard) is the shape of UIFlow 2 exports as the author knows it; the module names should be checked against the firmware on your device.', 'Our blocks are a teaching notation: UIFlow\'s own blocks are named and coloured differently, but each maps to one Python call.']
    }
  ],
  quiz: [
    { q: 'You export a UIFlow program and copy it onto a generic ESP32 running stock MicroPython. What happens?', choices: ['It runs identically', 'It runs without the screen', 'It fails at the import of M5Stack\'s modules, which exist only in UIFlow firmware', 'It is translated to C++ automatically'], a: 2, why: 'The M5, Widgets and button names come from M5Stack\'s modules inside UIFlow firmware. Stock MicroPython does not have them, so the import fails.' },
    { q: 'What does UIFlow turn blocks into?', choices: ['Arduino C++', 'ESP-IDF C', 'Machine code directly', 'MicroPython'], a: 3, why: 'UIFlow generates MicroPython text, which runs on the device\'s UIFlow firmware; the Python view of the editor shows that text.' },
    { q: 'Plain MicroPython code that uses only machine and time generally runs on UIFlow firmware too.', a: true, why: 'UIFlow\'s firmware is a MicroPython fork, so the standard modules are there; what is extra are M5Stack\'s modules.' },
    { q: 'Which is the best reason to move from UIFlow to Arduino and M5Unified?', choices: ['Blocks cannot show text', 'You need speed, more memory or an Arduino-only library', 'UIFlow cannot read buttons', 'M5Unified runs on any ESP chip without a board'], a: 1, why: 'MicroPython is interpreted and memory-hungry, and many display and sensor drivers exist only for Arduino. Blocks can read buttons and show text perfectly well.' }
  ],
  applications: [
    'Classroom introductions to programming with a screen, buttons and sound.',
    'Quick demos for visitors and customers.',
    'Home automation experiments where speed does not matter.',
    'A first step before moving the same project to Python or Arduino.'
  ],
  sources: [
    'M5Stack documentation: UIFlow 2 and the product pages (the supported software of each controller), as read on 2026-10-04.',
    'M5Stack\'s public repository for the UIFlow 2 MicroPython firmware.',
    'MicroPython documentation (version 1.29): the language the blocks produce.'
  ]
},

/* ================================================================ M5Unified */
{
  id: 'm5unified-and-m5gfx',
  parent: 'm5stack-family',
  title: 'M5Unified and M5GFX: one library for all',
  level: 2,
  short: 'One Arduino library that finds out which M5Stack it is running on, and gives the same calls for the display, buttons, power, motion sensor and speaker, so one program runs on many controllers.',
  keywords: ['M5Unified', 'M5GFX', 'M5.begin', 'M5.update', 'M5.Display', 'M5.BtnA', 'M5.Power', 'M5.Imu', 'M5.Speaker', 'LovyanGFX', 'board detection', 'M5Canvas', 'wasPressed', 'M5Stack library'],
  prereq: ['m5-core-controllers', 'm5-stick-controllers', 'm5-atom-controllers', 'choosing-a-framework'],
  related: ['uiflow', 'graphics-libraries', 'lvgl', 'm5-bus-and-modules', 'libraries-and-imports', 'motion-sensors-imu'],
  body: `Each M5Stack controller hides its screen reset behind a power chip, its backlight behind an I2C pin expander, and its buttons behind touch zones or real keys, so a program written pin by pin for one will not run on the next. **M5Unified** solves that with one library: \`M5.begin()\` works out which board it is on and sets everything up, and the same objects, \`M5.Display\`, \`M5.BtnA\`, \`M5.Power\`, \`M5.Imu\`, \`M5.Speaker\`, give the same calls on every board that has the part. **M5GFX**, which sits under \`M5.Display\`, is the graphics library: it is built on LovyanGFX and knows the panels of all the products.

### The shape of a program

~~~cpp
#include <M5Unified.h>

void setup() {
  auto cfg = M5.config();     // the defaults; flags such as external devices can be changed here
  M5.begin(cfg);              // detect the board, start the display, power and sensors
}

void loop() {
  M5.update();                // read keys, touch and power once per pass
  if (M5.BtnA.wasPressed()) { /* react once per press */ }
}
~~~

\`M5.update()\` must be called once per pass of the loop: it samples every button and works out the edges, so \`wasPressed()\` is true for exactly one pass after a press and \`isPressed()\` for as long as the key is held. Calling it twice loses edges; blocking in \`delay(1000)\` makes the keys miss presses. A drawing that is cleared and redrawn each pass flickers; draw into an off-screen canvas (\`M5Canvas\`) and push it, or draw only what changed.

### Why the library matters

The catalogue shows the problem it solves:

- **Revisions.** The Core2 v1.1 swaps its power chip, the v1.3 its motion sensor, and the Atom Matrix v1.1 its IMU, so a library has to detect which revision it is on.
- **New panels.** The AtomS3R's screen driver changed on 2026-05-14 and the Tab5's on 2025-10-14 and 2026-04-28: use a current M5GFX or the screen stays blank or garbled.
- **Hidden defaults.** On the StickS3 the external 5 V is off by default in M5Unified: Grove, Hat and IR power need \`M5.Power.setExtOutput(true)\`.
- **Missing parts.** The CoreS3-SE has no camera, proximity sensor or IMU, and code for those is incompatible: check before you call.

### Three languages, one idea

C++ with M5Unified is the full form. MicroPython exists only as UIFlow firmware ([[uiflow]]), with its own names for the same ideas (\`Widgets\`, \`BtnA\`, \`Imu\`, \`Speaker\`). Blocks sit above both. The simulation below runs the button and screen model of a Core2: edges, held keys and a frame in memory.

> [!key] M5Unified is the library that makes one M5Stack program run on many boards: begin() finds the board, update() reads the keys once per pass, and Display, Power, Imu and Speaker mean the same everywhere. Keep it and M5GFX up to date, because new panels and revisions arrive faster than your code does.`,
  ideas: [
    'M5Unified detects the board at run time and offers the same objects (Display, BtnA, Power, Imu, Speaker) on all of them.',
    'M5GFX, the graphics library under M5.Display, is built on LovyanGFX and knows the panels of the products.',
    'M5.update() reads keys and touch once per pass of the loop; wasPressed() is true for one pass, isPressed() while held.',
    'Libraries must be kept current: new screens and hardware revisions need them.'
  ],
  pitfalls: [
    'I can call M5.update() wherever I like — Call it once per pass. Calling it twice loses press edges, and a long delay() makes the keys miss presses entirely.',
    'The same code behaves identically on every M5Stack — The calls are the same, but boards lack parts: no IMU on a Core Basic, no camera on a CoreS3-SE. The library cannot invent them.',
    'An old library will do — A new batch of a board can carry a new screen driver, and an old M5GFX shows nothing or noise.'
  ],
  terms: [
    { term: 'M5Unified', also: ['M5.begin', 'M5 library'], def: 'M5Stack\'s Arduino library that detects the board it runs on and provides the same objects for the display, buttons, power, motion sensor, speaker and more.' },
    { term: 'M5GFX', also: ['M5.Display', 'M5.Lcd'], def: 'The graphics library under M5Unified\'s display: drawing, text, sprites and panel drivers for the M5Stack screens. It is built on LovyanGFX.' },
    { term: 'Edge detection', also: ['wasPressed', 'wasReleased'], def: 'Telling the moment a button changes state from the state itself. wasPressed() is true only for the pass in which the press happened.' },
    { term: 'Sprite', also: ['M5Canvas', 'off-screen canvas'], def: 'A drawing surface in memory: draw into it, then copy it to the screen in one go, which avoids flicker.' }
  ],
  choose: {
    good: ['Arduino or PlatformIO projects on one or several M5Stack controllers', 'Programs that must survive a change of board revision', 'Quick screens, buttons, sound and IMU without learning each chip'],
    avoid: ['Code that needs a part the board lacks, without checking', 'Libraries that touch the same pins directly while M5Unified owns them', 'An old M5GFX on a new batch of a board'],
    check: ['That the library supports your exact board and revision', 'M5.update() once per loop and no long delay()', 'The part you call exists: Imu, Touch, Speaker on your board']
  },
  code: [
    {
      title: 'Tilt readout, and a beep on key A',
      about: 'Shows the acceleration on three axes, in g, and sounds a tone while key A is pressed. The same calls run on any M5Stack with an IMU and a speaker; on a board without an IMU the numbers stay at zero.',
      needs: 'An M5Stack Core2 (or CoreS3, StickC-Plus2, AtomS3) and the M5Unified library.',
      libs: ['M5Unified'],
      blocks: `
        when started
          start display :: display
          set text size (2) :: display
        forever
          show (join [x ] (acceleration x)) at x (10) y (10) :: display
          show (join [y ] (acceleration y)) at x (10) y (40) :: display
          show (join [z ] (acceleration z)) at x (10) y (70) :: display
          wait (0.05) seconds
        end

        when button [A v] pressed
          play tone (880) Hz for (0.1) seconds :: sound
      `,
      cpp: String.raw`
        #include <M5Unified.h>

        void setup() {
          auto cfg = M5.config();
          M5.begin(cfg);                                  // finds out which board this is
          M5.Display.setTextSize(2);
          M5.Display.setTextColor(TFT_WHITE, TFT_BLACK);
        }

        void loop() {
          M5.update();                                    // once per pass
          float ax = 0, ay = 0, az = 0;
          M5.Imu.getAccel(&ax, &ay, &az);                 // in g; stays 0 on a board without an IMU
          M5.Display.setCursor(10, 10);
          M5.Display.printf("x %5.2f\ny %5.2f\nz %5.2f", ax, ay, az);
          if (M5.BtnA.wasPressed()) {
            M5.Speaker.tone(880, 100);                    // 880 Hz for 100 ms
          }
          delay(50);
        }
      `,
      py: String.raw`
        # UIFlow 2 firmware: runs on M5Stack's UIFlow MicroPython, not on stock MicroPython
        import M5
        from M5 import *
        import time

        label = None

        def setup():
            global label
            M5.begin()                                    # finds out which board this is
            Widgets.fillScreen(0x000000)
            label = Widgets.Label("", 10, 10, 1.0, 0xFFFFFF, 0x000000, Widgets.FONTS.DejaVu18)

        def loop():
            M5.update()                                   # once per pass
            ax, ay, az = Imu.getAccel()                   # in g
            label.setText("x %5.2f  y %5.2f  z %5.2f" % (ax, ay, az))
            if BtnA.wasPressed():
                Speaker.tone(880, 100)                    # 880 Hz for 100 ms
            time.sleep_ms(50)

        setup()
        while True:
            loop()
      `,
      output: `
        x  0.01
        y -0.02
        z  1.00
      `,
      notes: ['The Core Basic has no IMU in the catalogue; the program then shows zeros. A flat board reads about 1 g on one axis.', 'The Python names come from UIFlow 2 firmware; check them against the firmware on your device. The M5Unified calls are from the library\'s documented interface; check them against the version you install.']
    }
  ],
  quiz: [
    { q: 'You call M5.update() twice per pass of the loop. What goes wrong?', choices: ['Nothing: it is idempotent', 'The display flickers', 'Press edges are lost, because wasPressed() is consumed by the first call', 'The board resets'], a: 2, why: 'update() samples the buttons and works out the edges. The second call in the same pass sees no change and wipes the press that the first call recorded.' },
    { q: 'A new batch of AtomS3R shows a blank screen with your old sketch. What does the catalogue suggest?', choices: ['The battery is empty', 'GPIO18 must be driven low', 'The sketch must be rewritten in UIFlow', 'The screen driver changed on 2026-05-14: update to a current M5GFX'], a: 3, why: 'M5Stack changed the AtomS3R\'s panel driver from GC9107 to ST7735 on 2026-05-14. A current M5GFX knows both; an old one may not drive the new panel.' },
    { q: 'M5Unified code runs unchanged on stock MicroPython.', a: false, why: 'M5Unified is an Arduino C++ library. MicroPython on M5Stack runs through UIFlow firmware, whose module names differ.' },
    { q: 'You call M5.Imu.getAccel() on a Core Basic. What is the most likely result?', choices: ['It reads a hidden sensor', 'The values stay zero, because the Basic has no motion sensor', 'It crashes the ESP32', 'It reads the microphone'], a: 1, why: 'The same call exists on every board, but the Core Basic has no IMU in the catalogue, so there is nothing to read and the initial values remain.' }
  ],
  applications: [
    'One sketch that runs on a Core2, a CoreS3 and a StickC-Plus2 with small changes.',
    'Teaching projects where students swap boards without rewriting pin numbers.',
    'Gadgets with an IMU, a beep and a screen: remotes, level meters, spirit levels.',
    'The base for GUI libraries on M5Stack screens, such as LVGL, through M5GFX.'
  ],
  sources: [
    'M5Stack\'s public repositories for M5Unified and M5GFX: README files and examples.',
    'The LovyanGFX project, on which M5GFX is built.',
    'M5Stack documentation: product pages with the notes on revisions and screen drivers, as read for the board catalogue on 2026-10-04.'
  ],
  sim: 'm5-virtual-core2'
}
);
