/* HYPER-ESP32 · content/debugging-and-testing.js
 *
 * Topic: Debugging and testing (parent: programming). Twelve pages:
 *   print-debugging-and-log-levels · reading-boot-messages · guru-meditation-and-backtraces · watchdog-resets ·
 *   stack-overflow-and-heap-corruption · upload-problems · jtag-debugging · unit-testing · hardware-in-the-loop ·
 *   core-dumps-and-field-diagnostics · fault-finding-method · soak-and-stress-tests
 * Simulations (sims/debugging-and-testing.js): db-log-levels db-boot-log db-backtrace db-watchdog db-stack db-upload
 *   db-jtag db-bisect db-soak
 */
Hyper.add(
/* ================================================================ print-debugging-and-log-levels */
{
  id: 'print-debugging-and-log-levels',
  parent: 'debugging-and-testing',
  title: 'Printing and log levels',
  level: 1,
  short: 'The oldest debugger is a line of text on the serial monitor. With a time stamp, a tag and a level it tells you what the program did and when — and because printing costs time, how much you print matters.',
  keywords: ['print debugging', 'serial print', 'log level', 'log_e', 'log_i', 'log_d', 'ESP_LOGI', 'ESP_LOGE', 'Core Debug Level', 'tag', 'logging', 'printf', 'verbose', 'heisenbug', 'debug macro', 'logging module'],
  prereq: ['the-serial-monitor', 'setup-loop-and-main'],
  related: ['reading-boot-messages', 'guru-meditation-and-backtraces', 'fault-finding-method', 'errors-and-exceptions', 'the-logic-analyser', 'logging-data'],
  body: `A microcontroller has no screen and, usually, nobody watching. The cheapest window into it is the serial port: the program prints a line and [[the-serial-monitor|the serial monitor]] shows it. Printing is the oldest debugger there is and, used with a little discipline, often the best one: it needs no extra hardware and works on every board, in every language.

### What a useful line says

"here" and "got to 2" are the lines you regret. A useful line answers three questions: **when** (milliseconds since start), **who** (the part of the program, called a *tag*: \`wifi\`, \`sensor\`) and **what** (a value with its name and unit). \`[ 12345] I (sensor) temperature 23.4 C\` can be read a month later; \`23.4\` cannot.

### Levels

Most lines matter only while you hunt a bug. A **log level** ranks each line, so you choose how much to see without editing the program:

| Level | Letter | Use |
|---|---|---|
| Error | E | something failed and the program cannot do its job |
| Warning | W | something odd that the program coped with |
| Info | I | milestones: started, connected, sent |
| Debug | D | details for whoever is hunting a bug |
| Verbose | V | everything, on every pass |

The Arduino core has the macros \`log_e\`, \`log_w\`, \`log_i\`, \`log_d\` and \`log_v\`, and the Tools-menu setting **Core Debug Level** (None to Verbose) decides which are compiled in. The core's own libraries (Wi-Fi, I2C, SPI) print through the same macros, so raising the level to Debug shows what *they* are doing too. ESP-IDF has \`ESP_LOGE\` to \`ESP_LOGV\` with a tag, Info as the default, and a call that changes the level of one tag while the program runs. MicroPython has no logger built in: write a small function, as in the program below, or install the \`logging\` module from micropython-lib.

### The price of a print

Serial text is slow. At 115 200 baud a character takes ten bit times, about 87 µs, so a 60-character line occupies the port for over 5 ms. Print more than the port carries and the program waits in \`print\` until there is room: the loop now runs at the speed of the serial line. Print inside the very code you are timing and the bug may vanish: a *heisenbug*. Never print from an interrupt handler (the serial driver takes locks and can stall or crash there); set a flag, or put the number in a queue, and print from a task. On boards with native USB, text sent before the computer has opened the port can be lost, so wait a moment in \`setup()\`.

### Habits

- Print a banner at start: version, reset reason ([[reading-boot-messages]]).
- Keep the debug lines in the code, behind a level, instead of deleting them: the next bug will want them.
- To time a piece of code without printing, raise a spare pin around it and read the pulse width on a [[the-logic-analyser|logic analyser]] or a scope.
- A device with no cable can send its log over the network or keep the last few hundred lines in memory ([[core-dumps-and-field-diagnostics]]).

> [!key] Print with a time stamp, a tag and a level, so the detail can be turned up or down without editing the program. Printing costs time (about 87 µs a character at 115 200 baud), so never print from an interrupt and keep the chatter out of the code you are timing.`,
  ideas: [
    'A useful log line says when, who and what: a time stamp, a tag, and a named value with its unit.',
    'Log levels (error, warning, info, debug, verbose) let you change how much you see without editing the code.',
    'Printing takes time, about 87 µs a character at 115 200 baud, so chatter slows loops and can hide timing bugs.',
    'Never print from an interrupt handler: raise a flag or queue the value, and print from a task.'
  ],
  pitfalls: [
    'More prints always help — Past a point they hide the bug: each takes milliseconds, changes the timing and can fill the port so that the program waits for it. Print less, and give each line a level.',
    'Serial.print is safe anywhere in the program — Not in an interrupt handler: the serial driver takes locks and can stall or crash the chip there. Leave a flag, and print from the loop.',
    'When the bug is fixed, delete the debug prints — Keep them behind a log level: the next bug will need them, and a level costs nothing at run time (or nothing at all, when it is compiled out).'
  ],
  terms: [
    { term: 'Log level', also: ['verbosity', 'severity'], def: 'A rank given to each message — error, warning, info, debug or verbose — so that the program or the build can choose which ones are shown. A message ranked below the chosen level is skipped.' },
    { term: 'Tag', also: ['log tag'], def: 'A short name for the part of the program that wrote a log line, such as wifi or sensor. Tags let you filter the output and, in ESP-IDF, set a level for one tag alone.' },
    { term: 'Time stamp', also: ['timestamp'], def: 'The time printed at the start of a log line, usually milliseconds since the chip started. It shows the order of events and the gaps between them, which is often the whole clue.' },
    { term: 'Heisenbug', also: ['observer effect'], def: 'A fault that changes or disappears when you try to observe it — often because the observation, such as a print that takes milliseconds, alters the timing.' }
  ],
  choose: {
    good: ['Slowly changing state: connections made, decisions taken, values read once a second', 'Anything you can reproduce while watching the monitor', 'A device on your desk with a cable'],
    avoid: ['Code that runs in an interrupt or every few milliseconds', 'The very section whose timing you are measuring: a print takes milliseconds', 'Devices in the field with no cable: send the log over the network, or keep a ring buffer'],
    check: ['That the baud rate in the program and in the monitor agree', 'Whether text printed before the host connects is lost (native USB boards)', 'What the level is set to, before concluding that nothing is wrong']
  },
  code: [
    {
      title: 'Log levels and a one-line debug macro',
      about: 'A tiny logger: every line carries the time, a level letter and a tag, and lines below the chosen level are skipped. A random walk stands in for a sensor. Change the level and upload again to see more or less.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define log (level) (tag) (message) :: my
          if <(level) ≤ (LOG_LEVEL)> then
            print (join (milliseconds since start) [ ms ] (tag) [: ] (message))
          end

        when started
          start serial at (115200) baud
          set [LOG_LEVEL v] to (2)      // 0 error · 1 warning · 2 info · 3 debug
          set [raw v] to (2000)
          log (2) [boot] [starting] :: my
        forever
          set [raw v] to (round ((raw) + (random (-300) to (300))))
          log (3) [adc] (join [raw ] (raw)) :: my
          if <(raw) > (3000)> then
            log (1) [adc] [near full scale] :: my
          end
          log (2) [loop] [alive] :: my
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        enum Level { LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG };
        const char LEVEL_CHAR[] = { 'E', 'W', 'I', 'D' };
        int logLevel = LOG_INFO;                    // may be changed while the program runs

        // prints:  [   3001] W (adc) reading near full scale: 3150
        #define LOG(level, tag, fmt, ...)                                          \
          do {                                                                     \
            if ((level) <= logLevel)                                               \
              Serial.printf("[%7lu] %c (%s) " fmt "\n", millis(),                  \
                            LEVEL_CHAR[level], tag, ##__VA_ARGS__);                \
          } while (0)

        int raw = 2000;                             // stands in for a sensor

        void setup() {
          Serial.begin(115200);
          delay(1000);                              // let the monitor connect
          LOG(LOG_INFO, "boot", "starting, level %d", logLevel);
        }

        void loop() {
          raw = constrain(raw + (int)random(-300, 301), 0, 4095);
          LOG(LOG_DEBUG, "adc", "raw %d", raw);
          if (raw > 3000) {
            LOG(LOG_WARN, "adc", "reading near full scale: %d", raw);
          }
          LOG(LOG_INFO, "loop", "alive");
          delay(1000);
        }
      `,
      py: String.raw`
        import time
        import random

        ERROR, WARN, INFO, DEBUG = 0, 1, 2, 3
        LEVEL_CHAR = "EWID"
        log_level = INFO                            # may be changed while the program runs

        def log(level, tag, msg, *args):
            if level <= log_level:
                text = msg % args if args else msg
                print("[%7d] %s (%s) %s" % (time.ticks_ms(), LEVEL_CHAR[level], tag, text))

        raw = 2000                                  # stands in for a sensor
        log(INFO, "boot", "starting, level %d", log_level)
        while True:
            raw = max(0, min(4095, raw + random.randint(-300, 300)))
            log(DEBUG, "adc", "raw %d", raw)
            if raw > 3000:
                log(WARN, "adc", "reading near full scale: %d", raw)
            log(INFO, "loop", "alive")
            time.sleep(1)
      `,
      output: `
        [   1001] I (boot) starting, level 2
        [   1001] I (loop) alive
        [   2001] I (loop) alive
        [   3002] W (adc) reading near full scale: 3150
        [   3002] I (loop) alive
      `,
      notes: ['The same idea with the built-in tools: in Arduino write log_i("alive") and choose Tools → Core Debug Level → Info; in ESP-IDF write ESP_LOGI(TAG, "alive").', 'Set the level to debug and the loop prints three lines a second instead of one. Compare what that does to the timing, in the simulation.', 'The macro adds nothing to the code when the test is false except one comparison; the Core Debug Level setting removes the lines from the program altogether.']
    }
  ],
  examples: [
    {
      title: 'What does the chatter cost?',
      q: 'A control loop must run every 10 ms. Each pass prints three lines of 70 characters at 115 200 baud. Can it keep up? What about at 921 600 baud?',
      steps: ['Three lines of 70 characters, plus a two-character line end each, make $3 \\times 72 = 216$ characters per pass.', 'A character is ten bit times: $10 / 115\\,200 \\approx 86.8$ µs. So $216 \\times 86.8$ µs $\\approx 18.8$ ms per pass.', 'That is longer than the 10 ms the loop is allowed, so the loop runs at about 18.8 ms. At 921 600 baud a character takes 10.9 µs and the pass costs about 2.3 ms.'],
      a: 'No: at 115 200 baud the printing alone needs about 18.8 ms a pass. At 921 600 baud it needs 2.3 ms — or print one line in ten instead.'
    }
  ],
  quiz: [
    { q: 'A loop must run every 2 ms and prints one 60-character line on every pass at 115 200 baud. What happens?', choices: ['Nothing: printing is instant', 'The port needs about 5 ms a line, so the loop slows to about 5 ms a pass', 'Some lines are skipped to keep up', 'The chip resets'], a: 1, why: '60 characters at about 87 µs each take 5.2 ms. The port has only a small buffer, so once it is full the program waits inside the print call: the loop runs at the speed of the serial line.' },
    { q: 'It is fine to call Serial.print from an interrupt handler as long as the text is short.', a: false, why: 'The serial driver takes locks and is not made for interrupt context: it can stall or crash the chip, however short the text. Set a flag or queue the value and print from a task.' },
    { q: 'Which log line is most useful when read a month later?', choices: ['here', 'got value', '[ 84213] W (sensor) humidity 101 % out of range, ignored', '84213'], a: 2, why: 'It has a time, a level, a tag (who), a named value with its unit, and it says what the program did about it.' },
    { q: 'You set Core Debug Level to Debug in the Arduino IDE. What do you see beyond your own log_d lines?', choices: ['Nothing more', 'Debug messages from the core\'s libraries, such as Wi-Fi and I2C', 'The ROM bootloader\'s messages', 'The values of all your variables'], a: 1, why: 'The core and its libraries use the same macros, so the setting changes what they print too — often exactly the clue you need.' }
  ],
  applications: [
    'Bringing up a new sensor: print the raw bytes, then the converted value, and compare both with the datasheet.',
    'Finding why a board cannot join its Wi-Fi: raise the level to Debug and the Wi-Fi library reports the step at which it fails.',
    'Product firmware that logs at Info normally and at Debug when a technician asks for it.',
    'Timing a code section by raising a spare pin around it and reading the pulse on an analyser.'
  ],
  sources: [
    'Arduino core for ESP32 documentation: the Troubleshooting guide and the Tools-menu entry "Core Debug Level".',
    'Espressif, *ESP-IDF Programming Guide*: the Logging library (log levels, tags, per-tag levels).',
    'MicroPython documentation, micropython-lib: the logging module.'
  ],
  sim: 'db-log-levels'
},

/* ================================================================ reading-boot-messages */
{
  id: 'reading-boot-messages',
  parent: 'debugging-and-testing',
  title: 'Reading the boot messages',
  level: 2,
  short: 'Every start prints lines before your program does. The ROM says why the chip restarted and how it chose to boot, the bootloader names the partitions, the application reports its memory. Read them, and half the "it will not start" questions answer themselves.',
  keywords: ['boot log', 'boot messages', 'rst:0x1', 'POWERON_RESET', 'SW_CPU_RESET', 'boot:0x13', 'SPI_FAST_FLASH_BOOT', 'waiting for download', 'flash read err', 'configsip', 'load:', 'entry', '2nd stage bootloader', 'ets Jun  8 2016', 'boot loop', 'garbage on serial', 'banner'],
  prereq: ['print-debugging-and-log-levels', 'the-rom-bootloader', 'reset-reasons'],
  related: ['boot-modes-and-download-mode', 'strapping-pins', 'brownout', 'partition-tables', 'upload-problems', 'guru-meditation-and-backtraces'],
  body: `When a board starts, three programs speak in turn on the serial port, and each says something different. The text goes by in a tenth of a second, yet it is the best evidence you will get about a board that "does not work".

### Three voices

1. **The ROM bootloader**, burnt into the chip, speaks first, in a fixed format. It states why the chip restarted (\`rst:\`), how it chose to boot (\`boot:\`) and which pieces of flash it copied into RAM (\`load:\`) before jumping to the entry point.
2. **The second-stage bootloader** lives in flash. In an ESP-IDF build it prints lines like \`I (29) boot:\`, the number being milliseconds since reset, that list the partition table and the application it is about to start. The Arduino core's prebuilt bootloader is much quieter, so you may see only the ROM lines and then your own output.
3. **The application**: the start-up code (clock speed, heap) and then everything you and your libraries print.

~~~text
ets Jun  8 2016 00:22:57

rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
configsip: 0, SPIWP:0xee
mode:DIO, clock div:2
load:0x3fff0030,len:4832
entry 0x400805cc
I (29) boot: ESP-IDF v5.5 2nd stage bootloader
I (88) boot: Loaded app from partition at offset 0x10000
I (131) cpu_start: cpu freq: 240000000 Hz
~~~

That is the original ESP32's ROM; other chips word it a little differently, and addresses vary with every build. The simulation below lets you click through each line.

### The two codes that matter

\`rst:\` is the hardware's reason ([[reset-reasons]] has the software view): \`0x1 POWERON_RESET\` (power-up, and on the ESP32 also the EN button), \`0xc SW_CPU_RESET\` (a software restart, a panic or a brownout handler), \`0x5 DEEPSLEEP_RESET\` (a wake from deep sleep), \`0x7\` and \`0x8\` (a hardware watchdog), \`0x10 RTCWDT_RTC_RESET\` (the RTC watchdog) and \`0xf\` (a hardware brownout).

\`boot:\` is the start-up mode: \`0x13 SPI_FAST_FLASH_BOOT\` is a normal start from flash; \`0x3 DOWNLOAD_BOOT\` followed by \`waiting for download\` means the boot pin was low ([[boot-modes-and-download-mode]]); and \`flash read err, 1000\` means the chip cannot read its program at all, classically because GPIO12 was high at reset on an ESP32 ([[strapping-pins]]).

### Patterns

- **The same lines again and again** is a boot loop. A restart within a fraction of a second after a panic report is a crash early in the program; one after about five seconds suggests the task watchdog's default timeout ([[watchdog-resets]]); "Brownout detector was triggered" points at the supply ([[brownout]]).
- **Readable ROM lines, then garbage:** your program uses another baud rate than the monitor.
- **Nothing at all:** wrong port, a native-USB board with the console on the other port, the monitor opened too late, or no power.

> [!key] The ROM line \`rst:\` tells why the chip restarted and \`boot:\` how it started; the bootloader and the application then add the partition table and the memory. Repeating lines are a boot loop, and the interval and the last message before each restart say where to look.`,
  ideas: [
    'Three programs print in turn at every start: the ROM bootloader, the second-stage bootloader and your application.',
    'rst: gives the hardware reason for the restart and boot: the start-up mode; "waiting for download" means the chip is in download mode.',
    'A boot loop repeats the same lines: the interval and the last message before each restart point to the cause.',
    'Print your own banner with the firmware version and the reset reason, so every log starts with its context.'
  ],
  pitfalls: [
    'The ROM lines are written by my sketch — They come from code burnt into the chip and appear even with an empty flash. Only what follows them is yours.',
    'rst:0x1 means the board was powered on — On the ESP32 the EN button gives the same line; the hardware cannot tell the two apart. Use the software reset reason when it matters.',
    'No output means the program is not running — It may be running perfectly with its output on the other port: boards with native USB send Serial to the USB port only if the right menu option is set.'
  ],
  terms: [
    { term: 'ROM bootloader', also: ['ROM log'], def: 'The first program that runs after a reset, burnt into the chip. It reads the strapping pins, chooses between running the flash and download mode, and loads the second-stage bootloader.' },
    { term: 'rst and boot codes', also: ['rst:0x1', 'boot:0x13'], def: 'The two codes in the first line the ROM prints: rst gives the hardware reason for the restart, and boot the start-up mode that the strapping pins selected.' },
    { term: 'Boot log', also: ['start-up log', 'boot messages'], def: 'The text a chip prints at every start: first the ROM, then the bootloader, then the application. It is the best evidence about a board that does not start.' },
    { term: 'Banner', also: ['start-up banner'], def: 'A few lines the program prints first of all: firmware version, build date, chip, free memory and the reset reason. It puts every log in context.' }
  ],
  code: [
    {
      title: 'A start-up banner with the reset and wake reasons',
      about: 'Prints what you need at the top of every log: when the firmware was built, which software versions it runs on, what chip it is, how much memory is free, and why it started. After a deep-sleep wake it also prints what woke it.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          wait (1) seconds
          print [=== firmware banner ===]
          print (join [chip: ] (chip model))
          print (join [clock in MHz: ] (CPU frequency))
          print (join [free memory: ] (free heap))
          print (join [reset reason: ] (reset reason))
          if <(reset reason) = [deep sleep]> then
            print (join [woke by: ] (wake-up cause))
          end
      `,
      cpp: String.raw`
        #include "esp_system.h"
        #include "esp_sleep.h"

        const char *resetName(esp_reset_reason_t r) {
          switch (r) {
            case ESP_RST_POWERON:   return "power-on";
            case ESP_RST_SW:        return "software restart";
            case ESP_RST_PANIC:     return "panic (a crash)";
            case ESP_RST_INT_WDT:   return "interrupt watchdog";
            case ESP_RST_TASK_WDT:  return "task watchdog";
            case ESP_RST_WDT:       return "other watchdog";
            case ESP_RST_DEEPSLEEP: return "deep sleep";
            case ESP_RST_BROWNOUT:  return "brownout";
            default:                return "other";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);                                   // let the monitor connect
          Serial.println();
          Serial.println("=== firmware banner ===");
          Serial.printf("built:   %s %s\n", __DATE__, __TIME__);
          Serial.printf("sdk:     %s\n", ESP.getSdkVersion());
          Serial.printf("chip:    %s rev %d, %d core(s), %lu MHz\n", ESP.getChipModel(),
                        ESP.getChipRevision(), ESP.getChipCores(), (unsigned long)ESP.getCpuFreqMHz());
          Serial.printf("flash:   %lu KB\n", (unsigned long)(ESP.getFlashChipSize() / 1024));
          Serial.printf("heap:    %lu bytes free\n", (unsigned long)ESP.getFreeHeap());
          esp_reset_reason_t reason = esp_reset_reason();
          Serial.printf("reset:   %s (code %d)\n", resetName(reason), (int)reason);
          if (reason == ESP_RST_DEEPSLEEP) {
            // IDF 6.1 deprecates this call for esp_sleep_get_wakeup_causes(), a bit mask
            Serial.printf("woke by: code %d\n", (int)esp_sleep_get_wakeup_cause());
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import os
        import gc
        import machine
        import esp

        NAMES = {
            machine.PWRON_RESET: "power-on or brownout",
            machine.HARD_RESET: "restart, reset pin or crash",
            machine.WDT_RESET: "watchdog",
            machine.DEEPSLEEP_RESET: "deep sleep",
            machine.SOFT_RESET: "soft reset (Ctrl-D)",
        }

        print()
        print("=== firmware banner ===")
        print("micropython:", os.uname().release, "on", os.uname().machine)
        print("clock:      ", machine.freq() // 1000000, "MHz")
        print("flash:      ", esp.flash_size() // 1024, "KB")
        print("heap free:  ", gc.mem_free(), "bytes")
        cause = machine.reset_cause()
        print("reset:      ", NAMES.get(cause, "other"), "(code", cause, ")")
        if cause == machine.DEEPSLEEP_RESET:
            print("woke by:     code", machine.wake_reason())
      `,
      output: `
        === firmware banner ===
        built:   Oct  4 2026 10:12:44
        sdk:     v5.5.5
        chip:    ESP32-D0WD-V3 rev 3, 2 core(s), 240 MHz
        flash:   4096 KB
        heap:    283144 bytes free
        reset:   power-on (code 1)
      `,
      notes: ['The reset codes of the three languages differ: C++ has ten, MicroPython folds them into five, so a brownout reads as power-on there. Where the difference matters, use C++.', 'The block names are a teaching notation; UIFlow, MicroBlocks and the others have their own blocks for this.', 'Put the version of your firmware in the banner by hand: the build date alone does not tell which commit it was.']
    }
  ],
  quiz: [
    { q: 'The log shows rst:0x1 (POWERON_RESET),boot:0x3 (DOWNLOAD_BOOT(UART0/UART1/SDIO_REI_REO_V2)) and then "waiting for download". What does it say?', choices: ['The chip is in download mode: the boot pin was low at reset', 'The program crashed', 'The flash is empty', 'A watchdog fired'], a: 0, why: 'boot:0x3 is the download mode. It is what BOOT-plus-reset does on purpose, or what a wire holding GPIO0 low does by accident.' },
    { q: 'An ESP32 board resets for ever with "flash read err, 1000" after a relay module was wired to GPIO12. Why?', choices: ['The relay draws too much current', 'GPIO12 high at reset selects 1.8 V for the flash, which the chip then cannot read', 'GPIO12 is used by the USB port', 'The partition table is corrupt'], a: 1, why: 'GPIO12 is the flash-voltage strapping pin. Most modules have 3.3 V flash, which cannot be read at 1.8 V.' },
    { q: 'A device prints "Brownout detector was triggered" and restarts every second. Where do you look first?', choices: ['The program\'s loop', 'The power supply: cable, regulator, capacitors', 'The partition table', 'The baud rate'], a: 1, why: 'A brownout means the supply voltage dipped below the chip\'s threshold, typically at a Wi-Fi transmit peak. Fix the supply, not the code.' },
    { q: 'The ROM boot lines appear even when no program has ever been uploaded to the board.', a: true, why: 'They are printed by code in the chip\'s ROM. With an empty flash they are followed by an error such as "invalid header" instead of your program.' }
  ],
  applications: [
    'Telling a dead board from a board whose program does nothing: the ROM lines prove the chip and the serial path work.',
    'Spotting a strapping-pin problem from the boot: line without opening the schematic.',
    'Support: asking a customer for the first twenty lines of the log solves most tickets.',
    'Checking that an over-the-air update really started the new application, by its version in the banner.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: "Bootloader" and "Reset reason" (the reset codes of the ROM).',
    'Espressif, *esptool documentation*: "Boot Mode Selection" and "Troubleshooting".',
    'Espressif, datasheet of the chip in use: the reset sources and the strapping pins.'
  ],
  sim: { id: 'db-boot-log', params: { scenario: 'normal' } }
},

/* ================================================================ guru-meditation-and-backtraces */
{
  id: 'guru-meditation-and-backtraces',
  parent: 'debugging-and-testing',
  title: 'Guru Meditation errors and backtraces',
  level: 2,
  short: 'A crash prints a cause, a page of registers and a list of addresses, then the chip restarts. Turn the addresses into function names and line numbers and you know where the program was when it failed — and, from the cause, usually why.',
  keywords: ['Guru Meditation Error', 'panic', 'LoadProhibited', 'StoreProhibited', 'InstrFetchProhibited', 'IllegalInstruction', 'backtrace', 'EXCVADDR', 'null pointer', 'exception decoder', 'addr2line', 'abort', 'assert failed', 'Load access fault', 'crash', 'elf', 'CORRUPTED'],
  prereq: ['reading-boot-messages', 'memory-map', 'errors-and-exceptions'],
  related: ['watchdog-resets', 'stack-overflow-and-heap-corruption', 'jtag-debugging', 'core-dumps-and-field-diagnostics', 'reset-reasons', 'fault-finding-method'],
  body: `Programs on a PC crash with "segmentation fault". An ESP32 program crashes with something stranger: a message that begins *Guru Meditation Error*, a page of register values, a short list of addresses, and then the chip restarts. All of it is evidence, and most of it is easy to read.

### The first line: what kind of crash

The CPU raised an **exception** it could not recover from, and the *panic handler* printed what it knew. The first line names the cause:

| Message (Xtensa chips) | Meaning | Usual cause |
|---|---|---|
| \`LoadProhibited\`, \`StoreProhibited\` | read or wrote an address that does not exist | null or uninitialised pointer, memory used after it was freed, an index far outside an array |
| \`InstrFetchProhibited\` | tried to run code at a bad address | a null function pointer or callback, a damaged return address |
| \`IllegalInstruction\` | met something that is not code | an overflow that wrote over code pointers |
| \`LoadStoreAlignment\` | a misaligned access | a byte buffer cast to \`int *\` |
| \`IntegerDivideByZero\` | divided by zero | an unchecked divisor |
| Stack canary watchpoint | stack overflow | [[stack-overflow-and-heap-corruption]] |
| \`Interrupt wdt timeout\` | interrupts blocked too long | [[watchdog-resets]] |

The RISC-V chips (the C, H and P series) use RISC-V names: *Load access fault*, *Store access fault*, *Instruction access fault*, *Illegal instruction*. There an integer division by zero does not fault at all; it silently returns a result. A failed \`assert\`, \`abort()\` or \`ESP_ERROR_CHECK\` reports \`abort() was called\` with its own message printed just above.

### The registers and the backtrace

\`EXCVADDR\` (RISC-V: \`MTVAL\`) is the address being accessed. A value near zero, such as \`0x00000010\`, means code reached through a null pointer into a field 16 bytes in: look for a pointer that was never set. The **backtrace** is a list of \`PC:SP\` pairs. The first PC is where the crash happened; each further one is the caller. A trailing \`|<-CORRUPTED\` means the unwinder could not follow the frames any further: it often appears at the very bottom of an ordinary report, but after only one or two frames, or when the frames make no sense, suspect a damaged stack.

### Turning addresses into names

The addresses mean nothing alone. Decode them with the \`.elf\` file the build left beside the \`.bin\` — **exactly the build that is running**, because any change moves the code. \`idf.py monitor\` decodes automatically, PlatformIO does with \`monitor_filters = esp32_exception_decoder\`, and the command line does it by hand:

~~~sh
xtensa-esp32-elf-addr2line -pfiaC -e firmware.elf 0x400d2a1c 0x400d2b3a
# RISC-V chips: riscv32-esp-elf-addr2line
~~~

### Reading it as a detective

1. Read the cause line. 2. Find the top frame: the function and the line. 3. Ask which pointer, index or divisor on that line can be wrong, and walk up the callers to see who passed it. 4. Reproduce, add a check, and keep the check ([[fault-finding-method]]).

> [!key] A Guru Meditation report gives the kind of crash, the address involved and a backtrace. Decode the backtrace with the .elf of the running build, read the top frame, and ask which pointer or index on that line is wrong.`,
  ideas: [
    'The first line names the kind of crash; LoadProhibited and StoreProhibited usually mean a bad pointer or index.',
    'EXCVADDR near zero means a null pointer was followed into a field at that small offset.',
    'The backtrace lists where the crash happened and who called whom, as addresses that tools turn into function names and lines.',
    'Decode with the .elf of exactly the build that is running, or the names will be wrong.'
  ],
  pitfalls: [
    'The crash is in the function named in the top frame, so that function is the bug — It is where the program noticed. The bad pointer may have been made by a caller several frames down.',
    'Any .elf of my sketch will decode the backtrace — Only the one from the same build: rebuilding changes the addresses, and a wrong file produces plausible but false names.',
    'A crash after a reboot is a different problem from the one before — A restarting crash is the same fault; only the ROM line (rst:0xc) hides that the reason was a panic.'
  ],
  terms: [
    { term: 'Guru Meditation Error', also: ['panic', 'crash report'], def: 'The report the ESP32 panic handler prints after an unrecoverable exception: the cause, the registers and a backtrace. The name comes from the Amiga computer.' },
    { term: 'Backtrace', also: ['call chain'], def: 'The list of function calls that led to the crash, printed as pairs of a program address and a stack address. The first pair is where it failed, the rest are the callers.' },
    { term: 'Panic handler', also: ['exception handler'], def: 'The code that runs when the CPU raises an exception nobody handles. It prints the report and then restarts the chip, halts, or saves a core dump, depending on the build settings.' },
    { term: 'ELF file', also: ['.elf', 'firmware.elf'], def: 'The linker\'s output that holds the program together with its symbol names and line numbers. The .bin that is uploaded has no names; the .elf is what lets a tool turn an address into a function.' },
    { term: 'addr2line', also: ['exception decoder'], def: 'A tool of the compiler toolchain that turns program addresses into function names, file names and line numbers, using the .elf file of the build.' }
  ],
  code: [
    {
      title: 'A crash on purpose, with a null pointer',
      about: 'Prints a warning, waits three seconds and then reads a field through a null pointer. The chip prints a Guru Meditation report and restarts, over and over: a safe crash to practise decoding. The MicroPython version fails in its own, gentler way.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. Keep the .elf file of this build.',
      cpp: String.raw`
        struct Sensor {
          int id;
          int lastValue;                 // sits 4 bytes into the structure
        };

        __attribute__((noinline))        // keeps the function in the backtrace
        int readLast(Sensor *s) {
          return s->lastValue;           // s is null: the address read is 4
        }

        Sensor *volatile missing = nullptr;   // volatile: the compiler may not assume it is null

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.println("About to read through a null pointer in 3 seconds...");
          delay(3000);
          Serial.println(readLast(missing));
        }

        void loop() {}
      `,
      py: String.raw`
        import time

        class Sensor:
            def __init__(self):
                self.id = 1
                self.last_value = 42

        def read_last(s):
            return s.last_value          # s is None: there is no such attribute

        missing = None
        print("About to read through None in 3 seconds...")
        time.sleep(3)
        print(read_last(missing))
      `,
      na: { blocks: 'Blocks have no pointers, so they cannot crash this way: that is one reason they make a good first view of a program\'s structure.' },
      output: `
        About to read through a null pointer in 3 seconds...
        Guru Meditation Error: Core  1 panic'ed (LoadProhibited). Exception was unhandled.

        Core  1 register dump:
        PC      : 0x400d2a1c  PS      : 0x00060630  ...
        EXCVADDR: 0x00000004  ...

        Backtrace: 0x400d2a1c:0x3ffb1f90 0x400d2b3a:0x3ffb1fb0 0x400d3c4d:0x3ffb1fd0
      `,
      notes: ['Run it, copy the Backtrace line and decode it with the .elf of this build: the top frame is readLast, and EXCVADDR is 4, the offset of lastValue.', 'MicroPython catches the same mistake as an AttributeError with a traceback and returns to the prompt; the board does not restart. A real Guru Meditation can only come from the C code underneath, such as a bad buffer in a driver.', 'Remove the volatile and noinline words and the compiler may reason about the null pointer: the crash then looks different. A debugging aid you add must not change what it observes.']
    }
  ],
  examples: [
    {
      title: 'What does this report say?',
      q: 'A sketch crashes with "LoadProhibited", EXCVADDR 0x00000014, and a backtrace whose top frame decodes to `Display::draw() at display.cpp:88`, called from `loop()`. Where do you look?',
      steps: ['LoadProhibited is a read of an address that does not exist. 0x14 is 20 in decimal: a null pointer plus 20.', 'Line 88 of display.cpp reads a member of an object through a pointer. Some member sits 20 bytes into the object it should point to.', 'Walk up one frame: loop() called draw(). Look at which pointer loop() passes, and where it was meant to be set — typically an object created in setup() that failed, or created after the first call.'],
      a: 'A pointer used by Display::draw() is null: find where it is meant to be assigned, and check for null before the call.'
    }
  ],
  quiz: [
    { q: 'A report says LoadProhibited with EXCVADDR 0x00000010. What is the most likely cause?', choices: ['A pointer was null and the code read a field 16 bytes into the structure', 'The flash is worn out', 'A brownout', 'The stack overflowed'], a: 0, why: 'A load from an address as low as 0x10 is a null pointer plus the offset of a member. Overflow of the stack would name the stack canary instead.' },
    { q: 'In "Backtrace: 0x400d2a1c:0x3ffb2090 0x400d2b3a:0x3ffb20b0", what is the 0x400d2b3a?', choices: ['The stack address of the crash', 'The program address of the caller of the function that crashed', 'The address that was accessed', 'The next instruction to run'], a: 1, why: 'Each pair is PC:SP. The first PC is where the crash happened; the next PC is the place in the caller to which the function would have returned.' },
    { q: 'You rebuild the sketch after adding one line, then decode an old backtrace with the new .elf. The result is trustworthy.', a: false, why: 'Adding code moves the functions. The addresses of the old run mean something else in the new file, so the names are wrong, however plausible.' },
    { q: 'A backtrace of only one sensible frame ends with |<-CORRUPTED, and the crash is in unrelated code. What does it suggest?', choices: ['The serial line dropped characters', 'The unwinder could not follow the frames: the stack may have been damaged by an overflow or a stray write', 'The chip was in download mode', 'The .elf file is missing'], a: 1, why: 'The unwinder walks the frames saved on the stack. If they have been overwritten it stops at the damage. The marker also appears at the bottom of many healthy reports, so judge by the frames before it.' }
  ],
  applications: [
    'Finding which line of a library call received a null pointer after a failed initialisation.',
    'Turning a bug report with a pasted backtrace into a line of source, provided the build is kept.',
    'Spotting memory corruption in a long-running product: crashes in unrelated functions with plausible-looking pointers.',
    'Deciding quickly whether a restart was a crash, a watchdog or a brownout, by the first line of the report.'
  ],
  history: 'The words "Guru Meditation" were an error message of the Commodore Amiga, shown in a red box when the system failed, and the ESP32 core kept the phrase as a nod to it.',
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Fatal Errors": panic causes, register dump and backtrace.',
    'Espressif, *ESP-IDF Programming Guide*, "IDF Monitor": automatic decoding of addresses.',
    'PlatformIO documentation: the esp32_exception_decoder monitor filter.'
  ],
  sim: 'db-backtrace'
},

/* ================================================================ watchdog-resets */
{
  id: 'watchdog-resets',
  parent: 'debugging-and-testing',
  title: 'Watchdog resets',
  level: 2,
  short: 'A watchdog reset is a messenger: some code held on to the processor too long, and the message names it. Read the message and the backtrace, bound every wait, slice every long job, and leave the watchdog switched on.',
  keywords: ['task watchdog', 'Task watchdog got triggered', 'IDLE0', 'interrupt watchdog', 'Interrupt wdt timeout', 'TWDT', 'IWDT', 'task_wdt', 'starvation', 'deadlock', 'busy loop', 'yield', 'vTaskDelay', 'disableCore0WDT', 'safe mode', 'boot loop guard', 'timeout'],
  prereq: ['watchdogs', 'guru-meditation-and-backtraces', 'delays-and-yielding'],
  related: ['reset-reasons', 'priorities-and-scheduling', 'from-interrupt-to-task', 'race-conditions', 'errors-and-exceptions', 'reliability-in-the-field', 'fault-finding-method'],
  body: `The [[watchdogs|watchdog]] is the messenger: when it fires, some code held on to the processor for too long, and the message says whose. Reading that message is most of the job; the cure lies in the code, not in the watchdog.

### Two watchdogs, two messages

**The task watchdog** checks that the tasks it watches report in. By default these are the *idle tasks*, which run only when every other task is waiting, so a task that never waits starves the idle task and the watchdog bites (the default timeout is five seconds):

~~~text
E (5123) task_wdt: Task watchdog got triggered. The following tasks/users did not reset the watchdog in time:
E (5123) task_wdt:  - IDLE0 (CPU 0)
E (5123) task_wdt: Tasks currently running:
E (5123) task_wdt: CPU 0: sensorTask
E (5123) task_wdt: CPU 1: IDLE1
~~~

The line *Tasks currently running* names the hog, and the backtrace printed below shows where it was.

**The interrupt watchdog** fires when interrupts stay blocked for a few hundred milliseconds. It appears as a Guru Meditation error, "Interrupt wdt timeout on CPU0" ([[guru-meditation-and-backtraces]]), and the cause is an interrupt handler or a critical section that takes far too long.

Which tasks are watched depends on the build: ESP-IDF projects watch the idle task of every core, the Arduino core watches fewer, so the same bug may reset one build and merely stall another. Treat every \`task_wdt\` message as a real fault.

### The usual culprits

- **A wait with no end and no pause:** \`while (!ready) {}\`, or \`while (digitalRead(pin) == LOW) {}\` on a part that never answers.
- **A long calculation** or a long loop in a task that never pauses.
- **A deadlock:** two tasks each hold a mutex the other wants.
- **A high-priority task** that never blocks, so lower ones, the idle task among them, never run.
- **A slow call in an interrupt handler,** or a critical section that holds interrupts off.

### Cures, in order of preference

1. **Bound every wait** and pause inside it. \`delay(1)\` or \`vTaskDelay(1)\` lets the idle task run; \`yield()\` does not, because it hands the processor only to tasks of equal priority ([[delays-and-yielding]]).
2. **Slice long jobs:** work a few milliseconds, pause, continue.
3. **Move the work** to its own task, at a lower priority or on the other core ([[priorities-and-scheduling]]).
4. **Keep interrupt handlers short:** set a flag or send to a queue ([[from-interrupt-to-task]]).
5. Last of all, **lengthen the timeout** for a task that truly needs it. Switching the watchdog off (\`disableLoopWDT()\`, \`disableCore0WDT()\`) removes the alarm and keeps the fault.

After the reset the device can read why it restarted ([[reset-reasons]]) and count: three watchdog resets in a row are a reason to stop attempting the risky job and start in a safe mode. The second program below does that.

> [!key] A watchdog message names who held the processor: read "Tasks currently running" and the backtrace. The cure is a bounded wait with a real pause, a sliced job or a shorter interrupt handler; do not switch the watchdog off.`,
  ideas: [
    'The task watchdog fires when a task never waits and so starves the idle task; its message names the task that was running.',
    'The interrupt watchdog fires when interrupts are blocked for a few hundred milliseconds: a handler or critical section is too long.',
    'delay(1) lets the idle task run; yield() does not, because it only lets equal-priority tasks in.',
    'Bound every wait, slice long jobs, and count repeated watchdog resets so the device can fall back to a safe mode.'
  ],
  pitfalls: [
    'yield() makes my busy loop polite — It hands the processor only to tasks of the same priority. The idle task, which feeds the watchdog, runs only when this task truly waits: use delay(1).',
    'A longer timeout fixes the resets — It hides a hang for longer. Raise the timeout only for a task that really works that long; otherwise find the loop that never ends.',
    'The watchdog is a bug in the Arduino core — It is doing its job: something held the processor. The task named in the message is where to look.'
  ],
  terms: [
    { term: 'CPU hog', also: ['starving the idle task'], def: 'A task that holds the processor without ever waiting, so that tasks of lower priority, the idle task among them, never run. It is the usual cause of a task watchdog reset.' },
    { term: 'Bounded wait', also: ['wait with a timeout'], def: 'A wait that gives up after a time limit instead of waiting for ever, usually with a short pause inside it. It turns a missing answer into an error you can handle.' },
    { term: 'Crash counter', also: ['boot counter'], def: 'A count kept in flash of how many abnormal restarts have happened in a row. When it passes a limit the device can start in safe mode; after a stable run it is cleared.' },
    { term: 'Safe mode', also: ['recovery mode', 'fail-safe start'], def: 'A reduced way of starting that leaves out the risky part of the program, used after repeated crashes so that the device stays reachable for diagnosis or an update.' }
  ],
  code: [
    {
      title: 'A wait that cannot hang',
      about: 'Waits up to two seconds for a pin to go low (a button, or the "data ready" line of a sensor) and says what happened. The wait has a time limit and a one-millisecond pause inside, so it can neither hang nor starve the system.',
      needs: 'Any ESP32-family board and a push button between GPIO4 and GND, or a jumper wire to touch to GND.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [input with pull-up v]
        forever
          set [start v] to (milliseconds since start)
          repeat until <<(read pin (4)) = [LOW v]> or <((milliseconds since start) - (start)) ≥ (2000)>>
            wait (0.001) seconds        // a real pause: the idle task and the watchdog get their turn
          end
          if <(read pin (4)) = [LOW v]> then
            print [ready]
            wait (0.3) seconds
          else
            print [timed out: no signal]
          end
        end
      `,
      cpp: String.raw`
        const int READY_PIN = 4;                 // a button to GND, or a sensor's data-ready line
        const uint32_t TIMEOUT_MS = 2000;

        bool waitForLow(int pin, uint32_t timeoutMs) {
          uint32_t start = millis();
          while (digitalRead(pin) == HIGH) {                   // idle level is high (pull-up)
            if (millis() - start >= timeoutMs) return false;   // never wait for ever
            delay(1);                                          // one tick: the idle task runs
          }
          return true;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(READY_PIN, INPUT_PULLUP);
        }

        void loop() {
          if (waitForLow(READY_PIN, TIMEOUT_MS)) {
            Serial.println("ready");
            delay(300);
          } else {
            Serial.println("timed out: no signal");
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        READY_PIN = 4                              # a button to GND, or a sensor's data-ready line
        TIMEOUT_MS = 2000

        ready = Pin(READY_PIN, Pin.IN, Pin.PULL_UP)

        def wait_for_low(pin, timeout_ms):
            start = time.ticks_ms()
            while pin.value() == 1:                # idle level is high (pull-up)
                if time.ticks_diff(time.ticks_ms(), start) >= timeout_ms:
                    return False                   # never wait for ever
                time.sleep_ms(1)                   # lets other tasks run
            return True

        while True:
            if wait_for_low(ready, TIMEOUT_MS):
                print("ready")
                time.sleep_ms(300)
            else:
                print("timed out: no signal")
      `,
      output: `
        timed out: no signal
        timed out: no signal
        ready
        timed out: no signal
      `,
      notes: ['Compare with while (digitalRead(READY_PIN) == HIGH) {}: if the pin never goes low, that loop never ends and the watchdog, a hung program or a silent device is what you find.', 'On a sensor that signals "ready" for a few microseconds only, polling every millisecond is too slow: use an interrupt instead ([[interrupts]]).']
    },
    {
      title: 'Count the crashes and start in safe mode',
      about: 'Remembers in flash how many times in a row the chip restarted abnormally. After three, the risky part of the program is skipped. The "risky job" here simply fails after five seconds, so you can watch the counter climb: three restarts, then a calm start.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          wait (1) seconds
          set [crashes v] to (load [crashes])
          if <(reset reason) is [panic or watchdog v]> then
            change [crashes v] by (1)
            save (crashes) as [crashes]        // written only after a failure
          end
          print (join [abnormal restarts in a row: ] (crashes))
        forever
          if <<(crashes) < (3)> and <(milliseconds since start) > (5000)>> then
            print [risky job: failing now]
            stop [all v]
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include <Preferences.h>
        #include "esp_system.h"

        const uint32_t MAX_CRASHES = 3;          // abnormal restarts in a row before safe mode
        const uint32_t STABLE_MS = 20000;        // running this long without trouble clears the count

        Preferences prefs;
        uint32_t crashes = 0;
        bool safeMode = false;

        bool abnormal(esp_reset_reason_t r) {
          return r == ESP_RST_PANIC || r == ESP_RST_INT_WDT || r == ESP_RST_TASK_WDT || r == ESP_RST_WDT;
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          prefs.begin("diag", false);
          crashes = prefs.getUInt("crashes", 0);
          if (abnormal(esp_reset_reason())) {
            crashes++;
            prefs.putUInt("crashes", crashes);   // written only after a failure: no flash wear in normal life
          }
          safeMode = crashes >= MAX_CRASHES;
          Serial.printf("abnormal restarts in a row: %u%s\n", (unsigned)crashes, safeMode ? " - SAFE MODE" : "");
        }

        void loop() {
          static bool cleared = false;
          if (!cleared && millis() > STABLE_MS) {  // stable for long enough: forget the past
            prefs.putUInt("crashes", 0);
            cleared = true;
          }
          if (!safeMode && millis() > 5000) {
            Serial.println("risky job: failing now");   // stands in for the real fault
            delay(100);
            abort();
          }
          delay(100);
        }
      `,
      py: String.raw`
        import esp32
        import machine
        import time

        MAX_CRASHES = 3                            # abnormal restarts in a row before safe mode
        STABLE_MS = 20000                          # running this long without trouble clears the count

        nvs = esp32.NVS("diag")
        try:
            crashes = nvs.get_i32("crashes")
        except OSError:
            crashes = 0
        if machine.reset_cause() == machine.WDT_RESET:    # MicroPython cannot tell a panic from a restart
            crashes += 1
            nvs.set_i32("crashes", crashes)
            nvs.commit()                           # written only after a failure
        safe_mode = crashes >= MAX_CRASHES
        print("abnormal restarts in a row:", crashes, "- SAFE MODE" if safe_mode else "")

        start = time.ticks_ms()
        cleared = False
        while True:
            age = time.ticks_diff(time.ticks_ms(), start)
            if not cleared and age > STABLE_MS:    # stable for long enough: forget the past
                nvs.set_i32("crashes", 0)
                nvs.commit()
                cleared = True
            if not safe_mode and age > 5000:
                print("risky job: failing now")    # stands in for the real fault
                machine.WDT(timeout=2000)          # start a watchdog that is never fed
                while True:
                    pass
            time.sleep_ms(100)
      `,
      output: `
        abnormal restarts in a row: 0
        risky job: failing now
        abnormal restarts in a row: 1
        risky job: failing now
        abnormal restarts in a row: 2
        risky job: failing now
        abnormal restarts in a row: 3 - SAFE MODE
      `,
      notes: ['A brownout is not counted: it is a power problem, and a flat battery should not send the device into safe mode.', 'The failing job differs on purpose: C++ calls abort(), which is a panic; MicroPython lets a watchdog it never feeds do the same. The counting logic is identical.', 'The block version stops at the failure; the saved count is what the next start sees.']
    }
  ],
  quiz: [
    { q: 'A task at priority 1 on core 0 runs while (!done) {} and never pauses. What gets starved, and what is the result?', choices: ['Nothing: the scheduler shares the core equally', 'The idle task of core 0 — the task watchdog fires', 'The Wi-Fi radio hardware', 'The flash cache'], a: 1, why: 'Lower-priority tasks run only when higher ones wait. The idle task, which feeds the task watchdog, never gets the core, so the watchdog bites after its timeout.' },
    { q: 'Which call lets the idle task run?', choices: ['yield()', 'delay(1)', 'delay(0)', 'Serial.flush()'], a: 1, why: 'delay(1) puts the task to sleep for a tick, so lower-priority tasks run. yield() and delay(0) only let tasks of equal priority in.' },
    { q: 'Raising the task watchdog timeout from 5 s to 30 s cures the cause of the resets.', a: false, why: 'It only delays the alarm. A task that never waits is still hogging the core; the fix is a bounded wait with a pause, or slicing the work.' },
    { q: 'A Guru Meditation error says "Interrupt wdt timeout on CPU0". What is the best place to look?', choices: ['A task that waits too little', 'An interrupt handler or critical section that runs too long', 'The partition table', 'The Wi-Fi password'], a: 1, why: 'The interrupt watchdog checks that the system tick keeps running. It fires when interrupts are blocked for a few hundred milliseconds.' }
  ],
  applications: [
    'Tracking down a sensor driver that waits for ever when the part is unplugged.',
    'Finding the task that starves the others after a feature that polls was added.',
    'Making a device in a ceiling or on a mast recover from an unknown fault and remember that it did.',
    'Safe-mode start after repeated crashes, so that a faulty update can still be replaced over the air.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Watchdogs": the task watchdog and the interrupt watchdog.',
    'Arduino core for ESP32 documentation: the Troubleshooting guide, and the FreeRTOS notes on delay and yield.',
    'MicroPython documentation: machine.WDT and machine.reset_cause.'
  ],
  sim: 'db-watchdog'
},

/* ================================================================ stack-overflow-and-heap-corruption */
{
  id: 'stack-overflow-and-heap-corruption',
  parent: 'debugging-and-testing',
  title: 'Stack overflow and heap corruption',
  level: 3,
  short: 'A task\'s stack is a fixed block; overflow it and the program tramples its neighbours until a canary notices. Write past a heap block and the crash comes later, somewhere innocent. Measure the stack, size it with margin, and check the heap while you hunt.',
  keywords: ['stack overflow', 'stack canary', 'Stack canary watchpoint triggered', 'high water mark', 'uxTaskGetStackHighWaterMark', 'heap corruption', 'CORRUPT HEAP', 'heap poisoning', 'heap_caps_check_integrity_all', 'buffer overflow', 'use after free', 'double free', 'SET_LOOP_TASK_STACK_SIZE', 'recursion', 'malloc'],
  prereq: ['guru-meditation-and-backtraces', 'task-stacks', 'stack-heap-and-static'],
  related: ['heap-and-fragmentation', 'tasks', 'using-psram', 'watchdog-resets', 'fault-finding-method', 'core-dumps-and-field-diagnostics'],
  body: `Every FreeRTOS task has its own **stack**: a fixed block of memory in which each function call keeps its local variables and its way back. The size is chosen when the task is created and nothing grows it afterwards. The Arduino \`loop()\` runs in a task with 8 192 bytes; a task you create yourself often gets 2 048 to 4 096. A big local array, a long chain of calls, a recursion or a hungry library call (a secure connection needs several kilobytes) can use it all. The stack then runs into whatever lies beyond it, and unlike on a PC nothing stops it at once.

### How an overflow is caught

FreeRTOS plants a known pattern, the **canary**, at the far end of each stack and looks at it when tasks switch; the chip can also watch that last word with a hardware watchpoint. The result is a message like:

~~~text
Guru Meditation Error: Core  1 panic'ed (Unhandled debug exception).
Debug exception reason: Stack canary watchpoint triggered (loopTask)
~~~

or "A stack overflow in task … has been detected". Other chips word it differently, but the **task name** is always the useful part: that task needs a bigger stack, or a smaller appetite.

### Measure before it fails

FreeRTOS keeps a **high-water mark**: the least free stack the task has ever had. \`uxTaskGetStackHighWaterMark(NULL)\` returns it, in bytes on the ESP32. Keep a few hundred bytes of margin at the worst moment (Wi-Fi connecting, a secure request, the longest printf). The cures are a larger stack (\`xTaskCreate\` takes bytes; \`SET_LOOP_TASK_STACK_SIZE\` does it for \`loop()\`), moving big buffers into static or heap memory, and avoiding recursion. MicroPython guards itself: too deep a recursion raises \`RuntimeError\` instead of crashing.

### Heap corruption: the crash that is somewhere else

The **heap** holds what \`malloc\`, \`new\` and Arduino's \`String\` allocate, and each block carries bookkeeping next to it. Copy 40 characters into a 32-byte buffer with \`strcpy\` or \`sprintf\`, write after \`free\`, or free twice, and the neighbouring bookkeeping is damaged. Nothing happens at that moment. Later an innocent \`malloc\` or \`free\` meets the damage and the crash lands in blameless code, often with "CORRUPT HEAP: Bad head at 0x… Expected 0xabba1234".

| Symptom | Likely cause |
|---|---|
| Crash only in \`malloc\`, \`free\` or \`String\` code | a block was damaged earlier |
| Crash after a long time, never twice at the same place | a buffer overrun or write after free |
| "Stack canary" with a task name | that task's stack is too small |
| Free memory shrinks steadily | a leak: see [[heap-and-fragmentation]] |

To hunt it: call \`heap_caps_check_integrity_all(true)\` at suspect points, which prints the first damaged block; turn on *heap poisoning* in the ESP-IDF configuration, which fills allocated and freed memory with patterns so errors show up sooner. To prevent it: use \`snprintf\` with \`sizeof\`, check what \`malloc\` returns, and prefer fixed buffers.

> [!key] A stack overflow is caught by a canary and names the task: measure the high-water mark and give the task margin. A heap overrun damages a neighbour silently and the crash comes later, elsewhere: check the heap while hunting, and never write beyond a buffer.`,
  ideas: [
    'Each task has a fixed stack; big locals, deep calls or recursion overflow it, and a canary at its end catches the overflow and names the task.',
    'The high-water mark tells how close a task came to its limit; keep several hundred bytes of margin.',
    'A heap overrun or write after free damages a neighbour silently, and the crash comes later in unrelated code.',
    'snprintf with sizeof, checked malloc results and heap integrity checks find and prevent the damage.'
  ],
  pitfalls: [
    'More heap fixes a stack overflow — They are separate memories. A task\'s stack has the size given when it was created: free heap does not help it.',
    'The crash is inside malloc, so malloc is broken — The allocator found damage done earlier by your code. Look for the overrun, not at the allocator.',
    'If it did not crash, the buffer was big enough — An overrun can silently damage a neighbour without a crash for hours. Size every copy.'
  ],
  terms: [
    { term: 'Stack margin', also: ['free stack', 'stack headroom'], def: 'The amount of stack a task has left at its worst moment, read from the high-water mark. Keep several hundred bytes: one more call or a larger buffer would otherwise overflow it.' },
    { term: 'Heap corruption', also: ['overrun'], def: 'Damage to the heap\'s bookkeeping or to other blocks, caused by writing past the end of a block, writing after free, or freeing twice. It usually crashes later and elsewhere.' },
    { term: 'Use after free', also: ['dangling pointer'], def: 'Reading or writing memory through a pointer after the block has been given back to the heap. The block may by then belong to something else, which is damaged silently.' },
    { term: 'Heap poisoning', also: ['heap debugging'], def: 'An ESP-IDF option that fills allocated and freed memory with known patterns and checks them, so that overruns and use after free are detected sooner.' }
  ],
  code: [
    {
      title: 'How much stack and heap is left?',
      about: 'Prints the free stack and free heap at the start and at the deepest point of a twelve-level recursion that keeps a 256-byte buffer in each call. Use it to see how quickly a stack disappears, and as a template for checking your own tasks.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define dive (depth) :: my
          if <(depth) = (12)> then
            print (join [deepest: free stack ] (free stack of this task))
          else
            dive ((depth) + (1)) :: my
          end

        when started
          start serial at (115200) baud
          wait (1) seconds
          print (join [start: free stack ] (free stack of this task))
          print (join [free heap ] (free heap))
          dive (1) :: my
      `,
      cpp: String.raw`
        __attribute__((noinline))
        void dive(int depth) {
          volatile char pad[256];                 // lives on this task's stack
          pad[0] = (char)depth;
          if (depth == 12) {
            Serial.printf("deepest:  stack free %u bytes\n", (unsigned)uxTaskGetStackHighWaterMark(NULL));
          } else {
            dive(depth + 1);
          }
          pad[1] = pad[0];                        // stops the compiler turning the recursion into a loop
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("start:    stack free %u bytes\n", (unsigned)uxTaskGetStackHighWaterMark(NULL));
          Serial.printf("heap:     %lu bytes free, largest block %lu\n",
                        (unsigned long)ESP.getFreeHeap(), (unsigned long)ESP.getMaxAllocHeap());
          dive(1);
        }

        void loop() {}
      `,
      py: String.raw`
        import gc
        import micropython
        import time

        def dive(depth):
            pad = bytearray(256)                  # in MicroPython this lives on the heap, not the stack
            pad[0] = depth
            if depth == 12:
                print("deepest:  stack in use %d bytes" % micropython.stack_use())
            else:
                dive(depth + 1)
            return pad[0]

        time.sleep(1)
        gc.collect()
        print("start:    stack in use %d bytes" % micropython.stack_use())
        print("heap:     %d bytes free" % gc.mem_free())
        dive(1)
      `,
      output: `
        start:    stack free 7436 bytes
        heap:     281980 bytes free, largest block 110580
        deepest:  stack free 3892 bytes
      `,
      notes: ['The numbers are an example: yours depend on the chip and the core version. The recursion used about 3.5 KB, nearly half of the 8 KB stack of loop().', 'The two languages measure different things: C++ reports free stack, MicroPython the stack in use. MicroPython keeps the 256-byte buffers on the heap, so only the call frames use the stack, and deeper recursion ends in a RuntimeError, not a crash.', 'Run dive(40) in the C++ version to meet the "Stack canary watchpoint triggered (loopTask)" message first-hand.']
    }
  ],
  examples: [
    {
      title: 'Will this task fit?',
      q: 'A task has a 4 096-byte stack. It calls a function with a 1 500-byte local buffer, which calls a formatting function that needs about 1 200 bytes of stack for itself. The task and the call frames use about 400 bytes. How much margin is left?',
      steps: ['Add what is on the stack at the deepest point: $400 + 1\\,500 + 1\\,200 = 3\\,100$ bytes.', 'Margin: $4\\,096 - 3\\,100 = 996$ bytes.', 'That is enough, but one more call level or a larger buffer would eat it. The high-water mark of a real run tells the truth.'],
      a: 'About 1 KB is left. Check the high-water mark under the worst load, and keep at least several hundred bytes.'
    }
  ],
  quiz: [
    { q: 'A task created with a 2 048-byte stack calls a function that declares char buf[3000]. What is the likely result?', choices: ['The compiler refuses to build it', 'A stack overflow, reported with the task name', 'The buffer goes to the heap automatically', 'Nothing: the heap is larger'], a: 1, why: 'A local array lives on the task\'s own stack. 3 000 bytes cannot fit in 2 048, so the stack overflows into whatever is beyond it; the canary check names the task.' },
    { q: 'uxTaskGetStackHighWaterMark returns 120 for a task. What does that say?', choices: ['The task has used 120 bytes', 'At its fullest, the task had only 120 bytes of its stack to spare — far too close', 'The task has 120 bytes of heap', 'The stack is 120 bytes long'], a: 1, why: 'The mark is the least free stack ever seen. 120 bytes left means one bigger call or buffer would overflow.' },
    { q: 'strcpy copies 40 characters into a 32-byte global buffer. When does the program crash?', choices: ['Immediately, on that line', 'Perhaps much later, in unrelated code — or not at all', 'The compiler stops it', 'Only on RISC-V chips'], a: 1, why: 'C does not check the length. The extra bytes land on a neighbouring variable or block; the damage shows only when something uses it.' },
    { q: 'In MicroPython, a function that calls itself without end crashes the chip with a Guru Meditation error.', a: false, why: 'The interpreter counts the depth and raises RuntimeError: maximum recursion depth exceeded, which a program can catch. A Guru Meditation would need a fault in the C code underneath.' }
  ],
  applications: [
    'Sizing the stack of a task that makes HTTPS requests or parses JSON.',
    'Explaining a crash that appears only after a new feature adds a larger local buffer.',
    'Chasing a crash in malloc that turns out to be an overrun in a driver.',
    'Adding the stack high-water mark to the periodic status report of a product.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)": stack sizes in bytes and the stack overflow checks.',
    'Espressif, *ESP-IDF Programming Guide*, "Heap Memory Debugging": heap poisoning and the integrity check.',
    'Arduino core for ESP32 documentation: the loop task and its stack size.'
  ],
  sim: 'db-stack'
},

/* ================================================================ upload-problems */
{
  id: 'upload-problems',
  parent: 'debugging-and-testing',
  title: 'It will not upload',
  level: 1,
  short: 'The program compiled and then "Failed to connect". The upload is a chain — program, port, cable, bridge, chip, flash — and it breaks at the weakest link. The error message says which one; work down the checks from the cheapest.',
  keywords: ['upload failed', 'Failed to connect to ESP32', 'No serial data received', 'Timed out waiting for packet header', 'Wrong boot mode detected', 'could not open port', 'PermissionError', 'charge-only cable', 'COM port', 'dialout', 'download mode', 'esptool', 'The chip stopped responding', 'erase flash', 'port busy', 'CH340', 'CP2102'],
  prereq: ['flashing-and-esptool', 'boot-modes-and-download-mode', 'drivers-and-serial-ports'],
  related: ['usb-serial-bridges-and-auto-reset', 'strapping-pins', 'reading-boot-messages', 'brownout', 'usb-on-the-esp', 'first-program-blink'],
  body: `Nearly everyone's first hour ends here: the compile worked, and then "Failed to connect to ESP32". An upload is a conversation with a small program in the chip's ROM, over a chain of links: tool, port, cable, USB bridge, chip, flash. It fails at the weakest one, and the message of the upload tool (esptool) says which.

### The messages

| Message | What it means | Try first |
|---|---|---|
| could not open port 'COM5' (PermissionError, "busy") | the computer cannot open the port | close the serial monitor and any other program holding it; check the port; on Linux join the \`dialout\` group |
| No serial data received. / Timed out waiting for packet header | the port opens but the chip says nothing | a charge-only cable, a missing driver, the wrong port, the chip not in download mode |
| Wrong boot mode detected (0x13)! The chip needs to be in download mode. | the chip answers, but is running its program | hold BOOT, tap RESET, release BOOT ([[boot-modes-and-download-mode]]) |
| The chip stopped responding. / Serial data stream stopped | the upload began and the link broke | the cable, a lower baud rate, the power |

### The checks, cheapest first

1. **The cable.** Many are charge-only, with no data wires. Use a short one that you know has carried data.
2. **The port.** The right one is selected and nothing else has it open. A board that appears and vanishes is usually the cable or a hub.
3. **The driver** for the bridge chip (CP210x, CH340, FTDI) — [[drivers-and-serial-ports]]. Native-USB boards need none.
4. **The board setting** in the IDE matches the chip.
5. **Download mode by hand,** if the automatic reset fails ([[usb-serial-bridges-and-auto-reset]]).
6. **Power.** Writing flash is when the chip draws most; a weak port or a long cable browns out in the middle ([[brownout]]). Unplug motors, radios and shields.
7. **Pins.** Anything wired to the boot pin, EN, the serial pins (GPIO1 and GPIO3 on an ESP32) or the flash pins (GPIO6 to GPIO11 on common ESP32 modules) fights the bridge or the memory: disconnect it while uploading ([[strapping-pins]]).
8. **Speed.** Drop the upload speed from 921 600 to 115 200 baud.
9. **Erase everything** and try again, then another computer or another port.

### Native USB: the vanishing port

Boards whose chip has built-in USB (S3, C3, C6 and others) show a different device in download mode, and a sketch that reuses the USB pins, goes straight into deep sleep or restarts in a loop makes the port vanish before the upload can begin. Hold BOOT while plugging in, upload, and give your sketch a start-up window, as in the program below.

### Is it the chip?

~~~sh
esptool --port COM5 chip-id
esptool --port COM5 erase-flash
~~~

If \`chip-id\` names the chip and its address, the chip, bridge and cable work: the fault is in the boot pins, the speed or the power.

> [!key] Read the esptool message: a port that will not open is the computer's problem, silence is the cable, driver or boot mode, and a link that breaks mid-way is power or speed. Work down the checks, and give your own programs a start-up window so there is always a way in.`,
  ideas: [
    'An upload is a chain of links; the esptool message says which one failed.',
    'A charge-only cable, a missing driver, a busy port and the wrong boot mode account for most failures.',
    'Writing flash is a peak of current, so weak USB power breaks uploads that connect fine.',
    'On native-USB chips the port vanishes when a sketch uses the USB pins or sleeps at once: hold BOOT while plugging in.'
  ],
  pitfalls: [
    'If the board lights up, the cable is fine — Power lines are enough to light it. A cable without data wires powers the board and uploads nothing.',
    'Failed to connect means the board is dead — It usually means the chip never entered download mode, or the port is wrong. A dead board is the last explanation, not the first.',
    'Re-installing the IDE will fix it — The fault is nearly always in the cable, port, driver or boot pins, none of which the IDE changes.'
  ],
  terms: [
    { term: 'Sync', also: ['handshake', 'Connecting…'], def: 'The first step of an upload: esptool sends a short pattern again and again until the boot ROM answers. The dots and underscores printed after "Connecting" are these attempts.' },
    { term: 'Upload speed', also: ['flash baud rate'], def: 'The baud rate esptool uses while writing the program. High speeds (921 600 baud) save time but fail on poor cables; 115 200 baud is the safe fallback.' },
    { term: 'Start-up window', also: ['upload window', 'grace period'], def: 'A few seconds at the start of a program in which it does nothing risky, such as sleeping or reusing the USB pins, so that a new upload can always begin.' }
  ],
  choose: {
    good: ['Try a different data cable and a different port first: they are free and cure most cases', 'Use the esptool chip-id command to separate the link from the upload', 'A powered hub or a short cable for uploads of boards with many parts attached'],
    avoid: ['Reinstalling software before the cable and the boot pins are checked', 'Uploading with motors, radios or shields drawing power from the same USB port', 'Holding both buttons at random: the order is BOOT down, RESET tap, BOOT up'],
    check: ['Which port appears when the board is plugged in, and which when it is in download mode', 'Whether anything is wired to GPIO0, EN or the serial pins', 'The upload speed and the power source']
  },
  code: [
    {
      title: 'Leave yourself a way in',
      about: 'Blinks for five seconds after every start — the start-up window — and only then does the risky thing, here going to deep sleep for ten seconds. During the window a new upload always works, even on a board that would otherwise be asleep when you try.',
      needs: 'Any ESP32-family board with an LED (GPIO2 on many DevKits; change the pin if yours differs) and a USB data cable.',
      wiring: [['GPIO2', 'the on-board LED', 'or GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          print [upload window open]
          set [start v] to (milliseconds since start)
          repeat until <((milliseconds since start) - (start)) ≥ (5000)>
            toggle pin (2)
            wait (0.1) seconds
          end
          set pin (2) to [LOW v]
          print [window closed: sleeping for 10 s]
          deep sleep for (10) seconds
      `,
      cpp: String.raw`
        #ifndef LED_BUILTIN
        #define LED_BUILTIN 2
        #endif

        const uint32_t WINDOW_MS = 5000;           // time to start an upload after every reset

        void setup() {
          pinMode(LED_BUILTIN, OUTPUT);
          Serial.begin(115200);
          Serial.println("upload window open");
          uint32_t start = millis();
          while (millis() - start < WINDOW_MS) {
            digitalWrite(LED_BUILTIN, (millis() / 100) % 2);   // fast blink: the window is open
            delay(10);
          }
          digitalWrite(LED_BUILTIN, LOW);
          Serial.println("window closed: sleeping for 10 s");
          Serial.flush();
          esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin
        import machine
        import time

        WINDOW_MS = 5000                          # time to start an upload after every reset

        led = Pin(2, Pin.OUT)
        print("upload window open")
        start = time.ticks_ms()
        while time.ticks_diff(time.ticks_ms(), start) < WINDOW_MS:
            led.value((time.ticks_ms() // 100) % 2)      # fast blink: the window is open
            time.sleep_ms(10)
        led.value(0)
        print("window closed: sleeping for 10 s")
        machine.deepsleep(10000)
      `,
      output: `
        upload window open
        window closed: sleeping for 10 s
      `,
      notes: ['In MicroPython you can also interrupt a running main.py with Ctrl-C over the serial port, so the window matters less; it matters most for compiled sketches and for boards whose USB port disappears in sleep.', 'Use the same trick before any code that has locked a board up in the past: the window costs a few seconds per boot, and removes the need to hold BOOT while plugging in.']
    }
  ],
  quiz: [
    { q: 'esptool prints "Wrong boot mode detected (0x13)! The chip needs to be in download mode." What does it show?', choices: ['The cable has no data wires', 'The chip answered, but it is running its program and was not put into download mode', 'The flash is full', 'The driver is missing'], a: 1, why: 'A chip that answers at all proves the cable, port and driver work. 0x13 is the normal start from flash: hold BOOT, tap RESET, release BOOT and try again.' },
    { q: 'A board powers up and its LED lights from one USB cable, but the computer never lists a new port. The most likely cause?', choices: ['The board is broken', 'The cable is charge-only', 'The upload speed is too high', 'The board setting is wrong'], a: 1, why: 'Power alone makes the LED light. With no data wires the computer cannot see the board at all, which is why trying another cable comes first.' },
    { q: 'On Linux the upload fails with "Permission denied: /dev/ttyUSB0". What cures it?', choices: ['Re-flash the bootloader', 'Add your user to the dialout group and log in again', 'Use a longer cable', 'Lower the CPU frequency'], a: 1, why: 'The serial device belongs to a group, usually dialout (uucp on some systems). Your user must be a member before the tool may open it.' },
    { q: 'Lowering the upload speed to 115 200 baud can cure uploads that fail halfway through.', a: true, why: 'Poor cables, long wires and weak ports corrupt data at high speed. A lower speed is slower but more tolerant.' }
  ],
  applications: [
    'Getting a freshly unboxed board to accept its first program.',
    'Recovering a board whose sketch put it into a sleep or reboot loop and hid the port.',
    'Telling a bad cable, a missing driver and a boot-pin problem apart on a classroom full of boards.',
    'Making a product re-programmable in the field: a start-up window, or a recovery button, so that a bad update is never final.'
  ],
  sources: [
    'Espressif, *esptool documentation*, "Troubleshooting" and "Boot Mode Selection".',
    'Arduino core for ESP32 documentation: the Troubleshooting guide, including upload errors.',
    'Espressif, user guide of the ESP32 DevKit in use: the BOOT and EN buttons.'
  ],
  sim: 'db-upload'
},

/* ================================================================ jtag-debugging */
{
  id: 'jtag-debugging',
  parent: 'debugging-and-testing',
  title: 'JTAG debugging over USB',
  level: 3,
  short: 'Printing tells you what the program chose to say; JTAG lets you ask the chip. Stop at a line, read any variable, step one line at a time, and stop the instant a value changes — over the same USB cable on chips that have it built in.',
  keywords: ['JTAG', 'OpenOCD', 'GDB', 'breakpoint', 'watchpoint', 'single step', 'USB Serial/JTAG', 'ESP-Prog', 'debug_tool', 'esp-builtin', 'MTCK', 'MTMS', 'MTDI', 'MTDO', 'hardware breakpoint', 'halt', 'xtensa-esp32s3-elf-gdb', 'debugger'],
  prereq: ['guru-meditation-and-backtraces', 'esp-prog-and-debug-tools', 'esp-idf-basics'],
  related: ['usb-on-the-esp', 'strapping-pins', 'disabling-debug-interfaces', 'platformio', 'print-debugging-and-log-levels', 'fault-finding-method'],
  body: `Printing tells you what the program chose to say. **JTAG** lets you ask the chip itself: stop the processor at a line, look at any variable, step one line at a time, and stop the moment a variable changes. It needs no change to the program and costs no time while the program runs, which makes it the tool for faults that printing disturbs or cannot reach.

### The three pieces

1. **The probe.** The S3, C3, C6, C5, H2, P4 and some newer chips have a built-in *USB Serial/JTAG* port: it is the cable you already upload with. The original ESP32, the S2 and the C2 have none, and need an external adapter such as the ESP-Prog ([[esp-prog-and-debug-tools]]) on four pins.
2. **OpenOCD** talks to the probe and offers a GDB server on port 3333.
3. **GDB** is the debugger itself, driven from VS Code (PlatformIO or the ESP-IDF extension), Eclipse or the command line.

| Chip | TCK | TMS | TDI | TDO |
|---|---|---|---|---|
| ESP32 | GPIO13 | GPIO14 | GPIO12 | GPIO15 |
| ESP32-S2, S3 | GPIO39 | GPIO42 | GPIO41 | GPIO40 |
| ESP32-C3, C6 | GPIO6 | GPIO4 | GPIO5 | GPIO7 |
| ESP32-H2 | GPIO4 | GPIO2 | GPIO5 | GPIO3 |

An external adapter claims these pins, and on the ESP32 GPIO12 is also a strapping pin ([[strapping-pins]]). The built-in port claims the USB pins instead (GPIO19 and GPIO20 on the S3).

~~~sh
openocd -f board/esp32s3-builtin.cfg
xtensa-esp32s3-elf-gdb build/firmware.elf -ex "target extended-remote :3333" -ex "mon reset halt" -ex "thb app_main" -ex "c"
# for an Arduino sketch use: thb setup
~~~

In PlatformIO the same is \`debug_tool = esp-builtin\` (or \`esp-prog\`) in the environment.

### What it gives you

- **Breakpoints:** stop at a line. Code in flash needs a *hardware* breakpoint, and there are few: two on the ESP32 and S3, more (shared with watchpoints) on the RISC-V chips.
- **Watchpoints:** stop when a variable or address is read or written. This answers "who keeps changing this value?", the question that print debugging answers worst, and it shows the caller too.
- **Stepping, inspection:** step over, into and out; read and set variables, registers and memory; see every task and its stack.

### Care

Halting stops the processor, **not the outside world**: PWM outputs keep running, a motor keeps its last command, a heater stays on. Put outputs in a safe state before halting, and never debug a moving or mains-connected machine without one. Build with debug information and low optimisation, or variables show as "optimised out". And a shipped product should have JTAG switched off ([[disabling-debug-interfaces]]): it gives full access to memory.

> [!key] JTAG stops the chip at a line, a value or an event without disturbing the program. Use the built-in USB port where the chip has one, set breakpoints and watchpoints, and keep the outputs safe while the processor is halted.`,
  ideas: [
    'JTAG lets a debugger halt the chip, read and change variables, and step through code with no change to the program.',
    'Chips with USB Serial/JTAG need only the USB cable; the ESP32, S2 and C2 need an adapter such as the ESP-Prog on four pins.',
    'A watchpoint stops the program when a variable is written: the best way to find who changes it.',
    'Hardware breakpoints are few, and a halted chip does not stop motors, heaters or other outputs.'
  ],
  pitfalls: [
    'JTAG makes print debugging obsolete — They answer different questions. A breakpoint halts the program, which breaks anything time-bound such as Wi-Fi or a control loop; prints and logs keep the program running.',
    'When the debugger halts, the machine stops — Only the processor stops. Outputs keep their last state, and a motor or heater stays on.',
    'I can set as many breakpoints as I like — The chip has only a few hardware comparators (two on the ESP32 and S3). A third is refused.'
  ],
  terms: [
    { term: 'GDB', also: ['GNU debugger'], def: 'The standard debugger of the GNU toolchain. It connects to OpenOCD, which talks to the chip, and lets you set breakpoints, step and inspect variables from the command line or from an editor.' },
    { term: 'Hardware breakpoint', also: ['hbreak'], def: 'A place in the code at which the processor stops, implemented by a comparator in the chip. Code in flash can use only these, and the chip has few: two on the ESP32 and S3.' },
    { term: 'Watchpoint', also: ['data breakpoint'], def: 'A condition on a variable or an address, such as "stop when this is written". It halts the processor at the instruction that touched it.' },
    { term: 'Single-stepping', also: ['step over', 'step into'], def: 'Running a program one line (or one instruction) at a time under the debugger, to see how values change between the lines. Step over runs a call as a whole; step into enters it.' }
  ],
  choose: {
    good: ['Faults that printing disturbs: timing, interrupts, memory', 'Finding who changes a variable, with a watchpoint', 'Examining a crash with all its variables alive'],
    avoid: ['Debugging motors, heaters or mains loads without a safe state for the halted chip', 'Wi-Fi and control loops that cannot stand a halt: log instead', 'Shipping products with the debug port left enabled'],
    check: ['Whether your chip has built-in USB-JTAG or needs an adapter', 'How many hardware breakpoints and watchpoints it offers', 'That the .elf matches the running firmware, built with debug information']
  },
  code: [
    {
      title: 'Something to step through',
      about: 'A threshold that keeps falling: tune() lowers limit every time the total passes it, and after two passes the limit is negative. Run it, then set a watchpoint on limit and find which call changes it. The same program is in the simulation.',
      needs: 'An ESP32-S3, C3 or C6 board (built-in USB-JTAG), or any ESP32 with an ESP-Prog. Build with debug information and low optimisation.',
      blocks: `
        define tune (step) :: my
          set [limit v] to ((limit) - ((step) * (5)))

        when started
          start serial at (115200) baud
          set [limit v] to (100)
          set [total v] to (0)
        forever
          set [i v] to (1)
          repeat (6)
            change [total v] by ((i) * (10))
            if <(total) > (limit)> then
              tune (i) :: my
            end
            change [i v] by (1)
          end
          print (join [total ] (total) [ limit ] (limit))
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        int limit = 100;                 // alarm threshold
        int total = 0;

        void tune(int step) {
          limit = limit - step * 5;      // who keeps lowering the threshold?
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
        }

        void loop() {
          for (int i = 1; i <= 6; i++) {
            total += i * 10;
            if (total > limit) {
              tune(i);
            }
          }
          Serial.printf("total %d limit %d\n", total, limit);
          delay(2000);
        }
      `,
      na: { py: 'JTAG debugs the machine code of the firmware, not the Python running on top of it. In MicroPython use print and the prompt, which are quick enough to make a debugger unnecessary for most scripts.' },
      output: `
        total 210 limit 45
        total 420 limit -60
      `,
      notes: ['Set a watchpoint on limit (watch limit in GDB) and continue: the program stops inside tune() every time the value changes, and bt shows which pass of the loop called it.', 'The "bug" is the missing reset of total at the start of each pass. It is not visible in the output until the limit goes negative; a watchpoint shows it at the first change.']
    }
  ],
  quiz: [
    { q: 'Which chips can be debugged over the ordinary USB cable, without an adapter?', choices: ['All ESP32 chips', 'Chips with the built-in USB Serial/JTAG, such as the S3, C3 and C6', 'Only the original ESP32', 'Only the ESP8266'], a: 1, why: 'USB Serial/JTAG is a fixed function inside those chips. The original ESP32, the S2 and the C2 do not have it and need an external probe such as the ESP-Prog.' },
    { q: 'You halt a program at a breakpoint while a heater is switched on. What happens to the heater?', choices: ['It switches off at once', 'It stays on: the outputs keep their last state while the processor is halted', 'The chip switches it off by itself after a second', 'It depends on the baud rate'], a: 1, why: 'A halt stops the processor, not the pins. Anything that was on stays on, so put outputs in a safe state before halting.' },
    { q: 'You want to know which function keeps changing a global variable. Which tool fits best?', choices: ['A print in main()', 'A watchpoint on the variable', 'A longer delay', 'A larger stack'], a: 1, why: 'A watchpoint halts the processor at the instruction that writes the variable, and the call stack then shows who made the call.' },
    { q: 'A third hardware breakpoint is refused on an ESP32. Why?', choices: ['The sketch is too large', 'The chip has only two hardware comparators for breakpoints', 'GDB has a limit of two', 'The USB cable is too short'], a: 1, why: 'Breakpoints in flash need a hardware comparator in the processor, and the ESP32 has two. Remove one to set another.' }
  ],
  applications: [
    'Finding who overwrites a configuration value in a large program, with a watchpoint.',
    'Stepping through an interrupt handler and the code that it wakes, which printing would disturb.',
    'Examining a crash with the call stacks of all tasks and every variable still in place.',
    'Checking what a library really does with a buffer, one line at a time.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "JTAG Debugging": the built-in USB interface, OpenOCD and GDB.',
    'Espressif, *ESP-Prog* user guide and the OpenOCD board configuration files shipped with the ESP-IDF tools.',
    'PlatformIO documentation: Debugging, "esp-builtin" and "esp-prog" tools.'
  ],
  sim: 'db-jtag'
},

/* ================================================================ unit-testing */
{
  id: 'unit-testing',
  parent: 'debugging-and-testing',
  title: 'Unit tests',
  level: 2,
  short: 'The decisions in firmware — scaling a reading, parsing a command, debouncing, a state machine — are plain logic, and logic can be tested without the chip. Keep it apart from the hardware and a few lines of tests catch the bug before the board does.',
  keywords: ['unit test', 'Unity', 'test framework', 'PlatformIO test', 'pio test', 'native', 'host test', 'TEST_ASSERT_EQUAL', 'RUN_TEST', 'unittest', 'regression test', 'test-driven', 'AUnit', 'mock', 'table-driven', 'boundary'],
  prereq: ['readable-code', 'functions', 'platformio'],
  related: ['testing-a-state-machine', 'hardware-in-the-loop', 'esp-idf-basics', 'fault-finding-method', 'bits-and-bytes', 'production-testing'],
  body: `A test is a small program that calls your code with known inputs and checks the answers. A **unit test** does it for one small piece, in isolation, in a fraction of a second. For firmware this sounds odd, because the interesting part is the hardware, yet the *decisions* in a program (scaling a reading, parsing a command, debouncing, a checksum, a state machine, a schedule) are plain logic, and logic can be tested without the chip.

### Keep the logic apart from the hardware

Put decisions into functions that take values and return values and touch no pins, no \`Serial\`, no clock and no network: \`rawToPercent(raw, min, max)\` rather than an \`analogRead\` buried in the scaling. The thin layer that talks to the hardware stays small, and everything else can be tested on your computer. If logic needs the time, pass it in (\`update(nowMs)\`), and a test can supply any clock it likes.

### Where tests run

| | On the computer (host) | On the chip | Hardware in the loop |
|---|---|---|---|
| Speed | instant | seconds: build, upload, run | slower still: a rig |
| It proves | the logic | the logic on the real processor: word sizes, memory, compiler | wiring, timing, radio |

PlatformIO runs the \`test\` folder in a \`native\` environment on the computer, or on a board, with \`pio test\`, using the **Unity** framework. ESP-IDF includes Unity for tests on the chip. The Arduino IDE has no framework built in (libraries such as AUnit exist). MicroPython has \`unittest\` (install it with \`mip\`), which runs on the board or on the Unix build on a computer. The host and the chip differ in details: \`long\` is 64 bits on many computers and 32 on the ESP32, and \`double\` costs far more on a chip without a floating-point unit.

### What to test

- **Boundaries:** zero, one, the maximum, one past it, negative values, an empty input.
- **Bad input:** it must give an error, not a crash.
- **Every bug you fix:** the test that reproduces it stays for ever as a *regression test*.
- **A table of cases:** a list of inputs and expected answers, looped over.
- **State machines:** send every event in every state ([[testing-a-state-machine]]).

### The limits

Tests do not see a loose wire, a slow I2C line or a brownout. They prove that the logic does what you thought it did; whether the board does it is for [[hardware-in-the-loop|hardware in the loop]].

> [!key] Put decisions in functions free of hardware calls and test them with a framework such as Unity or unittest: on the computer for speed, on the chip where word sizes matter. Every fixed bug gets a test that stays.`,
  ideas: [
    'Logic that takes values and returns values, with no pins or clock inside, can be tested on a computer in milliseconds.',
    'Test the boundaries, the bad inputs and every bug you have fixed.',
    'Host tests are fast; tests on the chip also check word sizes, memory and the real compiler.',
    'Unit tests cannot see wiring or timing: they complement hardware-in-the-loop tests, they do not replace them.'
  ],
  pitfalls: [
    'If the tests pass, the device works — They prove only the logic they exercise. A swapped wire, a slow bus or a weak supply passes every unit test.',
    'Tests are only worth writing for big projects — A ten-line test for the scaling function takes a minute and catches the clamp that was forgotten. The cost is lowest when the code is small.',
    'A test on the PC is a test of the chip — The sizes of long and double, and the speed, differ. Run the important tests on the board too.'
  ],
  terms: [
    { term: 'Unit test', also: ['unit testing'], def: 'A small automatic check of one function or module in isolation: it calls the code with chosen inputs and compares the result with the expected one.' },
    { term: 'Unity', also: ['ThrowTheSwitch Unity'], def: 'A small test framework for C that runs on microcontrollers. It supplies the assertions (TEST_ASSERT_EQUAL_INT …) and the runner that reports passes and failures; PlatformIO and ESP-IDF both use it.' },
    { term: 'Table-driven test', also: ['data-driven test'], def: 'A test that loops over a list of inputs and expected answers, so that adding a case means adding one line to the table.' },
    { term: 'Test double', also: ['mock', 'fake', 'stub'], def: 'A stand-in for a real part, such as a fake clock or a fake sensor, that lets a test control what the code under test sees.' }
  ],
  choose: {
    good: ['Parsing, scaling, filtering, checksums, state machines', 'Code you will change later: the tests say what broke', 'Every bug you have fixed once'],
    avoid: ['Using host tests to judge timing, radio or electrical behaviour', 'Tests that depend on the real clock, the network or random numbers', 'One huge test that checks everything: when it fails you learn little'],
    check: ['That the logic lives in functions free of Arduino calls', 'That each test checks one thing and names what it expects', 'That the tests run on every change, not once']
  },
  code: [
    {
      title: 'Test the scaling function',
      about: 'A pure function that turns a raw ADC count into a percentage, with four tests: the middle, below range, above range, and a nonsense range. In PlatformIO it goes in the test folder and runs with pio test; in MicroPython the same tests run with unittest.',
      needs: 'PlatformIO with an ESP32 board (or a native environment on the computer) for the C++ version; MicroPython with the unittest package installed for the Python version.',
      cpp: String.raw`
        #include <Arduino.h>
        #include <unity.h>

        // the code under test: pure logic, no hardware inside
        int clampPercent(int v) { return v < 0 ? 0 : (v > 100 ? 100 : v); }

        int rawToPercent(int raw, int rawMin, int rawMax) {
          if (rawMax <= rawMin) return 0;                           // a nonsense range
          return clampPercent((raw - rawMin) * 100 / (rawMax - rawMin));
        }

        void setUp() {}
        void tearDown() {}

        void test_middle()        { TEST_ASSERT_EQUAL_INT(50, rawToPercent(2048, 0, 4096)); }
        void test_clamps_below()  { TEST_ASSERT_EQUAL_INT(0, rawToPercent(-30, 0, 4095)); }
        void test_clamps_above()  { TEST_ASSERT_EQUAL_INT(100, rawToPercent(5000, 0, 4095)); }
        void test_bad_range()     { TEST_ASSERT_EQUAL_INT(0, rawToPercent(10, 500, 500)); }

        void setup() {
          delay(2000);                                              // give the test runner time to connect
          UNITY_BEGIN();
          RUN_TEST(test_middle);
          RUN_TEST(test_clamps_below);
          RUN_TEST(test_clamps_above);
          RUN_TEST(test_bad_range);
          UNITY_END();
        }

        void loop() {}
      `,
      py: String.raw`
        import unittest

        # the code under test: pure logic, no hardware inside
        def clamp_percent(v):
            return max(0, min(100, v))

        def raw_to_percent(raw, raw_min, raw_max):
            if raw_max <= raw_min:
                return 0                                   # a nonsense range
            return clamp_percent((raw - raw_min) * 100 // (raw_max - raw_min))

        class TestScale(unittest.TestCase):
            def test_middle(self):
                self.assertEqual(raw_to_percent(2048, 0, 4096), 50)

            def test_clamps_below(self):
                self.assertEqual(raw_to_percent(-30, 0, 4095), 0)

            def test_clamps_above(self):
                self.assertEqual(raw_to_percent(5000, 0, 4095), 100)

            def test_bad_range(self):
                self.assertEqual(raw_to_percent(10, 500, 500), 0)

        unittest.main()
      `,
      na: { blocks: 'Block tools have no test framework: a test is a program that compares answers with expectations and reports. Write it in C++ or Python.' },
      output: `
        test/test_main.cpp:20:test_middle:PASS
        test/test_main.cpp:21:test_clamps_below:PASS
        test/test_main.cpp:22:test_clamps_above:PASS
        test/test_main.cpp:23:test_bad_range:PASS

        -----------------------
        4 Tests 0 Failures 0 Ignored
        OK
      `,
      notes: ['Install the MicroPython package once with mpremote mip install unittest (or import mip on the board) and run the file on the board or with the Unix build.', 'Try to break it: change the clamp to allow 101 and see the test name that fails. A failing test that names its expectation is the whole point.', 'The two versions divide differently for negative numbers (C++ truncates, Python rounds down), but both pass: the clamp absorbs the difference. Testing a negative input is how you would find it.']
    }
  ],
  examples: [
    {
      title: 'Which boundaries?',
      q: 'The function rawToPercent(raw, min, max) is to give 0 to 100. Which inputs would you test?',
      steps: ['The ends of the range: raw equal to min (expect 0) and to max (expect 100).', 'Just outside: one below min and one above max (the clamp: 0 and 100). Raw ADC values beyond the range do occur with noise.', 'Nonsense: max equal to min (a division by zero without the guard), or max below min.', 'One typical value in the middle, to be sure the scale is right: 2048 of 4096 is 50.'],
      a: 'Five or six inputs: both ends, both just-outside values, the nonsense range and one middle value. Each takes one line to test.'
    }
  ],
  quiz: [
    { q: 'Which function is easiest to unit-test on a computer?', choices: ['void blinkLed()', 'int percent(int raw, int lo, int hi)', 'void connectWiFi()', 'float readSensor()'], a: 1, why: 'It takes numbers and returns a number, with no pins, clock or network. The others depend on hardware that a computer does not have.' },
    { q: 'A function adds sizes in a variable of type long. Its tests pass on the computer but give a different answer on the chip. A likely reason?', choices: ['The chip is slower', 'long is 64 bits on many computers and 32 bits on the ESP32, so large sums overflow only on the chip', 'The test framework is different', 'Floats are always exact on a computer'], a: 1, why: 'Word sizes differ between platforms. This is one reason to run the important tests on the real processor as well.' },
    { q: 'A full set of passing unit tests proves that the device works.', a: false, why: 'Unit tests exercise logic only. A wrong pin, a slow bus, a weak supply or a missing pull-up passes every one of them.' },
    { q: 'You fix a bug reported from the field. What do you do with the test that reproduces it?', choices: ['Delete it once the bug is fixed', 'Keep it as a regression test, so that the bug cannot return unnoticed', 'Keep it only until the next release', 'Move it to the documentation'], a: 1, why: 'A fixed bug is a bug that has happened once; the test is the cheapest guard against its return.' }
  ],
  applications: [
    'Testing a command parser with good, bad and truncated messages before it ever sees a real network.',
    'Checking a PID or filter against recorded data on a computer, in milliseconds per run.',
    'Guarding a fixed bug in a state machine with the exact sequence of events that triggered it.',
    'Running the test suite on every commit so that a change that breaks the scaling is caught the same day.'
  ],
  sources: [
    'PlatformIO documentation: Unit Testing, including the native platform and the Unity framework.',
    'ThrowTheSwitch, *Unity* test framework documentation: assertions and the test runner.',
    'MicroPython documentation and micropython-lib: the unittest package.'
  ]
},

/* ================================================================ hardware-in-the-loop */
{
  id: 'hardware-in-the-loop',
  parent: 'debugging-and-testing',
  title: 'Testing with the hardware in the loop',
  level: 3,
  short: 'Unit tests prove the logic; they cannot prove the wiring, the timing, the sleep current or the Wi-Fi. For that the real board sits in a rig that supplies inputs and measures outputs, and a script on a computer runs the sequence and says pass or fail.',
  keywords: ['hardware in the loop', 'HIL', 'test rig', 'test fixture', 'device under test', 'DUT', 'pytest', 'pytest-embedded', 'Wokwi CI', 'continuous integration', 'bed of nails', 'pogo pins', 'serial test agent', 'automated test', 'power cycle', 'smoke test'],
  prereq: ['unit-testing', 'the-serial-monitor', 'uart-on-the-esp'],
  related: ['production-testing', 'simulators', 'testing-a-state-machine', 'soak-and-stress-tests', 'ota-partitions-and-rollback', 'usb-power-meters-and-profilers'],
  body: `Unit tests prove the logic. They cannot prove that the button is wired to the pin, that the relay clicks, that the board still joins the Wi-Fi after an update, or that it sleeps at 10 µA. For those the test needs the real board with something around it: **hardware in the loop** (HIL). The board under test, the *device under test* or DUT, is connected to a rig that supplies inputs and measures outputs, and a program on a computer runs the sequence and reports pass or fail.

### The parts of a rig

- **Power and reset:** a switchable USB port or a low-voltage relay board, so the script can power-cycle a board that hangs.
- **A line to the board:** the serial or USB port, for commands in and results out.
- **Stimulus:** a second ESP32 that drives pins, presses a "button" through a transistor, or plays a signal.
- **Measurement:** another board reading the DUT's outputs, a current meter or profiler read by the script for the sleep current ([[usb-power-meters-and-profilers]]).
- **A network:** a test access point and broker that the script controls.
- **The runner:** a script, usually in Python with pytest and pyserial. Espressif's *pytest-embedded* plug-in flashes boards, reads the serial output and lets a test wait for expected text; it can also drive the Wokwi simulator, so that checks of logic and peripherals run in the cloud on every commit. A simulator does not stand in for real radio, analogue accuracy or timing.

### A test agent

The simplest rig makes the DUT answer text commands over its serial port: \`PING\` gives \`OK PONG\`, \`LED 1\` gives \`OK\`, \`READ\` gives \`OK 1\`. The script sends them and checks the answers, each with a time limit; the program below is the device side.

~~~python
import serial

dut = serial.Serial("COM5", 115200, timeout=2)

def ask(command):
    dut.write((command + "\\n").encode())
    return dut.readline().decode().strip()

assert ask("PING") == "OK PONG"
assert ask("READ").startswith("OK ")
~~~

### What to automate

Flash, boot, check the banner and the reset reason, exercise each peripheral, measure the sleep current, join the Wi-Fi and reach the broker, run an update and a rollback, power-cycle a hundred times. The same idea on the factory floor is [[production-testing|production testing]].

Rules: every step has a time limit; the rig can recover by itself (power-cycle the DUT); serial output is saved with each result; the rig is at least as reliable as what it tests.

> [!warn] Keep the rig at low voltage. A product that switches mains needs a dummy load behind proper isolation, work for a qualified person, and a device is never reflashed or probed while it is plugged in.

> [!key] A hardware-in-the-loop rig powers, stimulates and measures the real board, and a script decides pass or fail, with a time limit on every step and a power cycle when the board hangs. Use it for what unit tests cannot see: wiring, timing, current and radio.`,
  ideas: [
    'A hardware-in-the-loop rig surrounds the real board with a power switch, a serial line, stimulus and measurement, driven by a script.',
    'A test agent in the firmware, answering commands over serial, is the simplest way to automate checks.',
    'Every step needs a time limit, and the rig must power-cycle a board that hangs.',
    'Simulators such as Wokwi test logic in the cloud on every commit; they do not replace the real radio, analogue behaviour or timing.'
  ],
  pitfalls: [
    'A simulator passing is as good as the board passing — It checks logic and some peripherals. Radio range, analogue accuracy, brownouts and real timing exist only on hardware.',
    'The script waits for the answer — It must time out: a board that hung sends no answer, and a script that waits for ever hangs the whole test run, and with it the build.',
    'Automate it all from day one — Start with a power-cycle and a banner check on a bench board; add one check each time a bug slips through.'
  ],
  terms: [
    { term: 'Device under test', also: ['DUT', 'unit under test'], def: 'The board or product being tested, connected to the rig that stimulates and measures it.' },
    { term: 'Test fixture', also: ['test rig', 'bed of nails', 'jig'], def: 'The mechanical and electrical setup that holds a board and connects it to the test equipment, often with spring-loaded pins that touch test pads.' },
    { term: 'Test agent', also: ['serial test protocol'], def: 'A small piece of firmware, in the board under test or in a helper board, that executes commands received over a serial line and reports results, so that a script can control the board.' },
    { term: 'pytest-embedded', def: 'A plug-in for the pytest framework, maintained by Espressif, that flashes a board, reads its serial output and lets a test wait for expected text. It can also run tests against the Wokwi simulator.' }
  ],
  choose: {
    good: ['Anything that touches the outside world: pins, timing, sleep current, radio', 'Release checks: update, reboot, reconnect, run overnight', 'Production tests of every unit that leaves the factory'],
    avoid: ['Proving in a rig what a unit test proves in milliseconds', 'Mains voltage on a desk rig', 'Tests that need the lab Wi-Fi to be quiet, with no retry or time limit'],
    check: ['How the rig recovers a hung board (a power cycle)', 'That every step has a time limit and the log is saved', 'That the rig is as reliable as the thing it tests']
  },
  code: [
    {
      title: 'A test agent that answers commands',
      about: 'Waits for text commands on the serial port and answers each with one line: PING, LED 1, LED 0, READ (the level of an input pin) and UPTIME. A script on the computer can drive it and check the answers.',
      needs: 'An ESP32 DevKit and the serial port at 115200 baud. Optional: a jumper from GPIO4 to GND to change what READ returns.',
      wiring: [['GPIO2', 'the on-board LED'], ['GPIO4', 'input: leave open or jumper to GND', 'internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set pin (4) as [input with pull-up v]
          print [READY]
        forever
          set [line v] to (read a line from serial)
          if <(line) = [PING]> then
            print [OK PONG]
          else if <(line) = [LED 1]> then
            set pin (2) to [HIGH v]
            print [OK]
          else if <(line) = [LED 0]> then
            set pin (2) to [LOW v]
            print [OK]
          else if <(line) = [READ]> then
            print (join [OK ] (read pin (4)))
          else if <(line) = [UPTIME]> then
            print (join [OK ] (milliseconds since start))
          else
            print [ERR unknown command]
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;
        const int INPUT_PIN = 4;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          pinMode(INPUT_PIN, INPUT_PULLUP);
          Serial.println("READY");
        }

        void loop() {
          if (!Serial.available()) return;
          String line = Serial.readStringUntil('\n');
          line.trim();
          if (line == "PING") {
            Serial.println("OK PONG");
          } else if (line == "LED 1") {
            digitalWrite(LED_PIN, HIGH);
            Serial.println("OK");
          } else if (line == "LED 0") {
            digitalWrite(LED_PIN, LOW);
            Serial.println("OK");
          } else if (line == "READ") {
            Serial.printf("OK %d\n", digitalRead(INPUT_PIN));
          } else if (line == "UPTIME") {
            Serial.printf("OK %lu\n", millis());
          } else {
            Serial.println("ERR unknown command");
          }
        }
      `,
      py: String.raw`
        import sys
        import time
        from machine import Pin

        LED_PIN = 2
        INPUT_PIN = 4

        led = Pin(LED_PIN, Pin.OUT)
        button = Pin(INPUT_PIN, Pin.IN, Pin.PULL_UP)
        start = time.ticks_ms()

        print("READY")
        while True:
            line = sys.stdin.readline().strip()
            if line == "PING":
                print("OK PONG")
            elif line == "LED 1":
                led.value(1)
                print("OK")
            elif line == "LED 0":
                led.value(0)
                print("OK")
            elif line == "READ":
                print("OK", button.value())
            elif line == "UPTIME":
                print("OK", time.ticks_diff(time.ticks_ms(), start))
            else:
                print("ERR unknown command")
      `,
      output: `
        READY
        (the script sends:)  PING
        OK PONG
        (the script sends:)  READ
        OK 1
      `,
      notes: ['Never let a command do something dangerous: the rig is for tests, and a stray character on the line must not switch a load.', 'In the C++ version a command that arrives without a line end waits for the serial timeout (one second); a script should always send the newline.', 'The MicroPython version blocks in readline() with nothing else running; if the board must do other things, use a second thread or asyncio.']
    }
  ],
  quiz: [
    { q: 'Which of these can only be checked with the real board in a rig?', choices: ['rawToPercent(2048, 0, 4096) equals 50', 'The board draws less than 20 µA in deep sleep', 'A JSON parser accepts a valid message', 'A checksum function gives the right value'], a: 1, why: 'Current is an electrical property of the board, its regulator and its parts. The others are logic and can be tested on a computer.' },
    { q: 'A script sends PING and waits for the answer. The board has hung and sends nothing. What must the script do?', choices: ['Wait for ever, in case the board recovers', 'Time out, fail the test, power-cycle the board and carry on', 'Send PING faster', 'Skip the test without a record'], a: 1, why: 'Every wait needs a limit. A timeout turns a hang into a recorded failure, and the power cycle lets the rig continue without a human.' },
    { q: 'A simulator in the cloud can replace the real board for testing radio range.', a: false, why: 'A simulator models logic and some peripherals. Radio range, antenna behaviour, analogue accuracy and real timing exist only in hardware.' },
    { q: 'Why does a test rig usually have a switchable power supply or a relay on the board\'s power?', choices: ['To save electricity', 'So that the script can power-cycle a board that hung, with nobody there', 'To raise the voltage', 'To make the serial port faster'], a: 1, why: 'Automatic recovery is what makes a rig usable overnight: a hung board is reset by the script, not by a person.' }
  ],
  applications: [
    'A fixture in which every board of a production run is flashed, powered and exercised before it is packed.',
    'A shelf of boards in an office that a build server flashes and tests on every commit.',
    'A release gate that updates a board over the air, checks the new version in the banner and the rollback after a forced failure.',
    'Measuring the deep-sleep current of every firmware version, to catch the change that made it ten times higher.'
  ],
  sources: [
    'Espressif, *pytest-embedded* documentation: running tests on ESP boards.',
    'Wokwi documentation: continuous integration with the Wokwi simulator.',
    'Espressif, *ESP-IDF Programming Guide*: "Unit Testing" and the test applications of ESP-IDF.'
  ]
},

/* ================================================================ core-dumps-and-field-diagnostics */
{
  id: 'core-dumps-and-field-diagnostics',
  parent: 'debugging-and-testing',
  title: 'Core dumps and diagnostics in the field',
  level: 3,
  short: 'On your desk a crash scrolls past on the monitor. In the field nobody is watching. Field diagnostics makes a device remember what went wrong, cheaply, and tell you: a reset counter, a crash note, a core dump of the processor, a summary sent home.',
  keywords: ['core dump', 'coredump partition', 'idf.py coredump-info', 'coredump-debug', 'field diagnostics', 'crash log', 'ring buffer', 'ESP Insights', 'telemetry', 'sys.print_exception', 'traceback', 'build id', 'ELF SHA256', 'remote logging', 'post-mortem', 'crash summary'],
  prereq: ['guru-meditation-and-backtraces', 'partition-tables', 'reset-reasons'],
  related: ['watchdog-resets', 'fleet-monitoring', 'reliability-in-the-field', 'littlefs-and-file-systems', 'nvs-and-preferences', 'privacy-and-data-protection', 'flash-wear'],
  body: `A crash on your desk scrolls past on the monitor. In a customer's loft there is no monitor and no cable: the device crashed at three in the morning, restarted and carried on, and left no trace. Field diagnostics is the art of making a device **remember** what went wrong, cheaply, and **tell** you.

### Four layers, from cheap to rich

1. **The reset reason and a counter.** Read why the chip restarted ([[reset-reasons]]) and keep a count per reason in flash; send it with the next report. A fleet's reset reasons are its health chart: brownouts point at power, watchdogs at timing, panics at bugs.
2. **A crash note.** After an abnormal restart write one line to a file or to NVS: time, reason, firmware version, perhaps the last few log lines kept in a ring buffer. The program below does this.
3. **A core dump.** When the panic handler runs it can save a snapshot of the processor's registers and the stacks of all tasks to a small flash partition. After the reboot the device can report it, or a technician can read it. On a computer ESP-IDF's tools decode it with the matching \`.elf\`: \`idf.py coredump-info\` prints the faulting task, the backtrace and the registers, and \`idf.py coredump-debug\` opens it in GDB with the variables as they were.
4. **Remote telemetry.** Send the *summary* (program counter, backtrace, task, reset reason, firmware version, uptime) to a server: a few hundred bytes, decoded centrally. Espressif's ESP Insights service collects crash reports and metrics this way, and your own backend can do the same.

### Switching on core dumps

In an ESP-IDF project choose the flash as the destination in the core dump settings and give the partition table a partition of type \`data\`, subtype \`coredump\` (64 KB is typical; [[partition-tables]]). The Arduino core's partition schemes often reserve one already: check the scheme and the core documentation for your version. The default dump holds registers and stacks, not all of RAM.

### Keep the .elf of every release

A dump or a backtrace is meaningless without the exact build that produced it. Archive the \`.elf\` of each released version under its version number; the dump carries a fingerprint of the application so that a tool can check that the file matches.

### MicroPython

Python-level errors arrive as exceptions: catch them at the top of the program, write the traceback to a file with \`sys.print_exception\`, and reset. A crash in the C code underneath still reboots the chip, and only the reset reason remains.

### Privacy and wear

A core dump contains RAM, and RAM holds passwords, keys and personal data. Send the summary, not the dump, say what you collect ([[privacy-and-data-protection]]), and write to flash only after a failure, never in a loop ([[flash-wear]]).

> [!key] Make a device keep a count of its reset reasons, a note about each crash and, where space allows, a core dump or a summary of it, and send them home. Keep the .elf of every release, and treat what you collect as sensitive.`,
  ideas: [
    'A field device must remember its failures: a reset-reason counter, a crash note, and where possible a core dump.',
    'A core dump stores the registers and task stacks in a flash partition; idf.py coredump-info and coredump-debug read it with the matching .elf.',
    'Sending only a crash summary (program counter, backtrace, task, version) keeps the report to a few hundred bytes and avoids leaking RAM contents.',
    'Archive the .elf of every released firmware, or the reports cannot be decoded.'
  ],
  pitfalls: [
    'If the device restarts and works, the problem is gone — It restarted because it crashed. Without a record you cannot know how often it happens, or that it does.',
    'I should log to flash on every pass so nothing is lost — Flash wears out. Write after a failure, in batches, or keep a ring buffer in RAM and save it only when something goes wrong.',
    'A core dump is safe to upload as it is — It contains the contents of RAM: passwords, tokens, personal data. Upload the summary, or encrypt and protect the dump.'
  ],
  terms: [
    { term: 'Core dump', also: ['coredump', 'crash dump'], def: 'A snapshot of the processor registers and the task stacks, saved by the panic handler to flash or to the serial port, which a tool on a computer can examine after the crash.' },
    { term: 'Crash note', also: ['crash log'], def: 'One line a device writes to flash after an abnormal restart: the time, the reset reason, the firmware version, and perhaps the last few log lines. Cheap, and often enough to see a pattern.' },
    { term: 'Crash summary', also: ['panic summary'], def: 'A short record of a crash — program counter, backtrace, task name, reset reason, firmware version — small enough to send over the network.' },
    { term: 'Build ID', also: ['ELF SHA256', 'app ELF fingerprint'], def: 'A fingerprint of a firmware build, stored in the program. It shows which .elf file belongs to a crash report, since only that file can decode it.' }
  ],
  code: [
    {
      title: 'Keep a note of what went wrong, then restart',
      about: 'A job that fails on its fifth call, as a stand-in for a real fault. The program writes a line to a file with the time and the reset code, restarts, and prints the file at the next start. The file is cut back when it grows past 2 KB, so it cannot fill the flash.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          wait (1) seconds
          print [--- errors.log ---]
          print (read file [errors.log])
          set [calls v] to (0)
        forever
          change [calls v] by (1)
          if <(calls) ≥ (5)> then
            append (join (milliseconds since start) [ ms, reset reason ] (reset reason) [: the job failed]) to file [errors.log]
            print [logged; restarting]
            wait (0.5) seconds
            restart the chip :: power
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <LittleFS.h>
        #include "esp_system.h"

        const size_t MAX_BYTES = 2048;               // cut the log back above this size

        bool doWork() {                              // stands in for the real job: fails on the fifth call
          static int calls = 0;
          return ++calls < 5;
        }

        void logLine(const String &text) {
          File f = LittleFS.open("/errors.log", "r");
          size_t size = f ? f.size() : 0;
          if (f) f.close();
          if (size > MAX_BYTES) LittleFS.remove("/errors.log");
          f = LittleFS.open("/errors.log", "a");
          if (!f) return;
          f.printf("%lu ms, reset code %d: %s\n", millis(), (int)esp_reset_reason(), text.c_str());
          f.close();
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!LittleFS.begin(true)) {
            Serial.println("file system failed");
            return;
          }
          File f = LittleFS.open("/errors.log", "r");        // what earlier runs left behind
          if (f) {
            Serial.println("--- errors.log ---");
            while (f.available()) Serial.write(f.read());
            f.close();
          }
        }

        void loop() {
          if (!doWork()) {
            logLine("the job failed");
            Serial.println("logged; restarting");
            delay(500);
            ESP.restart();
          }
          delay(1000);
        }
      `,
      py: String.raw`
        import sys
        import time
        import machine
        import os

        LOG = "errors.log"
        MAX_BYTES = 2048                             # cut the log back above this size
        calls = 0

        def do_work():                               # stands in for the real job: fails on the fifth call
            global calls
            calls += 1
            if calls >= 5:
                raise OSError("the job failed")

        def log_exception(e):
            try:
                if os.stat(LOG)[6] > MAX_BYTES:
                    os.remove(LOG)
            except OSError:
                pass
            with open(LOG, "a") as f:
                f.write("%d ms, reset cause %d: " % (time.ticks_ms(), machine.reset_cause()))
                sys.print_exception(e, f)            # the traceback goes into the file

        time.sleep(1)
        try:
            print("--- errors.log ---")
            print(open(LOG).read())                  # what earlier runs left behind
        except OSError:
            pass

        while True:
            try:
                do_work()
            except Exception as e:
                log_exception(e)
                print("logged; restarting")
                time.sleep_ms(500)
                machine.reset()
            time.sleep(1)
      `,
      output: `
        --- errors.log ---
        4023 ms, reset code 3: the job failed
        logged; restarting
      `,
      notes: ['The two languages find the failure differently: C++ checks a return value, Python catches an exception, and print_exception writes the whole traceback, which a one-line note cannot.', 'In C++ a real crash never reaches logLine: the panic handler restarts the chip first. To catch those, read esp_reset_reason() at the next start and write the note then, as the reset-reason counter does.', 'Reset code 3 is the software restart of C++ (ESP_RST_SW): the restart here was deliberate.']
    }
  ],
  quiz: [
    { q: 'A device crashes and restarts. Which of these is still there afterwards?', choices: ['A global variable in RAM', 'A line written to a file in flash before the crash', 'The contents of the stack', 'The text that was on the serial monitor'], a: 1, why: 'RAM, including the stack, is lost or overwritten at a restart, and the monitor text is only on your computer. Flash keeps what was written to it.' },
    { q: 'Why must you keep the .elf of every released firmware version?', choices: ['The device needs it to boot', 'A backtrace or core dump can be decoded only with the .elf of the exact build that crashed', 'It makes the update smaller', 'The licence requires it'], a: 1, why: 'The addresses in a crash report belong to one build. The .elf has the function names and line numbers for exactly that build, and for no other.' },
    { q: 'Is it safe to upload a complete core dump to a public server as it is?', choices: ['Yes, it only contains addresses', 'No: it contains the contents of RAM, which may hold passwords, keys and personal data', 'Yes, if it is compressed', 'Only on Wi-Fi'], a: 1, why: 'A dump is a copy of memory. Upload the small crash summary, or protect the dump with encryption and access control.' },
    { q: 'A device writes a status line to flash on every pass of a loop that runs every second. What is the problem?', choices: ['Nothing: flash is unlimited', 'Flash cells wear out after a limited number of erase cycles, so this will ruin the flash in time', 'The serial port gets slower', 'The line is lost at the next reset'], a: 1, why: 'Flash tolerates a limited number of erase cycles per sector. Write after a failure, in batches, or keep a ring buffer in RAM and save it when something goes wrong.' }
  ],
  applications: [
    'A fleet of sensors that report their reset counts daily, so the one with a failing supply stands out.',
    'Decoding a customer\'s crash summary into a source line, from the .elf archived with that release.',
    'A thermostat that writes a crash note and a safe-state flag, so the next start knows the heater must stay off.',
    'A support process that asks for the last lines of errors.log instead of "tell me what happened".'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Core Dump": configuration, the partition and the idf.py commands.',
    'Espressif, *ESP Insights* documentation: crash reports and metrics from devices.',
    'MicroPython documentation: sys.print_exception and machine.reset_cause.'
  ]
},

/* ================================================================ fault-finding-method */
{
  id: 'fault-finding-method',
  parent: 'debugging-and-testing',
  title: 'A method for finding faults',
  level: 1,
  short: 'Fault-finding is a method, not inspiration: reproduce the fault, observe instead of guessing, halve the problem, change one thing at a time and prove the fix. The same few steps find a loose jumper wire and a race condition.',
  keywords: ['fault finding', 'troubleshooting', 'debugging method', 'bisect', 'git bisect', 'divide and conquer', 'reproduce', 'intermittent fault', 'one change at a time', 'rubber duck', 'self test', 'blink code', 'minimal example', 'it works on the bench'],
  prereq: ['print-debugging-and-log-levels', 'reading-boot-messages'],
  related: ['guru-meditation-and-backtraces', 'watchdog-resets', 'upload-problems', 'soak-and-stress-tests', 'brownout', 'the-oscilloscope', 'reliability-in-the-field'],
  body: `Everyone has stared at a board that "does not work", changed three things at once, and found that it works, without knowing why. A fault found that way comes back. A method is quicker: it costs a few minutes at the start and saves hours at the end.

### The steps

1. **Reproduce it.** A fault you can trigger on demand can be fixed; one you cannot is a rumour. Write down what you did, what you saw and how often ("one power-up in twenty"), and find a way to make it happen faster.
2. **Observe, do not guess.** What does the boot log say ([[reading-boot-messages]]), what is the reset reason ([[reset-reasons]]), what does the supply do on a scope ([[the-oscilloscope]]), how much current flows? Evidence first, theory second.
3. **Halve the problem.** Hardware or software? Replace the program by blink; power the board from a bench supply; unplug everything the fault does not need. Then halve again. In code, if an older version worked, **bisect** it: test the middle version, and the fault is in one half. The simulation below is that game.
4. **Change one thing at a time**, and write down the result. Two changes at once tell you nothing about either.
5. **Explain it before you call it fixed.** If you cannot say why the cure works, you have found a symptom.
6. **Prove it, and keep the proof:** repeat the reproduction, and leave behind a test, a log line or a check so that the fault cannot return silently.

### Where to look first on an ESP

| Symptom | First suspects |
|---|---|
| Resets or reboots by itself | the supply (cable, regulator, capacitors) and brownouts, then watchdogs, then a crash |
| Works on the bench, not in its case | power, an antenna against metal, heat |
| Works only with USB attached | the supply or ground, a floating input, a terminal that resets the board when it opens |
| Fails only with Wi-Fi on | a current peak, the ADC2 limit on the original ESP32, timing |
| Hangs after hours | a leak, a counter that wraps, a wait with no time limit |
| Differs between two boards | pin or strapping differences, the cable, a counterfeit |
| Vanishes when you add a print | timing: a race between tasks or an interrupt |

### Intermittent faults need arithmetic

If a fault shows in one run in twenty, a fix that passes once proves nothing. With a chance $p$ per run, the chance that $n$ clean runs happen by luck is $(1-p)^n$. After 60 clean runs of a one-in-twenty fault it is still 4.6 %: luck is not ruled out until the number is small.

> [!key] Reproduce the fault, observe rather than guess, halve the problem, change one thing at a time, and prove the fix. For a fault that comes and goes, count the clean runs: one pass proves nothing.`,
  ideas: [
    'First make the fault reproducible, and write down what you did and how often it happens.',
    'Halve the problem again and again: hardware or software, this part or that, this version or the one before.',
    'Change one thing at a time and keep notes; two changes at once explain nothing.',
    'For a fault that comes and goes, one pass proves nothing: count the clean runs.'
  ],
  pitfalls: [
    'If it works after my changes, it is fixed — If you changed several things you do not know which mattered, and an intermittent fault may simply not have shown. Repeat the reproduction.',
    'The fault must be in the software I just wrote — As often it is the cable, the supply or the board. Halving the problem tells which half to look in.',
    'I need a clever idea — Most faults yield to the method, not to inspiration: reproduce, observe, halve.'
  ],
  terms: [
    { term: 'Bisection', also: ['bisect', 'git bisect', 'binary search for a fault'], def: 'Finding the change that introduced a fault by testing the version in the middle of the range, then the middle of the half that contains the fault, and so on. It needs only about log2 of the number of changes in tests.' },
    { term: 'Intermittent fault', also: ['sporadic fault', 'flaky fault'], def: 'A fault that appears only in some runs. A single clean run proves little: the chance of passing n runs by luck is (1 − p)^n.' },
    { term: 'Minimal example', also: ['minimal reproducible example'], def: 'The smallest program or setup that still shows the fault. Building one, by removing parts until the fault vanishes, is often how the cause is found.' },
    { term: 'Self-test', also: ['power-on self-test', 'POST', 'blink code'], def: 'Checks a device runs on itself at start-up, reporting the result with a code on an LED or a line of text, so that a fault can be located without instruments.' }
  ],
  formulas: [
    {
      name: 'Clean runs needed for an intermittent fault',
      expr: 'P = (1 - p)^n',
      tex: 'P = (1 - p)^{n}',
      vars: {
        P: { name: 'chance that the clean runs are luck, with the fault still present', q: 'ratio', unit: '%' },
        p: { name: 'chance that one run shows the fault', q: 'ratio', unit: '%', value: 5, min: 0.1, max: 90 },
        n: { name: 'clean runs in a row', q: 'count', value: 60, min: 1 }
      },
      solveFor: 'P',
      note: 'Assumes each run is independent. Solve for n to see how many clean runs bring the chance of luck below, say, 5 %.',
      stories: { P: 'A fault shows in {p} of the runs. After {n} clean runs in a row, how likely is it that the fault is still there and has simply not appeared?', n: 'A fault shows in {p} of the runs. How many clean runs in a row make the chance that it is still there only {P}?' },
      practice: { unknowns: ['P', 'n'] }
    }
  ],
  examples: [
    {
      title: 'How many clean runs?',
      q: 'A board freezes in about one start in ten. You change the start-up code and it starts 25 times without freezing. Is the fault fixed?',
      steps: ['If nothing had changed, 25 clean runs would happen with probability $0.9^{25} \\approx 0.072$, about 7 %.', 'That is small but not tiny: roughly one time in fourteen the old fault would also give 25 clean runs.', 'For 1 % you need $n = \\ln 0.01 / \\ln 0.9 \\approx 44$ runs.'],
      a: 'Probably, but not proven: 25 clean runs happen by luck about 7 % of the time. Run 45 or more before you trust it.'
    }
  ],
  code: [
    {
      title: 'A self-test that reports by blink code',
      about: 'At start-up checks four things — free memory, the file system, an I2C sensor at address 0x48 and a button that must not be stuck pressed — prints the results, and shows them on the LED: steady light for all well, otherwise N flashes for the first test that failed.',
      needs: 'An ESP32 DevKit. Optional: an I2C sensor at 0x48 on GPIO21 (SDA) and GPIO22 (SCL), and a button from GPIO4 to GND. Run it with and without the sensor.',
      wiring: [['GPIO21', 'sensor SDA'], ['GPIO22', 'sensor SCL'], ['GPIO4', 'button → GND (optional)', 'internal pull-up'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set pin (4) as [input with pull-up v]
          start I2C on SDA (21) SCL (22)
          set [failed v] to (0)
          if <(free heap) ≤ (50000)> then
            if <(failed) = (0)> then
              set [failed v] to (1)
            end
            print [1 memory FAIL]
          end
          if <not <(file system works?)>> then
            if <(failed) = (0)> then
              set [failed v] to (2)
            end
            print [2 storage FAIL]
          end
          if <not <(I2C device answers at address (0x48))>> then
            if <(failed) = (0)> then
              set [failed v] to (3)
            end
            print [3 sensor FAIL]
          end
          if <(read pin (4)) = [LOW v]> then
            if <(failed) = (0)> then
              set [failed v] to (4)
            end
            print [4 button FAIL]
          end
        forever
          if <(failed) = (0)> then
            set pin (2) to [HIGH v]
          else
            repeat (failed)
              set pin (2) to [HIGH v]
              wait (0.2) seconds
              set pin (2) to [LOW v]
              wait (0.25) seconds
            end
            wait (1.5) seconds
          end
        end
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <LittleFS.h>

        #ifndef LED_BUILTIN
        #define LED_BUILTIN 2
        #endif

        const int SDA_PIN = 21;
        const int SCL_PIN = 22;
        const int SENSOR_ADDRESS = 0x48;
        const int BUTTON_PIN = 4;

        bool testMemory()  { return ESP.getFreeHeap() > 50000; }
        bool testStorage() { return LittleFS.begin(true); }
        bool testSensor() {
          Wire.begin(SDA_PIN, SCL_PIN);
          Wire.beginTransmission(SENSOR_ADDRESS);
          return Wire.endTransmission() == 0;                 // 0 means the sensor answered
        }
        bool testButton() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          return digitalRead(BUTTON_PIN) == HIGH;              // not stuck pressed
        }

        typedef bool (*Test)();
        const Test TESTS[] = { testMemory, testStorage, testSensor, testButton };
        const char *NAMES[] = { "memory", "storage", "sensor", "button" };
        const int COUNT = 4;
        int failed = 0;                                        // 0 = all passed, else the number of the first failure

        void setup() {
          Serial.begin(115200);
          pinMode(LED_BUILTIN, OUTPUT);
          delay(1000);
          for (int i = 0; i < COUNT; i++) {
            bool ok = TESTS[i]();
            Serial.printf("%d %-8s %s\n", i + 1, NAMES[i], ok ? "ok" : "FAIL");
            if (!ok && failed == 0) failed = i + 1;
          }
        }

        void loop() {
          if (failed == 0) {
            digitalWrite(LED_BUILTIN, HIGH);                   // all well: a steady light
            return;
          }
          for (int n = 0; n < failed; n++) {                   // N flashes: test N failed first
            digitalWrite(LED_BUILTIN, HIGH);
            delay(200);
            digitalWrite(LED_BUILTIN, LOW);
            delay(250);
          }
          delay(1500);
        }
      `,
      py: String.raw`
        from machine import Pin, I2C
        import gc
        import os
        import time

        LED_PIN = 2
        SDA_PIN = 21
        SCL_PIN = 22
        SENSOR_ADDRESS = 0x48
        BUTTON_PIN = 4

        def test_memory():
            return gc.mem_free() > 50000

        def test_storage():
            try:
                with open("selftest.tmp", "w") as f:
                    f.write("x")
                with open("selftest.tmp") as f:
                    ok = f.read() == "x"
                os.remove("selftest.tmp")
                return ok
            except OSError:
                return False

        def test_sensor():
            try:
                I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN)).readfrom(SENSOR_ADDRESS, 1)
                return True                                   # the sensor answered
            except OSError:
                return False

        def test_button():
            return Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP).value() == 1    # not stuck pressed

        TESTS = [test_memory, test_storage, test_sensor, test_button]
        NAMES = ["memory", "storage", "sensor", "button"]

        led = Pin(LED_PIN, Pin.OUT)
        failed = 0                                            # 0 = all passed, else the number of the first failure
        for i, test in enumerate(TESTS):
            ok = test()
            print(i + 1, NAMES[i], "ok" if ok else "FAIL")
            if not ok and failed == 0:
                failed = i + 1

        while True:
            if failed == 0:
                led.value(1)                                  # all well: a steady light
                time.sleep(1)
            else:
                for n in range(failed):                       # N flashes: test N failed first
                    led.value(1)
                    time.sleep_ms(200)
                    led.value(0)
                    time.sleep_ms(250)
                time.sleep_ms(1500)
      `,
      output: `
        1 memory   ok
        2 storage  ok
        3 sensor   FAIL
        4 button   ok
        (the LED flashes three times, pauses, and repeats)
      `,
      notes: ['The order matters: the first failure is the one the LED reports, and later tests may fail only because of it.', 'The same checks make a factory test ([[production-testing]]); there the result goes to a screen or a fixture instead of an LED.']
    }
  ],
  quiz: [
    { q: 'A board resets now and then. You change the supply cable, the sketch and the board in one go, and the resets stop. What do you know?', choices: ['That the sketch was the fault', 'Nothing about which change mattered', 'That the board was faulty', 'That the cable was faulty'], a: 1, why: 'Three changes at once cannot be told apart, and an intermittent fault may also just not have shown yet. Change one thing at a time.' },
    { q: 'A bug appeared somewhere in the last 64 changes. At most how many tests does bisection need?', choices: ['64', '32', '6', '2'], a: 2, why: 'Each test halves the range: 64, 32, 16, 8, 4, 2, 1 — six tests, since 2 to the power 6 is 64.' },
    { q: 'A fault shows in one run in ten. After 20 clean runs in a row, the fault is proven fixed.', a: false, why: '20 clean runs happen with a still-present one-in-ten fault with probability 0.9 to the power 20, about 12 %. Run more, or find the cause.' },
    { q: 'It works only while the USB cable is connected. Which suspect comes first?', choices: ['The Wi-Fi password', 'The supply or ground when the cable is not there, or a floating input', 'The partition table', 'The Arduino IDE version'], a: 1, why: 'USB supplies power and a ground reference. When it is gone, the board runs from another supply, and weak power or an unconnected ground shows at once.' }
  ],
  applications: [
    'Finding which commit made a battery node draw ten times more current, by bisecting the history and measuring each build.',
    'Telling a bad cable, a bad board and a bad sketch apart with three quick swaps, one at a time.',
    'Giving a support technician a blink code that says which part of a product has failed, with no instruments.',
    'Deciding how long to test a fix for a fault that appears once a day.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Fatal Errors" and "Troubleshooting" sections: the first checks for resets and crashes.',
    'Git documentation: git bisect.',
    'Arduino core for ESP32 documentation: the Troubleshooting guide.'
  ],
  sim: 'db-bisect'
},

/* ================================================================ soak-and-stress-tests */
{
  id: 'soak-and-stress-tests',
  parent: 'debugging-and-testing',
  title: 'Soak tests',
  level: 2,
  short: 'Many faults need time: a leak of a few bytes a minute, a counter that wraps, a connection that is never closed. A soak test runs the device under realistic load for longer than anyone will watch; a stress test pushes it past anything normal.',
  keywords: ['soak test', 'stress test', 'endurance test', 'memory leak', 'free heap', 'min free heap', 'largest free block', 'fragmentation', 'millis overflow', 'micros wrap', 'MTBF', 'rule of three', 'burn-in', 'power cut test', 'long-run test'],
  prereq: ['fault-finding-method', 'heap-and-fragmentation', 'watchdog-resets'],
  related: ['reliability-in-the-field', 'stack-overflow-and-heap-corruption', 'hardware-in-the-loop', 'flash-wear', 'brownout', 'ota-partitions-and-rollback', 'fleet-monitoring'],
  body: `Many faults need time. A memory leak of 40 bytes a minute is invisible in a ten-minute test and fatal after a week. A counter that wraps, a socket that is never closed, a certificate that expires, a file system that fills: all of them pass the bench test and fail in the field. A **soak test** runs the device, under realistic load, for longer than anyone will watch. A **stress test** pushes it beyond the normal: the router vanishes, the power is cut in the middle of a write, the inputs arrive faster than ever.

### What takes time to show

- **Leaks and fragmentation.** Free heap that falls a little every hour; or total free heap that stays steady while the *largest free block* shrinks, until a 20 KB request fails ([[heap-and-fragmentation]]).
- **Counters that wrap.** \`millis()\` wraps after 49.7 days and \`micros()\` after 71.6 minutes; a 32-bit event counter or a float that adds small steps to a large sum goes wrong later still.
- **Resources:** sockets and file handles never closed, a log that fills the flash, a setting rewritten so often that it wears the flash ([[flash-wear]]).
- **Slow events:** DHCP lease renewals, time-sync corrections, daylight saving, certificate expiry.
- **Rare coincidences:** the Wi-Fi drop that lands during a write.

### What to record

Every minute or so: uptime from a 64-bit source, free heap, the lowest free heap since start, the largest free block, the reset count and last reason, reconnect counts and the stack high-water marks of the main tasks. A leak is the **slope** of the free heap over hours, so plot it. The program below prints one such line a minute.

### Stress it on purpose

Switch the router off for an hour. Block the broker. Send a thousand messages in a second. Cut the power at random moments, with a programmable switch, during file writes. Run hot and cold. Run from a nearly flat battery ([[brownout]]). Decide beforehand what *pass* means: no unexpected reset, free heap inside a band, every answer inside its limit.

### How long is long enough?

A fault that happens on average once every $M$ hours escapes a test of $t$ hours with probability $e^{-t/M}$. A 24-hour test of a once-a-day fault misses it in 37 % of runs; to be 95 % sure of seeing it you must run about three times $M$. If nothing is seen in $N$ trials, the best you can say with 95 % confidence is that the failure rate is below about $3/N$ (the *rule of three*). Several units in parallel add up: ten boards for three days are thirty board-days.

> [!warn] Do not leave an unattended test running with a lithium cell charging, a heater switched on or mains in the rig: a long test is a test nobody is watching.

> [!key] Run the device for longer than a person would watch, log memory and resets, and plot the trend. Stress it with the failures it will meet, define pass in advance, and remember that a clean test of t hours proves little about a fault with a mean time of more than t.`,
  ideas: [
    'A soak test runs for much longer than anyone watches and logs free heap, lowest heap, largest block, resets and reconnects.',
    'A leak shows as a downward slope of free heap; fragmentation as a shrinking largest free block with steady total.',
    'millis() wraps after 49.7 days and micros() after 71.6 minutes; long tests find the code that cannot cope.',
    'A test of t hours misses a fault with mean time M with probability exp(−t/M); run about three times M to be 95 % sure.'
  ],
  pitfalls: [
    'If it ran all night, it is reliable — A fault that appears once a day escapes a ten-hour test more than half the time. The test length must be several times the mean time between failures.',
    'Free heap is steady, so there is no memory problem — Total free heap can hold while the largest free block collapses through fragmentation. Log both.',
    'Stress tests are for the lab only — Real networks drop out, supplies sag and users press buttons at the worst moment. Whatever you can break on purpose, you should.'
  ],
  terms: [
    { term: 'Soak test', also: ['endurance test', 'burn-in'], def: 'A test that runs a device under realistic load for a long time, to find faults that need hours or days to appear, such as memory leaks and wrapping counters.' },
    { term: 'Stress test', also: ['torture test'], def: 'A test that pushes a device beyond normal conditions on purpose: lost networks, power cuts, bursts of input, extreme temperatures. It shows how the device fails and whether it recovers.' },
    { term: 'Pass criterion', also: ['acceptance criterion'], def: 'A limit decided before a test starts — no unexpected reset, free heap within a band, every answer within its time limit — so that the result cannot be argued into a pass afterwards.' },
    { term: 'Rule of three', def: 'A rule of thumb: if no failure is seen in N independent trials, the failure rate is, with 95 % confidence, below about 3/N.' }
  ],
  formulas: [
    {
      name: 'Chance a soak test misses a fault',
      expr: 'P = exp(-t/m)',
      tex: 'P = e^{-t/m}',
      vars: {
        P: { name: 'chance that the test sees nothing although the fault exists', q: 'ratio', unit: '%' },
        t: { name: 'length of the test', q: 'time', unit: 'h', value: 24 },
        m: { name: 'mean time between occurrences of the fault', q: 'time', unit: 'h', value: 24 }
      },
      solveFor: 'P',
      note: 'Assumes the fault strikes at random. Solve for t with P = 5 % to find the test length that is 95 % likely to catch it: about three times m.',
      stories: { P: 'A fault strikes on average every {m}. A soak test runs for {t}. How likely is it that the test sees nothing?', t: 'A fault strikes on average every {m}. How long must a test run so that it misses the fault with only {P} probability?' },
      practice: { unknowns: ['P', 't'] }
    }
  ],
  code: [
    {
      title: 'A soak monitor: one line a minute',
      about: 'Prints a line of comma-separated values once a minute: uptime, free heap, lowest free heap since start and the largest free block (MicroPython: free and allocated heap). Paste the output into a spreadsheet, plot the free heap, and look at the slope.',
      needs: 'Any ESP32-family board, and a computer that records the serial output (a terminal that saves to a file).',
      blocks: `
        when started
          start serial at (115200) baud
          print [uptime_s,free_heap,min_free_heap,largest_block]

        every (60) seconds
          print (join (uptime in seconds) [,] (free heap) [,] (lowest free heap so far) [,] (largest free block))
      `,
      cpp: String.raw`
        #include "esp_timer.h"

        const uint32_t PERIOD_MS = 60000;                  // one line a minute
        uint32_t lastReport = 0;

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.println("uptime_s,free_heap,min_free_heap,largest_block");
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastReport >= PERIOD_MS) {
            lastReport += PERIOD_MS;
            uint32_t uptime = (uint32_t)(esp_timer_get_time() / 1000000ULL);   // a 64-bit clock: no wrap
            Serial.printf("%lu,%lu,%lu,%lu\n", (unsigned long)uptime, (unsigned long)ESP.getFreeHeap(),
                          (unsigned long)ESP.getMinFreeHeap(), (unsigned long)ESP.getMaxAllocHeap());
          }
          // the code under test runs here
        }
      `,
      py: String.raw`
        import gc
        import time

        PERIOD_MS = 60000                                  # one line a minute

        print("uptime_s,free_heap,allocated_heap")
        last = time.ticks_ms()
        uptime = 0
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= PERIOD_MS:
                last = time.ticks_add(last, PERIOD_MS)
                uptime += PERIOD_MS // 1000                # counted here: the tick counter wraps
                gc.collect()
                print("%d,%d,%d" % (uptime, gc.mem_free(), gc.mem_alloc()))
            # the code under test runs here
            time.sleep_ms(10)
      `,
      output: `
        uptime_s,free_heap,min_free_heap,largest_block
        60,281300,280900,113792
        120,281284,280900,113792
        180,279912,279012,110580
      `,
      notes: ['The C++ version also reports the lowest free heap since start and the largest free block; MicroPython reports free and allocated heap. Read the trend, not single values.', 'A fall of one line to the next means little; the slope over hours is the finding. Compare it with the ups and downs of the normal work (a Wi-Fi reconnect, a TLS handshake).', 'The uptime is kept from a 64-bit clock or counted by hand: millis() and the MicroPython tick counter wrap, and a soak test is exactly where that shows.']
    }
  ],
  quiz: [
    { q: 'A fault strikes on average once a day. A 24-hour soak test sees nothing. What can you conclude?', choices: ['The fault is fixed', 'Little: such a test misses a once-a-day fault in about 37 % of runs', 'The fault was a one-off', 'The test was too short by exactly one hour'], a: 1, why: 'The chance of seeing nothing in t = M is e to the power −1, about 0.37. To be 95 % sure you would need about three days.' },
    { q: 'Free heap is steady at 180 KB for hours, but the largest free block falls from 110 KB to 15 KB. What is happening?', choices: ['A leak', 'Fragmentation: the free memory is split into small pieces', 'The flash is full', 'A watchdog reset'], a: 1, why: 'The total is unchanged, so nothing is leaking, but the free space is cut into small holes. A request for a big block will fail although 180 KB is free.' },
    { q: 'On an ESP32, micros() wraps after about 71.6 minutes, because it counts microseconds in 32 bits.', a: true, why: '2 to the power 32 microseconds is 4 294 967 296 µs, about 71.6 minutes. Compare times by subtraction of unsigned values, and keep long durations in a 64-bit counter.' },
    { q: 'Why define what "pass" means before a stress test starts?', choices: ['The tool requires it', 'So that "it looked all right" cannot be argued afterwards: pass is no unexpected reset, a heap inside a band, answers inside their limits', 'To shorten the test', 'To avoid logging'], a: 1, why: 'Without a criterion fixed beforehand, a marginal result is talked into a pass. Numbers decided in advance are the honest referee.' }
  ],
  applications: [
    'A week-long run of a Wi-Fi sensor against a router that is switched off for an hour every night.',
    'Cutting the power at random moments during file writes, to check that the file system survives.',
    'Plotting the free heap of a build for three days to confirm that a leak has been fixed.',
    'Running ten units in parallel for a weekend as the last gate before a release.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Heap Memory Allocation" and "Heap Memory Debugging": free size, minimum free size and the largest free block.',
    'Arduino core for ESP32 documentation: the ESP class (getFreeHeap, getMinFreeHeap, getMaxAllocHeap).',
    'MicroPython documentation: the gc module (mem_free, mem_alloc).'
  ],
  sim: 'db-soak'
}
);
