/* HYPER-ESP32 · content/esp-now-and-peer-to-peer.js
 *
 * The topic "ESP-NOW and board to board": ESP-NOW and its peers, topologies, Wi-Fi channel, encryption, a gateway to
 * MQTT, reliability; mesh networks; UDP, TCP and WebSockets between boards; BLE between boards; keeping boards in time.
 * Simulations: sims/esp-now-and-peer-to-peer.js (en-*).
 */
Hyper.add(
/* ================================================================ esp-now */
{
  id: 'esp-now',
  parent: 'esp-now-and-peer-to-peer',
  title: 'ESP-NOW',
  level: 1,
  short: 'A way for ESP boards to message one another directly: no router, no connection, no internet. A frame of up to 250 bytes leaves on the Wi-Fi radio, and the other board acknowledges it about a millisecond later.',
  keywords: ['ESP-NOW', 'espnow', 'peer to peer', 'esp_now_send', 'esp_now_init', 'no router', 'connectionless', 'vendor action frame', '250 bytes', 'remote control', 'sensor network', 'board to board', 'send callback'],
  prereq: ['wifi-basics', 'the-shared-radio'],
  related: ['esp-now-peers-and-addresses', 'esp-now-topologies', 'wifi-long-range-mode', 'ble-between-boards', 'project-esp-now-sensors', 'deep-sleep'],
  body: `A door sensor in the garden has to tell a chime in the house that someone has opened the gate. Wi-Fi would do it, but the sensor would have to join the router, ask for an address and open a connection — a second or two of radio from a battery, every time. **ESP-NOW** skips all of it: the sensor puts one small message on the air, addressed to the chime, and goes back to sleep.

### What it is

ESP-NOW is a protocol of Espressif's, carried by the same 2.4 GHz Wi-Fi radio as ordinary Wi-Fi. A message travels as one special 802.11 frame — a vendor-specific action frame — with up to **250 bytes** of your own data in it (newer software, ESP-NOW version 2, allows 1470 bytes between boards that both have it). There is no network to join: no password, no DHCP, no IP address, no router. Boards are addressed by their **MAC addresses** ([[esp-now-peers-and-addresses]]), and the Wi-Fi radio must be switched on but need not be connected to anything.

A message to one named board is **acknowledged** by that board's radio, and the sender's hardware repeats the frame a few times if the acknowledgement does not come. A message to the broadcast address reaches every board in earshot, is not acknowledged and is not repeated.

### The numbers

| | Value |
|---|---|
| Payload | 250 bytes (version 1) · 1470 bytes (version 2, both ends) |
| Peers a board can address | 20 in all, at most 6 of them encrypted |
| Time on air at 1 Mbit/s | about 0.7 ms (20 bytes) · about 2.6 ms (250 bytes) |
| Range | that of the Wi-Fi radio: tens of metres indoors, a couple of hundred in clear view; more in the long-range mode between Espressif chips ([[wifi-long-range-mode]]) |
| Chips | every ESP with Wi-Fi: ESP32, S2, S3, C2, C3, C5, C6, C61 — not the H2 (no Wi-Fi) or the P4 alone |

The simulations below show a message with its acknowledgement, and the cost in battery. The surprise there: the **air time is not the expensive part**. A few milliseconds of transmitting are nothing next to waking the chip and starting Wi-Fi and ESP-NOW, which take tens or hundreds of milliseconds at a similar current.

### What it is not

ESP-NOW is not a network. Nothing routes a frame beyond its sender's radio range, and a phone cannot take part. Two boards can only talk on **the same Wi-Fi channel** ([[esp-now-with-wifi]]). An acknowledgement means the other radio heard the frame, not that its program handled it ([[reliability-acks-and-retries]]). And it is open unless you switch encryption on ([[esp-now-encryption]]).

### Where it fits

Choose it for a handful of ESP boards that need to talk with little code, power and delay: remote controls, button and sensor nodes, a doorbell. Choose Wi-Fi with MQTT when data must reach the internet, and Bluetooth LE when a phone is involved.

> [!key] ESP-NOW sends up to 250 bytes from one ESP board to another over the Wi-Fi radio, with no router and no connection. It is quick and cheap in energy, limited to Espressif boards on one channel, and its "sent" status only means the other radio heard it.`,
  ideas: [
    'A message is one Wi-Fi frame addressed by MAC address: there is no network to join, no IP address and no router.',
    'A unicast frame is acknowledged and repeated by the radio hardware; a broadcast frame is neither.',
    'The payload is 250 bytes in version 1 and 1470 in version 2; a board can address 20 peers, 6 of them encrypted.',
    'Transmitting takes a few milliseconds; waking the chip and starting the radio costs much more energy than the frame.'
  ],
  pitfalls: [
    'ESP-NOW and Wi-Fi are two different things, so an ESP-NOW board needs no Wi-Fi network — Almost right: it needs no network to join, but the Wi-Fi radio must be started, and both boards must be on the same channel.',
    'The "delivered" status means my program on the other board got the message — It means the other board\'s radio acknowledged the frame. The receiving program may have been busy, or may have dropped the message after the acknowledgement.',
    'ESP-NOW reaches any device with Wi-Fi, including phones and laptops — Only Espressif chips speak it. A phone cannot send or receive an ESP-NOW frame.'
  ],
  terms: [
    { term: 'ESP-NOW', also: ['espnow'], def: 'Espressif\'s connectionless protocol for sending short messages directly between ESP boards over the Wi-Fi radio, with no router, no IP address and no connection set-up.' },
    { term: 'Action frame', also: ['vendor-specific action frame'], def: 'A kind of 802.11 management frame that carries a vendor\'s own data. ESP-NOW puts each message in one, which is why it needs no network.' },
    { term: 'Payload', also: ['data length', 'message size'], def: 'The bytes of your own data inside a frame. In ESP-NOW version 1 at most 250 of them; in version 2, 1470.' },
    { term: 'Acknowledgement', also: ['ACK', 'MAC-layer ACK'], def: 'A short frame the receiving radio sends back at once when a unicast frame arrives. It tells the sender\'s hardware that the frame was heard, not that the receiving program has handled it.' },
    { term: 'Send callback', also: ['on-sent callback', 'esp_now_register_send_cb'], def: 'A function the system calls when a frame has been sent, with a status: success means the acknowledgement arrived (or, for a broadcast, that the frame went out).' }
  ],
  choose: {
    good: ['A few ESP boards talking directly: remotes, buttons, sensor nodes, robots', 'Battery devices that must wake, send and sleep in a fraction of a second', 'Places with no router, or where a router must not be needed'],
    avoid: ['Anything that must reach the internet or a phone by itself: use Wi-Fi with MQTT or Bluetooth LE', 'Large or guaranteed transfers: files, firmware, streams', 'Hundreds of boards or multi-hop coverage: look at a mesh'],
    check: ['That every chip you use has Wi-Fi: the ESP32-H2 and the ESP32-P4 do not', 'Which channel the boards will be on, and whether a router will move it', 'Whether anything on the air (a door, a lock, a motor) must be protected: switch encryption on']
  },
  code: [
    {
      title: 'Say hello to whoever is listening',
      about: 'Every board broadcasts a small message every two seconds and prints every message it hears. The same program runs on all boards, because the broadcast address needs no pairing and no list of addresses.',
      needs: 'Two or more ESP32-family boards with Wi-Fi (ESP32, S2, S3, C2, C3, C5, C6) and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          add peer [FF:FF:FF:FF:FF:FF] :: radio
          set [count v] to (0)

        every (2) seconds
          send (join [1,] (count)) to peer [FF:FF:FF:FF:FF:FF] :: radio
          change [count v] by (1)

        when data received from (sender) :: radio
          print (join [heard: ] (received data))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        const uint8_t BROADCAST[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

        typedef struct __attribute__((packed)) {
          uint8_t id;                    // which board sent it: give each board its own
          uint16_t count;                // a running number
        } Message;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(Message)) return;      // not one of ours
          Message m;
          memcpy(&m, data, sizeof(m));
          Serial.printf("heard: board %u, number %u\n", (unsigned)m.id, (unsigned)m.count);
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);                     // Wi-Fi on, joined to nothing
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, BROADCAST, 6);
          peer.channel = 0;                        // 0 = the channel the radio is on
          peer.encrypt = false;                    // a broadcast cannot be encrypted
          esp_now_add_peer(&peer);
        }

        void loop() {
          static uint16_t count = 0;
          Message m = {1, count++};
          esp_now_send(BROADCAST, (uint8_t *)&m, sizeof(m));
          delay(2000);
        }
      `,
      py: String.raw`
        import network, espnow, struct, time

        BROADCAST = b"\xff\xff\xff\xff\xff\xff"

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)                           # Wi-Fi on, joined to nothing
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(BROADCAST)                      # channel 0, no encryption

        count = 0
        last = time.ticks_add(time.ticks_ms(), -2000)
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 2000:
                last = time.ticks_ms()
                e.send(BROADCAST, struct.pack("<BH", 1, count))   # id 1, a running number
                count += 1
            mac, msg = e.recv(100)                 # wait up to 100 ms; (None, None) if nothing came
            if msg and len(msg) == 3:
                board, number = struct.unpack("<BH", msg)
                print("heard: board", board, "number", number)
      `,
      output: `
        heard: board 1, number 0
        heard: board 1, number 1
        heard: board 1, number 2
      `,
      notes: ['Change the id from 1 to a different number on each board, or you cannot tell them apart.', 'Do not print from the receive callback for long: it runs inside the Wi-Fi task. Copy the data out and handle it in the loop for anything slower than a print.']
    },
    {
      title: 'Send to one board and learn whether it arrived',
      about: 'A message to one named board, with the send callback reporting whether that board\'s radio acknowledged it. Run the first program on the other board to see the messages arrive.',
      needs: 'Two ESP32-family boards. Replace the address with the station MAC address of the receiving board ([[esp-now-peers-and-addresses]] shows how to read it).',
      blocks: `
        when started
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          add peer [AA:BB:CC:DD:EE:FF] :: radio
          set [count v] to (0)

        every (2) seconds
          send (join [2,] (count)) to peer [AA:BB:CC:DD:EE:FF] :: radio
          change [count v] by (1)

        when send result arrives :: radio
          if <(send result) = [delivered v]> then
            print [delivered: the other radio acknowledged]
          else
            print [not delivered: no acknowledgement]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        uint8_t peerMac[6] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};   // the other board's station MAC

        typedef struct __attribute__((packed)) {
          uint8_t id;
          uint16_t count;
        } Message;

        // core 3.3 (ESP-IDF 5.5): the send callback gets an info structure, not the MAC address
        void onDataSent(const esp_now_send_info_t *info, esp_now_send_status_t status) {
          Serial.println(status == ESP_NOW_SEND_SUCCESS ? "delivered: the other radio acknowledged"
                                                         : "not delivered: no acknowledgement");
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_send_cb(onDataSent);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, peerMac, 6);
          peer.channel = 0;
          peer.encrypt = false;
          esp_now_add_peer(&peer);
        }

        void loop() {
          static uint16_t count = 0;
          Message m = {2, count++};
          esp_now_send(peerMac, (uint8_t *)&m, sizeof(m));
          delay(2000);
        }
      `,
      py: String.raw`
        import network, espnow, struct, time

        PEER = b"\xaa\xbb\xcc\xdd\xee\xff"           # the other board's station MAC

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(PEER)

        count = 0
        while True:
            ok = e.send(PEER, struct.pack("<BH", 2, count))   # waits for the acknowledgement
            print("delivered: the other radio acknowledged" if ok else "not delivered: no acknowledgement")
            count += 1
            time.sleep_ms(2000)
      `,
      output: `
        delivered: the other radio acknowledged
        delivered: the other radio acknowledged
        not delivered: no acknowledgement
      `,
      notes: ['The send callback shown is the core 3.3 form; on a core older than 3.3 its first argument is the peer\'s MAC address, const uint8_t *mac.', '"Not delivered" appears when the other board is off, out of range or on another channel. Try each.', 'A success only says the other radio heard the frame; for proof that the program there handled it, add an acknowledgement of your own ([[reliability-acks-and-retries]]).']
    }
  ],
  examples: [
    {
      title: 'How much of the air does a sensor use?',
      q: 'A sensor sends a 20-byte message every 60 seconds. How long is the radio actually on the air in a day, and what share of the day is that?',
      steps: ['A 20-byte payload at 1 Mbit/s takes about 0.73 ms on the air.', 'There are 24 × 60 = 1440 messages a day, so $1440 \\times 0.73 \\text{ ms} \\approx 1.05$ s of transmission.', 'A day has 86 400 s, so the share is $1.05 / 86\\,400 \\approx 0.0012\\,\\%$.'],
      a: 'About one second a day, a thousandth of a percent of the time. Even a hundred such sensors leave the channel almost empty; their battery life is decided by the wake-up, not by the radio time.'
    }
  ],
  quiz: [
    { q: 'The send callback of a unicast ESP-NOW message reports success. What has happened?', choices: ['The receiving program has handled the message', 'The receiving board\'s radio acknowledged the frame', 'A router has stored the message', 'Nothing yet: the callback always reports success'], a: 1, why: 'Success is a MAC-layer fact: an acknowledgement frame came back. Whether the program on the other board ran its callback and did anything useful is not known to the sender.' },
    { q: 'Two ESP-NOW boards must both be joined to the same Wi-Fi router to talk.', a: false, why: 'ESP-NOW needs no network. The boards must have Wi-Fi switched on and be on the same radio channel; neither has to be connected to anything.' },
    { q: 'What is the largest payload of an ESP-NOW frame in version 1?', choices: ['250 bytes', '1500 bytes', '32 bytes', 'There is no limit'], a: 0, why: 'Version 1 carries up to 250 bytes of data. Version 2 raises it to 1470 bytes, but only when both boards have the newer software.' },
    { q: 'Which of these chips cannot use ESP-NOW at all?', choices: ['ESP32-C3', 'ESP32-S3', 'ESP32-H2', 'ESP32-C6'], a: 2, why: 'ESP-NOW rides on the Wi-Fi radio. The ESP32-H2 has Bluetooth LE and 802.15.4 but no Wi-Fi.' }
  ],
  applications: [
    'Wireless remote controls and buttons: a handheld board commanding a lamp, a robot or a gate.',
    'Battery sensors that wake, send one frame and sleep again ([[project-esp-now-sensors]]).',
    'A doorbell or alarm sensor talking to a chime without any network in between.',
    'Quick board-to-board links while prototyping, before a network is chosen.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference: the ESP-NOW section and the header esp_now.h.',
    'Arduino core for ESP32 documentation, the *ESP-NOW* library and its examples (core 3.3).',
    'MicroPython documentation, the *espnow* module (version 1.29).'
  ],
  sim: ['en-exchange', 'en-airtime']
},

/* ================================================================ esp-now-peers-and-addresses */
{
  id: 'esp-now-peers-and-addresses',
  parent: 'esp-now-and-peer-to-peer',
  title: 'Peers, MAC addresses and broadcast',
  level: 1,
  short: 'ESP-NOW boards are addressed by their MAC addresses. A sender lists the boards it will talk to as peers; the broadcast address FF:FF:FF:FF:FF:FF reaches everyone in earshot without any list at all.',
  keywords: ['MAC address', 'peer', 'esp_now_add_peer', 'broadcast address', 'FF:FF:FF:FF:FF:FF', 'WiFi.macAddress', 'station MAC', 'soft AP MAC', 'peer list', 'pairing', 'discovery', 'esp_wifi_set_mac'],
  prereq: ['esp-now', 'wifi-station'],
  related: ['esp-now-topologies', 'esp-now-encryption', 'esp-now-with-wifi', 'ip-addresses-dhcp-dns'],
  body: `Radio is shared. Every frame a board sends is heard by every board in range, so each frame carries the address of the board it is meant for, and everyone else ignores it. In Wi-Fi, and so in ESP-NOW, that address is the **MAC address**: six bytes, written in hex as \`24:6F:28:AA:BB:CC\`. A **peer** is simply a board you have told ESP-NOW about, by giving its address.

### Where the address comes from

Every ESP chip carries a **base MAC address** burnt in at the factory. The Wi-Fi station interface uses it; the soft access point, Bluetooth and Ethernet use addresses derived from it. ESP-NOW addresses a peer by the address of the **interface** that will hear it — normally the station — so the number you want is the one the board prints for its Wi-Fi station. Read it in the first program below: start Wi-Fi, then print the address. On some core versions the call returns zeros until Wi-Fi has been started.

Write each board's address on a label. Hard-coding the addresses of the other boards is the simplest scheme for a small, fixed set: it needs no code to discover anything. Its price is that replacing a board means editing the others — or giving the new board the old board's address, which the Wi-Fi API allows as long as it is a unicast address (the lowest bit of the first byte zero).

### The peer list

To send, a board must first **add the destination as a peer**. The call takes the address, the channel (0 means "the channel the radio is on now") and whether to encrypt. A board can hold **20 peers**, of which only **6** may be encrypted ([[esp-now-encryption]]). Adding an address twice, or a twenty-first peer, returns an error. To *receive*, nothing needs to be added: any unencrypted frame sent to your address, or to the broadcast address, arrives in your receive callback together with the sender's address.

### Broadcast

The address \`FF:FF:FF:FF:FF:FF\` means "everyone in range". It must still be added as a peer before sending to it, but then a single frame is heard by every board on the channel. There is no acknowledgement and no automatic repeat, and a broadcast cannot be encrypted. That is exactly right for beacons, discovery and "the button was pressed", and wrong for anything that must arrive.

### Finding each other

When boards are not known in advance, use the broadcast as a doorbell. A new board broadcasts "hello"; the board that hears it reads the sender's address from the receive callback, adds it as a peer, and from then on talks to it directly. The second program does this. Do the \`add peer\` from the main loop rather than inside the callback, which runs in the Wi-Fi task.

> [!key] A peer is a MAC address you have registered; you must register a destination before sending to it, but you need not register anyone to receive from them. The broadcast address reaches everyone on the channel with no pairing, no acknowledgement and no encryption.`,
  ideas: [
    'Every frame carries a destination MAC address; the radio of every other board ignores frames not meant for it.',
    'A sender must add the destination as a peer first; a receiver needs no peer to hear unencrypted frames addressed to it.',
    'The broadcast address reaches every board in earshot, with no acknowledgement and no encryption.',
    'A board can use "hello" broadcasts to be discovered and then talk to the sender directly.'
  ],
  pitfalls: [
    'A board has one MAC address — It has several, one per interface. ESP-NOW uses the one of the interface you chose: normally the station address, not the soft access point\'s.',
    'I must add the sender as a peer before I can receive from it — Only to send. Receiving an unencrypted frame needs no peer; the sender\'s address arrives with the message.',
    'Broadcast is a quick way to reach one board — It reaches all of them, unacknowledged. Anything within range acts on a command sent that way unless the program checks who it is from.'
  ],
  terms: [
    { term: 'MAC address', also: ['hardware address', 'station MAC', 'EUI-48'], def: 'A six-byte address that identifies one network interface on the radio, written as AA:BB:CC:DD:EE:FF. ESP-NOW addresses boards by it.' },
    { term: 'Peer', also: ['peer list', 'esp_now_add_peer'], def: 'A board that this board has registered, by MAC address, channel and encryption setting, so that it can send to it. Up to 20 can be registered.' },
    { term: 'Broadcast address', also: ['FF:FF:FF:FF:FF:FF'], def: 'The special address that every radio accepts. A frame sent to it is heard by all boards on the channel, and is neither acknowledged nor repeated.' },
    { term: 'Interface', also: ['STA', 'AP', 'ifidx'], def: 'One of the Wi-Fi roles of a chip: the station, which joins networks, or the soft access point. Each has its own MAC address; ESP-NOW sends and listens through the one you name.' },
    { term: 'Discovery', also: ['pairing', 'handshake by broadcast'], def: 'Letting boards find each other without fixed addresses: one broadcasts a hello, the other learns the sender\'s MAC address from it and adds it as a peer.' }
  ],
  choose: {
    good: ['Fixed addresses written into the code when there are a few boards and they never change', 'A hello broadcast for discovery when boards come and go', 'Broadcast for beacons, "hello" and notices that need no proof of arrival'],
    avoid: ['Broadcast for commands that must arrive or must not be obeyed by strangers', 'Typing addresses by hand when there are dozens of boards: store them in a table or discover them', 'Using the soft access point address when the peer listens as a station'],
    check: ['That the printed address is the station one, read after Wi-Fi was started', 'That the peer list never has to exceed 20 entries (6 if encrypted)', 'That a command received from an unknown address is ignored']
  },
  code: [
    {
      title: 'Read this board\'s own address',
      about: 'Prints the station MAC address, which is the address other boards use to send to this one. Do it once for every board and write the result on its label.',
      needs: 'Any ESP32-family board with Wi-Fi.',
      blocks: `
        when started
          start serial at (115200) baud
          start Wi-Fi without connecting :: wifi
          print (join [station MAC: ] (MAC address))
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);                       // start Wi-Fi first, or some cores print zeros
          delay(100);
          Serial.print("station MAC: ");
          Serial.println(WiFi.macAddress());
        }

        void loop() {}
      `,
      py: String.raw`
        import network, binascii

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        print("station MAC:", binascii.hexlify(sta.config("mac"), ":").decode().upper())
      `,
      output: `
        station MAC: 24:6F:28:AA:BB:CC
      `,
      notes: ['The soft access point of the same board has a different address; ESP-NOW peers that listen as a station use this one.']
    },
    {
      title: 'Learn a peer from its first message',
      about: 'Boards broadcast "hello" until they hear one from somebody else. The first sender heard becomes a peer, and from then on the board sends to it directly and prints the delivery result.',
      needs: 'Two ESP32-family boards running the same program.',
      blocks: `
        when started
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          add peer [FF:FF:FF:FF:FF:FF] :: radio
          set [friend v] to [none]

        every (2) seconds
          if <(friend) = [none]> then
            send [hello] to peer [FF:FF:FF:FF:FF:FF] :: radio
          else
            send [hello again] to peer (friend) :: radio
          end

        when data received from (sender) :: radio
          if <(friend) = [none]> then
            set [friend v] to (sender)
            add peer (sender) :: radio
            print (join [new friend: ] (sender))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        const uint8_t BROADCAST[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
        uint8_t friendMac[6];
        volatile bool heardSomeone = false;      // set in the callback, used in loop()
        uint8_t heardMac[6];
        bool haveFriend = false;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (!haveFriend && !heardSomeone) {
            memcpy(heardMac, info->src_addr, 6);   // remember who it was
            heardSomeone = true;
          }
        }

        void addPeer(const uint8_t *mac) {
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, mac, 6);
          peer.channel = 0;
          peer.encrypt = false;
          esp_now_add_peer(&peer);
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
          addPeer(BROADCAST);
        }

        void loop() {
          if (heardSomeone && !haveFriend) {       // add the peer here, not in the callback
            memcpy(friendMac, heardMac, 6);
            addPeer(friendMac);
            haveFriend = true;
            Serial.printf("new friend: %02X:%02X:%02X:%02X:%02X:%02X\n", friendMac[0], friendMac[1], friendMac[2], friendMac[3], friendMac[4], friendMac[5]);
          }
          const char *text = haveFriend ? "hello again" : "hello";
          esp_now_send(haveFriend ? friendMac : BROADCAST, (const uint8_t *)text, strlen(text));
          delay(2000);
        }
      `,
      py: String.raw`
        import network, espnow, binascii, time

        BROADCAST = b"\xff\xff\xff\xff\xff\xff"

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(BROADCAST)

        friend = None
        last = time.ticks_add(time.ticks_ms(), -2000)
        while True:
            mac, msg = e.recv(100)                 # (None, None) if nothing came
            if msg and friend is None:
                friend = bytes(mac)                # remember who it was ...
                e.add_peer(friend)                 # ... and add it as a peer
                print("new friend:", binascii.hexlify(friend, ":").decode().upper())
            if time.ticks_diff(time.ticks_ms(), last) >= 2000:
                last = time.ticks_ms()
                if friend is None:
                    e.send(BROADCAST, b"hello")
                else:
                    ok = e.send(friend, b"hello again")
                    print("delivered" if ok else "not delivered")
      `,
      output: `
        new friend: 24:6F:28:11:22:33
      `,
      notes: ['Anyone can send "hello": the first board to answer becomes the friend. For anything that matters, check a shared secret in the message or use encrypted peers ([[esp-now-encryption]]).', 'The code adds the peer in the main loop, not inside the receive callback, which runs in the Wi-Fi task.']
    }
  ],
  examples: [
    {
      title: 'How many boards can one remote command?',
      q: 'A handheld remote must send a command to 30 lamp boards, each of which needs the same message. Can it add all of them as peers? What else could it do?',
      steps: ['A board can register at most 20 peers, so 30 individual peers do not fit.', 'Alternative one: a single broadcast frame that all 30 lamps hear; the message carries a group number, and each lamp checks it.', 'Alternative two: ten lamps per remote, or a gateway board that fans the command out.'],
      a: 'Not as individual peers — only 20 fit. A broadcast frame reaches all 30 at once; the price is no acknowledgement, so repeat the command a few times or let the lamps report their state.'
    }
  ],
  quiz: [
    { q: 'A board wants to send a message to the broadcast address. What must it do first?', choices: ['Nothing: any address can be used', 'Add FF:FF:FF:FF:FF:FF as a peer', 'Join a Wi-Fi network', 'Read the MAC address of every board'], a: 1, why: 'Sending to an address that is not in the peer list fails, and that includes the broadcast address. Add it once, with channel 0 and no encryption.' },
    { q: 'To receive an unencrypted ESP-NOW frame sent to it, a board must first add the sender as a peer.', a: false, why: 'Only sending needs a peer entry. The receive callback is called for frames addressed to the board or to the broadcast address, with the sender\'s address in the information it is given.' },
    { q: 'Why does the discovery program add the new peer in loop() rather than in the receive callback?', choices: ['The callback is too short to hold the call', 'The callback runs in the Wi-Fi task and should only copy data out', 'Peers cannot be added after start-up', 'The loop has more memory'], a: 1, why: 'The receive callback is called from the Wi-Fi task. Keep it short: copy the address and set a flag, then do the real work, such as adding a peer, in your own task.' },
    { q: 'A board has two Wi-Fi interfaces, station and soft access point. Which MAC address does a peer that listens as a station need?', choices: ['The soft access point address', 'The station address', 'Either: they are the same', 'The Bluetooth address'], a: 1, why: 'Each interface has its own address. The peer is reached through the interface it listens on, so a station is addressed by its station MAC.' }
  ],
  applications: [
    'A remote control that holds the addresses of the two or three receivers it commands.',
    'A "button pressed" notice broadcast to every light in a room.',
    'A pairing step at the factory: a board broadcasts hello, the gateway learns its address and stores it.',
    'Swapping a faulty board by giving the replacement the old board\'s address.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference, ESP-NOW: the peer functions and the structure esp_now_peer_info_t.',
    'Arduino core for ESP32 documentation, *ESP-NOW*: the broadcast examples.',
    'IEEE 802, *Overview and Architecture*: the 48-bit MAC address format and the broadcast address.'
  ],
  sim: 'en-broadcast'
},

