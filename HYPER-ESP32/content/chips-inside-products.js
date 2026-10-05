/* HYPER-ESP32 · content/chips-inside-products.js
 *
 * ESP chips inside products: Zigbee and Thread boards, border-router hardware, Shelly and Sonoff devices, what happened
 * to Tuya modules, WLED controllers, Home Assistant voice and presence hardware, u-blox modules with an ESP inside,
 * the chip used as a modem, and the rules of reflashing a commercial device.
 *
 * Product and chip facts come from the catalogue (Hyper.esp.PRODUCTS, BOARDS, CHIPS), read on 2026-10-04.
 */
Hyper.add(
/* ================================================================ zigbee-and-thread-boards */
{
  id: 'zigbee-and-thread-boards',
  parent: 'chips-inside-products',
  title: 'Boards for Zigbee and Thread',
  level: 2,
  short: 'Zigbee and Thread need an 802.15.4 radio, which only three ESP chips have: the H2, the C6 and the C5. Which one suits an end device, which a router, and which boards carry them.',
  keywords: ['Zigbee', 'Thread', '802.15.4', 'ESP32-H2', 'ESP32-C6', 'ESP32-C5', 'end device', 'router', 'coordinator', 'Matter over Thread', 'NanoH2', 'NanoC6', 'H2 DevKit', 'zczr'],
  prereq: ['soc-esp32-c6', 'soc-esp32-h2', 'chip-module-board'],
  related: ['ieee-802-15-4', 'zigbee-on-esp', 'openthread-on-esp', 'esp32-h2-devkit', 'c-series-devkits', 'xiao-esp32c6-and-c5', 'thread-border-router-hardware', 'matter-on-esp', 'sleepy-ble-zigbee-thread'],
  body: `Zigbee and Thread are the two radio networks of the smart home that do not use Wi-Fi: small, frugal, and able to relay one another's messages so that a house is covered by a mesh. Both ride on **IEEE 802.15.4**, a low-rate 2.4 GHz radio that the ESP32, S2, S3 and C3 simply do not contain. To build a Zigbee or Thread device with an ESP you need one of three chips: the ESP32-H2, the ESP32-C6 or the ESP32-C5. ([[ieee-802-15-4]] explains the radio itself.)

### The three chips side by side

| | ESP32-H2 | ESP32-C6 | ESP32-C5 |
|---|---|---|---|
| Wi-Fi | none | Wi-Fi 6, 2.4 GHz | Wi-Fi 6, 2.4 and 5 GHz |
| Bluetooth LE | 5.3 | 5.3 | 6.0 |
| 802.15.4 | Zigbee 3.0, Thread 1.4 | Zigbee 3.0, Thread 1.3 | Zigbee 3.0, Thread 1.4 |
| Processor | 96 MHz RISC-V | 160 MHz RISC-V | 240 MHz RISC-V |
| RAM · GPIO | 320 KB · 19 | 512 KB · 30 | 384 KB · 29 |
| Receive current | 25 mA | 82 mA | 110 mA |
| Deep sleep | 7 µA | 7 µA | 12 µA |
| Boards in the catalogue | 6 | 45 | 19 |

(The figures are the catalogue's; [the chip explorer](#/tools/chips?c=esp32-h2) has every chip.)

### Which chip for which job

- **A sensor or button on a battery** (door contact, temperature probe, wall switch): the H2. With no Wi-Fi it has no Wi-Fi peaks to feed, and its receiver draws a third of the C6's.
- **A device that is always powered** (a plug, a bulb, a relay): any of the three. A router must stay awake to relay, so it must be mains-powered. The C6 is the convenient one, since it also speaks Wi-Fi and Bluetooth LE, which Matter uses to commission a device from a phone.
- **A gateway** that joins the mesh to the home network needs both a mesh radio and an IP link: see [[thread-border-router-hardware]].
- **A quieter band** for the Wi-Fi side: the C5, the only one that also uses 5 GHz.

### The boards

Espressif's own **ESP32-H2-DevKitM-1** (two USB-C sockets, RGB LED on GPIO8) and the C6 DevKitC-1 and DevKitM-1 are the reference boards. At the small end are the M5Stack **NanoH2** and **NanoC6**, 12 × 23.5 mm with USB-C, an infrared transmitter and a Grove port, and the XIAO ESP32C6. The Olimex **ESP32-H2-DevKit-LiPo** adds a LiPo connector and a Qwiic socket for battery sensors. Cheap SuperMini clones exist; their sizes and pin lists vary by seller. An H2 board cannot join Wi-Fi, so it is flashed and debugged over USB.

### Software

The Arduino core has a Zigbee library for the C6 and H2 (the C5 is listed too) and an OpenThread library for all three. Both need the right Tools menu choices: a Zigbee mode (end device, or coordinator and router) and a partition scheme with room for Zigbee's storage. MicroPython has neither. On the C6 and C5 the 802.15.4 and Wi-Fi radios share the 2.4 GHz band and take turns, so a busy Wi-Fi link slows the mesh.

> [!key] Only the ESP32-H2, C6 and C5 can join a Zigbee or Thread mesh. Choose the H2 for a battery end device, the C6 for a mains-powered node that also needs Wi-Fi or Bluetooth LE, and the C5 when 5 GHz matters.`,
  ideas: [
    'Zigbee and Thread both need an IEEE 802.15.4 radio; only the ESP32-H2, C6 and C5 have one.',
    'The H2 has no Wi-Fi and the lowest receive current, which suits battery end devices.',
    'A router must stay awake to relay messages, so routers belong on mains power.',
    'The Arduino Zigbee and OpenThread libraries need matching Tools menu settings; MicroPython has neither.'
  ],
  pitfalls: [
    'Any ESP32 board can be a Zigbee device with a library — Without an 802.15.4 radio in the chip there is nothing to run it on. The ESP32, S2, S3 and C3 cannot, whatever the library says.',
    'An H2 board is a C6 board without Wi-Fi, so I can update it over the air — It cannot join Wi-Fi, so an H2 is flashed over USB, or over the mesh itself where the firmware supports that.',
    'A battery-powered device can be a Zigbee router — Routers listen all the time to relay; a device that sleeps can only be an end device.'
  ],
  terms: [
    { term: 'IEEE 802.15.4', also: ['802.15.4', 'low-rate wireless personal area network'], def: 'The radio standard under Zigbee and Thread: 2.4 GHz, 250 kbit/s, small frames, very low power. Wi-Fi chips lack it; the ESP32-H2, C6 and C5 have it.' },
    { term: 'Zigbee', also: ['Zigbee 3.0'], def: 'A mesh network for sensors, lights and switches, built on 802.15.4, with a coordinator that forms the network, routers that relay and end devices that may sleep.' },
    { term: 'Thread', also: ['OpenThread'], def: 'An IPv6 mesh network on 802.15.4 that gives every device an IP address. It needs a border router to reach the home network. OpenThread is the open-source implementation Espressif uses.' },
    { term: 'End device', also: ['sleepy end device', 'ED'], def: 'A node of a mesh that does not relay for others, so it may sleep between messages and live for years on a small battery.' },
    { term: 'Router', also: ['mesh router'], def: 'A node that stays awake to forward other nodes\' messages and extend the mesh. It must be mains-powered.' }
  ],
  choose: {
    good: ['Battery sensors and switches on the H2: no Wi-Fi, low receive current', 'Mains nodes that also need Wi-Fi or Bluetooth LE commissioning: the C6', 'Learning Zigbee or Thread on an inexpensive board with an official reference design'],
    avoid: ['Any chip without 802.15.4 (ESP32, S2, S3, C3): they cannot join the mesh', 'MicroPython projects: no official Zigbee or Thread support', 'Battery routers: a router never sleeps'],
    check: ['That the board exposes the pins you need: some thumb-sized C6 boards expose about twenty', 'Which Zigbee or Thread version the chip and the library implement', 'Whether the antenna is on the board or a connector, and where metal sits near it']
  },
  code: [
    {
      title: 'A Zigbee on/off light',
      about: 'The board joins a Zigbee network as an *end device* that shows up in the hub as a light. Put the hub in pairing mode, then reset the board. In the Tools menu choose Zigbee Mode = end device and a Zigbee partition scheme before building.',
      needs: 'An ESP32-C6 or ESP32-H2 DevKit, and a Zigbee hub in pairing mode.',
      wiring: [['GPIO8', 'the RGB LED on the board', 'its pin on the C6 and H2 DevKits']],
      blocks: `
        when started
          start serial at (115200) baud
          add Zigbee light on endpoint (10) :: radio
          start Zigbee as [end device v] :: radio
          repeat until <Zigbee joined the network?> :: radio
            wait (0.1) seconds
          end
          print [joined the Zigbee network]

        when Zigbee light is switched (state) :: radio
          set pin (8) to (state)
      `,
      cpp: String.raw`
        #include <Arduino.h>
        #ifndef ZIGBEE_MODE_ED
        #error "Select Tools > Zigbee Mode > Zigbee ED (end device)"
        #endif
        #include "Zigbee.h"

        #define ZIGBEE_LIGHT_ENDPOINT 10
        ZigbeeLight zbLight(ZIGBEE_LIGHT_ENDPOINT);

        void setLED(bool on) { digitalWrite(RGB_BUILTIN, on); }   // GPIO8: white when on

        void setup() {
          Serial.begin(115200);
          pinMode(RGB_BUILTIN, OUTPUT);
          zbLight.setManufacturerAndModel("Espressif", "ZBLightBulb");
          zbLight.onLightChange(setLED);
          Zigbee.addEndpoint(&zbLight);                      // add endpoints BEFORE begin()
          if (!Zigbee.begin()) { Serial.println("Zigbee failed to start"); ESP.restart(); }
          while (!Zigbee.connected()) { delay(100); }        // joins when the hub is in pairing mode
          Serial.println("joined the Zigbee network");
        }

        void loop() { delay(100); }                          // Zigbee.factoryReset() forgets the network
      `,
      na: { py: 'MicroPython has no Zigbee support in its official builds: this needs C++ (or ESP-IDF).' },
      notes: ['Add every endpoint before calling begin(); an endpoint added afterwards is ignored.', 'On an H2 the same sketch works; the board has no Wi-Fi to fall back on, so a failed join shows only on the serial port.', 'To act as a router instead, build with Zigbee Mode = coordinator/router; the sketch stays the same shape.']
    }
  ],
  examples: [
    {
      title: 'How big a battery does a door sensor need?',
      q: 'A Zigbee door sensor on an H2 wakes once a day for a 2 s check-in at the receive current in the table above, and sleeps the rest of the time. Roughly what average current is that, and is the sleep or the check-in the bigger part?',
      steps: ['Sleep: 7 µA for 86 398 s of the day. Check-in: 25 mA for 2 s.', 'Charge per day: sleep 7 µA × 86 398 s = 0.60 As; check-in 25 mA × 2 s = 0.05 As.', 'Average: about 0.65 As ÷ 86 400 s = 7.5 µA.'],
      a: 'About 7.5 µA, almost all of it sleep. A real sensor also reads its contact and sends reports, so measure it: the chip\'s sleep current, not its receive current, sets the battery life of a mostly sleeping device.'
    }
  ],
  quiz: [
    { q: 'Which of these chips can run a Zigbee end device?', choices: ['ESP32-S3', 'ESP32-C3', 'ESP32-H2', 'ESP32'], a: 2, why: 'Only the H2, C6 and C5 carry the 802.15.4 radio Zigbee needs. The S3, C3 and the original ESP32 have Wi-Fi and Bluetooth only.' },
    { q: 'A door sensor sleeps for hours and wakes to send a report. In a Zigbee network it should be a...', choices: ['coordinator', 'router', 'end device', 'border router'], a: 2, why: 'End devices may sleep. A router must stay awake to relay other nodes\' messages, so a battery sensor cannot be one.' },
    { q: 'An ESP32-H2 board can use Wi-Fi when Zigbee is busy.', a: false, why: 'The H2 has no Wi-Fi; it carries 802.15.4 and Bluetooth LE only. The C6 and C5 have all three radios.' },
    { q: 'You build the Arduino Zigbee light example and the compiler stops with an error about the Zigbee mode. What do you change?', choices: ['The baud rate', 'The Tools menu: Zigbee Mode and the partition scheme', 'The GPIO number of the LED', 'The Wi-Fi password'], a: 1, why: 'The Zigbee library is built for one mode at a time, chosen in the Tools menu, and needs a partition scheme with Zigbee storage. The sketch checks the setting and stops with an error if it is wrong.' }
  ],
  applications: [
    'Battery door, window and temperature sensors that join a Zigbee hub.',
    'Mains plugs and lamps that act as routers and make the mesh reach the far rooms.',
    'Matter-over-Thread devices commissioned from a phone over Bluetooth LE.',
    'Learning and testing a Zigbee or Thread network on a bench with a NanoH2 or a C6 DevKit.'
  ],
  sources: [
    'Espressif, *ESP32-H2*, *ESP32-C6* and *ESP32-C5 Series Datasheets*: radio features, currents, pin counts.',
    'Espressif, *Arduino-ESP32 documentation*: Zigbee and OpenThread libraries (core 3.3).',
    'IEEE 802.15.4 standard; Connectivity Standards Alliance, *Zigbee specification*.'
  ],
  sim: 'cp-802154-chips'
},

/* ================================================================ thread-border-router-hardware */
{
  id: 'thread-border-router-hardware',
  parent: 'chips-inside-products',
  title: 'Thread border router hardware',
  level: 2,
  short: 'A Thread border router has two radios facing two networks: an 802.15.4 mesh on one side, Wi-Fi or Ethernet on the other. Espressif\'s design pairs an ESP32-S3 with an ESP32-H2; here is what is on the boards and why.',
  keywords: ['border router', 'OTBR', 'RCP', 'radio co-processor', 'Spinel', 'ESP Thread Border Router', 'CoreS3 Thread', 'T-Panel', 'ESP32-H2', 'ESP32-S3', 'W5500', 'Zigbee gateway', 'dongle'],
  prereq: ['zigbee-and-thread-boards', 'soc-esp32-s3', 'soc-esp32-h2'],
  related: ['thread-border-router', 'openthread-on-esp', 'esp-at-and-esp-hosted', 'thread', 'matter', 'ethernet-and-poe-boards'],
  body: `A Thread network is a mesh of small devices that speak IPv6 over 802.15.4. Your phone, your hub and your cloud do not: they speak Wi-Fi or Ethernet. The **border router** is the box with a foot in both worlds. It forwards IPv6 packets between the mesh and the home network, so that a phone can reach a Thread bulb, and it advertises the Thread network on the home network so that hubs can find it.

### Two radios, one host

A border router therefore needs an 802.15.4 radio, an IP link, and enough processor to run the network stack. Espressif's reference design splits the job over two chips:

- an **ESP32-S3** is the *host*: it runs the OpenThread stack, the border-routing software and the Wi-Fi or Ethernet side;
- an **ESP32-H2** is a **radio co-processor** (RCP): it does nothing but the 802.15.4 radio, and takes its orders from the S3 over a serial link using a protocol called Spinel.

The catalogue lists three boards built this way: Espressif's **ESP Thread Border Router / Zigbee Gateway board** (an S3 module with 8 MB of flash and 2 MB of PSRAM next to an H2-MINI, USB-C on each chip, and an optional sub-board with a W5500 Ethernet controller and RJ45), the **M5Stack CoreS3 Thread Border Router** (the same pair behind a 2-inch touch screen, with a camera and a 500 mAh battery) and the **LilyGO T-Panel** (an S3 and an H2 behind a 480 × 480 touch panel, with RS485 and CAN). The same H2 can serve a Zigbee gateway instead, which is why Espressif's board has both names.

### Why two chips and not one

The ESP32-C6 has Wi-Fi and 802.15.4 on one die, and can in principle play both parts. But the two radios share the 2.4 GHz band and take turns, and a border router carries everybody's traffic. Splitting the work gives the mesh its own radio and its own antenna. The price is a second chip and a serial link.

### Other ESP-in-a-radio-box products

Not every Thread or Zigbee radio in the catalogue is an ESP radio. The **Home Assistant Connect ZBT-2** uses a Silicon Labs MG24 for Zigbee and Thread, with an ESP32-S3 only as the USB-to-serial bridge. The **Sonoff Dongle Max** pairs a Silicon Labs EFR32MG24 radio with an ESP32 that runs the Ethernet and Wi-Fi side. Look inside before assuming which chip does what.

### Checking a border router

Once the network exists, the OpenThread command line is the stethoscope. These lines start a new network on a device and report its role; after about ten seconds a lone device reports *leader*:

~~~sh
dataset init new
dataset commit active
ifconfig up
thread start
state
~~~

> [!key] A Thread border router is an IPv6 bridge between an 802.15.4 mesh and Wi-Fi or Ethernet. Espressif's design uses an ESP32-S3 as the host and an ESP32-H2 as a radio co-processor, so that the mesh has a radio of its own.`,
  ideas: [
    'A border router forwards IPv6 between the Thread mesh and the home network and advertises the mesh to hubs.',
    'Espressif\'s design: an ESP32-S3 host runs the stack, an ESP32-H2 radio co-processor only does 802.15.4.',
    'The H2 takes its orders from the S3 over a serial link; the host decides everything.',
    'Some Zigbee and Thread dongles hold an ESP only as a USB bridge or network side, not as the mesh radio.'
  ],
  pitfalls: [
    'A border router is the Thread network — The network lives in the mesh itself and survives a border router going off; without one the mesh simply cannot be reached from outside. A mesh may have several border routers.',
    'The ESP32-H2 in the board is a second computer running the Thread stack — It is a radio co-processor: all the logic is on the S3. The H2 has its own firmware but no decisions.',
    'Any board with an ESP32-C6 is a border router — The C6 has the radios, but a border router also needs the border-routing software and, for a busy network, a radio of its own.'
  ],
  terms: [
    { term: 'Border router', also: ['OTBR', 'Thread border router'], def: 'A device that connects a Thread mesh to another IP network such as Wi-Fi or Ethernet, forwarding packets and advertising the Thread network to hubs and phones.' },
    { term: 'Radio co-processor', also: ['RCP'], def: 'A chip that runs only the radio, leaving the network stack to a host. The ESP32-H2 on Espressif\'s border router board is one; the host sends it commands over a serial link.' },
    { term: 'Spinel', also: ['Spinel protocol'], def: 'The serial protocol by which an OpenThread host controls a radio co-processor: commands, received frames and status travel as small framed messages.' },
    { term: 'Network co-processor', also: ['NCP'], def: 'The other split: the radio chip runs the whole Thread stack and the host only sends high-level commands. In an RCP design the host runs the stack instead.' }
  ],
  choose: {
    good: ['Evaluating a Thread network with Espressif\'s own board and its official examples', 'A touch-screen border router for a wall: the CoreS3 Thread Border Router or the T-Panel', 'A second border router to remove the single point of failure'],
    avoid: ['Using a single board to do heavy Wi-Fi traffic and carry the mesh at once, without testing', 'Treating a dongle as a router: a radio stick needs a host computer running the software', 'Buying a dongle for the chip you hope is inside: the product page names it'],
    check: ['Which chip is the host and which is the radio', 'Whether the link to the home network is Wi-Fi, Ethernet or both', 'That the firmware you want to run supports that exact board']
  },
  code: [
    {
      title: 'A Thread node that reports its role',
      about: 'Starts a new Thread network on an ESP32-H2 or C6 and prints the node\'s role every three seconds: *detached*, then *leader* once it has formed the network. To join a network that a border router already runs, load that network\'s dataset instead of making a new one.',
      needs: 'An ESP32-H2 or ESP32-C6 DevKit and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start Thread node without auto-start :: radio
          create a new Thread dataset named [ESP_OpenThread] on channel (15) :: radio
          commit the dataset and bring the Thread interface up :: radio
          start Thread :: radio
        forever
          print (join [role: ] (Thread role))
          wait (3) seconds
        end
      `,
      cpp: String.raw`
        #include "OThread.h"

        OpenThread threadNode;
        DataSet dataset;

        void setup() {
          Serial.begin(115200);
          threadNode.begin(false);                    // false = do not auto-start
          dataset.initNew();                          // fresh keys for a brand-new network
          dataset.setNetworkName("ESP_OpenThread");
          dataset.setChannel(15);
          dataset.setPanId(0x1234);
          threadNode.commitDataSet(dataset);
          threadNode.networkInterfaceUp();
          threadNode.start();
        }

        void loop() {
          Serial.printf("role: %s\n", threadNode.otGetStringDeviceRole());
          delay(3000);
        }
      `,
      na: { py: 'MicroPython has no Thread support in its official builds: this needs C++ (or ESP-IDF).' },
      output: `
        role: Detached
        role: Detached
        role: Leader
      `,
      notes: ['The OpenThread library is built into the core for the C5, C6 and H2 only.', 'A network made this way has no border router: it is a mesh with no way out. Join it to a real one by using that network\'s dataset.']
    }
  ],
  quiz: [
    { q: 'In Espressif\'s Thread border router board, what does the ESP32-H2 do?', choices: ['It runs the whole Thread stack and the web interface', 'It is the radio co-processor: it handles the 802.15.4 radio under the S3\'s orders', 'It provides the Ethernet connection', 'It stores the Wi-Fi password only'], a: 1, why: 'The S3 is the host and runs the stack; the H2 is a radio co-processor that does only the 802.15.4 radio, controlled over a serial link.' },
    { q: 'The border router fails. What happens to the Thread devices in the house?', choices: ['They all stop working', 'They keep talking to one another; only the path to the home network is lost', 'They turn into Wi-Fi devices', 'They reset'], a: 1, why: 'The mesh does not live in the border router. Devices keep forwarding for each other; what is lost is the route to phones and hubs, until a border router returns.' },
    { q: 'In the Home Assistant Connect ZBT-2, what is the ESP32-S3 for?', choices: ['The Zigbee and Thread radio', 'The USB-to-serial bridge to the computer', 'Wi-Fi 6', 'Running the automations'], a: 1, why: 'The catalogue lists a Silicon Labs MG24 as the Zigbee and Thread radio and the ESP32-S3 as the USB-serial bridge.' },
    { q: 'An ESP32-C6 has both a Wi-Fi radio and an 802.15.4 radio, so a border router needs no second chip.', a: false, why: 'It can be done on one chip, but the radios share the 2.4 GHz band and take turns, and a border router carries the whole mesh\'s traffic. Espressif\'s design uses a separate H2 radio so the mesh has its own.' }
  ],
  applications: [
    'The hub in a Matter smart home that lets phones control Thread bulbs and sensors.',
    'A wall touch panel that is also a Thread border router, such as the CoreS3 version or the T-Panel.',
    'Test benches that check a Thread product against a reference border router.',
    'Gateways that bring Zigbee and Thread devices into a home automation system.'
  ],
  sources: [
    'Espressif, *ESP Thread Border Router* documentation, *Hardware Platforms* (the board and its sub-board).',
    'OpenThread documentation, *Border Router* and the *Spinel* radio co-processor protocol.',
    'Thread Group, *Thread specification*; Connectivity Standards Alliance, *Matter specification*.'
  ],
  sim: { id: 'cp-border-router', params: { view: 'mesh' } }
},

/* ================================================================ shelly-sonoff-and-smart-plugs */
{
  id: 'shelly-sonoff-and-smart-plugs',
  parent: 'chips-inside-products',
  title: 'Shelly, Sonoff and the smart plugs',
  level: 2,
  short: 'Which chip is inside a Shelly, a Sonoff or an Athom plug depends on the model and even on the board revision: ESP8266, ESP32, a C3 or C6 variant, or nothing from Espressif at all. What is inside a plug, and the safe ways to control it.',
  keywords: ['Shelly', 'Sonoff', 'Athom', 'smart plug', 'ESP8266', 'ESP8285', 'ESP32-U4WDH', 'ESP32-C3', 'ESP-Shelly-C38F', 'MINIR4M', 'BASICR4', 'relay', 'energy metering', 'local API', 'RPC'],
  prereq: ['soc-esp32-c3', 'soc-esp8266', 'relays'],
  related: ['reflashing-commercial-devices', 'tuya-modules-and-what-changed', 'tasmota', 'esphome', 'switching-mains-safely', 'mains-energy-monitoring', 'matter-on-esp'],
  body: `Open a smart plug or a wall relay and you find the same small cast: mains in, a protection fuse and varistor, a tiny power supply, a relay, often a metering chip, and a Wi-Fi module with an ESP on it. The catalogue records which ESP, as stated by the maker or by the community that has opened the device.

### Which chip, in which generation

| Product line | What the catalogue says |
|---|---|
| Shelly Gen1 (1, 1PM, 2.5, Plug S) | ESP8266, or ESP8285 in the Plug S |
| Shelly Plus (1, 1PM, 2PM, i4, Uni) | ESP32-U4WDH with 4 MB of flash; the Plus Plug S and Wall Dimmer list plain ESP32 |
| Shelly Pro | ESP32-D0WDQ6; the Pro 1 board adds a LAN8720A Ethernet PHY |
| Shelly Gen3 | "ESP-Shelly-C38F", 8 MB flash: the maker's own part name, described by the community as an ESP32-C3 derivative |
| Shelly Gen4 | "ESP-Shelly-C68F": the community says ESP32-C6 |
| Sonoff Basic R2, Mini, POW R2, S31 | ESP8285 or ESP8266 |
| Sonoff BASICR4, MINIR4, POW Elite | ESP32; the maker says only "ESP32" and the community names variants |
| Sonoff MINIR4M (Matter), S60TPF, Athom plug V3 | ESP32-C3 |
| Sonoff NSPanel Pro | Rockchip PX30: no Espressif chip |

Two lessons. **A product name does not fix the chip**: the Shelly Plus 1PM exists in a single-core 160 MHz revision sold in 2021 and a dual-core 240 MHz one later. And **"smart" does not imply ESP**: some Sonoff devices are Zigbee or Linux boards with no ESP in them.

### What is inside a plug

A mains side that is dangerous, and a low-voltage side that holds the ESP. They meet at the relay, whose contacts are the only link between the two. A metering chip reads the current and voltage of the load and reports to the ESP over a serial link. Whether the low-voltage side is **isolated** from the mains is the deciding safety question: in an isolated design the ESP floats free of the mains; in a cheap non-isolated one the whole low-voltage side sits at mains potential. The simulation below draws both.

> [!warn] Mains voltage kills. Wiring that switches or measures 110–230 V is work for a qualified person, behind isolation and in an enclosure, following the local wiring code. A bare relay board on a desk is not a product. To reflash a device you must open it, and never while it is plugged in: see [[reflashing-commercial-devices]].

### Control it without opening it

Many of these devices offer a local interface, with no cloud. A Shelly Plus device answers simple web requests on the home network: one asks it to switch, another returns its state as JSON, and it can also publish over MQTT. The program below uses the first. Shelly Gen1 devices have an older, different set of addresses. A button on a second board that switches a plug it never opens is a safe project.

> [!key] A smart plug is a mains side, a relay and a low-voltage side with an ESP, and which ESP depends on the model and the revision. Use the device's local interface where you can; opening it is a last resort, and never while it is plugged in.`,
  ideas: [
    'Shelly Gen1 and old Sonoffs use the ESP8266 family; Plus, Pro and the newer lines use ESP32 variants; Gen3 and Gen4 Shellys carry maker-named parts.',
    'The same product name can hide different chips and board revisions; some smart devices contain no Espressif chip at all.',
    'A plug is a mains side and an isolated or non-isolated low-voltage side, meeting at the relay.',
    'A local web interface lets you control a plug without opening it.'
  ],
  pitfalls: [
    'All Shelly and Sonoff devices are ESP8266 — That was true of the early ones. Newer lines use ESP32 variants, the Matter MINIR4M a locked ESP32-C3, and the NSPanel Pro a Rockchip processor.',
    'Two units of the same model have the same chip — The catalogue records single-core and dual-core revisions of one Shelly Plus model, and sources that disagree on a chip. Read the label of the unit you hold.',
    'The ESP side is low voltage, so touching it is safe — Only if the supply is isolated. A non-isolated design puts the ESP and its serial pads at mains potential.'
  ],
  terms: [
    { term: 'Local API', also: ['local control', 'RPC'], def: 'A way to control a device straight over the home network, with no cloud account. Shelly Plus devices accept web requests such as Switch.Set and return JSON.' },
    { term: 'Isolated supply', also: ['galvanic isolation'], def: 'A power supply whose output has no electrical connection to the mains, only magnetic coupling through a transformer. The low-voltage side is then safe to touch; a non-isolated supply is not.' },
    { term: 'Metering chip', also: ['energy meter IC'], def: 'A small chip that measures the current and voltage of a load and reports power, usually to the microcontroller over a serial link. Cheap plugs use parts such as the BL0937.' },
    { term: 'ESP8285', also: ['ESP8266 with flash'], def: 'An ESP8266-family chip with the flash memory inside its package, used on small devices such as the Sonoff Basic and the Shelly Plug S.' }
  ],
  choose: {
    good: ['Plugs and relays that publish a local interface or MQTT: usable with no cloud account', 'Devices sold with open firmware already on them (the catalogue lists Athom plugs sold with ESPHome or Tasmota)', 'A Matter version of a plug when the hub supports Matter'],
    avoid: ['Opening a mains device on the strength of a forum post about a different revision', 'Relying on a cloud feature of a device you plan to reflash', 'Buying a device because "it is an ESP": the catalogue shows chips changing within a model'],
    check: ['The chip and revision of the unit, from its label or the maker\'s page', 'Whether the supply is isolated before any serial connection is considered', 'Whether the flash is locked, as on the Matter MINIR4M']
  },
  code: [
    {
      title: 'A button that switches a Shelly plug',
      about: 'Each press of the button flips the plug on or off by asking it over the home network. The ESP board is low voltage and never touches the mains; the plug is used as shipped. The address is the plug\'s own, from your router. Change `Switch.Set` for the call your device supports.',
      needs: 'Any ESP32 board, a push button, and a Shelly Plus plug (or another Shelly with the Gen2 local interface) on the same Wi-Fi.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          connect to Wi-Fi [your-ssid] password [your-password]
          set [plug on v] to <false>
          set [was pressed v] to <false>
        forever
          set [pressed v] to <(read pin (4)) = [LOW v]>
          if <<(pressed)> and <not <was pressed>>> then
            set [plug on v] to <not <plug on>>
            set [reply v] to (http get (join [http://192.168.1.50/rpc/Switch.Set?id=0&on=] (plug on)))
            print (reply)
          end
          set [was pressed v] to (pressed)
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *PLUG = "192.168.1.50";       // the plug's address on your network
        const int BUTTON = 4;                    // button to GND

        bool plugOn = false;
        bool wasPressed = false;

        void setPlug(bool on) {
          NetworkClient client;
          HTTPClient http;
          String url = String("http://") + PLUG + "/rpc/Switch.Set?id=0&on=" + (on ? "true" : "false");
          if (http.begin(client, url)) {
            int code = http.GET();
            Serial.printf("plug %s -> HTTP %d\n", on ? "on" : "off", code);
            http.end();
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) {          // act on the press, not on the hold
            plugOn = !plugOn;
            setPlug(plugOn);
          }
          wasPressed = pressed;
          delay(20);                             // crude debounce
        }
      `,
      py: String.raw`
        import network, requests, time
        from machine import Pin

        PLUG = "192.168.1.50"                    # the plug's address on your network
        button = Pin(4, Pin.IN, Pin.PULL_UP)     # button to GND

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        def set_plug(on):
            url = "http://" + PLUG + "/rpc/Switch.Set?id=0&on=" + ("true" if on else "false")
            r = requests.get(url, timeout=5)
            print("plug", "on" if on else "off", "-> HTTP", r.status_code)
            r.close()

        plug_on = False
        was_pressed = False
        while True:
            pressed = button.value() == 0
            if pressed and not was_pressed:      # act on the press, not on the hold
                plug_on = not plug_on
                set_plug(plug_on)
            was_pressed = pressed
            time.sleep_ms(20)                    # crude debounce
      `,
      output: `
        plug on -> HTTP 200
        plug off -> HTTP 200
      `,
      notes: ['Do not leave real credentials in shared code ([[credentials-handling]]).', 'Reserve the plug\'s address in the router so that it does not change.', 'A Gen1 Shelly uses a different address form for its relay; look it up in the maker\'s documentation for that generation.']
    }
  ],
  quiz: [
    { q: 'You buy a second Shelly Plus 1PM and the first one\'s ESPHome configuration fails on it. A likely reason?', choices: ['Shelly changed the product name', 'The two units are different board revisions: one single-core, one dual-core', 'ESPHome supports only one unit', 'Plus devices have no ESP'], a: 1, why: 'The catalogue records two PCB revisions of the Plus 1PM, a single-core 160 MHz one sold in 2021 and a dual-core 240 MHz one, so a configuration written for one may not fit the other.' },
    { q: 'What makes it safe or unsafe to touch the serial pads of a plug that is plugged in?', choices: ['Whether the plug has Wi-Fi', 'Whether its low-voltage side is isolated from the mains', 'The colour of the housing', 'The size of the relay'], a: 1, why: 'In a non-isolated design the ESP and its pads sit at mains potential. Even with an isolated supply you never open a device while it is plugged in.' },
    { q: 'The Sonoff NSPanel Pro contains no ESP32.', a: true, why: 'The catalogue lists a Rockchip PX30 in it, and a Silicon Labs chip for Zigbee in the second generation. Not every smart device is an ESP.' },
    { q: 'Your goal is to switch a Shelly Plus plug from a button on a separate ESP32 board. What is the least risky route?', choices: ['Reflash the plug with your own firmware', 'Send it web requests over the local network', 'Open it and solder to the relay', 'Replace its Wi-Fi module'], a: 1, why: 'The plug\'s own local interface does the job with no change to the device, its warranty or its safety approval.' }
  ],
  applications: [
    'A wall switch built from a button and an ESP board that switches a Shelly relay elsewhere in the house.',
    'Energy monitoring: plugs whose metering chip reports power to a home automation system.',
    'Replacing cloud control of a plug with MQTT or a local API for privacy and reliability.',
    'Identifying a device\'s chip from the maker\'s page before deciding whether to reflash it.'
  ],
  sources: [
    'Shelly, *Technical documentation*: the Gen2+ device API (the Switch component) and the knowledge-base page of each product.',
    'ESPHome, *Devices* database, entries for Shelly, Sonoff and Athom products; Blakadder, *Templates* database.',
    'Espressif, *ESP8266EX* and *ESP32 Series Datasheets* (the chips named in the table).'
  ],
  sim: ['cp-smart-plug', { id: 'cp-esp-inside', params: { set: 'products', maker: 'Shelly (Allterco)' } }]
},

/* ================================================================ tuya-modules-and-what-changed */
{
  id: 'tuya-modules-and-what-changed',
  parent: 'chips-inside-products',
  title: 'Tuya modules and what changed',
  level: 2,
  short: 'Early Tuya Wi-Fi modules held an ESP8266, so a generation of white-label plugs and bulbs could run open firmware. Newer modules use Beken, Realtek and Tuya\'s own chips, and the ESP tools do not work on them.',
  keywords: ['Tuya', 'TYWE3S', 'TYWE2S', 'WB3S', 'WBR3', 'WR3', 'T3', 'BK7231', 'RTL8710', 'white label', 'ESP8266', 'ESP8285', 'smart plug', 'module swap', 'Tuya MCU', 'ZT3L'],
  prereq: ['shelly-sonoff-and-smart-plugs', 'soc-esp8266', 'what-a-module-adds'],
  related: ['reflashing-commercial-devices', 'esphome', 'tasmota', 'esp-at-and-esp-hosted', 'clones-and-counterfeits', 'flashing-and-esptool'],
  body: `For years Tuya sold Wi-Fi modules and a cloud to hundreds of brands of plugs, bulbs, switches and sensors, so that a maker could ship a smart device without designing a radio. The first popular modules carried an **ESP8266**, which is why so much of the open-firmware world — Tasmota, ESPHome — grew around "convert a Tuya device". Then the modules changed, and the hobby quietly lost the guarantee that a smart plug had an ESP in it.

### What the catalogue records

| Module | Chip | Notes |
|---|---|---|
| TYWE3S | ESP8266, 2 MB flash | 16 × 24 mm, 9 GPIO: the module in many older devices |
| TYWE2S | ESP8285, 1 MB flash | 17.3 × 15 mm, 5 GPIO |
| WB3S | Beken BK7231T | Wi-Fi and Bluetooth LE; **not an ESP** |
| WBR3S | Realtek RTL8720CS | Wi-Fi and BLE; not an ESP |
| WBR3 | a "W701" RF chip | named in Tuya's datasheet; not an ESP |
| WR3, WR3E, WR3N | Realtek RTL8710BN | not ESP32-C3-based, despite the look-alike |
| T3-U | Tuya's own T3 chip: up to 320 MHz, 640 KB SRAM, 4 MB flash | Wi-Fi 6 and BLE; not an ESP |

Espressif chips have not vanished from Tuya's world: the catalogue lists a 480 × 480 touch panel with an **ESP32-S3** running the display, wired to a Tuya Zigbee module on a serial port. A sibling sold as "T3E Pro" is Zigbee-only, with no ESP32 inside. The name does not tell you.

### Why it matters to you

- **The tools differ.** An ESP chip answers the ESP flashing tool and runs open firmware built for it. A Beken or Realtek chip needs other tools and other firmware projects; some communities build firmware for those chips, but a guide for the ESP8266 does not apply.
- **Modules look alike.** Makers choose pin-compatible footprints, so a replacement module of a different brand fits the same board, and the maker may swap it between production batches with no change of name.
- **The module may be a modem.** In many Tuya designs the module is not the brain: a separate microcontroller runs the device, and the module talks to it over a serial link in Tuya's own protocol. ESPHome has a component for that case. It is the same idea as [[esp-at-and-esp-hosted]].
- **The module is a certified part.** Its radio approval travels with the product.

### Finding out what is inside

Before touching a screwdriver: read the listing and the maker's page; search the community databases for your exact model (ESPHome's device list and the Blakadder templates record chips and board photos, per revision); look at the regulatory filing, which usually has internal photos. Only when the housing is open does the chip marking settle it. A serial connection at the right speed also tells: an ESP8266's boot ROM prints its first message at 74 880 baud, an ESP32's at 115 200. Opening a mains device is covered in [[reflashing-commercial-devices]].

> [!key] Old Tuya modules held an ESP8266, newer ones hold Beken, Realtek or Tuya's own chips: the brand and the shape no longer tell you which. Identify the chip of your exact unit before planning anything.`,
  ideas: [
    'Early Tuya modules (TYWE3S, TYWE2S) held an ESP8266 or ESP8285, which is why open firmware grew around them.',
    'Newer modules use Beken, Realtek and Tuya\'s own T3 chips; the ESP tools and ESP firmware do not apply.',
    'Many Tuya devices are a Wi-Fi module serving a separate microcontroller over a serial protocol.',
    'The exact unit decides the chip: check databases, filings and the board itself, not the brand.'
  ],
  pitfalls: [
    'A Tuya device is an ESP, so a Tasmota guide will work — That held for the ESP8266 modules. A WB3S is a Beken chip and a WBR3S a Realtek; guides for ESP chips do not apply to them.',
    'The module name tells me the chip family — Footprints are shared, and a maker may fit a different chip in a later batch. Read the marking of your unit.',
    'Every chip on a Tuya board is an ESP or a Tuya chip — Some designs pair an ESP32-S3 with a separate Tuya Zigbee module, and the Zigbee-only versions have no ESP at all.'
  ],
  terms: [
    { term: 'Tuya module', also: ['Tuya Wi-Fi module', 'TYWE3S', 'WB3S'], def: 'A small certified Wi-Fi (and often Bluetooth LE) module that Tuya supplies to device makers, with firmware that talks to Tuya\'s cloud. The chip inside has changed between generations.' },
    { term: 'Tuya serial protocol', also: ['Tuya MCU mode', 'Tuya MCU protocol'], def: 'The framed serial protocol by which a Tuya module exchanges data points with the product\'s own microcontroller, so that the module acts as a network modem for it.' },
    { term: 'Pin-compatible', also: ['drop-in replacement', 'footprint-compatible'], def: 'Having the same size and pad layout as another part, so that either fits the same board. It says nothing about the chip inside.' },
    { term: 'ESP8285', also: [], def: 'An ESP8266-family chip with flash memory inside the package, used on small modules such as the TYWE2S.' }
  ],
  choose: {
    good: ['Older devices with a TYWE3S or TYWE2S module: an ESP8266 whose flashing is well documented', 'Devices that are sold with open firmware or that publish a local API', 'Checking a community database entry for your exact model and revision'],
    avoid: ['Buying "any Tuya plug" for reflashing without checking the chip', 'Following an ESP8266 guide for a Beken or Realtek device', 'Assuming a same-looking replacement module is the same chip'],
    check: ['The chip marking or module name of the unit you hold', 'Whether a separate microcontroller sits beside the module', 'Whether the maker has changed the module between batches']
  },
  quiz: [
    { q: 'Which module in the catalogue is an ESP8266?', choices: ['WB3S', 'TYWE3S', 'WBR3S', 'T3-U'], a: 1, why: 'The TYWE3S holds an ESP8266 with 2 MB of flash. The WB3S is a Beken chip, the WBR3S a Realtek one and the T3-U Tuya\'s own T3 silicon.' },
    { q: 'You find a smart plug with a WB3S module and a guide that flashes an ESP8266 plug. Will the guide work?', choices: ['Yes: Wi-Fi modules are all alike', 'No: the WB3S is a Beken chip, outside the ESP tools and firmware', 'Yes, with a different baud rate', 'Only after removing the module'], a: 1, why: 'The WB3S is not an Espressif chip, so the ESP flashing tools and firmware do not apply to it.' },
    { q: 'A Tuya product is described as having an ESP32-S3 and a Tuya Zigbee module. Which statement fits?', choices: ['One chip does everything', 'The S3 runs the display; a separate Tuya module handles Zigbee over a serial link', 'The Zigbee module is inside the S3', 'The S3 is only a USB bridge'], a: 1, why: 'The catalogue describes a panel whose ESP32-S3 drives the screen and talks to a Tuya Zigbee module over a serial port.' },
    { q: 'Two plugs of the same model and brand always contain the same chip.', a: false, why: 'Makers may fit another pin-compatible module between production batches, and the name does not change. Check the unit you own.' }
  ],
  applications: [
    'Deciding, before buying, whether a cheap plug can run open firmware.',
    'Reading a device database entry for the chip and the revision of a specific model.',
    'Telling a device that is a modem for a hidden microcontroller from one that is its own brain.',
    'Planning a local-only smart home that does not depend on a vendor cloud.'
  ],
  sources: [
    'Tuya developer documentation, module datasheets for the TYWE3S, TYWE2S, WB3S, WBR3S, WBR3, WR3 family and T3-U.',
    'ESPHome, *Devices* database, and the ESPHome *Tuya* component documentation.',
    'Espressif, *ESP8266EX Datasheet*: the boot ROM message rate.'
  ],
  sim: { id: 'cp-esp-inside', params: { set: 'products', maker: 'Tuya' } }
},

/* ================================================================ wled-controllers */
{
  id: 'wled-controllers',
  parent: 'chips-inside-products',
  title: 'WLED controllers',
  level: 2,
  short: 'WLED turns an ESP into a pixel-LED controller with effects, presets and a web page. Ready-made boards from QuinLED, Gledopto, Athom, Adafruit and Waveshare add the level shifter, the fuse and the power terminals the bare ESP lacks.',
  keywords: ['WLED', 'QuinLED', 'Dig-Uno', 'Dig-Quad', 'Dig-Octa', 'Gledopto', 'Athom', 'Sparkle Motion', 'WS2812B', 'SK6812', 'level shifter', 'power injection', 'LED strip', 'JSON API', 'DDP', 'xLights'],
  prereq: ['shelly-sonoff-and-smart-plugs', 'addressable-leds', 'soc-esp32'],
  related: ['wled', 'powering-led-strips', 'esphome', 'home-assistant-integration', 'level-shifters', 'rgb-leds', 'rest-apis-and-json'],
  body: `WLED is open-source firmware that makes an ESP drive strips and matrices of addressable LEDs. You flash it once, join the board to your Wi-Fi, and everything else — colours, a hundred effects, segments, presets, synchronising several controllers — is done from a web page or a phone, or from Home Assistant. Version 16 is current as of October 2026. It runs on the ESP8266 and on the ESP32, S2, S3 and C3 families; the catalogue notes that Adafruit chose the **classic ESP32** for its Sparkle Motion board "for best WLED support".

### What a controller board adds

A bare ESP board can run WLED, but a strip of 5 V pixels needs more than the chip can give:

- a **level shifter**, because the ESP's 3.3 V data signal is marginal for a 5 V pixel, which wants about 3.5 V to see a one;
- a small **series resistor** on the data line and a large **capacitor** across the supply;
- **power terminals and a fuse**, since a long strip draws tens of amps;
- often an I2S **microphone** for sound-reactive effects, Ethernet, or an SD card.

### Boards in the catalogue

| Board | What it is |
|---|---|
| QuinLED Dig-Uno, Dig-Quad | ESP32-WROOM-32E on a top board; sold with WLED already on it |
| QuinLED Dig-Octa Brainboard | ESP32-WROOM-32UE with an external antenna, 8 level-shifted outputs, LAN8720A Ethernet, microSD |
| Gledopto GL-C-309WL / 310WL | ESP32 digital controllers; the 310WL adds an I2S microphone |
| Athom light-strip and RGBCCT controllers | ESP32-C3; Athom's LS8P, high-power and Ethernet models use an ESP32 |
| Adafruit Sparkle Motion | classic ESP32, 3 level-shifted outputs, 5 A fuse, I2S microphone, USB-C power delivery |
| Waveshare ESP32-S3-RS485-WLED | ESP32-S3, two strip outputs, isolated RS485, DIN-rail case |

### Two numbers to respect

**Current.** A pixel at full white draws about 60 mA, so a metre of 60 pixels asks for 3.6 A and a 300-pixel strip for 18 A, which is 90 W at 5 V. WLED has a maximum-current setting that lowers the brightness before the supply is overloaded. **Time.** Each pixel takes 24 bits at 1.25 µs per bit, 30 µs, so 300 pixels need 9 ms per frame, about 110 frames a second, and 1000 pixels barely 33. The simulation shows both, and the drop of voltage along the strip that makes the far end redder and dimmer unless you feed power in at more than one place.

### Trying it without a controller

The first program below drives a few pixels directly from your own sketch. The second talks to a WLED controller already on the network, through its JSON interface.

> [!key] WLED makes an ESP a pixel-LED controller; ready-made boards add the level shifter, fuse and power terminals. Budget the current (60 mA per pixel at full white) and the frame time (30 µs per pixel) before you build.`,
  ideas: [
    'WLED is firmware: effects, presets and synchronisation from a web page, on ESP8266, ESP32, S2, S3 and C3 chips.',
    'Controller boards add a level shifter, a data resistor, a capacitor, power terminals and a fuse.',
    'A full-white pixel draws about 60 mA, so long strips need a big supply and power injection.',
    'A pixel takes 30 µs to send, so the number of pixels sets the frame rate.'
  ],
  pitfalls: [
    'The ESP drives a strip directly, so a controller board is a luxury — It works for a few pixels. A long 5 V strip needs level shifting, a fuse and a supply that can deliver tens of amps.',
    'Brightness 100% on a long strip is the normal setting — It can draw 60 mA per pixel. Limit it in the settings, or the supply and the wires overheat.',
    'More pixels only cost money — They also cost time: at 30 µs a pixel, a thousand pixels refresh about 33 times a second.'
  ],
  terms: [
    { term: 'WLED', also: ['WLED firmware'], def: 'Open-source firmware that turns an ESP into a controller for addressable LED strips and matrices, with effects, segments, presets, synchronisation and a web interface.' },
    { term: 'Level shifter', also: ['logic level converter'], def: 'A chip that raises a 3.3 V logic signal to 5 V so that a 5 V device reads it reliably. It sits between the ESP\'s data pin and the first pixel.' },
    { term: 'Power injection', also: ['feeding the strip'], def: 'Connecting the supply to a strip at several points along its length, so that the copper rails do not drop the voltage too far for the pixels at the far end.' },
    { term: 'Addressable LED', also: ['WS2812B', 'NeoPixel', 'SK6812', 'pixel'], def: 'An LED with a tiny chip in it that reads its own colour from a single data wire and passes the rest on, so a long chain is driven from one pin.' },
    { term: 'Frame time', also: ['refresh rate'], def: 'The time to send one complete image to the strip: 30 µs for each pixel, plus a short pause. It limits how fast the effects can run.' }
  ],
  choose: {
    good: ['A ready-made controller for strips longer than a few pixels: it carries the level shifter, fuse and terminals', 'ESP32 boards for several outputs, sound reaction or Ethernet', 'A board with a fuse per power input and room for a proper supply'],
    avoid: ['Powering a long strip from the ESP board\'s USB socket', 'Skipping the level shifter on a 5 V strip and hoping', 'Running full brightness without a current limit'],
    check: ['Your strip\'s voltage (5 V, 12 V or 24 V) against the controller\'s', 'The total pixel count against the frame rate you want', 'Where the supply will be injected along the strip']
  },
  code: [
    {
      title: 'A red dot running along a strip',
      about: 'Lights one pixel at a time along an 8-pixel strip, the way a controller\'s first test does. The colour level is kept low (40 of 255) so that the whole strip draws little current.',
      needs: 'An ESP32 DevKit and a strip of WS2812B pixels (8 are enough); a 5 V supply for it, sharing ground with the board.',
      wiring: [['GPIO27', '330 Ω → strip DIN', 'through a level shifter for a long 5 V strip'], ['5 V and GND', 'the strip', 'with a capacitor across the supply; ground connected first']],
      libs: ['Adafruit NeoPixel'],
      blocks: `
        when started
          start pixel strip on pin (27) with (8) pixels :: light
          set [dot v] to (0)
        forever
          clear pixels :: light
          set pixel (dot) to colour (40) (0) (0)
          show pixels
          change [dot v] by (1)
          if <(dot) = (8)> then
            set [dot v] to (0)
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include <Adafruit_NeoPixel.h>

        #define LED_PIN   27
        #define LED_COUNT 8
        const int LEVEL = 40;                          // colour level 0-255: keeps the current low
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

        int dot = 0;

        void setup() {
          strip.begin();
        }

        void loop() {
          strip.clear();
          strip.setPixelColor(dot, strip.Color(LEVEL, 0, 0));
          strip.show();                                // nothing is sent until show()
          dot = (dot + 1) % LED_COUNT;
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 27
        LED_COUNT = 8
        LEVEL = 40                                     # colour level 0-255: keeps the current low
        strip = NeoPixel(Pin(LED_PIN), LED_COUNT)

        dot = 0
        while True:
            strip.fill((0, 0, 0))
            strip[dot] = (LEVEL, 0, 0)
            strip.write()                              # nothing is sent until write()
            dot = (dot + 1) % LED_COUNT
            time.sleep_ms(100)
      `,
      notes: ['GPIO5, used in many examples, is a strapping pin on the ESP32; GPIO27 has no such duty.', 'MicroPython\'s NeoPixel module has no brightness setting: scale the colour yourself, as LEVEL does here.', 'For more than a few dozen pixels use a level shifter and a proper supply: see the simulation.']
    },
    {
      title: 'A knob that dims a WLED controller',
      about: 'Reads a potentiometer and tells a WLED controller on the network its brightness, through the controller\'s JSON interface. It sends only when the knob has moved, and not more often than five times a second.',
      needs: 'An ESP32 DevKit, a 10 kΩ potentiometer, and a WLED controller on the same Wi-Fi.',
      wiring: [['GPIO32', 'potentiometer wiper', 'an ADC1 pin: fine with Wi-Fi on'], ['3V3 and GND', 'potentiometer ends']],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          set [last v] to (0)
        forever
          set [bri v] to (map (analog read pin (32)) from (0) (4095) to (1) (255))
          if <(abs of ((bri) - (last))) ≥ (4)> then
            http post (join [{"bri":] (bri) [}]) to [http://192.168.1.60/json/state]
            set [last v] to (bri)
          end
          wait (0.2) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *WLED_URL = "http://192.168.1.60/json/state";   // your controller's address
        const int KNOB = 32;

        int last = 0;

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          int bri = map(analogRead(KNOB), 0, 4095, 1, 255);   // WLED brightness is 1-255
          if (abs(bri - last) >= 4) {                         // only when the knob has moved
            NetworkClient client;
            HTTPClient http;
            if (http.begin(client, WLED_URL)) {
              http.addHeader("Content-Type", "application/json");
              int code = http.POST(String("{\"bri\":") + bri + "}");
              Serial.printf("bri %d -> HTTP %d\n", bri, code);
              http.end();
              last = bri;
            }
          }
          delay(200);
        }
      `,
      py: String.raw`
        import network, requests, time
        from machine import Pin, ADC

        WLED_URL = "http://192.168.1.60/json/state"     # your controller's address
        knob = ADC(Pin(32), atten=ADC.ATTN_11DB)

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        last = 0
        while True:
            bri = 1 + (knob.read_u16() * 254) // 65535  # WLED brightness is 1-255
            if abs(bri - last) >= 4:                    # only when the knob has moved
                r = requests.post(WLED_URL, json={"bri": bri})
                print("bri", bri, "-> HTTP", r.status_code)
                r.close()
                last = bri
            time.sleep_ms(200)
      `,
      output: `
        bri 64 -> HTTP 200
        bri 130 -> HTTP 200
      `,
      notes: ['The JSON interface of WLED accepts other keys in the same message: "on", "seg", "ps" for a preset. Look them up in the WLED documentation for your version.', 'Reserve the controller\'s address in the router so that it does not change.', 'Do not leave real credentials in shared code ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'Is this supply big enough?',
      q: 'A 150-pixel WS2812B strip is set to half brightness, white. About what current does it draw, and how long does one frame take?',
      steps: ['Each pixel at full white draws about 60 mA; at half brightness about 30 mA, plus a small idle current.', '$150 \\times 30\\ \\mathrm{mA} = 4.5\\ \\mathrm{A}$, so a 5 V supply of at least 6 A leaves margin.', 'One frame sends $150 \\times 24$ bits at 1.25 µs each: $150 \\times 30\\ \\mu\\mathrm{s} = 4.5$ ms, so up to about 200 frames a second.'],
      a: 'About 4.5 A, so choose a supply of 6 A or more; a frame takes 4.5 ms.'
    }
  ],
  quiz: [
    { q: 'About how much current does one WS2812B pixel draw at full white?', choices: ['6 mA', '20 mA', '60 mA', '600 mA'], a: 2, why: 'Each of its three colour LEDs takes about 20 mA at full brightness, so about 60 mA with all three on. A hundred pixels at full white ask for roughly 6 A.' },
    { q: 'How long does a 1000-pixel strip take to refresh, sending 24 bits per pixel at 1.25 µs per bit?', choices: ['About 3 ms', 'About 30 ms', 'About 300 ms', 'About 3 s'], a: 1, why: '1000 × 24 × 1.25 µs = 30 ms, so about 33 frames a second at best.' },
    { q: 'The far end of a long strip, powered from one end, looks dim and orange-red. What is the cure?', choices: ['A faster ESP', 'Power injection: feed the supply in at more than one point', 'A longer data wire', 'A lower baud rate'], a: 1, why: 'The strip\'s thin copper drops the supply voltage along its length. Blue and green need the most voltage, so they fail first and white turns red-orange. Injecting power at several points restores it.' },
    { q: 'Why does a 5 V strip usually need a level shifter on its data line when driven by an ESP?', choices: ['The ESP data pin is too fast', 'The ESP signal is 3.3 V, which is marginal for a pixel running at 5 V', 'The strip uses I2C', 'The ESP has no output pins'], a: 1, why: 'A pixel at 5 V wants roughly 3.5 V to be sure of a one. The ESP\'s 3.3 V is just under that and can work or fail with temperature and wire length.' }
  ],
  applications: [
    'Cabinet, stair and room lighting with effects and presets from a phone.',
    'Christmas and holiday displays synchronised across several controllers.',
    'Sound-reactive lighting with an I2S microphone on the controller.',
    'Lighting driven from Home Assistant, with scenes and schedules.'
  ],
  sources: [
    'WLED documentation (compatible controllers, JSON API, settings including maximum current).',
    'Worldsemi, *WS2812B datasheet*: timing, logic levels, supply range.',
    'Adafruit, *Sparkle Motion* and QuinLED, board documentation: the catalogue pages above.'
  ],
  sim: 'cp-led-strip'
},

/* ================================================================ home-assistant-voice-hardware */
{
  id: 'home-assistant-voice-hardware',
  parent: 'chips-inside-products',
  title: 'Voice and presence hardware for Home Assistant',
  level: 2,
  short: 'The ESP32-S3 inside a voice satellite listens for a wake word and streams audio to the home server; an audio processor beside it cleans the sound. Presence sensors use a mmWave radar module read by an ESP. What is in the catalogue and why each part is there.',
  keywords: ['Home Assistant', 'Voice Preview Edition', 'Voice PE', 'voice satellite', 'wake word', 'XMOS', 'XU316', 'ReSpeaker', 'Atom Echo', 'Everything Presence', 'Apollo', 'mmWave', 'LD2450', 'presence', 'Assist', 'Wyoming'],
  prereq: ['shelly-sonoff-and-smart-plugs', 'soc-esp32-s3', 'presence-and-motion-sensors'],
  related: ['voice-assistant-firmware', 'wake-words-and-speech-commands', 'voice-assistants', 'esphome', 'i2s-microphones', 'home-assistant-integration', 'project-voice-lamp'],
  body: `Home Assistant's voice system, Assist, does the thinking on a home server: speech to text, working out what was meant, text back to speech. The small devices around the house only have to hear and to speak. That job — a **voice satellite** — turns out to suit the ESP32-S3: it has the memory for audio buffers, instructions that speed up small neural networks, and Wi-Fi.

### What a voice satellite contains

The catalogue lists the **Home Assistant Voice Preview Edition** with an ESP32-S3 (16 MB flash, 8 MB octal PSRAM) and an **XMOS XU316** audio processor. The two split the work: the XMOS chip handles the microphones, echo cancellation and noise suppression; the ESP32-S3 runs the wake-word detector, the network and the firmware, which is ESPHome. Other satellites follow the pattern or simplify it:

| Device | What the catalogue says |
|---|---|
| Home Assistant Voice PE | ESP32-S3 with XMOS XU316 |
| Seeed ReSpeaker Lite | XIAO ESP32S3 with an XMOS XU316; far-field capture up to about 3 m |
| Seeed reSpeaker XVF3800 | XIAO ESP32S3 with an XMOS XVF3800; 4 microphones; about 5 m |
| M5Stack Atom Echo (ESP32-PICO-D4) | an I2S amplifier and speaker, one PDM microphone: the smallest and simplest |
| ESP32-S3-BOX-3 | two microphones, a speaker and a touch screen, in one case |

A satellite with a single microphone and no audio processor works close up; with a processor it can hear across a room, even while it is playing music.

### Where the wake word runs

Detecting "hey…" is a small neural network. It can run **on the device**, so that audio leaves the satellite only after the wake word, or on the server, which then receives audio continuously. The first is far kinder to the network and to privacy; the simulation shows the numbers.

> [!warn] A microphone records people. Say so in the house, and use the hardware mute switch these devices provide. Consent and local law apply to recording anyone who is not you.

### Presence sensors

Presence is the other half. A PIR sensor sees only movement; a person sitting still disappears. A **mmWave radar** module sees the tiny movements of breathing. The catalogue lists the Everything Presence Lite with an ESP32-WROOM-32E and a Hi-Link HLK-LD2450 radar, the Apollo R PRO-1 (ESP32-S3, powered over Ethernet, two radars) and Apollo's AIR-1 and MSR-1 (ESP32-C3) and H-2 (ESP32-C6). The ESP reads the radar's serial output or its output pin, filters it, and publishes *occupied* or *empty*. Most sensors hold *occupied* for a while after the last detection, as the program below does.

> [!key] A voice satellite pairs an ESP32-S3, which runs the wake word and the network, with an audio processor that cleans the sound; the server does the understanding. Presence sensors pair an ESP with a mmWave radar and a hold time.`,
  ideas: [
    'A voice satellite only hears and speaks; speech recognition and understanding run on the Home Assistant server.',
    'An XMOS audio processor beside the ESP32-S3 handles echo cancellation and noise suppression.',
    'Running the wake word on the device means audio leaves it only after the wake word.',
    'A mmWave radar detects a still person where a PIR cannot; a hold time stops the state flickering.'
  ],
  pitfalls: [
    'A voice assistant sends all my speech to the cloud — Not necessarily. With the wake word on the device and speech recognition on your own server, audio can stay in the house; check where each step runs.',
    'A single-microphone satellite works as well as one with an audio processor — Only close up and in a quiet room. Echo cancellation and beam-forming are what let a satellite hear across a room and while it talks.',
    'A PIR sensor is enough to know if a room is occupied — It sees movement only. Someone reading or sleeping stops triggering it.'
  ],
  terms: [
    { term: 'Voice satellite', also: ['satellite', 'voice assistant satellite'], def: 'A small device with a microphone and a speaker that hears the wake word, streams audio to a server for processing and plays back the reply.' },
    { term: 'Wake word', also: ['hotword', 'trigger phrase'], def: 'The phrase that makes a voice device start listening. A small neural network that runs continuously on the device or on a server decides when it has been spoken.' },
    { term: 'mmWave radar', also: ['millimetre-wave radar', 'LD2450', 'LD2410'], def: 'A 24 GHz radar module that detects people by their motion, including the small motion of breathing, and reports distances and states over a serial link or an output pin.' },
    { term: 'Echo cancellation', also: ['AEC', 'acoustic echo cancellation'], def: 'Processing that subtracts the sound the device itself is playing from what its microphones hear, so that it can listen to a person while the speaker is on.' },
    { term: 'Hold time', also: ['off delay'], def: 'How long a presence sensor keeps reporting "occupied" after the last detection, so that a person sitting still is not reported as gone.' }
  ],
  choose: {
    good: ['An ESP32-S3 with PSRAM and an audio processor for a satellite that must work across a room', 'A single-microphone board such as the Atom Echo for close-range, low-cost voice control', 'A mmWave radar for rooms where people sit still'],
    avoid: ['A bare microphone and no echo cancellation for a satellite that also plays music', 'Relying on PIR alone for lights that must stay on while someone reads', 'Sending continuous audio to a server when the wake word can run on the device'],
    check: ['Where each stage runs: wake word, speech recognition, understanding, speech output', 'That the device has a hardware mute switch', 'The radar sensor\'s range and field of view in the room it will watch']
  },
  code: [
    {
      title: 'Presence with a hold time',
      about: 'Reads the digital output of a presence sensor. While it reports someone, an LED is on; when it stops, the LED stays on for another 30 seconds, so that a person sitting still is not treated as gone.',
      needs: 'An ESP32 DevKit and a presence sensor with a 3.3 V digital output (a PIR module, or a mmWave module\'s presence pin).',
      wiring: [['GPIO25', 'sensor output', '3.3 V logic: never connect a 5 V output directly'], ['GPIO26', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (25) as [input v]
          set pin (26) as [output v]
          set [occupied v] to <false>
          set [last seen v] to (0)
        forever
          if <(read pin (25)) = [HIGH v]> then
            set [last seen v] to (milliseconds since start)
            set [occupied v] to <true>
          else if <<(occupied)> and <((milliseconds since start) - (last seen)) ≥ (30000)>> then
            set [occupied v] to <false>
          end
          set pin (26) to (occupied)
        end
      `,
      cpp: String.raw`
        const int SENSOR = 25;                 // the sensor's output, 3.3 V logic
        const int LED = 26;
        const uint32_t HOLD_MS = 30000;        // stay "occupied" this long after the last detection

        uint32_t lastSeen = 0;
        bool occupied = false;

        void setup() {
          pinMode(SENSOR, INPUT);
          pinMode(LED, OUTPUT);
        }

        void loop() {
          uint32_t now = millis();
          if (digitalRead(SENSOR) == HIGH) {
            lastSeen = now;
            occupied = true;
          } else if (occupied && now - lastSeen >= HOLD_MS) {
            occupied = false;
          }
          digitalWrite(LED, occupied);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SENSOR = Pin(25, Pin.IN)               # the sensor's output, 3.3 V logic
        LED = Pin(26, Pin.OUT)
        HOLD_MS = 30000                        # stay "occupied" this long after the last detection

        last_seen = 0
        occupied = False

        while True:
            now = time.ticks_ms()
            if SENSOR.value() == 1:
                last_seen = now
                occupied = True
            elif occupied and time.ticks_diff(now, last_seen) >= HOLD_MS:
                occupied = False
            LED.value(occupied)
            time.sleep_ms(50)
      `,
      yaml: `
        binary_sensor:
          - platform: gpio
            name: "Room occupied"
            pin: GPIO25
            device_class: occupancy
            filters:
              - delayed_off: 30s          # the hold time
      `,
      notes: ['A mmWave module may have a serial interface with much more (distances, several targets); this program uses only its presence pin.', 'Radar and PIR modules need a few seconds to settle after power-up; ignore the first reading.']
    }
  ],
  quiz: [
    { q: 'In the Voice Preview Edition, which chip handles echo cancellation and noise suppression?', choices: ['The ESP32-S3', 'The XMOS XU316', 'The Home Assistant server', 'The speaker amplifier'], a: 1, why: 'The catalogue lists an XMOS XU316 audio processor beside the ESP32-S3; the XMOS chip does the audio signal processing and the S3 runs the wake word, the network and the firmware.' },
    { q: 'A satellite runs the wake word on the device. When does audio leave it?', choices: ['Continuously', 'After the wake word is heard, for the length of the command', 'Only at night', 'Never'], a: 1, why: 'The local detector runs all the time, but only a recognised wake word opens the stream to the server.' },
    { q: 'A room light controlled by a PIR sensor keeps going out while someone reads. Which sensor change fits best?', choices: ['A longer wire', 'A mmWave radar sensor that sees breathing', 'A bigger LED', 'Wi-Fi 6'], a: 1, why: 'A PIR sees only movement. A mmWave radar also detects the tiny movements of breathing, so a person sitting still stays "present".' },
    { q: 'The ESP32-S3 is a poor choice for a voice satellite because it has no PSRAM option.', a: false, why: 'The S3 supports PSRAM (the Voice Preview Edition has 8 MB of octal PSRAM), has instructions that speed up small neural networks, and Wi-Fi: it suits the job.' }
  ],
  applications: [
    'Voice control of lights and blinds from every room, with the understanding done on a home server.',
    'A tiny talking-button for a workshop built from an Atom Echo.',
    'Room-occupancy automations for lighting and heating that do not turn off on a person sitting still.',
    'Multi-sensor boxes combining radar, CO2 and temperature, powered over Ethernet.'
  ],
  sources: [
    'Home Assistant documentation, *Voice Preview Edition* and *Assist*: the device pages and the voice pipeline.',
    'ESPHome documentation: the voice assistant, microphone and wake-word components, and the binary sensor filters.',
    'Hi-Link, *HLK-LD2450* and *LD2410* module documentation; XMOS, XU316 product brief.'
  ],
  sim: 'cp-voice-path'
},

/* ================================================================ u-blox-nina-and-nora */
{
  id: 'u-blox-nina-and-nora',
  parent: 'chips-inside-products',
  title: 'u-blox NINA and NORA: an ESP inside',
  level: 2,
  short: 'u-blox sells industrial, pre-approved modules built on Espressif chips: the NINA-W10 holds an ESP32, the NORA-W10 an ESP32-S3. They are the radio of Arduino\'s MKR WiFi 1010, Nano 33 IoT, UNO WiFi Rev2, Nano RP2040 Connect and Nano ESP32.',
  keywords: ['u-blox', 'NINA-W102', 'NINA-W106', 'NORA-W106', 'NORA-W101', 'WiFiNINA', 'MKR WiFi 1010', 'Nano 33 IoT', 'Nano RP2040 Connect', 'UNO WiFi Rev2', 'Nano ESP32', 'open CPU', 'industrial module'],
  prereq: ['soc-esp32', 'soc-esp32-s3', 'what-a-module-adds'],
  related: ['esp-at-and-esp-hosted', 'arduino-nano-esp32', 'esp-as-a-co-processor', 'module-certification', 'wroom-wrover-mini-pico', 'gpio-numbers-and-board-labels'],
  body: `Not every ESP32 you meet wears Espressif's name. u-blox, a Swiss maker of positioning and wireless modules, builds modules around Espressif chips and sells them with what an industrial product needs and a hobby board does not: radio approvals in the major markets, a wider temperature range, and documentation and support for a company that must still make the product in ten years. You pay more for the module; you are buying the paperwork.

### The two families

| | NINA-W10 | NORA-W10 |
|---|---|---|
| Chip inside | ESP32: dual-core 240 MHz, 520 kB RAM | ESP32-S3: dual-core, 512 kB RAM |
| Wi-Fi · Bluetooth | 802.11 b/g/n · v4.2 Classic and LE | Wi-Fi 4 · Bluetooth LE 5.0 only |
| GPIO | 24 (W101, W102), 26 (W106) | 38 or 33, by variant |
| Size | 10 × 14 mm for the W101 | 10.4 × 14.3 × 1.8 mm |
| Antenna by variant | W101 antenna pin, W102 internal antenna, W106 see its datasheet | W101 antenna pin, W106 PCB antenna |
| Notes | -40 to +85 °C, ISO 16750 qualified | USB OTG; "-10B" versions need a separate flash chip |

The letters matter as with any module ([[reading-a-module-part-number]]): the W102 is the "professional" grade with its own antenna, the W101 expects yours.

### How they are used

**As a co-processor.** The NINA-W102 is the radio of four Arduino boards: the **MKR WiFi 1010** and **Nano 33 IoT** (SAMD21 main chip), the **UNO WiFi Rev2** (ATmega4809) and the **Nano RP2040 Connect** (RP2040). Arduino loads its own firmware into the NINA, and the main chip talks to it over SPI through the WiFiNINA library. The main chip never sees an ESP. The catalogue notes that reprogramming the NINA firmware voids the radio certification of the board.

**As the main chip.** The NORA-W106-10B is the whole brain of the **Arduino Nano ESP32**, an ESP32-S3 board with 16 MB of external flash, 8 MB of PSRAM inside the module and native USB-C. You write ESP32 code for it, with one trap: the board is labelled in Arduino names, **D2 is GPIO5 and D13, the LED, is GPIO48**. The catalogue lists the RGB LED on GPIO46, 0 and 45, with blue and green swapped on first-batch boards. [[arduino-nano-esp32]] covers the board.

### Why this matters

When a product page says "u-blox NINA" it means an ESP32 with a very different support story: the vendor's firmware, the vendor's library, a certificate you must not invalidate. The chip's strengths and limits are still those of [[soc-esp32]] or [[soc-esp32-s3]].

> [!key] u-blox NINA modules hold an ESP32 and NORA modules an ESP32-S3, sold with approvals and a wide temperature range. On Arduino boards a NINA is a co-processor behind a library; a NORA can be the whole brain, as on the Nano ESP32.`,
  ideas: [
    'NINA-W10 modules contain an ESP32 and NORA-W10 modules an ESP32-S3, sold pre-approved and with a wide temperature range.',
    'On four Arduino boards the NINA-W102 is a Wi-Fi and Bluetooth co-processor reached over SPI with the WiFiNINA library.',
    'The NORA-W106 is the main chip of the Arduino Nano ESP32, programmed like any ESP32-S3.',
    'Reprogramming the NINA firmware of an Arduino board voids the radio certification.'
  ],
  pitfalls: [
    'A board with a NINA module can run ESP32 programs — On those Arduino boards the NINA runs Arduino\'s firmware and the sketch runs on the SAMD21, ATmega4809 or RP2040. Only the Nano ESP32 runs your code on the ESP.',
    'D2 on the Nano ESP32 is GPIO2 — The board uses Arduino names: D2 is GPIO5 and D13 is GPIO48. Use the names, or check the pin table.',
    'A u-blox module is a different chip from the ESP32 — The chip is Espressif\'s; u-blox adds the module, its approvals and its firmware support.'
  ],
  terms: [
    { term: 'NINA-W10', also: ['NINA-W102', 'NINA-W106', 'NINA-W101'], def: 'u-blox\'s family of ESP32 modules, with an internal antenna on the W102 and an antenna pin on the W101. Found in several Arduino boards.' },
    { term: 'NORA-W10', also: ['NORA-W106', 'NORA-W101'], def: 'u-blox\'s family of ESP32-S3 modules: Wi-Fi 4 and Bluetooth LE 5.0, in a smaller package than the NINA. The Arduino Nano ESP32 uses a NORA-W106.' },
    { term: 'WiFiNINA', also: ['NINA firmware'], def: 'The Arduino library, and the firmware in the NINA module that it talks to over SPI, that gives a main microcontroller without Wi-Fi a WiFi object like the ESP32\'s.' },
    { term: 'Open CPU', also: [], def: 'Using a radio module as the main processor, running your own code on its chip, rather than as a modem for another microcontroller.' }
  ],
  choose: {
    good: ['A certified, industrial-temperature ESP32 or ESP32-S3 module for a product that must pass approvals', 'The Arduino Nano ESP32 for the Arduino ecosystem with an ESP32-S3 inside', 'An Arduino board with a NINA when the main chip must stay a SAMD21 or RP2040'],
    avoid: ['Reflashing the NINA firmware of a certified Arduino board you plan to ship', 'Expecting ESP32 libraries to run on a board whose ESP is only a co-processor', 'Assuming a NORA has Bluetooth Classic or a NINA has Bluetooth 5: they differ'],
    check: ['Whether the module is the main chip or a co-processor on your board', 'The variant letters: antenna and flash differ', 'Which Arduino or u-blox firmware the module carries']
  },
  code: [
    {
      title: 'Blink by Arduino name and by GPIO number',
      about: 'On the Arduino Nano ESP32 the built-in LED is D13 and the pin labelled D2 is GPIO5. The sketch blinks the built-in LED and a second LED on D2, alternately, using the board\'s names; the MicroPython version uses the GPIO numbers.',
      needs: 'An Arduino Nano ESP32 and an LED with a 220 Ω resistor from the pin labelled D2 to GND.',
      wiring: [['D2 (GPIO5)', '220 Ω → LED → GND'], ['D13 (GPIO48)', 'the built-in LED']],
      blocks: `
        when started
          set pin (D13) as [output v]
          set pin (D2) as [output v]
        forever
          set pin (D13) to [HIGH v]
          set pin (D2) to [LOW v]
          wait (0.5) seconds
          set pin (D13) to [LOW v]
          set pin (D2) to [HIGH v]
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        // D2 and LED_BUILTIN (D13) are the names printed on the board
        void setup() {
          pinMode(LED_BUILTIN, OUTPUT);     // D13 = GPIO48
          pinMode(D2, OUTPUT);              // D2 = GPIO5
        }

        void loop() {
          digitalWrite(LED_BUILTIN, HIGH);
          digitalWrite(D2, LOW);
          delay(500);
          digitalWrite(LED_BUILTIN, LOW);
          digitalWrite(D2, HIGH);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        led_builtin = Pin(48, Pin.OUT)      # D13 = GPIO48
        d2 = Pin(5, Pin.OUT)                # D2 = GPIO5

        while True:
            led_builtin.value(1)
            d2.value(0)
            time.sleep_ms(500)
            led_builtin.value(0)
            d2.value(1)
            time.sleep_ms(500)
      `,
      notes: ['The board package can number pins by Arduino name or by GPIO number; using the D-names avoids the question.', 'MicroPython always takes GPIO numbers.']
    },
    {
      title: 'Ask the NINA module which firmware it runs',
      about: 'On an Arduino board with a NINA module, the library asks the module for its firmware version and compares it with the newest version the library knows. The Arduino IDE has a firmware updater for the module.',
      needs: 'An Arduino MKR WiFi 1010, Nano 33 IoT, UNO WiFi Rev2 or Nano RP2040 Connect, and the WiFiNINA library.',
      libs: ['WiFiNINA'],
      blocks: `
        when started
          start serial at (115200) baud
          if <not <NINA module found?>> then
            print [no NINA module found]
            stop [this script v]
          end
          print (join [NINA firmware: ] (NINA firmware version))
          print (join [Latest this library knows: ] (latest NINA firmware version))
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <WiFiNINA.h>

        void setup() {
          Serial.begin(115200);
          while (!Serial) delay(10);                  // wait for the USB serial monitor
          if (WiFi.status() == WL_NO_MODULE) {
            Serial.println("No NINA module found");
            while (true) delay(1000);
          }
          Serial.print("NINA firmware: ");
          Serial.println(WiFi.firmwareVersion());
          Serial.print("Latest this library knows: ");
          Serial.println(WIFI_FIRMWARE_LATEST_VERSION);
        }

        void loop() {}
      `,
      na: { py: 'WiFiNINA is an Arduino library that runs on the host microcontroller: this check exists only as an Arduino program.' },
      notes: ['A firmware older than the library expects can make Wi-Fi calls fail in odd ways; update it with the IDE\'s updater.', 'Loading firmware other than Arduino\'s into the NINA voids the certification of the board.']
    }
  ],
  quiz: [
    { q: 'Which chip is inside a u-blox NINA-W10 module?', choices: ['ESP8266', 'ESP32', 'ESP32-S3', 'ESP32-C3'], a: 1, why: 'The NINA-W10 series holds an ESP32 (dual-core Xtensa LX6, Bluetooth Classic and LE 4.2). The NORA-W10 series holds an ESP32-S3.' },
    { q: 'On an Arduino MKR WiFi 1010, where does your sketch run?', choices: ['On the NINA-W102', 'On the SAMD21 main chip', 'On both at once', 'On the ESP32-S3'], a: 1, why: 'The NINA is a co-processor running Arduino\'s own firmware; your sketch runs on the SAMD21 and talks to it through the WiFiNINA library.' },
    { q: 'On the Arduino Nano ESP32, the pin printed D13 (and the built-in LED) is which GPIO?', choices: ['GPIO13', 'GPIO2', 'GPIO48', 'GPIO5'], a: 2, why: 'The board uses Arduino names: D13 is GPIO48, D2 is GPIO5. Names and GPIO numbers do not coincide.' },
    { q: 'u-blox modules are sold because they contain a better chip than Espressif\'s own modules.', a: false, why: 'The chip is Espressif\'s. What u-blox adds is the pre-approved module, a wider temperature range, documentation and support.' }
  ],
  applications: [
    'Industrial products that need approved Wi-Fi and Bluetooth in a wide temperature range.',
    'Arduino IoT projects on the MKR, Nano and UNO families, reaching the network through the WiFiNINA library.',
    'The Arduino Nano ESP32 for programs that need native USB, PSRAM and the ESP32-S3.',
    'Telling, from a part number, what a product\'s radio really is.'
  ],
  sources: [
    'u-blox, *NINA-W10 series product summary* and *NORA-W10 series product summary*.',
    'Arduino documentation: MKR WiFi 1010, Nano 33 IoT, UNO WiFi Rev2, Nano RP2040 Connect and Nano ESP32 hardware pages.',
    'Arduino, *WiFiNINA* library reference.'
  ],
  sim: { id: 'cp-esp-inside', params: { set: 'co', filter: 'u-blox' } }
},

/* ================================================================ esp-at-and-esp-hosted */
{
  id: 'esp-at-and-esp-hosted',
  parent: 'chips-inside-products',
  title: 'ESP-AT and ESP-Hosted: the chip as a modem',
  level: 2,
  short: 'An ESP can be nothing but a radio for another processor: AT commands over a serial line, or ESP-Hosted over SPI and SDIO, which gives a Linux host a network interface. That is how the ESP32-P4 gets its Wi-Fi.',
  keywords: ['ESP-AT', 'AT commands', 'ESP-Hosted', 'co-processor', 'modem', 'SDIO', 'SPI', 'UART', 'ESP32-P4', 'ESP32-C6', 'MOD-ESP32-C5', 'ESP32-E22', 'AT+CWJAP', 'wlan0'],
  prereq: ['u-blox-nina-and-nora', 'uart', 'spi'],
  related: ['esp-as-a-co-processor', 'soc-esp32-p4', 'sdio-and-sdmmc', 'serial-communication-basics', 'wifi-station', 'tuya-modules-and-what-changed'],
  body: `Sometimes the clever part of a product is another processor, and the ESP is only there to give it a radio. A medical device, a camera board or a single-board Linux computer may already have all the processing it needs and simply lack Wi-Fi and Bluetooth. The ESP then becomes a **modem**, and the two chips agree on how to talk. There are two ways, at very different scale.

### ESP-AT: commands over a serial line

Espressif's **AT firmware** loads onto the ESP and turns it into something like an old dial-up modem. The host sends text commands over a UART and reads text replies:

~~~
AT                                      -> OK
AT+CWMODE=1                             -> OK        (station mode)
AT+CWJAP="your-ssid","your-password"    -> WIFI CONNECTED, WIFI GOT IP, OK
AT+CIFSR                                -> +CIFSR:STAIP,"192.168.1.50"  …
~~~

Other commands open TCP connections, serve web pages and drive Bluetooth LE. The host needs almost nothing: a UART and string handling, so it can be a microcontroller of any make. The cost is speed. At the usual 115 200 baud a byte takes 10 bit times, so the pipe carries about 11 kB a second, however fast the Wi-Fi underneath.

### ESP-Hosted: a network interface, not a command language

**ESP-Hosted** is the same idea for a fast host. The ESP carries firmware that moves raw network frames and Bluetooth data over **SPI**, **SDIO** or UART. On the host a driver presents them as a normal network interface, so that, on Linux, the ESP appears as a Wi-Fi adapter with no AT commands at all. A host MCU can use the same firmware with a driver of its own.

This is how the **ESP32-P4** gets its radio. The P4 has no Wi-Fi or Bluetooth, so its boards add a companion ESP32-C6: the CrowPanel Advanced 7.0-inch P4 panel and the Guition JC1060P470 carry one, and Olimex sells the **MOD-ESP32-C5** as a UEXT module that runs ESP-Hosted to give a host dual-band Wi-Fi 6. The idea is reaching further: the **ESP32-E22**, sampling at the time of writing, is a tri-band Wi-Fi 6E co-processor for Linux hosts over PCIe, SDIO or USB, and not a microcontroller at all.

### The link is the limit

| Link | Rough ceiling |
|---|---|
| UART, 115 200 baud | 11.5 kB/s |
| UART, 921 600 baud | 92 kB/s |
| SPI, 40 MHz | 5 MB/s |
| SDIO, 4 bits, 50 MHz | 25 MB/s |

These are bus limits; real throughput is lower on every link, and the radio has its own ceiling. The simulation compares them with the ESP32's Wi-Fi rate from the catalogue.

> [!key] An ESP can be a modem for another processor. ESP-AT speaks text commands over a UART; ESP-Hosted moves raw frames over SPI or SDIO and gives a Linux host a network interface. The link, not the radio, often sets the speed.`,
  ideas: [
    'An ESP can serve as the radio of another processor, which keeps all the logic.',
    'ESP-AT gives the host a text command set over a UART; any microcontroller with a serial port can use it.',
    'ESP-Hosted moves network frames over SPI or SDIO and presents a normal network interface to a Linux host.',
    'The ESP32-P4 has no radio; its boards add an ESP32-C6 running ESP-Hosted.'
  ],
  pitfalls: [
    'With ESP-AT the host gets the speed of the ESP\'s Wi-Fi — Everything passes through the serial line: at 115 200 baud that is about 11 kB a second, however good the Wi-Fi.',
    'The ESP32-P4 has Wi-Fi like other ESP32s — It has no radio. Boards add a C6 (or similar) and connect it over ESP-Hosted.',
    'ESP-AT and ESP-Hosted are the same thing — AT is a command language over a UART; Hosted carries raw frames over a fast bus and appears as a network device.'
  ],
  terms: [
    { term: 'ESP-AT', also: ['AT firmware', 'AT commands'], def: 'Espressif\'s firmware that makes an ESP behave like a serial modem: a host sends text commands such as AT+CWJAP and reads replies ending in OK or ERROR.' },
    { term: 'ESP-Hosted', also: ['esp-hosted'], def: 'Espressif\'s solution for using an ESP as the Wi-Fi and Bluetooth adapter of a host processor, over SPI, SDIO or UART, so that the host sees an ordinary network interface.' },
    { term: 'Co-processor', also: ['coprocessor', 'radio co-processor'], def: 'A chip that does one job for a main processor. Here the ESP does the radio and the host does everything else.' },
    { term: 'SDIO', also: ['SD card bus'], def: 'A wide, fast bus derived from the SD card: four data lines and a clock of up to 50 MHz. ESP-Hosted uses it for the highest speed.' }
  ],
  choose: {
    good: ['ESP-AT when the host is a small microcontroller with a free UART and modest data needs', 'ESP-Hosted over SDIO or SPI for a Linux host or a fast MCU that needs real Wi-Fi speed', 'A module that ships ready with the co-processor firmware'],
    avoid: ['AT commands for high-rate streaming: the serial line is the bottleneck', 'A co-processor when the ESP could simply run the whole application', 'Mixing firmware and host drivers from different versions'],
    check: ['Which bus the host has free: UART, SPI or SDIO', 'That the host driver and the ESP firmware are the same version', 'The data rate you need against the link ceiling']
  },
  code: [
    {
      title: 'Join Wi-Fi through an ESP running AT firmware',
      about: 'An ESP32 acts as the *host* and talks to another ESP that carries the AT firmware, over a serial line. It sends four commands and prints each reply. The same shape works from any microcontroller.',
      needs: 'Two ESP boards: one with Espressif\'s AT firmware, and an ESP32 DevKit as the host. Cross TX and RX and join the grounds.',
      wiring: [['GPIO26 (host RX)', 'AT module TX', ''], ['GPIO27 (host TX)', 'AT module RX', ''], ['GND', 'GND', 'common ground']],
      blocks: `
        define send AT command (command) :: my
          print line (command) to UART (1) :: bus
          wait for the reply, until OK or ERROR :: bus
          print (reply)

        when started
          start serial at (115200) baud
          start UART (1) at (115200) baud on RX (26) TX (27) :: bus
          send AT command [AT] :: my
          send AT command [AT+CWMODE=1] :: my
          send AT command [AT+CWJAP="your-ssid","your-password"] :: my
          send AT command [AT+CIFSR] :: my
      `,
      cpp: String.raw`
        const int PIN_RX = 26;                          // host RX  <- module TX
        const int PIN_TX = 27;                          // host TX  -> module RX

        String sendAT(const String &cmd, uint32_t timeoutMs) {
          Serial1.println(cmd);                         // AT commands end with CR LF
          String reply;
          uint32_t t0 = millis();
          while (millis() - t0 < timeoutMs) {
            while (Serial1.available()) reply += (char)Serial1.read();
            if (reply.endsWith("OK\r\n") || reply.endsWith("ERROR\r\n")) break;
          }
          return reply;
        }

        void setup() {
          Serial.begin(115200);
          Serial1.begin(115200, SERIAL_8N1, PIN_RX, PIN_TX);   // RX and TX are names the core already uses; order: baud, config, RX pin, TX pin
          Serial.println(sendAT("AT", 1000));
          Serial.println(sendAT("AT+CWMODE=1", 1000));  // station mode
          Serial.println(sendAT("AT+CWJAP=\"your-ssid\",\"your-password\"", 15000));
          Serial.println(sendAT("AT+CIFSR", 1000));     // the IP address
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import UART
        import time

        uart = UART(1, baudrate=115200, tx=27, rx=26)   # host TX -> module RX, host RX <- module TX

        def send_at(cmd, timeout_ms):
            uart.write(cmd + "\r\n")                    # AT commands end with CR LF
            reply = b""
            t0 = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), t0) < timeout_ms:
                if uart.any():
                    reply += uart.read()
                if reply.endswith(b"OK\r\n") or reply.endswith(b"ERROR\r\n"):
                    break
            return reply.decode()

        print(send_at("AT", 1000))
        print(send_at("AT+CWMODE=1", 1000))             # station mode
        print(send_at("AT+CWJAP=\"your-ssid\",\"your-password\"", 15000))
        print(send_at("AT+CIFSR", 1000))                # the IP address
      `,
      output: `
        AT
        OK
        AT+CWMODE=1
        OK
        AT+CWJAP="your-ssid","your-password"
        WIFI CONNECTED
        WIFI GOT IP

        OK
        AT+CIFSR
        +CIFSR:STAIP,"192.168.1.50"
        OK
      `,
      notes: ['The module echoes each command, which is why it appears in the reply; a command can switch the echo off.', 'The module\'s UART pins and default baud rate are listed in the AT firmware documentation for each chip; check them for yours.', 'Do not leave real credentials in shared code ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'How long does a web page take over AT?',
      q: 'The host reads a 30 kB web page through an ESP-AT module at 115 200 baud (8 data bits, no parity, 1 stop bit). How long does the transfer take at best?',
      steps: ['Each byte costs 10 bit times on the line: a start bit, 8 data bits and a stop bit.', 'The line carries $115200 / 10 = 11520$ bytes per second.', '$30000 / 11520 \\approx 2.6$ s.'],
      a: 'About 2.6 s, even if the Wi-Fi delivered it at once. At 921 600 baud the same page takes about 0.33 s.'
    }
  ],
  quiz: [
    { q: 'How many bytes per second can a 115 200 baud UART carry at best (8N1)?', choices: ['About 1.2 kB', 'About 11.5 kB', 'About 115 kB', 'About 1.15 MB'], a: 1, why: 'Each byte takes 10 bit times (start, 8 data, stop): 115200 / 10 = 11 520 bytes a second.' },
    { q: 'Why does the ESP32-P4 board of a touch panel carry an ESP32-C6?', choices: ['To save power', 'The P4 has no Wi-Fi or Bluetooth, so the C6 provides them over ESP-Hosted', 'The C6 drives the display', 'The P4 needs a second flash'], a: 1, why: 'The P4 is a microcontroller with no radio. Wireless comes from a companion chip, here an ESP32-C6, connected over a fast bus.' },
    { q: 'In ESP-AT, which command joins a Wi-Fi network?', choices: ['AT+CWMODE', 'AT+CWJAP', 'AT+CIFSR', 'AT+CIPSTART'], a: 1, why: 'AT+CWJAP joins an access point with a name and a password; AT+CWMODE chooses station or access-point mode and AT+CIFSR reports the address.' },
    { q: 'ESP-Hosted makes the ESP appear to a Linux host as a network interface.', a: true, why: 'Unlike AT, which is a text command language, ESP-Hosted moves raw network frames, and the host driver presents them as an ordinary adapter.' }
  ],
  applications: [
    'Giving Wi-Fi and Bluetooth to a microcontroller that has none, such as an AVR or a Cortex-M0 board.',
    'The wireless side of touch panels and boards built on the ESP32-P4.',
    'A radio adapter for a single-board Linux computer, over SPI or SDIO.',
    'Arduino\'s UNO R4 WiFi and Portenta C33, where an ESP32-S3 or C3 module is the radio beside the main chip.'
  ],
  sources: [
    'Espressif, *ESP-AT User Guide*: command set and the AT firmware for each chip.',
    'Espressif, *ESP-Hosted* documentation (repository README and the host driver notes).',
    'Espressif, *ESP32-P4* and *ESP32-E22* product documents; Olimex, *MOD-ESP32-C5* page.'
  ],
  sim: { id: 'cp-modem-host', params: { mode: 'at' } }
},

/* ================================================================ reflashing-commercial-devices */
{
  id: 'reflashing-commercial-devices',
  parent: 'chips-inside-products',
  title: 'Reflashing a commercial device: what it takes and what it risks',
  level: 3,
  short: 'Replacing the firmware of a plug or a switch you own is your right, and it can free the device from a vendor cloud. It also ends the warranty and the safety approval, can fail for good, and means opening a mains device. The general method, and when not to.',
  keywords: ['reflash', 'Tasmota', 'ESPHome', 'serial flashing', 'esptool', 'boot pin', 'backup', 'flash locked', 'warranty', 'mains', 'smart plug', 'Shelly', 'Sonoff', 'Matter', 'bricked'],
  prereq: ['shelly-sonoff-and-smart-plugs', 'tuya-modules-and-what-changed', 'flashing-and-esptool'],
  related: ['boot-modes-and-download-mode', 'strapping-pins', 'esphome', 'tasmota', 'usb-serial-adapters', 'switching-mains-safely', 'efuses', 'esd-and-bench-safety'],
  body: `A smart plug you own is yours to change. Replacing its firmware with ESPHome or Tasmota can make it work with no cloud account, publish over MQTT and keep working if the maker's service closes. It is also the riskiest thing on this page: it means opening a device that carries mains voltage, it ends two kinds of promise, and some devices cannot be reflashed at all.

> [!warn] Mains voltage kills. Open a mains device only when it is unplugged from the wall, and only if you are competent to judge it. Never connect a computer or a serial adapter to a device that is plugged in: in many plugs the low-voltage side sits at mains potential. Wiring for 110–230 V is work for a qualified person.

### What you give up

- **The warranty**, usually, once the case has been opened.
- **The safety approval.** The marks on a product apply to it as it was tested, with the maker's firmware. Overload, over-temperature and relay-welding protection often live in that firmware; yours may not have them.
- **The cloud features** and the maker's app, unless you replace them.
- **Sometimes the device**: a failed write over a bad connection can leave it blank, and a locked flash cannot be written at all.

Check your local law and the product's terms of service.

### The general method

1. **Know the chip** of your exact unit ([[tuya-modules-and-what-changed]]): the community databases list chip and revision. A Beken or Realtek chip is outside the ESP tools.
2. **Check whether it is possible.** Some devices lock their flash or use secure boot: the catalogue records the Sonoff MINIR4M, an ESP32-C3 with locked flash because it is Matter-certified. Serial pads you cannot reach are also an answer.
3. **Unplug it** and keep it unplugged. Power the chip from a 3.3 V USB-serial adapter or a bench supply, never from the mains side.
4. **Connect** TX, RX and ground to the board's serial pads, with RX to TX and TX to RX, and the boot pin held to ground while power is applied: GPIO0 on the ESP8266 and ESP32, GPIO9 on the C3 and C6.
5. **Read before you write.** Ask the chip what it is and how much flash it has, then save the original firmware, so that you can go back:

~~~sh
esptool --port COM5 flash-id
esptool --port COM5 read-flash 0 0x400000 backup.bin
~~~

(0x400000 is 4 MB: use the size the first command reports. Older tools are called esptool.py and use underscores.)

6. **Write** the new firmware, release the boot pin, remove the adapter, and only then reassemble the case and plug in.

### Safer routes

Many devices never need opening: a local web interface (see [[shelly-sonoff-and-smart-plugs]]), MQTT, or devices sold with ESPHome or Tasmota already on them, as the catalogue lists for Athom plugs.

> [!key] Reflash only a device you own, only with the power off and the supply understood, and only after saving the original firmware. It ends the warranty and the safety approval, and a locked flash or a non-ESP chip may rule it out; a local interface is often enough.`,
  ideas: [
    'Reflashing a device you own is your right; it ends the warranty and the safety approval and removes the maker\'s cloud.',
    'Know the chip of your exact unit first: ESP chips use the ESP tools, other chips do not, and some flash is locked.',
    'Open a mains device only when it is unplugged; power the chip from a serial adapter, never from the mains side.',
    'Read the chip and save the original firmware before you write anything.'
  ],
  pitfalls: [
    'If it has an ESP, I can always reflash it — Some devices lock the flash, as the Matter MINIR4M does. Others have no reachable pads or a different chip in your revision.',
    'The low-voltage side is safe once the case is open — Not while it is plugged in: in a non-isolated design the serial pads are at mains potential. Always unplug.',
    'The original firmware is not worth saving — A backup is what lets you undo a mistake. Without it a failed attempt may leave only a blank chip.'
  ],
  terms: [
    { term: 'Reflashing', also: ['flashing', 'custom firmware', 'cross-flashing'], def: 'Replacing the firmware a device shipped with by another, such as ESPHome or Tasmota, by writing to its flash memory.' },
    { term: 'Serial pads', also: ['programming pads', 'UART pads'], def: 'Small solder pads on a board that carry the chip\'s serial lines (TX, RX), power and often the boot pin, which a 3.3 V serial adapter connects to for flashing.' },
    { term: 'Flash lock', also: ['locked flash', 'flash encryption', 'secure boot'], def: 'Chip settings, burned into one-time fuses, that stop the flash being read or rewritten with ordinary tools. Used by products that must stay as certified.' },
    { term: 'Brick', also: ['bricked'], def: 'A device left unable to start after a failed firmware write. A saved backup and access to the boot pin usually bring it back; a locked chip may not return.' }
  ],
  choose: {
    good: ['A device you own whose chip, revision and pads are documented by others', 'A plug that you have a saved backup for and a plan to restore it', 'Devices sold ready with open firmware: no opening needed'],
    avoid: ['Opening a device that is plugged in, for any reason', 'A device with locked flash or a non-ESP chip: the ESP tools do not apply', 'Reflashing a device that protects a heater or other safety-critical load without equal protection in your firmware'],
    check: ['The chip and revision of your unit, from a database entry that matches your model', 'Whether the supply is isolated, before any adapter is connected', 'That the adapter is 3.3 V and that you have the boot pin location']
  },
  quiz: [
    { q: 'Which is the first step when considering reflashing a smart plug?', choices: ['Order a serial adapter', 'Find out the chip and revision of your exact unit', 'Open the case with it plugged in', 'Download firmware'], a: 1, why: 'If the chip is not an ESP, or the flash is locked, the rest of the method does not apply. Check databases for your model and revision before buying or opening anything.' },
    { q: 'Why save the original firmware before writing the new one?', choices: ['The chip needs it for the new firmware to run', 'So that you can restore the device if the new firmware fails or you change your mind', 'It is required by law', 'It speeds up flashing'], a: 1, why: 'A backup is the way back to a working device, to its original behaviour and to a warranty claim that is still possible in some cases.' },
    { q: 'The serial pads of a plug that is plugged in are safe to touch because they carry only 3.3 V.', a: false, why: 'In a non-isolated supply the whole low-voltage side sits at mains potential. Never connect anything to a device that is plugged in.' },
    { q: 'Which pin is held to ground during power-up to put an ESP32-C3 into serial download mode?', choices: ['GPIO0', 'GPIO2', 'GPIO9', 'GPIO12'], a: 2, why: 'GPIO9 is the boot pin on the C3 and C6; GPIO0 on the ESP8266 and ESP32.' }
  ],
  applications: [
    'Making a plug or relay work with a local home automation system, with no vendor cloud.',
    'Keeping a device running after its maker closes the service that it depended on.',
    'Adding a feature (power monitoring, MQTT, a different protocol) the original firmware lacks.',
    'Learning how a commercial product is built, from a device that you own.'
  ],
  sources: [
    'Espressif, *esptool documentation*: flash-id, read-flash, write-flash and the boot mode of each chip.',
    'ESPHome and Tasmota documentation, and the community device databases (ESPHome Devices, Blakadder Templates).',
    'The manufacturer\'s own safety and warranty statements for the product, and local electrical-safety rules.'
  ],
  sim: ['cp-reflash-check', { id: 'cp-smart-plug', params: { isolation: 'none' } }]
}
);
