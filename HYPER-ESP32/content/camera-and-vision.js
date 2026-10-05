/* HYPER-ESP32 · content/camera-and-vision.js
 *
 * Cameras and vision (topic code: cv). Chip and board facts come from the catalogue (camera interfaces per chip, the
 * AI-Thinker, Freenove and XIAO pin maps, read on 2026-10-04). The camera driver is Espressif's esp32-camera component,
 * which API-CRIB.md does not cover: its calls follow the component's own examples and the pages say so. Official
 * MicroPython has no camera module, so every program here marks the MicroPython version as not available.
 */
Hyper.add(
/* ================================================================ camera-interfaces */
{
  id: 'camera-interfaces',
  parent: 'camera-and-vision',
  title: 'Camera interfaces: DVP and MIPI-CSI',
  level: 2,
  short: 'A camera sensor hands the chip a stream of pixels. Small ESP32 cameras do it over a parallel bus of about fourteen wires (DVP); the ESP32-P4 adds the serial MIPI-CSI link and an image processor. The interface decides which chips can have a camera at all.',
  keywords: ['DVP', 'MIPI-CSI', 'CSI-2', 'PCLK', 'VSYNC', 'HREF', 'XCLK', 'SCCB', 'pixel clock', 'camera pins', 'ISP', 'image signal processor', 'I2S camera mode', 'LCD_CAM', 'Y2', 'camera bus', 'frame', 'parallel camera'],
  prereq: ['parallel-interfaces', 'i2c', 'peripherals-overview'],
  related: ['esp32-cam-boards', 'camera-sensors', 'the-esp32-camera-driver', 'soc-esp32-s3', 'soc-esp32-p4', 'i2s', 'gpio-matrix-and-io-mux', 'camera-and-audio-kits'],
  body: `A camera sensor is a chip that turns light into numbers. The harder part is getting the numbers to the microcontroller: a modest 640 × 480 picture is 307,200 pixels, and a video needs a new one every few tens of milliseconds. The ESP32 family meets that with two kinds of link, and which one a chip has settles whether it can have a camera at all.

### The parallel link (DVP)

The sensor sends each pixel as a byte on **eight data lines**, timed by a **pixel clock** that the sensor itself produces. Four more wires frame the data:

- **PCLK**, the pixel clock. The chip reads the data lines on one edge of every PCLK pulse.
- **VSYNC** marks a new frame: it changes once per picture.
- **HREF** is high while a line of pixels is being sent, and low in the gap between lines.
- **XCLK** runs the other way: the chip must *give* the sensor a clock, commonly 20 MHz, or the sensor does not work at all.
- **SIOD and SIOC** are a two-wire control bus, close to I2C, through which the chip sets resolution, exposure and output format. A power-down pin (PWDN) and sometimes a reset pin complete the set.

Eight data, PCLK, VSYNC, HREF, XCLK and the control pair make **fourteen wires**; with power-down fifteen, which is why a camera board has so few free pins. A colour pixel in RGB565 takes two bytes and so two clock pulses; a JPEG-producing sensor sends the finished compressed file as bytes in bursts. The simulation below draws the signals for a tiny frame.

### Which chips have it

| Chip | Camera interface (catalogue) |
|---|---|
| ESP32 | DVP, through its I2S peripheral |
| ESP32-S2 | DVP 8 or 16 bit, through I2S |
| ESP32-S3 | DVP 8 to 16 bit |
| ESP32-S31 | DVP 8 or 16 bit |
| ESP32-P4 | MIPI-CSI with an image signal processor, and DVP |
| C2, C3, C5, C6, C61, H2 | none |

On the original ESP32 the camera takes over one of its two I2S blocks, so audio must use the other. The C-series cannot have a camera on its own pins: there is nothing to read eight parallel lines at pixel-clock speed.

### MIPI-CSI on the ESP32-P4

MIPI CSI-2 is the link of phone cameras: a pair of wires for the clock and one or two pairs for data, each carrying a fast differential signal, in place of fourteen single wires. The P4 boards in the catalogue show a two-lane connector. The sensors behind it usually send raw data, so the P4 has an **image signal processor** that turns it into a finished picture: demosaicing, white balance, colour and gamma. A DVP sensor does all that inside itself and sends YUV, RGB or JPEG.

### What it costs

The sensor needs clean rails of its own, often 2.8 V and 1.5 V, so camera boards carry extra regulators. Keep the clock and data wires short ([[parallel-interfaces]]).

> [!key] A DVP camera is fourteen or fifteen wires: eight data, a pixel clock from the sensor, VSYNC, HREF, a clock to the sensor and a control bus. The ESP32, S2 and S3 have it, the P4 adds MIPI-CSI with an image processor, and the C-series has no camera interface at all.`,
  ideas: [
    'A DVP camera uses eight data lines, a pixel clock produced by the sensor, VSYNC for frames, HREF for lines, and a control bus that is almost I2C.',
    'The chip must supply the sensor with its own clock (XCLK, commonly 20 MHz) before the sensor will answer.',
    'The ESP32, S2, S3 and S31 have a DVP interface; the P4 adds MIPI-CSI and an image signal processor; the C- and H-series have none.',
    'All those wires use up fourteen or fifteen pins, so a camera board leaves few for anything else.'
  ],
  pitfalls: [
    'Any ESP32 can run a camera on its I2C pins — The control bus only configures the sensor. The pixels need eight parallel lines and a pixel-clock input that only the chips with a camera interface have.',
    'The sensor clocks itself, so the chip needs to supply nothing — The sensor produces PCLK, but it needs XCLK from the chip to run at all. A camera with no XCLK is silent, even though its control bus may seem fine.',
    'MIPI-CSI is just a faster DVP — It is a different link: differential lanes, a packet protocol and, usually, raw sensor data that an image processor must turn into a picture.'
  ],
  terms: [
    { term: 'DVP', also: ['digital video port', 'parallel camera interface'], def: 'The parallel link between a small camera sensor and a chip: eight or more data lines timed by a pixel clock, with VSYNC and HREF marking frames and lines. The ESP32, S2, S3 and P4 can receive it.' },
    { term: 'PCLK', also: ['pixel clock'], def: 'The clock the camera sensor produces to time its data lines. The receiving chip reads the data on one edge of each pulse, so the rate of PCLK limits how fast pixels arrive.' },
    { term: 'VSYNC and HREF', also: ['frame sync', 'line valid', 'HSYNC'], def: 'Two framing signals of a camera link. VSYNC changes once per frame; HREF is high while a line of pixels is on the data lines and low in the gaps between lines.' },
    { term: 'MIPI CSI-2', also: ['MIPI-CSI', 'CSI'], def: 'The serial camera link of phones and single-board computers: a clock lane and one or more fast differential data lanes. On the ESP32 family only the ESP32-P4 has it.' },
    { term: 'Image signal processor', also: ['ISP'], def: 'Hardware that turns a sensor\'s raw data into a finished picture: it reconstructs colour from the sensor\'s filter pattern, balances white and adjusts colour and brightness. The ESP32-P4 has one for its MIPI-CSI camera.' }
  ],
  choose: {
    good: ['DVP on an ESP32-S3 or ESP32 for small, cheap cameras that output JPEG themselves', 'MIPI-CSI on the ESP32-P4 for higher resolution, raw sensors and a hardware image processor', 'A ready-made camera board, which has the wiring, the clock and the rails done'],
    avoid: ['A C-series chip for a camera project: it has no camera interface', 'Long, loose wiring for a 20 MHz DVP bus', 'Counting on free GPIO pins once a DVP camera is connected'],
    check: ['That your chip, and your board\'s pin map, name each of the fourteen signals', 'That the sensor gets XCLK and the right supply rails', 'Whether the I2S block on an ESP32 is wanted for audio as well']
  },
  formulas: [
    {
      name: 'Frame rate of a DVP link',
      expr: 'r = f/(w*h*b)',
      tex: 'r = \\frac{f}{w \\, h \\, b}',
      vars: {
        r: { name: 'frames per second', q: 'frequency', unit: 'Hz', tex: 'r' },
        f: { name: 'pixel clock', q: 'frequency', unit: 'MHz', value: 10, tex: 'f' },
        w: { name: 'width', unit: 'px', value: 640, tex: 'w' },
        h: { name: 'height', unit: 'px', value: 480, tex: 'h' },
        b: { name: 'bytes per pixel', unit: 'bytes', value: 2, tex: 'b' }
      },
      note: 'One byte travels on the eight data lines per clock pulse. The blanking between lines and frames is ignored, so the real rate is somewhat lower. A sensor that compresses to JPEG sends far fewer bytes than this.',
      stories: { r: 'A sensor sends {w} by {h} pixels, {b} per pixel, with a pixel clock of {f}. How many frames a second can the link carry?', f: 'A raw {w} by {h} picture at {b} per pixel must arrive {r} times a second. What pixel clock does that take?' },
      practice: { unknowns: ['r', 'f'] }
    }
  ],
  examples: [
    {
      title: 'Raw video at VGA',
      q: 'A sensor sends 640 × 480 pixels as RGB565 (two bytes per pixel) with a pixel clock of 10 MHz. What frame rate can the link carry, and could the chip store one frame in its internal memory?',
      steps: ['A frame is $640 \\times 480 \\times 2 = 614{,}400$ bytes, one byte per clock pulse.', 'At 10 MHz, $10{,}000{,}000 \\div 614{,}400 \\approx 16$ frames a second, before blanking is subtracted.', 'The original ESP32 has 520 KB of internal SRAM in all; one such frame is about 600 KB, so it cannot fit without external PSRAM.'],
      a: 'About 16 frames a second at best, and the frame needs PSRAM. This is why small cameras send JPEG: a VGA picture compresses to a few tens of kilobytes.'
    }
  ],
  code: [
    {
      title: 'Is the camera there? Scan its control bus',
      about: 'Powers the sensor, gives it a 20 MHz clock and scans the control bus (SCCB) for devices. An OV2640 answers at address 0x30. It proves the power-down pin, the clock, the two control wires and the sensor itself, without the camera driver.',
      needs: 'An AI-Thinker ESP32-CAM with its camera fitted, powered from the 5V pin (500 mA or more).',
      wiring: [['GPIO32', 'camera power-down (PWDN)', 'low = on'], ['GPIO0', 'camera clock (XCLK)', 'also the boot pin: not tied to ground when running'], ['GPIO26', 'control data (SIOD)', ''], ['GPIO27', 'control clock (SIOC)', '']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (32) as [output v]
          set pin (32) to [LOW v]
          set PWM on pin (0) frequency (20000000) resolution (1)
          set PWM on pin (0) to (1)
          wait (0.05) seconds
          start I2C on SDA (26) SCL (27)
          set [address v] to (0)
          repeat (126)
            change [address v] by (1)
            if <a device answers at I2C address (address)> then :: bus
              print (join [found 0x] (address))
            end
          end
          print [scan done]
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int PWDN = 32;       // camera power-down: low powers the sensor
        const int XCLK = 0;        // the clock the sensor needs from the chip
        const int SDA_PIN = 26;    // control bus data (SIOD)
        const int SCL_PIN = 27;    // control bus clock (SIOC)

        void setup() {
          Serial.begin(115200);
          pinMode(PWDN, OUTPUT);
          digitalWrite(PWDN, LOW);
          ledcAttach(XCLK, 20000000, 1);   // 20 MHz square wave, 1-bit resolution
          ledcWrite(XCLK, 1);              // duty 1 of 2: half the time high
          delay(50);

          Wire.begin(SDA_PIN, SCL_PIN, 100000);
          for (int address = 1; address < 127; address++) {
            Wire.beginTransmission(address);
            if (Wire.endTransmission() == 0) {
              Serial.printf("found 0x%02X\n", address);
            }
          }
          Serial.println("scan done");
        }

        void loop() {}
      `,
      na: { py: 'The camera itself cannot be driven from official MicroPython, which has no camera module. The scan alone would work with machine.PWM and I2C, but a clock of 20 MHz is beyond what the PWM class promises: use the C++ version.' },
      output: `
        found 0x30
        scan done
      `,
      notes: ['Nothing found means power, clock or wiring: check the 5V supply first, then that GPIO0 is not tied to ground. Other sensors answer at other addresses (an OV3660 or OV5640 at 0x3C, for example).', 'The clock trick is the same one the camera driver plays: a timer of the chip\'s LEDC block makes the square wave, which is why a camera and your own PWM can collide.']
    }
  ],
  quiz: [
    { q: 'Which camera signal does the sensor drive, and which does the chip drive?', choices: ['The chip drives PCLK; the sensor drives XCLK', 'The sensor drives PCLK; the chip drives XCLK', 'The sensor drives both clocks', 'The chip drives both clocks'], a: 1, why: 'The sensor produces the pixel clock PCLK that times its data lines. But the sensor needs a master clock to run at all, and the chip supplies it as XCLK.' },
    { q: 'An ESP32-C3 has I2C pins, so it can run an OV2640 camera.', a: false, why: 'The I2C-like control bus only sets up the sensor. The pixels arrive on eight parallel lines at pixel-clock speed, and the C3 has no camera interface to receive them.' },
    { q: 'How many wires does a DVP camera need, roughly?', choices: ['Two', 'Four', 'About fourteen', 'About forty'], a: 2, why: 'Eight data, PCLK, VSYNC, HREF, XCLK and two control wires make fourteen, plus a power-down pin on most boards.' },
    { q: 'A sensor sends 640 × 480 RGB565 pixels on eight data lines with a 10 MHz pixel clock. About what frame rate is the most the link can carry?', choices: ['3 frames a second', '16 frames a second', '60 frames a second', '300 frames a second'], a: 1, why: 'One frame is 614,400 bytes and one byte moves per clock pulse, so 10,000,000 ÷ 614,400 is about 16.' }
  ],
  applications: [
    'Reading which pins a camera board spends, before planning what else the board can do.',
    'Choosing an ESP32-S3 for a DVP camera, or an ESP32-P4 where a MIPI-CSI sensor and the image processor are wanted.',
    'Checking a dead camera: power-down pin, clock and control bus, one after another.',
    'Building a custom board around an OV2640 or OV5640 module on a 24-pin flat cable.'
  ],
  sources: [
    'Espressif, ESP32, ESP32-S3 and ESP32-P4 datasheets and technical reference manuals: the camera interfaces.',
    'OmniVision, OV2640 datasheet: the DVP output and the control bus.',
    'MIPI Alliance, CSI-2 specification: the serial camera link.'
  ],
  sim: 'cv-dvp-signals'
}
,
/* ================================================================ camera-sensors */
{
  id: 'camera-sensors',
  parent: 'camera-and-vision',
  title: 'OV2640, OV5640 and other sensors',
  level: 1,
  short: 'The sensor decides what the picture looks like and how much work the chip has left. The OV2640 is on most cheap boards; the OV3660 and OV5640 give more pixels; some sensors compress to JPEG themselves and some do not.',
  keywords: ['OV2640', 'OV3660', 'OV5640', 'OV7670', 'OV7725', 'GC0308', 'GC2145', 'PY260', 'OV5647', 'sensor', 'megapixel', 'field of view', 'FOV', 'autofocus', 'fixed focus', 'IR cut', 'night vision', 'rolling shutter', 'JPEG output', 'thermal camera', 'lens'],
  prereq: ['camera-interfaces', 'i2c-addresses-and-scanning'],
  related: ['the-esp32-camera-driver', 'esp32-cam-boards', 'camera-and-audio-kits', 'xiao-esp32s3-and-sense', 'light-sensors', 'cameras-and-the-law'],
  body: `The sensor is the part of a camera board that you choose by accident: whatever the board maker fitted. Knowing the common ones tells you what the board can do, because the sensor also decides whether the pictures arrive already compressed.

### The sensors you will meet

| Sensor | Pixels | Output | Where the catalogue shows it |
|---|---|---|---|
| OV2640 | 2 MP, up to 1600 × 1200 | JPEG, RGB, YUV | AI-Thinker ESP32-CAM, ESP32-S3-EYE, Freenove boards |
| OV3660 | 3 MP, up to 2048 × 1536 | JPEG, RGB, YUV | XIAO ESP32S3 Sense, M5Stack TimerCamera, DFRobot S3 AI Camera |
| OV5640 | 5 MP, up to 2592 × 1944 | JPEG, RGB, YUV | Adafruit MEMENTO, Waveshare S3 camera boards |
| GC0308 | 0.3 MP, 640 × 480 | RGB, YUV | M5Stack CoreS3 and AtomS3R-CAM |
| GC2145 | 2 MP | RGB, YUV | UNIHIKER K10 |
| PY260 | 5 MP | JPEG only | M5Stack Unit CamS3-5MP |
| OV5647 | 5 MP, MIPI | raw | ESP32-P4 boards with a CSI connector |

The OV2640 is the workhorse: cheap, well supported, and at its limit about 15 frames a second at 1600 × 1200 or 30 at 800 × 600. The larger OmniVision parts give more pixels but run hotter and need more bus bandwidth. A sensor that makes **JPEG itself** saves the chip the compression; one that sends only raw colour (the GC0308, the old OV7670) leaves the chip to handle or compress every frame.

### The lens matters as much

- **Field of view.** The ESP32-S3-EYE's OV2640 sees 66.5 degrees; the DFRobot S3 camera is a 160-degree wide angle with infrared lighting; a lens on the M5Stack AtomS3R-M12 sees 120. The formula below turns an angle into pixels per metre at a distance.
- **Focus.** Most modules are fixed focus. The PY260 module is focused at about 0.6 m, an OV5647 module at 3 m. The OV2640 lens of many boards can be turned by hand to refocus it, which a QR code at 10 cm needs ([[qr-and-barcodes]]).
- **Infrared.** A normal module blocks infrared with a filter; a "night" module leaves it out and adds 940 nm lamps, so it sees in the dark but with off colours by day.
- **Rolling shutter.** These sensors read their lines one after another, so a fast pan or a spinning fan leans and bends. It is not a fault.

### Not every camera is a picture

The M5StickT2 carries a FLIR Lepton thermal camera of 160 × 120 heat pixels in the catalogue: a different sensor, on SPI and I2C instead of DVP, and a different tool.

### Setting the sensor

Through the control bus the driver can flip and mirror the picture, change brightness and saturation, and switch automatic white balance and exposure on or off ([[the-esp32-camera-driver]]). The program below asks the sensor which model it is.

> [!key] The sensor sets the pixels, the field of view, the focus and whether JPEG comes out ready-made. The OV2640 is the common cheap one; the OV3660 and OV5640 have more pixels; read your board's record before choosing a frame size.`,
  ideas: [
    'The OV2640 is the sensor of most cheap ESP32 camera boards; the OV3660 and OV5640 give three and five megapixels.',
    'A sensor that outputs JPEG itself spares the chip the compression; raw-only sensors such as the GC0308 do not.',
    'Field of view and focus belong to the lens: wide angles see more but spread the same pixels thinner.',
    'These sensors have a rolling shutter, so fast movement bends in the picture.'
  ],
  pitfalls: [
    'More megapixels always means a better picture — The pixels are bigger or smaller, the lens and the light matter just as much, and a 5 MP frame needs far more memory and time than the chip can often spare.',
    'A night-vision module just sees better in the dark — It lacks the infrared-cut filter, so daytime colours look wrong, and it needs its own infrared lamp to see anything in true darkness.',
    'The camera is out of focus, so it is broken — Many modules are focused for distance and the lens barrel can be turned; fixed-focus modules are sharp only from a minimum distance.'
  ],
  terms: [
    { term: 'OV2640', also: ['2 MP sensor', 'OmniVision OV2640'], def: 'A two-megapixel OmniVision image sensor, on most cheap ESP32 camera boards. It can compress to JPEG itself and reaches 1600 × 1200 pixels.' },
    { term: 'Field of view', also: ['FOV', 'viewing angle'], def: 'The angle the lens takes in. A wide field sees more of the scene, but the same number of pixels is spread over a larger area, so each object gets fewer of them.' },
    { term: 'Rolling shutter', def: 'A way of reading a sensor line by line instead of all at once. Anything moving fast while the frame is read looks leaned or bent.' },
    { term: 'IR-cut filter', also: ['infrared filter', 'NoIR'], def: 'A thin filter in front of the sensor that blocks infrared light so colours look natural. A night-vision module omits it and sees infrared at the price of false colours by day.' },
    { term: 'Fixed focus', also: ['autofocus'], def: 'A lens set at the factory to give a sharp picture from some distance outwards. A few sensors, such as the OV5640 in some modules, have a motor that focuses by itself.' }
  ],
  choose: {
    good: ['An OV2640 board for VGA to SVGA streams and photos at the lowest cost', 'An OV3660 or OV5640 board when the extra pixels are worth the memory and heat', 'A wide-angle or infrared module for a doorway or a night shot'],
    avoid: ['A raw-only sensor (GC0308, OV7670) when the chip must also compress or stream', 'A night module for daytime colour work', 'A fixed-focus module for reading close text or QR codes without testing it'],
    check: ['Which sensor your exact board revision carries (makers change it)', 'Its field of view and focus distance', 'Whether it outputs JPEG, and its highest frame size']
  },
  formulas: [
    {
      name: 'Pixels per metre at a distance',
      expr: 'p = n/(2*d*tan(a/2))',
      tex: 'p = \\frac{n}{2 \\, d \\, \\tan(a/2)}',
      vars: {
        p: { name: 'pixels per metre', unit: 'px/m', tex: 'p' },
        n: { name: 'pixels across the picture', unit: 'px', value: 1280, tex: 'n' },
        d: { name: 'distance to the subject', q: 'length', unit: 'm', value: 5, tex: 'd' },
        a: { name: 'horizontal field of view', q: 'angle', unit: '°', value: 66.5, min: 10, max: 170, tex: 'a' }
      },
      note: 'The scene is a flat wall at distance d, seen straight on. The width of that wall in the picture is 2·d·tan(a/2) metres.',
      stories: { p: 'A camera with a field of view of {a} gives {n} across, and the subject is {d} away. How many pixels cover each metre?', d: 'A camera of {a} and {n} pixels across must give {p}. How far away may the subject be?' },
      practice: { unknowns: ['p', 'd'] }
    }
  ],
  code: [
    {
      title: 'Which sensor is on my board?',
      about: 'Starts the camera driver and asks the sensor for its identity, then prints the model and its biggest picture. It uses the AI-Thinker pin map; swap the pins for your board.',
      needs: 'An ESP32 camera board (the AI-Thinker ESP32-CAM here) with its camera fitted and a 5 V supply good for 500 mA.',
      wiring: [['GPIO32', 'camera power-down', 'driven by the driver'], ['GPIO0', 'camera clock', 'not tied to ground when running'], ['GPIO26 / GPIO27', 'camera control bus', '']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, JPEG, 320 × 240 :: my
          set [id v] to (the sensor's product number) :: my
          if <(id) = (0x26)> then
            print [OV2640: 2 MP, up to 1600 x 1200]
          else if <(id) = (0x3660)> then
            print [OV3660: 3 MP, up to 2048 x 1536]
          else if <(id) = (0x5640)> then
            print [OV5640: 5 MP, up to 2592 x 1944]
          else
            print (join [another sensor, id 0x] (id))
          end
      `,
      cpp: String.raw`
        #include "esp_camera.h"

        void setup() {
          Serial.begin(115200);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_JPEG;
          config.frame_size = FRAMESIZE_QVGA;         // 320 x 240: small, works on any board
          config.jpeg_quality = 12;
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;

          if (esp_camera_init(&config) != ESP_OK) {
            Serial.println("camera init failed");
            return;
          }
          sensor_t *s = esp_camera_sensor_get();
          if (s->id.PID == OV2640_PID)      Serial.println("OV2640: 2 MP, up to 1600 x 1200");
          else if (s->id.PID == OV3660_PID) Serial.println("OV3660: 3 MP, up to 2048 x 1536");
          else if (s->id.PID == OV5640_PID) Serial.println("OV5640: 5 MP, up to 2592 x 1944");
          else Serial.printf("another sensor, id 0x%04X\n", s->id.PID);

          s->set_vflip(s, 1);                          // flip the picture if the board is mounted upside down
          s->set_brightness(s, 1);                     // -2 to 2
        }

        void loop() {}
      `,
      na: { py: 'Official MicroPython has no camera module, so the sensor cannot be reached from it. Community firmware that adds one exists, but it is outside this guide.' },
      output: `
        OV2640: 2 MP, up to 1600 x 1200
      `,
      notes: ['The driver names more sensors than the three tested here; the last line prints the raw identity of any other.', 'The calls follow the esp32-camera component\'s own examples. On a board with a different sensor or pin map, change the pins from your board\'s catalogue entry.']
    }
  ],
  quiz: [
    { q: 'Why does a sensor that outputs JPEG help a small chip?', choices: ['It gives better colours', 'The chip does not have to compress each frame itself', 'It needs no clock', 'It works without PSRAM at any size'], a: 1, why: 'Compressing a frame takes time and memory. A sensor that sends finished JPEG files leaves the chip to store or send them as they are.' },
    { q: 'A wide 120-degree lens and a 66-degree lens use the same 640-pixel sensor. Which gives more pixels per metre at 3 m?', choices: ['The wide lens', 'The narrow lens', 'Both the same', 'It depends on the colour'], a: 1, why: 'The narrow lens covers a smaller width of scene with the same 640 pixels, so each metre gets more of them. The wide one sees more, thinner.' },
    { q: 'A night-vision camera module is a good choice for accurate colours in daylight.', a: false, why: 'It lacks the infrared-cut filter, so infrared light reaches the sensor by day and colours look wrong.' },
    { q: 'The picture is sharp across the room but blurred at 10 cm. What is the likely cause?', choices: ['A broken sensor', 'The lens is focused for distance', 'The JPEG quality is too high', 'Too little PSRAM'], a: 1, why: 'Many modules are focused far away at the factory. Turning the lens barrel, where it can be turned, moves the sharp zone closer.' }
  ],
  applications: [
    'Choosing a board for a doorway camera, where a wide angle and infrared lighting matter.',
    'Picking a frame size within the sensor\'s limit before configuring the driver.',
    'Telling a QR-code reader from a room camera by the focus distance of its lens.',
    'Spotting that a board revision has changed its sensor, so a saved configuration no longer fits.'
  ],
  sources: [
    'OmniVision, datasheets of the OV2640, OV3660 and OV5640 image sensors.',
    'Espressif, the esp32-camera component documentation: the supported sensors and pixel formats.',
    'The board makers\' own pages, as recorded in the board catalogue.'
  ],
  sim: 'cv-sampling'
}
,
/* ================================================================ the-esp32-camera-driver */
{
  id: 'the-esp32-camera-driver',
  parent: 'camera-and-vision',
  title: 'The camera driver: frame size, quality, PSRAM',
  level: 2,
  short: 'Espressif\'s esp32-camera driver starts the sensor, collects each frame into a buffer and hands it to your program. A handful of settings decide whether it runs: the pin map, the frame size, the JPEG quality, the number of buffers and where they live.',
  keywords: ['esp32-camera', 'esp_camera_init', 'camera_config_t', 'esp_camera_fb_get', 'esp_camera_fb_return', 'FRAMESIZE_VGA', 'PIXFORMAT_JPEG', 'fb_count', 'CAMERA_FB_IN_PSRAM', 'CAMERA_GRAB_LATEST', 'jpeg_quality', 'frame buffer', 'psramFound', 'frame rate', 'camera config', 'sensor_t', 'xclk_freq_hz'],
  prereq: ['camera-sensors', 'using-psram', 'arduino-ide-and-the-esp32-core'],
  related: ['esp32-cam-boards', 'video-streaming', 'photos-and-time-lapse', 'pwm-with-ledc', 'brownout', 'memory-map', 'xiao-esp32s3-and-sense'],
  body: `Camera programs start with Espressif's **esp32-camera** driver, which the Arduino core carries and ESP-IDF projects add as a component. You fill in one configuration structure, call \`esp_camera_init()\`, and then ask for pictures.

### The configuration

\`camera_config_t\` holds three groups of settings. The **pins**: eight data lines (\`pin_d0\` to \`pin_d7\`), \`pin_xclk\`, \`pin_pclk\`, \`pin_vsync\`, \`pin_href\`, the control pair \`pin_sccb_sda\` and \`pin_sccb_scl\`, and \`pin_pwdn\` and \`pin_reset\` (−1 where a board has none). Every board has its own map; the table gives three from the catalogue. The **clock**: \`xclk_freq_hz\` (20 MHz is usual) and the LEDC timer and channel that make it. The **picture**: \`pixel_format\`, \`frame_size\` and, for JPEG, \`jpeg_quality\`.

| Signal | AI-Thinker ESP32-CAM | Freenove ESP32-S3-WROOM CAM | XIAO ESP32S3 Sense |
|---|---|---|---|
| XCLK / PCLK | 0 / 22 | 15 / 13 | 10 / 13 |
| VSYNC / HREF | 25 / 23 | 6 / 7 | 38 / 47 |
| SCCB data / clock | 26 / 27 | 4 / 5 | 40 / 39 |
| D0 to D7 | 5, 18, 19, 21, 36, 39, 34, 35 | 11, 9, 8, 10, 12, 18, 17, 16 | 15, 17, 18, 16, 14, 12, 11, 48 |
| Power-down / reset | 32 / none | none / none | none listed |

### Frame size and quality

\`frame_size\` takes names such as \`FRAMESIZE_QVGA\` (320 × 240), \`FRAMESIZE_VGA\` (640 × 480), \`FRAMESIZE_SVGA\` (800 × 600) and \`FRAMESIZE_UXGA\` (1600 × 1200); the sensor sets the ceiling. In JPEG mode \`jpeg_quality\` runs from 0 to 63 and **lower is better**: 10 to 12 is a good start, 30 and above is visibly blocky. A VGA picture in RGB565 is 614,400 bytes; the simulation shows sizes and memory.

### Buffers and where they live

Each frame sits in a **frame buffer**. With \`fb_count = 1\` the driver captures when you ask and you wait for the sensor. With two or more it keeps filling buffers in the background, so \`esp_camera_fb_get()\` returns at once. \`CAMERA_GRAB_WHEN_EMPTY\` fills them in turn and may hand you an old frame; \`CAMERA_GRAB_LATEST\` always gives the newest, and wants \`fb_count\` above 1. \`CAMERA_FB_IN_PSRAM\` is the default and what large frames need; a board without PSRAM must use \`CAMERA_FB_IN_DRAM\` and a small size ([[using-psram]]). Check with \`psramFound()\` and fall back.

### Using a frame

\`esp_camera_fb_get()\` returns a \`camera_fb_t\` with the bytes (\`buf\`), their count (\`len\`), \`width\`, \`height\` and \`format\`. **You must give it back** with \`esp_camera_fb_return()\`; forget, and the buffers run out and the camera freezes. The sensor's own settings, flip, mirror, brightness and white balance, are reached through \`esp_camera_sensor_get()\`.

### What trips people up

The camera clock takes an LEDC timer and channel, so PWM elsewhere may collide with it ([[pwm-with-ledc]]); a board that resets at the first frame has a weak supply ([[brownout]]).

> [!key] Fill in the pin map, choose a frame size and a quality, say how many buffers and where, call the initialiser, then get and return frames. Large frames need PSRAM, every frame must be returned, and lower JPEG quality numbers mean better pictures.`,
  ideas: [
    'The driver is configured with one structure: the board\'s pin map, the clock, the pixel format, the frame size and, for JPEG, the quality.',
    'In JPEG mode the quality number runs 0 to 63 and lower is better; frame size and quality together set the size of each picture.',
    'Large frames need the frame buffers in PSRAM; without PSRAM use DRAM and a small frame size.',
    'Each frame taken must be returned, or the buffers run out; two buffers with the "latest" grab mode give the newest picture without waiting.'
  ],
  pitfalls: [
    'A higher JPEG quality number gives a better picture — It is the reverse: the number is a compression factor from 0 to 63, so 10 is fine and 50 is blocky.',
    'The driver frees a frame after I read it — It does not. Call the return function for every frame you take; a program that forgets runs for a few frames and then stops getting pictures.',
    'Any pin map works if the pins exist — The map is wired into the board. A pin set copied from another board, or from a different revision, gives an init error or no picture.'
  ],
  terms: [
    { term: 'Frame buffer', also: ['fb', 'camera_fb_t'], def: 'A block of memory that holds one captured picture. The driver fills it; your program reads its bytes and then returns it so it can be used again.' },
    { term: 'JPEG quality', also: ['jpeg_quality', 'compression factor'], def: 'A setting from 0 to 63 for the camera\'s JPEG compressor. A lower number keeps more detail and makes a bigger file.' },
    { term: 'Frame size', also: ['FRAMESIZE', 'resolution'], def: 'The width and height of the picture in pixels, chosen by name: QVGA is 320 by 240, VGA 640 by 480, UXGA 1600 by 1200. The sensor limits the largest.' },
    { term: 'Grab mode', also: ['CAMERA_GRAB_LATEST', 'CAMERA_GRAB_WHEN_EMPTY'], def: 'How the driver handles several frame buffers. "When empty" fills them in turn and may give an old frame; "latest" always hands over the newest and drops the rest.' },
    { term: 'esp32-camera', also: ['esp_camera.h', 'camera driver'], def: 'Espressif\'s open driver for camera sensors on the ESP32, S2, S3 and later chips. It starts the sensor, receives the frames and exposes them through a small API.' }
  ],
  choose: {
    good: ['Frame buffers in PSRAM, two of them, with the "latest" grab mode, for streams', 'JPEG output at a modest size when the picture is to be stored or sent', 'Grayscale at QQVGA or QVGA when the program analyses the picture rather than shows it'],
    avoid: ['Raw RGB565 above QVGA without PSRAM', 'UXGA at quality 10 for a Wi-Fi stream: it is large and slow', 'Forgetting to return a frame, or to check for a null pointer'],
    check: ['That psramFound() is true on the board (and PSRAM is enabled in the board menu)', 'The sensor\'s largest size before choosing a frame size', 'Whether another part of the program uses LEDC timer 0 or channel 0']
  },
  formulas: [
    {
      name: 'Size of a frame',
      expr: 'S = w*h*q/8/1024',
      tex: 'S = \\frac{w \\, h \\, q}{8 \\cdot 1024}',
      vars: {
        S: { name: 'frame size', unit: 'KB', tex: 'S' },
        w: { name: 'width', unit: 'px', value: 640, tex: 'w' },
        h: { name: 'height', unit: 'px', value: 480, tex: 'h' },
        q: { name: 'bits per pixel', unit: 'bit', value: 16, tex: 'q' }
      },
      note: 'Raw RGB565 is 16 bits per pixel, grayscale 8. A JPEG picture averages well under 1 bit per pixel, depending on the scene and the quality; 1 KB here is 1024 bytes.',
      stories: { S: 'A frame of {w} by {h} pixels is stored at {q} per pixel. How big is it?', q: 'A frame of {w} by {h} pixels takes {S}. How many bits per pixel is that?' },
      practice: { unknowns: ['S', 'q'] }
    }
  ],
  examples: [
    {
      title: 'Will a raw frame fit?',
      q: 'You want grayscale frames of 320 × 240 for analysis on an ESP32 without PSRAM. Does one fit in the internal memory, and what about RGB565 at VGA?',
      steps: ['Grayscale is 8 bits per pixel: $320 \\times 240 = 76{,}800$ bytes, about 75 KB. That fits in the ESP32\'s 520 KB of SRAM next to a program.', 'RGB565 at VGA is $640 \\times 480 \\times 2 = 614{,}400$ bytes, about 600 KB. That is more than all the internal SRAM.'],
      a: 'The grayscale QVGA frame fits; the RGB565 VGA frame needs PSRAM.'
    }
  ],
  code: [
    {
      title: 'Start the camera and measure its frame rate',
      about: 'Starts the driver with PSRAM when it is there (two buffers, latest frame) and in DRAM at a small size when not, takes thirty frames and prints how long they took and how big they were.',
      needs: 'An AI-Thinker ESP32-CAM, or any camera board whose pins you substitute, and a 5 V supply good for 500 mA.',
      wiring: [['GPIO0', 'camera clock', 'not tied to ground when running'], ['5V', 'supply', '500 mA or more']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, JPEG, 800 × 600, two buffers if PSRAM :: my
          set [total v] to (0)
          set [start v] to (milliseconds since start)
          repeat (30)
            take a picture and keep it :: my
            change [total v] by (size of the picture)
            give the picture back :: my
          end
          set [ms v] to ((milliseconds since start) - (start))
          print (join [fps: ] ((30000) / (ms)))
          print (join [bytes per frame: ] ((total) / (30)))
      `,
      cpp: String.raw`
        #include "esp_camera.h"

        void setup() {
          Serial.begin(115200);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_JPEG;
          config.jpeg_quality = 12;                    // lower is better quality

          bool ram = psramFound();
          config.frame_size = ram ? FRAMESIZE_SVGA : FRAMESIZE_QVGA;
          config.fb_location = ram ? CAMERA_FB_IN_PSRAM : CAMERA_FB_IN_DRAM;
          config.fb_count = ram ? 2 : 1;
          config.grab_mode = ram ? CAMERA_GRAB_LATEST : CAMERA_GRAB_WHEN_EMPTY;

          if (esp_camera_init(&config) != ESP_OK) {
            Serial.println("camera init failed");
            return;
          }

          size_t total = 0;
          uint32_t start = millis();
          for (int i = 0; i < 30; i++) {
            camera_fb_t *fb = esp_camera_fb_get();
            if (!fb) {
              Serial.println("capture failed");
              return;
            }
            total += fb->len;
            esp_camera_fb_return(fb);                  // always give the frame back
          }
          uint32_t ms = millis() - start;
          Serial.printf("fps: %.1f\n", 30000.0 / ms);
          Serial.printf("bytes per frame: %u\n", (unsigned)(total / 30));
        }

        void loop() {}
      `,
      na: { py: 'The official MicroPython firmware has no camera driver. Community builds with one exist but differ from each other: use the C++ version.' },
      output: `
        fps: 11.8
        bytes per frame: 38210
      `,
      notes: ['The numbers vary with the scene, the light and the supply; indoors in poor light the sensor lengthens its exposure and the rate drops.', 'On a board without PSRAM the same program runs at QVGA in internal memory. Change the sizes to see how the rate and the byte count move.', 'The calls follow the esp32-camera component\'s own examples; the Arduino API reference does not cover it.']
    }
  ],
  quiz: [
    { q: 'In JPEG mode you change the quality number from 10 to 40. What happens?', choices: ['A sharper, larger picture', 'A blockier, smaller picture', 'No change: it only affects raw frames', 'The camera restarts'], a: 1, why: 'The number is a compression factor, 0 to 63, where lower keeps more detail. At 40 each frame is smaller and visibly blocky.' },
    { q: 'You call the frame-get function in a loop and the camera stops giving pictures after a few frames. What did you forget?', choices: ['To call delay()', 'To return each frame with the return function', 'To raise the clock', 'To use two buffers'], a: 1, why: 'Frames are borrowed buffers. If they are never returned, the driver has none left to fill and waits for ever.' },
    { q: 'A board has no PSRAM. Which setting is safe?', choices: ['UXGA, two buffers in PSRAM', 'A small frame size with the buffer in DRAM', 'RGB565 at SXGA', 'fb_count of 4 at VGA'], a: 1, why: 'Without PSRAM everything must fit in internal memory, so a small frame size and one buffer in DRAM is what works.' },
    { q: 'Which grab mode gives the newest frame, dropping older ones?', choices: ['CAMERA_GRAB_WHEN_EMPTY', 'CAMERA_GRAB_LATEST', 'CAMERA_FB_IN_PSRAM', 'PIXFORMAT_JPEG'], a: 1, why: 'The "latest" mode always hands over the most recent frame. It needs more than one buffer.' }
  ],
  applications: [
    'The first lines of every ESP32-CAM, XIAO Sense and ESP32-S3 camera sketch, from the CameraWebServer example onward.',
    'Choosing a frame size and quality so that a stream fits the Wi-Fi link.',
    'Taking grayscale frames for motion detection or QR scanning instead of JPEG.',
    'Debugging an init failure by checking power, PSRAM and the pin map in turn.'
  ],
  sources: [
    'Espressif, esp32-camera component documentation and examples: camera_config_t, the frame buffer API and the pixel formats.',
    'Arduino-ESP32 documentation and the CameraWebServer example that ships with the core.',
    'The board makers\' pin maps, as recorded in the board catalogue.'
  ],
  sim: 'cv-resolution'
}
,
/* ================================================================ video-streaming */
{
  id: 'video-streaming',
  parent: 'camera-and-vision',
  title: 'Streaming video',
  level: 2,
  short: 'The easiest live video from an ESP32 is MJPEG: one HTTP response that never ends, carrying one JPEG picture after another. A browser shows it in a plain image tag. The frame rate is whatever the sensor, the picture size and the Wi-Fi link leave over.',
  keywords: ['MJPEG', 'motion JPEG', 'multipart/x-mixed-replace', 'boundary', 'stream', 'live video', 'CameraWebServer', 'snapshot', 'capture', 'RTSP', 'H.264', 'frame rate', 'bitrate', 'port 81', 'img tag', 'WebServer', 'video'],
  prereq: ['the-esp32-camera-driver', 'web-server-on-esp', 'wifi-station'],
  related: ['websockets', 'web-interface-security', 'wifi-troubleshooting', 'project-doorbell-camera', 'home-assistant-integration', 'esphome', 'tcp-ip-on-a-microcontroller', 'cameras-and-the-law'],
  body: `Video on a microcontroller is mostly a bandwidth problem. The ESP32 has no hardware video encoder (the ESP32-P4 has one for H.264), and compressing frames in software is out of the question. The camera's own JPEG output is the way round it: if every frame is already a finished JPEG file, a "video" is just those files sent one after another. That is **MJPEG**.

### How the stream looks on the wire

The program answers a request with one HTTP response whose content type is \`multipart/x-mixed-replace\` and which never ends. Each part is a header block and then the picture:

- a boundary line, such as \`--frame\`;
- \`Content-Type: image/jpeg\` and \`Content-Length\`, the byte count of the picture;
- a blank line, the JPEG bytes, and a line break.

A browser given \`<img src="/stream">\` replaces the picture each time a part arrives. No page code, no player. The simulation below shows the parts going by.

### How fast it goes

The rate is the smallest of three limits: **the sensor** (about 30 frames a second at SVGA for an OV2640, 15 at its largest size), **the encoder** (the sensor's JPEG engine slows at high quality), and **the link**: bitrate = bytes per frame × 8 × frames per second. A VGA frame of 20 to 40 KB at 12 frames a second is 2 to 3.9 Mbit/s, which a good Wi-Fi signal carries and a poor one does not. Real throughput of an ESP32 on Wi-Fi is far below the headline link rate, and falls at a distance. Smaller frames and a higher quality number are the first fixes.

### One client at a time

A simple server handles one request at a time, and a stream never ends, so while one viewer watches nothing else is served. The CameraWebServer example avoids it by starting a second server on port 81 just for the stream. For several viewers, use an asynchronous server, and expect each extra viewer to divide the frame rate.

### Other ways

- **Snapshots:** the viewer asks for one JPEG every second or two. Cheaper and fine for a doorbell or a weather view.
- **WebSocket frames** ([[websockets]]) when a page must also send commands.
- **RTSP** for viewers such as network recorders; libraries exist. **H.264** needs a chip with an encoder.
- **ESPHome** exposes the camera to Home Assistant without code ([[esphome]]).

> [!warn] A stream with no password shows the camera to everyone on the network, and a forwarded port shows it to the world. Add a login, keep it off the internet, and tell people they are being filmed ([[cameras-and-the-law]], [[web-interface-security]]).

> [!key] MJPEG is a never-ending HTTP response of JPEG pictures; the sensor does the compression. The frame rate is the lowest of the sensor, the encoder and the Wi-Fi link, and a simple server shows one viewer at a time.`,
  ideas: [
    'MJPEG sends each frame as a complete JPEG in a never-ending multipart HTTP response; a browser shows it in an ordinary image tag.',
    'The camera\'s own JPEG output makes streaming possible on a chip with no video encoder.',
    'Frame rate is limited by the sensor, the JPEG engine and the Wi-Fi link: bitrate is frame bytes × 8 × frames per second.',
    'A simple server serves one viewer at a time; the stream usually gets its own server or port.'
  ],
  pitfalls: [
    'MJPEG is real video compression — Each frame is compressed alone, so it is far larger than H.264 at the same quality. It is simple and robust, not efficient.',
    'The stream is slow because Wi-Fi is slow — It may be the picture: a large frame at low compression needs several megabits a second. Try a smaller size or a higher quality number first.',
    'A stream behind my router is private — Anyone on the network can open it unless it asks for a login, and forwarding a port to it exposes it to the internet.'
  ],
  terms: [
    { term: 'MJPEG', also: ['motion JPEG'], def: 'Video made of a sequence of complete JPEG pictures, each compressed on its own. It needs no video encoder, which suits a camera chip, and costs more bandwidth than H.264.' },
    { term: 'Multipart response', also: ['multipart/x-mixed-replace', 'boundary'], def: 'An HTTP response made of many parts, each separated by a boundary line, where each new part replaces the one before. It is how a browser receives an MJPEG stream.' },
    { term: 'Snapshot', also: ['capture', 'still'], def: 'A single JPEG picture served on request. Polling it every second or two is a cheaper alternative to a stream.' },
    { term: 'RTSP', also: ['Real Time Streaming Protocol'], def: 'A protocol used by network cameras and recorders to start and control a video stream. Some ESP32 libraries speak it, so a recorder can use the camera.' },
    { term: 'Bitrate', also: ['data rate'], def: 'The amount of data a stream needs each second. For MJPEG it is the bytes in a frame times eight times the frames per second.' }
  ],
  choose: {
    good: ['MJPEG for a live view on the home network, in any browser', 'Snapshots polled every few seconds for a doorbell, plant or nest-box camera', 'A second server or port so that the stream does not block the control page'],
    avoid: ['Many simultaneous viewers on one chip', 'Streaming at the sensor\'s largest size over weak Wi-Fi', 'An open stream, or a forwarded port, with no authentication'],
    check: ['The bitrate against the real throughput at the camera\'s location', 'That the supply can give the current peaks of camera plus Wi-Fi', 'Who can reach the stream, and who is in the picture']
  },
  formulas: [
    {
      name: 'Bitrate of an MJPEG stream',
      expr: 'R = S*f*8192',
      tex: 'R = S \\, f \\cdot 8 \\cdot 1024',
      vars: {
        R: { name: 'bitrate', q: 'datarate', unit: 'Mbit/s', tex: 'R' },
        S: { name: 'bytes per frame', unit: 'KB', value: 40, tex: 'S' },
        f: { name: 'frames per second', q: 'frequency', unit: 'Hz', value: 12, tex: 'f' }
      },
      note: 'The payload only; the HTTP headers and TCP overhead add a few per cent. 1 KB here is 1024 bytes.',
      stories: { R: 'Each frame is {S} and the stream runs at {f}. What bitrate does the Wi-Fi link have to carry?', f: 'Frames of {S} must fit in a link that really carries {R}. What frame rate is possible?' },
      practice: { unknowns: ['R', 'f'] }
    }
  ],
  code: [
    {
      title: 'A web page, a snapshot and a live stream',
      about: 'Serves three addresses on the camera\'s IP: / shows the stream in a page, /capture returns one JPEG and /stream is the never-ending MJPEG response. The stream handler keeps the connection and sends frames until the viewer leaves.',
      needs: 'An AI-Thinker ESP32-CAM on a 5 V supply good for 500 mA, and a Wi-Fi network. Use your own network name and password, and do not leave them in code you share.',
      wiring: [['5V', 'supply', '500 mA or more'], ['GPIO0', 'camera clock', 'not tied to ground when running']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, JPEG, 640 × 480, two buffers if PSRAM :: my
          connect to Wi-Fi [your-ssid] password [your-password]
          start web server on port (80)
          print (IP address)

        when request for [/] arrives
          reply with a page that shows the stream :: net

        when request for [/capture] arrives
          take a picture and keep it :: my
          reply with the picture as [image/jpeg] :: net
          give the picture back :: my

        when request for [/stream] arrives
          while <the viewer is still connected>
            take a picture and keep it :: my
            send the picture as the next part of the stream :: net
            give the picture back :: my
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>
        #include "esp_camera.h"

        const char *SSID = "your-ssid";
        const char *PASSWORD = "your-password";

        WebServer server(80);

        bool startCamera() {
          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_JPEG;
          config.frame_size = FRAMESIZE_VGA;
          config.jpeg_quality = 12;
          bool ram = psramFound();
          config.fb_location = ram ? CAMERA_FB_IN_PSRAM : CAMERA_FB_IN_DRAM;
          config.fb_count = ram ? 2 : 1;
          config.grab_mode = ram ? CAMERA_GRAB_LATEST : CAMERA_GRAB_WHEN_EMPTY;
          return esp_camera_init(&config) == ESP_OK;
        }

        void handlePage() {
          server.send(200, "text/html", "<img src='/stream' style='width:100%'>");
        }

        void handleCapture() {
          camera_fb_t *fb = esp_camera_fb_get();
          if (!fb) {
            server.send(500, "text/plain", "capture failed");
            return;
          }
          WiFiClient client = server.client();
          client.printf("HTTP/1.1 200 OK\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\nConnection: close\r\n\r\n", (unsigned)fb->len);
          client.write(fb->buf, fb->len);
          esp_camera_fb_return(fb);
        }

        void handleStream() {
          WiFiClient client = server.client();
          client.print("HTTP/1.1 200 OK\r\nContent-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n");
          while (client.connected()) {
            camera_fb_t *fb = esp_camera_fb_get();
            if (!fb) break;
            client.printf("--frame\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n", (unsigned)fb->len);
            client.write(fb->buf, fb->len);
            client.print("\r\n");
            esp_camera_fb_return(fb);
          }
        }

        void setup() {
          Serial.begin(115200);
          if (!startCamera()) {
            Serial.println("camera init failed");
            return;
          }
          WiFi.begin(SSID, PASSWORD);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());
          server.on("/", handlePage);
          server.on("/capture", handleCapture);
          server.on("/stream", handleStream);
          server.begin();
        }

        void loop() {
          server.handleClient();
        }
      `,
      na: { py: 'Official MicroPython has no camera module, so there is nothing to serve. A web server in MicroPython is shown on the web-server page, but the pictures need the C++ driver.' },
      output: `
        192.168.1.57
      `,
      notes: ['Open http://192.168.1.57/ (the address printed) in a browser on the same network. While one browser holds /stream, the simple server serves no one else.', 'The stream loop ends when the viewer closes the page. The CameraWebServer example that ships with the Arduino core runs the stream on its own port, 81, so the page stays usable.', 'Anyone on the network can open these addresses: see [[web-interface-security]] before leaving it running.']
    }
  ],
  quiz: [
    { q: 'What makes an MJPEG stream a "stream" in the browser?', choices: ['A video codec in the page', 'A response that never ends, with a new JPEG replacing the last in each part', 'A special port', 'A WebSocket'], a: 1, why: 'The response is of type multipart/x-mixed-replace and carries part after part. The browser swaps the image in every time a new part arrives, with no player involved.' },
    { q: 'Each frame is 30 KB (1 KB = 1024 bytes) and the stream runs at 15 frames a second. About what bitrate is that?', choices: ['0.4 Mbit/s', '3.7 Mbit/s', '37 Mbit/s', '370 kbit/s'], a: 1, why: '30 × 1024 × 8 × 15 is about 3.7 million bits per second.' },
    { q: 'The stream stutters on weak Wi-Fi. Which change helps first?', choices: ['A larger frame size', 'A smaller frame size or a higher quality number', 'More PSRAM', 'A different pin map'], a: 1, why: 'Smaller frames carry fewer bytes. A higher quality number compresses more, so each frame is smaller too, and the bitrate falls.' },
    { q: 'A camera stream that asks for no password is safe as long as it is behind your home router.', a: false, why: 'Anyone on the network, including a guest or an infected device, can open it. Add a login and never forward the port to the internet.' }
  ],
  applications: [
    'A live view of a nest box, a 3D printer or a workshop on the home network.',
    'A doorbell that serves a snapshot when the button is pressed ([[project-doorbell-camera]]).',
    'A Home Assistant camera through ESPHome, shown on a dashboard.',
    'A robot\'s eye whose view is shown in a browser on the controlling phone.'
  ],
  sources: [
    'Arduino-ESP32 documentation: the WebServer library; and the CameraWebServer example that ships with the core.',
    'RFC 2046, Multipurpose Internet Mail Extensions Part Two: the multipart media types behind the stream format.',
    'Espressif, the esp32-camera component documentation: JPEG output and frame buffers.'
  ],
  sim: 'cv-mjpeg'
}
,
/* ================================================================ photos-and-time-lapse */
{
  id: 'photos-and-time-lapse',
  parent: 'camera-and-vision',
  title: 'Photos and time-lapse',
  level: 2,
  short: 'A time-lapse camera wakes, lets its exposure settle, saves one JPEG to the SD card and goes back to sleep. The program is short; the craft is in the exposure, the file naming and the battery arithmetic.',
  keywords: ['time-lapse', 'photo', 'SD card', 'SD_MMC', 'deep sleep', 'RTC_DATA_ATTR', 'flash LED', 'exposure', 'JPEG quality', 'file name', 'interval', 'GPIO4', '1-bit mode', 'battery', 'ffmpeg', 'TimerCamera', 'wake', 'numbered files'],
  prereq: ['the-esp32-camera-driver', 'sd-cards', 'deep-sleep'],
  related: ['esp32-cam-boards', 'battery-life-budget', 'wake-up-sources', 'rtc-memory', 'ntp-and-time', 'littlefs-and-file-systems', 'project-doorbell-camera', 'cameras-and-the-law'],
  body: `A still photograph is the easiest thing a camera board does, and a time-lapse is only a still repeated, with the board asleep between shots. The hard parts are small ones: the first frame after waking is badly exposed, two files must not share a name, and a battery that does not last the week.

### One good photo

A sensor that has just started has not yet chosen its exposure and white balance, so the first frames are dark or tinted. **Take two or three frames and throw them away**, then keep the next. Choose a size and a JPEG quality for storing rather than streaming: SVGA to UXGA at quality 10 gives good prints at a few tens of kilobytes. The flash LED of the AI-Thinker board (GPIO4) is very bright, and is also the SD card's data line 1.

### Saving to the card

Use the card in **1-bit mode**: it needs only the clock, command and one data line, and leaves GPIO4 free for the LED and GPIO12 untouched, which matters because GPIO12 is a strapping pin ([[strapping-pins]]). Name the files with a counter that survives sleep (a variable in RTC memory) or with the time from the network ([[ntp-and-time]]); a board with no clock otherwise starts again at the same number after a power cut.

### The wake, shoot, sleep cycle

The program runs once per wake: start camera, mount card, take the picture, write it, sleep for the interval. Starting the camera costs about a second and a current of well over 100 mA, so a photo every ten minutes is mostly sleep. But the AI-Thinker board's regulator and camera keep drawing milliamps even in deep sleep; reports commonly put it near 6 mA, and the catalogue gives no figure. A board built for the job, such as the M5Stack TimerCamera with its real-time clock, sleeps far better ([[battery-life-budget]]).

### Arithmetic of the interval

Photos per day are 1440 divided by the interval in minutes. Storage lasts card size ÷ (photo size × photos per day), and a film runs shots ÷ playback frame rate. Any video tool turns numbered pictures into a film. The calculators below do both; the example shows that the card is rarely the limit.

> [!warn] A camera that photographs on its own records whoever passes. Point it where you are entitled to, tell people, and keep the pictures only as long as needed ([[cameras-and-the-law]]).

> [!key] Discard the first frames, save to the card in 1-bit mode with a number that survives sleep, and sleep between shots. The battery, not the card, usually sets how long a time-lapse runs.`,
  ideas: [
    'The first frames after the sensor starts are badly exposed: take a few and discard them before the one you keep.',
    'Use the SD card in 1-bit mode on the AI-Thinker board so the flash LED pin and the strapping pin GPIO12 stay out of the way.',
    'A counter in RTC memory numbers the files across deep sleep; a clock from the network can name them by time.',
    'Storage, film length and battery all come from simple arithmetic on the interval; the battery is usually the limit.'
  ],
  pitfalls: [
    'The camera is ready the moment it starts — Exposure and white balance need a few frames to settle. The first picture is dark or tinted unless you take and discard some.',
    'Deep sleep makes this board a low-power camera — On the AI-Thinker board the regulator and the camera supply still draw milliamps in sleep. A battery lasts days, not months, unless the board is built for sleeping.',
    'The counter in a variable survives the sleep — Ordinary variables are lost in deep sleep. Keep the number in RTC memory, in flash or on the card, or every wake overwrites picture number zero.'
  ],
  terms: [
    { term: 'Time-lapse', def: 'A film made from photographs taken at long intervals, so that slow change (a plant growing, a building rising, clouds moving) plays back fast.' },
    { term: '1-bit SD mode', also: ['SD_MMC 1-bit', 'SDMMC one-line mode'], def: 'Using an SD card with one data line instead of four. It is slower but needs fewer pins, which frees the lines the flash LED and strapping pins share on an ESP32-CAM.' },
    { term: 'RTC memory', also: ['RTC_DATA_ATTR', 'RTC slow memory'], def: 'A small block of memory that keeps its contents through deep sleep. A variable marked for it holds a photo counter from one wake to the next.' },
    { term: 'Exposure settling', also: ['auto exposure', 'AEC'], def: 'The few frames a sensor needs after starting to find the right exposure time and gain for the light. Frames taken before it settles are too dark or too bright.' }
  ],
  choose: {
    good: ['Deep sleep between shots, the card in 1-bit mode and a counter in RTC memory', 'A board with a real-time clock and a proper sleep current for battery time-lapse', 'JPEG quality 10 to 12 at SVGA to UXGA for pictures meant for viewing'],
    avoid: ['Leaving the camera awake between shots on a battery', 'Using the first frame after waking', 'Writing a clock-less counter to a variable that deep sleep erases'],
    check: ['The real sleep current of your board, measured, not the chip\'s figure', 'That a full-resolution file at your quality fits the card for the whole project', 'Who may appear in the pictures, and how long you keep them']
  },
  formulas: [
    {
      name: 'How long the card lasts',
      expr: 'D = G*1000000/(S*n)',
      tex: 'D = \\frac{G \\cdot 10^{6}}{S \\, n}',
      vars: {
        D: { name: 'days until the card is full', unit: 'days', tex: 'D' },
        G: { name: 'card capacity', unit: 'GB', value: 8, tex: 'G' },
        S: { name: 'size of one photo', unit: 'kB', value: 60, tex: 'S' },
        n: { name: 'photos per day', unit: 'per day', value: 144, tex: 'n' }
      },
      note: 'Decimal units: 1 GB is 1,000,000 kB. Photos per day are 1440 divided by the interval in minutes.',
      stories: { D: 'A {G} card holds photos of {S}, taken {n} a day. How many days until it is full?', n: 'A {G} card must last {D} with photos of {S}. How many photos a day can it take?' },
      practice: { unknowns: ['D', 'n'] }
    },
    {
      name: 'Length of the finished film',
      expr: 'T = N/f',
      tex: 'T = \\frac{N}{f}',
      vars: {
        T: { name: 'film length', q: 'time', unit: 's', tex: 'T' },
        N: { name: 'number of photos', unit: 'photos', value: 4320, tex: 'N' },
        f: { name: 'playback rate', q: 'frequency', unit: 'Hz', value: 25, tex: 'f' }
      },
      note: 'One photo per film frame.',
      stories: { T: '{N} are played back at {f}. How long is the film?', N: 'A film of {T} at {f} needs how many photos?' },
      practice: { unknowns: ['T', 'N'] }
    }
  ],
  examples: [
    {
      title: 'A month of a plant growing',
      q: 'A camera takes a 60 kB photo every 10 minutes onto an 8 GB card for 30 days. Does the card last, and how long is the film at 25 frames a second?',
      steps: ['Photos per day: $1440 \\div 10 = 144$. In 30 days: $144 \\times 30 = 4320$ photos.', 'Storage: $8 \\times 10^6 \\div (60 \\times 144) \\approx 926$ days, so the card is not the limit.', 'Film: $4320 \\div 25 = 172.8$ seconds, a little under three minutes.'],
      a: 'The card would last about 926 days; the film runs about 2 minutes 53 seconds. The battery decides, not the card.'
    }
  ],
  code: [
    {
      title: 'A time-lapse camera that sleeps between shots',
      about: 'On every wake: starts the camera, mounts the SD card in 1-bit mode, discards three frames while the exposure settles, saves the next as a numbered file, then sleeps for ten minutes. The picture number survives sleep in RTC memory.',
      needs: 'An AI-Thinker ESP32-CAM with a FAT-formatted microSD card, on a 5 V supply good for 500 mA.',
      wiring: [['GPIO14, 15, 2', 'SD clock, command, data 0', '1-bit mode'], ['GPIO4', 'flash LED', 'free in 1-bit mode; not used here'], ['5V', 'supply', '500 mA or more']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, JPEG, 800 × 600 :: my
          start the SD card in 1-bit mode :: storage
          set [shot v] to (load [shot])    // the C++ keeps it in RTC memory
          repeat (3)
            take a picture and keep it :: my
            give the picture back :: my
          end
          take a picture and keep it :: my
          save the picture as file number (shot) on the SD card :: storage
          print (join [saved picture ] (shot))
          give the picture back :: my
          save ((shot) + (1)) as [shot]
          deep sleep for (600) seconds
      `,
      cpp: String.raw`
        #include "esp_camera.h"
        #include "FS.h"
        #include "SD_MMC.h"

        RTC_DATA_ATTR int shot = 0;                   // survives deep sleep
        const uint64_t INTERVAL_S = 600;              // ten minutes

        void goToSleep() {
          esp_sleep_enable_timer_wakeup(INTERVAL_S * 1000000ULL);
          esp_deep_sleep_start();
        }

        void setup() {
          Serial.begin(115200);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_JPEG;
          config.frame_size = FRAMESIZE_SVGA;
          config.jpeg_quality = 10;
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;

          if (esp_camera_init(&config) != ESP_OK || !SD_MMC.begin("/sdcard", true)) {
            Serial.println("camera or card failed");
            goToSleep();
          }

          for (int i = 0; i < 3; i++) {               // let the exposure settle
            camera_fb_t *warm = esp_camera_fb_get();
            if (warm) esp_camera_fb_return(warm);
          }

          camera_fb_t *fb = esp_camera_fb_get();
          if (fb) {
            char path[24];
            snprintf(path, sizeof(path), "/img_%05d.jpg", shot);
            File file = SD_MMC.open(path, FILE_WRITE);
            if (file) {
              file.write(fb->buf, fb->len);
              file.close();
              Serial.printf("saved %s, %u bytes\n", path, (unsigned)fb->len);
              shot++;
            }
            esp_camera_fb_return(fb);
          }
          goToSleep();
        }

        void loop() {}
      `,
      na: { py: 'Official MicroPython has no camera module, so the pictures cannot be taken from it. The sleep and the card would be easy; the camera is the missing part.' },
      output: `
        saved /img_00042.jpg, 41872 bytes
      `,
      notes: ['The flash LED can glow while the board sleeps, because its pin is shared with the card. If it does, the pad can be held low through sleep; check that on your board.', 'Without a clock the board cannot stamp the time. Add the time from the network, or an RTC board such as the one in the M5Stack TimerCamera, to name files by date.']
    }
  ],
  quiz: [
    { q: 'Why does the program take three frames and throw them away?', choices: ['To warm up the card', 'The sensor needs a few frames to settle its exposure and white balance', 'To test the Wi-Fi', 'To free PSRAM'], a: 1, why: 'A sensor that has just started has not yet chosen exposure and gain, so its first frames are too dark or tinted.' },
    { q: 'The program numbers files with a plain global variable and sleeps between shots. After the first wake every file is img_00000.jpg. Why?', choices: ['The card is full', 'Ordinary variables are lost in deep sleep', 'The name is too long', 'JPEG files cannot be numbered'], a: 1, why: 'Deep sleep resets the chip\'s ordinary memory, so the counter restarts at zero. A variable in RTC memory keeps its value.' },
    { q: 'A camera takes one 60 kB picture every 30 minutes onto a 16 GB card. About how long before the card is full?', choices: ['About 10 days', 'About 1 year', 'About 15 years', 'Never'], a: 2, why: '48 photos a day is 2.88 MB a day; 16 GB ÷ 2.88 MB is about 5,500 days, which is about 15 years. The battery gives out long before.' },
    { q: 'Using the SD card in 4-bit mode is the best choice on an ESP32-CAM.', a: false, why: 'The four-line mode takes the pins of the flash LED (GPIO4) and of GPIO12, a strapping pin. One-line mode is slower but avoids both problems.' }
  ],
  applications: [
    'A plant, a building site or a sky camera that records a film over weeks.',
    'A nest-box or wildlife camera that photographs on a schedule or when a PIR sensor fires.',
    'A weather or river-level record kept as numbered pictures on a card.',
    'A product inspection photo saved for every batch.'
  ],
  sources: [
    'Arduino-ESP32 documentation: the SD_MMC library and the deep-sleep API.',
    'Espressif, the esp32-camera component documentation: frame buffers and JPEG settings.',
    'The board catalogue entry for the AI-Thinker ESP32-CAM: the flash LED and the SD pins.'
  ],
  sim: { id: 'cv-sampling', params: { focus: 'quality' } }
}
,
/* ================================================================ qr-and-barcodes */
{
  id: 'qr-and-barcodes',
  parent: 'camera-and-vision',
  title: 'QR codes and barcodes',
  level: 2,
  short: 'A QR code announces itself with three square finder patterns that look the same along any line through their centres. Finding them is cheap enough for a microcontroller; reading what is between them is a job for a small library.',
  keywords: ['QR code', 'barcode', 'finder pattern', 'quirc', 'EAN-13', 'Code 128', 'module', 'quiet zone', 'error correction', 'grayscale', 'scan', 'decode', 'ESP32QRCodeReader', 'pixels per module', 'check digit', 'version', 'ratio 1:1:3:1:1'],
  prereq: ['the-esp32-camera-driver', 'camera-sensors'],
  related: ['rfid-and-nfc', 'motion-detection', 'image-classification', 'bits-and-bytes', 'esp32-cam-boards', 'cameras-and-the-law'],
  body: `A QR code is a square grid of dark and light **modules**. The smallest, version 1, is 21 × 21 modules; every version adds four to each side, up to version 40 at 177 × 177. Version 1 at the lowest error-correction level holds 17 bytes, version 40 almost three thousand. The code can lose a share of its modules (from about 7 % at level L to about 30 % at H) and still decode, and it must have a blank border of four modules, the **quiet zone**.

### How a reader finds the code

Three corners carry a **finder pattern**: a dark square of 7 × 7 modules, a light ring inside it, and a dark centre of 3 × 3. Cut it along any line through its centre and you meet dark, light, dark, light, dark in the proportion **1 : 1 : 3 : 1 : 1**. That is true at any rotation and any size. A reader scans rows of the picture, measures runs of dark and light pixels, and notes every place the five runs fit that proportion. Three clusters of hits form a triangle: that is a code, and its corners give the orientation.

The simulation below does exactly that on a drawn code: slide the scan line, change the size of a module in pixels, and see where the test passes and fails.

### What the camera must give

- A **grayscale frame**: colour adds nothing and costs memory. QVGA (320 × 240) or VGA is typical.
- **At least three or four pixels per module.** A version 1 code with its quiet zone is 29 modules across: at 4 pixels each, 116 pixels, which fits easily in QVGA. A version 10 code (57 modules, 65 with the border) needs about 260.
- **Focus.** A fixed-focus lens set for distance gives a blurred code at 10 cm ([[camera-sensors]]), and blur merges neighbouring modules. Turn the lens or step back.
- **Light and contrast**: glare on glossy labels and a bright phone screen are the usual failures.

### Reading it

Decoding, unmasking the data, correcting errors and reading the text is a library's work: the C library quirc, Espressif's code-scanner component and Arduino libraries built around them. Check that the one you choose supports your core and your chip, and give it the grayscale frame. The program below only finds the finder patterns, to show the idea.

### One-dimensional barcodes

An EAN-13 is 95 modules wide, and a single row of pixels across it is enough to read it, so it works at low resolution if the bars are roughly horizontal in the picture. Its last digit is a check digit; the example works one out.

> [!warn] Cameras record people, and a code scanner is still a camera. Keep only the text you decode, not the pictures, and say what the device sees ([[cameras-and-the-law]]).

> [!key] A QR code is found by its three finder patterns, whose run lengths are 1 : 1 : 3 : 1 : 1 in any direction. Give the reader a sharp grayscale frame with at least three or four pixels per module and let a library do the decoding.`,
  ideas: [
    'A QR code is a grid of modules with three finder patterns, a quiet zone and error correction; version 1 is 21 × 21 modules and each version adds four.',
    'Every finder pattern gives the run lengths 1 : 1 : 3 : 1 : 1 along any line through its centre, whatever the rotation, which makes it easy to find.',
    'The camera must supply a sharp grayscale frame with at least three or four pixels per module.',
    'Finding a code is cheap; decoding it is the job of a library such as quirc or Espressif\'s code scanner.'
  ],
  pitfalls: [
    'A bigger picture always reads a QR code better — What counts is pixels per module and focus. A blurred full-size frame fails where a sharp small one succeeds.',
    'Any camera can read a code held 5 cm away — Many fixed-focus modules cannot focus that close; the lens must be turned, or the code held further away.',
    'The scanner needs the colour picture — Decoders work on brightness only. A grayscale frame is smaller and faster, so ask the driver for grayscale.'
  ],
  terms: [
    { term: 'QR code', also: ['quick response code'], def: 'A two-dimensional barcode: a square grid of dark and light modules holding text or bytes, with error correction and three finder patterns in the corners.' },
    { term: 'Finder pattern', also: ['position detection pattern'], def: 'The large square pattern in three corners of a QR code. It shows run lengths in the proportion 1:1:3:1:1 along any line through its centre, so a reader can locate and orient the code.' },
    { term: 'Module', also: ['QR module', 'cell'], def: 'One dark or light square of a QR code, the smallest unit of its grid. A reader needs about three or four camera pixels per module.' },
    { term: 'Quiet zone', def: 'The blank border around a code, four modules wide for a QR code. Without it a reader cannot tell where the code ends.' },
    { term: 'Check digit', also: ['EAN checksum'], def: 'A final digit computed from the others so that a reader can reject a misread number. In an EAN-13 it comes from alternately weighting digits by 1 and 3.' }
  ],
  choose: {
    good: ['A grayscale QVGA frame with a sharp focus for scanning labels and screens', 'A decoding library, with the finder search only as a quick "code in view" test', 'Large modules (a bigger printed code) rather than a higher camera resolution'],
    avoid: ['Fixed-focus lenses set for distance when the code is closer than 15 cm', 'Glossy labels in direct light', 'Writing your own full decoder on the chip'],
    check: ['Pixels per module in your frame, at the distance of use', 'That the library supports your core version and chip', 'What you keep: the decoded text, not the picture']
  },
  examples: [
    {
      title: 'Is this EAN-13 valid?',
      q: 'Check the number 4006381333931.',
      steps: ['Take the first twelve digits, 4 0 0 6 3 8 1 3 3 3 9 3, and weight them 1, 3, 1, 3 … from the left.', 'Sum: $4 + 0 + 0 + 18 + 3 + 24 + 1 + 9 + 3 + 9 + 9 + 9 = 89$.', 'The check digit is the amount that brings the sum up to a multiple of ten: $(10 - 89 \\bmod 10) \\bmod 10 = 1$.'],
      a: 'The last digit is 1, so the number is valid.'
    }
  ],
  code: [
    {
      title: 'Is there a QR code in view? Look for the finder patterns',
      about: 'Takes grayscale QVGA frames and scans every fourth row for five runs of dark and light in the proportion 1 : 1 : 3 : 1 : 1. A real code gives dozens of hits from three places. It finds the code; it does not decode it.',
      needs: 'An AI-Thinker ESP32-CAM on a 5 V supply good for 500 mA, and a printed or on-screen QR code held steady at 15 to 30 cm.',
      wiring: [['5V', 'supply', '500 mA or more'], ['GPIO33', 'red status LED', 'on when low']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, grayscale, 320 × 240 :: my
          set pin (33) as [output v]

        define looks like a finder pattern (runs)
          report whether five runs are in the proportion 1 : 1 : 3 : 1 : 1 within half a module :: my

        forever
          take a picture and keep it :: my
          set [hits v] to (the number of rows where a finder pattern shows up) :: my
          give the picture back :: my
          if <(hits) > (5)> then
            set pin (33) to [LOW v]
            print (join [possible QR code, hits: ] (hits))
          else
            set pin (33) to [HIGH v]
          end
        end
      `,
      cpp: String.raw`
        #include "esp_camera.h"

        const int STATUS_LED = 33;     // red LED, on when the pin is low

        bool isFinderRatio(const int run[5]) {         // dark, light, dark (centre), light, dark
          int total = run[0] + run[1] + run[2] + run[3] + run[4];
          if (total < 7) return false;
          float module = total / 7.0f;                 // the pattern is 7 modules wide
          float slack = module / 2;                    // each run may be half a module off
          return fabsf(run[0] - module) < slack && fabsf(run[1] - module) < slack &&
                 fabsf(run[2] - 3 * module) < 3 * slack &&
                 fabsf(run[3] - module) < slack && fabsf(run[4] - module) < slack;
        }

        int countFinderHits(const uint8_t *img, int w, int h, int threshold) {
          int hits = 0;
          for (int y = 0; y < h; y += 4) {             // every fourth row is enough
            int run[5] = {0, 0, 0, 0, 0};
            int state = 0;                             // 0, 2, 4 are dark runs; 1, 3 light
            for (int x = 0; x < w; x++) {
              bool dark = img[y * w + x] < threshold;
              if (dark == (state % 2 == 0)) {
                run[state]++;
              } else if (state < 4) {
                state++;
                run[state] = 1;
              } else {                                 // five runs are complete
                if (isFinderRatio(run)) hits++;
                run[0] = run[2]; run[1] = run[3]; run[2] = run[4];   // slide on by two runs
                run[3] = 1; run[4] = 0;
                state = 3;
              }
            }
          }
          return hits;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(STATUS_LED, OUTPUT);
          digitalWrite(STATUS_LED, HIGH);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_GRAYSCALE;  // one byte per pixel
          config.frame_size = FRAMESIZE_QVGA;         // 320 x 240
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
          if (esp_camera_init(&config) != ESP_OK) Serial.println("camera init failed");
        }

        void loop() {
          camera_fb_t *fb = esp_camera_fb_get();
          if (!fb) return;
          long sum = 0;
          for (size_t i = 0; i < fb->len; i += 16) sum += fb->buf[i];
          int threshold = sum / (fb->len / 16);        // mean brightness splits dark from light
          int hits = countFinderHits(fb->buf, fb->width, fb->height, threshold);
          esp_camera_fb_return(fb);

          digitalWrite(STATUS_LED, hits > 5 ? LOW : HIGH);
          if (hits > 5) Serial.printf("possible QR code, hits: %d\n", hits);
          delay(100);
        }
      `,
      na: { py: 'Official MicroPython has no camera module, so frames cannot be taken from it.' },
      output: `
        possible QR code, hits: 24
      `,
      notes: ['This finds a code; it does not read it. Pass the same grayscale frame to a decoding library (quirc, Espressif\'s code scanner or an Arduino library built on one) to get the text.', 'Hits on a plain scene are rare but possible: stripes and printed text can fit the proportion. Real readers also check that three hits form a triangle.', 'The method assumes a dark pattern on a light ground; a light-on-dark code needs the test inverted.']
    }
  ],
  quiz: [
    { q: 'What proportion of dark and light runs identifies a QR finder pattern along a line through its centre?', choices: ['1 : 1 : 1 : 1 : 1', '1 : 1 : 3 : 1 : 1', '1 : 2 : 3 : 2 : 1', '3 : 1 : 1 : 1 : 3'], a: 1, why: 'A finder pattern is a 3-module dark centre inside a 1-module light ring inside a 1-module dark ring. Any line through its centre meets runs of 1, 1, 3, 1, 1 modules.' },
    { q: 'A version 3 QR code (29 × 29 modules) must be read with four pixels per module, border included (33 modules wide). How many pixels wide is it in the frame?', choices: ['33', '66', '132', '264'], a: 2, why: '33 modules × 4 pixels is 132 pixels, comfortably inside a 320-pixel QVGA frame.' },
    { q: 'Because the finder patterns look alike at every rotation, a QR code can be read at an angle.', a: true, why: 'The 1 : 1 : 3 : 1 : 1 proportion holds along any line through the centre, so the pattern is found whatever the rotation; the three corners also tell the reader which way is up.' },
    { q: 'The code is sharp on the screen but the reader fails at 8 cm. What is the most likely cause?', choices: ['Too much PSRAM', 'The fixed-focus lens cannot focus that close', 'The JPEG quality', 'A wrong pin map'], a: 1, why: 'Many camera modules are focused for distance. At 8 cm the code is blurred and neighbouring modules merge.' }
  ],
  applications: [
    'A scanner for a workshop that reads part labels or Wi-Fi codes.',
    'A door or locker that opens for a code shown on a phone.',
    'Reading an EAN barcode to look up a product in an inventory.',
    'Provisioning a device by showing it a QR code that carries its Wi-Fi settings.'
  ],
  sources: [
    'ISO/IEC 18004, QR code bar code symbology: the structure of the code and its finder patterns.',
    'GS1 General Specifications: the EAN-13 symbol and its check digit.',
    'Documentation of the decoding library you use (quirc and Espressif\'s code scanner among them).'
  ],
  sim: 'cv-qr'
}
,
/* ================================================================ motion-detection */
{
  id: 'motion-detection',
  parent: 'camera-and-vision',
  title: 'Motion detection',
  level: 2,
  short: 'Subtract this frame from the last one and count what changed. The idea fits in twenty lines and runs on any camera board; the craft is telling a person walking in from sensor noise, a passing cloud and the camera adjusting its own exposure.',
  keywords: ['motion detection', 'frame difference', 'background subtraction', 'threshold', 'noise', 'grayscale', 'block average', 'PIR', 'trigger', 'false alarm', 'running average', 'auto exposure', 'flicker', 'QQVGA', 'changed pixels', 'security camera'],
  prereq: ['the-esp32-camera-driver', 'non-blocking-timing', 'presence-and-motion-sensors'],
  related: ['photos-and-time-lapse', 'video-streaming', 'face-detection', 'image-classification', 'deep-sleep', 'wake-up-sources', 'cameras-and-the-law'],
  body: `Motion detection needs no intelligence. Take two grayscale frames a fraction of a second apart, subtract them pixel by pixel, and count the pixels that changed by more than a threshold. If enough changed, something moved. A 160 × 120 frame is 19,200 bytes, so the whole comparison is a few thousand additions: a loop that runs ten times a second and hardly warms the chip.

### Why the naive version cries wolf

- **Noise.** Even a still scene flickers by a few brightness levels from pixel to pixel. A fixed threshold of 5 sees "motion" everywhere in dim light.
- **Light and exposure.** A cloud, a lamp switching on, or a bright object entering the picture makes the sensor change its own exposure, and then *every* pixel changes.
- **Mains lighting** flickers at twice the supply frequency, which shows as moving bands.
- **Shake and wind** move a whole camera or a bush.

### Three habits that fix most of it

1. **Average before you compare.** Divide the frame into blocks of 4 × 4 pixels and compare block averages: averaging sixteen pixels cuts the random noise to a quarter, so a threshold of a dozen levels sits far above it. The program below does this.
2. **Two thresholds.** One for how much a block must change, another for *how many* blocks (a share of the view, say 1 %). A person is many blocks; noise is a few scattered ones.
3. **Pause and settle.** After a trigger, hold off for a second or two so one passer-by is one event.

### What to compare against

Comparing with the *previous* frame sees only movement: a person who stops disappears. Comparing with a slowly updated *background* (a running average of the scene) sees presence, and learns slow changes such as the sun moving, but is fooled by a parked car until it is absorbed. Either way, keep brightness steady where you can: grayscale, fixed exposure after start-up, and a view without a window in it.

### Let a cheaper sensor do the waiting

A camera awake costs 100 mA or more; a PIR sensor costs microamps. A battery design lets the PIR wake the board from deep sleep ([[wake-up-sources]]), then the camera takes the picture, optionally checks it, and sleeps ([[presence-and-motion-sensors]]). The simulation shows noise, thresholds and light changes on a drawn scene.

> [!warn] A camera that watches for movement records people. Say so, limit what it sees and how long you keep it ([[cameras-and-the-law]]).

> [!key] Motion is the count of blocks that changed between frames. Average blocks to beat noise, use a threshold on the change and another on the count, and pause after a trigger; a PIR sensor is the low-power way to wait.`,
  ideas: [
    'Subtract two grayscale frames, count what changed beyond a threshold, and call it motion when enough did.',
    'Averaging blocks of pixels before comparing cuts random sensor noise, so a modest threshold is reliable.',
    'Light changes, auto-exposure, mains flicker and shake can change the whole picture: control exposure and test in the real place.',
    'A PIR sensor can wake the board from deep sleep so that the camera is on only when something has moved.'
  ],
  pitfalls: [
    'The frame difference alone detects a person — It detects change. A cloud, a lamp or the camera\'s own exposure adjustment changes as many pixels as a person does.',
    'A lower threshold is always more sensitive and so better — Below the noise level it fires all the time. Average blocks first, then set the threshold well above the noise.',
    'Comparing with the last frame finds anyone who stays in view — Someone who stands still for a moment becomes identical to the previous frame and vanishes. Compare against a background for presence.'
  ],
  terms: [
    { term: 'Frame difference', also: ['frame differencing', 'temporal difference'], def: 'The pixel-by-pixel subtraction of one frame from another. Where the result is large the picture changed, which usually means something moved.' },
    { term: 'Background subtraction', also: ['running average background'], def: 'Comparing each frame with a slowly updated picture of the empty scene instead of with the previous frame. It detects things that are present, not only things that are moving.' },
    { term: 'Threshold', also: ['trigger level'], def: 'The size of change that counts. Motion detectors use two: how much a pixel or block must change, and how many must do so.' },
    { term: 'PIR sensor', also: ['passive infrared sensor'], def: 'A low-power sensor that detects the change in heat radiation when a warm body moves across its view. It can wake a sleeping board so the camera is not left running.' }
  ],
  choose: {
    good: ['Grayscale QQVGA frames compared in 4 × 4 blocks, with a threshold on change and on count', 'A PIR sensor to wake the board, with the camera to confirm and photograph', 'A fixed view without windows, lamps or moving foliage'],
    avoid: ['Comparing raw colour JPEG frames: compression noise looks like motion', 'Leaving automatic exposure to swing when a bright object enters', 'Triggering on a single noisy block'],
    check: ['That the thresholds hold in dim light and in sun', 'That one passer-by gives one event', 'What the camera sees and keeps when it fires']
  },
  examples: [
    {
      title: 'Why average first?',
      q: 'The sensor noise on one pixel is about ±6 brightness levels. You compare 4 × 4 blocks instead. What noise does a block average show, and is a threshold of 12 sensible?',
      steps: ['Averaging $n$ independent noisy values reduces the noise by $\\sqrt{n}$; here $n = 16$, so $\\sqrt{16} = 4$.', 'The block noise is about $6 \\div 4 = 1.5$ levels.', 'A threshold of 12 is eight times that: random noise will almost never reach it, but a person\'s clothes against a wall usually change a block by far more.'],
      a: 'Block noise is about 1.5 levels, so a threshold of 12 is safely above noise and still catches real movement.'
    }
  ],
  code: [
    {
      title: 'Light the LED when something moves',
      about: 'Takes grayscale QQVGA frames, averages each 4 × 4 block, counts the blocks that changed by more than a threshold since the last frame, and reports motion when enough did. After a trigger it holds the red LED on for two seconds.',
      needs: 'An AI-Thinker ESP32-CAM on a 5 V supply good for 500 mA, pointed at a still scene.',
      wiring: [['GPIO33', 'red status LED', 'on when low'], ['5V', 'supply', '500 mA or more']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, grayscale, 160 × 120 :: my
          set pin (33) as [output v]
          set [quiet until v] to (0)

        forever
          take a picture and keep it :: my
          set [changed v] to (the number of 4 x 4 blocks whose average moved by more than (12) since the last picture) :: my
          give the picture back :: my
          if <<(changed) ≥ (12)> and <(milliseconds since start) > (quiet until)>> then
            set [quiet until v] to ((milliseconds since start) + (2000))
            print (join [motion: blocks changed ] (changed))
          end
          if <(milliseconds since start) < (quiet until)> then
            set pin (33) to [LOW v]
          else
            set pin (33) to [HIGH v]
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include "esp_camera.h"

        const int FRAME_W = 160, FRAME_H = 120;        // QQVGA
        const int BLOCK = 4;                           // 4 x 4 pixels per block
        const int BW = FRAME_W / BLOCK, BH = FRAME_H / BLOCK;   // 40 x 30 blocks
        const int BLOCK_DELTA = 12;                    // a block changed if its average moved by more than this
        const int MIN_BLOCKS = 12;                     // about 1 % of the view
        const int STATUS_LED = 33;                     // red LED, on when low

        uint8_t before[BW * BH];                       // block averages of the last frame
        bool haveBefore = false;
        uint32_t quietUntil = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(STATUS_LED, OUTPUT);
          digitalWrite(STATUS_LED, HIGH);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_GRAYSCALE;
          config.frame_size = FRAMESIZE_QQVGA;         // 160 x 120
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
          if (esp_camera_init(&config) != ESP_OK) Serial.println("camera init failed");
        }

        void loop() {
          camera_fb_t *fb = esp_camera_fb_get();
          if (!fb) return;

          int changed = 0;
          if (fb->width == FRAME_W && fb->height == FRAME_H) {
            for (int by = 0; by < BH; by++) {
              for (int bx = 0; bx < BW; bx++) {
                int sum = 0;
                for (int y = 0; y < BLOCK; y++)
                  for (int x = 0; x < BLOCK; x++)
                    sum += fb->buf[(by * BLOCK + y) * FRAME_W + bx * BLOCK + x];
                int average = sum / (BLOCK * BLOCK);
                int i = by * BW + bx;
                if (haveBefore && abs(average - before[i]) > BLOCK_DELTA) changed++;
                before[i] = average;
              }
            }
            haveBefore = true;
          }
          esp_camera_fb_return(fb);

          if (changed >= MIN_BLOCKS && millis() > quietUntil) {
            quietUntil = millis() + 2000;
            Serial.printf("motion: blocks changed %d\n", changed);
          }
          digitalWrite(STATUS_LED, millis() < quietUntil ? LOW : HIGH);
          delay(100);
        }
      `,
      na: { py: 'Official MicroPython has no camera module, so the frames cannot be taken from it.' },
      output: `
        motion: blocks changed 87
      `,
      notes: ['Walk through the picture and watch the count; then wave a hand slowly near the lens and see how thresholds behave. Tune BLOCK_DELTA and MIN_BLOCKS in your own room.', 'The first frame only fills the memory, so nothing can trigger on it. Automatic exposure may need a few seconds to settle after start-up.']
    }
  ],
  quiz: [
    { q: 'Why compare 4 × 4 block averages instead of single pixels?', choices: ['It is more accurate for colour', 'Averaging sixteen pixels reduces random noise to a quarter', 'It needs no frame buffer', 'It makes the picture larger'], a: 1, why: 'Random noise falls with the square root of the number of values averaged: sixteen pixels cut it by four, so a modest threshold stays above the noise.' },
    { q: 'A cloud covers the sun and the detector fires, although nothing moved. What is happening?', choices: ['The camera lost power', 'The light and the sensor\'s exposure changed, so most pixels changed', 'The block size is wrong', 'The PIR sensor is faulty'], a: 1, why: 'A frame difference measures change of any kind. A change in lighting alters most pixels at once, which is why the count of blocks and a steady exposure matter.' },
    { q: 'A person walks in, stops, and the detector goes quiet. Which reference would still see them?', choices: ['The previous frame', 'A slowly updated background picture', 'A higher threshold', 'A larger frame'], a: 1, why: 'Against the previous frame a person who stops is identical and vanishes. Against a background of the empty scene they still differ.' },
    { q: 'For a battery camera, the best way to wait for movement is to run the camera at 10 frames a second all day.', a: false, why: 'The camera and chip draw 100 mA or more. A PIR sensor draws microamps and can wake the board from deep sleep, so the camera runs only when needed.' }
  ],
  applications: [
    'A nest-box, garden or workshop camera that photographs only when something moves.',
    'A "someone is at the door" trigger on a doorbell camera ([[project-doorbell-camera]]).',
    'Counting passers-by or vehicles by the blocks that change in a strip of the picture.',
    'A low-power wildlife camera: PIR wake, one photo, sleep.'
  ],
  sources: [
    'Espressif, the esp32-camera component documentation: grayscale frames and frame sizes.',
    'Any image-processing text on frame differencing and background subtraction.',
    'The datasheet of the PIR sensor module you use, for its wake-up output.'
  ],
  sim: 'cv-motion'
}
,
/* ================================================================ face-detection */
{
  id: 'face-detection',
  parent: 'camera-and-vision',
  title: 'Face detection and recognition',
  level: 3,
  short: 'Detection finds where a face is; recognition says whose. Detection runs on an ESP32-S3 or P4 with Espressif\'s ESP-DL models; recognition handles biometric data, and the law treats it with far more care than a picture.',
  keywords: ['face detection', 'face recognition', 'ESP-WHO', 'ESP-DL', 'bounding box', 'landmarks', 'image pyramid', 'sliding window', 'cascade', 'embedding', 'face template', 'biometric', 'enrol', 'ESP32-S3', 'ESP32-P4', 'liveness', 'false match', 'GDPR'],
  prereq: ['motion-detection', 'the-esp32-camera-driver', 'what-fits-in-a-microcontroller'],
  related: ['image-classification', 'ai-accelerators-s3-and-p4', 'tflite-micro-and-esp-dl', 'cameras-and-the-law', 'soc-esp32-s3', 'soc-esp32-p4', 'privacy-and-data-protection'],
  body: `**Face detection** answers "is there a face, and where?": it returns a box for each face and sometimes five landmark points (eyes, nose, mouth corners). **Face recognition** goes on to ask whose it is: it turns the face into a list of numbers, an *embedding*, and compares it with those stored for the people it knows. The two are different jobs with very different risks.

### How a detector works

A face can be any size and anywhere in the frame, so a detector slides a small window, perhaps 24 pixels square, across the picture and asks a classifier "face or not?" at every position. To find faces of other sizes it repeats this on shrunken copies of the picture, an *image pyramid*. The number of windows is large (the simulation counts them), so detectors work in **stages**: a very cheap first stage rejects most windows, and only the survivors meet the expensive stage. Older methods used hand-made features in a cascade; the models on ESP chips are small neural networks.

### What runs where

Espressif's ESP-DL library runs neural networks on its chips and ESP-WHO is a framework of vision applications built on it, with face detection and recognition among them. The ESP32-S3 has 128-bit vector instructions that speed up such networks; the ESP32-P4 adds vector instructions and a pixel-processing accelerator (catalogue). The AI-Thinker ESP32-CAM runs face-detection demonstrations too, more slowly. These libraries are ESP-IDF code whose interfaces change between releases, so follow the example of the version you install; the sample here shows only the structure.

### What you need to give it

A face needs enough pixels to have features: tens of pixels across at the least, which sets how close the person must stand for a given resolution and lens ([[camera-sensors]]). Light from the front, not behind. Detectors work on a small input, often grayscale or RGB at a few hundred pixels across.

### Recognition is biometrics

A face embedding identifies a person. In the EU the GDPR counts biometric data used to identify someone as a special category, with strict conditions; other places have their own laws. It can match the wrong person, and a photograph can fool a simple system, so it must not guard anything that matters. If you need it: ask consent, store only embeddings, never keep the pictures, and let people leave ([[cameras-and-the-law]]).

> [!warn] Detection that only counts faces and keeps nothing is a different thing from recognition that names people. Think first about whether you need to know *who*, or only *whether*.

> [!key] Detection finds faces by sliding a window over a pyramid of shrunken pictures with a staged classifier; it runs on the S3 and P4. Recognition compares face embeddings and is biometric data: needing it should be the exception.`,
  ideas: [
    'Detection returns where a face is; recognition compares a face embedding with stored ones to say whose it is.',
    'A detector tests a sliding window at many positions and scales and uses stages so that most windows are rejected cheaply.',
    'The ESP32-S3 and ESP32-P4 run Espressif\'s ESP-DL models comfortably; smaller chips do not.',
    'Recognition handles biometric data, can match wrongly and can be fooled by a photograph: use it only when you must, with consent.'
  ],
  pitfalls: [
    'Face detection and face recognition are the same thing — Detection finds a face; recognition identifies a person. Detection can count visitors and keep nothing, recognition creates identifying data.',
    'A face unlock on a microcontroller is as secure as a PIN — A simple system can be fooled by a photograph or a screen, and false matches happen. It is a convenience, not a lock.',
    'The image just needs to be sharp for it to work — The face must also be large enough in the frame, lit from the front and roughly facing the camera. A sharp, tiny, backlit face fails.'
  ],
  terms: [
    { term: 'Face detection', def: 'Finding where faces are in a picture, usually as a box for each and sometimes five landmark points. It does not say whose face it is.' },
    { term: 'Face recognition', also: ['face identification'], def: 'Matching a detected face against known people by comparing its embedding with stored ones. It processes biometric data.' },
    { term: 'Image pyramid', also: ['multi-scale search'], def: 'A set of copies of a picture at shrinking sizes. A detector with a fixed window size searches each copy, so that it finds faces of every size.' },
    { term: 'Embedding', also: ['face template', 'feature vector'], def: 'A list of numbers that a neural network computes from a face so that pictures of one person give nearby lists. Comparing two lists measures how alike two faces are.' },
    { term: 'ESP-DL', also: ['ESP-WHO'], def: 'Espressif\'s library for running neural networks on its chips, and the ESP-WHO framework of vision applications, such as face detection, built on it.' }
  ],
  choose: {
    good: ['Detection on an ESP32-S3 or P4 when you only need to know that someone is there', 'Counting faces and keeping no pictures', 'Recognition only with consent, stored embeddings and a way to delete them'],
    avoid: ['Face recognition as the lock on anything valuable', 'Keeping the camera pictures "for later" when a count would do', 'An ESP32-C3 or C6, which have no camera interface and no vector instructions'],
    check: ['Pixels across a face at the distance of use', 'The version of the ESP-DL or ESP-WHO release and its example', 'The law on biometric data where you are']
  },
  code: [
    {
      title: 'Count the faces and keep no pictures (structure only)',
      about: 'The shape of a privacy-minded program: take a frame, ask a detector how many faces it contains, keep only that number, and give the frame back at once. The detector itself belongs to the ESP-DL / ESP-WHO release you install.',
      needs: 'An ESP32-S3 camera board (for example an ESP32-S3-EYE) and an ESP-IDF project with ESP-DL.',
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the board's pin map, RGB565, 320 × 240 :: my
          load the face detector :: ai

        forever
          take a picture and keep it :: my
          set [faces v] to (the number of faces the detector finds in the picture) :: ai
          give the picture back :: my
          print (join [faces in view: ] (faces))
          wait (0.2) seconds
        end
      `,
      na: {
        cpp: 'The detector is an ESP-DL / ESP-WHO component written for ESP-IDF, and its interface differs between releases. Follow the face-detection example of the release you install rather than a sketch written here.',
        py: 'Official MicroPython has no camera module and no ESP-DL.'
      },
      notes: ['Note the structure: the picture is given back before anything else happens, and only a number is printed. Nothing is saved or sent.']
    }
  ],
  quiz: [
    { q: 'A door counter needs to know how many people pass, not who they are. What should it use?', choices: ['Face recognition with a stored database', 'Face detection, keeping only the count', 'Recording the stream for later', 'A cloud face service'], a: 1, why: 'Detection answers "how many" without identifying anyone, and the pictures need not be kept. Recognition would create identifying data you do not need.' },
    { q: 'Why do detectors use stages?', choices: ['To use less colour', 'To reject most windows cheaply and spend effort only on likely faces', 'To reduce the frame size', 'To avoid the camera driver'], a: 1, why: 'There are tens of thousands of windows per frame. A cheap first stage discards most, so the expensive network sees few.' },
    { q: 'A simple face-recognition lock cannot be fooled by holding up a photograph.', a: false, why: 'Without liveness checks, a photo or a screen can match. Face recognition on a microcontroller should not guard anything valuable.' },
    { q: 'Which chip is a sensible choice for on-device face detection?', choices: ['ESP32-C3', 'ESP32-S3', 'ESP32-H2', 'ESP8266'], a: 1, why: 'The ESP32-S3 has a DVP camera interface and vector instructions for neural networks. The C3, H2 and ESP8266 have neither a camera interface nor those instructions.' }
  ],
  applications: [
    'A door or kiosk that wakes its screen when a face looks at it.',
    'A visitor counter that keeps only totals.',
    'A smart-display that dims when nobody is in front of it.',
    'Research and teaching demonstrations on the ESP32-S3-EYE and similar boards.'
  ],
  sources: [
    'Espressif, ESP-DL and ESP-WHO documentation and examples for the release you use.',
    'Regulation (EU) 2016/679 (GDPR): the rules on biometric data.',
    'Any computer-vision text on sliding-window and cascade detectors.'
  ],
  sim: 'cv-pyramid'
}
,
/* ================================================================ image-classification */
{
  id: 'image-classification',
  parent: 'camera-and-vision',
  title: 'Classifying images',
  level: 3,
  short: 'Classification gives a whole picture one label: person or no person, ripe or green, open or shut. It works on a tiny version of the image, so the preparation (crop, shrink, scale) decides the result as much as the model does.',
  keywords: ['image classification', 'person detection', 'visual wake words', 'MobileNet', 'TensorFlow Lite Micro', 'ESP-DL', 'Edge Impulse', '96x96', 'int8', 'preprocessing', 'crop', 'resize', 'grayscale', 'confusion matrix', 'cloud inference', 'HTTP POST', 'tensor', 'input size'],
  prereq: ['the-esp32-camera-driver', 'what-fits-in-a-microcontroller', 'the-tinyml-pipeline'],
  related: ['quantization', 'tflite-micro-and-esp-dl', 'edge-impulse', 'calling-cloud-ai', 'face-detection', 'ai-accelerators-s3-and-p4', 'http-client'],
  body: `**Classification** gives a whole picture one label from a fixed list: "person" or "no person", "ripe" or "unripe", "door open", "door shut". It does not say where. A **detector** finds and boxes objects; a classifier is simpler, smaller and the usual first step for a microcontroller.

### The picture is made small

Camera frames are too large for a small network. The classic microcontroller example, person detection, takes a **96 × 96 grayscale** image: 9,216 numbers. Colour networks on larger chips take 128 × 128 or 224 × 224 pixels in three channels. The network's input size is fixed when it is trained: your job is to deliver exactly that.

### Preparation is where it goes wrong

1. **Crop to a square** from the centre rather than squashing the whole frame; a squashed picture changes the shapes the model learned.
2. **Shrink** by sampling or averaging to the model's size.
3. **Convert** to the model's channels: grayscale or RGB.
4. **Scale the numbers** the way the training did: 0 to 1, −1 to 1, or, for an 8-bit model, the unsigned camera byte minus 128 to give a signed byte.

A mismatch in any step gives confident nonsense, and no error. The program below does the first four steps for a 96 × 96 grayscale input.

### Where it runs

- **On the chip**: TensorFlow Lite Micro or ESP-DL ([[tflite-micro-and-esp-dl]]), with models quantized to 8 bits ([[quantization]]). The ESP32-S3's vector instructions and the P4's accelerators speed this up. It needs no network, shows no picture to anyone, and answers in tens to hundreds of milliseconds depending on model and chip.
- **On a server**: the chip sends a JPEG and gets a label back, as the second program does. It allows large models, but needs the network, adds delay and **sends pictures to someone else's machine**: use your own server on your own network unless you have a reason and a right ([[calling-cloud-ai]]).

### Training and testing

A model trained on stock photographs often fails on *your* camera, in *your* light, at *your* angle. Collect examples with the real device ([[edge-impulse]] and similar services help), keep some aside for testing, and look at the confusion matrix: how often each class is mistaken for each other, not only one accuracy figure.

> [!warn] A camera that classifies still sees people. Decide what is kept, and tell those who are filmed ([[cameras-and-the-law]]).

> [!key] A classifier gives one label to a small, exactly prepared image. Crop, shrink, convert and scale the camera frame the way the model was trained, test with your own camera, and keep the pictures on your side unless you must send them.`,
  ideas: [
    'Classification gives a whole picture one label from a fixed list; a detector also says where.',
    'The model\'s input size is fixed: a 96 × 96 grayscale image for the classic person detector; the preparation must match training exactly.',
    'Run it on the chip for privacy and no network; on a server for larger models, at the cost of sending pictures away.',
    'Train and test with your own camera in your own conditions, and read the confusion matrix, not just one accuracy figure.'
  ],
  pitfalls: [
    'If the model runs without errors the input is right — A wrong crop, channel order or scaling produces confident wrong answers and no error message.',
    'A model trained on stock photographs will work on my camera — Light, angle, lens and noise differ. Gather training examples with the actual device.',
    'Sending the picture to a cloud service is the same as processing it locally — It moves personal images to another party, with delay and a dependence on the network.'
  ],
  terms: [
    { term: 'Image classification', also: ['classifier'], def: 'Giving a whole picture one label from a fixed list of classes, such as person or no person. It does not locate anything in the picture.' },
    { term: 'Input tensor', also: ['model input'], def: 'The block of numbers a neural network takes in. For an image it has a fixed width, height and channel count, and a number format, all fixed when the model was trained.' },
    { term: 'Preprocessing', also: ['input preparation'], def: 'The steps that turn a camera frame into the network\'s exact input: crop, resize, convert channels and scale the numbers. It must match what was done in training.' },
    { term: 'Confusion matrix', def: 'A table of how often each true class was predicted as each class. It shows which mistakes a model makes, which one accuracy figure hides.' },
    { term: 'Visual wake words', also: ['person detection model'], def: 'A small image classifier that answers one yes-or-no question, such as whether a person is in view, cheap enough to run all the time on a microcontroller.' }
  ],
  choose: {
    good: ['A small quantized model on an ESP32-S3 for a yes/no question such as person or no person', 'Your own training pictures from the real camera and place', 'A server on your own network for a large model you cannot fit'],
    avoid: ['A public cloud service for pictures of people without consent and need', 'Squashing the whole frame instead of cropping it', 'Judging a model by one accuracy figure'],
    check: ['The model\'s exact input size, channels and number scaling', 'Latency, memory (the tensor arena) and power on your chip', 'What leaves the device, and where it goes']
  },
  code: [
    {
      title: 'Prepare a camera frame for a 96 × 96 model',
      about: 'Takes grayscale QVGA frames, crops the centre square, shrinks it to 96 × 96 by sampling and converts each byte to the signed 8-bit range an int8 model expects. It prints the average of the result and the time taken; where the model would run is marked.',
      needs: 'An ESP32-S3 camera board or an AI-Thinker ESP32-CAM, with a 5 V supply good for 500 mA. Running the model itself needs TensorFlow Lite Micro or ESP-DL.',
      wiring: [['5V', 'supply', '500 mA or more']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, grayscale, 320 × 240 :: my

        define prepare the picture
          crop the centre square of the picture, 240 × 240 :: my
          shrink it to 96 × 96 by sampling :: my
          subtract (128) from every byte to give a signed byte :: my

        forever
          take a picture and keep it :: my
          prepare the picture :: my
          give the picture back :: my
          // run the model on the 96 x 96 input here :: ai
          print (join [input average: ] (the average of the input))
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include "esp_camera.h"

        const int MODEL_SIDE = 96;                     // the model wants 96 x 96, one channel
        int8_t input[MODEL_SIDE * MODEL_SIDE];

        void prepare(const camera_fb_t *fb) {
          int side = fb->height;                       // the centre square: 240 x 240 of 320 x 240
          int left = (fb->width - side) / 2;
          for (int y = 0; y < MODEL_SIDE; y++) {
            for (int x = 0; x < MODEL_SIDE; x++) {
              int sx = left + x * side / MODEL_SIDE;   // sample the source pixel
              int sy = y * side / MODEL_SIDE;
              input[y * MODEL_SIDE + x] = (int8_t)(fb->buf[sy * fb->width + sx] - 128);
            }
          }
        }

        void setup() {
          Serial.begin(115200);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_GRAYSCALE;
          config.frame_size = FRAMESIZE_QVGA;          // 320 x 240
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
          if (esp_camera_init(&config) != ESP_OK) Serial.println("camera init failed");
        }

        void loop() {
          camera_fb_t *fb = esp_camera_fb_get();
          if (!fb) return;
          uint32_t start = micros();
          prepare(fb);
          uint32_t us = micros() - start;
          esp_camera_fb_return(fb);

          long sum = 0;
          for (int i = 0; i < MODEL_SIDE * MODEL_SIDE; i++) sum += input[i];
          // run the model on "input" here (TensorFlow Lite Micro: interpreter->Invoke())
          Serial.printf("input average: %ld, prepared in %u us\n", sum / (MODEL_SIDE * MODEL_SIDE), (unsigned)us);
          delay(1000);
        }
      `,
      na: { py: 'Official MicroPython has no camera module, so the frames cannot be taken from it.' },
      output: `
        input average: -23, prepared in 410 us
      `,
      notes: ['The int8 offset (subtract 128) is the convention of 8-bit quantized models such as the standard person-detection example; check what your own model expects.', 'Cover the lens and the average falls towards -128; point it at a bright window and it rises towards 127. It is a quick check that the input is alive.']
    },
    {
      title: 'Send the picture to a classifier on your own network',
      about: 'Takes one JPEG and POSTs it to a classification service you run, then prints the label and confidence from its JSON reply. The service address and its reply format are your own.',
      needs: 'An AI-Thinker ESP32-CAM on a 5 V supply good for 500 mA, a Wi-Fi network, and a classifier service on your own network that answers {"label": "...", "score": 0.93}.',
      libs: ['ArduinoJson (version 7)'],
      wiring: [['5V', 'supply', '500 mA or more']],
      blocks: `
        when started
          start serial at (115200) baud
          start the camera with the AI-Thinker pin map, JPEG, 320 × 240 :: my
          connect to Wi-Fi [your-ssid] password [your-password]

        every (10) seconds
          take a picture and keep it :: my
          http post (the picture) to [http://192.168.1.20:8000/classify]
          give the picture back :: my
          print (join [label: ] (label from the reply))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <ArduinoJson.h>
        #include "esp_camera.h"

        const char *SSID = "your-ssid";
        const char *PASSWORD = "your-password";
        const char *SERVICE = "http://192.168.1.20:8000/classify";   // your own server

        void setup() {
          Serial.begin(115200);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_JPEG;
          config.frame_size = FRAMESIZE_QVGA;
          config.jpeg_quality = 12;
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
          if (esp_camera_init(&config) != ESP_OK) Serial.println("camera init failed");

          WiFi.begin(SSID, PASSWORD);
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          camera_fb_t *fb = esp_camera_fb_get();
          if (fb) {
            HTTPClient http;
            http.begin(SERVICE);
            http.addHeader("Content-Type", "image/jpeg");
            int code = http.POST(fb->buf, fb->len);
            esp_camera_fb_return(fb);                  // the picture has been sent: give the frame back

            if (code == 200) {
              JsonDocument doc;
              if (!deserializeJson(doc, http.getString())) {
                const char *label = doc["label"] | "?";
                float score = doc["score"] | 0.0f;
                Serial.printf("%s (%.0f %%)\n", label, score * 100);
              }
            } else {
              Serial.printf("request failed: %d\n", code);
            }
            http.end();
          }
          delay(10000);
        }
      `,
      na: { py: 'Official MicroPython has no camera module, so there is no picture to send.' },
      output: `
        person (93 %)
      `,
      notes: ['Use plain http only on a network you control. A service on the internet needs HTTPS, and pictures of people sent there are personal data: see [[cameras-and-the-law]].', 'Do not leave your Wi-Fi name and password in code you share ([[credentials-handling]]).']
    }
  ],
  quiz: [
    { q: 'The person-detection model runs with no errors but answers "person" for everything. What is the most likely cause?', choices: ['The chip is too slow', 'The input was prepared differently from training (crop, channels or scaling)', 'The PSRAM is too small', 'The camera is JPEG'], a: 1, why: 'A mismatch in crop, channels or number scaling feeds the model data unlike its training. It still runs and answers, confidently and wrongly.' },
    { q: 'A 96 × 96 grayscale input has how many numbers?', choices: ['96', '9,216', '27,648', '921,600'], a: 1, why: '96 × 96 is 9,216 pixels, one number each. An RGB image of the same size would have three times as many (27,648).' },
    { q: 'Why crop a square from the centre instead of squashing a 320 × 240 frame to 96 × 96?', choices: ['Squashing is slower', 'Squashing changes the proportions of the shapes the model learned', 'Cropping gives more colour', 'The camera cannot squash'], a: 1, why: 'A squashed frame distorts every shape in it, so the model sees objects it was never trained on. Cropping keeps the proportions.' },
    { q: 'Sending frames to a public cloud classifier is just a different place to run the same computation.', a: false, why: 'It also sends images of people to another party, adds delay and needs the network. Local processing or your own server keeps the pictures on your side.' }
  ],
  applications: [
    'A yes/no "is anyone there?" classifier that wakes a display or a recorder.',
    'Checking whether a parking space, a door or a bin is occupied or open.',
    'Sorting parts or produce on a small line by a trained class.',
    'Teaching models from your own pictures with an online training service, then running them on the chip.'
  ],
  sources: [
    'TensorFlow Lite for Microcontrollers documentation: the person-detection example and its input format.',
    'Espressif, ESP-DL documentation: running quantized models on ESP32-S3 and ESP32-P4.',
    'Edge Impulse documentation: collecting images and exporting a model for a microcontroller.'
  ],
  sim: { id: 'cv-sampling', params: { size: 'FRAMESIZE_96X96', gray: true } }
}
,
/* ================================================================ cameras-and-the-law */
{
  id: 'cameras-and-the-law',
  parent: 'camera-and-vision',
  title: 'Cameras, microphones and the law',
  level: 1,
  short: 'A camera or a microphone records people, and that carries duties: tell them, collect no more than you need, keep it briefly, and protect it. The rules differ by country and change; the engineering choices that reduce the risk are the same everywhere.',
  keywords: ['privacy', 'consent', 'GDPR', 'signage', 'surveillance', 'audio recording', 'microphone', 'neighbour', 'public space', 'retention', 'data minimisation', 'DORI', 'pixels per metre', 'privacy mask', 'biometric', 'doorbell camera', 'household exemption', 'wiretap'],
  prereq: ['camera-sensors', 'video-streaming', 'face-detection'],
  related: ['privacy-and-data-protection', 'regulations-cra-and-red', 'i2s-microphones', 'voice-assistants', 'web-interface-security', 'credentials-handling', 'esp32-cam-boards', 'project-doorbell-camera'],
  body: `An ESP32 camera costs less than a meal, and the law treats it much like any surveillance camera. This page is not legal advice, and the law differs by country, state and context, and changes. What follows is the common shape of it, and what an engineer can do about it.

### Why cameras and microphones are special

A picture of a person who can be identified is personal data in many places, among them the European Union under the GDPR. Recording **audio** is often restricted more tightly than video: in many places recording a conversation you are not part of is illegal, and in some places everyone in it must agree. A camera pointed into a neighbour's window or garden, into a toilet, changing room or bedroom, or at employees or children, raises separate problems.

### The common duties

- **Tell people.** A visible sign, and a clear statement of who is responsible and why.
- **A purpose, and no more than it needs.** Watching your own door is not the same as watching the street.
- **Keep it briefly.** Delete when the purpose is served: days, not years.
- **Protect it.** An open stream or a stolen card is a leak of people's images.
- **Special cases.** Face recognition and other biometric identification are held to stricter rules. In the EU the Court of Justice held in the Ryneš case (2014) that a home camera that also films a public space is not covered by the "household" exemption.

### Engineering that reduces the risk

1. **See no more than you need.** A narrower lens or a tighter crop, and a *privacy mask* that blanks the neighbour's window.
2. **Use the lowest resolution that does the job.** The simulation below shows how many pixels cover a face at a distance. A common surveillance guideline (IEC 62676-4) uses 25 pixels per metre to *detect* a person, about 62 to *observe*, 125 to *recognise* and 250 to *identify* one. A doorbell does not need the last.
3. **Process on the device and keep numbers, not pictures** ([[motion-detection]], [[face-detection]]).
4. **Delete automatically.**
5. **Show it works:** an indicator that lights while recording, or a shutter.
6. **Lock it down:** logins, no open ports, encrypted storage, no default passwords ([[web-interface-security]], [[credentials-handling]]).
7. **Keep it local** unless a cloud service is needed ([[privacy-and-data-protection]]).

### Microphones

Everything above applies to audio, with the extra risk that a microphone hears what the camera cannot see. A voice assistant listens for a wake word locally; say what leaves the device and when ([[voice-assistants]]).

> [!warn] Before you point a camera or open a microphone anywhere other people are: check your country's and region's law, tell them, record the least you need, and keep it briefly. If it is a workplace, a rented home or shared space, ask first.

> [!key] A camera records people, so: tell them, collect the least you need, keep it briefly and protect it. Narrow the view, lower the resolution, process on the device and keep numbers instead of pictures.`,
  ideas: [
    'Pictures of identifiable people are personal data in many places, and audio recording is often more tightly restricted than video.',
    'The common duties are to tell people, to have a purpose and take no more than it needs, to keep it briefly and to protect it.',
    'You can reduce risk in the design: narrower view, privacy masks, lower resolution, on-device processing, short retention and indicators.',
    'A resolution guideline (25, 62.5, 125 and 250 pixels per metre) says when a camera can detect, observe, recognise or identify a person.'
  ],
  pitfalls: [
    'It is my own camera on my own property, so no rules apply — Where it films a public place, a neighbour or visitors, the rules often do apply, and in the EU a camera covering public space is outside the household exemption.',
    'A video-only camera is always fine — Audio is usually regulated more tightly, and a camera with a microphone can fall foul of laws on recording conversations.',
    'Higher resolution is always better for security — Higher resolution identifies more people more clearly, so it carries more duty; choose the lowest that serves the purpose.'
  ],
  terms: [
    { term: 'Data minimisation', def: 'Collecting and keeping only the data a purpose needs and no more: for a camera, a narrower view, a lower resolution and the shortest retention that works.' },
    { term: 'Privacy mask', also: ['masked zone', 'exclusion zone'], def: 'An area of the picture that the device blanks or never processes, such as a neighbour\'s window, so that it is not recorded.' },
    { term: 'Pixels per metre', also: ['DORI', 'px/m'], def: 'How many pixels of the picture cover a metre of the scene. The IEC 62676-4 guideline names 25 to detect, 62.5 to observe, 125 to recognise and 250 to identify a person.' },
    { term: 'Retention period', also: ['retention'], def: 'How long recorded pictures or sounds are kept before they are deleted. It should be as short as the purpose allows.' },
    { term: 'Biometric data', also: ['face template'], def: 'Data about a body or behaviour, such as a face template, used to identify a person. Many laws put it in a stricter class than ordinary pictures.' }
  ],
  choose: {
    good: ['A narrow view that covers only your own door or space, with a visible sign', 'The lowest resolution that does the job, and automatic deletion', 'On-device counting or detection, keeping numbers and not pictures'],
    avoid: ['A camera that sees a neighbour\'s window or garden, or a public street, without need', 'Hidden cameras and hidden microphones', 'Face recognition used because it is available, not because it is needed'],
    check: ['The law of your country and region on cameras, audio and biometric data', 'Who is in the picture, and whether they have been told', 'How the pictures are protected, and when they are deleted']
  },
  code: [],
  quiz: [
    { q: 'A camera has a 66.5-degree lens and is 1280 pixels wide. At 5 m it gives about 195 pixels per metre. By the common guideline, what can it do?', choices: ['Only detect a person', 'Observe and recognise a person, but not reliably identify them', 'Identify a person reliably', 'Nothing useful'], a: 1, why: '195 is above the 125 px/m for recognising and below the 250 for identifying a person.' },
    { q: 'A doorbell camera in a block of flats films the whole corridor. Which change reduces the risk the most?', choices: ['A higher resolution', 'A narrower view and a privacy mask so only the doorstep is covered', 'Recording audio as well', 'Streaming it to the cloud'], a: 1, why: 'The corridor holds neighbours who have not agreed to be filmed. Seeing less of them, and keeping less, reduces the duty and the harm.' },
    { q: 'A camera that only records video, with no microphone, needs less care than one that also records sound.', a: true, why: 'Audio recording is often regulated more strictly than video, and in some places all parties to a conversation must consent. Video still needs care, but audio adds legal risk.' },
    { q: 'Your own camera filming your own front garden and the public pavement beyond is always outside data-protection rules because it is yours.', a: false, why: 'Where it films a public place, many jurisdictions apply the rules, and in the EU the Ryneš judgement says the household exemption does not cover that.' }
  ],
  applications: [
    'Deciding the field of view and signage of a doorbell or garden camera.',
    'Choosing to count visitors on the device instead of recording a stream.',
    'Setting a retention period and automatic deletion on a time-lapse or motion camera.',
    'Preparing a product that has a microphone for the rules that apply to it.'
  ],
  sources: [
    'Regulation (EU) 2016/679 (GDPR), and the EDPB Guidelines 3/2019 on processing of personal data through video devices.',
    'IEC 62676-4, Video surveillance systems for use in security applications: application guidelines (the pixel-density levels).',
    'Your national or state law on surveillance, audio recording and workplace monitoring.'
  ],
  sim: 'cv-target'
}
);
