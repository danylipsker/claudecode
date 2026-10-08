/* HYPER-ESP32 · content/bluetooth-and-ble.js
 *
 * Topic "bluetooth-and-ble" (branch wireless): Classic and Low Energy and which chips have which; BLE roles, advertising
 * and beacons; GATT; read, write, notify; connection parameters; pairing; a serial port and HID over BLE; Classic for serial
 * and audio; Bluetooth 5; Mesh and LE Audio; the two stacks. Simulations: sims/bluetooth-and-ble.js (ids bt-*).
 */
Hyper.add(
/* ================================================================ Classic and Low Energy */
{
  id: 'bluetooth-classic-and-le',
  parent: 'bluetooth-and-ble',
  title: 'Classic and Low Energy',
  level: 1,
  short: 'Bluetooth is two radio systems under one name. Classic streams audio and serial data and keeps a link busy; Low Energy sends small messages and sleeps. Which ESP32 chips have which, and why most of them have only the second.',
  keywords: ['Bluetooth', 'Classic', 'BR/EDR', 'Low Energy', 'BLE', 'LE', 'dual-mode', 'Bluetooth 4.2', 'Bluetooth 5', 'Bluetooth version', 'A2DP', 'SPP', 'which chip has Bluetooth', 'iPhone', 'Web Bluetooth', 'core specification'],
  prereq: ['radio-basics', 'chip-module-board'],
  related: ['ble-roles', 'bluetooth-classic-spp-and-a2dp', 'ble-5-long-range-and-extended-advertising', 'the-shared-radio', 'the-family-at-a-glance', 'soc-esp32'],
  body: `The word Bluetooth covers two different radio systems that share a name, a frequency band and a logo, and that cannot talk to each other. **Classic**, formally *BR/EDR* (Basic Rate / Enhanced Data Rate), is the original of 1999: a connection that stays up and carries a steady stream, such as a phone call, music, or a serial cable replaced by air. **Low Energy** (LE, BLE) arrived with version 4.0 in 2010 and is built for the opposite job: a small message now and then, and sleep in between, for seconds or hours.

### Two radios, one band

Both live in the 2.4 GHz band, 2402 to 2480 MHz, the slice that Wi-Fi and microwave ovens also use ([[the-shared-radio]]), and both hop from channel to channel to dodge interference. The details differ:

| | Classic (BR/EDR) | Low Energy |
|---|---|---|
| Channels | 79, 1 MHz apart | 40, 2 MHz apart: 3 for advertising, 37 for data |
| Raw bit rate | 1 Mbit/s, or 2 and 3 Mbit/s with EDR | 1 Mbit/s; 2 Mbit/s and long range from Bluetooth 5 |
| Built for | streams: audio, voice, serial | short messages, sensors, beacons, keyboards |
| The link | busy for as long as it is open | wakes for a moment every 7.5 ms to 4 s |
| Radio on | all the time while streaming | a small fraction of the time |
| Talks to | Classic devices | LE devices |

A **dual-mode** device speaks both: every phone, and the original ESP32. A chip with LE only can never be a wireless speaker for a phone, because music travels over Classic's A2DP profile, and a Classic-only gadget never shows up in an LE scan.

### Which ESP has what

Classic is rare in the family. Only the **original ESP32** and the **ESP32-S31** are microcontrollers that have it (the ESP32-E22 co-processor has it too). The ESP32-S3, C3, C6, C2, H2, C5 and C61 are LE only, with LE 5.0 on the S3 and C3, 5.3 on the C6, C2 and H2, and 6.0 on the C5 and C61. The **ESP32-S2, ESP32-P4 and ESP8266 have no Bluetooth at all**. The original ESP32 has the older LE 4.2, so no 2 Mbit/s mode, no long range and no extended advertising ([[ble-5-long-range-and-extended-advertising]]). The simulation below draws this table from the board catalogue and filters it by what you need.

### Which do you need?

- **Sensors, beacons, keyboards, provisioning, phone apps:** LE, on every chip with Bluetooth. A web page can talk to it too: Web Bluetooth in Chrome and Edge is LE only.
- **Streaming music or a serial port to an Android phone:** Classic, so an ESP32 or S31 ([[bluetooth-classic-spp-and-a2dp]]). The newest chips are adding LE Audio ([[ble-mesh-and-le-audio]]).
- **An iPhone:** it speaks LE to any app, but ordinary iPhone apps cannot open a Classic serial port. Use LE ([[ble-uart-service]]).

> [!key] Classic and Low Energy are separate radios that do not interoperate. Only the original ESP32 and the ESP32-S31 have Classic; every other Bluetooth chip of the family is LE only, and the S2 and P4 have no Bluetooth.`,
  ideas: [
    'Classic is for steady streams (audio, serial); Low Energy is for small messages and long sleeps. They use different radios and do not talk to each other.',
    'Both share the 2.4 GHz band with Wi-Fi and hop between channels; LE has 40 channels, three of them for advertising.',
    'Among the microcontrollers only the original ESP32 and the ESP32-S31 have Classic; the S2 and P4 have no Bluetooth.',
    'Version 5 adds a 2 Mbit/s mode, long range and extended advertising to LE only; the original ESP32 stops at LE 4.2.'
  ],
  pitfalls: [
    'My ESP32-C3 supports Bluetooth, so my phone can use it as a speaker — Speaker audio travels over Classic, which the C3 does not have. It can only be an LE device.',
    'Newer Bluetooth versions just mean more speed — Versions mostly add features for LE: range, advertising size, direction finding, audio. Speed matters little to a sensor that sends ten bytes a minute.',
    'Any Bluetooth chip can serve an Android serial terminal app — The classic serial profile (SPP) is Classic. On an LE-only chip the equivalent is a serial service over LE ([[ble-uart-service]]).'
  ],
  terms: [
    { term: 'Bluetooth Classic', also: ['BR/EDR', 'Basic Rate / Enhanced Data Rate'], def: 'The original Bluetooth radio system: 79 channels, a connection that stays busy, and profiles for audio, serial ports and hands-free calls. On the ESP32 family only the original ESP32 and the ESP32-S31 have it.' },
    { term: 'Bluetooth Low Energy', also: ['BLE', 'LE', 'Bluetooth Smart'], def: 'The second Bluetooth radio system, added in version 4.0: 40 channels, short bursts of data and long sleeps. Every Bluetooth-capable chip of the family has it.' },
    { term: 'Dual-mode', also: ['BR/EDR/LE'], def: 'A device that implements both Classic and Low Energy. Phones and the original ESP32 are dual-mode; the LE-only chips are not.' },
    { term: 'Profile', also: ['Bluetooth profile'], def: 'An agreed recipe for one job over Bluetooth, such as A2DP for stereo audio or SPP for a serial port, so that devices from different makers work together.' },
    { term: 'Core Specification', also: ['Bluetooth Core Specification', 'Bluetooth version'], def: 'The standards document of the Bluetooth SIG. Its version number (4.2, 5.0, 5.3, 6.0) tells which Low Energy features a chip can have; a chip may claim a version and still omit optional features.' }
  ],
  choose: {
    good: ['Low Energy for anything small, occasional and battery-powered, or that a phone app or web page must reach', 'Classic only when a phone must stream audio to the ESP or open a serial port, which means an ESP32 or ESP32-S31', 'An LE chip such as the ESP32-C3, C6 or H2 when no audio is needed: cheaper, simpler, and the same on every phone'],
    avoid: ['An LE-only chip for a speaker or hands-free project', 'Classic for new low-power designs: the link is busy and the radio draws current all the time', 'Counting on a Bluetooth version number alone: check the optional features in the catalogue'],
    check: ['Whether the chip has Classic, with the chip table below', 'Which LE features you need: 2 Mbit/s, long range, extended advertising, mesh', 'What the other end speaks: iPhone, Android, a web page']
  },
  quiz: [
    { q: 'An ESP32-C3 board is paired with a phone. What can it be?', choices: ['A Classic stereo speaker and an LE sensor', 'An LE device only', 'A Classic device only', 'Nothing: the C3 has no Bluetooth'], a: 1, why: 'The ESP32-C3 has Bluetooth LE 5.0 and no Classic radio, so it can be an LE peripheral or central but never a Classic speaker or serial device.' },
    { q: 'You want an ESP to receive music from a phone over A2DP and play it through a DAC. Which chip fits?', choices: ['ESP32-S3', 'ESP32-C6', 'Original ESP32', 'ESP32-H2'], a: 2, why: 'A2DP is a Classic profile. Of the microcontrollers only the original ESP32 and the ESP32-S31 have a Classic radio.' },
    { q: 'A Bluetooth LE device and a Classic-only device can connect as long as both are version 4.0 or newer.', a: false, why: 'They use different radio systems with different channels, packets and procedures. Only a dual-mode device can talk to both kinds.' },
    { q: 'How many channels does Low Energy use for advertising?', choices: ['1', '3', '37', '79'], a: 1, why: 'Three of its 40 channels (numbers 37, 38 and 39, at 2402, 2426 and 2480 MHz) carry advertising. The other 37 carry data in a connection.' }
  ],
  applications: [
    'Phone-controlled gadgets and sensors that use LE, from a plant monitor to a lamp ([[project-ble-presence]]).',
    'Wireless speakers and audio receivers on the original ESP32, over Classic ([[bluetooth-audio]]).',
    'Setting up a Wi-Fi device from a phone over LE ([[wifi-provisioning]]).',
    'Choosing the chip for a battery-powered LE product ([[sleepy-ble-zigbee-thread]]).'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*: Volume 2 (BR/EDR controller) and Volume 6 (Low Energy controller).',
    'Espressif, datasheets of the ESP32, ESP32-C3, ESP32-S3 and ESP32-C6: the Bluetooth feature lists.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth API": which chips support Classic and LE.'
  ],
  sim: 'bt-chips'
},

/* ================================================================ roles */
{
  id: 'ble-roles',
  parent: 'bluetooth-and-ble',
  title: 'Roles: peripheral, central, broadcaster, observer',
  level: 1,
  short: 'Who speaks first and who may connect. Four roles on the radio (broadcaster, observer, peripheral, central) and two more for the data (server and client): what each means and which one your ESP should play.',
  keywords: ['peripheral', 'central', 'broadcaster', 'observer', 'GAP', 'GATT server', 'GATT client', 'scanner', 'advertiser', 'gateway', 'master', 'slave', 'initiator', 'Bluetooth proxy', 'scan'],
  prereq: ['bluetooth-classic-and-le'],
  related: ['ble-advertising', 'gatt', 'ble-between-boards', 'ble-beacons', 'project-ble-presence'],
  body: `Bluetooth LE describes two separate questions: how devices find and connect to each other, and how they exchange data once connected. The first is answered by the **GAP roles**, the second by the **GATT roles** ([[gatt]]).

### The four GAP roles

- **Broadcaster:** sends advertising packets and nothing else. It cannot be connected to. A temperature sensor that shouts its reading every few seconds, or a beacon ([[ble-beacons]]), is a broadcaster.
- **Observer:** only listens for advertising. It never connects. A gateway that collects readings from many broadcasters, or a counter of nearby devices, is an observer.
- **Peripheral:** advertises in a *connectable* way and accepts a connection from a central. Typically the small device: a sensor, a lamp, a keyboard, a wristband.
- **Central:** scans, picks a device and *starts* the connection. Typically the bigger device: a phone, a laptop, or another ESP. A central can hold several connections at once.

Older texts say *master* for the central and *slave* for the peripheral. The central also has the last word on the timing of the link ([[ble-connection-parameters]]).

### The two GATT roles

Once connected, one side keeps the data (the **server**, with its services and characteristics) and the other reads and writes it (the **client**). Usually the peripheral is the server and the central the client, but the two pairs are independent: a keyboard peripheral may also act as a client to read the time from the phone. Any device can play both.

### Which role for my ESP?

Connections cost power, memory and a pairing step; advertising costs none of those. So the cheap answer is often no connection at all.

| You want | ESP role | Why |
|---|---|---|
| Publish a reading everyone may see | Broadcaster | No connection, no pairing, the lowest cost |
| Collect readings from many sensors | Observer | One scan hears dozens of devices |
| Let a phone read, write or get notified | Peripheral and GATT server | The phone connects and drives |
| Pull data from a few BLE sensors | Central and GATT client | The ESP connects and reads them |

An ESP can play several roles at once, scanning while it is connected or advertising while it holds one connection, and run Wi-Fi alongside, but they all share one radio and its memory, and the number of simultaneous connections is a setting of the build ([[the-shared-radio]]). The Home Assistant "Bluetooth proxy" built from an ESP is an observer and central that forwards what it hears over Wi-Fi.

> [!key] Broadcasters shout, observers listen, peripherals wait to be connected and centrals do the connecting. Separately, a GATT server keeps the data and a client asks for it. If the data is small and public, skip the connection altogether.`,
  ideas: [
    'Four roles on the radio: broadcaster (advertises, not connectable), observer (listens only), peripheral (advertises and accepts a connection), central (scans and starts a connection).',
    'The central chooses when to connect and sets the timing; a central may hold several connections.',
    'GATT server and client describe who keeps the data; they are independent of who is the peripheral.',
    'Where a connection is not needed, a broadcaster and an observer are cheaper and simpler.'
  ],
  pitfalls: [
    'The peripheral is always the GATT server — Usually, but the roles are independent: a peripheral can be a GATT client of the central.',
    'Two ESPs advertising will find each other — Advertising is only half of it. One has to scan, so one must be an observer or central.',
    'A phone and an ESP can both be peripherals and still connect — A connection needs one peripheral and one central. Two devices that only advertise ignore each other.'
  ],
  terms: [
    { term: 'Peripheral', also: ['slave', 'advertiser'], def: 'The role that advertises as connectable and waits for a central to connect. In a connection it is the device that may skip events to sleep.' },
    { term: 'Central', also: ['master', 'initiator', 'scanner'], def: 'The role that scans for advertisers, chooses one and starts the connection. It sets the timing of the connection.' },
    { term: 'Broadcaster', also: ['beacon'], def: 'A device that only sends advertising packets and cannot be connected to.' },
    { term: 'Observer', also: ['scanner'], def: 'A device that only listens for advertising packets and never connects.' },
    { term: 'GAP', also: ['Generic Access Profile'], def: 'The part of Bluetooth that defines roles, advertising, scanning, connecting and pairing: everything before the data exchange.' }
  ],
  choose: {
    good: ['Broadcaster and observer for readings that anyone may see', 'Peripheral and GATT server for something a phone controls', 'Central for an ESP that collects from a few BLE sensors'],
    avoid: ['A connection for ten bytes a minute that could be advertised', 'A central holding many connections on a small chip with little RAM', 'Assuming two advertisers see each other'],
    check: ['How many simultaneous connections the build allows', 'Whether the other end is a phone (always a central) or another ESP', 'The memory left once Wi-Fi is on too']
  },
  quiz: [
    { q: 'A coin-cell sensor puts its reading in the advertisement every two seconds and never accepts a connection. Which role is it?', choices: ['Central', 'Peripheral', 'Broadcaster', 'Observer'], a: 2, why: 'It only sends advertising and cannot be connected to: that is a broadcaster. A peripheral also advertises, but as connectable, and waits for a central.' },
    { q: 'Which device starts a Bluetooth LE connection?', choices: ['The peripheral, by sending a connect request', 'The central, after it has heard the advertising', 'Whichever device was switched on first', 'The GATT server'], a: 1, why: 'The peripheral advertises and waits; the central scans, chooses a device and sends the connection request. A phone is almost always the central.' },
    { q: 'A device that is a peripheral must also be the GATT server of its connection.', a: false, why: 'The GAP roles (who connects) and the GATT roles (who keeps the data) are independent. A peripheral is usually the server, but it can also be a client, for instance to read the time from the phone.' },
    { q: 'Ten sensors broadcast a reading in their advertisements and you want an ESP to forward them over Wi-Fi. Which is the cheapest role for the ESP?', choices: ['Central that connects to all ten', 'Observer that listens to the advertisements', 'Peripheral', 'Broadcaster'], a: 1, why: 'An observer needs no connection, no pairing and no per-device memory: one scan hears all ten. Ten connections would cost RAM and power for no gain.' }
  ],
  code: [
    {
      title: 'Scan for devices around you (observer)',
      about: 'Listens for five seconds and prints every device it heard: name (if the advertisement carries one), address and signal strength. No connection is made.',
      needs: 'Any ESP32-family board with Bluetooth LE, and the serial monitor at 115200 baud. Scanning other people\'s devices only lists what they broadcast to everyone; do not use addresses to track people.',
      blocks: `
        when started
          start serial at (115200) baud
          start BLE as [] :: ble
          scan for (5) seconds :: ble
          for each [device v] in (scan results :: ble)
            print (join (name of (device)) [ | ] (address of (device)) [ | ] (RSSI of (device)))
          end
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEScan.h>

        void setup() {
          Serial.begin(115200);
          BLEDevice::init("");                         // no name: we only listen
          BLEScan *scan = BLEDevice::getScan();
          scan->setActiveScan(true);                   // also ask for scan responses: names often live there
          scan->setInterval(100);                      // a listening window starts every 100 ms
          scan->setWindow(99);                         // and lasts 99 ms
          BLEScanResults *found = scan->start(5, false);   // five seconds, waits here
          for (int i = 0; i < found->getCount(); i++) {
            BLEAdvertisedDevice d = found->getDevice(i);
            Serial.printf("%-20s | %s | %d dBm\n", d.getName().c_str(), d.getAddress().toString().c_str(), d.getRSSI());
          }
          scan->clearResults();                        // free the memory of the list
        }

        void loop() {}
      `,
      py: String.raw`
        import bluetooth, binascii, time

        _IRQ_SCAN_RESULT = 5
        ble = bluetooth.BLE()
        ble.active(True)
        seen = {}                                      # address -> (name, rssi)

        def name_of(adv):                              # walk the advertising structures: length, type, data
            i = 0
            while i + 1 < len(adv):
                n = adv[i]
                if n == 0:
                    break
                if adv[i + 1] in (0x08, 0x09):         # shortened or complete local name
                    try:
                        return bytes(adv[i + 2:i + 1 + n]).decode()
                    except UnicodeError:
                        return "?"
                i += n + 1
            return ""

        def irq(event, data):
            if event == _IRQ_SCAN_RESULT:
                addr_type, addr, adv_type, rssi, adv = data
                key = bytes(addr)                      # the values are only valid inside the handler: copy them
                name = name_of(bytes(adv)) or seen.get(key, ("", 0))[0]
                seen[key] = (name, rssi)

        ble.irq(irq)
        ble.gap_scan(5000, 100_000, 99_000, True)      # duration ms, interval us, window us, active scan
        time.sleep(6)
        for key, (name, rssi) in seen.items():
            print("%-20s | %s | %d dBm" % (name, binascii.hexlify(key, ":").decode(), rssi))
      `,
      output: `esp-demo             | 3c:84:27:aa:01:5e | -48 dBm
                     | 6a:11:92:c4:3d:70 | -71 dBm
Mi Band 7            | d9:42:0b:77:e1:08 | -83 dBm`,
      notes: [
        'Many devices advertise no name, or only in the scan response. Active scanning asks for the response, at the price of a few more packets.',
        'Phones and many gadgets change their address every few minutes for privacy (a random, resolvable address). The same device can appear as several entries.',
        'The Arduino scan call above waits for the scan to end. Use the scan callback class of the BLE library when the program must do other work meanwhile.'
      ]
    }
  ],
  applications: [
    'A phone is the central and a wristband the peripheral: the everyday case.',
    'An ESP as a Bluetooth proxy for a smart-home hub: an observer that forwards what it hears.',
    'A room-presence sensor that counts known beacons ([[project-ble-presence]]).',
    'An ESP central that reads a few BLE sensors and forwards them over Wi-Fi.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 3 Part C, "Generic Access Profile": the roles and procedures.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy": GAP, GATT client and server, and the number of connections.',
    'MicroPython documentation, library "bluetooth": gap_scan, gap_advertise and the events.'
  ],
  sim: 'bt-roles'
},

/* ================================================================ advertising */
{
  id: 'ble-advertising',
  parent: 'bluetooth-and-ble',
  title: 'Advertising',
  level: 1,
  short: 'How a Bluetooth LE device says "I am here": a 31-byte packet sent on three channels at an interval you choose. What goes into it, how a scanner catches it, and the trade between being found quickly and sipping current.',
  keywords: ['advertising', 'advertisement', 'advertising interval', 'scan response', 'AD structure', 'flags', 'local name', 'service UUID', 'manufacturer data', 'legacy advertising', '31 bytes', 'channel 37', 'scan window', 'discovery', 'connectable', 'active scan'],
  prereq: ['ble-roles', 'radio-basics'],
  related: ['ble-beacons', 'gatt', 'ble-5-long-range-and-extended-advertising', 'sleepy-ble-zigbee-thread', 'battery-life-budget'],
  body: `Before anything else a Bluetooth LE device has to be found. It does so by **advertising**: every so often, the *advertising interval*, it sends a short packet on channel 37, then 38, then 39 (2402, 2426 and 2480 MHz, spread across the band to dodge Wi-Fi), the three together being one *advertising event*. Between events the radio sleeps. A scanner that happens to be listening on one of those channels at that moment catches it.

### What the packet holds

A classic (*legacy*) advertising packet carries at most **31 bytes** of data, built from **AD structures**: one length byte, one type byte, then data.

| Structure | Type | What it says |
|---|---|---|
| Flags | 0x01 | Discoverable, and "no Classic Bluetooth" (value 0x06) |
| Complete local name | 0x09 | The name shown in scan lists |
| Service UUIDs | 0x03 (16-bit) or 0x07 (128-bit) | Which services the device offers |
| Manufacturer data | 0xFF | Anything: a company number and your own bytes |
| TX power | 0x0A | How loud the device sends, to estimate distance |

Thirty-one bytes go fast: the flags take 3, a 128-bit service UUID takes 18, and a name of eight letters takes 10. That is why long names get cut and why the library puts the name in a second packet, the **scan response**, which a scanner asks for with an *active scan* and which holds another 31 bytes. The simulation below counts the bytes.

### How fast, how often

The interval runs from 20 ms to 10.24 s. A short interval is found quickly and costs current; a long one saves current and may be missed for seconds. Each event adds a random delay of up to 10 ms so that two devices do not collide for ever. On the receiving side the scanner listens for a *window* out of every *scan interval* on one channel at a time, so discovery is a game of chance: the simulation plays it and measures the median time to the first catch.

The current of a beacon is a simple average, the formula below: a few milliseconds with the radio on, a long sleep in between. An ESP spends much more in each event than a dedicated Bluetooth chip, so measure your own board before promising a coin-cell lifetime ([[battery-life-budget]]).

### Connectable or not

An advertisement can say *connect to me* (a peripheral) or only *here is data* (a broadcaster). Non-connectable advertising can still be *scannable*, and then a scanner may ask for the scan response; advertising that is neither connectable nor scannable is a plain broadcast. Bluetooth 5 adds longer, extended advertising on other channels ([[ble-5-long-range-and-extended-advertising]]).

> [!key] Advertising is a 31-byte message repeated on channels 37, 38 and 39 every interval. A shorter interval means faster discovery and more current, and a name or UUID that does not fit goes into the scan response.`,
  ideas: [
    'An advertising event is one packet on each of channels 37, 38 and 39, repeated every advertising interval (20 ms to 10.24 s).',
    'Legacy advertising holds 31 bytes made of length-type-data structures; a scan response adds another 31 bytes on request.',
    'Finding a device is chance: the scanner listens for a window on one channel, so discovery time grows with the advertising interval.',
    'Average current is the event current for its few milliseconds plus the sleep current for the rest of the interval.'
  ],
  pitfalls: [
    'A name of any length fits in the advertisement — Thirty-one bytes include the flags and the UUIDs. A long name is cut or moved to the scan response.',
    'A 100 ms interval means the phone sees the device within 100 ms — The scanner is listening on one channel for part of the time. Typical discovery takes much longer than one interval.',
    'Advertising is free because it only sends — Each event wakes the radio and the chip. On an ESP the event costs tens of milliampere for a few milliseconds.'
  ],
  terms: [
    { term: 'Advertising', also: ['advertisement', 'ADV'], def: 'A device sending short packets on the three advertising channels at regular intervals so that others can find it, read its data or connect to it.' },
    { term: 'Advertising interval', also: ['adv interval'], def: 'The time between the starts of two advertising events. Between 20 ms and 10.24 s, in steps of 0.625 ms; the stack adds a random delay of up to 10 ms.' },
    { term: 'AD structure', also: ['advertising data', 'AD element'], def: 'One item of advertising data: a length byte, a type byte and the data. A legacy packet holds up to 31 bytes of them.' },
    { term: 'Scan response', also: ['SCAN_RSP'], def: 'A second packet of up to 31 bytes that an advertiser sends only when a scanner asks for it (active scan). It often carries the device name.' },
    { term: 'Scan window', also: ['scan interval', 'duty cycle of the scanner'], def: 'How long the scanner listens (the window) out of every scan interval. A window equal to the interval means listening all the time, and the most current.' }
  ],
  choose: {
    good: ['100 to 500 ms intervals while a user is waiting to find the device', '1 to 2 s intervals for a sensor that a gateway collects', 'Name and flags in the advertisement, the long UUID in the scan response or the other way round'],
    avoid: ['Intervals under 100 ms except for a few seconds after a button press', 'A 128-bit UUID and a long name in the same 31 bytes', 'Leaving advertising on all the time when nobody needs to find the device'],
    check: ['The average current on your own board with a current meter', 'How long the slowest scanner (the phone app) takes to find you', 'That the payload fits, with the byte counter']
  },
  quiz: [
    { q: 'A device advertises flags (3 bytes), a 128-bit service UUID (18 bytes) and a ten-letter name (12 bytes). Does it fit in one legacy advertising packet?', choices: ['Yes, with room to spare', 'Yes, exactly', 'No: 33 bytes, so something must move to the scan response', 'No: a 128-bit UUID never fits'], a: 2, why: 'The packet holds 31 bytes and 3 + 18 + 12 = 33. The name or the UUID goes into the scan response, which an active scanner asks for.' },
    { q: 'You change the advertising interval from 100 ms to 1 s. What happens?', choices: ['The average current falls and a scanner takes longer to find the device', 'The average current rises and discovery gets faster', 'The range doubles', 'Nothing changes: the interval only affects connections'], a: 0, why: 'Ten times fewer events means about a tenth of the event current, and ten times fewer chances for a scanner to be listening on the right channel at the right moment.' },
    { q: 'An advertiser sends its scan response in every event, whether or not anyone asks.', a: false, why: 'The scan response goes out only when a scanner doing an active scan asks for it after hearing the advertisement. A passive scanner never sees it.' },
    { q: 'Why does the stack add a random delay of up to 10 ms to every advertising event?', choices: ['To save current', 'So that two advertisers with the same interval do not collide in every event', 'To give the scanner time to switch channels', 'Because the specification requires 10 ms between channels'], a: 1, why: 'Without the delay, two devices that started at the same moment with the same interval would transmit on top of each other for ever. The random part makes the collisions pass.' }
  ],
  formulas: [
    {
      name: 'Average current of advertising',
      expr: 'I = (Ie*te + Is*(T - te))/T',
      tex: 'I = \\frac{I_e\\,t_e + I_s\\,(T - t_e)}{T}',
      vars: {
        I: { name: 'average current', q: 'current', unit: 'mA' },
        Ie: { name: 'current while the event runs', q: 'current', unit: 'mA', value: 90, min: 0 },
        te: { name: 'length of the event, radio on', q: 'time', unit: 'ms', value: 4, min: 0 },
        Is: { name: 'current while sleeping', q: 'current', unit: 'µA', value: 130, min: 0 },
        T: { name: 'advertising interval', q: 'time', unit: 'ms', value: 1000, min: 20 }
      },
      solveFor: 'I',
      note: 'The event length includes waking up and starting the crystal, not only the three packets. The 90 mA is a receive-class figure of an ESP; measure your own board, and see [[battery-life-budget]].'
    }
  ],
  examples: [
    {
      title: 'A beacon on a coin cell',
      q: 'An ESP32-C3 beacon advertises once a second. The radio is on for 4 ms at 90 mA, and the chip sleeps at 130 µA the rest of the time. How long does a 225 mAh CR2032 last?',
      steps: ['Average current: $(90 \\times 4 + 0.13 \\times 996) / 1000 \\approx 0.49$ mA.', 'Life: $225 / 0.49 \\approx 460$ hours, about 19 days.'],
      a: 'About three weeks, before counting that a coin cell cannot supply 90 mA bursts well. A beacon chip made for coin cells does the same job on a few microampere; an ESP needs a bigger cell or a longer interval.'
    }
  ],
  code: [
    {
      title: 'Advertise a name and a service',
      about: 'Makes the ESP visible as "esp-demo" in every scanner list, announcing the Environmental Sensing service, every 100 ms. Nothing can be read yet: this is only the "I am here".',
      needs: 'Any ESP32-family board with Bluetooth LE. Look for it with a phone app such as nRF Connect or LightBlue.',
      blocks: `
        when started
          start BLE as [esp-demo] :: ble
          add service [181A] :: ble
          set advertising interval to (100) ms :: ble
          start advertising :: ble
      `,
      cpp: String.raw`
        #include <BLEDevice.h>

        void setup() {
          BLEDevice::init("esp-demo");                      // the name: the library puts it into the advertisement
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(BLEUUID((uint16_t)0x181A));   // "I offer environmental sensing"
          adv->setScanResponse(true);                       // allow a second 31-byte packet on request
          adv->setMinInterval(160);                         // 160 x 0.625 ms = 100 ms
          adv->setMaxInterval(160);
          BLEDevice::startAdvertising();
        }

        void loop() {
          delay(1000);                                      // everything happens in the Bluetooth task
        }
      `,
      py: String.raw`
        import bluetooth, struct

        ble = bluetooth.BLE()
        ble.active(True)

        def ad(kind, payload):                              # one structure: length, type, data
            return bytes((len(payload) + 1, kind)) + payload

        adv_data = (ad(0x01, b"\x06")                       # flags: discoverable, no Classic Bluetooth
                    + ad(0x03, struct.pack("<H", 0x181A))   # complete list of 16-bit service UUIDs
                    + ad(0x09, b"esp-demo"))                # complete local name
        ble.gap_advertise(100_000, adv_data=adv_data)       # interval in microseconds
      `,
      output: `(nothing on the serial port) A scanner shows "esp-demo", signal about -50 dBm at one metre.`,
      notes: [
        'In Arduino the flags are added for you. The MicroPython payload is 17 bytes: 3 for the flags, 4 for the UUID and 10 for the name.',
        'Advertising is not connecting: without a GATT server ([[gatt]]) a connection finds nothing to read.',
        'The Arduino core 3.3 uses NimBLE under this same code on every chip except the original ESP32, which uses Bluedroid ([[ble-stacks-nimble-bluedroid]]).'
      ]
    }
  ],
  applications: [
    'Making a device discoverable for a phone app to connect to.',
    'Broadcasting a sensor reading without any connection ([[ble-beacons]]).',
    'Letting a gateway notice that a tag is nearby ([[project-ble-presence]]).',
    'Advertising briefly after a button press, then sleeping, to save a battery.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 6 Part B, "Link Layer": advertising events, intervals and channels.',
    'Bluetooth SIG, *Core Specification Supplement*: the format of advertising data and the assigned AD type numbers.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy": advertising parameters.'
  ],
  sim: 'bt-advertising'
},

/* ================================================================ beacons */
{
  id: 'ble-beacons',
  parent: 'bluetooth-and-ble',
  title: 'Beacons',
  level: 2,
  short: 'A beacon is a device that only advertises, with a payload other people agreed to read. The iBeacon layout byte by byte, Eddystone, how signal strength turns into a rough distance, and why a beacon is a hint and never a proof.',
  keywords: ['beacon', 'iBeacon', 'Eddystone', 'AltBeacon', 'UUID major minor', 'RSSI', 'distance', 'proximity', 'measured power', 'tx power', 'path loss', 'indoor positioning', 'presence', 'asset tag', 'manufacturer data'],
  prereq: ['ble-advertising', 'decibels-and-dbm'],
  related: ['rssi-and-signal-quality', 'project-ble-presence', 'ble-roles', 'link-budget', 'uwb-ranging'],
  body: `A **beacon** is a broadcaster ([[ble-roles]]) that sends a fixed kind of advertisement so that any phone or gateway can read it, with no connection and no pairing. Its payload says *who* it is; the receiver works out *how near* it is from the signal strength.

### The iBeacon layout

Apple's iBeacon format is the best known. It hides in the manufacturer data of one advertisement, 25 bytes long, and has been copied by many tags and apps:

| Bytes | Content |
|---|---|
| 2 | Company ID 0x004C (Apple), sent low byte first: 4C 00 |
| 1 | Type 0x02 (beacon) |
| 1 | Length 0x15 (21 bytes follow) |
| 16 | A UUID that names your fleet of beacons |
| 2 | **Major**, a number such as the building |
| 2 | **Minor**, a number such as the room |
| 1 | **Measured power**: the signal strength at one metre, as a signed byte |

With the three flag bytes in front, the whole packet is 30 of the 31 bytes (3 for the flags, 2 for the structure header and 25 of data). **Eddystone**, from Google, puts a service UUID (0xFEAA) and a frame (an identifier, a short URL, telemetry) there instead and is now rarely used. An ESP can also broadcast its own format, with manufacturer data of its own bytes, as in the byte counter in the simulation.

### From signal strength to distance

A receiver measures the **RSSI**, the received signal strength in dBm ([[rssi-and-signal-quality]]). The beacon states what RSSI to expect at one metre; the loss over distance follows a power law with the *path-loss exponent* n (2 in open air, 2.5 to 4 indoors), which gives the formula below. The result is a rough guess: walls, bodies, a pocket and the three channels each add several dB of scatter. Treat it as "very near, near, far", not as metres.

### What a beacon cannot do

A beacon sends in the clear to everyone, and anyone can copy its bytes. Do not use one as a key or as proof that a person stands at a door: it proves only that someone sent those bytes ([[ble-security]]). For safe presence, make the ID rotate or use a connection with pairing. Do not use beacon data to follow people without their consent.

> [!key] A beacon is a non-connectable advertisement with an agreed payload: an iBeacon is 25 bytes of UUID, major, minor and measured power. Distance from RSSI is a path-loss guess that is good for near or far, not for metres.`,
  ideas: [
    'A beacon only advertises, with an agreed payload: no connection, no pairing, readable by anyone.',
    'An iBeacon is 25 bytes of manufacturer data: company 4C 00, type 02, length 15, a 16-byte UUID, major, minor and the measured power at 1 m.',
    'Distance from RSSI uses a path-loss exponent and the measured power; indoors it is accurate to a zone, not to a metre.',
    'Beacon data is public and copyable, so it is a hint of presence, never a key.'
  ],
  pitfalls: [
    'RSSI gives me the distance in metres — It gives a rough guess. Bodies, walls and orientation change it by 10 dB or more, which is a factor of two or three in the estimate.',
    'iBeacon only works with Apple devices — The layout is public and Android apps and ESP scanners read it too; only some phone features are Apple\'s.',
    'A beacon at the door is a secure way to unlock it — Anyone can copy the broadcast. Use a paired connection and application-level authentication instead ([[ble-security-practice]]).'
  ],
  terms: [
    { term: 'Beacon', also: ['BLE beacon'], def: 'A device that broadcasts a fixed type of advertisement, repeatedly, for others to read. It does not accept connections.' },
    { term: 'iBeacon', also: ['Apple iBeacon'], def: 'Apple\'s beacon format: a 16-byte UUID, a 2-byte major, a 2-byte minor and a measured-power byte, carried in the manufacturer data of an advertisement.' },
    { term: 'Eddystone', also: ['Eddystone-UID', 'Eddystone-URL'], def: 'A beacon format from Google with frames for an identifier, a short URL and telemetry, announced with the service UUID 0xFEAA.' },
    { term: 'RSSI', also: ['received signal strength indicator'], def: 'The strength of a received signal in dBm, usually between -30 (very strong) and -100 (barely heard) for Bluetooth. It falls with distance, but noisily.' },
    { term: 'Measured power', also: ['TX power at 1 m', 'calibrated power'], def: 'The RSSI a receiver should see one metre from the beacon. It is stored in the beacon\'s payload so receivers can estimate distance.' }
  ],
  choose: {
    good: ['Zone detection: in the room, near the shelf, away', 'Sending a small public value to every listener with no connection', 'Rotating or per-device IDs for anything that tracks assets'],
    avoid: ['Metre-accurate positioning from RSSI alone', 'Any use as a key, a ticket or proof of identity', 'Following people without consent'],
    check: ['The measured power by holding a receiver at one metre', 'How many scanners will hear it and how often they report', 'Your country\'s rules on transmit power and on tracking']
  },
  quiz: [
    { q: 'How long is the manufacturer data of an iBeacon?', choices: ['16 bytes', '21 bytes', '25 bytes', '31 bytes'], a: 2, why: 'Company ID (2) + type (1) + length (1) + UUID (16) + major (2) + minor (2) + measured power (1) = 25 bytes. With the 3 flag bytes and the 2-byte structure header the packet is 30 of the 31 bytes.' },
    { q: 'A beacon states -59 dBm at one metre and you hear it at -69 dBm in open air (n = 2). About how far is it?', choices: ['1 m', '3 m', '10 m', '31 m'], a: 1, why: 'The difference is 10 dB, so d = 10^(10/20) = 10^0.5 which is about 3.2 m. Every 20 dB of loss in open air is a factor of ten in distance.' },
    { q: 'A beacon at a door is a secure key, because only the owner knows its UUID.', a: false, why: 'A beacon sends its UUID in the clear to everyone in range, and anyone can copy the bytes with a scanner. It shows that those bytes were heard, not who sent them.' },
    { q: 'What are the major and minor numbers of an iBeacon for?', choices: ['The software version', 'Two numbers you choose to say which beacon of a fleet this is', 'The signal strength', 'The Bluetooth version'], a: 1, why: 'The UUID names the fleet, the major usually a group (a building, a floor) and the minor the individual beacon (a room). They are yours to assign.' }
  ],
  formulas: [
    {
      name: 'Distance from the signal strength',
      expr: 'd = 10^((P1 - R)/(10*n))',
      tex: 'd = 10^{\\frac{P_1 - R}{10\\,n}}',
      vars: {
        d: { name: 'estimated distance', q: 'length', unit: 'm' },
        P1: { name: 'measured power at 1 m', unit: 'dBm', value: -59, signed: true },
        R: { name: 'received signal strength (RSSI)', unit: 'dBm', value: -75, signed: true },
        n: { name: 'path-loss exponent', q: 'none', value: 2.5, min: 1.5, max: 4 }
      },
      solveFor: 'd',
      note: 'The log-distance model. n is about 2 in open air and 2.5 to 4 indoors. The answer is a guess with a spread of a factor of two or more.'
    }
  ],
  examples: [
    {
      title: 'How far is the tag?',
      q: 'An iBeacon states a measured power of -59 dBm and your ESP hears it at -75 dBm. How far is it in a room (n = 2.5)? And in open air (n = 2)?',
      steps: ['The difference is $-59 - (-75) = 16$ dB.', 'Room: $10^{16/(10 \\times 2.5)} = 10^{0.64} \\approx 4.4$ m.', 'Open air: $10^{16/20} = 10^{0.8} \\approx 6.3$ m.'],
      a: 'About 4.4 m in a room and 6.3 m outdoors. The same reading gives two answers; the distance depends on the model, which is why beacons suit zones better than metres.'
    }
  ],
  code: [
    {
      title: 'Broadcast an iBeacon',
      about: 'Sends the 25-byte iBeacon payload every 100 ms: a UUID of your own, major 1, minor 42, measured power -59 dBm. Phone beacon-scanner apps list it.',
      needs: 'Any ESP32-family board with Bluetooth LE. Make your own UUID; do not reuse the example. A scanner app (nRF Connect, a beacon detector) shows it.',
      blocks: `
        when started
          start BLE as [] :: ble
          set beacon UUID [4fd0d7a1-3c6e-4f1e-9a52-1b7e6c3d8a90] major (1) minor (42) power (-59) :: ble
          set advertising interval to (100) ms :: ble
          start advertising :: ble
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEBeacon.h>

        #define BEACON_UUID "4fd0d7a1-3c6e-4f1e-9a52-1b7e6c3d8a90"   // your own random UUID

        void setup() {
          BLEDevice::init("");
          BLEBeacon beacon;
          beacon.setManufacturerId(0x4C00);                  // company ID 0x004C (Apple), bytes swapped by the library
          beacon.setProximityUUID(BLEUUID(BEACON_UUID));
          beacon.setMajor(1);                                // for example the building
          beacon.setMinor(42);                               // for example the room
          beacon.setSignalPower(-59);                        // RSSI at one metre, in dBm

          BLEAdvertisementData data;
          data.setFlags(0x04);                               // no Classic Bluetooth
          String frame = "";
          frame += (char)26;                                 // length of the structure that follows
          frame += (char)0xFF;                               // type: manufacturer specific data
          frame += beacon.getData();                         // the 25 bytes of the beacon
          data.addData(frame);

          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->setAdvertisementData(data);
          adv->setMinInterval(160);                          // 100 ms
          adv->setMaxInterval(160);
          BLEDevice::startAdvertising();
        }

        void loop() {
          delay(1000);
        }
      `,
      py: String.raw`
        import bluetooth, struct

        ble = bluetooth.BLE()
        ble.active(True)

        uuid = bytes.fromhex("4fd0d7a13c6e4f1e9a521b7e6c3d8a90")        # your own random UUID
        major, minor, power = 1, 42, -59                                # building, room, RSSI at 1 m
        ibeacon = b"\x4c\x00\x02\x15" + uuid + struct.pack(">HHb", major, minor, power)   # 25 bytes
        adv_data = b"\x02\x01\x06" + bytes((len(ibeacon) + 1, 0xFF)) + ibeacon             # flags + manufacturer data
        ble.gap_advertise(100_000, adv_data=adv_data, connectable=False)                   # interval in microseconds
      `,
      output: `(nothing on the serial port) A beacon app shows UUID 4fd0d7a1-…, major 1, minor 42, about -60 dBm at one metre.`,
      notes: [
        'The MicroPython version is not connectable. The Arduino sample leaves the advertisement connectable; for a true beacon, set non-connectable advertising in your stack.',
        'Major and minor are big-endian, the company ID is little-endian: a typical source of "my beacon shows the wrong number".',
        'Calibrate the measured power: hold a phone one metre away, average the RSSI over a minute and write that number in.'
      ]
    }
  ],
  applications: [
    'Room-by-room presence for a smart home ([[project-ble-presence]]).',
    'Asset tags in a workshop: which shelf is the toolbox on.',
    'Museum or shop guides that tell the app which zone the visitor is in.',
    'Sensor nodes that broadcast a reading in manufacturer data and never connect.'
  ],
  sources: [
    'Apple, "Getting Started with iBeacon" (the format of the 25-byte payload).',
    'Bluetooth SIG, *Core Specification Supplement*: manufacturer-specific data and the company identifiers.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy": advertising data and non-connectable advertising.'
  ],
  sim: { id: 'bt-payload', params: { format: 'ibeacon' } }
},

/* ================================================================ GATT */
{
  id: 'gatt',
  parent: 'bluetooth-and-ble',
  title: 'GATT: services and characteristics',
  level: 2,
  short: 'Once connected, a Bluetooth LE device shows its data as a tree: services hold characteristics, characteristics hold a value and descriptors. UUIDs, properties, handles, the switch that turns notifications on, and how a standard service saves you an app.',
  keywords: ['GATT', 'ATT', 'service', 'characteristic', 'descriptor', 'UUID', '16-bit UUID', '128-bit UUID', 'CCCD', '0x2902', 'handle', 'property', 'Battery Service', 'Environmental Sensing', 'Generic Access', 'attribute', 'little-endian', 'nRF Connect', 'LightBlue'],
  prereq: ['ble-roles', 'ble-advertising'],
  related: ['ble-read-write-notify', 'ble-uart-service', 'ble-connection-parameters', 'ble-hid', 'bits-and-bytes'],
  body: `Advertising says *I am here*. Once a central connects, the peripheral has to show *what it has*. It does so through **GATT**, the Generic Attribute Profile: a table of **attributes**, each with a **handle** (its position in the table), a **UUID** (what kind of thing it is), a value and permissions. The table is grouped into a tree:

- A **service** is a topic, such as battery, heart rate or temperature.
- A **characteristic** inside it holds one value, such as the battery level, with a declared set of **properties**: read, write, write without response, notify, indicate.
- A **descriptor** attached to a characteristic adds information about it: a text label, a unit, or the switch that turns notifications on.

The simulation below lets you walk such a tree.

### UUIDs: short and long

Every service and characteristic has a UUID. The Bluetooth SIG assigns **16-bit** numbers for standard things, short forms of the base UUID 0000xxxx-0000-1000-8000-00805F9B34FB, to save bytes. Your own services get a **random 128-bit UUID**; never pick a free-looking 16-bit number for a private service.

| UUID | Meaning |
|---|---|
| 0x1800, 0x1801 | Generic Access (device name, appearance), Generic Attribute: present on every device |
| 0x180F, 0x2A19 | Battery Service, Battery Level (one byte, 0 to 100 percent) |
| 0x181A, 0x2A6E | Environmental Sensing, Temperature (signed 16-bit, in 0.01 °C) |
| 0x180D, 0x2A37 | Heart Rate, Heart Rate Measurement |
| 0x1812 | Human Interface Device ([[ble-hid]]) |
| 0x2902 | Client Characteristic Configuration descriptor (the notification switch) |

### The switch for notifications

A characteristic with the *notify* property also needs a **Client Characteristic Configuration Descriptor (CCCD, 0x2902)**. A client writes 0x0001 to it to ask for notifications and 0x0002 for indications; the server then sends a new value whenever it wants ([[ble-read-write-notify]]). NimBLE and MicroPython add it for you; the Bluedroid-based Arduino library needs it added by hand, and a missing one is the commonest reason that "notify does nothing".

### Values are bytes

A value is a string of bytes, and numbers longer than a byte are **little-endian**: the temperature 22.31 °C is the integer 2231 = 0x08B7, sent as B7 08. A standard characteristic fixes the format, so any app can show it; a custom one is yours to document.

### Standard or custom?

A standard service (Battery, Environmental Sensing, Heart Rate) is understood by tools such as nRF Connect and LightBlue and by many apps, so you need no app of your own. A custom service needs a custom client. Phones **cache** the table: after changing services during development, toggle Bluetooth or forget the device.

> [!key] GATT is a tree of services, characteristics and descriptors, each with a UUID and a handle. Use a standard 16-bit UUID when one exists and your own random 128-bit one otherwise; a notifying characteristic needs its 0x2902 switch; and numbers go on the wire little-endian.`,
  ideas: [
    'GATT shows a device\'s data as services containing characteristics, which hold values and descriptors; each item has a handle and a UUID.',
    'Standard things have 16-bit UUIDs from the Bluetooth SIG; private ones get a random 128-bit UUID.',
    'A characteristic declares its properties (read, write, write without response, notify, indicate); notifications also need the 0x2902 descriptor.',
    'Values are bytes and multi-byte numbers are little-endian; a standard characteristic fixes the format.'
  ],
  pitfalls: [
    'I can use any free 16-bit UUID for my own service — The 16-bit range belongs to the Bluetooth SIG. Use a random 128-bit UUID for private services.',
    'Notifications do not arrive, so the ESP code is broken — Often the characteristic lacks the notify property or the 0x2902 descriptor, or the client never subscribed.',
    'I changed the services but the phone still shows the old ones — Phones cache the attribute table of a known device. Turn Bluetooth off and on, or forget the device.'
  ],
  terms: [
    { term: 'GATT', also: ['Generic Attribute Profile'], def: 'The layer of Bluetooth LE that organises a device\'s data as services, characteristics and descriptors, and defines how a client reads, writes and subscribes to them.' },
    { term: 'Service', also: ['GATT service'], def: 'A group of characteristics that together serve one purpose, such as the Battery Service. A device can offer several.' },
    { term: 'Characteristic', also: ['GATT characteristic'], def: 'One data item of a service: a value plus its properties (read, write, notify and so on) and, optionally, descriptors.' },
    { term: 'Descriptor', also: ['CCCD', 'Client Characteristic Configuration Descriptor'], def: 'An attribute that describes a characteristic. The most important is the CCCD (0x2902), by which a client switches notifications or indications on.' },
    { term: 'UUID', also: ['Universally Unique Identifier', '16-bit UUID', '128-bit UUID'], def: 'The number that says what a service or characteristic is. The Bluetooth SIG assigns short 16-bit ones; private ones are random 128-bit numbers.' },
    { term: 'Handle', also: ['attribute handle'], def: 'The 16-bit position number of an attribute in the device\'s attribute table. A client addresses attributes by handle after discovering them by UUID.' }
  ],
  choose: {
    good: ['A standard service when one fits (battery, environment, heart rate): generic apps just work', 'A custom service with one characteristic per kind of value, and one for commands', 'Few characteristics and small values: each one costs memory and discovery time'],
    avoid: ['Inventing a 16-bit UUID', 'One giant characteristic that packs everything as text', 'Changing the table on a released product without telling clients'],
    check: ['The data format of every standard characteristic you use', 'That notifying characteristics have a CCCD', 'How the phone app caches the table']
  },
  quiz: [
    { q: 'The 16-bit UUID 0x180F stands for which 128-bit UUID?', choices: ['0000180F-0000-1000-8000-00805F9B34FB', '180F0000-0000-0000-0000-000000000000', 'A random value your device generates', 'FFFF180F-FFFF-FFFF-FFFF-FFFFFFFFFFFF'], a: 0, why: 'A 16-bit UUID is a short form that goes into the "xxxx" position of the Bluetooth base UUID 0000xxxx-0000-1000-8000-00805F9B34FB.' },
    { q: 'A phone cannot switch on notifications for your characteristic. What is the most likely cause?', choices: ['The characteristic has no notify property, or no 0x2902 descriptor', 'The UUID is a 16-bit one', 'The device name is too long', 'The ESP is a peripheral'], a: 0, why: 'Notifications need the notify (or indicate) property and the CCCD descriptor, which is the switch the client writes to.' },
    { q: 'A temperature of 22.31 °C is sent in the Temperature characteristic (0x2A6E) as a signed 16-bit value in steps of 0.01 °C. Which two bytes go on the wire?', choices: ['08 B7', 'B7 08', '22 31', '1F 5B'], a: 1, why: '22.31 °C is 2231 = 0x08B7. Bluetooth sends multi-byte numbers little-endian, low byte first: B7 08.' },
    { q: 'For my private service I can use any 16-bit UUID that nobody seems to use.', a: false, why: 'The 16-bit space is assigned by the Bluetooth SIG. A private service takes a random 128-bit UUID, which will not clash with anyone.' }
  ],
  code: [
    {
      title: 'A Battery Service that a phone can read',
      about: 'Offers the standard Battery Service with a Battery Level that starts at 87 percent and falls by one every ten seconds, as a notification to any phone that subscribed.',
      needs: 'Any ESP32-family board with Bluetooth LE. Open nRF Connect or LightBlue on a phone, connect, and read or subscribe to Battery Level.',
      blocks: `
        when started
          set [level v] to (87)
          start BLE as [battery-demo] :: ble
          add service [180F] :: ble
          add characteristic [2A19] [notify v] :: ble
          start advertising :: ble

        every (10) seconds
          change [level v] by (-1)
          notify (level) :: ble
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEServer.h>
        #include <BLE2902.h>

        BLECharacteristic *levelChr;
        uint8_t level = 87;                                  // percent

        void setup() {
          BLEDevice::init("battery-demo");
          BLEServer *server = BLEDevice::createServer();
          server->advertiseOnDisconnect(true);               // advertise again after a phone leaves
          BLEService *battery = server->createService(BLEUUID((uint16_t)0x180F));   // Battery Service
          levelChr = battery->createCharacteristic(
            BLEUUID((uint16_t)0x2A19),                       // Battery Level
            BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
          levelChr->addDescriptor(new BLE2902());            // the 0x2902 switch (NimBLE adds it by itself)
          levelChr->setValue(&level, 1);                     // one byte, 0 to 100
          battery->start();
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(BLEUUID((uint16_t)0x180F));
          BLEDevice::startAdvertising();
        }

        void loop() {
          delay(10000);
          if (level > 0) level--;                            // pretend to discharge
          levelChr->setValue(&level, 1);
          levelChr->notify();                                // sent only to clients that subscribed
        }
      `,
      py: String.raw`
        import bluetooth, struct, time

        _IRQ_CENTRAL_CONNECT = 1
        _IRQ_CENTRAL_DISCONNECT = 2

        ble = bluetooth.BLE()
        ble.active(True)
        BATTERY = bluetooth.UUID(0x180F)                                       # Battery Service
        LEVEL = (bluetooth.UUID(0x2A19), bluetooth.FLAG_READ | bluetooth.FLAG_NOTIFY)   # Battery Level
        ((level_h,),) = ble.gatts_register_services(((BATTERY, (LEVEL,)),))    # the 0x2902 switch is added for us
        level = 87                                                             # percent
        ble.gatts_write(level_h, bytes([level]))                               # one byte, 0 to 100
        conns = set()

        def ad(kind, payload):
            return bytes((len(payload) + 1, kind)) + payload

        def advertise():
            ble.gap_advertise(100_000, adv_data=ad(0x01, b"\x06") + ad(0x03, struct.pack("<H", 0x180F)) + ad(0x09, b"battery-demo"))

        def irq(event, data):
            if event == _IRQ_CENTRAL_CONNECT:
                conns.add(data[0])
            elif event == _IRQ_CENTRAL_DISCONNECT:
                conns.discard(data[0])
                advertise()                                                    # advertise again after a phone leaves

        ble.irq(irq)
        advertise()
        while True:
            time.sleep(10)
            if level > 0:
                level -= 1                                                     # pretend to discharge
            ble.gatts_write(level_h, bytes([level]))
            for conn in conns:
                ble.gatts_notify(conn, level_h)                                # sends the stored value to each client
      `,
      output: `(nothing on the serial port) nRF Connect shows Battery Service 0x180F with Battery Level 0x2A19: 0x57 (87), then 0x56, 0x55 …`,
      notes: [
        'The service UUID in the advertisement lets a phone find the device by what it offers, without connecting.',
        'The Arduino BLE library on core 3.3 and later uses NimBLE on every chip except the original ESP32. The code is the same; the 0x2902 descriptor is then added automatically and the explicit one is harmless.',
        'A real battery gauge would read the cell ([[measuring-battery-level]]) instead of counting down.'
      ]
    }
  ],
  applications: [
    'Reading a sensor from a phone with a generic app, using Environmental Sensing.',
    'A custom service with a command characteristic and a data characteristic for your own app.',
    'Showing the battery of a keyboard or earbuds in the phone\'s status bar, through the Battery Service.',
    'Exploring an unknown device: a GATT browser lists everything it offers.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 3 Part G, "Generic Attribute Profile (GATT)".',
    'Bluetooth SIG, *Assigned Numbers*: the 16-bit UUIDs of services, characteristics and descriptors.',
    'Bluetooth SIG, specifications of the Battery Service and the Environmental Sensing Service.'
  ],
  sim: 'bt-gatt'
},

/* ================================================================ read, write, notify */
{
  id: 'ble-read-write-notify',
  parent: 'bluetooth-and-ble',
  title: 'Read, write, notify, indicate',
  level: 2,
  short: 'The five things a client can do with a characteristic. Why a notification beats polling for a sensor, when an indication is worth its extra message, and the traps that make a notification silently not arrive.',
  keywords: ['read', 'write', 'write without response', 'notify', 'notification', 'indicate', 'indication', 'polling', 'subscribe', 'CCCD', 'ATT', 'MTU', 'long read', 'callback', 'onWrite', 'gatts_notify', 'advertiseOnDisconnect'],
  prereq: ['gatt'],
  related: ['ble-connection-parameters', 'ble-uart-service', 'ble-roles', 'queues'],
  body: `A client has five tools for a characteristic, and choosing the right one decides how much radio time and battery a project uses.

| Operation | Who starts it | Confirmed? | Use it for |
|---|---|---|---|
| **Read** | the client asks, the server answers | by the answer | a value read now and then: a setting, a name |
| **Write** | the client sends, the server replies "done" | yes | a setting that must be applied |
| **Write without response** | the client sends | no | fast commands and streams: a joystick, a slider |
| **Notify** | the **server** sends when it likes | no | a sensor that changes: the common case |
| **Indicate** | the server sends | yes, the client confirms each | a rare, important event, such as an alarm |

### Why notify beats polling

A phone that **polls** reads the characteristic every second. Each read is a request and an answer: two packets whether or not anything changed, and the value reaches the phone up to a second late; if it changes twice between reads, the first change is never seen. With **notify**, the phone subscribes once, and the sensor sends one packet when its value changes. The simulation below counts the packets and the lost changes, and shows what the connection interval adds. Fewer packets mean less radio time, on both ends.

### Subscribing

A notification can be sent only after a client has switched it on in the CCCD ([[gatt]]); the server keeps one flag per client. Calling "notify" with nobody subscribed sends nothing and gives no error. Indications work the same way but make the server wait for a confirmation before it may send the next.

### Sizes and speeds

A notification carries at most the **MTU minus three** bytes: 20 bytes at the default MTU of 23 ([[ble-connection-parameters]]). Longer values are cut or must be split; a long read or write is split by the protocol into several steps. A notification cannot be sent faster than the connection events allow, and a program that sends faster than the link can carry fills the stack's queue and starts to lose data or fail: pace it, or send "write without response" in chunks as buffers free up.

### The traps

- **Nothing arrives:** nobody subscribed, the notify property or CCCD is missing, or the connection dropped.
- **The phone cannot reconnect after a disconnect:** advertising did not restart. Arduino has \`advertiseOnDisconnect(true)\`; in MicroPython advertise again in the disconnect event.
- **A first read returns nothing:** set a starting value before the first read.
- **Work inside the callback:** write callbacks run in the Bluetooth task. Keep them short and hand the work to the main loop ([[queues]]).

> [!key] Read and write are for the client's initiative; notify lets the sensor speak when something changes, and costs far fewer packets than polling. Indicate adds a confirmation for rare, important events. Nothing is notified until the client subscribes.`,
  ideas: [
    'A client can read, write (with or without a response); the server can notify (no confirmation) or indicate (confirmed by the client).',
    'Notify costs one packet per change; polling costs two packets per poll, adds delay and can miss changes.',
    'Notifications need a subscription through the CCCD, one per client; notifying with no subscriber does nothing.',
    'A notification carries at most the MTU minus 3 bytes, 20 bytes at the default; pace sending to what the link can carry.'
  ],
  pitfalls: [
    'notify() sends the value to everybody — Only to clients that subscribed through the CCCD; nobody else, and no error either.',
    'Faster polling is as good as notifications — It costs more packets, adds half the poll time of delay and still misses changes between polls.',
    'The write callback is the place to do the work — It runs in the Bluetooth task. Set a flag or send to a queue and do the work in loop().'
  ],
  terms: [
    { term: 'Notification', also: ['notify'], def: 'A value pushed by the server to a subscribed client without being asked and without a confirmation from the client.' },
    { term: 'Indication', also: ['indicate'], def: 'Like a notification, but the client must confirm each one, so the server knows it arrived and cannot send the next until it does. Slower, and reliable at the application level.' },
    { term: 'Write without response', also: ['write command', 'WRITE_NR', 'WRITE_NO_RESPONSE'], def: 'A write that the server does not acknowledge. It is the fastest way to send commands or a stream from a client.' },
    { term: 'Polling', also: ['poll', 'repeated read'], def: 'A client asking again and again for a value to see whether it changed. It costs a request and a response each time, whether or not anything changed.' },
    { term: 'ATT', also: ['Attribute Protocol'], def: 'The simple request-and-response protocol under GATT: read, write, notify, indicate and their error replies. The ATT MTU limits the size of one message.' }
  ],
  choose: {
    good: ['Notify for sensors that change; the client subscribes once', 'Write without response for a stream of commands', 'Indicate for an alarm that must be known to have arrived', 'Read for settings and names that are fetched rarely'],
    avoid: ['Polling a sensor every second to see a change', 'Notifying faster than the connection interval allows', 'Long work inside a write callback'],
    check: ['That the client really subscribed before expecting notifications', 'The MTU: a notification longer than MTU minus 3 is cut', 'That advertising restarts after a disconnect']
  },
  quiz: [
    { q: 'A temperature sensor changes about three times a minute and a phone polls it every second. Compared with notifications, how many packets does polling use for the same information?', choices: ['About the same', 'About 40 times as many (120 packets a minute against 3)', 'Fewer, because a read is one packet', 'It cannot be compared'], a: 1, why: 'Polling is a request and a response every second: 120 packets a minute. Notifications are one packet per change: about 3 a minute. The reading also arrives sooner, and no change is overwritten unseen.' },
    { q: 'Which operation makes the client confirm each message?', choices: ['Notify', 'Write without response', 'Indicate', 'Read'], a: 2, why: 'An indication must be confirmed by the client before the server may send another. A notification is not confirmed.' },
    { q: 'The ESP calls notify() but no client has subscribed. What happens?', choices: ['The value goes to all connected clients', 'Nothing is sent and there is no error', 'The ESP restarts', 'The client is asked to subscribe'], a: 1, why: 'Notifications are sent only to clients that wrote 0x0001 to the CCCD. With none subscribed the call does nothing.' },
    { q: 'You want to send joystick positions from a phone to the ESP at the highest possible rate. Which write?', choices: ['Write with response', 'Write without response', 'Indicate', 'Read'], a: 1, why: 'Write without response needs no answer packet and no waiting, so many writes fit into each connection event. The cost is that nothing confirms delivery.' }
  ],
  code: [
    {
      title: 'Switch an LED from a phone and count with notifications',
      about: 'A service with two characteristics: a counter that notifies once a second (and can also be read), and an LED switch that a phone writes (1 on, 0 off).',
      needs: 'Any ESP32-family board with Bluetooth LE, and an LED on GPIO2 (the on-board one on many DevKits). In nRF Connect: subscribe to the first characteristic and write 01 or 00 to the second.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          set [count v] to (0)
          start BLE as [led-counter] :: ble
          add service [12345678-1234-5678-1234-56789abcdef0] :: ble
          add characteristic [12345678-1234-5678-1234-56789abcdef1] [notify v] :: ble
          add characteristic [12345678-1234-5678-1234-56789abcdef2] [write v] :: ble
          start advertising :: ble

        when value written :: ble
          if <(first byte of (written value)) = (1)> then
            set pin (2) to [HIGH v]
          else
            set pin (2) to [LOW v]
          end

        every (1) seconds
          change [count v] by (1)
          notify (count) :: ble
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEServer.h>
        #include <BLE2902.h>

        #define SERVICE_UUID "12345678-1234-5678-1234-56789abcdef0"
        #define COUNT_UUID   "12345678-1234-5678-1234-56789abcdef1"   // read + notify
        #define LED_UUID     "12345678-1234-5678-1234-56789abcdef2"   // write
        const int LED_PIN = 2;

        BLECharacteristic *countChr;
        uint32_t count = 0;

        class LedCallbacks : public BLECharacteristicCallbacks {
          void onWrite(BLECharacteristic *chr) {
            String v = chr->getValue();                              // the bytes the phone wrote
            digitalWrite(LED_PIN, (v.length() > 0 && v[0] != 0) ? HIGH : LOW);
          }
        };

        void setup() {
          pinMode(LED_PIN, OUTPUT);
          BLEDevice::init("led-counter");
          BLEServer *server = BLEDevice::createServer();
          server->advertiseOnDisconnect(true);
          BLEService *svc = server->createService(SERVICE_UUID);
          countChr = svc->createCharacteristic(COUNT_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
          countChr->addDescriptor(new BLE2902());                    // the notification switch (NimBLE adds it itself)
          BLECharacteristic *ledChr = svc->createCharacteristic(LED_UUID, BLECharacteristic::PROPERTY_WRITE);
          ledChr->setCallbacks(new LedCallbacks());
          svc->start();
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(SERVICE_UUID);
          adv->setScanResponse(true);                                // the name goes into the scan response
          BLEDevice::startAdvertising();
        }

        void loop() {
          count++;
          countChr->setValue((uint8_t *)&count, 4);                  // 4 bytes, little-endian
          countChr->notify();                                        // only subscribed clients get it
          delay(1000);
        }
      `,
      py: String.raw`
        import bluetooth, struct, time
        from machine import Pin

        _IRQ_CENTRAL_CONNECT = 1
        _IRQ_CENTRAL_DISCONNECT = 2
        _IRQ_GATTS_WRITE = 3

        led = Pin(2, Pin.OUT)
        ble = bluetooth.BLE()
        ble.active(True)
        SVC = bluetooth.UUID("12345678-1234-5678-1234-56789abcdef0")
        COUNT = (bluetooth.UUID("12345678-1234-5678-1234-56789abcdef1"), bluetooth.FLAG_READ | bluetooth.FLAG_NOTIFY)   # read + notify
        LED = (bluetooth.UUID("12345678-1234-5678-1234-56789abcdef2"), bluetooth.FLAG_WRITE)                            # write
        ((count_h, led_h),) = ble.gatts_register_services(((SVC, (COUNT, LED)),))
        conns = set()
        count = 0

        def ad(kind, payload):
            return bytes((len(payload) + 1, kind)) + payload

        def advertise():                                       # the 128-bit UUID goes into the advertisement, the name into the scan response
            ble.gap_advertise(100_000, adv_data=ad(0x01, b"\x06") + ad(0x07, bytes.fromhex("1234567812345678123456789abcdef0")[::-1]),
                              resp_data=ad(0x09, b"led-counter"))

        def irq(event, data):
            if event == _IRQ_CENTRAL_CONNECT:
                conns.add(data[0])
            elif event == _IRQ_CENTRAL_DISCONNECT:
                conns.discard(data[0])
                advertise()
            elif event == _IRQ_GATTS_WRITE:
                conn, value_handle = data
                if value_handle == led_h:
                    v = ble.gatts_read(led_h)                  # the bytes the phone wrote
                    led.value(1 if v and v[0] else 0)

        ble.irq(irq)
        advertise()
        while True:
            count += 1
            ble.gatts_write(count_h, struct.pack("<I", count))      # 4 bytes, little-endian
            for conn in conns:
                ble.gatts_notify(conn, count_h)                     # sent to each connected client
            time.sleep(1)
      `,
      output: `(nothing on the serial port) nRF Connect: the counter characteristic shows 01 00 00 00, 02 00 00 00, 03 00 00 00 … once subscribed; writing 01 to the other lights the LED.`,
      notes: [
        'The 128-bit service UUID takes 18 of the 31 advertising bytes, so the name moves to the scan response.',
        'In MicroPython a notification goes to each connection handle that is in the set; the CCCD state of each client is kept by the stack.',
        'The write callback only sets a pin. For anything that takes time, set a flag and act in the main loop.'
      ]
    }
  ],
  applications: [
    'A thermometer or heart-rate strap that sends a value when it changes.',
    'A phone remote control that writes without response many times a second.',
    'An alarm sensor that indicates to the phone and waits for the confirmation.',
    'A settings page: the app reads the current values and writes new ones.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 3 Part F, "Attribute Protocol (ATT)" and Part G, "GATT": the read, write, notify and indicate procedures.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy": GATT server and client.',
    'MicroPython documentation, library "bluetooth": gatts_write, gatts_read, gatts_notify and the IRQ events.'
  ],
  sim: 'bt-notify'
},

/* ================================================================ connection parameters */
{
  id: 'ble-connection-parameters',
  parent: 'bluetooth-and-ble',
  title: 'Connection interval, latency, MTU',
  level: 3,
  short: 'Four numbers decide how fast, how responsive and how thirsty a Bluetooth LE connection is: the connection interval, the peripheral latency, the supervision timeout and the MTU. What they mean and how they trade against each other.',
  keywords: ['connection interval', 'slave latency', 'peripheral latency', 'supervision timeout', 'MTU', 'ATT MTU', 'data length extension', 'DLE', 'throughput', 'connection event', 'connection parameter update', '7.5 ms', '2M PHY', 'iOS', 'Android connection priority'],
  prereq: ['ble-read-write-notify', 'bluetooth-classic-and-le'],
  related: ['ble-5-long-range-and-extended-advertising', 'ble-uart-service', 'sleepy-ble-zigbee-thread', 'battery-life-budget'],
  body: `A Bluetooth LE connection is not a wire that stays open: it is a short appointment kept again and again. At every **connection event** the central sends a packet, the peripheral may answer, and both go back to sleep until the next one. The numbers that shape this rhythm are chosen by the central, often after the peripheral asks.

### The four numbers

- **Connection interval:** the time between two events, from **7.5 ms to 4 s** in steps of 1.25 ms. Short means low delay, high throughput and a radio that wakes often.
- **Peripheral latency** (slave latency): how many events the peripheral may skip when it has nothing to say, from 0 up to 499. It saves current, but a message from the central may wait up to **(1 + latency) times the interval** for the sleeping peripheral to listen.
- **Supervision timeout:** how long the link may go silent before both sides declare it lost, from 100 ms to 32 s. It must be longer than **twice (1 + latency) times the interval**, or the link breaks while the peripheral sleeps.
- **MTU:** the largest ATT message, 23 bytes by default (so 20 bytes of notification payload) and up to 517 when both sides agree. Together with the **data length extension** of Bluetooth 4.2 (a link-layer packet of up to 251 bytes instead of 27) it decides how much one event can carry.

### What buys what

| You want | Turn | Cost |
|---|---|---|
| Throughput | shorter interval, larger MTU and data length, 2M PHY ([[ble-5-long-range-and-extended-advertising]]) | more current, more RAM |
| Quick response from the device | short interval | current |
| Quick response to the device | short interval, **latency 0** | current |
| A long battery life | long interval, some latency | slower commands |

The simulation below computes the throughput from the airtime of each packet, the idle current, and checks the timeout rule.

### Who really decides

The central sets the parameters. A peripheral can *request* an update, and the central may accept, adjust or ignore it. Phones apply their own limits (Android's three priority presets lie roughly at 11 to 15 ms, 30 to 50 ms and 100 to 125 ms, and iPhones are known to refuse intervals below about 15 ms): check your target platform. A device must still work when it asks for 7.5 ms and gets 30.

### Reading the throughput

The rate is *bytes per event times events per second*. At the default MTU of 23 and an interval of 30 ms, a controller that fits six packets in each event moves about 32 kbit/s. With an MTU of 247, data length extension and a 15 ms interval, the 1M PHY can pass about 650 kbit/s, and the 2M PHY with 7.5 ms more than a megabit. Most projects need neither: a sensor wants a long interval, a keyboard a short one.

> [!key] The central sets the interval; latency lets the peripheral skip events but delays messages to it, and the supervision timeout must exceed twice (1 + latency) times the interval. Throughput is bytes per event times events per second, so MTU, data length and interval all matter.`,
  ideas: [
    'A connection is a series of short events; the interval (7.5 ms to 4 s) sets the rhythm.',
    'Peripheral latency lets the peripheral skip events to save power, at the cost of messages to it waiting up to (1 + latency) intervals.',
    'The supervision timeout must exceed 2 × (1 + latency) × interval, or the link drops.',
    'Throughput is bytes per event times events per second; MTU, data length, PHY and the number of packets per event all count.'
  ],
  pitfalls: [
    'I asked for a 7.5 ms interval, so I have it — The central decides. Phones round, limit or ignore the request; test on the real phone.',
    'A bigger MTU alone makes it faster — Each event also needs a short interval, enough packets per event and, for long packets, the data length extension.',
    'Latency saves power for free — Messages from the phone to the device wait up to (1 + latency) intervals, and the timeout has to grow with it.'
  ],
  terms: [
    { term: 'Connection interval', also: ['connInterval', 'CI'], def: 'The time between the starts of two connection events. From 7.5 ms to 4 s, in steps of 1.25 ms.' },
    { term: 'Peripheral latency', also: ['slave latency', 'connSlaveLatency'], def: 'The number of connection events the peripheral may skip when it has no data to send. It saves current but lengthens the wait for a message sent to the peripheral.' },
    { term: 'Supervision timeout', also: ['connSupervisionTimeout'], def: 'How long without a valid packet before a device treats the link as lost. From 100 ms to 32 s; it must exceed twice (1 + latency) times the interval.' },
    { term: 'MTU', also: ['ATT MTU', 'maximum transmission unit'], def: 'The largest attribute-protocol message the two ends agree on: 23 bytes by default, up to 517. A notification can carry the MTU minus 3 bytes.' },
    { term: 'Data length extension', also: ['DLE', 'LE Data Packet Length Extension'], def: 'A Bluetooth 4.2 feature that lets one link-layer packet hold up to 251 bytes of payload instead of 27, so a long ATT message does not need to be cut into pieces.' }
  ],
  choose: {
    good: ['A 30 to 50 ms interval with latency 0 for a user interface', 'A 500 ms to 2 s interval with some latency for a slow sensor', 'A short interval and a big MTU for a short time to transfer a file, then back to slow'],
    avoid: ['Leaving a 7.5 ms interval on all day', 'Large latency with a command channel that must feel instant', 'A supervision timeout shorter than the rule allows'],
    check: ['What the real phone grants, with a log of the connection update', 'The current at the interval you chose, measured', 'Both ends: MTU and data length must be negotiated']
  },
  formulas: [
    {
      name: 'Shortest allowed supervision timeout',
      expr: 'Ts = 2*(1 + L)*CI',
      tex: 'T_{s} > 2\\,(1 + L)\\,\\mathrm{CI}',
      vars: {
        Ts: { name: 'supervision timeout (must be greater)', q: 'time', unit: 'ms' },
        L: { name: 'peripheral latency', q: 'count', value: 4, min: 0, max: 499, int: true },
        CI: { name: 'connection interval', q: 'time', unit: 'ms', value: 30, min: 7.5, max: 4000 }
      },
      solveFor: 'Ts',
      note: 'The timeout must be strictly greater than this, and between 100 ms and 32 s. It is also the time after which the link is declared lost when the other side vanishes.'
    },
    {
      name: 'Notification throughput',
      expr: 'R = 8*N*P/CI',
      tex: 'R = \\frac{8\\,N\\,P}{\\mathrm{CI}}',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'kbit/s' },
        N: { name: 'notifications per connection event', q: 'count', value: 3, min: 0.1 },
        P: { name: 'payload of each notification (MTU minus 3)', q: 'count', value: 20, min: 1, max: 514 },
        CI: { name: 'connection interval', q: 'time', unit: 'ms', value: 30, min: 7.5, max: 4000 }
      },
      solveFor: 'R',
      note: 'An upper bound from the numbers you choose. The number of notifications per event is limited by the controller and by the airtime of each packet; the simulation works that out.'
    }
  ],
  examples: [
    {
      title: 'How long can the phone wait?',
      q: 'A peripheral uses a 50 ms interval with latency 4. What is the worst-case delay before the sleeping peripheral hears a command from the phone, and the smallest timeout allowed?',
      steps: ['The peripheral listens at least once every $(1 + 4) \\times 50 = 250$ ms.', 'The timeout must exceed $2 \\times 5 \\times 50 = 500$ ms.'],
      a: 'A command can wait up to 250 ms, and the supervision timeout must be longer than 500 ms: 600 ms or more is a sensible choice.'
    }
  ],
  quiz: [
    { q: 'The interval is 50 ms and the latency 4. What is the longest a command from the phone may wait for the sleeping peripheral?', choices: ['50 ms', '200 ms', '250 ms', '500 ms'], a: 2, why: 'The peripheral may skip four events and listens at the fifth: (1 + 4) × 50 ms = 250 ms.' },
    { q: 'Interval 30 ms, latency 4. What is the smallest supervision timeout the rule allows (it must be longer than this)?', choices: ['150 ms', '300 ms', '30 ms', '600 ms'], a: 1, why: '2 × (1 + 4) × 30 ms = 300 ms, and the timeout must be greater than that.' },
    { q: 'Raising the MTU to 247 always makes the link faster.', a: false, why: 'A bigger MTU helps only with enough packets per event, a short enough interval and the data length extension so long packets are not cut up. It also costs RAM.' },
    { q: 'You raise the connection interval from 30 ms to 500 ms. Which is true?', choices: ['The average current falls, but a notification may wait up to half a second', 'The throughput rises', 'The range doubles', 'The supervision timeout can be shorter'], a: 0, why: 'Fewer events means less wake-up current, and a message waits for the next event: up to the full interval. Throughput falls, and the timeout must stay above twice the interval.' }
  ],
  applications: [
    'A slow sensor on a battery: an interval of a second or more, with latency.',
    'A keyboard or game controller: 10 to 30 ms and no latency.',
    'Transferring a log or a firmware image by BLE: a fast interval and a large MTU for a few minutes.',
    'Debugging a link that drops: the timeout rule and the phone\'s granted parameters.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 6 Part B, "Link Layer": connection events, latency and the supervision timeout.',
    'Bluetooth SIG, *Core Specification*, Vol 3 Part F: the ATT MTU exchange; Vol 6 Part B: the data length update.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy": connection parameters and the MTU.'
  ],
  sim: 'bt-connection'
},

/* ================================================================ pairing and bonding */
{
  id: 'ble-security',
  parent: 'bluetooth-and-ble',
  title: 'Pairing and bonding',
  level: 2,
  short: 'Without pairing, a Bluetooth LE link is open to anyone in range. How two devices agree on keys and encrypt the link, what Just Works, passkey and numeric comparison protect against, and what bonding adds.',
  keywords: ['pairing', 'bonding', 'Just Works', 'passkey', 'numeric comparison', 'LE Secure Connections', 'encryption', 'LTK', 'IRK', 'MITM', 'man in the middle', 'privacy address', 'resolvable private address', 'READ_ENC', 'authenticated', 'bond', 'SMP'],
  prereq: ['gatt', 'ble-roles'],
  related: ['ble-security-practice', 'secure-provisioning', 'ble-hid', 'credentials-handling', 'iot-threat-model'],
  body: `A Bluetooth LE link is open unless it is **paired**: anyone in range can listen to an unencrypted connection and read what the characteristics hold. **Pairing** is the procedure in which two devices agree on keys and switch the link to encryption (AES-CCM, a 128-bit key). **Bonding** means they also *store* those keys, so that the next connection can be encrypted at once, with no new pairing.

### How pairing goes

The two devices first **exchange their abilities**: can I show a number, can I type one, do I want to bond, do I want protection against a man in the middle. From these a **method** is chosen, the devices run it, derive a long-term key, encrypt the link and, if bonding, store the keys. The simulation steps through each method.

### Three methods

| Method | What the user does | Protects against a man in the middle? |
|---|---|---|
| **Just Works** | nothing | no: the link is encrypted but the other end is not verified |
| **Passkey entry** | types a 6-digit number shown on the other device | yes |
| **Numeric comparison** | confirms that both screens show the same 6 digits (needs LE Secure Connections) | yes |

A device with no screen and no keys can only do Just Works. Out-of-band methods (a key exchanged by NFC, say) exist too.

### Legacy and Secure Connections

Pairing in Bluetooth 4.0 and 4.1 (**legacy**) can be broken from a recording of the pairing, because a short passkey has only a million possible values. **LE Secure Connections**, from Bluetooth 4.2, uses a public-key exchange (elliptic curve P-256), so a passive listener learns nothing, whichever method is used. Choose Secure Connections whenever both ends support it.

### What to protect, and how

Mark sensitive characteristics so that the stack refuses to serve them on an unencrypted (or unauthenticated) link: *read encrypted*, *write authenticated*. Do not put security only in pairing: for a lock or an actuator also check a counter or a challenge in your own protocol, so a recorded message cannot be replayed ([[ble-security-practice]]). Phones and ESPs also use **private addresses** that change every few minutes and that only a bonded peer can resolve, so a stranger cannot track the device by its address.

### Traps

- **Pairing fails after you erased the ESP:** the phone still holds the old bond. Remove the device from the phone's Bluetooth settings.
- **A fixed passkey on a device without a screen** is known to every owner of the product: a label with a random passkey per device is better than one number for the whole line.
- **MicroPython** keeps bonding keys only if the program stores them (the secret events); otherwise the phone pairs again after a restart.

> [!key] Pairing creates keys and encrypts the link; bonding stores them. Just Works encrypts but does not verify the other end; passkey and numeric comparison also stop a man in the middle; LE Secure Connections stops a passive listener. Protect sensitive characteristics and never rely on pairing alone.`,
  ideas: [
    'Without pairing a BLE link is unencrypted; pairing agrees on keys and encrypts it, and bonding stores the keys for next time.',
    'Just Works encrypts without verifying the other end; passkey entry and numeric comparison verify it and stop a man in the middle.',
    'LE Secure Connections (Bluetooth 4.2) stops a passive eavesdropper; legacy pairing can be cracked from a recording.',
    'Protect sensitive characteristics with encryption or authentication flags, and add replay protection in your own protocol for anything that acts.'
  ],
  pitfalls: [
    'Paired means secure — Just Works pairs with whoever answers first and does not stop a man in the middle. Legacy pairing can also be cracked offline.',
    'Pairing and bonding are the same thing — Pairing makes the keys; bonding stores them so the link can be encrypted later without pairing again.',
    'I can reflash the ESP and keep the phone\'s bond — The ESP\'s keys are gone with its flash. Remove the old bond in the phone.'
  ],
  terms: [
    { term: 'Pairing', also: ['SMP', 'Security Manager Protocol'], def: 'The procedure in which two devices exchange abilities, authenticate each other by a chosen method, and agree on keys to encrypt the link.' },
    { term: 'Bonding', also: ['bond'], def: 'Storing the keys from pairing in both devices so that a later connection can be encrypted straight away.' },
    { term: 'Just Works', also: ['no input no output'], def: 'A pairing method with no user step. It encrypts the link but cannot tell whether the other end is the right device, so it does not stop a man in the middle.' },
    { term: 'LE Secure Connections', also: ['LESC', 'Secure Connections'], def: 'The pairing of Bluetooth 4.2 and later, based on an elliptic-curve key exchange. A passive eavesdropper cannot recover the key.' },
    { term: 'Man in the middle', also: ['MITM'], def: 'An attacker who sits between two devices, pretending to each to be the other. Passkey entry, numeric comparison and out-of-band pairing detect it; Just Works does not.' },
    { term: 'Long-term key', also: ['LTK', 'IRK', 'identity resolving key'], def: 'The key stored in a bond to encrypt later connections. The IRK is a companion key that lets a bonded peer recognise a device whose address changes.' }
  ],
  choose: {
    good: ['LE Secure Connections with passkey or numeric comparison when the device has a screen or keys', 'Just Works for low-value data, with the sensitive part protected in the application', 'Encrypted-read and authenticated-write flags on private characteristics'],
    avoid: ['One fixed passkey for a whole product line', 'Treating a beacon or an unpaired link as a secret', 'Legacy pairing on new designs'],
    check: ['That both ends support Secure Connections', 'Whether bonds survive a restart on your stack', 'How a user removes a lost phone or resets a device']
  },
  quiz: [
    { q: 'A device has no screen and no buttons. Which pairing method can it use?', choices: ['Passkey entry', 'Numeric comparison', 'Just Works', 'None: it cannot pair'], a: 2, why: 'The other methods need a number shown or typed. A device with no input and no output can only do Just Works (or out-of-band, if it has NFC).' },
    { q: 'Which methods protect against a man in the middle?', choices: ['Just Works', 'Passkey entry and numeric comparison', 'All three', 'None: only a VPN helps'], a: 1, why: 'Only methods that involve the user (a number compared or typed) or an out-of-band channel verify the other end. Just Works does not.' },
    { q: 'Pairing and bonding mean the same.', a: false, why: 'Pairing is the procedure that makes the keys and encrypts the link. Bonding means the keys are also stored, so the next connection is encrypted without pairing again.' },
    { q: 'You erased the ESP\'s flash. Now the phone reports a pairing failure although the code is unchanged. What do you do?', choices: ['Move closer', 'Remove the old bond for the ESP in the phone\'s Bluetooth settings', 'Lower the connection interval', 'Change the UUID'], a: 1, why: 'The phone still holds keys for a device that no longer remembers them. It tries to encrypt with the old key and fails; forgetting the device lets it pair afresh.' }
  ],
  code: [
    {
      title: 'A characteristic that needs an encrypted link',
      about: 'Offers one value that a phone can read only after pairing (Just Works with bonding and LE Secure Connections). An unpaired phone gets an "insufficient encryption" error, and pairing starts.',
      needs: 'An ESP32-family board with Bluetooth LE. The Arduino version uses the NimBLE-Arduino library (it replaces the core BLE library: use one or the other). Just Works does not stop a man in the middle: for real secrets add a passkey ([[ble-security-practice]]).',
      libs: ['NimBLE-Arduino'],
      blocks: `
        when started
          start BLE as [secure] :: ble
          set security [bonding v] [Secure Connections v] [no input no output v] :: ble
          add service [5b7c9a10-2d3e-4a6f-8b1c-0e9d7f6a5b43] :: ble
          add characteristic [5b7c9a11-2d3e-4a6f-8b1c-0e9d7f6a5b43] [read, encrypted v] :: ble
          start advertising :: ble
      `,
      cpp: String.raw`
        #include <NimBLEDevice.h>

        #define SERVICE_UUID "5b7c9a10-2d3e-4a6f-8b1c-0e9d7f6a5b43"
        #define SECRET_UUID  "5b7c9a11-2d3e-4a6f-8b1c-0e9d7f6a5b43"

        void setup() {
          NimBLEDevice::init("secure");                             // a short name: the 128-bit UUID already takes 18 bytes
          NimBLEDevice::setSecurityAuth(true, false, true);         // bonding, no MITM protection, LE Secure Connections
          NimBLEDevice::setSecurityIOCap(BLE_HS_IO_NO_INPUT_OUTPUT);   // no screen, no keys: Just Works
          NimBLEServer *server = NimBLEDevice::createServer();
          server->advertiseOnDisconnect(true);
          NimBLEService *svc = server->createService(SERVICE_UUID);
          NimBLECharacteristic *chr = svc->createCharacteristic(
            SECRET_UUID, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::READ_ENC);   // reading needs an encrypted link
          chr->setValue("only over an encrypted link");
          svc->start();
          NimBLEAdvertising *adv = NimBLEDevice::getAdvertising();
          adv->addServiceUUID(SERVICE_UUID);
          adv->start();
        }

        void loop() {}
      `,
      py: String.raw`
        import bluetooth

        ble = bluetooth.BLE()
        ble.active(True)
        ble.config(bond=True, mitm=False, io=3, le_secure=True)     # io 3: no input, no output = Just Works

        SVC = bluetooth.UUID("5b7c9a10-2d3e-4a6f-8b1c-0e9d7f6a5b43")
        FLAG_READ_ENCRYPTED = 0x0200       # the module names only FLAG_READ, FLAG_WRITE, FLAG_NOTIFY …: this value is from its documentation
        SECRET = (bluetooth.UUID("5b7c9a11-2d3e-4a6f-8b1c-0e9d7f6a5b43"), bluetooth.FLAG_READ | FLAG_READ_ENCRYPTED)   # reading needs an encrypted link
        ((secret_h,),) = ble.gatts_register_services(((SVC, (SECRET,)),))
        ble.gatts_write(secret_h, b"only over an encrypted link")

        def ad(kind, payload):
            return bytes((len(payload) + 1, kind)) + payload

        name = b"secure"                                            # short: the 128-bit UUID takes 18 bytes
        uuid = bytes.fromhex("5b7c9a102d3e4a6f8b1c0e9d7f6a5b43")[::-1]
        ble.gap_advertise(100_000, adv_data=ad(0x01, b"\x06") + ad(0x07, uuid) + ad(0x09, name))
      `,
      output: `(nothing on the serial port) On the phone: reading the characteristic first triggers the pairing prompt, then returns "only over an encrypted link".`,
      notes: [
        'For a passkey instead of Just Works, give the device a display or keys, set MITM protection and choose a matching I/O capability, in that library\'s own terms.',
        'In NimBLE-Arduino 2.x the call to remove all stored bonds is NimBLEDevice::deleteAllBonds(); use it for a "forget phones" button.',
        'MicroPython only keeps the bonding keys if the program stores them through the secret events; this short program pairs but may need to pair again after a restart.'
      ]
    }
  ],
  applications: [
    'Keeping a device\'s settings private to the phone that owns it.',
    'A keyboard or mouse that bonds once and reconnects at once ([[ble-hid]]).',
    'A medical or fitness sensor that sends data over an encrypted link.',
    'Provisioning Wi-Fi details over BLE without sending them in the clear ([[secure-provisioning]]).'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 3 Part H, "Security Manager Specification": pairing methods, keys, LE Secure Connections.',
    'NimBLE-Arduino documentation and MicroPython documentation, library "bluetooth": security configuration.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy": security.'
  ],
  sim: 'bt-pairing'
},

/* ================================================================ a serial port over BLE */
{
  id: 'ble-uart-service',
  parent: 'bluetooth-and-ble',
  title: 'A serial port over BLE',
  level: 2,
  short: 'Bluetooth LE has no serial profile, but the Nordic UART Service has become the standard stand-in: one characteristic to write to, one to be notified from. Its three UUIDs, the 20-byte limit and how to send longer lines.',
  keywords: ['Nordic UART Service', 'NUS', 'BLE UART', 'serial over BLE', '6E400001', 'RX', 'TX', 'terminal', 'nRF Toolbox', 'Bluefruit Connect', 'Web Bluetooth', 'chunking', 'MTU 23', '20 bytes', 'line protocol'],
  prereq: ['ble-read-write-notify', 'gatt'],
  related: ['bluetooth-classic-spp-and-a2dp', 'ble-connection-parameters', 'ble-security', 'ble-between-boards'],
  body: `Many projects want nothing more than a serial port through the air: type on the phone, see it on the ESP; print on the ESP, read it on the phone. Classic Bluetooth has a serial profile for that ([[bluetooth-classic-spp-and-a2dp]]), but most chips of the family have no Classic and iPhones cannot use it. Bluetooth LE has no standard serial profile, so the world settled on one that Nordic Semiconductor published: the **Nordic UART Service**, NUS. Phone apps (nRF Toolbox and Adafruit's Bluefruit Connect have a UART screen), web pages through Web Bluetooth, and many libraries speak it.

### The three UUIDs

| What | UUID | Properties | Direction |
|---|---|---|---|
| Service | 6E400001-B5A3-F393-E0A9-E50E24DCCA9E | | |
| RX | 6E400002-B5A3-F393-E0A9-E50E24DCCA9E | write, write without response | phone to ESP |
| TX | 6E400003-B5A3-F393-E0A9-E50E24DCCA9E | notify | ESP to phone |

The names are from the **device's** point of view: the phone *writes* to RX and is *notified* from TX. Mixing them up is the classic first mistake.

### It is a pipe, not a protocol

NUS gives you a stream of bytes with no framing and no flow control. Each notification holds at most the **MTU minus 3** bytes, which is **20 bytes** until the phone asks for a bigger MTU ([[ble-connection-parameters]]), so a line of 100 characters arrives as five pieces that the receiver must join. The usual habit is a **line-based text protocol**: commands such as \`LED ON\` ending in a newline, the receiver collecting bytes until the newline. Send long replies in chunks of MTU minus 3, with a short pause between them or only when the stack says it is ready, so the queue does not overflow.

### How fast

The speed is set by the connection, not by the service: bytes per connection event times events per second. At the default MTU and a 30 ms interval, expect a few kilobytes a second; with a negotiated MTU, a short interval and the 2M PHY, many times that. The simulation of connection parameters, set to a small MTU, shows why a 20-byte limit is slow.

### Security and alternatives

An unpaired UART service is a command line that anyone in range can type into. If it can switch anything, require pairing and an encrypted link ([[ble-security]]), and design the commands so a stray one does no harm. If you only need the two ESPs to talk, ESP-NOW or a direct Wi-Fi link is simpler ([[ble-between-boards]]).

> [!key] The Nordic UART Service is the de-facto serial port of Bluetooth LE: write to RX (6E400002), get notified from TX (6E400003), 20 bytes at a time until the MTU grows. Frame your lines with a newline, chunk long replies, and require pairing if it can do anything.`,
  ideas: [
    'The Nordic UART Service is not a Bluetooth standard but is understood by most phone terminal apps and by Web Bluetooth.',
    'RX (write) and TX (notify) are named from the device\'s side: the phone writes RX and is notified from TX.',
    'Each notification carries MTU minus 3 bytes, 20 at the default, so longer lines are sent in chunks and joined by the receiver.',
    'Frame the stream with a newline, and protect it with pairing if commands can act on the world.'
  ],
  pitfalls: [
    'TX means the phone transmits — On the device, TX is what the device transmits: the phone is notified from it and writes to RX.',
    'A long message arrives in one piece — A notification carries at most MTU minus 3 bytes. A long message arrives in chunks that your code must reassemble.',
    'Faster sending just works — Sending faster than the link carries fills the stack\'s queue and loses data. Pace the chunks.'
  ],
  terms: [
    { term: 'Nordic UART Service', also: ['NUS', 'BLE UART', 'UART service'], def: 'A GATT service published by Nordic Semiconductor that carries a serial stream: one characteristic to write to and one to be notified from. It is the de-facto serial port over Bluetooth LE.' },
    { term: 'Chunking', also: ['fragmentation', 'segmentation'], def: 'Cutting a long message into pieces that each fit in one notification (the MTU minus 3 bytes), sent in order and rejoined by the receiver.' },
    { term: 'Web Bluetooth', also: ['navigator.bluetooth'], def: 'A browser interface, in Chrome and Edge, that lets a web page connect to Bluetooth LE devices through GATT. There is no Classic and no support in Safari.' },
    { term: 'Line protocol', also: ['text protocol', 'AT-style commands'], def: 'A convention in which each command or reply is one line of text ending in a newline, so the receiver knows where a message ends.' }
  ],
  choose: {
    good: ['NUS for a terminal, a console or a few text commands from a phone or a web page', 'A negotiated large MTU and a short interval when a lot of data must move', 'Paired, encrypted links for anything that controls hardware'],
    avoid: ['Streaming audio or large files over the default MTU', 'Binary data without framing', 'An open UART service on a device that opens a door'],
    check: ['Which end is RX and which is TX', 'The MTU that the phone actually negotiated', 'Whether the app expects the exact NUS UUIDs']
  },
  quiz: [
    { q: 'In the Nordic UART Service, how does the ESP send text to the phone?', choices: ['A write to RX (6E400002)', 'A notification from TX (6E400003)', 'A notification from RX', 'A read of TX'], a: 1, why: 'TX is the characteristic the device transmits on: it carries the notify property, and the phone subscribes to it. The phone writes to RX.' },
    { q: 'At the default MTU of 23, how many bytes can one notification carry?', choices: ['23', '20', '31', '512'], a: 1, why: 'The ATT header takes 3 bytes of the MTU, leaving 20 bytes of value.' },
    { q: 'The UART service guarantees that a 100-byte line arrives in one notification.', a: false, why: 'A notification is limited to the MTU minus 3 bytes. A long line is cut into chunks, and the receiver must put them together, usually by waiting for the newline.' },
    { q: 'What is the best way to send a 100-byte reply at the default MTU?', choices: ['One notification, and hope', 'Five notifications of up to 20 bytes, in order, with the receiver joining them at the newline', 'A write to RX', 'Increase the baud rate'], a: 1, why: 'Chunks of MTU minus 3 bytes, in order, paced to what the link carries, and a framing rule (a newline) so the receiver knows the end.' }
  ],
  code: [
    {
      title: 'An echo over the Nordic UART Service',
      about: 'Everything the phone writes to RX is echoed back in capital letters through TX notifications, cut to 20 bytes. Try it from a UART screen in nRF Toolbox or Bluefruit Connect.',
      needs: 'Any ESP32-family board with Bluetooth LE. In the phone app connect to "uart-demo", open the UART screen, and send a line.',
      blocks: `
        when started
          start BLE as [uart-demo] :: ble
          add service [6E400001-B5A3-F393-E0A9-E50E24DCCA9E] :: ble
          add characteristic [6E400002-B5A3-F393-E0A9-E50E24DCCA9E] [write v] :: ble
          add characteristic [6E400003-B5A3-F393-E0A9-E50E24DCCA9E] [notify v] :: ble
          start advertising :: ble

        when value written :: ble
          notify (upper case of (first 20 characters of (written value))) :: ble
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEServer.h>
        #include <BLE2902.h>

        #define NUS_SERVICE "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
        #define NUS_RX      "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"   // the phone writes here
        #define NUS_TX      "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"   // we notify here

        BLECharacteristic *txChr;

        class RxCallbacks : public BLECharacteristicCallbacks {
          void onWrite(BLECharacteristic *chr) {
            String s = chr->getValue();                              // what the phone sent
            s.toUpperCase();
            if (s.length() > 20) s = s.substring(0, 20);             // one notification at the default MTU
            txChr->setValue(s);
            txChr->notify();
          }
        };

        void setup() {
          BLEDevice::init("uart-demo");
          BLEServer *server = BLEDevice::createServer();
          server->advertiseOnDisconnect(true);
          BLEService *svc = server->createService(NUS_SERVICE);
          txChr = svc->createCharacteristic(NUS_TX, BLECharacteristic::PROPERTY_NOTIFY);
          txChr->addDescriptor(new BLE2902());                       // the notification switch (NimBLE adds it itself)
          BLECharacteristic *rxChr = svc->createCharacteristic(
            NUS_RX, BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);
          rxChr->setCallbacks(new RxCallbacks());
          svc->start();
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(NUS_SERVICE);
          adv->setScanResponse(true);                                // the name goes into the scan response
          BLEDevice::startAdvertising();
        }

        void loop() {}
      `,
      py: String.raw`
        import bluetooth

        _IRQ_CENTRAL_CONNECT = 1
        _IRQ_CENTRAL_DISCONNECT = 2
        _IRQ_GATTS_WRITE = 3

        ble = bluetooth.BLE()
        ble.active(True)
        NUS = bluetooth.UUID("6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
        RX = (bluetooth.UUID("6E400002-B5A3-F393-E0A9-E50E24DCCA9E"), bluetooth.FLAG_WRITE | bluetooth.FLAG_WRITE_NO_RESPONSE)   # the phone writes here
        TX = (bluetooth.UUID("6E400003-B5A3-F393-E0A9-E50E24DCCA9E"), bluetooth.FLAG_NOTIFY)                                    # we notify here
        ((rx_h, tx_h),) = ble.gatts_register_services(((NUS, (RX, TX)),))
        conns = set()

        def ad(kind, payload):
            return bytes((len(payload) + 1, kind)) + payload

        def advertise():                                       # the 128-bit UUID in the advertisement, the name in the scan response
            ble.gap_advertise(100_000, adv_data=ad(0x01, b"\x06") + ad(0x07, bytes.fromhex("6e400001b5a3f393e0a9e50e24dcca9e")[::-1]),
                              resp_data=ad(0x09, b"uart-demo"))

        def irq(event, data):
            if event == _IRQ_CENTRAL_CONNECT:
                conns.add(data[0])
            elif event == _IRQ_CENTRAL_DISCONNECT:
                conns.discard(data[0])
                advertise()
            elif event == _IRQ_GATTS_WRITE:
                conn, value_handle = data
                if value_handle == rx_h:
                    msg = ble.gatts_read(rx_h).upper()[:20]    # what the phone sent, in capitals, one notification long
                    for c in conns:
                        ble.gatts_notify(c, tx_h, msg)

        ble.irq(irq)
        advertise()
      `,
      output: `(nothing on the serial port) The phone sends "hello esp" and receives "HELLO ESP".`,
      notes: [
        'A real program would split a longer reply into chunks of the negotiated MTU minus 3, in a loop, instead of cutting at 20.',
        'The UUIDs are the ones the phone apps look for. A UART screen that finds no service usually found different UUIDs.',
        'In MicroPython the program ends after advertise(): the events are handled by the Bluetooth stack in the background.'
      ]
    }
  ],
  applications: [
    'A phone console for a robot, a plant controller or a 3D-printer enclosure.',
    'Sending Wi-Fi credentials from a phone to a new device (with pairing and encryption, [[secure-provisioning]]).',
    'A web page that talks to an ESP with Web Bluetooth, with no app to install.',
    'A debug log that can be read from a phone while the device is in the field.'
  ],
  sources: [
    'Nordic Semiconductor, documentation of the Nordic UART Service (the service and characteristic UUIDs).',
    'Bluetooth SIG, *Bluetooth Core Specification*, Vol 3 Part F: the ATT MTU and the size of a notification.',
    'MicroPython documentation, library "bluetooth": FLAG_WRITE_NO_RESPONSE, gatts_notify and the events.'
  ],
  sim: { id: 'bt-connection', params: { mtu: 23 } }
},

/* ================================================================ HID over BLE */
{
  id: 'ble-hid',
  parent: 'bluetooth-and-ble',
  title: 'BLE keyboards and other HID devices',
  level: 3,
  short: 'A Bluetooth keyboard, mouse or game controller is a BLE peripheral that speaks HID over GATT, so the phone or computer needs no driver. The report map, the 8-byte keyboard report, why a bond is required, and how to build a macro pad.',
  keywords: ['HID', 'HID over GATT', 'HOGP', 'keyboard', 'mouse', 'game controller', 'report map', 'report descriptor', 'usage ID', 'macro pad', 'page turner', 'appearance', 'BleKeyboard', 'BLE mouse', 'bonding'],
  prereq: ['gatt', 'ble-security'],
  related: ['ble-read-write-notify', 'buttons-and-switches', 'ble-stacks-nimble-bluedroid', 'rotary-encoders'],
  body: `A Bluetooth keyboard, mouse or game controller is a BLE peripheral that speaks **HID over GATT**, the Human Interface Device idea of USB carried by GATT. The computer or phone treats it as a standard device and needs no driver and no app: it just types.

### How it works

The device offers the **HID service** (0x1812). Its main parts are the **Report Map**, which describes in the USB HID language what the reports contain ("eight bits of modifier keys, one reserved byte, six key codes"), and one or more **Report** characteristics that notify the host whenever something changes ([[gatt]], [[ble-read-write-notify]]). The device also announces an *appearance* in its advertisement (0x03C1 for a keyboard, 0x03C2 for a mouse, 0x03C0 for a generic HID) so that the host lists it correctly.

### The keyboard report

A keyboard sends a report of **8 bytes** whenever the set of pressed keys changes:

| Byte | Content |
|---|---|
| 0 | modifier keys, one bit each: bit 0 left Ctrl, 1 left Shift, 2 left Alt, 3 left GUI, 4 to 7 the right-hand ones |
| 1 | reserved, 0 |
| 2 to 7 | up to six key codes of the keys held down, 0 for none |

Key codes are *usage IDs*, not letters: a to z are 0x04 to 0x1D, 1 to 9 are 0x1E to 0x26, 0 is 0x27, Enter 0x28, Escape 0x29, Backspace 0x2A, Tab 0x2B and Space 0x2C. To type a capital H the device sends a report with the Shift bit and key code 0x0B, then a report of all zeros to release. **Every character is two reports**, a press and a release. The layout (QWERTY or AZERTY) is the host's business: the device sends positions.

### The bond is not optional

Windows, Android, iOS and macOS generally accept a HID device only over an **encrypted, bonded link** ([[ble-security]]), so the report characteristics are marked "read encrypted". The first connection pairs; afterwards the host reconnects by itself whenever the device advertises, which is why a bonded keyboard comes back in a second.

### Building one

In Arduino a library hides the report map and the services: a small "BLE keyboard" library offers \`print()\`, \`write()\` and \`press()\`, and the ones in circulation differ in which core and which Bluetooth stack they support, so pick one that states your core version ([[ble-stacks-nimble-bluedroid]]). The program below uses none of them: the BLE library of the core has a BLEHIDDevice class that builds the HID, device-information and battery services, and the report map itself is 45 bytes. MicroPython has no ready HID library in its standard set. Typical products: a macro pad, a presenter's page turner, a foot switch, or a one-button switch for someone who cannot use a keyboard.

> [!warn] A device that types by itself into a computer is also an attack tool. Build it for machines that are yours or whose owner agreed, and do not use it to inject keystrokes into anyone else's.

> [!key] HID over GATT lets a BLE peripheral be a keyboard or mouse with no driver: a report map describes the reports, and an 8-byte report (modifiers, reserved, six key codes) carries the keys, two reports per character. Hosts require a bonded, encrypted link.`,
  ideas: [
    'A BLE keyboard offers the HID service (0x1812) with a Report Map and notifying Report characteristics; the host needs no driver.',
    'The keyboard report is 8 bytes: modifiers, a reserved byte, and up to six key codes held down.',
    'Key codes are positions (usage IDs), not letters; a character is a press report and a release report.',
    'Hosts generally require pairing and bonding for HID; after that they reconnect by themselves.'
  ],
  pitfalls: [
    'The ESP sends the letter A to the PC — It sends the usage ID 0x04, a key position. The host\'s layout turns it into a letter.',
    'A BLE keyboard library from 2020 will work on any core — Libraries track the core and the stack. Check which versions a library supports before blaming your code.',
    'It pairs but then types nothing, so the code is wrong — Hosts often keep an old bond; remove the device from the host\'s list and pair again.'
  ],
  terms: [
    { term: 'HID', also: ['Human Interface Device'], def: 'The standard way for keyboards, mice and game controllers to describe their data to a computer, so that one driver serves every maker. It exists over USB and over Bluetooth.' },
    { term: 'HID over GATT', also: ['HOGP'], def: 'The Bluetooth LE form of HID: the HID service (0x1812) with its report map and report characteristics.' },
    { term: 'Report map', also: ['report descriptor', 'HID descriptor'], def: 'A compact description, in the USB HID language, of the fields in each report: which bits are keys, which bytes are positions. The host reads it once and then understands every report.' },
    { term: 'Usage ID', also: ['key code', 'scan code'], def: 'The number that identifies a key position in a HID report, for instance 0x04 for the key that types "a" on a QWERTY layout.' }
  ],
  choose: {
    good: ['A BLE keyboard for a macro pad, page turner or accessibility switch', 'A BLE mouse or gamepad for a custom controller', 'A library that names your core and stack in its notes'],
    avoid: ['Rolling your own report map unless you need an unusual device', 'Injecting keystrokes into machines that are not yours', 'Skipping pairing: most hosts will not accept an unbonded HID device'],
    check: ['That the host (Windows, Android, iOS, macOS) accepts a device with your report map', 'How a user removes the bond from both sides', 'The battery level service, which many hosts show']
  },
  quiz: [
    { q: 'How many bytes is the standard keyboard input report?', choices: ['2', '4', '8', '31'], a: 2, why: 'One byte of modifiers, one reserved byte and six key codes: 8 bytes.' },
    { q: 'Why does typing one character send two reports?', choices: ['One for the letter and one for its case', 'One when the key goes down and an all-zero one when it is released', 'Bluetooth sends everything twice', 'One is for the host and one for the phone'], a: 1, why: 'A report lists the keys currently held down. A key press is a report with the key; releasing it is a report without it.' },
    { q: 'A BLE keyboard needs a driver installed on the computer.', a: false, why: 'HID is standard: the host reads the report map and understands the device, with no driver and no app.' },
    { q: 'Windows pairs with the ESP, but a minute later the keyboard is gone and will not reconnect. What is the most likely cause?', choices: ['The ESP lost its bond keys, for instance after a reflash, while Windows kept the old bond', 'The key codes are wrong', 'The MTU is too small', 'The advertising interval is too short'], a: 0, why: 'A bond has two halves. If one side forgets, the other keeps trying with an old key. Remove the device in the host and pair again.' }
  ],
  code: [
    {
      title: 'A one-button macro pad',
      about: 'A button on GPIO4 types a line of text into whatever computer or phone the ESP is paired with, then waits half a second. The HID service, the report map and the 8-byte reports described on the page are written out with the BLE library of the core: no other library is needed.',
      needs: 'An ESP32-family board with Bluetooth LE and a push button from GPIO4 to GND (the internal pull-up is used). Pair the "macro-pad" device in the computer first. Use it only on machines that are yours.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      libs: ['None: the BLE library of the core has the BLEHIDDevice class used here. (The ESP32-BLE-Keyboard library of most tutorials, version 0.3.2, is written for core 2.x and does not build with core 3.x as published.)'],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          start BLE keyboard [macro-pad] :: ble

        forever
          if <<BLE keyboard connected?> and <(read pin (4)) = [LOW v]>> then
            type [Hello from the ESP32] :: ble
            wait (0.5) seconds
          end
        end
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEServer.h>
        #include <BLEHIDDevice.h>
        #include <BLESecurity.h>

        const int BUTTON_PIN = 4;                        // button to GND, internal pull-up

        // The report map, in the USB HID language: one keyboard report of 8 bytes, report id 1.
        const uint8_t REPORT_MAP[] = {
          0x05, 0x01,        // Usage Page: Generic Desktop
          0x09, 0x06,        // Usage: Keyboard
          0xA1, 0x01,        // Collection: Application
          0x85, 0x01,        //   Report ID 1
          0x05, 0x07,        //   Usage Page: Keyboard (key codes)
          0x19, 0xE0,        //   Usage Minimum: left Ctrl
          0x29, 0xE7,        //   Usage Maximum: right GUI
          0x15, 0x00,        //   Logical Minimum 0
          0x25, 0x01,        //   Logical Maximum 1
          0x75, 0x01,        //   Report Size: 1 bit
          0x95, 0x08,        //   Report Count: 8          -> byte 0: the eight modifier bits
          0x81, 0x02,        //   Input (data, variable)
          0x75, 0x08,        //   Report Size: 8 bits
          0x95, 0x01,        //   Report Count: 1          -> byte 1: reserved
          0x81, 0x01,        //   Input (constant)
          0x95, 0x06,        //   Report Count: 6          -> bytes 2 to 7: six key codes
          0x75, 0x08,        //   Report Size: 8 bits
          0x15, 0x00,        //   Logical Minimum 0
          0x25, 0x65,        //   Logical Maximum 101
          0x19, 0x00,        //   Usage Minimum 0
          0x29, 0x65,        //   Usage Maximum 101
          0x81, 0x00,        //   Input (data, array)
          0xC0               // End Collection
        };

        BLEHIDDevice *hid;
        BLECharacteristic *input;                        // the Report characteristic that notifies the host
        bool connected = false;

        class ServerCallbacks : public BLEServerCallbacks {
          void onConnect(BLEServer *server) override { connected = true; }
          void onDisconnect(BLEServer *server) override { connected = false; server->startAdvertising(); }
        };

        void sendKey(uint8_t modifiers, uint8_t keycode) {   // a press report, then the all-zero release report
          uint8_t report[8] = { modifiers, 0, keycode, 0, 0, 0, 0, 0 };
          input->setValue(report, sizeof(report));
          input->notify();
          delay(8);
          memset(report, 0, sizeof(report));
          input->setValue(report, sizeof(report));
          input->notify();
          delay(8);
        }

        void typeText(const char *text) {                // letters, digits and spaces: enough for a macro pad
          for (; *text; text++) {
            char c = *text;
            if (c >= 'a' && c <= 'z') sendKey(0x00, 0x04 + (c - 'a'));
            else if (c >= 'A' && c <= 'Z') sendKey(0x02, 0x04 + (c - 'A'));   // 0x02 = left Shift held
            else if (c >= '1' && c <= '9') sendKey(0x00, 0x1E + (c - '1'));
            else if (c == '0') sendKey(0x00, 0x27);
            else if (c == ' ') sendKey(0x00, 0x2C);
          }
        }

        void setup() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          BLEDevice::init("macro-pad");
          BLEServer *server = BLEDevice::createServer();
          server->setCallbacks(new ServerCallbacks());

          hid = new BLEHIDDevice(server);                // creates the HID, device information and battery services
          input = hid->inputReport(1);                   // report id 1, as in the map; read and notify, encrypted
          hid->manufacturer("Hobby");
          hid->pnp(0x02, 0xE502, 0xA111, 0x0210);        // vendor id source (USB), vendor, product, version
          hid->hidInfo(0x00, 0x01);                      // no country code; normally connectable
          hid->reportMap((uint8_t *)REPORT_MAP, sizeof(REPORT_MAP));
          hid->startServices();
          hid->setBatteryLevel(100);

          BLESecurity::setAuthenticationMode(true, false, true);   // bonding, no passkey, LE Secure Connections

          BLEAdvertising *adv = server->getAdvertising();
          adv->setAppearance(0x03C1);                    // "keyboard", so the host shows the right icon
          adv->addServiceUUID(hid->hidService()->getUUID());
          adv->start();
        }

        void loop() {
          if (connected && digitalRead(BUTTON_PIN) == LOW) {
            typeText("Hello from the ESP32");            // each character is a press report and a release report
            delay(500);                                  // a crude debounce and a pause
          }
          delay(10);
        }
      `,
      na: { py: 'MicroPython has no ready-made HID keyboard library. A raw HID service needs the report map above, a Report characteristic with its Report Reference descriptor and the device information and battery services that hosts expect; use the C++ program here, or the ESP-IDF HID device example.' },
      output: `(nothing on the serial port) Pressing the button types "Hello from the ESP32" into the focused window of the paired computer.`,
      notes: [
        'Keyboard libraries from GitHub hide all of this behind print() and press(). Most use the NimBLE stack and take over the Bluetooth host, so do not combine one with the core BLE library in a sketch; and check that it names your core version, because the best-known one was written for core 2.x.',
        'The key codes typed here cover letters, digits and the space; add the rest of the table (0x28 Enter, 0x2B Tab …) for a full keyboard, and remember that the host\'s layout decides which letter a code becomes.',
        'Pins: GPIO4 is a safe general-purpose pin on the original ESP32 and on the S3; check your board for the C3 and C6 ([[gpio-and-pinouts]]).',
        'Use a debounce or a wait for the release in a real macro pad ([[debouncing]]).'
      ]
    }
  ],
  applications: [
    'A macro pad or foot switch that types a shortcut.',
    'A page turner or presenter clicker.',
    'A one-switch keyboard for a user who cannot press many keys.',
    'A custom game controller or a mouse jiggler for your own machine.'
  ],
  sources: [
    'Bluetooth SIG, *HID over GATT Profile* and *HID Service* specifications.',
    'USB Implementers Forum, *Device Class Definition for HID* and *HID Usage Tables*: report descriptors and key usage IDs.',
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy" and the HID device examples.'
  ],
  sim: { id: 'bt-gatt', params: { profile: 'hid' } }
},

/* ================================================================ Classic serial and audio */
{
  id: 'bluetooth-classic-spp-and-a2dp',
  parent: 'bluetooth-and-ble',
  title: 'Bluetooth Classic: serial and audio',
  level: 2,
  short: 'What the original ESP32 can do that the LE-only chips cannot: a serial port that Android and computers see as a COM port, and a wireless speaker or audio source. The profiles, the code, and the price in memory, current and shared radio.',
  keywords: ['Bluetooth Classic', 'SPP', 'serial port profile', 'RFCOMM', 'BluetoothSerial', 'A2DP', 'AVRCP', 'HFP', 'SBC', 'speaker', 'audio sink', 'audio source', 'Secure Simple Pairing', 'ESP32-A2DP', 'Huge APP', 'COM port'],
  prereq: ['bluetooth-classic-and-le'],
  related: ['bluetooth-audio', 'i2s-amplifiers-and-dacs', 'ble-uart-service', 'the-shared-radio', 'partition-tables'],
  body: `Classic Bluetooth works with **profiles**: ready-made recipes for one job. Two matter for an ESP, and both exist only on the chips that have the Classic radio, the **original ESP32** and the ESP32-S31 ([[bluetooth-classic-and-le]]).

### SPP: a serial port in the air

The **Serial Port Profile** emulates a serial cable over a channel called RFCOMM. The ESP shows up in the phone's Bluetooth list under the name you give it; after pairing, a computer, Linux machine or Android phone offers a virtual COM port, and a terminal app (a "serial Bluetooth terminal") talks to it as if over a cable. In Arduino the \`BluetoothSerial\` library makes it behave like \`Serial\`: \`begin("name")\`, then \`available()\`, \`read()\` and \`write()\`. **iPhones cannot use it**: iOS leaves Classic serial to certified accessories, so use LE ([[ble-uart-service]]) when an iPhone must be supported. Pairing uses Secure Simple Pairing, with a confirmation on the phone; do not leave a device that can act on the world open to any pairing.

### A2DP: music

**A2DP** (Advanced Audio Distribution Profile) streams stereo audio. A **sink** receives it: a phone plays music, the ESP gets the samples and hands them to an I2S digital-to-analogue converter and an amplifier ([[i2s-amplifiers-and-dacs]]), which is how many hobby speakers are made. A **source** sends it, for instance an ESP that feeds a headset. The mandatory codec is **SBC**, at roughly 200 to 330 kbit/s, with a delay of a few tenths of a second, fine for music and bad for video or games. **AVRCP** carries play, pause and volume; **HFP** is the hands-free telephone profile. A software library supplies these profiles on top of the stack, since the Arduino core itself offers only the serial one.

### The price

- **Memory:** the Classic stack and a profile add a lot of code. Choose a partition scheme with a big application partition ("Huge APP" in the Arduino menu, [[partition-tables]]) or the sketch will not fit.
- **Current:** a Classic link keeps the radio busy; an audio stream draws tens of milliampere continuously. It is not a battery-sensor technology.
- **One radio:** Bluetooth and Wi-Fi share it ([[the-shared-radio]]); streaming audio while the ESP also uses Wi-Fi for the internet gives dropouts.
- **The future:** the Arduino core's plans for Classic in its next major version were still changing as of October 2026; pin the core version for a product.

> [!key] Classic gives the original ESP32 two things the LE chips lack: a serial port that Android and computers see as a COM port (SPP), and a wireless speaker or source (A2DP). Both cost memory, current and radio time, and iPhones cannot use the serial port.`,
  ideas: [
    'Profiles are ready-made recipes: SPP for a serial port, A2DP for stereo audio, AVRCP for remote control, HFP for hands-free calls.',
    'Only the original ESP32 and the ESP32-S31 have the Classic radio; the LE-only chips cannot do either profile.',
    'SPP appears as a COM port on computers and Android, but ordinary iPhone apps cannot open it.',
    'Classic costs flash and RAM, keeps the radio busy and shares it with Wi-Fi.'
  ],
  pitfalls: [
    'Any ESP32-family board can be a Bluetooth speaker — Only boards with the Classic radio: the original ESP32 and the S31. The S3, C3, C6 and the rest are LE only.',
    'SPP works with iPhones too — iOS does not give ordinary apps the Classic serial port. Use LE with a UART service.',
    'It compiles on the default partition scheme — A Classic sketch is large: pick a partition scheme with a big app area, or it will report that it does not fit.'
  ],
  terms: [
    { term: 'SPP', also: ['Serial Port Profile', 'RFCOMM'], def: 'The Classic Bluetooth profile that emulates a serial cable. The phone or computer sees a virtual COM port; RFCOMM is the channel layer under it.' },
    { term: 'A2DP', also: ['Advanced Audio Distribution Profile', 'A2DP sink', 'A2DP source'], def: 'The Classic profile for streaming stereo audio. A sink (a speaker) receives, a source (a phone) sends.' },
    { term: 'SBC', also: ['sub-band codec'], def: 'The audio codec that every A2DP device must support. It runs at about 200 to 330 kbit/s with a delay of a few tenths of a second.' },
    { term: 'AVRCP', also: ['Audio/Video Remote Control Profile'], def: 'The profile that sends play, pause, next and volume commands between a Bluetooth speaker or headset and the phone.' },
    { term: 'Secure Simple Pairing', also: ['SSP'], def: 'The Classic pairing procedure since Bluetooth 2.1: Just Works, numeric comparison or passkey, with public-key cryptography instead of a fixed PIN.' }
  ],
  choose: {
    good: ['SPP on an ESP32 for a quick terminal to an Android phone or a laptop', 'A2DP sink on an ESP32 with an I2S DAC for a hobby speaker', 'A big application partition and no Wi-Fi at the same time'],
    avoid: ['Classic for a battery sensor', 'SPP when iPhones must be supported', 'An open, always-pairable serial port on a device that acts on the world'],
    check: ['That your chip has the Classic radio', 'The size of the sketch against the partition scheme', 'Which version of the Arduino core the library supports']
  },
  quiz: [
    { q: 'Which board can be a Bluetooth stereo speaker for a phone?', choices: ['ESP32-C3', 'ESP32-S3', 'ESP32-C6', 'Original ESP32'], a: 3, why: 'A2DP is a Classic profile. Of the options only the original ESP32 has the Classic radio.' },
    { q: 'You build an SPP terminal and it works on an Android phone and a laptop but not on an iPhone. Why?', choices: ['The ESP is too far away', 'iOS does not give ordinary apps the Classic serial port', 'The baud rate is wrong', 'SPP needs Wi-Fi'], a: 1, why: 'iOS restricts Classic serial to certified accessories. For iPhones, use a serial service over Bluetooth LE.' },
    { q: 'An A2DP sink needs a digital-to-analogue converter or a similar output to make sound.', a: true, why: 'The ESP receives the audio as samples. An I2S DAC and amplifier (or an I2S amplifier) turn them into sound.' },
    { q: 'A Classic Bluetooth sketch fails to upload with "text section exceeds available space". What do you change?', choices: ['The baud rate', 'The partition scheme to one with a bigger application area', 'The advertising interval', 'The pin numbers'], a: 1, why: 'The Classic stack and profiles make a large application. A "Huge APP" style partition scheme gives it more flash, at the cost of the OTA slot or the file system.' }
  ],
  code: [
    {
      title: 'A serial bridge over Bluetooth Classic',
      about: 'Everything typed on the phone appears on the computer\'s serial monitor, and everything typed in the serial monitor goes to the phone. Pair "ESP32-BT" first.',
      needs: 'An original ESP32 board (or an S31) and an Android phone or computer with a serial Bluetooth terminal. Use a partition scheme with a big application area.',
      blocks: `
        when started
          start serial at (115200) baud
          start Bluetooth serial as [ESP32-BT] :: ble

        forever
          if <data available on serial> then
            send (read serial byte) to Bluetooth serial :: ble
          end
          if <data available on Bluetooth serial> then
            print (read Bluetooth serial byte)
          end
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        #include <BluetoothSerial.h>

        BluetoothSerial SerialBT;

        void setup() {
          Serial.begin(115200);
          SerialBT.begin("ESP32-BT");                     // the name the phone sees when pairing (SPP)
        }

        void loop() {
          if (Serial.available())   SerialBT.write(Serial.read());   // computer to phone
          if (SerialBT.available()) Serial.write(SerialBT.read());   // phone to computer
          delay(20);
        }
      `,
      na: { py: 'MicroPython has no Bluetooth Classic: its bluetooth module is Low Energy only. Use the Nordic UART service over LE instead ([[ble-uart-service]]).' },
      output: `(serial monitor) Text typed in a serial Bluetooth terminal on the paired phone appears here, and the other way round.`,
      notes: [
        'The program only runs on a chip with the Classic radio; the library is not available for the LE-only chips.',
        'The Arduino core 3.3 still ships this library; its place in the 4.0 pre-release is uncertain, so pin your core version.',
        'The 20 ms delay keeps the loop gentle; for speed, read in blocks with readBytes().'
      ]
    },
    {
      title: 'A Bluetooth speaker (A2DP sink)',
      about: 'The ESP appears as a speaker named "ESP32 speaker". When a phone plays music to it, the samples come out on I2S for a DAC.',
      needs: 'An original ESP32, an I2S DAC board (such as a PCM5102-type module) and an amplifier and speaker. The library\'s default I2S pins are used: check them against the library\'s README for the version you install, because they differ between versions.',
      wiring: [['GPIO26', 'DAC BCK (bit clock)', 'default of the library'], ['GPIO25', 'DAC LRCK (word select)', 'default of the library'], ['GPIO22', 'DAC DIN (data)', 'default of the library']],
      libs: ['ESP32-A2DP (pschatzmann)'],
      blocks: `
        when started
          start Bluetooth speaker [ESP32 speaker] :: ble
      `,
      cpp: String.raw`
        #include "BluetoothA2DPSink.h"

        BluetoothA2DPSink a2dp_sink;

        void setup() {
          a2dp_sink.start("ESP32 speaker");               // appears as a speaker; audio goes out on I2S
        }

        void loop() {
          delay(1000);
        }
      `,
      na: { py: 'MicroPython has no Bluetooth Classic and no A2DP. For an LE-only chip, wait for LE Audio support ([[ble-mesh-and-le-audio]]).' },
      output: `(nothing on the serial port) The phone lists "ESP32 speaker" under Bluetooth; music played to it comes out of the DAC.`,
      notes: [
        'This is a library, not part of the Arduino core. Its newer versions work with an audio-tools library and set the I2S pins in code; follow the README of the version you install.',
        'Do not run Wi-Fi at the same time while streaming: the shared radio causes dropouts ([[the-shared-radio]]).',
        'For the sound side of the project see [[bluetooth-audio]].'
      ]
    }
  ],
  applications: [
    'A quick wireless console to an Android phone or laptop during development.',
    'A hobby Bluetooth speaker or an old stereo made wireless ([[bluetooth-audio]]).',
    'Sending data from a sensor to a laptop program that expects a COM port.',
    'A hands-free or audio gadget built on an original ESP32.'
  ],
  sources: [
    'Bluetooth SIG, specifications of the Serial Port Profile, the Advanced Audio Distribution Profile (A2DP) and AVRCP.',
    'Espressif, *ESP-IDF Programming Guide*, "Classic Bluetooth" (A2DP, SPP and the Bluedroid host).',
    'Arduino-ESP32 documentation: the BluetoothSerial library.'
  ],
  sim: { id: 'bt-chips', params: { filter: 'classic' } }
},

/* ================================================================ Bluetooth 5 */
{
  id: 'ble-5-long-range-and-extended-advertising',
  parent: 'bluetooth-and-ble',
  title: 'Bluetooth 5: long range and extended advertising',
  level: 3,
  short: 'Bluetooth 5 gave Low Energy a 2 Mbit/s mode, a coded long-range mode, and advertisements up to 255 bytes per packet. What each buys, what it costs in airtime, which ESP chips have them, and why both ends must agree.',
  keywords: ['Bluetooth 5', '2M PHY', 'coded PHY', 'long range', 'LE Coded', 'S=2', 'S=8', 'extended advertising', 'periodic advertising', 'advertising sets', 'PHY', 'sensitivity', 'range', 'airtime', 'channel selection algorithm 2'],
  prereq: ['ble-advertising', 'ble-connection-parameters', 'link-budget'],
  related: ['bluetooth-classic-and-le', 'rssi-and-signal-quality', 'decibels-and-dbm', 'range-and-obstacles', 'lora'],
  body: `Bluetooth 5 (2016) added three things to Low Energy that matter to a maker: a faster radio mode, a longer-range one, and bigger advertisements. They are optional features, so a chip may say "Bluetooth 5" and omit some; the catalogue lists which ones each ESP chip has.

### Three PHYs

A **PHY** is a way of encoding bits onto the radio. Low Energy now has four:

| PHY | Bit rate | Sensitivity (typical) | Airtime of 100 bytes |
|---|---|---|---|
| **1M** (the old one) | 1 Mbit/s | about -95 dBm | about 0.9 ms |
| **2M** | 2 Mbit/s | about -92 dBm | about 0.45 ms |
| **Coded, S=2** | 500 kbit/s | about -99 dBm | about 2.1 ms |
| **Coded, S=8** | 125 kbit/s | about -103 dBm | about 7.1 ms |

The **coded PHY** spends extra symbols on error correction, so the receiver can decode a weaker signal: 8 symbols per bit (S=8) gain about 8 dB over the 1M PHY. In free space every 6 dB doubles the range, so the best case is about 2.5 times the distance (the SIG's headline of four times the range assumes a gain nearer 12 dB); indoors, with a path-loss exponent of 3, the same 8 dB buys roughly 1.8 times the distance. The price is **airtime**: a packet takes eight times as long at S=8, with all the extra current and collisions that come with it. The **2M PHY** is the opposite trade: half the airtime and so more throughput and less energy per byte, at slightly less range ([[ble-connection-parameters]]).

### Extended advertising

Legacy advertising holds 31 bytes on channels 37 to 39. **Extended advertising** sends a short pointer on those channels and the real data, up to 255 bytes per packet and chained to as much as 1650 bytes, on the *data* channels, which also lets it use the coded PHY. **Periodic advertising** broadcasts on a fixed schedule that receivers can synchronise to, which is the basis of broadcast audio. A device can run several **advertising sets** at once, each with its own data and interval.

### What the ESP chips have

The ESP32-S3, C3, C6, C2, H2, C5 and C61 list the 2M PHY, the coded PHY and extended advertising; the original ESP32 has none of them (LE 4.2), the S31 lists the two PHYs but not extended advertising, and the H4 and H21 list neither PHY. The simulation draws the table from the catalogue.

### Both ends must agree

A long-range link needs the coded PHY at *both* ends, and a scanner must listen for extended advertising and the coded PHY, which many phones and apps do not do unless asked. In the ESP-IDF these are build options that must be switched on, and the prebuilt Arduino libraries may not enable them: check your core before you count on them. Radio rules limit the transmit power whatever the PHY ([[transmit-power-and-regulations]]).

> [!key] Bluetooth 5 added a 2 Mbit/s PHY (twice the speed), coded PHYs (S=2 and S=8, more range for far more airtime) and extended advertising (up to 255 bytes a packet). The ESP32-S3, C3, C6, C2, H2, C5 and C61 have them; the original ESP32 does not; both ends must support a feature to use it.`,
  ideas: [
    'LE has four PHYs: 1M, 2M (twice as fast, slightly shorter range) and coded S=2 and S=8 (500 and 125 kbit/s, much longer range).',
    'The coded PHY trades airtime for sensitivity: S=8 gains about 8 dB, a little under double the range indoors, for eight times the airtime.',
    'Extended advertising carries up to 255 bytes per packet on data channels, chained to 1650 bytes, and can use the coded PHY.',
    'Both ends must support a feature; many scanners must be asked to listen for extended advertising and the coded PHY.'
  ],
  pitfalls: [
    'Long range means a ten times longer range — The coded PHY gains a few dB. That is 1.5 to 2.5 times the distance, depending on the surroundings, not ten times.',
    'Bluetooth 5 chips all have every Bluetooth 5 feature — The features are optional. Check the catalogue for 2M, coded and extended advertising.',
    'Switching the ESP to the coded PHY extends the phone\'s range too — Both ends must use it; a phone that does not listen for the coded PHY hears nothing.'
  ],
  terms: [
    { term: 'PHY', also: ['physical layer', 'LE 1M', 'LE 2M', 'LE Coded'], def: 'The way bits are encoded onto the radio. Low Energy has 1M and 2M uncoded PHYs, and the coded PHY with two coding rates.' },
    { term: 'Coded PHY', also: ['LE Coded', 'long range', 'S=2', 'S=8'], def: 'A Bluetooth 5 PHY that adds error correction so weaker signals can be decoded: 500 kbit/s (S=2) or 125 kbit/s (S=8), with more range and longer airtime.' },
    { term: 'Extended advertising', also: ['ADV_EXT_IND', 'secondary channels'], def: 'Advertising of Bluetooth 5 that sends a pointer on channels 37 to 39 and up to 255 bytes per packet on the data channels, chained to as much as 1650 bytes.' },
    { term: 'Periodic advertising', also: ['PAwR', 'periodic advertising with responses'], def: 'Advertising on a fixed, published schedule so that receivers can synchronise to it. Used for broadcast audio and, in newer versions, for one-to-many control with replies.' },
    { term: 'Sensitivity', also: ['receiver sensitivity'], def: 'The weakest signal, in dBm, that a receiver can still decode. A lower (more negative) figure means a longer range.' }
  ],
  choose: {
    good: ['The 2M PHY for bulk transfers on a short link: less airtime, less energy per byte', 'The coded PHY for a sensor between buildings or across a garden, with both ends your own', 'Extended advertising for a payload that does not fit in 31 bytes'],
    avoid: ['Counting on the coded PHY with a phone you do not control', 'The coded S=8 PHY for frequent or large messages: the airtime is huge', 'Choosing a chip by "Bluetooth 5" without checking the features'],
    check: ['That both ends support the PHY, with a test', 'That the build enables extended advertising and the coded PHY', 'The legal power limit in your country']
  },
  formulas: [
    {
      name: 'Range gained from extra link budget',
      expr: 'r = r0*10^(dG/(10*n))',
      tex: 'r = r_0\\,10^{\\frac{\\Delta G}{10\\,n}}',
      vars: {
        r: { name: 'new range', q: 'length', unit: 'm' },
        r0: { name: 'range with the 1M PHY', q: 'length', unit: 'm', value: 50, min: 0 },
        dG: { name: 'extra link budget (sensitivity gain)', q: 'gain', unit: 'dB', value: 8, min: 0, tex: '\\Delta G' },
        n: { name: 'path-loss exponent', q: 'none', value: 3, min: 1.5, max: 4 }
      },
      solveFor: 'r',
      note: 'Free space has n = 2 (6 dB doubles the range); a house or office has n = 3 or more. It needs the same loss model on both sides of the comparison, and a line of sight.'
    }
  ],
  examples: [
    {
      title: 'What does S=8 buy across a garden?',
      q: 'A sensor reaches the house at 50 m with the 1M PHY. The coded PHY (S=8) gains about 8 dB. How far does it reach in open air (n = 2) and in a cluttered garden (n = 3)?',
      steps: ['Open air: $50 \\times 10^{8/20} = 50 \\times 2.51 \\approx 126$ m.', 'Cluttered: $50 \\times 10^{8/30} = 50 \\times 1.85 \\approx 92$ m.'],
      a: 'About 126 m in open air and 92 m in clutter. Useful, but not tenfold; and every message takes eight times as long on the air.'
    }
  ],
  quiz: [
    { q: 'You switch both ends from the 1M PHY to the coded PHY with S=8. What do you get?', choices: ['Twice the speed', 'More range and eight times the airtime for the same bytes', 'More range and the same airtime', 'Less range and less current'], a: 1, why: 'The coded PHY adds error correction and runs at 125 kbit/s, so it is far slower on the air and decodes weaker signals.' },
    { q: 'An ESP32-C3 supports Bluetooth 5. A phone app never sees its extended advertisements. What is a likely reason?', choices: ['The C3 cannot send them', 'The phone or app only scans legacy advertising unless asked to scan extended advertising', 'The advertisements are encrypted', 'Extended advertising only works on 5 GHz'], a: 1, why: 'Extended advertising is optional on both sides. Many phones and apps scan only legacy advertising, and the build of the ESP must also enable the feature.' },
    { q: 'The coded PHY gains 8 dB over the 1M PHY. In free space (n = 2) about how much farther does it reach?', choices: ['The same distance', 'About 1.2 times', 'About 2.5 times', 'About 10 times'], a: 2, why: '10^(8/20) = 2.5. Every 6 dB doubles the free-space range, and 8 dB is a little more than one doubling plus a bit.' },
    { q: 'All chips with Bluetooth 5 support the 2M PHY, the coded PHY and extended advertising.', a: false, why: 'These are optional features. The catalogue lists them chip by chip; some chips list only some.' }
  ],
  applications: [
    'A sensor at the far end of a garden or a farm yard with both ends your own.',
    'Fast transfers of a log file over a short link with the 2M PHY.',
    'Advertisements that carry more than 31 bytes of sensor data.',
    'Broadcast audio and other synchronised broadcasts that use periodic advertising ([[ble-mesh-and-le-audio]]).'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, versions 5.0 and later, Vol 6: LE 2M PHY, LE Coded PHY, extended and periodic advertising.',
    'Bluetooth SIG, *Bluetooth 5 Core Specification Feature Overview* (the long-range and speed claims).',
    'Espressif, datasheets and the *ESP-IDF Programming Guide*, "Bluetooth Low Energy": the supported Bluetooth 5 features per chip.'
  ],
  sim: 'bt-phy'
},

/* ================================================================ Mesh and LE Audio */
{
  id: 'ble-mesh-and-le-audio',
  parent: 'bluetooth-and-ble',
  title: 'Bluetooth Mesh and LE Audio',
  level: 3,
  short: 'Two newer layers on Low Energy: Mesh, a network of many nodes that relay each other\'s messages, and LE Audio, a new audio system with a new codec and broadcast. What each is for, how flooding works, and where the ESP chips stand.',
  keywords: ['Bluetooth Mesh', 'mesh', 'ESP-BLE-MESH', 'provisioning', 'managed flooding', 'TTL', 'relay', 'friend node', 'low power node', 'proxy', 'model', 'group address', 'LE Audio', 'LC3', 'isochronous', 'Auracast', 'CIS', 'BIS', 'hearing aids'],
  prereq: ['ble-advertising', 'ble-5-long-range-and-extended-advertising'],
  related: ['mesh-networks-on-esp', 'zigbee', 'thread', 'choosing-a-smart-home-radio', 'bluetooth-audio'],
  body: `Two newer layers sit on Bluetooth Low Energy and change what it can do: **Mesh**, for networks of many devices, and **LE Audio**, for sound. Neither is a first project, but both explain where Bluetooth is heading.

### Bluetooth Mesh

An ordinary BLE link is one-to-one. **Mesh** (1.0 in 2017, 1.1 later) makes many-to-many networks of lamps, switches and sensors on the *advertising* radio: no connections. A node sends a message as an advertisement, and any node that hears it and is a **relay** sends it on again. This is **managed flooding**: there are no routing tables, each message carries a **TTL** (time to live) that every relay reduces by one, and a short cache of recent messages stops a node from repeating what it has already sent. The simulation floods a message through a grid of nodes: change the range, the TTL and how many nodes relay, and count the transmissions.

Devices join a mesh by **provisioning**: a provisioner gives each node its keys and an address, over advertising or over a connection. Messages are encrypted with a network key, and application data with an application key. Functions are **models**, such as "generic on/off" or "light lightness", which nodes **publish** to and **subscribe** from at group addresses: a switch publishes "on" to the group that all kitchen lamps subscribe to. A message is short (about a dozen bytes in one packet; longer ones are segmented). Special roles exist: a **proxy** node lets a phone join over a connection, and **low-power nodes** sleep and ask a **friend** node for their messages.

Flooding is simple and robust, and it is noisy: every relay repeats every message, so a dense mesh can jam its own channels. That is why relays are chosen with care and TTLs kept small. In the ESP family, Espressif's **ESP-BLE-MESH** implementation in ESP-IDF supports it on the Bluetooth chips; check the ESP-IDF documentation for your chip and version. There is no Arduino or MicroPython library.

### LE Audio

LE Audio (Bluetooth 5.2 and later) brings sound to Low Energy with a new codec, **LC3**, which sounds as good as the old SBC at about half the bit rate, and new **isochronous** channels with timing guarantees. It adds **broadcast audio**, branded Auracast, where one source sends to any number of receivers (a TV in a bar, an airport announcement, a hearing loop) and multi-device sets like true wireless earbuds. It needs a chip with the isochronous features and a stack that supports them. In the catalogue only the ESP32-S31 and the ESP32-H4 list LE Audio, and as of October 2026 the S31's software is in preview and the H4 is sampling, so treat it as a direction, not a tool.

> [!key] Mesh floods messages through relaying nodes, with a TTL and a cache, to build many-to-many networks on the advertising radio. LE Audio adds the LC3 codec, isochronous channels and broadcast audio to LE. The ESP32-S31 and H4 list LE Audio, with software still early.`,
  ideas: [
    'Bluetooth Mesh builds many-to-many networks on advertising: no connections, and relay nodes repeat messages (managed flooding) with a TTL and a cache.',
    'Nodes join by provisioning, which gives them keys and addresses; functions are models that publish and subscribe at group addresses.',
    'Flooding is robust but noisy; relays are chosen with care and TTLs kept small.',
    'LE Audio adds the LC3 codec, isochronous channels and broadcast audio (Auracast); among the ESP chips only the S31 and the H4 list it, with software still early.'
  ],
  pitfalls: [
    'A Bluetooth Mesh is a Wi-Fi-like network with routes — It has no routes. Every relay repeats every message until its TTL runs out.',
    'More relays make a mesh more reliable — Up to a point. Past it, repeats collide and jam the channels.',
    'LE Audio will run on my ESP32-C3 — Only chips that list the features and a stack that supports them. In the catalogue that is the S31 and H4, in preview.'
  ],
  terms: [
    { term: 'Bluetooth Mesh', also: ['BLE Mesh'], def: 'A many-to-many network standard on Bluetooth Low Energy in which nodes send messages as advertisements and relay nodes repeat them. It uses managed flooding rather than routing.' },
    { term: 'Managed flooding', also: ['flooding', 'TTL', 'time to live'], def: 'Passing a message on by having every relay repeat it, with a counter (TTL) reduced at each repeat and a cache that suppresses duplicates.' },
    { term: 'Provisioning', also: ['provisioner'], def: 'The procedure that adds a device to a mesh by giving it a network key, an address and its role.' },
    { term: 'Model', also: ['Generic OnOff', 'publish/subscribe'], def: 'In Mesh, the definition of a function such as on/off or brightness, with its messages. Nodes publish to and subscribe at group addresses.' },
    { term: 'LE Audio', also: ['LC3', 'Auracast', 'isochronous channel'], def: 'The audio system of Bluetooth 5.2 and later: the LC3 codec, channels with timing guarantees, multi-stream and broadcast audio.' }
  ],
  choose: {
    good: ['Mesh for many lamps, switches and sensors that must reach each other across a building', 'ESP-BLE-MESH on an LE chip that lists Mesh, when the project can use ESP-IDF', 'LE Audio when a final product needs broadcast or hearing-aid support and a supported chip exists'],
    avoid: ['Mesh for a handful of devices that a hub could reach directly', 'Mesh for large or frequent data: messages are tiny', 'Planning a product around LE Audio on a chip that is still in preview'],
    check: ['That your chip and ESP-IDF version support ESP-BLE-MESH', 'The relay density and TTL: flooding noise', 'The state of the software for the feature on your chip']
  },
  quiz: [
    { q: 'How does a Bluetooth Mesh message cross a building?', choices: ['Through routes computed by the nodes', 'By being repeated by relay nodes until its TTL reaches zero', 'Through a central hub only', 'By Wi-Fi'], a: 1, why: 'Mesh uses managed flooding: each relay repeats the message with a lower TTL, and a cache stops duplicates. There are no routing tables.' },
    { q: 'Why not make every node in a dense mesh a relay?', choices: ['Relays cost too much money', 'Every relay repeats every message, so too many cause collisions and jam the channels', 'Relays cannot sleep', 'Messages get longer at each relay'], a: 1, why: 'Flooding multiplies transmissions. In a dense mesh the repeats collide, so relays are chosen with care and TTLs kept small.' },
    { q: 'Which ESP chips of the catalogue list LE Audio?', choices: ['ESP32 and ESP32-S3', 'ESP32-C3 and C6', 'ESP32-S31 and ESP32-H4', 'None'], a: 2, why: 'The catalogue lists LE Audio for the ESP32-S31 (software in preview) and the ESP32-H4 (sampling).' },
    { q: 'LE Audio uses the same SBC codec as classic A2DP.', a: false, why: 'LE Audio brings the LC3 codec, which gives comparable quality at roughly half the bit rate of SBC.' }
  ],
  applications: [
    'Lighting and building control with many lamps and switches (ESP-BLE-MESH).',
    'Sensor networks in a building where Wi-Fi coverage is thin.',
    'Hearing aids and broadcast audio in public places (LE Audio and Auracast).',
    'Understanding how Thread and Zigbee meshes differ ([[choosing-a-smart-home-radio]]).'
  ],
  sources: [
    'Bluetooth SIG, *Mesh Protocol* and *Mesh Model* specifications (1.0 and 1.1).',
    'Bluetooth SIG, *Bluetooth Core Specification* 5.2 and later: isochronous channels and LE Audio; the LC3 codec specification.',
    'Espressif, *ESP-IDF Programming Guide*, "ESP-BLE-MESH".'
  ],
  sim: 'bt-mesh'
},

/* ================================================================ the two stacks */
{
  id: 'ble-stacks-nimble-bluedroid',
  parent: 'bluetooth-and-ble',
  title: 'NimBLE and Bluedroid',
  level: 3,
  short: 'Under every Bluetooth sketch sits a host stack. Bluedroid does Classic and LE and is big; NimBLE does LE only and is small. Which one your Arduino, MicroPython or ESP-IDF program uses, and what changes when it switches.',
  keywords: ['NimBLE', 'Bluedroid', 'host stack', 'controller', 'HCI', 'VHCI', 'NimBLE-Arduino', 'h2zero', 'BLE library', 'Arduino BLE', 'BLE.h', 'Apache Mynewt', 'ESP-IDF menuconfig', 'RAM', 'flash size', 'Arduino 4.0'],
  prereq: ['ble-roles', 'gatt'],
  related: ['bluetooth-classic-spp-and-a2dp', 'arduino-ide-and-the-esp32-core', 'micropython-setup', 'esp-idf-basics', 'partition-tables'],
  body: `A Bluetooth program stands on a stack of layers. At the bottom the **controller** runs the radio and the link layer, closed-source firmware from Espressif. It talks through an interface called **HCI** to the **host**, which holds L2CAP, ATT and GATT, the security manager and GAP. Your program calls the host. On the ESP32 family there are two hosts to choose from.

### Two hosts

| | Bluedroid | NimBLE |
|---|---|---|
| Origin | Android's Bluetooth stack | Apache Mynewt project |
| Radio systems | Classic and Low Energy | Low Energy only |
| Size | large | markedly smaller in flash and RAM |
| Strength | Classic profiles (A2DP, SPP, HFP), the original Arduino BLE library | a lean LE host that Espressif recommends for LE-only designs |

Both are in ESP-IDF, and a project picks one in its configuration. Classic needs Bluedroid; a sensor that only does LE is happier with NimBLE, with room left for Wi-Fi and the application.

### Which one is under my code

- **Arduino core 3.3 and later:** the BLE library (\`BLEDevice\`, \`BLEServer\`) is **Bluedroid on the original ESP32** and **NimBLE on every other chip**, under the same code. Before 3.3 it was Bluedroid only. A second library, **NimBLE-Arduino**, replaces it with the full NimBLE interface on any chip: its calls differ (for instance milliseconds in scan times, connection information passed to callbacks, and no automatic restart of advertising) and you use one library or the other, never both. The core's 4.0 pre-release rewrites the BLE API into a new \`BLE.h\` (as of October 2026, final behaviour still to be seen), so pin the core version for a product.
- **MicroPython:** the \`bluetooth\` module uses NimBLE on the ESP32 port, LE only. \`aioble\` is a package that wraps it in asyncio.
- **ESP-IDF:** your choice, by menuconfig.
- **Matter and some provisioning** sketches own the BLE host: do not use the BLE library in the same sketch.

### What changes when it switches

The programming model is the same: services, characteristics, callbacks. The visible differences are the size (an LE-only application shrinks), a few features present in one and absent in the other, the names of the security calls, and details of memory use. A program that depends on a call of one stack can fail to compile on the other, so test on the chip you will ship. Whichever stack runs, Bluetooth and Wi-Fi share the radio and the RAM ([[the-shared-radio]]).

> [!key] The controller runs the radio; a host stack (Bluedroid or NimBLE) sits above it. Bluedroid is big and does Classic and LE; NimBLE is small and LE only. The Arduino BLE library uses Bluedroid on the original ESP32 and NimBLE elsewhere; MicroPython uses NimBLE.`,
  ideas: [
    'A controller runs the radio and a host (Bluedroid or NimBLE) holds GATT, ATT, security and GAP; your code calls the host.',
    'Bluedroid does Classic and LE and is large; NimBLE does LE only and is smaller; ESP-IDF supports both.',
    'The Arduino BLE library uses Bluedroid on the original ESP32 and NimBLE on every other chip (core 3.3 and later); the NimBLE-Arduino library is an alternative with a different interface.',
    'MicroPython\'s bluetooth module uses NimBLE; the Arduino core 4.0 pre-release rewrites the BLE API.'
  ],
  pitfalls: [
    'My BLE sketch behaves the same on all chips because it is the same code — The stack underneath differs. Test on the chip you ship, especially for security, memory and Classic features.',
    'I can include both the core BLE library and NimBLE-Arduino — They are alternatives. Use one, or the build breaks.',
    'NimBLE is just a faster Bluedroid — It is a different stack: smaller, LE only, with its own calls and defaults.'
  ],
  terms: [
    { term: 'Host stack', also: ['Bluetooth host', 'BLE host'], def: 'The software layer that implements L2CAP, ATT, GATT, the security manager and GAP, above the controller. On the ESP32 it is Bluedroid or NimBLE.' },
    { term: 'Controller', also: ['Bluetooth controller', 'link layer'], def: 'The lower part of the Bluetooth stack that runs the radio and the link layer. On the ESP32 it is firmware from Espressif, reached through HCI.' },
    { term: 'HCI', also: ['Host Controller Interface', 'VHCI'], def: 'The standard interface between a controller and a host. On the ESP32 both live on the same chip and talk through a virtual HCI.' },
    { term: 'Bluedroid', def: 'The Bluetooth host stack from Android. In the ESP32 family it supports Classic Bluetooth and Low Energy and is the larger of the two.' },
    { term: 'NimBLE', also: ['Apache Mynewt NimBLE', 'NimBLE-Arduino'], def: 'A small, Low Energy only host stack from the Apache Mynewt project. NimBLE-Arduino is a library that exposes it to Arduino sketches.' }
  ],
  choose: {
    good: ['NimBLE for any LE-only product: smaller and with more room for Wi-Fi', 'Bluedroid when you need Classic profiles on the original ESP32', 'The same library on all your boards, with a test on each chip'],
    avoid: ['Mixing the two Arduino BLE libraries in one sketch', 'Relying on a feature of one stack when you may move chips', 'Not pinning the core version of a product'],
    check: ['Which stack your core and chip use, with a test sketch', 'The flash and RAM left after the stack and Wi-Fi', 'The migration notes when the core changes']
  },
  quiz: [
    { q: 'Which host stack does the Arduino BLE library use on an ESP32-C3 with core 3.3 or later?', choices: ['Bluedroid', 'NimBLE', 'Neither: the C3 has no Bluetooth', 'It depends on the sketch'], a: 1, why: 'Since core 3.3, the BLE library uses NimBLE on every chip except the original ESP32, which keeps Bluedroid (it supports Classic as well).' },
    { q: 'Which stack can run Classic Bluetooth profiles such as A2DP?', choices: ['NimBLE', 'Bluedroid', 'Both', 'Neither'], a: 1, why: 'NimBLE is a Low Energy host only. Classic profiles live in Bluedroid, on a chip that has the Classic radio.' },
    { q: 'You can use the core BLE library and NimBLE-Arduino together in one sketch for the best of both.', a: false, why: 'NimBLE-Arduino replaces the core library with its own interface. They are alternatives and including both breaks the build.' },
    { q: 'Why might a sketch that works on an ESP32 fail to compile on an ESP32-S3?', choices: ['The S3 has no Bluetooth', 'It uses a call that exists only in the Bluedroid version of the library', 'The S3 has too many pins', 'The S3 needs MicroPython'], a: 1, why: 'The same library sits on a different stack on the S3, and a few calls differ or are missing. Test on each chip.' }
  ],
  code: [
    {
      title: 'Which stack am I running?',
      about: 'Brings Bluetooth up, says which host stack the build uses (Arduino), prints the device\'s own address, and exits. A handy first test on a new board or after changing core.',
      needs: 'Any ESP32-family board with Bluetooth, and the serial monitor at 115200 baud (a REPL for MicroPython).',
      blocks: `
        when started
          start serial at (115200) baud
          start BLE as [stack-check] :: ble
          print (join [host stack: ] (BLE host stack name) :: ble)
          print (join [own address: ] (BLE own address) :: ble)
      `,
      cpp: String.raw`
        #include <BLEDevice.h>

        void setup() {
          Serial.begin(115200);
          BLEDevice::init("stack-check");
        #if defined(CONFIG_BLUEDROID_ENABLED) || defined(CONFIG_BT_BLUEDROID_ENABLED)
          Serial.println("host stack: Bluedroid");
        #elif defined(CONFIG_NIMBLE_ENABLED) || defined(CONFIG_BT_NIMBLE_ENABLED)
          Serial.println("host stack: NimBLE");
        #else
          Serial.println("host stack: unknown");
        #endif
          Serial.printf("own address: %s\n", BLEDevice::getAddress().toString().c_str());
        }

        void loop() {}
      `,
      py: String.raw`
        import bluetooth, binascii

        ble = bluetooth.BLE()
        ble.active(True)
        print("host stack: NimBLE (the MicroPython ESP32 port always uses it)")
        addr_type, addr = ble.config("mac")                  # the type of address and the 6 bytes
        print("own address:", binascii.hexlify(addr, ":").decode(), "type", addr_type)
      `,
      output: `host stack: NimBLE
own address: 3c:84:27:aa:01:5e`,
      notes: [
        'The names of the configuration macros can change between cores; if the line says "unknown", look in the core\'s sdkconfig.h for the Bluetooth host options.',
        'The address is the chip\'s own; a phone may see a different random address if the stack uses privacy.',
        'The same check, written as a test in your project, catches a core update that quietly switches stacks.'
      ]
    }
  ],
  applications: [
    'Choosing the host for a new product: LE only (NimBLE) or Classic too (Bluedroid).',
    'Moving a project from the original ESP32 to a C3 or S3 and finding what changes.',
    'Getting the memory back for Wi-Fi and the application on a small flash.',
    'Reading ESP-IDF examples: which stack a given example is written for.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Bluetooth Low Energy" and "Host Stack: Bluedroid and NimBLE".',
    'Apache Mynewt, documentation of the NimBLE host.',
    'Arduino-ESP32 documentation: the BLE library and its notes on the host stack; the NimBLE-Arduino project documentation.'
  ]
}
);