/* ================================================================ esp-now-topologies */
{
  id: 'esp-now-topologies',
  parent: 'esp-now-and-peer-to-peer',
  title: 'One to one, one to many, many to one',
  level: 2,
  short: 'Who talks to whom: a pair, a controller with many receivers, many sensors reporting to one collector, or everyone to everyone. Each shape has its own cost on the air and its own trap.',
  keywords: ['topology', 'star', 'one to many', 'many to one', 'collector', 'gateway', 'sink', 'broadcast', 'multi-hop', 'relay', 'flooding', 'node id', 'sensor network', 'ESP-NOW'],
  prereq: ['esp-now', 'esp-now-peers-and-addresses'],
  related: ['esp-now-gateway', 'mesh-networks-on-esp', 'reliability-acks-and-retries', 'esp-now-with-wifi'],
  body: `ESP-NOW has no notion of a network, only of frames between addresses. A **topology** is what you build on top: who sends to whom, and who keeps the list. Four shapes cover nearly every project.

### One to one

Two boards, each a peer of the other. A remote and its receiver, a pair of paddles for a game. It is the simplest case: use unicast, check the send callback, and add your own acknowledgement if a missed message matters.

### One to many

A controller commands several receivers. There are two ways to do it, and the choice matters:

- **One unicast per receiver.** Each frame is acknowledged and repeated if needed, so you know who got it. But a message to ten boards is ten frames on the air, and a board holds only 20 peers.
- **One broadcast.** One frame, heard by everyone, so ten boards cost the air time of one. There is no acknowledgement, so a lamp that was in the middle of something may miss it. Repeat the command two or three times, number it so repeats are recognised, and have the lamps report their state.

### Many to one

Fifty sensors report to one collector. Each sensor needs only the collector's address; the collector needs no peers at all, since it just receives. Put a **node id** in every message, because the sender's MAC address is long and the collector wants a short key for its table. Three things go wrong. Sensors that wake at the same moment (after a power cut, say) all transmit together and collide: add a random delay before each send. The collector's callback must be quick, or frames queue up behind it. And the collector is a **single point of failure**: nothing tells a sensor that nobody is listening, so have it answer with a short acknowledgement, and let the collector notice sensors that go silent.

The air is rarely the limit. At 2.6 ms for a 250-byte frame, a collector hears 380 of them in a second before the channel is full; fifty sensors sending once a minute use a thousandth of that.

### Many to many, and beyond one hop

If every board broadcasts and every board listens, you have a crowd: simple, but the channel fills as the crowd grows. And a frame goes only as far as the radio does. To reach a board beyond range, another board must **relay** it: receive and send again. That works, but it needs a rule to stop frames circling for ever — a hop count that falls at each relay, and a memory of message numbers already seen. Once you write that you are building a mesh; [[mesh-networks-on-esp]] shows what exists already.

> [!key] Pick the shape first: unicast gives acknowledgements, broadcast gives reach at the cost of certainty, and many-to-one needs node ids, random timing and a collector that notices silence. Past the radio range, someone has to relay, and that is a mesh.`,
  ideas: [
    'A unicast to ten boards costs ten frames; one broadcast reaches all ten in one frame but is not acknowledged.',
    'A collector needs no peers to receive; every message should carry a node id.',
    'Sensors that wake together collide: spread them with a random delay.',
    'Nothing relays an ESP-NOW frame beyond radio range unless you write the relay, with a hop count and a seen-list.'
  ],
  pitfalls: [
    'Broadcast is always better for many receivers — It reaches them all in one frame, but nothing says who heard it. Use it when a missed message does no harm or is repeated.',
    'The collector must add every sensor as a peer — It receives from anyone without peers. Peers matter only for sending, for example for acknowledgements back to the sensors.',
    'ESP-NOW boards pass messages along by themselves — A frame travels one hop. Relaying is something your program has to do.'
  ],
  terms: [
    { term: 'Topology', also: ['network shape'], def: 'The pattern of who talks to whom in a group of boards: pair, star, crowd or multi-hop.' },
    { term: 'Collector', also: ['sink', 'gateway', 'hub'], def: 'The board that receives the messages of many sensors, keeps a table of them and perhaps forwards them on.' },
    { term: 'Node id', also: ['sensor id', 'device id'], def: 'A short number or name that a board puts in every message so that the receiver can tell boards apart without using their long MAC addresses.' },
    { term: 'Relay', also: ['repeater', 'hop'], def: 'A board that receives a frame and sends it again so that it reaches a board beyond the first sender\'s range. Each such step is a hop.' }
  ],
  choose: {
    good: ['Unicast for one-to-one links and commands whose delivery matters', 'Broadcast with repeats for one command to many receivers', 'A collector with node ids for a field of sensors'],
    avoid: ['Giving every one of 30 lamps its own peer entry: only 20 fit', 'Letting sensors wake in lockstep with no random delay', 'Relaying without a hop count and a seen-list: frames circle'],
    check: ['That the collector\'s receive callback is short', 'That silence is detected: the collector should know when a sensor has not reported for a few intervals', 'The radio range of the farthest board, with the building in the way']
  },
  code: [
    {
      title: 'A collector for many sensors',
      about: 'Keeps the last reading of up to 16 sensors, told apart by the node id in the message, and prints a table every ten seconds, marking any sensor that has gone quiet. Each sensor sends five bytes — its node id and a float reading — to this board\'s address, with the sending part of the ESP-NOW page.',
      needs: 'One ESP32-family board as the collector and any number of sensor boards.',
      blocks: `
        when started
          start serial at (115200) baud
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio

        when data received from (sender) :: radio
          set [node v] to (item (1) of (received data))
          set item (node) of [last seen v] to (milliseconds since start)
          set item (node) of [reading v] to (item (2) of (received data))

        every (10) seconds
          for each [n v] in (node ids)
            print (join [node ] (n) [: ] (item (n) of [reading v]))
            if <((milliseconds since start) - (item (n) of [last seen v])) > (30000)> then
              print [  silent for more than 30 s]
            end
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        typedef struct __attribute__((packed)) {
          uint8_t id;              // node id, 0..15
          float value;             // the reading
        } Message;

        float reading[16];
        uint32_t lastSeen[16];     // millis() of the last message; 0 = never
        QueueHandle_t inbox;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(Message)) return;
          Message m;
          memcpy(&m, data, sizeof(m));
          xQueueSend(inbox, &m, 0);                // hand over quickly; never block here
        }

        void setup() {
          Serial.begin(115200);
          inbox = xQueueCreate(16, sizeof(Message));
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
        }

        void loop() {
          Message m;
          while (xQueueReceive(inbox, &m, 0) == pdTRUE) {
            if (m.id < 16) { reading[m.id] = m.value; lastSeen[m.id] = millis(); }
          }
          static uint32_t lastPrint = 0;
          if (millis() - lastPrint >= 10000) {
            lastPrint = millis();
            for (int n = 0; n < 16; n++) {
              if (lastSeen[n] == 0) continue;
              Serial.printf("node %d: %.2f", n, reading[n]);
              if (millis() - lastSeen[n] > 30000) Serial.print("   silent for more than 30 s");
              Serial.println();
            }
          }
        }
      `,
      py: String.raw`
        import network, espnow, struct, time

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)

        reading = {}                               # node id -> last value
        last_seen = {}                             # node id -> ticks_ms of the last message
        last_print = time.ticks_ms()

        while True:
            mac, msg = e.recv(200)                 # wait up to 200 ms
            if msg and len(msg) == 5:
                node, value = struct.unpack("<Bf", msg)
                reading[node] = value
                last_seen[node] = time.ticks_ms()
            if time.ticks_diff(time.ticks_ms(), last_print) >= 10000:
                last_print = time.ticks_ms()
                for node in sorted(reading):
                    line = "node %d: %.2f" % (node, reading[node])
                    if time.ticks_diff(time.ticks_ms(), last_seen[node]) > 30000:
                        line += "   silent for more than 30 s"
                    print(line)
      `,
      output: `
        node 3: 21.50
        node 7: 19.25
        node 9: 22.00   silent for more than 30 s
      `,
      notes: ['The C++ and MicroPython versions both expect five bytes: one byte of node id and a four-byte float, little-endian, with no padding (hence the packed structure).', 'The sensors should add a random delay of a second or two before sending, so that boards that woke together do not collide.']
    }
  ],
  examples: [
    {
      title: 'How many sensors can one collector hear?',
      q: 'Each sensor sends one 50-byte message every 30 s at 1 Mbit/s. If the air must not be busy more than 5 % of the time, how many sensors fit on one channel?',
      steps: ['A 50-byte payload takes about 0.97 ms on the air at 1 Mbit/s.', 'Each sensor uses $0.97 / 30\\,000 = 3.2 \\times 10^{-5}$ of the time.', 'For 5 %: $0.05 / (3.2 \\times 10^{-5}) \\approx 1500$ sensors.'],
      a: 'About 1500 on paper. In practice other limits arrive first: the collector\'s callback speed, collisions from synchronised wake-ups, the Wi-Fi traffic of neighbours on the same channel, and the 2.4 GHz range.'
    }
  ],
  quiz: [
    { q: 'A controller must send one command to 30 lamps and cannot add them all as peers. Which approach works?', choices: ['A broadcast frame that all lamps hear', 'Adding 30 peers anyway', 'Using the soft access point address', 'Sending to the router'], a: 0, why: 'Only 20 peers fit. A broadcast reaches every board in range through the one registered broadcast peer; the price is that nothing acknowledges it.' },
    { q: 'Fifty sensors wake at the same instant after a power cut and each sends a frame. What is the sensible precaution?', choices: ['Lower the payload to one byte', 'A random delay before each send', 'Use encryption', 'Use the broadcast address'], a: 1, why: 'Spreading the transmissions by a random delay keeps the frames from colliding. Payload size and encryption do not help, and broadcast would remove the acknowledgement that lets a sensor retry.' },
    { q: 'An ESP-NOW frame sent by board A is automatically forwarded by board B to board C, which is out of A\'s range.', a: false, why: 'ESP-NOW frames go one hop. A relay must be written: B receives the frame and sends it again, with a hop count so it cannot circle for ever.' },
    { q: 'Why should every message of a sensor field carry a node id?', choices: ['The radio demands it', 'The collector needs a short key to tell sensors apart', 'It makes the frame acknowledged', 'It selects the Wi-Fi channel'], a: 1, why: 'The collector receives from anyone and could use the sender\'s MAC address, but a short id in the message is simpler to store and survives the replacement of a board.' }
  ],
  applications: [
    'A greenhouse with a dozen temperature sensors reporting to one collector that feeds a dashboard ([[project-esp-now-sensors]]).',
    'A conductor\'s remote starting the same lighting scene on many lamps at once.',
    'A robot swarm sharing positions by broadcast, each robot listening to all the others.',
    'A long shed or fence line covered by a chain of relays that pass readings towards the house.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference, ESP-NOW: broadcast, peer limits and the receive callback.',
    'Arduino core for ESP32 documentation, *ESP-NOW* library: the broadcast examples with unknown peers.',
    'IEEE 802.11, the standard for wireless LAN: channel access (CSMA/CA) and frame types.'
  ],
  sim: ['en-broadcast', 'en-mesh']
},

