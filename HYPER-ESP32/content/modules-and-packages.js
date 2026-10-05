/* HYPER-ESP32 · content/modules-and-packages.js
 *
 * Modules and how they are named. Facts about modules come from the catalogue (Hyper.esp.MODULES: 89 parts read from
 * Espressif's module datasheets on 2026-10-04); programs follow API-CRIB.md.
 */
Hyper.add(
/* ================================================================ what a module adds */
{
  id: 'what-a-module-adds',
  parent: 'modules-and-packages',
  title: 'What a module adds to the chip',
  level: 1,
  short: 'A module is the chip together with the parts it cannot work without — flash memory, a crystal, the radio filter, an antenna and a shield can — tested as one and sold as one part you can solder down. Know what is under the can, and what is still your job.',
  keywords: ['module', 'shield can', 'metal can', 'WROOM', 'flash on a module', 'crystal', 'antenna', 'RF matching', 'SMD module', 'certified module', 'what is inside an ESP32 module', 'bare chip'],
  prereq: ['chip-module-board', 'reading-the-family-names'],
  related: ['wroom-wrover-mini-pico', 'pcb-antenna-or-connector', 'module-certification', 'anatomy-of-a-dev-board', 'designing-with-the-bare-chip', 'the-board-is-not-the-chip', 'crystals-and-clocks'],
  body: `A bare chip from the ESP32 family is a speck of silicon in a plastic square. Most of them have no room for your program inside, no antenna, and a radio that is unforgiving about what is wired around it. A **module** is that chip already surrounded: mounted on a small circuit board with the parts it cannot work without, covered by a metal can, tested at the factory and sold as a single component that you solder onto your own board. ESP32-WROOM-32E, ESP32-S3-WROOM-1 and ESP32-C3-MINI-1 are modules. [[chip-module-board|Chip, module and board]] sets the three levels side by side; this page opens the can.

### What is under the can

| Part | Why the chip needs it |
|---|---|
| **Flash memory** | Holds the program, the file system and the settings. On a WROOM or WROVER module it is a separate chip on the module's board; on a MINI module it usually sits inside the chip's own package. |
| **Crystal** | The timing reference of the processor and the radio; 40 MHz is the usual one. |
| **Radio matching and filter** | A few tiny capacitors and inductors that carry the 2.4 GHz signal to the antenna with little loss and keep stray frequencies out of the air. |
| **Antenna** | A meandering copper track on the module's board, or a miniature coaxial socket for an external antenna — see [[pcb-antenna-or-connector]]. |
| **Decoupling capacitors** | A reservoir beside each supply pin for the chip's sudden current bursts. |
| **Shield can** | A thin metal cover that keeps outside noise out and the module's own noise in. It also carries the printed name. |

### What is still your job

A module is **not a board**. It has no USB socket and no USB-to-serial bridge, no voltage regulator, no buttons and no LEDs; its pads are the chip's pins. You supply a clean 3.3 V rail that can deliver the transmit peaks — the catalogue gives 240 mA for the original ESP32 and 340 mA for the ESP32-S3 while transmitting — and a way to program it: a serial header, or the chip's own USB pins. You also choose where the module sits on your board, which decides how well its antenna works ([[module-footprints-and-soldering]]).

### Not every pin arrives

The module's pads are not the chip's pins one for one. Pins that talk to the flash, and on some versions the PSRAM, are wired inside the module and either never reach a pad or reach one that must stay unused. The ESP32-WROOM-32 lists 32 GPIO pads, but six (GPIO6 to GPIO11) belong to the flash, so only 26 are usable; the newer WROOM-32E does not lead them out. [[psram-on-modules]] shows the same for PSRAM.

### In numbers

The 89 parts in the catalogue run from 8.5 × 12.7 mm (the tiny ESP8684-WROOM-07, with only three GPIOs on its pads) to 35.6 × 34.4 mm (the dual-antenna ESP32-WROOM-DA); the typical WROOM is 18 × 25.5 mm and 3.1 mm thick. Of the 89, 55 are in mass production; the rest are samples or on their way out.

> [!key] A module is the chip plus its flash, crystal, radio filter and antenna under a shield can: a tested radio you can solder down. It is still not a board — the supply, the programming path and the placement are yours, and some of the chip's pins never reach the pads.`,
  ideas: [
    'A module is the chip plus flash memory, a crystal, the radio filter, an antenna and a shield can, tested together and sold as one part.',
    'The radio is the hardest part of a design; a module hands you a working one, and usually one that is already approved.',
    'A module still needs a clean 3.3 V supply, a way to be programmed and a sensible place on your board.',
    'Pins that serve the flash (and some PSRAM) never become free GPIOs on the module.'
  ],
  pitfalls: [
    'A module is just a chip on a small board, so every chip pin is available — Several pins are wired to the memory inside the module. They are either not led out or must be left alone: GPIO6 to GPIO11 on the classic ESP32 modules, GPIO35 to GPIO37 on an ESP32-S3 module with octal PSRAM.',
    'A module has its own regulator, so I can power it from 5 V — A module runs from about 3.0 to 3.6 V and has no regulator; that belongs to the board. 5 V on the supply pad destroys it.',
    'The metal can is only a cosmetic cover — It shields the radio, carries the marking that ties the module to its datasheet and its approval, and keeps the parts under it as tested. Do not lift it.'
  ],
  terms: [
    { term: 'Module', also: ['radio module', 'SMD module'], def: 'A small circuit board that carries an ESP chip with its flash memory, crystal, radio filter and antenna under a metal can, sold as one soldered-down part. It has pads where a board has pins and a socket.' },
    { term: 'Shield can', also: ['RF shield', 'metal can', 'can'], def: 'The thin metal cover over the chip and its parts on a module. It keeps interference out and in, and carries the printed module name.' },
    { term: 'Matching network', also: ['RF matching', 'radio filter'], def: 'The few small capacitors and inductors between the chip\'s radio output and the antenna. They make the two agree in impedance, so that the signal passes with little loss and unwanted frequencies are removed.' },
    { term: 'Bare chip', also: ['SoC', 'system-on-chip', 'QFN'], def: 'The chip as it leaves the factory: a silicon die in a small plastic square, with no flash on most types, no antenna and no support parts. Using it means designing all of those yourself.' },
    { term: 'Pad', also: ['castellation', 'land'], def: 'One of the soldering contacts on the underside or edge of a module. Each is a chip pin or a power or ground connection; the datasheet lists which.' }
  ],
  choose: {
    good: ['Products in small or medium numbers, where a tested and often approved radio saves months', 'A two-layer board and a quick design: the module hides the hard 2.4 GHz part', 'Hand assembly or a small assembly house, using the module\'s standard footprint', 'A design that may need to switch chips later: modules of one family share a footprint'],
    avoid: ['Millions of units, where the bare chip and your own design cost less', 'Very small or very flat products: a module is 2.3 to 3.5 mm thick and at least about 8 × 13 mm', 'A flash size, PSRAM or antenna that the module does not come with'],
    check: ['That the module is in mass production, not "not recommended for new designs" or discontinued', 'Which pins the module really leads out', 'The antenna version of the exact ordering code: PCB antenna or connector']
  },
  code: [
    {
      title: 'Ask the module what it carries',
      about: 'Prints the chip, the flash size, the PSRAM size and how much memory is free. Run it on any board to see what the module underneath really offers.',
      needs: 'Any ESP32-family board, and the serial monitor at 115200 baud. On a board with PSRAM, switch the PSRAM option on in the Tools menu first, or it will read as zero.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip: ] (chip model))
          print (join [Flash in MB: ] (flash size))
          print (join [PSRAM in KB: ] (PSRAM size))
          print (join [Free heap in KB: ] (free heap))
          print (join [Free PSRAM in KB: ] (free PSRAM))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                       // give the monitor time to open
          Serial.printf("Chip:       %s rev %d, %d core(s)\n", ESP.getChipModel(), ESP.getChipRevision(), ESP.getChipCores());
          Serial.printf("Flash:      %lu MB\n", (unsigned long)(ESP.getFlashChipSize() / (1024 * 1024)));
          Serial.printf("PSRAM:      %lu KB\n", (unsigned long)(ESP.getPsramSize() / 1024));      // 0 if none, or not switched on
          Serial.printf("Free heap:  %lu KB\n", (unsigned long)(ESP.getFreeHeap() / 1024));       // the internal RAM
          Serial.printf("Free PSRAM: %lu KB\n", (unsigned long)(ESP.getFreePsram() / 1024));
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, gc, esp

        print("Chip:       ", sys.implementation._machine)
        print("Flash:      ", esp.flash_size() // (1024 * 1024), "MB")
        gc.collect()
        total = gc.mem_free() + gc.mem_alloc()
        print("Heap:       ", total // 1024, "KB in all (megabytes means PSRAM is in use)")
        print("Free heap:  ", gc.mem_free() // 1024, "KB")
      `,
      output: `
        Chip:       ESP32-S3 rev 0, 2 core(s)
        Flash:      16 MB
        PSRAM:      8192 KB
        Free heap:  332 KB
        Free PSRAM: 8168 KB
      `,
      notes: ['The numbers above are an example for an ESP32-S3 module with 16 MB flash and 8 MB PSRAM; yours will differ a little.', 'MicroPython has no call that names the PSRAM: on a firmware built for PSRAM the whole heap is megabytes instead of a few hundred kilobytes, and that is how you see it.']
    }
  ],
  examples: [
    {
      title: 'Is the module worth it for 200 units?',
      q: 'A small company will sell 200 Wi-Fi sensors a year. A designer wonders whether to put the bare ESP32-C3 chip on the board instead of an ESP32-C3-MINI-1 module. What does the module save, and what does it cost?',
      steps: ['The module saves the flash chip, the crystal, the matching network and the antenna design: four things that all have to be laid out and tuned.', 'It also brings a tested radio with an approval already behind it (see [[module-certification]]), so the product may only need to be assessed for what the module does not cover.', 'It costs more per piece than the chip and its parts, and it occupies 13.2 × 16.6 mm and 2.4 mm in height.', 'Across 200 units the extra part cost is small, while the lab work for a bare-chip radio is a fixed cost that no volume this small can spread thin.'],
      a: 'At this volume the module is clearly the better choice: the saving in design and approval work outweighs the extra part cost. The bare chip pays off only at volumes where the fixed costs are spread over very many units.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT found on an ESP32 module?', choices: ['The flash memory', 'The crystal', 'A 5 V to 3.3 V regulator and a USB socket', 'The radio matching network'], a: 2, why: 'Regulator and USB socket belong to a development board. A module needs a clean 3.3 V supply from outside and brings only the chip, its memory, crystal, radio parts and antenna.' },
    { q: 'An ESP32-WROOM-32 lists 32 GPIO pads in its datasheet. How many can you actually use?', choices: ['32', '26', '16', '38'], a: 1, why: 'GPIO6 to GPIO11 are wired to the flash memory inside the module and must not be used, which leaves 26.' },
    { q: 'A MINI module normally carries its flash as a separate chip on its board, like a WROOM does.', a: false, why: 'MINI modules are built on chips that already contain the flash in their own package, which is a large part of why they are small.' },
    { q: 'Why does the metal can matter even if the module works without it?', choices: ['It cools the chip', 'It is the shield and the marking that tie the module to its tests and approval', 'It holds the antenna', 'It protects the flash from light'], a: 1, why: 'The can keeps noise in and out, and its marking identifies the module. A module that was tested and approved as built is no longer the same thing with the can removed.' }
  ],
  applications: [
    'Almost every commercial Wi-Fi or Bluetooth product built around an ESP chip: smart plugs, sensors, appliances, light controllers.',
    'Development boards: nearly all carry a module rather than a bare chip, and the board is the module plus USB and a regulator.',
    'Small production runs and prototypes, where an approved module avoids a radio design and a certification project.',
    'Upgrading a product from one chip to the next within one module family, with little or no change to the board.'
  ],
  sources: [
    'Espressif, module datasheets: *ESP32-WROOM-32E*, *ESP32-S3-WROOM-1* and *ESP32-C3-MINI-1* (block diagram, pin tables, dimensions).',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*, sections on the in-package memory and the crystal.',
    'Espressif, *ESP32 Hardware Design Guidelines*, the chapters on modules and on the supply.'
  ],
  sim: 'mo-anatomy'
},

/* ================================================================ the family words */
{
  id: 'wroom-wrover-mini-pico',
  parent: 'modules-and-packages',
  title: 'WROOM, WROVER, MINI, PICO, SOLO',
  level: 1,
  short: 'The word in the middle of a module name is its family: WROOM is the general-purpose module, WROVER the one with PSRAM, SOLO the single-core one, MINI the small one with its flash inside the chip, PICO the one built on a system-in-package.',
  keywords: ['WROOM', 'WROVER', 'MINI', 'PICO', 'SOLO', 'module family', 'ESP32-WROOM-32', 'ESP32-S3-WROOM-1', 'ESP32-C3-MINI-1', 'module size', 'ESP8684-WROOM', 'ESP8685-WROOM', 'footprint'],
  prereq: ['what-a-module-adds', 'reading-the-family-names'],
  related: ['reading-a-module-part-number', 'system-in-package', 'psram-on-modules', 'module-footprints-and-soldering', 'esp32-devkitc', 'choosing-a-chip'],
  body: `A module name reads like an address: the chip, then the **family**, then a version, then an antenna letter and a memory code — ESP32-S3-WROOM-1U-N16R8 ([[reading-a-module-part-number|the next page]] reads the rest). The family word tells you about size, memory layout and pin count before you open a datasheet.

### The five words

| Family | Chips in the catalogue | Typical size | What it tells you |
|---|---|---|---|
| **WROOM** | ESP8266 and nearly every ESP32 chip | 18 × 25.5 × 3.1 mm for the classic ESP32 and the S3; 18 × 20 mm for the C3-WROOM-02 | The general-purpose module. Flash is usually a separate chip on the module's board (not on the ESP8684 and ESP8685 series, whose chips hold it inside). PSRAM is an option on the newer ones. |
| **WROVER** | ESP32 and ESP32-S2 | 18 × 31.4 × 3.3 mm (ESP32), 18 × 31 mm (S2) | A module with PSRAM built in. Longer, because the PSRAM chip needs room, and it costs pins ([[psram-on-modules]]). |
| **SOLO** | ESP32 and ESP32-S2 | 18 × 25.5 × 3.1 mm | On the ESP32, a single-core chip (ESP32-SOLO-1). The S2 has one core anyway. |
| **MINI** | C2, C3, C5, C6, C61, H2, H21, ESP32, S2, S3 | 13.2 × 16.6 × 2.4 mm (C3, C6, C61, H2); 15.4 × 20.5 mm (S3) | Small and thin, flash (and PSRAM, if any) inside the chip's package, PCB antenna. Fewer pins reach the pads. |
| **PICO** | ESP32 and ESP32-S3 | 7 × 7 mm | A *system in package*: chip, flash and crystal in one 7 × 7 mm square, no antenna ([[system-in-package]]). Modules built on it add "MINI". |

Of the 89 parts in the catalogue, 45 are WROOM, 23 MINI (two of them PICO-MINI), 8 WROVER, 5 SOLO and 5 PICO; three more are special modules. Two numbered series, **ESP8684** (an ESP32-C2 with its flash inside) and **ESP8685** (the same for the ESP32-C3), are WROOM modules of their own: they run from 24 × 16 mm down to the 8.5 × 12.7 mm ESP8684-WROOM-07, which exposes only three GPIOs.

### The same word does not mean the same footprint

Two modules called WROOM-1 are not interchangeable. The ESP32-S3-WROOM-1 has 41 pins; the ESP32-C6-WROOM-1 has 29; the older ESP32-WROOM-32 has 38 and the S2 version is longer again. The family word only repeats an idea, "the standard-size module of this chip"; the pad layout is chip-specific, so a board designed for one needs a new footprint for another.

### The disappearing WROVER

After the ESP32-S2 the name WROVER stops. The ESP32-S3 sells its PSRAM as an option of the WROOM module (the R in N16R8), so "WROOM or WROVER?" is a question only for the ESP32 and the S2. A listing that offers an "ESP32-S3-WROVER" names something that is not among Espressif's modules in the catalogue: find out what is really on the board.

A "-1", "-2" or "-02" after the family identifies a layout or generation; it counts nothing, and WROOM-32 simply means "the ESP32 one".

> [!key] WROOM is the standard module, WROVER adds PSRAM (ESP32 and S2 only), SOLO is single-core, MINI is the small one with memory inside the chip, PICO is a 7 × 7 mm package with flash and crystal inside. The same family word on two chips is never the same footprint.`,
  ideas: [
    'WROOM is the standard module; WROVER the one with PSRAM; SOLO the single-core one; MINI the small one; PICO the one built on a system in package.',
    'On a MINI module the memory sits inside the chip\'s package, which is why it is so small — and why fewer pins reach the pads.',
    'The same family word on a different chip is a different footprint: 41 pins on an S3-WROOM-1, 29 on a C6-WROOM-1.',
    'WROVER exists only for the ESP32 and the ESP32-S2; later chips put PSRAM into the WROOM and MINI options.'
  ],
  pitfalls: [
    'WROOM-1 is one footprint, so any WROOM-1 fits my board — The ESP32-S3-WROOM-1 has 41 pins and the ESP32-C6-WROOM-1 29, in different layouts. Check the pad drawing of the exact module.',
    'A WROVER is a better WROOM — It adds PSRAM and costs two pins (GPIO16 and 17 on an ESP32) and 13 mm of length. If the project does not need external RAM it is the wrong module.',
    'The name tells me everything about the memory — Only the family word and the code at the end together do. A WROOM may or may not carry PSRAM, depending on the ordering code.'
  ],
  terms: [
    { term: 'WROOM', also: ['ESP32-WROOM-32', 'WROOM-1'], def: 'The general-purpose module family of Espressif: chip, separate flash chip, crystal and PCB antenna (or a connector in the U versions) on a board of about 18 × 25.5 mm.' },
    { term: 'WROVER', also: ['ESP32-WROVER-E'], def: 'A module of the original ESP32 or ESP32-S2 with PSRAM fitted, about 31 mm long. The PSRAM takes GPIO16 and GPIO17 on the ESP32 and GPIO26 on the S2.' },
    { term: 'SOLO', also: ['ESP32-SOLO-1'], def: 'A module with a single-core chip. On the ESP32, SOLO-1 carries the one-core version of the chip; the ESP32-S2 is a single-core chip anyway.' },
    { term: 'MINI', also: ['ESP32-C3-MINI-1', 'ESP32-S3-MINI-1'], def: 'A small, thin module (13.2 × 16.6 mm on the C3 and C6) built on a chip with its flash in the same package, so no separate memory chip is needed.' },
    { term: 'PICO', also: ['ESP32-PICO-D4', 'ESP32-S3-PICO-1'], def: 'A system in package of 7 × 7 mm that holds the chip, flash memory, crystal and matching parts in one component. PICO-MINI modules add an antenna and a board around it.' }
  ],
  choose: {
    good: ['WROOM for a first design, the largest choice of chips, memory and antenna', 'MINI where board space is tight and the antenna can sit at the edge', 'WROVER (ESP32 or S2) only when external RAM is a hard requirement', 'The family your chip\'s newest module belongs to, since older ones may be discontinued'],
    avoid: ['Choosing by family word alone: always read the pad drawing and the pin table', 'A module in "not recommended for new designs" or discontinued status for a new product', 'MINI where you need many GPIOs: fewer reach the pads'],
    check: ['The status column: mass production, NRND, EOL or sample', 'Pin count and which GPIOs the module really leads out', 'Whether the exact ordering code carries the PSRAM and flash you want']
  },
  examples: [
    {
      title: 'Will it fit?',
      q: 'A board has room for 20 mm of length and 16 mm of width at the edge. Which of the ESP32-S3-WROOM-1, ESP32-S3-MINI-1 and ESP32-C3-MINI-1 fit, going by the sizes in the catalogue?',
      steps: ['ESP32-S3-WROOM-1: 18 × 25.5 mm. The length of 25.5 mm is more than 20 mm, so it does not fit.', 'ESP32-S3-MINI-1: 15.4 × 20.5 mm. The 20.5 mm is just over 20 mm: no.', 'ESP32-C3-MINI-1: 13.2 × 16.6 mm, which fits inside 16 × 20 with room to spare.', 'Also remember the antenna: it wants free space beyond the module, so the room needed is more than the module alone.'],
      a: 'Only the ESP32-C3-MINI-1. The S3 MINI misses by half a millimetre, so check dimensions, not family words.'
    }
  ],
  quiz: [
    { q: 'You want an ESP32-S3 module with PSRAM. Which name should you look for?', choices: ['ESP32-S3-WROVER', 'ESP32-S3-WROOM-1 with a code containing R, such as N8R8', 'ESP32-S3-SOLO', 'ESP32-S3-PICO-1 only'], a: 1, why: 'Espressif sells the S3\'s PSRAM as an option of the WROOM-1 (and MINI-1) modules: the R in the ordering code. There is no WROVER for the S3.' },
    { q: 'What does SOLO mean in ESP32-SOLO-1?', choices: ['No radio', 'One processor core', 'No antenna', 'Solder-only mounting'], a: 1, why: 'SOLO-1 carries the single-core ESP32 chip (ESP32-S0WD).' },
    { q: 'ESP32-S3-WROOM-1 and ESP32-C6-WROOM-1 have the same pad layout, since both are called WROOM-1.', a: false, why: 'They have 41 and 29 pins respectively, in different layouts. The family word repeats a concept, not a drawing.' },
    { q: 'Why can a MINI module be so much smaller than a WROOM?', choices: ['It has no antenna', 'Its chip already holds the flash, so no separate memory chip is needed', 'It has no crystal', 'It uses a different radio band'], a: 1, why: 'The chips behind MINI modules carry their flash (and sometimes PSRAM) in their package. The module needs no memory chip, and its parts are fewer and smaller.' }
  ],
  applications: [
    'Choosing a module for a new product: size and memory layout decide the board outline before anything else.',
    'Reading a shop listing: the family word separates a module with PSRAM from one without, on the ESP32 and the S2.',
    'Drop-in upgrades in the same family — for example from a classic WROOM-32 to a WROOM-32E.',
    'Matching a development board to the final module: boards use the standard WROOM or MINI modules that the product will later use.'
  ],
  sources: [
    'Espressif, module datasheets: *ESP32-WROOM-32E*, *ESP32-WROVER-E*, *ESP32-SOLO-1*, *ESP32-S3-WROOM-1*, *ESP32-C3-MINI-1* (dimensions, pin counts, ordering information).',
    'Espressif, *ESP32-PICO-V3* and *ESP32-S3-PICO-1* datasheets.',
    'Espressif, the *Product Selector* on its website: the modules of each chip with their sizes and memory.'
  ],
  sim: { id: 'mo-sizes', params: { view: 'families' } }
},

/* ================================================================ part numbers */
{
  id: 'reading-a-module-part-number',
  parent: 'modules-and-packages',
  title: 'Reading a part number: N16R8 and friends',
  level: 2,
  short: 'ESP32-S3-WROOM-1U-N16R8: the chip, the family, the version, U for a connector instead of the PCB antenna, and N16R8 for 16 MB flash and 8 MB PSRAM at standard temperature. Each piece can be read, and the memory code costs pins.',
  keywords: ['part number', 'ordering code', 'N16R8', 'N8R2', 'N4', 'H4', 'R16V', 'U version', 'WROOM-1U', 'MINI-1U', 'ESP32-WROOM-32UE', 'temperature code', 'module name decoder'],
  prereq: ['wroom-wrover-mini-pico', 'what-a-module-adds'],
  related: ['flash-memory-on-modules', 'psram-on-modules', 'pcb-antenna-or-connector', 'clones-and-counterfeits', 'reading-the-family-names', 'board-menu-options'],
  body: `A shop sells "ESP32-S3 N16R8 board" and a datasheet lists "ESP32-S3-WROOM-1U-N16R8". Every piece of the name is a decision made for you, and a few take pins or lower the temperature limit. Read it from left to right.

### The pieces

**ESP32-S3** is the chip. **WROOM** is the family ([[wroom-wrover-mini-pico]]). **-1** is the generation or layout. A trailing **U** (WROOM-1**U**, MINI-1**U**) means the module has an antenna *connector* instead of the PCB antenna ([[pcb-antenna-or-connector]]). Older ESP32 modules wrote the same idea with other letters: a **U** or **I** for the connector (ESP32-WROOM-32U, ESP32-WROVER-I), **D** and **E** for successive revisions of the module (the E is the current one), **SE** for a version with a secure-element chip (now discontinued), **DA** for a module with two antennas.

After a dash comes the **memory code**, as in **N16R8**:

| Piece | Means | Example |
|---|---|---|
| **N** or **H** | Temperature class: N is the standard range up to 85 °C, H a high-temperature one up to 105 °C | N16R8: standard |
| **16** | Flash memory in megabytes | 16 MB |
| **R8** | PSRAM in megabytes (absent: no PSRAM) | 8 MB |
| **V** (R16**V**, R16**V**A) | The memory runs at 1.8 V instead of 3.3 V; see below | 1.8 V octal |

### What the memory code costs

The code is also a pin and temperature budget. On the ESP32-S3-WROOM-1, the **R8** (and R16V) versions have *octal* PSRAM, which uses eight data lines instead of four: **GPIO35, GPIO36 and GPIO37 are wired to the PSRAM** and are not available. Versions with R2 or no R keep them. The same datasheet rates the octal-PSRAM versions only to **65 °C** ambient (85 °C with PSRAM error correction on, at the price of one sixteenth of the memory). With a **V**, the memory supply is 1.8 V, so GPIO47 and GPIO48 run at 1.8 V rather than 3.3 V. So N16R8 is not "N16 with a bit more": it is a different set of pins and a different thermal limit.

### Examples from the catalogue

| Name | Reads as |
|---|---|
| ESP32-S3-WROOM-1-**N4** | S3 chip, WROOM-1, PCB antenna, 4 MB flash, no PSRAM |
| ESP32-S3-WROOM-1-**N8R8** | 8 MB flash, 8 MB octal PSRAM; GPIO35–37 taken |
| ESP32-S3-WROOM-1**U**-N16R8 | The same with a connector in place of the antenna |
| ESP32-S3-WROOM-1-**N16R16VA** | 16 MB flash, 16 MB PSRAM at 1.8 V |
| ESP32-WROOM-32E-**N16R2** | Classic ESP32, 16 MB flash, 2 MB PSRAM |
| ESP32-C3-MINI-1-**N4** | Small module, 4 MB flash inside the chip |

Letters after a **V** (the "A" of R16VA) are explained only by the datasheet's ordering table. The simulation below decodes real catalogue names piece by piece.

### Where listings go wrong

Titles drop letters: "S3 N16R8" omits the antenna type, so a connector module may arrive with no antenna in the box. A title may also differ from the module on the board; the only certain way to find out is to ask the chip ([[clones-and-counterfeits]]).

> [!key] Read a module name as chip, family, version, antenna letter and memory code. In N16R8, N is the temperature class, 16 the megabytes of flash and R8 the megabytes of PSRAM — and on the S3 the R8 takes three pins and lowers the temperature limit.`,
  ideas: [
    'A module name is chip, family, version, antenna letter, and a memory code such as N16R8.',
    'N or H is the temperature class; the number after it is flash in megabytes; R plus a number is PSRAM in megabytes.',
    'A trailing U means a connector instead of the PCB antenna.',
    'On an ESP32-S3 module, octal PSRAM (R8, R16V) takes GPIO35 to GPIO37 and cuts the temperature limit to 65 °C.'
  ],
  pitfalls: [
    'N16R8 just means a bigger N16 — The R8 adds octal PSRAM, which takes GPIO35, 36 and 37 and limits the ambient temperature to 65 °C on the ESP32-S3 modules.',
    'The U at the end is part of the version number — It means a connector in place of the PCB antenna. With no antenna attached, a U module has almost no range.',
    'The product title shows the full part number — Many listings shorten it. Compare it with the datasheet, and with what the chip reports about itself.'
  ],
  terms: [
    { term: 'Ordering code', also: ['part number', 'order code'], def: 'The full name of one version of a module, ending in a memory code such as N16R8. Two modules of the same family with different ordering codes differ in flash, PSRAM, temperature class or antenna.' },
    { term: 'N16R8', also: ['N8R2', 'N4', 'memory code'], def: 'A module memory code: N is the temperature class, the number after it the flash in megabytes, and R with a number the PSRAM in megabytes. N16R8 is 16 MB flash and 8 MB PSRAM.' },
    { term: 'High-temperature version', also: ['H version', 'H4'], def: 'A module whose code begins with H instead of N; it is rated to 105 °C ambient where the N version stops at 85 °C.' },
    { term: 'U version', also: ['-U', 'WROOM-1U', 'connector version'], def: 'A module with a miniature coaxial antenna connector (U.FL) in place of the PCB antenna. The antenna is yours to supply.' },
    { term: 'Octal SPI', also: ['OPI', 'octal PSRAM'], def: 'A memory interface with eight data lines in place of four, so faster at the same clock. On the ESP32-S3 it takes more pins than the quad kind.' }
  ],
  code: [
    {
      title: 'Decode the memory code in a program',
      about: 'Reads a memory code such as N16R8 and says in words what it means. Handy for a stock list or a test jig that checks the board it has been given.',
      needs: 'Any ESP32-family board, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [code v] to [N16R8]
          set [temperature v] to (letter (1) of (code))
          set [flash v] to (number from position (2) up to the letter R in (code))
          set [psram v] to (number after the letter R in (code), or 0 if there is none)
          print (join (code) [: temperature class ] (temperature))
          print (join (flash) [ MB flash, ] (psram) [ MB PSRAM])
          if <(psram) > (4)> then
            print [octal PSRAM: ambient limited to 65 C on the S3, GPIO35 to 37 taken]
          end
      `,
      cpp: String.raw`
        String code = "N16R8";                           // try "N4", "H4", "N8R2", "N16R16V"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          int r = code.indexOf('R');                     // -1 when there is no PSRAM
          int flashMb = code.substring(1, r < 0 ? code.length() : r).toInt();
          int psramMb = r < 0 ? 0 : code.substring(r + 1).toInt();   // toInt stops at a trailing V
          Serial.printf("%s: temperature class %c\n", code.c_str(), code[0]);
          Serial.printf("%d MB flash, %d MB PSRAM\n", flashMb, psramMb);
          if (psramMb > 4) {
            Serial.println("octal PSRAM: ambient limited to 65 C on the S3, GPIO35 to 37 taken");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        code = "N16R8"                                  # try "N4", "H4", "N8R2", "N16R16V"

        r = code.find("R")                               # -1 when there is no PSRAM
        flash_mb = int(code[1:r] if r >= 0 else code[1:])
        psram_mb = int(code[r + 1:].rstrip("VA")) if r >= 0 else 0     # drop a trailing V or VA
        print("%s: temperature class %s" % (code, code[0]))
        print("%d MB flash, %d MB PSRAM" % (flash_mb, psram_mb))
        if psram_mb > 4:
            print("octal PSRAM: ambient limited to 65 C on the S3, GPIO35 to 37 taken")
      `,
      output: `
        N16R8: temperature class N
        16 MB flash, 8 MB PSRAM
        octal PSRAM: ambient limited to 65 C on the S3, GPIO35 to 37 taken
      `,
      notes: ['Only the memory code at the end is decoded here. The octal warning is true for ESP32-S3 modules; other chips have their own rules, in their datasheets.', 'Written for codes of the form N16R8; a code such as H4 has no R, so the PSRAM comes out as 0.']
    }
  ],
  examples: [
    {
      title: 'Which pins does my N16R8 board lose?',
      q: 'A board carries an ESP32-S3-WROOM-1-N16R8. Using the catalogue, which GPIOs does it lose, and how many of the module\'s 36 usable GPIOs are left?',
      steps: ['The code has R8, so the PSRAM is octal.', 'On the S3-WROOM-1, octal PSRAM takes GPIO35, GPIO36 and GPIO37.', 'The module leaves out GPIO22 to GPIO34 anyway: it exposes GPIO0 to GPIO21 and GPIO35 to GPIO48, that is 22 + 14 = 36 pins.', 'Subtract the three that the PSRAM takes: $36 - 3 = 33$.'],
      a: 'It loses GPIO35, 36 and 37 and keeps 33 GPIOs; of those, GPIO0, 3, 45 and 46 are strapping pins and GPIO19 and 20 carry USB.'
    }
  ],
  quiz: [
    { q: 'What do the letters and numbers of ESP32-S3-WROOM-1-N8R2 say about memory?', choices: ['8 MB PSRAM and 2 MB flash', '8 MB flash and 2 MB PSRAM', '8 MB of RAM in total', 'Eight and two cores'], a: 1, why: 'N is the temperature class, the number after it (8) the megabytes of flash, and R2 the megabytes of PSRAM.' },
    { q: 'You order the "H4" version of a module instead of the "N4". What changes?', choices: ['It has 4 MB more flash', 'It is rated for a higher ambient temperature (105 °C against 85 °C)', 'It has a connector instead of an antenna', 'It runs at 1.8 V'], a: 1, why: 'H marks the high-temperature class; the 4 is still the 4 MB of flash.' },
    { q: 'A project needs 12 free GPIOs on an ESP32-S3-WROOM-1 and also 8 MB of PSRAM. Does choosing N16R8 over N16R2 change which GPIOs exist?', choices: ['No: PSRAM does not use pins', 'Yes: octal PSRAM takes GPIO35 to GPIO37', 'Yes: it removes GPIO0 to GPIO2', 'Only the strapping pins change'], a: 1, why: 'R8 is octal PSRAM, wired to GPIO35, 36 and 37 on this module. R2 keeps them.' },
    { q: 'An ESP32-S3-WROOM-1U arrives without an antenna in the box. Is the seller at fault?', a: false, why: 'The U means a connector in place of the PCB antenna: the module has no antenna on board and expects you to attach one. Check the code before ordering.' }
  ],
  applications: [
    'Reading a datasheet ordering table and picking the one code that matches the flash, PSRAM and temperature your product needs.',
    'Reading a shop listing or a bill of materials and spotting a missing U or an unexpected R8.',
    'Pin planning: knowing before layout that an N16R8 board has no GPIO35 to 37.',
    'Stock lists and test jigs, which decode the code to check what a delivered module reports about itself.'
  ],
  sources: [
    'Espressif, *ESP32-S3-WROOM-1 and ESP32-S3-WROOM-1U Datasheet*: ordering information and the notes on octal PSRAM.',
    'Espressif, *ESP32-WROOM-32E Datasheet*: ordering information and the naming of the antenna and revision letters.',
    'Espressif, *ESP32-S3-WROOM-2 Datasheet*: octal flash and PSRAM at 1.8 V.'
  ],
  sim: 'mo-decoder'
},

/* ================================================================ flash */
{
  id: 'flash-memory-on-modules',
  parent: 'modules-and-packages',
  title: 'Flash on a module: sizes, quad and octal',
  level: 2,
  short: 'The flash holds the bootloader, the program, its update slot, the file system and the settings. Modules come with 2 to 32 MB of it, as a separate chip or inside the package, on four data lines or eight — and the size decides how large the program may be once updates over the air are in use.',
  keywords: ['flash', 'flash size', '4 MB', '8 MB', '16 MB', 'quad SPI', 'octal SPI', 'QIO', 'OPI', 'flash mode', 'in-package flash', 'external flash', 'OTA slot', 'partition', 'getFlashChipSize'],
  prereq: ['what-a-module-adds', 'reading-a-module-part-number'],
  related: ['psram-on-modules', 'partition-tables', 'flash-and-the-cache', 'flash-wear', 'board-menu-options', 'clones-and-counterfeits', 'ota-partitions-and-rollback'],
  body: `The flash is the module's long-term memory: it keeps its contents with the power off. Everything permanent lives there — the bootloader, the partition table, your program (twice, if you update over the air), a small file system for web pages and logs, and the settings. The processor also *runs* the program straight out of it, through a cache ([[flash-and-the-cache]]). Choosing a module therefore means choosing how much of all that you can have.

### Sizes and where the chip sits

The catalogue lists these flash options for common modules:

| Module | Flash options | Where it is |
|---|---|---|
| ESP32-WROOM-32E | 4, 8, 16 MB | A separate chip on the module's board, wired to GPIO6–11 (not led out on the E) |
| ESP32-S3-WROOM-1 | 4, 8, 16 MB | A separate quad chip on the board; the octal PSRAM versions take GPIO35–37 |
| ESP32-S3-WROOM-2 | 16, 32 MB | Octal flash and octal PSRAM at 1.8 V |
| ESP32-C5-WROOM-1 | 4, 8, 16, 32 MB | A separate chip |
| ESP32-C3-MINI-1 | 4, 8 MB | Inside the chip's package |
| ESP32-H2-MINI-1, ESP8684-MINI-1 | 2, 4 MB | Inside the chip's package |

A separate flash chip uses pins of the main chip: six GPIOs on the classic ESP32, GPIO26 to GPIO32 on the S3. A module hides them; the in-package kind never exposes them.

### Quad and octal

Flash talks to the chip over a serial bus with a clock and data lines. **Quad** SPI has four data lines and is what nearly all modules carry. **Octal** has eight lines, and moves twice the bits per clock tick; the S3-WROOM-2 uses it, and the "V" in its code says the memory runs at 1.8 V. For most programs the difference does not show: code runs from the cache, which hides the flash most of the time.

What matters is that the *settings match the hardware*. The Arduino Tools menu, ESP-IDF's menuconfig and esptool all carry a flash size and a flash mode. A size larger than the real one points the partition table at addresses the chip does not have, and a mode the memory cannot do leaves the chip unable to read its bootloader — a boot loop, usually with a complaint within the first lines ([[reading-boot-messages]]). Too small a size merely wastes memory.

### How much flash do you need?

A program with Wi-Fi and Bluetooth easily fills a megabyte; with a TLS stack and a web server, 1.5 MB. Updating over the air needs *two* app slots, because the new version is written while the old one runs. The stock Arduino partition tables, as the catalogue has them:

| Flash | Largest program with updates | File system |
|---|---|---|
| 4 MB | 1.25 MB (1,310,720 bytes) | about 1.4 MB |
| 8 MB | 3.19 MB (3,342,336 bytes) | about 1.5 MB |
| 16 MB | 6.25 MB (6,553,600 bytes) | about 3.4 MB |

So 4 MB suits a sensor; 8 or 16 MB suits audio, a camera, big web pages or a growing program. Flash also wears (a sector survives on the order of 100,000 erase cycles), so do not rewrite a log every second ([[flash-wear]]).

> [!key] Modules carry 2 to 32 MB of flash, on a separate chip or inside the package, on four data lines or eight. Match the size and mode in your tools to the hardware, and remember that over-the-air updates halve the room for the program.`,
  ideas: [
    'The flash holds the bootloader, the partition table, the program, a file system and settings; the processor also runs its code from it.',
    'Modules carry 2 to 32 MB; a MINI module has its flash inside the chip, a WROOM has a separate flash chip on its board.',
    'Quad flash has four data lines, octal eight; the S3-WROOM-2 is the octal module and runs its memory at 1.8 V.',
    'The flash size and mode in the tools must match the hardware, or the board will not boot; with updates over the air the program may fill only one of two slots.',
  ],
  pitfalls: [
    'More flash always makes the program faster — Capacity and speed are separate. The program runs from a cache; a larger flash only gives room.',
    'I set 16 MB in the menu, so I have 16 MB — The menu only tells the tools what to assume. If the module has 4 MB, the partition table points past the end of the chip and the board will not start.',
    'The flash pins are free GPIOs on a bare chip, so they are on a module — On a module they go to the memory. A WROOM-32 labels them but they must not be used; a WROOM-32E and the MINI modules do not lead them out.'
  ],
  terms: [
    { term: 'Flash memory', also: ['SPI flash', 'NOR flash'], def: 'Non-volatile memory that keeps its contents without power. On an ESP module it holds the bootloader, the program, the file system and the settings, and the processor runs its code from it.' },
    { term: 'Quad SPI', also: ['QSPI', 'QIO', 'DIO'], def: 'A serial memory bus with four data lines (against one for plain SPI). Nearly all module flash and the 2 MB PSRAM work this way.' },
    { term: 'Octal SPI', also: ['OPI', 'octal flash'], def: 'A serial memory bus with eight data lines. It moves twice the data of quad SPI at the same clock, and is used for the larger PSRAM and flash on the ESP32-S3.' },
    { term: 'In-package flash', also: ['embedded flash', 'integrated flash'], def: 'A flash die placed in the same plastic package as the chip. It needs no board space and no pins of the chip on the board, but its size is fixed when the chip is bought.' },
    { term: 'OTA slot', also: ['app partition', 'update slot'], def: 'A region of flash that holds one version of the program. Updating over the air needs two: the new version is written into the one that is not running.' }
  ],
  choose: {
    good: ['4 MB for sensors, switches and simple Wi-Fi devices', '8 MB when updates over the air and a web interface must share the flash', '16 MB for audio, images, larger file systems or a growing program', 'Octal flash only when the module is built that way'],
    avoid: ['4 MB with a camera, audio or a big web front end, where the update slot will not fit', 'Choosing a size from a shop title without reading it from the chip', 'Setting a larger flash size in the tools than the module has'],
    check: ['The flash size the chip reports, against the one on the label ([[clones-and-counterfeits]])', 'The partition table: two slots of what size', 'The flash mode in the tools menu: quad or octal']
  },
  code: [
    {
      title: 'How big is the flash, and where does the program sit?',
      about: 'Prints the flash size, and the slot of flash that the running program was written to, with its address and size. It shows at once whether the partition table makes use of the whole chip.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Flash size in MB: ] (flash size))
          print (join [Flash speed in MHz: ] (flash speed))
          print (join [Running from: ] (name of the running partition))
          print (join [Its address and size in bytes: ] (running partition address) [ ] (running partition size))
      `,
      cpp: String.raw`
        #include "esp_ota_ops.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("Flash size:  %lu MB\n", (unsigned long)(ESP.getFlashChipSize() / (1024 * 1024)));
          Serial.printf("Flash speed: %lu MHz\n", (unsigned long)(ESP.getFlashChipSpeed() / 1000000));
          const esp_partition_t *app = esp_ota_get_running_partition();      // the slot this program runs from
          Serial.printf("Running from '%s' at 0x%lX, slot size %lu bytes\n", app->label, (unsigned long)app->address, (unsigned long)app->size);
        }

        void loop() {}
      `,
      py: String.raw`
        import esp
        from esp32 import Partition

        print("Flash size: ", esp.flash_size() // (1024 * 1024), "MB")
        # MicroPython has no call for the flash speed
        app = Partition(Partition.RUNNING)                 # the slot this firmware runs from
        kind, subtype, addr, size, label, encrypted = app.info()
        print("Running from '%s' at 0x%X, slot size %d bytes" % (label, addr, size))
      `,
      output: `
        Flash size:  16 MB
        Flash speed: 80 MHz
        Running from 'app0' at 0x10000, slot size 6553600 bytes
      `,
      notes: ['The slot size is the largest program you can update over the air with this partition table: compare it with the flash size to see how much of the chip the table really uses.', 'The official MicroPython images have no update slots, so the label there is "factory" and the slot is much larger.', 'The flash size these calls report is the one the firmware was built or flashed for; the chip\'s own identification is what esptool\'s flash-id command reads.']
    }
  ],
  examples: [
    {
      title: 'Will the program fit as an update?',
      q: 'A program with Wi-Fi, a web server and TLS has grown to 1.6 MB. The board is an ESP32-S3-WROOM-1-N4 with the stock 4 MB partition table that allows updates over the air. Will it fit, and what are the options?',
      steps: ['The stock 4 MB table has two app slots of 1,310,720 bytes (1.25 MB) each.', '1.6 MB is more than 1.25 MB, so the program does not fit its slot.', 'Option one: a custom partition table with larger slots and a smaller file system: two slots of 1.8 MB leave about 0.3 MB.', 'Option two: move to an N8 or N16 module, whose stock table has slots of 3.19 or 6.25 MB.'],
      a: 'It does not fit the stock 4 MB table. Either trade file-system space for bigger slots, or choose an 8 or 16 MB module.'
    }
  ],
  quiz: [
    { q: 'A program of 1.5 MB must be updatable over the air. Which stock Arduino partition table can take it?', choices: ['4 MB', '8 MB', 'Neither: no table has such slots', 'Only 32 MB'], a: 1, why: 'The 4 MB table has slots of 1.25 MB. The 8 MB table has 3.19 MB slots.' },
    { q: 'What happens if the tools are set to 16 MB flash and the module has only 4 MB?', choices: ['Nothing, it just works', 'The program runs slower', 'The partition table points past the end of the chip and the board fails to start properly', 'The extra 12 MB is taken from PSRAM'], a: 2, why: 'The sizes in the tools are assumptions, not measurements. The table then places partitions at addresses that do not exist.' },
    { q: 'An ESP32-C3-MINI-1 has its flash as a separate chip on the module\'s board.', a: false, why: 'The chip behind the MINI module holds the flash in its own package, so no separate chip and no pins of the chip are used on the board.' },
    { q: 'Which module in the catalogue carries octal flash?', choices: ['ESP32-WROOM-32E', 'ESP32-C3-MINI-1', 'ESP32-S3-WROOM-2', 'ESP32-H2-MINI-1'], a: 2, why: 'The WROOM-2 is the S3 module built around octal flash and octal PSRAM, running at 1.8 V ("V" in its code).' }
  ],
  applications: [
    'Choosing the module for a connected product that will be updated over the air for years.',
    'Boards for audio, camera or display projects, which carry 8 or 16 MB for assets.',
    'Reading the boot log of a board that will not start after a flash-size mismatch.',
    'Writing a custom partition table that spends the flash on slots and file system in the right proportion.'
  ],
  sources: [
    'Espressif, *ESP32-S3-WROOM-1* and *ESP32-S3-WROOM-2* datasheets: flash and PSRAM options, ordering information.',
    'Espressif, *ESP-IDF Programming Guide*, "Partition Tables" and "Over The Air Updates (OTA)".',
    'Arduino core for ESP32 documentation: the partition tables that ship with the core (core 3.3).'
  ],
  sim: { id: 'mo-memcost', params: { focus: 'flash' } }
},

/* ================================================================ PSRAM */
{
  id: 'psram-on-modules',
  parent: 'modules-and-packages',
  title: 'PSRAM: megabytes of extra RAM and the pins it costs',
  level: 2,
  short: 'PSRAM adds 2 to 32 MB of RAM outside the chip, wired like the flash. It is slower than the chip\'s own RAM and it costs pins and, on some modules, temperature range — but it is what a camera, a large display or a big buffer needs.',
  keywords: ['PSRAM', 'SPIRAM', 'external RAM', 'octal PSRAM', 'quad PSRAM', 'N16R8', 'WROVER', 'ps_malloc', 'heap_caps_malloc', 'frame buffer', 'GPIO35', 'GPIO16', 'GPIO17', 'psramFound', '8 MB RAM'],
  prereq: ['reading-a-module-part-number', 'flash-memory-on-modules'],
  related: ['using-psram', 'memory-map', 'heap-and-fragmentation', 'strapping-pins', 'input-only-and-special-pins', 'the-esp32-camera-driver', 'choosing-a-display'],
  body: `The chip's own RAM is small: 520 KB on the original ESP32, 512 KB on the ESP32-S3, 320 KB on the S2. That is plenty for a sensor and short on anything that moves pictures or sound. **PSRAM** (pseudo-static RAM) is a RAM chip, 2 to 32 MB, wired to the processor over the same kind of serial bus as the flash. To the program it looks like ordinary memory at a different address — only slower, because every access goes over the bus and through the cache.

### What it is for

A screen of 800 × 480 pixels at two bytes a pixel is 768,000 bytes: one and a half times the *whole* internal RAM of an ESP32-S3. A camera frame, a second of audio, a large JSON document, a machine-learning model's working memory: all need PSRAM. A sensor that sleeps for ten minutes needs none, and PSRAM adds cost and current.

### What it costs in pins

The PSRAM's wires use pins of the chip, and the module cannot give them back. From the catalogue:

| Module | PSRAM | Pins taken |
|---|---|---|
| ESP32-WROVER-E | 2 or 8 MB | GPIO16 and GPIO17 |
| ESP32-S2-WROVER, ESP32-S2-MINI-1 (N4R2) | 2 MB | GPIO26 |
| ESP32-S3-WROOM-1 | R2: 2 MB · R8: 8 MB octal · R16V: 16 MB octal | **R8 and R16V: GPIO35, GPIO36, GPIO37** |
| ESP32-S3-MINI-1 (N4R2) | 2 MB | GPIO26 |
| ESP32-C5-WROOM-1 | 2 or 8 MB | GPIO15 (the PSRAM's chip select) |
| ESP32-C61-WROOM-1 | 2 or 8 MB | GPIO14 |
| ESP32-PICO-MINI-02 | 2 MB in the package | GPIO9 and GPIO10 (plus GPIO6 and 11 for the flash) |
| ESP32-S31-WROOM-1 | 16 or 32 MB | none documented as lost |

An ESP32 chip with PSRAM *inside its package* also uses GPIO16 and GPIO17. The simulation lets you pick a module and an option and watch the pins go.

### What else it costs

- **Speed.** A PSRAM access is several times slower than internal RAM, so speed-critical code stays in internal memory, and so must some buffers (on the original ESP32 a peripheral cannot read PSRAM by DMA); the camera and display drivers handle this for you.
- **Reach.** The original ESP32 can map only 4 MB of PSRAM at a time, so a program normally sees 4 MB of an 8 MB part.
- **Temperature.** The ESP32-S3 modules with octal PSRAM are rated only to 65 °C ambient — 85 °C with the PSRAM's error correction on, which gives up one sixteenth of the memory.
- **Voltage.** On R16V modules the memory runs at 1.8 V, so GPIO47 and GPIO48 run at 1.8 V too.

### Switching it on

PSRAM is off until the tools are told. In the Arduino IDE it is the *PSRAM* entry of the Tools menu: *QSPI* for the quad kind, *OPI* for octal. Setting the wrong one makes the chip fail to read the PSRAM's identity at start. In ESP-IDF it is a menuconfig entry; in MicroPython it needs a firmware built for PSRAM, after which the whole heap is megabytes. Your own code in C++ asks for it by name (\`ps_malloc\`, or \`heap_caps_malloc\` with a flag), and the program below does exactly that.

> [!key] PSRAM gives 2 to 32 MB of slower RAM for cameras, screens and big buffers. It takes pins (GPIO35 to 37 on an S3 with octal PSRAM, GPIO16 and 17 on a WROVER), may cut the temperature limit, and must be switched on in the tools.`,
  ideas: [
    'PSRAM is 2 to 32 MB of RAM outside the chip, on the same kind of bus as the flash; it is slower than the chip\'s own RAM.',
    'Cameras, large displays, audio and big buffers need it; most sensors do not.',
    'It costs pins: GPIO16 and 17 (ESP32 WROVER), GPIO26 (S2, S3 MINI), GPIO35 to 37 (S3 octal), one chip-select on C5 and C61.',
    'It must be switched on in the tools, with the right mode (quad or octal), or it reads as zero or fails to start.'
  ],
  pitfalls: [
    'PSRAM is just more RAM — It is slower, and not usable for everything: interrupt code and, on some chips, buffers that peripherals read by DMA belong in internal RAM.',
    'My N16R8 board has 8 MB of free memory for variables — Only if the PSRAM is switched on and the code asks for it. Without the Tools option it reads as 0 KB; ordinary variables stay in the small internal RAM.',
    'I can use GPIO35 on my S3 N16R8 board because the board header shows it — On the WROOM-1 module with octal PSRAM, GPIO35 to GPIO37 go to the PSRAM. A header on a board with R8 must not connect them to anything.'
  ],
  terms: [
    { term: 'PSRAM', also: ['SPIRAM', 'pseudo-static RAM', 'external RAM'], def: 'A RAM chip of 2 to 32 MB that the ESP chip reaches over a serial bus like the flash. It looks like ordinary memory to a program, only slower than the chip\'s internal RAM.' },
    { term: 'Octal PSRAM', also: ['OPI PSRAM', 'R8'], def: 'PSRAM on an eight-line bus, found on ESP32-S3 modules in sizes of 8 and 16 MB. It takes more pins than the quad kind and the module is rated to a lower temperature.' },
    { term: 'ps_malloc', also: ['heap_caps_malloc', 'MALLOC_CAP_SPIRAM'], def: 'The calls that allocate memory in the PSRAM instead of the internal heap. ps_malloc is the short Arduino form; heap_caps_malloc with the SPIRAM flag is the ESP-IDF form.' },
    { term: 'Frame buffer', also: ['screen buffer'], def: 'A block of memory that holds every pixel of a screen. Its size is width times height times bytes per pixel, so a large colour display needs more memory than most chips have inside.' },
    { term: 'Internal RAM', also: ['SRAM', 'on-chip RAM'], def: 'The fast memory inside the chip: 320 to 768 KB, depending on the chip. Interrupt code, some DMA buffers and most ordinary variables stay in it.' }
  ],
  choose: {
    good: ['Cameras: each frame is a block of hundreds of kilobytes', 'Colour displays larger than about 320 × 240 pixels with a full frame buffer', 'Audio and speech processing with long buffers', 'Large JSON or web content, and machine-learning models'],
    avoid: ['Battery sensors that wake, report and sleep: PSRAM adds cost and current', 'Designs that need every GPIO: an octal S3 takes three, a WROVER two', 'Hot environments above 65 °C ambient with octal S3 modules, unless error correction is acceptable'],
    check: ['The mode your module needs: QSPI (the 2 MB parts) or OPI (octal 8 and 16 MB)', 'Which pins the exact ordering code loses', 'That the PSRAM option is on in the tools before you test it']
  },
  code: [
    {
      title: 'Use the PSRAM: allocate a megabyte and check it',
      about: 'Reports the PSRAM, asks for a one-megabyte buffer in it, fills it with a pattern, reads it back and counts the errors. Then it gives the memory back.',
      needs: 'A board whose module has PSRAM, such as an ESP32-S3 N8R8 or N16R8, or an ESP32-WROVER. Switch the PSRAM option on in the Tools menu (OPI for octal) and open the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          if <(PSRAM size) = (0)> then
            print [No PSRAM found: is it switched on in the tools?]
            stop [this script v]
          end
          print (join [PSRAM in KB: ] ((PSRAM size) / (1024)))
          set [buffer v] to (allocate (1048576) bytes in PSRAM)
          fill [buffer v] with the pattern 0 to 255 repeated
          set [wrong v] to (number of bytes in [buffer v] that differ from the pattern)
          print (join [Bytes written and read back: 1048576, wrong: ] (wrong))
          free [buffer v]
      `,
      cpp: String.raw`
        const size_t N = 1024 * 1024;                          // one megabyte

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!psramFound()) {
            Serial.println("No PSRAM found: is it switched on in the Tools menu?");
            return;
          }
          Serial.printf("PSRAM: %lu KB\n", (unsigned long)(ESP.getPsramSize() / 1024));
          uint8_t *buf = (uint8_t *)ps_malloc(N);               // the buffer goes to PSRAM, not the small internal heap
          if (buf == NULL) {
            Serial.println("ps_malloc failed");
            return;
          }
          for (size_t i = 0; i < N; i++) buf[i] = i & 0xFF;     // the pattern 0..255, repeated
          size_t wrong = 0;
          for (size_t i = 0; i < N; i++) if (buf[i] != (i & 0xFF)) wrong++;
          Serial.printf("Bytes written and read back: %lu, wrong: %lu\n", (unsigned long)N, (unsigned long)wrong);
          free(buf);
        }

        void loop() {}
      `,
      py: String.raw`
        import gc

        N = 1024 * 1024                                        # one megabyte
        gc.collect()
        total = gc.mem_free() + gc.mem_alloc()
        if total < 2 * N:
            print("No PSRAM in the heap: this firmware has none, or the module has none.")
        else:
            print("Heap in KB:", total // 1024)
            buf = bytearray(N)                                 # on a PSRAM firmware the heap is megabytes
            pattern = bytes(range(256))                        # the pattern 0..255, repeated
            for i in range(0, N, 256):
                buf[i:i + 256] = pattern
            wrong = 0
            for i in range(0, N, 256):
                if buf[i:i + 256] != pattern:
                    wrong += 1
            print("Bytes written and read back: %d, wrong blocks of 256: %d" % (N, wrong))
            del buf
      `,
      idf: String.raw`
        #include <stdio.h>
        #include <stdint.h>
        #include "esp_heap_caps.h"

        #define N (1024 * 1024)                                /* one megabyte */

        void app_main(void) {
            printf("PSRAM free: %u KB\n", (unsigned)(heap_caps_get_free_size(MALLOC_CAP_SPIRAM) / 1024));
            uint8_t *buf = heap_caps_malloc(N, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
            if (buf == NULL) {
                printf("no PSRAM, or it is not enabled in menuconfig\n");
                return;
            }
            for (size_t i = 0; i < N; i++) buf[i] = i & 0xFF;
            size_t wrong = 0;
            for (size_t i = 0; i < N; i++) if (buf[i] != (i & 0xFF)) wrong++;
            printf("Bytes written and read back: %u, wrong: %u\n", (unsigned)N, (unsigned)wrong);
            heap_caps_free(buf);
        }
      `,
      output: `
        PSRAM: 8192 KB
        Bytes written and read back: 1048576, wrong: 0
      `,
      notes: ['In MicroPython the heap check stands in for "found PSRAM": there is no call that names it. The standard builds have no PSRAM; the downloads include variants made for boards with PSRAM, and a different one for octal PSRAM on the S3.', 'In ESP-IDF the PSRAM is enabled in menuconfig (Component config, ESP PSRAM) and the mode must match the module.', 'With the Tools option off, psramFound() is false even on a board that has PSRAM fitted.']
    }
  ],
  examples: [
    {
      title: 'Will the screen fit in the chip?',
      q: 'A 800 × 480 colour display needs a full frame buffer with 16 bits (2 bytes) per pixel. The ESP32-S3 has 512 KB of internal RAM. Does it fit, and how many frames would 8 MB of PSRAM hold?',
      steps: ['One frame: $800 \\times 480 \\times 2 = 768{,}000$ bytes, about 750 KB.', 'The chip has 512 KB inside in all: 512 × 1024 = 524,288 bytes. One frame is already larger, and the program needs memory too.', 'In 8 MB of PSRAM, 8 × 1024 × 1024 = 8,388,608 bytes: $8{,}388{,}608 / 768{,}000 \\approx 10.9$, so ten whole frames.', 'Two frames (double buffering) use under 1.5 MB, leaving the rest for pictures and fonts.'],
      a: 'The frame is 768,000 bytes, more than the chip\'s whole internal RAM; it must live in PSRAM, where about ten such frames fit.'
    }
  ],
  quiz: [
    { q: 'You choose an ESP32-S3-WROOM-1-N16R8 for a project that needs 36 free GPIOs. What is the problem?', choices: ['None: PSRAM uses no pins', 'GPIO35, 36 and 37 are wired to the octal PSRAM, so only 33 are left', 'R8 disables GPIO0 to GPIO21', 'PSRAM takes the USB pins'], a: 1, why: 'The module exposes 36 GPIOs, and the octal PSRAM of the R8 versions takes GPIO35 to GPIO37.' },
    { q: 'After switching on the PSRAM option, ESP.getPsramSize() reports 0 on an N8R8 board. What is the most likely cause?', choices: ['The module has no PSRAM', 'The PSRAM mode is wrong for the module: QSPI chosen where OPI is needed', 'The sketch is too large', 'The board is in download mode'], a: 1, why: 'N8R8 has octal PSRAM, which needs the OPI setting. With the quad setting the chip cannot read the memory\'s identity and reports none.' },
    { q: 'Anything that a program allocates with ordinary variables goes to PSRAM automatically once it is enabled.', a: false, why: 'Ordinary variables stay in the internal RAM. You ask for PSRAM by name with ps_malloc or heap_caps_malloc (or a library does), and interrupt code (and on the original ESP32 DMA buffers) must stay in the internal RAM.' },
    { q: 'Why is an ESP32-S3 N16R8 rated for a lower temperature than the N16?', choices: ['The flash is hotter', 'Octal PSRAM versions are rated to 65 °C ambient in the datasheet', 'The 16 MB flash overheats', 'It is not: both are 85 °C'], a: 1, why: 'The catalogue records that the octal-PSRAM versions (R8, R16V) are rated -40 to 65 °C, improved to 85 °C with the PSRAM\'s error correction at the price of one sixteenth of the memory.' }
  ],
  applications: [
    'Camera boards (ESP32-CAM, S3 camera boards) that keep several frames of JPEG or raw pixels in PSRAM.',
    'Touch-screen products with a full frame buffer and a graphics library such as LVGL.',
    'Audio devices: voice assistants, recorders and players that buffer seconds of sound.',
    'Programs that handle large JSON documents, certificates, or the working memory of a small neural network.'
  ],
  sources: [
    'Espressif, *ESP32-S3-WROOM-1 Datasheet*, ordering information and the notes on octal PSRAM (GPIO35 to GPIO37, temperature).',
    'Espressif, *ESP32-WROVER-E Datasheet*: PSRAM pins and sizes.',
    'Espressif, *ESP-IDF Programming Guide*, "Support for External RAM" and "Heap Memory Allocation" (MALLOC_CAP flags).'
  ],
  sim: { id: 'mo-memcost', params: { focus: 'psram' } }
},

/* ================================================================ antenna */
{
  id: 'pcb-antenna-or-connector',
  parent: 'modules-and-packages',
  title: 'PCB antenna or connector: the U versions',
  level: 2,
  short: 'Most modules carry a printed antenna on their board; the U versions carry a tiny coaxial socket instead and wait for an antenna of your choice. The printed one costs nothing and suits a plastic box; the socket is the way out of a metal one — and every decibel of gain has a price in the rules.',
  keywords: ['PCB antenna', 'U.FL', 'IPEX', 'MHF', 'external antenna', 'pigtail', 'SMA', 'RP-SMA', 'WROOM-1U', 'MINI-1U', 'antenna gain', 'range', 'metal enclosure', 'dBi', 'dual antenna'],
  prereq: ['what-a-module-adds', 'reading-a-module-part-number'],
  related: ['pcb-antennas', 'external-antennas', 'antenna-placement-and-enclosures', 'link-budget', 'module-certification', 'transmit-power-and-regulations', 'rssi-and-signal-quality', 'electronics:antennas'],
  body: `The antenna is the part of a radio that decides how far it reaches, and a module gives you two choices. The **PCB antenna** is a meandering copper track on the module's own board, beyond the shield can: nothing to buy or break, and tuned by the maker. The **U versions** — WROOM-1**U**, MINI-1**U**, WROOM-32**U** — leave that end bare and carry a **U.FL** socket instead: a coaxial connector the size of a grain of rice, to which you attach a cable (a "pigtail") and an antenna of your own. In the catalogue, 53 of the 89 parts use the PCB antenna and 32 the connector; the 4 bare system-in-package parts have neither.

### The trade

| | PCB antenna | Connector and external antenna |
|---|---|---|
| Cost | none | antenna, cable, bulkhead socket |
| Size | the module is longer: the ESP32-S3-WROOM-1 is 25.5 mm | 6.3 mm shorter (WROOM-1U, 19.2 mm); the C3-MINI-1U is 4.1 mm shorter than the C3-MINI-1 |
| Position | fixed at the module's edge | anywhere the cable reaches |
| Gain | about that of the maker's design | whatever you choose: a small whip or a directional panel |
| Metal enclosure | the radio is shut inside: little or no range | the antenna sits outside the box: unaffected |
| Robustness | nothing to detach | the tiny connector is rated for only a few dozen connections, and strains easily |

### The box decides

Radio waves do not pass through metal, and are dulled by almost everything else. A PCB antenna in a plastic box loses a few decibels and detunes slightly; beside a battery, a display or a metal frame it can lose far more; inside a metal box it is shielded. A connector lets the antenna go through the wall or sit on top, which is why metal cabinets, outdoor boxes and vehicles use U versions.

### What a decibel buys

Range follows the link budget ([[link-budget]]): each 3 dB of antenna gain multiplies free-space range by 1.4, and 6 dB doubles it. Indoors, where the signal fades faster, the effect is smaller:

| Extra gain | Free space (n = 2) | Indoors (n = 3) |
|---|---|---|
| 3 dB | × 1.41 | × 1.26 |
| 6 dB | × 2.0 | × 1.58 |
| 10 dB | × 3.2 | × 2.15 |

A long, thin pigtail eats part of this: of the order of half a decibel to one decibel per ten centimetres is typical for the thinnest cable.

### The catches

- **The approval counts the antenna.** A bigger one can push the radiated power over the legal limit — in Europe 20 dBm EIRP in this band — and the approval then no longer covers the product ([[module-certification]]). Check your country's rules.
- **Never leave a U module with nothing on its socket:** it transmits into no proper load and has almost no range.
- **It must be a 2.4 GHz antenna** with the right connector. SMA and "reverse polarity" RP-SMA look alike and do not mate.
- **Some modules carry both.** The ESP32-WROOM-DA has two PCB antennas and an RF switch that chooses between them.

> [!key] The PCB antenna is free and fine in a plastic box; the U version trades a connector, a cable and an antenna for freedom of placement — essential in metal. Each 6 dB of antenna gain doubles free-space range, but the approval covers only the antennas it lists.`,
  ideas: [
    'A PCB antenna is a printed track on the module; a U version has a U.FL socket for an external antenna instead.',
    'A metal enclosure shuts a PCB antenna in; a connector lets the antenna sit outside.',
    'Each 6 dB of antenna gain doubles the range in free space, and multiplies it by about 1.6 indoors.',
    'The module\'s approval lists its antennas: a different, stronger one can make a product illegal.'
  ],
  pitfalls: [
    'An external antenna always gives more range than the PCB one — A cheap antenna on a long thin cable can be worse: the cable loses decibels, and an antenna made for another band or badly placed gives nothing. Measure.',
    'The U version is just the same module — It has no antenna on board. Without one attached it has almost no range, and the antenna you add is part of what is approved.',
    'I will put the module in a metal box, the antenna will be fine — A PCB antenna inside a metal enclosure is shielded. Use a U version and bring the antenna out, or leave the antenna end outside.'
  ],
  terms: [
    { term: 'PCB antenna', also: ['trace antenna', 'meander antenna', 'inverted-F antenna'], def: 'An antenna made of a copper track on the circuit board itself. It costs nothing, but its tuning and pattern depend on the board, the enclosure and anything near it.' },
    { term: 'U.FL', also: ['IPEX', 'MHF1', 'u.FL connector'], def: 'A tiny coaxial connector for the antenna of a U version module. It is rated for only a few dozen mating cycles, and takes a cable ("pigtail") to a larger connector or an antenna.' },
    { term: 'Pigtail', also: ['antenna cable', 'U.FL to SMA'], def: 'A short coaxial cable with a U.FL plug at one end and a larger connector (usually SMA or RP-SMA) at the other. Long, thin pigtails lose signal.' },
    { term: 'dBi', also: ['antenna gain'], def: 'The gain of an antenna in decibels compared with an ideal one that radiates equally in all directions. A higher figure concentrates the signal in some directions and takes it away from others.' },
    { term: 'EIRP', also: ['effective isotropic radiated power'], def: 'The transmit power plus the antenna gain, in dBm: the figure that radio rules limit. A 20 dBm transmitter on a 9 dBi antenna has 29 dBm EIRP.' }
  ],
  choose: {
    good: ['PCB antenna: plastic enclosures, rooms-and-floors ranges, and every design that must stay simple', 'Connector: metal boxes, outdoor and vehicle use, a better position than the board allows', 'Connector with a directional antenna, where the range matters and the direction is known', 'Dual-antenna modules where the product is used in changing orientations'],
    avoid: ['A PCB antenna inside a metal box or beside a battery or a display', 'A connector module with no antenna fitted, or with a 5 GHz-only antenna', 'A higher-gain antenna than the approval lists, without reducing the transmit power and checking the rules'],
    check: ['The exact ordering code: is there a U on the end?', 'The antennas listed in the module\'s approval', 'The signal strength in the finished enclosure, against the open board']
  },
  code: [
    {
      title: 'Compare two antennas by their average signal strength',
      about: 'Joins your Wi-Fi network and prints the average of 20 signal-strength readings, half a second apart. Run it with one antenna, then the other, without moving anything else.',
      needs: 'A Wi-Fi board, your own router in reach, and the serial monitor at 115200 baud.',
      wiring: [['Board', 'U.FL socket → pigtail → antenna', 'for the connector version; nothing to wire for the PCB antenna']],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          set [readings v] to (20)
        forever
          set [total v] to (0)
          repeat (readings)
            change [total v] by (signal strength)
            wait (0.5) seconds
          end
          print (join [Average RSSI in dBm: ] ((total) / (readings)))
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";            // do not leave real credentials in shared code
        const char *PASS = "your-password";
        const int SAMPLES = 20;

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) delay(250);
        }

        void loop() {
          long total = 0;
          for (int i = 0; i < SAMPLES; i++) {
            total += WiFi.RSSI();                  // dBm, a negative number: closer to 0 is stronger
            delay(500);
          }
          Serial.printf("Average RSSI in dBm: %.1f\n", total / (float)SAMPLES);
        }
      `,
      py: String.raw`
        import network, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")   # do not leave real credentials in shared code
        t0 = time.ticks_ms()
        while not wlan.isconnected():
            if time.ticks_diff(time.ticks_ms(), t0) > 15000:
                raise RuntimeError("no Wi-Fi")
            time.sleep_ms(250)

        SAMPLES = 20
        while True:
            total = 0
            for _ in range(SAMPLES):
                total += wlan.status("rssi")         # dBm, a negative number: closer to 0 is stronger
                time.sleep_ms(500)
            print("Average RSSI in dBm: %.1f" % (total / SAMPLES))
      `,
      output: `
        Average RSSI in dBm: -61.4
        Average RSSI in dBm: -60.8
        Average RSSI in dBm: -61.9
      `,
      notes: ['Wi-Fi signal strength wanders by several decibels from second to second, which is why the program averages. A difference of less than about 3 dB between two antennas is within the noise.', 'Compare in the finished enclosure, at the same distance and orientation, with the router untouched: the enclosure is what the test is about. Never put real passwords in code you share.', 'RSSI is what the board hears. The board\'s transmit side uses the same antenna, so a better reading usually means a better link both ways.']
    }
  ],
  formulas: [
    {
      name: 'Range gained by antenna gain',
      expr: 'r = 10^(dG/(10*n))',
      tex: 'r = 10^{\\frac{\\Delta G}{10\\,n}}',
      vars: {
        r: { name: 'range ratio (new range over old)', q: 'ratio' },
        dG: { name: 'gain gained (new antenna minus old, minus cable loss)', q: 'gain', unit: 'dB', value: 6, min: 0, max: 30, tex: '\\Delta G' },
        n: { name: 'path-loss exponent', q: 'none', value: 3, min: 1.6, max: 4.5 }
      },
      solveFor: 'r',
      note: 'n is 2 in free space and about 2.7 to 3.5 inside buildings. The formula assumes the same transmitter and receiver, and that nothing else limits the range.',
      stories: { r: 'An external antenna gives {dG} more gain than the PCB antenna, in surroundings with a path-loss exponent of {n}. By what factor does the range grow?' }
    }
  ],
  examples: [
    {
      title: 'Is the external antenna worth it?',
      q: 'A sensor with an ESP32-C3-MINI-1U sits in a plastic box in a garden shed, 40 m from the router, through two walls. A 5 dBi antenna on a 15 cm pigtail replaces what would have been a PCB antenna of about 0 dBi. The cable loses about 1 dB. By what factor does the range grow indoors (n = 3)?',
      steps: ['The net gain gained is $5 - 1 = 4$ dB.', 'The range ratio is $10^{\\Delta G/(10 n)} = 10^{4/30}$.', '$10^{0.133} \\approx 1.36$.'],
      a: 'About 1.36 times the range — a third more, from 4 dB. Doubling the range indoors would take about 9 dB.'
    }
  ],
  quiz: [
    { q: 'A module will live in a die-cast aluminium box. Which module?', choices: ['A PCB-antenna version, with the antenna end facing the lid', 'A U version, with the antenna outside the box on a pigtail', 'Either, because metal does not matter', 'A module with PSRAM'], a: 1, why: 'Metal shields the PCB antenna. The U version lets the antenna sit outside the box.' },
    { q: 'By about how much does 6 dB of extra antenna gain multiply the range in free space?', choices: ['1.4', '2', '4', '6'], a: 1, why: 'In free space the signal falls with the square of the distance, so 6 dB (a factor of four in power) doubles the range.' },
    { q: 'An ESP32-S3-WROOM-1U works on the bench with no antenna fitted, so none is needed.', a: false, why: 'Without an antenna it works only a few centimetres from the router, and it transmits into no proper load. Always fit a 2.4 GHz antenna.' },
    { q: 'Why can swapping in a stronger antenna make a product illegal even though the module is approved?', choices: ['Stronger antennas use more current', 'The approval is for specific antennas; more gain can push the radiated power over the legal limit', 'The module must be returned to the maker', 'It is never illegal'], a: 1, why: 'Limits are set on radiated power (EIRP): transmit power plus antenna gain. The module was tested with listed antennas.' }
  ],
  applications: [
    'Metal-cased products — industrial controllers, vending machines, meter cabinets — where the antenna must be outside.',
    'Outdoor sensors and gateways, with an antenna on a mast or the top of an enclosure.',
    'Range-sensitive boards sold in a U variant with a small external antenna.',
    'Comparing the antennas of a finished product by averaging the signal strength, as in the program above.'
  ],
  sources: [
    'Espressif, *ESP32-S3-WROOM-1 and ESP32-S3-WROOM-1U Datasheet*: dimensions and the PCB antenna placement.',
    'Espressif, *ESP32-WROOM-DA Datasheet*: the two antennas and the RF switch.',
    'ETSI EN 300 328: wideband transmission systems in the 2.4 GHz band (the power limit).'
  ],
  sim: 'mo-antenna'
},

/* ================================================================ certification */
{
  id: 'module-certification',
  parent: 'modules-and-packages',
  title: 'Why a certified module matters',
  level: 2,
  short: 'A radio must be approved before it is sold. A module is tested and approved as a whole, with its antenna; build it in exactly as tested and the radio part of your product is already covered. Change the antenna or the surroundings and the cover is gone — and the finished product still has its own rules to meet.',
  keywords: ['certification', 'modular approval', 'FCC', 'CE', 'RED', 'ISED', 'UKCA', 'approved module', 'pre-certified', 'EIRP', 'unintentional radiator', 'compliance', 'regulatory', 'antenna approval'],
  prereq: ['what-a-module-adds', 'pcb-antenna-or-connector'],
  related: ['regulatory-approval', 'regulations-cra-and-red', 'transmit-power-and-regulations', 'module-footprints-and-soldering', 'designing-with-the-bare-chip', 'antenna-placement-and-enclosures'],
  body: `Every country keeps the airwaves in order: which frequencies a device may use, how much power it may radiate, how much stray noise it may make. A product with a radio must show before it is sold that it keeps those rules, in a test lab, with its antenna, at a cost in time and money. In the United States the body is the FCC, in Canada ISED, in the European Union it is the CE mark under the Radio Equipment Directive, in the United Kingdom UKCA; Japan, China, Korea and others have their own.

### What a module gives you

An approved module has been through that process **as a radio**, with its antenna, in a stated set-up. When you build the module into a product, you may rely on them for the radio part — *modular approval* — **if you use the module the way it was tested**:

- the **antenna**: the PCB antenna as designed, or for a U version only the antennas (or antenna types and gains) that the approval lists;
- the **surroundings**: the keep-out area round the antenna kept clear, as the datasheet draws it, and no change to the module itself;
- the **marking**: the product carries the module's identification, in the way the rules ask.

### What it does not give you

The approval covers the radio, not your product. The finished device still has to meet the rules for its own electronics (a switching regulator, motor driver or display can be noisier than the radio), for the safety of mains and battery parts, for radio exposure near the body, for the environment (RoHS, WEEE), and in the EU for the security of connected radio equipment ([[regulations-cra-and-red]]). A certified module in an uncertified product is an uncertified product.

### What breaks the cover

- **A different antenna.** More gain pushes the radiated power (EIRP) up. A module that radiates 17 dBm at its antenna reaches the European limit of 20 dBm in this band with a 3 dBi antenna; with a 9 dBi one it radiates 26 dBm, four times too much.
- **The antenna elsewhere.** Over a ground plane, beside a battery or inside a metal case, a PCB antenna's pattern and tuning change: it is no longer what was tested.
- **A changed module**: the shield can removed, parts changed, a copy that is not the approved version ([[clones-and-counterfeits]]).
- **Software that exceeds the rules**: transmit power above the legal limit, or a country setting that allows channels the product may not use.

### A hobbyist and a product

A single device you build and keep is not "placed on the market", but the rules on bands and power still bind it. Once you sell or install devices for others, they are products and the above applies. The alternative to an approved module is a design on the bare chip ([[designing-with-the-bare-chip]]), where *you* certify the radio, and retest after every change.

> [!warn] Radio rules differ by country and change over time. This page gives the principle, not legal advice: read the approval documents of your exact module, and the rules of every country where you will sell.

> [!key] A certified module carries its own radio tests: use it as tested — its antenna, its keep-out, its supply — and the radio part is covered. The antenna, the surroundings and the product's other rules are still yours.`,
  ideas: [
    'A module is tested and approved as a radio, with its antenna; a product that uses it as tested can rely on that for the radio part.',
    'The antenna, the keep-out area and the surroundings are part of what was tested: change them and the cover goes.',
    'The finished product still needs its own assessment: noise from its electronics, safety, exposure, labelling, security rules.',
    'Designing on the bare chip means certifying the radio yourself.'
  ],
  pitfalls: [
    'The module is certified, so my product is certified — Only the radio part, and only if it is used as tested. The noise of your own electronics, safety and the rest are yours.',
    'A bigger antenna just improves the range — It can raise the radiated power over the legal limit, and it is outside the approval. Reduce the transmit power, or use an antenna the approval lists.',
    'Once the module is on my board I can change anything in software — The software must keep the power and channel limits of the region, and a hardware change to the module ends the cover.'
  ],
  terms: [
    { term: 'Modular approval', also: ['modular certification', 'pre-certified module'], def: 'An approval of a radio module as a whole, tested with its antenna. A product that builds it in as specified can use that approval for its radio part, instead of testing the radio itself.' },
    { term: 'EIRP', also: ['effective isotropic radiated power'], def: 'The transmit power plus the antenna gain, expressed in dBm. It is the quantity that most radio rules limit: in Europe, 20 dBm in the 2.4 GHz band.' },
    { term: 'FCC ID', also: ['grantee code'], def: 'The identifier of an FCC equipment approval in the United States. Products that contain an approved module usually show it on a label, in the form "contains FCC ID".' },
    { term: 'RED', also: ['Radio Equipment Directive', 'CE marking'], def: 'The European Union\'s law for radio equipment. A product with a radio must be assessed under it and carry the CE mark before sale; recent rules add cyber-security requirements for connected devices.' },
    { term: 'Unintentional radiator', also: ['Part 15B', 'EMC'], def: 'Any electronics that makes radio-frequency noise without meaning to — a switching regulator, a display, a motor driver. The finished product is tested for it separately from the radio module.' }
  ],
  choose: {
    good: ['An approved module whenever the product will be sold beyond trial numbers', 'The module version and antenna that are listed in the approval for your regions', 'A module from a maker that publishes its test reports and integration notes'],
    avoid: ['Antennas and placements the approval does not list', 'Unmarked or untraceable modules that cannot be tied to an approval', 'Assuming the approval of one region covers another'],
    check: ['Which regions your module is approved for', 'The antenna list and the keep-out drawing in the datasheet', 'What your own electronics emit: plan a test for the finished product']
  },
  examples: [
    {
      title: 'The 9 dBi antenna',
      q: 'A product uses an ESP32-S3-WROOM-1U module approved at 17 dBm with antennas of up to 3 dBi, which is 20 dBm EIRP. The designer fits a 9 dBi antenna for more range. What happens to the radiated power, and what are the options?',
      steps: ['The radiated power is $17 + 9 = 26$ dBm EIRP.', 'The European limit in this band is 20 dBm EIRP: 6 dB more is $10^{0.6} \\approx 4$ times the power.', 'The 9 dBi antenna is not in the approval anyway, so the module\'s cover does not apply.', 'Options: use an antenna the approval lists; or reduce the transmit power by 6 dB in software and have the combination assessed; or have the product approved with that antenna.'],
      a: 'The product radiates about four times the legal power, and is outside the module\'s approval. Use a listed antenna, or lower the power by 6 dB and have the new combination assessed.'
    }
  ],
  quiz: [
    { q: 'Your product uses an approved module exactly as tested. What does the approval still not cover?', choices: ['The radio\'s transmit power', 'The noise made by your own switching regulator, and the product\'s safety', 'The module\'s frequency', 'The antenna on the module'], a: 1, why: 'The approval is of the radio. The finished product must still meet the rules for its own electronics, safety and other requirements.' },
    { q: 'Which change is most likely to end the cover of the module\'s approval?', choices: ['Powering it from a different 3.3 V regulator', 'Replacing its antenna with a stronger one the approval does not list', 'Changing the program', 'Using a different colour of circuit board'], a: 1, why: 'The antenna is part of the tested set-up, and more gain raises the radiated power.' },
    { q: 'A single Wi-Fi gadget built for your own desk is exempt from all rules about bands and power.', a: false, why: 'Placing a product on the market triggers the approval requirements, but the rules on which bands and what power a transmitter may use bind everyone who operates one.' },
    { q: 'Why do designers use a certified module rather than a bare chip for a first product?', choices: ['It is cheaper per piece', 'The radio is already tested and approved, which saves a design and a lab project', 'It uses less power', 'It avoids all other rules'], a: 1, why: 'The module is dearer per piece, but the radio design and its approval are done. The product still has its own checks.' }
  ],
  applications: [
    'Any product sold in the EU, the US or elsewhere that contains an ESP module: smart plugs, sensors, lighting, appliances.',
    'Choosing between a PCB-antenna module and a U version, since the approval lists the antennas.',
    'Preparing the file for a product assessment: the module\'s approval documents are part of it.',
    'Deciding whether a project is ready for sale or must stay a prototype.'
  ],
  sources: [
    'Directive 2014/53/EU (the Radio Equipment Directive) and ETSI EN 300 328 for the 2.4 GHz band.',
    'US Code of Federal Regulations, Title 47, Part 15: radio-frequency devices, including the rules for modular transmitters.',
    'Espressif, the certification information and integration notes in each module\'s datasheet, and the *Hardware Design Guidelines*.'
  ],
  sim: 'mo-approval'
},

/* ================================================================ systems in package */
{
  id: 'system-in-package',
  parent: 'modules-and-packages',
  title: 'Systems in a package: the PICO parts',
  level: 2,
  short: 'A system in package puts the chip, its flash, its crystal and its radio matching parts into one 7 × 7 mm square. It is the smallest way to use an ESP chip with a radio that works — but it has no antenna, it is not an approved module, and you design everything around it.',
  keywords: ['system in package', 'SiP', 'PICO', 'ESP32-PICO-D4', 'ESP32-PICO-V3', 'ESP32-S3-PICO-1', 'PICO-MINI', 'in-package flash', 'ESP8684', 'ESP8685', 'integrated flash', 'small design'],
  prereq: ['wroom-wrover-mini-pico', 'what-a-module-adds'],
  related: ['module-certification', 'designing-with-the-bare-chip', 'flash-memory-on-modules', 'psram-on-modules', 'pcb-layout-for-modules', 'soc-esp32-c3'],
  body: `Between the bare chip and the module there is a middle step. A **system in package** (SiP) is a single component in which several dies and parts share one plastic body: the ESP32 chip, a flash die, the crystal, the filter capacitors and the radio matching network. The ESP32-PICO-D4, the first of them, packs a 40 MHz crystal, 4 MB of flash, capacitors and the matching network into a square of 7 × 7 mm. It looks like a chip, solders like a chip, and behaves like a chip with the memory and the clock already fitted.

### What the catalogue holds

| Part | Flash and PSRAM in the package | Size | Status |
|---|---|---|---|
| ESP32-PICO-D4 | 4 MB flash | 7 × 7 mm | not recommended for new designs |
| ESP32-PICO-V3 | 4 MB flash | 7 × 7 mm | mass production |
| ESP32-PICO-V3-02 | 8 MB flash, 2 MB PSRAM | 7 × 7 mm | not recommended for new designs |
| ESP32-S3-PICO-1 | 8 MB flash; 2 MB or 8 MB PSRAM | 7 × 7 mm | mass production |

None of them has an antenna: the catalogue records "none (bare SiP: needs external antenna)". Two modules are built on them: the **ESP32-PICO-MINI-02** (13.2 × 16.6 × 2.4 mm, PCB antenna or, in the U version, a connector) and the **ESP32-PICO-V3-ZERO**, a 16 × 23 mm module sold as an Alexa Connect Kit part, which leads out only a handful of pins because a host processor is meant to talk to it over a serial line.

### The levels side by side

| | Bare chip | System in package | Module | Development board |
|---|---|---|---|---|
| Processor and radio | yes | yes | yes | yes |
| Flash | usually not | yes | yes | yes |
| Crystal and matching | no | yes | yes | yes |
| Antenna | no | no | yes | yes |
| Shield can, tested radio | no | no | yes | yes |
| Regulator and USB | no | no | no | yes |

Do not confuse the SiP with chips that merely have flash *inside their package*. The ESP32-C3FH4, ESP32-C6FH4 or ESP32-S3FH4R2 carry flash (the F) and are still ordinary chips: the crystal and the radio parts are yours. The ESP8684 and ESP8685 names are the same idea in a smaller package: an ESP32-C2 or C3 with its flash in a 4 × 4 mm square.

### What you gain, what you give up

**Gain:** the smallest board; very few external parts, since the matching network is already tuned; no routing of fast flash lines; fewer chip pins on your board, because the memory pins stay inside (the PICO-MINI-02 leaves out GPIO6 and GPIO11 for its flash and GPIO9 and GPIO10 for its PSRAM). **Give up:** the flash size is fixed when you buy; the antenna and its feed line are yours to design and tune, with the layout rules of the hardware design guide ([[pcb-layout-for-modules]]); and because it is not a module, the radio of your product has to be certified as your own ([[module-certification]]). The two oldest parts are also no longer recommended for new designs.

> [!key] A system in package is the chip with flash, crystal and radio matching already inside, in 7 × 7 mm. It saves board space and parts, but the antenna, the layout and the radio approval are yours; a module is the SiP plus antenna, can and tests.`,
  ideas: [
    'A SiP is one component holding the chip, flash (sometimes PSRAM), crystal and radio matching network.',
    'The PICO parts are 7 × 7 mm and have no antenna: the antenna design and radio certification are yours.',
    'A PICO-MINI module is a SiP on a small board with an antenna and a shield can.',
    'Chips with in-package flash (the F types) are not SiPs: their crystal and radio parts are still outside.'
  ],
  pitfalls: [
    'A PICO part is a module — It has no antenna, no shield can and no tested radio. It is a component you build a radio around.',
    'The flash inside a chip means it is a PICO — Many ordinary chips (C3FH4, C6FH4) carry flash in the package but still need a crystal and radio matching outside. Only the PICO parts include those too.',
    'I can use all the pins the chip has — The pins that serve the flash and PSRAM stay inside the package or are left unused; the PICO-MINI-02 loses four GPIOs this way.'
  ],
  terms: [
    { term: 'System in package', also: ['SiP', 'PICO'], def: 'A single component with several dies and parts in one package. The ESP32 PICO parts hold the chip, flash, crystal and radio matching network, in 7 × 7 mm.' },
    { term: 'In-package flash', also: ['embedded flash', 'FH4', 'F type'], def: 'A flash die inside the chip\'s own package, as in the ESP32-C3FH4. It needs no board space for the memory, but the chip still needs a crystal and radio parts outside.' },
    { term: 'ESP8684', also: ['ESP8685', 'ESP8684H4'], def: 'Names for the ESP32-C2 (ESP8684) and ESP32-C3 (ESP8685) with flash in a small 4 × 4 mm package, sold mainly for volume products and in small WROOM modules.' },
    { term: 'Land pattern', also: ['footprint', 'PCB land'], def: 'The copper shapes on a circuit board that a component\'s pads are soldered to. Its drawing, with dimensions, is in the component\'s datasheet.' }
  ],
  choose: {
    good: ['Very small products where a chip antenna or a small PCB antenna fits', 'Volume designs with an RF layout available, where the module cost matters', 'Designs that want the flash and PSRAM wires kept short and inside'],
    avoid: ['A first radio design without RF experience or a test plan', 'Products that rely on a pre-approved radio', 'Parts marked not recommended for new designs: PICO-D4 and PICO-V3-02'],
    check: ['The status of the part, in the catalogue and in the datasheet', 'The antenna design in the hardware design guide, and a test plan for the radio', 'Which pins the package gives back, and which stay inside']
  },
  examples: [
    {
      title: 'Board space',
      q: 'A circuit uses an ESP32-C3-MINI-1 module (13.2 × 16.6 mm) and the designer wants a smaller board with an ESP32-S3-PICO-1 (7 × 7 mm). How much area does the package save, ignoring the antenna?',
      steps: ['The module covers $13.2 \\times 16.6 = 219$ mm².', 'The SiP covers $7 \\times 7 = 49$ mm².', 'The saving is $219 - 49 = 170$ mm², about 78 %.', 'But the SiP needs an antenna with its keep-out area, and a matching line to it, so the saving on the finished board is smaller.'],
      a: 'The package itself is about 78 % smaller, but the antenna and its keep-out area must still be added, so the real saving is much less.'
    }
  ],
  quiz: [
    { q: 'What does an ESP32-PICO-V3 hold in its package besides the chip?', choices: ['Flash, a crystal and radio matching parts', 'An antenna and a shield can', 'A USB socket and regulator', 'Only a crystal'], a: 0, why: 'A PICO SiP holds the chip, 4 MB of flash, the crystal and the matching network. The antenna and everything else are outside.' },
    { q: 'You use an ESP32-S3-PICO-1 in a product. Who certifies the radio?', choices: ['Espressif already did, for the package', 'You do: it is not a module with an approved antenna', 'The antenna maker', 'Nobody needs to'], a: 1, why: 'The SiP has no antenna and is not an approved module. The radio of the product, with your antenna and layout, is assessed as yours.' },
    { q: 'An ESP32-C3FH4 is a system in package like the PICO parts.', a: false, why: 'The F means flash in the package. The crystal and radio matching network are still outside, so it is an ordinary chip.' },
    { q: 'Why does the ESP32-PICO-MINI-02 lead out fewer GPIOs than the chip has?', choices: ['The module has no space', 'Four of the chip\'s pins are used inside for the flash and the PSRAM', 'Espressif disables them in software', 'The antenna uses them'], a: 1, why: 'GPIO6 and GPIO11 connect the flash, and GPIO9 and GPIO10 the PSRAM; they are not led out.' }
  ],
  applications: [
    'Wearables, tags and other small designs, where a 7 × 7 mm package and a tiny antenna fit.',
    'Volume products where the extra module price matters and an RF designer is available.',
    'Modules built on a SiP, such as the PICO-MINI-02 and the Alexa Connect Kit module.',
    'Understanding datasheets: the PICO names carry the memory in their code and tell what the package holds.'
  ],
  sources: [
    'Espressif, *ESP32-PICO-D4*, *ESP32-PICO-V3* and *ESP32-S3-PICO-1* datasheets: block diagrams, pin lists, ordering information.',
    'Espressif, *ESP32-PICO-MINI-02* and *ESP32-PICO-V3-ZERO* datasheets.',
    'Espressif, *ESP32 Hardware Design Guidelines*: the notes on the SiP and the antenna matching.'
  ],
  sim: { id: 'mo-anatomy', params: { view: 'sip' } }
},

/* ================================================================ footprints and soldering */
{
  id: 'module-footprints-and-soldering',
  parent: 'modules-and-packages',
  title: 'Footprints and soldering a module',
  level: 2,
  short: 'Putting a module on your own board means copying its land pattern exactly, keeping everything away from the antenna, giving it a clean supply and a way to be programmed, and soldering it with the process its datasheet describes. The antenna end decides more than any other detail.',
  keywords: ['footprint', 'land pattern', 'keep-out', 'antenna keep-out', 'ground pad', 'reflow', 'hand soldering', 'solder paste', 'stencil', 'moisture sensitivity', 'EN pin', 'programming header', 'no-clean flux', 'module placement', 'board edge'],
  prereq: ['what-a-module-adds', 'pcb-antenna-or-connector'],
  related: ['pcb-layout-for-modules', 'soldering-and-rework', 'antenna-placement-and-enclosures', 'module-certification', 'current-peaks-and-capacitors', 'boot-modes-and-download-mode', 'designing-with-the-bare-chip'],
  body: `A module saves you the radio design, but it does not place itself. Four things on your board decide whether it works as the datasheet promises: the footprint, the antenna's surroundings, the supply and programming pins, and the soldering.

### The footprint

The datasheet carries a **land pattern** drawing: the copper pads on your board that the module's pads are soldered to, with their sizes and positions. Copy it as drawn; do not redraw it from the pad table. The pad count varies: 38 for an ESP32-WROOM-32, 41 for an ESP32-S3-WROOM-1, 53 for an ESP32-C3-MINI-1. Many are ground pads, and the large ground pad under the module is soldered too: it carries heat and gives the radio its ground.

### The antenna's surroundings

This rule matters most. A PCB antenna works only if the space around it is free: **no copper, no ground plane, no tracks, no components** under or beside the antenna end, in the area the datasheet draws. The usual way is to put the module at the **edge of the board** with the antenna end flush with it or overhanging, and to keep batteries, speakers, displays, screws and metal frames away. A solid ground plane under the module's *body* is good; under its antenna it is fatal. The simulation shows how loss grows as the keep-out is violated.

### Supply, reset and the way in

- **Supply.** Put a capacitor of the value the datasheet names right at the 3V3 pad, and a bulk capacitor behind it, since the radio draws a few hundred milliamperes in bursts ([[current-peaks-and-capacitors]]).
- **EN.** The enable pin must never float. It wants a pull-up, and usually a small capacitor to ground, so that the chip starts only when the supply is steady.
- **Strapping pins.** On the classic ESP32 modules the datasheets say GPIO12 (MTDI) must be low at power-up ([[strapping-pins]]).
- **A way to program it.** Lead the serial pins (TX and RX), EN and the boot pin (GPIO0 on the ESP32 and S3, GPIO9 on the C3) to pads or a header, or the USB pins on chips that have them, so that the board can be flashed in the factory and in the field ([[boot-modes-and-download-mode]]).

### Soldering

**Reflow** is the normal way: solder paste through a stencil, the module placed on top, an oven following the profile in the datasheet. Modules are parts that take up water from the air: keep them in their sealed bag, and bake them if the datasheet's exposure limit has passed, or steam can lift the can. **By hand**, modules with pads on their edges can be soldered with an iron and flux; the large ground pad and the modules with pads *underneath* (the MINI types) need hot air or reflow. Use a **no-clean flux** and do not wash the board: a module is not sealed, and flux that gets under the can cannot be rinsed out.

Irons and hot air reach 300 °C and more, and flux fumes are unpleasant to breathe: work with ventilation ([[soldering-and-rework]]). And test one board before ordering fifty.

> [!key] Copy the datasheet's land pattern, keep the antenna end clear of copper and metal at the edge of the board, give the module a clean supply, a held-up EN pin and a programming path, and solder it with the datasheet's own process.`,
  ideas: [
    'Copy the land pattern from the datasheet exactly, including the ground pad under the module.',
    'The antenna needs a keep-out area free of copper, tracks and components; put the module at the board edge with the antenna end outside or flush.',
    'Give the module a decoupled supply, an EN pin that does not float, and a way to program it.',
    'Solder it with the datasheet\'s reflow profile; keep the parts dry and use no-clean flux.'
  ],
  pitfalls: [
    'A ground plane under the whole module improves the radio — Under the body, yes; under the antenna it detunes it and can ruin the range. Keep the antenna area clear.',
    'The module is sealed, so I can wash the board — Flux gets under the can and cannot be rinsed out. Use no-clean flux and do not wash.',
    'I can solder it by hand like any chip — Edge pads, yes, with flux. The ground pad and the pads under MINI modules need hot air or reflow; otherwise the ground connection is poor or missing.'
  ],
  terms: [
    { term: 'Keep-out area', also: ['antenna keep-out', 'exclusion zone'], def: 'The region round and under a PCB antenna where there must be no copper, tracks or components, nor metal parts beyond the board. The datasheet draws it, and the module\'s approval assumes it.' },
    { term: 'Land pattern', also: ['footprint', 'PCB land'], def: 'The copper shapes on the board that a component\'s pads are soldered to. The datasheet\'s drawing gives their size and position.' },
    { term: 'Ground pad', also: ['thermal pad', 'exposed pad'], def: 'The large central pad under a module that is soldered to the board\'s ground. It gives the radio a good ground and carries heat away.' },
    { term: 'Reflow soldering', also: ['reflow', 'solder paste'], def: 'Soldering with paste printed through a stencil and melted in an oven or hot-air station, following a temperature profile. It is how modules are normally mounted.' },
    { term: 'Moisture sensitivity', also: ['MSL', 'bake'], def: 'Many electronic parts absorb water from air; heating them quickly can turn it to steam and crack the package. They are kept in sealed bags and baked if left out too long.' }
  ],
  choose: {
    good: ['A module with edge pads for hand-built prototypes', 'Placement at the board edge with the antenna end flush or overhanging', 'No-clean flux and a reflow profile from the datasheet', 'Test pads or a header for TX, RX, EN and the boot pin'],
    avoid: ['Copper, tracks or components in the keep-out area', 'Batteries, speakers, displays or metal frames next to the antenna', 'Washing the finished board', 'Hand-soldering the ground pad with an iron alone'],
    check: ['The land pattern and keep-out drawings of your exact module', 'That EN has a pull-up and cannot float', 'The signal strength of a finished sample, against a development board']
  },
  examples: [
    {
      title: 'The dead sensor board',
      q: 'A first board with an ESP32-WROOM-32E connects to Wi-Fi only within two metres of the router, while a DevKit reaches across the house. The module sits in the middle of the board, with a ground plane under the whole of it. What is wrong, and what is the cure?',
      steps: ['A PCB antenna needs free space. A ground plane under the antenna end detunes it and takes the radiation away.', 'The module also sits in the middle of the board, so the antenna end has copper and tracks all around.', 'The cure is a new layout: the module at the board edge with the antenna end flush or overhanging, and the keep-out area drawn in the datasheet clear of copper.', 'A U version with an external antenna would also work, if the layout cannot change.'],
      a: 'The antenna is buried in copper. Move the module to the board edge with its keep-out area empty, or use a U version with an antenna on a cable.'
    }
  ],
  quiz: [
    { q: 'Where should the antenna end of a PCB-antenna module sit on your board?', choices: ['At the centre, surrounded by ground', 'At the board edge, with no copper under or beside it', 'Under a metal shield', 'Next to the battery'], a: 1, why: 'The antenna works best with free space round it: at the edge, flush or overhanging, with the keep-out area empty.' },
    { q: 'You reflow a module whose sealed bag was left open for several weeks. What does the datasheet\'s moisture rule say you should do?', choices: ['Nothing: heat dries it', 'Bake it first, as the datasheet specifies', 'Wash it', 'Reflow at a lower temperature'], a: 1, why: 'Absorbed water can turn to steam during reflow and damage the package. The datasheet gives the exposure limit and the baking.' },
    { q: 'The EN pin of a module may be left unconnected if the board has a reset button.', a: false, why: 'EN must never float. A pull-up (usually with a capacitor to ground) holds it high, and the button then pulls it low.' },
    { q: 'Why is the module\'s ground pad soldered to the board?', choices: ['It holds the can on', 'It gives the radio a good ground and carries heat away', 'It programs the flash', 'It is the antenna'], a: 1, why: 'The central pad is ground, and it conducts heat. Without it the radio ground is poor.' }
  ],
  applications: [
    'The first custom board of any product built around an ESP module.',
    'Choosing between a WROOM and a MINI module by how it will be assembled: edge pads by hand, underside pads by oven.',
    'Diagnosing a board with poor Wi-Fi range: usually antenna surroundings, not software.',
    'Preparing a production file: land pattern, stencil, reflow profile, programming pads.'
  ],
  sources: [
    'Espressif, module datasheets: the recommended PCB land pattern, the placement notes and the reflow profile.',
    'Espressif, *ESP32 Hardware Design Guidelines*: placing a module on a PCB, power supply and the EN circuit.',
    'IPC-7351 (land pattern standard) and the J-STD-020 and J-STD-033 notes on moisture-sensitive parts.'
  ],
  sim: 'mo-placement'
},

/* ================================================================ clones and counterfeits */
{
  id: 'clones-and-counterfeits',
  parent: 'modules-and-packages',
  title: 'Clones, remarked chips and checking what you bought',
  level: 2,
  short: 'Most cheap boards are honest copies; a few carry less memory than the label says, relabelled flash, or modules that cannot be traced to a datasheet. The checks are the same in every case: ask the chip who it is, how much flash and PSRAM it really holds, and test the memory instead of trusting the label.',
  keywords: ['clone', 'counterfeit', 'fake', 'remarked', 'relabelled flash', 'flash size', 'JEDEC ID', 'esptool flash-id', 'PSRAM test', 'N16R8 fake', 'chip identity', 'ESP.getFlashChipSize', 'address wrap-around', 'genuine'],
  prereq: ['reading-a-module-part-number', 'flash-memory-on-modules', 'psram-on-modules'],
  related: ['soc-esp32-c3', 'random-numbers-and-chip-identity', 'module-certification', 'flashing-and-esptool', 'choosing-a-board', 'reading-boot-messages'],
  body: `"ESP32-S3 N16R8" in a listing is a claim, not a measurement. Most of the time it is true. Sometimes it is a typing mistake, sometimes a board that carries a cheaper module than the title says, and now and then it is a part that was deliberately made to look like more. Whatever the reason, a few checks run from the board itself settle it.

### What you might be looking at

- **An honest copy.** A third-party board on a genuine module, copying Espressif's DevKit layout. Normal; it differs in USB chip, regulator and workmanship.
- **A wrong listing.** The module is genuine but is not the version in the title: N8 instead of N16, R2 instead of R8, an ESP32-S2 sold as an S3.
- **A remarked or relabelled part.** The print on a chip or flash memory has been ground off and replaced, or its identification code changed, so that it claims more than it holds.
- **A used or untraceable module.** Reclaimed modules sold as new, or an unmarked metal can that cannot be tied to any datasheet.

### Look first

A genuine module's can carries a printed name and the marks the markets require. A can with **no markings at all** deserves suspicion for a plain reason: nothing ties it to a datasheet, a test report or an approval ([[module-certification]]), and it hides the chip beneath. That is no proof of a fake, but it is a reason not to build a product on it.

### Ask the chip

1. **Who are you?** The chip model, revision and core count: the program on the [[soc-esp32-c3|ESP32-C3 page]] prints them. An "S3" that answers "ESP32" is a wrong listing.
2. **How much flash?** The program below prints the size the build assumes and the size the flash chip's identification code claims. From a computer, \`esptool flash-id\` shows the manufacturer and device code; in most chips the last byte is the capacity as a power of two (0x16 is 4 MB, 0x17 8 MB, 0x18 16 MB).
3. **How much PSRAM?** The size it reports — and a **test**: the program fills the whole PSRAM with numbers and reads them back.

### What relabelled flash looks like

A chip with 4 MB inside but an identification code claiming 16 MB has only 22 address lines connected. Addresses above 4 MB **wrap round**: a write at 12 MB lands at 0. Everything looks fine until something is written high up — an update slot, a file system — and the bootloader at the bottom is overwritten. The ID check cannot catch a chip that lies about its ID; the only proof is a **write test across the claimed size**, with a different stamp at each megabyte, read back. It erases flash, so use a spare board ([[flashing-and-esptool]]).

### Reducing the risk

Buy from the maker's own shop or an authorised distributor; for a product, keep the lot labels and test a sample of every delivery; an unusually low price for the exact ordering code is a reason to test, not to hurry. If a board does not match, keep the evidence: the program's output and the \`flash-id\` text.

> [!key] A label is a claim: check the chip model, read the flash size from the flash chip, and test the PSRAM across its whole range. An unmarked can, a missing ordering code or an unusually low price are reasons to test before you design in.`,
  ideas: [
    'Most cheap boards are honest copies; the problems are wrong listings, relabelled memory and untraceable modules.',
    'Ask the chip: its model and revision, the flash size from the flash chip\'s own ID, and the PSRAM size.',
    'A flash that claims more than it holds wraps its addresses: writes high up overwrite the start, including the bootloader.',
    'Test the PSRAM across its whole range by writing each block its own number; the ID check does not do that.'
  ],
  pitfalls: [
    'The flash size printed by the sketch is the real one — It may be the size the build assumes. The flash chip\'s own identification code, and a write test across the whole size, tell more.',
    'If it boots and runs my program it is genuine — A 4 MB chip claiming 16 MB boots fine; it fails only when something is written high up. Test before the product depends on it.',
    'A clone is always a fake — A board that copies an official layout and uses genuine modules is a normal and legal product; what matters is what is on it and whether it is labelled honestly.'
  ],
  terms: [
    { term: 'Remarked part', also: ['relabelled', 'remarking', 'counterfeit'], def: 'A chip whose print has been ground off and replaced, or whose identification code has been altered, so that it claims to be a better or larger part than it is.' },
    { term: 'JEDEC ID', also: ['flash ID', 'device ID', 'manufacturer ID'], def: 'The three bytes a flash chip sends when asked who it is: manufacturer, memory type and capacity. In most chips the last byte is the capacity as a power of two, so 0x18 means 16 MB.' },
    { term: 'Address wrap-around', also: ['aliasing', 'memory aliasing'], def: 'What happens when a memory is smaller than the address range it is given: the top address lines are ignored, so an address beyond the end lands at the same place as a lower one.' },
    { term: 'Clone board', also: ['copy', 'DevKit clone'], def: 'A third-party board that copies the layout of a maker\'s board. If it uses genuine modules it is a legitimate product; the label should say what is on it.' }
  ],
  choose: {
    good: ['The maker\'s own shop or authorised distributors, for anything that goes into a product', 'Sellers that show the full ordering code and a clear photo of the module marking', 'Reels with traceable lot labels, plus a sample test of every delivery'],
    avoid: ['Modules with unmarked cans', 'Listings that omit the ordering code or give only the memory code', 'A price far below the usual one for the exact code'],
    check: ['Chip model and revision from the chip itself', 'Flash size from the flash chip\'s ID, and a write test on a spare board', 'PSRAM size reported, and a test over its whole range']
  },
  code: [
    {
      title: 'Does it carry what the label says?',
      about: 'Prints the flash size three ways (what the build assumes, what the flash chip\'s ID claims, what the label promises), the PSRAM size, and then tests the PSRAM: every 4 KB block gets its own number, and the program counts the blocks that lose it.',
      needs: 'An ESP32-S3 N16R8 board as the example (set the two label values for yours), with the PSRAM option switched on in the Tools menu, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [label flash v] to (16)
          set [label PSRAM v] to (8)
          print (join [Flash MB: build ] (flash size) [, chip ID says ] (flash size from the chip ID) [, label says ] (label flash))
          print (join [PSRAM KB: reported ] ((PSRAM size) / (1024)) [, label says ] ((label PSRAM) * (1024)))
          if <(PSRAM size) > (0)> then
            test the PSRAM addresses :: my
          end

        define test the PSRAM addresses
          set [buffer v] to (allocate (largest free PSRAM block) bytes in PSRAM)
          set [blocks v] to ((length of [buffer v]) / (4096))
          set [wrong v] to (0)
          for each [b v] in (list 0 to ((blocks) - (1)))
            write the number (b) at byte (b * 4096) of [buffer v]
          end
          for each [b v] in (list 0 to ((blocks) - (1)))
            if <not <(number at byte ((b) * (4096)) of [buffer v]) = (b)>> then
              change [wrong v] by (1)
            end
          end
          print (join [Blocks tested: ] (blocks) [, lost their number: ] (wrong))
      `,
      cpp: String.raw`
        #include "esp_flash.h"

        const uint32_t LABEL_FLASH_MB = 16;                    // what the label promises (N16R8)
        const uint32_t LABEL_PSRAM_MB = 8;

        void setup() {
          Serial.begin(115200);
          delay(1000);
          uint32_t built = ESP.getFlashChipSize();             // the size the program was built for
          uint32_t chipId = 0;
          esp_flash_get_physical_size(NULL, &chipId);          // the size the flash chip's own ID code claims
          Serial.printf("Flash MB: build %lu, chip ID says %lu, label says %lu\n",
                        (unsigned long)(built >> 20), (unsigned long)(chipId >> 20), (unsigned long)LABEL_FLASH_MB);
          size_t psram = ESP.getPsramSize();
          Serial.printf("PSRAM KB: reported %lu, label says %lu\n", (unsigned long)(psram / 1024), (unsigned long)(LABEL_PSRAM_MB * 1024));
          if (psram == 0) return;
          size_t n = ESP.getMaxAllocPsram() & ~(size_t)4095;   // the biggest block, in whole 4 KB blocks
          uint8_t *buf = (uint8_t *)ps_malloc(n);
          if (buf == NULL) return;
          for (size_t b = 0; b < n / 4096; b++) *(uint32_t *)(buf + b * 4096) = b;   // every block gets its own number
          size_t wrong = 0;
          for (size_t b = 0; b < n / 4096; b++) if (*(uint32_t *)(buf + b * 4096) != b) wrong++;
          Serial.printf("Blocks tested: %lu, lost their number: %lu\n", (unsigned long)(n / 4096), (unsigned long)wrong);
          free(buf);
        }

        void loop() {}
      `,
      py: String.raw`
        import esp, gc, struct

        LABEL_FLASH_MB = 16                                    # what the label promises (N16R8)

        print("Flash MB: build %d, label says %d" % (esp.flash_size() // (1024 * 1024), LABEL_FLASH_MB))
        # MicroPython cannot read the flash chip's own ID: run "esptool flash-id" from the computer

        gc.collect()
        n = (gc.mem_free() * 3 // 4) // 4096 * 4096            # most of the free heap, in whole 4 KB blocks
        buf = bytearray(n)                                     # megabytes here means the PSRAM is in the heap
        for b in range(n // 4096):
            struct.pack_into("<I", buf, b * 4096, b)           # every block gets its own number
        wrong = 0
        for b in range(n // 4096):
            if struct.unpack_from("<I", buf, b * 4096)[0] != b:
                wrong += 1
        print("Blocks tested: %d, lost their number: %d" % (n // 4096, wrong))
      `,
      output: `
        Flash MB: build 16, chip ID says 16, label says 16
        PSRAM KB: reported 8192, label says 8192
        Blocks tested: 1966, lost their number: 0
      `,
      notes: ['The test checks the addressing — that every block exists and keeps its own number — not every bit. A memory that is smaller than claimed fails it at once.', 'A flash chip that lies in its ID passes the first line. Only a write test across the claimed size, with a stamp at every megabyte and a read-back, can expose it; it erases flash, so use a spare board.', 'The MicroPython test runs on the heap: on a firmware built for PSRAM that means megabytes, on any other it tests only a few tens of kilobytes. On the original ESP32 only 4 MB of an 8 MB part is mapped.']
    }
  ],
  examples: [
    {
      title: 'Where does the write go?',
      q: 'A board sold with 16 MB of flash really holds a 4 MB chip whose ID code says 16 MB. A program writes a block at offset 12 MB (0xC00000). Where does it land, and what is overwritten?',
      steps: ['A 4 MB chip has 22 address lines: its addresses run from 0 to 4,194,303.', 'The address 12 MB = 12,582,912 is $3 \\times 4{,}194{,}304$, so with the top lines ignored it is the same as address 0.', 'The block lands at offset 0, on top of the start of the flash, where the bootloader lives.', 'The next restart fails.'],
      a: 'It lands at offset 0 and overwrites the bootloader: the board is bricked. A write test across the claimed size would have shown this at once.'
    }
  ],
  quiz: [
    { q: 'A board listed as "ESP32-S3 N16R8" reports 2 MB of PSRAM and 8 MB of flash. What is the most likely explanation?', choices: ['The sketch is wrong', 'A different module (for example N8R2) than the listing says', 'PSRAM always reports small', 'The USB cable'], a: 1, why: 'The code N16R8 promises 16 MB of flash and 8 MB of PSRAM. The numbers the chip reports match an N8R2: a wrong listing or a cheaper module.' },
    { q: 'Why can the PSRAM test above catch a part that is smaller than claimed, while the size query cannot?', choices: ['It runs faster', 'It writes a different number into every block and reads them back, so wrapped addresses show up as lost numbers', 'It reads the part\'s serial number', 'It does not: both are the same'], a: 1, why: 'On a smaller memory the top addresses wrap round on to lower ones, so later blocks overwrite earlier ones and the read-back fails.' },
    { q: 'A module boots and runs your program perfectly, so its flash must be the size on the label.', a: false, why: 'A 4 MB chip that claims 16 MB boots fine. It fails only when something is written beyond its real size, such as an update slot or a file system.' },
    { q: 'What does the last byte of a flash chip\'s JEDEC ID normally say?', choices: ['The manufacturer', 'The capacity as a power of two (0x18 is 16 MB)', 'The speed', 'The temperature rating'], a: 1, why: 'In most flash chips the capacity code is the base-two logarithm of the size in bytes: 0x16 is 4 MB, 0x17 8 MB, 0x18 16 MB, 0x19 32 MB.' }
  ],
  applications: [
    'Incoming inspection of a delivery of modules for a product: a program on a jig checks every board in seconds.',
    'Buying development boards from an unfamiliar seller: run the check before the first project relies on the numbers.',
    'Diagnosing a board that crashes only when the file system or an update slot is used.',
    'Writing a support note for a seller, with the program\'s output as evidence.'
  ],
  sources: [
    'Espressif, *esptool documentation*: the flash-id, chip-id and read-flash commands.',
    'Espressif, *ESP-IDF Programming Guide*, "SPI Flash API": esp_flash_get_physical_size and esp_flash_get_size.',
    'JEDEC JEP106 (manufacturer identification codes) and the datasheet of the flash chip in use: the identification code.'
  ],
  sim: 'mo-fakeflash'
}
);
