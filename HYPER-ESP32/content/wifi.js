/* HYPER-ESP32 · content/wifi.js
 *
 * Topic "wifi" (branch wireless): how Wi-Fi works, connecting as a station, events and reconnection, the soft access
 * point and captive portal, provisioning, IP/DHCP/DNS, mDNS, scanning, WPA2/WPA3, Wi-Fi 6, long-range mode, sensing and
 * ranging, and troubleshooting. Simulations: sims/wifi.js (ids wf-*).
 */
Hyper.add(
/* ================================================================ how Wi-Fi works */
{
  id: 'wifi-basics',
  parent: 'wifi',
  title: 'How Wi-Fi works',
  level: 1,
  short: 'Wi-Fi is Ethernet through the air: a station joins a network run by an access point, on a numbered channel in a band that every neighbour shares. Which chip speaks which Wi-Fi, and why the speed on the label is not the speed you get.',
  keywords: ['Wi-Fi', 'WiFi', 'access point', 'station', 'SSID', 'BSSID', 'beacon', 'channel', '2.4 GHz', '5 GHz', '802.11', 'Wi-Fi 4', 'Wi-Fi 6', 'channel 1 6 11', 'router', 'CSMA/CA', 'PHY rate'],
  prereq: ['radio-basics', 'chip-module-board'],
  related: ['interference-and-channels', 'five-ghz-and-six-ghz', 'wifi-station', 'wifi-scanning', 'the-shared-radio', 'wifi-6-on-esp', 'transmit-power-and-regulations'],
  body: `Wi-Fi carries the same internet packets as an Ethernet cable, but through the air, on frequencies that every neighbour shares. An ESP that joins your network is a **station**; the router it joins is the **access point**. About ten times a second the access point broadcasts a small frame, the **beacon**: *I am here*, with the network's name (the **SSID**), its channel, the security it asks for and the speeds it understands. A station that has heard a beacon can ask to join ([[wifi-station]]); one that only wants to know what is around can listen for them ([[wifi-scanning]]).

### The band and its channels

Every Wi-Fi chip of the family except one works only in the **2.4 GHz** band, 2400 to 2483.5 MHz, cut into channels 5 MHz apart: channel 1 is centred on 2412 MHz, channel 6 on 2437, channel 11 on 2462, channel 13 on 2472 (the calculator below does the sum). But a Wi-Fi signal is about 20 MHz wide, four channels' worth, so neighbouring channels overlap and only 1, 6 and 11 sit clear of one another. That is why routers so often sit on one of those three, and why a network on channel 3 disturbs networks on both 1 and 6. North America allows channels 1–11, most of the world 1–13 (check your country's rules, [[transmit-power-and-regulations]]); channel 14 exists only in Japan. The simulation below draws the humps.

The **ESP32-C5** alone adds the **5 GHz** band: many more clear channels, less reach through walls, and no Bluetooth or microwave oven in it ([[five-ghz-and-six-ghz]]).

### What each chip speaks

| Chip | Wi-Fi | Band | Channel width | Best PHY rate |
|---|---|---|---|---|
| ESP32, S2, S3, C3 | Wi-Fi 4, 802.11 b/g/n | 2.4 GHz | 20 or 40 MHz | 150 Mbit/s |
| ESP32-C2, ESP8266 | Wi-Fi 4 | 2.4 GHz | 20 MHz only | 72.2 Mbit/s |
| ESP32-C6, C61, S31 | Wi-Fi 6, 802.11ax | 2.4 GHz | 20 or 40 MHz; 802.11ax only 20 | 150 Mbit/s (802.11n) |
| ESP32-C5 | Wi-Fi 6 | 2.4 and 5 GHz | 20 or 40 MHz; 802.11ax only 20 | 150 Mbit/s |
| ESP32-H2, H4, H21, P4 | none | | | |

The ESP32-P4 gets its Wi-Fi from a companion chip on the board. The ESP32-E22 in the catalogue is a co-processor for a Linux host (Wi-Fi 6E on 2.4, 5 and 6 GHz), not a chip to program like the others.

### Why the label is not the speed

The **PHY rate** is the speed of the bits on the air in perfect conditions, and a small ESP has one antenna and one stream. Wi-Fi is also **half-duplex** and polite: a radio listens first, sends if the channel is free, and waits a random time if not (CSMA/CA), so everyone on a channel, even on someone else's network, shares its airtime. Add headers, acknowledgements and retries, and a few tens of megabit/s of real TCP data is a good day. A strong signal on a crowded channel is still slow.

> [!key] Wi-Fi is a shared band cut into overlapping channels; only 1, 6 and 11 avoid each other on 2.4 GHz, and every chip of the family but the ESP32-C5 lives there. The speed on the label is the best case of the radio, not what a program will see.`,
  ideas: [
    'A station joins a network run by an access point, which announces itself in beacon frames about ten times a second.',
    'On 2.4 GHz the channels are 5 MHz apart but the signal is about 20 MHz wide, so only channels 1, 6 and 11 do not overlap.',
    'Every Wi-Fi chip of the family is 2.4 GHz only except the ESP32-C5, which adds 5 GHz.',
    'Everyone on a channel shares its airtime, so real throughput is a fraction of the PHY rate.'
  ],
  pitfalls: [
    'Putting my network on a different channel from my neighbour removes the interference — Only channels 1, 6 and 11 are clear of each other. A network on channel 3 overlaps both 1 and 6, and a neighbour on your own channel merely shares the airtime.',
    'The ESP32-C6 has Wi-Fi 6, so it is as fast as my phone — Its 802.11ax mode is 20 MHz wide with one antenna, and Wi-Fi 6 here is about crowded air and battery life, not speed ([[wifi-6-on-esp]]).',
    'My router is dual-band, so my ESP can use the 5 GHz network — Only the ESP32-C5 has a 5 GHz radio. All other chips of the family need the 2.4 GHz network, or a router that offers both under separate names.'
  ],
  terms: [
    { term: 'Access point', also: ['AP', 'router', 'base station'], def: 'The device that runs a Wi-Fi network: it broadcasts beacons, lets stations join and relays their packets. A home router contains one; an ESP can be one too ([[soft-ap-and-captive-portal]]).' },
    { term: 'Station', also: ['STA', 'client'], def: 'A device that joins a Wi-Fi network run by an access point. An ESP connecting to your router is a station.' },
    { term: 'SSID', also: ['network name', 'service set identifier'], def: 'The name of a Wi-Fi network, up to 32 bytes, broadcast in every beacon unless the network is hidden.' },
    { term: 'BSSID', also: ['access point address'], def: 'The MAC address of one particular access point radio. Two access points of the same network share an SSID but have different BSSIDs.' },
    { term: 'Beacon', also: ['beacon frame'], def: 'A small broadcast frame an access point sends about every 100 ms: its SSID, channel, security, supported rates and the timing of its power-save schedule.' },
    { term: 'Channel', also: ['Wi-Fi channel'], def: 'One of the numbered slices of a band. On 2.4 GHz channel n is centred on 2407 + 5n MHz; a transmission is about 20 MHz wide, so neighbouring channels overlap.' }
  ],
  choose: {
    good: ['Devices that need the internet or the local network directly: dashboards, cloud reporting, firmware updates over the air', 'Mains-powered or large-battery devices that move a lot of data', 'Anything a phone or laptop must reach with no extra hardware'],
    avoid: ['Coin-cell sensors that must run for years: look at Bluetooth LE, ESP-NOW, Zigbee or LoRa', 'Links of hundreds of metres, or places with no router', 'Streams that need guaranteed timing on a crowded 2.4 GHz band'],
    check: ['Which band the network you will join uses: only the ESP32-C5 can join a 5 GHz-only network', 'The signal strength at the installed position, not on the bench ([[rssi-and-signal-quality]])', 'How many other networks share your channel']
  },
  formulas: [
    {
      name: 'Centre frequency of a 2.4 GHz Wi-Fi channel',
      expr: 'f = 2.407e9 + 5e6*n',
      tex: 'f = 2407\\,\\mathrm{MHz} + 5\\,\\mathrm{MHz}\\cdot n',
      vars: {
        f: { name: 'centre frequency', q: 'frequency', unit: 'MHz' },
        n: { name: 'channel number (1–13)', q: 'count', value: 6, min: 1, max: 13, int: true }
      },
      solveFor: 'f',
      note: 'Valid for channels 1–13. Channel 14 (Japan only) is at 2484 MHz, an exception to the rule.'
    }
  ],
  examples: [
    {
      title: 'Do channels 6 and 9 overlap?',
      q: 'Your router is on channel 6 and a neighbour chose channel 9. Both signals are about 20 MHz wide. Do they overlap?',
      steps: ['Channel 6 is centred on $2407 + 5 \\times 6 = 2437$ MHz and channel 9 on $2407 + 5 \\times 9 = 2452$ MHz.', 'The centres are $2452 - 2437 = 15$ MHz apart.', 'Two signals 20 MHz wide need centres at least 20 MHz apart to stay clear, and 15 is less than 20.'],
      a: 'Yes. They overlap by about 5 MHz, so each looks like noise to the other. Channels 6 and 11 are 25 MHz apart and do not.'
    }
  ],
  quiz: [
    { q: 'Your router is set to channel 3. Which neighbouring networks does it disturb most?', choices: ['Only those on channel 3', 'Those on channels 1 and 6 as well', 'None: channels never interfere', 'Only networks in the 5 GHz band'], a: 1, why: 'A 20 MHz wide signal on channel 3 (2422 MHz) spans channels 1 to 5, so it overlaps networks on 1 and 6 as well as on 3. This is why 1, 6 and 11 are the usual choices.' },
    { q: 'Which chip of the family can join a 5 GHz network?', choices: ['ESP32-S3', 'ESP32-C6', 'ESP32-C5', 'ESP32-C3'], a: 2, why: 'The ESP32-C5 is the only microcontroller of the family with a 5 GHz radio. The C6 has Wi-Fi 6 but only on 2.4 GHz.' },
    { q: 'A router label says 150 Mbit/s, so an ESP32 can download a file at about 150 Mbit/s.', a: false, why: 'That is the best-case PHY rate with 40 MHz channels. Wi-Fi is half-duplex, shares airtime with neighbours and adds overheads, so real data rates are a fraction of it, often 10 to 30 Mbit/s on an ESP32.' },
    { q: 'What does the access point put in a beacon?', choices: ['The network password', 'The network name, channel, security type and supported rates', 'The IP addresses of all stations', 'Nothing: stations must guess the settings'], a: 1, why: 'Beacons are public advertisements. The password is never sent: it is only proved later, in the four-way handshake ([[wifi-station]]).' }
  ],
  applications: [
    'Every ESP project that reports to a cloud service or serves a web page: it is a station on the home router.',
    'A phone or laptop reaching a device that is itself the access point, as in set-up portals ([[soft-ap-and-captive-portal]]).',
    'Choosing a channel for a house with many neighbours: the humps in the simulation are what a phone\'s Wi-Fi analyser shows ([[wifi-and-ble-analysers]]).',
    'Firmware updates over the air, which need a reliable link for a few minutes ([[ota-updates]]).'
  ],
  sources: [
    'IEEE Std 802.11 (the 2020 revision with its amendments, including 802.11n and 802.11ax): channels, beacon frames, medium access.',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the operating modes of the radio and its supported protocols.',
    'Espressif, datasheets of the ESP32, ESP32-C3, ESP32-C6 and ESP32-C5: the Wi-Fi feature lists.'
  ],
  sim: 'wf-band'
},

/* ================================================================ connecting as a station */
{
  id: 'wifi-station',
  parent: 'wifi',
  title: 'Connecting as a station',
  level: 1,
  short: 'The commonest role: join a network that already exists and get an address on it. What happens between the call and the connection, what the status values mean at each step, and the four things that must be right.',
  keywords: ['station', 'WiFi.begin', 'WiFi.status', 'WL_CONNECTED', 'wlan.connect', 'isconnected', 'hostname', 'STA mode', 'connect to router', 'association', 'four-way handshake', 'DHCP', 'status codes', 'setHostname'],
  prereq: ['wifi-basics', 'first-program-blink'],
  related: ['wifi-events-and-reconnection', 'wifi-troubleshooting', 'ip-addresses-dhcp-dns', 'credentials-handling', 'fast-wifi-reconnect', 'brownout'],
  body: `A station is the simplest and most common role: the ESP joins a network that already exists and gets an address on it. Four things must be right: the **name**, the **password**, the **band** (2.4 GHz, unless the chip is an ESP32-C5) and a **power supply** that survives the radio starting.

### What happens after the call

\`WiFi.begin()\` in Arduino and \`wlan.connect()\` in MicroPython return at once. The chip then works through a chain on its own, shown step by step in the simulation below:

1. **Scan** for the network name, to find its channel and access point.
2. **Authenticate**, then **associate**: a short exchange that gives the station a place in the network.
3. **Four-way handshake**: both sides use the password to derive the same keys, and prove it to each other, without the password ever crossing the air.
4. **DHCP**: the station asks for an IP address and the router offers one ([[ip-addresses-dhcp-dns]]).

Joining takes one to a few seconds; a program that needs the network must wait for it, with a time limit, or react to events ([[wifi-events-and-reconnection]]).

### What the status says

The status value tells a program how far the chain got. The Arduino values: **0** (WL_IDLE_STATUS) the link is up but no address yet, **1** (WL_NO_SSID_AVAIL) the network was not found, **3** (WL_CONNECTED) joined *and* holding an IP address, **4** (WL_CONNECT_FAILED) the join was refused, **5** (WL_CONNECTION_LOST), **6** (WL_DISCONNECTED) not connected, which includes "still trying". MicroPython returns 1000 (idle), 1001 (connecting) and 1010 (got an IP address), or the ESP-IDF reason of the failure: 201 network not found, 202 authentication failed. A wrong password does not always show as "wrong password": read the reason from the disconnect event instead ([[wifi-troubleshooting]]).

### Habits that save trouble

- **Set the hostname first**: before \`begin()\` in Arduino, with \`network.hostname()\` in MicroPython. It is what the router's client list shows.
- **Keep the password out of the code** you share ([[credentials-handling]]) and out of the firmware for a product ([[wifi-provisioning]]).
- **Feed the radio.** Transmitting draws 240 to 410 mA on the chips of the family: a thin USB cable or a weak regulator resets the board just as it connects ([[brownout]], [[current-peaks-and-capacitors]]).
- **Do not rejoin by hand more than you must**: the stack can retry by itself, and a deep-sleep device can skip the scan ([[fast-wifi-reconnect]]).

> [!key] Joining is a chain: scan, authenticate, associate, four-way handshake, DHCP. The call returns at once, so wait with a time limit; "connected" means joined and holding an IP address, and the reason code, not the status, tells you why it failed.`,
  ideas: [
    'WiFi.begin and wlan.connect return at once: the chip scans, authenticates, associates, runs the four-way handshake and asks DHCP for an address in the background.',
    'A program waits for the connection with a time limit, or reacts to events.',
    'WL_CONNECTED (Arduino) or STAT_GOT_IP (MicroPython) mean joined and holding an IP address; status 0 means linked but not yet addressed.',
    'Name, password, band and a supply that survives 400 mA bursts are the four things to check first.'
  ],
  pitfalls: [
    'After WiFi.begin() the next line can use the network — The call returns before anything has happened. Wait for the status, with a time limit, or use an event.',
    'The status will tell me when the password is wrong — Not reliably. A wrong WPA2 password often shows only as "not connected" (6) while the disconnect reason says 15 or 202. Print the reason.',
    'If it connects on the bench it will connect everywhere — The signal, the band and the supply differ in the field. Test where the device will live.'
  ],
  terms: [
    { term: 'Association', also: ['authentication and association'], def: 'The short exchange by which a station gets a place in an access point\'s network: it announces itself, the access point accepts it and assigns it an identifier.' },
    { term: 'Four-way handshake', also: ['4-way handshake', 'EAPOL handshake'], def: 'Four frames in which a station and an access point show each other that they know the password and derive the session keys from it, without sending it. A wrong password fails here.' },
    { term: 'Hostname', also: ['DHCP hostname', 'device name'], def: 'The name a device gives itself on the network. It is sent to the DHCP server and shown in the router\'s list of clients, and it is the name mDNS announces ([[mdns]]).' },
    { term: 'Status code', also: ['WL_CONNECTED', 'STAT_GOT_IP'], def: 'A number a program reads to learn how far the connection got. Arduino calls it the status (WL_ constants); MicroPython returns STAT_ values or an ESP-IDF reason code.' },
    { term: 'Auto-reconnect', also: ['reconnect'], def: 'The stack retrying the join by itself after the link drops. The Arduino core can do it (setAutoReconnect) and MicroPython does it by default, without limit.' }
  ],
  choose: {
    good: ['Plain station mode with DHCP for almost every device on a home or office network', 'A fixed address reserved in the router (instead of a static address in the code)', 'Waiting with a timeout, then falling back to a set-up portal or sleep'],
    avoid: ['Waiting for ever in setup() with no timeout', 'Hard-coding the network name and password in firmware you ship', 'Powering a board from a long thin USB lead and expecting stable Wi-Fi'],
    check: ['That the network is 2.4 GHz (unless the chip is an ESP32-C5)', 'The status and the disconnect reason, not just "it does not connect"', 'The supply voltage while the radio transmits']
  },
  code: [
    {
      title: 'Join a network and say how it went',
      about: 'Names the device, joins with a 15 second limit, and prints the status in words, then the address and the signal strength.',
      needs: 'Any ESP32-family board with Wi-Fi, a 2.4 GHz network, and the serial monitor at 115200 baud. Do not leave the real name and password in code you share ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          set hostname [esp32-demo] :: wifi
          connect to Wi-Fi [your-ssid] password [your-password]
          set [t0 v] to (milliseconds since start)
          repeat until <<Wi-Fi connected?> or <((milliseconds since start) - (t0)) > (15000)>>
            wait (0.25) seconds
            print [.]
          end
          print (join [status: ] (Wi-Fi status text))
          if <Wi-Fi connected?> then
            print (join [IP ] (IP address))
            print (join [RSSI dBm: ] (signal strength))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        const char *statusName(wl_status_t s) {
          switch (s) {
            case WL_IDLE_STATUS:     return "linked, no address yet";
            case WL_NO_SSID_AVAIL:   return "network not found";
            case WL_CONNECTED:       return "connected";
            case WL_CONNECT_FAILED:  return "join refused";
            case WL_CONNECTION_LOST: return "connection lost";
            case WL_DISCONNECTED:    return "not connected";
            default:                 return "unknown";
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.setHostname("esp32-demo");        // before begin()
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);                // returns at once
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) {
            delay(250);
            Serial.print('.');
          }
          Serial.printf("\nstatus: %s\n", statusName(WiFi.status()));
          if (WiFi.status() == WL_CONNECTED) {
            Serial.printf("IP %s\n", WiFi.localIP().toString().c_str());
            Serial.printf("RSSI dBm: %d\n", WiFi.RSSI());
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time

        SSID = "your-ssid"
        PASS = "your-password"

        NAMES = {
            network.STAT_IDLE: "idle",
            network.STAT_CONNECTING: "still connecting",
            network.STAT_GOT_IP: "connected",
            network.STAT_NO_AP_FOUND: "network not found",
            network.STAT_WRONG_PASSWORD: "join refused",
        }

        network.hostname("esp32-demo")                   # before connecting
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)                         # returns at once
        t0 = time.ticks_ms()
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 15000:
            time.sleep_ms(250)
            print(".", end="")
        print("\nstatus:", NAMES.get(wlan.status(), wlan.status()))
        if wlan.isconnected():
            print("IP", wlan.ipconfig("addr4")[0])
            print("RSSI dBm:", wlan.status("rssi"))
      `,
      output: `
        ......
        status: connected
        IP 192.168.1.57
        RSSI dBm: -58
      `,
      notes: ['In core 3.3 the Arduino status is 0 (linked, no address yet) between the end of the handshake and the DHCP answer, and 3 only once an address is held.', 'MicroPython keeps retrying after a failure unless you limit it with wlan.config(reconnects=n); the Arduino core retries once by itself and then follows setAutoReconnect.']
    }
  ],
  quiz: [
    { q: 'Right after `WiFi.begin()` returns, the program calls a function that needs the internet. What goes wrong?', choices: ['Nothing: begin() waits until connected', 'The connection has not been made yet, so the call fails', 'The ESP restarts', 'The password is checked twice'], a: 1, why: 'begin() only starts the join. The scan, handshake and DHCP take a second or more, so the program must wait for WL_CONNECTED (with a time limit) or for the got-IP event.' },
    { q: 'In which step of the join does a wrong WPA2 password make it fail?', choices: ['The scan', 'The four-way handshake', 'The DHCP request', 'The beacon'], a: 1, why: 'Both sides must derive the same keys from the password. With the wrong one the handshake messages are rejected and the join times out.' },
    { q: 'MicroPython `wlan.status()` returns 1010. What does it mean?', choices: ['Network not found', 'Wrong password', 'Connected and holding an IP address', 'Still connecting'], a: 2, why: 'STAT_GOT_IP is 1010. STAT_IDLE is 1000 and STAT_CONNECTING 1001; failures return the ESP-IDF reason, such as 201 (network not found) or 202 (authentication failed).' },
    { q: 'The hostname can be changed after the connection is up and the router will show the new name at once.', a: false, why: 'The hostname is sent in the DHCP request, so it must be set before connecting (before begin() in Arduino, before connect() in MicroPython).' }
  ],
  applications: [
    'Every sensor, switch or display that reports to a home server, MQTT broker or cloud service.',
    'Devices that serve a web page on the local network ([[web-server-on-esp]]).',
    'Over-the-air updates and time synchronisation, which both need a station connection first ([[ota-updates]], [[ntp-and-time]]).'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *Wi-Fi API* (STA class): begin, status, hostname (core 3.3).',
    'MicroPython documentation, *network.WLAN*: connect, isconnected, status, ipconfig (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the station connection scenario and its events.'
  ],
  sim: 'wf-join'
},

/* ================================================================ events and reconnection */
{
  id: 'wifi-events-and-reconnection',
  parent: 'wifi',
  title: 'Events and reconnection',
  level: 2,
  short: 'Joining is not a single moment, and neither is losing the network. The events the Wi-Fi stack raises, the reason codes that say why a link dropped, and a reconnection that backs off instead of hammering the router.',
  keywords: ['Wi-Fi events', 'onEvent', 'ARDUINO_EVENT_WIFI_STA_GOT_IP', 'ARDUINO_EVENT_WIFI_STA_DISCONNECTED', 'reason code', 'reconnect', 'back-off', 'exponential back-off', 'jitter', 'setAutoReconnect', 'reconnects', 'beacon timeout', 'connection manager'],
  prereq: ['wifi-station', 'non-blocking-timing'],
  related: ['connection-manager-machine', 'what-a-state-machine-is', 'fast-wifi-reconnect', 'wifi-troubleshooting', 'tasks', 'timeouts-and-timed-states'],
  body: `Routers reboot, people unplug them, a microwave oven runs, the ESP is carried to another room. A device that works on the bench and must work for years needs a plan for the moment the network goes away, and for the moment it returns.

### Events

The Wi-Fi stack reports what happens as **events**. In Arduino you register a function with \`WiFi.onEvent\`; the ones that matter are the station events: \`ARDUINO_EVENT_WIFI_STA_START\`, \`..._STA_CONNECTED\` (the link is up), \`..._STA_GOT_IP\` (an address has arrived: now the network is usable), \`..._STA_DISCONNECTED\` and \`..._STA_LOST_IP\`. The names are the core 3.x ones; the old \`SYSTEM_EVENT_STA_GOT_IP\` family is gone. Two rules: the handler runs in another task, so it must be short and must not call \`WiFi.onEvent\` itself; and the best use is to set a flag or notify a task, and let the main loop do the work ([[task-notifications-and-event-groups]]).

MicroPython has no event callbacks for Wi-Fi: the program polls \`wlan.isconnected()\` and \`wlan.status()\`.

### Why did it drop?

The disconnect event carries a **reason code**, which is the best clue there is:

| Reason | Name | Usually means |
|---|---|---|
| 2 | AUTH_EXPIRE | the authentication timed out |
| 8 | ASSOC_LEAVE | the station left on purpose (your own disconnect call); the core does not retry after it |
| 15 | 4WAY_HANDSHAKE_TIMEOUT | usually a wrong password (WPA2) |
| 200 | BEACON_TIMEOUT | the router vanished: power cut, out of range, rebooting |
| 201 | NO_AP_FOUND | the network is not visible: wrong name, 5 GHz only, too far |
| 202 | AUTH_FAIL | authentication failed: often a wrong password |

### Retry, but not like a machine gun

With auto-reconnect on, the stack retries at once and for ever. That is fine for a flicker, and bad for a router that needs ninety seconds to boot: the device scans again and again, drawing 100 mA with the radio on and flooding a router that is not ready. Worse, forty devices that lost power together all retry together.

The usual cure is **exponential back-off**: wait 1 s, then 2, 4, 8 … up to a cap such as 60 s, start again from 1 s after a success, and add **jitter**, a random part, so that devices spread out. The simulation shows the radio's duty cycle fall and the pile-up of a crowd flatten. After a very long outage a device can restart itself or open its set-up portal ([[connection-manager-machine]]). And "connected" is not "working": the router can be up with its internet link down, so check an end-to-end thing, such as a ping to your server.

> [!key] Events say when the link comes and goes, and the disconnect reason says why. Turn auto-reconnect over to a back-off with jitter, so that a router that is down is not hammered and a crowd of devices does not retry in step.`,
  ideas: [
    'The stack raises events: connected, got IP, disconnected (with a reason code), lost IP. The got-IP event is when the network becomes usable.',
    'Event handlers run in another task, so they set a flag or notify, and the main loop acts.',
    'The reason code of a disconnect, such as 15, 200 or 201, tells why the link was lost.',
    'Back off exponentially with a cap and a little randomness; reset the delay on success.'
  ],
  pitfalls: [
    'Auto-reconnect handles everything — It retries blindly and for ever. It neither waits for a slow router nor spreads out a crowd, and it cannot tell that the internet, rather than the Wi-Fi, is down.',
    'I can do the reconnection inside the event handler — The handler runs in the Wi-Fi task. Blocking in it, or calling WiFi.onEvent from it, causes stalls. Set a flag and act in loop().',
    '"Connected" means the internet works — It means the link and an IP address exist. Check the real service, with a timeout.'
  ],
  terms: [
    { term: 'Wi-Fi event', also: ['STA_GOT_IP', 'STA_DISCONNECTED'], def: 'A message from the Wi-Fi stack that something happened: the station started, joined, got an address, lost the link. A program registers a function to be called for each.' },
    { term: 'Reason code', also: ['disconnect reason', 'WIFI_REASON'], def: 'A number delivered with the disconnect event that says why the link ended: for example 15 handshake timeout, 200 beacon timeout, 201 network not found.' },
    { term: 'Exponential back-off', also: ['back-off', 'retry delay'], def: 'Waiting longer after each failed attempt, by doubling the delay up to a cap, so that a service that is down is not flooded with retries.' },
    { term: 'Jitter', also: ['random delay'], def: 'A random part added to a retry delay so that many devices which failed together do not all retry at the same instant.' },
    { term: 'Callback', also: ['handler', 'event handler'], def: 'A function you give to the system to be called when something happens. Wi-Fi callbacks run in another task, so they must be short.' }
  ],
  choose: {
    good: ['Back-off with a cap and jitter for anything installed in the field', 'A flag set in the handler and acted on in loop() or a task', 'A health check against the real service, not only the link'],
    avoid: ['Unlimited immediate retries', 'Long or blocking code in an event handler', 'Restarting the ESP at the first failed attempt'],
    check: ['What the device should do after a long outage: sleep, restart, or open a set-up portal', 'The reason codes your router produces, by switching it off and by changing the password', 'How the first connection after power-up differs from a later reconnection']
  },
  code: [
    {
      title: 'Reconnect with back-off',
      about: 'The stack\'s own retries are switched off. The program waits for the connection, and when it is lost retries after 1, 2, 4 … 60 seconds, each wait stretched by up to 50 % at random, and starts again from 1 second after a success.',
      needs: 'Any ESP32-family board with Wi-Fi and a 2.4 GHz network; switch the router off for a minute to watch it work.',
      blocks: `
        when started
          start serial at (115200) baud
          set [wait v] to (1000)
          connect to Wi-Fi [your-ssid] password [your-password]
          set [next v] to ((milliseconds since start) + (10000))
        forever
          if <<not <Wi-Fi connected?>> and <(milliseconds since start) ≥ (next)>> then
            print (join [retrying, then waiting ] (wait))
            connect to Wi-Fi [your-ssid] password [your-password]
            set [next v] to ((milliseconds since start) + (8000) + (random ((wait) / (2)) to (wait)))
            set [wait v] to (min ((wait) * (2)) (60000))
          end
        end

        when Wi-Fi connects
          set [wait v] to (1000)
          print (join [up, IP ] (IP address))
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        volatile bool linkUp = false;      // set by the event task, read by loop()
        uint32_t waitMs = 1000;            // the current back-off
        uint32_t nextTry = 0;

        void onGotIp(WiFiEvent_t event, WiFiEventInfo_t info) {
          linkUp = true;
          waitMs = 1000;                   // success: start the back-off again
        }

        void onLost(WiFiEvent_t event, WiFiEventInfo_t info) {
          linkUp = false;
          Serial.printf("lost, reason %d\n", info.wifi_sta_disconnected.reason);
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.setAutoReconnect(false);    // we decide when to retry
          WiFi.onEvent(onGotIp, ARDUINO_EVENT_WIFI_STA_GOT_IP);
          WiFi.onEvent(onLost, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
          WiFi.begin(SSID, PASS);
          nextTry = millis() + 10000;      // the first attempt gets ten seconds
        }

        void loop() {
          if (!linkUp && (int32_t)(millis() - nextTry) >= 0) {
            Serial.printf("retrying, then waiting %lu ms\n", (unsigned long)waitMs);
            WiFi.disconnect();
            WiFi.begin(SSID, PASS);
            nextTry = millis() + 8000 + waitMs / 2 + random(waitMs / 2 + 1);   // attempt time + jittered wait
            waitMs = (waitMs * 2 > 60000) ? 60000 : waitMs * 2;
          }
        }
      `,
      py: String.raw`
        import network, time, random

        SSID = "your-ssid"
        PASS = "your-password"

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.config(reconnects=0)                    # no retries of its own: we decide
        wait_ms = 1000                               # the current back-off
        wlan.connect(SSID, PASS)
        next_try = time.ticks_add(time.ticks_ms(), 10000)   # the first attempt gets ten seconds
        was_up = False

        while True:
            up = wlan.isconnected()                  # MicroPython has no events: poll
            if up and not was_up:
                wait_ms = 1000                       # success: start the back-off again
                print("up, IP", wlan.ipconfig("addr4")[0])
            if was_up and not up:
                print("lost, status", wlan.status())
            was_up = up
            if not up and time.ticks_diff(time.ticks_ms(), next_try) >= 0:
                print("retrying, then waiting", wait_ms, "ms")
                wlan.disconnect()
                wlan.connect(SSID, PASS)
                jitter = random.randint(wait_ms // 2, wait_ms)
                next_try = time.ticks_add(time.ticks_ms(), 8000 + jitter)   # attempt time + jittered wait
                wait_ms = min(wait_ms * 2, 60000)
            time.sleep_ms(100)
      `,
      output: `
        up, IP 192.168.1.57
        lost, reason 200
        retrying, then waiting 1000 ms
        retrying, then waiting 2000 ms
        retrying, then waiting 4000 ms
        up, IP 192.168.1.57
      `,
      notes: ['The Arduino core makes one retry of its own after the very first failed connection, whatever setAutoReconnect says.', 'A pause longer than the cap (60 s here) is a sign to restart, or to open a set-up portal ([[connection-manager-machine]]).', 'The programs do not check that the internet works, only the link: add a request to your own server if that matters.']
    }
  ],
  quiz: [
    { q: 'A disconnect event arrives with reason 200 (beacon timeout). What is the most likely cause?', choices: ['The password is wrong', 'The router stopped being heard: power cut, rebooting or out of range', 'The hostname is too long', 'The ESP ran out of memory'], a: 1, why: 'The station stopped receiving the access point\'s beacons. A wrong password shows as reason 15 or 202 during the join, never as a beacon timeout of a link that worked.' },
    { q: 'Why add a random jitter to the retry delay?', choices: ['To save memory', 'So that many devices that lost the network together do not all retry at the same instant', 'The Wi-Fi standard requires it', 'To make the delay shorter'], a: 1, why: 'After a power cut forty devices would all wake and retry at 1 s, 2 s, 4 s … in lock-step, a burst the rebooting router cannot serve. Randomness spreads them out.' },
    { q: 'Where should the reconnection logic of a sketch live?', choices: ['Inside the disconnect event handler, with delay() calls', 'In loop() or a task, with the handler only setting a flag', 'In an interrupt handler', 'In setup()'], a: 1, why: 'The event handler runs in the Wi-Fi task and must return quickly. Setting a flag and acting elsewhere keeps the stack responsive.' },
    { q: 'MicroPython calls a function you register when the Wi-Fi link drops.', a: false, why: 'The MicroPython network module has no Wi-Fi event callbacks. A program polls isconnected() and status() in its loop, as the example does.' }
  ],
  applications: [
    'Sensors in a loft or garage that must recover on their own after a power cut or a router reboot.',
    'Battery devices where every needless scan costs charge: back-off keeps the radio off ([[wifi-power-save-and-dtim]]).',
    'A connection manager that walks a state machine: connecting, connected, waiting, set-up portal ([[connection-manager-machine]]).',
    'Fleets of identical devices, where jitter keeps them from retrying in step after a power cut ([[fleet-monitoring]]).'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *Wi-Fi API*: events, WiFi.onEvent, setAutoReconnect (core 3.3).',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the Wi-Fi event descriptions and the table of reason codes.',
    'MicroPython documentation, *network.WLAN*: status values and the reconnects setting (version 1.29).'
  ],
  sim: 'wf-reconnect'
},

/* ================================================================ soft access point and captive portal */
{
  id: 'soft-ap-and-captive-portal',
  parent: 'wifi',
  title: 'Soft access point and captive portal',
  level: 2,
  short: 'Make the ESP itself the access point: it broadcasts a network, hands out addresses and serves a page. Add a catch-all DNS answer and phones pop the page up by themselves, which is how a device with no screen gets set up.',
  keywords: ['soft AP', 'softAP', 'access point mode', 'WIFI_AP', 'AP+STA', 'captive portal', 'WiFiManager', 'DNSServer', 'catch-all DNS', 'generate_204', 'hotspot-detect', '192.168.4.1', 'sign in to network', 'set-up portal'],
  prereq: ['wifi-station', 'ip-addresses-dhcp-dns'],
  related: ['wifi-provisioning', 'web-server-on-esp', 'secure-provisioning', 'wifi-troubleshooting', 'esp-now-with-wifi', 'sockets'],
  body: `A **soft access point** (soft-AP) makes the ESP itself an access point: it broadcasts a network name, lets phones and laptops join and gives them addresses. No router is needed. It is how a device with no screen, in a place with no known network, can be set up, and how two things talk when the building has no Wi-Fi.

### What a soft AP gives

- **A network of its own**: a name, an optional password (at least 8 characters, or an open network), a channel, and a limit on clients, four by default.
- **An address for itself**: 192.168.4.1 by default, with a built-in DHCP server handing out 192.168.4.2 and up ([[ip-addresses-dhcp-dns]]).
- **No internet.** A phone on the soft AP can reach the ESP and nothing else, unless the program forwards packets, which small chips do slowly.
- **One radio.** In AP+STA mode (soft AP and station together) both must share a channel, so the AP follows the router's channel, and phones drop if the router changes it. The first simulation below shows the three modes.

### The captive portal

When a phone joins a network it checks, in the background, whether the internet is really there: it fetches a small page from a well-known address and expects an exact answer (Android an empty reply with status 204, Apple a page saying "Success"; Windows and Linux have their own). If the answer is anything else, the phone concludes that a sign-in page is in the way and opens a browser by itself. Hotels and cafes use this; a device can use it on purpose:

1. answer **every DNS question** with its own address (a catch-all DNS), so the check reaches the ESP;
2. answer every web request that is not its page with a **redirect** to the page.

The second simulation walks through it. Things go wrong: phones with private (encrypted) DNS ignore the catch-all, so type 192.168.4.1 by hand; some phones prefer mobile data on a network with no internet; and the check is plain HTTP, so an HTTPS address typed by hand shows a certificate warning that cannot be avoided.

### Safety

An open soft AP can be joined, and its traffic read, by anyone in range. Use one only briefly, for set-up; give it a password printed on the device; shut it down when the job is done ([[secure-provisioning]]).

> [!key] A soft AP turns the ESP into a small network with itself at 192.168.4.1. A catch-all DNS and a redirect make phones open its page automatically, a captive portal; keep such a portal short-lived and, where you can, password-protected.`,
  ideas: [
    'A soft AP is a network run by the ESP itself, at 192.168.4.1 by default, with its own DHCP server and no route to the internet.',
    'In AP+STA mode the radio is shared, so the soft AP is moved to the channel of the router the station joined.',
    'Phones test for internet access with a known address; a catch-all DNS and a redirect make that test fail on purpose and pop the device\'s page up.',
    'An open set-up access point is readable by anyone in range: keep it short-lived or password-protected.'
  ],
  pitfalls: [
    'A phone on the ESP\'s network can use the internet through it — Not unless the program forwards packets (NAT), which is slow on a microcontroller. By default the phone reaches only the ESP.',
    'AP and station mode can use different channels — There is one radio. The soft AP follows the station\'s channel, and the clients drop when the router changes channel.',
    'The portal page will always open by itself — Phones with encrypted DNS, a mobile-data preference or an old browser skip it. Always print the address (192.168.4.1) too.'
  ],
  terms: [
    { term: 'Soft access point', also: ['soft-AP', 'softAP', 'AP mode', 'WIFI_AP'], def: 'A mode in which the ESP is itself the access point of a small Wi-Fi network: it broadcasts an SSID, lets stations join and runs a DHCP server for them.' },
    { term: 'AP+STA mode', also: ['WIFI_AP_STA', 'dual mode'], def: 'The soft access point and the station running at the same time. They share one radio, so both use the router\'s channel.' },
    { term: 'Captive portal', also: ['sign-in page', 'splash page'], def: 'A web page that a network forces new clients to see first, as in hotels. The phone detects it by a failed internet check and opens a browser.' },
    { term: 'Captive portal detection', also: ['connectivity check', 'generate_204'], def: 'The background request a phone makes after joining a network, to a known address with a known answer, to find out whether a sign-in page is in the way.' },
    { term: 'Catch-all DNS', also: ['wildcard DNS', 'DNS hijack'], def: 'A DNS server that answers every name with the same address, here its own. Used so that a phone\'s connectivity check reaches the device\'s web server.' }
  ],
  choose: {
    good: ['First-time set-up of a device that has no screen ([[wifi-provisioning]])', 'A direct link from a phone to a device where there is no router: a field logger, a workshop tool', 'A fallback: if the saved network is missing for good, open the portal again'],
    avoid: ['Carrying other people\'s internet traffic: a microcontroller makes a poor router', 'More than a handful of clients', 'Leaving an open access point running after set-up'],
    check: ['That the page also works when typed as http://192.168.4.1 by hand', 'What happens when the router\'s channel changes while the AP is up', 'That the AP password, if any, is not the one every device ships with']
  },
  code: [
    {
      title: 'A soft access point with a captive portal',
      about: 'Opens a network called "device-setup" with a catch-all DNS, and serves one page. Any other address a phone asks for is redirected to it, so the phone opens the page by itself.',
      needs: 'Any ESP32-family board with Wi-Fi. Join "device-setup" from a phone. An open network is for a short set-up only: give the AP a password for anything longer ([[secure-provisioning]]).',
      blocks: `
        when started
          start serial at (115200) baud
          start access point [device-setup]
          start DNS that answers every name with (IP address of the access point) :: net
          start web server on port (80)
          print (join [access point at ] (IP address of the access point))
        forever
          handle web requests :: net
        end

        when request for [/] arrives
          respond with [<h1>Hello from the ESP</h1>] :: net

        when request for [any other address] arrives
          redirect to [http://192.168.4.1/] :: net
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>
        #include <DNSServer.h>

        const char *AP_NAME = "device-setup";

        WebServer server(80);
        DNSServer dns;

        void showPage() {
          server.send(200, "text/html", "<h1>Hello from the ESP</h1><p>You are on its own network.</p>");
        }

        void redirect() {                      // /generate_204, /hotspot-detect.html, anything else
          server.sendHeader("Location", "http://192.168.4.1/");
          server.send(302, "text/plain", "");
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_AP);
          WiFi.softAP(AP_NAME);                // no password: for a short set-up only
          dns.start(53, "*", WiFi.softAPIP()); // every name resolves to the ESP itself
          server.on("/", showPage);
          server.onNotFound(redirect);
          server.begin();
          Serial.printf("access point %s at %s\n", AP_NAME, WiFi.softAPIP().toString().c_str());
        }

        void loop() {
          server.handleClient();               // the DNS server answers by itself, in the background
        }
      `,
      py: String.raw`
        import network, socket

        AP_NAME = "device-setup"
        IP = "192.168.4.1"
        PAGE = b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hello from the ESP</h1><p>You are on its own network.</p>"
        REDIRECT = b"HTTP/1.0 302 Found\r\nLocation: http://192.168.4.1/\r\n\r\n"

        ap = network.WLAN(network.WLAN.IF_AP)
        ap.config(ssid=AP_NAME, security=network.WLAN.SEC_OPEN)   # no password: for a short set-up only
        ap.active(True)
        print("access point", AP_NAME, "at", IP)

        web = socket.socket()
        web.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        web.bind(("0.0.0.0", 80))
        web.listen(2)
        web.settimeout(0.2)
        dns = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        dns.bind(("0.0.0.0", 53))
        dns.settimeout(0.2)

        def dns_answer(q):               # copy the question and add one answer: this name is at our IP
            end = 12
            while q[end] != 0:
                end += q[end] + 1
            question = q[12:end + 5]
            answer = b"\xc0\x0c\x00\x01\x00\x01\x00\x00\x00\x3c\x00\x04" + bytes(int(p) for p in IP.split("."))
            return q[:2] + b"\x81\x80\x00\x01\x00\x01\x00\x00\x00\x00" + question + answer

        while True:
            try:
                q, who = dns.recvfrom(512)
                dns.sendto(dns_answer(q), who)
            except OSError:
                pass
            try:
                client, _ = web.accept()
                request = client.recv(1024)
                client.send(PAGE if request.startswith(b"GET / ") else REDIRECT)
                client.close()
            except OSError:
                pass
      `,
      output: `
        access point device-setup at 192.168.4.1
      `,
      notes: ['In core 3.3 the DNSServer answers by itself, from an asynchronous callback: the old processNextRequest() call does nothing any more, so loop() only serves the web page.', 'The MicroPython version answers one DNS question and one web request per turn with 0.2 s time-outs; it is a teaching sketch, not a production server.', 'Newer cores can also announce the portal address in the DHCP reply (RFC 8910), which modern phones prefer to the guess-and-redirect trick.']
    }
  ],
  quiz: [
    { q: 'A phone joins your soft AP and pops up a sign-in page by itself. What made it do that?', choices: ['The ESP sent a notification', 'Its internet check was answered by the ESP instead of the real server, so it assumed a sign-in page was in the way', 'The password was wrong', 'Phones always open 192.168.4.1'], a: 1, why: 'The phone fetches a known address and expects a known answer. The catch-all DNS and the redirect send that request to the ESP, the answer is wrong, and the phone opens a browser to let the user "sign in".' },
    { q: 'The ESP runs a soft AP and is also a station on the home router. Which statement is true?', choices: ['They can use different channels', 'The soft AP uses the station\'s channel, because there is one radio', 'The station is switched off while the AP runs', 'The phone gets internet through the AP automatically'], a: 1, why: 'One radio can listen on only one channel, so the soft AP is moved to the channel of the router the station joined. Nothing is forwarded unless the program does it.' },
    { q: 'A phone with "private DNS" enabled does not open the portal by itself. What is the cure?', choices: ['Use a longer password', 'Type http://192.168.4.1 in a browser', 'Restart the router', 'Change the SSID'], a: 1, why: 'Encrypted DNS bypasses the catch-all answers, so the connectivity check never reaches the ESP. The page itself still works at its address.' },
    { q: 'An open soft AP is fine to leave running after the set-up is done.', a: false, why: 'Anyone in range can join it and read its unencrypted traffic. Close the AP when the job is done, and give it a password where it must stay up.' }
  ],
  applications: [
    'The set-up page of countless smart plugs, bulbs and sensors: join its network, enter your Wi-Fi, done ([[wifi-provisioning]]).',
    'A phone-to-device link in a field with no router: a data logger that serves its files to a phone.',
    'A local control panel for a project at a workshop or an exhibition stand ([[web-server-on-esp]]).',
    'ESP-NOW devices that also need a web interface, with the channel constraint in mind ([[esp-now-with-wifi]]).'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *Wi-Fi API* (AP class) and the DNSServer captive-portal example (core 3.3).',
    'MicroPython documentation, *network.WLAN*: access point configuration and the SEC_* constants (version 1.29).',
    'IETF RFC 8910, *Captive-Portal Identification in DHCP and Router Advertisements*; and Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver" (AP and AP+STA modes).'
  ],
  sim: ['wf-modes', 'wf-portal']
},

/* ================================================================ provisioning */
{
  id: 'wifi-provisioning',
  parent: 'wifi',
  title: 'Provisioning: getting the credentials in',
  level: 2,
  short: 'A finished device must learn the name and password of a network it has never seen, without recompiling. The five usual ways, soft AP portal, Bluetooth LE, SmartConfig, Improv and WPS, with their trade-offs, and a program for the simplest.',
  keywords: ['provisioning', 'WiFiManager', 'captive portal', 'BLE provisioning', 'ESP BLE Provisioning app', 'WiFiProv', 'SmartConfig', 'ESP-TOUCH', 'Improv Wi-Fi', 'WPS', 'Preferences', 'NVS', 'credentials', 'set up Wi-Fi without recompiling', 'proof of possession'],
  prereq: ['soft-ap-and-captive-portal', 'nvs-and-preferences'],
  related: ['secure-provisioning', 'credentials-handling', 'device-identity-and-provisioning', 'matter-commissioning', 'web-flashing', 'device-configuration'],
  body: `A device you flash at your desk can carry your Wi-Fi name and password in its code. A device you give to someone else cannot: every home has a different network, and a password in firmware is a password in every copy. **Provisioning** is how the credentials reach a finished device, so that it can be set up, and moved, without recompiling.

### The usual ways

| Method | How it works | For | Against |
|---|---|---|---|
| **Soft AP and captive portal** (WiFiManager style) | The device opens its own network; the phone joins it and a page asks for the name and password | Any phone, no app | The phone must leave its network; plain HTTP; an open network is exposed |
| **Bluetooth LE provisioning** (Espressif's app, the WiFiProv library) | The phone talks to the device over Bluetooth LE; the credentials are encrypted with a shared secret, the *proof of possession* | The phone stays on its Wi-Fi; encrypted; can list networks | Needs the app and Bluetooth LE (not the ESP32-S2) and some code space |
| **SmartConfig** (ESP-TOUCH) | A phone app encodes the credentials in the lengths of broadcast Wi-Fi frames, which the device overhears | No network switching | Depends on the router passing the frames; 2.4 GHz only; little protection |
| **Improv** (serial or Bluetooth LE) | An open standard: a web page or app sends the credentials over a USB cable or Bluetooth LE | Flash and provision from one web page | Needs a cable or Bluetooth LE, and firmware that speaks Improv |
| **WPS** | Press a button on the router, or enter a PIN | No typing | The PIN mode can be guessed; many routers switch WPS off. Not for new designs |

None is perfect. Many products offer two: Bluetooth LE or the portal for first set-up, and a button to start over.

### What every scheme needs

The flow is the same everywhere. On the first boot there are no saved credentials, so the device offers provisioning; when credentials arrive they are **saved in flash** ([[nvs-and-preferences]]); the device tries to join; if it cannot, it goes back to offering provisioning; and a button held for a few seconds erases them. Saved credentials survive resets and firmware updates because the store is outside the program. They are readable by anyone who holds the device, unless the store is encrypted ([[nvs-encryption]]).

### Security

Whatever the channel, the password crosses a few metres of air once. Prefer a scheme that encrypts it, give the set-up network a password printed on the device, and keep the set-up window short ([[secure-provisioning]]). The simulation shows the portal path end to end.

> [!key] Provisioning gets the Wi-Fi credentials into a finished device without recompiling: a soft AP portal needs no app, Bluetooth LE keeps the phone on its network and encrypts, Improv suits a web flasher, WPS is best avoided. Save the result in flash, and always keep a way back to set-up.`,
  ideas: [
    'Provisioning replaces hard-coded credentials: the device asks, the user answers once, the device remembers.',
    'The soft AP portal needs no app; Bluetooth LE provisioning keeps the phone on its own network and encrypts the credentials.',
    'SmartConfig, Improv and WPS exist too, each with limits: router support, a cable or Bluetooth, a guessable PIN.',
    'Credentials go into flash (NVS), survive updates and resets, and need a way to be erased and re-entered.'
  ],
  pitfalls: [
    'The credentials are safe in Preferences — They are stored in flash in plain text unless NVS encryption is on: whoever holds the device can read them.',
    'An open set-up network is harmless because it only runs for a minute — Anyone nearby can join it and read the form. Use a password on it, keep it brief, and never leave it up.',
    'WPS is the easiest and so the best — The PIN mode can be guessed one part at a time, and many routers disable WPS. Treat it as a historical option.'
  ],
  terms: [
    { term: 'Provisioning', also: ['commissioning', 'onboarding', 'Wi-Fi set-up'], def: 'Giving a finished device what it needs to start working on a particular network: for Wi-Fi, the network name and password.' },
    { term: 'Unified Provisioning', also: ['WiFiProv', 'ESP BLE Provisioning', 'network_provisioning'], def: 'Espressif\'s provisioning component and phone apps. It runs over Bluetooth LE or a soft AP, encrypts the exchange with a secret ("proof of possession") and is available in the Arduino core as the WiFiProv library.' },
    { term: 'SmartConfig', also: ['ESP-TOUCH', 'EspTouch'], def: 'A way to pass Wi-Fi credentials to a device that is listening: a phone app encodes them in the lengths of broadcast frames, which the device overhears and decodes.' },
    { term: 'Improv Wi-Fi', also: ['Improv', 'Improv Serial', 'Improv BLE'], def: 'An open standard for provisioning over a serial cable or Bluetooth LE: a web page or app sends the credentials in a defined message format. It is used by ESPHome and ESP Web Tools.' },
    { term: 'WPS', also: ['Wi-Fi Protected Setup'], def: 'A router feature that connects a device by a push button or an eight-digit PIN, with no typing of the password. The PIN method can be broken, so many routers disable it.' },
    { term: 'Proof of possession', also: ['PoP'], def: 'A short secret, such as a PIN printed on the device or its box, that a phone must give before a provisioning session is accepted and encrypted.' }
  ],
  choose: {
    good: ['Soft AP portal for products that must work with any phone and no app', 'Bluetooth LE provisioning for products with a phone app and a need for encryption', 'Improv with a web flasher for hobby and open-source firmware'],
    avoid: ['Credentials compiled into firmware you give away', 'WPS PINs', 'A set-up network with no password that stays on for ever'],
    check: ['That a long button press erases the credentials and re-enters set-up', 'What the device does when the saved network disappears', 'That the chip has the radio the scheme needs: Bluetooth LE is absent on the ESP32-S2, and the ESP32-H2 has no Wi-Fi']
  },
  code: [
    {
      title: 'Join the saved network, or ask for one',
      about: 'On start-up it tries the credentials saved in flash. If there are none, or joining fails, it opens the network "device-setup" with a form; submitting the form saves the name and password and restarts.',
      needs: 'Any ESP32-family board with Wi-Fi. On first run join "device-setup" from a phone and browse to 192.168.4.1. The password goes over plain HTTP: for a real product give the AP a password ([[secure-provisioning]]).',
      blocks: `
        when started
          start serial at (115200) baud
          set [ssid v] to (load [ssid])
          set [pass v] to (load [pass])
          if <not <(ssid) = []>> then
            connect to Wi-Fi (ssid) password (pass)
            wait until <<Wi-Fi connected?> or <(seconds since start) > (15)>>
          end
          if <Wi-Fi connected?> then
            print (join [joined, IP ] (IP address))
          else
            start access point [device-setup]
            start web server on port (80)
            print [no saved network: browse to 192.168.4.1]
          end

        when request for [/] arrives
          respond with [form: network name, password, Save] :: net

        when request for [/save] arrives
          save (form field [s]) as [ssid]
          save (form field [p]) as [pass]
          respond with [Saved. Restarting...] :: net
          restart
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>
        #include <Preferences.h>

        Preferences prefs;
        WebServer server(80);
        bool portal = false;

        const char FORM[] =
          "<h1>Wi-Fi set-up</h1><form method='post' action='/save'>"
          "Network <input name='s'><br>Password <input name='p' type='password'><br>"
          "<button>Save</button></form>";

        bool joinSaved() {
          prefs.begin("wifi", true);                      // read-only
          String ssid = prefs.getString("ssid", "");
          String pass = prefs.getString("pass", "");
          prefs.end();
          if (ssid.length() == 0) return false;
          WiFi.mode(WIFI_STA);
          WiFi.begin(ssid.c_str(), pass.c_str());
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) delay(250);
          return WiFi.status() == WL_CONNECTED;
        }

        void save() {
          prefs.begin("wifi", false);
          prefs.putString("ssid", server.arg("s"));
          prefs.putString("pass", server.arg("p"));
          prefs.end();
          server.send(200, "text/html", "Saved. Restarting...");
          delay(1000);
          ESP.restart();
        }

        void setup() {
          Serial.begin(115200);
          if (joinSaved()) {
            Serial.printf("joined, IP %s\n", WiFi.localIP().toString().c_str());
            return;
          }
          portal = true;
          WiFi.mode(WIFI_AP);
          WiFi.softAP("device-setup");
          server.on("/", []() { server.send(200, "text/html", FORM); });
          server.on("/save", HTTP_POST, save);
          server.begin();
          Serial.println("no saved network: browse to 192.168.4.1");
        }

        void loop() {
          if (portal) server.handleClient();
        }
      `,
      py: String.raw`
        import network, socket, time, esp32, machine

        FORM = b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Wi-Fi set-up</h1><form method='post' action='/save'>Network <input name='s'><br>Password <input name='p' type='password'><br><button>Save</button></form>"
        nvs = esp32.NVS("wifi")

        def load(key):
            buf = bytearray(64)
            try:
                return bytes(buf[:nvs.get_blob(key, buf)]).decode()
            except OSError:                              # nothing saved yet
                return ""

        def unquote(s):                                  # form text: + is a space, %41 is "A"
            parts = s.replace("+", " ").split("%")
            return parts[0] + "".join(chr(int(p[:2], 16)) + p[2:] for p in parts[1:])

        def join_saved():
            ssid, password = load("ssid"), load("pass")
            if not ssid:
                return False
            wlan = network.WLAN(network.WLAN.IF_STA)
            wlan.active(True)
            wlan.connect(ssid, password)
            t0 = time.ticks_ms()
            while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 15000:
                time.sleep_ms(250)
            return wlan.isconnected()

        if join_saved():
            print("joined")
        else:
            ap = network.WLAN(network.WLAN.IF_AP)
            ap.config(ssid="device-setup", security=network.WLAN.SEC_OPEN)
            ap.active(True)
            web = socket.socket()
            web.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            web.bind(("0.0.0.0", 80))
            web.listen(2)
            print("no saved network: browse to 192.168.4.1")
            while True:
                client, _ = web.accept()
                request = client.recv(1024)
                if request.startswith(b"POST /save"):
                    body = request.split(b"\r\n\r\n", 1)[1].decode()
                    fields = dict(f.split("=", 1) for f in body.split("&"))
                    nvs.set_blob("ssid", unquote(fields["s"]).encode())
                    nvs.set_blob("pass", unquote(fields["p"]).encode())
                    nvs.commit()                         # required, or the change is lost
                    client.send(b"HTTP/1.0 200 OK\r\n\r\nSaved. Restarting...")
                    client.close()
                    time.sleep(1)
                    machine.reset()
                client.send(FORM)
                client.close()
      `,
      output: `
        no saved network: browse to 192.168.4.1
        (after saving and the restart)
        joined, IP 192.168.1.57
      `,
      notes: ['A real server reads the number of bytes in the Content-Length header; this teaching version assumes the small form arrives in one piece. The MicroPython unquote handles plain ASCII only.', 'The credentials sit in flash in plain text. Turn on NVS encryption for a product ([[nvs-encryption]]), and add a long button press that erases the two keys.', 'The Arduino core also ships a WiFiProv library that does the same over Bluetooth LE or a soft AP with Espressif\'s phone apps, and WiFi.beginSmartConfig() for SmartConfig.']
    }
  ],
  quiz: [
    { q: 'A product ships to people who have a phone but no computer, and you want no app to install. Which method fits best?', choices: ['Bluetooth LE provisioning with Espressif\'s app', 'Improv over a USB cable', 'A soft AP with a captive portal', 'WPS with a PIN'], a: 2, why: 'A portal needs only the phone\'s own browser. Bluetooth LE provisioning needs an app, Improv serial needs a computer and a cable, and WPS PINs are weak.' },
    { q: 'WPS is secure because its PIN has eight digits.', a: false, why: 'The PIN is checked in two halves, so it can be guessed with far fewer than 10^8 tries, and many routers have therefore switched WPS off.' },
    { q: 'After the form is submitted, what does the example program do?', choices: ['Serves the form again', 'Saves the name and password in flash and restarts, so that the next start joins the network', 'Joins the network and keeps the soft AP open', 'Prints the password on the serial monitor'], a: 1, why: 'Saving to flash makes the credentials survive the restart; on the next boot joinSaved() finds them and the portal is not needed.' },
    { q: 'Why do saved credentials survive a firmware update?', choices: ['The update tool copies them', 'They are kept in the NVS partition, which is separate from the program', 'They are in the bootloader', 'They are not: every update erases them'], a: 1, why: 'Preferences and NVS live in their own flash partition. An over-the-air update replaces the app partitions only ([[nvs-and-preferences]]).' }
  ],
  applications: [
    'Smart plugs, lamps and sensors sold to the public, which set themselves up from a phone.',
    'ESPHome and WLED, which open a portal when no network is known; ESPHome also offers Improv through a web flasher.',
    'Matter devices, whose commissioning also hands over Wi-Fi credentials, by Bluetooth LE ([[matter-commissioning]]).',
    'Moving a device to another house or router without a computer: hold the button, enter the new network.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Provisioning" (the network_provisioning component) and the ESP BLE Provisioning phone apps.',
    'Arduino core for ESP32: the WiFiProv library, the SmartConfig and WPS examples (core 3.3).',
    'The Improv Wi-Fi specification (serial and Bluetooth LE); Wi-Fi Alliance, *Wi-Fi Simple Configuration* (WPS).'
  ],
  sim: { id: 'wf-portal', params: { flow: 'provision' } }
},

/* ================================================================ IP addresses, DHCP, DNS */
{
  id: 'ip-addresses-dhcp-dns',
  parent: 'wifi',
  title: 'IP addresses, DHCP, DNS',
  level: 2,
  short: 'Joining the Wi-Fi gives a link; an IP address gives an identity on it. How DHCP hands the address out, what the mask, gateway and DNS server mean, when a fixed address is worth having, and how a name becomes a number.',
  keywords: ['IP address', 'DHCP', 'DNS', 'subnet mask', 'gateway', 'static IP', 'WiFi.config', 'DHCP reservation', 'lease', 'hostByName', 'getaddrinfo', 'ipconfig', '192.168.1.x', 'name resolution', 'localIP'],
  prereq: ['wifi-station', 'tcp-ip-on-a-microcontroller'],
  related: ['mdns', 'sockets', 'http-client', 'network-troubleshooting', 'fast-wifi-reconnect', 'ntp-and-time'],
  body: `Joining the network gives the ESP a radio link. To talk to anything it also needs an **IP address**, and a way to turn names such as \`example.com\` into addresses. Both usually arrive without any code of yours, from the router, in the last step of the join.

### DHCP: the address arrives by asking

The ESP shouts to the whole network *is there a DHCP server?* (Discover). The router answers with an offer: an address, the mask, the gateway, the DNS server and a lease time. The ESP accepts (Request) and the router confirms (Acknowledge). Four short messages, a few milliseconds each; the simulation plays them. The address is **leased**, commonly for hours to a day, and the device asks to renew it at half time. If the router's pool of addresses is used up, nothing is offered, and the ESP stays linked but without an address, status 0 on Arduino.

### What the numbers mean

| Item | Example | Meaning |
|---|---|---|
| IP address | 192.168.1.57 | this device on this network; 192.168.x.x, 10.x.x.x and 172.16–31.x.x are private ranges |
| Mask | 255.255.255.0 | the first 24 bits name the network: 192.168.1.0 to .255 are neighbours, reached directly |
| Gateway | 192.168.1.1 | the router: where everything else is sent |
| DNS server | 192.168.1.1 | who answers *what address is this name?* Usually the router, which asks upstream |

### Fixed addresses

A device you want to find again, such as a server or a display, needs the same address each time. The robust way is a **DHCP reservation** in the router: it hands that device's hardware address the same IP. Setting the address in the code (\`WiFi.config()\` before \`begin()\`; \`wlan.ipconfig(addr4=…, gw4=…)\`) works until the network changes: a different subnet, or a second device that was given that address. If you set it in code, also give a DNS server. A static address does skip the DHCP exchange, which shortens a reconnection ([[fast-wifi-reconnect]]).

### DNS: names to numbers

A program says \`example.com\`; packets need numbers. The ESP asks its DNS server, which answers with an address and a **TTL**, the time the answer may be remembered. Failures look alike from the program: a lookup that returns nothing. Check the DNS server in use, whether the network lets it through, and whether a captive portal is answering every question with its own address ([[soft-ap-and-captive-portal]]). To reach a device on your own network by name, without any router setting, see [[mdns]].

> [!key] DHCP gives the ESP an address, mask, gateway and DNS server in four messages; the lease expires and is renewed. Prefer a reservation in the router to a static address in the code, and when a name will not resolve, look at the DNS server first.`,
  ideas: [
    'DHCP is four messages: Discover, Offer, Request, Acknowledge. The address comes with a mask, a gateway, a DNS server and a lease time.',
    'The mask says which addresses are neighbours; everything else is sent to the gateway, the router.',
    'A DHCP reservation in the router is more robust than a static address in the code.',
    'DNS turns names into addresses, and the answers carry a time to live; a lookup that fails is usually a DNS server problem, not a Wi-Fi problem.'
  ],
  pitfalls: [
    'Setting a static IP in the code is the professional way — It breaks when the network changes and can clash with another device. A reservation in the router is the safer fixed address.',
    'If the connection works, DNS works — Pinging an address can succeed while names fail. A static configuration without a DNS server, or a wrong one, resolves nothing.',
    'The ESP has the same address after every restart — Only with a reservation or a static address. A leased address can change when the lease has expired.'
  ],
  terms: [
    { term: 'IP address', also: ['IPv4 address'], def: 'The number that identifies a device on a network, written as four numbers from 0 to 255. Private ranges such as 192.168.x.x are not reachable from the internet.' },
    { term: 'Subnet mask', also: ['netmask', 'CIDR', '/24'], def: 'A number that says how many leading bits of an address name the network. 255.255.255.0 (written /24) means that addresses sharing the first three numbers are neighbours.' },
    { term: 'Default gateway', also: ['gateway', 'router address'], def: 'The device to which a host sends every packet that is not for its own network: usually the router.' },
    { term: 'DHCP', also: ['Dynamic Host Configuration Protocol', 'DORA'], def: 'The protocol by which a device gets its address, mask, gateway and DNS server from the network: Discover, Offer, Request, Acknowledge.' },
    { term: 'Lease', also: ['DHCP lease'], def: 'The time for which a DHCP server lends an address. The device renews it halfway through; if it never does, the address may be given to someone else.' },
    { term: 'DNS', also: ['Domain Name System', 'resolver', 'TTL'], def: 'The system that answers *which address belongs to this name?* A resolver asks a DNS server and may keep the answer for its time to live (TTL).' }
  ],
  choose: {
    good: ['DHCP with a reservation in the router for devices that must be found at one address', 'The router\'s own DNS, unless you know why not', 'A static address only on a network you control, together with a gateway and a DNS server'],
    avoid: ['A static address copied from a tutorial: 192.168.1.50 may belong to someone else', 'Static addresses without a DNS server', 'Assuming the address will never change on a leased one'],
    check: ['The address, mask, gateway and DNS server the device really got (print them)', 'The size of the router\'s address pool against the number of devices', 'Whether the guest network or an extender changes the subnet']
  },
  code: [
    {
      title: 'Print what DHCP gave, and look up a name',
      about: 'After joining, prints the address, mask, gateway and DNS server, and asks the DNS server for the address of example.com.',
      needs: 'Any ESP32-family board with Wi-Fi and a network that has internet access. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          print (join [IP       ] (IP address))
          print (join [mask     ] (subnet mask))
          print (join [gateway  ] (gateway address))
          print (join [DNS      ] (DNS server address))
          set [found v] to (look up [example.com])
          if <(found) = []> then
            print [name lookup failed]
          else
            print (join [example.com is at ] (found))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.printf("IP       %s\n", WiFi.localIP().toString().c_str());
          Serial.printf("mask     %s\n", WiFi.subnetMask().toString().c_str());
          Serial.printf("gateway  %s\n", WiFi.gatewayIP().toString().c_str());
          Serial.printf("DNS      %s\n", WiFi.dnsIP().toString().c_str());
          IPAddress found;
          if (WiFi.hostByName("example.com", found)) {     // 1 on success
            Serial.printf("example.com is at %s\n", found.toString().c_str());
          } else {
            Serial.println("name lookup failed");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, socket, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        ip, mask = wlan.ipconfig("addr4")
        print("IP      ", ip)
        print("mask    ", mask)
        print("gateway ", wlan.ipconfig("gw4"))
        print("DNS     ", network.ipconfig("dns"))        # the DNS server is set for the whole stack
        try:
            print("example.com is at", socket.getaddrinfo("example.com", 80)[0][-1][0])
        except OSError:
            print("name lookup failed")
      `,
      output: `
        IP       192.168.1.57
        mask     255.255.255.0
        gateway  192.168.1.1
        DNS      192.168.1.1
        example.com is at 93.184.216.34
      `,
      notes: ['The address printed for example.com is only an example; it changes.', 'A fixed address: call WiFi.config(ip, gateway, mask, dns) before WiFi.begin() in Arduino; in MicroPython wlan.ipconfig(addr4="192.168.1.50/24", gw4="192.168.1.1") stops DHCP by itself, and network.ipconfig(dns="192.168.1.1") sets the DNS server.']
    }
  ],
  quiz: [
    { q: 'The ESP is linked to the router but never gets an address (Arduino status stays 0). What is a likely cause?', choices: ['The password is wrong', 'The router\'s DHCP pool is used up, or DHCP is off', 'The channel is 13', 'The antenna is missing'], a: 1, why: 'The handshake already succeeded (the link is up), so the password is right. Status 0 means no DHCP answer arrived: a full pool, a disabled DHCP server or a network that filters the exchange.' },
    { q: 'An ESP has address 192.168.1.57 and mask 255.255.255.0. Where does it send a packet for 192.168.1.80, and for 8.8.8.8?', choices: ['Both to the gateway', '192.168.1.80 directly, 8.8.8.8 to the gateway', 'Both directly', '192.168.1.80 to the gateway, 8.8.8.8 directly'], a: 1, why: 'The mask makes 192.168.1.x one network, so .80 is a neighbour and is reached directly. Everything outside goes to the gateway, the router.' },
    { q: 'Which is the more robust way to give a device a fixed address?', choices: ['Type the address in the code', 'A DHCP reservation in the router', 'Pick any unused address at random', 'Restart it until it gets the same one'], a: 1, why: 'A reservation keeps the address under the router\'s control, so the router never gives it to another device and the code does not depend on one network\'s numbers.' },
    { q: 'If pinging 8.8.8.8 works but `example.com` does not resolve, the Wi-Fi link is at fault.', a: false, why: 'The link and routing work, since packets reach an address. The DNS server is missing, wrong or blocked.' }
  ],
  applications: [
    'Every device that reports to an address or a name: a broker, a server, an NTP pool ([[ntp-and-time]]).',
    'Finding a device again: a reserved address, the router\'s client list, or an mDNS name ([[mdns]]).',
    'Debugging "it connects but nothing works": the printed address, gateway and DNS tell which layer failed ([[network-troubleshooting]]).',
    'Fast reconnection for battery devices, where a static address saves the DHCP exchange ([[fast-wifi-reconnect]]).'
  ],
  sources: [
    'IETF RFC 2131, *Dynamic Host Configuration Protocol*, and RFC 1035, *Domain Names: Implementation and Specification*.',
    'Arduino core for ESP32 documentation, *Wi-Fi API*: localIP, gatewayIP, dnsIP, config, hostByName (core 3.3).',
    'MicroPython documentation, *network* module and *network.WLAN*: ipconfig, hostname (version 1.29).'
  ],
  sim: 'wf-dhcp-dns'
},

/* ================================================================ mDNS */
{
  id: 'mdns',
  parent: 'wifi',
  title: 'mDNS: a name on the local network',
  level: 2,
  short: 'Addresses change; names are easier. mDNS lets a device be found as esp32.local on its own network with no DNS server and no router setting, and lets it advertise what it offers, such as a web server.',
  keywords: ['mDNS', 'multicast DNS', 'esp32.local', 'Bonjour', 'Avahi', 'ESPmDNS', 'MDNS.begin', 'MDNS.addService', 'DNS-SD', 'service discovery', '.local', 'hostname', '224.0.0.251', '_http._tcp'],
  prereq: ['wifi-station', 'ip-addresses-dhcp-dns'],
  related: ['web-server-on-esp', 'ota-from-a-server', 'home-assistant-integration', 'network-troubleshooting', 'wifi-power-save-and-dtim', 'sockets'],
  body: `The router gives your ESP an address, and tomorrow it may give it another. Typing \`192.168.1.57\` into a browser means hunting for the number every time. **mDNS** (multicast DNS) lets the device be found by name, as \`esp32.local\`, with no DNS server and no setting in the router. It is the same family as Apple's Bonjour and the Avahi of Linux, and macOS, iOS, Linux and current Windows all understand \`.local\` names.

### How it works

When your laptop opens \`http://esp32.local/\`, it asks the whole network at once, by **multicast** (address 224.0.0.251, UDP port 5353): *who is esp32.local?* Every device hears the question; only the one that owns the name answers, with its address. Nothing central is involved. Before it claims a name a device checks, by asking, that nobody else has it, and answers are cached for a short time. The simulation plays the exchange and what happens when the network drops multicast.

### Names and services

mDNS does two jobs. The first is the **name to address** lookup above. The second is **service discovery** (DNS-SD): a device says *I offer a web server, on port 80* by publishing a service such as \`_http._tcp\`, and programs that look for that kind of service, such as Home Assistant, printer dialogs or an OTA upload tool, find it without being told where it is ([[home-assistant-integration]], [[ota-from-a-server]]).

### Limits

- **One network only.** Multicast does not cross routers by default. A guest network, client isolation, some Wi-Fi extenders and mesh systems, and VPNs can block it: the name fails while the address still works ([[wifi-troubleshooting]]).
- **Names must be unique.** Two devices both called \`esp32\` collide. Put something unique in the name, such as the last digits of the MAC address.
- **Systems differ.** Support for \`.local\` is good but not universal; an older Android may not resolve it.
- **It costs a little power.** The device must hear multicast frames, which arrive after the access point's DTIM beacon ([[wifi-power-save-and-dtim]]); a sleepy battery device may leave mDNS off.
- **The name is set when the interface starts.** In Arduino \`MDNS.begin()\` needs a connection; in MicroPython the hostname must be set before connecting, and the responder then runs by itself. MicroPython announces the name but has no call to publish a service; it can *resolve* \`.local\` names with \`socket.getaddrinfo\`.

> [!key] mDNS lets a device be found by name on its own network by asking everybody, with no server and no router setting. Choose a unique name, publish services for programs that look for them, and remember that guest networks and extenders may block multicast.`,
  ideas: [
    'mDNS asks the whole local network by multicast: who is esp32.local? The owner of the name answers with its address.',
    'It also advertises services, such as a web server on port 80, that other programs can discover.',
    'It works only on one network: guest networks, isolation, some extenders and VPNs block multicast.',
    'Names must be unique, so add a part of the MAC address; set the hostname before the connection starts.'
  ],
  pitfalls: [
    'esp32.local works from anywhere, like a normal web address — It works on the local network only, and only where multicast gets through. From outside, or across a router, use the address or a real DNS name.',
    'I can name every project "esp32" — Two devices with one name collide and one wins at random. Add a unique part of the MAC address.',
    'If .local fails, the device is dead — The address may still work. A network that blocks multicast, or a computer without mDNS support, breaks the name and nothing else.'
  ],
  terms: [
    { term: 'mDNS', also: ['multicast DNS', 'Bonjour', 'Avahi', 'zeroconf'], def: 'A way to resolve names on the local network without a DNS server: a question is multicast to every device, and the one that owns the name answers. Names end in .local.' },
    { term: 'Multicast', also: ['224.0.0.251'], def: 'Sending one packet to a group of devices instead of one. mDNS uses the group address 224.0.0.251 and UDP port 5353.' },
    { term: 'DNS-SD', also: ['service discovery', 'DNS Service Discovery', '_http._tcp'], def: 'A way to advertise and find services by type, such as _http._tcp for a web server, usually together with mDNS.' },
    { term: '.local', also: ['local domain'], def: 'The top-level name reserved for mDNS. A name such as esp32.local is resolved by asking the local network, not a DNS server.' }
  ],
  choose: {
    good: ['Home and workshop devices that people open in a browser or find from Home Assistant', 'Over-the-air update tools that look for the device by name or service', 'Any project where the address would otherwise have to be read off the serial monitor'],
    avoid: ['Networks that block multicast, such as many guest networks: use a reserved address', 'Battery devices that sleep most of the time and rarely serve anything', 'Identical default names on many devices'],
    check: ['That the name resolves from every computer and phone that will use it', 'That the name is unique on the network', 'What the device does about it in light sleep']
  },
  code: [
    {
      title: 'A web server you can open as esp32.local',
      about: 'Joins the network, claims the name esp32, advertises a web server and answers a request at http://esp32.local/.',
      needs: 'Any ESP32-family board with Wi-Fi, and a computer or phone on the same network. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          set hostname [esp32] :: wifi
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          announce name [esp32] and service [http] on port (80) :: net
          start web server on port (80)
          print [open http://esp32.local/]

        when request for [/] arrives
          respond with [Hello, I am esp32.local] :: net
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <ESPmDNS.h>
        #include <WebServer.h>

        WebServer server(80);

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          if (MDNS.begin("esp32")) {                 // the device is now esp32.local
            MDNS.addService("http", "tcp", 80);      // and says it offers a web server
          }
          server.on("/", []() { server.send(200, "text/plain", "Hello, I am esp32.local"); });
          server.begin();
          Serial.println("open http://esp32.local/");
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import network, socket, time

        network.hostname("esp32")                    # before connecting: the device becomes esp32.local
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        print("open http://esp32.local/")            # MicroPython announces the name on its own

        web = socket.socket()
        web.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        web.bind(("0.0.0.0", 80))
        web.listen(2)
        while True:
            client, _ = web.accept()
            client.recv(1024)
            client.send(b"HTTP/1.0 200 OK\r\nContent-Type: text/plain\r\n\r\nHello, I am esp32.local")
            client.close()
      `,
      output: `
        open http://esp32.local/
      `,
      notes: ['MicroPython has no call to advertise a service such as _http._tcp; it announces the hostname only.', 'If the name does not resolve on Windows or Android, try the address from the serial monitor, and check whether the network blocks multicast.']
    }
  ],
  quiz: [
    { q: 'Your computer resolves esp32.local at home but not on the office guest network, where the ESP also works by its IP address. What is the likeliest cause?', choices: ['The ESP has no password', 'The guest network does not pass multicast traffic', 'The hostname is too long', 'The ESP uses the wrong channel'], a: 1, why: 'mDNS depends on multicast. Guest networks, client isolation and some extenders block it, while ordinary unicast traffic to the address still flows.' },
    { q: 'What does an mDNS question look like on the network?', choices: ['A question to the router\'s DNS server', 'A multicast to every device on the network: who is this name?', 'A broadcast to the internet', 'A DHCP request'], a: 1, why: 'mDNS asks the whole local network at once, to 224.0.0.251 on UDP port 5353, and the owner of the name replies.' },
    { q: 'Two of your devices are both named `esp32`. What happens?', choices: ['Both answer and everything works', 'The names collide and requests may reach either device', 'The router renames one', 'Nothing: the second never starts'], a: 1, why: 'A name must belong to one device. Add a part of the MAC address to the hostname.' },
    { q: 'mDNS can be used to reach an ESP from the internet by name.', a: false, why: 'Multicast stays on the local network. Reaching a device from outside needs a real DNS name, a cloud service or a tunnel.' }
  ],
  applications: [
    'Opening a device\'s web page by name: http://thermostat.local/.',
    'Home Assistant and ESPHome finding devices on the network without fixed addresses ([[home-assistant-integration]]).',
    'Arduino IDE and OTA tools listing network upload targets by name ([[ota-from-a-server]]).',
    'Printers, speakers and media players, which advertise themselves the same way.'
  ],
  sources: [
    'IETF RFC 6762, *Multicast DNS*, and RFC 6763, *DNS-Based Service Discovery*.',
    'Arduino core for ESP32: the ESPmDNS library and its examples (core 3.3).',
    'MicroPython documentation, *network* module: the hostname function and mDNS (version 1.29).'
  ],
  sim: { id: 'wf-dhcp-dns', params: { conv: 'mdns' } }
},

/* ================================================================ scanning */
{
  id: 'wifi-scanning',
  parent: 'wifi',
  title: 'Scanning',
  level: 1,
  short: 'A scan lists the networks in range with their channel, signal strength and security. How active and passive scans work, what a scan disturbs, how to read the result, and a program that counts the networks on each channel.',
  keywords: ['scan', 'WiFi.scanNetworks', 'wlan.scan', 'active scan', 'passive scan', 'probe request', 'probe response', 'hidden SSID', 'channel congestion', 'RSSI', 'encryptionType', 'scanDelete', 'site survey', 'network list'],
  prereq: ['wifi-basics', 'wifi-station'],
  related: ['interference-and-channels', 'esp-as-a-network-scanner', 'wifi-and-ble-analysers', 'wifi-troubleshooting', 'rssi-and-signal-quality', 'five-ghz-and-six-ghz'],
  body: `Before joining, a station may look around. A **scan** lists the networks in range with their name, channel, signal strength and security. That is useful in four ways: to learn whether *your* network is visible at all, and on which channel and band; to choose a quiet channel for your own router; to pick the strongest of several access points with the same name; and to show a list on a set-up screen ([[wifi-troubleshooting]]).

### How a scan works

In an **active scan** the station sends a **probe request** on each channel in turn and waits for **probe responses**: the Arduino default is 300 ms per channel, so 13 channels take about four seconds. In a **passive scan** it sends nothing and listens for beacons, which come every 102.4 ms: slower and quieter, and the only way on channels where transmitting before hearing a network is not allowed (some 5 GHz channels, relevant to the ESP32-C5).

The price is that the radio **leaves its channel**. A station that is connected loses traffic during the scan, an ESP-NOW link stutters and the clients of a soft AP notice. Do not scan in the middle of a stream, or on a battery more often than you must; an asynchronous scan lets the program carry on meanwhile.

### What you get back

For each network: the **SSID**, the access point's **BSSID**, the **channel**, the **RSSI** in dBm and the **authentication mode**. Hidden networks need care: the Arduino scan skips them unless you ask (\`scanNetworks(false, true)\`), and they then appear with an empty name; MicroPython lists them with an empty name. MicroPython gives the security as a number equal to the \`network.WLAN.SEC_*\` constants: 0 open, 1 WEP, 2 WPA, 3 WPA2, 4 WPA/WPA2, 6 WPA3, 7 WPA2/WPA3.

### Reading it

Count networks per channel, and weight them by signal: a strong neighbour on channel 6 matters more than five faint ones on 11. Only 1, 6 and 11 are clear of each other ([[wifi-basics]]), so the best channel for your router is usually the quietest of the three. The simulation does this sum. Congestion shows up as slowness and retries more than as lost connections. You change the channel in the router, not in the ESP.

A scan sees only what any phone sees; it does not decrypt anything. Still, lists of neighbours' network names and positions are personal data of a kind: keep your own, do not publish others.

> [!key] A scan lists the networks in range with channel, signal and security. It takes seconds and briefly takes the radio off its channel, so scan rarely; read it as a count per channel to choose the quietest of channels 1, 6 and 11 for your router.`,
  ideas: [
    'An active scan sends probe requests channel by channel, about 300 ms each; a passive scan only listens for beacons.',
    'While scanning, the radio leaves its channel: a connected station, ESP-NOW or a soft AP is disturbed.',
    'Each result has SSID, BSSID, channel, RSSI and authentication mode; hidden networks need to be asked for.',
    'Count and weight the networks per channel to find the quietest of 1, 6 and 11.'
  ],
  pitfalls: [
    'My network is not in the scan, so the ESP is broken — Check the band first: a 5 GHz-only network never shows on any chip but the ESP32-C5. Then a hidden SSID, then range.',
    'I can scan as often as I like — Each scan takes seconds and interrupts the link. On a battery it also costs charge.',
    'The ESP can change my router\'s channel — It can only show you the congestion. The channel is set in the router.'
  ],
  terms: [
    { term: 'Active scan', also: ['probe scan'], def: 'A scan in which the station sends a probe request on each channel and collects the probe responses of the access points that hear it.' },
    { term: 'Passive scan', also: ['beacon scan'], def: 'A scan in which the station sends nothing and listens on each channel long enough to hear the access points\' beacons.' },
    { term: 'Probe request', also: ['probe response'], def: 'A frame a station sends to ask nearby access points to announce themselves; they reply with a probe response, which carries the same information as a beacon.' },
    { term: 'Hidden network', also: ['hidden SSID', 'cloaked network'], def: 'A network whose access point leaves its name out of its beacons. It can still be joined by a station that knows the name, and it shows in scans with an empty name.' },
    { term: 'Authentication mode', also: ['auth mode', 'security type', 'encryptionType'], def: 'The security a network requires: open, WEP, WPA, WPA2, WPA3 or a mixture. A scan reports it for each network.' }
  ],
  choose: {
    good: ['A scan at start-up on a bench, to see what the board hears', 'A scan to choose the router\'s channel, or the strongest of several access points', 'A scan on demand from a set-up page'],
    avoid: ['Scanning every few seconds on a battery', 'Scanning while an ESP-NOW or streaming link must stay up', 'Treating one scan as a survey: signals change from second to second'],
    check: ['Which band the missing network is on', 'Whether the network is hidden', 'That scanning does not break the rest of your program\'s timing']
  },
  code: [
    {
      title: 'List the networks and count them per channel',
      about: 'Scans once, prints each network with its channel, signal and security, then the number of networks on channels 1 to 13.',
      needs: 'Any ESP32-family board with Wi-Fi and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          scan networks :: wifi
          make list [per channel v]
          for each [net v] in (scan results)
            print (join (name of [net]) [  ch ] (channel of [net]) [  ] (signal of [net]) [ dBm  ] (security of [net]))
            change item (channel of [net]) of [per channel v] by (1)
          end
          print (join [networks per channel: ] (per channel))
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *authName(wifi_auth_mode_t a) {
          switch (a) {
            case WIFI_AUTH_OPEN:          return "open";
            case WIFI_AUTH_WEP:           return "WEP";
            case WIFI_AUTH_WPA_PSK:       return "WPA";
            case WIFI_AUTH_WPA2_PSK:      return "WPA2";
            case WIFI_AUTH_WPA_WPA2_PSK:  return "WPA/WPA2";
            case WIFI_AUTH_WPA3_PSK:      return "WPA3";
            case WIFI_AUTH_WPA2_WPA3_PSK: return "WPA2/WPA3";
            default:                      return "other";
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.disconnect();
          int n = WiFi.scanNetworks();               // blocks for a few seconds; returns how many
          int perChannel[14] = {0};
          for (int i = 0; i < n; i++) {
            int ch = WiFi.channel(i);
            Serial.printf("%-24s ch %2d  %4d dBm  %s\n", WiFi.SSID(i).c_str(), ch, (int)WiFi.RSSI(i), authName(WiFi.encryptionType(i)));
            if (ch >= 1 && ch <= 13) perChannel[ch]++;
          }
          Serial.print("networks per channel:");
          for (int ch = 1; ch <= 13; ch++) Serial.printf(" %d:%d", ch, perChannel[ch]);
          Serial.println();
          WiFi.scanDelete();                         // free the result list
        }

        void loop() {}
      `,
      py: String.raw`
        import network

        NAMES = {
            network.WLAN.SEC_OPEN: "open",
            network.WLAN.SEC_WEP: "WEP",
            network.WLAN.SEC_WPA: "WPA",
            network.WLAN.SEC_WPA2: "WPA2",
            network.WLAN.SEC_WPA_WPA2: "WPA/WPA2",
            network.WLAN.SEC_WPA3: "WPA3",
            network.WLAN.SEC_WPA2_WPA3: "WPA2/WPA3",
        }

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.disconnect()
        found = wlan.scan()                          # blocks for a few seconds; a list of tuples
        per_channel = [0] * 14
        for ssid, bssid, ch, rssi, auth, hidden in found:
            print("%-24s ch %2d  %4d dBm  %s" % (ssid.decode(), ch, rssi, NAMES.get(auth, "other")))
            if 1 <= ch <= 13:
                per_channel[ch] += 1
        print("networks per channel:", " ".join("%d:%d" % (ch, per_channel[ch]) for ch in range(1, 14)))
      `,
      output: `
        FamilyNet                ch  6   -52 dBm  WPA2/WPA3
        Neighbour-2G             ch  1   -66 dBm  WPA2
        Guest                    ch 11   -70 dBm  WPA2
        networks per channel: 1:1 2:0 3:0 4:0 5:0 6:1 7:0 8:0 9:0 10:0 11:1 12:0 13:0
      `,
      notes: ['The Arduino scan hides networks without a name unless you call scanNetworks(false, true); MicroPython lists them with an empty name.', 'For a scan that does not block, pass true as the first argument and poll scanComplete().']
    }
  ],
  quiz: [
    { q: 'Your phone shows the network "Home", but a scan from an ESP32-C3 does not. What is the most likely explanation?', choices: ['The C3 cannot scan', '"Home" is a 5 GHz-only network', 'The scan was too fast', 'The network has WPA3'], a: 1, why: 'The ESP32-C3, like every Wi-Fi chip of the family except the ESP32-C5, has a 2.4 GHz radio only and never sees 5 GHz networks. A dual-band router usually offers a separate 2.4 GHz network.' },
    { q: 'What happens to a connected station while it scans?', choices: ['Nothing', 'Its radio leaves the connection\'s channel, so traffic is interrupted for a moment', 'The password is forgotten', 'The router disconnects it for good'], a: 1, why: 'A scan has to listen on every channel, so the radio spends time off the channel of the connection. Avoid scanning in the middle of a transfer.' },
    { q: 'The scan shows three networks on channel 6 and one on channel 11. For your own router on 2.4 GHz, which of 1, 6 and 11 is the best first guess?', choices: ['6', '11', '1', 'Any: they are equal'], a: 2, why: 'Channel 1 has no neighbours in this scan, channel 11 one, channel 6 three. Weigh also by signal strength, but 1 is the quietest here.' },
    { q: 'A passive scan transmits probe requests on every channel.', a: false, why: 'A passive scan transmits nothing: it only listens for beacons. An active scan sends the probe requests.' }
  ],
  applications: [
    'Choosing a channel for a home router, by counting the neighbours ([[interference-and-channels]]).',
    'A set-up screen on a display or web page that lists the networks to pick from ([[wifi-provisioning]]).',
    'Diagnosing "cannot connect": is the name visible, on which channel, at what strength? ([[wifi-troubleshooting]]).',
    'A pocket network scanner built on an ESP32 ([[esp-as-a-network-scanner]]).'
  ],
  sources: [
    'Arduino core for ESP32: the Wi-Fi scan examples and the scanNetworks API (core 3.3).',
    'MicroPython documentation, *network.WLAN*: the scan method and its result tuples (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": scan configuration, active and passive scanning.'
  ],
  sim: { id: 'wf-band', params: { scan: true } }
},

/* ================================================================ WPA2, WPA3, enterprise */
{
  id: 'wifi-security',
  parent: 'wifi',
  title: 'WPA2, WPA3 and enterprise networks',
  level: 2,
  short: 'Wi-Fi encrypts the link between a device and its access point. What WPA2, WPA3, protected management frames and enterprise networks do, what they do not, and how to set up and test a network defensively.',
  keywords: ['WPA2', 'WPA3', 'SAE', 'WPA2-PSK', 'WPA3-Personal', 'protected management frames', 'PMF', '802.11w', 'enterprise', 'WPA2-Enterprise', '802.1X', 'EAP', 'RADIUS', 'passphrase', 'WEP', 'open network', 'transition mode', 'OWE'],
  prereq: ['wifi-station', 'wifi-scanning'],
  related: ['wifi-network-security', 'tls-on-esp', 'credentials-handling', 'secure-provisioning', 'iot-threat-model', 'certificates-and-root-cas'],
  body: `Everything sent over Wi-Fi can be heard by anyone in range, so Wi-Fi **encrypts** the link between a device and its access point. How well depends on the security mode. This page is about setting up and testing your own network defensively; it says nothing about attacking anyone else's.

### The modes

| Mode | How the key is made | Today |
|---|---|---|
| Open | no encryption | anyone in range reads everything |
| WEP | a fixed key, a weak cipher | broken for twenty years: never |
| WPA (TKIP) | password, older cipher | obsolete |
| **WPA2-Personal** (PSK, AES-CCMP) | derived from one shared password | the most common; strong with a long password |
| **WPA3-Personal** (SAE) | a password-based exchange that no one can replay offline | the current standard |
| **Enterprise** (WPA2 or WPA3, 802.1X) | each user has their own credentials, checked by a server | offices, universities |

The ESP32 family joins WPA2 and WPA3 personal networks; the Arduino core, when given a password, refuses networks below WPA2 unless you lower its minimum (\`setMinSecurity\`). The simulation shows what each step of the join exposes.

### What the handshake proves

In WPA2 both sides turn the password and the network name into a master key and, through the four-way handshake, derive fresh session keys with random numbers from each side; the password itself is never sent. The weakness is that someone who recorded a handshake can try passwords against it **offline**, at leisure, so a short or guessable password is the real risk. **WPA3** replaces this with SAE: every guess needs a live exchange with the access point, recorded traffic cannot be decrypted later even if the password leaks, and the mode requires **protected management frames**, which authenticate the control messages (such as "you are disconnected") that used to be forgeable.

### Enterprise networks

An enterprise network gives each user or device its own login, checked by a RADIUS server through an EAP method. The ESP stack can join them, but the program must carry the credentials, and should carry the server's CA certificate too, so that the device checks it is talking to the real network ([[certificates-and-root-cas]]).

### Defensive habits

Use WPA2/WPA3 with a long random passphrase; keep devices on their own network ([[wifi-network-security]]); do not rely on a hidden name or a MAC allow-list, since both are visible on the air. And remember that Wi-Fi encryption covers the radio hop only: use TLS to the server ([[tls-on-esp]]).

> [!key] WPA2 and WPA3 encrypt the hop between device and access point; WPA3's SAE removes the offline password guessing that threatens WPA2, and protected management frames secure the control messages. Use a long random passphrase, a separate network for devices, and TLS beyond the router.`,
  ideas: [
    'Open, WEP and WPA are not acceptable; WPA2-Personal with a long password is sound; WPA3-Personal (SAE) is better.',
    'In the four-way handshake both sides prove they know the password and derive session keys; the password is never sent.',
    'WPA2\'s risk is offline guessing of a recorded handshake; SAE makes every guess a live exchange.',
    'Wi-Fi encryption protects only the radio hop: use TLS above it, and a separate network for devices.'
  ],
  pitfalls: [
    'Hiding the SSID makes the network secure — The name is sent in clear whenever a device joins, and phones look for it everywhere. It adds nothing to security and slows joining.',
    'A MAC allow-list keeps strangers out — MAC addresses are visible on the air and can be copied. It is a nuisance filter, not security.',
    'My device is on encrypted Wi-Fi, so its data is private all the way — Only the hop to the access point is encrypted. Beyond the router the data crosses the internet; use TLS.'
  ],
  terms: [
    { term: 'WPA2-Personal', also: ['WPA2-PSK', 'pre-shared key', 'CCMP', 'AES'], def: 'Wi-Fi security in which every device uses one shared password to derive its keys. Strong with a long, random password; its weakness is offline guessing of a recorded handshake.' },
    { term: 'WPA3-Personal', also: ['SAE', 'Simultaneous Authentication of Equals', 'Dragonfly'], def: 'The successor of WPA2-Personal. The password-based exchange (SAE) makes every guess a live exchange with the access point, and recorded traffic stays secret even if the password is later learned.' },
    { term: 'Protected management frames', also: ['PMF', '802.11w', 'MFP'], def: 'An extension that authenticates control messages such as deauthentication, so that they can no longer be forged. Required by WPA3, optional in WPA2.' },
    { term: 'Enterprise network', also: ['WPA2-Enterprise', '802.1X', 'EAP', 'RADIUS'], def: 'A network in which each user or device logs in with its own credentials, checked by an authentication server using EAP, instead of one shared password.' },
    { term: 'Transition mode', also: ['WPA2/WPA3 mixed mode'], def: 'An access point setting that accepts WPA2 and WPA3 stations at once, so that old and new devices can share a network. WPA3 protection applies only to the stations that use it.' }
  ],
  choose: {
    good: ['WPA2/WPA3 transition or WPA3-only with a long random passphrase', 'A separate network or VLAN for IoT devices', 'TLS between the device and its server, whatever the Wi-Fi mode'],
    avoid: ['Open, WEP or WPA-TKIP networks', 'Short or guessable passphrases', 'Counting on a hidden SSID or a MAC list as protection'],
    check: ['That every device on the network supports the mode you choose', 'The router\'s firmware date and its administrator password', 'For an enterprise network, that the device checks the server\'s certificate']
  },
  code: [
    {
      title: 'Join only a network that is strong enough',
      about: 'Scans for the network, prints the security it uses, and refuses to join unless it is WPA2, WPA3 or both.',
      needs: 'Any ESP32-family board with Wi-Fi and a 2.4 GHz network. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          scan networks :: wifi
          set [mode v] to (security of network [your-ssid])
          print (join [your-ssid uses ] (mode))
          if <<<(mode) = [WPA2]> or <(mode) = [WPA3]>> or <(mode) = [WPA2/WPA3]>> then
            connect to Wi-Fi [your-ssid] password [your-password]
          else
            print [refusing: needs WPA2 or better]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        const char *authName(wifi_auth_mode_t a) {
          switch (a) {
            case WIFI_AUTH_OPEN:          return "open";
            case WIFI_AUTH_WEP:           return "WEP";
            case WIFI_AUTH_WPA_PSK:       return "WPA";
            case WIFI_AUTH_WPA2_PSK:      return "WPA2";
            case WIFI_AUTH_WPA_WPA2_PSK:  return "WPA/WPA2";
            case WIFI_AUTH_WPA3_PSK:      return "WPA3";
            case WIFI_AUTH_WPA2_WPA3_PSK: return "WPA2/WPA3";
            default:                      return "other";
          }
        }

        bool strongEnough(wifi_auth_mode_t a) {      // WPA2 or better
          return a == WIFI_AUTH_WPA2_PSK || a == WIFI_AUTH_WPA3_PSK || a == WIFI_AUTH_WPA2_WPA3_PSK;
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          int n = WiFi.scanNetworks();
          for (int i = 0; i < n; i++) {
            if (WiFi.SSID(i) != SSID) continue;
            wifi_auth_mode_t mode = WiFi.encryptionType(i);
            Serial.printf("%s uses %s\n", SSID, authName(mode));
            if (strongEnough(mode)) WiFi.begin(SSID, PASS);
            else Serial.println("refusing: needs WPA2 or better");
            return;
          }
          Serial.println("network not visible");
        }

        void loop() {}
      `,
      py: String.raw`
        import network

        SSID = "your-ssid"
        PASS = "your-password"

        NAMES = {
            network.WLAN.SEC_OPEN: "open",
            network.WLAN.SEC_WEP: "WEP",
            network.WLAN.SEC_WPA: "WPA",
            network.WLAN.SEC_WPA2: "WPA2",
            network.WLAN.SEC_WPA_WPA2: "WPA/WPA2",
            network.WLAN.SEC_WPA3: "WPA3",
            network.WLAN.SEC_WPA2_WPA3: "WPA2/WPA3",
        }
        STRONG = (network.WLAN.SEC_WPA2, network.WLAN.SEC_WPA3, network.WLAN.SEC_WPA2_WPA3)   # WPA2 or better

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        for ssid, bssid, channel, rssi, auth, hidden in wlan.scan():
            if ssid.decode() != SSID:
                continue
            print(SSID, "uses", NAMES.get(auth, "other"))
            if auth in STRONG:
                wlan.connect(SSID, PASS)
            else:
                print("refusing: needs WPA2 or better")
            break
        else:
            print("network not visible")
      `,
      output: `
        your-ssid uses WPA2/WPA3
      `,
      notes: ['The Arduino core already refuses networks below WPA2 by default (setMinSecurity, default WPA2); the program makes the decision visible.', 'A transition-mode network (WPA2/WPA3) lets a device that supports WPA3 use it; the ESP decides which according to the network and its own settings.']
    }
  ],
  quiz: [
    { q: 'What does WPA3\'s SAE protect against that WPA2-PSK does not?', choices: ['Offline guessing of the password from a recorded handshake', 'Weak antennas', 'A full DHCP pool', 'Interference from neighbouring channels'], a: 0, why: 'In WPA2 a recorded handshake can be tried against guessed passwords offline. SAE makes each guess a live exchange with the access point, and also gives forward secrecy.' },
    { q: 'Hiding the SSID is a good way to secure a network.', a: false, why: 'The name is transmitted in the clear whenever a device joins or probes, so hiding it hides nothing from anyone listening. Use a strong passphrase instead.' },
    { q: 'Your device is on a WPA3 network and sends a password to a web server over plain HTTP. Who can read it?', choices: ['Nobody: the Wi-Fi is encrypted', 'Anyone on the path beyond the access point', 'Only the neighbours', 'Only the router\'s manufacturer'], a: 1, why: 'Wi-Fi encryption ends at the access point. Beyond it the data travels the internet in the clear unless the application uses TLS.' },
    { q: 'Which feature stops forged "you are disconnected" messages?', choices: ['Hidden SSID', 'MAC filtering', 'Protected management frames', 'A longer beacon interval'], a: 2, why: 'Protected management frames authenticate deauthentication and similar messages. WPA3 requires them; WPA2 networks can enable them.' }
  ],
  applications: [
    'Choosing the mode of the router that your devices will live on: a long WPA2/WPA3 passphrase and a separate IoT network ([[wifi-network-security]]).',
    'Office and campus deployments, where devices join an enterprise network with their own credentials and a CA certificate.',
    'Product design: refusing open and WEP networks, and speaking TLS regardless of the Wi-Fi mode ([[tls-on-esp]]).',
    'Reading a scan: spotting open or WEP networks on your own premises that should be fixed ([[wifi-scanning]]).'
  ],
  sources: [
    'IEEE Std 802.11 (the 2020 revision), the security clauses: the four-way handshake, SAE and protected management frames; Wi-Fi Alliance, *WPA3 Specification*.',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": security modes, WPA3 and enterprise support.',
    'Arduino core for ESP32: the WiFiClientEnterprise example and the setMinSecurity API (core 3.3).'
  ],
  sim: { id: 'wf-join', params: { focus: 'handshake' } }
},

/* ================================================================ Wi-Fi 6 on the C6, C5, C61 */
{
  id: 'wifi-6-on-esp',
  parent: 'wifi',
  title: 'Wi-Fi 6 on the C6, C5 and C61',
  level: 2,
  short: 'Wi-Fi 6 changes how a network shares the air, not how fast one small device goes. What target wake time and OFDMA give a battery sensor in a crowded home, what they do not give, and which chips have it.',
  keywords: ['Wi-Fi 6', '802.11ax', 'target wake time', 'TWT', 'OFDMA', 'BSS colouring', 'MU-MIMO', 'ESP32-C6', 'ESP32-C5', 'ESP32-C61', 'ESP32-S31', 'HE', 'spatial reuse', 'crowded Wi-Fi', 'battery Wi-Fi'],
  prereq: ['wifi-basics', 'wifi-station'],
  related: ['wifi-power-save-and-dtim', 'soc-esp32-c6', 'soc-esp32-c5', 'soc-esp32-c61', 'the-newest-chips', 'power-modes', 'battery-life-budget'],
  body: `Wi-Fi 6 (802.11ax) is mostly a change in how a network **shares** the air, not in how fast a single device goes. Four chips of the family have it: the ESP32-C6, C5, C61 and S31. All use it on 2.4 GHz (the C5 also on 5 GHz), and in their 802.11ax mode all use channels 20 MHz wide, as a station, with one antenna. The catalogue gives them the same 150 Mbit/s ceiling as the Wi-Fi 4 chips with 40 MHz channels. If you want speed, Wi-Fi 6 on these chips is not the reason to choose them.

### What it gives a small device

- **Target wake time (TWT).** Station and access point agree when the station will wake and talk; between those moments it sleeps, through all the beacons, yet stays associated. A sensor that reports once a minute can spend almost all its time asleep. The simulation compares it with ordinary power save ([[wifi-power-save-and-dtim]]).
- **OFDMA.** The access point splits a channel into small *resource units* and serves several stations in one transmission instead of one after another. A crowd of small devices sending small messages, which is what a smart home is, waits less for its turn.
- **BSS colouring and spatial reuse.** Every frame carries a colour for its network, so a station can recognise a distant network on the same channel and transmit anyway instead of waiting.
- **MU-MIMO (downlink).** An access point with several antennas talks to several stations at once. The catalogue lists it for the C6, C5 and C61; with one antenna the ESP only benefits from the router's side.

### What it does not give

Not speed, not range, and not a lower current while awake: the catalogue's receive currents (82 mA on the C6, 90 on the C61, 110 on the C5, 117 on the S31) are no lower than those of the Wi-Fi 4 ESP32-C3 (87 mA) or the ESP32 (100 mA). The saving comes from sleeping more, not from listening more cheaply. And **all of it needs an access point that speaks Wi-Fi 6**, with TWT enabled, which many home routers leave off or do not offer; against an older router the chip falls back to Wi-Fi 4 and nothing is lost, and nothing gained.

### Which chip

The **ESP32-C6** adds Zigbee and Thread and sleeps at 7 µA. The **ESP32-C61** is the cheapest way to Wi-Fi 6 and, unlike the C6, supports PSRAM; its software support is still catching up. The **ESP32-C5** adds the 5 GHz band. The **ESP32-S31** is the most complete radio chip, but at the time of writing (October 2026) its software support is a preview.

> [!key] Wi-Fi 6 on the ESP32-C6, C5, C61 and S31 is about crowded air and battery life, through target wake time and OFDMA, not about speed: still 20 MHz and one antenna. Its benefits need a Wi-Fi 6 access point with TWT on.`,
  ideas: [
    'Wi-Fi 6 chips of the family: ESP32-C6, C5, C61 and S31; 2.4 GHz everywhere, 5 GHz as well on the C5.',
    'In 802.11ax mode they use 20 MHz channels and one antenna: no speed advantage over Wi-Fi 4 chips.',
    'Target wake time lets a station sleep until an agreed moment; OFDMA and BSS colouring help crowded networks.',
    'Every benefit needs a Wi-Fi 6 access point, with TWT enabled; otherwise the chip behaves as Wi-Fi 4.'
  ],
  pitfalls: [
    'Wi-Fi 6 means a faster ESP — The chips are limited to 20 MHz channels and one antenna in 802.11ax mode, and the catalogue lists the same 150 Mbit/s class as Wi-Fi 4 chips.',
    'Wi-Fi 6 lowers the current while the radio is on — Receive currents of 82 to 117 mA are in line with older chips. The saving comes from sleeping through beacons with TWT.',
    'The ESP32-C6 can join my 5 GHz Wi-Fi 6 network — Only the ESP32-C5 has a 5 GHz radio. The C6 uses 2.4 GHz only.'
  ],
  terms: [
    { term: 'Wi-Fi 6', also: ['802.11ax', 'HE', 'High Efficiency'], def: 'The generation of Wi-Fi defined by 802.11ax. Its aim is efficiency with many devices: better sharing of the air and better power saving, rather than higher speed for one device.' },
    { term: 'Target wake time', also: ['TWT'], def: 'An agreement between a station and an access point about when the station will wake and exchange data. Between those times it can sleep through beacons, which saves battery.' },
    { term: 'OFDMA', also: ['resource unit', 'RU'], def: 'Orthogonal frequency-division multiple access: the access point divides a channel into small resource units and serves several stations in the same transmission.' },
    { term: 'BSS colouring', also: ['spatial reuse', 'BSS colour'], def: 'A small number in every frame that says which network it belongs to, so a station can ignore a distant network on the same channel and transmit without waiting.' },
    { term: 'MU-MIMO', also: ['multi-user MIMO'], def: 'A technique by which an access point with several antennas sends different data to several stations at the same time.' }
  ],
  choose: {
    good: ['Battery sensors in a home with a Wi-Fi 6 router that supports TWT', 'Homes with dozens of small devices on one router', 'Matter and Thread devices that also need Wi-Fi 6 (ESP32-C6)'],
    avoid: ['Expecting more speed or range than a Wi-Fi 4 ESP32', 'Choosing Wi-Fi 6 when the router is old: nothing will use it', 'The ESP32-S31 for a first project: its software support is only a preview'],
    check: ['That the router supports and has enabled target wake time', 'Which band the network uses: 5 GHz needs the ESP32-C5', 'The software support of the chip in your framework, as of today']
  },
  examples: [
    {
      title: 'What does target wake time save?',
      q: 'An ESP32-C6 sensor stays connected to its router. With ordinary power save it wakes for every beacon, 3 ms every 102.4 ms. With TWT it wakes every 10 s for 10 ms. Using the catalogue\'s receive current of 82 mA and light-sleep current of 180 µA, compare the average currents. (The wake times are assumptions.)',
      steps: ['Ordinary power save: the radio is on for $3 / 102.4 = 2.9$ % of the time, so the average is $0.029 \\times 82 + 0.971 \\times 0.18 \\approx 2.4 + 0.17 = 2.6$ mA.', 'With TWT: $10\\,\\mathrm{ms} / 10\\,\\mathrm{s} = 0.1$ % of the time, so $0.001 \\times 82 + 0.999 \\times 0.18 \\approx 0.08 + 0.18 = 0.26$ mA.', 'The sleeping part now dominates, so the sleep current of the whole board matters more than the radio ([[the-board-is-not-the-chip]]).'],
      a: 'About 2.6 mA against 0.26 mA: ten times less, because the radio no longer wakes for every beacon. A real device adds the time to send its data and the board\'s own consumption.'
    }
  ],
  quiz: [
    { q: 'What is the main benefit of Wi-Fi 6 for a battery-powered ESP32-C6 sensor?', choices: ['Much higher speed', 'Target wake time: sleeping through beacons until an agreed moment', 'Longer range', 'Access to 5 GHz'], a: 1, why: 'The C6 has the same 20 MHz and one antenna in 802.11ax mode, so speed and range do not change, and it has no 5 GHz radio. TWT lets it sleep for long stretches while staying associated.' },
    { q: 'An ESP32-C6 joins an old Wi-Fi 4 router. What happens?', choices: ['It cannot join', 'It joins and behaves as a Wi-Fi 4 device', 'It joins and gets Wi-Fi 6 features anyway', 'It switches to 5 GHz'], a: 1, why: 'Wi-Fi 6 features need an access point that supports them. Against an older router the chip falls back to 802.11n.' },
    { q: 'Which chip of the family has Wi-Fi 6 on 5 GHz?', choices: ['ESP32-C6', 'ESP32-C61', 'ESP32-C5', 'ESP32-S3'], a: 2, why: 'The ESP32-C5 is the only dual-band chip. The C6 and C61 have Wi-Fi 6 on 2.4 GHz only, and the S3 has Wi-Fi 4.' },
    { q: 'Wi-Fi 6 chips draw much less current than Wi-Fi 4 chips while receiving.', a: false, why: 'The catalogue lists 82 to 117 mA for the Wi-Fi 6 chips against 87 and 100 mA for the ESP32-C3 and ESP32. The saving comes from time spent asleep, not from cheaper listening.' }
  ],
  applications: [
    'Battery sensors and door contacts on a modern home router, where TWT cuts the radio\'s duty cycle.',
    'Homes and offices with dozens of IoT devices, where OFDMA lets the router serve them together.',
    'Matter over Wi-Fi devices built on the ESP32-C6 ([[matter-on-esp]]).',
    'Dual-band products that move off the crowded 2.4 GHz band on the ESP32-C5 ([[five-ghz-and-six-ghz]]).'
  ],
  sources: [
    'IEEE Std 802.11ax-2021 (Wi-Fi 6): target wake time, OFDMA, BSS colouring; Wi-Fi Alliance, *Wi-Fi 6 Certification* programme.',
    'Espressif, datasheets of the ESP32-C6, ESP32-C5 and ESP32-C61: the Wi-Fi feature lists and electrical characteristics.',
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the Wi-Fi 6 features and target wake time.'
  ],
  sim: { id: 'wf-beacon', params: { scheme: 'twt' } }
},

/* ================================================================ long-range mode */
{
  id: 'wifi-long-range-mode',
  parent: 'wifi',
  title: 'Espressif\'s long-range mode',
  level: 3,
  short: 'A proprietary mode that works only between two Espressif chips: slower, but able to decode a weaker signal. What it changes, what it costs, why it is not standard Wi-Fi, and when two boards of your own can use it.',
  keywords: ['long range', 'LR mode', 'WIFI_PROTOCOL_LR', 'enableLongRange', 'PROTOCOL_LR', '500 kbit/s', '250 kbit/s', 'proprietary', 'Espressif only', 'range extension', 'ESP-NOW long range', 'sensitivity'],
  prereq: ['wifi-station', 'link-budget'],
  related: ['esp-now', 'rssi-and-signal-quality', 'range-and-obstacles', 'external-antennas', 'lora', 'transmit-power-and-regulations', 'wifi-basics'],
  body: `Espressif's **long-range (LR) mode** is a proprietary variant of Wi-Fi's physical layer. It is not part of the 802.11 standard, so phones, laptops and routers cannot see it, join it or talk to it: it works only between two Espressif chips that both have it switched on.

### What it changes

Ordinary Wi-Fi picks a rate to suit the signal, and the slowest standard rate is 1 Mbit/s. LR goes below that: it sends every bit with extra error-correcting redundancy at about 500 or 250 kbit/s, so the receiver can decode a weaker signal. That is a gain in **sensitivity** of a few decibels over the slowest standard rate. Each 6 dB doubles the free-space range, so a few decibels are a modest gain, not a miracle: Espressif quotes ranges of up to a kilometre in open country in ideal conditions, and a house with walls is another matter. The range simulation models the gain as an assumption, so that you can see how little distance it buys against walls.

### What it costs

- **Speed and airtime.** A 250-byte message at 500 kbit/s needs about 4 ms on the air, plus preamble and headers, against 2 ms at 1 Mbit/s: more energy per message and more chance of colliding with other networks.
- **Compatibility.** An LR-only station sees only LR access points, and a normal access point is invisible to it. Other protocol bits can be combined with LR so that one access point serves both kinds (MicroPython ORs the LR constant with the default set; the Arduino switch selects LR alone).
- **Chips.** LR exists on 2.4 GHz only. The MicroPython documentation states that the ESP32-C2 does not support it, and chips without Wi-Fi have none. ESP-NOW has long-range options of its own ([[esp-now]]).
- **Rules.** LR uses the same band under the same power limits: it does not entitle you to transmit more, and long frames occupy the band longer. Check your country's rules ([[transmit-power-and-regulations]]).

### When it makes sense

Two Espressif boards you control at both ends, a little beyond the reach of ordinary Wi-Fi, with small amounts of data: a sensor at the end of a garden talking to a hub, a gate controller. Before reaching for it, try the cheaper cures: a better position or antenna helps every device ([[external-antennas]], [[antenna-placement-and-enclosures]]). For real distances, a different radio such as LoRa is the honest answer ([[lora]]).

> [!key] LR mode is Espressif's proprietary, slower and more sensitive Wi-Fi, usable only between two Espressif chips that both enable it. It buys a few decibels of range for much lower speed; try a better antenna first, and use LoRa for real distance.`,
  ideas: [
    'LR mode is not standard Wi-Fi: only two Espressif chips with it enabled can talk, and no phone or router can see them.',
    'It sends at about 500 or 250 kbit/s with extra redundancy, which gains a few decibels of sensitivity over the slowest standard rate.',
    'The price is speed, airtime and energy per message; the same band and the same power limits apply.',
    'It works on 2.4 GHz only, and not on the ESP32-C2; try a better antenna or position first.'
  ],
  pitfalls: [
    'LR mode lets my phone connect from a kilometre away — Phones and routers cannot see LR at all. It links two Espressif chips and nothing else.',
    'LR lets me transmit at higher power — The power limits are those of the band. LR improves what the receiver can decode, not what the law lets you send.',
    'A few extra decibels will double my range — A doubling needs 6 dB in free space, and walls swallow a few decibels each. The gain is real but modest.'
  ],
  terms: [
    { term: 'Long-range mode', also: ['LR mode', 'WIFI_PROTOCOL_LR', 'Espressif LR'], def: 'An Espressif-only Wi-Fi mode that trades speed (about 500 or 250 kbit/s) for sensitivity, by adding redundancy to each bit. It is not part of the 802.11 standard.' },
    { term: 'Forward error correction', also: ['FEC', 'coding', 'redundancy'], def: 'Sending extra bits with the data so that the receiver can repair errors. More redundancy lets a weaker signal be decoded, at the cost of a lower data rate.' },
    { term: 'Proprietary protocol', also: ['vendor-specific', 'non-standard'], def: 'A protocol defined by one manufacturer rather than by a standard. Only devices that implement it can use it, which limits where it can be used.' },
    { term: 'Protocol mode', also: ['WIFI_PROTOCOL', 'PROTOCOL_DEFAULT'], def: 'The set of Wi-Fi standards (802.11b, g, n, ax, LR) an interface is allowed to use. Setting only LR makes the interface speak nothing else.' }
  ],
  choose: {
    good: ['Two Espressif boards you control, a little beyond ordinary Wi-Fi range, sending small messages', 'Experiments with ESP-NOW over long range where both ends are yours', 'Places where a better antenna cannot be fitted'],
    avoid: ['Any link to a phone, laptop or router', 'High data rates or many messages: airtime grows', 'Distances where the honest answer is LoRa or a cellular link'],
    check: ['That both ends are chips that support LR (not the ESP32-C2) and have it enabled', 'The measured signal strength at the real distance, with walls', 'The legal power and duty limits in your country']
  },
  code: [
    {
      title: 'A long-range link between two ESP boards',
      about: 'The same program for both boards. One is the access point, the other the station; both use long-range mode only. The access point counts its stations, the station prints the signal strength.',
      needs: 'Two Espressif boards with 2.4 GHz Wi-Fi, not an ESP32-C2. Flash one with IS_ACCESS_POINT true and the other with false. The password is for the link: eight characters or more.',
      blocks: `
        when started
          start serial at (115200) baud
          set Wi-Fi mode to [long range only v] :: wifi
          if <(is access point) = [true]> then
            start access point [lr-link] password [lr-password-123]
          else
            connect to Wi-Fi [lr-link] password [lr-password-123]
          end
        forever
          if <(is access point) = [true]> then
            print (join [stations: ] (number of stations))
          else
            if <Wi-Fi connected?> then
              print (join [linked, RSSI ] (signal strength))
            else
              print [searching...]
            end
          end
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const bool IS_ACCESS_POINT = true;        // flash false on the second board
        const char *NAME = "lr-link";
        const char *PASS = "lr-password-123";     // eight characters or more

        void setup() {
          Serial.begin(115200);
          WiFi.enableLongRange(true);             // long range only; call it before the mode is set
          if (IS_ACCESS_POINT) {
            WiFi.mode(WIFI_AP);
            WiFi.softAP(NAME, PASS);
          } else {
            WiFi.mode(WIFI_STA);
            WiFi.begin(NAME, PASS);
          }
        }

        void loop() {
          if (IS_ACCESS_POINT) {
            Serial.printf("stations: %d\n", WiFi.softAPgetStationNum());
          } else if (WiFi.status() == WL_CONNECTED) {
            Serial.printf("linked, RSSI %d dBm\n", WiFi.RSSI());
          } else {
            Serial.println("searching...");
          }
          delay(2000);
        }
      `,
      py: String.raw`
        import network, time

        IS_ACCESS_POINT = True                    # set False on the second board
        NAME = "lr-link"
        PASS = "lr-password-123"                  # eight characters or more

        if IS_ACCESS_POINT:
            wlan = network.WLAN(network.WLAN.IF_AP)
            wlan.active(True)
            wlan.config(protocol=network.WLAN.PROTOCOL_LR)            # long range only
            wlan.config(ssid=NAME, password=PASS, security=network.WLAN.SEC_WPA2)
        else:
            wlan = network.WLAN(network.WLAN.IF_STA)
            wlan.active(True)
            wlan.config(protocol=network.WLAN.PROTOCOL_LR)
            wlan.connect(NAME, PASS)

        while True:
            if IS_ACCESS_POINT:
                print("stations:", len(wlan.status("stations")))
            elif wlan.isconnected():
                print("linked, RSSI", wlan.status("rssi"), "dBm")
            else:
                print("searching...")
            time.sleep(2)
      `,
      output: `
        searching...
        linked, RSSI -81 dBm
        linked, RSSI -82 dBm
      `,
      notes: ['The Arduino call selects long range alone; to serve normal stations as well, use the ESP-IDF protocol setting to combine LR with the standard modes.', 'Nothing else on the network, a phone included, can see this access point.']
    }
  ],
  quiz: [
    { q: 'Can a phone join an access point that runs in LR-only mode?', choices: ['Yes, with a weaker signal', 'Yes, at 250 kbit/s', 'No: LR is not standard Wi-Fi and only Espressif chips can speak it', 'Only on 5 GHz'], a: 2, why: 'LR is a proprietary mode. Phones, laptops and routers do not implement it, so they cannot even see the network.' },
    { q: 'What does LR mode give up in exchange for its sensitivity?', choices: ['Security', 'Speed: it runs at about 500 or 250 kbit/s', 'Channel choice', 'The password'], a: 1, why: 'The extra redundancy that lets the receiver decode a weaker signal makes every bit longer on the air.' },
    { q: 'LR mode allows a higher transmit power than ordinary Wi-Fi.', a: false, why: 'Power limits belong to the band and to your country\'s rules. LR improves what the receiver can decode, not what you may transmit.' },
    { q: 'Your link falls a little short. What should you try before LR mode?', choices: ['Nothing: LR is always best', 'A better antenna or position, which helps every device', 'A shorter password', 'A different framework'], a: 1, why: 'A few decibels from an external antenna or a position outside a metal box often matter as much as LR, and they keep the link standard.' }
  ],
  applications: [
    'A garden or barn sensor that is just beyond the reach of the house router, linked to an ESP32 hub of your own.',
    'Remote controls and gate or door controllers between two boards at distances a little beyond ordinary Wi-Fi.',
    'ESP-NOW links with long-range options between Espressif devices ([[esp-now]]).',
    'Range experiments: comparing standard Wi-Fi and LR with the same two boards and a signal meter ([[rssi-and-signal-quality]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the Long Range (LR) section.',
    'MicroPython documentation, *network.WLAN*: the PROTOCOL_LR constant and its notes (version 1.29).',
    'Arduino core for ESP32: the WiFi library, enableLongRange (core 3.3).'
  ],
  sim: { id: 'wf-range', params: { lr: true } }
},

/* ================================================================ sensing and ranging */
{
  id: 'wifi-sensing-and-ftm',
  parent: 'wifi',
  title: 'Channel state information and ranging',
  level: 3,
  short: 'Wi-Fi signals are measurements as well as messages. The signal strength of your own link as a motion sensor, channel state information as a richer one, and fine timing measurement as a tape measure. All on your own network, in outline.',
  keywords: ['CSI', 'channel state information', 'FTM', 'fine timing measurement', 'Wi-Fi RTT', 'ranging', 'presence detection', 'Wi-Fi sensing', 'RSSI variance', 'esp-csi', 'initiateFTM', '802.11mc', '802.11az', 'time of flight', 'subcarrier', 'multipath'],
  prereq: ['wifi-basics', 'wifi-station', 'rssi-and-signal-quality'],
  related: ['uwb-ranging', 'presence-and-motion-sensors', 'privacy-and-data-protection', 'esp-as-a-network-scanner', 'range-and-obstacles', 'wifi-6-on-esp'],
  body: `Radio waves bounce off walls and bodies, so a person walking across a link changes the signal. Wi-Fi therefore carries two things: messages, and a measurement of the path they took. Three tools use the measurement, all on **your own network and devices**.

### Signal strength as a sensor

The simplest is the **RSSI** of the link between the ESP and its router, read ten times a second. In an empty room it is steady to within a decibel or two; when someone crosses the path it swings by several. The variance over the last couple of seconds is a crude motion detector that needs no extra hardware. It is also fragile: the router adapts its rates, interference comes and goes, RSSI is a whole number of dB, and it refreshes about as fast as beacons arrive. Calibrate the threshold in the room; the program below does this.

### Channel state information

**CSI** is the receiver's own description of how each of the many **subcarriers** of a received packet was altered on its way, an amplitude and a phase for each: a far richer picture than one RSSI number. Research uses it for presence, breathing, gestures and positioning. In the ESP-IDF driver a callback delivers it for received frames, and the chip capability tables flag CSI for the ESP32, C3, C5, C6, C61, S2, S3 and S31 (not the C2). Espressif publishes an open-source example project for it. It needs a steady flow of packets from a router or a second ESP, the hard part is the signal processing, and it is available to Arduino code through the IDF, not to MicroPython.

### Fine timing measurement

**FTM** is Wi-Fi's own ranging: a station and an access point swap timestamped frames, and the round-trip time of flight gives the distance, $d = ct/2$ (the calculator). Light covers 30 cm in a nanosecond, so 10 m is a round trip of 67 ns. Clock resolution and reflections leave errors of a metre or two indoors. The capability tables flag FTM for the C2, C3, C5, C6, C61, S2, S3 and S31, not the original ESP32; the Arduino core's examples and its soft-AP responder option name only the ESP32-S2 and C3, and many consumer routers offer no FTM, so two ESPs are the usual test. **802.11az** is the newer standard.

### Responsibility

Sensing detects people. Do it in your own space with consent ([[privacy-and-data-protection]]); passive capture of other people's traffic is a different matter, and not what this page is about.

> [!key] The RSSI of your own link is a crude motion sensor; CSI describes every subcarrier of a packet and is a research tool; FTM measures distance from the time of flight of Wi-Fi frames, to a metre or two. Use them on your own network, with consent.`,
  ideas: [
    'A person crossing a Wi-Fi link changes its signal strength by several decibels, so the variance of RSSI is a crude motion sensor.',
    'CSI gives an amplitude and phase for every subcarrier of a received packet, a much richer measurement, available through ESP-IDF.',
    'FTM measures the round-trip time of flight of frames; 1 ns is 15 cm of distance, and real accuracy is a metre or two indoors.',
    'Use these on your own network and devices, and with the consent of the people in the room.'
  ],
  pitfalls: [
    'RSSI changing means someone moved — Interference, rate changes and the router itself move it too. Calibrate in place and use a threshold with hysteresis.',
    'FTM gives centimetre accuracy because light is fast — Clock resolution, multipath and the access point limit it to a metre or two indoors; UWB does better ([[uwb-ranging]]).',
    'Any router will answer FTM requests — Many consumer routers offer no FTM responder. Two ESPs, one as responder, are the usual way to try it.'
  ],
  terms: [
    { term: 'Channel state information', also: ['CSI'], def: 'For a received Wi-Fi packet, the measured effect of the path on each subcarrier: an amplitude and a phase per subcarrier. It is used for presence sensing, gesture recognition and positioning.' },
    { term: 'Fine timing measurement', also: ['FTM', 'Wi-Fi RTT', '802.11mc'], def: 'A Wi-Fi feature that measures the round-trip time of timestamped frames between a station and an access point, from which the distance follows.' },
    { term: 'Round-trip time', also: ['RTT', 'time of flight'], def: 'The time a signal takes to go to another device and come back. Multiplied by the speed of light and halved, it gives the distance.' },
    { term: 'Multipath', also: ['reflections'], def: 'The arrival of the same signal along several paths, by bouncing off walls and objects. It changes the signal strength and limits the accuracy of timing and positioning.' },
    { term: 'Subcarrier', also: ['OFDM tone'], def: 'One of the many narrow frequencies that make up a Wi-Fi OFDM channel. A 20 MHz channel carries 52 data and pilot subcarriers in Wi-Fi 4.' }
  ],
  choose: {
    good: ['RSSI variance as a cheap presence hint in a room you control', 'CSI projects when you can handle the signal processing and calibrate per room', 'FTM between two ESPs or with an FTM-capable access point for coarse distance'],
    avoid: ['Relying on any of them for safety, security or alarms', 'Expecting centimetre accuracy from FTM', 'Capturing other people\'s traffic or tracking people without their consent'],
    check: ['That the chip supports the feature in the ESP-IDF capability tables', 'That your access point offers an FTM responder, if you use one', 'The privacy and consent rules where the sensor will live']
  },
  formulas: [
    {
      name: 'Distance from the round-trip time',
      expr: 'd = c*t/2',
      tex: 'd = \\frac{c\\,t}{2}',
      vars: {
        d: { name: 'distance', q: 'length', unit: 'm' },
        c: { const: 'c' },
        t: { name: 'round-trip time of flight', q: 'time', unit: 'ns', value: 66.7, min: 0 }
      },
      solveFor: 'd',
      note: 'The time of flight only. The responder\'s turn-around time is subtracted by the timestamps, which is the point of FTM; clock resolution and multipath add the errors.'
    }
  ],
  examples: [
    {
      title: 'What does a timing error do?',
      q: 'An FTM measurement has a timing error of 5 ns in the round trip. How much distance error is that?',
      steps: ['The error in distance is $c\\,\\Delta t / 2 = 3\\times10^{8} \\times 5\\times10^{-9} / 2$.', 'That is $1.5 / 2 = 0.75$ m.'],
      a: 'About 0.75 m. A single nanosecond of error is 15 cm, which is why clock resolution and reflections limit Wi-Fi ranging to a metre or two.'
    }
  ],
  code: [
    {
      title: 'Detect movement from the signal strength of your own link',
      about: 'Reads the RSSI ten times a second, keeps the last 20 values and prints their mean and variance every second. A variance above the threshold says that something moved near the path between the ESP and its router.',
      needs: 'Any ESP32-family board with Wi-Fi, placed a few metres from the router. Tune THRESHOLD by watching the variance in an empty room and while walking across. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          make list [samples v]
        forever
          add (signal strength) to [samples v]
          keep last (20) of [samples v]
          if <(length of [samples v]) = (20)> then
            set [var v] to (variance of [samples v])
            if <(var) > (4)> then
              print [movement]
            else
              print [still]
            end
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const int N = 20;                         // two seconds of samples at 10 per second
        const float THRESHOLD = 4.0;              // dB squared: tune it for your room
        int samples[N];
        int count = 0;

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          samples[count % N] = WiFi.RSSI();
          count++;
          if (count >= N && count % 10 == 0) {    // report once a second
            float mean = 0, var = 0;
            for (int i = 0; i < N; i++) mean += samples[i];
            mean /= N;
            for (int i = 0; i < N; i++) var += (samples[i] - mean) * (samples[i] - mean);
            var /= N;
            Serial.printf("mean %.1f dBm  variance %.1f  %s\n", mean, var, var > THRESHOLD ? "MOVEMENT" : "still");
          }
          delay(100);
        }
      `,
      py: String.raw`
        import network, time

        N = 20                                    # two seconds of samples at 10 per second
        THRESHOLD = 4.0                           # dB squared: tune it for your room
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        samples = []
        count = 0
        while True:
            samples.append(wlan.status("rssi"))
            samples = samples[-N:]
            count += 1
            if len(samples) == N and count % 10 == 0:     # report once a second
                mean = sum(samples) / N
                var = sum((s - mean) ** 2 for s in samples) / N
                print("mean %.1f dBm  variance %.1f  %s" % (mean, var, "MOVEMENT" if var > THRESHOLD else "still"))
            time.sleep_ms(100)
      `,
      output: `
        mean -54.0 dBm  variance 0.3  still
        mean -54.1 dBm  variance 0.4  still
        mean -56.2 dBm  variance 9.8  MOVEMENT
      `,
      notes: ['The RSSI of the link refreshes about as often as beacons arrive (about every 100 ms), so some samples repeat. Steady traffic to the router makes it refresh more often.', 'In the Arduino core the FTM calls are WiFi.initiateFTM() and the softAP responder option; CSI is reached through the ESP-IDF functions. MicroPython offers neither.']
    }
  ],
  quiz: [
    { q: 'A sketch reports "MOVEMENT" whenever the router changes its data rate, with nobody in the room. What is the problem?', choices: ['The ESP has a bad antenna', 'RSSI also moves for reasons other than people, so the threshold needs calibration and hysteresis', 'The variance formula is wrong', 'RSSI cannot be read in a loop'], a: 1, why: 'RSSI reflects interference, rate adaptation and the router as well as bodies. A threshold tuned in place, and a margin before switching back, make it usable but never certain.' },
    { q: 'An FTM exchange gives a round-trip time of 100 ns. What is the distance?', choices: ['3 m', '15 m', '30 m', '150 m'], a: 1, why: 'The distance is c t / 2 = 3×10^8 × 100×10^-9 / 2 = 15 m.' },
    { q: 'CSI gives a single number, like RSSI, but more accurate.', a: false, why: 'CSI gives an amplitude and a phase for every subcarrier of a packet: dozens of values per packet, which is what makes it so much richer than RSSI.' },
    { q: 'Which statement about FTM on the ESP family is correct?', choices: ['Every chip supports it', 'The original ESP32 does not; newer chips such as the C3, S2, S3 and C6 do, according to the capability tables', 'Only the ESP32-H2 does', 'It works only on 5 GHz'], a: 1, why: 'The ESP-IDF capability tables flag FTM for the C2, C3, C5, C6, C61, S2, S3 and S31, and not for the original ESP32. The H2 has no Wi-Fi.' }
  ],
  applications: [
    'A presence hint for lights or heating in a room you control, from the signal of one ESP and the router.',
    'Research and hobby projects with CSI: breathing, gestures and presence from Espressif\'s open-source example.',
    'Coarse indoor distance between two ESP boards, or from an ESP to an FTM-capable access point.',
    'Comparing with other ranging methods when you need more accuracy ([[uwb-ranging]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the Wi-Fi Channel State Information and Fine Timing Measurement sections.',
    'IEEE Std 802.11-2016 (802.11mc, fine timing measurement) and IEEE Std 802.11az-2022 (next-generation positioning).',
    'Arduino core for ESP32: the FTM initiator and responder examples (core 3.3); Espressif\'s esp-csi project.'
  ],
  sim: 'wf-sense'
},

/* ================================================================ troubleshooting */
{
  id: 'wifi-troubleshooting',
  parent: 'wifi',
  title: 'When Wi-Fi will not connect',
  level: 1,
  short: 'The page people arrive at in distress. A table from symptom to cause to check, with the status codes and reason numbers a program can print, and a program that says why a join failed.',
  keywords: ['will not connect', 'cannot connect to Wi-Fi', 'network not found', 'wrong password', 'brownout', 'ADC2', 'client isolation', 'AP isolation', 'MAC filtering', '5 GHz only', 'hidden SSID', 'WPA3', 'country code', 'reason 201', 'reason 15', 'WL_NO_SSID_AVAIL', 'Wi-Fi drops', 'troubleshooting'],
  prereq: ['wifi-station', 'wifi-scanning'],
  related: ['wifi-events-and-reconnection', 'brownout', 'adc1-adc2-and-wifi', 'antenna-placement-and-enclosures', 'network-troubleshooting', 'wifi-security', 'rssi-and-signal-quality'],
  body: `Almost every "my ESP will not connect" has one of a dozen causes, and the program can tell which. Print the **status** and the **reason code** of the last disconnect ([[wifi-events-and-reconnection]]), run a **scan** ([[wifi-scanning]]), and read the table.

| Symptom (status / reason) | Likely cause | Check |
|---|---|---|
| Network not found (1 / 201) | the network is 5 GHz only (only the ESP32-C5 has 5 GHz); a hidden name or a typo; too far; channels 12–14 and a wrong country setting | does the scan list the name, and on which channel? |
| Join refused (4 or 6 / 15, 202, 204) | wrong password; a WPA3-only network met by an old stack; an enterprise network | retype it; set the router to WPA2/WPA3 mixed; a long password with odd characters |
| Drops every few minutes (200, 2) | weak signal; the router restarting or changing channel | RSSI worse than −75 dBm? the router's log |
| Resets as it joins ("Brownout detector was triggered") | the supply sags when the radio starts: thin cable, hub, weak regulator | 3.3 V under load; a capacitor; another cable ([[brownout]]) |
| Analogue readings wrong only with Wi-Fi on (ESP32) | the radio owns the ADC2 pins | move the sensor to an ADC1 pin ([[adc1-adc2-and-wifi]]) |
| Linked but no address (status 0) | the DHCP pool is full, or DHCP is blocked | the router's client list ([[ip-addresses-dhcp-dns]]) |
| Router reachable, other devices not | client isolation (AP isolation) or a guest network | the router's setting |
| Works only beside the router | antenna inside a metal box or under a hand; the board antenna's keep-out ([[antenna-placement-and-enclosures]]) | move it outside; an external antenna |
| Fine alone, bad with many devices | too many clients or a crowded channel | the scan, the router's client limit |
| Some networks odd or invisible | the country setting hides channels 12–13 | set the country in the program |
| A new or replaced board never joins | MAC filtering in the router | print the ESP's MAC, add it to the allow-list |

### Codes you can print

Arduino: the status (0 idle or no address, 1 not found, 3 connected, 4 refused, 5 lost, 6 not connected) and, from the disconnect event, the reason and \`WiFi.disconnectReasonName()\`. MicroPython: \`wlan.status()\` returns 1000, 1001 or 1010, or the reason (201, 202 and others). Remember that a wrong WPA2 password may show only as "not connected" with reason 15 or 202.

### Habits

Change one thing at a time. Test with a phone's hotspot, a 2.4 GHz network of your own that you know works. Watch the supply with a meter. And write down the reason code before you reset anything.

> [!key] Print the status and the disconnect reason, scan for the name, and read the table: 5 GHz only, a wrong password, a brownout, ADC2, client isolation and a metal box account for most failures.`,
  ideas: [
    'The status and the disconnect reason code say which step of the join failed; a scan says whether the network is visible.',
    'Network not found (201) is most often a 5 GHz-only network, a typo or a hidden name; join refused (15, 202) is most often the password.',
    'Resets at the moment of joining point to the supply; wrong analogue readings with Wi-Fi on point to ADC2 on the ESP32.',
    'Connected but unreachable points to client isolation or a guest network; works only nearby points to the antenna.'
  ],
  pitfalls: [
    'The status says "wrong password" if it is wrong — A wrong WPA2 password often shows as "not connected" (6) with reason 15 or 202. Read the reason, not only the status.',
    'It connects on the bench, so the supply is fine — The radio draws 240 to 410 mA in bursts. A thin cable or a hub that is fine for a blinking LED browns out the chip when it transmits.',
    'It is the code, so I will rewrite it — Most failures are the network: the band, the password, isolation, the signal. Scan and print the reason before touching the code.'
  ],
  terms: [
    { term: 'Client isolation', also: ['AP isolation', 'guest network', 'wireless isolation'], def: 'A router setting that stops Wi-Fi devices from talking to each other, only to the router and the internet. It makes local control, mDNS and device-to-device links fail.' },
    { term: 'MAC filtering', also: ['MAC allow-list', 'MAC access control'], def: 'A router setting that accepts only devices whose hardware addresses are on a list. A new or replaced board is refused until its address is added.' },
    { term: 'Regulatory domain', also: ['country code', 'country setting'], def: 'The country whose Wi-Fi rules the radio follows: which channels may be used and how strongly it may transmit. A wrong one hides channels, such as 12 and 13.' },
    { term: 'Band steering', also: ['dual-band router'], def: 'A router feature that pushes dual-band devices to 5 GHz. A 2.4 GHz-only ESP can be confused if both bands share one network name and the router hides the 2.4 GHz one.' },
    { term: 'Brownout', also: ['brown-out detector'], def: 'A drop of the supply voltage below what the chip needs. The ESP detects it and resets, often just as the radio starts and draws its largest current.' }
  ],
  choose: {
    good: ['Printing the status, the disconnect reason and a scan result before changing anything', 'Testing against a known-good 2.4 GHz network, such as a phone hotspot', 'Measuring the supply while the radio transmits'],
    avoid: ['Changing several things at once', 'Blaming the code before looking at the band, the password and the supply', 'Resetting the router as the first and only step'],
    check: ['The reason code of the last disconnect', 'Whether the network name is in the scan, on which channel and at what signal', 'The supply voltage and the antenna position']
  },
  code: [
    {
      title: 'Say why the join failed',
      about: 'Scans for the network, tells whether it is visible and how, tries to join for 15 seconds, and on failure prints the status and the reason of the last disconnect in words. It also prints the board\'s MAC address, for a router allow-list.',
      needs: 'Any ESP32-family board with Wi-Fi and the serial monitor at 115200 baud. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [MAC: ] (MAC address))
          scan networks :: wifi
          if <(network [your-ssid] is in the scan results) = [true]> then
            print (join [seen on channel ] (channel of network [your-ssid]) [ at ] (signal of network [your-ssid]) [ dBm])
          else
            print [not in the scan: 5 GHz only? too far? hidden? wrong name?]
          end
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <<Wi-Fi connected?> or <(seconds since start) > (20)>>
          if <Wi-Fi connected?> then
            print (join [connected, IP ] (IP address))
          else
            print (join [failed: ] (Wi-Fi status text) [, reason ] (last disconnect reason))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        volatile int lastReason = 0;

        void onLost(WiFiEvent_t event, WiFiEventInfo_t info) {
          lastReason = info.wifi_sta_disconnected.reason;
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.onEvent(onLost, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
          Serial.printf("MAC: %s\n", WiFi.macAddress().c_str());

          int n = WiFi.scanNetworks();
          bool seen = false;
          for (int i = 0; i < n; i++) {
            if (WiFi.SSID(i) == SSID) {
              seen = true;
              Serial.printf("seen on channel %d at %d dBm\n", (int)WiFi.channel(i), (int)WiFi.RSSI(i));
            }
          }
          if (!seen) Serial.println("not in the scan: 5 GHz only? too far? hidden? wrong name?");

          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) delay(250);
          if (WiFi.status() == WL_CONNECTED) {
            Serial.printf("connected, IP %s\n", WiFi.localIP().toString().c_str());
          } else {
            Serial.printf("failed: status %d, reason %d (%s)\n", (int)WiFi.status(), (int)lastReason,
                          WiFi.disconnectReasonName((wifi_err_reason_t)lastReason));
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, time, binascii

        SSID = "your-ssid"
        PASS = "your-password"

        REASONS = {
            network.STAT_NO_AP_FOUND: "network not found",
            network.STAT_WRONG_PASSWORD: "authentication failed (wrong password?)",
            network.STAT_BEACON_TIMEOUT: "beacon timeout (router lost)",
            network.STAT_ASSOC_FAIL: "association refused",
            network.STAT_HANDSHAKE_TIMEOUT: "handshake timed out (wrong password?)",
        }

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        print("MAC:", binascii.hexlify(wlan.config("mac"), ":").decode())

        seen = False
        for ssid, bssid, channel, rssi, auth, hidden in wlan.scan():
            if ssid.decode() == SSID:
                seen = True
                print("seen on channel %d at %d dBm" % (channel, rssi))
        if not seen:
            print("not in the scan: 5 GHz only? too far? hidden? wrong name?")

        wlan.connect(SSID, PASS)
        t0 = time.ticks_ms()
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 15000:
            time.sleep_ms(250)
        if wlan.isconnected():
            print("connected, IP", wlan.ipconfig("addr4")[0])
        else:
            status = wlan.status()
            print("failed: status", status, REASONS.get(status, "still connecting or idle"))
      `,
      output: `
        MAC: 7C:DF:A1:B2:C3:D4
        not in the scan: 5 GHz only? too far? hidden? wrong name?
        failed: status 1, reason 201 (NO_AP_FOUND)
      `,
      notes: ['The Arduino status after a failure is often 1 (not found) or 6 (not connected): the reason code carries more.', 'Set the country if channels 12 and 13 matter: network.country("DE") in MicroPython, the ESP-IDF call esp_wifi_set_country_code() in Arduino code.']
    }
  ],
  quiz: [
    { q: 'The scan lists no network with your router\'s name, though your phone sees it and you are one metre away. What is the most likely cause?', choices: ['A wrong password', 'The network is 5 GHz only and the chip has no 5 GHz radio', 'A brownout', 'Client isolation'], a: 1, why: 'A password is checked after the network is found, a brownout resets the board, and isolation acts after joining. Only the ESP32-C5 can see 5 GHz networks; the others need the router\'s 2.4 GHz network.' },
    { q: 'An ESP32 resets just as it connects, with "Brownout detector was triggered" on the serial monitor. What do you check first?', choices: ['The password', 'The supply: cable, hub and regulator under the radio\'s current bursts', 'The channel', 'The hostname'], a: 1, why: 'The radio draws 240 to 410 mA when it transmits. A supply that holds up an LED may sag below the chip\'s limit at that moment.' },
    { q: 'The ESP joins and the router answers pings, but a phone on the same Wi-Fi cannot reach the ESP. What is the likely cause?', choices: ['A wrong subnet mask in the phone', 'Client isolation or a guest network on the router', 'The channel number', 'A weak antenna'], a: 1, why: 'Link and address are fine, since the router answers. Isolation stops Wi-Fi devices from talking to each other.' },
    { q: 'On an original ESP32, analogue readings on GPIO25 become nonsense only while Wi-Fi is on. Why?', choices: ['The pin is damaged', 'GPIO25 is an ADC2 pin, which the Wi-Fi driver uses', 'Wi-Fi interferes with the DAC only', 'The reference voltage rises'], a: 1, why: 'On the original ESP32 the radio takes the ADC2 unit while it runs. Use an ADC1 pin for analogue inputs in projects that use Wi-Fi ([[adc1-adc2-and-wifi]]).' }
  ],
  applications: [
    'Support for a device in the field: ask for the printed status, reason and scan line.',
    'Bench bring-up of a new board: confirming band, password, supply and antenna one at a time.',
    'Choosing hardware and installation: avoiding the metal enclosure and the thin cable before they cost days.',
    'Building a diagnostic page into a product, so that users can read why it will not join ([[network-troubleshooting]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Wi-Fi Driver": the Wi-Fi reason code table and the connection scenario.',
    'Arduino core for ESP32 documentation, *Wi-Fi API*: status values, events and disconnectReasonName (core 3.3).',
    'MicroPython documentation, *network.WLAN*: status values and the country function (version 1.29).'
  ],
  sim: { id: 'wf-join', params: { focus: 'faults' } }
}
);