/* ================================================================ esp-now-with-wifi */
{
  id: 'esp-now-with-wifi',
  parent: 'esp-now-and-peer-to-peer',
  title: 'ESP-NOW alongside Wi-Fi',
  level: 2,
  short: 'The radio can be on only one channel at a time. A board joined to a router sits on the router\'s channel, so an ESP-NOW link must use that channel too — and the router decides it, not you.',
  keywords: ['ESP-NOW and Wi-Fi', 'channel', 'WiFi.channel', 'setChannel', 'router channel', 'auto channel', 'coexistence', 'gateway', 'modem sleep', 'channel scan', 'same channel', 'soft AP'],
  prereq: ['esp-now', 'wifi-station', 'interference-and-channels'],
  related: ['esp-now-gateway', 'wifi-scanning', 'wifi-events-and-reconnection', 'wifi-power-save-and-dtim', 'esp-now-topologies'],
  body: `A project with sensors and a gateway works on the bench. The gateway is then connected to the home router so that it can publish to MQTT — and suddenly every message is lost. Nothing is broken. The gateway has changed channel.

### One radio, one channel

A 2.4 GHz Wi-Fi radio listens and talks on one channel at a time (channels 1 to 13 in most of the world, 1 to 11 in North America, 5 MHz apart and each 20 MHz wide). A **station** joined to a router must be on the router's channel, and follows it if the router moves. A **soft access point** sits on the channel it was started with. ESP-NOW has no channel of its own: its frames go out on whatever channel the radio is on at that moment, and a frame is heard only by a radio tuned to the same channel.

Without a connection the radio idles on channel 1, so two sensors and a gateway that never join anything find each other at once. The moment the gateway joins a router on channel 6, it stops hearing channel 1. The simulation below does exactly this.

### Four ways to live with it

1. **Fix the router's channel.** Set it by hand to 1, 6 or 11 (the three that do not overlap), then give the sensors that number. Simple and robust, but the router's "auto" setting may change it after a restart or an interference scare, and then the system silently stops.
2. **Let the sensors find the gateway.** If a send fails, the sensor tries channel 1, 2, 3 … with a hello message and listens for an answer, stores the channel that worked (in RTC memory or flash) and uses it next time. It costs a second or two now and then; it survives the router moving.
3. **Tell them.** The gateway's reply to every message can carry its current channel, so sensors follow it after one lost frame.
4. **Split the gateway in two.** One board receives ESP-NOW on any channel it likes and passes the data by a wire (UART, I2C) to a second board that does the Wi-Fi and MQTT. Two boards, no channel problem.

Soft-AP gateways have the same question in another form: the soft AP's channel is the channel of the link.

### Power saving and scanning

A station that has joined a router normally dozes between the router's beacons. A radio that is asleep misses ESP-NOW frames, so keep a **receiving gateway** awake: turn modem sleep off (see [[wifi-power-save-and-dtim]]). A **scan** ([[wifi-scanning]]) also moves the radio across all channels for a moment, and ESP-NOW frames in flight are lost. Do not scan while a link must hold.

Heavy Wi-Fi traffic on the same channel also competes for the air: ESP-NOW frames wait their turn like any others, so a gateway sitting beside a video stream will lose some. Channels 12 and 13 are not permitted everywhere; check your country's rules.

> [!key] ESP-NOW frames travel on whichever channel the radio is on, so every board that must talk has to be on the same one. A gateway joined to a router is pinned to the router's channel: fix it, or let the sensors find it, or split the gateway in two.`,
  ideas: [
    'A Wi-Fi radio is on one channel at a time; ESP-NOW has no channel of its own and uses that one.',
    'A station follows its router\'s channel; a board with no connection idles on channel 1.',
    'Fix the router\'s channel, or let sensors scan, or let the gateway announce its channel, or split the gateway in two.',
    'A receiving board must keep modem sleep off, and a scan or heavy traffic loses frames.'
  ],
  pitfalls: [
    'If it worked on the bench it will work installed — On the bench nothing was joined to a router, so all boards idled on channel 1. Joined to a router, the gateway moved to the router\'s channel and left the sensors behind.',
    'Setting the sensors\' channel once is enough — Routers on "auto channel" move when they restart or when the band gets busy. Plan for the channel to change.',
    'The channel field of the peer picks the channel for the link — It must agree with the channel the radio is already on (or be 0 for "current"); it does not retune the radio.'
  ],
  terms: [
    { term: 'Wi-Fi channel', also: ['channel number'], def: 'One of the numbered 20 MHz slices of the 2.4 GHz band, 5 MHz apart: channels 1, 6 and 11 do not overlap. A radio is tuned to one channel at a time.' },
    { term: 'Channel pinning', also: ['pinned to the AP channel'], def: 'The fact that a station joined to a router must use the router\'s channel, whatever other protocols such as ESP-NOW would prefer.' },
    { term: 'Modem sleep', also: ['Wi-Fi power save', 'WiFi.setSleep'], def: 'A mode in which a station switches its radio off between the router\'s beacons. A radio that is off cannot hear ESP-NOW frames.' },
    { term: 'Channel scan', also: ['channel hunting'], def: 'Trying each channel in turn, here to find the one on which a gateway answers, and remembering the one that worked.' }
  ],
  choose: {
    good: ['Fix the router channel to 1, 6 or 11 when you control the router', 'Channel hunting with a stored result when you do not', 'Two boards for a gateway that must not depend on any router setting'],
    avoid: ['"Auto" channel selection on the router that carries a gateway', 'Scanning for networks while an ESP-NOW link must hold', 'Leaving modem sleep on in a receiving gateway'],
    check: ['The channel the gateway really prints after it has joined', 'That sensors recover after the router restarts on another channel', 'That the channel is legal in your country']
  },
  code: [
    {
      title: 'A gateway that joins the router and tells its channel',
      about: 'Joins the Wi-Fi network, prints the channel it was pinned to, keeps the radio awake and prints every ESP-NOW frame that arrives. Give the sensors the channel it prints.',
      needs: 'An ESP32-family board and a 2.4 GHz Wi-Fi network. The credentials are placeholders: do not leave real ones in code you share ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          turn Wi-Fi power saving [off v] :: wifi
          print (join [pinned to channel ] (Wi-Fi channel))
          start ESP-NOW :: radio

        when data received from (sender) :: radio
          print (join [frame of ] (length of (received data)) [ bytes])
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          Serial.printf("frame of %d bytes\n", len);
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.setSleep(false);                      // a sleeping radio misses frames
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.printf("pinned to channel %d\n", WiFi.channel());
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
        }

        void loop() {}
      `,
      py: String.raw`
        import network, espnow, time

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.config(pm=sta.PM_NONE)                 # a sleeping radio misses frames
        sta.connect("your-ssid", "your-password")
        while not sta.isconnected():
            time.sleep_ms(250)
        print("pinned to channel", sta.config("channel"))

        e = espnow.ESPNow()
        e.active(True)
        while True:
            mac, msg = e.recv(1000)
            if msg:
                print("frame of", len(msg), "bytes")
      `,
      output: `
        pinned to channel 6
        frame of 3 bytes
      `,
      notes: ['The channel printed is the router\'s. If the router restarts on another channel, the number changes and the sensors must follow it.']
    },
    {
      title: 'A sensor that sticks to the gateway\'s channel',
      about: 'Starts Wi-Fi without joining anything, tunes the radio to the channel the gateway printed, and sends a number every five seconds, reporting whether the gateway\'s radio acknowledged it.',
      needs: 'An ESP32-family board. Replace the address with the gateway\'s station MAC and the channel with the one it printed.',
      blocks: `
        when started
          start serial at (115200) baud
          start Wi-Fi without connecting :: wifi
          set Wi-Fi channel to (6) :: wifi
          start ESP-NOW :: radio
          add peer [AA:BB:CC:DD:EE:FF] :: radio
          set [count v] to (0)

        every (5) seconds
          send (count) to peer [AA:BB:CC:DD:EE:FF] :: radio
          change [count v] by (1)

        when send result arrives :: radio
          print (join [channel 6: ] (send result))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        const uint8_t CHANNEL = 6;                       // the channel the gateway printed
        uint8_t gatewayMac[6] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};

        void onDataSent(const esp_now_send_info_t *info, esp_now_send_status_t status) {
          Serial.printf("channel %d: %s\n", CHANNEL, status == ESP_NOW_SEND_SUCCESS ? "delivered" : "not delivered");
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);                           // on, but joined to nothing
          WiFi.setChannel(CHANNEL);
          while (!WiFi.STA.started()) delay(100);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_send_cb(onDataSent);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, gatewayMac, 6);
          peer.channel = 0;                              // 0 = the channel the radio is on
          peer.encrypt = false;
          esp_now_add_peer(&peer);
        }

        void loop() {
          static uint32_t count = 0;
          esp_now_send(gatewayMac, (uint8_t *)&count, sizeof(count));
          count++;
          delay(5000);
        }
      `,
      py: String.raw`
        import network, espnow, struct, time

        CHANNEL = 6                                    # the channel the gateway printed
        GATEWAY = b"\xaa\xbb\xcc\xdd\xee\xff"

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)                               # on, but joined to nothing
        sta.config(channel=CHANNEL)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(GATEWAY)                            # channel 0 = the channel the radio is on

        count = 0
        while True:
            ok = e.send(GATEWAY, struct.pack("<I", count))
            print("channel", CHANNEL, ":", "delivered" if ok else "not delivered")
            count += 1
            time.sleep_ms(5000)
      `,
      output: `
        channel 6: delivered
        channel 6: delivered
      `,
      notes: ['If every message is "not delivered", check the channel first, then the address, then whether the gateway\'s radio is asleep.', 'Setting the channel with a connected station has no effect: a connected station follows its router.']
    }
  ],
  quiz: [
    { q: 'Sensors and a gateway talk perfectly until the gateway is made to join the home router. Then no frame arrives. What is the most likely cause?', choices: ['The router blocks ESP-NOW frames', 'The gateway moved to the router\'s channel and the sensors did not', 'The peer list is full', 'ESP-NOW cannot run while Wi-Fi is connected'], a: 1, why: 'A joined station must use the router\'s channel. The sensors are still on channel 1 (or whichever they were set to), and a frame is heard only on the channel it is sent on.' },
    { q: 'A board that has not joined any network and never changed channel is, by default, on channel 6.', a: false, why: 'The default idle channel is 1. That is why boards with no connection find each other at once.' },
    { q: 'Which three Wi-Fi channels do not overlap in the 2.4 GHz band?', choices: ['1, 2, 3', '1, 6, 11', '3, 7, 13', '2, 4, 6'], a: 1, why: 'Channels are 5 MHz apart and each is 20 MHz wide, so channels 1, 6 and 11 are the usual non-overlapping set.' },
    { q: 'Why keep modem sleep off on a gateway that receives ESP-NOW frames?', choices: ['It makes the frames longer', 'A radio that is switched off between beacons cannot hear them', 'It changes the channel', 'It is required for encryption'], a: 1, why: 'With power saving on, a station turns its radio off between the router\'s beacons. Frames that arrive then are lost. A receiving gateway is usually mains-powered anyway.' }
  ],
  applications: [
    'A garden or greenhouse sensor field reporting to a gateway that is also on the house Wi-Fi.',
    'A smart-home bridge that receives ESP-NOW buttons and publishes them to MQTT ([[esp-now-gateway]]).',
    'A portable display that follows the channel announced by the router-connected unit.',
    'A product that finds its base station again after the customer replaces the router.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference, ESP-NOW: the notes on the Wi-Fi channel and on power saving.',
    'Arduino core for ESP32 documentation, the *WiFi* API (setChannel, channel, setSleep).',
    'IEEE 802.11, the standard for wireless LAN: the 2.4 GHz channel plan and power save.'
  ],
  sim: 'en-channel'
},

/* ================================================================ esp-now-encryption */
{
  id: 'esp-now-encryption',
  parent: 'esp-now-and-peer-to-peer',
  title: 'Encrypted ESP-NOW',
  level: 3,
  short: 'Plain ESP-NOW frames can be read and forged by anyone in range. Giving each peer a 16-byte key encrypts the frames — but the keys live in your firmware, there are only six encrypted peers, and a broadcast cannot be encrypted.',
  keywords: ['ESP-NOW encryption', 'PMK', 'LMK', 'primary master key', 'local master key', 'CCMP', 'AES-128', 'encrypt', 'esp_now_set_pmk', 'lmk', 'replay', 'spoofing', 'key management'],
  prereq: ['esp-now', 'esp-now-peers-and-addresses'],
  related: ['credentials-handling', 'flash-encryption', 'wifi-security', 'esp-now-topologies', 'iot-threat-model'],
  body: `An unencrypted ESP-NOW frame is open to anyone with an ESP board or a Wi-Fi sniffer within range. They can read the payload — and, worse, send a frame of their own with your sensor's address and a payload of their choosing. For a temperature reading that is a nuisance. For "open the gate" it is the whole security problem.

### What the keys do

ESP-NOW can encrypt the frames of a peer with the AES-128 based **CCMP** method of Wi-Fi. It uses two kinds of 16-byte key:

- A **PMK** (primary master key), set once on the board with one call. It protects the exchange of the per-peer keys. Use the same PMK on all the boards that will talk to each other.
- An **LMK** (local master key) per peer, given when the peer is added. Frames to and from that peer are encrypted with it. **Both boards must register each other with the same LMK**, or neither can read the other's frames.

In practice: every board sets the PMK, adds the other board as a peer with \`encrypt\` on and the shared LMK, and sends and receives exactly as before. The program below does so, and adds a counter that the receiver checks.

### The limits

- **Six encrypted peers**, in a list of at most 20 peers in all. A collector for fifty sensors cannot give each one its own encrypted entry.
- **No broadcast.** A frame to the broadcast address cannot be encrypted; anything sent that way is public.
- **No key exchange.** The keys are chosen by you and sit in the firmware. Whoever can read one board's flash can read the key — unless flash encryption is on ([[flash-encryption]]) — and a key copied into a public repository is no key at all ([[credentials-handling]]). Give each pair its own keys if you can.
- **Metadata is open.** Addresses, timing and frame length remain visible, and nothing stops someone from jamming the channel.
- **Do not count on replay protection.** An attacker who records a valid frame may be able to send it again. Put a counter in the payload and refuse any message whose counter is not higher than the last one you accepted — keep the last counter in flash, or it resets when the board does.

### Choosing

Encryption makes sense for anything that acts: doors, valves, heaters, alarm states. For a room temperature that anyone could read anyway it costs you a peer slot and some key handling for little. If you need more than six secure peers, or a way to hand out keys, use a network with a proper join procedure instead, such as Wi-Fi with WPA2 or WPA3, or Matter.

> [!key] Switching on encryption means a 16-byte PMK on every board and a shared 16-byte LMK for each pair of peers, with at most six encrypted peers and no encrypted broadcast. The key lives in your firmware, so protect the flash, never publish it, and add a counter against replays.`,
  ideas: [
    'Unencrypted frames can be read and forged by anyone in range.',
    'A PMK is set once per board; an LMK is given per peer, and both boards must register each other with the same one.',
    'At most six peers can be encrypted, and broadcast frames cannot be encrypted at all.',
    'The keys are in the firmware: protect the flash, never publish them, and add a counter to the payload against replays.'
  ],
  pitfalls: [
    'Encryption hides who is talking and when — It hides the payload. Addresses, timing and length are still visible to anyone listening.',
    'An encrypted link cannot be replayed — Do not assume that. Number your messages and reject old numbers; otherwise a recorded "open" frame might open the gate again.',
    'One shared key in all my boards is fine — It is convenient, but whoever reads one board\'s flash can then speak to all of them. Prefer a key per pair, and protect the flash.'
  ],
  terms: [
    { term: 'PMK', also: ['primary master key', 'esp_now_set_pmk'], def: 'A 16-byte key set once on a board. In ESP-NOW it protects the exchange of the per-peer keys, so every board that talks to another should use the same one.' },
    { term: 'LMK', also: ['local master key'], def: 'A 16-byte key given with each encrypted peer. The frames between two boards are encrypted with it, so both must register the other with the same LMK.' },
    { term: 'CCMP', also: ['AES-CCM', 'AES-128'], def: 'The encryption and integrity method that Wi-Fi uses with WPA2 and that ESP-NOW applies to the frames of an encrypted peer.' },
    { term: 'Replay attack', also: ['replay'], def: 'Recording a valid frame and sending it again later. A message counter that the receiver checks, and never lets go back, defeats it.' },
    { term: 'Key provisioning', also: ['key management'], def: 'Getting the right secret into each device safely, without publishing it. ESP-NOW has no procedure for it, so the maker must provide one.' }
  ],
  choose: {
    good: ['Controls and alarms that act on what they receive', 'A few pairs of boards, each pair with its own keys', 'Products where the flash is encrypted and the key never leaves the factory'],
    avoid: ['Relying on encryption for broadcast messages: it does not apply', 'One key baked into hundreds of boards and a public repository', 'More than six secure peers on one board'],
    check: ['That both boards register each other with the same LMK', 'That the message counter survives a reboot', 'Where the keys are stored and who can read that flash']
  },
  code: [
    {
      title: 'An encrypted pair with a replay check',
      about: 'The same program runs on both boards, with the other board\'s address filled in. Each sets the PMK, adds the other as an encrypted peer with the shared LMK, sends a rising counter every two seconds and accepts only counters higher than the last.',
      needs: 'Two ESP32-family boards. The 16-character keys are placeholders: use your own, and keep them out of shared code.',
      blocks: `
        when started
          start serial at (115200) baud
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          set ESP-NOW primary key to [your-16-byte-pmk] :: security
          add encrypted peer [AA:BB:CC:DD:EE:FF] with key [your-16-byte-lmk] :: security
          set [counter v] to (1)
          set [last v] to (0)

        every (2) seconds
          send (counter) to peer [AA:BB:CC:DD:EE:FF] :: radio
          change [counter v] by (1)

        when data received from (sender) :: radio
          if <(received data) > (last)> then
            set [last v] to (received data)
            print (join [accepted ] (received data))
          else
            print [old counter: ignored]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        uint8_t peerMac[6] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};   // the other board's station MAC
        const char PMK_KEY[] = "your-16-byte-pmk";                   // exactly 16 characters
        const char LMK_KEY[] = "your-16-byte-lmk";                   // the same on both boards of the pair

        uint32_t counter = 1;
        uint32_t lastAccepted = 0;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(uint32_t)) return;
          uint32_t c;
          memcpy(&c, data, sizeof(c));
          if (c > lastAccepted) {                    // a replayed or old frame carries an old counter
            lastAccepted = c;
            Serial.printf("accepted %u\n", (unsigned)c);
          } else {
            Serial.println("old counter: ignored");
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_set_pmk((const uint8_t *)PMK_KEY);
          esp_now_register_recv_cb(onDataRecv);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, peerMac, 6);
          peer.channel = 0;
          peer.encrypt = true;                       // encrypt with this peer's key
          memcpy(peer.lmk, LMK_KEY, 16);
          esp_now_add_peer(&peer);
        }

        void loop() {
          esp_now_send(peerMac, (uint8_t *)&counter, sizeof(counter));
          counter++;
          delay(2000);
        }
      `,
      py: String.raw`
        import network, espnow, struct, time

        PEER = b"\xaa\xbb\xcc\xdd\xee\xff"           # the other board's station MAC
        PMK = b"your-16-byte-pmk"                    # exactly 16 bytes
        LMK = b"your-16-byte-lmk"                    # the same on both boards of the pair

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)
        e.set_pmk(PMK)
        e.add_peer(PEER, lmk=LMK, channel=0, ifidx=network.WLAN.IF_STA, encrypt=True)

        counter = 1
        last_accepted = 0
        last = time.ticks_add(time.ticks_ms(), -2000)
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 2000:
                last = time.ticks_ms()
                e.send(PEER, struct.pack("<I", counter))
                counter += 1
            mac, msg = e.recv(100)
            if msg and len(msg) == 4:
                (c,) = struct.unpack("<I", msg)
                if c > last_accepted:                # a replayed or old frame carries an old counter
                    last_accepted = c
                    print("accepted", c)
                else:
                    print("old counter: ignored")
      `,
      output: `
        accepted 1
        accepted 2
        accepted 3
      `,
      notes: ['If the two boards use different LMKs, nothing arrives and nothing is reported: check the keys first.', 'The counter restarts at 1 when a board reboots, so the other board would ignore it. In a real product keep the counter in flash ([[nvs-and-preferences]]) or start it from a random number.']
    }
  ],
  quiz: [
    { q: 'Why can a program not encrypt a broadcast ESP-NOW frame?', choices: ['Broadcast frames are too short', 'Encryption works per peer with that peer\'s key, and a broadcast has no single peer', 'Only unicast frames have a header', 'The PMK is not set for broadcast'], a: 1, why: 'The LMK belongs to one peer. A broadcast goes to everybody, so there is no key that all receivers could share through the peer mechanism, and the frame goes out in the clear.' },
    { q: 'Two boards each add the other as an encrypted peer, but with different LMKs. What happens?', choices: ['They fall back to unencrypted frames', 'The frames cannot be read: nothing arrives', 'Each board picks the stronger key', 'The send callback reports the key error'], a: 1, why: 'The LMK must be identical on both sides. With different keys the receiver cannot decrypt the frames and silently drops them.' },
    { q: 'An attacker records the encrypted "open" frame and sends it again an hour later. What protects the gate?', choices: ['Nothing, if the program does not check a counter', 'The PMK alone', 'The router', 'The channel number'], a: 0, why: 'Do not rely on the radio to refuse a replay. A counter in the message, checked and stored by the receiver, makes old frames useless.' },
    { q: 'A collector needs to receive from fifty sensors with encryption. Is that possible with encrypted peers?', choices: ['Yes, up to 20', 'No: only 6 encrypted peers fit', 'Yes, if the PMK is long enough', 'Yes, but only in version 2'], a: 1, why: 'Of the 20 peers a board can hold, at most 6 can be encrypted. For more, encrypt the payload yourself with a proper library, or use a network with a join procedure.' }
  ],
  applications: [
    'A gate, door or garage opener commanded by an ESP-NOW remote ([[project-garage-door]]).',
    'Alarm sensors reporting to a panel, where a forged "all clear" matters.',
    'A machine\'s remote emergency stop paired with a single receiver.',
    'Products where each pair of boards is paired at the factory with its own keys.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference, ESP-NOW: security, PMK and LMK, and the encrypted-peer limit.',
    'MicroPython documentation, the *espnow* module: set_pmk and add_peer with an lmk.',
    'IEEE 802.11i / IEEE 802.11, the standard for wireless LAN: the CCMP encryption method.'
  ]
},

