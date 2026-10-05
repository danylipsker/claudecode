/* HYPER-ESP32 · content/memory-and-storage.js
 *
 * Topic "Memory and storage" (memory-and-storage, branch programming): where a program and its data live — the flash
 * cut into partitions, the settings in NVS, files in LittleFS and on SD cards, PSRAM, the RAM split into static data,
 * stacks and a heap that fragments, JSON that costs more memory than its text, logging, flash wear, and files built into
 * the program. Programs are written three ways (blocks, Arduino C++ on core 3.x, MicroPython 1.29).
 * Simulations: sims/memory-and-storage.js (ids ms-…).
 */
Hyper.add(
/* ================================================================ partition tables */
{
  id: 'partition-tables',
  parent: 'memory-and-storage',
  title: 'Partition tables',
  level: 2,
  short: 'The flash is not one open field for the program: a small table at 0x8000 cuts it into named partitions — the program (twice, for updates), the settings, a file system, a crash dump. Choosing a scheme in the Tools menu is choosing that cut.',
  keywords: ['partition table', 'partitions.csv', 'partition scheme', 'app0', 'app1', 'otadata', 'nvs', 'spiffs', 'coredump', 'huge app', 'no OTA', 'minimal SPIFFS', '0x8000', '0x10000', 'sketch too big', 'maximum is bytes', 'gen_esp32part', 'esp_partition'],
  prereq: ['flash-memory-on-modules', 'memory-map', 'board-menu-options'],
  related: ['ota-partitions-and-rollback', 'nvs-and-preferences', 'littlefs-and-file-systems', 'flash-and-the-cache', 'core-dumps-and-field-diagnostics', 'flash-encryption', 'the-rom-bootloader', 'ota-updates'],
  body: `A 4 MB flash chip is not one open field for your program. When the chip starts, its boot ROM loads a small **bootloader**, and the first thing the bootloader reads is the **partition table**: one 4 KB sector at address 0x8000 that cuts the flash into named regions. Everything the chip keeps for good lives in one of them — the program, the settings, a file system, a crash report. The *Tools → Partition Scheme* menu of the Arduino IDE is a menu of ready-made tables, and [the partition calculator](#/tools/espcalc/partitions) lays one out for you.

### The usual layout

The default scheme of the Arduino core on a 4 MB chip:

| Address | Partition | What it holds |
|---|---|---|
| 0x0 or 0x1000 | bootloader | the second-stage loader (at 0x1000 on the ESP32 and S2, at 0x0 on the S3, C3 and C6) |
| 0x8000 | the table | 4 KB; every partition below is listed in it |
| 0x9000 | \`nvs\` | settings by name, 20 KB ([[nvs-and-preferences]]) |
| 0xE000 | \`otadata\` | 8 KB: which program slot to start |
| 0x10000 | \`app0\`, then \`app1\` | the program, 1280 KB each |
| 0x290000 | \`spiffs\` | the file system, 1408 KB — the name is old, LittleFS lives here now ([[littlefs-and-file-systems]]) |
| 0x3F0000 | \`coredump\` | 64 KB for a crash report ([[core-dumps-and-field-diagnostics]]) |

A program starts on a 64 KB boundary (hence 0x10000), a data partition on a 4 KB one: the size of a flash **sector**, the smallest piece that can be erased.

### Why there are two program slots

An update over the air cannot overwrite the program that is running it. So the default schemes keep **two** slots: the update is written into the idle one, \`otadata\` is changed to point at it, and the chip restarts into the new program. If that one proves bad, the old one is still there ([[ota-partitions-and-rollback]]). The price is room: two slots halve what one program may be. The compiler's "Maximum is 1310720 bytes" is the size of one slot, 1280 KB.

### Choosing and changing

The menu holds many schemes. *Default* balances a 1.25 MB program, 1.4 MB of files and updates; *Huge APP* gives one program 3 MB but no updates and under 1 MB of files; *No OTA* gives a 2 MB program and almost 2 MB of files. A project can also bring its own CSV file, one line per partition (see the example). PlatformIO and ESP-IDF take a CSV too. MicroPython's table is fixed in the firmware: one program and a big file-system partition called \`vfs\`.

Changing the table needs the cable: it is written by the serial or USB upload, never by an update over the air. A partition that moves loses what it held, and a table that reaches past the end of the flash cannot work — the flash size in the board menu must match the chip.

> [!key] The partition table at 0x8000 divides the flash into the bootloader, settings, program slots, a file system and a crash dump. Two program slots buy safe updates and cost half the room: pick the scheme to fit the program, the update need and the files you keep.`,
  ideas: [
    'A 4 KB table at 0x8000 cuts the flash into named partitions: program, settings, file system, crash dump.',
    'Two program slots allow a safe update over the air and halve the room for one program.',
    'Program partitions start on 64 KB boundaries, data partitions on 4 KB flash sectors.',
    'Changing the table needs a cable, and any partition that moves loses its contents.'
  ],
  pitfalls: [
    'A 4 MB board has 4 MB for my program — Most of the flash is divided among other uses. In the default scheme one program may be only 1.25 MB, because a second slot waits for updates.',
    'I can change the partition scheme with an update over the air — The table sits at a fixed place and is written by the serial or USB upload. An update over the air replaces the program and nothing else.',
    'The partition called spiffs means my sketch uses SPIFFS — The name is historical. The Arduino core keeps it so old tables still work, and LittleFS uses the same partition.'
  ],
  terms: [
    { term: 'Partition table', also: ['partitions.csv', 'partition scheme'], def: 'A table at 0x8000 in flash that lists every partition: its name, type, address and size. The bootloader reads it to find the program and the data. The Arduino menu offers ready-made ones.' },
    { term: 'Bootloader', also: ['second-stage bootloader'], def: 'The small program in flash that the boot ROM starts. It reads the partition table, chooses the program to run, checks it and starts it.' },
    { term: 'OTA slot', also: ['app0', 'app1', 'ota_0', 'ota_1'], def: 'One of two equal partitions that each hold a whole program. An update is written into the idle slot and the chip then restarts from it.' },
    { term: 'otadata', also: ['OTA data partition'], def: 'An 8 KB partition that records which program slot the bootloader should start, and whether the new program has been confirmed.' },
    { term: 'Flash sector', also: ['4 KB sector', 'erase block'], def: 'The smallest piece of flash that can be erased: 4 KB. Partition sizes are multiples of it.' }
  ],
  choose: {
    good: ['Two equal slots (the default) when the device must be updated over the air', 'One big slot (Huge APP) when the program is large and updates come by cable', 'A custom table when you know the sizes of the program, the files and the settings'],
    avoid: ['Huge APP in a device in the field that needs remote updates', 'A tiny file system when the web pages, fonts or logs will not fit', 'Editing a table without checking that the sizes fit the flash size'],
    check: ['The real flash size of your module, and the Flash Size entry of the board menu', 'The size the compiler reports as "Maximum"', 'Which data would be lost if a partition moves']
  },
  code: [
    {
      title: 'List the partitions of the running board',
      about: 'Prints the program slot the chip started from, then every partition with its type, subtype, address and size. Compare it with the table above: it is the table, read back from flash.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Running from: ] (running partition))
          for each [p v] in (all partitions) :: storage
            print (join (label of p) (join [ at ] (join (address of p) (join [ size ] (size of p)))))
          end
      `,
      cpp: String.raw`
        #include "esp_partition.h"
        #include "esp_ota_ops.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);                                       // give the monitor time to open
          Serial.printf("Running from: %s\n", esp_ota_get_running_partition()->label);

          esp_partition_iterator_t it = esp_partition_find(ESP_PARTITION_TYPE_ANY, ESP_PARTITION_SUBTYPE_ANY, NULL);
          while (it != NULL) {
            const esp_partition_t *p = esp_partition_get(it);
            Serial.printf("%-10s %-5s subtype 0x%02x at 0x%06x size %u KB\n", p->label,
                          p->type == ESP_PARTITION_TYPE_APP ? "app" : "data",
                          (unsigned)p->subtype, (unsigned)p->address, (unsigned)(p->size / 1024));
            it = esp_partition_next(it);                     // NULL after the last one
          }
          esp_partition_iterator_release(it);
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32

        print("Running from:", esp32.Partition(esp32.Partition.RUNNING).info()[4])

        KINDS = ((esp32.Partition.TYPE_APP, "app"), (esp32.Partition.TYPE_DATA, "data"))
        for kind, name in KINDS:
            for part in esp32.Partition.find(kind):
                ptype, subtype, address, size, label, encrypted = part.info()
                print("%-10s %-5s subtype 0x%02x at 0x%06x size %d KB" % (label, name, subtype, address, size // 1024))
      `,
      output: `
        Running from: app0
        nvs        data  subtype 0x02 at 0x009000 size 20 KB
        otadata    data  subtype 0x00 at 0x00e000 size 8 KB
        app0       app   subtype 0x10 at 0x010000 size 1280 KB
        app1       app   subtype 0x11 at 0x150000 size 1280 KB
        spiffs     data  subtype 0x82 at 0x290000 size 1408 KB
        coredump   data  subtype 0x03 at 0x3f0000 size 64 KB
      `,
      notes: ['The output is from the default scheme of the Arduino core. MicroPython lists the program partitions first, and its own table has no second program slot unless the firmware was built with updates.', 'The table is read-only here. Changing it means flashing a new one with the upload tool.']
    }
  ],
  examples: [
    {
      title: 'A 1.6 MB program with updates and 300 KB of files',
      q: 'A product on a 4 MB flash must be updated over the air, its program is 1.6 MB, and it keeps 300 KB of web files. No scheme in the menu fits. Write the table.',
      steps: [
        'Two slots of at least 1.6 MB: round up to a multiple of 64 KB, 1664 KB = 0x1A0000 each.',
        'The first 64 KB are taken by the bootloader, the table, \`nvs\` (20 KB) and \`otadata\` (8 KB), so \`app0\` starts at 0x10000 and \`app1\` at 0x1B0000.',
        'Keep the 64 KB \`coredump\` at the very end, 0x3F0000. What is left between 0x350000 (the end of \`app1\`) and 0x3F0000 is 0xA0000 = 640 KB for the file system, more than the 300 KB needed.',
        'The CSV: \`nvs, data, nvs, 0x9000, 0x5000\` · \`otadata, data, ota, 0xE000, 0x2000\` · \`app0, app, ota_0, 0x10000, 0x1A0000\` · \`app1, app, ota_1, 0x1B0000, 0x1A0000\` · \`spiffs, data, spiffs, 0x350000, 0xA0000\` · \`coredump, data, coredump, 0x3F0000, 0x10000\`.'
      ],
      a: 'Two 1664 KB slots and a 640 KB file system fit exactly into the 4 MB; the table can be tried in the partition calculator before it is flashed.'
    }
  ],
  quiz: [
    { q: 'The Arduino IDE reports "Maximum is 1310720 bytes" for a program on a 4 MB ESP32 with the default scheme. Why is the limit so far below 4 MB?', choices: ['The chip cannot execute larger programs', 'The flash is divided among two program slots and other partitions, and one slot is 1280 KB', 'The bootloader takes the rest', 'The IDE keeps the rest for Wi-Fi'], a: 1, why: 'The program must fit one slot. The default scheme keeps two slots of 1280 KB (1310720 bytes) for updates over the air, plus settings, a file system and a crash dump.' },
    { q: 'Where does the partition table start?', choices: ['0x0', '0x1000', '0x8000', '0x10000'], a: 2, why: 'The table is the 4 KB sector at 0x8000. The first partition it lists starts at 0x9000, and the first program usually at 0x10000.' },
    { q: 'An update over the air can replace the partition table.', a: false, why: 'An update over the air writes only the program into the idle slot. The table is written by the upload over the cable.' },
    { q: 'A program of 2.4 MB must run on a 4 MB board, with no updates over the air. Which scheme of the Arduino menu fits?', choices: ['Default (two slots of 1.25 MB)', 'Huge APP (one slot of 3 MB)', 'Minimal file system (two slots of 1.9 MB)', 'Zigbee (two slots of 1.25 MB)'], a: 1, why: 'Only Huge APP offers one slot above 2.4 MB. The others either halve the flash into two slots too small for it, or are laid out like the default.' }
  ],
  applications: [
    'Every upload from the Arduino IDE sends the bootloader, the table and the program together.',
    'A device with remote updates keeps two program slots; one with a big web interface may trade a slot for file-system room.',
    'A recorder of photos or audio takes a small program slot and a large file-system partition.',
    'A Zigbee product adds small partitions for its network storage next to the usual ones.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, API Guides: "Partition Tables" (the CSV format, types, subtypes, offsets and alignment).',
    'Espressif, *ESP-IDF Programming Guide*, API Reference: the Partition API (finding and reading partitions from a program).',
    'Arduino core for the ESP32: the partition files in its tools/partitions folder (default, huge_app, min_spiffs, no_ota) and the Tools menu.'
  ],
  sim: 'ms-flash-layout'
},

/* ================================================================ NVS and Preferences */
{
  id: 'nvs-and-preferences',
  parent: 'memory-and-storage',
  title: 'NVS and Preferences',
  level: 1,
  short: 'Variables are wiped by every reset. NVS keeps small named values in flash — settings, calibration, a boot counter — across resets, power cuts and new uploads. Preferences is its friendly face in Arduino C++.',
  keywords: ['NVS', 'Preferences', 'non-volatile storage', 'nvs_flash', 'putUInt', 'getUInt', 'putString', 'getString', 'putBytes', 'namespace', 'key', 'settings', 'save settings', 'EEPROM', 'esp32.NVS', 'commit', 'blob'],
  prereq: ['partition-tables', 'variables-and-types', 'setup-loop-and-main'],
  related: ['flash-wear', 'littlefs-and-file-systems', 'nvs-encryption', 'rtc-memory', 'device-configuration', 'wifi-provisioning', 'logging-data'],
  body: `A thermostat that forgets its set-point whenever the power blinks is a toy. Variables live in RAM, and every reset wipes RAM ([[setup-loop-and-main]]), so anything that must outlast a restart — a set-point, a calibration, a name, a count of boots — has to be written to flash. The ESP's own tool for small values is **NVS**, the non-volatile storage library: a key-and-value store in a partition of its own. The Arduino interface to it is called **Preferences**.

### How it is organised

A value is stored under a **namespace** — a name for your project, 15 characters at most — and a **key**, also 15 at most: \`"myapp"\` and \`"boots"\`. It can be an integer of 8 to 64 bits, a string or a **blob** of raw bytes; Preferences adds floats, doubles and booleans. Reading a key that does not exist gives the default you pass, which is exactly how the first start after a fresh upload works.

NVS survives resets, power cuts and — worth knowing — the upload of a new program, because an upload leaves the \`nvs\` partition alone. It is wiped only by an explicit erase ("Erase All Flash Before Sketch Upload" in the IDE menu, or erasing the flash with esptool) and by a change of the partition table.

### Why it is gentle on the flash

Flash cannot be rewritten in place: a sector must be erased first, and only about a hundred thousand erases are guaranteed ([[flash-wear]]). So NVS never rewrites. Its partition is cut into pages of 4096 bytes, each holding 126 entries of 32 bytes. Changing a value **appends** a new entry and marks the old one dead; a page is erased only when it is full of dead entries. Writes therefore travel round all the pages — **wear levelling** — and one erase pays for about a hundred writes of a small value. The simulation shows a counter walking through the pages.

### What it is for, and what it is not

Good: settings, calibration constants, a device name, a boot counter, the network chosen in a setup portal ([[wifi-provisioning]]), a counter saved now and then. The system uses it too: the radio keeps some data there and Bluetooth stores its bonding keys.

Bad: logs, history and anything written every few seconds. A 20 KB partition holds a few hundred small entries, a string tops out near 4 KB, and every write spends a little of the wear budget. For streams use a file ([[logging-data]]); for a value that must survive deep sleep but not a power cut use RTC memory ([[rtc-memory]]).

### Habits

Open the namespace once, read, write only when a value really changed, and close. Give every key a default and keep a version number, because an old value from an older program is still there. Anything secret in NVS can be read by whoever can read the flash unless [[nvs-encryption|NVS encryption]] is on.

> [!key] NVS keeps small values by name in flash, across resets and re-uploads, and spreads its writes over the whole partition. Use it for settings and rare counters, never for logs or for anything written in a loop.`,
  ideas: [
    'Variables are lost at every reset; NVS keeps small named values in flash.',
    'A value lives under a namespace and a key, each at most 15 characters, and reading a missing key returns your default.',
    'A new value is appended and the old one marked dead, so writes wear all the pages evenly.',
    'NVS suits settings and rare counters; logs and fast counters belong elsewhere.'
  ],
  pitfalls: [
    'Preferences is a variable that remembers — It is flash. Each write spends a little of a limited budget, and saving a value every second wears the partition out within a couple of years. Save when a value has settled, not every time it moves.',
    'Uploading a new sketch resets the saved settings — The upload leaves the nvs partition alone, so the old values are still there, including those of an older version of the program. Give every key a default and a version number.',
    'Any key name will do — Keys and namespaces are 15 characters at most. A longer name makes the call fail (the put functions return 0), so check the return value.'
  ],
  terms: [
    { term: 'NVS', also: ['non-volatile storage', 'nvs_flash'], def: 'The storage library of the ESP-IDF that keeps small values by name in an nvs partition of the flash, and spreads its writes over the pages. Preferences and MicroPython\'s esp32.NVS use it.' },
    { term: 'Preferences', also: ['Preferences library'], def: 'The Arduino library that wraps NVS: begin a namespace, then put and get integers, floats, strings and bytes by key.' },
    { term: 'Namespace', also: ['NVS namespace'], def: 'A name that groups the keys of one program or module, so that two parts of a system can both use a key called "count". At most 15 characters.' },
    { term: 'Wear levelling', also: ['wear leveling'], def: 'Spreading the writes over all the sectors of the flash instead of hitting one again and again, so that no sector reaches its erase limit early.' },
    { term: 'Blob', also: ['binary large object', 'raw bytes'], def: 'A value stored as a run of bytes with no type, such as a struct written as it lies in memory. The program must know its layout to read it back.' }
  ],
  choose: {
    good: ['A few settings that change rarely', 'Calibration values and the identity of a device', 'Counters saved once in a while, every few minutes or before sleep'],
    avoid: ['Logs, readings and history: use a file or send them away', 'A value written in a loop', 'Large blobs and web pages: use a file system'],
    check: ['Keys and namespace names: 15 characters at most', 'The size of the nvs partition in your scheme (20 KB in the Arduino defaults)', 'What a first start finds: the defaults you give to the get functions', 'Whether a stored secret needs NVS encryption']
  },
  code: [
    {
      title: 'A boot counter and a stored name',
      about: 'On every start it reads how many times the board has booted, adds one, saves it, and prints it with a stored name. Run it, press reset, run it again: the count goes on.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [boots v] to ((load [boots] or (0)) + (1))
          save (boots) as [boots]
          set [name v] to (load [name] or [esp32])
          save (name) as [name]
          print (join [boot number ] (join (boots) (join [, name ] (name))))
      `,
      cpp: String.raw`
        #include <Preferences.h>

        Preferences prefs;

        void setup() {
          Serial.begin(115200);
          delay(1000);
          prefs.begin("myapp", false);                       // namespace, at most 15 characters; false: read and write
          uint32_t boots = prefs.getUInt("boots", 0) + 1;    // 0 if the key does not exist yet
          prefs.putUInt("boots", boots);
          String name = prefs.getString("name", "esp32");    // the default is returned if nothing was saved
          prefs.putString("name", name);
          prefs.end();
          Serial.printf("boot number %u, name %s\n", (unsigned)boots, name.c_str());
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32

        nvs = esp32.NVS("myapp")                             # namespace, at most 15 characters
        try:
            boots = nvs.get_i32("boots")
        except OSError:                                      # the key does not exist yet
            boots = 0
        boots += 1
        nvs.set_i32("boots", boots)

        buf = bytearray(32)
        try:
            n = nvs.get_blob("name", buf)                    # number of bytes read
            name = bytes(buf[:n]).decode()
        except OSError:
            name = "esp32"
        nvs.set_blob("name", name.encode())                  # MicroPython stores text as a blob
        nvs.commit()                                         # without commit() the changes are lost
        print("boot number", boots, "name", name)
      `,
      output: `
        boot number 7, name esp32
      `,
      notes: ['Writing once per start is harmless; writing in a fast loop would wear the flash ([[flash-wear]]).', 'In MicroPython the commit() call is required. Arduino\'s Preferences writes as it goes.']
    },
    {
      title: 'Save a calibration record',
      about: 'Two numbers measured once — an offset and a gain — are saved as one record of bytes and read back at the next start. If no record of the right size exists, the program saves a fresh one.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [offset v] to (0)
          set [gain v] to (1)
          if <has saved [offset]> then
            set [offset v] to (load [offset])
            set [gain v] to (load [gain])
            print [calibration loaded]
          else
            set [offset v] to (0.35)
            set [gain v] to (1.02)
            save (offset) as [offset]
            save (gain) as [gain]
            print [calibration saved]
          end
          print (join [offset ] (join (offset) (join [, gain ] (gain))))
      `,
      cpp: String.raw`
        #include <Preferences.h>

        struct Calibration {
          float offset;
          float gain;
        };

        Preferences prefs;
        Calibration cal = { 0.0f, 1.0f };                    // the defaults of a fresh board

        void setup() {
          Serial.begin(115200);
          delay(1000);
          prefs.begin("sensor", false);
          if (prefs.getBytesLength("cal") == sizeof(cal)) {  // a record of the right size exists
            prefs.getBytes("cal", &cal, sizeof(cal));
            Serial.println("calibration loaded");
          } else {
            cal.offset = 0.35f;                              // pretend a calibration was just measured
            cal.gain = 1.02f;
            prefs.putBytes("cal", &cal, sizeof(cal));
            Serial.println("calibration saved");
          }
          prefs.end();
          Serial.printf("offset %.2f, gain %.2f\n", cal.offset, cal.gain);
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32, struct

        nvs = esp32.NVS("sensor")
        offset, gain = 0.0, 1.0                              # the defaults of a fresh board
        buf = bytearray(8)                                   # two 32-bit floats
        try:
            nvs.get_blob("cal", buf)                         # raises OSError if there is no record
            offset, gain = struct.unpack("<ff", buf)
            print("calibration loaded")
        except OSError:
            offset, gain = 0.35, 1.02                        # pretend a calibration was just measured
            nvs.set_blob("cal", struct.pack("<ff", offset, gain))
            nvs.commit()
            print("calibration saved")
        print("offset %.2f, gain %.2f" % (offset, gain))
      `,
      output: `
        calibration saved
        offset 0.35, gain 1.02
      `,
      notes: ['A record stored as raw bytes depends on the layout of the struct. If a new version adds a field, the saved record has the old size; the length check notices and the program falls back to a fresh one.', 'The second run prints "calibration loaded" with the same numbers.']
    }
  ],
  quiz: [
    { q: 'A sketch keeps a set-point with Preferences. You upload a new version of the sketch. What happens to the saved set-point?', choices: ['It is erased, because every upload formats the flash', 'It is still there: an upload leaves the nvs partition alone', 'It is reset to the default written in the new sketch', 'It moves to the file system'], a: 1, why: 'The upload writes the bootloader, the table and the program. The nvs partition is not touched, so the new sketch finds the old values unless the flash is erased on purpose.' },
    { q: 'A device saves a temperature reading to NVS once a second for years. What is wrong with that?', choices: ['Preferences cannot store floats', 'It spends the wear budget of the flash; NVS is for values that change rarely', 'NVS cannot be used while Wi-Fi is on', 'Nothing: NVS levels the wear perfectly, so the flash lasts for ever'], a: 1, why: 'Wear levelling stretches the life, but a write every second still adds up to tens of millions of writes. History belongs in a file, or elsewhere, and a counter should be saved only now and then.' },
    { q: 'A Preferences key can be any length because the library hashes it.', a: false, why: 'A key and a namespace are 15 characters at most. A longer one is rejected and the put call returns 0.' },
    { q: 'In MicroPython, nvs.set_i32("boots", 5) is called and the board is reset. After the reset get_i32("boots") raises OSError. Most likely reason?', choices: ['NVS needs a file system first', 'commit() was not called, so the change was never written', 'Integers cannot be stored in NVS', 'The key contains a digit'], a: 1, why: 'In MicroPython the changes stay in memory until commit() writes them. Without it they are lost at the reset.' }
  ],
  applications: [
    'The set-point and schedule of a thermostat, which must survive a power cut.',
    'A calibration offset measured once at the factory or on the bench.',
    'The name and options a user typed into a setup portal, including the Wi-Fi network chosen there.',
    'A count of boots or of hours of operation, saved every hour, as a hint of how long a device has lived.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, API Reference: "Non-Volatile Storage Library" (pages and entries, namespaces, data types, wear levelling).',
    'Arduino core for the ESP32 documentation, API: *Preferences*.',
    'MicroPython documentation, *esp32 — functionality specific to the ESP32*: the NVS class.'
  ],
  sim: 'ms-nvs-wear'
},

/* ================================================================ LittleFS and file systems */
{
  id: 'littlefs-and-file-systems',
  parent: 'memory-and-storage',
  title: 'LittleFS and file systems',
  level: 2,
  short: 'Web pages, fonts, sound clips and day-long logs need files with names in folders. A file system turns flash sectors into that — and LittleFS is the one built for chips that lose power in the middle of a write.',
  keywords: ['LittleFS', 'SPIFFS', 'FFat', 'FAT', 'file system', 'filesystem', 'LittleFS.begin', 'formatOnFail', 'File', 'open', 'os.listdir', 'statvfs', 'mklittlefs', 'filesystem image', 'upload data', 'vfs', 'power loss', 'wear levelling'],
  prereq: ['partition-tables', 'nvs-and-preferences', 'memory-map'],
  related: ['sd-cards', 'logging-data', 'flash-wear', 'embedding-files-and-web-pages', 'web-server-on-esp', 'usb-device-hid-cdc-msc', 'ota-updates'],
  body: `Settings fit in NVS. A web page, a font, a sound clip, a configuration file or a day of readings do not. For those the chip needs what a computer has: files with names, in folders. A **file system** is the layer that turns the flash's sectors into exactly that, and the ESP offers a few.

### Why flash needs a special one

Flash has two odd habits. A write can only turn bits from 1 to 0; to get ones back, a whole 4 KB **sector** must be erased. And a sector survives only about 100 000 erases ([[flash-wear]]). A file system for flash must therefore spread its erases over all the sectors, and must not be left in ruins when the power is cut half-way through a write. The old design of a fixed table at the start of the disk fails both tests.

### The choices

| | LittleFS | SPIFFS | FAT (FFat, SD cards) |
|---|---|---|---|
| Directories | yes | no: slashes are part of the name | yes |
| Power cut during a write | survives: copy-on-write keeps the old state valid | can be damaged | can be damaged |
| Wear levelling | built in | built in, slow when nearly full | a separate layer in flash; a card does its own |
| Status | the one for new work | still shipped, maintenance only | needed to share files with a PC |

Use **LittleFS** unless something forces you away. Its partition is the one labelled \`spiffs\` in the table ([[partition-tables]]) — the name stayed. The Arduino core, MicroPython (on a partition called \`vfs\`) and the ESP-IDF component \`joltwallet/littlefs\` all handle it. FAT in flash is for the case where a computer must read the files, for instance when the ESP shows itself as a USB drive ([[usb-device-hid-cdc-msc]]); on [[sd-cards|SD cards]] FAT is the rule.

### Using it

Mount once in \`setup()\`, then open files by path. In the Arduino core \`LittleFS.begin(true)\` mounts the partition and — that is the \`true\` — formats it if it cannot be mounted: right on the first start, a way to lose everything if a good partition was merely misread. \`"w"\` opens a file and empties it, \`"a"\` appends, \`"r"\` reads. **Close** every file you wrote: until \`close()\` or \`flush()\` the data sits in a buffer. MicroPython needs no mounting: its root is already a LittleFS, and the ordinary \`open()\` and the \`os\` module do the rest.

Files get there in two ways: the program writes them at run time, or you build an **image** from a folder on your computer and upload it to the partition, as PlatformIO and plug-ins for the Arduino IDE do ([[embedding-files-and-web-pages]]).

### Numbers and manners

Space is handed out in 4 KB blocks, so a file of 300 bytes can take a whole block and hundreds of small files waste room; several values belong in one file. Never fill the partition to the brim: LittleFS slows down as the last tenth goes.
> [!key] A file system gives flash names, folders and wear levelling. Use LittleFS: it survives a power cut, it has directories, and the same partition serves Arduino C++, MicroPython and ESP-IDF. Close what you write, and leave room.`,
  ideas: [
    'Flash is erased in 4 KB sectors that wear out, so its file system must level the wear and survive a power cut.',
    'LittleFS has directories and survives a cut in the middle of a write; SPIFFS is flat and in maintenance; FAT is for sharing with a computer.',
    'The partition named spiffs holds LittleFS today; MicroPython mounts one for you at the root.',
    'Close a file you wrote, keep the partition from filling up, and treat begin(true) with respect.'
  ],
  pitfalls: [
    'A file system in flash is a hard disk: write as often as I like — Every append and every rewrite costs erases, and a program that rewrites a file every second wears the sectors out. Batch the data, and see the page on flash wear.',
    'print or write finished, so the data is safe — The data sits in a buffer until the file is closed or flushed. A reset or power cut before that loses it.',
    'LittleFS.begin(true) is the careful way to mount — It formats the partition whenever the mount fails, which erases every file. Use it for the first start, then begin(false) and handle a failure yourself.'
  ],
  terms: [
    { term: 'File system', also: ['filesystem'], def: 'The layer that organises storage into files and directories, finds free space and keeps track of what is where.' },
    { term: 'LittleFS', also: ['littlefs'], def: 'A file system designed for microcontrollers: it has directories, levels the wear over the flash, uses little RAM and stays consistent when the power fails during a write.' },
    { term: 'SPIFFS', also: ['SPI Flash File System'], def: 'An older file system for flash with no real directories. Still present in the Arduino core, and its name survives in the partition label "spiffs" that LittleFS now uses.' },
    { term: 'FAT', also: ['FFat', 'FATFS', 'FAT32'], def: 'The file system of memory cards and USB sticks, readable by every computer. On the ESP it is used on SD cards, and optionally in flash through a wear-levelling layer.' },
    { term: 'File system image', also: ['mklittlefs', 'filesystem image'], def: 'A ready-made copy of a whole file system built on the computer from a folder, and uploaded to the partition in one go.' }
  ],
  choose: {
    good: ['LittleFS for settings files, web pages, fonts and small logs in the flash', 'FAT on an SD card for large or removable data', 'MicroPython\'s built-in file system for scripts and data alike'],
    avoid: ['SPIFFS in new projects: it is in maintenance', 'Rewriting one file every second or two', 'A partition filled to the brim'],
    check: ['The size of the spiffs partition in your scheme', 'That every file you write is closed or flushed', 'What the program does when the mount fails', 'Whether a computer must read the files (then FAT, or a card)']
  },
  code: [
    {
      title: 'Append a line, read the file, list the files',
      about: 'Mounts the file system, appends a line to notes.txt, prints the whole file, lists every file with its size and shows how full the partition is. Run it twice: the file grows.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. The partition scheme needs a file-system partition (the defaults have one).',
      blocks: `
        when started
          start serial at (115200) baud
          mount the file system :: storage
          append [one more line] to file [/notes.txt]
          print (read file [/notes.txt])
          for each [name v] in (files in [/]) :: storage
            print (join (name) (join [ ] (size of file (name))))
          end
          print (join [used ] (join (bytes used) (join [ of ] (bytes total))))
      `,
      cpp: String.raw`
        #include <LittleFS.h>

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!LittleFS.begin(true)) {                       // true: format the partition if it cannot be mounted
            Serial.println("mount failed");
            return;
          }

          File f = LittleFS.open("/notes.txt", "a");         // "a" appends; "w" would start the file again
          f.println("one more line");
          f.close();                                         // close() makes sure the data reaches flash

          f = LittleFS.open("/notes.txt", "r");
          while (f.available()) {
            Serial.write(f.read());
          }
          f.close();

          File root = LittleFS.open("/");
          File entry = root.openNextFile();
          while (entry) {
            Serial.printf("%s %u\n", entry.name(), (unsigned)entry.size());
            entry = root.openNextFile();
          }
          Serial.printf("used %u of %u bytes\n", (unsigned)LittleFS.usedBytes(), (unsigned)LittleFS.totalBytes());
        }

        void loop() {}
      `,
      py: String.raw`
        import os

        with open("notes.txt", "a") as f:                    # "a" appends; "w" would start the file again
            f.write("one more line\n")                       # leaving the with block closes the file

        with open("notes.txt") as f:
            print(f.read(), end="")

        for name in os.listdir("/"):
            print(name, os.stat("/" + name)[6])              # item 6 of the stat tuple is the size

        s = os.statvfs("/")
        total = s[1] * s[2]                                  # block size times number of blocks
        free = s[0] * s[3]
        print("used %d of %d bytes" % (total - free, total))
      `,
      output: `
        one more line
        one more line
        notes.txt 28
        used 8192 of 1441792 bytes
      `,
      notes: ['The numbers depend on the partition scheme and on what is already stored. The output shows the file after two runs.', 'Entries of a directory are listed by name only; in the Arduino core 3.x entry.name() is the short name without the path.']
    }
  ],
  quiz: [
    { q: 'A logger appends a line to a LittleFS file and the power is cut a moment later, before the file was closed. What can be said?', choices: ['The whole file system is certainly destroyed', 'The file system stays consistent, but the last line may be missing', 'The line is always saved: LittleFS writes at once', 'The next start formats the partition'], a: 1, why: 'LittleFS is built to stay consistent after a cut, so the files are valid. A line still in the write buffer may be lost; close or flush at moments that matter.' },
    { q: 'Which file system lets a computer read the files when the ESP presents itself as a USB drive?', choices: ['LittleFS', 'NVS', 'FAT', 'SPIFFS'], a: 2, why: 'Computers read FAT. LittleFS and SPIFFS are understood only by the ESP side, so a USB drive in flash uses FAT.' },
    { q: 'LittleFS.begin(true) is the safe way to mount, because it never loses data.', a: false, why: 'The true means "format if the mount fails". That is useful on a first start and costly if a good partition is misread: every file is lost.' },
    { q: 'A program stores 400 small files of 300 bytes each in LittleFS. The data is 120 KB, yet the partition is filling up. Why?', choices: ['Each file is stored twice', 'Space is allocated in 4 KB blocks, so each small file may take a whole block', 'LittleFS compresses files badly', 'The names take most of the room'], a: 1, why: 'A block is the unit of allocation. 400 files can occupy several hundred blocks, over a megabyte. One file with all the values would use a few blocks.' }
  ],
  applications: [
    'The pages, scripts and icons of a web interface served by the ESP ([[embedding-files-and-web-pages]]).',
    'A settings file in JSON, easy to read, edit and send, for values that are too many for NVS.',
    'Sound clips, fonts and images for a display or a speaker.',
    'A small rolling log that survives a restart and can be downloaded over Wi-Fi.'
  ],
  sources: [
    'The littlefs project (Arm Mbed), DESIGN.md: metadata pairs, copy-on-write and wear levelling.',
    'Arduino core for the ESP32 documentation, API: *LittleFS* (and the FFat and SPIFFS libraries).',
    'MicroPython documentation, the ESP32 quick reference and the *os* module (listdir, stat, statvfs).'
  ]
},

/* ================================================================ SD cards */
{
  id: 'sd-cards',
  parent: 'memory-and-storage',
  title: 'SD cards',
  level: 2,
  short: 'A memory card gives an ESP gigabytes for a day of readings, a library of sound files or the photos of a camera. It reaches the chip over SPI on any pin, or over the faster SD/MMC bus on the chips that have one.',
  keywords: ['SD card', 'microSD', 'SD.begin', 'SD_MMC', 'SDMMC', 'SPI mode', 'FAT32', 'exFAT', 'card module', 'data logger', 'ESP32-CAM SD', 'SD card not detected', 'machine.SDCard', 'chip select', 'card mount failed'],
  prereq: ['littlefs-and-file-systems', 'spi', 'three-volt-logic'],
  related: ['sdio-and-sdmmc', 'logging-data', 'strapping-pins', 'spi-modes-and-speed', 'esp32-cam-boards', 'playing-audio-files', 'project-data-logger'],
  body: `A memory card is the cheapest way to give an ESP gigabytes: a day of fast readings, a library of sound files, the photos of a camera, the pages of a big web interface. The card is a small computer of its own, a controller with flash chips, and the ESP reaches it in one of two ways.

### Two ways to wire a card

| | SPI mode | SD/MMC mode |
|---|---|---|
| Wires | four signals: CS, SCK, MOSI, MISO | CLK, CMD and D0; also D1 to D3 for four bits at a time |
| Which chips | every ESP32 chip, on any pins | those with an SD host: the ESP32, S3, P4 and S31 |
| Speed | slower: one bit per clock | faster, especially with four data lines |
| Arduino library | \`SD\` | \`SD_MMC\` |

SPI is the simple, portable choice: it needs one bus, which can be shared with other parts if each has its own chip-select. SD/MMC wants fixed or special pins, and on the original ESP32 they are CLK = GPIO14, CMD = GPIO15, D0 = GPIO2, D1 = GPIO4, D2 = GPIO12 and D3 = GPIO13. Three of those are [[strapping-pins|strapping pins]], and a card that holds GPIO12 high at power-up stops the board booting. So on an ESP32 use one-bit mode (CLK, CMD, D0) or SPI; the camera boards do exactly that. On the S3 the pins can be chosen freely.

### Format and file system

The libraries read FAT16 and FAT32. A card of 64 GB or more usually arrives formatted as exFAT, which they do not read: reformat it as FAT32, or use a smaller card. Files are then ordinary files ([[littlefs-and-file-systems]]) that any computer can read.

### What goes wrong

- **Wiring and power.** A card works at 3.3 V. Cheap "SD modules for Arduino" are made for 5 V boards, with a regulator and level shifter; they often work from 3.3 V logic, but some keep driving MISO when not selected and spoil every other device on the bus.
- **Current.** A card draws pulses of 100 mA or more while writing. A weak regulator or no capacitor at the socket shows up as random failures.
- **Latency.** A write can stall for a few hundred milliseconds while the card tidies itself. Fill a buffer in RAM and write it in batches ([[logging-data]]).
- **Removal and power cuts.** FAT is not power-fail safe. Close or flush files, and never pull the card while writing.
- **Wear.** Cards meant for cameras are not meant for years of logging. A product should use an industrial card and plan to replace it.

> [!key] A card is reached over SPI on any chip or over SD/MMC on the chips with a host, and holds FAT32. On the original ESP32 avoid four-bit mode (GPIO12 is a strapping pin), buffer your writes because a card can stall, and close files before power goes.`,
  ideas: [
    'SPI mode works on every chip and any pins; SD/MMC mode is faster and exists only on the chips with an SD host.',
    'On the original ESP32 four-bit SD/MMC puts the card on strapping pins, and GPIO12 held high stops the boot.',
    'The libraries read FAT16 and FAT32; large cards are exFAT and need reformatting.',
    'A card can stall a write for a while and corrupts if power is cut at the wrong moment, so buffer and close.'
  ],
  pitfalls: [
    'Any SD card module from the shop works at 3.3 V with an ESP — The common ones are built for 5 V boards. Many still work, but check that the module releases MISO when not selected, and give it a supply that can deliver short pulses of 100 mA or more.',
    'Four-bit SD/MMC mode is just faster — On the original ESP32 its pins include GPIO2, GPIO12 and GPIO15, strapping pins. A card on GPIO12 stops the board starting; one on GPIO2 can get in the way of uploading.',
    'A card is a safe place for data — FAT is damaged by a power cut during a write, and cheap cards fail with use. Flush at the moments that matter, and expect to replace the card in a logger.'
  ],
  terms: [
    { term: 'SD card', also: ['microSD', 'memory card'], def: 'A removable flash memory card with its own controller. The ESP talks to it over SPI or over the SD/MMC bus and usually stores FAT32 files on it.' },
    { term: 'SPI mode', also: ['SD over SPI', 'SD.begin'], def: 'Using the card through an ordinary SPI bus: chip select, clock, data in and data out, one bit per clock. Works on every chip, on any pins.' },
    { term: 'SD/MMC mode', also: ['SDMMC', 'SD host', 'SD_MMC'], def: 'The native bus of SD cards: a clock, a command line and one or four data lines. Faster than SPI. Only some chips (ESP32, S3, P4, S31) have the host hardware.' },
    { term: 'FAT32', also: ['FAT16', 'FAT'], def: 'The file system that the ESP libraries read on SD cards. Cards of 32 GB and less usually carry it; larger ones usually carry exFAT.' },
    { term: 'exFAT', also: ['SDXC format'], def: 'The file system most large cards (64 GB and up) are formatted with. The ESP libraries do not read it by default, so such a card must be reformatted as FAT32.' }
  ],
  choose: {
    good: ['SPI mode when you want it simple and portable to any chip', 'One-bit SD/MMC on an ESP32 or S3 when you want more speed from few wires', 'An industrial-grade card for a product that logs for years'],
    avoid: ['Four-bit mode on the original ESP32 unless GPIO12 and GPIO2 are handled', 'A card of 64 GB or more as it comes from the shop (exFAT)', 'Pulling the card or cutting the power during a write'],
    check: ['Whether the chip has an SD host: [the chip explorer](#/tools/chips) shows it', 'That a shared SPI bus has a separate chip-select for each part', 'That the 3.3 V supply holds up during write pulses', 'What the program does when no card is inserted']
  },
  code: [
    {
      title: 'Append a line to a log on the card',
      about: 'Mounts the card, prints its size, appends one line with the uptime to log.txt and prints the whole file. Run it again and again: the log grows.',
      needs: 'An ESP32 DevKit and a micro-SD card module (3.3 V logic), the card formatted as FAT32, and the serial monitor at 115200 baud.',
      wiring: [['GPIO5', 'card module CS'], ['GPIO18', 'card module SCK', 'the default SPI pins of the ESP32 DevKit'], ['GPIO23', 'card module MOSI'], ['GPIO19', 'card module MISO'], ['3V3 or 5V', 'card module power', 'as the module requires'], ['GND', 'card module GND']],
      blocks: `
        when started
          start serial at (115200) baud
          mount SD card with chip select pin (5) :: storage
          print (join [card: ] (join (card size in MB) [ MB]))
          append (join [uptime ] (join (milliseconds since start) [ ms])) to file [/log.txt] on SD card :: storage
          print (read file [/log.txt] on SD card)
      `,
      cpp: String.raw`
        #include <SD.h>
        #include <SPI.h>

        const int SD_CS = 5;                                 // chip select; SCK 18, MISO 19, MOSI 23 are the ESP32 defaults

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!SD.begin(SD_CS)) {
            Serial.println("card mount failed");             // no card, bad wiring, or not FAT
            return;
          }
          Serial.printf("card: %llu MB\n", (unsigned long long)(SD.cardSize() / (1024 * 1024)));

          File f = SD.open("/log.txt", FILE_APPEND);
          f.printf("uptime %lu ms\n", millis());
          f.close();                                         // close() or flush() before the power can go

          f = SD.open("/log.txt");
          while (f.available()) {
            Serial.write(f.read());
          }
          f.close();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, time, vfs

        sd = machine.SDCard(slot=2)                          # the slot number picks the interface and its pins
        vfs.mount(sd, "/sd")
        print("card:", sd.ioctl(4, None) * sd.ioctl(5, None) // (1024 * 1024), "MB")   # sectors times sector size

        with open("/sd/log.txt", "a") as f:
            f.write("uptime %d ms\n" % time.ticks_ms())

        with open("/sd/log.txt") as f:
            print(f.read(), end="")

        vfs.umount("/sd")                                    # eject before removing the card
      `,
      output: `
        card: 7580 MB
        uptime 1034 ms
        uptime 1041 ms
      `,
      notes: ['On an ESP32-S3, C3 or C6 board the SPI pins are not fixed: call SPI.begin(sck, miso, mosi, cs) first and pass the SPI object to SD.begin(). Check the pins against your board in the board catalogue.', 'MicroPython chooses the interface and the pins from the slot number of SDCard; look up the pins of the slot you use in its documentation and wire the card to them. Not every slot is SPI.', 'The first line of the output depends on the card.']
    }
  ],
  quiz: [
    { q: 'Which way of connecting a card works on every ESP32 chip, on pins of your choice?', choices: ['Four-bit SD/MMC', 'SPI mode', 'I2C', 'UART'], a: 1, why: 'Only the ESP32, S3, P4 and S31 have an SD/MMC host, with its own pins. SPI mode needs just an SPI bus and a chip-select and is available everywhere.' },
    { q: 'An ESP32 board starts normally with the card removed and not at all with it inserted. The card is wired in four-bit SD/MMC mode. Most likely cause?', choices: ['The card is exFAT', 'D2 is on GPIO12, a strapping pin, and the card holds it high at power-up', 'The card needs 5 V', 'GPIO14 cannot be an input'], a: 1, why: 'GPIO12 high at reset selects 1.8 V flash on the ESP32, which a 3.3 V module cannot use. Use one-bit mode or SPI.' },
    { q: 'A new 128 GB card is read by the Arduino SD library as it comes from the shop.', a: false, why: 'Such cards are normally formatted as exFAT, which the library does not read by default. Reformat as FAT32, or use a card of 32 GB or less.' },
    { q: 'A data logger writes one record to the card every 10 ms and now and then loses samples. What is the cure?', choices: ['A faster SPI clock only', 'Collect records in a RAM buffer and write them in batches, so a stalled write does not lose samples', 'Use a longer file name', 'Switch to exFAT'], a: 1, why: 'A card can pause a write for hundreds of milliseconds while it tidies itself. A buffer in RAM, filled by one task and emptied by another, absorbs the pause.' }
  ],
  applications: [
    'Data loggers that record for days or weeks ([[project-data-logger]]).',
    'ESP32-CAM style boards that save photos and video clips, using the card in one-bit mode.',
    'Audio players and displays that read sound files and images from a card.',
    'Machine controllers that read their instructions from a file, such as FluidNC reading G-code.'
  ],
  sources: [
    'SD Association, *Physical Layer Simplified Specification* (the bus, the SPI mode, current limits).',
    'Espressif, *ESP-IDF Programming Guide*: the SD/SDIO/MMC driver, the SDMMC host driver and the SD SPI host driver pages.',
    'Arduino core for the ESP32 documentation, API: *SD* and *SD_MMC*.'
  ]
},

/* ================================================================ using PSRAM */
{
  id: 'using-psram',
  parent: 'memory-and-storage',
  title: 'Using PSRAM',
  level: 2,
  short: 'Internal RAM is fast and small. PSRAM is a separate RAM chip of 2 to 32 MB that the processor addresses as if it were its own: the place for frame buffers, camera pictures and big buffers — slower, and not for everything.',
  keywords: ['PSRAM', 'SPIRAM', 'external RAM', 'ps_malloc', 'psramFound', 'getFreePsram', 'heap_caps_malloc', 'MALLOC_CAP_SPIRAM', 'OPI PSRAM', 'octal PSRAM', 'quad PSRAM', 'WROVER', 'R8', 'frame buffer', 'out of memory'],
  prereq: ['memory-map', 'stack-heap-and-static', 'psram-on-modules'],
  related: ['heap-and-fragmentation', 'the-esp32-camera-driver', 'pixels-and-framebuffers', 'lvgl', 'flash-and-the-cache', 'esp32-cam-boards', 'tflite-micro-and-esp-dl'],
  body: `Internal RAM is fast but small: 520 KB on an ESP32, and not all of that is heap. A 320 × 240 colour display wants 150 KB for one picture, a camera frame several times that, a few seconds of audio, a big JSON answer or a TLS connection each take a share — and then \`malloc\` returns nothing. The remedy is **PSRAM**: a separate RAM chip of 2 to 32 MB that the processor addresses as if it were part of its own memory.

### What it is

PSRAM (pseudo-static RAM) is ordinary dynamic RAM with its refresh hidden inside. It sits in the module beside the flash, or in the chip's package, and is reached over its own bus: four data lines (quad) or, on some chips such as the S3, eight (octal). The processor reaches it through the cache, as it does the flash ([[flash-and-the-cache]]): you ask for a block, you get an ordinary pointer, and the cache fetches bytes as they are touched.

From the catalogue, the chips that can have it are the ESP32 (on the WROVER modules, or 2 MB in the package), S2, S3, C5, C61, P4, S31 and H4. The C3, C6, C2 and H2 have no interface for it, whatever a shop listing says ([[psram-on-modules]]).

### What it costs

- **Speed.** Behind the cache, sequential access is fine and scattered access is much slower than internal RAM; octal PSRAM is faster than quad.
- **Pins.** The memory takes GPIOs. On the ESP32 WROVER modules GPIO16 and 17 are gone; on an S3 with octal memory GPIO33 to 37 are (GPIO35 to 37 on the R8 modules), in addition to the flash pins GPIO26 to 32.
- **Not for everything.** Interrupt handlers and the data they touch stay in internal RAM, because PSRAM cannot be reached while the flash is being written; some DMA transfers cannot use it on the original ESP32; the radio's own buffers stay inside by default.

### Using it

In the Arduino IDE the *PSRAM* entry of the Tools menu must match the hardware: *OPI PSRAM* for S3 modules with octal memory (the "R8" ones), *QSPI PSRAM* for quad memory, *Disabled* for none. A wrong choice usually shows as \`psramFound()\` returning false. Then \`ps_malloc\` hands out PSRAM explicitly, \`heap_caps_malloc(size, MALLOC_CAP_SPIRAM)\` does the same in ESP-IDF terms, and with PSRAM switched on the system may also place large ordinary allocations there by itself. Display and camera libraries ask for it when they find it. On MicroPython builds made for boards with PSRAM the interpreter's own heap is placed in it, so \`gc.mem_free()\` shows megabytes instead of a hundred kilobytes.

The simulation shows the RAM of an ESP32 with and without PSRAM and what a frame buffer does to it.

> [!key] PSRAM is extra RAM of 2 to 32 MB on a slower bus, available on some chips and modules. Put big, not time-critical buffers there — frame buffers, camera frames, audio — and keep interrupt code, small hot data and the radio's buffers in internal RAM.`,
  ideas: [
    'PSRAM is a separate RAM chip, 2 to 32 MB, reached through the cache and used through ordinary pointers.',
    'It is slower than internal RAM, and it takes GPIO pins; the C3, C6, C2 and H2 have no interface for it.',
    'Big buffers (frame buffers, camera frames, audio) go there; interrupt code and small hot data stay inside.',
    'The Tools menu entry (disabled, quad, octal) must match the hardware, or psramFound() says no.'
  ],
  pitfalls: [
    'More RAM means everything is faster — PSRAM sits behind a cache and a narrow bus. It is slower than internal RAM, and a program that scatters small reads across it can run slowly. Keep hot data inside.',
    'Any board listed with PSRAM will use it — The firmware must be built with PSRAM switched on and in the right mode (quad or octal), and the chip must have an interface. Check psramFound() and the free size.',
    'PSRAM is free: it just adds memory — On an ESP32 WROVER GPIO16 and 17 are used by it, on S3 octal boards GPIO33 to 37 too. Plan the pins before you choose the module ([[psram-on-modules]]).'
  ],
  terms: [
    { term: 'PSRAM', also: ['pseudo-static RAM', 'SPIRAM', 'external RAM'], def: 'A separate RAM chip of 2 to 32 MB, in the module or in the chip package, reached over its own SPI-like bus and used by the program as ordinary memory, though more slowly than internal RAM.' },
    { term: 'Quad and octal PSRAM', also: ['QSPI PSRAM', 'OPI PSRAM'], def: 'PSRAM with four or eight data lines. Octal memory is faster. The Arduino Tools menu has to be set to the kind your module has.' },
    { term: 'ps_malloc', also: ['heap_caps_malloc', 'MALLOC_CAP_SPIRAM'], def: 'The calls that allocate memory in PSRAM on purpose. ps_malloc is the Arduino one; heap_caps_malloc with the capability MALLOC_CAP_SPIRAM is the ESP-IDF form.' },
    { term: 'Frame buffer', also: ['framebuffer'], def: 'A block of memory holding every pixel of a picture before it is sent to a display. Its size is width times height times the bytes per pixel.' }
  ],
  choose: {
    good: ['Frame buffers for colour displays and LVGL, camera frames, audio and image buffers', 'Large JSON or data buffers that are used in bursts', 'Neural-network working memory, when the model is large'],
    avoid: ['Interrupt handlers and the data they touch', 'Tight inner loops over scattered data', 'Pins that the memory takes: GPIO16 and 17 on WROVER, GPIO33 to 37 with octal memory'],
    check: ['That the chip and module really have PSRAM, and of which kind', 'The PSRAM entry of the Tools menu', 'The free PSRAM printed at the start of the program', 'Which pins the module reserves']
  },
  formulas: [
    {
      name: 'Size of a frame buffer',
      expr: 'S = w * h * b / 8',
      tex: 'S = \\frac{w\\,h\\,b}{8}',
      vars: {
        S: { name: 'frame buffer size (bytes)', q: 'count', tex: 'S' },
        w: { name: 'width (pixels)', q: 'count', value: 320, min: 1, int: true, tex: 'w' },
        h: { name: 'height (pixels)', q: 'count', value: 240, min: 1, int: true, tex: 'h' },
        b: { name: 'bits per pixel', q: 'count', value: 16, min: 1, max: 32, int: true, tex: 'b' }
      },
      solveFor: 'S',
      note: 'A colour display in RGB565 uses 16 bits per pixel; a monochrome OLED needs 1. Double buffering doubles the figure. Divide by 1024 for KB.',
      stories: { S: 'A {w} by {h} pixel display uses {b} bits per pixel. How many bytes does one frame buffer need?', w: 'A frame buffer of {S} bytes holds pictures of {h} pixels height at {b} bits per pixel. How wide can they be?' }
    }
  ],
  examples: [
    {
      title: 'Will a full-screen buffer fit?',
      q: 'A 480 × 320 touch display shows RGB565 colour (16 bits per pixel). Can an original ESP32 without PSRAM keep one full frame, and what about two for double buffering?',
      steps: ['One frame is $480 \\times 320 \\times 16 / 8 = 307\\,200$ bytes, about 300 KB.', 'An ESP32 has 520 KB of SRAM, but well under 300 KB of heap remains for the program, and a buffer needs one unbroken block.', 'Two frames would be 600 KB: more than all the SRAM. With 4 MB of PSRAM both fit with room to spare.'],
      a: 'One frame of 300 KB does not fit in the heap of a bare ESP32, and two never could. Use PSRAM, or draw in strips (LVGL commonly uses a tenth of the screen).'
    }
  ],
  code: [
    {
      title: 'Find the PSRAM and put a frame in it',
      about: 'Checks that PSRAM is available, then allocates a 320 × 240 RGB565 frame buffer (153 600 bytes) and fills it with red, printing the free memory before and after.',
      needs: 'A board with PSRAM (an ESP32 WROVER module, or an ESP32-S3 with an R2 or R8 module), PSRAM enabled in the Tools menu, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          if <not <PSRAM found?>> then
            print [no PSRAM: enable it in the board menu, or this board has none]
            stop [this script v]
          end
          print (join [PSRAM free KB: ] ((free PSRAM) / (1024)))
          set [frame v] to (allocate ((320) * (240) * (2)) bytes in PSRAM) :: storage
          if <(frame) = [nothing]> then
            print [allocation failed]
            stop [this script v]
          end
          fill (frame) with (63488)
          print (join [PSRAM free KB now: ] ((free PSRAM) / (1024)))
      `,
      cpp: String.raw`
        const size_t W = 320, H = 240;
        const size_t FRAME_BYTES = W * H * 2;                // 16 bits per pixel

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!psramFound()) {
            Serial.println("no PSRAM: enable it in the board menu, or this board has none");
            return;
          }
          Serial.printf("PSRAM free KB: %u\n", (unsigned)(ESP.getFreePsram() / 1024));

          uint16_t *frame = (uint16_t *)ps_malloc(FRAME_BYTES);   // allocate in PSRAM on purpose
          if (frame == NULL) {
            Serial.println("allocation failed");
            return;
          }
          for (size_t i = 0; i < W * H; i++) {
            frame[i] = 0xF800;                               // red in RGB565
          }
          Serial.printf("PSRAM free KB now: %u\n", (unsigned)(ESP.getFreePsram() / 1024));
          free(frame);
        }

        void loop() {}
      `,
      py: String.raw`
        import gc

        W, H = 320, 240
        FRAME_BYTES = W * H * 2                              # 16 bits per pixel

        gc.collect()
        print("free KB:", gc.mem_free() // 1024)             # megabytes on a build whose heap is in PSRAM
        try:
            frame = bytearray(FRAME_BYTES)                   # comes from the MicroPython heap
        except MemoryError:
            print("allocation failed: this build has no PSRAM heap")
        else:
            for i in range(0, FRAME_BYTES, 2):
                frame[i] = 0x00                              # red in RGB565 is 0xF800
                frame[i + 1] = 0xF8
            print("free KB now:", gc.mem_free() // 1024)
      `,
      output: `
        PSRAM free KB: 8188
        PSRAM free KB now: 8038
      `,
      notes: ['The sizes printed depend on the module: an 8 MB part shows about 8 MB, minus what the system keeps.', 'MicroPython has no ps_malloc: on a PSRAM build the whole heap is in PSRAM, so the same bytearray lands there; on a build without it the allocation fails. Filling 150 KB from Python is slow; it is only to show the memory working.', 'On the S3 the board must have the PSRAM entry of the Tools menu set to the kind the module has (OPI for the R8 modules).']
    }
  ],
  quiz: [
    { q: 'An ESP32-C3 board is listed with "8 MB PSRAM". What should you conclude?', choices: ['Fine: the C3 supports up to 8 MB', 'The listing is wrong: the C3 has no PSRAM interface', 'It works only with Bluetooth off', 'The PSRAM is the flash chip'], a: 1, why: 'The catalogue shows no PSRAM interface on the C3, C6, C2 or H2. Such a listing means a mistake, or a different chip under the label.' },
    { q: 'On an ESP32-S3 module with octal PSRAM (an R8 module) psramFound() returns false. What do you check first?', choices: ['The partition scheme', 'The PSRAM entry in the Tools menu: it must be set to OPI PSRAM', 'The Wi-Fi password', 'The USB cable'], a: 1, why: 'The firmware has to be built for the kind of memory fitted. Octal memory with the menu on Disabled or QSPI is not found.' },
    { q: 'Data in PSRAM is read as fast as data in internal RAM, because the CPU sees it as ordinary memory.', a: false, why: 'The CPU reaches PSRAM through the cache and a narrow external bus. Sequential access is acceptable, scattered access is much slower, and octal memory is faster than quad.' },
    { q: 'Which of these should stay in internal RAM?', choices: ['A camera frame', 'An interrupt handler and the data it touches', 'A 100 KB JSON buffer', 'A display frame buffer'], a: 1, why: 'PSRAM cannot be reached while the flash is busy, and an interrupt may arrive at that moment. The big, patient buffers are the ones for PSRAM.' }
  ],
  applications: [
    'Camera boards: frames of tens or hundreds of KB for photos and video ([[the-esp32-camera-driver]]).',
    'Colour displays and LVGL screens with full-frame buffers and double buffering.',
    'Audio buffers, recorded clips and large sample tables.',
    'Neural-network working memory and large JSON or TLS buffers.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, API Guides: "Support for External RAM" (modes, limits, how allocation chooses PSRAM).',
    'Espressif, *ESP-IDF Programming Guide*: "Heap Memory Allocation" (capabilities such as MALLOC_CAP_SPIRAM).',
    'Espressif, *ESP32-S3-WROOM-1 Datasheet*: the module versions with quad and octal PSRAM and the pins they reserve.'
  ],
  sim: { id: 'ms-stack-heap', params: { psram: 8 } }
},

/* ================================================================ stack, heap and static memory */
{
  id: 'stack-heap-and-static',
  parent: 'memory-and-storage',
  title: 'Stack, heap and static memory',
  level: 1,
  short: 'A program\'s data lives in three places — fixed before it starts, on a stack that follows the calls, and in a heap handed out on request — each with its own rules for when it is born and dies. Most "out of memory" errors come from mixing them up.',
  keywords: ['stack', 'heap', 'static', 'global variables', 'dynamic memory', 'malloc', 'free', 'getFreeHeap', 'getMinFreeHeap', 'getMaxAllocHeap', 'uxTaskGetStackHighWaterMark', 'gc.mem_free', 'stack overflow', 'out of memory', 'loop task stack', 'memory budget'],
  prereq: ['memory-map', 'variables-and-types', 'functions'],
  related: ['heap-and-fragmentation', 'task-stacks', 'stack-overflow-and-heap-corruption', 'using-psram', 'tasks', 'strings-and-text', 'structs-and-classes'],
  body: `A program's data lives in three places, and each has its own rule for when it is born and when it dies. Mixing them up is behind most "out of memory" errors and a good many mysterious crashes.

### Static: laid out before the program starts

Global variables, \`static\` variables and the buffers declared once at file level are placed by the linker. Their size is known when the program is built; they exist from boot until reset. The Arduino IDE's line "Global variables use … bytes of dynamic memory" counts exactly these — "dynamic" is a misnomer, since this memory never changes size. Constants (\`const\` tables, string literals) stay in flash.

### The stack: automatic, last in first out

Each function call puts a **frame** on a stack — its parameters, local variables and the way back — and each return takes it off ([[functions]]). It is quick and needs no freeing, but it has a fixed size: on the ESP every task has a stack whose size was chosen when the task was created, and the Arduino loop task has 8192 bytes by default. A large local array (\`char buf[4096]\`) or runaway recursion exhausts it, and the result is a stack overflow ([[stack-overflow-and-heap-corruption]], [[task-stacks]]).

### The heap: on request

\`malloc\`, \`new\`, a growing \`String\`, a \`std::vector\`, a JSON document, the buffers of Wi-Fi and TLS — all come from the heap, a pool the system manages. You ask, you may be refused, and you give the block back. Its free size changes all the time, and its shape matters as much as its size ([[heap-and-fragmentation]]).

| | Static | Stack | Heap |
|---|---|---|---|
| Created | before the program runs | at the call | by malloc, new, String |
| Freed | at reset | at the return | by you, or when the object goes |
| Size fixed | at build time | per task, at creation | decided at run time |
| Typical failure | too many big globals | stack overflow | allocation fails, fragmentation, leaks |

### How the RAM divides

The catalogue's 520 KB (ESP32) is **not** the heap. Part of the SRAM serves as instruction RAM and cache, static data takes its share, and the heap gets what remains — which then also supplies every task's stack. Wi-Fi takes tens of kilobytes of it when it starts, and Bluetooth takes its share too. Print \`ESP.getFreeHeap()\` in \`setup()\` of your own sketch: that is your budget; the simulation shows how it is spent.

Four numbers are worth printing: the **free heap**, the **lowest free heap** since boot (the real budget, because the dips matter), the **largest free block** (what one allocation can get), and the **stack high-water mark** (how close a task has come to overflowing). MicroPython has a garbage collector that frees for you; \`gc.mem_free()\` reports what is left.

> [!key] Static data is fixed at build time, the stack follows the calls in a task of fixed size, and the heap is handed out and returned at run time. Budget from the free heap you measure, not from the datasheet's RAM figure, and watch the lowest value, not the current one.`,
  ideas: [
    'Static data is laid out at build time and lasts until reset; the stack holds the frames of the running calls; the heap is handed out on request.',
    'A task\'s stack has a fixed size chosen at creation, 8192 bytes for the Arduino loop task; big local arrays overflow it.',
    'The RAM figure in the datasheet is not the heap: code cache, static data, the radio and the stacks take their share first.',
    'Measure free heap, lowest free heap, largest block and stack high-water mark; the lowest value is the true budget.'
  ],
  pitfalls: [
    'The IDE says the sketch uses 6 % of dynamic memory, so 94 % is free — That line counts only static data. The heap, the stacks and the radio come out of the rest, and a sketch with big locals or many Strings can fail at 6 %.',
    'A local array is the same as malloc, only shorter — It lives on the stack, which is small and fixed. A 20 000-byte local array in loop() overflows the 8 KB stack at once; the same bytes from malloc would be fine.',
    'ESP.getFreeHeap() shows enough, so the allocation will work — It sums all free memory. One allocation needs one unbroken block, which can be much smaller. Check getMaxAllocHeap() too.'
  ],
  terms: [
    { term: 'Static memory', also: ['global variables', '.data', '.bss'], def: 'Memory for globals and static variables, laid out when the program is built and kept until reset. The Arduino IDE reports its size as "global variables".' },
    { term: 'Stack', also: ['call stack', 'task stack'], def: 'The memory where each function call keeps its parameters, local variables and return address. Last in, first out, fixed in size per task: one overflow crashes the task.' },
    { term: 'Heap', also: ['free heap', 'dynamic memory'], def: 'The pool of memory handed out at run time by malloc, new and String, and given back by free. ESP.getFreeHeap() reports how much is free.' },
    { term: 'High-water mark', also: ['stack high-water mark', 'uxTaskGetStackHighWaterMark'], def: 'The least stack space a task has ever had left. A small value means the task came close to overflowing, even if it is fine at this moment.' },
    { term: 'Garbage collector', also: ['GC', 'gc.collect'], def: 'The part of MicroPython that finds objects nobody refers to any more and frees them. It runs by itself when memory is short, or when you call gc.collect().' }
  ],
  choose: {
    good: ['Static buffers of fixed size for data whose maximum you know', 'Small local variables for short-lived values', 'The heap for data whose size is known only at run time, allocated once and kept'],
    avoid: ['Large arrays as local variables', 'Allocating and freeing different sizes again and again in a long-running loop', 'Recursion with no known depth limit'],
    check: ['The free heap, the lowest free heap and the largest block, printed at start and during a long run', 'The stack high-water mark of every task', 'What the program does when an allocation fails']
  },
  code: [
    {
      title: 'Watch the numbers move',
      about: 'Prints the memory numbers at the start, after taking 8000 bytes from the heap, after giving them back, and while a function holds a 3000-byte array. The C++ version reports the stack space left, the MicroPython version the stack space used.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          report memory [at start] :: my
          set [block v] to (allocate (8000) bytes) :: storage
          report memory [after malloc] :: my
          free (block) :: storage
          report memory [after free] :: my
          use stack space :: my
          report memory [after the call] :: my

        define report memory (when)
          print (join (when) (join [  free heap ] (join (free heap) (join [  stack left ] (stack left)))))

        define use stack space
          set [buffer v] to (list of (3000) bytes on the stack) :: my
          report memory [inside the call] :: my
      `,
      cpp: String.raw`
        void report(const char *when) {
          Serial.printf("%-16s free heap %6u  lowest %6u  largest block %6u  stack left %5u\n", when,
                        (unsigned)ESP.getFreeHeap(), (unsigned)ESP.getMinFreeHeap(),
                        (unsigned)ESP.getMaxAllocHeap(), (unsigned)uxTaskGetStackHighWaterMark(NULL));
        }

        void useStackSpace() {
          volatile char buffer[3000];                        // 3000 bytes on the stack while this function runs
          for (int i = 0; i < 3000; i += 64) {
            buffer[i] = (char)i;
          }
          report("inside the call");
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          report("at start");
          char *block = (char *)malloc(8000);                // 8000 bytes from the heap
          report("after malloc");
          free(block);
          report("after free");
          useStackSpace();
          report("after the call");
        }

        void loop() {}
      `,
      py: String.raw`
        import gc, micropython

        def report(when):
            gc.collect()
            print("%-16s free heap %6d  stack used %5d" % (when, gc.mem_free(), micropython.stack_use()))

        def use_stack_space():
            buffer = bytearray(3000)                         # in MicroPython this array is on the heap
            for i in range(0, 3000, 64):
                buffer[i] = i & 255
            report("inside the call")

        report("at start")
        block = bytearray(8000)                              # 8000 bytes from the heap
        report("after malloc")
        block = None                                         # nothing refers to it any more
        report("after free")
        use_stack_space()
        report("after the call")
      `,
      output: `
        at start         free heap 289412  lowest 289412  largest block 113792  stack left  7160
        after malloc     free heap 281388  lowest 281388  largest block 113792  stack left  7160
        after free       free heap 289412  lowest 281388  largest block 113792  stack left  7160
        inside the call  free heap 289412  lowest 281388  largest block 113792  stack left  3984
        after the call   free heap 289412  lowest 281388  largest block 113792  stack left  3984
      `,
      notes: ['The numbers are only an example; they depend on the chip, the core version and the settings. Run it on your board.', 'The high-water mark never recovers: "after the call" still shows the deepest point. "Lowest" behaves the same way for the heap.', 'In MicroPython a bytearray is always a heap object, so the 3000 bytes show up in the free heap, not in the stack; only the function frames use the stack.']
    }
  ],
  quiz: [
    { q: 'Where does a local variable declared inside a C++ function normally live?', choices: ['In the heap', 'On the stack of the running task', 'In flash', 'In static memory'], a: 1, why: 'Locals are part of the function\'s frame on the stack and disappear at the return. Only malloc, new and objects like String use the heap, and globals are static.' },
    { q: 'The Arduino IDE reports "Global variables use 21 000 bytes (6 %) of dynamic memory". What does the 6 % tell you about the free heap?', choices: ['The heap is 94 % free', 'Little directly: only static data is counted, and the stacks, the radio and everything allocated later come out of the rest', 'The sketch will crash at 100 %', '6 % of the flash is used'], a: 1, why: 'The figure is the static part of RAM, compared with the RAM that can hold static data. The heap and the stacks are what is left, and the radio and your allocations eat into it at run time.' },
    { q: 'A 20 000-byte local array in loop() is a safe way to get a big buffer, since the stack is as large as the heap.', a: false, why: 'The stack of the Arduino loop task is 8192 bytes by default. A 20 000-byte local overflows it at once. Make it static, or take it from the heap.' },
    { q: 'After a long run, uxTaskGetStackHighWaterMark returns 180 for a task. What does it mean?', choices: ['180 bytes of stack are in use now', 'At its deepest point the task came within 180 bytes of overflowing', 'The task has 180 children', 'The stack is 180 bytes big'], a: 1, why: 'It is the least stack space ever left. 180 bytes is dangerously close: a slightly deeper call chain would overflow, so the stack should be enlarged.' }
  ],
  applications: [
    'Choosing the stack size of a task: start generous, run the worst case, read the high-water mark, trim.',
    'Deciding whether a buffer is global, local or allocated, from how long it must live and how big it is.',
    'Finding why a long-running device slowly runs out of memory: the lowest free heap over days.',
    'Fitting Wi-Fi, a TLS connection and a display buffer into one chip\'s RAM.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, API Reference: "Heap Memory Allocation" and "Heap Memory Debugging".',
    'Arduino core for the ESP32 documentation: the ESP class (getFreeHeap, getMinFreeHeap, getMaxAllocHeap) and the FreeRTOS notes.',
    'MicroPython documentation: the *gc* module and the *micropython* module (mem_info, stack_use).'
  ],
  sim: 'ms-stack-heap'
},

/* ================================================================ the heap and fragmentation */
{
  id: 'heap-and-fragmentation',
  parent: 'memory-and-storage',
  title: 'The heap and fragmentation',
  level: 2,
  short: 'Free memory is not one number. After hours of allocating and freeing blocks of different sizes the free space is cut into small gaps: plenty in total, nothing big enough — and the next large request fails on a device that was fine on the bench.',
  keywords: ['fragmentation', 'heap fragmentation', 'memory leak', 'String concatenation', 'reserve', 'getMaxAllocHeap', 'largest free block', 'heap_caps_get_largest_free_block', 'out of memory', 'malloc failed', 'MemoryError', 'memory allocation failed', 'mem_info', 'memory pool', 'crash after days'],
  prereq: ['stack-heap-and-static', 'strings-and-text', 'memory-map'],
  related: ['using-psram', 'json-on-a-microcontroller', 'stack-overflow-and-heap-corruption', 'soak-and-stress-tests', 'http-client', 'web-server-on-esp', 'structs-and-classes'],
  body: `Picture a shelf with 40 cm free, but in four gaps of 10 cm between books. A 20 cm atlas will not go on it, though 40 cm is "free". The heap behaves the same way. It is a row of blocks of different sizes, handed out and returned in whatever order the program asks, and after hours of mixed requests the free space is cut into many small gaps. That is **fragmentation**: the free total is large, the largest single block is small, and an allocation that needs one big block fails.

### How it happens

Blocks of different sizes and lifetimes end up side by side: a short-lived reply buffer next to a log line that lives for ever. Free the first and a hole remains; the next request is a little larger and does not fit, so it goes elsewhere, and the hole waits for something small. The classic culprit is the growing \`String\`: \`s += "x"\` makes the string larger in small steps, and whenever it cannot grow in place it moves, leaving its old place behind as a hole — and when no gap anywhere is big enough it fails, though plenty of memory is free. The simulation shows exactly that.

### Why it hurts here

A microcontroller has no virtual memory and no compaction: a C++ pointer cannot be moved behind your back. MicroPython's collector frees unused objects but does not move the live ones either, so a \`MemoryError\` can come with plenty of free memory. And the failure is slow: a device that runs for days meets the worst case that a bench test of ten minutes never does.

### What to do

1. **Allocate big things once**, at start, and keep them: static buffers, or blocks taken in \`setup()\` and never freed.
2. **Reserve.** \`String s; s.reserve(200);\` allocates once; better still, build text with \`snprintf\` into a fixed \`char\` array.
3. **Reuse buffers** instead of making a new one for each message. In MicroPython read into a preallocated \`bytearray\`.
4. **Measure the right number.** Not only the free heap, but the largest free block (\`ESP.getMaxAllocHeap()\`): when it is a small fraction of the free total, the heap is fragmented. Log both over days.
5. **Handle a failed allocation.** \`malloc\` returns NULL; a device that survives that and tries later is more robust than one that crashes.

Leaks are a different problem — memory never given back, so free shrinks steadily — but both show up in the same pair of numbers.

> [!key] Total free memory says nothing about whether a block of a given size can be had: fragmentation leaves many small gaps. Allocate big buffers once, reserve before growing, and watch the largest free block as well as the free total.`,
  ideas: [
    'Free memory is a set of gaps; an allocation needs one gap big enough, and fragmentation makes the gaps small.',
    'Blocks of different sizes and lifetimes mixed in a long run, above all growing Strings, cut the heap into pieces.',
    'There is no compaction: neither C++ pointers nor MicroPython objects are moved, so only habits cure it.',
    'Allocate once, reserve before growing, reuse buffers, and log the largest free block next to the free total.'
  ],
  pitfalls: [
    'If the free heap is large the next allocation will work — It needs one unbroken block. After a long run the largest block can be a small fraction of the free total.',
    'A loop that frees everything it allocates cannot run out of memory — It can: the freed blocks may sit between blocks that live on, and later requests of a larger size find no gap. A leak and fragmentation are two different faults.',
    'MicroPython\'s garbage collector cures fragmentation — It frees unreachable objects but does not move the live ones, so a large allocation can still fail with "memory allocation failed". Preallocate buffers and reuse them.'
  ],
  terms: [
    { term: 'Fragmentation', also: ['heap fragmentation'], def: 'The state of a heap whose free memory is split into many small gaps, so that a large request fails although the free total would be enough.' },
    { term: 'Largest free block', also: ['getMaxAllocHeap', 'max alloc heap'], def: 'The size of the biggest single piece of free heap: the most one allocation can get. Compare it with the free total to judge fragmentation.' },
    { term: 'Memory leak', also: ['leak'], def: 'Memory that was allocated and never given back, so the free heap shrinks steadily until an allocation fails.' },
    { term: 'reserve()', also: ['String.reserve', 'vector.reserve'], def: 'A call that allocates the full capacity of a String or vector once, so that it does not have to grow, and move, in small steps.' },
    { term: 'Memory pool', also: ['block pool', 'object pool'], def: 'A set of equal-sized blocks taken once at start and handed out and returned by the program, so that the heap itself is never fragmented by them.' }
  ],
  choose: {
    good: ['Buffers allocated once at start and reused for ever', 'snprintf into a fixed char array for building text', 'Fixed-size message slots or a pool for network and sensor data'],
    avoid: ['Building text with + in a loop that runs for days', 'Allocating and freeing buffers of varying sizes in the main loop', 'A big allocation late in a long run, when the heap has aged'],
    check: ['The largest free block, logged over days, next to the free total', 'What the program does when an allocation fails', 'That every reserve() is large enough that the String never has to grow']
  },
  examples: [
    {
      title: 'Will the answer fit?',
      q: 'After a day a device reports a free heap of 62 000 bytes and a largest free block of 9 600 bytes. It must now read an HTTP answer of 16 000 bytes into one String. Will that work, and what would you change?',
      steps: ['The free total, 62 000 bytes, is far more than 16 000 — but a String needs one block, and the largest block is only 9 600 bytes.', 'The heap is fragmented: $1 - 9\\,600 / 62\\,000 \\approx 85\\,\\%$ of the free memory is unusable for a block that large.', 'The String would grow in steps and fail part-way; the request fails or the program crashes.', 'Change the design: take the answer buffer once in \`setup()\` (a static or reserved buffer of 20 000 bytes) and reuse it, or read the answer in pieces.'],
      a: 'It will not work: 85 % fragmentation. Allocate the buffer once at start, or stream the answer.'
    }
  ],
  code: [
    {
      title: 'Free memory in pieces',
      about: 'Takes 1000-byte blocks until the heap is full, gives every other one back, and then asks for 20 000 bytes. Half the heap is free again, but only in gaps of 1000 bytes, so the big request fails.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. Switch PSRAM off in the board menu, or the big request is served from PSRAM.',
      blocks: `
        when started
          start serial at (115200) baud
          report heap [at start] :: my
          set [n v] to (0)
          repeat until <(allocate (1000) bytes as block (n)) = [nothing]>
            change [n v] by (1)
          end
          for each [i v] in (every second number from (0) below (n)) :: my
            free (block (i))
          end
          report heap [every other freed] :: my
          set [big v] to (allocate (20000) bytes)
          if <(big) = [nothing]> then
            print [20000 bytes: FAILED]
          else
            print [20000 bytes: ok]
          end

        define report heap (when)
          print (join (when) (join [  free ] (join (free heap) (join [  largest block ] (largest free block)))))
      `,
      cpp: String.raw`
        const int MAX_BLOCKS = 512;
        void *blocks[MAX_BLOCKS];

        void report(const char *when) {
          Serial.printf("%-18s free %6u  largest block %6u\n", when,
                        (unsigned)ESP.getFreeHeap(), (unsigned)ESP.getMaxAllocHeap());
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          report("at start");

          int n = 0;
          while (n < MAX_BLOCKS && (blocks[n] = malloc(1000)) != NULL) {   // take 1000-byte blocks until none is left
            n++;
          }
          for (int i = 0; i < n; i += 2) {                                 // give every other one back
            free(blocks[i]);
            blocks[i] = NULL;
          }
          report("every other freed");

          void *big = malloc(20000);                                       // plenty is free, but only in gaps of 1000 bytes
          Serial.println(big != NULL ? "20000 bytes: ok" : "20000 bytes: FAILED");
          if (big != NULL) {
            free(big);
          }
          for (int i = 1; i < n; i += 2) {
            free(blocks[i]);
          }
          report("all freed");
        }

        void loop() {}
      `,
      py: String.raw`
        import gc, micropython

        MAX_BLOCKS = 400
        blocks = [None] * MAX_BLOCKS              # the list itself is allocated now, before the heap fills up

        def report(when):
            gc.collect()
            print(when, "- free", gc.mem_free())
            micropython.mem_info()                # "max free sz" is the largest free block, in 16-byte units

        report("at start")
        n = 0
        try:
            while n < MAX_BLOCKS:
                blocks[n] = bytearray(1000)       # take 1000-byte blocks until none is left
                n += 1
        except MemoryError:
            pass
        for i in range(0, n, 2):                  # give every other one back
            blocks[i] = None
        report("every other freed")

        try:
            big = bytearray(20000)                # plenty is free, but only in gaps of 1000 bytes
            print("20000 bytes: ok")
        except MemoryError:
            print("20000 bytes: FAILED")
      `,
      output: `
        at start           free 289412  largest block 113792
        every other freed  free 145388  largest block   1008
        20000 bytes: FAILED
        all freed          free 289412  largest block 113792
      `,
      notes: ['The numbers are an example from a bare ESP32 without Wi-Fi; yours differ, but the pattern does not: the free total rises by half, the largest block collapses.', 'With PSRAM enabled the loop does not run the internal heap dry, and the big request is served from PSRAM.', 'MicroPython prints the free bytes and a line from mem_info(); the line "max free sz" shows the same collapse.']
    }
  ],
  quiz: [
    { q: 'ESP.getFreeHeap() reports 80 000 bytes, yet malloc(30000) returns NULL. How can that be?', choices: ['The counter is wrong', 'The free memory is in several smaller pieces: no single block of 30 000 bytes exists', 'malloc cannot give more than 16 KB', 'The flash is full'], a: 1, why: 'getFreeHeap adds up all the gaps. An allocation needs one gap, and the largest gap can be far smaller than the total.' },
    { q: 'Which habit reduces fragmentation the most?', choices: ['Calling free() more often', 'Allocating the long-lived buffers once at start and reusing them', 'Using many small Strings instead of one large one', 'Putting delay() between allocations'], a: 1, why: 'Fragmentation comes from blocks of different sizes and lifetimes being mixed. Buffers taken once at the start never leave holes.' },
    { q: 'MicroPython\'s garbage collector moves live objects together, so fragmentation cannot happen there.', a: false, why: 'The collector frees objects nobody refers to, but it does not move the others. A large bytearray can fail with "memory allocation failed" while gc.mem_free() still shows a lot.' },
    { q: 'Which pair of numbers reveals fragmentation?', choices: ['Free heap and lowest free heap', 'Free heap and largest allocatable block', 'Free heap and stack high-water mark', 'Heap size and flash size'], a: 1, why: 'A free total much bigger than the largest block means the free memory is in small pieces.' }
  ],
  applications: [
    'Gateways and sensors that run for months and must not fall over after a week.',
    'Web servers that build a reply for every request, and HTTP clients that read big answers.',
    'Code that formats log lines and MQTT payloads with String concatenation.',
    'Any program that mixes short-lived buffers with long-lived connections or objects.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, API Reference: "Heap Memory Allocation" (largest free block, capabilities) and "Heap Memory Debugging".',
    'Arduino core for the ESP32 documentation: the ESP class (getFreeHeap, getMaxAllocHeap) and the String class.',
    'MicroPython documentation: the *gc* and *micropython* modules (mem_info).'
  ],
  sim: 'ms-heap-fragmentation'
},

/* ================================================================ JSON on a microcontroller */
{
  id: 'json-on-a-microcontroller',
  parent: 'memory-and-storage',
  title: 'JSON on a microcontroller',
  level: 2,
  short: 'JSON is how an ESP talks to the web, and it is costly in RAM: the parsed tree takes several times the size of the text. Filter, stream and build with the library, and never parse a message of unlimited size.',
  keywords: ['JSON', 'ArduinoJson', 'JsonDocument', 'deserializeJson', 'serializeJson', 'measureJson', 'getFreeHeap', 'Filter', 'DeserializationOption', 'json.loads', 'json.dumps', 'parse', 'serialize', 'weather API', 'payload'],
  prereq: ['heap-and-fragmentation', 'strings-and-text', 'rest-apis-and-json'],
  related: ['http-client', 'mqtt', 'data-formats', 'using-psram', 'logging-data', 'device-configuration', 'web-interface-security'],
  body: `JSON is how an ESP talks to the web: a sensor answer such as \`{"temp":21.5,"hum":48}\`, a weather forecast, a settings file, an MQTT payload. It is text, easy to read — and expensive in RAM. To use JSON a program usually **parses** it into a tree of values in memory, and the tree takes several times the size of the text.

### Text against document

A message of 20 readings like \`{"t":1700000000,"temp":21.5,"hum":48}\` is about 800 bytes of text. Parsed by ArduinoJson every key and value gets a slot of a few bytes, and strings are copied, so the document needs a few kilobytes. A forecast of 12 KB can ask for tens of kilobytes, on top of the \`String\` that first holds the text, which is itself one block that a fragmented heap may not have ([[heap-and-fragmentation]]). The figure need not be guessed: ArduinoJson 7 no longer reports a document's size itself (version 6 had \`memoryUsage()\`), so measure the free heap before and after the parse, as the program below does; the simulation shows how it scales.

### Keeping it small

1. **Filter.** Tell the parser which fields you want; everything else is skipped as the text goes past, and the document holds only your fields. A forecast reduced to three numbers needs hardly any memory.
2. **Stream.** Parse from the network stream rather than from a \`String\` that first holds the whole answer: you then keep one copy instead of two.
3. **Take pieces.** For a long list, read one element at a time and drop it.
4. If you control both ends, a plainer format costs less: CSV, or a fixed binary record ([[data-formats]]).

MicroPython's \`json.loads\` turns the whole text into Python objects at once and has no filter; its \`MemoryError\` comes sooner for the same reason.

### Building JSON

Do not glue text together with \`+\`: quotes, backslashes and number formats go wrong, and the temporary Strings fragment the heap. Fill a \`JsonDocument\` and serialise it straight into a fixed buffer, into the serial port or into the network client; \`measureJson(doc)\` tells the length beforehand, for example for a Content-Length header.

### Traps

- A missing key gives zero or an empty string: use a default (\`doc["hum"] | -1\`) and check the error code of the parse.
- **Limit the input.** A parser given a message of any size will use any amount of memory. Check the length first, and treat what arrives from the network as untrusted ([[web-interface-security]]).
- JSON numbers carry no type: read a very large integer into a type that is too small, or a float through a short one, and digits are lost.

> [!key] A parsed JSON document takes several times the text size, on top of any copy of the text. Filter to the fields you need, stream rather than buffer, build with the library instead of string joins, and put a limit on the size of anything you parse.`,
  ideas: [
    'The parsed tree of a JSON message takes several times the size of its text, on top of any copy of the text.',
    'A deserialization filter keeps only the fields you ask for; parsing from the stream avoids holding the text and the tree together.',
    'Build JSON with a document and serialize it, not with string joins; measureJson gives the length beforehand.',
    'Limit the input size, use defaults for missing keys, and check the parse error.'
  ],
  pitfalls: [
    'A 5 KB reply needs about 5 KB of RAM — The tree is several times larger than the text, and ArduinoJson copies the strings; a String holding the text adds another 5 KB. Measure the free heap around the parse and filter the fields you need.',
    'Gluing strings with + is a fine way to write JSON — Quotes and special characters are not escaped, numbers print as they like, and the temporary Strings fragment the heap. Use the library.',
    'The server will always send small answers — A service can change its reply, or a hostile one can send a huge message. Put a limit on the size you accept, and check the error returned by the parser.'
  ],
  terms: [
    { term: 'JSON', also: ['JavaScript Object Notation'], def: 'A text format for structured data: objects of named values, arrays, numbers, strings, true, false and null. The common language of web services and of MQTT payloads.' },
    { term: 'Parse', also: ['deserialize', 'deserializeJson', 'json.loads'], def: 'To read JSON text and build from it values the program can use. The opposite of serialising.' },
    { term: 'Serialize', also: ['serializeJson', 'json.dumps'], def: 'To turn values in memory into JSON text, with the quotes and escapes in the right places.' },
    { term: 'JsonDocument', also: ['ArduinoJson', 'document'], def: 'The ArduinoJson 7 object that holds a parsed or built JSON tree. It takes its memory from the heap and grows as needed; version 7 has no call that reports how much it holds.' },
    { term: 'Deserialization filter', also: ['DeserializationOption::Filter', 'JSON filter'], def: 'A small document that lists the fields to keep. The parser skips every other field while reading, so the result needs far less memory.' }
  ],
  choose: {
    good: ['ArduinoJson with a filter for replies from web services', 'json.dumps and json.loads in MicroPython for small messages', 'CSV or a fixed binary record when both ends are yours and the data is regular'],
    avoid: ['Parsing a whole large reply into one document', 'Building JSON text by joining strings', 'Trusting the input: no size limit and no error check'],
    check: ['The size of the text and of the document (the free heap before and after the parse)', 'The error code after every parse', 'Which fields you really use', 'The largest free block when the parse starts']
  },
  code: [
    {
      title: 'Parse a reply and keep only what you need',
      about: 'Parses a small weather reply held in a string. In C++ a filter keeps only the temperature, the humidity and the temperatures of the forecast, and the program prints how much memory the document needs. MicroPython parses all of it.',
      needs: 'Any ESP32-family board, the ArduinoJson library (version 7), and the serial monitor at 115200 baud. No network is needed.',
      libs: ['ArduinoJson'],
      blocks: `
        when started
          start serial at (115200) baud
          set [reply v] to [{"city":"Haifa","temp":21.5,"hum":48,"wind":{ … },"forecast": … }]
          set [doc v] to (parse JSON (reply) keeping only [temp, hum, forecast.t]) :: my
          print (join [temp ] (join (item [temp] of (doc)) (join [, humidity ] (item [hum] of (doc)))))
          for each [day v] in (item [forecast] of (doc))
            print (join [forecast ] (item [t] of (day)))
          end
          print (join [text ] (join (length of (reply)) (join [ bytes, document ] (memory used by (doc)))))
      `,
      cpp: String.raw`
        #include <ArduinoJson.h>

        const char *reply =
          R"({"city":"Haifa","temp":21.5,"hum":48,"wind":{"speed":3.2,"deg":270},"forecast":[{"d":1,"t":22.1},{"d":2,"t":23.4},{"d":3,"t":21.0}]})";

        void setup() {
          Serial.begin(115200);
          delay(1000);

          JsonDocument filter;                               // the fields to keep; the rest is skipped
          filter["temp"] = true;
          filter["hum"] = true;
          filter["forecast"][0]["t"] = true;                 // [0] applies to every element of the array

          uint32_t before = ESP.getFreeHeap();               // ArduinoJson 7 has no memoryUsage(): measure the heap
          JsonDocument doc;
          DeserializationError err = deserializeJson(doc, reply, DeserializationOption::Filter(filter));
          if (err) {
            Serial.print("parse failed: ");
            Serial.println(err.c_str());
            return;
          }

          float temp = doc["temp"];
          int hum = doc["hum"] | -1;                         // -1 if the key is missing
          Serial.printf("temp %.1f, humidity %d\n", temp, hum);
          for (JsonObject day : doc["forecast"].as<JsonArray>()) {
            Serial.printf("forecast %.1f\n", day["t"].as<float>());
          }
          Serial.printf("text %u bytes, document %u bytes\n", (unsigned)strlen(reply), (unsigned)(before - ESP.getFreeHeap()));
        }

        void loop() {}
      `,
      py: String.raw`
        import json, gc

        reply = '{"city":"Haifa","temp":21.5,"hum":48,"wind":{"speed":3.2,"deg":270},"forecast":[{"d":1,"t":22.1},{"d":2,"t":23.4},{"d":3,"t":21.0}]}'

        gc.collect()
        before = gc.mem_alloc()
        doc = json.loads(reply)                              # all of it becomes Python objects: there is no filter
        used = gc.mem_alloc() - before

        print("temp %.1f, humidity %d" % (doc["temp"], doc.get("hum", -1)))
        for day in doc["forecast"]:
            print("forecast %.1f" % day["t"])
        print("text %d bytes, document %d bytes" % (len(reply), used))
      `,
      output: `
        temp 21.5, humidity 48
        forecast 22.1
        forecast 23.4
        forecast 21.0
        text 132 bytes, document 160 bytes
      `,
      notes: ['The size of the document depends on the library version and the chip; run it to see yours. Without the filter the C++ document would also hold the city, the wind and the day numbers.', 'MicroPython keeps every field, so its figure covers the whole reply.']
    },
    {
      title: 'Build a message',
      about: 'Builds a small JSON message with a list of samples, writes it into a fixed buffer and prints it with its length.',
      needs: 'Any ESP32-family board, the ArduinoJson library (version 7), and the serial monitor at 115200 baud.',
      libs: ['ArduinoJson'],
      blocks: `
        when started
          start serial at (115200) baud
          set [doc v] to (new JSON object) :: my
          set key [sensor] of (doc) to [esp32]
          set key [temp] of (doc) to (21.5)
          set key [ok] of (doc) to <true>
          set key [samples] of (doc) to (list (20.5) (21.5) (22.5))
          set [text v] to (JSON text of (doc)) :: my
          print (text)
          print (join (length of (text)) [ bytes])
      `,
      cpp: String.raw`
        #include <ArduinoJson.h>

        void setup() {
          Serial.begin(115200);
          delay(1000);

          JsonDocument doc;
          doc["sensor"] = "esp32";
          doc["temp"] = 21.5;
          doc["ok"] = true;
          JsonArray samples = doc["samples"].to<JsonArray>();
          samples.add(20.5);
          samples.add(21.5);
          samples.add(22.5);

          char buffer[128];                                  // a fixed buffer: no String, no fragmentation
          size_t n = serializeJson(doc, buffer, sizeof(buffer));
          Serial.println(buffer);
          Serial.printf("%u bytes (measureJson says %u)\n", (unsigned)n, (unsigned)measureJson(doc));
        }

        void loop() {}
      `,
      py: String.raw`
        import json

        doc = {"sensor": "esp32", "temp": 21.5, "ok": True, "samples": [20.5, 21.5, 22.5]}

        text = json.dumps(doc)
        print(text)
        print(len(text), "bytes")
      `,
      output: `
        {"sensor":"esp32","temp":21.5,"ok":true,"samples":[20.5,21.5,22.5]}
        67 bytes (measureJson says 67)
      `,
      notes: ['MicroPython\'s json.dumps leaves a space after the colons and commas by default, so its text is a few bytes longer; its dict may also list the keys in another order. Both are valid JSON.', 'If the buffer is too small serializeJson stops short; compare n with measureJson(doc) to notice.']
    }
  ],
  quiz: [
    { q: 'A weather reply is 12 KB of JSON text. Why can parsing it fail on a chip with 100 KB of free heap?', choices: ['Parsing is done in flash', 'The parsed document, on top of the String that holds the text, takes several times the size of the text', 'JSON cannot exceed 8 KB', 'Wi-Fi blocks the parse'], a: 1, why: 'Every key, value and string takes room in the tree, and a String holding the text takes its share too. The total can be tens of kilobytes, and the String alone needs one big block, which a fragmented heap may not have.' },
    { q: 'What does an ArduinoJson deserialization filter do?', choices: ['It encrypts the text', 'It keeps only the listed fields in the document; the others are skipped as the text goes past', 'It removes spaces from the output', 'It checks the message against a schema'], a: 1, why: 'The filter is a small document naming the fields to keep. The parser skips the rest, so a big reply can be reduced to a few values at almost no memory cost.' },
    { q: 'Building JSON by joining strings with + is as safe as using the library, because the result is the same text.', a: false, why: 'Joined strings do not escape quotes and special characters, and the temporary Strings fragment the heap. The library escapes properly and can write straight into a buffer.' },
    { q: 'A message arrives from the network and must be parsed. What should the program do first?', choices: ['Nothing: the parser copes with any size', 'Check the length against a limit, and check the error code after parsing', 'Copy the text into a String', 'Increase the loop stack'], a: 1, why: 'Input from the network is untrusted. A limit on its size stops one huge message from using all the memory, and the error code tells whether the text was valid at all.' }
  ],
  applications: [
    'Reading the answer of a weather, tariff or time service and keeping a few numbers.',
    'MQTT payloads of sensors, and commands arriving as small JSON objects.',
    'A settings file on the file system that a user can read and edit.',
    'The REST interface of the ESP itself, answering a web page or a phone app.'
  ],
  sources: [
    'ArduinoJson documentation (arduinojson.org): JsonDocument, deserialization, filtering, serialization and memory usage (version 7).',
    'Arduino core for the ESP32 documentation: the HTTPClient library (reading an answer as a stream).',
    'MicroPython documentation: the *json* module.'
  ],
  sim: 'ms-json-memory'
},

/* ================================================================ logging data */
{
  id: 'logging-data',
  parent: 'memory-and-storage',
  title: 'Logging data',
  level: 2,
  short: 'A logger turns a changing world into a record. Collect samples in a RAM ring buffer, write them in batches as one-line records, rotate the files, and work out beforehand how long the storage will last.',
  keywords: ['data logger', 'logging', 'CSV', 'ring buffer', 'circular buffer', 'batch write', 'log rotation', 'timestamp', 'append', 'LittleFS log', 'SD log', 'flush', 'store and forward', 'sampling', 'JSON Lines'],
  prereq: ['littlefs-and-file-systems', 'nvs-and-preferences', 'non-blocking-timing'],
  related: ['sd-cards', 'flash-wear', 'ntp-and-time', 'store-and-forward', 'time-series-data', 'project-data-logger', 'esp-as-a-data-logger', 'rtc-memory'],
  body: `A logger turns a changing world into a record: a reading every second, a door that opened, an error. Three decisions shape it: where records wait, where they end up, and what happens when the destination is slow, full or gone.

### One line per record

Write **CSV**: a timestamp first, then the values, one record to a line, such as \`1700000012,21.5,48\`. A spreadsheet opens it; a power cut leaves every earlier line intact, because each record is independent; and it takes 20 to 30 bytes. JSON Lines (one JSON object per line) suits fields that vary, at a higher cost; a fixed binary struct is smallest but needs a decoder. Begin the file with a header line and a version. For the time use real time from the network when you can ([[ntp-and-time]]); \`millis()\` restarts at every boot, so if it is all you have, log the boot number too.

### Buffer in RAM, write in batches

Writing is slow and unpredictable, and every write costs wear ([[flash-wear]]). So collect samples in a **ring buffer** — a fixed array with two indices, a head where the next sample goes and a tail where the next to be written is read — and let a second task, or the loop every few seconds, write the batch and flush. When the head catches the tail the buffer is full: the oldest samples are overwritten, or the newest dropped; choose deliberately. The simulation lets you slow the writer down and watch that happen.

### Where the records go

- **The file system** (LittleFS): fine for days of slow data. Roll over: when a file passes a size, rename it and start a new one, and delete the oldest when space runs low.
- **An SD card**: gigabytes, for fast or long logs ([[sd-cards]]).
- **Away**: send records by MQTT or HTTP and keep locally only what has not been acknowledged ([[store-and-forward]]).
- **RTC memory**: a few values across deep sleep ([[rtc-memory]]).

### Do the sum first

Storage lasts $T = C / (r\\,n)$: capacity over record rate times record size. A record of 40 bytes every 10 s fills the 1408 KB file system of the default scheme in just over four days. Never run the file system to the brim: leave a tenth free.

> [!key] Log one line per record, collect samples in a RAM ring buffer and write them in batches, rotate the files, and calculate how long the storage lasts before you build it.`,
  ideas: [
    'One record per line, timestamp first (CSV), makes a log that tools can read and a power cut cannot ruin.',
    'A ring buffer in RAM collects samples; a slower writer saves them in batches.',
    'When the writer is too slow the ring buffer overwrites the oldest samples or drops the newest: decide which.',
    'Storage time is capacity divided by rate times record size; rotate files so the storage never fills.'
  ],
  pitfalls: [
    'Write each sample to the file as it arrives — A write can stall for hundreds of milliseconds on a card, and each flash write costs wear. Collect in RAM and write in batches.',
    'millis() gives the time of each record — It restarts at every boot and wraps after 49.7 days. Use real time from the network, or log the boot number with each record.',
    'The log can run until the storage is full — A full file system slows down and gets fragile. Plan the rollover and the deletion of old files before the first record is written.'
  ],
  terms: [
    { term: 'Ring buffer', also: ['circular buffer', 'FIFO buffer'], def: 'A fixed array used as a queue: a head index where new items are put and a tail index where they are taken, both wrapping round at the end. When the head catches the tail the buffer is full.' },
    { term: 'CSV', also: ['comma-separated values'], def: 'A text format with one record per line and the fields separated by commas. Any spreadsheet reads it, and appending a line cannot damage the lines before it.' },
    { term: 'Log rotation', also: ['rollover', 'rolling log'], def: 'Starting a new log file when the current one reaches a size or an age, and deleting the oldest, so that the storage never fills.' },
    { term: 'Flush', also: ['fsync', 'File.flush'], def: 'Forcing the data a program has written into the file to be stored now, instead of waiting in a buffer. Close does it too.' },
    { term: 'Timestamp', also: ['time stamp'], def: 'The time recorded with each log entry. Seconds since boot are not enough to place records in the real world; real time comes from the network or a clock chip.' }
  ],
  choose: {
    good: ['LittleFS for days of slow data on the board itself', 'An SD card for high rates or long periods', 'A RAM ring buffer in front of either, so that slow writes lose nothing'],
    avoid: ['Writing every sample straight to flash', 'Logs with no rotation or limit', 'Seconds since boot as the only timestamp'],
    check: ['Rate times record size times time, against the free space', 'What a power cut loses: a few lines, never the file', 'The writes per day, against the wear budget']
  },
  formulas: [
    {
      name: 'How long the storage lasts',
      expr: 'T = C / (r * n)',
      tex: 'T = \\frac{C}{r\\,n}',
      vars: {
        T: { name: 'time until full', q: 'time', unit: 'day', tex: 'T' },
        C: { name: 'free storage (bytes)', q: 'count', value: 1441792, min: 1, tex: 'C' },
        r: { name: 'records per second', q: 'rate', unit: '1/s', value: 0.1, min: 0, tex: 'r' },
        n: { name: 'bytes per record', q: 'count', value: 40, min: 1, tex: 'n' }
      },
      solveFor: 'T',
      note: 'The default scheme\'s file system has 1408 KB = 1 441 792 bytes. Leave a tenth free in practice, and add the header and the line ends to the record size.',
      stories: { T: 'A logger stores {n} bytes per record, {r} records a second, into {C} bytes of free space. How long until it is full?', r: 'Free storage of {C} bytes must last {T} with records of {n} bytes. How fast can it log?' }
    }
  ],
  examples: [
    {
      title: 'How long until the file system is full?',
      q: 'A logger appends a 40-byte record every 10 seconds to the 1408 KB file system of the default scheme. How many days until it is full, and what rate lasts a month?',
      steps: ['The space is $1408 \\times 1024 = 1\\,441\\,792$ bytes. The rate is 0.1 records per second, 4 bytes per second, 345 600 bytes a day.', '$T = 1\\,441\\,792 / 345\\,600 \\approx 4.2$ days.', 'For 30 days, the daily budget is $1\\,441\\,792 / 30 \\approx 48\\,000$ bytes, one 40-byte record every $86\\,400 / 1200 = 72$ seconds, or fewer, shorter records.'],
      a: 'About 4.2 days at one record every 10 s; for a month log about once a minute, or send the data away.'
    }
  ],
  code: [
    {
      title: 'Log a reading every second, written ten at a time',
      about: 'Reads a potentiometer once a second into a small buffer in RAM and appends the ten waiting records to log.csv in one go. When the file passes 100 000 bytes it is renamed log.old and a new one is started.',
      needs: 'An ESP32 DevKit, a potentiometer on GPIO34 (ADC1), and the serial monitor at 115200 baud. The partition scheme needs a file-system partition.',
      wiring: [['GPIO34', 'potentiometer wiper'], ['3V3', 'potentiometer end'], ['GND', 'potentiometer end']],
      blocks: `
        when started
          start serial at (115200) baud
          mount the file system :: storage
          set [last v] to (milliseconds since start)
          delete all of [batch v]

        forever
          if <((milliseconds since start) - (last)) ≥ (1000)> then
            change [last v] by (1000)
            add (join (round ((last) / (1000))) (join [,] (analog read pin (34)))) to [batch v]
            if <(length of [batch v]) = (10)> then
              append (batch) to file [/log.csv] :: storage
              delete all of [batch v]
              if <(size of file [/log.csv]) > (100000)> then
                roll over the log file :: storage
              end
            end
          end
        end
      `,
      cpp: String.raw`
        #include <LittleFS.h>

        const int SENSOR_PIN = 34;                 // a potentiometer on an ADC1 pin
        const int BATCH = 10;                      // samples kept in RAM before one write
        const size_t MAX_FILE = 100000;            // bytes: then the log rolls over

        uint32_t stamps[BATCH];
        int values[BATCH];
        int count = 0;
        uint32_t lastSample = 0;

        void flushBatch() {
          File f = LittleFS.open("/log.csv", "a");
          for (int i = 0; i < count; i++) {
            f.printf("%lu,%d\n", (unsigned long)stamps[i], values[i]);
          }
          f.close();
          count = 0;

          File check = LittleFS.open("/log.csv", "r");
          size_t size = check.size();
          check.close();
          if (size > MAX_FILE) {                   // roll over: keep one old file
            LittleFS.remove("/log.old");
            LittleFS.rename("/log.csv", "/log.old");
          }
        }

        void setup() {
          Serial.begin(115200);
          if (!LittleFS.begin(true)) {
            Serial.println("mount failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          if (millis() - lastSample >= 1000) {
            lastSample += 1000;
            stamps[count] = lastSample / 1000;     // seconds since start; use real time when you have it
            values[count] = analogRead(SENSOR_PIN);
            count++;
            if (count == BATCH) {
              flushBatch();
            }
          }
        }
      `,
      py: String.raw`
        import machine, os, time

        adc = machine.ADC(machine.Pin(34), atten=machine.ADC.ATTN_11DB)   # a potentiometer on GPIO34
        BATCH = 10                                 # samples kept in RAM before one write
        MAX_FILE = 100000                          # bytes: then the log rolls over

        stamps = [0] * BATCH
        values = [0] * BATCH
        count = 0

        def flush_batch():
            global count
            with open("/log.csv", "a") as f:
                for i in range(count):
                    f.write("%d,%d\n" % (stamps[i], values[i]))
            count = 0
            if os.stat("/log.csv")[6] > MAX_FILE:  # roll over: keep one old file
                try:
                    os.remove("/log.old")
                except OSError:
                    pass
                os.rename("/log.csv", "/log.old")

        last = time.ticks_ms()
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 1000:
                last = time.ticks_add(last, 1000)
                stamps[count] = time.ticks_ms() // 1000     # seconds since start; use real time when you have it
                values[count] = adc.read_u16() >> 4         # 12 bits, as analogRead gives
                count += 1
                if count == BATCH:
                    flush_batch()
            time.sleep_ms(10)
      `,
      output: `
        # contents of /log.csv after a little over ten seconds
        1,1883
        2,1886
        3,1890
        4,1901
        5,1899
        6,1884
        7,1879
        8,1881
        9,1885
        10,1888
      `,
      notes: ['Nothing is written for the first ten seconds: the samples wait in RAM. A power cut loses at most the ten waiting records and never damages the earlier lines.', 'On the other chips pick an ADC1 pin from the pinout explorer; GPIO34 exists on the original ESP32 only.', 'One write every ten seconds is about 8 600 a day. See [[flash-wear]] before making the batch smaller.']
    }
  ],
  quiz: [
    { q: 'A logger writes one record every 10 ms to an SD card and now and then loses samples. What is the cure?', choices: ['A faster SPI clock only', 'Collect records in a RAM buffer, filled by one task and written in batches by another, so a stalled write loses nothing', 'A longer file name', 'Switch the card to exFAT'], a: 1, why: 'A card can pause a write for hundreds of milliseconds. A ring buffer big enough to hold what arrives in that time absorbs the pause.' },
    { q: 'A ring buffer of 100 samples is filled at 50 a second and emptied by a writer that manages 30 a second. What happens in the long run?', choices: ['Nothing: it simply waits', 'It fills up, and then the oldest samples are overwritten or the newest dropped', 'The writer speeds up by itself', 'The buffer grows'], a: 1, why: 'More arrives than leaves, so the buffer fills in about five seconds and stays full. A ring buffer cannot make up the missing writer speed; it can only decide what to lose.' },
    { q: 'millis() is a good timestamp for a logger that runs for months.', a: false, why: 'millis() restarts at 0 at every boot and wraps after 49.7 days. Real time from the network, or a boot number together with the seconds, keeps the records in order.' },
    { q: 'About how long does 1408 KB of free space last for 40-byte records at one every 10 seconds?', choices: ['4 hours', 'About 4 days', 'About 4 months', 'About 4 years'], a: 1, why: '0.1 records a second at 40 bytes is 4 bytes a second, 345 600 bytes a day. 1 441 792 bytes divided by that is about 4.2 days.' }
  ],
  applications: [
    'Environmental loggers: temperature, humidity and pressure kept for weeks ([[project-data-logger]]).',
    'Event logs of a device: boots, resets, Wi-Fi drops and faults, kept for the service visit.',
    'Energy and power records, with a point every few seconds and a summary every hour.',
    'Vibration and sound captures in bursts, buffered in RAM or PSRAM and written between bursts.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: the file-system and wear-levelling pages, and the Logging library for text logs.',
    'Arduino core for the ESP32 documentation: the LittleFS, SD and FS libraries.',
    'MicroPython documentation: the *os* module and the notes on files.'
  ],
  sim: 'ms-ring-buffer'
},

/* ================================================================ flash wear */
{
  id: 'flash-wear',
  parent: 'memory-and-storage',
  title: 'Flash wear',
  level: 2,
  short: 'Each flash sector survives only about 100 000 erases. A counter saved every second to one sector is dead in about a day; saved at the right moments it outlives the product. The arithmetic takes a minute and saves a recall.',
  keywords: ['flash wear', 'endurance', 'erase cycles', 'program/erase cycles', '100000 cycles', 'wear levelling', 'write amplification', 'data retention', 'NVS writes', 'save counter', 'flash lifetime', 'worn out flash', 'corruption'],
  prereq: ['nvs-and-preferences', 'littlefs-and-file-systems', 'partition-tables'],
  related: ['logging-data', 'sd-cards', 'rtc-memory', 'brownout', 'clones-and-counterfeits', 'reliability-in-the-field', 'flash-memory-on-modules'],
  body: `Flash remembers without power, but it pays for that: each sector can be erased only so many times. The flash chips on ESP modules are specified for about **100 000 erase cycles** per sector (the datasheet calls it endurance). Reading is free; erasing wears. A worn sector begins to forget: bits flip, writes fail, and the file system or NVS reports errors or, worse, returns wrong data.

### The arithmetic

The life of a store is the endurance, times the number of sectors the writes are spread over, times the writes one erase pays for, divided by the writes per day:

$$\\text{life in days} = \\frac{N \\cdot S \\cdot k}{W}$$

- **One sector, rewritten once a second**, with no levelling: 86 400 erases a day, so $100\\,000 / 86\\,400 \\approx 1.2$ days. A product that does this is dead within a week.
- **NVS**, same rate: it spreads over about four working pages, and each page takes 126 entries per erase. $100\\,000 \\times 4 \\times 126 / 86\\,400 \\approx 583$ days, about 1.6 years.
- **NVS once a minute:** the same partition lasts about 96 years — longer than any product.
- **A log** appending 40-byte lines pays one erase per hundred lines or so.

These are ideal figures: levelling is not perfect and housekeeping copies data, so treat them as upper bounds.

### Rules that follow

- **Save when it settles.** Write a setting after it has stopped changing for a few seconds and only if it differs from what is stored, not on every tick of a knob.
- **Keep fast counters in RAM**, in RTC memory across deep sleep ([[rtc-memory]]), and write them out at intervals or before a planned restart.
- **Batch.** Write log lines in groups of ten or a hundred ([[logging-data]]).
- **Let the libraries do the levelling.** Raw writes to a partition in a loop have none.
- **Mind the cheap parts.** Relabelled or counterfeit flash can be worse than the datasheet ([[clones-and-counterfeits]]). SD cards level their own wear, and consumer cards give out first.

Wear is a design-time number. Estimate the writes per day for every thing the program saves, put them through the calculator, and make the product's life the winner by a wide margin.

> [!key] Flash survives about 100 000 erases per sector. Spread by NVS or a file system and written in batches or after a value settles, it outlasts the product; written in a fast loop it does not last a week. Do the sum for every value you save.`,
  ideas: [
    'A flash sector survives about 100 000 erases; reading costs nothing.',
    'Life is endurance times sectors times writes-per-erase, divided by writes per day.',
    'A counter saved every second to one sector fails within days; levelled by NVS it lasts about a year and a half; saved once a minute it lasts for ever.',
    'Save on change after it settles, batch the writes, and keep fast counters in RAM.'
  ],
  pitfalls: [
    'Wear levelling means I can write as often as I like — It stretches the life by the number of sectors and entries it uses, not to infinity. A write every second still adds up to tens of millions in a few years.',
    'Reading the flash also wears it — Only erasing and rewriting wears a sector. Read as often as you like.',
    'I will notice when the flash wears out — It rarely stops dramatically: bits flip, a file reads wrongly, a setting is lost after a power cut. Failures in the field look like random bugs.'
  ],
  terms: [
    { term: 'Endurance', also: ['erase cycles', 'program/erase cycles', 'P/E cycles'], def: 'The number of times a flash sector can be erased and rewritten before it is no longer guaranteed to keep data. About 100 000 for the flash chips on ESP modules.' },
    { term: 'Erase cycle', also: ['sector erase'], def: 'One erase of a flash sector (4 KB), which must happen before any bit in it can change from 0 back to 1. Each one uses up a little endurance.' },
    { term: 'Write amplification', also: ['housekeeping writes'], def: 'The extra erasing and copying that a file system or NVS does on top of what the program wrote, when it moves data to level the wear or to free pages.' },
    { term: 'Data retention', also: ['retention'], def: 'How long flash keeps its data without power: ten years or more when new, and less as a sector wears.' }
  ],
  choose: {
    good: ['Saving a setting once it has settled and changed', 'Saving a counter at intervals, or before a planned shutdown', 'Keeping fast counters in RAM or RTC memory'],
    avoid: ['Saving a value on every change of a knob or sensor', 'Appending one line at a time, every second, for years', 'Raw partition writes in a loop'],
    check: ['The writes per day of everything the program saves', 'The life that results, against the planned life of the product', 'What a power cut does to a value kept only in RAM']
  },
  formulas: [
    {
      name: 'Life of a flash store',
      expr: 'L = N * S * k / (W * 365)',
      tex: 'L = \\frac{N\\,S\\,k}{W \\cdot 365}',
      vars: {
        L: { name: 'life', q: 'years', unit: 'yr', tex: 'L' },
        N: { name: 'erase cycles per sector', q: 'count', value: 100000, min: 1, tex: 'N' },
        S: { name: 'sectors the writes are spread over', q: 'count', value: 4, min: 1, tex: 'S' },
        k: { name: 'writes paid for by one erase', q: 'count', value: 126, min: 1, tex: 'k' },
        W: { name: 'writes per day', q: 'count', value: 86400, min: 1, tex: 'W' }
      },
      solveFor: 'L',
      note: 'An ideal figure: housekeeping and imperfect levelling shorten it. For NVS take about four working pages of a 20 KB partition and k = 126; for a single sector written in place take S = 1 and k = 1.',
      stories: { L: 'Flash is rated for {N} erases per sector. The writes are spread over {S} sectors, one erase pays for {k} writes, and the program makes {W} writes a day. How many years does it last?', W: 'A store must last {L} with {N} erases per sector over {S} sectors and {k} writes per erase. How many writes a day can it take?' }
    }
  ],
  examples: [
    {
      title: 'A counter saved every second',
      q: 'A program saves a counter to NVS once a second. The 20 KB partition has four working pages and each erase pays for 126 writes. How long does it last, and how often may it save to last twenty years?',
      steps: ['One write a second is 86 400 a day. $L = 100\\,000 \\times 4 \\times 126 / (86\\,400 \\times 365) \\approx 1.6$ years.', 'The whole store takes $100\\,000 \\times 4 \\times 126 = 50\\,400\\,000$ writes. Spread over 20 years, 7300 days, that is $50\\,400\\,000 / 7300 \\approx 6\\,900$ writes a day.', 'That is one write every $86\\,400 / 6\\,900 \\approx 12$ seconds at most; saving once a minute leaves a wide margin.'],
      a: 'About 1.6 years as it is; at most about 6 900 writes a day (one every 12 s) for twenty years — in practice once a minute or on settling.'
    }
  ],
  code: [
    {
      title: 'Save a setting only once it has settled',
      about: 'A potentiometer sets a value from 0 to 127. The program saves it to flash only when it differs from the saved value and has stopped changing for five seconds, so turning the knob costs one write, not hundreds.',
      needs: 'An ESP32 DevKit, a potentiometer on GPIO34 (ADC1), and the serial monitor at 115200 baud.',
      wiring: [['GPIO34', 'potentiometer wiper'], ['3V3', 'potentiometer end'], ['GND', 'potentiometer end']],
      blocks: `
        when started
          start serial at (115200) baud
          set [saved v] to (load [setpoint] or (64))
          set [current v] to (saved)
          set [changedAt v] to (milliseconds since start)

        forever
          set [reading v] to (round (((analog read pin (34)) / (32))))
          if <(reading) ≠ (current)> then
            set [current v] to (reading)
            set [changedAt v] to (milliseconds since start)
          end
          if <<(current) ≠ (saved)> and <((milliseconds since start) - (changedAt)) ≥ (5000)>> then
            save (current) as [setpoint]
            set [saved v] to (current)
            print (join [saved setpoint ] (current))
          end
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        #include <Preferences.h>

        const int POT_PIN = 34;                              // a potentiometer on an ADC1 pin
        const uint32_t SETTLE_MS = 5000;

        Preferences prefs;
        int saved = 0;                                       // the value that is in flash
        int current = 0;
        uint32_t changedAt = 0;

        void setup() {
          Serial.begin(115200);
          prefs.begin("thermo", false);
          saved = prefs.getInt("setpoint", 64);
          current = saved;
          changedAt = millis();
        }

        void loop() {
          int reading = analogRead(POT_PIN) / 32;            // 0 to 127: coarse, so noise is not a change
          if (reading != current) {
            current = reading;
            changedAt = millis();
          }
          if (current != saved && millis() - changedAt >= SETTLE_MS) {
            prefs.putInt("setpoint", current);               // one write, after the knob has rested
            saved = current;
            Serial.printf("saved setpoint %d\n", current);
          }
          delay(20);
        }
      `,
      py: String.raw`
        import esp32, machine, time

        nvs = esp32.NVS("thermo")
        adc = machine.ADC(machine.Pin(34), atten=machine.ADC.ATTN_11DB)   # a potentiometer on GPIO34
        SETTLE_MS = 5000

        try:
            saved = nvs.get_i32("setpoint")                  # the value that is in flash
        except OSError:
            saved = 64
        current = saved
        changed_at = time.ticks_ms()

        while True:
            reading = adc.read_u16() >> 9                    # 0 to 127: coarse, so noise is not a change
            if reading != current:
                current = reading
                changed_at = time.ticks_ms()
            if current != saved and time.ticks_diff(time.ticks_ms(), changed_at) >= SETTLE_MS:
                nvs.set_i32("setpoint", current)             # one write, after the knob has rested
                nvs.commit()
                saved = current
                print("saved setpoint", current)
            time.sleep_ms(20)
      `,
      output: `
        saved setpoint 93
        saved setpoint 41
      `,
      notes: ['Turn the knob for ten seconds and leave it: one line appears, five seconds after the last movement.', 'If the board loses power during those five seconds the last movement is lost: that is the price of saving less often. Choose the settle time to match.', 'A knob that jitters between two adjacent values keeps resetting the timer; make the steps coarser or add a little hysteresis.']
    }
  ],
  quiz: [
    { q: 'A program saves a counter to a single flash sector, with no wear levelling, once per second. About how long until that sector reaches 100 000 erases?', choices: ['About a day', 'About a month', 'About three years', 'It never does'], a: 0, why: 'One erase a second is 86 400 a day, so 100 000 erases take 100 000 / 86 400, about 1.2 days.' },
    { q: 'Which change helps most?', choices: ['A faster upload speed', 'Saving the value only after it has settled and changed, at most once a minute', 'A longer key name', 'A delay(1) in loop()'], a: 1, why: 'Wear depends on the number of erases. Writing only changed, settled values cuts them by orders of magnitude.' },
    { q: 'Reading from flash wears it out as much as erasing does.', a: false, why: 'Only erasing and rewriting a sector uses up its endurance. Reads are free.' },
    { q: 'NVS puts 126 entries in a page. About how many writes of a small value does one erase of that page pay for?', choices: ['One', 'About 126', 'About 100 000', 'None: NVS erases on every write'], a: 1, why: 'A change is appended as a new entry; the page is erased only when all its entries are dead, so one erase serves about 126 writes.' }
  ],
  applications: [
    'Deciding how often a thermostat, a counter or a calibration may be saved.',
    'Estimating the life of a data logger before it is built.',
    'Explaining why a product failed after a year with "random" settings loss.',
    'Setting up a test that saves at a high rate to see how a design behaves, before the product ships.'
  ],
  sources: [
    'Datasheets of the SPI NOR flash chips used in ESP modules (for example the Winbond W25Q series): endurance and data retention.',
    'Espressif, *ESP-IDF Programming Guide*: "Non-Volatile Storage Library" (how entries and pages are managed) and the wear-levelling pages.',
    'The littlefs project, DESIGN.md: how the file system levels wear.'
  ],
  sim: 'ms-wear-life'
},

/* ================================================================ embedding files and web pages */
{
  id: 'embedding-files-and-web-pages',
  parent: 'memory-and-storage',
  title: 'Embedding files and web pages',
  level: 2,
  short: 'A device with a web interface needs its page, a display its fonts and icons. They can ride inside the program, as constants in flash, or live as files in the file system. Each way has costs for memory, for updates and for working offline.',
  keywords: ['embed', 'PROGMEM', 'raw string literal', 'rawliteral', 'index.html', 'web page in flash', 'serveStatic', 'streamFile', 'send_P', 'embed_txtfiles', 'EMBED_FILES', 'xxd', 'gzip', 'data folder', 'uploadfs', 'file system image', 'captive portal page'],
  prereq: ['littlefs-and-file-systems', 'partition-tables', 'web-server-on-esp'],
  related: ['soft-ap-and-captive-portal', 'ota-updates', 'images-and-icons', 'fonts', 'web-ui-as-a-display', 'web-interface-security', 'json-on-a-microcontroller'],
  body: `A device with a web interface needs its page; a display needs fonts and icons; a speaker needs its sound clips. Where should they live? There are two answers, and each has costs.

### Inside the program

A page or a picture can be a constant in the source: a long string in C++, a list of bytes for a binary file. It is built into the firmware, sits in flash with the code, and travels with every update. There is no file system to mount, nothing to forget to upload, and the page and the code that serves it can never disagree. The costs: every change to the page is a new build and a new upload, and the program grows by the size of the page.

In Arduino C++ the neat way is a raw string literal, \`R"rawliteral( … )rawliteral"\`, which needs no escaping of quotes. \`PROGMEM\` on its own does nothing on the ESP32, where constants already stay in flash and are read through the cache. What does cost RAM is turning the constant into a \`String\`: \`server.send(200, "text/html", PAGE)\` makes a temporary copy of the whole page, while \`send_P\`, or streaming the text, does not. Binary files become arrays of bytes with a tool such as \`xxd -i\`. PlatformIO and ESP-IDF can embed a file directly (\`board_build.embed_txtfiles\`, \`EMBED_TXTFILES\`) and hand you its start and end addresses.

### In the file system

Put the files in a folder named \`data\` next to the sketch and upload them as a **file-system image** ([[littlefs-and-file-systems]]). The program then opens and streams them, or serves a whole folder. The page can be changed without rebuilding the program, a user can replace it, and many files cost nothing extra in code. The costs: the partition, a mount at start-up, and one more thing to update. Beware that uploading an image replaces the *whole* partition, including files the device wrote itself; keep settings in [[nvs-and-preferences|NVS]].

MicroPython simply has files: \`main.py\` and \`index.html\` side by side, read in chunks and sent. A page held as a constant in a Python module takes heap when the module loads.

### Choosing

| | Embedded in the program | In the file system |
|---|---|---|
| Updates | with the firmware, one piece | separately, or with a new image |
| Memory | program space | the file-system partition |
| Many or large files | clumsy | natural |
| User-customisable | no | yes |

A small, stable page: embed it. Many files, pages that change often, or pages the user may change: use the file system. Either way **compress** with gzip (a page often shrinks to a quarter; browsers accept it with a \`Content-Encoding: gzip\` header), minify, and make the page self-contained: a device in access-point mode has no internet, so a link to a library on a CDN loads nothing ([[soft-ap-and-captive-portal]]).

> [!key] Embed a small, stable page in the program; keep many or changing files in the file system. Avoid copying a constant into a String, compress the page, and never depend on files from the internet.`,
  ideas: [
    'A page or file can be a constant inside the program or a file in the file system; embedding ties it to the firmware, the file system lets it change separately.',
    'On the ESP32 constants already live in flash, so PROGMEM changes nothing; copying one into a String costs RAM.',
    'An image upload replaces the whole file-system partition, including files the device wrote.',
    'Compress and inline the page: a device offline cannot fetch anything from a CDN.'
  ],
  pitfalls: [
    'PROGMEM saves RAM on the ESP32 as on an Uno — Constants already stay in flash there; the macro is for compatibility. The RAM is spent when the constant is copied into a String, as server.send with a String parameter does. Use send_P or stream it.',
    'A link to a CDN for the styling is harmless — A device in access-point mode has no internet, and a CDN can change or vanish. The page then arrives unstyled. Put the CSS and scripts in the page.',
    'Uploading the page only changes the page — Uploading a file-system image replaces the whole partition, including settings files and logs the device wrote. Keep settings in NVS or back them up first.'
  ],
  terms: [
    { term: 'PROGMEM', also: ['program memory', 'flash constant'], def: 'The Arduino marker for constants kept in flash instead of RAM. On the ESP32 all constants are already in flash, so it is accepted but changes nothing.' },
    { term: 'Raw string literal', also: ['R"(...)"', 'rawliteral'], def: 'A C++ string in which quotes, backslashes and line breaks need no escaping, written R"delimiter( ... )delimiter". The usual way to put an HTML page in the source.' },
    { term: 'Embedded file', also: ['EMBED_FILES', 'embed_txtfiles'], def: 'A file that the build system links into the program as a block of bytes, with symbols for its start and end, so no file system is needed to read it.' },
    { term: 'gzip', also: ['Content-Encoding: gzip', 'compressed page'], def: 'A compression format every browser understands. A page stored gzipped and sent with the matching header takes a fraction of the space and of the transfer time.' }
  ],
  choose: {
    good: ['Embedding a small, stable page: one build, one update', 'The file system for many files, or pages that change often or per user', 'gzip for the page, whichever way it is stored'],
    avoid: ['Embedding big images that change', 'Links to CDNs on a device that works offline', 'Overwriting the file system in the field without saving user data'],
    check: ['The size of the page against free program space or file-system space', 'Whether the page must update independently of the program', 'That the page works with no internet at all']
  },
  code: [
    {
      title: 'A web page inside the program',
      about: 'The ESP makes its own Wi-Fi network and serves a page held in the program: a button that toggles the LED. Join the network "esp32-page" and browse to 192.168.4.1.',
      needs: 'An ESP32 DevKit with an LED on GPIO2 and a phone or computer to join the Wi-Fi network.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          set [ledOn v] to <false>
          set [page v] to [an HTML page with a Toggle button]
          start access point [esp32-page] password [12345678] :: wifi
          start web server on port (80)

        when request for [/] arrives
          send (page) as [text/html]

        when request for [/toggle] arrives
          set [ledOn v] to <not <ledOn>>
          set pin (2) to (ledOn)
          send [] with status (204)
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>

        const int LED = 2;
        bool ledOn = false;

        // the page is a constant: it stays in flash with the program
        const char PAGE[] PROGMEM = R"rawliteral(
        <!doctype html>
        <html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>ESP32 lamp</title></head>
        <body><h1>ESP32 lamp</h1>
        <button onclick="fetch('/toggle')">Toggle the LED</button>
        </body></html>
        )rawliteral";

        WebServer server(80);

        void handleRoot() {
          server.send_P(200, "text/html", PAGE);             // send_P: no copy of the page into a String
        }

        void handleToggle() {
          ledOn = !ledOn;
          digitalWrite(LED, ledOn);
          server.send(204);                                  // no content
        }

        void setup() {
          pinMode(LED, OUTPUT);
          WiFi.softAP("esp32-page", "12345678");             // change the password; browse to 192.168.4.1
          server.on("/", handleRoot);
          server.on("/toggle", handleToggle);
          server.begin();
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import network, socket
        from machine import Pin

        led = Pin(2, Pin.OUT)

        # the page is a constant in the program: bytes, made once when the program is loaded
        PAGE = (b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n"
                b"<!doctype html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'>"
                b"<title>ESP32 lamp</title></head><body><h1>ESP32 lamp</h1>"
                b"<button onclick=\"fetch('/toggle')\">Toggle the LED</button></body></html>")

        ap = network.WLAN(network.WLAN.IF_AP)
        ap.config(ssid="esp32-page", password="12345678", security=network.WLAN.SEC_WPA2, max_clients=4)
        ap.active(True)                                      # change the password; browse to 192.168.4.1

        s = socket.socket()
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(("0.0.0.0", 80))
        s.listen(2)
        while True:
            client, addr = s.accept()
            request = client.recv(1024)
            if request.startswith(b"GET /toggle"):
                led.value(not led.value())
                client.send(b"HTTP/1.0 204 No Content\r\n\r\n")
            else:
                client.send(PAGE)
            client.close()
      `,
      notes: ['The password in the code is a placeholder: do not leave it in code you share ([[credentials-handling]]).', 'In MicroPython the constant lives on the heap once loaded; freezing the module into the firmware keeps it in flash. The Arduino version keeps the page in flash and sends it without copying.', 'Phones may ask whether to stay on a network without internet: say yes.']
    },
    {
      title: 'The same page from the file system',
      about: 'The page is a file, index.html, on the file system. The program streams it to the browser without ever holding the whole file in RAM, so the page can be replaced without rebuilding the program.',
      needs: 'The same board and network as before. Put the page of the first program in a file data/index.html next to the sketch and upload the file-system image (a plug-in of the IDE, or PlatformIO\'s uploadfs). In MicroPython copy index.html to the board.',
      blocks: `
        when started
          set pin (2) as [output v]
          set [ledOn v] to <false>
          mount the file system :: storage
          start access point [esp32-page] password [12345678] :: wifi
          start web server on port (80)

        when request for [/] arrives
          send file [/index.html] as [text/html] :: storage

        when request for [/toggle] arrives
          set [ledOn v] to <not <ledOn>>
          set pin (2) to (ledOn)
          send [] with status (204)
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>
        #include <LittleFS.h>

        const int LED = 2;
        bool ledOn = false;
        WebServer server(80);

        void handleRoot() {
          File f = LittleFS.open("/index.html", "r");
          if (!f) {
            server.send(404, "text/plain", "index.html is not on the file system");
            return;
          }
          server.streamFile(f, "text/html");                 // sent in pieces: the file is never held in RAM whole
          f.close();
        }

        void handleToggle() {
          ledOn = !ledOn;
          digitalWrite(LED, ledOn);
          server.send(204);
        }

        void setup() {
          pinMode(LED, OUTPUT);
          LittleFS.begin(true);
          WiFi.softAP("esp32-page", "12345678");             // change the password; browse to 192.168.4.1
          server.on("/", handleRoot);
          server.on("/toggle", handleToggle);
          server.begin();
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import network, socket
        from machine import Pin

        led = Pin(2, Pin.OUT)

        def send_file(client, name):
            client.send(b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n")
            with open(name, "rb") as f:
                while True:
                    chunk = f.read(512)                      # in pieces: the file is never held in RAM whole
                    if not chunk:
                        break
                    client.sendall(chunk)

        ap = network.WLAN(network.WLAN.IF_AP)
        ap.config(ssid="esp32-page", password="12345678", security=network.WLAN.SEC_WPA2, max_clients=4)
        ap.active(True)                                      # change the password; browse to 192.168.4.1

        s = socket.socket()
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(("0.0.0.0", 80))
        s.listen(2)
        while True:
            client, addr = s.accept()
            request = client.recv(1024)
            if request.startswith(b"GET /toggle"):
                led.value(not led.value())
                client.send(b"HTTP/1.0 204 No Content\r\n\r\n")
            else:
                send_file(client, "index.html")
            client.close()
      `,
      notes: ['An image upload replaces the whole file-system partition: files written by the device are lost. Keep settings in NVS.', 'The core\'s serveStatic can serve a whole folder; here the explicit handler shows what happens.', 'If the page is missing, the C++ version answers 404, and the MicroPython version stops with an error on the open.']
    }
  ],
  quiz: [
    { q: 'A page is embedded as a 24 KB constant and sent with server.send(200, "text/html", PAGE). What is the hidden cost?', choices: ['None', 'The constant is copied into a temporary String in RAM; send_P or streaming avoids that', 'The page is compressed', 'It needs LittleFS'], a: 1, why: 'send() takes a String, so the whole constant is copied into RAM for the call. send_P sends it from flash as it is.' },
    { q: 'Which is best for a page that the owner of the device should be able to customise without reflashing the program?', choices: ['A constant in the program', 'A file in the file system', 'A link to a CDN', 'A key in NVS'], a: 1, why: 'Files can be replaced on their own, by the user or through the device\'s own interface. A constant is part of the firmware.' },
    { q: 'Uploading a file-system image to update the page leaves the other files on the file system alone.', a: false, why: 'The image replaces the entire partition. Settings files and logs the device wrote are lost, unless they were backed up or kept in NVS.' },
    { q: 'A phone joins the access point of the device. The page loads its CSS from a CDN address. What does the phone show?', choices: ['The styled page', 'The page without its styling, because the access point has no internet', 'An error from the ESP', 'The CDN\'s own page'], a: 1, why: 'A soft access point is a network of its own, with no route to the internet. Anything the page needs must come from the device.' }
  ],
  applications: [
    'The setup portal that appears when a device has no Wi-Fi credentials yet ([[soft-ap-and-captive-portal]]).',
    'The control page of a lamp, a thermostat or a gateway, served from the device itself.',
    'Fonts, icons and images for a display, and sound clips for a speaker.',
    'A device that must work with no internet at all, such as a hut or a field station.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, API Guides: Build System, "Embedding Binary Data".',
    'PlatformIO documentation: the board_build.embed_txtfiles option and the file-system image upload.',
    'Arduino core for the ESP32 documentation: the WebServer and LittleFS libraries.'
  ]
}
);
