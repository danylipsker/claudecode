/* HYPER-ESP32 · content/updating-and-deploying.js
 *
 * Topic "Updating and deploying" (updating-and-deploying, branch idea-to-product): getting new firmware into devices that
 * are already out in the world and getting the first firmware into devices that are not yet — updates over the air, two
 * program slots and rollback, updating from a server, versions and releases, configuring a device in the field, factory
 * programming, production testing, the approvals a product needs, open-source licences, reliability in the field and
 * monitoring a fleet. Programs are written three ways (blocks, Arduino C++ on core 3.x, MicroPython 1.29), with ESP-IDF
 * where it teaches something. Approvals and licences are given in outline, "at the time of writing", and are not legal advice.
 * Simulations: sims/updating-and-deploying.js (ids ud-…).
 */
Hyper.add(
/* ================================================================ updates over the air */
{
  id: 'ota-updates',
  parent: 'updating-and-deploying',
  title: 'Updates over the air',
  level: 2,
  short: 'A device in a wall cannot be plugged into a laptop every time the program needs a fix. An update over the air sends the new program through the radio the device already has, and the device writes it into the flash itself — into the slot it is not running from.',
  keywords: ['OTA', 'over the air', 'ArduinoOTA', 'firmware update', 'push update', 'pull update', 'espota', 'firmware image', '.bin', 'update library', 'Update.h', 'wireless upload', 'remote update'],
  prereq: ['partition-tables', 'wifi-station', 'flashing-and-esptool'],
  related: ['ota-partitions-and-rollback', 'ota-from-a-server', 'secure-ota', 'brownout', 'nvs-and-preferences', 'web-flashing', 'fleet-monitoring'],
  body: `A device on a roof, in a wall or in a customer's kitchen cannot be plugged into your laptop every time the program needs a fix. An **update over the air** (OTA) sends the new program through the radio the device already has, and the device writes it into its own flash. Done badly, it is the commonest way to turn a working fleet into bricks.

### The trick: write somewhere else

A program cannot safely overwrite itself while it is running. So an OTA-capable flash keeps **two program slots** ([[partition-tables]]): the device runs from one, writes the new image into the other, checks it, and only then changes a small record in the \`otadata\` partition so that the other slot starts next time. If the power fails halfway, the record still names the old, complete program ([[ota-partitions-and-rollback]]). The simulation below cuts the power at any stage.

### Pushing and pulling

- **Push**: someone on the same network sends the image to the device. *ArduinoOTA* does this: the board announces itself on the local network, and the Arduino IDE or a script sends the sketch to it. The image is neither encrypted nor signed and only a password stands in the way, so it is a developer's tool, not a product's update path.
- **Pull**: the device asks a server whether a newer version exists and downloads it over HTTPS ([[ota-from-a-server]]). It scales to thousands of devices behind home routers, because the device opens every connection.

### What an update needs

- **Room.** The image must fit one slot (1280 KB in the default 4 MB scheme); "Huge APP" has no second slot.
- **Power.** The download takes seconds to minutes and writing flash draws more than idling. A cell that sags and browns out halfway wastes the update ([[brownout]]): refuse to start below a charge you have chosen.
- **Trust.** Whoever can send an image can run any code on the device. Use HTTPS to a server you control and, for a product, signed images ([[secure-ota]]).
- **A way back.** The new program must prove itself, or the old one returns.

Settings are safe: an update rewrites one program slot, not the saved settings ([[nvs-and-preferences]]), the file system, the bootloader or the partition table. Those change only by cable.

### The numbers

A 1.3 MB image is 10.5 million bits. At an effective 2 Mbit/s (plausible over HTTPS on a good link, less at the edge of range) that is about 5 seconds on the wire, plus the time to erase and write the flash. At 120 mA that costs 0.17 mAh. Cheap for a mains device, a real bite out of a coin cell.

> [!warn] Never leave a development update path (an ArduinoOTA password on a shared network, a debug upload page) in a product. Anyone who can reach it can replace the program.

> [!key] An update over the air writes the new program into the idle slot, checks it and switches a record; the running program is never touched. Push is for the bench, pull from an HTTPS server is for a fleet, and every update needs room, power, trust and a way back.`,
  ideas: [
    'The new image is written into the idle program slot while the old one keeps running; only then does a small record switch the slot.',
    'ArduinoOTA pushes a sketch from the IDE over the local network: a bench tool, protected only by a password.',
    'A pulling device asks an HTTPS server for a newer version, which is how a fleet is updated.',
    'An update needs room in a slot, enough power to finish, a source you trust and a way back to the old program.'
  ],
  pitfalls: [
    'An update over the air can change anything on the device — It replaces one program slot only. The bootloader, the partition table and the eFuses change by cable, and the saved settings and files stay as they are.',
    'If the power fails during an update the device is dead — With two slots the old program is still intact and the record still points at it. The device simply starts the old program and can try again.',
    'The ArduinoOTA password makes a product update safe — The password is a bench convenience: the image is not signed or encrypted. A product needs HTTPS and signed images.'
  ],
  terms: [
    { term: 'OTA', also: ['over-the-air update', 'FOTA', 'wireless update'], def: 'Replacing a device\'s program through its own radio link, with no cable. The device downloads the new image and writes it into flash itself.' },
    { term: 'Firmware image', also: ['firmware binary', 'app image', '.bin'], def: 'The file that holds the compiled program in the form the bootloader can run: a header, the code and data segments, and a checksum.' },
    { term: 'ArduinoOTA', also: ['espota', 'wireless upload'], def: 'A library that makes a board listen on the local network for a sketch sent by the Arduino IDE or the espota script, protected by an optional password.' },
    { term: 'Push update', def: 'An update that someone sends to the device from outside. It needs a route to the device, so it suits a bench or one local network.' },
    { term: 'Pull update', also: ['update check', 'polling for updates'], def: 'An update that the device fetches itself by asking a server whether a newer version exists. The device makes every connection, so it works behind any router.' }
  ],
  formulas: [
    {
      name: 'Time on the wire for an update',
      expr: 't = 8*n/R',
      tex: 't = \\frac{8\\,n}{R}',
      vars: {
        t: { name: 'time to download', q: 'time', unit: 's' },
        n: { name: 'image size in bytes', q: 'count', unit: '', value: 1310720, int: true },
        R: { name: 'effective throughput', q: 'datarate', unit: 'Mbit/s', value: 2 }
      },
      solveFor: 't',
      note: 'The download only: the flash must also be erased and written, and a TLS handshake comes first. A real update takes somewhat longer.',
      stories: { t: 'An image of {n} bytes arrives at an effective {R}. How long does the download take?' }
    },
    {
      name: 'Charge an update costs',
      expr: 'Q = I*t',
      tex: 'Q = I\\,t',
      vars: {
        Q: { name: 'charge drawn', q: 'charge', unit: 'mA·h' },
        I: { name: 'average current while updating', q: 'current', unit: 'mA', value: 120 },
        t: { name: 'time the update takes', q: 'time', unit: 's', value: 20 }
      },
      solveFor: 'Q',
      note: 'Compare with the cell\'s capacity: 0.7 mAh is a thousandth of a 700 mAh LiPo and a visible bite out of a coin cell, which also cannot supply 120 mA.',
      stories: { Q: 'The device draws {I} for {t} while it downloads and writes an update. What charge is that?' }
    }
  ],
  sim: 'ud-ota-slots',
  choose: {
    good: ['ArduinoOTA at the bench, on your own network, with a password', 'A pull update from an HTTPS server for devices in the field', 'Two equal program slots whenever the device will ever be updated'],
    avoid: ['ArduinoOTA in a shipped product', 'Starting an update on a weak battery', 'Updating over a link you cannot authenticate'],
    check: ['That the image fits one slot of your partition scheme', 'That the settings and files you need live in other partitions', 'What the device does if the power or the link fails mid-update']
  },
  code: [
    {
      title: 'Receive a sketch over the local network (ArduinoOTA)',
      about: 'Connects to Wi-Fi and listens for a new sketch from the Arduino IDE (it appears as a network port) or from the espota script. Progress and errors are printed. Upload the first copy by cable; later ones go through the air.',
      needs: 'An ESP32 DevKit, a Wi-Fi network and the serial monitor at 115200 baud. The computer must be on the same network.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          start OTA listener named [esp32-ota] with password [change-me] :: net

        forever
          handle OTA requests :: net
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <ArduinoOTA.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          while (WiFi.waitForConnectResult() != WL_CONNECTED) {
            Serial.println("no Wi-Fi, trying again");
            delay(5000);
            ESP.restart();
          }
          ArduinoOTA.setHostname("esp32-ota");
          ArduinoOTA.setPassword("change-me");               // asked for by the IDE before it sends anything
          ArduinoOTA
            .onStart([]() { Serial.println(ArduinoOTA.getCommand() == U_FLASH ? "start sketch" : "start file system"); })
            .onProgress([](unsigned int done, unsigned int total) { Serial.printf("%u%%\r", done / (total / 100)); })
            .onEnd([]() { Serial.println("\nOTA done"); })
            .onError([](ota_error_t e) { Serial.printf("OTA error %u\n", e); });
          ArduinoOTA.begin();
          Serial.println(WiFi.localIP());
        }

        void loop() {
          ArduinoOTA.handle();                               // must run often: it is the listener
        }
      `,
      na: { py: 'MicroPython has no ArduinoOTA receiver. Its Python files can be copied over Wi-Fi with WebREPL, and a new firmware needs the OTA build and the pull method of the next pages.' },
      output: `
        192.168.1.52
        start sketch
        100%
        OTA done
      `,
      notes: ['Do not leave the password in code that you share ([[credentials-handling]]). The password is checked, but the image itself travels unencrypted and unsigned: use this on a network you trust, as a bench tool.', 'The sketch must contain the OTA code itself. A sketch uploaded without it cannot be updated this way again, and has to go back on the cable.', 'The partition scheme must have two program slots: with Huge APP the upload fails.']
    }
  ],
  examples: [
    {
      title: 'What does one update cost a battery?',
      q: 'An image of 1 310 720 bytes arrives at an effective 2 Mbit/s over HTTPS. With the flash write and the TLS handshake the radio and the chip stay busy for 20 s at an average of 120 mA. Is that a problem for a 700 mAh LiPo? For a CR2032 of 225 mAh?',
      steps: [
        'The wire time is $t = 8n/R = 8 \\times 1\\,310\\,720 / 2\\,000\\,000 \\approx 5.2$ s; the busy time is 20 s.',
        'The charge is $Q = 120\\ \\mathrm{mA} \\times 20\\ \\mathrm{s} / 3600 = 0.67$ mAh.',
        'For the LiPo that is about 0.1 % of its capacity: nothing.',
        'For the coin cell it is 0.3 % of the capacity, but a CR2032 cannot deliver 120 mA without its voltage collapsing, so the update would brown out. A coin-cell device updates rarely, or not over Wi-Fi at all.'
      ],
      a: 'About 0.7 mAh per update: negligible for a LiPo; for a coin cell the capacity is not the problem but the current, which the cell cannot supply.'
    }
  ],
  quiz: [
    { q: 'Why does an OTA-capable flash keep two program slots?', choices: ['So that two programs can run at once', 'A program cannot overwrite itself while running: the update goes into the idle slot and the old one stays intact until the switch', 'To store a backup of the settings', 'Because the bootloader needs a spare copy of itself'], a: 1, why: 'The running program is read from flash while it executes, so it cannot be rewritten in place. A second slot lets the new image be written and checked first.' },
    { q: 'The power fails when the new image is 60 % written into the idle slot, before the record is switched. What happens at the next start?', choices: ['The device does not start', 'It starts the old program: the record still points at the complete slot', 'It starts the half-written program', 'It erases both slots'], a: 1, why: 'The record in otadata is changed only after the new image has been written and verified, so until then the old slot is the one that starts.' },
    { q: 'ArduinoOTA with a password is a good update path for a shipped product.', a: false, why: 'The password stops casual use, but the image is neither signed nor encrypted and the update is pushed from a computer. A product pulls signed images over HTTPS.' },
    { q: 'A device updates over the air. Which of these does the update leave as it was?', choices: ['The program in the running slot only', 'The saved settings in NVS and the file system', 'The partition table', 'The bootloader'], a: 1, why: 'An app update changes only the program slot (and the record that selects it). The settings and files live in their own partitions; the table and bootloader change by cable.' }
  ],
  applications: [
    'Fixing a bug in thousands of devices that sit in customers\' homes, without a visit.',
    'Uploading sketches to a board that is already screwed into its enclosure, from the bench.',
    'Adding a feature after sale, or changing a cloud address, by releasing a new image.',
    'Closing a security hole found after the product shipped ([[vulnerabilities-and-updates]]).'
  ],
  sources: [
    'ESP-IDF Programming Guide, *Over The Air Updates (OTA)*.',
    'Arduino-ESP32 documentation and the BasicOTA example of the ArduinoOTA library.',
    'MicroPython documentation, *esp32.Partition*.'
  ]
},

/* ================================================================ two app slots and rollback */
{
  id: 'ota-partitions-and-rollback',
  parent: 'updating-and-deploying',
  title: 'Two app slots and rollback',
  level: 3,
  short: 'The bootloader chooses a program slot from a small record in otadata. A new program starts on probation: it must confirm itself, or the next restart goes back to the old slot. That one rule is what keeps a bad update from stranding a device.',
  keywords: ['otadata', 'rollback', 'app rollback', 'ota_0', 'ota_1', 'factory app', 'pending verify', 'mark valid', 'esp_ota_mark_app_valid_cancel_rollback', 'esp_ota_mark_app_invalid_rollback_and_reboot', 'ESP_OTA_IMG_NEW', 'self-test', 'CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE', 'brick', 'boot loop', 'verifyRollbackLater'],
  prereq: ['ota-updates', 'partition-tables', 'the-rom-bootloader'],
  related: ['secure-ota', 'watchdogs', 'reset-reasons', 'reliability-in-the-field', 'ota-from-a-server', 'boot-modes-and-download-mode', 'error-states-and-recovery'],
  body: `The update path of [[ota-updates]] has one more piece, and it is the one that matters when something goes wrong: **who decides which slot starts, and what happens if the new program is bad.**

### The otadata record

The \`otadata\` partition (8 KB) is two 4 KB sectors. Each can hold one small record: a **sequence number**, the **state** of the image and a checksum. At every start the bootloader reads both, discards a record whose checksum is wrong, and takes the one with the higher sequence number. The slot is the sequence number minus one, modulo the number of OTA slots, so successive updates alternate between \`ota_0\` and \`ota_1\`. A new record goes into the sector that is not the current one, so a power cut while it is being written leaves a bad checksum, and the bootloader falls back to the older record. The switch is atomic by construction. If neither record is valid — the partition was erased — the bootloader starts the **factory** app if the table has one, else \`ota_0\` (the Arduino \`boot_app0\` file is exactly such a blank record, [[flashing-and-esptool]]).

### On probation

A correct image can still be a bad program: it starts, and then crashes, hangs or cannot reach the network. With **app rollback** switched on in the bootloader (the option \`CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE\`), a freshly written image gets the state **new**. At the next start the bootloader changes it to **pending verify** and runs it. From then on:

1. the program does its self-test and calls \`esp_ota_mark_app_valid_cancel_rollback()\`: the state becomes **valid**, and the program stays;
2. or the program decides it is broken and calls \`esp_ota_mark_app_invalid_rollback_and_reboot()\`;
3. or it resets before confirming — a crash, a watchdog, a power cut. The bootloader sees *pending verify* again, marks the image **aborted** and starts the previous slot.

### What the self-test should prove

The test belongs to your product, not to the chip. Booting is not enough: confirm only after what the device is *for* works — connected to Wi-Fi, reached the update server, read its sensors, ran some minutes without a watchdog reset. A program that confirms in its first line protects against a crash at start and against nothing else. A program that waits for the server can strand itself when the server is down, so give the test a deadline and keep the result honest.

### Costs and alternatives

Two equal slots halve the room for one program. A small **factory** app (a rescue image that only connects and downloads) plus one large OTA slot is the other layout. MicroPython's stock image has neither: its OTA build variant adds two slots. The opposite protection is **anti-rollback** — refusing to go *back* to an old, vulnerable version; the two work together ([[secure-ota]]).

> [!key] otadata names the slot to start; a new image runs on probation and goes back to the old slot unless it confirms itself. Make the confirmation depend on what the product is for, not just on starting.`,
  ideas: [
    'Two 4 KB records in otadata, each with a sequence number and a checksum, name the slot to start; the higher valid one wins.',
    'A new image starts as pending verify; a reset before it is marked valid sends the bootloader back to the previous slot.',
    'Confirm only after the self-test: connected, server reached, sensors read, running for a few minutes.',
    'Rollback needs the bootloader option switched on; a factory app is the alternative to a second slot.'
  ],
  pitfalls: [
    'Rollback happens when the new program cannot start — It happens when the program resets before confirming. A program that starts, loses the network and sits there never resets, so its self-test must check the network before confirming.',
    'Calling mark-valid in the first line of setup is the safe choice — Then a crash after that line, or a lost server, is never undone. Confirm after the checks that matter.',
    'Rollback is on in every build — It is a bootloader option. A program that calls the functions on a bootloader without it gets an error (-261 in MicroPython) and no protection.'
  ],
  terms: [
    { term: 'otadata', also: ['OTA data partition'], def: 'An 8 KB partition of two sectors, each holding a record with a sequence number, the state of an image and a checksum. The bootloader uses it to choose the program slot to start.' },
    { term: 'App rollback', also: ['automatic rollback', 'rollback'], def: 'A bootloader feature: a new image starts on probation, and if it resets before being marked valid the bootloader returns to the previous program.' },
    { term: 'Pending verify', also: ['ESP_OTA_IMG_PENDING_VERIFY'], def: 'The state of a new image on its first run. It must be marked valid by the program, or marked invalid, before the next reset.' },
    { term: 'Factory app', also: ['factory partition'], def: 'An optional program partition outside the OTA slots. The bootloader starts it when otadata holds no valid record; it can be a minimal rescue image.' },
    { term: 'Self-test', also: ['probation check'], def: 'The checks a new program makes before it confirms itself: the things the product must be able to do, such as joining Wi-Fi or reaching its server.' }
  ],
  sim: [{ id: 'ud-ota-slots', params: { mode: 'rollback' } }, 'ud-rollback'],
  choose: {
    good: ['Rollback enabled in every product that updates itself', 'A confirmation that waits for the network, the server and a few minutes of running', 'A factory rescue app where flash is too small for two slots'],
    avoid: ['Confirming in the first line of the program', 'A self-test that can never fail', 'Rollback on a bootloader built without it, assumed to work'],
    check: ['That the bootloader option is on: read the image state from a test update', 'That the watchdog is on, so a hang becomes a reset and then a rollback', 'That a deliberately bad image really goes back, before you ship']
  },
  code: [
    {
      title: 'Confirm a new program only after a self-test',
      about: 'On its first run an updated program is on probation. This one tries to join Wi-Fi for 20 seconds. If it succeeds it confirms itself; if not it gives up, and the old program comes back.',
      needs: 'An ESP32 DevKit with an OTA partition scheme and rollback enabled in the bootloader, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          if <this program is on probation :: storage> then
            connect to Wi-Fi [your-ssid] password [your-password]
            set [t0 v] to (milliseconds since start)
            repeat until <<Wi-Fi connected?> or <((milliseconds since start) - (t0)) > (20000)>>
              wait (0.2) seconds
            end
            if <Wi-Fi connected?> then
              mark this program as good :: storage
              print [self-test passed: confirmed]
            else
              mark this program as bad and restart :: storage
            end
          else
            print [nothing to confirm]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include "esp_ota_ops.h"

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        bool verifyRollbackLater() { return true; }          // tell the core not to confirm for us at start-up

        bool selfTest() {                                    // the real checks of your product go here
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 20000) delay(200);
          return WiFi.status() == WL_CONNECTED;
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          esp_ota_img_states_t state;
          const esp_partition_t *running = esp_ota_get_running_partition();
          if (esp_ota_get_state_partition(running, &state) == ESP_OK && state == ESP_OTA_IMG_PENDING_VERIFY) {
            if (selfTest()) {
              esp_ota_mark_app_valid_cancel_rollback();
              Serial.println("self-test passed: confirmed");
            } else {
              Serial.println("self-test failed: going back");
              esp_ota_mark_app_invalid_rollback_and_reboot();
            }
          } else {
            Serial.println("nothing to confirm");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time, machine
        from esp32 import Partition

        def self_test():                                     # the real checks of your product go here
            wlan = network.WLAN(network.WLAN.IF_STA)
            wlan.active(True)
            wlan.connect("your-ssid", "your-password")
            t0 = time.ticks_ms()
            while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 20000:
                time.sleep_ms(200)
            return wlan.isconnected()

        if self_test():
            try:
                Partition.mark_app_valid_cancel_rollback()
                print("self-test passed: confirmed")
            except OSError:
                print("nothing to confirm: rollback is not enabled in this firmware")
        else:
            print("self-test failed: not confirming, the restart goes back")
            machine.reset()                                  # a reset before confirming is the rollback
      `,
      idf: String.raw`
        #include "esp_ota_ops.h"
        #include "esp_log.h"

        // menuconfig: Bootloader config -> Enable app rollback support (CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE=y)
        static bool self_test(void);                         // your product's checks

        void app_main(void) {
            esp_ota_img_states_t state;
            const esp_partition_t *running = esp_ota_get_running_partition();
            if (esp_ota_get_state_partition(running, &state) == ESP_OK && state == ESP_OTA_IMG_PENDING_VERIFY) {
                if (self_test()) {
                    esp_ota_mark_app_valid_cancel_rollback();
                    ESP_LOGI("ota", "confirmed");
                } else {
                    esp_ota_mark_app_invalid_rollback_and_reboot();   // does not return
                }
            }
        }
      `,
      output: `
        self-test passed: confirmed
      `,
      notes: ['In the Arduino core the program is confirmed for you before setup() unless the sketch defines verifyRollbackLater() to return true. Whether the bootloader of your core version has rollback switched on is worth testing: run this program after an update and read which message appears.', 'If rollback is not enabled in the bootloader, MicroPython raises OSError(-261) from the confirm call, which the program above reports.', 'Add the watchdog ([[watchdogs]]) so that a hang becomes a reset, and the reset becomes a rollback.']
    }
  ],
  examples: [
    {
      title: 'Four updates, which slot?',
      q: 'A device has slots ota_0 and ota_1, and a freshly flashed otadata that selects ota_0 with sequence number 1. Three over-the-air updates follow, each confirmed. Which slot runs after each one, and what are the sequence numbers?',
      steps: [
        'The slot is $(\\text{seq} - 1) \\bmod 2$. At sequence 1 that is slot 0, \`ota_0\`.',
        'Update 1 is written into the idle slot, \`ota_1\`, and the new record gets sequence 2: $(2-1) \\bmod 2 = 1$, so \`ota_1\` runs.',
        'Update 2 goes into \`ota_0\`, sequence 3: $(3-1) \\bmod 2 = 0$.',
        'Update 3 goes into \`ota_1\`, sequence 4: slot 1. Each update alternates the slot and raises the sequence.'
      ],
      a: 'ota_1, ota_0, ota_1, with sequence numbers 2, 3 and 4: the slots alternate and the highest valid sequence wins.'
    }
  ],
  quiz: [
    { q: 'An updated program starts, joins Wi-Fi, and then its main task hangs for ever with no watchdog running. With rollback enabled, what happens?', choices: ['The bootloader rolls back after a minute', 'Nothing: the program has not reset, so it stays on probation indefinitely', 'The update is marked valid automatically', 'The device erases the new slot'], a: 1, why: 'Rollback is triggered by a reset before confirmation. Without a watchdog a hang never resets; the device sits there on probation. The watchdog turns the hang into a reset, and so into a rollback.' },
    { q: 'Where is the best place in a program to call esp_ota_mark_app_valid_cancel_rollback()?', choices: ['The first line of setup()', 'Inside the bootloader', 'After the checks that prove the product works: network up, server reached, sensors read', 'Before the update is downloaded'], a: 2, why: 'Confirming early protects only against a crash before that line. Confirming after the product\'s own checks makes the rollback cover the faults that matter.' },
    { q: 'What does the bootloader do when both records in otadata have a wrong checksum?', choices: ['It refuses to start', 'It starts the factory app if there is one, otherwise ota_0', 'It starts ota_1', 'It repairs the records'], a: 1, why: 'With no valid record the bootloader falls back: the factory partition if the table has one, else the first OTA slot. That is why a blank otadata (boot_app0) selects app0.' },
    { q: 'A power cut occurs while the new otadata record is being written. The record is half written. What is the effect?', choices: ['The device is bricked', 'The half-written record fails its checksum and is ignored: the old record, in the other sector, still decides', 'The new slot starts anyway', 'The bootloader reflashes itself'], a: 1, why: 'The two sectors alternate, so the old record is untouched while the new one is written. A damaged record is discarded by its checksum.' }
  ],
  applications: [
    'Any consumer device that updates itself while its owner is away: the rollback is what makes that acceptable.',
    'A fleet release that turns out to break the Wi-Fi setup on one hardware variant: those devices return to the old version by themselves.',
    'A bench test that deliberately flashes a crashing image to prove that the rollback works before a release.'
  ],
  sources: [
    'ESP-IDF Programming Guide, *Over The Air Updates (OTA)*, the sections on app rollback and on the OTA data partition.',
    'ESP-IDF Programming Guide, *Bootloader* and *Partition Tables*.',
    'MicroPython documentation, *esp32.Partition*, including mark_app_valid_cancel_rollback.'
  ]
},

/* ================================================================ updating from a server */
{
  id: 'ota-from-a-server',
  parent: 'updating-and-deploying',
  title: 'Updating from a server',
  level: 3,
  short: 'A fleet updates by pulling: every few hours each device asks a web server what version it should run, and if that differs from its own it streams the new image into the idle slot, checks it and restarts. The server can be two static files.',
  keywords: ['HTTPUpdate', 'httpUpdate', 'esp_https_ota', 'update server', 'manifest', 'latest.txt', 'firmware.bin', 'HTTPS update', 'pull update', 'polling', 'jitter', 'ETag', 'thundering herd', 'CA bundle', 'streaming download', 'writeblocks', 'get_next_update', 'set_boot'],
  prereq: ['ota-updates', 'https-and-tls', 'http-client'],
  related: ['ota-partitions-and-rollback', 'secure-ota', 'ntp-and-time', 'certificates-and-root-cas', 'versioning-and-releases', 'fleet-monitoring', 'store-and-forward'],
  body: `A fleet cannot be pushed to: the devices sit behind other people's routers and nobody can reach them. So they **pull**. Every few hours each device opens a connection to your update server, asks what it should be running, and if the answer differs from what it is running, it fetches the new image.

### The exchange

1. **Ask.** The device downloads a small *manifest*: at its simplest a text file holding the current version, in a real product a JSON file with the version, the image's address, its size, a SHA-256 digest, the oldest version allowed to upgrade and the hardware it fits.
2. **Decide.** It compares the version with its own ([[versioning-and-releases]]) and checks it is a good moment: enough battery, a stable connection, no heater cycle or irrigation in progress.
3. **Stream.** It downloads the image in small blocks, writing each into the idle slot as it arrives and feeding a running SHA-256. A 1.3 MB image never fits in RAM at once, and need not.
4. **Check.** It compares the size and digest with the manifest, or verifies a signature ([[secure-ota]]), then sets the new slot to boot and restarts.
5. **Prove and report.** The new program runs its self-test, confirms itself ([[ota-partitions-and-rollback]]) and tells the server which version it now runs.

### The server

Any static HTTPS host will do: object storage, a content network, a repository's release page, a small server of your own. For a small fleet it is two files: \`latest.txt\` and one image per version. Per-device decisions (only some devices get the new version yet) need a manifest that depends on the device's id: see the roll-out simulation below and [[fleet-monitoring]].

### Trust

Use HTTPS and check the server's certificate against a **root** certificate or the built-in bundle, never against the leaf certificate, which is replaced every few months ([[certificates-and-root-cas]]). Certificate checks need the right date, so set the clock from NTP before the first request ([[ntp-and-time]]). A digest in the manifest only helps if the manifest itself is trusted; a **signature** made with a key that never leaves your build machine is what protects the fleet if the server is hacked. MicroPython's \`requests\` does not verify certificates at all, so with it the connection is only as trustworthy as the network.

### Polite polling

Ten thousand devices that all check at midnight attack your own server. Add a random **jitter** to every interval, back off after an error instead of retrying at once, and honour a \`Retry-After\` header. A conditional request (\`If-None-Match\` with the manifest's ETag) answers 304 with no body when nothing changed. A TLS session needs tens of kilobytes of heap: check it first.

> [!key] A device pulls a manifest, compares versions, streams the image into the idle slot, checks its size, digest or signature, restarts, and confirms. Authenticate the server with a root certificate and the right clock, sign the images, and spread the polling with jitter.`,
  ideas: [
    'Devices pull: they ask a server for a manifest every few hours, so they work behind any router.',
    'The image is streamed in blocks into the idle slot and hashed on the fly; it never has to fit in RAM.',
    'HTTPS needs a root certificate and a correct clock; a signed image protects the fleet even if the server is compromised.',
    'Jitter and back-off keep thousands of devices from hammering the server together.'
  ],
  pitfalls: [
    'A SHA-256 in the manifest makes the update secure — Only if the manifest is authentic. An attacker who can replace the image can replace the hash. A signature made offline is what proves who built it.',
    'Everyone may check at midnight, it is only a small file — Ten thousand devices on the same second is a spike your server may not survive. Add random jitter to every interval.',
    'The update server\'s certificate can be pinned exactly — A leaf certificate is replaced every few months, and every pinned device stops updating the day it changes. Check against the root, or the bundle.'
  ],
  terms: [
    { term: 'Update manifest', also: ['version file', 'update descriptor'], def: 'A small file on the update server that says what a device should run: the version, the image\'s address, size and digest, and the hardware it fits.' },
    { term: 'Streaming download', def: 'Writing an image to flash block by block as it arrives, instead of holding it in RAM, so that an image larger than the memory can be installed.' },
    { term: 'Jitter', also: ['random delay', 'staggered polling'], def: 'A random amount added to a check interval so that a fleet of devices spreads its requests over time instead of arriving together.' },
    { term: 'Thundering herd', also: ['request spike'], def: 'Many devices contacting a server at the same moment, for example after an outage or at midnight, and overloading it.' },
    { term: 'ETag', also: ['conditional request', 'If-None-Match'], def: 'An identifier the server attaches to a file. A device that sends it back with its next request gets a short 304 answer, with no body, if the file has not changed.' }
  ],
  formulas: [
    {
      name: 'Average load on the update server',
      expr: 'r = N/T',
      tex: 'r = \\frac{N}{T}',
      vars: {
        r: { name: 'average requests per second', q: 'rate', unit: '1/s' },
        N: { name: 'devices', q: 'count', unit: '', value: 20000, int: true },
        T: { name: 'check interval', q: 'time', unit: 'h', value: 6 }
      },
      solveFor: 'r',
      note: 'The average only: without jitter, all devices that were switched on together (after an outage, for example) ask in the same seconds, and the peak is far higher.',
      stories: { r: '{N} devices each check for an update every {T}. How many requests a second does the server get on average?' }
    }
  ],
  sim: ['ud-fleet-rollout', 'ud-version-compare'],
  choose: {
    good: ['A pull update over HTTPS, with a signed image, for any fleet', 'A manifest that depends on the device, to roll out in rings', 'Jitter, back-off and conditional requests, from the first release'],
    avoid: ['Plain HTTP for images', 'setInsecure() or an unverified connection in a product', 'Checking all at the same time, or retrying instantly after an error'],
    check: ['That the clock is right before the first HTTPS request', 'That the free heap allows a TLS session and the update buffer', 'That a failed or interrupted download leaves the old program running']
  },
  code: [
    {
      title: 'Check a server for a new version and update',
      about: 'Reads latest.txt from an update server; if it names a version other than the running one, downloads firmware-<version>.bin over HTTPS into the idle slot and restarts. The server names the version a device should run, so a different version means step forward, or back.',
      needs: 'An ESP32 DevKit (OTA partition scheme), Wi-Fi, and a web server that holds latest.txt and the image files. MicroPython needs the OTA build variant.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          set [current v] to [1.2.0]
          check for update :: my

        every (21600) seconds
          check for update :: my

        define check for update
          set [latest v] to (http get [https://updates.example.com/sensor/latest.txt])
          if <not <(latest) = (current)>> then
            print (join [version offered: ] (latest))
            download and install (join [https://updates.example.com/sensor/firmware-] (join (latest) [.bin])) then restart :: cloud
          else
            print [up to date]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <HTTPUpdate.h>
        #include <NetworkClientSecure.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *FIRMWARE_VERSION = "1.2.0";
        const char *BASE = "https://updates.example.com/sensor/";    // latest.txt and firmware-<version>.bin live here
        const uint32_t CHECK_EVERY_MS = 6UL * 3600UL * 1000UL;

        const char ROOT_CA[] = R"EOF(
        -----BEGIN CERTIFICATE-----
        (paste the root certificate of your update server here)
        -----END CERTIFICATE-----
        )EOF";

        String latestVersion() {
          NetworkClientSecure client;
          client.setCACert(ROOT_CA);                                  // verifies the server; needs the right date
          HTTPClient http;
          String v = "";
          if (http.begin(client, String(BASE) + "latest.txt")) {
            if (http.GET() == HTTP_CODE_OK) v = http.getString();
            http.end();
          }
          v.trim();
          return v;
        }

        void checkForUpdate() {
          String latest = latestVersion();
          if (latest.length() == 0 || latest == FIRMWARE_VERSION) {
            Serial.println("up to date (or the server could not be reached)");
            return;
          }
          Serial.printf("version %s offered, running %s\n", latest.c_str(), FIRMWARE_VERSION);
          NetworkClientSecure client;
          client.setCACert(ROOT_CA);
          httpUpdate.rebootOnUpdate(true);                            // restarts by itself after a good update
          t_httpUpdate_return r = httpUpdate.update(client, String(BASE) + "firmware-" + latest + ".bin");
          if (r == HTTP_UPDATE_FAILED) Serial.println(httpUpdate.getLastErrorString());
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");                           // certificate checks need the right date
          while (time(nullptr) < 1700000000) delay(200);
          Serial.printf("running %s\n", FIRMWARE_VERSION);
          checkForUpdate();
        }

        void loop() {
          static uint32_t last = millis();
          if (millis() - last >= CHECK_EVERY_MS) {
            last = millis();
            checkForUpdate();
          }
          delay(1000);
        }
      `,
      py: String.raw`
        import network, time, machine, requests, ntptime
        from esp32 import Partition

        VERSION = "1.2.0"
        BASE = "https://updates.example.com/sensor/"      # latest.txt and firmware-<version>.bin live here
        BLOCK = 4096                                       # the size of one flash sector

        def check_for_update():
            r = requests.get(BASE + "latest.txt", timeout=10)
            latest = r.text.strip() if r.status_code == 200 else ""
            r.close()
            if not latest or latest == VERSION:
                print("up to date (or the server could not be reached)")
                return
            print("version", latest, "offered, running", VERSION)
            idle = Partition(Partition.RUNNING).get_next_update()     # the other slot; needs the OTA build
            r = requests.get(BASE + "firmware-" + latest + ".bin", stream=True, timeout=30)
            buf = bytearray(BLOCK)
            view = memoryview(buf)
            block = 0
            while True:
                got = 0
                while got < BLOCK:
                    n = r.raw.readinto(view[got:])
                    if not n:
                        break
                    got += n
                if got == 0:
                    break
                if got < BLOCK:
                    buf[got:] = b"\xff" * (BLOCK - got)       # pad the last block with erased-flash bytes
                idle.writeblocks(block, buf)
                block += 1
                if got < BLOCK:
                    break
            r.close()
            idle.set_boot()
            machine.reset()

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        ntptime.settime()                                  # the right date, as the C++ version needs
        print("running", VERSION)
        check_for_update()
        while True:
            time.sleep(6 * 3600)
            check_for_update()
      `,
      idf: String.raw`
        #include "esp_https_ota.h"
        #include "esp_http_client.h"
        #include "esp_crt_bundle.h"
        #include "esp_system.h"
        #include "esp_log.h"

        // downloads the image, writes the idle slot, verifies it and sets it to boot
        esp_err_t update_from(const char *url) {
            esp_http_client_config_t http = {
                .url = url,
                .crt_bundle_attach = esp_crt_bundle_attach,   // check the server against the built-in root bundle
            };
            esp_https_ota_config_t ota = { .http_config = &http };
            esp_err_t err = esp_https_ota(&ota);
            if (err == ESP_OK) {
                esp_restart();
            }
            return err;
        }

        void app_main(void) {
            // start NVS, the network interface and Wi-Fi first, and set the clock; then:
            if (update_from("https://updates.example.com/sensor/firmware-1.3.0.bin") != ESP_OK) {
                ESP_LOGE("ota", "update failed, the old program keeps running");
            }
        }
      `,
      output: `
        running 1.2.0
        version 1.3.0 offered, running 1.2.0
      `,
      notes: ['MicroPython\'s requests does not verify the server\'s certificate and does not read chunked replies: serve the image with a Content-Length, use this on a network you trust, and for a product use the ssl module with certificate checking and a signed image. After the restart the new program must confirm itself ([[ota-partitions-and-rollback]]).', 'The bootloader checks the image\'s own checksum; a digest from the manifest, or better a signature, checks that it is the file you published ([[secure-ota]]).', 'The example checks every six hours exactly. A fleet adds a random delay to each interval.']
    }
  ],
  examples: [
    {
      title: 'Twenty thousand devices and one midnight',
      q: 'A product checks for updates every 6 hours. There are 20 000 devices. After a power cut they all restart at the same moment and check at once; each request answers in 0.2 s. What is the average load, and what is the problem after the power cut?',
      steps: [
        'The average is $r = N/T = 20\\,000 / (6 \\times 3600\\ \\mathrm{s}) \\approx 0.93$ requests per second: trivial.',
        'After the power cut all 20 000 ask in the same few seconds. Served one at a time at 0.2 s each, the last one waits over an hour; a server that handles ten requests at once still needs 400 s.',
        'A random delay of up to an hour at start-up spreads 20 000 requests over 3600 s: about 5.6 a second.',
        'A conditional request makes each answer tiny; back-off after an error stops a failing server from being hit harder.'
      ],
      a: 'About one request a second on average, but a power cut turns that into a spike of 20 000 within seconds, which jitter spreads out to about 6 a second.'
    }
  ],
  quiz: [
    { q: 'Why does a fleet of devices pull updates instead of having them pushed?', choices: ['Pulling is faster', 'The devices sit behind other people\'s routers, so only the device can open the connection', 'Pushing is not possible over Wi-Fi', 'A pull needs no server'], a: 1, why: 'A device behind a home router cannot be reached from outside, but it can always connect out. Pulling therefore works anywhere.' },
    { q: 'A manifest on the server holds the SHA-256 of the image. An attacker who has hacked the server replaces both. What stops the fleet installing the new image?', choices: ['The hash', 'HTTPS', 'Nothing: only a signature checked against a public key inside the device would', 'The partition table'], a: 2, why: 'The hash and the image come from the same place. A signature made with a key that never leaves your build machine, and checked against a public key in the device, is what breaks the chain.' },
    { q: 'You pin the update server\'s leaf certificate in the device. What goes wrong?', choices: ['Nothing', 'When the certificate is renewed, every device stops being able to reach the server and cannot be updated to fix it', 'The download becomes slower', 'The image is no longer signed'], a: 1, why: 'Leaf certificates are replaced every few months. A device that trusts only the old one can never talk to the server again; trust the root, or the bundle.' },
    { q: 'The first HTTPS request fails at every start-up on a device with no battery-backed clock. What is the likeliest cause?', choices: ['The certificate check needs the date, and the device still thinks it is 1970 or 2000', 'The server is down', 'The partition scheme is wrong', 'The manifest is too long'], a: 0, why: 'A certificate is valid between two dates. Without the right clock every certificate looks expired or not yet valid, so set the time from NTP first.' }
  ],
  applications: [
    'A smart-home device that checks a vendor server every few hours and updates overnight.',
    'A sensor network whose gateway fetches new firmware once and hands it to its battery nodes.',
    'A product release that goes to ten per cent of the fleet first, then to everyone ([[fleet-monitoring]]).',
    'Rolling back a bad release by changing one line in latest.txt.'
  ],
  sources: [
    'ESP-IDF Programming Guide, *ESP HTTPS OTA* (esp_https_ota) and *ESP x509 Certificate Bundle*.',
    'Arduino-ESP32 documentation and examples of the HTTPUpdate and NetworkClientSecure libraries.',
    'RFC 9110, HTTP Semantics (conditional requests, ETag, Retry-After).'
  ]
},

/* ================================================================ versions and releases */
{
  id: 'versioning-and-releases',
  parent: 'updating-and-deploying',
  title: 'Versions and releases',
  level: 2,
  short: 'A version number lets a human say what runs, lets a device decide whether an update is newer, and lets you find the exact source and symbols behind a crash from the field. Compare it field by field, never as text; and keep every release you ship.',
  keywords: ['semantic versioning', 'semver', 'version number', 'release', 'changelog', 'release channel', 'git tag', 'build number', 'version compare', 'stable beta', 'pre-release', 'hardware revision', 'elf file', 'map file', 'reproducible build', 'PROJECT_VER', 'esp_app_desc_t'],
  prereq: ['ota-updates', 'ota-from-a-server'],
  related: ['device-configuration', 'secure-ota', 'documentation', 'core-dumps-and-field-diagnostics', 'vulnerabilities-and-updates', 'fleet-monitoring', 'readable-code'],
  body: `A version number does three jobs. It tells a person what is running. It lets a device decide whether the one on the server is newer. And it lets you, a year later, find the exact source and the exact build behind a crash report from a device you cannot touch.

### Semantic versions

The common scheme is **MAJOR.MINOR.PATCH**:

- **PATCH** — a bug fix; nothing a user or the cloud can notice changes.
- **MINOR** — a new feature that keeps everything old working: same settings, same protocol.
- **MAJOR** — something that breaks: the settings are laid out differently, the cloud message changed.

A *pre-release* such as \`2.0.0-rc.1\` sorts **before** 2.0.0; a *build* suffix such as \`+build5\` does not count in the ordering. Compare the numbers **field by field, as numbers**. As text, "1.10.0" sorts before "1.9.0" because the character "1" is smaller than "9". Packing the three numbers into one integer, say \`major × 10000 + minor × 100 + patch\`, fails the day the minor reaches 100: 1.100.0 becomes 20000, the same as 2.0.0. Give each field its own bits, or compare fields.

### Where the version lives

In the program, as one constant set in one place (an ESP-IDF project keeps its version in the application descriptor, an Arduino sketch in a constant of your own). The device prints it at start, includes it in every report to the cloud ([[fleet-monitoring]]) and compares it with the manifest. Version the *hardware* too: an image built for board revision B can break revision A, so the manifest names the hardware it fits.

### What a release is

A release is not "the file on my laptop". It is a tag in version control, an image built from exactly that tag in a clean build, and a folder you keep for ever:

- the \`.bin\` that went out and its SHA-256;
- the \`.elf\` with symbols and the \`.map\`: without them a backtrace or core dump from the field is a list of numbers ([[core-dumps-and-field-diagnostics]]);
- the bootloader and partition table it was built with;
- a **changelog** written for the user, saying what changed and what to watch;
- the **channel** it went to: *stable* for everyone, *beta* for volunteers, *dev* for the bench.

### Compatibility

Three things must agree with the version: the hardware revision, the layout of the saved settings ([[device-configuration]]) and the cloud protocol. Plan upgrade paths: a device on 1.0 may need 1.9, which can read the old settings, before 2.0, which no longer can. Downgrades need thought too, because an older program meets settings written by a newer one. A separate **security version** that only goes up (anti-rollback, [[secure-ota]]) is not the same number as the release version.

> [!key] Number releases MAJOR.MINOR.PATCH, compare them field by field as numbers, and keep the binary, the ELF and the changelog of everything you ship. The version in the device ties a crash back to its exact source.`,
  ideas: [
    'MAJOR changes break something, MINOR adds features compatibly, PATCH only fixes.',
    'Compare versions field by field as numbers: as text 1.10.0 sorts before 1.9.0.',
    'A release is a tag, a clean build, and a kept folder: .bin, .elf, .map, bootloader, table, changelog.',
    'The hardware revision, the settings layout and the cloud protocol must all agree with the version.'
  ],
  pitfalls: [
    'A version string can be compared as text — Characters compare one by one, so 1.10.0 is "smaller" than 1.9.0. Split into numbers and compare each.',
    'Packing the version into one number is fine — Two digits per field overflow at 100: 1.100.0 equals 2.0.0. Use wider fields or compare the fields.',
    'I can rebuild an old release from the source when I need it — A different compiler, library or date gives a different binary, and its symbols no longer match the one in the field. Keep the ELF of every release you ship.'
  ],
  terms: [
    { term: 'Semantic versioning', also: ['semver', 'MAJOR.MINOR.PATCH'], def: 'A version scheme of three numbers: patch for fixes, minor for compatible new features, major for changes that break. Pre-release labels sort before the release.' },
    { term: 'Release channel', also: ['update channel', 'stable', 'beta'], def: 'A named stream of versions a device follows, such as stable for everyone and beta for volunteers. The server hands each channel its own latest version.' },
    { term: 'Changelog', also: ['release notes'], def: 'A written list of what changed in each version, for the people who use it: new features, fixes and anything to watch when updating.' },
    { term: 'ELF file', also: ['symbols', '.elf', 'map file'], def: 'The build output that keeps the names of functions and variables. A crash report from the field gives addresses; the ELF of the exact release turns them into names.' },
    { term: 'Anti-rollback version', also: ['security version'], def: 'A number, separate from the release version, that only goes up and is burned into the chip so that it refuses older, vulnerable images.' }
  ],
  sim: 'ud-version-compare',
  choose: {
    good: ['MAJOR.MINOR.PATCH, compared as numbers', 'One version constant, printed at start and sent with every report', 'A kept folder per release: bin, ELF, map, changelog'],
    avoid: ['Comparing versions as text', 'Releases built from "whatever is on my laptop"', 'Dropping the ELF of an image that is in the field'],
    check: ['That the manifest names the hardware revision the image fits', 'That the oldest supported version can still reach the newest one', 'That a downgrade meets settings it can read, or leaves them alone']
  },
  code: [
    {
      title: 'Is the offered version newer?',
      about: 'Compares a version offered by a server with the running one, field by field as numbers, and shows beside it what a plain text comparison would have said. The text answer is wrong for 1.10.0 against 1.9.0.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define check (offered) against (running)
          set [pa v] to (split (offered) at [.])
          set [pb v] to (split (running) at [.])
          set [newer v] to [no]
          set [i v] to (1)
          repeat until <<(i) > (3)> or <not <(item (i) of [pa v]) = (item (i) of [pb v])>>>
            change [i v] by (1)
          end
          if <<(i) < (4)> and <(item (i) of [pa v]) > (item (i) of [pb v])>> then
            set [newer v] to [yes]
          end
          print (join [offered ] (join (offered) (join [ running ] (join (running) (join [ -> update: ] (newer))))))

        when started
          start serial at (115200) baud
          check [1.10.0] against [1.9.0] :: my
          check [1.2.3] against [1.2.3] :: my
          check [2.0.0] against [1.99.99] :: my
          check [1.4.0] against [1.10.0] :: my
      `,
      cpp: String.raw`
        // does version a come after version b?  Both look like "1.10.2".
        bool isNewer(const char *a, const char *b) {
          int pa[3] = {0, 0, 0}, pb[3] = {0, 0, 0};
          sscanf(a, "%d.%d.%d", &pa[0], &pa[1], &pa[2]);
          sscanf(b, "%d.%d.%d", &pb[0], &pb[1], &pb[2]);
          for (int i = 0; i < 3; i++) {
            if (pa[i] != pb[i]) return pa[i] > pb[i];       // the first field that differs decides
          }
          return false;                                        // equal
        }

        void check(const char *offered, const char *running) {
          Serial.printf("offered %-8s running %-8s -> %-6s (text order says: %s)\n", offered, running,
                        isNewer(offered, running) ? "update" : "keep",
                        strcmp(offered, running) > 0 ? "newer" : "not newer");
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          check("1.10.0", "1.9.0");
          check("1.2.3", "1.2.3");
          check("2.0.0", "1.99.99");
          check("1.4.0", "1.10.0");
        }

        void loop() {}
      `,
      py: String.raw`
        def parse(v):
            return tuple(int(x) for x in v.split("-")[0].split("."))     # "1.10.2" -> (1, 10, 2)

        def check(offered, running):
            newer = parse(offered) > parse(running)         # tuples compare field by field
            text = offered > running                        # the wrong way: compares characters
            print("offered %-8s running %-8s -> %-6s (text order says: %s)" % (
                offered, running, "update" if newer else "keep", "newer" if text else "not newer"))

        check("1.10.0", "1.9.0")
        check("1.2.3", "1.2.3")
        check("2.0.0", "1.99.99")
        check("1.4.0", "1.10.0")
      `,
      output: `
        offered 1.10.0   running 1.9.0    -> update (text order says: not newer)
        offered 1.2.3    running 1.2.3    -> keep   (text order says: not newer)
        offered 2.0.0    running 1.99.99  -> update (text order says: newer)
        offered 1.4.0    running 1.10.0   -> keep   (text order says: newer)
      `,
      notes: ['These versions have three numbers and no pre-release label: "2.0.0-rc.1" is read as 2.0.0 here. A product that ships release candidates has to rank the label as well, as semantic versioning does.', 'The server of the previous page names the version a device should run, so "different" is enough there. "Newer" is the rule when the device decides for itself.']
    }
  ],
  examples: [
    {
      title: 'The day the minor reaches 100',
      q: 'A device packs its version as major × 10000 + minor × 100 + patch. Release 1.99.0 is out. The next minor release is 1.100.0, and later 2.0.0 follows. What does the device think?',
      steps: [
        '1.99.0 packs to $1 \\times 10000 + 99 \\times 100 + 0 = 19900$.',
        '1.100.0 packs to $10000 + 10000 + 0 = 20000$.',
        '2.0.0 packs to $2 \\times 10000 = 20000$: the same number as 1.100.0.',
        'A device on 1.100.0 is told that 2.0.0 is not newer, and never takes the major release. Comparing field by field avoids it, or give each field 8 or 16 bits.'
      ],
      a: '1.100.0 and 2.0.0 both pack to 20000, so the device never sees 2.0.0 as an update. Compare the fields as numbers.'
    }
  ],
  quiz: [
    { q: 'Which of these is greater, as a semantic version: 1.10.0 or 1.9.0?', choices: ['1.9.0, because 9 is greater than 1', '1.10.0, because 10 is greater than 9 in the minor field', 'They are equal', 'It cannot be decided'], a: 1, why: 'Compare the minor fields as numbers: 10 > 9. As text the character 1 comes before 9, which is why strings must not be compared.' },
    { q: 'Where in the ordering does 2.0.0-rc.1 stand?', choices: ['After 2.0.0', 'Before 2.0.0 and after 1.99.99', 'Equal to 2.0.0', 'Before 1.0.0'], a: 1, why: 'A pre-release label ranks below the release it leads to but above every earlier version.' },
    { q: 'A device in the field crashes and sends a backtrace of addresses. What do you need to turn it into function names?', choices: ['The .bin that you sent', 'The ELF file of exactly that release', 'The newest source code', 'The partition table'], a: 1, why: 'Only the ELF built together with that image holds the symbols for those addresses. A rebuild may place the code elsewhere.' },
    { q: 'A change in how settings are saved, with old settings no longer readable, should raise which number?', choices: ['PATCH', 'MINOR', 'MAJOR', 'None'], a: 2, why: 'It breaks compatibility with data and devices already out there, which is what the major number is for.' }
  ],
  applications: [
    'The "firmware version" line of a device\'s settings page or label, which support asks for first.',
    'A fleet dashboard that shows how many devices run each version ([[fleet-monitoring]]).',
    'Decoding a crash report from a customer\'s unit with the ELF kept from that release.',
    'Beta and stable channels, so volunteers test a release before it reaches everyone.'
  ],
  sources: [
    'Semantic Versioning 2.0.0, the specification at semver.org.',
    'ESP-IDF Programming Guide, *App Image Format* (the application description with the project version).',
    'ESP-IDF Programming Guide, *Fatal Errors* and *Core Dump*, for decoding a crash with its ELF.'
  ]
},

/* ================================================================ configuration in the field */
{
  id: 'device-configuration',
  parent: 'updating-and-deploying',
  title: 'Configuring a device in the field',
  level: 2,
  short: 'Settings that change after the device is built — Wi-Fi, names, thresholds, calibration — live apart from the program, in layers: defaults compiled in, saved settings in NVS, remote overrides on top. A version number on the saved settings lets a new program migrate an old layout.',
  keywords: ['configuration', 'settings', 'NVS', 'Preferences', 'defaults', 'factory reset', 'schema version', 'migration', 'config', 'remote configuration', 'validation', 'setup portal', 'provisioning', 'settings migration'],
  prereq: ['nvs-and-preferences', 'ota-updates', 'wifi-provisioning'],
  related: ['versioning-and-releases', 'factory-programming', 'soft-ap-and-captive-portal', 'flash-wear', 'device-shadows-and-twins', 'credentials-handling', 'secure-provisioning'],
  body: `A device is built once and configured many times: the Wi-Fi password of its owner, its name, the temperature it should hold, a calibration measured on the bench. If those values live in the program, every change is an update; if they live apart, an update and a setting can change independently. That separation, and a plan for how settings evolve, is most of what "configuring in the field" means.

### Three layers

1. **Defaults**, compiled into the program: always valid, so a device works out of the box and after a reset.
2. **Saved settings**, in NVS or a file ([[nvs-and-preferences]]): what the owner or installer changed. They survive restarts and updates, because an update replaces only the program slot.
3. **Remote overrides** from an app or a server ([[device-shadows-and-twins]]): often temporary, sometimes not stored at all.

A value is looked up top down: override, then saved, then default. A missing key is not an error; it is the default.

### How a person changes them

Through a setup page the device serves from its own access point ([[soft-ap-and-captive-portal]]), through Bluetooth provisioning ([[wifi-provisioning]]), a web page on the local network, a command over MQTT, a button gesture. Whatever the route, every change goes through **one validation function** with real limits, so a typo cannot set a heater to 400 °C or a report interval to zero.

### Saved settings need a version

The layout of the settings changes as the product grows: a key is renamed, a unit changes from seconds to milliseconds, a new setting appears. Save a **schema version** beside the settings. At start the program reads it and, if it is older, **migrates**: converts the values, fills new keys with defaults, writes the new version. If it is *newer* than the program understands (after a downgrade), leave the settings alone and use defaults rather than overwrite what a later program will need. Keys and namespaces are at most 15 characters.

### Reset and risk

A **factory reset** erases the settings namespace, not the whole NVS: the serial number and device certificate written in the factory live apart ([[factory-programming]]). Do not export secrets in a backup of the settings. And never let a remote setting strand the device: apply a new Wi-Fi network, test it, and fall back to the old one if the connection fails within a minute.

> [!key] Keep defaults in the program, saved settings in NVS and overrides on top; validate every change in one place; version the saved settings and migrate them at start. A remote setting must never be able to cut the device off.`,
  ideas: [
    'Settings live apart from the program, so an update and a setting can change independently.',
    'Look a value up top down: remote override, saved setting, compiled default; a missing key means the default.',
    'One validation function with real limits guards every route by which a setting can arrive.',
    'A schema version on the saved settings lets a new program migrate an old layout, and leave a newer one alone.'
  ],
  pitfalls: [
    'A factory reset should erase the whole NVS — That also destroys the serial number and the device certificate written in the factory. Erase only the settings namespace.',
    'A new setting only needs a new key — An older layout may already hold the key with another meaning or unit. Version the layout and migrate, or the first update corrupts the settings.',
    'Whatever the owner typed is valid — A mistyped value can stop the device working or cut it off. Validate every value, and test a new Wi-Fi network before dropping the old one.'
  ],
  terms: [
    { term: 'Schema version', also: ['settings version', 'config version'], def: 'A number saved with the settings that says which layout they use, so a new program knows whether it must convert them.' },
    { term: 'Settings migration', also: ['config migration'], def: 'Converting saved settings from an older layout to the current one at start-up: renaming keys, changing units, adding defaults, and writing the new version.' },
    { term: 'Default value', also: ['factory default'], def: 'The value the program uses when a setting has not been saved. Defaults are compiled in and must always be valid.' },
    { term: 'Factory reset', also: ['reset to defaults'], def: 'Erasing the owner\'s saved settings so the device starts as new, while keeping the data written in the factory such as the serial number and certificates.' },
    { term: 'Remote override', also: ['remote configuration'], def: 'A setting sent from a server or an app that takes precedence over the saved one, sometimes only for a limited time.' }
  ],
  choose: {
    good: ['Defaults in the program, saved settings in NVS, overrides on top', 'A schema version and a migration at every start', 'One validation function behind every way to set a value'],
    avoid: ['Settings compiled into the program, changed by update only', 'A factory reset that wipes factory data', 'A remote setting that can lock the device out of its network'],
    check: ['That an old settings layout migrates correctly, tested from every earlier version', 'That a downgrade does not corrupt settings of a newer layout', 'That secrets are not exported or logged']
  },
  code: [
    {
      title: 'Settings with a version, and a migration',
      about: 'Loads a report interval from NVS. Version 1 of the program saved it in seconds; version 2 keeps it in milliseconds. At start the program reads the layout version, migrates old settings, writes the defaults on a first start, and falls back to the default if a value is out of range.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define load settings
          set [ver v] to (load [ver] with default (0))
          if <(ver) = (1)> then
            save ((load [interval] with default (60)) * (1000)) as [interval_ms]
            forget [interval] :: storage
            save (2) as [ver]
            print [settings migrated from version 1]
          else if <(ver) = (0)> then
            save (60000) as [interval_ms]
            save (2) as [ver]
          end
          set [ms v] to (load [interval_ms] with default (60000))
          if <<(ms) < (1000)> or <(ms) > (3600000)>> then
            set [ms v] to (60000)
          end

        when started
          start serial at (115200) baud
          if <(load [ver] with default (0)) = (0)> then
            save (1) as [ver]
            save (30) as [interval]
          end
          load settings :: my
          print (join [interval ms: ] (ms))
      `,
      cpp: String.raw`
        #include <Preferences.h>

        Preferences prefs;
        uint32_t intervalMs;

        void loadConfig() {
          prefs.begin("cfg", false);                        // namespace of at most 15 characters
          int ver = prefs.getInt("ver", 0);                 // 0: nothing saved yet
          if (ver == 1) {                                   // version 1 kept the interval in seconds
            prefs.putInt("interval_ms", prefs.getInt("interval", 60) * 1000);
            prefs.remove("interval");
            prefs.putInt("ver", 2);
            Serial.println("settings migrated from version 1");
          } else if (ver == 0) {                            // first start: write the defaults
            prefs.putInt("interval_ms", 60000);
            prefs.putInt("ver", 2);
          }
          int ms = prefs.getInt("interval_ms", 60000);
          if (ms < 1000 || ms > 3600000) ms = 60000;        // out of range: use the default
          intervalMs = ms;
          prefs.end();
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          prefs.begin("cfg", false);                        // demo: pretend program version 1 ran here before
          if (prefs.getInt("ver", 0) == 0) {
            prefs.putInt("ver", 1);
            prefs.putInt("interval", 30);
          }
          prefs.end();
          loadConfig();
          Serial.printf("interval %u ms\n", (unsigned)intervalMs);
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32

        nvs = esp32.NVS("cfg")                              # namespace of at most 15 characters

        def get(key, default):
            try:
                return nvs.get_i32(key)
            except OSError:
                return default                              # a missing key means the default

        def load_config():
            ver = get("ver", 0)                             # 0: nothing saved yet
            if ver == 1:                                    # version 1 kept the interval in seconds
                nvs.set_i32("interval_ms", get("interval", 60) * 1000)
                nvs.erase_key("interval")
                nvs.set_i32("ver", 2)
                nvs.commit()
                print("settings migrated from version 1")
            elif ver == 0:                                  # first start: write the defaults
                nvs.set_i32("interval_ms", 60000)
                nvs.set_i32("ver", 2)
                nvs.commit()
            ms = get("interval_ms", 60000)
            return ms if 1000 <= ms <= 3600000 else 60000   # out of range: use the default

        if get("ver", 0) == 0:                              # demo: pretend program version 1 ran here before
            nvs.set_i32("ver", 1)
            nvs.set_i32("interval", 30)
            nvs.commit()
        interval_ms = load_config()
        print("interval", interval_ms, "ms")
      `,
      output: `
        settings migrated from version 1
        interval 30000 ms
      `,
      notes: ['The first run prints the migration, because the demo plants a version 1 record; every later run prints only the interval. Remove the demo lines in a real program.', 'A version above 2 (a later program saved it, then this one was installed) falls through to the range check here. A product decides explicitly: leave the settings untouched and use defaults.', 'NVS is for settings that change rarely. A counter that changes every minute belongs elsewhere ([[flash-wear]]).']
    }
  ],
  examples: [
    {
      title: 'Migrating a unit',
      q: 'Version 1 stored interval = 45 (seconds). Version 2 stores interval_ms and must reject anything below 1 s or above 1 h. A device with the old record is updated, and its owner later types 0.2 s. What does each step produce?',
      steps: [
        'At the first start of version 2 the layout version is 1, so the program writes $45 \\times 1000 = 45\\,000$ ms to \`interval_ms\`, erases \`interval\` and writes version 2.',
        'Later starts see version 2 and read 45 000 ms; the range 1000 to 3 600 000 ms holds, so it is used as it is.',
        'The owner types 0.2 s, which is 200 ms. The validation function rejects it (below 1000 ms) and keeps 45 000.',
        'Had a corrupt value reached NVS anyway, the range check at load falls back to the 60 000 ms default.'
      ],
      a: 'The record becomes 45 000 ms in layout version 2; the 200 ms entry is refused, and a corrupt stored value would fall back to 60 000 ms.'
    }
  ],
  quiz: [
    { q: 'Program version 3 reads settings saved by version 1. What makes a correct migration possible?', choices: ['The flash is erased by the update', 'A schema version saved with the settings, so version 3 knows the layout is old', 'The key names are the same in every version', 'The bootloader converts them'], a: 1, why: 'Without a version the program must guess which layout it is looking at. With one it can run exactly the conversions that apply.' },
    { q: 'A factory reset should delete which data?', choices: ['The whole NVS partition', 'The owner\'s settings namespace only, leaving the serial number and device certificate', 'The program slot', 'The bootloader'], a: 1, why: 'Erasing everything would destroy what the factory wrote, which the customer cannot restore. Erase the settings only.' },
    { q: 'After a downgrade the older program finds a settings version newer than it knows. The safest action is to rewrite them in its own layout.', a: false, why: 'Rewriting would destroy values a later program needs. Leave them untouched and use defaults, or refuse to proceed.' },
    { q: 'A remote command changes the Wi-Fi network. How should the device apply it?', choices: ['At once, dropping the old network', 'Connect to the new network, and fall back to the old one if that fails within a time limit', 'Store it and apply at the next update', 'Ignore it'], a: 1, why: 'A mistyped password must not cut the device off from the only way to correct it. Test first, with a way back.' }
  ],
  applications: [
    'A thermostat that keeps its set point, schedule and Wi-Fi through every update.',
    'A sensor whose per-unit calibration is stored once on the bench and migrated through every release.',
    'A fleet where a support engineer changes the reporting interval of one device from a console.',
    'A "hold the button for ten seconds" reset that gives a device to a new owner clean.'
  ],
  sources: [
    'Arduino-ESP32 documentation, *Preferences*.',
    'MicroPython documentation, *esp32.NVS*.',
    'ESP-IDF Programming Guide, *Non-volatile Storage Library*.'
  ]
},

/* ================================================================ programming in the factory */
{
  id: 'factory-programming',
  parent: 'updating-and-deploying',
  title: 'Programming in the factory',
  level: 3,
  short: 'Everything before this page assumed a device already running your program. In production someone must put the first one there, ten times or ten thousand, and give each unit what only it can have: a serial number, keys, a certificate. The slowest station sets the pace.',
  keywords: ['factory programming', 'production', 'jig', 'pogo pins', 'bed of nails', 'merged binary', 'gang programmer', 'nvs_partition_gen', 'serial number', 'provisioning', 'per-device data', 'traceability', 'pre-flashed module', 'eFuse', 'esptool', 'production line', 'test pads'],
  prereq: ['flashing-and-esptool', 'boot-modes-and-download-mode', 'nvs-and-preferences'],
  related: ['production-testing', 'secure-provisioning', 'device-identity-and-provisioning', 'efuses', 'secure-boot', 'flash-encryption', 'disabling-debug-interfaces', 'pcb-layout-for-modules', 'device-configuration'],
  body: `Everything so far assumed a device that already runs your program. In production somebody has to put the first one there — ten times or ten thousand — and give each unit what only it can have: a serial number, perhaps keys and a certificate. What works for ten does not work for ten thousand, and the slowest step sets the pace.

### Getting the first image in

- **By cable** with esptool or the IDE: right for a handful ([[flashing-and-esptool]]).
- **A production jig**: a fixture with spring-loaded **pogo pins** that touch test pads on the board (TX, RX, EN, the boot pin, 3.3 V, ground). The jig powers the board, pulls the boot pin low and resets it into download mode ([[boot-modes-and-download-mode]]), then runs esptool. The pads must be on the PCB: design them in ([[pcb-layout-for-modules]]).
- **Several at once**: a gang of jigs on a USB hub flashes in parallel; flash time barely grows.
- **Pre-flashed modules**: some module makers and distributors will flash your image before shipping. Ask; it saves handling, usually for a minimum quantity.

### What goes in

One **merged binary** per unit: bootloader, partition table, the otadata starter, the program, and the unit's own data written in one go. The MAC address is already burned into the chip, so do not invent one; add a **serial number**, the calibration values, the hardware revision, and per-device keys or a certificate if the cloud needs them ([[device-identity-and-provisioning]], [[secure-provisioning]]). A simple way is a settings namespace of its own in NVS, built per unit from a CSV by the \`nvs_partition_gen\` tool of ESP-IDF, so that a factory reset ([[device-configuration]]) never touches it.

~~~sh
python nvs_partition_gen.py generate unit1042.csv nvs1042.bin 0x5000
esptool --chip esp32 merge-bin -o unit1042.bin 0x1000 bootloader.bin 0x8000 partitions.bin 0x9000 nvs1042.bin 0xe000 boot_app0.bin 0x10000 app.bin
esptool --chip esp32 --port COM3 --baud 921600 write-flash 0x1000 unit1042.bin
~~~

The eFuse settings (secure boot, flash encryption, closed debug ports) come last, after the unit has passed its test, and only after a trial run on spare units: an eFuse burns once ([[efuses]], [[secure-boot]]).

### The pace of the line

On a UART the wire time is about ten bits a byte: 1.3 MB at 921 600 baud is 14 seconds at most, and esptool compresses, so often less; add a few seconds for reset and verification. Stations in series run at the speed of the slowest: find it, then add jigs there. Log every unit (serial, MAC, program hash, result, time) so that a faulty batch can be traced.

> [!warn] A jig powers the board from its own low-voltage supply. Never program a board that is also connected to mains, and burn eFuses only on units you can afford to lose.

> [!key] Per unit, build one merged image that holds the program and that unit's own data, flash it through a jig with pogo pins, then test it. The line runs at the speed of its slowest station, and every unit is logged.`,
  ideas: [
    'A jig with pogo pins on test pads powers, resets and programs the board in seconds, and the pads must be designed into the PCB.',
    'One merged binary per unit carries the program and that unit\'s serial number, calibration and keys.',
    'The MAC address is burned into the chip already; the serial number and keys are yours to add, in their own namespace or partition.',
    'Stations in series run at the pace of the slowest, so add parallel jigs at that one; and log every unit.'
  ],
  pitfalls: [
    'I can burn the eFuses first, to be safe — They burn once. Test the unit first, and rehearse on spare units, because a wrong burn cannot be undone.',
    'Faster flashing speeds up the line — Only if flashing is the slowest station. Often the test or the manual handling is, and extra jigs there help more.',
    'A factory reset can wipe the whole NVS — That deletes the serial number and certificate written in the factory. Keep them in a namespace the reset does not erase.'
  ],
  terms: [
    { term: 'Pogo pin', also: ['spring probe', 'test pad', 'bed of nails'], def: 'A spring-loaded contact in a jig that presses on a test pad of the board, so that the board can be powered, programmed and measured without soldering anything.' },
    { term: 'Production jig', also: ['fixture', 'test fixture'], def: 'A holder with pogo pins, a power supply and control electronics that programs and tests a board in seconds, the same way every time.' },
    { term: 'Per-unit data', also: ['provisioning data', 'serial number'], def: 'The values only one device has: its serial number, calibration constants, keys and certificate. They are written in the factory, apart from the program.' },
    { term: 'Traceability', also: ['lot record', 'unit log'], def: 'A record of each unit\'s serial number, program hash, test results and date, so that a fault found later can be traced to a batch and a cause.' },
    { term: 'Gang programming', also: ['parallel flashing'], def: 'Programming several devices at the same time on several ports or jigs. The total time barely grows with the number of units.' }
  ],
  formulas: [
    {
      name: 'Speed of a production station',
      expr: 'r = p*3600/c',
      tex: 'r = \\frac{3600\\,p}{c}',
      vars: {
        r: { name: 'units per hour', q: 'rate', unit: '1/h' },
        p: { name: 'units handled in parallel', q: 'count', unit: '', value: 4, int: true },
        c: { name: 'cycle time of one unit', q: 'time', unit: 's', value: 28 }
      },
      solveFor: 'r',
      note: 'The line runs at the smallest r of its stations: add positions at the slowest one, not everywhere.',
      stories: { r: 'A flashing station handles {p} boards at once and each takes {c}. How many units an hour can it do?' }
    }
  ],
  sim: { id: 'ud-production-line', params: { focus: 'flash' } },
  choose: {
    good: ['A jig with pogo pins for anything beyond a few dozen units', 'One merged image per unit, with its data inside', 'Eight or ten parallel positions where flashing is the bottleneck'],
    avoid: ['Flashing by hand with a cable for a batch', 'Burning eFuses before the unit has passed', 'Putting a serial number into the program itself'],
    check: ['That the PCB has the test pads and the jig can reach EN and the boot pin', 'Which station is the slowest, before buying a faster programmer', 'That every unit\'s serial, MAC and program hash are logged']
  },
  code: [
    {
      title: 'Print the line for the product label',
      about: 'Reads the serial number the factory wrote into NVS, the MAC address, the firmware version and the flash size, and prints one LABEL line that a jig or a label printer can pick up. The same line proves at the end of the line that the right data went into the right unit.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. Factory data in the NVS namespace "factory" (key "serial", a 32-bit number).',
      blocks: `
        when started
          start serial at (115200) baud
          set [serial v] to (load [serial] with default (0))
          print (join [LABEL SN] (join (serial) (join [ MAC ] (join (MAC address) (join [ FW 1.2.0 FLASH ] (join (flash size in KB) [ KB]))))))
      `,
      cpp: String.raw`
        #include <Preferences.h>
        #include "esp_mac.h"

        const char *FIRMWARE_VERSION = "1.2.0";

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Preferences factory;
          factory.begin("factory", true);                     // read-only: written by the production line
          int serial = factory.getInt("serial", 0);           // 0 means: nothing was written
          factory.end();
          uint8_t mac[6];
          esp_read_mac(mac, ESP_MAC_WIFI_STA);                // burned into the chip at Espressif
          Serial.printf("LABEL SN%06d MAC %02X:%02X:%02X:%02X:%02X:%02X FW %s FLASH %u KB\n", serial,
                        mac[0], mac[1], mac[2], mac[3], mac[4], mac[5],
                        FIRMWARE_VERSION, (unsigned)(ESP.getFlashChipSize() / 1024));
        }

        void loop() {}
      `,
      py: String.raw`
        import esp, esp32, machine

        FIRMWARE_VERSION = "1.2.0"

        nvs = esp32.NVS("factory")
        try:
            serial = nvs.get_i32("serial")                   # written by the production line
        except OSError:
            serial = 0                                       # 0 means: nothing was written
        mac = ":".join("%02X" % b for b in machine.unique_id())    # the base MAC, burned into the chip
        print("LABEL SN%06d MAC %s FW %s FLASH %d KB" % (serial, mac, FIRMWARE_VERSION, esp.flash_size() // 1024))
      `,
      output: `
        LABEL SN001042 MAC 24:6F:28:12:34:56 FW 1.2.0 FLASH 4096 KB
      `,
      notes: ['An unprogrammed unit prints SN000000: a test that rejects it catches a unit that skipped the data step.', 'The serial is a 32-bit integer so that all three languages read it the same way; a text serial is stored as a string in C++ and as a blob in MicroPython, which cannot read each other\'s.', 'The CSV for the generator is: key,type,encoding,value, then a row "factory,namespace,," and a row "serial,data,i32,1042".']
    }
  ],
  examples: [
    {
      title: 'Which station to speed up?',
      q: 'A line has four stations. Loading by hand: 6 s a unit, one position. Flashing: 28 s, 4 positions. Test: 20 s, 2 positions. Labelling: 7 s, one position. What is the line speed, and what should be improved?',
      steps: [
        'Speed of each station, $r = 3600\\,p / c$: loading $3600/6 = 600$ an hour; flashing $3600 \\times 4/28 \\approx 514$; test $3600 \\times 2/20 = 360$; labelling $3600/7 \\approx 514$.',
        'The line runs at the smallest: 360 units an hour, set by the test.',
        'Faster flashing would change nothing. Adding a third test position gives $3600 \\times 3/20 = 540$ an hour.',
        'Then flashing and labelling at 514 become the limit: the line would run at 514 an hour.'
      ],
      a: 'The test limits the line at 360 units an hour. A third test position raises it to 514, where flashing and labelling become the limit.'
    }
  ],
  quiz: [
    { q: 'Why is the MAC address not something the factory assigns?', choices: ['It is a secret', 'It is already burned into every chip at Espressif, so you read it rather than write it', 'It changes at every start', 'It is stored in the program'], a: 1, why: 'Each chip leaves Espressif with its own base MAC in the eFuses. The factory records it and adds its own data, such as a serial number.' },
    { q: 'Flashing takes 28 s and testing 20 s, with four flashing positions and two test positions. What limits the line?', choices: ['Flashing, because it takes longest', 'The test: its two positions give 360 units an hour against flashing\'s 514', 'Neither: they are equal', 'The label printer'], a: 1, why: 'A station\'s speed is its parallel positions divided by its cycle time. The smallest value sets the line speed, whatever the single cycle times look like.' },
    { q: 'When in the line should the eFuses be burned (secure boot, flash encryption)?', choices: ['First, before anything else', 'After the unit has passed its test, and only after rehearsing on spare units', 'Never in a factory', 'At the customer'], a: 1, why: 'An eFuse burns once and cannot be undone. A wrong setting makes the unit useless, so burn last, on a tested unit, with a proven procedure.' },
    { q: 'A factory reset in the field should keep the serial number and device certificate.', a: true, why: 'They were written in the factory and the customer cannot restore them. Keep them in a namespace or partition the reset does not erase.' }
  ],
  applications: [
    'A small batch of a hundred units flashed and tested on a hand-built jig at a kitchen table.',
    'A contract manufacturer programming thousands of units a day from the merged images you supply.',
    'A serial number and cloud certificate written per unit at the end of the line ([[mutual-tls]]).',
    'A returned unit looked up by serial number in the batch log, to see what it measured when it left.'
  ],
  sources: [
    'Espressif, esptool documentation (merge-bin and write-flash).',
    'ESP-IDF Programming Guide, *NVS Partition Generator Utility*.',
    'ESP-IDF Programming Guide, *eFuse Manager*.'
  ]
},

/* ================================================================ production testing */
{
  id: 'production-testing',
  parent: 'updating-and-deploying',
  title: 'Production testing',
  level: 3,
  short: 'A production test is not looking for design bugs. It looks for the one unit that is wrong: a missed solder joint, a wrong resistor, a loose antenna cable. A jig runs a self-test in seconds, and limits chosen from the real spread of good units decide pass or fail.',
  keywords: ['production test', 'test jig', 'self-test', 'pass fail', 'limits', 'yield', 'false reject', 'escape', 'guard band', 'bed of nails', 'golden unit', 'calibration', 'first-pass yield', 'test firmware', 'traceability'],
  prereq: ['factory-programming', 'hardware-in-the-loop', 'measuring-current'],
  related: ['soak-and-stress-tests', 'sensor-calibration', 'the-multimeter', 'disabling-debug-interfaces', 'module-certification', 'accuracy-resolution-precision', 'fault-finding-method'],
  body: `A prototype is tested to find out whether the *design* works. A production test asks something else: is *this unit* built right? It looks for the missed solder joint, the wrong resistor, the flash that did not program, the antenna cable that is not clicked in, the sensor with a bad bond. It must say pass or fail in seconds, the same way for every unit, and its failure counts must say whether the process drifted.

### The jig

A bed-of-nails **fixture** touches test points with pogo pins ([[factory-programming]]). It powers the board from its own supply and measures the current; it drives EN and the boot pin so the board enters download mode; it reads the unit's label; it supplies a known voltage to the analogue inputs; and for a radio it may include a reference access point in a shielded box. LEDs are checked with a light sensor, buttons pressed by a solenoid.

### Test firmware

Either a dedicated **test firmware** is flashed first, runs the checks and reports over serial, and the real program is flashed last (and its hash checked); or the product firmware has a **test mode** entered by a serial command, which saves a flash cycle but leaves a door in every unit, to be closed before shipping ([[disabling-debug-interfaces]]).

### What to check

- the 3.3 V rail and the current at idle and in deep sleep: a stuck part shows as ten times the current;
- the flash identity and size, and a quick RAM fill-and-read;
- every part the product uses: an I2C scan for each sensor, an analogue reading of the jig's reference, the LEDs, the buttons;
- the radio: join the jig's access point and compare the signal with a **golden unit**. A certified module's radio was tested by its maker ([[module-certification]]); what is yours is the antenna connection and the placement;
- calibration: measure the offsets and write them into the unit's data.

### Limits

Each check has a pass range. Set it from the measured spread of good units and from the specification. Too tight, and good units fail: *false rejects*, which cost scrap and time. Too loose, and bad units ship: *escapes*, which cost a hundred times more in the field. Measurement noise widens what you see, so a **guard band** keeps the test limit inside the specification. The simulation below shows the trade. Log the measured *values*, not just pass or fail, so a drifting process shows long before the limit.

> [!key] A production test finds the bad unit, not the bad design: a jig, a self-test, limits drawn from the spread of good units, and a log of the values. Tight limits reject good units, loose ones ship bad ones.`,
  ideas: [
    'A jig powers, resets, programs and measures each board the same way, in seconds.',
    'Test the unit\'s own parts: rails, sleep current, flash, sensors, analogue references, LEDs, buttons, and the radio against a golden unit.',
    'Limits come from the spread of good units and the specification: tight ones reject good units, loose ones ship bad ones.',
    'Log measured values and not only pass or fail, so a drifting process shows before it fails.'
  ],
  pitfalls: [
    'The module is certified, so the radio needs no test — The maker tested the module, not your solder joints, antenna cable or placement. Check that the signal is as strong as a golden unit\'s.',
    'The tightest limits are the safest — They reject good units, which costs money, and measurement noise makes it worse. Use a guard band, and check the yield per test.',
    'Pass or fail is all I need to log — Without the values you cannot see a process that drifts toward a limit, or compare batches.'
  ],
  terms: [
    { term: 'Test fixture', also: ['test jig', 'bed-of-nails fixture'], def: 'A holder that powers a board, makes contact with its test points and runs the checks, so every unit is tested the same way.' },
    { term: 'Golden unit', also: ['reference unit', 'golden sample'], def: 'A unit known to be good, kept as a reference. Its readings, such as the radio signal strength, are what other units are compared with.' },
    { term: 'False reject', also: ['false fail'], def: 'A good unit that fails the test, because a limit is too tight or the measurement is noisy. It costs scrap and re-testing.' },
    { term: 'Escape', also: ['test escape', 'false pass'], def: 'A bad unit that passes the test and ships. The most expensive error of a test, because it is found by the customer.' },
    { term: 'Guard band', def: 'A margin between the specification and the test limit, so that measurement error does not let out-of-spec units pass.' },
    { term: 'First-pass yield', also: ['yield'], def: 'The share of units that pass every test the first time, without rework. It is the product of the yields of the steps.' }
  ],
  formulas: [
    {
      name: 'Yield of a chain of steps',
      expr: 'Y = y^n',
      tex: 'Y = y^{n}',
      vars: {
        Y: { name: 'first-pass yield of the whole line', q: 'ratio' },
        y: { name: 'yield of each step', q: 'ratio', value: 0.99, min: 0, max: 1 },
        n: { name: 'number of steps', q: 'count', unit: '', value: 10, int: true }
      },
      solveFor: 'Y',
      note: 'For steps that fail independently and about equally. Ten steps that are each 99 % good give only 90 % good units.',
      stories: { Y: 'A line has {n} steps and each step passes {y} of the units. What share passes all of them?' }
    }
  ],
  sim: ['ud-test-limits', { id: 'ud-production-line', params: { focus: 'test' } }],
  choose: {
    good: ['A dedicated test firmware, with the real program flashed last and its hash checked', 'Limits drawn from measured good units, with a guard band', 'A golden unit to compare the radio against'],
    avoid: ['Test code left open in the shipped product', 'Pass or fail only, with no record of the values', 'Limits copied from the datasheet without a measurement of real units'],
    check: ['The yield of each check, batch by batch', 'That every measurement has a calibrated reference', 'That a failing unit is retested at most once, then reworked or scrapped']
  },
  code: [
    {
      title: 'A self-test for the jig',
      about: 'Four checks and one result line: the flash is at least 4 MB, the I2C sensor answers at 0x76, an analogue input reads the jig\'s 2.0 V reference within 5 %, and the jig\'s access point is heard stronger than -60 dBm. The jig reads PASS or FAIL lines from the serial port.',
      needs: 'An ESP32 DevKit with an I2C sensor at 0x76 on GPIO21 (SDA) and GPIO22 (SCL), 2.0 V from the jig on GPIO34, and a Wi-Fi access point named JIG-AP nearby.',
      wiring: [['GPIO21', 'sensor SDA', 'I2C data'], ['GPIO22', 'sensor SCL', 'I2C clock'], ['GPIO34', '2.0 V reference from the jig', 'ADC1 channel, input only']],
      blocks: `
        define report (name) (ok) :: my
          if <ok> then
            print (join [PASS ] (name))
          else
            print (join [FAIL ] (name))
            change [failures v] by (1)
          end

        when started
          start serial at (115200) baud
          set [failures v] to (0)
          report [flash] <(flash size in KB) ≥ (4096)> :: my
          start I2C on SDA (21) SCL (22)
          report [sensor] <I2C device present at address (0x76)> :: my
          report [adc] <<(analog read pin (34) in millivolts) ≥ (1900)> and <(analog read pin (34) in millivolts) ≤ (2100)>> :: my
          report [radio] <(signal strength of [JIG-AP]) > (-60)> :: my
          if <(failures) = (0)> then
            print [RESULT PASS]
          else
            print [RESULT FAIL]
          end
      `,
      cpp: String.raw`
        #include <Wire.h>
        #include <WiFi.h>

        const uint8_t SENSOR_ADDR = 0x76;                      // the I2C sensor that must answer
        const int ADC_PIN = 34;                                // 2.0 V from the jig is applied here
        int failures = 0;

        void report(const char *name, bool ok, const char *detail) {
          Serial.printf("%s %s %s\n", ok ? "PASS" : "FAIL", name, detail);
          if (!ok) failures++;
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          char buf[48];

          snprintf(buf, sizeof(buf), "%u KB", (unsigned)(ESP.getFlashChipSize() / 1024));
          report("flash", ESP.getFlashChipSize() >= 4UL * 1024 * 1024, buf);

          Wire.begin(21, 22);
          Wire.beginTransmission(SENSOR_ADDR);
          snprintf(buf, sizeof(buf), "address 0x%02X", SENSOR_ADDR);
          report("sensor", Wire.endTransmission() == 0, buf);

          int mv = analogReadMilliVolts(ADC_PIN);
          snprintf(buf, sizeof(buf), "%d mV (limits 1900..2100)", mv);
          report("adc", mv >= 1900 && mv <= 2100, buf);

          WiFi.mode(WIFI_STA);
          int n = WiFi.scanNetworks();
          int rssi = -127;
          for (int i = 0; i < n; i++) {
            if (WiFi.SSID(i) == "JIG-AP") rssi = WiFi.RSSI(i);
          }
          snprintf(buf, sizeof(buf), "JIG-AP at %d dBm (limit -60)", rssi);
          report("radio", rssi > -60, buf);

          Serial.println(failures == 0 ? "RESULT PASS" : "RESULT FAIL");
        }

        void loop() {}
      `,
      py: String.raw`
        import esp, network
        from machine import Pin, I2C, ADC

        SENSOR_ADDR = 0x76                                      # the I2C sensor that must answer
        failures = 0

        def report(name, ok, detail):
            global failures
            print("PASS" if ok else "FAIL", name, detail)
            if not ok:
                failures += 1

        size_kb = esp.flash_size() // 1024
        report("flash", size_kb >= 4096, "%d KB" % size_kb)

        i2c = I2C(0, scl=Pin(22), sda=Pin(21))
        report("sensor", SENSOR_ADDR in i2c.scan(), "address 0x%02X" % SENSOR_ADDR)

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)                 # 2.0 V from the jig is applied here
        mv = adc.read_uv() // 1000
        report("adc", 1900 <= mv <= 2100, "%d mV (limits 1900..2100)" % mv)

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        rssi = -127
        for ssid, bssid, channel, level, auth, hidden in wlan.scan():
            if ssid == b"JIG-AP":
                rssi = level
        report("radio", rssi > -60, "JIG-AP at %d dBm (limit -60)" % rssi)

        print("RESULT PASS" if failures == 0 else "RESULT FAIL")
      `,
      output: `
        PASS flash 4096 KB
        PASS sensor address 0x76
        PASS adc 2012 mV (limits 1900..2100)
        PASS radio JIG-AP at -48 dBm (limit -60)
        RESULT PASS
      `,
      notes: ['The ESP32 ADC is not linear at its ends and differs from chip to chip: 2.0 V sits well inside its range, and the limits (1900 to 2100 mV) allow for the chip\'s own error ([[adc-attenuation-and-calibration]]).', 'A real test also prints the measured numbers into a log, per serial number, and checks current and sleep current with the jig\'s own meter.', 'The test firmware is for the factory. Do not ship it, or any serial command that starts it.']
    }
  ],
  examples: [
    {
      title: 'Ten steps, ninety per cent',
      q: 'A board goes through ten assembly and test steps, and each step passes 99 % of the units. A batch of 2000 boards goes in. How many leave first time?',
      steps: [
        'The yield of the chain is $Y = y^n = 0.99^{10} \\approx 0.904$.',
        'Of 2000 boards, about $0.904 \\times 2000 \\approx 1809$ pass every step the first time.',
        'About 191 boards need rework or a second look: nearly one in ten, though no single step looks bad.',
        'Raising every step to 99.9 % gives $0.999^{10} \\approx 0.990$: 1980 boards.'
      ],
      a: 'About 1809 of 2000 leave first time; ten good-looking steps still lose roughly one board in ten.'
    }
  ],
  quiz: [
    { q: 'A test limit is set exactly at the specification, but the test instrument has noise. What is the likely effect?', choices: ['Nothing', 'Some out-of-spec units pass and some good units fail, because noise moves readings across the limit', 'Every unit passes', 'Every unit fails'], a: 1, why: 'Noise adds to the true value, so units near the limit are measured on either side of it. A guard band trades a few false rejects for fewer escapes.' },
    { q: 'Which error costs more, a false reject or an escape?', choices: ['A false reject, because it wastes the unit', 'An escape, because a bad unit reaches a customer', 'They cost the same', 'Neither costs anything'], a: 1, why: 'A false reject costs a re-test or a scrapped unit. An escape costs a return, a support call, perhaps a recall and a reputation.' },
    { q: 'The radio module is certified. What should the production test still check about the radio?', choices: ['Nothing', 'That the antenna connection and placement give a signal as strong as a golden unit\'s', 'The module\'s certification number', 'The Bluetooth address'], a: 1, why: 'The maker tested the module. A cable that is not clicked in, a part that touches the antenna or a solder fault on the board are yours to catch.' },
    { q: 'Why log the measured values and not just pass or fail?', choices: ['The regulations require it', 'A process that drifts towards a limit shows in the values long before units start failing', 'To make the log larger', 'Pass or fail cannot be logged'], a: 1, why: 'A value creeping from 10 to 14 µA against a limit of 15 is a warning that pass or fail would hide until the first failures.' }
  ],
  applications: [
    'A jig that tests a smart plug\'s relay, current meter and radio in 20 seconds before it is boxed.',
    'A contract manufacturer rejecting a batch because the sleep-current values drifted upward.',
    'A returned unit compared with the logged values it had when it left the line.',
    'Writing each unit\'s measured sensor offset into its data before the real program is flashed.'
  ],
  sources: [
    'The datasheet of the module: its ratings, and the test limits it recommends for production.',
    'ESP-IDF Programming Guide, *Unit Testing in ESP32*.',
    'Espressif, *ESP32 Hardware Design Guidelines* and the guidelines of the other chips.'
  ]
},

/* ================================================================ radio approvals */
{
  id: 'regulatory-approval',
  parent: 'updating-and-deploying',
  title: 'Radio approvals: CE, FCC and modules',
  level: 3,
  short: 'A product with a radio must be shown to meet the rules of each place it is sold. A certified module covers the radio part, if it is used as tested; the product still has its own electronics, safety, labels and software to assess. An outline, at the time of writing, and not legal advice.',
  keywords: ['CE marking', 'RED', 'Radio Equipment Directive', 'FCC', 'modular grant', 'FCC ID', 'ISED', 'UKCA', 'RoHS', 'WEEE', 'Bluetooth SIG', 'qualification', 'Matter certification', 'declaration of conformity', 'EMC', 'RF exposure', 'EIRP', 'compliance', 'technical file'],
  prereq: ['module-certification', 'transmit-power-and-regulations', 'regulations-cra-and-red'],
  related: ['pcb-antennas', 'external-antennas', 'lithium-cells', 'documentation', 'bill-of-materials-and-cost', 'matter', 'esd-and-bench-safety', 'production-testing'],
  body: `A radio may not be sold until it has been shown to meet the rules of the place where it is sold. A certified module does the heavy part ([[module-certification]]); it does not make the product approved. This page is an outline of what a small team meets, as of October 2026. It is **not legal advice**, rules change, and a test lab or specialist should check any real product.

### Europe: the CE mark

CE is the manufacturer's declaration that the product meets the applicable EU rules. For a radio product the main one is the Radio Equipment Directive (RED), which covers the use of the radio spectrum (harmonised ETSI standards per band), electromagnetic compatibility, safety and radio exposure, and — for internet-connected radio equipment, since 1 August 2025 — cybersecurity ([[regulations-cra-and-red]]). The maker keeps a technical file and signs an EU declaration of conformity. RoHS (hazardous substances), WEEE (recycling, the crossed-out bin and registration), the battery rules and packaging rules apply too.

### The United States and elsewhere

The FCC treats a transmitter as an *intentional radiator*; a module can carry a **modular grant** (an FCC ID). The product that builds it in must meet the grant's conditions — its antenna, its supply, no changes — show "contains FCC ID" on a label, and still be tested as a digital device, the *unintentional radiator* of the electronics around the module. Canada (ISED), the United Kingdom (UKCA and its changing recognition of CE; check the current position), Japan, Korea, China and others each have their own marks. A module datasheet lists the countries it already holds approvals for.

### Using the names

The Bluetooth logo and the claim need a **qualification** listing with the Bluetooth SIG; a qualified module's listing reduces the work. Wi-Fi logos come from the Wi-Fi Alliance and **Matter** from the Connectivity Standards Alliance ([[matter]]); each is a programme with its own rules and fees.

### Safety and the cell

A product with mains parts is under electrical-safety rules and needs its own assessment. A lithium cell needs a protection circuit ([[lithium-cells]]) and its transport has rules: a UN 38.3 test summary, limits by watt-hours, stricter by air. Check each region's rules.

### How a small team goes on

Use a certified module with its antenna as tested, follow its integration notes, keep the software's country and power limits ([[transmit-power-and-regulations]]), book a pre-compliance check and a lab, and keep the file.

> [!key] CE under RED, FCC modular grants, UKCA and the programme names each have their own rules. A certified module covers the radio only if used as tested; EMC of your electronics, safety, labels, RoHS, WEEE and the security rules are still the product's. Ask a specialist for a real product.`,
  ideas: [
    'CE under the Radio Equipment Directive covers spectrum use, EMC, safety, exposure and, since August 2025, cybersecurity of connected radio equipment.',
    'An FCC modular grant covers the module as tested; the host product still meets the grant\'s conditions and its own digital-device rules.',
    'Using the Bluetooth or Matter name is a programme of its own, with qualification and certification.',
    'Radio rules are only one part: safety, RoHS, WEEE, batteries and transport have theirs.'
  ],
  pitfalls: [
    'A certified module makes my product certified — It covers the radio, used as tested. The product\'s own noise, safety, labels, environmental duties and security are separate.',
    'One approval covers every country — Each region has its own rules and marks. A module\'s datasheet lists what it holds; others must be added.',
    'The Bluetooth logo comes with the chip — Using the name needs the Bluetooth SIG\'s qualification. A qualified module\'s listing can be reused for part of it.'
  ],
  terms: [
    { term: 'CE marking', also: ['CE mark', 'declaration of conformity'], def: 'The manufacturer\'s statement, shown on the product, that it meets the applicable EU rules. For a radio product the Radio Equipment Directive is central.' },
    { term: 'RED', also: ['Radio Equipment Directive', '2014/53/EU'], def: 'The EU directive for radio equipment: spectrum use, EMC, safety and exposure, and cybersecurity of connected devices. Products need its assessment before the CE mark.' },
    { term: 'FCC modular grant', also: ['modular approval', 'FCC ID'], def: 'An FCC approval of a radio module as a unit. A product that uses it as specified can rely on it for the radio and shows "contains FCC ID".' },
    { term: 'Intentional and unintentional radiator', also: ['Part 15'], def: 'A transmitter made to radiate, and any other electronics that radiate noise by accident. Both are limited; a host product with a certified module is still tested as the second kind.' },
    { term: 'Qualification listing', also: ['Bluetooth SIG listing'], def: 'The registration with the Bluetooth SIG that allows a product to use the Bluetooth name and logo. A qualified module\'s listing can be reused for part of the work.' },
    { term: 'RoHS and WEEE', def: 'EU rules that limit hazardous substances in electronics and require recycling marking and producer registration for the product at its end of life.' }
  ],
  formulas: [
    {
      name: 'Margin under a radiated-power limit',
      expr: 'M = Pmax - (P + G - L)',
      tex: 'M = P_{\\max} - \\left(P + G - L\\right)',
      vars: {
        M: { name: 'margin below the limit', q: 'gain', unit: 'dB', signed: true },
        Pmax: { name: 'legal limit, EIRP', unit: 'dBm', value: 20, tex: 'P_{\\max}' },
        P: { name: 'power at the antenna port', unit: 'dBm', value: 17 },
        G: { name: 'antenna gain', q: 'gain', unit: 'dB', value: 3 },
        L: { name: 'cable and connector loss', q: 'gain', unit: 'dB', value: 0 }
      },
      solveFor: 'M',
      note: 'EIRP is the power at the port plus the antenna gain, less the losses between them. A negative margin is over the limit. 20 dBm is the European limit in the 2.4 GHz band at the time of writing; check the rules where you sell.',
      stories: { M: 'A module outputs {P} into an antenna of {G}, with {L} of cable loss. How far is the EIRP under a limit of {Pmax}?' }
    }
  ],
  sim: 'ud-certificate-cover',
  choose: {
    good: ['A certified module with its antenna as tested, in every product you sell', 'A pre-compliance EMC check before the lab visit', 'Software that keeps the country\'s channel and power limits'],
    avoid: ['A different antenna, or a placement the approval does not list', 'Assuming the module\'s certificate covers the whole product', 'Using the Bluetooth, Wi-Fi or Matter name with no listing'],
    check: ['The regions your module is approved for, and the marks you still need', 'The conditions of the grant: antenna, supply, exposure, labelling', 'Safety, battery and environmental rules for the parts you add']
  },
  examples: [
    {
      title: 'A stronger antenna',
      q: 'A module is approved at 17 dBm at its port with a PCB antenna of 3 dBi, for the European limit of 20 dBm EIRP. A designer wants a 5 dBi antenna on a cable with 0.5 dB loss. What is the margin, and what can be done?',
      steps: [
        'EIRP is $P + G - L = 17 + 5 - 0.5 = 21.5$ dBm.',
        'The margin is $20 - 21.5 = -1.5$ dB: over the limit.',
        'Reduce the module\'s output by at least 1.5 dB in software, to 15.5 dBm, and the EIRP is 20 dBm.',
        'Either way the antenna is not the one the approval lists, so the combination needs its own assessment.'
      ],
      a: 'The margin is -1.5 dB. Lowering the power by at least 1.5 dB brings it to the limit, but the antenna is still outside the module\'s approval.'
    }
  ],
  quiz: [
    { q: 'A product uses a module with an FCC modular grant exactly as specified. What does it still need under the FCC rules?', choices: ['Nothing', 'The "contains FCC ID" label, and the digital-device (unintentional radiator) rules for the rest of the electronics', 'A new transmitter approval', 'A Bluetooth listing'], a: 1, why: 'The grant covers the transmitter. The product still has to be labelled and its other electronics meet the limits for unintentional radiators.' },
    { q: 'An internet-connected radio product is placed on the EU market in 2026. Which extra area of the RED assessment applies since 1 August 2025?', choices: ['Colour of the enclosure', 'Cybersecurity requirements for connected radio equipment', 'The price', 'Battery colour coding'], a: 1, why: 'The delegated act under the RED applies cybersecurity requirements (network protection, privacy, fraud) to internet-connected radio equipment from that date.' },
    { q: 'You may use the Bluetooth logo because your chip supports Bluetooth.', a: false, why: 'The name and logo need a qualification listing with the Bluetooth SIG. A qualified module\'s listing can be reused for part of the process.' },
    { q: 'A module outputs 14 dBm and the antenna has 4 dBi gain with 1 dB of cable loss. What is the EIRP?', choices: ['14 dBm', '17 dBm', '19 dBm', '18 dBm'], a: 1, why: 'EIRP = 14 + 4 - 1 = 17 dBm.' }
  ],
  applications: [
    'A small smart-home gadget sold in Europe and the United States on a certified module.',
    'A maker kit sold in small numbers, where the product rules apply once it is sold and not just built.',
    'A change of antenna during design, checked against the module\'s approval before it is committed to the board.',
    'Planning the lab visit and budget for a product that has its own power supply and display.'
  ],
  sources: [
    'The module\'s datasheet and its certification documents (approvals listed per country, antenna list, integration notes).',
    'Directive 2014/53/EU, the Radio Equipment Directive, and the delegated regulation on cybersecurity applied from 1 August 2025.',
    'The FCC rules, 47 CFR Part 15 (subparts B and C), and the FCC guidance on modular transmitters.'
  ]
},

/* ================================================================ open-source licences */
{
  id: 'open-source-licences',
  parent: 'updating-and-deploying',
  title: 'Open-source licences',
  level: 2,
  short: 'Firmware is built from other people\'s code, and each piece comes with a licence that says what you may do and what you owe when you give the device to someone else. Permissive licences ask for notices; the GPL asks for the source of the whole firmware. An outline, not legal advice.',
  keywords: ['open source', 'licence', 'MIT', 'Apache-2.0', 'LGPL', 'GPL', 'copyleft', 'permissive', 'SBOM', 'software bill of materials', 'distribution', 'notices', 'Tasmota', 'ESP-IDF licence', 'Arduino core licence', 'relink', 'tivoization'],
  prereq: ['the-open-ecosystem', 'libraries-and-imports', 'documentation'],
  related: ['regulations-cra-and-red', 'vulnerabilities-and-updates', 'tasmota', 'build-or-use', 'regulatory-approval', 'bill-of-materials-and-cost'],
  body: `Firmware is built from other people's code: the ESP-IDF underneath, the Arduino core or MicroPython on top, a driver for the display, a font. Each piece carries a licence that says what you may do with it and what you owe. The moment that matters most is **distribution**: giving or selling a device, or a firmware image, to someone else. Using code on your own desk, or inside your own company, usually triggers little. This page is an outline at the time of writing and **not legal advice**; for a real product ask a specialist.

### Three families

| Family | Examples | What it asks when you distribute |
|---|---|---|
| Permissive | MIT, BSD, Apache-2.0 | Keep the copyright notices and licence texts. Apache-2.0 adds a patent grant and asks you to mark files you changed. Your own code may stay closed. |
| Weak copyleft | LGPL-2.1, LGPL-3.0 | Changes to the library itself stay open, and users must be able to replace the library. In one statically linked firmware image that is a grey area: take advice. |
| Strong copyleft | GPL-2.0, GPL-3.0 | The whole combined firmware must be offered in source under the GPL. GPL-3.0 adds that owners of consumer devices must be able to install modified versions. |

### What the ESP world uses

ESP-IDF is under Apache-2.0, with some components under their own licences listed in its notices. The Arduino core for the ESP32 is under the LGPL-2.1. MicroPython is MIT. Libraries each have their own: read the licence file, not the page that recommends them, and look for GPL ones. Complete firmware projects such as Tasmota ([[tasmota]]) are under the GPL: a product that ships one carries the GPL's duties for its whole image.

### What you actually do

1. **List the parts**: every component, its version and licence. This is a *software bill of materials* (SBOM), and EU rules for connected products now ask for one ([[regulations-cra-and-red]]).
2. **Ship the notices**: a page in the product or on its website with the licences and copyright lines.
3. **Offer the source** of GPL and LGPL parts, and for the LGPL what is needed to rebuild with a changed library.
4. **Keep your own licence separate**: your code, your decision, as long as nothing GPL is combined into it.
5. **Check the rest**: fonts, icons, images, datasets, hardware designs and trademarks have licences too, and code from a forum post with no licence is not free to use.

> [!key] When you give a device to someone else, its licences bind you: permissive ones ask for notices, the LGPL for the means to replace the library, the GPL for the source of the whole firmware. Keep a list of every component and its licence from the first day.`,
  ideas: [
    'Most licence duties start when you distribute: sell or give a device or firmware image to someone else.',
    'Permissive licences (MIT, BSD, Apache-2.0) ask for notices and let your own code stay closed.',
    'The GPL covers the combined firmware: shipping GPL code means offering the source of the whole image.',
    'Keep a software bill of materials of every component with its licence; the EU asks for one for connected products.'
  ],
  pitfalls: [
    'Open source means free to use any way I like — It is free to use on the licence\'s terms. Ignoring them is copyright infringement, and the terms can be strict.',
    'I only use the library, so the GPL does not touch my code — Combining GPL code into one firmware image makes the whole image a combined work under the GPL. A library under the LGPL is the one meant for linking.',
    'Code from a forum post can be copied into the product — Without a licence you have no right to use it. Ask the author or write it again.'
  ],
  terms: [
    { term: 'Permissive licence', also: ['MIT', 'BSD', 'Apache-2.0'], def: 'A licence that lets you use and change the code, even in closed products, if you keep the copyright notice and licence text. Apache-2.0 adds a patent grant.' },
    { term: 'Copyleft', also: ['GPL', 'LGPL'], def: 'A licence that requires changes and combined works to be shared under the same terms. The GPL covers the whole combined firmware; the LGPL mostly the library itself.' },
    { term: 'Distribution', also: ['conveying'], def: 'Giving or selling a device or firmware image to someone else. Most licence duties begin there, and not when you use code for yourself.' },
    { term: 'SBOM', also: ['software bill of materials'], def: 'A list of every software component in a product, with its version and licence. It serves licence compliance and finding which products a vulnerability affects.' },
    { term: 'Corresponding source', also: ['source offer'], def: 'The source code the GPL asks you to supply to people who receive your firmware, with the scripts to build it, or a written offer to provide it.' }
  ],
  sim: 'ud-licence-mix',
  choose: {
    good: ['Permissive libraries (MIT, BSD, Apache-2.0) when your product code stays closed', 'A written list of components and licences, kept from the first day', 'A GPL base such as Tasmota when you are happy to publish the source'],
    avoid: ['A GPL library combined into a closed product without a plan', 'Copying code that has no licence', 'Forgetting the licence texts and notices in the shipped product'],
    check: ['The licence file of every library you add', 'Whether you distribute: the duties follow the handing over', 'Licences of fonts, images and designs as well as code']
  },
  examples: [
    {
      title: 'A closed product on the Arduino core',
      q: 'A product uses the Arduino core for the ESP32 (LGPL-2.1), ArduinoJson (MIT) and the ESP-IDF (Apache-2.0), and adds its own closed code. What does it owe, in outline, when it ships?',
      steps: [
        'All three licences ask for notices: a page listing each component, its copyright and licence text.',
        'Apache-2.0 asks that files you changed are marked as changed.',
        'The LGPL part is the real question: the user must be able to replace the library. In a firmware image where it is linked in, that means providing what is needed to relink, or taking advice on how to meet it.',
        'The closed code can stay closed, since nothing under the GPL is combined with it.'
      ],
      a: 'Notices for all three, marking of changed Apache files, and a plan for the LGPL core; the product\'s own code can stay closed.'
    }
  ],
  quiz: [
    { q: 'Which duty applies when you build a gadget for your own desk from GPL code and never give it to anyone?', choices: ['Publish the source', 'Almost none: most duties begin when you distribute', 'Pay a fee', 'Remove the code'], a: 1, why: 'The GPL\'s duties are triggered by conveying the program to others. Private use does not oblige you to publish.' },
    { q: 'A product combines a GPL-3.0 library into its firmware image and is sold. What is the consequence for the product\'s own code?', choices: ['None, the library is separate', 'The combined firmware must be offered in source under the GPL, own code included', 'Only the library must be shared', 'The library must be removed at once'], a: 1, why: 'The GPL covers the combined work. The source of the whole firmware has to be offered under the same terms.' },
    { q: 'A permissive licence such as MIT requires you to publish your own source code.', a: false, why: 'It asks only that the copyright notice and licence text travel with the code. Your own code can stay closed.' },
    { q: 'What is a software bill of materials good for?', choices: ['Counting the cost of parts', 'Knowing every component and licence you ship, and which products a vulnerability affects', 'Compressing the firmware', 'Signing the image'], a: 1, why: 'A list of components and licences serves both compliance and security: you can answer which devices carry a vulnerable library.' }
  ],
  applications: [
    'Preparing a shipped smart-home gadget\'s "open-source notices" page.',
    'Choosing between a GPL firmware base and a permissive stack before the design is fixed.',
    'Answering a customer\'s or authority\'s question about which libraries a product contains.',
    'Reviewing a new library\'s licence before adding it to a product.'
  ],
  sources: [
    'The licence texts themselves: MIT, BSD, Apache License 2.0, GNU LGPL and GNU GPL.',
    'The ESP-IDF repository\'s licence and notice files, and the licence of the Arduino core for the ESP32.',
    'MicroPython\'s licence file (MIT).'
  ]
},

/* ================================================================ reliability in the field */
{
  id: 'reliability-in-the-field',
  parent: 'updating-and-deploying',
  title: 'Reliability in the field',
  level: 3,
  short: 'A device that runs for years meets what a bench never shows: routers that restart, power that dips, memory that leaks, a sensor that wedges the bus. Reliability is layers: prevent, detect, recover, fail safe, update and know. A restart is a tool for recovery, not a cure.',
  keywords: ['reliability', 'field failures', 'MTBF', 'watchdog', 'safe mode', 'crash loop', 'reconnect', 'back-off', 'brownout', 'heap leak', 'fail safe', 'uptime', 'resilience', 'scheduled restart', 'recovery', 'availability'],
  prereq: ['watchdogs', 'reset-reasons', 'error-states-and-recovery'],
  related: ['soak-and-stress-tests', 'core-dumps-and-field-diagnostics', 'safety-in-control', 'heap-and-fragmentation', 'brownout', 'ota-partitions-and-rollback', 'store-and-forward', 'fleet-monitoring'],
  body: `On the bench the program runs for ten minutes and works. In a customer's home it runs for three years, through every router restart, power flicker, full moon and unlucky timing. A bug that happens once in a million passes of the loop sounds rare; at 100 passes a second it happens every three hours. Reliability in the field is the work of surviving that.

### What really fails

Seldom the chip. Wi-Fi drops (a router restarts, changes channel, or a lease does not renew); the supply dips and the chip browns out ([[brownout]]); the heap leaks or fragments over weeks ([[heap-and-fragmentation]]); a sensor holds the I2C bus low and the driver waits for ever; a certificate or the clock runs out; the flash wears; and your own rare bugs appear.

### Six layers

1. **Prevent.** Margin in the power design, a timeout on every blocking call, bounded buffers, no unlimited String growth.
2. **Detect.** The task watchdog ([[watchdogs]]), the reset reason logged at every start ([[reset-reasons]]), the lowest free heap seen, and the server's "last seen".
3. **Recover.** Reconnect with back-off, re-initialise a bus, restart a task, and as the last step restart the chip.
4. **Fail safe.** At boot and when the link is lost, outputs go to a safe state: heater off, valve closed ([[safety-in-control]]).
5. **Update.** A fix must be able to reach the device, with rollback ([[ota-partitions-and-rollback]]).
6. **Know.** Report resets, versions and core dumps ([[core-dumps-and-field-diagnostics]]); you cannot fix what you do not see.

### A restart is a tool

A nightly restart hides a leak, and hides the evidence with it: use it as a plaster while you count resets and find the cause. A crash must not repeat at full speed either. The usual guard counts quick restarts and, after a few, enters a **safe mode** that only keeps the connection and the update path alive, so a fix can still arrive. The program below does it.

### The arithmetic of a fleet

If a unit fails about once in a thousand weeks, a fleet of ten thousand sees about ten failures every week. The product is judged by the worst weeks of its worst units, so a soak test of days ([[soak-and-stress-tests]]) is not optional.

> [!key] Build the layers: prevent, detect, recover, fail safe, update, know. Log the reset reason, guard against crash loops with a safe mode that keeps the update path open, and treat a restart as recovery, never as the cure.`,
  ideas: [
    'A rare bug is not rare at machine speed: one in a million at 100 passes a second is once every three hours.',
    'Layers of defence: prevent, detect, recover, fail safe, update, and know what happened.',
    'A crash-loop guard counts quick restarts and falls into a safe mode that keeps connectivity and updating alive.',
    'A scheduled restart is a plaster that hides the cause; log the reset reason and find the leak.'
  ],
  pitfalls: [
    'A watchdog makes the device reliable — It makes a hang recoverable. Without a log of why it fired, a device can restart a hundred times and nobody learns of it.',
    'A nightly restart solves leaks — It hides them and the evidence. The cause remains and will bite in a way a restart cannot cure.',
    'Reconnecting at once is the best — A thousand devices retrying every second after a router outage hammer the network and the server. Back off, with jitter.'
  ],
  terms: [
    { term: 'Safe mode', also: ['recovery mode', 'rescue mode'], def: 'A reduced mode a device enters after repeated crashes: it runs no application logic, only the connection and the update path, so that a fix can still be delivered.' },
    { term: 'Crash loop', also: ['boot loop'], def: 'A device that crashes, restarts and crashes again, over and over, usually just after start-up. Without a guard it is lost until someone intervenes.' },
    { term: 'Fail safe', also: ['safe state'], def: 'Designing so that when something fails, the outputs go to a harmless state, such as heater off or valve closed, rather than staying as they were.' },
    { term: 'Back-off', also: ['exponential back-off'], def: 'Waiting longer after each failed attempt, with a random element, so that many devices do not retry together.' },
    { term: 'MTBF', also: ['mean time between failures'], def: 'The average time a unit runs between failures. With a large fleet it tells how many failures to expect each week.' }
  ],
  formulas: [
    {
      name: 'Failures expected in a fleet',
      expr: 'F = N*t/M',
      tex: 'F = \\frac{N\\,t}{M}',
      vars: {
        F: { name: 'failures expected', q: 'count', unit: '' },
        N: { name: 'devices in the fleet', q: 'count', unit: '', value: 10000, int: true },
        t: { name: 'period watched', q: 'time', unit: 'wk', value: 1 },
        M: { name: 'mean time between failures of one unit', q: 'time', unit: 'wk', value: 1000 }
      },
      solveFor: 'F',
      note: 'For a period much shorter than the MTBF, and failures that are independent. A fleet turns a rare event into a daily one.',
      stories: { F: 'A fleet of {N} devices each fail once in {M} on average. How many failures are expected in {t}?' }
    }
  ],
  choose: {
    good: ['The task watchdog on the main task, and the reset reason logged at every start', 'A crash-loop guard that falls into a safe mode', 'Fail-safe outputs, and reconnection with back-off'],
    avoid: ['A nightly restart as the only fix for a leak', 'Retrying a lost connection every second from every device', 'Outputs left as they were when the program died'],
    check: ['What the device does in the first minute after each kind of reset', 'That a hang, a crash and a brownout are told apart in the log', 'That a safe-mode device can still be updated']
  },
  code: [
    {
      title: 'A crash-loop guard with a safe mode',
      about: 'Counts every start in NVS and clears the count after a minute of stable running. After three quick restarts in a row the program starts in safe mode: no application work, only the connection and the update path.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [fast v] to ((load [fast] with default (0)) + (1))
          save (fast) as [fast]
          if <(fast) > (3)> then
            set [safe v] to [yes]
            print (join [start ] (join (fast) [ in a row: SAFE MODE]))
          else
            set [safe v] to [no]
            print (join [start ] (join (fast) [ since the last stable run]))
          end

        every (5) seconds
          if <(milliseconds since start) > (60000)> then
            save (0) as [fast]
          end
          if <(safe) = [yes]> then
            print [safe mode: only connection and update]
          else
            print [normal work]
          end
      `,
      cpp: String.raw`
        #include <Preferences.h>

        const int MAX_FAST_RESTARTS = 3;
        const uint32_t STABLE_MS = 60000;
        Preferences prefs;
        bool safeMode = false;
        bool cleared = false;

        void setup() {
          Serial.begin(115200);
          prefs.begin("guard", false);
          int fast = prefs.getInt("fast", 0) + 1;            // starts since the last stable run
          prefs.putInt("fast", fast);
          safeMode = fast > MAX_FAST_RESTARTS;
          Serial.printf("start %d %s\n", fast, safeMode ? "in a row: SAFE MODE" : "since the last stable run");
        }

        void loop() {
          if (!cleared && millis() > STABLE_MS) {            // it ran for a minute: forget the earlier restarts
            prefs.putInt("fast", 0);
            cleared = true;
            Serial.println("stable: counter cleared");
          }
          if (safeMode) {
            Serial.println("safe mode: only connection and update");   // keep Wi-Fi and the update check here
          } else {
            Serial.println("normal work");                   // the product's real work goes here
          }
          delay(5000);
        }
      `,
      py: String.raw`
        import esp32, time

        MAX_FAST_RESTARTS = 3
        STABLE_MS = 60000
        nvs = esp32.NVS("guard")

        try:
            fast = nvs.get_i32("fast") + 1                   # starts since the last stable run
        except OSError:
            fast = 1
        nvs.set_i32("fast", fast)
        nvs.commit()
        safe_mode = fast > MAX_FAST_RESTARTS
        print("start", fast, "in a row: SAFE MODE" if safe_mode else "since the last stable run")

        start = time.ticks_ms()
        cleared = False
        while True:
            if not cleared and time.ticks_diff(time.ticks_ms(), start) > STABLE_MS:
                nvs.set_i32("fast", 0)                       # it ran for a minute: forget the earlier restarts
                nvs.commit()
                cleared = True
                print("stable: counter cleared")
            if safe_mode:
                print("safe mode: only connection and update")   # keep Wi-Fi and the update check here
            else:
                print("normal work")                         # the product's real work goes here
            time.sleep(5)
      `,
      output: `
        start 1 since the last stable run
        normal work
        …
        stable: counter cleared
      `,
      notes: ['Power cycled by hand several times within a minute also counts as quick restarts, so a person fiddling with the plug sends the unit to safe mode. Decide how to leave it: a long press, a command, or a successful update.', 'Two flash writes per start is fine for rare events; it would not be for a loop that restarts every second, which is exactly what the guard ends.', 'Pair it with the watchdog ([[watchdogs]]) so that a hang is counted as a restart too.']
    }
  ],
  examples: [
    {
      title: 'A once-in-a-million bug',
      q: 'A sensor loop runs 100 times a second. A bug corrupts one pass in a million. How often does it strike one device, and how many strikes a day in a fleet of 5000?',
      steps: [
        'One strike per million passes at 100 passes a second is one every $10^6/100 = 10\\,000$ s, about 2.8 hours.',
        'That is $86\\,400 / 10\\,000 \\approx 8.6$ strikes a device a day.',
        'For 5000 devices that is about 43 000 strikes a day.',
        'Whether a strike is a harmless wrong reading or a crash decides if this is a nuisance or an emergency; either way, it will be seen.'
      ],
      a: 'About once every 2.8 hours per device, and roughly 43 000 times a day across the fleet: rare in a test, constant in the field.'
    }
  ],
  quiz: [
    { q: 'A device enters a crash loop after an update. What does a safe mode achieve?', choices: ['It fixes the bug', 'It keeps the connection and the update path alive, so a corrected image can still reach the device', 'It erases the settings', 'It turns off the watchdog'], a: 1, why: 'The loop would otherwise keep the device from ever staying up long enough to be fixed. Safe mode runs only what is needed to receive an update.' },
    { q: 'A thousand devices lose the router and each retries every second. What is the fault in this design?', choices: ['None', 'No back-off or jitter: the retries arrive together and overload the network and server when it returns', 'The retry is too slow', 'Wi-Fi cannot reconnect'], a: 1, why: 'Back off after each failure and add a random delay, so the fleet does not come back as one wave.' },
    { q: 'A nightly restart is a good permanent fix for a memory leak.', a: false, why: 'It hides the leak and destroys the evidence. Use it while finding the cause, and log the reset reason.' },
    { q: 'One unit in 500 fails each week. How many failures a week are expected in a fleet of 20 000?', choices: ['4', '40', '400', '4000'], a: 1, why: 'The failure count is the fleet size times the failure rate: 20 000 / 500 = 40.' }
  ],
  applications: [
    'A thermostat that must keep running through router restarts and power flickers for years.',
    'A remote sensor that falls into safe mode after a bad update and still accepts the corrected image.',
    'A fleet dashboard showing the rate of watchdog resets per version after each release.',
    'A pump controller whose outputs go off at start-up and when the link is lost.'
  ],
  sources: [
    'ESP-IDF Programming Guide, *Watchdogs* and *Fatal Errors*.',
    'ESP-IDF Programming Guide, *Heap Memory Debugging* (the low-water mark).',
    'MicroPython documentation, *machine.WDT* and *machine.reset_cause*.'
  ]
},

/* ================================================================ monitoring a fleet */
{
  id: 'fleet-monitoring',
  parent: 'updating-and-deploying',
  title: 'Monitoring a fleet',
  level: 3,
  short: 'Each device sends a small heartbeat and a last-will message; the server turns them into answers: how many are online, on which version, how many are resetting. How many missed beats make an alarm is a trade between false alarms and slow detection. A roll-out needs this signal to halt itself.',
  keywords: ['fleet monitoring', 'heartbeat', 'last will', 'telemetry', 'last seen', 'alerts', 'online offline', 'MQTT retained', 'dashboard', 'roll-out', 'staged rollout', 'health check', 'sequence number', 'false alarm', 'fleet', 'observability'],
  prereq: ['mqtt-topics-qos-retain', 'ota-from-a-server', 'reliability-in-the-field'],
  related: ['dashboards', 'versioning-and-releases', 'device-shadows-and-twins', 'batching-rates-and-cost', 'privacy-and-data-protection', 'time-series-data', 'iot-architecture'],
  body: `Once a device is out in the world you can no longer look at it. Everything you know comes from what it tells you, so decide early what it should say, and what the server will do with it.

### What a device reports

- A **heartbeat** every few minutes: a small record with the firmware version, a sequence number, the signal strength, the free memory and, if relevant, the battery voltage, the last reset reason and the settings version.
- **Events** when something happens: start-up, an error, the result of an update.
- A **last will**: when it connects to an MQTT broker the device registers a message that the *broker* publishes if the device disappears without saying goodbye. With a retained "online" message at start, one topic always shows the current state ([[mqtt-topics-qos-retain]]).

### From data to answers

A fleet view counts devices online, by version, by hardware revision and by region. Show **distributions**, not averages: a median signal of -60 dBm hides the one in twenty at -90. **Alerts** fire on offline for too long, a rise in resets per day, a low heap, a low battery.

### How many missed beats make an alarm?

Packets get lost and routers blip. If one missed heartbeat raises an alarm, you drown in false alarms; if you wait for ten, a real failure is found late. With a loss probability $L$ per beat, the chance that $k$ in a row are lost is $L^k$: at 10 % loss, one miss is a 10 % chance, three misses a 0.1 % chance. The sequence number in each beat lets you tell a lost message from a silent device. The simulation below plays this out.

### The roll-out needs the signal

Staged roll-outs ([[ota-from-a-server]]) depend on a health signal: after an update, a device reports its new version and a healthy first hour. The roll-out halts by itself when failures in a ring pass a threshold. Without the signal, "staged" only means slow.

### Cost and privacy

Every beat costs data, battery and server work: 120 bytes a minute is 170 KB a day, 5 MB a month, which counts on a metered cellular link ([[batching-rates-and-cost]]). Telemetry describes people's homes: send the least that serves, say what you send, and protect it ([[privacy-and-data-protection]]).

> [!key] A heartbeat with a sequence number, a retained status and a last will give a live picture. Choose the number of missed beats against the loss rate, count by version, and feed the same signal back into the roll-out so that it halts on its own.`,
  ideas: [
    'A heartbeat with a version, a sequence number and a few health numbers is the fleet\'s pulse.',
    'An MQTT last will with a retained status topic shows who is online without polling.',
    'The chance that k beats in a row are lost is L to the power k: wait for several missed beats before alarming.',
    'A roll-out in rings halts itself only if devices report their health after the update.'
  ],
  pitfalls: [
    'One missed heartbeat means the device is down — Packets are lost and routers blip. Alarm after several missed beats, chosen from the loss rate.',
    'Average values describe the fleet — An average hides the tail: the few devices at the edge of range, or resetting daily, are the ones that need attention.',
    'More telemetry is always better — Every beat costs data, battery and server work, and describes a home. Send what you will actually use.'
  ],
  terms: [
    { term: 'Heartbeat', also: ['keep-alive message', 'status beat'], def: 'A small message a device sends at a steady interval to say it is alive, usually with a few health numbers such as version and signal strength.' },
    { term: 'Last will', also: ['LWT', 'last will and testament'], def: 'An MQTT message registered with the broker when a client connects. The broker publishes it if the client vanishes without disconnecting.' },
    { term: 'Telemetry', also: ['health report'], def: 'Measurements a device sends about itself or its surroundings: its version, signal, memory, battery and the events it saw.' },
    { term: 'Last seen', also: ['age of last heartbeat'], def: 'The time since the server last heard from a device. An alarm fires when it exceeds a chosen number of heartbeat intervals.' },
    { term: 'Sequence number', def: 'A counter in each message. Gaps in it show messages that were lost, which is different from a device that has gone silent.' }
  ],
  formulas: [
    {
      name: 'Chance of a false alarm',
      expr: 'p = L^k',
      tex: 'p = L^{k}',
      vars: {
        p: { name: 'chance of k beats in a row lost', q: 'ratio' },
        L: { name: 'chance that one heartbeat is lost', q: 'ratio', value: 0.1, min: 0, max: 1 },
        k: { name: 'missed beats that raise an alarm', q: 'count', unit: '', value: 3, int: true }
      },
      solveFor: 'p',
      note: 'For independent losses. It is the chance in any one interval; multiply by the beats per day to get false alarms a day.',
      stories: { p: 'Each heartbeat is lost with a chance of {L}. What is the chance that {k} in a row are lost?' }
    },
    {
      name: 'Data sent by heartbeats',
      expr: 'D = s*86400/T',
      tex: 'D = \\frac{86400\\,s}{T}',
      vars: {
        D: { name: 'bytes a day', q: 'count', unit: '' },
        s: { name: 'size of one heartbeat, with headers', q: 'count', unit: '', value: 120, int: true },
        T: { name: 'heartbeat interval', q: 'time', unit: 's', value: 60 }
      },
      solveFor: 'D',
      note: 'The payload and the protocol headers; TLS and the connection add more. On a metered cellular link every byte is paid for.',
      stories: { D: 'A heartbeat of {s} bytes is sent every {T}. How many bytes a day is that?' }
    }
  ],
  sim: 'ud-heartbeat',
  choose: {
    good: ['A heartbeat with version, sequence number and signal, and a retained status topic with a last will', 'Counts by version and hardware revision, and distributions', 'An alarm after several missed beats, chosen from the loss rate'],
    avoid: ['An alarm on a single missed beat', 'Averages only', 'Telemetry nobody reads, or that carries personal data without need'],
    check: ['The loss rate of your links, to choose the number of missed beats', 'The monthly data cost of the heartbeat on your link', 'That the roll-out can halt on a failure signal']
  },
  code: [
    {
      title: 'A heartbeat with a last will',
      about: 'Connects to an MQTT broker with a retained "offline" last will, publishes a retained "online", and then sends a small heartbeat every 60 seconds: firmware version, a sequence number, the signal strength and the free heap. A dashboard or an alert rule can read it.',
      needs: 'An ESP32 DevKit, Wi-Fi and an MQTT broker. The Arduino version needs the PubSubClient library; MicroPython has umqtt built in.',
      libs: ['PubSubClient'],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [broker.example.com] with last will [offline] on topic [fleet/unit1042/status] retained :: mqtt
          publish [online] to topic [fleet/unit1042/status] retained :: mqtt
          set [seq v] to (0)

        every (60) seconds
          change [seq v] by (1)
          publish (join [{"fw":"1.2.0","seq":] (join (seq) (join [,"rssi":] (join (signal strength) (join [,"heap":] (join (free memory) [}])))))) to topic [fleet/unit1042/heartbeat] :: mqtt
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *BROKER = "broker.example.com";
        const char *FIRMWARE_VERSION = "1.2.0";
        const char *STATUS_TOPIC = "fleet/unit1042/status";
        const char *BEAT_TOPIC = "fleet/unit1042/heartbeat";
        const uint32_t BEAT_MS = 60000;

        NetworkClient net;
        PubSubClient mqtt(net);
        uint32_t seq = 0;

        void connectMqtt() {
          while (!mqtt.connected()) {
            // the broker publishes "offline" (retained) for us if we vanish without saying goodbye
            if (mqtt.connect("unit1042", NULL, NULL, STATUS_TOPIC, 1, true, "offline")) {
              mqtt.publish(STATUS_TOPIC, "online", true);          // retained: always shows the current state
            } else {
              delay(2000);
            }
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
          mqtt.setKeepAlive(120);
        }

        void loop() {
          connectMqtt();
          mqtt.loop();
          static uint32_t last = 0;
          if (last == 0 || millis() - last >= BEAT_MS) {
            last = millis();
            seq++;
            char msg[128];
            snprintf(msg, sizeof(msg), "{\"fw\":\"%s\",\"seq\":%lu,\"rssi\":%d,\"heap\":%u}",
                     FIRMWARE_VERSION, (unsigned long)seq, WiFi.RSSI(), (unsigned)ESP.getFreeHeap());
            mqtt.publish(BEAT_TOPIC, msg);
          }
        }
      `,
      py: String.raw`
        import network, time, gc, json
        from umqtt.simple import MQTTClient

        VERSION = "1.2.0"
        BROKER = "broker.example.com"
        STATUS_TOPIC = b"fleet/unit1042/status"
        BEAT_TOPIC = b"fleet/unit1042/heartbeat"
        BEAT_MS = 60000

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        client = MQTTClient("unit1042", BROKER, keepalive=120)
        client.set_last_will(STATUS_TOPIC, b"offline", retain=True, qos=1)   # the broker publishes this if we vanish
        client.connect()
        client.publish(STATUS_TOPIC, b"online", retain=True)                  # retained: always shows the current state

        seq = 0
        last = time.ticks_add(time.ticks_ms(), -BEAT_MS)                      # so that the first beat goes at once
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= BEAT_MS:
                last = time.ticks_ms()
                seq += 1
                beat = {"fw": VERSION, "seq": seq, "rssi": wlan.status("rssi"), "heap": gc.mem_free()}
                client.publish(BEAT_TOPIC, json.dumps(beat).encode())
            time.sleep(1)
      `,
      output: `
        fleet/unit1042/status      online
        fleet/unit1042/heartbeat   {"fw":"1.2.0","seq":1,"rssi":-61,"heap":214320}
        fleet/unit1042/heartbeat   {"fw":"1.2.0","seq":2,"rssi":-62,"heap":214048}
      `,
      notes: ['The free heap of the two languages is not the same thing: C++ reports the system heap, MicroPython the heap of its own interpreter. Compare a device with its own earlier readings, not with a device in the other language.', 'Use TLS on port 8883 and credentials for a real broker ([[credentials-handling]]); the example is plain to stay short.', 'A reconnect loop that never gives up needs the back-off of [[reliability-in-the-field]].']
    }
  ],
  examples: [
    {
      title: 'How many missed beats?',
      q: 'Heartbeats go every 60 s over a link that loses 10 % of messages. An alarm is raised after k missed beats in a row. For k = 1, 2 and 3, how many false alarms a day, per device, and how long does a real failure take to be noticed at least?',
      steps: [
        'There are $86\\,400/60 = 1440$ beats a day. The chance that k in a row are lost is $0.1^k$.',
        'k = 1: $1440 \\times 0.1 = 144$ false alarms a day. k = 2: $14.4$. k = 3: $1.44$.',
        'Detection takes at least about $k \\times 60$ s after the last good beat: 1, 2 or 3 minutes.',
        'k = 4 gives $0.14$ a day with a 4-minute delay: choose by what a minute of late warning costs.'
      ],
      a: '144, 14 and 1.4 false alarms a day for k of 1, 2 and 3, with a detection delay of 1 to 3 minutes. A dozen devices at k = 3 would still raise about 17 alarms a day.'
    }
  ],
  quiz: [
    { q: 'What does an MQTT last will do?', choices: ['Stores the device\'s settings', 'Makes the broker publish a message if the device vanishes without disconnecting', 'Encrypts the heartbeat', 'Restarts the device'], a: 1, why: 'The device registers the message when it connects. If the connection breaks without a proper disconnect, the broker publishes it on the device\'s behalf.' },
    { q: 'Heartbeats are lost 20 % of the time. What is the chance that three in a row are lost?', choices: ['0.8 %', '6 %', '20 %', '60 %'], a: 0, why: 'The chance is 0.2 cubed, 0.008, which is 0.8 %. Multiplying 0.2 by 3 would be the mistake behind the larger answers.' },
    { q: 'Why include a sequence number in each heartbeat?', choices: ['To save data', 'To tell lost messages (gaps) from a device that has gone silent', 'To order the firmware versions', 'To encrypt the message'], a: 1, why: 'A gap in the sequence means messages were lost on the way; no further numbers at all means the device itself has stopped.' },
    { q: 'A roll-out is "staged" but the devices report nothing after updating. What is missing?', choices: ['Nothing', 'The health signal that lets the roll-out halt itself when the new version fails', 'A larger image', 'A longer interval'], a: 1, why: 'Staging only helps if something decides, from reports, whether a ring was healthy. Without them the stages just make the release slow.' }
  ],
  applications: [
    'A dashboard counting devices online by firmware version during a release.',
    'An alert that fires when a device has missed four heartbeats in a row.',
    'A retained status topic that a home-automation hub reads to show which sensors are alive.',
    'An automatic halt of a roll-out when the early ring reports resets after the update.'
  ],
  sources: [
    'The MQTT 3.1.1 specification (OASIS), the will message and retained messages.',
    'Arduino-ESP32 documentation and the PubSubClient library\'s README; MicroPython\'s umqtt.simple.',
    'The documentation of the dashboard or alerting tool you use for the fleet.'
  ]
}
);
