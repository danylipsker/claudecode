/* HYPER-ESP32 · content/inside-the-chip.js
 *
 * Topic "Inside the chip" (branch the-esp-family): cores and clocks, the memory map, flash and the cache, the boot ROM,
 * boot and download modes, eFuses, the low-power domain, the GPIO matrix, the shared radio, reset reasons, the peripherals.
 * Simulations: sims/inside-the-chip.js (ids ic-…).
 */
Hyper.add(
/* ================================================================ cores and clocks */
{
  id: 'cpu-cores-and-clocks',
  parent: 'inside-the-chip',
  title: 'Cores and clocks',
  level: 1,
  short: 'A core does one small step per tick of a clock. The family has one or two cores between 96 and 400 MHz, all fed from a crystal through a PLL — and the clock you choose is a trade between speed and current.',
  keywords: ['core', 'dual-core', 'single-core', 'CPU frequency', 'clock', 'MHz', 'crystal', 'XTAL', 'PLL', 'setCpuFrequencyMhz', 'getCpuFrequencyMhz', 'machine.freq', 'FPU', 'APB', 'race to sleep', '80 MHz', '240 MHz', '32 kHz'],
  prereq: ['xtensa-and-risc-v', 'what-a-microcontroller-is', 'reading-the-family-names'],
  related: ['memory-map', 'the-loop-task-and-two-cores', 'crystals-and-clocks', 'power-modes', 'light-sleep-and-automatic-power-management', 'hardware-timers'],
  body: `A processor core does one very small thing over and over — fetch an instruction, carry it out, fetch the next — and a **clock** says when. Picture a metronome ticking 240 million times a second: at each tick the core can finish roughly one simple step. Everything else in this topic, from memory to the radio, happens between those ticks.

### Cores

Most of the family has a single core. The dual-core members are the original ESP32 (Xtensa LX6), the ESP32-S3 (Xtensa LX7) and the ESP32-P4 (RISC-V); the C and H series are single-core RISC-V chips.

| Chip | Cores | Highest clock | Hardware floating point | Small low-power core |
|---|---|---|---|---|
| ESP32 | 2 × Xtensa LX6 | 240 MHz | yes | ULP state machine |
| ESP32-S3 | 2 × Xtensa LX7 | 240 MHz | yes | ULP-RISC-V and state machine |
| ESP32-C3 | 1 × RISC-V | 160 MHz | no | none |
| ESP32-C6 | 1 × RISC-V | 160 MHz | no | LP RISC-V, 20 MHz |
| ESP32-H2 | 1 × RISC-V | 96 MHz | no | none |
| ESP32-P4 | 2 × RISC-V | 400 MHz | yes | LP RISC-V, 40 MHz |

A second core does not make one program twice as fast; it lets two things happen at the same moment. The radio software is a set of tasks, so on a dual-core chip your sketch and the radio can each have a core. In the Arduino core \`setup()\` and \`loop()\` run in one task, on core 1 of a dual-core chip and on the only core of a single-core one ([[the-loop-task-and-two-cores]]). Without a floating-point unit, \`float\` maths still works but in software, many instructions per multiplication: keep it out of tight loops on the C and H chips.

### Where the ticks come from

A **crystal** outside the chip is the reference — 40 MHz on most members, 32 MHz on the H2, 48 MHz on the C5, 26 or 40 MHz on the C2 — and the chip cannot run without it. After reset the CPU uses the crystal directly. Software then switches on a **PLL**, a circuit that multiplies the reference up to several hundred megahertz, and a divider brings that down to the CPU clock: 80, 160 or 240 MHz on the ESP32, 40 or 20 MHz straight from the crystal. For sleep there is a slow clock, an internal oscillator of roughly 150 kHz or an optional 32.768 kHz crystal on pins the datasheet names, which keeps time while the fast clocks are off ([[crystals-and-clocks]]).

### The price of a tick

Part of a core's current grows with the clock — every tick switches transistors — and part does not. A slower clock lowers the current but stretches the job, so the energy for a fixed job, current times time, usually falls as the clock rises. That is why firmware that wakes, works fast and sleeps again tends to beat firmware that dawdles at a low clock. Slowing down pays only when the CPU is waiting for something slow anyway and the radio is off: on the original ESP32 Wi-Fi and Bluetooth need the CPU at 80 MHz or more.

### Changing it

\`setCpuFrequencyMhz()\` in Arduino and \`machine.freq()\` in MicroPython (in hertz) set the clock. Only the values the PLL and dividers can make are accepted, and the list differs per chip; others are refused. The peripheral clocks follow, so test serial output after a change.

> [!key] A core is a ticking machine, and the chip has one or two of them, clocked from a crystal through a PLL. Faster costs current but finishes sooner, so the clock that saves most energy is rarely the lowest one.`,
  ideas: [
    'The CPU clock is made from a crystal reference: multiplied by a PLL, then divided to 80, 160 or 240 MHz (ESP32), or taken straight from the crystal at 40 or 20 MHz.',
    'A second core lets two tasks run at the same moment; it does not speed up a single task.',
    'The chips without a floating-point unit (C3, C6, H2 and most others) do float maths in software, many times slower.',
    'Energy for a fixed job is current times time: finishing fast and sleeping often costs less than running slowly.'
  ],
  pitfalls: [
    'A dual-core chip runs my sketch twice as fast — Only work split into separate tasks uses both cores; one loop() runs on one core.',
    'I can set any CPU frequency to save battery — The chip accepts only the frequencies its PLL and dividers can produce (80, 160, 240 MHz on the ESP32), and below 80 MHz Wi-Fi and Bluetooth stop being usable on the original ESP32.',
    'The datasheet maximum is what my sketch runs at — The board menu sets the clock. Read it back with getCpuFrequencyMhz() or machine.freq() instead of assuming.'
  ],
  terms: [
    { term: 'Core', also: ['CPU core', 'processor core'], def: 'One processor: the unit that fetches and executes instructions. ESP chips have one or two main cores, and several have a small extra low-power core for sleep.' },
    { term: 'Crystal oscillator', also: ['XTAL', 'quartz crystal', 'main crystal'], def: 'A small quartz part outside the chip that vibrates at a precise frequency, usually 40 MHz. The fast clocks of every ESP chip are made from it, so the chip cannot run without it.' },
    { term: 'PLL', also: ['phase-locked loop'], def: 'A circuit that multiplies a reference frequency, here the crystal, into a much higher one. The CPU clock is the PLL output divided down.' },
    { term: 'CPU frequency', also: ['CPU clock', 'core clock', 'clock speed'], def: 'How many clock ticks per second the core runs on, in MHz. It can be changed while the program runs, within the values the chip supports.' },
    { term: 'FPU', also: ['floating-point unit'], def: 'Hardware that does float arithmetic in a few clock cycles. The ESP32, S3 and P4 have one; chips without it emulate floats in software.' },
    { term: 'APB clock', also: ['APB_CLK', 'bus clock'], def: 'The clock of the bus that links the CPU to most peripherals. On the ESP32 it stays at 80 MHz while the CPU runs at 80 MHz or more; timers and UARTs count it.' }
  ],
  choose: {
    good: ['Lowering the clock on a mains-powered board that runs hot, with no heavy maths', 'A sensor node that wakes, works at full speed and sleeps again', 'Both cores and the top clock for audio, graphics and machine learning (ESP32-S3, P4)'],
    avoid: ['Running at 40 MHz or less while Wi-Fi or Bluetooth is on (original ESP32)', 'Changing the clock in the middle of a time-critical protocol or a serial transfer', 'Hoping a lower clock fixes a battery problem that is really the board\'s regulator and LEDs'],
    check: ['The values your exact chip accepts (the program below tells you which it refuses)', 'That serial output and timers still behave after the change', 'Current at two clocks with a meter, not from memory']
  },
  code: [
    {
      title: 'Read the clock, change it, time a job',
      about: 'Prints the CPU frequency, then runs the same job at 80 MHz and 160 MHz and shows how long it took. A frequency the chip refuses is reported instead of crashing.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Clock at start (MHz): ] (CPU frequency))
          set [mhz v] to (80)
          set [sum v] to (0)
          repeat (2)
            set CPU frequency to (mhz) MHz
            set [t v] to (milliseconds since start)
            repeat (100000)
              change [sum v] by (1)
            end
            print (join [Job took (ms): ] ((milliseconds since start) - (t)))
            change [mhz v] by (80)
          end
      `,
      cpp: String.raw`
        // A fixed job: a million additions the compiler may not skip
        uint32_t job() {
          volatile uint32_t sum = 0;
          uint32_t start = micros();
          for (uint32_t i = 0; i < 1000000; i++) sum += i;
          return micros() - start;
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Clock at start: %lu MHz\n", (unsigned long)getCpuFrequencyMhz());
          const uint32_t steps[] = {80, 160};          // the legal values depend on the chip
          for (uint32_t mhz : steps) {
            if (setCpuFrequencyMhz(mhz)) {
              Serial.printf("%3lu MHz: job took %lu us\n", (unsigned long)getCpuFrequencyMhz(), (unsigned long)job());
            } else {
              Serial.printf("%3lu MHz: this chip refuses it\n", (unsigned long)mhz);
            }
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, time

        def job():                                      # a smaller job: Python is slower than C++
            start = time.ticks_us()
            total = 0
            for i in range(100000):
                total += i
            return time.ticks_diff(time.ticks_us(), start)

        print("Clock at start:", machine.freq() // 1000000, "MHz")
        for mhz in (80, 160):                           # the legal values depend on the chip
            try:
                machine.freq(mhz * 1000000)             # in hertz
                print(mhz, "MHz: job took", job(), "us")
            except ValueError:
                print(mhz, "MHz: this chip refuses it")
      `,
      output: `
        Clock at start: 240 MHz
         80 MHz: job took 75120 us
        160 MHz: job took 37560 us
      `,
      notes: ['The times are an example; what matters is the ratio, about 2 to 1, because the job is a fixed number of ticks.', 'On an ESP32-C2 (80 or 120 MHz) or an ESP32-H2 (up to 96 MHz) the 160 MHz step is refused, and the program says so.', 'The clock stays at the last value until the next reset. If a Wi-Fi sketch misbehaves after you lowered the clock, put it back.']
    }
  ],
  examples: [
    {
      title: 'Is the slow clock cheaper?',
      q: 'A job takes 40 ms of CPU time at 160 MHz. At 80 MHz it takes twice as long. The chip draws 30 mA at 160 MHz and 20 mA at 80 MHz, on a 3.3 V supply. Which clock uses less energy for the job, and by how much?',
      steps: ['At 160 MHz: $30\\,\\mathrm{mA} \\times 40\\,\\mathrm{ms} = 1200\\,\\mu\\mathrm{C}$ of charge.', 'At 80 MHz: $20\\,\\mathrm{mA} \\times 80\\,\\mathrm{ms} = 1600\\,\\mu\\mathrm{C}$.', 'Energy is the charge times 3.3 V, so the ratio is the same: the slow clock needs $1600 / 1200 \\approx 1.33$ times as much.'],
      a: 'The fast clock wins by a third, because part of the current (here 10 mA) does not shrink with the clock and is paid for twice as long at 80 MHz. The figures are made up to show the effect; measure your own board.'
    }
  ],
  quiz: [
    { q: 'Which statement about a dual-core ESP32 is true?', choices: ['One loop() runs on both cores at once', 'Two tasks can run at the same moment, one on each core', 'The second core doubles the clock', 'The second core only handles Wi-Fi and cannot be used by programs'], a: 1, why: 'A task runs on one core at a time. With two cores two tasks truly run in parallel; a single loop() does not become faster.' },
    { q: 'On an ESP32, setCpuFrequencyMhz(100) returns false. Why?', choices: ['100 is too low for any chip', 'Only frequencies the PLL and dividers can produce are accepted', 'The sketch is not running on core 1', 'The crystal must be 100 MHz'], a: 1, why: 'The CPU clock is the crystal or the PLL divided by whole numbers, so 80, 160 and 240 MHz (and 40, 20 from the crystal) exist and 100 does not.' },
    { q: 'Halving the CPU clock halves the energy needed to finish a fixed job.', a: false, why: 'The job takes twice as long, and the part of the current that does not depend on the clock is paid for twice as long. The energy falls by less than half, or even rises.' },
    { q: 'A sketch for an ESP32-C3 does a million float multiplications per second and runs slowly. What is the most likely cause?', choices: ['The C3 has no floating-point unit, so floats are emulated in software', 'The C3 runs at 20 MHz', 'Float maths is not allowed on RISC-V', 'The sketch runs on the low-power core'], a: 0, why: 'The C3 has no FPU. Integer or fixed-point arithmetic, or a chip with an FPU (ESP32, S3, P4), is much faster for float-heavy code.' }
  ],
  applications: [
    'Battery sensors that wake, run briefly at full speed and sleep again.',
    'Audio, graphics and machine-learning code that wants both cores and the top clock (ESP32-S3, ESP32-P4).',
    'Mains-powered gateways that run at a lower clock to stay cool in a closed box.',
    'Bit-banged protocols and precise timing, which check the actual clock before they start.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*, section "System Clocks" (CPU clock and RTC clock); the clock subsections of the ESP32-C6 and ESP32-H2 datasheets.',
    'Arduino core for ESP32 documentation, the ESP class and the clock functions of the core (version 3.3).',
    'MicroPython documentation, *machine* module: freq() (version 1.29).'
  ],
  sim: 'ic-clock-tree'
},

/* ================================================================ the memory map */
{
  id: 'memory-map',
  parent: 'inside-the-chip',
  title: 'RAM, ROM and where code lives',
  level: 2,
  short: 'To the processor, memory is one long street of addresses. ROM, SRAM, RTC memory, the flash window and PSRAM are different stretches of it — and which stretch a variable or a function lands in explains most crashes and "out of memory" errors.',
  keywords: ['memory map', 'SRAM', 'DRAM', 'IRAM', 'ROM', 'RTC memory', 'heap', 'stack', 'flash', 'PSRAM', 'address', '0x3FFB', '0x400D', 'IRAM_ATTR', 'RTC_DATA_ATTR', 'getFreeHeap', 'global variables use', 'program storage space', 'backtrace'],
  prereq: ['cpu-cores-and-clocks', 'what-a-microcontroller-is', 'variables-and-types'],
  related: ['flash-and-the-cache', 'stack-heap-and-static', 'heap-and-fragmentation', 'using-psram', 'rtc-memory', 'guru-meditation-and-backtraces', 'partition-tables'],
  body: `To the processor, memory is one long street of numbered houses — **addresses** — and different stretches of the street are different kinds of memory. Knowing which house a thing lives in explains crashes, "out of memory" errors and the odd rule that a function must be kept in RAM.

### The kinds of memory

- **ROM** is burned in at the factory: the boot code, parts of the C library and low-level drivers. 384 KB on the S3 and C3, 320 KB on the C6, 448 KB on the ESP32 (catalogue figures).
- **SRAM** is the fast working memory on the chip: 520 KB on the ESP32, 512 KB on the S3 and C6, 400 KB on the C3. It holds variables, stacks, the heap and the code that must be quick. The same bytes are reachable through two address windows, one for data and one for instructions (on the S3 at 0x3FC8_8000 and 0x4037_0000).
- **RTC memory** is a small SRAM, 8 or 16 KB, that stays powered in deep sleep ([[rtc-memory]]).
- **Flash** is a separate chip (or a die in the package): megabytes, slow, holding the program and its constants. The CPU reaches it through the cache, as a window of addresses filled on demand ([[flash-and-the-cache]]).
- **PSRAM** is an optional extra RAM chip, 2 to 32 MB depending on chip and module, mapped like the flash and slower than SRAM ([[using-psram]]).

### Where each thing lands

| Thing | Example | Lives in | Survives |
|---|---|---|---|
| A string constant | \`"hello"\`, a \`const\` table | flash, read through the cache | everything; costs no RAM |
| A global variable | \`int count = 0;\` | SRAM (data) | nothing: it is set up again at each boot |
| A local variable | inside a function | the task's stack, in SRAM | until the function returns |
| Memory you ask for | \`malloc\`, \`new\`, a \`String\` | the heap in SRAM (big blocks may go to PSRAM) | until you free it |
| A function | \`loop()\` | flash, through the cache | everything |
| A handler marked \`IRAM_ATTR\` | an interrupt routine | instruction RAM, copied from flash at boot | code is reloaded each boot |
| A variable marked \`RTC_DATA_ATTR\` | a boot counter | RTC memory | deep sleep, not power loss |

### Reading an address

Crash reports are full of addresses, and the first digits say which memory. On the ESP32 and the S3:

| What | ESP32 | ESP32-S3 |
|---|---|---|
| Boot ROM code | 0x4000… | 0x4000… |
| Constants in flash | 0x3F40… | 0x3C… |
| Code in flash | 0x400D… | 0x42… |
| Data RAM: globals, heap, stacks | 0x3FFA… to 0x3FFF… | 0x3FC8… to 0x3FCF… |
| Code in RAM (IRAM) | 0x4008… | 0x4037… to 0x403D… |
| RTC memory | 0x5000… | 0x5000… |

A backtrace line such as \`0x400d1a2c:0x3ffb1f90\` therefore says: the code is in flash, the stack is in RAM.

### Traps

The Arduino IDE's summary has two numbers. "Program storage space" is flash. "Global variables use … of dynamic memory" is only the static part of SRAM; the heap and the stacks are what is left over, and they are what a long-running sketch exhausts, usually by growing and freeing many differently sized \`String\`s ([[heap-and-fragmentation]]).

> [!key] The chip sees ROM, SRAM, RTC memory, a flash window and optional PSRAM as stretches of one address space. Constants and code live in flash, variables in SRAM, and the first digits of an address tell you which.`,
  ideas: [
    'Code and constants live in flash and are read through a cache; variables, stacks and the heap live in SRAM.',
    'The same SRAM is reachable through a data window and an instruction window at different addresses.',
    'RTC memory is the only RAM that survives deep sleep; ROM is fixed at the factory.',
    'The first digits of an address in a crash report say whether it points to flash, RAM or ROM.'
  ],
  pitfalls: [
    'The sketch uses 30 % of memory, so there is plenty of RAM left — That percentage is flash. RAM use is the second line, and the heap and the stacks come on top of it at run time.',
    'A const array costs RAM — It stays in flash and is read through the cache. Only copying it into a variable uses RAM.',
    'A function must be in RAM to run fast, always — Code in flash runs from the cache at nearly full speed. RAM is needed for interrupt handlers and code that must run while the flash is busy.'
  ],
  terms: [
    { term: 'SRAM', also: ['internal RAM', 'on-chip RAM'], def: 'The fast static RAM on the chip, 272 to 768 KB depending on the model. Variables, stacks, the heap and fast code live there.' },
    { term: 'ROM', also: ['boot ROM', 'mask ROM'], def: 'Memory burned in at the factory that cannot be changed: the first code that runs, and some library and driver routines.' },
    { term: 'IRAM', also: ['instruction RAM', 'IRAM_ATTR'], def: 'The part of SRAM used for code instead of data. Interrupt handlers and code that must run while the flash is busy are placed there with IRAM_ATTR.' },
    { term: 'DRAM', also: ['data RAM', 'DRAM_ATTR'], def: 'The part of SRAM used for data: globals, the heap and stacks. Constants that an interrupt handler reads can be placed here with DRAM_ATTR.' },
    { term: 'Heap', also: ['dynamic memory', 'free heap'], def: 'The pool of RAM handed out by malloc, new and String at run time and given back by free. Its free size is what ESP.getFreeHeap() reports.' },
    { term: 'RTC memory', also: ['RTC_DATA_ATTR', 'RTC RAM'], def: 'A small SRAM, 8 or 16 KB on most chips, that stays powered in deep sleep, so variables in it keep their values across sleeps but not across a power loss.' }
  ],
  code: [
    {
      title: 'Where do things land?',
      about: 'Prints the address of a string constant, a global, a local, a block from malloc, a function in flash and a function placed in RAM. Compare the first digits with the table above.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      cpp: String.raw`
        #include <stdlib.h>

        const char *message = "hello";                    // the characters live in flash
        int counter = 42;                                  // a global variable: SRAM
        int IRAM_ATTR fastFunction() { return 1; }         // code kept in instruction RAM

        void show(const char *what, const void *p) {
          Serial.printf("%-30s %p\n", what, p);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          int local = 1;
          void *block = malloc(1000);
          show("string constant", message);
          show("global variable", &counter);
          show("local variable (stack)", &local);
          show("malloc block (heap)", block);
          show("function in flash (setup)", (const void *)setup);
          show("function in RAM (IRAM_ATTR)", (const void *)fastFunction);
          free(block);
        }

        void loop() {}
      `,
      na: { py: 'MicroPython hides addresses on purpose: every value is an object on its own garbage-collected heap, and there is no difference between a global, a local and a constant at that level.', blocks: 'Blocks have no way to ask for the address of a value; the idea is in the C++ version.' },
      output: `
        string constant                0x3f400d1c
        global variable                0x3ffb2f10
        local variable (stack)         0x3ffb21c4
        malloc block (heap)            0x3ffb4a68
        function in flash (setup)      0x400d1b24
        function in RAM (IRAM_ATTR)    0x4008a0f4
      `,
      notes: ['The exact numbers differ from build to build; the first digits are the lesson. On an ESP32-S3 the same program shows 0x3c…, 0x3fc9…, 0x42… and 0x4037….']
    },
    {
      title: 'Free heap and the largest block',
      about: 'Prints how much heap is free, and the size of the biggest block that can still be allocated, before and after a 50 000-byte allocation. The largest block is the number that predicts whether the next allocation will succeed.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Free heap: ] (free heap))
          print (join [Largest free block: ] (largest free block))
          set [a v] to (allocate (50000) bytes)
          print (join [After 50 000 bytes: ] (free heap))
          free (a)
          print (join [After free: ] (free heap))
      `,
      cpp: String.raw`
        void report(const char *when) {
          Serial.printf("%-20s free %7lu, largest block %7lu, lowest ever %7lu\n", when,
                        (unsigned long)ESP.getFreeHeap(), (unsigned long)ESP.getMaxAllocHeap(), (unsigned long)ESP.getMinFreeHeap());
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          report("at start");
          void *a = malloc(50000);
          report("after 50 000 bytes");
          free(a);
          report("after free");
        }

        void loop() {}
      `,
      py: String.raw`
        import gc, esp32

        def report(when):
            heaps = esp32.idf_heap_info(esp32.HEAP_DATA)   # a list of (total, free, largest block, lowest free)
            print(when, "- MicroPython heap free:", gc.mem_free(),
                  "| IDF heap free:", sum(h[1] for h in heaps), "| largest IDF block:", max(h[2] for h in heaps))

        report("at start")
        a = bytearray(50000)
        report("after 50 000 bytes")
        del a
        gc.collect()
        report("after free")
      `,
      output: `
        at start             free  295488, largest block  113792, lowest ever  295488
        after 50 000 bytes   free  245436, largest block   63740, lowest ever  245436
        after free           free  295488, largest block  113792, lowest ever  245436
      `,
      notes: ['The figures are an example from a bare ESP32 sketch; yours will differ with the chip, the libraries and Wi-Fi or Bluetooth, which take tens of kilobytes when started.', 'MicroPython has its own garbage-collected heap, carved out of the same RAM; gc.mem_free() reports that one, and the IDF figures are what is left for the system.']
    }
  ],
  quiz: [
    { q: 'A sketch reports "Sketch uses 38 % of program storage space". What does that figure measure?', choices: ['RAM used by variables', 'The flash occupied by the program and its constants', 'The heap in use', 'The cache'], a: 1, why: 'Program storage space is the flash. RAM use is the second line of the summary ("global variables"), and the heap and stacks come on top at run time.' },
    { q: 'A backtrace shows the address 0x400d2f4c. What is it?', choices: ['A variable in RAM', 'A constant in flash', 'Code in flash, in the ESP32\'s code window', 'A register of a peripheral'], a: 2, why: 'On the ESP32 the code window of the flash starts around 0x400D0000. Variables sit at 0x3FFB… and constants at 0x3F40….' },
    { q: 'A global variable keeps its value across a deep-sleep wake-up unless it is placed in RTC memory.', a: false, why: 'Normal SRAM loses its content in deep sleep and the program restarts, so a plain global starts again from its initial value. Only RTC memory (RTC_DATA_ATTR) survives.' },
    { q: 'Free heap is 100 KB, yet malloc(60000) fails. What is the likely reason?', choices: ['malloc is limited to 32 KB', 'The free memory is split into pieces and none is 60 KB long', 'The stack is full', 'The cache is disabled'], a: 1, why: 'Memory is free in pieces (fragmentation, and several separate regions). The largest free block, not the total, decides whether an allocation succeeds.' }
  ],
  applications: [
    'Reading a Guru Meditation report: the first digits of every address say whether the fault is in flash code, RAM or a bad pointer.',
    'Deciding what to keep as const in flash: lookup tables, web pages and fonts, so they cost no RAM.',
    'Keeping a boot counter or a calibration in RTC memory across deep sleeps.',
    'Watching the largest free block in a field device to catch a memory leak weeks before it crashes.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*, "Memory Organization" and the address-mapping tables.',
    'Espressif, *ESP-IDF Programming Guide*, "Memory Types" and "Heap Memory Allocation".',
    'Arduino core for ESP32 documentation, the ESP class: getFreeHeap, getMaxAllocHeap, getHeapSize (core 3.3).'
  ],
  sim: 'ic-memory-map'
},

/* ================================================================ flash and the cache */
{
  id: 'flash-and-the-cache',
  parent: 'inside-the-chip',
  title: 'Flash, the cache and code that must be in RAM',
  level: 3,
  short: 'Your program sits in a slow serial flash chip and runs through a small cache. When the flash is busy being written, the cache goes off — and everything that must keep running, above all an interrupt handler, has to be in RAM.',
  keywords: ['flash', 'cache', 'IRAM_ATTR', 'DRAM_ATTR', 'ARDUINO_ISR_ATTR', 'ESP_INTR_FLAG_IRAM', 'interrupt handler', 'Cache disabled but cached memory region accessed', 'Guru Meditation', 'flash write', 'erase', 'execute in place', 'XIP', 'MMU', 'NVS'],
  prereq: ['memory-map', 'interrupts', 'cpu-cores-and-clocks'],
  related: ['flash-memory-on-modules', 'nvs-and-preferences', 'flash-wear', 'guru-meditation-and-backtraces', 'from-interrupt-to-task', 'ota-updates', 'partition-tables'],
  body: `Your program is stored in a flash chip, and flash is a poor place to run it from. It speaks a serial protocol, four or eight data lines at tens of megahertz, and delivers bytes in bursts, while the core wants a new instruction every few nanoseconds. The **cache** bridges the two. Understanding it explains one of the few rules in ESP programming that looks arbitrary: an interrupt handler must live in RAM.

### How the cache works

A cache is a small, fast memory that keeps copies of recently used pieces of flash. The CPU asks for an address in the flash window. If the piece is in the cache — a *hit* — the answer comes in a few cycles. If not — a *miss* — the CPU waits while the cache reads a 32-byte line from flash. The original ESP32 has 32 KB of cache for each core, the C3 16 KB (datasheet figures). A memory-management unit maps the flash into the address windows in blocks of 64 KB, which is how a program of megabytes appears at a few fixed addresses. Loops and often-used functions stay cached; code run once, such as \`setup()\`, pays for its misses.

### When the cache goes off

Flash cannot be read while it is being erased or written. Erasing one 4 KB sector takes tens of milliseconds, and every write to flash — saving a setting with Preferences, a file in LittleFS, an update over the air — does it. For that time the system switches the cache off and parks the other core. Code that lives in flash cannot run at all; only code and data in RAM can.

### The rule for interrupt handlers

What happens to an interrupt that arrives meanwhile depends on how it was registered:

| Handler | During a flash write | Result |
|---|---|---|
| In IRAM (\`IRAM_ATTR\`) | runs | on time, with steady latency |
| In flash, registered the ordinary way | held back until the cache is on again | late by the length of the flash operation |
| In flash, registered "IRAM-safe" | runs, and touches flash with the cache off | crash: "Cache disabled but cached memory region accessed" |

The standard Arduino build registers pin interrupts the ordinary way, so a handler in flash is merely late; ESP-IDF drivers with their "IRAM-safe" option set, and the Arduino build option "ISR in IRAM", register them IRAM-safe, and then a handler in flash is a crash waiting for the next flash write. The portable habit is simple: **mark every handler \`IRAM_ATTR\`**.

### What else must be in RAM

Everything the handler calls — a helper function in flash is as fatal as the handler itself — and constants it reads: a lookup table is flash data unless declared \`DRAM_ATTR\`. Keep handlers tiny: set a flag or a counter, give a semaphore, and leave \`Serial.print\`, \`malloc\` and Wi-Fi calls to ordinary code, because they live in flash or take locks ([[from-interrupt-to-task]]). The same trick, placing code in IRAM, also gives a hot loop steady timing, since it can never miss the cache.

> [!key] Flash is read through a small cache, and while the flash is written the cache is off. Interrupt handlers, everything they call and the constants they read therefore belong in RAM: IRAM_ATTR on the code, DRAM_ATTR on the tables.`,
  ideas: [
    'Code runs from flash through a cache; a miss makes the CPU wait for a 32-byte line.',
    'Writing or erasing flash switches the cache off for tens of milliseconds and parks the other core.',
    'An interrupt handler registered IRAM-safe must be in IRAM, with everything it calls and reads, or the chip crashes.',
    'A handler in flash that is registered the ordinary way does not crash; it is held back, so it runs late.'
  ],
  pitfalls: [
    'My interrupt handler works on the bench, so it is fine — The crash appears only when a flash write coincides with an interrupt: after saving settings or during an update. Test while writing.',
    'Marking the handler IRAM_ATTR is enough — Any function it calls must also be in RAM, and so must constants it reads. One call into flash code is as bad as none.',
    'Serial.print in a handler is fine for debugging — It lives in flash, takes locks and may block. Set a flag and print from loop().'
  ],
  terms: [
    { term: 'Cache', also: ['flash cache', 'instruction cache'], def: 'A small fast memory that holds copies of recently used flash contents, so the CPU does not wait for the slow serial flash on every instruction.' },
    { term: 'Execute in place', also: ['XIP'], def: 'Running the program directly from flash through the cache, instead of copying it all into RAM first. It is how an ESP runs programs far larger than its SRAM.' },
    { term: 'IRAM_ATTR', also: ['IRAM-safe', 'ARDUINO_ISR_ATTR'], def: 'An attribute that puts a function in instruction RAM so it can run while the flash cache is off. Interrupt handlers should carry it.' },
    { term: 'DRAM_ATTR', def: 'An attribute that puts a constant or table in data RAM instead of flash, so an interrupt handler can read it while the cache is off.' },
    { term: 'ISR', also: ['interrupt service routine', 'interrupt handler'], def: 'A function the processor runs the moment an event such as a pin change or a timer alarm occurs, interrupting the normal program. It must be short.' }
  ],
  code: [
    {
      title: 'An interrupt handler built to survive flash writes',
      about: 'Counts button presses in an interrupt handler. The handler carries IRAM_ATTR, touches only a volatile counter and a core function meant for handlers, and leaves the printing to loop().',
      needs: 'An ESP32 DevKit and a push button.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [input with pull-up v]
          set [shown v] to (0)
          forever
            if <(presses) ≠ (shown)> then
              set [shown v] to (presses)
              print (join [presses: ] (shown))
            end
          end

        when pin (4) goes [low v]     // runs as an interrupt handler: keep it tiny
          if <((microseconds since start) - (last)) > (50000)> then
            change [presses v] by (1)
            set [last v] to (microseconds since start)
          end
      `,
      cpp: String.raw`
        const int BUTTON = 4;                  // button to GND, internal pull-up

        volatile uint32_t presses = 0;         // written by the handler, read by loop(): volatile
        volatile uint32_t lastPress = 0;

        void IRAM_ATTR onButton() {            // IRAM_ATTR: the handler stays in RAM
          uint32_t now = micros();             // micros() is meant to be called from handlers
          if (now - lastPress > 50000) {       // ignore bounces within 50 ms
            presses++;
            lastPress = now;
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          attachInterrupt(digitalPinToInterrupt(BUTTON), onButton, FALLING);
        }

        void loop() {
          static uint32_t shown = 0;
          if (presses != shown) {              // Serial.print is not allowed in the handler: do it here
            shown = presses;
            Serial.printf("presses: %lu\n", (unsigned long)shown);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        presses = 0
        last_press = 0

        def on_button(pin):                    # scheduled soon after the pin change, as ordinary code
            global presses, last_press
            now = time.ticks_ms()
            if time.ticks_diff(now, last_press) > 50:     # ignore bounces within 50 ms
                presses += 1
                last_press = now

        button = Pin(4, Pin.IN, Pin.PULL_UP)
        button.irq(trigger=Pin.IRQ_FALLING, handler=on_button)

        shown = 0
        while True:
            if presses != shown:
                shown = presses
                print("presses:", shown)
            time.sleep_ms(10)
      `,
      output: `
        presses: 1
        presses: 2
        presses: 3
      `,
      notes: ['In MicroPython the handler is not a true interrupt routine: the runtime notes the event and calls your function a moment later, as normal code, so none of the IRAM rules apply — and its latency is in milliseconds, not microseconds.', 'Try it with a sketch that also saves a value with Preferences every few seconds: with the handler in IRAM nothing changes, and the count stays right.']
    }
  ],
  examples: [
    {
      title: 'How many interrupts does a flash write hold back?',
      q: 'A timer interrupt fires every 1 ms. A sketch saves a setting, and the flash erase and write keep the cache off for 40 ms. The handler is in flash and registered the ordinary way. What happens?',
      steps: ['Nothing runs from flash for 40 ms, so the interrupt is held pending.', 'During the 40 ms the timer would have fired $40 / 1 = 40$ times, but a pending interrupt is a single flag: when the cache comes back the handler runs once, not 40 times.', 'If the handler counted ticks, the count is now short by about 39.'],
      a: 'No crash, but about 39 ticks are lost and the one that is handled is up to 40 ms late. A handler in IRAM, registered IRAM-safe, would have run all 40 times.'
    }
  ],
  quiz: [
    { q: 'Why must the cache be switched off while the flash is being erased?', choices: ['To save power', 'The flash chip cannot be read while it is busy, so cached addresses could not be refilled', 'The cache is full after an erase', 'The erase deletes the cache contents'], a: 1, why: 'A flash chip busy with an erase or a write does not answer reads. With the cache off nothing in the flash window can be fetched, so only RAM-resident code can run.' },
    { q: 'An interrupt handler registered IRAM-safe sits in flash. The sketch saves a setting while the interrupt fires. What happens?', choices: ['The handler runs late', 'The interrupt is lost', 'The chip crashes with "Cache disabled but cached memory region accessed"', 'Nothing: flash code is always readable'], a: 2, why: 'An IRAM-safe interrupt is allowed to run while the cache is off, but this handler needs flash. The CPU touches an unreadable address and the chip panics.' },
    { q: 'Marking the handler IRAM_ATTR is enough to make it safe, whatever it calls.', a: false, why: 'Every function the handler calls must be in RAM too, and constants it reads must be in data RAM (DRAM_ATTR). One call into flash code is enough to crash it.' },
    { q: 'Which is the safest design for reacting to a pin change?', choices: ['Print the pin state in the handler with Serial.print', 'Allocate a String in the handler', 'In an IRAM_ATTR handler set a volatile flag or counter, and act on it in loop()', 'Call delay(10) in the handler to debounce'], a: 2, why: 'A handler should do the least possible: record the event in RAM and return. Printing, allocating and delaying are slow, take locks or live in flash.' }
  ],
  applications: [
    'Rotary encoders, pulse counters and flow meters that count edges in a handler.',
    'Timer interrupts that sample a sensor at a steady rate while the program also saves settings.',
    'Motor-control code that must keep running during an over-the-air update.',
    'Placing a hot loop in IRAM so that its timing never depends on cache misses.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Memory Types" (IRAM and DRAM), "Interrupt Allocation" (IRAM-safe interrupt handlers) and the SPI flash API (concurrency constraints).',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-C3 Series Datasheet*, the Cache and External Memory subsections.',
    'Arduino core for ESP32 documentation, GPIO API: attachInterrupt, and the note on IRAM_ATTR (core 3.3).'
  ],
  sim: 'ic-flash-cache'
},

/* ================================================================ the boot ROM */
{
  id: 'the-rom-bootloader',
  parent: 'inside-the-chip',
  title: 'The boot ROM and the second-stage bootloader',
  level: 2,
  short: 'Between power-on and your setup() run four stages: fixed ROM code, a second-stage bootloader in flash, the application\'s own start-up, and the framework. Each prints something, so the console tells you where a boot stopped.',
  keywords: ['boot ROM', 'bootloader', 'second stage bootloader', 'partition table', 'otadata', 'app_main', 'loopTask', 'rst:', 'boot:', 'invalid header', 'ets Jun  8 2016', 'SPI_FAST_FLASH_BOOT', 'waiting for download', 'bootloader offset', '0x1000', '0x8000', 'startup'],
  prereq: ['memory-map', 'strapping-pins', 'flash-and-the-cache'],
  related: ['boot-modes-and-download-mode', 'reading-boot-messages', 'partition-tables', 'ota-partitions-and-rollback', 'secure-boot', 'flashing-and-esptool', 'reset-reasons'],
  body: `When power arrives the chip is not empty-handed. Part of it is a **boot ROM**: a few hundred kilobytes of code etched into the silicon at the factory — 384 KB on the S3 and C3, 320 KB on the C6, 448 KB on the ESP32 by the catalogue's count. It cannot be erased, spoiled by a bad upload or switched off, which is why a board with wrecked flash can still be rescued over a cable.

### From power-on to setup()

1. **Reset is released.** The supply is steady, EN is high, and the strapping pins are sampled.
2. **The ROM decides.** From the strapping pins and the eFuses it picks a boot mode ([[boot-modes-and-download-mode]]) and prints one line with the reset reason and the mode, at 115200 baud on UART0 and over USB on chips with a USB port of their own.
3. **The ROM loads the second-stage bootloader.** It reads the first piece of the program at a fixed flash offset — 0x1000 on the ESP32 and S2, 0x0 on the S3, C3, C6, C2 and H2, 0x2000 on the C5 and P4 — checks it, copies it into RAM and jumps to it. With secure boot on it checks a signature first.
4. **The second stage chooses the program.** It reads the partition table (at 0x8000 by default), looks at the \`otadata\` entry to learn whether the factory app or one of two update slots is current, checks that image, maps it into the flash window and jumps to it. This is what makes updates over the air, and rollback, possible ([[ota-partitions-and-rollback]]).
5. **The application starts.** Both cores are set up, then the heap and the FreeRTOS scheduler. The Arduino start-up code then prepares NVS, hands any PSRAM to the heap and starts a task named \`loopTask\`, which calls \`setup()\` once and \`loop()\` for ever. MicroPython mounts its file system and runs \`boot.py\`, then \`main.py\`.

### What each stage says

The ROM's line looks like \`rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)\`: why the chip restarted, then which boot mode the pins chose. The second stage prints lines that start with \`boot:\`, listing the partition table and the app it loaded; the application adds its own \`cpu_start\` lines before your first \`Serial.print\`. How much you see depends on the build ([[reading-boot-messages]] decodes the common lines).

| Message | What it means |
|---|---|
| \`invalid header: 0xffffffff\` | The ROM found erased flash where the bootloader should be: nothing flashed, the wrong offset, or flash that cannot be read. |
| \`waiting for download\` | Download mode was chosen; the ROM waits for esptool. |
| endless resets, "flash read err" | The flash cannot be read: wrong voltage setting, a bad joint, a supply that sags. |

### Why it matters

The first stage is fixed; the second lives in flash and can be replaced. That is why the offset in a flashing command differs between chips, and why a bootloader written to the wrong one ends in \`invalid header\`. The whole sequence takes a few hundred milliseconds, and every wake-up from deep sleep runs a shortened version of it.

> [!key] Fixed ROM code picks the boot mode and loads a second-stage bootloader from flash; that bootloader reads the partition table, picks and checks an app and jumps to it; the framework then calls setup().`,
  ideas: [
    'The boot ROM is in the silicon, cannot be changed and always runs first, so a chip with broken flash can still be reprogrammed.',
    'The ROM loads the second-stage bootloader from a fixed offset: 0x1000 on the ESP32, 0x0 on most newer chips.',
    'The second stage reads the partition table, chooses the app (factory or an update slot), verifies it and jumps.',
    'The ROM line "rst:… boot:…" gives the reset reason and the boot mode; the later lines come from the second stage and the app.'
  ],
  pitfalls: [
    'The bootloader is part of my sketch — It is a separate program in flash, written once beside the partition table and the app. A normal upload leaves it untouched.',
    'Every chip takes the bootloader at 0x1000 — Only the ESP32 and S2. The S3, C3, C6, C2 and H2 take it at 0x0 and the C5 and P4 at 0x2000; a wrong offset gives "invalid header".',
    'setup() is the first code that runs — The ROM, the bootloader and the framework start-up all run before it, and a problem in any of them stops the boot before your code.'
  ],
  terms: [
    { term: 'Boot ROM', also: ['ROM bootloader', 'first-stage bootloader'], def: 'Code burned into the chip at the factory that runs first after reset. It reads the boot mode, then either loads the second-stage bootloader from flash or runs the download loader.' },
    { term: 'Second-stage bootloader', also: ['bootloader', 'bootloader.bin'], def: 'A small program in flash that the ROM loads. It reads the partition table, chooses and verifies the app, and starts it. It is written once and normally left alone.' },
    { term: 'Partition table', also: ['partitions.csv'], def: 'A small table in flash, at 0x8000 by default, that lists where the app slots, the settings storage and the file system start and how large they are.' },
    { term: 'otadata', also: ['OTA data partition'], def: 'A small partition in which the bootloader finds which update slot is current, so it can start the newest valid app or fall back to the previous one.' },
    { term: 'app_main', also: ['application start-up'], def: 'The function an ESP-IDF application starts in. In the Arduino core it creates the task that runs setup() and then loop().' }
  ],
  code: [
    {
      title: 'Which partition did the bootloader start?',
      about: 'Asks the system which app slot is running and which one the bootloader would choose next time. On a default Arduino layout that is "app0".',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Running from partition: ] (running partition label))
          print (join [It starts at address: ] (running partition address))
          print (join [Size in bytes: ] (running partition size))
      `,
      cpp: String.raw`
        #include "esp_ota_ops.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          const esp_partition_t *running = esp_ota_get_running_partition();
          const esp_partition_t *boot = esp_ota_get_boot_partition();
          Serial.printf("Running from: %s at 0x%06lx, size %lu bytes\n", running->label,
                        (unsigned long)running->address, (unsigned long)running->size);
          Serial.printf("The bootloader would choose: %s\n", boot->label);
          Serial.printf("IDF version: %s\n", ESP.getSdkVersion());
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32

        running = esp32.Partition(esp32.Partition.RUNNING)
        boot = esp32.Partition(esp32.Partition.BOOT)
        kind, subtype, address, size, label, encrypted = running.info()
        print("Running from:", label, "at", hex(address), "size", size, "bytes")
        print("The bootloader would choose:", boot.info()[4])
      `,
      output: `
        Running from: app0 at 0x010000, size 1310720 bytes
        The bootloader would choose: app0
        IDF version: v5.5.5
      `,
      notes: ['The official MicroPython images have a single "factory" slot, so there the answer is factory at 0x10000.', 'After an over-the-air update the two answers can differ for a moment: the new slot is running on trial and the bootloader will fall back if it is not confirmed.']
    }
  ],
  quiz: [
    { q: 'Why can a board whose flash was erased completely still be programmed over USB or serial?', choices: ['The bootloader is stored in a second flash chip', 'The boot ROM is in the chip and can run the download loader without any flash', 'The Arduino IDE rewrites the flash through the antenna', 'It cannot'], a: 1, why: 'The ROM is silicon, not flash. With erased flash it prints "invalid header" and, with the boot pin low, offers the download loader that esptool uses.' },
    { q: 'esptool is told to write the bootloader to 0x1000 on an ESP32-C3. What is the likely result?', choices: ['It works as on the ESP32', 'The ROM looks at 0x0, finds nothing valid and reports "invalid header"', 'The chip enters download mode by itself', 'The partition table is overwritten but the board boots'], a: 1, why: 'The C3\'s ROM reads the second-stage bootloader at flash offset 0x0, not 0x1000, so it finds erased flash there.' },
    { q: 'Which stage decides between the factory app and an over-the-air update slot?', choices: ['The boot ROM', 'The second-stage bootloader, using the partition table and otadata', 'The Arduino loop task', 'The Wi-Fi driver'], a: 1, why: 'The second stage reads the partition table and the otadata entry, checks the chosen image and starts it.' },
    { q: 'The first line printed at boot, "rst:0x1 (POWERON_RESET),boot:…", comes from your sketch.', a: false, why: 'It comes from the ROM, before any program in flash has run. It reports the reset reason and the boot mode chosen by the pins.' }
  ],
  applications: [
    'Recovering a board after a failed upload or an erased flash.',
    'Over-the-air updates with two app slots and automatic rollback.',
    'Reading the boot log to find out whether a failure is hardware, flashing or software.',
    'Factory programming, where the bootloader, partition table and app are written together at their offsets.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Bootloader" and "Application Startup Flow".',
    'Espressif, *esptool documentation*, "Boot Mode Selection" and "Firmware Image Format".',
    'Espressif, *ESP32-C3 Series Datasheet* and *ESP32 Series Datasheet*, the sections on ROM and boot mode.'
  ],
  sim: 'ic-boot-sequence'
},

/* ================================================================ boot modes and download mode */
{
  id: 'boot-modes-and-download-mode',
  parent: 'inside-the-chip',
  title: 'Boot modes and download mode',
  level: 2,
  short: 'The boot ROM chooses between running your program and waiting for a new one. How an upload really happens, how two spare serial lines press BOOT and RESET for you, and what to do by hand when they cannot.',
  keywords: ['download mode', 'boot mode', 'bootloader mode', 'DTR', 'RTS', 'auto reset', 'esptool', 'BOOT button', 'EN', 'CHIP_PU', 'GPIO0', 'GPIO9', 'stub', 'SLIP', 'chip-id', 'Wrong boot mode detected', 'Failed to connect', 'waiting for download'],
  prereq: ['the-rom-bootloader', 'strapping-pins', 'flashing-and-esptool'],
  related: ['usb-serial-bridges-and-auto-reset', 'upload-problems', 'disabling-debug-interfaces', 'drivers-and-serial-ports', 'efuses', 'usb-on-the-esp'],
  body: `In the first milliseconds of life a chip makes one decision: run the program in flash, or wait for a new one over a cable. The second is **download mode**, and every upload goes through it. [[strapping-pins]] holds the table of which pin does what; this page is about what the decision means, what an upload really does, and what to try when it will not work.

### The ROM's decision

After reset the boot ROM reads the boot pin — GPIO0 on the ESP32, S2 and S3, GPIO9 on the C3, C6 and H2. High, the pull-up's default, means "run the program". Low, together with the companion level some chips ask for, means "download". The level is read once; the program cannot change it, and the pin is an ordinary GPIO afterwards. Chips with a USB port of their own can also be sent into download mode from the USB side.

### What an upload does

In download mode the ROM runs a small serial loader on UART0, and over USB on chips that have it. The computer's tool, esptool, talks to it in packets framed with SLIP, a scheme that marks where each packet starts and ends:

1. **Sync** — esptool repeats a recognisable packet until the ROM answers, which also tells it which chip it has.
2. **Stub** — it copies a small helper program into RAM and starts it. The stub is quicker than the ROM loader: it accepts a higher baud rate, compressed data and erase commands.
3. **Write** — the images arrive in blocks at the offsets you gave: bootloader, partition table, app.
4. **Verify and reset** — esptool compares a checksum of what the chip holds and resets the chip into the new program.

### The reset trick: DTR and RTS

Most boards need no button press because the USB-serial chip has two spare control lines. RTS is wired through a transistor to EN (reset) and DTR to the boot pin, and the transistors are cross-coupled so that asserting both does nothing: a terminal that raises both lines when it opens a port will not reset the board. esptool's dance: assert RTS (chip in reset, boot pin high); assert DTR and release RTS (the chip leaves reset with the boot pin low: download mode); release DTR. A capacitor of 1 to 10 µF from EN to ground makes it reliable. Chips with built-in USB do the same with the virtual control lines of their own USB port. The simulation draws the waveforms.

### By hand

Hold BOOT, tap RESET (EN), release BOOT. With no buttons, ground the boot pin while applying power. To leave download mode, reset again without holding BOOT. To test the chain, run \`esptool --port COM3 chip-id\`: if it names the chip, the reset and the loader both work.

| esptool says | Usually |
|---|---|
| \`No serial data received\` | Wrong port, a charge-only cable, or no reset wiring: put the chip in download mode by hand. |
| \`Wrong boot mode detected (0x13)\` | The chip answered, but is running its program: the boot pin was high. |
| \`Timed out waiting for packet header\` | The chip never joined the dialogue: boot pin, supply, or a part holding a pin. |

> [!key] After reset the ROM reads one pin and either runs the program or waits in download mode, where esptool syncs, loads a stub and writes the images. DTR and RTS press BOOT and EN for you, so by hand you only need to do what they do.`,
  ideas: [
    'Download mode is chosen by the boot pin at reset; the program has no say, and the pin is a normal GPIO afterwards.',
    'esptool talks to the ROM in SLIP-framed packets: sync, load a stub into RAM, write compressed blocks, verify, reset.',
    'DTR drives the boot pin and RTS drives EN through two cross-coupled transistors, so a terminal asserting both does nothing.',
    'By hand: hold BOOT, tap RESET, release BOOT. A chip-id command proves that the whole chain works.'
  ],
  pitfalls: [
    'Hold BOOT the whole time while uploading — Only while the chip leaves reset. Holding it through the next reset puts the chip back in download mode instead of running your program.',
    'The auto-reset circuit is a luxury of expensive boards — Nearly every development board has it, because it costs two transistors. Bare modules and some clones lack it, or lack the EN capacitor that makes it reliable.',
    'If upload fails, the program on the chip is broken — In download mode the ROM does not run your program at all, so a broken program cannot cause "failed to connect". Look at cable, port, drivers and the boot pin.'
  ],
  terms: [
    { term: 'Download mode', also: ['bootloader mode', 'UART download', 'flash mode'], def: 'The state in which the ROM waits for a program over serial or USB instead of running the one in flash. Chosen by the boot pin at reset.' },
    { term: 'EN', also: ['CHIP_PU', 'RST', 'reset pin'], def: 'The enable pin of the chip. Held low it keeps the chip in reset; releasing it starts the boot. Boards connect it to the RESET button and, through a capacitor, to ground.' },
    { term: 'DTR and RTS', also: ['serial control lines'], def: 'Two spare output lines of a USB-serial chip. On ESP boards they are wired to the boot pin and EN so that the computer can start download mode by itself.' },
    { term: 'Stub loader', also: ['flasher stub', 'esptool stub'], def: 'A small helper program that esptool copies into RAM at the start of an upload. It is faster than the ROM loader and adds compression and erase commands.' },
    { term: 'SLIP', also: ['serial line IP framing'], def: 'A simple framing method that marks the start and end of each packet on a serial line with a special byte. esptool and the ROM loader use it for their commands.' }
  ],
  choose: {
    good: ['The automatic reset of a DevKit for everyday uploads', 'A BOOT and a RESET button on every prototype, even if auto-reset works', 'A pogo-pin fixture that pulls the boot pin low in production'],
    avoid: ['A board design with nothing to pull the boot pin or EN low: you will be unable to recover it', 'Disabling download mode in the eFuses before the final product is proven', 'A big capacitor on the boot pin, which makes the chip enter download mode by mistake'],
    check: ['That EN has its capacitor on a custom board', 'Which pin your exact chip uses as boot pin (GPIO0, GPIO9 or GPIO28)', 'Whether your cable carries data, and which COM port appears in download mode']
  },
  quiz: [
    { q: 'esptool reports "Wrong boot mode detected (0x13)! The chip needs to be in download mode". What does it mean?', choices: ['The upload speed is too high', 'The chip answered but was running its program: the boot pin was high at reset', 'The flash is full', 'The USB cable is charge-only'], a: 1, why: 'The ROM line esptool reads shows the normal boot mode (0x13, SPI flash boot). The chip is alive; it just was not asked to enter download mode.' },
    { q: 'On a DevKit, which control line of the USB-serial chip pulls the boot pin low?', choices: ['TX', 'DTR', 'RTS', 'CTS'], a: 1, why: 'DTR goes to the boot pin and RTS to EN. Asserting RTS resets the chip; asserting DTR holds the boot pin low as the chip leaves reset.' },
    { q: 'A terminal program opens a port and asserts both DTR and RTS. What does the auto-reset circuit do?', choices: ['Resets the chip and enters download mode', 'Resets the chip and runs the program', 'Nothing: asserting both is ignored', 'Burns an eFuse'], a: 2, why: 'The two transistors are cross-coupled so that both lines asserted release EN and the boot pin. Opening a serial monitor therefore does not reboot the board.' },
    { q: 'A program that writes the boot pin low in setup() puts the chip into download mode.', a: false, why: 'The boot pin is read once, at reset. After that it is an ordinary GPIO, and writing it has no effect on the boot mode.' }
  ],
  applications: [
    'Every upload from the Arduino IDE, PlatformIO or esptool.',
    'Recovering a board whose program crashes at start by forcing download mode with the BOOT button.',
    'Production lines, where a fixture pulls the boot pin low and esptool writes the images in seconds.',
    'Board design: choosing the two transistors, the EN capacitor and the two buttons.'
  ],
  sources: [
    'Espressif, *esptool documentation*, "Boot Mode Selection" (one page per chip) and "Serial Protocol".',
    'Espressif, hardware design guidelines and the schematics of the ESP32 DevKitC: the auto-reset circuit.',
    'Espressif, *ESP32-C6 Series Datasheet*, section "Strapping Pins".'
  ],
  sim: 'ic-auto-reset'
},

/* ================================================================ eFuses */
{
  id: 'efuses',
  parent: 'inside-the-chip',
  title: 'eFuses: settings burned once',
  level: 2,
  short: 'A block of cells inside the chip that can be written exactly once: factory data such as the MAC address, a few settings, and the keys of secure boot and flash encryption. They cannot be undone — so read freely, burn only on purpose.',
  keywords: ['eFuse', 'efuse', 'OTP', 'one-time programmable', 'MAC address', 'espefuse', 'summary', 'burn', 'blow', 'flash voltage', 'VDD_SPI_FORCE', 'DIS_USB_JTAG', 'secure boot', 'flash encryption', 'key block', 'chip revision', 'virtual eFuse', 'irreversible'],
  prereq: ['the-rom-bootloader', 'boot-modes-and-download-mode', 'strapping-pins'],
  related: ['efuse-keys-and-key-storage', 'secure-boot', 'flash-encryption', 'disabling-debug-interfaces', 'random-numbers-and-chip-identity', 'pins-at-boot', 'regulatory-approval'],
  body: `Inside the chip sits a block of **eFuses**: memory cells that can be written exactly once. Each is a tiny link in the silicon; programming blows it, and a blown link never heals. A bit that reads 0 can be made 1; a bit that reads 1 can never return to 0. Nothing else in the chip works like this, and it matters because every other setting you will meet can be changed by the next upload.

> [!warn] Reading eFuses is always safe. **Burning** them is permanent. A wrong burn can leave a module that never boots again, or one that can no longer be programmed. Never run a burn command copied from a forum without checking it against your own chip's documentation, and never on a board you cannot afford to lose.

### What lives there

- **Factory data**, written by Espressif and the module maker: the base MAC address, the chip revision and package, which flash or PSRAM is fitted, and calibration values for the ADC and the temperature sensor.
- **Settings that are yours to choose**: the voltage of the flash supply, whether JTAG over USB is open, whether download mode may be used, how much the ROM prints at boot, a custom MAC address.
- **Security**: the switches that turn on secure boot and flash encryption, and the keys they use. A key can be marked unreadable by software: only the hardware encryption blocks can then use it ([[efuse-keys-and-key-storage]]).
- **Room for your own data**: a few hundred bits for a serial number or a key.

How much room? By the catalogue the ESP32 has 1024 bits, of which 768 are free for customers; the C2 has 1024, with 256 for users; the S2, S3, C3, C6 and most newer chips have 4096 bits with 1792 for users.

### Reading them

~~~sh
espefuse --port COM3 summary
~~~

prints every field with its current value (older installations call the tool \`espefuse.py\`). The base MAC address can also be read from a program, as below. The field names differ from chip to chip and between revisions, which is one more reason never to burn by copying.

### Why they exist

A setting that an attacker could change would protect nothing. Closing a debug port, requiring signed firmware or encrypting flash only means something if the choice cannot be reversed by whoever holds the board. That is the purpose of an eFuse, and the cost of it. For learning, ESP-IDF has a "virtual eFuse" mode that keeps changes in RAM or flash, so you can rehearse a security set-up without burning anything.

> [!key] eFuses are one-way: a bit can go from 0 to 1 and never back. They hold the MAC address and chip data, a few settings and the security keys. Read them freely; burn them only after checking your exact chip, and only in a finished design.`,
  ideas: [
    'An eFuse bit can be changed from 0 to 1 once and never back: burning is permanent.',
    'They hold factory data (MAC, revision), a few settings (flash voltage, debug ports, download mode) and the secure-boot and flash-encryption keys.',
    'Key blocks can be made unreadable by software, so a stolen program cannot reveal them.',
    'Reading is harmless; the summary command and a few lines of code show everything that matters.'
  ],
  pitfalls: [
    'I can burn an eFuse and undo it by flashing a new program — The cell is physically blown. No upload, erase or factory reset can restore it.',
    'The same burn command works on every ESP32 — Field names and meaning differ between chips and even between revisions of one chip. A command for one can brick another.',
    'Burning the flash-voltage eFuse is a safe cure for a boot loop — It fixes one cause (a strapping pin), but burned to the wrong value it makes the flash unreadable for good. Moving the signal off the pin costs nothing and is reversible.'
  ],
  terms: [
    { term: 'eFuse', also: ['electronic fuse', 'efuse'], def: 'A one-time-programmable cell in the chip. Writing sets a bit from 0 to 1 by blowing a tiny link, and it can never be cleared again.' },
    { term: 'OTP', also: ['one-time programmable memory'], def: 'Memory that can be written once. The eFuse block is the OTP memory of the ESP chips.' },
    { term: 'MAC address', also: ['base MAC', 'hardware address'], def: 'A 6-byte address that identifies the chip on a network. Espressif burns a unique base address into every chip; the Wi-Fi, Bluetooth and Ethernet addresses are derived from it.' },
    { term: 'Burn', also: ['blow an eFuse', 'program an eFuse'], def: 'To write an eFuse bit. The word is meant literally: the link is destroyed, so the change is permanent.' },
    { term: 'Read protection', also: ['key read-protect', 'write protection'], def: 'An eFuse bit that stops software from reading, or changing, a key block. Once set, only hardware blocks such as the AES engine can use the key.' }
  ],
  choose: {
    good: ['Fixing the flash voltage in a finished design whose board cannot avoid the strapping level', 'Locking keys and turning on secure boot and flash encryption in a product that ships', 'Closing debug ports on units that leave your control'],
    avoid: ['Burning fuses on prototypes or on the one board you have', 'Burning to "fix" a boot problem you have not diagnosed', 'Running a script of burn commands you cannot explain line by line'],
    check: ['The exact field name for your chip and revision in its documentation', 'The summary before and after, saved to a file', 'That you can still program and recover a spare board with the same settings']
  },
  code: [
    {
      title: 'Read the factory identity from the eFuses',
      about: 'Prints the chip model and revision and the base MAC address burned into its eFuses. It only reads: nothing here changes any fuse.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Revision: ] (chip revision))
          print (join [Base MAC address: ] (MAC address))
      `,
      cpp: String.raw`
        #include "esp_mac.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Chip: %s, revision %d\n", ESP.getChipModel(), ESP.getChipRevision());
          uint8_t mac[6];
          esp_efuse_mac_get_default(mac);                  // the base address burned at the factory
          Serial.printf("Base MAC address: %02X:%02X:%02X:%02X:%02X:%02X\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, binascii, machine

        print("Chip:", sys.implementation._machine)
        uid = machine.unique_id()                           # the base MAC address from the eFuses
        print("Base MAC address:", binascii.hexlify(uid, ":").decode().upper())
      `,
      output: `
        Chip: ESP32-C3, revision 4
        Base MAC address: 7C:DF:A1:B2:C3:D4
      `,
      notes: ['The Wi-Fi station address is this value; the soft-AP, Bluetooth and Ethernet addresses are derived from it, so they differ in the last byte or so.', 'MicroPython does not report the chip revision.', 'To see every field, run espefuse summary on the computer: it is read-only too.']
    }
  ],
  quiz: [
    { q: 'An eFuse bit reads 1. What can be done to make it 0 again?', choices: ['Erase the flash', 'Flash a new program', 'Hold the boot pin low', 'Nothing: a blown eFuse stays blown'], a: 3, why: 'eFuses are physical links that are destroyed when written. No software or erase can restore them.' },
    { q: 'Why can a stolen board not reveal a key that was stored in an eFuse block with read protection?', choices: ['The key is encrypted by the MAC address', 'Software, including the attacker\'s, cannot read the block; only the hardware encryption blocks can use it', 'The key is stored in the cloud', 'The block is erased at power-off'], a: 1, why: 'The read-protect bit makes the block invisible to the CPU. The AES or HMAC hardware gets the key by an internal path.' },
    { q: 'You found a forum post that says "burn this eFuse to cure the boot loop". Which is the right first step?', choices: ['Run it on your only board', 'Check the field against your own chip\'s documentation, try a reversible cure first, and test on a spare board', 'Run it twice', 'Run it with the board unplugged'], a: 1, why: 'A wrong or misapplied burn is permanent. Field names differ by chip and revision, and most causes of a boot loop have a free, reversible fix.' },
    { q: 'Reading the eFuses with a summary command can change them.', a: false, why: 'Reading is harmless. Only a burn command (or a program that calls the burn API) writes a fuse.' }
  ],
  applications: [
    'The base MAC address that identifies each chip on Wi-Fi and Bluetooth networks.',
    'Secure boot and flash encryption in products that must not run foreign firmware or leak their code.',
    'Closing JTAG and download mode on units shipped to customers.',
    'Fixing the flash voltage in a design that cannot avoid the strapping pin.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "eFuse Manager" and the pages on secure boot and flash encryption.',
    'Espressif, *esptool documentation*, "espefuse" (summary, burn commands and their warnings).',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-C6 Series Datasheet*, the eFuse Controller subsection.'
  ],
  sim: 'ic-efuses'
},

/* ================================================================ the low-power domain */
{
  id: 'rtc-domain-and-lp-core',
  parent: 'inside-the-chip',
  title: 'The low-power domain and its small processor',
  level: 2,
  short: 'A sleeping chip is never quite off: a small low-power island stays powered, keeps a slow clock and a little memory, and watches for the event that should wake the rest. On most chips it even has a tiny processor of its own.',
  keywords: ['RTC', 'RTC domain', 'low-power domain', 'ULP', 'LP core', 'LP RISC-V', 'RTC memory', 'RTC GPIO', 'RTC_DATA_ATTR', 'deep sleep', 'wake-up', 'ULP-FSM', 'LP UART', 'LP I2C', 'power domain', 'slow clock'],
  prereq: ['memory-map', 'cpu-cores-and-clocks', 'the-rom-bootloader'],
  related: ['deep-sleep', 'wake-up-sources', 'rtc-memory', 'ulp-and-lp-coprocessors', 'power-modes', 'the-board-is-not-the-chip', 'battery-life-budget'],
  body: `A sleeping chip is never completely off. A small part of it, the **low-power domain**, stays powered on a trickle, keeps a slow clock running, remembers a little, and watches for the event that should wake the rest. Seeing that island explains deep sleep: what survives it, what can wake the chip, and why a coin-sized cell can last months.

### Two islands

Picture the chip as two islands joined by a bridge. The big one, the *high-power* side, holds the CPU cores, most of the SRAM, the radio and the fast peripherals. The small one holds a power-management unit that switches the big island on and off, a slow clock (an internal oscillator or an optional 32.768 kHz crystal), a few kilobytes of **RTC memory**, a set of **RTC pins** that keep working, and on most chips a **low-power coprocessor**. In deep sleep the big island has no power at all, which is why the chip draws microamps.

| Chip | Low-power processor | RTC memory | Deep sleep |
|---|---|---|---|
| ESP32 | ULP, a small state machine | 16 KB | 10 µA |
| ESP32-S3 | ULP-RISC-V and a state machine | 16 KB | 7 µA |
| ESP32-C3 | none | 8 KB | 5 µA |
| ESP32-C6 | LP RISC-V core, 20 MHz, own UART and I2C | 16 KB | 7 µA |
| ESP32-C5 | LP RISC-V core, 48 MHz | 16 KB | 12 µA |
| ESP32-P4 | LP RISC-V core, 40 MHz | 32 KB | 12 µA |
| ESP32-H2 | none (4 KB of low-power memory) | 4 KB | 7 µA |

### What the island does

- **Remembers.** Variables placed in RTC memory survive deep sleep, though not a power loss: a boot counter, the last reading, the state of a process ([[rtc-memory]]).
- **Wakes the chip.** A timer on the slow clock, a level on an RTC pin, a touch, or a decision of the coprocessor. Only the RTC pins can do it from deep sleep: on the ESP32 a set of 18 (GPIO0, 2, 4, 12 to 15, 25 to 27, 32 to 39), on the S3 GPIO0 to 21, on the C3 GPIO0 to 5, on the C6 GPIO0 to 7.
- **Works while everything sleeps.** The low-power core runs a tiny program: read a sensor over its own I2C every second, compare with a limit, and wake the main CPU only when the limit is crossed. It does that at microamps where the main CPU needs tens of milliamps ([[ulp-and-lp-coprocessors]]).

### What happens at wake-up

The big island is powered up and starts again from the beginning: ROM, bootloader, app, \`setup()\`. Normal RAM is gone, so anything that must carry over lives in RTC memory, in NVS or in a file. The program can ask what woke it and branch: a timer wake-up means "take a reading", a pin wake-up means "someone pressed the button".

> [!key] The low-power domain is a small island that stays alive in deep sleep with a slow clock, a little RTC memory, a few wake-capable pins and often a tiny coprocessor. The rest of the chip has no power, and wakes by starting over from reset.`,
  ideas: [
    'The chip has a big high-power side and a small low-power side; in deep sleep only the small one is powered.',
    'RTC memory (4 to 32 KB) keeps its content in deep sleep; normal RAM does not, and neither survives a power loss.',
    'Only the RTC or LP pins can wake the chip from deep sleep; the list differs per chip.',
    'A low-power coprocessor (ULP, LP RISC-V) can read sensors and decide to wake the main CPU while it sleeps.'
  ],
  pitfalls: [
    'Deep sleep pauses the program and continues afterwards — The program starts again from the top, as after a reset. Only RTC memory and settings in flash carry the state across.',
    'Any pin can wake the chip — Only the RTC (LP) pins can, and they differ by chip. Pick the pin from the pinout before you design the board.',
    'RTC memory keeps data for ever — It survives deep sleep but is lost when power is removed or a brownout occurs. Use NVS or a file for data that must not be lost.'
  ],
  terms: [
    { term: 'Low-power domain', also: ['RTC domain', 'LP domain'], def: 'The part of the chip that stays powered in deep sleep: the power-management unit, the slow clock, RTC memory, the RTC pins and any low-power coprocessor.' },
    { term: 'RTC GPIO', also: ['LP GPIO', 'RTC pin'], def: 'A pin that is still alive when the high-power side is off, so it can hold a level or wake the chip. Only some pins are RTC pins, and which ones depends on the chip.' },
    { term: 'ULP coprocessor', also: ['ULP', 'ULP-FSM', 'ULP-RISC-V'], def: 'An ultra-low-power helper processor in the ESP32, S2 and S3 that can read pins and sensors while the main CPU sleeps, and wake it when needed.' },
    { term: 'LP core', also: ['LP RISC-V', 'low-power core'], def: 'The low-power RISC-V coprocessor of the C5, C6 and P4. It runs ordinary compiled code on microamps and has its own UART and I2C on the low-power pins.' },
    { term: 'Slow clock', also: ['RTC clock', '32 kHz clock'], def: 'The low-frequency clock that keeps time in sleep: an internal oscillator of about 150 kHz that drifts, or an external 32.768 kHz crystal that is accurate.' }
  ],
  code: [
    {
      title: 'A counter that survives deep sleep, and one that does not',
      about: 'Counts wake-ups twice: in a variable placed in RTC memory and in an ordinary variable. After each 10-second deep sleep the first keeps counting and the second starts again from zero.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [rtc count v] to ((load [rtc count] from RTC memory) + (1))
          save (rtc count) as [rtc count] in RTC memory
          change [ram count v] by (1)
          print (join [Wake-up number ] (rtc count))
          print (join [Counted in normal RAM: ] (ram count))
          deep sleep for (10) seconds
      `,
      cpp: String.raw`
        RTC_DATA_ATTR int rtcCount = 0;     // lives in RTC memory: survives deep sleep, not a power loss
        int ramCount = 0;                   // lives in normal RAM: lost in deep sleep

        void setup() {
          Serial.begin(115200);
          delay(1000);
          rtcCount++;
          ramCount++;
          Serial.printf("Wake-up number %d (RTC memory), but %d in normal RAM\n", rtcCount, ramCount);
          Serial.println("Deep sleep for 10 seconds");
          Serial.flush();
          esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);    // microseconds
          esp_deep_sleep_start();                                // never returns: the chip restarts
        }

        void loop() {}
      `,
      py: String.raw`
        import machine

        rtc = machine.RTC()
        saved = rtc.memory()                           # bytes kept across deep sleep; empty after a power-on
        rtc_count = (saved[0] if saved else 0) + 1     # the counter in RTC memory
        ram_count = 1                                  # a normal variable: it starts again at every boot
        rtc.memory(bytes([rtc_count % 256]))
        print("Wake-up number", rtc_count, "(RTC memory), but", ram_count, "in normal RAM")
        print("Deep sleep for 10 seconds")
        machine.deepsleep(10000)                       # milliseconds; the chip restarts at the top
      `,
      output: `
        Wake-up number 1 (RTC memory), but 1 in normal RAM
        Deep sleep for 10 seconds
        Wake-up number 2 (RTC memory), but 1 in normal RAM
        Deep sleep for 10 seconds
        Wake-up number 3 (RTC memory), but 1 in normal RAM
      `,
      notes: ['Pressing RESET or unplugging the board restarts the RTC counter at 1: RTC memory survives deep sleep only.', 'On a board with native USB the serial monitor disconnects at every sleep and may miss the first line; use a UART bridge or watch the LED instead.', 'The MicroPython counter is one byte, so it wraps after 255; RTC().memory() holds up to 2048 bytes.']
    }
  ],
  quiz: [
    { q: 'After deep sleep a global variable declared with RTC_DATA_ATTR keeps its value, and an ordinary global does not. Why?', choices: ['The compiler stores ordinary globals in flash', 'RTC memory stays powered in deep sleep; normal SRAM loses its power and content', 'Ordinary globals are reset by the Wi-Fi driver', 'RTC memory is stored in the eFuses'], a: 1, why: 'The low-power domain keeps RTC memory powered. The high-power side, including the SRAM that holds ordinary variables, is switched off.' },
    { q: 'You want a button on GPIO7 of an ESP32-C3 to wake it from deep sleep. What is the problem?', choices: ['The button needs a resistor', 'Only GPIO0 to 5 are wake-capable RTC pins on the C3', 'The C3 cannot wake on a pin', 'GPIO7 is a flash pin'], a: 1, why: 'On the C3 only GPIO0 to 5 are powered in deep sleep and can wake the chip. Another pin can wake it from light sleep but not from deep sleep.' },
    { q: 'What can the LP RISC-V core of an ESP32-C6 do while the main CPU is in deep sleep?', choices: ['Run Wi-Fi', 'Read a sensor over its own I2C and decide whether to wake the main CPU', 'Run the full Arduino loop at 160 MHz', 'Nothing: it is only a timer'], a: 1, why: 'The LP core runs a small program with its own LP UART and LP I2C on the low-power pins, at microamps. It cannot run the radio.' },
    { q: 'RTC memory keeps its data when the battery is removed and replaced.', a: false, why: 'RTC memory is RAM: it needs power. It survives deep sleep, but a power loss clears it. Use NVS or a file for data that must survive that.' }
  ],
  applications: [
    'Battery sensors that sleep for minutes and keep a counter or a last reading in RTC memory.',
    'Doorbells and switches that wake on a pin and send one message.',
    'Soil or temperature nodes where a low-power core checks the sensor and wakes the chip only for an alarm.',
    'Wearables and trackers that keep time and state across long sleeps.'
  ],
  sources: [
    'Espressif, *ESP32-C6 Series Datasheet*, the low-power and power-management sections and the LP IO MUX table.',
    'Espressif, *ESP-IDF Programming Guide*, "Sleep Modes" and "ULP LP Core Coprocessor Programming".',
    'MicroPython documentation, *machine* module: deepsleep, RTC.memory and wake_reason (version 1.29).'
  ],
  sim: 'ic-power-domains'
},

/* ================================================================ the GPIO matrix */
{
  id: 'gpio-matrix-and-io-mux',
  parent: 'inside-the-chip',
  title: 'The GPIO matrix and IO MUX',
  level: 2,
  short: 'Behind the pins sits a switchboard: on the ESP chips most peripherals can be connected to almost any pin. A few have fast fixed routes, and a handful of pins can carry nothing else — knowing which saves wiring mistakes.',
  keywords: ['GPIO matrix', 'IO MUX', 'IOMUX', 'pin routing', 'peripheral signal', 'any pin', 'input-only', 'UART0', 'VSPI', 'FSPI', 'I2C pins', 'periman', 'peripheral manager', 'direct pins', 'Wire.begin', 'setPins', 'fan-out'],
  prereq: ['reading-a-pinout', 'peripherals-overview', 'strapping-pins'],
  related: ['input-only-and-special-pins', 'planning-pins', 'safe-pins-esp32', 'safe-pins-s3-c3-c6', 'uart-on-the-esp', 'spi-modes-and-speed', 'adc1-adc2-and-wifi'],
  body: `Every pin of the chip has a small selector, the **IO MUX**, and behind the pins sits a crossbar switch, the **GPIO matrix**. Together they answer the question "which peripheral is connected to which pin?". On most microcontrollers the answer is a fixed table: I2C is on these two pins, full stop. On the ESP chips it is mostly your choice, which is why \`Wire.begin(21, 22)\` takes the pin numbers as arguments.

### Two routes to a pin

Picture a railway station. A few express tracks run straight from certain platforms, the peripheral signals, to certain gates, the pins: that is the **IO MUX**. Everything else goes through a switching yard in the middle, the **GPIO matrix**, which can join any signal to any pin at the price of a short extra delay. Software picks the route for each signal; the Arduino core and MicroPython do it for you when you pass pin numbers.

- **Direct pins** exist only for a few signals: the console UART0, the chip's main SPI bus, JTAG and the USB data pins. They are fixed for each chip.
- **Through the matrix** go all the other peripherals, such as the second and third UART, I2C, I2S, PWM (LEDC), RMT, the pulse counter and CAN. On the C6, for example, the datasheet says they have no fixed pins.
- **The cost** is a delay of a couple of bus-clock cycles. It does not matter for I2C or a UART; for SPI at tens of megahertz the direct pins allow the highest speed.

| Chip | Console UART0 on its direct pins |
|---|---|
| ESP32 | TX GPIO1, RX GPIO3 |
| ESP32-S3 | TX GPIO43, RX GPIO44 |
| ESP32-C3 | TX GPIO21, RX GPIO20 |
| ESP32-C6 | TX GPIO16, RX GPIO17 |
| ESP32-H2 | TX GPIO24, RX GPIO23 |

### What the matrix cannot do

- **An output on an input-only pin.** GPIO34 to 39 of the ESP32 can only be read.
- **A pin that belongs to something else.** The flash pins (GPIO6 to 11 of the ESP32, GPIO12 to 17 of the C3), PSRAM pins, and the USB pins of chips with built-in USB, which stop being USB when you use them as GPIO.
- **Analogue functions.** ADC, DAC and touch channels are wired to particular pads and bypass the matrix: "ADC1 channel 6" is GPIO34 on the ESP32 whatever you do.

### In practice

You name the pin in code; the library sets the route. One output signal can be fanned out to several pins; two outputs cannot share a pin. In Arduino core 3 a peripheral manager keeps a ledger of which function owns each pin and releases the old owner when you reassign it. The pins in the examples (I2C on 21 and 22) are habits, not requirements — but choose with [[planning-pins]], because the matrix will happily connect a signal to a strapping or flash pin that then misbehaves.

> [!key] On the ESP chips most peripherals reach their pins through a programmable matrix, so the pin numbers are yours to choose; a few signals have faster fixed routes. The limits are pins that are input-only, belong to flash or USB, or carry analogue channels.`,
  ideas: [
    'The IO MUX gives a few signals fixed, fast routes; the GPIO matrix connects all other peripheral signals to any suitable pin.',
    'That is why I2C, a second UART, PWM and similar functions accept pin numbers in code.',
    'The matrix adds a small delay, which matters only for the fastest signals, such as SPI at tens of MHz.',
    'Input-only, flash, USB and analogue-channel pins are the exceptions to "any pin".'
  ],
  pitfalls: [
    'I2C only works on pins 21 and 22 — Those are the Arduino defaults for the ESP32. The matrix lets you put I2C on nearly any pins; check that the chosen pins are not input-only, flash or strapping pins.',
    'An analogue input can be moved like a digital function — ADC, DAC and touch channels are tied to particular pins. The matrix cannot move them.',
    'Every pin can be an output — The ESP32\'s GPIO34 to 39 are input-only, and pins wired to flash or PSRAM must not be used at all.'
  ],
  terms: [
    { term: 'GPIO matrix', also: ['GPIO crossbar', 'signal matrix'], def: 'A programmable switch inside the chip that connects peripheral input and output signals to any suitable GPIO pin. It adds a small, fixed delay.' },
    { term: 'IO MUX', also: ['IOMUX', 'pin multiplexer'], def: 'The per-pin selector that chooses between a few fixed functions and the matrix. Signals on their IO MUX pins skip the matrix and run at full speed.' },
    { term: 'Peripheral signal', also: ['function signal'], def: 'One input or output line of a peripheral, such as UART1 TX or SPI clock. The matrix routes each signal to a pin of your choice.' },
    { term: 'Input-only pin', also: ['input only'], def: 'A pin that can be read but not driven. On the ESP32, GPIO34 to 39 are input-only and also lack internal pull resistors.' },
    { term: 'Peripheral manager', also: ['periman'], def: 'The bookkeeping in the Arduino core 3 that records which peripheral owns each pin, so that reassigning a pin releases its previous function cleanly.' }
  ],
  choose: {
    good: ['Moving I2C, a second UART or PWM to the pins your board layout makes convenient', 'The direct pins for SPI at tens of MHz (displays, fast flash chips)', 'Fanning out one PWM signal to several pins'],
    avoid: ['Outputs on input-only pins, and anything on flash or PSRAM pins', 'Moving a signal onto a strapping pin without checking its level at reset', 'Reusing the USB pins as GPIO when you still need USB for upload and debugging'],
    check: ['The pin kinds in the pinout explorer for your exact chip and board', 'That the pin you chose has the job you want (output, ADC, wake-up)', 'The SPI speed: above about 20 MHz look for the direct pins']
  },
  code: [
    {
      title: 'A serial port on pins of your choice',
      about: 'Sets up UART1 on two ordinary pins and talks to itself: the transmit pin is wired to the receive pin with one jumper, and the text sent out comes back in. Nothing here is a fixed UART pin — the matrix makes the connection.',
      needs: 'An ESP32 DevKit, one jumper wire. On other chips choose any two free GPIOs (not flash, USB or strapping pins).',
      wiring: [['GPIO25', 'jumper wire to GPIO26', 'UART1 TX'], ['GPIO26', 'the other end of the jumper', 'UART1 RX']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (9600) baud with RX (26) and TX (25)
          forever
            send bytes [hello through the matrix] on UART (1)
            wait (0.2) seconds
            if <UART (1) has data> then
              print (read text from UART (1))
            end
            wait (0.8) seconds
          end
      `,
      cpp: String.raw`
        const int TX_PIN = 25;      // any free pins will do: the GPIO matrix connects them
        const int RX_PIN = 26;      // wire GPIO25 to GPIO26 with one jumper

        void setup() {
          Serial.begin(115200);
          Serial1.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);    // order: baud, config, RX pin, TX pin
        }

        void loop() {
          Serial1.println("hello through the matrix");         // out of UART1's TX signal, onto GPIO25
          delay(200);                                          // the jumper brings it back to GPIO26
          while (Serial1.available()) {                        // ...into UART1's RX signal
            Serial.write(Serial1.read());
          }
          delay(800);
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        TX_PIN = 25          # any free pins will do: the GPIO matrix connects them
        RX_PIN = 26          # wire GPIO25 to GPIO26 with one jumper

        uart = UART(1, baudrate=9600, tx=TX_PIN, rx=RX_PIN)

        while True:
            uart.write(b"hello through the matrix\n")     # out of UART1's TX signal, onto GPIO25
            time.sleep_ms(200)                            # the jumper brings it back to GPIO26
            data = uart.read()                            # ...into UART1's RX signal
            if data:
                print(data.decode(), end="")
            time.sleep_ms(800)
      `,
      output: `
        hello through the matrix
        hello through the matrix
        hello through the matrix
      `,
      notes: ['Remove the jumper and the lines stop: the data never came back, which proves the route was really made by the wire.', 'On the original ESP32 never put the pins on GPIO34 to 39 for TX; those pins are input-only.', 'The ESP32\'s UART0 is the console on GPIO1 and GPIO3; here UART1 shows that nothing ties a UART to its own pins.']
    }
  ],
  quiz: [
    { q: 'Why can I2C run on almost any two pins of an ESP32?', choices: ['The I2C peripheral has a pin for every GPIO', 'Its signals are connected to pins through the GPIO matrix', 'I2C is done in software on the second core', 'It cannot'], a: 1, why: 'I2C has no fixed pins; the matrix routes its clock and data signals to the pins you name. Defaults such as 21 and 22 are only conventions.' },
    { q: 'You route UART1 TX to GPIO34 of an ESP32 and nothing is sent. Why?', choices: ['UART1 needs GPIO17', 'GPIO34 is input-only and cannot drive a signal', 'The baud rate is wrong', 'Pins above 30 are reserved for ADC'], a: 1, why: 'GPIO34 to 39 are input-only on the ESP32. The matrix can route a signal to them only as an input.' },
    { q: 'You want an analogue reading on a pin the board makes convenient but which has no ADC channel. Can the matrix connect the ADC to it?', choices: ['Yes, any pin', 'No: ADC channels are wired to particular pads and bypass the matrix', 'Yes, but only in MicroPython', 'Only on the ESP32'], a: 1, why: 'Analogue functions are physical connections to specific pads. Only digital signals go through the matrix.' },
    { q: 'The direct IO MUX route is faster than the matrix, which makes a visible difference to a 115200-baud UART.', a: false, why: 'The matrix adds only a couple of bus-clock cycles. That is invisible at 115200 baud and at I2C speeds, and matters only for signals in the tens of megahertz.' }
  ],
  applications: [
    'Laying out a board so that the connectors fall on convenient pins instead of the default ones.',
    'Giving a project a second or third serial port for a GPS, a modem and a debug console.',
    'Putting a fast SPI display on the direct SPI pins so that it can run at its top clock.',
    'Fanning one PWM output out to several LED drivers.'
  ],
  sources: [
    'Espressif, *ESP32-C6 Series Datasheet*, section "IO MUX and GPIO Matrix" and the table of fixed IO MUX functions; the same section in the other datasheets.',
    'Espressif, *ESP-IDF Programming Guide*, "GPIO & RTC GPIO" and the SPI Master reference (IO MUX and GPIO matrix speed).',
    'Arduino core for ESP32 documentation, the UART and I2C APIs: choosing pins (core 3.3).'
  ],
  sim: 'ic-gpio-matrix'
},

/* ================================================================ the shared radio */
{
  id: 'the-shared-radio',
  parent: 'inside-the-chip',
  title: 'One radio, several protocols: coexistence',
  level: 2,
  short: 'Wi-Fi, Bluetooth and Zigbee or Thread all want the same 2.4 GHz transceiver and the same antenna, so the chip hands them out in time slices. That works well for ordinary use and costs throughput when two of them are busy at once.',
  keywords: ['coexistence', 'shared antenna', 'time-division', 'Wi-Fi and Bluetooth', 'one radio', 'transceiver', 'airtime', 'arbiter', 'BLE scan', 'A2DP', '802.15.4', 'Thread', 'Zigbee', 'throughput', 'ESP32-C6', 'ESP32-H2', 'interference'],
  prereq: ['radio-basics', 'reading-the-family-names', 'cpu-cores-and-clocks'],
  related: ['bluetooth-classic-and-le', 'ieee-802-15-4', 'esp-now-with-wifi', 'interference-and-channels', 'wifi-basics', 'ble-advertising', 'choosing-a-smart-home-radio'],
  body: `The ESP32 family has one 2.4 GHz radio and one antenna connection, and up to three protocols that want them: Wi-Fi, Bluetooth and, on some chips, IEEE 802.15.4 (the radio of Zigbee and Thread). They do not transmit at once; they take turns. The datasheets call this *coexistence*: time-division sharing of one transceiver.

### One bridge, three kinds of traffic

Think of a single-lane bridge with a warden. Wi-Fi, Bluetooth and 802.15.4 vehicles queue up; the warden, a small arbiter in hardware and software, lets one cross at a time. Every transmission and every listening window needs the bridge. Some vehicles cannot wait: a Bluetooth connection event must happen at its agreed instant, Wi-Fi beacons keep the connection alive, and an 802.15.4 frame expects a prompt acknowledgement. Bulk Wi-Fi data can wait and be retried. The warden gives way by urgency, and the patient traffic is delayed.

### What it costs

- **Wi-Fi throughput drops** while Bluetooth is busy: most with short connection intervals, a scan that listens almost all the time, or Bluetooth Classic audio streaming on the original ESP32.
- **Bluetooth is delayed**, or misses an event, while Wi-Fi moves a lot of data.
- **Latency becomes irregular**, because a request may wait for a slot.
- For ordinary use the price is small: Wi-Fi with BLE advertising every 100 ms, or a web server with an occasional phone connection, is hardly affected. Trouble starts when both run flat out.

Interference from other devices on the same band is a different problem ([[interference-and-channels]]).

### Which chips share what

| Chip | Wi-Fi | Bluetooth | 802.15.4 | To share |
|---|---|---|---|---|
| ESP32 | 4 | Classic and LE | no | two |
| ESP32-S2 | 4 | no | no | nothing |
| ESP32-S3, C3 | 4 | LE | no | two |
| ESP32-C6 | 6 | LE | yes | three |
| ESP32-H2 | no | LE | yes | two, both light |
| ESP32-P4 | no radio at all | | | a companion chip carries it |

The H2 has no Wi-Fi, the heavy user of airtime, and both its protocols are slow and send short frames, so sharing hardly costs anything (and its receiver draws far less). The C6 has the opposite problem in miniature: Wi-Fi 6, Bluetooth LE and Thread, which a Matter-over-Thread device uses together.

### Living with it

Advertise and connect at moderate intervals rather than the fastest; do not scan continuously while Wi-Fi is busy; put Zigbee or Thread on channels 15, 20 or 25, which fall in the gaps between Wi-Fi channels 1, 6 and 11; and let ESP-IDF's coexistence setting favour Wi-Fi, Bluetooth or a balance. If a design needs full speed on two protocols at once, use two chips, as a P4 with a C6 does.

> [!key] One transceiver and one antenna serve every 2.4 GHz protocol of the chip, in time slices handed out by priority. Light use hardly notices; two heavy users cost each other throughput, and the cure is gentler timing or a second radio chip.`,
  ideas: [
    'Wi-Fi, Bluetooth and 802.15.4 on one chip share one transceiver and one antenna, by taking turns.',
    'An arbiter grants slots by urgency: connection events, beacons and acknowledgements first, bulk data last.',
    'The cost is lower Wi-Fi throughput and irregular latency when two protocols are busy at once.',
    'The H2 has no Wi-Fi so its two protocols barely disturb each other; the C6 juggles three.'
  ],
  pitfalls: [
    'Wi-Fi and Bluetooth run side by side at full speed — They share airtime. Each gets what the other leaves, so heavy use of both costs throughput.',
    'A Bluetooth problem while Wi-Fi is on is a bug in my code — It is often just waiting for the radio. Longer intervals, a lower scan duty or a different timing usually cure it.',
    'More antennas fix coexistence — The sharing is in the transceiver and its slots, not in the antenna. A second antenna on the same chip does not give a second radio.'
  ],
  terms: [
    { term: 'Coexistence', also: ['RF coexistence', 'Wi-Fi and Bluetooth coexistence'], def: 'The set of rules and hardware by which several radio protocols on one chip share the transceiver and the antenna without destroying each other\'s transmissions.' },
    { term: 'Time-division sharing', also: ['time-division multiplexing', 'TDM'], def: 'Letting several users take turns on one resource, each in its own time slot. The radio of an ESP chip is shared this way between protocols.' },
    { term: 'Transceiver', also: ['radio', 'RF front end'], def: 'The circuit that sends and receives radio signals. An ESP chip has one 2.4 GHz transceiver, shared by all of its 2.4 GHz protocols.' },
    { term: 'Airtime', also: ['air time', 'channel time'], def: 'The time a transmission occupies the radio channel. Coexistence is a question of sharing airtime between protocols.' },
    { term: 'Arbiter', also: ['coexistence arbiter'], def: 'The part of the radio software and hardware that decides which protocol may use the transceiver next, by the priority of each request.' }
  ],
  choose: {
    good: ['Wi-Fi plus occasional Bluetooth LE for set-up or a phone connection', 'Matter over Thread with a Wi-Fi uplink on the ESP32-C6', 'Bluetooth LE and Thread together on the ESP32-H2'],
    avoid: ['Streaming Bluetooth Classic audio and heavy Wi-Fi traffic on one original ESP32', 'Continuous BLE scanning while expecting full Wi-Fi throughput', 'A Wi-Fi camera that also holds several fast BLE connections'],
    check: ['The advertising, connection and scan intervals you really need', 'Wi-Fi throughput with and without Bluetooth, measured on your board', 'Whether two chips would be simpler than one clever schedule']
  },
  code: [
    {
      title: 'Which radios does this chip carry?',
      about: 'Prints which of the four radios the chip you are running on has, using the capability flags of the build. It shows at once whether a board has anything to share.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Wi-Fi: ] (chip has Wi-Fi?))
          print (join [Bluetooth LE: ] (chip has Bluetooth LE?))
          print (join [Bluetooth Classic: ] (chip has Bluetooth Classic?))
          print (join [802.15.4: ] (chip has 802.15.4?))
      `,
      cpp: String.raw`
        #include "soc/soc_caps.h"

        void report(const char *name, bool has) {
          Serial.printf("%-26s %s\n", name, has ? "yes" : "no");
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Chip: %s\n", ESP.getChipModel());
        #if defined(SOC_WIFI_SUPPORTED) && SOC_WIFI_SUPPORTED
          report("Wi-Fi", true);
        #else
          report("Wi-Fi", false);
        #endif
        #if defined(SOC_BLE_SUPPORTED) && SOC_BLE_SUPPORTED
          report("Bluetooth LE", true);
        #else
          report("Bluetooth LE", false);
        #endif
        #if defined(SOC_BT_CLASSIC_SUPPORTED) && SOC_BT_CLASSIC_SUPPORTED
          report("Bluetooth Classic", true);
        #else
          report("Bluetooth Classic", false);
        #endif
        #if defined(SOC_IEEE802154_SUPPORTED) && SOC_IEEE802154_SUPPORTED
          report("802.15.4 (Zigbee, Thread)", true);
        #else
          report("802.15.4 (Zigbee, Thread)", false);
        #endif
        }

        void loop() {}
      `,
      py: String.raw`
        import sys

        print("Chip:", sys.implementation._machine)
        try:
            import network
            print("Wi-Fi:", "yes" if hasattr(network, "WLAN") else "no")
        except ImportError:
            print("Wi-Fi: no")
        try:
            import bluetooth
            print("Bluetooth LE: yes")
        except ImportError:
            print("Bluetooth LE: no")
        # MicroPython has no interface to Bluetooth Classic or to 802.15.4 (Zigbee, Thread),
        # so it cannot report them: use the C++ version, or the chip table
      `,
      output: `
        Chip: ESP32-C6
        Wi-Fi                      yes
        Bluetooth LE               yes
        Bluetooth Classic          no
        802.15.4 (Zigbee, Thread)  yes
      `,
      notes: ['An ESP32-C6 answers yes, yes, no, yes: three radios to share one transceiver. An ESP32-H2 answers no, yes, no, yes.', 'The MicroPython version can only see Wi-Fi and Bluetooth LE; Bluetooth Classic exists only on the ESP32 and S31, and 802.15.4 has no MicroPython support.']
    }
  ],
  quiz: [
    { q: 'Why does Wi-Fi throughput fall on an ESP32 that is also streaming Bluetooth Classic audio?', choices: ['Bluetooth uses the CPU, which Wi-Fi needs', 'Both use the same transceiver and antenna, taking turns, and the audio\'s regular slots leave less airtime for Wi-Fi', 'The two protocols interfere because their frequencies are identical in every case', 'Wi-Fi is switched off while Bluetooth runs'], a: 1, why: 'The radio is shared in time slices. Audio streaming needs frequent, time-critical slots, so Wi-Fi gets what is left and its bulk transfer slows down.' },
    { q: 'Why is coexistence a smaller issue on the ESP32-H2 than on the ESP32-C6?', choices: ['The H2 has a second antenna', 'The H2 has no Wi-Fi, the heavy user of airtime; its two protocols are slow and send short frames', 'The H2 is faster', 'The H2 has a different crystal'], a: 1, why: 'Bluetooth LE and 802.15.4 both send small, brief frames at low rates. Without Wi-Fi in the mix they hardly compete.' },
    { q: 'A BLE scan with its window equal to its interval keeps the radio listening almost all the time. What does this do to Wi-Fi on the same chip?', choices: ['Nothing', 'It leaves little airtime for Wi-Fi, which slows or stalls', 'It makes Wi-Fi faster', 'It disables Bluetooth'], a: 1, why: 'A scan that listens continuously claims most of the slots. Reduce the scan duty cycle, or scan only when needed.' },
    { q: 'Adding a second antenna to the board gives the chip a second radio.', a: false, why: 'The sharing is in the single transceiver and its time slots. Another antenna does not add transceivers, so coexistence is unchanged. A second radio needs a second chip.' }
  ],
  applications: [
    'Matter-over-Thread devices on the ESP32-C6, which use Wi-Fi, Bluetooth LE for commissioning and Thread together.',
    'Wi-Fi sensors with a Bluetooth LE set-up page, where the radios are busy at different times.',
    'Audio gadgets on the original ESP32 that mix Bluetooth audio with a little Wi-Fi.',
    'Thread border routers built from a Wi-Fi chip and an 802.15.4 chip, so that no radio is shared.'
  ],
  sources: [
    'Espressif, *ESP32-C6 Series Datasheet* and *ESP32-C5 Series Datasheet*, the product overview and the wireless communication sections.',
    'Espressif, *ESP-IDF Programming Guide*, "RF Coexistence".',
    'Espressif, *ESP32-C3 Series Datasheet*, the Bluetooth feature list (internal coexistence between Wi-Fi and Bluetooth).'
  ],
  sim: 'ic-shared-radio'
},

/* ================================================================ reset reasons */
{
  id: 'reset-reasons',
  parent: 'inside-the-chip',
  title: 'Reset reasons and what they tell',
  level: 2,
  short: 'A chip that restarts remembers why. Printing the reason at start is the quickest diagnosis there is: a "random reboot" is nearly always a brownout, a watchdog or a crash, and each needs a different cure.',
  keywords: ['reset reason', 'esp_reset_reason', 'reset_cause', 'brownout', 'watchdog', 'panic', 'POWERON', 'ESP_RST_BROWNOUT', 'ESP_RST_PANIC', 'task watchdog', 'interrupt watchdog', 'deep sleep wake', 'random reboot', 'boot loop', 'rst:0xc', 'machine.reset_cause', 'wake cause'],
  prereq: ['the-rom-bootloader', 'cpu-cores-and-clocks', 'rtc-domain-and-lp-core'],
  related: ['brownout', 'watchdogs', 'watchdog-resets', 'guru-meditation-and-backtraces', 'reading-boot-messages', 'core-dumps-and-field-diagnostics', 'fault-finding-method', 'wake-up-sources'],
  body: `A microcontroller restarts for a reason, and it remembers which one. Reading that reason first is the quickest diagnosis there is: a device that "reboots at random" is nearly always suffering a brownout, a watchdog or a crash, and the three need quite different cures.

### The reasons

| Reason (ESP-IDF name) | What happened | In practice |
|---|---|---|
| Power-on (\`ESP_RST_POWERON\`) | the supply rose from zero | normal; if it repeats with no cause, the supply drops to zero |
| External pin (\`ESP_RST_EXT\`) | the reset pin was pulled low | the RESET button, or noise on EN; the ESP32 never reports this one |
| Software restart (\`ESP_RST_SW\`) | the program asked for it | deliberate: after an update, a command, error recovery |
| Panic (\`ESP_RST_PANIC\`) | an exception or a failed assert | a bug: read the backtrace |
| Interrupt watchdog (\`ESP_RST_INT_WDT\`) | interrupts stayed off too long | a handler that is too slow, or a long critical section |
| Task watchdog (\`ESP_RST_TASK_WDT\`) | a watched task did not report in time | a loop that never yields, or a call that never returns |
| Other watchdog (\`ESP_RST_WDT\`) | a hardware watchdog expired | the system hung hard |
| Deep sleep (\`ESP_RST_DEEPSLEEP\`) | the chip woke from deep sleep | by design |
| Brownout (\`ESP_RST_BROWNOUT\`) | the supply fell below the detector's threshold | power: a weak cable, a Wi-Fi transmit peak, a flat battery |

Newer versions of ESP-IDF add a few more (USB, JTAG, eFuse errors, power glitches).

### Two views of the same event

The ROM prints the hardware's view in its \`rst:0x… (…)\` line. ESP-IDF adds what software knows: a panic or a deliberate restart leaves a marker in RTC memory before the reset, so both show as a "software CPU reset" in the ROM line (\`rst:0xc\` on the ESP32) and are told apart by \`esp_reset_reason()\`.

### Reading it in a program

Arduino reads it with \`esp_reset_reason()\`. MicroPython's \`machine.reset_cause()\` returns only five constants, and folds the rest in: brownouts and power-ons both give \`PWRON_RESET\`; panics, restarts and the reset pin give \`HARD_RESET\`; the three watchdogs give \`WDT_RESET\`; the prompt's Ctrl-D gives \`SOFT_RESET\`. To tell a brownout from a power-on you need C++. After a deep-sleep wake ask why it woke: \`esp_sleep_get_wakeup_cause()\` (ESP-IDF 6.1 deprecates it in favour of \`esp_sleep_get_wakeup_causes()\`, which returns a bitmask) or \`machine.wake_reason()\`.

### Practice

Print the reason first thing at start, and for a product keep a count of each in NVS or send it with the next report: a fleet's reset reasons are its health chart ([[core-dumps-and-field-diagnostics]]). Brownouts send you to the supply ([[brownout]]); watchdogs to the code's timing ([[watchdog-resets]]); panics to the backtrace ([[guru-meditation-and-backtraces]]).

> [!key] Print the reset reason first. Brownout means the supply, a task or interrupt watchdog means a loop or handler that holds on too long, and a panic means a bug; MicroPython reports only five coarse causes, so use C++ when the difference matters.`,
  ideas: [
    'Every restart has a recorded reason, and a program can read it with one call.',
    'Brownout points to the supply, watchdogs to code that never yields or blocks, and a panic to a bug with a backtrace.',
    'The ROM line shows the hardware view; esp_reset_reason() adds software restarts and panics from a marker kept in RTC memory.',
    'MicroPython folds the reasons into five constants, so a brownout looks like a power-on there.'
  ],
  pitfalls: [
    'A random reboot is a bug in my code — It is as often the power supply: a brownout at a Wi-Fi transmit peak resets a perfectly good program. The reason tells which.',
    'The watchdog is the problem — The watchdog is the messenger. It resets a chip whose code held on too long; the cure is in the code, not in switching the watchdog off.',
    'machine.reset_cause() tells me everything — It has five values: a brownout reads as PWRON_RESET and a crash as HARD_RESET. Use the C++ call, or the boot log, when you must tell them apart.'
  ],
  terms: [
    { term: 'Reset reason', also: ['reset cause', 'esp_reset_reason'], def: 'A code that records why the chip last restarted: power-on, a reset pin, a software restart, a crash, a watchdog, a brownout or a wake from deep sleep.' },
    { term: 'Brownout', also: ['brown-out', 'brownout detector'], def: 'A dip of the supply voltage below the level at which the chip works reliably. A detector resets the chip before it can misbehave.' },
    { term: 'Panic', also: ['Guru Meditation Error', 'crash'], def: 'The state the system enters when the processor raises an exception or an assert fails. It prints a report with a backtrace and restarts.' },
    { term: 'Watchdog timer', also: ['WDT', 'task watchdog'], def: 'A timer that resets the chip unless the program tells it, in time, that it is still running. It turns a hang into a restart.' },
    { term: 'Wake-up cause', also: ['wake reason', 'esp_sleep_get_wakeup_cause'], def: 'The record of what woke the chip from deep sleep: a timer, a pin level, a touch or the coprocessor.' }
  ],
  code: [
    {
      title: 'Print why the chip restarted',
      about: 'Prints the reset reason at start, in words. Run it, then press RESET, then power-cycle the board, and watch the answer change.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Last reset: ] (reset reason))
      `,
      cpp: String.raw`
        #include "esp_system.h"

        const char *reasonName(esp_reset_reason_t r) {
          switch (r) {
            case ESP_RST_POWERON:   return "power-on";
            case ESP_RST_EXT:       return "reset pin";
            case ESP_RST_SW:        return "software restart";
            case ESP_RST_PANIC:     return "panic (a crash)";
            case ESP_RST_INT_WDT:   return "interrupt watchdog";
            case ESP_RST_TASK_WDT:  return "task watchdog";
            case ESP_RST_WDT:       return "other watchdog";
            case ESP_RST_DEEPSLEEP: return "woke from deep sleep";
            case ESP_RST_BROWNOUT:  return "brownout (supply too low)";
            case ESP_RST_SDIO:      return "SDIO reset";
            default:                return "unknown";
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Last reset: %s\n", reasonName(esp_reset_reason()));
        }

        void loop() {}
      `,
      py: String.raw`
        import machine

        NAMES = {
            machine.PWRON_RESET: "power-on (or a brownout)",
            machine.HARD_RESET: "restart, reset pin or a crash",
            machine.WDT_RESET: "watchdog",
            machine.DEEPSLEEP_RESET: "woke from deep sleep",
            machine.SOFT_RESET: "soft reset from the prompt (Ctrl-D)",
        }
        print("Last reset:", NAMES.get(machine.reset_cause(), "unknown"))
      `,
      output: `
        Last reset: power-on
      `,
      notes: ['MicroPython folds brownouts into PWRON_RESET and crashes into HARD_RESET; only the C++ version can tell them apart.', 'After a panic the ROM and the IDF also print a report with a backtrace before the restart; see the Guru Meditation page.']
    },
    {
      title: 'Cause a watchdog reset on purpose',
      about: 'Subscribes the main program to the watchdog and then never reports in. After a few seconds the chip resets, and the next start prints "task watchdog". Remove the comment marks to see the cure: report in, and the reset never comes.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Last reset: ] (reset reason))
          watch this task with the watchdog :: tasks
          forever
            print (join [Alive at (ms): ] (milliseconds since start))
            wait (1) seconds
            // tell the watchdog "still alive" here, and the reset never comes
          end
      `,
      cpp: String.raw`
        #include "esp_task_wdt.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          esp_reset_reason_t r = esp_reset_reason();
          Serial.printf("Last reset code: %d%s\n", (int)r, r == ESP_RST_TASK_WDT ? " (task watchdog)" : "");
          esp_task_wdt_add(NULL);              // watch this task: it must now report in time
        }

        void loop() {
          Serial.printf("Alive at %lu ms\n", millis());
          delay(1000);
          // esp_task_wdt_reset();             // remove the slashes and the reset never comes
        }
      `,
      py: String.raw`
        import machine, time

        names = {machine.WDT_RESET: "watchdog"}
        print("Last reset:", names.get(machine.reset_cause(), "something else"))

        wdt = machine.WDT(timeout=5000)        # milliseconds: from now on feed() must be called in time

        while True:
            print("Alive at", time.ticks_ms(), "ms")
            time.sleep(1)
            # wdt.feed()                       # remove the hash and the reset never comes
      `,
      output: `
        Last reset code: 1
        Alive at 1022 ms
        Alive at 2022 ms
        Alive at 3023 ms
        Alive at 4023 ms
        Alive at 5024 ms
        (the chip restarts)
        Last reset code: 6 (task watchdog)
      `,
      notes: ['The default timeout is a few seconds. ESP-IDF prints a "Task watchdog got triggered" message before the reset, naming the task that did not report.', 'In MicroPython a watchdog reset reads back as WDT_RESET, covering all three kinds of watchdog.']
    }
  ],
  examples: [
    {
      title: 'A sensor node that "restarts at random"',
      q: 'A Wi-Fi sensor reboots every few hours. The reset reason printed at start is "brownout" every time, and the unit is powered from a long thin USB cable. What is wrong, and where would you look first?',
      steps: ['Brownout means the supply voltage fell below the chip\'s threshold, not that the code crashed.', 'A Wi-Fi transmit burst draws a few hundred milliamps for a short time ($335\\,\\mathrm{mA}$ for the C3, by the catalogue); a thin cable with perhaps $0.5\\,\\Omega$ of resistance drops $0.335 \\times 0.5 \\approx 0.17\\,\\mathrm{V}$ at the board.', 'That dip, on top of a marginal 5 V source and the regulator\'s drop-out, can take the 3.3 V rail below the threshold at the worst moment.'],
      a: 'The supply: use a short, thick cable or a better charger, and add a bulk capacitor near the module. Rewriting the program would not help.'
    }
  ],
  quiz: [
    { q: 'A device resets every few hours and prints "brownout" each time. Where do you look first?', choices: ['The interrupt handlers', 'The power supply, cable and capacitors', 'The Wi-Fi password', 'The partition table'], a: 1, why: 'A brownout reset is raised by a dip in the supply voltage. The usual cause is a weak source or cable at a Wi-Fi transmit peak.' },
    { q: 'A loop that never yields makes a watched task miss the task watchdog. What is the right cure?', choices: ['Switch the watchdog off', 'Make the loop yield or report in, for instance with a short delay', 'Use a bigger power supply', 'Lower the CPU clock'], a: 1, why: 'The watchdog is doing its job: the code held on too long. Give the loop a point where it yields or reports in.' },
    { q: 'In MicroPython machine.reset_cause() returns PWRON_RESET. Which of these could have happened?', choices: ['Only a power-on', 'A power-on or a brownout', 'A crash', 'A deep-sleep wake-up'], a: 1, why: 'MicroPython maps both ESP_RST_POWERON and ESP_RST_BROWNOUT to PWRON_RESET. Use the C++ call or the boot log to tell them apart.' },
    { q: 'esp_reset_reason() returns ESP_RST_DEEPSLEEP, so it also tells you whether a timer or a pin woke the chip.', a: false, why: 'The reset reason only says that the chip woke from deep sleep. The wake-up cause (timer, pin, touch or coprocessor) is a separate call.' }
  ],
  applications: [
    'A first line of every serial log: "Last reset: …", so that a field report has a diagnosis in it.',
    'Fleet monitoring: counting brownouts, watchdogs and panics per device to find the weak units.',
    'Deciding at boot whether to restore state (after a software restart) or start clean (after power-on).',
    'Telling the user whether the last wake-up was a button, a timer or an alarm from the low-power core.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Miscellaneous System APIs" (reset reasons) and "Watchdogs".',
    'Arduino core for ESP32 documentation, the ResetReason and DeepSleep examples (core 3.3).',
    'MicroPython documentation, *machine* module: reset_cause, wake_reason and WDT (version 1.29).'
  ]
},

/* ================================================================ the peripherals map */
{
  id: 'peripherals-overview',
  parent: 'inside-the-chip',
  title: 'The peripherals in one map',
  level: 1,
  short: 'Beside the cores sit blocks of hardware that each do one job alone: serial ports, timers, converters, accelerators. This is the map of them, how many of each a chip has, and what keeps the CPU out of their way.',
  keywords: ['peripherals', 'UART', 'I2C', 'SPI', 'I2S', 'ADC', 'DAC', 'LEDC', 'PWM', 'RMT', 'PCNT', 'TWAI', 'DMA', 'interrupt matrix', 'event task matrix', 'ETM', 'touch', 'how many UARTs', 'controllers', 'registers'],
  prereq: ['cpu-cores-and-clocks', 'memory-map', 'what-a-microcontroller-is'],
  related: ['gpio-matrix-and-io-mux', 'digital-output', 'interrupts', 'uart-on-the-esp', 'pwm-with-ledc', 'the-esp-adc', 'choosing-a-chip', 'the-family-at-a-glance'],
  body: `A **peripheral** is a block of hardware next to the CPU that does one job on its own: shifts bits out of a serial port, counts pulses, measures a voltage, makes a PWM signal. While it works the CPU is free. Almost everything a microcontroller does for the outside world is a peripheral doing its job, and the chip's datasheet is mostly a list of them.

### How the CPU reaches them

Each peripheral is a small block of registers at fixed addresses in the memory map ([[memory-map]]). A driver writes a number to a register to start the job and reads another to see how it is going. Three helpers keep the CPU out of the loop:

- **DMA** moves data between memory and a peripheral without the CPU copying every byte: a display, a microphone or a camera can stream through it.
- The **interrupt matrix** connects the many interrupt sources of the peripherals to the small number of interrupt lines of the CPU; the ESP32-C6 maps 77 sources to 31 lines.
- On newer chips the **event task matrix** lets one peripheral trigger another directly, such as a timer alarm toggling a pin, with no CPU in between.

The GPIO matrix, on the other side, joins the peripherals' signals to pins ([[gpio-matrix-and-io-mux]]).

### The map

- **Pins and routing**: GPIO, IO MUX, GPIO matrix, RTC pins.
- **Serial and buses**: UART, I2C, SPI, I2S, TWAI (CAN), USB, SDIO and SD host, Ethernet, parallel LCD and camera ports.
- **Analogue**: ADC, DAC, touch, temperature sensor.
- **Time and pulses**: timers, LEDC (PWM), MCPWM, RMT, pulse counter, watchdogs.
- **Security**: AES, SHA, RSA, ECC, HMAC, a random number generator, flash encryption and secure boot.
- **Radio**: the Wi-Fi, Bluetooth and 802.15.4 baseband and MAC.

### How many of each

| Chip | UART | I2C | SPI | I2S | ADC channels | PWM channels | CAN | Touch | DAC | USB |
|---|---|---|---|---|---|---|---|---|---|---|
| ESP32 | 3 | 2 | 2 | 2 | 18 | 16 | 1 | 10 | 2 | none |
| ESP32-S3 | 3 | 2 | 2 | 2 | 20 | 8 | 1 | 14 | none | OTG, Serial/JTAG |
| ESP32-C3 | 2 | 1 | 1 | 1 | 6 | 6 | 1 | none | none | Serial/JTAG |
| ESP32-C6 | 2 | 1 | 1 | 1 | 7 | 6 | 2 | none | none | Serial/JTAG |
| ESP32-H2 | 2 | 2 | 1 | 1 | 5 | 6 | 1 | none | none | Serial/JTAG |
| ESP32-P4 | 5 | 2 | 2 | 3 | 14 | 8 | 3 | 14 | none | OTG, Serial/JTAG |

### Why the counts matter

You plan around them. A C3 has one I2C bus, so several sensors share it by their addresses. The SPI figure counts the controllers left to you; one more drives the flash. Peripherals also share clocks and pins, and several are tied to particular pins, such as ADC and touch channels. And because most count the bus clock, they follow a change of CPU frequency ([[cpu-cores-and-clocks]]).

> [!key] Peripherals are blocks of hardware that run a job alone, reached through registers, DMA, interrupts and the GPIO matrix. How many of each a chip has — UARTs, I2C buses, ADC channels — is the first thing to check when a design grows.`,
  ideas: [
    'A peripheral does one job (serial, timing, measuring) by itself while the CPU does something else.',
    'The CPU starts and reads peripherals through registers at fixed addresses; DMA, the interrupt matrix and the event matrix keep it out of the loop.',
    'The number of each peripheral varies a lot between chips: one I2C on the C3, two on the ESP32, five UARTs on the P4.',
    'Some peripherals are tied to particular pins (ADC, touch, USB); the rest are routed by the GPIO matrix.'
  ],
  pitfalls: [
    'More peripherals means more speed — A peripheral takes work off the CPU; it does not make the CPU faster. A chip with few peripherals can be just as fast at computing.',
    'Two I2C buses means two sets of free pins — Each bus needs two pins, and both buses can also share pins and addresses if the devices allow it. The limit is controllers, not pins.',
    'The datasheet SPI count is what I can use — One controller or more is used for the flash. The catalogue lists the ones left for the program.'
  ],
  terms: [
    { term: 'Peripheral', also: ['peripheral controller', 'on-chip peripheral'], def: 'A hardware block beside the CPU that performs one job, such as a serial port, a timer or an ADC, and is controlled through registers.' },
    { term: 'DMA', also: ['direct memory access', 'GDMA'], def: 'A controller that copies data between memory and a peripheral by itself, so the CPU does not have to move each byte.' },
    { term: 'Interrupt matrix', also: ['interrupt controller'], def: 'The routing that connects each peripheral\'s interrupt source to one of the limited interrupt lines of the CPU.' },
    { term: 'Event task matrix', also: ['ETM'], def: 'A feature of newer chips by which one peripheral\'s event triggers another peripheral\'s task directly, with no CPU involved.' },
    { term: 'Register', also: ['peripheral register', 'memory-mapped register'], def: 'A small memory cell at a fixed address that controls or reports on a peripheral. Writing to it starts a job or changes a setting.' }
  ],
  code: [
    {
      title: 'What does this chip have?',
      about: 'Reports whether the chip you run on has touch pins, a DAC and USB, using the capability flags of the build. Run it on two different boards and compare.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Touch pins: ] (chip has touch pins?))
          print (join [DAC: ] (chip has a DAC?))
          print (join [USB OTG: ] (chip has USB OTG?))
          print (join [USB Serial/JTAG: ] (chip has USB Serial/JTAG?))
      `,
      cpp: String.raw`
        #include "soc/soc_caps.h"

        void report(const char *name, bool has) {
          Serial.printf("%-20s %s\n", name, has ? "yes" : "no");
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Chip: %s, %d core(s)\n", ESP.getChipModel(), ESP.getChipCores());
        #if defined(SOC_TOUCH_SENSOR_SUPPORTED) && SOC_TOUCH_SENSOR_SUPPORTED
          report("Touch pins", true);
        #else
          report("Touch pins", false);
        #endif
        #if defined(SOC_DAC_SUPPORTED) && SOC_DAC_SUPPORTED
          report("DAC", true);
        #else
          report("DAC", false);
        #endif
        #if defined(SOC_USB_OTG_SUPPORTED) && SOC_USB_OTG_SUPPORTED
          report("USB OTG", true);
        #else
          report("USB OTG", false);
        #endif
        #if defined(SOC_USB_SERIAL_JTAG_SUPPORTED) && SOC_USB_SERIAL_JTAG_SUPPORTED
          report("USB Serial/JTAG", true);
        #else
          report("USB Serial/JTAG", false);
        #endif
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, machine

        print("Chip:", sys.implementation._machine)
        print("Touch pins:", "yes" if hasattr(machine, "TouchPad") else "no")
        print("DAC:", "yes" if hasattr(machine, "DAC") else "no")
        print("USB OTG:", "yes" if hasattr(machine, "USBDevice") else "no")
        # MicroPython cannot see the built-in USB Serial/JTAG port: it is not a USB device you program
      `,
      output: `
        Chip: ESP32-S3, 2 core(s)
        Touch pins           yes
        DAC                  no
        USB OTG              yes
        USB Serial/JTAG      yes
      `,
      notes: ['An original ESP32 answers yes, yes, no, no; an ESP32-C3 answers no, no, no, yes — the same pattern as the table above.', 'These are capability flags of the firmware build, which match the chip. They say nothing about whether your board connects the pins.']
    }
  ],
  quiz: [
    { q: 'You need three I2C buses and the board has an ESP32-C3. What is the issue?', choices: ['The C3 has no I2C', 'The C3 has only one I2C controller, so the devices must share it, or you need software I2C or another chip', 'The C3 allows one pin per bus', 'I2C needs the DAC'], a: 1, why: 'The C3 has a single I2C controller. Several devices can share it if their addresses differ; otherwise bit-banged I2C or a chip with more controllers is needed.' },
    { q: 'What does DMA save?', choices: ['Memory', 'The CPU copying every byte between memory and a peripheral', 'Battery in deep sleep', 'Flash wear'], a: 1, why: 'Direct memory access lets a peripheral read or write memory by itself, so streaming data (audio, a display, a camera) does not occupy the CPU.' },
    { q: 'Which chip of this list has a DAC?', choices: ['ESP32-S3', 'ESP32-C6', 'ESP32 (the original)', 'ESP32-H2'], a: 2, why: 'Of these only the original ESP32 (and the S2, which is not listed) has DAC channels; the S3, C3, C6 and H2 do not.' },
    { q: 'A chip with more peripherals is always a faster computer.', a: false, why: 'Peripherals do their own jobs; the CPU speed is separate. The P4 has both a fast CPU and many peripherals, but the C3 computes just as quickly per MHz with far fewer.' }
  ],
  applications: [
    'Choosing a chip by counting the buses, ADC channels and PWM outputs a design needs.',
    'Planning a sensor network where each device has its own UART or I2C controller.',
    'Reading a datasheet block diagram and knowing what each box can do alone.',
    'Using DMA for audio, displays and cameras so the CPU can keep running the application.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* and *ESP32-C6 Series Datasheet*, the "Peripherals" and "System Components" sections.',
    'Espressif, *ESP-IDF Programming Guide*, the peripherals API reference (GPIO, UART, I2C, SPI, LEDC, RMT, ADC and others).',
    'Arduino core for ESP32 documentation, the API pages for the peripherals (core 3.3).'
  ],
  sim: { id: 'ref-chip', params: { chip: 'esp32-s3' } }
}
);