/* ================================================================ esp-now-gateway */
{
  id: 'esp-now-gateway',
  parent: 'esp-now-and-peer-to-peer',
  title: 'A gateway from ESP-NOW to MQTT',
  level: 2,
  short: 'Sensors speak ESP-NOW, the internet speaks Wi-Fi and MQTT. A gateway board does both: it receives each frame, hands it to a queue, and publishes it — and has to decide what to do when the broker is away.',
  keywords: ['gateway', 'ESP-NOW to MQTT', 'bridge', 'queue', 'publish', 'PubSubClient', 'umqtt', 'store and forward', 'Home Assistant', 'last will', 'sensor field', 'collector'],
  prereq: ['esp-now-topologies', 'esp-now-with-wifi', 'mqtt'],
  related: ['mqtt-topics-qos-retain', 'store-and-forward', 'reliability-acks-and-retries', 'project-esp-now-sensors', 'home-assistant-integration', 'queues'],
  body: `Battery sensors want ESP-NOW: one short frame and back to sleep. Dashboards, phones and Home Assistant want MQTT over Wi-Fi. The **gateway** is the board that stands between them: it listens for ESP-NOW frames, turns each into an MQTT message and sends it to the broker.

### The shape of the program

1. **Join the router first.** The Wi-Fi connection pins the gateway's channel; print it and give it to the sensors ([[esp-now-with-wifi]]). Keep modem sleep off.
2. **Start ESP-NOW and register a receive callback.** The callback runs in the Wi-Fi task and must not block: it copies the frame into a **queue** and returns.
3. **In the main loop, drain the queue.** Each entry becomes an MQTT publish, to a topic built from the node id — \`home/sensors/3/temp\` — with the value as text.

The queue is the heart of it. MQTT calls can take milliseconds or, with a lost connection, seconds. The radio does not wait: frames from other sensors keep arriving, and the queue holds them until the loop catches up ([[queues]]).

### What the gateway adds

The sensors are simple and often have no clock, no Wi-Fi credentials and no idea what MQTT is. The gateway can add what they lack: a **timestamp**, the **signal strength** of the frame (the receive information carries it), a human name for the node id, and unit conversion. Publish the signal strength as a second topic and you can see a sensor's battery or position failing before it falls silent.

### When the broker is away

Sooner or later the router restarts or the broker is unreachable. The sensors know nothing about it: their frames are still acknowledged by the gateway's radio. So decide:

- **Drop.** Simplest; the queue fills, and new frames are discarded. Fine for a reading that is replaced a minute later.
- **Keep for later.** A bigger queue, or a file in flash, holds the readings until the broker returns ([[store-and-forward]]). Stamp each with its time, or the dashboard will show them all at the moment of reconnection.

Either way, announce the state. An MQTT **last will** message, "gateway offline", is published by the broker if the gateway vanishes; a "gateway online" message after each reconnection completes the picture. And remember that the gateway is a **single point of failure**: a watchdog and a power supply you trust matter more here than anywhere else in the system.

> [!key] A gateway joins the router, receives ESP-NOW frames in a callback that only fills a queue, and publishes from the main loop, adding time and signal strength on the way. Decide in advance what a full queue and a missing broker mean, and let the broker announce a dead gateway with a last will.`,
  ideas: [
    'Join Wi-Fi first: it pins the channel the sensors must use.',
    'The receive callback fills a queue; the main loop does the slow MQTT work.',
    'The gateway can add a timestamp, the signal strength and a name to what the sensors send.',
    'Plan for a missing broker (drop or keep) and announce the gateway\'s state with a last will.'
  ],
  pitfalls: [
    'I can publish to MQTT straight from the receive callback — The callback runs in the Wi-Fi task. A blocking MQTT call there stalls the radio and drops frames; hand the data to a queue.',
    'If the broker is down the sensors will know — Their frames are acknowledged by the gateway\'s radio whether or not the broker is reachable. The sensors cannot tell.',
    'A bigger queue means nothing is lost — The queue is RAM: it also loses everything at a reset. Readings that matter need flash and a timestamp.'
  ],
  terms: [
    { term: 'Gateway', also: ['bridge', 'protocol bridge'], def: 'A device that receives messages in one protocol and passes them on in another, here ESP-NOW in and MQTT out.' },
    { term: 'Queue', also: ['FIFO', 'message queue'], def: 'A first-in, first-out buffer that lets one part of a program (the radio callback) hand data to another (the main loop) without waiting.' },
    { term: 'Last will', also: ['LWT', 'last will and testament'], def: 'An MQTT message that a client registers with the broker when it connects. The broker publishes it if the client disappears without saying goodbye.' },
    { term: 'Single point of failure', also: ['SPOF'], def: 'A part whose failure stops the whole system. In a sensor field all traffic passes the gateway, so it is one.' }
  ],
  choose: {
    good: ['Many small battery sensors that must reach Home Assistant or a dashboard', 'Sensors that should not hold Wi-Fi credentials at all', 'A mains-powered gateway with a stable supply'],
    avoid: ['Publishing from inside the receive callback', 'A gateway without any supervision: no watchdog, no last will', 'Treating a full queue as impossible'],
    check: ['The channel the gateway printed, written down for the sensors', 'What happens to readings while the broker is down', 'That each message carries a node id and the gateway adds a timestamp']
  },
  code: [
    {
      title: 'ESP-NOW in, MQTT out',
      about: 'Receives five-byte messages (a node id and a float) from sensors, queues them, and publishes each to home/sensors/<id>/temp. If the broker is away, readings wait in the queue; when it is full, new ones are dropped.',
      needs: 'An ESP32-family board, a Wi-Fi network and an MQTT broker. For C++ install the PubSubClient library. The credentials and broker name are placeholders ([[credentials-handling]]).',
      libs: ['PubSubClient'],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          turn Wi-Fi power saving [off v] :: wifi
          print (join [tell the sensors: channel ] (Wi-Fi channel))
          connect to MQTT broker [broker.example.com] with last will [offline] on topic [home/gateway/status]
          publish [online] to topic [home/gateway/status]
          start ESP-NOW :: radio

        when data received from (sender) :: radio
          add (received data) to [inbox v]

        forever
          if <(length of [inbox v]) > (0)> then
            publish (item (2) of (item (1) of [inbox v])) to topic (join [home/sensors/] (item (1) of (item (1) of [inbox v])) [/temp])
            delete item (1) of [inbox v]
          end
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *BROKER = "broker.example.com";

        typedef struct __attribute__((packed)) {
          uint8_t id;
          float value;
        } Message;

        NetworkClient net;
        PubSubClient mqtt(net);
        QueueHandle_t inbox;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(Message)) return;
          Message m;
          memcpy(&m, data, sizeof(m));
          xQueueSend(inbox, &m, 0);                  // never block in the callback; a full queue drops the frame
        }

        void setup() {
          Serial.begin(115200);
          inbox = xQueueCreate(32, sizeof(Message));
          WiFi.mode(WIFI_STA);
          WiFi.setSleep(false);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.printf("tell the sensors: channel %d\n", WiFi.channel());
          mqtt.setServer(BROKER, 1883);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
        }

        void loop() {
          if (!mqtt.connected()) {
            static uint32_t lastTry = 0;
            if (millis() - lastTry > 5000) {
              lastTry = millis();
              // the broker publishes "offline" for us if we vanish; we publish "online" once connected
              if (mqtt.connect("espnow-gateway", nullptr, nullptr, "home/gateway/status", 0, true, "offline"))
                mqtt.publish("home/gateway/status", "online", true);
            }
            return;                                  // readings wait in the queue meanwhile
          }
          mqtt.loop();
          Message m;
          while (xQueueReceive(inbox, &m, 0) == pdTRUE) {
            char topic[40], payload[16];
            snprintf(topic, sizeof(topic), "home/sensors/%u/temp", (unsigned)m.id);
            snprintf(payload, sizeof(payload), "%.2f", m.value);
            mqtt.publish(topic, payload);
          }
        }
      `,
      py: String.raw`
        import network, espnow, struct, time
        from umqtt.simple import MQTTClient

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.config(pm=sta.PM_NONE)
        sta.connect("your-ssid", "your-password")
        while not sta.isconnected():
            time.sleep_ms(250)
        print("tell the sensors: channel", sta.config("channel"))

        e = espnow.ESPNow()
        e.active(True)

        client = MQTTClient("espnow-gateway", "broker.example.com")
        client.set_last_will(b"home/gateway/status", b"offline", retain=True)   # the broker publishes it if we vanish
        connected = False
        last_try = time.ticks_add(time.ticks_ms(), -5000)
        inbox = []                                    # readings waiting for the broker

        while True:
            mac, msg = e.recv(100)
            if msg and len(msg) == 5:
                if len(inbox) < 32:                   # a full queue drops the new reading
                    inbox.append(struct.unpack("<Bf", msg))
            if not connected:
                if time.ticks_diff(time.ticks_ms(), last_try) >= 5000:
                    last_try = time.ticks_ms()
                    try:
                        client.connect()
                        client.publish(b"home/gateway/status", b"online", retain=True)
                        connected = True
                    except OSError:
                        pass
                continue
            try:
                while inbox:
                    node, value = inbox[0]
                    client.publish("home/sensors/%d/temp" % node, "%.2f" % value)
                    inbox.pop(0)
            except OSError:
                connected = False                     # keep the reading and try again later
      `,
      output: `
        tell the sensors: channel 6
      `,
      notes: ['The C++ gateway calls mqtt.loop() on every pass: it keeps the connection alive and must not be starved by long delays.', 'A reading in the queue is lost at a reset. For readings that matter, write them to a file and publish with their original time ([[store-and-forward]]).']
    }
  ],
  quiz: [
    { q: 'Why does the gateway\'s receive callback only put the frame in a queue?', choices: ['MQTT cannot be called from a function', 'The callback runs in the Wi-Fi task, so a slow or blocking MQTT call there would stall the radio', 'Queues make frames encrypted', 'ESP-NOW forbids publishing'], a: 1, why: 'Anything slow in the callback holds up the Wi-Fi task, so frames are lost. The callback copies and returns; the main loop does the slow publish.' },
    { q: 'The broker is down for ten minutes. The sensors keep getting "delivered" from the ESP-NOW send callback. Why?', choices: ['The sensors can see the broker', 'The acknowledgement comes from the gateway\'s radio, not from the broker', 'The send callback is always true', 'The gateway is not a peer'], a: 1, why: 'The delivered status only says that the gateway\'s radio heard the frame. What the gateway then does with it, including failing to publish, is invisible to the sensor.' },
    { q: 'What does an MQTT last will do for a gateway?', choices: ['It resends old readings', 'The broker publishes it if the gateway disappears without saying goodbye', 'It encrypts the topics', 'It sets the Wi-Fi channel'], a: 1, why: 'The will is a message registered at connect time. If the gateway\'s connection breaks, the broker publishes it, so a dashboard can show "gateway offline".' },
    { q: 'The gateway joins the router on channel 11. What must be done for the sensors?', choices: ['Nothing: ESP-NOW follows the router', 'Put the sensors on channel 11', 'Switch the sensors to Wi-Fi', 'Disable encryption'], a: 1, why: 'ESP-NOW does not follow anything. The gateway is pinned to the router\'s channel, so the sensors must be tuned to it.' }
  ],
  applications: [
    'A garden sensor field whose readings appear in Home Assistant ([[home-assistant-integration]]).',
    'Battery buttons and door contacts that reach an MQTT-based automation system.',
    'A bridge that lets simple boards without Wi-Fi credentials report to a cloud dashboard.',
    'A lab where dozens of test fixtures report results through one gateway.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference, ESP-NOW, and the FreeRTOS queue API.',
    'OASIS, *MQTT Version 3.1.1*: topics, the last will and keep-alive.',
    'PubSubClient and MicroPython umqtt documentation: publish and connect.'
  ],
  sim: 'en-chain'
},

/* ================================================================ reliability-acks-and-retries */
{
  id: 'reliability-acks-and-retries',
  parent: 'esp-now-and-peer-to-peer',
  title: 'Reliability: acknowledgements and retries',
  level: 2,
  short: 'Radio loses frames. A link you can trust numbers its messages, has the receiver acknowledge each one by number, repeats with growing pauses when no acknowledgement comes, and throws away copies it has already seen.',
  keywords: ['acknowledgement', 'ACK', 'retry', 'back-off', 'exponential back-off', 'jitter', 'sequence number', 'duplicate', 'idempotent', 'timeout', 'at least once', 'at most once', 'exactly once', 'lost frame'],
  prereq: ['esp-now', 'esp-now-peers-and-addresses', 'non-blocking-timing'],
  related: ['esp-now-gateway', 'udp-between-boards', 'tcp-between-boards', 'mqtt-topics-qos-retain', 'battery-life-budget'],
  body: `Radio is not a wire. A frame can be lost to a collision, a microwave oven, a person in the way or a receiver that was busy, and no program can prevent it. What a program can do is to **notice** and **try again** — and to do so without causing new problems.

### Two layers of acknowledgement

ESP-NOW already acknowledges a unicast frame in the radio hardware, and repeats it a few times if no acknowledgement arrives. The send callback then reports the result. That covers a lost frame, but it says nothing about what happened *after* the receiving radio heard it. The receiving program may have been busy, its queue full, or its callback may have rejected the message. Broadcast frames get no acknowledgement at all.

For messages that matter, add an **application acknowledgement**: the receiver sends back a small message saying "I have message 17", and the sender waits for it.

### The recipe

1. **Number every message** with a sequence number.
2. **Send, then wait for the acknowledgement of that number**, for a timeout of a few times the usual round trip.
3. **If none arrives, send again** — but wait longer each time (**exponential back-off**: 20, 40, 80 ms …) and add a small random amount (**jitter**) so that many senders do not retry in step.
4. **Stop after a few tries.** An endless retry loop keeps a battery sensor awake until it is flat. Give up, and let the program decide what that means: keep the reading for later, or drop it.
5. **At the receiver, acknowledge every copy** — even one already seen, because the previous acknowledgement may be the thing that was lost — but **act only once**, by remembering the last sequence number.

That last point is easy to miss. If the acknowledgement is lost, the sender sends again and the receiver gets the same message twice. Without the sequence number, "toggle the lamp" is executed twice and the lamp ends up as it started.

### Make messages harmless to repeat

Even so, prefer messages that are **idempotent**: "set the lamp to on" rather than "toggle", "the temperature is 21.5" rather than "the temperature rose by 0.5". A repeated state is harmless, a repeated event is not. Sending full state regularly also repairs any loss for free: the next message corrects the last.

### What it costs

Every retry is another burst of transmitting, and on a sleeping sensor another stretch of awake time. With a 30 % chance of loss per try, three tries deliver 97 % of the messages, and the average message needs 1.4 transmissions. The formulas below give both numbers; real radios lose frames in bursts, so the true figures are a little worse.

> [!key] Number the messages, acknowledge by number, retry with growing and slightly random pauses, give up after a few tries, and let the receiver acknowledge every copy but act on each number only once. Prefer messages that do no harm when repeated.`,
  ideas: [
    'The radio\'s own acknowledgement says the frame was heard, not that the program handled it; add an acknowledgement of your own for what matters.',
    'Number messages; acknowledge by number; retry with back-off and jitter; stop after a few tries.',
    'The receiver acknowledges every copy but acts on each sequence number once.',
    'Prefer idempotent messages ("set to on") over events ("toggle"), and resend state regularly.'
  ],
  pitfalls: [
    'If the send callback says delivered, the receiver has acted on it — It says the radio of the receiver acknowledged the frame. The program there may not have handled it.',
    'Retrying immediately and often is the safest — It makes a busy channel busier and drains the battery. Back off, add jitter and stop after a few tries.',
    'A lost acknowledgement is harmless — It makes the sender repeat a message the receiver already has. Without sequence numbers the repeat is executed twice.'
  ],
  terms: [
    { term: 'Sequence number', also: ['message number', 'counter'], def: 'A number that rises with each message so that the receiver can recognise a copy and the sender can say which message was acknowledged.' },
    { term: 'Exponential back-off', also: ['back-off', 'retry delay'], def: 'Waiting longer after each failed attempt, typically doubling the pause, so that retries do not pile up on a congested channel.' },
    { term: 'Jitter', also: ['random delay'], def: 'A small random amount added to a delay so that many devices that failed together do not all retry at the same instant.' },
    { term: 'Idempotent', also: ['safe to repeat'], def: 'Said of a message or action whose repetition changes nothing: "set the lamp on" is idempotent, "toggle the lamp" is not.' },
    { term: 'At least once', also: ['at-most-once', 'exactly once'], def: 'Delivery guarantees. Retrying until acknowledged gives at least once; adding duplicate removal at the receiver gives the effect of exactly once.' }
  ],
  choose: {
    good: ['Application acknowledgements for commands and for readings that matter', 'Back-off with jitter and a retry limit for battery devices', 'State messages sent regularly, so a lost one is repaired by the next'],
    avoid: ['Toggle-type commands over a lossy link', 'Retrying forever or at a fixed fast rate', 'Relying on the send callback as proof of handling'],
    check: ['That the receiver recognises duplicates by sequence number', 'The battery cost of the worst-case retry sequence', 'What the sender does when all tries fail']
  },
  code: [
    {
      title: 'Send with acknowledgement and retry',
      about: 'Sends a numbered reading and waits for an acknowledgement carrying that number. After each failure it waits twice as long, plus a little random time, and gives up after five tries.',
      needs: 'Two ESP32-family boards; run the receiver program on the other one. Replace the address with the receiver\'s station MAC.',
      blocks: `
        define send reliably (value) (seq)
          set [wait v] to (20)
          repeat (5)
            send (join (seq) [,] (value)) to peer [AA:BB:CC:DD:EE:FF] :: radio
            wait up to (wait) milliseconds for an acknowledgement of (seq) :: radio
            if <acknowledgement of (seq) arrived?> then
              stop [this script v]
            end
            set [wait v] to (((wait) * (2)) + (random (0) to (9)))
          end
          print [gave up]

        when started
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          add peer [AA:BB:CC:DD:EE:FF] :: radio
          set [seq v] to (0)

        every (5) seconds
          change [seq v] by (1)
          send reliably (21.5) (seq) :: my
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        uint8_t receiverMac[6] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};

        const uint8_t DATA = 1, ACK = 2;
        typedef struct __attribute__((packed)) {
          uint8_t type;            // DATA or ACK
          uint16_t seq;            // the message number
          float value;
        } Packet;

        volatile uint16_t lastAcked = 0;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(Packet)) return;
          Packet p;
          memcpy(&p, data, sizeof(p));
          if (p.type == ACK) lastAcked = p.seq;
        }

        bool sendReliably(float value, uint16_t seq) {
          Packet p = {DATA, seq, value};
          uint32_t wait = 20;                          // first timeout, ms
          for (int attempt = 1; attempt <= 5; attempt++) {
            esp_now_send(receiverMac, (uint8_t *)&p, sizeof(p));
            uint32_t t0 = millis();
            while (millis() - t0 < wait) {
              if (lastAcked == seq) return true;
              delay(1);
            }
            wait = wait * 2 + random(0, 10);           // back off, with jitter
          }
          return false;                                // give up: the caller decides what that means
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, receiverMac, 6);
          peer.channel = 0;
          peer.encrypt = false;
          esp_now_add_peer(&peer);
        }

        void loop() {
          static uint16_t seq = 0;
          seq++;
          bool ok = sendReliably(21.5f, seq);
          Serial.printf("message %u: %s\n", (unsigned)seq, ok ? "acknowledged" : "gave up");
          delay(5000);
        }
      `,
      py: String.raw`
        import network, espnow, struct, time, random

        RECEIVER = b"\xaa\xbb\xcc\xdd\xee\xff"
        DATA, ACK = 1, 2

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(RECEIVER)

        def send_reliably(value, seq):
            packet = struct.pack("<BHf", DATA, seq, value)
            wait = 20                                   # first timeout, ms
            for attempt in range(5):
                e.send(RECEIVER, packet)
                deadline = time.ticks_add(time.ticks_ms(), wait)
                while time.ticks_diff(deadline, time.ticks_ms()) > 0:
                    mac, msg = e.recv(time.ticks_diff(deadline, time.ticks_ms()))
                    if msg and len(msg) == 7:
                        kind, ack_seq, _ = struct.unpack("<BHf", msg)
                        if kind == ACK and ack_seq == seq:
                            return True
                wait = wait * 2 + random.randint(0, 9)  # back off, with jitter
            return False                                # give up: the caller decides what that means

        seq = 0
        while True:
            seq += 1
            ok = send_reliably(21.5, seq)
            print("message", seq, ":", "acknowledged" if ok else "gave up")
            time.sleep_ms(5000)
      `,
      output: `
        message 1: acknowledged
        message 2: acknowledged
        message 3: gave up
      `,
      notes: ['The five tries take at most about 20 + 40 + 80 + 160 + 320 ms plus jitter: about 0.6 s of awake time at the very worst, which is what a battery budget must allow for.', 'esp_now_send only starts the transmission; the acknowledgement of this program comes later as a message in the receive callback.']
    },
    {
      title: 'Acknowledge every copy, act on each number once',
      about: 'The partner of the sender above: it acknowledges every data packet it receives, including repeats, and handles each sequence number only once.',
      needs: 'The second board. Replace the address with the sender\'s station MAC.',
      blocks: `
        when started
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          add peer [11:22:33:44:55:66] :: radio
          set [last v] to (0)

        when data received from (sender) :: radio
          send acknowledgement of (message number) to peer [11:22:33:44:55:66] :: radio
          if <(message number) ≠ (last)> then
            set [last v] to (message number)
            print (join [message ] (message number) [: ] (value))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        uint8_t senderMac[6] = {0x11, 0x22, 0x33, 0x44, 0x55, 0x66};

        const uint8_t DATA = 1, ACK = 2;
        typedef struct __attribute__((packed)) {
          uint8_t type;
          uint16_t seq;
          float value;
        } Packet;

        volatile bool ackPending = false;
        volatile uint16_t ackSeq = 0;
        volatile bool newMessage = false;
        uint16_t lastSeq = 0;
        float lastValue = 0;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          if (len != sizeof(Packet)) return;
          Packet p;
          memcpy(&p, data, sizeof(p));
          if (p.type != DATA) return;
          ackSeq = p.seq;
          ackPending = true;                           // acknowledge every copy, from loop()
          if (p.seq != lastSeq) {                      // act only on a number not seen before
            lastSeq = p.seq;
            lastValue = p.value;
            newMessage = true;
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, senderMac, 6);
          peer.channel = 0;
          peer.encrypt = false;
          esp_now_add_peer(&peer);
        }

        void loop() {
          if (ackPending) {
            ackPending = false;
            Packet ack = {ACK, ackSeq, 0};
            esp_now_send(senderMac, (uint8_t *)&ack, sizeof(ack));
          }
          if (newMessage) {
            newMessage = false;
            Serial.printf("message %u: %.2f\n", (unsigned)lastSeq, lastValue);
          }
        }
      `,
      py: String.raw`
        import network, espnow, struct

        SENDER = b"\x11\x22\x33\x44\x55\x66"
        DATA, ACK = 1, 2

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(SENDER)

        last_seq = None
        while True:
            mac, msg = e.recv(1000)
            if msg and len(msg) == 7:
                kind, seq, value = struct.unpack("<BHf", msg)
                if kind == DATA:
                    e.send(SENDER, struct.pack("<BHf", ACK, seq, 0.0))   # acknowledge every copy
                    if seq != last_seq:                                  # act only on a new number
                        last_seq = seq
                        print("message", seq, ":", value)
      `,
      output: `
        message 1: 21.50
        message 2: 21.50
      `,
      notes: ['Remembering only the last number copes with a sender that waits for each acknowledgement before sending the next. A sender with several messages in flight needs a small window of numbers.']
    }
  ],
  formulas: [
    {
      name: 'Chance that at least one try gets through',
      expr: 'Pok = 1 - pf^n',
      tex: 'P_{\\mathrm{ok}} = 1 - p_f^{\\,n}',
      vars: {
        Pok: { name: 'chance the message is delivered', tex: 'P_{\\mathrm{ok}}' },
        pf: { name: 'chance that one try fails', value: 0.3, min: 0, max: 0.99, tex: 'p_f' },
        n: { name: 'number of tries allowed', q: 'count', int: true, value: 3, min: 1, max: 20 }
      },
      solveFor: 'Pok',
      note: 'Assumes each try fails independently with the same chance. A real radio loses frames in bursts (a door closing, a microwave oven), so the true figure is lower.',
      stories: { Pok: 'Each transmission fails with a chance of {pf}. The sender tries up to {n} times. What share of the messages gets through?' }
    },
    {
      name: 'Average number of transmissions per message',
      expr: 'N = 1/(1 - pf)',
      tex: 'N = \\frac{1}{1 - p_f}',
      vars: {
        N: { name: 'transmissions per delivered message', q: 'count' },
        pf: { name: 'chance that one try fails', value: 0.3, min: 0, max: 0.95, tex: 'p_f' }
      },
      solveFor: 'N',
      note: 'For a sender that repeats until the message gets through, with no limit on tries. It is the average cost in transmissions, so also in battery.'
    }
  ],
  examples: [
    {
      title: 'How many tries for 99.9 %?',
      q: 'A link loses 30 % of the frames. The sender wants 99.9 % of its messages to arrive. How many tries must it allow?',
      steps: ['The chance that all $n$ tries fail is $0.3^{n}$, so we need $1 - 0.3^{n} \\ge 0.999$, that is $0.3^{n} \\le 0.001$.', 'Take logarithms: $n \\ge \\ln 0.001 / \\ln 0.3 = 6.91 / 1.20 \\approx 5.7$.', 'So six tries: $1 - 0.3^{6} = 0.99927$.'],
      a: 'Six tries. With back-off the six tries take about 1.3 s of awake time at worst, which is the number a battery budget has to carry.'
    }
  ],
  quiz: [
    { q: 'The receiver of a message acknowledges it, but the acknowledgement is lost. The sender sends the message again. What should the receiver do?', choices: ['Ignore the copy completely', 'Acknowledge it again but not act on it a second time', 'Act on it again, then acknowledge', 'Reboot'], a: 1, why: 'The acknowledgement is what the sender is waiting for, so it must be sent again, or the sender repeats for ever. The sequence number shows that the message was already handled, so the action is not repeated.' },
    { q: 'Which message is idempotent, and so safest over a lossy link?', choices: ['Toggle the lamp', 'Set the lamp to on', 'Increase the brightness by 10', 'Open the door for one second'], a: 1, why: 'Setting the state to a value gives the same result however often it is received. The others change the outcome each time they are executed.' },
    { q: 'Why add jitter to the back-off?', choices: ['To make the retries slower', 'So that many senders that failed together do not retry at the same moment', 'To save memory', 'To change the channel'], a: 1, why: 'Without it, devices that collided once would also collide on the retry, and on the next one, in step.' },
    { q: 'A link loses 50 % of its frames and the sender allows 3 tries. About what share of the messages arrive?', choices: ['50 %', '75 %', '87.5 %', '100 %'], a: 2, why: 'All three tries fail with chance $0.5^3 = 0.125$, so $1 - 0.125 = 0.875$ arrive: 87.5 %.' }
  ],
  applications: [
    'Commands to a gate or a valve, where a missed or doubled command matters.',
    'Sensor readings that must reach the gateway, with the sensor going back to sleep as soon as it has an acknowledgement.',
    'Any link over UDP, which has no acknowledgement of its own ([[udp-between-boards]]).',
    'Firmware or configuration sent in numbered chunks, each acknowledged.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi API reference, ESP-NOW: the send callback and its status.',
    'IEEE 802.11, the standard for wireless LAN: acknowledgement and retransmission at the MAC layer.',
    'RFC 793 and RFC 9293, *Transmission Control Protocol*: acknowledgement, retransmission timers and back-off, as the model for the recipe.'
  ],
  sim: { id: 'en-exchange', params: { mode: 'app' } }
},

/* ================================================================ mesh-networks-on-esp */
{
  id: 'mesh-networks-on-esp',
  parent: 'esp-now-and-peer-to-peer',
  title: 'Mesh: ESP-WIFI-MESH, Mesh-Lite, painlessMesh',
  level: 3,
  short: 'In a mesh the nodes carry each other\'s traffic, so a far-away sensor reaches the gateway through its neighbours, and a failed node is routed around. ESP boards have three ready-made meshes — and honest limits.',
  keywords: ['mesh', 'ESP-WIFI-MESH', 'ESP-Mesh-Lite', 'painlessMesh', 'self-healing', 'multi-hop', 'root node', 'relay', 'routing', 'tree topology', 'coverage', 'flooding', 'esp_mesh'],
  prereq: ['esp-now-topologies', 'esp-now-with-wifi', 'soft-ap-and-captive-portal'],
  related: ['esp-now-gateway', 'thread', 'zigbee', 'ble-mesh-and-le-audio', 'meshtastic', 'time-sync-between-boards'],
  body: `A sensor in the far corner of a farm is out of range of the router. A second board halfway can hear both; it can relay. That is the whole idea of a **mesh**: nodes that receive a message not meant for them and pass it on, so that range grows with the number of nodes. It is **self-forming**: the nodes find their own neighbours and routes. And it is **self-healing**: when a node dies, the nodes that used it look for another way.

