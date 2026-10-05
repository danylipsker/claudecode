/* HYPER-ESP32 · content/toolchains-and-setup.js
 *
 * Topic "Tools and first steps" (branch Programming). The first program, blink, is in content/reference.js.
 * Versions are those of October 2026 (API-CRIB.md section 1): Arduino core 3.3 on ESP-IDF 5.5, ESP-IDF 6.1,
 * MicroPython 1.29, CircuitPython 10.3, esptool 5.
 */
Hyper.add(
/* ================================================================ choosing */
{
  id: 'choosing-a-framework',
  parent: 'toolchains-and-setup',
  title: 'Arduino, ESP-IDF, MicroPython, blocks: choosing',
  level: 1,
  short: 'One chip, several ways to program it. Arduino C++ has the most libraries, ESP-IDF reaches every feature, MicroPython answers at a prompt, ESPHome needs no code, blocks teach. Choose by library, speed, chip and what you must maintain.',
  keywords: ['Arduino', 'ESP-IDF', 'MicroPython', 'CircuitPython', 'ESPHome', 'framework', 'SDK', 'which language', 'C++ or Python', 'blocks', 'which to learn', 'Rust', 'Zephyr'],
  prereq: ['chip-module-board', 'the-open-ecosystem'],
  related: ['arduino-ide-and-the-esp32-core', 'esp-idf-basics', 'micropython-setup', 'circuitpython-on-esp', 'block-programming-tools', 'esphome', 'translating-between-languages', 'platformio'],
  body: `The same chip can run very different software. An ESP32-S3 that blinks an LED under Arduino, under MicroPython or under ESP-IDF does the same thing at the pin; what differs is everything around it: the language, the tools, the libraries you can lean on, how fast an idea becomes a running program, and how much of the chip you can reach. Choose early, because libraries and habits do not carry over — though the *ideas* do ([[translating-between-languages]]).

### The options

| | You write | Good at | The cost |
|---|---|---|---|
| **Arduino core for ESP32** | C++ with \`setup()\` and \`loop()\` | The most libraries, examples and answers; quick to start | Hides the operating system; new chip features arrive a little later |
| **ESP-IDF** | C or C++ with \`app_main()\` | Every feature of every chip; security, updates, production | A build system and a configuration menu to learn |
| **MicroPython** | Python, run on the chip | Type a line and see it run; no compile step | Slower; the interpreter uses RAM; fewer libraries |
| **CircuitPython** | Python, files on a USB drive | Save and run; Adafruit's library bundle; best on the S2 and S3 | Fewer chip features; stable on few chips |
| **ESPHome** | YAML, no code | Home Assistant devices in minutes | You get the components that exist |
| **Blocks** | Dragged blocks | Learning and quick demos | Big programs sprawl |

### What sits on what

ESP-IDF is the foundation: Espressif's own framework, with the FreeRTOS operating system, the drivers and the Wi-Fi and Bluetooth stacks. The Arduino core, MicroPython, CircuitPython and ESPHome are all built on it. So the choice is not a wall: a sketch can call ESP-IDF functions directly, and MicroPython's firmware is an ESP-IDF program that happens to contain an interpreter.

### Four questions that decide it

1. **Is there a library for the part?** For a display, a sensor or a protocol, a ready library usually settles the matter. Look first.
2. **Does speed or memory matter?** Interpreted Python is many times slower than compiled C++ in tight loops, and the interpreter keeps RAM for itself. A program that mostly waits for sensors and networks hardly notices.
3. **Which chip?** At the time of writing, official MicroPython firmware exists for the ESP32, S2, S3, C2, C3, C5, C6, H2 and P4; CircuitPython is stable only on the S2 and S3.
4. **Is it a product?** Secure boot, signed updates and a long support life point to ESP-IDF; a classroom or a one-off points to whatever is quickest.

Versions move. As of October 2026 the Arduino core is 3.3 (on ESP-IDF 5.5), ESP-IDF 6.1, MicroPython 1.29 and CircuitPython 10.3. Check the current ones, and the version a tutorial was written for, before copying it.

> [!key] ESP-IDF is the base and the others are built on it, so the choice is about libraries, speed, chip support and who maintains the result — not a one-way door. The concepts carry over between languages; the libraries and habits do not.`,
  ideas: [
    'ESP-IDF is the foundation; the Arduino core, MicroPython, CircuitPython and ESPHome are built on it.',
    'Arduino has the most libraries and answers, ESP-IDF reaches every feature, MicroPython gives a prompt, blocks teach.',
    'Chip support differs: official MicroPython and CircuitPython builds cover only some chips, and CircuitPython is stable only on the S2 and S3.',
    'Ideas carry over between languages; libraries, tutorials and habits do not.'
  ],
  pitfalls: [
    'Python is too slow for anything real — Most of a typical program is waiting for a sensor, a button or the network, and the drivers inside MicroPython are compiled C. It is tight arithmetic loops, audio and bit-banged protocols that suffer.',
    'Arduino and ESP-IDF are rivals, and choosing one shuts out the other — The Arduino core is built on ESP-IDF. A sketch may call ESP-IDF functions, and a project may use Arduino as one component of an ESP-IDF project.',
    'A tutorial that worked for someone else will work for me — Versions matter. Core 3.x renamed the PWM, timer and ESP-NOW functions of 2.x, and MicroPython changed its Wi-Fi constants; check the version the tutorial was written for.'
  ],
  terms: [
    { term: 'Framework', also: ['SDK', 'software development kit'], def: 'The ready-made software a program stands on: drivers, an operating system, network stacks and the build tools. ESP-IDF, the Arduino core and MicroPython are three frameworks for the same chips.' },
    { term: 'ESP-IDF', also: ['IDF', 'Espressif IoT Development Framework'], def: 'Espressif\'s own C framework for its chips. It holds FreeRTOS, the drivers and the Wi-Fi and Bluetooth stacks, and the other frameworks are built on it.' },
    { term: 'Arduino core', also: ['arduino-esp32', 'the ESP32 core'], def: 'The package that teaches the Arduino environment about ESP chips: board definitions, compilers, and the familiar functions such as pinMode, Serial and WiFi. It sits on top of ESP-IDF.' },
    { term: 'MicroPython', also: ['MPY'], def: 'A small implementation of Python 3 that runs on the microcontroller itself. You type lines at a prompt or copy a file to the chip; there is no compile and upload cycle.' },
    { term: 'Interpreter', also: ['REPL', 'virtual machine'], def: 'A program on the chip that reads your program as text or bytecode and carries it out step by step, instead of the chip running machine code translated in advance.' },
    { term: 'Toolchain', also: ['compiler suite'], def: 'The compiler, linker and helper programs that turn source code into a binary for one processor family. Xtensa chips and RISC-V chips need different ones.' }
  ],
  choose: {
    good: ['Arduino C++ when you want libraries, examples and a quick start', 'MicroPython when you want to type a line and see it run', 'ESP-IDF when the device is a product that needs every feature, updates and security', 'ESPHome when the goal is a Home Assistant device and not programming'],
    avoid: ['Python for tight timing loops, audio or fast bit-banged protocols', 'Blocks for programs of hundreds of lines', 'Any framework without an official build for your exact chip'],
    check: ['That a library exists for every part you plan to use', 'That your chip has an official MicroPython or CircuitPython build, and its status', 'The version of the tutorial against the version you installed']
  },
  code: [
    {
      title: 'Which framework and version am I running?',
      about: 'Prints the version of the software under your program. The first thing to check when a library says "needs core 3.0 or newer" or an example does not compile.',
      needs: 'Any ESP32-family board and a serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Framework: ] (framework name))
          print (join [Version: ] (framework version))
          print (join [Chip: ] (chip model))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                   // give the monitor time to open
          Serial.printf("Arduino core: %d.%d.%d\n", ESP_ARDUINO_VERSION_MAJOR, ESP_ARDUINO_VERSION_MINOR, ESP_ARDUINO_VERSION_PATCH);
          Serial.printf("ESP-IDF:      %s\n", ESP.getSdkVersion());
          Serial.printf("Chip:         %s\n", ESP.getChipModel());
        }

        void loop() {}
      `,
      py: String.raw`
        import os

        info = os.uname()
        print("MicroPython:", info.release)    # the version of the firmware
        print("Build:      ", info.version)    # its date and git tag
        print("Machine:    ", info.machine)    # board and chip
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "esp_system.h"
        #include "esp_chip_info.h"

        void app_main(void)
        {
            esp_chip_info_t info;
            esp_chip_info(&info);
            printf("ESP-IDF: %s\n", esp_get_idf_version());
            printf("Chip:    %d core(s), revision %d\n", info.cores, info.revision);
        }
      `,
      output: `
        Arduino core: 3.3.12
        ESP-IDF:      v5.5.5
        Chip:         ESP32-S3
      `,
      notes: ['Your numbers will differ: that is the point. Arduino core 3.3.x is built on ESP-IDF 5.5, so the two lines move together.', 'In a sketch, `#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)` lets one file support both the old and the new core.']
    }
  ],
  quiz: [
    { q: 'A project needs an uncommon display, and the only ready library for it is written for Arduino C++. Which route is quickest?', choices: ['MicroPython, porting the library by hand', 'The Arduino core, using the library as it is', 'Blocks, because they need no libraries', 'ESPHome, because it is the newest'], a: 1, why: 'A ready library settles most arguments. The Arduino core has by far the most libraries, so a library that exists only there points to it.' },
    { q: 'Which statement about ESP-IDF is true?', choices: ['It is a rival that cannot be mixed with Arduino', 'It is Espressif\'s own framework, on which the Arduino core, MicroPython and ESPHome are built', 'It only runs on the original ESP32', 'It is a block editor for beginners'], a: 1, why: 'ESP-IDF provides FreeRTOS, the drivers and the radio stacks. The other tools are built on it, which is why a sketch can call IDF functions.' },
    { q: 'CircuitPython\'s official ESP builds are stable on every chip of the ESP32 family.', a: false, why: 'At the time of writing only the ESP32-S2 and S3 are stable; the ESP32 and C3 are beta, and the C2, C6, H2 and P4 alpha.' },
    { q: 'A student wants MicroPython on an ESP32-C61. What is the situation at the time of writing?', choices: ['An official build exists for every chip', 'There is no official MicroPython board definition for the C61, so Arduino or ESP-IDF is the practical route', 'MicroPython only runs on dual-core chips', 'It needs a bridge chip'], a: 1, why: 'Official builds exist for the ESP32, S2, S3, C2, C3, C5, C6, H2 and P4. The C61 is not among them, so check the current list before choosing.' }
  ],
  applications: [
    'Quick prototypes and hobby projects, where the Arduino core\'s libraries and examples save days.',
    'Products with secure boot, signed updates and long support, built directly on ESP-IDF.',
    'Classrooms and experiments, where MicroPython\'s prompt and blocks give an answer in seconds.',
    'Smart-home devices defined in a few lines of ESPHome YAML.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Get Started" and the release and support-period pages.',
    'Arduino core for ESP32 documentation, "Installing" and "Using the Arduino core as an ESP-IDF component".',
    'MicroPython documentation, "Quick reference for the ESP32", and the download pages for the ESP32 boards.'
  ],
  sim: 'ts-build-pipeline'
},

