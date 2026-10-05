/* HYPER-ESP32 · content/graphic-displays.js
 *
 * Displays and GUI → "Graphic displays": pixels, colour depth and the frame buffer; the SSD1306 OLED; colour TFTs and
 * the controllers behind them; SPI, parallel, RGB and MIPI interfaces; drawing, fonts and images; flicker, sprites and
 * double buffering; frame rate and bus speed; the libraries; e-paper; HUB75 panels; backlight and power; round displays.
 * Simulations: sims/graphic-displays.js (ids start with "gd-").
 */
Hyper.add(
/* ================================================================ pixels-and-framebuffers */
{
  id: 'pixels-and-framebuffers',
  parent: 'graphic-displays',
  title: 'Pixels, colour depth and frame buffers',
  level: 1,
  short: 'A graphic display is a grid of dots, and what it shows is a block of numbers in memory, one number per dot. Width × height × bits per pixel tells you what a picture costs — and why a small chip cannot simply hold a big screen.',
  keywords: ['pixel', 'resolution', 'frame buffer', 'framebuffer', 'colour depth', 'bits per pixel', 'bpp', 'RGB565', 'monochrome', 'video RAM', 'GRAM', 'display RAM', 'bitmap', 'true colour', 'byte order'],
  prereq: ['bits-and-bytes', 'choosing-a-display', 'stack-heap-and-static'],
  related: ['oled-ssd1306', 'colour-tft-displays', 'images-and-icons', 'flicker-and-double-buffering', 'using-psram', 'frame-rate-and-bus-speed'],
  body: `A graphic display is a grid of tiny dots, each of which the program can light or colour on its own. A letter, a gauge needle and a photograph are all the same thing to it: a pattern of dots. The grid's width and height in dots is its **resolution**; each dot is a **pixel**; and the number of bits that describe one pixel is the **colour depth**.

### The frame buffer: the picture kept in RAM

A program does not talk to the glass dot by dot. It changes numbers in an array in memory — the **frame buffer** — and then sends the array, or the part that changed, to the display. Every drawing call of every graphics library, from a pixel to a line of text, only sets numbers in that array. Its size is the first sum to learn: **bytes = width × height × bits per pixel ÷ 8**.

| Display | Pixels | Depth | One frame |
|---|---|---|---|
| OLED 128 × 64 | 8 192 | 1 bit | 1 024 bytes |
| E-paper 400 × 300 | 120 000 | 1 bit | 15 000 bytes |
| TFT 320 × 240 | 76 800 | 16 bits | 153 600 bytes |
| TFT 480 × 320 | 153 600 | 16 bits | 307 200 bytes |
| RGB panel 800 × 480 | 384 000 | 16 bits | 768 000 bytes |

Set those against the chip: an ESP32 has 520 KB of RAM in all, an ESP32-S3 512 KB, an ESP32-C3 400 KB, and the program and the Wi-Fi stack take their share first. A 1 KB OLED buffer is nothing; a full 320 × 240 colour frame is a third of everything; 800 × 480 needs external [[using-psram|PSRAM]]. Hence partial updates and sprites.

### Colour depth

- **1 bit:** on or off: OLEDs, e-paper, reflective LCDs.
- **2 or 4 bits:** four or sixteen greys, as on some e-paper. **8 bits:** 256 colours, from a palette or as 3-3-2 bits.
- **16 bits (RGB565):** 5 bits red, 6 green, 5 blue — 65 536 colours in two bytes, the standard of small TFTs. Green gets the spare bit because the eye is most sensitive to it.
- **18 or 24 bits:** 262 144 or 16.7 million colours, sent as three bytes per pixel. Larger panels and phone-class displays.

A colour written as 0xRRGGBB loses its low bits when squeezed into RGB565: 8 bits become 5 or 6, so a smooth gradient shows faint bands (only 32 steps of red). The simulation shows it.

### Two details, and where the buffer lives

**Bit order.** A simple buffer stores pixel rows one after another; the SSD1306 stores vertical strips of eight ([[oled-ssd1306]]). **Byte order.** The ESP32 keeps a 16-bit colour low byte first, the display wants the high byte first; libraries swap on the way out, and without the swap a red box shows up bluish.

Most controllers (SSD1306, ST7789, ILI9341) have display memory of their own: the picture stays on the glass once sent. RGB panels have none; the buffer in the ESP's RAM is read out continuously ([[display-interfaces]]).

> [!key] A frame buffer is the picture as numbers: width × height × bits per pixel ÷ 8 bytes. A 1 KB OLED buffer is trivial, a 320 × 240 colour frame costs 153 600 bytes of precious RAM — and that one sum explains partial updates, sprites, PSRAM and most other tricks of this topic.`,
  ideas: [
    'A display shows a grid of pixels; a program draws by changing numbers in a frame buffer in RAM and then sends the buffer, or part of it, to the panel.',
    'Buffer size is width × height × bits per pixel ÷ 8: 1 KB for a 128 × 64 OLED, 153 600 bytes for a 320 × 240 colour TFT.',
    'RGB565 packs a colour into 16 bits: 5 red, 6 green, 5 blue. It gives 65 536 colours and slight banding in smooth gradients.',
    'The order of bits in a buffer, and of the two bytes of a 16-bit colour, differs between displays; a wrong guess gives scrambled pictures or wrong colours.'
  ],
  pitfalls: [
    '16-bit colour means sixteen million colours — It means 65 536 (two to the sixteenth). Sixteen million is 24-bit "true colour". On a 16-bit panel smooth gradients show faint bands.',
    'The frame buffer is the screen — It is a copy of the picture in RAM, or in the controller\'s own memory. Changing it changes nothing on the glass until the data has been sent to the panel.',
    'A buffer for a small display is small — True for a 1 KB OLED. A modest 320 × 240 colour TFT needs 153 600 bytes, a big slice of a chip with 400 to 520 KB, and the largest single block the heap can give may be smaller than the total free memory.'
  ],
  terms: [
    { term: 'Pixel', also: ['picture element', 'dot'], def: 'The smallest dot of a display that can be set on its own. A 128 × 64 OLED has 8 192 of them.' },
    { term: 'Resolution', also: ['pixel count', '128 × 64'], def: 'The width and height of a display in pixels. It says how much fits on the screen; sharpness also depends on the physical size ([[colour-tft-displays|pixel density]]).' },
    { term: 'Frame buffer', also: ['framebuffer', 'video RAM', 'display buffer'], def: 'A block of memory that holds one value per pixel, the whole picture as numbers. Drawing changes the buffer; sending the buffer to the display changes the screen.' },
    { term: 'Colour depth', also: ['bits per pixel', 'bpp', 'bit depth'], def: 'The number of bits that describe one pixel: 1 for on or off, 16 for 65 536 colours, 24 for 16.7 million. The frame buffer grows in proportion.' },
    { term: 'RGB565', also: ['16-bit colour', 'high colour'], def: 'A 16-bit colour format with 5 bits of red, 6 of green and 5 of blue. The usual colour format of small TFT displays and their libraries.' }
  ],
  formulas: [
    {
      name: 'Size of a frame buffer',
      expr: 'M = w*h*b/8',
      tex: 'M = \\frac{w \\, h \\, b}{8}',
      vars: {
        M: { name: 'frame buffer size', unit: 'bytes' },
        w: { name: 'width in pixels', value: 320, min: 1, int: true },
        h: { name: 'height in pixels', value: 240, min: 1, int: true },
        b: { name: 'bits per pixel', value: 16, min: 1, max: 32 }
      },
      solveFor: 'M',
      note: 'Eight bits make a byte. Some formats are stored padded (18-bit colour as three bytes) and a few controllers want a line to start on a byte boundary: the real figure can be a little larger.',
      stories: { M: 'A TFT is {w} pixels wide and {h} high, with {b} bits per pixel. How many bytes does one full frame take?' },
      practice: { unknowns: ['M', 'b'] }
    }
  ],
  examples: [
    {
      title: 'Does the screen fit in the chip?',
      q: 'A project wants an 800 × 480 RGB565 panel on an ESP32-S3 board with 8 MB of PSRAM. Another wants a 320 × 240 colour TFT on an ESP32-C3, which has 400 KB of RAM. Can each keep a full frame in memory?',
      steps: ['The RGB panel: $800 \\times 480 \\times 16 / 8 = 768\\,000$ bytes. That is more than the S3\'s 512 KB of internal RAM, but about a ninth of 8 MB of PSRAM: it fits there.', 'The TFT: $320 \\times 240 \\times 16 / 8 = 153\\,600$ bytes, more than a third of the C3\'s 400 KB, which must also hold the program\'s variables and the Wi-Fi stack.', 'A full buffer is risky on the C3. Drawing in strips, or only the part of the screen that changed, uses a few kilobytes instead.'],
      a: 'The RGB panel fits in PSRAM. The C3 can hold the frame on paper but not comfortably — draw in strips or partial updates.'
    }
  ],
  quiz: [
    { q: 'How many bytes does one full frame of a monochrome 128 × 32 OLED need?', choices: ['512', '1 024', '4 096', '256'], a: 0, why: '128 × 32 = 4 096 pixels at one bit each is 4 096 bits, and eight bits make a byte: 512 bytes.' },
    { q: 'RGB565 gives green six bits and red and blue five each. Why does the spare bit go to green?', choices: ['Green LEDs are the weakest', 'The eye tells shades of green apart best', 'Green is the middle channel', 'Two bytes cannot be split any other way'], a: 1, why: 'Human vision is most sensitive to green, so the extra bit of precision is worth most there. (The sum 5 + 6 + 5 = 16 is the consequence, not the reason.)' },
    { q: 'A 320 × 240 display at 16 bits needs 153 600 bytes per frame. An ESP32-C3 has 400 KB of RAM in all. Is a full frame buffer a good plan?', choices: ['Yes: 153 600 is far below 400 000', 'No: it is over a third of all the RAM, so strips or partial updates are safer', 'Yes, but only at 8 bits per pixel', 'No: the C3 cannot drive colour displays'], a: 1, why: 'The buffer would take over a third of the chip\'s memory before the program and the Wi-Fi stack have had theirs. Drawing in strips, sprites or a chip with PSRAM avoids the problem.' },
    { q: 'Calling a drawing function such as drawLine on a buffered library changes the screen at once.', a: false, why: 'It changes numbers in the frame buffer. The screen changes when the buffer, or the changed part of it, is sent to the display — with an Adafruit-style OLED library, when display() is called.' }
  ],
  applications: [
    'Estimating, before buying a board, whether a given screen fits in its RAM — the sum in the first table.',
    'A weather station on a 128 × 64 OLED, whose whole frame is 1 KB.',
    'A dashboard on an 800 × 480 RGB panel, whose frame lives in PSRAM and is read out all the time.',
    'Reading library settings such as "colour depth" and "swap bytes" and knowing what they change.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Peripherals API: LCD (panel colour formats and bytes per pixel).',
    'Adafruit, *Adafruit GFX Graphics Library* guide: canvases and the layout of their buffers.',
    'MicroPython documentation: module *framebuf* (buffer formats MONO_VLSB, MONO_HLSB, RGB565 and others), version 1.29.'
  ],
  code: [
    {
      title: 'How much RAM does a frame cost?',
      about: 'Prints the free memory, then tries to reserve a frame buffer for four common screens and says whether it fits. Run it on your own board before choosing a display.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define report (name) (w) (h) (bits)
          set [bytes v] to ((((w) * (h)) * (bits)) / (8))
          if <can the chip reserve (bytes) bytes of RAM?> then
            print (join (name) [ : fits, ] (bytes) [ bytes])
          else
            print (join (name) [ : does NOT fit, ] (bytes) [ bytes])
          end

        when started
          start serial at (115200) baud
          print (join [Free RAM: ] (free memory in bytes))
          report [OLED 128x64, 1 bit] (128) (64) (1) :: my
          report [TFT 240x240, 16 bit] (240) (240) (16) :: my
          report [TFT 320x240, 16 bit] (320) (240) (16) :: my
          report [TFT 480x320, 16 bit] (480) (320) (16) :: my
      `,
      cpp: String.raw`
        #include "esp_heap_caps.h"

        // try to take one frame buffer's worth of internal RAM, then give it back
        void report(const char *name, int w, int h, int bits) {
          size_t bytes = (size_t)w * h * bits / 8;
          void *p = heap_caps_malloc(bytes, MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);
          Serial.printf("%-20s %7u bytes  %s\n", name, (unsigned)bytes, p ? "fits" : "does NOT fit");
          heap_caps_free(p);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);                               // give the monitor time to open
          Serial.printf("Free internal RAM: %u bytes (largest block %u)\n",
                        (unsigned)heap_caps_get_free_size(MALLOC_CAP_INTERNAL),
                        (unsigned)heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL));
          report("OLED 128x64, 1 bit", 128, 64, 1);
          report("TFT 240x240, 16 bit", 240, 240, 16);
          report("TFT 320x240, 16 bit", 320, 240, 16);
          report("TFT 480x320, 16 bit", 480, 320, 16);
          if (psramFound()) Serial.printf("PSRAM: %u bytes\n", (unsigned)ESP.getPsramSize());
          else Serial.println("No PSRAM.");
        }

        void loop() {}
      `,
      py: String.raw`
        import gc

        def report(name, w, h, bits):
            nbytes = w * h * bits // 8
            try:
                buf = bytearray(nbytes)            # ask the heap for a frame buffer
                verdict = "fits"
                del buf
            except MemoryError:
                verdict = "does NOT fit"
            gc.collect()
            print("%-20s %7d bytes  %s" % (name, nbytes, verdict))

        gc.collect()
        print("Free RAM: %d bytes" % gc.mem_free())
        report("OLED 128x64, 1 bit", 128, 64, 1)
        report("TFT 240x240, 16 bit", 240, 240, 16)
        report("TFT 320x240, 16 bit", 320, 240, 16)
        report("TFT 480x320, 16 bit", 480, 320, 16)
      `,
      notes: ['The figures depend on the board and the program: Wi-Fi, Bluetooth and the libraries all take memory. On a board with PSRAM the MicroPython heap includes it, so larger buffers "fit" there — slowly.', 'The C++ version asks for internal RAM only; a library that uses PSRAM for its buffer has more room ([[using-psram]]).']
    }
  ],
  sim: 'gd-framebuffer'
},

/* ================================================================ oled-ssd1306 */
{
  id: 'oled-ssd1306',
  parent: 'graphic-displays',
  title: 'OLED: the SSD1306',
  level: 1,
  short: 'The 0.96-inch 128 × 64 OLED on two wires is the maker\'s default screen: no backlight, a perfect black, a 1 KB buffer — and a memory layout of vertical strips that surprises everyone once.',
  keywords: ['SSD1306', 'OLED', '0.96 inch', '128x64', '128x32', 'SH1106', 'SSD1309', 'I2C OLED', '0x3C', '0x3D', 'Adafruit_SSD1306', 'ssd1306.py', 'page addressing', 'charge pump', 'burn-in', 'monochrome display', 'U8g2'],
  prereq: ['pixels-and-framebuffers', 'i2c', 'i2c-addresses-and-scanning'],
  related: ['drawing-primitives', 'fonts', 'graphics-libraries', 'backlight-and-power', 'choosing-a-display', 'frame-rate-and-bus-speed'],
  body: `An OLED screen is made of dots that give off their own light, so there is no backlight to waste and a dot that is off is truly black. The 0.96-inch module with 128 × 64 dots and an **SSD1306** controller is the screen of a thousand gadgets: four pins (3.3 V, GND, SDA, SCL), a library of a few lines, a whole frame of just 1 024 bytes. Variants with 128 × 32 dots (0.91 inch) sit on many boards; a 72 × 40 one is soldered onto some tiny ESP32-C3 boards.

### How the SSD1306 keeps a picture

The controller's memory is 128 columns by **eight pages**, a page being a band of eight pixel rows. One byte is a **vertical strip of eight pixels** in one column, with bit 0 at the top. Byte 0 is column 0 of page 0, byte 1 is column 1 of page 0, … byte 128 starts page 1. A library such as Adafruit's keeps a copy of exactly this in the ESP's RAM: draw into the copy, then send all 1 024 bytes with one call. The simulation shows the byte layout by painting pixels.

### On the wire

The module answers at I2C address **0x3C** (some at 0x3D, chosen by a solder jumper). Boards that print "0x78" use the 8-bit form of the same address. At 400 kHz a full update takes about 25 ms: roughly 40 frames a second. At the default 100 kHz it is about ten, which is why programs raise the clock. SPI versions of the module (more pins) are several times faster ([[frame-rate-and-bus-speed]]).

### Look-alikes and sizes

- **SH1106**, the usual chip on 1.3-inch modules, looks identical but its memory is 132 columns wide: with an SSD1306 driver the picture is shifted by two dots and one column is noise. Choose the SH1106 driver.
- **SSD1309** is the larger 2.42-inch screen with the same picture.
- The 72 × 40 and 64 × 32 screens are windows into the same 128-column memory, so libraries need an offset.

### Living with it

Nothing shows until the buffer has been sent: the call is \`display()\` in Adafruit's library. Each lit dot draws current, so a mostly white screen costs more than a mostly black one — about 20 mA with half the dots lit for the 0.96-inch screen ([[backlight-and-power]]). And OLED dots age: a static white logo shown for months leaves a ghost. Blank the screen when nobody looks, or move the picture a little from time to time.

> [!key] The SSD1306 OLED is a 1 KB monochrome screen on I2C address 0x3C, stored as vertical strips of eight pixels. Remember to send the buffer, raise the I2C clock to 400 kHz, check for an SH1106 behind a 1.3-inch label, and do not leave one image on for ever.`,
  ideas: [
    'An OLED makes its own light, so it needs no backlight and a dark pixel costs nothing; the 128 × 64 SSD1306 module has a 1 024-byte buffer.',
    'The SSD1306 stores the picture as pages of eight rows, one byte per vertical strip of eight pixels, bit 0 on top.',
    'The usual I2C address is 0x3C; at 400 kHz a full update takes about 25 ms, at 100 kHz about 100 ms.',
    'The 1.3-inch SH1106 looks the same but needs its own driver, and a static image left on for months can leave a ghost.'
  ],
  pitfalls: [
    'Every 128 × 64 OLED is an SSD1306 — Many 1.3-inch modules use the SH1106, whose memory is 132 columns wide. With the wrong driver the picture is shifted by two dots and a column of noise shows at one edge.',
    'I drew the text but the screen stays dark — A buffered library draws into RAM only. Nothing appears until display() (or show() in MicroPython) sends the buffer.',
    'The address is always 0x3C — Some modules use 0x3D, and a "0x78" printed on the board is the same 0x3C written as an 8-bit write address. Scan the bus ([[i2c-addresses-and-scanning]]) rather than guess.'
  ],
  terms: [
    { term: 'OLED', also: ['organic LED', 'organic light-emitting diode'], def: 'A display whose every dot is a tiny light-emitting diode. It needs no backlight, shows true black, and its dots slowly lose brightness with use.' },
    { term: 'SSD1306', also: ['SSD1315'], def: 'The controller chip of the common small monochrome OLEDs, 128 × 64 or 128 × 32 dots, spoken to over I2C or SPI. The SSD1315 is a close relative.' },
    { term: 'SH1106', also: ['1.3-inch OLED controller'], def: 'A controller that behaves almost like the SSD1306 but has 132 columns of memory, so a driver for the wrong chip shifts the picture by two dots.' },
    { term: 'Page addressing', also: ['GDDRAM page', 'vertical byte'], def: 'The way the SSD1306 organises its memory: pages of eight pixel rows, and one byte per column of a page, bit 0 at the top.' },
    { term: 'Charge pump', also: ['SWITCHCAPVCC'], def: 'A circuit inside the SSD1306 that makes the higher voltage the OLED dots need from the 3.3 V supply, so the module needs only one supply pin.' },
    { term: 'Burn-in', also: ['image retention', 'ghosting'], def: 'The faint permanent image left when the same bright pattern has been shown for a very long time, because the dots there have aged more than the others.' }
  ],
  choose: {
    good: ['Status read-outs, menus and sensor values on a battery gadget', 'Dark enclosures, front panels and wearables where its self-lit contrast shines', 'Projects that have only two spare pins: I2C is enough'],
    avoid: ['A full-brightness white screen for long periods: power draw and ageing', 'Colour, photographs or large text: the screen is small and one colour', 'Direct sunlight: a reflective LCD or e-paper reads better'],
    check: ['SSD1306 or SH1106 — the chip is written on the module or its listing', 'The I2C address, with a bus scan', 'Whether the tiny 72 × 40 or 64 × 32 variant needs an offset in your library']
  },
  code: [
    {
      title: 'Hello and a reading on the OLED',
      about: 'Writes a title and a temperature, then sends the buffer. The same three steps — clear, draw, send — are in every program for this screen.',
      needs: 'An ESP32 DevKit and a 0.96-inch SSD1306 I2C OLED at address 0x3C.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL'], ['3V3', 'OLED VCC'], ['GND', 'OLED GND']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX Library'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
          clear display
          show [Hello, ESP32] at x (0) y (0)
          show [23.5 C] at x (0) y (20)
          update display    // nothing is visible before this block
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 display(128, 64, &Wire, -1);   // width, height, bus, no reset pin

        void setup() {
          Wire.begin(21, 22);                           // SDA, SCL
          Wire.setClock(400000);                        // fast mode: about 40 full updates a second
          if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
            for (;;) delay(1000);                       // not found: check wiring and address
          }
          display.clearDisplay();
          display.setTextSize(1);
          display.setTextColor(SSD1306_WHITE);
          display.setCursor(0, 0);
          display.println("Hello, ESP32");
          display.setCursor(0, 20);
          display.println("23.5 C");
          display.display();                            // nothing shows until this call
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin
        import ssd1306                                  # first time: import mip; mip.install("ssd1306")

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)        # address 0x3C unless told otherwise

        oled.fill(0)
        oled.text("Hello, ESP32", 0, 0, 1)
        oled.text("23.5 C", 0, 20, 1)
        oled.show()                                     # nothing shows until this call
      `,
      notes: ['The MicroPython \`ssd1306\` driver is not frozen into the ESP32 firmware: install it once with mip, or copy the file to the board.', 'A 128 × 32 screen is \`display(128, 32, …)\` in C++ and \`SSD1306_I2C(128, 32, i2c)\` in Python; for an SH1106 use a driver written for it.']
    }
  ],
  quiz: [
    { q: 'In the SSD1306\'s memory, what does one byte hold?', choices: ['Eight pixels side by side in one row', 'Eight pixels stacked in one column, bit 0 at the top', 'One pixel with eight shades', 'Half of a 16-bit colour'], a: 1, why: 'The controller is organised in pages of eight rows; each byte is a vertical strip of eight pixels. Libraries that keep a buffer follow the same layout.' },
    { q: 'A 1.3-inch "SSD1306" module shows the picture shifted two dots to the right with noise in the first column. What is the likely cause?', choices: ['The I2C clock is too fast', 'The module has an SH1106 with 132 columns of memory', 'The charge pump is off', 'The buffer is too small'], a: 1, why: 'The SH1106 starts its 128 visible columns two columns into a 132-column memory. A driver for the SSD1306 does not know that offset.' },
    { q: 'How many bytes does the buffer of a 128 × 32 OLED take?', choices: ['256', '512', '1 024', '4 096'], a: 1, why: '128 × 32 = 4 096 pixels, eight to a byte: 512 bytes. The 128 × 64 screen takes 1 024.' },
    { q: 'With Adafruit\'s SSD1306 library, text written with print() appears on the screen at once.', a: false, why: 'print() writes into the buffer in the ESP\'s RAM. The screen changes only when display() sends the buffer. Forgetting that call is the commonest reason for a dark screen.' }
  ],
  applications: [
    'The screen of many LoRa and Wi-Fi boards: Heltec, LilyGO and others carry a 0.96-inch SSD1306 or an SH1106 on the board.',
    'Sensor read-outs, a clock, or a menu on a handheld tool.',
    'Debug output on a device that has no computer attached.',
    'A tiny 0.42-inch screen on an ESP32-C3 board that shows IP address and status.'
  ],
  sources: [
    'Solomon Systech, *SSD1306 datasheet*: memory organisation, page addressing and charge pump.',
    'Adafruit, *Adafruit SSD1306* library and its examples (begin, display, dim).',
    'MicroPython documentation and micropython-lib: the *ssd1306* driver for the SSD1306 and SSD1306-compatible OLEDs.'
  ],
  sim: { id: 'gd-framebuffer', params: { mode: 'pages' } }
},

/* ================================================================ colour-tft-displays */
{
  id: 'colour-tft-displays',
  parent: 'graphic-displays',
  title: 'Colour TFTs: ST7789, ILI9341 and their kin',
  level: 1,
  short: 'A small colour screen on an SPI bus: a liquid-crystal panel, a backlight, and a controller chip that remembers the picture. A few controller names — ST7735, ST7789, ILI9341, ILI9488, ST7796 — cover nearly every module a maker will meet.',
  keywords: ['TFT', 'ST7789', 'ST7735', 'ILI9341', 'ILI9342', 'ILI9488', 'ST7796', 'GC9A01', 'IPS', 'TN', 'LCD module', 'colour display', 'SPI display', 'pixel density', 'ppi', 'BGR', 'colour inversion', 'tab variant', 'cheap yellow display'],
  prereq: ['pixels-and-framebuffers', 'spi', 'spi-modes-and-speed'],
  related: ['display-interfaces', 'backlight-and-power', 'frame-rate-and-bus-speed', 'graphics-libraries', 'resistive-touch', 'touch-display-boards', 'lilygo-t-display-family', 'cheap-yellow-display'],
  body: `A colour TFT module is a small liquid-crystal screen with a transistor behind every dot (that is the "thin-film transistor") and an LED backlight shining through it. Behind the glass sits a **controller** chip that holds the picture in its own memory; the ESP sends it commands and pixels over a few wires and the picture stays there. The controller name decides how you talk to it.

### The controllers you will meet

| Controller | Typical screens | Colour over SPI | What to know |
|---|---|---|---|
| ST7735 | 1.8″, 160 × 128 | 65 536 | Several "tab" variants with different offsets and colour order |
| ST7789 | 1.14″ 240 × 135, 1.3″ and 1.54″ 240 × 240, 1.9″ 320 × 170, 2.0″ 320 × 240 | 65 536 | IPS panels; the screen of many stick-shaped boards |
| ILI9341 | 2.4″ to 3.2″, 320 × 240 | 65 536 | The classic touch screen of maker projects; most modules add a resistive touch chip |
| ILI9488 | 3.5″, 480 × 320 | 262 144 | Takes 18-bit colour only, so SPI needs three bytes per pixel: slow |
| ST7796 | 3.5″ to 4″, 480 × 320 | 65 536 | 16-bit colour over SPI, unlike the ILI9488; often capacitive touch |
| GC9A01 | 1.28″, 240 × 240, round | 65 536 | See [[round-and-odd-displays]] |

Boards carry them ready-made: the LilyGO T-Display and the M5Stack Cardputer have 1.14-inch ST7789 screens, the M5Stack Core2 a 2-inch ILI9342C (a close relative of the ILI9341); see [the board catalogue](#/tools/boards).

### Reading a listing

**Size** in inches is the diagonal; **resolution** is in pixels. Their ratio is the **pixel density**: a 2.8-inch 320 × 240 screen has about 143 pixels per inch, a 1.14-inch 240 × 135 one about 241 — the small screen looks the sharper. **IPS** panels keep their colours when seen from the side; cheaper **TN** panels shift colour and darken at an angle.

The module's pins are nearly always the same: VCC and GND, SCK and MOSI (labelled SCL and SDA on some), CS, **DC** (tells the controller whether the next byte is a command or pixel data; also called RS or A0), RST, and BL or LED for the backlight. Logic is 3.3 V.

### Quirks to expect

- **Inverted or swapped colours.** Many ST7789 modules show a negative picture until the driver sends an "invert" command, and some show red as blue until the red-blue order flag is flipped. Every library has a switch for each; try them before blaming the wiring.
- **Offsets.** A 240 × 135 panel sits in the middle of a 240 × 320 memory, so the visible window starts at an offset; the ST7735 "tab" variants differ in the same way.
- **No chip-select pin.** Some 1.3-inch 240 × 240 modules lack CS and want SPI mode 3.
- **The backlight** stays on unless you switch it ([[backlight-and-power]]).

> [!key] A colour TFT is a controller (ST7789, ILI9341 …) with a screen and a backlight, spoken to over SPI at 3.3 V. Match the library to the controller and the exact variant, expect colour inversion and offset switches, and judge sharpness by pixels per inch rather than by the resolution alone.`,
  ideas: [
    'A TFT module is a liquid-crystal panel with a backlight and a controller chip that keeps the picture in its own memory.',
    'The controller name — ST7735, ST7789, ILI9341, ILI9488, ST7796 — decides which driver, how many bytes per pixel and how fast.',
    'The ILI9488 takes 18-bit colour over SPI (three bytes per pixel), so it is slower than 16-bit controllers of the same size.',
    'Expect module quirks: inverted colours, red and blue swapped, an offset window, or no chip-select pin; every library has a switch for each.'
  ],
  pitfalls: [
    'A bigger resolution means a sharper screen — Sharpness is pixels per inch. A 1.14-inch 240 × 135 screen is denser than a 2.8-inch 320 × 240 one.',
    'All modules with the same size use the same driver settings — The offset, the colour order and the inversion differ between makers of the same controller. A picture shifted by a few dots, or a negative one, is a settings problem, not a broken screen.',
    'Four wires are enough — SPI display modules need data, clock, chip select and the DC line, usually also reset and a backlight pin: six or seven pins.'
  ],
  terms: [
    { term: 'TFT LCD', also: ['TFT', 'thin-film transistor display'], def: 'A liquid-crystal display with a transistor at every dot, lit from behind by a backlight. The colour screens of maker projects are TFT LCDs.' },
    { term: 'IPS', also: ['in-plane switching'], def: 'A liquid-crystal panel type that keeps colour and contrast when viewed from the side. Most modern small TFT modules are IPS; older cheap ones are TN.' },
    { term: 'Display controller', also: ['driver IC', 'ST7789', 'ILI9341'], def: 'The chip behind the glass that holds the picture in its own memory and drives the dots. Its name, not the size of the screen, decides the driver and the commands.' },
    { term: 'D/C line', also: ['DC', 'RS', 'A0', 'data/command'], def: 'A pin that tells the controller whether the byte on the SPI bus is a command or pixel data. It is one of the extra pins an SPI display needs beyond the clock and data lines.' },
    { term: 'Pixel density', also: ['ppi', 'pixels per inch'], def: 'The number of pixels per inch of the screen: the diagonal in pixels divided by the diagonal in inches. It decides how sharp the picture looks.' }
  ],
  formulas: [
    {
      name: 'Pixel density',
      expr: 'ppi = sqrt(w^2 + h^2)/d',
      tex: '\\mathrm{ppi} = \\frac{\\sqrt{w^2 + h^2}}{d}',
      vars: {
        ppi: { name: 'pixel density', unit: 'pixels per inch' },
        w: { name: 'width in pixels', value: 320, min: 1, int: true },
        h: { name: 'height in pixels', value: 240, min: 1, int: true },
        d: { name: 'screen diagonal', q: 'length', unit: 'in', value: 2.8 }
      },
      solveFor: 'ppi',
      note: 'The diagonal of the pixel grid, from Pythagoras, divided by the diagonal of the glass. A round screen: use its diameter and w = h.',
      stories: { ppi: 'A module is {w} pixels wide and {h} high on a screen with a diagonal of {d}. How many pixels per inch does it have?' },
      practice: { unknowns: ['ppi', 'd'] }
    }
  ],
  choose: {
    good: ['Dashboards, thermostats and remote controls with colour and text', 'Handheld gadgets and boards that already carry a screen: the settings are known', 'Projects that need a touch panel on the same module (ILI9341, ST7796)'],
    avoid: ['The ILI9488 over SPI for anything that animates: three bytes a pixel is slow', 'Direct sunlight and battery-for-a-year designs with the backlight always on', 'Screens with no named controller: you cannot pick a driver blindly'],
    check: ['The controller chip, the exact resolution and the variant (tab, offset)', 'Whether the module includes touch, and which chip', 'The pins you really have: SPI pins, DC, reset and backlight']
  },
  code: [
    {
      title: 'Colour bars and a greeting on an ST7789',
      about: 'Three bars — red, green, blue — show at once whether the colour order is right; then some text. Change the width, height and pins to your module.',
      needs: 'An ESP32 DevKit and a 1.3-inch 240 × 240 ST7789 SPI module with a backlight pin.',
      wiring: [['GPIO18', 'SCK'], ['GPIO23', 'MOSI (SDA)'], ['GPIO5', 'CS'], ['GPIO27', 'DC'], ['GPIO26', 'RST'], ['GPIO25', 'BL (backlight)'], ['3V3 / GND', 'power']],
      libs: ['GFX Library for Arduino (Arduino_GFX)'],
      blocks: `
        when started
          start display [ST7789 240×240 v]
          fill screen with colour [black v]
          draw filled rectangle x (0) y (0) width (80) height (60) colour [red v]
          draw filled rectangle x (80) y (0) width (80) height (60) colour [green v]
          draw filled rectangle x (160) y (0) width (80) height (60) colour [blue v]
          show [Hello] at x (20) y (100) size (3) colour [white v]
      `,
      cpp: String.raw`
        #include <Arduino_GFX_Library.h>

        // the bus: DC, CS, SCK, MOSI, MISO (not used by this display)
        Arduino_DataBus *bus = new Arduino_ESP32SPI(27, 5, 18, 23, GFX_NOT_DEFINED);
        // the panel: bus, reset pin, rotation, IPS?, width, height
        Arduino_GFX *gfx = new Arduino_ST7789(bus, 26, 0, true, 240, 240);

        const int BACKLIGHT = 25;

        void setup() {
          pinMode(BACKLIGHT, OUTPUT);
          digitalWrite(BACKLIGHT, HIGH);        // backlight on
          gfx->begin();                         // starts the bus and sends the start-up commands
          gfx->fillScreen(RGB565_BLACK);
          gfx->fillRect(0, 0, 80, 60, RGB565_RED);     // three bars: is red really red?
          gfx->fillRect(80, 0, 80, 60, RGB565_GREEN);
          gfx->fillRect(160, 0, 80, 60, RGB565_BLUE);
          gfx->setTextColor(RGB565_WHITE);
          gfx->setTextSize(3);
          gfx->setCursor(20, 100);
          gfx->println("Hello");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin, SPI
        import st7789
        import vga1_16x32 as font               # a font file that comes with the st7789 module

        spi = SPI(2, baudrate=40_000_000, sck=Pin(18), mosi=Pin(23))
        tft = st7789.ST7789(spi, 240, 240, reset=Pin(26, Pin.OUT), cs=Pin(5, Pin.OUT),
                            dc=Pin(27, Pin.OUT), backlight=Pin(25, Pin.OUT), rotation=0)
        tft.init()                              # starts the controller and the backlight
        tft.fill(st7789.BLACK)
        tft.fill_rect(0, 0, 80, 60, st7789.RED)     # three bars: is red really red?
        tft.fill_rect(80, 0, 80, 60, st7789.GREEN)
        tft.fill_rect(160, 0, 80, 60, st7789.BLUE)
        tft.text(font, "Hello", 20, 100, st7789.WHITE, st7789.BLACK)
      `,
      notes: ['If red shows as blue, flip the colour-order setting of the driver; if the picture looks like a photographic negative, switch the inversion on or off. Both are one-line settings, not wiring faults.', 'The MicroPython \`st7789\` module is a community driver written in C: it is not in the official firmware and needs a MicroPython build that includes it (see [[graphics-libraries]]). On an ESP32-S3 or C3 the hardware SPI id is 1, not 2.']
    }
  ],
  quiz: [
    { q: 'The ILI9488 shows 480 × 320 pixels over SPI more slowly than the ST7796 does. What is the main reason?', choices: ['Its SPI clock is limited to 1 MHz', 'It accepts only 18-bit colour, so each pixel is three bytes instead of two', 'It has no display memory', 'It uses I2C'], a: 1, why: 'Over SPI the ILI9488 wants 18-bit colour, sent as three bytes per pixel. The ST7796 accepts 16-bit RGB565: a third less data for the same picture.' },
    { q: 'Roughly what is the pixel density of a 2.8-inch 320 × 240 screen?', choices: ['70 ppi', '114 ppi', '143 ppi', '400 ppi'], a: 2, why: 'The diagonal is $\\sqrt{320^2 + 240^2} = 400$ pixels; 400 / 2.8 inches is about 143 pixels per inch.' },
    { q: 'A new ST7789 module shows the right picture, but as a negative: black is white and every colour is its opposite. What should you try first?', choices: ['A shorter SPI cable', 'The inversion setting of the library', 'A larger buffer', 'Replacing the ESP32'], a: 1, why: 'The panel needs an "invert display" command that many modules require and others do not. Libraries expose it as a setting; one value gives the negative, the other the normal picture.' },
    { q: 'The DC pin of an SPI display module carries pixel data.', a: false, why: 'DC tells the controller whether the byte now on the SPI bus is a command or pixel data. The pixels themselves travel on the data line (MOSI).' }
  ],
  applications: [
    'Stick-shaped boards with a 1.14-inch ST7789: LilyGO T-Display, M5Stack Cardputer.',
    'The 2.4- to 2.8-inch ILI9341 touch boards often called "cheap yellow display" ([[cheap-yellow-display]]).',
    'Thermostats, bench gadgets and test equipment panels in colour.',
    'A 3.5-inch ST7796 panel for a larger status board with capacitive touch.'
  ],
  sources: [
    'Sitronix, *ST7789V datasheet* and Ilitek, *ILI9341 datasheet*: commands, colour formats, memory organisation.',
    'Arduino_GFX (GFX Library for Arduino) documentation: the supported panels and bus classes.',
    'Espressif, *ESP-IDF Programming Guide*, Peripherals API: LCD (SPI panel IO and the panel drivers).'
  ],
  sim: 'gd-depth'
},

/* ================================================================ display-interfaces */
{
  id: 'display-interfaces',
  parent: 'graphic-displays',
  title: 'SPI, parallel, RGB, MIPI: display interfaces',
  level: 2,
  short: 'The same pixels can reach a screen over two wires, six, twenty, or a pair of high-speed lanes. The interface sets the pin count, the speed, whether the panel remembers its picture — and which ESP chip you are allowed to use.',
  keywords: ['SPI', 'QSPI', 'quad SPI', 'parallel', '8080', 'I80', 'i8080', 'RGB interface', 'parallel RGB', 'MIPI-DSI', 'DSI', 'HSYNC', 'VSYNC', 'pixel clock', 'LCD_CAM', 'esp_lcd', 'bounce buffer', 'display interface'],
  prereq: ['colour-tft-displays', 'parallel-interfaces', 'spi'],
  related: ['frame-rate-and-bus-speed', 'using-psram', 'lcd-evaluation-boards', 'esp32-p4-function-ev-board', 'touch-display-boards', 'graphics-libraries'],
  body: `How do the pixels get from the chip to the glass? Over a bus, and the choice of bus decides the number of pins, the speed, whether the panel keeps its own picture — and even which ESP chip you can use. There are five families.

### The five ways

| Interface | Pins | How pixels travel | What it is for | Chips (from the catalogue) |
|---|---|---|---|---|
| I2C | 2 | one bit per clock, 400 kHz | small monochrome OLEDs | every chip |
| SPI | 4 to 6 | one bit per clock, 20–80 MHz | screens up to about 3 inches | every chip |
| Quad SPI | 6 | four bits per clock | AMOLEDs, fast small colour screens | chips with a suitable SPI host |
| Parallel (Intel 8080, "I80") | 11 to 19 | 8 or 16 bits per write cycle | 2- to 4-inch TFTs that must be quick | ESP32 (through I2S), S2, S3, S31, P4 |
| RGB (parallel RGB) | about 20 | a continuous pixel stream with sync signals | 4- to 7-inch panels, 800 × 480 | S2, S3, S31, P4 |
| MIPI-DSI | dedicated lane pins, not GPIOs | a few fast differential lanes | phone-class panels, 1024 × 600 and more | P4 only |

The ESP32-C3, C6 and the other small chips list SPI only: their screens are small, and that is a fact of the chip, not of the library. Real boards show each choice. The LilyGO T-Display-S3 drives an 8-bit parallel ST7789; the T-Display-S3 AMOLED a QSPI RM67162; the Elecrow CrowPanel 7.0 an 800 × 480 RGB panel; the Guition JC1060P470 a 7-inch 1024 × 600 MIPI-DSI panel on an ESP32-P4.

### Memory in the panel, or not

An I2C, SPI or parallel (I80) panel has a controller with **display memory**: you send a picture once and it stays, and you may redraw just a corner. An **RGB** panel has no memory, only timing logic. The ESP must stream *every* pixel, in order, with horizontal and vertical sync pulses and a data-enable signal, sixty times a second — for ever. An 800 × 480 panel at 16 bits needs 800 × 480 × 2 × 60 ≈ 46 megabytes a second read out of the frame buffer. That sits in PSRAM, so the chip needs PSRAM and a peripheral built for the job; a small internal "bounce buffer" smooths the reading. MIPI-DSI panels in video mode behave the same way, at higher speed.

### Choosing

- A static or slowly changing screen up to about 2.4 inches: **SPI** is enough and costs the fewest pins.
- A 3.5-inch screen that must move: **8-bit parallel** or **Quad SPI**; the ILI9488 over plain SPI is the slowest combination ([[frame-rate-and-bus-speed]]).
- A large touch interface with smooth animation: **RGB** on an ESP32-S3 with PSRAM, or **MIPI-DSI** on the ESP32-P4.
- Remember the pins: an RGB panel spends about twenty of the chip's GPIOs, and the simulation shows the speed each interface can reach.

> [!key] Interfaces trade pins for speed: I2C two, SPI about five, parallel about twelve to nineteen, RGB about twenty, MIPI-DSI dedicated lanes. Parallel and SPI panels remember the picture; RGB and MIPI video panels do not, so the ESP streams every frame from PSRAM — and only the chips that have the interface can do it.`,
  ideas: [
    'Display interfaces trade pins for speed: I2C uses two pins, SPI about five, 8-bit parallel about eleven, RGB about twenty, MIPI-DSI dedicated lanes.',
    'Panels on I2C, SPI and parallel buses have memory in their controller; RGB panels have none, so the ESP streams every pixel continuously.',
    'Only some chips have the hardware: RGB on the S2, S3, S31 and P4, MIPI-DSI on the P4 alone; the C3 and C6 list SPI only.',
    'Streaming an 800 × 480, 16-bit panel at 60 Hz needs about 46 MB/s from the frame buffer, which is why large RGB screens need PSRAM.'
  ],
  pitfalls: [
    'More wires always mean a faster screen — Speed is bits per second: a parallel bus at a slow write clock can lose to SPI at 80 MHz. What parallel buys is eight or sixteen bits per clock, if the clock is high enough.',
    'Any ESP32 can drive an RGB or MIPI panel with the right library — The chip needs the peripheral. The catalogue lists RGB only for the S2, S3, S31 and P4, MIPI-DSI only for the P4; on others a library can only bit-bang slowly, if at all.',
    'An RGB panel is an SPI screen with more wires — It has no memory. Stop streaming and the picture disappears; any hiccup in the stream (a flash write, a starved bus) shows as a glitch on the screen.'
  ],
  terms: [
    { term: 'Parallel interface (Intel 8080)', also: ['I80', 'i8080', '8-bit parallel', 'MCU interface'], def: 'A display bus with 8 or 16 data lines and a write strobe: one byte or word moves per write cycle. The panel keeps its own memory. The usual fast interface of 2- to 4-inch TFTs.' },
    { term: 'Quad SPI', also: ['QSPI', 'quad-lane SPI'], def: 'SPI with four data lines instead of one, so four bits move per clock. Used by AMOLED screens and some fast colour displays.' },
    { term: 'RGB interface', also: ['parallel RGB', 'RGB panel', 'DPI'], def: 'A display bus that carries red, green and blue values for each pixel as they are scanned, with horizontal and vertical sync signals. The panel has no memory: the chip streams every frame continuously.' },
    { term: 'MIPI-DSI', also: ['DSI', 'MIPI display serial interface'], def: 'The high-speed serial display bus of phones and tablets: a few differential lane pairs carry the pixels. On the ESP family only the ESP32-P4 has it.' },
    { term: 'Pixel clock', also: ['PCLK', 'dot clock'], def: 'The clock that times one pixel on an RGB or DSI panel. Together with the blanking intervals it fixes the refresh rate: about 60 Hz for a typical panel.' }
  ],
  choose: {
    good: ['SPI for small, mostly still screens: fewest pins, every chip', 'Parallel (I80) or Quad SPI when a mid-sized screen must animate', 'RGB or MIPI-DSI for large touch panels, on a chip and board designed for them'],
    avoid: ['SPI for a 3.5-inch screen that has to scroll smoothly', 'An RGB panel on a board without PSRAM, or one that spends every free pin', 'Choosing the display first and the chip afterwards: the interface may not exist on the chip'],
    check: ['Which interfaces the chip lists in the chip explorer', 'How many pins the interface takes against how many the board frees', 'Whether the panel has its own memory, and so whether the ESP must stream it']
  },
  sim: { id: 'gd-framerate', params: { display: 'st7796-480x320' } },
  code: [
    {
      title: 'Time a full-screen fill and compare it with the theory',
      about: 'Fills a 240 × 240 screen forty times and prints how many full screens per second the bus really delivers, next to the figure the clock predicts. It is the quickest way to see what an interface can do.',
      needs: 'The ST7789 module of the colour TFT page on an ESP32 DevKit.',
      wiring: [['GPIO18', 'SCK'], ['GPIO23', 'MOSI'], ['GPIO5', 'CS'], ['GPIO27', 'DC'], ['GPIO26', 'RST'], ['GPIO25', 'BL']],
      libs: ['GFX Library for Arduino (Arduino_GFX)'],
      blocks: `
        when started
          start serial at (115200) baud
          start display [ST7789 240×240 v]
          set [t0 v] to (milliseconds since start)
          repeat (20)
            fill screen with colour [blue v]
            fill screen with colour [red v]
          end
          set [ms v] to ((milliseconds since start) - (t0))
          print (join [measured full screens per second: ] ((40 * 1000) / (ms)))
          print (join [theory at 40 MHz: ] ((40000000) / (((240) * (240)) * (16))))
      `,
      cpp: String.raw`
        #include <Arduino_GFX_Library.h>

        const uint32_t SPI_HZ = 40000000;            // the bus clock we ask for
        const int W = 240, H = 240;

        Arduino_DataBus *bus = new Arduino_ESP32SPI(27, 5, 18, 23, GFX_NOT_DEFINED);
        Arduino_GFX *gfx = new Arduino_ST7789(bus, 26, 0, true, W, H);

        void setup() {
          Serial.begin(115200);
          pinMode(25, OUTPUT);
          digitalWrite(25, HIGH);                    // backlight on
          gfx->begin(SPI_HZ);
          const int N = 20;
          uint32_t t0 = millis();
          for (int i = 0; i < N; i++) {              // two full-screen writes per pass
            gfx->fillScreen(RGB565_BLUE);
            gfx->fillScreen(RGB565_RED);
          }
          uint32_t ms = millis() - t0;
          float measured = 1000.0f * 2 * N / ms;
          float theory = (float)SPI_HZ / ((float)W * H * 16);     // 16 bits a pixel, no overhead
          Serial.printf("measured %.1f full screens a second, theory %.1f\n", measured, theory);
        }

        void loop() {}
      `,
      py: String.raw`
        import time
        from machine import Pin, SPI
        import st7789

        SPI_HZ = 40_000_000                          # the bus clock we ask for
        W, H = 240, 240

        spi = SPI(2, baudrate=SPI_HZ, sck=Pin(18), mosi=Pin(23))
        tft = st7789.ST7789(spi, W, H, reset=Pin(26, Pin.OUT), cs=Pin(5, Pin.OUT),
                            dc=Pin(27, Pin.OUT), backlight=Pin(25, Pin.OUT))
        tft.init()

        N = 20
        t0 = time.ticks_ms()
        for i in range(N):                           # two full-screen writes per pass
            tft.fill(st7789.BLUE)
            tft.fill(st7789.RED)
        ms = time.ticks_diff(time.ticks_ms(), t0)
        print("measured %.1f full screens a second, theory %.1f" % (1000 * 2 * N / ms, SPI_HZ / (W * H * 16)))
      `,
      notes: ['Expect the measured figure a little below the theory: every transfer carries command bytes, and chip-select and gaps between writes cost time.', 'A different interface changes only the line that makes the bus object. The rest of the program, and the fill test, stay the same.']
    }
  ],
  quiz: [
    { q: 'Which ESP chip of the family has MIPI-DSI display hardware?', choices: ['ESP32-S3', 'ESP32-P4', 'ESP32-C6', 'Every chip with PSRAM'], a: 1, why: 'Only the ESP32-P4 lists MIPI-DSI. The S3 can drive RGB panels, and the small chips only SPI.' },
    { q: 'Why does a large RGB panel need the picture to be streamed continuously from RAM?', choices: ['The panel has no memory of its own: it shows what arrives, sixty times a second', 'RGB panels are very slow', 'The controller forgets the commands', 'PSRAM is faster than SPI'], a: 0, why: 'An RGB panel has only timing logic. Unlike an SPI or parallel panel, it cannot hold a picture: stop sending and it shows nothing.' },
    { q: 'About how much data per second must be read from the frame buffer to refresh an 800 × 480, 16-bit RGB panel at 60 Hz?', choices: ['About 4.6 MB/s', 'About 46 MB/s', 'About 460 MB/s', 'About 4.6 GB/s'], a: 1, why: '800 × 480 × 2 bytes = 768 000 bytes a frame, times 60 frames = 46 080 000 bytes a second.' },
    { q: 'An ESP32-C3 can drive an 8-bit parallel display with its own hardware.', a: false, why: 'The catalogue lists SPI only for the C3. A program could wiggle GPIO pins by hand, but far too slowly for a screen of any size.' }
  ],
  applications: [
    'Choosing between a SPI 2-inch screen and a parallel 3.5-inch one for a handheld, by pins and speed.',
    '7-inch 800 × 480 RGB touch boards on an ESP32-S3 for dashboards and home panels.',
    'Phone-class MIPI-DSI screens on ESP32-P4 boards for graphical interfaces with animation.',
    'Reading a board listing: "8-bit parallel", "QSPI" and "RGB" tell you what the screen can do before you read a line of code.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Peripherals API: LCD (SPI, I80, RGB and MIPI-DSI panel interfaces) for each chip.',
    'Espressif, datasheets of the ESP32-S3 and ESP32-P4: the LCD, camera and display interfaces of each chip.',
    'MIPI Alliance, *Display Serial Interface (DSI)* specification: the lane structure of the interface (the standard behind MIPI-DSI panels).'
  ]
},

/* ================================================================ drawing-primitives */
{
  id: 'drawing-primitives',
  parent: 'graphic-displays',
  title: 'Lines, shapes and text',
  level: 1,
  short: 'Every graphics library offers the same small toolbox: pixel, line, rectangle, circle, triangle, text. They work on a grid whose origin is the top-left corner and whose y axis points down — and they paint over each other in the order you call them.',
  keywords: ['drawLine', 'drawRect', 'fillRect', 'drawCircle', 'fillCircle', 'drawPixel', 'drawTriangle', 'drawRoundRect', 'coordinates', 'origin', 'Bresenham', 'clipping', 'draw order', 'primitives', 'Adafruit GFX', 'framebuf', 'anti-aliasing'],
  prereq: ['pixels-and-framebuffers', 'oled-ssd1306'],
  related: ['fonts', 'images-and-icons', 'graphics-libraries', 'flicker-and-double-buffering', 'presenting-data', 'round-and-odd-displays'],
  body: `Whatever the library — Adafruit GFX, U8g2, TFT_eSPI, LovyanGFX, Arduino_GFX, or MicroPython's framebuf — the drawing calls are almost the same, because they all grew from the same few ideas. Learn them once and every screen in this topic is open to you.

### The coordinate system

The **origin (0, 0) is the top-left pixel**. x grows to the right, and **y grows downwards**, as lines of text do. On a 128 × 64 screen x runs from 0 to 127 and y from 0 to 63. Anything drawn outside is **clipped**: dropped without an error, which makes a shape that "does not appear" a coordinates problem more often than a code problem.

### The toolbox

| Call (Adafruit-style names) | Draws | Arguments |
|---|---|---|
| drawPixel | one dot | x, y, colour |
| drawLine | a straight line | x0, y0, x1, y1, colour — two corners |
| drawFastHLine, drawFastVLine | horizontal or vertical line | x, y, length, colour |
| drawRect, fillRect | rectangle, outline or filled | x, y, **width, height**, colour |
| drawRoundRect, fillRoundRect | the same with rounded corners | x, y, width, height, radius, colour |
| drawCircle, fillCircle | circle | centre x, centre y, radius, colour |
| drawTriangle, fillTriangle | triangle | three corners, colour |
| setCursor, print | text | position, size, colour |

Two classic slips: a rectangle takes width and height while a line takes its two end points; and a circle is given a centre and a radius, so its diameter, 2r + 1, is always odd.

### How a line becomes pixels

A slanted line cannot pass through the centres of the pixels it crosses. **Bresenham's algorithm** walks along the longer axis and, at each step, picks the pixel nearest the true line, using only integer additions and comparisons — fast enough for any microcontroller. The price is the staircase of "jaggies" on shallow diagonals. Smooth lines need shades between the line colour and the background; on a monochrome OLED there are none, on a TFT they cost extra time.

Filled shapes are drawn as runs of horizontal pixels. On a TFT each run is one write of the same colour to a window of the screen, so \`fillRect\` is far faster than the same area drawn pixel by pixel ([[frame-rate-and-bus-speed]]). Prefer fast lines and filled rectangles for bars, backgrounds and grids.

### Order and colour

Later calls paint over earlier ones; there are no layers. On a monochrome screen the colours are on and off, and drawing "black" erases whatever is under it — the simulation lets you stamp shapes and watch the order matter. The text calls use the same colour and coordinate rules; their size and look are the subject of [[fonts]].

> [!key] A screen is a grid with the origin at the top-left and y pointing down. A small set of calls — pixel, line, rectangle, circle, triangle — draws on it, clipped at the edges and painted in call order; know which take corners and which take width and height.`,
  ideas: [
    'The origin (0, 0) is the top-left pixel and y increases downwards; shapes outside the screen are clipped silently.',
    'Rectangles take x, y, width and height; lines take two end points; circles take a centre and a radius.',
    'Bresenham\'s algorithm picks the nearest pixel at each step with integer arithmetic, which is fast and gives the staircase edge of a slanted line.',
    'Later drawing calls paint over earlier ones; on a TFT filled rectangles and fast lines are much quicker than single pixels.'
  ],
  pitfalls: [
    'The y axis points up, as in a graph — On a display it points down. A needle that should swing upwards needs a negative y offset, and a plot has to be flipped by hand.',
    'drawRect(10, 10, 30, 20) ends at the point (30, 20) — The last two numbers are width and height, so the rectangle covers x 10 to 39 and y 10 to 29. The corner form belongs to drawLine and drawTriangle.',
    'A shape that does not appear is a library bug — Most often it is outside the screen (clipped), drawn in the background colour, or drawn into the buffer but never sent to the display.'
  ],
  terms: [
    { term: 'Origin', also: ['(0, 0)', 'top-left corner'], def: 'The pixel at x = 0, y = 0: the top-left corner of the screen. Every drawing coordinate is measured from it, with y growing downwards.' },
    { term: 'Graphics primitive', also: ['drawing primitive', 'drawing call'], def: 'One of the basic drawing operations a graphics library provides: pixel, line, rectangle, circle, triangle, text. Everything else is built from them.' },
    { term: 'Bresenham\'s algorithm', also: ['Bresenham line', 'midpoint circle'], def: 'A method of drawing lines and circles by choosing, at each step along the main axis, the nearest pixel, using only integer arithmetic.' },
    { term: 'Clipping', also: ['clip'], def: 'Dropping the parts of a shape that fall outside the screen (or outside a chosen window), instead of wrapping around or raising an error.' },
    { term: 'Anti-aliasing', also: ['smoothing', 'AA'], def: 'Drawing the edge pixels of a shape in shades between the shape colour and the background, so that diagonals look smooth rather than stepped. It needs more than one bit per pixel.' }
  ],
  examples: [
    {
      title: 'Where does the needle end?',
      q: 'A dial is centred at (32, 32) and its needle is 20 pixels long. The needle sweeps from pointing left (0 %) through straight up (50 %) to pointing right (100 %). Where does it end at 25 %? Remember that y points down.',
      steps: ['Use an angle $a = 180° + 1.8° \\times \\text{percent}$: 180° is left, 270° is up (because y is down), 360° is right. At 25 %: $a = 225°$.', '$x = 32 + 20 \\cos 225° = 32 - 14.1 = 17.9 \\approx 18$.', '$y = 32 + 20 \\sin 225° = 32 - 14.1 = 17.9 \\approx 18$: the sine is negative, which moves the point *up* the screen.'],
      a: 'The needle ends at about (18, 18): up and to the left of the centre.'
    }
  ],
  quiz: [
    { q: 'On a 128 × 64 screen, where is the pixel at x = 0, y = 63?', choices: ['Top-left', 'Bottom-left', 'Bottom-right', 'Top-right'], a: 1, why: 'x = 0 is the left edge; y = 63 is the last row, the bottom, because y grows downwards.' },
    { q: 'drawRect(10, 10, 30, 20, colour) is called. Which columns does the rectangle cover?', choices: ['10 to 30', '10 to 39', '10 to 40', '30 to 40'], a: 1, why: 'The third argument is the width, 30 pixels, starting at column 10: columns 10 to 39. The rows are 10 to 29.' },
    { q: 'Why is fillRect much faster than drawing the same area with drawPixel on a colour TFT?', choices: ['fillRect uses less colour', 'One window write sends a run of identical pixels, instead of an address and a pixel for each dot', 'drawPixel is not allowed on TFTs', 'fillRect skips the frame buffer'], a: 1, why: 'The controller is told a window once and is then sent the pixels back to back. A single-pixel call repeats the whole address setup for every dot.' },
    { q: 'On a monochrome OLED, drawing a shape in the "off" colour erases the pixels under it.', a: true, why: 'There are only two values, on and off. Drawing off over lit pixels switches them off; this is how shapes are cut out and text is cleared.' }
  ],
  applications: [
    'Gauges, bar graphs and level indicators built from a frame, a filled rectangle and a line for the needle.',
    'Simple charts: a line per sample, with fast vertical lines for grid marks.',
    'Icons and pointers that are easier to draw as a few lines than to store as images.',
    'Debugging overlays: a cross or box at the position a sensor reports.'
  ],
  sources: [
    'Adafruit, *Adafruit GFX Graphics Library* guide: the graphics primitives and the coordinate system.',
    'MicroPython documentation: module *framebuf*, class FrameBuffer (line, rect, fill_rect, ellipse), version 1.29.',
    'J. E. Bresenham, "Algorithm for computer control of a digital plotter", IBM Systems Journal, 1965.'
  ],
  code: [
    {
      title: 'A dial and a bar on the OLED',
      about: 'Draws a frame, a dial with a needle, and a bar with a number, for readings from 0 to 100 %. It uses the line, rectangle and circle calls and the draw order: clear, draw, send.',
      needs: 'The ESP32 DevKit and the 128 × 64 SSD1306 OLED of the OLED page.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX Library'],
      blocks: `
        define draw screen (percent)
          clear display
          draw rectangle x (0) y (0) width (128) height (64)
          draw circle at x (32) y (32) radius (24)
          set [a v] to (radians ((180) + ((1.8) * (percent))))
          draw line from x (32) y (32) to x ((32) + ((20) * (cos of (a)))) y ((32) + ((20) * (sin of (a))))
          draw rectangle x (70) y (28) width (50) height (10)
          draw filled rectangle x (70) y (28) width ((percent) / (2)) height (10)
          show (join (percent) [ %]) at x (70) y (44)
          update display

        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
          for each [p v] in (numbers from (0) to (100) in steps of (5))
            draw screen (p) :: my
            wait (0.1) seconds
          end
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 display(128, 64, &Wire, -1);

        void drawScreen(int percent) {
          display.clearDisplay();
          display.drawRect(0, 0, 128, 64, SSD1306_WHITE);                // frame: x, y, width, height
          display.drawCircle(32, 32, 24, SSD1306_WHITE);                 // dial: centre and radius
          float a = radians(180 + 1.8 * percent);                       // 180 degrees = left, 270 = up, 360 = right
          display.drawLine(32, 32, 32 + 20 * cos(a), 32 + 20 * sin(a), SSD1306_WHITE);   // needle: two end points
          display.drawRect(70, 28, 50, 10, SSD1306_WHITE);               // bar outline
          display.fillRect(70, 28, percent / 2, 10, SSD1306_WHITE);      // bar fill
          display.setCursor(70, 44);
          display.print(percent);
          display.print(" %");
          display.display();
        }

        void setup() {
          Wire.begin(21, 22);
          Wire.setClock(400000);
          display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
          display.setTextColor(SSD1306_WHITE);
          for (int p = 0; p <= 100; p += 5) {
            drawScreen(p);
            delay(100);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import math, time
        from machine import I2C, Pin
        import ssd1306

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)

        def draw_screen(percent):
            oled.fill(0)
            oled.rect(0, 0, 128, 64, 1)                                  # frame: x, y, width, height
            oled.ellipse(32, 32, 24, 24, 1)                              # dial: a circle is an ellipse with equal radii
            a = math.radians(180 + 1.8 * percent)                        # 180 degrees = left, 270 = up, 360 = right
            oled.line(32, 32, int(32 + 20 * math.cos(a)), int(32 + 20 * math.sin(a)), 1)   # needle: two end points
            oled.rect(70, 28, 50, 10, 1)                                 # bar outline
            oled.fill_rect(70, 28, percent // 2, 10, 1)                  # bar fill
            oled.text("%d %%" % percent, 70, 44, 1)
            oled.show()

        for p in range(0, 101, 5):
            draw_screen(p)
            time.sleep_ms(100)
      `,
      notes: ['MicroPython\'s framebuf has no circle call: \`ellipse\` with two equal radii draws one. The coordinates it takes must be integers, hence \`int()\` around the needle end.', 'The 8 × 8 font of MicroPython and the 6 × 8 cell of Adafruit\'s default font differ slightly in width, so the text sits a little differently in the two versions.']
    }
  ],
  sim: 'gd-primitives'
},

/* ================================================================ fonts */
{
  id: 'fonts',
  parent: 'graphic-displays',
  title: 'Fonts',
  level: 1,
  short: 'Text on a display is drawn from a table of little pictures. The built-in 5 × 7 font is tiny and blocky; better fonts cost flash and RAM, and smooth ones need colour. Size, width, baseline and memory are the things to know.',
  keywords: ['font', 'glyph', 'bitmap font', 'anti-aliased font', 'smooth font', 'proportional', 'monospaced', 'baseline', 'setTextSize', 'setFont', 'getTextBounds', 'U8g2 fonts', 'FreeSans', 'GFX font', 'text wrapping', 'UTF-8', 'character cell'],
  prereq: ['drawing-primitives', 'strings-and-text'],
  related: ['images-and-icons', 'graphics-libraries', 'lvgl', 'formatting-numbers', 'hmi-design-rules', 'oled-ssd1306'],
  body: `Every letter on a screen is a small picture drawn from a **font**: a table with one picture, a **glyph**, for each character. The picture is not made at run time (usually); it is looked up and copied into the frame buffer, dot by dot.

### The built-in font

The classic font of Adafruit GFX and many other libraries has glyphs of **5 × 7 dots** in a **cell of 6 × 8**: one blank column and one blank row keep letters apart. Asking for **size 2** does not load a new font: every dot becomes a 2 × 2 block, so the cell is 12 × 16, and size 3 gives 18 × 24. That is why big text on these displays looks like toy bricks. On a 128 × 64 screen, size 1 gives 21 characters on each of 8 lines; size 2 gives 10 on each of 4 lines; size 4 only 5 on each of 2 lines. The simulation shows the grid.

### Fixed and proportional

In a **fixed-width** (monospaced) font every cell is as wide as the widest letter: columns line up, and the letter i floats in a wide cell. In a **proportional** font each glyph has its own width, so more text fits and it reads better — but to centre or right-align it you must first *measure* the string (\`getTextBounds\` in Adafruit GFX, \`getStrWidth\` in U8g2).

### Bitmap and smooth

A **bitmap font** is designed dot by dot for one size: sharp and small, one bit per dot. A **smooth (anti-aliased) font** stores each dot as several bits, usually four, so edge dots are shades between the letter colour and the background. On a colour TFT that looks like print; on a one-bit OLED there are no shades to blend into, so it makes no sense. Smooth fonts cost more: the same glyph takes four times the bytes, and every size is a separate font. A rough guide, uncompressed: bytes ≈ characters × height × bytes per row.

| Font | Characters | Size | Memory |
|---|---|---|---|
| 5 × 7 built-in | 95 | 8 dots high | 475 bytes |
| Bitmap, 12 × 16 | 95 | 1 bit | about 3 KB |
| Bitmap, 24 × 32, digits and signs only | 16 | 1 bit | about 1.5 KB |
| Smooth, 12 × 16 | 95 | 4 bits | about 9 KB |

Libraries compress fonts; U8g2's fonts are far smaller than the sums suggest, and TFT_eSPI and LVGL generate the sizes you ask for.

### Practical points

- With Adafruit GFX's extra fonts the cursor sets the **baseline**, the line the letters stand on, not the top of the text.
- The default font covers plain ASCII only. The degree sign, µ, Ω and accented letters need a font that has them and a library that reads UTF-8 text.
- Choose the size from the reader's distance, not from what fits: text that is comfortable on a handheld is too small on a panel across the room ([[hmi-design-rules]]).

> [!key] A font is a table of glyph pictures. The built-in 5 × 7 font is scaled by whole dots, so it grows blocky; proportional fonts fit more text but must be measured; smooth fonts need colour and several times the memory. Pick the font for the reader and the flash you have.`,
  ideas: [
    'A font is a table with one small picture, a glyph, per character; drawing text copies glyphs into the frame buffer.',
    'The built-in 5 × 7 font sits in a 6 × 8 cell; size n scales every dot to n × n, so the cell grows to 6n × 8n and big text looks blocky.',
    'Fixed-width fonts align in columns; proportional fonts fit more text but the string must be measured to centre it.',
    'Smooth fonts use about four bits per dot: they look good on colour screens and cost several times the memory of a bitmap font.'
  ],
  pitfalls: [
    'Text size 4 is a bigger font — It is the same font with every dot enlarged: blocky, and the cell is 24 × 32, so a 128-pixel line holds only 5 characters.',
    'Every font contains °, µ and é — The default covers plain ASCII. Symbols and accents need a font that includes them, and sometimes a UTF-8 option in the library.',
    'Anti-aliased text will look better on my OLED — A one-bit OLED has no grey levels to blend with; smooth fonts belong on colour displays.'
  ],
  terms: [
    { term: 'Font', also: ['typeface', 'font file'], def: 'A table of pictures, one per character, in one design and size. The program draws text by copying the pictures into the frame buffer.' },
    { term: 'Glyph', also: ['character picture'], def: 'The picture of one character in a font. In the built-in font each glyph is 5 dots wide and 7 high, drawn inside a 6 × 8 cell.' },
    { term: 'Proportional font', also: ['variable-width font', 'monospaced font'], def: 'A font in which each character has its own width. Its opposite, a monospaced font, gives every character the same cell width.' },
    { term: 'Anti-aliased font', also: ['smooth font', 'AA font'], def: 'A font whose glyphs store several bits per dot, so edges blend smoothly into the background. Common on colour TFTs (LVGL uses four bits per dot), pointless on one-bit displays.' },
    { term: 'Baseline', also: ['text baseline'], def: 'The imaginary line the letters stand on. With the extra fonts of some libraries, the y position of text is the baseline rather than the top.' }
  ],
  choose: {
    good: ['The built-in 5 × 7 font for debug text and small labels', 'A proportional bitmap font for readings and titles on an OLED', 'A smooth font on a colour TFT for anything the user reads for long'],
    avoid: ['Scaling the built-in font past size 2 for important numbers: a proper large font looks better and costs little', 'Embedding many sizes of a smooth font on a chip with little flash', 'Fonts without the symbols you print (°, µ, accents)'],
    check: ['That the font has every character your text uses', 'The size of the font in flash against the free space', 'Whether the library puts the cursor at the top or the baseline for this font']
  },
  code: [
    {
      title: 'Text at three sizes, centred',
      about: 'Prints the word OLED at three sizes and centres each line. In C++ the library measures the text; in MicroPython, which has only an 8 × 8 font, a small helper enlarges every dot.',
      needs: 'The ESP32 DevKit and the 128 × 64 SSD1306 OLED.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX Library'],
      blocks: `
        define centred (text) (y) (size)
          set text size (size)
          show (text) centred on x (64) at y (y)

        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
          clear display
          centred [OLED] (0) (1) :: my
          centred [OLED] (12) (2) :: my
          centred [OLED] (32) (3) :: my
          update display
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 display(128, 64, &Wire, -1);

        // print text centred on x = 64 with its top edge at y
        void centred(const char *s, int y, int size) {
          int16_t x1, y1;
          uint16_t w, h;
          display.setTextSize(size);
          display.getTextBounds(s, 0, 0, &x1, &y1, &w, &h);    // measure the string at this size
          display.setCursor((128 - w) / 2 - x1, y);
          display.print(s);
        }

        void setup() {
          Wire.begin(21, 22);
          display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
          display.clearDisplay();
          display.setTextColor(SSD1306_WHITE);
          centred("OLED", 0, 1);
          centred("OLED", 12, 2);
          centred("OLED", 32, 3);
          display.display();
        }

        void loop() {}
      `,
      py: String.raw`
        import framebuf
        from machine import I2C, Pin
        import ssd1306

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)

        def centred(s, y, size):
            n = len(s)
            tmp = framebuf.FrameBuffer(bytearray(n * 8), n * 8, 8, framebuf.MONO_HLSB)
            tmp.text(s, 0, 0, 1)                         # the built-in font: one size, 8 x 8 dots
            x0 = (128 - n * 8 * size) // 2               # centre on x = 64
            for j in range(8):
                for i in range(n * 8):
                    if tmp.pixel(i, j):                  # enlarge every dot to size x size
                        oled.fill_rect(x0 + i * size, y + j * size, size, size, 1)

        oled.fill(0)
        centred("OLED", 0, 1)
        centred("OLED", 12, 2)
        centred("OLED", 32, 3)
        oled.show()
      `,
      notes: ['For a proportional font in C++, add \`#include <Fonts/FreeSans9pt7b.h>\` and call \`display.setFont(&FreeSans9pt7b)\`; the y you give to setCursor is then the baseline. \`setFont(NULL)\` returns to the built-in font.', 'MicroPython has no font choice in the standard framebuf; community modules convert fonts into Python files and draw them with a small writer class.']
    }
  ],
  quiz: [
    { q: 'The built-in font is drawn at size 2 on a 128-pixel-wide screen. How many characters fit on a line?', choices: ['21', '16', '10', '5'], a: 2, why: 'The cell is 6 dots wide at size 1 and 12 at size 2; 128 / 12 is 10 whole characters.' },
    { q: 'With one of Adafruit GFX\'s extra fonts, setCursor(0, 20) puts the text so that…', choices: ['its top edge is at y = 20', 'its baseline is at y = 20', 'its centre is at y = 20', 'its bottom edge, descenders included, is at y = 20'], a: 1, why: 'The extra fonts are placed by their baseline: letters stand on y = 20 and only descenders (g, y) hang below it. The built-in font is placed by its top.' },
    { q: 'Why does a smooth font cost several times the memory of a bitmap font of the same height?', choices: ['It contains more characters', 'Each dot is stored with about four bits instead of one', 'It is stored as vectors', 'It needs a separate file system'], a: 1, why: 'Smoothing needs grey levels at the edge; four bits per dot gives sixteen. The same glyph therefore takes about four times the bytes before compression.' },
    { q: 'Text at size 3 looks as sharp as a font designed at that height.', a: false, why: 'Size 3 enlarges every dot of the 5 × 7 glyph to a 3 × 3 block, so curves become steps. A font drawn for the larger size has its own dots and looks cleaner.' }
  ],
  applications: [
    'Large digits for a clock or a temperature, from a digits-only font that costs little flash.',
    'Smooth text for menus and labels on a colour touch screen.',
    'A one-line status bar in the built-in font at size 1.',
    'Right-aligned numbers that must not jump around as they change, which a monospaced or measured font makes possible.'
  ],
  sources: [
    'Adafruit, *Adafruit GFX Graphics Library* guide: the default font, text size, and the GFX fonts with their baseline convention.',
    'U8g2 wiki: the font list and font naming (the suffixes for transparent, restricted and full character sets).',
    'LVGL documentation: *Fonts* (bits per pixel of built-in fonts and the font converter).'
  ],
  sim: 'gd-text'
},

/* ================================================================ images-and-icons */
{
  id: 'images-and-icons',
  parent: 'graphic-displays',
  title: 'Images and icons',
  level: 1,
  short: 'A picture is the frame-buffer idea stored in flash instead of RAM. Small icons live as arrays in the program; photographs are kept as compressed files and decoded on the way to the screen. What you choose decides the flash it eats and the time it takes.',
  keywords: ['bitmap', 'icon', 'drawBitmap', 'PROGMEM', 'image2cpp', 'JPEG', 'PNG', 'TJpg_Decoder', 'JPEGDEC', 'PNGdec', 'dithering', 'transparent colour', 'colour key', 'blit', 'RGB565 array', 'logo', 'image converter'],
  prereq: ['pixels-and-framebuffers', 'drawing-primitives'],
  related: ['fonts', 'colour-tft-displays', 'littlefs-and-file-systems', 'sd-cards', 'embedding-files-and-web-pages', 'partition-tables', 'lvgl'],
  body: `A picture on a microcontroller is a block of numbers, exactly like the frame buffer of [[pixels-and-framebuffers]] — only it is kept in flash and copied to the screen when it is wanted. How the picture gets there, and how small you can keep it, is the whole subject.

### Three ways to hold a picture

1. **An array in the program.** A converter turns an image into a C array — \`const uint8_t icon[] PROGMEM = {…}\` — that is compiled into flash, and one call copies it to the screen. Best for icons, logos and a few small pictures.
2. **A file, decoded on the way.** The image sits as a JPEG or PNG in the file system or on an SD card, and a small decoder library unpacks it block by block while it is drawn. Best for photographs and many pictures. Two Arduino libraries for JPEG are TJpg_Decoder and JPEGDEC; PNGdec reads PNG.
3. **Drawn from primitives.** A few lines, circles and rectangles in code. No storage at all, but code, and only for simple shapes.

### What a picture costs

| Picture | Format | Raw size |
|---|---|---|
| Icon 16 × 16 | 1 bit | 32 bytes |
| Icon 32 × 32 | 1 bit | 128 bytes |
| Image 64 × 64 | RGB565 | 8 192 bytes |
| Full screen 240 × 240 | RGB565 | 115 200 bytes |
| Full screen 320 × 240 | RGB565 | 153 600 bytes |

A JPEG of a full 240 × 240 screen is typically a few tens of kilobytes, an order of magnitude smaller than the raw array, but decoding it takes processor time and some RAM. A flash of 4 MB with a program in it holds only a few raw full-screen images, which is why photographs belong on a file system or a card ([[littlefs-and-file-systems]], [[sd-cards]]).

### Making the array

A converter reads a picture file and writes the array: the web tool image2cpp and LVGL's online image converter are two. For a one-bit icon the bytes are rows, left to right, each row padded to whole bytes, the leftmost pixel in the top bit — the form that \`drawBitmap\` and MicroPython's MONO_HLSB buffers both read. A colour image becomes a list of 16-bit RGB565 values; take care with their byte order, as [[pixels-and-framebuffers]] explained.

### Transparent, smaller, dithered

- A one-bit bitmap drawn in one colour touches only its set bits, so the background shows through. For colour images, reserve one colour as a **colour key**, such as magenta, and skip those pixels when drawing.
- **Fewer colours, less flash.** A palette of 256 entries halves a 16-bit image; icons with a handful of colours shrink more.
- **Dithering** turns a photograph into one-bit dots whose density follows the brightness. A dithered picture is recognisable on an OLED or e-paper where simple thresholding gives black blobs. Try the "dither" setting of the simulation.

> [!key] An image is an array of pixels in flash: icons as arrays compiled into the program, photographs as compressed files decoded while drawing. Do the size sum first — 32 bytes for a 16 × 16 icon, 115 200 for a raw 240 × 240 screen — and reduce colours, or dither, before you run out of flash.`,
  ideas: [
    'An image is stored as the same kind of pixel array as a frame buffer, but in flash, and copied to the screen when needed.',
    'Icons are best held as arrays in the program (a 16 × 16 one-bit icon is 32 bytes); photographs as JPEG files on a file system or card, decoded while drawing.',
    'Raw RGB565 is 2 bytes per pixel: a full 240 × 240 image is 115 200 bytes, so only a few fit in flash as arrays.',
    'Dithering and a reduced palette make pictures recognisable and small on one-bit and low-colour displays.'
  ],
  pitfalls: [
    'Pictures can simply be added to the program as arrays — A handful of icons, yes. A few raw full-screen images use up a 4 MB flash and make every upload slow.',
    'drawBitmap with one-bit data paints the zeros in black — It draws only the set bits in the colour you give and leaves the rest alone, unless you use the form of the call that takes a background colour.',
    'A picture that comes out with odd colours is damaged — Usually it is the byte order of the 16-bit values, or the red and blue order. Both are settings of the converter or the library.'
  ],
  terms: [
    { term: 'Bitmap', also: ['raster image', 'pixel array'], def: 'A picture stored as one value per pixel, row by row. One-bit bitmaps pack eight pixels into a byte.' },
    { term: 'PROGMEM', also: ['const data in flash'], def: 'An Arduino keyword that keeps constant data, such as an icon array, in flash memory instead of copying it into RAM at start-up. On the ESP32 constants are read from flash anyway, and the word is accepted for compatibility.' },
    { term: 'Dithering', also: ['halftoning', 'error diffusion'], def: 'Turning a picture with many shades into one with few by placing dots more densely where it is brighter, so that the eye averages them back into grey.' },
    { term: 'Colour key', also: ['transparent colour', 'chroma key'], def: 'One colour value reserved to mean "not drawn". Pixels of that colour are skipped, so a rectangular colour image can have an irregular outline.' },
    { term: 'Image decoder', also: ['JPEG decoder', 'PNG decoder'], def: 'A library that unpacks a compressed image file into pixels, usually a block or a row at a time so that it needs little RAM.' }
  ],
  examples: [
    {
      title: 'How many pictures fit?',
      q: 'About 1 MB of flash is free for pictures. How many full 240 × 240 RGB565 images fit as raw arrays? And how many if each is stored as a 12 KB JPEG?',
      steps: ['One raw image: $240 \\times 240 \\times 2 = 115\\,200$ bytes.', '$1\\,048\\,576 / 115\\,200 \\approx 9.1$: nine images.', 'As JPEG at 12 KB: $1\\,048\\,576 / 12\\,288 \\approx 85$ images — at the price of decoding time and some RAM for every one shown.'],
      a: 'Nine raw images, or about eighty-five JPEGs.'
    }
  ],
  choose: {
    good: ['Arrays in the program for icons, logos and status symbols', 'JPEG files on a file system or card for photographs and many pictures', 'Dithered one-bit pictures for OLEDs and e-paper'],
    avoid: ['Several raw full-screen RGB565 arrays in firmware', 'Decoding large PNG files on a chip with little RAM', 'Scaling a small icon up past recognition: draw a larger one'],
    check: ['The byte order and red-blue order of the 16-bit data', 'Free flash and the partition holding the picture files', 'Whether the library skips a transparent colour or only a background']
  },
  code: [
    {
      title: 'Three heart icons from an array',
      about: 'A 16 × 16 one-bit icon is 32 bytes. The same bytes are drawn with \`drawBitmap\` in C++ and with a small frame buffer in MicroPython; black pixels stay transparent in both.',
      needs: 'The ESP32 DevKit and the 128 × 64 SSD1306 OLED.',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX Library'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
          clear display
          draw image [heart] (16 × 16, 32 bytes) at x (24) y (24)
          draw image [heart] (16 × 16, 32 bytes) at x (56) y (24)
          draw image [heart] (16 × 16, 32 bytes) at x (88) y (24)
          update display
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <Adafruit_GFX.h>
        #include <Adafruit_SSD1306.h>

        Adafruit_SSD1306 display(128, 64, &Wire, -1);

        // 16 x 16 icon, one bit per pixel, rows left to right, leftmost pixel in the top bit
        static const unsigned char PROGMEM heart[] = {
          0x00, 0x00, 0x3C, 0x3C, 0x7E, 0x7E, 0xFF, 0xFF,
          0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F, 0xFE,
          0x3F, 0xFC, 0x1F, 0xF8, 0x0F, 0xF0, 0x07, 0xE0,
          0x03, 0xC0, 0x01, 0x80, 0x00, 0x00, 0x00, 0x00
        };

        void setup() {
          Wire.begin(21, 22);
          display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
          display.clearDisplay();
          for (int x = 24; x <= 88; x += 32) {
            display.drawBitmap(x, 24, heart, 16, 16, SSD1306_WHITE);   // set bits only
          }
          display.display();
        }

        void loop() {}
      `,
      py: String.raw`
        import framebuf
        from machine import I2C, Pin
        import ssd1306

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)

        # 16 x 16 icon, one bit per pixel, rows left to right, leftmost pixel in the top bit
        HEART = bytearray([
            0x00, 0x00, 0x3C, 0x3C, 0x7E, 0x7E, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F, 0xFE,
            0x3F, 0xFC, 0x1F, 0xF8, 0x0F, 0xF0, 0x07, 0xE0,
            0x03, 0xC0, 0x01, 0x80, 0x00, 0x00, 0x00, 0x00])
        icon = framebuf.FrameBuffer(HEART, 16, 16, framebuf.MONO_HLSB)

        oled.fill(0)
        for x in (24, 56, 88):
            oled.blit(icon, x, 24, 0)                # colour 0 is the key: black stays transparent
        oled.show()
      `,
      notes: ['\`drawBitmap(x, y, bitmap, w, h, colour, background)\` also paints the zero bits, in the background colour.', 'For a colour TFT the array holds RGB565 values (two bytes per pixel) and the call is a variant such as \`drawRGBBitmap\`; check the byte order against the library\'s documentation.']
    }
  ],
  quiz: [
    { q: 'How many bytes does a 16 × 16 one-bit icon take?', choices: ['16', '32', '256', '512'], a: 1, why: '16 × 16 = 256 pixels, one bit each: 256 bits, 32 bytes. Each row of 16 pixels is two bytes.' },
    { q: 'How many bytes does a raw 64 × 64 RGB565 image take?', choices: ['2 048', '4 096', '8 192', '12 288'], a: 2, why: '64 × 64 = 4 096 pixels at two bytes each: 8 192 bytes.' },
    { q: 'Why keep photographs as JPEG files on a card instead of raw arrays in the program?', choices: ['JPEG pixels are brighter', 'The compressed file is many times smaller, at the cost of decoding time', 'Arrays cannot be drawn on a TFT', 'The card is faster than flash'], a: 1, why: 'A JPEG is typically an order of magnitude smaller than the raw pixels. The decoder spends processor time and some RAM to unpack it as it draws.' },
    { q: 'What does dithering do when a photograph is shown on a one-bit OLED?', choices: ['Makes the screen brighter', 'Places dots more densely in brighter areas so the eye sees shades of grey', 'Compresses the file', 'Swaps the bytes'], a: 1, why: 'Dots are the only thing a one-bit screen can show. Their density, arranged by a pattern or by error diffusion, stands in for brightness.' }
  ],
  applications: [
    'Status icons — Wi-Fi, battery, bell — in the corner of an OLED, each a few dozen bytes.',
    'A start-up logo stored as an array in the firmware.',
    'Album art or photographs on a colour TFT, decoded from JPEG files on an SD card.',
    'Dithered pictures on e-paper badges and name tags.'
  ],
  sources: [
    'Adafruit, *Adafruit GFX Graphics Library* guide: bitmaps, drawBitmap and drawRGBBitmap.',
    'MicroPython documentation: module *framebuf* (MONO_HLSB, blit with a transparent key colour), version 1.29.',
    'LVGL documentation: *Images* and the image converter (colour formats and transparency).'
  ],
  sim: { id: 'gd-depth', params: { picture: 'icon' } }
},

/* ================================================================ flicker-and-double-buffering */
{
  id: 'flicker-and-double-buffering',
  parent: 'graphic-displays',
  title: 'Flicker, sprites and double buffering',
  level: 2,
  short: 'Flicker is the screen showing a half-finished picture. Clearing the screen and redrawing everything is the surest way to get it; erasing only what moved, or composing off screen and sending the result in one go, are the cures.',
  keywords: ['flicker', 'sprite', 'canvas', 'double buffering', 'tearing', 'TE pin', 'partial update', 'dirty rectangle', 'fillScreen', 'clearDisplay', 'off-screen buffer', 'TFT_eSprite', 'GFXcanvas16', 'refresh', 'redraw'],
  prereq: ['drawing-primitives', 'colour-tft-displays', 'pixels-and-framebuffers'],
  related: ['frame-rate-and-bus-speed', 'using-psram', 'graphics-libraries', 'lvgl', 'presenting-data', 'display-interfaces'],
  body: `Flicker is what you see when the screen shows unfinished work. A display with its own memory shows whatever is in that memory at every moment, and your drawing calls change the memory while the eye is looking at it.

### The cause: clear, then draw

The obvious way to animate is a loop that wipes the screen and draws everything again: \`fillScreen(BLACK)\`, then the background, then the moving parts. On a colour TFT the wipe is not free. It sends as many pixels as a whole frame — about 30 ms for a 320 × 240 panel at 40 MHz SPI — and during it, and during the redrawing that follows, the viewer sees a black or half-drawn screen. If that is a third of each cycle, the picture blinks. The simulation measures the fraction of time the moving object is actually visible.

A buffered OLED library does not have the problem: Adafruit's \`clearDisplay()\` clears the copy in RAM, and the screen changes only when \`display()\` sends the finished picture. That is the idea behind every cure: **draw where nobody looks, then show the result in one go.**

### Three cures

1. **Erase only what moved.** Overwrite the old position of the object with the background, draw the new one, and leave the rest alone. Few pixels are written, so it is fast. For text, draw each character with a background colour, \`setTextColor(fg, bg)\`, and pad numbers with spaces so a shorter value covers a longer one. It works for simple scenes and becomes tedious when objects overlap a busy background.
2. **A sprite (canvas).** Compose the changing region in a buffer in RAM, then send it to the screen with one window write. The panel only ever shows the old region or the new one. The cost is RAM: a 100 × 60 sprite at 16 bits is 12 000 bytes, a full 320 × 240 one 153 600.
3. **Double buffering.** Keep two whole frames: draw into the hidden one while the other is shown, then swap. RGB panels on the ESP32-S3 and P4 do this in hardware, the chip streaming one buffer while the program draws in the other ([[display-interfaces]]); the buffers live in PSRAM.

### What is left: tearing

Even a perfect sprite push has a trap. The panel scans its own memory from top to bottom at about 60 Hz while your transfer writes into it. If the two cross, the top of the screen shows the new picture and the bottom the old one, with a line between: **tearing**, visible in fast horizontal motion. Many controllers have a TE (tearing effect) output that says when it is safe to write; synchronising to it, or writing faster than the panel scans, removes the line. The sweep in the simulation shows where the new picture arrives.


> [!key] Flicker comes from showing unfinished work: clearing a TFT and then redrawing. Erase only what moved, or build the changed region in a sprite and push it in one go, or keep two full frames and swap; and remember that very fast motion can still tear, because the panel scans while you write.`,
  ideas: [
    'A display shows what is in its memory at every moment, so clearing the screen and then redrawing makes the viewer see the blank and half-drawn states.',
    'Buffered libraries such as Adafruit\'s OLED library avoid it by drawing into RAM and sending the finished picture with display().',
    'Cures: erase only what moved; compose in a sprite and push it in one write; or double buffer whole frames, at the price of RAM.',
    'Tearing is a different problem: the panel scans its memory while a new frame is being written, giving a visible line during fast motion.'
  ],
  pitfalls: [
    'A faster SPI clock cures flicker — It shortens it, but the pattern remains: any state shown before the picture is complete is visible. The cure is to change how you draw.',
    'A sprite makes the whole screen update faster — A sprite of the changing region saves time only because it is small. Pushing a full-screen sprite sends a full frame, at the same speed as any full-frame transfer.',
    'Redrawing text with a background colour leaves old digits behind — Only if the new text is shorter. Pad the number with spaces so every update covers the width of the longest one.'
  ],
  terms: [
    { term: 'Flicker', also: ['blinking', 'flashing'], def: 'The visible blinking of a display that is shown in an incomplete state, most often between clearing the screen and finishing the redraw.' },
    { term: 'Sprite', also: ['canvas', 'off-screen buffer', 'TFT_eSprite', 'GFXcanvas'], def: 'A frame buffer in RAM for a part of the picture. The program draws into it freely, then sends it to the screen in one transfer.' },
    { term: 'Double buffering', also: ['page flipping', 'back buffer'], def: 'Keeping two frame buffers: one is shown while the program draws into the other, and then their roles are swapped.' },
    { term: 'Tearing', also: ['screen tearing', 'TE pin'], def: 'A visible horizontal line where the top of the screen shows a new frame and the bottom the old one, because the panel scanned its memory while it was being rewritten.' },
    { term: 'Dirty rectangle', also: ['partial update', 'invalidated area'], def: 'The smallest rectangle that contains everything that has changed since the last update. Sending only that region saves bus time.' }
  ],
  choose: {
    good: ['Erase-and-redraw of the moved part for a counter, a needle or a few sprites', 'A sprite for an area that changes completely each time: a gauge, a graph', 'Hardware double buffering with an RGB panel when PSRAM is available'],
    avoid: ['fillScreen() on every frame of a TFT animation', 'A full-screen sprite on a chip with little RAM', 'Clearing a text line and then writing it, when overwriting with a background colour would do'],
    check: ['How much RAM the sprite needs against what is free', 'Whether the controller has a TE pin you can use', 'That numbers are padded so a shorter value covers the longer one']
  },
  code: [
    {
      title: 'A counter without flicker',
      about: 'Counts up twenty times a second. Switch the constant to see the difference: clearing the whole screen every time makes it blink; drawing the number with a background colour does not.',
      needs: 'The ST7789 240 × 240 module of the colour TFT page on an ESP32 DevKit.',
      wiring: [['GPIO18', 'SCK'], ['GPIO23', 'MOSI'], ['GPIO5', 'CS'], ['GPIO27', 'DC'], ['GPIO26', 'RST'], ['GPIO25', 'BL']],
      libs: ['GFX Library for Arduino (Arduino_GFX)'],
      blocks: `
        when started
          start display [ST7789 240×240 v]
          fill screen with colour [black v]
          set [n v] to (0)
        forever
          show (join [ ] (n)) at x (20) y (100) size (4) colour [white v] on colour [black v]
          change [n v] by (1)
          wait (0.05) seconds
        end
      `,
      cpp: String.raw`
        #include <Arduino_GFX_Library.h>

        Arduino_DataBus *bus = new Arduino_ESP32SPI(27, 5, 18, 23, GFX_NOT_DEFINED);
        Arduino_GFX *gfx = new Arduino_ST7789(bus, 26, 0, true, 240, 240);

        const bool CLEAR_EVERY_TIME = false;       // true: the flickering way

        int n = 0;

        void setup() {
          pinMode(25, OUTPUT);
          digitalWrite(25, HIGH);                  // backlight on
          gfx->begin(40000000);
          gfx->fillScreen(RGB565_BLACK);
          gfx->setTextSize(4);
        }

        void loop() {
          if (CLEAR_EVERY_TIME) gfx->fillScreen(RGB565_BLACK);   // a whole frame of black pixels, every time
          gfx->setTextColor(RGB565_WHITE, RGB565_BLACK);                // each character overwrites its old cell
          gfx->setCursor(20, 100);
          char buf[12];
          snprintf(buf, sizeof buf, "%6d", n++);          // padded: a shorter number covers a longer one
          gfx->print(buf);
          delay(50);
        }
      `,
      py: String.raw`
        import time
        from machine import Pin, SPI
        import st7789
        import vga1_16x32 as font

        CLEAR_EVERY_TIME = False                   # True: the flickering way

        spi = SPI(2, baudrate=40_000_000, sck=Pin(18), mosi=Pin(23))
        tft = st7789.ST7789(spi, 240, 240, reset=Pin(26, Pin.OUT), cs=Pin(5, Pin.OUT),
                            dc=Pin(27, Pin.OUT), backlight=Pin(25, Pin.OUT))
        tft.init()
        tft.fill(st7789.BLACK)

        n = 0
        while True:
            if CLEAR_EVERY_TIME:
                tft.fill(st7789.BLACK)             # a whole frame of black pixels, every time
            # the text call draws its own background colour: each character overwrites its old cell
            tft.text(font, "%6d" % n, 20, 100, st7789.WHITE, st7789.BLACK)   # padded: shorter covers longer
            n += 1
            time.sleep_ms(50)
      `,
      notes: ['The C++ text is size 4 of the 5 × 7 font (24 × 32 dots a character), the Python text uses a 16 × 32 font: the numbers look slightly different, the lesson does not.', 'A sprite version of the same counter would draw "n" into a small off-screen buffer and push it; the libraries compared on the next pages each have their own sprite or canvas class.']
    }
  ],
  quiz: [
    { q: 'Why does "fillScreen, then redraw everything" flicker on a colour TFT?', choices: ['fillScreen turns the backlight off', 'The wipe sends a whole frame of black pixels, and the viewer sees the blank and half-drawn screen meanwhile', 'The controller forgets the picture', 'SPI cannot send colours twice'], a: 1, why: 'The panel shows whatever is in its memory. Between the wipe and the end of the redraw that is not your picture.' },
    { q: 'Why does clearDisplay() in Adafruit\'s SSD1306 library not make the OLED flicker?', choices: ['The OLED is too fast to see', 'It clears the copy in RAM; the screen changes only when display() sends the finished picture', 'OLED pixels hold their state for a second', 'It does nothing'], a: 1, why: 'The library draws in a buffer in the ESP\'s RAM and sends it in one transfer, so the panel never shows an unfinished picture.' },
    { q: 'How much RAM does a 100 × 60 pixel sprite at 16 bits per pixel need?', choices: ['6 000 bytes', '12 000 bytes', '24 000 bytes', '120 000 bytes'], a: 1, why: '100 × 60 = 6 000 pixels at two bytes each: 12 000 bytes.' },
    { q: 'Double buffering removes tearing completely on any SPI display.', a: false, why: 'The panel still scans its own memory at its own pace while your frame is being written into it. The line disappears only if you write faster than the scan, or wait for the controller\'s TE signal.' }
  ],
  applications: [
    'A live counter, clock or reading that updates several times a second without blinking.',
    'A needle gauge in a sprite, pushed to the screen as one block.',
    'Games and animations on colour TFTs, with a sprite for each moving object.',
    'A GUI library keeping partial buffers and sending only the dirty rectangles ([[lvgl]]).'
  ],
  sources: [
    'Bodmer, *TFT_eSPI* library documentation: the TFT_eSprite class (createSprite, pushSprite).',
    'Adafruit, *Adafruit GFX Graphics Library* guide: canvases (GFXcanvas1, GFXcanvas8, GFXcanvas16).',
    'Sitronix, *ST7789V datasheet*: the tearing-effect output and its modes.'
  ],
  sim: 'gd-flicker'
},

/* ================================================================ frame-rate-and-bus-speed */
{
  id: 'frame-rate-and-bus-speed',
  parent: 'graphic-displays',
  title: 'Frame rate and bus speed',
  level: 2,
  short: 'Frames per second is bus bits per second divided by bits per frame. Quote the clock, the resolution and the colour depth, add a few per cent of overhead, and you can say before building whether a screen will feel smooth.',
  keywords: ['frame rate', 'fps', 'SPI clock', 'bus speed', 'bandwidth', 'DMA', 'overhead', 'full-screen refresh', 'partial update', '40 MHz', '80 MHz', 'I2C 400 kHz', 'ILI9488', 'QSPI', 'bits per frame', 'throughput'],
  prereq: ['pixels-and-framebuffers', 'display-interfaces', 'spi-modes-and-speed'],
  related: ['flicker-and-double-buffering', 'graphics-libraries', 'colour-tft-displays', 'oled-ssd1306', 'lvgl', 'peripherals-overview'],
  body: `How fast can a screen be updated? The display keeps its picture in its own memory, and the only way to change it is to push pixels down the bus. So the frame rate is a division: **frames per second = bits per second on the bus ÷ bits in a frame**. Everything that makes a screen feel slow or fast is in that sum.

### The sum

The bits in a frame are width × height × bits per pixel. The bus carries its clock rate in bits per second on a single-lane bus, and more with several lanes. A few per cent of the time goes on commands, addresses and gaps between transfers; the simulation allows five per cent.

| Display and bus | Bits a frame | Frames a second |
|---|---|---|
| OLED 128 × 64, I2C 100 kHz | 8 192 | about 10 |
| OLED 128 × 64, I2C 400 kHz | 8 192 | about 40 |
| TFT 240 × 240, SPI 40 MHz | 921 600 | about 41 |
| TFT 320 × 240, SPI 40 MHz | 1 228 800 | about 31 |
| TFT 320 × 240, SPI 80 MHz | 1 228 800 | about 62 |
| TFT 480 × 320 (ST7796), SPI 40 MHz | 2 457 600 | about 15 |
| TFT 480 × 320 (ILI9488, 24 bits on the wire), SPI 40 MHz | 3 686 400 | about 10 |
| TFT 480 × 320, Quad SPI 40 MHz or 8-bit parallel at 20 MHz | 2 457 600 | about 62 |

(The I2C rows count nine clock periods for each byte, as the I2C protocol has an acknowledge bit.) Notice how little it takes to turn a good screen into a slow one: the ILI9488's 18-bit colour, three bytes a pixel, costs half again as much time as the ST7796.

### Getting more

- **Send less.** Redraw only the part that changed. Updating a tenth of the screen is ten times as fast as the whole; the "portion redrawn" slider shows it.
- **A faster bus.** A higher SPI clock — up to 80 MHz on the default pins, though many modules and long jumper wires fail above 40 MHz — or four lanes, or eight or sixteen parallel bits ([[display-interfaces]]).
- **DMA.** The SPI peripheral can read pixels from memory by itself, so the processor draws the next strip while the last one is still on the wire. Libraries such as LovyanGFX, TFT_eSPI and the ESP-IDF's panel drivers offer it.
- **Fewer bits.** Eight-bit-per-pixel pictures are not accepted by most controllers directly, but a smaller region, or a one-bit OLED, is a fair way to cut the load.

### How fast is fast enough

A reading on a thermostat needs one update a second. A moving needle looks smooth from about 25 frames a second. Scrolling text and games want 30 to 60. Press a button and the screen should answer within about a tenth of a second. Compute the rate your screen can reach first; then decide whether to send less, send faster, or accept the slower rate.

> [!key] Frame rate = bus bits per second ÷ (width × height × bits per pixel), less a few per cent of overhead. About 31 frames a second for 320 × 240 at 16 bits on 40 MHz SPI, about 40 for a 128 × 64 OLED at 400 kHz I2C — and the cheapest speed-up is always to send less.`,
  ideas: [
    'Frames per second = bus bits per second ÷ bits per frame, less a few per cent for commands and gaps.',
    'A 320 × 240 colour screen at 40 MHz SPI manages about 31 full frames a second; a 128 × 64 OLED at 400 kHz I2C about 40, and at 100 kHz only about 10.',
    'Sending only the changed region multiplies the rate by the inverse of its share of the screen; DMA lets the chip draw while the last strip is on the wire.',
    'The ILI9488\'s three bytes per pixel over SPI, and a large screen on a one-lane bus, are the usual causes of a slow-feeling display.'
  ],
  pitfalls: [
    'The SPI clock alone says how fast the screen is — The frame rate also needs resolution and bits per pixel. 40 MHz is 41 frames a second for 240 × 240 and 10 for the 480 × 320 ILI9488.',
    'I2C OLEDs run at 40 frames a second by default — The default clock is 100 kHz: about 10 frames. Raise it to 400 kHz in the program for about 40.',
    'Setting 80 MHz always gives twice the speed of 40 — Only if the module, the wires and the pins allow it. Beyond 40 MHz, long wires and cheap modules often give garbled pictures; the default SPI pins sustain more than remapped ones.'
  ],
  terms: [
    { term: 'Frame rate', also: ['fps', 'frames per second', 'refresh rate'], def: 'How many complete pictures a display shows each second. For a screen with memory, the rate at which the program can rewrite the whole picture is limited by the bus.' },
    { term: 'Bus clock', also: ['SPI clock', 'SCK frequency', 'bus speed'], def: 'The frequency of the clock wire of the bus. For a one-lane bus it is also the number of bits per second sent.' },
    { term: 'DMA', also: ['direct memory access'], def: 'A mechanism by which a peripheral reads or writes memory without the processor: the SPI controller sends a buffer of pixels while the processor does other work.' },
    { term: 'Protocol overhead', also: ['overhead'], def: 'The share of bus time that carries commands, addresses, chip-select changes and gaps instead of pixels. A few per cent on a display bus.' },
    { term: 'Full-screen refresh', also: ['full redraw'], def: 'Sending every pixel of the screen. The time it takes sets the slowest frame period of any display with memory.' }
  ],
  formulas: [
    {
      name: 'Frame rate over a bus',
      expr: 'fps = B/(w*h*b*k)',
      tex: '\\mathrm{fps} = \\frac{B}{w \\, h \\, b \\, k}',
      vars: {
        fps: { name: 'full frames per second', q: 'frequency', unit: 'Hz' },
        B: { name: 'bits per second on the bus (clock × lanes)', q: 'datarate', unit: 'Mbit/s', value: 40 },
        w: { name: 'width in pixels', value: 320, min: 1, int: true },
        h: { name: 'height in pixels', value: 240, min: 1, int: true },
        b: { name: 'bits per pixel on the wire', value: 16, min: 1, max: 32 },
        k: { name: 'overhead factor', value: 1.05, min: 1, max: 2 }
      },
      solveFor: 'fps',
      note: 'The bus rate is clock × number of lanes (four for Quad SPI). The factor k covers commands and gaps; 1.05 is a fair figure for display buses. For a partial update, divide the pixel count by the share of the screen redrawn.',
      stories: { fps: 'A display of {w} × {h} pixels takes {b} bits per pixel over a bus that carries {B}, with an overhead factor of {k}. How many full frames a second?' },
      practice: { unknowns: ['fps', 'B'] }
    }
  ],
  examples: [
    {
      title: 'Can a 3.5-inch screen scroll smoothly?',
      q: 'A 480 × 320 screen is on SPI at 40 MHz. With the ST7796 (16 bits a pixel) or the ILI9488 (24 bits on the wire), how many full frames a second? What if only a fifth of the screen changes, or the clock is 80 MHz?',
      steps: ['ST7796: $40 \\times 10^6 / (480 \\times 320 \\times 16 \\times 1.05) \\approx 15.5$ frames a second.', 'ILI9488: $40 \\times 10^6 / (480 \\times 320 \\times 24 \\times 1.05) \\approx 10.3$ frames a second.', 'A fifth of the screen redrawn multiplies each by five: about 77 and 52 frames a second. An 80 MHz clock (if the wiring allows) doubles them to about 31 and 21 for full frames.'],
      a: 'About 15 (ST7796) and 10 (ILI9488) frames a second for full redraws: scrolling smoothly needs partial updates, a faster bus, or both.'
    }
  ],
  choose: {
    good: ['Partial updates of only the changed regions, whatever the bus', 'The default SPI pins and short wires when pushing the clock to 40 or 80 MHz', 'DMA-capable libraries when the screen is large'],
    avoid: ['A 480 × 320 ILI9488 over plain SPI for animation', 'Assuming a clock the module cannot sustain: test it with a fill', 'Redrawing the whole screen for a number that changes once a second'],
    check: ['Resolution, bits per pixel on the wire and bus clock — all three — before buying', 'Whether the library supports DMA for your chip and bus', 'The rate you really need: one update a second, thirty, or sixty']
  },
  code: [
    {
      title: 'Whole screen against only the square',
      about: 'Moves a square across the screen for two seconds twice: first wiping the whole screen every frame, then erasing only the square\'s old position. The printed frame rates show what "send less" is worth.',
      needs: 'The ST7789 240 × 240 module of the colour TFT page on an ESP32 DevKit.',
      wiring: [['GPIO18', 'SCK'], ['GPIO23', 'MOSI'], ['GPIO5', 'CS'], ['GPIO27', 'DC'], ['GPIO26', 'RST'], ['GPIO25', 'BL']],
      libs: ['GFX Library for Arduino (Arduino_GFX)'],
      blocks: `
        define animate (whole screen)
          set [x v] to (0)
          set [dx v] to (4)
          set [frames v] to (0)
          fill screen with colour [black v]
          set [t0 v] to (milliseconds since start)
          repeat until <((milliseconds since start) - (t0)) ≥ (2000)>
            if <(whole screen) = [yes v]> then
              fill screen with colour [black v]
            else
              draw filled rectangle x (x) y (100) width (40) height (40) colour [black v]
            end
            change [x v] by (dx)
            if <<(x) < (0)> or <(x) > (200)>> then
              set [dx v] to ((0) - (dx))
              change [x v] by ((2) * (dx))
            end
            draw filled rectangle x (x) y (100) width (40) height (40) colour [red v]
            change [frames v] by (1)
          end
          print (join [frames a second: ] (((frames) * (1000)) / ((milliseconds since start) - (t0))))

        when started
          start serial at (115200) baud
          start display [ST7789 240×240 v]
          animate [yes v] :: my
          animate [no v] :: my
      `,
      cpp: String.raw`
        #include <Arduino_GFX_Library.h>

        Arduino_DataBus *bus = new Arduino_ESP32SPI(27, 5, 18, 23, GFX_NOT_DEFINED);
        Arduino_GFX *gfx = new Arduino_ST7789(bus, 26, 0, true, 240, 240);

        // run one animation for two seconds and return its frames per second
        float animate(bool wholeScreen) {
          int x = 0, dx = 4, frames = 0;
          gfx->fillScreen(RGB565_BLACK);
          uint32_t t0 = millis();
          while (millis() - t0 < 2000) {
            if (wholeScreen) gfx->fillScreen(RGB565_BLACK);           // every pixel, every frame
            else gfx->fillRect(x, 100, 40, 40, RGB565_BLACK);         // only the square's old position
            x += dx;
            if (x < 0 || x > 200) { dx = -dx; x += 2 * dx; }   // bounce at the edges
            gfx->fillRect(x, 100, 40, 40, RGB565_RED);
            frames++;
          }
          return frames * 1000.0f / (millis() - t0);
        }

        void setup() {
          Serial.begin(115200);
          pinMode(25, OUTPUT);
          digitalWrite(25, HIGH);                              // backlight on
          gfx->begin(40000000);
          Serial.printf("whole screen redrawn:   %.1f frames a second\n", animate(true));
          Serial.printf("only the square redrawn: %.1f frames a second\n", animate(false));
        }

        void loop() {}
      `,
      py: String.raw`
        import time
        from machine import Pin, SPI
        import st7789

        spi = SPI(2, baudrate=40_000_000, sck=Pin(18), mosi=Pin(23))
        tft = st7789.ST7789(spi, 240, 240, reset=Pin(26, Pin.OUT), cs=Pin(5, Pin.OUT),
                            dc=Pin(27, Pin.OUT), backlight=Pin(25, Pin.OUT))
        tft.init()

        def animate(whole_screen):
            """Run one animation for two seconds and return its frames per second."""
            x, dx, frames = 0, 4, 0
            tft.fill(st7789.BLACK)
            t0 = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), t0) < 2000:
                if whole_screen:
                    tft.fill(st7789.BLACK)                         # every pixel, every frame
                else:
                    tft.fill_rect(x, 100, 40, 40, st7789.BLACK)    # only the square's old position
                x += dx
                if x < 0 or x > 200:                               # bounce at the edges
                    dx = -dx
                    x += 2 * dx
                tft.fill_rect(x, 100, 40, 40, st7789.RED)
                frames += 1
            return frames * 1000 / time.ticks_diff(time.ticks_ms(), t0)

        print("whole screen redrawn:   %.1f frames a second" % animate(True))
        print("only the square redrawn: %.1f frames a second" % animate(False))
      `,
      notes: ['Expect the second figure to be many times the first: 1 600 pixels a frame instead of 57 600. The exact numbers depend on the board, the library and the clock.', 'Add \`gfx->begin(80000000)\` to see how far your module and wiring will go; if the picture breaks up, go back to 40 MHz.']
    }
  ],
  quiz: [
    { q: 'About how many full frames a second does a 320 × 240, 16-bit colour screen reach on 40 MHz SPI?', choices: ['About 3', 'About 12', 'About 31', 'About 120'], a: 2, why: '320 × 240 × 16 = 1 228 800 bits; with 5 % overhead, 40 000 000 / 1 290 240 is about 31.' },
    { q: 'Only a tenth of the screen is redrawn each frame. What happens to the frame rate, other things equal?', choices: ['It stays the same', 'It roughly doubles', 'It rises about tenfold', 'It falls'], a: 2, why: 'A tenth of the pixels is a tenth of the bits on the bus, so ten times as many such updates fit into a second.' },
    { q: 'What is the main reason an ILI9488 screen over SPI updates more slowly than an ST7796 of the same size?', choices: ['It has fewer pixels', 'Its SPI is slower by design', 'It takes 18-bit colour as three bytes per pixel instead of two', 'It uses I2C'], a: 2, why: 'Three bytes against two is 50 % more data for the same picture, so about a third fewer frames a second at the same clock.' },
    { q: 'A 128 × 64 OLED left on the default 100 kHz I2C clock updates at about 40 frames a second.', a: false, why: 'At 100 kHz the sum gives about 10 frames a second; 40 needs the 400 kHz fast mode.' }
  ],
  applications: [
    'Estimating, before buying a screen, whether a scrolling graph or an animation will run smoothly.',
    'Deciding between a faster bus and partial updates for a 3.5-inch dashboard.',
    'Diagnosing a sluggish UI: is it the bus, the drawing, or the touch handling?',
    'Setting the SPI clock of a new module as high as it will reliably go.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Peripherals API: SPI Master driver (clock speed limits for the IO MUX and the GPIO matrix, DMA).',
    'NXP, *UM10204: I2C-bus specification and user manual*: standard and fast mode timing.',
    'Display controller datasheets (ST7789V, ILI9341, ILI9488, ST7796): maximum write clock and pixel formats.'
  ],
  sim: { id: 'gd-framerate', params: { display: 'ili9341-320x240' } }
},

/* ================================================================ graphics-libraries */
{
  id: 'graphics-libraries',
  parent: 'graphic-displays',
  title: 'Graphics libraries compared',
  level: 2,
  short: 'Adafruit GFX, U8g2, TFT_eSPI, LovyanGFX, Arduino_GFX, GxEPD2 and, in MicroPython, framebuf and a few drivers: each is good at something. Pick one library per project, by the display, the speed you need and how well it is kept up to date for your chip.',
  keywords: ['Adafruit GFX', 'U8g2', 'TFT_eSPI', 'LovyanGFX', 'Arduino_GFX', 'GxEPD2', 'framebuf', 'st7789 module', 'M5GFX', 'LVGL', 'display library', 'User_Setup.h', 'page buffer', 'library comparison', 'maintenance'],
  prereq: ['drawing-primitives', 'fonts', 'colour-tft-displays'],
  related: ['lvgl', 'lvgl-display-and-input-drivers', 'flicker-and-double-buffering', 'frame-rate-and-bus-speed', 'm5unified-and-m5gfx', 'e-paper', 'gui-in-micropython'],
  body: `The drawing calls are alike everywhere; what differs is the hardware each library supports, its speed, its memory use, and how you describe your screen to it. State as of October 2026.

### The Arduino libraries

| Library | Good at | Watch out for |
|---|---|---|
| **Adafruit GFX** with a driver (SSD1306, ST7789 …) | The widest hardware support and the simplest code | Slow on big colour screens; one driver library per display |
| **U8g2** | Monochrome displays: OLEDs, e-paper, LCDs; hundreds of fonts; a *page buffer* mode with almost no RAM | Colour is not its subject |
| **TFT_eSPI** | Fast SPI colour TFTs, sprites, smooth fonts, DMA; very widely used | Configured by editing a setup file, not in code; the last tagged release is from March 2024 — fixes for newer cores (3.x) are on the master branch; the newest chips (C6, H2, P4) are not covered |
| **LovyanGFX** | Fast, DMA, many panels and buses; panel and bus described in a class; actively maintained | A larger, more C++ style set-up |
| **Arduino_GFX** | Many panels, also parallel and RGB interfaces; set-up is two constructor lines; actively maintained | Fewer tutorials |
| **GxEPD2** | E-paper: dozens of panels, paged drawing | E-paper only |
| **LVGL** | A complete GUI (widgets, styles, events) on top of any of the above, which only has to copy blocks of pixels | A different, larger subject: [[lvgl]] |

M5Stack boards come with their own M5GFX ([[m5unified-and-m5gfx]]).

### Three differences that matter

- **How the screen is described.** Adafruit and Arduino_GFX: by constructor. U8g2: by a long class name that spells out controller, size, buffer mode and bus. TFT_eSPI: in a setup header outside the program, which breaks when the library is updated unless you use its selection file or build flags. LovyanGFX: in a small class.
- **Memory.** A full frame buffer (U8g2 "F" mode, Adafruit canvases) costs width × height × bits ÷ 8. U8g2's page modes draw in strips of one or two pages — 128 or 256 bytes for a 128 × 64 OLED — running your drawing code once per strip. TFT libraries keep no frame and draw straight into the controller.
- **Speed and DMA.** The libraries differ most on colour screens ([[frame-rate-and-bus-speed]]).

### In MicroPython

The official firmware has **framebuf** (pixels, lines, rectangles, 8 × 8 text, blit) and, from micropython-lib, the **ssd1306** driver. The community **st7789** C module and **LVGL for MicroPython** need a custom firmware build; neither is in the official downloads.

### Choosing

Use **one** graphics library per project; a GUI such as LVGL sits on top of it through a "flush" function. TFT_eSPI with LVGL is a common pair; two drawing libraries on one screen is not.

> [!key] Choose by display and chip: U8g2 for monochrome, Adafruit GFX for simplicity, LovyanGFX or Arduino_GFX for fast, current support of colour panels, TFT_eSPI where its large user base helps and the chip is covered, GxEPD2 for e-paper — and LVGL on top for a real GUI.`,
  ideas: [
    'Libraries differ in the hardware they support, their speed and memory use, and the way the display is described: in code, in a class name, or in a setup header.',
    'U8g2 is the choice for monochrome displays; its page-buffer mode draws in strips and needs 128 bytes instead of 1 KB for an OLED.',
    'TFT_eSPI, LovyanGFX and Arduino_GFX are the fast colour libraries; TFT_eSPI\'s last tagged release is from March 2024 and the newest chips are not covered.',
    'Use one graphics library per project; a GUI library such as LVGL sits on top of one through a flush function.'
  ],
  pitfalls: [
    'TFT_eSPI is the standard, so it is the safe choice for any new chip — It is very widely used, but its last tagged release dates from March 2024 and its README does not cover the C6, H2 or P4. Check the chip against the library, and try LovyanGFX or Arduino_GFX.',
    'Editing User_Setup.h inside the library folder is fine — It works until the library is updated, which overwrites the file. Use the library\'s selection file or build flags so the settings live with your project.',
    'More libraries means more features — Two drawing libraries on one screen fight over the bus and the pins. Pick one; add a GUI library on top.'
  ],
  terms: [
    { term: 'Graphics library', also: ['GFX library', 'display library'], def: 'Code that provides drawing calls — pixels, lines, shapes, text, images — and talks to the display controller. Examples: Adafruit GFX, U8g2, TFT_eSPI, LovyanGFX.' },
    { term: 'Page buffer', also: ['U8g2 page mode', 'firstPage / nextPage'], def: 'A way of drawing a monochrome screen in strips with a small buffer: the drawing code runs once per strip, so RAM use falls to a fraction of a full frame buffer.' },
    { term: 'User_Setup.h', also: ['TFT_eSPI setup', 'User_Setup_Select.h'], def: 'The header in which TFT_eSPI is told the display controller, size and pins. It lives outside the sketch, so it must be kept safe from library updates.' },
    { term: 'Flush callback', also: ['flush_cb', 'flush function'], def: 'The function a GUI library such as LVGL calls to hand over a block of finished pixels. It is where your graphics library or driver sends them to the screen.' }
  ],
  choose: {
    good: ['U8g2 for any monochrome OLED or LCD, and when RAM is short (page buffer)', 'LovyanGFX or Arduino_GFX for fast, currently maintained colour support on new chips', 'TFT_eSPI on ESP32, S2, S3 and C3 where its ecosystem of examples helps'],
    avoid: ['Two drawing libraries on one display', 'TFT_eSPI on the C6, H2 or P4 without checking: they are not covered', 'Keeping the screen settings in the library\'s own folder'],
    check: ['That the library lists your display controller and your chip', 'The release date and the recent activity of the library', 'Whether you need a GUI library on top, and which libraries it supports']
  },
  code: [
    {
      title: 'The same screen in U8g2',
      about: 'Hello, a frame and a bar on the OLED, written with U8g2 in full-buffer mode. Compare it with the Adafruit version of the OLED page: the library, the font names and the baseline are different.',
      needs: 'The ESP32 DevKit and the 128 × 64 SSD1306 OLED on the default I2C pins (GPIO21, GPIO22).',
      wiring: [['GPIO21', 'OLED SDA'], ['GPIO22', 'OLED SCL']],
      libs: ['U8g2'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64 v]
          clear display
          set font [Times 8 pt bold v]
          show [Hello, U8g2] at x (0) y (12)
          draw rectangle x (0) y (20) width (128) height (12)
          draw filled rectangle x (2) y (22) width (60) height (8)
          update display
      `,
      cpp: String.raw`
        #include <U8g2lib.h>

        // F = full buffer (1 KB of RAM) · HW_I2C = the chip's I2C hardware on the default pins
        U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

        void setup() {
          u8g2.begin();
          u8g2.setBusClock(400000);
          u8g2.setFont(u8g2_font_ncenB08_tr);         // a proportional bitmap font
          u8g2.clearBuffer();
          u8g2.drawStr(0, 12, "Hello, U8g2");         // y is the baseline of the text
          u8g2.drawFrame(0, 20, 128, 12);             // x, y, width, height
          u8g2.drawBox(2, 22, 60, 8);
          u8g2.sendBuffer();                          // nothing shows until this call
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin
        import ssd1306

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        oled = ssd1306.SSD1306_I2C(128, 64, i2c)

        oled.fill(0)
        oled.text("Hello, U8g2", 0, 4, 1)           # the built-in 8 x 8 font; y is the top of the text
        oled.rect(0, 20, 128, 12, 1)                # x, y, width, height
        oled.fill_rect(2, 22, 60, 8, 1)
        oled.show()
      `,
      notes: ['U8g2 has no MicroPython version: the Python program does the same with the ssd1306 driver and its fixed font. Only the C++ library offers the hundreds of fonts and the page-buffer mode.', 'On other chips pass the I2C pins through \`Wire.setPins(sda, scl)\` before \`u8g2.begin()\`.']
    },
    {
      title: 'The page-buffer way: 128 bytes of RAM',
      about: 'The same drawing in U8g2 page mode: the screen is drawn one page of eight rows at a time, so the buffer is a single page. The drawing code between firstPage() and nextPage() therefore runs eight times for every picture.',
      needs: 'The same OLED.',
      libs: ['U8g2'],
      blocks: `
        when started
          start I2C on SDA (21) SCL (22)
          start display [SSD1306 128×64, page buffer v]
        forever
          for each [page v] in (the pages of the screen)    // the same drawing runs once per page
            clear display
            show [Page buffer] at x (0) y (12)
            draw rectangle x (0) y (20) width (128) height (12)
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <U8g2lib.h>

        // 1 = one page of the screen in RAM: 128 bytes instead of 1 KB
        U8G2_SSD1306_128X64_NONAME_1_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

        void setup() {
          u8g2.begin();
          u8g2.setFont(u8g2_font_ncenB08_tr);
        }

        void loop() {
          u8g2.firstPage();
          do {                                         // this block runs once for every page
            u8g2.drawStr(0, 12, "Page buffer");
            u8g2.drawFrame(0, 20, 128, 12);
          } while (u8g2.nextPage());
          delay(1000);
        }
      `,
      na: { py: 'MicroPython\'s ssd1306 driver always keeps the full 1 KB buffer, and U8g2 does not exist for MicroPython: the page-buffer mode is a C++ technique.' },
      notes: ['The price of the small buffer is that everything inside the loop is calculated eight times per picture: keep sensor reads and slow work outside it.', 'The suffix \`_2_\` keeps two pages (256 bytes) and halves the number of passes.']
    }
  ],
  quiz: [
    { q: 'A project uses a 128 × 64 OLED on a chip that has very little spare RAM. Which approach saves the most memory?', choices: ['A full-frame canvas in Adafruit GFX', 'U8g2 in page-buffer mode', 'LVGL', 'A second copy of the buffer'], a: 1, why: 'U8g2\'s page modes draw the screen in strips and keep only one or two pages in RAM: 128 or 256 bytes instead of 1 KB.' },
    { q: 'Where does TFT_eSPI learn which controller and pins your display uses?', choices: ['From constructor arguments in the sketch', 'From a setup header (or build flags) outside the sketch', 'From the display itself', 'From the Wi-Fi settings'], a: 1, why: 'The controller, the size and the pins are set in User_Setup.h or a selection file, or by build flags. That keeps them out of the sketch, which is both its convenience and its weakness.' },
    { q: 'What does a GUI library such as LVGL need from the graphics library or driver below it?', choices: ['A Wi-Fi connection', 'A function that writes a block of finished pixels to the screen', 'A second frame buffer in flash', 'Nothing at all'], a: 1, why: 'LVGL draws into its own buffer and calls a flush function to hand over finished blocks. Any library that can write a block of pixels can provide it.' },
    { q: 'TFT_eSPI\'s last tagged release is from March 2024, so fixes for newer cores may be found only on its master branch.', a: true, why: 'The repository still receives fixes — for example DMA on the C3 and S3 under core 3.x — but they come ahead of a numbered release. Check which version your library manager installs.' }
  ],
  applications: [
    'A weather station with an OLED (U8g2) and a colour dashboard (LovyanGFX) in two projects, each with the library suited to its display.',
    'A touch GUI: LVGL on top of TFT_eSPI or LovyanGFX.',
    'A battery e-paper tag with GxEPD2.',
    'Choosing a library for a board from its listing and the library\'s list of supported panels.'
  ],
  sources: [
    'The libraries\' own documentation and repositories: Adafruit GFX, U8g2 (the wiki and reference), TFT_eSPI, LovyanGFX, Arduino_GFX, GxEPD2.',
    'MicroPython documentation: module *framebuf*; micropython-lib: the *ssd1306* driver.',
    'LVGL documentation: *Display interface* (the flush callback) and the Arduino integration notes.'
  ]
},

/* ================================================================ e-paper */
{
  id: 'e-paper',
  parent: 'graphic-displays',
  title: 'E-paper',
  level: 2,
  short: 'E-paper holds its picture with no power, reads well in sunlight and sips energy on a battery — in return it refreshes in seconds, flashes when it does, and leaves faint ghosts when refreshed quickly. It suits pages, not animation.',
  keywords: ['e-paper', 'e-ink', 'E Ink', 'EPD', 'electrophoretic', 'ghosting', 'partial refresh', 'full refresh', 'BUSY pin', 'GxEPD2', 'grey levels', 'tri-colour', 'MagTag', 'Wireless Paper', 'low power display', 'paged drawing', 'hibernate'],
  prereq: ['pixels-and-framebuffers', 'colour-tft-displays', 'deep-sleep'],
  related: ['e-paper-boards', 'battery-life-budget', 'choosing-a-display', 'images-and-icons', 'graphics-libraries', 'frame-rate-and-bus-speed'],
  body: `E-paper (electrophoretic display) is made of microscopic capsules holding charged black and white pigment. An electric field drives the black particles to the surface or the white ones; with the field gone, they stay where they are. The picture therefore needs **no power to be kept**, there is no backlight, and the panel reflects ambient light so it stays readable in the brightest sun.

### What you pay

- **Slow refresh.** A full refresh of a small panel takes one to three seconds and **flashes** the screen black and white several times to reset the pigment; larger panels take longer.
- **Ghosting.** A faster **partial refresh** changes only the pixels that differ, without the flashing, in a fraction of a second — but leaves a faint trace of the old picture, which builds up until a full refresh clears it. The simulation lets you watch it appear.
- **Few shades.** Black and white; some panels add four or sixteen greys; tri-colour panels add red or yellow and refresh much more slowly still.
- **Cold.** The pigment moves more slowly at low temperature: refreshes take longer and look weaker.

### How it connects

An e-paper module talks SPI, with three extra pins: **DC** (command or data), **RST**, and **BUSY**, an output of the panel that stays high while it refreshes. The program must wait for BUSY to drop before it sends anything else. A 2.13-inch panel (250 × 122) has a one-bit frame of about 3.8 KB, a 4.2-inch one (400 × 300) of 15 000 bytes, and an 800 × 480 panel needs 48 000 bytes. Libraries such as GxEPD2 can draw in **pages**, a strip at a time, so that large panels fit in small RAM.

### Making it last

The saving comes from refreshing rarely. Wake from [[deep-sleep]], connect, fetch, draw, refresh once, and sleep again; the picture stays while the chip sleeps at microamps. Datasheets ask for a minimum time between refreshes and for a full refresh at least once a day to keep the pigment from setting; follow your panel's. Do not use a partial refresh every second for a clock face: the ghosting builds up faster than a daily full refresh can clear it, and the panel ages.

### Where it fits

Name badges, shelf labels, calendars, bus and weather boards, a dashboard on a battery for months. Not video, not games, not a menu that must answer a tap in a tenth of a second ([[e-paper-boards]] lists ready-made boards).

> [!key] E-paper keeps its picture with no power and is readable in sunlight, but a full refresh takes seconds and flashes, and partial refreshes leave ghosts. Refresh seldom, sleep between, wait for the BUSY pin, and clear the ghosts with an occasional full refresh.`,
  ideas: [
    'E-paper holds its image without power and reflects ambient light, so it is readable in sunlight and costs energy only while refreshing.',
    'A full refresh of a small panel takes one to three seconds and flashes; a partial refresh is faster and flash-free but leaves ghosts that a full refresh clears.',
    'The module needs SPI plus DC, RST and BUSY; the program must wait for BUSY to go low before sending more.',
    'Refresh rarely and sleep in between: a battery e-paper device can run for months.'
  ],
  pitfalls: [
    'E-paper uses no power — It needs none to hold a picture. A refresh does draw current, and the rest of the board (regulator, chip in sleep) usually dominates the budget.',
    'Partial refresh every second is a fine way to show a clock with seconds — The ghosting builds up quickly and the panel wears. Show minutes, refresh fully now and then, and follow the datasheet\'s limits.',
    'Colour e-paper is just black-and-white e-paper with colour — Tri-colour panels refresh far more slowly and have no usable partial update.'
  ],
  terms: [
    { term: 'E-paper', also: ['electronic paper', 'E Ink', 'electrophoretic display', 'EPD'], def: 'A reflective display in which charged pigment particles are moved by an electric field. The picture stays without power; only changing it needs energy.' },
    { term: 'Ghosting', also: ['image retention', 'residual image'], def: 'A faint trace of a previous picture left on an e-paper screen after a fast refresh. A full refresh clears it.' },
    { term: 'Full refresh', also: ['global update', 'flashing update'], def: 'An update that drives every pixel through black and white to reset the pigment. It takes seconds and gives a clean picture.' },
    { term: 'Partial refresh', also: ['fast refresh', 'partial update', 'windowed update'], def: 'An update that changes only the pixels (or the window) that differ, in a fraction of a second and without flashing, at the price of ghosting.' },
    { term: 'BUSY pin', also: ['BUSY', 'busy line'], def: 'An output of the e-paper module that is high while the panel is refreshing. The program waits for it to fall before sending the next command.' }
  ],
  choose: {
    good: ['Information that changes in minutes or hours: tags, calendars, weather, dashboards', 'Battery devices designed to sleep between updates', 'Outdoor and bright-room readability'],
    avoid: ['Animation, scrolling and fast user interfaces', 'Dark rooms without a front light: there is no backlight', 'A refresh every second or two'],
    check: ['Full and partial refresh times in the panel\'s datasheet', 'Whether the panel supports partial refresh at all (many tri-colour panels do not)', 'The minimum time between refreshes and the full-refresh interval it asks for']
  },
  code: [
    {
      title: 'A counter with partial refreshes',
      about: 'Shows a number every five seconds. It refreshes only a band of the screen — fast, with a little ghosting — and does a full, clean refresh on every tenth update.',
      needs: 'An ESP32 DevKit and a 1.54-inch 200 × 200 e-paper module (the GxEPD2_154_D67 type).',
      wiring: [['GPIO18', 'SCK (CLK)'], ['GPIO23', 'MOSI (DIN)'], ['GPIO5', 'CS'], ['GPIO27', 'DC'], ['GPIO26', 'RST'], ['GPIO25', 'BUSY']],
      libs: ['GxEPD2', 'Adafruit GFX Library'],
      blocks: `
        when started
          start display [e-paper 1.54 inch v]
          set [n v] to (0)
        forever
          change [n v] by (1)
          if <((n) mod (10)) = (1)> then
            set update area to [the whole screen v]    // full refresh: clean, takes seconds
          else
            set update area to x (0) y (60) width (200) height (60)    // partial refresh: fast, ghosts
          end
          show (n) at x (10) y (100)
          update display
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        #include <GxEPD2_BW.h>
        #include <Fonts/FreeSansBold12pt7b.h>

        // CS, DC, RST, BUSY
        GxEPD2_BW<GxEPD2_154_D67, GxEPD2_154_D67::HEIGHT> display(GxEPD2_154_D67(/*CS=*/ 5, /*DC=*/ 27, /*RST=*/ 26, /*BUSY=*/ 25));

        int n = 0;

        void drawNumber(int v) {
          display.firstPage();                         // paged drawing: this block runs once per page
          do {
            display.fillScreen(GxEPD_WHITE);
            display.setCursor(10, 100);
            display.print(v);
          } while (display.nextPage());                // the refresh happens here; the call waits for BUSY
        }

        void setup() {
          display.init(115200);
          display.setRotation(1);
          display.setFont(&FreeSansBold12pt7b);
          display.setTextColor(GxEPD_BLACK);
        }

        void loop() {
          n++;
          if (n % 10 == 1) display.setFullWindow();                       // a clean full refresh now and then
          else display.setPartialWindow(0, 60, display.width(), 60);      // otherwise only a band: fast, a little ghosting
          drawNumber(n);
          delay(5000);
        }
      `,
      na: { py: 'MicroPython has no common e-paper driver: each module needs its maker\'s own driver (usually built on framebuf), and the refresh sequences differ between panels. GxEPD2 is a C++ library.' },
      notes: ['Another panel size or colour type is another GxEPD2 class: choose it from the library\'s display selection list and match the pins to your module.', 'To save energy between updates, put the chip into [[deep-sleep]] instead of delay(), call \`display.hibernate()\` and start again with \`display.init()\` on waking.']
    }
  ],
  quiz: [
    { q: 'Which kind of refresh of an e-paper panel leaves a faint trace of the old picture?', choices: ['Full refresh', 'Partial refresh', 'Neither', 'Both equally'], a: 1, why: 'A partial refresh changes only the pixels that differ and does not reset the pigment, so some of the old picture stays visible. A full refresh drives all pixels through black and white.' },
    { q: 'What does an e-paper panel need in order to keep showing a picture?', choices: ['A small current', 'The BUSY pin held high', 'Nothing: the picture stays with the power off', 'A refresh every minute'], a: 2, why: 'The pigment stays where the field put it. Power is needed only to change the picture.' },
    { q: 'How many bytes does one full frame of a 400 × 300 one-bit panel take?', choices: ['1 500', '15 000', '120 000', '240 000'], a: 1, why: '400 × 300 = 120 000 pixels at one bit each: 15 000 bytes.' },
    { q: 'An e-paper panel is a good display for a clock face that shows seconds.', a: false, why: 'A seconds display means a refresh every second. Ghosting would build up and wear the panel faster than occasional full refreshes can clear it, and a refresh is slower than a second on many panels. Minutes, or a different display, are the answer.' }
  ],
  applications: [
    'Electronic shelf labels and name badges that show a picture for weeks.',
    'A weather or calendar board on a battery: one refresh every few minutes or hours.',
    'Low-power dashboards fed by a sensor network.',
    'The e-paper boards of the family: Adafruit MagTag, Heltec Wireless Paper, LilyGO T-Deck Pro and others ([[e-paper-boards]]).'
  ],
  sources: [
    'GxEPD2 library documentation and examples (display classes, paged drawing, partial windows, hibernate).',
    'Datasheets and application notes of the panel makers (for example Good Display, Waveshare): refresh times, minimum refresh interval and temperature range.',
    'Espressif, *ESP-IDF Programming Guide*, Sleep modes: waking from deep sleep for a periodic refresh.'
  ],
  sim: 'gd-epaper'
},

/* ================================================================ hub75-panels */
{
  id: 'hub75-panels',
  parent: 'graphic-displays',
  title: 'HUB75 LED panels',
  level: 2,
  short: 'The bright full-colour LED panels of video walls and signs, 64 × 32 dots and up, take thirteen signal pins, five volts at up to four amps, and a chip that refreshes them non-stop: the panel itself remembers nothing and has no shades of its own.',
  keywords: ['HUB75', 'LED matrix panel', 'RGB LED panel', 'P2.5', 'P3', 'P4', 'P5', 'pitch', '64x32', '64x64', 'scan rate', '1/16 scan', 'binary code modulation', 'bit planes', 'output enable', 'latch', 'DMA', 'Matrix Portal', 'Protomatter', 'LED sign'],
  prereq: ['pixels-and-framebuffers', 'display-interfaces', 'powering-led-strips'],
  related: ['led-matrices', 'addressable-leds', 'rgb-leds', 'current-peaks-and-capacitors', 'frame-rate-and-bus-speed', 'level-shifters'],
  body: `The big, bright, full-colour panels of scoreboards, bus signs and video walls come as modules of 64 × 32 or 64 × 64 LEDs with a ribbon connector called **HUB75**. They are cheap for their size and astonishingly bright, but they are not smart: a HUB75 panel holds no picture and cannot make a shade of colour by itself. The controller — here, the ESP — must redraw it all the time.

### The thirteen wires

For a common 64 × 32 panel the connector carries: **six colour lines** (R1 G1 B1 for the upper half of the panel, R2 G2 B2 for the lower half), **four address lines** (A to D; a fifth, E, on 64-row panels), and the clock **CLK**, the latch **LAT** and the output enable **OE**. The catalogue's entry of the panel lists the same thirteen pins.

Inside, a chain of shift registers holds one row. The controller clocks in a whole row (for 64 columns, 64 clock pulses with two pixels, upper and lower, per pulse), latches it, sets the row address, and switches the LEDs on with OE. Then the next row. Only a **sixteenth** of the panel is lit at any instant (a "1/16 scan"), so the controller has to cycle through all sixteen row pairs quickly enough that the eye sees a whole picture.

### Shades: bit planes

An LED in a HUB75 panel is simply on or off during a row's turn. To make 256 levels of one colour, the controller shows each row several times per frame, once for every bit of the colour value, and keeps OE on twice as long for each higher bit — **binary-coded modulation**, one "bit plane" at a time. More bits per colour give smoother shades and cost refresh rate and memory, because every bit plane is a full set of row data. The simulation shows the scan, the planes and the refresh rate.

### What the ESP does

The data rate is too high for ordinary pin toggling, so libraries use the chip's parallel output hardware (the I2S in parallel mode on the original ESP32, the LCD interface on the S3) with DMA, streaming the planes from RAM while the processor draws. Libraries for it include the ESP32 HUB75 DMA libraries and Adafruit's Protomatter, used on the Matrix Portal S3 board.

### Power: the part that bites

The catalogue gives up to **4 A at 5 V** for a 64 × 32 panel at full white: 20 W. Real content lights a fraction of the dots, but plan for the worst. Use a proper 5 V supply, feed every panel through thick wire, keep the brightness low for the first test, and never power a panel from the board's USB port. The logic lines are 3.3 V from the ESP; they usually work, and long ribbons or chains of panels may need a buffer ([[level-shifters]]).

> [!key] A HUB75 panel is a bare matrix of LEDs: thirteen signal pins, no memory, no shades. The ESP refreshes it continuously, one pair of rows at a time and one bit plane after another, with DMA — and the supply must be able to give about 4 A per panel at 5 V.`,
  ideas: [
    'A HUB75 panel has no memory and no brightness control of its own: the controller scans it row pair by row pair, over and over.',
    'Thirteen pins carry the signals: six colour lines, four address lines, clock, latch and output enable.',
    'Shades come from binary-coded modulation: each bit of a colour is shown for twice as long as the one below it; more bits cost refresh rate and RAM.',
    'A 64 × 32 panel can draw up to 4 A at 5 V at full white: size the supply, the wires and the first test for that.'
  ],
  pitfalls: [
    'A HUB75 panel is a big NeoPixel matrix — Addressable LEDs hold their colour and need one data pin. A HUB75 panel needs thirteen pins and a controller that refreshes it continuously.',
    'The USB port or the board\'s 5 V pin will power it — A single panel can draw up to 4 A. Power it from its own supply, with thick wires, and bring the grounds together.',
    'More bits of colour are always better — Each extra bit plane lowers the refresh rate and takes more memory. Too low a refresh rate flickers, above all on camera.'
  ],
  terms: [
    { term: 'HUB75', also: ['HUB75E', 'RGB matrix connector'], def: 'The 16-pin ribbon connector and signalling of full-colour LED matrix panels: colour lines for two rows, row address lines, clock, latch and output enable.' },
    { term: 'Scan rate', also: ['1/16 scan', '1/8 scan', 'multiplexing'], def: 'The share of the panel lit at one instant. A 1/16 scan lights one row pair out of sixteen at a time, so the controller must cycle through them all fast enough to look steady.' },
    { term: 'Binary-coded modulation', also: ['BCM', 'bit-plane PWM', 'bit planes'], def: 'A way of making shades from on/off LEDs: each bit of the colour value is shown for twice as long as the bit below it, and the eye adds the light up.' },
    { term: 'Output enable', also: ['OE', 'blanking'], def: 'The HUB75 line that switches the LEDs of the current row on and off. Its on-time per row sets the brightness and the length of each bit plane.' },
    { term: 'Pixel pitch', also: ['P2.5', 'P4', 'P5', 'dot pitch'], def: 'The distance between neighbouring LEDs, in millimetres. A P4 panel has 4 mm between dots; smaller pitch means a sharper picture and a smaller panel for the same number of dots.' }
  ],
  formulas: [
    {
      name: 'Refresh rate limited by the shift clock',
      expr: 'f = 2*fc/(w*h*c*b)',
      tex: 'f = \\frac{2 \\, f_c}{w \\, h \\, c \\, b}',
      vars: {
        f: { name: 'most refreshes of the whole panel per second', q: 'frequency', unit: 'Hz' },
        fc: { name: 'shift clock', q: 'frequency', unit: 'MHz', value: 10 },
        w: { name: 'width of one panel, in pixels', value: 64, min: 1, int: true },
        h: { name: 'height of one panel, in pixels', value: 32, min: 1, int: true },
        c: { name: 'panels chained', value: 1, min: 1, int: true },
        b: { name: 'bits per colour (bit planes)', value: 8, min: 1, max: 12 }
      },
      solveFor: 'f',
      note: 'Two pixels (upper and lower half) move with each clock pulse, so one bit plane takes w × h × c / 2 pulses. This is the ceiling set by shifting data alone; the time the LEDs are on, and the blanking, must fit as well, so real refresh rates are lower.',
      stories: { f: 'A chain of {c} panels of {w} × {h} pixels is shifted at {fc} with {b} bit planes. What is the highest refresh rate that shifting alone allows?' },
      practice: { unknowns: ['f', 'fc'] }
    }
  ],
  examples: [
    {
      title: 'Power for a sign',
      q: 'A sign is made of four 64 × 32 HUB75 panels. The panels can draw up to 4 A each at 5 V. What supply should you plan for, and what do typical pictures need?',
      steps: ['Worst case, all dots white at full brightness: $4 \\times 4\\ \\text{A} = 16$ A at 5 V, which is 80 W.', 'A picture with a quarter of the dots lit, at half brightness, needs very roughly an eighth of that: 2 A to 3 A.', 'Plan the supply, the fuses and the wire for the worst case, or limit the brightness in software to a value the supply can carry.'],
      a: 'Plan for 16 A at 5 V; limit the brightness if the supply is smaller, and wire each panel with thick cable.'
    }
  ],
  choose: {
    good: ['Large, bright signs, clocks and scoreboards seen from a distance', 'Pixel art and video-wall effects with a chip that has parallel output and DMA', 'Boards made for the job, such as the Matrix Portal S3'],
    avoid: ['Battery projects: tens of watts at full white', 'Fine detail close up: the pitch is millimetres', 'Powering a panel from USB or a thin wire'],
    check: ['Panel size, pitch and scan rate (1/16 or 1/8) — the library must be told', 'The supply: 5 V, 4 A per panel in the worst case', 'The refresh rate you get with your bit depth, and how it looks on a phone camera']
  },
  quiz: [
    { q: 'How many signal pins does a 64 × 32 HUB75 panel with a 1/16 scan have?', choices: ['6', '9', '13', '24'], a: 2, why: 'Six colour lines, four address lines (A to D), and the clock, latch and output-enable lines: thirteen.' },
    { q: 'Why does the panel have two sets of colour lines, R1 G1 B1 and R2 G2 B2?', choices: ['For two colours of LED', 'The upper half and the lower half are shifted at the same time, so sixteen row pairs cover 32 rows', 'One set is spare', 'One set is for red-green colour blindness'], a: 1, why: 'Each clock pulse carries a pixel of the upper half and one of the lower half; the address selects row n and row n + 16 together.' },
    { q: 'How are shades of a colour made on a HUB75 panel?', choices: ['The panel has a built-in PWM for each LED', 'The controller shows each bit of the colour for twice as long as the bit below it', 'The LEDs are dimmed by a lower voltage', 'By a second chip on the panel'], a: 1, why: 'The panel only switches LEDs on or off. Binary-coded modulation builds shades from the on-times of the bit planes.' },
    { q: 'A HUB75 panel keeps showing its picture when the controller stops sending data.', a: false, why: 'The panel has no memory. The controller scans it continuously; when it stops, the panel goes dark (or stays on one row).' }
  ],
  applications: [
    'Scoreboards, bus and train signs, and shop displays built from chained panels.',
    'LED clocks and weather displays on the Matrix Portal S3 and similar boards.',
    'Pixel art, music visualisers and games on 64 × 64 panels.',
    'Large status walls for a workshop or a makerspace.'
  ],
  sources: [
    'Datasheets of the shift-register and row-driver chips used on the panels (for example the ICN2037 and FM6126A families) and of the panel modules.',
    'Documentation of the ESP32 HUB75 DMA matrix libraries and of Adafruit Protomatter: wiring, panel types and bit depth.',
    'Espressif, *ESP-IDF Programming Guide*, Peripherals API: I2S parallel (LCD) mode and the LCD_CAM peripheral.'
  ],
  sim: 'gd-hub75'
},

/* ================================================================ backlight-and-power */
{
  id: 'backlight-and-power',
  parent: 'graphic-displays',
  title: 'Backlight and power',
  level: 2,
  short: 'On an LCD the backlight is usually the biggest consumer of the whole module, and a PWM pin dims it. On an OLED every lit dot costs current. Dim, time out and gamma-correct, and a display stops draining the battery.',
  keywords: ['backlight', 'BL pin', 'PWM dimming', 'brightness', 'gamma', 'LEDC', 'screen timeout', 'power consumption', 'OLED current', 'dark mode', 'battery life', 'active low backlight', 'MOSFET', 'dimming frequency', 'flicker'],
  prereq: ['colour-tft-displays', 'oled-ssd1306', 'pwm-with-ledc'],
  related: ['battery-life-budget', 'driving-leds-with-pwm', 'mosfets-for-loads', 'pin-current-limits', 'power-modes', 'e-paper', 'electronics:pwm'],
  body: `A liquid-crystal screen makes no light of its own. White LEDs behind the glass — the **backlight** — do, and on a small colour module they draw tens of milliamps, usually more than everything else on the module together. A screen that stays bright all day empties a battery quickly; a screen that dims and switches off when nobody looks does not.

### Controlling the backlight

The module's **BL** (or LED) pin switches it. Three levels of sophistication:

1. **Held high:** on, at full brightness. The simplest, and the most wasteful.
2. **Switched:** a GPIO turns it on for a few seconds after a touch or a button press and off again.
3. **PWM-dimmed:** the pin carries a fast PWM signal and the duty cycle sets the brightness ([[pwm-with-ledc]]). Hardware PWM on the ESP32 does it without any load on the program.

Most modules already have a small transistor on the BL pin, so a GPIO can drive it; some are active low (backlight on when the pin is low), which a library or the PWM peripheral can invert. A bare backlight that draws more than a GPIO may deliver needs a transistor or MOSFET of its own ([[mosfets-for-loads]], [[pin-current-limits]]).

### Dimming that looks right

The eye does not see light linearly: a backlight at 10 % duty looks about a third as bright as full, not a tenth. Writing the brightness setting straight into the duty makes the lower half of a slider change too fast and the upper half too slowly. **Gamma correction** fixes it: duty = setting raised to a power of about 2.2. The simulation compares the two curves.

**Frequency.** Below a few hundred hertz the flicker is visible, above all on camera; 1 kHz and up looks steady, and 5 kHz is a common choice. Some backlight circuits whine at frequencies one can hear; if so, move above about 20 kHz. Resolution and frequency trade against each other, but 8 bits is easy at any of these.

### OLED: the pixels are the load

An OLED has no backlight; its current follows the number of lit dots and their brightness: the 0.96-inch SSD1306 draws about 20 mA with half the dots lit. A dark theme therefore saves power on an OLED or AMOLED screen — and does nothing on an LCD, whose backlight burns the same behind black pixels.

### Saving the battery

- **Time out:** dim after a few seconds without a touch, switch off after a few more. This one habit saves more than any clever circuit.
- **Lower the peak:** 50 % brightness is plenty indoors.
- **Switch the screen off** while the chip sleeps ([[power-modes]]); the controller keeps its picture only while powered.

> [!key] The backlight dominates an LCD module's power: dim it with PWM, gamma-correct the setting, and time it out. On an OLED the lit dots set the current, so a dark screen is cheap. Both habits matter more than any other saving on a battery gadget.`,
  ideas: [
    'On an LCD module the backlight is usually the largest consumer; the BL pin switches it, or a PWM signal on it dims it.',
    'The eye sees light non-linearly: a 10 % duty looks about a third as bright, so brightness settings need gamma correction (duty = setting to the power 2.2).',
    'Use a PWM frequency of 1 kHz or more to avoid visible flicker; 5 kHz is common, and above 20 kHz if the backlight circuit whines.',
    'An OLED\'s current follows the lit dots, so a dark theme saves power on OLEDs but not on LCDs; a screen timeout saves on both.'
  ],
  pitfalls: [
    'A dark theme saves battery on any screen — Only on OLED and AMOLED. An LCD backlight shines at full power behind black pixels.',
    'I can wire the backlight pin straight to a GPIO — Only if the module has its own transistor, as most do. A bare backlight takes more current than a pin should give: use a transistor or MOSFET.',
    'Linear PWM gives linear brightness — The eye is roughly logarithmic: the first few per cent of duty look like a big step and the top half hardly changes. Apply gamma correction.'
  ],
  terms: [
    { term: 'Backlight', also: ['BL pin', 'LED pin', 'LED-A / LED-K'], def: 'The white LEDs behind an LCD that make the light. Switched or dimmed through the BL pin of the module, often by a transistor on the module itself.' },
    { term: 'PWM dimming', also: ['duty-cycle dimming', 'LEDC backlight'], def: 'Lowering the average brightness by switching the backlight on and off fast: the share of time it is on (the duty cycle) sets the brightness.' },
    { term: 'Gamma correction', also: ['gamma', 'perceptual dimming'], def: 'Mapping a brightness setting to a duty cycle with a power law (about 2.2) so that equal steps of the setting look like equal steps of brightness.' },
    { term: 'Screen timeout', also: ['auto-dim', 'inactivity timer'], def: 'Dimming and then switching off the backlight after a period without input, the biggest single saving on battery devices with a display.' }
  ],
  formulas: [
    {
      name: 'Battery life of the backlight alone',
      expr: 'T = C/(I*d*s)',
      tex: 'T = \\frac{C}{I \\, d \\, s}',
      vars: {
        T: { name: 'hours until the cell is empty (backlight only)', q: 'time', unit: 'h' },
        C: { name: 'usable battery capacity', q: 'charge', unit: 'mA·h', value: 1000 },
        I: { name: 'backlight current at full brightness', q: 'current', unit: 'mA', value: 40 },
        d: { name: 'duty cycle (brightness)', q: 'ratio', unit: '', value: 0.5, min: 0.01, max: 1 },
        s: { name: 'share of time the backlight is on', q: 'ratio', unit: '', value: 0.25, min: 0.001, max: 1 }
      },
      solveFor: 'T',
      note: 'Only the backlight is counted: the processor and radio add their own. A module\'s own figure is in its datasheet or the seller\'s listing; tens of milliamps is common for small colour screens. The average current is I × d × s.',
      stories: { T: 'A {C} cell feeds a backlight that draws {I} at full brightness, run at a duty cycle of {d}, and switched on for a share {s} of the time. How long does the backlight alone last?' },
      practice: { unknowns: ['T', 's'] }
    }
  ],
  choose: {
    good: ['PWM dimming at 1 kHz or more with gamma correction', 'A screen timeout on every battery project', 'An OLED or e-paper where long dark or still periods are common'],
    avoid: ['Full-brightness backlight held on all day', 'Dimming below a few hundred hertz', 'Driving a bare backlight from a GPIO'],
    check: ['Whether the BL pin is active high or low, and whether the module has a transistor', 'The backlight current in the module\'s datasheet', 'That the dimming frequency is silent and flicker-free on camera']
  },
  code: [
    {
      title: 'Dim the backlight in even steps',
      about: 'Sets the backlight from 0 to 100 % in steps of ten, once with the setting written straight into the duty cycle and once with gamma correction applied. Watch the module: the corrected steps look even.',
      needs: 'An ESP32 DevKit and a TFT module whose BL pin is on GPIO25.',
      wiring: [['GPIO25', 'BL (backlight)', 'through the module\'s transistor']],
      blocks: `
        when started
          start serial at (115200) baud
          set PWM on pin (25) frequency (5000) resolution (8)
        forever
          for each [p v] in (numbers from (0) to (100) in steps of (10))
            set PWM on pin (25) to (round ((255) * ((p) / (100))))
            print (join [linear: ] (p) [ %])
            wait (0.5) seconds
          end
          for each [p v] in (numbers from (0) to (100) in steps of (10))
            set PWM on pin (25) to (round ((255) * (((p) / (100)) ^ (2.2))))
            print (join [gamma corrected: ] (p) [ %])
            wait (0.5) seconds
          end
        end
      `,
      cpp: String.raw`
        const int BL_PIN = 25;
        const int BL_FREQ = 5000;              // Hz: well above visible flicker
        const int BL_BITS = 8;                 // duty 0 to 255, fine on every chip at 5 kHz
        const float GAMMA = 2.2;

        // brightness as the eye should see it, 0 to 100 %
        void setBrightness(int percent, bool corrected) {
          float level = constrain(percent, 0, 100) / 100.0f;
          if (corrected) level = pow(level, GAMMA);        // duty that looks like "percent"
          ledcWrite(BL_PIN, (int)(255 * level + 0.5f));
        }

        void setup() {
          Serial.begin(115200);
          ledcAttach(BL_PIN, BL_FREQ, BL_BITS);
        }

        void loop() {
          for (int pass = 0; pass < 2; pass++) {
            for (int p = 0; p <= 100; p += 10) {
              setBrightness(p, pass == 1);
              Serial.printf("%s: %d %%\n", pass ? "gamma corrected" : "linear", p);
              delay(500);
            }
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        bl = PWM(Pin(25), freq=5000, duty_u16=0)   # 5 kHz: well above visible flicker
        GAMMA = 2.2

        def set_brightness(percent, corrected):
            """Brightness as the eye should see it, 0 to 100 %."""
            level = min(max(percent, 0), 100) / 100
            if corrected:
                level = level ** GAMMA             # duty that looks like "percent"
            bl.duty_u16(int(65535 * level))

        while True:
            for corrected in (False, True):
                for p in range(0, 101, 10):
                    set_brightness(p, corrected)
                    print(("gamma corrected" if corrected else "linear") + ": %d %%" % p)
                    time.sleep_ms(500)
      `,
      notes: ['If the backlight is active low, invert the output: \`ledcOutputInvert(BL_PIN, true)\` in C++, \`PWM(Pin(25), invert=1)\` in MicroPython.', 'Some libraries and boards (M5Stack, LilyGO) have their own brightness call; it does the same job with the same frequency and gamma considerations.']
    }
  ],
  examples: [
    {
      title: 'What the screen does to the battery',
      q: 'A handheld has a 1 000 mAh cell and a backlight drawing 40 mA at full brightness. How long does the backlight alone last if it is at full brightness all the time, and if it runs at half brightness but is on for a quarter of the time (a timeout)?',
      steps: ['Full brightness, always on: $1000 / 40 = 25$ hours.', 'Half brightness, a quarter of the time: average current $40 \\times 0.5 \\times 0.25 = 5$ mA.', '$1000 / 5 = 200$ hours — eight times longer, from two software habits.'],
      a: '25 hours against 200 hours: dimming and a timeout multiply the backlight\'s life by eight.'
    }
  ],
  quiz: [
    { q: 'Which display type does a dark user-interface theme save battery on?', choices: ['An LCD with a backlight', 'An OLED', 'Both equally', 'Neither'], a: 1, why: 'An OLED dot that is off draws no current. An LCD backlight shines behind black pixels just as brightly as behind white ones.' },
    { q: 'A backlight draws 40 mA at full brightness and runs at a duty cycle of 25 %. What is the average current?', choices: ['4 mA', '10 mA', '25 mA', '40 mA'], a: 1, why: 'The average current of a PWM-dimmed load is the full current times the duty cycle: 40 mA × 0.25 = 10 mA.' },
    { q: 'Why is a brightness setting corrected with a power of about 2.2 before it becomes a PWM duty cycle?', choices: ['The PWM peripheral is not linear', 'The eye responds to light roughly logarithmically, so equal steps of duty do not look equal', 'It saves power', 'It raises the PWM frequency'], a: 1, why: 'A duty of 10 % looks about a third as bright as full. Raising the setting to the power 2.2 spreads the visible steps evenly over the slider.' },
    { q: 'A PWM frequency of 100 Hz is a good choice for a backlight.', a: false, why: '100 Hz is in the range where flicker can be seen, especially in peripheral vision and on camera. 1 kHz and above looks steady; 5 kHz is common.' }
  ],
  applications: [
    'A thermostat or handheld that dims after ten seconds and wakes on a touch.',
    'A brightness slider in a settings screen, with the gamma curve behind it.',
    'A battery e-paper or OLED tag where the display is dark or still most of the time.',
    'Estimating the battery life of a device from its screen before the first prototype ([[battery-life-budget]]).'
  ],
  sources: [
    'Arduino core for ESP32 documentation: *LEDC* API (ledcAttach, ledcWrite, ledcOutputInvert), core 3.3.',
    'MicroPython documentation: class *machine.PWM*, version 1.29.',
    'Solomon Systech, *SSD1306 datasheet*: current consumption and the contrast control.'
  ],
  sim: 'gd-backlight'
},

/* ================================================================ round-and-odd-displays */
{
  id: 'round-and-odd-displays',
  parent: 'graphic-displays',
  title: 'Round and unusual displays',
  level: 2,
  short: 'A round screen is still a square of memory with the corners cut off: a fifth of the pixels you pay for are never seen, and text near the edge is clipped. Round, bar and tiny panels need layouts made for their shape — and settings for their offsets and rotation.',
  keywords: ['round display', 'circular display', 'GC9A01', 'ST77916', 'SH8601', 'AMOLED round', 'bar display', 'tiny OLED', '0.42 inch', 'watch display', 'safe area', 'chord', 'rotation', 'offset', 'aspect ratio', 'M5Dial', 'T-Watch', 'smart knob'],
  prereq: ['colour-tft-displays', 'drawing-primitives', 'display-interfaces'],
  related: ['presenting-data', 'hmi-design-rules', 'lvgl', 'touch-calibration-and-rotation', 'wearables-and-handhelds', 'touch-display-boards'],
  body: `Round displays are everywhere on gadgets that want to look like watches, dials and knobs: the M5Dial, many smart-watch boards, round AMOLED modules. To the program a round screen is not round at all: it is the same rectangular grid of memory, drawn on a glass whose corners are missing.

### What round costs

A 240 × 240 round screen (the GC9A01 module, 1.28 inch) has a frame buffer of 115 200 bytes like any other 240 × 240 screen, but the visible disc covers only $\\pi/4$ of the square: **78.5 %**. A fifth of the pixels, of the memory and of the bus time go to corners nobody sees, unless the library knows to skip them. Larger round panels follow the same rule: 360 × 360 on a 1.85-inch ST77916 module, 466 × 466 on a 1.43-inch round AMOLED, many of them over Quad SPI ([[display-interfaces]]).

### Laying out for a circle

- **Content near the edge is clipped.** The visible width of a row at distance *d* from the centre is a **chord**: $2\\sqrt{r^2 - d^2}$. On a 240-pixel disc a row 20 pixels from the top is only about 133 pixels wide, and one 5 pixels from the top about 68. A title put in the top-left corner disappears.
- **The safe square.** Everything inside the inscribed square, of side $r\\sqrt{2}$ — about 170 pixels on a 240-pixel disc — is certain to be visible. Put text and buttons there.
- **Use the rim.** What round does well is a ring: arcs for progress, ticks for time, a needle for a dial. Draw those near the edge and keep numbers in the middle. The simulation lets you slide a label and see how much of it survives.

### Other odd shapes

- **Bar displays.** Panels such as 180 × 640 or 76 × 284 have an extreme aspect ratio. Their controller is often native in one orientation and expects you to rotate; lay out for a strip, not a screen.
- **Tiny screens.** The 0.42-inch 72 × 40 OLED is a window into a 128 × 64 memory: the driver needs an **offset**. The 240 × 135 TFT likewise sits inside a 240 × 320 memory.
- **Rounded-corner squares** ("square-round" panels, 360 × 360) lose only a little at each corner: keep touch targets out of them.
- **Micro-displays** for glasses and viewfinders are small and often only a window of a larger memory.

### Rotation and touch

Controllers can rotate the picture in hardware by changing the order in which memory is written; libraries expose it as \`setRotation()\`. Touch panels have their own axes, which must be flipped or swapped to match ([[touch-calibration-and-rotation]]). Settle rotation first, then draw.

> [!key] A round display is a rectangle of memory with its corners cut off: 78.5 % of the pixels are seen, text near the rim is clipped, and the safe area is the inscribed square. Draw rings and dials at the edge, put readings in the middle, and set rotation and offsets before anything else.`,
  ideas: [
    'A round display has a rectangular frame buffer: the disc shows π/4, about 78.5 %, of the pixels, and the rest of the memory and bus time is wasted on corners.',
    'The visible width of a row is a chord, 2√(r² − d²): near the top and bottom of the disc rows are short, so keep text and buttons in the middle.',
    'The inscribed square, of side r√2 (about 170 pixels on a 240-pixel disc), is always visible: the safe area for content.',
    'Bar, tiny and rounded-corner panels need an offset, a rotation, or a layout of their own shape.'
  ],
  pitfalls: [
    'A round display has fewer pixels to store — The buffer is still the whole square: 115 200 bytes for 240 × 240 at 16 bits. Only the area you see is smaller.',
    'The disc is as wide as the square at every row — Only at the middle. Near the top the row is a short chord: a title at the top-left corner is cut off.',
    'The picture of a small OLED or bar panel is wrong because the screen is faulty — Usually the driver needs the panel\'s offset, size and rotation; the controller memory is larger than the visible window.'
  ],
  terms: [
    { term: 'Round display', also: ['circular display', 'GC9A01', 'watch display'], def: 'A display whose visible area is a disc, driven as a square of memory: the pixels in the corners exist but are never seen.' },
    { term: 'Safe area', also: ['inscribed square', 'visible area'], def: 'The part of a round screen that is always visible: the square inscribed in the disc, with a side of about 71 % of its diameter.' },
    { term: 'Chord', also: ['visible row width'], def: 'The width of a row of a round screen at a given distance from the centre: 2√(r² − d²). It shrinks towards the top and bottom edges.' },
    { term: 'Display rotation', also: ['setRotation', 'MADCTL'], def: 'Turning the picture by multiples of 90° by changing the order in which the controller writes its memory, so that a panel can be used in portrait or landscape.' },
    { term: 'Panel offset', also: ['window offset', 'column and row offset'], def: 'The position of the visible panel inside the controller\'s larger memory. A driver that ignores it shifts the picture or shows noise at an edge.' }
  ],
  examples: [
    {
      title: 'How much of a label survives?',
      q: 'A 240-pixel round display. A label 120 pixels wide is centred horizontally with its centre line 20 pixels from the top edge. How wide is the visible row at that height, and is the whole label visible?',
      steps: ['The row is 100 pixels above the centre (the centre is at 120): $d = 100$, $r = 120$.', 'The chord is $2\\sqrt{120^2 - 100^2} = 2\\sqrt{4400} \\approx 133$ pixels.', 'The label is 120 pixels wide and centred, so its ends are 60 pixels from the centre line; the row reaches 66 pixels to each side. The label just fits on that row — but the rows above it are narrower, so the top edge of a tall label is clipped.'],
      a: 'The visible row is about 133 pixels wide, so a 120-pixel label fits at its centre line, but a label of any height loses its top corners.'
    }
  ],
  choose: {
    good: ['Dials, clocks, knobs and watches, where the circle is the design', 'Rings, arcs and needles at the rim with numbers in the middle', 'Boards that already include the round panel: offsets and rotation are known'],
    avoid: ['Long lines of text or dense menus', 'Content or touch targets in the corners of the square', 'Assuming the buffer shrinks to the disc'],
    check: ['The controller, resolution and bus (many round panels are QSPI)', 'The panel offset and rotation for your library', 'That your GUI library can clip to a circle, so as not to draw unseen corners']
  },
  code: [
    {
      title: 'A clock face with a seconds hand',
      about: 'Draws twelve tick marks around the rim of a 240-pixel round screen and moves a seconds hand once a second. The hand is erased by drawing it again in black, so only a few pixels are rewritten.',
      needs: 'An ESP32 DevKit and a 1.28-inch 240 × 240 round GC9A01 SPI module.',
      wiring: [['GPIO18', 'SCL (SCK)'], ['GPIO23', 'SDA (MOSI)'], ['GPIO5', 'CS'], ['GPIO27', 'DC'], ['GPIO26', 'RST'], ['GPIO25', 'BLK (backlight)']],
      libs: ['GFX Library for Arduino (Arduino_GFX)'],
      blocks: `
        define hand (sec) (colour)
          set [a v] to (radians (((sec) * (6)) - (90)))
          draw line from x (120) y (120) to x ((120) + ((98) * (cos of (a)))) y ((120) + ((98) * (sin of (a)))) colour (colour)

        when started
          start display [GC9A01 240×240 round v]
          fill screen with colour [black v]
          for each [i v] in (numbers from (0) to (11))
            set [a v] to (radians (((i) * (30)) - (90)))
            draw line from x ((120) + ((106) * (cos of (a)))) y ((120) + ((106) * (sin of (a)))) to x ((120) + ((118) * (cos of (a)))) y ((120) + ((118) * (sin of (a)))) colour [white v]
          end
          set [sec v] to (0)
        forever
          hand (sec) [black v] :: my
          set [sec v] to (((sec) + (1)) mod (60))
          hand (sec) [white v] :: my
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <Arduino_GFX_Library.h>

        Arduino_DataBus *bus = new Arduino_ESP32SPI(27, 5, 18, 23, GFX_NOT_DEFINED);
        Arduino_GFX *gfx = new Arduino_GC9A01(bus, 26, 0, true);    // bus, reset, rotation, IPS

        const int CX = 120, CY = 120, R = 118;       // centre and radius of the visible disc

        // the seconds hand: 6 degrees a second, 0 s at 12 o'clock; screen y points down
        void hand(int sec, uint16_t colour) {
          float a = radians(sec * 6 - 90);
          gfx->drawLine(CX, CY, CX + (R - 20) * cos(a), CY + (R - 20) * sin(a), colour);
        }

        int sec = 0;

        void setup() {
          pinMode(25, OUTPUT);
          digitalWrite(25, HIGH);                    // backlight on
          gfx->begin();
          gfx->fillScreen(RGB565_BLACK);
          for (int i = 0; i < 12; i++) {             // twelve ticks near the rim
            float a = radians(i * 30 - 90);
            gfx->drawLine(CX + (R - 12) * cos(a), CY + (R - 12) * sin(a),
                          CX + R * cos(a), CY + R * sin(a), RGB565_WHITE);
          }
        }

        void loop() {
          hand(sec, RGB565_BLACK);                          // erase the old hand
          sec = (sec + 1) % 60;
          hand(sec, RGB565_WHITE);                          // draw the new one
          delay(1000);
        }
      `,
      py: String.raw`
        import math, time
        from machine import Pin, SPI
        import gc9a01                                # a community driver, built into a custom firmware

        spi = SPI(2, baudrate=40_000_000, sck=Pin(18), mosi=Pin(23))
        tft = gc9a01.GC9A01(spi, dc=Pin(27, Pin.OUT), cs=Pin(5, Pin.OUT),
                            reset=Pin(26, Pin.OUT), backlight=Pin(25, Pin.OUT), rotation=0)
        tft.init()
        tft.fill(gc9a01.BLACK)

        CX, CY, R = 120, 120, 118                    # centre and radius of the visible disc

        def hand(sec, colour):
            """The seconds hand: 6 degrees a second, 0 s at 12 o'clock; screen y points down."""
            a = math.radians(sec * 6 - 90)
            tft.line(CX, CY, int(CX + (R - 20) * math.cos(a)), int(CY + (R - 20) * math.sin(a)), colour)

        for i in range(12):                          # twelve ticks near the rim
            a = math.radians(i * 30 - 90)
            tft.line(int(CX + (R - 12) * math.cos(a)), int(CY + (R - 12) * math.sin(a)),
                     int(CX + R * math.cos(a)), int(CY + R * math.sin(a)), gc9a01.WHITE)

        sec = 0
        while True:
            hand(sec, gc9a01.BLACK)                  # erase the old hand
            sec = (sec + 1) % 60
            hand(sec, gc9a01.WHITE)                  # draw the new one
            time.sleep(1)
      `,
      notes: ['The hand is 98 pixels long and the ticks start at 106: the hand never touches the ticks, so erasing it in black leaves them whole.', 'The MicroPython \`gc9a01\` module is a community driver that needs a custom firmware build, like the st7789 one; check its README for the exact constructor of your version. The time here comes from a one-second delay: for a real clock use the RTC or NTP ([[ntp-and-time]]).']
    }
  ],
  quiz: [
    { q: 'What fraction of the pixels of a 240 × 240 round display is visible?', choices: ['50 %', 'About 78.5 %', 'About 90 %', '100 %'], a: 1, why: 'The disc has area $\\pi r^2$ and the square $(2r)^2$: the ratio is $\\pi/4 \\approx 0.785$.' },
    { q: 'How wide is the visible row of a 240-pixel round display 20 pixels from the top edge?', choices: ['240 pixels', '180 pixels', 'About 133 pixels', 'About 60 pixels'], a: 2, why: 'The row is 100 pixels from the centre, so the chord is $2\\sqrt{120^2 - 100^2} \\approx 133$ pixels.' },
    { q: 'Why does a 240 × 240 round display still need a 115 200-byte frame buffer?', choices: ['It does not: it needs about 90 000', 'The buffer is a rectangle; only the visible area is round', 'Round panels use 24 bits per pixel', 'The library doubles it'], a: 1, why: 'The controller\'s memory and the library\'s buffer are rectangular. 240 × 240 × 2 bytes = 115 200, whatever the shape of the glass.' },
    { q: 'A square of 170 pixels centred on a 240-pixel round display is entirely visible.', a: true, why: 'The inscribed square has a side of $240/\\sqrt{2} \\approx 170$ pixels: its corners just touch the rim.' }
  ],
  applications: [
    'Smart knobs and dials such as the M5Dial: a rim of ticks, a value in the middle.',
    'Watch faces and fitness gadgets on round AMOLED boards.',
    'Round gauges (temperature, speed, level) for a dashboard.',
    'Bar displays for a single line of status text, and the tiny 0.42-inch OLED on small ESP32-C3 boards.'
  ],
  sources: [
    'Galaxycore, *GC9A01 datasheet*, and the datasheets of the ST77916 and SH8601 round-panel controllers: memory size, window and rotation commands.',
    'LVGL documentation: *Displays* — rotation, and drawing on round displays.',
    'Arduino_GFX documentation: the round and AMOLED panel classes and their offsets.'
  ],
  sim: 'gd-round'
}
);