### What a hop costs

Each hop is another transmission. With one radio and one channel a relay cannot receive and send at the same moment, so every extra hop cuts the usable throughput and adds delay. A node that relays must keep listening: it cannot live in deep sleep. The usual shape is mains-powered relays in the middle and battery sleepers at the edge, each sending to the nearest relay.

### Three meshes you can use

| | ESP-WIFI-MESH | ESP-Mesh-Lite | painlessMesh |
|---|---|---|---|
| Origin | Espressif, in ESP-IDF | Espressif, a separate component | A community library for Arduino |
| Shape | A tree: the **root** joins the router; each node is a station to its parent and an access point to its children; a new parent (or root) is found when one vanishes | A similar chain of station-and-access-point nodes with ordinary IP networking between them | Nodes join by network name, password and port; no router needed |
| Used from | ESP-IDF in C | ESP-IDF in C | Arduino C++ on ESP32 and ESP8266 |
| Good for | Large coverage with one internet gateway | Normal sockets, HTTP and MQTT across the nodes | Quick experiments with no infrastructure |

A fourth kind you can build from [[esp-now]]: every node rebroadcasts what it hears, with a falling hop count and a list of message numbers already seen. Other radios have meshes too: Thread ([[thread]]), Zigbee ([[zigbee]]), Bluetooth LE ([[ble-mesh-and-le-audio]]) and LoRa ([[meshtastic]]).

### Limits to respect

- **Everything shares one channel**, so traffic from many nodes competes for the same air. Meshes suit small messages, not video.
- **Libraries move on.** Check painlessMesh and Mesh-Lite against your Arduino core or ESP-IDF version before choosing.
- **Programs must not block.** painlessMesh runs from a scheduler called in the main loop; a long \`delay()\` stalls the node and can drop it from the mesh.
- **Security is a shared password** unless you add your own, and **debugging is hard**: a fault can be three hops away, so log with the node's id.
- **A mesh is not always the cheapest answer.** A second access point with a cable, or a better antenna, often solves a coverage problem more reliably.

In the simulation below you can move nodes and fail them, and watch the routes redraw.

> [!key] A mesh trades throughput, latency and sleep for coverage and resilience: relays must stay awake, every hop shares the channel, and the program must never block. Use ESP-WIFI-MESH or Mesh-Lite from ESP-IDF, painlessMesh from Arduino, or your own relays on ESP-NOW — and ask first whether a second access point would do.`,
  ideas: [
    'A mesh relays: every node can pass on a message, so range grows with the number of nodes, and a failed node is routed around.',
    'Each hop costs air time and delay, and relays cannot sleep: battery nodes belong at the edge.',
    'ESP-WIFI-MESH and ESP-Mesh-Lite are Espressif\'s own; painlessMesh is a community library for Arduino.',
    'Programs on a mesh must not block, and the library\'s support for your chip and core must be checked.'
  ],
  pitfalls: [
    'A mesh makes every node battery-friendly — The opposite: a node that relays must listen all the time. Only leaf nodes at the edge can sleep for long.',
    'A mesh gives the throughput of the radio at every node — Relays share one channel, so each extra hop reduces the rate and adds delay.',
    'I can use delay() freely in a painlessMesh sketch — A blocked loop stops the mesh from running its scheduler, and the node may drop out. Use the scheduler or timers.'
  ],
  terms: [
    { term: 'Mesh network', also: ['mesh'], def: 'A network in which nodes relay each other\'s messages, so that a node out of range of the destination can still reach it through neighbours.' },
    { term: 'Self-healing', also: ['re-routing'], def: 'The ability of a mesh to find a new route by itself when a node or link fails.' },
    { term: 'Root node', also: ['root'], def: 'In ESP-WIFI-MESH, the node at the top of the tree that is joined to the router and so connects the mesh to the rest of the network.' },
    { term: 'Hop', also: ['hop count'], def: 'One transmission from one node to the next. The number of hops a message needs is its hop count; it rises with distance and cuts throughput.' },
    { term: 'Flooding', also: ['rebroadcast'], def: 'A routing method in which every node resends each message it has not seen before. Simple and robust, but wasteful of air time.' }
  ],
  choose: {
    good: ['Coverage beyond one access point where cabling is impossible', 'Many mains-powered nodes with a few battery sleepers at the edge', 'Projects that can accept small, slow, best-effort messages'],
    avoid: ['Battery nodes that must relay: they cannot sleep', 'Video, audio or bulk transfers over several hops', 'A mesh where one extra access point with a cable would do'],
    check: ['That the library supports your chip and your core or ESP-IDF version', 'How many hops the deepest node needs and what that does to latency', 'That no code blocks the main loop']
  },
  code: [
    {
      title: 'Every node says hello to all the others',
      about: 'A painlessMesh node that joins the mesh named in the constants, broadcasts a greeting at random intervals of one to five seconds and prints every message it receives. Flash the same sketch on several boards: they find each other without a router.',
      needs: 'Two or more ESP32 or ESP8266 boards and the painlessMesh library with its dependencies (TaskScheduler and ArduinoJson). Check that the library version supports your Arduino core.',
      libs: ['painlessMesh', 'TaskScheduler', 'ArduinoJson'],
      blocks: `
        when started
          start serial at (115200) baud
          start mesh network [meshname] password [meshpassword] port (5555) :: radio

        every (1) seconds
          send (join [Hello from node ] (node id)) to all nodes :: radio
          wait (random (0) to (4)) seconds

        when data received from (sender) :: radio
          print (join [from ] (sender) [: ] (received data))
      `,
      cpp: String.raw`
        #include "painlessMesh.h"

        #define MESH_PREFIX   "meshname"        // the network name: the same on every node
        #define MESH_PASSWORD "meshpassword"
        #define MESH_PORT     5555

        Scheduler userScheduler;                // runs the sending task without blocking loop()
        painlessMesh mesh;

        void sendMessage();
        Task taskSendMessage(TASK_SECOND * 1, TASK_FOREVER, &sendMessage);

        void sendMessage() {
          String msg = "Hello from node ";
          msg += mesh.getNodeId();              // a 32-bit id every node has
          mesh.sendBroadcast(msg);
          taskSendMessage.setInterval(random(TASK_SECOND * 1, TASK_SECOND * 5));
        }

        void receivedCallback(uint32_t from, String &msg) {
          Serial.printf("from %u: %s\n", from, msg.c_str());
        }

        void setup() {
          Serial.begin(115200);
          mesh.setDebugMsgTypes(ERROR | STARTUP);
          mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
          mesh.onReceive(&receivedCallback);
          userScheduler.addTask(taskSendMessage);
          taskSendMessage.enable();
        }

        void loop() {
          mesh.update();                        // never block here: no long delay()
        }
      `,
      na: { py: 'painlessMesh is a C++ library, and the official MicroPython builds contain no mesh of this kind. In MicroPython, build a mesh yourself on ESP-NOW with a hop count and a list of message numbers already seen.' },
      output: `
        from 2543812345: Hello from node 2543812345
        from 3319204561: Hello from node 3319204561
      `,
      notes: ['The node id is derived from the chip, so no node needs configuring: that is the point of the library.', 'Messages are strings (often JSON). Keep them short; every byte is repeated at each hop.']
    }
  ],
  quiz: [
    { q: 'Why can a relay node in a mesh not spend most of its time in deep sleep?', choices: ['Deep sleep erases the routing table', 'It must keep listening to receive and forward the traffic of others', 'Relays use a different radio', 'Sleep disables the soft access point only'], a: 1, why: 'A relay serves other nodes, which can send at any time. A radio that sleeps cannot receive. Battery nodes are best placed at the edge as leaves.' },
    { q: 'A message crosses three hops on a single channel. Compared with one hop, what happens to the usable rate?', choices: ['It is unchanged', 'It falls, roughly by the number of hops sharing the channel', 'It triples', 'It depends only on the payload'], a: 1, why: 'Each relay must send what it received, on the same channel and the same air, so successive hops compete. Throughput falls roughly in proportion and delay adds up.' },
    { q: 'ESP-WIFI-MESH lets the nodes form a tree with a root node joined to the router.', a: true, why: 'The root connects to the router; every other node connects as a station to its parent, and acts as an access point for its own children.' },
    { q: 'What is wrong with putting delay(5000) in the loop of a painlessMesh sketch?', choices: ['Nothing; the library uses interrupts', 'The scheduler cannot run, so the node may drop out of the mesh', 'It changes the node id', 'It disables encryption'], a: 1, why: 'painlessMesh does its work when loop() calls mesh.update(). A long delay stops all of it: messages are late and connections time out.' }
  ],
  applications: [
    'Greenhouses, orchards and barns where no single access point covers the whole site.',
    'Decorative lighting with many nodes that pass colour changes along.',
    'Temporary installations at events where no infrastructure is available.',
    'Research and teaching: seeing routing, healing and flooding on real boards.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ESP-WIFI-MESH: the network architecture and the mesh API.',
    'Espressif, the ESP-Mesh-Lite project documentation.',
    'The painlessMesh library documentation and its basic example.'
  ],
  sim: 'en-mesh'
},