/* ================================================================ Arduino IDE */
{
  id: 'arduino-ide-and-the-esp32-core',
  parent: 'toolchains-and-setup',
  title: 'The Arduino IDE and the ESP32 core',
  level: 1,
  short: 'Install the Arduino IDE, add Espressif\'s board index, install the ESP32 core, pick a board and a port, upload. The core carries the compilers, the board definitions and the Arduino functions; its version decides which functions exist.',
  keywords: ['Arduino IDE', 'IDE 2', 'Boards Manager', 'board index', 'arduino-cli', 'FQBN', 'core', 'variant', 'Library Manager', 'install ESP32', 'esp32 by Espressif Systems', 'ESP_ARDUINO_VERSION'],
  prereq: ['choosing-a-framework', 'chip-module-board'],
  related: ['first-program-blink', 'board-menu-options', 'platformio', 'upload-problems', 'libraries-and-imports', 'the-serial-monitor'],
  body: `The Arduino IDE is an editor with two buttons, verify and upload, and a lot of machinery behind them. The machinery is the **core**: a package from Espressif that holds the compilers for the chip, the ESP-IDF libraries already built, the board definitions and the Arduino functions (\`pinMode\`, \`Serial\`, \`WiFi\`, \`Wire\`) written for this family. Install the IDE once; install or update the core whenever you like. The core's version decides which functions your sketch may use.

### Installing, step by step

1. Install the **Arduino IDE 2.x** (2.3 at the time of writing).
2. In *File → Preferences*, paste Espressif's board index into *Additional boards manager URLs*: \`https://espressif.github.io/arduino-esp32/package_esp32_index.json\`.
3. In *Tools → Board → Boards Manager*, search "esp32" and install **esp32 by Espressif Systems**. The download is large because it contains the compilers.
4. Choose a board under *Tools → Board → esp32*. If yours is not listed, take the generic one for its chip: *ESP32 Dev Module*, *ESP32S3 Dev Module*, *ESP32C3 Dev Module* or *ESP32C6 Dev Module*.
5. Plug in the board, choose its port under *Tools → Port*, press upload. If the output stops at "Connecting…", the board is not in download mode: hold BOOT, tap RESET, release BOOT ([[upload-problems]]).

### What the board choice really does

A board is a **variant**: the chip, its flash size and the names a sketch can use — which pins are \`SDA\`, \`SCL\`, \`MOSI\` and \`TX\`, and whether \`LED_BUILTIN\` exists. A wrong board is the commonest cause of "it uploads, but nothing happens", and the uploader refuses outright when the chip it finds is not the one chosen. The options of [[board-menu-options|the Tools menu]] refine the choice.

### Versions

At the time of writing the stable core is **3.3.x**, built on ESP-IDF 5.5; a 4.0 pre-release on ESP-IDF 6.1 comes from a separate *development* index. Core 2.x, which many older tutorials assume, names PWM, timers and the ESP-NOW callbacks differently, so copied code often fails to compile on 3.x. Boards Manager shows the installed version.

### The command line

The same machinery runs without the IDE as \`arduino-cli\`:

~~~sh
arduino-cli core install esp32:esp32 --additional-urls <the index URL above>
arduino-cli compile --fqbn esp32:esp32:esp32s3 MySketch
arduino-cli upload  --fqbn esp32:esp32:esp32s3 -p COM3 MySketch
~~~

Libraries come from *Sketch → Include Library → Manage Libraries*; the examples under *File → Examples* are tested against the core you installed.

> [!key] The IDE is a front end; the installed core is the toolchain and decides what a sketch can use. Pick the board that matches your chip, keep the core's version in mind, and check it before copying old code.`,
  ideas: [
    'The IDE edits and starts the work; the core holds the compilers, the board definitions and the Arduino functions.',
    'Espressif\'s board index is added once in Preferences; the core is then installed from Boards Manager.',
    'Choosing a board chooses a variant: the chip and the names for pins such as SDA, MOSI and LED_BUILTIN.',
    'Core 3.x and 2.x differ; the installed version decides whether an old sketch compiles.'
  ],
  pitfalls: [
    'Any ESP board works with "ESP32 Dev Module" — That choice builds for the original ESP32. An S3, C3 or C6 needs its own board entry, or the uploader stops because the chip found is not the one chosen.',
    'The IDE installs the ESP32 core by itself — The core arrives only after you add Espressif\'s index to Preferences and install it in Boards Manager.',
    'Updating the core is risk-free — A new core can rename functions or change a library\'s behaviour. Update deliberately and note the version a project was built with.'
  ],
  terms: [
    { term: 'Boards Manager', also: ['board package', 'core installer'], def: 'The part of the Arduino IDE that downloads board packages. Add a maker\'s index URL in Preferences and its boards appear for installation.' },
    { term: 'Variant', also: ['board definition', 'pins_arduino.h'], def: 'The per-board part of the core: the chip, memory sizes and the names such as SDA, SCL, TX and LED_BUILTIN. Choosing a board in the IDE chooses a variant.' },
    { term: 'FQBN', also: ['fully qualified board name'], def: 'The command-line name of a board and its options, such as esp32:esp32:esp32s3. It is what arduino-cli takes in place of the Tools menu.' },
    { term: 'arduino-cli', also: ['Arduino command line'], def: 'The Arduino toolchain as a program with no window: it installs cores and libraries, compiles and uploads. The IDE uses the same engine.' },
    { term: 'Library Manager', also: ['library index'], def: 'The IDE\'s catalogue of libraries. A library lists the processor architectures it supports; for these chips look for esp32.' }
  ],
  code: [
    {
      title: 'Which pins did the board choice give me?',
      about: 'Prints the pin numbers the core\'s board definition gives to I2C, SPI, serial and the LED. Upload it with different boards chosen and watch the numbers change.',
      needs: 'Any ESP32-family board and a serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [SDA: ] (default I2C data pin))
          print (join [SCL: ] (default I2C clock pin))
          print (join [MOSI: ] (default SPI data-out pin))
          print (join [LED: ] (built-in LED pin))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                    // give the monitor time to open
          Serial.printf("I2C  SDA=%d SCL=%d\n", SDA, SCL);
          Serial.printf("SPI  SS=%d MOSI=%d MISO=%d SCK=%d\n", SS, MOSI, MISO, SCK);
          Serial.printf("UART TX=%d RX=%d\n", TX, RX);
        #ifdef LED_BUILTIN
          Serial.printf("LED_BUILTIN=%d\n", LED_BUILTIN);
        #else
          Serial.println("This board definition names no LED_BUILTIN");
        #endif
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no board definitions: a pin is always its plain GPIO number, so there is nothing to look up.' },
      output: `
        I2C  SDA=21 SCL=22
        SPI  SS=5 MOSI=23 MISO=19 SCK=18
        UART TX=1 RX=3
        This board definition names no LED_BUILTIN
      `,
      notes: ['The output shown is for ESP32 Dev Module. Choose ESP32S3 Dev Module and the numbers become 8 and 9 for I2C; the generic ESP32 board defines no LED_BUILTIN at all.']
    }
  ],
  quiz: [
    { q: 'The board is an ESP32-C3, but "ESP32S3 Dev Module" is chosen. What happens at upload?', choices: ['It uploads and runs at half speed', 'The uploader stops: the chip it finds is not the chip chosen', 'The IDE picks the right board by itself', 'Nothing, the two chips are identical'], a: 1, why: 'The uploader tells esptool which chip to expect and esptool checks it. A mismatch ends in an error about the wrong chip, which is a helpful way to learn the board is wrong.' },
    { q: 'What must you do before the IDE can offer ESP32 boards?', choices: ['Nothing, they are built in', 'Add Espressif\'s board index URL in Preferences and install the core in Boards Manager', 'Buy a licence from Arduino', 'Install Python first'], a: 1, why: 'The ESP32 core is not part of the IDE. It comes from Espressif\'s index, added in Preferences and installed through Boards Manager.' },
    { q: 'A sketch from a 2022 tutorial uses ledcSetup(). It compiles unchanged on core 3.x.', a: false, why: 'Core 3.x replaced ledcSetup and ledcAttachPin with ledcAttach. Many 2.x functions changed names in 3.0, so check the version a tutorial assumes.' },
    { q: 'Why can SDA be 21 on one board entry and 8 on another?', choices: ['The IDE chooses at random', 'Each board entry is a variant that defines its own names for the pins', 'The sketch is edited automatically', 'SDA is a property of the cable'], a: 1, why: 'The variant\'s pins_arduino.h file gives names such as SDA and SCL their numbers for that chip. Changing the board changes which file is used.' }
  ],
  applications: [
    'Getting a first sketch onto a new board within minutes of unpacking it.',
    'Teaching groups, where one installer and one board index set up every laptop the same way.',
    'Automated builds that call arduino-cli with a board name and a sketch folder.',
    'Checking which core version a library needs before adding it to a project.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, "Installing" (Arduino IDE, Boards Manager and arduino-cli).',
    'Arduino IDE 2 documentation: Boards Manager and Library Manager.',
    'Arduino core for ESP32, the variants folder (pins_arduino.h for each chip).'
  ],
  sim: 'ts-build-pipeline'
},

