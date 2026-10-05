/* HYPER-ESP32 · content/worked-projects-2.js
 *
 * Topic "Worked projects", second half: the last seven of its fourteen pages. Each is a small design document written
 * with the app's own method: the idea and its numbers, the chip chosen and why (from the project advisor), the parts and
 * the pins (from the pin planner), the behaviour as a state machine the reader can operate, the program in blocks,
 * Arduino C++ and MicroPython, the power budget, and what to test.
 *
 *   project-matrix-clock        an LED matrix clock that takes its time from the internet
 *   project-robot-car           a robot car driven from a phone, with a stop on lost connection
 *   project-data-logger         timestamped readings on an SD card, and the flush policy
 *   project-garage-door         a relay pulse, two limit switches, time-outs (and the door's own safety devices)
 *   project-zigbee-switch       a battery light switch on Zigbee
 *   project-lora-field-sensor   a battery sensor in a field, an air-time and duty-cycle budget
 *   project-voice-lamp          a lamp that listens: the part that runs around the wake-word engine
 */
Hyper.add(
/* ================================================================ an LED matrix clock */
{
  id: 'project-matrix-clock',
  parent: 'worked-projects',
  title: 'An LED matrix clock',
  level: 2,
  short: 'Four orange digits on an 8 × 32 matrix of addressable LEDs, set to the second by the internet and never by hand. The design shows how a clock that depends on Wi-Fi once an hour behaves when the Wi-Fi is not there.',
  keywords: ['matrix clock', 'LED clock', 'WS2812 matrix', 'NeoPixel matrix', '8x32', 'NTP clock', 'SNTP', 'time zone', 'daylight saving', 'configTzTime', 'ntptime', 'stale time', 'serpentine'],
  prereq: ['ntp-and-time', 'addressable-leds', 'state-machine-in-code', 'block-diagrams'],
  related: ['led-matrices', 'powering-led-strips', 'level-shifters', 'wifi-events-and-reconnection', 'timeouts-and-timed-states', 'project-weather-station', 'light-sensors'],
  body: `**The idea:** a clock you can read from across the room, that is right to the second without ever being set, and that tells you quietly when it has not heard the time for a day. The only input is a button for brightness.

### What it must do, in numbers

- Show hours and minutes in four digits, 3 × 5 lamps each, on an 8 × 32 matrix: **256 pixels**.
- Be right to within a second between time-server contacts, and ask the server again about once an hour.
- Show a time within **30 s** of power-up when the router is there; show dashes, not a wrong time, when it is not.
- Keep running when the router is switched off, and mark the display after **24 h** without contact.
- Run from a **5 V supply**; no battery. One pixel at full white draws up to 60 mA, so the whole matrix could ask for **15.6 A**. The program caps the brightness, and the supply is chosen for the cap, not for the matrix.

### The chip, and why

The [project advisor](#/tools/advisor), given "an LED matrix clock that sets its time from the internet", reads three needs: Wi-Fi, a display, LED strips. It ranks the **ESP32-C3** first (score 99), then the ESP32 (98), the ESP32-C6 (98) and the ESP32-S3 (97). It rules out the chips with no Wi-Fi: ESP32-H2, P4, H4 and H21. Nothing here needs a second core or much memory: one core at 160 MHz, Wi-Fi 4 and the RMT peripheral that times the LED data are enough. The boards the advisor lists have screens of their own, which we do not need, so the build takes a plain **ESP32-C3-DevKitM-1** from the board catalogue. Any C3 board will do.

### The parts and the wiring

[The pin planner](#/tools/pinout/plan), asked for one LED data pin and one button on that board, chose:

| Pin | Goes to | Why |
|---|---|---|
| GPIO3 | matrix data in, through a 330 Ω resistor and a 5 V level shifter | an ordinary output, not a strapping pin |
| GPIO10 | button to ground | input with the internal pull-up |
| 5V pin and GND | the 5 V supply | the matrix takes its power from the supply, never through the board |

The matrix wants a 5 V data signal and a 3.3 V chip gives it a marginal one: use a level shifter such as a 74AHCT125 ([[level-shifters]]), put 1000 µF across the matrix supply, connect the grounds first and fuse the 5 V feed ([[powering-led-strips]]). The simulation draws this block diagram with the state machine beside it.

### The behaviour as a state machine

The machine has five states. **CONNECTING** shows a moving dot until Wi-Fi is up (20 s at most). **SYNCING** waits for the time server (10 s at most). **RUNNING** shows the time; each answer from the server (about hourly) re-enters it, which restarts a 24 h clock. If that clock runs out the machine goes to **STALE**: the time still shows, with one red pixel in the corner. **OFFLINE** shows dashes: the clock has never been set. Both OFFLINE and STALE wait for the time to be set, and leave at once when it is. Operate it in the simulation: switch the router off and speed the clock up.

### The program

All three versions run the same machine, draw the same 3 × 5 digits and use the same pins. The C++ version takes the time from the system's own time-server client, which asks again by itself and calls a function each time it sets the clock; that call is the TIME_SET event. It also knows time zones and daylight saving from one text rule. MicroPython has no time-zone database: its version adds a fixed offset (change it twice a year, or write a small rule). Matrices differ in how they snake: the function that turns a column and row into a pixel number is the one to adapt ([[led-matrices]]).

### The power budget

This is not a battery project, and the numbers say why. With 42 pixels lit at level 20 of 255 the matrix and the board draw about **0.45 A**; at level 80, about 1.05 A; a 3000 mAh cell would last five hours. A 5 V, 2 A supply covers it with room for the radio's bursts (335 mA while transmitting on the C3).

### Test it, and where it breaks first

- Pull the router's plug: the clock must keep counting. After 24 h (or a faster test with a manual change) the red pixel must appear.
- Start it with the router off: dashes, never 00:00.
- The first thing to go wrong is the matrix's pixel order, then a flickering first row from a missing level shifter, then the wrong time zone string.
- **Extend it** with a light sensor to set the brightness, the date on a second screen, the temperature from a sensor, or [[ota-updates]].

> [!warn] 256 pixels at full white would draw 15.6 A: more than a wire, a connector or a USB socket survives. Cap the brightness in the program, fuse the supply, and never power the matrix through the board's regulator.

> [!key] A clock that depends on the network must say what it does when the network is gone: keep counting, mark the age of the time, and never show a time it has not heard. Five states cover the whole behaviour, and the brightness cap is a safety rule, not a taste.`,
  ideas: [
    'The advisor ranks the ESP32-C3 first for a Wi-Fi clock with LEDs; no part of the design needs a second core.',
    'The chip keeps time between server contacts; the state machine decides what to show when contact is lost.',
    'The matrix could draw 15.6 A: the brightness cap and the supply are part of the design, not afterthoughts.',
    'Time zones and daylight saving are a rule, not an offset: C++ takes a rule string, MicroPython needs your own code.'
  ],
  pitfalls: [
    'The clock should show 00:00 until the time arrives — A wrong time that looks right is the worst failure: show dashes until the clock has really been set.',
    'The matrix can be powered through the board\'s 5 V pin — The board\'s regulator and USB socket are not made for amps. Feed the matrix from the supply and share only the ground.',
    'Pixel 0 is the top left corner — Most matrices snake: the order of columns depends on the panel. Light the first few pixels to see yours before drawing digits.'
  ],
  terms: [
    { term: 'SNTP', also: ['Simple Network Time Protocol', 'NTP client'], def: 'A small form of the network time protocol that asks a time server for the time and sets the local clock. The ESP32 software can repeat the request by itself and tell the program each time it sets the clock.' },
    { term: 'POSIX time-zone string', also: ['TZ string', 'CET-1CEST,M3.5.0,M10.5.0/3'], def: 'A text rule that gives a zone\'s name, its offset from universal time and the dates on which daylight saving starts and ends. The sign of the offset is inverted: east of Greenwich is negative.' },
    { term: 'Stale time', also: ['time since last sync'], def: 'A clock value that was right when the time server last answered and has drifted since. A crystal clock is out by about a second a day; the age of the last sync tells how far to trust it.' },
    { term: 'Serpentine matrix', also: ['zig-zag wiring', 'snake layout'], def: 'An LED matrix whose pixels are chained column by column (or row by row), alternately up and down, so that the data line is short. Pixel numbers then do not run in the same direction on neighbouring columns.' },
    { term: 'Level shifter', also: ['74AHCT125', 'logic level converter'], def: 'A small chip that raises a 3.3 V logic signal to the 5 V an LED strip expects, so that the data is read reliably.' }
  ],
  code: [
    {
      title: 'The clock, as a machine',
      about: 'Five states (CONNECTING, SYNCING, RUNNING, STALE, OFFLINE) decide what the matrix shows. The time itself comes from the system clock, set by the time server. A button steps the brightness through four levels, all of them well inside the supply\'s limit.',
      needs: 'An ESP32-C3-DevKitM-1, an 8 × 32 WS2812 matrix, a 5 V level shifter (74AHCT125), a 330 Ω resistor, a 1000 µF capacitor, a push button and a 5 V, 2 A supply. Arduino: the Adafruit NeoPixel library.',
      wiring: [['GPIO3', '330 Ω → level shifter → matrix data in'], ['GPIO10', 'button → GND', 'internal pull-up'], ['5 V supply', 'matrix +5 V and the board\'s 5V pin', 'fuse it'], ['GND', 'supply, matrix and board', 'connect first']],
      libs: ['Adafruit NeoPixel'],
      blocks: `
        when started
          set pin (10) as [input with pull-up v]
          set [level v] to (1)
          connect to Wi-Fi [your-ssid] password [your-password]
          go to state [CONNECTING v]

        when Wi-Fi connects
          if <state = [CONNECTING v]> then
            go to state [SYNCING v]
          end

        when (20) seconds in state [CONNECTING v]
          go to state [OFFLINE v]

        when (10) seconds in state [SYNCING v]
          go to state [OFFLINE v]

        when time is set by the network :: net
          go to state [RUNNING v]

        when (86400) seconds in state [RUNNING v]
          go to state [STALE v]

        when pin (10) goes [low v]
          change [level v] by (1)
          if <(level) > (3)> then
            set [level v] to (0)
          end

        every (0.5) seconds
          if <<state = [RUNNING v]> or <state = [STALE v]>> then
            show (current time) as HH:MM with a blinking colon :: display
          else if <state = [OFFLINE v]> then
            show four dashes :: display
          else
            show a moving dot :: display
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include "esp_sntp.h"
        #include <Adafruit_NeoPixel.h>

        const char *SSID = "your-ssid";             // do not leave real credentials in shared code
        const char *PASS = "your-password";
        const int PIN_MATRIX = 3, PIN_BUTTON = 10;
        const int W = 32, H = 8;
        const uint8_t LEVELS[] = {8, 20, 50, 100};  // brightness out of 255: a cap, not a taste
        const uint8_t FONT[10][5] = {{7,5,5,5,7},{2,6,2,2,7},{7,1,7,4,7},{7,1,7,1,7},{5,5,7,1,1},
                                     {7,4,7,1,7},{7,4,7,5,7},{7,1,1,2,2},{7,5,7,5,7},{7,5,7,1,7}};
        const int DIGIT_X[4] = {7, 11, 17, 21};     // left column of H H : M M

        Adafruit_NeoPixel strip(W * H, PIN_MATRIX, NEO_GRB + NEO_KHZ800);
        enum State { CONNECTING, SYNCING, RUNNING, STALE, OFFLINE };
        State state = CONNECTING;
        uint32_t enteredAt = 0;
        int level = 1;
        volatile bool gotTime = false;

        void onTimeSync(struct timeval *tv) { gotTime = true; }   // the time server has set the clock
        void go(State s) { state = s; enteredAt = millis(); }

        void dot(int x, int y, uint32_t c) {        // columns run up and down in turn: check yours
          strip.setPixelColor(x * H + ((x % 2) ? (H - 1 - y) : y), c);
        }
        void digit(int d, int x0, uint32_t c) {
          for (int row = 0; row < 5; row++)
            for (int col = 0; col < 3; col++)
              if (FONT[d][row] & (4 >> col)) dot(x0 + col, row + 1, c);
        }

        void draw(bool colon) {
          uint32_t on = strip.Color(255, 120, 0);
          strip.clear();
          if (state == RUNNING || state == STALE) {
            time_t now = time(nullptr);
            tm t;
            localtime_r(&now, &t);
            digit(t.tm_hour / 10, DIGIT_X[0], on);  digit(t.tm_hour % 10, DIGIT_X[1], on);
            digit(t.tm_min / 10, DIGIT_X[2], on);   digit(t.tm_min % 10, DIGIT_X[3], on);
            if (colon) { dot(15, 2, on); dot(15, 4, on); }
            if (state == STALE) dot(0, 0, strip.Color(255, 0, 0));    // old time: one red pixel
          } else if (state == OFFLINE) {
            for (int i = 0; i < 4; i++) for (int c = 0; c < 3; c++) dot(DIGIT_X[i] + c, 3, on);
          } else {
            dot((millis() / 80) % W, H - 1, on);                      // searching: a moving dot
          }
          strip.show();
        }

        void setup() {
          pinMode(PIN_BUTTON, INPUT_PULLUP);
          strip.begin();
          strip.setBrightness(LEVELS[level]);
          sntp_set_time_sync_notification_cb(onTimeSync);
          configTzTime("CET-1CEST,M3.5.0,M10.5.0/3", "pool.ntp.org");   // your zone's rule here
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
        }

        void loop() {
          uint32_t held = millis() - enteredAt;
          if (gotTime) { gotTime = false; go(RUNNING); }               // TIME_SET, from any state
          else if (state == CONNECTING && WiFi.status() == WL_CONNECTED) go(SYNCING);
          else if (state == CONNECTING && held > 20000) go(OFFLINE);
          else if (state == SYNCING && held > 10000) go(OFFLINE);
          else if (state == RUNNING && held > 86400000UL) go(STALE);

          static bool lastButton = HIGH;
          bool button = digitalRead(PIN_BUTTON);
          if (lastButton == HIGH && button == LOW) {                   // pressed: next brightness
            level = (level + 1) % 4;
            strip.setBrightness(LEVELS[level]);
          }
          lastButton = button;

          draw((millis() / 500) % 2 == 0);
          delay(20);
        }
      `,
      py: String.raw`
        import network, ntptime, time
        from machine import Pin
        from neopixel import NeoPixel

        SSID, PASS = "your-ssid", "your-password"     # do not leave real credentials in shared code
        PIN_MATRIX, PIN_BUTTON = 3, 10
        W, H = 32, 8
        LEVELS = (8, 20, 50, 100)                     # brightness out of 255: a cap, not a taste
        FONT = ((7,5,5,5,7), (2,6,2,2,7), (7,1,7,4,7), (7,1,7,1,7), (5,5,7,1,1),
                (7,4,7,1,7), (7,4,7,5,7), (7,1,1,2,2), (7,5,7,5,7), (7,5,7,1,7))
        DIGIT_X = (7, 11, 17, 21)                     # left column of H H : M M
        UTC_OFFSET = 3600                             # no time-zone rules in MicroPython: change by hand

        CONNECTING, SYNCING, RUNNING, STALE, OFFLINE = range(5)
        np = NeoPixel(Pin(PIN_MATRIX), W * H)
        button = Pin(PIN_BUTTON, Pin.IN, Pin.PULL_UP)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        state, entered, level = CONNECTING, time.ticks_ms(), 1
        next_try = time.ticks_ms()

        def go(s):
            global state, entered
            state, entered = s, time.ticks_ms()

        def dot(x, y, c):                             # columns run up and down in turn: check yours
            f = LEVELS[level] / 255
            np[x * H + ((H - 1 - y) if x % 2 else y)] = tuple(int(v * f) for v in c)

        def digit(d, x0, c):
            for row in range(5):
                for col in range(3):
                    if FONT[d][row] & (4 >> col):
                        dot(x0 + col, row + 1, c)

        def draw(colon):
            on = (255, 120, 0)
            np.fill((0, 0, 0))
            if state in (RUNNING, STALE):
                t = time.localtime(time.time() + UTC_OFFSET)
                for i, d in enumerate((t[3] // 10, t[3] % 10, t[4] // 10, t[4] % 10)):
                    digit(d, DIGIT_X[i], on)
                if colon:
                    dot(15, 2, on); dot(15, 4, on)
                if state == STALE:
                    dot(0, 0, (255, 0, 0))            # old time: one red pixel
            elif state == OFFLINE:
                for i in range(4):
                    for c in range(3):
                        dot(DIGIT_X[i] + c, 3, on)
            else:
                dot((time.ticks_ms() // 80) % W, H - 1, on)   # searching: a moving dot
            np.write()

        was_pressed = False
        while True:
            held = time.ticks_diff(time.ticks_ms(), entered)
            if state == CONNECTING and wlan.isconnected():
                go(SYNCING)
            elif state == CONNECTING and held > 20000:
                go(OFFLINE)
            elif state == SYNCING and held > 10000:
                go(OFFLINE)
            elif state == RUNNING and held > 86400000:
                go(STALE)
            if wlan.isconnected() and time.ticks_diff(time.ticks_ms(), next_try) >= 0:
                try:
                    ntptime.settime()                 # sets the clock to UTC: this is TIME_SET
                    go(RUNNING)
                    next_try = time.ticks_add(time.ticks_ms(), 3600000)   # ask again in an hour
                except OSError:
                    next_try = time.ticks_add(time.ticks_ms(), 10000)     # no answer: retry soon
            pressed = button.value() == 0
            if pressed and not was_pressed:
                level = (level + 1) % 4               # next brightness
            was_pressed = pressed
            draw((time.ticks_ms() // 500) % 2 == 0)
            time.sleep_ms(20)
      `,
      notes: ['The RUNNING hour in C++ is the system\'s own repeat request; in MicroPython the program asks again every hour itself, and a failed try waits 10 s.', 'Change the zone rule in C++ and the offset in MicroPython to your own; the other numbers are the same in all three.', 'If the digits come out as a jumble, your matrix is wired row by row, or starts at another corner: change the one function that turns a column and row into a pixel number.', 'Never copy real Wi-Fi credentials into code you share ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'How big a supply?',
      q: 'The matrix has 256 pixels. The clock lights 42 of them at level 50 of 255, and the board needs about 0.1 A. What supply current is needed, taking 60 mA per pixel at full brightness and 1 mA for a pixel that is on but dark?',
      steps: ['Lit pixels: $42 \\times 60 \\text{ mA} \\times 50/255 \\approx 494$ mA.', 'Every pixel draws about 1 mA even when dark: $256 \\times 1 \\text{ mA} = 256$ mA.', 'Add the board: $494 + 256 + 100 \\approx 850$ mA.'],
      a: 'About 0.85 A: a 5 V, 2 A supply has room for it and for the radio\'s bursts. Full white on every pixel would be 15.6 A, which no adapter of this kind could give.'
    }
  ],
  quiz: [
    { q: 'The router is switched off for three days after the clock has been set. What should the matrix show on the third day?', choices: ['Dashes', 'The time, with a mark that it is old', '00:00', 'Nothing'], a: 1, why: 'The chip\'s own clock has drifted only a few seconds. Showing the time with a marker (the red pixel in STALE) is useful and honest; dashes are for a clock that has never been set.' },
    { q: 'A function is called each time the time server sets the clock. In the state machine, what is it?', choices: ['A guard', 'The TIME_SET event', 'An entry action', 'A timeout'], a: 1, why: 'It reports that something happened outside the program. The machine reacts by going to (or re-entering) RUNNING, which restarts the 24 h age clock.' },
    { q: 'A 5 V LED matrix is fed from the board\'s 5V pin because "it is only a clock". What is the risk?', choices: ['The clock runs slowly', 'The board\'s regulator and USB socket may be asked for amps they cannot give', 'The time zone is wrong', 'None, the matrix draws a few milliamps'], a: 1, why: 'Even 42 lit pixels with 256 idle ones draw about 0.45 A at a dim level and over 1 A brighter. The matrix belongs on the supply, with the grounds joined.' },
    { q: 'In the MicroPython version, summer time is handled by the library.', a: false, why: 'MicroPython has no time-zone database: the program adds a fixed offset. Either change it twice a year or write the rule for the last Sundays of March and October yourself.' }
  ],
  applications: [
    'A kitchen or workshop clock that is right the day it is plugged in and needs no batteries.',
    'The display of a school or club timer, with the same machine and a different font.',
    'A shop-window sign that shows the time and the temperature in turn.',
    'The model for any network-timed device: keep counting, show the age, never invent a value.'
  ],
  sources: [
    'Worldsemi, WS2812B datasheet: the data protocol, the 60 mA per pixel figure and the supply voltage.',
    'IETF RFC 5905, Network Time Protocol Version 4: Protocol and Algorithms Specification.',
    'Arduino core for ESP32 documentation and its SimpleTime example (core 3.3); MicroPython documentation for the ntptime module (version 1.29).'
  ],
  sim: 'wp2-matrix-clock'
},

/* ================================================================ a robot car driven from a phone */
{
  id: 'project-robot-car',
  parent: 'worked-projects',
  title: 'A robot car driven from a phone',
  level: 2,
  short: 'Two geared motors behind an H-bridge driver, a web page on the phone with two sliders, and a WebSocket carrying the speeds. The part that matters most is the one that is not fun: the car stops by itself when the phone goes quiet.',
  keywords: ['robot car', 'RC car', 'Wi-Fi car', 'WebSocket', 'TB6612FNG', 'H-bridge', 'tank drive', 'failsafe', 'dead-man', 'soft AP', 'phone control', 'stop on lost connection', 'motor driver', 'ESPAsyncWebServer', 'Microdot'],
  prereq: ['dc-motors-and-h-bridges', 'websockets', 'soft-ap-and-captive-portal', 'timeouts-and-timed-states'],
  related: ['motor-pwm-frequency', 'motor-power-and-protection', 'robots-on-esp', 'safety-in-control', 'lithium-cells', 'measuring-battery-level', 'brownout', 'current-peaks-and-capacitors', 'web-server-on-esp'],
  body: `**The idea:** a small two-wheeled car that you steer from a phone's browser. The phone joins the car's own Wi-Fi network, opens a page with two sliders, and sends the two wheel speeds ten times a second. Nothing is installed on the phone.

### What it must do, in numbers

- Two DC gear motors, each drawing a few hundred milliamps when running and up to an ampere or more when stalled.
- A command every **100 ms** from the page; speeds from −100 to +100 percent for each side.
- **Stop within 400 ms** of the last command, whatever the reason: the phone went out of range, the screen locked, the page crashed, the radio was jammed.
- Motors at no more than 80 % duty: fast enough, and gentle on the gears and the battery.
- Run from a 2-cell lithium pack (7.4 V nominal, 8.4 V full) for an hour or more of mixed driving.

### The chip, and why

The [project advisor](#/tools/advisor) reads "a robot car driven from a phone over Wi-Fi with motor drivers" as Wi-Fi plus motors. It ranks the **ESP32** first (score 98), the ESP32-C6 close behind (98) and the ESP32-S3 (97); the chips without Wi-Fi (H2, P4, H4, H21) are ruled out. For the ESP32 it cites the motor-control PWM unit, and warns that ADC2 is shared with Wi-Fi: so the battery sense must sit on an ADC1 pin. We use ordinary PWM from the LED controller, which is plenty for two brushed motors, on an **ESP32-DevKitC V4**; any of the three top chips would do.

### The parts and the wiring

A dual H-bridge driver of the TB6612FNG kind: each motor has two direction inputs and a PWM input, and one standby pin switches the whole chip. It is rated 1.2 A continuous (3.2 A peak) per motor and 4.5–13.5 V, so it suits small gear motors. [The pin planner](#/tools/pinout/plan) chose, for that board:

| Pin | Goes to | Note |
|---|---|---|
| GPIO21, GPIO22 | left motor direction inputs | plain outputs |
| GPIO18 | left motor PWM | 20 kHz, 8 bits |
| GPIO23, GPIO4 | right motor direction inputs | none is a strapping pin |
| GPIO19 | right motor PWM | 20 kHz, 8 bits |
| GPIO27 | driver standby | low at start: the motors cannot move before the program says so |
| GPIO34 | battery sense, optional | an ADC1 input; a 100 kΩ and 39 kΩ divider puts 8.4 V at 2.36 V |

Power: the pack feeds the driver's motor supply directly and the board through a 5 V buck converter, with 470–1000 µF across the motor supply to absorb start-up spikes ([[current-peaks-and-capacitors]], [[brownout]]). A rocker switch in the battery lead is the emergency stop. Lithium cells need a charger and a protection board, never the car's own circuit ([[lithium-cells]]).

### The behaviour as a state machine

**WAITING**: no phone connected, motors braked. **READY**: a phone is connected, but the stick is not pushed. **DRIVING**: commands arrive and the speeds follow them; every command re-enters the state, which restarts a 400 ms timer. If the timer runs out the machine goes to **FAILSAFE**: motors braked, commands ignored until the sliders are at zero. A phone that leaves, in any state, goes back to WAITING. The rule "no driving from FAILSAFE until zero" matters: a car that resumes at full speed the moment the signal returns is a hazard. Operate the machine in the simulation: untick the radio link while the stick is pushed.

### The program

The page is one small string of HTML and script, the same in all three versions. Two range sliders send "left,right" over a WebSocket every 100 ms, and a released slider springs back to zero. The C++ version uses the ESP32Async web server and its WebSocket. Official MicroPython has no WebSocket server, so the MicroPython version uses the add-on Microdot framework, installed from its own files, with a small task that watches the clock. The car is its own Wi-Fi access point, so it works in a field; the page lives at 192.168.4.1 ([[soft-ap-and-captive-portal]]).

### The power budget

Driving 25 s in every minute at about 675 mA (two motors under load plus the board), and standing for 35 s at about 75 mA, averages **325 mA** from the pack. Two 2600 mAh cells in series are a 2600 mAh pack, and with 80 % usable that is about **6.4 hours**. The figures for the motors are typical; measure yours stalled and running, because the stall current decides the driver and the fuse.

### Test it, and where it breaks first

- Wheels off the ground first. Every direction, then the failsafe: switch the phone's Wi-Fi off while the stick is pushed.
- The first failure is a reset when the motors start: the supply sags. Then a motor that turns the wrong way (swap its two direction pins), then a car that creeps because the sliders do not return exactly to zero (add a dead zone).
- **Extend it** with a battery gauge on the divider, a speed limit when the pack is low, a horn, or a camera ([[video-streaming]]) on a second board.

> [!warn] A moving machine is a hazard to people, pets and furniture. The stop on silence is not an extra: build and test it before anything else, keep a physical power switch within reach, and test with the wheels off the ground.

> [!key] The car is a small machine with one rule above the rest: no news means stop. Four states, a 400 ms timer and a refusal to resume until the stick is at zero make the radio's flaws harmless.`,
  ideas: [
    'The phone sends "left,right" ten times a second; the car stops 400 ms after the last message, for any reason.',
    'FAILSAFE refuses to resume until the sliders return to zero, so a returning signal never restarts a runaway car.',
    'The ESP32\'s ADC2 cannot be read while Wi-Fi is on: the battery sense goes on an ADC1 pin.',
    'Official MicroPython has no WebSocket server: the MicroPython version needs the add-on Microdot framework.'
  ],
  pitfalls: [
    'Stopping when the socket closes is enough — A phone that walks out of range or locks its screen often leaves the connection looking open for a long while. Stop on silence, with a timer.',
    'The motor supply can share the board\'s 3.3 V rail — Motors spike and sag the supply. The board needs its own regulator and the driver a capacitor across its motor supply, or the chip resets as the wheels start.',
    'A motor driver\'s standby pin can float at start-up — A floating pin may let the motors twitch while the program boots. Hold standby low until the program is ready, and brake before raising it.'
  ],
  terms: [
    { term: 'Failsafe', also: ['dead-man rule', 'watchdog on commands'], def: 'A rule that puts a machine in its safe state when commands stop arriving. For a car the safe state is stopped; the rule works by timing the silence, not by waiting for an error.' },
    { term: 'Short brake', also: ['dynamic braking'], def: 'The state of an H-bridge when both of a motor\'s terminals are connected to the same rail: the motor\'s own back-voltage drives a current that stops it quickly. Distinct from coasting, where both terminals float.' },
    { term: 'Soft access point', also: ['soft AP', 'SoftAP'], def: 'A mode in which the ESP32 creates its own Wi-Fi network for others to join. The phone talks to the car directly, with no router in between.' },
    { term: 'Tank drive', also: ['differential drive'], def: 'Steering two driven wheels by giving each its own speed: equal speeds go straight, opposite speeds turn on the spot, different speeds curve.' },
    { term: 'Standby pin', also: ['STBY'], def: 'An input of a motor driver chip that switches all its outputs off when low. It is the chip\'s master enable and should be low until the program is running.' }
  ],
  code: [
    {
      title: 'The car, its page and its failsafe',
      about: 'The ESP32 is a Wi-Fi access point and a web server. The page sends two speeds over a WebSocket; four states decide when the motors may move. Silence for 400 ms, a leaving phone, or a stick that is not at zero after a failsafe all keep the car stopped.',
      needs: 'An ESP32-DevKitC V4, a TB6612FNG driver module, two DC gear motors, a 2-cell lithium pack with protection, a 5 V buck converter, 470–1000 µF across the motor supply, and a phone. Arduino: ESPAsyncWebServer and AsyncTCP from the ESP32Async organisation. MicroPython: the Microdot framework (the microdot package, version 2).',
      wiring: [['GPIO21', 'driver AIN1', 'left direction'], ['GPIO22', 'driver AIN2'], ['GPIO18', 'driver PWMA', 'left speed'], ['GPIO23', 'driver BIN1', 'right direction'], ['GPIO4', 'driver BIN2'], ['GPIO19', 'driver PWMB', 'right speed'], ['GPIO27', 'driver STBY'], ['pack +', 'driver VM and the buck converter', 'through the power switch'], ['GND', 'driver, board and pack', 'joined']],
      libs: ['ESP Async WebServer (ESP32Async)', 'AsyncTCP (ESP32Async)'],
      blocks: `
        when started
          set pin (27) as [output v]
          set PWM on pin (18) frequency (20000) resolution (8)
          set PWM on pin (19) frequency (20000) resolution (8)
          brake both motors :: my
          set pin (27) to [HIGH v]
          start Wi-Fi access point [robot-car] password [your-password] :: wifi
          start web server on port (80)
          go to state [WAITING v]

        when a phone connects to the socket :: net
          if <state = [WAITING v]> then
            go to state [READY v]
          end

        when the phone leaves the socket :: net
          go to state [WAITING v]

        when data received :: net
          read the left and right speeds from the message :: my
          set [last v] to (milliseconds since start)
          if <state = [READY v]> then
            if <not <<(left) = (0)> and <(right) = (0)>>> then
              go to state [DRIVING v]
            end
          else if <state = [DRIVING v]> then
            if <<(left) = (0)> and <(right) = (0)>> then
              go to state [READY v]
            else
              go to state [DRIVING v]
            end
          else if <state = [FAILSAFE v]> then
            if <<(left) = (0)> and <(right) = (0)>> then
              go to state [READY v]
            end
          end

        when entering state [DRIVING v]
          set motor [A v] speed (left)
          set motor [B v] speed (right)

        when (0.4) seconds in state [DRIVING v]
          go to state [FAILSAFE v]

        when entering state [WAITING v]
          brake both motors :: my

        when entering state [READY v]
          brake both motors :: my

        when entering state [FAILSAFE v]
          brake both motors :: my
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <AsyncTCP.h>
        #include <ESPAsyncWebServer.h>

        const int PIN_AIN1 = 21, PIN_AIN2 = 22, PIN_PWMA = 18;   // left motor
        const int PIN_BIN1 = 23, PIN_BIN2 = 4,  PIN_PWMB = 19;   // right motor
        const int PIN_STBY = 27;                                  // the driver works only while high
        const int PWM_FREQ = 20000, PWM_BITS = 8;                 // 20 kHz: above hearing
        const uint32_t SILENCE_MS = 400;                          // no command for this long: stop
        const int MAX_SPEED = 80;                                 // percent of full duty

        const char PAGE[] PROGMEM = R"HTML(<!doctype html><meta name=viewport content="width=device-width">
        <h3>Robot car</h3>
        Left <input id=l type=range min=-100 max=100 value=0><br>
        Right <input id=r type=range min=-100 max=100 value=0>
        <script>
        var ws = new WebSocket('ws://' + location.host + '/ws');
        function send() { if (ws.readyState == 1) ws.send(l.value + ',' + r.value); }
        l.onpointerup = r.onpointerup = function (e) { e.target.value = 0; send(); };
        setInterval(send, 100);
        </script>)HTML";

        AsyncWebServer server(80);
        AsyncWebSocket ws("/ws");
        enum State { WAITING, READY, DRIVING, FAILSAFE };
        State state = WAITING;
        volatile int cmdL = 0, cmdR = 0;
        volatile uint32_t lastCmdAt = 0;
        volatile bool gotCmd = false;

        void drive(int in1, int in2, int pwm, int speed) {       // speed -100..100; 0 brakes
          if (speed == 0) { digitalWrite(in1, HIGH); digitalWrite(in2, HIGH); ledcWrite(pwm, 255); return; }
          digitalWrite(in1, speed > 0);
          digitalWrite(in2, speed < 0);
          ledcWrite(pwm, abs(speed) * MAX_SPEED / 100 * 255 / 100);
        }
        void applySpeeds() { drive(PIN_AIN1, PIN_AIN2, PIN_PWMA, cmdL); drive(PIN_BIN1, PIN_BIN2, PIN_PWMB, cmdR); }
        void brake()       { drive(PIN_AIN1, PIN_AIN2, PIN_PWMA, 0);    drive(PIN_BIN1, PIN_BIN2, PIN_PWMB, 0); }
        void go(State s)   { state = s; if (s == DRIVING) applySpeeds(); else brake(); }

        void onWs(AsyncWebSocket *s, AsyncWebSocketClient *c, AwsEventType type, void *arg, uint8_t *data, size_t len) {
          if (type != WS_EVT_DATA || len > 20) return;
          char text[24];
          memcpy(text, data, len);
          text[len] = 0;
          int l, r;
          if (sscanf(text, "%d,%d", &l, &r) == 2) {              // "left,right" from the page
            cmdL = constrain(l, -100, 100);
            cmdR = constrain(r, -100, 100);
            lastCmdAt = millis();
            gotCmd = true;
          }
        }

        void setup() {
          for (int p : {PIN_AIN1, PIN_AIN2, PIN_BIN1, PIN_BIN2, PIN_STBY}) pinMode(p, OUTPUT);
          ledcAttach(PIN_PWMA, PWM_FREQ, PWM_BITS);
          ledcAttach(PIN_PWMB, PWM_FREQ, PWM_BITS);
          brake();                                               // brake first, then enable the driver
          digitalWrite(PIN_STBY, HIGH);
          WiFi.softAP("robot-car", "your-password");             // the phone joins this network
          ws.onEvent(onWs);
          server.addHandler(&ws);
          server.on("/", HTTP_GET, [](AsyncWebServerRequest *req) { req->send(200, "text/html", PAGE); });
          server.begin();
        }

        void loop() {
          ws.cleanupClients();
          bool connected = ws.count() > 0;
          bool fresh = gotCmd;  gotCmd = false;
          bool zero = (cmdL == 0 && cmdR == 0);
          switch (state) {
            case WAITING:  if (connected) go(READY); break;
            case READY:    if (!connected) go(WAITING); else if (fresh && !zero) go(DRIVING); break;
            case DRIVING:
              if (!connected) go(WAITING);
              else if (millis() - lastCmdAt > SILENCE_MS) go(FAILSAFE);   // silence: stop
              else if (fresh && zero) go(READY);
              else if (fresh) applySpeeds();
              break;
            case FAILSAFE: if (!connected) go(WAITING); else if (fresh && zero) go(READY); break;
          }
        }
      `,
      py: String.raw`
        import asyncio, network, time
        from machine import Pin, PWM
        from microdot import Microdot
        from microdot.websocket import with_websocket

        PIN_AIN1, PIN_AIN2, PIN_PWMA = 21, 22, 18         # left motor
        PIN_BIN1, PIN_BIN2, PIN_PWMB = 23, 4, 19          # right motor
        PIN_STBY = 27                                     # the driver works only while high
        PWM_FREQ = 20000                                  # 20 kHz: above hearing
        SILENCE_MS = 400                                  # no command for this long: stop
        MAX_SPEED = 80                                    # percent of full duty

        PAGE = """<!doctype html><meta name=viewport content="width=device-width">
        <h3>Robot car</h3>
        Left <input id=l type=range min=-100 max=100 value=0><br>
        Right <input id=r type=range min=-100 max=100 value=0>
        <script>
        var ws = new WebSocket('ws://' + location.host + '/ws');
        function send() { if (ws.readyState == 1) ws.send(l.value + ',' + r.value); }
        l.onpointerup = r.onpointerup = function (e) { e.target.value = 0; send(); };
        setInterval(send, 100);
        </script>"""

        WAITING, READY, DRIVING, FAILSAFE = range(4)
        state = WAITING
        cmd_l = cmd_r = 0
        last_cmd = time.ticks_ms()
        ain1, ain2, bin1, bin2 = (Pin(p, Pin.OUT) for p in (PIN_AIN1, PIN_AIN2, PIN_BIN1, PIN_BIN2))
        stby = Pin(PIN_STBY, Pin.OUT, value=0)
        pwma = PWM(Pin(PIN_PWMA), freq=PWM_FREQ, duty_u16=0)
        pwmb = PWM(Pin(PIN_PWMB), freq=PWM_FREQ, duty_u16=0)

        def drive(in1, in2, pwm, speed):                  # speed -100..100; 0 brakes
            if speed == 0:
                in1.value(1); in2.value(1); pwm.duty_u16(65535)
                return
            in1.value(speed > 0)
            in2.value(speed < 0)
            pwm.duty_u16(abs(speed) * MAX_SPEED // 100 * 65535 // 100)

        def apply_speeds():
            drive(ain1, ain2, pwma, cmd_l)
            drive(bin1, bin2, pwmb, cmd_r)

        def brake():
            drive(ain1, ain2, pwma, 0)
            drive(bin1, bin2, pwmb, 0)

        def go(s):
            global state
            state = s
            if s == DRIVING:
                apply_speeds()
            else:
                brake()

        app = Microdot()

        @app.route("/")
        async def page(request):
            return PAGE, 200, {"Content-Type": "text/html"}

        @app.route("/ws")
        @with_websocket
        async def control(request, ws):
            global cmd_l, cmd_r, last_cmd
            go(READY)                                     # a phone connected
            try:
                while True:
                    msg = await ws.receive()              # "left,right" from the page
                    l, r = (int(v) for v in msg.split(","))
                    cmd_l, cmd_r = max(-100, min(100, l)), max(-100, min(100, r))
                    last_cmd = time.ticks_ms()
                    zero = cmd_l == 0 and cmd_r == 0
                    if state == READY and not zero:
                        go(DRIVING)
                    elif state == DRIVING and zero:
                        go(READY)
                    elif state == DRIVING:
                        apply_speeds()
                    elif state == FAILSAFE and zero:
                        go(READY)
            finally:
                go(WAITING)                               # the phone left, or the socket failed: stop

        async def watchdog():
            while True:
                await asyncio.sleep_ms(50)
                if state == DRIVING and time.ticks_diff(time.ticks_ms(), last_cmd) > SILENCE_MS:
                    go(FAILSAFE)                          # silence: stop, wait for the sliders at zero

        async def main():
            asyncio.create_task(watchdog())
            await app.start_server(port=80)

        ap = network.WLAN(network.WLAN.IF_AP)
        ap.config(ssid="robot-car", password="your-password", security=network.WLAN.SEC_WPA2)
        ap.active(True)                                   # the phone joins this network
        brake()                                           # brake first, then enable the driver
        stby.value(1)
        asyncio.run(main())
      `,
      notes: ['Choose your own access-point password and do not share code that contains it ([[credentials-handling]]).', 'One phone at a time: a second client would share the same command variables. Count clients in the C++ version if you want to refuse the second.', 'Microdot\'s layout changed between its versions 1 and 2 (the WebSocket extension moved into the `microdot` package): check the import lines against the version you install.', 'The C++ loop measures silence from the time of the last command; the MicroPython version does the same in the small watchdog task. Both are the "after 400 ms" arrow of the machine.']
    }
  ],
  examples: [
    {
      title: 'Will the pack last the afternoon?',
      q: 'Two 2600 mAh cells in series give a 2600 mAh pack. The car drives for 25 s in each minute at about 675 mA and stands the other 35 s at about 75 mA. How long does the pack last, with 80 % usable?',
      steps: ['Charge in one minute: $25 \\times 675 + 35 \\times 75 = 16875 + 2625 = 19500$ mA·s.', 'Average current: $19500 / 60 = 325$ mA.', 'Usable charge: $0.8 \\times 2600 = 2080$ mAh. Time: $2080 / 325 \\approx 6.4$ h.'],
      a: 'About 6.4 hours of mixed driving. Driving takes 87 % of the charge though it is only 42 % of the time: the motors, not the chip, decide the pack.'
    }
  ],
  quiz: [
    { q: 'The phone\'s screen locks while the stick is pushed forward. Which part of the design stops the car?', choices: ['The socket always closes at once', 'The 400 ms silence timer', 'The motor driver\'s standby pin', 'The battery protection board'], a: 1, why: 'A locked phone often leaves the connection looking open, so no "closed" event arrives. The car stops because commands stopped coming: the timer is the failsafe.' },
    { q: 'The signal returns after a failsafe while the slider is still pushed forward. What should the car do?', choices: ['Resume at the pushed speed', 'Resume at half speed', 'Stay stopped until the sliders are at zero', 'Reboot'], a: 2, why: 'A car that restarts by itself the moment the link returns surprises everyone. FAILSAFE accepts only a zero command, then goes to READY.' },
    { q: 'Why is the battery divider on GPIO34 and not on an ADC2 pin?', choices: ['GPIO34 is faster', 'On the ESP32, ADC2 cannot be read while Wi-Fi is on', 'ADC2 pins are reserved for motors', 'GPIO34 has a pull-up'], a: 1, why: 'The ESP32\'s second ADC is used by the Wi-Fi driver. The car is always on Wi-Fi, so the readings must come from ADC1; GPIO34 is an input-only ADC1 pin.' },
    { q: 'The car resets each time the wheels start from standstill. What is the first thing to check?', choices: ['The web page', 'The supply: a capacitor across the motor supply and a separate regulator for the board', 'The PWM frequency', 'The Wi-Fi channel'], a: 1, why: 'A start-up current spike pulls the shared supply down and the chip browns out. Separate regulation and a capacitor near the driver cure it ([[brownout]]).' }
  ],
  applications: [
    'A first robotics platform for a school club, steered from any phone.',
    'A remote inspection crawler for a pipe or a crawl space, with a camera on a second board.',
    'The base of a line follower or a balancing robot, once the web page is replaced by a sensor loop.',
    'Any machine with a remote command and a hazard: the same stop-on-silence machine fits a gate, a hoist or a camera pan-tilt.'
  ],
  sources: [
    'Toshiba, TB6612FNG datasheet: the truth table of the inputs, the ratings and the standby pin.',
    'IETF RFC 6455, The WebSocket Protocol.',
    'ESP32Async, ESPAsyncWebServer documentation (WebSocket); Miguel Grinberg, Microdot documentation (WebSocket extension).'
  ],
  sim: 'wp2-robot-car'
},

/* ================================================================ a data logger */
{
  id: 'project-data-logger',
  parent: 'worked-projects',
  title: 'A data logger',
  level: 2,
  short: 'A temperature sensor, an SD card and a clock: one timestamped line every ten seconds, for months. The design question is not how to write a line but when to make it safe, and what a card pulled out at the wrong moment costs.',
  keywords: ['data logger', 'SD card', 'CSV', 'timestamp', 'flush', 'DS18B20', 'FAT32', 'SPI SD', 'log file', 'power cut', 'safe eject', 'SD_MMC', 'temperature log', 'append'],
  prereq: ['sd-cards', 'logging-data', 'one-wire', 'ntp-and-time'],
  related: ['littlefs-and-file-systems', 'flash-wear', 'spi', 'strapping-pins', 'temperature-sensors', 'esp-as-a-data-logger', 'time-series-data', 'project-weather-station', 'deep-sleep'],
  body: `**The idea:** record the temperature in a room, a fridge or a greenhouse as a plain text file on an SD card, one line per reading with the time of day, so that a spreadsheet can open it a month later. No cloud, no network after the first minute.

### What it must do, in numbers

- One reading every **10 s**: 8,640 lines a day. A line such as \`2026-10-04T12:34:56Z,21.50,1\` is under 32 bytes, so a day is about 270 KB and even a 4 GB card is far from full after a year.
- The temperature to a fraction of a degree: the DS18B20 sensor is specified to ±0.5 °C between −10 and +85 °C and resolves 0.0625 °C, taking 750 ms for a reading.
- A **power cut or a pulled card may lose at most 30 s** of data.
- The time in every line, from a time server once at start-up; a flag in the last column says whether that time was ever set.
- A button that closes the file so the card can be taken out safely, and an LED that says which state the logger is in.

### The chip, and why

The [project advisor](#/tools/advisor), asked for "a data logger that writes timestamped readings to an SD card", reads one need, the SD card. It ranks the **ESP32** first (98): it has a host controller for SD and MMC cards. The ESP32-S3 follows (97), then the P4 (94); the ESP32-C3 scores 81 because it can drive a card over SPI only. For a 30-byte line every ten seconds, SPI is more than fast enough, so a C3 would do the job. We keep the ESP32 on an **ESP32-DevKitC V4**, and use SPI deliberately: the card's 4-bit mode puts a data line on GPIO12, and a card that pulls GPIO12 high at power-up stops the board booting ([[strapping-pins]]).

### The parts and the wiring

A microSD socket module that runs at 3.3 V (many cheap modules have a 5 V regulator and level shifters: check yours), a DS18B20 with a 4.7 kΩ pull-up, a button and an LED. [The pin planner](#/tools/pinout/plan) chose:

| Pin | Goes to | Note |
|---|---|---|
| GPIO18, GPIO19, GPIO23 | SD card clock, data out (MISO), data in (MOSI) | the default SPI pins |
| GPIO5 | SD card chip select | a strapping pin: the module's pull-up holds it high, which is what GPIO5 wants at reset |
| GPIO21 | DS18B20 data, 4.7 kΩ to 3.3 V | any output-capable pin |
| GPIO22 | eject button to ground | internal pull-up |
| GPIO4 | status LED through 330 Ω | |

### The behaviour as a state machine

**NO_CARD**: no card mounted; the LED blinks slowly and the program tries to mount every 5 s. **LOGGING**: the file is open and the LED is on; every 10 s a line is written, and the buffered lines are pushed to the card every 30 s. **EJECTED**: the button flushed and closed the file; the LED blinks fast, and the card may be removed. A failed write means the card is gone: back to NO_CARD. The simulation shows the part that is not an arrow: the lines waiting in memory and the lines already on the card.

### The program

All three versions do the same: wait up to 10 s for the time server, switch Wi-Fi off, then run the machine. The files are opened for append, so a restart carries on in the same file, and the header is written only when the file is new. The temperature call waits for the sensor's conversion. The write call tells you nothing until the card is touched: a card pulled out between flushes is noticed at the first write that reaches it, which is why the flush policy is the design, not a detail.

### The flush policy

A file's data first goes to a buffer in memory, and the card is written when the buffer fills, when the program flushes, or when it closes the file. Flushing after every line loses nothing but writes the card 8,640 times a day; flushing every 30 s loses at most three lines and writes it 2,880 times; never flushing loses everything since the file was opened. Each flush costs tens of milliseconds, which is affordable here and is a real cost on a battery.

### The power budget

On a USB supply none matters. On a battery: awake without Wi-Fi the logger draws about 45 mA, so an 18650 cell of 3000 mAh lasts about **2 days** if it never sleeps. Waking once a minute, staying awake for 2 s at 60 mA, and sleeping the rest at 0.5 mA (the chip's 10 µA plus the SD module and the board) averages 2.5 mA and lasts about **39 days**. The sleeping current of the card module decides the answer: measure it. A deep-sleep version closes the file on every wake, so its policy is simply "flush every line".

### Test it, and where it breaks first

- Pull the power at a random moment, many times, and count the lines lost: the answer must be within the policy.
- The card's format: cards over 32 GB come formatted as exFAT, which these libraries may not open; use a 32 GB or smaller card as FAT32.
- The first failure is the SD module: a 5 V module on a 3.3 V bus, or a loose wire. Then a sensor line without its pull-up (reads −127 °C), then a card that is slow to wake.
- **Extend it** with a real-time clock chip for stand-alone use, more sensors, a second file per day, or a Wi-Fi upload when the card is full ([[store-and-forward]]).

> [!key] A logger is judged by what it keeps after something goes wrong. Choose how many lines you can afford to lose, set the flush interval to match, and give the card a button that closes the file before it is pulled.`,
  ideas: [
    'The ESP32 ranks first for an SD logger because of its card host, but SPI mode is enough here and avoids the GPIO12 trap.',
    'A written line is not on the card until it is flushed; the flush interval is the most it can lose.',
    'The time comes from a time server once; the last column says whether it was ever set.',
    'A card pulled out is noticed at the first write that touches it, so the program must treat a failed write as an event.'
  ],
  pitfalls: [
    'println() puts the line on the card — It puts the line in a buffer. Only a flush, a full buffer or closing the file writes the card, and a power cut before that loses the line.',
    'Pulling the card out is harmless when nothing is being written — The directory and the allocation table are only updated on a flush or a close. A card pulled while a file is open can leave a damaged or empty file.',
    'Any SD module will do — Many modules carry a 5 V regulator and level shifters made for 5 V boards, and read badly or not at all on a 3.3 V bus. Check the schematic and wire the card at 3.3 V.'
  ],
  terms: [
    { term: 'Flush', also: ['sync', 'write-back'], def: 'To force data waiting in a buffer out to the storage medium. A file\'s data is safe on the card only after a flush or a close.' },
    { term: 'CSV', also: ['comma-separated values'], def: 'A plain text format with one record per line and the fields separated by commas. Spreadsheets and plotting programs open it directly.' },
    { term: 'FAT32', also: ['FAT', 'exFAT'], def: 'The file system most small SD cards are formatted with. Cards over 32 GB are usually formatted exFAT, which many microcontroller libraries do not read.' },
    { term: 'Append mode', also: ['FILE_APPEND', 'open for append'], def: 'Opening a file so that every write goes after what is already in it. A logger that restarts carries on in the same file.' },
    { term: 'Safe eject', also: ['unmount'], def: 'Flushing and closing every open file before the card is removed, so that nothing is waiting in memory and the file system is consistent.' }
  ],
  code: [
    {
      title: 'The logger, with a flush every 30 s',
      about: 'Three states (NO_CARD, LOGGING, EJECTED). A line is written every 10 s, buffered lines are pushed to the card every 30 s, and a button closes the file for a safe removal. The time is taken from a time server once at start-up and written in universal time.',
      needs: 'An ESP32-DevKitC V4, a 3.3 V microSD module with a card of 32 GB or less (FAT32), a DS18B20 with a 4.7 kΩ pull-up, a button, an LED with 330 Ω. Arduino: the OneWire and DallasTemperature libraries.',
      wiring: [['GPIO18', 'SD SCK'], ['GPIO19', 'SD MISO'], ['GPIO23', 'SD MOSI'], ['GPIO5', 'SD CS', 'strapping pin: idles high, as required'], ['GPIO21', 'DS18B20 data', '4.7 kΩ to 3.3 V'], ['GPIO22', 'button → GND', 'internal pull-up'], ['GPIO4', '330 Ω → LED → GND']],
      libs: ['OneWire', 'DallasTemperature'],
      blocks: `
        when started
          set pin (4) as [output v]
          set pin (22) as [input with pull-up v]
          start SPI on SCK (18) MISO (19) MOSI (23)
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until the time is set, at most (10) seconds :: net
          switch Wi-Fi off :: wifi
          go to state [NO_CARD v]

        when entering state [NO_CARD v]
          mount the card and open [/log.csv] for append :: storage
          if <the card is mounted> then
            go to state [LOGGING v]
          end

        when (5) seconds in state [NO_CARD v]
          go to state [NO_CARD v]

        when entering state [LOGGING v]
          set pin (4) to [HIGH v]

        every (10) seconds
          if <state = [LOGGING v]> then
            set [t v] to (read the DS18B20 temperature) :: sensing
            append (join (current time) [,] (t)) to file [/log.csv]
            if <the write failed> then
              go to state [NO_CARD v]
            end
          end

        every (30) seconds
          if <state = [LOGGING v]> then
            flush the file to the card :: storage
          end

        when pin (22) goes [low v]
          if <state = [LOGGING v]> then
            flush and close the file :: storage
            go to state [EJECTED v]
          else if <state = [EJECTED v]> then
            go to state [NO_CARD v]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <SPI.h>
        #include <SD.h>
        #include <OneWire.h>
        #include <DallasTemperature.h>
        #include <time.h>

        const int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23, PIN_CS = 5;   // the SD card over SPI
        const int PIN_DS = 21, PIN_BUTTON = 22, PIN_LED = 4;
        const uint32_t SAMPLE_MS = 10000;            // one line every 10 s
        const uint32_t FLUSH_MS = 30000;             // lines may wait in memory this long
        const char *FILE_NAME = "/log.csv";

        OneWire oneWire(PIN_DS);
        DallasTemperature ds(&oneWire);
        enum State { NO_CARD, LOGGING, EJECTED };
        State state = NO_CARD;
        File logFile;
        uint32_t lastSample = 0, lastFlush = 0, lastTry = 0;
        int timeOk = 0;

        bool mountCard() {                           // true when the card is there and the file is open
          if (!SD.begin(PIN_CS)) return false;
          logFile = SD.open(FILE_NAME, FILE_APPEND);
          if (!logFile) return false;
          if (logFile.size() == 0) logFile.println("time,temp_c,time_ok");
          return true;
        }

        void go(State s) {
          if (state == LOGGING) { logFile.close(); SD.end(); }   // close() writes what is waiting
          state = s;
          if (s == LOGGING) lastSample = lastFlush = millis();
          if (s == NO_CARD) lastTry = millis();                  // try again in 5 s
        }

        void sample() {
          ds.requestTemperatures();                  // blocks about 750 ms: fine every 10 s
          float t = ds.getTempCByIndex(0);
          char line[48];
          time_t now = time(nullptr);
          struct tm utc;
          gmtime_r(&now, &utc);
          size_t n = strftime(line, sizeof line, "%Y-%m-%dT%H:%M:%SZ,", &utc);
          if (t == DEVICE_DISCONNECTED_C) snprintf(line + n, sizeof line - n, ",%d", timeOk);   // no sensor: empty field
          else snprintf(line + n, sizeof line - n, "%.2f,%d", t, timeOk);
          if (logFile.println(line) == 0) go(NO_CARD);           // nothing written: the card is gone
        }

        void setup() {
          pinMode(PIN_LED, OUTPUT);
          pinMode(PIN_BUTTON, INPUT_PULLUP);
          SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
          ds.begin();
          WiFi.begin("your-ssid", "your-password");              // do not leave real credentials in shared code
          configTime(0, 0, "pool.ntp.org");                      // universal time in the file
          struct tm t;
          timeOk = getLocalTime(&t, 10000) ? 1 : 0;              // waits up to 10 s for the first answer
          WiFi.mode(WIFI_OFF);                                   // the radio is not needed any more
        }

        void loop() {
          uint32_t now = millis();
          static bool wasPressed = false;
          bool pressed = digitalRead(PIN_BUTTON) == LOW;
          if (pressed && !wasPressed) {                          // the eject button
            if (state == LOGGING) go(EJECTED);
            else if (state == EJECTED) go(NO_CARD);
          }
          wasPressed = pressed;
          if (state == NO_CARD && now - lastTry >= 5000) {
            lastTry = now;
            if (mountCard()) go(LOGGING);
          }
          if (state == LOGGING) {
            if (now - lastSample >= SAMPLE_MS) { lastSample += SAMPLE_MS; sample(); }
            if (state == LOGGING && now - lastFlush >= FLUSH_MS) { lastFlush = now; logFile.flush(); }
          }
          digitalWrite(PIN_LED, state == LOGGING ? HIGH : (now / (state == NO_CARD ? 1000 : 150)) % 2);
        }
      `,
      py: String.raw`
        import network, ntptime, onewire, ds18x20, os, time, vfs
        from machine import Pin, SDCard

        PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS = 18, 19, 23, 5   # the SD card over SPI
        PIN_DS, PIN_BUTTON, PIN_LED = 21, 22, 4
        SAMPLE_MS = 10000                                     # one line every 10 s
        FLUSH_MS = 30000                                      # lines may wait in memory this long
        FILE_NAME = "/sd/log.csv"

        NO_CARD, LOGGING, EJECTED = range(3)
        led = Pin(PIN_LED, Pin.OUT)
        button = Pin(PIN_BUTTON, Pin.IN, Pin.PULL_UP)
        ds = ds18x20.DS18X20(onewire.OneWire(Pin(PIN_DS)))
        roms = ds.scan()
        log_file = None
        state, last_sample, last_flush, last_try = NO_CARD, 0, 0, 0
        time_ok = 0

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")            # do not leave real credentials in shared code
        for _ in range(10):                                   # waits up to 10 s for the first answer
            try:
                ntptime.settime()                             # the clock now holds universal time
                time_ok = 1
                break
            except OSError:
                time.sleep(1)
        wlan.active(False)                                    # the radio is not needed any more

        def mount_card():                                     # True when the card is there and the file is open
            global log_file
            try:
                vfs.mount(SDCard(slot=2, sck=Pin(PIN_SCK), miso=Pin(PIN_MISO), mosi=Pin(PIN_MOSI), cs=Pin(PIN_CS)), "/sd")
                new = "log.csv" not in os.listdir("/sd")
                log_file = open(FILE_NAME, "a")
                if new:
                    log_file.write("time,temp_c,time_ok\n")
                return True
            except OSError:
                return False

        def go(s):
            global state, last_sample, last_flush, last_try
            if state == LOGGING:                              # close() writes what is waiting
                try:
                    log_file.close()
                    vfs.umount("/sd")
                except OSError:
                    pass
            state = s
            if s == LOGGING:
                last_sample = last_flush = time.ticks_ms()
            if s == NO_CARD:
                last_try = time.ticks_ms()                    # try again in 5 s

        def sample():
            ds.convert_temp()
            time.sleep_ms(750)                                # fine every 10 s
            try:
                t = "%.2f" % ds.read_temp(roms[0])
            except Exception:
                t = ""                                        # no sensor: empty field
            y, mo, d, h, mi, s = time.gmtime()[:6]
            try:
                log_file.write("%04d-%02d-%02dT%02d:%02d:%02dZ,%s,%d\n" % (y, mo, d, h, mi, s, t, time_ok))
            except OSError:
                go(NO_CARD)                                   # the write failed: the card is gone

        was_pressed = False
        while True:
            now = time.ticks_ms()
            pressed = button.value() == 0
            if pressed and not was_pressed:                   # the eject button
                if state == LOGGING:
                    go(EJECTED)
                elif state == EJECTED:
                    go(NO_CARD)
            was_pressed = pressed
            if state == NO_CARD and time.ticks_diff(now, last_try) >= 5000:
                last_try = now
                if mount_card():
                    go(LOGGING)
            if state == LOGGING:
                if time.ticks_diff(now, last_sample) >= SAMPLE_MS:
                    last_sample = time.ticks_add(last_sample, SAMPLE_MS)
                    sample()
                if state == LOGGING and time.ticks_diff(now, last_flush) >= FLUSH_MS:
                    last_flush = now
                    log_file.flush()
            led.value(1 if state == LOGGING else (now // (1000 if state == NO_CARD else 150)) % 2)
            time.sleep_ms(10)
      `,
      output: `
        time,temp_c,time_ok
        2026-10-04T12:34:56Z,21.50,1
        2026-10-04T12:35:06Z,21.50,1
        2026-10-04T12:35:16Z,21.56,1
      `,
      notes: ['The file shows what a spreadsheet will see. If time_ok is 0 the stamps count from 1970 (C++) or 2000 (MicroPython) and are not real: fix the Wi-Fi and look at the column.', 'Without Wi-Fi the logger never asks again: the chip\'s clock drifts about two seconds a day. A real-time clock chip fixes it for stand-alone use.', 'The first mount takes up to 5 s after power-up, because the NO_CARD state retries on a timer: change the first delay if you want it faster.', 'Never copy real Wi-Fi credentials into code you share ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'What does a flush policy cost and save?',
      q: 'The logger writes a line every 10 s. Compare flushing after every line, every 30 s, and every 5 minutes: how many flushes a day, and the most that a power cut can lose?',
      steps: ['A day has 86,400 s. Flushing after every line: $86400/10 = 8640$ flushes, and nothing is lost except the line being written.', 'Every 30 s: $86400/30 = 2880$ flushes; at most 30 s of data, three lines.', 'Every 5 minutes: $86400/300 = 288$ flushes; at most 5 minutes, thirty lines.'],
      a: '8640, 2880 or 288 flushes a day for a worst loss of 0, 3 or 30 lines. Choose the loss you can live with, then flush that often and no more.'
    }
  ],
  quiz: [
    { q: 'The program calls println() on the open file and the power fails a second later. What is on the card?', choices: ['The line', 'Nothing of that line, unless a flush or close came in between', 'Half the line', 'The whole file is lost'], a: 1, why: 'println() fills a buffer in memory. The card is written when the buffer fills, on a flush or on a close, so the line is lost if power fails before one of those.' },
    { q: 'Why does the design use the SD card in SPI mode on an ESP32 and not in 4-bit mode?', choices: ['SPI mode is faster', '4-bit mode puts a data line on GPIO12, and a card that holds it high stops the board booting', 'SPI mode needs fewer pins on the card', 'The libraries do not support 4-bit mode'], a: 1, why: 'GPIO12 is the ESP32\'s flash-voltage strapping pin. A card data line that idles high selects 1.8 V and the module\'s flash cannot be read. SPI mode avoids the pin.' },
    { q: 'Which flush interval loses the most data at a power cut?', choices: ['After every line', 'Every 30 seconds', 'Every 5 minutes', 'They lose the same'], a: 2, why: 'The most you can lose is the data written since the last flush: one line, 30 s, or 5 minutes.' },
    { q: 'The logger runs for a month on one cell, and the state machine, flush policy and file format are correct. What most decides the battery life?', choices: ['The CSV format', 'The sleeping current of the whole board, including the SD module', 'The file name', 'The flush interval alone'], a: 1, why: 'Sleep takes nearly all the time, so its current dominates: the chip sleeps at 10 µA but the SD module and the board\'s regulator can draw a hundred times more.' }
  ],
  applications: [
    'A temperature record for a fridge, freezer or greenhouse that must show a regulator or an insurer what happened.',
    'A vibration or current logger bolted to a machine and read out once a week.',
    'An air-quality or noise survey carried through a building, with the file opened in a spreadsheet.',
    'The black box of a model aircraft or a robot, flushed every second.'
  ],
  sources: [
    'Maxim Integrated, DS18B20 datasheet: accuracy, resolution and conversion time.',
    'SD Association, Physical Layer Simplified Specification: the SPI mode of an SD card; Arduino core for ESP32 documentation, the SD library and its examples.',
    'MicroPython documentation, machine.SDCard and the vfs module (version 1.29).'
  ],
  sim: 'wp2-data-logger'
},

/* ================================================================ a garage-door controller */
{
  id: 'project-garage-door',
  parent: 'worked-projects',
  title: 'A garage-door controller',
  level: 3,
  short: 'A relay that presses the opener\'s button, two switches that say where the door is, and a state machine that never assumes. The opener keeps its own safety devices; the controller only adds a second button and a pair of eyes.',
  keywords: ['garage door', 'door opener', 'relay pulse', 'limit switch', 'reed switch', 'dry contact', 'obstruction', 'time-out', 'door state', 'photo-eye', 'force limit', 'Home Assistant', 'remote opener', 'safety'],
  prereq: ['relays', 'limit-switches-and-homing', 'timeouts-and-timed-states', 'error-states-and-recovery'],
  related: ['safety-in-control', 'web-server-on-esp', 'pins-at-boot', 'transistor-as-a-switch', 'isolation-and-long-cables', 'web-interface-security', 'webhooks-and-notifications', 'entry-exit-and-guards'],
  body: `**The idea:** open and close a garage door from a phone, and know from anywhere whether it is shut. The door already has an opener with a wall button. The controller does only two things: it closes a contact for half a second, as a second wall button would, and it watches two switches that say where the door is.

> [!warn] A garage door can crush and kill. The opener's own safety devices, the photo-eye beam and the force limit that reverses the door, must stay fitted, working and tested: this controller neither replaces nor bypasses them. It never touches the mains: its relay contact connects only to the opener's low-voltage push-button terminals (read the manual), and mains work is for a qualified person. Closing a door you cannot see is restricted in many places: check your country's rules. The standards behind the safety devices are EN 12453 in Europe and UL 325 in the US.

### What it must do, in numbers

- A **0.5 s** closure of the relay contact, whatever the phone does: never longer, never twice by accident.
- Two switches (reed switches with magnets, or small limit switches): one that is closed when the door is fully closed, one when it is fully open.
- A typical door takes **12–15 s** to travel (measure yours); if it has not arrived after **25 s**, something is wrong and the controller says so.
- The state of the door in under 1 s on a status page, and a press only for someone who knows the password.
- **The relay must not pulse at power-up, reset or crash.** Test it fifty times.

### The chip, and why

The [project advisor](#/tools/advisor), given "a garage door controller with a relay and two limit switches over Wi-Fi", reads Wi-Fi and a relay load. It ranks the **ESP32-C3** first (99), the ESP32 and ESP32-C6 next (98) and the ESP32-S3 (97), and rules out the chips without Wi-Fi: H2, P4, H4 and H21. The advisor's "mains" need comes from the word relay; here the relay switches a button circuit, not the mains, and the advice about isolation and a qualified hand applies to the mains and nowhere else. One core and Wi-Fi are all the job needs: an **ESP32-C3-DevKitM-1**.

### The parts and the wiring

A relay module (or a transistor driving a small relay) whose contact goes across the opener's button terminals, two switches, an LED. [The pin planner](#/tools/pinout/plan) gave the first plain pins to the inputs and put two of its choices on GPIO0 and GPIO1, which it flags (they are the crystal pins when a 32 kHz crystal is fitted). We moved the relay to the plainest pin and used a JTAG pin the catalogue calls free by default:

| Pin | Goes to | Note |
|---|---|---|
| GPIO3 | relay input, through a transistor with a 10 kΩ pull-down | a plain pin; held low by the pull-down while the chip resets |
| GPIO10 | "closed" switch to ground | input with pull-up; a long cable wants an RC filter ([[isolation-and-long-cables]]) |
| GPIO4 | "open" switch to ground | a JTAG pin, free as GPIO while JTAG runs over USB, the default |
| GPIO5 | status LED through 330 Ω | |

The pull-down is the safety part: during reset the pins float for a moment, and a floating relay input can click. The relay's coil supply is separate from the 3.3 V rail.

### The behaviour as a state machine

Five states: **CLOSED**, **OPENING**, **OPEN**, **CLOSING** and **AJAR** (between the ends and not moving). Commands are *requests*: the opener decides what a press means (a press during travel stops it, the next one reverses it). The switches are *facts*, and the machine follows them. A press (CMD) moves CLOSED to OPENING and OPEN to CLOSING; a switch that lets go without a press (LEAVES) means someone used the wall button. Arrival at the far switch ends a move; the open switch coming on during CLOSING means the opener's own obstruction reversal took the door back up. After 25 s of travel the machine gives up: AJAR, with an alarm. The next press from AJAR makes the opener reverse its last direction, which a guard remembers. Press the buttons in the simulation, put something in the doorway, and stop the opener.

### The program

The status page needs no password (it only reads); the press needs one, over plain HTTP on your own network: do not open this port to the internet ([[web-interface-security]]). The state at power-up comes from the switches, never from memory. The relay pulse is timed by the loop, not by delay, so the web server never stalls. The C++ version uses the core's web server and its login check; the MicroPython version a small socket server that reads the request line and the login header.

### The power budget

It is mains-powered through a 5 V adapter (or a converter from the opener's accessory supply, if it has one), always on Wi-Fi: about 87 mA listening on the C3, so roughly 0.4 W, a little under 4 kWh a year, plus the relay coil for half a second per press. Not a battery job.

### Test it, and where it breaks first

- Power-up fifty times with the relay's contact connected to a meter or a lamp: no click.
- Stand by the door, hand on the wall button, and try every state with the door slow and fast. Pull the controller's power mid-travel and restart it: it must come up AJAR.
- The first failures: a switch wire that comes loose (add a check that both switches are never on at once), a slipped magnet, a door that is slower in winter.
- **Extend it** with a "left open" reminder after ten minutes ([[webhooks-and-notifications]]), Home Assistant, or a light for the doorway.

> [!key] The controller adds a button and two eyes to an opener that keeps its own safety devices. Commands are requests, switches are facts, and a time-out turns "it did not arrive" into a state with an alarm. The relay must stay off in every kind of start.`,
  ideas: [
    'The controller only closes a contact for half a second, like a second wall button; the opener keeps its photo-eye and force limit.',
    'The commands are requests and the switches are facts: the machine follows the switches, and starts from them after a reset.',
    'A press during travel stops the door; the next one reverses it, so the machine remembers the last direction with a guard.',
    'A time-out of about twice the travel time turns a stuck door into the state AJAR with an alarm.'
  ],
  pitfalls: [
    'The state can be kept in memory and restored after a reset — The door may have moved while the controller was off. Read the switches at start-up and let them decide.',
    'A relay board on any pin is fine — Pins float during reset and some modules click. Use a pin that is quiet at start, a transistor stage with a pull-down, and test fifty power-ups before connecting the opener.',
    'The Wi-Fi password protects the door — A page with plain HTTP and a shared password is for a trusted home network only. Keep it off the internet, and prefer a proper home-automation gateway for remote use.'
  ],
  terms: [
    { term: 'Dry contact', also: ['potential-free contact', 'volt-free contact'], def: 'A relay contact that is not connected to any supply: it only closes a circuit that someone else powers. The opener\'s button input expects exactly that.' },
    { term: 'Limit switch', also: ['end stop', 'reed switch'], def: 'A switch that closes when a moving part reaches the end of its travel. A reed switch with a magnet does the same without touching the door.' },
    { term: 'Obstruction reversal', also: ['force limit', 'auto-reverse'], def: 'The opener\'s own safety function: if the closing door meets resistance, it stops and goes back up. The controller can only notice that the door went up again.' },
    { term: 'Travel time-out', also: ['watchdog on motion'], def: 'A limit on how long a move may take. When it runs out the machine leaves the moving state and raises an alarm: the door is stuck, blocked or the sensor failed.' },
    { term: 'Photo-eye', also: ['safety beam', 'photocell'], def: 'A light beam across the doorway that stops or reverses a closing door when something breaks it. It is part of the opener, not of this controller.' }
  ],
  code: [
    {
      title: 'The controller: press, watch, time out',
      about: 'Five states from the two switches and the press. A web request presses the opener\'s button for half a second; the status page tells the state. A move that lasts more than 25 s becomes AJAR with an alarm, and after a reset the state comes from the switches.',
      needs: 'An ESP32-C3-DevKitM-1, a relay module driven through a transistor with a 10 kΩ pull-down, two reed or limit switches, an LED with 330 Ω, a 5 V supply, and an opener with push-button terminals. Nothing is connected to the mains.',
      wiring: [['GPIO3', 'transistor base (10 kΩ pull-down) → relay → opener button terminals', 'low voltage only'], ['GPIO10', '"closed" switch → GND', 'internal pull-up'], ['GPIO4', '"open" switch → GND', 'internal pull-up'], ['GPIO5', '330 Ω → LED → GND']],
      blocks: `
        when started
          set pin (3) as [output v]
          set pin (3) to [LOW v]
          set pin (10) as [input with pull-up v]
          set pin (4) as [input with pull-up v]
          set pin (5) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          start web server on port (80)
          if <(read pin (10)) = [LOW v]> then
            go to state [CLOSED v]
          else if <(read pin (4)) = [LOW v]> then
            go to state [OPEN v]
          else
            go to state [AJAR v]
          end

        when request for [/press] arrives
          raise event [CMD v] :: state

        when event [CMD v] in state [CLOSED v]
          press the opener's button for (0.5) seconds :: my
          go to state [OPENING v]

        when event [CMD v] in state [OPEN v]
          press the opener's button for (0.5) seconds :: my
          go to state [CLOSING v]

        when event [CMD v] in state [OPENING v]
          press the opener's button for (0.5) seconds :: my
          go to state [AJAR v]

        when event [CMD v] in state [CLOSING v]
          press the opener's button for (0.5) seconds :: my
          go to state [AJAR v]

        when event [CMD v] in state [AJAR v]
          press the opener's button for (0.5) seconds :: my
          if <was closing> then
            go to state [OPENING v]
          else
            go to state [CLOSING v]
          end

        every (0.1) seconds
          if <<state = [CLOSED v]> and <(read pin (10)) = [HIGH v]>> then
            go to state [OPENING v]
          else if <<state = [OPEN v]> and <(read pin (4)) = [HIGH v]>> then
            go to state [CLOSING v]
          else if <<state = [OPENING v]> and <(read pin (4)) = [LOW v]>> then
            go to state [OPEN v]
          else if <<state = [CLOSING v]> and <(read pin (10)) = [LOW v]>> then
            go to state [CLOSED v]
          end

        when (25) seconds in state [OPENING v]
          set [alarm v] to <true>
          go to state [AJAR v]

        when (25) seconds in state [CLOSING v]
          set [alarm v] to <true>
          go to state [AJAR v]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>

        const int PIN_RELAY = 3;                 // transistor stage with a pull-down: quiet at reset
        const int PIN_CLOSED = 10;               // switch to GND when the door is fully closed
        const int PIN_OPEN = 4;                  // switch to GND when the door is fully open
        const int PIN_LED = 5;
        const uint32_t PULSE_MS = 500;           // how long the relay "presses the button"
        const uint32_t TRAVEL_MS = 25000;        // about twice the door's travel: longer means trouble

        WebServer server(80);
        enum State { CLOSED, OPENING, OPEN, CLOSING, AJAR };
        const char *NAMES[] = {"closed", "opening", "open", "closing", "ajar"};
        State state;
        uint32_t enteredAt = 0, pulseEnds = 0;
        bool wasClosing = false, faulted = false;

        bool closedSw() { return digitalRead(PIN_CLOSED) == LOW; }
        bool openSw()   { return digitalRead(PIN_OPEN) == LOW; }

        void go(State s) {
          if (s == AJAR) wasClosing = (state == CLOSING);        // the direction the door was going
          state = s;
          enteredAt = millis();
        }

        void command() {                         // CMD: press the opener's button, as a wall button would
          digitalWrite(PIN_RELAY, HIGH);
          pulseEnds = millis() + PULSE_MS;
          faulted = false;
          switch (state) {
            case CLOSED:  go(OPENING); break;
            case OPEN:    go(CLOSING); break;
            case OPENING:
            case CLOSING: go(AJAR); break;                       // a press during travel stops the door
            case AJAR:    go(wasClosing ? OPENING : CLOSING); break;
          }
        }

        void onPress() {
          if (!server.authenticate("door", "your-password")) { server.requestAuthentication(); return; }
          command();
          server.send(200, "text/plain", "pressed");
        }

        void setup() {
          pinMode(PIN_RELAY, OUTPUT);
          digitalWrite(PIN_RELAY, LOW);                          // first of all: no press
          pinMode(PIN_CLOSED, INPUT_PULLUP);
          pinMode(PIN_OPEN, INPUT_PULLUP);
          pinMode(PIN_LED, OUTPUT);
          state = closedSw() ? CLOSED : openSw() ? OPEN : AJAR;  // the switches are facts: start from them
          WiFi.begin("your-ssid", "your-password");              // do not leave real credentials in shared code
          server.on("/press", onPress);
          server.on("/status", []() { server.send(200, "text/plain", NAMES[state]); });
          server.begin();
        }

        void loop() {
          server.handleClient();
          uint32_t now = millis(), held = now - enteredAt;
          if (pulseEnds && now > pulseEnds) { digitalWrite(PIN_RELAY, LOW); pulseEnds = 0; }   // release the button
          switch (state) {
            case CLOSED: if (!closedSw()) go(OPENING); break;    // someone used the wall button or the remote
            case OPEN:   if (!openSw()) go(CLOSING); break;
            case OPENING:
              if (openSw()) go(OPEN);
              else if (held > TRAVEL_MS) { faulted = true; go(AJAR); }
              break;
            case CLOSING:
              if (closedSw()) go(CLOSED);
              else if (held > 2000 && openSw()) go(OPEN);        // back up: the opener met an obstacle
              else if (held > TRAVEL_MS) { faulted = true; go(AJAR); }
              break;
            default: break;
          }
          bool slow = (now / 400) % 2, fast = (now / 100) % 2;
          digitalWrite(PIN_LED, state == OPEN ? HIGH : state == CLOSED ? LOW : state == AJAR ? (faulted ? fast : HIGH) : slow);
        }
      `,
      py: String.raw`
        import binascii, network, socket, time
        from machine import Pin

        PIN_RELAY, PIN_CLOSED, PIN_OPEN, PIN_LED = 3, 10, 4, 5
        PULSE_MS = 500                           # how long the relay "presses the button"
        TRAVEL_MS = 25000                        # about twice the door's travel: longer means trouble
        AUTH = "Authorization: Basic " + binascii.b2a_base64(b"door:your-password").decode().strip()

        CLOSED, OPENING, OPEN, CLOSING, AJAR = range(5)
        NAMES = ("closed", "opening", "open", "closing", "ajar")
        relay = Pin(PIN_RELAY, Pin.OUT, value=0)               # first of all: no press
        closed_sw = Pin(PIN_CLOSED, Pin.IN, Pin.PULL_UP)       # switch to GND when the door is fully closed
        open_sw = Pin(PIN_OPEN, Pin.IN, Pin.PULL_UP)           # switch to GND when the door is fully open
        led = Pin(PIN_LED, Pin.OUT)

        def is_closed(): return closed_sw.value() == 0
        def is_open(): return open_sw.value() == 0

        state = CLOSED if is_closed() else OPEN if is_open() else AJAR   # the switches are facts: start from them
        entered, pulse_ends, was_closing, faulted = time.ticks_ms(), 0, False, False

        def go(s):
            global state, entered, was_closing
            if s == AJAR:
                was_closing = (state == CLOSING)               # the direction the door was going
            state, entered = s, time.ticks_ms()

        def command():                                         # CMD: press the opener's button, as a wall button would
            global pulse_ends, faulted
            relay.value(1)
            pulse_ends = time.ticks_add(time.ticks_ms(), PULSE_MS)
            faulted = False
            if state == CLOSED:
                go(OPENING)
            elif state == OPEN:
                go(CLOSING)
            elif state in (OPENING, CLOSING):
                go(AJAR)                                       # a press during travel stops the door
            else:
                go(OPENING if was_closing else CLOSING)

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")             # do not leave real credentials in shared code
        srv = socket.socket()
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("0.0.0.0", 80))
        srv.listen(2)
        srv.setblocking(False)

        def serve():
            try:
                cl, _ = srv.accept()
            except OSError:
                return                                         # nobody is knocking
            try:
                cl.settimeout(1)
                req = cl.recv(1024).decode()
                if req.startswith("GET /status"):
                    head, body = "200 OK", NAMES[state]
                elif req.startswith("GET /press") and AUTH in req:
                    command()
                    head, body = "200 OK", "pressed"
                else:
                    head, body = "401 Unauthorized\r\nWWW-Authenticate: Basic realm=door", "login"
                cl.send("HTTP/1.0 " + head + "\r\nContent-Type: text/plain\r\n\r\n" + body)
            except OSError:
                pass
            finally:
                cl.close()

        while True:
            serve()
            now = time.ticks_ms()
            held = time.ticks_diff(now, entered)
            if pulse_ends and time.ticks_diff(now, pulse_ends) > 0:
                relay.value(0)                                 # release the button
                pulse_ends = 0
            if state == CLOSED and not is_closed():
                go(OPENING)                                    # someone used the wall button or the remote
            elif state == OPEN and not is_open():
                go(CLOSING)
            elif state == OPENING:
                if is_open():
                    go(OPEN)
                elif held > TRAVEL_MS:
                    faulted = True
                    go(AJAR)
            elif state == CLOSING:
                if is_closed():
                    go(CLOSED)
                elif held > 2000 and is_open():
                    go(OPEN)                                   # back up: the opener met an obstacle
                elif held > TRAVEL_MS:
                    faulted = True
                    go(AJAR)
            slow, fast = (now // 400) % 2, (now // 100) % 2
            led.value(1 if state == OPEN else 0 if state == CLOSED else (fast if faulted else 1) if state == AJAR else slow)
            time.sleep_ms(10)
      `,
      output: `
        GET /status  ->  closed
        GET /press   ->  (login prompt, then) pressed
        GET /status  ->  opening
        GET /status  ->  open
      `,
      notes: ['The 2 s wait before "back up" is there because the open switch is still active just after a press from OPEN: raise it if your opener starts slowly.', 'The login is plain HTTP and the page a convenience for your own network. For remote use put a home-automation gateway in between ([[web-interface-security]]).', 'The controller never reads or drives the opener\'s safety circuit. If you want to know how often the photo-eye trips, take a read-only signal from the opener\'s own output, never in series with the beam.', 'Never copy real Wi-Fi credentials into code you share ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'Which state after a power cut in the middle of the night?',
      q: 'The power fails while the door is closing and comes back an hour later. The controller restarts. The closed switch is open, the open switch is open. Which state does it start in, and what does the next press do?',
      steps: ['At start-up the program reads the switches: neither is active, so the door is between the ends and not necessarily moving.', 'The state is AJAR. The controller has lost its memory of the direction, so `wasClosing` starts false.', 'A press makes the opener reverse its own last direction, which the opener remembers: the controller goes to CLOSING, and the next switch events correct it if the door goes the other way.'],
      a: 'AJAR. The controller never trusts memory over the switches, and the first limit switch reached puts it right.'
    }
  ],
  quiz: [
    { q: 'The relay contact is closed for ten seconds by a bug. What may happen?', choices: ['Nothing: the opener ignores long presses', 'The opener may treat it as a held button or a stuck button and misbehave', 'The door closes faster', 'The Wi-Fi drops'], a: 1, why: 'A button held down is a fault the opener may handle in its own way, and a stuck contact can leave a door unattended. The pulse is timed by the loop and limited to 0.5 s.' },
    { q: 'The controller thinks the door is CLOSED, but someone opens it with the wall button. How does the machine find out?', choices: ['It cannot', 'The closed switch lets go and the machine goes to OPENING', 'The phone tells it', 'The relay reports it'], a: 1, why: 'The switches are facts. In CLOSED the closed switch letting go is the event LEAVES, which moves the machine to OPENING without any pulse.' },
    { q: 'The door was closing and was stopped by a press. The next press: what does the opener do, and what state does the controller go to?', choices: ['It closes; CLOSING', 'It opens (reverses its last direction); OPENING', 'It stays stopped; AJAR', 'It opens; OPEN'], a: 1, why: 'Openers usually reverse the last direction after a stop. The guard `wasClosing` remembers that the last direction was closing, so the next press leads to OPENING.' },
    { q: 'The controller can replace the photo-eye, because it can see the door with its two switches.', a: false, why: 'The switches see only the two ends of the travel. The photo-eye and the force limit protect people and objects in the doorway during the move and must stay in the opener.' }
  ],
  applications: [
    'A second "wall button" in the pocket for a family door, with the state shown on a phone.',
    'A gate or a car-park barrier with a dry-contact input and an open/closed sensor.',
    'A roller shutter or a workshop door with the same press-and-watch pattern.',
    'The pattern for any "request and confirm" actuator: press, watch the sensor, and time out.'
  ],
  sources: [
    'The opener maker\'s installation manual: the push-button terminals, the safety devices and the test procedure.',
    'EN 12453, Industrial, commercial and garage doors and gates: safety in use of power operated doors; UL 325, Door, drapery, gate, louver, and window operators and systems.',
    'Espressif, ESP32-C3 Series Datasheet: the pin table, strapping pins and power-up behaviour of the pins.'
  ],
  sim: 'wp2-garage-door'
},

/* ================================================================ a Zigbee light switch */
{
  id: 'project-zigbee-switch',
  parent: 'worked-projects',
  title: 'A Zigbee light switch',
  level: 3,
  short: 'A wall switch with no wires: a battery, a button and a Zigbee radio that sleeps almost all the time. The design is a budget in disguise: how long the chip stays awake on each press decides whether the cells last a year or a decade.',
  keywords: ['Zigbee', 'ESP32-H2', 'ESP32-C6', 'end device', 'sleepy end device', 'wall switch', 'on/off switch', 'binding', 'pairing', 'permit join', 'deep sleep', 'battery switch', 'Zigbee2MQTT', 'coordinator', '802.15.4'],
  prereq: ['zigbee', 'zigbee-on-esp', 'sleepy-ble-zigbee-thread', 'deep-sleep'],
  related: ['zigbee-device-types-and-clusters', 'zigbee-with-home-assistant', 'ieee-802-15-4', 'wake-up-sources', 'battery-life-budget', 'aa-cells-and-coin-cells', 'long-press-double-click', 'choosing-a-smart-home-radio'],
  body: `**The idea:** a switch that you can stick on any wall, that turns a Zigbee lamp or a group of them on and off, and that needs a new battery every few years rather than every few weeks. It never touches the mains: it only sends a message.

### What it must do, in numbers

- One press toggles the light, and the lamp reacts in **about a second or two**: the chip has to wake, rejoin the network and send.
- About **20 presses a day**; the rest of the day it sleeps.
- A hold of **5 s** forgets the network and pairs again with a hub that has opened its network for joining (usually for one or two minutes).
- It is a **battery end device**: it never routes other devices' messages, it sleeps, and the hub or the lamp does the remembering.
- Years on two AA cells or one CR123A, which means an average current below about 40 µA.

### The chip, and why

The [project advisor](#/tools/advisor), given "a Zigbee light switch on a battery", reads Zigbee and battery. It rules out every chip without an 802.15.4 radio (ESP32, S2, S3, C3, C2, C61) and ranks the **ESP32-C6** first (93), the **ESP32-H2** a point behind (92), then the C5 (88). Both sleep at 7 µA in the catalogue; the difference is the radio. The H2 has no Wi-Fi and draws 25 mA receiving and 140 mA at the transmit peak, where the C6 draws 82 mA and 354 mA. A switch needs no Wi-Fi, so we take the **ESP32-H2** on the **ESP32-H2-DevKitM-1**; the C6 is the safer buy for boards everywhere, and the same program runs on both. Arduino-core Zigbee exists for the C6 and H2; official MicroPython has none.

### The parts and the wiring

The chip, two AA cells (a CR2032 sags under the radio's current bursts), one button, an LED, and a hub with a Zigbee coordinator (a USB stick with Zigbee2MQTT or ZHA in Home Assistant, or a commercial hub). [The pin planner](#/tools/pinout/plan) chose:

| Pin | Goes to | Note |
|---|---|---|
| GPIO10 | button to ground, with a 100 kΩ pull-up to 3.3 V | an RTC pin, so it can wake the chip from deep sleep; the pull-up is outside the chip because the chip's own pulls are switched off in sleep |
| GPIO0 | status LED through 330 Ω | |
| 3V3 and GND | two AA cells through the board's regulator, or straight to the 3V3 pin | check the minimum voltage of the board's regulator |

### The behaviour as a state machine

**ASLEEP**: deep sleep at 7 µA; a press wakes the chip, a hold of 5 s starts pairing. **WAKING**: the chip has restarted; it starts the Zigbee stack and rejoins the stored network (10 s at most, then it blinks red and sleeps again). **SENDING**: it sends the On/Off toggle to the bound light and waits for the answer (3 s at most). **PAIRING**: it forgets the network and searches for a new one for up to 60 s. Every path ends in ASLEEP, and no state is held for long: that is the battery design. The simulation lets you break the hub, the lamp's answer and the pairing mode, and shows what a press costs.

### The program

Deep sleep ends the program, so every press is a fresh start and the machine is the straight line from \`setup()\` to the next sleep. The C++ version times how long the button is held, starts the stack as an end device, waits to be connected, sends the toggle and sleeps. A pairing request must survive the restart that forgetting the network causes, so a flag lives in the memory deep sleep keeps. The Zigbee library is young and its calls changed between core versions (core 4.0 moves to a newer Zigbee SDK): **check the endpoint class and its calls against the switch example of the core you install.** MicroPython has no Zigbee, so there is no MicroPython version.

### How the light is bound

A switch does not know which lamp it controls: the hub binds its On/Off client to a lamp or a group, usually with a button in the hub's interface. After that the switch sends to its bound targets and the lamp answers directly. Without the binding the press goes nowhere, which looks exactly like a dead switch ([[zigbee-with-home-assistant]]).

### The power budget

A press costs, in this budget, about 1.2 s awake: 1 s receiving at 25 mA and 0.2 s at the 140 mA peak, about 53 mA·s, which is a pessimistic figure to be replaced by a measurement. With 20 presses a day and 7 µA of sleep the average is 19 µA and two AA cells last about **8.7 years**; the cell's own self-discharge is included. A development board with a regulator and an LED that add 20 µA brings it to **4.9 years**, and one that adds 100 µA to **1.8 years**: the board's sleep current, not the radio, is the budget ([[battery-life-budget]]).

### Test it, and where it breaks first

- Press with the hub switched off: the red blink must come after 10 s and the chip must go back to sleep.
- Count the time from press to light with a stopwatch, ten times.
- The first failure is the binding (nothing happens), then a cell that sags (the chip resets in the middle of the join), then a board whose sleep current is a hundred times the chip's.
- **Extend it** with a dimming button, a battery report to the hub or a double press ([[long-press-double-click]]).

> [!warn] The switch only sends messages. If you ever replace a mains switch in the wall, use a ready-made, approved in-wall relay module installed by a qualified person; never put a development board in a wall box, and never reflash a device while it is connected to the mains.

> [!key] A battery Zigbee switch is a sleepy end device: asleep, wake on the button, rejoin, send, sleep. Four short states and a pairing flag cover it, and the years on the cells come from the minutes of wake time, not from the radio.`,
  ideas: [
    'The advisor ranks the C6 first and the H2 a point behind; for a battery switch the H2\'s far lower radio currents decide.',
    'Deep sleep ends the program, so each press is a fresh start: wake, rejoin, send, sleep.',
    'A hold of five seconds forgets the network; the request has to survive the restart it causes.',
    'The board\'s sleep current, not the radio, sets the years the cells last.'
  ],
  pitfalls: [
    'A CR2032 coin cell is the natural battery for a switch — It can give only a few milliamps, and the radio draws tens: the voltage collapses and the chip resets in the middle of the join. Use AA or CR123A cells, or add a large capacitor.',
    'Once the switch has joined, it controls the lamp — It controls whatever the hub bound it to. Without the binding the press is sent to nobody.',
    'A router is a better end device because it keeps the network strong — A router must stay awake to relay other devices\' messages. A battery switch is an end device by design.'
  ],
  terms: [
    { term: 'Sleepy end device', also: ['SED', 'battery end device'], def: 'A Zigbee node that sleeps most of the time and does not route messages. Its parent router stores messages for it until it wakes and asks.' },
    { term: 'Binding', also: ['Zigbee binding'], def: 'A table entry that tells a Zigbee device where to send the commands of one of its functions, for example the switch\'s On/Off commands. The hub usually creates it.' },
    { term: 'Permit join', also: ['pairing mode', 'open network'], def: 'A time window, set on the coordinator or a router, during which new devices may join the network. Outside it, a device that tries to join is refused.' },
    { term: 'On/Off cluster', also: ['genOnOff', 'ZCL on/off'], def: 'The Zigbee cluster library group of commands and attributes that switch something on, off or toggle it. A switch has the client side, a lamp the server side.' },
    { term: 'Network steering', also: ['joining', 'commissioning'], def: 'The step in which a device looks for open Zigbee networks and joins one that permits it. A device that has joined keeps the network\'s keys and rejoins by itself after a restart.' }
  ],
  code: [
    {
      title: 'The switch: wake, rejoin, send, sleep',
      about: 'The chip wakes on the button, starts Zigbee as an end device, waits up to 10 s to be connected, sends one On/Off toggle to the bound light, and sleeps. A hold of 5 s forgets the network and waits up to 60 s for a new one.',
      needs: 'An ESP32-H2-DevKitM-1 (or an ESP32-C6 board), a button with a 100 kΩ pull-up, an LED with 330 Ω, two AA cells, and a Zigbee hub with the switch bound to a lamp. In the Arduino IDE choose Tools → Zigbee Mode → Zigbee ED (end device) and a partition scheme with Zigbee. No MicroPython version exists.',
      wiring: [['GPIO10', 'button → GND, 100 kΩ to 3.3 V', 'wakes the chip from deep sleep'], ['GPIO0', '330 Ω → LED → GND'], ['3V3 / GND', 'two AA cells', 'not a coin cell']],
      blocks: `
        when started
          set pin (10) as [input v]
          set pin (0) as [output v]
          if <button held for (5) seconds> then
            go to state [PAIRING v]
          else
            go to state [WAKING v]
          end

        when entering state [PAIRING v]
          forget the network and search for a new one :: radio

        when entering state [WAKING v]
          start Zigbee as an end device and rejoin the stored network :: radio

        when Zigbee connects :: radio
          if <state = [WAKING v]> then
            go to state [SENDING v]
          else if <state = [PAIRING v]> then
            go to state [ASLEEP v]
          end

        when entering state [SENDING v]
          send an On/Off toggle to the bound light :: radio
          wait (0.3) seconds
          go to state [ASLEEP v]

        when (10) seconds in state [WAKING v]
          blink the LED (3) times :: my
          go to state [ASLEEP v]

        when (60) seconds in state [PAIRING v]
          go to state [ASLEEP v]

        when entering state [ASLEEP v]
          enable wake on pin (10)
          deep sleep until the button is pressed :: power
      `,
      cpp: String.raw`
        #ifndef ZIGBEE_MODE_ED
        #error "Select Tools > Zigbee Mode > Zigbee ED (end device)"
        #endif
        #include "Zigbee.h"

        const int PIN_BUTTON = 10;                 // button to GND with a 100 kΩ pull-up: an RTC pin
        const int PIN_LED = 0;
        const int SWITCH_ENDPOINT = 5;
        const uint32_t LONG_PRESS_MS = 5000;       // hold this long to pair again
        const uint32_t JOIN_MS = 10000;            // WAKING: rejoin time-out
        const uint32_t PAIR_MS = 60000;            // PAIRING: how long to search

        RTC_DATA_ATTR bool pairing = false;        // survives the restart that forgetting the network causes
        ZigbeeSwitch zbSwitch(SWITCH_ENDPOINT);

        void blinkLed(int times) {
          for (int i = 0; i < times; i++) { digitalWrite(PIN_LED, HIGH); delay(120); digitalWrite(PIN_LED, LOW); delay(120); }
        }

        void sleepNow() {                          // ASLEEP: about 7 µA until the button is pressed
          esp_sleep_enable_ext1_wakeup_io(1ULL << PIN_BUTTON, ESP_EXT1_WAKEUP_ANY_LOW);
          esp_deep_sleep_start();                  // never returns: the next press starts setup() again
        }

        void setup() {
          pinMode(PIN_LED, OUTPUT);
          pinMode(PIN_BUTTON, INPUT);              // the pull-up is outside the chip
          uint32_t t0 = millis();
          while (digitalRead(PIN_BUTTON) == LOW && millis() - t0 < LONG_PRESS_MS) delay(10);
          bool longPress = digitalRead(PIN_BUTTON) == LOW;       // still held after 5 s

          zbSwitch.setManufacturerAndModel("Espressif", "WallSwitch");
          Zigbee.addEndpoint(&zbSwitch);                         // endpoints BEFORE begin()
          if (longPress && !pairing) {                           // PAIRING: forget the network, restart
            pairing = true;
            Zigbee.factoryReset();
          }
          if (!Zigbee.begin()) { blinkLed(3); sleepNow(); }      // the stack did not start

          t0 = millis();                                         // WAKING (or PAIRING): wait to be connected
          uint32_t limit = pairing ? PAIR_MS : JOIN_MS;
          while (!Zigbee.connected() && millis() - t0 < limit) delay(50);

          if (Zigbee.connected()) {
            if (pairing) blinkLed(2);                            // paired: two blinks
            else {                                               // SENDING
              zbSwitch.lightToggle();                            // to whatever the hub bound this switch to
              delay(300);
              blinkLed(1);
            }
          } else {
            blinkLed(3);                                         // no network: say so and give up
          }
          pairing = false;
          sleepNow();                                            // ASLEEP
        }

        void loop() {}
      `,
      na: { py: 'Official MicroPython has no Zigbee support, and the 802.15.4 radio of the ESP32-H2 and C6 is reached in the ESP-IDF and the Arduino core only. Use the C++ version.' },
      output: `
        (no serial output: the LED blinks once after a toggle was sent,
         and three times when the network could not be reached)
      `,
      notes: ['The class `ZigbeeSwitch` and its calls (`lightToggle`) follow the core\'s own switch example as of core 3.3; Zigbee changed in earlier core versions and moves to a newer SDK in core 4.0. Check the names and the Zigbee mode against the example installed with your core.', 'With the cells at a low voltage the chip can reset in the middle of the join: if the switch works on USB and not on cells, suspect the cells and the regulator, not the program.', 'The hub, not the switch, must be told to bind the switch to a lamp or a group.', 'A coin cell is not suitable: see the pitfall above.']
    }
  ],
  examples: [
    {
      title: 'How many years on two AA cells?',
      q: 'A press costs about 53 mA·s. There are 20 presses a day, the sleep current of the whole device is 27 µA (7 µA for the chip, 20 µA for the board), and two AA cells give 2500 mAh, of which 80 % is usable. How long do they last, ignoring self-discharge?',
      steps: ['Presses: $20 \\times 53 = 1060$ mA·s a day, which is $1060 / 3600 \\approx 0.29$ mAh.', 'Sleep: $0.027 \\text{ mA} \\times 24 \\text{ h} = 0.65$ mAh a day.', 'Total $0.94$ mAh a day. Usable charge $0.8 \\times 2500 = 2000$ mAh, so $2000 / 0.94 \\approx 2130$ days.'],
      a: 'About 5.8 years. Sleep is two thirds of the use: halving the board\'s 20 µA would add more than shortening every press by a quarter second.'
    }
  ],
  quiz: [
    { q: 'Why is a battery light switch an end device and not a router?', choices: ['Routers cannot send On/Off commands', 'A router must stay awake to relay other devices\' messages, which a battery cannot afford', 'End devices have a stronger radio', 'Routers need more pins'], a: 1, why: 'Routers keep their radio listening to forward traffic. A sleepy end device wakes only when it has something to say, and its parent keeps its messages.' },
    { q: 'The switch joined the network, but a press does nothing to the lamp. What is the most likely missing step?', choices: ['A new battery', 'The binding of the switch to the lamp or a group', 'A longer press', 'A second hub'], a: 1, why: 'A switch sends to the targets in its binding table, which the hub sets. Joined and bound are two different steps.' },
    { q: 'Why does the program keep a pairing flag in RTC memory?', choices: ['To save power', 'Forgetting the network restarts the chip, and the flag survives the restart so the next run knows to search for 60 s', 'To count presses', 'Zigbee requires it'], a: 1, why: 'Normal variables are lost at a restart. A variable in the memory deep sleep keeps tells the next run that pairing was asked for.' },
    { q: 'The switch works on the bench but lasts three months on two AA cells instead of years. What do you measure first?', choices: ['The radio\'s transmit power', 'The sleep current of the whole board from the cells', 'The Zigbee channel', 'The button\'s contact bounce'], a: 1, why: 'Sleep is almost all of the time. A regulator or LED that adds 100 µA outweighs everything the radio does.' }
  ],
  applications: [
    'A wall switch for a rented flat where nothing may be wired in.',
    'A bedside switch, a doorway switch or a scene button next to a Zigbee lamp or group.',
    'A big button for someone who finds small switches hard to use.',
    'The pattern for any battery Zigbee sender: a sensor, a doorbell button, a panic button.'
  ],
  sources: [
    'Espressif, ESP32-H2 Series Datasheet: the radio, the current figures and the deep-sleep current; ESP32-H2-DevKitM-1 user guide.',
    'CSA (Connectivity Standards Alliance), Zigbee specification and the Zigbee Cluster Library: the On/Off cluster, binding, end device behaviour.',
    'Arduino core for ESP32 documentation: the Zigbee library and its switch and light examples (core 3.3).'
  ],
  sim: 'wp2-zigbee-switch'
},

/* ================================================================ a LoRa field sensor */
{
  id: 'project-lora-field-sensor',
  parent: 'worked-projects',
  title: 'A LoRa field sensor',
  level: 3,
  short: 'A soil-moisture node at the far end of a field, sending eight bytes every fifteen minutes to a receiver two kilometres away, on a single cell. The numbers that shape it are the packet\'s time on the air, the law\'s limit on that time, and the board\'s sleep current.',
  keywords: ['LoRa', 'field sensor', 'soil moisture', 'SX1276', 'RadioLib', 'air time', 'duty cycle', '868 MHz', 'spreading factor', 'link budget', 'deep sleep', 'battery node', 'LilyGO LoRa32', 'time on air', 'point to point'],
  prereq: ['lora', 'lora-parameters', 'deep-sleep', 'battery-life-budget'],
  related: ['link-budget', 'transmit-power-and-regulations', 'lorawan', 'lora-boards', 'soil-and-water-sensors', 'lithium-cells', 'measuring-battery-level', 'external-antennas', 'project-plant-watering'],
  body: `**The idea:** a sensor in the ground at the edge of a field reports how wet the soil is to a receiver in the farmhouse, with no Wi-Fi, no SIM card and no mains. It wakes, measures, sends one short packet, and sleeps for fifteen minutes.

### What it must do, in numbers

- A packet of **8 bytes**: node number (1), a counter (2), the soil reading (2), the battery in millivolts (2), a flags byte (1).
- A report every **15 minutes** (900 s), for a season or more on one 18650 cell of 3000 mAh.
- A range of **2 km** across open fields to a receiver with a simple antenna.
- Legal: in the main European 868 MHz sub-band a transmitter may be on the air **1 % of the time at most**. Other regions limit power and the time on one channel instead: check your country's rules.
- If the packet would break the limit, the node must refuse to send, not send anyway.

### The chip, and why

The [project advisor](#/tools/advisor) reads LoRa and battery. LoRa is not in any ESP32: it is an extra radio chip on SPI, so the advice is a board that carries one. By the ESP32 side it ranks the **ESP32-C3** first (99), then the C6 (93), the S3 (92) and the ESP32 (88). The catalogue's only C3 board with LoRa is a bare module for your own circuit board, so a first build takes a ready board: the **LilyGO LoRa32 V1.6.1**, an ESP32 with an SX1276 radio, a battery connector with a charger, and its radio pins in the catalogue. The classic ESP32 sleeps at 10 µA, which is fine. For a product, the T3-C6 board or a bare C3 module with an SX1262 is the better choice; the program changes in two lines.

### The parts and the wiring

The radio's pins are fixed on the board (the catalogue: SCK 5, MISO 19, MOSI 27, CS 18, reset 23, DIO0 26, DIO1 33), so no pin planning is needed there. The rest:

| Pin | Goes to | Note |
|---|---|---|
| GPIO34 | capacitive soil probe's output | an ADC1 input; the board does not use it according to the catalogue: check your header |
| GPIO4 | the probe's supply | a pin can feed a probe that draws a few milliamps; it is on only while measuring |
| GPIO35 | the battery, through the board's 100 kΩ and 100 kΩ divider | read it and double |

The antenna must be made for 868 MHz (a quarter wave is 8.6 cm of wire): a node without one can damage its own radio and will not reach far. The board has a charger; a lithium cell for a field also needs a protection circuit ([[lithium-cells]]).

### The behaviour as a state machine

**SLEEPING**: deep sleep, radio asleep, 15 minutes. **MEASURING**: the probe is powered, read and unpowered in half a second; if the reading works and the duty-cycle guard holds, the node goes to **SENDING**; if the guard fails it skips this report and sleeps; if the probe fails it logs the error and sleeps. **SENDING**: it transmits for the packet's air time and sleeps; if the radio does not finish in 5 s it gives up. The machine is a ring and every state ends, so the node cannot stay awake. In the simulation you change the interval, spreading factor, payload and duty limit and watch the guard and the battery react; a label such as *skip · fail* joins two ways back to sleep.

### The program

Deep sleep restarts the program every cycle, so it is a straight line: read the probe and the battery, build the packet, check the guard, send, sleep. The counter lives in the memory deep sleep keeps, so the receiver sees lost packets as gaps. The guard computes the air time with Semtech's formula and refuses if it exceeds the duty limit times the interval. C++ uses the RadioLib library; MicroPython needs a separate add-on LoRa driver from micropython-lib, not part of the firmware, whose option names you should check against the version you install. The receiver is the program of [[lora]].

### The air-time budget

The [LoRa calculator](#/tools/espcalc/lora) gives these figures for any setting. At 125 kHz and coding rate 4/5, eight bytes take **36 ms** at spreading factor 7, **124 ms** at 9 and **991 ms** at 12. At 1 % that allows at most 997, 290 or 36 packets an hour, and a shortest steady interval of 3.6 s, 12.4 s or 99 s; every fifteen minutes at SF9 uses 0.014 %. A longer air time hears weaker signals (about −130 dBm at SF9, −137 dBm at SF12) and costs the cell more. Link budget: at 14 dBm, with 2 dBi antennas at both ends and a path-loss exponent of 2.7 (open but not clear), 2 km loses 120 dB and leaves a margin of **27 dB** at SF9; at 5 km, 16 dB. A hedge, a wet field and a crouching antenna eat that margin quickly ([[link-budget]]).

### The power budget

A cycle is half a second awake at about 45 mA, then 124 ms of transmit at about 130 mA, then sleep. With a board that sleeps at **0.1 mA** the average is 0.14 mA and the 18650 cell lasts about **440 days**. At **1 mA** it is 89 days; at **10 mA** (a board with a USB chip and a display that never turn off) it is 10 days. The catalogue has no sleep-current figure for the LoRa32: measure it from the cell, and be ready to remove the display and the USB bridge's supply. Even at 0.1 mA, sleep is 70 % of the charge: the radio is not the cost. Try your own numbers in [the battery calculator](#/tools/espcalc/battery).

### Test it, and where it breaks first

- Put the receiver on the bench first, then walk away with the node and note where packets stop; compare with the margin you computed.
- Count the counter gaps over a day.
- The first failures are no antenna, a sleep current a hundred times too high, and a probe left powered. Then the soil: a capacitive probe drifts and needs a two-point calibration, dry and wet.
- **Extend it** with a second sensor, acknowledged packets with retries, a LoRaWAN network ([[lorawan]]) or a solar cell ([[solar-power]]).

> [!key] A LoRa node is judged by two small numbers: the packet's time on the air against the law's limit, and the board's sleep current against the cell. Refuse to send what the law forbids, put the antenna on first, and measure the sleep.`,
  ideas: [
    'LoRa is a second radio chip, not part of any ESP32: the advisor ranks the ESP32 side, and you choose a board that carries the radio.',
    'Eight bytes at spreading factor 9 and 125 kHz take about 124 ms on the air; a 1 % duty limit then allows one packet every 12.4 s.',
    'The duty-cycle guard computes the air time and refuses to send if the interval is too short for it.',
    'The board\'s sleep current, not the radio, decides how many months one cell lasts.'
  ],
  pitfalls: [
    'A higher spreading factor is free range — It is range paid for in time on the air: SF12 takes eight times as long as SF9, spends eight times the charge on each packet, and allows eight times fewer packets under a duty limit.',
    'The chip sleeps at 10 µA, so the node does too — The board adds a USB chip, a charger, a display and a regulator. Measure the node, not the chip.',
    'The duty-cycle rule is advice for big networks — It is law in the European 868 MHz bands and the radio may be sold only on that basis. Other regions have other limits: check your own.'
  ],
  terms: [
    { term: 'Time on air', also: ['air time', 'ToA'], def: 'How long a packet occupies the channel. It grows with the payload and, steeply, with the spreading factor, and it is what duty-cycle rules and the battery both count.' },
    { term: 'Duty cycle', also: ['duty-cycle limit', '1 % rule'], def: 'The fraction of time a transmitter may be on the air. A 1 % limit allows 36 s of transmission in an hour, however it is divided into packets.' },
    { term: 'Spreading factor', also: ['SF', 'SF7 to SF12'], def: 'A LoRa setting from 7 to 12. A higher value spreads each bit over more of the channel: weaker signals can be decoded, and every packet takes longer.' },
    { term: 'Link margin', also: ['fade margin'], def: 'How many decibels the received signal is above the receiver\'s sensitivity. A margin of 10 dB or more leaves room for rain, leaves and a crouching antenna.' },
    { term: 'Quiescent current', also: ['sleep current of the board', 'standby current'], def: 'What a whole board draws while the chip is asleep: its regulator, USB chip, LEDs and dividers together. It is usually far above the chip\'s own deep-sleep current.' }
  ],
  formulas: [
    {
      name: 'Shortest interval under a duty-cycle limit',
      expr: 'T = t/d',
      tex: 'T_{\\min} = \\frac{t_{\\mathrm{air}}}{d}',
      vars: {
        T: { name: 'shortest steady interval', q: 'time', unit: 's', tex: 'T_{\\min}' },
        t: { name: 'time on air of one packet', q: 'time', unit: 'ms', value: 124, tex: 't_{\\mathrm{air}}' },
        d: { name: 'duty-cycle limit', value: 0.01, min: 0.0001, max: 1 }
      },
      solveFor: 'T',
      note: 'Valid for a steady stream of equal packets. The limit counts the time on the air of all the node\'s transmissions in the band, not only these.',
      stories: { T: 'A packet is on the air for {t}. The band allows a duty cycle of {d}. How often may it be sent?' }
    }
  ],
  code: [
    {
      title: 'The node: measure, check the limit, send, sleep',
      about: 'Every 15 minutes: power the soil probe, read it and the battery, build an 8-byte packet, check that its air time fits the duty-cycle limit, send it on 868 MHz at spreading factor 9, put the radio to sleep and the chip into deep sleep. The counter survives the sleep.',
      needs: 'A LilyGO LoRa32 V1.6.1 (SX1276, 868 MHz version) with its antenna fitted, a capacitive soil probe, and an 18650 cell. Arduino: the RadioLib library. MicroPython: the add-on `lora` driver from micropython-lib (installed with mip; not part of the firmware). Use your region\'s band and a power the rules allow.',
      wiring: [['GPIO5', 'LoRa SCK', 'fixed on the board'], ['GPIO19', 'LoRa MISO', 'fixed on the board'], ['GPIO27', 'LoRa MOSI', 'fixed on the board'], ['GPIO18', 'LoRa CS', 'fixed on the board'], ['GPIO23', 'LoRa reset', 'GPIO14 on a V1.3'], ['GPIO26', 'LoRa DIO0'], ['GPIO33', 'LoRa DIO1'], ['GPIO34', 'soil probe output', 'ADC1'], ['GPIO4', 'soil probe supply', 'on only while measuring'], ['GPIO35', 'battery divider', 'fixed on the board']],
      libs: ['RadioLib'],
      blocks: `
        when started
          // MEASURING
          set pin (4) as [output v]
          set pin (4) to [HIGH v]
          wait (0.1) seconds
          set [soil v] to (analog read pin (34))
          set pin (4) to [LOW v]
          set [mv v] to ((analog read pin (35) in millivolts) * (2))
          set [counter v] to (load [counter])
          // the duty-cycle guard
          set [air v] to (LoRa air time of (8) bytes at spreading factor (9)) :: radio
          if <(air) ≤ ((0.01) * (900))> then
            // SENDING
            start LoRa radio at (868) MHz bandwidth (125) kHz spreading factor (9) power (14) dBm :: radio
            send LoRa packet (join (node) (counter) (soil) (mv)) :: radio
            put the LoRa radio to sleep :: radio
          end
          change [counter v] by (1)
          save (counter) as [counter]
          // SLEEPING
          deep sleep for (900) seconds
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <RadioLib.h>

        // LilyGO LoRa32 V1.6.1: the radio's pins are fixed on the board
        const int PIN_SCK = 5, PIN_MISO = 19, PIN_MOSI = 27, PIN_CS = 18;
        const int PIN_RST = 23, PIN_DIO0 = 26, PIN_DIO1 = 33;
        const int PIN_SOIL = 34, PIN_PROBE_POWER = 4, PIN_BATTERY = 35;
        const uint8_t NODE_ID = 7;
        const uint32_t SLEEP_S = 900;                 // 15 minutes between packets
        const int SPREADING = 9;                      // 125 kHz, coding rate 4/5
        const float DUTY = 0.01;                      // 1 % in the main 868 MHz band: check your country's rules

        SX1276 radio = new Module(PIN_CS, PIN_DIO0, PIN_RST, PIN_DIO1);
        RTC_DATA_ATTR uint16_t counter = 0;           // survives deep sleep

        float airTimeS(int bytes) {                   // Semtech's formula: explicit header, CRC on, 8-symbol preamble
          float tSym = (1 << SPREADING) / 125000.0;
          int de = tSym > 0.016 ? 1 : 0;
          int n = 8 + (int)fmax(ceil((8.0 * bytes - 4 * SPREADING + 28 + 16) / (4.0 * (SPREADING - 2 * de))) * 5, 0.0);
          return (12.25 + n) * tSym;
        }

        void setup() {
          pinMode(PIN_PROBE_POWER, OUTPUT);
          digitalWrite(PIN_PROBE_POWER, HIGH);        // MEASURING: the probe is on only while it is read
          delay(100);
          uint16_t soil = analogRead(PIN_SOIL);                 // 0..4095
          digitalWrite(PIN_PROBE_POWER, LOW);
          uint16_t mv = analogReadMilliVolts(PIN_BATTERY) * 2;  // the board's 100 k / 100 k divider
          uint8_t flags = mv < 3300 ? 1 : 0;                    // bit 0: battery low
          uint8_t pkt[8] = {NODE_ID, (uint8_t)(counter >> 8), (uint8_t)counter, (uint8_t)(soil >> 8),
                            (uint8_t)soil, (uint8_t)(mv >> 8), (uint8_t)mv, flags};
          counter++;
          if (airTimeS(sizeof pkt) <= DUTY * SLEEP_S) {         // the duty-cycle guard
            SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);
            // MHz, kHz bandwidth, spreading factor, coding rate 4/5, sync word, dBm
            if (radio.begin(868.0, 125.0, SPREADING, 5, 0x12, 14) == RADIOLIB_ERR_NONE) {
              radio.transmit(pkt, sizeof pkt);                  // SENDING: blocks until the packet has left
              radio.sleep();                                    // the radio's own sleep: about 0.2 µA
            }
          }
          esp_sleep_enable_timer_wakeup(SLEEP_S * 1000000ULL);
          esp_deep_sleep_start();                               // SLEEPING: setup() runs again on waking
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, math, time
        from machine import ADC, Pin, RTC, SPI
        from lora import SX1276                       # add-on driver: not in the firmware

        # LilyGO LoRa32 V1.6.1: the radio's pins are fixed on the board
        PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS = 5, 19, 27, 18
        PIN_RST, PIN_DIO0, PIN_DIO1 = 23, 26, 33
        PIN_SOIL, PIN_PROBE_POWER, PIN_BATTERY = 34, 4, 35
        NODE_ID = 7
        SLEEP_S = 900                                 # 15 minutes between packets
        SPREADING = 9                                 # 125 kHz, coding rate 4/5
        DUTY = 0.01                                   # 1 % in the main 868 MHz band: check your country's rules

        def air_time_s(n):                            # Semtech's formula: explicit header, CRC on, 8-symbol preamble
            t_sym = (1 << SPREADING) / 125000
            de = 1 if t_sym > 0.016 else 0
            n_pay = 8 + max(math.ceil((8 * n - 4 * SPREADING + 28 + 16) / (4 * (SPREADING - 2 * de))) * 5, 0)
            return (12.25 + n_pay) * t_sym

        rtc = RTC()
        counter = int.from_bytes(rtc.memory()[:2] or b"\0\0", "little")   # survives deep sleep

        probe = Pin(PIN_PROBE_POWER, Pin.OUT, value=1)    # MEASURING: the probe is on only while it is read
        time.sleep_ms(100)
        soil = ADC(Pin(PIN_SOIL), atten=ADC.ATTN_11DB).read_u16() >> 4          # 0..4095
        probe.value(0)
        mv = ADC(Pin(PIN_BATTERY), atten=ADC.ATTN_11DB).read_uv() // 500        # microvolts at the pin, doubled, in mV
        flags = 1 if mv < 3300 else 0                                           # bit 0: battery low
        pkt = bytes([NODE_ID, counter >> 8, counter & 255, soil >> 8, soil & 255, mv >> 8, mv & 255, flags])
        counter += 1
        rtc.memory(counter.to_bytes(2, "little"))

        if air_time_s(len(pkt)) <= DUTY * SLEEP_S:    # the duty-cycle guard
            spi = SPI(1, baudrate=2_000_000, sck=Pin(PIN_SCK), mosi=Pin(PIN_MOSI), miso=Pin(PIN_MISO))
            modem = SX1276(spi=spi, cs=Pin(PIN_CS), dio0=Pin(PIN_DIO0), dio1=Pin(PIN_DIO1), reset=Pin(PIN_RST),
                           lora_cfg={'freq_khz': 868000, 'sf': SPREADING, 'bw': '125', 'coding_rate': 5,
                                     'preamble_len': 8, 'output_power': 14})
            modem.send(pkt)                           # SENDING: blocks until the packet has left
            modem.sleep()                             # the radio's own sleep
        machine.deepsleep(SLEEP_S * 1000)             # SLEEPING: main.py runs again on waking
      `,
      output: `
        (the node prints nothing: on the receiver, the packet 07 0001 0A3C 0F3A 00
         means node 7, packet 1, soil 2620, battery 3898 mV, battery fine)
      `,
      notes: ['A sketch or program that sleeps at once is hard to upload to or stop: add a way out, such as a pin that, held at start-up, skips the sleep.', 'The soil reading is a raw count. A capacitive probe needs a calibration in air and in water, and then a map to a percentage on the receiver.', 'The MicroPython driver is a separate add-on: its option names (and the sleep call) follow micropython-lib and must be checked against the version you install.', 'Use your region\'s band, antenna and a power the rules allow: 868 MHz suits Europe, 915 MHz the Americas, and the board must be the version for that band.']
    }
  ],
  examples: [
    {
      title: 'Can the node report every 20 seconds at spreading factor 12?',
      q: 'A packet at SF12, 125 kHz, with an 8-byte payload takes 0.99 s on the air. The band allows 1 %. May the node send every 20 s? What is the shortest steady interval?',
      steps: ['The shortest interval is $T_{\\min} = t_{\\mathrm{air}}/d = 0.99 / 0.01 = 99$ s.', 'Every 20 s the duty cycle would be $0.99/20 = 4.95$ %, five times the limit.', 'Either lengthen the interval to 99 s or more, or send faster at a lower spreading factor: at SF7 the air time is 36 ms and 3.6 s is enough.'],
      a: 'No. The shortest steady interval at SF12 is 99 s; the guard in the program refuses to send at 20 s.'
    }
  ],
  quiz: [
    { q: 'The node sends 8 bytes at SF9, taking 124 ms, every 900 s. What duty cycle is that?', choices: ['About 0.014 %', 'About 0.14 %', 'About 1.4 %', 'About 14 %'], a: 0, why: '$0.124 / 900 \\approx 0.000138$, which is 0.0138 %: about seventy times inside a 1 % limit.' },
    { q: 'Raising the spreading factor from 9 to 12 for more range does what to the battery?', choices: ['Nothing', 'Each packet takes about eight times as long, so the transmit charge per packet rises about eightfold', 'It halves the charge', 'It only changes the radio\'s sensitivity'], a: 1, why: 'Air time roughly doubles with each step of the spreading factor. The weaker signal that can be decoded is paid for with a much longer transmission.' },
    { q: 'A node on the bench sleeps at 10 µA by the chip\'s datasheet, but the cell lasts only ten days. What is the likely cause?', choices: ['The radio transmits too often', 'The board\'s own parts draw milliamps while the chip sleeps', 'The soil probe', 'The antenna'], a: 1, why: 'A development board has a USB chip, a charger, LEDs and a regulator. At 10 mA of sleep current, a 3000 mAh cell lasts about 10 days whatever the chip does.' },
    { q: 'The guard refuses to send when the packet is too long for the interval. Who benefits?', choices: ['Only the receiver', 'The law is kept, other users of the band are not crowded out, and the cell is not wasted', 'Nobody: it is a mistake', 'Only the manufacturer'], a: 1, why: 'A duty limit exists so that many devices can share a band. A node that refuses, rather than sends and hopes, keeps to it by construction.' }
  ],
  applications: [
    'Soil-moisture and temperature nodes across a farm, reporting to a gateway in the barn.',
    'A water-tank level sensor at a pump house 3 km away.',
    'A beehive scale or a gate sensor in a place with no mains and no mobile coverage.',
    'A private link between a house and an outbuilding, in place of a cable.'
  ],
  sources: [
    'Semtech, SX1276 datasheet and application note AN1200.13, LoRa Modem Designer\'s Guide: the time-on-air formula and the sensitivities.',
    'ETSI EN 300 220, short-range devices below 1 GHz (the duty-cycle and power limits in Europe), and your national regulator\'s rules for the band you use.',
    'RadioLib documentation: the SX1276 class, transmit and sleep; MicroPython micropython-lib, the lora package.'
  ],
  sim: 'wp2-lora-sensor'
},

/* ================================================================ a voice-controlled lamp */
{
  id: 'project-voice-lamp',
  parent: 'worked-projects',
  title: 'A voice-controlled lamp',
  level: 3,
  short: 'A lamp that obeys "wake word, then on, off, brighter, dimmer". The recogniser is Espressif\'s ESP-SR; this page builds everything around it: the microphone, the listening window, the mute switch and the lamp that must not be a hazard.',
  keywords: ['voice lamp', 'wake word', 'ESP-SR', 'WakeNet', 'MultiNet', 'speech commands', 'ESP32-S3', 'I2S microphone', 'INMP441', 'MOSFET dimmer', 'mute switch', 'privacy', 'offline voice control', 'listening window', 'smart lamp'],
  prereq: ['wake-words-and-speech-commands', 'i2s-microphones', 'driving-leds-with-pwm', 'timeouts-and-timed-states'],
  related: ['voice-assistants', 'digital-audio-basics', 'keyword-spotting', 'cameras-and-the-law', 'powering-led-strips', 'mosfets-for-loads', 'switching-mains-safely', 'esp32-s3-box', 'privacy-and-data-protection', 'tflite-micro-and-esp-dl'],
  body: `**The idea:** say the wake word and then "on", "off", "brighter" or "dimmer", and a lamp does it, with no cloud and no phone. The wake-word engine listens all the time; after it fires, the lamp listens for one command for a few seconds, acts, and goes back to listening for the wake word only.

> [!warn] A microphone records people. Here all sound stays inside the chip: the wake word and four commands are recognised locally, and no audio is stored or sent. Even so, tell the people in the room that it listens, fit a hardware mute switch that really cuts the microphone's power, show with a light when it listens for a command, and check your local law before you ever record or transmit sound. The lamp is a low-voltage LED lamp. Never build a mains dimmer on a breadboard: to control a mains lamp use a ready-made, approved smart plug or relay, installed by a qualified person.

### What it must do, in numbers

- **Four commands** after the wake word: on, off, brighter, dimmer. A small set is recognised far better than a large one.
- A **6 s** window after the wake word in which one command is accepted; then it goes back to sleep.
- The lamp changes with a **0.5 s** fade, in steps of 20 %, remembering its last brightness for "on".
- The mute switch cuts the microphone at once, whatever the software is doing.
- A 12 V LED lamp of up to 1 A (12 W), dimmed with PWM at 5 kHz.

### The chip, and why

The [project advisor](#/tools/advisor), given "a voice controlled lamp with a microphone and wake word", reads a microphone and on-device AI. It ranks the **ESP32-S3** first (95): I2S microphones and the speed for wake-word and command recognition. The ESP32-P4 follows (94) with a much higher current and a multi-supply design; the S31 (82) has only preview software; the plain ESP32 (59) and the C3 (47) are far behind. The recogniser is **ESP-SR**, Espressif's speech-recognition framework: an audio front end, a wake-word engine (WakeNet) and an offline command recogniser (MultiNet), with models in a flash partition. It is an ESP-IDF component and the Arduino core carries a library for it; the ready wake words change, so read the current documentation. The advisor also lists the **ESP32-S3-BOX-3**, a finished board with microphones, a speaker and Espressif's voice demonstrations: the sensible first try. This page wires a plain **ESP32-S3-DevKitC-1** so that every part is visible.

### The parts and the wiring

An I2S microphone board of the INMP441 kind (a digital MEMS microphone: no analogue noise on a wire), a logic-level N-channel MOSFET with a gate resistor and a pull-down for the lamp, a slide switch for mute, an LED. [The pin planner](#/tools/pinout/plan) proposed GPIO21, 38 and 17 for the microphone and GPIO18 for the lamp, but the catalogue's notes advise against some of them: GPIO38 is the RGB LED of the v1.1 board, GPIO47 and GPIO48 run at 1.8 V on some modules, GPIO18 has a power-up glitch. The build uses:

| Pin | Goes to | Note |
|---|---|---|
| GPIO5, GPIO4, GPIO6 | microphone bit clock, word select, data | plain ADC1 pins; I2S can use any |
| GPIO21 | MOSFET gate, 100 Ω in series, 100 kΩ to ground | no restrictions; the pull-down keeps the lamp off at reset |
| GPIO7 | mute switch's second contact to ground | the first contact cuts the microphone's 3.3 V |
| GPIO17 | "listening" LED through 330 Ω | |

The board is fed 5 V from a buck converter on the lamp's 12 V adapter; the strip is fused.

### The behaviour as a state machine

**IDLE**: the engine listens, the LED is off. **LISTENING**: the wake word was heard; the LED is on for 6 s; the first valid command goes to ACTING, an unknown word restarts the window, silence for 6 s returns to IDLE. **ACTING**: the lamp fades for 0.5 s, then IDLE. **MUTED**: the switch is off, the microphone has no power and nothing is heard until it is back. A television that says something like the wake word opens a window: that is why the window is short, the commands are harmless, and a mains load would not be. Say the words in the simulation, and press the TV button.

### The program

The recogniser reports two things: *the wake word was heard* and *command n was heard*. This program is everything around it. Here the words arrive as lines typed on the serial port ("wake", "on", "off", "up", "down"), which is also how you test the lamp before the recogniser is attached; in the final build the ESP-SR callbacks call the same two functions. The recogniser is an ESP-IDF component that MicroPython cannot run, so the MicroPython version is the part around it, with the same typed words. A second small program checks the microphone with a level bar.

### The power budget

It is mains powered, and it must be: the recogniser needs the processor awake, so the chip cannot sleep and listen. If the board and microphone draw about 80 mA at 5 V (an estimate to be measured), that is 0.4 W, about 3.5 kWh a year. The lamp is another matter: 1 A at 12 V is 12 W at full brightness. The catalogue gives 91 mA for the S3 with the radio listening; here Wi-Fi is off.

### Test it, and where it breaks first

- Type the words first, with no microphone fitted; then run the microphone check (clap, speak, whisper) and watch the bar.
- The first failures are a microphone left powered by a mute switch that does not cut it, a lamp that flickers at low brightness (raise the PWM bits or frequency) and a wake word that fires on the television.
- **Extend it** with a fifth command, a light sensor so that "on" chooses the brightness, or a Zigbee or Matter plug for a mains lamp.

> [!key] The recogniser is a component; the design is what surrounds it: a short listening window, a small command set, a hardware mute, and a lamp that cannot hurt anyone when the machine mishears. Keep the sound inside the chip, and say that it listens.`,
  ideas: [
    'The ESP32-S3 ranks first for a wake-word device; the ESP-SR recogniser is an ESP-IDF component, so the program around it is what the Arduino and MicroPython versions show.',
    'The wake word opens a short window, and the window accepts one of four commands: a small set, a short time, harmless actions.',
    'A hardware mute that cuts the microphone\'s power is a promise the software cannot break.',
    'The chip must stay awake to listen, so this is a mains device; a mains lamp is switched only through a ready-made approved plug or relay.'
  ],
  pitfalls: [
    'A voice device is safe if it only reacts to my voice — Recognisers also fire on similar sounds: a television, a neighbour, a song. Keep the actions harmless, the window short and the command set small.',
    'A software mute is enough — A bug, a crash or a malicious update can switch software back on. A mute that cuts the microphone\'s supply is the only one that cannot be wrong.',
    'Wake-word recognition needs the cloud — ESP-SR runs on the chip. The audio stays in the device, which is the point: say it on the box.'
  ],
  terms: [
    { term: 'Wake word', also: ['trigger word', 'hot word', 'WakeNet'], def: 'A short spoken phrase that a device listens for all the time and that opens a window for a command. The engine runs on the chip and keeps no recording.' },
    { term: 'ESP-SR', also: ['MultiNet', 'audio front end', 'AFE'], def: 'Espressif\'s speech-recognition framework: an audio front end that cleans up the sound, a wake-word engine (WakeNet) and an offline command recogniser (MultiNet), with models stored in flash.' },
    { term: 'I2S MEMS microphone', also: ['INMP441', 'digital microphone'], def: 'A microphone chip that sends its samples as a digital I2S stream: three wires and a clock, no analogue signal to pick up noise on the way.' },
    { term: 'Listening window', also: ['command window'], def: 'The few seconds after the wake word during which one command is accepted. When it runs out the device goes back to listening for the wake word only.' },
    { term: 'False accept', also: ['false wake', 'false trigger'], def: 'The recogniser fires on a sound that is not the wake word, for instance a television. Its rate is measured in events per hour of audio, and decides what a device may safely do on a wake.' }
  ],
  code: [
    {
      title: 'The lamp around the recogniser',
      about: 'Four states (IDLE, LISTENING, ACTING, MUTED). A wake word opens a 6 s window; one of "on", "off", "up", "down" fades the lamp for 0.5 s in 20 % steps; a switch mutes everything. The words are typed on the serial port, as the recogniser would report them.',
      needs: 'An ESP32-S3-DevKitC-1, a 12 V LED lamp or strip (1 A at most, fused) with a logic-level N-channel MOSFET, 100 Ω and 100 kΩ resistors, a slide switch, an LED with 330 Ω, a 12 V adapter and a 5 V buck converter. In the final build the ESP-SR callbacks replace the typed words.',
      wiring: [['GPIO21', '100 Ω → MOSFET gate, 100 kΩ gate to GND', 'lamp PWM'], ['GPIO7', 'mute switch (second contact) → GND', 'internal pull-up'], ['GPIO17', '330 Ω → LED → GND', 'listening'], ['12 V adapter', 'lamp through the MOSFET; buck converter to the board', 'fused']],
      blocks: `
        when started
          set PWM on pin (21) frequency (5000) resolution (10)
          set pin (17) as [output v]
          set pin (7) as [input with pull-up v]
          start serial at (115200) baud
          set [target v] to (0)
          go to state [IDLE v]

        when pin (7) goes [low v]
          if <<state = [IDLE v]> or <state = [LISTENING v]>> then
            go to state [MUTED v]
          end

        when pin (7) goes [high v]
          if <state = [MUTED v]> then
            go to state [IDLE v]
          end

        when wake word heard :: ai
          if <state = [IDLE v]> then
            go to state [LISTENING v]
          end

        when command heard :: ai
          if <state = [LISTENING v]> then
            if <(command) = [off]> then
              set [target v] to (0)
            else if <(command) = [on]> then
              set [target v] to (last)
            else if <(command) = [up]> then
              set [target v] to (min (100) ((target) + (20)))
            else if <(command) = [down]> then
              set [target v] to (max (0) ((target) - (20)))
            end
            go to state [ACTING v]
          end

        when entering state [LISTENING v]
          set pin (17) to [HIGH v]

        when entering state [ACTING v]
          set pin (17) to [LOW v]
          fade the lamp to (target) percent :: light

        when (6) seconds in state [LISTENING v]
          set pin (17) to [LOW v]
          go to state [IDLE v]

        when (0.5) seconds in state [ACTING v]
          go to state [IDLE v]
      `,
      cpp: String.raw`
        const int PIN_LAMP = 21;                      // MOSFET gate, 100 kΩ pull-down: off at reset
        const int PIN_LED = 17;                       // "listening" LED
        const int PIN_MUTE = 7;                       // second contact of the mute switch: LOW = muted
        const int PWM_FREQ = 5000, PWM_BITS = 10;     // fine on every ESP32 (14 bits or fewer)
        const uint32_t LISTEN_MS = 6000, ACT_MS = 500;
        const int STEP = 20;                          // percent for "up" and "down"

        enum State { IDLE, LISTENING, ACTING, MUTED };
        State state = IDLE;
        uint32_t enteredAt = 0;
        int target = 0, shown = 0, lastOn = 60;       // lamp level in percent: wanted, shown, remembered for "on"

        void setLamp(int percent) {                   // brightness is not linear: gamma 2.2
          ledcWrite(PIN_LAMP, (uint32_t)(pow(percent / 100.0, 2.2) * 1023));
        }

        void go(State s) {
          state = s;
          enteredAt = millis();
          digitalWrite(PIN_LED, s == LISTENING);      // the LED says: now listening for a command
        }

        void wakeHeard() { if (state == IDLE) go(LISTENING); }     // the recogniser: the wake word

        void commandHeard(const String &w) {          // the recogniser: a command
          if (state != LISTENING) return;
          if (w == "off") { if (target > 0) lastOn = target; target = 0; }
          else if (w == "on") target = lastOn;
          else if (w == "up") target = min(100, target + STEP);
          else if (w == "down") target = max(0, target - STEP);
          else { go(LISTENING); return; }             // not understood: the window starts again
          if (target > 0) lastOn = target;
          go(ACTING);
        }

        void setup() {
          Serial.begin(115200);
          Serial.setTimeout(50);
          pinMode(PIN_LED, OUTPUT);
          pinMode(PIN_MUTE, INPUT_PULLUP);
          ledcAttach(PIN_LAMP, PWM_FREQ, PWM_BITS);
          setLamp(0);
        }

        void loop() {
          bool muted = digitalRead(PIN_MUTE) == LOW;
          if (muted && (state == IDLE || state == LISTENING)) go(MUTED);
          else if (!muted && state == MUTED) go(IDLE);

          if (Serial.available() && state != MUTED) {            // typed words stand in for the recogniser
            String word = Serial.readStringUntil('\n');
            word.trim();
            if (word == "wake") wakeHeard(); else commandHeard(word);
          }
          if (state == LISTENING && millis() - enteredAt > LISTEN_MS) go(IDLE);
          if (state == ACTING && millis() - enteredAt > ACT_MS) go(IDLE);

          static uint32_t lastStep = 0;                          // the fade: one percent every 5 ms
          if (shown != target && millis() - lastStep >= 5) {
            lastStep = millis();
            shown += (target > shown) ? 1 : -1;
            setLamp(shown);
          }
        }
      `,
      py: String.raw`
        import select, sys, time
        from machine import Pin, PWM

        PIN_LAMP = 21                                 # MOSFET gate, 100 kΩ pull-down: off at reset
        PIN_LED = 17                                  # "listening" LED
        PIN_MUTE = 7                                  # second contact of the mute switch: LOW = muted
        PWM_FREQ = 5000
        LISTEN_MS, ACT_MS = 6000, 500
        STEP = 20                                     # percent for "up" and "down"

        IDLE, LISTENING, ACTING, MUTED = range(4)
        lamp = PWM(Pin(PIN_LAMP), freq=PWM_FREQ, duty_u16=0)
        led = Pin(PIN_LED, Pin.OUT)
        mute = Pin(PIN_MUTE, Pin.IN, Pin.PULL_UP)
        keys = select.poll()
        keys.register(sys.stdin, select.POLLIN)       # typed words stand in for the recogniser
        state, entered = IDLE, time.ticks_ms()
        target = shown = 0                            # lamp level in percent: wanted, shown
        last_on = 60                                  # remembered for "on"

        def set_lamp(percent):                        # brightness is not linear: gamma 2.2
            lamp.duty_u16(int((percent / 100) ** 2.2 * 65535))

        def go(s):
            global state, entered
            state, entered = s, time.ticks_ms()
            led.value(s == LISTENING)                 # the LED says: now listening for a command

        def wake_heard():                             # the recogniser: the wake word
            if state == IDLE:
                go(LISTENING)

        def command_heard(w):                         # the recogniser: a command
            global target, last_on
            if state != LISTENING:
                return
            if w == "off":
                if target > 0:
                    last_on = target
                target = 0
            elif w == "on":
                target = last_on
            elif w == "up":
                target = min(100, target + STEP)
            elif w == "down":
                target = max(0, target - STEP)
            else:
                go(LISTENING)                         # not understood: the window starts again
                return
            if target > 0:
                last_on = target
            go(ACTING)

        last_step = time.ticks_ms()
        while True:
            muted = mute.value() == 0
            if muted and state in (IDLE, LISTENING):
                go(MUTED)
            elif not muted and state == MUTED:
                go(IDLE)

            if keys.poll(0) and state != MUTED:
                word = sys.stdin.readline().strip()
                if word == "wake":
                    wake_heard()
                else:
                    command_heard(word)
            held = time.ticks_diff(time.ticks_ms(), entered)
            if state == LISTENING and held > LISTEN_MS:
                go(IDLE)
            elif state == ACTING and held > ACT_MS:
                go(IDLE)

            if shown != target and time.ticks_diff(time.ticks_ms(), last_step) >= 5:   # the fade: 1 % every 5 ms
                last_step = time.ticks_ms()
                shown += 1 if target > shown else -1
                set_lamp(shown)
            time.sleep_ms(2)
      `,
      output: `
        wake
        (the LED lights: listening)
        on
        (the lamp fades up to its last level, the LED goes out)
      `,
      notes: ['The 6 s window and the four words are the safety of the design: a false wake can only change the lamp\'s brightness.', 'Replace the serial reader with the callbacks of the ESP-SR example in your ESP-IDF or Arduino core version: it reports the wake word and a command number, which become `wakeHeard()` and `commandHeard()`.', 'If the lamp flickers at low brightness, raise the PWM frequency or resolution (the S3 timer is 14 bits wide, so 10 to 13 bits at 5 kHz is fine).', 'The listening LED does not replace the mute switch, and the mute switch does not replace telling the people in the room.']
    },
    {
      title: 'Is the microphone alive? A level meter',
      about: 'Reads the I2S microphone and prints its level in decibels below full scale, with a bar. Clap, speak, whisper: the bar should follow. This is the first test of the wiring before any recogniser is added.',
      needs: 'An ESP32-S3-DevKitC-1 and an INMP441-type I2S microphone board with its L/R pin to ground (left channel).',
      wiring: [['GPIO5', 'microphone SCK (bit clock)'], ['GPIO4', 'microphone WS (word select)'], ['GPIO6', 'microphone SD (data)'], ['3V3 and GND', 'microphone supply', 'through the mute switch in the final build']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2S microphone on BCLK (5) WS (4) DATA (6) at (16000) Hz :: sound

        forever
          set [level v] to (microphone level in dBFS over (512) samples) :: sound
          print (join (level) [ dBFS])
        end
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        const int PIN_BCLK = 5, PIN_WS = 4, PIN_DIN = 6;
        I2SClass i2s;

        void setup() {
          Serial.begin(115200);
          i2s.setPins(PIN_BCLK, PIN_WS, -1, PIN_DIN);            // (bclk, ws, dout, din): call before begin
          if (!i2s.begin(I2S_MODE_STD, 16000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO)) {
            Serial.println("I2S failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          int16_t buf[512];                                      // 512 samples = 32 ms at 16 kHz
          size_t n = i2s.readBytes((char *)buf, sizeof(buf)) / 2;
          if (n == 0) return;
          double sum = 0;
          for (size_t i = 0; i < n; i++) sum += (double)buf[i] * buf[i];
          double db = 20 * log10(sqrt(sum / n) / 32768.0 + 1e-9);
          Serial.printf("%6.1f dBFS ", db);
          for (int i = 0; i < (db + 90) / 3; i++) Serial.print('#');
          Serial.println();
        }
      `,
      py: String.raw`
        import array, math
        from machine import I2S, Pin

        PIN_BCLK, PIN_WS, PIN_DIN = 5, 4, 6
        mic = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_WS), sd=Pin(PIN_DIN),
                  mode=I2S.RX, bits=16, format=I2S.MONO, rate=16000, ibuf=20000)
        buf = bytearray(1024)                                    # 512 samples = 32 ms at 16 kHz

        while True:
            n = mic.readinto(buf) // 2
            if n == 0:
                continue
            total = 0
            for v in array.array("h", buf[:n * 2]):
                total += v * v
            db = 20 * math.log10(math.sqrt(total / n) / 32768 + 1e-9)
            print("%6.1f dBFS %s" % (db, "#" * max(0, int((db + 90) / 3))))
      `,
      output: `
        -62.4 dBFS #########
        -61.8 dBFS #########
        -31.0 dBFS ###################
        -28.5 dBFS ####################
      `,
      notes: ['A silent room reads about -60 to -70 dBFS; speech a metre away reads about -35 to -25; a clap goes much higher. A reading stuck at the floor (-180) means no data: check the wiring and the L/R pin.', 'The microphone sends 24-bit samples; the 16-bit setting keeps the top 16 bits, which is plenty for a level meter and for recognition.', 'The core\'s I2S class is used with your own instance; there is no global object ([[i2s-microphones]]).']
    }
  ],
  examples: [
    {
      title: 'How often will the television open the window?',
      q: 'The recogniser makes one false accept in about ten hours of television. The set is on for four hours a day. How many false wakes a day, and how long is the lamp listening in vain?',
      steps: ['False wakes: $4 \\text{ h} \\times 1/10 \\text{ per hour} = 0.4$ a day: about one every two and a half days.', 'Each opens a window of 6 s, so about 2.4 s of "listening in vain" a day on average.', 'During those windows a command must also be heard: the television would have to say "on" or "off" too, so changes of the lamp from it are far rarer than wakes.'],
      a: 'About 0.4 false wakes a day. The short window and the small, harmless command set are what make that rate acceptable; measure the real rate in your room.'
    }
  ],
  quiz: [
    { q: 'Why can this lamp not run from a battery for months, as the Zigbee switch can?', choices: ['The recogniser needs the processor awake all the time, so the chip cannot sleep and listen', 'LED lamps cannot run on batteries', 'The microphone needs 12 V', 'Zigbee is faster'], a: 0, why: 'Deep sleep stops the processor, and the recogniser is software running on it. Listening for a wake word means being awake, which costs tens of milliamps all day.' },
    { q: 'The mute switch cuts the microphone\'s supply. Why is that better than a software mute?', choices: ['It is cheaper', 'It cannot be undone by a bug, a crash or an update', 'It saves a pin', 'It makes the lamp brighter'], a: 1, why: 'A software mute is a promise the program keeps only while it runs correctly. With no supply the microphone cannot hear, whatever the software does.' },
    { q: 'A television says a word close to the wake word and opens a window. What limits the harm?', choices: ['Nothing', 'The window is short, the command set is small and every action is harmless', 'The lamp is low-voltage', 'The LED is lit'], a: 1, why: 'A recogniser will sometimes be wrong. Designing for that means only harmless actions behind a wake word: here at worst a change of brightness.' },
    { q: 'The lamp is a 230 V ceiling light. What is the right way to control it by voice?', choices: ['A relay on a breadboard behind the wall switch', 'A ready-made, approved smart plug or relay with its own protocol, installed by a qualified person', 'A MOSFET on the same GPIO', 'Cut the mains lead and splice it to the board'], a: 1, why: 'Mains wiring is work for a qualified person, behind isolation and in an enclosure, following the local code. Use an approved product and let the ESP32 talk to it over its radio.' }
  ],
  applications: [
    'A bedside lamp that obeys four words without a phone or an account.',
    'A hands-free light for a workbench, a kitchen counter or a darkroom.',
    'A test bench for wake-word models, with the lamp as the visible result.',
    'The pattern for any voice-driven device with a small vocabulary: a window, a mute and a harmless action.'
  ],
  sources: [
    'Espressif, ESP-SR documentation: the audio front end, WakeNet and MultiNet, and the list of supported chips.',
    'InvenSense (TDK), INMP441 datasheet: the I2S interface, the 24-bit data format and the L/R pin; Philips, I2S bus specification.',
    'Espressif, ESP32-S3-DevKitC-1 and ESP32-S3-BOX-3 user guides.'
  ],
  sim: 'wp2-voice-lamp'
}

);