/* ================================================================ udp-between-boards */
{
  id: 'udp-between-boards',
  parent: 'esp-now-and-peer-to-peer',
  title: 'UDP between boards',
  level: 2,
  short: 'UDP sends a datagram to an IP address and port and forgets it: no connection, no acknowledgement, no order. It is the quickest way to move fresh data between boards on one network, and the one that needs reliability added by hand.',
  keywords: ['UDP', 'datagram', 'port', 'WiFiUDP', 'NetworkUDP', 'sendto', 'recvfrom', 'broadcast', 'multicast', 'OSC', 'Art-Net', 'sACN', 'beginPacket', 'parsePacket', 'socket', 'IP address'],
  prereq: ['esp-now', 'wifi-station', 'ip-addresses-dhcp-dns'],
  related: ['tcp-between-boards', 'reliability-acks-and-retries', 'mdns', 'sockets', 'time-sync-between-boards', 'ntp-and-time'],
  body: `ESP-NOW needs no network. UDP needs one — a router, or one board acting as an access point — and in exchange it works with everything on that network: a laptop, a phone app, Node-RED, a lighting console and other boards, over any number of routers and cables.

### What a datagram is

UDP, the User Datagram Protocol, carries a **datagram**: a block of bytes sent to an IP address and a **port** number. The port says which program on that machine should get it, as a door number on a building. The datagram is sent once. Nothing sets up a connection first, nothing says whether it arrived, nothing keeps datagrams in order, and nothing repeats a lost one. What UDP does keep is the **boundary**: one send is one receive, whole, or nothing.

### Size

A datagram can be up to about 64 KB, but anything over **1472 bytes** will not fit in one Ethernet frame (1500 bytes less 20 for the IP header and 8 for the UDP header) and gets split into fragments, any one of which may be lost. Keep datagrams small; a sensor reading is a dozen bytes.

### Finding the other board

Unicast needs the other board's IP address. Reserve one in the router, print it at start-up, or look it up by name with mDNS ([[mdns]]). To reach every board on the network at once, send to the **broadcast address**, 255.255.255.255 or the network's own (such as 192.168.1.255); or use **multicast** to a group address. Two traps: many routers send broadcast and multicast on Wi-Fi at the lowest, slowest rate, and **client isolation** (also called AP isolation, often on in guest networks) stops Wi-Fi devices from reaching each other at all.

### When UDP is the right tool

UDP suits data where **the newest value replaces the old**: a joystick position sent fifty times a second, a stream of sensor samples, a lighting level. If one datagram is lost, the next one repairs it, and waiting for a retransmission would only deliver stale data. Well-known protocols are built this way: OSC for music, Art-Net and sACN for stage lighting (ports 6454 and 5568), and NTP for time ([[time-sync-between-boards]]).

It is the wrong tool for messages that **must arrive** — a command to open a valve — unless you add the recipe of [[reliability-acks-and-retries]]: sequence numbers, acknowledgements and retries. If you find yourself adding all of that, consider TCP.

### Security

A UDP port accepts datagrams from anyone on the network. There is no sender check and no encryption. Do not drive anything dangerous from a bare UDP command; put a secret or a signature in the message, or use a protocol that provides it.

> [!key] UDP sends small datagrams to an IP address and port with no connection, acknowledgement or ordering. It is ideal for fresh, replaceable data between boards on one network; add sequence numbers and acknowledgements, or use TCP, when a message must arrive.`,
  ideas: [
    'UDP sends one datagram to an IP address and a port; nothing is acknowledged, repeated or ordered, but one send arrives as one whole datagram.',
    'Keep datagrams under about 1472 bytes to avoid fragmentation.',
    'Broadcast and multicast reach many boards at once, but routers may slow them or isolate the clients.',
    'Use UDP for data that is replaced by the next sample; add your own acknowledgements for what must arrive.'
  ],
  pitfalls: [
    'UDP is just a faster TCP — It is a different promise: no delivery, no order, no repeat. Speed comes from not doing those things.',
    'A broadcast always reaches every board on Wi-Fi — Routers may slow or filter it, and client isolation blocks board-to-board traffic altogether. Test it on the network you will use.',
    'On Wi-Fi nothing is ever lost, since the radio retries — The radio repeats frames, which hides most loss, but a busy channel or a distant board still loses datagrams, silently.'
  ],
  terms: [
    { term: 'UDP', also: ['User Datagram Protocol'], def: 'A simple internet protocol that sends independent datagrams to an IP address and port, with no connection, acknowledgement or ordering.' },
    { term: 'Datagram', also: ['packet'], def: 'A self-contained block of data sent by UDP. It arrives whole or not at all, and not necessarily in the order sent.' },
    { term: 'Port', also: ['port number'], def: 'A number from 0 to 65535 that tells the receiving machine which program a datagram or connection is for.' },
    { term: 'Broadcast address', also: ['255.255.255.255', 'subnet broadcast'], def: 'An IP address that means every device on the local network, such as 255.255.255.255 or 192.168.1.255 on a /24 network.' },
    { term: 'Client isolation', also: ['AP isolation', 'guest network'], def: 'A router setting that stops Wi-Fi devices from talking to each other, so UDP and TCP between two boards on that network fail.' }
  ],
  choose: {
    good: ['Streams of readings or positions where the next value replaces the last', 'Talking to PCs, phones and lighting or music software that already speak UDP', 'Discovery by broadcast on a network you control'],
    avoid: ['Commands that must arrive, with no acknowledgement added', 'Datagrams bigger than about 1400 bytes', 'Guest networks and routers with client isolation'],
    check: ['That the boards can reach each other: try a ping from a laptop first', 'Which IP addresses the boards get, and whether the router keeps them', 'That a lost datagram does no harm']
  },
  code: [
    {
      title: 'Two boards greet each other over UDP',
      about: 'Each board listens on port 4210 and sends a short greeting to the other board\'s IP address every two seconds. The same program runs on both, with PEER_IP set to the other board\'s address.',
      needs: 'Two ESP32-family boards on the same Wi-Fi network. The credentials are placeholders ([[credentials-handling]]); the address of each board is printed at start-up.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          print (IP address)
          start UDP on port (4210) :: net

        every (2) seconds
          send UDP (join [hello from ] (IP address)) to [192.168.1.51] port (4210) :: net

        when UDP packet arrives :: net
          print (join [from ] (sender address) [: ] (packet text))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WiFiUdp.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const uint16_t PORT = 4210;
        const IPAddress PEER_IP(192, 168, 1, 51);     // the other board's address

        WiFiUDP udp;

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());
          udp.begin(PORT);                            // listen on this port
        }

        void loop() {
          if (udp.parsePacket() > 0) {                // a datagram has arrived
            char buf[64];
            int n = udp.read(buf, sizeof(buf) - 1);
            buf[n > 0 ? n : 0] = 0;
            Serial.printf("from %s: %s\n", udp.remoteIP().toString().c_str(), buf);
          }
          static uint32_t last = 0;
          if (millis() - last >= 2000) {
            last = millis();
            udp.beginPacket(PEER_IP, PORT);
            udp.print("hello from " + WiFi.localIP().toString());
            udp.endPacket();                          // sent once; nothing says whether it arrived
          }
        }
      `,
      py: String.raw`
        import network, socket, time

        PEER_IP = "192.168.1.51"                      # the other board's address
        PORT = 4210

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect("your-ssid", "your-password")
        while not sta.isconnected():
            time.sleep_ms(250)
        my_ip = sta.ipconfig("addr4")[0]
        print(my_ip)

        udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        udp.bind(("0.0.0.0", PORT))                   # listen on this port
        udp.setblocking(False)

        last = time.ticks_add(time.ticks_ms(), -2000)
        while True:
            try:
                data, addr = udp.recvfrom(64)         # a datagram has arrived
                print("from", addr[0] + ":", data.decode())
            except OSError:
                pass                                  # nothing waiting
            if time.ticks_diff(time.ticks_ms(), last) >= 2000:
                last = time.ticks_ms()
                udp.sendto(("hello from " + my_ip).encode(), (PEER_IP, PORT))   # sent once, nothing says it arrived
            time.sleep_ms(10)
      `,
      output: `
        192.168.1.50
        from 192.168.1.51: hello from 192.168.1.51
      `,
      notes: ['Nothing is printed on the sender if the datagram is lost, or if the other board is not there: that is what UDP means.', 'To reach every board on the network, send to 255.255.255.255 instead of one address, and test it on your own router first.']
    }
  ],
  quiz: [
    { q: 'A sketch sends 1800 bytes in one UDP datagram over Wi-Fi. What is the likely consequence?', choices: ['It is refused by the board', 'It is split into IP fragments, and losing any one loses the whole datagram', 'It is compressed automatically', 'It is sent twice'], a: 1, why: 'More than 1472 bytes does not fit in one Ethernet frame, so IP fragments it. The datagram arrives only if all fragments do; the chance of loss rises with each.' },
    { q: 'A joystick position is sent fifty times a second. Is UDP a good choice?', choices: ['Yes: a lost update is replaced by the next', 'No: every update must be acknowledged', 'No: UDP cannot send small datagrams', 'Only with encryption'], a: 0, why: 'Each value makes the previous one obsolete. Waiting for a retransmission of a lost position would only deliver stale data.' },
    { q: 'Two boards on a guest Wi-Fi network cannot reach each other by UDP or TCP, although both can reach the internet. What is the likely cause?', choices: ['The port number is too high', 'Client isolation on the router', 'UDP is blocked by the ESP32', 'Wrong channel'], a: 1, why: 'Guest networks usually switch on client isolation, which stops Wi-Fi devices from talking to each other while still letting them use the internet.' },
    { q: 'A UDP command to open a valve is lost. How does the sender find out?', choices: ['The send function returns an error', 'It does not, unless the program adds acknowledgements', 'The router tells it', 'The valve resends it'], a: 1, why: 'UDP gives no feedback about delivery. Add sequence numbers and acknowledgements, as in the reliability page, or use TCP.' }
  ],
  applications: [
    'Streaming a joystick or sensor values from one board to a display or a laptop.',
    'Stage and architectural lighting over Art-Net and sACN.',
    'Open Sound Control messages between a board and music software.',
    'Discovery: a board shouting "who is there?" on the local network.'
  ],
  sources: [
    'RFC 768, *User Datagram Protocol*.',
    'Arduino core for ESP32 documentation, the *WiFiUDP* examples (core 3.3).',
    'MicroPython documentation, the *socket* module (version 1.29).'
  ],
  sim: { id: 'en-exchange', params: { mode: 'udp' } }
},

/* ================================================================ tcp-between-boards */
{
  id: 'tcp-between-boards',
  parent: 'esp-now-and-peer-to-peer',
  title: 'TCP and WebSockets between boards',
  level: 2,
  short: 'TCP gives two boards a reliable, ordered stream once a connection is made; a WebSocket puts message framing and browser support on top of it. They cost RAM and a connection to keep alive — and tell you when the other side is gone.',
  keywords: ['TCP', 'socket', 'server', 'client', 'WiFiServer', 'WiFiClient', 'accept', 'connect', 'stream', 'WebSocket', 'ws', 'AsyncWebSocket', 'keep-alive', 'line protocol', 'half-open', 'port'],
  prereq: ['udp-between-boards', 'sockets', 'web-server-on-esp'],
  related: ['websockets', 'reliability-acks-and-retries', 'mqtt', 'http-client', 'tcp-ip-on-a-microcontroller'],
  body: `UDP throws datagrams and hopes. **TCP** makes a promise: once two programs have a connection, every byte one writes comes out of the other in the order written, exactly once — or the connection breaks and both sides are told. That is what you want when the message *must* arrive: a command, a configuration, a file.

### A connection has two ends

One board is the **server**: it listens on a port and waits. The other is the **client**: it connects to the server's IP address and port. After a three-step handshake the two sides are equal; either can write at any time. Typically the board that is always on, with a fixed address, is the server; the sleepers are the clients that connect, say something, and leave.

### A stream has no message boundaries

This is the surprise. TCP carries a *stream of bytes*, not messages. Write ten bytes then twenty, and the other side may read thirty at once, or fifteen then fifteen. So messages need a framing rule that both sides know: **one line per message** (end with a newline, easy to read and to test with a terminal), or a **length byte** in front, or a fixed size. The programs below use lines.

### Dead peers and limits

If the other board loses power, the connection does not close: no one said goodbye, and your side may wait for hours. Give reads a **timeout**, send a small keep-alive message now and then, and treat silence as failure. Each open connection also costs RAM, and the lwIP stack on an ESP allows only about ten sockets by default; a board serving many clients at once must be built for it. The simple server in the first program handles one client at a time, which is plenty for two boards.

### WebSockets

A **WebSocket** starts as an ordinary web request, then upgrades the same TCP connection into a two-way channel of *messages*, with the framing done for you. Its great gift is that **a web page can use it**: a browser opens \`ws://192.168.1.50/ws\` with three lines of JavaScript and talks to the board live, with no polling. Several clients can connect to one board, and the board can push to all of them — a small hub. For board-to-board use it adds weight (a web server, the handshake) over plain TCP; for board-to-browser it is the standard way. See [[websockets]] for the protocol itself.

### Choosing

TCP for commands, files and configuration between boards; a WebSocket when a browser or phone must watch or control the board live; UDP for fresh streams; and MQTT ([[mqtt]]) when many devices exchange messages through a broker that keeps the connections.

> [!key] TCP gives a reliable, ordered byte stream between a server and a client, but no message boundaries: frame messages by lines or lengths, give reads timeouts and keep-alives, and mind the RAM per connection. A WebSocket adds framing and browser access on top of the same connection.`,
  ideas: [
    'TCP delivers a byte stream reliably and in order, or tells both sides that the connection broke.',
    'One board listens as the server; the other connects as the client; then either may write.',
    'A stream has no message boundaries: frame messages with newlines or length bytes.',
    'A peer that vanishes leaves a half-open connection: use timeouts and keep-alives.'
  ],
  pitfalls: [
    'One write on one side is one read on the other — TCP is a stream. The receiver can get the bytes in pieces or glued together, so it must find the message boundaries itself.',
    'If the other board loses power my code will notice at once — Nothing is sent on a power loss. Without a read timeout or keep-alive, the connection looks alive for a very long time.',
    'A WebSocket is a different network from TCP — It is TCP, after an HTTP upgrade, with message framing added. Its advantage is that browsers can open it.'
  ],
  terms: [
    { term: 'TCP', also: ['Transmission Control Protocol'], def: 'The internet protocol that carries a reliable, ordered stream of bytes between two programs after a connection has been set up.' },
    { term: 'Socket', also: ['server socket', 'client socket'], def: 'One end of a network connection as a program sees it: a server socket waits for connections, a client socket makes one.' },
    { term: 'WebSocket', also: ['ws', 'wss'], def: 'A protocol that upgrades an HTTP connection into a two-way channel of framed messages, so that a web page and a board can talk live.' },
    { term: 'Keep-alive', also: ['heartbeat', 'ping'], def: 'A small message sent now and then on an idle connection so that each side can tell that the other is still there.' },
    { term: 'Framing', also: ['message boundary', 'delimiter'], def: 'The rule that tells a receiver where one message ends in a byte stream: a newline, a length prefix or a fixed size.' }
  ],
  choose: {
    good: ['Commands, configuration and files that must arrive complete and in order', 'A WebSocket for live control and display from a browser', 'A server on the board that is always on and has a stable address'],
    avoid: ['TCP for a fast stream of replaceable readings: UDP does it with less delay', 'Many simultaneous connections on a small board', 'Assuming a silent connection is a healthy one'],
    check: ['The framing rule both sides use', 'Timeouts on every read and a keep-alive or a limit on silence', 'How many connections the board can really hold']
  },
  code: [
    {
      title: 'A TCP server that echoes lines',
      about: 'Board A listens on port 5000, reads one line at a time from a connected client, prints it and answers with the same line prefixed "echo:". It serves one client at a time.',
      needs: 'Two ESP32-family boards on the same Wi-Fi network; this is board A, whose address is printed at start-up. Credentials are placeholders ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          print (IP address)
          start TCP server on port (5000) :: net

        when TCP client connects :: net
          print [client connected]
          repeat until <client disconnected?>
            if <a line has arrived?> then
              print (join [got: ] (received line))
              send line (join [echo: ] (received line)) to client :: net
            end
          end
          print [client left]
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";

        WiFiServer server(5000);

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());
          server.begin();
        }

        void loop() {
          WiFiClient client = server.accept();          // core 3.x; available() is deprecated
          if (!client) return;
          Serial.println("client connected");
          while (client.connected()) {
            if (client.available()) {
              String line = client.readStringUntil('\n');   // one line = one message
              line.trim();
              Serial.println("got: " + line);
              client.println("echo: " + line);
            } else {
              delay(5);
            }
          }
          client.stop();
          Serial.println("client left");
        }
      `,
      py: String.raw`
        import network, socket, time

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect("your-ssid", "your-password")
        while not sta.isconnected():
            time.sleep_ms(250)
        print(sta.ipconfig("addr4")[0])

        server = socket.socket()
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(("0.0.0.0", 5000))
        server.listen(1)

        while True:
            client, addr = server.accept()
            print("client connected")
            try:
                while True:
                    line = client.readline()              # one line = one message; b"" when the client has gone
                    if not line:
                        break
                    text = line.decode().strip()
                    print("got:", text)
                    client.send(("echo: " + text + "\n").encode())
            except OSError:
                pass
            client.close()
            print("client left")
      `,
      output: `
        192.168.1.50
        client connected
        got: temperature 21.5
        client left
      `,
      notes: ['The server handles one client at a time: a second client waits until the first leaves.', 'Test it from a laptop with a terminal program or a TCP client before writing the second board\'s code.']
    },
    {
      title: 'A TCP client that asks the server',
      about: 'Board B connects to board A, sends one line every three seconds and prints the answer. If the connection fails or breaks, it closes it and connects again.',
      needs: 'Board B on the same network. Replace SERVER_IP with the address board A printed.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]

        forever
          if <not <TCP connected?>> then
            connect TCP to [192.168.1.50] port (5000) :: net
            if <not <TCP connected?>> then
              wait (2) seconds
            end
          else
            send line [temperature 21.5] to server :: net
            print (join [answer: ] (receive line within (2) seconds))
            wait (3) seconds
          end
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *SERVER_IP = "192.168.1.50";        // the address board A printed

        WiFiClient client;

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          if (!client.connected()) {
            Serial.println("connecting");
            if (!client.connect(SERVER_IP, 5000)) { delay(2000); return; }
          }
          client.println("temperature 21.5");           // one line = one message
          uint32_t t0 = millis();
          while (!client.available() && millis() - t0 < 2000) delay(5);   // never wait for ever
          if (client.available()) Serial.println("answer: " + client.readStringUntil('\n'));
          else Serial.println("no answer");
          delay(3000);
        }
      `,
      py: String.raw`
        import network, socket, time

        SERVER_IP = "192.168.1.50"                     # the address board A printed

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect("your-ssid", "your-password")
        while not sta.isconnected():
            time.sleep_ms(250)

        s = None
        while True:
            if s is None:
                print("connecting")
                try:
                    s = socket.socket()
                    s.settimeout(2)                    # never wait for ever
                    s.connect((SERVER_IP, 5000))
                except OSError:
                    s.close()
                    s = None
                    time.sleep_ms(2000)
                    continue
            try:
                s.send(b"temperature 21.5\n")          # one line = one message
                line = s.readline()
                if not line:
                    raise OSError("closed")
                print("answer:", line.decode().strip())
            except OSError:
                print("no answer")
                s.close()
                s = None
            time.sleep_ms(3000)
      `,
      output: `
        connecting
        answer: echo: temperature 21.5
        answer: echo: temperature 21.5
      `,
      notes: ['Both versions give every wait a limit (a 2 s read timeout): a client that waits for ever hangs the moment the server disappears.', 'If the server is on a battery board that sleeps, make it the client instead and let the always-on board listen.']
    },
    {
      title: 'A WebSocket hub for a browser and boards',
      about: 'The board serves a WebSocket at /ws and sends every message it receives to all connected clients. A web page, or another board with a WebSocket client library, can connect to ws://<board address>/ws.',
      needs: 'An ESP32-family board and the ESPAsyncWebServer and AsyncTCP libraries from the ESP32Async project. The board makes its own access point, so no router is needed; join it with a phone or laptop and open ws://192.168.4.1/ws.',
      libs: ['ESP Async WebServer (ESP32Async)', 'AsyncTCP (ESP32Async)'],
      blocks: `
        when started
          start serial at (115200) baud
          start access point [esp32-async] :: wifi
          start web server on port (80)
          start WebSocket on path [/ws] :: net

        when WebSocket client connects :: net
          print (join [client connected: ] (client id))

        when WebSocket message arrives :: net
          send (received message) to all WebSocket clients :: net
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <AsyncTCP.h>
        #include <ESPAsyncWebServer.h>

        AsyncWebServer server(80);
        AsyncWebSocket ws("/ws");

        void onWsEvent(AsyncWebSocket *s, AsyncWebSocketClient *c, AwsEventType type, void *arg, uint8_t *data, size_t len) {
          if (type == WS_EVT_CONNECT)   Serial.printf("client connected: %u\n", c->id());
          else if (type == WS_EVT_DATA) s->textAll((const char *)data, len);     // send to everyone
        }

        void setup() {
          Serial.begin(115200);
          WiFi.softAP("esp32-async");                     // its own network: join it and open ws://192.168.4.1/ws
          ws.onEvent(onWsEvent);
          server.addHandler(&ws);
          server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
            request->send(200, "text/plain", "WebSocket hub: connect to /ws");
          });
          server.begin();
        }

        void loop() {}
      `,
      na: { py: 'The MicroPython standard library has no WebSocket server. The microdot framework offers one, and two MicroPython boards can use the plain TCP programs above instead.' },
      notes: ['A browser can connect with three lines: const ws = new WebSocket("ws://192.168.4.1/ws"); ws.onmessage = e => console.log(e.data); ws.send("hello");', 'Do no slow work inside the event function: it runs in the network task. Copy the data out and handle it elsewhere.']
    }
  ],
  quiz: [
    { q: 'A board writes 10 bytes and then 20 bytes into a TCP connection. What may the receiver\'s first read return?', choices: ['Always exactly 10 bytes', 'Any number of the 30 bytes, from 1 to all', 'Always 30 bytes', 'Nothing until the connection closes'], a: 1, why: 'TCP is a stream. The segments may be merged or split on the way, so one read can return part of a message or several messages. Frame messages yourself, for example one per line.' },
    { q: 'The server board loses power in the middle of a connection. The client program has no read timeout. What happens?', choices: ['The client is told at once', 'The client may wait for a very long time, believing the connection is alive', 'The client reconnects by itself', 'The ESP32 reboots'], a: 1, why: 'A power loss sends nothing, so the client sees a quiet connection. Without a timeout or a keep-alive it can sit there for hours.' },
    { q: 'A WebSocket is a protocol that runs on a different transport from TCP.', a: false, why: 'A WebSocket begins as an HTTP request on a TCP connection and then upgrades it. The transport is TCP; what the WebSocket adds is message framing and a handshake that browsers understand.' },
    { q: 'Which is the best fit for "a phone web page must show a board\'s reading live"?', choices: ['A UDP datagram per reading', 'A WebSocket on the board', 'ESP-NOW', 'Bluetooth Classic'], a: 1, why: 'A browser can open a WebSocket directly, and the board can push each new reading. Browsers cannot send UDP or ESP-NOW, and a plain page cannot use Bluetooth Classic.' }
  ],
  applications: [
    'A control panel board sending configuration to a machine board and waiting for an "ok".',
    'A browser dashboard that shows a board\'s sensors and sends commands back through a WebSocket.',
    'Logging from a board to a PC server that must receive every line in order.',
    'A hub board that relays chat-like messages among several boards and browsers.'
  ],
  sources: [
    'RFC 9293, *Transmission Control Protocol (TCP)*.',
    'RFC 6455, *The WebSocket Protocol*.',
    'Arduino core for ESP32 documentation, the WiFiServer and WiFiClient examples; the ESP32Async ESPAsyncWebServer documentation.'
  ],
  sim: { id: 'en-exchange', params: { mode: 'tcp' } }
},