/* ================================================================ Tools menu */
{
  id: 'board-menu-options',
  parent: 'toolchains-and-setup',
  title: 'The Tools menu: what each option means',
  level: 2,
  short: 'A dozen options sit between the board and the upload button. Most defaults are right; when one is wrong the symptoms are strange: no serial output, "sketch too big", PSRAM not found. Here is what each option does and what its wrong setting looks like.',
  keywords: ['Tools menu', 'USB CDC On Boot', 'Flash Size', 'Partition Scheme', 'PSRAM', 'Upload Mode', 'CPU Frequency', 'Core Debug Level', 'Erase All Flash', 'Zigbee Mode', 'Flash Mode', 'sketch too big', 'no serial output', 'huge app', 'OPI PSRAM'],
  prereq: ['arduino-ide-and-the-esp32-core', 'chip-module-board'],
  related: ['partition-tables', 'using-psram', 'usb-on-the-esp', 'the-serial-monitor', 'flashing-and-esptool', 'upload-problems', 'flash-memory-on-modules'],
  body: `Between the board and the upload button sit a dozen options in the *Tools* menu. Mostly the defaults are right. When one is wrong the symptoms are confusing — a sketch that uploads but prints nothing, a board that restarts for ever — so it pays to know what each option changes. The names differ a little between core versions, and a menu shows only the options its chip has.

### The options, and what goes wrong

| Option | What it sets | A wrong setting looks like |
|---|---|---|
| **USB CDC On Boot** | Whether \`Serial\` is the chip's own USB port or the UART0 pins | *Disabled* on a board with only a chip-USB connector: the sketch runs, the monitor stays empty |
| **Upload Mode** | Which route the uploader takes (UART0 or built-in USB; or the sketch's own USB port) | "Failed to connect", or the port is not there |
| **Flash Size** | The flash size written into the image | Larger than the module: a boot that stops over a partition beyond the chip; smaller: space unused |
| **Partition Scheme** | How flash is divided: app, second app for updates, file system | App too big: "Sketch too big"; no second app: updates fail; file system moved: it will not mount |
| **PSRAM** | Switches external RAM on and picks its interface (quad or octal) | Off: PSRAM never found; wrong interface: an error at boot |
| **CPU Frequency** | The processor clock | Below 80 MHz on the ESP32, Wi-Fi and Bluetooth cannot run |
| **Core Debug Level** | How many log messages the core prints | None hides library messages; Verbose floods the port and slows the loop |
| **Erase All Flash Before Sketch Upload** | Wipes the whole flash first | Saved Wi-Fi credentials and files vanish |
| **Zigbee Mode** | Which Zigbee role is built (C6, H2) | A Zigbee sketch refuses to compile |

*Flash Mode* and *Flash Frequency* say how fast and how wide the chip talks to its flash. A setting the chip cannot do gives read errors at start-up; keep the defaults.

### Reading the symptoms

- **Uploaded, but silent.** On an S3, C3 or C6 board with only a chip-USB connector, turn *USB CDC On Boot* on. With it on but a UART bridge on the board, output goes to the unconnected USB port instead.
- **"Sketch too big".** The image is larger than the app partition. Pick a scheme with a bigger app (*Huge APP*) and accept that updates over the air then have no second slot.
- **PSRAM not found.** Wrong interface for the module: quad on the ESP32 and S2, octal (*OPI*) on S3 modules marked R8 or R16. On those, GPIO35–37 belong to the PSRAM.
- **Settings seem to be ignored.** Changing the partition scheme moves the file system; upload it again.

> [!key] Each option changes one thing between the compiler and the chip. When something strange happens after changing a setting, change it back first: USB CDC for silence, Partition Scheme for size and file systems, PSRAM for missing memory.`,
  ideas: [
    'Every Tools option sets one thing the compiler or the uploader needs to know about the board.',
    'No output on a native-USB board usually means USB CDC On Boot is off.',
    '"Sketch too big" means the image exceeds the app partition: change the Partition Scheme.',
    'PSRAM must match the module: quad or octal, and on or off; octal PSRAM takes GPIO35–37 on the S3.'
  ],
  pitfalls: [
    'The biggest flash size in the menu is always best — It must match the chip. A scheme that runs past the real end of the flash cannot boot.',
    'USB CDC On Boot should always be on — It sends Serial to the chip\'s own USB port. On a board whose connector goes to a UART bridge, the output then goes nowhere you are looking.',
    'Changing the partition scheme leaves my files alone — The file system sits at a new place, so old files are not found until it is uploaded again.'
  ],
  terms: [
    { term: 'USB CDC On Boot', also: ['CDC on boot'], def: 'An Arduino option that makes Serial use the chip\'s built-in USB serial port instead of the UART0 pins. It exists only on chips with native USB.' },
    { term: 'Partition scheme', also: ['partition table', 'Huge APP', 'No OTA'], def: 'The layout of the flash chosen at build time: how large the app is, whether a second app slot exists for updates, and how large the file system is.' },
    { term: 'PSRAM', also: ['SPIRAM', 'external RAM'], def: 'Extra RAM, megabytes in size, in a separate chip or in the package. It must be switched on in the build and its interface (quad or octal) must match the hardware.' },
    { term: 'Upload mode', also: ['upload port route'], def: 'The route the uploader uses to reach the chip: through UART0 or the built-in USB serial port, or through the USB port a running sketch provides.' },
    { term: 'Core debug level', also: ['log level'], def: 'A build setting for how chatty the core is, from none to verbose. It decides which log messages from the Wi-Fi, Bluetooth and system libraries reach the serial port.' }
  ],
  choose: {
    good: ['Defaults for a first sketch on a standard board', 'USB CDC On Boot enabled on boards whose only connector is the chip\'s USB', 'A Huge APP scheme for a big sketch that needs no updates over the air', 'Debug level Info while chasing a Wi-Fi problem'],
    avoid: ['A flash size or scheme larger than the module has', 'PSRAM switched on for a module that has none', 'Erase All Flash while a device holds credentials you want to keep'],
    check: ['The exact module: flash size, PSRAM and its interface', 'Which connector on the board reaches the chip\'s USB and which the UART bridge', 'That the app partition is larger than the sketch, with room to grow']
  },
  code: [
    {
      title: 'What did the Tools menu build?',
      about: 'Prints the flash size the build believes in, the sketch size, the room for an update and the memory. Change a menu option, upload again and compare.',
      needs: 'Any ESP32-family board and a serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Flash size KB: ] (flash size in KB))
          print (join [Sketch size KB: ] (sketch size in KB))
          print (join [Free heap KB: ] (free memory in KB))
          print (join [PSRAM KB: ] (PSRAM size in KB))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                      // give the monitor time to open
          Serial.printf("Flash size  : %u KB\n", (unsigned)(ESP.getFlashChipSize() / 1024));
          Serial.printf("Sketch size : %u KB\n", (unsigned)(ESP.getSketchSize() / 1024));
          Serial.printf("Update room : %u KB\n", (unsigned)(ESP.getFreeSketchSpace() / 1024));   // size of the next update slot
          Serial.printf("Free heap   : %u KB\n", (unsigned)(ESP.getFreeHeap() / 1024));
          Serial.printf("PSRAM       : %u KB\n", (unsigned)(ESP.getPsramSize() / 1024));         // 0 when off or absent
        }

        void loop() {}
      `,
      py: String.raw`
        import esp, gc

        print("Flash size  :", esp.flash_size() // 1024, "KB")
        print("Free heap   :", gc.mem_free() // 1024, "KB")
        # MicroPython has no menu: the firmware file you flashed decides the PSRAM and the partitions
      `,
      output: `
        Flash size  : 4096 KB
        Sketch size : 270 KB
        Update room : 1280 KB
        Free heap   : 292 KB
        PSRAM       : 0 KB
      `,
      notes: ['The numbers are an example for an ESP32 Dev Module with the default scheme. "Update room" is the size of the second app slot: it reads 0 with a scheme that has none.']
    }
  ],
  quiz: [
    { q: 'A sketch uploads to an ESP32-S3 board that has only a USB-C connector on the chip. The Serial Monitor is empty. What is the first thing to try?', choices: ['Lower the CPU frequency', 'Turn USB CDC On Boot on', 'Erase all flash', 'Change the Zigbee mode'], a: 1, why: 'With CDC On Boot off, Serial is the UART0 pins, which no connector reaches. Turning it on sends Serial to the chip\'s own USB port.' },
    { q: 'The build ends with "Sketch too big". Which option addresses it?', choices: ['Upload Mode', 'Partition Scheme', 'Core Debug Level', 'PSRAM'], a: 1, why: 'The app partition is smaller than the image. A scheme with a larger app, such as Huge APP, gives it room — at the cost of the second slot used for updates.' },
    { q: 'On an ESP32-S3 module marked R8, the PSRAM is octal, and GPIO35, 36 and 37 are connected to it.', a: true, why: 'Octal PSRAM on the S3 uses those three pins, so they are unavailable for other uses on R8 and R16 modules. Choose the OPI PSRAM setting for such a module.' },
    { q: 'A board stores its Wi-Fi password in flash. Which option wipes it at the next upload?', choices: ['Flash Mode', 'Erase All Flash Before Sketch Upload', 'CPU Frequency', 'Upload Mode'], a: 1, why: 'That option erases the entire flash before writing the sketch, including the area where saved settings and files live.' }
  ],
  applications: [
    'Fixing "it uploads but prints nothing" on boards with native USB, the commonest S3 and C3 question.',
    'Making room for a large sketch with a web page, a TLS library and a display driver.',
    'Choosing a scheme with two app slots for a device that will be updated over the air.',
    'Turning the debug level up for an evening of Wi-Fi fault-finding, and down again for production.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, "Tools menu" guide.',
    'Espressif, ESP-IDF Programming Guide, "Partition Tables" and the PSRAM notes for the ESP32-S3.',
    'Espressif, *ESP32-S3-WROOM-1 Datasheet*: pins used by octal PSRAM.'
  ],
  sim: 'ts-tools-menu'
},

/* ================================================================ PlatformIO */
{
  id: 'platformio',
  parent: 'toolchains-and-setup',
  title: 'PlatformIO and pioarduino',
  level: 2,
  short: 'PlatformIO describes a whole embedded project in one text file, so it builds the same way everywhere. Its official ESP32 platform still carries the old Arduino core 2.x; the pioarduino fork brings core 3.x.',
  keywords: ['PlatformIO', 'pioarduino', 'platformio.ini', 'VS Code', 'pio', 'lib_deps', 'build_flags', 'espressif32', 'environment', 'monitor_speed', 'uploadfs', 'esp32_exception_decoder'],
  prereq: ['arduino-ide-and-the-esp32-core', 'choosing-a-framework'],
  related: ['esp-idf-basics', 'board-menu-options', 'libraries-and-imports', 'unit-testing', 'the-serial-monitor'],
  body: `PlatformIO is a build system and project manager for embedded work, used from VS Code or the command line. Where the Arduino IDE hides a project in a folder with one file, PlatformIO makes it explicit: one text file, \`platformio.ini\`, says which board, which framework, which libraries and which settings, so the project builds the same way on another computer or in an automated build.

### The project file

~~~ini
[env:esp32s3]
platform = https://github.com/pioarduino/platform-espressif32/releases/download/stable/platform-espressif32.zip
board = esp32-s3-devkitc-1
framework = arduino
monitor_speed = 115200
lib_deps = bblanchon/ArduinoJson@^7
build_flags = -DARDUINO_USB_MODE=1 -DARDUINO_USB_CDC_ON_BOOT=1
board_build.partitions = huge_app.csv
~~~

Each \`[env:name]\` block is one build target; a project may hold several, for an ESP32 and an ESP32-C3 say, and \`pio run -e esp32s3\` builds one. The two \`-D\` flags do what the Tools menu would: native-USB serial on boot ([[board-menu-options]]). \`huge_app.csv\` is a partition table that ships with the Arduino core.

### The platform line is the one that bites

PlatformIO's official \`espressif32\` platform (7.1 at the time of writing) still ships Arduino core **2.0.17**, on ESP-IDF 4.4. A \`platformio.ini\` copied from a 2022 tutorial therefore builds against the old API, and code written for core 3.x, such as \`ledcAttach\`, will not compile. For core 3.x use the community fork **pioarduino**, as above: its *stable* release is Arduino 3.3.12 on ESP-IDF 5.5.5, and a release candidate carries the 4.0 core on ESP-IDF 6.1. Replace \`stable\` with a release tag to pin a version.

### Layout and commands

\`src/main.cpp\` holds the program. It starts with \`#include <Arduino.h>\`, because nothing adds it for you as the Arduino IDE does. \`lib/\` holds your own libraries and \`data/\` the files for the file system.

~~~sh
pio run                  # build
pio run -t upload        # build and upload
pio device monitor       # serial monitor at monitor_speed
pio run -t uploadfs      # upload the data folder as the file system
~~~

PlatformIO earns its keep on larger projects, several boards, version control and build servers: \`lib_deps\` pins library versions and the one file reproduces everything. For a first week of blinking the Arduino IDE is simpler.

> [!key] platformio.ini turns a project into a reproducible recipe. Name the pioarduino platform for Arduino core 3.x: the official platform still builds with core 2.x.`,
  ideas: [
    'One file, platformio.ini, names the board, framework, libraries and flags of a project.',
    'Each [env:...] block is a separate build target; one project can build for several boards.',
    'PlatformIO\'s official ESP32 platform still ships Arduino core 2.0.17; pioarduino carries core 3.x.',
    'lib_deps pins library versions, which is what makes a build repeatable.'
  ],
  pitfalls: [
    'platform = espressif32 gives the current Arduino core — It gives core 2.0.17. For 3.x name the pioarduino platform; otherwise functions such as ledcAttach do not exist.',
    'A sketch can be dropped into src/ unchanged — A .cpp file needs #include <Arduino.h>, and functions must be declared before they are used.',
    'The newest library is always best — Without a version in lib_deps the build may pull a newer library later and break; pin it.'
  ],
  terms: [
    { term: 'platformio.ini', also: ['project configuration file'], def: 'The text file in a PlatformIO project\'s root that names the platform, board, framework, libraries, build flags and monitor settings of each build target.' },
    { term: 'pioarduino', also: ['platform-espressif32 fork'], def: 'A community fork of PlatformIO\'s ESP32 platform that follows Arduino core 3.x and recent ESP-IDF releases, which the official platform does not.' },
    { term: 'Environment', also: ['env', 'build target'], def: 'One [env:name] block of platformio.ini: a board, a framework and a set of options that build to one firmware.' },
    { term: 'lib_deps', also: ['library dependencies'], def: 'The platformio.ini setting that lists the libraries a project needs, optionally with versions, so they are fetched automatically.' },
    { term: 'Build flag', also: ['-D', 'compiler definition'], def: 'An option passed to the compiler, such as -DCORE_DEBUG_LEVEL=3, which defines a macro for the whole project.' }
  ],
  choose: {
    good: ['Larger projects with several source files and libraries', 'One project for several boards', 'Version control and automated builds that must reproduce a firmware exactly', 'Unit tests that run on the computer'],
    avoid: ['A first blink, where the Arduino IDE is quicker', 'The official platform line when you need Arduino core 3.x', 'Unpinned libraries in anything you will maintain'],
    check: ['Which Arduino core the platform line really gives', 'That every library supports the chip and the core version', 'The partition table and flash size match the module']
  },
  code: [
    {
      title: 'A PlatformIO project\'s src/main.cpp',
      about: 'The program of the project above: blink, and count the blinks. It is plain C++, so it starts with `#include <Arduino.h>`.',
      needs: 'An ESP32 board and the platformio.ini above, with board changed to match.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set [count v] to (0)
        forever
          set pin (2) to [HIGH v]
          wait (0.5) seconds
          set pin (2) to [LOW v]
          wait (0.5) seconds
          change [count v] by (1)
          print (join [blinks: ] (count))
        end
      `,
      cpp: String.raw`
        #include <Arduino.h>            // PlatformIO does not add this for you

        const int LED_PIN = 2;          // change to your board's LED
        int count = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
        }

        void loop() {
          digitalWrite(LED_PIN, HIGH);
          delay(500);
          digitalWrite(LED_PIN, LOW);
          delay(500);
          count++;
          Serial.printf("blinks: %d\n", count);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)            # change to your board's LED
        count = 0

        while True:
            led.value(1)
            time.sleep_ms(500)
            led.value(0)
            time.sleep_ms(500)
            count += 1
            print("blinks:", count)
      `,
      output: `
        blinks: 1
        blinks: 2
        blinks: 3
      `,
      notes: ['PlatformIO builds the C++ version; the MicroPython version needs no project, only the file main.py on the board ([[micropython-setup]]).', 'Add `monitor_filters = esp32_exception_decoder` to platformio.ini to turn the addresses of a crash report into function names.']
    }
  ],
  quiz: [
    { q: 'A platformio.ini says platform = espressif32 and framework = arduino. Which Arduino core does it build with, at the time of writing?', choices: ['3.3.12, the newest', '2.0.17, the old one', '4.0, the pre-release', 'None: it needs the Arduino IDE'], a: 1, why: 'The official platform still pins core 2.0.17. Core 3.x comes from the community pioarduino platform.' },
    { q: 'Code that calls ledcAttach() fails to compile in a project built on the official platform. Why?', choices: ['ledcAttach is a typing error', 'ledcAttach exists only from core 3.0, and the official platform builds core 2.x', 'PlatformIO has no PWM', 'The pin is wrong'], a: 1, why: 'Core 2.x has ledcSetup and ledcAttachPin; core 3.x replaced them. Naming the pioarduino platform gives the core the code was written for.' },
    { q: 'A file src/main.cpp that uses Serial and pinMode needs no #include line for them.', a: false, why: 'Only .ino sketches get the Arduino header added automatically. A .cpp file must begin with #include <Arduino.h>.' },
    { q: 'What does pio run -e esp32s3 do?', choices: ['Runs the program on the computer', 'Builds the environment named esp32s3', 'Erases the flash', 'Opens the serial monitor'], a: 1, why: 'Each [env:name] block is a build target, and -e selects one of them. Without -e, all environments are built.' }
  ],
  applications: [
    'Firmware that several people build on different computers and must come out identical.',
    'Products with one source tree and several hardware variants, each its own environment.',
    'Automated builds and unit tests on a build server.',
    'Larger Arduino-style projects that outgrow a single sketch folder.'
  ],
  sources: [
    'PlatformIO documentation, "platformio.ini" project configuration and the Espressif 32 platform page.',
    'pioarduino, platform-espressif32 repository README (platform line, stable and release-candidate releases).',
    'Arduino core for ESP32 documentation, "Migration from 2.x to 3.0".'
  ]
},

/* ================================================================ ESP-IDF */
{
  id: 'esp-idf-basics',
  parent: 'toolchains-and-setup',
  title: 'ESP-IDF: projects, components, menuconfig',
  level: 2,
  short: 'ESP-IDF is Espressif\'s own C framework and the base of every other tool. A project is a few CMake files and app_main(); components bring the drivers; menuconfig sets the options; idf.py builds, flashes and monitors.',
  keywords: ['ESP-IDF', 'idf.py', 'menuconfig', 'sdkconfig', 'Kconfig', 'component', 'app_main', 'CMake', 'component registry', 'idf_component.yml', 'set-target', 'IDF 6', 'VS Code extension'],
  prereq: ['choosing-a-framework', 'first-program-blink'],
  related: ['platformio', 'partition-tables', 'tasks', 'print-debugging-and-log-levels', 'jtag-debugging', 'arduino-ide-and-the-esp32-core'],
  body: `ESP-IDF, Espressif's IoT Development Framework, is where every other tool in this topic ends up. It is a C framework with an operating system (FreeRTOS), drivers for every peripheral, the network stacks, and the tools to configure, build, flash and monitor, all driven by one command, \`idf.py\`. You meet it directly when you need a feature the Arduino core does not expose, when you build a product, or when you want to know how the others work.

### A project

~~~text
hello/
  CMakeLists.txt     the project name and the IDF build rules
  sdkconfig          every setting, written by menuconfig
  main/
    CMakeLists.txt   the source files of this component
    hello.c          your code: app_main()
~~~

The two build files are short:

~~~text
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
include($ENV{IDF_PATH}/tools/cmake/project.cmake)
project(hello)

# main/CMakeLists.txt
idf_component_register(SRCS "hello.c" INCLUDE_DIRS ".")
~~~

### Components and menuconfig

Everything is a **component**: your \`main\`, and IDF's own \`esp_wifi\`, \`nvs_flash\`, \`esp_driver_gpio\` and the rest. A component brings sources, headers and its own options. **menuconfig** is a text menu over the options of every component: *Serial flasher config* for the flash size, *Partition Table*, *Component config* for logging, PSRAM and Wi-Fi buffers. Choices are saved in \`sdkconfig\` and reach the code as \`CONFIG_…\` macros. It is the ESP-IDF counterpart of the Tools menu, only far larger. Extra components come from the component registry: \`idf.py add-dependency "espressif/led_strip"\` records one in \`idf_component.yml\`.

### The everyday commands

~~~sh
idf.py set-target esp32s3        # once: which chip
idf.py menuconfig                # change settings
idf.py build
idf.py -p COM3 flash monitor     # upload, then show the serial output (Ctrl+] leaves)
~~~

The ESP-IDF extension for VS Code installs the framework and puts these behind buttons.

### Versions

At the time of writing ESP-IDF **6.1** is the stable release and the 5.5 line is still maintained: it is the base of Arduino core 3.3 and of MicroPython 1.29. Each release is supported for about 30 months. Version 6.0 removed the old peripheral drivers (\`driver/adc.h\`, \`timer.h\`, \`i2s.h\`, \`rmt.h\`, \`pcnt.h\`, \`mcpwm.h\`, \`dac.h\`), so a tutorial that includes them needs porting to the new driver API.

> [!key] An ESP-IDF project is CMake files plus app_main(); components bring the drivers, menuconfig stores the options in sdkconfig, and idf.py does the rest. Check the IDF version a tutorial assumes: 6.0 removed old drivers.`,
  ideas: [
    'A project is a top-level CMakeLists.txt, a main component and app_main(); there is no loop().',
    'Everything, including your own code, is a component with its own sources and options.',
    'menuconfig edits the options of all components and saves them in sdkconfig as CONFIG_ macros.',
    'idf.py sets the target, builds, flashes and monitors; version 6.0 removed the legacy peripheral drivers.'
  ],
  pitfalls: [
    'app_main() must never return — It may. The task that runs it is deleted when it returns, and the rest of the system, including other tasks, carries on.',
    'ESP-IDF code from any year works on any version — The driver API changed in 5.x and 6.0 removed the old ones. Check the version a tutorial was written for.',
    'Editing sdkconfig by hand is the way to change settings — Use menuconfig, or sdkconfig.defaults for settings you want kept when a new sdkconfig is generated.'
  ],
  terms: [
    { term: 'Component', also: ['IDF component', 'managed component'], def: 'A folder of sources, headers and options that the build treats as one unit. Your main code, IDF\'s drivers and registry downloads are all components.' },
    { term: 'menuconfig', also: ['Kconfig', 'project configuration'], def: 'A text menu, opened with idf.py menuconfig, for the configuration options of every component in a project. Its result goes into sdkconfig.' },
    { term: 'sdkconfig', also: ['sdkconfig.defaults'], def: 'The file in which a project\'s configuration choices are saved. Each setting becomes a CONFIG_ macro in the code.' },
    { term: 'idf.py', also: ['ESP-IDF front end'], def: 'The command that drives ESP-IDF: set-target, menuconfig, build, flash, monitor and more, wrapping CMake and esptool.' },
    { term: 'app_main', also: ['main task'], def: 'The function ESP-IDF calls to start your program, in a FreeRTOS task. It plays the part of setup and loop together, and may return.' }
  ],
  choose: {
    good: ['Products that need updates, security features and long support', 'Features the Arduino core does not expose', 'Tuning memory, logging and the radio through menuconfig', 'Chips that are new, where ESP-IDF support arrives first'],
    avoid: ['A first blink, where the Arduino IDE is far quicker', 'Copying driver code from old tutorials into IDF 6', 'Projects that depend on many Arduino-only libraries'],
    check: ['Which ESP-IDF version the libraries and tutorials assume', 'That the target chip is supported by that version', 'Whether you want the Arduino core as a component of the project']
  },
  code: [
    {
      title: 'Hello from app_main',
      about: 'The smallest ESP-IDF program, and the same thing in the other languages: print a counter once a second. app_main() is an ordinary task, so `vTaskDelay` lets the rest of the system run.',
      needs: 'Any ESP32-family board and a serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [count v] to (0)
        forever
          print (join [Hello, world: ] (count))
          change [count v] by (1)
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        int count = 0;

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          Serial.printf("Hello, world: %d\n", count++);
          delay(1000);
        }
      `,
      py: String.raw`
        import time

        count = 0
        while True:
            print("Hello, world:", count)
            count += 1
            time.sleep(1)
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "freertos/FreeRTOS.h"
        #include "freertos/task.h"
        #include "esp_log.h"

        static const char *TAG = "hello";

        void app_main(void)
        {
            int count = 0;
            for (;;) {
                ESP_LOGI(TAG, "Hello, world: %d", count++);
                vTaskDelay(pdMS_TO_TICKS(1000));      // one second; other tasks keep running
            }
        }
      `,
      output: `
        I (322) hello: Hello, world: 0
        I (1322) hello: Hello, world: 1
        I (2322) hello: Hello, world: 2
      `,
      notes: ['In ESP-IDF the log macro adds a level letter, a time stamp in milliseconds and a tag; the Arduino and MicroPython versions print the bare text.', 'Before these lines, the serial port also shows the boot messages ([[reading-boot-messages]]).']
    }
  ],
  quiz: [
    { q: 'Where does an ESP-IDF program start?', choices: ['setup()', 'app_main()', 'main() in main.py', 'loop()'], a: 1, why: 'ESP-IDF starts your program by calling app_main() from a FreeRTOS task. There is no loop(); you write the loop yourself, or start more tasks.' },
    { q: 'Where does menuconfig keep the choices you make?', choices: ['In the chip\'s eFuses', 'In the file sdkconfig', 'In idf.py', 'In the browser'], a: 1, why: 'menuconfig writes sdkconfig. Each setting reaches the source as a CONFIG_ macro and also controls the build.' },
    { q: 'A tutorial for ESP-IDF 4.4 includes driver/adc.h. It builds unchanged on ESP-IDF 6.1.', a: false, why: 'ESP-IDF 6.0 removed the legacy ADC driver along with the legacy timer, I2S, RMT, PCNT, MCPWM and DAC drivers. The newer driver API must be used instead.' },
    { q: 'What happens when app_main() returns?', choices: ['The chip resets at once', 'The main task is deleted and other tasks keep running', 'Everything halts', 'loop() starts'], a: 1, why: 'app_main runs in an ordinary task. When it returns, that task ends; the operating system and any tasks you started continue.' }
  ],
  applications: [
    'Commercial products that need secure boot, signed updates and long-term support.',
    'Using a peripheral or protocol feature before it appears in the Arduino core.',
    'Tuning memory use, log output and radio buffers through menuconfig.',
    'Studying how the Arduino core and MicroPython work, since both are built on it.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Get Started" and "Build System".',
    'Espressif, *ESP-IDF Programming Guide*, "Project Configuration" (Kconfig) and the versions and support-period page.',
    'Espressif, ESP-IDF 6.0 migration guide, peripherals.'
  ]
},

/* ================================================================ MicroPython */
{
  id: 'micropython-setup',
  parent: 'toolchains-and-setup',
  title: 'MicroPython: firmware, Thonny, mpremote',
  level: 1,
  short: 'Flash one firmware file once, and the chip answers at a Python prompt. Thonny or mpremote then copy your files over; boot.py and main.py start by themselves.',
  keywords: ['MicroPython', 'firmware', 'Thonny', 'mpremote', 'REPL', 'boot.py', 'main.py', 'erase-flash', 'write-flash', 'ESP32_GENERIC', 'soft reset', 'Ctrl+C', 'mip', 'micropython-lib'],
  prereq: ['choosing-a-framework', 'first-program-blink'],
  related: ['flashing-and-esptool', 'circuitpython-on-esp', 'upload-problems', 'the-serial-monitor', 'asyncio-in-micropython', 'libraries-and-imports'],
  body: `MicroPython is a small Python for microcontrollers. On an ESP chip it is **firmware**: you flash one file that contains the interpreter, and from then on the chip answers at a prompt and runs your Python files. Installing it is a one-off job. After that there is no compile and no upload cycle: you type a line, or copy a file.

### Installing the firmware

1. Download the build for your chip from the MicroPython site: generic builds for the ESP32, S3, C3 and the other chips, and builds for many named boards (version 1.29 at the time of writing).
2. If the board needs it, put it in download mode ([[boot-modes-and-download-mode]]).
3. Erase, then write. The first offset depends on the chip:

~~~sh
esptool --chip esp32 --port COM3 erase-flash
esptool --chip esp32 --port COM3 --baud 460800 write-flash 0x1000 ESP32_GENERIC-20260824-v1.29.0.bin
~~~

The offset is **0x1000** for the ESP32 and S2, **0** for the C3, C6, S3, C2 and H2, and **0x2000** for the C5 and P4; a wrong offset leaves a board that will not boot. esptool 5 spells commands with hyphens; MicroPython's own pages may still show \`esptool.py write_flash\`, which works with a warning.

### Talking to it

The prompt \`>>>\` is the REPL. **Thonny** (version 5) is the friendliest way in: choose the MicroPython (ESP32) interpreter and the port, type in the shell at the bottom, press run for a file. **mpremote**, the official command-line tool, does the same from a terminal:

~~~sh
mpremote connect list                  # ports that have a MicroPython board
mpremote repl                          # the prompt (Ctrl+] leaves)
mpremote run test.py                   # run a file from the computer, without copying it
mpremote fs cp main.py :main.py        # copy a file onto the chip
mpremote mip install aioble            # install a package from micropython-lib
~~~

Many everyday modules are already inside the firmware: \`requests\`, \`umqtt\`, \`neopixel\`, \`dht\`, \`onewire\`.

### boot.py and main.py

At every start MicroPython runs \`boot.py\` (set-up) and then \`main.py\` (your program) from the chip's file system. **Ctrl+C** stops a running program and returns the prompt; **Ctrl+D** restarts it. A \`main.py\` that never ends hides the prompt until you press Ctrl+C, so run a program under development with \`mpremote run\` and copy it only when it works.

> [!key] Flash the firmware once at the right offset for your chip, then work at the prompt with Thonny or mpremote. boot.py and main.py run at every start; Ctrl+C always gets you back to the prompt.`,
  ideas: [
    'MicroPython is firmware: flash it once, then type at a prompt or copy Python files.',
    'The first flash offset depends on the chip: 0x1000 on the ESP32 and S2, 0 on the C3, C6, S3, C2 and H2, 0x2000 on the C5 and P4.',
    'Thonny and mpremote talk to the chip over the same serial line and copy files into its file system.',
    'boot.py and main.py run at every start; Ctrl+C interrupts, Ctrl+D restarts.'
  ],
  pitfalls: [
    'Any ESP firmware image works on any ESP board — The image must be built for your chip, and flashed at that chip\'s offset. A wrong chip or offset gives a board that does not boot.',
    'The chip holds my program like a sketch, so I must upload each change — Copying the file is enough, and a line typed at the prompt runs at once and needs no file.',
    'A main.py that loops for ever is harmless — It occupies the prompt. Press Ctrl+C to interrupt it, or run the file from the computer with mpremote run while developing.'
  ],
  terms: [
    { term: 'REPL', also: ['read-eval-print loop', 'the prompt', '>>>'], def: 'The prompt at which MicroPython reads a line, runs it and prints the result. It is how you try an idea on the chip without writing a file.' },
    { term: 'boot.py', also: ['main.py'], def: 'The two files MicroPython runs at every start, boot.py first and then main.py, from the chip\'s own file system. boot.py is for set-up, main.py for the program.' },
    { term: 'Thonny', also: ['Thonny IDE'], def: 'A beginner-friendly Python editor with a shell. It can talk to a MicroPython or CircuitPython board over a serial port and copy files to it.' },
    { term: 'mpremote', also: ['micropython remote'], def: 'The official MicroPython command-line tool: it opens the prompt, runs and copies files and installs packages on a board connected by serial or USB.' },
    { term: 'Soft reset', also: ['Ctrl+D'], def: 'Restarting the MicroPython interpreter without resetting the chip: memory is cleared and boot.py and main.py run again. A hard reset restarts the whole chip.' }
  ],
  choose: {
    good: ['Experiments where you want to try a line and see the result at once', 'Teaching, with a prompt instead of a compile cycle', 'Small programs that wait on sensors and networks more than they calculate'],
    avoid: ['A chip with no official build, such as the ESP32-C61 at the time of writing', 'Tight timing loops, audio and fast protocols in pure Python', 'Memory-hungry programs on chips with little RAM'],
    check: ['That a build exists for your chip and its offset', 'That the libraries you need are in the firmware or in micropython-lib', 'Whether the board has PSRAM, for which a matching build exists']
  },
  code: [
    {
      title: 'boot.py and main.py: two files, one program',
      about: 'boot.py runs first and sets the hardware to a known state; main.py then runs the program. They play the parts of setup() and loop() in an Arduino sketch.',
      needs: 'An ESP board with MicroPython installed, and the LED on GPIO2 (change the pin to match your board).',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set pin (2) to [LOW v]
          print [boot done]
        forever
          toggle pin (2)
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        bool ledOn = false;

        void setup() {                         // like boot.py: runs once
          Serial.begin(115200);
          pinMode(2, OUTPUT);
          digitalWrite(2, LOW);                // LED off, whatever it did before
          Serial.println("boot done");
        }

        void loop() {                          // like main.py: the program
          ledOn = !ledOn;
          digitalWrite(2, ledOn);
          delay(500);
        }
      `,
      py: String.raw`
        # ---- boot.py: runs first, once per start ----
        from machine import Pin

        Pin(2, Pin.OUT).value(0)               # LED off, whatever it did before
        print("boot done")

        # ---- main.py: runs next; it needs its own imports ----
        from machine import Pin
        import time

        led = Pin(2, Pin.OUT)
        while True:
            led.toggle()
            time.sleep_ms(500)
      `,
      output: `
        boot done
      `,
      notes: ['Copy each file with `mpremote fs cp boot.py :boot.py`, then `mpremote fs cp main.py :main.py + soft-reset`.', 'Give each file its own imports: do not rely on names that boot.py defined.', 'main.py never ends. Stop it with Ctrl+C at the prompt.']
    }
  ],
  quiz: [
    { q: 'You want MicroPython on an ESP32-S3. At which offset does the firmware image go?', choices: ['0x1000', '0', '0x2000', '0x8000'], a: 1, why: 'The S3 (like the C3, C6, C2 and H2) starts its image at 0. The original ESP32 and the S2 use 0x1000; the C5 and P4 use 0x2000.' },
    { q: 'main.py contains a loop that never ends, and the prompt will not appear. What gets it back?', choices: ['Unplugging the board for ever', 'Pressing Ctrl+C', 'Flashing the firmware again', 'Waiting five minutes'], a: 1, why: 'Ctrl+C raises an interrupt that stops the running program and returns the prompt. Re-flashing is never needed for this.' },
    { q: 'Typing led.value(1) at the MicroPython prompt needs the file to be copied to the chip first.', a: false, why: 'The REPL runs a line as soon as you press Enter. Only programs you want to run at every start need to be saved as files, usually main.py.' },
    { q: 'What is the difference between Ctrl+D and a hard reset?', choices: ['None', 'Ctrl+D restarts the interpreter and runs boot.py and main.py again, without restarting the chip', 'Ctrl+D erases the flash', 'A hard reset keeps the variables'], a: 1, why: 'A soft reset clears the interpreter\'s memory and starts the files again. A hard reset restarts the whole chip, including the boot ROM and the radio.' }
  ],
  applications: [
    'Classrooms where students try ideas at the prompt without installing a compiler.',
    'Quick sensor experiments, where a few lines read a part and print the value.',
    'Small devices that are updated by copying a file, not by re-flashing.',
    'Prototypes later moved to C++ once the idea works ([[translating-between-languages]]).'
  ],
  sources: [
    'MicroPython documentation, "Quick reference for the ESP32" and "Getting started with MicroPython on the ESP32".',
    'MicroPython documentation, "mpremote" command-line tool.',
    'Espressif, esptool documentation: write-flash and erase-flash (version 5).'
  ],
  sim: [{ id: 'ts-build-pipeline', params: { lang: 'py' } }, { id: 'ts-repl-upload', params: { focus: 'micropython' } }]
},

/* ================================================================ CircuitPython */
{
  id: 'circuitpython-on-esp',
  parent: 'toolchains-and-setup',
  title: 'CircuitPython on ESP boards',
  level: 2,
  short: 'Adafruit\'s learner-friendly Python: the board appears as a USB drive, you save code.py and it runs. Stable on the ESP32-S2 and S3, beta or alpha on the others; a different library world from MicroPython.',
  keywords: ['CircuitPython', 'CIRCUITPY', 'code.py', 'settings.toml', 'UF2', 'Adafruit', 'library bundle', 'circup', 'board module', 'digitalio', 'auto-reload', 'Mu', 'Thonny'],
  prereq: ['choosing-a-framework', 'micropython-setup'],
  related: ['flashing-and-esptool', 'usb-on-the-esp', 'usb-device-hid-cdc-msc', 'libraries-and-imports', 'translating-between-languages'],
  body: `CircuitPython is Adafruit's friendly fork of MicroPython, made for learners. Plug the board in and it shows up as a USB drive called CIRCUITPY. You edit \`code.py\` on that drive with any editor, save, and the board restarts and runs it. There is no upload step between ideas and no port to choose.

### Which chips

The drive trick needs a chip that can be a USB device, and that shapes the status. At the time of writing (CircuitPython 10.3) the **ESP32-S2** and **ESP32-S3** are stable. The ESP32 and ESP32-C3 are beta: they have no USB drive, and the prompt comes over a serial link. The C2, C6, H2 and P4 are alpha. Many boards ship with CircuitPython or a UF2 bootloader, into which the firmware is copied like a file on a drive; for others the firmware is written with esptool or a browser installer ([[flashing-and-esptool]]).

### What lives on the drive

| File or folder | What it is for |
|---|---|
| \`code.py\` | The program, run at start-up and again after every save |
| \`boot.py\` | Runs once at power-up, before USB starts; it can hide the drive or change settings |
| \`settings.toml\` | Settings and secrets, such as a Wi-Fi name and password, read by the program |
| \`lib/\` | Libraries, usually single .mpy files from Adafruit's library bundle |

~~~python
import time
import board
import digitalio

led = digitalio.DigitalInOut(board.LED)    # pins have names: dir(board) lists them
led.direction = digitalio.Direction.OUTPUT

while True:
    led.value = True
    time.sleep(0.5)
    led.value = False
    time.sleep(0.5)
~~~

### How it differs from MicroPython

Both are Python on the chip, so the language is the same; the **libraries are not**. CircuitPython has no \`machine\` module. Pins are objects from \`board\`, driven through \`digitalio\`, \`analogio\`, \`busio\` and \`pwmio\`, the same on every maker's boards, so a driver for a sensor runs on any board with I2C. MicroPython reaches the chip's own peripherals more directly and has more ESP-specific features. A program for one needs porting to the other.

### Cautions

Saving restarts the program, so a half-finished file runs half-finished. While the computer has the drive mounted, the board's own code cannot write to it unless \`boot.py\` changes that. The LED may be \`board.LED\`, \`board.IO2\` or only a \`board.NEOPIXEL\`: look in \`dir(board)\`.

> [!key] CircuitPython turns the board into a drive: save code.py and it runs. It is stable on the ESP32-S2 and S3, and its libraries differ from MicroPython's.`,
  ideas: [
    'The board appears as a CIRCUITPY drive; saving code.py restarts and runs it.',
    'At the time of writing CircuitPython is stable on the ESP32-S2 and S3, beta on the ESP32 and C3, alpha on the C2, C6, H2 and P4.',
    'Pins are named objects from the board module and driven through digitalio, analogio and similar modules.',
    'It is not interchangeable with MicroPython: there is no machine module and the libraries differ.'
  ],
  pitfalls: [
    'Every ESP board gets a CIRCUITPY drive — The drive needs a USB device function, which the S2 and S3 have. On the ESP32 and C3 the prompt comes over a serial link and files are copied with a tool.',
    'CircuitPython and MicroPython programs are interchangeable — The language is shared, but pins, buses and libraries are not. import machine fails on CircuitPython.',
    'Saving a file is harmless — It restarts the running program at once, so save only when the file is in a state you want to run.'
  ],
  terms: [
    { term: 'CIRCUITPY', also: ['the drive', 'USB drive'], def: 'The name of the small drive a CircuitPython board presents over USB. Its files are the program and its libraries, and saving one restarts the board.' },
    { term: 'code.py', also: ['main.py', 'code.txt'], def: 'The file CircuitPython runs at start-up and after every save. The program lives here; boot.py is only for settings applied before USB starts.' },
    { term: 'settings.toml', also: ['secrets'], def: 'A plain-text file of settings and secrets, such as the Wi-Fi name and password, which a CircuitPython program reads instead of holding them in its own code.' },
    { term: 'UF2', also: ['UF2 bootloader', 'TinyUF2'], def: 'A file format and a bootloader that let a board accept new firmware by copying one file to a drive that appears in download mode.' },
    { term: 'Library bundle', also: ['Adafruit CircuitPython Library Bundle', 'circup'], def: 'Adafruit\'s collection of ready libraries for sensors, displays and more, copied into the drive\'s lib folder. The circup tool installs and updates them.' }
  ],
  choose: {
    good: ['Teaching and workshops: save a file and see it run', 'ESP32-S2 and S3 boards, where the drive and USB features work', 'Adafruit and other sensors that have CircuitPython drivers'],
    avoid: ['Chips where support is beta or alpha, for anything important', 'Programs that need ESP-specific features such as ESP-NOW tuning beyond what the build offers', 'Code you intend to share with MicroPython users'],
    check: ['The status of your chip in the current release', 'That a driver library exists for each part', 'That the board has a UF2 bootloader or a documented install method']
  },
  quiz: [
    { q: 'Why does an ESP32-S3 board show a CIRCUITPY drive while a plain ESP32 board does not?', choices: ['The S3 has more flash', 'The S3 can act as a USB device; the original ESP32 has no USB function', 'The S3 has Bluetooth Classic', 'Only the S3 has Wi-Fi'], a: 1, why: 'A drive needs the chip itself to speak USB as a device. The S2 and S3 can; the original ESP32 and the C3 cannot be a drive.' },
    { q: 'What happens when you save code.py on the CIRCUITPY drive?', choices: ['Nothing until the board is reset by hand', 'The board restarts and runs it', 'The board erases boot.py', 'The file is uploaded to the cloud'], a: 1, why: 'CircuitPython watches the drive and reloads when a file changes. That is its fast edit cycle, and the reason not to save half-finished work.' },
    { q: 'A CircuitPython program may begin with "from machine import Pin".', a: false, why: 'CircuitPython has no machine module. Pins come from the board module and are driven through digitalio and its relatives.' },
    { q: 'Where would a CircuitPython program normally read the Wi-Fi password from?', choices: ['settings.toml', 'boot.py only', 'The lib folder', 'The chip\'s eFuses'], a: 0, why: 'settings.toml holds settings and secrets for the program to read, so the password need not be written into code you might share.' }
  ],
  applications: [
    'Classroom boards where students edit one file on a drive and see the change within a second.',
    'Quick sensor and display projects using Adafruit\'s library bundle.',
    'USB gadgets such as keyboards and MIDI devices on the ESP32-S2 and S3.',
    'Prototypes built on a QT Py or Feather board, moved to other chips later.'
  ],
  sources: [
    'Adafruit, CircuitPython documentation and the Espressif port README (supported chips and their status).',
    'Adafruit, "Welcome to CircuitPython" guide: the CIRCUITPY drive, code.py, boot.py and settings.toml.',
    'Adafruit CircuitPython Library Bundle documentation and the circup tool.'
  ],
  sim: { id: 'ts-repl-upload', params: { focus: 'circuitpython' } }
},

/* ================================================================ blocks */
{
  id: 'block-programming-tools',
  parent: 'toolchains-and-setup',
  title: 'Programming with blocks',
  level: 1,
  short: 'Blocks show the structure of a program with no syntax to trip on. Some tools turn them into C++ or MicroPython, others run them live on the chip. Our block notation is a teaching notation; each real tool names its blocks its own way.',
  keywords: ['blocks', 'Scratch', 'Blockly', 'UIFlow', 'MicroBlocks', 'Mixly', 'visual programming', 'block editor', 'live programming', 'drag and drop', 'block notation', 'block lab'],
  prereq: ['choosing-a-framework', 'first-program-blink'],
  related: ['uiflow', 'translating-between-languages', 'setup-loop-and-main', 'micropython-setup', 'readable-code'],
  body: `A block editor lets you build a program by snapping shaped pieces together, as in Scratch: no semicolons to forget, no spelling to get wrong, and the structure — which blocks are inside the loop, which belong to the \`if\` — is visible at a glance. That is why blocks are where many people meet programming, and why this app shows every program as blocks first.

### Two kinds of block tool

Some tools **generate code**: you drag blocks, the editor writes C++ or MicroPython, and that text is built and uploaded like any other. Others run the blocks **live**: a small virtual machine on the chip carries them out as you edit. You feel the difference in use. Generated code is as fast as the language it produces and can be taken out of the tool. A live system answers in a blink, but works only on boards whose firmware it has installed, and runs at the speed of its virtual machine.

### Tools you will meet

- **UIFlow** is M5Stack's environment: UIFlow 2 generates MicroPython and runs it on M5Stack devices ([[uiflow]]).
- **MicroBlocks** is a live environment: blocks run on a small virtual machine on the board, so a change takes effect the moment you make it. It supports the ESP32 among other boards, and has libraries of ready blocks for sensors and displays.
- **Blockly-based editors**, such as Mixly, turn blocks into Arduino-style C++ or MicroPython for the usual toolchain. Their support for current chips and cores varies, so check that a project is still maintained.

Each tool names and shapes its blocks its own way, and none uses exactly the notation of this app. Ours is a **teaching notation**: it shows a program's structure in the manner of Scratch so that you can read the same program in three languages. [The block lab](#/tools/blocklab) lets you build programs in it and see the C++ and MicroPython they correspond to.

### Where blocks run out

Blocks are at their best for a dozen to a few dozen of them. A program of hundreds becomes a sprawl you scroll through. Libraries, interrupts and fine control of timing and memory are awkward to express, and debugging happens in the generated text, not in the blocks. The usual path is to learn the shapes in blocks and move to text with the same structure ([[translating-between-languages]]).

> [!key] Blocks make structure visible and remove syntax errors; some tools generate text, others run live on the chip. The notation here is a teaching notation, and real tools differ — learn the structure, then carry it to text.`,
  ideas: [
    'Blocks show structure — what is inside the loop or the condition — and remove syntax errors.',
    'Some block tools generate C++ or MicroPython; others run the blocks live on a virtual machine on the board.',
    'UIFlow 2 (M5Stack) generates MicroPython; MicroBlocks runs live on the ESP32 and other boards.',
    'The notation in this app is a teaching notation: every real tool names and shapes its blocks its own way.'
  ],
  pitfalls: [
    'Block programs are not real programming — The structure is exactly that of text code: sequence, choice, repetition and variables. What blocks remove is the typing, not the thinking.',
    'All block tools work alike — Some generate text and some run live, and each has its own blocks and its own boards. A program from one tool does not load in another.',
    'Blocks scale to any size — They stay clear for a few dozen blocks; large programs become hard to navigate, and that is the time to move to text.'
  ],
  terms: [
    { term: 'Block programming', also: ['visual programming', 'block editor'], def: 'Building a program by joining shaped blocks on screen, where the shapes show what can go inside what. Scratch made the style popular.' },
    { term: 'Blockly', also: ['Google Blockly'], def: 'An open-source library for block editors. Many tools for microcontrollers are built on it, and they use it to generate text code such as C++ or Python.' },
    { term: 'Live programming', also: ['live coding'], def: 'Editing a program while it runs on the board, with changes taking effect at once. MicroBlocks works this way, through a virtual machine on the chip.' },
    { term: 'Code generation', also: ['generated code'], def: 'Turning blocks into ordinary source text, which is then compiled or interpreted as any other. The generated text is usually shown and can be copied out.' },
    { term: 'Teaching notation', also: ['block notation'], def: 'The block-style text this app uses to show a program\'s structure next to the C++ and MicroPython versions. It is not the language of any one tool.' }
  ],
  choose: {
    good: ['Learning the structure of programs, with no syntax to remember', 'Workshops and demonstrations that need a result in minutes', 'Small programs of a dozen to a few dozen blocks'],
    avoid: ['Programs of hundreds of blocks', 'Work that needs interrupts, careful timing or libraries the tool lacks', 'Choosing a tool that does not support your board or chip'],
    check: ['That the tool supports your exact board', 'Whether it generates text you can take away or runs only inside itself', 'That the tool is maintained and follows current chips']
  },
  code: [
    {
      title: 'Traffic light: three LEDs in turn',
      about: 'The classic block exercise: red, green, amber, round and round. Read it as blocks first; the C++ and MicroPython are the same shape with the syntax added.',
      needs: 'An ESP32 DevKit, three LEDs and three 220 Ω resistors.',
      wiring: [['GPIO25', '220 Ω → red LED → GND'], ['GPIO26', '220 Ω → amber LED → GND'], ['GPIO27', '220 Ω → green LED → GND']],
      blocks: `
        when started
          set pin (25) as [output v]
          set pin (26) as [output v]
          set pin (27) as [output v]
        forever
          set pin (25) to [HIGH v]    // red
          wait (3) seconds
          set pin (25) to [LOW v]
          set pin (27) to [HIGH v]    // green
          wait (3) seconds
          set pin (27) to [LOW v]
          set pin (26) to [HIGH v]    // amber
          wait (1) seconds
          set pin (26) to [LOW v]
        end
      `,
      cpp: String.raw`
        const int RED = 25, AMBER = 26, GREEN = 27;

        void setup() {
          pinMode(RED, OUTPUT);
          pinMode(AMBER, OUTPUT);
          pinMode(GREEN, OUTPUT);
        }

        void loop() {
          digitalWrite(RED, HIGH);   delay(3000);
          digitalWrite(RED, LOW);
          digitalWrite(GREEN, HIGH); delay(3000);
          digitalWrite(GREEN, LOW);
          digitalWrite(AMBER, HIGH); delay(1000);
          digitalWrite(AMBER, LOW);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        red = Pin(25, Pin.OUT)
        amber = Pin(26, Pin.OUT)
        green = Pin(27, Pin.OUT)

        while True:
            red.value(1)
            time.sleep(3)
            red.value(0)
            green.value(1)
            time.sleep(3)
            green.value(0)
            amber.value(1)
            time.sleep(1)
            amber.value(0)
      `,
      notes: ['Each LED needs its own resistor; at 3.3 V a 220 Ω resistor gives a few milliamps, which is fine for a GPIO ([[leds]]).', 'The three waits are blocking delays, as in the first program: nothing else runs during them. See [[non-blocking-timing]] and [[state-machines|state machines]] for the next step.']
    }
  ],
  quiz: [
    { q: 'Which block tool runs its blocks live, on a virtual machine on the board, so that a change takes effect as you make it?', choices: ['MicroBlocks', 'arduino-cli', 'esptool', 'ESP-IDF'], a: 0, why: 'MicroBlocks keeps a small virtual machine on the board and sends it the edited blocks. Tools that generate code must build and upload again.' },
    { q: 'The blocks in this app are exactly the blocks of UIFlow.', a: false, why: 'The block notation here is a teaching notation. Each real tool, UIFlow included, names and shapes its blocks in its own way.' },
    { q: 'Which is a real limit of block programming?', choices: ['Blocks cannot loop', 'Programs of hundreds of blocks become hard to navigate', 'Blocks cannot read pins', 'Blocks only work offline'], a: 1, why: 'Blocks make small programs very clear. Past a few dozen they sprawl, and text with functions and files scales better.' },
    { q: 'What do code-generating block tools add compared with live ones?', choices: ['Text code you can take away and build elsewhere', 'Faster editing', 'Support for every board', 'No need for a chip'], a: 0, why: 'A generating tool writes ordinary C++ or MicroPython, so the result can leave the tool. A live tool keeps your program inside its own environment.' }
  ],
  applications: [
    'Introductory workshops where beginners control a light or a motor in the first hour.',
    'Demonstrations of an idea before it is written as text.',
    'Teaching the structure of programs — sequence, choice, repetition — before any syntax.',
    'Handheld and screen devices such as M5Stack, whose own environment is block-based.'
  ],
  sources: [
    'M5Stack documentation, UIFlow 2 (blocks and MicroPython for M5 devices).',
    'MicroBlocks documentation: boards supported, the virtual machine and live editing.',
    'Google, Blockly documentation: code generators for other languages.'
  ]
},

/* ================================================================ flashing */
{
  id: 'flashing-and-esptool',
  parent: 'toolchains-and-setup',
  title: 'Flashing and esptool',
  level: 2,
  short: 'Uploading writes a binary into the chip\'s flash through a bootloader built into its ROM. esptool does the talking; the offsets depend on the chip and on what is being written.',
  keywords: ['esptool', 'flash', 'write-flash', 'erase-flash', 'flash-id', 'chip-id', 'merge-bin', 'offset', 'bootloader', 'download mode', 'merged binary', 'baud', 'boot_app0', 'esptool 5', 'read-flash', 'web flasher'],
  prereq: ['boot-modes-and-download-mode', 'strapping-pins', 'arduino-ide-and-the-esp32-core'],
  related: ['web-flashing', 'usb-serial-bridges-and-auto-reset', 'upload-problems', 'partition-tables', 'micropython-setup', 'drivers-and-serial-ports', 'factory-programming', 'ota-updates'],
  body: `"Uploading" a program means writing it into the chip's flash memory. The program cannot do that for itself, so the chip has help in its ROM: a small **serial bootloader** that listens on UART0 or the USB port and accepts commands to read, erase and write flash. The computer talks to it with **esptool**, the tool behind every uploader in this topic: the Arduino IDE, PlatformIO, \`idf.py flash\` and the browser flashers all run it or speak its protocol.

### Getting in: download mode

The ROM offers its bootloader only when asked, by the boot pin held low as reset is released ([[strapping-pins]], [[boot-modes-and-download-mode]]). A board with an auto-reset circuit does this for you ([[usb-serial-bridges-and-auto-reset]], and the simulation below); on others hold BOOT, tap RESET, release BOOT. Chips with built-in USB do it inside the USB block.

### What goes where

Flash is a strip of bytes, and each piece of software goes at an **offset** the ROM and the bootloader expect. The first offset belongs to the chip: **0x1000** on the ESP32 and S2, **0** on the C3, C6, S3, C2 and H2, **0x2000** on the C5 and P4. An Arduino or ESP-IDF build writes four pieces: the bootloader at that first offset, the partition table at 0x8000, a small file \`boot_app0\` at 0xe000 (it lives in the otadata partition and says which app slot to start), and the application at 0x10000. A MicroPython download is a single merged file for the first offset.

~~~sh
esptool --chip esp32 --port COM3 --baud 460800 write-flash 0x1000 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 app.bin
esptool --port COM3 flash-id         # the flash maker and its size
esptool --port COM3 erase-flash      # blank everything, saved settings and files included
esptool --chip esp32 merge-bin -o merged.bin 0x1000 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 app.bin
~~~

A **merged binary** joins the pieces, gaps filled, into one file that is written at the first offset. It is the form for production and for browser flashers ([[web-flashing]]).

### Speed and trouble

The ROM first talks at 115200 baud, then esptool switches to the \`--baud\` you gave, often 460800 or 921600. A long or cheap cable may fail at the higher rate: lower it. Over built-in USB the speed is USB's own and the baud setting is ignored. \`erase-flash\` empties everything, including saved Wi-Fi credentials, but never the eFuses. esptool 5 spells its commands with hyphens; the older underscore forms still work with a warning.

> [!key] esptool writes pieces to offsets through the ROM bootloader. The first offset depends on the chip, an Arduino build writes four pieces and MicroPython one, and download mode is entered by the boot pin at reset.`,
  ideas: [
    'The chip\'s ROM holds a serial bootloader; esptool speaks to it to erase, read and write flash.',
    'Download mode is entered by holding the boot pin low as reset is released, by hand or by an auto-reset circuit.',
    'The first flash offset depends on the chip; an Arduino build writes bootloader, partition table, boot_app0 and application at fixed offsets.',
    'A merged binary joins the pieces into one file for the first offset; erase-flash wipes everything except the eFuses.'
  ],
  pitfalls: [
    'Flashing replaces only my sketch — It also rewrites the bootloader and partition table, and with erase-flash it empties the saved settings and file system as well.',
    'The offsets are the same on every chip — The first offset is 0x1000, 0 or 0x2000 depending on the chip. A firmware image written at the wrong one gives a board that does not boot.',
    'A higher baud rate is always better — On a long or cheap cable it makes uploads fail. Lower it, or use a native-USB board, where the baud setting does nothing.'
  ],
  terms: [
    { term: 'esptool', also: ['esptool.py', 'Espressif flash tool'], def: 'Espressif\'s command-line program that talks to the chip\'s ROM bootloader to read, write and erase flash, and to read chip information. Other tools run it for you.' },
    { term: 'Offset', also: ['flash address'], def: 'The position in flash, counted in bytes from the start, at which a binary is written. The bootloader, partition table and application each have their own.' },
    { term: 'Merged binary', also: ['merged image', 'factory image'], def: 'One file that holds the bootloader, partition table and application at their offsets, with the gaps filled, so that the whole firmware is written in a single step.' },
    { term: 'Serial bootloader', also: ['ROM bootloader', 'download mode'], def: 'The program in the chip\'s ROM that, when the boot pin is low at reset, waits for commands over UART or USB to write flash instead of running the stored program.' },
    { term: 'boot_app0', also: ['otadata initial image'], def: 'A small file written at 0xe000 that starts the otadata partition in a state that selects the first application slot. Arduino builds flash it with the other pieces.' }
  ],
  formulas: [
    {
      name: 'Time on the wire for an upload',
      expr: 't = k*n/B',
      tex: 't = \\frac{k\\,n}{B}',
      vars: {
        t: { name: 'time on the wire', q: 'time', unit: 's' },
        k: { name: 'bits per byte (start, 8 data, stop)', value: 10, fixed: true },
        n: { name: 'image size in bytes', q: 'count', unit: '', value: 1000000, int: true },
        B: { name: 'baud rate', q: 'datarate', unit: 'baud', value: 460800 }
      },
      solveFor: 't',
      note: 'An upper bound for a UART: esptool compresses the image in transit, so real uploads are often faster, and built-in USB is not limited by the baud setting.',
      stories: { t: 'An image of {n} bytes goes over a UART at {B}. At most how long does the wire take?' }
    }
  ],
  choose: {
    good: ['esptool for first flashes, recovery and scripts', 'The IDE or idf.py for everyday uploads of your own builds', 'A merged binary for production and browser flashing', 'flash-id before trusting a board\'s advertised memory'],
    avoid: ['Writing a MicroPython image at an Arduino offset, or the other way round', 'The highest baud rate on a long, thin cable', 'erase-flash on a device that holds data you need'],
    check: ['The first offset of your chip', 'That the board enters download mode, by hand or by circuit', 'That the port is free: the serial monitor holds it open']
  },
  code: [
    {
      title: 'Print the partitions the chip is really running',
      about: 'Lists every partition in the table that was written to flash: its name, type, offset and size. It shows the result of flashing, without a computer tool.',
      needs: 'Any ESP32-family board and a serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [p v] in (partitions in flash)
            print (join (label of (p)) [ at ] (address of (p)) [ size ] (size of (p)))
          end
      `,
      cpp: String.raw`
        #include "esp_partition.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);                                    // give the monitor time to open
          esp_partition_iterator_t it = esp_partition_find(ESP_PARTITION_TYPE_ANY, ESP_PARTITION_SUBTYPE_ANY, NULL);
          while (it != NULL) {
            const esp_partition_t *p = esp_partition_get(it);
            Serial.printf("%-9s %-4s at 0x%06x size 0x%06x\n", p->label,
                          p->type == ESP_PARTITION_TYPE_APP ? "app" : "data",
                          (unsigned)p->address, (unsigned)p->size);
            it = esp_partition_next(it);
          }
          esp_partition_iterator_release(it);
        }

        void loop() {}
      `,
      py: String.raw`
        from esp32 import Partition

        for kind, name in ((Partition.TYPE_APP, "app"), (Partition.TYPE_DATA, "data")):
            for p in Partition.find(kind):
                t, subtype, addr, size, label, encrypted = p.info()
                print("%-9s %-4s at 0x%06x size 0x%06x" % (label, name, addr, size))
      `,
      output: `
        nvs       data at 0x009000 size 0x005000
        otadata   data at 0x00e000 size 0x002000
        app0      app  at 0x010000 size 0x140000
        app1      app  at 0x150000 size 0x140000
        spiffs    data at 0x290000 size 0x160000
        coredump  data at 0x3f0000 size 0x010000
      `,
      notes: ['The output is the default scheme of the Arduino core on a 4 MB ESP32. MicroPython\'s own table has other names (nvs, phy_init, factory, vfs), and the Python version lists the apps first, then the data partitions.', 'Compare with the offsets above: otadata at 0xe000 is where boot_app0 is written.']
    }
  ],
  quiz: [
    { q: 'At which offset does the bootloader go on an ESP32-C3?', choices: ['0x1000', '0', '0x2000', '0x10000'], a: 1, why: 'The C3 (like the S3, C6, C2 and H2) starts at 0. The original ESP32 and S2 start at 0x1000, and the C5 and P4 at 0x2000.' },
    { q: 'What does esptool talk to on the chip?', choices: ['Your sketch', 'A serial bootloader in the chip\'s ROM', 'The Wi-Fi stack', 'An eFuse'], a: 1, why: 'The ROM contains a bootloader that, in download mode, accepts commands to read, erase and write flash. Your own program is not involved.' },
    { q: 'erase-flash also clears the chip\'s eFuses.', a: false, why: 'eFuses are one-time-programmable bits and cannot be erased. erase-flash blanks the flash: program, file system and saved settings, but not the eFuses.' },
    { q: 'Uploads over a long, thin USB-serial cable fail at 921600 baud but work at 115200. What is the sensible fix?', choices: ['Replace the chip', 'Lower the upload baud rate or use a shorter, better cable', 'Erase the eFuses', 'Use a larger sketch'], a: 1, why: 'A slow rate tolerates a poor cable. The cost is time: at 115200 baud the wire carries about 11.5 KB a second at most.' }
  ],
  applications: [
    'Recovering a board whose firmware no longer starts, by erasing and writing again.',
    'Factory programming: one merged binary per board type, written in a single step.',
    'Putting MicroPython or CircuitPython onto a board for the first time.',
    'Checking a board\'s real flash size with flash-id before trusting the label.'
  ],
  sources: [
    'Espressif, *esptool documentation*: commands, boot mode selection and the version 5 migration guide.',
    'Espressif, *ESP-IDF Programming Guide*, "Partition Tables" and "Bootloader".',
    'Arduino core for ESP32 documentation: the files an upload writes and their offsets.'
  ],
  sim: ['ts-flash-image', 'ts-auto-reset']
},

/* ================================================================ drivers and ports */
{
  id: 'drivers-and-serial-ports',
  parent: 'toolchains-and-setup',
  title: 'Drivers and serial ports',
  level: 1,
  short: 'The computer sees an ESP board as a serial port. A bridge chip or the chip\'s own USB makes it; a driver, a data cable and the right permissions let you use it. Most "board not detected" problems are one of those three.',
  keywords: ['driver', 'COM port', 'CP2102', 'CP210x', 'CH340', 'CH9102', 'CH343', 'FTDI', 'USB serial', 'native USB', 'ttyUSB0', 'ttyACM0', 'dialout', 'brltty', 'charge-only cable', 'port not found', 'USB CDC'],
  prereq: ['choosing-a-framework', 'chip-module-board'],
  related: ['usb-serial-bridges-and-auto-reset', 'usb-serial-adapters', 'flashing-and-esptool', 'upload-problems', 'usb-on-the-esp', 'the-serial-monitor', 'board-menu-options'],
  body: `A computer sees an ESP board as a **serial port**: a name such as COM5, /dev/ttyUSB0 or /dev/cu.usbserial-0001 that programs open to upload code and read text. How that port comes into existence depends on how the board's USB connector is wired, and most "board not detected" problems come down to one of three things: no driver, a cable with no data wires, or a port that exists but that your user may not open.

### Two ways to a port

- **A USB-to-UART bridge chip** on the board turns USB into the serial signals of the ESP's UART0. The common ones are Silicon Labs' **CP210x** (CP2102, CP2104), WCH's **CH340** and its newer relatives **CH343** and **CH9102**, and FTDI's chips. The bridge is a separate device with its own driver, and it also drives the auto-reset circuit.
- **Native USB** is the ESP chip itself speaking USB, with no bridge. The C3, C6, S3 and several others have a fixed **USB Serial/JTAG** function, a serial port plus a debugger; the S2 and S3 can also be a full USB device through **USB OTG**: a serial port, keyboard or drive, as the program says. Current systems need no vendor driver for it, but its port **comes and goes**: it vanishes when the chip resets, returns sometimes under a new number, and in download mode is a different device from the running program.

### What the port is called

| System | Through a bridge | Native USB |
|---|---|---|
| Windows | COM3, COM4… under *Ports (COM & LPT)* in Device Manager | The same, usually named "USB Serial Device" |
| macOS | \`/dev/cu.usbserial-…\` (or \`cu.SLAB_USBtoUART\`, \`cu.wchusbserial…\` with a vendor driver) | \`/dev/cu.usbmodem…\` |
| Linux | \`/dev/ttyUSB0\` | \`/dev/ttyACM0\` |

On macOS use the \`cu.\` name, not \`tty.\`.

### When nothing appears

1. **The cable.** Many cables carry power only. If plugging in makes no new port, try another cable first, and keep one known-good data cable on the bench.
2. **The driver.** Windows and Linux recognise most bridges by themselves; the CH34x and CP210x families occasionally need the maker's driver, especially on macOS or an older system. Take it from the chip maker.
3. **Permissions on Linux.** The port belongs to a group, usually \`dialout\` (\`uucp\` on Arch). Add yourself and log in again: \`sudo usermod -aG dialout $USER\`. On some distributions the braille service \`brltty\` grabs CH340 devices the moment they appear; removing it frees the port.
4. **Another program holds the port.** Only one program can open it. Close the serial monitor before uploading.

> [!key] A port comes from a bridge chip or from the chip's own USB. If none appears, suspect the cable first, then the driver, then permissions; and remember that a native-USB port disappears and reappears when the chip resets.`,
  ideas: [
    'A serial port comes either from a USB-to-UART bridge chip on the board or from the ESP chip\'s own USB.',
    'The first suspect for "no port" is a charge-only cable; then the driver; on Linux, the dialout group.',
    'A native-USB port vanishes when the chip resets and may return under another number.',
    'Only one program can hold a port at a time: close the serial monitor before uploading.'
  ],
  pitfalls: [
    'If the board powers up, the USB cable is fine — Power uses two of the wires; data needs two more. Many cables carry power only and no port will ever appear.',
    'The port vanishing means the board has died — On native-USB chips it is normal: the USB device restarts with the chip, and the port returns, sometimes with a different name.',
    'Linux shows /dev/ttyUSB0, so any program can use it — The port belongs to a group such as dialout. Without membership the open fails with "permission denied".'
  ],
  terms: [
    { term: 'USB-to-UART bridge', also: ['USB-serial converter', 'CP2102', 'CH340', 'CH9102', 'FT232'], def: 'A small chip that turns USB into serial signals. Silicon Labs, WCH and FTDI make the common ones. Most older development boards carry one beside the ESP chip.' },
    { term: 'Native USB', also: ['built-in USB'], def: 'The ESP chip\'s own USB interface, wired straight to the connector with no bridge chip. It appears and disappears with the chip\'s own resets.' },
    { term: 'USB Serial/JTAG', also: ['USB-JTAG', 'HWCDC'], def: 'A fixed function inside the C3, C6, S3 and other chips that appears as a serial port and a debugger over the chip\'s USB pins. It cannot become a keyboard or drive.' },
    { term: 'CDC', also: ['USB CDC', 'virtual COM port', 'ACM'], def: 'The USB Communications Device Class, the standard way of presenting a serial port over USB. Native-USB chips use it, and current systems need no special driver for it.' },
    { term: 'Charge-only cable', also: ['power-only cable'], def: 'A USB cable without the two data wires. It powers a board but never produces a serial port, and is the commonest cause of a board that cannot be found.' },
    { term: 'dialout', also: ['uucp', 'serial group'], def: 'The Linux group that owns serial ports such as /dev/ttyUSB0. A user must belong to it, or to the group the distribution uses, to open the port without special rights.' }
  ],
  choose: {
    good: ['Native USB: no bridge chip, a debugger over the same cable, and on the S2 and S3 a keyboard or drive too', 'A CP2102N-class bridge: a port that survives chip resets and uploads at high speed', 'A short, thick data cable and a known-good spare'],
    avoid: ['Charge-only and very thin cables', 'Relying on a native-USB port to stay put while a program crashes and restarts', 'Hubs and long cables during first flashing'],
    check: ['Which connector on the board goes to the chip\'s USB and which to a bridge', 'That a new port appears when you plug in', 'That your user may open the port, on Linux']
  },
  code: [
    {
      title: 'Say hello, even when the port opens late',
      about: 'On a native-USB board the monitor attaches after the program has started, and early text is lost. This waits a few seconds for the port, then prints.',
      needs: 'Any ESP32-family board and a serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          repeat until <serial port is open>    // only needed on native USB
            wait (0.01) seconds
          end
          print [hello from the board]
        forever
          print (join [still here after ] ((milliseconds since start) / (1000)) [ s])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
        #if ARDUINO_USB_CDC_ON_BOOT
          // Serial is the chip's own USB port: wait up to 3 s for a program to open it
          unsigned long start = millis();
          while (!Serial && millis() - start < 3000) {
            delay(10);
          }
        #endif
          Serial.println("hello from the board");
        }

        void loop() {
          Serial.printf("still here after %lu s\n", millis() / 1000);
          delay(1000);
        }
      `,
      py: String.raw`
        import time

        print("hello from the board")
        count = 0
        while True:
            print("still here after", count, "s")
            count += 1
            time.sleep(1)
      `,
      output: `
        hello from the board
        still here after 0 s
        still here after 1 s
      `,
      notes: ['Without the wait, "hello from the board" is printed before the monitor has attached and never appears. On a board with a bridge chip the wait ends at once.', 'MicroPython keeps the port open for you: the prompt is on the same port, and a restart simply starts the file again.']
    }
  ],
  quiz: [
    { q: 'A new board produces no serial port on two different computers. What do you try first?', choices: ['Re-install the operating system', 'A different USB cable', 'Erase the eFuses', 'A different baud rate'], a: 1, why: 'Many cables carry power only. A data cable is the cheapest thing to swap, and the commonest cause of a board that cannot be found.' },
    { q: 'After a reset, the port of an ESP32-S3 with native USB disappears for a second and returns as a different COM number. Is the board faulty?', choices: ['Yes, the chip has failed', 'No: the chip itself is the USB device, and it restarts with its own reset', 'Yes, the driver is corrupt', 'Only if it happens on Linux'], a: 1, why: 'On native USB the chip is the USB device. When it resets the connection drops and is rebuilt, sometimes under another name. A bridge chip does not reset with the ESP.' },
    { q: 'On Linux, any user may open /dev/ttyUSB0.', a: false, why: 'The port belongs to a group such as dialout (uucp on some distributions). Adding yourself to it, and logging in again, is the usual fix for "permission denied".' },
    { q: 'Which of these chips has a fixed USB Serial/JTAG function on its own USB pins?', choices: ['ESP32 (original)', 'ESP32-C3', 'ESP8266', 'ESP32-C2'], a: 1, why: 'The ESP32-C3 has it, as do the C6, S3 and others. The original ESP32, the ESP8266 and the C2 have no USB of their own and rely on a bridge chip.' }
  ],
  applications: [
    'Diagnosing "my board is not detected", the commonest first-hour problem of newcomers.',
    'Choosing between a board with a bridge chip and one with native USB for a project that needs a keyboard or a debugger.',
    'Setting up a Linux workstation or classroom so every student can upload.',
    'Writing programs that behave well on both bridge and native-USB boards.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "USB Serial/JTAG Controller Console".',
    'Espressif, *ESP32-S3 Technical Reference Manual*, the USB Serial/JTAG controller chapter.',
    'USB Implementers Forum, Class Definitions for Communication Devices (CDC).'
  ],
  sim: { id: 'ts-auto-reset', params: { mode: 'terminal-rts' } }
},

/* ================================================================ serial monitor */
{
  id: 'the-serial-monitor',
  parent: 'toolchains-and-setup',
  title: 'The serial monitor',
  level: 1,
  short: 'The serial monitor is a window on the text a program prints, and a keyboard to send text back. One setting must match on both ends: the baud rate. Get it wrong and the text turns to garbage.',
  keywords: ['serial monitor', 'baud rate', 'Serial.begin', 'println', 'printf', 'garbage characters', 'line ending', 'newline', 'serial plotter', 'idf.py monitor', 'pio device monitor', 'mpremote repl', 'terminal', '115200', '9600'],
  prereq: ['arduino-ide-and-the-esp32-core', 'first-program-blink'],
  related: ['serial-communication-basics', 'uart', 'drivers-and-serial-ports', 'print-debugging-and-log-levels', 'reading-boot-messages', 'board-menu-options'],
  body: `The serial monitor is a window on the text a program sends through its console port, and a keyboard for sending text back. It is the first debugger, display and user interface of nearly every ESP project: \`Serial.println\` in Arduino, \`print\` in MicroPython, \`printf\` and \`ESP_LOGI\` in ESP-IDF all end up here. The port may be a UART behind a bridge chip or the chip's own USB; the monitor does not mind.

### One setting must match: the baud rate

A UART has no clock wire. Both ends agree beforehand how long a bit lasts, the **baud rate**, and the receiver samples each bit in the middle of that time. If the monitor expects 115200 and the program sends at 9600, the bits are read at the wrong moments and the text turns to garbage, as the simulation below shows. The cure is to set both ends to the same value; **115200** is the usual one in examples. The chip's own boot messages usually come at 115200 whatever your sketch does, so a monitor at another speed shows garbage first and perhaps readable text later. Over built-in USB there is no real baud rate and the setting does nothing.

### The monitors you have

- **Arduino IDE 2**: *Tools → Serial Monitor*, with a baud list and a line-ending list, and *Tools → Serial Plotter* for graphs.
- **ESP-IDF**: \`idf.py monitor\` (Ctrl+] leaves). **PlatformIO**: \`pio device monitor\`, which uses \`monitor_speed\`. **MicroPython**: Thonny's shell or \`mpremote repl\`. Any terminal program works as well: PuTTY, \`screen\`, \`minicom\`.

### Sending text back

What you type is sent when you press Enter, followed by the **line ending** the monitor is set to: none, newline, carriage return or both. A program that reads up to \`'\\n'\` and never sees one seems to hang; a program that compares a whole line sees a stray \`'\\r'\` and answers "unknown command". Match the setting to the program, or trim the line.

### The plotter, and the traps

The Arduino plotter draws lines of \`name:value\` pairs separated by commas, such as \`temp:21.5,hum:48\`. The traps: printing too much slows the loop, because \`print\` waits when its buffer is full; on native USB, text printed before the monitor attaches is lost; and on such a board \`Serial\` goes to the USB port only when *USB CDC On Boot* is on ([[board-menu-options]]).

> [!key] The monitor is the first window on a running program, and the baud rate on both ends must match or the text turns to garbage. Mind the line ending when sending, and the cost of printing too much.`,
  ideas: [
    'A UART has no clock, so both ends must use the same baud rate; a mismatch turns text into garbage.',
    '115200 baud is the usual choice, and it is also the speed of the chip\'s own boot messages.',
    'The line-ending setting decides what a typed line looks like to the program: none, newline, carriage return or both.',
    'Printing takes time: a byte is ten bit times on the wire, so 115200 baud carries about 11,500 characters a second.'
  ],
  pitfalls: [
    'Garbage on the monitor means the chip is damaged — It almost always means the monitor and the program use different baud rates. Match them.',
    'The baud setting matters on every kind of port — On native USB the data moves at USB speed and the baud rate is ignored; it matters only on a real UART.',
    'Printing is free — Each byte takes ten bit times. At 9600 baud a 40-character line holds the loop for about 44 ms once the buffer is full.'
  ],
  terms: [
    { term: 'Baud rate', also: ['baud', 'bits per second'], def: 'How many signal changes per second a UART sends. Both ends must use the same value, since there is no clock wire; for a plain serial line it equals the bits per second.' },
    { term: 'Serial monitor', also: ['console', 'terminal'], def: 'A program or IDE window that shows the text a board prints through its serial port and sends back what you type. The Arduino IDE has one built in.' },
    { term: 'Line ending', also: ['newline', 'carriage return', 'CR LF'], def: 'The character or pair of characters that end a line of text: newline (LF), carriage return (CR) or both. A monitor appends the chosen one when you press Enter.' },
    { term: 'Serial plotter', also: ['Arduino plotter'], def: 'A graph window in the Arduino IDE that draws the numbers a program prints, one trace for each name:value pair on a line.' },
    { term: 'Console', also: ['console port', 'UART0'], def: 'The default serial port a program prints to and the boot ROM writes its messages on. On an ESP32 it is UART0 behind the bridge chip, or the chip\'s own USB.' }
  ],
  examples: [
    {
      title: 'How long does a line of text take?',
      q: 'A sketch prints a 40-character line, 42 bytes with its line ending, on every pass of the loop. How long does the wire need for it at 9600 baud and at 115200 baud?',
      steps: ['Every byte on a UART takes 10 bit times: a start bit, 8 data bits and a stop bit. A line of 42 bytes is 420 bits.', 'At 9600 baud: $420 / 9600 = 0.044$ s, about 44 ms. At 115200 baud: $420 / 115200 = 0.0036$ s, about 3.6 ms.', 'Once the output buffer is full, `print` waits for the wire. At 9600 baud the loop can therefore not go round more than about 23 times a second; at 115200 about 270 times.'],
      a: 'About 44 ms at 9600 baud and 3.6 ms at 115200 baud. Printing every pass of a fast loop is limited by the baud rate.'
    }
  ],
  choose: {
    good: ['115200 baud for everyday work', 'Newline as the line ending for commands the program reads up to \'\\n\'', 'The plotter for quickly seeing a changing value', 'A log level and tags, instead of free-form prints, in larger programs'],
    avoid: ['9600 baud when you print a lot', 'Printing on every pass of a fast loop', 'Leaving the monitor open while uploading: it holds the port'],
    check: ['That the monitor\'s baud rate equals the program\'s', 'The line-ending setting against what the program expects', 'Which port, bridge or native USB, the board\'s Serial really uses']
  },
  code: [
    {
      title: 'A command line over serial',
      about: 'Type on, off or status in the monitor and the board answers. It shows how line endings and reading a line work.',
      needs: 'An ESP32 DevKit (LED on GPIO2) and the monitor set to 115200 baud and "Newline".',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          print [commands: on, off, status]
        forever
          if <serial has a line> then
            set [cmd v] to (read line from serial)
            if <(cmd) = [on]> then
              set pin (2) to [HIGH v]
              print [ok]
            else if <(cmd) = [off]> then
              set pin (2) to [LOW v]
              print [ok]
            else if <(cmd) = [status]> then
              print (join [LED is ] (state of pin (2) as on or off))
            else
              print (join [unknown command: ] (cmd))
            end
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;
        bool ledOn = false;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          Serial.println("commands: on, off, status");
        }

        void loop() {
          if (Serial.available()) {
            String cmd = Serial.readStringUntil('\n');
            cmd.trim();                                   // drops a stray \r
            if (cmd == "on") {
              ledOn = true;
              Serial.println("ok");
            } else if (cmd == "off") {
              ledOn = false;
              Serial.println("ok");
            } else if (cmd == "status") {
              Serial.printf("LED is %s\n", ledOn ? "on" : "off");
            } else {
              Serial.printf("unknown command: %s\n", cmd.c_str());
            }
            digitalWrite(LED_PIN, ledOn);
          }
        }
      `,
      py: String.raw`
        import sys
        import select
        from machine import Pin

        led = Pin(2, Pin.OUT)
        print("commands: on, off, status")

        poll = select.poll()
        poll.register(sys.stdin, select.POLLIN)

        while True:
            if poll.poll(10):                          # wait up to 10 ms for typed text
                cmd = sys.stdin.readline().strip()     # strip drops a stray \r
                if cmd == "on":
                    led.value(1)
                    print("ok")
                elif cmd == "off":
                    led.value(0)
                    print("ok")
                elif cmd == "status":
                    print("LED is", "on" if led.value() else "off")
                else:
                    print("unknown command:", cmd)
      `,
      output: `
        commands: on, off, status
        ok
        LED is on
        unknown command: blink
      `,
      notes: ['The output above is what the program prints after you type on, status and blink, each followed by Enter.', 'Without `cmd.trim()` a monitor set to "Both NL & CR" leaves a carriage return on the line, and "on" no longer equals "on\\r".']
    }
  ],
  quiz: [
    { q: 'A sketch calls Serial.begin(9600) and the monitor is set to 115200. What do you see?', choices: ['Normal text', 'Garbage characters', 'Nothing at all, ever', 'The text twelve times as fast'], a: 1, why: 'The monitor samples bits at the wrong moments, so it decodes the wrong characters. Changing either end to match the other restores the text.' },
    { q: 'A program compares whole lines with "on", and the monitor is set to "Both NL & CR". Typing on never works. Why?', choices: ['The LED is broken', 'A carriage return is left on the end of the line', 'The baud rate is too high', 'Serial cannot compare text'], a: 1, why: 'The line arrives as "on" followed by a carriage return. Trimming the line, or setting the monitor to Newline, makes the comparison succeed.' },
    { q: 'At 115200 baud, sending a 100-byte message takes about 8.7 ms.', a: true, why: 'Each byte is 10 bit times: 100 × 10 = 1000 bits, and 1000 / 115200 s is about 8.7 ms.' },
    { q: 'Which line makes the Arduino Serial Plotter draw two traces?', choices: ['hello world', 'temp:21.5,hum:48', '21.5', 'temp 21.5 hum 48 end'], a: 1, why: 'The plotter reads name:value pairs separated by commas (or spaces) on each line and draws a trace for each name.' }
  ],
  applications: [
    'Reading a sensor value while building a circuit, with the plotter showing how it moves.',
    'Typing commands to a device during development: on, off, calibrate, status.',
    'Reading ESP-IDF log lines and boot messages while hunting a crash.',
    'Checking from MicroPython\'s prompt that a part is wired correctly before writing the program.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, "Serial" API and the Tools menu guide (USB CDC On Boot).',
    'Arduino IDE 2 documentation: Serial Monitor and Serial Plotter.',
    'Espressif, *ESP-IDF Programming Guide*, "IDF Monitor" and the logging library.'
  ],
  sim: 'ts-baud-garbage'
},

/* ================================================================ simulators */
{
  id: 'simulators',
  parent: 'toolchains-and-setup',
  title: 'Simulators: Wokwi and QEMU',
  level: 2,
  short: 'A simulator runs your firmware on a pretend chip with pretend parts: find logic mistakes without a board, share a project as a link, run tests on a server. It cannot give you noise, power, radio or real timing.',
  keywords: ['Wokwi', 'QEMU', 'simulator', 'emulator', 'virtual breadboard', 'diagram.json', 'continuous integration', 'virtual hardware', 'no board', 'online simulator', 'wokwi-cli', 'firmware test'],
  prereq: ['choosing-a-framework', 'first-program-blink'],
  related: ['unit-testing', 'hardware-in-the-loop', 'esp-idf-basics', 'platformio', 'block-programming-tools', 'fault-finding-method'],
  body: `A simulator runs your compiled program on a pretend chip, on a computer, with pretend parts around it: an LED you can see, a button you can click, a display, a sensor with a slider. You find mistakes in logic without a board, share a project as a link, and let a build server run the same test on every change. What a simulator cannot give you is the real world: noise, timing to the microsecond, power, radio, and the strapping pins of a real board.

### Wokwi

**Wokwi** is an online simulator, also available inside VS Code, that runs the firmware you built for an ESP32-family chip. You place virtual parts on a canvas — LEDs, buttons, potentiometers, displays, NeoPixels, common sensors — and wire them to the board. It has a command-line mode, so a build server can test the firmware too. At the time of writing it supports the ESP32, S2 and S3 and the C3, C6, C61 and H2; the P4 is in beta and the C5 and S31 in alpha. Not every peripheral or radio is emulated, so read the list for your chip before betting a project on it, and test on hardware at the end.

### QEMU

**QEMU** is a general emulator. Espressif keeps its own fork that emulates some ESP32-family processors and a few peripherals. It is aimed at running the same firmware in automated tests of ESP-IDF projects, not at drawing a virtual breadboard. The set of chips and peripherals changes, so check the current documentation.

### Closer to home

[The signal lab](#/tools/signals), [the display lab](#/tools/displaylab), [the state-machine lab](#/tools/fsmlab) and [the block lab](#/tools/blocklab) in this app are not firmware simulators: they model an idea — a serial frame, a frame buffer, a state machine, a block program — so that you can explore it before taking code to a real or virtual board. Logic that does not touch hardware can also be tested on the computer alone ([[unit-testing]]).

### What to simulate, and what not

Good: logic and state machines, parsing, menus on a virtual display, timing measured in seconds, teaching and sharing, regression tests. Not good: anything about analogue noise, current draw, brownouts, antenna range, Wi-Fi congestion, strapping pins and boot behaviour, and the real accuracy of a sensor. A circuit that "works in the simulator" is a hypothesis for the bench, not a result.

> [!key] A simulator runs real firmware against virtual parts: ideal for logic, teaching, sharing and automated tests, and silent about the physical world. Treat "it works in the simulator" as a hypothesis.`,
  ideas: [
    'A simulator runs your compiled firmware on a virtual chip with virtual parts, so no board is needed to try logic.',
    'Wokwi supports most current ESP32-family chips, with different levels of completeness; QEMU is aimed at automated tests.',
    'Noise, current, antenna range, strapping pins and exact timing are not in a simulator.',
    'Logic that does not touch hardware can also be tested on the computer alone.'
  ],
  pitfalls: [
    'If it works in the simulator it will work on the board — The simulator has no noise, no brownouts, no radio problems and no strapping pins. It tests logic, and the bench still has to confirm the rest.',
    'A simulator emulates the whole chip — Not every peripheral or radio is emulated. Check the support list for your chip, and for the part you need, before relying on it.',
    'Simulators replace testing on hardware — They add early, cheap tests, and automated ones. Final tests belong on the real board in real conditions.'
  ],
  terms: [
    { term: 'Simulator', also: ['emulator'], def: 'Software that behaves like a chip and its surroundings well enough to run a program. It can show a program\'s logic at work, but cannot reproduce every physical effect.' },
    { term: 'Wokwi', also: ['Wokwi simulator'], def: 'An online and VS Code simulator for microcontrollers, including ESP32-family chips. Projects consist of firmware plus a diagram of virtual parts and wiring.' },
    { term: 'QEMU', also: ['QEMU fork', 'Espressif QEMU'], def: 'A general-purpose emulator. Espressif maintains a version that can run ESP32-family firmware, mainly for automated tests.' },
    { term: 'Continuous integration', also: ['CI', 'build server'], def: 'Automatically building and testing a project on a server whenever its code changes. Simulators let such tests run without any board attached.' },
    { term: 'Virtual part', also: ['virtual hardware'], def: 'A simulated component, such as an LED, a button or a display, that a simulator connects to the virtual chip\'s pins.' }
  ],
  choose: {
    good: ['Testing logic and state machines before hardware arrives', 'Teaching and demos that anyone can open from a link', 'Automated tests of firmware on every change', 'Reproducing a bug report without the reporter\'s board'],
    avoid: ['Judging analogue accuracy, power draw or radio range', 'Trusting a peripheral the simulator only partly emulates', 'Skipping the real-hardware test'],
    check: ['That your chip and the parts you need are supported', 'Which peripherals and radios are emulated', 'That the real pin choices still respect strapping and flash pins']
  },
  code: [
    {
      title: 'A button toggles the LED, and says so',
      about: 'A small program with everything a simulator can test: an input, an output, a state and printed text. It reacts to the press, not to the hold.',
      needs: 'An ESP32 DevKit (real or simulated), a push button, an LED and a 220 Ω resistor.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up'], ['GPIO2', '220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [input with pull-up v]
          set pin (2) as [output v]
          set [ledOn v] to <false>
          set [lastPressed v] to <false>
        forever
          set [pressed v] to <(read pin (4)) = [LOW v]>
          if <<pressed> and <not <lastPressed>>> then
            set [ledOn v] to <not <ledOn>>
            set pin (2) to (ledOn)
            print (join [LED ] (on or off for (ledOn)))
          end
          set [lastPressed v] to (pressed)
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int LED = 2;
        bool ledOn = false;
        bool lastPressed = false;

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;     // the button connects the pin to ground
          if (pressed && !lastPressed) {                 // act on the press, not on the hold
            ledOn = !ledOn;
            digitalWrite(LED, ledOn);
            Serial.println(ledOn ? "LED on" : "LED off");
          }
          lastPressed = pressed;
          delay(20);                                     // also hides contact bounce, crudely
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        button = Pin(4, Pin.IN, Pin.PULL_UP)
        led = Pin(2, Pin.OUT)
        led_on = False
        last_pressed = False

        while True:
            pressed = button.value() == 0              # the button connects the pin to ground
            if pressed and not last_pressed:           # act on the press, not on the hold
                led_on = not led_on
                led.value(led_on)
                print("LED on" if led_on else "LED off")
            last_pressed = pressed
            time.sleep_ms(20)                          # also hides contact bounce, crudely
      `,
      output: `
        LED on
        LED off
        LED on
      `,
      notes: ['Real buttons bounce for a few milliseconds; the 20 ms pause hides it here, but a simulated button usually does not bounce at all. See [[debouncing]].', 'GPIO2 is a strapping pin on the ESP32: an LED to ground there is harmless, but a simulator will not warn you if you choose a worse pin.']
    }
  ],
  quiz: [
    { q: 'What does Wokwi run?', choices: ['Your source code, interpreted line by line', 'The firmware you built, on a virtual chip with virtual parts', 'A photograph of the board', 'The Arduino IDE'], a: 1, why: 'The simulator takes the compiled firmware and runs it against an emulated chip and parts wired on its diagram.' },
    { q: 'Which question can a simulator answer least reliably?', choices: ['Does my state machine reach the right state after the button press?', 'Does the display menu show the right text?', 'Will the Wi-Fi signal reach the garden shed through two walls?', 'Does the parser reject a bad message?'], a: 2, why: 'Radio range depends on walls, antennas and interference, none of which a simulator models. Logic questions are what it answers well.' },
    { q: 'Espressif\'s QEMU fork is mainly meant for drawing virtual breadboards.', a: false, why: 'It runs firmware on an emulated processor, mostly for automated tests. Wokwi is the tool that offers virtual parts on a canvas.' },
    { q: 'A project works in a simulator. What does that show?', choices: ['That it will work on the bench unchanged', 'That the logic behaves as intended; the physical side is still to be tested', 'That the board is not needed any more', 'That the pins are chosen safely'], a: 1, why: 'Logic is what a simulator checks. Noise, power, radio and strapping behaviour need the real board.' }
  ],
  applications: [
    'Trying the logic of a program before the board arrives.',
    'Sharing a minimal example of a bug with someone who has no board.',
    'Running firmware tests on a build server for every change.',
    'Classroom exercises where every student opens the same project from a link.'
  ],
  sources: [
    'Wokwi documentation: supported hardware, and the VS Code and command-line integrations.',
    'Espressif, the QEMU fork repository (supported targets and usage).',
    'Espressif, *ESP-IDF Programming Guide*, unit testing and host-based tests.'
  ]
}
);
