/* HYPER-ESP32 · content/specialised-boards.js
 *
 * Boards built for a job (topic code: sb). Board facts come from the board catalogue (LilyGO, Heltec, Ai-Thinker,
 * Sunton, Guition, Elecrow, Waveshare, Wireless-Tag, Makerfabs, Olimex, read on 2026-10-04); programs follow
 * API-CRIB.md where it speaks, and say so where a library (RadioLib, esp32-camera, GxEPD2) is outside it.
 */
Hyper.add(
/* ================================================================ LilyGO T-Display */
{
  id: 'lilygo-t-display-family',
  parent: 'specialised-boards',
  title: 'LilyGO T-Display and its relatives',
  level: 1,
  short: 'A T-Display is an ESP32 that arrives with its screen, two buttons, USB and a battery charger already on the board. The family runs from a 1.14-inch SPI screen to AMOLED, bar and round displays, and every member has its own pin traps.',
  keywords: ['T-Display', 'TTGO', 'LilyGO', 'T-Display-S3', 'ST7789', 'CH9102', 'AMOLED', 'T-QT', 'T-Dongle-S3', 'T-Display-Bar', 'battery divider', 'POWER_ON', 'GPIO15', 'TFT_eSPI', 'parallel display', 'screen board'],
  prereq: ['anatomy-of-a-dev-board', 'colour-tft-displays', 'measuring-battery-level'],
  related: ['cheap-yellow-display', 'touch-display-boards', 'wearables-and-handhelds', 'display-interfaces', 'graphics-libraries', 'lithium-cells', 'm5-stick-controllers'],
  body: `A **T-Display** is what you get when someone decides that most ESP32 gadgets want a screen, and builds the board that way: microcontroller, colour display, two buttons, USB-C and a lithium-cell charger on one small board. LilyGO, whose older boards carry the name TTGO, began with a 1.14-inch panel and has kept widening the family; the catalogue lists 61 LilyGO boards.

### Three generations

| | TTGO T-Display | T-Display-S3 | T-Display-S3 AMOLED |
|---|---|---|---|
| Chip | ESP32 | ESP32-S3, 16 MB flash, 8 MB PSRAM | ESP32-S3, 16 MB flash, 8 MB PSRAM |
| Screen | 1.14″ IPS, 135 × 240, ST7789V | 1.9″ IPS, 170 × 320, ST7789 | 1.91″ AMOLED, 240 × 536, RM67162 |
| Screen bus | SPI | 8-bit parallel | four-line SPI (QSPI) |
| User buttons | GPIO35 and GPIO0 | GPIO0 and GPIO14 | GPIO0 (BOOT) |
| Battery sense | GPIO34, through a switch on GPIO14 | GPIO4 | GPIO4 |


### What the board does behind your back

- **The battery divider has a switch.** On the original the cell reaches GPIO34 through a divider, and a switch on GPIO14 must be driven first. On the S3 the sense pin is GPIO4, which cannot be read while USB-C is plugged in.
- **The screen's power is a GPIO.** On the T-Display-S3, GPIO15 must be driven high, or the screen stays off when the board runs from a battery or the 5V pin. From USB it seems to work without it, so the omission survives testing.
- **Native USB waits for a host.** An S3 board on a battery may wait for a computer; for battery use, build with "USB CDC on boot" disabled.
- **GPIO35 is input-only,** so button 1 of the original has no internal pull-up to lean on: the board must carry its own ([[input-only-and-special-pins]]).

### Which library draws on it

The original's ST7789 hangs on SPI (MOSI 19, SCLK 18, CS 5, DC 16, reset 23, backlight 4). The S3 drives its controller through eight data lines and write and read strobes, so a set-up written for the SPI board does not work on it. LilyGO names Arduino-ESP32 2.0.14 as the newest core that TFT_eSPI works with on the S3, though the library has had fixes for core 3.x since; at the time of writing, use the set-up LilyGO ships, or Arduino_GFX or LovyanGFX ([[graphics-libraries]]).

### Reading the battery

A lithium cell reaches 4.2 V when full, so a divider halves it for the ADC and the program doubles the reading; the formula below handles any pair. The resistor values are not in the catalogue: check your revision's schematic, and remember that voltage is only a rough gauge of charge ([[measuring-battery-level]]).

### The wider family

- **AMOLED, Pro, Long, Bar:** a 1.91-inch AMOLED, a 2.33-inch panel, a 180 × 640 bar and a 76 × 284 bar.
- **C5 and P4 versions,** and smaller ones: the T-QT (0.85 inch) and the T-Dongle-S3, a USB stick with a screen.

> [!key] A T-Display is a screen board: chip, display, buttons and charger come wired. Its traps are what the wiring hides: a switched battery divider, a power-on pin, input-only buttons and a screen bus that changes between generations.`,
  ideas: [
    'A T-Display puts an ESP32 or ESP32-S3, a colour screen, two buttons, USB-C and a battery charger on one board.',
    'The screen bus changes with the generation: SPI on the original, 8-bit parallel on the T-Display-S3, QSPI on the AMOLED boards, so a library set-up does not move between them.',
    'The battery is read through a divider: on the original a switch on GPIO14 must be on, on the S3 the reading fails while USB-C is plugged in.',
    'On the T-Display-S3, GPIO15 must be high for the screen to light when the board runs from a battery.'
  ],
  pitfalls: [
    `The battery reads zero, so the divider is broken — The original has a switch on GPIO14 in front of the divider. Until the program drives that pin, the divider is not connected.`,
    `If it lights from USB, it will light from a battery — On the T-Display-S3 the screen's power pin (GPIO15) must be driven high. From USB the board happens to work without it; from a battery it stays dark.`,
    `All T-Display boards use the same screen set-up — The original uses SPI, the S3 an 8-bit parallel bus and the AMOLED boards QSPI. A configuration file for one does not fit another.`
  ],
  terms: [
    { term: 'T-Display', also: ['TTGO T-Display', 'LilyGO T-Display'], def: 'A family of LilyGO boards that put an ESP32 or ESP32-S3, a colour screen, two buttons, USB and a battery charger on one small board. The name covers the original 1.14-inch board and many later ones.' },
    { term: 'Battery sense divider', also: ['VBAT divider', 'battery ADC pin'], def: 'Two resistors that scale a lithium cell\'s voltage (up to 4.2 V) down into the ADC\'s range so the program can read it. On the original T-Display a switch can disconnect it to save current.' },
    { term: 'Power-on pin', also: ['POWER_ON', 'peripheral power enable'], def: 'A GPIO that must be driven high to switch on the supply of the screen or other parts. On the T-Display-S3 it is GPIO15; forgotten, the board works from USB and stays dark from a battery.' },
    { term: 'i80 bus', also: ['8080 bus', '8-bit parallel bus', 'parallel TFT'], def: 'A display interface that sends one byte on eight data lines for each pulse of a write strobe, with chip-select, data/command and read lines beside it. Faster than SPI; the T-Display-S3 uses it.' },
    { term: 'IPS', also: ['IPS TFT', 'in-plane switching'], def: 'A liquid-crystal panel type with wide viewing angles and steady colour. The screens of the T-Display boards are IPS, unlike the AMOLED versions, which light each dot themselves.' }
  ],
  choose: {
    good: ['A small, battery-powered gadget that must show a status without a case or wiring', 'Dashboards, clocks and badges, where two buttons are all the input needed', 'Learning to drive a colour display without soldering anything'],
    avoid: ['A project that needs many free pins: the screen and its wires take most of them', 'Reading the battery while USB-C is plugged in on the S3 boards', 'A shared library set-up written for a different T-Display generation'],
    check: ['The generation: screen bus, button pins and battery pin differ', 'The power-on pin and the battery divider switch in your revision', 'Which graphics library and which Arduino core version the maker\'s example uses']
  },
  formulas: [
    {
      name: 'Battery voltage behind a divider',
      expr: 'Vbat = Vadc*(R1 + R2)/R2',
      tex: 'V_{\\text{bat}} = V_{\\text{adc}}\\,\\frac{R_1 + R_2}{R_2}',
      vars: {
        Vbat: { name: 'battery voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{bat}}' },
        Vadc: { name: 'voltage at the ADC pin', q: 'voltage', unit: 'V', value: 1.87, tex: 'V_{\\text{adc}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_2' }
      },
      note: 'Assumes the ADC draws no current. The two values are an assumption for the original T-Display (equal resistors, a factor of two): read them from your board\'s schematic.',
      stories: { Vbat: 'The ADC pin reads {Vadc} behind a divider of {R1} over {R2}. What is the battery voltage?', Vadc: 'A cell at its full 4.2 V sits behind a divider of {R1} over {R2}. What does the ADC pin see?' },
      practice: { unknowns: ['Vbat', 'Vadc'] }
    }
  ],
  examples: [
    {
      title: 'Is the battery half full?',
      q: 'On the original T-Display the calibrated ADC reading on GPIO34 is 1870 mV, with the divider switch on. The divider halves the voltage. How full is the cell, roughly?',
      steps: ['The cell is twice the pin voltage: $2 \\times 1.87 = 3.74$ V.', 'A lithium-ion cell near 3.7 V is about half charged; 4.2 V is full and 3.0 V is empty, and the curve between is far from a straight line.', 'Under load the voltage sags, so a reading taken while the radio transmits looks lower than the cell\'s resting value.'],
      a: 'The battery is at 3.74 V, about half full. Read it at rest, and treat it as a gauge, not a measurement.'
    }
  ],
  code: [
    {
      title: 'Battery voltage and the two buttons',
      about: 'Switches the divider on, reports the battery voltage once a second and prints a line each time a button is pressed. The pins are those of the original TTGO T-Display.',
      needs: 'A TTGO T-Display (ESP32, 1.14 inch) with a lithium cell connected, and USB-C. On a T-Display-S3 use GPIO4 for the battery, GPIO0 and GPIO14 for the buttons, drive GPIO15 high first, and read the battery only without USB.',
      wiring: [['GPIO34', 'battery voltage through the on-board divider', 'ADC1: fine with Wi-Fi on'], ['GPIO14', 'switch that connects the divider', 'drive high before reading'], ['GPIO35', 'button 1', 'input only: no internal pull-up'], ['GPIO0', 'button 2 (BOOT)', 'internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (14) as [output v]
          set pin (14) to [HIGH v]
          set pin (35) as [input v]
          set pin (0) as [input with pull-up v]

        every (1) seconds
          print (join [battery mV: ] ((analog read pin (34) in millivolts) * (2)))

        when pin (35) goes [low v]
          print [button 1 pressed]

        when pin (0) goes [low v]
          print [button 2 pressed]
      `,
      cpp: String.raw`
        const int BATTERY = 34;      // battery voltage through the divider
        const int ADC_EN  = 14;      // switch that connects the divider
        const int BUTTON1 = 35;      // input only: no internal pull-up
        const int BUTTON2 = 0;       // the BOOT button

        bool was1 = false, was2 = false;
        uint32_t lastReport = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(ADC_EN, OUTPUT);
          digitalWrite(ADC_EN, HIGH);          // connect the divider
          pinMode(BUTTON1, INPUT);
          pinMode(BUTTON2, INPUT_PULLUP);
        }

        void loop() {
          bool down1 = digitalRead(BUTTON1) == LOW;
          bool down2 = digitalRead(BUTTON2) == LOW;
          if (down1 && !was1) Serial.println("button 1 pressed");
          if (down2 && !was2) Serial.println("button 2 pressed");
          was1 = down1;
          was2 = down2;

          if (millis() - lastReport >= 1000) {
            lastReport += 1000;
            uint32_t mv = analogReadMilliVolts(BATTERY) * 2;   // the divider halves the voltage
            Serial.printf("battery mV: %lu\n", (unsigned long)mv);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        adc_en = Pin(14, Pin.OUT, value=1)           # switch that connects the divider
        battery = ADC(Pin(34), atten=ADC.ATTN_11DB)  # battery voltage through the divider
        button1 = Pin(35, Pin.IN)                    # input only: no internal pull-up
        button2 = Pin(0, Pin.IN, Pin.PULL_UP)        # the BOOT button

        was1 = was2 = False
        last = time.ticks_ms()

        while True:
            down1 = button1.value() == 0
            down2 = button2.value() == 0
            if down1 and not was1:
                print("button 1 pressed")
            if down2 and not was2:
                print("button 2 pressed")
            was1, was2 = down1, down2

            if time.ticks_diff(time.ticks_ms(), last) >= 1000:
                last = time.ticks_add(last, 1000)
                mv = battery.read_uv() // 1000 * 2   # the divider halves the voltage
                print("battery mV:", mv)
            time.sleep_ms(10)
      `,
      output: `
        battery mV: 3982
        button 1 pressed
        battery mV: 3981
      `,
      notes: ['A mechanical button bounces: one press may print twice. See [[debouncing]].', 'GPIO35 and GPIO34 are ADC1 inputs on the ESP32, so reading them is safe while Wi-Fi runs ([[adc1-adc2-and-wifi]]).']
    }
  ],
  quiz: [
    { q: 'On the original T-Display the program reads GPIO34 and always gets about zero, although a charged cell is connected. What is the most likely missing step?', choices: ['Raising the ADC resolution', 'Driving the divider switch on GPIO14 high', 'Using ADC2 instead of ADC1', 'Pressing the BOOT button'], a: 1, why: 'The catalogue records that the ADC power switch on GPIO14 must be driven before the battery on GPIO34 can be read. Until then the divider is not connected to the cell.' },
    { q: 'A T-Display-S3 shows a picture from USB but stays dark from a lithium cell. What should you check first?', choices: ['That GPIO15 is driven high', 'That the cell is 5 V', 'That GPIO35 has a pull-up', 'That the flash is 16 MB'], a: 0, why: 'GPIO15 switches the supply of the screen and other parts. On USB the board happens to work without the program setting it; from a battery or the 5V pin it must be high.' },
    { q: 'Button 1 of the original T-Display is on GPIO35, so pinMode(35, INPUT_PULLUP) gives it a pull-up.', a: false, why: 'GPIO35 is input-only and has no internal pull resistors. The pull-up has to be on the board, outside the chip.' },
    { q: 'A TFT_eSPI configuration that works on the original T-Display is copied to a T-Display-S3 and the screen stays blank. Why?', choices: ['The S3 has no screen controller', 'The S3 drives its screen over an 8-bit parallel bus, not SPI', 'TFT_eSPI cannot draw on 170-pixel-wide screens', 'The S3 needs a 5 V backlight'], a: 1, why: 'The original talks SPI to its ST7789V. The S3 sends bytes over eight data lines with a write strobe, so the library needs the parallel set-up and the right pins.' }
  ],
  applications: [
    'A desk clock, weather panel or badge on a lithium cell, with the two buttons for paging.',
    'A sensor node that shows its last reading on the board, so it can be checked without a phone.',
    'A first project in drawing graphics: the screen is already wired and the chip is fast enough for animation.',
    'A native-USB gadget on the S3 version: a keyboard or MIDI controller with a status screen.'
  ],
  sources: [
    'LilyGO, the TTGO T-Display and T-Display-S3 repositories on GitHub: pin definitions, schematics and the TFT_eSPI set-ups.',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*: GPIO tables, input-only pins and ADC channels.',
    'Sitronix, *ST7789V datasheet*: the display controller of the T-Display screens.'
  ],
  sim: 'sb-tdisplay-status'
}
,
/* ================================================================ LoRa boards */
{
  id: 'lora-boards',
  parent: 'specialised-boards',
  title: 'LoRa boards: Heltec, T-Beam, LoRa32',
  level: 2,
  short: 'A LoRa board puts a second radio beside the ESP32: a Semtech chip that sends small packets over kilometres. What differs between boards is the radio chip and band, the antenna, the OLED, the battery and the revision.',
  keywords: ['LoRa board', 'Heltec', 'WiFi LoRa 32', 'T-Beam', 'LoRa32', 'T3-S3', 'SX1276', 'SX1278', 'SX1262', 'SX1280', 'LR1121', 'Meshtastic', 'Vext', 'duty cycle', 'antenna', '868 MHz', '915 MHz', '433 MHz'],
  prereq: ['anatomy-of-a-dev-board', 'lora', 'radio-basics'],
  related: ['lora-parameters', 'lorawan', 'meshtastic', 'sub-ghz-radios', 'transmit-power-and-regulations', 'project-lora-field-sensor', 'choosing-a-board'],
  body: `A LoRa board is a microcontroller with a long-range radio beside it. The ESP32 brings Wi-Fi, Bluetooth LE, your program and usually a small OLED; the second radio, a Semtech chip that the ESP32 talks to over SPI, sends short packets over kilometres at a few hundred bits a second. [[lora]] explains the modulation; this page is about the boards. The catalogue flags 51 boards with LoRa: 35 on an ESP32-S3, 8 on the original ESP32, a few on the C6, P4 and C3. LilyGO makes 19 and Heltec 17.

### What is on the board

- **The ESP32 or ESP32-S3,** with Wi-Fi and Bluetooth LE on their own antenna.
- **The LoRa chip.** SX1276 and SX1278 are the older pair (868/915 MHz and 433 MHz). The SX1262 is the newer design, with a BUSY line the driver must watch. Some LilyGO boards offer an SX1280 (2.4 GHz) or an LR1121.
- **A separate antenna connector for LoRa:** the Wi-Fi antenna cannot serve it.
- **A 0.96-inch OLED** on I2C (0x3C) on most; a battery connector and charger; sometimes an SD slot or a GNSS receiver.

| | LilyGO LoRa32 V1.6.1 | Heltec WiFi LoRa 32 V3 | LilyGO T-Beam v1.2 |
|---|---|---|---|
| Chip | ESP32 | ESP32-S3, 8 MB flash | ESP32, 4 MB flash, 8 MB PSRAM |
| Radio | SX1276 (868/915 MHz) or SX1278 (433 MHz) | SX1262, 863–928 MHz or 470–510 MHz versions | SX1276, SX1278 or SX1262 by variant |
| Also on board | OLED, SD slot, battery sense on GPIO35 | OLED, battery sense on GPIO1 behind a switch on GPIO37 | GNSS receiver, power chip, 18650 holder |

### The traps

- **The band is a purchase choice.** Radio variants are made for one band, and the antenna must match it. One LilyGO record lists the SX1276 as 830–945 MHz, so buy the antenna for the band you will use, not the chip.
- **Antenna first.** The T-Beam's own documentation warns that transmitting with no antenna can damage the radio.
- **Same name, different revision.** The LoRa32 V1.3 resets the radio on GPIO14, the V1.6 on GPIO23; Heltec moved the OLED and Vext pins between V2 and V3; the T-Beam's power chip differs between v1.1 and v1.2.
- **Switched rails.** On the Heltec V3 the OLED is powered from the Vext rail on GPIO36, which the program must switch on first.
- **A strapping pin in use:** on the T-Beam, GPIO12 carries the GNSS serial line ([[strapping-pins]]).
- **Sleep current belongs to the board:** Heltec's V3.2 datasheet quotes under 10 µA, the V2 about 800 µA.

### The law and the airtime

Transmit power, bands and duty cycle are regulated; check your country's rules. In much of Europe the busiest 868 MHz sub-bands limit a device to about 1 % of the time on air. A 20-byte packet at spreading factor 7 and 125 kHz lasts about 57 ms and allows about 636 an hour; at spreading factor 12 it lasts 1.3 s and allows 27.

> [!key] A LoRa board is an ESP32 plus a Semtech radio, an antenna of the right band and, usually, an OLED and a charger. Pick the radio chip and band for your country, fit the antenna before transmitting, and check the revision before trusting a pin map.`,
  ideas: [
    'A LoRa board adds a Semtech radio (SX1276, SX1278, SX1262, sometimes SX1280 or LR1121) beside the ESP32, talking SPI.',
    'The radio is made for one band and needs its own antenna; the Wi-Fi antenna does not serve it.',
    'The same board name hides revisions with different pins and parts, so match the sketch to the revision.',
    'Duty-cycle limits make airtime the budget: a slower, longer-range setting sends far fewer packets an hour.'
  ],
  pitfalls: [
    `The radio will work on any frequency I set — The chip variant, the matching network and the antenna are built for one band, and the law allows only certain frequencies and powers. Buy for the band you may use.`,
    `The board's own antenna handles LoRa — The board's built-in antenna is for Wi-Fi and Bluetooth. LoRa has its own connector, and transmitting without an antenna can damage the radio.`,
    `A sketch for a Heltec V2 runs on a V3 — V3 moved the OLED and Vext pins and uses a different ESP32 and radio chip, so a V2 sketch fails.`
  ],
  terms: [
    { term: 'SX1276', also: ['SX1278', 'SX127x'], def: 'The older Semtech LoRa chip family: the SX1276 covers the 868 and 915 MHz bands, the SX1278 the 433 MHz band. Controlled over SPI with a few interrupt lines (DIO0, DIO1).' },
    { term: 'SX1262', also: ['SX126x'], def: 'The newer Semtech LoRa chip. Its driver uses a BUSY line and one interrupt (DIO1); a board is built for either 863–928 MHz or 470–510 MHz.' },
    { term: 'Duty cycle', also: ['time-on-air limit', 'duty-cycle limit'], def: 'The share of time a transmitter may be on the air, set by regulation. A 1 % limit allows 36 seconds of transmission in an hour, however it is divided among packets.' },
    { term: 'Time on air', also: ['airtime', 'ToA'], def: 'How long one packet occupies the channel. It grows with payload and with spreading factor, and it is what the duty-cycle limit is measured against.' },
    { term: 'Vext', also: ['switched 3.3 V rail', 'VEXT_CTRL'], def: 'A 3.3 V output that the board can switch on and off from a GPIO. Heltec boards power the OLED and the header pins from it, so the program must enable it first.' }
  ],
  choose: {
    good: ['Sensors and trackers that send a few bytes every few minutes over kilometres', 'Meshtastic and other LoRa mesh nodes, with an OLED to read messages', 'Point-to-point links between two boards, with no gateway or internet'],
    avoid: ['Anything that streams data or needs many packets a minute: the duty cycle forbids it', 'A band the board was not built for, or an antenna of another band', 'Mixing revisions of one name in the same project'],
    check: ['The radio chip and the frequency band printed on the board or the listing', 'The revision: V1.3 against V1.6, V2 against V3, v1.1 against v1.2', 'The antenna connector type and that the antenna is fitted', 'Your country\'s rules for power and duty cycle']
  },
  formulas: [
    {
      name: 'Packets an hour under a duty-cycle limit',
      expr: 'N = 3600*d/Ton',
      tex: 'N = \\frac{3600\\, d}{T_{\\text{on}}}',
      vars: {
        N: { name: 'packets an hour', q: 'count' },
        d: { name: 'duty-cycle limit', q: 'ratio', unit: '%', value: 1, min: 0.01, max: 100 },
        Ton: { name: 'time on air of one packet', q: 'time', unit: 'ms', value: 185, tex: 'T_{\\text{on}}' }
      },
      note: 'Take the airtime from the LoRa parameters (the second simulation below). 185 ms is a 20-byte packet at spreading factor 9 and 125 kHz. Some bands use other rules, such as a listen-before-talk.',
      stories: { N: 'A band allows {d} duty cycle and one packet lasts {Ton} on the air. How many packets an hour may a device send?', Ton: 'A device may send {N} an hour under a {d} limit. How long may each packet last?' },
      practice: { unknowns: ['N', 'Ton'] }
    }
  ],
  code: [
    {
      title: 'Send a LoRa packet every thirty seconds',
      about: 'Starts the SX1276 of a LilyGO LoRa32, sets the spreading factor and power, and sends a numbered text packet. Pick the frequency for your country: 868 MHz here.',
      needs: 'A LilyGO LoRa32 V1.6.1 (SX1276) with its LoRa antenna fitted, and the RadioLib library. Boards with an SX1262 use the SX1262 class and the pins CS, DIO1, reset and BUSY of their own record.',
      libs: ['RadioLib'],
      wiring: [['GPIO5', 'LoRa SCK'], ['GPIO19', 'LoRa MISO'], ['GPIO27', 'LoRa MOSI'], ['GPIO18', 'LoRa chip select'], ['GPIO26', 'LoRa DIO0'], ['GPIO23', 'LoRa reset', 'GPIO14 on a V1.3'], ['GPIO33', 'LoRa DIO1']],
      blocks: `
        when started
          start serial at (115200) baud
          start LoRa radio at (868) MHz :: radio
          set LoRa spreading factor (9) :: radio
          set LoRa power (14) dBm :: radio
          set [counter v] to (0)

        every (30) seconds
          send (join [hello ] (counter)) by LoRa :: radio
          change [counter v] by (1)
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <RadioLib.h>

        // LilyGO LoRa32 V1.6.1 with an SX1276: chip select, DIO0, reset, DIO1
        SX1276 radio = new Module(18, 26, 23, 33);

        int counter = 0;

        void setup() {
          Serial.begin(115200);
          SPI.begin(5, 19, 27, 18);                // SCK, MISO, MOSI, SS
          int state = radio.begin(868.0);          // carrier in MHz: the band you may use
          if (state != RADIOLIB_ERR_NONE) {
            Serial.printf("radio failed, code %d\n", state);
            while (true) delay(1000);
          }
          radio.setSpreadingFactor(9);
          radio.setOutputPower(14);                // dBm: check your country's limit
        }

        void loop() {
          String text = "hello " + String(counter++);
          int state = radio.transmit(text);
          Serial.printf("sent \"%s\", code %d\n", text.c_str(), state);
          delay(30000);                            // 30 s apart stays far inside a 1 % duty cycle
        }
      `,
      na: { py: 'MicroPython has no LoRa driver in its standard firmware. A separate driver package exists, but its interface is not covered by this guide: use the C++ version.' },
      output: `
        sent "hello 0", code 0
        sent "hello 1", code 0
      `,
      notes: ['Code 0 means the packet was sent. A receiver needs the same frequency, spreading factor, bandwidth and sync word to hear it.', 'RadioLib is a third-party library and is not part of the Arduino core; the call names here follow its own examples.', 'Use your region\'s band and a power the rules allow: 868 MHz suits Europe, 915 MHz the Americas, 433 MHz needs a 433 MHz board.']
    }
  ],
  examples: [
    {
      title: 'How often may a sensor report?',
      q: 'A sensor sends a 20-byte packet at spreading factor 12 and 125 kHz, which takes 1.32 s on the air. The band limits it to 1 % duty cycle. How many packets may it send in an hour, and what is the shortest steady interval?',
      steps: ['One percent of an hour is 36 s of airtime.', 'At 1.32 s a packet, $36 / 1.32 \\approx 27$ packets an hour.', 'Spread evenly, that is one every $3600 / 27 \\approx 133$ s, a little over two minutes.'],
      a: 'About 27 packets an hour, one every two minutes or so. At spreading factor 7 the same payload takes 57 ms and allows 636 packets an hour.'
    }
  ],
  quiz: [
    { q: 'Why should the antenna be fitted before a LoRa board is powered and may transmit?', choices: ['The antenna holds the board together', 'Transmitting into no antenna can damage the radio', 'The ESP32 will not boot without one', 'The OLED needs it'], a: 1, why: 'A transmitter with no antenna reflects its power back into the output stage. The T-Beam documentation warns of damage; the same care applies to every LoRa board.' },
    { q: 'A sketch for a Heltec WiFi LoRa 32 V2 shows nothing on a V3. What is the most likely reason?', choices: ['The V3 has no OLED', 'The V3 moved the OLED and Vext pins and uses a different chip', 'The V3 has no LoRa radio', 'The V3 needs a 5 V supply'], a: 1, why: 'Heltec changed the pin assignment between V2 and V3 and switched to an ESP32-S3 with an SX1262. Sketches are not interchangeable.' },
    { q: 'Under a 1 % duty-cycle limit, which setting lets the same 20-byte payload be sent more often?', choices: ['Spreading factor 12', 'Spreading factor 7', 'The same number, only power matters', 'Neither: the limit is per packet'], a: 1, why: 'Spreading factor 7 gives a packet of about 57 ms against 1.3 s at spreading factor 12, so the 36 seconds an hour hold many more of them.' },
    { q: 'The Wi-Fi antenna of a LoRa board also carries the LoRa signal.', a: false, why: 'The antennas are for different bands and lengths. LoRa has its own connector, and the board\'s Wi-Fi antenna cannot take its place.' }
  ],
  applications: [
    'Meshtastic messenger nodes, often a T-Beam or a Heltec V3 with an OLED.',
    'Field sensors for soil, water level or temperature that report every few minutes from kilometres away.',
    'GNSS trackers on a T-Beam, which has the receiver and an 18650 cell on the board.',
    'Point-to-point links between two boards, for a gate or a remote tank, with no gateway.'
  ],
  sources: [
    'Semtech, *SX1276/77/78/79* and *SX1261/2* datasheets: the radio chips, their bands and their interfaces.',
    'ETSI EN 300 220: short-range devices in the 25 MHz to 1 GHz range, the standard behind the European duty-cycle limits.',
    'The Heltec and LilyGO board repositories: schematics, pin definitions and the revision notes.'
  ],
  sim: ['sb-lora-anatomy', 'sb-lora-airtime']
}
,
/* ================================================================ ESP32-CAM */
{
  id: 'esp32-cam-boards',
  parent: 'specialised-boards',
  title: 'ESP32-CAM and the camera boards',
  level: 1,
  short: 'The AI-Thinker ESP32-CAM is a camera, a microSD slot and an ESP32 for a few euros, with no USB port, no BOOT button and almost no free pins. It teaches how to flash with an adapter and how a camera eats a pin map.',
  keywords: ['ESP32-CAM', 'AI-Thinker', 'OV2640', 'ESP32-CAM-MB', 'camera board', 'GPIO0', 'flash LED', 'USB-serial adapter', 'FTDI', 'PSRAM', 'T-Camera', 'XIAO ESP32S3 Sense', 'time-lapse', 'brownout', 'CameraWebServer'],
  prereq: ['anatomy-of-a-dev-board', 'usb-serial-bridges-and-auto-reset', 'strapping-pins'],
  related: ['camera-interfaces', 'the-esp32-camera-driver', 'video-streaming', 'photos-and-time-lapse', 'brownout', 'sd-cards', 'camera-and-audio-kits', 'cameras-and-the-law'],
  body: `The ESP32-CAM from Ai-Thinker is among the cheapest ways to put a Wi-Fi camera on a network. The board is an ESP-32S module with an OV2640 two-megapixel camera on a flat cable, a microSD slot, a very bright flash LED and a pad for an external antenna, in 27 × 40.5 mm. It carries 4 MB of flash and 4 MB of usable PSRAM, which matters because a picture needs a frame buffer. It has no USB port.

### Flashing it

There is no USB, and no BOOT button, only a reset button. You have two ways in:

- **The ESP32-CAM-MB base.** A carrier with a CH340C USB-serial chip that the board plugs into, and an IO0 button. Its auto-download circuit is unreliable on some clones; when it fails, hold IO0 and press RST.
- **A 3.3 V USB-serial adapter and five wires:** adapter TX to U0R (GPIO3), adapter RX to U0T (GPIO1), GND to GND, the adapter's 5 V to the board's 5V pin, and GPIO0 to GND. GPIO0 low at reset is [[boot-modes-and-download-mode|download mode]]. After the upload, remove the jumper and press reset, or the board waits for another upload.

The first simulation below lets you wire it wrongly and see what the chip does.

### Power is the quiet problem

The camera and Wi-Fi together draw bursts of current. The catalogue advises feeding the 5V pin from a supply that can give at least 500 mA; feeding 3.3 V directly often browns out. The symptom is a board that resets the moment the stream starts ([[brownout]]).

### Where the pins went

The camera takes fifteen: eight data lines (GPIO5, 18, 19, 21, 36, 39, 34, 35), the clock it needs from the chip on GPIO0, pixel clock 22, VSYNC 25, HREF 23, a two-wire control bus on GPIO26 and GPIO27, and power-down on GPIO32. GPIO16 is wired to the PSRAM chip select, and using it breaks the camera. What the header offers when the SD slot is unused is GPIO2, 4, 12, 13, 14 and 15, and three of the six are strapping pins ([[strapping-pins]]): GPIO12 high at power-up is the classic boot failure. GPIO4 also drives the flash LED and is the SD card's data line 1, so use the card in 1-bit mode to stop the LED flickering.

### Other camera boards

The catalogue flags 78 boards with a camera. When you want USB, more PSRAM and a newer chip, look to the ESP32-S3 boards: the LilyGO T-Camera S3 and T-CameraPlus-S3, the T-SIMCAM with a socket for a mobile modem, the XIAO ESP32S3 Sense, and Espressif's own kits ([[camera-and-audio-kits]]).

> [!warn] A camera records people. Where it can see others, tell them, and follow your country's law on recording and on what may be shared ([[cameras-and-the-law]]).

> [!key] The ESP32-CAM trades convenience for price: no USB, one reset button, a 5V supply that must be strong, and a header made of strapping pins. Wire GPIO0 to ground to flash, release it to run, and leave GPIO16 alone.`,
  ideas: [
    'The ESP32-CAM has a camera, 4 MB of PSRAM and a microSD slot, but no USB port and no BOOT button.',
    'To flash, wire a 3.3 V USB-serial adapter and tie GPIO0 to ground; remove the jumper and reset to run.',
    'The camera uses fifteen pins; the few left on the header include three strapping pins.',
    'Power the board from the 5V pin with a supply good for 500 mA or more: 3.3 V feeding often browns out.'
  ],
  pitfalls: [
    `The board is dead because upload fails with "Failed to connect" — Without USB there is no auto-reset. GPIO0 must be tied to ground while the chip resets; then reset again after the upload with the jumper removed.`,
    `A USB-serial adapter's 3.3 V pin will power it — The camera and Wi-Fi draw bursts that the adapter's regulator cannot give; the board resets. Use the 5V pin and a supply good for 500 mA.`,
    `The free header pins are free — They are GPIO2, 4, 12, 13, 14 and 15, which are strapping pins or the SD card's lines. GPIO16 is not free at all: it is the PSRAM chip select.`
  ],
  terms: [
    { term: 'OV2640', also: ['2 MP camera sensor'], def: 'The OmniVision two-megapixel image sensor on the ESP32-CAM. It can output JPEG itself, so the ESP32 stores and sends the compressed picture without compressing it.' },
    { term: 'USB-serial adapter', also: ['FTDI adapter', 'USB-to-TTL', 'USB-UART'], def: 'A small board that turns a computer\'s USB port into a 3.3 V serial port. A board with no USB of its own, such as the ESP32-CAM, is programmed through one.' },
    { term: 'XCLK', also: ['camera master clock', 'external clock'], def: 'The clock signal the chip must give the camera sensor to make it run, here 20 MHz on GPIO0. It is why GPIO0 cannot also serve a button on a camera board.' },
    { term: 'ESP32-CAM-MB', also: ['programming base', 'ESP32-CAM carrier'], def: 'A carrier board with a USB-serial chip and an IO0 button into which the ESP32-CAM plugs, so it can be flashed over a micro-USB cable without jumper wires.' },
    { term: 'SCCB', also: ['camera control bus', 'I2C for cameras'], def: 'The two-wire control bus of a camera sensor, near-identical to I2C. The chip uses it to set resolution, exposure and format; on the ESP32-CAM it runs on GPIO26 and GPIO27.' }
  ],
  choose: {
    good: ['The cheapest Wi-Fi camera: a stream, a time-lapse or a snapshot on a schedule', 'Photos saved to a microSD card, with the flash LED on GPIO4', 'Face-detection demonstrations and other first steps in vision'],
    avoid: ['A project that needs USB, a BOOT button or many free GPIO pins', 'Powering it from a weak 3.3 V source', 'Using GPIO16, which is wired to the PSRAM'],
    check: ['That you have a USB-serial adapter or the MB base before ordering', 'A 5 V supply good for at least 500 mA', 'Whether the SD card or the flash LED shares the pin you want', 'That cameras and recording are allowed where you place it']
  },
  code: [
    {
      title: 'Take one photo and report its size',
      about: 'Starts the camera with the ESP32-CAM\'s pin map, switches the flash LED on for a moment, captures one JPEG and prints its size. A first test that the camera, the PSRAM and the power are all right.',
      needs: 'An AI-Thinker ESP32-CAM with the camera fitted, flashed through the MB base or a USB-serial adapter (GPIO0 to ground to upload, removed to run), and a 5 V supply good for 500 mA.',
      wiring: [['GPIO4', 'flash LED', 'also the SD card\'s data line 1'], ['GPIO0', 'camera clock', 'to ground only while uploading'], ['5V', 'supply', '500 mA or more']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [output v]
          start the camera with the AI-Thinker pin map, JPEG, 800 × 600 :: my
          set pin (4) to [HIGH v]
          wait (0.1) seconds
          take a picture and keep it :: my
          set pin (4) to [LOW v]
          print (join [picture bytes: ] (size of the picture))
      `,
      cpp: String.raw`
        #include "esp_camera.h"

        const int FLASH_LED = 4;

        void setup() {
          Serial.begin(115200);
          pinMode(FLASH_LED, OUTPUT);

          camera_config_t config = {};
          config.ledc_channel = LEDC_CHANNEL_0;      // the clock for the camera uses LEDC
          config.ledc_timer = LEDC_TIMER_0;
          config.pin_d0 = 5;  config.pin_d1 = 18; config.pin_d2 = 19; config.pin_d3 = 21;
          config.pin_d4 = 36; config.pin_d5 = 39; config.pin_d6 = 34; config.pin_d7 = 35;
          config.pin_xclk = 0;  config.pin_pclk = 22; config.pin_vsync = 25; config.pin_href = 23;
          config.pin_sccb_sda = 26; config.pin_sccb_scl = 27;
          config.pin_pwdn = 32; config.pin_reset = -1;
          config.xclk_freq_hz = 20000000;
          config.pixel_format = PIXFORMAT_JPEG;      // the sensor compresses the picture
          config.frame_size = FRAMESIZE_SVGA;        // 800 x 600
          config.jpeg_quality = 12;                  // 0 to 63: lower is better quality
          config.fb_count = 1;
          config.fb_location = CAMERA_FB_IN_PSRAM;
          config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;

          if (esp_camera_init(&config) != ESP_OK) {
            Serial.println("camera init failed");
            return;
          }
          digitalWrite(FLASH_LED, HIGH);
          delay(100);
          camera_fb_t *fb = esp_camera_fb_get();
          digitalWrite(FLASH_LED, LOW);
          if (!fb) {
            Serial.println("capture failed");
            return;
          }
          Serial.printf("picture: %u x %u, %u bytes\n", (unsigned)fb->width, (unsigned)fb->height, (unsigned)fb->len);
          esp_camera_fb_return(fb);
        }

        void loop() {}
      `,
      na: { py: 'The official MicroPython firmware for the ESP32 has no camera driver. Community firmware with one exists, but it is outside this guide: use the C++ version.' },
      output: `
        picture: 800 x 600, 41872 bytes
      `,
      notes: ['"Camera init failed" (often with "probe failed" in the log) usually means a wiring, power or PSRAM problem: check the supply first.', 'The camera driver is Espressif\'s esp32-camera library, which the Arduino core includes; its calls here follow its own examples. The size of a JPEG varies with the scene.', 'The flash LED is very bright: do not look into it.']
    }
  ],
  quiz: [
    { q: 'You wire an adapter to an ESP32-CAM correctly, but the upload says "Failed to connect". What do you do?', choices: ['Swap the adapter for a 5 V one', 'Tie GPIO0 to GND, press reset, upload again', 'Press the BOOT button', 'Install the Wi-Fi driver'], a: 1, why: 'The board has no BOOT button and no auto-reset. GPIO0 low at reset puts the chip in download mode; the jumper must be in place at that moment.' },
    { q: 'The upload worked, but after you remove the adapter the camera program never starts. Which jumper did you forget?', choices: ['5V to 3V3', 'GPIO0 to GND, still fitted', 'GPIO16 to GND', 'GPIO12 to 3V3'], a: 1, why: 'GPIO0 low at reset means "wait for an upload". After flashing, remove the jumper and press reset so the chip starts the program.' },
    { q: 'A sensor with a pull-up resistor is connected to GPIO12 of an ESP32-CAM, and the board no longer boots. Why?', choices: ['GPIO12 is wired to the camera', 'GPIO12 high at power-up selects 1.8 V flash, which the module cannot use', 'GPIO12 is an input-only pin', 'The pull-up draws too much current'], a: 1, why: 'GPIO12 is a strapping pin that selects the flash voltage. Its pull-up holds it high at reset, and the 3.3 V flash then cannot be read.' },
    { q: 'The ESP32-CAM runs reliably from the 3.3 V pin of a cheap USB-serial adapter.', a: false, why: 'The camera and Wi-Fi draw bursts that such an adapter cannot supply, and the board resets. The catalogue advises the 5V pin and a supply good for 500 mA or more.' }
  ],
  applications: [
    'A time-lapse camera for plants, building sites or the sky, saving to the microSD card.',
    'A Wi-Fi doorbell or nest-box camera that serves a live picture on the home network.',
    'Face-detection and motion-detection demonstrations on Espressif\'s vision libraries.',
    'A camera on a robot or a drone mount, where its small size matters.'
  ],
  sources: [
    'Ai-Thinker, *ESP32-CAM product specification*: the pins, the camera and the SD slot.',
    'Espressif, the esp32-camera component documentation: the camera configuration structure and the pixel formats.',
    'OmniVision, OV2640 datasheet: the image sensor, its JPEG output and the control bus.'
  ],
  sim: 'sb-cam-flashing'
}
,
/* ================================================================ Cheap Yellow Display */
{
  id: 'cheap-yellow-display',
  parent: 'specialised-boards',
  title: 'The Cheap Yellow Display',
  level: 1,
  short: 'The ESP32-2432S028R, nicknamed the CYD, is a 2.8-inch touch screen with an ESP32 on its back, an RGB LED, a light sensor, a speaker and a card slot. It is among the cheapest touch interfaces there are, and it leaves about five pins free.',
  keywords: ['Cheap Yellow Display', 'CYD', 'ESP32-2432S028R', 'Sunton', 'Guition', 'JC2432W328', 'ILI9341', 'ST7789', 'XPT2046', 'resistive touch', 'TFT_eSPI', 'LDR', 'HSPI', 'free pins', 'display revision'],
  prereq: ['anatomy-of-a-dev-board', 'colour-tft-displays', 'planning-pins'],
  related: ['touch-display-boards', 'resistive-touch', 'touch-calibration-and-rotation', 'lvgl', 'graphics-libraries', 'lilygo-t-display-family', 'sd-cards'],
  body: `The **Cheap Yellow Display**, or CYD, is the nickname makers gave to the Sunton ESP32-2432S028R: a 2.8-inch touch screen of 240 × 320 dots with an ESP32 module soldered on its back. It is among the cheapest ways to get a touch interface on an ESP32, and it also carries a microSD slot, an RGB LED, a light sensor and a small speaker amplifier. The catch is that it leaves almost nothing free. Its relatives from Sunton and Guition (2432S024, 2432S032, JC2432W328) share the shape and most of the ideas.

### Where the pins went

| Part | GPIO |
|---|---|
| Display (SPI on the HSPI bus) | MISO 12, MOSI 13, SCLK 14, CS 15, DC 2, backlight 21; no reset pin |
| Touch (XPT2046, its own pins) | CLK 25, MOSI 32, MISO 39, CS 33, IRQ 36 |
| microSD (VSPI bus) | CS 5, SCK 18, MISO 19, MOSI 23 |
| RGB LED, active low | red 4, green 16, blue 17 |
| Light sensor · speaker · BOOT | 34 · 26 · 0 |

That is 21 of the module's 26 usable pins. What reaches the connectors is GPIO22 and GPIO27 (the I2C connector), GPIO35 (input-only, no pull-up) and the serial pair GPIO1 and GPIO3 on P1. The simulation below counts them.

### Three things that surprise people

- **The same name covers different displays.** The catalogue records an ILI9341 on the first two revisions and an ST7789 on the V3 and the two-USB boards. Count the USB ports, run a colour test and pick the driver to match: a wrong choice gives inverted colours or a blank screen.
- **The touch controller has its own bus,** not the display's. The library must be given GPIO25, 32, 39, 33 and 36, as a second hardware SPI bus or as software SPI.
- **The speaker is mono.** GPIO25, the touch clock, is also the second DAC channel, but only the left channel, GPIO26, reaches the amplifier.

### Telling the library about the board

TFT_eSPI takes its pins and driver chip from a set-up, not from the program: a User_Setup file, or build flags. A CYD set-up chooses the ILI9341 driver, the HSPI port and the six display pins above. LVGL, LovyanGFX and Arduino_GFX describe the same wiring in their own words ([[graphics-libraries]]).

> [!key] The CYD is a touch screen with an ESP32, an LED, a light sensor, a speaker and a card slot, and about five spare pins. Identify the display revision first, give the touch controller its own pins, and keep the connector pins for sensors.`,
  ideas: [
    'The CYD is a 2.8-inch, 240 × 320 resistive touch screen with an ESP32, microSD, RGB LED, light sensor and speaker amplifier on one board.',
    'Display, touch and SD card each have their own SPI pins, which is why only about five GPIOs are left.',
    'One model name covers several revisions with different display chips (ILI9341 or ST7789): identify yours before choosing a driver.',
    'Library set-up (pins, driver chip, bus) lives in a configuration, not in the sketch.'
  ],
  pitfalls: [
    `All CYDs are identical, so any tutorial's driver works — The catalogue records ILI9341 displays on some revisions and ST7789 on others. A wrong driver gives inverted colours or a blank screen.`,
    `The touch screen shares the display's SPI pins — It has its own five pins (25, 32, 39, 33, 36). The library needs them, usually as a second SPI bus or software SPI.`,
    `The connectors give me plenty of GPIOs — Only GPIO22 and GPIO27 are free outputs; GPIO35 is input-only, and GPIO1 and 3 are the serial port.`
  ],
  terms: [
    { term: 'CYD', also: ['Cheap Yellow Display', 'ESP32-2432S028R'], def: 'The nickname of the Sunton ESP32-2432S028R, a yellow-backed 2.8-inch resistive touch screen with an ESP32 on its back. Makers also use it for the look-alike boards of the 2432S series.' },
    { term: 'XPT2046', also: ['resistive touch controller', 'ADS7846'], def: 'A four-wire resistive touch controller with an SPI interface and an interrupt pin. It reports raw coordinates that the program must calibrate to screen dots.' },
    { term: 'HSPI', also: ['SPI2', 'second SPI bus'], def: 'The name the classic ESP32 gives its second general-purpose SPI controller. The CYD puts the display on it and the microSD card on the first (VSPI).' },
    { term: 'LDR', also: ['photoresistor', 'light-dependent resistor'], def: 'A resistor whose value changes with the light on it. Read through a voltage divider and an ADC pin, it tells a program how bright the room is.' },
    { term: 'User_Setup', also: ['TFT_eSPI set-up', 'display configuration', 'build flags'], def: 'The file, or the set of compiler flags, in which TFT_eSPI is told the driver chip, bus and pins of a display. A board is supported by a set-up that matches it.' }
  ],
  choose: {
    good: ['A touch UI prototype with LVGL, in one piece and without wiring', 'A dashboard or panel that needs an SD card, a speaker and an LED on board', 'Learning about displays, touch and graphics libraries cheaply'],
    avoid: ['A project that needs many GPIOs or a second I2C or SPI device beyond the connectors', 'Battery use over many days: the backlight is always the biggest load', 'Stereo or high-quality audio'],
    check: ['The display chip of your revision (count the USB ports, run a colour test)', 'That the library set-up names the touch pins as well as the display pins', 'Whether a resistive touch screen suits the finger-or-stylus use you need']
  },
  examples: [
    {
      title: 'How many pins are really free?',
      q: 'An ESP32-WROOM-32 module has 26 usable GPIOs. The CYD uses 6 for the display, 5 for the touch, 4 for the SD card, 3 for the LED, and one each for the light sensor, the speaker and BOOT. How many are left, and which?',
      steps: ['Used: $6 + 5 + 4 + 3 + 1 + 1 + 1 = 21$.', 'Left: $26 - 21 = 5$.', 'They are GPIO1 and 3 (the serial port on P1), GPIO22 and 27 (the I2C connector) and GPIO35 (input only).'],
      a: 'Five are left, and only two of them (22 and 27) are free for output.'
    }
  ],
  code: [
    {
      title: 'A night light that follows the room',
      about: 'Reads the light sensor on GPIO34 and sets the brightness of the red LED from it. The LED is active low, so the program writes the opposite of the level. Cover the sensor and see whether the reading rises or falls; swap the two output numbers in the mapping if you want the opposite effect.',
      needs: 'A CYD (ESP32-2432S028R). Nothing else: the sensor and the LED are on the board.',
      wiring: [['GPIO34', 'light sensor (LDR)', 'input only, ADC1'], ['GPIO4', 'red LED', 'active low']],
      blocks: `
        when started
          start serial at (115200) baud
          set PWM on pin (4) frequency (5000) resolution (8)

        every (0.2) seconds
          set [mv v] to (analog read pin (34) in millivolts)
          set [level v] to (map (mv) from (0) (3000) to (0) (255))
          set PWM on pin (4) to ((255) - (level))
          print (join [light sensor mV: ] (mv))
      `,
      cpp: String.raw`
        const int LDR   = 34;      // light sensor, input only
        const int LED_R = 4;       // red LED, active low

        void setup() {
          Serial.begin(115200);
          ledcAttach(LED_R, 5000, 8);                    // 5 kHz, 8 bits: duty 0..255
        }

        void loop() {
          int mv = analogReadMilliVolts(LDR);
          int level = map(constrain(mv, 0, 3000), 0, 3000, 0, 255);
          ledcWrite(LED_R, 255 - level);                 // active low: 255 means off
          Serial.printf("light sensor mV: %d\n", mv);
          delay(200);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC, PWM
        import time

        ldr = ADC(Pin(34), atten=ADC.ATTN_11DB)          # light sensor, input only
        led = PWM(Pin(4), freq=5000, duty_u16=65535)     # red LED, active low: full duty is off

        while True:
            mv = ldr.read_uv() // 1000
            level = max(0, min(255, mv * 255 // 3000))
            led.duty_u16(65535 - level * 257)            # active low: invert
            print("light sensor mV:", mv)
            time.sleep_ms(200)
      `,
      output: `
        light sensor mV: 1204
        light sensor mV: 1190
      `,
      notes: ['The ADC is calibrated per chip, so the numbers differ from board to board; only the trend matters here.', 'GPIO34 is an ADC1 input, so reading it is safe while Wi-Fi runs.']
    },
    {
      title: 'Write the light reading on the screen',
      about: 'Draws a title and the sensor reading with TFT_eSPI. The library learns the pins from build flags (for example in a PlatformIO build) and not from the sketch:\n\n~~~ini\nbuild_flags =\n  -DUSER_SETUP_LOADED=1\n  -DILI9341_2_DRIVER=1\n  -DUSE_HSPI_PORT=1\n  -DTFT_MISO=12 -DTFT_MOSI=13 -DTFT_SCLK=14\n  -DTFT_CS=15 -DTFT_DC=2 -DTFT_RST=-1 -DTFT_BL=21\n  -DLOAD_GLCD=1 -DLOAD_FONT2=1 -DLOAD_FONT4=1\n  -DSPI_FREQUENCY=55000000\n~~~\n\nA CYD with an ST7789 display needs the ST7789 driver flag instead of the ILI9341 one.',
      needs: 'A CYD with an ILI9341 display and the TFT_eSPI library.',
      libs: ['TFT_eSPI'],
      wiring: [['GPIO12, 13, 14', 'display MISO, MOSI, SCLK'], ['GPIO15, 2', 'display chip select, data/command'], ['GPIO21', 'backlight']],
      blocks: `
        when started
          start display [ILI9341 320 × 240 v] :: display
          clear display
          show [Light sensor] at x (10) y (10)

        every (0.25) seconds
          show (join (analog read pin (34) in millivolts) [ mV]) at x (10) y (60)
      `,
      cpp: String.raw`
        #include <TFT_eSPI.h>              // pins and driver come from the build flags

        TFT_eSPI tft;
        const int LDR = 34;

        void setup() {
          tft.init();
          tft.setRotation(1);                       // landscape
          tft.fillScreen(TFT_BLACK);
          tft.setTextColor(TFT_WHITE, TFT_BLACK);   // text on a black background overwrites old digits
          tft.drawString("Light sensor", 10, 10, 4);
        }

        void loop() {
          int mv = analogReadMilliVolts(LDR);
          tft.drawString(String(mv) + " mV    ", 10, 60, 4);
          delay(250);
        }
      `,
      na: { py: 'MicroPython has no display driver built in. The CYD runs it with a separate ILI9341 driver, whose set-up this guide does not cover: use the C++ version.' },
      notes: ['The pin numbers and driver flag are those commonly used for the ILI9341 revisions; verify them against your board, because the catalogue notes that revisions differ.', 'TFT_eSPI is a third-party library: keep its flags in the build, not in the library folder, so updates do not erase them.']
    }
  ],
  quiz: [
    { q: 'Your CYD shows inverted colours with a driver set-up copied from a tutorial. What should you suspect first?', choices: ['The ESP32 is faulty', 'Your board has a different display chip (ILI9341 or ST7789) from the tutorial\'s', 'The SD card is inserted', 'The speaker is on'], a: 1, why: 'The catalogue records that one model name covers boards with different display controllers. Count the USB ports, run a colour test and use the driver for your revision.' },
    { q: 'The screen works, but touch does nothing. What is most likely missing?', choices: ['A pull-up on GPIO21', 'The touch controller\'s own pins (25, 32, 39, 33, 36) in the library set-up', 'A faster SPI clock', 'The speaker amplifier'], a: 1, why: 'The XPT2046 is not on the display\'s bus. Its clock, data lines, chip select and interrupt use five separate pins, which the library must be told.' },
    { q: 'You need one more output for a relay driver. Which connector pin of a CYD can drive it?', choices: ['GPIO35', 'GPIO22', 'GPIO34', 'GPIO39'], a: 1, why: 'GPIO22 is on the connectors and is a normal output. GPIO35, 34 and 39 are input-only pins on the ESP32, and 34 and 39 are already taken (light sensor and touch).' },
    { q: 'The CYD can play stereo sound through its speaker connector.', a: false, why: 'Only the left DAC channel, on GPIO26, is wired to the amplifier. GPIO25 is the other DAC channel but it carries the touch clock.' }
  ],
  applications: [
    'A touch dashboard for home automation, written with LVGL, with the SD card for logs.',
    'A small game or a drawing pad, using the resistive touch and the speaker.',
    'A test bench display for sensors on the I2C connector.',
    'A teaching board: one purchase covers display, touch, ADC, PWM, SPI and SD.'
  ],
  sources: [
    'Sunton, the ESP32-2432S028R schematic and the community pin list that records its revisions.',
    'Texas Instruments, *ADS7846* datasheet: the family of the XPT2046 touch controller.',
    'Espressif, *ESP32 Series Datasheet*: SPI controllers, input-only pins and the DAC channels.'
  ],
  sim: 'sb-cyd-pins'
},
/* ================================================================ touch panels */
{
  id: 'touch-display-boards',
  parent: 'specialised-boards',
  title: 'Touch panels: CrowPanel, Waveshare, WT32-SC01',
  level: 2,
  short: 'A touch panel board is a screen with a computer behind it, from 3.5 to 10.1 inches. How the picture reaches the glass (SPI, parallel, QSPI, RGB or MIPI-DSI) decides the speed, the pins left over and the libraries that work.',
  keywords: ['touch panel', 'CrowPanel', 'Elecrow', 'Waveshare', 'WT32-SC01', 'WT32-SC01 Plus', 'Guition', 'Sunton', 'Makerfabs', 'RGB panel', 'QSPI', 'MIPI-DSI', 'GT911', 'FT6336U', 'ESP32-P4', 'HMI', 'LVGL'],
  prereq: ['cheap-yellow-display', 'display-interfaces', 'capacitive-touch-screens'],
  related: ['lvgl', 'lvgl-display-and-input-drivers', 'resistive-touch', 'm5-tab5-and-p4', 'soc-esp32-p4', 'using-psram', 'choosing-a-display'],
  body: `A touch panel board is a screen with a computer behind it: 3.5 to 10.1 inches, a touch layer, an ESP32-S3 or ESP32-P4, a microSD slot and often a speaker. It is meant to be the whole interface of a wall controller, a thermostat or a dashboard. The catalogue flags 154 boards with touch: 96 on the ESP32-S3, 20 on the original ESP32 and 17 on the ESP32-P4, from Elecrow (CrowPanel), Waveshare, Sunton, Guition, Makerfabs and Wireless-Tag.

### How the picture reaches the glass

| Interface | Seen on | What it means |
|---|---|---|
| SPI | WT32-SC01 (3.5″, ST7796S), CrowPanel 2.4 to 3.5 inch | few pins, slow redraw |
| 8-bit parallel | WT32-SC01 Plus (ST7796UI) | fast; no chip select, so the bus is not shared |
| QSPI | Guition JC3248W535, JC4827W543 | fast on few pins; TFT_eSPI cannot drive it |
| 16-bit RGB | Sunton 8048S043, CrowPanel 7.0, MaTouch | streamed from PSRAM; takes almost every GPIO |
| MIPI-DSI | Guition JC1060P470, CrowPanel Advanced 7 and 10.1 inch | phone-class; ESP32-P4 only |

An RGB panel has no memory of its own: the 800 × 480 picture sits in PSRAM and the chip streams it all the time. Wi-Fi traffic can make that flicker unless the driver uses bounce buffers. The Sunton 8048S043 leaves only GPIO17 and GPIO18 on its headers.

### The touch layer

The cheap SPI boards use a resistive XPT2046: it needs calibration and works with a stylus or a glove. The rest use capacitive controllers on I2C: the FT6336U of the WT32-SC01 (address 0x38), the GT911 on most 4.3 to 7 inch panels, the CST816 and CST820 on small ones; the AXS15231B display chip has its own inside. Some boards leave the interrupt line unwired until you add a solder bridge, so the program polls.

### The ESP32-P4 panels

The ESP32-P4 has no radio. Wi-Fi 6 and Bluetooth come from a companion ESP32-C6 on the board, reached over ESP-Hosted, and the software (Arduino, ESPHome) is still young. In return the CrowPanel Advanced 7.0 and the Guition JC1060P470 carry 32 MB of PSRAM behind a 1024 × 600 screen.

### Read the label twice

- WT32-SC01 (ESP32, SPI) and WT32-SC01 Plus (ESP32-S3, parallel) look alike and are different boards.
- Suffix letters mean touch type: C capacitive, R resistive, N none.
- The CrowPanel 7.0 basic and the CrowPanel Advance 7.0 are different designs.
- The WT32-SC01's headers are 2.0 mm pitch, and its display cables must be fitted before power.

> [!key] Choose a touch panel by its picture path and its touch controller: SPI is slow but frugal, RGB is big but takes every pin, QSPI needs the right library, and MIPI-DSI means an ESP32-P4 with a companion radio. Then check which variant the label really names.`,
  ideas: [
    'A touch panel board adds a computer to a 3.5 to 10.1 inch touch screen, with PSRAM and a card slot.',
    'The display interface decides the speed, the free pins and the usable libraries: SPI, 8-bit parallel, QSPI, RGB or MIPI-DSI.',
    'The touch layer is resistive (XPT2046) or capacitive (FT6336U, GT911, CST816); its interrupt line may be unwired.',
    'ESP32-P4 panels take Wi-Fi and Bluetooth from a companion ESP32-C6.'
  ],
  pitfalls: [
    `A bigger screen board is the same as a small one, just bigger — The interface changes: an 800 × 480 RGB panel streams from PSRAM and uses almost every GPIO, while a 3.5-inch SPI panel leaves many free.`,
    `Any graphics library drives any panel — TFT_eSPI cannot drive QSPI panels, and the MIPI-DSI panels of the ESP32-P4 need the display driver of the ESP-IDF stack.`,
    `An ESP32-P4 panel has Wi-Fi like an S3 one — The P4 has no radio. The panel carries a separate ESP32-C6 that the P4 reaches over ESP-Hosted.`
  ],
  terms: [
    { term: 'RGB panel', also: ['16-bit RGB', 'parallel RGB', 'RGB interface'], def: 'A display interface with no frame memory in the panel: the chip sends every pixel, with horizontal and vertical sync and a pixel clock, about twenty pins in all. The frame sits in the chip\'s PSRAM.' },
    { term: 'QSPI display', also: ['quad-SPI display', 'QSPI bus'], def: 'A display bus with four data lines instead of one: four bits per clock, on few pins. Used by AMOLED and some LCD panels; the library must support it.' },
    { term: 'MIPI-DSI', also: ['DSI', 'MIPI display interface'], def: 'The serial display interface of phones and tablets, carrying very high pixel rates on a few fast lanes. Among the ESP32 chips only the ESP32-P4 has it.' },
    { term: 'GT911', also: ['Goodix GT911', 'capacitive touch controller'], def: 'A capacitive touch controller on I2C that reports up to five touch points. The common touch chip of 4.3 to 7 inch panels; its interrupt line is sometimes left unwired.' },
    { term: 'Companion radio', also: ['ESP-Hosted', 'wireless co-processor'], def: 'A second chip (here an ESP32-C6) that provides Wi-Fi and Bluetooth to a chip with no radio of its own, such as the ESP32-P4, over a serial link.' }
  ],
  choose: {
    good: ['A wall panel or dashboard that is the whole interface of a device', 'A project that needs a large, bright, capacitive touch screen without building one', 'LVGL development on a board whose picture path is known to work'],
    avoid: ['A design that needs many free GPIOs beside an RGB panel', 'Battery use: a large backlight draws far more than a small board can supply for long', 'A library that does not support your panel\'s interface'],
    check: ['The display interface and the driver chip of your exact variant', 'The touch controller and whether its interrupt pin is connected', 'PSRAM size against the frame buffers you plan', 'Whether the ESP32-P4 software you need exists yet']
  },
  code: [
    {
      title: 'Find the touch controller on the bus',
      about: 'Scans the I2C bus of a WT32-SC01 and names the touch controller if it answers at 0x38. It is the first test of a new panel: if the controller does not answer, no touch library will.',
      needs: 'A WT32-SC01 (the original, ESP32) with its display and touch cables fitted before power, and USB-C.',
      wiring: [['GPIO18', 'touch controller SDA', 'on-board pull-ups'], ['GPIO19', 'touch controller SCL']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (18) SCL (19)
          set [address v] to (1)
          repeat (126)
            if <device answers at address (address)> then
              print (join [found device at address ] (address))
            end
            change [address v] by (1)
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 18;      // touch controller
        const int SCL_PIN = 19;

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
          for (uint8_t a = 1; a < 127; a++) {
            Wire.beginTransmission(a);
            if (Wire.endTransmission() == 0) {
              Serial.printf("found 0x%02X", a);
              if (a == 0x38) Serial.print("  (FT6336U touch controller)");
              Serial.println();
            }
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(19), sda=Pin(18), freq=400000)    # touch controller

        for a in i2c.scan():
            note = "  (FT6336U touch controller)" if a == 0x38 else ""
            print("found", hex(a), note)
      `,
      output: `
        found 0x38  (FT6336U touch controller)
      `,
      notes: ['On the WT32-SC01 Plus the touch controller is on GPIO6 (SDA) and GPIO5 (SCL), and its reset is shared with the screen\'s on GPIO4: take the pins from the maker\'s table.', 'Boards with a GT911 answer at 0x14 or 0x5D, depending on how the interrupt pin was held at reset.']
    }
  ],
  quiz: [
    { q: 'Why can TFT_eSPI not be used on a Guition JC3248W535?', choices: ['The board has no display', 'The panel is driven over QSPI, which TFT_eSPI does not support', 'The panel is too small', 'It needs an SD card'], a: 1, why: 'The AXS15231B panel uses four data lines. The catalogue says TFT_eSPI cannot drive QSPI panels; use Arduino_GFX or the ESP-IDF display driver.' },
    { q: 'An 800 × 480 RGB panel flickers when Wi-Fi is busy. What is the likely cause?', choices: ['The touch controller', 'PSRAM bandwidth is shared between the picture stream and the radio\'s traffic', 'The SD card is slow', 'The backlight is PWM-dimmed'], a: 1, why: 'The frame buffer lives in PSRAM and is streamed continuously. Heavy memory use by Wi-Fi can starve it, which bounce buffers in the display driver reduce.' },
    { q: 'Where does the Wi-Fi of an ESP32-P4 touch panel come from?', choices: ['The P4\'s own radio', 'A companion ESP32-C6 on the board', 'The touch controller', 'The SD card slot'], a: 1, why: 'The ESP32-P4 has no radio. The panel carries an ESP32-C6 that gives it Wi-Fi 6 and Bluetooth over a serial link.' },
    { q: 'A tutorial for the WT32-SC01 Plus drives the screen with an 8-bit parallel bus. You have the original WT32-SC01. Will the tutorial\'s display set-up work?', choices: ['Yes, they are the same board', 'No: the original drives its ST7796S over SPI', 'Yes, with a different USB cable', 'No: the original has no display'], a: 1, why: 'The original has an ESP32 and an SPI display; only the Plus, with an ESP32-S3, uses the parallel bus. Their pin tables differ.' }
  ],
  applications: [
    'Home-automation wall panels running openHASP or an LVGL interface.',
    'A machine control panel that shows state and takes settings by touch.',
    'A dashboard for sensors and energy data, with the SD card as local storage.',
    'A development board for touch interfaces before a product has its own panel.'
  ],
  sources: [
    'The makers\' product documents for the CrowPanel, Waveshare, Guition and Wireless-Tag boards: display driver, touch controller and pin tables.',
    'Espressif, *ESP-IDF Programming Guide*, LCD and touch component documentation (RGB, MIPI-DSI and I80 panels).',
    'Goodix, GT911 datasheet; FocalTech, FT6336U datasheet: the capacitive touch controllers.'
  ],
  sim: 'sb-display-chooser'
}
,
/* ================================================================ Ethernet and PoE */
{
  id: 'ethernet-and-poe-boards',
  parent: 'specialised-boards',
  title: 'Ethernet and PoE boards',
  level: 2,
  short: 'A wired ESP32 for the jobs where Wi-Fi is a poor promise. The classic ESP32 does Ethernet through a PHY chip and a 50 MHz clock; the S3 and C3 use a W5500 over SPI. With PoE, the same cable carries the power.',
  keywords: ['Ethernet', 'PoE', 'WT32-ETH01', 'Olimex ESP32-POE', 'ESP32-POE-ISO', 'T-Internet-POE', 'T-ETH-Lite', 'LAN8720', 'LAN8710A', 'RTL8201', 'W5500', 'RMII', 'MDC', 'MDIO', '802.3af', '802.3at', 'ESP32-S3-ETH'],
  prereq: ['anatomy-of-a-dev-board', 'spi', 'usb-power'],
  related: ['ethernet', 'olimex-industrial-boards', 'wifi-troubleshooting', 'power-switching-and-load-sharing', 'isolation-and-long-cables', 'modbus', 'relay-and-industrial-boards'],
  body: `Wi-Fi is convenient and a poor promise for a device that must stay connected for years behind a metal cabinet. An Ethernet board gives the ESP32 a cable, and with Power over Ethernet (PoE) the same cable brings the power. The catalogue flags 34 boards with Ethernet, 15 on the ESP32-P4 and 11 on the original ESP32. The chip can do Ethernet in two ways, and the board tells you which.

### RMII: the MAC is inside the chip

The classic ESP32 and the P4 (and the new S31) contain an Ethernet MAC, so a board adds only a PHY chip (LAN8720, LAN8710A or RTL8201) joined by the RMII bus: a 50 MHz reference clock, two management lines (MDC, MDIO) and data lines. The clock is the sticky part. Either an oscillator feeds 50 MHz into GPIO0, or the ESP32 makes it and outputs it on GPIO17. GPIO0 is also the boot pin, which is why the WT32-ETH01 must have its oscillator enabled (GPIO16) while you flash it.

| Board | PHY | Clock | MDC · MDIO | Power or reset |
|---|---|---|---|---|
| WT32-ETH01 | LAN8720A | in on GPIO0 | 23 · 18 | oscillator enable GPIO16 |
| LilyGO T-Internet-POE | LAN8720 | out on GPIO17 | 23 · 18 | reset GPIO5 |
| LilyGO T-ETH-Lite ESP32 | RTL8201 | in on GPIO0 | 23 · 18 | PHY power GPIO12 |

On Olimex boards the clock pin depends on PSRAM: a WROVER build needs the clock output on GPIO0, because GPIO16 and GPIO17 belong to the PSRAM.

### SPI: a W5500 chip

The S3, C3 and other chips have no MAC. A board adds a W5500 on SPI, as on the Waveshare ESP32-S3-ETH (SCLK 13, MOSI 11, MISO 12, CS 14, reset 9, interrupt 10) and the LilyGO T-ETH-Lite S3. It needs six pins instead of nine and runs 10/100 Mbit/s at about SPI speed.

### Power over Ethernet

PoE under IEEE 802.3af gives a device up to 12.95 W; 802.3at up to 25.5 W. The Olimex ESP32-POE takes 802.3af, and its USB ground is **not** isolated from the cable: unplug Ethernet before connecting USB, or buy the ESP32-POE-ISO, with 3000 V isolation and a converter that supplies 5 V at 400 mA. The ESP32-POE2 takes 802.3at and offers up to 25 W with a 12 V or 24 V rail. The cable itself wastes power as heat: the formula below shows how little, and why the worst case is a long cable at full load.

### Traps

- **GPIO12 powers the PHY** on the Olimex ESP32-POE and the T-ETH-Lite, and it is a strapping pin. Start Ethernet after a short delay, or "init phy failed" appears after a reset.
- **No USB** on the WT32-ETH01: use a 3.3 V adapter with GPIO0 low, and feed it a strong 5 V.
- **The PHY must match the code:** RTL8201 and LAN8720 are different driver settings.

> [!key] A wired ESP32 uses a PHY and a 50 MHz clock (classic ESP32, P4) or a W5500 over SPI (S3, C3), and PoE puts power on the same cable. Match the PHY, the clock mode and the PHY power pin to your board, and mind the isolation before connecting USB.`,
  ideas: [
    'The classic ESP32 and the P4 have an Ethernet MAC and need a PHY chip and a 50 MHz clock; the S3 and C3 use a W5500 over SPI.',
    'The 50 MHz clock comes from an oscillator into GPIO0 or from the chip on GPIO17, and the board record must match the code.',
    'PoE under 802.3af gives at most 12.95 W at the device, 802.3at 25.5 W; only isolated boards are safe to plug into USB while powered by PoE.',
    'The PHY power pin is often GPIO12, a strapping pin, so Ethernet needs a short delay before it starts.'
  ],
  pitfalls: [
    `Any Ethernet board works with the same sketch — The PHY chip, its clock mode, its address and its power pin differ between boards, and the sketch must name them.`,
    `PoE boards can be plugged into USB at any time — The Olimex ESP32-POE is not isolated: connect USB only with the Ethernet cable unplugged, or use the ISO version.`,
    `The W5500 gives the S3 the same Ethernet as a classic ESP32 — It is slower, about SPI speed, and takes SPI pins; it is Ethernet all the same, but not the chip's own MAC.`
  ],
  terms: [
    { term: 'RMII', also: ['Reduced Media-Independent Interface'], def: 'The bus between an Ethernet MAC and a PHY chip: a 50 MHz reference clock, transmit and receive data lines and a data-valid signal. The ESP32 and P4 have the MAC inside and drive the PHY over RMII.' },
    { term: 'PHY', also: ['Ethernet PHY', 'LAN8720', 'RTL8201'], def: 'The chip that turns Ethernet bits into signals on the cable and back. The LAN8720, LAN8710A and RTL8201 are the PHYs of the ESP32 boards in the catalogue.' },
    { term: 'W5500', also: ['WIZnet W5500', 'SPI Ethernet'], def: 'An Ethernet controller with its own MAC, PHY and TCP/IP engine, spoken to over SPI. Chips with no Ethernet MAC of their own, such as the ESP32-S3, use it.' },
    { term: 'PoE', also: ['Power over Ethernet', '802.3af', '802.3at'], def: 'Powering a device over the Ethernet cable. IEEE 802.3af supplies up to 12.95 W at the device and 802.3at up to 25.5 W, from a PoE switch or injector.' },
    { term: 'Galvanic isolation', also: ['isolated PoE'], def: 'A barrier (here rated 3000 V on the ESP32-POE-ISO) that keeps the cable\'s power ground from the USB and board ground, so connecting USB while PoE is live does no harm.' }
  ],
  choose: {
    good: ['A node that must stay online for years behind metal or far from an access point', 'One cable for data and power, such as a sensor hub or a gateway on the ceiling', 'A serial-to-Ethernet or RS-485 gateway'],
    avoid: ['Plugging USB into a non-isolated PoE board while the cable is live', 'A battery device: an Ethernet link draws far more than Wi-Fi in sleep', 'Assuming the code from another Ethernet board will run unchanged'],
    check: ['The PHY chip, its address, MDC and MDIO pins, and the clock mode', 'The PHY power or reset pin and whether it is a strapping pin', 'The PoE class the board takes and what your switch offers', 'Whether the board is isolated if you want to program it live']
  },
  formulas: [
    {
      name: 'Power lost in the cable',
      expr: 'Ploss = (P/V)^2*R',
      tex: 'P_{\\text{loss}} = \\left(\\frac{P}{V}\\right)^{2} R',
      vars: {
        Ploss: { name: 'power lost in the cable', q: 'power', unit: 'mW', tex: 'P_{\\text{loss}}' },
        P: { name: 'power the device draws', q: 'power', unit: 'W', value: 6 },
        V: { name: 'voltage at the switch', q: 'voltage', unit: 'V', value: 48 },
        R: { name: 'loop resistance of the cable', q: 'resistance', unit: 'Ω', value: 12.5 }
      },
      note: 'Uses the switch voltage to find the current, so it slightly understates the loss. The standards assume a worst-case channel of up to 20 Ω for 802.3af and 12.5 Ω for 802.3at over 100 m; real cables are usually better.',
      stories: { Ploss: 'A device draws {P} through a PoE cable of {R} loop resistance from a {V} supply. How much power does the cable turn to heat?' },
      practice: { unknowns: ['Ploss', 'P'] }
    }
  ],
  code: [
    {
      title: 'Bring up Ethernet and print the address',
      about: 'Starts the LAN8720 of a WT32-ETH01 with the pins and clock mode from its record, then reports the link and the address every two seconds.',
      needs: 'A WT32-ETH01 powered from 5 V (500 mA or more), flashed through a 3.3 V USB-serial adapter with GPIO0 to GND during upload, and a cable to a router.',
      wiring: [['GPIO23', 'PHY MDC'], ['GPIO18', 'PHY MDIO'], ['GPIO16', 'PHY oscillator enable'], ['GPIO0', '50 MHz clock from the oscillator', 'to GND only while uploading'], ['RJ45', 'router or switch']],
      blocks: `
        when started
          start serial at (115200) baud
          wait (0.5) seconds
          start Ethernet [LAN8720 v] address (1) MDC (23) MDIO (18) power (16) clock in on (0) :: net

        every (2) seconds
          if <Ethernet link is up :: net> then
            print (join [link up, IP ] (IP address))
          else
            print [waiting for the cable and an address]
          end
      `,
      cpp: String.raw`
        #include <ETH.h>

        // WT32-ETH01: LAN8720A, PHY address 1, oscillator enable GPIO16, MDC 23, MDIO 18, 50 MHz clock in on GPIO0
        void setup() {
          Serial.begin(115200);
          delay(500);                                    // let the PHY power up before starting it
          ETH.begin(ETH_PHY_LAN8720, 1, 23, 18, 16, ETH_CLOCK_GPIO0_IN);
        }

        void loop() {
          if (ETH.linkUp() && ETH.hasIP()) {
            Serial.print("link up, IP ");
            Serial.println(ETH.localIP());
          } else {
            Serial.println("waiting for the cable and an address");
          }
          delay(2000);
        }
      `,
      py: String.raw`
        import network
        import time
        from machine import Pin

        # WT32-ETH01: LAN8720A, PHY address 1, oscillator enable GPIO16, MDC 23, MDIO 18, 50 MHz clock in on GPIO0
        time.sleep_ms(500)                               # let the PHY power up before starting it
        lan = network.LAN(mdc=Pin(23), mdio=Pin(18), power=Pin(16), phy_type=network.PHY_LAN8720,
                          phy_addr=1, ref_clk=Pin(0), ref_clk_mode=Pin.IN)
        lan.active(True)

        while True:
            if lan.isconnected():
                print("link up, IP", lan.ipconfig("addr4")[0])
            else:
                print("waiting for the cable and an address")
            time.sleep(2)
      `,
      output: `
        waiting for the cable and an address
        link up, IP 192.168.1.57
      `,
      notes: ['Other boards change the PHY constant, the address and the pins: use the values from the board\'s own record (a T-ETH-Lite uses an RTL8201 and power pin GPIO12; a T-Internet-POE outputs the clock on GPIO17).', 'The Ethernet calls follow the Arduino core\'s ETH library and the MicroPython network.LAN class; check them against the versions you install.', 'A board with an S3 and a W5500 uses a different library and the SPI pins of its record.']
    }
  ],
  quiz: [
    { q: 'An Olimex ESP32-POE runs from a PoE switch. You plug in USB to read the serial log and the switch port shuts down. What is the lesson?', choices: ['USB cannot power Ethernet boards', 'The board is not isolated: connect USB only with the cable unplugged, or use the ISO version', 'PoE needs a 5 V USB cable', 'The serial port is in use'], a: 1, why: 'The ESP32-POE\'s grounds are shared between the PoE converter and USB. The catalogue says to unplug Ethernet first; the ESP32-POE-ISO has 3000 V isolation for this case.' },
    { q: 'A classic ESP32 board gets an Ethernet PHY. Which line must the program match to the board?', choices: ['The Wi-Fi channel', 'The 50 MHz clock mode and the PHY address and pins', 'The I2C address', 'The ADC attenuation'], a: 1, why: 'The MAC is inside the chip, but the clock either comes into GPIO0 or goes out on another pin; the PHY address, MDC, MDIO and power pins are board choices.' },
    { q: 'Why can an ESP32-S3 board not use the same Ethernet set-up as a WT32-ETH01?', choices: ['The S3 has no Wi-Fi', 'The S3 has no Ethernet MAC, so a board adds a W5500 on SPI', 'The S3 only has 100 Mbit/s', 'The S3 cannot use cables'], a: 1, why: 'The classic ESP32 and the P4 contain a MAC for an RMII PHY. The S3 and C3 do not, so boards give them a W5500 that talks SPI.' },
    { q: 'An 802.3af switch port can give a device 25 W.', a: false, why: '802.3af gives at most 12.95 W at the device. 802.3at (PoE+) gives up to 25.5 W.' }
  ],
  applications: [
    'A sensor hub or gateway on a ceiling or in a cabinet, powered and networked by one cable.',
    'A serial or RS-485 to Ethernet bridge in a plant room.',
    'A Home Assistant node where Wi-Fi is weak, such as a garage or a cellar.',
    'A display or relay controller in a building that already has PoE ports.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Ethernet chapter: MAC, PHY and RMII clock options.',
    'Microchip, LAN8720A datasheet; WIZnet, W5500 datasheet: the two kinds of Ethernet chip on these boards.',
    'IEEE 802.3, clauses on Power over Ethernet (802.3af and 802.3at): power classes and channel resistance.'
  ],
},
/* ================================================================ cellular boards */
{
  id: 'cellular-boards',
  parent: 'specialised-boards',
  title: 'Boards with a mobile modem',
  level: 2,
  short: 'A cellular board puts a modem beside the ESP32 for places with no Wi-Fi: a tractor, a buoy, a bicycle. The ESP32 talks to the modem with AT commands over a serial port, and the modem needs a power-up sequence, a strong supply and a SIM.',
  keywords: ['cellular', 'LTE-M', 'NB-IoT', 'LTE Cat-1', 'SIM7000G', 'A7670', 'T-SIM7000G', 'T-A7670X', 'T-SIM7670G', 'AT commands', 'PWRKEY', 'SIM card', 'GNSS', 'solar', 'TinyGSM', 'modem'],
  prereq: ['anatomy-of-a-dev-board', 'uart-on-the-esp', 'lithium-cells'],
  related: ['cellular-iot', 'solar-power', 'battery-chargers', 'gnss-receivers', 'esp-at-and-esp-hosted', 'choosing-a-long-range-link', 'transmit-power-and-regulations'],
  body: `A cellular board puts a modem beside the ESP32 so the device can reach the internet where there is no Wi-Fi: a tractor, a buoy, a bicycle. LilyGO makes most of the ones in the catalogue: the T-SIM7000G (an ESP32 with a SIM7000G modem, GNSS and solar charging), the T-A7670X (LTE Cat-1, A7670E modem) and the T-SIM7670G-S3 (an ESP32-S3 with an LTE Cat-1 modem and GNSS). The modem is a separate computer; the ESP32 only talks to it.

### Which network

- **2G (GSM/GPRS):** old and slow, and switched off by operators in many countries. Check before you rely on it.
- **LTE-M and NB-IoT:** low-power cellular for small amounts of data. The SIM7000G supports them (and 2G), but the catalogue notes that it does not support LTE Cat-1 networks: the SIM plan must allow 2G or NB-IoT.
- **LTE Cat-1:** several megabits a second, enough for a picture or an update. The A7670 and SIM7670G boards use it.

Radio variants differ by region and band, so compare the modem's band list with your operator's. A device may need a data plan made for IoT, and radio rules and certification apply.

### Talking to the modem

The ESP32 sends text lines called AT commands over a UART and reads the replies. \`AT\` answers \`OK\`; \`AT+CPIN?\` says whether the SIM is ready; \`AT+CSQ\` gives the signal quality as a number n, and the signal is −113 + 2n dBm, so 21 means −71 dBm. The same commands, from a 3GPP standard, work on all of these modems.

### Power and the power key

A modem draws current in bursts, so a USB port or a small cell struggles: the boards carry an 18650 holder or a charger fed by solar. Before it answers, a modem needs a **start-up sequence** on its power-key pin, and the catalogue repeats that the sequence must be followed. The T-A7670X uses GPIO4 for the power key, GPIO12 for the board power and GPIO5 for the reset; its serial pair is GPIO26 and GPIO27.

### Traps

- **Siblings differ.** The T-A7670, T-A7608 and T-SIM7670G boards use different pins; the maker's own constants for your exact board are the truth.
- **Battery reading:** on the T-SIM7000G the battery voltage on GPIO35 cannot be read while USB is plugged in.
- **Modem firmware has bugs:** the SIM7000G firmware 1529B08 has trouble with MQTT over TLS on port 8883; the maker recommends 1529B10.
- **Charge cells only through the board's charger,** and never a swollen cell ([[battery-chargers]]).

> [!key] A cellular board is an ESP32 with a modem that you talk to in AT commands. Match the network technology to the SIM and the operator, follow the power-key sequence, give the modem a strong supply and take the pins from your exact board.`,
  ideas: [
    'The modem is a separate computer: the ESP32 sends it AT commands over a UART and reads the replies.',
    'The network technology (2G, LTE-M, NB-IoT or LTE Cat-1) must match both the modem and the SIM plan.',
    'The modem needs a power-key start-up sequence and bursts of current that USB or a small cell may not give.',
    'Sibling boards of one family use different pins: take them from the record of your exact board.'
  ],
  pitfalls: [
    `Any SIM will work in any cellular board — The SIM7000G does not support LTE Cat-1, so the plan must allow 2G or NB-IoT. Match the SIM to the modem's technologies and bands.`,
    `The modem answers as soon as the board has power — Most modems need a start-up sequence on the power-key pin first. No answer to AT usually means the sequence, the pins or the supply.`,
    `USB power is enough — A modem draws current in bursts when it transmits; a weak supply makes the board reset or the modem drop off the network.`
  ],
  terms: [
    { term: 'AT command', also: ['Hayes command', 'AT+ command'], def: 'A text line starting with AT that a modem understands, such as AT+CSQ for signal strength. The same set is defined by the 3GPP standards for mobile modems.' },
    { term: 'LTE-M', also: ['LTE Cat-M1', 'Cat-M'], def: 'A low-power cellular technology for IoT devices: modest data rates, deep sleep modes and good coverage inside buildings.' },
    { term: 'NB-IoT', also: ['narrowband IoT', 'Cat-NB1'], def: 'A cellular technology for very small, rare messages, with the lowest power and the lowest speed of the IoT technologies. Not every operator offers it.' },
    { term: 'LTE Cat-1', also: ['Cat-1', 'LTE category 1'], def: 'A mobile data category of a few megabits a second, enough for photos and firmware updates. Used by the A7670 and SIM7670G boards.' },
    { term: 'PWRKEY', also: ['power key', 'modem power pin'], def: 'The pin of a modem that must be pulsed in a defined way to switch it on. On a board it is wired to a GPIO the program must drive.' }
  ],
  choose: {
    good: ['Trackers, tank and field monitors and anything that moves away from Wi-Fi', 'Remote sites powered by solar with a lithium cell', 'A device that must report even when a customer has no network to offer'],
    avoid: ['A 2G-only modem in a country that is switching 2G off', 'A weak or shared 3.3 V supply, or a coin cell', 'Assuming one SIM works with every board'],
    check: ['The modem\'s technologies and bands against your operator\'s', 'The start-up sequence and the serial pins of your exact board', 'The peak current of the modem against your battery and charger', 'The certification of the module and the rules of your country']
  },
  code: [
    {
      title: 'Ask the modem four questions',
      about: 'Sends AT, AT+CPIN?, AT+CSQ and AT+CREG? to the modem and prints each reply. It shows whether the modem is alive, whether the SIM is ready, how strong the signal is and whether it has joined a network.',
      needs: 'A LilyGO T-A7670X with its antenna fitted and a SIM inserted. The two serial pins are the pair most often swapped between sibling boards: if the modem is silent, check the maker\'s pin table for your exact board.',
      wiring: [['GPIO26', 'ESP32 TX, to the modem'], ['GPIO27', 'ESP32 RX, from the modem'], ['GPIO4', 'modem power key', 'follow the maker\'s start-up sequence'], ['GPIO12', 'board power for the modem']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (115200) baud
          wait (3) seconds
          for each [command v] in (list [AT] [AT+CPIN?] [AT+CSQ] [AT+CREG?])
            print (join [>> ] (command))
            write (command) line to UART (1) :: bus
            wait (2) seconds
            print (text received on UART (1))
          end
      `,
      cpp: String.raw`
        const int MODEM_TX = 26;       // ESP32 TX, to the modem
        const int MODEM_RX = 27;       // ESP32 RX, from the modem
        const char *COMMANDS[] = { "AT", "AT+CPIN?", "AT+CSQ", "AT+CREG?" };

        String ask(const char *cmd) {
          Serial1.println(cmd);
          String reply;
          uint32_t start = millis();
          while (millis() - start < 2000) {
            while (Serial1.available()) reply += (char)Serial1.read();
            if (reply.indexOf("OK") >= 0 || reply.indexOf("ERROR") >= 0) break;
          }
          return reply;
        }

        void setup() {
          Serial.begin(115200);
          Serial1.begin(115200, SERIAL_8N1, MODEM_RX, MODEM_TX);   // baud, config, RX pin, TX pin
          // the board's power-on sequence for the modem goes here: see the maker's own example
          delay(3000);
          for (const char *cmd : COMMANDS) {
            Serial.printf(">> %s\n", cmd);
            Serial.println(ask(cmd));
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import UART
        import time

        MODEM_TX = 26       # ESP32 TX, to the modem
        MODEM_RX = 27       # ESP32 RX, from the modem
        COMMANDS = ["AT", "AT+CPIN?", "AT+CSQ", "AT+CREG?"]

        uart = UART(1, baudrate=115200, tx=MODEM_TX, rx=MODEM_RX)
        # the board's power-on sequence for the modem goes here: see the maker's own example
        time.sleep(3)

        def ask(cmd):
            uart.write(cmd + "\r\n")
            reply = b""
            start = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), start) < 2000:
                if uart.any():
                    reply += uart.read()
                if b"OK" in reply or b"ERROR" in reply:
                    break
                time.sleep_ms(20)
            return reply.decode()

        for cmd in COMMANDS:
            print(">>", cmd)
            print(ask(cmd))
      `,
      output: `
        >> AT
        AT
        OK
        >> AT+CPIN?
        AT+CPIN?
        +CPIN: READY
        OK
        >> AT+CSQ
        AT+CSQ
        +CSQ: 21,99
        OK
      `,
      notes: ['The modem echoes each command back, which is why every reply starts with it. +CSQ: 21,99 means −71 dBm; 99 means the signal is not known.', 'Without the power-on sequence the modem stays silent. The sequence is board-specific, so use the maker\'s example for it.', 'A library such as TinyGSM wraps these commands for data connections; this program shows what it does underneath.']
    }
  ],
  quiz: [
    { q: 'A T-A7670X is powered and the program sends AT, but nothing comes back. What do you check first?', choices: ['The Wi-Fi password', 'The power-key sequence, the serial pins and the supply', 'The I2C address', 'The OLED'], a: 1, why: 'A modem stays silent until its power key has been pulsed as the maker describes, and it needs the right serial pair and a strong supply. These three explain almost every silent modem.' },
    { q: 'The modem replies +CSQ: 21,99. What is the signal strength?', choices: ['21 dBm', 'About −71 dBm', 'About −113 dBm', '99 %'], a: 1, why: 'The value n maps to −113 + 2n dBm, so 21 gives −71 dBm. A value of 99 in the second field only means the bit error rate is unknown.' },
    { q: 'A SIM7000G board is given a plan that offers only LTE Cat-1. What happens?', choices: ['It works at full speed', 'The modem cannot use it: the SIM7000G supports 2G, LTE-M and NB-IoT, not Cat-1', 'It works through Wi-Fi', 'The SIM is rejected by the ESP32'], a: 1, why: 'The catalogue notes that the SIM7000G does not support LTE Cat-1 networks. The plan must allow 2G, LTE-M or NB-IoT.' },
    { q: 'On the T-SIM7000G the battery voltage can be read on GPIO35 while the board is on USB.', a: false, why: 'The catalogue records that the battery voltage cannot be read while USB is plugged in.' }
  ],
  applications: [
    'A tracker on a bicycle, a vehicle or a shipping container, reporting position by SMS or MQTT.',
    'A solar-powered tank or field monitor with no Wi-Fi nearby.',
    'A remote sensor that sends over NB-IoT or LTE-M for years from one cell.',
    'A backup path for an alarm panel when the broadband line is down.'
  ],
  sources: [
    '3GPP TS 27.007: AT command set for user equipment, the commands used here (AT+CPIN, AT+CSQ, AT+CREG).',
    'SIMCom, SIM7000 series AT command manual and hardware design; the A7670 series documents of the same kind.',
    'The LilyGO repositories for the T-SIM7000G and the T-A7670X: pin constants and the start-up sequences.'
  ],
}
,
/* ================================================================ e-paper boards */
{
  id: 'e-paper-boards',
  parent: 'specialised-boards',
  title: 'E-paper boards',
  level: 2,
  short: 'An e-paper board shows a picture that stays with no power at all, so it spends energy only when the picture changes. It suits tags, badges and dashboards that update every few minutes, and it is poor at anything that moves.',
  keywords: ['e-paper', 'e-ink', 'EPD', 'Heltec Wireless Paper', 'CrowPanel e-paper', 'LilyGO T5', 'Waveshare e-Paper driver board', 'GxEPD2', 'partial refresh', 'full refresh', 'ghosting', 'BUSY pin', 'bistable', 'T-Deck Pro'],
  prereq: ['anatomy-of-a-dev-board', 'e-paper', 'deep-sleep'],
  related: ['battery-life-budget', 'graphics-libraries', 'pixels-and-framebuffers', 'display-interfaces', 'choosing-a-display', 'the-board-is-not-the-chip', 'lora-boards'],
  body: `An e-paper panel holds its picture with no power at all: tiny charged pigments stay where the panel put them. A display that shows a name, a price or a weather forecast therefore costs energy only at the moment it changes. That is why e-paper boards suit battery devices that update every few minutes, and why they are bad at anything that moves. The catalogue flags 28 boards with e-paper, from LilyGO, Heltec, Waveshare, Elecrow, Seeed, M5Stack, DFRobot and Adafruit.

### Boards in the catalogue

| Board | Panel | Notes |
|---|---|---|
| Heltec Wireless Paper | 2.13″, 250 × 122, black and white | ESP32-S3 and an SX1262 LoRa radio; the picture stays about 180 days unpowered; 20 µA in deep sleep; works only from 0 to 50 °C |
| Elecrow CrowPanel E-Paper 4.2″ | 400 × 300, SSD1683 | a rotary switch and buttons; a full refresh flashes and is slow |
| LilyGO T5 4.7″ (S3) | 960 × 540, 8-bit parallel | needs its own library; touch; about 380 µA asleep |
| Waveshare e-Paper ESP32 Driver Board | any Waveshare SPI panel on its flat cable | pins fixed on the board; no battery connector |

### What a refresh is

A **full refresh** drives every pixel through black and white. The panel flashes and takes one to three seconds. A **partial refresh** changes only what differs: faster, no flash, but each one leaves a faint ghost of the old picture, so after a number of them you refresh fully. While the panel works its BUSY line is high and the processor may sleep. Colour panels refresh more slowly still, and the cold slows them further.

### Writing for it

A black-and-white frame is one bit a pixel: 15 000 bytes for 400 × 300. A library such as GxEPD2 draws it in pages, so a small chip does not need the whole frame in RAM. Several panel generations share one size, and each has its own driver: the Heltec Wireless Paper V1.2 uses a new panel with new driver code. Match the panel code printed on the back of yours.

### Power

The panel is rarely the cost. A device that wakes, connects, fetches, draws and sleeps spends its energy awake, and the radio often costs more than the display. The simulation below turns an update interval into a battery life.

> [!key] E-paper keeps its picture for free and charges you for each change. Choose it for slow, readable, battery-powered information, refresh fully now and then to clear ghosts, and match the driver to the exact panel.`,
  ideas: [
    'An e-paper panel keeps its picture with no power; energy is spent only when the picture changes.',
    'A full refresh flashes and takes seconds; a partial refresh is faster but leaves ghosts, so a full one is needed now and then.',
    'The driver must match the exact panel code, because panels of one size come in generations.',
    'In a battery device the radio and the awake time cost more than the display, so the update interval sets the battery life.'
  ],
  pitfalls: [
    `E-paper is a display that sips power all the time — It draws nothing to hold a picture. It costs power only during a refresh, which is why deep sleep between updates works.`,
    `Partial refresh is just a faster refresh, so use it always — Each partial refresh leaves a faint ghost of the old picture. A full refresh clears them, and the manufacturer's advice sets how often.`,
    `A 2.13-inch driver works on any 2.13-inch panel — Panels of one size come in generations with different controllers and waveforms; the Heltec Wireless Paper changed panel and driver between revisions.`
  ],
  terms: [
    { term: 'E-paper', also: ['e-ink', 'EPD', 'electronic paper'], def: 'A reflective display of charged pigment particles that keeps its picture with no power and uses energy only to change it. Readable in sunlight; slow to refresh.' },
    { term: 'Partial refresh', also: ['fast refresh', 'partial update'], def: 'Updating only the pixels that changed, without the flashing black-and-white cycle of a full refresh. Quicker, but it leaves ghosts that accumulate until a full refresh.' },
    { term: 'Ghosting', also: ['image retention', 'residual image'], def: 'A faint remnant of an earlier picture left on an e-paper panel, most visible after many partial refreshes. A full refresh removes it.' },
    { term: 'BUSY pin', also: ['BUSY line', 'panel busy signal'], def: 'An output of the panel\'s controller that stays high while a refresh is under way. The program (or the chip, asleep) waits for it to fall before sending anything else.' },
    { term: 'Bistable display', also: ['memory display'], def: 'A display that stays in either of two states with no power. E-paper is the common example; the opposite is a backlit LCD or OLED, which stops showing anything at once when power is cut.' }
  ],
  choose: {
    good: ['Price tags, badges, signs and dashboards that change every few minutes or hours', 'Battery or solar devices that must show something readable in sunlight', 'A status that should stay visible after the power fails'],
    avoid: ['Animation, scrolling or anything above about one update a second', 'Cold places below the panel\'s working range', 'Colour or greys where speed matters'],
    check: ['The exact panel code and the driver class of your library', 'How long a full refresh takes and how often one is needed', 'Whether the board has a battery connector and a low sleep current', 'The working temperature range']
  },
  examples: [
    {
      title: 'How long on one cell?',
      q: 'A board wakes, connects and refreshes the panel in 6 s at an average of 90 mA, and sleeps at 20 µA. It does this every 10 minutes from a 1000 mAh cell, of which 80 % is usable. How long does it last? And every hour?',
      steps: ['Every 10 min: $(90 \\times 6 + 0.02 \\times 594) / 600 \\approx 0.92$ mA on average.', 'Life: $1000 \\times 0.8 / 0.92 \\approx 870$ h, about 36 days; counting the self-discharge of the cell, about 35.','Every hour: $(90 \\times 6 + 0.02 \\times 3594) / 3600 \\approx 0.17$ mA, so about 4700 h, or 196 days; with self-discharge, about five months.'],
      a: 'About 36 days at ten-minute updates and about 200 days at hourly ones. The awake time dominates: halving it does more than any sleep-current saving. The figures are teaching values; measure your own board ([[measuring-current]]).'
    }
  ],
  code: [
    {
      title: 'Write two lines on a 1.54-inch panel',
      about: 'Draws two lines with GxEPD2, refreshes the panel once and puts it to sleep. The picture stays on the panel when the board is unplugged. The pins are those of the Waveshare e-Paper ESP32 Driver Board.',
      needs: 'A Waveshare e-Paper ESP32 Driver Board with a 1.54-inch 200 × 200 black-and-white panel of the V2 type on its flat cable.',
      libs: ['GxEPD2', 'Adafruit GFX'],
      wiring: [['GPIO14', 'panel DIN (MOSI)'], ['GPIO13', 'panel SCLK'], ['GPIO15', 'panel CS'], ['GPIO27', 'panel DC'], ['GPIO26', 'panel RST'], ['GPIO25', 'panel BUSY']],
      blocks: `
        when started
          start e-paper display [1.54 inch 200 × 200 v] :: display
          clear display
          show [Hello, paper] at x (10) y (20)
          show [no power needed] at x (10) y (60)
          update display
          hibernate the display :: display
      `,
      cpp: String.raw`
        #include <GxEPD2_BW.h>
        #include <Fonts/FreeMonoBold12pt7b.h>

        // Waveshare e-Paper ESP32 Driver Board: chip select, data/command, reset, busy
        GxEPD2_BW<GxEPD2_154_D67, GxEPD2_154_D67::HEIGHT> display(GxEPD2_154_D67(/*CS=*/ 15, /*DC=*/ 27, /*RST=*/ 26, /*BUSY=*/ 25));

        void setup() {
          SPI.end();
          SPI.begin(13, 12, 14, 15);               // SCK, MISO, MOSI, SS: where the board wires the panel
          display.init(115200);
          display.setRotation(1);
          display.setFont(&FreeMonoBold12pt7b);
          display.setTextColor(GxEPD_BLACK);
          display.setFullWindow();
          display.firstPage();
          do {                                     // drawn in pages: the whole frame need not fit in RAM
            display.fillScreen(GxEPD_WHITE);
            display.setCursor(10, 40);
            display.print("Hello, paper");
            display.setCursor(10, 80);
            display.print("no power needed");
          } while (display.nextPage());
          display.hibernate();                     // the picture stays on the panel
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no e-paper driver in its standard firmware. Waveshare supplies demo drivers of its own, but their interface is not covered by this guide: use the C++ version.' },
      output: `
        The panel flashes black and white once, then shows the two lines.
        Unplug the board: they stay.
      `,
      notes: ['The display class must match the exact panel; a 1.54-inch panel of another generation uses another class from the library\'s list.', 'GxEPD2 is a third-party library. Its constructor and the SPI call follow its own examples for this driver board; check them against the version you install.']
    }
  ],
  quiz: [
    { q: 'What does an e-paper display draw while it shows a picture and nothing changes?', choices: ['About the same as when updating', 'Nothing: it holds the picture with no power', 'Half of its refresh power', 'Only the backlight power'], a: 1, why: 'The pigment particles stay in place. Energy is needed only to move them, which is why the display costs power per change, not per second.' },
    { q: 'After fifty partial refreshes the clock digits show faint grey ghosts of old numbers. What clears them?', choices: ['A faster SPI clock', 'A full refresh', 'More partial refreshes', 'A higher supply voltage'], a: 1, why: 'A full refresh drives all pixels through black and white and removes the residue that partial refreshes leave.' },
    { q: 'A battery e-paper board updates every ten minutes. Which change lengthens the battery life most?', choices: ['A shorter awake time per update (a faster Wi-Fi connection)', 'A lower deep-sleep current by half', 'A bigger font', 'A white background'], a: 0, why: 'Most of the energy is spent in the few seconds awake, at tens of milliamps. Halving the sleep current of a few microamps changes little.' },
    { q: 'A generic SPI e-paper library will drive the 4.7-inch parallel e-paper of the LilyGO T5 S3.', a: false, why: 'The T5 4.7-inch panel is driven over an 8-bit parallel bus with its own controller chain. The catalogue notes that generic SPI e-paper libraries do not work on it.' }
  ],
  applications: [
    'Electronic shelf labels and door signs that update from a server a few times a day.',
    'A weather or calendar display on a battery, readable in daylight.',
    'A LoRa node that shows its last reading on a Heltec Wireless Paper.',
    'A badge or name tag whose picture stays after the battery dies.'
  ],
  sources: [
    'The panel makers\' datasheets (for example the 2.13-inch and 1.54-inch Waveshare and GoodDisplay panels): refresh times, waveforms and temperature ranges.',
    'The GxEPD2 library documentation: the display classes and the paging model.',
    'Heltec, Elecrow, LilyGO and Waveshare board repositories for the pin maps and panel revisions.'
  ],
  sim: 'sb-epaper-refresh'
},
/* ================================================================ wearables and handhelds */
{
  id: 'wearables-and-handhelds',
  parent: 'specialised-boards',
  title: 'Watches, decks and handhelds',
  level: 2,
  short: 'LilyGO builds ESP32-S3 boards you wear or hold: the T-Watch, the T-Deck with a keyboard and trackball, the T-Embed knob and the T-Glass glasses. They are crowded boards where a power-management chip, many I2C devices and a native USB port decide what works.',
  keywords: ['T-Watch', 'T-Watch S3', 'T-Watch Ultra', 'T-Deck', 'T-Deck Plus', 'T-Embed', 'T-LoRa-Pager', 'T-TWR', 'T-Glass', 'handheld', 'wearable', 'Meshtastic', 'keyboard', 'trackball', 'rotary encoder', 'AXP2101', 'native USB'],
  prereq: ['anatomy-of-a-dev-board', 'lilygo-t-display-family', 'i2c'],
  related: ['m5-cardputer-and-specials', 'lora-boards', 'rotary-encoders', 'i2s-amplifiers-and-dacs', 'lithium-cells', 'usb-on-the-esp', 'meshtastic'],
  body: `A wearable or handheld board is an ESP32-S3 with a screen, a battery and a way to type or point, packed to be worn or held. LilyGO's line in the catalogue is the widest: the **T-Watch** (a watch), the **T-Deck** (a pocket computer with a keyboard), the **T-Embed** (a knob), the T-LoRa-Pager, the T-TWR walkie-talkie and the T-Glass smart-glasses board. M5Stack's Cardputer is on [[m5-cardputer-and-specials]].

### Watches

The T-Watch 2020 V3 is an ESP32 with a 1.54-inch 240 × 240 screen, capacitive touch, a motion sensor, a microphone, a speaker and a clock chip. The T-Watch S3 moves to an ESP32-S3 and adds a LoRa radio (SX1262 or SX1280), a haptic driver, an infrared transmitter and a PDM microphone; the S3 Plus has a 1.3-inch screen and GNSS. The T-Watch Ultra has a 2.06-inch AMOLED of 410 × 502.

### The T-Deck

A 2.8-inch 320 × 240 IPS screen with capacitive touch, a **keyboard run by its own ESP32-C3** that answers on I2C at 0x55, a five-way trackball whose centre is the BOOT button, an optional SX1262 radio, microphones, an I2S speaker, a microSD slot and, on the Plus, GNSS. It is the usual body of a Meshtastic messenger ([[meshtastic]]).

### The T-Embed

A 1.9-inch 170 × 320 screen around a rotary encoder with a push key (24 detents), a ring of seven APA102 LEDs, a speaker, two microphones and a card slot. A CC1101 variant adds a sub-GHz radio.

### What they share, and the traps

- **A power rail you must enable.** On the T-Deck GPIO10 must be high before the screen, SD card, radio or keyboard answer.
- **Dual-purpose controls.** The T-Deck's trackball centre is BOOT: hold it while plugging in USB for download mode. With the microphone in use, the GPIO0 button cannot be used. The T-Embed's download mode needs the encoder push held, then reset.
- **Shared pins.** The T-Deck Plus gives GPIO43 and 44 to its GNSS receiver, so its Grove port is unusable. Adding the T-Embed's CC1101 shield disables its microphone.
- **Native USB.** These S3 boards have no USB-serial chip: serial output needs "USB CDC on boot", and a board on a battery must not wait for a host.
- **A graphics library tied to a copy.** The T-Embed's TFT_eSPI must be the copy in the maker's repository.

> [!key] A LilyGO handheld packs a screen, input, radios and a power-management chip around an ESP32-S3. Before anything works, enable the board's power rail, learn which button is also BOOT, and check which pins a radio or GNSS option has taken.`,
  ideas: [
    'LilyGO\'s watches and handhelds are ESP32-S3 boards with a screen, touch or keys, radios and a battery, built to be worn or held.',
    'The T-Deck\'s keyboard is a separate ESP32-C3 that the S3 reads over I2C at address 0x55.',
    'Several functions share one control or pin: the trackball centre is BOOT, and options such as GNSS or a CC1101 shield take pins away.',
    'These boards need native-USB set-up and a power rail enabled in software before the peripherals respond.'
  ],
  pitfalls: [
    `The screen and keyboard work as soon as the board is powered — On the T-Deck, GPIO10 must be driven high first, or the screen, SD card, radio and keyboard do not answer.`,
    `The BOOT button is just another button — On the T-Deck it is the trackball's centre, and with the microphone in use the GPIO0 button cannot be used for input.`,
    `A T-Deck sketch fits a T-Deck Plus — The Plus gives GPIO43 and 44 to its GNSS receiver, so the Grove port on those pins is unusable.`
  ],
  terms: [
    { term: 'T-Watch', also: ['LilyGO T-Watch'], def: 'LilyGO\'s ESP32 smartwatch boards: a 1.54-inch touch screen with motion sensor, microphone, speaker and clock chip, in versions with LoRa and GNSS.' },
    { term: 'T-Deck', also: ['LilyGO T-Deck', 'T-Deck Plus'], def: 'LilyGO\'s pocket computer built on an ESP32-S3: a 2.8-inch touch screen, a keyboard with its own microcontroller, a trackball and an optional LoRa radio.' },
    { term: 'Power-management chip', also: ['PMU', 'AXP2101'], def: 'A chip that charges the battery, makes the supply rails and can switch them on and off from software. The T-Watch boards and the T-Beam use one from the AXP family.' },
    { term: 'Rotary encoder', also: ['knob', 'quadrature encoder'], def: 'A knob that sends a pulse pair for each detent as it turns, so a program can tell the direction and the number of steps. The T-Embed has one with a push key.' },
    { term: 'USB CDC on boot', also: ['CDC On Boot'], def: 'A build option of the Arduino core that makes the chip\'s built-in USB port show up as the serial port. Needed to see serial output on boards with no USB-serial chip.' }
  ],
  choose: {
    good: ['A pocket Meshtastic messenger or a handheld tool with a real keyboard', 'A watch or wrist display for sensor and notification projects', 'A knob-driven controller with a screen, lights and sound'],
    avoid: ['Battery runtimes beyond a day or two with the screen and radio on', 'Needing many free GPIOs: the peripherals take most of them', 'Mixing code between revisions or between a model and its Plus'],
    check: ['Which variant: S3 or S3 Plus, T-Deck or Plus, radio chip, display panel', 'The power rail or power-on pin the board needs', 'Which controls double as BOOT, and which options take pins']
  },
  code: [
    {
      title: 'Read the T-Deck keyboard',
      about: 'Switches on the T-Deck\'s peripheral power, then reads one byte from the keyboard\'s own microcontroller every 20 ms and prints the character. A zero byte means no key.',
      needs: 'A LilyGO T-Deck. Build for the ESP32-S3 with "USB CDC on boot" enabled so the serial monitor works.',
      wiring: [['GPIO10', 'peripheral power switch', 'must be high first'], ['GPIO18', 'I2C SDA'], ['GPIO8', 'I2C SCL']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (10) as [output v]
          set pin (10) to [HIGH v]
          wait (0.5) seconds
          start I2C on SDA (18) SCL (8)

        every (0.02) seconds
          set [key v] to (I2C read (1) bytes from address (0x55))
          if <(key) ≠ (0)> then
            print (key)
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int POWER_ON = 10;         // must be high before the peripherals answer
        const int SDA_PIN = 18;
        const int SCL_PIN = 8;
        const uint8_t KEYBOARD = 0x55;   // the keyboard has its own ESP32-C3

        void setup() {
          Serial.begin(115200);
          pinMode(POWER_ON, OUTPUT);
          digitalWrite(POWER_ON, HIGH);
          delay(500);                    // let the peripherals start
          Wire.begin(SDA_PIN, SCL_PIN);
        }

        void loop() {
          Wire.requestFrom(KEYBOARD, (size_t)1);
          if (Wire.available()) {
            char key = Wire.read();
            if (key != 0) Serial.print(key);     // 0 means no key
          }
          delay(20);
        }
      `,
      py: String.raw`
        from machine import Pin, I2C
        import time

        POWER_ON = Pin(10, Pin.OUT, value=1)     # must be high before the peripherals answer
        time.sleep_ms(500)                       # let the peripherals start
        i2c = I2C(0, scl=Pin(8), sda=Pin(18), freq=400000)
        KEYBOARD = 0x55                          # the keyboard has its own ESP32-C3

        while True:
            key = i2c.readfrom(KEYBOARD, 1)
            if key != b"\x00":                   # 0 means no key
                print(key.decode(), end="")
            time.sleep_ms(20)
      `,
      output: `
        hello t-deck
      `,
      notes: ['The pins and the address are those of the T-Deck record; the keyboard\'s own firmware defines what a key sends, so keys such as Shift return their own codes.', 'The T-Deck Plus uses GPIO43 and 44 for GNSS; this program does not touch them.']
    }
  ],
  quiz: [
    { q: 'A T-Deck program prints nothing from the keyboard although the I2C address is right. What is the most likely missing step?', choices: ['A faster I2C clock', 'Driving GPIO10 high to power the peripherals', 'Pressing the trackball', 'Using ADC1'], a: 1, why: 'The catalogue records that GPIO10 must be high before the display, SD card, LoRa radio and keyboard are touched.' },
    { q: 'How do you put a T-Deck into download mode?', choices: ['Hold the trackball centre while plugging in USB', 'Press the screen for five seconds', 'Hold the Shift key', 'It has no download mode'], a: 0, why: 'The trackball\'s centre switch is wired to BOOT, so holding it at power-up selects download mode.' },
    { q: 'Why does a program that prints to Serial show nothing on a T-Deck?', choices: ['The T-Deck has no serial port', 'The board has no USB-serial chip, so "USB CDC on boot" must be enabled', 'Serial needs Wi-Fi', 'The keyboard owns the serial port'], a: 1, why: 'On ESP32-S3 boards without a USB-serial chip the built-in USB port becomes the serial port only when CDC on boot is enabled.' },
    { q: 'The T-Deck\'s keyboard is read directly from the S3\'s GPIO matrix pins.', a: false, why: 'The keyboard is run by a separate ESP32-C3 that the S3 reads over I2C at address 0x55.' }
  ],
  applications: [
    'A pocket Meshtastic messenger on a T-Deck, with the keyboard for typing.',
    'A smartwatch for notifications, step counting and LoRa messages on a T-Watch S3.',
    'A knob-and-screen controller for lights, music or a lab instrument on a T-Embed.',
    'A teaching platform for touch, audio, radios and low-power design in one object.'
  ],
  sources: [
    'The LilyGO repositories for the T-Watch, T-Deck and T-Embed: pin definitions, the keyboard firmware and the power-on notes.',
    'Espressif, *ESP32-S3 Series Datasheet*: USB Serial/JTAG, strapping pins and peripheral limits.',
    'X-Powers, AXP2101 datasheet: the power-management chip of the watches.'
  ]
}
,
/* ================================================================ relay and industrial boards */
{
  id: 'relay-and-industrial-boards',
  parent: 'specialised-boards',
  title: 'Relay boards and ESP32 PLCs',
  level: 2,
  short: 'A relay board puts switches for mains or heavy loads beside an ESP32. The industrial versions add isolation, a wide supply and RS-485. The traps are what the relays do at power-up, what the contacts really tolerate, and the mains itself.',
  keywords: ['relay board', 'relay module', 'ESP32-EVB', 'T-Relay', 'T-Relay S3', 'ESP32-S3-Relay-6CH', 'ESP32 PLC', 'industrial', 'RS-485', 'HT74HC595', 'shift register', 'contact rating', 'inrush', 'isolation', 'opto-isolated', 'power-up glitch'],
  prereq: ['relays', 'transistor-as-a-switch', 'strapping-pins'],
  related: ['switching-mains-safely', 'solid-state-relays-and-triacs', 'optocouplers', 'io-expanders-and-shift-registers', 'rs-485', 'modbus', 'ethernet-and-poe-boards', 'project-garage-door'],
  body: `A relay board puts switches that can carry mains power or heavy DC loads next to an ESP32, so a program can switch a lamp, a pump or a heater. Industrial versions add what a plant room asks for: a supply of 7 to 36 V, isolated RS-485 and inputs, Ethernet or PoE, a rail-mount case. The catalogue flags 12 boards with relays.

> [!warn] Mains wiring is work for a qualified person, behind isolation and in an enclosure, following your local wiring code. A bare relay board on a desk is not a product. Reflashing a device that switches mains means opening it: never while it is plugged in. Test programs on a low-voltage load first.

### Boards in the catalogue

| Board | Relays | Notes |
|---|---|---|
| Olimex ESP32-EVB | 2, 10 A at 250 V AC, on GPIO32 and GPIO33 | Ethernet, CAN, IR, UEXT, LiPo charger; no BOOT button by default |
| LilyGO T-Relay S3 | 6, through an HT74HC595 shift register | RTC; optional W5500 Ethernet |
| LilyGO T-Relay (ESP32) | 4 or 8 | relay GPIOs given only in the maker's picture |
| Waveshare ESP32-S3-Relay-6CH | 6, 10 A at 250 V AC or 30 V DC, on GPIO1, 2, 41, 42, 45, 46 | opto and digital isolation, isolated RS-485, 7 to 36 V input |

### Three traps

- **The relay at power-up.** Until the program sets a pin, the chip leaves it undriven, and the board's own resistor decides. An active-low input held by a pull-down, or an active-high one by a pull-up, makes the relay click on at every reset. A pin that is also a strapping pin is worse: GPIO45 and GPIO46 of the Waveshare board are strapping pins of the S3.
- **A shift register in the way.** On the T-Relay S3 the outputs have an enable pin (GPIO4): load the pattern first, then enable, or the relays take whatever the register held.
- **Contact ratings are for easy loads.** The ampere rating holds for a resistive load. A motor, a transformer or a lamp draws several times its running current at switch-on, which wears or welds contacts: add a snubber or choose a solid-state relay ([[solid-state-relays-and-triacs]]). Relays are also slow and noisy, so never use one for PWM.

### What "industrial" adds

Isolation between the control side and the field (optocouplers and digital isolators), a wide supply input, RS-485 for Modbus ([[modbus]]), an Ethernet port and a rail-mount case. [[switching-mains-safely]] covers the mains side; this page covers the boards.

> [!key] A relay board is an ESP32 with switches, and the work is in the details: what each pin does before the program starts, what the contacts can really carry, and keeping mains out of reach of anyone but a qualified person.`,
  ideas: [
    'A relay board adds mains-rated switches to an ESP32; industrial versions add isolation, a wide supply and RS-485.',
    'At reset the relay pins are undriven, so the board\'s resistors decide whether a relay clicks on at every power-up.',
    'A shift register between the chip and the relays needs its output enable handled in the right order.',
    'Contact ratings assume a resistive load; motors, transformers and lamps need derating, a snubber or a solid-state relay.'
  ],
  pitfalls: [
    `A relay rated 10 A switches any 10 A load — The rating is for a resistive load. A motor or transformer draws several times its running current at switch-on, which wears or welds the contacts.`,
    `My program sets the relay off in setup(), so it can never click at boot — The chip has been in reset and the bootloader for a while before setup() runs. Only the circuit around the pin decides what the relay does in that time.`,
    `It is safe on a desk, so it is safe in the wall — Mains must be wired by a qualified person, behind isolation and in an enclosure; a bare board is not a product.`
  ],
  terms: [
    { term: 'Relay board', also: ['relay module', 'ESP32 PLC', 'relay controller'], def: 'A board with an ESP32 and one or more relays (and usually their drivers), meant to switch loads that the chip\'s pins cannot. Industrial versions add isolation and field buses.' },
    { term: 'Contact rating', also: ['switching capacity'], def: 'The current and voltage a relay\'s contacts may switch, given for a stated load type. A rating for a resistive load is far higher than for a motor or lamp.' },
    { term: 'Inrush current', also: ['switch-on surge'], def: 'The brief, large current a load draws when first switched on: several times the running value for motors, transformers and incandescent lamps.' },
    { term: 'Output enable', also: ['OE', 'OE pin'], def: 'A pin that connects or disconnects the outputs of a chip such as the 74HC595 shift register. Keeping the outputs off until the pattern is loaded avoids a glitch.' },
    { term: 'Snubber', also: ['RC snubber', 'contact protection'], def: 'A resistor and capacitor across a relay contact or load that absorbs the voltage spike of switching an inductive load, reducing arcing and wear.' }
  ],
  choose: {
    good: ['Switching lamps, valves, pumps and heaters from Wi-Fi, Ethernet or Modbus', 'Panels where the board\'s isolation, wide supply and screw terminals are already designed in', 'Learning relay control with a low-voltage load'],
    avoid: ['Mains wiring by anyone but a qualified person', 'PWM or fast switching on a mechanical relay', 'Motor or transformer loads at the full contact rating'],
    check: ['The contact rating for your load type, and the voltage', 'What the relay pins do at reset, and whether any is a strapping pin', 'Whether the control side is isolated from the supply and the field', 'Enclosure, creepage distances and local rules']
  },
  code: [
    {
      title: 'A relay that starts off and clicks safely',
      about: 'Starts with the relay off, switches it on for two seconds every ten and keeps the timing without blocking. The on and off levels are named, because many relay modules switch on LOW.',
      needs: 'An Olimex ESP32-EVB (relay 1 on GPIO32). Test with a low-voltage load such as a 12 V lamp or a buzzer on a safe supply, never mains.',
      wiring: [['GPIO32', 'relay 1 driver'], ['relay contacts', 'a low-voltage test load', 'never mains for this test']],
      blocks: `
        when started
          set pin (32) as [output v]
          set pin (32) to [LOW v]

        every (10) seconds
          set pin (32) to [HIGH v]
          wait (2) seconds
          set pin (32) to [LOW v]
      `,
      cpp: String.raw`
        const int RELAY1 = 32;               // Olimex ESP32-EVB, relay 1
        const int RELAY_ON  = HIGH;          // check your board: many relay modules switch on LOW
        const int RELAY_OFF = LOW;

        uint32_t lastChange = 0;
        bool relayOn = false;

        void setup() {
          pinMode(RELAY1, OUTPUT);
          digitalWrite(RELAY1, RELAY_OFF);   // start safe: off
        }

        void loop() {
          uint32_t period = relayOn ? 2000 : 8000;      // 2 s on, 8 s off
          if (millis() - lastChange >= period) {
            lastChange = millis();
            relayOn = !relayOn;
            digitalWrite(RELAY1, relayOn ? RELAY_ON : RELAY_OFF);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        RELAY_ON, RELAY_OFF = 1, 0           # check your board: many relay modules switch on LOW
        relay = Pin(32, Pin.OUT, value=RELAY_OFF)    # Olimex ESP32-EVB, relay 1: start safe, off

        last = time.ticks_ms()
        on = False

        while True:
            period = 2000 if on else 8000    # 2 s on, 8 s off
            if time.ticks_diff(time.ticks_ms(), last) >= period:
                last = time.ticks_ms()
                on = not on
                relay.value(RELAY_ON if on else RELAY_OFF)
      `,
      notes: ['Even this program cannot stop a relay clicking while the chip is still in reset: that is up to the board\'s resistors (see the simulation).', 'The relay logic level (high or low to switch on) is not in the catalogue for these boards; read your board\'s schematic or test with a meter before connecting a load.']
    }
  ],
  quiz: [
    { q: 'A relay board clicks on for half a second every time the ESP32 resets, then off. The program sets the pin off first thing. What explains it?', choices: ['The program is wrong', 'Until setup() runs, the pin is undriven and the board\'s resistor holds it at the "on" level', 'The relay is faulty', 'The ESP32 sends a test pulse'], a: 1, why: 'During reset and boot the pin is high-impedance, so the board\'s pull resistor decides. A pull in the active direction switches the relay until the program takes over.' },
    { q: 'A relay rated 10 A at 250 V AC switches a motor that runs at 6 A. Why may it still fail early?', choices: ['The voltage is too high', 'The motor\'s starting current is several times 6 A, beyond a resistive rating', '6 A is below the minimum current', 'Relays cannot switch motors at all'], a: 1, why: 'Contact ratings are for a resistive load. A motor\'s switch-on surge can be five or more times its running current, and the arcing wears or welds the contacts.' },
    { q: 'The Waveshare ESP32-S3-Relay-6CH uses GPIO45 and GPIO46 for relays. Why is that worth a thought?', choices: ['They are input-only pins', 'They are strapping pins of the S3, read at reset', 'They are the USB pins', 'They have no PWM'], a: 1, why: 'Strapping pins are sampled at reset. A relay circuit that pulls one of them can change how the chip boots, so check it.' },
    { q: 'A mechanical relay is a good way to dim a lamp with PWM.', a: false, why: 'A relay takes milliseconds to move and wears out with every operation: it cannot follow PWM. Use a triac dimmer or a solid-state device made for it, with the mains precautions above.' }
  ],
  applications: [
    'Switching a pump, a valve or a heater from Home Assistant or an MQTT broker.',
    'A Modbus slave on RS-485 that controls lights in a building.',
    'A control box in a machine, with isolated inputs and a wide-range supply.',
    'A relay board in a gate or garage-door controller with its own enclosure and fuse.'
  ],
  sources: [
    'The Olimex ESP32-EVB, LilyGO T-Relay and Waveshare ESP32-S3-Relay-6CH documents: relay ratings, pins and isolation.',
    'IEC 61810-1: electromechanical elementary relays, the basis of contact ratings and load categories.',
    'Espressif, *ESP32-S3 Series Datasheet*: strapping pins and pin states during reset.'
  ],
  sim: 'sb-relay-boot'
},
/* ================================================================ ESP-01 and ESP-12 */
{
  id: 'esp-01-and-esp-12',
  parent: 'specialised-boards',
  title: 'ESP-01 and ESP-12: the ESP8266 classics',
  level: 2,
  short: 'The ESP-01 and ESP-12 carry the ESP8266, the chip that made cheap Wi-Fi possible. Countless tutorials and many devices still use them. They need a clean 3.3 V supply, care at boot and a separate software core, and for new designs the C2 or C3 is the better choice.',
  keywords: ['ESP-01', 'ESP-01S', 'ESP-12', 'ESP-12F', 'ESP8266', 'ESP8285', 'Ai-Thinker', 'NodeMCU', 'D1 mini', 'GPIO0', 'GPIO2', 'GPIO15', 'CH_PD', 'AT firmware', 'esp8266 Arduino core', 'not recommended for new designs'],
  prereq: ['soc-esp8266', 'strapping-pins', 'three-volt-logic'],
  related: ['nodemcu-and-doit-boards', 'lolin-d1-mini-family', 'esp-at-and-esp-hosted', 'soc-esp32-c2', 'soc-esp32-c3', 'usb-serial-adapters', 'flashing-and-esptool'],
  body: `The ESP-01 taught the world that Wi-Fi could cost less than lunch: an ESP8266 on a two-by-four header, with a flash chip, an antenna etched on the board, and nothing else. The ESP-12F is the same chip on a larger module with 22 pads and 4 MB of flash, the module under many NodeMCU and D1 mini boards. Both still run a great many devices and tutorials.

### The chip

The ESP8266 has one 160 MHz core, 160 KB of RAM, Wi-Fi 4 only (no Bluetooth), 17 GPIOs, one 10-bit ADC that reads only 0 to 1 V, and about 20 µA in deep sleep. Espressif has marked it **not recommended for new designs** since November 2025 and points to the [[soc-esp32-c2|ESP32-C2]]. Its software is a separate Arduino core, MicroPython and ESPHome; the ESP-IDF does not support it.

### Eight pins, two of them yours

The ESP-01's header has GND, VCC, TXD, RXD, CH_PD (enable), RST, GPIO0 and GPIO2. Only GPIO0 and GPIO2 are free, and both are strapping pins. The ESP-01S has a blue LED on GPIO2 that lights when the pin is low, and pull-ups on EN and RST.

### Booting and flashing

At reset the chip reads GPIO15, GPIO0 and GPIO2. For a normal start GPIO0 and GPIO2 must be high and GPIO15 low; for a download over the serial port, GPIO0 is held low and GPIO2 stays high. The ESP-01 fixes GPIO15 inside the module, but on an ESP-12F of your own design you add a pull-down on GPIO15 and a pull-up on GPIO2. The simulation lets you try the combinations. The ROM prints its boot log at 74880 baud, so a serial monitor at 115200 shows garbage for a moment; this is normal.

### Power, the usual killer

The module has no regulator: 3.3 V only, and a few hundred milliamps in peaks while transmitting. The 3.3 V pin of a cheap USB-serial adapter often cannot give it, and the module resets. 5 V on VCC or on the RX pin destroys it. CH_PD must be high. GPIO1 (TXD) must not be pulled low during power-up.

### Where they still make sense

As a serial-to-Wi-Fi bridge for another microcontroller, with the AT firmware ([[esp-at-and-esp-hosted]]); as a one- or two-pin switch in a tiny space; in repairs. For anything new, choose an ESP32-C3 or C2.

> [!key] The ESP8266 modules are cheap and everywhere, and need a clean 3.3 V, a pull-up on GPIO2 and a low GPIO15 at boot. Treat the ESP-01 as two pins and a radio, and start new designs on an ESP32-C2 or C3.`,
  ideas: [
    'The ESP-01 and ESP-12 carry the ESP8266: one 160 MHz core, Wi-Fi 4, 17 GPIOs and a 0 to 1 V ADC.',
    'The ESP-01 exposes only GPIO0 and GPIO2, and both are strapping pins; an ESP-12F needs GPIO15 low and GPIO2 high at boot.',
    'The modules have no regulator and need a clean 3.3 V with peaks of a few hundred milliamps; 5 V destroys them.',
    'The chip is not recommended for new designs: its useful roles are legacy devices, a serial Wi-Fi bridge and repairs.'
  ],
  pitfalls: [
    `The ESP-01 can be powered from the 3.3 V pin of any USB-serial adapter — Many adapters cannot supply the radio's current peaks, and the module resets. Give it its own 3.3 V regulator.`,
    `It is a 5 V-tolerant module like an Arduino — 5 V on VCC or on RX kills it. Everything is 3.3 V.`,
    `GPIO0 and GPIO2 are two ordinary I/O pins — Both set the boot mode. GPIO0 low at reset means download mode; GPIO2 must be high at boot.`
  ],
  terms: [
    { term: 'ESP8266', also: ['ESP8266EX', 'ESP8285'], def: 'Espressif\'s first Wi-Fi microcontroller (2014): one 160 MHz core, Wi-Fi 4, 17 GPIOs. The ESP8285 is the same chip with 1 or 2 MB of flash inside. Marked not recommended for new designs since 2025.' },
    { term: 'ESP-01', also: ['ESP-01S'], def: 'Ai-Thinker\'s smallest ESP8266 board: a two-by-four header with a PCB antenna, a flash chip and one or two LEDs, and only GPIO0 and GPIO2 as free pins.' },
    { term: 'ESP-12F', also: ['ESP-12E', 'ESP-12'], def: 'Ai-Thinker\'s ESP8266 module with 22 pads and 4 MB of flash. It is the module on NodeMCU and D1 mini boards, and the part a custom ESP8266 board is built around.' },
    { term: 'CH_PD', also: ['EN', 'chip enable'], def: 'The enable pin of an ESP8266 module. It must be held high for the chip to run; the ESP-01S fits pull-ups on it and on RST.' },
    { term: 'AT firmware', also: ['ESP-AT'], def: 'Espressif\'s ready-made firmware that turns the chip into a serial Wi-Fi modem: another microcontroller sends it text commands such as AT+CWJAP to connect to a network.' }
  ],
  choose: {
    good: ['Adding Wi-Fi to another microcontroller through a serial port with the AT firmware', 'A one- or two-pin switch or sensor in a very small space', 'Repairing or extending an existing ESP8266 device'],
    avoid: ['New designs: the ESP32-C2 and C3 cost about the same and have more of everything', 'Bluetooth, many pins, a second ADC or deep software support', 'Powering from a weak 3.3 V pin'],
    check: ['A clean 3.3 V supply with room for peaks', 'GPIO0, GPIO2 and GPIO15 at power-up', 'Which software: the esp8266 Arduino core, MicroPython or ESPHome', 'Whether the module is an ESP-01, ESP-01S or ESP-12F: pins and flash differ']
  },
  code: [
    {
      title: 'A Wi-Fi switch for the on-board LED',
      about: 'Joins your Wi-Fi, prints its address and serves two addresses: /on lights the ESP-01S\'s blue LED and /off puts it out. The LED is active low: it lights when GPIO2 is low.',
      needs: 'An ESP-01S on a 3.3 V supply, flashed through a USB-serial adapter with GPIO0 held low during the upload, and your Wi-Fi name and password. Do not leave credentials in code you share ([[credentials-handling]]).',
      wiring: [['GPIO2', 'the blue LED', 'active low'], ['GPIO0', 'to GND only while uploading'], ['VCC', '3.3 V, a few hundred milliamps']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set pin (2) to [HIGH v]
          connect to Wi-Fi [your-ssid] password [your-password]
          print (IP address)
          start web server on port (80)

        when request for [/on] arrives
          set pin (2) to [LOW v]

        when request for [/off] arrives
          set pin (2) to [HIGH v]
      `,
      cpp: String.raw`
        #include <ESP8266WiFi.h>
        #include <ESP8266WebServer.h>

        const char *SSID = "your-ssid";
        const char *PASSWORD = "your-password";
        const int LED = 2;                 // the ESP-01S's blue LED: lit when the pin is LOW

        ESP8266WebServer server(80);

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          digitalWrite(LED, HIGH);         // off
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASSWORD);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());

          server.on("/on", []() { digitalWrite(LED, LOW); server.send(200, "text/plain", "LED on"); });
          server.on("/off", []() { digitalWrite(LED, HIGH); server.send(200, "text/plain", "LED off"); });
          server.begin();
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import network
        import socket
        from machine import Pin

        SSID = "your-ssid"
        PASSWORD = "your-password"
        led = Pin(2, Pin.OUT, value=1)       # the ESP-01S's blue LED: lit when the pin is low

        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            pass
        print(wlan.ifconfig()[0])

        server = socket.socket()
        server.bind(("", 80))
        server.listen(2)

        while True:
            conn, addr = server.accept()
            request = conn.recv(512).decode()
            if "GET /on" in request:
                led.value(0)
                body = "LED on"
            elif "GET /off" in request:
                led.value(1)
                body = "LED off"
            else:
                body = "use /on or /off"
            conn.send("HTTP/1.0 200 OK\r\nContent-Type: text/plain\r\n\r\n" + body)
            conn.close()
      `,
      output: `
        192.168.1.64
      `,
      notes: ['Browse to http://the-address/on and /off from a phone on the same network. Anyone on that network can do the same: this is a teaching example, not a secured device ([[web-interface-security]]).', 'The ESP8266 Arduino core is a separate project from the ESP32 core, and MicroPython for the ESP8266 needs a build for a board with enough flash: check the ESP-01\'s flash size first.', 'On the ESP-01S GPIO2 also carries UART1\'s transmit line, but nothing here uses it.']
    }
  ],
  quiz: [
    { q: 'An ESP-01S resets as soon as it tries to join Wi-Fi when powered from a USB-serial adapter\'s 3.3 V pin. What is the likely cause?', choices: ['The Wi-Fi password is wrong', 'The adapter cannot supply the radio\'s current peaks', 'GPIO2 is low', 'The antenna is missing'], a: 1, why: 'The catalogue warns that the 3.3 V pin of cheap adapters often browns the module out. Use a proper 3.3 V regulator with room for a few hundred milliamps.' },
    { q: 'What must hold at reset for the ESP8266 to enter its serial download mode?', choices: ['GPIO0 low, GPIO2 high, GPIO15 low', 'GPIO0 high, GPIO2 low', 'GPIO15 high, GPIO0 low', 'All three low'], a: 0, why: 'GPIO15 low selects UART or flash boot; with GPIO2 high, GPIO0 low asks for the serial bootloader and GPIO0 high boots the program.' },
    { q: 'You build a board around a bare ESP-12F and it will not start. GPIO15 is left floating. What do you add?', choices: ['A pull-up on GPIO15', 'A pull-down on GPIO15 (and a pull-up on GPIO2)', 'A capacitor on GPIO0', 'A crystal'], a: 1, why: 'GPIO15 must be low and GPIO2 high at boot. Dev boards fit those resistors; a custom board must.' },
    { q: 'A serial monitor at 115200 baud shows a burst of garbage just after reset of an ESP8266. Is the board faulty?', a: false, why: 'The ROM prints its boot message at 74880 baud. At 115200 it looks like noise; your own program\'s output is readable afterwards.' }
  ],
  applications: [
    'Smart plugs, bulbs and relays from the 2015-2022 era, many of which still run ESP8285 chips.',
    'A serial Wi-Fi bridge on an ESP-01 with the AT firmware, for a microcontroller with no radio.',
    'A tiny Wi-Fi temperature sensor with a DS18B20 on GPIO2.',
    'NodeMCU and D1 mini boards, built on the ESP-12 family, in countless tutorials.'
  ],
  sources: [
    'Espressif, *ESP8266EX Datasheet*: pins, boot modes, supply and the not-recommended notice.',
    'Ai-Thinker, ESP-01S and ESP-12F module datasheets: pad lists, flash sizes and reference circuits.',
    'The esp8266/Arduino core documentation: ESP8266WiFi and ESP8266WebServer.'
  ],
  sim: 'sb-esp01-boot'
}
);