/* ================================================================ ble-between-boards */
{
  id: 'ble-between-boards',
  parent: 'esp-now-and-peer-to-peer',
  title: 'Bluetooth LE between boards',
  level: 2,
  short: 'Two ESP boards can talk over Bluetooth LE: one advertises and offers a characteristic, the other scans, connects and reads or subscribes. Slower than ESP-NOW, but frugal, acknowledged by the link and open to every phone.',
  keywords: ['BLE between boards', 'peripheral', 'central', 'GATT', 'characteristic', 'notify', 'advertising', 'scan', 'observer', 'broadcaster', 'MTU', 'NimBLE', 'RSSI', 'proximity', 'service UUID'],
  prereq: ['esp-now', 'ble-roles', 'gatt'],
  related: ['ble-advertising', 'ble-read-write-notify', 'ble-uart-service', 'ble-connection-parameters', 'ble-stacks-nimble-bluedroid', 'esp-now-topologies'],
  body: `Bluetooth LE looks like a phone thing, but the radio is in nearly every ESP, and two boards can use it just as a phone and a heart-rate strap do. The reasons to choose it over ESP-NOW are practical: no channel has to be agreed, a sensor can average very little current, the link layer acknowledges and repeats, and a phone can talk to the same board.

### Two roles

A **peripheral** advertises: it sends a small advertisement on three fixed channels (2402, 2426 and 2480 MHz), every 20 ms to 10 s as you choose, saying who it is. Its data sits in a **GATT** table of services and characteristics ([[gatt]]). A **central** scans for advertisements, picks the device it wants, **connects**, and then reads, writes or **subscribes** to notifications of a characteristic. The sensor is normally the peripheral, the collecting board the central.

### Without a connection

You do not always need to connect. A peripheral's advertisement can carry a name and a few bytes of data — a legacy advertisement holds 31 bytes, and a scan response another 31 — and **any number** of scanners can read it, with no connection, no pairing and nothing to keep alive. This is how beacons work ([[ble-beacons]]). The second program below listens in this way for the first board and reports its signal strength: a proximity detector in twenty lines. The newer chips (ESP32-S3, C3, C6 and later, which have Bluetooth LE 5) can also send longer extended advertisements; the original ESP32 has LE 4.2 and cannot.

### With a connection

A connection costs setup time and RAM, and buys reliability: the link layer acknowledges and repeats packets, a bonded link is encrypted ([[ble-security]]), and a notification arrives in order. The size of one notification is the negotiated **MTU** minus 3 bytes: with the default MTU of 23 that is 20 bytes, and a central can ask for more, up to 517. Throughput is modest — from a kilobyte or so a second up to tens of kilobytes, depending on settings ([[ble-connection-parameters]]) — enough for readings and commands, not for audio or files.

### BLE or ESP-NOW?

| | ESP-NOW | Bluetooth LE |
|---|---|---|
| Phone can take part | No | Yes |
| Setup | Peer list and channel | Roles, scan and connect, a GATT table |
| Reach many boards at once | Broadcast | Advertising, read by any scanner |
| Speed and payload | 250 bytes a frame, fast | 20 bytes at the default MTU, slower |
| Delivery | Radio acknowledgement | Link-layer acknowledgement, in order |
| With Wi-Fi on | Same radio and channel | Shares the radio, coexistence handled by the chip |
| Chips | Wi-Fi chips | All but the S2 (the P4 only through a companion chip) |

> [!key] For two boards over Bluetooth LE, make one the peripheral (advertise, offer a characteristic that notifies) and the other the central (scan, connect, subscribe) — or skip the connection and read advertisements. Choose it for low power and for phone access; choose ESP-NOW when only boards are involved.`,
  ideas: [
    'A peripheral advertises and holds data in a GATT table; a central scans, connects, reads, writes or subscribes.',
    'Advertisements can be read by any number of scanners without a connection: a broadcaster and an observer need no pairing.',
    'A notification carries at most MTU minus 3 bytes: 20 bytes at the default MTU, more if the central asks.',
    'Choose BLE over ESP-NOW when a phone should take part or power is tight; the S2 and (alone) the P4 have no BLE.'
  ],
  pitfalls: [
    'Bluetooth LE is for phones, not for two microcontrollers — Boards can be peripheral and central just as phones and sensors are. It is a good fit when low power matters.',
    'I must connect to read a value — Not if the value is in the advertisement: an observer reads it from the air with no connection at all.',
    'A notification can carry any amount of data — It carries at most the MTU minus 3 bytes: 20 bytes with the default MTU. Larger data needs a negotiated MTU or chunks.'
  ],
  terms: [
    { term: 'Peripheral', also: ['GATT server', 'advertiser'], def: 'The BLE role that advertises its presence and holds data in a GATT table for a central to read, write or subscribe to.' },
    { term: 'Central', also: ['GATT client', 'scanner'], def: 'The BLE role that scans for advertisements, starts a connection and then reads and writes the peripheral\'s characteristics.' },
    { term: 'Characteristic', also: ['GATT characteristic', 'UUID'], def: 'One data item in a peripheral\'s GATT table, identified by a UUID, with properties such as read, write and notify.' },
    { term: 'Notification', also: ['notify', 'subscribe'], def: 'A message the peripheral pushes to a subscribed central whenever a characteristic changes, without the central asking each time.' },
    { term: 'MTU', also: ['ATT MTU', 'maximum transmission unit'], def: 'The largest ATT packet a connection carries. A notification holds the MTU minus 3 bytes, so 20 bytes at the default of 23.' },
    { term: 'Observer', also: ['broadcaster', 'beacon'], def: 'A scanner that reads advertisements without connecting. The advertising side is a broadcaster. Together they send data one way with no connection.' }
  ],
  choose: {
    good: ['Low-power sensors that a phone and a gateway board may both read', 'Proximity or presence detection from the signal strength of advertisements', 'Small, reliable messages between a few boards'],
    avoid: ['Bulk data, audio or files: Wi-Fi or ESP-NOW fits better', 'Many simultaneous connections on one board: the stack allows only a few', 'Boards that also run heavy Wi-Fi traffic and need low delay on both'],
    check: ['That both chips have Bluetooth LE: the ESP32-S2 does not', 'The MTU and what one notification can hold', 'Which library and stack the core uses for your chip ([[ble-stacks-nimble-bluedroid]])']
  },
  code: [
    {
      title: 'A peripheral that notifies a counter',
      about: 'Advertises as "esp-ble-sensor", offers one characteristic that can be read and subscribed to, and writes a rising counter into it every second, notifying any connected central.',
      needs: 'An ESP32-family board with Bluetooth LE (not the ESP32-S2). Use a phone app such as a generic BLE scanner to see it, or the scanner program on a second board.',
      blocks: `
        when started
          start serial at (115200) baud
          start BLE as [esp-ble-sensor] :: ble
          add service [4fafc201-1fb5-459e-8fcc-c5c9c331914b] :: ble
          add characteristic [beb5483e-36e1-4688-b7f5-ea07361b26a8] [notify v] :: ble
          start advertising :: ble
          set [counter v] to (0)

        every (1) seconds
          change [counter v] by (1)
          notify (counter) :: ble
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEUtils.h>
        #include <BLEServer.h>
        #include <BLE2902.h>

        #define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
        #define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

        BLECharacteristic *counterChr;

        void setup() {
          Serial.begin(115200);
          if (!BLEDevice::init("esp-ble-sensor")) { Serial.println("BLE init failed"); return; }
          BLEServer *server = BLEDevice::createServer();
          server->advertiseOnDisconnect(true);          // advertise again when a central leaves
          BLEService *service = server->createService(SERVICE_UUID);
          counterChr = service->createCharacteristic(CHARACTERISTIC_UUID,
            BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
          counterChr->addDescriptor(new BLE2902());     // the switch with which a central turns notifications on
          counterChr->setValue("0");
          service->start();
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->addServiceUUID(SERVICE_UUID);
          adv->setScanResponse(true);
          BLEDevice::startAdvertising();
        }

        void loop() {
          static uint32_t counter = 0;
          counter++;
          String value = String(counter);
          counterChr->setValue(value);                  // what a read returns
          counterChr->notify();                         // push it to every subscribed central
          delay(1000);
        }
      `,
      py: String.raw`
        import bluetooth, time

        _IRQ_CENTRAL_CONNECT = 1
        _IRQ_CENTRAL_DISCONNECT = 2

        ble = bluetooth.BLE()
        ble.active(True)

        SERVICE_UUID = bluetooth.UUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
        COUNTER = (bluetooth.UUID("beb5483e-36e1-4688-b7f5-ea07361b26a8"), bluetooth.FLAG_READ | bluetooth.FLAG_NOTIFY)
        ((counter_h,),) = ble.gatts_register_services(((SERVICE_UUID, (COUNTER,)),))

        conns = set()

        def advertise():
            name = b"esp-ble-sensor"
            adv = b"\x02\x01\x06" + bytes((len(name) + 1, 0x09)) + name      # flags + complete local name
            ble.gap_advertise(100_000, adv_data=adv)                         # interval in microseconds

        def irq(event, data):
            if event == _IRQ_CENTRAL_CONNECT:
                conns.add(data[0])
            elif event == _IRQ_CENTRAL_DISCONNECT:
                conns.discard(data[0])
                advertise()                                                  # advertise again for the next central

        ble.irq(irq)
        advertise()

        counter = 0
        while True:
            counter += 1
            value = str(counter).encode()
            ble.gatts_write(counter_h, value)                                # what a read returns
            for conn in conns:
                ble.gatts_notify(conn, counter_h, value)                     # push it to every subscriber
            time.sleep(1)
      `,
      output: `
        (a phone or a scanner board sees "esp-ble-sensor" and the values 1, 2, 3 ...)
      `,
      notes: ['In the Arduino BLE library the notification switch is a descriptor named BLE2902 that the sketch adds; some library versions add it for you, and adding it does no harm.', 'A phone app must subscribe to the characteristic before notifications arrive; a read always returns the last value written.']
    },
    {
      title: 'A scanner that finds the peripheral and reports its signal',
      about: 'Listens for advertisements for five seconds at a time and reports whether a device called "esp-ble-sensor" was heard and how strongly. No connection is made, so any number of boards can do it at once.',
      needs: 'A second ESP32-family board with Bluetooth LE, within a few metres of the first.',
      blocks: `
        when started
          start serial at (115200) baud
          start BLE scanning :: ble

        every (5) seconds
          scan for (5) seconds :: ble
          if <found device named [esp-ble-sensor]?> then
            print (join [found esp-ble-sensor, ] (signal strength of it) [ dBm])
          else
            print [esp-ble-sensor not heard]
          end
      `,
      cpp: String.raw`
        #include <BLEDevice.h>
        #include <BLEUtils.h>
        #include <BLEScan.h>
        #include <BLEAdvertisedDevice.h>

        BLEScan *scan;

        void setup() {
          Serial.begin(115200);
          BLEDevice::init("");
          scan = BLEDevice::getScan();
          scan->setActiveScan(true);                    // also ask for the scan response, which may hold the name
          scan->setInterval(100);
          scan->setWindow(99);
        }

        void loop() {
          BLEScanResults *results = scan->start(5, false);   // listen for 5 seconds; a pointer since core 3.0
          bool found = false;
          for (int i = 0; i < results->getCount(); i++) {
            BLEAdvertisedDevice device = results->getDevice(i);
            if (device.haveName() && device.getName() == "esp-ble-sensor") {
              Serial.printf("found esp-ble-sensor, %d dBm\n", device.getRSSI());
              found = true;
            }
          }
          if (!found) Serial.println("esp-ble-sensor not heard");
          scan->clearResults();                              // free the memory of this scan
        }
      `,
      py: String.raw`
        import bluetooth, time

        _IRQ_SCAN_RESULT = 5
        _IRQ_SCAN_DONE = 6
        WANTED = b"esp-ble-sensor"

        def name_of(adv):
            # walk the advertisement: [length, type, data ...]; type 0x08 or 0x09 is the local name
            i = 0
            while i + 1 < len(adv):
                n = adv[i]
                if n == 0:
                    break
                if adv[i + 1] in (0x08, 0x09):
                    return bytes(adv[i + 2:i + 1 + n])
                i += 1 + n
            return b""

        best = None                                    # the strongest signal heard in this scan
        scanning = False

        def irq(event, data):
            global best, scanning
            if event == _IRQ_SCAN_RESULT:
                addr_type, addr, adv_type, rssi, adv_data = data
                if name_of(adv_data) == WANTED:        # copy out inside the handler: the buffers are reused
                    best = rssi if best is None else max(best, rssi)
            elif event == _IRQ_SCAN_DONE:
                scanning = False

        ble = bluetooth.BLE()
        ble.active(True)
        ble.irq(irq)

        while True:
            best = None
            scanning = True
            ble.gap_scan(5000, 30000, 30000, True)     # 5 s, 30 ms interval and window, active scan
            while scanning:
                time.sleep_ms(100)
            if best is None:
                print("esp-ble-sensor not heard")
            else:
                print("found esp-ble-sensor,", best, "dBm")
      `,
      output: `
        found esp-ble-sensor, -58 dBm
        found esp-ble-sensor, -61 dBm
        esp-ble-sensor not heard
      `,
      notes: ['The signal strength falls as the boards move apart, but also with walls, bodies and antennas: use it for "near or far", not for centimetres ([[rssi-and-signal-quality]]).', 'To read the counter you would connect and subscribe; the first program offers it, and a phone app can subscribe to it too.']
    }
  ],
  quiz: [
    { q: 'A board only needs to learn that another board is nearby, and how close. What is the simplest BLE approach?', choices: ['Pair the boards and keep a connection open', 'Scan for its advertisements and read the signal strength', 'Use Bluetooth Classic', 'Write to its characteristic every second'], a: 1, why: 'Advertisements are broadcast to anyone who listens. Scanning needs no connection, no pairing and no RAM for a link, and each advertisement arrives with its signal strength.' },
    { q: 'With the default MTU of 23 bytes, how many bytes of data fit in one notification?', choices: ['23', '20', '3', '244'], a: 1, why: 'A notification carries the MTU minus 3 bytes of attribute-protocol header: 23 − 3 = 20. A central can negotiate a larger MTU, up to 517.' },
    { q: 'The ESP32-S2 can act as a BLE peripheral.', a: false, why: 'The ESP32-S2 has Wi-Fi but no Bluetooth at all. The other chips of the family have Bluetooth LE, the original ESP32 with version 4.2 and the S3, C3, C6 and later with 5.x.' },
    { q: 'Which is the stronger reason to choose BLE over ESP-NOW for a sensor?', choices: ['It sends more data per frame', 'A phone can read it directly', 'It needs no scan', 'It works on the ESP32-S2'], a: 1, why: 'Phones speak Bluetooth LE and not ESP-NOW. BLE frames are smaller, it needs a scan or advertisement, and the S2 has no Bluetooth.' }
  ],
  applications: [
    'A door or window sensor that a phone and a gateway board can both read.',
    'A proximity detector that notices a tagged board or a person\'s phone entering a room.',
    'A remote that connects to one receiver board and sends small commands.',
    'Scanner boards placed around a house, each reporting the strength of one beacon.'
  ],
  sources: [
    'Bluetooth SIG, *Bluetooth Core Specification*, the volumes on the Generic Access Profile, the Attribute Protocol and the Generic Attribute Profile.',
    'Arduino core for ESP32 documentation, the *BLE* library and its Server and Scan examples (core 3.3).',
    'MicroPython documentation, the *bluetooth* module (version 1.29).'
  ]
},

