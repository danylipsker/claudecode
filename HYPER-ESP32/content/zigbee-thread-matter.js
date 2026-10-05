/* HYPER-ESP32 · content/zigbee-thread-matter.js
 *
 * Topic "zigbee-thread-matter": IEEE 802.15.4 underneath; Zigbee, its devices and clusters, Zigbee on the C6 and H2 and with
 * Home Assistant; Thread, OpenThread and the border router; Matter, commissioning and Matter on an ESP; and choosing a
 * smart-home radio. Simulations: sims/zigbee-thread-matter.js (zt-*). Programs follow API-CRIB.md task 28; MicroPython has
 * no Zigbee, Thread or Matter support, and says so in `na`.
 */
Hyper.add(
/* ================================================================ ieee-802-15-4 */
{
  id: 'ieee-802-15-4',
  parent: 'zigbee-thread-matter',
  title: 'IEEE 802.15.4',
  level: 2,
  short: 'The radio standard under Zigbee and Thread: tiny 127-byte frames at 250 kbit/s on sixteen channels of the 2.4 GHz band, made for devices that sleep nearly all the time. It is why the C6, H2 and C5 carry a second radio.',
  keywords: ['802.15.4', 'IEEE 802.15.4', 'O-QPSK', '250 kbit/s', 'PAN ID', 'channel 11', 'channel 26', 'frame', '127 bytes', 'CSMA-CA', '6LoWPAN', 'LR-WPAN', 'short address', 'Zigbee channel', 'Thread channel'],
  prereq: ['radio-basics', 'interference-and-channels', 'the-shared-radio'],
  related: ['zigbee', 'thread', 'wifi-basics', 'ble-advertising', 'sleepy-ble-zigbee-thread', 'range-and-obstacles', 'zigbee-with-home-assistant', 'soc-esp32-h2'],
  body: `Wi-Fi was designed to move video; IEEE 802.15.4 was designed to move a light switch. It is the standard for **low-rate, low-power, short-range** radio, and it is the layer underneath both [[zigbee|Zigbee]] and [[thread|Thread]]. The ESP32-C6, H2 and C5 carry a radio for it beside their Wi-Fi and Bluetooth radios (the S31, H4 and H21 add it too, still in preview or announced); the original ESP32 and the S2, S3 and C3 have none at all.

### What the radio does

On the 2.4 GHz band, the only one ESP chips use for it, the standard has **16 channels numbered 11 to 26**, spaced 5 MHz apart from 2405 MHz and each about 2 MHz wide. Data goes at **250 kbit/s**: about six hundred times slower than the 150 Mbit/s of a Wi-Fi link. The slowness buys sensitivity. Receivers hear signals around −100 dBm, and the ESP32-H2, which has no Wi-Fi, lists 25 mA while receiving and 7 µA asleep.

A frame carries at most **127 bytes**, plus 6 bytes of preamble and length in front: 133 bytes, **4.3 ms** on the air. Inside the 127 go a short MAC header (frame control, sequence number, addresses), the payload and a 2-byte checksum. After security and the network layer take their share an application is left with roughly eighty bytes. That suits "on", "21.5 °C" and "battery 87 %", and nowhere near a web page, which is why Thread must compress IPv6 headers and split big packets into fragments.

### Addresses, the PAN and listening first

Every device has a 64-bit **extended address** from the factory. Joining a network gives it a 16-bit **short address**, and all the devices of one network share a **PAN ID** (a 16-bit network name) and a channel. Radios listen before they talk (CSMA-CA: if the channel is busy, wait a random time and try again) and the receiver acknowledges each unicast frame within a fraction of a millisecond; the sender retries a few times. That is reliability at the link, before Zigbee or Thread add their own.

### Choosing a channel

The channels share the band with Wi-Fi, whose 20 MHz channels are 22 MHz wide at the mask. Wi-Fi 1 covers 802.15.4 channels 11 to 14, Wi-Fi 6 covers 16 to 19, Wi-Fi 11 covers 21 to 24. What the usual 1, 6, 11 plan leaves clear is **15, 20, 25 and 26**. Wi-Fi's edges leak, so a clear channel with a margin is better; channel 26 sits at the very edge of the band, where some devices must lower their power. The simulation draws all sixteen against the Wi-Fi networks of your choice.

> [!key] 802.15.4 is a slow, frugal radio: 250 kbit/s, 127-byte frames, 16 channels from 2405 MHz, acknowledged frames and listen-before-talk. Zigbee and Thread share it; pick a channel in the gap between your Wi-Fi networks, 15, 20, 25 or 26 for the usual plan.`,
  ideas: [
    'The standard has 16 channels, 11 to 26, 5 MHz apart from 2405 MHz, with 250 kbit/s on each.',
    'A frame holds at most 127 bytes: enough for a command or a reading, far too small for a web page.',
    'Devices have a 64-bit address from the factory and a 16-bit one once they join a network with a PAN ID.',
    'The channels overlap Wi-Fi: with Wi-Fi on 1, 6 and 11 the clear ones are 15, 20, 25 and 26.'
  ],
  pitfalls: [
    'Any ESP32 can join a Zigbee or Thread network — Only chips with an 802.15.4 radio can: the C6, H2 and C5 (and later the S31). The ESP32, S2, S3 and C3 need a separate radio chip.',
    'The Wi-Fi hardware of the C6 can listen for Zigbee — Wi-Fi and 802.15.4 use different modulation and protocol hardware, even where a chip shares one antenna between them. A phone has no 802.15.4 radio either, which is why such devices are set up over Bluetooth LE or through a hub.',
    'A clear channel stays clear — Wi-Fi networks move and neighbours arrive. Choose a channel with a margin, and revisit it if a network starts to lose messages.'
  ],
  terms: [
    { term: 'IEEE 802.15.4', also: ['802.15.4', 'LR-WPAN', 'low-rate wireless personal area network'], def: 'The standard for low-rate, low-power, short-range radio networks. On 2.4 GHz it gives 250 kbit/s in 127-byte frames. Zigbee and Thread are built on it.' },
    { term: 'PAN ID', also: ['personal area network identifier'], def: 'A 16-bit number that names one 802.15.4 network. Devices of the same network share it, and the channel, and ignore frames of other PANs.' },
    { term: 'Extended address', also: ['EUI-64', 'IEEE address', '64-bit address'], def: 'The 64-bit address burned into every 802.15.4 device at the factory, unique like an Ethernet MAC address.' },
    { term: 'Short address', also: ['16-bit address', 'network address'], def: 'A 16-bit address given to a device when it joins a network. It keeps frames short; it can change if the device rejoins.' },
    { term: 'CSMA-CA', also: ['carrier sense multiple access with collision avoidance', 'listen before talk'], def: 'The access rule of the radio: listen first, and if the channel is busy wait a random time and try again, so that two devices rarely start at once.' }
  ],
  choose: {
    good: ['Battery devices that send a few bytes now and then', 'Meshes of mains devices that relay for each other', 'Rooms where Wi-Fi is crowded or too hungry for a coin cell'],
    avoid: ['Streaming, cameras or firmware images of megabytes: it is slow', 'A chip without the radio: the ESP32, S2, S3 and C3', 'Direct connection to a phone: phones have no 802.15.4 radio'],
    check: ['Which channels your Wi-Fi networks use', 'That your chip is a C6, H2 or C5', 'Your country\'s rules on power and on the band-edge channels']
  },
  formulas: [
    {
      name: 'Time on the air of one frame',
      expr: 't = 8*(L + 6)/R',
      tex: 't = \\frac{8\\,(L + 6)}{R}',
      vars: {
        t: { name: 'time on the air', q: 'time', unit: 'ms' },
        L: { name: 'frame length (PSDU)', unit: 'bytes', value: 127, min: 5, max: 127 },
        R: { name: 'data rate', q: 'datarate', unit: 'kbit/s', value: 250 }
      },
      note: 'The 6 bytes are the 4-byte preamble, the start-of-frame delimiter and the length byte. 250 kbit/s is the rate of the 2.4 GHz radio of every ESP32 chip with 802.15.4. Acknowledgement and waiting come on top.',
      stories: { t: 'A frame of {L} bytes goes out at {R}. How long does it occupy the channel?' },
      practice: { unknowns: ['t'] }
    }
  ],
  examples: [
    {
      title: 'How many frames does an IPv6 packet need?',
      q: 'Thread carries IPv6, whose smallest guaranteed packet is 1280 bytes. If each 802.15.4 frame carries about 95 bytes of it after header compression, how many frames and how much air time does one such packet take?',
      steps: ['Frames: $1280 / 95 = 13.5$, so 14 frames.', 'Each full frame is up to 133 bytes on the air: $8 \\times 133 / 250000 = 4.3$ ms.', 'Total: about $14 \\times 4.3 = 60$ ms of air time, before acknowledgements, waiting and retries.'],
      a: 'Fourteen frames and at least 60 ms. Such big packets are the exception: Thread messages for a light switch fit in one frame.'
    }
  ],
  quiz: [
    { q: 'Wi-Fi networks sit on channels 1, 6 and 11. Which 802.15.4 channels are clear of their masks?', choices: ['11, 12, 13, 14', '15, 20, 25, 26', '16, 17, 18, 19', '21, 22, 23, 24'], a: 1, why: 'Wi-Fi 1 covers 11 to 14, Wi-Fi 6 covers 16 to 19 and Wi-Fi 11 covers 21 to 24. What is left are 15, 20, 25 and 26.' },
    { q: 'How long does a full 127-byte frame occupy the channel at 250 kbit/s?', choices: ['0.43 ms', '4.3 ms', '43 ms', '0.5 s'], a: 1, why: 'With 6 bytes of preamble and length in front, 133 bytes are 1064 bits, and 1064 / 250 000 is 4.26 ms.' },
    { q: 'An ESP32-S3 can join a Thread network with nothing added.', a: false, why: 'The S3 has Wi-Fi and Bluetooth LE but no 802.15.4 radio. It can be a Thread border router only together with a second chip, such as an H2, that carries the radio.' },
    { q: 'Why does Thread compress IPv6 headers and fragment big packets?', choices: ['To hide the data', 'Because 802.15.4 frames hold at most 127 bytes', 'Because the radio is half-duplex', 'To save channels'], a: 1, why: 'An uncompressed IPv6 packet header alone is 40 bytes, and a 1280-byte packet cannot fit one frame. Compression and fragmentation make IP workable on a 127-byte link.' }
  ],
  applications: [
    'The radio of every Zigbee lamp, plug, sensor and remote.',
    'The radio of every Thread device and border router, and so of Matter over Thread.',
    'Coin-cell sensors that must run for years and send a few bytes an hour.',
    'Channel planning: choosing the channel of a Zigbee or Thread network away from the home\'s Wi-Fi.'
  ],
  sources: [
    'IEEE, *IEEE Std 802.15.4*, the 2.4 GHz O-QPSK physical layer and the MAC frame format.',
    'Espressif, *ESP32-H2 Series Datasheet* and *ESP32-C6 Series Datasheet*: the 802.15.4 radio characteristics.',
    'Espressif, *ESP-IDF Programming Guide*, IEEE 802.15.4 and OpenThread documentation.'
  ],
  sim: 'zt-channels'
},

/* ================================================================ zigbee */
{
  id: 'zigbee',
  parent: 'zigbee-thread-matter',
  title: 'Zigbee',
  level: 1,
  short: 'A mesh network for home automation: one coordinator forms it, mains-powered routers relay, and battery devices sleep between messages. Mature, cheap and in thousands of products, and it needs a hub.',
  keywords: ['Zigbee', 'Zigbee 3.0', 'Zigbee PRO', 'coordinator', 'router', 'end device', 'mesh', 'permit join', 'trust center', 'network key', 'install code', 'Connectivity Standards Alliance', 'hub', 'ZigBee'],
  prereq: ['ieee-802-15-4', 'radio-basics'],
  related: ['zigbee-device-types-and-clusters', 'zigbee-on-esp', 'zigbee-with-home-assistant', 'thread', 'matter', 'sleepy-ble-zigbee-thread', 'choosing-a-smart-home-radio', 'zigbee-and-thread-boards'],
  body: `Zigbee turns a pile of cheap radios into one network that covers a house. A light switch, a motion sensor and thirty lamps join a network with a single **coordinator** at its heart, and messages hop from device to device until they arrive: a **mesh**. It was designed in the early 2000s for the jobs the smart home still has (switching, dimming, sensing, metering), and it is in lamps, plugs, blinds, thermostats and door sensors from many makers. It runs on [[ieee-802-15-4|IEEE 802.15.4]] and adds the network and application layers above it.

### Three kinds of device

| Role | Powered by | What it does |
|---|---|---|
| **Coordinator** | mains | Exactly one per network. Picks the channel and the PAN ID, forms the network, hands out keys and decides who may join. Usually a USB stick or a hub. |
| **Router** | mains | Listens all the time and relays other devices' messages. Every lamp and plug is a router, so every one you add strengthens the mesh. |
| **End device** | battery | Does not relay. Sleeps nearly always; wakes to send, or to ask its parent router "anything for me?" ([[sleepy-ble-zigbee-thread]]). |

### Forming, joining and routing

The coordinator forms the network on a clear channel. A new device is admitted only while the coordinator or a router has **permit join** open, usually for a minute or two. It scans for networks, asks the nearest router to be its parent, and receives the network key over the air, protected by a link key or by an install code printed on the device. Messages find their way through routing tables built on demand: when a router fails, the next message triggers a new route search and takes another path. The simulation below shows it.

### Strengths and limits

Zigbee's strengths are maturity, price and battery life measured in years. Its limits are as real. It needs a **hub or stick**: nothing in a phone speaks it. A coordinator or router can hold only a limited number of direct children (a few dozen, depending on the chip), which is why routers matter, and a mesh of battery devices alone is no mesh. Devices of different makers sometimes disagree about the finer points; Zigbee 3.0, introduced around 2016, merged the older application profiles to improve that. The Connectivity Standards Alliance, which also owns [[matter|Matter]], keeps the specification.

### On the ESP32 family

Only chips with an 802.15.4 radio can join: the ESP32-C6, H2 and C5 ([[zigbee-on-esp]]). Zigbee competes with [[thread|Thread]] for the same radio hardware and the same place in the smart home; [[choosing-a-smart-home-radio]] sets them side by side.

> [!key] A Zigbee network is a coordinator, mains-powered routers that relay, and battery end devices that sleep. It is mature, cheap and frugal, but it needs a hub, and its strength grows with the number of routers.`,
  ideas: [
    'One coordinator forms the network; mains-powered routers relay; battery end devices sleep and never relay.',
    'A device joins only while permit join is open, and receives the network key over the air.',
    'Routes are found on demand and repaired when a router fails.',
    'Zigbee needs a hub or coordinator stick: phones do not speak it.'
  ],
  pitfalls: [
    'More battery sensors make the network stronger — Only routers extend a Zigbee mesh. Twelve battery sensors and no mains device make twelve lonely links to the hub.',
    'The coordinator is just another router — It forms the network, holds the keys and decides who joins. Losing it, or its backup, can mean pairing every device again.',
    'Zigbee devices of any maker work together perfectly — They share the standard, but corner cases differ. A hub that knows the specific model works best.'
  ],
  terms: [
    { term: 'Coordinator', also: ['ZC', 'Zigbee coordinator', 'trust center'], def: 'The one device that forms a Zigbee network: it chooses the channel and PAN ID, holds the network key and decides who may join. Usually a hub or a USB stick.' },
    { term: 'Router', also: ['ZR', 'Zigbee router'], def: 'A mains-powered Zigbee device that keeps its radio on and relays messages for others. Lamps and plugs are routers.' },
    { term: 'End device', also: ['ZED', 'Zigbee end device', 'sleepy end device'], def: 'A Zigbee device, usually on a battery, that does not relay. It talks only to its parent router and may sleep between messages.' },
    { term: 'Permit join', also: ['pairing mode', 'join window'], def: 'A time window, normally a minute or two, during which the coordinator or a router lets new devices join. Outside it, joining is refused.' },
    { term: 'Install code', also: ['link key', 'IC'], def: 'A unique code printed on a Zigbee device, from which a secret link key is derived, so the network key can reach it without being exposed to a passer-by.' }
  ],
  choose: {
    good: ['A house with many lamps, plugs and battery sensors under one hub', 'Sensors that must last for years on a cell', 'Systems with a mature hub such as Home Assistant, which supports thousands of models'],
    avoid: ['Anything that must talk to a phone with no hub in between', 'A handful of battery sensors with no mains devices to relay for them', 'Big data: it is a command-and-report network'],
    check: ['Which coordinator you have and how many devices it supports', 'That each new device says it is Zigbee 3.0 and how it pairs', 'The Zigbee channel against your Wi-Fi channels']
  },
  quiz: [
    { q: 'A garden shed sensor drops out of a Zigbee network that has a hub and twelve battery door sensors. What fixes it?', choices: ['A stronger sensor', 'A mains Zigbee plug or lamp near the shed, to act as a router', 'A second coordinator', 'A shorter poll period'], a: 1, why: 'Battery end devices never relay. A mains-powered router near the shed gives the sensor a parent and carries its messages onward.' },
    { q: 'A Zigbee end device relays messages while it is awake.', a: false, why: 'End devices only talk to their parent. Relaying is a router\'s job, which needs the radio on all the time.' },
    { q: 'Which device forms the network and hands out the network key?', choices: ['A router', 'An end device', 'The coordinator', 'The phone'], a: 2, why: 'The coordinator forms the network, acts as its trust centre and decides who may join.' },
    { q: 'Why is permit join opened for only a minute or two?', choices: ['To save power', 'A joining device receives the network key, so an open window lets any device in', 'Zigbee supports only one join a day', 'Routers forget the network otherwise'], a: 1, why: 'While the window is open any device may ask to join and receive the key. Keeping it short limits that exposure.' }
  ],
  applications: [
    'Lamps, smart plugs and switches that also relay for the rest of the house.',
    'Door, window, motion and leak sensors on coin cells.',
    'Thermostat valves, blinds and curtain motors.',
    'ESP32-C6 and H2 boards acting as custom Zigbee devices that a hub treats like any other.'
  ],
  sources: [
    'Connectivity Standards Alliance, *Zigbee Specification* (Zigbee PRO) and the Zigbee 3.0 base device behaviour.',
    'Connectivity Standards Alliance, *Zigbee Cluster Library*.',
    'Espressif, *ESP-Zigbee-SDK Programming Guide*.'
  ],
  sim: 'zt-zigbee-mesh'
},

/* ================================================================ zigbee-device-types-and-clusters */
{
  id: 'zigbee-device-types-and-clusters',
  parent: 'zigbee-thread-matter',
  title: 'Zigbee devices, endpoints and clusters',
  level: 2,
  short: 'Inside a Zigbee device: endpoints are its functions, and clusters are the standard bundles of attributes and commands on each endpoint (On/Off 0x0006, Level 0x0008, Temperature 0x0402). Learn to read one and every product becomes legible.',
  keywords: ['endpoint', 'cluster', 'attribute', 'command', 'ZCL', 'Zigbee Cluster Library', 'device ID', 'On/Off cluster', 'Level Control', 'Basic cluster', 'reporting', 'binding', 'groups', 'scenes', 'poll control', 'IAS Zone', '0x0006'],
  prereq: ['zigbee', 'ieee-802-15-4'],
  related: ['zigbee-on-esp', 'zigbee-with-home-assistant', 'sleepy-ble-zigbee-thread', 'matter', 'thread', 'battery-life-budget'],
  body: `A Zigbee device is not one thing but a list of functions. Each function lives on an **endpoint**, a numbered door (1 to 240) into the device. On each endpoint stands a set of **clusters**: standard bundles of related **attributes** (values the device keeps) and **commands** (things it can be told to do). Every cluster has a fixed 16-bit number from the Zigbee Cluster Library, so a hub that has never seen the lamp can still switch it on.

### Reading a device

| Cluster | ID | What it holds |
|---|---|---|
| Basic | 0x0000 | manufacturer, model, power source: how a hub recognises the device |
| Power Configuration | 0x0001 | battery voltage and percentage |
| Identify | 0x0003 | makes the device blink so you can find it |
| Groups, Scenes | 0x0004, 0x0005 | one message for many devices; stored settings |
| On/Off | 0x0006 | one boolean; commands Off 0x00, On 0x01, Toggle 0x02 |
| Level Control | 0x0008 | brightness or speed, 0 to 254 |
| Temperature Measurement | 0x0402 | a temperature in hundredths of a degree |
| Occupancy, Humidity | 0x0406, 0x0405 | presence; humidity in hundredths of a percent |
| IAS Zone | 0x0500 | alarm-type sensors, such as a door contact |

A dimmable lamp (device ID 0x0101) is an endpoint with Basic, Identify, Groups, Scenes, On/Off and Level Control; a temperature sensor (0x0302) has Basic, Power Configuration and Temperature Measurement. Clusters have two sides: the **server** holds the attributes (the lamp's On/Off), the **client** sends the commands (a switch's On/Off), so a switch and a lamp carry the same cluster in opposite roles. The simulation lets you click through seven devices.

### How values travel

Numbers are integers with a fixed scale: 21.5 °C travels as 2150, so no floating point crosses the air. A sensor does not wait to be asked. The hub configures **reporting**: send the value when it changes by more than a set amount, and at least every so many minutes. Two devices can also be **bound**, so that a switch talks straight to a lamp with no hub in between.

### Battery devices

A sleepy end device keeps its radio off and polls its parent every few seconds or minutes. The longer the period, the longer the battery lasts and the longer a command waits: on average half a period. The Poll Control cluster lets the hub shorten the period for a while, to configure the device, and relax it again.

> [!key] A Zigbee device is endpoints, and each endpoint a list of standard clusters with fixed numbers, attributes and commands. Read the clusters and you know what any device can do; for a sleepy one, the poll period trades battery life against the delay of every command.`,
  ideas: [
    'An endpoint is a numbered function of the device; its clusters are standard bundles of attributes and commands.',
    'On/Off is 0x0006, Level Control 0x0008, Temperature Measurement 0x0402: the numbers are fixed by the Cluster Library.',
    'The server side of a cluster holds the state; the client side sends commands.',
    'Values are scaled integers, and sensors report when asked to by the hub rather than being polled.'
  ],
  pitfalls: [
    'A device with the On/Off cluster is a light — It is anything with an on/off state: a plug, a relay, a fan. The device ID and the other clusters say what it is.',
    'The raw attribute value is the real value — Scaling is part of the cluster: temperatures are hundredths of a degree, battery percentage is in half-percents, and window position 0 means open.',
    'Short poll periods are free — Each poll is a few milliseconds of reception at 25 mA on an H2: at one second it costs more than the sleep current itself.'
  ],
  terms: [
    { term: 'Endpoint', also: ['EP'], def: 'A numbered function inside a Zigbee device, 1 to 240. Each endpoint has a device ID and a set of clusters; endpoint 0 is reserved for network management.' },
    { term: 'Cluster', also: ['ZCL cluster', 'cluster ID'], def: 'A standard group of attributes and commands with a 16-bit number, for example On/Off (0x0006) or Temperature Measurement (0x0402).' },
    { term: 'Attribute', also: ['ZCL attribute'], def: 'A value a cluster keeps, with an ID, a type and often a scale: OnOff in the On/Off cluster, MeasuredValue in Temperature Measurement.' },
    { term: 'Reporting', also: ['attribute reporting', 'report'], def: 'The hub tells a device to send an attribute on its own: when it changes by more than a threshold, and at least every so often.' },
    { term: 'Binding', also: ['bind'], def: 'A link between an endpoint and another, so that a switch sends its commands straight to a lamp without going through the hub.' },
    { term: 'Poll period', also: ['data poll', 'long poll interval'], def: 'How often a sleepy end device asks its parent for waiting messages. It sets the average current and the delay of a command.' }
  ],
  choose: {
    good: ['Standard clusters for anything the Cluster Library already names', 'Reporting with a change threshold for sensors, to save air time and power', 'A long poll period for sensors and valves that tolerate a delay'],
    avoid: ['Inventing a manufacturer-specific cluster when a standard one exists', 'Polling a battery sensor every second for the sake of speed', 'Guessing units: always read the scale of the attribute'],
    check: ['The device ID and clusters the hub reports after pairing', 'The units and multiplier of every attribute you use', 'The delay your application can tolerate before choosing the poll period']
  },
  code: [
    {
      title: 'Forget the network with a long press',
      about: 'A Zigbee light end device that forgets its network when the BOOT button is held for three seconds, so that it can be paired again. The light itself is the one of the core\'s example.',
      needs: 'An ESP32-C6 or ESP32-H2 DevKit (Zigbee Mode: end device; partition scheme: Zigbee), and a Zigbee coordinator with pairing mode on.',
      wiring: [['GPIO9', 'the BOOT button to GND', 'already on the board; internal pull-up'], ['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (9) as [input with pull-up v]
          set pin (RGB_BUILTIN) as [output v]
          set [pressedAt v] to (0)
          create a Zigbee light on endpoint (10) named [Espressif] [ZBLightBulb] :: radio
          start Zigbee :: radio
          repeat until <Zigbee connected?>
            wait (0.1) seconds
          end
          print [Joined the network]
        forever
          if <(read pin (9)) = [LOW v]> then
            if <(pressedAt) = (0)> then
              set [pressedAt v] to (milliseconds since start)
            end
            if <((milliseconds since start) - (pressedAt)) ≥ (3000)> then
              forget the Zigbee network :: radio
              set [pressedAt v] to (0)
            end
          else
            set [pressedAt v] to (0)
          end
          wait (0.05) seconds
        end

        when the Zigbee light changes (state) :: radio
          set pin (RGB_BUILTIN) to (state)
      `,
      cpp: String.raw`
        #include <Arduino.h>
        #ifndef ZIGBEE_MODE_ED
        #error "Select Tools > Zigbee Mode > Zigbee ED (end device)"
        #endif
        #include "Zigbee.h"

        #define ZIGBEE_LIGHT_ENDPOINT 10
        const int BUTTON_PIN = 9;               // the BOOT button of the C6 and H2 boards
        const uint32_t HOLD_MS = 3000;          // hold this long to forget the network

        ZigbeeLight zbLight(ZIGBEE_LIGHT_ENDPOINT);

        void setLED(bool on) { digitalWrite(RGB_BUILTIN, on); }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          pinMode(RGB_BUILTIN, OUTPUT);
          zbLight.setManufacturerAndModel("Espressif", "ZBLightBulb");
          zbLight.onLightChange(setLED);
          Zigbee.addEndpoint(&zbLight);                      // add endpoints BEFORE begin()
          if (!Zigbee.begin()) { Serial.println("Zigbee failed to start"); ESP.restart(); }
          while (!Zigbee.connected()) { delay(100); }        // joins the coordinator's network
          Serial.println("Joined the network");
        }

        void loop() {
          static uint32_t pressedAt = 0;
          if (digitalRead(BUTTON_PIN) == LOW) {              // pressed: the button pulls the pin to ground
            if (pressedAt == 0) pressedAt = millis();
            if (millis() - pressedAt >= HOLD_MS) {
              Serial.println("Forgetting the network");
              pressedAt = 0;
              Zigbee.factoryReset();                         // forget the network; pair the device again
            }
          } else {
            pressedAt = 0;
          }
          delay(50);
        }
      `,
      na: { py: 'MicroPython has no Zigbee support: the official ESP32 builds contain no 802.15.4 or Zigbee stack, so this needs Arduino C++ or ESP-IDF.' },
      output: `
        Joined the network
        Forgetting the network
      `,
      notes: ['A hub keeps its own record of the device. After a factory reset on the device, remove it from the hub as well, or pair it as a new device.', 'GPIO9 is a strapping pin on the C6 and H2: do not hold the button while the board resets, or it will wait for an upload instead.']
    }
  ],
  formulas: [
    {
      name: 'Average current of a sleepy end device',
      expr: 'Iavg = Isleep + Qp/Tp',
      tex: 'I_{\\mathrm{avg}} = I_{\\mathrm{sleep}} + \\frac{Q_{p}}{T_{p}}',
      vars: {
        Iavg: { name: 'average current', q: 'current', unit: 'µA', tex: 'I_{\\mathrm{avg}}' },
        Isleep: { name: 'sleep current', q: 'current', unit: 'µA', value: 7, tex: 'I_{\\mathrm{sleep}}' },
        Qp: { name: 'charge of one poll', q: 'charge', unit: 'µC', value: 125, tex: 'Q_{p}' },
        Tp: { name: 'poll period', q: 'time', unit: 's', value: 30, tex: 'T_{p}' }
      },
      note: 'One poll modelled as 5 ms of reception at 25 mA (the ESP32-H2\'s catalogue figure), which is 125 µC. Wake-up of the CPU and the board\'s other parts come on top.',
      stories: { Iavg: 'A sleepy end device draws {Isleep} asleep and spends {Qp} on each poll, every {Tp}. What is its average current?' },
      practice: { unknowns: ['Iavg', 'Tp'] }
    }
  ],
  examples: [
    {
      title: 'What does one poll period cost?',
      q: 'A sleepy sensor draws 7 µA asleep and 125 µC per poll. Compare poll periods of 1 s and 60 s: the average current, and the average delay of a command.',
      steps: ['At 1 s: $7 + 125/1 = 132$ µA. At 60 s: $7 + 125/60 = 9.1$ µA.', 'The average delay of a command is half the period: 0.5 s against 30 s.', 'A CR123A cell of 1500 mAh lasts about 1.0 year at 1 s and about 12 years at 60 s (self-discharge included).'],
      a: 'Sixty-fold longer polling cuts the average current fourteen-fold and the battery lasts about twelve times as long, at the price of a thirty-second wait for a command.'
    }
  ],
  quiz: [
    { q: 'What does a hub learn from the cluster 0x0006 on a device\'s endpoint?', choices: ['That it has an on/off state it can be told to change', 'That it is a temperature sensor', 'That it runs on a battery', 'That it is a coordinator'], a: 0, why: 'Cluster 0x0006 is On/Off: a boolean attribute and the commands Off, On and Toggle. What the device is comes from the device ID and the other clusters.' },
    { q: 'A temperature sensor reports MeasuredValue 2150. What is the temperature?', choices: ['2150 °C', '215 °C', '21.5 °C', '2.15 °C'], a: 2, why: 'Temperature Measurement uses hundredths of a degree: 2150 means 21.5 °C. Integers keep the frames small and exact.' },
    { q: 'A battery valve polls its parent every 30 s. What is the average delay before it acts on a command?', choices: ['About 15 s', 'About 30 s', 'About 60 s', 'None: commands arrive at once'], a: 0, why: 'A command arrives at a random moment between two polls, so it waits half a period on average and a whole period at worst.' },
    { q: 'In a Zigbee window-blind device, a position of 0 % lift means the blind is fully closed.', a: false, why: 'In the Window Covering cluster the lift percentage counts closed: 0 is fully open and 100 fully closed.' }
  ],
  applications: [
    'Reading a pairing log: the hub lists endpoints and clusters, and you see at once why a brightness slider is missing.',
    'Designing an ESP32 Zigbee sensor by choosing the standard clusters it should offer.',
    'Binding a battery switch directly to a lamp, so the light works with the hub switched off.',
    'Choosing a poll period for a valve, a lock or a button.'
  ],
  sources: [
    'Connectivity Standards Alliance, *Zigbee Cluster Library*: the General, Measurement and Sensing, HVAC and Closures clusters.',
    'Connectivity Standards Alliance, *Zigbee Specification*, application support layer: endpoints, bindings and reporting.',
    'Arduino core for ESP32 documentation (core 3.3), *Zigbee* library and its endpoint classes.'
  ],
  sim: ['zt-clusters', 'zt-sleepy-poll']
},

/* ================================================================ zigbee-on-esp */
{
  id: 'zigbee-on-esp',
  parent: 'zigbee-thread-matter',
  title: 'Zigbee on the C6 and H2',
  level: 2,
  short: 'The ESP32-C6, H2 and C5 can be Zigbee devices. The Arduino core has a Zigbee library with an endpoint class for each device type, two build modes (end device, or coordinator and router) and a partition scheme that stores the network.',
  keywords: ['Zigbee.h', 'ZigbeeLight', 'Zigbee.begin', 'Zigbee mode', 'ZIGBEE_MODE_ED', 'ZCZR', 'zigbee partition', 'esp-zigbee-sdk', 'Zigbee on ESP32-C6', 'Zigbee on ESP32-H2', 'Zigbee gateway', 'Zigbee range extender', 'factoryReset'],
  prereq: ['zigbee', 'zigbee-device-types-and-clusters', 'soc-esp32-c6'],
  related: ['soc-esp32-h2', 'zigbee-with-home-assistant', 'esp32-h2-devkit', 'c-series-devkits', 'partition-tables', 'project-zigbee-switch', 'zigbee-and-thread-boards'],
  body: `Two chips were made for this: the **ESP32-H2** (Zigbee 3.0, Thread and Bluetooth LE, no Wi-Fi) and the **ESP32-C6** (the same plus Wi-Fi 6). The ESP32-C5 has the radio too, and the Arduino core's documentation for 3.3 lists Zigbee for it. The ESP32, S2, S3 and C3 cannot be Zigbee devices on their own ([[ieee-802-15-4]]). The catalogue lists Zigbee 3.0 for all of them; the C6 and H2 are in mass production, the C5 since 2025.

### What the core gives you

The Arduino core's **Zigbee** library (since the 3.0 series, first as an alpha in December 2023) hides the Espressif Zigbee SDK behind an endpoint class per device type. Light classes: ZigbeeLight, ZigbeeDimmableLight, ZigbeeColorDimmableLight. Switches: ZigbeeSwitch, ZigbeeColorDimmerSwitch. Others: ZigbeePowerOutlet, sensor classes for temperature, contact, occupancy, illuminance, pressure, flow, carbon dioxide, PM2.5, vibration and wind speed; ZigbeeThermostat, ZigbeeFanControl, ZigbeeWindowCovering, ZigbeeElectricalMeasurement, the generic ZigbeeAnalog, ZigbeeBinary and ZigbeeMultistate, and the infrastructure classes ZigbeeGateway and ZigbeeRangeExtender. Each creates the endpoint with the right clusters, so the work is attaching it, naming it and reacting to commands.

### Two modes, one partition

Before building, choose in the Tools menu the **Zigbee Mode**: *end device* (ED), for batteries and lights, or *coordinator and router* (ZCZR), which can form a network or relay for others. Debug variants add logging. The core's examples refuse to build in the wrong mode, with an \`#error\` that tells you which. Also choose a **partition scheme** with the Zigbee option, which adds two small partitions where the stack keeps the network it has joined (16 KB) and its factory data (4 KB), beside the application and a file system on a 4 MB flash.

### The shape of a program

Create the endpoint objects; name them with \`setManufacturerAndModel\` (hubs read those names); register callbacks for commands; add every endpoint with \`Zigbee.addEndpoint()\` **before** \`Zigbee.begin()\`; then wait until \`Zigbee.connected()\` says the device has joined. While the hub's pairing mode is open the device finds the network, joins and appears. \`Zigbee.factoryReset()\` makes it forget.

### Limits and care

The radio is shared: on the C6, Wi-Fi, Bluetooth and 802.15.4 take turns, so a C6 that runs Wi-Fi and a Zigbee router at once will lose airtime. A gateway that must be on Wi-Fi and Zigbee is better built as two chips, as Espressif's own gateway board does (an S3 and an H2). The library is young: the 4.0 pre-release of the core moves it to version 2 of the Zigbee SDK, and sketches written for 3.3 may need changes. MicroPython has no Zigbee at all.

> [!key] The C6, H2 and C5 can be Zigbee devices through the core's Zigbee library: pick Zigbee Mode (end device or coordinator/router) and the Zigbee partition, create an endpoint class, add it before begin, and wait to be connected.`,
  ideas: [
    'The H2 (no Wi-Fi) and C6 (with Wi-Fi 6) are the Zigbee chips; the C5 has the radio too.',
    'The core has one endpoint class per device type; each brings the right clusters.',
    'Build options matter: Zigbee Mode end device or coordinator/router, and a partition scheme that stores the network.',
    'Add endpoints before Zigbee.begin(), then wait for Zigbee.connected().'
  ],
  pitfalls: [
    'Any Arduino ESP32 board can run the Zigbee examples — They need the 802.15.4 radio, so a C6, H2 or C5, plus the right Tools settings; otherwise the build stops with an error.',
    'A C6 makes a good Zigbee gateway on its own — The one radio is shared by Wi-Fi, Bluetooth and 802.15.4. For a busy gateway use a Wi-Fi chip with a separate 802.15.4 chip.',
    'Tutorials for 3.0 alpha work unchanged — The Zigbee API moved between 3.0 and 3.3, and the 4.0 pre-release moves to a new SDK version: read the example of your core version.'
  ],
  terms: [
    { term: 'Zigbee mode', also: ['ZIGBEE_MODE_ED', 'ZIGBEE_MODE_ZCZR', 'ED', 'ZCZR'], def: 'The build option of the Arduino core that selects what the Zigbee stack can be: an end device, or a coordinator or router. A sketch checks it at compile time.' },
    { term: 'Endpoint class', also: ['ZigbeeLight', 'ZigbeeTempSensor'], def: 'A class of the core\'s Zigbee library that creates one endpoint with the standard clusters of one device type, for instance a dimmable light or a temperature sensor.' },
    { term: 'ESP-Zigbee-SDK', also: ['esp-zigbee-sdk', 'Espressif Zigbee SDK'], def: 'Espressif\'s Zigbee stack and API for the ESP32-C6 and H2, which the Arduino library is built on. It offers full control in ESP-IDF.' },
    { term: 'Zigbee storage partition', also: ['zb_storage', 'zb_fct'], def: 'Small flash partitions where the Zigbee stack keeps the network it joined and its factory data, so a restart does not mean pairing again.' }
  ],
  choose: {
    good: ['Custom Zigbee lamps, plugs and sensors on an H2 or C6', 'A battery sensor on an H2: no Wi-Fi radio, so a low receive current', 'A Zigbee device that must also be configured over Bluetooth LE'],
    avoid: ['An ESP32, S2, S3 or C3: no 802.15.4 radio', 'A busy gateway on a single C6 that must serve Wi-Fi and Zigbee together', 'MicroPython: no Zigbee in the official builds'],
    check: ['The core version and its Zigbee example, since the API is still moving', 'Zigbee Mode and the partition scheme in the Tools menu', 'That the hub shows the manufacturer and model you set']
  },
  code: [
    {
      title: 'A Zigbee light end device',
      about: 'Joins a Zigbee network as an on/off light. When the hub switches it, the RGB LED of the board goes on or off. This is the core\'s own light example.',
      needs: 'An ESP32-C6 or ESP32-H2 DevKit with an RGB LED (RGB_BUILTIN). Tools: Zigbee Mode = Zigbee ED, Partition Scheme = Zigbee. A hub or stick with pairing mode open.',
      wiring: [['USB', 'computer', 'for power and the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (RGB_BUILTIN) as [output v]
          create a Zigbee light on endpoint (10) named [Espressif] [ZBLightBulb] :: radio
          start Zigbee :: radio
          repeat until <Zigbee connected?>
            wait (0.1) seconds
          end

        when the Zigbee light changes (state) :: radio
          set pin (RGB_BUILTIN) to (state)
      `,
      cpp: String.raw`
        #include <Arduino.h>
        #ifndef ZIGBEE_MODE_ED
        #error "Select Tools > Zigbee Mode > Zigbee ED (end device)"
        #endif
        #include "Zigbee.h"

        #define ZIGBEE_LIGHT_ENDPOINT 10
        ZigbeeLight zbLight(ZIGBEE_LIGHT_ENDPOINT);

        void setLED(bool on) { digitalWrite(RGB_BUILTIN, on); }

        void setup() {
          Serial.begin(115200);
          pinMode(RGB_BUILTIN, OUTPUT);
          zbLight.setManufacturerAndModel("Espressif", "ZBLightBulb");
          zbLight.onLightChange(setLED);
          Zigbee.addEndpoint(&zbLight);                      // add endpoints BEFORE begin()
          if (!Zigbee.begin()) { Serial.println("Zigbee failed to start"); ESP.restart(); }
          while (!Zigbee.connected()) { delay(100); }        // joins the coordinator's network (pairing mode on the hub)
        }

        void loop() { delay(100); }                          // Zigbee.factoryReset() to forget the network
      `,
      na: { py: 'MicroPython has no Zigbee support: the official ESP32 builds contain no 802.15.4 or Zigbee stack. Use Arduino C++ or ESP-IDF.' },
      output: `
        (the serial monitor stays quiet on success; the hub lists "Espressif ZBLightBulb" as a new light)
      `,
      notes: ['Put the hub in pairing mode first, then power the board; if it joined an earlier network, call Zigbee.factoryReset() to forget it.', 'The core\'s example and this program are for core 3.3.x; the 4.0 pre-release uses version 2 of the Zigbee SDK, and the calls may differ.', 'On boards without an RGB LED define a plain pin and use a normal digitalWrite.']
    }
  ],
  examples: [
    {
      title: 'How much flash does a Zigbee sketch want?',
      q: 'The core\'s Zigbee partition scheme for 4 MB flash is the one in the catalogue. How much room is there for the program, and what do the extra partitions hold?',
      steps: ['The scheme holds two application slots of 1280 KB each, for over-the-air updates, a file system of about 1388 KB, a 64 KB core-dump area and the settings.', 'The extra Zigbee partitions are zb_storage, 16 KB, which keeps the network the device has joined, and zb_fct, 4 KB, its factory data.', 'A sketch of up to about 1.3 MB fits in either slot.'],
      a: 'About 1.3 MB per program slot. The two small Zigbee partitions are why a restart does not mean pairing again.'
    }
  ],
  quiz: [
    { q: 'A sketch built for an ESP32-S3 includes Zigbee.h and stops at "#error Select Tools > Zigbee Mode". What is the real problem?', choices: ['The S3 has no 802.15.4 radio, so Zigbee needs a C6, H2 or C5', 'The cable is faulty', 'The sketch is too long', 'Zigbee needs 5 GHz'], a: 0, why: 'The Zigbee library needs the 802.15.4 radio. Only the C6, H2 and C5 (among current chips) have it; the Tools menu option does not even exist for the S3.' },
    { q: 'When must Zigbee.addEndpoint() be called?', choices: ['After Zigbee.connected()', 'Before Zigbee.begin()', 'Only in loop()', 'Never: begin() adds them'], a: 1, why: 'The stack builds the device from the endpoints it has when it starts. Endpoints added later are not part of the device.' },
    { q: 'A single ESP32-C6 is the best choice for a busy Zigbee-to-Wi-Fi gateway.', a: false, why: 'The C6\'s one radio is shared by Wi-Fi, Bluetooth and 802.15.4, so heavy traffic on one steals time from the others. Espressif\'s gateway board pairs an S3 with an H2 instead.' },
    { q: 'Why does the Zigbee partition scheme exist?', choices: ['To make the program smaller', 'To keep the joined network and factory data in flash across restarts', 'To enable Wi-Fi', 'To speed up uploads'], a: 1, why: 'The two small Zigbee partitions store the network and the device\'s factory data. Without them the device would have to pair again after every reset.' }
  ],
  applications: [
    'A custom Zigbee sensor or relay that appears in Home Assistant like a commercial one.',
    'A mains-powered range extender that strengthens an existing mesh.',
    'Learning Zigbee: the core\'s light, switch and sensor examples pair with any hub.',
    'The Zigbee half of a Matter bridge or a Thread and Zigbee gateway.'
  ],
  sources: [
    'Arduino core for ESP32 documentation (core 3.3), *Zigbee* library and its examples (On/Off Light).',
    'Espressif, *ESP-Zigbee-SDK Programming Guide*.',
    'Espressif, *ESP32-H2 Series Datasheet* and *ESP32-C6 Series Datasheet*.'
  ],
  sim: { id: 'zt-clusters', params: { device: 'esplight' } }
},

/* ================================================================ zigbee-with-home-assistant */
{
  id: 'zigbee-with-home-assistant',
  parent: 'zigbee-thread-matter',
  title: 'Zigbee with Home Assistant',
  level: 2,
  short: 'Home Assistant reaches Zigbee through a coordinator stick and one of two integrations, ZHA or Zigbee2MQTT. Pick the channel, place the stick well, pair the mains devices first, and an ESP32-C6 or H2 device appears like any commercial one.',
  keywords: ['Home Assistant', 'ZHA', 'Zigbee2MQTT', 'Z2M', 'coordinator stick', 'Zigbee dongle', 'permit join', 'interview', 'quirk', 'external converter', 'Zigbee channel', 'USB extension', 'pairing', 'MQTT discovery', 'Zigbee backup'],
  prereq: ['zigbee', 'zigbee-device-types-and-clusters', 'ieee-802-15-4'],
  related: ['zigbee-on-esp', 'home-assistant-integration', 'mqtt', 'esphome', 'choosing-a-smart-home-radio', 'project-zigbee-switch', 'interference-and-channels'],
  body: `A Zigbee network needs a coordinator, and in a Home Assistant house that is a **USB stick** (or a network-attached coordinator) with a Zigbee radio on it. Home Assistant speaks to the stick through one of two integrations, and every lamp, plug and sensor you pair appears as entities you can automate.

### The two integrations

- **ZHA** (Zigbee Home Automation) is built into Home Assistant. You plug in the stick, add the integration and pair devices from the same screen: the quickest start.
- **Zigbee2MQTT** is a separate program that talks to the stick and publishes every device to an MQTT broker; Home Assistant finds them through MQTT discovery ([[mqtt]]). It has its own web page, a large database of device definitions and fine control over details.

You choose one per stick, because the program that opened the stick owns it; moving a network from one to the other is possible but an undertaking. Both need a stick on a supported chip; the catalogue lists the Sonoff ZBDongle-E (Silicon Labs EFR32), the ZBDongle-P (Texas Instruments CC2652) and Home Assistant's own Connect ZBT-2.

### Pairing, step by step

1. Open **permit join** on the coordinator, from a button in the integration. It stays open for a minute or two.
2. Put the device in pairing mode: for many products a long press or a few power cycles; for an ESP32 example, power it with no network stored, or after \`Zigbee.factoryReset()\`.
3. The device joins, and the integration **interviews** it: it reads the Basic cluster (manufacturer and model), then the endpoints and clusters, and creates entities from them. A lamp becomes a light, a temperature sensor becomes sensors.
4. Name it, give it an area, close the join window.

A device the software knows is set up fully; a custom one made of standard clusters appears as a generic device. When something is missing, ZHA takes a **quirk** and Zigbee2MQTT an **external converter**: a small file that teaches the device's habits.

### Planning the network

Put the stick on a **USB extension cable**, a metre or so from the computer and away from USB 3 sockets, whose noise falls in the 2.4 GHz band. Choose the **channel before pairing**, clear of Wi-Fi ([[ieee-802-15-4]]); changing it later is possible, but sleepy devices may fail to follow. Add mains devices as routers first, battery sensors afterwards, and keep a **backup** of the coordinator: the network key lives there.

### A device of your own

An ESP32-C6 or H2 built with the core's Zigbee library ([[zigbee-on-esp]]) needs nothing special: it pairs, is interviewed and appears. The cluster list decides which entities show up, so a lamp without Level Control gets an on/off switch and no brightness.

> [!key] Home Assistant reaches Zigbee through a USB coordinator stick and either ZHA (built in) or Zigbee2MQTT (a separate program with MQTT). Choose a clear channel before pairing, keep the stick away from USB 3 noise, open permit join briefly, and pair mains routers before battery sensors.`,
  ideas: [
    'ZHA is built into Home Assistant; Zigbee2MQTT is a separate program that publishes devices over MQTT.',
    'Pairing is: open permit join, put the device in pairing mode, let the integration interview it.',
    'Choose the Zigbee channel before pairing and keep the stick on an extension cable, away from USB 3.',
    'An ESP32-C6 or H2 device with standard clusters appears like a commercial one.'
  ],
  pitfalls: [
    'The stick can be shared by ZHA and Zigbee2MQTT — One program opens it. Running both on the same stick, or one network on two sticks, ends in a mess.',
    'The stick works best plugged straight into the computer — USB 3 ports and nearby drives radiate noise around 2.4 GHz. A short extension cable improves range and reliability.',
    'Pair the sensors first, the lamps later — Do it the other way round: mains lamps and plugs are the routers, so they make the mesh that the battery devices then join.'
  ],
  terms: [
    { term: 'ZHA', also: ['Zigbee Home Automation'], def: 'The Home Assistant integration for Zigbee that is built into the product. It talks to a coordinator stick directly and needs no extra software.' },
    { term: 'Zigbee2MQTT', also: ['Z2M'], def: 'A separate program that talks to a Zigbee coordinator and publishes each device to an MQTT broker, with a web page of its own. Home Assistant reads it through MQTT discovery.' },
    { term: 'Interview', also: ['device interview', 'pairing'], def: 'The first conversation after a device joins: the hub reads its manufacturer, model, endpoints and clusters, and builds the matching entities.' },
    { term: 'Quirk', also: ['external converter', 'device definition'], def: 'A small piece of code that teaches ZHA (a quirk) or Zigbee2MQTT (an external converter) the habits of a device that does not follow the standard exactly.' },
    { term: 'Coordinator stick', also: ['Zigbee dongle', 'Zigbee adapter', 'USB coordinator'], def: 'A USB device with a Zigbee radio that acts as the network\'s coordinator for software running on a computer.' }
  ],
  choose: {
    good: ['ZHA for the shortest path from stick to working house', 'Zigbee2MQTT when you want the widest device database or other MQTT clients', 'A coordinator on an extension cable, with mains routers placed around the house'],
    avoid: ['Both integrations on one stick', 'A channel that overlaps your Wi-Fi', 'Battery sensors paired before the routers are in place'],
    check: ['That your stick\'s chip is supported by the integration you choose', 'The channel against your Wi-Fi channels, before pairing', 'That backups of the coordinator are taken and stored off the machine']
  },
  examples: [
    {
      title: 'Choosing the channel',
      q: 'The home\'s Wi-Fi routers are on channels 1 and 6. Which Zigbee channel would you choose, and why?',
      steps: ['Wi-Fi 1 covers Zigbee channels 11 to 14 and Wi-Fi 6 covers 16 to 19.', 'That leaves 15 (squeezed between the two masks, with a leak on both sides) and 20 to 26.', 'Choose 25: it is 26 MHz above the Wi-Fi 6 mask and not at the band edge, which is where channel 26 sits.'],
      a: 'Channel 25 (or 20). Try the plan in the simulation: it also marks what leaks at the edges.'
    }
  ],
  quiz: [
    { q: 'Which integration needs an MQTT broker?', choices: ['ZHA', 'Zigbee2MQTT', 'Both', 'Neither'], a: 1, why: 'Zigbee2MQTT publishes devices to MQTT, which Home Assistant reads through discovery. ZHA talks to the stick directly.' },
    { q: 'Why is a USB extension cable recommended for a Zigbee stick?', choices: ['The stick needs more power', 'USB 3 ports and the computer radiate noise in the 2.4 GHz band, which deafens the stick', 'Extension cables amplify the signal', 'The stick overheats'], a: 1, why: 'Distance from USB 3 sockets and the computer reduces interference and improves range. The cable amplifies nothing.' },
    { q: 'The hub reads a new device\'s manufacturer and model during pairing. What is this step called?', choices: ['Binding', 'The interview', 'Reporting', 'Routing'], a: 1, why: 'After a device joins, the integration interviews it: the Basic cluster, then the endpoints and clusters. Entities are built from the result.' },
    { q: 'An ESP32-H2 Zigbee lamp has no Level Control cluster. What will Home Assistant show?', choices: ['A dimmable light', 'An on/off light with no brightness control', 'Nothing: the device is rejected', 'A temperature sensor'], a: 1, why: 'Entities follow the clusters. On/Off alone gives a switchable light; brightness needs Level Control.' }
  ],
  applications: [
    'A Home Assistant house with dozens of lamps, plugs and sensors on one coordinator.',
    'A custom ESP32-C6 or H2 sensor that joins the same network as the commercial devices.',
    'Zigbee2MQTT feeding Node-RED, a database or another hub through MQTT.',
    'A remote coordinator on Ethernet, placed where the radio coverage is best.'
  ],
  sources: [
    'Home Assistant documentation, *Zigbee Home Automation (ZHA)* integration.',
    'Zigbee2MQTT documentation, *Getting started* and the supported-devices pages.',
    'Connectivity Standards Alliance, *Zigbee Cluster Library*: the Basic cluster that an interview reads.'
  ],
  sim: { id: 'zt-channels', params: { view: 'plan' } }
},

/* ================================================================ thread */
{
  id: 'thread',
  parent: 'zigbee-thread-matter',
  title: 'Thread',
  level: 2,
  short: 'A low-power mesh that speaks IPv6. Every device is an ordinary network host with its own address, a leader and routers keep the mesh running, no single device is critical, and a border router joins it to the home network. Matter\'s second transport.',
  keywords: ['Thread', 'Thread Group', 'IPv6', '6LoWPAN', 'leader', 'router', 'REED', 'sleepy end device', 'SED', 'border router', 'partition', 'mesh', 'Thread 1.3', 'Thread 1.4', 'mesh-local', 'network key'],
  prereq: ['ieee-802-15-4', 'ip-addresses-dhcp-dns'],
  related: ['openthread-on-esp', 'thread-border-router', 'matter', 'zigbee', 'sleepy-ble-zigbee-thread', 'choosing-a-smart-home-radio', 'soc-esp32-h2'],
  body: `Thread is a mesh network that speaks **IP**. Where Zigbee builds its own network and application layers, a Thread device is simply an IPv6 host on a low-power radio: it has addresses, sends UDP packets and can be reached by ordinary tools, once a border router connects the mesh to the home network. It runs on [[ieee-802-15-4|802.15.4]] with **6LoWPAN**, a header-compression layer that makes IPv6 fit in 127-byte frames, and its stack is the open-source OpenThread ([[openthread-on-esp]]). Thread carries no application of its own; [[matter]] uses it as one of its two wireless transports.

### Roles

Thread is built so that no single device matters. In a network of mains lamps and battery sensors:

| Role | What it does |
|---|---|
| **Leader** | One router that keeps the network's shared data and hands out router numbers. Nobody is born leader: if it disappears, the routers elect another within seconds. |
| **Router** | Keeps the radio on, relays messages and accepts children. A network holds up to 32 of them. |
| **Router-eligible end device (REED)** | A mains device that could be a router and promotes itself when the mesh needs one. |
| **End device** | Attaches to a parent router. A *sleepy* end device keeps its radio off and polls the parent ([[sleepy-ble-zigbee-thread]]). |
| **Border router** | A router with a second interface (Wi-Fi or Ethernet) that joins the mesh to the home network ([[thread-border-router]]). |

### Healing and splitting

When a router fails, its children find another parent and the routers recompute their routes. If failures cut the mesh in two, each half is a **partition** and elects its own leader; when the halves hear each other again they merge and one leader remains. The simulation shows it: switch off the leader, then two lamps.

### Security and joining

Traffic is encrypted with a 128-bit network key. To join, a device needs the network's **operational dataset** (name, channel, PAN ID and key), which a commissioner hands over after the joiner proves a passphrase, or, in Matter, which the phone hands over during commissioning. Thread 1.4 added the sharing of network credentials between the border routers of different ecosystems, so that homes get one mesh instead of one per speaker.

### Thread and Zigbee

| | Zigbee | Thread |
|---|---|---|
| Above the radio | its own network layer and clusters | IPv6, UDP; Matter on top |
| Addressing | 16-bit network address | IPv6 addresses for every device |
| Single point of failure | the coordinator holds the keys | none inside the mesh; use two border routers |
| Installed base | thousands of products | fewer, growing with Matter |

The catalogue lists Thread 1.3 for the ESP32-C6 and 1.4 for the H2 and C5.

> [!key] Thread is an IPv6 mesh on 802.15.4: a leader, routers, sleepy children and border routers, with no device whose loss kills the network. It carries Matter, and it needs a border router to reach the home network.`,
  ideas: [
    'Thread devices are ordinary IPv6 hosts on a low-power 802.15.4 mesh, using 6LoWPAN to fit in small frames.',
    'A leader manages the network; if it fails the routers elect another, and a split mesh forms partitions that later merge.',
    'Routers relay; sleepy end devices poll a parent; a border router connects the mesh to Wi-Fi or Ethernet.',
    'A device joins with the operational dataset: Matter hands it over during commissioning.'
  ],
  pitfalls: [
    'Thread is a competitor to Matter — It is a transport; Matter is the application on top. A Matter device can run over Thread, Wi-Fi or Ethernet.',
    'A Thread network needs a Wi-Fi router to work — The mesh works without one. A border router is needed only to reach the mesh from outside it: from a phone, a controller or the internet.',
    'The leader is a special device that must never fail — Any router can be leader. Its role moves on its own when it is lost.'
  ],
  terms: [
    { term: 'Leader', also: ['Thread leader'], def: 'The router that keeps the network\'s shared data and assigns router numbers. If it is lost the routers elect a new one; a partition without one elects its own.' },
    { term: 'Router (Thread)', also: ['Thread router', 'full thread device'], def: 'A Thread device that keeps its radio on, forwards others\' messages and accepts child devices. A network holds up to 32.' },
    { term: 'Router-eligible end device', also: ['REED'], def: 'A mains-powered device that attaches as a child but could become a router, and promotes itself when the network wants more routers.' },
    { term: 'Sleepy end device', also: ['SED', 'sleepy child'], def: 'A Thread end device that sleeps with the radio off and polls its parent router for messages. Battery sensors are sleepy end devices.' },
    { term: 'Partition', also: ['Thread partition'], def: 'A part of a Thread mesh that has lost contact with the rest and runs as a network of its own with its own leader, until the parts meet again.' },
    { term: '6LoWPAN', also: ['IPv6 over low-power wireless'], def: 'The layer that compresses IPv6 headers and splits large packets so that IPv6 can run over 127-byte 802.15.4 frames.' }
  ],
  choose: {
    good: ['Battery sensors and mains lamps in a Matter home', 'Systems that must have no single point of failure', 'Devices that should be reachable by ordinary IP tools'],
    avoid: ['A house with a large, working Zigbee installation and no wish to change', 'Anything big or fast: 250 kbit/s and 127-byte frames', 'A home network with no IPv6 or with multicast filtered'],
    check: ['That at least one border router is in the home, and its maker', 'Whether your ecosystem shares Thread credentials with others (Thread 1.4)', 'The chip: C6, H2 or C5 for an ESP32 device']
  },
  quiz: [
    { q: 'The leader of a Thread network loses power. What happens?', choices: ['The network is lost', 'The routers elect a new leader after a short time', 'A border router takes over as coordinator', 'Every device must be paired again'], a: 1, why: 'Leadership is a role any router can take. When it is lost the remaining routers elect a new leader; the mesh keeps forwarding in the meantime.' },
    { q: 'A Thread mesh works inside the house without any Wi-Fi router.', a: true, why: 'Messages between Thread devices travel over the mesh itself. A border router is needed only to bridge to other IP networks, such as the phone\'s Wi-Fi.' },
    { q: 'Which device sleeps with its radio off and polls its parent?', choices: ['A leader', 'A router', 'A sleepy end device', 'A border router'], a: 2, why: 'Only end devices may sleep. Routers and the border router must stay awake to relay.' },
    { q: 'What does 6LoWPAN do?', choices: ['It adds a second radio', 'It compresses IPv6 headers and fragments packets so that IPv6 fits 127-byte frames', 'It encrypts the mesh', 'It chooses the channel'], a: 1, why: 'A 40-byte IPv6 header would leave little room in a 127-byte frame. 6LoWPAN compresses it and splits large packets.' }
  ],
  applications: [
    'Battery door, motion and temperature sensors in a Matter home.',
    'Mains lamps and plugs that form the mesh and relay for the sensors.',
    'Speakers and hubs that act as border routers and join the mesh to Wi-Fi.',
    'Research and test networks built with OpenThread on ESP32-H2 boards.'
  ],
  sources: [
    'Thread Group, *Thread Specification* (versions 1.3 and 1.4 for the border-router and credential-sharing features).',
    'OpenThread documentation (the open-source Thread implementation): roles and the operational dataset.',
    'Espressif, *ESP-IDF Programming Guide*, OpenThread and ESP Thread Border Router documentation.'
  ],
  sim: 'zt-thread-network'
},

/* ================================================================ openthread-on-esp */
{
  id: 'openthread-on-esp',
  parent: 'zigbee-thread-matter',
  title: 'OpenThread on an ESP',
  level: 3,
  short: 'OpenThread is the open-source Thread stack Espressif builds on. On the C6, H2 and C5 it runs on the chip itself; on a border router the chip is only its radio. The Arduino core wraps it in a small library, and a text command line is always there.',
  keywords: ['OpenThread', 'OThread.h', 'OpenThread library', 'DataSet', 'OThreadCLI', 'ot-cli', 'RCP', 'radio co-processor', 'NCP', 'Spinel', 'operational dataset', 'networkInterfaceUp', 'Thread role', 'leader', 'ESP-IDF openthread'],
  prereq: ['thread', 'zigbee-on-esp', 'soc-esp32-h2'],
  related: ['thread-border-router', 'matter-on-esp', 'esp-as-a-co-processor', 'esp-at-and-esp-hosted', 'c-series-devkits', 'esp32-h2-devkit', 'partition-tables'],
  body: `**OpenThread** is the open-source implementation of Thread, released by Google, and the stack nearly every Thread product runs, Espressif's included. ESP-IDF carries it as a component, and the Arduino core wraps it in an **OpenThread** library (since core 3.0.2, June 2024) for the chips with the radio: the ESP32-C6, H2 and C5 ([[ieee-802-15-4]]). In the core it is prebuilt for those chips; there is no MicroPython version.

### Three ways to build a Thread device

| Architecture | Where the Thread stack runs | Typical use |
|---|---|---|
| **System on chip** | on the same chip as your application and the radio | a lamp or sensor on an H2 or C6 |
| **Radio co-processor (RCP)** | on a separate host; the radio chip only sends and receives frames and talks to the host over a serial link (the Spinel protocol) | a border router: a Wi-Fi host with an H2 as its radio |
| **Network co-processor (NCP)** | on the radio chip, with a command interface for a host that knows nothing of Thread | a module added to a larger system |

Espressif's border router board uses the second form: an ESP32-S3 host with an ESP32-H2 as the RCP. The Arduino library on this page is for the first.

### The operational dataset

A Thread network is defined by its **operational dataset**: network name, channel, PAN ID, extended PAN ID, mesh-local prefix and a 128-bit **network key**. Whoever holds it can join, so treat it like a Wi-Fi password and never publish one. The first device makes a new dataset and becomes the leader; every other device must be given it. In a Matter home the phone hands it over during commissioning ([[matter-commissioning]]); a border router can show it as a hexadecimal string.

### What the program below does

It makes a new dataset with a name, channel 15 and a PAN ID, commits it, brings the Thread interface up, starts the node and prints its **role** every three seconds. The role starts as *detached*; since no other network answers, after a few seconds the node becomes the *leader* of a network of one. A second board given the same dataset would join it as a child and then, if the mesh needs it, as a router.

### The command line

OpenThread always has a text interface, \`ot-cli\`, and the Arduino library offers a class to drive it. The commands are the same everywhere:

~~~sh
dataset init new
dataset commit active
ifconfig up
thread start
state
ipaddr
~~~

\`state\` prints detached, child, router or leader; \`ipaddr\` lists the node's IPv6 addresses; \`ping\` followed by an address tests a peer. The ESP-IDF examples add a ready-made CLI, a radio co-processor firmware and a border router.

> [!key] OpenThread is the Thread stack on the C6, H2 and C5, as a system-on-chip for end devices or a radio co-processor for a border router. A network is its operational dataset; the first node makes one and becomes leader, the others must be given it.`,
  ideas: [
    'OpenThread is the open-source Thread stack; the Arduino library wraps it for the C6, H2 and C5.',
    'The stack can run on the chip itself, or on a host with the chip as a radio co-processor.',
    'A network is its operational dataset; whoever holds it can join, so keep it private.',
    'A new node reports detached, then leader when it finds no network; with a dataset of an existing network it joins as a child.'
  ],
  pitfalls: [
    'A new dataset joins my home Thread network — It makes a brand-new network with a random key. Your board is alone in it, and nothing in the home sees it. To join an existing network you need its dataset.',
    'A node that reports leader is working with Matter — A leader of a network of one is only a Thread node. Matter needs commissioning into a fabric as well.',
    'OpenThread works on any ESP32 with the right library — It needs the 802.15.4 radio: an S3 or C3 can run it only as the host of a separate radio chip.'
  ],
  terms: [
    { term: 'OpenThread', also: ['OT', 'ot-cli'], def: 'The open-source implementation of the Thread protocol, started by Google. ESP-IDF and the Arduino core both build on it.' },
    { term: 'Radio co-processor', also: ['RCP', 'Spinel'], def: 'An arrangement in which a radio chip only sends and receives 802.15.4 frames and a host runs the Thread stack, talking to it over a serial link with the Spinel protocol.' },
    { term: 'Operational dataset', also: ['active dataset', 'Thread dataset', 'network key'], def: 'The settings that define one Thread network: its name, channel, PAN ID and keys. Whoever holds it can join the network.' },
    { term: 'Thread role', also: ['device role', 'detached', 'child', 'router', 'leader'], def: 'What a Thread node currently is: disabled, detached (looking for a network), child, router or leader. The role changes by itself.' },
    { term: 'OpenThread CLI', also: ['ot-cli', 'command line'], def: 'The built-in text commands of OpenThread, such as dataset, ifconfig, thread start, state and ping, available on every build.' }
  ],
  choose: {
    good: ['System-on-chip OpenThread for lamps and sensors on an H2 or C6', 'An H2 as the radio co-processor of a border router', 'The CLI for exploring and testing a network before writing code'],
    avoid: ['An S3, C3 or classic ESP32 as a Thread node on its own', 'Publishing a dataset: it contains the network key', 'Expecting the Arduino library to cover everything: ESP-IDF has the complete API'],
    check: ['That the board is a C6, H2 or C5', 'The core version and the OpenThread example it ships', 'That the device has the dataset of the network you want to join']
  },
  code: [
    {
      title: 'A Thread node that prints its role',
      about: 'Creates a new Thread network called ESP_OpenThread on channel 15, starts the node and prints its role every three seconds. It is the core\'s leader example.',
      needs: 'An ESP32-C6 or ESP32-H2 DevKit (Arduino core 3.3.x, OpenThread library) and the serial monitor at 115200 baud.',
      wiring: [['USB', 'computer', 'for power and the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          create a new Thread dataset named [ESP_OpenThread] on channel (15) with PAN ID (0x1234) :: radio
          start the Thread node :: radio
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
          threadNode.begin(false);                    // false = do not start the network yet
          dataset.initNew();                          // a fresh network with a random key
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
      na: { py: 'MicroPython has no Thread or OpenThread support: the official ESP32 builds contain no 802.15.4 stack. Use Arduino C++ or ESP-IDF.' },
      output: `
        role: detached
        role: detached
        role: leader
        role: leader
      `,
      notes: ['The exact spelling of the role text is whatever the library prints; the sequence is what matters: detached first, then leader once no other network has answered.', 'Channel 15 is one of the four 802.15.4 channels that stay clear of Wi-Fi on channels 1, 6 and 11. Change it if your Wi-Fi plan is different.', 'The dataset holds the network key: never paste a real one into a forum or a repository.']
    }
  ],
  examples: [
    {
      title: 'Two boards, one network',
      q: 'You flash the program above to two ESP32-H2 boards. Will they form one Thread network?',
      steps: ['Each board calls initNew(), which creates a different random network key and extended PAN ID.', 'Each therefore forms its own network of one, with the same name and channel but different keys, and each reports leader.', 'To make them one network, give the second board the dataset of the first, for instance by copying the active dataset from the first (in the CLI: dataset active -x) and applying it.'],
      a: 'No: two leaders on two networks. A shared dataset is what makes one network.'
    }
  ],
  quiz: [
    { q: 'A freshly started node with a new dataset prints "detached" and then "leader". Why leader?', choices: ['It won an election against other devices', 'No other network answered, so it formed a network of one and leads it', 'It became a border router', 'It joined the home network'], a: 1, why: 'A node that finds no network with its dataset forms a new partition and becomes its leader. Leadership is just the role of the first router.' },
    { q: 'In a Thread border router built on an ESP32-S3 and an ESP32-H2, what does the H2 do?', choices: ['It runs the whole Thread stack', 'It acts as the radio co-processor: only sending and receiving 802.15.4 frames for the host', 'It provides Wi-Fi', 'It stores the dataset'], a: 1, why: 'In the RCP arrangement the host (the S3) runs the Thread stack and the border routing; the H2 is only the radio, linked by a serial line.' },
    { q: 'It is safe to post your Thread dataset on a forum, because it is only a network name.', a: false, why: 'The dataset contains the network key. Anyone with it can join your mesh and read its traffic.' },
    { q: 'Which command line instruction brings the Thread interface up?', choices: ['dataset init new', 'ifconfig up', 'thread start', 'state'], a: 1, why: 'The order is: dataset init new, dataset commit active, ifconfig up, thread start. "ifconfig up" brings the interface up; "thread start" then starts the protocol.' }
  ],
  applications: [
    'Custom Thread sensors and lamps built on an ESP32-H2 or C6.',
    'The radio co-processor of a border router for Home Assistant or a development board.',
    'Range and reliability tests of a Thread mesh with the command line.',
    'The Thread side of a Matter-over-Thread device ([[matter-on-esp]]).'
  ],
  sources: [
    'OpenThread documentation: the CLI reference and the Radio Co-Processor and Network Co-Processor designs.',
    'Arduino core for ESP32 documentation (core 3.3), *OpenThread* library and its Native examples (SimpleThreadNetwork).',
    'Espressif, *ESP-IDF Programming Guide*, OpenThread and *ESP Thread Border Router* documentation.'
  ]
},

/* ================================================================ thread-border-router */
{
  id: 'thread-border-router',
  parent: 'zigbee-thread-matter',
  title: 'The Thread border router',
  level: 2,
  short: 'A Thread mesh is an island of IPv6. A border router is the bridge to the mainland: a Thread router with a second interface that carries traffic between the mesh and the home network. Without one the mesh works inside but cannot be reached.',
  keywords: ['border router', 'OTBR', 'OpenThread Border Router', 'ESP Thread Border Router', 'border agent', 'SRP', 'NAT64', 'mDNS', 'RCP', 'Thread credentials', 'multiple border routers', 'HomePod', 'Nest Hub', 'Home Assistant', 'Thread 1.4'],
  prereq: ['thread', 'openthread-on-esp', 'ip-addresses-dhcp-dns'],
  related: ['matter', 'matter-commissioning', 'thread-border-router-hardware', 'esp-as-a-co-processor', 'esp-at-and-esp-hosted', 'home-assistant-integration', 'mdns'],
  body: `A Thread mesh is an island of IPv6. A **border router** is the bridge to the mainland: a Thread router with a second network interface, Wi-Fi or Ethernet, that joins the mesh to the home network and, through it, to phones, controllers and the internet. Without one the mesh still works inside (a sensor still switches a lamp), but nothing outside can reach it.

### What a border router does

- **Routes IPv6** between the mesh and the home network, announcing the Thread prefix so that home devices know the way in.
- **Advertises services.** Thread devices register what they offer with it (the service registration protocol, SRP), and it publishes them on the home network over mDNS, so that a controller finds a device by name ([[mdns]]).
- **Lets a phone commission** a device: its border agent allows an outside commissioner to set up the mesh and hand over credentials.
- Some also translate IPv4 (NAT64), so that Thread devices can reach servers that have no IPv6 address.

### Who has one

Many hubs and smart speakers include a border router: recent speakers and hubs from Apple, Google and Amazon, and several others. Home Assistant can become one with a USB stick that has a Thread radio and the OpenThread Border Router add-on. For development, Espressif's reference hardware is the **ESP Thread Border Router / Zigbee Gateway board**: an ESP32-S3 as the host, with Wi-Fi or Ethernet, and an ESP32-H2 as the radio co-processor over a serial link ([[openthread-on-esp]]). The catalogue also lists the M5Stack CoreS3 Thread Border Router with the same pair and a screen. The host runs the Thread stack and the border-routing software; the H2 only sends and receives frames.

### One chip or two

A chip with both radios, like the ESP32-C6, can in principle do the whole job alone, but its radio, antenna and band are shared, so Wi-Fi traffic and Thread traffic take turns. For a busy network two chips are steadier. Check the exact support of your software before you choose.

### More than one

Thread was built for several border routers: if one fails, another keeps the mesh reachable ([[thread]]: tick *Second border router* in the simulation). Border routers from different makers can serve one mesh, and Thread 1.4 added the sharing of network credentials, so that ecosystems join one mesh instead of each making their own.

### When it does not work

The usual culprits are on the home network: IPv6 or multicast turned off on the router, Wi-Fi client isolation, and a VLAN that keeps the border router and the controller apart so that mDNS never crosses. Matter over Thread ([[matter-commissioning]]) fails in exactly these ways.

> [!key] A border router is a Thread router with a Wi-Fi or Ethernet side: it routes IPv6, advertises services and lets a phone commission devices. Without it the mesh is cut off; with two the home keeps working when one fails.`,
  ideas: [
    'A border router joins a Thread mesh to Wi-Fi or Ethernet by routing IPv6 between them.',
    'It also advertises Thread services on the home network and lets a phone commission devices.',
    'Espressif\'s reference design pairs an S3 host with an H2 radio co-processor.',
    'Several border routers make the home robust; Thread 1.4 lets ecosystems share one mesh.'
  ],
  pitfalls: [
    'A border router translates Zigbee to Thread — It routes IP traffic. A Zigbee device is not a Thread device, and a border router does not turn one into the other.',
    'Any Wi-Fi router can be a border router — Only a device with a Thread radio and the right software can. An ordinary router has neither.',
    'If the border router is off, Thread devices stop working — They keep talking to each other inside the mesh. What stops is everything that comes from outside it.'
  ],
  terms: [
    { term: 'Border router', also: ['BR', 'OTBR', 'OpenThread Border Router'], def: 'A Thread router with a second interface (Wi-Fi or Ethernet) that routes IPv6 between the Thread mesh and the home network.' },
    { term: 'Border agent', def: 'The function of a border router that lets an outside commissioner, such as a phone, find the Thread network and set it up through the border router.' },
    { term: 'SRP', also: ['service registration protocol'], def: 'The protocol with which Thread devices register their services with a border router, which then advertises them on the home network.' },
    { term: 'NAT64', def: 'Translation between IPv6 and IPv4 that a border router may offer, so that Thread devices can reach servers that have only IPv4 addresses.' },
    { term: 'Thread credentials', also: ['network credentials', 'credential sharing'], def: 'The key and settings that define a Thread network. Thread 1.4 lets border routers of different ecosystems share them, so that one mesh serves all.' }
  ],
  choose: {
    good: ['A speaker or hub you already own that acts as a border router', 'Two border routers, for a home that must keep working', 'An S3 and H2 board for development with the official examples'],
    avoid: ['A single C6 serving a large, busy mesh', 'Border routers of several makers where credentials are not shared', 'A home network with IPv6 or multicast filtered'],
    check: ['Which devices in your home already are border routers', 'IPv6, multicast and mDNS on your router, and that no VLAN separates the pieces', 'That your Matter controller can reach the border router']
  },
  quiz: [
    { q: 'A Thread mesh\'s only border router loses power. What still works?', choices: ['Nothing', 'Traffic inside the mesh, such as a sensor switching a lamp', 'Only the sleepy devices', 'Only the phone app'], a: 1, why: 'Messages between Thread devices travel over the mesh itself. The border router is the way in from outside; without it the phone cannot reach the mesh.' },
    { q: 'Which two chips are on Espressif\'s Thread border router board?', choices: ['An ESP32 and an ESP8266', 'An ESP32-S3 and an ESP32-H2', 'Two ESP32-C3', 'An ESP32-P4 and an S2'], a: 1, why: 'The S3 is the host with Wi-Fi or Ethernet; the H2 is the 802.15.4 radio co-processor.' },
    { q: 'A border router can make a Zigbee lamp appear as a Thread device.', a: false, why: 'It routes IPv6. A Zigbee device speaks another protocol; a Matter bridge, not a Thread border router, is what makes it look like a Matter device.' },
    { q: 'Devices commission fine over Bluetooth but then never show up on the Thread network\'s home side. What do you check first?', choices: ['The battery', 'IPv6, multicast and mDNS between the border router and the controller', 'The Bluetooth version', 'The channel of the phone\'s Wi-Fi'], a: 1, why: 'The mesh is reached through the border router by IPv6 and found by mDNS. A router that filters either, or a VLAN that separates them, hides the devices.' }
  ],
  applications: [
    'The speaker or hub that makes a Matter-over-Thread home work.',
    'A Home Assistant box with a Thread stick and the border router add-on.',
    'A development board for testing Thread devices with the official Espressif examples.',
    'A second border router that keeps the sensors reachable when the first is unplugged.'
  ],
  sources: [
    'Espressif, *ESP Thread Border Router* documentation and its hardware platforms (the ESP32-S3 and ESP32-H2 board).',
    'OpenThread documentation, *OpenThread Border Router*.',
    'Thread Group, *Thread Specification*: border routers, service registration and credential sharing in versions 1.3 and 1.4.'
  ],
  sim: { id: 'zt-thread-network', params: { br2: true } }
},

/* ================================================================ matter */
{
  id: 'matter',
  parent: 'zigbee-thread-matter',
  title: 'Matter',
  level: 1,
  short: 'A common language for smart-home devices. One Matter lamp works with Apple Home, Google Home, Alexa, SmartThings and Home Assistant at once, controlled locally over Wi-Fi, Thread or Ethernet. It is an application layer, not a radio.',
  keywords: ['Matter', 'CHIP', 'Project CHIP', 'Connectivity Standards Alliance', 'fabric', 'multi-admin', 'smart home standard', 'Matter over Thread', 'Matter over Wi-Fi', 'Matter bridge', 'ecosystem', 'controller', 'device type', 'IPv6', 'Matter certification'],
  prereq: ['thread', 'zigbee-device-types-and-clusters', 'ip-addresses-dhcp-dns'],
  related: ['matter-commissioning', 'matter-on-esp', 'thread-border-router', 'zigbee', 'choosing-a-smart-home-radio', 'home-assistant-integration', 'regulations-cra-and-red'],
  body: `Matter is a **common language for smart-home devices**. A Matter light made by one company works with Apple Home, Google Home, Alexa, SmartThings and Home Assistant, controlled locally with no cloud between phone and lamp, because they all speak the same application layer. It is not a radio: it rides on networks that exist, **Wi-Fi**, **Thread** and **Ethernet**, and uses Bluetooth LE only for the first set-up. The Connectivity Standards Alliance, which also keeps Zigbee, maintains the standard; its open-source reference code began as Project CHIP, and the first release came in autumn 2022.

### How it is built

- **Transport.** IPv6 over Wi-Fi, Thread or Ethernet. Devices announce themselves with mDNS and are found by name.
- **Security.** Every message is encrypted, and every device holds a certificate, so a controller can tell a genuine device from an impostor ([[matter-commissioning]]).
- **Data model.** A **node** (the device) has **endpoints**; each endpoint has **clusters** with **attributes**, **commands** and **events**. The idea, and many of the numbers, come from the Zigbee Cluster Library: On/Off is cluster 0x0006 and Temperature Measurement 0x0402 in both, which is why a Zigbee lamp is easy to present as a Matter lamp ([[zigbee-device-types-and-clusters]]).
- **Device types.** Lights, plugs, switches, sensors, thermostats, fans, blinds, locks, and more with each release.

### Fabrics: several ecosystems, one device

A **fabric** is a trust domain: the devices and controllers that share one root of trust, usually one ecosystem's idea of your home. A device can belong to several fabrics at once (the standard asks for room for at least five), so the same lamp can answer Apple Home and Home Assistant together. Each ecosystem holds its own certificate on the device, and removing the device from one leaves the others untouched. The simulation ends with this: share a device with a second ecosystem.

### What Matter is not

It does not replace the radios: Zigbee devices stay Zigbee, and a **bridge** shows them to Matter controllers as Matter devices. It is not a product: a device that wears the Matter logo must pass the Alliance's certification, and the use of the logo has rules of its own. And it moves in versions: one controller may support a device type that another does not yet, and a vendor's own app may offer features the standard has not caught up with.

### On the ESP32 family

Espressif's Matter SDK, built on the open-source code, and the Arduino core's Matter library make an ESP32-family chip a Matter device: over Wi-Fi on most chips, over Thread on the C6, H2 and C5 ([[matter-on-esp]]).

> [!key] Matter is one application language over Wi-Fi, Thread and Ethernet, with certificates for every device and fabrics so that several ecosystems control one device locally. It replaces neither Zigbee's nor Thread's radio, and a product needs certification before it may carry the logo.`,
  ideas: [
    'Matter is an application layer over IPv6 on Wi-Fi, Thread or Ethernet; Bluetooth LE only starts the set-up.',
    'Devices are nodes with endpoints and clusters, in the manner of Zigbee, and many cluster numbers are the same.',
    'A fabric is one ecosystem\'s trust domain; a device can be in several, so several apps control it.',
    'Control is local: the controller talks to the device, not through a vendor\'s cloud.'
  ],
  pitfalls: [
    'Matter replaces Wi-Fi, Zigbee and Thread — It runs over Wi-Fi, Thread and Ethernet and replaces none of them. Zigbee devices need a bridge to appear in Matter.',
    'Every feature of the vendor\'s own app works over Matter — Matter covers the standard device types; extras such as special modes may stay in the vendor\'s app.',
    'Any ESP32 sketch with the Matter library is a Matter product — A sketch is a prototype that uses test certificates. A product needs certification, its own credentials and the Alliance\'s permission to use the logo.'
  ],
  terms: [
    { term: 'Matter', also: ['CHIP', 'Project CHIP', 'Connected Home over IP'], def: 'The smart-home application standard of the Connectivity Standards Alliance. It runs over IPv6 on Wi-Fi, Thread or Ethernet, and lets devices of different makers work with every ecosystem.' },
    { term: 'Fabric', also: ['multi-admin', 'Matter fabric'], def: 'A set of Matter devices and controllers that share one root of trust. A device can belong to several fabrics, one per ecosystem that controls it.' },
    { term: 'Controller', also: ['commissioner', 'admin', 'hub'], def: 'The app or hub of an ecosystem that sets devices up and controls them: a phone with Apple Home, a Google or Amazon speaker, Home Assistant.' },
    { term: 'Matter bridge', also: ['bridge'], def: 'A device that presents devices of another protocol, such as Zigbee lamps, as Matter devices, so that Matter controllers can use them.' },
    { term: 'Connectivity Standards Alliance', also: ['CSA', 'Zigbee Alliance'], def: 'The industry body that maintains Matter and Zigbee and runs their certification. It was called the Zigbee Alliance until 2021.' }
  ],
  choose: {
    good: ['A home with devices from several ecosystems that should work together', 'Local control that keeps working when the internet is down', 'New products that must work with every major platform'],
    avoid: ['A device type your target controllers do not yet support', 'Selling a Matter product without certification', 'Counting on a vendor\'s extra features to appear through Matter'],
    check: ['Which Matter version and device types your controllers support', 'IPv6 and mDNS on the home network, and a border router for Thread devices', 'The certification and logo rules before any product launch']
  },
  quiz: [
    { q: 'Which statement is true of Matter?', choices: ['It is a new radio standard', 'It is an application layer that runs over Wi-Fi, Thread and Ethernet', 'It only works over Thread', 'It needs a cloud account'], a: 1, why: 'Matter defines how devices talk and how they are set up, over IPv6 networks that already exist. It brings no radio of its own.' },
    { q: 'A lamp answers both Apple Home and Home Assistant. What makes this possible?', choices: ['Two radios in the lamp', 'The lamp belongs to two fabrics, one per ecosystem', 'A cloud account shared by both', 'The lamp copies commands'], a: 1, why: 'Each ecosystem commissions the device into its own fabric and holds its own certificate on it. The device can hold several at once.' },
    { q: 'Why is a Zigbee lamp easy to present as a Matter lamp?', choices: ['They use the same radio chip', 'Matter\'s data model borrows the Zigbee cluster model, with many of the same numbers', 'Zigbee is a part of Matter', 'Matter has no data model'], a: 1, why: 'Matter\'s nodes, endpoints and clusters follow the Zigbee Cluster Library, so a bridge can map between them cleanly.' },
    { q: 'An ESP32 sketch using the Matter library is ready to be sold with the Matter logo.', a: false, why: 'It runs with test credentials. Selling a product needs certification, the maker\'s own credentials and the Alliance\'s permission to use the logo.' }
  ],
  applications: [
    'Lamps, plugs and sensors that work in every ecosystem a household uses.',
    'A Home Assistant house that also exposes its devices to Apple Home or Alexa.',
    'A bridge that makes an existing Zigbee installation visible to Matter controllers.',
    'Prototypes of new smart-home products on an ESP32-C6, H2 or S3.'
  ],
  sources: [
    'Connectivity Standards Alliance, *Matter Specification* (core: commissioning, security, interaction model) and the Matter device library.',
    'Project CHIP (connectedhomeip) open-source repository documentation.',
    'Espressif, *ESP Matter* programming guide.'
  ],
  sim: { id: 'zt-matter-commission', params: { view: 'share' } }
},

/* ================================================================ matter-commissioning */
{
  id: 'matter-commissioning',
  parent: 'zigbee-thread-matter',
  title: 'Commissioning a Matter device',
  level: 2,
  short: 'How a Matter device gets from the box into the home: scan a code, set up a secure session over Bluetooth LE, prove the device is genuine, receive a certificate, join the network and be found. Each step has its own way of failing.',
  keywords: ['commissioning', 'QR code', 'manual pairing code', 'setup passcode', 'discriminator', 'PASE', 'CASE', 'attestation', 'fabric', 'operational certificate', 'commissioning window', 'multi-admin', 'BLE commissioning', 'on-network commissioning', 'mDNS', 'getManualPairingCode'],
  prereq: ['matter', 'ble-advertising', 'wifi-provisioning'],
  related: ['matter-on-esp', 'thread-border-router', 'secure-provisioning', 'device-identity-and-provisioning', 'ble-security', 'mdns', 'wifi-troubleshooting'],
  body: `Commissioning is how a Matter device goes from the box to the home. It proves that it is genuine, receives a certificate that makes it part of your ecosystem's fabric, and is given access to the network. It is a conversation of about ten messages; the simulation plays it step by step, with the faults.

### Step by step

1. **Scan.** The label or screen shows a QR code or a manual code. It holds the setup passcode, a 12-bit discriminator, the vendor and product numbers and the network the device uses.
2. **Bluetooth LE.** The device in commissioning mode advertises. The phone finds the one with the right discriminator and connects.
3. **PASE.** The two run a password-authenticated key exchange with the passcode. The passcode itself never travels; both end up with the same session key only if both know it.
4. **Attestation.** The device presents certificates chained to the Matter root, and the ecosystem checks that it is genuine and certified. Development builds present test certificates.
5. **Fabric.** The ecosystem issues the device an operational certificate of its own.
6. **Network.** The phone hands over the Wi-Fi name and password, or the Thread dataset.
7. **Discovery.** On the network the device announces itself over mDNS, and the controller finds it.
8. **CASE.** A second secure session, now using the certificates; commissioning is complete and Bluetooth is switched off.

### The label

The QR code begins with MT: and an encoded text; the manual code has 11 digits (21 with the vendor and product numbers). The eight-digit passcode proves physical access and is not a lifelong secret: obvious ones such as 12345678 are forbidden. The SDK's examples use a well-known test passcode, so a development device must never ship as it is; a real product prints a different passcode on each unit.

### Without Bluetooth, and sharing

A build with the Wi-Fi password compiled in, as in the library's simple examples, skips Bluetooth: the device joins by itself and the controller commissions it over the network. To add a second ecosystem the first one opens a **commissioning window** for a few minutes and shows a one-time code; the second commissions with it, and the device ends up in two fabrics.

### When it fails

- **Wrong code:** fails at step 3, before anything else changes hands.
- **Joined but not found:** the phone and the device are on different networks, or the router filters multicast or has no IPv6.
- **Never joins:** a wrong password, a network on 5 GHz only (most chips are 2.4 GHz), no Thread border router, or Bluetooth switched off on the phone.
- **Already commissioned:** remove it from its fabric first; the Arduino library then reboots it into commissioning mode.

> [!key] Commissioning scans a code, builds a secure session from the passcode, checks the device's certificates, gives it a fabric certificate and the network, and ends with discovery over mDNS. Most failures are the wrong code, or a home network that blocks IPv6 or multicast.`,
  ideas: [
    'The QR or manual code carries the setup passcode and discriminator; the passcode is used to build a session key and never travels.',
    'Bluetooth LE is only the first carrier; afterwards everything runs over Wi-Fi or Thread.',
    'The device proves itself with certificates, and gets a certificate of the ecosystem\'s fabric.',
    'Most failures are a wrong code, or a network that blocks IPv6, multicast or mDNS.'
  ],
  pitfalls: [
    'The setup code is a secret like a password — It proves physical access to the device in front of you. It is printed on the label and used once to start a secure session; a product prints a different one for each unit.',
    'Once commissioned, Bluetooth stays in use — It is switched off at the end. Control runs over the home network.',
    'A device that does not appear after "joined" is broken — Usually the home network is at fault: multicast filtered, IPv6 off, or a phone on a guest network.'
  ],
  terms: [
    { term: 'Commissioning', also: ['pairing', 'onboarding'], def: 'The set-up of a Matter device: a secure session from the setup code, a check of its certificates, a fabric certificate and the network credentials.' },
    { term: 'Setup passcode', also: ['setup PIN', 'manual pairing code', 'QR code'], def: 'An eight-digit number, printed on the device, that proves physical access and starts the secure session. The QR code and the manual code both carry it.' },
    { term: 'PASE', also: ['passcode-authenticated session establishment'], def: 'The first secure session of commissioning, built from the setup passcode without sending it.' },
    { term: 'CASE', also: ['certificate-authenticated session establishment'], def: 'The long-lived secure session between a controller and a commissioned device, built from their certificates of the same fabric.' },
    { term: 'Attestation', also: ['device attestation', 'DAC'], def: 'The check that a device is a genuine, certified product, made with certificates from its maker chained to the Matter root. Test certificates cause an app to warn.' },
    { term: 'Commissioning window', also: ['multi-admin window', 'share'], def: 'A time of a few minutes during which a commissioned device accepts a one-time code, so that a second ecosystem can add it to its own fabric.' }
  ],
  choose: {
    good: ['Bluetooth LE commissioning for devices with no screen or keyboard', 'A different passcode and discriminator printed on every unit', 'The commissioning window to share a device with a second ecosystem'],
    avoid: ['Shipping a device with the SDK\'s test passcode', 'Compiled-in Wi-Fi credentials in anything you share', 'Debugging on a guest network that isolates clients'],
    check: ['That the phone and the device share a network, with IPv6 and mDNS allowed', 'That a Thread device has a border router in range', 'That the device is in commissioning mode, and not already in a fabric']
  },
  code: [
    {
      title: 'Print the codes needed to commission',
      about: 'The core\'s on/off light with two lines added: it prints the manual pairing code and a link that draws the QR code, so that a phone can commission it. On a BLE-commissioned build the device waits until a controller adds it.',
      needs: 'An ESP32-C6 (or another Matter chip) with an LED on GPIO2 and the Matter library of the Arduino core, version 3.3.12 or later (the two matter… helper calls are new there). On an ESP32-C3 use another pin: GPIO2 is a strapping pin there.',
      wiring: [['GPIO2', '330 Ω → LED → GND', 'or any free output pin'], ['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]    // only in Wi-Fi-only builds :: wifi
          create a Matter on/off light, starting [on v] :: net
          start Matter :: net
          print (join [Manual pairing code: ] (Matter manual pairing code))
          print (join [QR code link: ] (Matter QR code link))
          wait until Matter is ready :: net
        forever
          restart if the fabric was removed :: net
        end

        when the Matter light changes (state) :: net
          set pin (2) to (state)
      `,
      cpp: String.raw`
        #include <Matter.h>

        MatterOnOffLight OnOffLight;
        const uint8_t ledPin = 2;

        bool setLightOnOff(bool state) {          // return true when applied
          digitalWrite(ledPin, state);
          return true;
        }

        void setup() {
          pinMode(ledPin, OUTPUT);
          Serial.begin(115200);
        #if !CONFIG_ENABLE_CHIPOBLE
          matterConnectWiFi("your-ssid", "your-password");   // Wi-Fi-only builds; BLE builds skip this
        #endif
          OnOffLight.begin(true);                  // initial state: on
          OnOffLight.onChange(setLightOnOff);
          Matter.begin();
          Serial.printf("Manual pairing code: %s\r\n", Matter.getManualPairingCode().c_str());
          Serial.printf("QR code link: %s\r\n", Matter.getOnboardingQRCodeUrl().c_str());
          matterWaitUntilReady();
          OnOffLight.updateAccessory();
        }

        void loop() {
          matterRestartIfNoFabric();               // reboot into commissioning mode if the fabric was removed
        }
      `,
      na: { py: 'MicroPython has no Matter support: the official ESP32 builds contain no Matter stack. Use Arduino C++ or ESP-IDF.' },
      output: `
        Manual pairing code: (eleven digits)
        QR code link: (a web address that draws the QR code)
      `,
      notes: ['The two print calls use names from the library documentation (getManualPairingCode, getOnboardingQRCodeUrl); check them against the example in your core version.', 'The credentials in the Wi-Fi call are placeholders: never leave real ones in shared code.', 'In a Matter sketch do not use the core\'s BLE library: Matter owns the Bluetooth host.']
    }
  ],
  examples: [
    {
      title: 'Where does it fail?',
      q: 'A Wi-Fi Matter device is scanned, the app shows "connecting to Bluetooth", then "setting up Wi-Fi", then, after a minute, "could not find the device". Which steps worked, and what do you check?',
      steps: ['The app got as far as handing over the Wi-Fi credentials, so the scan, the Bluetooth link, the secure session, the attestation and the fabric certificate all worked.', 'The device probably joined the Wi-Fi: it is the discovery on the home network (step 7) that failed.', 'Check that the phone is on the same network (not a guest network), that the router has IPv6 on and does not filter multicast, and that no client isolation is set.'],
      a: 'Steps 1 to 6 worked. Look at the home network: IPv6, multicast, mDNS and isolation, not at the device.'
    }
  ],
  quiz: [
    { q: 'You type the setup code wrongly. At which step does commissioning fail?', choices: ['At the scan', 'At the secure session built from the passcode, before certificates or networks change hands', 'When the device joins Wi-Fi', 'At the final discovery'], a: 1, why: 'The two sides end up with the same session key only if both know the passcode. A wrong code gives different keys, and the session is refused at once.' },
    { q: 'The setup passcode travels from the phone to the device during commissioning.', a: false, why: 'It is never sent. Each side uses it to compute keys; only a matching passcode gives matching keys.' },
    { q: 'A Matter-over-Thread device is commissioned over Bluetooth but then never appears. What is the most likely missing piece?', choices: ['A larger battery', 'A Thread border router in range, and a home network that allows IPv6 and mDNS', 'A 5 GHz network', 'A new passcode'], a: 1, why: 'The controller reaches a Thread device through a border router and finds it by mDNS. Without them the commissioning stops at discovery.' },
    { q: 'What is the commissioning window used for?', choices: ['To update the firmware', 'To let a second ecosystem add the same device to its own fabric with a one-time code', 'To reset the device', 'To change the Wi-Fi'], a: 1, why: 'The first ecosystem opens the window for a few minutes; the second commissions with the one-time code, and the device then belongs to two fabrics.' }
  ],
  applications: [
    'Setting up a Matter bulb, plug or sensor from a phone app.',
    'Debugging a failed set-up by finding which of the eight steps stopped.',
    'Sharing one device with a second ecosystem such as Home Assistant.',
    'Designing the label, the codes and the first-run behaviour of a product.'
  ],
  sources: [
    'Connectivity Standards Alliance, *Matter Specification*, commissioning: setup payload, PASE, device attestation and operational credentials.',
    'Arduino core for ESP32 documentation (core 3.3), *Matter* library and its examples.',
    'Espressif, *ESP Matter* programming guide, commissioning.'
  ],
  sim: 'zt-matter-commission'
},

/* ================================================================ matter-on-esp */
{
  id: 'matter-on-esp',
  parent: 'zigbee-thread-matter',
  title: 'Matter on an ESP',
  level: 3,
  short: 'The Arduino core has a Matter library with an endpoint class for lights, plugs, sensors, fans, thermostats and blinds. It runs over Wi-Fi on most chips and over Thread on the C6, H2 and C5. A sketch is a prototype, not a certified product.',
  keywords: ['Matter.h', 'MatterOnOffLight', 'Matter.begin', 'matterWaitUntilReady', 'updateAccessory', 'matterRestartIfNoFabric', 'matterConnectWiFi', 'ESP Matter', 'esp-matter', 'connectedhomeip', 'Huge APP', 'Matter over Thread', 'Matter over Wi-Fi', 'test credentials', 'CONFIG_ENABLE_CHIPOBLE'],
  prereq: ['matter', 'matter-commissioning', 'partition-tables'],
  related: ['openthread-on-esp', 'zigbee-on-esp', 'thread-border-router', 'ble-stacks-nimble-bluedroid', 'regulations-cra-and-red', 'ota-partitions-and-rollback', 'project-zigbee-switch'],
  body: `Two layers make Matter on an ESP: Espressif's **ESP Matter SDK**, built on the open-source Matter code and used from ESP-IDF, and the Arduino core's **Matter** library, which wraps it in one class per device type. This page is about the second, which is the quickest way to a working prototype.

### Chips and networks

| | Chips |
|---|---|
| Matter over **Wi-Fi** | ESP32, S2, S3, C3, C5, C6 |
| Matter over **Thread** | C5, C6, H2 |
| Only through the ESP-IDF component | C2, C61 |

The H2 has no Wi-Fi, so it is Thread only. The ESP32, S3 and C3 have no 802.15.4 radio, so they are Wi-Fi only. The S2 has no Bluetooth LE: it needs a Wi-Fi-only build, with the credentials in the sketch. On chips that can do both, a build option of the core's Tools menu chooses the network.

### The library

Matter arrived in the core with 3.1.0 (release candidates in October 2024, stable in December). Core 3.3.11 carries ESP Matter 1.5, and the 4.0 pre-release moves to Matter 1.6 on ESP-IDF 6.1. The endpoint classes are on/off, dimmable, colour, colour-temperature and enhanced-colour lights; on/off and dimmable plugs; fan; thermostat; window covering; generic switch; temperature, humidity, pressure, light, occupancy, contact and rain sensors; water-leak and water-freeze detectors; and a temperature-controlled cabinet.

### The shape of a program

Create the endpoint object. Call its \`begin()\` with an initial state, give it an \`onChange\` callback that applies the command and returns true, then \`Matter.begin()\` and \`matterWaitUntilReady()\`. After the first start \`updateAccessory()\` publishes the state to the controller, and \`matterRestartIfNoFabric()\` in the loop reboots the device into commissioning mode when it has been removed from its fabric. A Wi-Fi-only build starts with \`matterConnectWiFi()\`; a build commissioned over Bluetooth skips it ([[matter-commissioning]]).

### Care

- **Matter owns the Bluetooth host.** Do not use the core's BLE library in the same sketch.
- **It is big.** It needs a partition scheme with one large application slot, like Huge APP, which leaves no room for a second slot: over-the-air updates need another plan ([[partition-tables]]).
- **Test credentials.** The library's sketches use test credentials and certificates, and controllers warn about them. A product needs the maker's own credentials and the Alliance's certification ([[regulations-cra-and-red]]).
- **MicroPython** has no Matter.

> [!key] The Arduino Matter library makes an ESP32-family chip a Matter device through ready-made endpoint classes, over Wi-Fi on most chips and Thread on the C6, H2 and C5. It is a prototype tool: it needs a big partition, the whole Bluetooth host, and certification before it is a product.`,
  ideas: [
    'The Arduino Matter library has an endpoint class per device type, over ESP Matter in ESP-IDF.',
    'Wi-Fi is available on the ESP32, S2, S3, C3, C5 and C6; Thread on the C5, C6 and H2.',
    'A program is: endpoint begin, onChange callback, Matter.begin, wait until ready, update the accessory.',
    'It needs a large application partition and the whole Bluetooth host; it is a prototype, not a certified product.'
  ],
  pitfalls: [
    'The same sketch works on every ESP32 chip — The network depends on the chip: the H2 has only Thread, the ESP32, S3 and C3 only Wi-Fi, and the S2 has no Bluetooth for commissioning.',
    'I can use the BLE library for my own Bluetooth features beside Matter — Matter owns the Bluetooth host. A sketch with both will not behave.',
    'Over-the-air updates just work as usual — The big application leaves no room for two slots with the usual schemes. Plan the partitions first.'
  ],
  terms: [
    { term: 'ESP Matter', also: ['esp-matter', 'ESP Matter SDK'], def: 'Espressif\'s Matter SDK for ESP-IDF, built on the open-source connectedhomeip code. The Arduino library wraps it.' },
    { term: 'Matter endpoint class', also: ['MatterOnOffLight', 'MatterTemperatureSensor'], def: 'A class of the core\'s Matter library that creates one Matter endpoint with the clusters of one device type, such as an on/off light or a temperature sensor.' },
    { term: 'Test credentials', also: ['test certificates', 'test vendor ID'], def: 'The development vendor ID, passcode and certificates that SDK sketches use. Controllers warn that the device is not certified; a product must use its own.' },
    { term: 'Fabric removal', also: ['factory reset', 'decommission'], def: 'Taking a device out of its last fabric. The Arduino library can then reboot it into commissioning mode so that it can be added again.' }
  ],
  choose: {
    good: ['A prototype Matter light, plug or sensor on a C6 or H2', 'A Wi-Fi Matter device on a C3 or S3 for a home that has no Thread', 'The Arduino library for quick tests, ESP Matter in ESP-IDF for complete control'],
    avoid: ['The BLE library in the same sketch', 'Shipping test credentials in a product', 'MicroPython: there is no Matter support'],
    check: ['The chip and the network it supports', 'The partition scheme: large application, and what that means for updates', 'The core version, since Matter and the Zigbee SDK move together']
  },
  code: [
    {
      title: 'A Matter on/off light',
      about: 'Makes the board a Matter light on a pin. A phone or hub commissions it, and then switches the LED. This is the core\'s own light example.',
      needs: 'An ESP32-C6 (or another Matter chip) with an LED on GPIO2 and the Matter library of the Arduino core, version 3.3.12 or later (the two matter… helper calls are new there); a partition scheme with a large application. On an ESP32-C3 use another pin: GPIO2 is a strapping pin there.',
      wiring: [['GPIO2', '330 Ω → LED → GND', 'or any free output pin'], ['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          set pin (2) as [output v]
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]    // only in Wi-Fi-only builds :: wifi
          create a Matter on/off light, starting [on v] :: net
          start Matter :: net
          wait until Matter is ready :: net
          publish the light state :: net
        forever
          restart if the fabric was removed :: net
        end

        when the Matter light changes (state) :: net
          set pin (2) to (state)
      `,
      cpp: String.raw`
        #include <Matter.h>

        MatterOnOffLight OnOffLight;
        const uint8_t ledPin = 2;

        bool setLightOnOff(bool state) {          // return true when applied
          digitalWrite(ledPin, state);
          return true;
        }

        void setup() {
          pinMode(ledPin, OUTPUT);
          Serial.begin(115200);
        #if !CONFIG_ENABLE_CHIPOBLE
          matterConnectWiFi("your-ssid", "your-password");   // Wi-Fi-only builds; BLE commissioning builds skip this
        #endif
          OnOffLight.begin(true);                  // initial state
          OnOffLight.onChange(setLightOnOff);
          Matter.begin();
          matterWaitUntilReady();
          OnOffLight.updateAccessory();
        }

        void loop() {
          matterRestartIfNoFabric();               // reboot into commissioning mode if the fabric was removed
        }
      `,
      na: { py: 'MicroPython has no Matter support: the official ESP32 builds contain no Matter stack. Use Arduino C++ or ESP-IDF.' },
      output: `
        (nothing needs printing: the controller shows a new light after commissioning)
      `,
      notes: ['The network credentials are placeholders; never leave real ones in shared code ([[credentials-handling]]).', 'Do not use the core\'s BLE library in a Matter sketch: Matter owns the Bluetooth host.', 'A device removed from its fabric reboots into commissioning mode because of matterRestartIfNoFabric().']
    }
  ],
  examples: [
    {
      title: 'Which chip for which network?',
      q: 'You want a battery door sensor on Thread and a mains smart plug on Wi-Fi, both Matter, both prototyped with the Arduino core. Which chips?',
      steps: ['A Thread device needs the 802.15.4 radio: the ESP32-H2, or the C6 or C5. For a battery sensor the H2, with no Wi-Fi radio, draws least (the catalogue lists 25 mA receiving and 7 µA asleep).', 'A Wi-Fi Matter plug can use any of the Wi-Fi chips of the table: an ESP32-C3 is the cheap, low-power one, and a C6 also leaves Thread open for later.', 'The plug switches mains: that part needs a qualified person, isolation and an enclosure.'],
      a: 'An ESP32-H2 for the Thread sensor and an ESP32-C3 (or C6) for the Wi-Fi plug, each with the Matter library.'
    }
  ],
  quiz: [
    { q: 'Which chip can run Matter over Thread but not Matter over Wi-Fi?', choices: ['ESP32-C3', 'ESP32-S3', 'ESP32-H2', 'ESP32-S2'], a: 2, why: 'The H2 has an 802.15.4 radio and Bluetooth LE but no Wi-Fi. The C3, S3 and S2 have Wi-Fi but no 802.15.4 radio.' },
    { q: 'A sketch that uses the Matter library also creates a BLE service of its own. What goes wrong?', choices: ['Nothing', 'Matter owns the Bluetooth host, so the two cannot share it', 'The sketch becomes certified', 'Wi-Fi turns off'], a: 1, why: 'Matter uses Bluetooth LE for commissioning and keeps control of the host. A second user of the same host conflicts.' },
    { q: 'What does matterRestartIfNoFabric() in loop() do?', choices: ['It restarts the Wi-Fi every minute', 'It reboots the device into commissioning mode when its fabric was removed', 'It resets the passcode', 'It enables Thread'], a: 1, why: 'When the controller removes the device, nothing owns it any more. The function restarts it so that it can be commissioned again.' },
    { q: 'The Arduino Matter example is a certified product you may sell with the Matter logo.', a: false, why: 'It uses test credentials. A product needs the maker\'s own credentials, the Alliance\'s certification and permission to use the logo.' }
  ],
  applications: [
    'A prototype of a Matter light, plug or sensor for a product idea.',
    'A home-made Matter sensor added to Home Assistant, Apple Home or Google Home.',
    'Learning Matter commissioning with real hardware before a product exists.',
    'A Matter-over-Thread battery device on an ESP32-H2.'
  ],
  sources: [
    'Arduino core for ESP32 documentation (core 3.3), *Matter* library, its endpoints and the Lighting examples.',
    'Espressif, *ESP Matter* programming guide and its release notes.',
    'Connectivity Standards Alliance, *Matter Specification* and the certification program overview.'
  ]
},

/* ================================================================ choosing-a-smart-home-radio */
{
  id: 'choosing-a-smart-home-radio',
  parent: 'zigbee-thread-matter',
  title: 'Wi-Fi, BLE, Zigbee or Thread?',
  level: 2,
  short: 'There is no best radio for the smart home, only the right one for each device. Mains devices can use Wi-Fi; battery devices want Thread or Zigbee; Bluetooth LE starts the set-up; Matter sits on top of the first and the third.',
  keywords: ['smart home radio', 'Wi-Fi vs Zigbee', 'Zigbee vs Thread', 'Thread vs Wi-Fi', 'Matter over Thread', 'battery sensor radio', 'choose a protocol', 'border router', 'hub', 'mesh', 'ESP32-C6', 'ESP32-H2', 'range', 'battery life', 'comparison'],
  prereq: ['zigbee', 'thread', 'matter'],
  related: ['wifi-basics', 'bluetooth-classic-and-le', 'sleepy-ble-zigbee-thread', 'battery-life-budget', 'choosing-a-chip', 'zigbee-with-home-assistant', 'choosing-a-long-range-link'],
  body: `The four candidates answer different questions, and Matter is not a fifth radio but a language that rides on two of them.

| | Wi-Fi | Bluetooth LE | Zigbee | Thread |
|---|---|---|---|---|
| Speed | up to 150 Mbit/s (C6) | 1 to 2 Mbit/s | 250 kbit/s | 250 kbit/s |
| Network | a star to the router | point to point | a mesh | an IPv6 mesh |
| Needs | a router | a phone nearby | a coordinator | a border router |
| Battery device | hard: wake, join, send | good in bursts, mostly set-up | good | good |
| ESP chips | all but the H2 | all but the S2 | C6, H2, C5 | C6, H2, C5 |

### Rules of thumb

- **A mains device on ordinary traffic** (a plug, a lamp, a display): Wi-Fi is fine, and Matter over Wi-Fi works with the router you have.
- **A battery sensor:** Thread or Zigbee. A Wi-Fi sensor works, with fast reconnect or a C6's target wake time, but the cell lasts months where a Zigbee or Thread sensor lasts years, and it cannot receive commands while it sleeps. The simulation puts numbers on it.
- **A mesh of lamps and plugs:** Zigbee or Thread, because each mains device then relays for the battery ones around it.
- **Something that needs a phone close by:** Bluetooth LE, for set-up, proximity and short exchanges. It is not a home network.
- **A big Zigbee installation already in the house:** keep it, and add a Matter bridge. Moving is a project, not a click.
- **A new home with recent speakers and hubs:** they already are Thread border routers, so Matter over Thread comes with no extra box.

### The chips, from the catalogue

| Chip | Radios | Deep sleep |
|---|---|---|
| ESP32-C6 | Wi-Fi 6, Bluetooth LE 5.3, Zigbee 3.0, Thread 1.3 | 7 µA |
| ESP32-H2 | Bluetooth LE 5.3, Zigbee 3.0, Thread 1.4 | 7 µA |
| ESP32-C5 | dual-band Wi-Fi 6, Bluetooth LE 6.0, Zigbee 3.0, Thread 1.4 | 12 µA |
| ESP32-C3 | Wi-Fi 4, Bluetooth LE 5.0 | 5 µA |
| ESP32-S3 | Wi-Fi 4, Bluetooth LE 5.0 | 7 µA |

The C6 has all the radios but one shared radio, so they take turns: pick per product. The H2 is the pure battery choice. The C3 and S3 reach Matter only over Wi-Fi.

### Matter on top

Choosing Matter does not remove the choice of transport: a Matter device runs over Wi-Fi, Thread or Ethernet, and each has the properties above. Matter's gain is that the choice stays inside the product and every ecosystem can use it.

> [!key] Use Wi-Fi where the device is on mains and the router is near, Thread or Zigbee where it is on a battery or part of a mesh, Bluetooth LE for set-up and proximity. Matter is the language over Wi-Fi and Thread; Zigbee stays Zigbee, with a bridge when needed.`,
  ideas: [
    'Wi-Fi suits mains devices near a router; Zigbee and Thread suit battery devices and meshes; Bluetooth LE suits set-up and proximity.',
    'Zigbee and Thread share one radio, so their battery life is the same: the difference is above the radio.',
    'A Wi-Fi battery device lasts months and is reachable only when it wakes; a Zigbee or Thread one lasts years and polls its parent.',
    'Matter is an application layer over Wi-Fi and Thread, not another radio.'
  ],
  pitfalls: [
    'Thread or Zigbee is always better than Wi-Fi — For a mains device near a router, Wi-Fi needs no hub, no border router and has far more speed. Choose by the device.',
    'A stronger radio gives more range — The direct range of Wi-Fi and 802.15.4 at similar power is about the same. What extends a Zigbee or Thread network is its mesh of mains devices.',
    'Matter makes the radio question disappear — It hides it from the user, not from the designer: power, range and the need for a border router still follow the transport.'
  ],
  terms: [
    { term: 'Smart-home ecosystem', also: ['Apple Home', 'Google Home', 'Alexa', 'SmartThings'], def: 'The app, hub and cloud of one platform that sets up and controls devices. Matter lets one device serve several ecosystems.' },
    { term: 'Hub', also: ['gateway', 'bridge'], def: 'A box that adds a radio or protocol to a home: a Zigbee coordinator, a Thread border router, a Matter bridge or a speaker that does several of these.' },
    { term: 'Mesh', also: ['mesh network'], def: 'A network in which mains-powered devices relay each other\'s messages, so that coverage grows with the number of devices and a lost device is routed around.' },
    { term: 'Target wake time', also: ['TWT'], def: 'A Wi-Fi 6 feature in which a device and its access point agree when the device will wake, so that a battery device can sleep between agreed times. The ESP32-C6 and C5 support it.' }
  ],
  choose: {
    good: ['Wi-Fi for mains devices that need speed or have a router nearby', 'Thread (Matter) or Zigbee for battery sensors and mains meshes', 'Bluetooth LE for set-up and for anything that follows a phone'],
    avoid: ['Wi-Fi on a coin cell without a very long reporting interval', 'A Thread or Zigbee device with no hub, border router or coordinator planned', 'Choosing a radio before the device and its power source are known'],
    check: ['How the device is powered, and how often it must report', 'Which hub, border router or coordinator the home already has', 'Whether your target ecosystems support the device type over the transport you chose']
  },
  examples: [
    {
      title: 'A door sensor reporting twelve times an hour',
      q: 'On two AA cells (2500 mAh), compare a door sensor on Wi-Fi (an ESP32-C6, awake 1 s per report, 82 mA receiving) with the same sensor on Thread or Zigbee (an ESP32-H2: 15 ms of radio per report, a 20 s poll). Both asleep at 7 µA. Roughly how long does the cell last?',
      steps: ['Wi-Fi: $12 \\times 82\\ \\text{mA} \\times 1\\ \\text{s} / 3600 = 0.27$ mA, plus 7 µA: about 0.28 mA. With the cell\'s own self-discharge, 80 % of 2500 mAh lasts about 0.8 years.', 'Zigbee or Thread: reports $12 \\times 25 \\times 0.015 / 3600 = 1.3$ µA; polls $25 \\times 0.005 / 20 = 6.3$ µA; sleep 7 µA: about 14.5 µA. The cell lasts about 10 years, by which time its own self-discharge is a third of the drain.', 'With a Wi-Fi wake time of 0.3 s (fast reconnect) the Wi-Fi sensor gets about 2.4 years: better, still a quarter of the other.'],
      a: 'About 0.8 years on Wi-Fi (2.4 with fast reconnect) against about 10 years on Thread or Zigbee. The numbers rest on stated assumptions and ignore peak current and the board\'s other parts.'
    }
  ],
  quiz: [
    { q: 'A battery temperature sensor must run for five years on two AA cells and report every five minutes. Which radio?', choices: ['Wi-Fi with a normal reconnect', 'Thread or Zigbee on an ESP32-H2', 'Bluetooth Classic', 'Wi-Fi at 5 GHz'], a: 1, why: 'A sleepy end device on 802.15.4 spends a few milliseconds a report. Wi-Fi spends a second or more connecting each time, which uses the cell in about a year.' },
    { q: 'Zigbee and Thread have different battery life on the same chip.', a: false, why: 'They use the same 802.15.4 radio. The difference lies above it: addressing, the hub, the application layer.' },
    { q: 'A house already has a Zigbee network of eighty devices and wants Matter. What is the sensible first step?', choices: ['Replace everything with Thread devices', 'Keep the Zigbee network and add a Matter bridge', 'Switch off Zigbee', 'Move all devices to Wi-Fi'], a: 1, why: 'A bridge presents the Zigbee devices to Matter controllers, so nothing must be replaced.' },
    { q: 'Which of these chips can do Matter over Thread?', choices: ['ESP32-S3', 'ESP32-C3', 'ESP32-H2', 'ESP32'], a: 2, why: 'Only chips with the 802.15.4 radio: the C6, H2 and C5. The S3, C3 and ESP32 do Matter over Wi-Fi only.' }
  ],
  applications: [
    'Choosing the radio of a new smart-home product.',
    'Deciding what to buy for a house that already has a hub.',
    'Planning a mix: Wi-Fi plugs, Thread battery sensors, a Bluetooth LE set-up.',
    'Choosing between the ESP32-C6, H2 and C3 for a given device.'
  ],
  sources: [
    'Espressif, *ESP32-C6*, *ESP32-H2* and *ESP32-C3 Series Datasheets*: radios, currents and sleep modes.',
    'Connectivity Standards Alliance, *Matter Specification* and *Zigbee Specification*, scope sections.',
    'Thread Group, *Thread Specification*, overview of the network layer and device roles.'
  ],
  sim: 'zt-compare-light'
}
);
