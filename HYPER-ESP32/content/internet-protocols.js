/* HYPER-ESP32 · content/internet-protocols.js
 *
 * Topic "internet-protocols" (branch Networks, Cloud and Data): TCP/IP on a microcontroller, sockets, HTTP requests,
 * REST and JSON, HTTPS and TLS, a web server on the ESP, WebSockets, MQTT and its topics and QoS, time by NTP,
 * webhooks and notifications, CoAP and other protocols, and finding network faults.
 *
 * Simulations are in sims/internet-protocols.js (ids ip-*):
 *   ip-layers  a request travelling down the stack, headers added; params { mode: 'faults' }: where a request stops
 *   ip-tcp     the TCP handshake, data, a lost segment, a closed port; and UDP
 *   ip-http    an HTTP request and response as text; params { preset: 'get' | 'rest' | 'server' | 'webhook' }
 *   ip-tls     the TLS handshake and the checks a device makes: the clock, the name, the root
 *   ip-mqtt    clients, a broker, wildcards, retained messages and a last will
 *   ip-qos     message sequences of MQTT QoS 0, 1, 2 and of CoAP; params { proto: 'coap' }
 *   ip-push    polling against a WebSocket push
 *   ip-ntp     the four NTP timestamps, the offset and the delay
 */
Hyper.add(
/* ================================================================ TCP/IP on a microcontroller */
{
  id: 'tcp-ip-on-a-microcontroller',
  parent: 'internet-protocols',
  title: 'TCP/IP on a microcontroller',
  level: 1,
  short: 'A message from your program is handed down through four layers, each adding an envelope of its own. The ESP32 carries a complete, compact stack that does this for you — and its small size explains the limits you will meet.',
  keywords: ['TCP/IP', 'lwIP', 'protocol stack', 'layers', 'MTU', 'MSS', 'header', 'packet', 'segment', 'frame', 'NAT', 'window', 'round trip', 'throughput', 'overhead', 'socket limit'],
  prereq: ['wifi-basics', 'wifi-station'],
  related: ['ip-addresses-dhcp-dns', 'sockets', 'http-client', 'network-troubleshooting', 'iot-architecture', 'heap-and-fragmentation'],
  body: `A message sent from a sketch does not go onto the air as it was written. It is handed down through **four layers**, and each wraps it in an envelope of its own: a header that says what that layer needs the other end to know. At the far end the layers unwrap it in the opposite order. This is the **TCP/IP stack**, and the ESP32 carries a complete one.

### The four layers

| Layer | Its job | Examples |
|---|---|---|
| Application | what the two programs say to each other | HTTP, MQTT, NTP, DNS |
| Transport | which program gets it, and whether it must arrive | TCP (a reliable stream), UDP (loose datagrams); port numbers |
| Internet | which machine, and the route there | IP addresses, ICMP (ping) |
| Link | one hop, to the next device | the Wi-Fi frame, the Ethernet frame; hardware (MAC) addresses |

The simulation below follows one request down the stack and lets you change its size.

### What lives on the chip

The stack is **lwIP**, a compact implementation made for small systems. ESP-IDF includes it, and Arduino and MicroPython sit on top of the same one. It runs in a task of its own beside the Wi-Fi driver, speaks IPv4 and IPv6, and offers your program the familiar *sockets* ([[sockets]]). Because it is a separate task, the network keeps working while your \`loop()\` does something else, until your program blocks in a call that waits for it.

### Numbers worth knowing

- **Headers:** TCP 20 bytes, UDP 8, IP 20, and a Wi-Fi data frame about 38 (16 more with WPA2 encryption).
- **One frame carries at most 1500 bytes** (the *MTU*). After the IP and TCP headers, a TCP segment holds up to **1460 bytes** of your data (the *MSS*); a bigger send is cut into several segments.
- A 100-byte HTTP request therefore costs about 180 bytes on the air: nearly half is envelope. A one-byte message is almost all envelope.
- **Open sockets are limited** (about ten in the usual build) and each holds buffers in RAM.
- TCP may not send more than one *window* of data before the first part is acknowledged, so its speed is at most the window divided by the round-trip time. The ESP's default window is about 6 KB: with a 40 ms round trip that caps one connection near 1.2 Mbit/s, however fast the Wi-Fi link is.

### A surprise: nobody can call you

At home the ESP sits behind a router that does *network address translation* (NAT). The ESP can reach out to the internet, but nothing out there can reach it, because its address is private. This is why devices call out to a broker or a server instead of waiting to be called ([[iot-architecture]]), and why opening a port on the router to a bare device is a bad idea.

> [!key] Every message goes down four layers (application, transport, internet, link) and each adds a header; the ESP's stack, lwIP, does the work and hands you sockets. Remember the overhead, the window limit and the NAT: together they explain most of what surprises people about small devices on the internet.`,
  ideas: [
    'A message passes down four layers, application, transport, internet and link; each adds a header and the far end removes them in reverse.',
    'The ESP runs lwIP, a compact TCP/IP stack in its own task; Arduino and MicroPython both use it through sockets.',
    'Small messages are mostly envelope: 78 bytes of headers surround a one-byte payload.',
    'A small TCP window caps the speed of one connection at window ÷ round-trip time, and NAT means a device cannot be called from outside.'
  ],
  pitfalls: [
    'The ESP has an IP address, so I can reach it from anywhere — At home that address is private and sits behind NAT. Connections from outside go to the router, not to the ESP; the ESP must call out.',
    'Wi-Fi at 72 Mbit/s means my downloads run at 72 Mbit/s — One TCP connection with a small window is limited by the round-trip time, and the headers, retries and shared air take their share too.',
    'Sending one small value every second costs nothing — Each message carries dozens of bytes of headers and keeps the radio awake for the exchange; on a battery the envelope, not the value, is the cost.'
  ],
  terms: [
    { term: 'lwIP', also: ['lightweight IP', 'TCP/IP stack'], def: 'The compact TCP/IP implementation inside ESP-IDF. It runs in its own FreeRTOS task and gives programs the sockets interface.' },
    { term: 'MTU', also: ['maximum transmission unit'], def: 'The largest packet a link will carry in one frame: 1500 bytes on Ethernet and Wi-Fi. A bigger message is split before it is sent.' },
    { term: 'MSS', also: ['maximum segment size'], def: 'The most data a single TCP segment carries: the MTU less the IP and TCP headers, which is 1460 bytes on a 1500-byte link.' },
    { term: 'TCP window', also: ['receive window', 'window size'], def: 'The amount of data a TCP sender may have in flight before it must wait for an acknowledgement. Window divided by round-trip time is the most the connection can carry.' },
    { term: 'NAT', also: ['network address translation', 'port forwarding'], def: 'What a home router does so that many devices share one public address: it rewrites outgoing packets and lets answers back in, but blocks connections started from outside.' },
    { term: 'Round-trip time', also: ['RTT', 'ping time', 'latency'], def: 'How long a message takes to reach the other end and for the answer to come back. It sets how fast a conversation of questions and answers can go.' }
  ],
  formulas: [
    {
      name: 'Speed limit of one TCP connection',
      expr: 'thr = 8*W/RTT',
      tex: '\\mathrm{thr} = \\frac{8\\,W}{\\mathrm{RTT}}',
      vars: {
        thr: { name: 'highest speed of the connection', tex: '\\mathrm{thr}', q: 'datarate', unit: 'Mbit/s' },
        W: { name: 'TCP window', unit: 'bytes', value: 5760 },
        RTT: { name: 'round-trip time', tex: '\\mathrm{RTT}', q: 'time', unit: 'ms', value: 40 }
      },
      solveFor: 'thr',
      note: 'The sender may have one window of bytes in flight, then waits for the acknowledgement. Solve for the round-trip time to see how far away a server may be before one connection falls below a speed you need.',
      stories: { thr: 'A TCP connection has a window of {W} and a round-trip time of {RTT}. What is the highest speed it can reach?' }
    }
  ],
  examples: [
    {
      title: 'What does one temperature reading cost?',
      q: 'A sensor sends the five characters 21.5\\n to a server over TCP on Wi-Fi, in one segment. How many bytes go out on the air, and what share is the reading?',
      steps: ['The payload is 5 bytes.', 'Add the TCP header (20), the IP header (20) and the Wi-Fi frame header and trailer (about 38): 5 + 20 + 20 + 38 = 83 bytes.', 'The share is 5 ÷ 83, about 6 %. The acknowledgement coming back is another 78 or so bytes of pure envelope.'],
      a: 'About 83 bytes leave the ESP, and the reading is only 6 % of them. Sending readings in batches, or in a protocol with small headers, saves energy ([[batching-rates-and-cost]]).'
    }
  ],
  code: [
    {
      title: 'How long does the handshake take?',
      about: 'Looks up a name once, then opens a TCP connection to port 80 five times and prints how long each took. The connection call returns when the server\'s reply to the first message arrives, so the time is one round trip.',
      needs: 'Any ESP32-family board with Wi-Fi and internet access. Do not leave the real network name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          set [addr v] to (look up [example.com])
          repeat (5)
            set [t0 v] to (microseconds since start)
            open TCP connection to (addr) port (80) :: net
            print (join [connect took, ms: ] (((microseconds since start) - (t0)) / (1000)))
            close TCP connection :: net
            wait (1) seconds
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          IPAddress addr;
          if (!WiFi.hostByName("example.com", addr)) {      // 1 on success
            Serial.println("no DNS answer");
            return;
          }
          for (int i = 0; i < 5; i++) {
            NetworkClient client;
            uint32_t t0 = micros();
            bool ok = client.connect(addr, 80, 3000);       // 3 s time-out
            uint32_t dt = micros() - t0;
            if (ok) Serial.printf("connect took %.1f ms\n", dt / 1000.0);
            else Serial.println("connect failed");
            client.stop();
            delay(1000);
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

        addr = socket.getaddrinfo("example.com", 80)[0][-1]
        for i in range(5):
            s = socket.socket()
            s.settimeout(3)                                  # 3 s time-out
            t0 = time.ticks_us()
            try:
                s.connect(addr)
                dt = time.ticks_diff(time.ticks_us(), t0)
                print("connect took %.1f ms" % (dt / 1000))
            except OSError as e:
                print("connect failed", e)
            s.close()
            time.sleep(1)
      `,
      output: `
        connect took 38.4 ms
        connect took 31.2 ms
        connect took 29.8 ms
        connect took 33.5 ms
        connect took 30.1 ms
      `,
      notes: ['The name lookup is done first on purpose, so that its time is not counted. The first connection is often a little slower.', 'A "connect failed" after the time-out means the packets are going nowhere: see [[network-troubleshooting]].']
    }
  ],
  quiz: [
    { q: 'A program sends one byte over TCP on Wi-Fi. About what share of the bytes on the air is the byte itself?', choices: ['About half', 'About 20 %', 'About 1 %', 'Nearly all of it'], a: 2, why: 'One byte plus 20 bytes of TCP header, 20 of IP and about 38 of Wi-Fi frame is 79 bytes: the payload is about 1 %. Small messages are mostly envelope.' },
    { q: 'Which layer decides which program on the ESP receives an incoming segment?', choices: ['Link, by the hardware address', 'Internet, by the IP address', 'Transport, by the port number', 'Application, by the host name'], a: 2, why: 'The IP address brings the packet to the machine; the port number in the TCP or UDP header picks the program (socket) on it.' },
    { q: 'A connection has a 5760-byte window and a 60 ms round-trip time. What is the highest speed it can reach?', choices: ['About 77 kbit/s', 'About 770 kbit/s', 'About 7.7 Mbit/s', 'About 77 Mbit/s'], a: 1, why: 'Speed ≤ window ÷ round trip = 5760 × 8 bits ÷ 0.06 s ≈ 768 kbit/s, whatever the Wi-Fi link could carry.' },
    { q: 'An ESP on the home network has the address 192.168.1.57, so a friend anywhere on the internet can open it with that address.', a: false, why: '192.168.x.x is a private address, and the router\'s NAT blocks connections started from outside. The ESP has to call out, or the router must forward a port (which is rarely wise).' }
  ],
  applications: [
    'Choosing a protocol with small headers, or sending readings in batches, to save battery on a radio that charges per exchange.',
    'Explaining why a firmware download over the internet is slower than the same file from a server on the home network: the round-trip time.',
    'Designing devices that connect out to a broker or cloud service, because nothing can connect in through NAT.',
    'Reading a network capture, where every packet is the layers of this page one inside the other.'
  ],
  sources: [
    'IETF RFC 9293, *Transmission Control Protocol (TCP)*, and RFC 768, *User Datagram Protocol*.',
    'Espressif, *ESP-IDF Programming Guide*, "lwIP" and "ESP-NETIF" sections of the networking API reference.',
    'The lwIP project documentation (the stack the ESP uses).'
  ],
  sim: 'ip-layers'
},

/* ================================================================ sockets */
{
  id: 'sockets',
  parent: 'internet-protocols',
  title: 'Sockets: TCP and UDP',
  level: 2,
  short: 'A socket is one end of a conversation: an address and a port. TCP gives a reliable stream of bytes with no message boundaries; UDP gives single datagrams that may be lost. Which one a job needs decides a great deal.',
  keywords: ['socket', 'TCP', 'UDP', 'port', 'client', 'server', 'bind', 'listen', 'accept', 'connect', 'datagram', 'stream', 'handshake', 'SYN', 'broadcast', 'multicast', 'NetworkClient', 'NetworkServer', 'WiFiUDP', 'framing'],
  prereq: ['tcp-ip-on-a-microcontroller', 'ip-addresses-dhcp-dns'],
  related: ['http-client', 'mqtt', 'ntp-and-time', 'udp-between-boards', 'tcp-between-boards', 'network-troubleshooting', 'coap-and-other-protocols'],
  body: `A **socket** is one end of a conversation: an IP address plus a port number, plus the transport protocol. The address picks the machine; the port picks the program on it, such as 80 for a web server, 1883 for MQTT, 123 for time. A conversation has a socket at each end, and a program talks through its own with a handful of calls: connect, send, receive, close.

### TCP: a stream of bytes

TCP sets up a **connection** first, in three messages (SYN, SYN-ACK, ACK: the simulation plays them). After that it behaves like a pipe: every byte arrives, once, in order, or the connection reports failure. Lost segments are sent again by the stack, so your program never sees the loss, only a delay.

What TCP does *not* keep is the boundaries of your sends. Ten small sends may arrive as one read, and one big send as several. A receiver therefore needs a **framing** rule: end each message with a newline, or put its length in front, or use a protocol that already did (HTTP's \`Content-Length\`).

### UDP: a postcard

UDP has no connection and no promise: a **datagram** goes out as one packet, may be lost, may arrive twice or out of order, and arrives whole or not at all. That sounds worse and is often right: nothing waits for a lost reading, there is no set-up, and the header is 8 bytes. It also allows **broadcast** (to everyone on the network) and **multicast** (to a group), which TCP cannot do. Keep a datagram under about 1470 bytes so that it is not split.

| | TCP | UDP |
|---|---|---|
| Model | connection, stream of bytes | single datagrams |
| Delivery | complete and in order, or an error | may be lost, repeated, reordered |
| Boundaries | none | kept: one send, one datagram |
| Set-up | three messages first | none |
| Used for | HTTP, MQTT, files, anything that must be complete | NTP, DNS, mDNS, discovery, fast telemetry that may skip a sample |

### Ports you will meet

53 DNS · 80 HTTP · 123 NTP (UDP) · 443 HTTPS · 502 Modbus TCP · 1883 MQTT · 5353 mDNS (UDP) · 5683 CoAP (UDP) · 8883 MQTT over TLS. A client does not choose its own port; the stack picks a free high-numbered one for each connection.

### On the ESP

A **client** connects out; a **server** listens, and accepts one connection at a time per call. Each open connection is a socket with buffers, and the number is limited, so close what you open. Connecting to a host that does not answer can block for many seconds: set a time-out. A simple server that serves one client in a loop is fine for a test and wrong for anything shared: see [[web-server-on-esp]].

> [!key] A socket is an address plus a port. TCP is a reliable stream without message boundaries, so you must frame your messages; UDP is single datagrams that may vanish, which suits time, names, discovery and telemetry that may skip a sample.`,
  ideas: [
    'A socket is an IP address plus a port number plus a protocol; the port says which program gets the data.',
    'TCP is a reliable, ordered stream with no message boundaries: frame your messages yourself.',
    'UDP sends separate datagrams with no promise of delivery, order or uniqueness, but with no set-up and a small header.',
    'Open sockets use RAM and are limited in number; close them, and give every connect a time-out.'
  ],
  pitfalls: [
    'One send on TCP arrives as one read — TCP is a stream: it may deliver half a message, or two joined. Mark the end of a message with a newline or a length.',
    'TCP guarantees the other program got my data — It guarantees delivery to the other machine\'s stack, in order. Whether the program read it, or understood it, is a matter for your own acknowledgement.',
    'UDP is just a faster TCP — UDP has no retry, no order, no flow control: it is a different tool. A lost datagram is lost, and a program that cares must notice and resend.'
  ],
  terms: [
    { term: 'Socket', also: ['BSD sockets'], def: 'One end of a network conversation, identified by an IP address, a port and a protocol. Programs create sockets and use connect, send, receive and close on them.' },
    { term: 'Port', also: ['port number'], def: 'A number from 0 to 65535 that tells the receiving machine which program or service gets the data: 80 for HTTP, 443 for HTTPS, 1883 for MQTT.' },
    { term: 'Three-way handshake', also: ['SYN', 'SYN-ACK'], def: 'How TCP opens a connection: the client sends SYN, the server answers SYN-ACK, the client confirms with ACK. Only then does data flow.' },
    { term: 'Datagram', also: ['UDP packet'], def: 'A self-contained message sent by UDP. It arrives whole or not at all, and nothing tells the sender which.' },
    { term: 'Framing', also: ['message delimiting'], def: 'The rule that tells a receiver where one message ends in a stream of bytes: a newline, a length prefix, or a fixed size.' },
    { term: 'Broadcast', also: ['multicast'], def: 'Sending one datagram to every device on the network (broadcast) or to a chosen group (multicast). Only UDP can do it.' }
  ],
  choose: {
    good: ['TCP for anything that must arrive complete and in order: requests, files, commands, MQTT', 'UDP for time, names, discovery and measurements where the next one will replace a lost one', 'UDP broadcast or multicast to find devices on the local network'],
    avoid: ['UDP for a command that must not be lost, unless your own acknowledgement resends it', 'TCP for a fast stream of independent readings on a weak link, where one lost segment holds everything up', 'A TCP connection for one tiny message every few minutes, if keeping it open or opening it costs more energy than the message'],
    check: ['What your program does when the other end disappears without saying goodbye', 'The time-out on every connect and every read', 'How many sockets your whole program holds at once']
  },
  code: [
    {
      title: 'A TCP echo server',
      about: 'Listens on port 5000, reads a line from the connected client and sends it back with "echo: " in front. Try it from a computer on the same network with a telnet or netcat client.',
      needs: 'Any ESP32-family board with Wi-Fi; a computer on the same network. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          print (IP address)
          start TCP server on port (5000) :: net

        when TCP client sends (line) :: net
          send (join [echo: ] (line)) to that client :: net
      `,
      cpp: String.raw`
        #include <WiFi.h>

        NetworkServer server(5000);

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());
          server.begin();
        }

        void loop() {
          NetworkClient client = server.accept();        // core 3.x: accept(), not available()
          if (!client) return;
          Serial.println("client connected");
          while (client.connected()) {
            if (client.available()) {
              String line = client.readStringUntil('\n');
              client.print("echo: ");
              client.println(line);
            }
          }
          client.stop();
          Serial.println("client left");
        }
      `,
      py: String.raw`
        import network, socket, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        print(wlan.ipconfig("addr4")[0])

        server = socket.socket()
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(("0.0.0.0", 5000))
        server.listen(1)
        while True:
            client, addr = server.accept()
            print("client connected", addr)
            f = client.makefile("rwb", 0)
            while True:
                line = f.readline()                      # one line, up to the newline
                if not line:                             # empty: the client closed
                    break
                client.send(b"echo: " + line)
            client.close()
            print("client left")
      `,
      output: `
        192.168.1.57
        client connected
        client left
      `,
      notes: ['This serves one client at a time, and a second client waits. It also blocks the program while a client stays connected: fine for a test, wrong for a device that must do other things ([[tasks]]).', 'The newline is the framing rule here: the server reads up to it, so a client that never sends one makes it wait.']
    },
    {
      title: 'Send a reading by UDP',
      about: 'Sends a short text datagram to a computer on the network every two seconds. Nothing tells the ESP whether it arrived: that is UDP.',
      needs: 'Any ESP32-family board with Wi-Fi. On the computer (here 192.168.1.20) listen with a UDP listener, for example netcat started with the options for UDP and port 4210.',
      wiring: [['Computer 192.168.1.20', 'UDP port 4210', 'change the address to your computer\'s']],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
        forever
          send UDP (join [temp=] (21.5)) to [192.168.1.20] port (4210) :: net
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WiFiUdp.h>

        WiFiUDP udp;
        const IPAddress TARGET(192, 168, 1, 20);       // the computer that listens
        const uint16_t PORT = 4210;

        void setup() {
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          udp.beginPacket(TARGET, PORT);
          udp.print("temp=21.5");                      // one datagram
          udp.endPacket();                             // sent: no word on whether it arrived
          delay(2000);
        }
      `,
      py: String.raw`
        import network, socket, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        TARGET = ("192.168.1.20", 4210)                # the computer that listens
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        while True:
            s.sendto(b"temp=21.5", TARGET)             # one datagram
            time.sleep(2)
      `,
      notes: ['A datagram sent to an address nobody listens on simply disappears; the program cannot tell. To know, make the receiver answer, and resend when no answer comes.', 'To reach every device on the network, send to the broadcast address (255.255.255.255, or the network\'s .255); some routers and guest networks block it.']
    }
  ],
  quiz: [
    { q: 'A TCP client sends "21.5\\n" and then "22.0\\n" quickly. What may the server\'s first read return?', choices: ['Always exactly "21.5\\n"', 'Possibly "21.5\\n22.0\\n" in one piece, or only part of a line', 'Only the second message', 'An error, because two sends need two connections'], a: 1, why: 'TCP is a stream with no message boundaries. A reader must split the bytes itself, here at the newline, and be ready for half a message.' },
    { q: 'Which transport suits a request to the time server, where an answer lost in the air can simply be asked for again?', choices: ['TCP, because it is reliable', 'UDP, because one datagram each way is all it takes', 'Neither: time needs HTTP', 'TCP, because UDP cannot cross a router'], a: 1, why: 'A time request is one small datagram and one reply. Setting up a TCP connection would cost three messages before the first useful byte, and a retry costs one more datagram.' },
    { q: 'A UDP send returns without an error. The receiver got the datagram.', a: false, why: 'A send that returns only says the datagram was handed to the network. It may have been lost anywhere along the way, and UDP tells nobody.' },
    { q: 'Why does a TCP client not pick its own port number?', choices: ['Ports are reserved for servers', 'Each connection needs a unique port at the client end, and the stack picks a free one', 'The server chooses it', 'Clients have no port'], a: 1, why: 'A connection is identified by both addresses and both ports. The client\'s port only has to be unique for the connection, so the stack assigns a free high-numbered one.' }
  ],
  applications: [
    'MQTT, HTTP and every other connection-oriented protocol in this topic are built on TCP sockets.',
    'NTP, DNS, mDNS and CoAP use UDP, because a question and an answer are one datagram each.',
    'Sending readings or control values between two boards on the same network ([[udp-between-boards]], [[tcp-between-boards]]).',
    'A debugging back-door: a TCP or UDP port that prints the device\'s state to a computer without a serial cable.'
  ],
  sources: [
    'IETF RFC 9293, *Transmission Control Protocol*, and RFC 768, *User Datagram Protocol*.',
    'Arduino core for ESP32 documentation, *Network* and *WiFi* libraries: NetworkClient, NetworkServer, WiFiUDP (core 3.3).',
    'MicroPython documentation, *socket* module (version 1.29).'
  ],
  sim: 'ip-tcp'
},

/* ================================================================ HTTP requests */
{
  id: 'http-client',
  parent: 'internet-protocols',
  title: 'HTTP requests',
  level: 1,
  short: 'HTTP is one request and one reply, both readable text: a method and a path, some headers, perhaps a body, and an answer that starts with a three-digit status. The ESP can ask for pages, fetch data and report readings in a few lines.',
  keywords: ['HTTP', 'HTTPClient', 'GET', 'POST', 'PUT', 'DELETE', 'status code', '200', '404', '500', 'header', 'request', 'response', 'redirect', 'timeout', 'requests', 'urequests', 'Content-Type', 'keep-alive'],
  prereq: ['tcp-ip-on-a-microcontroller', 'sockets'],
  related: ['rest-apis-and-json', 'https-and-tls', 'web-server-on-esp', 'webhooks-and-notifications', 'network-troubleshooting', 'non-blocking-timing'],
  body: `HTTP is the language of the web and the plainest way for an ESP to talk to a server: one **request**, one **response**, both as text you can read. Everything in this topic that runs over HTTP, from a weather call to a chat message, is this exchange with a different path and a different body.

### A request and its answer

~~~text
GET /api/status HTTP/1.1
Host: example.com
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 27

{"temp":21.5,"unit":"C"}
~~~

A request is a **method** and a path, then **headers** (one per line), then an empty line and, if there is one, a **body**. The response begins with a **status line**, has headers of its own, an empty line and the body. The simulation shows both as the program would see them.

### Methods and status codes

| Method | Means | Typical use |
|---|---|---|
| GET | give me this | read a value, fetch a page |
| POST | here is something: act on it | send a reading, create a record |
| PUT | store this here, replacing what is there | set a value |
| DELETE | remove this | delete a record |

The first digit of the **status code** tells the story: **2xx** it worked (200 OK, 201 Created, 204 No Content); **3xx** look elsewhere (301 and 302 give a new address in a \`Location\` header); **4xx** your request was wrong (400 bad request, 401 not logged in, 403 forbidden, 404 not found, 429 too many requests); **5xx** the server failed (500, 503).

### On the ESP

In Arduino the \`HTTPClient\` class does the work: \`begin(url)\`, then \`GET()\` or \`POST(body)\`, which return the status code, then \`getString()\`, then \`end()\`. A **negative** return is not an HTTP status at all: it means the call failed before an answer came (-1 is "connection refused", -11 a read time-out), and \`errorToString()\` turns it into words. In MicroPython \`requests.get(url)\` gives an object with \`status_code\`, \`text\` and \`json()\`; always \`close()\` it.

Three habits matter on a small device. **Set time-outs:** a call to a server that does not answer blocks your program for as long as the time-out. **Check the code before using the body:** a 404 page is not your data. **Read big answers in pieces:** \`getString()\` holds the whole body in RAM. Redirects are not followed unless you ask. The ESP speaks HTTP/1.1 only, and each call to a public service counts against its rate limit.

> [!key] HTTP is a text request answered by a text response whose first line carries a status code. On the ESP, check for a negative result (the call failed), then the status (the server's verdict), and only then the body, and always set a time-out.`,
  ideas: [
    'An HTTP request is a method, a path, headers and sometimes a body; the response is a status line, headers and a body.',
    'The first digit of the status code gives the class: 2 worked, 3 go elsewhere, 4 your request was wrong, 5 the server failed.',
    'A negative return from the Arduino HTTPClient is a failure on the ESP\'s side of the exchange, not an HTTP status.',
    'A request blocks the program until it finishes or times out, so set a time-out and keep the calls infrequent.'
  ],
  pitfalls: [
    'If the call returns, I have my data — It returns a status. A 404 or 500 comes with a page of its own; test for 200 before you parse. A negative number means there was no answer at all.',
    'Any web address works on the ESP — Plain http:// works; https:// needs a certificate setup ([[https-and-tls]]); a redirect must be followed on purpose; and sites that insist on HTTP/2 or heavy browser headers may refuse a small client.',
    'I can poll an API every second — Public services limit callers and answer 429 or block you. Ask only as often as the data changes, and read the service\'s published limit.'
  ],
  terms: [
    { term: 'HTTP', also: ['Hypertext Transfer Protocol', 'HTTP/1.1'], def: 'The request-and-response protocol of the web: a client sends a method, a path and headers, and the server answers with a status code, headers and usually a body.' },
    { term: 'Status code', also: ['HTTP status', '200 OK', '404', '500'], def: 'The three-digit number that opens a response: 2xx success, 3xx redirection, 4xx an error in the request, 5xx an error in the server.' },
    { term: 'Header', also: ['HTTP header', 'Content-Type', 'Content-Length'], def: 'A line of the form Name: value that carries information about the message, such as the format of the body or its length.' },
    { term: 'HTTPClient', also: ['requests'], def: 'The Arduino library class (and, in MicroPython, the requests module) with which a program makes HTTP requests and reads the responses.' },
    { term: 'Redirect', also: ['301', '302', 'Location'], def: 'A 3xx response telling the client to ask again at the address in its Location header. Clients follow it only if they are set to.' }
  ],
  choose: {
    good: ['HTTP for occasional requests: fetch a setting, post a reading, call a web service', 'Plain http:// to a server on your own network', 'A service that publishes its API and its limits'],
    avoid: ['HTTP polling every second for something that changes rarely: use MQTT or a WebSocket', 'A new connection for every small message on a battery', 'Reading a large answer into one String'],
    check: ['The time-out, and what your program does while waiting', 'That the status is checked before the body is used', 'Whether the service needs HTTPS, a key or a particular header']
  },
  code: [
    {
      title: 'Fetch a page and check the status',
      about: 'Asks a server for a path, prints the status code and the first part of the answer, and tells a failed call from a bad status.',
      needs: 'Any ESP32-family board with Wi-Fi. Use the address of a server you can reach; example.com stands for it here. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          set [answer v] to (http get [http://example.com/api/status])
          if <(status code) = (200)> then
            print (answer)
          else
            print (join [no good, status: ] (status code))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          HTTPClient http;
          http.setTimeout(5000);                         // ms to wait for the answer
          http.begin("http://example.com/api/status");
          int code = http.GET();
          if (code == HTTP_CODE_OK) {                    // 200
            String body = http.getString();
            Serial.println(body.substring(0, 200));      // the first 200 characters
          } else if (code > 0) {
            Serial.printf("the server said %d\n", code); // an HTTP status
          } else {
            Serial.printf("no answer: %s\n", http.errorToString(code).c_str());   // negative: our side failed
          }
          http.end();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, requests, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        try:
            r = requests.get("http://example.com/api/status", timeout=5)
            if r.status_code == 200:
                print(r.text[:200])                      # the first 200 characters
            else:
                print("the server said", r.status_code)
            r.close()                                    # always close
        except OSError as e:
            print("no answer:", e)
      `,
      output: `
        {"temp":21.5,"unit":"C"}
      `,
      notes: ['A page with 5000 characters is read completely into RAM by getString() and r.text. For larger answers read in pieces: getStream() in Arduino, r.raw.read() in MicroPython.', 'By default a redirect (301, 302) is returned to you as it is. Arduino can follow it after http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS).']
    },
    {
      title: 'HTTP by hand',
      about: 'Opens a TCP connection and writes the request as plain text, then prints everything the server sends back, headers included. It shows that HTTP is nothing but text on a socket.',
      needs: 'Any ESP32-family board with Wi-Fi and a server on port 80; example.com stands for it here.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          open TCP connection to [example.com] port (80) :: net
          send [GET / HTTP/1.1, Host: example.com, Connection: close, then an empty line] :: net
          repeat until <connection closed?> :: net
            print (read from connection) :: net
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          NetworkClient client;
          if (!client.connect("example.com", 80)) {
            Serial.println("connect failed");
            return;
          }
          client.print("GET / HTTP/1.1\r\n");            // request line
          client.print("Host: example.com\r\n");         // header: which site
          client.print("Connection: close\r\n");         // header: hang up afterwards
          client.print("\r\n");                          // the empty line ends the headers
          while (client.connected() || client.available()) {
            if (client.available()) Serial.write(client.read());
          }
          client.stop();
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

        s = socket.socket()
        s.connect(socket.getaddrinfo("example.com", 80)[0][-1])
        s.send(b"GET / HTTP/1.1\r\n")                    # request line
        s.send(b"Host: example.com\r\n")                 # header: which site
        s.send(b"Connection: close\r\n")                 # header: hang up afterwards
        s.send(b"\r\n")                                  # the empty line ends the headers
        while True:
            data = s.recv(512)
            if not data:                                 # empty: the server closed
                break
            print(data.decode(), end="")
        s.close()
      `,
      output: `
        HTTP/1.1 200 OK
        Content-Type: text/html
        Content-Length: 1256
        Connection: close

        <!doctype html>...
      `,
      notes: ['HTTP lines end in carriage return and line feed (\\r\\n). A bare \\n often works, and sometimes does not.', 'In the Python version, a page with non-ASCII bytes can break decode(); print(data) shows the raw bytes instead.']
    }
  ],
  quiz: [
    { q: 'http.GET() returns -11. What happened?', choices: ['The server answered 404', 'The server answered 11', 'The call failed on the ESP\'s side: here, a read time-out', 'The page was empty'], a: 2, why: 'Negative values are HTTPClient errors, not HTTP statuses. -11 is a read time-out: the connection was made but no answer arrived in time. errorToString() gives the words.' },
    { q: 'A request for /api/readings returns status 404. Is the body useful as data?', choices: ['Yes, it is the reading', 'No: the status says the server found nothing at that path; the body is an error page', 'Yes, if it is shorter than 100 bytes', 'Only with a POST'], a: 1, why: 'The status is the server\'s verdict. A 404 page has a body too, but it is the "not found" page: parsing it as a reading gives nonsense or an error.' },
    { q: 'You POST a reading and the server answers 401. What is wrong?', choices: ['The server is down', 'The request needs credentials the ESP did not send', 'The body was too long', 'The ESP\'s clock is wrong'], a: 1, why: '4xx codes say the request was at fault. 401 means "who are you?": a missing or wrong key or password. A server that is down would give a 5xx or no answer at all.' },
    { q: 'The first line of an HTTP response is "HTTP/1.1 302 Found" with a Location header. Without extra settings the ESP\'s client…', choices: ['follows it by itself', 'returns 302 and leaves the following to the program', 'reports a time-out', 'switches to HTTPS'], a: 1, why: 'The Arduino HTTPClient does not follow redirects unless set to. The program sees 302 and can read the Location header, or ask the client to follow.' }
  ],
  applications: [
    'Fetching a setting or a schedule from a server at start-up.',
    'Posting a reading to a logging service or a home server every few minutes.',
    'Calling a web API: weather, public transport times, a currency rate.',
    'Reading the status page of another device on the network, such as a printer, a charger or an inverter.'
  ],
  sources: [
    'IETF RFC 9110, *HTTP Semantics*, and RFC 9112, *HTTP/1.1*.',
    'Arduino core for ESP32 documentation, *HTTPClient* library and its examples (core 3.3).',
    'MicroPython documentation and micropython-lib, the *requests* package (version 1.29).'
  ],
  sim: 'ip-http'
},

/* ================================================================ REST APIs and JSON */
{
  id: 'rest-apis-and-json',
  parent: 'internet-protocols',
  title: 'REST APIs and JSON',
  level: 2,
  short: 'Most web services offer an address for each thing, HTTP methods to act on it, and answers in JSON. The ESP can read and write both ends of that bargain, if it checks the status, checks the parse, and does not try to hold a whole answer in RAM.',
  keywords: ['REST', 'API', 'JSON', 'ArduinoJson', 'JsonDocument', 'deserializeJson', 'serializeJson', 'resource', 'endpoint', 'API key', 'json.loads', 'r.json()', 'filter', 'POST JSON', 'Content-Type', 'rate limit'],
  prereq: ['http-client'],
  related: ['https-and-tls', 'web-server-on-esp', 'webhooks-and-notifications', 'json-on-a-microcontroller', 'data-formats', 'credentials-handling'],
  body: `A **REST API** is a way of offering a service over HTTP so that a small program can use it. Things are named by addresses (**resources**), the HTTP methods say what to do with them, and the answers come back as **JSON**. Weather services, home-automation hubs, loggers and the ESP's own web server all work this way, and the ESP is comfortable at either end.

### Resources and methods

An address names a thing, never an action: \`/api/readings\` is the collection of readings, \`/api/readings/42\` is one of them. The method is the verb:

| Request | Meaning | Usual answer |
|---|---|---|
| \`GET /api/readings/42\` | read it | 200 and the JSON |
| \`POST /api/readings\` | add one; the JSON is in the body | 201 Created |
| \`PUT /api/settings\` | replace the settings | 200 or 204 |
| \`DELETE /api/readings/42\` | remove it | 204 No Content |

The server keeps no memory of you between requests, so each one carries what it needs, often a key or token in a header. The simulation shows the exchange for a read and for a post.

### JSON in a minute

JSON is text with only a few shapes: an **object** \`{"temp":21.5,"unit":"C"}\` (names with values), an **array** \`[1,2,3]\`, a **string** in double quotes, a **number**, \`true\` or \`false\`, and \`null\`. Names are always in double quotes, there are no comments, and a number has no type: 21 and 21.0 are the same. It is wordy, since a float costs several characters, not four bytes. Both sides can read it, and that is why it won.

### JSON on the ESP

In Arduino the usual library is **ArduinoJson**, version 7. A \`JsonDocument\` holds the parsed tree, \`deserializeJson()\` fills it and returns an error that you must test, \`serializeJson()\` writes one out. Read with a default, so that a missing field cannot do harm: \`doc["temp"] | -99.0\`. MicroPython needs nothing extra: \`json.loads()\`, \`json.dumps()\` and \`r.json()\`.

A real service may send kilobytes when you want two numbers. A document that holds all of it can use up the RAM, so ask the service for fewer fields if it lets you, or give the parser a **filter** that keeps only the names you list. [[json-on-a-microcontroller]] goes into memory; [[data-formats]] shows the compact alternatives for when the bytes matter.

### Using an API safely

A key in the address or a header is a password: keep it out of shared code ([[credentials-handling]]). Check the status code, then the parse result, before you trust a single value. Expect fields to be missing, to be null, or to change type, and respect the service's rate limit.

> [!key] A REST API names things by address, acts on them with HTTP methods and speaks JSON. On the ESP, check the status, check the parse, read every field with a default, and keep large answers out of RAM with a filter.`,
  ideas: [
    'A REST address names a thing (a resource); the HTTP method says what to do with it, and the status code says how it went.',
    'JSON has objects, arrays, strings, numbers, true, false and null: readable on both sides, but wordy.',
    'ArduinoJson 7 uses one JsonDocument; always test the result of deserializeJson and read fields with a default.',
    'A large response should be filtered while it is parsed, or asked for with fewer fields, so that it does not fill the RAM.'
  ],
  pitfalls: [
    'If the JSON parsed, the field is there — Parsing only proves the text is valid JSON. A field can still be missing, null or a different type, so read each one with a default.',
    'A big JSON answer just needs a bigger document — On a chip with a few hundred kilobytes of RAM, a 40 KB answer can crowd out everything else and fragment the heap. Filter it, or ask for less.',
    'POST always means create — POST means "here is something: act on it". Whether that creates a record, triggers a job or sends a message is the service\'s own rule; read its documentation.'
  ],
  terms: [
    { term: 'REST', also: ['RESTful', 'REST API', 'web API'], def: 'A style of web service in which things have addresses (resources), HTTP methods act on them, and each request stands alone. Its answers are usually JSON.' },
    { term: 'JSON', also: ['JavaScript Object Notation'], def: 'A text format made of objects, arrays, strings, numbers, true, false and null. It is easy for people and programs to read, and larger than a binary format.' },
    { term: 'Endpoint', also: ['route', 'resource'], def: 'One address of an API, such as /api/readings, together with the methods it accepts.' },
    { term: 'ArduinoJson', also: ['JsonDocument'], def: 'The common Arduino library for reading and writing JSON. Version 7 has a single JsonDocument type that grows as needed, and can filter what it keeps while parsing.' },
    { term: 'API key', also: ['access token', 'bearer token'], def: 'A secret string that identifies the caller of a service, sent in a header or in the address. It works like a password and must be kept out of shared code.' }
  ],
  choose: {
    good: ['A REST API for occasional exchanges with a server: settings, readings, commands', 'JSON when people or other programs must read it too', 'A filter or a field list to keep answers small'],
    avoid: ['REST polling for values that change often: use MQTT or a WebSocket', 'JSON for thousands of numbers a second: use a binary format', 'A secret key typed into code that is shared or published'],
    check: ['What the service does when you exceed its limit', 'How much RAM the largest answer needs while it is parsed', 'What your program does when a field is missing or null']
  },
  code: [
    {
      title: 'Read two values from a JSON answer',
      about: 'Asks a server on the home network for its status, which is a small JSON object, and prints the temperature and unit. A missing field gets a default, and a parse error is reported.',
      needs: 'Any ESP32-family board with Wi-Fi and the ArduinoJson library. The server address is an example: use a service of your own, or any address that returns {"temp":21.5,"unit":"C"}.',
      libs: ['ArduinoJson'],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          set [answer v] to (http get [http://192.168.1.10:8080/api/status])
          if <(status code) = (200)> then
            set [data v] to (parse JSON (answer)) :: operators
            print (join [temp: ] (field [temp] of (data) or (-99)))
            print (join [unit: ] (field [unit] of (data) or [?]))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <ArduinoJson.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          HTTPClient http;
          http.begin("http://192.168.1.10:8080/api/status");
          if (http.GET() == HTTP_CODE_OK) {
            JsonDocument doc;                              // version 7: one type, no size
            DeserializationError err = deserializeJson(doc, http.getString());
            if (err) {
              Serial.println(err.c_str());                 // not valid JSON
            } else {
              float temp = doc["temp"] | -99.0;            // -99 when the field is missing
              const char *unit = doc["unit"] | "?";
              Serial.printf("temp: %.1f\n", temp);
              Serial.printf("unit: %s\n", unit);
            }
          }
          http.end();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, requests, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        r = requests.get("http://192.168.1.10:8080/api/status", timeout=10)
        if r.status_code == 200:
            try:
                data = r.json()
                print("temp:", data.get("temp", -99.0))    # -99 when the field is missing
                print("unit:", data.get("unit", "?"))
            except ValueError:
                print("not valid JSON")
        r.close()
      `,
      output: `
        temp: 21.5
        unit: C
      `,
      notes: ['For a big answer, tell ArduinoJson what to keep: JsonDocument filter; filter["temp"] = true; deserializeJson(doc, http.getStream(), DeserializationOption::Filter(filter)). (If the server sends the answer in chunks, call http.useHTTP10(true) before using the stream.)', 'The older StaticJsonDocument and DynamicJsonDocument of version 6 still compile in version 7 but are deprecated.']
    },
    {
      title: 'Post a reading as JSON',
      about: 'Builds a small JSON object, sends it with POST and a Content-Type header, and prints the status. A 201 means the server created the record.',
      needs: 'Any ESP32-family board with Wi-Fi and the ArduinoJson library; a server that accepts POST at the address shown (change it to yours).',
      libs: ['ArduinoJson'],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          set [body v] to (to JSON [sensor] is [esp32] and [temp] is (21.5)) :: operators
          http post (body) to [http://192.168.1.10:8080/api/readings]
          print (join [status: ] (status code))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <ArduinoJson.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          JsonDocument doc;
          doc["sensor"] = "esp32";
          doc["temp"] = 21.5;
          String body;
          serializeJson(doc, body);                        // {"sensor":"esp32","temp":21.5}

          HTTPClient http;
          http.begin("http://192.168.1.10:8080/api/readings");
          http.addHeader("Content-Type", "application/json");
          int code = http.POST(body);
          Serial.printf("status: %d\n", code);             // 201 Created, if the server agrees
          http.end();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, requests, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        r = requests.post("http://192.168.1.10:8080/api/readings",
                          json={"sensor": "esp32", "temp": 21.5})   # json= also sets Content-Type
        print("status:", r.status_code)                  # 201 Created, if the server agrees
        r.close()
      `,
      output: `
        status: 201
      `,
      notes: ['This is plain HTTP, fine on your own network. To a service on the internet use HTTPS ([[https-and-tls]]), and do not put the service\'s key in code you share.']
    }
  ],
  quiz: [
    { q: 'Which request would a well-designed API use to delete reading number 42?', choices: ['GET /api/deleteReading?id=42', 'POST /api/readings/delete', 'DELETE /api/readings/42', 'PUT /api/readings/42/removed'], a: 2, why: 'The address names the thing (reading 42) and the method gives the verb. A GET that deletes is the worst choice: a crawler or a pre-fetching browser could trigger it.' },
    { q: 'deserializeJson() returned no error and doc["temp"] | -99.0 gave -99. What does that tell you?', choices: ['The parse failed', 'The text was valid JSON but had no usable "temp" field', 'The ESP ran out of memory', 'The server returned 404'], a: 1, why: 'The error code only covers the syntax and the memory. The default (-99) was used because the field was missing, null or of another type: valid JSON does not promise the field you wanted.' },
    { q: 'The JSON {"sensor":"esp32","temp":21.5} is how many bytes, and what is the main cost of such a format?', choices: ['5 bytes; none', '30 bytes; wordiness compared with a binary format', '30 bytes; it cannot hold decimals', '64 bytes; it must be compressed'], a: 1, why: 'Counting every character, brace, quote and colon gives 30 bytes for what a binary format could hold in about 5. The price of readability is size.' },
    { q: 'A 40 KB weather answer is needed only for its temperature. What is the sound approach on an ESP?', choices: ['Parse it all in one JsonDocument', 'Ask for fewer fields, or parse with a filter that keeps only the temperature', 'Increase the baud rate', 'Switch to UDP'], a: 1, why: 'Holding the whole tree needs RAM several times the text size. A filter keeps just the named fields while the text streams past.' }
  ],
  applications: [
    'Posting readings to a logging service or a home server, and fetching settings from it.',
    'Calling web APIs for weather, transport times, prices or calendar events to show on a display.',
    'Talking to local devices that expose a REST interface: smart plugs, inverters, chargers, other ESP boards.',
    'The interface behind a browser-based control page served by the ESP itself ([[web-server-on-esp]]).'
  ],
  sources: [
    'IETF RFC 8259, *The JavaScript Object Notation (JSON) Data Interchange Format*, and RFC 9110, *HTTP Semantics*.',
    'B. Blanchon, *ArduinoJson documentation* (version 7): JsonDocument, deserializeJson, filtering.',
    'MicroPython documentation, the *json* module and the *requests* package (version 1.29).'
  ],
  sim: { id: 'ip-http', params: { preset: 'rest' } }
},

/* ================================================================ HTTPS and TLS */
{
  id: 'https-and-tls',
  parent: 'internet-protocols',
  title: 'HTTPS and TLS',
  level: 2,
  short: 'TLS puts a conversation in an encrypted envelope and lets the device check who it is talking to. For that check the ESP needs a trusted root certificate and the right time, and the shortcut that skips it removes the point of using TLS.',
  keywords: ['HTTPS', 'TLS', 'SSL', 'certificate', 'root certificate', 'CA', 'setCACert', 'setInsecure', 'NetworkClientSecure', 'CA bundle', 'handshake', 'port 443', 'port 8883', 'clock', 'expired', 'ssl module', 'CERT_REQUIRED', 'SNI'],
  prereq: ['http-client', 'sockets'],
  related: ['ntp-and-time', 'tls-on-esp', 'certificates-and-root-cas', 'mutual-tls', 'mqtt', 'credentials-handling', 'network-troubleshooting'],
  body: `Plain HTTP and plain MQTT travel in the open: anyone on the path can read a password or change a value. **TLS** wraps the same conversation in encryption and, the part people forget, lets the device check *who it is talking to*. HTTPS is HTTP inside TLS (port 443); MQTT on port 8883 is MQTT inside TLS.

### What the handshake gives

Before any data flows the two sides agree on keys; the simulation plays it. The server sends its **certificate**: a document that names it (\`example.com\`), carries its public key and is signed by a **certificate authority** (CA). The ESP then checks that

1. the chain of signatures ends at a **root certificate** that the ESP already trusts,
2. the name in the certificate is the name it asked for,
3. the certificate is inside its dates **according to the ESP's own clock**.

Only if all pass is the server trusted. Then keys are agreed and all that follows is encrypted and protected against tampering.

### What the device must have

- **A root certificate to trust.** Either one stored in the program (the root of the server's chain, not the short-lived certificate of the site itself), or a bundle of the usual public roots. Site certificates are renewed every few months, roots last for years: trusting the root survives a renewal, trusting the site's own certificate does not. Roots expire too, so a long-lived device needs an update path ([[certificates-and-root-cas]]).
- **The right time.** A device that has just powered on believes it is 1970, and every real certificate then looks "not yet valid". Set the clock first ([[ntp-and-time]]).
- **Memory and time.** A TLS connection needs tens of kilobytes of RAM for its buffers, and the handshake takes about a second with the radio on. Reuse an open connection rather than opening one per message.

### The shortcut that undoes it

Every library offers a way to skip the check: \`setInsecure()\` in Arduino, and MicroPython's \`requests\` does not verify the server at all. The traffic is still encrypted, but to *whoever answers*: a person on the same network can pose as the server and read everything. Fine for a five-minute experiment, and nowhere else.

### When it fails

| What the error says | Usual cause |
|---|---|
| certificate not yet valid, or expired | the clock is wrong (or the certificate really expired) |
| unknown CA, or verification failed | the root is missing or is not the root of this server |
| name mismatch | connecting by IP address, or by another name than the certificate lists |
| the handshake times out | a block on port 443, or too little RAM to start |

[[tls-on-esp]] goes deeper into the options on the chip; [[mutual-tls]] has the device prove its identity too.

> [!key] TLS encrypts and, if the device checks the certificate chain, the name and the dates, also authenticates the server. The ESP needs a trusted root and a correct clock; \`setInsecure()\` throws away the authentication and leaves only an encrypted line to an unknown party.`,
  ideas: [
    'TLS gives encryption, protection against tampering and, through certificates, a check of who the server is.',
    'The device checks the chain of signatures to a trusted root, the name, and the dates against its own clock.',
    'A device that has just started has no time, so it must set its clock before a TLS connection can succeed.',
    'Skipping verification (setInsecure, or MicroPython\'s requests) keeps the encryption but lets anyone pose as the server.'
  ],
  pitfalls: [
    'HTTPS means it is secure — Only if the certificate is checked. A client that accepts any certificate is encrypted to an impostor as happily as to the real server.',
    'I should pin the server\'s own certificate for extra safety — Site certificates are renewed every few months, so the device would stop working. Pin the root (or an intermediate), and plan to update it before it expires.',
    'Certificate errors are about certificates — Very often they are about the clock. "Not yet valid" on a freshly started device is the signature of a missing time sync.'
  ],
  terms: [
    { term: 'TLS', also: ['SSL', 'Transport Layer Security'], def: 'The protocol that encrypts a TCP connection and authenticates the server by its certificate. HTTPS and MQTT on port 8883 are protocols running inside it.' },
    { term: 'Certificate', also: ['X.509', 'server certificate'], def: 'A signed document that binds a name (such as example.com) to a public key. A client trusts it if the signature chain leads to a root it knows.' },
    { term: 'Root certificate', also: ['CA certificate', 'trust anchor', 'CA bundle'], def: 'The self-signed certificate of a certificate authority, stored in the device. Everything the CA signs, directly or through intermediates, is trusted.' },
    { term: 'Certificate authority', also: ['CA'], def: 'An organisation that checks who owns a name and signs a certificate saying so. Browsers and devices carry a list of the roots of the CAs they trust.' },
    { term: 'Handshake', also: ['TLS handshake'], def: 'The opening exchange of a TLS connection, in which the server proves its identity and both sides agree on the keys for the rest of the session.' },
    { term: 'setInsecure', also: ['no certificate check', 'CERT_NONE'], def: 'The option that makes a client accept any certificate. The connection is encrypted but not authenticated: it is only fit for throw-away tests.' }
  ],
  choose: {
    good: ['HTTPS with the root certificate stored in the program, for services that change their site certificate often', 'A bundle of public roots when the device talks to several unrelated services', 'The clock set by SNTP before the first connection'],
    avoid: ['setInsecure() or CERT_NONE anywhere a password, key or command travels', 'Pinning a site\'s own, short-lived certificate', 'A root stored once with no way to replace it in ten years'],
    check: ['That the clock is valid before every first connection after power-up', 'When the stored root certificate expires', 'How much RAM is free when the handshake starts']
  },
  code: [
    {
      title: 'HTTPS with the certificate checked',
      about: 'Sets the clock first, then makes an HTTPS request with the server\'s root certificate stored in the program, so that the connection is encrypted and the server is verified.',
      needs: 'Any ESP32-family board with Wi-Fi. Paste the PEM text of your server\'s root certificate where the program says so (MicroPython: save it as root_ca.der on the board). Do not leave real credentials in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          trust the root certificate [root_ca] :: security
          set [answer v] to (https get [https://example.com/])
          print (status code)
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include <NetworkClientSecure.h>
        #include <HTTPClient.h>

        const char ROOT_CA[] =
          "-----BEGIN CERTIFICATE-----\n"
          "paste the root certificate of your server here, one quoted line per row\n"
          "-----END CERTIFICATE-----\n";

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          configTime(0, 0, "pool.ntp.org");               // the clock first: certificates have dates
          struct tm t;
          if (!getLocalTime(&t, 10000)) {
            Serial.println("no time, so no HTTPS");
            return;
          }

          NetworkClientSecure client;
          client.setCACert(ROOT_CA);                      // verify the server against this root
          HTTPClient http;
          if (http.begin(client, "https://example.com/")) {
            int code = http.GET();
            Serial.println(code > 0 ? String(code) : http.errorToString(code));
            http.end();
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import network, ntptime, socket, ssl, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        ntptime.settime()                                  # the clock first: certificates have dates

        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.verify_mode = ssl.CERT_REQUIRED                # verify the server
        ctx.load_verify_locations(cadata=open("root_ca.der", "rb").read())

        s = socket.socket()
        s.connect(socket.getaddrinfo("example.com", 443)[0][-1])
        s = ctx.wrap_socket(s, server_hostname="example.com")   # the name is checked too
        s.write(b"GET / HTTP/1.0\r\nHost: example.com\r\n\r\n")
        print(s.read(200))
        s.close()
      `,
      output: `
        200
      `,
      notes: ['Arduino core 3.3.12 added useBuiltinCACertBundle() on NetworkClientSecure, which trusts a built-in bundle of public roots instead of one stored root.', 'MicroPython\'s requests module over https does not verify the certificate. The ssl version above does, and was written from the documentation, not run on hardware: test it with your server.', 'If the time cannot be set the program stops on purpose: without a clock the check would fail anyway.']
    }
  ],
  quiz: [
    { q: 'A freshly powered ESP gets "certificate not yet valid" from a correct server whose root it holds. What is the cause?', choices: ['The root is wrong', 'The ESP does not know the date yet, so every certificate looks like it starts in the future', 'The server has no certificate', 'The port must be 8883'], a: 1, why: 'Without a time sync the clock starts at 1970. A certificate\'s start date is then in the future. Setting the clock first cures it.' },
    { q: 'What does setInsecure() leave unprotected?', choices: ['The privacy of the data on the line', 'The identity of the server: anyone can pose as it', 'The port number', 'The clock'], a: 1, why: 'The data is still encrypted, but the client no longer checks the certificate, so it cannot tell the real server from an impostor on the same network.' },
    { q: 'Which is the better thing to store in a device meant to last for years: the site\'s certificate or the CA\'s root?', choices: ['The site\'s certificate: it is the most specific', 'The CA\'s root: site certificates are renewed every few months, roots last for years', 'Neither: store the password instead', 'Both are renewed together'], a: 1, why: 'A stored site certificate would stop matching at the next renewal. The root changes rarely, though it too has an end date that the update plan must cover.' },
    { q: 'MicroPython\'s requests.get("https://…") checks the server\'s certificate.', a: false, why: 'The module builds its context without verification. To verify, use the ssl module with CERT_REQUIRED and a root certificate, as in the program above.' }
  ],
  applications: [
    'Every call to a public web API or messaging service, all of which accept only HTTPS.',
    'MQTT to a cloud broker on port 8883, with the same root-and-clock requirements.',
    'Downloading firmware updates over HTTPS, where verifying the server matters most ([[ota-from-a-server]]).',
    'Posting alerts to a chat service ([[webhooks-and-notifications]]).'
  ],
  sources: [
    'IETF RFC 8446, *The Transport Layer Security (TLS) Protocol Version 1.3*, and RFC 5280, *Internet X.509 Public Key Infrastructure Certificate and CRL Profile*.',
    'Arduino core for ESP32 documentation, the *NetworkClientSecure* library and its examples (core 3.3).',
    'MicroPython documentation, the *ssl* module (version 1.29).'
  ],
  sim: 'ip-tls'
},

/* ================================================================ a web server on the ESP */
{
  id: 'web-server-on-esp',
  parent: 'internet-protocols',
  title: 'A web server on the ESP',
  level: 2,
  short: 'Turn the arrangement round: the ESP waits at its own address and a phone or laptop asks it for a page, a measurement or a switch. A few lines give it a control panel — but a simple server handles one request at a time, and it has no lock on the door.',
  keywords: ['web server', 'WebServer', 'ESPAsyncWebServer', 'AsyncWebServer', 'handleClient', 'route', 'handler', 'GET', 'POST', 'form', 'query string', 'serveStatic', 'LittleFS', 'asyncio', 'microdot', 'favicon', 'control page', 'esp32.local'],
  prereq: ['http-client', 'sockets', 'rest-apis-and-json'],
  related: ['mdns', 'websockets', 'web-interface-security', 'embedding-files-and-web-pages', 'littlefs-and-file-systems', 'asyncio-in-micropython', 'soft-ap-and-captive-portal'],
  body: `So far the ESP has been the client. A **web server** turns that round: the ESP waits at its own address, and any browser on the network, a phone or a laptop, can ask it for a page, read its measurements or press a switch on it. No app, no cloud, nothing to install.

### How a request is handled

The server listens on port 80. When a request arrives it looks at the **path** (\`/\`, \`/status\`, \`/led\`) and runs the **handler** you registered for that path. The handler builds the answer, which is HTML, JSON or a file, and sends it with a status. A path with no handler gets 404. Parameters travel in the address (\`/led?state=1\`) or, for a form, in the body of a POST. The simulation shows a browser's request and the ESP's answer.

### Two ways to run it

- **The built-in \`WebServer\`** of the Arduino core is small and simple, and **polled**: your \`loop()\` must call \`handleClient()\` often, and one request is handled at a time. A handler that needs two seconds holds up everything, including the next request.
- **An asynchronous server**, the maintained *ESPAsyncWebServer* of the ESP32Async group with its AsyncTCP, answers from the network task. \`loop()\` stays free and several clients are served together; the price is that callbacks must be short and must never wait. (The original me-no-dev repositories are not maintained any more, and ESPAsyncWebServer there is archived: use the ESP32Async ones.)

In MicroPython the same two styles are plain blocking sockets and \`asyncio\` ([[asyncio-in-micropython]]); the microdot framework adds routes and JSON on top.

### Pages, files and memory

A page built as a text string in the code is fine for ten lines. A real interface lives in files on the flash file system ([[littlefs-and-file-systems]]) or is embedded in the firmware ([[embedding-files-and-web-pages]]), and is served as it is. The page then asks small JSON endpoints such as \`/status\` for its values, the pattern of [[rest-apis-and-json]]. Building big strings piece by piece also fragments the heap. Browsers will ask for \`/favicon.ico\` too; the 404 they get does no harm.

### Keep it on the home network

An ESP web server has no login unless you add one. Anything that changes something should be a POST rather than a link, because a pre-fetching browser or a crawler can follow a link. Never forward the port to the internet: see [[web-interface-security]]. For access from outside, have the device call out ([[mqtt]]). To reach it by name instead of by number, use [[mdns]] (\`esp32.local\`).

> [!key] A web server is a table of paths and handlers. The built-in one is simple and handles one request at a time, the asynchronous one keeps the loop free; both are for the home network, so give changes a POST, add a password if it matters, and never open the port to the internet.`,
  ideas: [
    'A web server maps paths to handlers; a path with no handler gets a 404.',
    'The built-in WebServer is polled and serves one request at a time; the asynchronous one answers from the network task.',
    'Serve the interface from files and let it fetch values as JSON, rather than building pages as strings.',
    'The server has no login by default and is meant for the local network; do not forward its port to the internet.'
  ],
  pitfalls: [
    'A handler can take as long as it likes — On the simple server a slow handler blocks every other request and your loop; on the asynchronous one it blocks the network task. Keep handlers short and do slow work elsewhere.',
    'A link that switches something on is fine — Browsers pre-fetch links and crawlers follow them, so a GET can fire by accident. Use POST for actions and GET only to read.',
    'It is only my home network, so no password is needed — Anyone on the Wi-Fi, a guest or a compromised phone, can use the page. Add a password for anything that matters, and keep the device off the internet.'
  ],
  terms: [
    { term: 'Route', also: ['handler', 'endpoint'], def: 'A path (such as /status) together with the function that answers requests for it. The server looks up the path of each request in its table of routes.' },
    { term: 'Query string', also: ['request parameter', 'GET parameter'], def: 'The part of an address after the question mark, such as state=1 in /led?state=1. It carries parameters to the handler.' },
    { term: 'Asynchronous server', also: ['AsyncWebServer', 'ESPAsyncWebServer'], def: 'A server that answers from the network task through callbacks, so that the main loop stays free. Its callbacks must be short and must not wait.' },
    { term: 'Polled server', also: ['WebServer', 'handleClient'], def: 'A server driven from the main loop: the program calls handleClient() often, and each call serves what has arrived, one request at a time.' },
    { term: 'Static file', also: ['serveStatic'], def: 'A file served exactly as stored, such as an HTML page or an image, from the flash file system or the firmware, as opposed to one built by a handler.' }
  ],
  choose: {
    good: ['The built-in WebServer for a page or two and a few commands', 'The asynchronous server when the loop must stay free or several browsers connect at once', 'Files in the flash file system, with JSON endpoints, for a real interface'],
    avoid: ['Long work inside a handler', 'Actions behind plain links', 'Forwarding the port on the router so that "I can control it from anywhere"'],
    check: ['What a second browser does while the first request runs', 'Whether every state-changing route needs a password', 'How much heap is left once pages and clients are in use']
  },
  code: [
    {
      title: 'A page, an LED switch and a status',
      about: 'Serves three paths: a page with two links, /led?state=1 or 0 to switch the LED, and /status as JSON. Anything else gets a 404. Open the address printed on the serial monitor in a browser.',
      needs: 'An ESP32 DevKit with the LED on GPIO2 (or an LED with a 220 Ω resistor from GPIO2 to GND, see [[leds]]). Do not leave the real name and password in shared code ([[credentials-handling]]).',
      wiring: [['GPIO2', 'on-board LED', 'or 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          print (IP address)
          start web server on port (80)

        when request for [/] arrives
          reply (200) with [a page with two links]

        when request for [/led] arrives
          set pin (2) to (parameter [state])
          reply (200) with [{"ok":true}]

        when request for [/status] arrives
          reply (200) with (join [{"led":] (read pin (2)) [}])
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>

        const int LED = 2;
        WebServer server(80);

        void handleRoot() {
          server.send(200, "text/html",
            "<h1>ESP32</h1><p><a href='/led?state=1'>LED on</a> | <a href='/led?state=0'>LED off</a></p>");
        }

        void handleLed() {
          digitalWrite(LED, server.arg("state") == "1");      // /led?state=1
          server.send(200, "application/json", "{\"ok\":true}");
        }

        void handleStatus() {
          String json = "{\"led\":" + String(digitalRead(LED)) + ",\"uptime_s\":" + String(millis() / 1000) + "}";
          server.send(200, "application/json", json);
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());
          server.on("/", handleRoot);
          server.on("/led", HTTP_GET, handleLed);
          server.on("/status", handleStatus);
          server.onNotFound([]() { server.send(404, "text/plain", "not found"); });
          server.begin();
        }

        void loop() {
          server.handleClient();                              // must run often: no long delay() here
        }
      `,
      py: String.raw`
        import network, socket, time
        from machine import Pin

        led = Pin(2, Pin.OUT)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        s = socket.socket()
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(("0.0.0.0", 80))
        s.listen(2)
        print("open http://" + wlan.ipconfig("addr4")[0] + "/")

        def respond(cl, status, ctype, body):
            cl.send(("HTTP/1.0 %s\r\nContent-Type: %s\r\n\r\n%s" % (status, ctype, body)).encode())

        while True:
            cl, addr = s.accept()
            request = cl.recv(1024).decode()
            path = request.split(" ")[1] if " " in request else "/"
            if path == "/":
                respond(cl, "200 OK", "text/html", "<h1>ESP32</h1><p><a href='/led?state=1'>LED on</a> | <a href='/led?state=0'>LED off</a></p>")
            elif path.startswith("/led"):
                led.value(1 if "state=1" in path else 0)
                respond(cl, "200 OK", "application/json", '{"ok":true}')
            elif path == "/status":
                respond(cl, "200 OK", "application/json", '{"led":%d,"uptime_s":%d}' % (led.value(), time.ticks_ms() // 1000))
            else:
                respond(cl, "404 Not Found", "text/plain", "not found")
            cl.close()
      `,
      output: `
        192.168.1.57
      `,
      notes: ['GPIO2 is a strapping pin on the ESP32. The usual on-board LED does not disturb it, but check an LED that you wire yourself ([[strapping-pins]]).', 'Core 3.3.12 hardened the built-in server with limits on the length of the address and the headers, so very long requests are refused with an error status.']
    },
    {
      title: 'The same server, without blocking the loop',
      about: 'The same three paths on an asynchronous server. The loop has nothing to do: the answers come from the network task, so the loop is free for the rest of the program.',
      needs: 'An ESP32 DevKit as before, with the ESP Async WebServer and Async TCP libraries from the ESP32Async group. MicroPython uses asyncio instead.',
      libs: ['ESP Async WebServer (ESP32Async)', 'Async TCP (ESP32Async)'],
      wiring: [['GPIO2', 'on-board LED', 'or 220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          start web server on port (80)

        when request for [/led] arrives
          set pin (2) to (parameter [state])
          reply (200) with [{"ok":true}]

        forever
          do the other work, the server answers by itself :: my
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <AsyncTCP.h>
        #include <ESPAsyncWebServer.h>

        const int LED = 2;
        AsyncWebServer server(80);

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());

          server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
            request->send(200, "text/html", "<h1>ESP32</h1><p><a href='/led?state=1'>LED on</a> | <a href='/led?state=0'>LED off</a></p>");
          });
          server.on("/led", HTTP_GET, [](AsyncWebServerRequest *request) {
            if (request->hasParam("state")) digitalWrite(LED, request->getParam("state")->value() == "1");
            request->send(200, "application/json", "{\"ok\":true}");
          });
          server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
            request->send(200, "application/json", String("{\"led\":") + digitalRead(LED) + "}");
          });
          server.onNotFound([](AsyncWebServerRequest *request) { request->send(404, "text/plain", "not found"); });
          server.begin();
        }

        void loop() {
          // nothing to do: requests are answered by the network task
        }
      `,
      py: String.raw`
        import asyncio, network, time
        from machine import Pin

        led = Pin(2, Pin.OUT)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        async def handle(reader, writer):
            request_line = (await reader.readline()).decode()
            while True:                                   # skip the headers
                line = await reader.readline()
                if line in (b"\r\n", b""):
                    break
            path = request_line.split(" ")[1] if " " in request_line else "/"
            if path == "/":
                status, ctype, body = "200 OK", "text/html", "<h1>ESP32</h1><p><a href='/led?state=1'>LED on</a> | <a href='/led?state=0'>LED off</a></p>"
            elif path.startswith("/led"):
                led.value(1 if "state=1" in path else 0)
                status, ctype, body = "200 OK", "application/json", '{"ok":true}'
            elif path == "/status":
                status, ctype, body = "200 OK", "application/json", '{"led":%d}' % led.value()
            else:
                status, ctype, body = "404 Not Found", "text/plain", "not found"
            writer.write(("HTTP/1.0 %s\r\nContent-Type: %s\r\n\r\n%s" % (status, ctype, body)).encode())
            await writer.drain()
            writer.close()
            await writer.wait_closed()

        async def main():
            await asyncio.start_server(handle, "0.0.0.0", 80)
            while True:
                await asyncio.sleep(1)                    # other tasks run here

        asyncio.run(main())
      `,
      notes: ['Inside the asynchronous callbacks do not use delay() and do not wait for anything slow; do not print a lot to the serial port either.', 'The original me-no-dev versions of these libraries are not maintained any more; install the ESP32Async ones.']
    }
  ],
  quiz: [
    { q: 'With the built-in WebServer, one handler calls delay(3000). A second browser asks for the status page during that time. What happens?', choices: ['It is answered at once', 'It waits until the first handler is done', 'It gets a 404', 'The ESP restarts'], a: 1, why: 'The polled server handles one request at a time from loop(). The second request waits in the network buffers until the delay ends.' },
    { q: 'Why should "switch the output" be a POST rather than a link to /led?state=1?', choices: ['POST is faster', 'A browser may pre-fetch a link and a crawler follows links, so a GET can fire by accident', 'GET cannot carry parameters', 'POST is encrypted'], a: 1, why: 'GET is meant to read without side effects. A link that acts can be triggered by a pre-fetch, a crawler or a mistyped address.' },
    { q: 'A phone on the same Wi-Fi opens http://esp32.local/ and nothing loads, but the numeric address works. What is the most likely cause?', choices: ['The server is down', 'The network does not pass the multicast that name lookup uses, or the phone cannot do it', 'The page is too long', 'Port 80 is closed'], a: 1, why: 'The server works, since the numeric address answers. The name is found by mDNS, which a guest network, an extender or the phone may not support ([[mdns]]).' },
    { q: 'Forwarding the ESP\'s port 80 on the router so you can reach it from outside is a good way to get remote control.', a: false, why: 'The device would be open to the whole internet with no login and little defence. Let it call out to a broker or a service instead ([[web-interface-security]]).' }
  ],
  applications: [
    'A set-up page for Wi-Fi credentials and settings ([[soft-ap-and-captive-portal]]).',
    'A local dashboard or control panel for a sensor, a fan or a lamp, opened from any phone on the network.',
    'A JSON status endpoint that another program, or a home-automation system, polls.',
    'A page that lets the owner download the logged data or upload a new firmware file.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, the *WebServer* library and its examples, and the 3.3 migration note on hardening.',
    'The ESPAsyncWebServer documentation of the ESP32Async project.',
    'MicroPython documentation, the *socket* and *asyncio* modules (version 1.29).'
  ],
  sim: { id: 'ip-http', params: { preset: 'server' } }
},

/* ================================================================ WebSockets */
{
  id: 'websockets',
  parent: 'internet-protocols',
  title: 'WebSockets',
  level: 2,
  short: 'HTTP lets only the client speak first, so a live display has to keep asking. A WebSocket keeps one connection open after an HTTP handshake, and either side can send a small message at any moment: the natural way to push readings to a page.',
  keywords: ['WebSocket', 'ws://', 'wss://', 'push', 'polling', 'live data', 'Upgrade', '101 Switching Protocols', 'AsyncWebSocket', 'textAll', 'ping', 'pong', 'frame', 'Server-Sent Events', 'SSE', 'real time', 'dashboard'],
  prereq: ['http-client', 'web-server-on-esp'],
  related: ['mqtt', 'rest-apis-and-json', 'web-interface-security', 'web-ui-as-a-display', 'sockets', 'dashboards'],
  body: `HTTP has a rule that frustrates live displays: the client asks, the server answers, and the server may never speak first. To show a value that changes, a page has to keep asking, which is called **polling**, and most of the answers say "nothing new". A **WebSocket** removes the rule. It starts as an ordinary HTTP request that asks to *upgrade*, and if the server agrees the same TCP connection stays open and carries small **messages in both directions**, whenever either side has something to say.

### The opening and the frames

~~~text
GET /ws HTTP/1.1
Host: esp32.local
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: (a random value)

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: (derived from the key)
~~~

After that, data travels in **frames**. The header is only 2 bytes for a short message from the server (a browser's frames carry a 4-byte mask as well, so 6), followed by the payload, text or binary. Ping and pong frames ask "are you still there?", and a close frame ends the session politely. The address begins \`ws://\`, or \`wss://\` when it runs inside TLS.

### What it is for on an ESP

The ESP serves a page, the page opens a WebSocket back to the ESP, and from then on the ESP **pushes** each new reading as it happens: a live graph, a level, a counter, with a delay of milliseconds and a few bytes per update. The same connection carries commands the other way, from a slider, a joystick or a button. The simulation sets polling against push: watch the bytes, and how late a polled value arrives.

### Costs and care

Each open WebSocket is a TCP connection with a socket and buffers, so an ESP serves only a handful of clients at once; plan for that, and drop the oldest when a new one arrives. Connections die silently when a phone sleeps or the Wi-Fi drops, so use ping, clean up dead clients, and let the page reconnect by itself. Like the page that opened it, a WebSocket has no password unless you add one, so keep it on the local network ([[web-interface-security]]).

### Alternatives

For one-way live data, **Server-Sent Events** push text over an ordinary HTTP response and the browser reconnects by itself; the asynchronous server supports them. For data going to many destinations, MQTT is the better road, and a browser can speak it over a WebSocket too ([[mqtt]]).

> [!key] A WebSocket upgrades an HTTP connection into a two-way message channel, so the ESP can push readings the instant they change and the page can send commands back, with a few bytes of overhead. Count the clients, ping the connection and keep it on the home network.`,
  ideas: [
    'A WebSocket begins as an HTTP request with an Upgrade header, and a 101 answer turns the connection into a two-way channel.',
    'Messages are small frames with a header of only a few bytes, sent by either side at any time.',
    'Push beats polling for live data: no empty requests, and the delay is the network\'s, not the polling interval\'s.',
    'Each client holds a socket and buffers, so an ESP serves few; dead clients must be detected and removed.'
  ],
  pitfalls: [
    'A WebSocket is a different network, faster than HTTP — It runs over the same TCP connection, after an HTTP handshake. What it saves is the repeated requests and headers, not the network\'s speed.',
    'Once connected, it stays connected — Phones sleep, Wi-Fi drops and routers forget idle connections, often without telling anybody. Use ping and pong, remove dead clients, and have the page reconnect.',
    'My ESP can serve ten dashboards at once — Each client uses a socket and a buffer of RAM; the limit on an ESP is a few. Test with the number you need.'
  ],
  terms: [
    { term: 'WebSocket', also: ['ws', 'wss'], def: 'A protocol that upgrades an HTTP connection into a two-way channel of small messages, so that the server can send data to the client whenever it likes.' },
    { term: 'Upgrade', also: ['101 Switching Protocols'], def: 'The HTTP header with which a client asks to change protocol, and the 101 status with which the server agrees. After it the connection no longer carries HTTP.' },
    { term: 'Polling', also: ['long polling'], def: 'Asking again and again whether something has changed. It wastes requests when changes are rare and delivers news late when they are not.' },
    { term: 'Push', also: ['server push'], def: 'The server sending data to the client the moment it exists, without being asked. WebSockets and Server-Sent Events make it possible over the web.' },
    { term: 'Ping and pong', also: ['keep-alive frame', 'heartbeat'], def: 'Small WebSocket frames: one side sends a ping and the other answers with a pong, which shows that the connection still works.' }
  ],
  choose: {
    good: ['WebSockets for live values and commands between a page and the ESP', 'Server-Sent Events when data flows only from the ESP to the page', 'Polling every few seconds when the data changes rarely and one client is enough'],
    avoid: ['Polling every 200 ms to imitate a live view', 'Many simultaneous WebSocket clients on one ESP', 'A WebSocket exposed to the internet with no authentication'],
    check: ['How many clients you need at once, tested on the real board', 'What the page does when the connection drops', 'Whether commands received over the socket are checked before they act']
  },
  code: [
    {
      title: 'Push a reading every second, and echo what arrives',
      about: 'An asynchronous server with a WebSocket at /ws. Every second it pushes a line to all connected clients; any text a client sends is passed on to everyone. Try it with a browser page or any WebSocket test client.',
      needs: 'Any ESP32-family board with Wi-Fi and the ESP Async WebServer and Async TCP libraries from the ESP32Async group. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      libs: ['ESP Async WebServer (ESP32Async)', 'Async TCP (ESP32Async)'],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          print (IP address)
          start web server on port (80)
          start WebSocket server at [/ws] :: net

        when WebSocket message arrives (text) :: net
          send (text) to all WebSocket clients :: net

        every (1) seconds
          send (join [uptime ] ((milliseconds since start) / (1000))) to all WebSocket clients :: net
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <AsyncTCP.h>
        #include <ESPAsyncWebServer.h>

        AsyncWebServer server(80);
        AsyncWebSocket ws("/ws");

        void onWsEvent(AsyncWebSocket *s, AsyncWebSocketClient *c, AwsEventType type, void *arg, uint8_t *data, size_t len) {
          if (type == WS_EVT_CONNECT)         Serial.printf("client %u connected\n", c->id());
          else if (type == WS_EVT_DISCONNECT) Serial.printf("client %u left\n", c->id());
          else if (type == WS_EVT_DATA)       s->textAll((const char *)data, len);      // pass it on to everyone
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println(WiFi.localIP());
          ws.onEvent(onWsEvent);
          server.addHandler(&ws);
          server.begin();
        }

        void loop() {
          static uint32_t last = 0;
          if (millis() - last >= 1000) {
            last = millis();
            ws.textAll(String("uptime ") + (millis() / 1000));        // push to every client
          }
          ws.cleanupClients();                                        // drop clients that have gone
        }
      `,
      na: { py: 'The MicroPython firmware has no WebSocket server. The microdot framework (installed with mip) adds one, but it is a different library with its own calls, so it is not shown here as the same program.' },
      output: `
        192.168.1.57
        client 1 connected
      `,
      notes: ['The page that connects can be served by the same program from a file ([[web-server-on-esp]]); in JavaScript the client is new WebSocket("ws://esp32.local/ws") with an onmessage handler.', 'Version 3 of the ESPAsyncWebServer library also offers a helper with separate connect, disconnect and message callbacks; the form above works in both.']
    }
  ],
  quiz: [
    { q: 'A page shows a tank level that changes a few times a minute. Polling at 1 s sends 60 requests a minute. What does a WebSocket change?', choices: ['The level changes less often', 'The ESP sends a small frame only when the level changes, and the page sees it at once', 'The page can no longer send commands', 'The ESP needs no Wi-Fi'], a: 1, why: 'Push sends nothing while the value is steady and delivers a change as soon as it happens, with a frame header of a few bytes instead of a full HTTP request and response.' },
    { q: 'Which status code does the server send to accept a WebSocket upgrade?', choices: ['200 OK', '101 Switching Protocols', '301 Moved Permanently', '204 No Content'], a: 1, why: '101 means "I am switching to the protocol you asked for". After it the same TCP connection carries WebSocket frames, not HTTP.' },
    { q: 'A phone locks its screen. Hours later the ESP still lists it as a connected client. What is the right defence?', choices: ['Nothing: the list is always right', 'Ping the clients and remove those that do not answer', 'Restart the ESP every hour', 'Use a bigger buffer'], a: 1, why: 'A sleeping phone or a dropped Wi-Fi often leaves no close frame. Pings find the dead connections, and removing them frees sockets and RAM for live clients.' },
    { q: 'A WebSocket needs a fresh HTTP request for each message it carries.', a: false, why: 'Only the opening is HTTP. After the upgrade the connection carries small frames in both directions without further requests.' }
  ],
  applications: [
    'A live graph or gauge of a sensor in a page served by the ESP.',
    'A remote-control page with a joystick or sliders, where every move must reach the board at once.',
    'A serial console or log viewer in a browser, with new lines pushed as they appear.',
    'Progress of a firmware update or a long task shown on a page as it happens.'
  ],
  sources: [
    'IETF RFC 6455, *The WebSocket Protocol*.',
    'The ESPAsyncWebServer documentation of the ESP32Async project: AsyncWebSocket and its examples.',
    'Espressif, *ESP-IDF Programming Guide*, HTTP Server component: WebSocket support.'
  ],
  sim: 'ip-push'
},

/* ================================================================ MQTT */
{
  id: 'mqtt',
  parent: 'internet-protocols',
  title: 'MQTT',
  level: 1,
  short: 'Devices do not talk to each other: they publish messages to named topics on a broker, and anything that subscribed to the topic receives them. Small messages, one outgoing connection and a way to notice a dead device made it the language of IoT.',
  keywords: ['MQTT', 'broker', 'publish', 'subscribe', 'topic', 'Mosquitto', 'PubSubClient', 'espMqttClient', 'umqtt', 'client ID', 'port 1883', 'port 8883', 'keep-alive', 'publish subscribe', 'esp-mqtt', 'Home Assistant', 'EMQX'],
  prereq: ['sockets', 'tcp-ip-on-a-microcontroller'],
  related: ['mqtt-topics-qos-retain', 'https-and-tls', 'iot-architecture', 'home-assistant-integration', 'websockets', 'store-and-forward', 'espeasy-and-openmqttgateway'],
  body: `MQTT is the protocol most IoT devices end up using, and the reason is its shape. Instead of every device talking to every other, they all talk to one **broker**. A device **publishes** a message to a named **topic** such as \`home/kitchen/temp\`, and every device that has **subscribed** to that topic receives it. The sender does not know who listens, and the listeners do not know who sent. A dashboard, a logger or a second display can be added without touching the sensor. The simulation shows messages crossing a broker.

### Why it suits small devices

- **A tiny header.** The smallest message has a 2-byte fixed header. Publishing the text 21.5 to \`home/kitchen/temp\` takes 25 bytes in all: 2 of header, 2 for the topic length, 17 for the topic, 4 for the value.
- **One long-lived connection**, over TCP on port 1883 (8883 with TLS). The device calls out, so it works behind NAT, and the broker pushes a command down the same connection the instant it is published.
- **It notices failure.** A keep-alive timer lets the broker tell that a device has vanished, and a *last will* message can announce it ([[mqtt-topics-qos-retain]]).
- **Many to many.** The ESP sends once and the broker fans it out to ten subscribers.

### Brokers

The broker is a program on a computer. Mosquitto on a Raspberry Pi or a home server is the usual start; EMQX, HiveMQ and others run in data centres, and home-automation hubs and cloud IoT services contain one. A free public test broker is *public*: anyone can read what you send and publish to your topics, so use it for ten minutes and never for anything real. A broker of your own needs a password and, once it can be reached from beyond the home network, TLS ([[https-and-tls]]).

### On the ESP

The best-known Arduino library is **PubSubClient**. It is simple, but it publishes at QoS 0 only, accepts 256 bytes per message unless you raise \`setBufferSize\`, and expects your \`loop()\` to call \`mqtt.loop()\` constantly and to reconnect after a loss. **espMqttClient**, ESP-IDF's own \`esp-mqtt\` client and the Adafruit library offer more QoS levels, bigger messages or no blocking. MicroPython has \`umqtt.simple\` built in, and \`umqtt.robust\` which reconnects. Whatever the library, give every device a **unique client ID**: two with the same one throw each other off the broker, again and again.

### The cost

An open connection keeps the radio awake. A battery sensor that sleeps for ten minutes normally connects, publishes and disconnects, giving up the broker's push to save energy ([[wifi-power-save-and-dtim]]). MQTT is not a database: the broker forgets a message once delivered, apart from a retained one ([[time-series-data]]).

> [!key] In MQTT devices publish to topics on a broker and subscribe to topics, so senders and receivers never meet. Small messages, one outgoing connection and detection of dead devices make it the usual language of IoT: use a broker with a password, a unique client ID, and a library that reconnects.`,
  ideas: [
    'Devices talk to a broker, not to each other: publishers send to topics, subscribers receive what matches.',
    'The smallest MQTT message has a 2-byte header; a short reading with its topic is a few tens of bytes.',
    'The ESP opens the connection, so MQTT works behind NAT and the broker can push commands down the same line.',
    'Each client needs a unique ID and a reconnection routine; a public test broker is readable by everyone.'
  ],
  pitfalls: [
    'MQTT delivers my message to the other device — It delivers to the broker, which passes it to whoever is subscribed at that moment. With nobody subscribed (and no retained message) it goes nowhere.',
    'A public test broker is fine for my project — Anyone can read your topics and publish to them, including commands to your devices. Run your own broker, with a password, for anything real.',
    'Two ESPs can share a client ID if they use different topics — The broker allows one connection per ID: the newcomer disconnects the first, and they kick each other off in a loop. Make the ID unique per device.'
  ],
  terms: [
    { term: 'MQTT', also: ['Message Queuing Telemetry Transport'], def: 'A light publish-subscribe protocol over TCP. Clients connect to a broker, publish messages to topics and subscribe to topics.' },
    { term: 'Broker', also: ['MQTT broker', 'Mosquitto'], def: 'The server that receives every published message and forwards it to the clients subscribed to a matching topic. Mosquitto and EMQX are well-known brokers.' },
    { term: 'Topic', also: ['topic name'], def: 'The name a message is published under, written as levels separated by slashes, for example home/kitchen/temp.' },
    { term: 'Publish', also: ['subscribe'], def: 'To send a message to a topic (publish) and to ask the broker for the messages of a topic or pattern (subscribe).' },
    { term: 'Client ID', also: ['client identifier'], def: 'The name a client gives the broker when it connects. It must be unique: a second connection with the same ID disconnects the first.' },
    { term: 'Keep-alive', also: ['PINGREQ'], def: 'The interval within which a client must send something, a ping if nothing else, so that the broker knows it is still there. The broker drops a silent client after about one and a half intervals.' }
  ],
  choose: {
    good: ['Sensors that report often to many readers: loggers, dashboards, home-automation hubs', 'Commands from a hub or phone to devices behind a router', 'Anywhere devices come and go and a broker can notice'],
    avoid: ['A public test broker for anything real', 'MQTT for a large file or a camera stream', 'One shared client ID in a fleet'],
    check: ['That the library reconnects, and what it does with messages while it is away', 'The maximum message size of the library against yours', 'Whether the broker needs a password and TLS']
  },
  code: [
    {
      title: 'Publish a reading and obey a command',
      about: 'Connects to a broker, publishes a temperature every five seconds to home/kitchen/temp and listens on home/kitchen/led, switching the LED when the message is ON or OFF. The reading is a fixed 21.5 here: replace it with a sensor.',
      needs: 'An ESP32 DevKit with the LED on GPIO2, and an MQTT broker on your network (here 192.168.1.10). To try it, a phone or computer with an MQTT client. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      wiring: [['GPIO2', 'on-board LED', 'or 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          connect to MQTT broker [192.168.1.10] as [esp32-kitchen-1]
          subscribe to [home/kitchen/led]

        when message arrives on [home/kitchen/led]
          set pin (2) to <(message) = [ON]>

        every (5) seconds
          publish [21.5] to topic [home/kitchen/temp]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const int LED = 2;
        NetworkClient net;
        PubSubClient mqtt(net);

        void onMessage(char *topic, byte *payload, unsigned int length) {
          String msg;
          for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
          Serial.printf("%s -> %s\n", topic, msg.c_str());
          if (String(topic) == "home/kitchen/led") digitalWrite(LED, msg == "ON");
        }

        void ensureMqtt() {
          while (!mqtt.connected()) {
            if (mqtt.connect("esp32-kitchen-1")) mqtt.subscribe("home/kitchen/led");
            else delay(2000);                                 // try again in 2 s
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer("192.168.1.10", 1883);               // your broker
          mqtt.setKeepAlive(60);
          mqtt.setCallback(onMessage);
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();                                        // keep-alive and incoming messages: every pass
          static uint32_t last = 0;
          if (millis() - last > 5000) {
            last = millis();
            mqtt.publish("home/kitchen/temp", "21.5");        // replace with a sensor reading
          }
        }
      `,
      py: String.raw`
        import network, time
        from machine import Pin
        from umqtt.simple import MQTTClient

        led = Pin(2, Pin.OUT)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        def on_msg(topic, msg):                               # both are bytes
            print(topic, "->", msg)
            if topic == b"home/kitchen/led":
                led.value(1 if msg == b"ON" else 0)

        c = MQTTClient("esp32-kitchen-1", "192.168.1.10", keepalive=60)
        c.set_callback(on_msg)
        c.connect()
        c.subscribe(b"home/kitchen/led")
        last = time.ticks_ms()
        while True:
            c.check_msg()                                     # incoming messages, without waiting
            if time.ticks_diff(time.ticks_ms(), last) > 5000:
                last = time.ticks_ms()
                c.publish(b"home/kitchen/temp", b"21.5")      # replace with a sensor reading
            time.sleep_ms(50)
      `,
      output: `
        home/kitchen/led -> ON
        home/kitchen/led -> OFF
      `,
      notes: ['This MicroPython loop does not reconnect if the broker or the Wi-Fi goes away: umqtt.robust wraps the same calls with reconnection, and you can ping with c.ping() when a loop is quiet.', 'PubSubClient publishes at QoS 0 and accepts messages of at most 256 bytes unless you call mqtt.setBufferSize().']
    }
  ],
  quiz: [
    { q: 'Two ESPs both connect to a broker with the client ID "esp32". What happens?', choices: ['They share one connection', 'Each time one connects the broker drops the other, so they take turns', 'The broker refuses the second', 'Nothing: IDs are only labels'], a: 1, why: 'A broker allows one connection per client ID. A new connection with an ID in use takes it over and the old one is disconnected; if both reconnect automatically they push each other off in a loop.' },
    { q: 'An ESP publishes a reading while no client is subscribed to the topic and nothing is retained. Where does the message go?', choices: ['It waits at the broker until someone subscribes', 'It is dropped by the broker', 'It returns to the ESP', 'It is sent to all clients'], a: 1, why: 'The broker only forwards a message to the current subscribers of a matching topic. With none and no retained flag, the message is discarded.' },
    { q: 'How many bytes does publishing the text "21.5" to the topic "home/kitchen/temp" take at QoS 0?', choices: ['4', 'About 25', 'About 250', 'About 1000'], a: 1, why: 'A 2-byte fixed header, 2 bytes for the topic length, the 17-byte topic and the 4-byte payload: 25 bytes, before the TCP and IP headers.' },
    { q: 'A free public test broker is a good home for the commands that switch things in your house.', a: false, why: 'Public brokers are readable and writable by everyone. Anyone who guesses or watches the topic can send your devices commands.' }
  ],
  applications: [
    'Sensors reporting to a home-automation hub such as Home Assistant, which subscribes to their topics ([[home-assistant-integration]]).',
    'A logger, a dashboard and an alert service all fed by one publish ([[dashboards]]).',
    'Commands to devices behind a router: lamps, valves, displays.',
    'Fleet status: every device announces online and offline, and a monitor watches the lot ([[mqtt-topics-qos-retain]]).'
  ],
  sources: [
    'OASIS, *MQTT Version 3.1.1* and *MQTT Version 5.0* specifications.',
    'The PubSubClient library README (limits and API); the espMqttClient documentation.',
    'MicroPython micropython-lib, the *umqtt.simple* and *umqtt.robust* packages; Espressif, *ESP-IDF Programming Guide*, ESP-MQTT.'
  ],
  sim: 'ip-mqtt'
},

/* ================================================================ topics, QoS, retain and last will */
{
  id: 'mqtt-topics-qos-retain',
  parent: 'internet-protocols',
  title: 'Topics, QoS, retain and last will',
  level: 2,
  short: 'How to name topics so that wildcards work, what QoS 0, 1 and 2 really promise, why a retained message lets a late subscriber catch up, and how a last will turns a vanished device into a message.',
  keywords: ['MQTT topic', 'wildcard', '+', '#', 'QoS', 'QoS 0', 'QoS 1', 'QoS 2', 'retained', 'retain', 'last will', 'LWT', 'testament', 'keep-alive', 'clean session', 'persistent session', 'DUP', 'PUBACK', 'MQTT 5', 'online offline status'],
  prereq: ['mqtt'],
  related: ['https-and-tls', 'store-and-forward', 'reliability-acks-and-retries', 'device-shadows-and-twins', 'home-assistant-integration', 'coap-and-other-protocols'],
  body: `The basics of MQTT fit in a paragraph; its useful features live in four details.

### Topic names and wildcards

A topic is levels separated by \`/\`, such as \`home/kitchen/temp\`. Names are case-sensitive, have no leading slash and no spaces, and stay short because they travel with every message; names that begin with a dollar sign belong to the broker. A good habit is **site / room / device / quantity**, with *state* topics (\`.../temp\`, \`.../status\`) kept apart from *command* topics (\`.../set\`, \`.../cmd\`).

A subscriber may use **wildcards**; a publisher may not. **\`+\`** stands for exactly one level: \`home/+/temp\` matches \`home/kitchen/temp\` and \`home/garage/temp\` but not \`home/kitchen/oven/temp\`. **\`#\`** stands for everything below, and only at the end: \`home/#\` matches all of the house.

### QoS: how much delivery is promised

| QoS | Promise | Messages | Remember |
|---|---|---|---|
| 0 | at most once: sent, nothing acknowledged | 1 | cheapest; gone if the connection breaks |
| 1 | at least once: resent until acknowledged | 2 | a repeat is possible, so a handler must cope with a duplicate |
| 2 | exactly once, by a four-message exchange | 4 | slow and rarely needed |

QoS applies to each hop on its own: a message leaves the broker at the *lower* of the publisher's and the subscriber's QoS. TCP already repairs ordinary losses, so QoS matters when the **connection itself breaks**: the sender must then know whether to try again. The simulation shows each level when the line drops.

### Retained messages

A message published with the **retain** flag is kept by the broker, one per topic, and given to every new subscriber the moment it subscribes. A thermostat that restarts learns its last setpoint at once; a dashboard shows the last temperature before the next reading arrives. Publish an empty retained message to clear it.

### The last will

When it connects, a client may leave a **last will**: a message for the broker to publish if the client vanishes without saying goodbye, which the broker notices when about one and a half keep-alive intervals pass in silence. The usual pattern: on connect, publish *retained* \`online\` to \`.../status\`, and register the will as *retained* \`offline\` on the same topic. Anything that subscribes then always sees the truth, even if it arrives late.

### Sessions and versions

With a **persistent session** the broker keeps a device's subscriptions and queues its QoS 1 and 2 messages while it is away. MQTT 5 adds reason codes and message expiry; the small ESP libraries speak 3.1.1.

> [!key] Wildcards (+ one level, # the rest) let one subscription cover many topics. QoS 0, 1 and 2 promise at most, at least and exactly once, and matter when a connection breaks; retained messages catch up late subscribers, and a retained last will on the same topic as a retained online message keeps a device's status truthful.`,
  ideas: [
    'Topics are slash-separated levels; + matches one level and # matches all the rest, and only subscribers may use them.',
    'QoS 0 is at most once, QoS 1 at least once (duplicates possible), QoS 2 exactly once; the lower of the two QoS values applies to each hop.',
    'A retained message is stored by the broker and handed to each new subscriber at once; an empty retained message clears it.',
    'A last will is published by the broker if the device vanishes; paired with a retained online message it keeps the status topic true.'
  ],
  pitfalls: [
    'QoS 2 is the safe choice for everything — It costs four messages and more state, and few ESP libraries offer it. QoS 1 with a handler that tolerates a duplicate, or QoS 0 for repeated readings, is usual.',
    'A retained message is a stored command that runs again — A new subscriber gets the retained value as if it were new. A retained "switch on" is executed every time the device restarts. Retain state, not one-shot commands.',
    'The last will fires when the device disconnects politely — Only when it vanishes (keep-alive expiry, a dropped connection). A proper disconnect does not send it, so publish "offline" yourself before leaving on purpose.'
  ],
  terms: [
    { term: 'Wildcard', also: ['+', '#', 'topic filter'], def: 'A pattern in a subscription: + matches exactly one topic level, and # matches all remaining levels (and must be last). Publishers cannot use them.' },
    { term: 'QoS', also: ['quality of service', 'QoS 0', 'QoS 1', 'QoS 2'], def: 'The delivery promise of one MQTT message: 0 at most once, 1 at least once, 2 exactly once. It applies separately to the way in to the broker and the way out.' },
    { term: 'Retained message', also: ['retain flag'], def: 'A message the broker stores as the latest value of its topic and gives to every client that subscribes later, immediately on subscribing.' },
    { term: 'Last will', also: ['LWT', 'last will and testament'], def: 'A message and topic that a client registers when it connects. The broker publishes it if the client disappears without a proper disconnect.' },
    { term: 'Persistent session', also: ['clean session', 'clean start'], def: 'A session that the broker keeps between connections: the client\'s subscriptions and its queued QoS 1 and 2 messages survive while it is offline.' }
  ],
  choose: {
    good: ['QoS 0 for repeated readings, where the next one replaces a lost one', 'QoS 1 for commands and alerts, with handlers that cope with a repeat', 'Retained messages and a last will for status topics'],
    avoid: ['Retaining one-shot commands', '# subscriptions on a busy broker from a small device: it must receive every message', 'Deep topic hierarchies with long names on a battery device'],
    check: ['What your library can do: QoS 2 and retained publishing are not universal', 'The keep-alive interval against the time you want to wait before a device counts as dead', 'What the device does with the messages it missed while away']
  },
  examples: [
    {
      title: 'Which subscriptions get the message?',
      q: 'A message is published to `home/kitchen/oven/temp`. Which of these subscriptions receive it? `home/+/temp`, `home/#`, `home/kitchen/+/temp`, `+/kitchen/#`.',
      steps: ['`home/+/temp`: the + stands for one level, but here two levels (`kitchen/oven`) sit between `home` and `temp`. No match.', '`home/#`: everything below `home`. Match.', '`home/kitchen/+/temp`: + is exactly `oven`. Match.', '`+/kitchen/#`: + is `home`, then `kitchen`, then # covers `oven/temp`. Match.'],
      a: 'Three of the four: `home/#`, `home/kitchen/+/temp` and `+/kitchen/#`. Only `home/+/temp` misses it, because + covers a single level.'
    }
  ],
  code: [
    {
      title: 'Announce online and offline, and listen at QoS 1',
      about: 'Registers a retained "offline" last will, then publishes a retained "online" on the same topic, so any dashboard sees the device\'s true state. It subscribes to a command topic at QoS 1 and prints what arrives.',
      needs: 'Any ESP32-family board with Wi-Fi, and an MQTT broker on your network (here 192.168.1.10). Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          connect to MQTT broker [192.168.1.10] as [esp32-kitchen-1] with last will [offline] on [home/kitchen/status] retained
          publish [online] to topic [home/kitchen/status] retained
          subscribe to [home/kitchen/cmd] with QoS (1)

        when message arrives on [home/kitchen/cmd]
          print (message)
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        NetworkClient net;
        PubSubClient mqtt(net);

        void onMessage(char *topic, byte *payload, unsigned int length) {
          Serial.printf("%s: %.*s\n", topic, (int)length, (const char *)payload);
        }

        void ensureMqtt() {
          while (!mqtt.connected()) {
            // client id, will topic, will QoS, will retained, will message
            if (mqtt.connect("esp32-kitchen-1", "home/kitchen/status", 1, true, "offline")) {
              mqtt.publish("home/kitchen/status", "online", true);   // retained
              mqtt.subscribe("home/kitchen/cmd", 1);                 // QoS 1
            } else {
              delay(2000);
            }
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer("192.168.1.10", 1883);
          mqtt.setKeepAlive(30);
          mqtt.setCallback(onMessage);
        }

        void loop() {
          ensureMqtt();
          mqtt.loop();
        }
      `,
      py: String.raw`
        import network, time
        from umqtt.simple import MQTTClient

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        def on_msg(topic, msg):
            print(topic, msg)

        c = MQTTClient("esp32-kitchen-1", "192.168.1.10", keepalive=30)
        c.set_callback(on_msg)
        c.set_last_will(b"home/kitchen/status", b"offline", retain=True, qos=1)   # before connect()
        c.connect()
        c.publish(b"home/kitchen/status", b"online", retain=True, qos=1)
        c.subscribe(b"home/kitchen/cmd", qos=1)
        last_ping = time.ticks_ms()
        while True:
            c.check_msg()
            if time.ticks_diff(time.ticks_ms(), last_ping) > 15000:
                c.ping()                                       # keep the keep-alive timer fed
                last_ping = time.ticks_ms()
            time.sleep_ms(100)
      `,
      output: `
        home/kitchen/cmd: refresh
      `,
      notes: ['To test the last will, cut the ESP\'s power while a subscriber watches home/kitchen/status: after about 45 seconds (one and a half keep-alive intervals) "offline" appears.', 'PubSubClient can only publish at QoS 0; the "1" in connect() and subscribe() asks for QoS 1 on the will and on the subscription only.']
    }
  ],
  quiz: [
    { q: 'A subscriber uses `home/+/temp`. Which topic does it NOT receive?', choices: ['home/kitchen/temp', 'home/garage/temp', 'home/kitchen/oven/temp', 'home/cellar/temp'], a: 2, why: 'The + stands for exactly one level. home/kitchen/oven/temp has two levels between home and temp, so it needs home/+/+/temp or home/#.' },
    { q: 'A thermostat restarts and must know the last setpoint at once. What makes this work?', choices: ['QoS 2', 'The setpoint was published with the retain flag', 'A longer keep-alive', 'A bigger buffer'], a: 1, why: 'The broker keeps the retained message and delivers it as soon as the thermostat subscribes. Without it, the thermostat would wait for the next change.' },
    { q: 'A sensor is unplugged and its status topic shows "offline" some seconds later. What produced that message?', choices: ['The sensor, as it lost power', 'The broker, publishing the last will after the keep-alive ran out', 'The dashboard', 'The router'], a: 1, why: 'A dead device cannot announce anything. The broker notices the silence and publishes the will that the device registered when it connected.' },
    { q: 'A command "open the valve" is published with the retain flag. What happens when a valve controller restarts?', choices: ['Nothing', 'It receives the retained command again and may open the valve', 'The broker deletes the message', 'The controller refuses it'], a: 1, why: 'A retained message is delivered to every new subscriber, so a one-shot command is replayed at every restart. Retain state ("valve is open"), not actions.' }
  ],
  applications: [
    'Status topics that dashboards and home-automation hubs read to show which devices are alive.',
    'Settings and set-points that must be available to a device the moment it connects.',
    'Alerts that must arrive at least once, with the handler written to cope with a repeat.',
    'A topic plan for a house or a fleet, so that one wildcard subscription covers a room, a device type or everything.'
  ],
  sources: [
    'OASIS, *MQTT Version 3.1.1*, sections on topic names and filters, quality of service, retained messages and will messages.',
    'OASIS, *MQTT Version 5.0*, for session expiry, message expiry and shared subscriptions.',
    'The PubSubClient library README; micropython-lib, the *umqtt.simple* package.'
  ],
  sim: ['ip-qos', { id: 'ip-mqtt', params: { retain: true } }]
},

/* ================================================================ time: NTP, zones, the clock chip */
{
  id: 'ntp-and-time',
  parent: 'internet-protocols',
  title: 'Time: NTP, zones, the clock chip',
  level: 2,
  short: 'A bare ESP does not know what time it is. One short exchange with a time server sets its clock to within a few milliseconds; a zone rule turns UTC into local time; and a clock chip keeps time where there is no network.',
  keywords: ['NTP', 'SNTP', 'time', 'clock', 'configTime', 'configTzTime', 'getLocalTime', 'ntptime', 'time zone', 'POSIX TZ', 'daylight saving', 'UTC', 'Unix time', 'epoch', 'RTC', 'DS3231', 'DS1307', 'PCF8563', 'drift', 'time server', 'pool.ntp.org'],
  prereq: ['sockets', 'ip-addresses-dhcp-dns'],
  related: ['https-and-tls', 'logging-data', 'time-sync-between-boards', 'deep-sleep', 'rtc-memory', 'crystals-and-clocks', 'esp-as-a-data-logger'],
  body: `A bare ESP has no idea what time it is. It has a counter that starts when power returns: the Arduino core calls that moment 1 January 1970, MicroPython calls it 1 January 2000. Yet time is needed everywhere: to stamp a measurement, to run something at 07:30, to put log lines in order and, less obviously, to check the dates on a certificate ([[https-and-tls]]). The usual answer is to ask the internet.

### SNTP: asking for the time

The ESP sends a small UDP message to a time server (port 123) and gets the server's time back. Four timestamps are involved: when the ESP sent the question (*t1*, by its own clock), when the server received it (*t2*) and answered (*t3*, by the server's clock), and when the answer arrived (*t4*, by the ESP's clock). The **offset** says how far the ESP's clock is from the server's, and the **delay** is the time the messages spent travelling. The offset assumes that the way there took as long as the way back; if not, it is wrong by half the difference. Over a home connection that leaves an error of a few to a few tens of milliseconds: plenty for logs and schedules. The simulation lets you skew the two paths.

One call starts it: \`configTzTime()\` or \`configTime()\` in Arduino, \`ntptime.settime()\` in MicroPython. The Arduino side then repeats the request by itself, by default about once an hour; MicroPython asks only when you call.

### UTC and local time

Keep the device's real clock in **UTC**, seconds since 1970 (Unix time), and convert only to display. Local time needs a zone rule: the offset from UTC and when daylight saving starts and ends. Arduino takes a **POSIX time-zone string**: \`CET-1CEST,M3.5.0,M10.5.0/3\` says that standard time (CET) is 1 hour *ahead* of UTC (the sign is written the wrong way round, west is positive), and that summer time (CEST) runs from the last Sunday of March (\`M3.5.0\`: month 3, week 5 meaning the last, day 0 Sunday) to the last Sunday of October at 03:00. MicroPython has no zone support: it keeps UTC, and you add the offset and the daylight saving yourself. Its epoch is 2000, so \`time.time()\` is not a Unix timestamp.

### Between syncs, and without a network

The chip's own real-time clock keeps counting through deep sleep, but from an on-chip RC oscillator, far less accurate than a crystal: it can wander by a percent or so with temperature. A device that sleeps for hours should sync again when it wakes, and it loses the time completely when power is removed. A separate **real-time clock chip**, such as the DS3231 (I2C, address 0x68), keeps time through a power cut on a coin cell and needs no network. Its temperature-compensated crystal is good to about 2 parts per million, roughly a minute a year; a plain 32 kHz crystal gives tens of ppm, a second or two a day.

> [!key] SNTP sets the clock to within milliseconds from four timestamps. Keep UTC inside and convert with a zone rule for display; re-sync after power-up and long sleeps, and add a clock chip where there is no network.`,
  ideas: [
    'An ESP knows no time at power-up: its clock starts at 1970 (Arduino) or 2000 (MicroPython) until SNTP sets it.',
    'SNTP uses four timestamps: the offset is ((t2 − t1) + (t3 − t4)) ÷ 2 and the delay is (t4 − t1) − (t3 − t2); asymmetric paths put half their difference into the offset.',
    'Keep UTC internally and convert for display; Arduino takes a POSIX zone string, MicroPython needs a manual offset.',
    'The on-chip clock drifts and is lost at power-off; a DS3231 clock chip holds time to about a minute a year without a network.'
  ],
  pitfalls: [
    'Once set, the time stays right for ever — The on-chip clock drifts, is reset by a power cut, and a sleeping device falls behind. Re-sync on every power-up and from time to time.',
    'time.time() in MicroPython is a Unix timestamp — On the ESP32 port the epoch is 2000-01-01, so values are 946 684 800 seconds smaller than Unix time. Convert if you send timestamps to another system.',
    'The time zone string is written like the UTC offset — The sign is inverted: CET-1 means one hour east of UTC. Getting it wrong is the cause of a clock that is exactly two hours out.'
  ],
  terms: [
    { term: 'NTP', also: ['SNTP', 'Network Time Protocol', 'time server'], def: 'The protocol by which a device asks a time server for the time over UDP port 123. SNTP is its simple form, which sets the clock without the refinements of full NTP.' },
    { term: 'Unix time', also: ['epoch', 'POSIX time'], def: 'The count of seconds since 1 January 1970 UTC. MicroPython on the ESP32 counts from 1 January 2000 instead.' },
    { term: 'UTC', also: ['Coordinated Universal Time', 'GMT'], def: 'The world time scale that does not change with the seasons. Local time is UTC plus a zone offset and, in summer, a daylight-saving hour.' },
    { term: 'POSIX time-zone string', also: ['TZ string', 'CET-1CEST'], def: 'A compact rule such as CET-1CEST,M3.5.0,M10.5.0/3 giving the standard offset (sign inverted) and when daylight saving starts and ends. Arduino and ESP-IDF understand it.' },
    { term: 'Real-time clock', also: ['RTC', 'DS3231', 'clock chip'], def: 'A chip, or the part of the ESP that stays powered in deep sleep, that keeps counting time. A separate chip with a crystal and a battery keeps it through power-off.' }
  ],
  choose: {
    good: ['SNTP over Wi-Fi for anything that has a network at start-up', 'A DS3231 for loggers without a network, or to set the time fast on wake-up', 'UTC inside, a zone string for the display'],
    avoid: ['A DS1307 or other uncompensated chip where accuracy matters: it drifts by seconds a day', 'Hard-coding a UTC offset where daylight saving applies, unless the device never changes season', 'Using the time before the first sync completes'],
    check: ['What the device does if the time server does not answer', 'How far the clock can drift between syncs, against the accuracy you need', 'Whether the timestamps you send are Unix time or MicroPython time']
  },
  formulas: [
    {
      name: 'Clock offset from the four NTP timestamps',
      expr: 'theta = ((t2 - t1) + (t3 - t4))/2',
      tex: '\\theta = \\frac{(t_2 - t_1) + (t_3 - t_4)}{2}',
      vars: {
        theta: { name: 'offset of the server clock from the client clock', tex: '\\theta', q: 'time', unit: 'ms', signed: true },
        t1: { name: 'client sends (client clock)', q: 'time', unit: 'ms', value: 1000, signed: true },
        t2: { name: 'server receives (server clock)', q: 'time', unit: 'ms', value: 1062, signed: true },
        t3: { name: 'server replies (server clock)', q: 'time', unit: 'ms', value: 1064, signed: true },
        t4: { name: 'client receives (client clock)', q: 'time', unit: 'ms', value: 1026, signed: true }
      },
      solveFor: 'theta',
      note: 'A positive offset means the server is ahead of the client: add it to the client clock. It is exact only if the way there took as long as the way back.'
    },
    {
      name: 'Round-trip delay',
      expr: 'delta = (t4 - t1) - (t3 - t2)',
      tex: '\\delta = (t_4 - t_1) - (t_3 - t_2)',
      vars: {
        delta: { name: 'time spent on the network, both ways', tex: '\\delta', q: 'time', unit: 'ms' },
        t1: { name: 'client sends (client clock)', q: 'time', unit: 'ms', value: 1000, signed: true },
        t2: { name: 'server receives (server clock)', q: 'time', unit: 'ms', value: 1062, signed: true },
        t3: { name: 'server replies (server clock)', q: 'time', unit: 'ms', value: 1064, signed: true },
        t4: { name: 'client receives (client clock)', q: 'time', unit: 'ms', value: 1026, signed: true }
      },
      solveFor: 'delta',
      note: 'The total time from sending to receiving, less the time the server held the request. A reply with a large delay is a poor basis for an offset, which is why NTP clients prefer the sample with the smallest delay.'
    }
  ],
  examples: [
    {
      title: 'Reading one exchange',
      q: 'The ESP sends a request when its clock reads 1000 ms. The server receives it at 1062 ms and replies at 1064 ms (server clock). The answer reaches the ESP at 1026 ms (ESP clock). How far off is the ESP, and how long did the network take?',
      steps: ['Offset: $\\theta = ((1062 - 1000) + (1064 - 1026)) / 2 = (62 + 38) / 2 = 50$ ms.', 'Delay: $\\delta = (1026 - 1000) - (1064 - 1062) = 26 - 2 = 24$ ms, so about 12 ms each way.', 'The server is 50 ms ahead: the ESP adds 50 ms to its clock.'],
      a: 'The ESP is 50 ms behind the server, and the round trip took 24 ms. If the way there had taken 20 ms and the way back 4 ms, the same sum would have been wrong by 8 ms.'
    }
  ],
  code: [
    {
      title: 'Set the clock and print local time',
      about: 'Sets the clock from a time server and prints the date and time every second, in Rome, Paris and Berlin time with daylight saving. MicroPython has no zone rules: it prints the time with a fixed offset of one hour.',
      needs: 'Any ESP32-family board with Wi-Fi and internet access. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] time zone [CET-1CEST,M3.5.0,M10.5.0/3] :: net
        forever
          print (current time)
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          // Rome, Paris, Berlin: 1 h ahead of UTC, summer time from the last Sunday of March to the last of October
          configTzTime("CET-1CEST,M3.5.0,M10.5.0/3", "pool.ntp.org", "time.nist.gov");
        }

        void loop() {
          struct tm t;
          if (getLocalTime(&t, 5000)) {                          // waits up to 5 s for the first sync
            Serial.println(&t, "%A, %d %B %Y %H:%M:%S");
          } else {
            Serial.println("no time yet");
          }
          delay(1000);
        }
      `,
      py: String.raw`
        import network, ntptime, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        ntptime.timeout = 2
        for attempt in range(5):
            try:
                ntptime.settime()                                # sets the RTC to UTC
                break
            except OSError:
                print("no answer from the time server, trying again")
                time.sleep(2)

        OFFSET = 1 * 3600                                        # CET without daylight saving: add an hour in summer, by hand
        while True:
            t = time.localtime(time.time() + OFFSET)
            print("%04d-%02d-%02d %02d:%02d:%02d" % t[:6])
            time.sleep(1)
      `,
      output: `
        Sunday, 04 October 2026 14:21:07
        Sunday, 04 October 2026 14:21:08
      `,
      notes: ['The Arduino version also keeps the clock right afterwards: the stack asks the server again by itself, by default about once an hour. The MicroPython version sets the time once.', 'Jerusalem is "IST-2IDT,M3.4.4/26,M10.5.0"; most places have a published TZ string.']
    },
    {
      title: 'Do something at 07:30 every day',
      about: 'Checks the local time once a second and runs the job once when it is 07:30. Remembering the day of the year stops it from running again in the same minute.',
      needs: 'The same board and network as the previous program.',
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] time zone [CET-1CEST,M3.5.0,M10.5.0/3] :: net
          set [last day v] to (-1)
        forever
          if <<(hour) = (7)> and <<(minute) = (30)> and <(day of year) ≠ (last day)>>> then
            set [last day v] to (day of year)
            print [good morning: do the job]
          end
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>

        int lastDay = -1;

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTzTime("CET-1CEST,M3.5.0,M10.5.0/3", "pool.ntp.org");
        }

        void loop() {
          struct tm t;
          if (getLocalTime(&t, 1000)) {
            if (t.tm_hour == 7 && t.tm_min == 30 && t.tm_yday != lastDay) {
              lastDay = t.tm_yday;                               // once per day
              Serial.println("good morning: do the job");
            }
          }
          delay(1000);
        }
      `,
      py: String.raw`
        import network, ntptime, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        ntptime.settime()

        OFFSET = 1 * 3600                                        # CET without daylight saving
        last_day = -1
        while True:
            t = time.localtime(time.time() + OFFSET)
            if t[3] == 7 and t[4] == 30 and t[7] != last_day:    # hour, minute, day of the year
                last_day = t[7]                                  # once per day
                print("good morning: do the job")
            time.sleep(1)
      `,
      notes: ['A device that sleeps through 07:30 misses the job. For a battery device, compute the seconds until the next 07:30 and sleep exactly that long ([[deep-sleep]]).']
    }
  ],
  quiz: [
    { q: 'An ESP is set to "CET-1CEST,M3.5.0,M10.5.0/3" and shows the time exactly two hours off. A likely cause?', choices: ['The time server is wrong', 'The sign of the offset was entered the usual way round, so it points west instead of east', 'The ESP was never synchronised', 'Daylight saving ended'], a: 1, why: 'In a POSIX TZ string the offset is written inverted: positive is west of Greenwich. CET-1 is one hour east. Writing CET+1 puts the clock two hours off, one for each direction.' },
    { q: 'The round trip took 40 ms but the way there took 30 ms and the way back 10 ms. By how much is the NTP offset wrong?', choices: ['0 ms', '10 ms', '20 ms', '40 ms'], a: 1, why: 'The formula treats both ways as equal, 20 ms each. The error is half the difference of the two paths: (30 − 10) ÷ 2 = 10 ms.' },
    { q: 'A MicroPython program sends time.time() to a server that expects Unix time. What is wrong?', choices: ['Nothing', 'The values are about 30 years too small, because the epoch on the ESP32 is 2000', 'The values are in milliseconds', 'time.time() needs a time zone'], a: 1, why: 'The ESP32 port counts seconds from 2000-01-01. Unix time counts from 1970, so the numbers differ by 946 684 800 seconds.' },
    { q: 'A battery logger runs for weeks in a field with no Wi-Fi. What keeps its timestamps trustworthy?', choices: ['The on-chip clock alone', 'A DS3231-type clock chip with a coin cell, read at start-up', 'A longer deep-sleep time', 'A faster CPU clock'], a: 1, why: 'The chip\'s RC-based clock drifts and is lost at power-off. A temperature-compensated clock chip holds the time to about a minute a year, with no network.' }
  ],
  applications: [
    'Timestamping logged data, so that readings from many devices can be put in order ([[esp-as-a-data-logger]]).',
    'Schedules: switching lights, irrigation or heating at fixed local times.',
    'Making TLS work, which needs the date to check certificates ([[https-and-tls]]).',
    'Aligning records from several boards, where the offset error of a few milliseconds is acceptable ([[time-sync-between-boards]]).'
  ],
  sources: [
    'IETF RFC 5905, *Network Time Protocol Version 4*, and RFC 4330, *Simple Network Time Protocol (SNTP) Version 4*.',
    'Arduino core for ESP32 documentation, the *SimpleTime* example; the POSIX specification of the TZ environment variable.',
    'MicroPython documentation, the *time* module and micropython-lib *ntptime*; Maxim (Analog Devices), *DS3231 datasheet*.'
  ],
  sim: 'ip-ntp'
},

/* ================================================================ webhooks, Telegram and e-mail */
{
  id: 'webhooks-and-notifications',
  parent: 'internet-protocols',
  title: 'Webhooks, Telegram and e-mail',
  level: 2,
  short: 'When the ESP only has to tell a person something, post a message to a service that already reaches their phone. It is one HTTPS request with a token, which makes the token a password and the number of messages something to control.',
  keywords: ['webhook', 'Telegram', 'bot', 'BotFather', 'sendMessage', 'notification', 'ntfy', 'Pushover', 'IFTTT', 'Slack', 'Discord', 'e-mail', 'SMTP', 'ESP Mail Client', 'alert', 'push notification', 'token', 'getUpdates', 'rate limit', '429'],
  prereq: ['http-client', 'https-and-tls'],
  related: ['rest-apis-and-json', 'credentials-handling', 'store-and-forward', 'mqtt', 'home-assistant-integration', 'project-doorbell-camera'],
  body: `Sometimes the ESP's whole job is to tell a person something: the washing has finished, the door was opened, the freezer is too warm. The cheapest way is not to build an app but to **post a message to a service that already reaches a phone**. Almost all of them accept an HTTPS request carrying a little JSON or text, and the address plus a secret token are the whole set-up.

### A webhook is an address that acts

A **webhook** is an address that does something when you send a request to it. Post to the address of a chat room and a message appears; post to an automation service and a spreadsheet row is added or a lamp changes. From the ESP it is the plain POST of [[http-client]], over HTTPS ([[https-and-tls]]), and nothing has to listen on the device. The simulation shows one such post and the answers it can get.

### The usual choices

| Service | How the ESP talks to it | Note |
|---|---|---|
| Telegram bot | POST to the bot's \`sendMessage\` method with a chat id and the text | token from BotFather; about one message a second per chat |
| Push services such as ntfy or Pushover | POST text to a topic, or with an app key | an ntfy topic name acts as its password |
| Chat webhooks (Slack, Discord, Teams) | POST JSON to a long secret address | the address *is* the secret |
| Automation hubs (IFTTT-style, Home Assistant webhooks) | POST to a trigger address | the rule lives in the service |
| E-mail | SMTP over TLS (port 465, or 587 with STARTTLS), via a library such as ESP Mail Client | many providers want an app password, not your own |
| SMS | the HTTPS interface of an SMS gateway | costs money per message |

### Getting messages in

An ESP behind NAT cannot receive a webhook from outside. To take commands from Telegram the device **polls**: it asks the \`getUpdates\` method every few seconds, or holds a request open for longer (long polling). For anything quicker or more private, MQTT is the better road ([[mqtt]]).

### The token is a password

Whoever holds a bot token or a webhook address can post as you: keep it out of shared code and repositories ([[credentials-handling]]), and replace it if it leaks. Send **wisely**. Notify when something *changes*, not for as long as it stays changed; add a cool-down; a flapping sensor that posts a hundred messages in a minute will be throttled (HTTP 429) or banned, and will drown the reader. And a message is not guaranteed: if the Wi-Fi is down the alert is lost, unless the device keeps it and sends it later ([[store-and-forward]]).

> [!key] A notification is one HTTPS POST to a service that reaches the phone. The token is a password, a message must be rationed with a change test and a cool-down, and an alert that matters needs a plan for the time the network is down.`,
  ideas: [
    'A webhook is an address that acts when it receives a request; notifying a phone is one HTTPS POST to it.',
    'Services differ in format but share the pattern: an address, a secret token and a small JSON or text body.',
    'A device behind NAT cannot receive a webhook; to read commands it polls the service.',
    'Send on change with a cool-down, keep the token out of shared code, and plan for the alert you could not send.'
  ],
  pitfalls: [
    'My bot token is only used by my device, so sharing the code is harmless — The token lets anyone act as the bot. Keep it out of repositories and screenshots, and revoke it with BotFather if it leaks.',
    'A notification arrives, or I see an error — A device that is offline simply does not send, and a service that is slow can hold your loop for seconds. Check the result, set a time-out, and keep unsent alerts for later.',
    'Notify whenever the condition is true — A door left open then sends a message every loop. Send on the change of state, add a cool-down, and expect limits: a service answers 429 when you send too fast.'
  ],
  terms: [
    { term: 'Webhook', also: ['incoming webhook', 'callback URL'], def: 'An address that triggers an action in another service when it receives an HTTP request, usually a POST with a small body. The address itself is often the secret.' },
    { term: 'Bot token', also: ['Telegram bot token', 'API token', 'BotFather'], def: 'The secret string that identifies a Telegram bot and lets whoever holds it send messages as the bot. It works like a password.' },
    { term: 'Long polling', also: ['getUpdates', 'polling'], def: 'Asking a service for news by holding a request open until something arrives or a time-out ends, then asking again. It is how a device behind NAT can receive messages.' },
    { term: 'SMTP', also: ['STARTTLS', 'app password'], def: 'The protocol for sending e-mail. A client logs in to its provider\'s server, over TLS from the start (port 465) or after STARTTLS (port 587).' },
    { term: 'Cool-down', also: ['rate limit', 'debounce of notifications'], def: 'A minimum time between two notifications, kept by the device, so that a flapping sensor cannot flood the service or the reader.' }
  ],
  choose: {
    good: ['A chat bot or a push service for personal alerts and status', 'E-mail when the message must reach people who do not use the chat service', 'MQTT to a hub when the same event should drive other devices too'],
    avoid: ['A token or webhook address in code that is shared or published', 'A notification on every pass of the loop', 'SMS or e-mail as the only way to learn that a critical device is down'],
    check: ['The service\'s rate limit and what it answers when you exceed it', 'What the device does when the post fails: drop, retry or keep', 'How a leaked token is revoked']
  },
  code: [
    {
      title: 'Tell Telegram when a button is pressed',
      about: 'Sends a Telegram message when the button is pressed, at most once a minute. The message goes out as a JSON POST over HTTPS, with the server\'s certificate checked, so the clock is set first.',
      needs: 'Any ESP32-family board with Wi-Fi and a push button; a Telegram bot token from BotFather and your chat id. Arduino core 3.3.12 or later for the certificate bundle. The token is a password: never leave it in shared code ([[credentials-handling]]).',
      libs: ['ArduinoJson'],
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (4) as [input with pull-up v]
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          set [last v] to (0)

        forever
          if <<(read pin (4)) = [LOW v]> and <((milliseconds since start) - (last)) > (60000)>> then
            set [last v] to (milliseconds since start)
            send Telegram message [The button was pressed] :: net
          end
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include <NetworkClientSecure.h>
        #include <HTTPClient.h>
        #include <ArduinoJson.h>

        // the list of public root certificates that is built into the core
        extern const uint8_t ca_bundle_start[] asm("_binary_x509_crt_bundle_start");
        extern const uint8_t ca_bundle_end[] asm("_binary_x509_crt_bundle_end");
        const char *TOKEN = "123456:your-bot-token";     // from BotFather: a password, keep it out of shared code
        const char *CHAT_ID = "your-chat-id";
        const int BUTTON = 4;                            // button to GND, internal pull-up
        uint32_t lastSent = 0;

        bool notify(const char *text) {
          NetworkClientSecure client;
          client.setCACertBundle(ca_bundle_start, ca_bundle_end - ca_bundle_start);   // check the server against the built-in roots
          HTTPClient http;
          String url = String("https://api.telegram.org/bot") + TOKEN + "/sendMessage";
          if (!http.begin(client, url)) return false;
          http.addHeader("Content-Type", "application/json");
          JsonDocument doc;
          doc["chat_id"] = CHAT_ID;
          doc["text"] = text;
          String body;
          serializeJson(doc, body);
          int code = http.POST(body);
          http.end();
          return code == HTTP_CODE_OK;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");              // the certificate check needs the date
          struct tm t;
          getLocalTime(&t, 10000);
        }

        void loop() {
          if (digitalRead(BUTTON) == LOW && (lastSent == 0 || millis() - lastSent > 60000)) {   // at most once a minute
            lastSent = millis();
            Serial.println(notify("The button was pressed") ? "sent" : "failed");
          }
        }
      `,
      py: String.raw`
        import network, requests, time
        from machine import Pin

        TOKEN = "123456:your-bot-token"                  # from BotFather: a password, keep it out of shared code
        CHAT_ID = "your-chat-id"
        button = Pin(4, Pin.IN, Pin.PULL_UP)             # button to GND, internal pull-up

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        def notify(text):
            try:
                r = requests.post("https://api.telegram.org/bot" + TOKEN + "/sendMessage",
                                  json={"chat_id": CHAT_ID, "text": text}, timeout=10)
                ok = r.status_code == 200
                r.close()
                return ok
            except OSError:
                return False

        last_sent = None
        while True:
            if button.value() == 0 and (last_sent is None or time.ticks_diff(time.ticks_ms(), last_sent) > 60000):
                last_sent = time.ticks_ms()               # at most once a minute
                print("sent" if notify("The button was pressed") else "failed")
            time.sleep_ms(50)
      `,
      output: `
        sent
      `,
      notes: ['MicroPython\'s requests module does not verify the server\'s certificate: the message is encrypted, but the server is not authenticated ([[https-and-tls]]).', 'To read commands sent to the bot, the program would ask the getUpdates method every few seconds; to be told at once, use MQTT instead.', 'A Telegram bot may send about one message a second to a chat; a button with a one-minute cool-down stays far below that.']
    }
  ],
  quiz: [
    { q: 'A door sensor posts a Telegram message on every pass of the loop while the door is open. What is wrong?', choices: ['Nothing: it keeps the reader informed', 'It sends the same alert hundreds of times and will be throttled; it should send on the change of state with a cool-down', 'Telegram cannot carry text', 'The token is too long'], a: 1, why: 'A condition that stays true should produce one message when it becomes true, plus a cool-down. Otherwise the service answers 429 and the reader is flooded.' },
    { q: 'Your bot token appears in a public repository. What should you do?', choices: ['Nothing, bots are harmless', 'Revoke it with BotFather and use a new one', 'Delete the repository only', 'Switch to HTTP'], a: 1, why: 'Anyone who read the token can act as your bot. Deleting the file does not help: the token is in the history and in copies. Revoke it, then keep the new one out of the code.' },
    { q: 'Why can an ESP at home not simply wait for a Telegram message to be pushed to it?', choices: ['Telegram has no push', 'Its address is private behind NAT, so the service cannot open a connection to it; it must ask', 'Messages are too large', 'The ESP has no clock'], a: 1, why: 'Connections from the internet do not reach a device behind NAT. The ESP polls with getUpdates (or uses a protocol such as MQTT, where it holds the connection).' },
    { q: 'The post to the service returns 429. What does it mean?', choices: ['The token is wrong', 'Too many requests: you were sending faster than the service allows', 'The chat does not exist', 'The server is down'], a: 1, why: '429 is "too many requests". The answer usually says how long to wait. A cool-down in the device prevents it.' }
  ],
  applications: [
    'A doorbell, a letterbox or a garage door that sends a message to a phone ([[project-doorbell-camera]]).',
    'Alarms from freezers, fridges, water-level and temperature sensors that must reach a person.',
    'A daily status message from a data logger, with the day\'s minimum and maximum.',
    'A push to a home-automation hub or an automation service that then acts on other devices.'
  ],
  sources: [
    'Telegram, *Bot API* documentation: the sendMessage and getUpdates methods and the limits on sending.',
    'Arduino core for ESP32 documentation, the *HTTPClient* and *NetworkClientSecure* libraries (core 3.3).',
    'The documentation of the notification service you use (ntfy, Pushover, Slack or Discord incoming webhooks); IETF RFC 6409 and RFC 8314 on e-mail submission over TLS.'
  ],
  sim: { id: 'ip-http', params: { preset: 'webhook' } }
},

/* ================================================================ CoAP, Modbus TCP and others */
{
  id: 'coap-and-other-protocols',
  parent: 'internet-protocols',
  title: 'CoAP, Modbus TCP and others',
  level: 3,
  short: 'HTTP and MQTT cover most of what an ESP says on a network, but machines speak others: CoAP, a small HTTP on UDP; Modbus TCP, the language of meters and inverters; and a crowd of older ones. You rarely choose a protocol; you meet it.',
  keywords: ['CoAP', 'Modbus TCP', 'libcoap', 'LwM2M', 'confirmable', 'observe', 'Syslog', 'Telnet', 'FTP', 'Art-Net', 'sACN', 'OSC', 'BACnet', 'KNX', 'SNMP', 'SSDP', 'holding register', 'MBAP', 'port 502', 'port 5683', 'eModbus'],
  prereq: ['sockets', 'http-client', 'mqtt'],
  related: ['modbus', 'mqtt-topics-qos-retain', 'udp-between-boards', 'thread', 'mdns', 'webhooks-and-notifications', 'rs-485'],
  body: `HTTP and MQTT cover most of what an ESP says on a network, but the world holds others, and some are simply what a particular machine speaks. This page maps the ones you may meet, with a program that speaks an industrial one without a library.

### CoAP: a small HTTP on UDP

The *Constrained Application Protocol* gives a tiny device the ideas of HTTP, addresses, GET, POST, PUT, DELETE and status codes, in a form that suits it: UDP on port 5683 (5684 with DTLS), a 4-byte header and replies such as 2.05 Content and 4.04 Not Found. UDP can lose messages, so a **confirmable** request is acknowledged and is sent again if no acknowledgement comes: first after two to three seconds, then at doubled intervals, up to four more times. A **non-confirmable** message is fire and forget. An *observe* option lets a client subscribe to a resource and be told when it changes. CoAP underlies LwM2M device management and turns up in constrained networks such as Thread ([[thread]]); on an ESP it comes as the libcoap component of ESP-IDF. The simulation sets its confirmable exchange beside MQTT's QoS.

### Modbus TCP

Industrial equipment, energy meters, solar inverters, heat pumps and controllers speak Modbus. Modbus TCP puts the old serial protocol ([[modbus]]) inside TCP on port 502. A request is a 7-byte header (a transaction number, the protocol number 0, a length, a unit number) followed by a function code and its data. Function 3 reads *holding registers*: 16-bit numbers, addressed from 0. The program below reads one. Libraries such as eModbus and modbus-esp8266 do the same with more care when you need many registers, writing, or a server of your own.

### A map of others

| Protocol | Carried by | What it is for |
|---|---|---|
| Syslog | UDP 514 | sending log lines to a log server |
| Telnet | TCP 23 | a plain-text remote console: never across the internet |
| FTP, TFTP | TCP 21, UDP 69 | file transfer, neither encrypted |
| SMTP | TCP 465, 587 | e-mail ([[webhooks-and-notifications]]) |
| Art-Net, sACN | UDP 6454, 5568 | stage lighting over Ethernet, often driven by ESPs |
| OSC | UDP | music and show-control messages |
| BACnet/IP, KNX/IP | UDP 47808, 3671 | building automation |
| mDNS, SSDP | UDP multicast | finding devices ([[mdns]]) |
| SNMP | UDP 161 | monitoring network equipment |

### Choosing

You seldom choose: the meter speaks Modbus, the lighting desk speaks Art-Net. Where you do choose, prefer a protocol with a maintained library for your chip, and one that either authenticates or runs inside TLS; most of the old ones in the table do neither, so keep them on a network you control.

> [!key] CoAP is a small HTTP on UDP with its own acknowledgement and retransmission; Modbus TCP is a simple register protocol on port 502 that meters and inverters speak; the rest are mostly plain-text, unauthenticated protocols for a trusted network. Use what the other end speaks, with a library that is maintained.`,
  ideas: [
    'CoAP offers GET, POST, PUT and DELETE with status codes over UDP, with confirmable messages that are resent until acknowledged.',
    'Modbus TCP wraps the serial Modbus request in a 7-byte header and sends it to port 502; function 3 reads holding registers.',
    'Most of the older protocols (Telnet, FTP, Syslog, Art-Net) are not encrypted or authenticated: keep them on a trusted network.',
    'The other end usually decides the protocol; choose a maintained library and add TLS where the protocol allows it.'
  ],
  pitfalls: [
    'CoAP is HTTP over UDP, so it is as reliable as HTTP — Only confirmable messages are acknowledged and resent; a non-confirmable one can simply vanish. Pick the type that your data needs.',
    'Modbus register 40001 is address 40001 in the request — The traditional numbers include a table prefix and start at 1. The request carries the offset from 0, so "40001" is address 0. Check what your device\'s manual means.',
    'A plain-text protocol is fine because it is only inside my network — Anyone who joins that network can read it and send commands. Keep such devices on their own network and never forward their ports.'
  ],
  terms: [
    { term: 'CoAP', also: ['Constrained Application Protocol'], def: 'A web-style request and response protocol for small devices, carried over UDP, with a 4-byte header and optional acknowledgement and resending.' },
    { term: 'Confirmable message', also: ['CON', 'NON', 'non-confirmable'], def: 'A CoAP message that must be acknowledged, and is sent again after a time-out if it is not. A non-confirmable message is sent once and forgotten.' },
    { term: 'Modbus TCP', also: ['MBAP', 'port 502'], def: 'The Modbus register protocol carried in TCP on port 502, with a 7-byte header in front of the function code and data of the serial form.' },
    { term: 'Holding register', also: ['Modbus register', 'function 3'], def: 'A 16-bit value in a Modbus device that can be read with function 3 and written with function 6 or 16. Devices publish a table of what each register holds.' },
    { term: 'LwM2M', also: ['Lightweight M2M'], def: 'A device-management protocol built on CoAP, used to configure, monitor and update constrained devices from a central server.' }
  ],
  choose: {
    good: ['Modbus TCP when the meter, inverter or controller speaks it', 'CoAP between constrained devices, or where a CoAP service already exists', 'A maintained library, once you have seen the protocol work by hand'],
    avoid: ['Telnet, FTP or plain Modbus across the internet', 'CoAP where an MQTT broker is already in place for everything else', 'Writing your own protocol when a standard one fits'],
    check: ['Whether the protocol has authentication or can run inside TLS or DTLS', 'The register map, byte order and scaling of a Modbus device, from its manual', 'Which port must be open, and to whom']
  },
  code: [
    {
      title: 'Read a Modbus TCP register by hand',
      about: 'Opens a connection to a Modbus TCP device on port 502, asks for one holding register (address 0, unit 1) with a 12-byte request and prints the 16-bit value. It shows that the protocol is a few bytes, with no library.',
      needs: 'Any ESP32-family board with Wi-Fi, and a Modbus TCP device on the network (here 192.168.1.50). Read its manual for which register holds what.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
        forever
          set [value v] to (Modbus TCP read holding register (0) from [192.168.1.50] port (502) unit (1)) :: bus
          print (join [register 0 = ] (value))
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *HOST = "192.168.1.50";                  // the Modbus TCP device
        const uint16_t PORT = 502;

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          NetworkClient client;
          if (client.connect(HOST, PORT, 3000)) {
            // transaction 1, protocol 0, 6 bytes follow, unit 1, function 3, start address 0, count 1
            const uint8_t request[12] = {0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x01, 0x03, 0x00, 0x00, 0x00, 0x01};
            client.write(request, sizeof(request));
            uint8_t reply[16];
            size_t n = client.readBytes(reply, 11);         // 7 header + function + byte count + 2 data bytes
            if (n == 11 && reply[7] == 0x03) {
              uint16_t value = (reply[9] << 8) | reply[10]; // big-endian
              Serial.printf("register 0 = %u\n", value);
            } else {
              Serial.println("bad or missing answer");      // an error reply has function 0x83 and only 9 bytes
            }
            client.stop();
          } else {
            Serial.println("no connection");
          }
          delay(5000);
        }
      `,
      py: String.raw`
        import network, socket, time

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        HOST = "192.168.1.50"                               # the Modbus TCP device
        PORT = 502
        # transaction 1, protocol 0, 6 bytes follow, unit 1, function 3, start address 0, count 1
        REQUEST = bytes([0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x01, 0x03, 0x00, 0x00, 0x00, 0x01])

        while True:
            try:
                s = socket.socket()
                s.settimeout(3)
                s.connect((HOST, PORT))
                s.send(REQUEST)
                reply = s.recv(16)                          # 11 bytes for one register
                s.close()
                if len(reply) == 11 and reply[7] == 0x03:
                    print("register 0 =", (reply[9] << 8) | reply[10])   # big-endian
                else:
                    print("bad or missing answer", reply)   # an error reply has function 0x83 and only 9 bytes
            except OSError as e:
                print("no connection", e)
            time.sleep(5)
      `,
      output: `
        register 0 = 2315
      `,
      notes: ['A real device may store a temperature in tenths or hundredths of a degree (2315 could mean 231.5 or 23.15), or use two registers for a 32-bit value: its manual says. Byte and word order differ between makers.', 'This is plain text and unauthenticated: use it only on a network you control.']
    }
  ],
  quiz: [
    { q: 'A CoAP confirmable request is sent and no acknowledgement arrives. What does the sender do?', choices: ['Gives up at once', 'Waits two to three seconds, then sends it again, with doubling gaps up to four more times', 'Switches to TCP', 'Sends it again immediately, as fast as possible'], a: 1, why: 'Confirmable messages are retransmitted with an exponential back-off: an initial time-out of two to three seconds, doubled each time, up to four retransmissions.' },
    { q: 'Which port does Modbus TCP use?', choices: ['80', '502', '1883', '5683'], a: 1, why: 'Modbus TCP is registered on port 502. 80 is HTTP, 1883 MQTT and 5683 CoAP.' },
    { q: 'A Modbus manual lists "register 40005". What address goes in the request?', choices: ['40005', '5', '4', '40004'], a: 2, why: 'The 4xxxx numbers mean holding registers counted from 1 in the manual. The request carries the offset from 0, so register 40005 is address 4. (Some devices number differently: check the manual.)' },
    { q: 'Telnet and FTP are fine to expose to the internet if the device password is strong.', a: false, why: 'Both send everything, passwords included, in plain text. Anybody on the path can read them. Keep them on a trusted network, or use a protocol with TLS or SSH.' }
  ],
  applications: [
    'Reading energy meters, solar inverters and heat pumps that expose Modbus TCP, and publishing the values to MQTT.',
    'Lighting rigs driven by Art-Net or sACN packets from a lighting desk, ending in LED strips on an ESP.',
    'Constrained sensor networks that use CoAP, such as Thread-based or LwM2M-managed devices.',
    'Sending logs to a Syslog server so a fleet\'s problems can be read in one place.'
  ],
  sources: [
    'IETF RFC 7252, *The Constrained Application Protocol (CoAP)*, and RFC 7641 on observing resources.',
    'Modbus Organization, *MODBUS Application Protocol Specification* and *MODBUS Messaging on TCP/IP Implementation Guide*.',
    'Espressif, *ESP-IDF Programming Guide*, the libcoap component; the documentation of eModbus.'
  ],
  sim: { id: 'ip-qos', params: { proto: 'coap' } }
},

/* ================================================================ finding network faults */
{
  id: 'network-troubleshooting',
  parent: 'internet-protocols',
  title: 'Finding network faults',
  level: 2,
  short: '"It does not work" on a network has the same cure as on a breadboard: find the layer where it stops. Test from the radio up — link, address, name, connection, encryption, request, answer — and the first test that fails is where the fault is.',
  keywords: ['network troubleshooting', 'ping', 'DNS', 'connection refused', 'timeout', 'curl', 'Wireshark', 'client isolation', 'captive portal', 'NAT', 'firewall', 'layer', 'diagnose', 'fault finding', 'HTTP error', 'TLS error', 'self-test', 'MQTT debugging', 'mosquitto_sub'],
  prereq: ['tcp-ip-on-a-microcontroller', 'sockets', 'http-client'],
  related: ['wifi-troubleshooting', 'ip-addresses-dhcp-dns', 'https-and-tls', 'mqtt', 'brownout', 'heap-and-fragmentation', 'fault-finding-method'],
  body: `"It does not work" on a network has the same cure as on a breadboard: find the layer where it stops. A request passes through a chain, namely the radio link, the address, the name lookup, the connection, the encryption, the request, the answer and your own program, and each link has a symptom of its own. Test from the bottom up, and the first test that fails is where the fault is. The simulation breaks each layer in turn.

### The ladder

| Step | Question | Test | A failure usually means |
|---|---|---|---|
| 1 Link | Is the Wi-Fi joined? | the status and the signal strength | wrong password, out of range, a 5 GHz-only network ([[wifi-troubleshooting]]) |
| 2 Address | Is there an IP address, in the right network? | print the address and the gateway | DHCP failing, a guest network, a clash with a fixed address |
| 3 Reach | Do the router and the ESP hear each other? | ping the gateway and the ESP from a computer | client isolation, a weak signal |
| 4 Name | Does the name resolve? | look it up; try the numeric address instead | no DNS server, a blocked one, a captive portal that answers every name |
| 5 Connect | Does a TCP connection open? | connect to the port | **refused**: the host is there and nothing listens; **timed out**: packets vanish (wrong address, firewall, host off) |
| 6 Secure | Does TLS succeed? | check the clock, the root, the name | "not yet valid": no time; "unknown CA"; name mismatch |
| 7 Request | Is the status 2xx? | read the code and the body | 401, 403, 404, 429 and 5xx say what the server thinks |
| 8 Data | Is the answer what you expected? | print it | the wrong topic, the wrong JSON field, a different unit |

### Tools

- The **serial monitor**, with the reason printed every time: the error text, the exception, the status code.
- A computer on the same network: ping both ways, a *curl* request to the ESP or to the server it calls and, for MQTT, a client subscribed to \`#\` on your own broker.
- The router's client list and log, and the log of the server or broker; a packet capture of your own network (Wireshark) when all else fails.

### Faults that look like something else

- **Works at the bench, not on site:** client isolation, a guest network, a firewall, a captive portal, another DNS server.
- **Works for a while, then stops:** a DHCP lease or NAT entry that timed out, a connection the router dropped silently, sockets never closed, a fragmented heap ([[heap-and-fragmentation]]).
- **Resets while sending:** a weak supply collapses when the radio transmits ([[brownout]]).
- **Nothing found on 5 GHz:** among the microcontrollers only the ESP32-C5 has a 5 GHz radio.

> [!key] Work up the ladder, link, address, reach, name, connect, secure, request and data, and stop at the first failure; print the reason at every step. Refused means a host answered "no", a time-out means silence, and "works at the bench but not on site" is nearly always the network, not the code.`,
  ideas: [
    'A network request passes through a chain of layers; test them bottom up and the first failing test locates the fault.',
    'Refused (a reply) and timed out (silence) are different faults: a host that says no, against packets that never arrive.',
    'Always print the reason for a failure: error text, exception or status code say which layer failed.',
    'Ping, curl, the router\'s client list and, for MQTT, a subscription to # on your own broker are the first tools.'
  ],
  pitfalls: [
    'If it works from my laptop it must work from the ESP — The laptop may use another network, DNS, certificate store or time. The ESP is a smaller client: it has no HTTP/2, only some roots, a clock that must be set, and 2.4 GHz.',
    'A time-out means the server is slow — A time-out on connecting usually means the packets are going nowhere: wrong address, a firewall that drops, a host that is off. Check the layer before the timing.',
    'Ping works, so the network is fine — Ping tests the address layer only. DNS, the port, the certificate and the request can all still fail.'
  ],
  terms: [
    { term: 'Connection refused', also: ['RST', 'ECONNREFUSED'], def: 'The error that means the target host answered, but nothing is listening on that port (or a firewall rejects it). It proves the address and the route work.' },
    { term: 'Time-out', also: ['timed out', 'ETIMEDOUT'], def: 'The error after waiting in silence for a reply. The packets, or the answers, are being dropped or have no route.' },
    { term: 'Ping', also: ['ICMP echo'], def: 'A small request that asks a host to answer, used to test whether an address can be reached at all. It says nothing about ports, names or encryption.' },
    { term: 'Client isolation', also: ['AP isolation', 'guest network'], def: 'A router setting that stops devices on the same Wi-Fi from talking to each other. A phone and an ESP are both online but cannot reach one another.' },
    { term: 'Packet capture', also: ['Wireshark', 'sniffing your own network'], def: 'Recording the packets that cross a network, on your own network and for your own devices, to see exactly what was sent and answered at every layer.' }
  ],
  choose: {
    good: ['Printing the reason for every failure at every step', 'Testing from the bottom up and stopping at the first failure', 'Reproducing the fault from a computer on the same network'],
    avoid: ['Changing the code before you know which layer fails', 'Capturing traffic on networks that are not yours', 'Disabling certificate checks "to see if it helps" and leaving it so'],
    check: ['Whether the fault is in the link, the address, the name, the port, the certificate or the data', 'What differs between the place it works and the place it does not', 'What the server or broker log says about the same moment']
  },
  code: [
    {
      title: 'A network self-test, one layer at a time',
      about: 'Walks up the ladder and stops at the first failure, saying which layer failed: the Wi-Fi link, the address, the name lookup, the TCP connection and a plain HTTP request. Run it on the network where the device does not work.',
      needs: 'Any ESP32-family board with Wi-Fi. example.com stands for the host your device really talks to. Do not leave the real name and password in shared code ([[credentials-handling]]).',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait up to (15) seconds for <Wi-Fi connected?>
          if <not <Wi-Fi connected?>> then
            print [1 LINK failed: not joined]
            stop [this script v]
          end
          print (join [1 LINK ok, signal ] (signal strength))
          print (join [2 ADDRESS ] (IP address))
          set [addr v] to (look up [example.com])
          if <(addr) = []> then
            print [3 NAME failed: cannot resolve]
            stop [this script v]
          end
          print (join [3 NAME ok: ] (addr))
          open TCP connection to (addr) port (80) :: net
          print (join [4 CONNECT ] (connection result)) :: net
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *HOST = "example.com";

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) delay(250);
          if (WiFi.status() != WL_CONNECTED) {
            Serial.printf("1 LINK    failed: not joined (status %d)\n", (int)WiFi.status());
            return;
          }
          Serial.printf("1 LINK    ok, signal %d dBm\n", WiFi.RSSI());

          if (WiFi.localIP() == IPAddress(0, 0, 0, 0)) {
            Serial.println("2 ADDRESS failed: no IP address");
            return;
          }
          Serial.printf("2 ADDRESS ok, %s via %s\n", WiFi.localIP().toString().c_str(), WiFi.gatewayIP().toString().c_str());

          IPAddress addr;
          if (!WiFi.hostByName(HOST, addr)) {
            Serial.printf("3 NAME    failed: cannot resolve %s\n", HOST);
            return;
          }
          Serial.printf("3 NAME    ok, %s is %s\n", HOST, addr.toString().c_str());

          NetworkClient client;
          if (!client.connect(addr, 80, 5000)) {
            Serial.println("4 CONNECT failed: refused or timed out");
            return;
          }
          Serial.println("4 CONNECT ok, port 80 is open");
          client.print("GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n");
          String status = client.readStringUntil('\n');            // the status line
          Serial.println("5 REQUEST " + status);
          client.stop();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, socket, time

        HOST = "example.com"

        def selftest():
            wlan = network.WLAN(network.WLAN.IF_STA)
            wlan.active(True)
            wlan.connect("your-ssid", "your-password")
            t0 = time.ticks_ms()
            while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 15000:
                time.sleep_ms(250)
            if not wlan.isconnected():
                print("1 LINK    failed: not joined, status", wlan.status())
                return
            print("1 LINK    ok, signal", wlan.status("rssi"), "dBm")

            ip, mask = wlan.ipconfig("addr4")
            if ip == "0.0.0.0":
                print("2 ADDRESS failed: no IP address")
                return
            print("2 ADDRESS ok,", ip, "via", wlan.ipconfig("gw4"))

            try:
                addr = socket.getaddrinfo(HOST, 80)[0][-1]
            except OSError:
                print("3 NAME    failed: cannot resolve", HOST)
                return
            print("3 NAME    ok,", HOST, "is", addr[0])

            s = socket.socket()
            s.settimeout(5)
            try:
                s.connect(addr)
            except OSError as e:
                print("4 CONNECT failed: refused or timed out", e)
                return
            print("4 CONNECT ok, port 80 is open")
            s.send(b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n")
            print("5 REQUEST", s.recv(64).split(b"\r\n")[0].decode())      # the status line
            s.close()

        selftest()
      `,
      output: `
        1 LINK    ok, signal -58 dBm
        2 ADDRESS ok, 192.168.1.57 via 192.168.1.1
        3 NAME    ok, example.com is 93.184.216.34
        4 CONNECT ok, port 80 is open
        5 REQUEST HTTP/1.1 200 OK
      `,
      notes: ['The Arduino error from a failed connect does not say whether it was refused or timed out; the time the call took does: a refusal comes back at once, a time-out takes the whole five seconds. MicroPython raises an OSError whose code tells them apart.', 'To test an HTTPS or MQTT server, add the matching step: check the clock, then the TLS handshake ([[https-and-tls]]).']
    }
  ],
  quiz: [
    { q: 'A connect to a server on your own network fails in 20 ms with "refused". What do you know?', choices: ['The server is off', 'The host is reachable, but nothing listens on that port (or a firewall rejects it)', 'The Wi-Fi is down', 'DNS failed'], a: 1, why: 'A quick refusal is an answer: the packet arrived and the machine said no. The address, the route and the link are fine; look at the port and the service.' },
    { q: 'The same connect hangs for 5 seconds and fails. What is the likeliest class of cause?', choices: ['The port has no listener', 'The packets are dropped on the way: wrong address, firewall, or the host is off', 'The JSON is wrong', 'The certificate is expired'], a: 1, why: 'Silence means nothing came back. A wrong address, a firewall that drops instead of rejecting, client isolation or a powered-down host all look like this.' },
    { q: 'Pinging the server from the ESP\'s network works, but the ESP\'s HTTPS call fails at once with a certificate error. Which step of the ladder is at fault?', choices: ['The link', 'The name lookup', 'The secure step: the clock, the root certificate or the name check', 'The data'], a: 2, why: 'Ping proves the address layer. A certificate error is raised in the TLS handshake: check the ESP\'s clock first, then the stored root, then the name in the URL.' },
    { q: 'A sensor works for hours and then stops posting until it is restarted. The Wi-Fi shows as connected. What would you check first?', choices: ['The antenna', 'Free heap and open sockets: a leak or fragmentation that slowly starves the network code', 'The password', 'The channel'], a: 1, why: 'A device that fails after some time with the link still up suggests a resource running out: sockets or HTTP objects never closed, or a heap eaten by fragmentation. Log the free heap.' }
  ],
  applications: [
    'Commissioning a device on a customer\'s network, where guest networks, filters and captive portals differ from your bench.',
    'Telling "my code is wrong" from "the network is blocking it" when a program that worked at home fails at the office.',
    'Fleet support: a one-line log of the ladder step that failed tells the service desk where to look ([[fault-finding-method]]).',
    'Writing the connection manager of a product, which must handle each failure differently.'
  ],
  sources: [
    'IETF RFC 792 (ICMP) and RFC 9293 (TCP) for the meaning of echo replies, resets and time-outs.',
    'Arduino core for ESP32 documentation, the *WiFi*, *NetworkClient* and *HTTPClient* libraries (core 3.3).',
    'MicroPython documentation, the *network* and *socket* modules (version 1.29); the Wireshark user\'s guide.'
  ],
  sim: { id: 'ip-layers', params: { mode: 'faults' } }
}
);