/* ================================================================ time-sync-between-boards */
{
  id: 'time-sync-between-boards',
  parent: 'esp-now-and-peer-to-peer',
  title: 'Keeping boards in time',
  level: 3,
  short: 'Every board has its own clock, and two clocks never agree for long. NTP gives all of them the time of day; a four-timestamp exchange lets two boards measure their offset and the delay between them; and drift says how soon to do it again.',
  keywords: ['time synchronisation', 'clock sync', 'NTP', 'SNTP', 'offset', 'round-trip delay', 'drift', 'ppm', 'timestamp', 'crystal', 'epoch', 'UTC', 'esp_timer', 'one-way broadcast', 'timestamp rx_ctrl'],
  prereq: ['udp-between-boards', 'esp-now', 'non-blocking-timing'],
  related: ['ntp-and-time', 'esp-now-gateway', 'mesh-networks-on-esp', 'crystals-and-clocks', 'rtc-domain-and-lp-core', 'gnss-receivers'],
  body: `Three sensors log a door opening, each with its own \`millis()\`. Which opened first? The numbers cannot say: each board counts from its own power-up, at the pace of its own crystal. Anything that needs several boards to agree on *when* needs their clocks brought together.

### Why clocks drift

A board counts the ticks of an oscillator. The oscillator is slightly fast or slow — a crystal is good to tens of parts per million (ppm), and a clock that is **20 ppm** off gains or loses 20 µs every second, **1.7 seconds a day**. Two boards, each 20 ppm off in opposite directions, drift apart at 40 ppm. The clock that runs in deep sleep is usually a cheaper internal oscillator, good to a few percent unless a 32 kHz crystal is fitted.

### Time from the internet: SNTP

A board on Wi-Fi can ask a time server by **SNTP** (UDP port 123), which sets its clock to **UTC**, typically within a few tens of milliseconds, and repeats about once an hour by default. The clock is lost at power-off, so re-sync at every start; local time is only display, done with a time-zone rule ([[ntp-and-time]]). MicroPython's epoch is the year 2000, not 1970.

### Two boards, no internet: the four timestamps

The idea behind NTP works between any two boards. A notes the time it sends a question, $t_1$. B notes when it receives it, $t_2$, and when it replies, $t_3$. A notes when the reply arrives, $t_4$. Two clocks, four readings:

- the **offset** of B's clock from A's is $\\theta = \\tfrac{(t_2 - t_1) + (t_3 - t_4)}{2}$;
- the **round-trip delay** on the air is $\\delta = (t_4 - t_1) - (t_3 - t_2)$.

The formula assumes equal delays out and back. When they differ — a busy channel one way — the error is half the difference, never more than $\\delta / 2$. Send several requests and keep the one with the **smallest delay**: it was the least disturbed. The simulation below shows the readings and the error.

### Quick and cheap: one-way broadcast

If a millisecond or two is enough, a leader can broadcast its clock every few seconds and the followers adjust to it, allowing a fixed delay for the air. It costs one frame for any number of followers, and the receive information of an ESP-NOW frame carries a hardware time stamp of its arrival, steadier than one taken in the program. For better than a millisecond, a GNSS receiver's one-pulse-per-second signal is the usual answer ([[gnss-receivers]]).

### Do not step on your own clock

Use the **monotonic** counter (\`millis()\`, ticks) for timeouts and intervals, and the **wall clock** only for stamps: a correction in the middle of a timeout would make it too long or too short. Drift goes on after every correction, so the re-sync interval is the error you allow divided by the drift rate: two boards 40 ppm apart stay within 10 ms for $0.01 / 0.00004 = 250$ s.

> [!key] Boards disagree because their oscillators do: 20 ppm is 1.7 s a day. Use SNTP when there is internet; between boards, exchange four timestamps for the offset and the delay, keep the smallest-delay exchange, and repeat before drift exceeds the error you accept.`,
  ideas: [
    'Every board counts with its own oscillator; 20 ppm is 1.7 seconds a day, and two boards can drift apart twice as fast.',
    'SNTP sets the clock to UTC from the internet, typically to a few tens of milliseconds; it is lost at power-off.',
    'Four timestamps give the offset ((t2 − t1) + (t3 − t4)) / 2 and the delay (t4 − t1) − (t3 − t2); asymmetry limits the error to half the delay.',
    'How often to re-sync follows from the error you accept divided by the drift rate.'
  ],
  pitfalls: [
    'Once synchronised, boards stay synchronised — Their oscillators keep drifting at tens of ppm. Correct again before the error exceeds what you accept.',
    'The offset exchange is exact — It assumes the same delay each way. A busy channel one way makes it wrong by up to half the round trip; use the exchange with the smallest delay.',
    'Setting the wall clock is harmless for timeouts — A step in the clock stretches or shortens any interval measured with it. Measure intervals with the monotonic counter.'
  ],
  terms: [
    { term: 'Clock offset', also: ['time offset'], def: 'The difference between two clocks at one moment: how far ahead or behind one board\'s clock is compared with another\'s.' },
    { term: 'Drift', also: ['clock drift', 'ppm', 'parts per million'], def: 'The slow growth of the offset because the clocks run at slightly different rates. 1 ppm is one microsecond per second; 20 ppm is 1.7 seconds a day.' },
    { term: 'SNTP', also: ['NTP', 'Simple Network Time Protocol'], def: 'A protocol over UDP port 123 by which a device asks a time server for the current UTC time and sets its clock from the answer.' },
    { term: 'Round-trip delay', also: ['RTT', 'path delay'], def: 'The time a request and its answer spend travelling, found by subtracting the other board\'s waiting time from the whole interval: (t4 − t1) − (t3 − t2).' },
    { term: 'Epoch', also: ['Unix time', 'time_t'], def: 'The zero of a clock\'s count of seconds. Unix and Arduino time count from 1 January 1970; MicroPython on the ESP32 counts from 1 January 2000.' }
  ],
  choose: {
    good: ['SNTP for any board that is on a network with internet and needs the date and time', 'The four-timestamp exchange for two boards that need to agree to a millisecond or so', 'A one-way broadcast from a leader for many followers and loose accuracy'],
    avoid: ['Stamping events with millis() from several boards and comparing them', 'Setting the wall clock and using it for timeouts', 'Assuming a sleeping board\'s clock is accurate after hours in deep sleep'],
    check: ['The error you can accept, and so how often to re-sync', 'That time is re-synchronised at every power-on', 'Whether the delay out and back can differ: take the smallest-delay sample']
  },
  code: [
    {
      title: 'Set the clock from the internet',
      about: 'Joins Wi-Fi, asks a time server for UTC and prints the time once a second.',
      needs: 'An ESP32-family board and a Wi-Fi network with internet access. The credentials are placeholders ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          set clock from time server [pool.ntp.org] :: net

        every (1) seconds
          print (join [UTC: ] (current time))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org", "time.nist.gov");   // offsets 0, 0: the clock runs in UTC
        }

        void loop() {
          struct tm t;
          if (getLocalTime(&t, 5000)) {                         // waits for the first sync
            Serial.println(&t, "UTC: %Y-%m-%d %H:%M:%S");
          } else {
            Serial.println("no time yet");
          }
          delay(1000);
        }
      `,
      py: String.raw`
        import network, ntptime, time

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        sta.connect("your-ssid", "your-password")
        while not sta.isconnected():
            time.sleep_ms(250)

        ntptime.host = "pool.ntp.org"
        while True:
            try:
                ntptime.settime()                     # sets the clock to UTC; raises OSError on a timeout
                break
            except OSError:
                time.sleep_ms(1000)

        while True:
            t = time.localtime()                      # UTC, because the clock was set from NTP
            print("UTC: %04d-%02d-%02d %02d:%02d:%02d" % t[:6])
            time.sleep_ms(1000)
      `,
      output: `
        UTC: 2026-10-04 12:00:01
        UTC: 2026-10-04 12:00:02
      `,
      notes: ['For local time with daylight saving, give the C++ side a time-zone rule with configTzTime; MicroPython has no time-zone support, so add the offset yourself.', 'The clock is lost at power-off: call this at every start. Certificates for HTTPS also need a correct clock.']
    },
    {
      title: 'Ask another board what time it is',
      about: 'Every board answers time requests. A board with ASK set sends a request every five seconds, collects the four timestamps and prints the other board\'s clock offset and the round-trip delay, in microseconds. All messages are broadcasts, so no addresses are needed.',
      needs: 'Two ESP32-family boards running the same program; set ASK true on one of them.',
      blocks: `
        when started
          start serial at (115200) baud
          start Wi-Fi without connecting :: wifi
          start ESP-NOW :: radio
          add peer [FF:FF:FF:FF:FF:FF] :: radio

        every (5) seconds
          set [t1 v] to (microseconds since start)
          send (join [request,] (t1)) to peer [FF:FF:FF:FF:FF:FF] :: radio

        when data received from (sender) :: radio
          set [t2 v] to (time the frame arrived)
          if <(received type) = [request]> then
            send (join [reply,] (t1 of request) [,] (t2) [,] (microseconds since start)) to peer [FF:FF:FF:FF:FF:FF] :: radio
          else
            set [t4 v] to (time the frame arrived)
            print (join [offset ] (((t2 of reply) - (t1)) + ((t3 of reply) - (t4))) / (2) [ us])
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>
        #include <esp_timer.h>

        const bool ASK = true;                          // true on the board that asks; both boards answer
        const uint8_t BROADCAST[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
        const uint8_t REQ = 1, REPLY = 2;

        typedef struct __attribute__((packed)) {
          uint8_t type;
          int64_t t1, t2, t3;                           // microseconds on the clocks of A (t1) and B (t2, t3)
        } Packet;

        Packet reply;                                   // the answer being prepared by the callback
        volatile bool replyPending = false;
        Packet got;                                     // a reply that arrived
        int64_t t4 = 0;
        volatile bool replyArrived = false;

        void onDataRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
          int64_t now = esp_timer_get_time();           // stamp first, before anything else
          if (len != sizeof(Packet)) return;
          Packet p;
          memcpy(&p, data, sizeof(p));
          if (p.type == REQ) {                          // we are the clock being asked
            reply.type = REPLY; reply.t1 = p.t1; reply.t2 = now; reply.t3 = 0;
            replyPending = true;
          } else if (p.type == REPLY && ASK) {
            got = p; t4 = now;
            replyArrived = true;
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          if (esp_now_init() != ESP_OK) { Serial.println("esp_now_init failed"); return; }
          esp_now_register_recv_cb(onDataRecv);
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, BROADCAST, 6);
          peer.channel = 0;
          peer.encrypt = false;
          esp_now_add_peer(&peer);
        }

        void loop() {
          if (replyPending) {
            replyPending = false;
            reply.t3 = esp_timer_get_time();            // stamp as late as possible, just before sending
            esp_now_send(BROADCAST, (uint8_t *)&reply, sizeof(reply));
          }
          if (replyArrived) {
            replyArrived = false;
            int64_t offset = ((got.t2 - got.t1) + (got.t3 - t4)) / 2;
            int64_t delay = (t4 - got.t1) - (got.t3 - got.t2);
            Serial.printf("offset %lld us, round trip %lld us\n", (long long)offset, (long long)delay);
          }
          static uint32_t last = 0;
          if (ASK && millis() - last >= 5000) {
            last = millis();
            Packet req = {REQ, esp_timer_get_time(), 0, 0};   // t1, stamped as late as possible
            esp_now_send(BROADCAST, (uint8_t *)&req, sizeof(req));
          }
        }
      `,
      py: String.raw`
        import network, espnow, struct, time

        ASK = True                                      # True on the board that asks; both boards answer
        BROADCAST = b"\xff\xff\xff\xff\xff\xff"
        REQ, REPLY = 1, 2

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(BROADCAST)

        def now_us():
            return time.time_ns() // 1000               # microseconds on this board's clock

        last = time.ticks_add(time.ticks_ms(), -5000)
        while True:
            if ASK and time.ticks_diff(time.ticks_ms(), last) >= 5000:
                last = time.ticks_ms()
                e.send(BROADCAST, struct.pack("<Bqqq", REQ, now_us(), 0, 0))   # t1, stamped as late as possible
            mac, msg = e.recv(100)
            arrived = now_us()                          # stamp straight after the frame came out of recv
            if msg and len(msg) == 25:
                kind, t1, t2, t3 = struct.unpack("<Bqqq", msg)
                if kind == REQ:                         # we are the clock being asked
                    e.send(BROADCAST, struct.pack("<Bqqq", REPLY, t1, arrived, now_us()))
                elif kind == REPLY and ASK:
                    t4 = arrived
                    offset = ((t2 - t1) + (t3 - t4)) // 2
                    delay = (t4 - t1) - (t3 - t2)
                    print("offset", offset, "us, round trip", delay, "us")
      `,
      output: `
        offset 250132 us, round trip 4210 us
        offset 250140 us, round trip 3890 us
      `,
      notes: ['The offset is large and arbitrary here because the boards started at different times: the point is that it stays steady, and its changes between exchanges are the drift.', 'Stamps taken in the program include the time the processor needed to get round to the frame; the hardware time stamp in the receive information is steadier. Keep the exchange with the smallest round trip.']
    }
  ],
  formulas: [
    {
      name: 'Clock offset from four timestamps',
      expr: 'theta = ((t2 - t1) + (t3 - t4))/2',
      tex: '\\theta = \\frac{(t_2 - t_1) + (t_3 - t_4)}{2}',
      vars: {
        theta: { name: 'offset of B\'s clock from A\'s', q: 'time', unit: 'ms', signed: true },
        t1: { name: 'A sends the request (A\'s clock)', q: 'time', unit: 'ms', value: 1000, signed: true },
        t2: { name: 'B receives it (B\'s clock)', q: 'time', unit: 'ms', value: 1262, signed: true },
        t3: { name: 'B sends the reply (B\'s clock)', q: 'time', unit: 'ms', value: 1267, signed: true },
        t4: { name: 'A receives the reply (A\'s clock)', q: 'time', unit: 'ms', value: 1031, signed: true }
      },
      solveFor: 'theta',
      note: 'Assumes the delay is the same in both directions. If it is not, the offset is wrong by at most half the round-trip delay.',
      stories: { theta: 'Board A sends a request at {t1} on its own clock. Board B receives it at {t2} and answers at {t3}, both on its clock. A receives the answer at {t4}. How far is B\'s clock ahead of A\'s?' }
    },
    {
      name: 'Round-trip delay from four timestamps',
      expr: 'delta = (t4 - t1) - (t3 - t2)',
      tex: '\\delta = (t_4 - t_1) - (t_3 - t_2)',
      vars: {
        delta: { name: 'round-trip delay on the air', q: 'time', unit: 'ms' },
        t1: { name: 'A sends the request (A\'s clock)', q: 'time', unit: 'ms', value: 1000, signed: true },
        t2: { name: 'B receives it (B\'s clock)', q: 'time', unit: 'ms', value: 1262, signed: true },
        t3: { name: 'B sends the reply (B\'s clock)', q: 'time', unit: 'ms', value: 1267, signed: true },
        t4: { name: 'A receives the reply (A\'s clock)', q: 'time', unit: 'ms', value: 1031, signed: true }
      },
      solveFor: 'delta',
      note: 'The time A waited, minus the time B kept the message. It does not depend on the offset between the clocks, which cancels.'
    },
    {
      name: 'Drift accumulated by a clock',
      expr: 'eps = ppm/1000000*T',
      tex: '\\varepsilon = \\mathrm{ppm} \\times 10^{-6} \\times T',
      vars: {
        eps: { name: 'accumulated error', q: 'time', unit: 's', tex: '\\varepsilon' },
        ppm: { name: 'clock rate error', unit: 'ppm', value: 20, min: 0, max: 100000, tex: '\\mathrm{ppm}' },
        T: { name: 'time since the last correction', q: 'time', unit: 'h', value: 24 }
      },
      solveFor: 'e',
      note: 'A rate error of 1 ppm adds one microsecond per second. Two boards with opposite errors drift apart at the sum of the two.',
      stories: { eps: 'A board\'s clock runs {ppm} fast. How much has it gained {T} after the last correction?' }
    }
  ],
  examples: [
    {
      title: 'Reading the four timestamps',
      q: 'Board A sends a request at 1000 ms (its clock). B receives it at 1262 ms and replies at 1267 ms (B\'s clock). A receives the reply at 1031 ms (its clock). What are the offset and the round-trip delay?',
      steps: ['$t_1 = 1000$, $t_2 = 1262$, $t_3 = 1267$, $t_4 = 1031$.', 'Offset: $\\theta = \\tfrac{(1262 - 1000) + (1267 - 1031)}{2} = \\tfrac{262 + 236}{2} = 249$ ms.', 'Delay: $\\delta = (1031 - 1000) - (1267 - 1262) = 31 - 5 = 26$ ms.'],
      a: 'B\'s clock is 249 ms ahead of A\'s, and the request and reply spent 26 ms on the air in all. If the way out took 12 ms and the way back 14, the true offset is 250 ms: the formula is off by 1 ms, half the difference.'
    },
    {
      title: 'How often must two boards re-sync?',
      q: 'Two boards have crystals that may be 20 ppm off in opposite directions. Their clocks must agree to within 5 ms. How often must they be synchronised?',
      steps: ['In the worst case they drift apart at $20 + 20 = 40$ ppm, that is 40 µs every second.', 'The time to reach 5 ms: $5\\,\\text{ms} / 40\\,\\mu\\text{s/s} = 125$ s.', 'Allow for the error of the sync itself, a millisecond or so: re-sync about every 90 to 100 seconds.'],
      a: 'About every minute and a half — or relax the 5 ms: at 50 ms the interval grows to about twenty minutes.'
    }
  ],
  quiz: [
    { q: 'A crystal runs 20 ppm fast. By how much does its clock gain in a day?', choices: ['0.17 s', '1.7 s', '17 s', '170 s'], a: 1, why: '20 ppm is 20 µs per second. A day has 86 400 s, so the gain is 86 400 × 20 × 10⁻⁶ ≈ 1.7 s.' },
    { q: 'In the four-timestamp exchange the request takes 12 ms and the reply 14 ms. By how much is the measured offset wrong?', choices: ['0', '1 ms', '2 ms', '26 ms'], a: 1, why: 'The formula assumes equal delays. It attributes the average of the two to each direction, so the error is half the difference: (14 − 12) / 2 = 1 ms.' },
    { q: 'Why is it better to keep the exchange with the smallest round-trip delay?', choices: ['It uses less battery', 'It has had the least chance of being disturbed, so its error is smallest', 'It sets the clock faster', 'It changes the channel'], a: 1, why: 'The error is bounded by half the round trip. A short round trip also means the frames met no queueing or retry, so the delays out and back are likely nearly equal.' },
    { q: 'A program times a 10-second pause with the wall clock. In the middle, SNTP corrects the clock by +2 seconds. What happens?', choices: ['The pause is unaffected', 'The pause ends 2 seconds early', 'The pause is 2 seconds longer', 'The board restarts'], a: 1, why: 'The wall clock jumped forward by two seconds, so the deadline is reached two seconds sooner. Measure intervals with the monotonic counter, which corrections do not touch.' }
  ],
  applications: [
    'Logging events from several boards in one timeline.',
    'Sensors that wake together just before a gateway\'s listening slot, to save power.',
    'Lights or sounds on several boards that must change at the same instant.',
    'Checking certificates and tokens, which need a correct date.'
  ],
  sources: [
    'RFC 5905, *Network Time Protocol Version 4*: the offset and delay calculation; RFC 4330, *Simple Network Time Protocol*.',
    'Espressif, *ESP-IDF Programming Guide*, System Time and SNTP; the Wi-Fi API reference for the receive time stamp.',
    'Arduino core for ESP32 documentation, the time examples; MicroPython documentation, *ntptime* and the *time* module.'
  ],
  sim: 'en-timesync'
}
);
